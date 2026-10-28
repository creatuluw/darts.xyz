---
type: Decision
title: "Wiki scope: product knowledge only — all dev-process content removed"
description: Context
tags: [wiki, scope, documentation, purge]
status: accepted
timestamp: "2026-10-28T18:47:11.762Z"
---

# Wiki scope: product knowledge only — all dev-process content removed

## Context

docs/wiki/ had accumulated 30+ entries prescribing a *way of working*: the worktree feature loop and its later no-worktrees replacement, the TDD mandate, engine invariant sweeps, testing methodology, PR/git-flow gotchas, browser-automation technique notes, and agent-interaction preferences. Useful at the time, but process content churns hard and ages fast, and it drowned the product knowledge the wiki exists to map.

## The choice

On 2026-10-28 the user directed: remove everything about workflow / way of working / dev process from the wiki. 33 entries were deleted — 9 rules, 2 decisions (the worktree/no-worktrees call, the Vitest+Playwright adoption), 1 preference, 21 learnings — plus index scrubs, the emptied `preferences/` folder, and 7 dead [[wikilinks]] in 5 page files.

## Alternatives considered

- **Keep but tag as process** — rejected: user explicitly wants the wiki to describe the product, not prescribe how to work.
- **Move to a separate process wiki** — rejected as unnecessary; everything is recoverable from git history if ever needed again.

## Rationale

The wiki's job in this project is to be the authoritative map of the product (game modes, engines, boards, entities, artifacts). Process guidance lives better in AGENTS.md/session context than in a knowledge base that future sessions treat as ground truth about the codebase.

## Consequences

- **Do not re-add dev-process content** (workflow rules, TDD mandates, testing methodology, PR flow, agent interaction style) to docs/wiki/. Future sessions noticing "missing" process rules are seeing this purge, not an accident.
- What deliberately **stayed**: product/code conventions — Tooltip over `title`, never hardcode player slots, `$app/stores $page` house style, board SVGs are generated, conquest-cut architecture, derive-stats-from-deltas — plus all product gotchas.
- Recoverable via git history (deletion commit of 2026-10-28).
