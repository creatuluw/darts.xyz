import {
	CONTINENTS,
	CONTINENT_OF,
	WEDGES,
	territoriesOf,
	scoreOf,
	type ConquestState
} from './conquest-engine';

export type ConquestOptionKind = 'found' | 'capture' | 'reinforce' | 'bull';

export interface ConquestOption {
	playerId: string;
	kind: ConquestOptionKind;
	wedge: number;
	label: string;
	priority: number;
	kills?: boolean;
	deny?: boolean;
	leader?: boolean;
}

export interface PlayerOptions {
	playerId: string;
	options: ConquestOption[];
}

/**
 * Per player 1–2 curated options that "make sense or heat up the game":
 * kill-shots, leader-attacks, continent-denial, founding, last-stand reinforcement.
 * Pure: same state + same rand sequence → same output. No LLM.
 */
export function curatedOptions(
	s: ConquestState,
	rand: () => number = Math.random
): PlayerOptions[] {
	if (s.phase === 'finished') {
		return s.players.map((p) => ({ playerId: p.id, options: [] }));
	}

	// unique score leader (ties → no leader bonus)
	const scores = s.players.map((p) => ({ id: p.id, score: scoreOf(s, p.id) }));
	const max = Math.max(...scores.map((x) => x.score));
	const top = scores.filter((x) => x.score === max);
	const leaderId = top.length === 1 ? top[0].id : null;

	return s.players.map((p) => {
		if (p.dead) {
			return {
				playerId: p.id,
				options: [
					{
						playerId: p.id,
						kind: 'bull' as const,
						wedge: 25,
						label: 'Raak de bull — herleef op een blanke wig of roof',
						priority: 0
					}
				]
			};
		}

		const owned = new Set(territoriesOf(s, p.id));
		const candidates: ConquestOption[] = [];

		for (const w of WEDGES) {
			const t = s.territories[w];
			if (t.owner === null) {
				// found: needs a treble on a blank wedge
				let pr = 20;
				if (owned.size === 0) pr += 40; // comeback founding
				const mates = CONTINENTS[CONTINENT_OF[w]].filter((m) => m !== w);
				const mine = mates.filter((m) => owned.has(m)).length;
				if (mine >= mates.length / 2) pr += 30; // toward continent control
				candidates.push({ playerId: p.id, kind: 'found', wedge: w, label: `Sticht T${w}`, priority: pr });
			} else if (t.owner === p.id) {
				if (t.hp < 3) {
					let pr = 10 + (3 - t.hp) * 8;
					if (owned.size === 1) pr += 20; // last stand: defend your only wedge
					candidates.push({
						playerId: p.id,
						kind: 'reinforce',
						wedge: w,
						label: `Versterk ${w} (HP ${t.hp}→${t.hp + 1})`,
						priority: pr
					});
				}
			} else {
				// enemy wedge: a treble always captures (hp 3 → 0)
				const ownerId = t.owner;
				const owner = s.players.find((q) => q.id === ownerId);
				const ownerName = owner?.name ?? ownerId;
				let pr = 10 + (3 - t.hp) * 5;
				const kills = territoriesOf(s, ownerId).length === 1;
				if (kills) pr += 100;
				const isLeader = ownerId === leaderId;
				if (isLeader) pr += 50;
				const mates = CONTINENTS[CONTINENT_OF[w]].filter((m) => m !== w);
				const blocker = s.players.some(
					(q) => q.id !== ownerId && mates.every((m) => s.territories[m].owner === q.id)
				);
				let deny = false;
				if (blocker) {
					pr += 80;
					deny = true;
				}
				let label = `Verover ${w} van ${ownerName}`;
				if (kills) label = `Knock-out: ${w} schakelt ${ownerName} uit`;
				else if (deny) label = `Blok: pak ${w} weg`;
				else if (isLeader) label = `Val de leider aan: ${w}`;
				candidates.push({
					playerId: p.id,
					kind: 'capture',
					wedge: w,
					label,
					priority: pr,
					kills: kills || undefined,
					deny: deny || undefined,
					leader: isLeader || undefined
				});
			}
		}

		candidates.sort((a, b) => b.priority - a.priority || a.wedge - b.wedge);
		const pool = candidates.slice(0, 3);
		const picked: ConquestOption[] = [];
		if (pool.length > 0) {
			const i = Math.min(pool.length - 1, Math.floor(rand() * pool.length));
			picked.push(pool[i]);
			const rest = pool.filter((_, j) => j !== i);
			if (rest.length > 0) {
				const j = Math.min(rest.length - 1, Math.floor(rand() * rest.length));
				picked.push(rest[j]);
			}
		}
		return { playerId: p.id, options: picked };
	});
}
