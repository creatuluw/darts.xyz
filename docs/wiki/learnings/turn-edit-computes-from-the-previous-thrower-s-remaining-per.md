---
type: Learning
title: Turn edit computes from the previous thrower's remaining, persisting phantom bust rows
description: **Found by the 2026-11-13 gauntlet run** (`e2e/gauntlet/gauntlet.spec.ts`, evidence in `e2e/gauntlet/reports/G2.json`/`G5.json`/`G10.json`), new as of 2026-11-1
tags: [scoring, bug, api, turn-edit, testing]
timestamp: "2026-11-13T18:05:14.220Z"
---

# Turn edit computes from the previous thrower's remaining, persisting phantom bust rows

**Found by the 2026-11-13 gauntlet run** (`e2e/gauntlet/gauntlet.spec.ts`, evidence in `e2e/gauntlet/reports/G2.json`/`G5.json`/`G10.json`), new as of 2026-11-13 — distinct from the delete-restore bug.

**The bug** (both ends compute the same way — `PATCH /api/matches/[id]/turns` in `src/routes/api/matches/[id]/turns/+server.ts` and `editPreview` in `src/routes/match/[id]/+page.svelte`): the edited turn's outcome is computed from `legTurns[legTurns.length - 2].remainingScore` — the remaining score on the turn BEFORE the edited one, which belongs to the **previous thrower** — instead of the edited player's OWN remaining before their turn (their own prior turn's remainingScore, or startingScore).

**Observed behavior** (G2 step 3: Daan 301, threw T20 T20 T18 = 174 → true remaining 127; edit to T20 T20 T19 = 177): server computes 130 (Cleo's remaining, the previous thrower's) − 177 → negative → persists `isBust: true, remainingScore: 130`. UI after `loadMatch()` shows 130. Clean replay (chalkboard + `src/lib/game/scoring.ts`) says 127.

**3-axis signature**: API row remainingScore + UI (after edit) diverge from an engine replay of the effective turn list; the persisted row carries `isBust: true` where the player's own chain gives a normal score. In G6/G8/G9 the app's prev-thrower value coincided with the chalkboard (both axes green, engine axis red) — the corruption hides until the throw order makes the two chains differ.

**Cascade**: the persisted bust row re-chains every later comparison; edits made while corrupted state is on screen compute from the turns array (correct) but persist prev-thrower math, so one edit can poison the leg for the rest of the game (G5: Lina edit → 4 instead of 124; Milan edit → 4 instead of 121; final checkout never happens).

**The fix shape**: prevRemaining for an edited turn at index i must come from the edited player's own chain — `turns[i-2]` when the same player threw turn i−2, else startingScore (equivalently: the player's most recent own turn before i). Same rule applies to `deleteLastTurn`'s restore (see delete-last-turn-restore learning).

**Fixed (2026-11-13, fix described in commit `55e63ef`)**: `computePrevRemainingForPlayer()` in `src/lib/game/turn-edit.ts` derives prevRemaining by scanning backwards from idx−1 for the edited player's **own** prior turn (falling back to the leg starting score) — more robust than the `turns[i-2]` heuristic sketched above, since it survives any throw order. Used by both PATCH `/api/matches/[id]/turns` and the UI `editPreview`. Verified by the chalk-v4 gauntlet run (10/10 green) plus the 273-test unit baseline.
