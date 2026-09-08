---
type: Learning
title: Conquest state is client-side only — nothing for a 2nd screen to poll
description: The fact
tags: [conquest, persistence, sessionstorage, tv-view, architecture]
timestamp: "2026-09-08T20:02:01.435Z"
---

# Conquest state is client-side only — nothing for a 2nd screen to poll

## The fact

The live conquest game (`/match/conquest`) is **entirely client-side** — no API calls, no DB persistence. State lives in `sessionStorage` (the grill-session recon called it "localStorage"; the code uses `sessionStorage` — per-tab, dies with the tab):

- `conquest_setup` — written by the Fun tab on `/match/setup` (`sessionStorage.setItem` in `src/routes/match/setup/+page.svelte`), cleared state key before `goto("/match/conquest")`
- `conquest_state` — the evolving `ConquestState` on the live page (`src/routes/match/conquest/+page.svelte`)

Classic 301/501 matches are the opposite: every turn is persisted through the REST API, which is why a TV/spectator view can poll a classic match "for free."

## Why it matters

Anything that reads conquest state from outside the scorer's tab is currently blocked:

- **2nd TV screen / remote spectators** — nothing to poll; same-browser sync via `storage` events only covers the room and risks two tabs fighting over one key
- **LLM commentary** (spec'd M4) — server-side needs the state
- **Recap video pipeline** — day-after recap needs persisted state
- Refresh-safety: conquest games are not resumable across tabs/devices (classic matches are)

Grill Q8 (open as of this learning) recommends persisting `ConquestState` server-side on every dart — own table or jsonb column on matches — reusing the polling pattern the classic TV view needs anyway.

## Source

- `src/routes/match/conquest/+page.svelte` — `SETUP_KEY`/`STATE_KEY` constants
- `src/routes/match/setup/+page.svelte` — writes `conquest_setup`, clears `conquest_state`
- [[conquest-engine-and-live-game]] — the engine entity (persistence bullet calls this the M3 stopgap)
- [[recap-video-pipeline-trebles-territories]] — downstream feature blocked on this
