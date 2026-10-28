---
type: Decision
title: "Risk 42 reach rule: darts only count on own or adjacent territories"
description: Context
tags: [risk-42, game-rules, adjacency, engine]
status: accepted
timestamp: "2026-10-23T14:00:07.048Z"
---

# Risk 42 reach rule: darts only count on own or adjacent territories

## Context

User request (2026-10-23, live game /match/risk/27d56533): "je kunt alleen maar pijlen meetellen op je eigen landen of wanneer het aangrenzende landen zijn" — darts must only count on your own territories or adjacent ones; hits elsewhere pay nothing. Until now any box on the board was a valid target, which let players snipe far-away territories and ignored the board's geography.

## The choice

- **Adjacency table in the engine**: classic Risk land borders for our 40 territories (Japan/Madagascar already cut), PLUS **same-sector inner↔outer adjacency** — those boxes literally touch on the dartboard (e.g. Oekraïne ↔ Siberië in sector 1).
- **Valid targets = own territories ∪ territories adjacent to own.** A dart on any other box: consumed, **no effect** (armies/owner unchanged) — treated like a miss but visibly logged in the war log ("Ada gooit Japan — buiten bereik").
- **Bulls (Arsenal) and misses are exempt** — they keep working exactly as now.
- **Exile exemption**: a player with zero territories may hit ANYWHERE (otherwise they could never come back — the clawback path stays intact).
- **UI**: scorer board gets a subtle accent (thin green edge) on reachable boxes; out-of-range hits surface in the war log.

## Alternatives considered

- No restriction (status quo) — rejected: makes geography meaningless.
- Own-territories-only — rejected: too harsh, no way to attack at all.

## Rationale

Mirrors real Risk, where you can only attack from territories you own into adjacent ones. It makes board position matter, rewards continent consolidation, and gives the war log readable "out of reach" flavor events.

## Consequences

New exported adjacency data + a target-validity check in `applyDart` (TDD, new worktree, PR per the house loop); board component highlights reachable boxes; exile check must run before the adjacency check.
