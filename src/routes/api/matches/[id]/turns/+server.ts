import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dbService } from '$lib/db/database-service';

export const GET: RequestHandler = async ({ url }) => {
  const legId = url.searchParams.get('legId');
  if (!legId) return json({ error: 'legId required' }, { status: 400 });
  const turns = await dbService.getLegTurns(legId);
  return json(turns);
};

export const POST: RequestHandler = async ({ request }) => {
  const turnData = await request.json();
  const turn = await dbService.addTurn(turnData);
  return json(turn, { status: 201 });
};
