/**
 * Pure validation for editing a persisted turn's darts (PATCH /api/matches/[id]/turns).
 *
 * Kept free of DB and $env imports so vitest (node environment) can test the
 * exact rules the API route enforces. Bust/checkout semantics come from the
 * scoring engine (src/lib/game/scoring.ts) so an edited turn can never violate
 * what a freshly-entered turn could not.
 */

import type { DartData, Multiplier } from "./types";
import {
	calculateDartScore,
	detectBust,
	detectCheckout,
} from "./scoring";

export const MAX_TURN_SCORE = 180;
export const DARTS_PER_TURN = 3;

/** A dart as sent by the client: segment × multiplier (score is recomputed). */
export interface RawDartInput {
	segment: number;
	multiplier: number;
}

export type TurnEditValidation =
	| {
			ok: true;
			darts: DartData[];
			totalScore: number;
			dartsThrown: number;
	  }
	| { ok: false; error: string };

function isInt(n: unknown): n is number {
	return typeof n === "number" && Number.isInteger(n);
}

/** Validate one dart: segment 0 (miss) or 1–20 / 25 (bull) with a legal multiplier. */
function validateDart(dart: unknown, index: number): DartData | string {
	if (typeof dart !== "object" || dart === null) {
		return `Dart ${index + 1} is required`;
	}
	const { segment, multiplier } = dart as Record<string, unknown>;
	if (!isInt(segment) || !isInt(multiplier)) {
		return `Dart ${index + 1}: segment and multiplier must be integers`;
	}
	if (segment < 0 || segment > 25 || (segment > 20 && segment < 25)) {
		return `Dart ${index + 1}: segment must be 0 (miss), 1–20 or 25`;
	}
	if (multiplier < 0 || multiplier > 3) {
		return `Dart ${index + 1}: multiplier must be 0–3`;
	}
	if (segment === 0 && multiplier !== 0) {
		return `Dart ${index + 1}: a miss must have multiplier 0`;
	}
	if (segment === 25 && multiplier > 2) {
		return `Dart ${index + 1}: the bull has no treble`;
	}
	if (segment > 0 && multiplier === 0) {
		return `Dart ${index + 1}: a scored dart must have multiplier 1–3`;
	}
	return {
		segment,
		multiplier: multiplier as Multiplier,
		score: calculateDartScore(segment, multiplier as Multiplier),
	};
}

/**
 * Validate an edited turn's darts the client wants to persist.
 *
 * `darts` holds the darts actually entered (1–3, misses included);
 * `dartsThrown` is the number of darts the player threw (misses count).
 * Total score is recomputed server-side — never trusted from the client.
 */
export function validateEditedDarts(
	dartsInput: unknown,
	dartsThrownInput: unknown,
): TurnEditValidation {
	if (!Array.isArray(dartsInput) || dartsInput.length === 0) {
		return { ok: false, error: "At least one dart is required" };
	}
	if (dartsInput.length > DARTS_PER_TURN) {
		return {
			ok: false,
			error: `A turn has at most ${DARTS_PER_TURN} darts`,
		};
	}
	if (!isInt(dartsThrownInput)) {
		return { ok: false, error: "dartsThrown must be an integer" };
	}
	if (dartsThrownInput < 1 || dartsThrownInput > DARTS_PER_TURN) {
		return {
			ok: false,
			error: `dartsThrown must be between 1 and ${DARTS_PER_TURN}`,
		};
	}
	if (dartsThrownInput < dartsInput.length) {
		return {
			ok: false,
			error: "dartsThrown cannot be lower than the number of scored darts",
		};
	}

	const darts: DartData[] = [];
	for (let i = 0; i < dartsInput.length; i++) {
		const dart = validateDart(dartsInput[i], i);
		if (typeof dart === "string") return { ok: false, error: dart };
		darts.push(dart);
	}

	const totalScore = darts.reduce((sum, d) => sum + d.score, 0);
	if (totalScore > MAX_TURN_SCORE) {
		return {
			ok: false,
			error: `A turn cannot score more than ${MAX_TURN_SCORE}`,
		};
	}

	return { ok: true, darts, totalScore, dartsThrown: dartsThrownInput };
}

/** What an edited turn does to the leg, computed with the scoring engine. */
export interface EditedTurnOutcome {
	totalScore: number;
	remainingScore: number;
	isBust: boolean;
	isCheckout: boolean;
}

/**
 * Recompute total/bust/remaining for an edited turn given the remaining
 * score the player had when the turn started. Mirrors submitTurn in
 * match-engine.ts without mutating any state.
 */
export function computeEditedTurnOutcome(
	prevRemaining: number,
	darts: DartData[],
): EditedTurnOutcome {
	const totalScore = darts.reduce((sum, d) => sum + d.score, 0);
	const lastMultiplier = darts.length
		? darts[darts.length - 1].multiplier
		: 0;
	const isBust = detectBust(
		prevRemaining,
		totalScore,
		lastMultiplier,
		darts.length,
	);
	const isCheckout = detectCheckout(
		prevRemaining,
		totalScore,
		lastMultiplier,
	);
	return {
		totalScore,
		remainingScore: isBust ? prevRemaining : prevRemaining - totalScore,
		isBust,
		isCheckout,
	};
}
