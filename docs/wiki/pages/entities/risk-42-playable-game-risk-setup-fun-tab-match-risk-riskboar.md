---
type: Entity
title: Risk 42 playable game (risk-setup + Fun tab + /match/risk + RiskBoard)
description: "The playable **M2.3 cut** of [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md): the pure setup module, the Fun-tab format picker, and the "
tags: [risk-42, game-mode, frontend, svelte]
timestamp: "2026-09-09T10:47:22.589Z"
---

# Risk 42 playable game (risk-setup + Fun tab + /match/risk + RiskBoard)

The playable **M2.3 cut** of [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md): the pure setup module, the Fun-tab format picker, and the live game route with its board component — everything a player needs to actually play Risk 42. Built on the already-merged [risk-42-engine-risk-engine-ts](../entities/risk-42-engine-risk-engine-ts.md), mirroring [conquest-engine-and-live-game](../entities/conquest-engine-and-live-game.md).

## Details

- **Location** (branch `feature/risk-42`, PR #9 — master has only the M1 engine until merge):
  - `src/lib/game/risk-setup.ts` (+ `.test.ts`) — pure helpers, TDD-first
  - `src/lib/components/risk/RiskBoard.svelte` — dartboard with territory labels + live ownership tinting
  - `src/routes/match/risk/+page.svelte` — live game page
  - Fun-tab wiring in `/match/setup` (format picker: Trebles & Territories vs Risk 42)
- **Interface** (`risk-setup.ts`): `RiskMode = 'domination' | 'clock'`; `RISK_CLOCK_PRESETS = [170, 301, 501]` — **branded turn counts** (14/25/40 per player via `PRESET_TURNS`), not literal scores; `validateRiskSetup()`; `estimateRiskDuration()`; roster 2–6.
- **UI surface**: seeded 40-territory deal with army badges, pre-turn budget banner ("5 darts — base 3 · +2 Asia") with Start-turn gate, Arsenal ⚡ bull indicator, war log, standings with exile marking, Miss button, winner + Rematch.
- **Persistence**: server write-through since PR #13 — every dart is a fire-and-forget PATCH over the shared conquest endpoints (`conquest_games` jsonb, uuid key: [risk-42-server-persistence-rides-conquest-games-api-conquest](../../decisions/risk-42-server-persistence-rides-conquest-games-api-conquest.md), payload `{ game, players }`); the v1 `sessionStorage` stopgap is deleted. Reload + fresh-session resume verified by `e2e/risk-persist.spec.ts`.
- Engine interface updates landed with this cut: `tie` field on the endgame result (had silently missed M1.6 — caught by svelte-check, see [vitest-can-t-see-type-holes-esbuild-strips-types-svelte-check-is-the-only-net](../../learnings/vitest-can-t-see-type-holes-esbuild-strips-types-svelte-chec.md)) and `multiplier` now optional on bull/miss `DartHit`s (guarded in the box branch).

## Relationships

- Implements [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md); driven by [risk-42-implementation-spec](../artifacts/risk-42-implementation-spec.md)
- Follows the conquest cut pattern: [conquest-setup-fun-tab-conquest-setup-ts](../entities/conquest-setup-fun-tab-conquest-setup-ts.md), [conquest-engine-and-live-game](../entities/conquest-engine-and-live-game.md)
- Data: [risk-42-territory-mapping-mapping-json](../artifacts/risk-42-territory-mapping-mapping-json.md)

## Lifecycle

- M1 engine merged (PR #8, 2026-09-09); this cut shipped 2026-09-09 as PR #9 — 192 tests green, files type-clean, production build ✔.
- Queued after: M2.1 world-map palette join, M2.4 avatar chips, M2.5 Playwright e2e walkthrough, M3 server persistence + TV view.
- 2026-09-09: M3 server persistence pulled forward and shipped as PR #13 (rides conquest_games + /api/conquest — no new backend); only the TV view remains queued.
