<script lang="ts">
    import {
        IconPlayerPlay,
        IconArrowUp,
        IconArrowDown,
        IconTrash,
        IconExternalLink,
        IconTrophy,
    } from "@tabler/icons-svelte";
    import DoubleBezel from "./DoubleBezel.svelte";
    import AnimatedNumber from "./AnimatedNumber.svelte";
    import type { PlayerInMatch, TurnRecord } from "$lib/game";

    interface PanelStats {
        threeDartAvg: number;
        doubleConversion: number;
        countUnder20: number;
        count60Plus: number;
        count100Plus: number;
        count140Plus: number;
        count180: number;
        count60PlusFinishes: number;
        last3Avg: number;
        prior15Avg: number;
    }

    let {
        player,
        isActive = false,
        allMatchTurns,
        stats,
        dartsThrown,
        condensed = false,
        large = false,
        rank = 0,
        legDarts = 0,
        legAvg = 0,
        next = false,
        showDeleteConfirm = $bindable(false),
        onDeleteLastTurn,
    }: {
        player: PlayerInMatch;
        isActive?: boolean;
        allMatchTurns: TurnRecord[];
        stats: PanelStats;
        dartsThrown: number;
        /** Compact single-card mode for 3+ player matches */
        condensed?: boolean;
        /** Taller condensed card when 3–4 players leave room for it */
        large?: boolean;
        /** Standings rank (1 = leading) by sets then legs won */
        rank?: number;
        /** Darts thrown in the current leg (condensed mode) */
        legDarts?: number;
        /** 3-dart average for the current leg */
        legAvg?: number;
        /** This player throws next (medium name emphasis) */
        next?: boolean;
        showDeleteConfirm?: boolean;
        onDeleteLastTurn: () => void;
    } = $props();

    function ordinal(n: number): string {
        const v = n % 100;
        const s = ["th", "st", "nd", "rd"];
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    let playerTurns = $derived(
        allMatchTurns.filter((t) => t.playerId === player.id),
    );
</script>

<div class="space-y-3">
    {#if condensed}
        <!-- Condensed card (3+ players): score, standing, match avg, leg darts -->
        <DoubleBezel>
            <div>
                <div class="flex items-center justify-between mb-1">
                    <span
                        class="font-medium flex items-center gap-2 {isActive
                            ? 'text-4xl font-black text-emerald-600 dark:text-emerald-400'
                            : next
                              ? 'text-2xl font-bold'
                              : 'text-xs'}"
                    >
                        {#if isActive}
                            <IconPlayerPlay
                                size={10}
                                class="-mt-0.5 text-emerald-500"
                            />
                        {/if}
                        {player.name}
                        {#if rank}
                            <span
                                class="inline-flex items-center gap-0.5 text-[10px] text-zinc-400"
                                >({ordinal(rank)}<IconTrophy
                                    size={10}
                                    class="text-amber-500" />)</span
                            >
                        {/if}
                    </span>
                    {#if showDeleteConfirm}
                        <div class="flex items-center gap-1.5">
                            <button
                                onclick={() => {
                                    onDeleteLastTurn();
                                    showDeleteConfirm = false;
                                }}
                                class="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                                >Delete</button
                            >
                            <button
                                onclick={() => (showDeleteConfirm = false)}
                                class="text-[10px] text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                                >Cancel</button
                            >
                        </div>
                    {:else}
                        <button
                            onclick={() => (showDeleteConfirm = true)}
                            class="text-zinc-300 hover:text-red-500 transition-colors cursor-pointer"
                            title="Delete last turn"
                        >
                            <IconTrash size={12} />
                        </button>
                    {/if}
                </div>
                <div
                    class="text-center font-display font-black {isActive
                        ? large
                            ? 'text-8xl'
                            : 'text-6xl'
                        : large
                          ? 'text-7xl'
                          : 'text-5xl'} tracking-tight leading-none {isActive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : ''}"
                >
                    <AnimatedNumber value={player.remainingScore} />
                </div>
                <div
                    class="{large
                        ? 'mt-2 flex justify-center gap-4 text-xs'
                        : 'mt-1.5 flex justify-center gap-3 text-[10px]'} font-mono text-zinc-400"
                >
                    <span
                        >S
                        <span
                            class="font-bold text-zinc-700 dark:text-zinc-300"
                            >{player.setsWon}</span
                        ></span
                    >
                    <span
                        >L
                        <span
                            class="font-bold text-zinc-700 dark:text-zinc-300"
                            >{player.legsWon}</span
                        ></span
                    >
                    <span
                        >Leg
                        <span
                            class="font-bold text-zinc-700 dark:text-zinc-300"
                            >{legAvg.toFixed(1)}</span
                        ></span
                    >
                    <span
                        >Darts
                        <span
                            class="font-bold text-zinc-700 dark:text-zinc-300"
                            >{legDarts}</span
                        ></span
                    >
                </div>
            </div>
        </DoubleBezel>
    {:else}
        <!-- Full card (1–2 players) -->
        <!-- Scoreboard -->
    <DoubleBezel>
        <div class="text-center">
            <div
                class="font-display font-black {isActive
                    ? 'text-9xl'
                    : 'text-8xl'} tracking-tight leading-none {isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : ''}"
            >
                <AnimatedNumber value={player.remainingScore} />
            </div>
            <div
                class="mt-2 font-medium {isActive
                    ? 'text-4xl font-black'
                    : next
                      ? 'text-2xl font-bold'
                      : 'text-sm'} {isActive
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : ''}"
            >
                {#if isActive}
                    <IconPlayerPlay
                        size={14}
                        class="inline -mt-0.5 text-emerald-500 mr-0.5"
                    />
                {/if}
                {player.name}
                {#if rank}
                    <span
                        class="inline-flex items-center gap-0.5 text-[10px] text-zinc-400 ml-1"
                        >({ordinal(rank)}<IconTrophy
                            size={10}
                            class="text-amber-500" />)</span
                    >
                {/if}
            </div>
            <div
                class="mt-2 flex justify-center gap-4 text-xs font-mono text-zinc-400"
            >
                <span
                    >Sets
                    <span class="font-bold text-sm text-zinc-700 dark:text-zinc-300"
                        >{player.setsWon}</span
                    ></span
                >
                <span
                    >Legs
                    <span class="font-bold text-sm text-zinc-700 dark:text-zinc-300"
                        >{player.legsWon}</span
                    ></span
                >
            </div>
            <div
                class="mt-1.5 flex justify-center gap-3 text-[10px] text-zinc-400"
            >
                <span
                    >Darts
                    <span class="font-mono font-medium">{dartsThrown}</span></span
                >
                <span
                    >Leg
                    <span class="font-mono font-medium"
                        >{legAvg.toFixed(1)}</span
                    ></span
                >
                <span
                    >Match
                    <span class="font-mono font-medium"
                        >{stats.threeDartAvg.toFixed(1)}</span
                    ></span
                >
            </div>
        </div>
    </DoubleBezel>

    <!-- Stats -->
    <DoubleBezel>
        <div class="space-y-1.5 mt-2">
            <div class="flex justify-between items-center">
                <span class="text-xs text-zinc-400">3-Dart Avg</span>
                <span class="text-sm font-mono font-medium"
                    >{stats.threeDartAvg.toFixed(1)}</span
                >
            </div>
            <a
                href="/players/{player.id}/checkout"
                target="_blank"
                rel="noopener noreferrer"
                class="flex justify-between items-center group -mx-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                title="View checkout breakdown"
            >
                <span class="text-xs text-zinc-400 flex items-center gap-1"
                    >Double Conv.
                    <IconExternalLink
                        size={10}
                        class="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500"
                    />
                </span>
                <span
                    class="text-sm font-mono font-medium group-hover:text-blue-400 transition-colors"
                >
                    {stats.doubleConversion.toFixed(0)}%
                </span>
            </a>

            <div
                class="pt-2 mt-1 border-t border-zinc-100 dark:border-white/5"
            >
                <div class="grid grid-cols-3 gap-1 text-center">
                    <div>
                        <div class="text-[10px] text-zinc-400"> 60+ </div>
                        <div class="font-mono font-medium text-sm">
                            {stats.count60Plus}
                        </div>
                    </div>
                    <div>
                        <div class="text-[10px] text-zinc-400"> 100+ </div>
                        <div class="font-mono font-medium text-sm">
                            {stats.count100Plus}
                        </div>
                    </div>
                    <div>
                        <div class="text-[10px] text-zinc-400"> 140+ </div>
                        <div class="font-mono font-medium text-sm">
                            {stats.count140Plus}
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="pt-2 mt-1 border-t border-zinc-100 dark:border-white/5"
            >
                <div class="grid grid-cols-3 gap-1 text-center">
                    <div>
                        <div class="text-[10px] text-zinc-400"> &lt;20 </div>
                        <div
                            class="font-mono font-medium text-sm text-zinc-500"
                        >
                            {stats.countUnder20}
                        </div>
                    </div>
                    <div>
                        <div class="text-[10px] text-zinc-400"> 180 </div>
                        <div
                            class="font-mono font-bold text-sm text-amber-600 dark:text-amber-400"
                        >
                            {stats.count180}
                        </div>
                    </div>
                    <div>
                        <div class="text-[10px] text-zinc-400"> 60+ Fin </div>
                        <div
                            class="font-mono font-medium text-sm text-emerald-600 dark:text-emerald-400"
                        >
                            {stats.count60PlusFinishes}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Avg Trend: Last 3 vs Prior -->
            <div
                class="pt-2 mt-1 border-t border-zinc-100 dark:border-white/5"
            >
                <div
                    class="text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5"
                >
                    Avg Trend
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-xs text-zinc-500">Last 3</span>
                    <div class="flex items-center gap-1">
                        <span class="text-sm font-mono font-medium"
                            >{stats.last3Avg.toFixed(1)}</span
                        >
                        {#if stats.prior15Avg > 0}
                            {#if stats.last3Avg > stats.prior15Avg}
                                <IconArrowUp size={14} class="text-emerald-500" />
                            {:else if stats.last3Avg < stats.prior15Avg}
                                <IconArrowDown size={14} class="text-red-500" />
                            {/if}
                        {/if}
                    </div>
                </div>
                <div class="flex justify-between items-center mt-0.5">
                    <span class="text-xs text-zinc-500">Prior turns</span>
                    <span class="text-sm font-mono text-zinc-400"
                        >{stats.prior15Avg > 0
                            ? stats.prior15Avg.toFixed(1)
                            : "—"}</span
                    >
                </div>
            </div>
        </div>
    </DoubleBezel>

    <!-- Last 3 Turns -->
    <DoubleBezel>
        <div class="mt-2 space-y-1.5">
            {#each [...playerTurns].slice(-3).reverse() as turn, ri}
                <div
                    class="flex items-center justify-between gap-1.5 text-xs"
                >
                    <div class="flex items-center gap-1 font-mono">
                        {#each turn.darts as dart}
                            <span
                                class="rounded px-1.5 py-0.5 bg-zinc-100 dark:bg-white/10 {turn.isBust
                                    ? 'opacity-50'
                                    : ''}"
                            >
                                {dart.multiplier === 3
                                    ? "T"
                                    : dart.multiplier === 2
                                      ? "D"
                                      : ""}{dart.segment === 25
                                    ? dart.multiplier === 2
                                        ? "Bull"
                                        : "25"
                                    : dart.segment}
                            </span>
                        {/each}
                    </div>
                    <div class="flex items-center gap-2">
                        <span
                            class="font-mono font-medium {turn.isBust
                                ? 'text-red-500'
                                : ''}"
                        >
                            {#if turn.isBust}<span class="text-[9px] font-bold"
                                    >BUST</span
                                >
                            {/if}{turn.totalScore}
                        </span>
                        <span class="text-zinc-400"
                            >→ {turn.remainingScore}</span
                        >
                        {#if ri === 0}
                            {#if showDeleteConfirm}
                                <div class="flex items-center gap-1">
                                    <button
                                        onclick={() => {
                                            onDeleteLastTurn();
                                            showDeleteConfirm = false;
                                        }}
                                        class="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                                        >Delete</button
                                    >
                                    <button
                                        onclick={() =>
                                            (showDeleteConfirm = false)}
                                        class="text-[10px] text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                                        >Cancel</button
                                    >
                                </div>
                            {:else}
                                <button
                                    onclick={() => (showDeleteConfirm = true)}
                                    class="flex items-center justify-center w-6 h-6 rounded text-zinc-300 hover:text-red-500 transition-colors cursor-pointer"
                                    title="Delete last turn"
                                >
                                    <IconTrash size={12} />
                                </button>
                            {/if}
                        {/if}
                    </div>
                </div>
            {/each}
            {#if playerTurns.length === 0}
                <div class="text-zinc-400 text-center py-1 text-xs">
                    No turns yet
                </div>
            {/if}
        </div>
    </DoubleBezel>
    {/if}
</div>
