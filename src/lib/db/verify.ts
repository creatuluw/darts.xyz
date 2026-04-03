import postgres from 'postgres';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL!;

async function verify() {
  const sql = postgres(connectionString);

  try {
    // List all tables in the darts schema
    const tables = await sql`
      SELECT table_name, table_schema
      FROM information_schema.tables
      WHERE table_schema = 'darts'
      ORDER BY table_name
    `;
    console.log('\n📋 Tables in "darts" schema:');
    for (const t of tables) {
      console.log(`   - ${t.table_name}`);
    }

    // List all indexes in the darts schema
    const indexes = await sql`
      SELECT indexname, tablename
      FROM pg_indexes
      WHERE schemaname = 'darts'
      ORDER BY tablename, indexname
    `;
    console.log('\n🔖 Indexes:');
    for (const idx of indexes) {
      console.log(`   - ${idx.indexname} ON ${idx.tablename}`);
    }

    // List all constraints (checks, unique, foreign keys)
    const constraints = await sql`
      SELECT c.conname, c.contype, t.relname AS table_name
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      JOIN pg_namespace n ON c.connamespace = n.oid
      WHERE n.nspname = 'darts'
      ORDER BY t.relname, c.conname
    `;
    console.log('\n🔒 Constraints:');
    for (const c of constraints) {
      const typeMap: Record<string, string> = { c: 'CHECK', u: 'UNIQUE', p: 'PK', f: 'FK' };
      console.log(`   - [${typeMap[c.contype] || c.contype}] ${c.conname} ON ${c.table_name}`);
    }

    // Count columns per table
    const columns = await sql`
      SELECT table_name, COUNT(*) as col_count
      FROM information_schema.columns
      WHERE table_schema = 'darts'
      GROUP BY table_name
      ORDER BY table_name
    `;
    console.log('\n📊 Column counts:');
    for (const col of columns) {
      console.log(`   - ${col.table_name}: ${col.col_count} columns`);
    }

    console.log('\n✅ Verification complete!\n');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

verify();
