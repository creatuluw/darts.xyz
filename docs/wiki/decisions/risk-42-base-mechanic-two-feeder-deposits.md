---
type: Decision
title: "Risk 42 base mechanic: two-feeder army deposits (any-dart claims, treble feeds inner +2, double feeds outer +2)"
description: Risk 42 base mechanic locked as two-feeder army deposits — any dart claims a blank, own-land dart +1, treble feeds inner box +2, double feeds outer box +2; attack rule (Q3) open.
tags: [game-design, risk-42, conquest-mode, armies]
status: accepted
timestamp: "2026-09-08T22:21:10.489Z"
---

# Risk 42 base mechanic: two-feeder army deposits (any-dart claims, treble feeds inner +2, double feeds outer +2)

## Context

Brainstorming [Risk 42](../pages/concepts/risk-42-proposed-game-mode.md), the proposed second conquest mode (42 claimable areas = 20 inner singles + 20 outer singles + 2 bulls, mirroring classic Risk's 42 territories). The prior proposal on the table was "armies = dart multiplier" (S/D/T = 1/2/3 armies wherever the dart lands, with a round-robin claiming phase). The user then declared the base mechanic directly: "each turn you have 3 darts, every dart thrown at a blank territory gets claimed by that player, each dart that hits that territory adds 1 defensive army. a triple box adds 2 armies to the box below it, the inner one territory. each double adds 2 armies to the outer box it belongs to. this is the base mechanic."

## Choice

**Two-feeder army deposits** as the Risk 42 base mechanic (user-declared):

- Turn = **3 darts**.
- Any dart into a **blank** territory **claims** it for the thrower (any dart founds — no treble-only founding, unlike T&T's treble-frontier rule).
- Any dart into **own** territory = **+1 defensive army**.
- **Treble** of a wedge = **+2 armies** to that wedge's **inner** box.
- **Double** of a wedge = **+2 armies** to that wedge's **outer** box.
- **Bulls** are plain territories (2 of the 42) with no ring feeders — parked for the bonuses/special-events discussion.

The property that makes it elegant: **every territory has exactly two feeders** — a +1 direct hit and a +2 ring hit (the double *must* feed the outer box by geometry; the treble is paired with the inner). Army income per box is identical across the whole board — **balanced by construction**, no per-wedge fudging needed.

## Alternatives considered

- **S/D/T = 1/2/3 armies wherever the dart lands** (the prior proposal) — replaced by the feeder model: ring hits feed a *specific* box (inner for treble, outer for double) rather than acting as bigger direct hits, which is what makes per-box income symmetric.
- **Treble-only founding** (T&T's treble-frontier rule) — not carried over; any dart claims a blank here.

## Consequences

- If built, territory state = owner + army count per box, with deposits applied on every dart; income symmetry is structural, so no per-wedge balancing pass is needed.
- **Two assumptions pending user veto:** (1) *claim-via-ring* — a treble into a blank inner box claims it with 2 armies (a deposit is a deposit; first army in claims the box); (2) *no cap* — armies stack without limit, classic-Risk style.
- **Q3 (open) — dart into enemy territory:** the base mechanic doesn't define attack yet. Assistant recommendation: **mirror damage** — your dart's value subtracts (single −1, ring −2); box at 0 → flips to attacker with 1 army. Keeps the one-mechanic-does-everything purity (deposit up on blank/own, down on enemy); the treble stays the best dart in every situation, which is what social balancing (shoot the leader) is for. Alternatives rejected: dead dart on enemy land (too passive/turtle), duel throws (ceremony on every dart, slows the night). Unanswered at time of recording.
- The prior page's round-robin claiming phase: whether it survives "any dart claims a blank" is unconfirmed.
- Next design steps queued: bonuses/special events (bulls first), caps/inflation if stacking runs away, then game end.
