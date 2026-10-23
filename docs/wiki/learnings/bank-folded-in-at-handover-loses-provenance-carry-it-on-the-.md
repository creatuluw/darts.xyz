---
type: Learning
title: Bank folded in at handover loses provenance — carry it on the object (turn.carried)
description: "**The gotcha:** in Risk 42 the engine adds the player's saved-dart bank to the next turn's budget *at handover* — so by the time the UI renders the pre-turn gat"
tags: [risk-42, state-design, ui, svelte]
timestamp: "2026-10-23T13:37:04.754Z"
---

# Bank folded in at handover loses provenance — carry it on the object (turn.carried)

**The gotcha:** in Risk 42 the engine adds the player's saved-dart bank to the next turn's budget *at handover* — so by the time the UI renders the pre-turn gate banner, `saved` is always 0 and the "7 darts — base 3 · +4 saved" breakdown is unrecoverable from state. The provenance was destroyed by the boundary transformation itself.

**The fix:** persist the rolled-in amount on the turn itself — `turn.carried` — when the turn is created, and itemize `base` vs `carried` in the banner (TDD'd as a presentation field on `DartHit`-adjacent turn data).

**Rule of thumb:** whenever a value is folded into another at a state boundary (turn handover, merge, normalization, snapshot restore), keep the original amount as a field on the persisted object if *any* UI will ever need to show the breakdown. Computing provenance retroactively from post-fold state is impossible.
