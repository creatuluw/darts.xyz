import type { MatchConfig, MatchState, PlayerInMatch, LegState, TurnRecord, DartData } from './types';
import { processTurn, detectCheckout } from './scoring';

/**
 * Create initial match state
 */
export function createMatchState(
  matchId: string,
  config: MatchConfig,
  playerData: Array<{ id: string; name: string }>,
  firstThrowerIndex: number = 0
): MatchState {
  const players: PlayerInMatch[] = playerData.map((p, i) => ({
    id: p.id,
    name: p.name,
    throwOrder: i,
    remainingScore: config.startingScore,
    setsWon: 0,
    legsWon: 0,
  }));

  const currentLeg: LegState = {
    setNumber: 1,
    legNumber: 1,
    currentPlayerIndex: firstThrowerIndex,
    firstThrowerIndex,
    turns: [],
    isComplete: false,
    winnerId: null,
  };

  return {
    matchId,
    config,
    players,
    currentLeg,
    status: 'in_progress',
    winnerId: null,
  };
}

/**
 * Submit a turn for the current player
 */
export function submitTurn(state: MatchState, darts: DartData[]): MatchState {
  if (state.status !== 'in_progress') return state;
  if (state.currentLeg.isComplete) return state;

  const currentPlayer = state.players[state.currentLeg.currentPlayerIndex];
  const turnResult = processTurn(darts, currentPlayer.remainingScore);

  const turnRecord: TurnRecord = {
    playerId: currentPlayer.id,
    turnNumber: state.currentLeg.turns.length + 1,
    darts: turnResult.darts,
    totalScore: turnResult.totalScore,
    remainingScore: turnResult.isBust ? currentPlayer.remainingScore : currentPlayer.remainingScore - turnResult.totalScore,
    isBust: turnResult.isBust,
    dartsThrown: turnResult.dartsThrown,
  };

  // Update player remaining score
  const updatedPlayers = state.players.map((p, i) => {
    if (i === state.currentLeg.currentPlayerIndex) {
      return { ...p, remainingScore: turnRecord.remainingScore };
    }
    return p;
  });

  const updatedLeg: LegState = {
    ...state.currentLeg,
    turns: [...state.currentLeg.turns, turnRecord],
  };

  // Check for checkout
  const isCheckout = detectCheckout(
    currentPlayer.remainingScore,
    turnResult.totalScore,
    darts[darts.length - 1]?.multiplier ?? 0
  );

  if (isCheckout) {
    return completeLeg({ ...state, players: updatedPlayers, currentLeg: updatedLeg }, state.currentLeg.currentPlayerIndex);
  }

  // Advance to next player
  const nextPlayerIndex = (state.currentLeg.currentPlayerIndex + 1) % state.players.length;

  return {
    ...state,
    players: updatedPlayers,
    currentLeg: { ...updatedLeg, currentPlayerIndex: nextPlayerIndex },
  };
}

/**
 * Complete a leg (called when a player checks out)
 */
export function completeLeg(state: MatchState, winnerIndex: number): MatchState {
  const winner = state.players[winnerIndex];

  // Update legs won
  const updatedPlayers = state.players.map((p, i) => {
    if (i === winnerIndex) {
      return { ...p, legsWon: p.legsWon + 1 };
    }
    return p;
  });

  const completedLeg: LegState = {
    ...state.currentLeg,
    isComplete: true,
    winnerId: winner.id,
  };

  // Check if set is won
  const legsNeeded = Math.ceil(state.config.legsPerSet / 2);
  if (updatedPlayers[winnerIndex].legsWon >= legsNeeded) {
    return completeSet({ ...state, players: updatedPlayers, currentLeg: completedLeg }, winnerIndex);
  }

  // Start next leg
  const nextLegNumber = state.currentLeg.legNumber + 1;
  const nextLeg: LegState = {
    setNumber: state.currentLeg.setNumber,
    legNumber: nextLegNumber,
    currentPlayerIndex: winnerIndex, // leg winner throws first
    firstThrowerIndex: winnerIndex,
    turns: [],
    isComplete: false,
    winnerId: null,
  };

  // Reset remaining scores for new leg
  const playersForNewLeg = updatedPlayers.map(p => ({
    ...p,
    remainingScore: state.config.startingScore,
  }));

  return {
    ...state,
    players: playersForNewLeg,
    currentLeg: nextLeg,
  };
}

/**
 * Complete a set (called when a player wins enough legs)
 */
export function completeSet(state: MatchState, winnerIndex: number): MatchState {
  const updatedPlayers = state.players.map((p, i) => {
    if (i === winnerIndex) {
      return { ...p, setsWon: p.setsWon + 1 };
    }
    return p;
  });

  // Check if match is won
  const setsNeeded = Math.ceil(state.config.setsPerMatch / 2);
  if (updatedPlayers[winnerIndex].setsWon >= setsNeeded) {
    return completeMatch({ ...state, players: updatedPlayers }, winnerIndex);
  }

  // Start next set
  const nextSetNumber = state.currentLeg.setNumber + 1;
  const nextLeg: LegState = {
    setNumber: nextSetNumber,
    legNumber: 1,
    currentPlayerIndex: winnerIndex, // set winner throws first
    firstThrowerIndex: winnerIndex,
    turns: [],
    isComplete: false,
    winnerId: null,
  };

  // Reset legs and remaining scores for new set
  const playersForNewSet = updatedPlayers.map(p => ({
    ...p,
    legsWon: 0,
    remainingScore: state.config.startingScore,
  }));

  return {
    ...state,
    players: playersForNewSet,
    currentLeg: nextLeg,
  };
}

/**
 * Complete the match
 */
export function completeMatch(state: MatchState, winnerIndex: number): MatchState {
  const winner = state.players[winnerIndex];
  return {
    ...state,
    status: 'completed',
    winnerId: winner.id,
  };
}

/**
 * Abandon the match
 */
export function abandonMatch(state: MatchState): MatchState {
  return {
    ...state,
    status: 'abandoned',
  };
}

/**
 * Get display score string for all players
 */
export function getScoreDisplay(state: MatchState): Array<{ name: string; sets: number; legs: number; remaining: number }> {
  return state.players.map(p => ({
    name: p.name,
    sets: p.setsWon,
    legs: p.legsWon,
    remaining: p.remainingScore,
  }));
}
