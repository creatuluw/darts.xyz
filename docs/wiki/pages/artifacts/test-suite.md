---
type: Artifact
title: Test suite
description: "The automated test layer for dart.monster: 67 Vitest unit tests over the pure game modules, plus 14 Playwright E2E tests (API lifecycle + real-browser UI) that "
tags: [testing, vitest, playwright, e2e]
timestamp: "2026-09-07T19:58:54.367Z"
---

# Test suite

The automated test layer for dart.monster: 67 Vitest unit tests over the pure game modules, plus 14 Playwright E2E tests (API lifecycle + real-browser UI) that boot the dev server against the real PostgreSQL DB.

## Details

- **Location**: unit tests live next to sources as `src/lib/game/*.test.ts`; E2E lives in `e2e/` (`pages.spec.ts`, `api-match-flow.spec.ts`, `match-ui.spec.ts`, `helpers.ts`)
- **Interface**: `npm run test:unit` (Vitest), `npm run test:e2e` (Playwright)
- **Configuration**: `vitest.config.ts` (`$lib` alias); `playwright.config.ts` (webServer port 5174, `workers: 1` — tests share the real DB so they run sequentially)

## Coverage

- **scoring.test.ts** — dart math, bust rules (overshoot / landing on 1 / 0-without-double), checkout detection, score reversion
- **match-engine.test.ts** — turn rotation, bust revert-and-pass, leg/set/match majority wins, first-thrower alternation, abandon, immutability
- **checkout-suggestions.test.ts** — every option sums correctly and ends on a double; impossible finishes
- **stats-engine.test.ts** — 180/140+/100+ counting, checkout %, 3-dart average, last-20-legs window
- **full-match.test.ts** — full 501 best-of-3×best-of-3 simulation mirroring `docs/gameplay-e2e.md`
- **e2e/pages.spec.ts** — every page renders behind the email gate; 404 fallback
- **e2e/api-match-flow.spec.ts** — full match lifecycle via API, bust persistence, archive/restore, validation, 404s
- **e2e/match-ui.spec.ts** — full 301 match through the numpad to the "wins!" overlay; undo/clear; setup flow

## Isolation

E2E creates data under unique `e2e-*@test.local` accounts and archives test players afterward — real account views are untouched.

## Relationships

- [e2e-helpers](../entities/e2e-helpers.md) — shared seeding/util module for the E2E specs
- Implements the [adopt-vitest-playwright-test-stack](../../decisions/adopt-vitest-playwright-real-db-e2e.md) decision (see decisions/)
- Tests the modules documented under `src/lib/game/` in [file tree](../../architecture/file-tree.md)

## Lifecycle

- First added: 2026-09 — initial suite built in one pass; component-level Svelte tests deliberately skipped (logic covered by unit, UI by E2E)
