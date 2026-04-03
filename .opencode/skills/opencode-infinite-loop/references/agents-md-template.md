# AGENTS.md

<!-- Replace all [PLACEHOLDERS] with project-specific values before committing -->

## Project Overview

[One sentence: stack, runtime version, what makes this project architecturally non-standard. Example: "SvelteKit 2 app with TypeScript, Drizzle ORM on Postgres, deployed to Railway."]

## Key Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run all tests
npm test

# Run a single test file
npx vitest run src/path/to/file.test.ts

# Typecheck
npm run typecheck

# Lint (auto-fix)
npm run lint

# Full build
npm run build
```

> If any of these commands differ for this project, update them here. The agent runs them verbatim.

## Project Structure

```
src/
  routes/       # SvelteKit routes (or equivalent framework routes)
  lib/          # Shared utilities, types, stores
  components/   # UI components
tests/
  fixtures/     # Test data — DO NOT EDIT THESE
```

> Keep this high-level. Don't document file paths that change frequently. Describe capabilities, not locations.

## Code Style

[Paste ONE representative code snippet from the actual codebase here — a function, a component, a route handler. The agent mirrors this style.]

Rules:
- Named exports only, no default exports
- TypeScript strict mode — no `any` type
- Files max 200 lines; split at natural boundaries
- No `console.log` in committed code (use structured logging)
- Use project-defined abstractions — don't re-implement what already exists in `src/lib/`

## Non-Obvious Patterns

[Document counterintuitive decisions with explanation of WHY. Examples:]
- Auth is handled via `hooks.server.ts` — do not add auth checks in individual routes
- Database access goes through `src/lib/db/client.ts` only — never import Drizzle directly in routes
- All API responses use the wrapper in `src/lib/api/response.ts` — don't return raw JSON

## Testing Rules

- Write tests for all new functionality before marking a task complete
- Tests must be deterministic and isolated — no shared mutable state between tests
- Mock all external dependencies (HTTP, database) in unit tests
- Run `npm test` before reporting any task as done
- Integration tests live in `tests/integration/` — run separately with `npm run test:integration`

## Boundaries

### ✅ Allowed without asking
- Read any file
- List and glob files
- Run lint, typecheck, individual test files
- Edit any file in `src/` that relates to the current task
- Run `npm install` for new packages (but add a comment in the code explaining why)
- Create new files inside `src/`
- Git add, commit, push

### ⚠️ Approach with care (think twice, check twice)
- Modifying database schema files (`src/db/schema.ts` or equivalent)
- Adding new dependencies — prefer existing abstractions
- Changing shared utilities in `src/lib/` — check all callers first

### 🚫 Never
- Commit secrets, `.env` files, or API keys
- Force push to main or any protected branch
- Edit files in `tests/fixtures/` — these are test data, not code
- Modify `dist/`, `build/`, `.svelte-kit/` directories
- Use `rm -rf` without explicit instruction
- Fake test results — if tests fail, fix the code, not the test expectations
- Mark a task complete if `npm test` is failing

## Completion Signal

When ALL acceptance criteria in SPEC.md are met and ALL verification commands exit 0:

Output exactly this string on its own line:

```
<promise>COMPLETE</promise>
```

**Do NOT output this token unless:**
1. `npm run typecheck` exits 0
2. `npm run lint` exits 0
3. `npm test` exits 0
4. You have verified the git diff contains only expected changes

If any command fails, fix the issue and re-run. Do not fabricate success.
