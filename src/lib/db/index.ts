import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { DATABASE_URL } from "$env/static/private";
import * as schema from "./schema";

// Create the postgres client using SvelteKit's env system.
// Drizzle ORM generates fully-qualified queries (e.g. darts.players)
// automatically from the pgSchema("darts") table definitions.
const client = postgres(DATABASE_URL);

// Create the drizzle instance with our schema
export const db = drizzle(client, { schema });

// Export schema for use in queries
export { schema };
