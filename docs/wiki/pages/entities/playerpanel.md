---
type: Entity
title: PlayerPanel
description: "A reusable scoreboard panel component for the live match scorer, rendered around the board for every roster size (full-size for 1–2 players, condensed cards for 3–6)."
tags: [ui, component, match, scoreboard]
timestamp: "2026-09-07T20:26:39.790Z"
---

# PlayerPanel

A reusable scoreboard panel component for the live match scorer, extracted from two ~300-line identical hardcoded player blocks (`players[0]` left / `players[1]` right) that left players 3–6 with no scoreboard at all. Now renders for every roster size.

## Details

- **Location**: `src/lib/components/ui/PlayerPanel.svelte` (exported from the UI barrel)
- **Interface**: props for a single player's scoreboard + stats + last-3-turns block + undo/delete affordance (`showDeleteConfirm`, `onDeleteLastTurn`); a `condensed` mode renders a single compact card instead — name + active ▶ indicator, undo control with inline confirm, large remaining score (emerald when active), one bottom row `S sets · L legs · Avg match-3-dart · Darts this-leg`
- **Used by**: [live-match-page](./live-match-page.md) — all layouts: full-size in the 1–2 player side columns (solo mirror is separate inline markup), condensed in the 3–6 player side columns (see the cards-around-the-board decision)

## Lifecycle

- First added: created when the live scorer was made player-count-generic (any roster size up to 6 rendered fully). The match engine and turn rotation were already generic; only the UI hardcoded slots.
- Significant changes: 2026-09-07 — scoped to 1–2 player layouts when the dual-layout redesign moved 3–6 players to the standings strip; dead `compact` prop removed.
- Significant changes: 2026-09-07 — dual layout reversed: condensed mode added, standings strip removed; panels flank the board for all 1–6 players again.
