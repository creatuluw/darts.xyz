---
type: Rule
title: Board SVGs are generated — edit the regenerator, never the output
description: Guideline
tags: [risk, svg, tooling, docs-risk]
timestamp: "2026-09-08T23:05:36.180Z"
---

# Board SVGs are generated — edit the regenerator, never the output

## Guideline

Every board SVG in `docs/risk/` that carries generated content (territory labels, mapping colors) is the **output of a regenerator script**, rebuilt from a pristine base on every run:

- `risk-dart-board.svg` ← `node docs/risk/apply-territory-labels.cjs` (reads clean `DartBoardInGame.svg`, appends `label-N-inner/outer` text nodes)
- `DartBoardInGame.svg` itself was generated the same way (port of `Dartboard.svelte` constants)

Hand-edits to these outputs are **silently lost on the next regeneration**.

## When it applies

Any change to labels, territory names, line wraps, colors, or the 40-territory mapping on the design boards: edit the script's `MAP` / `LINES` tables (or the geometry port) and rerun — never open the SVG in an editor and nudge it.

## Rationale

- The 2026-09-09 consolidation archived all hand-patched intermediates (`dart-board-for-map.svg`, `apply-mapping.cjs`, old mockups) and converged on exactly this shape: one clean base + one regenerator + one labeled output, idempotent per run.
- Keeps design paths/fills/ids byte-identical to the production board — the labeled pass is append-only (`pointer-events="none"` text), so the id contract for the future game view ([[dartboardingame-svg-id-addressable-in-game-board]]) can't drift.
- Micro-level string-patching gotchas live in [[patching-board-svgs-replace-existing-attributes]] and [[risk-board-svg-attribute-order]]; this rule is the macro-level fix — don't string-patch at all, regenerate.

## Source

- `docs/risk/apply-territory-labels.cjs` — the pattern in action
- [[risk-dart-board-mockup-risk-dart-board-svg]] — the artifact it maintains
