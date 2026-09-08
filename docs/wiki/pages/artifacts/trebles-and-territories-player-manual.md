---
type: Artifact
title: Trebles and Territories player manual
description: Player-facing rules-only HTML manual distilling the Trebles and Territories implementation spec into 7 short Dutch sections.
tags: [trebles-and-territories, manual, player-docs, docs]
timestamp: "2026-09-07T22:18:20.240Z"
---

# Trebles and Territories player manual

A single self-contained HTML player manual for [Trebles and Territories game mode](../concepts/risk-darts-proposed-game-mode.md) — the "uber simple" rules-only distillation of the full [implementation spec](./trebles-territories-implementation-spec.md), created 2026-09-08 at the user's request; rewritten in Dutch and condensed (8 → 7 sections) the same day at the user's request.

## What it documents

- [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) — everything a player needs to play: the Risk-on-a-dartboard pitch, the 6 continents, dart effects, Shanghai, death/resurrection, scoring, match length, tactics
- Deliberately EXCLUDES all implementation/API/milestone content from the spec — player rules only

## Details

- **Location**: `docs/trebles-and-territories-manual.html` (English original kept as `docs/trebles-and-territories-manual - Copy.html`)
- **Format**: standalone HTML (no dependencies, works offline), **in Dutch**, 7 sections with a pill TOC: Het idee → Het bord → Wat je pijl doet → Dood & het altaar → Winnen → Lengte → Tips. Shanghai is folded into a tip-card inside "Wat je pijl doet" instead of being its own section.
- **Design simplifications vs the spec**: the whole game is learnable from one table ("What Your Dart Does"); the ~30 match presets are condensed to 4 named bands (Skirmish / The War ★ 301 default / Campaign / Epic) with time estimates; commentator/recap internals omitted (they happen TO players, not BY them)
- **Presentation**: Claude-orange light+dark theme via `prefers-color-scheme`, phone-readable at the oche, print-friendly (`@media print` hides TOC)

## Source

- Generated from `.specs/trebles-and-territories/spec.html`; originally 8 cards mapping 1:1 to spec sections, now 7 condensed Dutch cards

## Relationships

- [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) — the game this manual teaches
- [trebles-territories-implementation-spec](./trebles-territories-implementation-spec.md) — the full spec this manual distills (player-facing view vs builder-facing view)
