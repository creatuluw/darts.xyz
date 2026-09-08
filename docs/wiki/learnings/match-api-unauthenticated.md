---
type: Learning
title: Match API is unauthenticated — the share link is the key
description: The fact
tags: [security, api, matches, spectator]
timestamp: "2026-09-08T19:45:57.666Z"
---

# Match API is unauthenticated — the share link is the key

## The fact

The match REST API under `src/routes/api/matches/` is **unauthenticated on read AND write**: `GET /api/matches/[id]` returns the full match (players, legs, turns) to anyone holding the UUID, and `PATCH`/`DELETE` on matches are equally open. There is no account check anywhere in that route.

## The de-facto security model

**The share link is the key.** Match IDs are UUIDs — unguessable in practice — so possession of the URL is the entire access-control story. This is fine for reads (what the TV spectator mode builds on, see [[decisions/tv-mode-url-tab-cast-polling]]) but means anyone with the TV link could also **tamper with or delete the match** via the write API.

## Status

Known and consciously deferred (2026-09-08): hardening the write API is explicitly out of scope for the TV feature PR and deserves its own task. Don't "discover" this as a new bug later — it was a deliberate, flagged acceptance. A silver lining: because reads are open and [[learnings/refresh-resume-needs-chronological-turn-order]] shows full state rebuilds from these same endpoints, a read-only polling spectator needs zero backend work.

## Source

- `src/routes/api/matches/[id]/+server.ts` — unauthenticated GET/PATCH/DELETE
