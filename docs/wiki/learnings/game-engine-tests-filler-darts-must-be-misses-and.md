---
type: Learning
title: "Game-engine tests: filler darts must be misses, and fixtures obey the rules they enforce"
description: Caught red-handed twice during the Risk 42 M1 TDD cycles (2026-09-09), both produced false reds (and one false green that slipped into a commit and had to be am
tags: [testing, tdd, risk-42, game-engine]
timestamp: "2026-09-09T08:59:56.437Z"
---

# Game-engine tests: filler darts must be misses, and fixtures obey the rules they enforce

Caught red-handed twice during the Risk 42 M1 TDD cycles (2026-09-09), both produced false reds (and one false green that slipped into a commit and had to be amended):

1. **Filler darts must be misses.** Tests needed "other players do nothing" filler turns, but used trebles — which **damaged the very territory under test**. Filler throws in engine tests should always be off-board misses (`{miss}` or equivalent), never S/D/T hits.
2. **Fixtures must obey the rules they enforce.** Tests threw 4 darts in a 3-dart turn, expected exact-0 damage to *not* flip ownership (contradicting the capture rule the same suite asserts), and checked `dartsLeft` after turn advancement. The tests get disciplined by the same rules they enforce — when a red looks like the impl is wrong, re-read the test against the game rules first.
3. **Watch for tautological assertions.** A determinism test asserted the *owner* sequence, which round-robin makes constant regardless of seed — determinism lives in the *box order*. Assert the thing the seed actually controls.
