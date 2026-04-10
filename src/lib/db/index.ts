import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Lazy initialization for database connection
// This defers DATABASE_URL access to runtime (not build time)
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    // Use process.env for runtime access (not $env/static/private which is build-time)
    const DATABASE_URL =
      typeof process !== "undefined" ? process.env?.DATABASE_URL : undefined;
    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    const client = postgres(DATABASE_URL);
    _db = drizzle(client, { schema });
  }
  return _db;
}

// Export schema for use in queries
export { schema };
