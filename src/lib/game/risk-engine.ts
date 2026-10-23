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
    carried?: number; // banked darts drawn from the savings pool into this turn's budget (banner itemization)
    index: number; // 1-based turn counter (for the clock)
}

export type CardFace = 'infanterie' | 'cavalerie' | 'artillerie' | 'joker';

/** A territory card. Jokers have no territory. Faces drive the set combos. */
export interface Card {
    id: string; // `<number>-<ring>` for territory cards, `joker-1` / `joker-2`
    face: CardFace;
    territory?: string;
}

export interface RiskGameState {
    players: PlayerId[];
    starterPlayerId: PlayerId;
    mode: Mode;
    clockTurns: number | null; // turns per player (clock mode)
    seed: number;
    boxes: Box[];
    turn: TurnState;
    saved: Record<PlayerId, number>; // banked Arsenal darts — spent at the player's next turn
    hands: Record<PlayerId, Card[]>; // territory cards — one drawn per conquest, hoarding unlimited
    deck: Card[]; // remaining draw pile (exhausts; no reshuffle — like real Risk)
    setsCashed: Record<PlayerId, number>; // drives the +1-per-cashed-set escalation
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

/**
 * Classic Risk map adjacency for our 40 territories (Japan & Madagascar cut). Same-wedge
 * inner/outer pairs are added below — those boxes physically touch on the dartboard.
 * Reach rule (2026-10-23): a dart only counts on own territory or territory adjacent to own.
 */
export const ADJACENT_TERRITORIES: Record<string, string[]> = {
    // North America
    'Alaska': ['Northwest Territory', 'Alberta', 'Kamchatka'],
    'Alberta': ['Alaska', 'Northwest Territory', 'Ontario', 'Western United States'],
    'Central America': ['Western United States', 'Eastern United States', 'Venezuela'],
    'Eastern United States': ['Central America', 'Ontario', 'Quebec', 'Western United States'],
    'Greenland': ['Northwest Territory', 'Ontario', 'Quebec', 'Iceland'],
    'Northwest Territory': ['Alaska', 'Alberta', 'Ontario', 'Greenland'],
    'Ontario': ['Alberta', 'Northwest Territory', 'Greenland', 'Quebec', 'Eastern United States', 'Western United States'],
    'Quebec': ['Greenland', 'Ontario', 'Eastern United States'],
    'Western United States': ['Alberta', 'Ontario', 'Eastern United States', 'Central America'],
    // South America
    'Argentina': ['Peru', 'Brazil'],
    'Brazil': ['Venezuela', 'Peru', 'Argentina', 'North Africa'],
    'Peru': ['Venezuela', 'Brazil', 'Argentina'],
    'Venezuela': ['Central America', 'Peru', 'Brazil'],
    // Europe
    'Great Britain': ['Iceland', 'Scandinavia', 'Northern Europe', 'Western Europe', 'Northwest Territory'],
    'Iceland': ['Greenland', 'Great Britain', 'Scandinavia'],
    'Northern Europe': ['Scandinavia', 'Great Britain', 'Western Europe', 'Southern Europe', 'Ukraine'],
    'Scandinavia': ['Iceland', 'Great Britain', 'Northern Europe', 'Ukraine'],
    'Southern Europe': ['Western Europe', 'Northern Europe', 'Ukraine', 'Middle East', 'Egypt', 'North Africa'],
    'Ukraine': ['Scandinavia', 'Northern Europe', 'Southern Europe', 'Ural', 'Afghanistan', 'Middle East', 'Siberia'],
    'Western Europe': ['Great Britain', 'Northern Europe', 'Southern Europe', 'North Africa'],
    // Africa (Madagascar cut)
    'Congo': ['North Africa', 'East Africa', 'South Africa'],
    'East Africa': ['Egypt', 'North Africa', 'Congo', 'South Africa', 'Middle East'],
    'Egypt': ['North Africa', 'Southern Europe', 'Middle East', 'East Africa', 'South Africa'],
    'North Africa': ['Brazil', 'Western Europe', 'Southern Europe', 'Egypt', 'East Africa', 'Congo'],
    'South Africa': ['Congo', 'East Africa', 'Egypt'],
    // Asia (Japan cut)
    'Afghanistan': ['Ukraine', 'Ural', 'China', 'India', 'Middle East', 'Irkutsk'],
    'China': ['Mongolia', 'Siam', 'Ural', 'Siberia', 'Afghanistan', 'India'],
    'India': ['Middle East', 'Siam', 'China', 'Afghanistan'],
    'Irkutsk': ['Siberia', 'Yakutsk', 'Mongolia', 'Kamchatka', 'Afghanistan'],
    'Kamchatka': ['Yakutsk', 'Irkutsk', 'Mongolia', 'Alaska'],
    'Middle East': ['Southern Europe', 'Ukraine', 'Afghanistan', 'India', 'East Africa', 'Egypt'],
    'Mongolia': ['Siberia', 'Irkutsk', 'Kamchatka', 'China'],
    'Siam': ['India', 'China', 'Indonesia'],
    'Siberia': ['Ural', 'Yakutsk', 'Irkutsk', 'Mongolia', 'China', 'Ukraine'],
    'Ural': ['Ukraine', 'Siberia', 'China', 'Afghanistan'],
    'Yakutsk': ['Siberia', 'Irkutsk', 'Kamchatka'],
    // Oceania
    'Eastern Australia': ['New Guinea', 'Western Australia', 'Indonesia'],
    'Indonesia': ['Siam', 'New Guinea', 'Western Australia', 'Eastern Australia'],
    'New Guinea': ['Indonesia', 'Eastern Australia', 'Western Australia'],
    'Western Australia': ['Indonesia', 'New Guinea', 'Eastern Australia'],
};
// same-wedge boxes touch on the board you throw at: Ukraine↔Siberia, Greenland↔Iceland, GB↔NW Territory, ...
for (const [number, ring, territory] of BOARD) {
    const wedgeMate = BOARD.find(([n, r]) => n === number && r !== ring)![2];
    if (!ADJACENT_TERRITORIES[territory].includes(wedgeMate)) ADJACENT_TERRITORIES[territory].push(wedgeMate);
}

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

    const rand = rng(seed);
    // The Deal: shuffle the board, deal EXACTLY equally, leftovers stay blank
    const order = BOARD.map((_, i) => i);
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
    const deck = buildDeck(rand);
    const hands: Record<PlayerId, Card[]> = {};
    for (const p of playerIds) hands[p] = [];

    return {
        players: [...playerIds],
        starterPlayerId: starter,
        mode,
        clockTurns: mode === 'clock' ? (opts.clockTurns ?? null) : null,
        seed,
        boxes,
        turn: { playerId: starter, dartsLeft: BASE_DARTS, carried: 0, index: 1 },
        saved: {},
        hands,
        deck,
        setsCashed: {},
        winner: null,
        tie: null,
    };
}

/** The 42-card deck: one card per territory (faces cycle infanterie/cavalerie/artillerie) + 2 jokers. */
function buildDeck(rand: () => number): Card[] {
    const cards: Card[] = BOARD.map(([number, ring, territory], i) => ({
        id: `${number}-${ring}`,
        face: (['infanterie', 'cavalerie', 'artillerie'] as const)[i % 3],
        territory,
    }));
    cards.push({ id: 'joker-1', face: 'joker' }, { id: 'joker-2', face: 'joker' });
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
}

/** Games persisted before cards existed resume cleanly: build the deck the seed would have dealt. */
function ensureCards(state: RiskGameState): void {
    if (state.deck && state.hands) return;
    state.deck = state.deck ?? buildDeck(rng(state.seed));
    state.hands = state.hands ?? Object.fromEntries(state.players.map((p) => [p, []]));
    state.setsCashed = state.setsCashed ?? {};
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

export interface DartBudget {
    minimum: number; // the guaranteed floor (3)
    territories: number; // boxes currently owned
    income: number; // floor(territories / 6)
    minimumApplied: boolean; // income fell below the floor
    saved: number; // banked Arsenal darts rolling into this turn
    total: number;
}

/** Turn income: +1 dart per 6 owned territories, minimum 3. Continents pay nothing (2026-10-23 rework). */
export function territoryIncome(state: RiskGameState, playerId: PlayerId): { territories: number; income: number; minimumApplied: boolean; total: number } {
    const territories = state.boxes.filter((b) => b.owner === playerId).length;
    const income = Math.floor(territories / 6);
    const minimumApplied = income < BASE_DARTS;
    return { territories, income, minimumApplied, total: Math.max(BASE_DARTS, income) };
}

/** For the pre-turn banner: exact dart count with itemized sources. */
export function budgetWithSources(state: RiskGameState): DartBudget {
    const inc = territoryIncome(state, state.turn.playerId);
    const saved = state.turn.carried ?? state.saved?.[state.turn.playerId] ?? 0;
    return {
        minimum: BASE_DARTS,
        territories: inc.territories,
        income: inc.income,
        minimumApplied: inc.minimumApplied,
        saved,
        total: inc.total + saved,
    };
}

/**
 * Reach rule: boxes the player's darts can affect — own territory ∪ territory adjacent to own.
 * An exile (owns nothing) may throw ANYWHERE: the clawback needs a foothold.
 */
const TERRITORY_OF: Record<string, string> = Object.fromEntries(BOARD.map(([n, r, t]) => [`${n}-${r}`, t]));

export function isReachable(state: RiskGameState, playerId: PlayerId, boxId: string): boolean {
    const box = state.boxes.find((b) => b.id === boxId);
    if (!box) return false;
    if (isExiled(state, playerId)) return true;
    for (const b of state.boxes) {
        if (b.owner === playerId) {
            if (b.id === boxId) return true;
            if (ADJACENT_TERRITORIES[TERRITORY_OF[b.id]]?.includes(TERRITORY_OF[boxId])) return true;
        }
    }
    return false;
}

/** The UI highlight set: every box id the given player's darts currently count on. */
export function reachableBoxIds(state: RiskGameState, playerId: PlayerId): Set<string> {
    return new Set(state.boxes.filter((b) => isReachable(state, playerId, b.id)).map((b) => b.id));
}

const RING_VALUE: Record<1 | 2 | 3, number> = { 1: 1, 2: 2, 3: 2 };

/** Set values: triple artillerie > cavalerie > infanterie, one of each beats them all (real Risk shape). */
const SET_VALUES: Record<'triple' | 'mixed', Record<CardFace, number>> = {
    triple: { infanterie: 3, cavalerie: 4, artillerie: 5, joker: 0 },
    mixed: { infanterie: 6, cavalerie: 6, artillerie: 6, joker: 6 },
};

/**
 * Payout of a 3-card hand as a set, +1 per set this player already cashed (escalation).
 * null = not a legal set. Jokers complete the BEST combo: 3-of-a-kind or one of each.
 */
export function setPayout(cards: Array<Pick<Card, 'face'>>, setsCashedAlready: number): number | null {
    if (cards.length !== 3) return null;
    const n = { infanterie: 0, cavalerie: 0, artillerie: 0, joker: 0 };
    for (const c of cards) n[c.face]++;
    let best: number | null = null;
    // triples: any face with count + jokers >= 3 (jokers join the strongest qualifying face)
    for (const face of ['artillerie', 'cavalerie', 'infanterie'] as const) {
        if (n[face] + n.joker >= 3) best = Math.max(best ?? 0, SET_VALUES.triple[face]);
    }
    // one of each: the distinct faces plus jokers must cover all three
    if ((n.infanterie ? 1 : 0) + (n.cavalerie ? 1 : 0) + (n.artillerie ? 1 : 0) + n.joker >= 3) {
        best = Math.max(best ?? 0, SET_VALUES.mixed.infanterie);
    }
    return best === null ? null : best + setsCashedAlready;
}

/** Cash in exactly 3 hand cards as a set: payout lands in the live dart pool, right now. */
export function cashSet(state: RiskGameState, cardIds: string[]): RiskGameState {
    if (state.winner !== null || state.tie) throw new Error('game is over');
    ensureCards(state);
    const me = state.turn.playerId;
    const hand = state.hands[me] ?? [];
    if (new Set(cardIds).size !== 3) throw new Error('a set is exactly 3 distinct cards');
    const chosen = cardIds.map((id) => hand.find((c) => c.id === id));
    if (chosen.some((c) => !c)) throw new Error('card not in hand');
    const payout = setPayout(chosen as Card[], state.setsCashed?.[me] ?? 0);
    if (payout === null) throw new Error('these cards do not form a set (3 of a kind or one of each)');
    state.hands[me] = hand.filter((c) => !cardIds.includes(c.id));
    state.setsCashed[me] = (state.setsCashed[me] ?? 0) + 1;
    state.turn.dartsLeft += payout;
    return state;
}

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
    ensureCards(state);

    if (hit.segment === 0) {
        // miss: consumes a dart, changes nothing
    } else if (hit.segment === 25 || hit.segment === 50) {
        // the Arsenal: a bull pays in darts — spendable this turn, and what's left when the
        // player stops early (endTurnSaving) stays banked for their next turn
        state.turn.dartsLeft += hit.segment === 50 ? 3 : 2;
    } else {
        if (hit.segment < 1 || hit.segment > 20) throw new Error(`segment out of range: ${hit.segment}`);
        const box = state.boxes.find((b) => b.id === targetBoxId(hit));
        if (!box) throw new Error(`no box for hit ${JSON.stringify(hit)}`);

        const value = RING_VALUE[hit.multiplier!];

        if (!isReachable(state, me, box.id)) {
            // reach rule: dead dart — thrown is thrown, but no armies, no points, no capture
        } else {
            const wasMine = box.owner === me;
            if (box.owner === null) {
                box.owner = me;
                box.armies = value;
            } else if (wasMine) {
                box.armies += value;
            } else {
                box.armies -= value;
                if (box.armies <= 0) {
                    box.owner = me;
                    box.armies = 1;
                }
            }
            // a conquest (claiming a blank OR flipping an enemy box) earns exactly one card
            if (!wasMine && box.owner === me && state.deck.length > 0) {
                (state.hands[me] ??= []).push(state.deck.shift()!);
            }
        }
    }

    state.turn.dartsLeft -= 1;
    if (state.turn.dartsLeft === 0) {
        advanceTurn(state, 0);
    }
    checkDomination(state);
    return state;
}

/** Hand the turn to the next player from the starter; their banked darts roll into their pool. Horn checked here. */
function advanceTurn(state: RiskGameState, banked: number): void {
    const me = state.turn.playerId;
    state.saved ??= {}; // games persisted before the bank existed resume cleanly
    if (banked > 0) state.saved[me] = (state.saved[me] ?? 0) + banked;
    const order = [state.starterPlayerId, ...state.players.filter((p) => p !== state.starterPlayerId)];
    const at = order.indexOf(me);
    const next = order[(at + 1) % order.length];
    const carried = state.saved[next] ?? 0;
    if (carried > 0) state.saved[next] = 0; // drawn into the pool — clear so the bank only shows real savings
    state.turn = {
        playerId: next,
        dartsLeft: territoryIncome(state, next).total + carried,
        carried,
        index: state.turn.index + 1,
    };
    if (state.mode === 'clock' && state.turn.index - 1 >= (state.clockTurns ?? 0) * state.players.length) {
        soundTheHorn(state);
    }
}

/** The player stops early: every dart left in the pool is saved for their next turn. Counts as a turn. */
export function endTurnSaving(state: RiskGameState): RiskGameState {
    if (state.winner !== null) throw new Error('game is over');
    if (state.tie) throw new Error('game is over');
    advanceTurn(state, state.turn.dartsLeft);
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
