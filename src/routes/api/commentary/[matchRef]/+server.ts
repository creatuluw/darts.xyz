import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";

/** Latest interview for a match — lets late-joining TVs replay the last one. */
export const GET: RequestHandler = async ({ params }) => {
  const row = await dbService.getLatestCommentary(decodeURIComponent(params.matchRef));
  if (!row) return json({ error: "No commentary yet" }, { status: 404 });
  return json(row);
};
