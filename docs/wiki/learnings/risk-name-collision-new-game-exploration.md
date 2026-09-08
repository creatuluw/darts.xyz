---
type: Learning
title: ""Risk" name collision: new game exploration (Sep 2026) is distinct from the Risk-darts proposal that became Trebles & Territories"
description: "The name **"Risk"** is ambiguous in this project. It historically refers to the rolled-back **Risk-darts proposal** (documented at [[risk-darts-proposed-game-mo"
tags: [risk, game-design, naming, glossary-collision, trebles-and-territories]
timestamp: "2026-09-08T22:05:56.397Z"
---

# "Risk" name collision: new game exploration (Sep 2026) is distinct from the Risk-darts proposal that became Trebles & Territories

The name **"Risk"** is ambiguous in this project. It historically refers to the rolled-back **Risk-darts proposal** (documented at [[risk-darts-proposed-game-mode]]) which evolved into **Trebles & Territories** ([[conquest-engine-and-live-game]], playable at `/match/conquest`).

As of 2026-09-08, a **new, separate game called "Risk"** is being scoped via the grilling/domain-modeling skills. It is NOT Trebles & Territories:

- **T&T**: the dartboard *is* the map.
- **New Risk (leading candidate, unconfirmed)**: classic world map on screen, but **real dart throws replace the dice** to resolve combat — the board is the randomizer. Working name only; final naming is deferred to the end of the grill (same process as T&T's Question 7).

Process mirrors T&T: grill → locked spec → TDD build in milestones. Design constraints carried over from T&T: same mixed-crowd table (casuals must matter to the end), target ~30–45 min, one shared screen with hot-seat turns, pure TS engine in `src/lib/game/`, new route + Fun-tab entry, no network multiplayer (YAGNI).

**Gotcha for future sessions**: grepping "Risk" or reading `docs/risk/` reference assets (see [[docs-risk-assets-risk-board-svgs-notes]]) will surface T&T-era material. Check which game a "Risk" discussion belongs to — pre-2026-09 material is T&T's ancestor; the new game has its own spec cycle starting from this date.
