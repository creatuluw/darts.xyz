// Risk 42 — pure game engine. Spec: .specs/risk-42/spec.html
// 40 single boxes = 40 Risk territories (Japan & Madagascar cut), bulls = the Arsenal.

export type Continent = 'NA' | 'SA' | 'EU' | 'AF' | 'AS' | 'OC';
export type Ring = 'inner' | 'outer';
export type PlayerId = string;
export type Mode = 'domination' | 'clock';

export interface Box {
    id: string; // e.g. "20-inner" — matches DartBoardInGame.svg seg ids
    number: number; // wedge number 1..20
    ring: Ring;
    territory: string;
    continent: Continent;
    owner: PlayerId | null;
    armies: number;
}

export interface TurnState {
    playerId: PlayerId;
    dartsLeft: number;
    charge: number; // Arsenal charge active for the rest of the turn
    index: number; // 1-based turn counter (for the clock)
}

export interface RiskGameState {
    players: PlayerId[];
    starterPlayerId: PlayerId;
    mode: Mode;
    clockTurns: number | null; // turns per player (clock mode)
    seed: number;
    boxes: Box[];
    turn: TurnState;
    winner: PlayerId | null;
}

export interface CreateGameOptions {
    mode?: Mode;
    clockTurns?: number;
    seed?: number;
    starterPlayerId?: PlayerId; // players decide this themselves — plain input
}

// Locked proximity fit (docs/risk/apply-territory-labels.cjs carries the same table)
const BOARD: Array<[number, Ring, string, Continent]> = [
    [20, 'inner', 'Northern Europe', 'EU'], [20, 'outer', 'Scandinavia', 'EU'],
    [1, 'inner', 'Ukraine', 'EU'], [1, 'outer', 'Siberia', 'AS'],
    [18, 'inner', 'Ural', 'AS'], [18, 'outer', 'Yakutsk', 'AS'],
    [4, 'inner', 'Afghanistan', 'AS'], [4, 'outer', 'Irkutsk', 'AS'],
    [13, 'inner', 'Mongolia', 'AS'], [13, 'outer', 'Kamchatka', 'AS'],
    [6, 'inner', 'Siam', 'AS'], [6, 'outer', 'China', 'AS'],
    [10, 'inner', 'India', 'AS'], [10, 'outer', 'New Guinea', 'OC'],
    [15, 'inner', 'Indonesia', 'OC'], [15, 'outer', 'Eastern Australia', 'OC'],
    [2, 'inner', 'Middle East', 'AS'], [2, 'outer', 'Western Australia', 'OC'],
    [17, 'inner', 'Congo', 'AF'], [17, 'outer', 'East Africa', 'AF'],
    [3, 'inner', 'Egypt', 'AF'], [3, 'outer', 'South Africa', 'AF'],
    [19, 'inner', 'North Africa', 'AF'], [19, 'outer', 'Argentina', 'SA'],
    [7, 'inner', 'Southern Europe', 'EU'], [7, 'outer', 'Brazil', 'SA'],
    [16, 'inner', 'Venezuela', 'SA'], [16, 'outer', 'Peru', 'SA'],
    [8, 'inner', 'Western Europe', 'EU'], [8, 'outer', 'Central America', 'NA'],
    [11, 'inner', 'Eastern United States', 'NA'], [11, 'outer', 'Western United States', 'NA'],
    [14, 'inner', 'Ontario', 'NA'], [14, 'outer', 'Alberta', 'NA'],
    [9, 'inner', 'Quebec', 'NA'], [9, 'outer', 'Alaska', 'NA'],
    [12, 'inner', 'Great Britain', 'EU'], [12, 'outer', 'Northwest Territory', 'NA'],
    [5, 'inner', 'Greenland', 'NA'], [5, 'outer', 'Iceland', 'EU'],
];

export const BOX_COUNT = BOARD.length; // 40
export const BASE_DARTS = 3;
export const DEAL_ARMIES = 2;

// mulberry32 — small, fast, seedable; good enough for a party game's shuffle
function rng(seed: number): () => number {
    let a = seed >>> 0;
    return () => {
        a |= 0; a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function createGame(playerIds: PlayerId[], opts: CreateGameOptions = {}): RiskGameState {
    if (playerIds.length < 2 || playerIds.length > 6) {
        throw new Error(`roster must be 2-6 players, got ${playerIds.length}`);
    }
    const mode: Mode = opts.mode ?? 'domination';
    if (mode === 'clock' && !opts.clockTurns) throw new Error('clock mode requires clockTurns');
    const seed = opts.seed ?? Math.floor(Math.random() * 2 ** 31);
    const starter = opts.starterPlayerId ?? playerIds[0];
    if (!playerIds.includes(starter)) throw new Error('starterPlayerId must be a player');

    // The Deal: shuffle the board, deal EXACTLY equally, leftovers stay blank
    const order = BOARD.map((_, i) => i);
    const rand = rng(seed);
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    const per = Math.floor(BOARD.length / playerIds.length);
    const boxes: Box[] = order.map((bi, dealt) => {
        const [number, ring, territory, continent] = BOARD[bi];
        const owner = dealt < per * playerIds.length ? playerIds[dealt % playerIds.length] : null;
        return {
            id: `${number}-${ring}`,
            number, ring, territory, continent,
            owner,
            armies: owner ? DEAL_ARMIES : 0,
        };
    });

    return {
        players: [...playerIds],
        starterPlayerId: starter,
        mode,
        clockTurns: mode === 'clock' ? (opts.clockTurns ?? null) : null,
        seed,
        boxes,
        turn: { playerId: starter, dartsLeft: BASE_DARTS, charge: 0, index: 1 },
        winner: null,
    };
}
