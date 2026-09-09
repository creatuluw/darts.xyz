---
type: Entity
title: Risk 42 engine (risk-engine.ts)
description: "The pure, TDD'd game engine implementing [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) — Risk 42 played on the standard dartboard wher"
tags: [risk-42, engine, game-mode, tdd]
timestamp: "2026-09-09T10:21:01.339Z"
---

# Risk 42 engine (risk-engine.ts)

The pure, TDD'd game engine implementing [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) — Risk 42 played on the standard dartboard where inner single, outer single, and treble of a number are **different territories** (40 boxes total). Modeled on [conquest-engine-and-live-game](../entities/conquest-engine-and-live-game.md)'s pattern: pure state-in/state-out functions, no DOM, no persistence.

## Details

- **Location**: `src/lib/game/risk-engine.ts` + co-located `risk-engine.test.ts` — **on master since PR #8** (merge commit `0dd53f1`, 2026-09-09, 188/188 tests green on master). M2 work continues in worktree `E:/worktrees/risk-42`, branch `feature/risk-42`.
- **Seams** (the tested surface):
  - `createGame(playerIds, opts)` — seeded RNG deal: 40 boxes dealt equally, 2 armies each, leftover blanks claimable, starter from input.
  - `applyDart(state, hit: DartHit): RiskGameState` — deposits + mirror combat + Arsenal charge + turn lifecycle, immutable state.
  - `DartHit = { segment, multiplier, singleRing? }` — `singleRing` **required** for multiplier 1; see [the DartHit seam decision](../../decisions/risk-42-applydart-seam-darthit-carries-singlering-for-single.md).
  - `budgetWithSources()` — pre-turn dart budget with its continent-income breakdown (M1.5).
  - Endgames (M1.6): domination check, timed-war clock horn, bull tiebreak.
- **Endgame contracts worth remembering**:
  - In a **2-player game, stripping one player IS domination** — exile only exists with 3+ players (the spec's own AC; exile tests must arrange 3 players).
  - After a **bull tiebreak, the winner ∈ score-tied leader set** — not necessarily `standings()[0]`, whose secondary sort may reorder ties.
  - Clock-winner validation goes against `standings[0]` (that one *is* the standings contract).

## Relationships

- [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) — what this implements
- [conquest-engine-and-live-game](../entities/conquest-engine-and-live-game.md) — the Trebles & Territories engine it is patterned on
- [risk-42-implementation-spec](../artifacts/risk-42-implementation-spec.md) — the spec driving the milestone build
- [test-suite](../artifacts/test-suite.md) — where this suite lives once merged

## Lifecycle

- First added: 2026-09-09, worktree `risk-42` — M1.1–M1.4 (deal, deposits + mirror combat + capture-at-0, turn lifecycle + Arsenal, exile & clawback), suite 178.
- 2026-09-09: **M1 complete — 188 tests in ~2.2s**, seven red→green commits `2973254` → `d959514`, shipped as [PR #8](https://github.com/creatuluw/darts.xyz/pull/8) — **merged to master 2026-09-09** (`0dd53f1`), verified 188/188 green on the main checkout; the engine is production code.
  - M1.5 continent income + `budgetWithSources`; the `playTurn`/`playRound` helpers made self-adapting (see [budget-adapting helpers](../../learnings/engine-test-helpers-must-adapt-to-live-dart-budgets-income-m.md) and the [sync-hang gotcha](../../learnings/sync-infinite-loop-in-a-test-helper-hangs-vitest-with-no-tim.md)).
  - M1.6 domination + clock horn + tiebreak (score expectation arithmetic: 37 boxes + NA2+EU3+AF3+AS5+OC3 = 53).
  - M1.7 100-game invariant sweep under a random bot — plain-assert methodology per [the sweep rule](../../rules/engine-invariant-sweeps-plain-asserts-assert-theorems-not-em.md).
- Next: **M2** — palette build step → RiskBoard component → Fun-tab entry + scorer with pre-turn budget banner → avatar chips → e2e walkthrough. The Fun-tab requirement (Risk as a selectable game format with its own setup flow and start steps) is an explicit M2.3 acceptance criterion.
