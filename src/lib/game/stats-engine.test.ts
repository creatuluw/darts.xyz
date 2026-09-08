import { describe, it, expect } from 'vitest';
import {
	createEmptyStats,
	is180,
	is140Plus,
	is100Plus,
	isCheckoutSuccess,
	computeStatsFromTurns,
	computeLast20LegsStats
} from './stats-engine';
import type { TurnRecord } from './types';

function turn(over: Partial<TurnRecord>): TurnRecord {
	return {
		playerId: 'p1',
		turnNumber: 1,
		darts: [],
		totalScore: 0,
		remainingScore: 501,
		isBust: false,
		dartsThrown: 3,
		...over
	};
}

describe('createEmptyStats', () => {
	it('returns a zeroed stats object', () => {
		const stats = createEmptyStats();
		expect(stats.matchesPlayed).toBe(0);
		expect(stats.totalDartsThrown).toBe(0);
		expect(stats.threeDartAvg).toBe(0);
		expect(stats.checkoutPct).toBe(0);
		expect(stats.highestFinish).toBe(0);
	});
});

describe('turn classifiers', () => {
	it('is180 requires 180 with 3 darts', () => {
		expect(is180(turn({ totalScore: 180, dartsThrown: 3 }))).toBe(true);
		expect(is180(turn({ totalScore: 180, dartsThrown: 2 }))).toBe(false);
		expect(is180(turn({ totalScore: 179, dartsThrown: 3 }))).toBe(false);
	});

	it('is140Plus / is100Plus thresholds', () => {
		expect(is140Plus(turn({ totalScore: 140 }))).toBe(true);
		expect(is140Plus(turn({ totalScore: 139 }))).toBe(false);
		expect(is100Plus(turn({ totalScore: 100 }))).toBe(true);
		expect(is100Plus(turn({ totalScore: 99 }))).toBe(false);
	});

	it('isCheckoutSuccess requires 0 remaining and no bust', () => {
		expect(isCheckoutSuccess(turn({ remainingScore: 0, isBust: false }))).toBe(true);
		expect(isCheckoutSuccess(turn({ remainingScore: 0, isBust: true }))).toBe(false);
		expect(isCheckoutSuccess(turn({ remainingScore: 40, isBust: false }))).toBe(false);
	});
});

describe('computeStatsFromTurns', () => {
	it('handles an empty turn list', () => {
		const stats = computeStatsFromTurns([], 0, 0, 0, 0, 0, 0);
		expect(stats.totalDartsThrown).toBe(0);
		expect(stats.threeDartAvg).toBe(0);
	});

	it('aggregates darts, score and computes the 3-dart average', () => {
		// 2 turns: 100 (3 darts) + 60 (2 darts) → 250 pts / 5 darts = 50/dart → 150 avg
		const stats = computeStatsFromTurns(
			[
				turn({ totalScore: 100, dartsThrown: 3 }),
				turn({ totalScore: 60, dartsThrown: 2, remainingScore: 341 })
			],
			0, 1, 0, 1, 0, 1
		);
		expect(stats.totalDartsThrown).toBe(5);
		expect(stats.totalScore).toBe(160);
		expect(stats.threeDartAvg).toBeCloseTo((160 / 5) * 3); // 96
		expect(stats.legsPlayed).toBe(1);
		expect(stats.matchesPlayed).toBe(1);
	});

	it('counts 180s, 140s and 100s (a 180 also counts as 140+ and 100+)', () => {
		const stats = computeStatsFromTurns(
			[
				turn({ totalScore: 180 }),
				turn({ totalScore: 140 }),
				turn({ totalScore: 100 }),
				turn({ totalScore: 99 })
			],
			0, 0, 0, 0, 0, 0
		);
		expect(stats.total180s).toBe(1);
		expect(stats.total140s).toBe(2); // 180 + 140
		expect(stats.total100s).toBe(3); // 180 + 140 + 100
	});

	it('counts checkout successes as attempts and tracks the highest finish', () => {
		const stats = computeStatsFromTurns(
			[
				turn({ totalScore: 40, remainingScore: 0, isBust: false }), // checkout D20
				turn({ totalScore: 100, remainingScore: 100, isBust: false })
			],
			1, 1, 0, 1, 1, 1
		);
		expect(stats.checkoutSuccesses).toBe(1);
		expect(stats.checkoutAttempts).toBe(1);
		expect(stats.checkoutPct).toBe(100);
		expect(stats.highestFinish).toBe(40);
		expect(stats.legsWon).toBe(1);
		expect(stats.matchesWon).toBe(1);
	});

	it('counts a bust from a checkout-able score as a failed attempt', () => {
		const stats = computeStatsFromTurns(
			[turn({ totalScore: 45, remainingScore: 40, isBust: true })], // busted from 40
			0, 0, 0, 0, 0, 0
		);
		expect(stats.checkoutAttempts).toBe(1);
		expect(stats.checkoutSuccesses).toBe(0);
		expect(stats.checkoutPct).toBe(0);
	});

	it('a bust from a non-checkout-able score is not an attempt', () => {
		const stats = computeStatsFromTurns(
			[turn({ totalScore: 200, remainingScore: 200, isBust: true })], // busted from 200
			0, 0, 0, 0, 0, 0
		);
		expect(stats.checkoutAttempts).toBe(0);
	});

	it('computes checkout percentage across mixed attempts', () => {
		const stats = computeStatsFromTurns(
			[
				turn({ totalScore: 32, remainingScore: 0, isBust: false }), // success
				turn({ totalScore: 41, remainingScore: 32, isBust: true }), // bust from 32
				turn({ totalScore: 60, remainingScore: 50, isBust: true }) // bust from 50
			],
			0, 0, 0, 0, 0, 0
		);
		expect(stats.checkoutAttempts).toBe(3);
		expect(stats.checkoutSuccesses).toBe(1);
		expect(stats.checkoutPct).toBeCloseTo(33.33);
	});
});

describe('computeLast20LegsStats', () => {
	it('returns null when fewer than 20 legs played', () => {
		const turns = Array.from({ length: 50 }, (_, i) => turn({ turnNumber: i + 1, totalScore: 60 }));
		expect(computeLast20LegsStats(turns, 5, 10, 3, 5, 2, 3)).toBeNull();
	});

	it('uses at most ~20 legs worth of turns (newest first)', () => {
		const turns = Array.from({ length: 600 }, (_, i) =>
			turn({ turnNumber: 600 - i, totalScore: i === 0 ? 100 : 60, dartsThrown: 3 })
		);
		const stats = computeLast20LegsStats(turns, 12, 25, 6, 12, 5, 8);
		expect(stats).not.toBeNull();
		// Only the first 400 turns (newest) are considered
		expect(stats!.legsPlayed).toBe(20);
		expect(stats!.totalDartsThrown).toBe(400 * 3);
	});
});
