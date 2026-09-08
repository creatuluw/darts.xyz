---
type: Artifact
title: Risk 42 territory mapping (mapping.json)
description: "Canonical machine-readable game data for [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md): every one of the 40 numbered boxes mapped to `"
tags: [risk, risk-42, mapping, game-data, json]
timestamp: "2026-09-08T22:51:10.838Z"
---

# Risk 42 territory mapping (mapping.json)

Canonical machine-readable game data for [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md): every one of the 40 numbered boxes mapped to `{number, ring}`, plus the army-deposit rules, in one lookup table.

## What it documents

- [risk-42-base-mechanic-two-feeder-deposits](../../decisions/risk-42-base-mechanic-two-feeder-deposits.md) — the deposit rules it encodes: `S → 1 army in the hit box, D → 2 in the outer box, T → 2 in the inner box`; bulls are `null` (parked on Q4)
- [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) — the game mode this data will drive; the intended contract is that clicking a box in-game resolves score AND territory from this single lookup
- [risk-dart-board-mockup-risk-dart-board-svg](./risk-dart-board-mockup-risk-dart-board-svg.md) — the earlier design mockup of the same board

## Details

- **Location**: `docs/risk/.archive/mapping.json` (archived 2026-09-09) — the locked mapping now lives as the `MAP` table in `docs/risk/apply-territory-labels.cjs`, the single regenerator for the current board
- **Format**: JSON — one entry per territory `{number, ring}` + deposit-rule map; bulls `null` = TBD
- **Status**: canonical but awaiting the user's Q6 veto on the mapping itself
- **Regenerate** (historical): `node docs/risk/apply-mapping.cjs` *(archived)* — current regen: `node docs/risk/apply-territory-labels.cjs`, reads `DartBoardInGame.svg`, writes the labeled `risk-dart-board.svg`
- **Labeled board sibling**: `dart-board-for-map.svg` carries all 40 territory labels, radially oriented (flipped on the left half so nothing reads upside-down) and multi-line: full names split word-per-line via the script's `LINES` map — no abbreviations (user directive 2026-09-09). Label color is derived from each box's own fill — white on black single boxes, dark on cream boxes — because SVG text defaults to black fill and vanishes on the black boxes. Verified 40/40 against the locked territory table; fills unchanged (labels-only pass, byte-checked)

## Source

- Design conversation 2026-09-09 — labels-only pass requested; mapping data extracted from the board paths' own geometry (radii → ring, mid-angle → number)
