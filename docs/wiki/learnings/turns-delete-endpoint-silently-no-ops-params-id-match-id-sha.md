---
type: Learning
title: Turns DELETE endpoint silently no-ops — params.id (match id) shadows the turn-id query param
description: **Found during the 2026-10-28 neo-browser delete-turn test campaign** (2-player match `96c568e8`, 3-player match `02cae89f`).
tags: [api, bug, turns, delete, playtest]
timestamp: "2026-10-28T18:11:08.334Z"
---

# Turns DELETE endpoint silently no-ops — params.id (match id) shadows the turn-id query param

**Found during the 2026-10-28 neo-browser delete-turn test campaign** (2-player match `96c568e8`, 3-player match `02cae89f`).

**The bug:** the turns DELETE handler resolves its id with `params.id || url.searchParams.get("id")`. The route is `/api/matches/[id]/turns`, so `params.id` is the **match id** — it always wins the `||`, and `deleteTurn` is fed the match id instead of the turn id. Result: the endpoint returns `200 {success:true}` but **deletes nothing**.

**The visible symptom chain:**
1. UI's `deleteLastTurn` removes the turn from local state and decrements the score — looks like it worked.
2. Server still has all turns. UI and server have now diverged.
3. **Refresh resurrects the "deleted" turn** — the ghost turn comes back with its score, and thrower rotation re-derives from the restored chronological turns (demoting the current thrower).

**Fix direction:** the handler must take the turn id exclusively from the query param (or the body), never fall back to `params.id` — on this route `params.id` is structurally the wrong key. `deleteTurn` itself is clean; only the handler's id resolution is broken.
