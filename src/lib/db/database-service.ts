import { db, schema } from "./index";
import { eq, and, desc, sql, inArray } from "drizzle-orm";

export class DatabaseService {
  // === PLAYERS ===

  async createPlayer(name: string) {
    // Check if player exists (case-insensitive)
    const existing = await db
      .select()
      .from(schema.players)
      .where(sql`LOWER(${schema.players.name}) = LOWER(${name})`)
      .limit(1);
    if (existing.length > 0) return existing[0];

    const result = await db.insert(schema.players).values({ name }).returning();
    // Also create empty stats row
    await db.insert(schema.playerStats).values({ playerId: result[0].id });
    return result[0];
  }

  async getPlayer(id: string) {
    const result = await db
      .select()
      .from(schema.players)
      .where(eq(schema.players.id, id))
      .limit(1);
    return result[0] || null;
  }

  async getPlayerByName(name: string) {
    const result = await db
      .select()
      .from(schema.players)
      .where(sql`LOWER(${schema.players.name}) = LOWER(${name})`)
      .limit(1);
    return result[0] || null;
  }

  async getAllPlayers() {
    return db
      .select()
      .from(schema.players)
      .orderBy(desc(schema.players.createdAt));
  }

  async deletePlayer(id: string) {
    // Delete player stats
    await db
      .delete(schema.playerStats)
      .where(eq(schema.playerStats.playerId, id));

    // Get all match IDs for this player
    const mp = await db
      .select({ matchId: schema.matchPlayers.matchId })
      .from(schema.matchPlayers)
      .where(eq(schema.matchPlayers.playerId, id));
    const matchIds = mp.map((m) => m.matchId);

    // Delete turns for this player
    await db.delete(schema.turns).where(eq(schema.turns.playerId, id));

    // Null out leg winner references
    await db
      .update(schema.legs)
      .set({ winnerId: null })
      .where(eq(schema.legs.winnerId, id));

    // Delete match player entries
    await db
      .delete(schema.matchPlayers)
      .where(eq(schema.matchPlayers.playerId, id));

    // Delete any now-orphaned matches (matches with no remaining players)
    if (matchIds.length > 0) {
      for (const matchId of matchIds) {
        const remaining = await db
          .select({ id: schema.matchPlayers.id })
          .from(schema.matchPlayers)
          .where(eq(schema.matchPlayers.matchId, matchId));
        if (remaining.length === 0) {
          // Cascade delete legs → turns, then match
          const matchLegs = await db
            .select({ id: schema.legs.id })
            .from(schema.legs)
            .where(eq(schema.legs.matchId, matchId));
          const legIds = matchLegs.map((l) => l.id);
          if (legIds.length > 0) {
            await db
              .delete(schema.turns)
              .where(inArray(schema.turns.legId, legIds));
          }
          await db.delete(schema.legs).where(eq(schema.legs.matchId, matchId));
          await db.delete(schema.matches).where(eq(schema.matches.id, matchId));
        }
      }
    }

    // Finally delete the player
    await db.delete(schema.players).where(eq(schema.players.id, id));
  }

  // === MATCHES ===

  async createMatch(config: {
    startingScore: number;
    legsPerSet: number;
    setsPerMatch: number;
    doubleIn: boolean;
  }) {
    const result = await db
      .insert(schema.matches)
      .values({
        startingScore: config.startingScore,
        legsPerSet: config.legsPerSet,
        setsPerMatch: config.setsPerMatch,
        doubleIn: config.doubleIn,
      })
      .returning();
    return result[0];
  }

  async getMatch(id: string) {
    const result = await db
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
    await db
      .update(schema.matches)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.matches.id, id));
  }

  async deleteMatch(id: string) {
    // Get all legs for this match
    const matchLegs = await db
      .select({ id: schema.legs.id })
      .from(schema.legs)
      .where(eq(schema.legs.matchId, id));

    const legIds = matchLegs.map((l) => l.id);

    // Delete turns for all legs
    if (legIds.length > 0) {
      await db.delete(schema.turns).where(inArray(schema.turns.legId, legIds));
    }

    // Delete legs
    await db.delete(schema.legs).where(eq(schema.legs.matchId, id));

    // Delete match players
    await db
      .delete(schema.matchPlayers)
      .where(eq(schema.matchPlayers.matchId, id));

    // Delete the match itself
    await db.delete(schema.matches).where(eq(schema.matches.id, id));
  }

  async getActiveMatches() {
    return db
      .select()
      .from(schema.matches)
      .where(eq(schema.matches.status, "in_progress"))
      .orderBy(desc(schema.matches.createdAt));
  }

  async getRecentMatches(limit = 10) {
    return db
      .select()
      .from(schema.matches)
      .orderBy(desc(schema.matches.createdAt))
      .limit(limit);
  }

  // === MATCH PLAYERS ===

  async addMatchPlayer(matchId: string, playerId: string, throwOrder: number) {
    const result = await db
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
    return db
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
    await db
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
    const result = await db
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
    await db
      .update(schema.legs)
      .set({ winnerId })
      .where(eq(schema.legs.id, legId));
  }

  async getMatchLegs(matchId: string) {
    return db
      .select()
      .from(schema.legs)
      .where(eq(schema.legs.matchId, matchId))
      .orderBy(schema.legs.setNumber, schema.legs.legNumber);
  }

  async getLeg(id: string) {
    const result = await db
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
    const result = await db.insert(schema.turns).values(turn).returning();
    return result[0];
  }

  async getLegTurns(legId: string) {
    return db
      .select()
      .from(schema.turns)
      .where(eq(schema.turns.legId, legId))
      .orderBy(schema.turns.turnNumber);
  }

  async deleteTurn(turnId: string) {
    await db.delete(schema.turns).where(eq(schema.turns.id, turnId));
  }

  async getPlayerTurns(playerId: string, limit?: number) {
    const query = db
      .select()
      .from(schema.turns)
      .where(eq(schema.turns.playerId, playerId))
      .orderBy(desc(schema.turns.createdAt));
    if (limit) return query.limit(limit);
    return query;
  }

  async getTurnsForLegs(legIds: string[]) {
    if (legIds.length === 0) return [];
    return db
      .select()
      .from(schema.turns)
      .where(inArray(schema.turns.legId, legIds))
      .orderBy(desc(schema.turns.createdAt));
  }

  // === STATS ===

  async getPlayerStats(playerId: string) {
    const result = await db
      .select()
      .from(schema.playerStats)
      .where(eq(schema.playerStats.playerId, playerId))
      .limit(1);
    return result[0] || null;
  }

  async updatePlayerStats(playerId: string, stats: Record<string, unknown>) {
    await db
      .update(schema.playerStats)
      .set({ ...stats, updatedAt: new Date() })
      .where(eq(schema.playerStats.playerId, playerId));
  }

  // === HELPERS ===

  async getMatchesForPlayer(playerId: string) {
    const mp = await db
      .select()
      .from(schema.matchPlayers)
      .where(eq(schema.matchPlayers.playerId, playerId));
    const matchIds = mp.map((m) => m.matchId);
    if (matchIds.length === 0) return [];
    return db
      .select()
      .from(schema.matches)
      .where(inArray(schema.matches.id, matchIds))
      .orderBy(desc(schema.matches.createdAt));
  }
}

export const dbService = new DatabaseService();
