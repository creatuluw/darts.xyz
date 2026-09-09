---
okf_version: "0.1"
---

# Project Knowledge Wiki

<!-- wiki-nav:start -->
## Navigation map

Auto-generated detailed index of every docs/wiki/ concept — the map the LLM uses to locate information. 134 concept(s). Regenerated on init and on wiki_mark_synced. Generated 2026-09-09T21:10:13.134Z.

Each entry: [title](concept-id.md) — description. Links are clickable in /wiki; pass the concept-id (link target minus .md) to wiki_get.

### Core concepts

- [Glossary](glossary.md) — Key terms for this project.
- [Overview](overview.md) — What this project contains and its structure.

### Architecture

- [File tree](architecture/file-tree.md) — Complete project file listing with per-file descriptions.

### Pages

- [Board preview & fit-map (docs/risk/fit-map.cjs + board-preview.html)](pages/artifacts/board-preview-and-fit-map.md) — The generator + eyeball artifact for the [world map → dartboard territory mapping|world map → dartboard territory mapping]] in [[risk-dart
- [dart-board-for-map.svg (Risk-mapped dartboard)](pages/artifacts/dart-board-for-map-svg-risk-mapped-dartboard.md) — The pristine production dartboard SVG (`docs/risk/dart-board-orig.svg`, a copy of the board extracted from `Dartboard.svelte`) patched with the Risk → dartboard
- [dart-board.svg (extracted production dartboard)](pages/artifacts/dart-board-svg-extracted-production-dartboard.md) — A clean, static SVG of the standard dartboard extracted directly from the live scorer's rendered `Dartboard.svelte` output on a production match page (https://w
- [DartBoardInGame.svg (id-addressable in-game board)](pages/artifacts/dartboardingame-svg-id-addressable-in-game-board.md) — A wedge-by-wedge export of the production dartboard geometry (`Dartboard.svelte`), rebuilt with self-explanatory, collision-free element ids — the board the Ris
- [docs/risk/ assets (Risk board SVGs + notes)](pages/artifacts/docs-risk-assets-risk-board-svgs-notes.md) — Reference assets for the Risk-style conquest mode ([[risk-darts-proposed-game-mode]] / Trebles & Territories): two classic Risk board SVGs (`Risk_board.svg` ~50
- [In-game session testing reports (docs/in-game-session-testing/)](pages/artifacts/in-game-session-testing-reports-docs-in-game-session-testing.md) — Four full playtest session reports from 2026-09-09, played through the real UI (BrowserOS neo against the dev server, master `46a429e`) with the TV second scree
- [Risk 42 implementation spec](pages/artifacts/risk-42-implementation-spec.md) — The implementation spec for **Risk 42** — the self-contained HTML design document (built with the html-docs skill) that drives the build. Written 2026-09-09; co
- [Risk 42 territory mapping (mapping.json)](pages/artifacts/risk-42-territory-mapping-mapping-json.md) — Canonical machine-readable game data for [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md): every one of the 40 numbered boxes mapped to `
- [Risk dart board mockup (risk-dart-board.svg)](pages/artifacts/risk-dart-board-mockup-risk-dart-board-svg.md) — The canonical labeled design board for the Risk-on-a-dartboard redesign: the id-addressable in-game board cloned with all 40 territory names — full names,
- [Test suite](pages/artifacts/test-suite.md) — The automated test layer for dart.monster: Vitest unit tests over the pure game modules, plus Playwright E2E tests (API lifecycle + real-browser UI) that
- [Trebles and Territories player manual](pages/artifacts/trebles-and-territories-player-manual.md) — Player-facing rules-only HTML manual distilling the Trebles and Territories implementation spec into 7 short Dutch sections.
- [Trebles & Territories implementation spec](pages/artifacts/trebles-territories-implementation-spec.md) — The implementation spec for **Trebles and Territories** — the self-contained HTML design document (built with the html-docs skill) that drives the build. Contai
- [Risk 42 (proposed game mode)](pages/concepts/risk-42-proposed-game-mode.md) — What is it?
- [Risk Darts (proposed game mode)](pages/concepts/risk-darts-proposed-game-mode.md) — What is it?
- [Conquest engine (conquest-engine.ts + live conquest game)](pages/entities/conquest-engine-and-live-game.md) — The playable implementation of [[risk-darts-proposed-game-mode]] (Trebles & Territories): a pure, TDD'd game engine plus the board component and live game route
- [Conquest setup (Fun tab + conquest-setup.ts)](pages/entities/conquest-setup-fun-tab-conquest-setup-ts.md) — The first shipped code for [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) (Trebles and Territories): the **Fun tab** on the match setup page plus the pure setup-logic module
- [dart.monster DNS & Railway domain setup](pages/entities/dart-monster-dns-railway-domain-setup.md) — Concrete infrastructure: how `dart.monster` (this project, also deployed as darts.xyz) is wired to its Railway service, as of 2026-09-07.
- [E2E helpers](pages/entities/e2e-helpers.md) — `e2e/helpers.ts` — the shared seeding/util module every Playwright spec imports. It owns the account-isolation and persistence gotchas so each spec doesn't redi
- [Email store (email.ts)](pages/entities/email-store-email-ts.md) — `src/lib/stores/email.ts` — the single source of truth for the signed-in player identity. All routes read through it (no route reads `darts_email` directly); th
- [Live Match Page](pages/entities/live-match-page.md) — What is it?
- [LLM Commentary (Trebles & Territories)](pages/entities/llm-commentary-trebles-territories.md) — The in-game AI commentary/interview broadcast layer: an LLM writes Dutch commentary and spectator interviews at every-N-turn boundaries, voiced and subtitled on
- [Match Stats Tab](pages/entities/match-stats-tab.md) — All-players statistics table in the live match UI, plus the leg/match average displays shipped with it.
- [PlayerPanel](pages/entities/playerpanel.md) — A reusable scoreboard panel component for the live match scorer, rendered around the board for every roster size (full-size for 1–2 players, condensed cards for 3–6).
- [Recap Video Pipeline (Trebles & Territories)](pages/entities/recap-video-pipeline-trebles-territories.md) — The planned Morning-After recap feature for Trebles & Territories: the day after a game, each match gets an LLM-generated recap video, and players who stored an email address receive a link to it.
- [Risk 42 engine (risk-engine.ts)](pages/entities/risk-42-engine-risk-engine-ts.md) — The pure, TDD'd game engine implementing [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) — Risk 42 played on the standard dartboard wher
- [Risk 42 playable game (risk-setup + Fun tab + /match/risk + RiskBoard)](pages/entities/risk-42-playable-game-risk-setup-fun-tab-match-risk-riskboar.md) — The playable **M2.3 cut** of [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md): the pure setup module, the Fun-tab format picker, and the 
- [Spectator Interviews (Trebles & Territories)](pages/entities/spectator-interviews-trebles-territories.md) — Spectator Interviews (Trebles & Territories)
- [TV second screen (cast views)](pages/entities/tv-second-screen-cast-views.md) — Read-only big-screen views of a live match, meant for tab-casting to a TV in the room: one route each for classic matches, conquest, and **Risk 42**. The scorer
- [Page Templates](pages/TEMPLATES.md) — Reference templates for Concept, Entity, and Artifact pages. Follow these when using wiki_note_page.

### Decisions

- [Adopt Vitest + Playwright test stack with real-DB E2E](decisions/adopt-vitest-playwright-real-db-e2e.md) — Context
- [World map → dartboard mapping via azimuthal projection + Hungarian assignment (bull = Black Sea)](decisions/board-mapping-azimuthal-hungarian.md) — Azimuthal + Hungarian fit replaces the hand-drawn world-map draft; bull = Black Sea, inner = Old World core, outer = frontier
- [Bull Altar resurrection replaces insurgents; Siege map B locked](decisions/bull-altar-resurrection-replaces-siege-lock.md) — Context
- [Cap match rosters at 6 players, enforced client and server](decisions/cap-match-rosters-at-6-players.md) — Context
- [Cards around the board for all roster sizes (condensed panels for 3–6)](decisions/cards-around-the-board.md) — Decision
- [Claim-based territory ownership replaces the damage-flip model in Risk darts](decisions/claim-based-territory-ownership.md) — Context
- [Commentary becomes a 4-segment broadcast with Leo & Theodore swapping roles](decisions/commentary-becomes-a-4-segment-broadcast-with-leo-theodore-s.md) — Context
- [Commentary gated on open 2nd screen + pause button; all match types; every-N-turns cadence](decisions/commentary-gated-on-2nd-screen.md) — Context
- [Conquest state persists server-side: write-through per dart, own table + uuid](decisions/conquest-state-server-persisted.md) — Context
- [Dual-layout live match view: standings strip for 3+ players](decisions/dual-layout-match-view.md) — Context
- [Heat momentum as the core balancing mechanic for the Risk-style conquest darts mode](decisions/heat-momentum-core-balancing-mechanic.md) — Context
- [Interview questions: per-player 1–2 curated options, randomly surfaced](decisions/interview-questions-per-player-curated.md) — Interview questions: per-player 1–2 curated options, randomly surfaced
- [Interviews on ElevenLabs live TTS: fixed commentator voice, random Dutch spectators](decisions/interviews-elevenlabs-live-tts.md) — Context
- [Last Stand amendment: blank-first resurrection, next-player robbery, defender bull save](decisions/last-stand-amendment-blank-first-resurrection.md) — Context
- [Preset ladder re-banded to 51–1501 in steps of 50 (301 default)](decisions/preset-ladder-51-1501-steps-of-50.md) — Decision
- [Real Risk world map on the board — 40 territories via inner/outer boxes, Japan & Madagascar cut](decisions/real-risk-world-map-draft.md) — Context
- [Recap videos via HyperFrames for day-after match reminders](decisions/recap-videos-via-hyperframes.md) — Context
- [Remember-me: session-only login shadows remembered login](decisions/remember-me-session-only-login.md) — Context
- [Risk 42 applyDart seam: DartHit carries singleRing for singles](decisions/risk-42-applydart-seam-darthit-carries-singlering-for-single.md) — Context
- [Risk 42 attack rule locked: mirror damage — deposit down on enemy land, reduce-to-zero capture](decisions/risk-42-attack-rule-mirror-damage.md) — Context
- [Risk 42 base mechanic: two-feeder army deposits (any-dart claims, treble feeds inner +2, double feeds outer +2)](decisions/risk-42-base-mechanic-two-feeder-deposits.md) — Risk 42 base mechanic locked as two-feeder army deposits — any dart claims a blank, own-land dart +1, treble feeds inner box +2, double feeds outer box +2; attack rule (Q3) open.
- [Risk 42 bulls: the Arsenal charge (25 = +1, 50 = +2)](decisions/risk-42-bulls-the-arsenal-charge-25-1-50-2.md) — Context
- [Risk 42 continent income: +1 dart per full continent (Asia +2); budget shown pre-turn](decisions/risk-42-continent-income.md) — Context
- [Risk 42 deal amended: exactly equal deal, 2 armies each, blank leftovers claimable, players pick starter](decisions/risk-42-deal-final-equal-2-armies-blanks.md) — Context
- [Risk 42 endgame: Domination as headline, 170/301/501 clock as alt — mirroring T&T](decisions/risk-42-domination-headline-clock-alt.md) — Context
- [Risk 42 elimination: exile & clawback — zero boxes ≠ death](decisions/risk-42-exile-and-clawback.md) — Context
- [Risk 42 game start: random deal of all 40 territories (1 army each), no claiming phase](decisions/risk-42-game-start-random-deal.md) — Context
- [Risk 42 server persistence rides conquest_games + /api/conquest — sessionStorage stopgap superseded](decisions/risk-42-server-persistence-rides-conquest-games-api-conquest.md) — Context
- [Risk 42 two-screen identity: dartboard to play, world map to spectate](decisions/risk-42-two-screen-identity-dartboard-to-play-world-map-to-s.md) — Context
- [Risk 42 v1 persists to sessionStorage (stopgap) — server write-through lands at M3](decisions/risk-42-v1-persists-to-sessionstorage-stopgap-server-write-t.md) — Context
- [Risk 42 wears the classic Risk continent palette everywhere](decisions/risk-42-wears-the-classic-risk-continent-palette-everywhere.md) — Context
- [Risk-territory darts over heat economies](decisions/risk-territory-darts-over-heat-economies.md) — Context
- [Shanghai feat grants +1 dart the next turn](decisions/shanghai-feat-grants-1-dart-the-next-turn.md) — Context
- [Territory labels go horizontal: centered in each box, no rotation](decisions/territory-labels-go-horizontal-centered-in-each.md) — Context
- [Timed War clock measured in turns per player, branded 170/301/501 (default 301)](decisions/timed-war-clock-in-turns-per-player.md) — Context
- [Timed War default endgame, fixed continents, no elimination for Risk darts](decisions/timed-war-default-endgame-fixed-continents.md) — Context
- [Treble-frontier founding: blank territories require a treble to claim](decisions/treble-frontier-founding-requires-treble.md) — Context
- [Trebles & Territories board palette locked (Coolors 10-color band)](decisions/trebles-territories-board-palette-coolors.md) — Decision
- [TV cast pages render on a fixed 1920×1080 TvStage canvas, scaled to fit — no viewport breakpoints](decisions/tv-cast-pages-render-on-a-fixed-1920-1080-tvstage-canvas-sca.md) — Context
- [TV spectator mode: URL + tab-cast, 1s polling, public-by-link, room-first](decisions/tv-mode-url-tab-cast-polling.md) — Context
- [TvStage fills the viewport (independent x/y scale) — letterboxing dropped](decisions/tvstage-fills-the-viewport-independent-x-y-scale-letterboxin.md) — Context

### Rules

- [Board SVGs are generated — edit the regenerator, never the output](rules/board-svgs-are-generated.md) — Guideline
- [Engine invariant sweeps: plain asserts, assert theorems not emergence, validate against contract sets](rules/engine-invariant-sweeps-plain-asserts-assert-theorems-not-em.md) — The guideline
- [All code/logic todos must use the TDD skill (red→green→refactor)](rules/logic-todos-must-use-tdd-skill.md) — The rule
- [Never hardcode player slots in match UI](rules/never-hardcode-player-slots-in-match-ui.md) — Guideline
- [New game modes follow the conquest cut: pure setup module + Fun-tab card + own route/board](rules/new-game-modes-follow-the-conquest-cut-pure-setup-module-fun.md) — The rule
- [Ask clarifying questions one at a time — user preference](rules/one-question-at-a-time.md) — The rule
- [Use $app/stores $page for page state — house style](rules/use-app-stores-page-for-page-state-house-style.md) — Rule
- [Use the Tooltip component, not native title attributes](rules/use-tooltip-not-native-title.md) — Guideline
- [Worktree feature loop: PR-only master, worktrees in E:/worktrees/, user merges](rules/worktree-feature-loop.md) — House workflow for all feature work — PR-only master, worktrees under E:/worktrees/ (locked while active), provably-lossless cleanup only, and the user is the only one who merges.

### Learnings

- [Commentary LLM = DeepSeek deepseek-v4-flash (from glm-5.3-flash); ~1s LLM latency](learnings/commentary-llm-deepseek-deepseek-v4-flash-from-glm-5-3-flash.md) — 2026-09-09 evening: commentary LLM switched from OpenCode Zen Go (glm-5.3-flash, ~20-50s latency, needed x-opencode-session header) to **DeepSeek** (`https://ap
- [Commentary pipeline: ~25s real cost vs 20s timeout — raise/parallelize](learnings/commentary-pipeline-25s-real-cost-vs-20s-timeout-raise-paral.md) — Measured while playtesting all game modes on 2026-09-09: the 4-segment commentary pipeline (glm-5.3-flash LLM call + 4 sequential ElevenLabs TTS synthesizes) ta
- [Trebles & Territories build was untracked in the working tree — now landed on feature/trebles-territories (PR #2)](learnings/conquest-build-untracked-in-working-tree.md) — RESOLVED 2026-09-08: the conquest build that survived the git rollback as untracked files is now committed on feature/trebles-territories and pushed as PR #2 (master still empty until merge)
- [Conquest state is client-side only — nothing for a 2nd screen to poll](learnings/conquest-state-client-side-only.md) — The fact
- [Copy .env into a fresh worktree BEFORE starting the dev server — Vite loads it at startup only](learnings/copy-env-into-a-fresh-worktree-before-starting-the-dev-serve.md) — Symptom
- [Dartboard SVG paths encode box identity — read (number, ring) from geometry, don't hand-map](learnings/dartboard-svg-paths-encode-box-identity-read.md) — The fact
- [darts_email localStorage key stores the email raw, not JSON](learnings/darts-email-localstorage-stores-raw-email.md) — The `darts_email` localStorage key stores the email as a **raw string** — `getEmail`/`setEmail` do not JSON-encode it. This differs from the accounts key, which
- [db:push ignores the darts schema — migrations are file-as-record, applied directly](learnings/db-push-ignores-darts-schema.md) — `drizzle-kit push` (npm `db:push`) only manages the **`public`** schema — it silently ignores the `darts` schema, so a push can "succeed" while the table never 
- [EmailGate remember-me already ships — email persists, gate skips, saved accounts exist](learnings/emailgate-remember-me-already-ships.md) — A feature request to "remember the email on the EmailGate" (2026-09, worktree `kees-remember-me`) turned out to be **already shipped in master** — recon before
- [Engine test helpers must adapt to live dart budgets — income mechanics break fixed throw counts](learnings/engine-test-helpers-must-adapt-to-live-dart-budgets-income-m.md) — Engine test helpers must adapt to live dart budgets — income mechanics break fixed throw counts
- [$env/dynamic/private doesn't resolve in vitest — split the pure logic into its own module](learnings/env-dynamic-private-vitest-split.md) — Vitest can't resolve `$env/dynamic/private` — importing it in a module under test fails at import time.
- [Flipped labels: negate radial offset on left half](learnings/flipped-labels-negate-radial-offset-on-left-half.md) — Gotcha
- [Fresh SvelteKit worktree needs `svelte-kit sync` before tests run](learnings/fresh-sveltekit-worktree-needs-svelte-kit-sync-before-tests-.md) — Gotcha from the Risk 42 M1 build (2026-09-09): a freshly created SvelteKit worktree (deps junctioned from the main checkout) is **missing the generated `.svelte
- [Game-engine tests: filler darts must be misses, and fixtures obey the rules they enforce](learnings/game-engine-tests-filler-darts-must-be-misses-and-fixtures-o.md) — Caught red-handed twice during the Risk 42 M1 TDD cycles (2026-09-09), both produced false reds (and one false green that slipped into a commit and had to be am
- [GoDaddy apex domain on Railway: A record to live edge IP, not the documented one](learnings/godaddy-apex-domain-a-record-to-edge-ip.md) — The pattern (snooze.monster / dart.monster, Sep 2026)
- [GoDaddy DNS can't serve a Railway apex domain](learnings/godaddy-dns-can-t-serve-a-railway-apex-domain.md) — The gotcha
- [Junctioned node_modules needs Vite server.fs.allow — client entry 403s otherwise](learnings/junctioned-node-modules-needs-vite-server-fs-allow-client-en.md) — The fact
- [Large browser evaluate returns spill to disk wrapped in [UNTRUSTED_PAGE_CONTENT] markers](learnings/large-browser-evaluate-returns-spill-to-disk.md) — When extracting a large payload (e.g. a 32KB serialized SVG) from a page via the browser, an `evaluate` whose return exceeds the inline threshold spills to a di
- [Match API is unauthenticated — the share link is the key](learnings/match-api-unauthenticated.md) — The fact
- [Merged PR doesn't empty the branch](learnings/merged-pr-doesn-t-empty-the-branch.md) — Master's head can be a "Merge pull request #N" commit for a branch while **later commits pushed to that branch are still unmerged**. PR status or merge commits 
- [Merged-PR leftovers in the main tree block the pull — verify identical, then discard](learnings/merged-pr-leftovers-in-the-main-tree-block-the-pull-verify-i.md) — Merged-PR leftovers in the main tree block the post-cleanup pull
- [Miss turns must persist with dartsThrown ≥ 1](learnings/miss-turns-must-persist-with-dartsthrown-1.md) — The turns table / API has a constraint that `dartsThrown >= 1`. A miss (all three darts off the board) is still a turn and must be persisted with `dartsThrown`
- [Neo ref-clicks silently no-op on some SvelteKit buttons — use evaluate el.click()](learnings/neo-ref-clicks-silently-no-op-on-some-sveltekit-buttons-use-.md) — During the 2026-09-09 playtest sessions, driving the real app through BrowserOS neo's CDP-based `input().click(ref)` **failed silently** on several SvelteKit bu
- [Don't name a top-level Svelte 5 variable `state` — svelte2tsx collision](learnings/no-top-level-state-var-svelte2tsx.md) — Naming a top-level Svelte 5 component variable `state` trips a svelte2tsx collision (the compiler's own `state` concept) and fails `svelte-check`. The conquest
- [OpenCode zen/go LLM endpoint needs x-opencode-session header + custom User-Agent](learnings/opencode-zen-go-needs-session-header.md) — The OpenCode Zen Go chat-completions endpoint (`https://opencode.ai/zen/go/v1/chat/completions`) rejects plain requests — it requires BOTH:
- [Patching board SVGs: replace existing attributes, never append duplicates](learnings/patching-board-svgs-replace-existing-attributes.md) — Gotcha
- [Plain `let` assigned in async onMount never re-renders — must be $state](learnings/plain-let-assigned-in-async-onmount-never-re-renders-must-be.md) — The gotcha
- [Playwright reuses orphaned dev servers — E2E can silently test master code, not your worktree](learnings/playwright-reuses-orphaned-dev-servers-e2e-can-silently-test.md) — The fact
- [Refresh-resume depends on chronological turn order and persisted firstThrowerId](learnings/refresh-resume-needs-chronological-turn-order.md) — Refreshing the browser mid-leg (resume logic in `src/routes/match/[id]/+page.svelte`) silently depends on two implicit contracts. Breaking either reproduces the
- [Risk board SVGs: path attribute order varies — extract element-wise, not by regex lookahead](learnings/risk-board-svg-attribute-order.md) — Gotcha
- [Risk map SVG layers share a translate(-168,-119) — apply it when extracting paths or labels misalign](learnings/risk-map-svg-layers-share-a-translate-168-119-apply-it-when-.md) — While building the Risk 42 TV world map (2026-09-09): `docs/risk/risk-territory-board.svg` puts ALL its content layers (countries, labels, tints) inside groups 
- ["Risk" name collision: new game exploration (Sep 2026) is distinct from the Risk-darts proposal that became Trebles & Territories](learnings/risk-name-collision-new-game-exploration.md) — The name **"Risk"** is ambiguous in this project. It historically refers to the rolled-back **Risk-darts proposal** (documented at [[risk-darts-proposed-game-mo
- [risk-territory-board.svg palette: fills live in layer2, join to territories by centroid containment](learnings/risk-territory-board-svg-palette-fills-live-in-layer2-join-t.md) — The world map for the Risk 42 TV view (`docs/risk/risk-territory-board.svg`, a copy of `risk-board.svg`) carries its **per-territory tints in the `layer2` fill
- [scrollbar-gutter: stable reserves 15px that window.innerWidth counts — measure the host box](learnings/scrollbar-gutter-stable-reserves-15px-that-window-innerwidth.md) — The gotcha
- [Session-only logins are absent from the saved-accounts list — don't gate account switching on it](learnings/session-only-logins-not-in-accounts-list.md) — Gotcha
- [Squash-merged branch: commit-ahead ≠ unmerged — prove with git cherry](learnings/squash-merged-branch-commit-ahead-unmerged-prove-with-git-ch.md) — Squash-merged branch: commit-ahead ≠ unmerged
- [SSR pages are empty shells — EmailGate gates all rendering client-side](learnings/ssr-pages-are-empty-shells-emailgate.md) — Gotcha
- [structuredClone can't clone Svelte 5 $state proxies — pass $state.snapshot() at the engine boundary](learnings/structuredclone-can-t-clone-svelte-5-state.md) — Gotcha
- [SVG path parsing: arc arguments are not points — tokenize by command, never by coordinate-pair regex](learnings/svg-path-parsing-arc-arguments-are-not-points.md) — Gotcha
- [Sync infinite loop in a test helper hangs vitest with no timeout](learnings/sync-infinite-loop-in-a-test-helper-hangs-vitest-with-no-tim.md) — The symptom
- [Tooltips must use fixed positioning to escape overflow clipping](learnings/tooltips-must-use-fixed-positioning.md) — Gotcha
- [Top-level return in a CJS script skips the file write — silent no-op](learnings/top-level-return-in-a-cjs-script-skips-the-file.md) — Gotcha
- [TS can't narrow $state inside closures — use $derived.by with local capture](learnings/ts-can-t-narrow-state-in-closures.md) — Gotcha
- [TV cast pages freeze in background tabs — document.hidden pauses polling and commentary](learnings/tv-cast-pages-freeze-in-background-tabs-document-hidden-paus.md) — All three TV cast routes — `src/routes/match/[id]/tv/+page.svelte` (classic), `src/routes/match/conquest/[id]/tv/+page.svelte` (T&T), `src/routes/match/risk/[id
- [Vitest can't see type holes — esbuild strips types; svelte-check is the only net](learnings/vitest-can-t-see-type-holes-esbuild-strips-types-svelte-chec.md) — The gotcha
- [Vitest/Playwright suite is uncommitted — master branches have no test runner](learnings/vitest-suite-uncommitted-master-has-no-test-runner.md) — UPDATE 2026-09-08: the suite is committed on feature/trebles-territories (PR #2, 112 unit tests) — master branches still have no test runner until the PR merges
- [Only webSpeech TTS speaks Dutch — kokoro is English-only, ElevenLabs is pre-generated clips](learnings/webspeech-only-dutch-tts.md) — Only webSpeech TTS speaks Dutch
- [Wedge index from a seg path's M point needs a +9° half-wedge shift](learnings/wedge-index-from-a-seg-path-s-m-point-needs-a-9.md) — Gotcha
- [wiki_search misses recently-written concepts — verify with wiki_validate or ls before writing](learnings/wiki-search-misses-recent-concepts.md) — Discovered while recapping the Risk-darts rollback turn: `wiki_search("risk territory")` and `wiki_search("heat economies")` both returned **no results**, yet `
- [Bare [[slug]] wikilinks in wiki_note_page break cross-folder — use explicit relative paths](learnings/wikilinks-bare-slug-breaks-cross-folder.md) — The gotcha
- [Windows worktree deletion: kill the process holding the directory first](learnings/windows-worktree-delete-kill-holder-first.md) — Symptom

### Preferences

- [Ask design questions one-by-one, never batched](preferences/ask-design-questions-one-by-one-never-batched.md) — During grilling/interview sessions (and design Q&A generally), the user wants questions **one at a time**, not the grilling skill's default "ask the whole front
<!-- wiki-nav:end -->

An [OKF](https://github.com/earendil-works/okf) bundle documenting this project.

- [Overview](./overview.md) — What this project contains and its structure
- [File tree](./architecture/file-tree.md) — Complete project file listing
- [Glossary](./glossary.md) — Key terms for this project
- [Pages](./pages/) — Concepts, entities, and artifacts of this project
