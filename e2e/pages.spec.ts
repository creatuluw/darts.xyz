import { test, expect } from '@playwright/test';
import { uniqueEmail } from './helpers';

/**
 * UI smoke tests — every page renders behind the email gate.
 * A fresh account email is seeded into localStorage before each test so
 * pages load with empty (non-colliding) data.
 */
test.beforeEach(async ({ page }) => {
	await page.addInitScript((email) => {
		// darts_email is stored raw (see email.ts setEmail — not JSON-stringified)
		window.localStorage.setItem('darts_email', email);
	}, uniqueEmail());
});

test('home page renders the brand and nav cards', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'dart.monster' })).toBeVisible();
	await expect(page.getByRole('link', { name: /New Match/ })).toBeVisible();
	await expect(page.getByRole('link', { name: /Players View stats/ })).toBeVisible();
});

test('match setup page renders format options', async ({ page }) => {
	await page.goto('/match/setup');
	await expect(page.getByRole('heading', { name: 'New Match' })).toBeVisible();
	await expect(page.getByText('Match Format')).toBeVisible();
	await expect(page.getByText('301', { exact: true })).toBeVisible();
	await expect(page.getByText('501', { exact: true })).toBeVisible();
});

test('players page renders the add-player entry point for a fresh account', async ({ page }) => {
	await page.goto('/players');
	await expect(page.getByRole('heading', { name: 'Players', exact: true })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Add Player' })).toBeVisible();
	await expect(page.getByText('No players yet. Add one!')).toBeVisible();
});

test('history page renders', async ({ page }) => {
	await page.goto('/history');
	await expect(page.getByRole('heading', { name: 'Match History' })).toBeVisible();
});

test('archive page renders', async ({ page }) => {
	await page.goto('/archive');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('unknown route falls back without crashing', async ({ page }) => {
	const res = await page.goto('/this-page-does-not-exist');
	// SvelteKit serves a 404 page
	expect(res?.status()).toBe(404);
});
