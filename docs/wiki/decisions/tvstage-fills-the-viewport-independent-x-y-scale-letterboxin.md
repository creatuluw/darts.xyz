---
type: Decision
title: TvStage fills the viewport (independent x/y scale) — letterboxing dropped
description: Context
tags: [tv, frontend, layout, responsive]
status: accepted
supersedes: "["decisions/tv-cast-pages-render-on-a-fixed-1920-1080-tvstage-canvas-sca"]"
timestamp: "2026-09-09T12:50:57.165Z"
---

# TvStage fills the viewport (independent x/y scale) — letterboxing dropped

## Context

The user cast the classic TV view (`/match/[id]/tv`) to a 16:9 landscape monitor and saw it not fill the viewport. Two stacked causes: (1) with browser chrome (tab/address bars), a 16:9 monitor's *viewport* is roughly 2:1, and the previous TvStage strategy — uniform `min` scale-to-fit with letterboxing — turned that into permanent side pillars; (2) the root layout wrapped `/tv` pages in app chrome (`<main class="pt-16 pb-16 px-8 max-w-7xl">`), insetting and capping the stage, plus the global `scrollbar-gutter: stable` reserving 15px ([learning](../learnings/scrollbar-gutter-stable-reserves-15px-that-window-innerwidth.md)). Fixed in commit `46a429e` on master, 2026-09-09.

## Decision

`TvStage` (`src/lib/components/tv/TvStage.svelte`) keeps its fixed **1920×1080 coordinate space and no viewport breakpoints** (that part of the superseded decision carries over), but now **fills the host box with independent x/y scaling**: exact 1:1 on a true 16:9 viewport, a small stretch instead of black pillars on chrome'd landscape. It measures its own host element (`clientWidth`/`clientHeight` via `ResizeObserver`), never `window.innerWidth/innerHeight`.

Additionally, TV routes **escape the root layout chrome**: the layout's existing `isTv` flag now strips the `<main>` padding/max-width wrapper so `/tv` pages render edge-to-edge.

## Alternatives considered

- **Keep letterbox (status quo)** — "correct" aspect on true 16:9, but on any real browser viewport the pillars waste most of the screen; user explicitly wanted fill.
- **Per-page responsive breakpoints** — already rejected by the superseded decision; nothing changed.

## Rationale

- The 2nd screen exists to *fill* a TV/monitor; a chrome'd 16:9 viewport is ~2:1, so scale-to-fit guarantees pillars exactly when the page is used.
- A slight stretch on off-ratio viewports is invisible for a scoreboard; wasted screen is not.
- Measuring the host box is the only correct input given the global scrollbar-gutter reservation.

## Consequences

- E2E assertions for TV geometry must compare against the stage's visible host box (`clientWidth`), not `window.innerWidth` (15px gutter off-by).
- On strongly non-16:9 viewports the picture is stretched rather than pillarboxed — accepted trade-off.
- New TV routes (e.g. the risk one added the same day) get fill behavior for free via `TvStage`.
