---
type: Decision
title: Real Risk world map on the board — 40 territories via inner/outer boxes, Japan & Madagascar cut
description: Context
tags: [game-mode, risk-darts, map-design, ideation, draft, superseded-by-board-mapping-azimuthal-hungarian]
status: superseded
timestamp: "2026-09-08T22:29:41.423Z"
---

# Real Risk world map on the board — 40 territories via inner/outer boxes, Japan & Madagascar cut

## Context

Ideation pass (continuing the bonuses conversation) translating the **original Risk world map** onto the dartboard. Board model in this thread: 20 wedges × **inner/outer box = 40 territories**, both bulls left **without function for now**. This is a real-map redesign direction relative to the shipped baseline (fictional six continents over single-wedge territories — see [[risk-darts-proposed-game-mode]]); nothing is implemented yet.

## The choice (DRAFT — awaiting veto, "Q5: does this map fly?")

1. **Japan and Madagascar are excluded** (user's cut): the two single-connection island dead-ends of the Risk graph. 42 − 2 = 40 = 20 wedges × 2 boxes, exact fit.
2. **Three structural rules** make the translation honest:
   - Each same-wedge inner/outer pair must be a **genuine Risk adjacency** (two neighboring territories).
   - **Continents occupy contiguous arcs of wedges**, in world order.
   - **Inter-continental bridges become straddle wedges** — inner belongs to one continent, outer to its neighbor. The famous chokepoints land exactly there: **wedge 13 Greenland/Iceland (NA↔EU)** and **wedge 3 Middle East/E.Africa (AS↔AF)**.
3. **Adjacency is declared, not derived**: same-wedge adjacency + the two bridge straddles + neighboring-wedge continuity. Known dishonesties accepted: Oceania↔S.America and Argentina↔Alaska sit adjacent on the circle but not on the map (fake boundaries); Kamchatka↔Alaska is a real Risk adjacency the circle can't honor.

## Draft pairing table

| # | Inner | Outer | Continent |
|---|---|---|---|
| 20 | Alaska | NW Territory | N. America |
| 1 | Alberta | Ontario | N. America |
| 18 | Quebec | Eastern US | N. America |
| 4 | Western US | Central America | N. America |
| 13 | Greenland | Iceland | NA↔EU bridge |
| 6 | Great Britain | Scandinavia | Europe |
| 10 | N. Europe | W. Europe | Europe |
| 15 | S. Europe | Ukraine | Europe |
| 2 | Egypt | N. Africa | Africa |
| 17 | C. Africa | S. Africa | Africa |
| 3 | Middle East | E. Africa | AS↔AF bridge |
| 19 | Afghanistan | China | Asia |
| 7 | Ural | Siberia | Asia |
| 16 | Yakutsk | Kamchatka | Asia |
| 8 | Irkutsk | Mongolia | Asia |
| 11 | India | Siam | Asia |
| 14 | Indonesia | New Guinea | Oceania |
| 9 | W. Australia | E. Australia | Oceania |
| 12 | Venezuela | Peru | S. America |
| 5 | Brazil | Argentina | S. America |

Free bonus from the circle: **Siam → Indonesia** (wedge 11 outer → wedge 14 inner) — the Asia↔Oceania bridge lands on neighboring arcs without effort. Treble/double rings then read as **supply lines into specific territories** (T20 hits Alaska specifically, D20 the NW Territory).

## Alternatives / open knobs

- Inner vs outer orientation per pair (which box gets the easier target) — tune in the spec pass.
- Both bulls functionless "for now" — Bull Altar role undecided in this variant.
- Next topic if the map flies: **continent bonuses**.

## Consequences

If accepted, this replaces the fictional-continent board with the recognizable Risk world (instant legibility for anyone who's played Risk) at the cost of the two fake boundaries above. Status stays **proposed** until the user's veto pass.

> **Superseded** by [[board-mapping-azimuthal-hungarian]] (2026-09-08): optimizer-derived mapping with user anchors Iceland=outer-5 / South Africa=outer-3 replaces this hand-drawn table. Kept for the structural rules and the Japan/Madagascar cut rationale.
