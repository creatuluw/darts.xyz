---
type: Rule
title: Never hardcode player slots in match UI
description: Guideline
timestamp: "2026-09-07T20:19:03.229Z"
---

# Never hardcode player slots in match UI

## Guideline

In any match UI, never hardcode player slots or indices (`players[0]`, `players[1]`, "P1 panel", "P2 panel"). Always loop over the roster and render per-player components generically.

## When it applies

Any page or component that renders player-specific UI: live scorer panels, stats, turn indicators, checkout hints.

## Rationale / evidence

The match engine (`src/lib/game/match-engine.ts`) and thrower rotation are fully player-count-generic. The live scorer at `src/routes/match/[id]/+page.svelte` nonetheless hardcoded exactly two side panels (`players[0]` left, `players[1]` right), so players 3–6 rotated turns correctly but had **no scoreboard at all** — a whole class of bug the engine can't catch. Fixed by extracting [[playerpanel]] and looping left/right columns. Any new player-indexed UI would reintroduce the same invisible-player bug.

## Consequence

Roster can be 1–6 players (see the match player limit decision); UI must render correctly for every size, using condensed [[playerpanel]] cards for 3+ (see the cards-around-the-board decision).
