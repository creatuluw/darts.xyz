---
type: Learning
title: Gauntlet failures can be chalk errors — three agreeing axes outrank the hand-scored oracle
description: "**Found while triaging the 2026-11-13 gauntlet run** (`e2e/gauntlet/`): the run flagged **G6 as a failure — the app was right, the chalk was wrong.** The chalkb"
tags: [testing, gauntlet, chalkboard, gotcha]
timestamp: "2026-11-13T19:22:56.846Z"
---

# Gauntlet failures can be chalk errors — three agreeing axes outrank the hand-scored oracle

**Found while triaging the 2026-11-13 gauntlet run** (`e2e/gauntlet/`): the run flagged **G6 as a failure — the app was right, the chalk was wrong.** The chalkboard claimed Quin's dart-2 bust left 7; the real sequence is T18 from 7 on **dart 3**: 127−60=67, −60=**7**, −54=−47 → bust on dart 3 with all 3 darts counting (legDarts 24, Quin stays 127). UI, API rows, and engine replay all agreed on 127; only the hand-written chalk disagreed. This was the **second** chalk arithmetic error of the campaign (fixed in chalk v4).

**Heuristic:** before fixing the app over a gauntlet failure, recompute the failing chalk step by hand from `games.json`. The chalkboard is the **least reliable axis** — it's hand-authored arithmetic, while the UI, the API rows, and the engine replay are three independent recomputations. When those three agree and only the chalk disagrees, fix the fixture (surgical chalk edit), never the app.
