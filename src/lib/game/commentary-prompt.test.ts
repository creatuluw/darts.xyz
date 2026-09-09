import { describe, it, expect } from 'vitest';
import { pickPersona, buildInterviewPrompt, PERSONAS } from './commentary-prompt';

const turns = ['beurt 1: Ada — T20 T20 T20 = 180', 'beurt 2: Ben — 1 1 1 = 3'];

describe('pickPersona', () => {
	it('returns a persona from the pool', () => {
		const p = pickPersona(() => 0);
		expect(PERSONAS).toContain(p);
	});

	it('varies under different seeds', () => {
		const a = pickPersona(() => 0);
		const z = pickPersona(() => 0.99);
		expect(a).not.toEqual(z);
	});
});

describe('buildInterviewPrompt', () => {
	it('includes exactly the given turn lines', () => {
		const prompt = buildInterviewPrompt({
			kind: 'classic',
			players: ['Ada', 'Ben'],
			turnLines: turns,
			persona: pickPersona(() => 0)
		});
		expect(prompt).toContain(turns[0]);
		expect(prompt).toContain(turns[1]);
	});

	it('names the players and the game kind', () => {
		const prompt = buildInterviewPrompt({
			kind: 'conquest',
			players: ['Ada', 'Ben'],
			turnLines: turns,
			persona: pickPersona(() => 0)
		});
		expect(prompt).toContain('Ada');
		expect(prompt).toContain('Ben');
		expect(prompt.toLowerCase()).toContain('trebles');
	});

	it('bakes in the persona and demands Dutch JSON output', () => {
		const persona = pickPersona(() => 0);
		const prompt = buildInterviewPrompt({
			kind: 'classic',
			players: ['Ada'],
			turnLines: turns,
			persona
		});
		expect(prompt).toContain(persona.name);
		expect(prompt).toContain('Nederlands');
		expect(prompt).toContain('"question"');
		expect(prompt).toContain('"answer"');
		expect(prompt).toContain('"analysis"');
		expect(prompt).toContain('"outlook"');
	});

	it('instructs the commentator to analyse after the spectator answer, with license to compare prior turns and other players', () => {
		const prompt = buildInterviewPrompt({
			kind: 'classic',
			players: ['Ada', 'Ben'],
			turnLines: turns,
			persona: pickPersona(() => 0)
		});
		// Taak 3: analyst slot — own expertise, may compare earlier turns / players
		expect(prompt).toContain('Taak 3');
		expect(prompt.toLowerCase()).toContain('analys');
		expect(prompt.toLowerCase()).toContain('expert');
		expect(prompt.toLowerCase()).toContain('vergelijk');
	});

	it('instructs the commentator to close with hopes for what happens next plus a cliffhanger', () => {
		const prompt = buildInterviewPrompt({
			kind: 'classic',
			players: ['Ada'],
			turnLines: turns,
			persona: pickPersona(() => 0)
		});
		// Taak 4: outlook slot — what he hopes happens next + cliffhanger
		expect(prompt).toContain('Taak 4');
		expect(prompt.toLowerCase()).toContain('cliffhanger');
	});

	it('feeds prior turn lines as comparison context when provided', () => {
		const prior = ['beurt 0: Ada — 60 57 60 = 177', 'beurt -1: Ben — miss, miss, miss'];
		const prompt = buildInterviewPrompt({
			kind: 'classic',
			players: ['Ada', 'Ben'],
			turnLines: turns,
		priorLines: prior,
			persona: pickPersona(() => 0)
		});
		expect(prompt).toContain(prior[0]);
		expect(prompt).toContain(prior[1]);
	});

	it('omits the prior-context block when no priorLines are given', () => {
		const prompt = buildInterviewPrompt({
			kind: 'classic',
			players: ['Ada'],
			turnLines: turns,
			persona: pickPersona(() => 0)
		});
		expect(prompt).not.toContain('Eerdere context');
	});

	it('names the asker and the analyst commentator', () => {
		const prompt = buildInterviewPrompt({
			kind: 'classic',
			players: ['Ada', 'Ben'],
			turnLines: turns,
			asker: 'Leo',
			analyst: 'Theodore',
			persona: pickPersona(() => 0)
		});
		expect(prompt).toContain('Leo');
		expect(prompt).toContain('Theodore');
	});
});

describe('buildInterviewPrompt — grounding & fun (2026-09-09 hardening)', () => {
	const base = {
		kind: 'classic' as const,
		players: ['Ada', 'Ben'],
		turnLines: ['beurt 1 — Ada: T20 T20 T20 (60 remaining)'],
		persona: pickPersona(() => 0)
	};

	it('forbids inventing facts not in the turn lines', () => {
		const prompt = buildInterviewPrompt(base);
		expect(prompt).toContain('ALLEEN');
		expect(prompt).toContain('Verzin GEEN');
	});

	it('asks for reactions and liveliness (fun goal)', () => {
		const prompt = buildInterviewPrompt(base);
		expect(prompt).toContain('juich');
		expect(prompt).toContain('grappige');
		expect(prompt).toContain('feestje');
	});
});

describe('buildInterviewPrompt — risk 42 kind', () => {
	it('names the Risk 42 game for the risk kind', () => {
		const prompt = buildInterviewPrompt({
			kind: 'risk',
			players: ['Ada'],
			turnLines: ['beurt 1 — Ada: T20 D20 S20'],
			persona: pickPersona(() => 0)
		});
		expect(prompt).toContain('Risk 42');
	});
});
