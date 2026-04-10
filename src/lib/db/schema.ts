import {
  pgSchema,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
  smallint,
  numeric,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Create the darts schema builder — all tables will be created in the "darts" PostgreSQL schema
const darts = pgSchema("darts");

// === PLAYERS ===
export const players = darts.table(
  "players",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: varchar("account_id", { length: 255 }),
    playerEmail: varchar("player_email", { length: 255 }),
    name: varchar("name", { length: 100 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    nameLowerIdx: index("idx_players_name_lower").on(sql`LOWER(${table.name})`),
    accountIdx: index("idx_players_account").on(table.accountId),
    playerEmailIdx: index("idx_players_player_email").on(table.playerEmail),
  }),
);

// === VERIFICATION_TOKENS ===
export const verificationTokens = darts.table(
  "verification_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    token: varchar("token", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    tokenIdx: uniqueIndex("idx_verification_tokens_token").on(table.token),
    playerIdx: index("idx_verification_tokens_player").on(table.playerId),
    emailIdx: index("idx_verification_tokens_email").on(table.email),
  }),
);

// === ACCOUNT_SETTINGS ===
export const accountSettings = darts.table(
  "account_settings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: varchar("account_id", { length: 255 }).notNull().unique(),
    smtpHost: varchar("smtp_host", { length: 255 }),
    smtpPort: integer("smtp_port"),
    smtpUser: varchar("smtp_user", { length: 255 }),
    smtpPassword: varchar("smtp_password", { length: 255 }),
    smtpFrom: varchar("smtp_from", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    accountIdx: uniqueIndex("idx_account_settings_account").on(table.accountId),
  }),
);

// === MATCHES ===
export const matches = darts.table(
  "matches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: varchar("account_id", { length: 255 }),
    status: varchar("status", { length: 20 }).notNull().default("in_progress"),
    startingScore: integer("starting_score").notNull().default(501),
    legsPerSet: integer("legs_per_set").notNull().default(3),
    setsPerMatch: integer("sets_per_match").notNull().default(1),
    doubleIn: boolean("double_in").notNull().default(false),
    winnerId: uuid("winner_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    accountIdx: index("idx_matches_account").on(table.accountId),
    statusIdx: index("idx_matches_status").on(table.status),
    winnerIdx: index("idx_matches_winner").on(table.winnerId),
    createdIdx: index("idx_matches_created").on(table.createdAt),
    statusCheck: check(
      "chk_matches_status",
      sql`${table.status} IN ('in_progress', 'completed', 'abandoned')`,
    ),
  }),
);

// === MATCH_PLAYERS ===
export const matchPlayers = darts.table(
  "match_players",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => matches.id, { onDelete: "cascade" }),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id),
    throwOrder: integer("throw_order").notNull(),
    setsWon: integer("sets_won").notNull().default(0),
    legsWon: integer("legs_won").notNull().default(0),
  },
  (table) => ({
    matchIdx: index("idx_match_players_match").on(table.matchId),
    playerIdx: index("idx_match_players_player").on(table.playerId),
    uniqueMatchPlayer: uniqueIndex("uniq_match_player").on(
      table.matchId,
      table.playerId,
    ),
  }),
);

// === LEGS ===
export const legs = darts.table(
  "legs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => matches.id, { onDelete: "cascade" }),
    setNumber: integer("set_number").notNull(),
    legNumber: integer("leg_number").notNull(),
    winnerId: uuid("winner_id").references(() => players.id),
    firstThrowerId: uuid("first_thrower_id").references(() => matchPlayers.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    matchIdx: index("idx_legs_match").on(table.matchId),
    uniqueLeg: uniqueIndex("uniq_leg").on(
      table.matchId,
      table.setNumber,
      table.legNumber,
    ),
  }),
);

// === TURNS ===
export const turns = darts.table(
  "turns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    legId: uuid("leg_id")
      .notNull()
      .references(() => legs.id, { onDelete: "cascade" }),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id),
    turnNumber: integer("turn_number").notNull(),
    dart1Score: smallint("dart1_score").notNull(),
    dart1Multiplier: smallint("dart1_multiplier").notNull(),
    dart1Segment: smallint("dart1_segment").notNull(),
    dart2Score: smallint("dart2_score").notNull(),
    dart2Multiplier: smallint("dart2_multiplier").notNull(),
    dart2Segment: smallint("dart2_segment").notNull(),
    dart3Score: smallint("dart3_score").notNull(),
    dart3Multiplier: smallint("dart3_multiplier").notNull(),
    dart3Segment: smallint("dart3_segment").notNull(),
    totalScore: integer("total_score").notNull(),
    remainingScore: integer("remaining_score").notNull(),
    isBust: boolean("is_bust").notNull().default(false),
    dartsThrown: smallint("darts_thrown").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    legIdx: index("idx_turns_leg").on(table.legId),
    playerIdx: index("idx_turns_player").on(table.playerId),
    playerCreatedIdx: index("idx_turns_player_created").on(
      table.playerId,
      table.createdAt,
    ),
    multCheck: check(
      "chk_multiplier1",
      sql`${table.dart1Multiplier} IN (0,1,2,3)`,
    ),
    multCheck2: check(
      "chk_multiplier2",
      sql`${table.dart2Multiplier} IN (0,1,2,3)`,
    ),
    multCheck3: check(
      "chk_multiplier3",
      sql`${table.dart3Multiplier} IN (0,1,2,3)`,
    ),
    dartsCheck: check(
      "chk_darts_thrown",
      sql`${table.dartsThrown} BETWEEN 1 AND 3`,
    ),
  }),
);

// === PLAYER_STATS ===
export const playerStats = darts.table(
  "player_stats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id)
      .unique(),
    matchesPlayed: integer("matches_played").notNull().default(0),
    matchesWon: integer("matches_won").notNull().default(0),
    setsPlayed: integer("sets_played").notNull().default(0),
    setsWon: integer("sets_won").notNull().default(0),
    legsPlayed: integer("legs_played").notNull().default(0),
    legsWon: integer("legs_won").notNull().default(0),
    totalDartsThrown: integer("total_darts_thrown").notNull().default(0),
    totalScore: integer("total_score").notNull().default(0),
    threeDartAvg: numeric("three_dart_avg", { precision: 6, scale: 2 })
      .notNull()
      .default("0"),
    checkoutAttempts: integer("checkout_attempts").notNull().default(0),
    checkoutSuccesses: integer("checkout_successes").notNull().default(0),
    checkoutPct: numeric("checkout_pct", { precision: 5, scale: 2 })
      .notNull()
      .default("0"),
    total180s: integer("total_180s").notNull().default(0),
    total140s: integer("total_140s").notNull().default(0),
    total100s: integer("total_100s").notNull().default(0),
    highestFinish: integer("highest_finish").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    playerIdx: index("idx_player_stats_player").on(table.playerId),
  }),
);
