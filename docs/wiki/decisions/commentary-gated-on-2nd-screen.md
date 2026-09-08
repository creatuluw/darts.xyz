---
type: Decision
title: Commentary gated on open 2nd screen + pause button; all match types; every-N-turns cadence
description: Context
tags: [commentary, interviews, llm, tv, elevenlabs, cost-control]
status: accepted
timestamp: "2026-09-08T20:24:29.350Z"
---

# Commentary gated on open 2nd screen + pause button; all match types; every-N-turns cadence

## Context

Interview round 4 (2026-09-08) of the 2nd-screen + commentary grill. Q15 had proposed **conquest-only** interviews with silent-skip failure. The user's answers settled the remaining mechanics, and the assistant drafted the full acceptance criteria (Q16) for final confirmation.

## Decision

- **Generation gating (cost control)**: commentary/interviews are generated **only while a 2nd screen (TV) is open AND not paused**. No TV tab polling → nothing generated, nothing billed. A **pause button on the TV view** stops ALL generation — including audio spend — while paused.
- **Scope: ALL match types** — classic 301/501 matches get the same Dutch interview commentary as conquest. Supersedes the Q15 "conquest-only for now" proposal.
- **Cadence: every N turns, default 2, adjustable** — N doubles as the LLM aggregation window: N=4 → the LLM aggregates events of the last 4 turns.
- **Failure UX**: dismissible toast on the TV, auto-hides after **30 s** (replaces the earlier "silent skip"); the game still never waits on commentary.
- **Defaults confirmed as drafted (Q16 final confirm, 2026-09-08 — TODO-54d2879c)**: the N-turns control lives on the TV view (persisted per match); "2nd screen active" = the TV tab is polling; interviews target ~2 min; work split into **two PRs** — (1) 2nd screen + conquest persistence, (2) commentary pipeline — so the screen ships before the LLM work.

## Alternatives considered

- **Conquest-only first** (Q15 proposal) — rejected by the user: all matches get it.
- **Fixed every-2-turns cadence** — rejected: N must be adjustable, with deeper aggregation at higher N.
- **Always-generate + cache for later** — rejected: a paused/closed screen generates nothing; spend follows attention.

## Consequences

- Zero LLM ([[learnings/opencode-zen-go-needs-session-header]] `OPENCODE_API`) + ElevenLabs spend without an actual audience.
- The TV route becomes load-bearing for generation: its polling is the "active" signal, its pause button the kill switch ([[tv-mode-url-tab-cast-polling]]).
- The cadence/aggregation N is stored per match alongside the commentary cache.
- Two-PR split sequences the build: [[conquest-state-server-persisted]] + TV view first, LLM pipeline second.
