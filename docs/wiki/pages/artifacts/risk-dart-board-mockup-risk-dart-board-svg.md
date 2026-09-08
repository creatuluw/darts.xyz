---
type: Artifact
title: Risk dart board mockup (risk-dart-board.svg)
description: "The canonical labeled design board for the Risk-on-a-dartboard redesign: the id-addressable in-game board cloned with all 40 territory names — full names,"
tags: [risk, risk-42, svg, board-map, design-mockup]
timestamp: "2026-09-08T23:05:04.902Z"
---

# Risk dart board mockup (risk-dart-board.svg)

The canonical labeled design board for the Risk-on-a-dartboard redesign: the id-addressable in-game board ([dartboardingame-svg-id-addressable-in-game-board](./dartboardingame-svg-id-addressable-in-game-board.md)) cloned with all 40 territory names from the world map (`risk-board.svg`). One artifact tells the whole story: numbers → score, `seg-*` ids → boxes, labels → territories.

## What it documents

- [board-mapping-azimuthal-hungarian](../../decisions/board-mapping-azimuthal-hungarian.md) — the 40-territory assignment the labels paint onto the real dartboard geometry
- [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) / [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) — the game modes this board informs
- [risk-42-territory-mapping-mapping-json](./risk-42-territory-mapping-mapping-json.md) — the machine-readable mapping (now the `MAP` table inside the regenerator)

## Details

- **Location**: `docs/risk/risk-dart-board.svg` (self-contained)
- **Regenerate**: `node docs/risk/apply-territory-labels.cjs` — reads the clean `DartBoardInGame.svg`, appends 40 `<text id="label-N-inner/outer">` nodes paired 1:1 with the `seg-N-*` path ids (shared naming scheme). Idempotent: rebuilds from the clean base every run, so the design paths/fills/ids are never touched
- **Label styling**: full names, two-line wraps via the script's `LINES` table (no abbreviations — user directive 2026-09-09); **horizontal, unrotated, centered in each box** (`text-anchor=middle` at the wedge mid-angle; inner names r=68, outer r=160), matching the archived `_board-inline.html` reference — 2026-09-09 pivot, see [territory-labels-go-horizontal-centered-in-each-box-no-rotat](../../decisions/territory-labels-go-horizontal-centered-in-each-box-no-rotat.md); white-on-black / dark-on-cream from each box's own fill. Verified: 40/40 labels inside their own radius band + wedge sector
- **Lineage**: supersedes two earlier artifacts, both now in `docs/risk/.archive/` — the world-map-relaid-on-dartboard mockup (old `risk-dart-board.svg`) and `dart-board-for-map.svg`. The filename was reused for this labeled board
- **Editing gotcha**: never hand-edit the output — see [board-svgs-are-generated](../../rules/board-svgs-are-generated.md)

## Source

- `docs/risk/apply-territory-labels.cjs` — generator + locked 40-territory `MAP` table + `LINES` wraps
- `docs/risk/_labeled-render.png` — rendered proof
