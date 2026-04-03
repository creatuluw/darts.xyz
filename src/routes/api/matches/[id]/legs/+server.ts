import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";

export const GET: RequestHandler = async ({ params }) => {
  const legs = await dbService.getMatchLegs(params.id);
  return json(legs);
};

export const POST: RequestHandler = async ({ params, request }) => {
  const { setNumber, legNumber, firstThrowerId } = await request.json();
  const leg = await dbService.createLeg(
    params.id,
    setNumber,
    legNumber,
    firstThrowerId,
  );
  return json(leg, { status: 201 });
};

export const PATCH: RequestHandler = async ({ params, request }) => {
  const { legId, winnerId } = await request.json();

  if (!legId || !winnerId) {
    return json({ error: "legId and winnerId are required" }, { status: 400 });
  }

  await dbService.updateLegWinner(legId, winnerId);
  return json({ success: true });
};
