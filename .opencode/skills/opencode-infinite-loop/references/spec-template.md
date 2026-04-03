# Spec: [Feature / Goal Name]

<!-- This file is the contract between you and the agent. Every section here replaces a human decision. -->

## Goal

[One sentence: what "done" looks like from a user/product perspective.]

Example: "Add a paginated `/api/widgets` endpoint that returns widgets for the authenticated user, sorted by creation date."

## Context

**Current state:** [What exists in the codebase now that's relevant.]
**Target state:** [What should exist and work after this spec is complete.]
**Branch:** [Which git branch to work on — if unspecified, the agent uses the current branch.]

## Acceptance Criteria

Each criterion MUST be verifiable by a shell command that exits 0 on success. No subjective criteria.

- [ ] `npm run typecheck` exits 0 with no new errors
- [ ] `npm run lint` exits 0 with no new warnings
- [ ] `npm test` exits 0 — all existing tests still pass
- [ ] [Add specific behavioral criteria here — each MUST be testable]

Examples of good criteria:
- `npx vitest run tests/widget.test.ts` exits 0 with all 6 tests passing
- `curl -s http://localhost:5173/api/widgets | jq '.data | length'` returns 10
- `wc -l src/lib/widget.ts` returns less than 150

Examples of BAD criteria (do not use these):
- "The code is clean" ← not measurable
- "It should be fast" ← not measurable
- "Looks good" ← not measurable

## Scope — What the Agent May Touch

### ✅ In scope (agent may create or edit)
- `src/routes/api/widgets/`
- `src/lib/widgets.ts`
- `tests/widgets.test.ts`

### 🚫 Out of scope (agent must NOT touch)
- `src/db/schema.ts` — schema is frozen for this task
- `tests/fixtures/` — fixture files are read-only
- Any file not listed above without explicit reasoning in progress.txt

## Task Breakdown

[Optional — if left empty, the planner subagent generates this. If you want to pre-define the order:]

1. Create `src/lib/widgets.ts` — service layer with `getWidgets(userId, page)` function
2. Create `src/routes/api/widgets/+server.ts` — GET handler with auth check and pagination
3. Create `tests/widgets.test.ts` — unit tests for service + integration test for route
4. Run full verification sequence

## Constraints and Anti-Patterns

- DO NOT use `any` type in TypeScript
- DO NOT add new npm dependencies without a comment explaining why
- DO NOT fetch database directly in route handlers — use service layer in `src/lib/`
- DO NOT edit existing tests to make them pass — fix the implementation instead
- If an external API returns an error, write the error to `progress.txt` under `## Notes` and move to the next criterion

## Available Commands and Tools

[List every CLI tool, test runner, and build command the agent can use. Agents hallucinate commands that don't exist — be explicit.]

```bash
npm test                         # Run all Vitest tests
npx vitest run <file>            # Run one test file
npm run lint                     # ESLint with auto-fix
npm run typecheck                # tsc --noEmit
npm run build                    # Production build
git status                       # Check working tree
git add -A && git commit -m "..."  # Stage and commit
```

## Verification Sequence

Run these in order. ALL must exit 0 before outputting the completion token.

```bash
npm run typecheck
npm run lint
npm test
```

After all pass, output exactly:

```
<promise>COMPLETE</promise>
```

## Known Risks and Hard Stops

- If `npm test` is failing after 3 attempts to fix — write the failure to `progress.txt` under `## Blockers` and skip to the next criterion
- If a required file doesn't exist and you're unsure where to create it — check `AGENTS.md` Project Structure first, then check `git log` for similar files added previously
- If you cannot complete a criterion without modifying an out-of-scope file — write it to `progress.txt` under `## Blockers` with the reason, and move on
