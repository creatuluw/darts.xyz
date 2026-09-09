---
type: Learning
title: Merged-PR leftovers in the main tree block the pull — verify identical, then discard
description: Merged-PR leftovers in the main tree block the post-cleanup pull
tags: [git, worktree, pull, cleanup, gotcha]
timestamp: "2026-09-09T12:32:10.244Z"
---

# Merged-PR leftovers in the main tree block the pull — verify identical, then discard

# Merged-PR leftovers in the main tree block the post-cleanup pull

**Symptom**: step 9 of the [worktree feature loop](../rules/worktree-feature-loop.md) — `git switch master && git pull --ff-only origin master` — fails because the main tree carries modified/untracked copies of the merged PR's files. Recurring pattern: conquest build leftovers (2026-09-08, see [conquest-build-untracked-in-working-tree](conquest-build-untracked-in-working-tree.md)), TvStage/tv-e2e files (2026-09-09, PR #14).

## Prove losslessness before discarding

- **Tracked/modified files**: `git diff origin/master -- <paths>` empty → content already identical to what the pull brings in.
- **Untracked files**: `git hash-object <file>` equals `git rev-parse origin/master:<path>` → same blob as the incoming version (PR #14's `TvStage.svelte`: both `fe611fc`).
- Then discard (`git checkout -- <paths>` / delete untracked) and pull — identical content returns via the merge.

Never discard dirty `docs/wiki/` files in this check — they're wiki-recap output, not touched by the incoming commits; leave them uncommitted.

## Evidence

2026-09-09 cleanup pass: 4 modified tv/e2e files byte-identical to origin/master + untracked `TvStage.svelte` blob-matched → discarded, `pull --ff-only` succeeded, master at `65f79e4`.
