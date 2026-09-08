---
type: Decision
title: World map → dartboard mapping via azimuthal projection + Hungarian assignment (bull = Black Sea)
description: Azimuthal + Hungarian fit replaces the hand-drawn world-map draft; bull = Black Sea, inner = Old World core, outer = frontier
tags: [risk-darts, trebles-territories, board-mapping]
status: proposed
timestamp: "2026-09-08T22:41:06.269Z"
---

# World map → dartboard mapping via azimuthal projection + Hungarian assignment (bull = Black Sea)

## Context

[[risk-darts-proposed-game-mode]] needs its 40 world-map territories assigned to the 40 dartboard boxes (one inner + one outer per number wedge, 1–20), with two user-pinned anchors: **Iceland = outer-5**, **South Africa = outer-3**. Source geometry: `docs/risk/risk-dart-board.svg` (named territory paths) and `gen-labels.cjs` (40 hand-nudged label positions = territory centroids).

## Approaches tried and rejected

1. **Rigid two-anchor similarity transform** — overflows badly. The world map is wide, a dartboard is circular: Alaska lands at radius 13 vs outer ring at 6; Southern Europe dragged 133° off.
2. **Greedy cost optimizer** — can't guarantee anchors; drifts (W Europe 59° off).
3. **Local search / swap loops** — corrupts state during iteration (duplicated territories across wedges) and gets stuck in minima (Americas shredded across 5 wedges). Also a design trap: the optimizer parked the center *on top of Southern Europe*, where bearings are meaningless noise.

## The choice

**Azimuthal projection** (angle = true bearing from a center; radius = compressed map distance), then a **Hungarian algorithm** assignment (globally optimal for the 40×40 problem) with joint cost = angular deviation to wedge center + radial-rank mismatch. Anchors hard-pinned; center kept ≥50 units from every region; angular cost weighted by distance.

- **Optimal center: (600, 340) — the Black Sea is the bull.**
- **Inner ring = the Old World core** (Europe, Middle East, N Africa, interior Asia); **outer ring = the frontier** (Alaska, Kamchatka, Australia, Argentina, Greenland). The supply-line rule reads: *trebles feed the homeland, doubles feed the frontier.*

Regenerable via `node docs/risk/fit-map.cjs` ([[board-preview-and-fit-map]]); overrides are one-line pins.

## Known compromises (the geometry tax)

1. **Greenland lands inner-5** — forced by the Iceland=outer-5 pin, though Greenland is farther from the bull. One deliberate rank inversion.
2. **N Europe (47°) & S Europe (57°) angular deviation** — both hug the bull where compass directions are noise; they fill inner gaps.
3. **South America splits around Africa's arc** (Argentina-19, Brazil-7, Venezuela/Peru-16).

## Status

Draft presented to the user as **accept-with-veto-rights**: swap any named wedge manually; the script takes pinned overrides. Next mechanic-stack questions once blessed: continent bonuses, game end, the bulls.

## Rationale

For a 40×40 assignment with anchors, local search provably stalls; the Hungarian algorithm is the standard globally-optimal tool. The azimuthal projection is the only projection family that maps a wide map onto a circle while preserving the "core lands inner, frontier lands outer" semantic.

## Supersedes

- [[real-risk-world-map-draft]] — the earlier hand-drawn pairing table (Iceland=outer-13, no bull). The user re-pinned Iceland=outer-5 and asked for the closest possible geometric fit; this optimizer-derived mapping replaces that draft. The structural honesty rules of that draft (wedge-pair adjacency, continent arcs, straddle bridges) remain the lens for judging this fit.
