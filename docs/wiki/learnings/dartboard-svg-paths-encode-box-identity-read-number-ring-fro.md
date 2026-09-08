---
type: Learning
title: Dartboard SVG paths encode box identity — read (number, ring) from geometry, don't hand-map
description: The fact
tags: [risk-darts, trebles-territories, board-mapping, svg]
timestamp: "2026-09-08T22:49:45.408Z"
---

# Dartboard SVG paths encode box identity — read (number, ring) from geometry, don't hand-map

## The fact

Each `<path>` in the dartboard SVG **is** a specific (number, ring) box — its identity is readable directly from its own geometry:

- **Ring** (inner/treble vs outer/double vs singles) from the path's radial extent.
- **Number wedge** (1–20) from its mid-angle against the standard wedge layout.

No fuzzy runtime angle math, no hand-maintained lookup table needed.

## Why it matters

The Trebles & Territories game needs click → exact score → territory → deposit. The canonical mapping pipeline exploits this: a script reads box identity straight from the SVG geometry, joins it with the locked fit table (the Hungarian assignment from [[board-mapping-azimuthal-hungarian]], see [[board-preview-and-fit-map]]), patches the board, and emits a game-facing `mapping.json`. The SVG's own geometry is the source of truth for *what each box is*; the fit table only decides *which territory occupies it*.

## Rule of thumb

If the board SVG changes (paths added/reordered), regenerate the mapping from geometry — never hand-edit `mapping.json` or re-derive wedges by angle math at runtime.
