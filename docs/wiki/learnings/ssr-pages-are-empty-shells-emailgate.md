---
type: Learning
title: SSR pages are empty shells — EmailGate gates all rendering client-side
description: Gotcha
tags: [testing, ssr, emailgate, verification]
timestamp: "2026-09-07T22:17:00.771Z"
---

# SSR pages are empty shells — EmailGate gates all rendering client-side

## Gotcha

Every route renders an **empty SSR shell** — `curl`ing a page (or reading its SSR HTML) shows no content for ANY route. The app gates rendering behind the client-side `EmailGate.svelte`, so nothing renders until the account/localStorage key is set in a real browser.

## Consequence for verification

- `curl localhost:5173/...` returning 200 with an empty body is **normal**, not a bug — it proves nothing about the page.
- To actually verify a page: headless browser with the account localStorage key set, screenshot, then inspect via the image-analysis skill (direct image viewing isn't available).
- Query params (e.g. `?tab=fun`) are read in `onMount`, so SSR snapshots won't reflect them either.

## Also worth knowing

`svelte-check` has 4 baseline errors in `Dartboard.svelte` that predate current work — "clean for touched files" is the real bar, not repo-wide zero.
