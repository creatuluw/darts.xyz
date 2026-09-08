---
type: Learning
title: Session-only logins are absent from the saved-accounts list — don't gate account switching on it
description: Gotcha
tags: [auth, email, session-only, account-switching, gotcha]
timestamp: "2026-09-08T12:39:25.043Z"
---

# Session-only logins are absent from the saved-accounts list — don't gate account switching on it

## Gotcha

The saved-accounts list (`localStorage` accounts key, JSON) only contains **remembered** logins. A session-only login (`remember=false`, sessionStorage) is never added to it. In `FloatingNav.svelte`, the "Other accounts" switcher gated on `accounts.length > 1` — so a session-only user whose only other account was remembered once saw a list of length 1 and **zero** switch options rendered.

## Rule

Never infer "other accounts exist" from the saved-accounts list's length or the current user's membership in it. Render switch options as *every account registered on the device, minus the active one* — independent of how the active login was persisted.

## Evidence

Found via review feedback in PR #1 (2026-09-08, worktree `kees-remember-me`): the session-only login path exposed the hidden gate. Fixed by listing all registered accounts except the active one in `FloatingNav.svelte`.

## Source

- `.worktrees/kees-remember-me/src/lib/stores/email.ts` — session logins bypass the saved-accounts list
- `.worktrees/kees-remember-me/src/lib/components/ui/FloatingNav.svelte` — the fixed switcher
- [[email-store-email-ts]] — storage semantics this follows from
