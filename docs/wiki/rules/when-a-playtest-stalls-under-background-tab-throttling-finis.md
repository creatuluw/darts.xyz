---
type: Rule
title: When a playtest stalls under background-tab throttling, finish the game via the engine + PATCH — don't tab-hop
description: The guideline
tags: [playtesting, risk-42, throttling, e2e, browser]
timestamp: "2026-09-09T22:08:48.101Z"
---

# When a playtest stalls under background-tab throttling, finish the game via the engine + PATCH — don't tab-hop

## The guideline

When a live (dev or prod) playtest of a Risk 42 / conquest game stalls because the browser tab got background-throttled (timers stretch to ~22–25s/turn under "intensive throttling"), **don't tab-hop** — finish the game server-side via the engine:

1. Load the persisted game state (the same GET the app does).
2. Compute the remaining turns with the pure engine (`applyDart` in `src/lib/game/risk-engine.ts`).
3. PATCH/PUT the result back in **exactly the same JSON shape the app sends**.

## When it applies

Any playtest or E2E session driving the real app in a browser where the game tab loses focus (writing a report in another tab while a long hunt runs, etc.). Opening a fresh tab only helps while the tab counts as "new" — it's a losing race.

## Rationale / evidence

- Session 6, game 8 (6P Domination hunt) crawled at 25/40 under intensive throttling and stalled completely; a fresh-tab resume bought a few turns then re-throttled.
- Finishing via engine + PATCH produced a fully legal end state (same seams the app uses, no fabricated data), letting the 6P end screen and standings be validated without fake seeding.
- Related: [[../learnings/tv-cast-pages-freeze-in-background-tabs-document-hidden-paus]] (throttling also pauses TV polling/commentary) and [[../learnings/tv-commentary-hangs-on-one-segment-audio-events-never-fire-i]] (throttled windows also break audio events).
