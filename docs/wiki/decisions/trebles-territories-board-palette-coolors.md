---
type: Decision
title: Trebles & Territories board palette locked (Coolors 10-color band)
description: Decision
tags: [trebles-and-territories, design, palette, board]
status: accepted
timestamp: "2026-09-07T21:59:16.530Z"
---

# Trebles & Territories board palette locked (Coolors 10-color band)

## Decision

The Trebles & Territories board and UI use the user-supplied Coolors palette (8ecae6 / 219ebc / 126782 / 023047 / ffb703 / fd9e02 / fb8500 / bb3e03 / ae2012 / 9b2226), with shades of those colors where more are needed. Concrete mapping locked in the spec (§04):

- **Continents** (base / dark shade for treble/double rings):
  - Gold Coast {20,18,12} — `#FFB703` / `#D19602`
  - Highgate {16,11,9} — `#8ECAE6` / `#63A9C6`
  - Iron Ridge {19,13,5} — `#BB3E03` / `#933002`
  - The Pass {17,6,2} — `#219EBC` / `#1A7F98`
  - Mercia {15,10,8,7} — `#126782` / `#0E5164`
  - Fourlands {14,4,3,1} — `#3A6787` / `#274A63` — the one off-palette deviation: a *lighter* shade of navy `#023047`, chosen so it stays visible in dark mode
- **Players (example colors in spec):** Ken `#9B2226`, Mel `#023047`, Jo `#FB8500`, Tash `#AE2012`
- **Bull Altar:** navy outer ring + amber core with the †
- **Callouts / duel alerts:** `#AE2012`; dart markers white-on-navy

## Context

The spec's situation boards previously used ad-hoc colors. The user picked a 10-color Coolors palette and asked for it to drive everything: continents, players, altar, callouts, dart markers — "and shades of it if we need more."

## Alternatives

- Keep ad-hoc per-element colors — rejected: no unified identity, harder map readability.
- Use the palette 1:1 with no shades — rejected: dark-mode visibility of navy `#023047` on dark backgrounds fails (hence Fourlands' lighter `#3A6787`), and treble/double rings need darker shades of each continent color for contrast within a wedge.

## Consequences

- Any future board/board-adjacent UI takes colors from this band (or shades of it), not new hues.
- Implementers should read the continent table in `.specs/trebles-and-territories/spec.html` as the source of truth for exact hex pairs.
