---
type: Learning
title: Wiki-recap staged files sweep into the next commit
description: "**The gotcha:** the wiki-recap subagent writes docs/wiki/ files at the end of turns and leaves them staged in the git index. A later `git add <my-file>` + `git "
tags: [git, wiki-recap, commits]
timestamp: "2026-10-28T19:27:15.209Z"
---

# Wiki-recap staged files sweep into the next commit

**The gotcha:** the wiki-recap subagent writes docs/wiki/ files at the end of turns and leaves them staged in the git index. A later `git add <my-file>` + `git commit` then commits EVERYTHING already staged — not just the intended file.

**Observed 2026-10-28:** fix commit `a71bd6c` ("active player panel keeps normal size") bundled ~40 unrelated docs/wiki/ files (decisions, learnings, page renames) that the recap system had left staged.

**Mitigation:** before committing, run `git status` — if docs/wiki/ files are staged, either `git restore --staged docs/wiki` first, or commit only intended paths with `git commit -- <paths>` (pathspec bypasses the index). Related: [[merged-pr-leftovers-block-the-pull]] — same family of "the index contains surprises" gotchas.
