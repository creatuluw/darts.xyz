import { test, expect } from '@playwright/test';

/**
 * Conquest (Trebles & Territories) server persistence round-trip —
 * what the live conquest page does on create, every dart (write-through),
 * and refresh-resume.
 */

const baseState = (turnCount = 0) => ({
	mode: 'clock' as const,
	preset: 51,
	players: [
		{ id: 'e2e-a', name: 'E2E Ada', dartsThrown: 0, bonusDarts: 0, dead: false },
		{ id: 'e2e-b', name: 'E2E Ben', dartsThrown: 0, bonusDarts: 0, dead: false }
	],
	activeSeat: 0,
	territories: {},
	turnCount,
	dartsLeftInTurn: 3,
	turnDarts: [],
	turnShanghais: [],
	phase: 'turn' as const,
	pendingDuel: null,
	tiebreak: null,
	winner: null,
	standings: null
});

test.describe('Conquest persistence API', () => {
	test('create → patch → get round-trip persists state server-side', async ({ request }) => {
		// create
		const created = await request.post('/api/conquest', {
			data: { state: baseState(0) }
		});
		expect(created.status()).toBe(200);
		const { id } = await created.json();
		expect(id).toBeTruthy();

		// write-through a dart's worth of state
		const patched = await request.patch(`/api/conquest/${id}`, {
			data: { state: baseState(1) }
		});
		expect(patched.status()).toBe(200);

		// refresh-resume reads the latest state back
		const got = await request.get(`/api/conquest/${id}`);
		expect(got.status()).toBe(200);
		const body = await got.json();
		expect(body.state.turnCount).toBe(1);
		expect(body.state.players).toHaveLength(2);
	});

	test('unknown conquest id → 404', async ({ request }) => {
		const res = await request.get(`/api/conquest/00000000-0000-4000-8000-000000000000`);
		expect(res.status()).toBe(404);
	});

	test('patch with invalid payload → 400', async ({ request }) => {
		const created = await request.post('/api/conquest', {
			data: { state: baseState(0) }
		});
		const { id } = await created.json();
		const res = await request.patch(`/api/conquest/${id}`, { data: { nonsense: true } });
		expect(res.status()).toBe(400);
	});
});
