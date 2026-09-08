---
type: Decision
title: "Remember-me: session-only login shadows remembered login"
description: Context
tags: [email, auth, emailgate, storage, session]
status: accepted
timestamp: "2026-09-08T11:06:38.428Z"
---

# Remember-me: session-only login shadows remembered login

## Context

The email gate already persisted logins: `localStorage['darts_email']` (remembered login) plus a saved-accounts list, with the gate skipped entirely when an email is present. Recon in [[emailgate-remember-me-already-ships]] found the only genuine gap was **shared devices** — playing on a borrowed browser left your email behind in that browser's localStorage.

## Choice

A "Remember me on this device" checkbox (default **on**) in both gate forms:

- **Checked** → remembered login: `localStorage['darts_email']` + saved-accounts entry (existing behavior).
- **Unchecked** → **session-only login**: stored under a sessionStorage key, never written to `localStorage` or the saved-accounts list; the gate reappears when the browser session ends.

Store API becomes `setEmail(email, remember)` with shadowing semantics:
- a live session login **shadows** the remembered one (session wins while it exists),
- a remembered login clears stale session keys,
- sign-out wipes **both** storages.

## Alternatives considered

1. **Always persist (status quo)** — simplest, but leaves the email on shared devices; the actual complaint.
2. **Never persist** — safe but loses one-tap "Welcome back" on personal devices.
3. **Separate guest/incognito mode** — extra UI and no email identity for stats; more complexity for the same outcome.

## Consequences

- `src/lib/stores/email.ts` stays the single source of truth — no route reads `darts_email` directly, so no page needed changes.
- Login/sign-out flows must now handle BOTH storage keys together; breaking the shadowing contract breaks gate skipping.
- Covered by `scripts/smoke-email-store.ts` (5 scenarios, run via `tsx`) until the Vitest suite lands on master (see [[vitest-suite-uncommitted-master-has-no-test-runner]]).
- Shipped via PR #1, branch `feature/remember-me` (commits `5bc53ab` store semantics, `a467d1e` gate UI); pending user merge at time of recording. Railway deploys from master only — nothing live until merged.
