---
type: Decision
title: "Risk 42 endgame: Domination as headline, 170/301/501 clock as alt — mirroring T&T"
description: Context
tags: [risk-42, game-design, endgame, defaults]
status: accepted
timestamp: "2026-09-09T07:55:11.096Z"
---

# Risk 42 endgame: Domination as headline, 170/301/501 clock as alt — mirroring T&T

## Context

Risk 42 (the 40-numbered-box conquest mode, distinct from Trebles & Territories) needs a default end mode for its headline presentation. This was Q7 in the design Q&A. T&T already locked the opposite: Timed War clock as its default, with Domination as the selectable alt (see [[timed-war-default-endgame-fixed-continents]], [[timed-war-clock-in-turns-per-player]]). The user picked option **C**.

## Decision

**Domination is Risk 42's headline/default end mode; the 170/301/501 timed clock is the "civilized" alternative.**

The two games mirror each other on purpose:

- **Trebles & Territories** — defaults to the Timed War clock; Domination is its alt.
- **Risk 42** — defaults to Domination; the clock is its alt.

Each game leads with its distinct identity, and each advertises the other's mode as its alternative — a player who finds one too soft/hard knows exactly where to switch.

## Alternatives considered

- Clock-as-headline for Risk 42 too (T&T's framing) — rejected: it would erase the identity difference between the two games; the mirror is the point.

## Rationale

Risk 42's identity is the purist Risk arc (mirror-damage combat, reduce-to-zero capture, see [[risk-42-attack-rule-mirror-damage]]); Domination is that arc's natural finish. The clock stays one click away for the mixed/civilized crowd, exactly mirroring how T&T keeps Domination one click away from its clock default.

## Consequences

- Setup UI defaults for Risk 42: Domination on, clock as toggle (mirroring T&T's Fun-tab toggle).
- Design questions that reference "end mode" now resolve per-game: T&T defaults clock-first, Risk 42 defaults Domination-first.

## Status

Q7 locked 2026-09-09 (design Q&A, answer "C"). Next open question: Q8 — landless players (elimination vs exile & clawback vs Bull Altar port).
