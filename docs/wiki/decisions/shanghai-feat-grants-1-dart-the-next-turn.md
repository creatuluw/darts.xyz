---
type: Decision
title: Shanghai feat grants +1 dart the next turn
description: Context
tags: [game-design, risk-darts, conquest-mode, shanghai, momentum-reward]
status: accepted
timestamp: "2026-09-07T21:25:23.298Z"
---

# Shanghai feat grants +1 dart the next turn

## Context

The earliest Risk Darts brainstorms wanted a **momentum reward** — the discarded ON FIRE / heat-economy mechanic tried to buy it with twelve lines of rules. User ruling this turn distills that same instinct into a named darts feat with one line of rules: "if you throw a shanghai on any box you'll get an additional throw the next turn."

## Decision (user-ruled)

**Classic Shanghai** — single, double, AND treble of the same wedge, within one turn, in any order — earns **+1 dart the following turn**. The app detects it automatically and the caller plays a **"SHANGHAI!"** clip (loudest sound of the night).

Falling out for free:

- **Shanghai on enemy land = guaranteed capture.** 1+2+3 = 6 damage vs 3 HP max; the leftover damage over-reinforces the grip — the stylish route is also the devastating one.
- **Shanghai on your own land still counts.** Damage/reinforcement is capped at 3 HP, but the feat is the feat — the extra dart is earned on pure form.
- **No caps, no anti-stacking rules.** Shanghai is roughly a 1-in-100-turns event even when hunting it deliberately — rarity IS the balancing mechanism.

Assistant-assumed defaults (vetoable, not yet user-ruled — fold into the Question 7 read-back):

- Any order within the turn qualifies.
- Works in both 301-clock and Domination modes.
- Dead players throwing at the Bull Altar cannot Shanghai — the bull has no treble.

## Why

- Rewards skill with more skill opportunities instead of handicaps — consistent with the mode's "social, not mechanical" balancing stance.
- One named feat replaces a whole heat economy: the momentum-reward payoff without bookkeeping.
- Guaranteed-capture synergy means the highlight-reel throw is also the strategic throw.

## Consequences / open items

- Caller audio: needs a "SHANGHAI!" event clip (fits the existing ElevenLabs soundboard pattern in `static/audio/`).
- Detection: match/territory engine must check single+double+treble of one wedge across a turn's darts. Edge to rule in the veto pass: on a 4-dart turn (earned by a previous Shanghai), does any 3-dart subset count, or strictly the turn's darts as thrown?
- Question 7 remains open: final veto pass over the full read-back + naming the game (Conquest / 20 Kingdoms / Trebles & Territories / Gold Coast).
