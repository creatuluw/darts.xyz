/**
 * Defensive sentence cap for LLM commentary segments. The prompt asks for
 * max 3 short sentences per segment, but the LLM sometimes overruns — this
 * pure post-trim clamps each segment to its first N sentences so TTS and the
 * broadcast never outlive the format. Split on `.`, `!`, `?` boundaries.
 */
export const MAX_COMMENTARY_SENTENCES = 3;

export interface CommentarySegments {
	question: string;
	answer: string;
	analysis: string;
	outlook: string;
}

/** Keep only the first `max` sentences of `text` (empty-safe). */
export function trimToSentences(text: string, max: number = MAX_COMMENTARY_SENTENCES): string {
	if (typeof text !== 'string') return '';
	const trimmed = text.trim();
	if (!trimmed) return '';
	// split after sentence-ending punctuation, keeping the delimiter
	const parts = trimmed.split(/(?<=[.!?])\s+/);
	if (parts.length <= max) return trimmed;
	return parts.slice(0, max).join(' ');
}

/** Clamp all four broadcast segments to the sentence cap. */
export function trimInterview(interview: CommentarySegments): CommentarySegments {
	return {
		question: trimToSentences(interview.question),
		answer: trimToSentences(interview.answer),
		analysis: trimToSentences(interview.analysis),
		outlook: trimToSentences(interview.outlook)
	};
}
