---
type: Decision
title: "Risk 42 income rework proposed: continent bonus out, max(3, territories/6) darts per turn"
description: Context
tags: [risk-42, game-design, income, economy, proposed]
status: proposed
supersedes: "["risk-42-continent-income"]"
timestamp: "2026-10-23T14:08:27.915Z"
---

# Risk 42 income rework proposed: continent bonus out, max(3, territories/6) darts per turn

## Context

2026-10-23, reviewing the card-hoarding rules, the user flagged the income side: **"de pijlen die je krijgt voor het hebben van een continent lijkt niet in balans"** — the continent bonus (+1 dart per full continent, Asia +2, locked 2026-09-09) feels unbalanced. New wish: **+1 dart per every 6 owned territories, minimum 3 per turn**. Change to be reviewed together before implementation.

## Two readings analyzed

- **A — replacing, min-3 clause real (RECOMMENDED):** `max(3, floor(territories / 6))`. Start 3 for every roster; 13 lands → 3 (floor holds); 24 lands → 4; 30 → 5; 36 → 6. Slightly nerfs continent-sweep collectors, rewards wide spread empires, and gives the "minimum 3" clause actual meaning (it binds early and at exile: 0 lands → 3).
- **B — additive on top of base 3:** `3 + floor(territories / 6)`. Start budgets become 4–6 depending on roster (richer than the old system's flat 3), 40 lands → 9–10 darts, and the min-3 clause is meaningless because you're always above it.

## Decision (PROPOSED — awaiting user's A/B answer, one question asked)

Go with **A**: `max(3, floor(landen / 6))`, continent bonus removed entirely.

**Rationale:** the complaint ("not in balance") reads as too much / too swingy — A dampens, B pumps more darts into the game than the old system. With A, the **card economy becomes the main accelerator** (sets worth +3..+6, escalating) while income dampens — the real-Risk dynamic: income brakes, card sets sprint.

## Explicitly untouched

- **Clock-score** continent points in the end-of-game score remain (the user spoke about income, not scoring).
- **Pre-turn budget banner** stays a hard requirement (carried from the continent-income decision), now with new breakdowns: e.g. *"4 darts — 24 landen · +2 gespaard"* or *"3 darts — minimum (13 landen)"*.

## Consequences (on acceptance)

- `risk-engine.ts` income calculation rewritten: continent-bonus lookup out, territory-count floor formula in.
- Supersedes [[risk-42-continent-income]] — that decision's +1-per-continent / Asia +2 ruling dies.
- Interactions to re-check: Arsenal banked darts and card-set cash-ins stack on top of the floored base budget.

## Related

- [[risk-42-proposed-game-mode]] — the mode this rework belongs to
- [[risk-42-territory-cards-conquest-earns-card]] — the card economy that becomes the main accelerator under A
- [[risk-42-continent-income]] — the decision this proposal replaces
