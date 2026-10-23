---
type: Concept
title: Risk 42 (proposed game mode)
description: What is it?
tags: [game-mode, design, proposal, risk]
timestamp: "2026-10-23T13:36:48.778Z"
---

# Risk 42 (proposed game mode)

## What is it?

A proposed **second** conquest game mode: actual Risk transplanted onto the dartboard via the exact **42 = 42 mapping** — a dartboard has 42 claimable areas (20 inner singles + 20 outer singles + outer bull + bullseye), matching the classic Risk board's 42 territories. Unlike [risk-darts-proposed-game-mode](./risk-darts-proposed-game-mode.md) (Trebles & Territories: Risk-*flavored* darts — 20 wedge-territories, HP sieges, no armies, timed sprint), this is the full Risk structure: armies, income, the classic conquest economy. Status: **shipped and playable** (see [risk-42-playable-game-risk-setup-fun-tab-match-risk-riskboar](../entities/risk-42-playable-game-risk-setup-fun-tab-match-risk-riskboar.md)); base game + bulls + continent income locked — two-feeder deposits ([decision](../../decisions/risk-42-base-mechanic-two-feeder-deposits.md)), mirror-damage attack rule ([decision](../../decisions/risk-42-attack-rule-mirror-damage.md)), the Arsenal dart bank ([amended 2026-10-23](../../decisions/risk-42-arsenal-becomes-a-bankable-dart-economy-bull-25-2-da.md), superseding the original [bull-charge ruling](../../decisions/risk-42-bulls-the-arsenal-charge-25-1-50-2.md)), and continent income ([decision](../../decisions/risk-42-continent-income.md)).

## Why does it matter?

It resolves the name collision: "Risk" legitimately belongs to this mode; Trebles & Territories keeps its own identity as Risk-*flavored*. The two coexist as **sprint vs marathon** — T&T for short timed games, Risk 42 for the long arc (income, build-ups, big pushes). It also makes the *whole* board matter (inner + outer singles + both bulls are claimable) — no lava zones, unlike T&T's bull-as-altar.

## Key rules / properties (current state)

- **42 claimable areas**: 20 inner singles, 20 outer singles, outer bull (25), bullseye (50).
- **Base mechanic — two-feeder army deposits (user-declared):** turn = 3 darts; any dart into a **blank** territory claims it; any dart into **own** territory = **+1 defensive army**; **treble = +2 armies to that wedge's inner box**; **double = +2 armies to that wedge's outer box**. Every box has exactly two feeders — a +1 direct hit and a +2 ring hit — so army income per box is identical across the whole board, **balanced by construction**.
- **Attack rule — mirror damage (Q3, LOCKED):** a dart into enemy territory subtracts its value (direct −1, ring −2); box at 0 → flips to attacker with 1 army. One rule now covers every dart: the value goes in the box — up on blank/own, down on enemy. Emergent: **mid-turn flips chain** — capture with an early dart, deposit into the fresh conquest with the rest of the turn.
- **Bulls — the Arsenal dart bank (Q4, LOCKED; amended 2026-10-23):** bulls pay in **darts**, not value — single bull (25) = **+2 darts**, bullseye (50) = **+3 darts**, added to the current pool **immediately in the same turn** (a bull on your last dart extends the turn). Players may **bank** leftovers: an "End turn · save N" button stops the turn early and every dart left (base + bonus) rolls into a saved pool that **accumulates** across turns; the next turn's gate itemizes it ("7 darts — base 3 · +4 saved", with the rolled-in amount persisted as `turn.carried`). Originally locked as the bull-**charge** — a damage boost, 25 = +1 / 50 = +2 ([decision](../../decisions/risk-42-bulls-the-arsenal-charge-25-1-50-2.md)) — now [superseded](../../decisions/risk-42-arsenal-becomes-a-bankable-dart-economy-bull-25-2-da.md): the bull pays in throws.
- **Superseded earlier proposal:** armies as raw dart multiplier (S/D/T = 1/2/3 armies wherever the dart lands) and the round-robin one-dart-each claiming phase — replaced by the feeder model and any-dart claiming during play.
- **Continent income — +1 dart per turn (Q10, LOCKED):** while holding a full continent, **+1 dart per turn (Asia +2)** — income paid in darts, not armies. Hard UI requirement that shipped with the ruling: the **dart budget for the upcoming turn is shown before the turn starts** (player sees 3/4/5+ darts and why — continent bonus / banked darts), never discovered mid-throw. See [decision](../../decisions/risk-42-continent-income.md).
- **Game start (locked):** random seeded deal of all 40 territories, 1 army each, 2 armies per box after the equal-deal amendment; no claiming phase — see [risk-42-game-start-random-deal](../../decisions/risk-42-game-start-random-deal.md) and [risk-42-deal-final-equal-2-armies-blanks](../../decisions/risk-42-deal-final-equal-2-armies-blanks.md).
- **Endgame:** Domination headline (own every box / reduce rivals to exile via [exile & clawback](../../decisions/risk-42-exile-and-clawback.md)); 170/301/501 Timed War clock as alt.

## Relationships

- [risk-darts-proposed-game-mode](./risk-darts-proposed-game-mode.md) — sibling mode (Trebles & Territories): the Risk-*flavored* sprint; the "Risk" name belongs to this 42-territory mode
- [risk-42-base-mechanic-two-feeder-deposits](../../decisions/risk-42-base-mechanic-two-feeder-deposits.md) — the user-locked base mechanic ruling
- [risk-42-attack-rule-mirror-damage](../../decisions/risk-42-attack-rule-mirror-damage.md) — the attack-rule ruling that completes the base game
- [risk-42-arsenal-becomes-a-bankable-dart-economy-bull-25-2-da](../../decisions/risk-42-arsenal-becomes-a-bankable-dart-economy-bull-25-2-da.md) — the current Arsenal ruling that answers Q4 (bull pays in savable darts)
- [risk-42-bulls-the-arsenal-charge-25-1-50-2](../../decisions/risk-42-bulls-the-arsenal-charge-25-1-50-2.md) — the original bull-charge ruling (superseded 2026-10-23)
- [risk-42-continent-income](../../decisions/risk-42-continent-income.md) — continent income + pre-turn budget display ruling that answers Q10
- [risk-42-engine-risk-engine-ts](../entities/risk-42-engine-risk-engine-ts.md) — the shipped pure engine implementing these rules
- [docs-risk-assets-risk-board-svgs-notes](../artifacts/docs-risk-assets-risk-board-svgs-notes.md) — research source: notes on the classic board's 42 territories / 6 continents and reinforcement math

## Source

- `docs/risk/notes.md` — Risk board research notes (42 territories, 6 continents) that seeded the 42=42 mapping
- Design conversation 2026-09-08 — base mechanic declared, assumptions + Q3 (attack rule) posed; attack rule locked (Q3 = B), Q4 (bulls) posed
- Design conversation 2026-09-09 — Arsenal bull-charge user-declared and locked (Q4); Q10 (continent income) locked as A; Q11 (claiming phase) resolved by the random deal
- Design conversation 2026-10-23 — Arsenal amended to a **bankable dart economy** (bull 25 = +2 darts, bullseye 50 = +3, savable/accumulating); shipped in engine + UI on PR #15
