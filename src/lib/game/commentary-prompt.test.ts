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
	});
});
