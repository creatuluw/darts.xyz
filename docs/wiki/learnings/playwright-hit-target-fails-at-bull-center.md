---
type: Learning
title: Playwright hit-target check fails at the bull's center — the 50 ring paints on top; click the 25 ring off-center
description: "**The gotcha:** in the dartboard SVG the bullseye (50) is painted **on top of** the single bull (25). A Playwright click aimed at the exact center of the bull t"
tags: [testing, playwright, dartboard, e2e]
timestamp: "2026-10-23T13:37:04.754Z"
---

# Playwright hit-target check fails at the bull's center — the 50 ring paints on top; click the 25 ring off-center

**The gotcha:** in the dartboard SVG the bullseye (50) is painted **on top of** the single bull (25). A Playwright click aimed at the exact center of the bull therefore fails the actionability/hit-target check — another element (the 50) intercepts pointer events at that point.

**The fix:** click a point inside the 25 ring but **off-center** (within the outer half of the bull).

**Applies to:** any e2e spec or smoke test targeting bull zones on `Dartboard.svelte` / `RiskBoard.svelte`. Same family as the layering fact that scoring segments paint above the black miss rim — SVG paint order decides Playwright hit targets, so pick click points from the topmost layer inward.
