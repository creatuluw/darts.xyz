---
type: Learning
title: "Flipped labels: negate radial offset on left half"
description: Gotcha
tags: [svg, risk, labels, docs]
timestamp: "2026-09-08T23:05:56.892Z"
---

> **Superseded (2026-09-09):** labels are no longer radial — they are horizontal and centered in each box. See [territory-labels-go-horizontal-centered-in-each-box-no-rotat](../decisions/territory-labels-go-horizontal-centered-in-each-box-no-rotat.md). Kept for history.

# Flipped labels: negate radial offset on left half

## Gotcha

When placing radially-oriented SVG labels and **flipping the text rotation on the left half** (so nothing reads upside-down), the rotation flip also mirrors the anchor point: keeping the *positive* radial offset (`250 + r`) drops the label onto the **opposite ray** — visually, outside the board on the wrong side.

**Symptom** (observed 2026-09-09 in `docs/risk/apply-territory-labels.cjs`): all 20 left-half territory names rendered outside the board; right-half labels were fine. No error — it looks like a "positioning is off" bug, but it's a sign error.

## Fix

The radial offset must flip **with** the rotation: left-half anchors use `250 − r_in` (inward), right-half keep `250 + r0` (outward). Same bug pattern lives anywhere the labeler math is duplicated (it did in the box-ID script — fix both).

## Verify programmatically, never by eye

For each label, compute the anchor's polar position from its own transform and assert it falls inside its box's radius band (inner 22–115, outer 130–190) **and** its wedge's 18° sector. 40/40 labels checked → 0 misplaced. Eye-checking "looks about right" is exactly how this survived the first pass.

## Related gotchas in the same tooling family

- [[svg-path-parsing-arc-arguments-are-not-points-tokenize-by-co]] — tokenize paths by command, not coordinate-pair regex
- [[wedge-index-from-a-seg-path-s-m-point-needs-a-9-half-wedge-s]] — M point needs the +9° half-wedge shift
- [[risk-board-svg-attribute-order]] — extract attributes element-wise

## Source

- `docs/risk/apply-territory-labels.cjs` — the fixed labeler; `docs/risk/risk-dart-board.svg` is its output
