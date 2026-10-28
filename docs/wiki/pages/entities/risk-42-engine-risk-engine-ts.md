---
type: Entity
title: Risk 42 engine (risk-engine.ts)
description: "The pure, TDD'd game engine implementing [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) — Risk 42 played on the standard dartboard wher"
tags: [risk-42, engine, game-mode, tdd]
timestamp: "2026-10-24T22:07:41.944Z"
---

# Risk 42 engine (risk-engine.ts)

The pure, TDD'd game engine implementing [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) — Risk 42 played on the standard dartboard where inner single, outer single, and treble of a number are **different territories** (40 boxes total). Modeled on [conquest-engine-and-live-game](../entities/conquest-engine-and-live-game.md)'s pattern: pure state-in/state-out functions, no DOM, no persistence.

## Details

- **Location**: `src/lib/game/risk-engine.ts` + co-located `risk-engine.test.ts` — **on master since PR #8** (merge commit `0dd53f1`, 2026-09-09). The Arsenal-bank amendment shipped on **PR #15 — merged `3611862` on 2026-10-23**; the reach-rule / territory-cards / income-rework batch shipped on **PR #17 — merged `42f79d9` on 2026-10-23** (commit `2c4d474`).
- **Seams** (the tested surface):
  - `createGame(playerIds, opts)` — seeded RNG deal: 40 boxes dealt equally, 2 armies each, leftover blanks claimable, starter from input.
  - `applyDart(state, hit: DartHit): RiskGameState` — deposits + mirror combat + **Arsenal bull darts (bankable)** + **reach gating** + turn lifecycle, immutable state.
  - `DartHit = { segment, multiplier, singleRing? }` — `singleRing` **required** for multiplier 1; see [the DartHit seam decision](../../decisions/risk-42-applydart-seam-darthit-singlering.md).
  - **Reach rule** (PR #17): `ADJACENT_TERRITORIES` — classic Risk map adjacency for the 40 territories (Japan & Madagascar cut) plus same-wedge inner/outer pairs; `isReachable()` / `reachableBoxIds()` — a dart only counts on **own territory or territory adjacent to own**. Off-reach hits are **dead darts**: consumed, zero armies, zero points, no capture. Exiles may throw anywhere (clawback). See [the reach decision](../../decisions/risk-42-reach-rule-own-or-adjacent.md).
  - **Territory cards** (PR #17): every conquest draws from a seeded **42-card deck** (40 territory cards; faces `infanterie`/`cavalerie`/`artillerie` + 2 jokers); state carries per-player `hands` + `setsCashed`. `setPayout(cards, setsCashedAlready)` prices a 3-card set — +3/+4/+5 darts per face, one-of-each +6, jokers wild paying the best combo, **+1 escalation per set already cashed**; `cashSet(state, cardIds)` pays into the live pool. Hoarding is **unlimited** (user-ruled), deck finite. See [the cards decision](../../decisions/risk-42-territory-cards-conquest-earns-card.md) and [the hoarding decision](../../decisions/risk-42-card-hoarding-unlimited.md).
  - `budgetWithSources()` — pre-turn dart budget with its source breakdown — **PR #17 rework**: continents no longer pay darts; `territoryIncome()` computes `max(3, floor(owned territories / 6))` with a `minimumApplied` flag. See [the income-rework decision](../../decisions/risk-42-income-rework-continent-bonus-out.md).
  - **Dart bank** (since the 2026-10-23 Arsenal amendment): bull 25 = **+2 darts**, bullseye 50 = **+3 darts**, paid into the live pool immediately; a per-player **saved pool** banks leftovers handed over at turn end and accumulates; `advanceTurn` never writes zero-entries into the bank. The rolled-in amount is persisted as **`turn.carried`** so the UI can itemize provenance (see [the provenance learning](../../learnings/bank-folded-in-at-handover-loses-provenance-carry.md)) — see [the bank decision](../../decisions/risk-42-arsenal-bankable-dart-economy.md).
  - Endgames: domination check, timed-war clock horn, bull tiebreak.
- **Endgame contracts worth remembering**:
  - In a **2-player game, stripping one player IS domination** — exile only exists with 3+ players (the spec's own AC; exile tests must arrange 3 players).
  - After a **bull tiebreak, the winner ∈ score-tied leader set** — not necessarily `standings()[0]`, whose secondary sort may reorder ties.
  - Clock-winner validation goes against `standings[0]` (that one *is* the standings contract).

## Relationships

- [risk-42-proposed-game-mode](../concepts/risk-42-proposed-game-mode.md) — what this implements
- [conquest-engine-and-live-game](../entities/conquest-engine-and-live-game.md) — the Trebles & Territories engine it is patterned on
- [risk-42-implementation-spec](../artifacts/risk-42-implementation-spec.md) — the spec driving the milestone build (still describes the old Arsenal charge — known drift, tracked by the docs-vs-code parity check)
- [test-suite](../artifacts/test-suite.md) — where this suite lives

## Lifecycle

- First added: 2026-09-09, worktree `risk-42` — M1.1–M1.4 (deal, deposits + mirror combat + capture-at-0, turn lifecycle + Arsenal charge, exile & clawback), suite 178.
- 2026-09-09: **M1 complete — 188 tests in ~2.2s**, shipped as [PR #8](https://github.com/creatuluw/darts.xyz/pull/8) — **merged to master** (`0dd53f1`).
- 2026-10-23: **Arsenal rewritten from charge to bankable dart economy** ([decision](../../decisions/risk-42-arsenal-bankable-dart-economy.md)) — TDD: 12 red → **218/218 green**; invariant sweeps now exercise saving (bank never negative, savings survive handovers, 2-player domination still terminates 8/8); `turn.carried` provenance field added; old saved games resume safely (bank fields default). Four test-authoring false-reds fixed along the way (extra pool darts in drains, depositing trebles where misses were wanted, un-neutralized deal).
- 2026-10-23 (post-merge): **PR #15 merged** (`3611862`) — cleanup verified the main tree's hot-applied copies byte-identical to master, discarded them, removed worktree `kees-risk-miss-rules`, deleted `feature/risk-miss-rules` with plain `-d` (`origin/master..` empty), ff-pulled master. 218/218 green from the aligned tree.
- 2026-10-23 (later): **PR #17 merged** (`42f79d9`, commit `2c4d474`, +656/−86 over 6 files) — three rule changes, TDD'd (+386 test lines): **reach rule** (own-or-adjacent darts, dead hits, exile exception), **territory cards** (seeded 42-card deck, set cash-in with escalation, unlimited hoarding), **territory income rework** (continent bonus out, `max(3, floor(owned/6))`). Old saved games resume safely (new state fields default).
