---
type: Decision
title: "Interview questions: per-player 1–2 curated options, randomly surfaced"
description: "Interview questions: per-player 1–2 curated options, randomly surfaced"
tags: [conquest, interviews, trebles-and-territories, game-design]
status: accepted
timestamp: "2026-09-08T20:11:16.954Z"
---

# Interview questions: per-player 1–2 curated options, randomly surfaced

# Interview questions: per-player 1–2 curated options, randomly surfaced

## Context

Mid-grill (2026-09-08, interview round 2) for the planned spectator-interview feature in Trebles & Territories: LLM-generated mid-game interviews (commentator asks, a random spectator persona answers) in Dutch, voiced and subtitled on the TV second screen. Q13 asked what the question pool looks like. User settled it: "for each player a random 1–2 options that make sense or heat up the game."

## Decision

- The question pool is **per-player and curated**: each player gets **1–2 interview options**, filtered to be either **sensible** (make sense for that player/game state) or **dramatic** (heat up the game).
- At interview time the feature **randomly surfaces** one of the player's options.
- Questions are **conquest-focused**.

## Alternatives considered

- LLM free-form question generation — implicitly rejected by the settlement: a small authored pool keeps questions on-brand, game-relevant, and safely dramatic rather than randomly offensive.

## Consequences

- Curating per-player options is authoring work, but bounded (1–2 per player).
- The "heat up the game" category gives the vox-pop format its drama lever.
- See [[spectator-interviews-trebles-territories]] for the full feature; Q14 (voice engine) was still open at settlement time.
