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
