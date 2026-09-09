---
type: Learning
title: Engine test helpers must adapt to live dart budgets — income mechanics break fixed throw counts
description: Engine test helpers must adapt to live dart budgets — income mechanics break fixed throw counts
tags: [testing, tdd, risk-42, game-engine]
timestamp: "2026-09-09T09:38:17.449Z"
---

# Engine test helpers must adapt to live dart budgets — income mechanics break fixed throw counts

# Engine test helpers must adapt to live dart budgets — income mechanics break fixed throw counts

The gotcha (Risk 42 M1.5, 2026-09-09): the shared test helper `playRound` in the risk-engine suite threw a **fixed 6 misses per round** — a hardcoded 3-darts-per-turn assumption baked into the helper. The moment continent income landed ([the ruling](../decisions/risk-42-continent-income.md)), dart budgets started changing mid-test (+1 dart per full continent, Asia +2), and the fixed-count helper rotted: tests went red not because the engine was wrong but because the helper under/over-threw relative to the live budget.

The fix, reusable as a pattern for any engine test suite:

- **Self-adapting helpers** — helpers read the *actual* per-turn budget from state (via the engine's budget query, e.g. `budgetWithSources`) and throw exactly that many filler misses. Never a literal dart count.
- **Biggest-first source ordering** — when multiple budget sources stack, compose them deterministically biggest-first so assertions on budget composition stay stable.

Applies to any mode with dynamic dart budgets: Risk 42 continent income + Arsenal charges, T&T heat. Companion to [game-engine-tests-filler-darts-must-be-misses](game-engine-tests-filler-darts-must-be-misses-and-fixtures-o.md) — that one is about fixtures obeying the rules they enforce; this one is about helpers tracking the budget the rules produce.

## Source

- `src/lib/game/risk-engine.test.ts` (worktree `E:/worktrees/risk-42`, branch `feature/risk-42`) — the self-adapting `playRound` helper
