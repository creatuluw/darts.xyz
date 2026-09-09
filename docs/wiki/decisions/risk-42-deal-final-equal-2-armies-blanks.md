---
type: Decision
title: "Risk 42 deal amended: exactly equal deal, 2 armies each, blank leftovers claimable, players pick starter"
description: Context
tags: [risk-42, game-rules, setup]
status: accepted
supersedes: "["decisions/risk-42-game-start-random-deal"]"
timestamp: "2026-09-09T08:25:35.656Z"
---

# Risk 42 deal amended: exactly equal deal, 2 armies each, blank leftovers claimable, players pick starter

## Context

The first deal decision ([[decisions/risk-42-game-start-random-deal]]) dealt all 40 boxes as evenly as possible (remainder to random players, e.g. 3p → 13/13/14) with **1 army** each, and left Q12 (who starts) open. In the next Q&A round the user amended it twice:

> "also add 2 defensive units to each dealt territory by default, also each player gets the exact same amount of territories so some can be left blank" and "q12 — we don't need to take care of this, players themselves decide who starts the game"

## Decision

**The Deal (final) — equal deal, 2 armies each, blank leftovers, players pick starter.**

- Shuffle all 40 boxes, deal **exactly equally**; leftover boxes stay **blank**:
  - 2p → 20/20 · 3p → 13 each + 1 blank · 4p → 10 each · 5p → 8 each · 6p → 6 each + 4 blanks
- Each dealt box starts with **2 armies** (was 1)
- Blank boxes are claimable mid-game by the normal rules — single dart claims with 1, treble/double founds with 2 into its fed box. The leftovers become the opening land-rush, which partially **revives the "any dart claims a blank" clause** the first deal decision had killed
- **First player: the players decide.** No app mechanism, no bull-off ceremony — setup just takes turn order as input (Q12 closed)

## Standing assumptions locked the same turn (veto-pass table for the spec)

| # | Assumption | Default |
|---|---|---|
| 1 | Stack cap | none — armies unbounded |
| 2 | Overkill | wasted (box at 1 hit by treble −2 → flips, excess lost) |
| 3 | Roster | 2–6 players (app-wide cap) |
| 4 | Feats | no Shanghai-style bonus in v1 (parked knob) |
| 5 | Arsenal order | bull-first only, charges additive, turn-scoped |
| 6 | Misses | off-board = nothing, standard |

These go into the spec as an explicit veto-pass table (T&T's read-back pattern); they are defaults pending user veto, not hard locks.

## What this supersedes

Supersedes [[decisions/risk-42-game-start-random-deal]] entirely: unequal remainder dealing and the 1-army start are gone; Q12 is closed. Feeders from [[decisions/risk-42-base-mechanic-two-feeder-deposits]] stay as before, now also covering mid-game claims of blank leftovers.

## Rationale

- Fairness: exact equal split beats 13/13/14 randomness.
- 2 starting armies gives every box a real defense from dart one.
- Blank leftovers restore the "throw one, claim one" opening romance without a full claiming phase.
- Starter-by-agreement keeps the app out of a ceremony players can settle themselves.

## Consequences

- Engine must support **blank (unowned) boxes at game start** and mid-game claiming — claim logic returns to scope.
- Setup UI takes turn order as plain input.
- Next step proposed (Q13, pending): write `.specs/risk-42/spec.html` — design tree has no open branches left.
