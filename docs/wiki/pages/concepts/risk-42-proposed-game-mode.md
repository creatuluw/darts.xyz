---
type: Concept
title: Risk 42 (proposed game mode)
description: What is it?
tags: [game-mode, design, proposal, risk]
timestamp: "2026-09-09T08:05:22.709Z"
---

# Risk 42 (proposed game mode)

## What is it?

A proposed **second** conquest game mode: actual Risk transplanted onto the dartboard via the exact **42 = 42 mapping** — a dartboard has 42 claimable areas (20 inner singles + 20 outer singles + outer bull + bullseye), matching the classic Risk board's 42 territories. Unlike [risk-darts-proposed-game-mode](./risk-darts-proposed-game-mode.md) (Trebles & Territories: Risk-*flavored* darts — 20 wedge-territories, HP sieges, no armies, timed sprint), this is the full Risk structure: armies, income, the classic conquest economy. Status: **brainstorm, base game + bulls + continent income locked** — two-feeder deposits ([decision](../../decisions/risk-42-base-mechanic-two-feeder-deposits.md)), mirror-damage attack rule ([decision](../../decisions/risk-42-attack-rule-mirror-damage.md)), the Arsenal bull-charge ([decision](../../decisions/risk-42-bulls-the-arsenal-charge-25-1-50-2.md)), and continent income ([decision](../../decisions/risk-42-continent-income.md)) are all user-locked; the open frontier is the claiming phase (Q11, posed), small confirmations (first player, caps, game end), then the name.

## Why does it matter?

It resolves the name collision: "Risk" legitimately belongs to this mode; Trebles & Territories keeps its own identity as Risk-*flavored*. The two coexist as **sprint vs marathon** — T&T for short timed games, Risk 42 for the long arc (income, build-ups, big pushes). It also makes the *whole* board matter (inner + outer singles + both bulls are claimable) — no lava zones, unlike T&T's bull-as-altar.

## Key rules / properties (current proposal state)

- **42 claimable areas**: 20 inner singles, 20 outer singles, outer bull (25), bullseye (50).
- **Base mechanic — two-feeder army deposits (user-declared):** turn = 3 darts; any dart into a **blank** territory claims it; any dart into **own** territory = **+1 defensive army**; **treble = +2 armies to that wedge's inner box**; **double = +2 armies to that wedge's outer box**. Every box has exactly two feeders — a +1 direct hit and a +2 ring hit — so army income per box is identical across the whole board, **balanced by construction**.
- **Two assumptions pending user veto:** (1) *claim-via-ring* — a treble into a blank inner box claims it with 2 armies (a deposit is a deposit); (2) *no cap* — armies stack without limit, classic-Risk style.
- **Attack rule — mirror damage (Q3, LOCKED):** a dart into enemy territory subtracts its value (direct −1, ring −2); box at 0 → flips to attacker with 1 army. One rule now covers every dart: the value goes in the box — up on blank/own, down on enemy. Emergent: **mid-turn flips chain** — capture with an early dart, deposit into the fresh conquest with the rest of the turn.
- **Bulls — the Arsenal (Q4, LOCKED):** a bull dart **charges the rest of the turn** — single bull = **+1**, double bull = **+2** added to every dart thrown *after* it, this turn only; stacks additively (25 then 50 = +3); a charged dart deposits/damages ring value + charge; applies in the claiming phase too; all-bull turns fizzle. **Load, then fire** — bull-first only, no retroactive boosting (bull-first is assistant sharpening pending veto, like the two base assumptions above). The bull becomes an amplifier, not artillery.
- **Superseded earlier proposal:** armies as raw dart multiplier (S/D/T = 1/2/3 armies wherever the dart lands) and the round-robin one-dart-each claiming phase — replaced by the feeder model and any-dart claiming during play (whether a separate claiming phase survives is unconfirmed).
- **Continent income — +1 dart per turn (Q10, LOCKED):** while holding a full continent, **+1 dart per turn (Asia +2)** — income paid in darts, not armies. Hard UI requirement that shipped with the ruling: the **dart budget for the upcoming turn is shown before the turn starts** (player sees 3/4/5 darts and why — continent bonus / Arsenal carryover), never discovered mid-throw. See [decision](../../decisions/risk-42-continent-income.md).
- **Q11 (open, posed) — claiming phase:** recommendation A — *no phases at all*; board starts blank and the same blank/own/enemy rule governs every dart from throw one (claiming emerges, dead-dart edge cases never exist) vs B — scheduled round-robin claiming then war. Unanswered.
- **Also previewed but unanswered:** first player, army caps/inflation, game end (Domination headline + clock alt already ruled at mode level), mode name.
- Design stakes: without armies this collapses back into T&T-with-more-segments; with them you get the Risk arc T&T deliberately skipped. Fat stacks concentrate where everyone is watching — the table shoots the leader.

## Relationships

- [risk-darts-proposed-game-mode](./risk-darts-proposed-game-mode.md) — sibling mode (Trebles & Territories): the Risk-*flavored* sprint; the "Risk" name belongs to this 42-territory mode
- [risk-42-base-mechanic-two-feeder-deposits](../../decisions/risk-42-base-mechanic-two-feeder-deposits.md) — the user-locked base mechanic ruling
- [risk-42-attack-rule-mirror-damage](../../decisions/risk-42-attack-rule-mirror-damage.md) — the attack-rule ruling that completes the base game
- [risk-42-bulls-the-arsenal-charge-25-1-50-2](../../decisions/risk-42-bulls-the-arsenal-charge-25-1-50-2.md) — the Arsenal bull-charge ruling that answers Q4
- [risk-42-continent-income](../../decisions/risk-42-continent-income.md) — continent income + pre-turn budget display ruling that answers Q10
- [docs-risk-assets-risk-board-svgs-notes](../artifacts/docs-risk-assets-risk-board-svgs-notes.md) — research source: notes on the classic board's 42 territories / 6 continents and reinforcement math
- [conquest-engine-and-live-game](../entities/conquest-engine-and-live-game.md) — T&T's shipped engine; likely reuse candidate for board geometry / turn plumbing if this mode gets built

## Source

- `docs/risk/notes.md` — Risk board research notes (42 territories, 6 continents) that seeded the 42=42 mapping
- Design conversation 2026-09-08 — base mechanic declared, assumptions + Q3 (attack rule) posed; attack rule locked (Q3 = B), Q4 (bulls) posed
- Design conversation 2026-09-09 — Arsenal bull-charge user-declared and locked (Q4); Q10 (continent income) locked as A (+1 dart per full continent, Asia +2) with the pre-turn budget display requirement; Q11 (claiming phase) posed with recommendation A, unanswered
