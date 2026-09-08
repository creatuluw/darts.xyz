---
type: Rule
title: Use the Tooltip component, not native title attributes
description: Guideline
tags: [frontend, ui, svelte, tooltips]
timestamp: "2026-09-07T21:58:40.594Z"
---

# Use the Tooltip component, not native title attributes

## Guideline

When a UI element needs a tooltip, use the project's `Tooltip` component (`src/lib/components/ui/Tooltip.svelte`) — never the native `title` attribute. Replace any existing native `title` tooltips when touching nearby markup.

## When it applies

Any hover/focus explanatory hint in Svelte components: table headers, stat labels, buttons, icons.

## Rationale

- `title` tooltips are invisible on touch devices, delayed ~1s by browsers, and unstyled — unusable on the mobile scorer UI.
- The `Tooltip` component gives styled, positioned, accessible (hover + focus) tooltips with a short delay (~100ms) already tuned for the app.
- Applied 2026-09-07: all 13 Stats-tab headers in the match scorer moved from `title` attributes to the `Tooltip` component, so stat abbreviations (CO%, Dbl, 60+F, Prior) are readable on all devices.

## Evidence

- Stats tab header tooltips in the match scorer UI (turn 2026-09-07).
