---
type: Learning
title: Wedge index from a seg path's M point needs a +9° half-wedge shift
description: Gotcha
tags: [true]
timestamp: "2026-09-08T22:49:24.078Z"
---

# Wedge index from a seg path's M point needs a +9° half-wedge shift

## Gotcha

In `docs/risk/dart-board-orig.svg`, each wedge segment path's `M` point sits exactly **on the CCW wedge boundary** (±9° from wedge center). Deriving the wedge index with naive `Math.round(brg / 18)` therefore lands on exactly ±0.5, and float noise rounds it either way — `brg=27` flipped between wedges across runs.

**Symptom**: continent territory counts off by one (10 amber fills vs 9 NA territories; 10 teal fills vs 11 Asia) — one territory silently migrating wedges, no error thrown.

## Fix

Offset by the half-wedge so the boundary lands exactly on an integer before rounding (as shipped in `fit-map.cjs`):

```js
const wi = Math.round(((brg + 9) % 360) / 18) % 20; // M point sits on the CCW wedge edge
```

## Rule of thumb

When bucketing an angle (or any float) by rounding, never let the sample sit on a bucket edge — shift by the half-bucket first.
