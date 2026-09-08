---
type: System Overview
title: Overview
description: What this project contains and its structure.
timestamp: "2026-09-07T19:11:02.020Z"
---

# Overview

**dart.monster** (deployed as **darts.xyz**) is a precision darts scoring web app built for players who want accurate scoring and deep statistics. Multiple players compete in classic 301/501/701/1001 matches organized into configurable legs and sets, with double-in/double-out rules, live checkout suggestions, and an audible "caller" that announces every score like a championship referee. The stack is **SvelteKit 2 + Svelte 5 (runes) + TypeScript + Tailwind CSS v4** on the frontend, persisted to **PostgreSQL** (hosted on Railway) through **Drizzle ORM** — all tables live in a dedicated `darts` schema. The production build targets Node via `@sveltejs/adapter-node`.

The application code lives in `src/`. Game rules are pure TypeScript modules in `src/lib/game/` (`scoring.ts` for dart math and bust/checkout detection, `match-engine.ts` for the leg/set state machine and thrower rotation, `checkout-suggestions.ts` for optimal finishes ≤170, `stats-engine.ts` for averages/checkout %/180s). The data layer is `src/lib/db/` (Drizzle schema + a `database-service.ts` service layer) exposed through a REST API under `src/routes/api/` (players, matches, legs, turns, stats, insights, settings). Pages cover match setup, a live scorer with an interactive SVG dartboard (`Dartboard.svelte`), match history, player profiles with all-time and last-20-legs stats, and a soft-delete archive with restore. Audio is a pre-generated ElevenLabs soundboard (`static/audio/`, per-voice score/event clips) plus Kokoro TTS running in-browser for dynamic player names.

Around the app itself sits a full AI-assisted development workspace: `.opencode/` holds a large skill library (autoresearch, te9-spec, tdd-workflow, svelte5-best-practices, pocketbase/railway docs, design-taste skills) used to research, spec, and build the app; `.specs/darts-501-app/` contains the resulting specification and task breakdown, and `.specs/trebles-and-territories/` holds the HTML implementation spec for the Trebles & Territories conquest mode (a Risk-on-a-dartboard game with LLM commentary and recap videos, playable at `/match/conquest`); `.codebase-graph/` and `.llm-docs/` hold generated codebase knowledge graphs and LLM-oriented docs. `docs/` keeps darts-rules research (PDC/WDF turn-taking), E2E gameplay simulations, test results, and a player-metrics tree. Supporting tooling includes `scripts/generate-soundboard.ts` (regenerates the caller MP3s), `drizzle/` SQL migrations, and a vendored copy of `godaddy-cli` (a Go CLI for domain/DNS management, with a prebuilt `godaddy.exe`).

Generated/volatile directories round out the tree: `.svelte-kit/` (dev-generated code, build output, route `$types.d.ts`), `build/` (adapter-node production bundle), `node_modules/`, and `.git/` (plus `godaddy-cli/.git/`, since it's a vendored repo with its own history). Most of the ~37k files are audio clips, hashed build chunks, and git objects — the meaningful source is compact: one SvelteKit app, its migrations, its docs, and its agent tooling.
