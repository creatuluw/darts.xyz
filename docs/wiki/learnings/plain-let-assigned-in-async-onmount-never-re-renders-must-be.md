---
type: Learning
title: Plain `let` assigned in async onMount never re-renders — must be $state
description: The gotcha
tags: [svelte-5, reactivity, conquest, tv-cast, debugging]
timestamp: "2026-09-09T11:21:46.374Z"
---

# Plain `let` assigned in async onMount never re-renders — must be $state

## The gotcha

On the conquest live game page (`/match/conquest`), the TV/cast header button was wrapped in `{#if gameId}`, but `gameId` was declared as a plain `let` and only assigned **inside async callbacks in `onMount`** (after fetching the game). Svelte 5 has no way to know that assignment happened — no reactivity signal fires, so the `{#if}` block **never re-rendered**. The button existed in code but never appeared on **fresh games**; it only showed on resume by coincidence (different code path that happened to run with the value already set).

## The symptom shape to recognize

- Element renders sometimes / on some flows but not others, with no error anywhere.
- The variable is assigned **after mount**, asynchronously (fetch callback, event handler fired post-mount, etc.).
- Template bindings (`{#if}`, text interpolation) read it, but never update.

## The fix

One word: declare it with `$state` (PR #11):

```svelte
let gameId = $state('');
```

Any module-level component variable that the template reads and that is assigned asynchronously (or ever, after first render) must be a `$state` rune in Svelte 5. Plain `let` only works for values that are set synchronously before first render and never change.

## Related

- [[tv-second-screen-cast-views]] — the cast screens the button opens (classic + conquest).
- [[conquest-engine-and-live-game]] — the page where this bit.
- Note: `/match/risk` intentionally has **no** cast button yet — Risk 42 state is sessionStorage-only ([[risk-42-v1-persists-to-sessionstorage-stopgap-server-write-t]]), so a second screen has nothing to poll until server write-through lands at M3.
