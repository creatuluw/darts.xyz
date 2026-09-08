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
- **Data**: REST endpoints under `src/routes/api/matches/[id]/` (legs, turns, players)

## Lifecycle

- First added: with the app's core match flow (setup → live scorer → history)
- Significant changes: 2026-09-07 — dual layout introduced: condensed standings strip for 3–6 players, side scoreboards retained for 1–2 (previously all roster sizes used looping side panels)
- Significant changes: 2026-09-07 — dual layout reversed: standings strip removed, condensed PlayerPanel cards flank the board for 3–6 players too
