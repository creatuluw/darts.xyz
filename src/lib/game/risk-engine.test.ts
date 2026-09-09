import { describe, expect, it } from 'vitest';
import { applyDart, createGame } from './risk-engine';

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

describe('Risk 42 — deposits & mirror combat (M1.2)', () => {
    // arrange helper: fresh 2-player game with a controlled board
    const setup = () => {
        const g = createGame(['a', 'b'], { seed: 42 });
        const me = g.turn.playerId; // starter
        const box = (id: string) => {
            const b = g.boxes.find((x) => x.id === id);
            if (!b) throw new Error('no box ' + id);
            return b;
        };
        return { g, me, box };
    };

    it('a single deposits +1 into the exact box it lands in', () => {
        const { g, me, box } = setup();
        box('20-inner').owner = me; box('20-inner').armies = 3;

        applyDart(g, { segment: 20, multiplier: 1, singleRing: 'inner' });

        expect(box('20-inner').armies).toBe(4);
        expect(g.turn.dartsLeft).toBe(2);
    });

    it.each([20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5])(
        'wedge %i: treble feeds the inner box (+2), double feeds the outer box (+2)',
        (n) => {
            const { g, me, box } = setup();
            box(`${n}-inner`).owner = me; box(`${n}-inner`).armies = 5;
            box(`${n}-outer`).owner = me; box(`${n}-outer`).armies = 5;

            applyDart(g, { segment: n, multiplier: 3 });
            expect(box(`${n}-inner`).armies).toBe(7);
            expect(box(`${n}-outer`).armies).toBe(5);

            applyDart(g, { segment: n, multiplier: 2 });
            expect(box(`${n}-outer`).armies).toBe(7);
            expect(box(`${n}-inner`).armies).toBe(7);
        },
    );

    it('claims blank land: single founds with 1, ring founds its fed box with 2', () => {
        const { g, me, box } = setup();
        box('5-outer').owner = null; box('5-outer').armies = 0;
        box('5-inner').owner = null; box('5-inner').armies = 0;

        applyDart(g, { segment: 5, multiplier: 1, singleRing: 'outer' });
        expect(box('5-outer')).toMatchObject({ owner: me, armies: 1 });

        applyDart(g, { segment: 5, multiplier: 3 });
        expect(box('5-inner')).toMatchObject({ owner: me, armies: 2 });
    });

    it('mirror damage: enemy box loses the dart value; at 0 it flips to the attacker with 1 army', () => {
        const { g, me, box } = setup();
        const foe = g.players.find((p) => p !== me)!;
        box('3-outer').owner = foe; box('3-outer').armies = 2;

        applyDart(g, { segment: 3, multiplier: 2 }); // -2 → 0 → flip
        expect(box('3-outer')).toMatchObject({ owner: me, armies: 1 });

        box('3-inner').owner = foe; box('3-inner').armies = 5;
        applyDart(g, { segment: 3, multiplier: 3 }); // -2 → 3, no flip
        expect(box('3-inner')).toMatchObject({ owner: foe, armies: 3 });
    });

    it('overkill is wasted: a treble into a 1-army box flips it at 1, excess evaporates', () => {
        const { g, me, box } = setup();
        const foe = g.players.find((p) => p !== me)!;
        box('11-inner').owner = foe; box('11-inner').armies = 1;

        applyDart(g, { segment: 11, multiplier: 3 });
        expect(box('11-inner')).toMatchObject({ owner: me, armies: 1 });
    });

    it('mid-turn chains: capture, then reinforce your new conquest', () => {
        const { g, me, box } = setup();
        const foe = g.players.find((p) => p !== me)!;
        box('6-inner').owner = foe; box('6-inner').armies = 2;

        applyDart(g, { segment: 6, multiplier: 3 }); // capture → mine at 1
        applyDart(g, { segment: 6, multiplier: 1, singleRing: 'inner' }); // reinforce
        expect(box('6-inner')).toMatchObject({ owner: me, armies: 2 });
        expect(g.turn.dartsLeft).toBe(1);
    });

    it('reinforcement is uncapped', () => {
        const { g, me, box } = setup();
        box('12-inner').owner = me; box('12-inner').armies = 99;

        applyDart(g, { segment: 12, multiplier: 1, singleRing: 'inner' });
        expect(box('12-inner').armies).toBe(100);
    });
});
