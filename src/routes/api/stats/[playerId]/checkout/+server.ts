import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";
import { computeStatsFromTurns } from "$lib/game/stats-engine";

export const GET: RequestHandler = async ({ params }) => {
  const playerId = params.playerId;

  const [allTurns, allMatches] = await Promise.all([
    dbService.getAllTurnsForPlayer(playerId),
    dbService.getMatchesForPlayer(playerId),
  ]);

  if (allMatches.length === 0 && allTurns.length === 0) {
    return json({
      checkoutPct: 0,
      checkoutAttempts: 0,
      checkoutSuccesses: 0,
      checkoutRanges: [],
      bestFinishes: [],
      recentCheckouts: [],
    });
  }

  const matchIds = allMatches.map((m) => m.id);
  const allLegs = await dbService.getAllLegsForMatches(matchIds);

  // Process turns to extract checkout data
  const turnRecords = allTurns.map((t) => ({
    id: t.id,
    playerId: t.playerId,
    turnNumber: t.turnNumber,
    darts: [
      {
        segment: t.dart1Segment,
        multiplier: t.dart1Multiplier as 0 | 1 | 2 | 3,
        score: t.dart1Score,
      },
      {
        segment: t.dart2Segment,
        multiplier: t.dart2Multiplier as 0 | 1 | 2 | 3,
        score: t.dart2Score,
      },
      {
        segment: t.dart3Segment,
        multiplier: t.dart3Multiplier as 0 | 1 | 2 | 3,
        score: t.dart3Score,
      },
    ],
    totalScore: t.totalScore,
    remainingScore: t.remainingScore,
    isBust: t.isBust,
    dartsThrown: t.dartsThrown,
  }));

  // Calculate checkout statistics
  let checkoutAttempts = 0;
  let checkoutSuccesses = 0;
  let doubleChances = 0; // Number of times a dart left an even score (potential double finish)
  let throwsOnDouble = 0; // Number of throws taken when on a double chance
  const checkoutRanges: Record<
    string,
    {
      attempts: number;
      successes: number;
      label: string;
      throwsOnDouble: number;
      successesOnDouble: number;
      doubleConversion: number;
    }
  > = {
    "0-20": {
      attempts: 0,
      successes: 0,
      label: "0-20",
      throwsOnDouble: 0,
      successesOnDouble: 0,
      doubleConversion: 0,
    },
    "21-40": {
      attempts: 0,
      successes: 0,
      label: "21-40",
      throwsOnDouble: 0,
      successesOnDouble: 0,
      doubleConversion: 0,
    },
    "41-60": {
      attempts: 0,
      successes: 0,
      label: "41-60",
      throwsOnDouble: 0,
      successesOnDouble: 0,
      doubleConversion: 0,
    },
    "61-80": {
      attempts: 0,
      successes: 0,
      label: "61-80",
      throwsOnDouble: 0,
      successesOnDouble: 0,
      doubleConversion: 0,
    },
    "81-100": {
      attempts: 0,
      successes: 0,
      label: "81-100",
      throwsOnDouble: 0,
      successesOnDouble: 0,
      doubleConversion: 0,
    },
    "101-120": {
      attempts: 0,
      successes: 0,
      label: "101-120",
      throwsOnDouble: 0,
      successesOnDouble: 0,
      doubleConversion: 0,
    },
    "121-140": {
      attempts: 0,
      successes: 0,
      label: "121-140",
      throwsOnDouble: 0,
      successesOnDouble: 0,
      doubleConversion: 0,
    },
    "141-170": {
      attempts: 0,
      successes: 0,
      label: "141-170",
      throwsOnDouble: 0,
      successesOnDouble: 0,
      doubleConversion: 0,
    },
  };

  // Helper: check if score is a valid double out (any even number is a valid double)
  // D1=2, D2=4, D3=6, ... D20=40, D25=50 (bull), and any even number has a corresponding double
  function isValidDoubleOut(score: number): boolean {
    return score > 0 && score % 2 === 0;
  }

  // Helper: get range key for a score
  function getRangeKey(score: number): string {
    if (score > 140) return "141-170";
    if (score > 120) return "121-140";
    if (score > 100) return "101-120";
    if (score > 80) return "81-100";
    if (score > 60) return "61-80";
    if (score > 40) return "41-60";
    if (score > 20) return "21-40";
    return "0-20";
  }

  const bestFinishes: { score: number; darts: number; date: string }[] = [];
  const recentCheckouts: Array<{
    score: number;
    darts: number;
    success: boolean;
    date: string;
    route?: string;
  }> = [];

  const legMap = new Map(allLegs.map((l) => [l.id, l]));

  for (const turn of turnRecords) {
    // Calculate starting score for this turn (before any darts thrown)
    const startOfTurnRemaining = turn.remainingScore + turn.totalScore;

    // Track per-dart: are we in a checkout situation (below 170)?
    let onDoubleChance = false; // Was the previous dart leaving a double chance?
    let runningRemaining = startOfTurnRemaining;

    // Process each dart individually to track double chances
    for (let i = 0; i < turn.darts.length; i++) {
      const dart = turn.darts[i];
      if (dart.score === 0) continue; // Skip empty darts

      // Before throwing this dart, check if we're on a double chance
      if (runningRemaining <= 170 && runningRemaining > 0) {
        if (isValidDoubleOut(runningRemaining)) {
          // We're on a double - count this as a throw on double
          throwsOnDouble++;
          onDoubleChance = true;
          // Track throws on double per range (based on starting score before the dart)
          const rangeKey = getRangeKey(runningRemaining);
          checkoutRanges[rangeKey].throwsOnDouble++;
        } else if (onDoubleChance) {
          // We were on a double but the score went odd/non-double
          // Wait for next double opportunity
          onDoubleChance = false;
        }
      }

      // After throwing this dart, calculate new remaining
      runningRemaining -= dart.score;

      // Check if this dart left us on a double chance
      if (
        runningRemaining <= 170 &&
        runningRemaining > 0 &&
        isValidDoubleOut(runningRemaining)
      ) {
        doubleChances++;
        onDoubleChance = true;
      } else if (runningRemaining % 2 !== 0 || runningRemaining > 170) {
        // Score is odd or above 170 - no longer on a double chance
        onDoubleChance = false;
      }
    }

    // Checkout success: remaining is 0 and not bust
    if (turn.remainingScore === 0 && !turn.isBust) {
      checkoutSuccesses++;
      checkoutAttempts++;

      // Calculate the checkout score (what they finished from)
      const checkoutScore = turn.totalScore;

      // Determine the range based on checkout score
      let rangeKey = "0-20";
      if (checkoutScore > 140) rangeKey = "141-170";
      else if (checkoutScore > 120) rangeKey = "121-140";
      else if (checkoutScore > 100) rangeKey = "101-120";
      else if (checkoutScore > 80) rangeKey = "81-100";
      else if (checkoutScore > 60) rangeKey = "61-80";
      else if (checkoutScore > 40) rangeKey = "41-60";
      else if (checkoutScore > 20) rangeKey = "21-40";

      checkoutRanges[rangeKey].attempts++;
      checkoutRanges[rangeKey].successes++;
      // Add the successful checkout throw to the range's throwsOnDouble
      checkoutRanges[rangeKey].throwsOnDouble++;
      checkoutRanges[rangeKey].successesOnDouble++;

      // Find the leg to get the date
      const legId = turn.id.split("-")[1]; // Extract legId from turn id
      const leg = legMap.get(legId);
      const match = allMatches.find((m) => m.id === leg?.matchId);
      const date = match?.createdAt
        ? new Date(match.createdAt).toISOString()
        : new Date().toISOString();

      // Track best finishes
      bestFinishes.push({
        score: checkoutScore,
        darts: turn.dartsThrown,
        date,
      });

      // Build checkout route string
      const darts = turn.darts.filter((d) => d.score > 0);
      const route = darts
        .map((d) => {
          if (d.multiplier === 3) return `T${d.segment}`;
          if (d.multiplier === 2) return `D${d.segment}`;
          return `${d.segment}`;
        })
        .join(", ");

      recentCheckouts.push({
        score: checkoutScore,
        darts: turn.dartsThrown,
        success: true,
        date,
        route,
      });
    }
    // Checkout attempt but bust: remaining was checkout-able but player busted
    else if (turn.isBust && turn.remainingScore <= 170) {
      checkoutAttempts++;

      // Determine the range based on remaining score (what they were trying to finish)
      const remainingScore = turn.remainingScore;
      let rangeKey = "0-20";
      if (remainingScore > 140) rangeKey = "141-170";
      else if (remainingScore > 120) rangeKey = "121-140";
      else if (remainingScore > 100) rangeKey = "101-120";
      else if (remainingScore > 80) rangeKey = "81-100";
      else if (remainingScore > 60) rangeKey = "61-80";
      else if (remainingScore > 40) rangeKey = "41-60";
      else if (remainingScore > 20) rangeKey = "21-40";

      checkoutRanges[rangeKey].attempts++;

      // Find the leg to get the date
      const legId = turn.id.split("-")[1];
      const leg = legMap.get(legId);
      const match = allMatches.find((m) => m.id === leg?.matchId);
      const date = match?.createdAt
        ? new Date(match.createdAt).toISOString()
        : new Date().toISOString();

      recentCheckouts.push({
        score: remainingScore,
        darts: turn.dartsThrown,
        success: false,
        date,
      });
    }
  }

  // Sort best finishes by score (descending) and take top 4
  bestFinishes.sort((a, b) => b.score - a.score);
  const topFinishes = bestFinishes.slice(0, 4);

  // Sort recent checkouts by date (descending) and take last 10
  recentCheckouts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const recent = recentCheckouts.slice(0, 10);

  // Calculate checkout percentage
  const checkoutPct =
    checkoutAttempts > 0
      ? Number(((checkoutSuccesses / checkoutAttempts) * 100).toFixed(2))
      : 0;

  // Calculate double conversion per range
  for (const range of Object.values(checkoutRanges)) {
    range.doubleConversion =
      range.throwsOnDouble > 0
        ? Number(
            ((range.successesOnDouble / range.throwsOnDouble) * 100).toFixed(1),
          )
        : 0;
  }

  // Convert checkout ranges to array format
  const rangesArray = Object.values(checkoutRanges).filter(
    (r) => r.attempts > 0,
  );

  return json({
    checkoutPct,
    checkoutAttempts,
    checkoutSuccesses,
    doubleChances,
    throwsOnDouble,
    doubleConversion:
      throwsOnDouble > 0
        ? Number(((checkoutSuccesses / throwsOnDouble) * 100).toFixed(2))
        : 0,
    checkoutRanges: rangesArray,
    bestFinishes: topFinishes,
    recentCheckouts: recent,
  });
};
