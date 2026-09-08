---
type: Learning
title: wiki_search misses recently-written concepts — verify with wiki_validate or ls before writing
description: "Discovered while recapping the Risk-darts rollback turn: `wiki_search("risk territory")` and `wiki_search("heat economies")` both returned **no results**, yet `"
tags: [wiki, gotcha, recap]
timestamp: "2026-09-07T20:55:34.348Z"
---

# wiki_search misses recently-written concepts — verify with wiki_validate or ls before writing

Discovered while recapping the Risk-darts rollback turn: `wiki_search("risk territory")` and `wiki_search("heat economies")` both returned **no results**, yet `docs/wiki/decisions/` contained matching concepts written minutes earlier (heat-momentum decision, risk-darts concept page). The search index was generated at init (2026-09-07T19:19) and files written after that are invisible to keyword search until the index regenerates.

**Rule of thumb:** before concluding a concept/decision/page is new and writing a duplicate, run `wiki_validate` (which walks the actual files) or `ls docs/wiki/{decisions,rules,learnings,pages/concepts,pages/entities}` — do not trust a negative `wiki_search` alone for recent writes. This session produced exactly this failure: a duplicate Risk-darts concept page that had to be merged and deleted.
