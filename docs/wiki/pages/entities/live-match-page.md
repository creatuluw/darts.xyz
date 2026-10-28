---
type: Entity
title: Live Match Page
description: What is it?
tags: [ui, route, match, layout]
timestamp: "2026-09-07T20:26:39.790Z"
---

# Live Match Page

## What is it?

The live in-game scorer for a match — the app's flagship page. Renders the dartboard, score entry, player scoreboards, and the Turns/Stats/Settings tabs, driving the match state machine in real time.

## Why it matters

Every dart thrown flows through this page. Its layout branches on roster size, and future edits to scoring UI almost always land here.

## Details

- **Location**: `src/routes/match/[id]/+page.svelte`
- **Interface**: tabs `board` / `turns` / `stats` / `settings`; header shows `Set X · Leg Y` and Abandon; completed-match overlay with winner + link to `/history/[id]`
- **Configuration**: `isSoloGame` (players.length === 1, muted mirror panel), `isMultiGame` (players.length > 2 → condensed panels)
- **Layouts** (see the cards-around-the-board decision — side columns render for **every** player count):
    - **1–2 players**: 3-column bento grid — full-size [playerpanel](./playerpanel.md) scoreboards in side columns around the center board; solo adds a muted mirror
    - **3–6 players**: same bento grid with **condensed** PlayerPanel cards — first half of players stacked left, second half right, board/input centered (`col-span-6`); e.g. 6 players = 3+3, 3 players = 2+1. Cards stack taller as count grows; mobile order stays players → board
- **Data**: REST endpoints under `src/routes/api/matches/[id]/` (legs, [turns API](./turns-api-matches-id-turns.md), players)
- **State loading**: the entire onMount body (fetch match → legs → turns → rebuild `matchState`/`allMatchTurns`/stats) lives in `async function loadMatch()` (since 2026-10-28) — the exact refresh-resume path, re-run after a turn edit so remaining scores, throw order, averages and checkout suggestions are re-derived from the persisted turns
- **Edit last turn (2026-10-28)**: pencil icon on [playerpanel](./playerpanel.md) opens an in-page edit dialog (numpad-style segment × multiplier entry, 3 slots pre-filled from the stored darts); Save PATCHes the [turns API](./turns-api-matches-id-turns.md), then calls `loadMatch()` to rebuild from state. Edits that would check out are blocked client-side (shared scoring-engine preview) and rejected server-side

## Lifecycle

- First added: with the app's core match flow (setup → live scorer → history)
- Significant changes: 2026-09-07 — dual layout introduced: condensed standings strip for 3–6 players, side scoreboards retained for 1–2 (previously all roster sizes used looping side panels)
- Significant changes: 2026-09-07 — dual layout reversed: standings strip removed, condensed PlayerPanel cards flank the board for 3–6 players too
- Significant changes: 2026-10-28 — onMount loader extracted to `loadMatch()`; pencil edit-last-turn dialog added (PATCH turns + full state rebuild)
