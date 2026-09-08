---
okf_version: "0.1"
---

# Project Knowledge Wiki

<!-- wiki-nav:start -->
## Navigation map

Auto-generated detailed index of every docs/wiki/ concept — the map the LLM uses to locate information. 48 concept(s). Regenerated on init and on wiki_mark_synced. Generated 2026-09-08T07:43:34.439Z.

Each entry: `concept-id` (pass to wiki_get) — title — description.

### Core concepts

- `glossary` — Glossary — Key terms for this project.
- `overview` — Overview — What this project contains and its structure.

### Architecture

- `architecture/file-tree` — File tree — Complete project file listing with per-file descriptions.

### Pages

- `pages/artifacts/test-suite` — Test suite — The automated test layer for dart.monster: 67 Vitest unit tests over the pure game modules, plus 14 Playwright E2E tests (API lifecycle + real-browser UI) that 
- `pages/artifacts/trebles-and-territories-player-manual` — Trebles and Territories player manual — Player-facing rules-only HTML manual distilling the Trebles and Territories implementation spec into 7 short Dutch sections.
- `pages/artifacts/trebles-territories-implementation-spec` — Trebles & Territories implementation spec — The implementation spec for **Trebles and Territories** — the self-contained HTML design document (built with the html-docs skill) that drives the build. Contai
- `pages/concepts/risk-darts-proposed-game-mode` — Risk Darts (proposed game mode) — What is it?
- `pages/entities/conquest-engine-and-live-game` — Conquest engine (conquest-engine.ts + live conquest game) — The playable implementation of [[risk-darts-proposed-game-mode]] (Trebles & Territories): a pure, TDD'd game engine plus the board component and live game route
- `pages/entities/conquest-setup-fun-tab-conquest-setup-ts` — Conquest setup (Fun tab + conquest-setup.ts) — The first shipped code for [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) (Trebles and Territories): the **Fun tab** on the match setup page plus the pure setup-logic module
- `pages/entities/dart-monster-dns-railway-domain-setup` — dart.monster DNS & Railway domain setup — Concrete infrastructure: how `dart.monster` (this project, also deployed as darts.xyz) is wired to its Railway service, as of 2026-09-07.
- `pages/entities/e2e-helpers` — E2E helpers — `e2e/helpers.ts` — the shared seeding/util module every Playwright spec imports. It owns the account-isolation and persistence gotchas so each spec doesn't redi
- `pages/entities/live-match-page` — Live Match Page — What is it?
- `pages/entities/llm-commentary-trebles-territories` — LLM Commentary (Trebles & Territories) — The in-game AI commentary feed for [[risk-darts-proposed-game-mode|Trebles & Territories]]: an LLM writes a commentary blurb **every 2 turns**, rendered in a de
- `pages/entities/match-stats-tab` — Match Stats Tab — All-players statistics table in the live match UI, plus the leg/match average displays shipped with it.
- `pages/entities/playerpanel` — PlayerPanel — A reusable scoreboard panel component for the live match scorer, rendered around the board for every roster size (full-size for 1–2 players, condensed cards for 3–6).
- `pages/entities/recap-video-pipeline-trebles-territories` — Recap Video Pipeline (Trebles & Territories) — The planned Morning-After recap feature for Trebles & Territories: the day after a game, each match gets an LLM-generated recap video, and players who stored an email address receive a link to it.
- `pages/TEMPLATES` — Page Templates — Reference templates for Concept, Entity, and Artifact pages. Follow these when using wiki_note_page.

### Decisions

- `decisions/adopt-vitest-playwright-real-db-e2e` — Adopt Vitest + Playwright test stack with real-DB E2E — Context
- `decisions/bull-altar-resurrection-replaces-siege-lock` — Bull Altar resurrection replaces insurgents; Siege map B locked — Context
- `decisions/cap-match-rosters-at-6-players` — Cap match rosters at 6 players, enforced client and server — Context
- `decisions/cards-around-the-board` — Cards around the board for all roster sizes (condensed panels for 3–6) — Decision
- `decisions/claim-based-territory-ownership` — Claim-based territory ownership replaces the damage-flip model in Risk darts — Context
- `decisions/dual-layout-match-view` — Dual-layout live match view: standings strip for 3+ players — Context
- `decisions/heat-momentum-core-balancing-mechanic` — Heat momentum as the core balancing mechanic for the Risk-style conquest darts mode — Context
- `decisions/last-stand-amendment-blank-first-resurrection` — Last Stand amendment: blank-first resurrection, next-player robbery, defender bull save — Context
- `decisions/preset-ladder-51-1501-steps-of-50` — Preset ladder re-banded to 51–1501 in steps of 50 (301 default) — Decision
- `decisions/recap-videos-via-hyperframes` — Recap videos via HyperFrames for day-after match reminders — Context
- `decisions/risk-territory-darts-over-heat-economies` — Risk-territory darts over heat economies — Context
- `decisions/shanghai-feat-grants-1-dart-the-next-turn` — Shanghai feat grants +1 dart the next turn — Context
- `decisions/timed-war-clock-in-turns-per-player` — Timed War clock measured in turns per player, branded 170/301/501 (default 301) — Context
- `decisions/timed-war-default-endgame-fixed-continents` — Timed War default endgame, fixed continents, no elimination for Risk darts — Context
- `decisions/treble-frontier-founding-requires-treble` — Treble-frontier founding: blank territories require a treble to claim — Context
- `decisions/trebles-territories-board-palette-coolors` — Trebles & Territories board palette locked (Coolors 10-color band) — Decision

### Rules

- `rules/logic-todos-must-use-tdd-skill` — All code/logic todos must use the TDD skill (red→green→refactor) — The rule
- `rules/never-hardcode-player-slots-in-match-ui` — Never hardcode player slots in match UI — Guideline
- `rules/use-app-stores-page-for-page-state-house-style` — Use $app/stores $page for page state — house style — Rule
- `rules/use-tooltip-not-native-title` — Use the Tooltip component, not native title attributes — Guideline

### Learnings

- `learnings/darts-email-localstorage-stores-raw-email` — darts_email localStorage key stores the email raw, not JSON — The `darts_email` localStorage key stores the email as a **raw string** — `getEmail`/`setEmail` do not JSON-encode it. This differs from the accounts key, which
- `learnings/godaddy-apex-domain-a-record-to-edge-ip` — GoDaddy apex domain on Railway: A record to live edge IP, not the documented one — The pattern (snooze.monster / dart.monster, Sep 2026)
- `learnings/godaddy-dns-can-t-serve-a-railway-apex-domain` — GoDaddy DNS can't serve a Railway apex domain — The gotcha
- `learnings/miss-turns-must-persist-with-dartsthrown-1` — Miss turns must persist with dartsThrown ≥ 1 — The turns table / API has a constraint that `dartsThrown >= 1`. A miss (all three darts off the board) is still a turn and must be persisted with `dartsThrown`
- `learnings/opencode-zen-go-needs-session-header` — OpenCode zen/go LLM endpoint needs x-opencode-session header + custom User-Agent — The OpenCode Zen Go chat-completions endpoint (`https://opencode.ai/zen/go/v1/chat/completions`) rejects plain requests — it requires BOTH:
- `learnings/refresh-resume-needs-chronological-turn-order` — Refresh-resume depends on chronological turn order and persisted firstThrowerId — Refreshing the browser mid-leg (resume logic in `src/routes/match/[id]/+page.svelte`) silently depends on two implicit contracts. Breaking either reproduces the
- `learnings/ssr-pages-are-empty-shells-emailgate` — SSR pages are empty shells — EmailGate gates all rendering client-side — Gotcha
- `learnings/structuredclone-can-t-clone-svelte-5-state` — structuredClone can't clone Svelte 5 $state proxies — pass $state.snapshot() at the engine boundary — Gotcha
- `learnings/tooltips-must-use-fixed-positioning` — Tooltips must use fixed positioning to escape overflow clipping — Gotcha
- `learnings/ts-can-t-narrow-state-in-closures` — TS can't narrow $state inside closures — use $derived.by with local capture — Gotcha
- `learnings/wiki-search-misses-recent-concepts` — wiki_search misses recently-written concepts — verify with wiki_validate or ls before writing — Discovered while recapping the Risk-darts rollback turn: `wiki_search("risk territory")` and `wiki_search("heat economies")` both returned **no results**, yet `
<!-- wiki-nav:end -->

An [OKF](https://github.com/earendil-works/okf) bundle documenting this project.

- [Overview](./overview.md) — What this project contains and its structure
- [File tree](./architecture/file-tree.md) — Complete project file listing
- [Glossary](./glossary.md) — Key terms for this project
- [Pages](./pages/) — Concepts, entities, and artifacts of this project
