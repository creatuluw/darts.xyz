---
type: Decision
title: "Risk 42 TV: full-bleed map with overlay panels pinned to measured-empty margins"
description: Context
tags: [risk-42, tv, layout, overlays]
status: accepted
timestamp: "2026-09-09T21:12:32.449Z"
---

# Risk 42 TV: full-bleed map with overlay panels pinned to measured-empty margins

## Context

The Risk 42 TV view (`src/routes/match/risk/[id]/tv/+page.svelte`) originally rendered the world map at ~877×607 next to a fixed sidebar of stats. The user asked for a way bigger map with all info/data in overlay panels that never block any territory.

## Decision

The world map fills the **entire TvStage** (landmass spans stage x 228–1703 / y 39–1007 of the 1920×1080 canvas; 1560×1080 on a real TV). All UI lives in four overlay panels pinned to stage margins that were measured **empty against live-DOM territory bounds** before designing:

- **Top bar**: RISK 42 · clock (Klok) · turn N · LIVE · copy-link
- **Left**: standings — color dot, name, boxes/armies, score, continent chips, exile state
- **Right**: "Aan de beurt" card — dart pips, dart budget, ⚡ Arsenal charge
- **Bottom**: mechanic hint pill

The winner card stays fullscreen at game over; the TvCommentary subtitle was nudged below the landmass tip (land ends at stage-y ~1007).

## Alternatives considered

- Keep the sidebar layout — rejected: map stays ~877×607, defeats the purpose.
- Shrink/pad the map around fixed panels — rejected: still eats map area; margins-only pinning uses the genuinely empty ocean/edge space instead.

## Consequences

- 2.4× map area; the map is the layout, UI floats on top of it.
- "Never blocks a territory" is a **verifiable invariant, not an eyeball claim**: extract all 40 territory bboxes + the 4 overlay rects from the live DOM and assert 0 intersections (verified 2026-09-09; screenshot in `docs/in-game-session-testing/screenshots/session5/`). Follow the overlay-verification rule whenever either the map or the panels change.
- Extends [[risk-42-two-screen-identity-dartboard-to-play-world-map-to-s]]: the spectate screen is now map-first.
- Report: `docs/in-game-session-testing/2026-09-09-session-5-risk-map-and-commentary.md`.
