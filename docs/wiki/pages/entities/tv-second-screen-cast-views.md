---
type: Entity
title: TV second screen (cast views)
description: "Read-only big-screen views of a live match, meant for tab-casting to a TV in the room: one route each for classic matches, conquest, and **Risk 42**. The scorer"
tags: [tv, cast, entity, live-match]
timestamp: "2026-09-09T12:51:35.209Z"
---

# TV second screen (cast views)

Read-only big-screen views of a live match, meant for tab-casting to a TV in the room: one route each for classic matches, conquest, and **Risk 42**. The scorer pages carry cast buttons (header `IconCast`, aria-label, no native title per house rule) that open the TV route in a new tab.

## Details

- **Routes**: `src/routes/match/[id]/tv/+page.svelte` (classic), `src/routes/match/conquest/[id]/tv/+page.svelte` (conquest — rolling turn log + map), and `src/routes/match/risk/[id]/tv/+page.svelte` (Risk 42 — LIVE board + standings + continent bonuses + frozen champion card)
- **Stage**: shared [TvStage-fill decision](../../decisions/tvstage-fills-the-viewport-independent-x-y-scale-letterboxin.md) (`src/lib/components/tv/TvStage.svelte`) — a fixed 1920×1080 canvas with **independent x/y scaling to fill the host box** (exact 1:1 on true 16:9, small stretch instead of pillars otherwise); it measures its own host via `ResizeObserver`, never `window.innerWidth` (see the [scrollbar-gutter learning](../../learnings/scrollbar-gutter-stable-reserves-15px-that-window-innerwidth.md)); pages build their layout at fixed TV coordinates inside it (no viewport breakpoints; children passed as Svelte 5 snippets)
- **Layout chrome**: TV routes escape the root layout — its `isTv` flag strips the `<main class="pt-16 pb-16 px-8 max-w-7xl">` wrapper so `/tv` pages render edge-to-edge
- **Transport**: polls the existing REST API (~1s), no websockets; winner-freeze stops updates; zero caller audio (the scorer keeps the sound)
- **Auth**: public-by-link — conquest/risk access rides the unguessable game uuids
- **Risk 42 cast button**: appears on `/match/risk` only once the game is server-backed (same rule as conquest); the world-map spectate render is the M2 spec step of the [two-screen identity](../../decisions/risk-42-two-screen-identity-dartboard-to-play-world-map-to-s.md) — the TV shows the dartboard until then
- **Component**: [spectator-interviews TvCommentary component](./spectator-interviews-trebles-territories.md) (`src/lib/components/tv/TvCommentary.svelte`) — interview cadence, pause, generation, playback queue, subtitles (conquest/classic only — not on risk until specced)
- **Tests**: cast-button specs in match-ui + conquest E2E; TV pages driven in fake-commentary mode (`e2e/tv-classic.spec.ts`, `e2e/tv-conquest.spec.ts`, `e2e/tv-commentary.spec.ts`, `e2e/tv-risk.spec.ts` — risk covers cast button + stage-fill geometry)

## Relationships

- [tv-mode-url-tab-cast-polling](../../decisions/tv-mode-url-tab-cast-polling.md) — the architecture this implements
- [tvstage-fills-the-viewport-independent-x-y-scale-letterboxin](../../decisions/tvstage-fills-the-viewport-independent-x-y-scale-letterboxin.md) — how all pages stay viewport-filling yet TV-coordinated
- [spectator-interviews-trebles-territories](./spectator-interviews-trebles-territories.md) — the commentary that plays on it
- [conquest-engine-and-live-game](./conquest-engine-and-live-game.md) — whose state the conquest TV renders
- [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) — whose server-persisted state the risk TV renders

## Lifecycle

- First added: 2026-09-08 — built on `feature/2nd-tv-screen-cast-realtime`, stacked on the Trebles & Territories branch
- Significant changes: 2026-09-08 — merged to master via **PR #7** (`f0c28b5`), deploying to Railway production (cast buttons on both scorers + `/match/[id]/tv` route)
- Significant changes: 2026-09-09 — both pages moved onto the shared TvStage (viewport-responsive, 16:9 preserved); Dutch copy fix "gooiet" → "gooit" on the conquest phase banner and the classic player card
- Significant changes: 2026-09-09 — commit `46a429e` on master: TvStage letterbox → fill (independent x/y), `/tv` routes escape root-layout chrome, scrollbar-gutter fix; **third route added** — `/match/risk/[id]/tv` with its cast button on the Risk 42 scorer
