import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dbService } from '$lib/db/database-service';

export const GET: RequestHandler = async ({ params }) => {
	const legs = await dbService.getMatchLegs(params.id);
	return json(legs);
};

export const POST: RequestHandler = async ({ params, request }) => {
	const { setNumber, legNumber, firstThrowerId } = await request.json();
	const leg = await dbService.createLeg(params.id, setNumber, legNumber, firstThrowerId);
	return json(leg, { status: 201 });
};
