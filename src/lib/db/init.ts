import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;

async function initSchema() {
  const sql = postgres(connectionString);

  try {
    // Create the darts schema if it doesn't exist
    await sql`CREATE SCHEMA IF NOT EXISTS darts`;
    console.log("✅ Ensured darts schema exists");

    console.log("\n🚀 Ready for: npm run db:push");
  } catch (error) {
    console.error("❌ Schema init failed:", error);
    throw error;
  } finally {
    await sql.end();
  }
}

initSchema();
