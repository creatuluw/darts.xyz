---
type: Learning
title: Vitest can't see type holes — esbuild strips types; svelte-check is the only net
description: The gotcha
tags: [vitest, svelte-check, typescript, testing, tooling]
timestamp: "2026-09-09T10:47:22.586Z"
---

# Vitest can't see type holes — esbuild strips types; svelte-check is the only net

## The gotcha

Vitest runs through **esbuild, which strips TypeScript types at transform time** — a module can have real type holes (missing interface fields, wrong shapes) and every test still passes. `svelte-check` is the only net that catches them.

Caught red-handed during Risk 42 M2.3 (2026-09-09): a failed atomic edit silently dropped the M1.6 `tie` field from the engine's endgame interface. **192 vitest tests stayed green**; only `svelte-check` flagged the hole.

## The baseline problem

Master carries **~62 pre-existing `svelte-check` errors** (noise baseline). "Zero errors repo-wide" is not achievable today — filter the output to your changed files instead, e.g.:

```bash
npx svelte-check --output machine | grep -E "your-file|your-folder"
```

## The guideline

- Vitest green ≠ type-correct. Before any PR that touches TS interfaces, run `svelte-check` on the changed files.
- Treat the master error count as a baseline: your files must add **0** new errors, not fix the world.

Related: [[ts-can-t-narrow-state-in-closures]], [[fresh-sveltekit-worktree-needs-svelte-kit-sync-before-tests-]]
