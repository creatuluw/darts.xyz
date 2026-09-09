---
type: Rule
title: "New game modes follow the conquest cut: pure setup module + Fun-tab card + own route/board"
description: The rule
tags: [game-modes, architecture, tdd, convention]
timestamp: "2026-09-09T10:47:22.588Z"
---

# New game modes follow the conquest cut: pure setup module + Fun-tab card + own route/board

## The rule

When adding a game mode to dart.monster, replicate the **conquest three-cut** — the pattern now proven twice (Trebles & Territories, Risk 42):

1. **Pure setup module** — `src/lib/game/<mode>-setup.ts`: modes/presets constants, input validation, duration estimates. Built **TDD-first** (red → green), no framework imports ([[env-dynamic-private-vitest-split]]).
2. **Fun-tab wiring** — a format picker + mode card on `/match/setup?tab=fun` that validates via the pure module and hands off to the route.
3. **Own route + board component** — `src/routes/match/<mode>/+page.svelte` plus a board component under `src/lib/components/` (or a subfolder), rendering from the pure engine's state.

## Why

- Game logic stays pure and unit-testable; the Svelte layer stays a thin renderer.
- Modes are isolated — a new mode can't regress the classic scorer or another mode.
- TDD-first on the setup module catches invalid-input holes before the UI exists.

Evidence: `conquest-setup.ts` + Fun tab + `/match/conquest` (shipped), `risk-setup.ts` + format picker + `/match/risk` (M2.3, PR #9) — same shape, both shipped with 190+ green tests and type-clean files.

Related: [[logic-todos-must-use-tdd-skill]], [[conquest-setup-fun-tab-conquest-setup-ts]]
