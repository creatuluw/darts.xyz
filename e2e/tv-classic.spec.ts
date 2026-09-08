import { test, expect } from '@playwright/test';
import { uniqueEmail, createPlayer, createMatch, submitTurn, archivePlayer } from './helpers';

/**
 * Classic 2nd-screen TV view: public-by-link, live within ~2s, winner freeze.
 */
test.describe('TV view — classic match', () => {
	let email: string;
	let aliceId: string;
	let bobId: string;
	let matchId: string;
	let firstLegId: string;

	test.beforeAll(async ({ request }) => {
		email = uniqueEmail();
		aliceId = (await createPlayer(request, email, 'E2E Alice')).id;
		bobId = (await createPlayer(request, email, 'E2E Bob')).id;
		const { match, firstLeg } = await createMatch(request, email, [aliceId, bobId]);
		matchId = match.id;
		firstLegId = firstLeg.id;
	});

	test.afterAll(async ({ request }) => {
		await archivePlayer(request, aliceId);
		await archivePlayer(request, bobId);
	});

	test('renders without email gate, updates within 2s of a scorer turn, freezes on finish', async ({ page, request }) => {
		await page.goto(`/match/${matchId}/tv`);

		// no email gate — the board state renders directly
		await expect(page.getByText('E2E Alice')).toBeVisible({ timeout: 10_000 });
		await expect(page.getByText('E2E Bob')).toBeVisible();
		await expect(page.locator('.tabular-nums').first()).toHaveText('301');

		// scorer submits a turn through the API (exactly what the live page does)
		await submitTurn(request, matchId, {
			legId: firstLegId,
			playerId: aliceId,
			turnNumber: 1,
			darts: [
				{ segment: 20, multiplier: 3 },
				{ segment: 20, multiplier: 3 },
				{ segment: 20, multiplier: 3 }
			],
			remainingScore: 121,
			isBust: false
		});

		// TV reflects it well within 2s
		await expect(page.locator('.tabular-nums').first()).toHaveText('121', { timeout: 2_000 });
		await expect(page.getByText('= 180')).toBeVisible();

		// match finishes → winner card, polling stops
		await request.patch(`/api/matches/${matchId}`, {
			data: { status: 'completed', winnerId: aliceId }
		});
		await expect(page.getByText('Wedstrijd afgelopen')).toBeVisible({ timeout: 5_000 });
		await expect(page.getByText('LIVE', { exact: true })).toBeHidden();

		// no further match polling after the freeze
		let polled = 0;
		page.on('request', (r) => {
			if (r.url().includes(`/api/matches/${matchId}`)) polled++;
		});
		await page.waitForTimeout(2_500);
		expect(polled).toBe(0);
	});
});
