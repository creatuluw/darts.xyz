---
type: Rule
title: Never trust client-submitted scores — recompute at the API boundary
description: "**Guideline:** When a client submits changes that touch derived game state (turn scores, conquest state, stats), never persist client-computed totals. Treat the"
tags: [api, trust-boundary, scoring, validation]
timestamp: "2026-11-13T17:28:16.308Z"
---

# Never trust client-submitted scores — recompute at the API boundary

**Guideline:** When a client submits changes that touch derived game state (turn scores, conquest state, stats), never persist client-computed totals. Treat the client payload as raw input only, and recompute all derived values server-side with the pure game-engine modules in `src/lib/game/`.

## When it applies

- Any write endpoint that mutates scoring state — the `darts.turns` rows today, conquest/live-game state tomorrow.
- Established by the turns PATCH endpoint (`bf1803e`, 2026-10-28): it validates raw darts via `src/lib/game/turn-edit.ts` (segment 0/1–20/25 only, no bull treble, miss ⇔ multiplier 0, ≤3 darts, ≤180 total) and recomputes `totalScore`/`remainingScore`/`isBust` with the scoring engine from the previous turn's `remainingScore`. Client-submitted totals are ignored.

## Key corollaries

- Reject (400) state transitions that belong to a different flow: an edit that would check out is refused — leg completion (winnerId, next leg, counters) stays the live submit flow's job, not a row update.
- Only the latest turn of a leg is editable: later turns chain their remaining scores off it, so editing earlier rows would orphan the chain.
- Resolve route params explicitly — on `matches/[id]/turns`, `params.id` is the **match id**. The old DELETE handler fell back to it (`params.id || query.id`), silently deleting nothing while returning 200. No fallback chains on identity params; see `docs/wiki/learnings/turns-delete-endpoint-silently-no-ops-params-id-match-id-sha.md`.

## Rationale

The client cannot be trusted: stale UI state, fat-fingered payloads, or deliberately manipulated requests. Recomputing keeps DB rows identical to what the engine would have produced, and every stats surface derives from those rows. Documented endpoint detail: `docs/wiki/pages/entities/turns-api-matches-id-turns.md`.
