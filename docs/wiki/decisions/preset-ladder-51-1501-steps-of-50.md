---
type: Decision
title: Preset ladder re-banded to 51–1501 in steps of 50 (301 default)
description: Decision
tags: [trebles-and-territories, presets, match-setup, spec]
status: accepted
supersedes: "[]"
timestamp: "2026-09-07T21:59:16.529Z"
---

# Preset ladder re-banded to 51–1501 in steps of 50 (301 default)

## Decision

The selectable start scores for Trebles & Territories are **51 / 101 / 151 / 201 / … / 1501** — thirty classic x01 numbers in steps of 50. **301 remains the highlighted default.** Each preset carries estimated turn counts and 2p/3p/4p/6p durations (~30 s per 3-dart turn, app-scored). The §06 engine type was updated to match.

## Context

The spec turn had fixed a 10-entry ladder (201 / 301 / 501 / 701 / 1001 / 1301 / 1501 / 2001 / 3001 / 5001). The user asked for "51/101/151/201/251/301/etc until 1501" — a denser, smoother ladder ending at 1501.

## Alternatives

- Keep the old 10-entry ladder — rejected by user request; sparse at the short end and open-ended at the long end.
- Steps smaller than 50 — rejected: would produce non-classic numbers (x01 convention needs …1 endings); 50 steps land on classic values throughout.

## Consequences

- **51 @ 4 players ≈ 35 minutes** — a real weeknight skirmish now exists at the bottom of the band (this was a welcome side effect, not the driver).
- 2001+ marathon games are gone from the presets; the band tops out at 1501.
- These thirty are the *only* selectable start scores; the wiki pages documenting the old ladder were updated.
