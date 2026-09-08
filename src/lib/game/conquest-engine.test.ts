import { describe, it, expect } from 'vitest';
import {
	createConquestMatch,
	applyDart,
	pickResurrectBlank,
	pickDuelTarget,
	resolveSaveDart,
	applyTiebreakDart,
	CONTINENTS,
	CONTINENT_OF,
	WEDGES,
	territoriesOf,
	blankTerritories
} from './conquest-engine';
import type { ConquestState, ConquestDart } from './conquest-engine';

const P = [
	{ id: 'a', name: 'Ada' },
	{ id: 'b', name: 'Ben' },
	{ id: 'c', name: 'Cal' }
];

function newMatch(overrides?: Partial<Parameters<typeof createConquestMatch>[0]>) {
	return createConquestMatch({ mode: 'clock', preset: 301, players: P, ...overrides });
}

describe('CONTINENTS', () => {
	it('covers all 20 wedges exactly once across 6 continents', () => {
		const all = CONTINENTS.flat();
		expect(all).toHaveLength(20);
		expect(new Set(all).size).toBe(20);
		expect(CONTINENTS).toHaveLength(6);
	});

	it('maps every wedge to its continent', () => {
		expect(CONTINENT_OF[20]).toBe(0); // Gold Coast
		expect(CONTINENT_OF[12]).toBe(0);
		expect(CONTINENT_OF[7]).toBe(4); // Mercia
		expect(CONTINENT_OF[1]).toBe(5); // Fourlands
	});
});

describe('createConquestMatch', () => {
	it('creates a blank 20-territory board with player 0 to throw', () => {
		const s = newMatch();
		expect(blankTerritories(s)).toHaveLength(20);
		expect(s.players).toHaveLength(3);
		expect(s.activeSeat).toBe(0);
		expect(s.phase).toBe('turn');
		expect(s.dartsLeftInTurn).toBe(3);
		expect(s.turnCount).toBe(0);
		expect(s.mode).toBe('clock');
		expect(s.preset).toBe(301);
		expect(s.pendingDuel).toBeNull();
		expect(s.winner).toBeNull();
	});

	it('tracks dart budgets per player', () => {
		const s = newMatch();
		expect(s.players.every((p) => p.dartsThrown === 0 && p.bonusDarts === 0)).toBe(true);
	});

	it('rejects fewer than 2 or more than 6 players', () => {
		expect(() => newMatch({ players: [P[0]] })).toThrow();
		expect(() =>
			newMatch({ players: Array.from({ length: 7 }, (_, i) => ({ id: String(i), name: `p${i}` })) })
		).toThrow();
	});
});

// helpers for dart-resolution tests
const S = (segment: number, multiplier: 1 | 2 | 3 | 0 = 1): ConquestDart => ({ segment, multiplier });

function throwDarts(s: ConquestState, ...darts: ConquestDart[]): ConquestState {
	let st = s;
	for (const d of darts) st = applyDart(st, d).state;
	return st;
}

/** Burn full 3-dart visits of dead darts (dead players miss the bull). */
function burn(s: ConquestState, visits = 1): ConquestState {
	for (let v = 0; v < visits; v++) {
		for (let d = 0; d < 3; d++) {
			const dead = s.players[s.activeSeat].dead;
			s = applyDart(s, dead ? S(0) : S(1)).state;
		}
	}
	return s;
}

/** a owns 20@3, b owns 18@3, c burnt a visit; control back to a. */
function twoOwners(s: ConquestState): ConquestState {
	s = throwDarts(s, S(20, 3), S(1), S(1)); // a founds 20
	s = throwDarts(s, S(18, 3), S(1), S(1)); // b founds 18
	return burn(s); // c's visit
}

describe('applyDart — founding (blank wedges)', () => {
	it('a treble on a blank founds at 3 HP', () => {
		const s = throwDarts(newMatch(), S(20, 3));
		expect(s.territories[20]).toEqual({ owner: 'a', hp: 3 });
	});

	it('singles and doubles on blanks are dead darts', () => {
		const s = throwDarts(newMatch(), S(20), S(20, 2), S(1));
		expect(s.territories[20]).toEqual({ owner: null, hp: 0 });
		expect(s.territories[1]).toEqual({ owner: null, hp: 0 });
	});
});

describe('applyDart — siege (enemy wedges)', () => {
	it('S/D/T deal 1/2/3 damage; 1+2 vs 3 HP captures at 1 HP', () => {
		const s = throwDarts(twoOwners(newMatch()), S(18), S(18, 2), S(1)); // a: 1+2 dmg → capture
		expect(s.territories[18]).toEqual({ owner: 'a', hp: 1 });
	});

	it('a double against 2 HP captures at 1 HP', () => {
		let s = twoOwners(newMatch());
		s = throwDarts(s, S(18), S(1), S(1)); // a: 1 dmg → 18@2
		s = burn(s, 2); // b + c visits
		s = throwDarts(s, S(18, 2), S(1), S(1)); // a: 2 dmg vs 2 hp → capture
		expect(s.territories[18]).toEqual({ owner: 'a', hp: 1 });
	});

	it('a single against 1 HP captures, killing the defender', () => {
		let s = twoOwners(newMatch());
		s = throwDarts(s, S(18), S(18), S(1)); // a: 2 dmg → 18@1
		s = burn(s, 2);
		const res = applyDart(s, S(18)); // a: capture + DIED(b)
		expect(res.state.territories[18]).toEqual({ owner: 'a', hp: 1 });
		expect(res.events).toContainEqual({ type: 'DIED', player: 'b' });
		expect(res.events).toContainEqual({ type: 'CAPTURED', player: 'a', from: 'b', territory: 18 });
		expect(res.state.players.find((p) => p.id === 'b')!.dead).toBe(true);
	});
});

describe('applyDart — reinforcing (own wedges)', () => {
	it('a hit on newly captured land reinforces it (mid-turn flip)', () => {
		const s = throwDarts(twoOwners(newMatch()), S(18, 3), S(18), S(1)); // a: capture @1 → reinforce 2
		expect(s.territories[18]).toEqual({ owner: 'a', hp: 2 });
	});

	it('any hit on own land heals +1', () => {
		let s = twoOwners(newMatch());
		s = throwDarts(s, S(18, 3), S(1), S(1)); // a: capture 18 @1
		s = burn(s, 2);
		s = throwDarts(s, S(18), S(1), S(1)); // a: reinforce → 2
		expect(s.territories[18]).toEqual({ owner: 'a', hp: 2 });
	});

	it('reinforce caps at 3 HP', () => {
		const s = throwDarts(twoOwners(newMatch()), S(20), S(20, 2), S(1));
		expect(s.territories[20]).toEqual({ owner: 'a', hp: 3 });
	});
});

describe('applyDart — bull', () => {
	it('is a no-op for a landowner', () => {
		let s = twoOwners(newMatch());
		const before = JSON.stringify(s.territories);
		s = throwDarts(s, S(25), S(25, 2), S(1));
		expect(JSON.stringify(s.territories)).toBe(before);
	});
});

describe('turn rotation & budget', () => {
	it('rotates seats every 3 darts and counts turns', () => {
		let s = throwDarts(newMatch(), S(20, 3), S(1), S(1)); // a's visit
		expect(s.activeSeat).toBe(1);
		expect(s.turnCount).toBe(1);
		s = throwDarts(s, S(18, 3), S(1), S(1));
		expect(s.activeSeat).toBe(2);
		expect(s.turnCount).toBe(2);
	});

	it('truncates the final visit when the budget is not a multiple of 3', () => {
		// preset 101: 34 visits, last has 2 darts
		let s = newMatch({ preset: 101 });
		// exhaust a's first 33 visits (99 darts) — burn everyone else equally
		for (let v = 0; v < 33; v++) {
			s = throwDarts(s, S(1), S(1), S(1)); // a
			s = burn(s, 2); // b + c
		}
		expect(s.players[0].dartsThrown).toBe(99);
		expect(s.activeSeat).toBe(0);
		expect(s.dartsLeftInTurn).toBe(2); // 101 - 99
		s = throwDarts(s, S(1), S(1));
		expect(s.players[0].dartsThrown).toBe(101);
		expect(s.activeSeat).toBe(1); // a is done; b throws next
	});
});

describe('Shanghai', () => {
	it('S+D+T of one wedge in any order earns a bonus dart next visit', () => {
		// a: D20, S20, T20 (order 2-1-3)
		let s = throwDarts(newMatch(), S(20, 2), S(20), S(20, 3));
		expect(s.territories[20]).toEqual({ owner: 'a', hp: 3 });
		// 6 total damage vs 3 hp → captured at 1 (mid-turn flip), Shanghai regardless
		const res = applyDart(newMatch(), S(20, 2));
		expect(res.events).toEqual([]); // sanity: helper works
		// a's next visit should have 4 darts
		s = burn(s, 2); // b + c
		expect(s.activeSeat).toBe(0);
		expect(s.dartsLeftInTurn).toBe(4);
		expect(s.players[0].bonusDarts).toBe(0); // consumed
	});

	it('emits SHANGHAI once, in any order (1-3-2)', () => {
		const res = applyDart(
			throwDarts(newMatch(), S(16), S(16, 3)),
			S(16, 2)
		);
		expect(res.events).toContainEqual({ type: 'SHANGHAI', player: 'a', number: 16 });
	});

	it('does not trigger on S,S,D or two wedges', () => {
		let r = applyDart(throwDarts(newMatch(), S(20), S(20)), S(20, 2));
		expect(r.events.filter((e) => e.type === 'SHANGHAI')).toEqual([]);
		r = applyDart(throwDarts(newMatch(), S(20), S(20, 2), S(18, 3)), S(1));
		expect(r.events.filter((e) => e.type === 'SHANGHAI')).toEqual([]);
	});

	it('the bonus is spent after one visit', () => {
		let s = throwDarts(newMatch(), S(20), S(20, 2), S(20, 3)); // shanghai
		s = burn(s, 2); // b + c
		s = throwDarts(s, S(1), S(1), S(1), S(1)); // a: 4-dart visit
		s = burn(s, 2);
		expect(s.dartsLeftInTurn).toBe(3); // back to normal
	});
});

describe('death & the Bull Altar', () => {
	/** a owns 20@3 + 18@3, c owns 12@3, b is dead. Control: b (altar turn). */
	function deadB(s: ConquestState): ConquestState {
		s = throwDarts(s, S(20, 3), S(1), S(1)); // a founds 20
		s = throwDarts(s, S(18, 3), S(1), S(1)); // b founds 18
		s = burn(s); // c
		s = throwDarts(s, S(18, 3), S(18), S(1)); // a captures 18 → @2, b dead
		s = burn(s); // c
		s = throwDarts(s, S(1), S(1), S(1)); // a
		s = burn(s); // c
		expect(s.players.find((p) => p.id === 'b')!.dead).toBe(true);
		expect(s.activeSeat).toBe(1); // b's altar visit
		return s;
	}

	it('a dead player may only throw at the bull', () => {
		const s = deadB(newMatch());
		expect(() => applyDart(s, S(20))).toThrow('bull only');
	});

	it('a bull hit with blanks on the board forces a blank claim (resurrect_pick)', () => {
		const s = deadB(newMatch());
		const res = applyDart(s, S(25));
		expect(res.events).toContainEqual({ type: 'BULL_HIT', player: 'b' });
		expect(res.state.phase).toBe('resurrect_pick');
		expect(res.state.activeSeat).toBe(1); // still b's turn, waiting on pick
	});

	it('claiming a blank resurrects at 1 HP and continues the visit', () => {
		const s0 = deadB(newMatch());
		const s1 = applyDart(s0, S(25)).state; // phase resurrect_pick, 2 darts left
		const res = pickResurrectBlank(s1, 5);
		expect(res.events).toContainEqual({ type: 'RESURRECT', player: 'b', territory: 5 });
		expect(res.state.territories[5]).toEqual({ owner: 'b', hp: 1 });
		expect(res.state.phase).toBe('turn');
		expect(res.state.dartsLeftInTurn).toBe(2); // 3-dart visit, bull consumed one
		expect(res.state.players.find((p) => p.id === 'b')!.dead).toBe(false);
	});

	it('a bull hit with no blanks challenges the next landowner in seat order', () => {
		const full = allOwnedSetup(); // a owns 19 wedges, c owns 12, b dead at seat 1
		const res = applyDart(full, S(25, 2));
		expect(res.events).toContainEqual({ type: 'BULL_HIT', player: 'b' });
		expect(res.events).toContainEqual({ type: 'DUEL_CHALLENGE', attacker: 'b', defender: 'c' });
		expect(res.state.phase).toBe('duel_pick');
		expect(res.state.pendingDuel).toEqual({ attacker: 'b', defender: 'c', target: null });
	});

	it('the attacker picks the target and the defender gets one free save dart', () => {
		const full = allOwnedSetup();
		const s1 = applyDart(full, S(25)).state; // duel_pick, 2 darts left
		const res = pickDuelTarget(s1, 12);
		expect(res.state.phase).toBe('duel_save');
		expect(res.state.pendingDuel!.target).toBe(12);
	});

	it('a save hit DENIES the theft and ends the attacker visit', () => {
		const full = allOwnedSetup();
		const s1 = pickDuelTarget(applyDart(full, S(25)).state, 12).state;
		const res = resolveSaveDart(s1, true);
		expect(res.events).toContainEqual({ type: 'DUEL_SAVED', attacker: 'b', defender: 'c' });
		expect(res.state.territories[12].owner).toBe('c'); // untouched
		expect(res.state.players.find((p) => p.id === 'b')!.dead).toBe(true);
		expect(res.state.phase).toBe('turn');
		expect(res.state.activeSeat).toBe(2); // visit over, c's turn
		expect(res.state.pendingDuel).toBeNull();
	});

	it('a save miss steals the target at 1 HP and the attacker keeps remaining darts', () => {
		const full = allOwnedSetup();
		const s1 = pickDuelTarget(applyDart(full, S(25)).state, 12).state;
		const res = resolveSaveDart(s1, false);
		expect(res.events).toContainEqual({ type: 'DUEL_STOLEN', attacker: 'b', defender: 'c', territory: 12 });
		expect(res.state.territories[12]).toEqual({ owner: 'b', hp: 1 });
		expect(res.state.players.find((p) => p.id === 'b')!.dead).toBe(false);
		expect(res.state.activeSeat).toBe(1); // b continues
		expect(res.state.dartsLeftInTurn).toBe(2); // 3-dart visit, bull consumed one
	});

	it('missing all three bulls keeps the player dead', () => {
		const s = deadB(newMatch());
		const done = throwDarts(s, S(0), S(0), S(0));
		expect(done.players.find((p) => p.id === 'b')!.dead).toBe(true);
		expect(done.activeSeat).toBe(2);
	});
});

/** Craft: a owns everything except 12 (c owns 12), b dead at seat 1, b to throw. */
function allOwnedSetup(): ConquestState {
	let s = newMatch();
	s = throwDarts(s, S(20, 3), S(1), S(1)); // a: founds 20
	s = throwDarts(s, S(1), S(1), S(1)); // b: dead darts
	s = throwDarts(s, S(12, 3), S(1), S(1)); // c: founds 12
	const full = structuredClone(s);
	for (const n of WEDGES) {
		if (full.territories[n].owner === null) full.territories[n] = { owner: 'a', hp: 3 };
	}
	full.players[1].dead = true; // b died off-screen
	const s2 = burn(full, 1); // a's visit, then b's altar turn
	expect(s2.activeSeat).toBe(1);
	return s2;
}

describe('clock endgame', () => {
	it('ends after the last dart of the budget and scores territories + continent bonuses', () => {
		// 2 players, preset 51 (17 visits each). a founds Gold Coast (20,18,12) = 3+2*1 = 5 pts.
		// b founds Highgate (16) = 1 pt.
		let s = newMatch({ preset: 51, players: [P[0], P[1]] });
		// a's 17 visits: visit 1: T20,T18,T12 (founds 3)
		s = throwDarts(s, S(20, 3), S(18, 3), S(12, 3));
		for (let v = 0; v < 16; v++) {
			s = burn(s, 1); // b
			s = burn(s, 1); // a
		}
		// b's last visit (visit 17): founds 16
		s = throwDarts(s, S(16, 3), S(1), S(1));
		expect(s.phase).toBe('finished');
		expect(s.winner).toBe('a');
		expect(s.standings![0]).toMatchObject({ playerId: 'a', score: 5, territories: 3, continents: 1, rank: 1 });
		expect(s.standings![1]).toMatchObject({ playerId: 'b', score: 1, territories: 1, rank: 2 });
	});

	it('a top-score tie goes to sudden-death bull darts', () => {
		// 2 players, 51 darts, both own exactly 2 wedges: 2-2 tie → tiebreak
		let s = newMatch({ preset: 51, players: [P[0], P[1]] });
		s = throwDarts(s, S(20, 3), S(18, 3), S(1)); // a: 20, 18
		for (let v = 0; v < 16; v++) {
			s = burn(s, 1);
			s = burn(s, 1);
		}
		s = throwDarts(s, S(16, 3), S(11, 3), S(1)); // b: 16, 11 → 2-2 tie
		expect(s.phase).toBe('tiebreak');
		expect(s.tiebreak!.participants).toEqual(['a', 'b']);
		// round 1: a misses, b hits outer bull → b wins
		let r = applyTiebreakDart(s, S(1));
		expect(r.state.tiebreak!.activeIndex).toBe(1);
		r = applyTiebreakDart(r.state, S(25));
		expect(r.state.phase).toBe('finished');
		expect(r.state.winner).toBe('b');
		expect(r.events).toContainEqual({ type: 'GAME_END', winner: 'b' });
	});

	it('inner bull beats outer bull and ties repeat', () => {
		let s = newMatch({ preset: 51, players: [P[0], P[1]] });
		s = throwDarts(s, S(20, 3), S(18, 3), S(1));
		for (let v = 0; v < 16; v++) { s = burn(s, 1); s = burn(s, 1); }
		s = throwDarts(s, S(16, 3), S(11, 3), S(1));
		// round 1: both outer bulls → tied, repeat
		let r = applyTiebreakDart(s, S(25));
		r = applyTiebreakDart(r.state, S(25));
		expect(r.state.phase).toBe('tiebreak');
		expect(r.state.tiebreak!.round).toBe(2);
		expect(r.state.tiebreak!.participants).toEqual(['a', 'b']);
		// round 2: a inner bull (50), b outer (25) → a wins
		r = applyTiebreakDart(r.state, S(25, 2));
		r = applyTiebreakDart(r.state, S(25));
		expect(r.state.winner).toBe('a');
	});
});

describe('domination mode', () => {
	function dom(): ConquestState {
		return newMatch({ mode: 'domination', preset: 301, players: [P[0], P[1]] });
	}

	it('holding 7 territories wins instantly, mid-visit', () => {
		let s = dom();
		// a founds 6 over visits, then the 7th capture ends the game before the 3rd dart
		s = throwDarts(s, S(20, 3), S(18, 3), S(12, 3)); // a: 3 (Gold Coast complete!)
		// wait — Gold Coast complete on the 3rd dart already wins. Use non-continent wedges:
		s = dom();
		s = throwDarts(s, S(20, 3), S(19, 3), S(17, 3)); // a: 3 wedges (20,19,17)
		s = burn(s, 1); // b
		s = throwDarts(s, S(15, 3), S(13, 3), S(11, 3)); // a: 6 wedges
		s = burn(s, 1); // b
		const r = applyDart(s, S(16, 3)); // a: 7th wedge on the first dart of the visit
		expect(r.state.phase).toBe('finished');
		expect(r.state.winner).toBe('a');
		expect(r.events).toContainEqual({ type: 'GAME_END', winner: 'a' });
	});

	it('a complete continent wins instantly', () => {
		const s0 = dom();
		const r = applyDart(applyDart(applyDart(s0, S(20, 3)).state, S(18, 3)).state, S(12, 3));
		expect(r.state.phase).toBe('finished');
		expect(r.state.winner).toBe('a'); // Gold Coast complete
	});

	it('six territories does not win', () => {
		let s = dom();
		s = throwDarts(s, S(20, 3), S(19, 3), S(17, 3));
		s = burn(s, 1);
		const r = throwDarts(s, S(15, 3), S(13, 3), S(11, 3)); // a: 6
		expect(r.phase).toBe('turn');
	});
});

describe('random-game invariant sweep', () => {
	function mulberry32(seed: number) {
		return () => {
			seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
			let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	function checkInvariants(s: ConquestState) {
		let owned = 0;
		for (const n of WEDGES) {
			const t = s.territories[n];
			if (t.owner === null) expect(t.hp).toBe(0);
			else {
				owned++;
				expect(t.hp).toBeGreaterThanOrEqual(1);
				expect(t.hp).toBeLessThanOrEqual(3);
				expect(s.players.some((p) => p.id === t.owner)).toBe(true);
				// dead players own no land
				const p = s.players.find((x) => x.id === t.owner)!;
				expect(p.dead).toBe(false);
			}
		}
		expect(owned + blankTerritories(s).length).toBe(20);
		for (const p of s.players) {
			expect(p.dartsThrown).toBeLessThanOrEqual(s.preset);
		}
	}

	it('20 seeded games per mode run to completion without invariant violations', () => {
		for (const mode of ['clock', 'domination'] as const) {
			for (let seed = 1; seed <= 20; seed++) {
				const rng = mulberry32(seed * 1000 + (mode === 'clock' ? 0 : 7));
				let s = createConquestMatch({
					mode,
					preset: 51,
					players: [
						{ id: 'a', name: 'A' },
						{ id: 'b', name: 'B' },
						{ id: 'c', name: 'C' }
					]
				});
				let guard = 0;
				while (s.phase !== 'finished' && guard++ < 5000) {
					if (s.phase === 'turn') {
						const me = s.players[s.activeSeat];
						const wedge = WEDGES[Math.floor(rng() * 20)];
						const mult = ([1, 2, 3] as const)[Math.floor(rng() * 3)];
						if (me.dead) {
							// 60% bull, 40% miss
							s = applyDart(s, rng() < 0.6 ? S(25, rng() < 0.3 ? 2 : 1) : S(0)).state;
						} else {
							s = applyDart(s, rng() < 0.12 ? S(25, rng() < 0.5 ? 2 : 1) : S(wedge, mult)).state;
						}
					} else if (s.phase === 'resurrect_pick') {
						const blanks = blankTerritories(s);
						s = pickResurrectBlank(s, blanks[Math.floor(rng() * blanks.length)]).state;
					} else if (s.phase === 'duel_pick') {
						const victimLands = territoriesOf(s, s.pendingDuel!.defender);
						s = pickDuelTarget(s, victimLands[Math.floor(rng() * victimLands.length)]).state;
					} else if (s.phase === 'duel_save') {
						s = resolveSaveDart(s, rng() < 0.35).state;
					} else if (s.phase === 'tiebreak') {
						const r = rng();
						s = applyTiebreakDart(s, r < 0.2 ? S(25, 2) : r < 0.5 ? S(25) : S(1)).state;
					}
					checkInvariants(s);
				}
				expect(s.phase).toBe('finished');
				expect(s.winner).toBeTruthy();
				if (mode === 'clock') {
					// clock games only end when every budget is spent
					for (const p of s.players) expect(p.dartsThrown).toBe(s.preset);
				}
			}
		}
	});
});
