---
type: Learning
title: startRisk clears risk42_state but not risk42_game_id — new game silently resumes the old one
description: **Found during the Risk 42 prod playtest campaign (2026-09-09/10), logged P1.**
tags: [risk-42, bug, session, persistence]
timestamp: "2026-09-09T21:33:41.240Z"
---

# startRisk clears risk42_state but not risk42_game_id — new game silently resumes the old one

**Found during the Risk 42 prod playtest campaign (2026-09-09/10), logged P1.**

The setup flow's `startRisk()` clears the `risk42_state` sessionStorage key but **not** `risk42_game_id`. Consequence: starting a new Risk 42 game in the same browser tab **silently resumes the old game** — the new setup (different roster, mode, clock) is discarded and play continues from the stale server-persisted game.

## Workaround used in testing

Clear `risk42_game_id` manually before starting a new game (or use a fresh tab).

## Fix needed

`startRisk()` must clear both keys together — they're one logical session pointer; splitting them is the bug. Any future "reset/replace game" flow should clear the pair atomically.

## Related

- [Risk 42 server persistence rides conquest_games + /api/conquest](../decisions/risk-42-server-persistence-rides-conquest-games-api-conquest.md) — the persistence layer whose stale pointer this is.
