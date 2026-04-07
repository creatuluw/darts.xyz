# Codebase File Tree

Generated: 2026-04-07T15:41:08.537999

**Total Files:** 50

This file contains the complete list of all source code files processed by the codebase graph.
Use this file to quickly search and locate files in the codebase.

## Directory Structure

```
└── src/
    ├── app.d.ts (typescript, 0.3KB)
    ├── lib/
    │   ├── index.ts (typescript, 0.1KB)
    │   ├── components/
    │   │   └── ui/
    │   │       ├── AnimatedNumber.svelte (svelte, 0.6KB)
    │   │       ├── Dartboard.svelte (svelte, 8.8KB)
    │   │       ├── DoubleBezel.svelte (svelte, 0.5KB)
    │   │       ├── EyebrowTag.svelte (svelte, 0.3KB)
    │   │       ├── FloatingNav.svelte (svelte, 1.6KB)
    │   │       ├── PillButton.svelte (svelte, 1.1KB)
    │   │       ├── StatBadge.svelte (svelte, 0.4KB)
    │   │       ├── StyledSelect.svelte (svelte, 6.7KB)
    │   │       ├── Toast.svelte (svelte, 1.4KB)
    │   │       ├── Tooltip.svelte (svelte, 1.3KB)
    │   │       └── index.ts (typescript, 0.6KB)
    │   ├── db/
    │   │   ├── database-service.ts (typescript, 8.4KB)
    │   │   ├── index.ts (typescript, 0.5KB)
    │   │   ├── init.ts (typescript, 0.5KB)
    │   │   ├── schema.ts (typescript, 6.7KB)
    │   │   └── verify.ts (typescript, 2.1KB)
    │   ├── game/
    │   │   ├── checkout-suggestions.ts (typescript, 5.5KB)
    │   │   ├── index.ts (typescript, 0.2KB)
    │   │   ├── match-engine.ts (typescript, 5.8KB)
    │   │   ├── scoring.ts (typescript, 2.7KB)
    │   │   ├── stats-engine.ts (typescript, 5.9KB)
    │   │   └── types.ts (typescript, 2.1KB)
    │   ├── stores/
    │   │   ├── toast.ts (typescript, 1.0KB)
    │   │   └── voice-settings.ts (typescript, 1.8KB)
    │   └── utils/
    │       ├── audio-effects.ts (typescript, 12.5KB)
    │       └── darts-caller.ts (typescript, 19.6KB)
    └── routes/
        ├── +layout.svelte (svelte, 0.4KB)
        ├── +page.svelte (svelte, 4.2KB)
        ├── api/
        │   ├── insights/
        │   │   └── [playerId]/
        │   │       └── +server.ts (typescript, 7.9KB)
        │   ├── matches/
        │   │   ├── +server.ts (typescript, 1.4KB)
        │   │   ├── [id]/
        │   │   │   ├── +server.ts (typescript, 1.0KB)
        │   │   │   ├── legs/
        │   │   │   │   └── +server.ts (typescript, 0.9KB)
        │   │   │   ├── players/
        │   │   │   │   └── [playerId]/
        │   │   │   │       └── +server.ts (typescript, 0.9KB)
        │   │   │   └── turns/
        │   │   │       └── +server.ts (typescript, 1.1KB)
        │   │   └── with-players/
        │   │       └── +server.ts (typescript, 1.1KB)
        │   ├── players/
        │   │   ├── +server.ts (typescript, 0.6KB)
        │   │   ├── [id]/
        │   │   │   ├── +server.ts (typescript, 0.5KB)
        │   │   │   └── matches/
        │   │   │       └── +server.ts (typescript, 0.3KB)
        │   │   └── archived/
        │   │       ├── +server.ts (typescript, 0.4KB)
        │   │       └── [id]/
        │   │           └── restore/
        │   │               └── +server.ts (typescript, 0.7KB)
        │   └── stats/
        │       └── [playerId]/
        │           └── +server.ts (typescript, 2.5KB)
        ├── archive/
        │   └── +page.svelte (svelte, 8.9KB)
        ├── history/
        │   ├── +page.svelte (svelte, 4.8KB)
        │   └── [id]/
        │       └── +page.svelte (svelte, 27.4KB)
        ├── match/
        │   ├── [id]/
        │   │   └── +page.svelte (svelte, 85.0KB)
        │   └── setup/
        │       └── +page.svelte (svelte, 8.8KB)
        └── players/
            ├── +page.svelte (svelte, 6.6KB)
            └── [id]/
                └── +page.svelte (svelte, 34.9KB)
```

## File List by Language

### Svelte (19 files)

- `src\lib\components\ui\AnimatedNumber.svelte` (0.6KB)
- `src\lib\components\ui\Dartboard.svelte` (8.8KB)
- `src\lib\components\ui\DoubleBezel.svelte` (0.5KB)
- `src\lib\components\ui\EyebrowTag.svelte` (0.3KB)
- `src\lib\components\ui\FloatingNav.svelte` (1.6KB)
- `src\lib\components\ui\PillButton.svelte` (1.1KB)
- `src\lib\components\ui\StatBadge.svelte` (0.4KB)
- `src\lib\components\ui\StyledSelect.svelte` (6.7KB)
- `src\lib\components\ui\Toast.svelte` (1.4KB)
- `src\lib\components\ui\Tooltip.svelte` (1.3KB)
- `src\routes\+layout.svelte` (0.4KB)
- `src\routes\+page.svelte` (4.2KB)
- `src\routes\archive\+page.svelte` (8.9KB)
- `src\routes\history\+page.svelte` (4.8KB)
- `src\routes\history\[id]\+page.svelte` (27.4KB)
- `src\routes\match\[id]\+page.svelte` (85.0KB)
- `src\routes\match\setup\+page.svelte` (8.8KB)
- `src\routes\players\+page.svelte` (6.6KB)
- `src\routes\players\[id]\+page.svelte` (34.9KB)

### Typescript (31 files)

- `src\app.d.ts` (0.3KB)
- `src\lib\components\ui\index.ts` (0.6KB)
- `src\lib\db\database-service.ts` (8.4KB)
- `src\lib\db\index.ts` (0.5KB)
- `src\lib\db\init.ts` (0.5KB)
- `src\lib\db\schema.ts` (6.7KB)
- `src\lib\db\verify.ts` (2.1KB)
- `src\lib\game\checkout-suggestions.ts` (5.5KB)
- `src\lib\game\index.ts` (0.2KB)
- `src\lib\game\match-engine.ts` (5.8KB)
- `src\lib\game\scoring.ts` (2.7KB)
- `src\lib\game\stats-engine.ts` (5.9KB)
- `src\lib\game\types.ts` (2.1KB)
- `src\lib\index.ts` (0.1KB)
- `src\lib\stores\toast.ts` (1.0KB)
- `src\lib\stores\voice-settings.ts` (1.8KB)
- `src\lib\utils\audio-effects.ts` (12.5KB)
- `src\lib\utils\darts-caller.ts` (19.6KB)
- `src\routes\api\insights\[playerId]\+server.ts` (7.9KB)
- `src\routes\api\matches\+server.ts` (1.4KB)
- `src\routes\api\matches\[id]\+server.ts` (1.0KB)
- `src\routes\api\matches\[id]\legs\+server.ts` (0.9KB)
- `src\routes\api\matches\[id]\players\[playerId]\+server.ts` (0.9KB)
- `src\routes\api\matches\[id]\turns\+server.ts` (1.1KB)
- `src\routes\api\matches\with-players\+server.ts` (1.1KB)
- `src\routes\api\players\+server.ts` (0.6KB)
- `src\routes\api\players\[id]\+server.ts` (0.5KB)
- `src\routes\api\players\[id]\matches\+server.ts` (0.3KB)
- `src\routes\api\players\archived\+server.ts` (0.4KB)
- `src\routes\api\players\archived\[id]\restore\+server.ts` (0.7KB)
- `src\routes\api\stats\[playerId]\+server.ts` (2.5KB)

## Search Tips

- Use Ctrl+F (or Cmd+F) to search for file names
- Files are organized by directory structure above
- Files are grouped by language below for quick reference
- File sizes are shown in KB
