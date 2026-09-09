---
okf_version: "0.1"
---

# Project Knowledge Wiki

<!-- wiki-nav:start -->
## Navigation map

Auto-generated detailed index of every docs/wiki/ concept — the map the LLM uses to locate information. 96 concept(s). Regenerated on init and on wiki_mark_synced. Generated 2026-09-09T06:58:23.375Z.

Each entry: `concept-id` (pass to wiki_get) — title — description.

### Core concepts

- `glossary` — Glossary — Key terms for this project.
- `overview` — Overview — What this project contains and its structure.

### Architecture

- `architecture/file-tree` — File tree — Complete project file listing with per-file descriptions.

### Pages

- `pages/artifacts/board-preview-and-fit-map` — Board preview & fit-map (docs/risk/fit-map.cjs + board-preview.html) — The generator + eyeball artifact for the [world map → dartboard territory mapping|world map → dartboard territory mapping]] in [[risk-dart
- `pages/artifacts/dart-board-for-map-svg-risk-mapped-dartboard` — dart-board-for-map.svg (Risk-mapped dartboard) — The pristine production dartboard SVG (`docs/risk/dart-board-orig.svg`, a copy of the board extracted from `Dartboard.svelte`) patched with the Risk → dartboard
- `pages/artifacts/dart-board-svg-extracted-production-dartboard` — dart-board.svg (extracted production dartboard) — A clean, static SVG of the standard dartboard extracted directly from the live scorer's rendered `Dartboard.svelte` output on a production match page (https://w
- `pages/artifacts/dartboardingame-svg-id-addressable-in-game-board` — DartBoardInGame.svg (id-addressable in-game board) — A wedge-by-wedge export of the production dartboard geometry (`Dartboard.svelte`), rebuilt with self-explanatory, collision-free element ids — the board the Ris
- `pages/artifacts/docs-risk-assets-risk-board-svgs-notes` — docs/risk/ assets (Risk board SVGs + notes) — Reference assets for the Risk-style conquest mode ([[risk-darts-proposed-game-mode]] / Trebles & Territories): two classic Risk board SVGs (`Risk_board.svg` ~50
- `pages/artifacts/risk-42-territory-mapping-mapping-json` — Risk 42 territory mapping (mapping.json) — Canonical machine-readable game data for [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md): every one of the 40 numbered boxes mapped to `
- `pages/artifacts/risk-dart-board-mockup-risk-dart-board-svg` — Risk dart board mockup (risk-dart-board.svg) — The canonical labeled design board for the Risk-on-a-dartboard redesign: the id-addressable in-game board cloned with all 40 territory names — full names,
- `pages/artifacts/test-suite` — Test suite — The automated test layer for dart.monster: 112 Vitest unit tests over the pure game modules, plus 14 Playwright E2E tests (API lifecycle + real-browser UI) that
- `pages/artifacts/trebles-and-territories-player-manual` — Trebles and Territories player manual — Player-facing rules-only HTML manual distilling the Trebles and Territories implementation spec into 7 short Dutch sections.
- `pages/artifacts/trebles-territories-implementation-spec` — Trebles & Territories implementation spec — The implementation spec for **Trebles and Territories** — the self-contained HTML design document (built with the html-docs skill) that drives the build. Contai
- `pages/concepts/risk-42-proposed-game-mode` — Risk 42 (proposed game mode) — Risk 42 (proposed game mode)
- `pages/concepts/risk-darts-proposed-game-mode` — Risk Darts (proposed game mode) — What is it?
- `pages/entities/conquest-engine-and-live-game` — Conquest engine (conquest-engine.ts + live conquest game) — The playable implementation of [[risk-darts-proposed-game-mode]] (Trebles & Territories): a pure, TDD'd game engine plus the board component and live game route
- `pages/entities/conquest-setup-fun-tab-conquest-setup-ts` — Conquest setup (Fun tab + conquest-setup.ts) — The first shipped code for [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) (Trebles and Territories): the **Fun tab** on the match setup page plus the pure setup-logic module
- `pages/entities/dart-monster-dns-railway-domain-setup` — dart.monster DNS & Railway domain setup — Concrete infrastructure: how `dart.monster` (this project, also deployed as darts.xyz) is wired to its Railway service, as of 2026-09-07.
- `pages/entities/e2e-helpers` — E2E helpers — `e2e/helpers.ts` — the shared seeding/util module every Playwright spec imports. It owns the account-isolation and persistence gotchas so each spec doesn't redi
- `pages/entities/email-store-email-ts` — Email store (email.ts) — `src/lib/stores/email.ts` — the single source of truth for the signed-in player identity. All routes read through it (no route reads `darts_email` directly); th
- `pages/entities/live-match-page` — Live Match Page — What is it?
- `pages/entities/llm-commentary-trebles-territories` — LLM Commentary (Trebles & Territories) — The in-game AI commentary feed for [[risk-darts-proposed-game-mode|Trebles & Territories]]: an LLM writes a commentary blurb **every 2 turns**, rendered in a de
- `pages/entities/match-stats-tab` — Match Stats Tab — All-players statistics table in the live match UI, plus the leg/match average displays shipped with it.
- `pages/entities/playerpanel` — PlayerPanel — A reusable scoreboard panel component for the live match scorer, rendered around the board for every roster size (full-size for 1–2 players, condensed cards for 3–6).
- `pages/entities/recap-video-pipeline-trebles-territories` — Recap Video Pipeline (Trebles & Territories) — The planned Morning-After recap feature for Trebles & Territories: the day after a game, each match gets an LLM-generated recap video, and players who stored an email address receive a link to it.
- `pages/entities/spectator-interviews-trebles-territories` — Spectator Interviews (Trebles & Territories) — The planned mid-game **spectator interview** feature: an LLM generates a short interview — a commentator asks a question, a random spectator persona answers — i
- `pages/entities/tv-second-screen-cast-views` — TV second screen (cast views) — Read-only big-screen views of a live match, meant for tab-casting to a TV in the room: one route for classic matches, one for conquest. The scorer pages carry c
- `pages/TEMPLATES` — Page Templates — Reference templates for Concept, Entity, and Artifact pages. Follow these when using wiki_note_page.

### Decisions

- `decisions/adopt-vitest-playwright-real-db-e2e` — Adopt Vitest + Playwright test stack with real-DB E2E — Context
- `decisions/board-mapping-azimuthal-hungarian` — World map → dartboard mapping via azimuthal projection + Hungarian assignment (bull = Black Sea) — Azimuthal + Hungarian fit replaces the hand-drawn world-map draft; bull = Black Sea, inner = Old World core, outer = frontier
- `decisions/bull-altar-resurrection-replaces-siege-lock` — Bull Altar resurrection replaces insurgents; Siege map B locked — Context
- `decisions/cap-match-rosters-at-6-players` — Cap match rosters at 6 players, enforced client and server — Context
- `decisions/cards-around-the-board` — Cards around the board for all roster sizes (condensed panels for 3–6) — Decision
- `decisions/claim-based-territory-ownership` — Claim-based territory ownership replaces the damage-flip model in Risk darts — Context
- `decisions/commentary-gated-on-2nd-screen` — Commentary gated on open 2nd screen + pause button; all match types; every-N-turns cadence — Context
- `decisions/conquest-state-server-persisted` — Conquest state persists server-side: write-through per dart, own table + uuid — Context
- `decisions/dual-layout-match-view` — Dual-layout live match view: standings strip for 3+ players — Context
- `decisions/heat-momentum-core-balancing-mechanic` — Heat momentum as the core balancing mechanic for the Risk-style conquest darts mode — Context
- `decisions/interview-questions-per-player-curated` — Interview questions: per-player 1–2 curated options, randomly surfaced — Interview questions: per-player 1–2 curated options, randomly surfaced
- `decisions/interviews-elevenlabs-live-tts` — Interviews on ElevenLabs live TTS: fixed commentator voice, random Dutch spectators — Context
- `decisions/last-stand-amendment-blank-first-resurrection` — Last Stand amendment: blank-first resurrection, next-player robbery, defender bull save — Context
- `decisions/preset-ladder-51-1501-steps-of-50` — Preset ladder re-banded to 51–1501 in steps of 50 (301 default) — Decision
- `decisions/real-risk-world-map-draft` — Real Risk world map on the board — 40 territories via inner/outer boxes, Japan & Madagascar cut — Context
- `decisions/recap-videos-via-hyperframes` — Recap videos via HyperFrames for day-after match reminders — Context
- `decisions/remember-me-session-only-login` — Remember-me: session-only login shadows remembered login — Context
- `decisions/risk-42-attack-rule-mirror-damage` — Risk 42 attack rule locked: mirror damage — deposit down on enemy land, reduce-to-zero capture — Context
- `decisions/risk-42-base-mechanic-two-feeder-deposits` — Risk 42 base mechanic: two-feeder army deposits (any-dart claims, treble feeds inner +2, double feeds outer +2) — Risk 42 base mechanic locked as two-feeder army deposits — any dart claims a blank, own-land dart +1, treble feeds inner box +2, double feeds outer box +2; attack rule (Q3) open.
- `decisions/risk-territory-darts-over-heat-economies` — Risk-territory darts over heat economies — Context
- `decisions/shanghai-feat-grants-1-dart-the-next-turn` — Shanghai feat grants +1 dart the next turn — Context
- `decisions/territory-labels-go-horizontal-centered-in-each` — Territory labels go horizontal: centered in each box, no rotation — Context
- `decisions/timed-war-clock-in-turns-per-player` — Timed War clock measured in turns per player, branded 170/301/501 (default 301) — Context
- `decisions/timed-war-default-endgame-fixed-continents` — Timed War default endgame, fixed continents, no elimination for Risk darts — Context
- `decisions/treble-frontier-founding-requires-treble` — Treble-frontier founding: blank territories require a treble to claim — Context
- `decisions/trebles-territories-board-palette-coolors` — Trebles & Territories board palette locked (Coolors 10-color band) — Decision
- `decisions/tv-mode-url-tab-cast-polling` — TV spectator mode: URL + tab-cast, 1s polling, public-by-link, room-first — Context

### Rules

- `rules/board-svgs-are-generated` — Board SVGs are generated — edit the regenerator, never the output — Guideline
- `rules/logic-todos-must-use-tdd-skill` — All code/logic todos must use the TDD skill (red→green→refactor) — The rule
- `rules/never-hardcode-player-slots-in-match-ui` — Never hardcode player slots in match UI — Guideline
- `rules/one-question-at-a-time` — Ask clarifying questions one at a time — user preference — The rule
- `rules/use-app-stores-page-for-page-state-house-style` — Use $app/stores $page for page state — house style — Rule
- `rules/use-tooltip-not-native-title` — Use the Tooltip component, not native title attributes — Guideline
- `rules/worktree-feature-loop` — Worktree feature loop: PR-only master, worktrees in E:/worktrees/, user merges — House workflow for all feature work — PR-only master, worktrees under E:/worktrees/ (locked while active), provably-lossless cleanup only, and the user is the only one who merges.

### Learnings

- `learnings/conquest-build-untracked-in-working-tree` — Trebles & Territories build was untracked in the working tree — now landed on feature/trebles-territories (PR #2) — RESOLVED 2026-09-08: the conquest build that survived the git rollback as untracked files is now committed on feature/trebles-territories and pushed as PR #2 (master still empty until merge)
- `learnings/conquest-state-client-side-only` — Conquest state is client-side only — nothing for a 2nd screen to poll — The fact
- `learnings/dartboard-svg-paths-encode-box-identity-read` — Dartboard SVG paths encode box identity — read (number, ring) from geometry, don't hand-map — The fact
- `learnings/darts-email-localstorage-stores-raw-email` — darts_email localStorage key stores the email raw, not JSON — The `darts_email` localStorage key stores the email as a **raw string** — `getEmail`/`setEmail` do not JSON-encode it. This differs from the accounts key, which
- `learnings/db-push-ignores-darts-schema` — db:push ignores the darts schema — migrations are file-as-record, applied directly — `drizzle-kit push` (npm `db:push`) only manages the **`public`** schema — it silently ignores the `darts` schema, so a push can "succeed" while the table never 
- `learnings/emailgate-remember-me-already-ships` — EmailGate remember-me already ships — email persists, gate skips, saved accounts exist — A feature request to "remember the email on the EmailGate" (2026-09, worktree `kees-remember-me`) turned out to be **already shipped in master** — recon before
- `learnings/env-dynamic-private-vitest-split` — $env/dynamic/private doesn't resolve in vitest — split the pure logic into its own module — Vitest can't resolve `$env/dynamic/private` — importing it in a module under test fails at import time.
- `learnings/flipped-labels-negate-radial-offset-on-left-half` — Flipped labels: negate radial offset on left half — Gotcha
- `learnings/godaddy-apex-domain-a-record-to-edge-ip` — GoDaddy apex domain on Railway: A record to live edge IP, not the documented one — The pattern (snooze.monster / dart.monster, Sep 2026)
- `learnings/godaddy-dns-can-t-serve-a-railway-apex-domain` — GoDaddy DNS can't serve a Railway apex domain — The gotcha
- `learnings/large-browser-evaluate-returns-spill-to-disk` — Large browser evaluate returns spill to disk wrapped in [UNTRUSTED_PAGE_CONTENT] markers — When extracting a large payload (e.g. a 32KB serialized SVG) from a page via the browser, an `evaluate` whose return exceeds the inline threshold spills to a di
- `learnings/match-api-unauthenticated` — Match API is unauthenticated — the share link is the key — The fact
- `learnings/merged-pr-doesn-t-empty-the-branch` — Merged PR doesn't empty the branch — Master's head can be a "Merge pull request #N" commit for a branch while **later commits pushed to that branch are still unmerged**. PR status or merge commits 
- `learnings/miss-turns-must-persist-with-dartsthrown-1` — Miss turns must persist with dartsThrown ≥ 1 — The turns table / API has a constraint that `dartsThrown >= 1`. A miss (all three darts off the board) is still a turn and must be persisted with `dartsThrown`
- `learnings/no-top-level-state-var-svelte2tsx` — Don't name a top-level Svelte 5 variable `state` — svelte2tsx collision — Naming a top-level Svelte 5 component variable `state` trips a svelte2tsx collision (the compiler's own `state` concept) and fails `svelte-check`. The conquest
- `learnings/opencode-zen-go-needs-session-header` — OpenCode zen/go LLM endpoint needs x-opencode-session header + custom User-Agent — The OpenCode Zen Go chat-completions endpoint (`https://opencode.ai/zen/go/v1/chat/completions`) rejects plain requests — it requires BOTH:
- `learnings/patching-board-svgs-replace-existing-attributes` — Patching board SVGs: replace existing attributes, never append duplicates — Gotcha
- `learnings/refresh-resume-needs-chronological-turn-order` — Refresh-resume depends on chronological turn order and persisted firstThrowerId — Refreshing the browser mid-leg (resume logic in `src/routes/match/[id]/+page.svelte`) silently depends on two implicit contracts. Breaking either reproduces the
- `learnings/risk-board-svg-attribute-order` — Risk board SVGs: path attribute order varies — extract element-wise, not by regex lookahead — Gotcha
- `learnings/risk-name-collision-new-game-exploration` — "Risk" name collision: new game exploration (Sep 2026) is distinct from the Risk-darts proposal that became Trebles & Territories — The name **"Risk"** is ambiguous in this project. It historically refers to the rolled-back **Risk-darts proposal** (documented at [[risk-darts-proposed-game-mo
- `learnings/session-only-logins-not-in-accounts-list` — Session-only logins are absent from the saved-accounts list — don't gate account switching on it — Gotcha
- `learnings/ssr-pages-are-empty-shells-emailgate` — SSR pages are empty shells — EmailGate gates all rendering client-side — Gotcha
- `learnings/structuredclone-can-t-clone-svelte-5-state` — structuredClone can't clone Svelte 5 $state proxies — pass $state.snapshot() at the engine boundary — Gotcha
- `learnings/svg-path-parsing-arc-arguments-are-not-points` — SVG path parsing: arc arguments are not points — tokenize by command, never by coordinate-pair regex — Gotcha
- `learnings/tooltips-must-use-fixed-positioning` — Tooltips must use fixed positioning to escape overflow clipping — Gotcha
- `learnings/top-level-return-in-a-cjs-script-skips-the-file` — Top-level return in a CJS script skips the file write — silent no-op — Gotcha
- `learnings/ts-can-t-narrow-state-in-closures` — TS can't narrow $state inside closures — use $derived.by with local capture — Gotcha
- `learnings/vitest-suite-uncommitted-master-has-no-test-runner` — Vitest/Playwright suite is uncommitted — master branches have no test runner — UPDATE 2026-09-08: the suite is committed on feature/trebles-territories (PR #2, 112 unit tests) — master branches still have no test runner until the PR merges
- `learnings/webspeech-only-dutch-tts` — Only webSpeech TTS speaks Dutch — kokoro is English-only, ElevenLabs is pre-generated clips — Only webSpeech TTS speaks Dutch
- `learnings/wedge-index-from-a-seg-path-s-m-point-needs-a-9` — Wedge index from a seg path's M point needs a +9° half-wedge shift — Gotcha
- `learnings/wiki-search-misses-recent-concepts` — wiki_search misses recently-written concepts — verify with wiki_validate or ls before writing — Discovered while recapping the Risk-darts rollback turn: `wiki_search("risk territory")` and `wiki_search("heat economies")` both returned **no results**, yet `
- `learnings/wikilinks-bare-slug-breaks-cross-folder` — Bare [[slug]] wikilinks in wiki_note_page break cross-folder — use explicit relative paths — The gotcha
- `learnings/windows-worktree-delete-kill-holder-first` — Windows worktree deletion: kill the process holding the directory first — Symptom

### Preferences

- `preferences/ask-design-questions-one-by-one-never-batched` — Ask design questions one-by-one, never batched — During grilling/interview sessions (and design Q&A generally), the user wants questions **one at a time**, not the grilling skill's default "ask the whole front
<!-- wiki-nav:end -->

An [OKF](https://github.com/earendil-works/okf) bundle documenting this project.

- [Overview](./overview.md) — What this project contains and its structure
- [File tree](./architecture/file-tree.md) — Complete project file listing
- [Glossary](./glossary.md) — Key terms for this project
- [Pages](./pages/) — Concepts, entities, and artifacts of this project
