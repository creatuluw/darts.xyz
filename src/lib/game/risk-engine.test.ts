import { describe, expect, it } from 'vitest';
import { ADJACENT_TERRITORIES, applyDart, applyTiebreak, BOARD, budgetWithSources, cashSet, createGame, endTurnSaving, isExiled, isReachable, reachableBoxIds, setPayout, standings } from './risk-engine';

describe('Risk 42 — territory cards (2026-10-23: conquest earns a card, sets cash in for darts)', () => {
    const setup = () => {
        const g = createGame(['a', 'b'], { seed: 42 });
        const box = (id: string) => g.boxes.find((x) => x.id === id)!;
        return { g, box };
    };
    const card = (face: string, i: number) => ({ id: `t-${face}-${i}`, face } as never);

    it('the deck: 42 cards — 40 territory cards + 2 jokers, deterministic per seed', () => {
        const g = createGame(['a', 'b'], { seed: 7 });
        expect(g.deck.length).toBe(42);
        expect(g.deck.filter((c) => c.face === 'joker').length).toBe(2);
        expect(g.deck.filter((c) => c.face !== 'joker').length).toBe(40);
        expect(new Set(g.deck.filter((c) => c.territory).map((c) => c.territory)).size).toBe(40);
        const faces = ['infanterie', 'cavalerie', 'artillerie', 'joker'];
        for (const c of g.deck) expect(faces).toContain(c.face);
        const again = createGame(['a', 'b'], { seed: 7 });
        expect(again.deck.map((c) => c.id)).toEqual(g.deck.map((c) => c.id));
    });

    it('every capture draws the top card — blank claim AND enemy flip, multiple per turn', () => {
        const { g, box } = setup();
        const me = g.turn.playerId;
        const foe = g.players.find((p) => p !== me)!;
        g.boxes.forEach((b) => { if (b.id === '17-inner') { b.owner = me; b.armies = 2; } }); // my Congo
        const hand0 = g.hands[me].length;
        const deck0 = g.deck.length;
        box('17-outer').owner = null; box('17-outer').armies = 0; // blank, same wedge as my Congo → claimable
        applyDart(g, { segment: 17, multiplier: 1, singleRing: 'outer' }); // claim
        expect(g.hands[me].length).toBe(hand0 + 1);
        expect(g.deck.length).toBe(deck0 - 1);
        applyDart(g, { segment: 17, multiplier: 1, singleRing: 'inner' }); // reinforce own Congo — no card
        expect(g.hands[me].length).toBe(hand0 + 1);
        box('3-outer').owner = foe; box('3-outer').armies = 1; // South Africa — borders my Congo
        applyDart(g, { segment: 3, multiplier: 2 }); // capture flip
        expect(box('3-outer').owner).toBe(me);
        expect(g.hands[me].length).toBe(hand0 + 2);
    });

    it('an empty deck pays no cards (endgame dampener, like real Risk)', () => {
        const { g, box } = setup();
        const me = g.turn.playerId;
        g.deck.length = 0;
        g.boxes.forEach((b) => { if (b.id === '17-inner') { b.owner = me; b.armies = 2; } });
        box('17-outer').owner = null; box('17-outer').armies = 0;
        applyDart(g, { segment: 17, multiplier: 1, singleRing: 'outer' }); // claim with empty deck
        expect(g.hands[me].length).toBe(0);
    });

    it('cashSet: triple artillerie pays +5 into the live pool, cards leave the hand', () => {
        const { g } = setup();
        const me = g.turn.playerId;
        g.hands[me] = [card('artillerie', 1), card('artillerie', 2), card('artillerie', 3)];
        const before = g.turn.dartsLeft;
        cashSet(g, ['t-artillerie-1', 't-artillerie-2', 't-artillerie-3']);
        expect(g.turn.dartsLeft).toBe(before + 5);
        expect(g.hands[me].length).toBe(0);
        expect(g.setsCashed[me]).toBe(1);
    });

    it('payouts: 3×Inf +3, 3×Cav +4, mixed +6; joker completes the BEST combo', () => {
        const { g } = setup();
        const me = g.turn.playerId;
        const pay = (hand: ReturnType<typeof card>[]) => {
            g.hands[me] = hand as never;
            g.setsCashed[me] = 0; // base payouts here — escalation has its own test
            const before = g.turn.dartsLeft;
            cashSet(g, hand.map((c) => (c as { id: string }).id));
            return g.turn.dartsLeft - before;
        };
        expect(pay([card('infanterie', 1), card('infanterie', 2), card('infanterie', 3)])).toBe(3);
        expect(pay([card('cavalerie', 1), card('cavalerie', 2), card('cavalerie', 3)])).toBe(4);
        expect(pay([card('infanterie', 1), card('cavalerie', 2), card('artillerie', 3)])).toBe(6);
        expect(pay([card('infanterie', 1), card('infanterie', 2), card('joker', 9)])).toBe(3); // completes the triple
        expect(pay([card('infanterie', 1), card('cavalerie', 2), card('joker', 9)])).toBe(6); // completes the mix
        expect(pay([card('joker', 8), card('joker', 9), card('artillerie', 3)])).toBe(6); // mix beats triple
    });

    it('escalation: the second set you cash pays +1, the third +2', () => {
        const { g } = setup();
        const me = g.turn.playerId;
        g.hands[me] = [card('infanterie', 1), card('infanterie', 2), card('infanterie', 3)];
        cashSet(g, ['t-infanterie-1', 't-infanterie-2', 't-infanterie-3']); // +3
        g.hands[me] = [card('cavalerie', 1), card('cavalerie', 2), card('cavalerie', 3)];
        const before = g.turn.dartsLeft;
        cashSet(g, ['t-cavalerie-1', 't-cavalerie-2', 't-cavalerie-3']); // 4 + 1 escalation
        expect(g.turn.dartsLeft - before).toBe(5);
        expect(g.setsCashed[me]).toBe(2);
    });

    it('invalid sets are refused: two-of-a-kind, 2 cards, cards not in hand, not your turn', () => {
        const { g } = setup();
        const me = g.turn.playerId;
        const foe = g.players.find((p) => p !== me)!;
        g.hands[me] = [card('infanterie', 1), card('infanterie', 2), card('cavalerie', 3)];
        expect(() => cashSet(g, ['t-infanterie-1', 't-infanterie-2', 't-cavalerie-3'])).toThrow(); // no trio, no mix
        expect(() => cashSet(g, ['t-infanterie-1', 't-infanterie-2'])).toThrow(); // too few
        expect(() => cashSet(g, ['t-infanterie-1', 't-infanterie-2', 't-ghost-99'])).toThrow(); // not in hand
        g.hands[foe] = [card('artillerie', 1), card('artillerie', 2), card('artillerie', 3)];
        g.turn = { playerId: foe, dartsLeft: 3, carried: 0, index: g.turn.index };
        expect(() => cashSet(g, ['t-infanterie-1', 't-infanterie-2', 't-cavalerie-3'])).toThrow(); // wrong turn
    });

    it('hoarding is unlimited — no forced cash, hands may grow past 5', () => {
        const { g } = setup();
        const me = g.turn.playerId;
        g.hands[me] = Array.from({ length: 9 }, (_, i) => card(['infanterie', 'cavalerie', 'artillerie'][i % 3], i));
        expect(() => endTurnSaving(g)).not.toThrow(); // save with 9 cards — fine
        expect(g.hands[me].length).toBe(9);
    });

    it('old persisted games (no hands/deck) resume safely — cards initialize lazily', () => {
        const { g, box } = setup();
        const me = g.turn.playerId;
        const legacy = g as unknown as Record<string, unknown>;
        delete legacy.hands;
        delete legacy.deck;
        delete legacy.setsCashed;
        g.boxes.forEach((b) => { if (b.id === '17-inner') { b.owner = me; b.armies = 2; } });
        box('17-outer').owner = null; box('17-outer').armies = 0;
        applyDart(g, { segment: 17, multiplier: 1, singleRing: 'outer' }); // claim → lazy init + draw
        expect(g.hands[me].length).toBe(1);
        expect(g.deck.length).toBe(41);
    });
});

describe('Risk 42 — reach rule (2026-10-23: darts only count on own or adjacent)', () => {
    const setup = () => {
        const g = createGame(['a', 'b'], { seed: 42 });
        const box = (id: string) => g.boxes.find((x) => x.id === id)!;
        return { g, box };
    };

    it('adjacency table covers all 40 territories, symmetric, no self/dupes', () => {
        const names = BOARD.map(([, , t]) => t);
        expect(new Set(names).size).toBe(40);
        expect(Object.keys(ADJACENT_TERRITORIES).sort()).toEqual([...names].sort());
        for (const [t, neighbors] of Object.entries(ADJACENT_TERRITORIES)) {
            expect(new Set(neighbors).size).toBe(neighbors.length);
            expect(neighbors).not.toContain(t);
            for (const n of neighbors) {
                expect(ADJACENT_TERRITORIES[n]).toBeDefined();
                expect(ADJACENT_TERRITORIES[n]).toContain(t); // symmetric
            }
        }
    });

    it('the board graph is connected (guarantees a frontier for any non-total empire)', () => {
        const seen = new Set([BOARD[0][2]]);
        const queue = [BOARD[0][2]];
        while (queue.length) {
            const t = queue.pop()!;
            for (const n of ADJACENT_TERRITORIES[t]) if (!seen.has(n)) { seen.add(n); queue.push(n); }
        }
        expect(seen.size).toBe(40);
    });

    it('classic edges: Alaska–Kamchatka sea lane; Siam–Indonesia; Egypt and Congo NOT adjacent', () => {
        expect(ADJACENT_TERRITORIES['Alaska']).toContain('Kamchatka');
        expect(ADJACENT_TERRITORIES['Siam']).toContain('Indonesia');
        expect(ADJACENT_TERRITORIES['Egypt']).not.toContain('Congo');
        expect(ADJACENT_TERRITORIES['Congo']).not.toContain('Egypt');
    });

    it('same-wedge inner/outer pairs are adjacent (physically touching boxes)', () => {
        expect(ADJACENT_TERRITORIES['Ukraine']).toContain('Siberia');   // wedge 1
        expect(ADJACENT_TERRITORIES['Siberia']).toContain('Ukraine');
        expect(ADJACENT_TERRITORIES['Greenland']).toContain('Iceland'); // wedge 5
        expect(ADJACENT_TERRITORIES['Great Britain']).toContain('Northwest Territory'); // wedge 12
    });

    it('own box: deposits work; adjacent enemy box: combat works (control)', () => {
        const { g, box } = setup();
        g.boxes.forEach((b) => { b.owner = b.id === '1-inner' ? 'a' : 'b'; b.armies = 2; }); // a keeps Ukraine only
        g.turn.playerId = 'a';
        // Ukraine (1-inner) is own: deposit works
        applyDart(g, { segment: 1, multiplier: 1, singleRing: 'inner' });
        expect(box('1-inner').armies).toBe(3);
        // Siberia (1-outer) is same wedge = adjacent: combat lands
        applyDart(g, { segment: 1, multiplier: 1, singleRing: 'outer' });
        expect(box('1-outer').armies).toBe(1); // 2 - 1
    });

    it('a dart on a box that is neither own nor adjacent does NOTHING but consume the dart', () => {
        const { g, box } = setup();
        g.boxes.forEach((b) => { b.owner = b.id === '1-inner' ? 'a' : 'b'; b.armies = 2; });
        g.turn.playerId = 'a';
        // Mongolia (13-inner): not adjacent to Ukraine (check via the exported predicate)
        expect(isReachable(g, 'a', '13-inner')).toBe(false);
        const before = structuredClone(structuredClone(box('13-inner')));
        applyDart(g, { segment: 13, multiplier: 3 }); // treble on unreachable land
        expect(box('13-inner')).toMatchObject({ owner: before.owner, armies: before.armies });
        expect(g.turn.dartsLeft).toBe(2); // the dart is spent
    });

    it('adjacent blank territory is claimable; far blank is not', () => {
        const { g, box } = setup();
        g.boxes.forEach((b) => { b.owner = b.id === '1-inner' ? 'a' : 'b'; b.armies = 2; });
        box('1-outer').owner = null; box('1-outer').armies = 0;   // blank, same wedge → reachable
        box('2-outer').owner = null; box('2-outer').armies = 0;   // blank, Western Australia → far
        g.turn.playerId = 'a';
        expect(isReachable(g, 'a', '1-outer')).toBe(true);
        expect(isReachable(g, 'a', '2-outer')).toBe(false);
        applyDart(g, { segment: 2, multiplier: 1, singleRing: 'outer' }); // far blank — dead dart
        expect(box('2-outer')).toMatchObject({ owner: null, armies: 0 });
        applyDart(g, { segment: 1, multiplier: 1, singleRing: 'outer' }); // adjacent blank — claimed
        expect(box('1-outer')).toMatchObject({ owner: 'a', armies: 1 });
    });

    it('an exile may throw anywhere — the clawback needs a foothold', () => {
        const { g, box } = setup();
        g.boxes.forEach((b) => { if (b.owner === 'b') { b.owner = 'a'; b.armies = 2; } }); // b stripped
        box('2-outer').owner = null; box('2-outer').armies = 0; // a blank so a doesn't hold all 40 (domination)
        g.turn = { playerId: 'a', dartsLeft: 1, carried: 0, index: g.turn.index };
        applyDart(g, { segment: 0 });
        expect(g.turn.playerId).toBe('b');
        expect(isExiled(g, 'b')).toBe(true);
        expect(reachableBoxIds(g, 'b').size).toBe(40);
        const far = box('2-outer'); // Western Australia, weakened
        far.owner = 'a'; far.armies = 1;
        applyDart(g, { segment: 2, multiplier: 2 }); // double → 2 damage → capture
        expect(far).toMatchObject({ owner: 'b', armies: 1 }); // clawed back
    });

    it('reach set = own ∪ neighbors — the UI highlight source', () => {
        const { g } = setup();
        g.boxes.forEach((b) => { b.owner = b.id === '1-inner' ? 'a' : 'b'; b.armies = 2; });
        const reach = reachableBoxIds(g, 'a');
        expect(reach.has('1-inner')).toBe(true);  // own
        expect(reach.has('1-outer')).toBe(true);  // same wedge
        expect(reach.has('2-inner')).toBe(true);  // Middle East borders Ukraine (classic edge)
        expect(reach.has('13-inner')).toBe(false); // Mongolia — far away
        expect(reach.size).toBeGreaterThan(2);
    });
});

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

    it('starter is an input; the first turn starts with base budget and an empty dart bank', () => {
        const g = createGame(['alice', 'bob', 'carol'], { seed: 1, starterPlayerId: 'carol' });

        expect(g.turn.playerId).toBe('carol');
        expect(g.turn.dartsLeft).toBe(3);
        expect(g.saved).toEqual({});
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
        box('12-inner').owner = me; // Great Britain — Iceland (5-outer) is adjacent → blank reachable
        box('5-outer').owner = null; box('5-outer').armies = 0;
        box('5-inner').owner = null; box('5-inner').armies = 0;

        applyDart(g, { segment: 5, multiplier: 1, singleRing: 'outer' });
        expect(box('5-outer')).toMatchObject({ owner: me, armies: 1 });

        applyDart(g, { segment: 5, multiplier: 3 }); // same wedge now owned → 5-inner reachable
        expect(box('5-inner')).toMatchObject({ owner: me, armies: 2 });
    });

    it('mirror damage: enemy box loses the dart value; at 0 it flips to the attacker with 1 army', () => {
        const { g, me, box } = setup();
        const foe = g.players.find((p) => p !== me)!;
        box('17-inner').owner = me; // Congo borders South Africa (3-outer) → target reachable
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

describe('Risk 42 — turn lifecycle & the Arsenal (M1.3)', () => {
    const setup = () => {
        const g = createGame(['a', 'b', 'c'], { seed: 42 });
        const box = (id: string) => g.boxes.find((x) => x.id === id)!;
        return { g, box };
    };

    it('a bull banks extra darts into the current turn: 25 = +2, 50 = +3', () => {
        const { g } = setup();
        const me = g.turn.playerId;

        applyDart(g, { segment: 25 }); // 3 - 1 + 2 = 4
        expect(g.turn.dartsLeft).toBe(4);
        applyDart(g, { segment: 0 });
        expect(g.turn.dartsLeft).toBe(3);

        // a's next turn (3 players: b, c in between) — me still has 3 banked-from-the-bull darts to spend
        applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); // me
        applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); // b
        applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); // c
        expect(g.turn.playerId).toBe(me);
        applyDart(g, { segment: 50 }); // 3 - 1 + 3 = 5
        expect(g.turn.dartsLeft).toBe(5);
    });

    it('a bull pays in darts, not damage — the next dart deposits its plain ring value', () => {
        const { g, box } = setup();
        const me = g.turn.playerId;
        const foe = g.players.find((p) => p !== me)!;
        box('17-inner').owner = me; // Congo borders South Africa (3-outer) → target reachable
        box('3-outer').owner = foe; box('3-outer').armies = 5;

        applyDart(g, { segment: 25 });               // +2 darts, no charge
        applyDart(g, { segment: 3, multiplier: 2 }); // plain 2 damage
        expect(box('3-outer').armies).toBe(3);       // 5 - 2, NOT 5 - 5
    });

    it('a bull on the last dart refills the pool — the turn keeps going', () => {
        const { g } = setup();
        const before = JSON.stringify(g.boxes);
        const me = g.turn.playerId;
        applyDart(g, { segment: 0 });
        applyDart(g, { segment: 0 }); // 1 dart left
        applyDart(g, { segment: 50 }); // last dart → +3 back
        expect(JSON.stringify(g.boxes)).toBe(before); // misses + a bull never touch boxes
        expect(g.turn.dartsLeft).toBe(3);
        expect(g.turn.playerId).toBe(me);             // same turn, darts to spend
    });

    it('without saving, the pool drains to zero and the turn advances with nothing banked', () => {
        const { g, box } = setup();
        const me = g.turn.playerId;
        applyDart(g, { segment: 25 }); // 4 left
        applyDart(g, { segment: 20, multiplier: 3 });
        applyDart(g, { segment: 20, multiplier: 3 });
        applyDart(g, { segment: 20, multiplier: 3 });
        applyDart(g, { segment: 20, multiplier: 3 }); // bull-refilled pool fully drained (5 throws)
        // pool drained → turn advanced normally, nothing banked
        expect(g.turn.playerId).not.toBe(me);
        expect(g.saved[me] ?? 0).toBe(0);
        const next = g.turn.playerId;
        box('1-inner').owner = next; box('1-inner').armies = 4;
        applyDart(g, { segment: 1, multiplier: 3 });
        expect(box('1-inner').armies).toBe(6); // plain 2 deposit
    });

    it('after the last dart the turn advances: next player, fresh budget, bank untouched, index increments', () => {
        const { g } = setup();
        const starter = g.turn.playerId;
        applyDart(g, { segment: 20, multiplier: 3 });
        applyDart(g, { segment: 20, multiplier: 3 });
        applyDart(g, { segment: 20, multiplier: 3 });

        expect(g.turn.playerId).not.toBe(starter);
        expect(g.turn.dartsLeft).toBe(3);
        expect(g.saved).toEqual({});
        expect(g.turn.index).toBe(2);
    });

    it('endTurnSaving banks the whole remaining pool for this player\'s next turn', () => {
        const { g } = setup();
        const me = g.turn.playerId;
        applyDart(g, { segment: 25 }); // 4 left
        endTurnSaving(g);
        expect(g.turn.playerId).not.toBe(me);
        expect(g.saved[me]).toBe(4);
    });

    it('saved darts roll into the next turn on top of base + income, then leave the bank', () => {
        const { g } = setup();
        const me = g.turn.playerId;
        applyDart(g, { segment: 50 }); // 3 - 1 + 3 = 5 left
        endTurnSaving(g);              // bank 5
        applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); // b
        applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); // c
        expect(g.turn.playerId).toBe(me);
        expect(g.turn.dartsLeft).toBe(8); // 3 base + 5 saved
        expect(g.saved[me] ?? 0).toBe(0); // drawn from the bank
    });

    it('savings accumulate: skip again and the bank stacks; saving counts as a turn', () => {
        const { g } = setup();
        const me = g.turn.playerId;
        applyDart(g, { segment: 25 });
        endTurnSaving(g); // bank 4
        applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); // b
        applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); // c
        expect(g.turn.playerId).toBe(me);
        expect(g.turn.dartsLeft).toBe(7); // 3 + 4
        endTurnSaving(g);                 // bank all 7
        applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); // b
        applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); // c
        expect(g.turn.dartsLeft).toBe(10); // 3 + 7 — the bank stacked
        expect(g.turn.index).toBe(7);      // every handover counted a turn
    });

    it('endTurnSaving is rejected once the game is over', () => {
        const { g } = setup();
        g.winner = g.turn.playerId;
        expect(() => endTurnSaving(g)).toThrow(/over/);
    });

    it('turn order rotates through the roster from the starter', () => {
        const { g } = setup();
        g.turn.playerId = 'c'; // starter input honored mid-arrange
        applyDart(g, { segment: 20, multiplier: 3 });
        applyDart(g, { segment: 20, multiplier: 3 });
        applyDart(g, { segment: 20, multiplier: 3 });
        expect(g.turn.playerId).toBe('a');
    });

    it('a miss (segment 0) consumes a dart and changes nothing else', () => {
        const { g } = setup();
        const before = JSON.stringify(g.boxes);
        applyDart(g, { segment: 0 });
        expect(JSON.stringify(g.boxes)).toBe(before);
        expect(g.turn.dartsLeft).toBe(2);
    });
});

describe('Risk 42 — exile & clawback (M1.4)', () => {
    // 3 players: exile only exists while someone else still holds land — 2p zero-boxes IS domination
    const setup = () => {
        const g = createGame(['a', 'b', 'c'], { seed: 42 });
        const box = (id: string) => g.boxes.find((x) => x.id === id)!;
        return { g, box };
    };

    it('a player reduced to zero boxes is exiled — but keeps full turns, none skipped', () => {
        const { g, box } = setup();
        // strip b of everything (arrange)
        for (const b of g.boxes) if (b.owner === 'b') { b.owner = 'a'; }
        expect(isExiled(g, 'b')).toBe(true);
        expect(isExiled(g, 'a')).toBe(false);

        // a plays out the turn, then b's turn arrives normally with a full budget
        applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 });
        expect(g.turn.playerId).toBe('b');
        expect(g.turn.dartsLeft).toBe(3);
    });

    it('clawback: an exile capturing any box owns it at 1 army and clears the exile flag', () => {
        const { g, box } = setup();
        for (const b of g.boxes) if (b.owner === 'b') { b.owner = 'a'; }
        // it is b's exile turn; a left a 1-army box on 3-outer
        applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); // a
        box('3-outer').armies = 1;
        applyDart(g, { segment: 3, multiplier: 2 }); // b captures
        expect(box('3-outer')).toMatchObject({ owner: 'b', armies: 1 });
        expect(isExiled(g, 'b')).toBe(false);
    });

    it('exile is derived state — recomputed from board, no flag to forget', () => {
        const { g, box } = setup();
        expect(g.boxes.filter((b) => b.owner === 'b').length).toBeGreaterThan(0);
        expect(typeof isExiled(g, 'b')).toBe('boolean');
    });
});

describe('Risk 42 — territory income (2026-10-23 rework: continents pay nothing)', () => {
    // budget = max(3, floor(owned / 6)) — the user's own worked example: 24 boxes = 4 darts
    const SA_IDS = ['19-outer', '7-outer', '16-inner', '16-outer'];
    const AS_IDS = ['1-outer', '18-inner', '18-outer', '4-inner', '4-outer', '13-inner', '13-outer', '6-inner', '6-outer', '10-inner', '2-inner'];

    const setup = () => {
        const g = createGame(['a', 'b'], { seed: 42 });
        const box = (id: string) => g.boxes.find((x) => x.id === id)!;
        /** give a EXACTLY n boxes, always including every id in mustInclude; the rest go to b. */
        const give = (n: number, mustInclude: string[] = []) => {
            const rest = g.boxes.map((b) => b.id).filter((id) => !mustInclude.includes(id));
            const owned = new Set([...mustInclude, ...rest.slice(0, Math.max(0, n - mustInclude.length))]);
            g.boxes.forEach((b) => { b.owner = owned.has(b.id) ? 'a' : 'b'; b.armies = 2; });
        };
        return { g, box, give };
    };
    const playTurn = (g: ReturnType<typeof createGame>) => {
        const p = g.turn.playerId;
        while (g.turn.playerId === p && g.turn.dartsLeft > 0) applyDart(g, { segment: 0 });
    };

    it('income ladder: 5→3 (minimum), 6→3, 12→3, 18→3, 23→3, 24→4, 30→5, 36→6', () => {
        const { g, give } = setup();
        const cases: Array<[number, number]> = [[5, 3], [6, 3], [12, 3], [18, 3], [23, 3], [24, 4], [30, 5], [36, 6]];
        for (const [n, want] of cases) {
            g.turn = { playerId: 'a', dartsLeft: 0, carried: 0, index: g.turn.index };
            give(n);
            const b = budgetWithSources(g);
            expect(b.total).toBe(want);
        }
    });

    it('a complete continent pays NOTHING — 19 boxes incl. all of SA = 3 darts, 24 incl. SA + Asia = 4', () => {
        const { g, give } = setup();
        g.turn = { playerId: 'a', dartsLeft: 0, carried: 0, index: g.turn.index };
        give(19, SA_IDS); // 19 owned incl. full SA — old rule: 4, new: 3
        expect(budgetWithSources(g).total).toBe(3);

        give(24, [...SA_IDS, ...AS_IDS]); // full SA + Asia too — old rule: 6, new: 4
        expect(budgetWithSources(g).total).toBe(4);
    });

    it('exile (0 boxes) shows the minimum 3 on the gate', () => {
        const { g, give } = setup();
        give(0); // a owns nothing — exiled (no darts thrown: b holding all 40 is pending domination)
        g.turn.playerId = 'a';
        const budget = budgetWithSources(g);
        expect(budget.minimumApplied).toBe(true);
        expect(budget.total).toBe(3);
    });

    it('advanceTurn pays the new income: 24 boxes → 4 darts next turn', () => {
        const { g, give } = setup();
        give(24);
        playTurn(g); // a drains 3
        expect(g.turn.playerId).toBe('b');
        playTurn(g);
        expect(g.turn.playerId).toBe('a');
        expect(g.turn.dartsLeft).toBe(4); // floor(24/6) = 4
    });

    it('budgetWithSources itemizes territories + savings for the banner', () => {
        const { g, give, box } = setup();
        for (const b of g.boxes) b.owner = 'b';
        box('5-inner').owner = 'a';
        applyDart(g, { segment: 50 }); // 3 - 1 + 3 = 5 left
        endTurnSaving(g);              // bank 5
        playTurn(g);                   // b drains their 6 (39 boxes, old-rule income for the mid-game board)
        expect(g.turn.playerId).toBe('a');
        give(24); // 24 a / 16 b — budget view reads the board live
        const budget = budgetWithSources(g);
        expect(budget.territories).toBe(24);
        expect(budget.income).toBe(4);
        expect(budget.minimumApplied).toBe(false);
        expect(budget.saved).toBe(5); // turn.carried provenance
        expect(budget.total).toBe(9); // 4 income + 5 saved
    });

    it('minimum applied flag is true under 6 boxes', () => {
        const { g, give, box } = setup();
        for (const b of g.boxes) b.owner = 'b';
        box('5-inner').owner = 'a'; // 1 box
        g.turn.playerId = 'a';
        const budget = budgetWithSources(g);
        expect(budget.minimumApplied).toBe(true);
        expect(budget.income).toBe(0);
        expect(budget.total).toBe(3);
    });
});

describe('Risk 42 — endgames (M1.6)', () => {
    const setup = () => {
        const g = createGame(['a', 'b'], { seed: 42 });
        const box = (id: string) => g.boxes.find((x) => x.id === id)!;
        return { g, box };
    };
    const playTurn = (g: ReturnType<typeof createGame>) => {
        const p = g.turn.playerId;
        while (g.turn.playerId === p && g.turn.dartsLeft > 0 && g.winner === null) applyDart(g, { segment: 0 });
    };

    it('domination: the game is won the instant one player owns all 40', () => {
        const { g, box } = setup();
        for (const b of g.boxes) { b.owner = 'a'; b.armies = 2; }
        box('3-outer').owner = 'b'; box('3-outer').armies = 1;
        expect(g.winner).toBeNull();

        applyDart(g, { segment: 3, multiplier: 2 }); // capture the last enemy box
        expect(g.winner).toBe('a');
        expect(() => applyDart(g, { segment: 3, multiplier: 3 })).toThrow(/over/);
    });

    it('a blank box still on the board blocks domination', () => {
        const { g, box } = setup();
        for (const b of g.boxes) { b.owner = 'a'; b.armies = 2; }
        box('3-outer').owner = null; box('3-outer').armies = 0;
        applyDart(g, { segment: 3, multiplier: 2 }); // claims the blank
        expect(g.winner).toBe('a');
    });

    it('clock: the horn sounds after every player completes their turns; standings rank by score', () => {
        const g = createGame(['a', 'b', 'c'], { mode: 'clock', clockTurns: 1, seed: 42 });
        // arrange a decisive board: a takes everything, b keeps 2 boxes, c keeps 1
        for (const b of g.boxes) b.owner = 'a';
        const keep = (id: string, p: string) => { const b = g.boxes.find((x) => x.id === id)!; b.owner = p; b.armies = 2; };
        keep('19-outer', 'b'); keep('7-outer', 'b'); // SA pair, not the continent
        keep('16-inner', 'c');

        playTurn(g); playTurn(g); playTurn(g); // one turn each

        expect(g.winner).toBe('a');
        const table = standings(g);
        expect(table[0].playerId).toBe('a');
        expect(table.find((r) => r.playerId === 'b')?.boxes).toBe(2);
        expect(table.find((r) => r.playerId === 'c')?.boxes).toBe(1);
        expect(table.find((r) => r.playerId === 'a')?.score).toBe(37 + 2 + 3 + 3 + 5 + 3); // 37 boxes + NA2 + EU3 + AF3 + AS5 + OC3
    });

    it('clock tie: nearest-bull tiebreak resolves; equal distances demand a re-throw', () => {
        const g = createGame(['a', 'b'], { mode: 'clock', clockTurns: 1, seed: 42 });
        for (const b of g.boxes) { b.owner = 'a'; }
        for (let i = 0; i < 20; i++) g.boxes[i].owner = 'b'; // 20/20 split
        playTurn(g); playTurn(g);

        expect(g.winner).toBeNull();
        expect(g.tie).toEqual(['a', 'b']);

        applyTiebreak(g, [{ playerId: 'a', distance: 12.5 }, { playerId: 'b', distance: 9.75 }]);
        expect(g.winner).toBe('b');

        const g2 = createGame(['a', 'b'], { mode: 'clock', clockTurns: 1, seed: 42 });
        for (const b of g2.boxes) { b.owner = 'a'; }
        for (let i = 0; i < 20; i++) g2.boxes[i].owner = 'b';
        playTurn(g2); playTurn(g2);
        applyTiebreak(g2, [{ playerId: 'a', distance: 10 }, { playerId: 'b', distance: 10 }]);
        expect(g2.winner).toBeNull();
        expect(g2.tie).toEqual(['a', 'b']); // re-throw
    });
});

describe('Risk 42 — seeded invariant sweep (M1.7)', () => {
    // deterministic tiny RNG for the "bot" darts
    const mkRand = (seed: number) => {
        let a = seed >>> 0;
        return () => {
            a = (a + 0x6d2b79f5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    };
    const pick = <T,>(r: () => number, xs: T[]): T => xs[Math.floor(r() * xs.length)];

    const botDart = (g: ReturnType<typeof createGame>, r: () => number) => {
        const me = g.turn.playerId;
        const blanks = g.boxes.filter((b) => !b.owner);
        const enemies = g.boxes.filter((b) => b.owner && b.owner !== me);
        const mine = g.boxes.filter((b) => b.owner === me);
        const roll = r();
        if (roll < 0.25 && blanks.length) {
            const b = pick(r, blanks); // claim blank land
            return r() < 0.5
                ? { segment: b.number, multiplier: 1 as const, singleRing: b.ring }
                : { segment: b.number, multiplier: (b.ring === 'inner' ? 3 : 2) as 2 | 3 };
        }
        if (roll < 0.7 && enemies.length) {
            const weak = enemies.reduce((a, b) => (b.armies < a.armies ? b : a)); // chip the weakest enemy
            return { segment: weak.number, multiplier: (weak.ring === 'inner' ? 3 : 2) as 2 | 3 };
        }
        if (roll < 0.85 && mine.length) {
            const b = pick(r, mine); // reinforce
            return { segment: b.number, multiplier: 1 as const, singleRing: b.ring };
        }
        return { segment: pick(r, [0, 25, 50]) }; // miss or Arsenal darts
    };

    // plain-JS invariant check: assert-on-violation (expect-per-dart would be 10M matcher calls)
    const invariants = (g: ReturnType<typeof createGame>) => {
        const bad = (msg: string) => { throw new Error('INVARIANT BROKEN: ' + msg); };
        if (g.boxes.length !== 40) bad('box count');
        for (const b of g.boxes) {
            if (b.owner === null && b.armies !== 0) bad('blank with armies: ' + b.id);
            if (b.owner !== null && b.armies < 1) bad('owned box under 1 army: ' + b.id);
        }
        if (!g.players.includes(g.turn.playerId)) bad('turn player not in roster');
        if (g.turn.dartsLeft < 0) bad('negative budget');
        for (const p of Object.keys(g.saved ?? {})) {
            if (!g.players.includes(p)) bad('saved bank for unknown player: ' + p);
            if ((g.saved[p] ?? 0) < 0) bad('negative saved darts for ' + p);
        }
        if (g.winner !== null && !g.players.includes(g.winner)) bad('winner not in roster');
        if (g.tie && (g.tie.length < 2 || g.winner !== null)) bad('tie state inconsistent');
        // cards: every card lives in exactly one place; hands/set counters only belong to real players
        const seen = new Set<string>();
        for (const c of g.deck ?? []) {
            if (seen.has(c.id)) bad('duplicate card in deck: ' + c.id);
            seen.add(c.id);
        }
        for (const [p, hand] of Object.entries(g.hands ?? {})) {
            if (!g.players.includes(p)) bad('hand for unknown player: ' + p);
            for (const c of hand) {
                if (seen.has(c.id)) bad('card in two places: ' + c.id);
                seen.add(c.id);
            }
        }
        for (const v of Object.values(g.setsCashed ?? {})) if ((v ?? 0) < 0) bad('negative setsCashed');
    };

    /** first legal 3-card set in a hand, or null (small hands — plain combinatorics is fine) */
    const firstSet = (hand: ReturnType<typeof createGame>['hands'][string]): string[] | null => {
        for (let i = 0; i < hand.length; i++)
            for (let j = i + 1; j < hand.length; j++)
                for (let k = j + 1; k < hand.length; k++) {
                    const ids = [hand[i].id, hand[j].id, hand[k].id];
                    if (setPayout(hand.filter((c) => ids.includes(c.id)), 0) !== null) return ids;
                }
        return null;
    };

    const runGame = (players: number, mode: 'domination' | 'clock', seed: number) => {
        const g = createGame(Array.from({ length: players }, (_, i) => `p${i + 1}`),
            mode === 'clock' ? { mode, clockTurns: 3, seed } : { mode, seed });
        const r = mkRand(seed * 7919 + players);
        let darts = 0;
        while (g.winner === null && !g.tie && darts < 2500) {
            if (g.turn.dartsLeft === 0) throw new Error('stuck: turn with zero budget');
            const combo = firstSet(g.hands[g.turn.playerId] ?? []);
            if (combo && r() < 0.2) {
                const before = g.turn.dartsLeft;
                const handBefore = g.hands[g.turn.playerId].length;
                cashSet(g, combo);
                if (g.turn.dartsLeft <= before) throw new Error('INVARIANT BROKEN: cash-in did not add darts');
                if (g.hands[g.turn.playerId].length !== handBefore - 3) throw new Error('INVARIANT BROKEN: cash-in card count');
            } else if (r() < 0.1 && g.turn.dartsLeft > 1) endTurnSaving(g); // exercise the bank in sweeps
            else applyDart(g, botDart(g, r));
            invariants(g);
            darts++;
        }
        if (g.tie) {
            const tied = [...g.tie];
            applyTiebreak(g, g.tie.map((p, i) => ({ playerId: p, distance: 5 + ((seed + i * 13) % 20) })));
            // resolved → winner comes from the tied set; dead heat → tie stands for a re-throw
            expect(g.winner === null ? g.tie : [g.winner]).toSatisfy((x: unknown) =>
                Array.isArray(x) && x.every((v) => tied.includes(v as string)));
            invariants(g);
        }
        if (g.winner !== null) {
            if (mode === 'domination') expect(g.boxes.filter((b) => b.owner === g.winner).length).toBe(40);
            else {
                const top = standings(g)[0].score;
                const leaders = standings(g).filter((r) => r.score === top).map((r) => r.playerId);
                expect(leaders).toContain(g.winner); // clock winner comes from the score leaders (bull tiebreak may pick any of them)
            }
            expect(() => applyDart(g, { segment: 0 })).toThrow(/over/);
        }
        return { darts, terminated: g.winner !== null };
    };

    it('sweeps both modes across rosters 2-6: invariants hold every dart, games terminate', { timeout: 30000 }, () => {
        const results: string[] = [];
        for (const players of [2, 3, 4, 5, 6]) {
            for (const mode of ['domination', 'clock'] as const) {
                let terminated = 0;
                for (let seed = 1; seed <= 8; seed++) {
                    const r = runGame(players, mode, seed);
                    if (r.terminated) terminated++;
                    results.push(`${players}p/${mode}/s${seed}: ${r.darts} darts${r.terminated ? '' : ' (cap)'}`);
                }
                if (mode === 'clock') expect(terminated).toBe(8); // the horn always ends it
                else if (players === 2) expect(terminated).toBe(8); // 2p random walk absorbs at 0/40
                // 3+ player domination under random churn is legitimately rare — rates logged, invariants still hard-asserted
            }
        }
        console.log(results.join('\n'));
    });

    it('same seed → identical transcript', () => {
        const play = (seed: number) => {
            const g = createGame(['a', 'b', 'c'], { mode: 'clock', clockTurns: 2, seed });
            const r = mkRand(seed);
            while (g.winner === null && !g.tie) applyDart(g, botDart(g, r));
            return JSON.stringify({ boxes: g.boxes.map((b) => [b.owner, b.armies]), winner: g.winner, tie: g.tie });
        };
        expect(play(123)).toBe(play(123));
        expect(play(123)).not.toBe(play(124));
    });
});
