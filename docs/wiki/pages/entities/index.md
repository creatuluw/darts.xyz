# Entities

_Concrete named things will be listed here._
- [dart.monster DNS & Railway domain setup](./dart-monster-dns-railway-domain-setup.md) - Concrete infrastructure: how `dart.monster` (this project, also deployed as darts.xyz) is wired to its Railway service, as of 2026-09-07.
- [E2E helpers](./e2e-helpers.md) - `e2e/helpers.ts` — the shared seeding/util module every Playwright spec imports. It owns the account-isolation and persistence gotchas so each spec doesn't redi
- [Live Match Page](./live-match-page.md) - What is it?
- [PlayerPanel](./playerpanel.md) - A reusable scoreboard panel component for the live match scorer, extracted from two ~300-line identical hardcoded player blocks (`players[0]` left / `players[1]
- [Match Stats Tab](./match-stats-tab.md) - What is it?
- [LLM Commentary (Trebles & Territories)](./llm-commentary-trebles-territories.md) - The in-game AI commentary feed for [[risk-darts-proposed-game-mode|Trebles & Territories]]: an LLM writes a commentary blurb **every 2 turns**, rendered in a de
- [Recap Video Pipeline (Trebles & Territories)](./recap-video-pipeline-trebles-territories.md) - The planned **Morning-After recap** feature for [[risk-darts-proposed-game-mode|Trebles & Territories]]: the day after a game, each match gets an LLM-generated
- [Conquest setup (Fun tab + conquest-setup.ts)](./conquest-setup-fun-tab-conquest-setup-ts.md) - The first shipped code for [[risk-darts-proposed-game-mode]] (Trebles and Territories): the **Fun tab** on the match setup page plus the pure setup-logic module
- [Conquest engine (conquest-engine.ts + live conquest game)](./conquest-engine-and-live-game.md) - The playable implementation of [[risk-darts-proposed-game-mode]] (Trebles & Territories): a pure, TDD'd game engine plus the board component and live game route
- [Email store (email.ts)](./email-store-email-ts.md) - `src/lib/stores/email.ts` — the single source of truth for the signed-in player identity. All routes read through it (no route reads `darts_email` directly); th
- [Spectator Interviews (Trebles & Territories)](./spectator-interviews-trebles-territories.md) - The planned mid-game **spectator interview** feature: an LLM generates a short interview — a commentator asks a question, a random spectator persona answers — i
- [TV second screen (cast views)](./tv-second-screen-cast-views.md) - Read-only big-screen views of a live match, meant for tab-casting to a TV in the room: one route for classic matches, one for conquest. The scorer pages carry c
- [Risk 42 engine (risk-engine.ts)](./risk-42-engine-risk-engine-ts.md) - The pure, TDD'd game engine implementing [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) — Risk 42 played on the standard dartboard wher
