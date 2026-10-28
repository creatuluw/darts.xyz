---
type: Learning
title: Commentary LLM = DeepSeek deepseek-v4-flash (from glm-5.3-flash); ~1s LLM latency
description: "2026-09-09 evening: commentary LLM switched from OpenCode Zen Go (glm-5.3-flash, ~20-50s latency, needed x-opencode-session header) to **DeepSeek** (`https://ap"
tags: [llm, deepseek, commentary, opencode]
timestamp: "2026-09-09T21:04:36.377Z"
---

# Commentary LLM = DeepSeek deepseek-v4-flash (from glm-5.3-flash); ~1s LLM latency

2026-09-09 evening: commentary LLM switched from OpenCode Zen Go (glm-5.3-flash, ~20-50s latency, needed x-opencode-session header) to **DeepSeek** (`https://api.deepseek.com/chat/completions`, model `deepseek-v4-flash`, key `DEEPSEEK_API_KEY` in .env). Direct API probe: ~1s round-trip. The old "opencode endpoint needs special headers" learning is obsolete. The full commentary pipeline (LLM + 4 parallel ElevenLabs TTS) now measures ~40s worst-case — TTS dominates, LLM is no longer the bottleneck. `src/lib/server/opencode.ts` keeps its filename and `generateInterview` export (callers unchanged), TIMEOUT_MS stays 45s.
