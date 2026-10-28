---
type: Learning
title: "Commentary pipeline: ~25s real cost vs 20s timeout — raise/parallelize"
description: "Measured while playtesting all game modes on 2026-09-09: the 4-segment commentary pipeline (glm-5.3-flash LLM call + 4 sequential ElevenLabs TTS synthesizes) ta"
tags: [commentary, llm, elevenlabs, timeout, bug]
timestamp: "2026-09-09T19:46:41.760Z"
---

# Commentary pipeline: ~25s real cost vs 20s timeout — raise/parallelize

Measured while playtesting all game modes on 2026-09-09: the 4-segment commentary pipeline (glm-5.3-flash LLM call + 4 sequential ElevenLabs TTS synthesizes) takes **~25 s end-to-end**, but `src/lib/server/opencode.ts` sets `TIMEOUT_MS = 20_000` on the LLM fetch. Result: intermittent `TimeoutError` → 502 from `/api/commentary` → TV toast "Commentaar mislukt". Observed delivery: **1 of 17** conquest boundaries, **0 of 5** classic boundaries. Second compounding bug: TvCommentary consumes boundaries that arrive while a generation is in-flight (`fresh[fresh.length - 1]`) and never retries them. Fixes: raise timeout to ≥45 s, parallelize the 4 TTS calls, queue/retry dropped boundaries. Also: `.env`'s OPENCODE_API value is wrapped in literal quotes (`"sk-…"`) — Vite strips them, but curl-style consumers get 401s; normalize.
