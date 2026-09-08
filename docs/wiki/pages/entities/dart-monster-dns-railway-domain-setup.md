---
type: Entity
title: dart.monster DNS & Railway domain setup
description: "Concrete infrastructure: how `dart.monster` (this project, also deployed as darts.xyz) is wired to its Railway service, as of 2026-09-07."
tags: [dns, railway, godaddy, deployment, domains]
timestamp: "2026-09-07T19:45:15.714Z"
---

# dart.monster DNS & Railway domain setup

Concrete infrastructure: how `dart.monster` (this project, also deployed as darts.xyz) is wired to its Railway service, as of 2026-09-07.

## Details

- **Railway project**: `f745d9a3-db2c-4335-a4fa-112be5e7c3e4` (environment `69e58702-4196-4ba9-b4b3-4594d119426d`)
- **Railway service**: `64bbaff5-2b7e-48c2-a19c-bce07b79ac40` (linked via Railway CLI; godaddy creds in `.env`)
- **Custom domains attached**: `www.dart.monster` (✅ live, cert OK, 200) and `dart.monster` (ownership verified via TXT, **cert NOT issued** — see blocker)
- **DNS at GoDaddy** (managed via vendored `godaddy-cli` / GoDaddy API):
  - `www` CNAME → `v2gbmgw7.up.railway.app`
  - apex A → `66.33.22.9` (Railway edge IP)
  - `_railway-verify` TXT → verification record
  - existing MX/SPF/DKIM records for emailit must be preserved by any future DNS migration

## Current state: apex cert blocked

`https://dart.monster` does not serve the app. Railway's cert flow requires apex CNAME flattening, which GoDaddy DNS doesn't support — see [godaddy-dns-can-t-serve-a-railway-apex-domain](../../learnings/godaddy-dns-can-t-serve-a-railway-apex-domain.md) for the full explanation and the three resolution options (GoDaddy 301 forward → www, Cloudflare nameservers, or a Vercel apex redirect matching the user's other ~100 domains). **User decision pending** as of this entry.

## Relationships

- [godaddy-dns-can-t-serve-a-railway-apex-domain](../../learnings/godaddy-dns-can-t-serve-a-railway-apex-domain.md) — the platform limitation blocking the apex
- godaddy-cli (vendored under `godaddy-cli/`, prebuilt `godaddy.exe`) — tool used to manage the records

## Lifecycle

- 2026-09-07: `dart.monster` + `www.dart.monster` attached as custom domains, TXT verified, DNS records set via GoDaddy API; apex cert issuance stalled — options presented, awaiting user choice.
