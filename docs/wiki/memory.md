---
okf_version: "0.1"
---

<!-- wiki-memory:start -->
# Memory — the live contract

Auto-generated digest of the most recent conventions, decisions, rules and
development patterns, plus architecture and global patterns — newest first.
The actual files live in the wiki subfolders; follow the links (clickable in /wiki).
Regenerated on every wiki write and on wiki_mark_synced. Generated 2026-09-09T21:10:13.266Z.

## Recent Decisions

- [Risk 42 wears the classic Risk continent palette everywhere](decisions/risk-42-wears-the-classic-risk-continent-palette-everywhere.md) — Context (2026-09-09)
- [TvStage fills the viewport (independent x/y scale) — letterboxing dropped](decisions/tvstage-fills-the-viewport-independent-x-y-scale-letterboxin.md) — Context (2026-09-09)
- [TV cast pages render on a fixed 1920×1080 TvStage canvas, scaled to fit — no viewport breakpoints](decisions/tv-cast-pages-render-on-a-fixed-1920-1080-tvstage-canvas-sca.md) — Context (2026-09-09)
- [Risk 42 server persistence rides conquest_games + /api/conquest — sessionStorage stopgap superseded](decisions/risk-42-server-persistence-rides-conquest-games-api-conquest.md) — Context (2026-09-09)
- [Commentary becomes a 4-segment broadcast with Leo & Theodore swapping roles](decisions/commentary-becomes-a-4-segment-broadcast-with-leo-theodore-s.md) — Context (2026-09-09)
- [Risk 42 v1 persists to sessionStorage (stopgap) — server write-through lands at M3](decisions/risk-42-v1-persists-to-sessionstorage-stopgap-server-write-t.md) — Context (2026-09-09)
- [Risk 42 applyDart seam: DartHit carries singleRing for singles](decisions/risk-42-applydart-seam-darthit-carries-singlering-for-single.md) — Context (2026-09-09)
- [Risk 42 two-screen identity: dartboard to play, world map to spectate](decisions/risk-42-two-screen-identity-dartboard-to-play-world-map-to-s.md) — Context (2026-09-09)
- [Risk 42 deal amended: exactly equal deal, 2 armies each, blank leftovers claimable, players pick starter](decisions/risk-42-deal-final-equal-2-armies-blanks.md) — Context (2026-09-09)
- [Risk 42 game start: random deal of all 40 territories (1 army each), no claiming phase](decisions/risk-42-game-start-random-deal.md) — Context (2026-09-09)
- [Risk 42 continent income: +1 dart per full continent (Asia +2); budget shown pre-turn](decisions/risk-42-continent-income.md) — Context (2026-09-09)
- [Risk 42 bulls: the Arsenal charge (25 = +1, 50 = +2)](decisions/risk-42-bulls-the-arsenal-charge-25-1-50-2.md) — Context (2026-09-09)
- [Risk 42 elimination: exile & clawback — zero boxes ≠ death](decisions/risk-42-exile-and-clawback.md) — Context (2026-09-09)
- [Risk 42 endgame: Domination as headline, 170/301/501 clock as alt — mirroring T&T](decisions/risk-42-domination-headline-clock-alt.md) — Context (2026-09-09)
- [Territory labels go horizontal: centered in each box, no rotation](decisions/territory-labels-go-horizontal-centered-in-each.md) — Context (2026-09-08)

## Active Rules

- [New game modes follow the conquest cut: pure setup module + Fun-tab card + own route/board](rules/new-game-modes-follow-the-conquest-cut-pure-setup-module-fun.md) — The rule (2026-09-09)
- [Engine invariant sweeps: plain asserts, assert theorems not emergence, validate against contract sets](rules/engine-invariant-sweeps-plain-asserts-assert-theorems-not-em.md) — The guideline (2026-09-09)
- [Board SVGs are generated — edit the regenerator, never the output](rules/board-svgs-are-generated.md) — Guideline (2026-09-08)
- [Ask clarifying questions one at a time — user preference](rules/one-question-at-a-time.md) — The rule (2026-09-08)
- [Worktree feature loop: PR-only master, worktrees in E:/worktrees/, user merges](rules/worktree-feature-loop.md) — House workflow for all feature work — PR-only master, worktrees under E:/worktrees/ (locked while active), provably-lossless cleanup only, a… (2026-09-08)
- [Use $app/stores $page for page state — house style](rules/use-app-stores-page-for-page-state-house-style.md) — Rule (2026-09-07)
- [All code/logic todos must use the TDD skill (red→green→refactor)](rules/logic-todos-must-use-tdd-skill.md) — The rule (2026-09-07)
- [Use the Tooltip component, not native title attributes](rules/use-tooltip-not-native-title.md) — Guideline (2026-09-07)
- [Never hardcode player slots in match UI](rules/never-hardcode-player-slots-in-match-ui.md) — Guideline (2026-09-07)

## Preferences & Conventions

- [Ask design questions one-by-one, never batched](preferences/ask-design-questions-one-by-one-never-batched.md) — During grilling/interview sessions (and design Q&A generally), the user wants questions **one at a time**, not the grilling skill's default … (2026-09-08)

## Recent Learnings — development patterns

- [Commentary LLM = DeepSeek deepseek-v4-flash (from glm-5.3-flash); ~1s LLM latency](learnings/commentary-llm-deepseek-deepseek-v4-flash-from-glm-5-3-flash.md) — 2026-09-09 evening: commentary LLM switched from OpenCode Zen Go (glm-5.3-flash, ~20-50s latency, needed x-opencode-session header) to **Dee… (2026-09-09)
- [Risk map SVG layers share a translate(-168,-119) — apply it when extracting paths or labels misalign](learnings/risk-map-svg-layers-share-a-translate-168-119-apply-it-when-.md) — While building the Risk 42 TV world map (2026-09-09): `docs/risk/risk-territory-board.svg` puts ALL its content layers (countries, labels, t… (2026-09-09)
- [TV cast pages freeze in background tabs — document.hidden pauses polling and commentary](learnings/tv-cast-pages-freeze-in-background-tabs-document-hidden-paus.md) — All three TV cast routes — `src/routes/match/[id]/tv/+page.svelte` (classic), `src/routes/match/conquest/[id]/tv/+page.svelte` (T&T), `src/r… (2026-09-09)
- [Neo ref-clicks silently no-op on some SvelteKit buttons — use evaluate el.click()](learnings/neo-ref-clicks-silently-no-op-on-some-sveltekit-buttons-use-.md) — During the 2026-09-09 playtest sessions, driving the real app through BrowserOS neo's CDP-based `input().click(ref)` **failed silently** on … (2026-09-09)
- [Commentary pipeline: ~25s real cost vs 20s timeout — raise/parallelize](learnings/commentary-pipeline-25s-real-cost-vs-20s-timeout-raise-paral.md) — Measured while playtesting all game modes on 2026-09-09: the 4-segment commentary pipeline (glm-5.3-flash LLM call + 4 sequential ElevenLabs… (2026-09-09)
- [scrollbar-gutter: stable reserves 15px that window.innerWidth counts — measure the host box](learnings/scrollbar-gutter-stable-reserves-15px-that-window-innerwidth.md) — The gotcha (2026-09-09)
- [Merged-PR leftovers in the main tree block the pull — verify identical, then discard](learnings/merged-pr-leftovers-in-the-main-tree-block-the-pull-verify-i.md) — Merged-PR leftovers in the main tree block the post-cleanup pull (2026-09-09)
- [Squash-merged branch: commit-ahead ≠ unmerged — prove with git cherry](learnings/squash-merged-branch-commit-ahead-unmerged-prove-with-git-ch.md) — Squash-merged branch: commit-ahead ≠ unmerged (2026-09-09)
- [Junctioned node_modules needs Vite server.fs.allow — client entry 403s otherwise](learnings/junctioned-node-modules-needs-vite-server-fs-allow-client-en.md) — The fact (2026-09-09)
- [Playwright reuses orphaned dev servers — E2E can silently test master code, not your worktree](learnings/playwright-reuses-orphaned-dev-servers-e2e-can-silently-test.md) — The fact (2026-09-09)
- [Plain `let` assigned in async onMount never re-renders — must be $state](learnings/plain-let-assigned-in-async-onmount-never-re-renders-must-be.md) — The gotcha (2026-09-09)
- [Copy .env into a fresh worktree BEFORE starting the dev server — Vite loads it at startup only](learnings/copy-env-into-a-fresh-worktree-before-starting-the-dev-serve.md) — Symptom (2026-09-09)
- [Vitest can't see type holes — esbuild strips types; svelte-check is the only net](learnings/vitest-can-t-see-type-holes-esbuild-strips-types-svelte-chec.md) — The gotcha (2026-09-09)
- [Vitest/Playwright suite is uncommitted — master branches have no test runner](learnings/vitest-suite-uncommitted-master-has-no-test-runner.md) — UPDATE 2026-09-08: the suite is committed on feature/trebles-territories (PR #2, 112 unit tests) — master branches still have no test runner… (2026-09-09)
- [Sync infinite loop in a test helper hangs vitest with no timeout](learnings/sync-infinite-loop-in-a-test-helper-hangs-vitest-with-no-tim.md) — The symptom (2026-09-09)
- [Engine test helpers must adapt to live dart budgets — income mechanics break fixed throw counts](learnings/engine-test-helpers-must-adapt-to-live-dart-budgets-income-m.md) — Engine test helpers must adapt to live dart budgets — income mechanics break fixed throw counts (2026-09-09)
- [Game-engine tests: filler darts must be misses, and fixtures obey the rules they enforce](learnings/game-engine-tests-filler-darts-must-be-misses-and-fixtures-o.md) — Caught red-handed twice during the Risk 42 M1 TDD cycles (2026-09-09), both produced false reds (and one false green that slipped into a com… (2026-09-09)
- [Fresh SvelteKit worktree needs `svelte-kit sync` before tests run](learnings/fresh-sveltekit-worktree-needs-svelte-kit-sync-before-tests-.md) — Gotcha from the Risk 42 M1 build (2026-09-09): a freshly created SvelteKit worktree (deps junctioned from the main checkout) is **missing th… (2026-09-09)
- [risk-territory-board.svg palette: fills live in layer2, join to territories by centroid containment](learnings/risk-territory-board-svg-palette-fills-live-in-layer2-join-t.md) — The world map for the Risk 42 TV view (`docs/risk/risk-territory-board.svg`, a copy of `risk-board.svg`) carries its **per-territory tints i… (2026-09-09)
- [Top-level return in a CJS script skips the file write — silent no-op](learnings/top-level-return-in-a-cjs-script-skips-the-file.md) — Gotcha (2026-09-08)

## Architecture

- [File tree](architecture/file-tree.md) — Complete project file listing with per-file descriptions. (2026-09-07)

## Global Patterns

- [Risk 42 (proposed game mode)](pages/concepts/risk-42-proposed-game-mode.md) — What is it? (2026-09-09)
- [Risk Darts (proposed game mode)](pages/concepts/risk-darts-proposed-game-mode.md) — What is it? (2026-09-07)

<!-- wiki-memory:end -->
