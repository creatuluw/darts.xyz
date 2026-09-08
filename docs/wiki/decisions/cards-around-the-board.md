---
type: Decision
title: Cards around the board for all roster sizes (condensed panels for 3–6)
description: Decision
tags: [ui, layout, match, playerpanel]
status: accepted
supersedes: "dual-layout-match-view"
timestamp: "2026-09-07T20:26:58.632Z"
---

# Cards around the board for all roster sizes (condensed panels for 3–6)

## Decision

Every roster size (1–6 players) gets **player cards flanking the board**. For 3–6 players, `PlayerPanel` renders in a new **condensed mode** (single compact card: name + active ▶ indicator, undo-delete control with inline confirm, large remaining score — emerald when active, and one bottom row `S sets · L legs · Avg match-3-dart · Darts this-leg`). Players are split: first half stacked in the left column, second half in the right, board/input centered (`col-span-6`) — e.g. 6 players = 3+3, 3 players = 2+1. The full-width standings strip is removed entirely.

## Context

The dual-layout redesign (superseded) gave 3–6 players a full-width standings strip and cards only to 1–2 players. The user explicitly wanted the card-around-the-board layout preserved for all multi-player matches ("i do want to keep the cards around the board for all 3-6 matches"). Rather than full-size cards (too tall for 3–6 stacked per side), a condensed variant keeps the flanking geometry at any roster size.

## Alternatives considered

- **Keep the standings strip** (previous approach) — rejected by user preference; cards around the board read better and stay consistent across roster sizes.
- **Full-size PlayerPanel cards for 3–6** — too tall when 3 cards must stack per side; condensed mode fits.
- **Hybrid (strip + cards)** — duplicate info, redundant once condensed cards carry S/L/avg/darts.

## Consequences

- One component (`PlayerPanel`) covers all layouts via a `condensed` flag; the standings strip markup is deleted.
- 1–2 player layouts unchanged (full-size cards, solo mirror intact); mobile order stays players → board.
- Undo-last-turn remains available in condensed cards (inline confirm), not lost with the strip.
