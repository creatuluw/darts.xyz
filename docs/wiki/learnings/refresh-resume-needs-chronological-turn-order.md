---
type: Learning
title: Refresh-resume depends on chronological turn order and persisted firstThrowerId
description: "Refreshing the browser mid-leg (resume logic in `src/routes/match/[id]/+page.svelte`) silently depends on two implicit contracts. Breaking either reproduces the"
timestamp: "2026-09-07T20:39:11.751Z"
---

# Refresh-resume depends on chronological turn order and persisted firstThrowerId

Refreshing the browser mid-leg (resume logic in `src/routes/match/[id]/+page.svelte`) silently depends on two implicit contracts. Breaking either reproduces the "wrong thrower after refresh" bug (fixed 2026-09):

1. **`getTurnsForLegs` (`src/lib/db/database-service.ts`) must return turns in chronological order (`createdAt ASC`).** The resume logic reads `turns[turns.length - 1]` as "the latest turn" to derive the next thrower. It previously ordered `DESC`, so `[len-1]` was the *oldest* turn — the thrower was only right by luck of turn parity. Note the split: `getLegTurns` (the `?legId=` history endpoint) orders `turnNumber ASC` and the history page is unaffected either way — don't "fix" one to match the other.

2. **Leg-start alternation must be reconstructed from the leg's persisted `firstThrowerId`, not from the current thrower.** Resume used to set `firstThrowerIndex: currentPlayerIndex` (the *next* thrower), so after refresh + checkout the client picked the next leg's starter from the wrong index while the DB persisted the correctly-alternated one — the following refresh showed a different thrower than the screen had.

If turns ever come back newest-first again (or a new consumer assumes DESC), refresh-resume breaks with no error — just a wrong thrower. When touching turn ordering or resume, verify the thrower after a mid-leg refresh.
