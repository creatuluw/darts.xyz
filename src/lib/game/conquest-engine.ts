/**
 * Trebles & Territories — conquest engine.
 * Pure state machine: no I/O, no side effects. Every action returns
 * { state, events } with a fresh state object (input never mutated).
 *
 * Dart input matches the Dartboard component: segment 1–20, or 25 for bull
 * (multiplier 1 = outer 25, 2 = inner 50).
 */

import type { Multiplier } from './types';

export type ConquestMode = 'clock' | 'domination';
export type ConquestPhase =
	| 'turn'
	| 'resurrect_pick'
	| 'duel_pick'
	| 'duel_save'
	| 'tiebreak'
	| 'finished';

export interface ConquestDart {
	segment: number; // 1–20, 25 = bull, 0 = miss
	multiplier: Multiplier;
}

export interface ConquestTerritory {
	owner: string | null;
	hp: number; // 1–3 when owned
}

export interface ConquestPlayer {
	id: string;
	name: string;
	dartsThrown: number;
	bonusDarts: number;
	dead: boolean; // true once they've lost their last territory — altar rules apply
}

export interface PendingDuel {
	attacker: string; // dead player robbing
	defender: string; // next living player in seat order
	target: number | null; // territory being robbed
}

export interface TiebreakState {
	round: number;
	activeIndex: number;
	participants: string[];
	throws: { playerId: string; round: number; value: number }[];
}

export interface Standing {
	playerId: string;
	score: number;
	territories: number;
	continents: number;
	rank: number;
}

export interface ConquestState {
	mode: ConquestMode;
	preset: number; // dart budget per player
	players: ConquestPlayer[]; // array order = seat order
	activeSeat: number;
	territories: Record<number, ConquestTerritory>;
	turnCount: number;
	dartsLeftInTurn: number;
	turnDarts: ConquestDart[]; // darts thrown this turn (Shanghai detection)
	turnShanghais: number[]; // wedge numbers already paid out this turn
	phase: ConquestPhase;
	pendingDuel: PendingDuel | null;
	tiebreak: TiebreakState | null;
	winner: string | null;
	standings: Standing[] | null;
}

export type ConquestEvent =
	| { type: 'FOUNDED'; player: string; territory: number }
	| { type: 'DAMAGED'; player: string; territory: number; damage: number; hp: number }
	| { type: 'CAPTURED'; player: string; from: string; territory: number }
	| { type: 'REINFORCED'; player: string; territory: number; hp: number }
	| { type: 'DIED'; player: string }
	| { type: 'BULL_HIT'; player: string }
	| { type: 'RESURRECT'; player: string; territory: number }
	| { type: 'DUEL_CHALLENGE'; attacker: string; defender: string }
	| { type: 'DUEL_SAVED'; attacker: string; defender: string }
	| { type: 'DUEL_STOLEN'; attacker: string; defender: string; territory: number }
	| { type: 'SHANGHAI'; player: string; number: number }
	| { type: 'GAME_END'; winner: string | null };

/** The six fixed continents (spec §01): Gold Coast, Highgate, Iron Ridge, The Pass, Mercia, Fourlands. */
export const CONTINENTS: number[][] = [
	[20, 18, 12],
	[16, 11, 9],
	[19, 13, 5],
	[17, 6, 2],
	[15, 10, 8, 7],
	[14, 4, 3, 1]
];

/** Wedge number → continent index. */
export const CONTINENT_OF: Record<number, number> = Object.fromEntries(
	CONTINENTS.flatMap((members, ci) => members.map((n) => [n, ci]))
) as Record<number, number>;

/** Continent display names, index-aligned with CONTINENTS (spec §01). */
export const CONTINENT_NAMES = [
	'Gold Coast',
	'Highgate',
	'Iron Ridge',
	'The Pass',
	'Mercia',
	'Fourlands'
];

export const WEDGES: number[] = CONTINENTS.flat().sort((a, b) => a - b);

export interface CreateConquestOptions {
	mode: ConquestMode;
	preset: number;
	players: { id: string; name: string }[];
}

export function createConquestMatch(opts: CreateConquestOptions): ConquestState {
	if (opts.players.length < 2 || opts.players.length > 6) {
		throw new Error('Conquest needs 2–6 players');
	}
	const territories: Record<number, ConquestTerritory> = {};
	for (const n of WEDGES) territories[n] = { owner: null, hp: 0 };
	return {
		mode: opts.mode,
		preset: opts.preset,
		players: opts.players.map((p) => ({ ...p, dartsThrown: 0, bonusDarts: 0, dead: false })),
		activeSeat: 0,
		territories,
		turnCount: 0,
		dartsLeftInTurn: 3,
		turnDarts: [],
		turnShanghais: [],
		phase: 'turn',
		pendingDuel: null,
		tiebreak: null,
		winner: null,
		standings: null
	};
}

// ── queries ──────────────────────────────────────────────────────────────

export function blankTerritories(s: ConquestState): number[] {
	return WEDGES.filter((n) => s.territories[n].owner === null);
}

export function territoriesOf(s: ConquestState, playerId: string): number[] {
	return WEDGES.filter((n) => s.territories[n].owner === playerId);
}

export function isDead(s: ConquestState, playerId: string): boolean {
	return s.players.find((p) => p.id === playerId)?.dead ?? false;
}

export function continentCounts(s: ConquestState, playerId: string): { total: number; complete: number } {
	let complete = 0;
	for (const members of CONTINENTS) {
		if (members.every((n) => s.territories[n].owner === playerId)) complete++;
	}
	return { total: territoriesOf(s, playerId).length, complete };
}

export function scoreOf(s: ConquestState, playerId: string): number {
	const { total, complete } = continentCounts(s, playerId);
	return total + 2 * complete;
}

// ── actions ──────────────────────────────────────────────────────

export interface ActionResult {
	state: ConquestState;
	events: ConquestEvent[];
}

const clone = (s: ConquestState): ConquestState => structuredClone(s);

function validateDart(dart: ConquestDart): void {
	const { segment, multiplier } = dart;
	if (segment === 0) return; // miss
	if (segment === 25) {
		if (multiplier !== 1 && multiplier !== 2)
			throw new Error('Bull is single (25) or double (50) only');
		return;
	}
	if (segment < 1 || segment > 20 || multiplier < 1 || multiplier > 3)
		throw new Error(`Invalid dart {${segment}, ×${multiplier}}`);
}

/** Next player (cycling seats) other than `fromSeat` who still owns land. */
function nextVictim(s: ConquestState, fromSeat: number): string | null {
	const n = s.players.length;
	for (let i = 1; i <= n; i++) {
		const p = s.players[(fromSeat + i) % n];
		if (territoriesOf(s, p.id).length > 0) return p.id;
	}
	return null;
}

/** Consume the dart; sets up the next player's visit or ends the clock game. */
function endTurn(s: ConquestState, events: ConquestEvent[]): void {
	s.turnCount++;
	s.turnDarts = [];
	s.turnShanghais = [];
	const n = s.players.length;
	// find next player with darts left in budget
	let seat = -1;
	for (let i = 1; i <= n; i++) {
		const idx = (s.activeSeat + i) % n;
		if (s.players[idx].dartsThrown < s.preset) {
			seat = idx;
			break;
		}
	}
	if (seat === -1) {
		endGame(s, events);
		return;
	}
	s.activeSeat = seat;
	startVisit(s);
}

/** Set dartsLeftInTurn for the active player's visit (consumes Shanghai bonus). */
function startVisit(s: ConquestState): void {
	const p = s.players[s.activeSeat];
	const remaining = s.preset - p.dartsThrown;
	s.dartsLeftInTurn = Math.min(3 + p.bonusDarts, remaining);
	p.bonusDarts = 0;
}

function instantWin(s: ConquestState, playerId: string): boolean {
	const { total, complete } = continentCounts(s, playerId);
	return total >= 7 || complete >= 1;
}

function buildStandings(s: ConquestState): Standing[] {
	const scored = s.players.map((p) => {
		const { total, complete } = continentCounts(s, p.id);
		return { playerId: p.id, score: scoreOf(s, p.id), territories: total, continents: complete };
	});
	scored.sort((a, b) => b.score - a.score);
	let rank = 0;
	return scored.map((x, i) => {
		if (i === 0 || scored[i - 1].score !== x.score) rank = i + 1;
		return { ...x, rank };
	});
}

function endGame(s: ConquestState, events: ConquestEvent[]): void {
	s.standings = buildStandings(s);
	const top = s.standings.filter((x) => x.score === s.standings![0].score);
	if (top.length > 1) {
		s.phase = 'tiebreak';
		s.tiebreak = {
			round: 1,
			activeIndex: 0,
			participants: top.map((t) => t.playerId),
			throws: []
		};
	} else {
		finishWith(s, events, s.standings[0].playerId);
	}
}

function finishWith(s: ConquestState, events: ConquestEvent[], winner: string | null): void {
	s.phase = 'finished';
	s.winner = winner;
	if (!s.standings) s.standings = buildStandings(s);
	events.push({ type: 'GAME_END', winner });
}

function checkShanghai(s: ConquestState, events: ConquestEvent[], playerId: string): void {
	for (let n = 1; n <= 20; n++) {
		if (s.turnShanghais.includes(n)) continue;
		const has = (m: number) => s.turnDarts.some((d) => d.segment === n && d.multiplier === m);
		if (has(1) && has(2) && has(3)) {
			s.turnShanghais.push(n);
			const p = s.players.find((x) => x.id === playerId);
			if (p) p.bonusDarts += 1;
			events.push({ type: 'SHANGHAI', player: playerId, number: n });
		}
	}
}

export function applyDart(state: ConquestState, dart: ConquestDart): ActionResult {
	if (state.phase !== 'turn')
		throw new Error(`applyDart: phase is '${state.phase}', expected 'turn'`);	validateDart(dart);
	const s = clone(state);
	const events: ConquestEvent[] = [];
	const me = s.players[s.activeSeat];
	me.dartsThrown++;
	s.dartsLeftInTurn--;

	if (dart.segment === 0) {
		// clean miss — nothing happens
	} else if (isDead(s, me.id)) {
		if (dart.segment !== 25) throw new Error('Dead players throw at the bull only');
		events.push({ type: 'BULL_HIT', player: me.id });
		if (blankTerritories(s).length > 0) {
			s.phase = 'resurrect_pick';
		} else {
			const victim = nextVictim(s, s.activeSeat);
			if (victim) {
				s.pendingDuel = { attacker: me.id, defender: victim, target: null };
				s.phase = 'duel_pick';
				events.push({ type: 'DUEL_CHALLENGE', attacker: me.id, defender: victim });
			}
		}
	} else {
		s.turnDarts.push(dart);
		if (dart.segment !== 25) {
			const t = s.territories[dart.segment];
			if (t.owner === null) {
				if (dart.multiplier === 3) {
					t.owner = me.id;
					t.hp = 3;
					events.push({ type: 'FOUNDED', player: me.id, territory: dart.segment });
				}
			} else if (t.owner === me.id) {
				t.hp = Math.min(3, t.hp + 1);
				events.push({ type: 'REINFORCED', player: me.id, territory: dart.segment, hp: t.hp });
			} else {
				t.hp -= dart.multiplier;
				if (t.hp <= 0) {
					const from = t.owner!;
					t.owner = me.id;
					t.hp = 1;
					events.push({ type: 'CAPTURED', player: me.id, from, territory: dart.segment });
					if (territoriesOf(s, from).length === 0) {
						s.players.find((p) => p.id === from)!.dead = true;
						events.push({ type: 'DIED', player: from });
					}
				} else {
					events.push({ type: 'DAMAGED', player: me.id, territory: dart.segment, damage: dart.multiplier, hp: t.hp });
				}
			}
		}
		checkShanghai(s, events, me.id);
		if (s.mode === 'domination' && instantWin(s, me.id)) {
			finishWith(s, events, me.id);
			return { state: s, events };
		}
	}

	if (s.phase === 'turn' && s.dartsLeftInTurn === 0) endTurn(s, events);
	return { state: s, events };
}

/** Dead player claims a blank wedge (1 HP) after hitting the bull. */
export function pickResurrectBlank(state: ConquestState, num: number): ActionResult {
	if (state.phase !== 'resurrect_pick')
		throw new Error(`pickResurrectBlank: phase is '${state.phase}'`);
	if (state.territories[num]?.owner !== null)
		throw new Error(`Wedge ${num} is not blank`);
	const s = clone(state);
	const events: ConquestEvent[] = [];
	const me = s.players[s.activeSeat];
	s.territories[num] = { owner: me.id, hp: 1 };
	me.dead = false;
	s.phase = 'turn';
	events.push({ type: 'RESURRECT', player: me.id, territory: num });
	if (s.dartsLeftInTurn === 0) endTurn(s, events);
	return { state: s, events };
}

/** Attacker in a duel picks which of the defender's wedges to rob. */
export function pickDuelTarget(state: ConquestState, num: number): ActionResult {
	if (state.phase !== 'duel_pick') throw new Error(`pickDuelTarget: phase is '${state.phase}'`);
	const duel = state.pendingDuel!;
	if (state.territories[num]?.owner !== duel.defender)
		throw new Error(`Wedge ${num} is not ${duel.defender}'s territory`);
	const s = clone(state);
	s.pendingDuel = { ...duel, target: num };
	s.phase = 'duel_save';
	return { state: s, events: [] };
}

/** Defender's one free save dart at the bull. hit = DENIED, miss = theft. */
export function resolveSaveDart(state: ConquestState, hit: boolean): ActionResult {
	if (state.phase !== 'duel_save') throw new Error(`resolveSaveDart: phase is '${state.phase}'`);
	const duel = state.pendingDuel!;
	const s = clone(state);
	const events: ConquestEvent[] = [];
	const attacker = s.players.find((p) => p.id === duel.attacker)!;
	const defender = s.players.find((p) => p.id === duel.defender)!
	// defender's save dart is free — dartsThrown untouched
	s.pendingDuel = null;
	s.phase = 'turn';
	if (hit) {
		events.push({ type: 'DUEL_SAVED', attacker: duel.attacker, defender: duel.defender });
		// attacker stays dead, remaining darts forfeit, visit over
		endTurn(s, events);
	} else {
		const target = duel.target!;
		s.territories[target] = { owner: attacker.id, hp: 1 };
		attacker.dead = false;
		events.push({ type: 'DUEL_STOLEN', attacker: duel.attacker, defender: duel.defender, territory: target });
		if (territoriesOf(s, defender.id).length === 0) {
			defender.dead = true;
			events.push({ type: 'DIED', player: defender.id });
		}
		// attacker continues with remaining darts
		if (s.dartsLeftInTurn === 0) endTurn(s, events);
	}
	return { state: s, events };
}

/** One sudden-death dart in a tiebreak: 50 (inner) > 25 (outer) > miss. */
export function applyTiebreakDart(state: ConquestState, dart: ConquestDart): ActionResult {
	if (state.phase !== 'tiebreak') throw new Error(`applyTiebreakDart: phase is '${state.phase}'`);
	validateDart(dart);
	const s = clone(state);
	const events: ConquestEvent[] = [];
	const tb = s.tiebreak!;
	const pid = tb.participants[tb.activeIndex];
	const value = dart.segment === 25 ? (dart.multiplier === 2 ? 50 : 25) : 0;
	tb.throws.push({ playerId: pid, round: tb.round, value });
	tb.activeIndex++;
	if (tb.activeIndex < tb.participants.length) return { state: s, events };
	// round complete
	const roundThrows = tb.throws.filter((t) => t.round === tb.round);
	const best = Math.max(...roundThrows.map((t) => t.value));
	const leaders = roundThrows.filter((t) => t.value === best).map((t) => t.playerId);
	if (leaders.length === 1) {
		// re-rank the tied group by total tiebreak value across rounds
		const byTiebreak = (id: string) =>
			tb.throws.filter((t) => t.playerId === id).reduce((sum, t) => sum + t.value, 0);
		const ordered = [...tb.participants].sort((x, y) => byTiebreak(y) - byTiebreak(x));
		const tiedRank = s.standings!.find((x) => x.playerId === ordered[0])!.rank;
		s.standings = s.standings!.map((x) => {
			const idx = ordered.indexOf(x.playerId);
			return idx >= 0 ? { ...x, rank: tiedRank + idx } : x;
		});
		finishWith(s, events, leaders[0]);
	} else {
		tb.round++;
		tb.participants = leaders;
		tb.activeIndex = 0;
	}
	return { state: s, events };
}
