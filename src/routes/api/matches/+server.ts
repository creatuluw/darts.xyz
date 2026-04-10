import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";

export const GET: RequestHandler = async ({ url }) => {
  const email = url.searchParams.get("email");
  const playerId = url.searchParams.get("playerId");
  const status = url.searchParams.get("status");
  const limit = parseInt(url.searchParams.get("limit") || "20");

  if (email) {
    // Get matches filtered by email
    const matches = await dbService.getRecentMatches(limit, email);
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

  // If email provided, ensure player exists for this email
  let processedPlayers = players;
  if (email) {
    // For each player, associate with the email
    processedPlayers = await Promise.all(
      players.map(async (p: any, index: number) => {
        if (p.id) {
          return p;
        }
        // Create new player with email
        const newPlayer = await dbService.createPlayer(p.name, email);
        return { ...p, id: newPlayer.id };
      }),
    );
  }

  const match = await dbService.createMatch({
    startingScore,
    legsPerSet,
    setsPerMatch,
    doubleIn,
    accountId: email?.toLowerCase() || null,
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
