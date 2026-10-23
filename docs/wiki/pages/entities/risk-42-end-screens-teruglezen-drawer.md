---
type: Entity
title: Risk 42 end screens & Teruglezen drawer
description: "The game-over surfaces for [Risk 42](../concepts/risk-42-proposed-game-mode.md), shipped during the session-6 prod playtest (2026-09-10, commits `5e6dc11` + `bf"
tags: [risk-42, end-screen, tv, commentary, ui]
timestamp: "2026-09-09T22:08:48.101Z"
---

# Risk 42 end screens & Teruglezen drawer

The game-over surfaces for [Risk 42](../concepts/risk-42-proposed-game-mode.md), shipped during the session-6 prod playtest (2026-09-10, commits `5e6dc11` + `bfb059b`): the scorer end screen, the TV winner overlay, and the **Teruglezen** ("read back") commentary replay drawer. Before this, finishing a Risk 42 game just froze the board with no summary.

## Details

- **Location**: scorer end screen in `src/routes/match/risk/[id]/+page.svelte`; winner overlay in `src/routes/match/risk/[id]/tv/+page.svelte`; drawer reads the commentary data layer (service list method + drawer endpoint added with it).
- **Scorer end screen**: final world map (frozen in end state) + stats line (`N turns · N captures · N ⚡ · N misses`) + continent chips per player. Validated on clock-win, tiebreak-win, and domination-win paths.
- **TV winner overlay**: `KAMPIOEN <name>` headline + full standings (continents, exile rows — exile ≠ death, see [decisions/risk-42-exile-and-clawback](../../decisions/risk-42-exile-and-clawback.md)) over the dimmed end-state map, behind a legibility scrim.
- **Teruglezen drawer**: lists all commentary segments with role chips (`PRESENTATOR` / `TOESCHOUWER` / `ANALIST`), seeded with 4 entries and filling live as the broadcast advances; **survives reloads** — append `?all=1` to the TV URL to re-read every segment of a finished game.
- Player colors and chips follow the 6-player hue-spread palette decision.

## Key rules / properties

- **Finished games can't be re-opened**: resume requires `winner === null`, so the scorer/TV end screens render only at the moment of finish in that tab. To validate them you must finish a fresh game (or use the engine-finish rule) — only the drawer's server-persisted segments are re-viewable via `?all=1`.

## Relationships

- [Risk 42 proposed game mode](../concepts/risk-42-proposed-game-mode.md) — the mode these screens terminate
- [./tv-second-screen-cast-views](./tv-second-screen-cast-views.md) — the TV cast page family the winner overlay belongs to
- [./llm-commentary-trebles-territories](./llm-commentary-trebles-territories.md) — the commentary system whose segments the drawer replays
- [In-game session testing reports](../artifacts/in-game-session-testing-reports-docs-in-game-session-testing.md) — validated live in the session-6 report

## Lifecycle

- First added: 2026-09-10 (session-6 prod campaign) — end screens + drawer + role labels in `5e6dc11`; 6-player palette/chip/scrim legibility fix in `bfb059b`.
