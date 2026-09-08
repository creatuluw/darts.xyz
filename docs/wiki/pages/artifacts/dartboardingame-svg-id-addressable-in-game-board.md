---
type: Artifact
title: DartBoardInGame.svg (id-addressable in-game board)
description: A wedge-by-wedge export of the production dartboard geometry (`Dartboard.svelte`), rebuilt with self-explanatory, collision-free element ids — the board the Ris
tags: [risk-42, svg, dartboard]
timestamp: "2026-09-08T23:00:13.985Z"
---

# DartBoardInGame.svg (id-addressable in-game board)

A wedge-by-wedge export of the production dartboard geometry (`Dartboard.svelte`), rebuilt with self-explanatory, collision-free element ids — the board the Risk 42 game view will paint ownership onto.

## What it documents

- [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) — the in-game board rendering: territory/ownership state targets segments directly by id (`#seg-20-inner`), no path-matching heuristics.
- [risk-42-territory-mapping-mapping-json](./risk-42-territory-mapping-mapping-json.md) — the ids line up 1:1 with mapping.json keys, so the mapping and the SVG speak the same element vocabulary.
- [dart-board-for-map-svg-risk-mapped-dartboard](./dart-board-for-map-svg-risk-mapped-dartboard.md) — the static, continent-colored schematic sibling; this file is the clean geometric base.

## Details

- **Location**: `docs/risk/DartBoardInGame.svg`
- **Id scheme**: `<g id="wedge-N">` wrapping `seg-N-double` / `seg-N-outer` / `seg-N-treble` / `seg-N-inner` plus `num-N` text; center is `bull-25` (green, r22) and `bull-50` (red, r10); decoration ids `bg-number-ring`, `bg-wire-outer`, `rim`. 125 unique ids, zero collisions.
- **Generated from**: `docs/risk/gen-dartboard-svg.cjs` (archived 2026-09-09) — a direct port of `Dartboard.svelte`'s constants (`NUMBERS`, `R`, `COL`, `annularSector`). One source of truth in code: if the component changes, rerun the generator and the SVG follows. This file is now the maintained clean base for `apply-territory-labels.cjs`.
- **Verified**: all 80 box paths geometrically identical to `dart-board-orig.svg` and the live production board export.
