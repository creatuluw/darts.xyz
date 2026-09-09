---
type: Decision
title: TV cast pages render on a fixed 1920×1080 TvStage canvas, scaled to fit — no viewport breakpoints
description: Context
tags: [tv, frontend, layout, responsive]
status: accepted
timestamp: "2026-09-09T12:21:17.641Z"
---

# TV cast pages render on a fixed 1920×1080 TvStage canvas, scaled to fit — no viewport breakpoints

## Context

The TV second-screen pages ([[tv-second-screen-cast-views]]) were originally laid out with viewport breakpoints. The user asked for them to be responsive to the viewport **while keeping the 16:9 aspect ratio intact whenever feasible** — these pages exist to be tab-cast to a TV in the room.

## Decision

Both TV routes render inside a shared **`TvStage`** component (`src/lib/components/tv/TvStage.svelte`): a fixed **1920×1080 coordinate space** that CSS-scales to fit the viewport and letterboxes the remainder (centered black bars). The pages dropped their viewport breakpoints entirely and build their UI at fixed TV coordinates.

## Alternatives considered

- **Per-page media queries** (status quo) — duplicated work per page, and the aspect ratio still drifts on odd viewports.
- **Fully fluid layouts** — breaks the "TV picture" feel and makes every layout calculation viewport-dependent.

## Rationale

- The cast target is a 16:9 TV; a scale-to-fit stage guarantees the ratio in one place instead of per-breakpoint.
- Fixed coordinates make TV layout math trivial and pixel-identical on every device.
- Toasts render at layout level in the real viewport, so they are unaffected by the stage scaling.

## Consequences

- Build TV-page UI at 1920×1080 coordinates inside `<TvStage>` — do **not** reintroduce viewport breakpoints on these pages.
- Children are passed via Svelte 5 snippets (`{#snippet}`/`{@render}`), per house style (`<slot>` is deprecated in Svelte 5).
- Adding a third TV-style view should reuse `TvStage` rather than inventing its own scaling.
