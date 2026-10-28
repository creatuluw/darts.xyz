import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";
import {
	accountEmailsSame,
	validateAccountEmail,
} from "$lib/account/profile";

/**
 * Change the signed-in account's email address. The email IS the accountId,
 * so the service re-keys every players / matches / account_settings row in
 * one transaction. The client must also rename the email in its local stores
 * (see emailStore.renameEmail) to keep remember-me consistent.
 */
export const PATCH: RequestHandler = async ({ request }) => {
  try {
    const { accountId, newEmail } = await request.json();

    const current = validateAccountEmail(accountId);
    if (!current.ok) {
      return json({ error: current.error }, { status: 400 });
    }
    const next = validateAccountEmail(newEmail);
    if (!next.ok) {
      return json({ error: next.error }, { status: 400 });
    }

    if (accountEmailsSame(current.value, next.value)) {
      return json({ changed: false, email: current.value });
    }

    const inUse = await dbService.isAccountEmailInUse(next.value);
    if (inUse) {
      return json(
        { error: "That email address is already in use by another account" },
        { status: 409 },
      );
    }

    const moved = await dbService.changeAccountEmail(
      current.value,
      next.value,
    );
    if (moved.players === 0 && moved.matches === 0 && moved.settings === 0) {
      return json({ error: "Account not found" }, { status: 404 });
    }

    return json({ changed: true, email: next.value, ...moved });
  } catch (error) {
    console.error("PATCH /api/account/email error:", error);
    return json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
};
