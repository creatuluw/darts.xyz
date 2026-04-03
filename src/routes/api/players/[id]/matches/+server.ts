import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";

export const GET: RequestHandler = async ({ params }) => {
  const matches = await dbService.getMatchesForPlayer(params.id);
  return json(matches);
};
