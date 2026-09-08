---
type: Learning
title: GoDaddy DNS can't serve a Railway apex domain
description: The gotcha
tags: [dns, godaddy, railway, deployment, tls]
timestamp: "2026-09-07T19:45:04.697Z"
---

# GoDaddy DNS can't serve a Railway apex domain

## The gotcha

Railway's TLS cert flow for an apex domain **requires the root to be a CNAME (flattened/ALIAS)** pointing at the service's `<hash>.up.railway.app` target. A static A record pointing at Railway's edge IP (`66.33.22.9`) passes the `_railway-verify` TXT ownership check but the cert **stalls at ISSUING forever** — issuance only completes against the CNAME.

**GoDaddy DNS does not support CNAME flattening / ALIAS records at the root** — their API rejects apex CNAMEs, and Railway's docs explicitly list GoDaddy as unsupported for apex domains. Verified empirically on 2026-09-07 while wiring `dart.monster`.

## What works / what doesn't

- ✅ `www` subdomain → CNAME to `<hash>.up.railway.app` → cert issues fine (www.dart.monster serves the Railway service)
- ✅ Apex A record `66.33.22.9` + `_railway-verify` TXT → domain verifies as attached
- ❌ Apex cert issuance without flattening — stalls at ISSUING

## Known workarounds

1. **Lazy (recommended when staying on GoDaddy):** GoDaddy dashboard → DNS → Forwarding → 301 permanent forward apex → `https://www.dart.monster`. GoDaddy serves HTTPS on forwards. Not API-exposed (one manual click).
2. **Railway's official workaround:** move DNS to Cloudflare (free), keep registration at GoDaddy, replicate records (watch the MX/SPF/DKIM email records), flip nameservers via API. Full apex on Railway with its own cert.
3. **Copy the user's existing pattern:** the user's ~100 other domains (changelog, backlog, strava…) all serve apexes from **Vercel** (A record `3.33.130.190`). A Vercel redirect project for the apex achieves the same result.

## Related

- [[dart-monster-dns-setup]] — the concrete DNS/domain state this was discovered against
