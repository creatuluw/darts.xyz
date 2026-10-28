---
type: Entity
title: Risk 42 playable game (risk-setup + Fun tab + /match/risk + RiskBoard)
description: "The playable cut of [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md): the pure setup module, the Fun-tab format picker, and the live game"
tags: [risk-42, game-mode, frontend, svelte]
timestamp: "2026-10-24T22:08:02.870Z"
---

# Risk 42 playable game (risk-setup + Fun tab + /match/risk + RiskBoard)

The playable cut of [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md): the pure setup module, the Fun-tab format picker, and the live game route with its board component — everything a player needs to actually play Risk 42. Built on the merged [risk-42-engine-risk-engine-ts](../entities/risk-42-engine-risk-engine-ts.md), mirroring [conquest-engine-and-live-game](../entities/conquest-engine-and-live-game.md).

## Details

- **Location** (all on master — PRs #9, #13, #15, #17 merged; #15 landed `3611862`, #17 landed `42f79d9`, both 2026-10-23):
  - `src/lib/game/risk-setup.ts` (+ `.test.ts`) — pure helpers, TDD-first
  - `src/lib/components/risk/RiskBoard.svelte` — dartboard with territory labels + live ownership tinting; **PR #17**: a `reach` prop (`Set<string> | null`) draws an **emerald edge (`#34d399`)** on every box the thrower's darts count on
  - `src/lib/components/risk/RiskRules.svelte` — in-game **Regels** modal: the Risk 42 rules in Dutch (deal, turn budget, dart values, fighting, Arsenal darts & banking, exile, Domination/Clock scoring), closes via Sluiten / backdrop / ESC; **PR #17**: new **"Reikwijdte"** section (eigen terrein of aangrenzend — groene rand, dode darts buiten bereik) and the reworked income text ("3 darts per beurt, +1 dart per 6 eigen terreinen, minimaal 3; continenten geven geen bonusdarts")
  - `src/routes/match/risk/+page.svelte` — live game page (header carries the Regels button, next to TV); **PR #17**: derives `reach` via `reachableBoxIds()` for the board highlight, renders the **territory-card hand** (select 3 → `setPayout` preview → cash), logs dead hits as **"buiten bereik"** in the war log
  - `src/routes/match/risk/[id]/tv/+page.svelte` — the TV second screen (bank semantics with PR #15; one-line reach/card carry-over with PR #17)
  - Fun-tab wiring in `/match/setup` (format picker: Trebles & Territories vs Risk 42)
- **Interface** (`risk-setup.ts`): `RiskMode = 'domination' | 'clock'`; `RISK_CLOCK_PRESETS = [170, 301, 501]` — **branded turn counts** (14/25/40 per player via `PRESET_TURNS`), not literal scores; `validateRiskSetup()`; `estimateRiskDuration()`; roster 2–6.
- **UI surface**: seeded 40-territory deal with army badges, pre-turn budget gate that itemizes provenance (since PR #17: `max(3, floor(owned/6))` + banked darts + card sets, e.g. "4 darts — 24 landen · +2 gespaard"), **bulls pay darts straight into the live pool** (25 = +2, 50 = +3 — a bull on the last dart extends the turn), an **"End turn · save N"** button that banks every dart left into an accumulating saved pool, war-log messages "Ada ⚡ banks +2 darts" / "Ada saves 4 darts for later", war log, standings with exile marking, Miss button **plus the clickable black rim** (PR #15: the outer no-point zone records a miss and consumes a dart — war log "Ada misses"; scoring segments paint on top and keep click priority; hint line "· black rim = miss"), winner + Rematch. The **war-log card stretches to the board container's height** and only scrolls beyond that.
- **PR #17 gameplay surface**: **emerald reach outline** on the board (own-or-adjacent boxes; dead hits consume the dart and log "buiten bereik"; exiles highlight nothing — they throw anywhere), **territory cards earned on every conquest** (42-card seeded deck) shown as a hand with unlimited hoarding, and a **cash-in flow**: select any 3 cards → live payout preview (face values, one-of-each +6, jokers wild, +1 escalation per set already cashed) → darts paid into the pool mid-turn.
- **Persistence**: server write-through since PR #13 — every dart is a fire-and-forget PATCH over the shared conquest endpoints (`conquest_games` jsonb, uuid key: [risk-42-server-persistence-rides-conquest-api](../../decisions/risk-42-server-persistence-rides-conquest-api.md), payload `{ game, players }`). Reload + fresh-session resume verified by `e2e/risk-persist.spec.ts`; pre-bank saved games resume safely (bank fields default), and PR #17's new state fields (`hands`, `setsCashed`) default the same way.
- Engine interface notes: `tie` field on the endgame result (caught by svelte-check); `multiplier` optional on bull/miss `DartHit`s; gate provenance via `turn.carried`.

## Relationships

- Implements [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md); driven by [risk-42-implementation-spec](../artifacts/risk-42-implementation-spec.md)
- Follows the conquest cut pattern: [conquest-setup-fun-tab-conquest-setup-ts](../entities/conquest-setup-fun-tab-conquest-setup-ts.md), [conquest-engine-and-live-game](../entities/conquest-engine-and-live-game.md)
- Spectates via [tv-second-screen-cast-views](../entities/tv-second-screen-cast-views.md)
- Data: [risk-42-territory-mapping-mapping-json](../artifacts/risk-42-territory-mapping-mapping-json.md)

## Lifecycle

- M1 engine merged (PR #8, 2026-09-09); this cut shipped 2026-09-09 as PR #9 — 192 tests green.
- 2026-09-09: M3 server persistence pulled forward as PR #13 (rides conquest_games + /api/conquest).
- 2026-10-23: PR #15, slice 1 — **miss by clicking the black rim** + in-game **Regels** rules modal (`RiskRules.svelte`). 213 unit tests green, headless-Chromium smoke verified; changes were hot-applied uncommitted to `E:\dart.monster` at the time.
- 2026-10-23: PR #15, slice 2 — **Arsenal bank** ([decision](../../decisions/risk-42-arsenal-bankable-dart-economy.md)): bull darts payout, End-turn-save button, itemized gate banner, war-log bank/save messages, TV page + Regels texts updated, war-log stretch-to-board-height. 218/218 tests, svelte-check clean, headless smoke verified (bull → 4 pips, banked 4, next gate "7 darts — base 3 · +4 saved"); pushed to PR #15 and applied to `E:\dart.monster`.
- 2026-10-23 (cleanup): PR #15 confirmed **merged** (`3611862`); the hot-applied uncommitted copies in `E:dart.monster` were verified byte-identical to master and discarded, worktree `kees-risk-miss-rules` unlocked then removed (no `--force`), branch `feature/risk-miss-rules` deleted with plain `-d`, master ff-pulled. Features live on production (Railway deploys master).
- 2026-10-23 (later): **PR #17 merged** (`42f79d9`) — **reach rule** (emerald board highlight, "buiten bereik" dead-hit logging, Regels "Reikwijdte" section), **territory cards** (hand UI, select-3 cash-in with payout preview and escalation), **income rework** (gate shows `max(3, floor(owned/6))`; Regels income text updated). Engine + UI in one TDD'd commit; old saved games resume safely.
