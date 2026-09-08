---
type: Decision
title: Timed War clock measured in turns per player, branded 170/301/501 (default 301)
description: Context
tags: [game-design, risk-darts, conquest-mode, endgame, timed-war]
status: accepted
timestamp: "2026-09-07T21:24:05.906Z"
---

# Timed War clock measured in turns per player, branded 170/301/501 (default 301)

## Context

User ruled "games by default are 301 darts." The standing [Timed War decision](./timed-war-default-endgame-fixed-continents.md) recorded a fixed dart budget per player, **default 21 (tunable)**. Problem: a fixed *total* dart count breaks with player count — 301 darts between 2 players ≈ 3 hours, and unequal darts per player skew the end ranking.

## Decision

The Timed War clock is measured in **turns per player** (equal throws for everyone), branded like the classic formats:

- **170** — sprint (~14 turns each)
- **301** — **default** (~25 turns each)
- **501** — marathon

End scoring unchanged: 1 pt per territory, +2 per full continent (the obsolete +2 bull-capital bonus was already flagged for removal since the bull became the altar).

Amends the Timed War decision's budget clause — its "default 21 darts per player" figure is obsolete.

## Alternatives considered

- **Fixed total dart count** — rejected: playtime and darts-per-player vary wildly with table size; ranking unfair.
- **Keep 21 darts/player default** — superseded by the user's 301 default branding.

## Consequences

- "301" stays the default on the box; equal turns keep ranking fair at any player count.
- The 170/301/501 → turn-count mappings are assistant-proposed and sit in the standing question-7 veto window (see concept page).
