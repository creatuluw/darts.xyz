import { test, expect } from '@playwright/test';
import { uniqueEmail, createPlayer, createMatch, archivePlayer } from './helpers';

/**
 * Live scorer UI flow — drives the real page in a browser using the
 * numpad input mode (seeded via localStorage, same as the app's own toggle).
 */
test.describe('match scorer UI', () => {
	let email: string;
	let aliceId: string;
	let bobId: string;

	test.beforeAll(async ({ request }) => {
		email = uniqueEmail();
		aliceId = (await createPlayer(request, email, 'E2E Ui Alice')).id;
		bobId = (await createPlayer(request, email, 'E2E Ui Bob')).id;
	});

	test.afterAll(async ({ request }) => {
		await archivePlayer(request, aliceId);
		await archivePlayer(request, bobId);
	});

	async function openMatch(page: import('@playwright/test').Page, matchId: string) {
		await page.addInitScript((acct) => {
			// darts_email is stored raw; inputMode toggles the numpad scorer
			window.localStorage.setItem('darts_email', acct);
			window.localStorage.setItem('inputMode', 'numpad');
		}, email);
		await page.goto(`/match/${matchId}`);
		// Wait for the scorer to finish loading (numpad appears)
		await expect(page.getByRole('button', { name: 'Triple', exact: true })).toBeVisible();
	}

	async function throwDarts(page: import('@playwright/test').Page, darts: Array<{ label: string }>) {
		for (const dart of darts) {
			await page.getByRole('button', { name: dart.label, exact: true }).click();
		}
	}

	test('plays a full 301 match through the numpad and shows the winner overlay', async ({ page, request }) => {
		const { match } = await createMatch(request, email, [aliceId, bobId], { startingScore: 301 });
		await openMatch(page, match.id);

		// --- Alice: T20 T20 T20 = 180 → 121
		await page.getByRole('button', { name: 'Triple', exact: true }).click();
		await throwDarts(page, [{ label: 'T20' }, { label: 'T20' }, { label: 'T20' }]);
		// Turn total shows 180 before submitting
		await expect(page.getByText('180', { exact: true }).first()).toBeVisible();
		await page.getByRole('button', { name: /Submit \(3\)/ }).click();
		// Alice's remaining drops to 121
		await expect(page.getByText('121', { exact: true }).first()).toBeVisible();

		// --- Bob: Miss
		await page.getByRole('button', { name: 'Miss', exact: true }).click();
		await page.getByRole('button', { name: /Submit \(1\)/ }).click();

		// --- Alice: T20 T15 D8 = 121 → checkout, match complete
		await page.getByRole('button', { name: 'Triple', exact: true }).click();
		await page.getByRole('button', { name: 'T20', exact: true }).click();
		await page.getByRole('button', { name: 'T15', exact: true }).click();
		await page.getByRole('button', { name: 'Double', exact: true }).click();
		await page.getByRole('button', { name: 'D8', exact: true }).click();
		await page.getByRole('button', { name: /Submit \(3\)/ }).click();

		// Winner overlay appears with the checkout player's name
		await expect(page.getByText('E2E Ui Alice wins!')).toBeVisible({ timeout: 20_000 });
		await expect(page.getByText('Match complete')).toBeVisible();
		await expect(page.getByRole('link', { name: 'View Match Details' })).toBeVisible();
	});

	test('undo removes the last dart before submitting', async ({ page, request }) => {
		const { match } = await createMatch(request, email, [aliceId, bobId], { startingScore: 301 });
		await openMatch(page, match.id);

		await page.getByRole('button', { name: 'Triple', exact: true }).click();
		await page.getByRole('button', { name: 'T20', exact: true }).click();
		await page.getByRole('button', { name: 'T20', exact: true }).click();

		// Turn total is 120 with 2 darts
		await expect(page.getByRole('button', { name: /Submit \(2\)/ })).toBeVisible();

		// Undo one dart → 1 dart left
		await page.getByRole('button', { name: 'Undo' }).click();
		await expect(page.getByRole('button', { name: /Submit \(1\)/ })).toBeVisible();

		// Clear the rest so we leave the match untouched
		await page.getByRole('button', { name: 'Clear all darts' }).click();
		await expect(page.getByRole('button', { name: 'Miss', exact: true })).toBeEnabled();

		// Abandon the match via the API so it doesn't linger as active
		await request.patch(`/api/matches/${match.id}`, { data: { status: 'abandoned' } });
	});

	test('setup page can start a match for two existing players', async ({ page, request }) => {
		await page.addInitScript((acct) => {
			window.localStorage.setItem('darts_email', acct);
		}, email);
		await page.goto('/match/setup');

		// Pick both players from the option chips
		await page.getByRole('button', { name: 'E2E Ui Alice', exact: true }).click();
		await page.getByRole('button', { name: 'E2E Ui Bob', exact: true }).click();

		await page.getByRole('button', { name: 'Start Match' }).click();
		await page.waitForURL(/\/match\/[0-9a-f-]+$/);

		// Scorer loads for the created match
		await expect(page.getByText(/Set 1 · Leg 1/)).toBeVisible();

		// Abandon it — this test only verifies the flow starts
		const matchId = page.url().split('/').pop()!;
		await request.patch(`/api/matches/${matchId}`, { data: { status: 'abandoned' } });
	});
});
