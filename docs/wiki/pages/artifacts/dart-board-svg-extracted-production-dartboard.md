---
type: Artifact
title: dart-board.svg (extracted production dartboard)
description: "A clean, static SVG of the standard dartboard extracted directly from the live scorer's rendered `Dartboard.svelte` output on a production match page (https://w"
tags: [risk-darts, asset, svg, dartboard]
timestamp: "2026-09-08T22:41:12.558Z"
---

# dart-board.svg (extracted production dartboard)

> **Archived 2026-09-09** — moved to `docs/risk/.archive/dart-board.svg`. The clean-base role is now served by [dartboardingame-svg-id-addressable-in-game-board](./dartboardingame-svg-id-addressable-in-game-board.md) (`DartBoardInGame.svg`).

A clean, static SVG of the standard dartboard extracted directly from the live scorer's rendered `Dartboard.svelte` output on a production match page (https://www.dart.monster/match/...).

## What it documents

- [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) — serves as the geometric ground truth for the Risk/Trebles & Territories design work in `docs/risk/`
- `src/lib/components/ui/Dartboard.svelte` — the component this asset was lifted from

## Details

- **Location**: `docs/risk/dart-board.svg`
- **Format**: standalone SVG, 31 KB, `viewBox="0 0 500 500"` with `width/height="100%"` (responsive, like the risk board)
- **Contents**: 80 path segments (20 sectors × double/treble/single-inner/single-outer rings), bull + outer bull, 5 circles, number ring 20…5
- **Generated from**: browser-evaluated serialized markup of the rendered board on a live match page; stripped Svelte scoping classes, `cursor: pointer`, inline transform/transition styles, and `<!---->` comment anchors so it is a clean static asset
- Distinct from `Risk_board.svg` / `risk-dart-board.svg` in the same folder (risk-mode board designs); this one is the **unmodified production board geometry**
