---
type: Rule
title: "Engine invariant sweeps: plain asserts, assert theorems not emergence, validate against contract sets"
description: The guideline
tags: [testing, tdd, game-engine, invariant-sweep, performance]
timestamp: "2026-09-09T10:19:19.055Z"
---

# Engine invariant sweeps: plain asserts, assert theorems not emergence, validate against contract sets

## The guideline

When writing simulation/invariant sweeps over a game engine (e.g. the 100-game sweep in `risk-engine.test.ts`, the 40-game sweep in the conquest engine tests):

1. **Plain-JS assertions, not vitest `expect` matchers.** Throw on violation inside the loop. The M1.7 sweep spent **59 seconds in matcher overhead** alone; converted to plain `assert`/`throw` the whole suite ran 188 tests in ~2.2s. `expect` is per-test infrastructure — sweeps are loops.
2. **Hard-assert termination only where it's mathematically due.** The clock horn must fire; a 2-player random walk must end. But "random play converges to domination" is *emergent*, not guaranteed — 3/10 convergence under a churning random bot is churn, not an engine bug. **Log rates for emergent properties, assert the theorems.**
3. **Validate winners against the contract set, not incidental order.** After a bull tiebreak, the winner must come from the **score-tied leader set** — `standings()[0]` can differ because its secondary sort reorders ties. Asserting `winner === standings[0]` is a false red; asserting "no winner" on distinct distances is a false red the other way.
4. **Give the sweep an explicit timeout** — once it stops failing early, the full run can outrun vitest's 5s default — and trim the churn budget rather than the coverage.

## When it applies

Any red-is-a-bug-hunt sweep (M1.7-style) or long random simulation in the test suite. Fixture-level unit tests can keep using `expect` normally.

Evidence: Risk 42 M1.7, 2026-09-09 — sweep went 59s → ~2.2s and three false reds were replaced with the real contract assertions.
