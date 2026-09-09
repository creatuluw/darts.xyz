---
type: Learning
title: TV cast pages freeze in background tabs — document.hidden pauses polling and commentary
description: "All three TV cast routes — `src/routes/match/[id]/tv/+page.svelte` (classic), `src/routes/match/conquest/[id]/tv/+page.svelte` (T&T), `src/routes/match/risk/[id"
tags: [tv, second-screen, browser-testing, document-hidden]
timestamp: "2026-09-09T19:48:28.725Z"
---

# TV cast pages freeze in background tabs — document.hidden pauses polling and commentary

All three TV cast routes — `src/routes/match/[id]/tv/+page.svelte` (classic), `src/routes/match/conquest/[id]/tv/+page.svelte` (T&T), `src/routes/match/risk/[id]/tv/+page.svelte` (Risk 42) — and `src/lib/components/tv/TvCommentary.svelte` start their poll/generation loops with `if (finished || missing || document.hidden) return;`.

## The symptom

During the 2026-09-09 session testing, opening the TV second screen in a background tab left it stuck on "Laden…" forever: `document.hidden` is `true` for any tab that isn't the active one in its window, so polling never runs and no state ever renders. Same guard also means TvCommentary **skips generating/playing** commentary while its tab is hidden (it advances `prevTurnCount` and returns — boundaries crossed in the background are consumed and dropped).

## What to do

- **Testing/automation**: keep the TV tab in the front (make it the active tab) and drive the scorer from the same tab via dispatched `el.click()`s, or use two windows where the TV window stays focused.
- **Real users** are mostly unaffected: Chrome tab-casting keeps the cast tab active. But a TV page opened in a window that loses focus stops updating until refocused — a watch-party edge case worth remembering when reports say "the TV froze".

## Related

- [Commentary pipeline ~25s vs 20s timeout](commentary-pipeline-25s-real-cost-vs-20s-timeout-raise-paral.md) — the other big reliability finding from the same sessions
- [TV cast pages decision](../decisions/tv-mode-url-tab-cast-polling.md) — the 1s polling design these guards implement
- Reports: `docs/in-game-session-testing/`
