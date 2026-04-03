import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";

export const PATCH: RequestHandler = async ({ params, request }) => {
  const matchId = params.id;
  const matchPlayerId = params.playerId;
  const body = await request.json();
  const { setsWon, legsWon } = body;

  // Get the match player to find the actual playerId
  const matchPlayers = await dbService.getMatchPlayers(matchId);
  const matchPlayer = matchPlayers.find((mp) => mp.id === matchPlayerId);

  if (!matchPlayer) {
    return json({ error: "Match player not found" }, { status: 404 });
  }

  // Update the match player's setsWon and legsWon
  await dbService.updateMatchPlayerSets(
    matchId,
    matchPlayer.playerId,
    setsWon ?? matchPlayer.setsWon,
    legsWon ?? matchPlayer.legsWon,
  );

  return json({ success: true });
};
