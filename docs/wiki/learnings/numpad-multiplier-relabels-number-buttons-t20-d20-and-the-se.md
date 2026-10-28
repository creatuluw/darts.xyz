---
type: Learning
title: Numpad multiplier relabels number buttons (T20/D20) — and the selection persists across turns
description: **Found during the 2026-10-28 four-game test sweep**, driving the live scorer via browser automation.
tags: [known-issue, ux-bug, numpad, multiplier, automation, test-sweep-2026-10-28]
timestamp: "2026-10-28T18:35:24.892Z"
---

# Numpad multiplier relabels number buttons (T20/D20) — and the selection persists across turns

**Found during the 2026-10-28 four-game test sweep**, driving the live scorer via browser automation.

**Two distinct facts about the numpad multiplier (Triple/Double) selection:**

1. **Relabeling is BY DESIGN.** Selecting Triple relabels the number buttons to "T20", Double to "D20". Any automation (or human) clicking by visible label after a multiplier click will miss — this retroactively explains both the earlier "eaten Triple" incident and the "20 goes unfindable after clicking Triple" failure in this sweep. **Automate the numpad by value/position, never by button label.**

2. **Persistence across turns is a BUG.** The multiplier selection survives the turn boundary — observed twice: after A finished Leg 1 on D15, the grid still showed "D20" into the next turn; later the Double selection persisted from A's last turn into B's 101-checkout turn. Mis-throw hazard: the next thrower's first tap silently lands as a double/triple.

**Fix shape:** reset the multiplier to Single on turn commit (and ideally scope the selection state per-turn). Until fixed, manual scorers should glance at the multiplier before tapping — the button label lies about what's active.
