---
type: Artifact
title: Board preview & fit-map (docs/risk/fit-map.cjs + board-preview.html)
description: "The generator + eyeball artifact for the [world map → dartboard territory mapping|world map → dartboard territory mapping]] in [[risk-dart"
tags: [risk-darts, trebles-territories, board-mapping]
timestamp: "2026-09-08T22:41:11.321Z"
---

# Board preview & fit-map (docs/risk/fit-map.cjs + board-preview.html)

> **Archived 2026-09-09** — `fit-map.cjs`, `board-preview.html`, and siblings moved to `docs/risk/.archive/`. The mapping they computed is locked into the `MAP` table of `docs/risk/apply-territory-labels.cjs`; the live labeled board is [risk-dart-board-mockup-risk-dart-board-svg](./risk-dart-board-mockup-risk-dart-board-svg.md).

The generator + eyeball artifact for the world map → dartboard territory mapping|world map → dartboard territory mapping](../../decisions/board-mapping-azimuthal-hungarian.md) in [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) (Trebles & Territories).

## What it documents

- [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) — the 40 territory → number-inner/number-outer box assignment the preview renders.
- [trebles-territories-implementation-spec](./trebles-territories-implementation-spec.md) — the spec this mapping feeds into.

## Details

- **Location**: `docs/risk/fit-map.cjs` (generator), `docs/risk/board-preview.html` (output, viewed in browser)
- **Format**: Node script → standalone HTML board preview with the mapping drawn on the dartboard
- **Regenerate**: `node docs/risk/fit-map.cjs`
- **Inputs**: `docs/risk/risk-dart-board.svg` (named territory paths in layer4), `gen-labels.cjs` (40 hand-nudged label positions = territory centroids — the precise data the fit runs on), `centroid.cjs`
- **Method**: azimuthal projection from a grid-searched center (bull = Black Sea, 600×340) → Hungarian algorithm for globally-optimal 40×40 assignment, anchors hard-pinned (Iceland=outer-5, South Africa=outer-3)
- **Tweaks**: pinned overrides are one-line changes in the script; user holds veto rights on specific wedges

## Source

- `docs/risk/fit-map.cjs` — regenerates mapping + preview
- `docs/risk/board-preview.html` — the rendered result to eyeball
- [dart-board-for-map.svg (Risk-mapped dartboard)](./dart-board-for-map-svg-risk-mapped-dartboard.md) — the same mapping patched onto the pristine real-board SVG
