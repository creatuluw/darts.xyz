---
type: Learning
title: Trebles & Territories build was untracked in the working tree — now landed on feature/trebles-territories (PR #2)
description: "RESOLVED 2026-09-08: the conquest build that survived the git rollback as untracked files is now committed on feature/trebles-territories and pushed as PR #2 (master still empty until merge)"
tags: [git, conquest, trebles-and-territories, risk]
timestamp: "2026-09-08T19:53:11.259Z"
---

# Trebles & Territories build lives uncommitted in the working tree (survived the git rollback on disk)

Discovered when hunting for the Fun tab / Trebles & Territories code (2026-09): the **entire conquest build exists only as untracked files in the main working tree** — it was rolled back out of git history, but the files survived on disk. Not in any branch, stash, or ref. `git reflog` / dangling commits hold nothing.

Untracked (never committed anywhere):
- `src/lib/game/conquest-engine.ts` + `conquest-engine.test.ts`
- `src/lib/game/conquest-setup.ts` + `conquest-setup.test.ts`
- `src/lib/components/conquest/ConquestBoard.svelte` + `ConquestScoreboard.svelte`
- `src/routes/match/conquest/+page.svelte`
- `vitest.config.ts`, `playwright.config.ts`, `e2e/`, all game `*.test.ts`, `PlayerPanel.svelte`, the spec, the manual, `docs/wiki/`

Modified but tracked: setup page (Fun tab), `database-service.ts`, `api/matches`, live match page, `Dartboard.svelte`, `package.json`.

Consequences:

- **Nothing needs rebuilding** — the code matches the spec at `.specs/trebles-and-territories/spec.html`; it just needs committing.
- **`git clean -fd` or a hard reset would permanently destroy it.** Never run destructive git cleanup in this repo without first committing these files.
- Any new feature build (e.g. the 2nd-screen/TV view) that wants to depend on conquest code must wait for this to land on master first.

## Update 2026-09-08 — landed (PR #2)

The danger below is resolved: the build is committed as 6 focused commits on `feature/trebles-territories` (built in its own locked worktree; the main tree was only read from), pushed to origin, and open as **PR #2** ([creatuluw/darts.xyz#2](https://github.com/creatuluw/darts.xyz/pull/2)).

Still true until the PR merges:

- **master has no conquest code** — do not assume fun games exist on master; check `git ls-files src/lib/game/conquest-engine.ts` on the branch you're on.
- Merging PR #2 auto-deploys master to Railway.
- Verification on the branch: 112/112 unit tests pass, build clean; the 4 `svelte-check` errors are pre-existing master debt (see [[ssr-pages-are-empty-shells-emailgate]]).
