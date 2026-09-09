---
type: Learning
title: "Patching board SVGs: replace existing attributes, never append duplicates"
description: Gotcha
timestamp: "2026-09-08T22:49:24.078Z"
---

# Patching board SVGs: replace existing attributes, never append duplicates

## Gotcha

While patching the gold stroke onto anchor seg paths in `dart-board-for-map.svg`, appending a second `stroke-width="2.5"` to a `<path>` that **already carried** `stroke-width` produced invalid XML (duplicate attribute). The browser flags an **XML parse error** and renders only the prefix before the malformed element — the board cut off at wedge 5 with the rest of the file silently dropped.

## Fix

Replace the existing attribute in place instead of appending:

```js
out.replace(/stroke="#A9B1B2"/, 'stroke="#FFD700"').replace(/stroke-width="[\d.]+"/, 'stroke-width="2.5"')
```

## Rule

When string-patching SVG elements, replace named attributes; check the pristine source (here `dart-board-orig.svg`) for attributes it already sets. Same script-editing surface as [[risk-board-svg-attribute-order]] (order-mixing gotcha).
