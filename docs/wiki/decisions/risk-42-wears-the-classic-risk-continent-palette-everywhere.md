---
type: Decision
title: Risk 42 wears the classic Risk continent palette everywhere
description: Context
tags: [risk-42, colors, palette, tv, dartboard]
status: accepted
timestamp: "2026-09-09T20:57:21.371Z"
---

# Risk 42 wears the classic Risk continent palette everywhere

## Context

The Risk 42 game surfaces had inconsistent color stories: the scorer dartboard used generic alternating dartboard colors (red/green rings, black/cream singles) with player-color overrides, and the new TV world map filled owned territories with player colors on a dark ocean. The user supplied the classic Risk reference (docs/risk/risk-board.svg) and asked for ALL game colors to conform to it.

## Decision

Adopt the **classic Risk continent palette** as the single source of truth, exported from `risk-engine.ts` (`CONTINENT_COLORS` / `CONTINENT_DARK`, body + darker companion per continent): NA yellow, SA red-orange, EU cyan, AF golden-brown, AS green, OC purple.

- **Scorer dartboard**: unowned/base box fills wear continent colors (outer box = body shade, inner box = darker companion); owned boxes still fill with the player color (ownership glanceability on the playing surface).
- **TV world map**: territories ALWAYS wear their continent color — because the Risk 42 deal assigns every box an owner, a player-color fill would erase the scheme entirely. Ownership rides on the army-badge disc (player color), owner initials (player color, dark halo), and a white stroke on the active player's territories — the classic Risk model of colored pieces on continent-colored land.

## Alternatives considered

- Player-color fills on the map (previous behavior) — rejected: after the deal it makes the classic look unreachable.
- Continent colors only for unowned boxes — rejected: invisible in practice (the deal fills the board), dead code.

## Consequences

- One palette module used by both surfaces; regenerating board SVGs keeps it stable.
- Ownership on the TV is badge-driven, not fill-driven; spectators read ownership from discs + initials + active stroke.
- Vision-agent verified the result: zero continent-hue breaks, badges readable on all six fills.
