---
type: Concept
title: Risk Darts (proposed game mode)
description: What is it?
tags: [game-mode, design, proposal, risk]
timestamp: "2026-09-07T21:24:50.813Z"
---

# Risk Darts (proposed game mode)

## What is it?

A game mode that adapts Risk-style territory conquest to the dartboard: **the board IS the map** — wedges are territories, darts are the dice, trebles are artillery. Final name **Trebles and Territories** (resolved from working title "Conquest" — see Question 7). Designed for a mixed crowd (one shark + casuals) where **everyone must matter until the end**. No longer proposed-only: the spec is locked and milestones M1–M2 are shipped (see [conquest engine](../entities/conquest-engine-and-live-game.md)); M3 persistence and beyond are pending.

## Standing baseline

- **Treble-frontier founding** — a blank wedge can only be founded by a **treble** (founds at full 3 HP); singles/doubles into blank land are dead darts, strict. Exception: Bull Altar resurrection claims a blank at 1 HP without a treble. Creates the settler (treble-skilled) vs raider (casual) role split. (See [Treble-frontier founding decision](../../decisions/treble-frontier-founding-requires-treble.md).)
- **Combat: Siege map (B) — LOCKED.** 3 HP per territory; single/double/treble = 1/2/3 damage vs enemy land, capture at 0 → yours at 1 HP; hitting your own land reinforces +1 HP (cap 3).
- **Fixed, colored continents** — six continents over the 20 wedges, concrete groupings: **{20,18,12}, {16,11,9}, {19,13,5}, {17,6,2}, {15,10,8,7}, {14,4,3,1}**. The last is a four-wedge "slums" continent of low-aim numbers — cheap to complete while others fight over the Gold Coast (emergent strategy). Board renders in continent colors for instant map readability — palette locked to the [Coolors 10-color band decision](../../decisions/trebles-territories-board-palette-coolors.md) (Gold Coast `#FFB703`, Highgate `#8ECAE6`, Iron Ridge `#BB3E03`, The Pass `#219EBC`, Mercia `#126782`, Fourlands `#3A6787`).
- **Bull is NOT a territory** — it is the **Bull Altar**, resurrection-only (see [Bull Altar decision](../../decisions/bull-altar-resurrection-replaces-siege-lock.md)).
- **Death & resurrection (Bull Altar + Last Stand amendment):** dead = 0 territories; on your turn throw all 3 darts at bull. Bull hit = resurrect, but **blank territories first** (claim any empty wedge, your choice); no blanks → steal one territory from the **next player in turn order only**. The robbed player gets a **bull save**: if they also hit bullseye the theft is DENIED and the dead player stays dead (restarts the bull hunt). Miss = stay dead, retry next turn. Remaining darts keep attacking after a resurrection. See [Last Stand amendment](../../decisions/last-stand-amendment-blank-first-resurrection.md).
- **Timed War is the default end mode** — clock measured in **turns per player** (equal throws), branded **170** (sprint, ~14 turns), **301** (default, ~25 turns), **501** (marathon). Score at the end: 1 pt/territory, +2 per full continent. Full 1st/2nd/3rd ranking for league tables; tiebreak = one sudden-death dart each, nearest bull. (The former +2 bull-as-capital bonus is obsolete now that the bull is the altar — needs a scoring pass. See [turns-clock decision](../../decisions/timed-war-clock-in-turns-per-player.md).)
- **Domination** is a selectable alt mode for sprint nights — **hold 7 territories or any full continent = instant win**.
- **Shanghai bonus** — single + double + treble of the same wedge in one turn (any order) = **+1 dart next turn**. Auto-detected by the app, with a "SHANGHAI!" caller clip. On enemy land it's a guaranteed capture (1+2+3 = 6 damage vs 3 HP, overkill reinforces); on your own land the feat still counts even though reinforcement is capped. Works in both 301-clock and Domination; dead players on the Bull Altar can't Shanghai (bull has no treble). Too rare (~1-in-100 turns) to need caps. (See [Shanghai bonus decision](../../decisions/shanghai-feat-grants-1-dart-the-next-turn.md).)
- Balancing is **social, not mechanical** — the leader gets ganged up on; the graveyard of dead players aims at empty land or the neighbor, turning seating order into politics.

## Open questions

### Question 6: how does the map start? — RESOLVED

Treble-frontier founding (see baseline): all 20 wedges start blank; only a treble founds. Rules out cold-start free claims, the founding dart, and snake draft.

### Question 7 (live): veto pass + naming

- One veto pass over the full read-back (treble-frontier consequences, turns-clock 170/301/501 mappings, concrete continent groupings, domination trigger).
- **Name the game — RESOLVED:** **Trebles and Territories** (chosen in the spec turn). The [implementation spec](../artifacts/trebles-territories-implementation-spec.md) The [implementation spec](../artifacts/trebles-territories-implementation-spec.md) then fixed the preset ladder (201→5001 band, since [re-banded to 51–1501 in steps of 50](../../decisions/preset-ladder-51-1501-steps-of-50.md), **301 the default**), each preset labeled with estimated play duration, plus the [LLM commentary](../entities/llm-commentary-trebles-territories.md) tab.

### Pending sharpenings from the Last Stand turn — RULED (spec §02, shipped)

All three were locked in the [implementation spec](../artifacts/trebles-territories-implementation-spec.md) §02 ("the complete ruleset as locked") and implemented in the [conquest engine](../entities/conquest-engine-and-live-game.md):

- Any bull counts (outer 25 or inner 50 — one tier, no 25/50 split) for both the attacker's resurrection hit and the victim's save dart.
- The defender's save is one free dart, thrown immediately on the spot — it never counts against the dart budget.
- "Next player" skips other dead players (the victim must own ≥1 territory); the attacker picks which territory. Duels never chain — a dead victim can't be robbed.

## Discard pile (rolled back — re-proposable, NOT standing)

- **Insurgents:** lose all land → keep throwing, attack anyone, any neutral wedge hit becomes your new homeland. Replaced by the Bull Altar resurrection mechanic.
- **Steal ANY territory on a bull hit:** the original Bull Altar theft clause — replaced by the Last Stand amendment (blank-first, next-player-only, defender bull save).
- **Claim-based ownership detail:** territory belongs to highest *cumulative claims* on a wedge, ties to incumbent (see deprecated [claim-based ownership decision](../../decisions/claim-based-territory-ownership.md)).
- **ON FIRE = artillery:** while hot, darts add +1 claim value (see superseded [heat momentum decision](../../decisions/heat-momentum-core-balancing-mechanic.md)).
- **Sub-segment granularity:** each wedge = 4 claimable sub-areas; 3 neighbouring sub-areas of one number = **kingdom** → +1 dart per turn.
- **Start at the 1 wedge.**
- **Claim valuation options:** flat (S1/D2/T3) vs real dart score vs face value. (The fixed premium/mid/cheap continent balancing now covers this role instead.)

## Why does it matter?

It targets the mixed-skill-table problem without artificial handicap mechanics: the table gangs up on the leader (balancing IS social), every throw matters (a casual's sloppy dart still chips an enemy or saves at the altar), the timed budget guarantees the ending is always a tense raid — and the treble-frontier rule splits the table into settlers and raiders from the first throw. Death is a duel at the bull aimed at empty land or your neighbor, not a pity exit.

## Relationships

- [Treble-frontier founding: blank territories require a treble to claim](../../decisions/treble-frontier-founding-requires-treble.md) — resolves Question 6; blank land only founded by trebles (settler/raider split)
- [Timed War clock measured in turns per player, branded 170/301/501](../../decisions/timed-war-clock-in-turns-per-player.md) — amends the Timed War budget: equal turns per player, 301 default
- [Bull Altar resurrection replaces insurgents; Siege map B locked](../../decisions/bull-altar-resurrection-replaces-siege-lock.md) — locks combat model and the death/resurrection loop (resolves Question 4, supersedes the insurgent rule)
- [Last Stand amendment: blank-first resurrection, next-player robbery, defender bull save](../../decisions/last-stand-amendment-blank-first-resurrection.md) — amends the Bull Altar theft clause: blanks first, next-player-only robbery, defender bull save denies
- [Shanghai feat grants +1 dart the next turn](../../decisions/shanghai-feat-grants-1-dart-the-next-turn.md) — the momentum reward, distilled into a named feat: S+D+T of one wedge in a turn buys an extra dart next turn
- [Timed War default endgame, fixed continents, no elimination](../../decisions/timed-war-default-endgame-fixed-continents.md) — locks the end mode and continents (its insurgent clause is superseded by the Bull Altar decision; its default-21 budget clause is amended by the turns-clock decision)
- [Risk-territory darts over heat economies](../../decisions/risk-territory-darts-over-heat-economies.md) — the rollback anchor decision
- [Conquest engine (conquest-engine.ts + live conquest game)](../entities/conquest-engine-and-live-game.md) — the shipped implementation: its own pure reducer (modelled on `match-engine.ts`), reusing `Dartboard.svelte` segment geometry; wedge-based territory state instead of leg/set scoring.

## Source

- `.specs/trebles-and-territories/spec.html` — the locked implementation spec (§02 rules, §03 presets, §06 engine/API/milestones); founding locked in the Treble-frontier decision, clock amended by the turns-clock decision, combat and death rulings in the Bull Altar decision, theft rules amended by the Last Stand decision, momentum via the Shanghai bonus decision.
