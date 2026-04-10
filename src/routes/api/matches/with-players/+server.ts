import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";

export const GET: RequestHandler = async ({ url }) => {
  const email = url.searchParams.get("email");
  const limit = parseInt(url.searchParams.get("limit") || "50");

  const matches = await dbService.getRecentMatches(limit, email || undefined);

  // For each match, get the match players and their names
  const matchesWithPlayers = await Promise.all(
    matches.map(async (match) => {
      const matchPlayers = await dbService.getMatchPlayers(match.id);

      // Get player details for each match player
      const playersWithInfo = await Promise.all(
        matchPlayers.map(async (mp) => {
          const player = await dbService.getPlayer(mp.playerId);
          return {
            id: mp.id,
            playerId: mp.playerId,
            name: player?.name || "Unknown",
            throwOrder: mp.throwOrder,
            setsWon: mp.setsWon,
            legsWon: mp.legsWon,
          };
        }),
      );

      return {
        ...match,
        players: playersWithInfo,
      };
    }),
  );

  return json(matchesWithPlayers);
};
