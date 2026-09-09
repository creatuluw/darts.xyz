---
type: Decision
title: "Risk 42 continent income: +1 dart per full continent (Asia +2); budget shown pre-turn"
description: Context
tags: [risk-42, game-mode, design, income]
status: accepted
timestamp: "2026-09-09T08:07:22.729Z"
---

# Risk 42 continent income: +1 dart per full continent (Asia +2); budget shown pre-turn

## Context

Risk 42 design Q&A left **continent income** as the open Q10, posed with recommendation A. Alternatives weighed: **B** — darts into fully-held continents count double; **C** — continent bonus applies to score only at the horn. User answered **A**, and added an explicit UI requirement.

## Decision

- **While a player holds a full continent: +1 dart per turn. Asia: +2.** Income is paid in *darts*, not armies — the thrower's turn stays the center of the game.
- **Hard UI requirement (user-insisted):** the **dart budget for the upcoming turn is shown before the turn starts** — the player sees 3, 4, or 5 darts and *why* (continent bonus / Arsenal carryover), never discovering the budget mid-throw. This is now a spec-level requirement for the mode's UI.

## Rationale

- Darts-as-income uses one currency the player already understands; B distorts attack math invisibly mid-turn, C is scoreboard-only and never changes play.
- The pre-turn budget display matters because budget-changing rules are only fair if legible *before* the player throws — the user flagged exactly this ("the UI needs to make sure the player knows he can use extra/less darts when a rule is active before a turn").

## Consequences

- Turn budget = 3 base + continent bonus (+ other modifiers as they get locked, e.g. Arsenal interaction).
- The scorer UI must render an explicit "you have N darts this turn, here's why" surface — discoverability of active rules is a first-class requirement, not polish.

## Related

- [[risk-42-proposed-game-mode]] — the mode this ruling belongs to
- [[risk-42-bulls-the-arsenal-charge-25-1-50-2]] — the Arsenal, the other turn-budget-affecting rule
