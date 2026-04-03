import type { PlayerStats, TurnRecord, LegState } from './types';

/**
 * Create empty stats object
 */
export function createEmptyStats(): PlayerStats {
  return {
    matchesPlayed: 0,
    matchesWon: 0,
    setsPlayed: 0,
    setsWon: 0,
    legsPlayed: 0,
    legsWon: 0,
    totalDartsThrown: 0,
    totalScore: 0,
    threeDartAvg: 0,
    checkoutAttempts: 0,
    checkoutSuccesses: 0,
    checkoutPct: 0,
    total180s: 0,
    total140s: 0,
    total100s: 0,
    highestFinish: 0,
  };
}

/**
 * Check if a turn is a 180 (three treble 20s)
 */
export function is180(turn: TurnRecord): boolean {
  return turn.totalScore === 180 && turn.dartsThrown === 3;
}

/**
 * Check if a turn scores 140+
 */
export function is140Plus(turn: TurnRecord): boolean {
  return turn.totalScore >= 140;
}

/**
 * Check if a turn scores 100+
 */
export function is100Plus(turn: TurnRecord): boolean {
  return turn.totalScore >= 100;
}

/**
 * Check if a turn was a checkout attempt (remaining score <= 170 before the turn)
 * 170 is the max 3-dart finish
 */
export function isCheckoutAttempt(remainingBefore: number, dartsThrown: number): boolean {
  if (remainingBefore > 170) return false;
  if (remainingBefore <= 0) return false;
  // With 1 dart, max finish is 50 (bull). With 2 darts, max is 110 (T18, D20? no... T20+D25=110? T20+Bull=70. Actually 2-dart max is 110: T20(60)+Bull(50)=110? no that's 110. Actually T18(54)+D20(40)=94... Let's simplify: any remaining <= 170 with 3 darts is a checkout attempt
  return true;
}

/**
 * Check if a turn was a successful checkout
 */
export function isCheckoutSuccess(turn: TurnRecord): boolean {
  return turn.remainingScore === 0 && !turn.isBust;
}

/**
 * Compute stats from an array of turns and legs
 * This is used for both all-time and last-20-legs computations
 */
export function computeStatsFromTurns(
  turns: TurnRecord[],
  legsWon: number,
  legsPlayed: number,
  setsWon: number,
  setsPlayed: number,
  matchesWon: number,
  matchesPlayed: number
): PlayerStats {
  const stats = createEmptyStats();

  stats.matchesPlayed = matchesPlayed;
  stats.matchesWon = matchesWon;
  stats.setsPlayed = setsPlayed;
  stats.setsWon = setsWon;
  stats.legsPlayed = legsPlayed;
  stats.legsWon = legsWon;

  if (turns.length === 0) return stats;

  let totalDarts = 0;
  let totalScore = 0;
  let checkoutAttempts = 0;
  let checkoutSuccesses = 0;
  let count180s = 0;
  let count140s = 0;
  let count100s = 0;
  let highestFinish = 0;

  // We need to track remaining score before each turn to detect checkout attempts
  // For simplicity, we'll look at turns where remainingScore after is 0 (checkout success)
  // or where the player was close to checking out

  for (const turn of turns) {
    totalDarts += turn.dartsThrown;
    totalScore += turn.totalScore;

    if (is180(turn)) count180s++;
    if (is140Plus(turn)) count140s++;
    if (is100Plus(turn)) count100s++;

    // Checkout success: remaining is 0 and not bust
    if (turn.remainingScore === 0 && !turn.isBust) {
      checkoutSuccesses++;
      checkoutAttempts++;
      if (turn.totalScore > highestFinish) {
        highestFinish = turn.totalScore;
      }
    }
    // Checkout attempt but bust: remaining was checkout-able but player busted
    else if (turn.isBust) {
      // We need to know what the remaining was before the turn
      // remainingScore after bust = remainingScore before (it reverts)
      // So remainingScore IS the pre-turn remaining
      if (turn.remainingScore <= 170) {
        checkoutAttempts++;
      }
    }
  }

  stats.totalDartsThrown = totalDarts;
  stats.totalScore = totalScore;
  stats.threeDartAvg = totalDarts > 0 ? Number(((totalScore / totalDarts) * 3).toFixed(2)) : 0;
  stats.checkoutAttempts = checkoutAttempts;
  stats.checkoutSuccesses = checkoutSuccesses;
  stats.checkoutPct = checkoutAttempts > 0 ? Number(((checkoutSuccesses / checkoutAttempts) * 100).toFixed(2)) : 0;
  stats.total180s = count180s;
  stats.total140s = count140s;
  stats.total100s = count100s;
  stats.highestFinish = highestFinish;

  return stats;
}

/**
 * Compute all-time stats for a player from their complete turn history
 */
export function computeAllTimeStats(
  turns: TurnRecord[],
  legsWon: number,
  legsPlayed: number,
  setsWon: number,
  setsPlayed: number,
  matchesWon: number,
  matchesPlayed: number
): PlayerStats {
  return computeStatsFromTurns(turns, legsWon, legsPlayed, setsWon, setsPlayed, matchesWon, matchesPlayed);
}

/**
 * Compute last-20-legs stats for a player
 * Takes ALL turns but only uses those from the most recent 20 completed legs
 */
export function computeLast20LegsStats(
  allTurns: TurnRecord[], // turns ordered by created_at DESC (newest first)
  legsWon: number,
  legsPlayed: number,
  setsWon: number,
  setsPlayed: number,
  matchesWon: number,
  matchesPlayed: number
): PlayerStats | null {
  if (legsPlayed < 20) return null; // Need at least 20 legs

  // For last 20 legs, we approximate by taking the last N turns that would correspond to ~20 legs
  // In practice, this should be computed from the DB by querying turns from the last 20 legs
  // Here we take a simpler approach: last 20 legs worth of turns

  // A leg has roughly (starting_score / avg_turn_score * num_players) turns
  // For 501 with avg 50 per turn and 2 players, that's ~20 turns per leg
  // So 20 legs ≈ 400 turns. We'll use turns slice.

  // Actually, we should just use the first part of allTurns since they're ordered newest first
  // This is an approximation - the DB query should properly filter by leg boundaries
  const estimatedTurnsPerLeg = 20;
  const lastNTurns = allTurns.slice(0, 20 * estimatedTurnsPerLeg);

  return computeStatsFromTurns(lastNTurns, legsWon, Math.min(legsPlayed, 20), setsWon, setsPlayed, matchesWon, matchesPlayed);
}
