---
okf_version: "0.1"
---

<!-- wiki-memory:start -->
# Memory — the live contract

Auto-generated digest of the most recent conventions, decisions, rules and
development patterns, plus architecture and global patterns — newest first.
The actual files live in the wiki subfolders; follow the links (clickable in /wiki).
Regenerated on every wiki write and on wiki_mark_synced. Generated 2026-10-28T19:27:15.256Z.

## Recent Decisions

- [Wiki scope: product knowledge only — all dev-process content removed](decisions/wiki-scope-product-knowledge-only-all-dev-process-content-re.md) — Context (2026-10-28)
- [Risk 42 card hoarding is unlimited — no mandatory cash-in at 5+ cards](decisions/risk-42-card-hoarding-unlimited.md) — Context (2026-10-23)
- [Risk 42 income rework proposed: continent bonus out, max(3, territories/6) darts per turn](decisions/risk-42-income-rework-continent-bonus-out.md) — Context (2026-10-23)
- [Risk 42 reach rule: darts only count on own or adjacent territories](decisions/risk-42-reach-rule-own-or-adjacent.md) — Context (2026-10-23)
- [Risk 42 territory cards: conquest earns a card, sets cash in for dart bursts with escalation](decisions/risk-42-territory-cards-conquest-earns-card.md) — Context (2026-10-23)
- [Risk 42 Arsenal becomes a bankable dart economy: bull 25 = +2 darts, bullseye 50 = +3, savable](decisions/risk-42-arsenal-bankable-dart-economy.md) — Context (2026-10-23)
- [Risk 42 6-player legibility: hue-spread player palette, collision-free chips, podium scrim](decisions/risk-42-6-player-legibility.md) — Context (2026-09-09)
- [Commentary API degrades per-segment — TTS failure drops to subtitles, never a whole-request 502](decisions/commentary-api-degrades-per-segment-tts-failure.md) — Context (2026-09-09)
- [Risk 42 TV: full-bleed map with overlay panels pinned to measured-empty margins](decisions/risk-42-tv-full-bleed-map-with-overlay-panels.md) — Context (2026-09-09)
- [Risk 42 wears the classic Risk continent palette everywhere](decisions/risk-42-wears-the-classic-risk-continent-palette.md) — Context (2026-09-09)
- [TvStage fills the viewport (independent x/y scale) — letterboxing dropped](decisions/tvstage-fills-the-viewport-independent-x-y-scale.md) — Context (2026-09-09)
- [TV cast pages render on a fixed 1920×1080 TvStage canvas, scaled to fit — no viewport breakpoints](decisions/tv-cast-pages-render-on-a-fixed-1920-1080-tvstage.md) — Context (2026-09-09)
- [Risk 42 server persistence rides conquest_games + /api/conquest — sessionStorage stopgap superseded](decisions/risk-42-server-persistence-rides-conquest-api.md) — Context (2026-09-09)
- [Commentary becomes a 4-segment broadcast with Leo & Theodore swapping roles](decisions/commentary-becomes-a-4-segment-broadcast.md) — Context (2026-09-09)
- [Risk 42 v1 persists to sessionStorage (stopgap) — server write-through lands at M3](decisions/risk-42-v1-persists-to-sessionstorage-stopgap.md) — Context (2026-09-09)

## Active Rules

- [Derive stats from state deltas, never by substring-matching log copy](rules/derive-stats-from-state-deltas-never-by-substring.md) — **Guideline:** Never derive a gameplay stat by scanning or substring-matching human-readable log lines. Count from state deltas (or engine r… (2026-10-24)
- [When a playtest stalls under background-tab throttling, finish the game via the engine + PATCH — don't tab-hop](rules/when-a-playtest-stalls-under-background-tab.md) — The guideline (2026-09-09)
- [Prove overlays never block gameplay: live-DOM bbox measurement + zero-intersection assert](rules/prove-overlays-never-block-gameplay-live-dom.md) — The guideline (2026-09-09)
- [New game modes follow the conquest cut: pure setup module + Fun-tab card + own route/board](rules/new-game-modes-follow-the-conquest-cut-pure-setup.md) — The rule (2026-09-09)
- [Engine invariant sweeps: plain asserts, assert theorems not emergence, validate against contract sets](rules/engine-invariant-sweeps-plain-asserts-assert.md) — The guideline (2026-09-09)
- [Board SVGs are generated — edit the regenerator, never the output](rules/board-svgs-are-generated.md) — Guideline (2026-09-08)
- [Use $app/stores $page for page state — house style](rules/use-app-stores-page-for-page-state-house-style.md) — Rule (2026-09-07)
- [Use the Tooltip component, not native title attributes](rules/use-tooltip-not-native-title.md) — Guideline (2026-09-07)
- [Never hardcode player slots in match UI](rules/never-hardcode-player-slots-in-match-ui.md) — Guideline (2026-09-07)

## Recent Learnings — development patterns

- [Wiki-recap staged files sweep into the next commit](learnings/wiki-recap-staged-files-sweep-into-the-next-commit.md) — **The gotcha:** the wiki-recap subagent writes docs/wiki/ files at the end of turns and leaves them staged in the git index. A later `git ad… (2026-10-28)
- [Railway auto-deploy can silently skip a master push — verify timestamp vs latest commit, fallback is railway up](learnings/railway-auto-deploy-can-silently-skip-a-master-push-verify-t.md) — **Found on 2026-10-28** while checking whether PR #18 (`7d01bcf`, "always show the dartboard on the Board tab") was live. (2026-10-28)
- [Bulk-deleting wiki concepts strands links — grep short slugs too and let wiki_validate catch the rest](learnings/bulk-deleting-wiki-concepts-strands-links-grep-short-slugs-t.md) — **The gotcha:** deleting a wiki concept file does NOT clean up references to it. Folder indexes (`rules/index.md`, `decisions/index.md`, …) … (2026-10-28)
- [inputMode lives in per-origin localStorage — same repo on different ports shows different scorer state](learnings/inputmode-lives-in-per-origin-localstorage-same-repo-on-diff.md) — **The gotcha:** a user report of "the dartboard is broken on the same repo, other port" turned out to be **per-origin localStorage divergenc… (2026-10-28)
- [Abandon match is instant with no confirmation](learnings/abandon-match-is-instant-with-no-confirmation.md) — **Found during the 2026-10-28 four-game test sweep** (Game 2, 3-player 301). (2026-10-28)
- [Double-in is a dead toggle — saved and loaded, never enforced in scoring](learnings/double-in-is-a-dead-toggle-saved-and-loaded-never-enforced-i.md) — **Found during the 2026-10-28 four-game test sweep** (Game 3: 701 double-in, 2 players) — highest-severity finding of the sweep. (2026-10-28)
- [Numpad multiplier relabels number buttons (T20/D20) — and the selection persists across turns](learnings/numpad-multiplier-relabels-number-buttons-t20-d20-and-the-se.md) — **Found during the 2026-10-28 four-game test sweep**, driving the live scorer via browser automation. (2026-10-28)
- [deleteLastTurn UI: shared confirm state + restore uses the wrong player's remaining score](learnings/deletelastturn-ui-shared-confirm-state-restore-uses-the-wron.md) — **Found during the 2026-10-28 neo-browser delete-turn test campaign**, verified live in both a 2-player and a 3-player match. The trash-icon… (2026-10-28)
- [Turns DELETE endpoint silently no-ops — params.id (match id) shadows the turn-id query param](learnings/turns-delete-endpoint-silently-no-ops-params-id-match-id-sha.md) — **Found during the 2026-10-28 neo-browser delete-turn test campaign** (2-player match `96c568e8`, 3-player match `02cae89f`). (2026-10-28)
- [Risk 42 adjacency table drifts from classic Risk by 3 edges — edge-sampling tests can't catch membership drift](learnings/risk-42-adjacency-table-drifts-from-classic-risk.md) — **Found in the 2026-10-24 three-axis code review** of PR #17 (commit 2c4d474) — Spec axis, should-fix/high. (2026-10-24)
- [Bank folded in at handover loses provenance — carry it on the object (turn.carried)](learnings/bank-folded-in-at-handover-loses-provenance-carry.md) — **The gotcha:** in Risk 42 the engine adds the player's saved-dart bank to the next turn's budget *at handover* — so by the time the UI rend… (2026-10-23)
- [Playwright hit-target check fails at the bull's center — the 50 ring paints on top; click the 25 ring off-center](learnings/playwright-hit-target-fails-at-bull-center.md) — **The gotcha:** in the dartboard SVG the bullseye (50) is painted **on top of** the single bull (25). A Playwright click aimed at the exact … (2026-10-23)
- [TV commentary hangs on one segment: audio events never fire in throttled windows — race every segment against a reading-time cap](learnings/tv-commentary-hangs-on-one-segment-audio-events.md) — Discovered during the 2026-09-09/10 prod playtest campaign (session 6): the TV commentary broadcast could hang forever on ONE segment. Root … (2026-09-09)
- [startRisk clears risk42_state but not risk42_game_id — new game silently resumes the old one](learnings/startrisk-clears-risk42-state-not-game-id.md) — **Found during the Risk 42 prod playtest campaign (2026-09-09/10), logged P1.** (2026-09-09)
- [Commentary LLM = DeepSeek deepseek-v4-flash (from glm-5.3-flash); ~1s LLM latency](learnings/commentary-llm-deepseek-v4-flash.md) — 2026-09-09 evening: commentary LLM switched from OpenCode Zen Go (glm-5.3-flash, ~20-50s latency, needed x-opencode-session header) to **Dee… (2026-09-09)
- [Risk map SVG layers share a translate(-168,-119) — apply it when extracting paths or labels misalign](learnings/risk-map-svg-layers-share-a-translate-168-119.md) — While building the Risk 42 TV world map (2026-09-09): `docs/risk/risk-territory-board.svg` puts ALL its content layers (countries, labels, t… (2026-09-09)
- [TV cast pages freeze in background tabs — document.hidden pauses polling and commentary](learnings/tv-cast-pages-freeze-in-background-tabs-document.md) — All three TV cast routes — `src/routes/match/[id]/tv/+page.svelte` (classic), `src/routes/match/conquest/[id]/tv/+page.svelte` (T&T), `src/r… (2026-09-09)
- [Neo ref-clicks silently no-op on some SvelteKit buttons — use evaluate el.click()](learnings/neo-ref-clicks-silently-no-op-on-some-sveltekit.md) — During the 2026-09-09 playtest sessions, driving the real app through BrowserOS neo's CDP-based `input().click(ref)` **failed silently** on … (2026-09-09)
- [Commentary pipeline: ~25s real cost vs 20s timeout — raise/parallelize](learnings/commentary-pipeline-25s-real-cost-vs-20s-timeout.md) — Measured while playtesting all game modes on 2026-09-09: the 4-segment commentary pipeline (glm-5.3-flash LLM call + 4 sequential ElevenLabs… (2026-09-09)
- [scrollbar-gutter: stable reserves 15px that window.innerWidth counts — measure the host box](learnings/scrollbar-gutter-stable-reserves-15px.md) — The gotcha (2026-09-09)

## Architecture

- [File tree](architecture/file-tree.md) — Complete project file listing with per-file descriptions. (2026-09-07)

## Global Patterns

- [Risk 42 (proposed game mode)](pages/concepts/risk-42-proposed-game-mode.md) — What is it? (2026-10-23)
- [Risk Darts (proposed game mode)](pages/concepts/risk-darts-proposed-game-mode.md) — What is it? (2026-09-07)

<!-- wiki-memory:end -->
