---
type: Artifact
title: Trebles & Territories implementation spec
description: The implementation spec for **Trebles and Territories** — the self-contained HTML design document (built with the html-docs skill) that drives the build. Contai
tags: [spec, artifact, trebles-and-territories]
timestamp: "2026-09-07T21:48:53.331Z"
---

# Trebles & Territories implementation spec

The implementation spec for **Trebles and Territories** — the self-contained HTML design document (built with the html-docs skill) that drives the build. Contains the game rules, match presets, examples of play, the LLM commentary spec, and the recap-video feature.

## What it documents

- [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) — the game mode this spec implements
- **Match presets**: 51 / 101 / 151 / … / 1501 — thirty x01 numbers in steps of 50 (the only selectable start scores; **301 is the default**), each with turn counts and 2p/3p/4p/6p **estimated play-durations** so players can pick a game length up front (51 @ 4p ≈ 35 min). Re-banded per the [preset-ladder decision](../../decisions/preset-ladder-51-1501-steps-of-50.md); supersedes the earlier 201→5001 ladder.
- **Board palette**: the [Coolors 10-color band decision](../../decisions/trebles-territories-board-palette-coolors.md) mapped onto continents (base + dark treble/double-ring shades), players, the altar, callouts, and dart markers (§04).
- **Examples of play / state boards**: interactive SVG dartboard situation boards — continent colors, player initials, HP pips, option callouts, altar-duel overlay (§04).
- [llm-commentary-trebles-territories](../entities/llm-commentary-trebles-territories.md) — the commentary spec (§05): GLM-5.3-Flash persona, cadence, sample feed, stinger mapping.
- [recap-video-pipeline-trebles-territories](../entities/recap-video-pipeline-trebles-territories.md) — the day-after recap video feature (§07): cron → GLM script → HyperFrames render → emailed links.

## Details

- **Format**: standalone interactive HTML (html-docs skill template), opened in the browser for review.
- **Location**: `.specs/trebles-and-territories/spec.html`

## Lifecycle

- First added: authored in the spec turn; the user reviews it before implementation proceeds ("wait for next steps").
- §07 Recap Videos added later as a separate feature at user request.
