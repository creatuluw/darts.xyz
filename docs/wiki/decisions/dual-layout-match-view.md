---
type: Decision
title: "Dual-layout live match view: standings strip for 3+ players"
description: Context
tags: [ui, layout, match, multiplayer]
status: superseded
timestamp: "2026-09-07T20:26:07.120Z"
---

# Dual-layout live match view: standings strip for 3+ players

## Context

The live scorer (`src/routes/match/[id]/+page.svelte`) rendered every roster the same way: tall side-panel scoreboards looping around the center dartboard (e.g. 6 players → 3 left, 3 right). At 3+ players this consumed enormous vertical space, squeezed the board, and buried the current standing. The user asked for a condensed, responsive view for 3–6 players.

## Decision

Branch the live-match layout on roster size (`isMultiGame = players.length > 2`):

- **1–2 players** (and solo mirror): keep the original premium side-scoreboard layout, untouched.
- **3–6 players**: hide the side columns entirely and render a **full-width condensed standings strip** — one row per player with throw-order #, active indicator (▶ + highlighted row + bigger score), remaining score, Sets–Legs won, match 3-dart average, and darts thrown this leg (computed from current-leg turns). Strip header carries `Standings — Set X · Leg Y` plus an inline **Undo last turn** (with confirm) — the delete affordance that lived in the side panels. Below it the board goes full-width but constrained (`max-w-xl md:max-w-2xl mx-auto`) so it stays big while the page stays short. Turns/Stats/Settings tabs render full width; per-player detail for 3+ lives in those tabs, not the strip.

Responsiveness: the strip is a table that scales naturally 3→6 rows, `overflow-x-auto` guards narrow screens, mobile order is standings → board.

## Alternatives considered

- **Shrink the existing side panels** (a `compact` prop with smaller digits): insufficient — still tall and cramped at 5–6 players; the dead `compact` prop was removed from `PlayerPanel.svelte` after this.
- **One layout for all roster sizes**: would force the premium 1v1 scoreboard to compromise for the multi-player case (or vice versa).

## Consequences

- `PlayerPanel` is now only used by the 1–2 player layouts ([[playerpanel]]).
- New player-facing UI for 3+ must be added to the standings strip (or tabs), not to side panels — see [[never-hardcode-player-slots-in-match-ui]] and the 6-player roster cap decision.
- Two code paths to keep in sync on the match page; the branch is one derived value, so the risk is contained.
