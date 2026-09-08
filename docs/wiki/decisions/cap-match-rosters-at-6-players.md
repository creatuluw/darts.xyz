---
type: Decision
title: Cap match rosters at 6 players, enforced client and server
description: Context
status: accepted
timestamp: "2026-09-07T20:19:11.942Z"
---

# Cap match rosters at 6 players, enforced client and server

## Context

Matches previously had no player-count limit anywhere — the schema, match engine, and turn rotation are all player-count-generic. The live scorer UI only had room around the center dartboard for a sensible number of side panels, and the user requested a hard cap of 6.

## Decision

Cap match rosters at **6 players (minimum 1)**, enforced at three layers:

- `src/lib/components/ui/SearchSelect.svelte` — new `maxSelected` prop: selection is blocked at the cap and unselected options are dimmed/disabled
- `src/routes/match/setup/+page.svelte` — passes `maxSelected={6}`, counter label reads `(/6)`
- `src/routes/api/matches/+server.ts` — server-side guard rejects match creation with anything other than 1–6 players (client limits are never trusted alone)

## Alternatives considered

- **No cap / higher cap**: layout quality around the center board degrades beyond 6 (3 left + 3 right columns); rejected.
- **Client-only enforcement**: a trust-boundary hole — the API must reject oversized rosters regardless of what the UI allows.

## Consequences

Changing the cap later means touching all three enforcement points (search for `maxSelected={6}` and the 1–6 validation in the matches API). Live-scorer layout supports 6 via left/right column split with a compact mode at 3+ players — a cap above ~8 would need a new layout.
