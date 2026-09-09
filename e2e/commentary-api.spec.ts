import { test, expect } from '@playwright/test';
import { COMMENTATOR_VOICE_IDS } from '../src/lib/game/elevenlabs-voices';

/**
 * Commentary API (fake mode — no LLM/TTS spend): idempotent per boundary,
 * forced failures surface as 5xx, latest is retrievable.
 */
test.describe('Commentary API', () => {
	test('same boundary requested twice → one cached row, no regeneration', async ({ request }) => {
		const matchRef = `e2e-cmty-${Date.now()}`;
		const payload = {
			matchRef,
			boundary: 1,
			kind: 'classic',
			players: ['Alice', 'Bob'],
			turnLines: ['Alice: T20 T20 T20 = 180', 'Bob: 1 1 1 = 3']
		};

		const first = await request.post('/api/commentary', { data: payload });
		expect(first.status()).toBe(200);
		const a = await first.json();
		expect(a.cached).toBe(false);
		expect(a.question).toBeTruthy();
		expect(a.answer).toBeTruthy();
		expect(a.analysis).toBeTruthy();
		expect(a.outlook).toBeTruthy();
		expect(a.analystVoice).toBeTruthy();
		expect(COMMENTATOR_VOICE_IDS).toContain(a.analystVoice);

		const second = await request.post('/api/commentary', { data: payload });
		expect(second.status()).toBe(200);
		const b = await second.json();
		expect(b.cached).toBe(true);
		expect(b.id).toBe(a.id); // same row — no regeneration

		const latest = await request.get(`/api/commentary/${matchRef}`);
		expect(latest.status()).toBe(200);
		const l = await latest.json();
		expect(l.id).toBe(a.id);
	});

	test('invalid payload → 400', async ({ request }) => {
		const res = await request.post('/api/commentary', {
			data: { matchRef: 'x', boundary: 0 }
		});
		expect(res.status()).toBe(400);
	});

	test('forced failure → 500 (fake mode)', async ({ request }) => {
		const res = await request.post('/api/commentary', {
			data: {
				matchRef: `fail-${Date.now()}`,
				boundary: 1,
				kind: 'classic',
				players: ['A'],
				turnLines: ['A: 60']
			}
		});
		expect(res.status()).toBe(500);
	});
});
