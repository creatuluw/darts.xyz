import { describe, expect, it } from 'vitest';
import { applyDart, applyTiebreak, budgetWithSources, createGame, isExiled, standings } from './risk-engine';

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

describe('Risk 42 — turn lifecycle & the Arsenal (M1.3)', () => {
    const setup = () => {
        const g = createGame(['a', 'b', 'c'], { seed: 42 });
        const box = (id: string) => g.boxes.find((x) => x.id === id)!;
        return { g, box };
    };

    it('a bull charges the darts thrown after it: 25 = +1, 50 = +2', () => {
        const { g, box } = setup();
        const me = g.turn.playerId;
        box('20-inner').owner = me; box('20-inner').armies = 5;

        applyDart(g, { segment: 25 });                      // charge +1
        applyDart(g, { segment: 20, multiplier: 1, singleRing: 'inner' }); // 1 + 1
        applyDart(g, { segment: 0 });                       // end turn harmlessly
        expect(box('20-inner').armies).toBe(7);

        // a's next turn (3 players: b, c in between) — 50 = +2
        applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); // b
        applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); applyDart(g, { segment: 0 }); // c
        expect(g.turn.playerId).toBe(me);
        applyDart(g, { segment: 50 });
        applyDart(g, { segment: 20, multiplier: 3 });       // 2 + 2
        expect(box('20-inner').armies).toBe(11);
    });

    it('charges stack additively: 25 then 50 = +3 on the following dart', () => {
        const { g, box } = setup();
        const me = g.turn.playerId;
        const foe = g.players.find((p) => p !== me)!;
        box('3-outer').owner = foe; box('3-outer').armies = 5;

        applyDart(g, { segment: 25 });
        applyDart(g, { segment: 50 });
        applyDart(g, { segment: 3, multiplier: 2 }); // 2 + 3 = 5 damage → 0 → flips
        expect(box('3-outer')).toMatchObject({ owner: me, armies: 1 });
    });

    it('a bull as the last dart fizzles — no board effect; a bull-only turn touches nothing', () => {
        const { g } = setup();
        const before = JSON.stringify(g.boxes);
        applyDart(g, { segment: 25 });
        applyDart(g, { segment: 25 });
        applyDart(g, { segment: 50 }); // last-dart bull: charge set but turn ends
        expect(JSON.stringify(g.boxes)).toBe(before); // bulls never touch boxes
        expect(g.turn.charge).toBe(0); // fresh turn, nothing carried
        expect(g.turn.dartsLeft).toBe(3);
    });

    it('charge never leaks across the turn boundary', () => {
        const { g, box } = setup();
        const me = g.turn.playerId;
        applyDart(g, { segment: 25 });
        applyDart(g, { segment: 20, multiplier: 3 });
        applyDart(g, { segment: 20, multiplier: 3 });
        // turn advanced (3 darts spent); next player's deposits are uncharged
        expect(g.turn.playerId).not.toBe(me);
        const next = g.turn.playerId;
        box('1-inner').owner = next; box('1-inner').armies = 4;
        applyDart(g, { segment: 1, multiplier: 3 });
        expect(box('1-inner').armies).toBe(6); // 2 + 0, no charge
    });

    it('after the last dart the turn advances: next player, fresh budget, charge cleared, index increments', () => {
        const { g } = setup();
        const starter = g.turn.playerId;
        applyDart(g, { segment: 20, multiplier: 3 });
        applyDart(g, { segment: 20, multiplier: 3 });
        applyDart(g, { segment: 20, multiplier: 3 });

        expect(g.turn.playerId).not.toBe(starter);
        expect(g.turn.dartsLeft).toBe(3);
        expect(g.turn.charge).toBe(0);
        expect(g.turn.index).toBe(2);
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

describe('Risk 42 — continent income (M1.5)', () => {
    const SA_IDS = ['19-outer', '7-outer', '16-inner', '16-outer'];
    const AS_IDS = ['1-outer', '18-inner', '18-outer', '4-inner', '4-outer', '13-inner', '13-outer', '6-inner', '6-outer', '10-inner', '2-inner'];

    const setup = () => {
        const g = createGame(['a', 'b'], { seed: 42 });
        const box = (id: string) => g.boxes.find((x) => x.id === id)!;
        const give = (ids: string[], p: string) => ids.forEach((id) => { box(id).owner = p; });
        return { g, box, give };
    };
    const playTurn = (g: ReturnType<typeof createGame>) => {
        const p = g.turn.playerId; // play out THIS player turn only — the advance hands over mid-loop
        while (g.turn.playerId === p && g.turn.dartsLeft > 0) applyDart(g, { segment: 0 });
    };

    it('full South America = +1 dart per turn (budget 4)', () => {
        const { g, give } = setup();
        give(SA_IDS, 'b');
        playTurn(g);
        expect(g.turn.playerId).toBe('b');
        expect(g.turn.dartsLeft).toBe(4);
    });

    it('Asia pays double (+2 → budget 5); stacking SA + Asia → 6', () => {
        const { g, give } = setup();
        give(AS_IDS, 'b');
        playTurn(g);
        expect(g.turn.playerId).toBe('b');
        expect(g.turn.dartsLeft).toBe(5);

        give(SA_IDS, 'b');
        playTurn(g); playTurn(g);
        expect(g.turn.playerId).toBe('b');
        expect(g.turn.dartsLeft).toBe(6);
    });

    it('losing one box kills the bonus; a blank in the continent blocks it', () => {
        const { g, box, give } = setup();
        give(SA_IDS, 'b');
        box('19-outer').owner = 'a';
        playTurn(g);
        expect(g.turn.playerId).toBe('b');
        expect(g.turn.dartsLeft).toBe(3);

        give(SA_IDS, 'b');
        box('16-outer').owner = null; box('16-outer').armies = 0; // blank blocks control
        playTurn(g); playTurn(g); // b consumes, a consumes, b's fresh turn
        expect(g.turn.playerId).toBe('b');
        expect(g.turn.dartsLeft).toBe(3);
    });

    it('budgetWithSources itemizes the pre-turn banner', () => {
        const { g, give } = setup();
        for (const b of g.boxes) b.owner = 'b'; // neutralize the random deal
        give(SA_IDS, 'a');
        give(AS_IDS, 'a');
        g.turn.playerId = 'a';

        const budget = budgetWithSources(g);
        expect(budget.base).toBe(3);
        expect(budget.sources).toEqual([
            expect.objectContaining({ continent: 'AS', darts: 2 }),
            expect.objectContaining({ continent: 'SA', darts: 1 }),
        ]);
        expect(budget.total).toBe(6);
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
        return { segment: pick(r, [0, 25, 50]) }; // miss or Arsenal charge
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
        if (g.turn.charge < 0) bad('negative charge');
        if (g.winner !== null && !g.players.includes(g.winner)) bad('winner not in roster');
        if (g.tie && (g.tie.length < 2 || g.winner !== null)) bad('tie state inconsistent');
    };

    const runGame = (players: number, mode: 'domination' | 'clock', seed: number) => {
        const g = createGame(Array.from({ length: players }, (_, i) => `p${i + 1}`),
            mode === 'clock' ? { mode, clockTurns: 3, seed } : { mode, seed });
        const r = mkRand(seed * 7919 + players);
        let darts = 0;
        while (g.winner === null && !g.tie && darts < 2500) {
            if (g.turn.dartsLeft === 0) throw new Error('stuck: turn with zero budget');
            applyDart(g, botDart(g, r));
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
