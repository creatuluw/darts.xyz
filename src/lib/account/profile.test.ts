import { describe, expect, it } from "vitest";
import {
	accountEmailsSame,
	ACCOUNT_EMAIL_MAX_LENGTH,
	PROFILE_NAME_MAX_LENGTH,
	validateAccountEmail,
	validateProfileName,
} from "./profile";

describe("validateProfileName", () => {
	it("accepts a plain name and trims whitespace", () => {
		expect(validateProfileName("Robin")).toEqual({
			ok: true,
			value: "Robin",
		});
		expect(validateProfileName("  Robin van Darts  ")).toEqual({
			ok: true,
			value: "Robin van Darts",
		});
	});

	it("accepts non-latin names and punctuation", () => {
		expect(validateProfileName("西村")).toMatchObject({ ok: true });
		expect(validateProfileName("De 'The Bull' Vries")).toMatchObject({
			ok: true,
		});
	});

	it("rejects empty, whitespace-only and non-string input", () => {
		expect(validateProfileName("")).toMatchObject({
			ok: false,
			error: "Name is required",
		});
		expect(validateProfileName("   ")).toMatchObject({ ok: false });
		expect(validateProfileName(undefined)).toMatchObject({ ok: false });
		expect(validateProfileName(null)).toMatchObject({ ok: false });
		expect(validateProfileName(42)).toMatchObject({ ok: false });
	});

	it("rejects names longer than the players.name column", () => {
		expect(
			validateProfileName("a".repeat(PROFILE_NAME_MAX_LENGTH)),
		).toMatchObject({ ok: true });
		expect(
			validateProfileName("a".repeat(PROFILE_NAME_MAX_LENGTH + 1)),
		).toMatchObject({ ok: false });
	});
});

describe("validateAccountEmail", () => {
	it("accepts valid emails and normalizes case + whitespace", () => {
		expect(validateAccountEmail("Robin@Example.COM")).toEqual({
			ok: true,
			value: "robin@example.com",
		});
		expect(validateAccountEmail("  robin+tags@sub.example.io  ")).toEqual({
			ok: true,
			value: "robin+tags@sub.example.io",
		});
	});

	it("rejects empty, non-string and malformed input", () => {
		expect(validateAccountEmail("")).toMatchObject({
			ok: false,
			error: "Email is required",
		});
		expect(validateAccountEmail("not-an-email")).toMatchObject({
			ok: false,
			error: "Invalid email format",
		});
		expect(validateAccountEmail("a@b")).toMatchObject({ ok: false });
		expect(validateAccountEmail("a b@example.com")).toMatchObject({
			ok: false,
		});
		expect(validateAccountEmail(123)).toMatchObject({ ok: false });
		expect(validateAccountEmail(undefined)).toMatchObject({ ok: false });
	});

	it("rejects emails longer than the varchar column", () => {
		const local = "a".repeat(64);
		const domain = `${"b".repeat(60)}.com`;
		expect(validateAccountEmail(`${local}@${domain}`)).toMatchObject({
			ok: true,
		});
		expect(
			validateAccountEmail(
				`${"a".repeat(ACCOUNT_EMAIL_MAX_LENGTH)}@example.com`,
			),
		).toMatchObject({ ok: false });
	});
});

describe("accountEmailsSame", () => {
	it("compares case-insensitively and ignores surrounding whitespace", () => {
		expect(accountEmailsSame("Robin@Example.com", "robin@example.com")).toBe(
			true,
		);
		expect(accountEmailsSame("  a@b.co ", "a@b.co")).toBe(true);
		expect(accountEmailsSame("a@b.co", "other@b.co")).toBe(false);
	});
});
