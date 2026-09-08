---
type: Entity
title: Conquest setup (Fun tab + conquest-setup.ts)
description: "The first shipped code for [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) (Trebles and Territories): the **Fun tab** on the match setup page plus the pure setup-logic module"
tags: [trebles-and-territories, setup, frontend, game]
timestamp: "2026-09-07T22:17:00.772Z"
---

# Conquest setup (Fun tab + conquest-setup.ts)

The first shipped code for [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) (Trebles and Territories): the **Fun tab** on the match setup page plus the pure setup-logic module behind it. Selected via `/match/setup?tab=fun` (tab state synced to the URL query param, read in `onMount` per house style).

## Details

- **Location**: `src/lib/game/conquest-setup.ts` (pure logic) and `src/routes/match/setup/+page.svelte` (Match | Fun tab pills)
- **Interface**: three TDD'd exports —
  - `presets` — the 51–1501 step-50 ladder (30 entries, **301 default**) per the preset-ladder decision
  - `estimateDuration` — §03 formula: `ceil(darts/3)` turns × 30s × players (301 × 3 players ≈ 2h 32m), shown live in the UI
  - `validateConquestSetup` — requires **2–6 players**
- **UI**: Clock / Domination toggle (Domination = hold 7 territories or any full continent = instant win), preset pill grid, live estimated match time tracking player count, **Shuffle seats** button; **players panel is shared across both tabs** (one crowd, two games). Start button disabled — "engine coming soon" until M1 lands.
- **Configuration**: win-condition mode (clock | domination), preset score, player list + seat order

## Relationships

- [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) — the game mode this sets up; this module marks the mode's transition from design-only to implemented
- [trebles-territories-implementation-spec](../artifacts/trebles-territories-implementation-spec.md) — §03 of the spec defines the time table this module implements
- Reuses the house page-state pattern (see rule: $app/stores + $page)

## Lifecycle

- First added: setup increment only — Match tab behavior unchanged; M1 (engine — types & state shape) is the next milestone
