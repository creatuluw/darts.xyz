import type { DartData, Multiplier, TurnData } from './types';

/**
 * Calculate the score for a single dart
 */
export function calculateDartScore(segment: number, multiplier: Multiplier): number {
  if (multiplier === 0) return 0; // miss
  if (segment === 0) return 0; // miss
  // Bull: segment 25, multiplier 1 = outer bull (25), multiplier 2 = inner bull (50)
  return segment * multiplier;
}

/**
 * Create a DartData object from segment and multiplier
 */
export function createDart(segment: number, multiplier: Multiplier): DartData {
  return {
    segment,
    multiplier,
    score: calculateDartScore(segment, multiplier),
  };
}

/**
 * Calculate total score for a turn (sum of all darts)
 */
export function calculateTurnScore(darts: DartData[]): number {
  return darts.reduce((sum, d) => sum + d.score, 0);
}

/**
 * Detect if a turn results in a bust.
 * Bust occurs when:
 * - Score goes below 0
 * - Score goes to exactly 1 (can't finish with a double)
 * - Score goes to 0 but the last dart is NOT a double (multiplier !== 2)
 */
export function detectBust(
  remainingScore: number,
  turnScore: number,
  lastDartMultiplier: Multiplier,
  dartsThrown: number
): boolean {
  const newScore = remainingScore - turnScore;

  // Score goes below 0
  if (newScore < 0) return true;

  // Score lands on 1 (impossible to double out)
  if (newScore === 1) return true;

  // Score reaches 0 but last dart is not a double
  if (newScore === 0 && lastDartMultiplier !== 2) return true;

  return false;
}

/**
 * Detect if a turn results in a checkout (leg win).
 * Checkout: remaining score reaches exactly 0 with the final dart being a double.
 */
export function detectCheckout(
  remainingScore: number,
  turnScore: number,
  lastDartMultiplier: Multiplier
): boolean {
  const newScore = remainingScore - turnScore;
  return newScore === 0 && lastDartMultiplier === 2;
}

/**
 * Get the new remaining score after a turn.
 * If bust, returns the original remaining score.
 */
export function getRemainingScore(
  currentRemaining: number,
  turnScore: number,
  isBust: boolean
): number {
  if (isBust) return currentRemaining;
  return currentRemaining - turnScore;
}

/**
 * Process darts for a turn, determining if it's a bust or checkout
 */
export function processTurn(darts: DartData[], remainingScore: number): TurnData {
  const totalScore = calculateTurnScore(darts);
  const dartsThrown = darts.length;
  const lastDart = darts[dartsThrown - 1];
  const lastMultiplier = lastDart ? lastDart.multiplier : 0;

  const isBust = detectBust(remainingScore, totalScore, lastMultiplier, dartsThrown);

  return {
    darts,
    totalScore,
    isBust,
    dartsThrown,
  };
}
