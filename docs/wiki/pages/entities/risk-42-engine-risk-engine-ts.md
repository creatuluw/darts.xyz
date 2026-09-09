---
type: Entity
title: Risk 42 engine (risk-engine.ts)
description: "The pure, TDD'd game engine implementing [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) — Risk 42 played on the standard dartboard wher"
tags: [risk-42, engine, game-mode, tdd]
timestamp: "2026-09-09T09:00:32.897Z"
---

# Risk 42 engine (risk-engine.ts)

The pure, TDD'd game engine implementing [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) — Risk 42 played on the standard dartboard where inner single, outer single, and treble of a number are **different territories** (40 boxes total). Modeled on [conquest-engine-and-live-game](../entities/conquest-engine-and-live-game.md)'s pattern: pure state-in/state-out functions, no DOM, no persistence.

## Details

- **Location**: `src/lib/game/risk-engine.ts` + co-located `risk-engine.test.ts` — currently only in worktree `E:/worktrees/risk-42` on branch `feature/risk-42` (unmerged as of 2026-09-09).
- **Seams** (the only tested surface):
  - `createGame(playerIds, opts)` — seeded RNG deal: 40 boxes dealt equally, 2 armies each, leftover blanks claimable, starter from input.
  - `applyDart(state, hit: DartHit): RiskGameState` — deposits + mirror combat + Arsenal charge + turn lifecycle, immutable state.
  - `DartHit = { segment, multiplier, singleRing? }` — `singleRing` **required** for multiplier 1; see [the DartHit seam decision](../../decisions/risk-42-applydart-seam-darthit-carries-singlering-for-single.md).
- **Configuration**: `CreateGameOptions` (seed, starter).

## Relationships

- [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) — what this implements
- [conquest-engine-and-live-game](../entities/conquest-engine-and-live-game.md) — the Trebles & Territories engine it is patterned on
- [risk-42-implementation-spec](../artifacts/risk-42-implementation-spec.md) — the spec driving the milestone build

## Lifecycle

- First added: 2026-09-09, worktree `risk-42` — M1.1–M1.3 complete (3 red→green cycles each, commits `2973254`/`fcd3168`/`383e694`, suite 175 passed): the Deal, deposits + mirror combat, turn lifecycle + the Arsenal.
- Pending: M1.4 exile & clawback, M1.5 continent income (+`budgetWithSources`), M1.6 endgames, M1.7 invariant sweep, then the M1 PR for user merge (house worktree loop).
