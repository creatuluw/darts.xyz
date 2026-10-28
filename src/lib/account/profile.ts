/**
 * Pure validation helpers for player name / account email edits.
 *
 * Kept free of DB and $env imports so vitest (node environment) can test the
 * logic the API routes and the database service rely on.
 */

export const PROFILE_NAME_MAX_LENGTH = 100; // players.name varchar(100)
export const ACCOUNT_EMAIL_MAX_LENGTH = 255; // account_id/player_email varchar(255)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidationResult =
	| { ok: true; value: string }
	| { ok: false; error: string };

/** Validate a player display name: non-empty after trim, fits the column. */
export function validateProfileName(input: unknown): ValidationResult {
	if (typeof input !== "string") {
		return { ok: false, error: "Name is required" };
	}
	const trimmed = input.trim();
	if (trimmed.length === 0) {
		return { ok: false, error: "Name is required" };
	}
	if (trimmed.length > PROFILE_NAME_MAX_LENGTH) {
		return {
			ok: false,
			error: `Name must be at most ${PROFILE_NAME_MAX_LENGTH} characters`,
		};
	}
	return { ok: true, value: trimmed };
}

/** Validate an account email: non-empty, valid format, normalized (trim + lowercase). */
export function validateAccountEmail(input: unknown): ValidationResult {
	if (typeof input !== "string") {
		return { ok: false, error: "Email is required" };
	}
	const normalized = input.trim().toLowerCase();
	if (normalized.length === 0) {
		return { ok: false, error: "Email is required" };
	}
	if (normalized.length > ACCOUNT_EMAIL_MAX_LENGTH) {
		return {
			ok: false,
			error: `Email must be at most ${ACCOUNT_EMAIL_MAX_LENGTH} characters`,
		};
	}
	if (!EMAIL_REGEX.test(normalized)) {
		return { ok: false, error: "Invalid email format" };
	}
	return { ok: true, value: normalized };
}

/** Case-insensitive email equality (both sides normalized). */
export function accountEmailsSame(a: string, b: string): boolean {
	return a.trim().toLowerCase() === b.trim().toLowerCase();
}
