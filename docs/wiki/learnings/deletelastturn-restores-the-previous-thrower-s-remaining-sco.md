---
type: Learning
title: deleteLastTurn restores the previous thrower's remaining score — gauntlet-confirmed
description: **Re-confirmed and pinned down by the 2026-11-13 gauntlet run** (`e2e/gauntlet/gauntlet.spec.ts` over `games.json`, reports in `e2e/gauntlet/reports/G*.json`), 
tags: [testing, scoring, bug, playwright, delete-turn]
timestamp: "2026-11-13T18:05:01.911Z"
---

# deleteLastTurn restores the previous thrower's remaining score — gauntlet-confirmed

**Re-confirmed and pinned down by the 2026-11-13 gauntlet run** (`e2e/gauntlet/gauntlet.spec.ts` over `games.json`, reports in `e2e/gauntlet/reports/G*.json`), first found in the 2026-10-28 neo-browser delete-turn campaign.

**The bug** (`deleteLastTurn` in `src/routes/match/[id]/+page.svelte`): after deleting the last turn, the deleted player's remaining score is restored from `turns[turns.length - 2].remainingScore` — but that is the turn BEFORE the deleted one, which belongs to the **previous thrower**, not the deleted player. The deleted player therefore inherits the previous thrower's remaining score. Correct restore = the player's own previous remaining (their own earlier turn's remainingScore, or startingScore).

**3-axis evidence shape** (G1 step 4, report `G1.json`): chalkboard + API rows + engine replay all say `[121, 244]`; the UI shows `[244, 244]` — Ann takes Ben's 244. Server-side state stays correct (the API row is genuinely deleted); only the UI state is corrupted, and `loadMatch()` (triggered by any later edit) heals it.

**Cascade signature**: after the corrupted delete, the player's next throw is computed from the wrong remaining — e.g. G1 step 5: Ann (UI 244, true 121) throws the 121 checkout → app scores 244−121=123, no checkout, match never completes. Also produces "bust-masked" steps where the corrupted remaining numerically equals the chalkboard (bust keeps it unchanged) so a step can pass while the persisted row is a bust a clean replay wouldn't produce (G4, G7).

**Coincidental passes**: G7 step 10's delete "passed" only because the previous thrower's remaining (127) happened to equal the deleted player's true remaining (127). A green delete step is not proof of correctness — check whether previous-thrower and own remaining coincide.
