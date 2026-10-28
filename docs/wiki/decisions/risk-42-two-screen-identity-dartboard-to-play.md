---
type: Decision
title: "Risk 42 two-screen identity: dartboard to play, world map to spectate"
description: Context
tags: [risk-42, ui, tv-mode, avatars]
status: accepted
timestamp: "2026-09-09T08:38:19.377Z"
---

# Risk 42 two-screen identity: dartboard to play, world map to spectate

## Context

Risk 42 needs a scorer screen and a TV/second screen, same as T&T's TV mode precedent (URL + tab-cast + 1s polling + public-by-link). The repo already has the two boards: the id-addressable labeled dartboard (`docs/risk/risk-dart-board.svg`, cloned from `DartBoardInGame.svg` with all 40 territory labels) and the classic world map (`docs/risk/risk-territory-board.svg`). The user locked the screen assignment and the visual join between the two.

## Decision

- **Scorer screen = the dartboard.** Every inner/outer segment tinted **the same color as its territory on the world map** (`risk-dart-board.svg` look), so the board you throw at reads like the map.
- **TV/second screen = the world map** (`risk-territory-board.svg`): live ownership tints, **small avatar chips (player color + initials/emoji) per territory**, current-player highlight, continent highlights. 1s polling, write-through persistence (per [[conquest-state-server-persisted]] precedent).
- **Avatars on BOTH screens** — small ownership chips on the dartboard boxes and on the map territories.
- Hard requirement carried into the spec: **pre-turn dart-budget UI** on the scorer (continent income shown before the throw).

## Alternatives considered

- Dartboard-only UI (no map screen) — ownership at a glance is unreadable on wedges alone.
- Separate color scheme per screen — breaks cross-screen recognition; matching tints are the whole point.
- Text-only ownership labels instead of avatar chips — rejected for glanceability on TV.

## Consequences

- M2 build step: territory↔fill **palette JSON** computed by centroid containment (fill shades live in layer2 of the world map, named outlines in layer4 — see the risk-territory-board palette learning). Generated, never hand-mapped.
- Players need a compact visual identity (color + initials/emoji) available to the avatar chips.

Source: [Risk 42 implementation spec](../pages/artifacts/risk-42-implementation-spec.md), Screens & UI section.
