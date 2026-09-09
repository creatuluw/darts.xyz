---
type: Entity
title: Spectator Interviews (Trebles & Territories)
description: Spectator Interviews (Trebles & Territories)
tags: [conquest, interviews, trebles-and-territories, llm, tv, elevenlabs, commentary]
timestamp: "2026-09-09T11:07:18.174Z"
---

# Spectator Interviews (Trebles & Territories)

# Spectator Interviews (Trebles & Territories)

The **implemented** mid-game TV broadcast: at every-N-turn boundaries an LLM writes a **4-segment commentary** — asker commentator asks, a random Dutch spectator persona answers, an analyst commentator adds expert analysis, and the analyst closes with hopes + a cliffhanger — voiced (ElevenLabs live TTS) and subtitled on the TV second screen. Originally conquest-only; **round 4 (2026-09-08) extended it to ALL match types**. Landed on master 2026-09-09; the 4-segment format landed the same day via PR #10.

## Details

- **Where it lives** (all on master):
  - Server services (`src/lib/server/`): `opencode.ts` — LLM client (commentary/interview text generation, JSON parsing — parser lives in pure `$lib/game/interview-json.ts`); `elevenlabs.ts` — TTS client.
  - Pure game logic (`src/lib/game/`): `commentary-prompt.ts` — Dutch prompt with Taak 1–4 (question / spectator answer / analyst analysis / outlook+cliffhanger), analyst names, optional `priorLines` block; `commentary-cadence.ts` — every-N-turns boundary logic; `elevenlabs-voices.ts` — `COMMENTATORS`, `commentatorPair(boundary parity)`, spectator pick excluding both commentator voices; `interview-json.ts` — pure JSON parser.
  - API (`src/routes/api/commentary/`): `+server.ts` (POST) — generate-or-cache a 4-segment broadcast at a turn boundary (asker/spectator/analyst voices, `priorLines` passthrough); `COMMENTARY_FAKE=1` forces canned test mode covering the new fields; `[matchRef]/+server.ts` — fetch cached entries (replays never re-bill).
  - UI: `src/lib/components/tv/TvCommentary.svelte` — sequential 4-segment playback, speaker labels Leo/Theodore via shared voice-id lookup; skips missing analyst segments so old cached rows replay as the 2-segment format.
- **4-segment format** (2026-09-09, PR #10): see [commentary-becomes-a-4-segment-broadcast-with-leo-theodore-s](../../decisions/commentary-becomes-a-4-segment-broadcast-with-leo-theodore-s.md). Analyst improvises over the same boundary data plus `priorLines` (TV sends up to 8 earlier turns) and cross-player comparisons.
- **Commentators**: Leo (`GiGOaehga8enaTnFQvb4`) and Theodore (`AgeYjqDIfXtkcA3mOcsH`) swap roles per boundary — odd: Leo asks / Theodore analyses; even: swapped. Spectator voices never use a commentator voice.
- **Scope (settled round 4)**: all match types — see [commentary-gated-on-open-2nd-screen-pause-button-all-match-t](../../decisions/commentary-gated-on-2nd-screen.md).
- **Gating (settled round 4)**: generated only while a 2nd screen is open and not paused; the TV pause button stops all generation, including audio spend.
- **Cadence (settled round 4)**: every N turns, default 2 — N is also the LLM aggregation window. Control lives on the TV view, persisted per match.
- **Failure (settled round 4)**: dismissible toast on the TV, auto-hides after 30 s; the game never waits on commentary.
- **Question pool (Q13)**: per-player 1–2 curated options, randomly surfaced — see [interview-questions-per-player-curated](../../decisions/interview-questions-per-player-curated.md).
- **Voices (Q14, amended by PR #10)**: ElevenLabs live TTS — two swapping commentators (Leo/Theodore); spectators = random Dutch voice, never either commentator's — see [interviews-elevenlabs-live-tts](../../decisions/interviews-elevenlabs-live-tts.md) and the [4-segment decision](../../decisions/commentary-becomes-a-4-segment-broadcast-with-leo-theodore-s.md). Kokoro ruled out (English-only — [webspeech-only-dutch-tts](../../learnings/webspeech-only-dutch-tts.md)).
- **DB**: `drizzle/0008` adds 5 columns (analysis/outlook text, `analyst_voice`, `audio_analysis`, `audio_outlook`); applied directly to prod, journal not updated (see [db-push-ignores-darts-schema](../../learnings/db-push-ignores-darts-schema.md)).

## Relationships

- [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) — the game mode it started in (now all match types)
- [llm-commentary-trebles-territories](./llm-commentary-trebles-territories.md) — sibling LLM broadcast layer; the interview format converged with the commentary feed into one pipeline
- [tv-mode-url-tab-cast-polling](../../decisions/tv-mode-url-tab-cast-polling.md) — the 2nd screen where the voice + subtitles play, and whose polling gates generation
- [tv-second-screen-cast-views](./tv-second-screen-cast-views.md) — the TV routes that host TvCommentary

## Lifecycle

- First added: spec'd during the 2026-09-08 grill interview rounds 2–4 (Q13–Q16 all settled).
- 2026-09-09: **implemented on master** — `4f9d3fa` cadence + Dutch interview prompt modules (TDD), `ee717b7` ElevenLabs client, `38ba2c9` generate endpoint, `3c6803c` TV integration.
- 2026-09-09: **4-segment broadcast + Leo/Theodore role swap** — PR #10 (`7e53dc0`, worktree `kees-commentator-analysis`): analyst analysis + cliffhanger segments, `priorLines` window, migration `0008`, 199 unit tests green.
