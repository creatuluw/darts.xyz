import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dbService } from '$lib/db/database-service';

export const GET: RequestHandler = async () => {
	const players = await dbService.getAllPlayers();
	return json(players);
};

export const POST: RequestHandler = async ({ request }) => {
	const { name } = await request.json();
	if (!name || typeof name !== 'string' || name.trim().length === 0) {
		return json({ error: 'Name is required' }, { status: 400 });
	}
	const player = await dbService.createPlayer(name.trim());
	return json(player, { status: 201 });
};
