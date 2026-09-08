---
type: Learning
title: Tooltips must use fixed positioning to escape overflow clipping
description: Gotcha
tags: [frontend, ui, css, tooltips, svelte]
timestamp: "2026-09-07T22:01:51.103Z"
---

# Tooltips must use fixed positioning to escape overflow clipping

## Gotcha

`position: absolute` tooltips get clipped by any ancestor with `overflow: hidden|auto|scroll`. This app has many such ancestors — stats tables wrapped in `overflow-x-auto` scroll containers, bezel containers — so absolutely-positioned bubbles were cut off at the wrapper edge.

## Fix pattern (applied 2026-09-07)

The shared `Tooltip` component (`src/lib/components/ui/Tooltip.svelte`) now uses a `position: fixed` bubble:

- Fixed positioning is relative to the viewport, which **escapes every clipping ancestor** — no `overflow` rule on any parent can clip it.
- The bubble renders off-screen (`top/left: -9999px`) first, then an `$effect` measures both trigger and bubble via `getBoundingClientRect()` and sets viewport coordinates. Measuring the bubble itself is required because its width varies with content (whitespace-nowrap text).
- Supports all four positions (top/bottom/left/right) with an 8px gap.

## Rule for future floating UI

Any new floating element (dropdown, popover, menu) rendered inside a scroll container must use this same fixed + measured pattern — or a portal — not `position: absolute`. Otherwise it will clip the moment it lands in a scrollable wrapper.
