import { test, expect } from '@playwright/test';
import { createGame } from '../src/lib/game/risk-engine';
import type { RiskGameState } from '../src/lib/game/risk-engine';

/**
 * Risk 42 2nd-screen TV view + scorer cast button + TvStage viewport fill.
 * Rides the shared conquest_games store: { game, players } jsonb, uuid = access key.
 */

const P = [
	{ id: 'e2e-a', name: 'E2E Ada' },
	{ id: 'e2e-b', name: 'E2E Ben' }
];

test.describe('TV view — risk', () => {
	test('renders, updates within 2s, freezes on winner, fills the viewport', async ({ page, request }) => {
		const game = createGame(['e2e-a', 'e2e-b'], { mode: 'domination', seed: 42 });
		const created = await request.post('/api/conquest', {
			data: { state: { game, players: P } }
		});
		expect(created.status()).toBe(200);
		const { id } = await created.json();

		await page.goto(`/match/risk/${id}/tv`);

		await expect(page.getByText('E2E Ada', { exact: true }).first()).toBeVisible({ timeout: 10_000 });
		await expect(page.getByText('E2E Ben').first()).toBeVisible();
		await expect(page.getByText('E2E Ada gooit')).toBeVisible();

		// TvStage canvas keeps its 16:9 design ratio (circles stay circles — no
		// oval stretch), fits the viewport, and is centered; the letterbox bars
		// blend into the shared bg-zinc-950.
		const stage = page.locator('div[style*="scale"]');
		const stageBox = await stage.boundingBox();
		const view = await page.evaluate(() => ({
			w: document.documentElement.clientWidth,
			h: document.documentElement.clientHeight
		}));
		expect(Math.abs(stageBox!.width / stageBox!.height - 16 / 9)).toBeLessThan(0.01);
		expect(stageBox!.width).toBeLessThanOrEqual(view.w + 2);
		expect(stageBox!.height).toBeLessThanOrEqual(view.h + 2);
		expect(Math.abs(stageBox!.width - view.w)).toBeLessThan(2); // fills the limiting axis
		expect(Math.abs(stageBox!.x + stageBox!.width / 2 - view.w / 2)).toBeLessThan(2);
		expect(Math.abs(stageBox!.y + stageBox!.height / 2 - view.h / 2)).toBeLessThan(2);

		// server state advances → TV follows within 2s (turn passes to Ben)
		const next: RiskGameState = JSON.parse(JSON.stringify(game));
		next.turn = { ...next.turn, playerId: 'e2e-b' };
		await request.patch(`/api/conquest/${id}`, { data: { state: { game: next, players: P } } });
		await expect(page.getByText('E2E Ben gooit')).toBeVisible({ timeout: 2_000 });

		// game finishes → frozen champion card, polling stops
		next.winner = 'e2e-b';
		next.tie = null;
		await request.patch(`/api/conquest/${id}`, { data: { state: { game: next, players: P } } });
		await expect(page.getByText('Kampioen')).toBeVisible({ timeout: 5_000 });
		await expect(page.getByText('LIVE', { exact: true })).toBeHidden();

		let polled = 0;
		page.on('request', (r) => {
			if (r.url().includes(`/api/conquest/${id}`)) polled++;
		});
		await page.waitForTimeout(2_500);
		expect(polled).toBe(0);
	});
});

test.describe('Risk 42 scorer cast button', () => {
	test('scorer shows cast button once the game is server-backed and opens the TV tab', async ({ page, context }) => {
		const email = `e2e+risktv+${Date.now()}@example.com`;
		await page.addInitScript(
			(e) => window.localStorage.setItem('darts_email', e),
			email
		);
		await page.addInitScript((setup) => {
			window.sessionStorage.setItem('risk42_setup', JSON.stringify(setup));
		}, { mode: 'domination', players: P });
		const created = page.waitForResponse(
			(r) => r.url().endsWith('/api/conquest') && r.request().method() === 'POST'
		);
		await page.goto('/match/risk');
		await created;

		const popup = page.waitForEvent('popup');
		await page.getByRole('button', { name: 'Open TV-weergave in nieuw tabblad' }).click();
		const tv = await popup;
		await expect(tv).toHaveURL(/\/match\/risk\/[a-z0-9-]+\/tv$/);
		await expect(tv.getByText('LIVE', { exact: true })).toBeVisible({ timeout: 10_000 });
	});
});
