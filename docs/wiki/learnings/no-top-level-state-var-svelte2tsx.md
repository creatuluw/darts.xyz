---
type: Learning
title: Don't name a top-level Svelte 5 variable `state` — svelte2tsx collision
description: Naming a top-level Svelte 5 component variable `state` trips a svelte2tsx collision (the compiler's own `state` concept) and fails `svelte-check`. The conquest 
tags: [svelte5, svelte-check, gotcha]
timestamp: "2026-09-08T21:25:12.550Z"
---

# Don't name a top-level Svelte 5 variable `state` — svelte2tsx collision

Naming a top-level Svelte 5 component variable `state` trips a svelte2tsx collision (the compiler's own `state` concept) and fails `svelte-check`. The conquest page already dodges this by naming its engine variable `game`; the TV-view pages hit it and had to rename. Convention for this codebase: **never call a component-level variable `state`** — use `game`, `matchState`, etc.
