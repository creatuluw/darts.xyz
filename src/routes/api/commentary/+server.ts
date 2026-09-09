import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";
import { generateInterview } from "$lib/server/opencode";
import { getDutchVoices, tts } from "$lib/server/elevenlabs";
import {
	pickSpectatorVoice,
	commentatorPair
} from "$lib/game/elevenlabs-voices";
import { buildInterviewPrompt, pickPersona } from "$lib/game/commentary-prompt";
import { boundaryKey } from "$lib/game/commentary-cadence";

/**
 * Generate (or return cached) a Dutch interview for a completed N-turn
 * boundary: asker questions a spectator, the analyst analyses + cliffhangs.
 * Commentators swap roles per boundary. Called only by an open, unpaused
 * 2nd screen. COMMENTARY_FAKE=1 → deterministic canned text, no spend.
 */
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => null);
  const { matchRef, boundary, kind, players, turnLines, priorLines } = body ?? {};
  if (
    typeof matchRef !== "string" ||
    !matchRef ||
    typeof boundary !== "number" ||
    boundary < 1 ||
    (kind !== "classic" && kind !== "conquest" && kind !== "risk") ||
    !Array.isArray(players) ||
    !Array.isArray(turnLines) ||
    turnLines.length === 0
  ) {
    return json({ error: "Invalid commentary request" }, { status: 400 });
  }

  const key = boundaryKey(matchRef, boundary);

  const cached = await dbService.getCommentary(key);
  if (cached) return json({ cached: true, ...cached });

  const { asker, analyst } = commentatorPair(boundary);
  const context = Array.isArray(priorLines) ? priorLines.filter((l) => typeof l === "string") : [];

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
      analysis: `${analyst.name} hier — als ik die cijfers naast eerdere beurten leg, zie ik een stijgende lijn. Dit gaat morgen nog interessant worden.`,
      outlook: `Ik hoop op een negendarter — en laat de volgende beurt nou net de kans zijn om het te bewijzen…`,
      persona: { name: "Fake Fan", tone: "test", style: "test" },
      commentatorVoice: asker.voiceId,
      analystVoice: analyst.voiceId,
      spectatorVoice: "fake",
      spectatorName: "Fake Fan",
      audioQuestion: null,
      audioAnswer: null,
      audioAnalysis: null,
      audioOutlook: null
    });
    return json({ cached: false, ...row });
  }

  try {
    const persona = pickPersona();
    const prompt = buildInterviewPrompt({
      kind,
      players: players.slice(0, 6),
      turnLines: turnLines.slice(-8),
      priorLines: context.slice(-8),
      asker: asker.name,
      analyst: analyst.name,
      persona
    });
    // LLM and voice-list fetch run concurrently — the voice list is cached per process
    const [interview, voices] = await Promise.all([
      generateInterview(prompt),
      getDutchVoices()
    ]);
    const spectator = pickSpectatorVoice(voices);
    if (!spectator) throw new Error("No Dutch spectator voices available");

    // ponytail: one flaky TTS call must not kill the broadcast — a failed
    // segment degrades to subtitles-only (null audio); only LLM failure 502s
    const ttsSoft = (text: string, voiceId: string) =>
      tts(text, voiceId).catch(() => null);
    const [audioQuestion, audioAnswer, audioAnalysis, audioOutlook] = await Promise.all([
      ttsSoft(interview.question, asker.voiceId),
      ttsSoft(interview.answer, spectator.voice_id),
      ttsSoft(interview.analysis, analyst.voiceId),
      ttsSoft(interview.outlook, analyst.voiceId)
    ]);

    const row = await dbService.createCommentary({
      matchRef,
      boundaryKey: key,
      question: interview.question,
      answer: interview.answer,
      analysis: interview.analysis,
      outlook: interview.outlook,
      persona,
      commentatorVoice: asker.voiceId,
      analystVoice: analyst.voiceId,
      spectatorVoice: spectator.voice_id,
      spectatorName: persona.name,
      audioQuestion,
      audioAnswer,
      audioAnalysis,
      audioOutlook
    });
    return json({ cached: false, ...row });
  } catch (e) {
    return json(
      { error: `Commentary generation failed: ${String(e).slice(0, 200)}` },
      { status: 502 }
    );
  }
};
