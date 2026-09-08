import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";
import { generateInterview } from "$lib/server/opencode";
import { getDutchVoices, tts, COMMENTATOR_VOICE_ID } from "$lib/server/elevenlabs";
import { pickSpectatorVoice } from "$lib/game/elevenlabs-voices";
import { buildInterviewPrompt, pickPersona } from "$lib/game/commentary-prompt";
import { boundaryKey } from "$lib/game/commentary-cadence";

/**
 * Generate (or return cached) a Dutch interview for a completed N-turn
 * boundary. Called only by an open, unpaused 2nd screen.
 * COMMENTARY_FAKE=1 → deterministic canned text, no audio, no LLM/TTS spend.
 */
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => null);
  const { matchRef, boundary, kind, players, turnLines } = body ?? {};
  if (
    typeof matchRef !== "string" ||
    !matchRef ||
    typeof boundary !== "number" ||
    boundary < 1 ||
    (kind !== "classic" && kind !== "conquest") ||
    !Array.isArray(players) ||
    !Array.isArray(turnLines) ||
    turnLines.length === 0
  ) {
    return json({ error: "Invalid commentary request" }, { status: 400 });
  }

  const key = boundaryKey(matchRef, boundary);

  const cached = await dbService.getCommentary(key);
  if (cached) return json({ cached: true, ...cached });

  // E2E / CI: canned interview, no external calls. "fail-" matchRefs force 500.
  if (process.env.COMMENTARY_FAKE === "1") {
    if (matchRef.startsWith("fail-")) {
      return json({ error: "Commentary generation failed (forced)" }, { status: 500 });
    }
    const row = await dbService.createCommentary({
      matchRef,
      boundaryKey: key,
      question: `Wat een beurten! ${players.join(" en ")}, wat gebeurt daar?`,
      answer: `Als ${turnLines.length}-beurten-toeschouwer zeg ik: ${turnLines[turnLines.length - 1]}. Prachtig gewoon.`,
      persona: { name: "Fake Fan", tone: "test", style: "test" },
      commentatorVoice: COMMENTATOR_VOICE_ID,
      spectatorVoice: "fake",
      spectatorName: "Fake Fan",
      audioQuestion: null,
      audioAnswer: null
    });
    return json({ cached: false, ...row });
  }

  try {
    const persona = pickPersona();
    const prompt = buildInterviewPrompt({
      kind,
      players: players.slice(0, 6),
      turnLines: turnLines.slice(-8),
      persona
    });
    const interview = await generateInterview(prompt);

    const voices = await getDutchVoices();
    const spectator = pickSpectatorVoice(voices);
    if (!spectator) throw new Error("No Dutch spectator voices available");

    const [audioQuestion, audioAnswer] = await Promise.all([
      tts(interview.question, COMMENTATOR_VOICE_ID),
      tts(interview.answer, spectator.voice_id)
    ]);

    const row = await dbService.createCommentary({
      matchRef,
      boundaryKey: key,
      question: interview.question,
      answer: interview.answer,
      persona,
      commentatorVoice: COMMENTATOR_VOICE_ID,
      spectatorVoice: spectator.voice_id,
      spectatorName: spectator.name,
      audioQuestion,
      audioAnswer
    });
    return json({ cached: false, ...row });
  } catch (e) {
    return json(
      { error: `Commentary generation failed: ${String(e).slice(0, 200)}` },
      { status: 502 }
    );
  }
};
