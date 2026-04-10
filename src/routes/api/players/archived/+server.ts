import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getDb, schema } from "$lib/db/index";
import { isNull, isNotNull, desc } from "drizzle-orm";

export const GET: RequestHandler = async () => {
  const archived = await getDb()
    .select()
    .from(schema.players)
    .where(isNotNull(schema.players.deletedAt))
    .orderBy(desc(schema.players.deletedAt));
  return json(archived);
};
