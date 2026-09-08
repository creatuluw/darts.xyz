---
type: Decision
title: "TV spectator mode: URL + tab-cast, 1s polling, public-by-link, room-first"
description: Context
tags: [tv, spectator, realtime, architecture, emailgate]
status: accepted
timestamp: "2026-09-08T19:45:52.275Z"
---

# TV spectator mode: URL + tab-cast, 1s polling, public-by-link, room-first

## Context

Task `2nd-tv-screen-cast-realtime` (second screen for live matches) was paused at step 3 awaiting scope answers. A grilling session (2026-09-08) settled the four root decisions. Facts that shaped them: no realtime infra exists (live match page loads everything once on mount, writes via REST); refresh-resume already rebuilds full state from the DB ([[learnings/refresh-resume-needs-chronological-turn-order]]); match IDs are unguessable UUIDs; EmailGate gates all pages client-side with no route exemptions ([[learnings/ssr-pages-are-empty-shells-emailgate]]).

## Decisions

1. **Audience: the room AND remote spectators — both first-class.** *(Amended 2026-09-08, interview round 2: user settled Q1 as "(c) both"; originally recorded room-first.)* Players score on one device; the TV is a big screen everyone glances at. Elevating remote spectators to a requirement is precisely what kills the native Chromecast SDK option for good: a cast session from the scorer's device can't serve remote viewers at all, while one shared URL serves both for free. Checkout suggestions and darts-thrown stay on the scorer; the TV shows big scores, averages, set/leg count, who's throwing.
2. **Delivery: spectator URL + tab-cast, explicitly NOT the native Chromecast SDK.** A read-only scoreboard route (e.g. `/match/[id]/tv`) opened in the TV's browser or a cast browser tab. The native SDK (receiver registration, $5 dev fee, device allow-listing, app approval) is a YAGNI trap; add it only if tab-casting proves unusable in practice.
3. **Realtime: poll ~1 s, not SSE/WebSocket.** State changes per dart at human speed; the resume logic already reconstructs the full match from the same endpoints, so a second device polling needs zero backend work. If 1 s polling ever measurably lags, SSE is a contained later upgrade — but likely never ships.
4. **Access: TV route is public-by-link and exempt from EmailGate.** The gate is soft (any email passes, no verification) and would only annoy the person setting up the TV. The UUID link is the key — see [[learnings/match-api-unauthenticated]].
5. **Share affordance: an in-app button that copies the TV URL — no QR code.** *(Settled 2026-09-08, interview round 2 Q9: user chose "button + copy-link, no QR".)* The scorer gets a button that copies the `/match/[id]/tv` link to the clipboard; no QR rendering. Remote spectators receive the link via any messenger.
6. **End-of-match: result freeze — winner card, polling stops, card persists until closed.** *(Settled 2026-09-08, interview round 2 Q11: user chose "(a) result freeze".)* When a match ends, the TV route swaps to a winner card, **stops polling**, and keeps that card on screen until someone closes it — no auto-redirect, no countdown to a home screen. Same pattern for both game types (classic 301/501 and conquest), so the TV route has one end-of-match lifecycle regardless of match type.

## Consequences

- The open write API (PATCH/DELETE `/api/matches/[id]` unauthenticated) is a pre-existing, accepted risk for this feature: **noted, not fixed in the TV PR** — it deserves its own task and was flagged in the PR description.
- Stopping the poll on match end means the TV route needs the match status in every poll response (it already gets it for free via the same read endpoints) so it knows when to freeze.
- Round 2 of the grill: Q9 and Q11 settled (decisions 5 and 6 above).
- **Final confirmation (2026-09-08): design tree fully settled** — spec captured as TODO-54d2879c.
  - **Q10 settled: no caller audio on the TV, ever.** User overrode the muted-by-default + one-tap-unmute recommendation. (Interview/commentary audio still plays on the TV — it is the content; the caller is not.)
  - **Q12 settled: conquest TV layout** = board, scoreboard, phase, last-dart strip, **turn clock (included** — overrides the earlier "skip for now" rec), and per-player curated options. Classic layout stays the 7-block scoreboard.
  - **Ground rules locked with the spec:** the TV **never writes**; no caller audio on TV; no native Cast SDK; option curation is **heuristic, not LLM**; 1–6 players everywhere.
  - **Kickoff:** branch `feature/2nd-tv-screen-cast-realtime`, worktree `E:/worktrees/kees-2nd-tv-screen-cast-realtime` on top of `feature/trebles-territories` (conquest PR #2 still unmerged — PR A and PR #2 overlap until it merges; plan: build PR A now, rebase if needed, or merge #2 first). Cast button opens the read-only `/tv` view in a new tab.
