---
type: Rule
title: "Worktree feature loop: PR-only master, worktrees in E:/worktrees/, user merges"
description: House workflow for all feature work — PR-only master, worktrees under E:/worktrees/ (locked while active), provably-lossless cleanup only, and the user is the only one who merges.
tags: [git, workflow, worktree, pull-request]
timestamp: "2026-09-08T19:44:39.112Z"
---

# Worktree feature loop: PR-only master, worktrees in E:/worktrees/, user merges

## The rule

All feature work in this repo runs through the **worktree feature loop** the user defined (2026-09-08; location + locking hardened same day). Hard constraints:

- **Never push to or merge into master directly** — every master change goes through a PR. No exceptions, also not for "small" fixes.
- **Worktrees always live in `E:/worktrees/kees-<slug>`** (branch `feature/<slug>`), created from a freshly synced master (`git switch master && git pull --ff-only origin master` first). Never at repo root or a sibling directory. (Convention changed 2026-09-08 from `.worktrees/` inside the repo — a legacy `.worktrees/kees-remember-me` may still exist until cleaned.)
- **Lock the worktree immediately** after creating it: `git worktree lock --reason "active task: <slug>" E:/worktrees/kees-<slug>` — so another session's step-0 cleanup can't remove it mid-task. `npm install` before locking.
- **Stale-worktree check before each new task** — a non-main worktree is removable **only if provably lossless**: `git -C <path> status --porcelain` empty AND `git log --oneline origin/master..<branch>` empty **or patch-equivalent** (`git cherry origin/master <branch>` empty — squash merges keep the log non-empty forever; corroborate with merged-PR state — see [squash-merged-branch-commit-ahead-unmerged-prove-with-git-ch](../learnings/squash-merged-branch-commit-ahead-unmerged-prove-with-git-ch.md)). Skip anything marked `(locked)` — it's another session's in-flight task. Never `--force`, never `-D`. A dirty or unmerged-commits worktree is a possibly-active parallel task: leave untouched and note it. A merged PR is NOT proof — see [merged-pr-doesn-t-empty-the-branch](../learnings/merged-pr-doesn-t-empty-the-branch.md).
- **Clarify before coding** — if the task is ambiguous, ask what it must achieve + acceptance criteria, record in a todo, and wait for approval. No implementation on assumptions.
- **`cleanup` argument** — skip straight to cleanup (step 8, only if the user already merged the PR) then re-sync master (step 9) and report.
- **Never merge — the user merges.** No `gh pr merge`, no auto-merge, no clicking. End the report with the clickable PR URL and wait for merge confirmation.
- **Review fixes stay on the same branch/worktree** (commit + push again). If master moved: `git fetch origin && git rebase origin/master`, resolve, `git push --force-with-lease`.
- **Task summary (what we did / what it changes / why it matters) goes to three places**: the first block of the final commit message, appended to the task todo, and the end-of-work report.
- **Cleanup only after the user confirms the merge**: `git worktree unlock E:/worktrees/kees-<slug>` (ignore "not locked"), `git worktree remove`, `git branch -d feature/<slug>`, `git fetch --prune`; then re-sync master (the step-9 pull can be blocked by merged-PR leftovers in the main tree — verify identical to origin/master before discarding: [merged-pr-leftovers-in-the-main-tree-block-the-pull-verify-i](../learnings/merged-pr-leftovers-in-the-main-tree-block-the-pull-verify-i.md)).

## Why

The user runs this loop deliberately: master stays deployable (**Railway auto-deploys from master — a worktree-branch push deploys nothing**), merge decisions stay in human hands, and parallel sessions on one machine can't destroy each other's in-flight worktrees (locking + lossless-only cleanup).

## Evidence

- remember-me task (2026-09-08): steps 0–3 ran; loop correctly paused at step 3 to clarify scope before coding.
- 2nd-tv-screen-cast-realtime task (2026-09-08): step 0 correctly left `kees-remember-me` untouched (unmerged commit `cc9f39b` despite merged PR #1); new worktree created at `E:/worktrees/kees-2nd-tv-screen-cast-realtime`, deps installed, locked; paused at step 3 awaiting the user's scope answers.
