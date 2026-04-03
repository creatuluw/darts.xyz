import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";

export const GET: RequestHandler = async ({ params }) => {
  const match = await dbService.getMatch(params.id);
  if (!match) return json({ error: "Match not found" }, { status: 404 });

  const matchPlayers = await dbService.getMatchPlayers(params.id);
  const legs = await dbService.getMatchLegs(params.id);

  return json({ match, matchPlayers, legs });
};

export const PATCH: RequestHandler = async ({ params, request }) => {
  const updates = await request.json();
  await dbService.updateMatch(params.id, updates);
  const match = await dbService.getMatch(params.id);
  return json(match);
};

export const DELETE: RequestHandler = async ({ params }) => {
  const match = await dbService.getMatch(params.id);
  if (!match) return json({ error: "Match not found" }, { status: 404 });

  await dbService.deleteMatch(params.id);
  return json({ success: true });
};
