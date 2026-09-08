<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import ConquestBoard from "$lib/components/conquest/ConquestBoard.svelte";
    import ConquestScoreboard from "$lib/components/conquest/ConquestScoreboard.svelte";
    import { PillButton } from "$lib/components/ui";
    import {
        createConquestMatch,
        applyDart as engineDart,
        pickResurrectBlank,
        pickDuelTarget,
        resolveSaveDart,
        applyTiebreakDart,
        blankTerritories,
        territoriesOf,
        isDead,
    } from "$lib/game/conquest-engine";
    import type {
        ConquestState,
        ConquestEvent,
        ConquestDart,
    } from "$lib/game/conquest-engine";
    import type { Multiplier } from "$lib/game/types";

    const SETUP_KEY = "conquest_setup";
    const STATE_KEY = "conquest_state";

    const PLAYER_COLORS = [
        "#9B2226",
        "#023047",
        "#FB8500",
        "#AE2012",
        "#8ECAE6",
        "#BB3E03",
    ];

    interface PlayerMeta {
        id: string;
        name: string;
        initials: string;
        color: string;
    }

    let game = $state(null as ConquestState | null);
    let players = $state<PlayerMeta[]>([]);
    let feed = $state<{ id: number; text: string; color: string }[]>([]);
    let markers = $state<ConquestDart[]>([]);
    let notice = $state("");
    let feedId = 0;

    function initialsOf(name: string): string {
        const parts = name.trim().split(/\s+/);
        return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
    }

    function persist() {
        if (game) sessionStorage.setItem(STATE_KEY, JSON.stringify(game));
    }

    onMount(() => {
        const savedState = sessionStorage.getItem(STATE_KEY);
        const setup = sessionStorage.getItem(SETUP_KEY);
        if (savedState) {
            const s = JSON.parse(savedState) as ConquestState;
            if (s.phase !== "finished") {
                game = s;
                players = s.players.map((p, i) => ({
                    id: p.id,
                    name: p.name,
                    initials: initialsOf(p.name),
                    color: PLAYER_COLORS[i % PLAYER_COLORS.length],
                }));
                notice = "Resumed campaign";
                return;
            }
        }
        if (!setup) {
            goto("/match/setup?tab=fun");
            return;
        }
        const cfg = JSON.parse(setup) as {
            mode: "clock" | "domination";
            preset: number;
            players: { id: string; name: string }[];
        };
        game = createConquestMatch(cfg);
        players = cfg.players.map((p, i) => ({
            id: p.id,
            name: p.name,
            initials: initialsOf(p.name),
            color: PLAYER_COLORS[i % PLAYER_COLORS.length],
        }));
        persist();
    });

    const meta = (id: string | null) =>
        players.find((p: PlayerMeta) => p.id === id);

    function pushEvents(events: ConquestEvent[]) {
        for (const e of events) {
            let text = "";
            let who = "";
            switch (e.type) {
                case "FOUNDED":
                    who = e.player;
                    text = `founded ${e.territory} at 3 HP`;
                    break;
                case "DAMAGED":
                    who = e.player;
                    text = `hit ${e.territory} for ${e.damage} — ${e.hp} HP left`;
                    break;
                case "CAPTURED":
                    who = e.player;
                    text = `captured ${e.territory} from ${meta(e.from)?.name ?? e.from}`;
                    break;
                case "REINFORCED":
                    who = e.player;
                    text = `reinforced ${e.territory} — ${e.hp} HP`;
                    break;
                case "DIED":
                    who = e.player;
                    text = `lost their last territory — the Altar awaits`;
                    break;
                case "BULL_HIT":
                    who = e.player;
                    text = `hit the Altar`;
                    break;
                case "RESURRECT":
                    who = e.player;
                    text = `rose from the Altar onto ${e.territory}`;
                    break;
                case "DUEL_CHALLENGE":
                    who = e.attacker;
                    text = `challenges ${meta(e.defender)?.name ?? e.defender} — DUEL AT THE ALTAR`;
                    break;
                case "DUEL_SAVED":
                    who = e.defender;
                    text = `SAVED with a bull — theft DENIED`;
                    break;
                case "DUEL_STOLEN":
                    who = e.attacker;
                    text = `steals ${e.territory} as the save dart misses`;
                    break;
                case "SHANGHAI":
                    who = e.player;
                    text = `SHANGHAI on ${e.number}! +1 dart next visit`;
                    break;
                case "GAME_END":
                    text = `Game over — ${meta(e.winner)?.name ?? e.winner ?? "nobody"} wins`;
                    who = e.winner ?? "";
                    break;
            }
            const m = meta(who);
            feed = [{ id: feedId++, text, color: m?.color ?? "#71717a" }, ...feed].slice(0, 40);
        }
        if (events.length) notice = "";
    }

    function apply(result: { state: ConquestState; events: ConquestEvent[] }) {
        game = result.state;
        pushEvents(result.events);
        persist();
    }

    // reset visit markers when the turn/actor changes
    let visitKey = $derived(
        game ? `${game.turnCount}:${game.activeSeat}:${game.phase === "duel_save" ? "duel" : game.phase}` : "",
    );
    let lastVisitKey = "";
    $effect(() => {
        if (visitKey !== lastVisitKey) {
            markers = [];
            lastVisitKey = visitKey;
        }
    });

    function onHit(segment: number, multiplier: Multiplier) {
        if (!game) return;
        notice = "";
        try {
            const snap = $state.snapshot(game);
            if (snap.phase === "turn") {
                const active = snap.players[snap.activeSeat];
                if (isDead(snap, active.id) && segment !== 25 && segment !== 0) {
                    notice = `${active.name} is dead — only the Altar (bull) counts`;
                    return;
                }
                markers = [...markers, { segment, multiplier }];
                apply(engineDart(snap, { segment, multiplier }));
            } else if (snap.phase === "duel_save") {
                markers = [...markers, { segment, multiplier }];
                apply(resolveSaveDart(snap, segment === 25));
            } else if (snap.phase === "tiebreak") {
                apply(applyTiebreakDart(snap, { segment, multiplier }));
            }
        } catch (err) {
            notice = err instanceof Error ? err.message : "Invalid throw";
            markers = markers.slice(0, -1);
        }
    }

    function onPick(num: number) {
        if (!game) return;
        try {
            const snap = $state.snapshot(game);
            if (snap.phase === "resurrect_pick") apply(pickResurrectBlank(snap, num));
            else if (snap.phase === "duel_pick") apply(pickDuelTarget(snap, num));
        } catch (err) {
            notice = err instanceof Error ? err.message : "Invalid pick";
        }
    }

    // board hit routing: in pick phases, any hit on a candidate wedge picks it
    function boardHit(segment: number, multiplier: Multiplier) {
        if (!game) return;
        if (
            (game.phase === "resurrect_pick" || game.phase === "duel_pick") &&
            pickCandidates.includes(segment)
        ) {
            onPick(segment);
            return;
        }
        onHit(segment, multiplier);
    }

    const pickCandidates = $derived.by(() => {
        if (!game) return [];
        if (game.phase === "resurrect_pick") return blankTerritories(game);
        if (game.phase === "duel_pick") return territoriesOf(game, game.pendingDuel!.defender);
        return [];
    });

    const banner = $derived.by(() => {
        if (!game) return "";
        const name = (id: string) => meta(id)?.name ?? id;
        if (game.phase === "resurrect_pick")
            return `${name(game.players[game.activeSeat].id)} hit the Altar — pick a blank territory to claim (1 HP)`;
        if (game.phase === "duel_pick")
            return `${name(game.pendingDuel!.attacker)} — pick a territory to rob from ${name(game.pendingDuel!.defender)}`;
        if (game.phase === "duel_save")
            return `DUEL: ${name(game.pendingDuel!.defender)} throws ONE dart at the bull to save ${game.pendingDuel!.target} — hit = DENIED, miss = stolen`;
        if (game.phase === "tiebreak")
            return `SUDDEN DEATH — ${name(game.tiebreak!.participants[game.tiebreak!.activeIndex])}: nearest bull wins (50 > 25 > miss)`;
        const active = game.players[game.activeSeat];
        if (isDead(game, active.id))
            return `${active.name} is dead — 3 darts at the Altar to resurrect (blanks first, then rob)`;
        return `${active.name} to throw`;
    });

    const activeColor = $derived.by(() => {
        if (!game) return "#71717a";
        const id =
            game.phase === "duel_save"
                ? game.pendingDuel!.defender
                : game.phase === "tiebreak"
                  ? game.tiebreak!.participants[game.tiebreak!.activeIndex]
                  : game.players[game.activeSeat].id;
        return meta(id)?.color ?? "#71717a";
    });

    function newGame() {
        sessionStorage.removeItem(STATE_KEY);
        goto("/match/setup?tab=fun");
    }
</script>

<svelte:head>
    <title>Trebles &amp; Territories — dart.monster</title>
</svelte:head>

{#if game}
    <div class="py-6">
        <!-- header -->
        <div class="flex items-center justify-between mb-4">
            <h1 class="font-display font-extrabold text-2xl md:text-3xl">
                Trebles &amp; Territories
            </h1>
            <div class="flex items-center gap-2 text-xs">
                <span
                    class="rounded-full px-2.5 py-1 font-semibold bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300"
                    >{game.mode === "clock" ? "Clock" : "Domination"} · {game.preset}
                    darts</span
                >
                <span
                    class="rounded-full px-2.5 py-1 font-semibold bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300"
                    >Turn {game.turnCount + 1}</span
                >
            </div>
        </div>

        {#if game.phase === "finished"}
            <!-- end screen -->
            <div class="rounded-2xl bg-white dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 p-6 mb-6">
                <p class="text-xs uppercase tracking-widest text-zinc-400 mb-1">
                    Game over
                </p>
                <h2 class="font-display font-extrabold text-3xl mb-4">
                    {meta(game.winner)?.name ?? "Nobody"}
                    takes the board 🏆
                </h2>
                <div class="grid gap-2 mb-5">
                    {#each game.standings ?? [] as st, i (st.playerId)}
                        {@const m = meta(st.playerId)!}
                        <div
                            class="flex items-center gap-3 rounded-xl px-4 py-2.5 ring-1 {i === 0
                                ? 'bg-amber-50 dark:bg-amber-500/10 ring-amber-300/50 dark:ring-amber-400/30'
                                : 'bg-white dark:bg-white/5 ring-black/5 dark:ring-white/10'}"
                        >
                            <span class="font-display font-extrabold text-lg w-8 tabular-nums"
                                >#{st.rank}</span
                            >
                            <span
                                class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white"
                                style="background:{m.color}">{m.initials}</span
                            >
                            <span class="font-semibold">{m.name}</span>
                            <span class="ml-auto text-sm text-zinc-400"
                                >{st.territories} territories · {st.continents}
                                continents</span
                            >
                            <span class="font-display font-extrabold text-xl tabular-nums w-12 text-right"
                                >{st.score}</span
                            >
                        </div>
                    {/each}
                </div>
                <div class="flex gap-2">
                    <PillButton onclick={newGame}>New Conquest</PillButton>
                    <a href="/history"
                        ><PillButton variant="secondary">History</PillButton></a
                    >
                </div>
            </div>

            <div class="rounded-2xl bg-zinc-900 p-4 md:p-8">
                <ConquestBoard state={game} {players} onHit={() => {}} disabled />
            </div>
        {:else}
            <!-- live game -->
            {#if notice}
                <div
                    class="mb-3 rounded-lg px-4 py-2 text-sm font-medium bg-amber-100 dark:bg-amber-500/15 text-amber-900 dark:text-amber-200"
                >
                    {notice}
                </div>
            {/if}

            <div
                class="mb-4 rounded-xl px-4 py-3 ring-1 ring-black/5 dark:ring-white/10 flex items-center gap-3"
                style="background:linear-gradient(90deg, {activeColor}1a, transparent)"
            >
                <span
                    class="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
                    style="background:{activeColor}"></span>
                <p class="font-semibold text-sm md:text-base">{banner}</p>
                {#if game.phase === "turn"}
                    <span class="ml-auto flex gap-1.5 shrink-0" aria-label="darts left">
                        {#each Array(Math.max(game.dartsLeftInTurn, 0)) as _, i (i)}
                            <span class="w-2 h-2 rounded-full" style="background:{activeColor}"></span>
                        {/each}
                    </span>
                {/if}
            </div>

            <div class="grid lg:grid-cols-[1fr_320px] gap-4 items-start">
                <div class="rounded-2xl bg-zinc-900 p-3 md:p-6">
                    <ConquestBoard
                        state={game}
                        {players}
                        onHit={boardHit}
                        {pickCandidates}
                        duelActive={game.phase === "duel_save"}
                        {markers}
                    />
                </div>

                <div class="space-y-4">
                    <ConquestScoreboard state={game} {players} />

                    <div
                        class="rounded-2xl bg-white dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 p-4"
                    >
                        <h3 class="font-display font-bold text-sm mb-2 text-zinc-500">
                            War log
                        </h3>
                        <div class="space-y-1.5 max-h-72 overflow-y-auto">
                            {#each feed as f (f.id)}
                                <div class="flex gap-2 text-xs">
                                    <span
                                        class="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                        style="background:{f.color}"></span>
                                    <span class="text-zinc-600 dark:text-zinc-300"
                                        >{f.text}</span
                                    >
                                </div>
                            {:else}
                                <p class="text-xs text-zinc-400">
                                    Trebles found kingdoms — singles don't.
                                </p>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
{/if}
