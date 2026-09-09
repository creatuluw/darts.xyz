import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";

/**
 * Latest interview for a match — lets late-joining TVs replay the last one.
 * `?all=1` returns the full boundary history (oldest first) for the replay drawer.
 */
export const GET: RequestHandler = async ({ params, url }) => {
  if (url.searchParams.get("all") === "1") {
    const rows = await dbService.listCommentary(decodeURIComponent(params.matchRef));
    return json(rows);
  }
  const row = await dbService.getLatestCommentary(decodeURIComponent(params.matchRef));
  if (!row) return json({ error: "No commentary yet" }, { status: 404 });
  return json(row);
};
