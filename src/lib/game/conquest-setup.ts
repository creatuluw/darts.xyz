/** Trebles & Territories — setup helpers (spec §03). */

/** Dart budget per player: 51–1501 in steps of 50, every one a classic x01 number. */
export const CONQUEST_PRESETS: number[] = Array.from(
	{ length: 30 },
	(_, i) => 51 + i * 50
);

export const CONQUEST_DEFAULT_PRESET = 301;

/** Min/max players for a conquest match. */
export const CONQUEST_MIN_PLAYERS = 2;
export const CONQUEST_MAX_PLAYERS = 6;

/**
 * Human-friendly match duration estimate for §03: ceil(darts/3) turns × 30 s × players.
 * Examples: '~17m', '~1h 41m', '~1h', '~25h 3m'.
 */
export function estimateDuration(darts: number, players: number): string {
	const minutes = Math.ceil(darts / 3) * 0.5 * players;
	const h = Math.floor(minutes / 60);
	const m = Math.round(minutes % 60);
	if (h === 0) return `~${m}m`;
	return m === 0 ? `~${h}h` : `~${h}h ${m}m`;
}

/** Setup errors for the Fun tab; empty array = ready to start. */
export function validateConquestSetup(players: unknown[]): string[] {
	const errors: string[] = [];
	if (players.length < CONQUEST_MIN_PLAYERS)
		errors.push(`Select at least ${CONQUEST_MIN_PLAYERS} players`);
	if (players.length > CONQUEST_MAX_PLAYERS)
		errors.push(`Maximum ${CONQUEST_MAX_PLAYERS} players`);
	return errors;
}
