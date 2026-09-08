---
type: Learning
title: structuredClone can't clone Svelte 5 $state proxies — pass $state.snapshot() at the engine boundary
description: Gotcha
tags: [svelte5, state-proxy, structuredClone, engine-boundary]
timestamp: "2026-09-07T22:42:23.978Z"
---

# structuredClone can't clone Svelte 5 $state proxies — pass $state.snapshot() at the engine boundary

## Gotcha

Passing a Svelte 5 `$state` proxy to pure engine code that internally does
`structuredClone(state)` throws — `structuredClone` cannot clone the reactive
proxy. Symptom: engine calls silently fail / throw with darts never registering
(discovered wiring `/match/conquest` to `conquest-engine.ts`: clicks emitted,
engine state never changed).

## Fix

Snapshot at the UI→engine boundary:

```ts
const next = applyDart($state.snapshot(game), segment, multiplier);
```

`$state.snapshot()` returns a deep plain clone the engine can freely clone/own.

## Related Svelte 5 footguns hit in the same session

- A local variable named `state` collides with the `$state` rune — rename (e.g. `game`).
- `$state<T>()` generic call syntax is not valid — annotate the initializer instead.

## Source

- `src/routes/match/conquest` wiring fix; engine at `src/lib/game/conquest-engine.ts`
