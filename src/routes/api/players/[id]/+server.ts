import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";

export const GET: RequestHandler = async ({ params }) => {
  const player = await dbService.getPlayer(params.id);
  if (!player) return json({ error: "Player not found" }, { status: 404 });
  return json(player);
};
