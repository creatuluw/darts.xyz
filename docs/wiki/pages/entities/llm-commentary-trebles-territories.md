---
type: Entity
title: LLM Commentary (Trebles & Territories)
description: "The in-game AI commentary feed for [[risk-darts-proposed-game-mode|Trebles & Territories]]: an LLM writes a commentary blurb **every 2 turns**, rendered in a de"
tags: [llm, commentary, entity, trebles-and-territories]
timestamp: "2026-09-07T21:47:27.125Z"
---

# LLM Commentary (Trebles & Territories)

The in-game AI commentary feed for [Trebles & Territories](../concepts/risk-darts-proposed-game-mode.md): an LLM writes a commentary blurb **every 2 turns**, rendered in a dedicated commentary tab next to the live scorer.

## Details

- **Endpoint**: `https://opencode.ai/zen/go/v1/chat/completions` (OpenCode Zen Go) — see the [endpoint-headers learning](../../learnings/opencode-zen-go-needs-session-header.md); model `glm-5.3-flash`; API key in `.env` under `OPENCODE_API`.
- **Cadence**: one commentary entry per 2 turns of play.
- **Persona spec** (locked by user): **PDC-style sport commentary × British humor × TV chef quotes**, with **Muppet Show sound stingers where it makes sense** — Swedish Chef on the chef bits, Statler & Waldorf heckling misses, Animal drum mayhem on a Shanghai.
- **Trigger material**: score events, territories claimed/lost, Shanghai feats, Bull Altar resurrections, domination runs — the same event stream the audio caller uses.

## Why it matters

It turns the territory map into a show: the commentary is the game's broadcast layer, distinct from the ElevenLabs caller clips (which announce scores); this layer narrates the story of the match in a fixed comedic persona.

## Relationships

- [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) — the game mode it narrates
- The spec lives in `.specs/trebles-and-territories/spec.html` — see [Trebles & Territories implementation spec](../artifacts/trebles-territories-implementation-spec.md)

## Lifecycle

- First added: spec'd during the Trebles & Territories implementation-spec turn (not yet implemented in code).
