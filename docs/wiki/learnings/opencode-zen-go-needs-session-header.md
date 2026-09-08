---
type: Learning
title: OpenCode zen/go LLM endpoint needs x-opencode-session header + custom User-Agent
description: "The OpenCode Zen Go chat-completions endpoint (`https://opencode.ai/zen/go/v1/chat/completions`) rejects plain requests — it requires BOTH:"
tags: [llm, api, opencode, commentary]
timestamp: "2026-09-07T21:47:08.602Z"
---

# OpenCode zen/go LLM endpoint needs x-opencode-session header + custom User-Agent

The OpenCode Zen Go chat-completions endpoint (`https://opencode.ai/zen/go/v1/chat/completions`) rejects plain requests — it requires BOTH:

- `x-opencode-session: <session-id>` header
- a custom `User-Agent` (default client UAs get blocked)

Verified with a live 200 OK test. Auth key lives in `.env` under `OPENCODE_API`. Used for the Trebles & Territories LLM commentary with model `glm-5.3-flash`. Per OpenCode docs (https://opencode.ai/docs/go). If a future call 401/403s despite a valid key, check these two headers first.
