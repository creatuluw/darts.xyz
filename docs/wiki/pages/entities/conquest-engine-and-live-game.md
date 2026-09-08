---
type: Entity
title: Conquest engine (conquest-engine.ts + live conquest game)
description: "The playable implementation of [[risk-darts-proposed-game-mode]] (Trebles & Territories): a pure, TDD'd game engine plus the board component and live game route"
tags: [game-mode, conquest, engine, trebles-and-territories]
timestamp: "2026-09-07T22:42:33.126Z"
---

# Conquest engine (conquest-engine.ts + live conquest game)

The playable implementation of [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) (Trebles & Territories): a pure, TDD'd game engine plus the board component and live game route shipped in milestones M1–M2.

## Details

- **Location**:
  - Engine: `src/lib/game/conquest-engine.ts` (pure TypeScript, no Svelte imports)
  - Board: `src/lib/components/conquest/ConquestBoard.svelte` (SVG, reuses Dartboard segment geometry, emits `(segment, multiplier)` with 25=bull; props for pick-candidate wedges, DUEL AT THE ALTAR overlay, and current-visit dart markers)
  - Scoreboard: `src/lib/components/conquest/ConquestScoreboard.svelte` (per-player card — territories/continents held, score, darts remaining, Shanghai 🔥 bonus, dead-at-altar state, active-player highlight incl. duel defender)
  - Live page: `/match/conquest` — turn banner, scoreboard, war-log feed, resurrect/victim pickers, duel defense flow, end podium + standings
  - Entry point: Fun tab on match setup (`/match/setup?tab=fun`) → **Start Conquest** (see [conquest-setup-fun-tab-conquest-setup-ts](./conquest-setup-fun-tab-conquest-setup-ts.md))
- **Interface / Schema**: engine exports factory, `applyDart`, altar action trio (death/resurrection/duel flows), `applyTiebreakDart` (nearest-bull sudden death), standings mapping via `continentCounts` → `territories`/`continents` keys
- **Rules implemented**: treble-only founding, S/D/T sieges, capture-at-1HP, reinforce cap 3, mid-turn flips, Shanghai any-order (+1 dart), explicit `dead` flag (blank board ≠ owns-0), death → Bull Altar → blank-claim resurrection, no-blanks robbing duels with one free save dart, Clock scoring (1/territory +2/continent), Domination instant wins (7 territories / full continent)
- **Persistence**: `sessionStorage` per tab (stopgap — M3 DB/API persistence pending)
- **Tests**: 112 tests incl. a 40-game seeded invariant sweep in both modes; see [test-suite](../artifacts/test-suite.md)

## Lifecycle

- First added: M1 engine built test-first (RED/GREEN cycles, 35-test suite); M2 board + live page wired and verified in headless Chromium (full clock game, altar resurrection, duel both ways — zero console errors, 11/11 DOM assertions)
- Known follow-ups: M3 DB/API persistence, M4 LLM commentator, M5 audio/E2E/dark-mode, M6 recap videos

## Relationships

- [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) — this is that game mode's shipped implementation
- [conquest-setup-fun-tab-conquest-setup-ts](./conquest-setup-fun-tab-conquest-setup-ts.md) — setup flow that launches this game
- [structuredclone-can-t-clone-svelte-5-state](../../learnings/structuredclone-can-t-clone-svelte-5-state.md) — the engine-boundary wiring gotcha discovered here
- [test-suite](../artifacts/test-suite.md) — the engine's invariant sweep extends the project's automated test layer
