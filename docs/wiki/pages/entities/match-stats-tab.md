---
type: Entity
title: Match Stats Tab
description: All-players statistics table in the live match UI, plus the leg/match average displays shipped with it.
tags: [frontend, match-ui, stats]
timestamp: "2026-09-07T21:30:13.783Z"
---

# Match Stats Tab

## What is it?

The **Stats tab** in the live match UI (`/match/[id]`), displayed as a sibling tab to **Turns**. It shows a full statistics table for **all players** in the match simultaneously — replacing an earlier "coming soon" placeholder.

## Why it matters?

During a live match, players previously had to wait until a match ended (or visit player profile pages) to compare detailed stats. The Stats tab surfaces every player's performance side by side while the match is still in progress, enabling in-match comparisons and form tracking.

## Details

- **Location**: `src/routes/match/[id]/+page.svelte` (Stats tab panel + tab switcher)
- **Table columns**: rank number, Darts, 3-Dart Avg, Checkout %, Double conversion, 60+/100+/140+/180 counts, <20 counts, 60+ finishes, Last-3-vs-Prior trend
- **Layout**: horizontally scrollable on narrow screens
- **Data source**: computed from the in-memory match state's turns; three-dart averages and other metrics follow `src/lib/game/stats-engine.ts` conventions

### Related average displays shipped together

- **Stats card**: always shows a `Match Avg` row; a `Leg Avg` row appears once a leg has finished (`set > 1 || leg > 1`) — hidden during leg 1 because the two are identical there. A 60+/100+/140+/180 grid sits below.
- **Player cards** (`src/lib/components/ui/PlayerPanel.svelte`): condensed cards (3–6 players) show the leg average in the stats row; full cards (1–2 players) show `Darts · Leg {avg} · Match {avg}` since no stats card exists in that layout.
- **Helper**: `getLegAvg(playerId)` on the match page computes the 3-dart average from the current leg's turns only (vs. match average across all legs).

## Relationships

- [glossary](../../glossary.md) — defines Three-dart average, Checkout, Turn, and related scoring terms
- [overview](../../overview.md) — the match UI and stats subsystem (`src/lib/game/stats-engine.ts`) this tab renders

## Lifecycle

- First added: 2026-09-07 — replaced "coming soon" placeholder with the full all-players table; leg/match averages added to stats card and player cards in the same change.
