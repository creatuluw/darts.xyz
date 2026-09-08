---
type: Entity
title: Spectator Interviews (Trebles & Territories)
description: "The planned mid-game **spectator interview** feature: an LLM generates a short interview — a commentator asks a question, a random spectator persona answers — i"
tags: [conquest, interviews, trebles-and-territories, llm, tv]
timestamp: "2026-09-08T20:24:37.445Z"
---

# Spectator Interviews (Trebles & Territories)

The planned mid-game **spectator interview** feature: an LLM generates a short interview — a commentator asks a question, a random spectator persona answers — in **Dutch**, voiced and subtitled on the TV second screen. Originally conquest-only; **round 4 (2026-09-08) extended it to ALL match types** (classic 301/501 + conquest).

## Details

- **Scope (settled round 4)**: **all match types** — supersedes the earlier conquest-only proposal. See [commentary-gated-on-open-2nd-screen-pause-button-all-match-t](../../decisions/commentary-gated-on-2nd-screen.md).
- **Gating (settled round 4)**: generated **only while a 2nd screen is open and not paused**; a pause button on the TV stops all generation, including audio spend. "Active" = the TV tab is polling.
- **Cadence (settled round 4)**: every **N turns**, default 2, adjustable — N is also the LLM aggregation window (N=4 → last 4 turns' events). Control lives on the TV view, persisted per match.
- **Failure (settled round 4)**: dismissible toast on the TV, auto-hides after 30 s; the game never waits on commentary.
- **Settled (Q13)**: the question pool is **per-player 1–2 curated options** (sensible or game-heating), randomly surfaced — see [interview-questions-per-player-curated](../../decisions/interview-questions-per-player-curated.md).
- **Settled (Q14)**: voices are **ElevenLabs live TTS, now** — commentator = fixed voice `GiGOaehga8enaTnFQvb4`; spectators = a random **Dutch voice, never the commentator's**; `ELEVENLABS_KEY` already in `.env` — see [interviews-elevenlabs-live-tts](../../decisions/interviews-elevenlabs-live-tts.md). Kokoro ruled out (English-only — [webspeech-only-dutch-tts](../../learnings/webspeech-only-dutch-tts.md)).
- **Pipeline (from Q15, folded into round 4)**: TV calls the commentary endpoint, which generates once and **caches in the DB with match state** (refreshes/late joiners replay, never regenerate or re-bill); text from `OPENCODE_API` in Dutch; audio file/blob-cached; **subtitles on the 2nd screen** while it speaks.
- Ships as **PR 2** of the two-PR split (PR 1 = 2nd screen + [conquest-state-server-persisted](../../decisions/conquest-state-server-persisted.md)).

## Relationships

- [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) — the game mode it started in (now all match types)
- [llm-commentary-trebles-territories](./llm-commentary-trebles-territories.md) — sibling LLM broadcast layer; the interview format is converging with the commentary feed
- [tv-mode-url-tab-cast-polling](../../decisions/tv-mode-url-tab-cast-polling.md) — the 2nd screen where the voice + subtitles play, and whose polling gates generation
- [recap-video-pipeline-trebles-territories](./recap-video-pipeline-trebles-territories.md) — sibling planned day-after content pipeline

## Lifecycle

- First added: spec'd during the 2026-09-08 grill interview round 2 (not yet implemented in code).
- 2026-09-08 (round 3): Q14 settled on ElevenLabs live TTS; Q15 pipeline mechanics proposed.
- 2026-09-08 (round 4): scope extended to all match types; gating + pause button, N-turn cadence, 30 s toast settled; acceptance criteria drafted (Q16).
- 2026-09-08 (final): Q16 confirmed — full spec in TODO-54d2879c; implementation starting on branch `feature/2nd-tv-screen-cast-realtime`.
