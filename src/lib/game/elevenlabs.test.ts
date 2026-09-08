import { describe, it, expect } from 'vitest';
import { pickSpectatorVoice, COMMENTATOR_VOICE_ID } from './elevenlabs-voices';

const voices = [
	{ voice_id: COMMENTATOR_VOICE_ID, name: 'Arno Drost - Commentator' },
	{ voice_id: '7kJ33vnB1HkX76L4U5km', name: 'Leonie (NL Toeschouwer)' },
	{ voice_id: 'vojvEumHZHcjlpEPNZKW', name: 'Jan (NL Toeschouwer)' },
	{ voice_id: '0qLmDzgqulxcvv0yf3kg', name: 'Remko (NL Toeschouwer)' }
];

describe('pickSpectatorVoice', () => {
	it('never returns the commentator voice', () => {
		for (let i = 0; i < 40; i++) {
			const v = pickSpectatorVoice(voices, () => Math.random());
			expect(v!.voice_id).not.toBe(COMMENTATOR_VOICE_ID);
		}
	});

	it('picks from the provided Dutch pool and varies by seed', () => {
		const ids = voices.filter((v) => v.voice_id !== COMMENTATOR_VOICE_ID).map((v) => v.voice_id);
		const a = pickSpectatorVoice(voices, () => 0)!;
		const z = pickSpectatorVoice(voices, () => 0.99)!;
		expect(ids).toContain(a.voice_id);
		expect(ids).toContain(z.voice_id);
	});

	it('returns null when no Dutch voice is available', () => {
		expect(pickSpectatorVoice([], () => 0)).toBeNull();
		expect(
			pickSpectatorVoice([{ voice_id: COMMENTATOR_VOICE_ID, name: 'only commentator' }], () => 0)
		).toBeNull();
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
