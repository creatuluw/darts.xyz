---
type: Decision
title: "Risk 42 game start: random deal of all 40 territories (1 army each), no claiming phase"
description: Context
tags: [risk-42, game-rules, setup]
status: accepted
timestamp: "2026-09-09T08:20:22.578Z"
---

# Risk 42 game start: random deal of all 40 territories (1 army each), no claiming phase

## Context

Risk 42's original base mechanic (see [[decisions/risk-42-base-mechanic-two-feeder-deposits]]) had territories start blank and be **claimed by throwing** — "any dart claims a blank" / the earlier "throw one, claim one" idea. During spec Q&A the user called for the classic Risk deal instead:

> "just award each player random territories at the start of the game with the same rules as the game and the same defensive units on it"

## Decision

**Random deal at game start — no claiming phase.**

- App shuffles all 40 boxes and deals them as evenly as possible:
  - 2p → 20 each · 3p → 13/13/14 · 4p → 10 · 5p → 8 · 6p → 6–7
  - Remainder boxes go to random players
- Every dealt box starts with **1 army**, owned by its dealt player
- Turn one is already the full game: reinforce, attack, Arsenal — everything live from the first dart

## What this supersedes (partially)

- The **"any dart claims a blank"** clause of the base-mechanic decision: with all 40 boxes dealt, there are no blanks, so dart-claiming is dead.
- The feeders from the base mechanic **stay**: own-land dart +1, treble feeds inner box +2, double feeds outer box +2.

## Rationale

- Classic Risk feel — one rule set users already know, zero setup throws, instant war.
- The dart no longer decides where you start; the shuffle does.

## Still open

- Q12 — who throws first: bull-off ceremony (assistant's recommendation) vs random pick. Not yet answered.
