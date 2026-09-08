---
type: Entity
title: E2E helpers
description: `e2e/helpers.ts` — the shared seeding/util module every Playwright spec imports. It owns the account-isolation and persistence gotchas so each spec doesn't redi
tags: [testing, e2e, playwright]
timestamp: "2026-09-07T19:59:06.906Z"
---

# E2E helpers

`e2e/helpers.ts` — the shared seeding/util module every Playwright spec imports. It owns the account-isolation and persistence gotchas so each spec doesn't rediscover them.

## Details

- **Location**: `e2e/helpers.ts`
- **Interface**: helpers for creating unique `e2e-*@test.local` accounts, seeding `darts_email` localStorage, and posting turns in the shape the UI sends
- **Configuration**: none; reads the dev-server base URL from Playwright config

## Key rules encoded

- `darts_email` localStorage must be set **raw**, not JSON-stringified (see [learning](../../learnings/darts-email-localstorage-stores-raw-email.md))
- Miss turns must post `dartsThrown ≥ 1` — a miss still counts darts thrown (see [learning](../../learnings/miss-turns-must-persist-with-dartsthrown-1.md))

## Relationships

- Part of the [test-suite](../artifacts/test-suite.md) artifact
- Posts against the REST API under `src/routes/api/`

## Lifecycle

- First added: 2026-09, alongside the initial E2E suite
