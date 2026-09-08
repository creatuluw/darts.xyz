# Pages

Knowledge graph: concepts, entities, and artifacts that make up this project.

- [Concepts](./concepts/) — Abstract ideas, definitions, and categories
- [Entities](./entities/) — Concrete named things, systems, tools, and records
- [Artifacts](./artifacts/) — Documents, diagrams, code files, and deliverables
- [dart.monster DNS & Railway domain setup](./entities/dart-monster-dns-railway-domain-setup.md) — Concrete infrastructure: how `dart.monster` (this project, also deployed as darts.xyz) is wired to its Railway service, as of 2026-09-07.
- [Test suite](./artifacts/test-suite.md) — The automated test layer for dart.monster: 67 Vitest unit tests over the pure game modules, plus 14 Playwright E2E tests (API lifecycle + real-browser UI) that
- [E2E helpers](./entities/e2e-helpers.md) — `e2e/helpers.ts` — the shared seeding/util module every Playwright spec imports. It owns the account-isolation and persistence gotchas so each spec doesn't redi
- [PlayerPanel](./entities/playerpanel.md) — A reusable scoreboard panel component for the live match scorer, extracted from two ~300-line identical hardcoded player blocks (`players[0]` left / `players[1]
- [Risk Darts (proposed game mode)](./concepts/risk-darts-proposed-game-mode.md) — What is it?
- [Live Match Page](./entities/live-match-page.md) — What is it?
- [Match Stats Tab](./entities/match-stats-tab.md) — What is it?
- [LLM Commentary (Trebles & Territories)](./entities/llm-commentary-trebles-territories.md) — The in-game AI commentary feed for [[risk-darts-proposed-game-mode|Trebles & Territories]]: an LLM writes a commentary blurb **every 2 turns**, rendered in a de
- [Trebles & Territories implementation spec](./artifacts/trebles-territories-implementation-spec.md) — The implementation spec for **Trebles and Territories** — the self-contained HTML design document (built with the html-docs skill) that drives the build. Contai
- [Recap Video Pipeline (Trebles & Territories)](./entities/recap-video-pipeline-trebles-territories.md) — The planned **Morning-After recap** feature for [[risk-darts-proposed-game-mode|Trebles & Territories]]: the day after a game, each match gets an LLM-generated
- [Trebles and Territories player manual](./artifacts/trebles-and-territories-player-manual.md) — A single self-contained HTML player manual for [[risk-darts-proposed-game-mode|Trebles and Territories]] — the "uber simple" rules-only distillation of the full
- [Conquest setup (Fun tab + conquest-setup.ts)](./entities/conquest-setup-fun-tab-conquest-setup-ts.md) — The first shipped code for [[risk-darts-proposed-game-mode]] (Trebles and Territories): the **Fun tab** on the match setup page plus the pure setup-logic module
- [Conquest engine (conquest-engine.ts + live conquest game)](./entities/conquest-engine-and-live-game.md) — The playable implementation of [[risk-darts-proposed-game-mode]] (Trebles & Territories): a pure, TDD'd game engine plus the board component and live game route
- [Email store (email.ts)](./entities/email-store-email-ts.md) — `src/lib/stores/email.ts` — the single source of truth for the signed-in player identity. All routes read through it (no route reads `darts_email` directly); th
- [Spectator Interviews (Trebles & Territories)](./entities/spectator-interviews-trebles-territories.md) — Spectator Interviews (Trebles & Territories)
- [TV second screen (cast views)](./entities/tv-second-screen-cast-views.md) — Read-only big-screen views of a live match, meant for tab-casting to a TV in the room: one route for classic matches, one for conquest. The scorer pages carry c
- [docs/risk/ assets (Risk board SVGs + notes)](./artifacts/docs-risk-assets-risk-board-svgs-notes.md) — Reference assets for the Risk-style conquest mode ([[risk-darts-proposed-game-mode]] / Trebles & Territories): two classic Risk board SVGs (`Risk_board.svg` ~50
- [Risk 42 (proposed game mode)](./concepts/risk-42-proposed-game-mode.md) — What is it?
- [Risk dart board mockup (risk-dart-board.svg)](./artifacts/risk-dart-board-mockup-risk-dart-board-svg.md) — The derived working SVG for the real-Risk-map redesign of the conquest mode: the classic Risk world map relaid out as the dartboard's 42-territory claimable sur
- [Board preview & fit-map (docs/risk/fit-map.cjs + board-preview.html)](./artifacts/board-preview-fit-map-docs-risk-fit-map-cjs-board-preview-ht.md) — The generator + eyeball artifact for the [[world-map-dartboard-mapping-via-azimuthal-projection-hungari|world map → dartboard territory mapping]] in [[risk-dart
- [dart-board.svg (extracted production dartboard)](./artifacts/dart-board-svg-extracted-production-dartboard.md) — A clean, static SVG of the standard dartboard extracted directly from the live scorer's rendered `Dartboard.svelte` output on a production match page (https://w
- [dart-board-for-map.svg (Risk-mapped dartboard)](./artifacts/dart-board-for-map-svg-risk-mapped-dartboard.md) — The pristine production dartboard SVG (`docs/risk/dart-board-orig.svg`, a copy of the board extracted from `Dartboard.svelte`) patched with the Risk → dartboard
- [Risk 42 territory mapping (mapping.json)](./artifacts/risk-42-territory-mapping-mapping-json.md) — Canonical machine-readable game data for [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md): every one of the 40 numbered boxes mapped to `
- [DartBoardInGame.svg (id-addressable in-game board)](./artifacts/dartboardingame-svg-id-addressable-in-game-board.md) — A wedge-by-wedge export of the production dartboard geometry (`Dartboard.svelte`), rebuilt with self-explanatory, collision-free element ids — the board the Ris
