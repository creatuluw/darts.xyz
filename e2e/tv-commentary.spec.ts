import { test, expect } from '@playwright/test';
import { createConquestMatch, applyDart } from '../src/lib/game/conquest-engine';
import type { ConquestState } from '../src/lib/game/conquest-engine';

/**
 * Commentary on the conquest TV (fake mode): fires exactly once per boundary,
 * pause stops all requests, generation failures show a dismissible toast.
 */
const P = [
	{ id: 'a', name: 'Ada CM' },
	{ id: 'b', name: 'Ben CM' }
];

function withTurns(base: ConquestState, turnCount: number): ConquestState {
	let s = base;
	while (s.turnCount < turnCount) {
		s = applyDart(s, { segment: 20, multiplier: 1 }).state;
		if (s.turnDarts.length === 0 && s.turnCount < turnCount) {
			// fill remaining darts of the visit with misses
			while (s.turnDarts.length > 0 || s.dartsLeftInTurn > 0) {
				if (s.phase !== 'turn') break;
				s = applyDart(s, { segment: 0, multiplier: 1 }).state;
			}
		}
	}
	return s;
}

test.describe('TV commentary', () => {
	test('boundary crossing triggers exactly one generation and shows subtitles', async ({ page, request }) => {
		const base = createConquestMatch({ mode: 'clock', preset: 51, players: P });
		const created = await request.post('/api/conquest', { data: { state: base } });
		const { id } = await created.json();

		await page.goto(`/match/conquest/${id}/tv`);
		await expect(page.getByText('Commentaar live')).toBeVisible({ timeout: 10_000 });

		let posts = 0;
		page.on('request', (r) => {
			if (r.url().endsWith('/api/commentary') && r.method() === 'POST') posts++;
		});

		// cross the first boundary (2 turns)
		await request.patch(`/api/conquest/${id}`, {
			data: { state: withTurns(base, 2) }
		});

		// fake-mode interview: subtitle appears, exactly one POST fired
		await expect(page.getByText('Commentator').first()).toBeVisible({ timeout: 10_000 });
		await page.waitForTimeout(1_500);
		expect(posts).toBe(1);
	});

	test('pause button stops generation entirely', async ({ page, request }) => {
		const base = createConquestMatch({ mode: 'clock', preset: 51, players: P });
		const created = await request.post('/api/conquest', { data: { state: base } });
		const { id } = await created.json();

		await page.goto(`/match/conquest/${id}/tv`);
		await expect(page.getByText('Commentaar live')).toBeVisible({ timeout: 10_000 });

		await page.getByRole('button', { name: 'Commentaar pauzeren' }).click();
		await expect(page.getByText('Commentaar staat stil')).toBeVisible();

		let posts = 0;
		page.on('request', (r) => {
			if (r.url().endsWith('/api/commentary') && r.method() === 'POST') posts++;
		});

		await request.patch(`/api/conquest/${id}`, {
			data: { state: withTurns(base, 4) }
		});
		await page.waitForTimeout(2_500);
		expect(posts).toBe(0);
	});

	test('generation failure shows a dismissible toast', async ({ page, request }) => {
		const base = createConquestMatch({ mode: 'clock', preset: 51, players: P });
		const created = await request.post('/api/conquest', { data: { state: base } });
		const { id } = await created.json();

		// force every commentary POST to fail
		await page.route('**/api/commentary', (route) =>
			route.fulfill({ status: 500, body: 'forced' })
		);

		await page.goto(`/match/conquest/${id}/tv`);
		await expect(page.getByText('Commentaar live')).toBeVisible({ timeout: 10_000 });

		await request.patch(`/api/conquest/${id}`, {
			data: { state: withTurns(base, 2) }
		});

		const toast = page.getByText('Commentaar mislukt');
		await expect(toast).toBeVisible({ timeout: 10_000 });
		await page.getByRole('button', { name: 'Dismiss' }).click(); // dismissible
		await expect(page.getByText('Commentaar mislukt')).toBeHidden();
	});
});
