---
type: Decision
title: "Interviews on ElevenLabs live TTS: fixed commentator voice, random Dutch spectators"
description: Context
tags: [trebles-and-territories, conquest, tts, elevenlabs, interviews]
status: accepted
timestamp: "2026-09-08T20:19:37.768Z"
---

# Interviews on ElevenLabs live TTS: fixed commentator voice, random Dutch spectators

## Context

The spectator-interview feature ([spectator-interviews-trebles-territories](../pages/entities/spectator-interviews-trebles-territories.md)) had Q14 open: which engine voices the Dutch Q&A. The standing recommendation (2026-09-08) was **webSpeech now** (the only browser engine speaking nl-NL, free, per-device voice randomness fits the vox-pop vibe) with **ElevenLabs live API later** as a quality upgrade. The user then directed: use ElevenLabs now — per https://elevenlabs.io/docs/overview/intro, commentator = voice `GiGOaehga8enaTnFQvb4` (https://elevenlabs.io/voices/GiGOaehga8enaTnFQvb4), spectators = **any Dutch voice (mandatory), never the commentator's**, `ELEVENLABS_KEY` already in `.env`.

## Decision

Interviews use the **ElevenLabs live TTS API immediately** — no webSpeech-first stage:

- **Commentator**: fixed voice `GiGOaehga8enaTnFQvb4` on every interview.
- **Spectators**: a random **Dutch** voice per interview, hard-excluded from the commentator voice.
- **Keys**: `ELEVENLABS_KEY` (audio) + `OPENCODE_API` (text LLM writes the Dutch Q&A) — both already in `.env`.

## Alternatives considered

- **webSpeech now, ElevenLabs later** — free and zero-dep, superseded by the user's explicit voice mandate the same day it was proposed.
- **Kokoro** — ruled out earlier: English-only voice bank ([webspeech-only-dutch-tts](../learnings/webspeech-only-dutch-tts.md)).

## Consequences

- Live TTS costs per generation → interviews must be generated **once and cached** (text in the DB with conquest state, audio file/blob-cached) so replays and late joiners never re-bill.
- Dutch subtitles stay on the TV view (muted screens still get the show); any LLM/TTS failure = silent skip — the game never waits on an interview.
- The caller's webSpeech path remains the only *browser-side* Dutch engine; that fact is unchanged, only the "must start on webSpeech" guidance is superseded.
