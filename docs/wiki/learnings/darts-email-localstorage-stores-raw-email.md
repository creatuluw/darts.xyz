---
type: Learning
title: darts_email localStorage key stores the email raw, not JSON
description: The `darts_email` localStorage key stores the email as a **raw string** — `getEmail`/`setEmail` do not JSON-encode it. This differs from the accounts key, which
tags: [localStorage, e2e, gotcha, auth-gate]
timestamp: "2026-09-07T19:58:54.368Z"
---

# darts_email localStorage key stores the email raw, not JSON

The `darts_email` localStorage key stores the email as a **raw string** — `getEmail`/`setEmail` do not JSON-encode it. This differs from the accounts key, which IS stored as JSON. Seeding `localStorage.setItem('darts_email', JSON.stringify(email))` (with quotes) silently breaks account-scoped API fetches: the server receives a quoted email, matches no rows, and returns an empty player list with no error.

When seeding test/dev localStorage, set `darts_email` raw: `localStorage.setItem('darts_email', email)`. Encoded in `e2e/helpers.ts` comments.

Discovered while wiring the Playwright E2E suite — the match-ui tests failed against a working API purely because of this quoting mismatch.
