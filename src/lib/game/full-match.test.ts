import { describe, it, expect } from 'vitest';
import { createMatchState, submitTurn } from './match-engine';
import { createDart } from './scoring';
import type { MatchState } from './types';

/**
 * Full-match simulation — mirrors the scenario documented in
 * docs/gameplay-e2e.md: 501, best-of-3 legs per set, best-of-3 sets.
 *
 * Driving rule: in each leg one designated player plays
 * 180 → 180 → 141-checkout (T20 T19 D12); everyone else throws a miss.
 */
const CHECKOUT_SEQ = [
	[createDart(20, 3), createDart(20, 3), createDart(20, 3)], // 180
	[createDart(20, 3), createDart(20, 3), createDart(20, 3)], // 180
	[createDart(20, 3), createDart(19, 3), createDart(12, 2)] // 141 checkout
];
const MISS = [createDart(0, 0)];

interface SimulationResult {
	state: MatchState;
	/** firstThrowerIndex per leg, in leg order */
	firstThrowers: number[];
	/** "set-leg" keys in the order legs were played */
	legKeys: string[];
}

function playMatch(legWinners: string[], playerIds: string[]): SimulationResult {
	let state = createMatchState(
		'sim',
		{ startingScore: 501, legsPerSet: 3, setsPerMatch: 3, doubleIn: false },
		playerIds.map((id) => ({ id, name: id }))
	);

	const firstThrowers: number[] = [];
	const legKeys: string[] = [];
	let legIndex = 0;
	let throwsThisLeg = 0;
	let currentKey = `${state.currentLeg.setNumber}-${state.currentLeg.legNumber}`;
	legKeys.push(currentKey);
	firstThrowers.push(state.currentLeg.firstThrowerIndex);

	let guard = 0;
	while (state.status === 'in_progress' && guard++ < 500) {
		const key = `${state.currentLeg.setNumber}-${state.currentLeg.legNumber}`;
		if (key !== currentKey) {
			currentKey = key;
			legKeys.push(key);
			firstThrowers.push(state.currentLeg.firstThrowerIndex);
			throwsThisLeg = 0;
			legIndex++;
		}

		const currentId = state.players[state.currentLeg.currentPlayerIndex].id;
		if (currentId === legWinners[legIndex]) {
			state = submitTurn(state, CHECKOUT_SEQ[throwsThisLeg]);
			throwsThisLeg++;
		} else {
			state = submitTurn(state, MISS);
		}
	}

	return { state, firstThrowers, legKeys };
}

describe('full match simulation (501, best-of-3 legs, best-of-3 sets)', () => {
	it('Alice wins the match 2 sets to 1 across 6 legs', () => {
		// Set 1: Alice 2-0 · Set 2: Bob 2-0 · Set 3: Alice 2-0
		const { state, legKeys } = playMatch(
			['alice', 'alice', 'bob', 'bob', 'alice', 'alice'],
			['alice', 'bob']
		);

		expect(state.status).toBe('completed');
		expect(state.winnerId).toBe('alice');
		expect(state.players[0].setsWon).toBe(2);
		expect(state.players[1].setsWon).toBe(1);
		expect(legKeys).toEqual(['1-1', '1-2', '2-1', '2-2', '3-1', '3-2']);
	});

	it('alternates the first thrower every leg', () => {
		const { firstThrowers } = playMatch(
			['alice', 'alice', 'bob', 'bob', 'alice', 'alice'],
			['alice', 'bob']
		);
		expect(firstThrowers).toEqual([0, 1, 0, 1, 0, 1]);
	});

	it('Bob can win when the script favors him', () => {
		// Set 1: Alice 2-1 · Set 2: Bob 2-0 · Set 3: Bob 2-1 → Bob 2-1
		const { state } = playMatch(
			['bob', 'alice', 'alice', 'bob', 'bob', 'alice', 'bob', 'bob'],
			['alice', 'bob']
		);
		expect(state.status).toBe('completed');
		expect(state.winnerId).toBe('bob');
		expect(state.players[1].setsWon).toBe(2);
		expect(state.players[0].setsWon).toBe(1);
	});

	it('every checkout ends on a double and scores exactly to 0', () => {
		let state = createMatchState(
			'sim-single',
			{ startingScore: 501, legsPerSet: 1, setsPerMatch: 1, doubleIn: false },
			[
				{ id: 'alice', name: 'Alice' },
				{ id: 'bob', name: 'Bob' }
			]
		);

		state = submitTurn(state, CHECKOUT_SEQ[0]); // Alice 321
		state = submitTurn(state, MISS); // Bob
		state = submitTurn(state, CHECKOUT_SEQ[1]); // Alice 141
		state = submitTurn(state, MISS); // Bob
		state = submitTurn(state, CHECKOUT_SEQ[2]); // Alice 141 → checkout

		const lastTurn = state.currentLeg.turns[state.currentLeg.turns.length - 1];
		expect(lastTurn.remainingScore).toBe(0);
		expect(lastTurn.isBust).toBe(false);
		expect(lastTurn.totalScore).toBe(141);
		const lastDart = lastTurn.darts[lastTurn.darts.length - 1];
		expect(lastDart.multiplier).toBe(2); // D12
		expect(lastDart.score).toBe(24);

		expect(state.status).toBe('completed');
		expect(state.winnerId).toBe('alice');
	});

	it('a checkout on the very first visit of a leg works', () => {
		// 301 start: 180 + 121-checkout (T20 T17 D... 121 = T20(60) T7(21) D20(40) = 121)
		let state = createMatchState(
			'sim-quick',
			{ startingScore: 301, legsPerSet: 1, setsPerMatch: 1, doubleIn: false },
			[
				{ id: 'alice', name: 'Alice' },
				{ id: 'bob', name: 'Bob' }
			]
		);

		state = submitTurn(state, [createDart(20, 3), createDart(20, 3), createDart(20, 3)]); // 121
		state = submitTurn(state, MISS); // Bob
		state = submitTurn(state, [createDart(20, 3), createDart(7, 3), createDart(20, 2)]); // 60+21+40 = 121 ✓

		expect(state.status).toBe('completed');
		expect(state.winnerId).toBe('alice');
	});
});
