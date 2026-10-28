---
okf_version: "0.1"
---

# Project Knowledge Wiki

<!-- wiki-nav:start -->
## Navigation map

Auto-generated detailed index of every docs/wiki/ concept — the map the LLM uses to locate information. 133 concept(s). Regenerated on init and on wiki_mark_synced. Generated 2026-10-28T18:45:15.946Z.

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
- [In-game session testing reports (docs/in-game-session-testing/)](pages/artifacts/in-game-session-testing-reports-docs-in-game.md) — Five full playtest session reports from 2026-09-09, played through the real UI (BrowserOS neo against the dev server, master `46a429e`) with the TV second scree
- [PR #17 three-axis code review](pages/artifacts/pr-17-three-axis-code-review.md) — PR #17 three-axis code review
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
- [Risk 42 end screens & Teruglezen drawer](pages/entities/risk-42-end-screens-teruglezen-drawer.md) — The game-over surfaces for [Risk 42](../concepts/risk-42-proposed-game-mode.md), shipped during the session-6 prod playtest (2026-09-10, commits `5e6dc11` + `bf
- [Risk 42 engine (risk-engine.ts)](pages/entities/risk-42-engine-risk-engine-ts.md) — The pure, TDD'd game engine implementing [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) — Risk 42 played on the standard dartboard wher
- [Risk 42 playable game (risk-setup + Fun tab + /match/risk + RiskBoard)](pages/entities/risk-42-playable-game-risk-setup-fun-tab-match.md) — The playable cut of [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md): the pure setup module, the Fun-tab format picker, and the live game
- [Spectator Interviews (Trebles & Territories)](pages/entities/spectator-interviews-trebles-territories.md) — Spectator Interviews (Trebles & Territories)
- [TV second screen (cast views)](pages/entities/tv-second-screen-cast-views.md) — Read-only big-screen views of a live match, meant for tab-casting to a TV in the room: one route each for classic matches, conquest, and **Risk 42**. The scorer
- [Page Templates](pages/TEMPLATES.md) — Reference templates for Concept, Entity, and Artifact pages. Follow these when using wiki_note_page.

### Decisions

- [World map → dartboard mapping via azimuthal projection + Hungarian assignment (bull = Black Sea)](decisions/board-mapping-azimuthal-hungarian.md) — Azimuthal + Hungarian fit replaces the hand-drawn world-map draft; bull = Black Sea, inner = Old World core, outer = frontier
- [Bull Altar resurrection replaces insurgents; Siege map B locked](decisions/bull-altar-resurrection-replaces-siege-lock.md) — Context
- [Cap match rosters at 6 players, enforced client and server](decisions/cap-match-rosters-at-6-players.md) — Context
- [Cards around the board for all roster sizes (condensed panels for 3–6)](decisions/cards-around-the-board.md) — Decision
- [Claim-based territory ownership replaces the damage-flip model in Risk darts](decisions/claim-based-territory-ownership.md) — Context
- [Commentary API degrades per-segment — TTS failure drops to subtitles, never a whole-request 502](decisions/commentary-api-degrades-per-segment-tts-failure.md) — Context
- [Commentary becomes a 4-segment broadcast with Leo & Theodore swapping roles](decisions/commentary-becomes-a-4-segment-broadcast.md) — Context
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
- [Risk 42 6-player legibility: hue-spread player palette, collision-free chips, podium scrim](decisions/risk-42-6-player-legibility.md) — Context
- [Risk 42 applyDart seam: DartHit carries singleRing for singles](decisions/risk-42-applydart-seam-darthit-singlering.md) — Context
- [Risk 42 Arsenal becomes a bankable dart economy: bull 25 = +2 darts, bullseye 50 = +3, savable](decisions/risk-42-arsenal-bankable-dart-economy.md) — Context
- [Risk 42 attack rule locked: mirror damage — deposit down on enemy land, reduce-to-zero capture](decisions/risk-42-attack-rule-mirror-damage.md) — Context
- [Risk 42 base mechanic: two-feeder army deposits (any-dart claims, treble feeds inner +2, double feeds outer +2)](decisions/risk-42-base-mechanic-two-feeder-deposits.md) — Risk 42 base mechanic locked as two-feeder army deposits — any dart claims a blank, own-land dart +1, treble feeds inner box +2, double feeds outer box +2; attack rule (Q3) open.
- [Risk 42 bulls: the Arsenal charge (25 = +1, 50 = +2)](decisions/risk-42-bulls-the-arsenal-charge-25-1-50-2.md) — Context
- [Risk 42 card hoarding is unlimited — no mandatory cash-in at 5+ cards](decisions/risk-42-card-hoarding-unlimited.md) — Context
- [Risk 42 continent income: +1 dart per full continent (Asia +2); budget shown pre-turn](decisions/risk-42-continent-income.md) — Context
- [Risk 42 deal amended: exactly equal deal, 2 armies each, blank leftovers claimable, players pick starter](decisions/risk-42-deal-final-equal-2-armies-blanks.md) — Context
- [Risk 42 endgame: Domination as headline, 170/301/501 clock as alt — mirroring T&T](decisions/risk-42-domination-headline-clock-alt.md) — Context
- [Risk 42 elimination: exile & clawback — zero boxes ≠ death](decisions/risk-42-exile-and-clawback.md) — Context
- [Risk 42 game start: random deal of all 40 territories (1 army each), no claiming phase](decisions/risk-42-game-start-random-deal.md) — Context
- [Risk 42 income rework proposed: continent bonus out, max(3, territories/6) darts per turn](decisions/risk-42-income-rework-continent-bonus-out.md) — Context
- [Risk 42 reach rule: darts only count on own or adjacent territories](decisions/risk-42-reach-rule-own-or-adjacent.md) — Context
- [Risk 42 server persistence rides conquest_games + /api/conquest — sessionStorage stopgap superseded](decisions/risk-42-server-persistence-rides-conquest-api.md) — Context
- [Risk 42 territory cards: conquest earns a card, sets cash in for dart bursts with escalation](decisions/risk-42-territory-cards-conquest-earns-card.md) — Context
- [Risk 42 TV: full-bleed map with overlay panels pinned to measured-empty margins](decisions/risk-42-tv-full-bleed-map-with-overlay-panels.md) — Context
- [Risk 42 two-screen identity: dartboard to play, world map to spectate](decisions/risk-42-two-screen-identity-dartboard-to-play.md) — Context
- [Risk 42 v1 persists to sessionStorage (stopgap) — server write-through lands at M3](decisions/risk-42-v1-persists-to-sessionstorage-stopgap.md) — Context
- [Risk 42 wears the classic Risk continent palette everywhere](decisions/risk-42-wears-the-classic-risk-continent-palette.md) — Context
- [Risk-territory darts over heat economies](decisions/risk-territory-darts-over-heat-economies.md) — Context
- [Shanghai feat grants +1 dart the next turn](decisions/shanghai-feat-grants-1-dart-the-next-turn.md) — Context
- [Territory labels go horizontal: centered in each box, no rotation](decisions/territory-labels-go-horizontal-centered-in-each.md) — Context
- [Timed War clock measured in turns per player, branded 170/301/501 (default 301)](decisions/timed-war-clock-in-turns-per-player.md) — Context
- [Timed War default endgame, fixed continents, no elimination for Risk darts](decisions/timed-war-default-endgame-fixed-continents.md) — Context
- [Treble-frontier founding: blank territories require a treble to claim](decisions/treble-frontier-founding-requires-treble.md) — Context
- [Trebles & Territories board palette locked (Coolors 10-color band)](decisions/trebles-territories-board-palette-coolors.md) — Decision
- [TV cast pages render on a fixed 1920×1080 TvStage canvas, scaled to fit — no viewport breakpoints](decisions/tv-cast-pages-render-on-a-fixed-1920-1080-tvstage.md) — Context
- [TV spectator mode: URL + tab-cast, 1s polling, public-by-link, room-first](decisions/tv-mode-url-tab-cast-polling.md) — Context
- [TvStage fills the viewport (independent x/y scale) — letterboxing dropped](decisions/tvstage-fills-the-viewport-independent-x-y-scale.md) — Context

### Rules

- [Board SVGs are generated — edit the regenerator, never the output](rules/board-svgs-are-generated.md) — Guideline
- [Derive stats from state deltas, never by substring-matching log copy](rules/derive-stats-from-state-deltas-never-by-substring.md) — **Guideline:** Never derive a gameplay stat by scanning or substring-matching human-readable log lines. Count from state deltas (or engine return values) instea
- [Never hardcode player slots in match UI](rules/never-hardcode-player-slots-in-match-ui.md) — Guideline
- [New game modes follow the conquest cut: pure setup module + Fun-tab card + own route/board](rules/new-game-modes-follow-the-conquest-cut-pure-setup.md) — The rule
- [Use $app/stores $page for page state — house style](rules/use-app-stores-page-for-page-state-house-style.md) — Rule
- [Use the Tooltip component, not native title attributes](rules/use-tooltip-not-native-title.md) — Guideline

### Learnings

- [Abandon match is instant with no confirmation](learnings/abandon-match-is-instant-with-no-confirmation.md) — **Found during the 2026-10-28 four-game test sweep** (Game 2, 3-player 301).
- [Bank folded in at handover loses provenance — carry it on the object (turn.carried)](learnings/bank-folded-in-at-handover-loses-provenance-carry.md) — **The gotcha:** in Risk 42 the engine adds the player's saved-dart bank to the next turn's budget *at handover* — so by the time the UI renders the pre-turn gat
- [Commentary LLM = DeepSeek deepseek-v4-flash (from glm-5.3-flash); ~1s LLM latency](learnings/commentary-llm-deepseek-v4-flash.md) — 2026-09-09 evening: commentary LLM switched from OpenCode Zen Go (glm-5.3-flash, ~20-50s latency, needed x-opencode-session header) to **DeepSeek** (`https://ap
- [Commentary pipeline: ~25s real cost vs 20s timeout — raise/parallelize](learnings/commentary-pipeline-25s-real-cost-vs-20s-timeout.md) — Measured while playtesting all game modes on 2026-09-09: the 4-segment commentary pipeline (glm-5.3-flash LLM call + 4 sequential ElevenLabs TTS synthesizes) ta
- [Conquest state is client-side only — nothing for a 2nd screen to poll](learnings/conquest-state-client-side-only.md) — The fact
- [Dartboard SVG paths encode box identity — read (number, ring) from geometry, don't hand-map](learnings/dartboard-svg-paths-encode-box-identity-read.md) — The fact
- [darts_email localStorage key stores the email raw, not JSON](learnings/darts-email-localstorage-stores-raw-email.md) — The `darts_email` localStorage key stores the email as a **raw string** — `getEmail`/`setEmail` do not JSON-encode it. This differs from the accounts key, which
- [db:push ignores the darts schema — migrations are file-as-record, applied directly](learnings/db-push-ignores-darts-schema.md) — `drizzle-kit push` (npm `db:push`) only manages the **`public`** schema — it silently ignores the `darts` schema, so a push can "succeed" while the table never 
- [deleteLastTurn UI: shared confirm state + restore uses the wrong player's remaining score](learnings/deletelastturn-ui-shared-confirm-state-restore-uses-the-wron.md) — **Found during the 2026-10-28 neo-browser delete-turn test campaign**, verified live in both a 2-player and a 3-player match. The trash-icon delete on PlayerPan
- [Double-in is a dead toggle — saved and loaded, never enforced in scoring](learnings/double-in-is-a-dead-toggle-saved-and-loaded-never-enforced-i.md) — **Found during the 2026-10-28 four-game test sweep** (Game 3: 701 double-in, 2 players) — highest-severity finding of the sweep.
- [EmailGate remember-me already ships — email persists, gate skips, saved accounts exist](learnings/emailgate-remember-me-already-ships.md) — A feature request to "remember the email on the EmailGate" (2026-09, worktree `kees-remember-me`) turned out to be **already shipped in master** — recon before
- [$env/dynamic/private doesn't resolve in vitest — split the pure logic into its own module](learnings/env-dynamic-private-vitest-split.md) — Vitest can't resolve `$env/dynamic/private` — importing it in a module under test fails at import time.
- [Flipped labels: negate radial offset on left half](learnings/flipped-labels-negate-radial-offset-on-left-half.md) — Gotcha
- [GoDaddy apex domain on Railway: A record to live edge IP, not the documented one](learnings/godaddy-apex-domain-a-record-to-edge-ip.md) — The pattern (snooze.monster / dart.monster, Sep 2026)
- [GoDaddy DNS can't serve a Railway apex domain](learnings/godaddy-dns-can-t-serve-a-railway-apex-domain.md) — The gotcha
- [inputMode lives in per-origin localStorage — same repo on different ports shows different scorer state](learnings/inputmode-lives-in-per-origin-localstorage-same-repo-on-diff.md) — **The gotcha:** a user report of "the dartboard is broken on the same repo, other port" turned out to be **per-origin localStorage divergence**, not a code bug.
- [Match API is unauthenticated — the share link is the key](learnings/match-api-unauthenticated.md) — The fact
- [Miss turns must persist with dartsThrown ≥ 1](learnings/miss-turns-must-persist-with-dartsthrown-1.md) — The turns table / API has a constraint that `dartsThrown >= 1`. A miss (all three darts off the board) is still a turn and must be persisted with `dartsThrown`
- [Don't name a top-level Svelte 5 variable `state` — svelte2tsx collision](learnings/no-top-level-state-var-svelte2tsx.md) — Naming a top-level Svelte 5 component variable `state` trips a svelte2tsx collision (the compiler's own `state` concept) and fails `svelte-check`. The conquest
- [Numpad multiplier relabels number buttons (T20/D20) — and the selection persists across turns](learnings/numpad-multiplier-relabels-number-buttons-t20-d20-and-the-se.md) — **Found during the 2026-10-28 four-game test sweep**, driving the live scorer via browser automation.
- [OpenCode zen/go LLM endpoint needs x-opencode-session header + custom User-Agent](learnings/opencode-zen-go-needs-session-header.md) — The OpenCode Zen Go chat-completions endpoint (`https://opencode.ai/zen/go/v1/chat/completions`) rejects plain requests — it requires BOTH:
- [Patching board SVGs: replace existing attributes, never append duplicates](learnings/patching-board-svgs-replace-existing-attributes.md) — Gotcha
- [Plain `let` assigned in async onMount never re-renders — must be $state](learnings/plain-let-onmount-needs-state.md) — The gotcha
- [Refresh-resume depends on chronological turn order and persisted firstThrowerId](learnings/refresh-resume-needs-chronological-turn-order.md) — Refreshing the browser mid-leg (resume logic in `src/routes/match/[id]/+page.svelte`) silently depends on two implicit contracts. Breaking either reproduces the
- [Risk 42 adjacency table drifts from classic Risk by 3 edges — edge-sampling tests can't catch membership drift](learnings/risk-42-adjacency-table-drifts-from-classic-risk.md) — **Found in the 2026-10-24 three-axis code review** of PR #17 (commit 2c4d474) — Spec axis, should-fix/high.
- [Risk board SVGs: path attribute order varies — extract element-wise, not by regex lookahead](learnings/risk-board-svg-attribute-order.md) — Gotcha
- [Risk map SVG layers share a translate(-168,-119) — apply it when extracting paths or labels misalign](learnings/risk-map-svg-layers-share-a-translate-168-119.md) — While building the Risk 42 TV world map (2026-09-09): `docs/risk/risk-territory-board.svg` puts ALL its content layers (countries, labels, tints) inside groups 
- ["Risk" name collision: new game exploration (Sep 2026) is distinct from the Risk-darts proposal that became Trebles & Territories](learnings/risk-name-collision-new-game-exploration.md) — The name **"Risk"** is ambiguous in this project. It historically refers to the rolled-back **Risk-darts proposal** (documented at [[risk-darts-proposed-game-mo
- [risk-territory-board.svg palette: fills live in layer2, join to territories by centroid containment](learnings/risk-territory-board-svg-palette-in-layer2.md) — The world map for the Risk 42 TV view (`docs/risk/risk-territory-board.svg`, a copy of `risk-board.svg`) carries its **per-territory tints in the `layer2` fill
- [scrollbar-gutter: stable reserves 15px that window.innerWidth counts — measure the host box](learnings/scrollbar-gutter-stable-reserves-15px.md) — The gotcha
- [Session-only logins are absent from the saved-accounts list — don't gate account switching on it](learnings/session-only-logins-not-in-accounts-list.md) — Gotcha
- [SSR pages are empty shells — EmailGate gates all rendering client-side](learnings/ssr-pages-are-empty-shells-emailgate.md) — Gotcha
- [startRisk clears risk42_state but not risk42_game_id — new game silently resumes the old one](learnings/startrisk-clears-risk42-state-not-game-id.md) — **Found during the Risk 42 prod playtest campaign (2026-09-09/10), logged P1.**
- [structuredClone can't clone Svelte 5 $state proxies — pass $state.snapshot() at the engine boundary](learnings/structuredclone-can-t-clone-svelte-5-state.md) — Gotcha
- [SVG path parsing: arc arguments are not points — tokenize by command, never by coordinate-pair regex](learnings/svg-path-parsing-arc-arguments-are-not-points.md) — Gotcha
- [Tooltips must use fixed positioning to escape overflow clipping](learnings/tooltips-must-use-fixed-positioning.md) — Gotcha
- [Top-level return in a CJS script skips the file write — silent no-op](learnings/top-level-return-in-a-cjs-script-skips-the-file.md) — Gotcha
- [TS can't narrow $state inside closures — use $derived.by with local capture](learnings/ts-can-t-narrow-state-in-closures.md) — Gotcha
- [Turns DELETE endpoint silently no-ops — params.id (match id) shadows the turn-id query param](learnings/turns-delete-endpoint-silently-no-ops-params-id-match-id-sha.md) — **Found during the 2026-10-28 neo-browser delete-turn test campaign** (2-player match `96c568e8`, 3-player match `02cae89f`).
- [TV cast pages freeze in background tabs — document.hidden pauses polling and commentary](learnings/tv-cast-pages-freeze-in-background-tabs-document.md) — All three TV cast routes — `src/routes/match/[id]/tv/+page.svelte` (classic), `src/routes/match/conquest/[id]/tv/+page.svelte` (T&T), `src/routes/match/risk/[id
- [TV commentary hangs on one segment: audio events never fire in throttled windows — race every segment against a reading-time cap](learnings/tv-commentary-hangs-on-one-segment-audio-events.md) — Discovered during the 2026-09-09/10 prod playtest campaign (session 6): the TV commentary broadcast could hang forever on ONE segment. Root cause chain:
- [Only webSpeech TTS speaks Dutch — kokoro is English-only, ElevenLabs is pre-generated clips](learnings/webspeech-only-dutch-tts.md) — Only webSpeech TTS speaks Dutch
- [Wedge index from a seg path's M point needs a +9° half-wedge shift](learnings/wedge-index-from-a-seg-path-s-m-point-needs-a-9.md) — Gotcha
- [wiki_search misses recently-written concepts — verify with wiki_validate or ls before writing](learnings/wiki-search-misses-recent-concepts.md) — Discovered while recapping the Risk-darts rollback turn: `wiki_search("risk territory")` and `wiki_search("heat economies")` both returned **no results**, yet `
- [Bare [[slug]] wikilinks in wiki_note_page break cross-folder — use explicit relative paths](learnings/wikilinks-bare-slug-breaks-cross-folder.md) — The gotcha
<!-- wiki-nav:end -->

An [OKF](https://github.com/earendil-works/okf) bundle documenting this project.

- [Overview](./overview.md) — What this project contains and its structure
- [File tree](./architecture/file-tree.md) — Complete project file listing
- [Glossary](./glossary.md) — Key terms for this project
- [Pages](./pages/) — Concepts, entities, and artifacts of this project
