<script lang="ts">
    import { onMount } from "svelte";
    import { page as pageStore } from "$app/stores";
    import { IconLink } from "@tabler/icons-svelte";
    import TvStage from "$lib/components/tv/TvStage.svelte";
    import TvCommentary from "$lib/components/tv/TvCommentary.svelte";
    import RiskWorldMap from "$lib/components/risk/RiskWorldMap.svelte";
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

    // rolling turn summaries for the commentary LLM (built from poll diffs —
    // the risk state carries no dart log, so summarize standings per turn)
    let turnLog = $state<string[]>([]);
    let seenTurn = -1;
    let lastThrower: string | null = null;
    function logTurn(g: RiskGameState) {
        if (g.turn.index === seenTurn) return;
        if (lastThrower !== null) {
            const counts = g.players
                .map(
                    (p) =>
                        `${p}: ${g.boxes.filter((b) => b.owner === p).length} gebieden, ${g.boxes
                            .filter((b) => b.owner === p)
                            .reduce((s, b) => s + b.armies, 0)} legers`,
                )
                .join(", ");
            turnLog = [...turnLog.slice(-40), `beurt ${seenTurn} — ${lastThrower} gooide (stand: ${counts})`];
        }
        seenTurn = g.turn.index;
        lastThrower = nameOf(g.turn.playerId);
    }

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
            logTurn(g);
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
    <div class="relative h-full w-full bg-zinc-950 text-white select-none overflow-hidden">
        {#if missing}
            <div class="absolute inset-0 flex items-center justify-center">
                <p class="text-zinc-400 text-2xl">Spel niet gevonden.</p>
            </div>
        {:else if !game}
            <div class="absolute inset-0 flex items-center justify-center">
                <p class="text-zinc-500 text-2xl animate-pulse">Laden…</p>
            </div>
        {:else}
            <!-- full-bleed map: fills the entire 1920x1080 stage; landmass spans
                 roughly x 228-1703 / y 39-1007 in stage coords, so overlays below
                 are pinned to the margins and never cover a territory -->
            <div class="absolute inset-0">
                <RiskWorldMap
                    game={game}
                    playerColor={Object.fromEntries(players.map((p) => [p.id, p.color]))}
                    playerInitials={Object.fromEntries(players.map((p) => [p.id, p.initials]))}
                    activePlayerId={game.winner || game.tie ? null : game.turn.playerId}
                />
            </div>

            <!-- top bar: arctic ocean band -->
            <div class="absolute top-0 inset-x-0 h-9 px-6 flex items-center justify-between bg-zinc-950/60 backdrop-blur-sm border-b border-zinc-800/60">
                <div class="flex items-baseline gap-4">
                    <span class="font-display font-black text-xl tracking-tight">RISK 42</span>
                    <span class="text-zinc-400 text-sm">
                        {game.mode === "clock" ? `Klok · ${game.clockTurns} beurten` : "Domination"}
                    </span>
                    <span class="text-zinc-500 text-sm">Beurt {game.turn.index}</span>
                </div>
                <div class="flex items-center gap-4">
                    {#if !frozen}
                        <span class="flex items-center gap-2 text-emerald-400 text-sm">
                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span> LIVE
                        </span>
                    {/if}
                    <button
                        class="flex items-center gap-1.5 text-zinc-400 hover:text-white border border-zinc-700 rounded-lg px-2.5 py-1 text-xs transition-colors"
                        onclick={copyLink}
                    >
                        <IconLink class="w-4 h-4" /> Link kopiëren
                    </button>
                </div>
            </div>

            <!-- left panel: standings (west of the map, over letterbox + Pacific) -->
            <div class="absolute left-4 top-1/2 -translate-y-1/2 w-52 rounded-2xl bg-zinc-900/70 backdrop-blur border border-zinc-800 p-4 space-y-3">
                {#each standings(game) as row (row.playerId)}
                    <div class="{row.playerId === game.turn.playerId && !game.winner ? 'bg-zinc-800/60 rounded-xl p-2 -m-2' : 'p-2 -m-2'} {isExiled(game, row.playerId) ? 'opacity-50' : ''}">
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full shrink-0" style="background: {colorOf(row.playerId)}"></span>
                            <span class="font-semibold truncate">{nameOf(row.playerId)}</span>
                            <span class="ml-auto text-zinc-400 tabular-nums">{row.score}pt</span>
                        </div>
                        <div class="mt-0.5 pl-5 flex gap-3 text-sm text-zinc-400 tabular-nums">
                            <span>{row.boxes} box</span>
                            <span>{row.armies} arm</span>
                        </div>
                        {#if row.continents.length}
                            <div class="mt-1 pl-5 flex flex-wrap gap-1">
                                {#each row.continents as c (c)}
                                    <span class="bg-zinc-800 rounded px-1.5 py-0.5 text-xs text-emerald-300">{c}</span>
                                {/each}
                            </div>
                        {/if}
                        {#if isExiled(game, row.playerId)}
                            <p class="pl-5 text-xs text-amber-400">ballingschap</p>
                        {/if}
                    </div>
                {/each}
            </div>

            <!-- right panel: whose turn + dart budget (east of the map) -->
            <div class="absolute right-6 top-1/2 -translate-y-1/2 w-44 rounded-2xl bg-zinc-900/70 backdrop-blur border border-zinc-800 p-4 text-center space-y-3">
                <p class="text-xs uppercase tracking-wider text-zinc-500 font-bold">Aan de beurt</p>
                <p class="font-display font-black text-2xl leading-tight truncate" style="color: {colorOf(game.turn.playerId)}">{nameOf(game.turn.playerId)}</p>
                {#if !game.winner && !game.tie}
                    <div class="flex items-center justify-center gap-1.5">
                        {#each Array(game.turn.dartsLeft) as _}
                            <span class="inline-block w-2 h-7 rounded-full bg-zinc-200"></span>
                        {/each}
                    </div>
                    <p class="text-sm text-zinc-400">{budgetWithSources(game).total} darts</p>
                    {#if game.turn.charge > 0}
                        <p class="text-amber-300 font-bold text-lg">⚡ +{game.turn.charge}</p>
                    {/if}
                {:else}
                    <p class="text-sm {game.winner || game.tie ? 'text-zinc-500' : 'text-emerald-300'}">{phaseText}</p>
                {/if}
            </div>

            <!-- bottom hint: southern ocean band -->
            <div class="absolute bottom-0 inset-x-0 h-14 pointer-events-none flex items-end justify-center pb-2">
                <p class="text-zinc-400 text-sm bg-zinc-950/60 backdrop-blur-sm border border-zinc-800/60 rounded-full px-4 py-1.5">
                    Treble voedt de binnenbox · double de buitenbox · bull laadt het Arsenaal
                </p>
            </div>

            <!-- winner card: full standings over the frozen end-state map -->
            {#if frozen && game.winner}
                <div class="absolute inset-0 z-10 bg-zinc-950/75 backdrop-blur-[2px] flex flex-col items-center justify-center text-center px-16">
                    <p class="text-emerald-400 text-xl mb-1 font-bold tracking-wider uppercase">Kampioen</p>
                    <p class="font-display font-black text-7xl mb-4" style="color: {colorOf(game.winner)}">{nameOf(game.winner)}</p>
                    <p class="text-zinc-400 mb-8">{game.mode === "clock" ? `Klok · ${game.clockTurns} beurten per speler` : "Domination"} · {game.turn.index - 1} beurten</p>
                    <div class="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 min-w-[560px]">
                        <table class="w-full text-lg">
                            <thead>
                                <tr class="text-zinc-500 text-xs uppercase tracking-wider text-left">
                                    <th></th><th>Speler</th><th class="text-right">Boxes</th><th class="text-right">Armies</th><th class="text-right">Score</th><th>Continenten</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each standings(game) as row, i (row.playerId)}
                                    <tr class="{row.playerId === game.winner ? 'font-bold text-white' : 'text-zinc-300'}">
                                        <td class="py-1.5 pr-2"><span class="text-zinc-500">{i + 1}.</span> <span class="inline-block w-3 h-3 rounded-full align-middle" style="background: {colorOf(row.playerId)}"></span></td>
                                        <td class="py-1.5 pr-6">{nameOf(row.playerId)}</td>
                                        <td class="py-1.5 text-right tabular-nums pr-6">{row.boxes}</td>
                                        <td class="py-1.5 text-right tabular-nums pr-6">{row.armies}</td>
                                        <td class="py-1.5 text-right tabular-nums pr-6">{row.score}</td>
                                        <td class="py-1.5">{#each row.continents as c (c)}<span class="inline-block bg-zinc-800 rounded px-1.5 py-0.5 mx-0.5 text-sm text-emerald-300">{c}</span>{/each}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            {/if}

            <!-- TV commentary: same every-N-turns broadcast as the other modes -->
            {#if game && !missing}
                <TvCommentary
                    matchRef={`risk:${gameId}`}
                    kind="risk"
                    turnCount={game.turn.index}
                    turnLines={turnLog}
                    players={players.map((p) => p.name)}
                    done={frozen}
                />
            {/if}
        {/if}
    </div>
</TvStage>
