---
type: Learning
title: TS can't narrow $state inside closures — use $derived.by with local capture
description: Gotcha
tags: [svelte5, typescript, runes]
timestamp: "2026-09-07T20:54:52.430Z"
---

# TS can't narrow $state inside closures — use $derived.by with local capture

## Gotcha

When iterating/branching over a `$state` value (e.g. a `$state` array of players) inside a callback or closure, TypeScript cannot narrow it — the proxy type stays broad and `svelte-check` errors on property access (e.g. narrowing a union by an `if` inside `.map()` or an event handler).

## Fix / convention

Move the logic into a `$derived.by(() => { ... })` block and capture the `$state` value into a plain local `const` first. The local const is a snapshot TypeScript can narrow normally, and `$derived.by` keeps it reactive.

```svelte
const rotation = $derived.by(() => {
  const players = $state.players; // local capture — narrowable
  // ... if/property access narrows fine here
});
```

Seen in the live scorer when computing the throw rotation (`leftPlayers`/`rightPlayers`) for the 3+ player layout.

## Applies to

All Svelte 5 runes components in this repo (`src/lib/...`, `src/routes/...`). If `svelte-check` complains about narrowing inside a closure over `$state`, reach for `$derived.by` + local capture before casting.
