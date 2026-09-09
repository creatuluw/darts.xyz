---
type: Decision
title: "Risk 42 applyDart seam: DartHit carries singleRing for singles"
description: Context
tags: [risk-42, engine, api-seam, game-design]
status: accepted
timestamp: "2026-09-09T08:59:56.438Z"
---

# Risk 42 applyDart seam: DartHit carries singleRing for singles

## Context

Risk 42's board maps 40 territories onto dartboard boxes: for a given number, the **treble ring, inner single, and outer single are different territories** (inner boxes vs outer boxes vs treble wedges). The Trebles & Territories conquest engine's `applyDart` takes a plain `(segment, multiplier)` hit, which is sufficient there — but for Risk 42 that representation is **lossy**: a single `S5` cannot say whether it hit the inner or outer box.

## Decision

`risk-engine.ts`'s `applyDart(state, hit: DartHit)` takes a `DartHit` object:

```ts
interface DartHit {
    segment: number;
    multiplier: number;
    singleRing?: Ring; // required when multiplier === 1
}
```

Singles without `singleRing` throw (`'singles must carry singleRing (inner/outer)'`). Territory identity for singles is `${segment}-${singleRing}`.

## Alternatives considered

- Keep `(segment, multiplier)` like `conquest-engine.ts` — rejected: loses inner/outer distinction, which is the whole territory model of Risk 42.

## Consequences

- M2 wire-up: `RiskBoard.onHit` must emit a `DartHit` with `singleRing` (board knows which ring was clicked — this is free at the source).
- The seam is the only place ring info enters the engine; tests target `createGame`/`applyDart` at this seam (house TDD convention).
