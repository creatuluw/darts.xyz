---
type: Decision
title: "Risk 42 bulls: the Arsenal charge (25 = +1, 50 = +2)"
description: Context
tags: [game-design, risk-42, conquest-mode, bulls, combat]
status: accepted
supersedes: "[]"
timestamp: "2026-09-09T08:04:43.667Z"
---

# Risk 42 bulls: the Arsenal charge (25 = +1, 50 = +2)

## Context

Q4 — what the two bulls do — was the explicitly open frontier of [Risk 42](../pages/concepts/risk-42-proposed-game-mode.md), flagged at the [mirror-damage lock](./risk-42-attack-rule-mirror-damage.md). Four options were on the table (A one-shot strikes, B perk-while-owned, C card economy, D plain), with B as the standing assistant recommendation. This turn the user proposed a fifth answer of their own: a bull dart adds +1/+2 defense/damage to the other darts of the turn. The assistant judged it better than the standing recommendation and sharpened it into rules language.

## Choice

**The Arsenal (bull charge), user-declared:** a bull dart **charges the rest of your turn** —

- **Single bull (25) = +1 charge; double bull (50) = +2 charge**
- The charge applies to every dart thrown **after** the bull in the same turn — turn-scoped, nothing carries over
- A charged dart deposits/damages its ring value **plus the charge** (T20 with a +2 charge = 4 armies into inner-20) — same three-way outcome as always: claim bigger / reinforce harder / hit deeper
- **Charges stack additively** (25 then 50 = +3 on the last dart)
- **All-bull turns fizzle** — nothing left to charge

Two assistant sharpenings, pending user veto (same convention as the base-mechanic assumptions):

1. **Bull-first only — "load, then fire."** No retroactive boosting of darts already thrown. Rationale: the engine scores per-dart and mid-turn flips chain (capture a box to 0, then reinforce the conquest with the rest of the turn); retroactive boosting would rewind state. Social bonus: aiming bull first telegraphs the raid — the table sees it coming.
2. **Applies everywhere**, claiming phase included (a charged claim seeds more armies).

Why it sings: the hardest target on the board becomes a strategic objective instead of a scoring footnote; exiled players ([exile & clawback](./risk-42-exile-and-clawback.md)) get a combo path back in — charge, then strike; and it's one turn-scoped number in state — no pickers, no new UI.

## Alternatives considered

- **A — one-shot strikes** (hit 50 → strike any territory, e.g. −3): artillery flavor, but sharks hit bulls more, so it *favors* precision.
- **B — perk-while-owned** (own bullseye → trebles deal 3 not 2): the prior assistant recommendation; superseded — the charge keeps the bull a live *throw* every turn rather than passive ownership.
- **C — card economy** (bull hit = draw a card): most classically Risk, most bookkeeping, feeds the shark.
- **D — plain territories**: no rider; wastes the dead-space gift.

## Consequences / open items

- Bulls are no longer dead-end boxes: the bull is an **amplifier** (boosts whatever you do next), not artillery. The 42 = 42 count stays sacred.
- State surface stays tiny: one turn-scoped charge counter, reset at turn end.
- Still design-stage: no Risk 42 code exists yet.
- **Next open question (posed, not ruled) — Q10 continent income**: recommendation A — while holding a full continent, **+1 dart per turn (Asia +2)**; alternatives B (darts into fully-held continents count double) and C (score-only at the horn) were weighed. Unanswered at close of turn.
