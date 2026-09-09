---
type: Learning
title: "SVG path parsing: arc arguments are not points — tokenize by command, never by coordinate-pair regex"
description: Gotcha
tags: [svg, risk, regex, docs]
timestamp: "2026-09-08T22:55:33.285Z"
---

# SVG path parsing: arc arguments are not points — tokenize by command, never by coordinate-pair regex

## Gotcha

Parsing an SVG path's `d` attribute with an "all coordinate pairs" regex (e.g. matching every `\d+ \d+` pair) silently treats **arc command arguments as geometry points**. An `A 207 207 0 0 1 x y` contributes its radii (207 207), rotation (0), and flags (0 1) as fake points clustered near the bottom-left origin.

**Symptom** (observed 2026-09-08 in the box-label placement pass of `apply-mapping.cjs`): every wedge's mean point dragged toward bottom-left → wedge/box detection collapsed onto the left half of the board → labels landed on the wrong boxes. No error thrown; only visual check caught it.

## Fix

Tokenize by **command**, not by coordinates — only M/L points and the **endpoint** (last pair) of each A command are geometry:

```js
const tok = d.match(/[MLAZmlaz]|-?\d+(?:\.\d+)?/g) || [];
// M/L → take both numbers; A → skip rx ry rot laf sf, take endpoint; Z → nothing
```

As shipped in `docs/risk/apply-mapping.cjs:45-50`. Note the arc midpoint is NOT on the arc — bucketing by the M point or the endpoints, not an arc "center".

## Related gotchas in the same tooling family

- [[wedge-index-from-a-seg-path-s-m-point-needs-a-9]] — M point sits on the CCW wedge edge; shift +9° before rounding
- [[risk-board-svg-attribute-order]] — attribute order varies; extract element-wise, not by regex lookahead
- [[dartboard-svg-paths-encode-box-identity-read]] — box identity (number, ring) readable from radii + mid-angle

## Source

- `docs/risk/apply-mapping.cjs` — the tokenizer + box-label placement that depends on it
