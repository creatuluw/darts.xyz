---
type: Decision
title: Commentary becomes a 4-segment broadcast with Leo & Theodore swapping roles
description: Context
tags: [commentary, elevenlabs, tv, llm, broadcast]
status: accepted
timestamp: "2026-09-09T11:06:46.653Z"
---

# Commentary becomes a 4-segment broadcast with Leo & Theodore swapping roles

## Context

The TV commentary (built 2026-09-09, see [[spectator-interviews-trebles-territories]]) was a 2-segment interview: commentator asks, random Dutch spectator persona answers. The user wanted a real broadcast for **all game types**: after the spectator answers, a commentator adds expert analysis (free to compare prior turns or other players — an improvisation slot), then closes with hopes for what's next plus a fun, engaging cliffhanger. Mid-build the user added that **two** commentators alternate — Leo (`GiGOaehga8enaTnFQvb4`) and Theodore (`AgeYjqDIfXtkcA3mOcsH`), both ElevenLabs voice-library voices.

## Decision

The commentary boundary payload becomes a **4-segment broadcast**, all match types:

1. **Asker** asks one question about the last N turns
2. **Spectator persona** answers from its instructions + the same data/events/specials
3. **Analyst** gives his own expert take — improvisation slot; may compare prior turns (new `priorLines` context window: the TV sends up to **8 earlier turns**) or other players
4. **Analyst** closes with hopes for what happens next + a cliffhanger

**Leo & Theodore swap roles per boundary** (odd boundaries: Leo asks / Theodore analyses; even: swapped) via `commentatorPair(boundary parity)` in `elevenlabs-voices.ts`. Spectator voice picks **exclude both** commentator voices (server-side filter).

This **amends the fixed-single-commentator-voice clause** of [[interviews-elevenlabs-live-tts]] — the ElevenLabs live TTS transport and random-Dutch-spectator parts of that decision still stand.

## Alternatives considered

- Keep the 2-segment interview — rejected: no analyst insight, no hook into the next boundary.
- Single generic analyst voice — rejected: two swapping voices give distinct identities and halve the "same voice talks twice" fatigue.
- Analyst sees full match history — rejected: capped `priorLines` window (≤8 turns) keeps prompt size and LLM spend bounded.

## Consequences

- DB migration `drizzle/0008` (5 columns: analysis/outlook text, `analyst_voice`, `audio_analysis`, `audio_outlook`) applied directly to prod. Old cached rows replay as the old 2-segment format — `TvCommentary.svelte` skips missing analyst segments.
- Interview JSON parsing extracted to pure `$lib/game/interview-json.ts` (vitest can't import `$env/dynamic/private`).
- `COMMENTARY_FAKE=1` fake mode covers the new fields; e2e asserts `analystVoice` is one of the two commentator voices.
- Landed via worktree `kees-commentary-analysis` as PR #10, merged to master 2026-09-09 (`7e53dc0`).

## Source

- `src/lib/game/commentary-prompt.ts`, `src/lib/game/elevenlabs-voices.ts`, `src/lib/game/interview-json.ts`, `drizzle/0008_*.sql`, `src/routes/api/commentary/+server.ts`, `src/lib/components/tv/TvCommentary.svelte`
