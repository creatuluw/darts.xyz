---
type: Learning
title: Playwright reuses orphaned dev servers — E2E can silently test master code, not your worktree
description: The fact
tags: [playwright, e2e, worktree, dev-server, testing]
timestamp: "2026-09-09T12:19:50.348Z"
---

# Playwright reuses orphaned dev servers — E2E can silently test master code, not your worktree

## The fact

Playwright's `reuseExistingServer` latches onto **whatever is listening on the target port** — including an orphaned dev server serving the **main checkout's code**, not the worktree under test. During the Risk 42 persistence build (2026-09-09), port 5174 was held by a zombie dev server from a timed-out command: every Playwright run "tested" master code while the worktree branch had never been browser-tested at all. Failures (and passes) were phantom.

Symptom signature:

- Phantom failures that don't match what your code actually does; the page behaves like an older/other version.
- The port serves an app whose transformed modules lack your worktree's markers (e.g. `GAME_ID_KEY`).
- Something unrelated-sounding ("MeltFX") or the main project answers on the port.

## The rule

Before trusting E2E results from a worktree, **prove the server is yours**: probe the running server's transformed module for a worktree-specific marker, or check which process/cwd holds the port — then kill the orphan and re-run. Related: [[windows-worktree-delete-kill-holder-first]].
