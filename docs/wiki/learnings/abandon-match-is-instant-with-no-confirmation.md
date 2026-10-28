---
type: Learning
title: Abandon match is instant with no confirmation
description: **Found during the 2026-10-28 four-game test sweep** (Game 2, 3-player 301).
tags: [known-issue, ux, abandon, data-loss, test-sweep-2026-10-28]
timestamp: "2026-10-28T18:35:24.893Z"
---

# Abandon match is instant with no confirmation

**Found during the 2026-10-28 four-game test sweep** (Game 2, 3-player 301).

Abandoning a live match (navigating home from the scorer) ends it **instantly with no confirmation dialog** — one accidental back-navigation or mis-tap can kill a match in progress with no undo.

Contrast with the existing delete-last-turn UX, which at least has a confirm step (see [[learnings/deletelastturn-ui-shared-confirm-state-restore-uses-the-wron]] — itself buggy). The abandon path has no guard at all.

**Fix shape:** a confirm dialog before abandoning a match that has ≥1 persisted turn (or a "concede/abandon" action instead of bare navigation). Low effort, prevents real data loss in the pub.
