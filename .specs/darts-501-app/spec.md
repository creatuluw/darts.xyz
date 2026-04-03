# Darts 501 Scoring App — Specification

## Feature Overview

A premium web-based darts scoring application that enables multiple players to play 501 darts matches with full support for legs and sets. The app tracks all game data, player statistics, and historical performance in a **PostgreSQL database hosted on Railway**. Players can select existing usernames or create new ones, with all match data persisted to their profile.

The app provides a real-time scoring interface with a visual dartboard, checkout suggestions, and comprehensive statistics displayed during and after matches. Statistics include all-time career stats and a rolling window of the last 20 legs played.

Built with **SvelteKit 2, Svelte 5 (runes), TypeScript, Tailwind CSS v4**, and **PostgreSQL** (via `pg` / `drizzle-orm`) for data persistence.

**Tech Stack:**
- **Frontend:** SvelteKit 2 + Svelte 5 (runes) + TypeScript (strict)
- **Styling:** Tailwind CSS v4 with high-end agency visual design system
- **Database:** PostgreSQL 15+ on Railway — all tables in `darts` schema
- **ORM:** Drizzle ORM with TypeScript-first schema definitions
- **Migration:** Drizzle Kit for schema push and migration management
- **Fonts:** Geist Sans (body) + Clash Display (headings) via `@fontsource` or CDN

**Database Connection:**
```
postgresql://postgres:QWvgNTqzfNibSLhAIcBSCMKFMbSWqOdD@monorail.proxy.rlwy.net:37604/railway
```

All tables are created under the `darts` schema (not `public`).

---

## Success Criteria

- Players can create/select usernames and start a new match within 10 seconds
- Scoring interface supports all valid dart inputs (singles, doubles, trebles, bull, double-bull, miss)
- Match formats are configurable: best-of-N legs per set, best-of-N sets
- All scores, turns, legs, sets, and matches are persisted to PostgreSQL
- Player statistics page shows all-time stats and last-20-legs stats
- Stats are displayed below the active game during play
- Bust detection and double-out enforcement work correctly
- The app handles 2-4 players in a single match
- Checkout suggestions are shown when a player is on a finish
- All migrations target the `darts` schema exclusively

---

## Design System — High-End Visual Design

> Governed by `.opencode/skills/taste-skills/high-end-visual-design/SKILL.md`

### Selected Archetypes

**Vibe & Texture: Soft Structuralism with Dark Mode Override**

The app uses a dual-mode design:

- **Light Mode:** Silver-grey to pure white backgrounds (`#FAFAFA`, `#F5F5F4`). Massive bold Geometric Grotesk typography. Airy, floating components with highly diffused ambient shadows. Clean, precise, tournament-grade feel.
- **Dark Mode:** Deep OLED black (`#0A0A0A`) with subtle warm undertones (`#111110`). Soft `ring-1 ring-white/10` hairlines on cards. `bg-white/5` surface layers. The dartboard becomes the visual hero against the dark canvas.

**Layout: Asymmetrical Bento Grid**

The active match page uses a masonry-like CSS Grid of varying card sizes. The scoring input area dominates (`col-span-8`), while stats and match info occupy stacked side panels (`col-span-4`). Mobile collapses to single-column stack with `grid-cols-1`.

### Design Tokens

| Token | Light | Dark |
|-------|-------|------|
| `--bg-primary` | `#FAFAFA` | `#0A0A0A` |
| `--bg-surface` | `#FFFFFF` | `#141414` |
| `--bg-elevated` | `#F5F5F4` | `#1C1C1C` |
| `--text-primary` | `#0A0A0A` | `#FAFAFA` |
| `--text-secondary` | `#71717A` | `#A1A1AA` |
| `--accent` | `#10B981` (emerald) | `#34D399` |
| `--accent-danger` | `#EF4444` | `#F87171` |
| `--border-hairline` | `ring-1 ring-black/[0.06]` | `ring-1 ring-white/10` |

### Typography

- **Headings:** Clash Display (Variable, 700-900 weight) — massive sizes (`text-5xl` to `text-8xl`) for remaining scores
- **Body:** Geist Sans (Variable, 400-600 weight) — clean, precise, tournament-readout feel
- **Monospace/Data:** Geist Mono — for stats numbers, averages, checkout percentages
- **Banned Fonts:** Inter, Roboto, Arial, Open Sans, Helvetica (never use these)

### Component Architecture

**All major containers use the "Double-Bezel" (Doppelrand) nested pattern:**

```
Outer Shell: bg-black/5 dark:bg-white/5, ring-1 ring-black/5 dark:ring-white/10, p-1.5, rounded-[2rem]
  Inner Core: bg-white dark:bg-[#1C1C1C], shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)], rounded-[calc(2rem-0.375rem)]
    Content
```

**Buttons use the "Island" architecture:**
- Primary CTAs: `rounded-full px-6 py-3` pills with generous padding
- Trailing icons nested in `w-8 h-8 rounded-full bg-black/5 dark:bg-white/10` circles
- Active state: `active:scale-[0.98]` for haptic press feel
- Hover: inner icon translates diagonally (`translate-x-1 -translate-y-[1px]`)

### Motion Choreography

- **All transitions:** `transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]` — never `linear` or `ease-in-out`
- **Entry animations:** Elements fade-up from `translate-y-16 blur-md opacity-0` to `translate-y-0 blur-0 opacity-100` over 800ms+
- **Score changes:** Number transitions animate smoothly with scale pulse
- **Page transitions:** Staggered mask reveal with `delay-100`, `delay-150`, `delay-200`
- **GPU-safe only:** Animate `transform` and `opacity` exclusively — never `top`, `left`, `width`, `height`
- **`backdrop-blur`:** Only on fixed/sticky elements (nav, overlays) — never on scrolling content

### Navigation

- **Floating glass pill navbar** detached from top: `mt-6 mx-auto w-max rounded-full backdrop-blur-xl`
- **Not** an edge-to-edge sticky navbar glued to the top
- Mobile: hamburger morphs to X with fluid rotation; menu opens as full-screen glass overlay with staggered link reveals

### Spatial Rhythm

- Section padding minimum `py-24` — the layout breathes heavily
- Eyebrow tags precede major headings: `rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium`
- Massive whitespace between scoring area and stats panel

### Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `< 768px` | Single-column, `px-4 py-8`, all `col-span` resets to `col-span-1`, no rotations, no overlaps |
| `768px - 1024px` | Two-column bento, reduced whitespace |
| `> 1024px` | Full asymmetrical bento, generous whitespace |
| **Never** use `h-screen` — always `min-h-[100dvh]` for iOS Safari safety |

### Anti-Patterns (Banned)

- Generic 1px solid gray borders → use `ring-1 ring-black/[0.06]` or `ring-white/10`
- Harsh drop shadows (`shadow-md`, `rgba(0,0,0,0.3)`) → use diffused ambient shadows
- Standard thick-stroked icons (Lucide, FontAwesome, Material) → use Phosphor Light or Remix Line
- Static elements with no entry animation → every element animates in
- Edge-to-edge sticky navbars → floating detached pill

---

## Backend Architecture — PostgreSQL on Railway

### Overview

All data is stored in **PostgreSQL** hosted on Railway. The app uses **Drizzle ORM** for type-safe database access with a TypeScript-first schema definition. All tables live in a dedicated `darts` schema (not `public`).

**Why PostgreSQL on Railway:**
- **Proper relational database** — Foreign keys, joins, indexes, transactions, ACID compliance
- **Type-safe ORM** — Drizzle ORM generates TypeScript types from the schema, catches errors at compile time
- **Sub-10ms queries** — Local-latency queries over the network connection
- **Transactional writes** — Match state updates are atomic; no partial writes
- **SQL power** — Complex aggregation queries for stats (window functions, CTEs, filtering)
- **Free tier** — Railway provides a free PostgreSQL instance sufficient for a personal darts app
- **Familiar** — Standard SQL, standard tooling (`psql`, pgAdmin, any PostgreSQL client)

### Connection Configuration

```env
DATABASE_URL=postgresql://postgres:QWvgNTqzfNibSLhAIcBSCMKFMbSWqOdD@monorail.proxy.rlwy.net:37604/railway
```

All queries target the `darts` schema. The search path is set at the connection level:

```typescript
// On connection initialization
await db.execute(sql`SET search_path TO darts, public`);
```

### Schema Strategy

- All application tables are created in the `darts` schema
- The `darts` schema is created explicitly: `CREATE SCHEMA IF NOT EXISTS darts;`
- Drizzle ORM schema definitions specify the schema per table
- Migrations are managed with Drizzle Kit (`drizzle-kit push` and `drizzle-kit generate`)
- The `public` schema is left untouched (Railway may use it for extensions)

### Drizzle ORM Configuration

**`drizzle.config.ts`:**
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
  schemaFilter: ['darts'],
  migrations: {
    schema: 'darts',
    table: 'drizzle_migrations'
  }
});
```

### Data Model (PostgreSQL Tables in `darts` Schema)

#### `darts.players`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default `gen_random_uuid()` |
| name | VARCHAR(100) | UNIQUE NOT NULL |
| created_at | TIMESTAMPTZ | default `now()` |
| updated_at | TIMESTAMPTZ | default `now()` |

#### `darts.matches`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default `gen_random_uuid()` |
| status | VARCHAR(20) | NOT NULL, default `'in_progress'`, CHECK IN (`'in_progress'`,`'completed'`,`'abandoned'`) |
| starting_score | INTEGER | NOT NULL, default 501 |
| legs_per_set | INTEGER | NOT NULL, default 3 |
| sets_per_match | INTEGER | NOT NULL, default 1 |
| double_in | BOOLEAN | NOT NULL, default false |
| winner_id | UUID | FK → `darts.players.id`, nullable |
| created_at | TIMESTAMPTZ | default `now()` |
| updated_at | TIMESTAMPTZ | default `now()` |

#### `darts.match_players`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default `gen_random_uuid()` |
| match_id | UUID | FK → `darts.matches.id` ON DELETE CASCADE |
| player_id | UUID | FK → `darts.players.id` |
| throw_order | INTEGER | NOT NULL |
| sets_won | INTEGER | NOT NULL, default 0 |
| legs_won | INTEGER | NOT NULL, default 0 |

Unique constraint on `(match_id, player_id)`.

#### `darts.legs`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default `gen_random_uuid()` |
| match_id | UUID | FK → `darts.matches.id` ON DELETE CASCADE |
| set_number | INTEGER | NOT NULL |
| leg_number | INTEGER | NOT NULL |
| winner_id | UUID | FK → `darts.players.id`, nullable |
| first_thrower_id | UUID | FK → `darts.match_players.id` |
| created_at | TIMESTAMPTZ | default `now()` |

Unique constraint on `(match_id, set_number, leg_number)`.

#### `darts.turns`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default `gen_random_uuid()` |
| leg_id | UUID | FK → `darts.legs.id` ON DELETE CASCADE |
| player_id | UUID | FK → `darts.players.id` |
| turn_number | INTEGER | NOT NULL |
| dart1_score | SMALLINT | NOT NULL |
| dart1_multiplier | SMALLINT | NOT NULL, CHECK IN (0,1,2,3) |
| dart1_segment | SMALLINT | NOT NULL, CHECK (0–25) |
| dart2_score | SMALLINT | NOT NULL |
| dart2_multiplier | SMALLINT | NOT NULL, CHECK IN (0,1,2,3) |
| dart2_segment | SMALLINT | NOT NULL |
| dart3_score | SMALLINT | NOT NULL |
| dart3_multiplier | SMALLINT | NOT NULL, CHECK IN (0,1,2,3) |
| dart3_segment | SMALLINT | NOT NULL |
| total_score | INTEGER | NOT NULL |
| remaining_score | INTEGER | NOT NULL |
| is_bust | BOOLEAN | NOT NULL, default false |
| darts_thrown | SMALLINT | NOT NULL, CHECK (1–3) |
| created_at | TIMESTAMPTZ | default `now()` |

Unique constraint on `(leg_id, turn_number, player_id)`.

#### `darts.player_stats`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default `gen_random_uuid()` |
| player_id | UUID | FK → `darts.players.id`, UNIQUE |
| matches_played | INTEGER | NOT NULL, default 0 |
| matches_won | INTEGER | NOT NULL, default 0 |
| sets_played | INTEGER | NOT NULL, default 0 |
| sets_won | INTEGER | NOT NULL, default 0 |
| legs_played | INTEGER | NOT NULL, default 0 |
| legs_won | INTEGER | NOT NULL, default 0 |
| total_darts_thrown | INTEGER | NOT NULL, default 0 |
| total_score | INTEGER | NOT NULL, default 0 |
| three_dart_avg | NUMERIC(6,2) | NOT NULL, default 0 |
| checkout_attempts | INTEGER | NOT NULL, default 0 |
| checkout_successes | INTEGER | NOT NULL, default 0 |
| checkout_pct | NUMERIC(5,2) | NOT NULL, default 0 |
| total_180s | INTEGER | NOT NULL, default 0 |
| total_140s | INTEGER | NOT NULL, default 0 |
| total_100s | INTEGER | NOT NULL, default 0 |
| highest_finish | INTEGER | NOT NULL, default 0 |
| updated_at | TIMESTAMPTZ | default `now()` |

### Indexes

```sql
-- Players lookups
CREATE INDEX idx_players_name_lower ON darts.players (LOWER(name));

-- Match queries
CREATE INDEX idx_matches_status ON darts.matches (status);
CREATE INDEX idx_matches_winner ON darts.matches (winner_id);
CREATE INDEX idx_matches_created ON darts.matches (created_at DESC);

-- Match players
CREATE INDEX idx_match_players_match ON darts.match_players (match_id);
CREATE INDEX idx_match_players_player ON darts.match_players (player_id);

-- Legs
CREATE INDEX idx_legs_match ON darts.legs (match_id);

-- Turns (heavy querying for stats)
CREATE INDEX idx_turns_leg ON darts.turns (leg_id);
CREATE INDEX idx_turns_player ON darts.turns (player_id);
CREATE INDEX idx_turns_player_created ON darts.turns (player_id, created_at DESC);

-- Stats
CREATE INDEX idx_player_stats_player ON darts.player_stats (player_id);
```

### Database Service Layer

A `DatabaseService` class (`src/lib/db/database-service.ts`) wraps all Drizzle ORM interactions:

```typescript
// Pattern: All DB operations go through this typed service class
class DatabaseService {
  // Players
  createPlayer(name: string): Promise<Player>
  getPlayer(id: string): Promise<Player | null>
  getPlayerByName(name: string): Promise<Player | null>  // case-insensitive
  getAllPlayers(): Promise<Player[]>

  // Matches
  createMatch(config: MatchConfig): Promise<Match>
  getMatch(id: string): Promise<Match | null>
  updateMatch(id: string, updates: Partial<Match>): Promise<void>
  getActiveMatches(): Promise<Match[]>

  // Match Players
  addMatchPlayer(matchId: string, playerId: string, throwOrder: number): Promise<void>
  getMatchPlayers(matchId: string): Promise<MatchPlayer[]>

  // Legs
  createLeg(matchId: string, setNum: number, legNum: number, firstThrowerId: string): Promise<Leg>
  updateLegWinner(legId: string, winnerId: string): Promise<void>
  getMatchLegs(matchId: string): Promise<Leg[]>

  // Turns
  addTurn(turn: TurnData): Promise<Turn>
  getLegTurns(legId: string): Promise<Turn[]>
  getPlayerTurns(playerId: string, limit?: number): Promise<Turn[]>
  getPlayerLastNTurns(playerId: string, n: number): Promise<Turn[]>  // for last-20-legs

  // Stats
  getPlayerStats(playerId: string): Promise<PlayerStats | null>
  updatePlayerStats(playerId: string, stats: Partial<PlayerStats>): Promise<void>
  recomputePlayerStats(playerId: string): Promise<PlayerStats>  // full recomputation from turns

  // Match completion (transactional)
  completeMatch(matchId: string, winnerId: string): Promise<void>  // updates match, stats, all in one tx
}
```

### Transactional Safety

Match completion and stats updates use PostgreSQL transactions:

```typescript
await db.transaction(async (tx) => {
  // 1. Update match status + winner
  await tx.update(matches).set({ status: 'completed', winnerId }).where(eq(matches.id, matchId));

  // 2. Update match_players sets_won / legs_won
  // 3. Recompute and update player_stats for all match players
  // 4. All-or-nothing: if stats computation fails, match stays in_progress
});
```

### API Route Structure (SvelteKit Server Routes)

All database calls happen server-side via SvelteKit server routes and load functions:

```
src/routes/
  api/
    players/
      +server.ts          — GET (list all), POST (create)
      [id]/
        +server.ts        — GET (by id)
    matches/
      +server.ts          — GET (list), POST (create)
      [id]/
        +server.ts        — GET, PATCH (update)
        legs/
          +server.ts      — GET (list), POST (create)
        turns/
          +server.ts      — GET (list), POST (create)
    stats/
      [playerId]/
        +server.ts        — GET (player stats)
```

---

## Design Goals

### Primary
- Fast, intuitive scoring input — keyboard and tap/click friendly
- Accurate rule enforcement (bust, double-out, leg/set match logic)
- Complete statistical tracking per player across all games
- **$150k agency-level visual design** — haptic depth, cinematic motion, obsessive micro-interactions
- Persistent data — all matches, legs, and turns stored in PostgreSQL with full ACID guarantees

### Secondary
- Visual dartboard representation for score input
- Checkout chart / finish suggestions with animation
- Match history view per player
- Dark mode (first-class, not an afterthought)
- Real-time stats update during play
- Shareable player profiles via link

---

## User Experience

### Match Setup Flow

User opens the app and lands on a cinematic home screen with massive typography: **"DARTS"** in Clash Display 900 weight, floating above an ambient gradient. Below, two primary CTAs sit inside double-bezel cards: **"New Match"** and **"Player Stats"**.

On **"New Match"**: A full-page setup flow begins. Step 1: Select players — existing names appear as tappable pills with stat previews; new players can be created inline. Step 2: Configure match — starting score, legs/set, sets/match, double-in toggle — all inside a bento grid of option cards. Step 3: Confirm and begin — a brief animation transitions to the scoring interface.

### Scoring Flow

The active match page is the hero of the app. A bento grid layout:

- **Top-left (col-span-8):** The current player's remaining score in massive `text-8xl` Clash Display — e.g., **"361"** — with a subtle pulse animation on change. Below: the dart input area with segment buttons (1-20, bull) and multiplier selector (S/D/T/miss), all rendered as tappable pills inside double-bezel containers.
- **Top-right (col-span-4):** Match scoreboard — sets and legs for each player in clean stacked cards. Current player indicator with accent highlight.
- **Bottom-left (col-span-8):** Turn history for the current leg — scrollable list of turns showing what each player threw.
- **Bottom-right (col-span-4):** Collapsible stats panel showing all-time and last-20-legs stats for the current player.

After entering 3 darts (or checking out early), a `transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]` animation slides the turn into history and the next player's score animates in. Bust shows a red flash with score revert animation. Checkout shows a celebration state.

### Stats Display

Below the active scoring area, the stats panel uses double-bezel cards with eyebrow tags: **"ALL TIME"** and **"LAST 20 LEGS"**. Stats shown:

- 3-dart average (large, monospace)
- Checkout % (progress bar)
- 180s / 140s / 100s (badge counts)
- Highest finish (highlighted)
- Legs W/L, Sets W/L, Matches W/L

All stats animate on update with a subtle scale pulse.

---

## Design Rationale

### Why PostgreSQL on Railway

1. **Proper relational database** — Foreign keys with cascade deletes, JOINs for match+player+turn queries, indexes for fast lookups
2. **ACID transactions** — Match completion is atomic: update match, update stats, all succeed or all roll back
3. **SQL aggregation power** — Window functions, CTEs, and `OVER (ORDER BY created_at DESC)` for last-20-legs stats
4. **Type-safe ORM** — Drizzle ORM provides compile-time type checking for all queries
5. **Zero local infrastructure** — Railway hosts the database; no local PostgreSQL install needed
6. **Sub-10ms local queries** — Fast enough for real-time stats during a darts game
7. **`darts` schema isolation** — Keeps all app tables cleanly separated from any Railway system tables in `public`

### Why Individual Dart Entry

Each dart is recorded with segment AND multiplier because this captures the granularity needed for meaningful statistics (checkout %, 180 count, treble percentage, etc.). A simple "total score" input loses all this detail.

### Why High-End Visual Design

A darts scoring app is used during social moments — at pubs, home game rooms, tournaments. The UI should feel premium and polished, matching the tactile satisfaction of throwing darts. The double-bezel cards mimic the physical feel of a dartboard surround. The motion choreography adds drama to checkouts and respect to 180s.

---

## Constraints / Assumptions

- PostgreSQL 15+ hosted on Railway, accessed over the network
- All tables in the `darts` schema (not `public`)
- Drizzle ORM for all database access (no raw SQL except for schema creation)
- Database credentials stored in `.env` (never committed to git)
- No user authentication — players identified by username only
- Single device usage (one screen for scoring, passed between players)
- SvelteKit with both SSR (for data loading) and client-side runes (for game state)
- TypeScript strict mode enabled
- Svelte 5 runes (`$state`, `$derived`, `$effect`, `$props`) used throughout — no Svelte 4 syntax
- Tailwind CSS v4 for styling with CSS-first configuration
- App requires network connectivity to reach the PostgreSQL database

---

## Functional Requirements

### FR-1: Player Management
- Create new players by entering a username
- List existing players from PostgreSQL for selection
- Add 2-4 players to a match
- Persist players to `darts.players` table
- Case-insensitive duplicate detection — if "John" exists, "john" returns the existing player
- **Acceptance:** A new username creates a row in `darts.players`; returning username shows existing record with stats summary

### FR-2: Match Configuration
- Select starting score (301, 501, 701, 1001)
- Configure legs per set (1, 3, 5, 7)
- Configure sets per match (1, 3, 5, 7)
- Choose first thrower
- Optionally toggle "double-in" rule (default: off)
- **Acceptance:** Match config screen shows all options and creates rows in `darts.matches` + `darts.match_players`

### FR-3: Scoring Input
- Enter each dart individually (segment + multiplier)
- Support all segments: 1-20, bull (25), double-bull (50)
- Support multipliers: single (1x), double (2x), treble (3x), miss (0)
- Quick-entry buttons for common scores (60, 45, 41, 40, 39, 38, 37, 36, 26, 25, 20)
- Visual dartboard that can be clicked/tapped for input (stretch goal)
- Keyboard shortcuts for rapid entry (1-9, 0 for 10, b for bull, d for double, t for treble)
- **Acceptance:** Each dart is recorded with segment and multiplier; total is calculated correctly

### FR-4: Game Logic
- Subtract turn score from player's remaining score
- Detect bust: score goes below 0, to exactly 1, or to 0 without a double
- On bust: revert score to start-of-turn value, mark turn as bust
- Detect checkout: score reaches exactly 0 with final dart being a double (or bullseye)
- On checkout: leg ends, winner recorded
- Leg winner throws first in next leg
- Track which dart in the turn (1st, 2nd, 3rd)
- Allow ending turn early (e.g., after 1 or 2 darts if checkout achieved)
- **Acceptance:** All bust and checkout scenarios handled per official 501 rules

### FR-5: Match Progression
- After a leg ends, update leg count for the set
- When a player wins enough legs, the set ends (reset legs, increment sets)
- When a player wins enough sets, the match ends
- Display current score: sets/legs for each player
- Show who throws first in current leg
- Option to abandon/cancel a match (sets status to "abandoned")
- **Acceptance:** Match, set, and leg progression follows standard darts rules

### FR-6: Statistics Tracking
- Per-turn stats: darts thrown, score, is_double, is_treble, is_bull, is_180, checkout_attempt, checkout_success
- Per-leg stats: winner, total darts thrown per player, average score per turn, highest turn, checkouts, 180s
- Per-player all-time stats: 3-dart average, checkout %, total 180s, highest checkout, matches won/lost, legs won/lost, sets won/lost, total darts thrown
- Per-player last-20-legs stats: same metrics but only from the most recent 20 completed legs for that player
- Stats are recomputed after each match and cached in `darts.player_stats`
- Last-20-legs computed via SQL window query on `darts.turns` ordered by `created_at DESC`
- **Acceptance:** Stats are computed correctly and persisted to PostgreSQL

### FR-7: Stats Display During Match
- Below the active scoring area, show a collapsible stats panel
- Stats panel shows current player's all-time stats
- Stats panel shows current player's last-20-legs stats (only if >20 legs played total)
- Stats update after each turn completes
- Stats panel is collapsible to save screen space on mobile
- **Acceptance:** Stats panel is visible during match and updates after each turn

### FR-8: Match History
- View past matches for any player
- Show match result, date, opponent(s), score
- Allow drilling into individual match details (turn-by-turn breakdown)
- Show stats summary for each historical match
- **Acceptance:** Match history page lists all matches from PostgreSQL; clicking shows detail

---

## Edge Cases

- **Player busts on first dart:** Score reverts, remaining 2 darts forfeited
- **Player checks out on first or second dart:** Leg ends immediately, remaining darts not thrown
- **Remaining score is 1:** Cannot be checked out (need double), so any dart that scores is a bust
- **Remaining score is 0 after non-double:** Bust — score reverted to start-of-turn
- **Negative score:** Bust — score reverted
- **Two players tie in a leg:** Not possible in 501; first to check out wins
- **Match abandoned mid-game:** Save current state to PostgreSQL, mark as "abandoned", allow viewing in history
- **Duplicate username entry:** Case-insensitive match returns existing player row
- **No existing players in DB:** Show create-only flow with inviting empty state
- **Player stats with 0 legs:** Show zeros/empty, guard against division by zero for averages
- **Last-20-legs with fewer than 20 legs played:** Show all-time stats only, with a note "X more legs needed for rolling window"
- **Network timeout during game:** Show error toast, allow retry; game state preserved locally in Svelte runes
- **Concurrent users on same match:** Single-device usage mitigates; PostgreSQL row-level locks for safety

---

## Project Structure

```
src/
  app.css                          # Tailwind v4 import + design tokens
  app.html                         # HTML shell with font preloads
  lib/
    db/
      schema.ts                    # Drizzle ORM schema definitions (all tables)
      index.ts                     # Drizzle client initialization + connection
      database-service.ts          # DatabaseService class (all CRUD methods)
      types.ts                     # Row type re-exports from schema
    game/
      scoring.ts                   # Score calculation (segment × multiplier, bust, checkout)
      match-engine.ts              # Match/leg/set progression state machine
      stats-engine.ts              # Statistics computation (all-time, last-20-legs)
      checkout-suggestions.ts      # Finish recommendations for remaining scores
      types.ts                     # Game state types
    components/
      dartboard/
        Dartboard.svelte           # Visual interactive dartboard
      scoring/
        DartInput.svelte           # Segment + multiplier input
        QuickScore.svelte          # Quick-entry buttons for common scores
        TurnHistory.svelte         # Turn list for current leg
        ScoreDisplay.svelte        # Large remaining score display
      match/
        MatchSetup.svelte          # Player selection + config flow
        MatchScoreboard.svelte     # Sets/legs display for all players
        ActivePlayer.svelte        # Current player indicator
      stats/
        StatsPanel.svelte          # Collapsible stats panel
        AllTimeStats.svelte        # All-time stats card
        Last20LegsStats.svelte     # Last-20-legs stats card
        StatBadge.svelte           # Individual stat display component
      ui/
        DoubleBezel.svelte         # Reusable double-bezel card wrapper
        PillButton.svelte          # Rounded pill button with island architecture
        EyebrowTag.svelte          # Small pill label for section headers
        AnimatedNumber.svelte      # Number with transition animation
        FloatingNav.svelte         # Floating glass pill navigation
    routes/
      +layout.svelte               # Root layout (nav, font imports, global styles)
      +page.svelte                 # Home screen
      match/
        setup/
          +page.svelte             # Match configuration
        [id]/
          +page.svelte             # Active match scoring
          detail/
            +page.svelte           # Completed match detail
      players/
        +page.svelte               # Player list + create
        [id]/
          +page.svelte             # Player profile + stats
      history/
        +page.svelte               # Match history
      api/
        players/
          +server.ts               # GET list, POST create
          [id]/
            +server.ts             # GET by id
        matches/
          +server.ts               # GET list, POST create
          [id]/
            +server.ts             # GET, PATCH update
            legs/
              +server.ts           # GET list, POST create
            turns/
              +server.ts           # GET list, POST create
        stats/
          [playerId]/
            +server.ts             # GET player stats
drizzle/
  /                                # Generated migration files
drizzle.config.ts                  # Drizzle Kit configuration
```

---

## Setup Prerequisites

1. **Environment Variables (`.env`):**
   ```
   DATABASE_URL=postgresql://postgres:QWvgNTqzfNibSLhAIcBSCMKFMbSWqOdD@monorail.proxy.rlwy.net:37604/railway
   PUBLIC_APP_NAME=Darts 501
   ```

2. **Database Initialization:**
   ```bash
   # Create the darts schema and push all tables
   npm run db:push
   ```

3. **Verify connection:**
   ```bash
   npm run db:studio    # Opens Drizzle Studio to browse data
   ```

---

## npm Dependencies

```json
{
  "dependencies": {
    "drizzle-orm": "^0.39.0",
    "postgres": "^3.4.0"
  },
  "devDependencies": {
    "@sveltejs/kit": "^2.50.0",
    "@sveltejs/adapter-auto": "^4.0.0",
    "svelte": "^5.54.0",
    "tailwindcss": "^4.2.0",
    "@tailwindcss/vite": "^4.2.0",
    "typescript": "^5.9.0",
    "vite": "^7.3.0",
    "vitest": "^3.0.0",
    "drizzle-kit": "^0.30.0"
  }
}
```

> **Note:** The `pocketbase` dependency, `pb_data/`, and `pb_migrations/` directories have been removed — replaced entirely by PostgreSQL + Drizzle ORM.