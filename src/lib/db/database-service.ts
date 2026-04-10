import { getDb, schema } from "./index";
import { eq, and, desc, sql, inArray, isNull } from "drizzle-orm";

export class DatabaseService {
  // === PLAYERS ===

  async createPlayer(name: string, accountId: string, playerEmail?: string) {
    const normalizedAccountId = accountId.toLowerCase().trim();

    // Check if player with same name already exists for this account
    const existingByName = await getDb()
      .select()
      .from(schema.players)
      .where(
        and(
          sql`LOWER(${schema.players.name}) = LOWER(${name})`,
          eq(schema.players.accountId, normalizedAccountId),
          isNull(schema.players.deletedAt),
        ),
      )
      .limit(1);
    if (existingByName.length > 0) return existingByName[0];

    // Create new player associated with the account
    const result = await getDb()
      .insert(schema.players)
      .values({
        name: name.trim(),
        accountId: normalizedAccountId,
        playerEmail: playerEmail?.trim().toLowerCase() || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Also create empty stats row
    await getDb().insert(schema.playerStats).values({ playerId: result[0].id });
    return result[0];
  }

  async getPlayer(id: string) {
    const result = await getDb()
      .select()
      .from(schema.players)
      .where(and(eq(schema.players.id, id), isNull(schema.players.deletedAt)))
      .limit(1);
    return result[0] || null;
  }

  async getPlayerByAccountId(accountId: string) {
    const result = await getDb()
      .select()
      .from(schema.players)
      .where(
        and(
          eq(schema.players.accountId, accountId.toLowerCase()),
          isNull(schema.players.deletedAt),
        ),
      )
      .limit(1);
    return result[0] || null;
  }

  async getPlayerByName(name: string) {
    const result = await getDb()
      .select()
      .from(schema.players)
      .where(
        and(
          sql`LOWER(${schema.players.name}) = LOWER(${name})`,
          isNull(schema.players.deletedAt),
        ),
      )
      .limit(1);
    return result[0] || null;
  }

  async getAllPlayers(accountId?: string) {
    if (accountId) {
      // Get all players for a specific account
      return getDb()
        .select()
        .from(schema.players)
        .where(
          and(
            eq(schema.players.accountId, accountId.toLowerCase()),
            isNull(schema.players.deletedAt),
          ),
        )
        .orderBy(desc(schema.players.createdAt));
    }
    return getDb()
      .select()
      .from(schema.players)
      .where(isNull(schema.players.deletedAt))
      .orderBy(desc(schema.players.createdAt));
  }

  async updatePlayerEmail(id: string, playerEmail: string | null) {
    await getDb()
      .update(schema.players)
      .set({ playerEmail, updatedAt: new Date() })
      .where(eq(schema.players.id, id));
  }

  async softDeletePlayer(id: string) {
    await getDb()
      .update(schema.players)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(schema.players.id, id));
  }

  async deletePlayer(id: string) {
    return this.softDeletePlayer(id);
  }

  // === MATCHES ===

  async createMatch(config: {
    startingScore: number;
    legsPerSet: number;
    setsPerMatch: number;
    doubleIn: boolean;
    accountId?: string;
  }) {
    const result = await getDb()
      .insert(schema.matches)
      .values({
        startingScore: config.startingScore,
        legsPerSet: config.legsPerSet,
        setsPerMatch: config.setsPerMatch,
        doubleIn: config.doubleIn,
        accountId: config.accountId,
      })
      .returning();
    return result[0];
  }

  async getMatch(id: string) {
    const result = await getDb()
      .select()
      .from(schema.matches)
      .where(eq(schema.matches.id, id))
      .limit(1);
    return result[0] || null;
  }

  async updateMatch(
    id: string,
    updates: { status?: string; winnerId?: string },
  ) {
    await getDb()
      .update(schema.matches)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.matches.id, id));
  }

  async deleteMatch(id: string) {
    const matchLegs = await getDb()
      .select({ id: schema.legs.id })
      .from(schema.legs)
      .where(eq(schema.legs.matchId, id));

    const legIds = matchLegs.map((l) => l.id);

    if (legIds.length > 0) {
      await getDb()
        .delete(schema.turns)
        .where(inArray(schema.turns.legId, legIds));
    }

    await getDb().delete(schema.legs).where(eq(schema.legs.matchId, id));
    await getDb()
      .delete(schema.matchPlayers)
      .where(eq(schema.matchPlayers.matchId, id));
    await getDb().delete(schema.matches).where(eq(schema.matches.id, id));
  }

  async getActiveMatches() {
    return getDb()
      .select()
      .from(schema.matches)
      .where(eq(schema.matches.status, "in_progress"))
      .orderBy(desc(schema.matches.createdAt));
  }

  async getRecentMatches(limit = 10, accountId?: string) {
    if (accountId) {
      return getDb()
        .select()
        .from(schema.matches)
        .where(eq(schema.matches.accountId, accountId.toLowerCase()))
        .orderBy(desc(schema.matches.createdAt))
        .limit(limit);
    }

    return getDb()
      .select()
      .from(schema.matches)
      .orderBy(desc(schema.matches.createdAt))
      .limit(limit);
  }

  // === MATCH PLAYERS ===

  async addMatchPlayer(matchId: string, playerId: string, throwOrder: number) {
    const result = await getDb()
      .insert(schema.matchPlayers)
      .values({
        matchId,
        playerId,
        throwOrder,
      })
      .returning();
    return result[0];
  }

  async getMatchPlayers(matchId: string) {
    return getDb()
      .select()
      .from(schema.matchPlayers)
      .where(eq(schema.matchPlayers.matchId, matchId))
      .orderBy(schema.matchPlayers.throwOrder);
  }

  async updateMatchPlayerSets(
    matchId: string,
    playerId: string,
    setsWon: number,
    legsWon: number,
  ) {
    await getDb()
      .update(schema.matchPlayers)
      .set({ setsWon, legsWon })
      .where(
        and(
          eq(schema.matchPlayers.matchId, matchId),
          eq(schema.matchPlayers.playerId, playerId),
        ),
      );
  }

  // === LEGS ===

  async createLeg(
    matchId: string,
    setNumber: number,
    legNumber: number,
    firstThrowerId: string,
  ) {
    const result = await getDb()
      .insert(schema.legs)
      .values({
        matchId,
        setNumber,
        legNumber,
        firstThrowerId,
      })
      .returning();
    return result[0];
  }

  async updateLegWinner(legId: string, winnerId: string) {
    await getDb()
      .update(schema.legs)
      .set({ winnerId })
      .where(eq(schema.legs.id, legId));
  }

  async getMatchLegs(matchId: string) {
    return getDb()
      .select()
      .from(schema.legs)
      .where(eq(schema.legs.matchId, matchId))
      .orderBy(schema.legs.setNumber, schema.legs.legNumber);
  }

  async getLeg(id: string) {
    const result = await getDb()
      .select()
      .from(schema.legs)
      .where(eq(schema.legs.id, id))
      .limit(1);
    return result[0] || null;
  }

  // === TURNS ===

  async addTurn(turn: {
    legId: string;
    playerId: string;
    turnNumber: number;
    dart1Score: number;
    dart1Multiplier: number;
    dart1Segment: number;
    dart2Score: number;
    dart2Multiplier: number;
    dart2Segment: number;
    dart3Score: number;
    dart3Multiplier: number;
    dart3Segment: number;
    totalScore: number;
    remainingScore: number;
    isBust: boolean;
    dartsThrown: number;
  }) {
    const result = await getDb().insert(schema.turns).values(turn).returning();
    return result[0];
  }

  async getLegTurns(legId: string) {
    return getDb()
      .select()
      .from(schema.turns)
      .where(eq(schema.turns.legId, legId))
      .orderBy(schema.turns.turnNumber);
  }

  async deleteTurn(turnId: string) {
    await getDb().delete(schema.turns).where(eq(schema.turns.id, turnId));
  }

  async getPlayerTurns(playerId: string, limit?: number) {
    const query = getDb()
      .select()
      .from(schema.turns)
      .where(eq(schema.turns.playerId, playerId))
      .orderBy(desc(schema.turns.createdAt));
    if (limit) return query.limit(limit);
    return query;
  }

  async getTurnsForLegs(legIds: string[]) {
    if (legIds.length === 0) return [];
    return getDb()
      .select()
      .from(schema.turns)
      .where(inArray(schema.turns.legId, legIds))
      .orderBy(desc(schema.turns.createdAt));
  }

  // === STATS ===

  async getPlayerStats(playerId: string) {
    const result = await getDb()
      .select()
      .from(schema.playerStats)
      .where(eq(schema.playerStats.playerId, playerId))
      .limit(1);
    return result[0] || null;
  }

  async updatePlayerStats(playerId: string, stats: Record<string, unknown>) {
    await getDb()
      .update(schema.playerStats)
      .set({ ...stats, updatedAt: new Date() })
      .where(eq(schema.playerStats.playerId, playerId));
  }

  // === ACCOUNT SETTINGS ===

  async getAccountSettings(accountId: string) {
    const result = await getDb()
      .select()
      .from(schema.accountSettings)
      .where(eq(schema.accountSettings.accountId, accountId.toLowerCase()))
      .limit(1);
    return result[0] || null;
  }

  async upsertAccountSettings(
    accountId: string,
    settings: {
      smtpHost?: string | null;
      smtpPort?: number | null;
      smtpUser?: string | null;
      smtpPassword?: string | null;
      smtpFrom?: string | null;
    },
  ) {
    const existing = await this.getAccountSettings(accountId);

    if (existing) {
      await getDb()
        .update(schema.accountSettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(schema.accountSettings.accountId, accountId.toLowerCase()));
      return this.getAccountSettings(accountId);
    }

    const result = await getDb()
      .insert(schema.accountSettings)
      .values({
        accountId: accountId.toLowerCase(),
        ...settings,
      })
      .returning();
    return result[0];
  }

  // === HELPERS ===

  async getMatchesForPlayer(playerId: string) {
    const mp = await getDb()
      .select()
      .from(schema.matchPlayers)
      .where(eq(schema.matchPlayers.playerId, playerId));
    const matchIds = mp.map((m) => m.matchId);
    if (matchIds.length === 0) return [];
    return getDb()
      .select()
      .from(schema.matches)
      .where(inArray(schema.matches.id, matchIds))
      .orderBy(desc(schema.matches.createdAt));
  }

  async getMatchPlayerEntries(playerId: string) {
    return getDb()
      .select()
      .from(schema.matchPlayers)
      .where(eq(schema.matchPlayers.playerId, playerId));
  }

  async getAllLegsForMatches(matchIds: string[]) {
    if (matchIds.length === 0) return [];
    return getDb()
      .select()
      .from(schema.legs)
      .where(inArray(schema.legs.matchId, matchIds))
      .orderBy(schema.legs.setNumber, schema.legs.legNumber);
  }

  async getAllTurnsForPlayer(playerId: string) {
    return getDb()
      .select()
      .from(schema.turns)
      .where(eq(schema.turns.playerId, playerId))
      .orderBy(schema.turns.createdAt);
  }

  // === ACCOUNT-BASED QUERIES ===

  /**
   * Get all data associated with an account (accountId / email).
   * Returns players, stats, and recent matches.
   */
  async getDataByAccountId(accountId: string) {
    const players = await this.getAllPlayers(accountId);
    if (players.length === 0) {
      return null;
    }

    const allStats = await Promise.all(
      players.map((p) => this.getPlayerStats(p.id)),
    );

    const recentMatches = await this.getRecentMatches(20, accountId);

    // Get match players for recent matches
    const matchIds = recentMatches.map((m) => m.id);
    const matchPlayers =
      matchIds.length > 0
        ? await getDb()
            .select()
            .from(schema.matchPlayers)
            .where(inArray(schema.matchPlayers.matchId, matchIds))
        : [];

    // Get legs for recent matches
    const legs = await this.getAllLegsForMatches(matchIds);

    // Get turns for those legs
    const legIds = legs.map((l) => l.id);
    const turns = await this.getTurnsForLegs(legIds);

    return {
      players,
      stats: allStats,
      matches: recentMatches,
      matchPlayers,
      legs,
      turns,
    };
  }

  /**
   * Check if any players exist for an account
   */
  async accountExists(accountId: string): Promise<boolean> {
    const players = await this.getAllPlayers(accountId);
    return players.length > 0;
  }
}

export const dbService = new DatabaseService();
