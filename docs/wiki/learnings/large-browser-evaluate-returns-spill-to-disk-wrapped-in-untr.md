---
type: Learning
title: "Large browser evaluate returns spill to disk wrapped in [UNTRUSTED_PAGE_CONTENT] markers"
description: When extracting a large payload (e.g. a 32KB serialized SVG) from a page via the browser, an `evaluate` whose return exceeds the inline threshold spills to a di
tags: [browser, tooling, extraction]
timestamp: "2026-09-08T22:41:12.559Z"
---

# Large browser evaluate returns spill to disk wrapped in [UNTRUSTED_PAGE_CONTENT] markers

When extracting a large payload (e.g. a 32KB serialized SVG) from a page via the browser, an `evaluate` whose return exceeds the inline threshold spills to a disk file whose content is wrapped in `[UNTRUSTED_PAGE_CONTENT]` markers — the page content is **raw between the markers**, so extracting the payload between them recovers it byte-for-byte.

Working recipe (used to lift `docs/risk/dart-board.svg` from the rendered `Dartboard.svelte`):

1. Open the page, stage the payload once on `window` (e.g. `window.__svg = el.outerHTML`).
2. Let the evaluate spillover write it to disk (deterministic, no re-typing).
3. Read the spillover file and slice between the `[UNTRUSTED_PAGE_CONTENT]` markers.

Fallback: fetch in ~4KB chunks that stay inline — larger chunks spill again. Pages can get closed mid-extraction; staging on `window` means you must re-stage after reopening.
