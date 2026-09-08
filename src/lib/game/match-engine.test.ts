import { describe, it, expect } from 'vitest';
import {
	createMatchState,
	submitTurn,
	abandonMatch,
	getScoreDisplay
} from './match-engine';
import type { MatchConfig, MatchState } from './types';
import { createDart } from './scoring';

const config: MatchConfig = {
	startingScore: 501,
	legsPerSet: 3,
	setsPerMatch: 1,
	doubleIn: false
};

const twoPlayers = [
	{ id: 'p1', name: 'Alice' },
	{ id: 'p2', name: 'Bob' }
];

function newMatch(over?: Partial<MatchConfig>): MatchState {
	return createMatchState('m1', { ...config, ...over }, twoPlayers);
}

const T20 = () => createDart(20, 3);
const triple = (n: number) => [T20(), T20(), createDart(n, 3)]; // 120+n turn helper

describe('createMatchState', () => {
	it('initializes players at the starting score', () => {
		const state = newMatch();
		expect(state.players).toHaveLength(2);
		expect(state.players[0].remainingScore).toBe(501);
		expect(state.players[0].legsWon).toBe(0);
		expect(state.players[0].setsWon).toBe(0);
		expect(state.status).toBe('in_progress');
		expect(state.currentLeg.setNumber).toBe(1);
		expect(state.currentLeg.legNumber).toBe(1);
		expect(state.currentLeg.currentPlayerIndex).toBe(0);
	});

	it('respects firstThrowerIndex', () => {
		const state = createMatchState('m1', config, twoPlayers, 1);
		expect(state.currentLeg.currentPlayerIndex).toBe(1);
		expect(state.currentLeg.firstThrowerIndex).toBe(1);
	});
});

describe('submitTurn', () => {
	it('subtracts the score and rotates to the next player', () => {
		let state = newMatch();
		state = submitTurn(state, triple(1)); // 123 by Alice → 378
		expect(state.players[0].remainingScore).toBe(378);
		expect(state.currentLeg.currentPlayerIndex).toBe(1);

		state = submitTurn(state, triple(5)); // 135 by Bob → 366
		expect(state.players[1].remainingScore).toBe(366);
		expect(state.currentLeg.currentPlayerIndex).toBe(0);
	});

	it('records the turn in the leg', () => {
		let state = newMatch();
		state = submitTurn(state, [T20()]);
		expect(state.currentLeg.turns).toHaveLength(1);
		expect(state.currentLeg.turns[0].playerId).toBe('p1');
		expect(state.currentLeg.turns[0].turnNumber).toBe(1);
		expect(state.currentLeg.turns[0].dartsThrown).toBe(1);
	});

	it('reverts the score on a bust and still passes the turn', () => {
		let state = newMatch();
		state = submitTurn(state, [T20(), T20(), T20()]); // Alice: 321
		state = submitTurn(state, [createDart(19, 3), T20()]); // Bob: 117 → bust (376-117 < 0? 501-117=384, not bust)
		// Bob scored 117: 501-117 = 384, valid. Now make Bob actually bust later.
		expect(state.players[1].remainingScore).toBe(384);

		// Alice throws again and busts: 321 - 331 impossible... use remaining 321, score 180 → 141, valid.
		state = submitTurn(state, [T20(), T20(), T20()]); // Alice: 141
		// Alice bust: 141 → score 141+1? Use score 155 (T20,T20,D25 no...) simpler: 141 < 180 no bust. Submit 60+60+60=180 → -39 bust.
		state = submitTurn(state, [T20(), T20(), T20()]); // Bob: 384-180=204
		state = submitTurn(state, [T20(), T20(), T20()]); // Alice: 141-180 = -39 BUST
		expect(state.players[0].remainingScore).toBe(141); // unchanged
		expect(state.currentLeg.turns).toHaveLength(5);
		expect(state.currentLeg.turns[4].isBust).toBe(true);
		expect(state.currentLeg.currentPlayerIndex).toBe(1);
	});

	it('a bust turn records the pre-turn remaining score', () => {
		let state = newMatch({ startingScore: 301 });
		// Alice: 301, throw 180 → 121
		state = submitTurn(state, [T20(), T20(), T20()]);
		// Bob: 301, throw 180 → 121
		state = submitTurn(state, [T20(), T20(), T20()]);
		// Alice: 121, throw 141 → bust, records 121
		state = submitTurn(state, [T20(), T20(), createDart(7, 3)]);
		const bustTurn = state.currentLeg.turns[2];
		expect(bustTurn.isBust).toBe(true);
		expect(bustTurn.remainingScore).toBe(121);
		expect(bustTurn.totalScore).toBe(141);
	});

	it('does not mutate the input state', () => {
		const state = newMatch();
		const snapshot = JSON.stringify(state);
		submitTurn(state, [T20()]);
		expect(JSON.stringify(state)).toBe(snapshot);
	});
});

describe('leg / set / match progression', () => {
	it('wins a leg on checkout, resets scores, and alternates first thrower', () => {
		let state = newMatch();
		// Alice: 501 → checkout in 3 turns (180, 180, 141 = D12 finish? 501-360=141; T20 T20 D... no)
		// Simplest: 501 = 180 + 180 + 141 (T20 T20 D... 141 = T20(60) T15(45) D18(36)? no.)
		// Use 501 → 321 → 141 → checkout 141 = T20 T19 D12 (60+57+24=141) ✓
		state = submitTurn(state, [T20(), T20(), T20()]); // Alice 321
		state = submitTurn(state, [createDart(0, 0)]); // Bob miss
		state = submitTurn(state, [T20(), T20(), T20()]); // Alice 141
		state = submitTurn(state, [createDart(0, 0)]); // Bob miss
		state = submitTurn(state, [createDart(20, 3), createDart(19, 3), createDart(12, 2)]); // Alice checks out 141

		// Leg complete → Alice has 1 leg, next leg starts, Bob throws first
		expect(state.players[0].legsWon).toBe(1);
		expect(state.players[0].remainingScore).toBe(501);
		expect(state.players[1].remainingScore).toBe(501);
		expect(state.currentLeg.legNumber).toBe(2);
		expect(state.currentLeg.currentPlayerIndex).toBe(1); // Bob alternates to first
		expect(state.currentLeg.firstThrowerIndex).toBe(1);
		expect(state.status).toBe('in_progress');
	});

	it('wins a set when a player takes the majority of legs', () => {
		let state = newMatch({ legsPerSet: 3, setsPerMatch: 3 });

		// Play leg 1: Alice checks out quickly (501 = T20x7 + D... just: 180,180,141-checkout)
		const aliceCheckout = (s: MatchState): MatchState => {
			s = submitTurn(s, [T20(), T20(), T20()]);
			s = submitTurn(s, [createDart(0, 0)]); // Bob passes
			s = submitTurn(s, [T20(), T20(), T20()]);
			s = submitTurn(s, [createDart(0, 0)]);
			s = submitTurn(s, [createDart(20, 3), createDart(19, 3), createDart(12, 2)]);
			return s;
		};

		// Leg 1 — Alice throws first and wins
		state = aliceCheckout(state);
		expect(state.players[0].legsWon).toBe(1);

		// Leg 2 — Bob throws first; Alice still wins the leg AND the set
		state = submitTurn(state, [createDart(0, 0)]); // Bob passes
		state = aliceCheckout(state);

		// Alice took 2 of 3 legs → set won (legs reset to 0 for the next set),
		// match (best of 3 sets, needs 2) not yet
		expect(state.players[0].setsWon).toBe(1);
		expect(state.currentLeg.setNumber).toBe(2);
		expect(state.currentLeg.legNumber).toBe(1);
		expect(state.players[0].legsWon).toBe(0); // legs reset for the new set
		expect(state.status).toBe('in_progress');
	});

	it('completes the match when a player wins the majority of sets', () => {
		let state = newMatch({ legsPerSet: 1, setsPerMatch: 1 });

		// Single leg, single set: first checkout wins everything
		state = submitTurn(state, [T20(), T20(), T20()]); // Alice 321
		state = submitTurn(state, [createDart(0, 0)]); // Bob
		state = submitTurn(state, [T20(), T20(), T20()]); // Alice 141
		state = submitTurn(state, [createDart(0, 0)]); // Bob
		state = submitTurn(state, [createDart(20, 3), createDart(19, 3), createDart(12, 2)]); // checkout

		expect(state.status).toBe('completed');
		expect(state.winnerId).toBe('p1');
		expect(state.players[0].setsWon).toBe(1);
		expect(state.players[0].legsWon).toBe(1);
	});

	it('ignores turns submitted after the match completes', () => {
		let state = newMatch({ legsPerSet: 1, setsPerMatch: 1 });
		state = submitTurn(state, [T20(), T20(), T20()]);
		state = submitTurn(state, [createDart(0, 0)]);
		state = submitTurn(state, [T20(), T20(), T20()]);
		state = submitTurn(state, [createDart(0, 0)]);
		state = submitTurn(state, [createDart(20, 3), createDart(19, 3), createDart(12, 2)]);
		expect(state.status).toBe('completed');

		const done = submitTurn(state, [T20()]);
		expect(done).toBe(state); // unchanged
	});
});

describe('multi-player rotation', () => {
	it('rotates through 4 players in order', () => {
		const four = [
			{ id: 'a', name: 'A' },
			{ id: 'b', name: 'B' },
			{ id: 'c', name: 'C' },
			{ id: 'd', name: 'D' }
		];
		let state = createMatchState('m4', config, four);
		const order: string[] = [];
		for (let i = 0; i < 4; i++) {
			order.push(state.players[state.currentLeg.currentPlayerIndex].id);
			state = submitTurn(state, [createDart(1, 1)]);
		}
		expect(order).toEqual(['a', 'b', 'c', 'd']);
		expect(state.currentLeg.currentPlayerIndex).toBe(0); // wraps
	});
});

describe('abandonMatch', () => {
	it('marks the match abandoned', () => {
		const state = abandonMatch(newMatch());
		expect(state.status).toBe('abandoned');
	});
});

describe('getScoreDisplay', () => {
	it('shows sets/legs/remaining per player', () => {
		let state = newMatch();
		state = submitTurn(state, [T20()]);
		const display = getScoreDisplay(state);
		expect(display).toEqual([
			{ name: 'Alice', sets: 0, legs: 0, remaining: 441 },
			{ name: 'Bob', sets: 0, legs: 0, remaining: 501 }
		]);
	});
});
