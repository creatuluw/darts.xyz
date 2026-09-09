<script lang="ts">
    import { onMount } from "svelte";
    import { page as pageStore } from "$app/stores";
    import { IconCast, IconLink } from "@tabler/icons-svelte";
    import TvCommentary from "$lib/components/tv/TvCommentary.svelte";
    import TvStage from "$lib/components/tv/TvStage.svelte";
    import { getCheckoutSuggestions } from "$lib/game/checkout-suggestions";
    import { addToast } from "$lib/stores/toast";

    const matchId = $derived($pageStore.params.id);

    type MatchRow = {
        id: string; startingScore: number; legsPerSet: number;
        setsPerMatch: number; status: string; winnerId: string | null;
    };
    type MatchPlayerRow = { id: string; playerId: string; throwOrder: number; setsWon: number; legsWon: number };
    type LegRow = { id: string; winnerId: string | null; firstThrowerId: string | null; setNumber: number; legNumber: number };
    type TurnRow = {
        legId: string; playerId: string; turnNumber: number;
        dart1Segment: number; dart1Multiplier: number;
        dart2Segment: number; dart2Multiplier: number;
        dart3Segment: number; dart3Multiplier: number;
        dartsThrown: number; totalScore: number; remainingScore: number;
    };

    let match = $state<MatchRow | null>(null);
    let seats = $state<MatchPlayerRow[]>([]);
    let legs = $state<LegRow[]>([]);
    let turns = $state<TurnRow[]>([]);
    const names = $state<Record<string, string>>({}); // playerId → name
    let missing = $state(false);
    let finished = $state(false);

    const dartLabel = (segment: number, multiplier: number) =>
        segment === 0 ? "Miss" : `${multiplier === 3 ? "T" : multiplier === 2 ? "D" : ""}${segment === 25 && multiplier === 2 ? "Bull" : segment}`;

    function turnDarts(t: TurnRow): Array<[number, number]> {
        const all: Array<[number, number]> = [
            [t.dart1Segment, t.dart1Multiplier],
            [t.dart2Segment, t.dart2Multiplier],
            [t.dart3Segment, t.dart3Multiplier]
        ];
        return all.slice(0, t.dartsThrown);
    }

    const activeLeg = $derived(legs.length ? legs[legs.length - 1] : null);
    const legTurns = $derived(
        activeLeg ? turns.filter((t) => t.legId === activeLeg.id) : []
    );

    const activeSeatIdx = $derived.by(() => {
        if (!activeLeg || activeLeg.winnerId || seats.length === 0) return -1;
        const first = seats.findIndex((s) => s.id === activeLeg.firstThrowerId);
        if (first === -1) return 0;
        return (first + legTurns.length) % seats.length;
    });

    function remainingOf(playerId: string): number {
        if (!match) return 0;
        const mine = legTurns.filter((t) => t.playerId === playerId);
        return mine.length ? mine[mine.length - 1].remainingScore : match.startingScore;
    }

    function legAverage(playerId: string): string {
        const mine = legTurns.filter((t) => t.playerId === playerId);
        const darts = mine.reduce((n, t) => n + t.dartsThrown, 0);
        if (!darts) return "—";
        const score = mine.reduce((n, t) => n + t.totalScore, 0);
        return ((score / darts) * 3).toFixed(1);
    }

    const lastTurn = $derived.by(() => {
        if (!legTurns.length) return null;
        const t = legTurns[legTurns.length - 1];
        return {
            name: names[t.playerId] ?? "?",
            total: t.totalScore,
            labels: turnDarts(t).map(([s, m]) => dartLabel(s, m)),
        };
    });

    const checkout = $derived.by(() => {
        if (activeSeatIdx === -1 || !seats.length) return null;
        const seat = seats[activeSeatIdx];
        const remaining = remainingOf(seat.playerId);
        if (remaining <= 1 || remaining > 170) return null;
        const opt = getCheckoutSuggestions(remaining, 3)[0];
        return opt ? { name: names[seat.playerId] ?? "?", remaining, text: opt.description } : null;
    });

    // commentary inputs
    const turnLines = $derived(
        turns.map(
            (t) =>
                `${names[t.playerId] ?? "?"}: ${turnDarts(t)
                    .map(([s, m]) => dartLabel(s, m))
                    .join(" ")} = ${t.totalScore} (${t.remainingScore} resterend)`
        )
    );
    const playerNames = $derived(Object.values(names));

    const winner = $derived.by(() => {
        if (!match || match.status !== "completed" || !match.winnerId) return null;
        return { name: names[match.winnerId] ?? "?" };
    });

    function fmt(n: number | undefined) { return n === undefined ? "?" : String(n); }

    async function fetchNames() {
        const ids = seats.map((s) => s.playerId).filter((id) => !(id in names));
        await Promise.all(
            ids.map(async (id) => {
                try {
                    const res = await fetch(`/api/players/${id}`);
                    if (res.ok) names[id] = (await res.json()).name ?? "?";
                } catch { /* keep "?" */ }
            })
        );
    }

    async function poll() {
        if (finished || missing || document.hidden) return;
        try {
            const res = await fetch(`/api/matches/${matchId}`);
            if (res.status === 404) { missing = true; return; }
            if (!res.ok) return;
            const data = await res.json();
            match = data.match;
            const seatsChanged = JSON.stringify(data.matchPlayers) !== JSON.stringify(seats);
            seats = data.matchPlayers;
            legs = data.legs;
            if (seatsChanged) await fetchNames();
            const turnsRes = await fetch(`/api/matches/${matchId}/turns`);
            if (turnsRes.ok) turns = await turnsRes.json();
            if (match && match.status !== "in_progress") finished = true;
        } catch { /* transient — next tick retries */ }
    }

    function copyLink() {
        navigator.clipboard
            .writeText(window.location.href)
            .then(() => addToast("TV-link gekopieerd — deel hem met toeschouwers", "success"))
            .catch(() => addToast("Kon link niet kopiëren", "error"));
    }

    onMount(() => {
        poll();
        const timer = setInterval(() => { if (!finished) poll(); }, 1000);
        return () => clearInterval(timer);
    });
</script>

<svelte:head><title>TV — dart.monster</title></svelte:head>

<TvStage>
    <div class="h-full w-full bg-zinc-950 text-white p-10 flex flex-col select-none">
    {#if missing}
        <div class="flex-1 flex items-center justify-center">
            <p class="text-zinc-400 text-2xl">Wedstrijd niet gevonden.</p>
        </div>
    {:else if !match}
        <div class="flex-1 flex items-center justify-center">
            <p class="text-zinc-500 text-2xl animate-pulse">Laden…</p>
        </div>
    {:else}
        <!-- header: format + live dot + copy link -->
        <header class="flex items-center justify-between mb-10">
            <div class="flex items-center gap-4">
                <span class="font-display font-black text-4xl tracking-tight">DARTS</span>
                <span class="text-zinc-500 text-2xl">
                    {match.startingScore} · {fmt(match.legsPerSet)} legs × {fmt(match.setsPerMatch)} sets
                </span>
            </div>
            <div class="flex items-center gap-4">
                {#if !finished}
                    <span class="flex items-center gap-2 text-emerald-400 text-lg">
                        <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span> LIVE
                    </span>
                {/if}
                <button
                    class="flex items-center gap-2 text-zinc-400 hover:text-white border border-zinc-700 rounded-lg px-3 py-2 text-sm transition-colors"
                    onclick={copyLink}
                >
                    <IconLink class="w-5 h-5" /> Link kopiëren
                </button>
            </div>
        </header>

        <!-- player cards -->
        <div class="flex-1 grid gap-6 {seats.length > 4 ? 'grid-cols-3' : 'grid-cols-2'} content-center">
            {#each seats as seat, i (seat.id)}
                <div
                    class="rounded-2xl border-4 p-8 text-center transition-colors
                    {i === activeSeatIdx ? 'border-emerald-400 bg-zinc-900' : 'border-zinc-800 bg-zinc-900/50'}"
                >
                    <p class="text-2xl text-zinc-400 truncate {i === activeSeatIdx ? 'text-emerald-400' : ''}">
                        {names[seat.playerId] ?? "…"}
                        {#if i === activeSeatIdx}· gooit{/if}
                    </p>
                    <p class="font-display font-black text-9xl tabular-nums leading-none my-5">
                        {remainingOf(seat.playerId)}
                    </p>
                    <div class="flex items-center justify-center gap-6 text-xl text-zinc-400">
                        <span>S {seat.setsWon}</span>
                        <span>L {seat.legsWon}</span>
                        <span>avg {legAverage(seat.playerId)}</span>
                    </div>
                </div>
            {/each}
        </div>

        <!-- footer strip: last turn + checkout -->
        <footer class="mt-10 flex items-center justify-between gap-6 text-2xl">
            <div class="text-zinc-400 min-w-0">
                {#if lastTurn}
                    <span class="text-zinc-200">{lastTurn.name}</span>
                    <span class="mx-2">→</span>
                    {#each lastTurn.labels as l}<span class="inline-block bg-zinc-800 rounded-lg px-3 py-1 mx-1">{l}</span>{/each}}
                    <span class="ml-3 text-white font-bold">= {lastTurn.total}</span>
                {:else}
                    <span class="text-zinc-600">Eerste beurt…</span>
                {/if}
            </div>
            {#if checkout}
                <div class="text-amber-300 whitespace-nowrap">
                    Checkout <span class="text-white font-bold">{checkout.remaining}</span>: {checkout.text}
                </div>
            {/if}
        </footer>

        <!-- winner card -->
        {#if finished && winner}
            <div class="fixed inset-0 z-10 bg-zinc-950/95 flex flex-col items-center justify-center text-center">
                <p class="text-emerald-400 text-2xl mb-2">Wedstrijd afgelopen</p>
                <p class="font-display font-black text-8xl mb-4">{winner.name}</p>
                <p class="text-zinc-400 text-2xl">wint met {seats.find(s => s.playerId === match!.winnerId)?.setsWon ?? 0}–{seats.filter(s => s.playerId !== match!.winnerId).map(s => s.setsWon).join("/") ?? 0} sets</p>
            </div>
        {/if}

        {#if match}
            <TvCommentary
                matchRef={`classic:${match.id}`}
                kind="classic"
                turnCount={turns.length}
                {turnLines}
                players={playerNames}
                done={finished}
            />
        {/if}
    {/if}
</div>
</TvStage>
