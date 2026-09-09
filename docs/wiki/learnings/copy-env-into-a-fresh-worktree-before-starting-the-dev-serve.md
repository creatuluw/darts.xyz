---
type: Learning
title: Copy .env into a fresh worktree BEFORE starting the dev server — Vite loads it at startup only
description: Symptom
tags: [worktree, vite, env, dev-server, gotcha]
timestamp: "2026-09-09T11:06:55.539Z"
---

# Copy .env into a fresh worktree BEFORE starting the dev server — Vite loads it at startup only

## Symptom

Fresh worktree, dev server already running, then `.env` gets copied in (e.g. to run a migration). First API call fails:

```
GET /api/players error: Error: DATABASE_URL environment variable is not set
    at getDb (src/lib/db/index.ts)
```

It looks like missing config, but the file is right there.

## Cause

Vite loads `.env` **only at server startup**. A dev server started before `.env` exists never picks it up — no restart, no env vars.

## Fix

Copy `.env` into the worktree **before** running `npm run dev`; if the server is already up, restart it.

## House-worktree connection

Under the [[worktree-feature-loop]] every new worktree needs its `.env` copied — do it as part of setup, before anything that boots the dev server. Sibling of the `svelte-kit sync` worktree gotcha.
