---
type: Learning
title: "Squash-merged branch: commit-ahead ≠ unmerged — prove with git cherry"
description: "Squash-merged branch: commit-ahead ≠ unmerged"
tags: [git, worktree, pull-request, squash-merge, cleanup]
timestamp: "2026-09-09T12:32:10.243Z"
---

# Squash-merged branch: commit-ahead ≠ unmerged — prove with git cherry

# Squash-merged branch: commit-ahead ≠ unmerged

After GitHub **squash-merges** a PR, the branch's original commits are *not* on master (only their combined patch is), so `git log --oneline origin/master..<branch>` stays non-empty **forever**. The step-0 "log empty" losslessness test from [worktree-feature-loop](../rules/worktree-feature-loop.md) would refuse to clean a perfectly merged worktree.

## The correct test (patch equivalence)

- `git cherry origin/master <branch>` (or `git log --cherry-pick --right-only origin/master...<branch>`) — empty output means every commit's patch is already on master, even though the commits themselves aren't.
- Corroborate with PR state (`gh pr view --json state` → `MERGED`).
- Also sanity-check the lock: a `--reason "active task: <slug>"` lock that *we* created in step 2, on a worktree whose PR is merged and whose patch is on master, protects nothing — it's ours to remove. A lock you can't account for = another session's in-flight task → leave it.

## Evidence (2026-09-09 cleanup)

`kees-tv-16-9-stage`: clean status but **1 commit ahead**; PR #14 MERGED and `--cherry-pick` empty → removed + branch deleted, no `--force`/`-D`. (Sibling `kees-risk42-server-persist`, PR #13, was the plain log-empty case.)

This is the **inverse** of [merged-pr-doesn-t-empty-the-branch](merged-pr-doesn-t-empty-the-branch.md): there, a merged PR hid *unmerged* commits; here, remaining commits hide a *completed* merge. You need both directions to judge a worktree safe.
