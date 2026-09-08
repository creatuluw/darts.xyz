import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";

/** Create a conquest game — returns the uuid that is the access key. */
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("state" in body)) {
    return json({ error: "Missing state" }, { status: 400 });
  }
  const game = await dbService.createConquestGame(body.state);
  return json({ id: game.id, updatedAt: game.updatedAt }, { status: 200 });
};
