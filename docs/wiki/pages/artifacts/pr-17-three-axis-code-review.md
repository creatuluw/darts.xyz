---
type: Artifact
title: "PR #17 three-axis code review"
description: "PR #17 three-axis code review"
tags: [code-review, risk-42, pr-17, quality]
timestamp: "2026-10-28T17:54:07.096Z"
---

# PR #17 three-axis code review

# PR #17 three-axis code review

The three-axis code review (Standards / Spec / Craft) of **PR #17 — Risk 42 reach rule + territory cards + income rework** (commit `2c4d474`, +656/−86 over 6 files), run 2026-10-24 against `daef6fd...HEAD`. Original file: `.monster/code-review/daef6fd-review.md` (**untracked** — this page preserves its substance).

## What it documents

- [Risk 42 engine (risk-engine.ts)](../entities/risk-42-engine-risk-engine-ts.md) — the reviewed engine code as of PR #17
- [risk-42-reach-rule decision](../../decisions/risk-42-reach-rule-own-or-adjacent.md), [risk-42-territory-cards decision](../../decisions/risk-42-territory-cards-conquest-earns-card.md), [risk-42-income-rework decision](../../decisions/risk-42-income-rework-continent-bonus-out.md) — the spec sources the review verified against

## Verdict

**0 must-fix — mergeable as-is.** 1 should-fix per axis (Standards, Spec), 12 consider-level. Standards axis checked all six relevant house rules with no breaches.

## Findings status (as of 2026-10-25)

| Finding | Axis / severity | Status |
|---|---|---|
| `ADJACENT_TERRITORIES` has 3 non-classic-Risk edges (Egypt↔South Africa, Afghanistan↔Irkutsk, Indonesia↔Eastern Australia) widening everyone's reach; edge-sampling tests can't catch membership drift | Spec / should-fix high | **Open** — captured as a [learning](../../learnings/risk-42-adjacency-table-drifts-from-classic-risk.md); fix = drop the pairs or document as deliberate variant + assert the canonical edge list |
| Stats derived by substring-matching Dutch log copy (`endStats.dead` on "buiten bereik") | Standards / consider | **Captured as a rule** — [derive stats from state deltas](../../rules/derive-stats-from-state-deltas-never-by-substring.md) |
| `budgetWithSources` name false after `sources` removed; `territoryIncome` over-exported; duplicated Fisher–Yates shuffle; `TERRITORY_OF` map where `b.territory` exists; hand-walk `game.hands?.[…] ?? []` repeats | Craft / consider | Open nits — see the report for actions |
| Mixed Dutch/English log + banner copy ("+N saved" vs "gespaard"; "+N kaarten" showing darts) | Spec+Craft / consider | Open nits |
| `ensureCards()` legacy-shim comment claims the seed reproduces the dealt order — false (RNG stream restarts; same cards, different order) | Spec / consider | Open doc-nit — fix the comment |

