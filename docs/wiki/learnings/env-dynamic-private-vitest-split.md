---
type: Learning
title: $env/dynamic/private doesn't resolve in vitest — split the pure logic into its own module
description: Vitest can't resolve `$env/dynamic/private` — importing it in a module under test fails at import time.
tags: [vitest, sveltekit, testing, gotcha]
timestamp: "2026-09-08T21:25:12.550Z"
---

# $env/dynamic/private doesn't resolve in vitest — split the pure logic into its own module

Vitest can't resolve `$env/dynamic/private` — importing it in a module under test fails at import time.

Fix pattern (used for the commentary pipeline): split the module. `src/lib/game/commentary-prompt.ts` is the **pure** part (prompt building, persona logic — fully unit-tested), while the `$env` import stays in the API route/server module that isn't unit-tested. Keeps modules testable without mocking SvelteKit env shims.
