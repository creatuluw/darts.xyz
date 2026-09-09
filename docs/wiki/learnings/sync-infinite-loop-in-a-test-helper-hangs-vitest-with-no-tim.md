---
type: Learning
title: Sync infinite loop in a test helper hangs vitest with no timeout
description: The symptom
tags: [testing, vitest, risk-42, test-helpers, gotcha]
timestamp: "2026-09-09T10:19:01.734Z"
---

# Sync infinite loop in a test helper hangs vitest with no timeout

## The symptom

"Testing takes way too long" / the vitest worker hangs mid-run and gets SIGTERM'd — **no timeout error is ever reported**, even though the suite has vitest's default 5s per-test timeout.

## The root cause

A synchronous **infinite loop in a test helper** (`playTurn` in `risk-engine.test.ts`): it looped on `while dartsLeft > 0`, but when the turn advanced, the *next player's fresh budget* kept the condition true forever. Two engine-level facts combined: turn rotation changes whose budget is being read, and income mechanics refresh it.

Why the timeout never fires: vitest's timeout is a timer on the event loop. A synchronous loop **blocks the event loop**, so the timer can never run — the worker just spins until killed. The timeout you configured is useless against sync hangs.

## Detection & fix

- Bisect with a scratch spec containing just the suspect suite — the hang localizes in one run.
- Kill the orphaned vitest workers (leave the agent processes alone), then fix the helper: a per-turn helper must **stop at the player change** — loop only within one turn, never across the rotation.
- After the fix the suite went from "hangs forever" to 2.3s.

Related: [[engine-test-helpers-must-adapt-to-live-dart-budgets-income-m]] — same family of trap (test helpers assuming static dart budgets).
