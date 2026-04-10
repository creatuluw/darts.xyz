import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";

export const GET: RequestHandler = async ({ url }) => {
  try {
    const email = url.searchParams.get("email");
    const players = await dbService.getAllPlayers(email || undefined);
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
    const { name, email } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return json({ error: "Name is required" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || email.trim().length === 0) {
      return json({ error: "Email is required" }, { status: 400 });
    }

    const player = await dbService.createPlayer(
      name.trim(),
      email.trim().toLowerCase(),
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
