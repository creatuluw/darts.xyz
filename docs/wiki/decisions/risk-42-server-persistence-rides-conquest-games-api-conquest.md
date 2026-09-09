---
type: Decision
title: Risk 42 server persistence rides conquest_games + /api/conquest — sessionStorage stopgap superseded
description: Context
tags: [risk-42, persistence, conquest-games, api-reuse]
status: accepted
supersedes: "["risk-42-v1-persists-to-sessionstorage-stopgap-server-write-t"]"
timestamp: "2026-09-09T12:19:50.347Z"
---

# Risk 42 server persistence rides conquest_games + /api/conquest — sessionStorage stopgap superseded

## Context

The user asked why `/match/risk` has no TV/2nd-screen cast button. Answer: classic and conquest TV views poll server-persisted state, but Risk 42 v1 state lived only in `sessionStorage` (the superseded stopgap) — a new tab can't read it, so a TV route had nothing to render. The user then asked to make Risk persist like normal matches, pulling M3 forward.

## Decision

**Risk 42 persists to the server NOW, riding the existing conquest persistence surface — no new table, no new API.** `/match/risk` write-throughs every dart as a fire-and-forget PATCH to the existing `/api/conquest` endpoints and resumes from the server on page load. The `risk42_state` sessionStorage stopgap is deleted.

- **Storage**: the existing `conquest_games` table — state is an opaque jsonb blob keyed by uuid, exactly what Risk 42 needs. Zero backend diff.
- **Payload shape**: `{ game, players: [{ id, name }] }` — the engine state carries only player ids, so player names ride alongside in the wrapper (the same shape the sessionStorage blob held). The API stays opaque to the difference.

## Alternatives considered

1. **Wait for M3** (original plan) — rejected; the user asked for it now.
2. **Own `risk42_games` table + own API** mirroring the original conquest cut — rejected; the opaque jsonb + uuid endpoints already fit exactly, and reusing them means no migration, no new routes, no new regression surface.
3. **BroadcastChannel same-browser cast stopgap** — superseded by real persistence.

## Consequences

- Reload and fresh-session resume work for Risk 42; the planned TV view (`/match/risk` + world-map cast page) is now unblocked.
- The conquest endpoints now serve two game modes — conquest-api + tv-conquest E2E kept green alongside the new `e2e/risk-persist.spec.ts` (write-through round-trip + fresh-session resume).
- If Risk 42 state ever needs server-side querying, the jsonb opacity is the constraint to lift.
- Shipped as PR #13 (worktree `kees-risk42-server-persist`, branch `feature/risk42-server-persist`); per house rule the user merges.
