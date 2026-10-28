---
type: Decision
title: "Risk 42 territory cards: conquest earns a card, sets cash in for dart bursts with escalation"
description: Context
tags: [risk-42, game-rules, cards, economy, engine]
status: accepted
timestamp: "2026-10-23T14:00:07.048Z"
---

# Risk 42 territory cards: conquest earns a card, sets cash in for dart bursts with escalation

## Context

User request (2026-10-23): like real Risk, every conquered territory should earn a card that can be cashed in at any moment for extra darts, with card faces/combo values balanced against the dart economy. User delegated the exact balance numbers to the design.

## The choice

- **Deck of 42 cards**, shuffled with the game seed: 40 territory cards (name + color face: **Infanterie / Cavalerie / Artillerie**) + **2 jokers**. Finite deck — it runs out late-game, damping runaways (like real Risk).
- **Every conquest = 1 card** (flipping an enemy box OR claiming a blank territory), so multiple cards per turn are possible.
- **Cash in at any moment during your own turn**, 3 cards per set:
  - 3× Infanterie = **+3 darts**
  - 3× Cavalerie = **+4 darts**
  - 3× Artillerie = **+5 darts**
  - 1 of each = **+6 darts**
  - Jokers are wild — they always complete the best available combo.
- **Escalation: +1 dart per set already cashed this game** (real-Risk style — accelerates the endgame sprint).
- **Balance rationale**: base budget is 3 darts + continent income; one set ≈ 1–2 turns of income, and you must first *earn* it by conquering.
- **UI**: card hand under the turn banner (mini cards with face + territory), select 3 → "Inleveren" → darts land directly in the pool; Regels-modal and TV views get the new texts.

## Alternatives considered

- Free hoarding with no cap — possible but risks a 6+ card double mega-payout in one turn.

## Consequences

Card deck state must join the persisted game state (conquest_games payload); conquest handler awards cards; cash-in is a new engine action. **Open sub-question (asked, awaiting user)**: mandatory cash-in at 5+ cards in hand (recommended YES, mirrors real Risk) vs fully free hoarding.
