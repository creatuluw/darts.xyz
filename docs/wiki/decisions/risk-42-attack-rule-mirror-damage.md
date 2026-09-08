---
type: Decision
title: "Risk 42 attack rule locked: mirror damage — deposit down on enemy land, reduce-to-zero capture"
description: Context
tags: [game-design, risk-42, conquest-mode, combat, attack-rule]
status: accepted
timestamp: "2026-09-08T22:22:59.134Z"
---

# Risk 42 attack rule locked: mirror damage — deposit down on enemy land, reduce-to-zero capture

## Context

Brainstorming [Risk 42](../pages/concepts/risk-42-proposed-game-mode.md), the proposed second conquest mode. The base mechanic — [two-feeder army deposits](./risk-42-base-mechanic-two-feeder-deposits.md) — was already user-declared, but it only defined darts into **blank** (claim) and **own** (deposit +1/+2) territory. Q3 — what a dart does into **enemy** territory — was the last open piece of the base game. The assistant had recommended **mirror damage**; this turn's user ruling ("B") accepts it. Assistant confirmation: "Base game is now complete."

## Choice

**Mirror damage attack rule (Q3 = B):** a dart into an enemy territory subtracts its value from that box —

- Direct hit (single / any non-ring landing): **−1 army**
- Ring hit (double or treble): **−2 armies**
- Reducing an enemy box to **0 flips the territory to the attacker with 1 army.**

One rule now covers every dart: **the dart's value goes in the box — up if it's yours or blank, down if it's theirs; 0 flips it to you with 1 army.** Attack is the exact mirror of deposit (+1 direct / +2 ring), preserving the one-mechanic-does-everything purity and the structural income symmetry.

Emergent property (called out at lock time): **mid-turn flips chain** — knock an enemy box to 0 with an early dart and your remaining darts in the same turn can immediately deposit into your fresh conquest (attack→capture→reinforce inside one throw of 3).

## Alternatives considered

- **Dead dart on enemy land** — rejected: too passive, rewards turtling.
- **Duel throws** (defender responds) — rejected: ceremony on every contested dart, slows the night.
- (Both alternatives were already weighed when the recommendation was posed; the ruling picks mirror damage.)

## Consequences / open items

- Territory state stays minimal: owner + army count per box. Deposition and attack are the same operation with a sign flip — implementation surface is tiny if this gets built.
- The treble remains the best dart in every situation (attacks −2, feeds inner +2); social balancing (table shoots the leader) is the counterweight.
- **Open — Q4, what do the bulls do?** 25 and 50 are the only territories with **no ring feeder** — dead-end boxes on the hardest targets, a deliberate design gift. Options posed:
  - **A — one-shot strikes** (event-on-hit): hit 50 → immediately strike any territory (−3 armies, say); 25 → smaller strike. Bulls become artillery / leader-killing — but sharks hit bulls more, so it *favors* precision.
  - **B — perk-while-owned** (event-on-ownership, assistant recommendation): bulls stay normal claimable territories; owning **bullseye** buffs your treble damage (3 instead of 2), owning **outer bull** buffs your doubles (3 instead of 2); holding both = double-barreled. Zero bookkeeping, keeps the sacred 42 = 42 count, and inverts the anti-shark valve: the perk-holder *becomes* the target, and dethroning them means throwing centerward — which everyone can do.
  - **C — card economy**: bull hit = draw a Risk-style card. Most classically Risk, most bookkeeping, feeds the shark — worst fit for the mixed table.
  - **D — plain territories**: no rider; wastes the dead-space gift.
- Still design-stage: no Risk 42 code exists yet.
