---
type: Decision
title: Heat momentum as the core balancing mechanic for the Risk-style conquest darts mode
description: Context
tags: [game-design, conquest-mode, balance, heat]
status: superseded
timestamp: "2026-09-07T20:28:49.059Z"
---

# Heat momentum as the core balancing mechanic for the Risk-style conquest darts mode

> **SUPERSEDED** by [Risk-territory darts over heat economies](./risk-territory-darts-over-heat-economies.md) — the user rolled the design back past this entire direction ("wrong direction"). Heat economies are out.

## Context

Brainstorming a Risk-style conquest darts game mode (darts = dice, wedges = territories) for mixed-skill groups. The statistical problem: a shark generates ~3x the damage of a casual player (casual ~35% hits aimed wedge / ~2% treble; pub-decent ~60% / ~10%; shark ~85% / ~25%+). Pure conquest means the shark wins every time.

Key insight: **skill is the mean, streaks are the variance. A game that rewards *recent form* instead of *average form* automatically compresses skill gaps** — nobody, shark included, controls *when* they run hot.

## Choice

Make momentum ("Heat") the whole identity of the game:

1. **Every dart is productive** — hit neutral land → claim; enemy land → damage (single 1 / double 2 / treble 3); own land → reinforce (+1 defense). Zero dead throws, so a casual's random dart always does something.
2. **Heat builds on attack/claim darts** — 3 in a row (across turns) → **ON FIRE** next turn, announced via the existing caller soundboard ("HE'S ON FIRE").
3. **Heat is stealable** — hit a player who's ON FIRE → steal their heat / cool them instantly. Hot players paint a target on themselves.

Self-balancing loop: get hot → gain power → become the table's target → get sniped → cool down → someone else catches fire. The shark runs hot more often and gets ganged up on more often — the Risk "leader's empire" dynamic, but mechanical instead of social.

## Alternatives considered

- **Pure conquest** — rejected: shark wins deterministically.
- **Dice-style variance only** — rejected: feels unearned; heat variance has "luck with skill flavor."

## Open question (unresolved at time of writing)

What ON FIRE actually does — originally pitched as three effects:

- **The 4th dart** — one extra dart that turn; simple, darts-native.
- **Artillery** — all darts deal +1 damage that turn (early lean for balance; accelerates game without gambling the heat economy away).
- **All-in assault** — declare a target; land = instant capture, miss = lose ALL heat; maximum drama.

**Updated 2026-09-07: expanded to a 12-option heat/streak bonus toolbox** (user asked for more options), grouped by balance angle:

- **Engine** (reliable, repeatable fun): Artillery (+1 damage); The 4th Dart (one extra throw); **Rapid Fire** — while hot, keep throwing after every productive dart, stop on a dead dart, max 6 (most darts-native, crowd-pleaser); Blitz (trebles instantly capture a territory at any HP).
- **Economy** (heat as stealable currency): **Heat Raid** — darts hitting enemy land while hot steal 1 heat from that territory's owner on top of damage; **Bounty** — going ON FIRE auto-posts a bounty on you: whoever damages you next takes ALL your heat plus a free 4th dart; Tax Man — hitting a hot player's territory pays them 1 heat.
- **Power** (Risk-flavored control): **Dictator** — while hot, YOU choose who throws next; Splash Damage — territories captured while hot deal 1 damage to their board-neighbors; Paradrop — while hot, one dart may target ANY wedge as an instant reinforce-2.
- **Equalizer**: **Kindling** — players with the fewest territories build heat at double rate (strongest anti-runaway lever in the catalog); Ember — streak broken by a *missed* dart keeps half your heat.

Design heuristic that emerged: **prefer bonuses that make the hot player simultaneously more powerful AND more hunted** — self-limiting, because the table snipes them.

Assistant's picks: **Rapid Fire** (core) + **Kindling** (balance backbone) + **Bounty or Dictator** (chaos garnish). Combos awaiting user choice: **A) Party Build** = Rapid Fire + Kindling + Bounty; **B) Strategy Build** = Artillery + Heat Raid + Dictator; **C) Mix** = user's own 2–3 picks.

Also tabled for later tuning: holding a full arc of neighboring numbers ("kingdom") = +1 dart per turn, Risk continent style — powerful but makes you the biggest empire.

**Updated 2026-09-07T20:48:39.497Z — kingdom rule ruled by user (still proposal-stage):** territories are **sub-segments, not whole wedges**. Each number splits into 4 claimable areas in a vertical stack: single under (inner), treble, single above (outer), double. Hold **3 neighbouring areas all yours** → **+1 extra dart every turn** (not once). The game **starts at the 1 wedge**. This supersedes the "full arc of numbers" framing — kingdoms are built *within* a number first; multi-wedge continents may layer on later.

## Consequences

- Any future conquest-mode implementation (scoring, heat tracking, soundboard triggers) should follow this model.
- Awaiting user decision on the bonus combo (A Party / B Strategy / C Mix) before the ON FIRE effect set is locked in.

**Updated 2026-09-07T20:50:30.157Z — ON FIRE ruled by user: Artillery, and only Artillery** (no combo). Now claim-flavored: while hot, every dart adds +1 to its claim value (singles claim 2, trebles claim 4). The damage framing throughout this decision is superseded by claim-based ownership — see [Claim-based territory ownership replaces the damage-flip model](./claim-based-territory-ownership.md).
