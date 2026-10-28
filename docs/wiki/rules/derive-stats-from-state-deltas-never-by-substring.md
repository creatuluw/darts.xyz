---
type: Rule
title: Derive stats from state deltas, never by substring-matching log copy
description: "**Guideline:** Never derive a gameplay stat by scanning or substring-matching human-readable log lines. Count from state deltas (or engine return values) instea"
tags: [testing, match-ui, risk-42, coding-convention]
timestamp: "2026-10-24T22:23:39.630Z"
---

# Derive stats from state deltas, never by substring-matching log copy

**Guideline:** Never derive a gameplay stat by scanning or substring-matching human-readable log lines. Count from state deltas (or engine return values) instead.

**When it applies:** Any derived stat in the match UI, TV cast pages, or end-of-match summaries that reads the match log — e.g. `endStats.dead` in `src/routes/match/risk/[id]/+page.svelte`, which counted occurrences of the Dutch log copy "buiten bereik".

**Rationale / evidence:** The 2026-10-24 three-axis code review flagged this twice (Standards should-fix + Craft understandability). Log lines are human-facing, mixed-language, and copyedited freely — rewording a message silently zeroes the derived stat. Log text is not an API; only engine state is stable.

**Fix direction for the flagged site:** derive `endStats.dead` from state deltas (darts consumed while dead) instead of log matching.
