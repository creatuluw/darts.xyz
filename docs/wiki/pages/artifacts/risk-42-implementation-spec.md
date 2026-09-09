---
type: Artifact
title: Risk 42 implementation spec
description: The implementation spec for **Risk 42** — the self-contained HTML design document (built with the html-docs skill) that drives the build. Written 2026-09-09; co
tags: [risk-42, spec, html-docs]
timestamp: "2026-09-09T08:38:19.377Z"
---

# Risk 42 implementation spec

The implementation spec for **Risk 42** — the self-contained HTML design document (built with the html-docs skill) that drives the build. Written 2026-09-09; consolidates every locked ruling from the design sessions into one read-back-veto document, same format as the [Trebles & Territories implementation spec](trebles-territories-implementation-spec.md).

## What it documents

- [Risk 42 (proposed game mode)](../concepts/risk-42-proposed-game-mode.md) — the game itself
- The locked rulings: the Deal (equal split, 2 armies, blanks, players pick starter), two-feeder deposits, mirror combat, Exile & clawback, the Arsenal bulls, continent income, Domination headline + clock alt
- [Two-screen identity decision](../../decisions/risk-42-two-screen-identity-dartboard-to-play-world-map-to-s.md) — scorer = tinted dartboard, TV = world map, avatars on both

## Sections

1. **The Game** — premise (42→40+2, Japan/Madagascar cut, bull = Black Sea), crowd, differentiation table vs T&T
2. **Rules of Play** — every locked ruling as a rule card; the pre-turn dart-budget UI flagged as a hard req
3. **The Board** — full mapping table, artifacts + ids, and the palette build step (layer2 fill shades joined to territories by centroid containment → palette JSON)
4. **Screens & UI** — scorer dartboard with territory-matched tints + avatar chips per box; TV world map with live ownership + avatars, 1s polling, write-through persistence
5. **Implementation** — pure-TS `risk-engine.ts` TDD-first, API sketch, milestones M1–M5 with acceptance criteria
6. **Parked knobs** — bull events, Shanghai feat, sizing, clock values, final name
7. **Read-back** — assumption-lock table (#1–7) for veto, incl. clock continent points and Domination = all-40

## Details

- **Location**: `.specs/risk-42/spec.html`
- **Format**: single self-contained HTML (html-docs skill), opened in browser for review
- **Generated from**: the 2026-09-09 Risk 42 design sessions (decisions already in this wiki) + this session's board/palette extraction work
- Board inputs: [dart-board-for-map.svg](dart-board-for-map-svg-risk-mapped-dartboard.md), `docs/risk/risk-territory-board.svg` (world map for TV), [Risk 42 territory mapping](risk-42-territory-mapping-mapping-json.md)

## Lifecycle

- First added: 2026-09-09 — consolidates the design-decision series into the build-driving spec. Next step: M1 engine, test-first.
