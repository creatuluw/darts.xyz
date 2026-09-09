---
type: Learning
title: Fresh SvelteKit worktree needs `svelte-kit sync` before tests run
description: "Gotcha from the Risk 42 M1 build (2026-09-09): a freshly created SvelteKit worktree (deps junctioned from the main checkout) is **missing the generated `.svelte"
tags: [worktree, sveltekit, vitest, tooling]
timestamp: "2026-09-09T08:59:56.436Z"
---

# Fresh SvelteKit worktree needs `svelte-kit sync` before tests run

Gotcha from the Risk 42 M1 build (2026-09-09): a freshly created SvelteKit worktree (deps junctioned from the main checkout) is **missing the generated `.svelte-kit/tsconfig.json`**, so vitest/svelte-check fail with unresolvable `$lib` / ambient types before any test runs.

Fix: run `npx svelte-kit sync` once in the new worktree. Part of the standard [worktree feature loop](../rules/worktree-feature-loop.md) bootstrap — do it right after creating the worktree and linking deps, before the first red cycle.
