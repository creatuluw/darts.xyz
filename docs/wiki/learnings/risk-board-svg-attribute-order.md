---
type: Learning
title: "Risk board SVGs: path attribute order varies — extract element-wise, not by regex lookahead"
description: Gotcha
tags: [svg, risk, regex, docs]
timestamp: "2026-09-08T22:35:53.223Z"
---

# Risk board SVGs: path attribute order varies — extract element-wise, not by regex lookahead

## Gotcha

In `docs/risk/Risk_board.svg` and the derived `docs/risk/risk-dart-board.svg`, `<path>` elements **mix attribute order** — some put `d` before `id`, some after. An extraction regex that assumes one order (e.g. `id="japan".*?d="([^"]+)"`) silently grabs the **following** element's path data when the order flips.

Observed 2026-09-08: the grayed-out layer ended up graying **Yakutsk instead of Japan** and **North Africa instead of Madagascar** — labels were right, geometry wrong, and only a browser check against the label points caught it.

## Rule

When scripting edits against these SVGs, **split into elements first** (per `<path …>` chunk) and then read attributes by name — never rely on attribute order in a lookahead. Always verify geometry edits visually against the label coordinates, not just that the regex matched.
