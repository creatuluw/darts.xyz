/** Pure voice-pool logic — shared by the server client and tests. */
export const COMMENTATOR_VOICE_ID = "GiGOaehga8enaTnFQvb4";

export interface DutchVoice {
	voice_id: string;
	name: string;
}

/** Workspace pool added 2026-09 (all Dutch). Fallback if listing fails. */
export const FALLBACK_DUTCH_VOICE_IDS = [
	"7kJ33vnB1HkX76L4U5km", // Leonie
	"vojvEumHZHcjlpEPNZKW", // Jan
	"0qLmDzgqulxcvv0yf3kg", // Remko
	"YWWzyiP9IlB03CVK6QXN", // Niels
	"kZQ3IGqYUStQ8u1Y62s6", // Lieke
	"p4efl2GlWK0o6sAQEEkp", // Fenna
];

export function isDutchVoice(name: string, language?: string): boolean {
	return language === "nl" || /dutch|nederlands|nl toeschouwer/i.test(name);
}

/** Random Dutch spectator voice, never the commentator. */
export function pickSpectatorVoice(
	voices: DutchVoice[],
	rand: () => number = Math.random
): DutchVoice | null {
	const pool = voices.filter((v) => v.voice_id !== COMMENTATOR_VOICE_ID);
	if (pool.length === 0) return null;
	return pool[Math.min(pool.length - 1, Math.floor(rand() * pool.length))];
}
