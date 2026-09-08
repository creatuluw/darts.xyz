import { describe, it, expect } from 'vitest';
import {
	DEFAULT_COMMENTARY_CADENCE,
	boundaryOf,
	newBoundaries,
	boundaryKey
} from './commentary-cadence';

describe('commentary cadence', () => {
	it('default cadence is every 2 turns', () => {
		expect(DEFAULT_COMMENTARY_CADENCE).toBe(2);
	});

	it('N=2: boundaries land on 2, 4, 6 — never mid-interval', () => {
		expect(boundaryOf(1, 2)).toBe(0);
		expect(boundaryOf(2, 2)).toBe(1);
		expect(boundaryOf(3, 2)).toBe(1);
		expect(boundaryOf(4, 2)).toBe(2);
		expect(boundaryOf(6, 2)).toBe(3);
	});

	it('N=4: boundaries land on 4, 8 — aggregating 4 turns each', () => {
		expect(boundaryOf(3, 4)).toBe(0);
		expect(boundaryOf(4, 4)).toBe(1);
		expect(boundaryOf(7, 4)).toBe(1);
		expect(boundaryOf(8, 4)).toBe(2);
	});

	it('newBoundaries: crossing from 1 to 5 turns at N=2 yields boundaries 1 and 2 exactly once', () => {
		expect(newBoundaries(1, 5, 2)).toEqual([1, 2]);
		expect(newBoundaries(4, 5, 2)).toEqual([]); // no crossing between 4→5
		expect(newBoundaries(0, 2, 2)).toEqual([1]);
		expect(newBoundaries(2, 2, 2)).toEqual([]); // idempotent: same boundary not re-fired
	});

	it('boundaryKey: stable, idempotent per match and boundary', () => {
		expect(boundaryKey('abc', 3)).toBe(boundaryKey('abc', 3));
		expect(boundaryKey('abc', 3)).not.toBe(boundaryKey('abc', 4));
		expect(boundaryKey('abc', 3)).not.toBe(boundaryKey('xyz', 3));
	});
});
