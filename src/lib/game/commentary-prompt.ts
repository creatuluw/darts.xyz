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
	kind: 'classic' | 'conquest' | 'risk';
	players: string[];
	turnLines: string[];
	persona: SpectatorPersona;
	/** Commentator names — who asks (interview) and who analyses. */
	asker?: string;
	analyst?: string;
	/** Earlier turn lines, offered to the analyst for comparison. */
	priorLines?: string[];
}

/** Builds the full Dutch interview prompt; response must be strict JSON. */
export function buildInterviewPrompt(input: InterviewInput): string {
	const games: Record<InterviewInput['kind'], string> = {
		classic: 'een klassieke x01-dartwedstrijd',
		conquest: 'Trebles & Territories (Risk-darts op het bord)',
		risk: 'Risk 42 (world-map Risk op het dartbord: gebieden, legers, het Arsenaal op de bull)'
	};
	const game = games[input.kind];
	const asker = input.asker ?? 'Leo';
	const analyst = input.analyst ?? 'Theodore';
	const hasPrior = (input.priorLines?.length ?? 0) > 0;
	const priorBlock = hasPrior
		? ['', 'Eerdere context (alleen ter vergelijking voor de analyse):', ...(input.priorLines ?? []).map((l) => `- ${l}`)]
		: [];
	const lines = [
		`Je bent een dartcommentator bij ${game}.`,
		`Commentatoren: ${asker} (interviewer) en ${analyst} (analyticus).`,
		`Spelers: ${input.players.join(', ')}.`,
		'',
		'Laatste beurten (nieuwste onderaan):',
		...input.turnLines.map((l) => `- ${l}`),
		...priorBlock
	];
	lines.push(
		'',
		`Taak 1: Stel als commentator ${asker} één scherpe, gevatte vraag in het Nederlands over deze beurten. Reageer op het opvallendste moment — een treffer, een misser, een ommezwaai — en daag de toeschouwer uit.`,
		`Taak 2: Beantwoord die vraag als toeschouwer ${input.persona.name} — toon: ${input.persona.tone.trim()}, stijl: ${input.persona.style}. Geef een eerlijke, kleurrijke, grappige mening in het Nederlands: juich, kreun of spot — maar reageer op wat er echt gebeurde.`,
		`Taak 3: Geef daarna als commentator ${analyst} jouw eigen deskundige analyse in het Nederlands, vanuit eigen ervaring en expertise. Dit is een improvisatieslot: je mag vergelijken met eerdere beurten${hasPrior ? ' (Eerdere context)' : ''} of met andere spelers om het spannender te maken. Reken vooruit: wat moet er gebeuren om te winnen?`,
		`Taak 4: Sluit af als commentator ${analyst} met wat je hoopt dat er hierna gebeurt, en eindig met een leuke, spannende cliffhanger in het Nederlands.`,
		'Belangrijk — feiten first:',
		'- Gebruik ALLEEN de beurten en spelers die hierboven genoemd worden. Verzin GEEN worpen, scores of gebeurtenissen die niet in de lijst staan.',
		'- Een grap of overdrijving mag, maar de feiten eronder moeten kloppen met de lijst.',
		'- Houd het levendig en betrokken: dit is een feestje, geen nieuwsuitzending.',
		'Houd alle vier de teksten kort (max 3 zinnen elk).',
		'',
		'Antwoord ALLEEN met geldige JSON, zonder markdown:',
		'{"question": "<vraag van de commentator>", "answer": "<antwoord van de toeschouwer>", "analysis": "<analyse van de commentator>", "outlook": "<vooruitblik met cliffhanger>"}'
	);
	return lines.join('\n');
}
