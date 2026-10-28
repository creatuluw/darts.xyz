---
type: Learning
title: Double-in is a dead toggle — saved and loaded, never enforced in scoring
description: "**Found during the 2026-10-28 four-game test sweep** (Game 3: 701 double-in, 2 players) — highest-severity finding of the sweep."
tags: [known-issue, scoring, bug, double-in, scoring.ts, test-sweep-2026-10-28]
timestamp: "2026-10-28T18:35:24.893Z"
---

# Double-in is a dead toggle — saved and loaded, never enforced in scoring

**Found during the 2026-10-28 four-game test sweep** (Game 3: 701 double-in, 2 players) — highest-severity finding of the sweep.

**Symptom:** with `doubleIn: true` on the match, both players scored their opening turns without ever hitting a double (A: S20×3 → 641, B: S19×3 → 644). Double-in should have voided those turns.

**Code-level confirmation:** `doubleIn` is saved at match creation and loaded (`src/routes/match/[id]/+page.svelte:425`) but **never read anywhere for scoring** — `src/lib/game/scoring.ts` has no double-in concept at all. The setup UI advertises the toggle; the game plays straight-in regardless. Dead toggle.

**Contrast:** double-out IS enforced — hardcoded in scoring (bust on remaining < 0, = 1, or a non-double finish). The in/out rules are asymmetric: out is hardcoded and enforced, in is persisted but inert.

**Fix shape:** enforcement belongs in `scoring.ts` (turn-level validity: before the first double lands, the turn must not reduce the score), driven off the loaded `doubleIn` flag. See [[rules/logic-todos-must-use-tdd-skill]] — TDD it.
