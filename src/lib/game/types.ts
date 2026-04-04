// Multiplier types
export type Multiplier = 0 | 1 | 2 | 3; // miss, single, double, treble

// A single dart thrown
export interface DartData {
  segment: number; // 0-20 or 25 (bull). 0 = miss
  multiplier: Multiplier;
  score: number; // computed: segment * multiplier (bull special: 25*1=25, 25*2=50)
}

// A full turn (1-3 darts)
export interface TurnData {
  darts: DartData[];
  totalScore: number;
  isBust: boolean;
  dartsThrown: number;
}

// Match configuration
export interface MatchConfig {
  startingScore: 301 | 501 | 701 | 1001;
  legsPerSet: 1 | 3 | 5 | 7;
  setsPerMatch: 1 | 3 | 5 | 7;
  doubleIn: boolean;
}

// Player in a match
export interface PlayerInMatch {
  id: string;
  name: string;
  throwOrder: number;
  remainingScore: number;
  setsWon: number;
  legsWon: number;
}

// Leg state
export interface LegState {
  setNumber: number;
  legNumber: number;
  currentPlayerIndex: number;
  firstThrowerIndex: number;
  turns: TurnRecord[];
  isComplete: boolean;
  winnerId: string | null;
}

// Turn record (stored)
export interface TurnRecord {
    id?: string;
    legId?: string;
    playerId: string;
  turnNumber: number;
  darts: DartData[];
  totalScore: number;
  remainingScore: number;
  isBust: boolean;
  dartsThrown: number;
}

// Full match state
export interface MatchState {
  matchId: string;
  config: MatchConfig;
  players: PlayerInMatch[];
  currentLeg: LegState;
  status: 'in_progress' | 'completed' | 'abandoned';
  winnerId: string | null;
}

// Stats types
export interface PlayerStats {
  matchesPlayed: number;
  matchesWon: number;
  setsPlayed: number;
  setsWon: number;
  legsPlayed: number;
  legsWon: number;
  totalDartsThrown: number;
  totalScore: number;
  threeDartAvg: number;
  checkoutAttempts: number;
  checkoutSuccesses: number;
  checkoutPct: number;
  total180s: number;
  total140s: number;
  total100s: number;
  highestFinish: number;
}

// Checkout suggestion
export interface CheckoutOption {
  darts: DartData[];
  description: string;
}
