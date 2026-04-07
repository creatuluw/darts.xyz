import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db, schema } from "$lib/db/index";
import { eq, isNotNull } from "drizzle-orm";

export const POST: RequestHandler = async ({ params }) => {
  const player = await db
    .select()
    .from(schema.players)
    .where(eq(schema.players.id, params.id))
    .limit(1);

  if (!player[0]) return json({ error: "Player not found" }, { status: 404 });
  if (!player[0].deletedAt) {
    return json({ error: "Player is not archived" }, { status: 400 });
  }

  await db
    .update(schema.players)
    .set({ deletedAt: null, updatedAt: new Date() })
    .where(eq(schema.players.id, params.id));

  return json({ success: true });
};
