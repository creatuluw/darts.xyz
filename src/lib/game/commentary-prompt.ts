/**
 * Commentary prompt building — pure. Dutch interviews: a commentator question
 * about the last N turns, answered by a random-persona synthetic spectator.
 */
export interface SpectatorPersona {
	name: string;
	tone: string;
	style: string;
}

/** Dutch vox-pop personas: tone and style steer the LLM's spectator voice. */
export const PERSONAS: SpectatorPersona[] = [
	{ name: 'Ome Gerrit', tone: 'mopperig', style: 'café-prater met 40 jaar ervaring' },
	{ name: 'Familie Van Dijk', tone: 'overdreven enthousiast', style: 'brul met de hele familie mee' },
	{ name: 'Jasmien', tone: 'analytisch', style: 'rekent alles uit als een accountant' },
	{ name: 'Ruud', tone: 'droogkomisch', style: 'onderstatement als levensstijl' },
	{ name: 'Bram', tone: 'nerveus', style: 'bijt op zijn nagels en leeft mee' },
	{ name: 'Mevr. De Vries', tone: 'warm', style: 'buurvrouw die koekjes meebrengt' },
	{ name: 'Kick', tone: 'chaotisch', style: 'roept rake dingen op het verkeerde moment' },
	{ name: 'Lidewij', tone: 'poëtisch', style: 'ziet metaforen in elke pijl' }
];

export function pickPersona(rand: () => number = Math.random): SpectatorPersona {
	return PERSONAS[Math.min(PERSONAS.length - 1, Math.floor(rand() * PERSONAS.length))];
}

export interface InterviewInput {
	kind: 'classic' | 'conquest';
	players: string[];
	turnLines: string[];
	persona: SpectatorPersona;
}

/** Builds the full Dutch interview prompt; response must be strict JSON. */
export function buildInterviewPrompt(input: InterviewInput): string {
	const game =
		input.kind === 'conquest'
			? 'Trebles & Territories (Risk-darts op het bord)'
			: 'een klassieke x01-dartwedstrijd';
	return [
		`Je bent een dartcommentator bij ${game}.`,
		`Spelers: ${input.players.join(', ')}.`,
		'',
		'Laatste beurten (nieuwste onderaan):',
		...input.turnLines.map((l) => `- ${l}`),
		'',
		`Taak 1: Stel als commentator één scherpe, gevatte vraag in het Nederlands over deze beurten.`,
		`Taak 2: Beantwoord die vraag als toeschouwer ${input.persona.name} — toon: ${input.persona.tone.trim()}, stijl: ${input.persona.style}. Geef een eerlijke, kleurrijke mening in het Nederlands.`,
		'Houd beide teksten kort (max 3 zinnen elk).',
		'',
		'Antwoord ALLEEN met geldige JSON, zonder markdown:',
		'{"question": "<vraag van de commentator>", "answer": "<antwoord van de toeschouwer>"}'
	].join('\n');
}
