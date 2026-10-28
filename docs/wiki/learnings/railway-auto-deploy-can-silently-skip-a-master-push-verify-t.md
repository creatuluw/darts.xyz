---
type: Learning
title: Railway auto-deploy can silently skip a master push — verify timestamp vs latest commit, fallback is railway up
description: "**Found on 2026-10-28** while checking whether PR #18 (`7d01bcf`, "always show the dartboard on the Board tab") was live."
tags: [devops, railway, deployment, ci]
timestamp: "2026-10-28T19:13:00.970Z"
---

# Railway auto-deploy can silently skip a master push — verify timestamp vs latest commit, fallback is railway up

**Found on 2026-10-28** while checking whether PR #18 (`7d01bcf`, "always show the dartboard on the Board tab") was live.

**The gotcha:** pushing a merge to `origin/master` does NOT guarantee Railway deploys it. The GitHub auto-deploy hook (same repo, `creatuluw/darts.xyz`) fired fine for PR #17 on 2026-10-23 but **silently never triggered** for the PR #18 push ~30 minutes earlier — no building, no in-progress, no failed entry in Railway; the last deployment was simply still the Oct 23 one. Silence means "never picked up", not "still building".

**How to check deploy status from the CLI:**

- `railway status` — service online/offline
- `railway deployment list` or the service's deployments — compare the **last successful deployment timestamp** against the latest local `git log -1` date
- Match commit → deployment: PR #17 deploy at 2026-10-23 16:39 = merge commit `42f79d9`

**Recovery:** `railway up` from the repo root ships exactly the current local app code. Before running it, confirm there are no uncommitted app-code changes (docs/wiki churn is fine — it doesn't affect the build). The dashboard alternative is Service → Settings → Deployments → "Deploy" (auto-deploy may have silently disconnected there).

**Related context:** Railway deploys from master only — feature worktree merges are what go live (see [[remember-me-session-only-login]]).

**Addendum (2026-10-28, later):** the PR #18 push was apparently *delayed*, not skipped — ~30 minutes after the push (and ~30s after a manual `railway up` upload `f458b026` was queued), a second deployment `61792d17` kicked in on its own, likely the lagging auto-deploy hook or a dashboard deploy. Both deployments carried identical PR #18 code, so the overlap was harmless; the later one simply supersedes. Practical takeaways: (1) "silently skipped" may really be "severely delayed" — wait or check the dashboard before concluding the hook is disconnected; (2) a manual `railway up` racing a late auto-deploy is safe when both ship the same commit.
