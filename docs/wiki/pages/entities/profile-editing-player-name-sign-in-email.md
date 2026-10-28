---
type: Entity
title: Profile Editing (player name + sign-in email)
description: Profile Editing (player name + sign-in email)
timestamp: "2026-10-28T20:03:52.545Z"
---

# Profile Editing (player name + sign-in email)

# Profile Editing (player name + sign-in email)

Signed-in players can change their own display name and the email address they sign in with. Shipped 2026-10-28 (commit `e404b7c`).

## Details

- **Identity model** (recon finding): there is no server auth — the signed-in email (raw `darts_email` string in local/session storage) **is** the `accountId` (lowercased) on `players`, `matches` and `account_settings`. `players.playerEmail` is a separate per-player contact email that was already PATCHable.
- **Name edit**: `PATCH /api/players/[id]` accepts `{ name }` — non-empty, ≤100 chars, no duplicate live name within the account (protects match-setup's reuse-players-by-name dedupe); updates only `players.name`.
- **Sign-in email edit**: `PATCH /api/account/email` — format-validated, no-ops when unchanged, **409** when the new email already keys any account data, else re-keys `players.accountId` + `matches.accountId` + `account_settings.accountId` in one Drizzle transaction (404 when the account has no rows).
- **Pure validation module**: `src/lib/account/profile.ts` — `validateProfileName`, `validateAccountEmail`, `accountEmailsSame`; tested by `src/lib/account/profile.test.ts` (vitest node env — the established workaround for `$env`/DB imports in tests).
- **Store**: `src/lib/stores/email.ts` — `accountsStore.rename` + `emailStore.renameEmail(old, new)` migrate the raw `darts_email` key AND the JSON saved-accounts list, preserving remember-mode (remembered → localStorage + list; session-only → sessionStorage only).
- **Profile page**: `src/routes/players/[id]/+page.svelte` — pencil-icon inline editors (pencil → input + confirm/cancel) for name and — on the signed-in player's own profile only — the sign-in email; 400/409 surface as inline messages. Shared `Tooltip`, `$page` from `$app/stores`, `$emailStore` for the own-profile check.

## Relationships

- [email-store-email-ts](./email-store-email-ts.md) — the identity store that gains the rename
- [live-match-page](./live-match-page.md) — sibling example of the pencil-icon inline-editor pattern (edit-last-turn)

## Lifecycle

- First added: 2026-10-28, commit `e404b7c` (feat: edit player name and email address).
