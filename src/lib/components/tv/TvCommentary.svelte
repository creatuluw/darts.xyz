<script lang="ts">
    import { IconPlayerPause, IconPlayerPlay, IconMessage } from "@tabler/icons-svelte";
    import { addToast } from "$lib/stores/toast";
    import {
        DEFAULT_COMMENTARY_CADENCE,
        newBoundaries,
        enqueueBoundaries,
    } from "$lib/game/commentary-cadence";
    import { COMMENTATORS } from "$lib/game/elevenlabs-voices";

    function commentatorName(voiceId: string | null | undefined): string {
        return COMMENTATORS.find((c) => c.voiceId === voiceId)?.name ?? "Commentator";
    }

    let {
        matchRef,
        kind,
        turnCount,
        turnLines,
        players,
        done = false,
    }: {
        matchRef: string;
        kind: "classic" | "conquest" | "risk";
        turnCount: number;
        turnLines: string[];
        players: string[];
        done?: boolean;
    } = $props();

    // ── per-match settings (localStorage) ─────────────────────────────
    const storeKey = `tv_commentary_${matchRef}`;
    const saved = JSON.parse(localStorage.getItem(storeKey) ?? "{}") as {
        paused?: boolean;
        n?: number;
    };
    let paused = $state(saved.paused ?? false);
    let n = $state(saved.n ?? DEFAULT_COMMENTARY_CADENCE);
    $effect(() => {
        localStorage.setItem(storeKey, JSON.stringify({ paused, n }));
    });

    // ── boundary detection ────────────────────────────────────────────
    let prevTurnCount = turnCount;
    let inFlight = $state(false);
    // boundaries that arrive while a broadcast is generating/playing — drained, never dropped
    let pending: number[] = [];

    interface Playing {
        question: string;
        answer: string;
        analysis: string;
        outlook: string;
        spectatorName: string;
        askerName: string;
        analystName: string;
        audioQuestion: string | null;
        audioAnswer: string | null;
        audioAnalysis: string | null;
        audioOutlook: string | null;
    }
    let playing = $state<Playing | null>(null);
    let subtitle = $state("");
    let speaker = $state("");
    let speakerRole = $state("");

    // ── replay drawer: every segment ever broadcast for this match ─────
    interface HistoryEntry { boundary: number; speaker: string; role: string; text: string; at: number; }
    let history = $state<HistoryEntry[]>([]);
    let drawerOpen = $state(false);

    $effect(() => {
        // seed the drawer with commentary generated before this TV joined
        fetch(`/api/commentary/${encodeURIComponent(matchRef)}?all=1`)
            .then((r) => (r.ok ? r.json() : []))
            .then((rows: Array<{ boundaryKey: string; question: string; answer: string; analysis: string | null; outlook: string | null; spectatorName: string | null; commentatorVoice: string | null; analystVoice: string | null; createdAt: string }>) => {
                const seeded: HistoryEntry[] = [];
                for (const r of rows) {
                    const b = Number(r.boundaryKey.split(":").pop()) || 0;
                    const asker = commentatorName(r.commentatorVoice);
                    const analyst = commentatorName(r.analystVoice);
                    const spec = r.spectatorName ?? "Toeschouwer";
                    seeded.push({ boundary: b, speaker: asker, role: "presentator", text: r.question, at: Date.parse(r.createdAt) || 0 });
                    seeded.push({ boundary: b, speaker: spec, role: "toeschouwer", text: r.answer, at: Date.parse(r.createdAt) || 0 });
                    if (r.analysis) seeded.push({ boundary: b, speaker: analyst, role: "analist", text: r.analysis, at: Date.parse(r.createdAt) || 0 });
                    if (r.outlook) seeded.push({ boundary: b, speaker: analyst, role: "vooruitblik", text: r.outlook, at: Date.parse(r.createdAt) || 0 });
                }
                // only seed if we haven't already broadcast these live (no dupes)
                if (history.filter((h) => h.boundary > 0).length === 0) history = seeded;
            })
            .catch(() => {});
    });

    /** Human reading/speaking time for a segment — subtitles and audio caps use it. */
    function segmentMs(text: string): number {
        return Math.min(30_000, 3500 + text.length * 90); // ~11 chars/s + buffer
    }

    function playBase64(b64: string | null, text: string, who: string, role: string): Promise<void> {
        subtitle = text;
        speaker = who;
        speakerRole = role;
        if (!b64) {
            // no audio (fake mode / generation without TTS) — subtitle only
            return new Promise((resolve) => setTimeout(resolve, segmentMs(text)));
        }
        return new Promise((resolve) => {
            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                resolve();
            };
            // ponytail: hidden/throttled windows never fire onended — cap every segment
            const cap = setTimeout(finish, segmentMs(text));
            const audio = new Audio(`data:audio/mpeg;base64,${b64}`);
            audio.onended = () => { clearTimeout(cap); finish(); };
            audio.onerror = () => { clearTimeout(cap); finish(); };
            audio.play().catch(() => { clearTimeout(cap); setTimeout(finish, 4000); }); // autoplay blocked → subtitles carry it
        });
    }

    async function play(interview: Playing, boundary: number) {
        playing = interview;
        await playBase64(interview.audioQuestion, interview.question, interview.askerName, "presentator");
        history = [...history, { boundary, speaker: interview.askerName, role: "presentator", text: interview.question, at: Date.now() }];
        await playBase64(interview.audioAnswer, interview.answer, interview.spectatorName, "toeschouwer");
        history = [...history, { boundary, speaker: interview.spectatorName, role: "toeschouwer", text: interview.answer, at: Date.now() }];
        // analyst segments — skip silently on cached rows from before the 4-segment format
        if (interview.analysis) {
            await playBase64(interview.audioAnalysis, interview.analysis, interview.analystName, "analist");
            history = [...history, { boundary, speaker: interview.analystName, role: "analist", text: interview.analysis, at: Date.now() }];
        }
        if (interview.outlook) {
            await playBase64(interview.audioOutlook, interview.outlook, interview.analystName, "vooruitblik");
            history = [...history, { boundary, speaker: interview.analystName, role: "vooruitblik", text: interview.outlook, at: Date.now() }];
        }
        playing = null;
        subtitle = "";
        speaker = "";
        speakerRole = "";
    }

    async function generate(boundary: number) {
        inFlight = true;
        try {
            const res = await fetch("/api/commentary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: AbortSignal.timeout(60_000), // hung upstream must not pin the pill
                body: JSON.stringify({
                    matchRef,
                    boundary,
                    kind,
                    players,
                    turnLines: turnLines.slice(-n),
                    // earlier turns: comparison context for the analyst
                    priorLines: turnLines.slice(-(n + 8), -n),
                }),
            });
            if (!res.ok) {
                addToast("Commentaar mislukt — even geen interview", "error", 30_000);
                return;
            }
            const data = await res.json();
            await play({
                question: data.question,
                answer: data.answer,
                analysis: data.analysis ?? "",
                outlook: data.outlook ?? "",
                spectatorName: data.spectatorName,
                askerName: commentatorName(data.commentatorVoice),
                analystName: commentatorName(data.analystVoice),
                audioQuestion: data.audioQuestion,
                audioAnswer: data.audioAnswer,
                audioAnalysis: data.audioAnalysis,
                audioOutlook: data.audioOutlook,
            }, boundary);
        } catch {
            addToast("Commentaar mislukt — even geen interview", "error", 30_000);
        } finally {
            inFlight = false;
            // drain the queue — a boundary that arrived mid-broadcast still fires
            if (pending.length > 0 && !done && !paused && !document.hidden) {
                generate(pending.shift()!);
            }
        }
    }

    $effect(() => {
        if (done || paused || document.hidden) {
            prevTurnCount = turnCount;
            return;
        }
        const fresh = newBoundaries(prevTurnCount, turnCount, n);
        prevTurnCount = turnCount;
        if (fresh.length > 0) pending = enqueueBoundaries(pending, fresh);
        if (pending.length > 0 && !inFlight) generate(pending.shift()!);
    });

    function setN(v: number) {
        prevTurnCount = turnCount; // don't fire a burst when the cadence changes
        n = v;
    }
</script>

<!-- controls -->
<div class="fixed bottom-4 left-4 z-20 flex items-center gap-2">
    <button
        aria-label={paused ? "Commentaar hervatten" : "Commentaar pauzeren"}
        onclick={() => (paused = !paused)}
        class="flex items-center gap-2 rounded-full bg-zinc-900/90 border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:text-white transition-colors"
    >
        {#if paused}
            <IconPlayerPlay class="w-4 h-4" />
        {:else}
            <IconPlayerPause class="w-4 h-4" />
        {/if}
        {paused ? "Commentaar staat stil" : "Commentaar live"}
    </button>
    <label class="flex items-center gap-1.5 rounded-full bg-zinc-900/90 border border-zinc-700 px-3 py-2 text-sm text-zinc-400">
        elke
        <select
            class="bg-transparent text-zinc-200 outline-none"
            value={n}
            onchange={(e) => setN(Number((e.target as HTMLSelectElement).value))}
        >
            {#each [2, 3, 4, 6] as opt (opt)}
                <option value={opt}>{opt}</option>
            {/each}
        </select>
        beurten
    </label>
    <button
        aria-label="Commentaar teruglezen"
        onclick={() => (drawerOpen = !drawerOpen)}
        class="flex items-center gap-2 rounded-full bg-zinc-900/90 border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:text-white transition-colors"
    >
        <IconMessage class="w-4 h-4" />
        Teruglezen ({history.length})
    </button>
</div>

<!-- subtitles: speaker + role make the host → spectator → analyst flow readable -->
{#if subtitle}
    <div class="fixed bottom-1.5 left-1/2 -translate-x-1/2 z-20 max-w-xl text-center px-6">
        <p class="mb-1 flex items-center justify-center gap-2 text-sm font-semibold">
            <span class="rounded-full px-2 py-0.5 text-xs uppercase tracking-wider
                {speakerRole === 'presentator' ? 'bg-emerald-500/20 text-emerald-300'
                : speakerRole === 'toeschouwer' ? 'bg-amber-500/20 text-amber-300'
                : 'bg-sky-500/20 text-sky-300'}">{speakerRole}</span>
            <span class="text-zinc-200">{speaker}</span>
        </p>
        <p class="bg-zinc-900/90 border border-zinc-700 rounded-xl px-5 py-3 text-lg text-zinc-100 leading-snug">
            {subtitle}
        </p>
    </div>
{/if}

<!-- replay drawer: every broadcast segment, newest first -->
{#if drawerOpen}
    <div class="fixed inset-0 z-30 bg-zinc-950/60" onclick={() => (drawerOpen = false)} aria-hidden="true"></div>
    <aside class="fixed top-0 right-0 bottom-0 z-40 w-[440px] max-w-[90vw] bg-zinc-950/95 border-l border-zinc-800 flex flex-col">
        <div class="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 class="font-bold text-lg">Commentaar</h2>
            <button class="text-zinc-400 hover:text-white text-sm" onclick={() => (drawerOpen = false)}>Sluiten ✕</button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
            {#each [...history].reverse() as h, i (history.length - i)}
                <div class="rounded-xl bg-zinc-900/70 border border-zinc-800 p-3">
                    <p class="flex items-center gap-2 text-xs mb-1.5">
                        <span class="rounded-full px-2 py-0.5 uppercase tracking-wider font-semibold
                            {h.role === 'presentator' ? 'bg-emerald-500/20 text-emerald-300'
                            : h.role === 'toeschouwer' ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-sky-500/20 text-sky-300'}">{h.role}</span>
                        <span class="text-zinc-300 font-semibold">{h.speaker}</span>
                        <span class="ml-auto text-zinc-500">beurt {h.boundary}</span>
                    </p>
                    <p class="text-sm text-zinc-300 leading-snug">{h.text}</p>
                </div>
            {:else}
                <p class="text-zinc-500 text-sm text-center py-8">Nog geen commentaar uitgezonden.</p>
            {/each}
        </div>
    </aside>
{/if}

<!-- generating indicator -->
{#if inFlight}
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-zinc-400 text-sm bg-zinc-900/90 border border-zinc-700 rounded-full px-4 py-2">
        <IconMessage class="w-4 h-4 animate-pulse" /> Interview komt eraan…
    </div>
{/if}
