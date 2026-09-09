---
okf_version: "0.1"
---

<!-- wiki-memory:start -->
# Memory — the live contract

Auto-generated digest of the most recent conventions, decisions, rules and
development patterns, plus architecture and global patterns — newest first.
The actual files live in the wiki subfolders; follow the links (clickable in /wiki).
Regenerated on every wiki write and on wiki_mark_synced. Generated 2026-09-09T09:00:32.919Z.

## Recent Decisions

- [Risk 42 applyDart seam: DartHit carries singleRing for singles](decisions/risk-42-applydart-seam-darthit-carries-singlering-for-single.md) — Context (2026-09-09)
- [Risk 42 two-screen identity: dartboard to play, world map to spectate](decisions/risk-42-two-screen-identity-dartboard-to-play-world-map-to-s.md) — Context (2026-09-09)
- [Risk 42 deal amended: exactly equal deal, 2 armies each, blank leftovers claimable, players pick starter](decisions/risk-42-deal-final-equal-2-armies-blanks.md) — Context (2026-09-09)
- [Risk 42 game start: random deal of all 40 territories (1 army each), no claiming phase](decisions/risk-42-game-start-random-deal.md) — Context (2026-09-09)
- [Risk 42 continent income: +1 dart per full continent (Asia +2); budget shown pre-turn](decisions/risk-42-continent-income.md) — Context (2026-09-09)
- [Risk 42 bulls: the Arsenal charge (25 = +1, 50 = +2)](decisions/risk-42-bulls-the-arsenal-charge-25-1-50-2.md) — Context (2026-09-09)
- [Risk 42 elimination: exile & clawback — zero boxes ≠ death](decisions/risk-42-exile-and-clawback.md) — Context (2026-09-09)
- [Risk 42 endgame: Domination as headline, 170/301/501 clock as alt — mirroring T&T](decisions/risk-42-domination-headline-clock-alt.md) — Context (2026-09-09)
- [Territory labels go horizontal: centered in each box, no rotation](decisions/territory-labels-go-horizontal-centered-in-each.md) — Context (2026-09-08)
- [World map → dartboard mapping via azimuthal projection + Hungarian assignment (bull = Black Sea)](decisions/board-mapping-azimuthal-hungarian.md) — Azimuthal + Hungarian fit replaces the hand-drawn world-map draft; bull = Black Sea, inner = Old World core, outer = frontier (2026-09-08)
- [Real Risk world map on the board — 40 territories via inner/outer boxes, Japan & Madagascar cut](decisions/real-risk-world-map-draft.md) — Context (2026-09-08)
- [Risk 42 attack rule locked: mirror damage — deposit down on enemy land, reduce-to-zero capture](decisions/risk-42-attack-rule-mirror-damage.md) — Context (2026-09-08)
- [Risk 42 base mechanic: two-feeder army deposits (any-dart claims, treble feeds inner +2, double feeds outer +2)](decisions/risk-42-base-mechanic-two-feeder-deposits.md) — Risk 42 base mechanic locked as two-feeder army deposits — any dart claims a blank, own-land dart +1, treble feeds inner box +2, double feed… (2026-09-08)
- [Commentary gated on open 2nd screen + pause button; all match types; every-N-turns cadence](decisions/commentary-gated-on-2nd-screen.md) — Context (2026-09-08)
- [Interviews on ElevenLabs live TTS: fixed commentator voice, random Dutch spectators](decisions/interviews-elevenlabs-live-tts.md) — Context (2026-09-08)

## Active Rules

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

- [Game-engine tests: filler darts must be misses, and fixtures obey the rules they enforce](learnings/game-engine-tests-filler-darts-must-be-misses-and-fixtures-o.md) — Caught red-handed twice during the Risk 42 M1 TDD cycles (2026-09-09), both produced false reds (and one false green that slipped into a com… (2026-09-09)
- [Fresh SvelteKit worktree needs `svelte-kit sync` before tests run](learnings/fresh-sveltekit-worktree-needs-svelte-kit-sync-before-tests-.md) — Gotcha from the Risk 42 M1 build (2026-09-09): a freshly created SvelteKit worktree (deps junctioned from the main checkout) is **missing th… (2026-09-09)
- [risk-territory-board.svg palette: fills live in layer2, join to territories by centroid containment](learnings/risk-territory-board-svg-palette-fills-live-in-layer2-join-t.md) — The world map for the Risk 42 TV view (`docs/risk/risk-territory-board.svg`, a copy of `risk-board.svg`) carries its **per-territory tints i… (2026-09-09)
- [Top-level return in a CJS script skips the file write — silent no-op](learnings/top-level-return-in-a-cjs-script-skips-the-file.md) — Gotcha (2026-09-08)
- [Flipped labels: negate radial offset on left half](learnings/flipped-labels-negate-radial-offset-on-left-half.md) — Gotcha (2026-09-08)
- [SVG path parsing: arc arguments are not points — tokenize by command, never by coordinate-pair regex](learnings/svg-path-parsing-arc-arguments-are-not-points.md) — Gotcha (2026-09-08)
- [Dartboard SVG paths encode box identity — read (number, ring) from geometry, don't hand-map](learnings/dartboard-svg-paths-encode-box-identity-read.md) — The fact (2026-09-08)
- [Patching board SVGs: replace existing attributes, never append duplicates](learnings/patching-board-svgs-replace-existing-attributes.md) — Gotcha (2026-09-08)
- [Wedge index from a seg path's M point needs a +9° half-wedge shift](learnings/wedge-index-from-a-seg-path-s-m-point-needs-a-9.md) — Gotcha (2026-09-08)
- [Large browser evaluate returns spill to disk wrapped in [UNTRUSTED_PAGE_CONTENT] markers](learnings/large-browser-evaluate-returns-spill-to-disk.md) — When extracting a large payload (e.g. a 32KB serialized SVG) from a page via the browser, an `evaluate` whose return exceeds the inline thre… (2026-09-08)
- [Risk board SVGs: path attribute order varies — extract element-wise, not by regex lookahead](learnings/risk-board-svg-attribute-order.md) — Gotcha (2026-09-08)
- ["Risk" name collision: new game exploration (Sep 2026) is distinct from the Risk-darts proposal that became Trebles & Territories](learnings/risk-name-collision-new-game-exploration.md) — The name **"Risk"** is ambiguous in this project. It historically refers to the rolled-back **Risk-darts proposal** (documented at [[risk-da… (2026-09-08)
- [Windows worktree deletion: kill the process holding the directory first](learnings/windows-worktree-delete-kill-holder-first.md) — Symptom (2026-09-08)
- [db:push ignores the darts schema — migrations are file-as-record, applied directly](learnings/db-push-ignores-darts-schema.md) — `drizzle-kit push` (npm `db:push`) only manages the **`public`** schema — it silently ignores the `darts` schema, so a push can "succeed" wh… (2026-09-08)
- [$env/dynamic/private doesn't resolve in vitest — split the pure logic into its own module](learnings/env-dynamic-private-vitest-split.md) — Vitest can't resolve `$env/dynamic/private` — importing it in a module under test fails at import time. (2026-09-08)
- [Don't name a top-level Svelte 5 variable `state` — svelte2tsx collision](learnings/no-top-level-state-var-svelte2tsx.md) — Naming a top-level Svelte 5 component variable `state` trips a svelte2tsx collision (the compiler's own `state` concept) and fails `svelte-c… (2026-09-08)
- [Bare [[slug]] wikilinks in wiki_note_page break cross-folder — use explicit relative paths](learnings/wikilinks-bare-slug-breaks-cross-folder.md) — The gotcha (2026-09-08)
- [Only webSpeech TTS speaks Dutch — kokoro is English-only, ElevenLabs is pre-generated clips](learnings/webspeech-only-dutch-tts.md) — Only webSpeech TTS speaks Dutch (2026-09-08)
- [Conquest state is client-side only — nothing for a 2nd screen to poll](learnings/conquest-state-client-side-only.md) — The fact (2026-09-08)
- [Trebles & Territories build was untracked in the working tree — now landed on feature/trebles-territories (PR #2)](learnings/conquest-build-untracked-in-working-tree.md) — RESOLVED 2026-09-08: the conquest build that survived the git rollback as untracked files is now committed on feature/trebles-territories an… (2026-09-08)

## Architecture

- [File tree](architecture/file-tree.md) — Complete project file listing with per-file descriptions. (2026-09-07)

## Global Patterns

- [Risk 42 (proposed game mode)](pages/concepts/risk-42-proposed-game-mode.md) — What is it? (2026-09-09)
- [Risk Darts (proposed game mode)](pages/concepts/risk-darts-proposed-game-mode.md) — What is it? (2026-09-07)

<!-- wiki-memory:end -->
