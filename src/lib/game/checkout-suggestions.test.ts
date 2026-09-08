import { describe, it, expect } from 'vitest';
import { getCheckoutSuggestions, canCheckout } from './checkout-suggestions';

describe('getCheckoutSuggestions', () => {
	it('suggests the classic 170 finish (T20 T20 Bull)', () => {
		const options = getCheckoutSuggestions(170);
		expect(options.length).toBeGreaterThan(0);
		expect(options[0].description).toBe('T20 → T20 → Bull');
		expect(options[0].darts.map((d) => d.score)).toEqual([60, 60, 50]);
	});

	it('suggests D20 for 40 with one dart left', () => {
		const options = getCheckoutSuggestions(40, 1);
		expect(options).toHaveLength(1);
		expect(options[0].description).toBe('D20');
	});

	it('suggests Bull for 50 with one dart left', () => {
		const options = getCheckoutSuggestions(50, 1);
		expect(options).toHaveLength(1);
		expect(options[0].description).toBe('Bull');
	});

	it('finds a two-dart finish for 110 (T20 → Bull)', () => {
		const options = getCheckoutSuggestions(110, 2);
		expect(options.length).toBeGreaterThan(0);
		expect(options[0].description).toBe('T20 → Bull');
	});

	it('returns no options for impossible finishes', () => {
		for (const impossible of [159, 162, 163, 165, 166, 168, 169]) {
			expect(getCheckoutSuggestions(impossible), `${impossible} should be impossible`).toHaveLength(0);
		}
	});

	it('returns no options for 0, 1 and > 170', () => {
		expect(getCheckoutSuggestions(0)).toHaveLength(0);
		expect(getCheckoutSuggestions(1)).toHaveLength(0);
		expect(getCheckoutSuggestions(171)).toHaveLength(0);
	});

	it('every option sums to the remaining score and ends on a double', () => {
		for (const remaining of [2, 32, 40, 61, 81, 100, 141, 167, 170]) {
			const options = getCheckoutSuggestions(remaining);
			expect(options.length, `${remaining} should have options`).toBeGreaterThan(0);
			for (const opt of options) {
				const sum = opt.darts.reduce((s, d) => s + d.score, 0);
				expect(sum).toBe(remaining);
				const last = opt.darts[opt.darts.length - 1];
				expect(last.multiplier).toBe(2); // must finish on a double
				expect(opt.darts.length).toBeLessThanOrEqual(3);
			}
		}
	});

	it('limits suggestions to at most 3', () => {
		const options = getCheckoutSuggestions(100);
		expect(options.length).toBeGreaterThan(0);
		expect(options.length).toBeLessThanOrEqual(3);
	});

	it('falls back to shorter finishes when fewer darts remain', () => {
		// 32: with 3 darts there are multi-dart routes; with 1 dart only D16
		const one = getCheckoutSuggestions(32, 1);
		expect(one).toHaveLength(1);
		expect(one[0].description).toBe('D16');

		// 170 is impossible with 2 darts
		expect(getCheckoutSuggestions(170, 2)).toHaveLength(0);
	});
});

describe('canCheckout', () => {
	it('with 1 dart: only doubles and bull (≤ 50, even, or 50)', () => {
		expect(canCheckout(40, 1)).toBe(true);
		expect(canCheckout(50, 1)).toBe(true);
		expect(canCheckout(2, 1)).toBe(true);
		expect(canCheckout(41, 1)).toBe(false);
		expect(canCheckout(49, 1)).toBe(false);
		expect(canCheckout(60, 1)).toBe(false);
	});

	it('with 2 darts: finishes up to 110', () => {
		expect(canCheckout(110, 2)).toBe(true);
		expect(canCheckout(100, 2)).toBe(true);
		expect(canCheckout(111, 2)).toBe(false);
	});

	it('rejects 0, 1 and anything over 170', () => {
		expect(canCheckout(0, 3)).toBe(false);
		expect(canCheckout(1, 3)).toBe(false);
		expect(canCheckout(171, 3)).toBe(false);
	});
});
