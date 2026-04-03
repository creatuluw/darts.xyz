import type { DartData, CheckoutOption, Multiplier } from './types';
import { createDart } from './scoring';

// All possible double checkout targets (even numbers 2-40, plus bull=50)
const DOUBLE_TARGETS: Array<{ segment: number; multiplier: 2; score: number }> = [];
for (let i = 1; i <= 20; i++) {
  DOUBLE_TARGETS.push({ segment: i, multiplier: 2, score: i * 2 });
}
DOUBLE_TARGETS.push({ segment: 25, multiplier: 2, score: 50 }); // bull

// Get all possible finishes with 1 dart (must be a double)
function getOneDartFinishes(remaining: number): CheckoutOption[] {
  const options: CheckoutOption[] = [];
  for (const d of DOUBLE_TARGETS) {
    if (d.score === remaining) {
      const label = d.segment === 25 ? 'Bull' : `D${d.segment}`;
      options.push({
        darts: [createDart(d.segment, 2)],
        description: label,
      });
    }
  }
  return options;
}

// Get all possible finishes with 2 darts (any + double)
function getTwoDartFinishes(remaining: number): CheckoutOption[] {
  const options: CheckoutOption[] = [];

  // Try each double as the last dart
  for (const doubleTarget of DOUBLE_TARGETS) {
    const needed = remaining - doubleTarget.score;
    if (needed <= 0) continue;
    if (needed > 60) continue; // max single dart is T20=60

    // Try all possible first darts
    for (let seg = 1; seg <= 20; seg++) {
      for (const mult of [3, 2, 1] as Multiplier[]) {
        if (seg * mult === needed) {
          const prefix = mult === 3 ? 'T' : mult === 2 ? 'D' : 'S';
          const doubleLabel = doubleTarget.segment === 25 ? 'Bull' : `D${doubleTarget.segment}`;
          options.push({
            darts: [createDart(seg, mult), createDart(doubleTarget.segment, 2)],
            description: `${prefix}${seg} → ${doubleLabel}`,
          });
        }
      }
    }

    // Also try bull (25) as first dart
    if (needed === 25) {
      const doubleLabel = doubleTarget.segment === 25 ? 'Bull' : `D${doubleTarget.segment}`;
      options.push({
        darts: [createDart(25, 1), createDart(doubleTarget.segment, 2)],
        description: `25 → ${doubleLabel}`,
      });
    }
  }

  return options;
}

// Get all possible finishes with 3 darts
function getThreeDartFinishes(remaining: number): CheckoutOption[] {
  const options: CheckoutOption[] = [];

  for (const doubleTarget of DOUBLE_TARGETS) {
    const needed = remaining - doubleTarget.score;
    if (needed <= 0) continue;
    if (needed > 120) continue; // max 2 darts is 120 (T20+T20)

    // Try all combinations of first two darts
    for (let seg1 = 20; seg1 >= 1; seg1--) {
      for (const mult1 of [3, 2, 1] as Multiplier[]) {
        const score1 = seg1 * mult1;
        const remaining2 = needed - score1;
        if (remaining2 <= 0 || remaining2 > 60) continue;

        for (let seg2 = 20; seg2 >= 1; seg2--) {
          for (const mult2 of [3, 2, 1] as Multiplier[]) {
            if (seg2 * mult2 === remaining2) {
              const p1 = mult1 === 3 ? 'T' : mult1 === 2 ? 'D' : 'S';
              const p2 = mult2 === 3 ? 'T' : mult2 === 2 ? 'D' : 'S';
              const doubleLabel = doubleTarget.segment === 25 ? 'Bull' : `D${doubleTarget.segment}`;
              options.push({
                darts: [createDart(seg1, mult1), createDart(seg2, mult2), createDart(doubleTarget.segment, 2)],
                description: `${p1}${seg1} → ${p2}${seg2} → ${doubleLabel}`,
              });
            }
          }
        }

        // Bull as second dart
        if (remaining2 === 25) {
          const p1 = mult1 === 3 ? 'T' : mult1 === 2 ? 'D' : 'S';
          const doubleLabel = doubleTarget.segment === 25 ? 'Bull' : `D${doubleTarget.segment}`;
          options.push({
            darts: [createDart(seg1, mult1), createDart(25, 1), createDart(doubleTarget.segment, 2)],
            description: `${p1}${seg1} → 25 → ${doubleLabel}`,
          });
        }
      }
    }
  }

  return options;
}

/**
 * Get checkout suggestions for a remaining score
 * @param remaining The player's remaining score
 * @param dartsLeft Number of darts remaining in the turn (1, 2, or 3)
 * @returns Array of possible checkout combinations
 */
export function getCheckoutSuggestions(remaining: number, dartsLeft: 1 | 2 | 3 = 3): CheckoutOption[] {
  // Impossible finishes
  if (remaining <= 0) return [];
  if (remaining === 1) return []; // Can't finish on 1 (need double)
  if (remaining > 170) return []; // Max finish is 170 (T20 T20 Bull)

  // Odd numbers above 40 that can't be finished with 3 darts
  // Actually, many odd numbers CAN be finished (e.g., 141 = T20 T19 D12)
  // 159, 162, 163, 165, 166, 168, 169 are impossible

  let options: CheckoutOption[] = [];

  if (dartsLeft >= 3) {
    options = getThreeDartFinishes(remaining);
  }

  if (dartsLeft >= 2 && options.length === 0) {
    options = getTwoDartFinishes(remaining);
  }

  if (dartsLeft >= 1 && options.length === 0) {
    options = getOneDartFinishes(remaining);
  }

  // Prioritize treble-heavy finishes (common in professional darts)
  // Limit to top 3 suggestions
  return options.slice(0, 3);
}

/**
 * Check if a score can be checked out
 */
export function canCheckout(remaining: number, dartsLeft: number): boolean {
  if (remaining <= 1) return false;
  if (remaining > 170) return false;
  if (dartsLeft === 1) return remaining <= 50 && (remaining % 2 === 0 || remaining === 50);
  if (dartsLeft === 2) return remaining <= 110;
  return true; // With 3 darts, most scores <= 170 are finishable
}
