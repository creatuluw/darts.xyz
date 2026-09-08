import { describe, it, expect } from 'vitest';
import { createConquestMatch, type ConquestState } from './conquest-engine';
import { curatedOptions, type ConquestOption } from './conquest-options';

const P = [
	{ id: 'a', name: 'Ada' },
	{ id: 'b', name: 'Ben' },
	{ id: 'c', name: 'Cal' }
];

function newMatch(): ConquestState {
	return createConquestMatch({ mode: 'clock', preset: 301, players: P });
}

/** Own a wedge: patch territory ownership directly. */
function own(s: ConquestState, player: string, wedge: number, hp = 3) {
	s.territories[wedge] = { owner: player, hp };
}

function optionsFor(
	out: ReturnType<typeof curatedOptions>,
	playerId: string
): ConquestOption[] {
	return out.find((x) => x.playerId === playerId)?.options ?? [];
}

describe('curatedOptions', () => {
	it('fresh match: every alive player gets only found options', () => {
		const out = curatedOptions(newMatch(), () => 0);
		for (const p of P) {
			const opts = optionsFor(out, p.id);
			expect(opts.length).toBeGreaterThanOrEqual(1);
			expect(opts.length).toBeLessThanOrEqual(2);
			for (const o of opts) expect(o.kind).toBe('found');
		}
	});

	it('kill-shot: capturing a player\u2019s last territory is ranked top', () => {
		const s = newMatch();
		own(s, 'b', 7, 1); // b's only territory — killing blow available
		own(s, 'c', 13, 1);
		own(s, 'c', 10, 3);
		const out = curatedOptions(s, () => 0);
		const a = optionsFor(out, 'a');
		expect(a[0].kind).toBe('capture');
		expect(a[0].wedge).toBe(7);
		expect(a[0].kills).toBe(true);
	});

	it('leader-attack: the score leader\u2019s wedge outranks an equal non-leader wedge', () => {
		const s = newMatch();
		own(s, 'a', 20, 2); // a leads 3–2–1 and holds a soft wedge
		own(s, 'a', 12, 3);
		own(s, 'a', 18, 3);
		own(s, 'b', 5, 3);
		own(s, 'c', 16, 3);
		own(s, 'c', 11, 3);
		const out = curatedOptions(s, () => 0);
		const b = optionsFor(out, 'b');
		expect(b[0].kind).toBe('capture');
		expect(b[0].wedge).toBe(20);
		expect(b[0].leader).toBe(true);
	});

	it('continent-deny: blocking a near-complete continent is flagged', () => {
		const s = newMatch();
		// Gold Coast = [20,18,12] — c owns 20+18, a holds the missing 12
		own(s, 'c', 20, 3);
		own(s, 'c', 18, 3);
		own(s, 'a', 12, 3);
		own(s, 'a', 17, 3);
		const out = curatedOptions(s, () => 0);
		const b = optionsFor(out, 'b');
		expect(b[0].wedge).toBe(12);
		expect(b[0].deny).toBe(true);
	});

	it('reinforce surfaces when captures carry no drama', () => {
		const s = newMatch();
		own(s, 'a', 20, 1); // a's weak own wedge
		own(s, 'a', 12, 3);
		own(s, 'b', 5, 3); // b's sturdy wedge: plain capture
		own(s, 'b', 9, 3);
		const out = curatedOptions(s, () => 0);
		const a = optionsFor(out, 'a');
		// not a leader-bonus capture target? b owns 2, a owns 2 → a co-leads,
		// so b's wedges get leader bonus for a? a=2terr score, b=2 — tie means
		// neither is *the* leader; reinforce must still beat the plain capture
		expect(a.some((o) => o.kind === 'reinforce' && o.wedge === 20)).toBe(true);
	});

	it('dead players get the bull option', () => {
		const s = newMatch();
		own(s, 'b', 20, 3);
		own(s, 'c', 12, 3);
		s.players[0].dead = true; // Ada died
		const out = curatedOptions(s, () => 0);
		const a = optionsFor(out, 'a');
		expect(a).toHaveLength(1);
		expect(a[0].kind).toBe('bull');
	});

	it('finished phase yields no options', () => {
		const s = newMatch();
		s.phase = 'finished';
		s.winner = 'a';
		const out = curatedOptions(s, () => 0);
		expect(out.every((x) => x.options.length === 0)).toBe(true);
	});

	it('deterministic: same state + same rand sequence → same output', () => {
		const s = newMatch();
		own(s, 'a', 20, 2);
		own(s, 'b', 5, 1);
		own(s, 'c', 12, 3);
		let seed = 42;
		const rand = () => {
			seed = (seed * 1103515245 + 12345) % 2147483648;
			return seed / 2147483648;
		};
		const first = curatedOptions(s, rand);
		seed = 42;
		const second = curatedOptions(s, rand);
		expect(first).toEqual(second);
	});
});
