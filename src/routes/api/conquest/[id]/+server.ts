import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";

export const GET: RequestHandler = async ({ params }) => {
  const game = await dbService.getConquestGame(params.id);
  if (!game) return json({ error: "Conquest game not found" }, { status: 404 });
  return json({ id: game.id, state: game.state, updatedAt: game.updatedAt });
};

/** Write-through from the scorer on every dart. */
export const PATCH: RequestHandler = async ({ params, request }) => {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("state" in body)) {
    return json({ error: "Missing state" }, { status: 400 });
  }
  const game = await dbService.saveConquestGame(params.id, body.state);
  if (!game) return json({ error: "Conquest game not found" }, { status: 404 });
  return json({ id: game.id, updatedAt: game.updatedAt });
};
