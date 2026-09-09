---
type: Learning
title: "scrollbar-gutter: stable reserves 15px that window.innerWidth counts — measure the host box"
description: The gotcha
tags: [css, gotcha, e2e, layout, tv]
timestamp: "2026-09-09T12:50:57.165Z"
---

# scrollbar-gutter: stable reserves 15px that window.innerWidth counts — measure the host box

## The gotcha

`src/app.css` sets `scrollbar-gutter: stable` **globally**, so the layout viewport permanently reserves a ~15px vertical scrollbar gutter. `window.innerWidth` **counts** that 15px, but layout can't use it.

Symptoms seen 2026-09-09: `TvStage` sized from `window.innerWidth` rendered off-center by 7.5px, and the TV e2e geometry check failed with exactly a 7.5px offset (`docScrollW: 1265` vs `clientWidth: 1280`).

## The rule

For any viewport-sized or viewport-centered UI, **measure the host element's box (`clientWidth`/`clientHeight`, ideally via `ResizeObserver`), never `window.innerWidth/innerHeight`**. Same for e2e assertions: compare against the element's `clientWidth`, not `window.innerWidth` — there will always be a 15px delta on desktop.

Fixed in `TvStage.svelte` (commit `46a429e`, 2026-09-09) as part of the [TvStage-fill decision](../decisions/tvstage-fills-the-viewport-independent-x-y-scale-letterboxin.md).
