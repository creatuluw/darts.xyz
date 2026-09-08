---
type: Entity
title: Email store (email.ts)
description: `src/lib/stores/email.ts` — the single source of truth for the signed-in player identity. All routes read through it (no route reads `darts_email` directly); th
tags: [email, auth, storage, stores]
timestamp: "2026-09-08T11:06:45.079Z"
---

# Email store (email.ts)

`src/lib/stores/email.ts` — the single source of truth for the signed-in player identity. All routes read through it (no route reads `darts_email` directly); the EmailGate and the FloatingNav add-account modal are the only UIs writing through it (both via the same remember checkbox semantics), and `+layout.svelte` skips the gate entirely when an email is present.

## Details

- **Location**: `src/lib/stores/email.ts`; writing UIs: `src/lib/components/EmailGate.svelte` (gate) and `src/lib/components/ui/FloatingNav.svelte` (add-account modal)
- **Interface**: `getEmail()`; `setEmail(email, remember)` — `remember=true` persists a remembered login to `localStorage['darts_email']` (raw string, see [darts-email-localstorage-stores-raw-email](../../learnings/darts-email-localstorage-stores-raw-email.md)); `remember=false` stores a **session-only login** in `sessionStorage` (never localStorage, never the saved-accounts list)
- **Semantics** (per the remember-me decision(../../decisions/remember-me-session-only-login.md)): a live session login shadows the remembered one; a remembered login clears stale session keys; sign-out wipes both storages
- **Saved accounts**: separate key, stored as JSON — differs from the raw-string `darts_email` key

## Relationships

- [emailgate-remember-me-already-ships](../../learnings/emailgate-remember-me-already-ships.md) — recon that identified the session-only gap this store now closes
- [ssr-pages-are-empty-shells-emailgate](../../learnings/ssr-pages-are-empty-shells-emailgate.md) — the gate renders client-side only
- the uncommitted-suite learning(../../learnings/vitest-suite-uncommitted-master-has-no-test-runner.md) — why its checks live in `scripts/smoke-email-store.ts`

## Lifecycle

- First added: with the EmailGate — localStorage persistence + saved-accounts list
- 2026-09-08: remember/session semantics added via PR #1 (`feature/remember-me`, pending merge) — see the remember-me decision(../../decisions/remember-me-session-only-login.md)
- 2026-09-08 (review feedback, same PR): remember checkbox added to the FloatingNav add-account modal too; account switching now always lists every device-registered account except the active one — see [session-only-logins-not-in-accounts-list](../../learnings/session-only-logins-not-in-accounts-list.md)
- Status note (2026-09-08): that review-feedback commit (`cc9f39b`, FloatingNav remember checkbox + switcher fix) is pushed to `feature/remember-me` but **still not on master** — PR #1's merge predates it. See [merged-pr-doesn-t-empty-the-branch](../../learnings/merged-pr-doesn-t-empty-the-branch.md)
