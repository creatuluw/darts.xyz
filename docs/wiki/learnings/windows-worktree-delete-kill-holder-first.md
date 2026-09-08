---
type: Learning
title: "Windows worktree deletion: kill the process holding the directory first"
description: Symptom
tags: [git, worktree, windows, file-lock, wiki-recap, cleanup]
timestamp: "2026-09-08T21:59:27.232Z"
---

# Windows worktree deletion: kill the process holding the directory first

## Symptom

Deleting a worktree directory on Windows fails with `Invalid argument` (or the directory silently survives `rm -rf` / `git worktree remove`). The worktree may even already be **unregistered** — `git worktree list` no longer shows it, only the bare directory remains — so git can't help.

## Cause

A running process still holds a handle with its **CWD inside the worktree directory**. In the 2026-09-08 full cleanup this was the *previous session's background wiki-recap node subagent* (PID 8140) — these background agents can outlive their session and keep cwd'ing in the worktree they ran in.

## Fix

1. Don't assume registration: check `git worktree list` AND the directory itself.
2. Find the holder (e.g. `handle`/Process Explorer, or spot a `node` dev-server process) and verify its task is provably done — here the worktree's branch was merged and deleted, so killing it lost nothing.
3. Kill the PID, then delete the directory. Done.

Related: the cleanup loop itself is codified in [worktree-feature-loop](../rules/worktree-feature-loop.md) — this gotcha is the step-8 failure mode it doesn't mention.
