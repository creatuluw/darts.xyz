---
type: Entity
title: TV second screen (cast views)
description: "Read-only big-screen views of a live match, meant for tab-casting to a TV in the room: one route for classic matches, one for conquest. The scorer pages carry c"
tags: [tv, cast, entity, live-match]
timestamp: "2026-09-08T21:25:12.550Z"
---

# TV second screen (cast views)

Read-only big-screen views of a live match, meant for tab-casting to a TV in the room: one route for classic matches, one for conquest. The scorer pages carry cast buttons (header `IconCast`, aria-label, no native title per house rule) that open the TV route in a new tab.

## Details

- **Routes**: `src/routes/match/[id]/tv/+page.svelte` (classic) and `src/routes/match/conquest/[id]/tv/+page.svelte` (conquest — rolling turn log + map)
- **Transport**: polls the existing REST API (~1s), no websockets; winner-freeze stops updates; zero caller audio (the scorer keeps the sound)
- **Auth**: public-by-link — conquest access rides the unguessable `conquest_games.id` uuid
- **Conquest state**: reads the server-persisted [conquest-state-server-persisted|write-through state](./conquest-state-server-persisted-write-through-state.md) (`conquest_games` jsonb)
- **Component**: [spectator-interviews-trebles-territories|TvCommentary](./spectator-interviews-trebles-territories-tvcommentary.md) (`src/lib/components/tv/TvCommentary.svelte`) — interview cadence, pause, generation, playback queue, subtitles
- **Tests**: cast-button specs in match-ui + conquest E2E; TV pages driven in fake-commentary mode

## Relationships

- [tv-mode-url-tab-cast-polling](../../decisions/tv-mode-url-tab-cast-polling.md) — the architecture this implements
- [spectator-interviews-trebles-territories](./spectator-interviews-trebles-territories.md) — the commentary that plays on it
- [conquest-engine-and-live-game](./conquest-engine-and-live-game.md) — whose state the conquest TV renders

## Lifecycle

- First added: 2026-09-08, PR #3 (stacked on the Trebles & Territories PR #2)
