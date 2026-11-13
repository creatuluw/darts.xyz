---
type: Learning
title: Playwright clicks can stall forever on scorer numpad buttons — cap timeout, fall back to el.click()
description: **Found while building the 2026-11-13 gauntlet** (`e2e/gauntlet/gauntlet.spec.ts`). Playwright's real `locator.click()` can hang indefinitely on the live scorer
tags: [playwright, testing, gotcha, ui]
timestamp: "2026-11-13T18:05:21.371Z"
---

# Playwright clicks can stall forever on scorer numpad buttons — cap timeout, fall back to el.click()

**Found while building the 2026-11-13 gauntlet** (`e2e/gauntlet/gauntlet.spec.ts`). Playwright's real `locator.click()` can hang indefinitely on the live scorer's numpad buttons: the click log shows the button "visible, enabled and stable", then stalls at "scrolling into view if needed" until the test timeout — seen on G1's very first T20 click while the identical flow worked in other games (racy, layout-dependent).

**The fix**: never click scorer buttons with an unbounded actionability wait. `act.click()` tries `locator.click({ timeout: 6000 })` and on failure falls back to `locator.evaluate((el) => el HTMLElement).click())` — a DOM click that fires Svelte's `onclick` exactly like a user click but bypasses the scroll/hit-target machinery. Same pattern as the earlier "Neo ref-clicks silently no-op on some SvelteKit buttons — use evaluate el.click()" gotcha, but this one bites native Playwright clicks too.

**Also**: cap every real click's timeout (6s here) so one stall costs seconds, not the whole 300s test budget.
