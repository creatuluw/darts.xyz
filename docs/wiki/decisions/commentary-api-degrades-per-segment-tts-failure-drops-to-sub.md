---
type: Decision
title: Commentary API degrades per-segment — TTS failure drops to subtitles, never a whole-request 502
description: Context
tags: [risk-42, commentary, resilience, tts, elevenlabs]
status: accepted
timestamp: "2026-09-09T21:33:41.240Z"
---

# Commentary API degrades per-segment — TTS failure drops to subtitles, never a whole-request 502

## Context

While playtesting Risk 42 on prod (2026-09-09/10 campaign, 4P/6P Clock games), `/api/commentary` intermittently returned **502**. Initial suspicion: Railway edge timeout (~30s) on runs where LLM + 4× ElevenLabs TTS exceeded the window.

Probing showed all-segments-OK runs complete in 22–26s — inside the budget. The real root cause: **our own catch block**. The endpoint wrapped the whole pipeline (LLM call + all TTS synthesizes) in one try/catch and returned 502 on *any* upstream failure — so a single ElevenLabs hiccup killed the entire broadcast segment, even though the LLM text was fine.

## Decision

Degrade per segment instead of failing the request:

- If an individual TTS synthesis fails, that segment is returned **as subtitle-only** (text survives, voice drops).
- The LLM text is always returned; only voice is degradable.
- Client side: added a fetch timeout so a hung connection can't pin the commentary pill forever (toast + clear already existed).

## Alternatives considered

- Retry the whole pipeline on failure — doubles latency (~25s baseline) for a marginal gain; still all-or-nothing.
- Raise the Railway/edge timeout — treats the symptom; the failure mode was upstream flakiness, not just slowness.
- Do nothing / toast-only — the TV screen already toasts, but the broadcast content (grounded Dutch commentary) was lost entirely.

## Consequences

- Broadcasts survive partial TTS outages — worst case is a silent-but-readable segment.
- Future failure-mode additions (e.g. LLM timeout) should follow the same pattern: degrade the missing modality, keep the rest.
- Related known constraint: [commentary pipeline ~25s real cost](../learnings/commentary-pipeline-25s-real-cost-vs-20s-timeout-raise-paral.md) — latency budget remains tight against the ~30s edge limit.
