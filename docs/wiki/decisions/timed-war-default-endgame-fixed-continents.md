---
type: Decision
title: Timed War default endgame, fixed continents, no elimination for Risk darts
description: Context
tags: [game-design, risk-darts, conquest-mode, endgame]
status: accepted
timestamp: "2026-09-07T21:03:14.423Z"
---

# Timed War default endgame, fixed continents, no elimination for Risk darts

## Context

Resolves the standing open **Question 3** ("how does the game end, and how final is death?") on the [Risk Darts proposed game mode](../pages/concepts/risk-darts-proposed-game-mode.md) concept page. Options were A) total conquest, B) domination win, C) death with resurrection, D) countdown endgame. Design-stage ruling from a brainstorm; no code yet.

## Choice (locked with user)

1. **Timed War is the default mode (option D)** — fixed dart budget per player, default 21 (tunable). End scoring: **1 pt per territory, +2 per full continent, +2 for the bull** (standalone capital, belongs to no continent). Full ranking 1st/2nd/3rd for league-night tables. Tiebreak: one sudden-death dart each, nearest bull.
2. **Fixed, colored continents** — groupings never change game to game (user-seeded examples: 12-20-18, 16-11-9); the rest drafted so each continent has roughly one premium, one mid, one cheap number for comparable pull. Learnable map, meta develops over weeks. UI renders the board in continent colors.
3. **No elimination in Timed War — insurgents** — a player who loses all land becomes an *insurgent*: still throwing, may attack anyone, and any neutral wedge hit becomes their new homeland. Solves the mixed-crowd "everyone alive till the end" requirement structurally, not with a bolt-on resurrection rule.
4. **Domination (option B) is a selectable alt mode** for sprint nights.

## Alternatives considered

- **Total conquest (A) as default** — rejected: too long for league nights; elimination breaks the mixed crowd.
- **Death + resurrection (C)** — superseded by the structural insurgent rule.
- **Rotating/player-chosen continents** — rejected in favor of fixed balanced groupings (learnability, comparable continent pull).

## Consequences

- Timed endgame is self-dramatizing: everyone can count remaining darts; the final round is a coordinated raid on the leader.
- Re-ratifies the "continent bonus" idea from the rolled-back discard pile (fixed continents + holding bonus); the rest of that stretch stays discarded.
- **New open question — Question 4: how hard is it to steal a territory?** A) *glass* (any dart in the wedge takes it instantly); B) *siege* (assistant lean): 3 HP per territory, single/double/treble = 1/2/3 damage, a treble steals outright, hitting your own land reinforces +1 HP (cap 3), freshly captured land resets to 1 HP; C) *fortress*: 3 HP but conquests reset to 3 (defender-favored, calmer). Note: siege/fortress reintroduce territory **HP**, which the deprecated rolled-back ruling had replaced with cumulative claims — that rejection is not standing, so HP is back on the table pending user answer.
- Rationale is design-stage; nothing implemented.
