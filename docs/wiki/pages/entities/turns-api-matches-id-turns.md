---
type: Entity
title: "Turns API (matches/[id]/turns)"
description: Turns API
timestamp: "2026-10-28T20:03:31.367Z"
---

# Turns API (matches/[id]/turns)

# Turns API

The REST endpoints for match turns: `src/routes/api/matches/[id]/turns/+server.ts` — every persisted dart of a classic match lives here. The match page (see [live-match-page](./live-match-page.md)) reads turns from it on every load and writes through on every submitted turn.

## Details

- **Location**: `src/routes/api/matches/[id]/turns/+server.ts` — note `params.id` on this route is the **match id**
- **Turn row shape** (`darts.turns` table, see `src/lib/db/schema.ts`): `legId`, `playerId`, `turnNumber`, `dart1/2/3{Score,Multiplier,Segment}` (smallint; miss = segment 0/multiplier 0/score 0), `totalScore`, `remainingScore`, `isBust`, `dartsThrown` (1–3, misses count). DB checks: multiplier ∈ 0–3, dartsThrown 1–3.
- **GET**: `?legId=` returns one leg's turns; without it, all turns of the match (chronological — callers rely on the last element being the latest).
- **POST**: persists a submitted turn (the match page sends the full row, mirroring `submitTurn`'s output).
- **DELETE** `?id=<turnId>`: removes a turn. **History**: the handler used to resolve the id as `params.id || url.searchParams.get("id")` — the match id always won the `||`, so the endpoint returned `200 {success:true}` while deleting nothing (found in the 2026-10-28 delete-turn test campaign, [learning](../../learnings/turns-delete-endpoint-silently-no-ops-params-id-match-id-sha.md)). Fixed in `bf1803e`: the turn id comes exclusively from the query param.
- **PATCH** (added `bf1803e`, 2026-10-28): edits the darts of the **latest turn of an in-progress leg**. Body/query: `turnId` + `darts: [{segment, multiplier}]` (1–3) + `dartsThrown`. The server never trusts client totals — it validates via the pure module `src/lib/game/turn-edit.ts` and recomputes `totalScore`/`remainingScore`/`isBust` with the scoring engine (`detectBust`/`detectCheckout`) from the previous turn's `remainingScore`. Rejections (400): finished leg (`legs.winnerId` set), non-in-progress match, non-latest turn of the leg, illegal darts (segment 0/1–20/25 only, no bull treble, miss ⇔ multiplier 0, ≤3 darts, ≤180 total), and **any edit that would check out** — leg completion (winnerId, next leg, counters) is the live submit flow's job, not a row update.
- **Edit UI**: pencil icon on [playerpanel](./playerpanel.md) → in-page dialog on the [live match page](./live-match-page.md) → PATCH → full `loadMatch()` rebuild so all stats stay derived from state.

## Relationships

- [live-match-page](./live-match-page.md) — the only UI consumer (GET/POST/DELETE/PATCH)
- [playerpanel](./playerpanel.md) — hosts the delete/edit affordances that call DELETE/PATCH
- [test-suite](../artifacts/test-suite.md) — `src/lib/game/turn-edit.test.ts` covers the PATCH validation rules (13 tests)

## Lifecycle

- First added: with the core match flow (GET/POST/DELETE).
- 2026-10-28 (`bf1803e`): DELETE id-resolution bug fixed (turn id from query param only); PATCH turn-edit endpoint + `turn-edit.ts` validation module added.
