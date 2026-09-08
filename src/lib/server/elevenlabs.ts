/**
 * ElevenLabs TTS client — server-side only (ELEVENLABS_KEY).
 * Commentator: fixed voice (Arno Drost). Spectators: random Dutch voice
 * from the workspace pool, never the commentator. Pure logic lives in
 * $lib/game/elevenlabs-voices.
 */
import { env } from "$env/dynamic/private";
import {
	COMMENTATOR_VOICE_ID,
	FALLBACK_DUTCH_VOICE_IDS,
	isDutchVoice,
	type DutchVoice
} from "$lib/game/elevenlabs-voices";

export { COMMENTATOR_VOICE_ID };
export type { DutchVoice };

let voiceCache: DutchVoice[] | null = null;

/** Dutch workspace voices excluding the commentator. Cached per process. */
export async function getDutchVoices(): Promise<DutchVoice[]> {
	if (voiceCache) return voiceCache;
	try {
		const res = await fetch("https://api.elevenlabs.io/v1/voices", {
			headers: { "xi-api-key": env.ELEVENLABS_KEY! }
		});
		if (!res.ok) throw new Error(`voices: ${res.status}`);
		const data = await res.json();
		voiceCache = (data.voices as any[])
			.filter(
				(v) =>
					v.voice_id !== COMMENTATOR_VOICE_ID &&
					isDutchVoice(v.name ?? "", v.labels?.language)
			)
			.map((v) => ({ voice_id: v.voice_id, name: v.name }));
	} catch {
		voiceCache = FALLBACK_DUTCH_VOICE_IDS.map((id, i) => ({
			voice_id: id,
			name: `NL Toeschouwer ${i + 1}`
		}));
	}
	return voiceCache;
}

/** Text → base64 mp3 (eleven_multilingual_v2 handles Dutch). */
export async function tts(text: string, voiceId: string): Promise<string> {
	const res = await fetch(
		`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
		{
			method: "POST",
			headers: {
				"xi-api-key": env.ELEVENLABS_KEY!,
				"Content-Type": "application/json",
				Accept: "audio/mpeg"
			},
			body: JSON.stringify({
				text,
				model_id: "eleven_multilingual_v2"
			})
		}
	);
	if (!res.ok) throw new Error(`tts ${voiceId}: ${res.status} ${await res.text()}`);
	const buf = Buffer.from(await res.arrayBuffer());
	return buf.toString("base64");
}
