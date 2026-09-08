/**
 * Commentary cadence — pure turn-count boundary math.
 * An interview fires each time the total turn count crosses a multiple of N
 * (default 2). Boundary index = floor(turnCount / N); a boundary is "new" the
 * first time it is reached.
 */
export const DEFAULT_COMMENTARY_CADENCE = 2;

/** Index of the last completed N-turn block (0 = none completed yet). */
export function boundaryOf(turnCount: number, n: number): number {
	return Math.floor(turnCount / n);
}

/** Boundary indexes newly reached when moving from prevTurnCount → turnCount. */
export function newBoundaries(
	prevTurnCount: number,
	turnCount: number,
	n: number
): number[] {
	const from = boundaryOf(prevTurnCount, n);
	const to = boundaryOf(turnCount, n);
	const out: number[] = [];
	for (let b = from + 1; b <= to; b++) out.push(b);
	return out;
}

/** Stable cache key — same match + same boundary never regenerates. */
export function boundaryKey(matchRef: string, boundary: number): string {
	return `${matchRef}:${boundary}`;
}
