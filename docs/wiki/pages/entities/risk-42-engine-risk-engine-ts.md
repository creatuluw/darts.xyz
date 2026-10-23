---
type: Entity
title: Risk 42 engine (risk-engine.ts)
description: "The pure, TDD'd game engine implementing [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) — Risk 42 played on the standard dartboard wher"
tags: [risk-42, engine, game-mode, tdd]
timestamp: "2026-10-23T13:36:48.778Z"
---

# Risk 42 engine (risk-engine.ts)

The pure, TDD'd game engine implementing [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) — Risk 42 played on the standard dartboard where inner single, outer single, and treble of a number are **different territories** (40 boxes total). Modeled on [conquest-engine-and-live-game](../entities/conquest-engine-and-live-game.md)'s pattern: pure state-in/state-out functions, no DOM, no persistence.

## Details

- **Location**: `src/lib/game/risk-engine.ts` + co-located `risk-engine.test.ts` — **on master since PR #8** (merge commit `0dd53f1`, 2026-09-09). M2 work continues in worktree `E:/worktrees/risk-42`, branch `feature/risk-42` (PR #15 pending user merge).
- **Seams** (the tested surface):
  - `createGame(playerIds, opts)` — seeded RNG deal: 40 boxes dealt equally, 2 armies each, leftover blanks claimable, starter from input.
  - `applyDart(state, hit: DartHit): RiskGameState` — deposits + mirror combat + **Arsenal bull darts (bankable)** + turn lifecycle, immutable state.
  - `DartHit = { segment, multiplier, singleRing? }` — `singleRing` **required** for multiplier 1; see [the DartHit seam decision](../../decisions/risk-42-applydart-seam-darthit-carries-singlering-for-single.md).
  - `budgetWithSources()` — pre-turn dart budget with its continent-income breakdown.
  - **Dart bank** (since the 2026-10-23 Arsenal amendment): bull 25 = **+2 darts**, bullseye 50 = **+3 darts**, paid into the live pool immediately; a per-player **saved pool** banks leftovers handed over at turn end and accumulates; `advanceTurn` never writes zero-entries into the bank. The rolled-in amount is persisted as **`turn.carried`** so the UI can itemize provenance (see [the provenance learning](../../learnings/bank-folded-in-at-handover-loses-provenance-carry-it-on-the-.md)) — see [the bank decision](../../decisions/risk-42-arsenal-becomes-a-bankable-dart-economy-bull-25-2-da.md).
  - Endgames: domination check, timed-war clock horn, bull tiebreak.
- **Endgame contracts worth remembering**:
  - In a **2-player game, stripping one player IS domination** — exile only exists with 3+ players (the spec's own AC; exile tests must arrange 3 players).
  - After a **bull tiebreak, the winner ∈ score-tied leader set** — not necessarily `standings()[0]`, whose secondary sort may reorder ties.
  - Clock-winner validation goes against `standings[0]` (that one *is* the standings contract).

## Relationships

- [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) — what this implements
- [conquest-engine-and-live-game](../entities/conquest-engine-and-live-game.md) — the Trebles & Territories engine it is patterned on
- [risk-42-implementation-spec](../artifacts/risk-42-implementation-spec.md) — the spec driving the milestone build (still describes the old Arsenal charge — known drift, tracked by the docs-vs-code parity check)
- [test-suite](../artifacts/test-suite.md) — where this suite lives

## Lifecycle

- First added: 2026-09-09, worktree `risk-42` — M1.1–M1.4 (deal, deposits + mirror combat + capture-at-0, turn lifecycle + Arsenal charge, exile & clawback), suite 178.
- 2026-09-09: **M1 complete — 188 tests in ~2.2s**, shipped as [PR #8](https://github.com/creatuluw/darts.xyz/pull/8) — **merged to master** (`0dd53f1`).
  - M1.5 continent income + `budgetWithSources`; the `playTurn`/`playRound` helpers made self-adapting (see [budget-adapting helpers](../../learnings/engine-test-helpers-must-adapt-to-live-dart-budgets-income-m.md) and the [sync-hang gotcha](../../learnings/sync-infinite-loop-in-a-test-helper-hangs-vitest-with-no-tim.md)).
  - M1.6 domination + clock horn + tiebreak. M1.7 100-game invariant sweep under a random bot per [the sweep rule](../../rules/engine-invariant-sweeps-plain-asserts-assert-theorems-not-em.md).
- 2026-10-23: **Arsenal rewritten from charge to bankable dart economy** ([decision](../../decisions/risk-42-arsenal-becomes-a-bankable-dart-economy-bull-25-2-da.md)) — TDD: 12 red → **218/218 green**; invariant sweeps now exercise saving (bank never negative, savings survive handovers, 2-player domination still terminates 8/8); `turn.carried` provenance field added; old saved games resume safely (bank fields default). Four test-authoring false-reds fixed along the way (extra pool darts in drains, depositing trebles where misses were wanted, un-neutralized deal).
