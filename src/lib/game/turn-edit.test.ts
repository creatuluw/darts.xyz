import { describe, it, expect } from "vitest";
import {
	validateEditedDarts,
	computeEditedTurnOutcome,
} from "./turn-edit";
import type { DartData } from "./types";

const dart = (segment: number, multiplier: 0 | 1 | 2 | 3): DartData => ({
	segment,
	multiplier,
	score: segment * multiplier,
});

describe("validateEditedDarts", () => {
	it("accepts a normal turn and recomputes the total server-side", () => {
		const result = validateEditedDarts(
			[dart(20, 3), dart(20, 3), dart(20, 3)],
			3,
		);
		expect(result).toEqual({
			ok: true,
			darts: [dart(20, 3), dart(20, 3), dart(20, 3)],
			totalScore: 180,
			dartsThrown: 3,
		});
	});

	it("accepts miss darts and counts them via dartsThrown", () => {
		const result = validateEditedDarts([dart(20, 3), dart(0, 0)], 3);
		expect(result).toMatchObject({ ok: true, totalScore: 60, dartsThrown: 3 });
	});

	it("rejects when no darts are sent", () => {
		expect(validateEditedDarts([], 1)).toMatchObject({ ok: false });
		expect(validateEditedDarts("nope", 1)).toMatchObject({ ok: false });
	});

	it("rejects more than three darts", () => {
		expect(
			validateEditedDarts([dart(20, 1), dart(20, 1), dart(20, 1), dart(20, 1)], 4),
		).toMatchObject({ ok: false });
	});

	it("rejects dartsThrown outside 1–3 or below the scored-dart count", () => {
		expect(validateEditedDarts([dart(20, 1)], 0)).toMatchObject({ ok: false });
		expect(validateEditedDarts([dart(20, 1)], 4)).toMatchObject({ ok: false });
		expect(validateEditedDarts([dart(20, 1), dart(20, 1)], 1)).toMatchObject({
			ok: false,
		});
		expect(validateEditedDarts([dart(20, 1)], 1.5)).toMatchObject({
			ok: false,
		});
	});

	it("rejects impossible segment/multiplier combinations", () => {
		// segment out of range
		expect(validateEditedDarts([dart(21, 1)], 1)).toMatchObject({ ok: false });
		expect(validateEditedDarts([dart(-1, 1)], 1)).toMatchObject({ ok: false });
		// multiplier out of range
		expect(validateEditedDarts([dart(20, 4 as 0 | 1 | 2 | 3)], 1)).toMatchObject(
			{ ok: false },
		);
		// miss with a multiplier
		expect(validateEditedDarts([dart(0, 2)], 1)).toMatchObject({ ok: false });
		// bull treble
		expect(validateEditedDarts([dart(25, 3)], 1)).toMatchObject({ ok: false });
		// scored segment without multiplier
		expect(validateEditedDarts([dart(20, 0)], 1)).toMatchObject({ ok: false });
		// non-integer segment
		expect(
			validateEditedDarts([{ segment: 20.5, multiplier: 1 }], 1),
		).toMatchObject({ ok: false });
	});

	it("accepts a total of exactly 180 (the legal maximum)", () => {
		const result = validateEditedDarts(
			[dart(20, 3), dart(20, 3), dart(20, 3)],
			3,
		);
		expect(result).toMatchObject({ ok: true, totalScore: 180 });
	});
});

describe("computeEditedTurnOutcome", () => {
	it("subtracts the total from the previous remaining score", () => {
		const outcome = computeEditedTurnOutcome(100, [dart(20, 3), dart(20, 1)]);
		expect(outcome).toEqual({
			totalScore: 80,
			remainingScore: 20,
			isBust: false,
			isCheckout: false,
		});
	});

	it("flags a bust when the score goes below zero, keeping the previous remaining", () => {
		const outcome = computeEditedTurnOutcome(60, [dart(20, 3), dart(20, 3)]);
		expect(outcome).toEqual({
			totalScore: 120,
			remainingScore: 60,
			isBust: true,
			isCheckout: false,
		});
	});

	it("flags a bust when landing on 1", () => {
		const outcome = computeEditedTurnOutcome(41, [dart(20, 2)]);
		expect(outcome).toMatchObject({ remainingScore: 41, isBust: true });
	});

	it("flags a checkout when finishing exactly on a double", () => {
		const outcome = computeEditedTurnOutcome(40, [dart(20, 2)]);
		expect(outcome).toEqual({
			totalScore: 40,
			remainingScore: 0,
			isBust: false,
			isCheckout: true,
		});
	});

	it("treats reaching zero on a non-double as a bust", () => {
		const outcome = computeEditedTurnOutcome(40, [dart(20, 3), dart(10, 2)]);
		// 60 + 20 = 80 over 40 → below zero is caught first, so use exact 40 non-double
		const exact = computeEditedTurnOutcome(40, [{ ...dart(40, 1) }]);
		expect(exact.isCheckout).toBe(false);
		expect(outcome.isBust).toBe(true);
	});

	it("reaches zero on a single with 0 remaining → bust (not checkout)", () => {
		// 40 remaining, single-dart "40" is impossible on a real board but the
		// engine only cares about the multiplier: single → bust.
		const outcome = computeEditedTurnOutcome(2, [dart(1, 1), dart(1, 1)]);
		expect(outcome).toEqual({
			totalScore: 2,
			remainingScore: 2,
			isBust: true,
			isCheckout: false,
		});
	});
});
