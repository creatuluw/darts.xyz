import { test, expect, type Page, type APIRequestContext, type Locator } from '@playwright/test';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { uniqueEmail, createPlayer, createMatch, archivePlayer } from '../helpers';
import {
	calculateDartScore,
	detectBust,
	detectCheckout,
	getRemainingScore,
} from '../../src/lib/game/scoring';
import type { Multiplier } from '../../src/lib/game/types';

/**
 * Turn edit/delete scoring gauntlet.
 *
 * Data-driven from `e2e/gauntlet/games.json` — a HAND-SCORED chalkboard that
 * MUST NEVER be modified. Every step carries exact per-player remaining
 * scores, the next thrower and the leg dart count. After every step the
 * runner captures three independent views of state and compares them:
 *
 *   (a) UI DOM      — per-player remaining (AnimatedNumber, polled until
 *                     stable ~300ms), active thrower (emerald panel), the
 *                     per-panel "Darts" counters summed to leg darts.
 *   (b) API         — GET /api/matches/:id (status, winnerId) and
 *                     GET /api/matches/:id/turns (per-turn remainingScore,
 *                     dartsThrown, isBust).
 *   (c) ENGINE      — replay of the effective turn list (throws + applied
 *                     edits/deletes) through the app's OWN pure scoring
 *                     modules in src/lib/game/scoring.ts — no re-implemented
 *                     arithmetic here.
 *
 * If a game fails, the app is wrong (or this runner is) — the chalkboard is
 * never edited. Failures are frozen into per-game JSON reports under
 * e2e/gauntlet/reports/<GID>.json.
 */

const STARTING_SCORE = 301;

interface ChalkStep {
	type: 'throw' | 'edit' | 'editBlocked' | 'delete';
	player?: number;
	darts?: number[][]; // [segment, multiplier]; Miss = [0,1]
	bust?: boolean;
	bustDart?: number; // bust fires before dart 3 — runner enters only darts up to this dart
	checkout?: boolean;
	expect: {
		remaining: number[];
		next: number;
		legDarts: number;
		matchOver?: boolean;
		winner?: number;
		note?: string;
	};
}

interface ChalkGame {
	id: string;
	playerCount: number;
	players: string[];
	steps: ChalkStep[];
}

const chalkboard = JSON.parse(
	readFileSync(path.join(process.cwd(), 'e2e', 'gauntlet', 'games.json'), 'utf8'),
) as { games: ChalkGame[] };

const REPORTS_DIR = path.join(process.cwd(), 'e2e', 'gauntlet', 'reports');
mkdirSync(REPORTS_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Engine replay — the app's own scoring math, replayed from scratch over the
// effective (post-edit/delete) turn list. Ground truth for the math axis.
// ---------------------------------------------------------------------------

interface EngineTurn {
	playerId: string;
	dartsThrown: number;
	/** Exactly 3 slots; unthrown/miss slots carry segment 0 multiplier 0. */
	slots: Array<{ segment: number; multiplier: number }>;
}

function replayEngine(effective: EngineTurn[], playerIds: string[]) {
	const remaining = playerIds.map(() => STARTING_SCORE);
	const perTurnRemaining: number[] = [];
	const perTurnBust: boolean[] = [];
	let legDarts = 0;
	let next = 0;
	let checkoutSeen = false;
	for (const t of effective) {
		const pIdx = playerIds.indexOf(t.playerId);
		const thrown = t.slots.slice(0, Math.max(1, t.dartsThrown));
		const turnScore = thrown.reduce(
			(s, d) => s + calculateDartScore(d.segment, d.multiplier as Multiplier),
			0,
		);
		const lastMult = (thrown[thrown.length - 1]?.multiplier ?? 0) as Multiplier;
		const prev = remaining[pIdx];
		const isBust = detectBust(prev, turnScore, lastMult, thrown.length);
		const isCheckout = detectCheckout(prev, turnScore, lastMult);
		remaining[pIdx] = getRemainingScore(prev, turnScore, isBust);
		perTurnRemaining.push(remaining[pIdx]);
		perTurnBust.push(isBust);
		legDarts += t.dartsThrown;
		// A checkout ends the leg: no next thrower (chalkboard pins `next` to
		// the winner's index). Otherwise rotation continues.
		next = isCheckout ? pIdx : (pIdx + 1) % playerIds.length;
		checkoutSeen = checkoutSeen || isCheckout;
	}
	return { remaining, next, legDarts, perTurnRemaining, perTurnBust, checkoutSeen };
}

// ---------------------------------------------------------------------------
// UI readers
// ---------------------------------------------------------------------------

type UiPanel = { remaining: number; active: boolean; darts: number } | null;

/**
 * Read every player panel from the live DOM. Panel root = the innermost
 * div.space-y-3 containing the player name (case-sensitive word-boundary
 * match — Playwright's string hasText is case-insensitive, which would
 * collide e.g. "Ann" ⊂ "Hanna").
 * Active thrower: the big score div carries an emerald class only when
 * isActive. Leg darts: the per-panel "Darts N" counter (leg-scoped in
 * condensed 3+ mode, match-scoped in 1–2 player mode — identical here since
 * every game is 1 leg × 1 set).
 */
async function readUiPanels(page: Page, names: string[]): Promise<UiPanel[]> {
	return page.evaluate((names) => {
		const out: Array<{ remaining: number; active: boolean; darts: number } | null> = [];
		for (const name of names as string[]) {
			const rx = new RegExp(`\\b${name}\\b`);
			const containers = Array.from(document.querySelectorAll('div.space-y-3')).filter((el) =>
				rx.test(el.textContent || ''),
			);
			const root = containers[containers.length - 1] as HTMLElement | undefined;
			if (!root) {
				out.push(null);
				continue;
			}
			const scoreEl = root.querySelector('div.font-display.font-black');
			const dartsSpan = Array.from(root.querySelectorAll('span')).find((s) =>
				/^Darts/.test((s.textContent || '').trim()),
			);
			const remaining = scoreEl ? parseInt((scoreEl.textContent || '').trim(), 10) : NaN;
			const darts = dartsSpan
				? parseInt((dartsSpan.textContent || '').replace(/[^0-9]/g, ''), 10)
				: NaN;
			out.push({
				remaining,
				active: !!scoreEl && scoreEl.className.includes('emerald'),
				darts,
			});
		}
		return out;
	}, names);
}

/** Poll the panels until the rendered text stabilizes (~300ms), AnimatedNumber-safe. */
async function readUiStateStable(page: Page, names: string[]): Promise<UiPanel[]> {
	let last = '';
	let stable = 0;
	const deadline = Date.now() + 8000;
	while (Date.now() < deadline) {
		const panels = await readUiPanels(page, names);
		const key = JSON.stringify(panels);
		const clean = !key.includes('null') && !key.includes('NaN');
		stable = key === last && clean ? stable + 1 : 0;
		last = key;
		if (stable >= 2) return panels; // stable across ~500ms of polling
		await page.waitForTimeout(250);
	}
	try {
		return JSON.parse(last);
	} catch {
		return names.map(() => null);
	}
}

function summarizeUi(panels: UiPanel[]) {
	const ok = panels.every((p) => p && Number.isFinite(p.remaining) && Number.isFinite(p.darts));
	return {
		remaining: panels.map((p) => (p && Number.isFinite(p.remaining) ? p.remaining : null)),
		next: panels.findIndex((p) => p?.active),
		legDarts: panels.reduce((s, p) => s + (p && Number.isFinite(p.darts) ? p.darts : 0), 0),
		readError: ok ? undefined : 'panel read failed (null/NaN)',
	};
}

// ---------------------------------------------------------------------------
// User-action helpers (each real click goes through `act` so the click path
// of one edit / one delete can be counted for the simplicity audit)
// ---------------------------------------------------------------------------

class ActionLog {
	list: string[] = [];
	async click(label: string, locator: Locator) {
		this.list.push(label);
		try {
			await locator.click({ timeout: 6000 });
		} catch {
			// Known gotcha (wiki: "Neo ref-clicks silently no-op / actionability
			// stalls on some SvelteKit buttons"): fall back to a DOM click via
			// evaluate — bypasses the hit-target/scroll machinery but still fires
			// the button's onclick handler like a real user click.
			await locator.evaluate((el) => (el as HTMLElement).click());
		}
	}
	snapshot(from: number) {
		return { actions: this.list.slice(from), count: this.list.length - from };
	}
}

function panelOf(page: Page, name: string): Locator {
	// Word-boundary regex: hasText strings are case-insensitive in Playwright.
	return page
		.locator('div.space-y-3')
		.filter({ hasText: new RegExp(`\\b${name}\\b`) })
		.last();
}

async function enterDartsNumpad(
	page: Page,
	act: ActionLog,
	scope: Locator,
	darts: number[][],
	prefix = '',
) {
	for (const [seg, mult] of darts) {
		if (seg === 0) {
			await act.click(`Miss${prefix}`, scope.getByRole('button', { name: 'Miss', exact: true }));
			continue;
		}
		// The multiplier selection persists across turns — always set it
		// explicitly per dart; number buttons relabel (T20/D20/20).
		const multName = mult === 3 ? 'Triple' : mult === 2 ? 'Double' : 'Single';
		await act.click(`${multName}${prefix}`, scope.getByRole('button', { name: multName, exact: true }));
		const label = `${mult === 3 ? 'T' : mult === 2 ? 'D' : ''}${seg}`;
		await act.click(`${label}${prefix}`, scope.getByRole('button', { name: label, exact: true }));
	}
}

async function submitTurn(page: Page, act: ActionLog, dartCount: number) {
	await act.click(
		`Submit (${dartCount})`,
		page.getByRole('button', { name: new RegExp(`^Submit \\(${dartCount}\\)$`) }),
	);
}

async function openEditDialog(page: Page, act: ActionLog, panel: Locator) {
	await act.click(
		'pencil (edit last turn)',
		panel.locator('button[class*="hover:text-blue-500"]').first(),
	);
	const dialog = page.locator('div[role="dialog"][aria-label="Edit turn"]');
	await dialog.waitFor({ state: 'visible', timeout: 6000 });
	return dialog;
}

async function clearEditSlots(page: Page, act: ActionLog, dialog: Locator) {
	// Persisted rows drop miss darts, so the dialog pre-fills fewer slots —
	// clear everything and re-enter all slots from scratch.
	for (let i = 0; i < 3; i++) {
		const remove = dialog.getByRole('button', { name: 'Remove dart' });
		if ((await remove.count()) === 0) break;
		await act.click('Remove dart ×', remove.first());
	}
}

async function performEdit(
	page: Page,
	act: ActionLog,
	panel: Locator,
	darts: number[][],
): Promise<{ saved: boolean }> {
	const dialog = await openEditDialog(page, act, panel);
	await clearEditSlots(page, act, dialog);
	await enterDartsNumpad(page, act, dialog, darts, ' (dialog)');
	await act.click('Save turn', dialog.getByRole('button', { name: 'Save turn' }));
	try {
		await dialog.waitFor({ state: 'hidden', timeout: 8000 });
		return { saved: true };
	} catch {
		return { saved: false }; // stayed open — server rejected or error shown
	}
}

async function attemptBlockedEdit(
	page: Page,
	act: ActionLog,
	panel: Locator,
	darts: number[][],
): Promise<{ saveDisabled: boolean; warningShown: boolean }> {
	const dialog = await openEditDialog(page, act, panel);
	await clearEditSlots(page, act, dialog);
	await enterDartsNumpad(page, act, dialog, darts, ' (dialog)');
	await page.waitForTimeout(400); // let the outcome preview render
	const save = dialog.getByRole('button', { name: 'Save turn' });
	const saveDisabled = await save.isDisabled();
	const warningShown = await dialog
		.getByText('This edit would finish the leg')
		.isVisible()
		.catch(() => false);
	// Do NOT save — the app must reject this edit outright.
	await act.click('Cancel', dialog.getByRole('button', { name: 'Cancel' }));
	await dialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
	return { saveDisabled, warningShown };
}

async function performDelete(page: Page, act: ActionLog, panel: Locator) {
	await act.click(
		'trash (delete last turn)',
		panel.locator('button[class*="hover:text-red-500"]').first(),
	);
	await act.click('Delete (confirm)', panel.getByText('Delete', { exact: true }).first());
}

// ---------------------------------------------------------------------------
// API captures
// ---------------------------------------------------------------------------

interface ApiTurnRow {
	playerIdx: number;
	remainingScore: number;
	dartsThrown: number;
	isBust: boolean;
	totalScore: number;
}

async function fetchTurns(request: APIRequestContext, matchId: string): Promise<any[]> {
	const res = await request.get(`/api/matches/${matchId}/turns`);
	return res.json();
}

async function fetchApiState(request: APIRequestContext, matchId: string, playerIds: string[]) {
	const matchRes = await request.get(`/api/matches/${matchId}`);
	const matchData = await matchRes.json();
	const turns: any[] = await fetchTurns(request, matchId);
	const rows: ApiTurnRow[] = turns.map((t) => ({
		playerIdx: playerIds.indexOf(t.playerId),
		remainingScore: t.remainingScore,
		dartsThrown: t.dartsThrown,
		isBust: t.isBust,
		totalScore: t.totalScore,
	}));
	return {
		status: matchData.match.status as string,
		winnerIdx: matchData.match.winnerId
			? playerIds.indexOf(matchData.match.winnerId)
			: null,
		turnCount: rows.length,
		turns: rows,
	};
}

/** Poll until the persisted turn count reaches `wantCount` (or timeout). */
async function settleTurnCount(
	request: APIRequestContext,
	matchId: string,
	wantCount: number,
	timeoutMs = 10000,
): Promise<boolean> {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		const turns = await fetchTurns(request, matchId);
		if (turns.length === wantCount) return true;
		await new Promise((r) => setTimeout(r, 300));
	}
	return false;
}

// ---------------------------------------------------------------------------
// The gauntlet
// ---------------------------------------------------------------------------

interface StepReport {
	index: number;
	type: string;
	player: number | null;
	darts: number[][] | null;
	enteredDarts: number[][] | null;
	chalkboard: ChalkStep['expect'];
	ui: Record<string, unknown>;
	api: Record<string, unknown>;
	engine: Record<string, unknown>;
	mismatches: string[];
	stepPass: boolean;
}

for (const game of chalkboard.games) {
	test(`gauntlet ${game.id}: ${game.playerCount} players — turn edit/delete scoring`, async ({
		page,
		request,
	}) => {
		test.setTimeout(300_000);
		const playerIds: string[] = [];
		const email = uniqueEmail();
		const consoleErrors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') consoleErrors.push(`console.error: ${msg.text()}`);
		});
		page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));

		const act = new ActionLog();
		let editClickPath: { actions: string[]; count: number } | null = null;
		let deleteClickPath: { actions: string[]; count: number } | null = null;
		const steps: StepReport[] = [];
		const effective: EngineTurn[] = [];
		let matchId = '';
		let gamePass = false;

		try {
			// --- Setup through the API helpers (players + match) ---
			for (const name of game.players) {
				playerIds.push((await createPlayer(request, email, name)).id);
			}
			const fixture = await createMatch(request, email, playerIds, {
				startingScore: STARTING_SCORE,
				legsPerSet: 1,
				setsPerMatch: 1,
			});
			matchId = fixture.match.id;

			// --- Open the real UI: seed darts_email (RAW string) + numpad mode ---
			await page.addInitScript(
				({ acct }) => {
					window.localStorage.setItem('darts_email', acct);
					window.localStorage.setItem('inputMode', 'numpad');
				},
				{ acct: email },
			);
			await page.goto(`/match/${matchId}`);
			await expect(page.getByRole('button', { name: 'Triple', exact: true })).toBeVisible();
			await expect(panelOf(page, game.players[0])).toBeVisible();

			for (let si = 0; si < game.steps.length; si++) {
				const step = game.steps[si];
				const mismatches: string[] = [];
				const chalk = step.expect;
				const actionMark = act.list.length;
				const entered =
					step.type === 'throw'
						? step.darts!.slice(0, step.bustDart ?? 3)
						: step.type === 'delete'
							? null
							: step.darts!;

				// ---- Perform the step through the real UI ----
				if (step.type === 'throw') {
					const prePanels = await readUiStateStable(page, game.players);
					const preNext = prePanels.findIndex((p) => p?.active);
					if (preNext !== step.player) {
						mismatches.push(
							`app current thrower (${preNext}) != chalk step player (${step.player}) before entering darts`,
						);
					}
					const panel = panelOf(page, game.players[step.player!]);
					await enterDartsNumpad(page, act, page.locator('body'), entered!, '');
					await submitTurn(page, act, entered!.length);

					const wantCount = effective.length + 1;
					const settled = await settleTurnCount(request, matchId, wantCount);
					if (!settled)
						mismatches.push(`API turn count never reached ${wantCount} after throw`);
					effective.push({
						playerId: playerIds[step.player!],
						dartsThrown: entered!.length,
						slots: [
							...(entered ?? []).map(([segment, multiplier]) => ({ segment, multiplier })),
							{ segment: 0, multiplier: 0 },
							{ segment: 0, multiplier: 0 },
							{ segment: 0, multiplier: 0 },
						].slice(0, 3),
					});
				} else if (step.type === 'edit') {
					const panel = panelOf(page, game.players[step.player!]);
					const result = await performEdit(page, act, panel, entered!);
					if (!result.saved) mismatches.push('edit dialog did not close on save (rejected?)');
					// loadMatch rebuilds UI from persisted turns — wait for stability
					await readUiStateStable(page, game.players);
					// Replace the last effective turn with the edited darts
					effective[effective.length - 1] = {
						playerId: playerIds[step.player!],
						dartsThrown: entered!.length,
						slots: [
							...(entered ?? []).map(([segment, multiplier]) => ({ segment, multiplier })),
							{ segment: 0, multiplier: 0 },
							{ segment: 0, multiplier: 0 },
							{ segment: 0, multiplier: 0 },
						].slice(0, 3),
					};
					if (!editClickPath)
						editClickPath = act.snapshot(actionMark);
				} else if (step.type === 'editBlocked') {
					const panel = panelOf(page, game.players[step.player!]);
					const blocked = await attemptBlockedEdit(page, act, panel, entered!);
					if (!blocked.saveDisabled)
						mismatches.push('blocked edit: Save button was NOT disabled');
					if (!blocked.warningShown)
						mismatches.push('blocked edit: checkout warning NOT shown');
					if (!editClickPath)
						editClickPath = act.snapshot(actionMark);
				} else if (step.type === 'delete') {
					// Delete always removes the CURRENT last turn of the leg.
					const lastOwnerIdx = playerIds.indexOf(
						effective[effective.length - 1]?.playerId ?? playerIds[0],
					);
					const panel = panelOf(page, game.players[lastOwnerIdx]);
					await performDelete(page, act, panel);
					const wantCount = effective.length - 1;
					const settled = await settleTurnCount(request, matchId, wantCount);
					if (!settled)
						mismatches.push(`API turn count never fell to ${wantCount} after delete`);
					effective.pop();
					if (!deleteClickPath)
						deleteClickPath = act.snapshot(actionMark);
				}

				// ---- Capture the three views of state ----
				const engine = replayEngine(effective, playerIds);

				let uiPanels: UiPanel[];
				if (chalk.matchOver) {
					// Match end: page redirects to /history ~2s after checkout —
					// capture the DOM fast, then verify the winner overlay.
					await page.waitForTimeout(500);
					uiPanels = await readUiPanels(page, game.players);
				} else {
					uiPanels = await readUiStateStable(page, game.players);
				}
				const ui = summarizeUi(uiPanels);

				const api = await fetchApiState(request, matchId, playerIds);

				// Winner overlay evidence
				let overlaySeen = false;
				if (chalk.matchOver) {
					overlaySeen = await page
						.getByText('Match complete')
						.isVisible()
						.catch(() => false);
					const winnerName = chalk.winner != null ? game.players[chalk.winner] : '';
					const winnerOverlaySeen = winnerName
						? await page
								.getByText(`${winnerName} wins!`)
								.isVisible()
								.catch(() => false)
						: false;
					if (!overlaySeen) mismatches.push('expected match-over overlay ("Match complete") not shown');
					if (!winnerOverlaySeen)
						mismatches.push(`expected winner overlay ("${winnerName} wins!") not shown`);
				}

				// ---- Compare against the chalkboard + cross-axis ----
				chalk.remaining.forEach((want, i) => {
					if (ui.remaining[i] !== want)
						mismatches.push(
							`UI remaining[${i}] (${game.players[i]}): UI=${ui.remaining[i]} chalkboard=${want}`,
						);
					if (engine.remaining[i] !== want)
						mismatches.push(
							`ENGINE remaining[${i}] (${game.players[i]}): engine=${engine.remaining[i]} chalkboard=${want}`,
						);
				});
				if (ui.next !== chalk.next) mismatches.push(`UI next thrower: UI=${ui.next} chalkboard=${chalk.next}`);
				if (engine.next !== chalk.next)
					mismatches.push(`ENGINE next thrower: engine=${engine.next} chalkboard=${chalk.next}`);
				if (ui.legDarts !== chalk.legDarts)
					mismatches.push(`UI legDarts: UI=${ui.legDarts} chalkboard=${chalk.legDarts}`);
				if (engine.legDarts !== chalk.legDarts)
					mismatches.push(`ENGINE legDarts: engine=${engine.legDarts} chalkboard=${chalk.legDarts}`);
				if (api.turnCount !== effective.length)
					mismatches.push(`API turn count: API=${api.turnCount} engine effective=${effective.length}`);
				api.turns.forEach((row, i) => {
					const eng = engine.perTurnRemaining[i];
					if (row.remainingScore !== eng)
						mismatches.push(
							`API turn[${i}] remainingScore=${row.remainingScore} != ENGINE replay=${eng}`,
						);
					if (row.playerIdx !== playerIds.indexOf(effective[i]?.playerId ?? ''))
						mismatches.push(
							`API turn[${i}] playerIdx=${row.playerIdx} != expected ${playerIds.indexOf(effective[i]?.playerId ?? '')}`,
						);
				});
				if (chalk.matchOver) {
					if (api.status !== 'completed')
						mismatches.push(`API match status: API=${api.status} chalkboard=completed`);
					if (api.winnerIdx !== chalk.winner)
						mismatches.push(`API winnerIdx: API=${api.winnerIdx} chalkboard=${chalk.winner}`);
				}

				steps.push({
					index: si,
					type: step.type,
					player: step.player ?? null,
					darts: step.darts ?? null,
					enteredDarts: entered,
					chalkboard: chalk,
					ui: { ...ui, overlaySeen: chalk.matchOver ? overlaySeen : undefined },
					api: { status: api.status, winnerIdx: api.winnerIdx, turnCount: api.turnCount, turns: api.turns },
					engine: {
						remaining: engine.remaining,
						next: engine.next,
						legDarts: engine.legDarts,
						perTurnRemaining: engine.perTurnRemaining,
						perTurnBust: engine.perTurnBust,
					},
					mismatches,
					stepPass: mismatches.length === 0,
				});
			}

			gamePass = steps.every((s) => s.stepPass) && consoleErrors.length === 0;
		} catch (err) {
			// Infrastructure/runner failure — still write a report.
			steps.push({
				index: steps.length,
				type: 'runner-error',
				player: null,
				darts: null,
				enteredDarts: null,
				chalkboard: { remaining: [], next: -1, legDarts: -1 },
				ui: {},
				api: {},
				engine: {},
				mismatches: [`runner error: ${String(err)}`],
				stepPass: false,
			});
			gamePass = false;
		} finally {
			// Cleanup: abandon a still-running match, archive the players.
			try {
				if (matchId) {
					const st = await fetchApiState(request, matchId, playerIds);
					if (st.status === 'in_progress') {
						await request.patch(`/api/matches/${matchId}`, {
							data: { status: 'abandoned' },
						});
					}
				}
			} catch {
				/* cleanup best-effort */
			}
			for (const id of playerIds) {
				await archivePlayer(request, id).catch(() => {});
			}

			const report = {
				game: game.id,
				playerCount: game.playerCount,
				players: game.players,
				pass: gamePass,
				consoleErrors,
				editClickPath,
				deleteClickPath,
				steps,
			};
			writeFileSync(
				path.join(REPORTS_DIR, `${game.id}.json`),
				JSON.stringify(report, null, 2),
			);
			console.log(
				`[gauntlet ${game.id}] ${gamePass ? 'PASS' : 'FAIL'} — steps ${steps.map((s) => `${s.index}:${s.stepPass ? '✓' : '✗'}`).join(' ')} consoleErrors=${consoleErrors.length}`,
			);
		}

		// Playwright-level assertion AFTER the report is written — a failing
		// game shows up red in the test run but every other game still runs.
		const failed = steps.filter((s) => !s.stepPass);
		expect(
			gamePass,
			`[gauntlet ${game.id}] failed steps: ${failed.map((s) => `#${s.index}(${s.type})`).join(', ') || '-'}; consoleErrors: ${consoleErrors.length}`,
		).toBe(true);
	});
}
