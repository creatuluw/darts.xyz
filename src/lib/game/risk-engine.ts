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
    tie: PlayerId[] | null; // clock horn ended level → sudden-death darts
}

export interface CreateGameOptions {
    mode?: Mode;
    clockTurns?: number;
    seed?: number;
    starterPlayerId?: PlayerId; // players decide this themselves — plain input
}

/** One dart as thrown. Singles carry their ring — inner and outer are different territories. */
export interface DartHit {
    segment: number; // 0 = miss, 25/50 = Arsenal, 1..20 = box dart
    multiplier?: 1 | 2 | 3; // required for box darts
    singleRing?: Ring; // required for singles — inner and outer are different territories
}

// Locked proximity fit (docs/risk/apply-territory-labels.cjs carries the same table)
/** Classic Risk continent palette (from docs/risk/risk-board.svg, the reference map). */
export const CONTINENT_COLORS: Record<Continent, string> = {
	NA: '#dadd23', // North America — yellow
	SA: '#ea4224', // South America — red-orange
	EU: '#47c1dc', // Europe — cyan-blue
	AF: '#9d7902', // Africa — golden brown
	AS: '#48c74c', // Asia — green
	OC: '#bb10bf', // Oceania — purple
};
/** Darker companion shades — inner borders on the reference map. */
export const CONTINENT_DARK: Record<Continent, string> = {
	NA: '#b5b81d',
	SA: '#9c240f',
	EU: '#2293ac',
	AF: '#785c05',
	AS: '#2f8a33',
	OC: '#7b147d',
};

export const BOARD: Array<[number, Ring, string, Continent]> = [
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
        tie: null,
    };
}

export function isExiled(state: RiskGameState, playerId: PlayerId): boolean {
    // derived, never stored — an exile owns nothing; the clawback clears it by owning something
    return !state.boxes.some((b) => b.owner === playerId);
}

const CONTINENT_IDS: Record<Continent, string[]> = (() => {
    const m: Record<Continent, string[]> = { NA: [], SA: [], EU: [], AF: [], AS: [], OC: [] };
    for (const [number, ring, _t, cont] of BOARD) m[cont].push(`${number}-${ring}`);
    return m;
})();

/** Continents where the player owns every box (blanks break control). */
export function continentsHeld(state: RiskGameState, playerId: PlayerId): Continent[] {
    return (Object.keys(CONTINENT_IDS) as Continent[]).filter((c) =>
        CONTINENT_IDS[c].every((id) => state.boxes.find((b) => b.id === id)?.owner === playerId),
    );
}

function continentDarts(c: Continent): number {
    return c === 'AS' ? 2 : 1; // Asia pays superpower money
}

export interface DartBudget {
    base: number;
    sources: Array<{ continent: Continent; darts: number }>;
    total: number;
}

/** For the pre-turn banner: exact dart count with itemized sources. */
export function budgetWithSources(state: RiskGameState): DartBudget {
    const held = continentsHeld(state, state.turn.playerId);
    const sources = held
        .map((c) => ({ continent: c, darts: continentDarts(c) }))
        .sort((x, y) => y.darts - x.darts); // biggest bonus first for the banner
    return { base: BASE_DARTS, sources, total: BASE_DARTS + sources.reduce((s, x) => s + x.darts, 0) };
}

const RING_VALUE: Record<1 | 2 | 3, number> = { 1: 1, 2: 2, 3: 2 };

/** Which box a dart deposits into: S → the hit box; T → the wedge's inner; D → the wedge's outer. */
function targetBoxId(hit: DartHit): string {
    if (!hit.multiplier) throw new Error('box darts need a multiplier');
    if (hit.multiplier === 1) {
        if (!hit.singleRing) throw new Error('singles must carry singleRing (inner/outer)');
        return `${hit.segment}-${hit.singleRing}`;
    }
    return `${hit.segment}-${hit.multiplier === 3 ? 'inner' : 'outer'}`;
}

export function applyDart(state: RiskGameState, hit: DartHit): RiskGameState {
    if (state.winner !== null) throw new Error('game is over');
    if (state.turn.dartsLeft <= 0) throw new Error('no darts left this turn');

    const me = state.turn.playerId;

    if (hit.segment === 0) {
        // miss: consumes a dart, changes nothing
    } else if (hit.segment === 25 || hit.segment === 50) {
        // the Arsenal: a bull charges the darts thrown after it, this turn only
        state.turn.charge += hit.segment === 50 ? 2 : 1;
    } else {
        if (hit.segment < 1 || hit.segment > 20) throw new Error(`segment out of range: ${hit.segment}`);
        const box = state.boxes.find((b) => b.id === targetBoxId(hit));
        if (!box) throw new Error(`no box for hit ${JSON.stringify(hit)}`);

        const value = RING_VALUE[hit.multiplier!] + state.turn.charge;

        if (box.owner === null) {
            box.owner = me;
            box.armies = value;
        } else if (box.owner === me) {
            box.armies += value;
        } else {
            box.armies -= value;
            if (box.armies <= 0) {
                box.owner = me;
                box.armies = 1;
            }
        }
    }

    state.turn.dartsLeft -= 1;
    if (state.turn.dartsLeft === 0) {
        // turn advances: next player from the starter, fresh budget + income, charge cleared
        const order = [state.starterPlayerId, ...state.players.filter((p) => p !== state.starterPlayerId)];
        const at = order.indexOf(state.turn.playerId);
        const next = order[(at + 1) % order.length];
        state.turn = {
            playerId: next,
            dartsLeft: BASE_DARTS + continentsHeld(state, next).reduce((s, c) => s + continentDarts(c), 0),
            charge: 0,
            index: state.turn.index + 1,
        };
        if (state.mode === 'clock' && state.turn.index - 1 >= (state.clockTurns ?? 0) * state.players.length) {
            soundTheHorn(state);
        }
    }
    checkDomination(state);
    return state;
}

const CLOCK_CONTINENT_POINTS: Record<Continent, number> = { NA: 2, SA: 3, EU: 3, AF: 3, AS: 5, OC: 3 };

export interface StandingRow {
    playerId: PlayerId;
    boxes: number;
    continents: Continent[];
    armies: number;
    score: number;
}

export function standings(state: RiskGameState): StandingRow[] {
    return state.players
        .map((p) => {
            const owned = state.boxes.filter((b) => b.owner === p);
            const conts = continentsHeld(state, p);
            return {
                playerId: p,
                boxes: owned.length,
                continents: conts,
                armies: owned.reduce((s, b) => s + b.armies, 0),
                score: owned.length + conts.reduce((s, c) => s + CLOCK_CONTINENT_POINTS[c], 0),
            };
        })
        .sort((x, y) => y.score - x.score || y.boxes - x.boxes || y.armies - x.armies);
}

function checkDomination(state: RiskGameState): void {
    if (state.winner !== null) return;
    const sole = state.boxes[0].owner !== null && state.boxes.every((b) => b.owner === state.boxes[0].owner);
    if (sole) state.winner = state.boxes[0].owner;
}

function soundTheHorn(state: RiskGameState): void {
    const table = standings(state);
    const top = table[0].score;
    const leaders = table.filter((r) => r.score === top).map((r) => r.playerId);
    if (leaders.length === 1) state.winner = leaders[0];
    else state.tie = leaders;
}

/** Sudden death after a tied clock horn: one dart at the bull each, nearest wins. */
export function applyTiebreak(state: RiskGameState, throws: Array<{ playerId: PlayerId; distance: number }>): RiskGameState {
    if (state.winner !== null) throw new Error('game is over');
    if (!state.tie) throw new Error('no tie to break');
    const best = Math.min(...state.tie.map((p) => throws.find((t) => t.playerId === p)?.distance ?? Infinity));
    const still = state.tie.filter((p) => (throws.find((t) => t.playerId === p)?.distance ?? Infinity) === best);
    if (still.length === 1) {
        state.winner = still[0];
        state.tie = null;
    } else {
        state.tie = still; // dead heat — re-throw
    }
    return state;
}
