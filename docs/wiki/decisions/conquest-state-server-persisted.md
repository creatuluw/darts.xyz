---
type: Decision
title: "Conquest state persists server-side: write-through per dart, own table + uuid"
description: Context
tags: [conquest, persistence, tv, database, drizzle]
status: accepted
timestamp: "2026-09-08T20:03:02.211Z"
---

# Conquest state persists server-side: write-through per dart, own table + uuid

## Context

The live conquest game (`/match/conquest`) is entirely client-side — state lives in `sessionStorage` ([[conquest-state-client-side-only]]), which is the M3 stopgap. The TV spectator mode ([[tv-mode-url-tab-cast-polling]]) needs a second device to poll conquest state, and the LLM commentary feed ([[llm-commentary-trebles-territories]]) plus the recap video pipeline ([[recap-video-pipeline-trebles-territories]]) both need server-side state. Grill Q8 asked how the TV view gets conquest state; the user settled it as **(a) server-persisted** (2026-09-08, interview round 2).

## Decision

- **Write-through on every dart**: the scorer persists `ConquestState` to the server on each throw — TV polls it, exactly the pattern classic 301/501 matches already use for their ~1s polling TV view.
- **Own table + uuid**, not a jsonb column bolted onto `matches` — a conquest game is not a classic match row and has its own lifecycle.
- **One TV route pattern serves both match types** (classic + conquest), not two divergent TV views.

## Alternatives considered

- **jsonb column on matches** — rejected: couples conquest lifecycle to the classic match schema.
- **Same-browser `storage`-event sync** — rejected earlier: only covers one browser (no remote spectators), two tabs can fight over one key ([[conquest-state-client-side-only]]).

## Consequences

- Unblocks conquest TV/spectator view via the same polling pattern as classic — no conquest-specific realtime work.
- Unblocks server-side LLM commentary (M4) and the day-after recap pipeline.
- Conquest games become refresh-safe / resumable across tabs and devices (today they die with the tab).
- sessionStorage handoff from setup becomes an initialization concern only.
- Implementation pending as of this decision — design settled, code not yet written. Grill Q9 (share affordance: button vs button+QR vs URL convention) still open.
