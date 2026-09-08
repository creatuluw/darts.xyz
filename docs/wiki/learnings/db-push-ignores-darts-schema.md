---
type: Learning
title: "db:push ignores the darts schema — migrations are file-as-record, applied directly"
description: "`drizzle-kit push` (npm `db:push`) only manages the **`public`** schema — it silently ignores the `darts` schema, so a push can "succeed" while the table never "
tags: [drizzle, database, migrations, gotcha]
timestamp: "2026-09-08T21:25:12.550Z"
---

# db:push ignores the darts schema — migrations are file-as-record, applied directly

`drizzle-kit push` (npm `db:push`) only manages the **`public`** schema — it silently ignores the `darts` schema, so a push can "succeed" while the table never lands in the DB. The `darts` schema is driven by `drizzle-kit migrate` + `drizzle/meta/_journal.json`.

The journal is **stale by design in this repo**: migrations 0002–0007 were never journaled (applied directly to the DB). So the established pattern for a new migration:

1. Write `drizzle/000N_*.sql` and register it in `meta/_journal.json` **as a record only**
2. Apply the SQL directly to the DB (e.g. `psql` / script), NOT via `drizzle-kit migrate` — the journal gaps would make it try to replay/conflict

Symptom of getting it wrong: table missing after a "successful" push; direct `SELECT` confirms absence.
