---
type: Learning
title: "Bare [[slug]] wikilinks in wiki_note_page break cross-folder — use explicit relative paths"
description: The gotcha
tags: [wiki, okf, wikilinks, wiki_note_page]
timestamp: "2026-09-08T20:25:14.527Z"
---

# Bare [[slug]] wikilinks in wiki_note_page break cross-folder — use explicit relative paths

## The gotcha

`wiki_note_page` converts bare `[[slug]]` wikilinks to a same-folder `./slug.md` href — relative to the **page's own folder**, which is only correct for siblings in the same folder. Cross-folder links (entity → `../../decisions/…`, entity → `../concepts/…`) end up broken and trip **W4** in `wiki_validate`.

Path-style links (`[[decisions/foo]]`, `[[learnings/foo]]`) resolve correctly — only bare slugs break.

## The rule

In `wiki_note_page` bodies:

- Cross-folder references: write explicit relative markdown links — `../../decisions/<slug>.md` style, no angle form — or path-style wikilinks (`[[decisions/foo]]`) — matching the pre-existing entity pages' style.
- Same-folder siblings: bare `[[slug]]` is fine.
- Always run `wiki_validate` after writing; expect W4 on any page written with bare cross-folder wikilinks, then fix the hrefs directly.

Seen 2026-09-08 on `pages/entities/spectator-interviews-trebles-territories.md` (7 broken links from one note_page call). Related: [[wiki-search-misses-recent-concepts]].
