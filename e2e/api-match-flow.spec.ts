import { test, expect } from '@playwright/test';
import { uniqueEmail, createPlayer, createMatch, submitTurn, archivePlayer, getMatch } from './helpers';

/**
 * Full match lifecycle through the real API + database, mirroring exactly
 * what the live scorer page does when a player submits turns.
 */
test.describe('API match flow', () => {
	let email: string;
	let aliceId: string;
	let bobId: string;

	test.beforeAll(async ({ request }) => {
		email = uniqueEmail();
		aliceId = (await createPlayer(request, email, 'E2E Alice')).id;
		bobId = (await createPlayer(request, email, 'E2E Bob')).id;
	});

	test.afterAll(async ({ request }) => {
		// Soft-delete (archive) the test players so the account stays clean
		await archivePlayer(request, aliceId);
		await archivePlayer(request, bobId);
	});

	test('plays a complete 301 match: turns persist, leg gets a winner, match completes, stats aggregate', async ({ request }) => {
		// Create a 301 single-leg single-set match, Alice throws first
		const { match, firstLeg, matchPlayers } = await createMatch(request, email, [aliceId, bobId]);
		expect(match.id).toBeTruthy();
		expect(firstLeg.id).toBeTruthy();
		expect(matchPlayers).toHaveLength(2);

		// Turn 1 — Alice: T20 T20 T20 = 180 → 121
		await submitTurn(request, match.id, {
			legId: firstLeg.id,
			playerId: aliceId,
			turnNumber: 1,
			darts: [
				{ segment: 20, multiplier: 3 },
				{ segment: 20, multiplier: 3 },
				{ segment: 20, multiplier: 3 }
			],
			remainingScore: 121,
			isBust: false
		});

		// Turn 2 — Bob: total miss → 301
		await submitTurn(request, match.id, {
			legId: firstLeg.id,
			playerId: bobId,
			turnNumber: 2,
			darts: [{ segment: 0, multiplier: 0 }],
			remainingScore: 301,
			isBust: false
		});

		// Turn 3 — Alice: T20 T15 D8 = 121 → checkout
		await submitTurn(request, match.id, {
			legId: firstLeg.id,
			playerId: aliceId,
			turnNumber: 3,
			darts: [
				{ segment: 20, multiplier: 3 },
				{ segment: 15, multiplier: 3 },
				{ segment: 8, multiplier: 2 }
			],
			remainingScore: 0,
			isBust: false
		});

		// Close the leg and match the same way the UI does
		const legPatch = await request.patch(`/api/matches/${match.id}/legs`, {
			data: { legId: firstLeg.id, winnerId: aliceId }
		});
		expect(legPatch.ok()).toBeTruthy();

		const aliceMp = matchPlayers.find((mp) => mp.playerId === aliceId)!;
		const bobMp = matchPlayers.find((mp) => mp.playerId === bobId)!;
		await request.patch(`/api/matches/${match.id}/players/${aliceMp.id}`, {
			data: { setsWon: 1, legsWon: 1 }
		});
		await request.patch(`/api/matches/${match.id}/players/${bobMp.id}`, {
			data: { setsWon: 0, legsWon: 0 }
		});
		await request.patch(`/api/matches/${match.id}`, {
			data: { status: 'completed', winnerId: aliceId }
		});

		// Verify persisted match state
		const detail = await getMatch(request, match.id);
		expect(detail.match.status).toBe('completed');
		expect(detail.legs).toHaveLength(1);
		expect(detail.legs[0].winnerId).toBe(aliceId);
		expect(detail.matchPlayers.find((mp: any) => mp.playerId === aliceId).legsWon).toBe(1);

		// Verify persisted turns (endpoint returns newest-first — index by turnNumber)
		const turnsRes = await request.get(`/api/matches/${match.id}/turns`);
		expect(turnsRes.ok()).toBeTruthy();
		const turns = await turnsRes.json();
		expect(turns).toHaveLength(3);
		const byNumber = Object.fromEntries(turns.map((t: any) => [t.turnNumber, t]));
		expect(byNumber[1].totalScore).toBe(180);
		expect(byNumber[1].remainingScore).toBe(121);
		expect(byNumber[2].totalScore).toBe(0);
		expect(byNumber[3].totalScore).toBe(121);
		expect(byNumber[3].remainingScore).toBe(0);

		// Verify aggregated stats for Alice
		const statsRes = await request.get(`/api/stats/${aliceId}`);
		expect(statsRes.ok()).toBeTruthy();
		const stats = await statsRes.json();
		expect(stats.total180s).toBe(1);
		expect(stats.highestFinish).toBe(121);
		expect(stats.checkoutSuccesses).toBe(1);
		expect(stats.totalScore).toBe(301);
	});

	test('a bust turn persists with the reverted (pre-turn) remaining score', async ({ request }) => {
		const { match, firstLeg } = await createMatch(request, email, [aliceId, bobId]);

		// Alice: 180 → 121
		await submitTurn(request, match.id, {
			legId: firstLeg.id,
			playerId: aliceId,
			turnNumber: 1,
			darts: [
				{ segment: 20, multiplier: 3 },
				{ segment: 20, multiplier: 3 },
				{ segment: 20, multiplier: 3 }
			],
			remainingScore: 121,
			isBust: false
		});

		// Bob: miss
		await submitTurn(request, match.id, {
			legId: firstLeg.id,
			playerId: bobId,
			turnNumber: 2,
			darts: [{ segment: 0, multiplier: 0 }],
			remainingScore: 301,
			isBust: false
		});

		// Alice: 180 from 121 → bust, score reverts to 121
		await submitTurn(request, match.id, {
			legId: firstLeg.id,
			playerId: aliceId,
			turnNumber: 3,
			darts: [
				{ segment: 20, multiplier: 3 },
				{ segment: 20, multiplier: 3 },
				{ segment: 20, multiplier: 3 }
			],
			remainingScore: 121,
			isBust: true
		});

		const turnsRes = await request.get(`/api/matches/${match.id}/turns`);
		const turns = await turnsRes.json();
		const bust = turns.find((t: any) => t.isBust);
		expect(bust).toBeDefined();
		expect(bust.totalScore).toBe(180);
		expect(bust.remainingScore).toBe(121); // reverted

		// Clean up: abandon the match so it doesn't linger as active
		await request.patch(`/api/matches/${match.id}`, { data: { status: 'abandoned' } });
	});

	test('archived players disappear from the active list and can be restored', async ({ request }) => {
		const scratch = await createPlayer(request, email, 'E2E Scratch');
		await archivePlayer(request, scratch.id);

		const active = await (await request.get(`/api/players?accountId=${encodeURIComponent(email)}`)).json();
		expect(active.some((p: any) => p.id === scratch.id)).toBe(false);

		const restore = await request.post(`/api/players/archived/${scratch.id}/restore`);
		expect(restore.ok()).toBeTruthy();

		const activeAfter = await (await request.get(`/api/players?accountId=${encodeURIComponent(email)}`)).json();
		expect(activeAfter.some((p: any) => p.id === scratch.id)).toBe(true);

		await archivePlayer(request, scratch.id); // leave it archived
	});

	test('creating a player requires a name and account', async ({ request }) => {
		const noName = await request.post('/api/players', { data: { accountId: email } });
		expect(noName.status()).toBe(400);

		const noAccount = await request.post('/api/players', { data: { name: 'X' } });
		expect(noAccount.status()).toBe(400);
	});

	test('match detail 404s for an unknown id', async ({ request }) => {
		const res = await request.get('/api/matches/00000000-0000-0000-0000-000000000000');
		expect(res.status()).toBe(404);
	});
});
