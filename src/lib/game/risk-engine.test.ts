import { describe, expect, it } from 'vitest';
import { createGame } from './risk-engine';

describe('Risk 42 — the Deal (M1.1)', () => {
    it('deals all 40 boxes equally with 2 armies each (2 players)', () => {
        const g = createGame(['alice', 'bob'], { seed: 1 });

        expect(g.boxes).toHaveLength(40);
        expect(g.boxes.filter((b) => b.owner === 'alice')).toHaveLength(20);
        expect(g.boxes.filter((b) => b.owner === 'bob')).toHaveLength(20);
        expect(g.boxes.filter((b) => b.owner !== null).every((b) => b.armies === 2)).toBe(true);
        // every box knows what it is: territory, wedge number, ring, continent
        expect(g.boxes.filter((b) => b.territory === 'Iceland')).toEqual([
            expect.objectContaining({ number: 5, ring: 'outer', continent: 'EU' }),
        ]);
    });

    it.each([
        [3, 13, 1],
        [4, 10, 0],
        [5, 8, 0],
        [6, 6, 4],
    ] as const)('roster of %i players → %i boxes each, %i blanks, all dealt boxes at 2 armies', (n, per, blanks) => {
        const g = createGame(Array.from({ length: n }, (_, i) => `p${i + 1}`), { seed: 7 });

        expect(g.boxes.filter((b) => b.owner !== null)).toHaveLength(n * per);
        expect(g.boxes.filter((b) => b.owner === null)).toHaveLength(blanks);
        expect(g.boxes.filter((b) => b.owner === null).every((b) => b.armies === 0)).toBe(true);
        for (const p of g.players) {
            expect(g.boxes.filter((b) => b.owner === p)).toHaveLength(per);
        }
    });

    it('same seed → identical deal; different seed → different deal', () => {
        const a = createGame(['alice', 'bob'], { seed: 99 });
        const b = createGame(['alice', 'bob'], { seed: 99 });
        const c = createGame(['alice', 'bob'], { seed: 100 });

        expect(b.boxes.map((x) => [x.id, x.owner])).toEqual(a.boxes.map((x) => [x.id, x.owner]));
        expect(c.boxes.map((x) => [x.id, x.owner])).not.toEqual(a.boxes.map((x) => [x.id, x.owner]));
    });

    it('starter is an input; the first turn starts with base budget and no charge', () => {
        const g = createGame(['alice', 'bob', 'carol'], { seed: 1, starterPlayerId: 'carol' });

        expect(g.turn.playerId).toBe('carol');
        expect(g.turn.dartsLeft).toBe(3);
        expect(g.turn.charge).toBe(0);
        expect(g.turn.index).toBe(1);
        expect(g.winner).toBeNull();
    });

    it('rejects bad rosters, bad starters, and clock without turns', () => {
        expect(() => createGame(['alone'], { seed: 1 })).toThrow();
        expect(() => createGame(['a', 'b', 'c', 'd', 'e', 'f', 'g'], { seed: 1 })).toThrow();
        expect(() => createGame(['a', 'b'], { seed: 1, starterPlayerId: 'zzz' })).toThrow();
        expect(() => createGame(['a', 'b'], { mode: 'clock' })).toThrow();
    });
});
