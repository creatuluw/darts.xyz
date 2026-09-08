---
type: Learning
title: Only webSpeech TTS speaks Dutch — kokoro is English-only, ElevenLabs is pre-generated clips
description: Only webSpeech TTS speaks Dutch
tags: [tts, audio, dutch, caller, i18n]
timestamp: "2026-09-08T20:19:37.767Z"
---

# Only webSpeech TTS speaks Dutch

## The fact

The caller (`src/lib/utils/darts-caller.ts`) ships three TTS engines behind an `engine` setting (`"elevenlabs" | "kokoro" | "webSpeech" | "none"`), and their language capabilities differ sharply:

- **elevenlabs** — pre-generated soundboard clips only (`static/audio/`); no live API calls.
- **kokoro** (kokoro-js, in-browser) — English voice bank; can't do Dutch sentences credibly.
- **webSpeech** — browser SpeechSynthesis; the only engine that can speak `nl-NL`. The voice set varies per device/OS (fits a "random vox-pop spectator" vibe, but quality is a per-device lottery — synthetic on some devices, absent on odd TV browsers).

## Why it matters

These facts hold for **browser-side** TTS only. Discovered while speccing the spectator interviews' random Dutch voices (grill Q14, 2026-09-08). The same day, the "must start on webSpeech" guidance was **superseded** by a user directive: the interviews use the **ElevenLabs live API** (Dutch voices, fixed commentator voice `GiGOaehga8enaTnFQvb4`) — see [interviews-on-elevenlabs-live-tts-fixed-commentator-voice-ra](../decisions/interviews-elevenlabs-live-tts.md). Dutch no longer *requires* webSpeech anywhere the server can call ElevenLabs; the recap video pipeline can do the same. The engine-abstraction note stays useful: swapping caller engines is a setting, not a rewrite.
