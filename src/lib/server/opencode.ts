/**
 * OpenCode zen/go LLM client — server-side only (OPENCODE_API).
 * Endpoint requires x-opencode-session + custom User-Agent (verified 200 OK).
 */
import { env } from "$env/dynamic/private";
import { randomUUID } from "node:crypto";
import { parseInterview, type InterviewResult } from "$lib/game/interview-json";

export type { InterviewResult };

const ENDPOINT = "https://opencode.ai/zen/go/v1/chat/completions";
const MODEL = "glm-5.3-flash";
const TIMEOUT_MS = 20_000;

/** Sends the interview prompt; returns Dutch {question, answer}. */
export async function generateInterview(prompt: string): Promise<InterviewResult> {
	const res = await fetch(ENDPOINT, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${env.OPENCODE_API}`,
			"Content-Type": "application/json",
			"x-opencode-session": randomUUID(),
			"User-Agent": "dart-monster/1.0"
		},
		body: JSON.stringify({
			model: MODEL,
			messages: [{ role: "user", content: prompt }],
			temperature: 1
		}),
		signal: AbortSignal.timeout(TIMEOUT_MS)
	});
	if (!res.ok) throw new Error(`opencode ${res.status}: ${(await res.text()).slice(0, 200)}`);
	const data = await res.json();
	const content: string = data.choices?.[0]?.message?.content ?? "";
	return parseInterview(content);
}
