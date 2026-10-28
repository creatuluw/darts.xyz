---
type: Decision
title: "Risk 42 Arsenal becomes a bankable dart economy: bull 25 = +2 darts, bullseye 50 = +3, savable"
description: Context
tags: [risk-42, game-design, bulls, dart-economy]
status: accepted
supersedes: decisions/risk-42-bulls-the-arsenal-charge-25-1-50-2
timestamp: "2026-10-23T13:35:07.799Z"
---

# Risk 42 Arsenal becomes a bankable dart economy: bull 25 = +2 darts, bullseye 50 = +3, savable

## Context

The [Arsenal charge](./risk-42-bulls-the-arsenal-charge-25-1-50-2.md) (a bull boosted the *damage value* of later darts in the same turn, 25 = +1 / 50 = +2) shipped in the engine at M1. The user then flipped the mechanic's currency: bulls should pay in **throws**, not value — and the payout must be **bankable**, so players can save bonus darts and let them accumulate across turns instead of spending them immediately.

## Choice

- **Bull (25) → +2 darts, bullseye (50) → +3 darts**, added to the current dart pool **immediately in the same turn** (throw a bull on your last dart and the turn keeps going).
- **"End turn · save N"** button in the turn banner: stop early and every dart left in the pool (base + bonus) banks into a per-player saved pool that rolls into the next turn's budget. Savings **accumulate** across turns.
- The next turn's gate itemizes provenance: **"7 darts — base 3 · +4 saved"**. Because the engine folds the bank in at handover (`saved` is always 0 by gate-render time), the rolled-in amount is persisted on the turn itself as `turn.carried` — see [the provenance learning](../learnings/bank-folded-in-at-handover-loses-provenance-carry.md).
- `advanceTurn` never litters zero-entries into the bank.
- The charge is **gone** — no damage boost anymore. Old saved games resume safely (bank fields default).

## Alternatives considered

- **Keep charge alongside darts** — rejected for now: two overlapping bull bonuses muddies the rule; user can reinstate on request ("say the word").
- **Auto-spend savings next turn** — rejected: banking/accumulation *is* the requested strategy; auto-spend would erase it.

## Consequences

- Supersedes the Arsenal charge. Known drift: the Risk 42 spec HTML (and the old decision record) still describe the charge — the pending **docs-vs-code parity check** will catch this.
- Invariant sweeps now exercise saving: bank never negative, savings survive handovers, 2-player domination still terminates 8/8. Suite at **218/218**.
- UI surface updated everywhere: scorer gate banner (breakdown + save button), war log messages ("Ada ⚡ banks +2 darts", "Ada saves 4 darts for later"), TV page, and the Regels modal texts.
- Shipped TDD-style on **PR #15** (2026-10-23), hot-applied to `E:\dart.monster`; verified by headless smoke test (bull → 4 pips, banked 4, next gate "7 darts — base 3 · +4 saved"). **Merged to master** (`3611862`) the same day; cleanup confirmed master == origin/master.
