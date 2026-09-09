import { describe, it, expect } from 'vitest';
import { parseInterview } from './interview-json';

const full = JSON.stringify({
	question: 'Wat een 180, hoe is dat mogelijk?',
	answer: 'Gewoon oefenen, jongen.',
	analysis: 'De 180 kwam na twee missers — vorm stijgt.',
	outlook: 'Ik hoop op een negendarter, en de volgende beurt wordt spannend…'
});

describe('parseInterview', () => {
	it('parses a clean 4-field JSON object', () => {
		const r = parseInterview(full);
		expect(r.question).toContain('180');
		expect(r.answer).toBe('Gewoon oefenen, jongen.');
		expect(r.analysis).toContain('vorm');
		expect(r.outlook).toContain('spannend');
	});

	it('tolerates chatty output around the JSON object', () => {
		const r = parseInterview(`Zeker, hier komt het!\n${full}\nGraag gedaan.`);
		expect(r.question).toBeTruthy();
	});

	it('throws when a field is missing or not a string', () => {
		expect(() => parseInterview('{"question":"q","answer":"a","analysis":"x"}')).toThrow();
		expect(() =>
			parseInterview('{"question":"q","answer":"a","analysis":1,"outlook":"o"}')
		).toThrow();
	});

	it('throws when there is no JSON object at all', () => {
		expect(() => parseInterview('geen json hier')).toThrow(/no JSON/i);
	});
});
