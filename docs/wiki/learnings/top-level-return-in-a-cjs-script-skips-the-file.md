---
type: Learning
title: Top-level return in a CJS script skips the file write — silent no-op
description: Gotcha
tags: [cjs, scripts, debugging, gotcha]
timestamp: "2026-09-08T23:15:50.760Z"
---

# Top-level return in a CJS script skips the file write — silent no-op

## Gotcha

In a one-off CommonJS script (e.g. `docs/risk/apply-territory-labels.cjs`), a `return` at **module top level** exits the *entire script* — not just "this iteration". Any code after it, like the `fs.writeFileSync` that persists the edit, never runs.

## Symptom (why it's sneaky)

The script "succeeds" silently: no error, no output. Re-reading the target file shows the *old* content, which looks like the edit didn't match anything. This cost a full debugging round on the outer-ring label task — the count said the early-return didn't fire, but the write had been skipped and I was re-reading a stale SVG.

## Rule of thumb

- In top-level CJS script loops over items, never early-`return` for "skip this item" — restructure with `if/else` so the write always executes.
- After any scripted file mutation, verify it *actually* happened (grep the output / check the marker count), don't just re-read and assume.

## Source

- `docs/risk/apply-territory-labels.cjs` — hit while removing background rects from outer-ring territory labels (2026-09).
