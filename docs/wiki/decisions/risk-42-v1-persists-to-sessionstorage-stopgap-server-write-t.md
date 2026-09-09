---
type: Decision
title: Risk 42 v1 persists to sessionStorage (stopgap) — server write-through lands at M3
description: Context
tags: [risk-42, persistence, sessionstorage, architecture]
status: accepted
timestamp: "2026-09-09T10:47:22.589Z"
---

# Risk 42 v1 persists to sessionStorage (stopgap) — server write-through lands at M3

## Context

Conquest (Trebles & Territories) chose **server-side write-through persistence** — one row per dart in its own table ([[conquest-state-server-persisted]]). The Risk 42 implementation spec marks sessionStorage as the explicit v1 stopgap so the mode ships playable without waiting on DB/API work.

## Decision

**Risk 42 v1 persists to `sessionStorage` in the route component** (`src/routes/match/risk/+page.svelte`): a `STATE_KEY` holding the serialized game + player config, a `SETUP_KEY` for resume. No DB, no API, no share links.

## Consequences

- Game survives reload in the same tab; opening a new tab starts fresh.
- No cross-device play, no TV/cast polling, no morning-after recap hookup until persistence exists.
- **M3 will replace this** with server persistence mirroring the conquest pattern (own table + write-through per dart) — the spec's roadmap already queues it after M2.1/M2.4/M2.5.

Alternative considered (and deferred): build conquest-style server persistence now — rejected to keep M2.3 a pure UI/setup cut on top of the already-merged M1 engine.
