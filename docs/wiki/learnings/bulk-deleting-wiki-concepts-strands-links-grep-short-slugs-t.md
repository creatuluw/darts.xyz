---
type: Learning
title: Bulk-deleting wiki concepts strands links — grep short slugs too and let wiki_validate catch the rest
description: "**The gotcha:** deleting a wiki concept file does NOT clean up references to it. Folder indexes (`rules/index.md`, `decisions/index.md`, …) keep stale entries, "
tags: [wiki, maintenance, wikilinks, validation]
timestamp: "2026-10-28T18:47:11.762Z"
---

# Bulk-deleting wiki concepts strands links — grep short slugs too and let wiki_validate catch the rest

**The gotcha:** deleting a wiki concept file does NOT clean up references to it. Folder indexes (`rules/index.md`, `decisions/index.md`, …) keep stale entries, and page files keep dead `[[wikilinks]]`.

**The trap that bit the 2026-10-28 purge:** a naive grep for the deleted *filename* (e.g. `worktree-feature-loop`) misses wikilinks written with a **shorter slug** (e.g. `[[worktree-feature-loop]]` is fine, but links like `[[test-suite]]` vs `test-suite.md` or derived short forms slip through). Two of these inline links survived the first cleanup pass.

**The reliable procedure for a bulk deletion:**

- delete the concept files
- scrub each folder's `index.md`
- grep remaining pages for each deleted slug **and its base name** (the part before any suffix), not just the full filename
- run `wiki_validate` — broken links surface as W4 warnings; don't declare done until only known-pre-existing warnings remain

In the 2026-10-28 purge (33 entries deleted) this caught 7 dead links across 5 page files (`test-suite`, `pr-17-three-axis-code-review`, `email-store-email-ts`, `risk-42-engine-risk-engine-ts`, `risk-42-playable-game-risk-setup-fun-tab-match`).
