# Codebase Graph Index

Generated: 2026-04-07T15:41:08.537001

## Overview

| Entity Type | Count |
|-------------|-------|
| Code Files | 50 |
| Functions | 32 |
| Classes | 3 |
| Interfaces | 13 |
| Variables | 0 |
| Modules | 0 |

**Total Relations:** 271

## Entry Points

| File | Language | Size |
|------|----------|------|
| `src\app.d.ts` | typescript | 0.3KB |
| `src\lib\components\ui\index.ts` | typescript | 0.6KB |
| `src\lib\db\index.ts` | typescript | 0.5KB |
| `src\lib\game\index.ts` | typescript | 0.2KB |
| `src\lib\index.ts` | typescript | 0.1KB |

## Most Imported Files

| File | Import Count |
|------|--------------|
| `@sveltejs/kit` | 13 |
| `$lib/db/database-service` | 11 |
| `svelte` | 8 |
| `$lib/components/ui` | 6 |
| `$app/stores` | 4 |
| `drizzle-orm` | 4 |
| `src\lib\game\types.ts` | 4 |
| `$app/navigation` | 4 |
| `svelte/store` | 3 |
| `$lib/stores/toast` | 3 |

## Query Examples

### Find all functions in a file
```bash
python3 .opencode/skills/codebase-graph/scripts/codebase-graph.py query --type Function --file "src/auth/jwt.ts"
```

### Find what calls a function
```bash
python3 .opencode/skills/codebase-graph/scripts/codebase-graph.py deps --function "verifyToken"
```

### Show file dependencies
```bash
python3 .opencode/skills/codebase-graph/scripts/codebase-graph.py deps --file "src/lib/data.ts"
```

## Graph Structure

The graph is stored in `graph.json` with the following structure:

```json
{
  "metadata": {...},
  "entities": {
    "CodeFile": [...],
    "Function": [...],
    "Class": [...],
    ...
  },
  "relations": [
    {"from": "...", "type": "imports", "to": "..."},
    ...
  ]
}
```

## Usage Guidelines

1. **For LLM Context**: Reference specific entities by ID instead of including full file contents
2. **For Dependency Analysis**: Query the `relations` array for `imports` or `calls` types
3. **For Refactoring**: Check `called_by` to find all usages before modifying a function
4. **For Navigation**: Use the entity index to quickly locate symbols

## Files

- `graph.json` - Complete typed knowledge graph
- `schema.yaml` - Type definitions and constraints
- `index.md` - This file (human-readable overview)
- `build.log` - Processing log with timestamps
- `AGENTS.md.check` - AGENTS.md integration status
