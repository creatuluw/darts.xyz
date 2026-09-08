---
type: Learning
title: Miss turns must persist with dartsThrown ≥ 1
description: The turns table / API has a constraint that `dartsThrown >= 1`. A miss (all three darts off the board) is still a turn and must be persisted with `dartsThrown` 
tags: [db, turns, e2e, gotcha]
timestamp: "2026-09-07T19:58:54.368Z"
---

# Miss turns must persist with dartsThrown ≥ 1

The turns table / API has a constraint that `dartsThrown >= 1`. A miss (all three darts off the board) is still a turn and must be persisted with `dartsThrown` counting the darts actually thrown (the UI sends `darts.length`) — never 0, even for a total miss. Sending `dartsThrown: 0` fails the DB constraint.

Relevant when posting turns directly to `POST /api/.../turns` (E2E helpers, scripts, integrations). Encoded in `e2e/helpers.ts` comments.

Also note: the turns API returns turns ordered `createdAt DESC` — write order-agnostic assertions in tests.
