import { describe, it, expect } from 'vitest';
import {
	calculateDartScore,
	createDart,
	calculateTurnScore,
	detectBust,
	detectCheckout,
	getRemainingScore,
	processTurn
} from './scoring';
import type { DartData } from './types';

describe('calculateDartScore', () => {
	it('computes singles', () => {
		expect(calculateDartScore(20, 1)).toBe(20);
		expect(calculateDartScore(1, 1)).toBe(1);
	});

	it('computes doubles and trebles', () => {
		expect(calculateDartScore(20, 2)).toBe(40);
		expect(calculateDartScore(20, 3)).toBe(60);
		expect(calculateDartScore(19, 3)).toBe(57);
	});

	it('treats bull as segment 25 (outer=25, inner=50)', () => {
		expect(calculateDartScore(25, 1)).toBe(25);
		expect(calculateDartScore(25, 2)).toBe(50);
	});

	it('returns 0 on a miss (multiplier 0 or segment 0)', () => {
		expect(calculateDartScore(20, 0)).toBe(0);
		expect(calculateDartScore(0, 3)).toBe(0);
		expect(calculateDartScore(0, 0)).toBe(0);
	});
});

describe('createDart', () => {
	it('carries the computed score', () => {
		expect(createDart(20, 3)).toEqual({ segment: 20, multiplier: 3, score: 60 });
		expect(createDart(25, 2)).toEqual({ segment: 25, multiplier: 2, score: 50 });
	});
});

describe('calculateTurnScore', () => {
	it('sums all darts', () => {
		const darts = [createDart(20, 3), createDart(20, 3), createDart(20, 3)];
		expect(calculateTurnScore(darts)).toBe(180);
	});

	it('handles 1-2 dart turns and misses', () => {
		expect(calculateTurnScore([createDart(0, 0)])).toBe(0);
		expect(calculateTurnScore([createDart(5, 1), createDart(10, 2)])).toBe(25);
	});

	it('handles an empty turn', () => {
		expect(calculateTurnScore([])).toBe(0);
	});
});

describe('detectBust', () => {
	it('busts when score goes below 0', () => {
		expect(detectBust(20, 60, 3, 3)).toBe(true);
	});

	it('busts when landing on exactly 1', () => {
		expect(detectBust(41, 40, 1, 3)).toBe(true); // 41-40=1
	});

	it('busts when reaching 0 without a double', () => {
		expect(detectBust(40, 40, 1, 3)).toBe(true); // S40-ish (impossible dart but rule holds)
		expect(detectBust(60, 60, 3, 3)).toBe(true); // T20 to zero = bust
	});

	it('does NOT bust when reaching 0 with a double', () => {
		expect(detectBust(40, 40, 2, 1)).toBe(false); // D20
		expect(detectBust(50, 50, 2, 3)).toBe(false); // Bull
	});

	it('does not bust on a normal scoring turn', () => {
		expect(detectBust(501, 180, 3, 3)).toBe(false);
		expect(detectBust(100, 60, 3, 3)).toBe(false); // 100-60=40, fine
	});
});

describe('detectCheckout', () => {
	it('is a checkout when remaining hits exactly 0 on a double', () => {
		expect(detectCheckout(40, 40, 2)).toBe(true);
		expect(detectCheckout(50, 50, 2)).toBe(true);
		expect(detectCheckout(32, 32, 2)).toBe(true);
	});

	it('is not a checkout on 0 without a double', () => {
		expect(detectCheckout(40, 40, 1)).toBe(false);
		expect(detectCheckout(40, 40, 3)).toBe(false);
	});

	it('is not a checkout when not reaching 0', () => {
		expect(detectCheckout(501, 180, 3)).toBe(false);
	});
});

describe('getRemainingScore', () => {
	it('reverts the score on bust', () => {
		expect(getRemainingScore(20, 60, true)).toBe(20);
	});

	it('subtracts the turn score on a valid turn', () => {
		expect(getRemainingScore(501, 180, false)).toBe(321);
		expect(getRemainingScore(40, 40, false)).toBe(0);
	});
});

describe('processTurn', () => {
	it('processes a scoring 3-dart turn', () => {
		const darts = [createDart(20, 3), createDart(20, 3), createDart(20, 3)];
		const turn = processTurn(darts, 501);
		expect(turn.totalScore).toBe(180);
		expect(turn.isBust).toBe(false);
		expect(turn.dartsThrown).toBe(3);
	});

	it('flags a bust when overshooting', () => {
		const darts = [createDart(20, 3), createDart(20, 3)]; // 120 from 100
		const turn = processTurn(darts, 100);
		expect(turn.isBust).toBe(true);
	});

	it('flags a bust when ending on 1', () => {
		const darts = [createDart(20, 2)]; // 40 from 41 → 1
		const turn = processTurn(darts, 41);
		expect(turn.isBust).toBe(true);
	});

	it('flags a bust when hitting 0 with a non-double last dart', () => {
		const darts = [createDart(20, 1), createDart(20, 1)]; // 40 from 40, last is single
		const turn = processTurn(darts, 40);
		expect(turn.isBust).toBe(true);
	});

	it('a checkout is not a bust', () => {
		const darts = [createDart(20, 1), createDart(10, 2)]; // 20 + D20 from 40
		const turn = processTurn(darts, 40);
		expect(turn.isBust).toBe(false);
		expect(turn.totalScore).toBe(40);
	});
});
