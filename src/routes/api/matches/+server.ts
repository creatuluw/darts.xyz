import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dbService } from '$lib/db/database-service';

export const GET: RequestHandler = async ({ url }) => {
  const playerId = url.searchParams.get('playerId');
  const status = url.searchParams.get('status');
  const limit = parseInt(url.searchParams.get('limit') || '20');

  if (playerId) {
    const matches = await dbService.getMatchesForPlayer(playerId);
    return json(matches);
  }
  if (status === 'active') {
    const matches = await dbService.getActiveMatches();
    return json(matches);
  }
  const matches = await dbService.getRecentMatches(limit);
  return json(matches);
};

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { startingScore = 501, legsPerSet = 3, setsPerMatch = 1, doubleIn = false, players = [] } = body;

  const match = await dbService.createMatch({ startingScore, legsPerSet, setsPerMatch, doubleIn });

  // Add players to match
  for (let i = 0; i < players.length; i++) {
    await dbService.addMatchPlayer(match.id, players[i].id, i + 1);
  }

  // Create first leg
  const matchPlayers = await dbService.getMatchPlayers(match.id);
  const firstThrowerId = matchPlayers.length > 0 ? matchPlayers[0].id : '';
  const firstLeg = await dbService.createLeg(match.id, 1, 1, firstThrowerId);

  return json({ match, firstLeg, matchPlayers }, { status: 201 });
};
