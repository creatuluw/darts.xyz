<script lang="ts">
    import { IconPlayerPause, IconPlayerPlay, IconMessage } from "@tabler/icons-svelte";
    import { addToast } from "$lib/stores/toast";
    import {
        DEFAULT_COMMENTARY_CADENCE,
        newBoundaries,
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
        kind: "classic" | "conquest";
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

    function playBase64(b64: string | null, text: string, who: string): Promise<void> {
        subtitle = text;
        speaker = who;
        if (!b64) {
            // no audio (fake mode / generation without TTS) — subtitle only
            return new Promise((resolve) => setTimeout(resolve, 4000));
        }
        return new Promise((resolve) => {
            const audio = new Audio(`data:audio/mpeg;base64,${b64}`);
            audio.onended = () => resolve();
            audio.onerror = () => resolve();
            audio.play().catch(() => setTimeout(resolve, 4000)); // autoplay blocked → subtitles carry it
        });
    }

    async function play(interview: Playing) {
        playing = interview;
        await playBase64(interview.audioQuestion, interview.question, interview.askerName);
        await playBase64(interview.audioAnswer, interview.answer, interview.spectatorName);
        // analyst segments — skip silently on cached rows from before the 4-segment format
        if (interview.analysis) {
            await playBase64(interview.audioAnalysis, interview.analysis, interview.analystName);
        }
        if (interview.outlook) {
            await playBase64(interview.audioOutlook, interview.outlook, interview.analystName);
        }
        playing = null;
        subtitle = "";
        speaker = "";
    }

    async function generate(boundary: number) {
        inFlight = true;
        try {
            const res = await fetch("/api/commentary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
            });
        } catch {
            addToast("Commentaar mislukt — even geen interview", "error", 30_000);
        } finally {
            inFlight = false;
        }
    }

    $effect(() => {
        if (done || paused || document.hidden) {
            prevTurnCount = turnCount;
            return;
        }
        const fresh = newBoundaries(prevTurnCount, turnCount, n);
        prevTurnCount = turnCount;
        if (fresh.length > 0 && !inFlight) generate(fresh[fresh.length - 1]);
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
</div>

<!-- subtitles -->
{#if subtitle}
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-2xl text-center px-6">
        <p class="text-emerald-400 text-sm font-semibold mb-1">{speaker}</p>
        <p class="bg-zinc-900/90 border border-zinc-700 rounded-xl px-5 py-3 text-lg text-zinc-100 leading-snug">
            {subtitle}
        </p>
    </div>
{/if}

<!-- generating indicator -->
{#if inFlight}
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-zinc-400 text-sm bg-zinc-900/90 border border-zinc-700 rounded-full px-4 py-2">
        <IconMessage class="w-4 h-4 animate-pulse" /> Interview komt eraan…
    </div>
{/if}
