import { describe, it, expect } from 'vitest';
import {
	CONQUEST_PRESETS,
	CONQUEST_DEFAULT_PRESET,
	estimateDuration,
	validateConquestSetup
} from './conquest-setup';

describe('CONQUEST_PRESETS', () => {
	it('lists 51 to 1501 in steps of 50 (thirty presets)', () => {
		expect(CONQUEST_PRESETS).toHaveLength(30);
		expect(CONQUEST_PRESETS[0]).toBe(51);
		expect(CONQUEST_PRESETS[29]).toBe(1501);
		expect(CONQUEST_PRESETS).toContain(301);
	});

	it('defaults to 301', () => {
		expect(CONQUEST_DEFAULT_PRESET).toBe(301);
	});
});

describe('estimateDuration', () => {
	it('assumes ~30s per 3-dart turn per player', () => {
		// 51 darts = 17 turns × 30s × 2 players = 17 min
		expect(estimateDuration(51, 2)).toBe('~17m');
	});

	it('rounds partial turns up (301st dart needs an extra turn)', () => {
		// 301 darts = 101 turns × 30s × 2 = 101 min
		expect(estimateDuration(301, 2)).toBe('~1h 41m');
	});

	it('scales with player count', () => {
		expect(estimateDuration(301, 4)).toBe('~3h 22m');
		expect(estimateDuration(301, 6)).toBe('~5h 3m');
	});

	it('shows hours beyond 24 rather than switching units', () => {
		expect(estimateDuration(1501, 6)).toBe('~25h 3m');
	});

	it('omits zero minutes', () => {
		expect(estimateDuration(60, 2)).toBe('~20m');
		expect(estimateDuration(90, 3)).toBe('~45m');
		expect(estimateDuration(180, 2)).toBe('~1h');
	});
});

describe('validateConquestSetup', () => {
	it('rejects fewer than 2 players', () => {
		expect(validateConquestSetup([])).toContain('Select at least 2 players');
		expect(validateConquestSetup([{ id: 'a' }])).toContain('Select at least 2 players');
	});

	it('rejects more than 6 players', () => {
		const seven = Array.from({ length: 7 }, (_, i) => ({ id: String(i) }));
		expect(validateConquestSetup(seven)).toContain('Maximum 6 players');
	});

	it('returns no errors for 2–6 players', () => {
		expect(validateConquestSetup([{ id: 'a' }, { id: 'b' }])).toEqual([]);
	});
});
