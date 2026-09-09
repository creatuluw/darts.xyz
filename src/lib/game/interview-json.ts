/**
 * Interview JSON parsing — pure, extracted from the server client so vitest
 * can test it ($env/dynamic/private doesn't resolve under vitest).
 */
export interface InterviewResult {
	question: string;
	answer: string;
	analysis: string;
	outlook: string;
}

const FIELDS: (keyof InterviewResult)[] = ['question', 'answer', 'analysis', 'outlook'];

/** Extracts the first JSON object from a possibly chatty LLM response. */
export function parseInterview(raw: string): InterviewResult {
	const start = raw.indexOf('{');
	const end = raw.lastIndexOf('}');
	if (start === -1 || end === -1 || end <= start) {
		throw new Error('LLM response contained no JSON object');
	}
	const parsed = JSON.parse(raw.slice(start, end + 1));
	for (const f of FIELDS) {
		if (typeof parsed[f] !== 'string') throw new Error(`LLM JSON missing ${f}`);
	}
	return parsed as InterviewResult;
}
