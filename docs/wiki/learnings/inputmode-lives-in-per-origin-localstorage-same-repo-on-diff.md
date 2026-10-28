---
type: Learning
title: inputMode lives in per-origin localStorage — same repo on different ports shows different scorer state
description: "**The gotcha:** a user report of "the dartboard is broken on the same repo, other port" turned out to be **per-origin localStorage divergence**, not a code bug."
tags: [localStorage, sveltekit, numpad, dartboard, per-origin, bug-triage]
timestamp: "2026-10-28T18:41:26.320Z"
---

# inputMode lives in per-origin localStorage — same repo on different ports shows different scorer state

**The gotcha:** a user report of "the dartboard is broken on the same repo, other port" turned out to be **per-origin localStorage divergence**, not a code bug. The live scorer's `inputMode` (board vs numpad) is stored in localStorage, and localStorage is scoped **per origin** — `localhost:5173` (main checkout dev server) and `localhost:5174` (user's instance) each keep their own copy. The fresh instance was in numpad mode, and the Board tab rendered board *XOR* numpad (mutually exclusive), so the dartboard wasn't even in the DOM — with the only toggle hidden in Settings.

**Why it matters:** when comparing behavior across two dev servers/ports of the same repo, never assume the browser state is identical — per-origin keys (settings, tokens, mode flags) diverge silently. Diff the relevant localStorage keys before hunting for a code bug.

**Fix:** PR #18 (`feature/board-always-visible`, worktree `E:/worktrees/board-always-visible`) makes the dartboard always render on the Board tab, with the numpad below it as a secondary input when numpad mode is selected; board mode unchanged. Board clicks stayed wedge-accurate in both modes after the change.
