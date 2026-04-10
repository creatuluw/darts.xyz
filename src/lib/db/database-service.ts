import { getDb, schema } from "./index";
import { eq, and, desc, sql, inArray, isNull } from "drizzle-orm";

export class DatabaseService {
  // === PLAYERS ===

  async createPlayer(name: string, email: string) {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if player already exists with this email (unique constraint)
    const existingByEmail = await getDb()
      .select()
      .from(schema.players)
      .where(
        and(
          eq(schema.players.email, normalizedEmail),
          isNull(schema.players.deletedAt),
        ),
      )
      .limit(1);
    if (existingByEmail.length > 0) return existingByEmail[0];

    // Check if player exists by name (case-insensitive) for this email account
    const existingByName = await getDb()
      .select()
      .from(schema.players)
      .where(
        and(
          sql`LOWER(${schema.players.name}) = LOWER(${name})`,
          eq(schema.players.email, normalizedEmail),
          isNull(schema.players.deletedAt),
        ),
      )
      .limit(1);
    if (existingByName.length > 0) return existingByName[0];

    // Create new player with explicit values
    const result = await getDb()
      .insert(schema.players)
      .values({
        name: name.trim(),
        email: normalizedEmail,
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

  async getPlayerByEmail(email: string) {
    const result = await getDb()
      .select()
      .from(schema.players)
      .where(
        and(
          eq(schema.players.email, email.toLowerCase()),
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

  async getAllPlayers(email?: string) {
    if (email) {
      // Get all players for a specific email
      return getDb()
        .select()
        .from(schema.players)
        .where(
          and(
            eq(schema.players.email, email.toLowerCase()),
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

  async softDeletePlayer(id: string) {
    // Soft delete: set deletedAt timestamp, preserve all match/replay data
    await getDb()
      .update(schema.players)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(schema.players.id, id));
  }

  async deletePlayer(id: string) {
    // Alias to softDeletePlayer for backwards compatibility
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
    // Get all legs for this match
    const matchLegs = await getDb()
      .select({ id: schema.legs.id })
      .from(schema.legs)
      .where(eq(schema.legs.matchId, id));

    const legIds = matchLegs.map((l) => l.id);

    // Delete turns for all legs
    if (legIds.length > 0) {
      await getDb()
        .delete(schema.turns)
        .where(inArray(schema.turns.legId, legIds));
    }

    // Delete legs
    await getDb().delete(schema.legs).where(eq(schema.legs.matchId, id));

    // Delete match players
    await getDb()
      .delete(schema.matchPlayers)
      .where(eq(schema.matchPlayers.matchId, id));

    // Delete the match itself
    await getDb().delete(schema.matches).where(eq(schema.matches.id, id));
  }

  async getActiveMatches() {
    return getDb()
      .select()
      .from(schema.matches)
      .where(eq(schema.matches.status, "in_progress"))
      .orderBy(desc(schema.matches.createdAt));
  }

  async getRecentMatches(limit = 10, email?: string) {
    // If email provided, filter matches by accountId on matches table
    if (email) {
      // Primary: filter by accountId on matches table
      return getDb()
        .select()
        .from(schema.matches)
        .where(eq(schema.matches.accountId, email.toLowerCase()))
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

  // === EMAIL-BASED QUERIES ===

  /**
   * Get all data associated with an email address.
   * Returns player info, stats, and recent matches.
   */
  async getDataByEmail(email: string) {
    const player = await this.getPlayerByEmail(email);
    if (!player) {
      return null;
    }

    const stats = await this.getPlayerStats(player.id);
    const recentMatches = await this.getMatchesForPlayer(player.id);

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
      player,
      stats,
      matches: recentMatches,
      matchPlayers,
      legs,
      turns,
    };
  }

  /**
   * Check if email exists in the database
   */
  async emailExists(email: string): Promise<boolean> {
    const player = await this.getPlayerByEmail(email);
    return player !== null;
  }
}

export const dbService = new DatabaseService();
