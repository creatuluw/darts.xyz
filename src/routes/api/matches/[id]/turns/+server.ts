import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";

export const GET: RequestHandler = async ({ params, url }) => {
  const legId = url.searchParams.get("legId");

  if (legId) {
    // Return turns for a specific leg
    const turns = await dbService.getLegTurns(legId);
    return json(turns);
  }

  // Return all turns for the entire match
  const legs = await dbService.getMatchLegs(params.id);
  const legIds = legs.map((l: any) => l.id);
  if (legIds.length === 0) return json([]);
  const turns = await dbService.getTurnsForLegs(legIds);
  return json(turns);
};

export const POST: RequestHandler = async ({ request }) => {
  const turnData = await request.json();
  const turn = await dbService.addTurn(turnData);
  return json(turn, { status: 201 });
};

export const DELETE: RequestHandler = async ({ params, url }) => {
  const turnId = params.id || url.searchParams.get("id");
  if (!turnId) return json({ error: "turnId required" }, { status: 400 });
  await dbService.deleteTurn(turnId);
  return json({ success: true });
};
