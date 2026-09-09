/**
 * DeepSeek chat client — server-side only (DEEPSEEK_API_KEY).
 * https://api-docs.deepseek.com/ · OpenAI-compatible endpoint.
 * Model: deepseek-v4-flash (fast enough to keep commentary snappy).
 */
import { env } from "$env/dynamic/private";
import { parseInterview, type InterviewResult } from "$lib/game/interview-json";

export type { InterviewResult };

const ENDPOINT = "https://api.deepseek.com/chat/completions";
const MODEL = "deepseek-v4-flash";
const TIMEOUT_MS = 45_000;

/** Sends the interview prompt; returns Dutch {question, answer, analysis, outlook}. */
export async function generateInterview(prompt: string): Promise<InterviewResult> {
	const res = await fetch(ENDPOINT, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			model: MODEL,
			messages: [{ role: "user", content: prompt }],
			temperature: 1
		}),
		signal: AbortSignal.timeout(TIMEOUT_MS)
	});
	if (!res.ok) throw new Error(`deepseek ${res.status}: ${(await res.text()).slice(0, 200)}`);
	const data = await res.json();
	const content: string = data.choices?.[0]?.message?.content ?? "";
	return parseInterview(content);
}
