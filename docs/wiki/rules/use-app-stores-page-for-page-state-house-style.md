---
type: Rule
title: Use $app/stores $page for page state — house style
description: Rule
tags: [sveltekit, conventions, frontend]
timestamp: "2026-09-07T22:17:00.772Z"
---

# Use $app/stores $page for page state — house style

## Rule

Page-level state in SvelteKit routes uses **`$app/stores` + `$page`** (e.g. `$page.url.searchParams` for tab state), not `svelte-navigation`, context stores, or local state.

## When it applies

Any new route or page-level UI state (tabs, filters, view mode). Before introducing a state pattern, check how sibling routes under `src/routes/` do it and copy that — this was how the Fun tab (`?tab=fun` on `/match/setup`) was built.

## Rationale

Consistency across routes; URL-synced state stays shareable/bookmarkable; one less pattern for future sessions to reverse-engineer.
