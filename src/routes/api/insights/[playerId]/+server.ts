import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dbService } from '$lib/db/database-service';

export const GET: RequestHandler = async ({ params }) => {
  const playerId = params.playerId;

  const [matchPlayerEntries, allTurns, allMatches] = await Promise.all([
    dbService.getMatchPlayerEntries(playerId),
    dbService.getAllTurnsForPlayer(playerId),
    dbService.getMatchesForPlayer(playerId),
  ]);

  if (allMatches.length === 0 && allTurns.length === 0) {
    return json({ summary: null, perMatch: [], scoringDistribution: [], checkoutRanges: [] });
  }

  const matchMap = new Map(allMatches.map(m => [m.id, m]));
  const matchIds = allMatches.map(m => m.id);
  const allLegs = await dbService.getAllLegsForMatches(matchIds);

  const turnsByLeg = new Map<string, typeof allTurns>();
  for (const t of allTurns) {
    if (!turnsByLeg.has(t.legId)) turnsByLeg.set(t.legId, []);
    turnsByLeg.get(t.legId)!.push(t);
  }

  let totalDarts = 0;
  let totalScore = 0;
  let total180s = 0;
  let total140s = 0;
  let total100s = 0;
  let checkoutAttempts = 0;
  let checkoutSuccesses = 0;
  let highestFinish = 0;
  let matchesPlayed = 0;
  let matchesWon = 0;
  let totalLegsPlayed = 0;
  let totalLegsWon = 0;
  let totalSetsPlayed = 0;
  let totalSetsWon = 0;

  const scoringBrackets: Record<string, number> = {
    '0-39': 0, '40-59': 0, '60-79': 0, '80-99': 0, '100-139': 0, '140-179': 0, '180': 0,
  };

  const checkoutRangeStats: Record<string, { attempts: number; successes: number }> = {
    '2-40': { attempts: 0, successes: 0 },
    '41-60': { attempts: 0, successes: 0 },
    '61-80': { attempts: 0, successes: 0 },
    '81-100': { attempts: 0, successes: 0 },
    '101-130': { attempts: 0, successes: 0 },
    '131-170': { attempts: 0, successes: 0 },
  };

  const first9Scores: number[] = [];
  const legsWonDarts: number[] = [];

  for (const mp of matchPlayerEntries) {
    const match = matchMap.get(mp.matchId);
    if (!match) continue;
    matchesPlayed++;
    if (match.winnerId === playerId) matchesWon++;

    totalSetsWon += mp.setsWon;
    const matchLegs = allLegs.filter(l => l.matchId === mp.matchId);
    const uniqueSets = new Set(matchLegs.map(l => l.setNumber));
    totalSetsPlayed += uniqueSets.size;

    totalLegsPlayed += matchLegs.length;
    totalLegsWon += matchLegs.filter(l => l.winnerId === playerId).length;
  }

  for (const leg of allLegs) {
    const legTurns = (turnsByLeg.get(leg.id) || []).sort(
      (a, b) => a.turnNumber - b.turnNumber
    );

    const playerTurns = legTurns.filter(t => t.playerId === playerId);
    if (playerTurns.length === 0) continue;

    const first3Turns = playerTurns.slice(0, 3);
    const first9Total = first3Turns.reduce((s, t) => s + t.totalScore, 0);
    first9Scores.push(first9Total);

    if (leg.winnerId === playerId) {
      const dartsInLeg = playerTurns.reduce((s, t) => s + t.dartsThrown, 0);
      legsWonDarts.push(dartsInLeg);
    }
  }

  for (const turn of allTurns) {
    totalDarts += turn.dartsThrown;
    totalScore += turn.totalScore;

    if (turn.totalScore === 180 && turn.dartsThrown === 3) total180s++;
    if (turn.totalScore >= 140) total140s++;
    if (turn.totalScore >= 100) total100s++;

    if (turn.totalScore >= 180) scoringBrackets['180']++;
    else if (turn.totalScore >= 140) scoringBrackets['140-179']++;
    else if (turn.totalScore >= 100) scoringBrackets['100-139']++;
    else if (turn.totalScore >= 80) scoringBrackets['80-99']++;
    else if (turn.totalScore >= 60) scoringBrackets['60-79']++;
    else if (turn.totalScore >= 40) scoringBrackets['40-59']++;
    else scoringBrackets['0-39']++;

    if (turn.remainingScore === 0 && !turn.isBust) {
      checkoutSuccesses++;
      checkoutAttempts++;
      if (turn.totalScore > highestFinish) highestFinish = turn.totalScore;

      const finished = turn.totalScore;
      if (finished <= 40) checkoutRangeStats['2-40'].successes++;
      else if (finished <= 60) checkoutRangeStats['41-60'].successes++;
      else if (finished <= 80) checkoutRangeStats['61-80'].successes++;
      else if (finished <= 100) checkoutRangeStats['81-100'].successes++;
      else if (finished <= 130) checkoutRangeStats['101-130'].successes++;
      else checkoutRangeStats['131-170'].successes++;
    } else if (turn.isBust && turn.remainingScore <= 170) {
      checkoutAttempts++;
      const remaining = turn.remainingScore;
      if (remaining <= 40) checkoutRangeStats['2-40'].attempts++;
      else if (remaining <= 60) checkoutRangeStats['41-60'].attempts++;
      else if (remaining <= 80) checkoutRangeStats['61-80'].attempts++;
      else if (remaining <= 100) checkoutRangeStats['81-100'].attempts++;
      else if (remaining <= 130) checkoutRangeStats['101-130'].attempts++;
      else checkoutRangeStats['131-170'].attempts++;
    }
  }

  const threeDartAvg = totalDarts > 0 ? Number(((totalScore / totalDarts) * 3).toFixed(2)) : 0;
  const first9Avg = first9Scores.length > 0
    ? Number((first9Scores.reduce((a, b) => a + b, 0) / first9Scores.length).toFixed(2))
    : 0;
  const avgDartsPerLeg = legsWonDarts.length > 0
    ? Number((legsWonDarts.reduce((a, b) => a + b, 0) / legsWonDarts.length).toFixed(1))
    : 0;
  const checkoutPct = checkoutAttempts > 0
    ? Number(((checkoutSuccesses / checkoutAttempts) * 100).toFixed(2))
    : 0;

  const scoringDistribution = Object.entries(scoringBrackets).map(([range, count]) => ({
    range,
    count,
    pct: allTurns.length > 0 ? Number(((count / allTurns.length) * 100).toFixed(1)) : 0,
  }));

  const checkoutRanges = Object.entries(checkoutRangeStats).map(([range, data]) => ({
    range,
    attempts: data.attempts + data.successes,
    successes: data.successes,
    pct: (data.attempts + data.successes) > 0
      ? Number(((data.successes / (data.attempts + data.successes)) * 100).toFixed(1))
      : 0,
  }));

  const perMatch: Array<{
    matchId: string;
    date: string;
    status: string;
    won: boolean;
    threeDartAvg: number;
    checkoutPct: number;
    dartsThrown: number;
    legsWon: number;
    legsPlayed: number;
  }> = [];

  for (const mp of matchPlayerEntries) {
    const match = matchMap.get(mp.matchId);
    if (!match) continue;

    const matchLegIds = allLegs.filter(l => l.matchId === mp.matchId).map(l => l.id);
    const matchTurns = allTurns.filter(t => matchLegIds.includes(t.legId));

    const mDarts = matchTurns.reduce((s, t) => s + t.dartsThrown, 0);
    const mScore = matchTurns.reduce((s, t) => s + t.totalScore, 0);
    const mAvg = mDarts > 0 ? Number(((mScore / mDarts) * 3).toFixed(2)) : 0;

    let mCheckAttempts = 0;
    let mCheckSuccesses = 0;
    for (const t of matchTurns) {
      if (t.remainingScore === 0 && !t.isBust) { mCheckAttempts++; mCheckSuccesses++; }
      else if (t.isBust && t.remainingScore <= 170) { mCheckAttempts++; }
    }
    const mCheckPct = mCheckAttempts > 0 ? Number(((mCheckSuccesses / mCheckAttempts) * 100).toFixed(1)) : 0;

    const mLegs = allLegs.filter(l => l.matchId === mp.matchId);
    const mLegsWon = mLegs.filter(l => l.winnerId === playerId).length;

    perMatch.push({
      matchId: mp.matchId,
      date: String(match.createdAt),
      status: match.status,
      won: match.winnerId === playerId,
      threeDartAvg: mAvg,
      checkoutPct: mCheckPct,
      dartsThrown: mDarts,
      legsWon: mLegsWon,
      legsPlayed: mLegs.length,
    });
  }

  perMatch.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return json({
    summary: {
      matchesPlayed,
      matchesWon,
      setsPlayed: totalSetsPlayed,
      setsWon: totalSetsWon,
      legsPlayed: totalLegsPlayed,
      legsWon: totalLegsWon,
      totalDartsThrown: totalDarts,
      totalScore,
      threeDartAvg,
      checkoutAttempts,
      checkoutSuccesses,
      checkoutPct,
      total180s,
      total140s,
      total100s,
      highestFinish,
      first9Avg,
      avgDartsPerLeg,
    },
    perMatch,
    scoringDistribution,
    checkoutRanges,
  });
};
