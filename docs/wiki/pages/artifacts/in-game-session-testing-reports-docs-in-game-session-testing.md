---
type: Artifact
title: In-game session testing reports (docs/in-game-session-testing/)
description: Five full playtest session reports from 2026-09-09, played through the real UI (BrowserOS neo against the dev server, master `46a429e`) with the TV second scree
tags: [playtest, qa, reports, conquest, risk-42]
timestamp: "2026-09-09T19:48:45.129Z"
---

# In-game session testing reports (docs/in-game-session-testing/)

Five full playtest session reports from 2026-09-09, played through the real UI (BrowserOS neo against the dev server, master `46a429e`) with the TV second screen open and every turn verified against engine/API state — plus a cross-session index with a prioritized improvement backlog and reusable helper scripts. Session 5 (evening) covered the Risk 42 continent-palette map work and the TV full-bleed overlay redesign verification.

## What it documents

- [Trebles & Territories](../entities/conquest-engine-and-live-game.md) · Clock 51 · 2 players (session 1)
- [Risk 42](../entities/risk-42-playable-game-risk-setup-fun-tab-match-risk-riskboar.md) · Clock 170 · 4 players (session 2)
- Classic 501 · 2 and 4 players (sessions 3–4)
- [LLM Commentary](../entities/llm-commentary-trebles-territories.md) quality + reliability (measured: ~25s pipeline vs 20s timeout; delivery 1/17 conquest boundaries, 0/5 classic — see the [timeout learning](../../learnings/commentary-pipeline-25s-real-cost-vs-20s-timeout-raise-paral.md))
- Improvement backlog with stable feedback IDs (**F**=T&T/fun, **R**=Risk 42, **C**=classic, **D**=dev) — priority order F1 timeout/parallelize → F2 in-flight boundary drop → R1 port commentary to Risk 42 TV → …

## Details

- **Location**: `docs/in-game-session-testing/` — `index.md` (verdict + backlog), `2026-09-09-session-{1..4}-*.md`, `screenshots/session{1..4}/*.jpg`
- **Format**: Markdown reports with per-turn rule-verification tables, TV screenshots embedded per report, structured Feedback/Improvements sections
- **Generated from**: neo-driven UI sessions; `_decode-shot.mjs` decodes neo MCP screenshots to disk, `_risk-state.mjs` dumps Risk 42 API state — both kept for future sessions
- **Cross-session verdict**: rules/engines 100% pass (every locked rule live-verified at least once); commentary content judged genuinely good when it lands (personas, stat grounding, Dutch throughout) with fixable weak spots (invented facts, raw voice-library label for the spectator)

## Relationships

- [Test suite](./test-suite.md) — the automated layer; these reports are the manual/playtest layer
- [TV second screen](../entities/tv-second-screen-cast-views.md) — every session ran with it open; its background-tab freeze is recorded as a learning
- [Commentary 4-segment broadcast decision](../../decisions/commentary-becomes-a-4-segment-broadcast-with-leo-theodore-s.md) — the format the sessions evaluated

## Source

- `docs/in-game-session-testing/index.md` — the authoritative verdict + backlog
