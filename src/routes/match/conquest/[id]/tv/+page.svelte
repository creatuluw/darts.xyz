<script lang="ts">
    import { onMount } from "svelte";
    import { page as pageStore } from "$app/stores";
    import { IconLink } from "@tabler/icons-svelte";
    import TvCommentary from "$lib/components/tv/TvCommentary.svelte";
    import ConquestBoard from "$lib/components/conquest/ConquestBoard.svelte";
    import ConquestScoreboard from "$lib/components/conquest/ConquestScoreboard.svelte";
    import { curatedOptions } from "$lib/game/conquest-options";
    import type { ConquestState } from "$lib/game/conquest-engine";
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

    let game = $state(null as ConquestState | null);
    let missing = $state(false);
    let frozen = $state(false);

    const players = $derived(
        game
            ? game.players.map((p, i) => ({
                  id: p.id,
                  name: p.name,
                  initials: p.name
                      .split(/\s+/)
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase(),
                  color: PLAYER_COLORS[i % PLAYER_COLORS.length],
              }))
            : []
    );

    const nameOf = (id: string | null) =>
        players.find((p) => p.id === id)?.name ?? "?";

    const phaseText = $derived.by(() => {
        if (!game) return "";
        const active = nameOf(game.players[game.activeSeat]?.id ?? null);
        switch (game.phase) {
            case "turn": return `${active} gooiet`;
            case "resurrect_pick": return `${active} kiest een blanke wig — herleving`;
            case "duel_pick": return `${active} kiest een doelwit om te roven`;
            case "duel_save": return `${nameOf(game.pendingDuel?.defender ?? null)} verdedigt — raak de bull`;
            case "tiebreak": return "Tiebreak!";
            case "finished": return "Afgelopen";
        }
    });

    const visitLabels = $derived(
        game
            ? game.turnDarts.map((d) =>
                  d.segment === 0 ? "Miss" : `${d.multiplier === 3 ? "T" : d.multiplier === 2 ? "D" : ""}${d.segment}`
              )
            : []
    );

    const clockMode = $derived(game?.mode === "clock");
    const options = $derived(game && game.phase !== "finished" ? curatedOptions(game) : []);

    // rolling turn summaries for the commentary LLM (built from poll diffs)
    let turnLog = $state<string[]>([]);
    let seenTurn = -1;
    function logTurn(s: ConquestState) {
        if (s.turnCount === seenTurn || s.turnCount === 0) return;
        seenTurn = s.turnCount;
        const actor = s.players[s.activeSeat]?.name ?? "?";
        const darts = s.turnDarts
            .map((d) => (d.segment === 0 ? "Miss" : `${d.multiplier === 3 ? "T" : d.multiplier === 2 ? "D" : ""}${d.segment}`))
            .join(" ") || "—";
        const counts = s.players
            .map((p) => `${p.name}: ${Object.values(s.territories).filter((t) => t.owner === p.id).length} gebieden`)
            .join(", ");
        turnLog = [...turnLog.slice(-40), `beurt ${s.turnCount} — ${actor}: ${darts} (${counts})`];
    }

    async function poll() {
        if (frozen || missing || document.hidden) return;
        try {
            const res = await fetch(`/api/conquest/${gameId}`);
            if (res.status === 404) { missing = true; return; }
            if (!res.ok) return;
            const data = await res.json();
            const next = data.state as ConquestState;
            logTurn(next);
            game = next;
            if (game.phase === "finished") frozen = true;
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

<svelte:head><title>TV — Trebles &amp; Territories</title></svelte:head>

<div class="min-h-dvh bg-zinc-950 text-white p-4 md:p-8 flex flex-col select-none">
    {#if missing}
        <div class="flex-1 flex items-center justify-center">
            <p class="text-zinc-400 text-2xl">Spel niet gevonden.</p>
        </div>
    {:else if !game}
        <div class="flex-1 flex items-center justify-center">
            <p class="text-zinc-500 text-2xl animate-pulse">Laden…</p>
        </div>
    {:else}
        <header class="flex items-center justify-between mb-4 md:mb-6">
            <div class="flex items-baseline gap-4">
                <span class="font-display font-black text-2xl md:text-3xl tracking-tight">TREBLES &amp; TERRITORIES</span>
                {#if clockMode}
                    <span class="text-zinc-500 text-lg md:text-xl">
                        {game.preset} darten per speler
                    </span>
                {/if}
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
        <div class="rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2 md:py-3 mb-4 md:mb-6 flex items-center justify-between gap-4">
            <p class="text-xl md:text-2xl font-bold {game.phase === 'finished' ? 'text-zinc-500' : 'text-emerald-300'}">
                {phaseText}
            </p>
            {#if visitLabels.length}
                <p class="text-zinc-300 text-lg md:text-xl">
                    {#each visitLabels as l}<span class="inline-block bg-zinc-800 rounded-lg px-2.5 py-1 mx-1">{l}</span>{/each}
                </p>
            {/if}
        </div>

        <div class="flex-1 grid lg:grid-cols-[1fr_auto] gap-4 md:gap-6 items-center justify-items-center">
            <ConquestBoard state={game} {players} onHit={() => {}} disabled={true} />
            <div class="w-full lg:w-[26rem] space-y-4">
                <ConquestScoreboard state={game} {players} />
                {#if clockMode}
                    <div class="rounded-xl bg-zinc-900/60 border border-zinc-800 p-3 space-y-2">
                        {#each game.players as p (p.id)}
                            <div class="flex items-center gap-3">
                                <span class="text-zinc-300 w-24 truncate">{p.name}</span>
                                <div class="flex-1 h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        class="h-full rounded-full transition-all"
                                        style="width: {Math.min(100, (p.dartsThrown / game.preset) * 100)}%; background: {players.find(q => q.id === p.id)?.color ?? '#52525b'}"
                                    ></div>
                                </div>
                                <span class="text-zinc-500 text-sm tabular-nums">{p.dartsThrown}/{game.preset}</span>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>

        <!-- curated options strip -->
        {#if options.length}
            <footer class="mt-4 md:mt-6 grid gap-2 {options.length <= 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3'}">
                {#each options as po (po.playerId)}
                    {#each po.options as opt, i (opt.kind + opt.wedge)}
                        {#if i === 0}
                            <div class="rounded-xl bg-zinc-900/60 border border-zinc-800 px-4 py-2.5 flex items-center gap-3">
                                <span class="text-zinc-400 truncate max-w-[30%]">{nameOf(po.playerId)}</span>
                                <span class="text-lg {opt.kills ? 'text-red-400' : opt.deny ? 'text-amber-300' : opt.leader ? 'text-emerald-300' : 'text-zinc-200'}">
                                    {opt.label}
                                </span>
                            </div>
                        {/if}
                    {/each}
                {/each}
            </footer>
        {/if}

        <!-- winner card -->
        {#if frozen && game.winner}
            <div class="fixed inset-0 z-10 bg-zinc-950/95 flex flex-col items-center justify-center text-center">
                <p class="text-emerald-400 text-2xl mb-2">Kampioen</p>
                <p class="font-display font-black text-6xl md:text-8xl mb-6">{nameOf(game.winner)}</p>
                {#if game.standings}
                    <div class="space-y-1 text-xl text-zinc-400">
                        {#each game.standings.slice(0, 3) as st, i (st.playerId)}
                            <p>{i + 1}. {nameOf(st.playerId)} — {st.score} pt · {st.territories} 🏰</p>
                        {/each}
                    </div>
                {/if}
            </div>
        {/if}

        <TvCommentary
            matchRef={`conquest:${gameId}`}
            kind="conquest"
            turnCount={game.turnCount}
            turnLines={turnLog}
            players={players.map((p) => p.name)}
            done={frozen}
        />
    {/if}
</div>
