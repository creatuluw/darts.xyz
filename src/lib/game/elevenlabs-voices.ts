/** Pure voice-pool logic — shared by the server client and tests. */

export interface Commentator {
	name: string;
	voiceId: string;
	/** Prompt style — steers the LLM's voice per role. */
	style: string;
}

/** The two fixed TV commentators. They swap interview/analysis roles per boundary. */
export const COMMENTATORS: Commentator[] = [
	{ name: 'Leo', voiceId: 'GiGOaehga8enaTnFQvb4', style: 'bevlogen play-by-play stem, warm en enthousiast' },
	{ name: 'Theodore', voiceId: 'AgeYjqDIfXtkcA3mOcsH', style: 'droge analyticus met jarenlange ervaring, scherpe onderbouwde onderbouwing' }
];

/** Kept for compatibility with older call sites — Leo. */
export const COMMENTATOR_VOICE_ID = COMMENTATORS[0].voiceId;

export const COMMENTATOR_VOICE_IDS = COMMENTATORS.map((c) => c.voiceId);

/** Odd boundaries: Leo asks, Theodore analyses. Even boundaries swap. */
export function commentatorPair(boundary: number): { asker: Commentator; analyst: Commentator } {
	const swap = boundary % 2 === 0;
	return {
		asker: COMMENTATORS[swap ? 1 : 0],
		analyst: COMMENTATORS[swap ? 0 : 1]
	};
}

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

/** Random Dutch spectator voice, never one of the commentators. */
export function pickSpectatorVoice(
	voices: DutchVoice[],
	rand: () => number = Math.random
): DutchVoice | null {
	const pool = voices.filter((v) => !COMMENTATOR_VOICE_IDS.includes(v.voice_id));
	if (pool.length === 0) return null;
	return pool[Math.min(pool.length - 1, Math.floor(rand() * pool.length))];
}
