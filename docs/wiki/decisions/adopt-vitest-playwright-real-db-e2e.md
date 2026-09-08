---
type: Decision
title: Adopt Vitest + Playwright test stack with real-DB E2E
description: Context
tags: [testing, vitest, playwright, e2e]
status: accepted
timestamp: "2026-09-07T19:58:54.367Z"
---

# Adopt Vitest + Playwright test stack with real-DB E2E

## Context
The project had zero automated tests despite containing ~500 lines of pure game-logic TypeScript (`src/lib/game/`) and a REST API + UI flow worth protecting. The turn built the full test layer in one pass.

## Choice
- **Unit tests: Vitest** (`npm run test:unit`) covering `scoring.ts`, `match-engine.ts`, `checkout-suggestions.ts`, `stats-engine.ts`, plus a `full-match.test.ts` simulation mirroring `docs/gameplay-e2e.md`.
- **E2E tests: Playwright** (`npm run test:e2e`) booting the dev server against the **real PostgreSQL DB** (no mock backend).
- **E2E isolation strategy**: every test creates data under unique `e2e-*@test.local` email accounts and archives test players afterward; Playwright runs with `workers: 1` (sequential) since all tests share the one DB.
- **Skip component-level Svelte tests** (jsdom / svelte-testing-library). Game logic is covered by unit tests; UI behavior is covered by browser E2E. Add component tests only when a component has complex isolated behavior worth testing.

## Alternatives considered
- **Jest** — Vitest is native to the Vite/SvelteKit toolchain and needs only a `$lib` alias config.
- **Component tests (svelte-testing-library)** — rejected: extra dependency + setup for coverage the unit/E2E layers already provide.
- **Mocked API for E2E** — rejected: the real value is verifying DB constraints, persistence, and the dev-server wiring; unique account scoping gives isolation without mocks.

## Consequences
- Config lives in `vitest.config.ts` (`$lib` alias) and `playwright.config.ts` (webServer on port 5174, sequential workers).
- E2E requires a reachable DB (dev environment) — CI would need a Postgres service.
- E2E suite is slow-ish by design (14 tests, real server + real DB) — acceptable, kept small.
