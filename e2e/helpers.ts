import type { APIRequestContext } from '@playwright/test';

/** Unique account email per run so tests never collide with real data. */
export function uniqueEmail(): string {
	return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.local`;
}

export async function createPlayer(
	api: APIRequestContext,
	accountEmail: string,
	name: string
): Promise<{ id: string; name: string }> {
	const res = await api.post('/api/players', {
		data: { name, accountId: accountEmail }
	});
	if (!res.ok()) throw new Error(`createPlayer failed: ${res.status()} ${await res.text()}`);
	return res.json();
}

export async function archivePlayer(api: APIRequestContext, playerId: string): Promise<void> {
	const res = await api.delete(`/api/players/${playerId}`);
	if (!res.ok()) throw new Error(`archivePlayer failed: ${res.status()}`);
}

export interface MatchFixture {
	match: { id: string };
	firstLeg: { id: string };
	matchPlayers: Array<{ id: string; playerId: string }>;
}

export async function createMatch(
	api: APIRequestContext,
	accountEmail: string,
	playerIds: string[],
	opts: { startingScore?: number; legsPerSet?: number; setsPerMatch?: number } = {}
): Promise<MatchFixture> {
	const res = await api.post('/api/matches', {
		data: {
			email: accountEmail,
			startingScore: opts.startingScore ?? 301,
			legsPerSet: opts.legsPerSet ?? 1,
			setsPerMatch: opts.setsPerMatch ?? 1,
			doubleIn: false,
			players: playerIds.map((id) => ({ id }))
		}
	});
	if (!res.ok()) throw new Error(`createMatch failed: ${res.status()} ${await res.text()}`);
	const data = await res.json();
	return { match: data.match, firstLeg: data.firstLeg, matchPlayers: data.matchPlayers };
}

/** Shape mirrors the UI's POST /api/matches/:id/turns payload (db addTurn). */
export async function submitTurn(
	api: APIRequestContext,
	matchId: string,
	turn: {
		legId: string;
		playerId: string;
		turnNumber: number;
		darts: Array<{ segment: number; multiplier: number }>;
		remainingScore: number;
		isBust: boolean;
	}
): Promise<unknown> {
	const darts = [...turn.darts, ...Array(3).fill({ segment: 0, multiplier: 0 })].slice(0, 3);
	const payload: Record<string, unknown> = {
		legId: turn.legId,
		playerId: turn.playerId,
		turnNumber: turn.turnNumber,
		totalScore: darts.reduce((s, d) => s + d.segment * d.multiplier, 0),
		remainingScore: turn.remainingScore,
		isBust: turn.isBust,
		dartsThrown: turn.darts.length // a miss is still a dart thrown, per the UI
	};
	darts.forEach((d, i) => {
		payload[`dart${i + 1}Segment`] = d.segment;
		payload[`dart${i + 1}Multiplier`] = d.multiplier;
		payload[`dart${i + 1}Score`] = d.segment * d.multiplier;
	});

	const res = await api.post(`/api/matches/${matchId}/turns`, { data: payload });
	if (!res.ok()) throw new Error(`submitTurn failed: ${res.status()} ${await res.text()}`);
	return res.json();
}

export async function getMatch(api: APIRequestContext, matchId: string) {
	const res = await api.get(`/api/matches/${matchId}`);
	if (!res.ok()) throw new Error(`getMatch failed: ${res.status()}`);
	return res.json();
}
