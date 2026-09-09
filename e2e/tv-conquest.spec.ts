import { test, expect } from '@playwright/test';
import { createConquestMatch, applyDart } from '../src/lib/game/conquest-engine';
import type { ConquestState } from '../src/lib/game/conquest-engine';

/**
 * Conquest 2nd-screen TV view: renders the board/scoreboard, follows server
 * state within ~2s, freezes on a finished game.
 */
const P = [
	{ id: 'a', name: 'Ada TV' },
	{ id: 'b', name: 'Ben TV' }
];

test.describe('TV view — conquest', () => {
	test('renders, updates within 2s, freezes on winner', async ({ page, request }) => {
		let state: ConquestState = createConquestMatch({ mode: 'clock', preset: 51, players: P });

		const created = await request.post('/api/conquest', { data: { state } });
		expect(created.status()).toBe(200);
		const { id } = await created.json();

		await page.goto(`/match/conquest/${id}/tv`);

		// board + names render without email gate
		await expect(page.getByText('Ada TV', { exact: true }).first()).toBeVisible({ timeout: 10_000 });
		await expect(page.getByText('Ben TV', { exact: true }).first()).toBeVisible();
		await expect(page.getByText('Ada TV gooit')).toBeVisible();

		// server state advances → TV follows within 2s (turn passes to Ben)
		state = applyDart(state, { segment: 0, multiplier: 1 }).state; // miss
		state = applyDart(state, { segment: 0, multiplier: 1 }).state;
		state = applyDart(state, { segment: 0, multiplier: 1 }).state;
		expect(state.activeSeat).toBe(1);
		await request.patch(`/api/conquest/${id}`, { data: { state } });
		await expect(page.getByText('Ben TV gooit')).toBeVisible({ timeout: 2_000 });

		// game finishes → frozen champion card, polling stops
		state.phase = 'finished';
		state.winner = 'b';
		state.standings = [
			{ playerId: 'b', score: 2, territories: 2, continents: 0, rank: 1 },
			{ playerId: 'a', score: 0, territories: 0, continents: 0, rank: 2 }
		];
		await request.patch(`/api/conquest/${id}`, { data: { state } });
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

test.describe('TV view — conquest scorer cast button', () => {
	test('conquest scorer shows cast button once the game is server-backed and opens the TV tab', async ({ page, context, request }) => {
		const email = `e2e+tvcast+${Date.now()}@example.com`;
		const state = createConquestMatch({ mode: 'clock', preset: 51, players: P });
		const created = await request.post('/api/conquest', { data: { state } });
		const { id } = await created.json();

		await page.addInitScript(
			({ acct, gameId }) => {
				window.localStorage.setItem('darts_email', acct);
				window.sessionStorage.setItem('conquest_game_id', gameId);
				window.sessionStorage.setItem(
					'conquest_setup',
					JSON.stringify({ mode: 'clock', preset: 51, players: [{ id: 'a', name: 'Ada TV' }, { id: 'b', name: 'Ben TV' }] })
				);
			},
			{ acct: email, gameId: id }
		);
		await page.goto('/match/conquest');

		const popupPromise = context.waitForEvent('page');
		await page.getByRole('button', { name: 'Open TV-weergave in nieuw tabblad' }).click();
		const tv = await popupPromise;
		await tv.waitForLoadState();
		await expect(tv).toHaveURL(new RegExp(`/match/conquest/${id}/tv$`));
		await expect(tv.getByText('Ada TV', { exact: true }).first()).toBeVisible({ timeout: 10_000 });
	});
});
