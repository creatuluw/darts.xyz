---
type: Entity
title: LLM Commentary (Trebles & Territories)
description: "The in-game AI commentary/interview broadcast layer: an LLM writes Dutch commentary and spectator interviews at every-N-turn boundaries, voiced and subtitled on"
tags: [llm, commentary, entity, trebles-and-territories, tv]
timestamp: "2026-09-09T10:41:56.879Z"
---

# LLM Commentary (Trebles & Territories)

The in-game AI commentary/interview broadcast layer: an LLM writes Dutch commentary and spectator interviews at every-N-turn boundaries, voiced and subtitled on the TV second screen. **Implemented on master 2026-09-09** — it shares one pipeline with [spectator-interviews-trebles-territories](./spectator-interviews-trebles-territories.md) (see that page for the full file map: `src/lib/server/opencode.ts`, `src/lib/game/commentary-prompt.ts` + `commentary-cadence.ts` + `elevenlabs-voices.ts`, `src/routes/api/commentary/`, `src/lib/components/tv/TvCommentary.svelte`).

## Details

- **Endpoint**: `https://opencode.ai/zen/go/v1/chat/completions` (OpenCode Zen Go) — see the [endpoint-headers learning](../../learnings/opencode-zen-go-needs-session-header.md); model `glm-5.3-flash`; API key in `.env` under `OPENCODE_API`; wrapped by `src/lib/server/opencode.ts`.
- **Cadence**: every N turns (default 2) — N is the LLM aggregation window.
- **Trigger material**: score events, territories claimed/lost, Shanghai feats, Bull Altar resurrections, domination runs — the same event stream the audio caller uses.
- **Original persona spec** (2026-09-07, superseded): PDC-style sport commentary × British humor × TV chef quotes with Muppet Show stingers. The 2026-09-08 grill rounds replaced this with **Dutch spectator personas** (Ome Gerrit, Jasmien, …) rendered on the TV second screen — see [spectator-interviews-trebles-territories](./spectator-interviews-trebles-territories.md) and [commentary-gated-on-2nd-screen](../../decisions/commentary-gated-on-2nd-screen.md).

## Relationships

- [spectator-interviews-trebles-territories](./spectator-interviews-trebles-territories.md) — the converged feature this layer now lives inside; holds the implementation map
- [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) — the game mode it narrates
- [tv-mode-url-tab-cast-polling](../../decisions/tv-mode-url-tab-cast-polling.md) — the render surface and generation gate
- The original spec lives in `.specs/trebles-and-territories/spec.html` — see [Trebles & Territories implementation spec](../artifacts/trebles-territories-implementation-spec.md)

## Lifecycle

- First added: spec'd during the Trebles & Territories implementation-spec turn (2026-09-07).
- 2026-09-08: persona + render-target design superseded by the grill-round interviews spec (Dutch, TV-gated, all match types).
- 2026-09-09: implemented on master with the interviews pipeline (`4f9d3fa` → `3c6803c`).
