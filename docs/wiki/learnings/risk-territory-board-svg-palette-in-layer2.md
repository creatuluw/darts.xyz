---
type: Learning
title: "risk-territory-board.svg palette: fills live in layer2, join to territories by centroid containment"
description: The world map for the Risk 42 TV view (`docs/risk/risk-territory-board.svg`, a copy of `risk-board.svg`) carries its **per-territory tints in the `layer2` fill 
tags: [risk-42, svg, palette]
timestamp: "2026-09-09T08:38:19.377Z"
---

# risk-territory-board.svg palette: fills live in layer2, join to territories by centroid containment

The world map for the Risk 42 TV view (`docs/risk/risk-territory-board.svg`, a copy of `risk-board.svg`) carries its **per-territory tints in the `layer2` fill paths — generic element ids, 35 fill-paths, 22 shades** — NOT in the `layer4` layer that holds the named territory outlines. Searching the named-outline layer for fills finds nothing; the color data is structurally decoupled from the names.

Regex extraction over these paths also fails on attribute order (see [Risk board SVGs: attribute order varies](risk-board-svg-attribute-order.md)) — parse element-wise.

**Therefore:** the exact territory↔fill pairing must be a build-time join, not a hand extraction — compute each named outline's centroid from `layer4`, match fills by containment, emit a palette JSON. This is specced as an M2 step in the [Risk 42 implementation spec](../pages/artifacts/risk-42-implementation-spec.md) so the dartboard segment tints match the map exactly.
