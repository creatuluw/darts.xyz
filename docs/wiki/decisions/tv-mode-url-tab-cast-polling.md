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

## Consequences

- The open write API (PATCH/DELETE `/api/matches/[id]` unauthenticated) is a pre-existing, accepted risk for this feature: **noted, not fixed in the TV PR** — it deserves its own task and was flagged in the PR description.
- Round 2 of the grill (layout content, URL/share affordance — QR code?, audio on TV, end-of-match behavior, acceptance criteria) was still pending at the end of this turn.
