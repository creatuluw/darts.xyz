import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dbService } from '$lib/db/database-service';

export const GET: RequestHandler = async ({ params }) => {
  const stats = await dbService.getPlayerStats(params.playerId);
  if (!stats) return json({ error: 'Stats not found' }, { status: 404 });
  return json(stats);
};
