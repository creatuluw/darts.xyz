---
okf_version: "0.1"
---

<!-- wiki-memory:start -->
# Memory — the live contract

Auto-generated digest of the most recent conventions, decisions, rules and
development patterns, plus architecture and global patterns — newest first.
The actual files live in the wiki subfolders; follow the links (clickable in /wiki).
Regenerated on every wiki write and on wiki_mark_synced. Generated 2026-10-23T13:37:04.806Z.

## Recent Decisions

- [Risk 42 Arsenal becomes a bankable dart economy: bull 25 = +2 darts, bullseye 50 = +3, savable](decisions/risk-42-arsenal-becomes-a-bankable-dart-economy-bull-25-2-da.md) — Context (2026-10-23)
- [Risk 42 6-player legibility: hue-spread player palette, collision-free chips, podium scrim](decisions/risk-42-6-player-legibility-hue-spread-player-palette-collis.md) — Context (2026-09-09)
- [Commentary API degrades per-segment — TTS failure drops to subtitles, never a whole-request 502](decisions/commentary-api-degrades-per-segment-tts-failure-drops-to-sub.md) — Context (2026-09-09)
- [Risk 42 TV: full-bleed map with overlay panels pinned to measured-empty margins](decisions/risk-42-tv-full-bleed-map-with-overlay-panels-pinned-to-meas.md) — Context (2026-09-09)
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

## Active Rules

- [Worktree feature loop: PR-only master, worktrees in E:/worktrees/, user merges](rules/worktree-feature-loop.md) — House workflow for all feature work — PR-only master, worktrees under E:/worktrees/ (locked while active), provably-lossless cleanup only, a… (2026-10-23)
- [When a playtest stalls under background-tab throttling, finish the game via the engine + PATCH — don't tab-hop](rules/when-a-playtest-stalls-under-background-tab-throttling-finis.md) — The guideline (2026-09-09)
- [Prove overlays never block gameplay: live-DOM bbox measurement + zero-intersection assert](rules/prove-overlays-never-block-gameplay-live-dom-bbox-measuremen.md) — The guideline (2026-09-09)
- [New game modes follow the conquest cut: pure setup module + Fun-tab card + own route/board](rules/new-game-modes-follow-the-conquest-cut-pure-setup-module-fun.md) — The rule (2026-09-09)
- [Engine invariant sweeps: plain asserts, assert theorems not emergence, validate against contract sets](rules/engine-invariant-sweeps-plain-asserts-assert-theorems-not-em.md) — The guideline (2026-09-09)
- [Board SVGs are generated — edit the regenerator, never the output](rules/board-svgs-are-generated.md) — Guideline (2026-09-08)
- [Ask clarifying questions one at a time — user preference](rules/one-question-at-a-time.md) — The rule (2026-09-08)
- [Use $app/stores $page for page state — house style](rules/use-app-stores-page-for-page-state-house-style.md) — Rule (2026-09-07)
- [All code/logic todos must use the TDD skill (red→green→refactor)](rules/logic-todos-must-use-tdd-skill.md) — The rule (2026-09-07)
- [Use the Tooltip component, not native title attributes](rules/use-tooltip-not-native-title.md) — Guideline (2026-09-07)
- [Never hardcode player slots in match UI](rules/never-hardcode-player-slots-in-match-ui.md) — Guideline (2026-09-07)

## Preferences & Conventions

- [Ask design questions one-by-one, never batched](preferences/ask-design-questions-one-by-one-never-batched.md) — During grilling/interview sessions (and design Q&A generally), the user wants questions **one at a time**, not the grilling skill's default … (2026-09-08)

## Recent Learnings — development patterns

- [Bank folded in at handover loses provenance — carry it on the object (turn.carried)](learnings/bank-folded-in-at-handover-loses-provenance-carry-it-on-the-.md) — **The gotcha:** in Risk 42 the engine adds the player's saved-dart bank to the next turn's budget *at handover* — so by the time the UI rend… (2026-10-23)
- [Playwright hit-target check fails at the bull's center — the 50 ring paints on top; click the 25 ring off-center](learnings/playwright-hit-target-check-fails-at-the-bull-s-center-the-5.md) — **The gotcha:** in the dartboard SVG the bullseye (50) is painted **on top of** the single bull (25). A Playwright click aimed at the exact … (2026-10-23)
- [TV commentary hangs on one segment: audio events never fire in throttled windows — race every segment against a reading-time cap](learnings/tv-commentary-hangs-on-one-segment-audio-events-never-fire-i.md) — Discovered during the 2026-09-09/10 prod playtest campaign (session 6): the TV commentary broadcast could hang forever on ONE segment. Root … (2026-09-09)
- [startRisk clears risk42_state but not risk42_game_id — new game silently resumes the old one](learnings/startrisk-clears-risk42-state-but-not-risk42-game-id-new-gam.md) — **Found during the Risk 42 prod playtest campaign (2026-09-09/10), logged P1.** (2026-09-09)
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

## Architecture

- [File tree](architecture/file-tree.md) — Complete project file listing with per-file descriptions. (2026-09-07)

## Global Patterns

- [Risk 42 (proposed game mode)](pages/concepts/risk-42-proposed-game-mode.md) — What is it? (2026-10-23)
- [Risk Darts (proposed game mode)](pages/concepts/risk-darts-proposed-game-mode.md) — What is it? (2026-09-07)

<!-- wiki-memory:end -->
