import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";

export const GET: RequestHandler = async ({ url }) => {
  const accountId = url.searchParams.get("accountId");
  const playerId = url.searchParams.get("playerId");
  const status = url.searchParams.get("status");
  const limit = parseInt(url.searchParams.get("limit") || "20");

  if (accountId) {
    const matches = await dbService.getRecentMatches(limit, accountId);
    return json(matches);
  }

  if (playerId) {
    const matches = await dbService.getMatchesForPlayer(playerId);
    return json(matches);
  }
  if (status === "active") {
    const matches = await dbService.getActiveMatches();
    return json(matches);
  }
  const matches = await dbService.getRecentMatches(limit);
  return json(matches);
};

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const {
    email,
    startingScore = 501,
    legsPerSet = 3,
    setsPerMatch = 1,
    doubleIn = false,
    players = [],
  } = body;

  const accountId = email?.toLowerCase() || null;

  if (!Array.isArray(players) || players.length < 1 || players.length > 6) {
    return json(
      { error: "A match needs between 1 and 6 players" },
      { status: 400 },
    );
  }

  // If accountId provided, ensure players exist for this account
  let processedPlayers = players;
  if (accountId) {
    processedPlayers = await Promise.all(
      players.map(async (p: any) => {
        if (p.id) {
          return p;
        }
        // Create new player associated with this account
        const newPlayer = await dbService.createPlayer(p.name, accountId);
        return { ...p, id: newPlayer.id };
      }),
    );
  }

  const match = await dbService.createMatch({
    startingScore,
    legsPerSet,
    setsPerMatch,
    doubleIn,
    accountId,
  });

  // Add players to match
  for (let i = 0; i < processedPlayers.length; i++) {
    await dbService.addMatchPlayer(match.id, processedPlayers[i].id, i + 1);
  }

  // Create first leg
  const matchPlayers = await dbService.getMatchPlayers(match.id);
  const firstThrowerId = matchPlayers.length > 0 ? matchPlayers[0].id : "";
  const firstLeg = await dbService.createLeg(match.id, 1, 1, firstThrowerId);

  return json({ match, firstLeg, matchPlayers }, { status: 201 });
};
