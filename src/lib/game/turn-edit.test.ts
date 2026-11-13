import { describe, it, expect } from "vitest";
import {
	validateEditedDarts,
	computeEditedTurnOutcome,
	computePrevRemainingForPlayer,
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

describe("computePrevRemainingForPlayer", () => {
	// A 2-player leg from 301: p1 throws 180, p2 throws 60, p1 busts (180),
	// p2 busts (60). Persisted rows in turn order:
	const turns = [
		{ playerId: "p1", remainingScore: 121 },
		{ playerId: "p2", remainingScore: 241 },
		{ playerId: "p1", remainingScore: 121 }, // bust keeps 121
		{ playerId: "p2", remainingScore: 241 }, // bust keeps 241
	];

	it("uses the same player's last prior remaining, not the previous row", () => {
		// Editing turn 4 (p2): the previous row is p1's 121 — wrong chain.
		expect(computePrevRemainingForPlayer(turns, 3, "p2", 301)).toBe(241);
	});

	it("falls back to the leg starting score on the player's first turn", () => {
		expect(computePrevRemainingForPlayer(turns, 1, "p2", 301)).toBe(301);
		expect(computePrevRemainingForPlayer(turns, 0, "p1", 301)).toBe(301);
	});

	it("skips over other players' rows in a 3-player rotation", () => {
		const three = [
			{ playerId: "a", remainingScore: 241 },
			{ playerId: "b", remainingScore: 261 },
			{ playerId: "c", remainingScore: 271 },
			{ playerId: "a", remainingScore: 201 },
			{ playerId: "b", remainingScore: 221 },
		];
		// Editing turn 5 (b, idx 4): skip a and c — b's own last PRIOR row is
		// idx 1 (261); the 221 row is the edited turn itself and is skipped.
		expect(computePrevRemainingForPlayer(three, 4, "b", 301)).toBe(261);
		// Editing turn 4 (a, idx 3): a's own last prior remaining is 241 — the
		// 201 row is the edited turn ITSELF (its post-turn value) and is skipped.
		expect(computePrevRemainingForPlayer(three, 3, "a", 301)).toBe(241);
	});

	it("treats a bust row's unchanged remaining as the pre-turn score", () => {
		// p1 busts on turn 3 (row keeps 121): editing a hypothetical later p1
		// turn must chain from 121 — exactly what the bust row persists.
		expect(computePrevRemainingForPlayer(turns, 4, "p1", 301)).toBe(121);
	});
});
