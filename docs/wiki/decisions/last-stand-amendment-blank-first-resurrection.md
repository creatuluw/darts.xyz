---
type: Decision
title: "Last Stand amendment: blank-first resurrection, next-player robbery, defender bull save"
description: Context
tags: [game-design, risk-darts, conquest-mode, death-mechanic, resurrection]
status: accepted
timestamp: "2026-09-07T21:10:37.890Z"
---

# Last Stand amendment: blank-first resurrection, next-player robbery, defender bull save

## Context

The [Bull Altar decision](../pages/concepts/risk-darts-proposed-game-mode.md) ruled that a dead player hitting the bull may steal **ANY** territory. User correction this turn — resurrection is not a free pick, it's a duel with seating-order politics. Exact ruling: "the one who died throwing the bulls eye can choose a territory that's blank first, and otherwise can take one from the player who is next, but when that player also throws the bulls eye then he gets to keep the territory and the one who died starts over throwing the bulls eye."

## Decision (user-ruled)

Amends the Bull Altar theft clause; everything else in that decision (bull = altar only, dead = 0 territories, 3 darts at bull, miss = stay dead) stands:

1. **Blank-first:** bull hit + blank territories exist → the dead player MUST claim a blank. Which blank is their free choice (complete a continent, or block the leader).
2. **No blanks left** → may only steal from the **NEXT player in turn order** — not any player.
3. **Defender save:** the robbed player defends on the bull; if they also hit bullseye, the theft is **DENIED**, the dead player stays dead and restarts the bull hunt.

Assistant sharpenings proposed in the same turn (vetoable — NOT yet ruled):

- **Any bull counts** for attacker and defender (this would drop the Bull Altar's 25/50 tier).
- Defender's save is **one dart, thrown immediately** — the standoff happens on the spot, not next turn.
- Successful theft: territory arrives at 1 HP, and remaining darts keep attacking (= Question 5's option B).
- Skip dead players when finding "the next" victim; attacker picks which of the defender's territories.

## Why

- **Seating order becomes graveyard politics.** The resurrection target is fixed — whoever throws after you. Die twice and your neighbor is in a blood feud.
- **Natural escalation arc:** early deaths are cheap land-grabs on an open map; late deaths (blank map) are two-player standoffs at the bull with the whole room watching.
- Closes the "guided missile at first place" exploit of steal-ANY — the dead are scoped to empty land or their neighbor, not a free snipe at the leader.

## Consequences / open items

- **Known design smell, accepted for v1:** whoever sits after the weakest player gets farmed by repeated deaths. Games are short (~21 darts), so live with it; if it stings, the lazy fix is re-seating between games, not a new rule.
- **Tier question pending:** "any bull counts" (proposed) would supersede the 25/50 tiering in the Bull Altar decision.
- **Question 6 now open — map start:** A) cold start (all 20 blank, round-one land rush); B) founding dart (assistant lean: each player throws ONE dart pre-war, landing spot = homeland at full HP, taken land → re-throw); C) snake draft (pick homelands in turn order, last picker throws first).
