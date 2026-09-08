---
type: Decision
title: Risk-territory darts over heat economies
description: Context
tags: [game-design, darts, brainstorm]
status: accepted
supersedes: heat-momentum-core-balancing-mechanic
timestamp: "2026-09-07T20:53:40.318Z"
---

# Risk-territory darts over heat economies

## Context

A second darts game concept was being brainstormed (crowd: mixed — one shark, casuals; everyone must matter till the end). Two candidate directions were on the table:

1. **Heat economies + claim-scoring** — economic/accumulation mechanics layered on the board.
2. **Risk-style territory control** — the board **is** the map.

During the session the conversation diverged down the heat-economies path. The user called it the wrong direction and asked to roll back to the message where the Risk idea was invented and continue from there.

## Choice

**Risk-style territory control is the core design.** Heat economies and claim-scored mechanics are abandoned — do not reintroduce them.

The Risk baseline:
- Wedges are **territories**, darts are the dice, trebles are artillery
- Hitting neutral land = claiming it; hitting enemy land = attacking it
- Board-neighbor arcs (20-1-18-4, 13-6-10-15, …) form natural **continents**
- The leader gets ganged up on — balancing is **social, not mechanical**

## Alternatives considered

- **Heat economies / claim-scored** (rejected): user judged it the wrong direction for the crowd + soul of the game ("Risk" — board as map).
- **Mechanical catch-up balancing** (rejected in favor of social ganging-up): simpler, fits the drunken-social setting, no rules overhead.

## Consequences

- All downstream design questions (game end, death, resurrection, round structure) build on the territory baseline, not on economy scoring.
- Open at time of decision: **Question 3 — how does the game end / how final is death?** (candidates: A total conquest, B domination win, C death with resurrection, D countdown endgame).
- Design lives in conversation, not code yet — when implementation starts, this decision is the reference point for the game mode's shape.
