---
type: Learning
title: "TV commentary hangs on one segment: audio events never fire in throttled windows — race every segment against a reading-time cap"
description: "Discovered during the 2026-09-09/10 prod playtest campaign (session 6): the TV commentary broadcast could hang forever on ONE segment. Root cause chain:"
tags: [commentary, tv, audio, throttling, gotcha]
timestamp: "2026-09-09T21:52:29.607Z"
---

# TV commentary hangs on one segment: audio events never fire in throttled windows — race every segment against a reading-time cap

Discovered during the 2026-09-09/10 prod playtest campaign (session 6): the TV commentary broadcast could hang forever on ONE segment. Root cause chain:

1. `Audio.play()` in a **throttled/hidden browser window** can stay PENDING without rejecting (Chrome blocks audio silently in background windows — the `.catch(autoplay blocked)` fallback never runs), and `onended`/`onerror` never fire → the segment promise never resolves → the whole 4-segment broadcast pins on one subtitle and `inFlight` stays true. This is why the host→spectator→analyst flow was invisible to the user.
2. Related: CDP `Page.bringToFront` activates a TAB but does not unhide the page if the OS window itself is backgrounded — `document.hidden` stays true and the TV's polling/boundary effects sleep. Workaround during testing: `Object.defineProperty(document, 'hidden', { get: () => false, configurable: true })`.

Fixes shipped (commit 1cf0d05): every segment resolves at `min(audio end, ~reading time)` (3500ms + 90ms/char, cap 30s) — `setTimeout` caps are the only reliable timer in throttled tabs; the subtitle-only fallback uses the same estimate instead of a flat 4s. Lesson: never gate a media pipeline purely on media element events — always race them against a wall-clock cap.
