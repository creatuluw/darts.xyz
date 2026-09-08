---
type: Learning
title: EmailGate remember-me already ships — email persists, gate skips, saved accounts exist
description: A feature request to "remember the email on the EmailGate" (2026-09, worktree `kees-remember-me`) turned out to be **already shipped in master** — recon before 
tags: [email, auth, emailgate, recon]
timestamp: "2026-09-08T10:11:15.860Z"
---

# EmailGate remember-me already ships — email persists, gate skips, saved accounts exist

A feature request to "remember the email on the EmailGate" (2026-09, worktree `kees-remember-me`) turned out to be **already shipped in master** — recon before writing code found:

- `src/lib/stores/email.ts` — the email persists in `localStorage` under `darts_email` (raw string, see [[darts-email-localstorage-stores-raw-email]]) and is read at store init
- `src/routes/+layout.svelte` — the EmailGate is **skipped entirely** when an email is present, so returning players go straight into the app
- `src/lib/components/EmailGate.svelte` — already shows a saved-accounts list with one-tap "Welcome back" switching

**Implication:** any "remember me / skip re-entering email" request needs no new code. The only genuine gap is *session-only login* (an explicit "Remember me on this device" checkbox; unchecked = no localStorage write, no saved-account entry, gate reappears next visit).

**Rule of thumb:** before building any auth/gate persistence feature, check these three files first — the whole remember-me flow already routes through them.
