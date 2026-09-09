import { test, expect } from '@playwright/test';
import { createGame } from '../src/lib/game/risk-engine';

/**
 * Risk 42 server persistence — what the live risk page does on create,
 * every dart (write-through), and refresh-resume in a fresh session.
 * Rides the shared conquest_games store (opaque jsonb, uuid = access key).
 */

const SETUP = {
	mode: 'domination' as const,
	players: [
		{ id: 'e2e-a', name: 'E2E Ada' },
		{ id: 'e2e-b', name: 'E2E Ben' }
	]
};

test.describe('Risk 42 persistence', () => {
	test.beforeEach(async ({ page }) => {
		// scorer pages render behind EmailGate — darts_email is stored raw
		await page.addInitScript(
			(email) => window.localStorage.setItem('darts_email', email),
			`e2e+risk42+${Date.now()}@example.com`
		);
	});

	test('scorer creates a server game and writes through every dart', async ({ page }) => {
		await page.addInitScript((setup) => {
			window.sessionStorage.setItem('risk42_setup', JSON.stringify(setup));
		}, SETUP);
		const created = page.waitForResponse(
			(r) => r.url().endsWith('/api/conquest') && r.request().method() === 'POST'
		);
		await page.goto('/match/risk');
		await created; // game id is stored before we play

		await page.getByRole('button', { name: 'Start turn' }).click();
		const patched = page.waitForResponse(
			(r) => r.request().method() === 'PATCH' && r.url().includes('/api/conquest/')
		);
		await page.getByRole('button', { name: 'Miss', exact: true }).click();
		await patched; // write-through is fire-and-forget — wait for it to land

		const gameId = await page.evaluate(() => sessionStorage.getItem('risk42_game_id'));
		expect(gameId).toBeTruthy();

		const res = await page.request.get(`/api/conquest/${gameId}`);
		expect(res.ok()).toBeTruthy();
		const { state } = await res.json();
		expect(state.game.turn.dartsLeft).toBe(2); // one miss persisted
		expect(state.players.map((p: { name: string }) => p.name)).toEqual(['E2E Ada', 'E2E Ben']);
	});

	test('fresh session resumes from the game id alone', async ({ page, request }) => {
		const game = createGame(['e2e-a', 'e2e-b'], { mode: 'domination', seed: 42 });
		const created = await request.post('/api/conquest', {
			data: { state: { game, players: SETUP.players } }
		});
		expect(created.status()).toBe(200);
		const { id } = await created.json();

		await page.addInitScript((gid) => {
			window.sessionStorage.setItem('risk42_game_id', gid);
		}, id);
		await page.goto('/match/risk');

		// resumes into the gate, not a redirect to setup
		await expect(page.getByRole('button', { name: 'Start turn' })).toBeVisible();
		await expect(page.getByText('E2E Ada').first()).toBeVisible();
		await expect(page.getByText('E2E Ben').first()).toBeVisible();
	});
});
