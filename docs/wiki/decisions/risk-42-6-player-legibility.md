---
type: Decision
title: "Risk 42 6-player legibility: hue-spread player palette, collision-free chips, podium scrim"
description: Context
tags: [risk-42, palette, tv, legibility, design]
status: accepted
timestamp: "2026-09-09T22:08:48.100Z"
---

# Risk 42 6-player legibility: hue-spread player palette, collision-free chips, podium scrim

## Context

During the session-6 prod playtest (2026-09-10, game 8 = 6P Domination), the vision audits flagged a **6-player palette clash**: with six owners on the Risk 42 map, player colors were hard to tell apart (ownership contrast was already the weakest point at g1), name chips collided (e.g. `KAAL` vs `KAUW` both truncating/displaying confusingly), and the TV podium standings were unreadable over the bright end-state map.

Existing palette decisions ([[../decisions/risk-42-wears-the-classic-risk-continent-palette]] and the Coolors band) cover **continent** fills only — player ownership colors were never locked.

## Decision

- **Player palette = max hue-spread 6 colors**: red / navy / orange / teal / purple / sky. Any two owners stay distinguishable on the map, on the scorer board, and in the TV standings.
- **Collision-free name chips**: player-name abbreviations are shortened deterministically so no two chips in a roster collide (KAAL→`KAA`, KAUW→`KAU`).
- **Podium scrim**: a dark scrim behind the TV winner standings so text stays legible over the full-bleed end-state map.

Applied to both the scorer (`/match/risk/[id]`) and the TV cast page (`/match/risk/[id]/tv`).

## Alternatives considered

- Minimal tweak of the old palette (recolor one or two hues) — rejected: the audit showed the *spacing* was wrong, not one bad color.
- Per-player free color choice — rejected: no guarantee of spread with 6 players.

## Consequences

- Shipped as commit `bfb059b` during the campaign; post-fix vision verdicts: all PASS.
- Rosters ≤ 6 (see [[../decisions/cap-match-rosters-at-6-players]]) — the palette is sized exactly to that cap.
