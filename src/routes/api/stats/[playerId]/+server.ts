import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";
import { computeStatsFromTurns } from "$lib/game/stats-engine";

export const GET: RequestHandler = async ({ params }) => {
  const playerId = params.playerId;

  const [matchPlayerEntries, allTurns, allMatches] = await Promise.all([
    dbService.getMatchPlayerEntries(playerId),
    dbService.getAllTurnsForPlayer(playerId),
    dbService.getMatchesForPlayer(playerId),
  ]);

  const matchIds = allMatches.map((m) => m.id);
  const allLegs = await dbService.getAllLegsForMatches(matchIds);

  if (allMatches.length === 0 && allTurns.length === 0) {
    return json({
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
    });
  }

  const matchMap = new Map(allMatches.map((m) => [m.id, m]));

  let matchesPlayed = 0;
  let matchesWon = 0;
  let totalSetsPlayed = 0;
  let totalSetsWon = 0;
  let totalLegsPlayed = 0;
  let totalLegsWon = 0;

  for (const mp of matchPlayerEntries) {
    const match = matchMap.get(mp.matchId);
    if (!match) continue;
    matchesPlayed++;
    if (match.winnerId === playerId) matchesWon++;

    totalSetsWon += mp.setsWon;

    const matchLegs = allLegs.filter((l) => l.matchId === mp.matchId);
    const uniqueSets = new Set(matchLegs.map((l) => l.setNumber));
    totalSetsPlayed += uniqueSets.size;

    totalLegsPlayed += matchLegs.length;
    totalLegsWon += matchLegs.filter((l) => l.winnerId === playerId).length;
  }

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

  const stats = computeStatsFromTurns(
    turnRecords,
    totalLegsWon,
    totalLegsPlayed,
    totalSetsWon,
    totalSetsPlayed,
    matchesWon,
    matchesPlayed,
  );

  // Calculate double conversion stats (per-dart tracking)
  let doubleChances = 0;
  let throwsOnDouble = 0;

  const validDoubleOut = (score: number) => score > 0 && score % 2 === 0;

  for (const turn of turnRecords) {
    const startOfTurnRemaining = turn.remainingScore + turn.totalScore;
    let onDoubleChance = false;
    let runningRemaining = startOfTurnRemaining;

    for (let i = 0; i < turn.darts.length; i++) {
      const dart = turn.darts[i];
      if (dart.score === 0) continue;

      if (runningRemaining <= 170 && runningRemaining > 0) {
        if (validDoubleOut(runningRemaining)) {
          throwsOnDouble++;
          onDoubleChance = true;
        } else if (onDoubleChance) {
          onDoubleChance = false;
        }
      }

      runningRemaining -= dart.score;

      if (
        runningRemaining <= 170 &&
        runningRemaining > 0 &&
        validDoubleOut(runningRemaining)
      ) {
        doubleChances++;
        onDoubleChance = true;
      } else if (runningRemaining % 2 !== 0 || runningRemaining > 170) {
        onDoubleChance = false;
      }
    }
  }

  const doubleConversion =
    throwsOnDouble > 0
      ? Number(((stats.checkoutSuccesses / throwsOnDouble) * 100).toFixed(2))
      : 0;

  return json({
    ...stats,
    doubleChances,
    throwsOnDouble,
    doubleConversion,
  });
};
