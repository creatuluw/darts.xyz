import { describe, it, expect } from 'vitest';
import {
	pickSpectatorVoice,
	COMMENTATORS,
	commentatorPair,
	COMMENTATOR_VOICE_IDS
} from './elevenlabs-voices';

const voices = [
	{ voice_id: COMMENTATORS[0].voiceId, name: 'Leo - Commentator' },
	{ voice_id: COMMENTATORS[1].voiceId, name: 'Theodore - Commentator' },
	{ voice_id: '7kJ33vnB1HkX76L4U5km', name: 'Leonie (NL Toeschouwer)' },
	{ voice_id: 'vojvEumHZHcjlpEPNZKW', name: 'Jan (NL Toeschouwer)' },
	{ voice_id: '0qLmDzgqulxcvv0yf3kg', name: 'Remko (NL Toeschouwer)' }
];

describe('pickSpectatorVoice', () => {
	it('never returns a commentator voice', () => {
		for (let i = 0; i < 40; i++) {
			const v = pickSpectatorVoice(voices, () => Math.random());
			expect(COMMENTATOR_VOICE_IDS).not.toContain(v!.voice_id);
		}
	});

	it('picks from the provided Dutch pool and varies by seed', () => {
		const ids = voices
			.filter((v) => !COMMENTATOR_VOICE_IDS.includes(v.voice_id))
			.map((v) => v.voice_id);
		const a = pickSpectatorVoice(voices, () => 0)!;
		const z = pickSpectatorVoice(voices, () => 0.99)!;
		expect(ids).toContain(a.voice_id);
		expect(ids).toContain(z.voice_id);
	});

	it('returns null when no Dutch voice is available', () => {
		expect(pickSpectatorVoice([], () => 0)).toBeNull();
		expect(
			pickSpectatorVoice(
				[
					{ voice_id: COMMENTATORS[0].voiceId, name: 'only commentator' },
					{ voice_id: COMMENTATORS[1].voiceId, name: 'only other commentator' }
				],
				() => 0
			)
		).toBeNull();
	});
});

describe('commentatorPair', () => {
	it('exposes two named commentators: Leo and Theodore', () => {
		expect(COMMENTATORS.map((c) => c.name).sort()).toEqual(['Leo', 'Theodore']);
	});

	it('odd boundaries: Leo asks, Theodore analyses; even boundaries swap', () => {
		expect(commentatorPair(1)).toEqual({ asker: COMMENTATORS[0], analyst: COMMENTATORS[1] });
		expect(commentatorPair(3)).toEqual({ asker: COMMENTATORS[0], analyst: COMMENTATORS[1] });
		expect(commentatorPair(2)).toEqual({ asker: COMMENTATORS[1], analyst: COMMENTATORS[0] });
	});
});

describe('isDutchVoice', () => {
	it('matches language label or Dutch name markers', async () => {
		const { isDutchVoice } = await import('./elevenlabs-voices');
		expect(isDutchVoice('Hugo_V - Dutch')).toBe(true);
		expect(isDutchVoice('Leonie (NL Toeschouwer)')).toBe(true);
		expect(isDutchVoice('Sarah', 'nl')).toBe(true);
		expect(isDutchVoice('Sarah', 'en')).toBe(false);
		expect(isDutchVoice('George')).toBe(false);
	});
});
