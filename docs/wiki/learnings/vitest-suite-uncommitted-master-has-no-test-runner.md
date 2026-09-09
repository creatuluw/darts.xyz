---
type: Learning
title: Vitest/Playwright suite is uncommitted — master branches have no test runner
description: "UPDATE 2026-09-08: the suite is committed on feature/trebles-territories (PR #2, 112 unit tests) — master branches still have no test runner until the PR merges"
tags: [testing, vitest, playwright, master, smoke, gotcha]
timestamp: "2026-09-09T10:21:01.339Z"
---

# Vitest/Playwright suite is uncommitted — master branches have no test runner

The 67 Vitest + 14 Playwright tests documented in [[test-suite]] live **uncommitted in the main working tree** — they are NOT committed to master. Any branch cut from master has no test runner at all (`npm run test:unit` / `test:e2e` don't exist there).

How to verify work on a master branch instead:

- Gate = `npm run check` + `npm run build` + a small runnable smoke script under `scripts/` executed via `tsx` (already a dep) — the pattern used by remember-me PR #1 (`scripts/smoke-email-store.ts`, 5 assert-based scenarios).
- `npm run check` shows **4 pre-existing errors in `Dartboard.svelte` on master** — confirm errors are yours before fixing.
- Reconciles with [[logic-todos-must-use-tdd-skill]]: TDD applies in the main tree where the runner exists; on a master branch the smoke script is the one runnable check left behind.
- Fold branch smoke scripts into the Vitest suite once it lands on master.

**Update 2026-09-08** — the suite landed on `feature/trebles-territories` (commit `fa83191`, PR #2), now grown to **112 unit tests**. The smoke-script guidance above still applies to any branch cut from master until PR #2 merges.

**Update 2026-09-09 — RESOLVED** — master now has the full test runner: PR #8 (Risk 42 engine) merged at `0dd53f1` and the main checkout verifies **188/188 unit tests green**. Any branch cut from master now inherits Vitest + Playwright; the smoke-script workaround below is obsolete history.
