---
type: Learning
title: Risk map SVG layers share a translate(-168,-119) — apply it when extracting paths or labels misalign
description: "While building the Risk 42 TV world map (2026-09-09): `docs/risk/risk-territory-board.svg` puts ALL its content layers (countries, labels, tints) inside groups "
tags: [risk-42, svg, tv, gotcha]
timestamp: "2026-09-09T20:36:58.657Z"
---

# Risk map SVG layers share a translate(-168,-119) — apply it when extracting paths or labels misalign

While building the Risk 42 TV world map (2026-09-09): `docs/risk/risk-territory-board.svg` puts ALL its content layers (countries, labels, tints) inside groups carrying `transform="translate(-167.99651,-118.55507)"`. Extracting layer children WITHOUT applying that transform leaves shapes ~168px right / ~118px down of the viewBox space the label coordinates live in — labels appear systematically up-left of their countries, error largest at top-left, and the map crops right/bottom. Fix: `generate-world-map-asset.cjs` wraps the extracted paths in the shared translate group. Same rule as the layer2-palette learning: read the group transforms, don't just copy the children.
