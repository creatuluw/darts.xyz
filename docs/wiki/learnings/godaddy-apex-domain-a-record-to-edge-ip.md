---
type: Learning
title: "GoDaddy apex domain on Railway: A record to live edge IP, not the documented one"
description: The pattern (snooze.monster / dart.monster, Sep 2026)
tags: [railway, godaddy, dns, custom-domains, deployment]
timestamp: "2026-09-07T20:01:50.122Z"
---

# GoDaddy apex domain on Railway: A record to live edge IP, not the documented one

## The pattern (snooze.monster / dart.monster, Sep 2026)

Railway's docs say GoDaddy apex is unsupported (no CNAME flattening) and recommend a static A record to `66.33.22.9`. That IP is a **stale edge** — pointing the apex there wedges cert issuance forever at `CERTIFICATE_STATUS_TYPE_ISSUING / POLLING_AUTHORIZATIONS` (retry is unavailable because it never "fails").

## Working setup for a GoDaddy apex on Railway

1. `railway link` the project, `railway domain <apex>` to attach it
2. Read the per-domain code from the domain status (e.g. `ebx3mx8g.up.railway.app`) and **resolve it**: that IP (currently `69.46.46.x` block) is the live edge
3. GoDaddy API: `PUT /v1/domains/{domain}/records/A/@` → that IP (GoDaddy rejects apex CNAME — `INVALID_RECORDS`, name "[ ]")
4. `PUT .../records/TXT/_railway-verify` with the `railway-verify=...` value
5. If the cert stays stuck: `railway domain delete <id> --yes` + `railway domain <apex>` to re-add — fresh issuance completes in seconds. A fresh code/IP is generated; re-resolve and update the A record.

Railway's edge routes by SNI/Host, so any live edge IP in the block serves the domain. Certs issue with A records just fine (snooze.monster has run this way since Aug 2026).

Files/CLIs involved: `railway` CLI (logged in), GoDaddy API keys in `.env` (`GODADDY_KEY`/`GODADDY_SECRET`, auth header `sso-key KEY:SECRET`).
