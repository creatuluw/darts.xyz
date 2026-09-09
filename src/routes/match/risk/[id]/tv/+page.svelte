<script lang="ts">
    import { onMount } from "svelte";
    import { page as pageStore } from "$app/stores";
    import { IconLink } from "@tabler/icons-svelte";
    import TvStage from "$lib/components/tv/TvStage.svelte";
    import RiskBoard from "$lib/components/risk/RiskBoard.svelte";
    import {
        budgetWithSources,
        isExiled,
        standings,
        type RiskGameState,
    } from "$lib/game/risk-engine";
    import { addToast } from "$lib/stores/toast";

    const gameId = $derived($pageStore.params.id);

    const PLAYER_COLORS = [
        "#9B2226",
        "#023047",
        "#FB8500",
        "#AE2012",
        "#8ECAE6",
        "#BB3E03",
    ];

    let game = $state(null as RiskGameState | null);
    let players = $state<{ id: string; name: string; color: string; initials: string }[]>([]);
    let missing = $state(false);
    let frozen = $state(false);

    const nameOf = (id: string) => players.find((p) => p.id === id)?.name ?? "?";
    const colorOf = (id: string) => players.find((p) => p.id === id)?.color ?? "#52525b";

    const phaseText = $derived.by(() => {
        if (!game) return "";
        if (game.winner) return "Afgelopen";
        if (game.tie) return `Horn! Gelijkspel — tiebreak: ${game.tie.map(nameOf).join(" vs ")}`;
        return `${nameOf(game.turn.playerId)} gooit`;
    });

    async function poll() {
        if (frozen || missing || document.hidden) return;
        try {
            const res = await fetch(`/api/conquest/${gameId}`);
            if (res.status === 404) { missing = true; return; }
            if (!res.ok) return;
            const data = await res.json();
            const g = data.state?.game as RiskGameState | undefined;
            if (!g || !Array.isArray(g.boxes) || !g.turn) return;
            game = g;
            players = (data.state.players ?? []).map(
                (p: { id: string; name: string }, i: number) => ({
                    id: p.id,
                    name: p.name,
                    color: PLAYER_COLORS[i % PLAYER_COLORS.length],
                    initials: p.name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
                }),
            );
            if (g.winner !== null) frozen = true;
        } catch { /* transient */ }
    }

    function copyLink() {
        navigator.clipboard
            .writeText(window.location.href)
            .then(() => addToast("TV-link gekopieerd — deel hem met toeschouwers", "success"))
            .catch(() => addToast("Kon link niet kopiëren", "error"));
    }

    onMount(() => {
        poll();
        const timer = setInterval(() => { if (!frozen) poll(); }, 1000);
        return () => clearInterval(timer);
    });
</script>

<svelte:head><title>TV — Risk 42</title></svelte:head>

<TvStage>
    <div class="h-full w-full bg-zinc-950 text-white p-8 flex flex-col select-none">
        {#if missing}
            <div class="flex-1 flex items-center justify-center">
                <p class="text-zinc-400 text-2xl">Spel niet gevonden.</p>
            </div>
        {:else if !game}
            <div class="flex-1 flex items-center justify-center">
                <p class="text-zinc-500 text-2xl animate-pulse">Laden…</p>
            </div>
        {:else}
            <header class="flex items-center justify-between mb-6">
                <div class="flex items-baseline gap-4">
                    <span class="font-display font-black text-3xl tracking-tight">RISK 42</span>
                    <span class="text-zinc-500 text-xl">
                        {game.mode === "clock" ? `Klok · ${game.clockTurns} beurten per speler` : "Domination"}
                    </span>
                    <span class="text-zinc-500 text-xl">Beurt {game.turn.index}</span>
                </div>
                <div class="flex items-center gap-4">
                    {#if !frozen}
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

            <!-- phase banner -->
            <div class="rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 mb-6 flex items-center justify-between gap-4">
                <p class="text-2xl font-bold {game.winner || game.tie ? 'text-zinc-500' : 'text-emerald-300'}">
                    {phaseText}
                </p>
                {#if !game.winner && !game.tie}
                    <div class="flex items-center gap-4 text-xl">
                        {#if game.turn.charge > 0}
                            <span class="text-amber-300 font-bold">⚡ +{game.turn.charge}</span>
                        {/if}
                        {#each Array(game.turn.dartsLeft) as _}
                            <span class="inline-block w-2.5 h-8 rounded-full bg-zinc-200"></span>
                        {/each}
                        <span class="text-zinc-400">{budgetWithSources(game).total} darts</span>
                    </div>
                {/if}
            </div>

            <div class="flex-1 min-h-0 grid grid-cols-[1fr_26rem] gap-6 items-center justify-items-center">
                <div class="self-stretch h-full aspect-square max-w-full flex items-center justify-center">
                    <RiskBoard
                        state={game}
                        playerColor={Object.fromEntries(players.map((p) => [p.id, p.color]))}
                        playerInitials={Object.fromEntries(players.map((p) => [p.id, p.initials]))}
                        onHit={() => {}}
                        disabled={true}
                    />
                </div>
                <div class="w-full space-y-4">
                    <div class="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
                        <table class="w-full text-xl">
                            <thead>
                                <tr class="text-zinc-500 text-sm uppercase tracking-wider text-left">
                                    <th></th><th>Speler</th><th class="text-right">Boxes</th><th class="text-right">Armies</th><th class="text-right">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each standings(game) as row (row.playerId)}
                                    <tr class="{row.playerId === game.turn.playerId && !game.winner ? 'font-bold text-white' : 'text-zinc-300'} {isExiled(game, row.playerId) ? 'opacity-50' : ''}">
                                        <td class="py-2"><span class="inline-block w-3.5 h-3.5 rounded-full" style="background: {colorOf(row.playerId)}"></span></td>
                                        <td class="py-2">{nameOf(row.playerId)}{isExiled(game, row.playerId) ? " (ballingschap)" : ""}</td>
                                        <td class="py-2 text-right tabular-nums">{row.boxes}</td>
                                        <td class="py-2 text-right tabular-nums">{row.armies}</td>
                                        <td class="py-2 text-right tabular-nums">{row.score}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                        {#if standings(game).some((r) => r.continents.length)}
                            <div class="mt-4 pt-4 border-t border-zinc-800 space-y-2">
                                {#each standings(game).filter((r) => r.continents.length) as row (row.playerId)}
                                    <p class="text-lg">
                                        <span class="text-zinc-400">{nameOf(row.playerId)}:</span>
                                        {#each row.continents as c (c)}
                                            <span class="inline-block bg-zinc-800 rounded-lg px-2.5 py-0.5 mx-1 text-emerald-300">{c}</span>
                                        {/each}
                                    </p>
                                {/each}
                            </div>
                        {/if}
                    </div>
                    <p class="text-zinc-500 text-sm text-center">Treble voedt de binnenbox · double de buitenbox · bull laadt het Arsenaal</p>
                </div>
            </div>

            <!-- winner card -->
            {#if frozen && game.winner}
                <div class="fixed inset-0 z-10 bg-zinc-950/95 flex flex-col items-center justify-center text-center">
                    <p class="text-emerald-400 text-2xl mb-2">Kampioen</p>
                    <p class="font-display font-black text-8xl mb-6">{nameOf(game.winner)}</p>
                    <div class="space-y-1 text-xl text-zinc-400">
                        {#each standings(game).slice(0, 3) as st, i (st.playerId)}
                            <p>{i + 1}. {nameOf(st.playerId)} — {st.score} pt · {st.boxes} boxes</p>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- ponytail: TvCommentary (kind="risk") not built yet — spec M-step; add when commentary gets risk support -->
        {/if}
    </div>
</TvStage>
