---
type: Learning
title: Risk 42 adjacency table drifts from classic Risk by 3 edges — edge-sampling tests can't catch membership drift
description: "**Found in the 2026-10-24 three-axis code review** of PR #17 (commit 2c4d474) — Spec axis, should-fix/high."
tags: [risk-42, engine, testing]
timestamp: "2026-10-24T22:23:39.632Z"
---

# Risk 42 adjacency table drifts from classic Risk by 3 edges — edge-sampling tests can't catch membership drift

**Found in the 2026-10-24 three-axis code review** of PR #17 (commit 2c4d474) — Spec axis, should-fix/high.

The Risk 42 spec says territory reach uses **"classic Risk map adjacency"**, but `ADJACENT_TERRITORIES` in `src/lib/game/risk-engine.ts` (~lines 144–159) contains **3 edges that are not classic Risk borders**:

- Egypt ↔ South Africa
- Afghanistan ↔ Irkutsk
- Indonesia ↔ Eastern Australia

Under the reach rule (darts only count on own or adjacent territories — see the 2026-10-23 decision), these silently widen every player's reachable set.

**Why the test suite missed it:** the adjacency tests sample only 3 edges plus symmetry and connectivity checks. Property checks (symmetric, connected) cannot catch **membership drift** in a contract table — only asserting the full canonical edge list can. Reusable lesson: for contract tables (adjacency, payout ladders, palette maps), assert the complete expected list, not samples plus invariants.

**Fix path:** drop the 3 pairs (or document them as a deliberate variant in the spec) and assert the canonical edge list in full. Note: `pages/entities/risk-42-engine-risk-engine-ts.md` currently describes the table as "classic Risk map adjacency" — re-verify that page after the follow-up fix lands.

**Source:** `.monster/code-review/daef6fd-review.md` (2026-10-24 three-axis review — full findings list; also its Standards should-fix: `as never` casts in `risk-engine.test.ts:10,68` fixtures erase the `CardFace` union, so a typo'd card face only fails at runtime). The generalizable lesson is now codified as rule [[assert-contract-tables-by-full-canonical-list]].
