import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";

export const GET: RequestHandler = async ({ params }) => {
  const player = await dbService.getPlayer(params.id);
  if (!player) return json({ error: "Player not found" }, { status: 404 });
  return json(player);
};

export const PATCH: RequestHandler = async ({ params, request }) => {
  try {
    const { playerEmail } = await request.json();

    if (
      playerEmail !== undefined &&
      playerEmail !== null &&
      typeof playerEmail === "string"
    ) {
      const trimmed = playerEmail.trim();
      if (trimmed.length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
          return json({ error: "Invalid email format" }, { status: 400 });
        }
      }
      await dbService.updatePlayerEmail(params.id, trimmed || null);
    }

    const updated = await dbService.getPlayer(params.id);
    return json(updated);
  } catch (error) {
    console.error("PATCH /api/players/[id] error:", error);
    return json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  await dbService.softDeletePlayer(params.id);
  return json({ success: true });
};
