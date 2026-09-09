---
type: Learning
title: Merged PR doesn't empty the branch
description: "Master's head can be a "Merge pull request #N" commit for a branch while **later commits pushed to that branch are still unmerged**. PR status or merge commits "
tags: [git, worktree, pull-request, gotcha]
timestamp: "2026-09-08T19:44:39.112Z"
---

# Merged PR doesn't empty the branch

Master's head can be a "Merge pull request #N" commit for a branch while **later commits pushed to that branch are still unmerged**. PR status or merge commits on master are NOT proof a worktree is safe to delete.

## Evidence (2026-09-08)

PR #1 merged `feature/remember-me` into master (master head 95811fc = the merge commit), but `cc9f39b` ("Show remember option in add-account modal" — the FloatingNav remember checkbox + account-switcher fix) was pushed to the branch and is **not on master**. The `kees-remember-me` worktree therefore keeps its "likely active" status in every step-0 check until that commit merges.

## Rule of thumb

The only proof a worktree is removable is `git log --oneline origin/master..<branch>` being empty **and** clean `git status --porcelain` — per [worktree-feature-loop](../rules/worktree-feature-loop.md). Don't shortcut by reading PR titles or master's merge commits. (Also why the [email store](../pages/entities/email-store-email-ts.md) entity's "review feedback, same PR" lifecycle note was optimistic — that commit was still unmerged.)

**Update 2026-09-09 — the inverse also holds**: remaining commits can hide a *completed squash merge*; `git cherry` patch-equivalence + merged-PR state is the other half of the proof — see [squash-merged-branch-commit-ahead-unmerged-prove-with-git-ch](squash-merged-branch-commit-ahead-unmerged-prove-with-git-ch.md).
