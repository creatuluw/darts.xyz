---
type: Decision
title: Claim-based territory ownership replaces the damage-flip model in Risk darts
description: Context
tags: [game-design, conquest-mode, risk-darts, ownership-model]
status: deprecated
timestamp: "2026-09-07T20:50:42.308Z"
---

# Claim-based territory ownership replaces the damage-flip model in Risk darts

> **DEPRECATED (rolled back)** — the session was rolled back to the original Risk-idea message; this detailed ruling came from the discarded stretch. The baseline still uses plain claim/attack language ("hit neutral land = claim, hit enemy land = attack"), but the cumulative-claims ownership model is NOT standing until re-ratified. See [Risk-territory darts over heat economies](./risk-territory-darts-over-heat-economies.md).

## Context

Brainstorming the Risk-style conquest darts mode (see [Risk Darts (proposed game mode)](../pages/concepts/risk-darts-proposed-game-mode.md)). The prior model was **damage-based**: enemy territories had implicit HP; sufficient damage flipped ownership to the attacker. The user rejected that: "territories (1, 20, 14, etc) are yours when you have the highest claims/scores on that number."

Also locked in the same turn: the **ON FIRE effect = Artillery**, reinterpreted for claims — while hot, every dart adds **+1 to its claim value** (singles claim 2, trebles claim 4). This resolves the ON FIRE open question in the heat decision (see [Heat momentum as the core balancing mechanic](./heat-momentum-core-balancing-mechanic.md)).

## Choice

**Ownership is claim-based, not damage-based.** No HP, no flipping. Every dart adds cumulative claims to the wedge it hits; a territory belongs to whoever holds the **highest cumulative claims** on that number. Tiebreak rule required to make it work: **ties go to the incumbent** — you must strictly out-claim the current owner to take a territory.

## Alternatives considered

- **HP / damage-flip model** — rejected by user. Claim-based wins for three reasons:
  - **Even fewer dead darts** — a dart into the *wrong* wedge is a down-payment on a neighbor, not a miss. Chaos sold as strategy.
  - **The map hardens over time** — fresh numbers cheap to steal, contested numbers money pits, fortified cores stand. The board visibly tells the story of the match.
  - **Natural game clock** — as claims pile up, thefts get expensive, the map stabilizes, endgame arrives on its own.

## Consequences

- Any implementation should track a **per-number, per-player claim ledger** instead of territory HP + owner flags.
- **Forks the claim economy** (open, next question): what is a dart's claim worth? (A) flat — single 1 / double 2 / treble 3, all territories identical; (B) **real dart score** — S14 = 14 claims, T20 = 60, creating rich (15–20 downtown) vs cheap (1–5 countryside) geography and a natural equalizer for casuals; (C) face value, segment ignored. Assistant lean: **B**.
- If B, late-game fortification amplifies (a 200-claim #20 is a castle) → the **win condition needs a clock** (time/round limit or similar), which is the following question.
- Rationale is proposal-stage design, not implemented code.
