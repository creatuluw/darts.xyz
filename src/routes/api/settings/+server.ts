import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";

export const GET: RequestHandler = async ({ url }) => {
  const accountId = url.searchParams.get("accountId");
  if (!accountId) {
    return json({ error: "accountId is required" }, { status: 400 });
  }

  try {
    const settings = await dbService.getAccountSettings(accountId);
    return json(settings || {});
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
};

export const PUT: RequestHandler = async ({ request }) => {
  try {
    const { accountId, smtpHost, smtpPort, smtpUser, smtpPassword, smtpFrom } =
      await request.json();

    if (!accountId || typeof accountId !== "string") {
      return json({ error: "accountId is required" }, { status: 400 });
    }

    const settings: {
      smtpHost?: string | null;
      smtpPort?: number | null;
      smtpUser?: string | null;
      smtpPassword?: string | null;
      smtpFrom?: string | null;
    } = {};

    if (smtpHost !== undefined) settings.smtpHost = smtpHost || null;
    if (smtpPort !== undefined)
      settings.smtpPort = smtpPort ? Number(smtpPort) : null;
    if (smtpUser !== undefined) settings.smtpUser = smtpUser || null;
    if (smtpPassword !== undefined)
      settings.smtpPassword = smtpPassword || null;
    if (smtpFrom !== undefined) settings.smtpFrom = smtpFrom || null;

    const result = await dbService.upsertAccountSettings(accountId, settings);
    return json(result);
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
};
