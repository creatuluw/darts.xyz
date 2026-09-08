---
type: Rule
title: All code/logic todos must use the TDD skill (red→green→refactor)
description: The rule
tags: [tdd, process, todos, workflow]
timestamp: "2026-09-07T22:07:29.975Z"
---

# All code/logic todos must use the TDD skill (red→green→refactor)

## The rule

Any todo whose deliverable is **code or logic** must be implemented using the TDD skill at `E:\skills.te9.dev\matt-pocock\skills\engineering\tdd\SKILL.md` (the mattpocock tdd skill), with its core process baked into the todo:

- **Vertical RED→GREEN→REFACTOR** — each cycle covers one behavior end-to-end (test through the public interface → make it pass → refactor), not horizontal slices (all tests, then all impl).
- **One behavior per cycle.**
- **Tests through public interfaces only** — no testing internals/private functions.

## When it applies

Every todo that produces code or logic. In the current 27-todo plan, that's 24 of 27.

## Legitimate exclusions

Todos whose deliverable is not code/logic do NOT carry the requirement:

- **Prompt/eval tuning** (e.g. persona prompt calibration) — prompt iteration + evaluation, not implementation.
- **The test suite itself** (e.g. an E2E full-match simulation todo) — the todo *is* the test; TDD-of-a-test is meaningless.
- **Manual QA/polish passes** — human verification, nothing to test-first.

## Rationale

User mandate (stated 2026-09 session): keeps implementation quality uniform across agents/sessions working the todo list, and prevents the classic failure mode of writing all implementation first and backfilling tests.

## Source

- Todo plan referenced in session: spec → palette → 27 todos → acceptance criteria, M1–M5 milestones.
