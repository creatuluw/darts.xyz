<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { IconCast } from "@tabler/icons-svelte";
    import RiskBoard from "$lib/components/risk/RiskBoard.svelte";
    import RiskWorldMap from "$lib/components/risk/RiskWorldMap.svelte";
    import {
        applyDart,
        budgetWithSources,
        createGame,
        isExiled,
        standings,
        type DartHit,
        type RiskGameState,
    } from "$lib/game/risk-engine";
    import { PRESET_TURNS, type RiskClockPreset } from "$lib/game/risk-setup";

    const SETUP_KEY = "risk42_setup";
    const GAME_ID_KEY = "risk42_game_id";
    // hue-spread palette — 6 players must read at TV distance (vision-tested:
    // the old dark-red/dark-red pair and brown-on-Africa were indistinguishable)
    const PLAYER_COLORS = ["#E63946", "#1D3557", "#F77F00", "#2A9D8F", "#9D4EDD", "#4CC9F0"];

    interface PlayerMeta { id: string; name: string; color: string; }

    /** Collision-free chips: first 2 letters, extended to 3 when players clash (KAAL vs KAUW). */
    function initialsFor(names: string[]): string[] {
        const base = names.map((n) => n.trim().slice(0, 2).toUpperCase());
        return base.map((b, i) => (base.filter((o, j) => o === b && j !== i).length ? names[i].trim().slice(0, 3).toUpperCase() : b));
    }

    function initialsOf(name: string): string {
        const parts = name.trim().split(/\s+/);
        return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
    }
    // end-screen map chips resolve collisions across the full roster
    const playerInitials = $derived.by(() => {
        const chips = initialsFor(players.map((p) => p.name));
        return Object.fromEntries(players.map((p, i) => [p.id, chips[i]]));
    });

    let game = $state(null as RiskGameState | null);
    let players = $state<PlayerMeta[]>([]);
    let feed = $state<{ id: number; text: string; color: string }[]>([]);
    let gate = $state(true); // pre-turn budget banner — the player confirms before throwing
    let gateFor = $state("");
    let feedId = 0;
    let lastTurnIndex = $state(0);

    let gameId = $state<string | null>(null);

    /** What gets persisted — the engine state plus the player meta it doesn't carry. */
    function payload() {
        return { game, players: players.map((p) => ({ id: p.id, name: p.name })) };
    }

    /** Server write-through on every dart — fire-and-forget, never blocks scoring. */
    function persist() {
        if (game && gameId) {
            fetch(`/api/conquest/${gameId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state: payload() }),
            }).catch(() => {});
        }
    }

    async function startServerGame() {
        try {
            const res = await fetch("/api/conquest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state: payload() }),
            });
            if (res.ok) {
                const { id } = await res.json();
                gameId = id;
                sessionStorage.setItem(GAME_ID_KEY, id);
            }
        } catch {
            /* server unreachable — game still playable this visit */
        }
    }

    const setup = $derived(
        players.length && game
            ? { name: (id: string) => players.find((p) => p.id === id)?.name ?? id, color: (id: string) => players.find((p) => p.id === id)?.color ?? "#888" }
            : null,
    );
    const budget = $derived(game ? budgetWithSources(game) : null);
    const activeName = $derived(game ? setup?.name(game.turn.playerId) : "");
    const boardDisabled = $derived(!game || game.winner !== null || game.tie !== null || gate);

    // end screen: final map + per-player maps for it + simple game stats from the war log
    const playerColor = $derived(Object.fromEntries(players.map((p) => [p.id, p.color])));
    const endStats = $derived.by(() => {
        if (!game?.winner) return null;
        const texts = feed.map((f) => f.text);
        return {
            turns: game.turn.index - 1,
            captures: texts.filter((t) => t.includes("captures")).length,
            arsenal: texts.filter((t) => t.includes("Arsenal")).length,
            misses: texts.filter((t) => t.endsWith("misses")).length,
        };
    });

    function log(text: string, color: string) {
        feed = [{ id: ++feedId, text, color }, ...feed].slice(0, 40);
    }

    function startGame(cfg: { mode: "domination" | "clock"; clockPreset?: RiskClockPreset; players: { id: string; name: string }[] }) {
        game = createGame(
            cfg.players.map((p) => p.id),
            {
                mode: cfg.mode,
                clockTurns: cfg.mode === "clock" ? PRESET_TURNS[cfg.clockPreset ?? 301] : undefined,
                seed: Math.floor(Math.random() * 2 ** 31),
            },
        );
        players = cfg.players.map((p, i) => ({ id: p.id, name: p.name, color: PLAYER_COLORS[i % PLAYER_COLORS.length] }));
        feed = [];
        gate = true;
        gateFor = game.turn.playerId;
        lastTurnIndex = game.turn.index;
        log("Territories dealt — " + (cfg.mode === "clock" ? `clock ${cfg.clockPreset}` : "Domination"), "#666");
    }

    onMount(async () => {
        // server is the source of truth — resume by game id if the server knows it
        const savedId = sessionStorage.getItem(GAME_ID_KEY);
        if (savedId) {
            try {
                const res = await fetch(`/api/conquest/${savedId}`);
                if (res.ok) {
                    const { state } = await res.json();
                    const g = state?.game;
                    if (g && Array.isArray(g.boxes) && g.turn && g.winner === null) {
                        gameId = savedId;
                        game = g;
                        players = (state.players ?? []).map((p: { id: string; name: string }, i: number) => ({ id: p.id, name: p.name, color: PLAYER_COLORS[i % PLAYER_COLORS.length] }));
                        gate = true; gateFor = g.turn.playerId; lastTurnIndex = g.turn.index;
                        log("Resumed campaign", "#666");
                        return;
                    }
                }
            } catch {
                /* offline — fall through to setup flow */
            }
        }
        const raw = sessionStorage.getItem(SETUP_KEY);
        if (!raw) { goto("/match/setup?tab=fun"); return; }
        startGame(JSON.parse(raw));
        await startServerGame();
    });

    function describe(before: RiskGameState, hit: DartHit): string {
        const who = setup?.name(before.turn.playerId) ?? "?";
        if (hit.segment === 0) return `${who} misses`;
        if (hit.segment === 25 || hit.segment === 50) return `${who} ⚡ charges the Arsenal +${hit.segment === 50 ? 2 : 1}`;
        const target = hit.multiplier === 1
            ? `${hit.segment}-${hit.singleRing}`
            : `${hit.segment}-${hit.multiplier === 3 ? "inner" : "outer"}`;
        const b0 = before.boxes.find((b) => b.id === target)!;
        const b1 = game!.boxes.find((b) => b.id === target)!;
        const val = (hit.multiplier === 1 ? 1 : 2) + before.turn.charge;
        if (b0.owner !== before.turn.playerId && b1.owner === before.turn.playerId && b0.owner !== null)
            return `${who} captures ${b1.territory}! (${val} dmg)`;
        if (b0.owner === null) return `${who} claims ${b1.territory} (${val} armies)`;
        if (b0.owner === before.turn.playerId) return `${who} reinforces ${b1.territory} +${val}`;
        return `${who} hits ${b1.territory} for ${val}`;
    }

    function throwDart(hit: DartHit) {
        if (!game || boardDisabled) return;
        const before = structuredClone($state.snapshot(game));
        applyDart(game, hit);
        log(describe(before, hit), setup?.color(game.turn.playerId === before.turn.playerId ? before.turn.playerId : before.turn.playerId) ?? "#666");
        if (game.turn.index !== lastTurnIndex) {
            lastTurnIndex = game.turn.index;
            gate = true; gateFor = game.turn.playerId;
        }
        if (game.winner) log(`🏆 ${setup?.name(game.winner)} wins!`, "#7fb069");
        else if (game.tie) log(`Horn! Tie: ${game.tie.map((p) => setup?.name(p)).join(" vs ")} — nearest bull wins`, "#d9a441");
        persist();
    }

    function breakTie() {
        if (!game?.tie) return;
        // nearest-bull: the table decides who threw closest — first of the tie list as placeholder? No:
        // play order: each tied player's bull-off distance entered by the table is out of scope for v1 UI;
        // resolve by boxes then armies (standings secondary) and log it.
        const tied = standings(game).filter((r) => game!.tie!.includes(r.playerId));
        game.winner = tied[0].playerId;
        game.tie = null;
        log(`Tiebreak (boxes, then armies): ${setup?.name(game.winner)} wins`, "#d9a441");
        persist();
    }
</script>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
    {#if game && setup}
        <div class="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
            <div>
                <div class="flex items-center justify-between mb-4">
                    <h1 class="font-display font-extrabold text-2xl md:text-3xl">Risk 42</h1>
                    {#if gameId}
                        <button
                            onclick={() => window.open(`/match/risk/${gameId}/tv`, "_blank")}
                            aria-label="Open TV-weergave in nieuw tabblad"
                            class="flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                            <IconCast size={16} />
                            TV
                        </button>
                    {/if}
                </div>
                {#if game.winner}
                    <div class="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-500/30 p-6 mb-4 flex items-center justify-between">
                        <div>
                            <p class="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">Game over</p>
                            <h1 class="font-display text-2xl font-bold">🏆 {setup.name(game.winner)} wins</h1>
                        </div>
                        <button class="px-4 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm" onclick={() => { startGame(JSON.parse(sessionStorage.getItem(SETUP_KEY)!)); startServerGame(); }}>Rematch</button>
                    </div>
                {:else if game.tie}
                    <div class="rounded-2xl bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-500/30 p-6 mb-4">
                        <h1 class="font-display text-xl font-bold">⏰ Horn — tied: {game.tie.map((p) => setup.name(p)).join(" vs ")}</h1>
                        <button class="mt-3 px-4 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm" onclick={breakTie}>Tiebreak (boxes, then armies)</button>
                    </div>
                {:else}
                    <div class="rounded-2xl ring-1 ring-black/10 dark:ring-white/15 p-4 mb-4 bg-white dark:bg-zinc-900 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span class="w-3.5 h-3.5 rounded-full" style="background:{setup.color(game.turn.playerId)}"></span>
                            <span class="font-display font-bold text-lg">{activeName}</span>
                            {#if game.turn.charge > 0}
                                <span class="text-amber-500 font-bold text-sm">⚡ +{game.turn.charge} charged</span>
                            {/if}
                        </div>
                        <div class="flex items-center gap-1.5">
                            {#each Array(game.turn.dartsLeft) as _, i}
                                <span class="w-2 h-6 rounded-full bg-zinc-800 dark:bg-white"></span>
                            {/each}
                        </div>
                    </div>
                {/if}

                <div class="rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-black/10 dark:ring-white/15 p-4">
                    {#if game.winner}
                        <!-- end state: the world as it ended, not the throwing board -->
                        <div class="h-[420px]">
                            <RiskWorldMap
                                game={game}
                                {playerColor}
                                {playerInitials}
                                activePlayerId={null}
                            />
                        </div>
                        <div class="mt-3 flex items-center justify-center gap-6 text-sm text-zinc-500">
                            {#if endStats}
                                <span>{endStats.turns} turns</span>
                                <span>·</span>
                                <span>{endStats.captures} captures</span>
                                <span>·</span>
                                <span>⚡ {endStats.arsenal}×</span>
                                <span>·</span>
                                <span>{endStats.misses} misses</span>
                            {/if}
                        </div>
                    {:else}
                        <RiskBoard state={game} onHit={throwDart} disabled={boardDisabled} />
                        <div class="mt-3 flex items-center justify-between">
                            <p class="text-xs text-zinc-400">Treble feeds the inner box · double feeds the outer · bull charges the Arsenal</p>
                            {#if !boardDisabled}
                                <button class="text-xs font-semibold px-3 py-1.5 rounded-full ring-1 ring-black/10 dark:ring-white/15 text-zinc-500" onclick={() => throwDart({ segment: 0, multiplier: 1 })}>Miss</button>
                            {/if}
                        </div>
                    {/if}
                </div>
            </div>

            <div class="space-y-4">
                {#if gate && !game.winner && !game.tie}
                    {@const b = budget!}
                    <div class="rounded-2xl ring-1 ring-black/10 dark:ring-white/15 p-4 bg-white dark:bg-zinc-900">
                        <p class="text-xs uppercase tracking-wider text-zinc-400 font-bold">Next up</p>
                        <h2 class="font-display text-xl font-bold" style="color:{setup.color(gateFor)}">{setup.name(gateFor)}</h2>
                        <p class="mt-1 text-sm">
                            <span class="font-bold text-base">{b.total}</span> darts
                            <span class="text-zinc-400">— base {b.base}{#each b.sources as s}&nbsp;· +{s.darts} {s.continent}{/each}</span>
                        </p>
                        {#if isExiled(game, gateFor)}
                            <p class="mt-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">In exile — capture any box at 0 armies to claw back</p>
                        {/if}
                        <button class="mt-3 w-full px-5 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm" onclick={() => (gate = false)}>Start turn</button>
                    </div>
                {/if}
                <div class="rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-black/10 dark:ring-white/15 p-4">
                    <h2 class="font-display font-bold mb-3">Standings</h2>
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="text-xs text-zinc-400 text-left"><th></th><th>Player</th><th class="text-right">Boxes</th><th class="text-right">Armies</th><th class="text-right">Score</th></tr>
                        </thead>
                        <tbody>
                            {#each standings(game) as row (row.playerId)}
                                <tr class="{row.playerId === game.turn.playerId && !game.winner ? 'font-bold' : ''} {isExiled(game, row.playerId) ? 'opacity-50' : ''}">
                                    <td><span class="inline-block w-2.5 h-2.5 rounded-full" style="background:{setup.color(row.playerId)}"></span></td>
                                    <td>{setup.name(row.playerId)}{isExiled(game, row.playerId) ? " (exile)" : ""}</td>
                                    <td class="text-right">{row.boxes}</td>
                                    <td class="text-right">{row.armies}</td>
                                    <td class="text-right">{row.score}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                    {#if standings(game).some((r) => r.continents.length)}
                        <div class="mt-3 pt-3 border-t border-black/5 dark:border-white/10 space-y-1.5">
                            {#each standings(game).filter((r) => r.continents.length) as row (row.playerId)}
                                <p class="text-sm">
                                    <span class="text-zinc-400">{setup.name(row.playerId)}:</span>
                                    {#each row.continents as c (c)}
                                        <span class="inline-block bg-black/5 dark:bg-white/10 rounded-lg px-2 py-0.5 mx-1 text-emerald-600 dark:text-emerald-300 font-semibold">{c}</span>
                                    {/each}
                                </p>
                            {/each}
                        </div>
                    {/if}
                </div>

                <div class="rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-black/10 dark:ring-white/15 p-4">
                    <h2 class="font-display font-bold mb-3">War log</h2>
                    <div class="space-y-1 max-h-72 overflow-y-auto text-sm">
                        {#each feed as f (f.id)}
                            <p class="text-zinc-600 dark:text-zinc-300"><span class="inline-block w-2 h-2 rounded-full mr-1.5 align-middle" style="background:{f.color}"></span>{f.text}</p>
                        {/each}
                    </div>
                </div>

                <a href="/match/setup?tab=fun" class="block text-center text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 py-2">← New game</a>
            </div>
        </div>
    {:else}
        <p class="p-10 text-center text-zinc-400">Loading campaign…</p>
    {/if}
</div>
