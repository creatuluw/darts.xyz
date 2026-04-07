# darts.xyz

**Track every leg. Every set. Every 180.** A precision darts scoring application for players who demand accuracy.

## Overview

darts.xyz is a web-based darts scoring app built with SvelteKit. It tracks matches, calculates scores, provides checkout suggestions, and stores player statistics. Designed for both casual players at the pub and serious competitors tracking their game.

## Features

- **Multiple Game Modes**: 301, 501, 701, and 1001 point games
- **Configurable Matches**: Set how many legs per set and sets per match
- **Double-In/Double-Out**: Support for standard darts rules
- **Checkout Suggestions**: Get expert checkout recommendations
- **Player Statistics**: Track wins, averages, 180s, checkout percentages, and more
- **Voice Caller**: Audio feedback with multiple caller voices (Jack, Sarah, Roger)
- **Match History**: Review past matches and track progress over time
- **Archive System**: Soft-delete players and matches for record-keeping

## Tech Stack

- **Framework**: SvelteKit 2 (Svelte 5 with runes)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: SQLite with Drizzle ORM
- **Icons**: Tabler Icons

## Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

## Installation

```bash
# Clone the repository
git clone https://github.com/your-org/darts.xyz.git
cd darts.xyz

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database connection string

# Initialize the database
npm run db:init

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Quick Start

1. Navigate to **Players** and create your player profile
2. Go to **New Match** to start a game
3. Select players, configure rules (score, legs, sets)
4. Start throwing! Tap segments on the dartboard to score

## Project Structure

```
src/
├── lib/
│   ├── components/ui/     # Reusable UI components (Dartboard, DoubleBezel, etc.)
│   ├── db/               # Database schema, init, and service layer
│   ├── game/             # Game logic (scoring, match engine, checkout suggestions)
│   ├── stores/            # Svelte stores (toast notifications, voice settings)
│   └── utils/            # Utilities (audio effects, darts caller)
├── routes/
│   ├── api/              # REST API endpoints
│   │   ├── insights/     # Player insights
│   │   ├── matches/      # Match CRUD operations
│   │   └── players/      # Player management
│   ├── archive/           # Archived players view
│   ├── history/           # Match history
│   ├── match/            # Active match gameplay
│   └── players/           # Player management pages
```

## API Reference

### Players

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/players` | GET | List all active players |
| `/api/players` | POST | Create new player |
| `/api/players/[id]` | GET | Get player details |
| `/api/players/[id]` | PUT | Update player |
| `/api/players/archived` | GET | List archived players |
| `/api/players/archived/[id]/restore` | POST | Restore archived player |

### Matches

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/matches` | GET | List matches |
| `/api/matches` | POST | Create new match |
| `/api/matches/[id]` | GET | Get match details |
| `/api/matches/[id]` | PUT | Update match status |
| `/api/matches/[id]/legs` | GET | Get match legs |
| `/api/matches/[id]/turns` | POST | Record a turn |
| `/api/matches/with-players` | GET | List matches with player info |

### Stats

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stats/[playerId]` | GET | Get player statistics |
| `/api/insights/[playerId]` | GET | Get player insights |

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `DATABASE_URL` | string | `darts.db` | SQLite database file path |
| `VOICE_ENABLED` | boolean | `true` | Enable voice caller |

### Voice Options

| Voice ID | Name | Description |
|----------|------|-------------|
| `jack` | Jack | Deep male voice |
| `sarah` | Sarah | Clear female voice |
| `roger` | Roger | British male voice |

## Development

```bash
# Run type checking
npm run check

# Watch mode for type checking
npm run check:watch

# Build for production
npm run build

# Preview production build
npm run preview

# Database operations
npm run db:init    # Initialize database
npm run db:push    # Push schema changes
npm run db:studio  # Open Drizzle Studio
npm run db:verify  # Verify database connection
```

## Game Rules

### Scoring

- Segments 1-20: Face value
- **Double ring**: 2× segment value
- **Treble ring**: 3× segment value
- **Bullseye (outer)**: 25 points
- **Bullseye (inner)**: 50 points

### Winning a Leg

Reduce your score to exactly zero. The last dart must land in a double segment (unless `doubleIn` is disabled and your starting score is under the double threshold).

### Checkout

When at 170 or under, the app suggests optimal checkout combinations. Above 170, no checkout is possible in three darts.

## Data Models

### MatchConfig

```typescript
{
  starting_score: 301 | 501 | 701 | 1001,
  legs_per_set: 1 | 3 | 5 | 7,
  sets_per_match: 1 | 3 | 5 | 7,
  double_in: boolean
}
```

### PlayerStats

```typescript
{
  matches_played: number,
  matches_won: number,
  three_dart_avg: number,
  checkout_pct: number,
  total_180s: number,
  highest_finish: number
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.