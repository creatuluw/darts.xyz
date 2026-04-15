import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";

export const GET: RequestHandler = async ({ url }) => {
  try {
    const accountId = url.searchParams.get("accountId");
    const sortBy = url.searchParams.get("sortBy");

    if (accountId && sortBy === "recent") {
      const players = await dbService.getPlayersSortedByRecentMatch(accountId);
      return json(players);
    }

    const players = await dbService.getAllPlayers(accountId || undefined);
    return json(players);
  } catch (error) {
    console.error("GET /api/players error:", error);
    return json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { name, accountId, playerEmail } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return json({ error: "Name is required" }, { status: 400 });
    }

    if (
      !accountId ||
      typeof accountId !== "string" ||
      accountId.trim().length === 0
    ) {
      return json({ error: "Account ID is required" }, { status: 400 });
    }

    const player = await dbService.createPlayer(
      name.trim(),
      accountId.trim().toLowerCase(),
      playerEmail || undefined,
    );
    return json(player, { status: 201 });
  } catch (error) {
    console.error("POST /api/players error:", error);
    return json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
};
