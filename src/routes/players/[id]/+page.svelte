<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import {
        DoubleBezel,
        PillButton,
        EyebrowTag,
        AnimatedNumber,
    } from "$lib/components/ui";
    import {
        IconUser,
        IconTrophy,
        IconTarget,
        IconHistory,
        IconTrash,
        IconX,
        IconCalendar,
    } from "@tabler/icons-svelte";

    let playerId = $derived($page.params.id as string);
    let player = $state<any>(null);
    let stats = $state<any>(null);
    let matches = $state<any[]>([]);
    let loading = $state(true);
    let showDeleteConfirm = $state(false);

    onMount(async () => {
        await loadPlayer();
    });

    async function loadPlayer() {
        loading = true;
        const res = await fetch(`/api/players/${playerId}`);
        if (res.status === 404) {
            goto("/players");
            return;
        }
        player = await res.json();

        // Load stats
        const statsRes = await fetch(`/api/stats/${playerId}`);
        stats = await statsRes.json();

        // Load match history
        const matchesRes = await fetch(`/api/players/${playerId}/matches`);
        matches = await matchesRes.json();

        loading = false;
    }

    async function handleDelete() {
        await fetch(`/api/players/${playerId}`, { method: "DELETE" });
        goto("/players");
    }
</script>

<svelte:head>
    <title>{player?.name ?? "Player"} — Darts 501</title>
</svelte:head>

<div class="py-8">
    {#if loading}
        <div class="text-center text-zinc-400 py-24">Loading...</div>
    {:else if player}
        <EyebrowTag>Player Profile</EyebrowTag>
        <div class="flex items-center justify-between mt-4">
            <h1 class="font-display font-extrabold text-5xl md:text-6xl">
                {player.name}
            </h1>
            <button
                onclick={() => (showDeleteConfirm = true)}
                class="text-zinc-400 hover:text-red-500 transition-colors p-2"
                title="Delete player"
            >
                <IconTrash size={24} />
            </button>
        </div>

        <div class="text-zinc-400 text-sm mt-2 flex items-center gap-2">
            <IconCalendar size={14} />
            Added {new Date(player.createdAt).toLocaleDateString()}
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-3 gap-3 mt-8">
            <DoubleBezel>
                <div class="text-center">
                    <div
                        class="text-3xl font-display font-bold"
                    >
                        {stats?.matchesPlayed ?? 0}
                        <span class="text-zinc-400 text-lg font-medium"
                            >({stats?.matchesWon ?? 0})</span
                        >
                    </div>
                    <div
                        class="text-xs text-zinc-400 uppercase tracking-wider mt-1"
                    >
                        Matches
                    </div>
                </div>
            </DoubleBezel>
            <DoubleBezel>
                <div class="text-center">
                    <div
                        class="text-3xl font-display font-bold"
                    >
                        {stats?.setsPlayed ?? 0}
                        <span class="text-zinc-400 text-lg font-medium"
                            >({stats?.setsWon ?? 0})</span
                        >
                    </div>
                    <div
                        class="text-xs text-zinc-400 uppercase tracking-wider mt-1"
                    >
                        Sets
                    </div>
                </div>
            </DoubleBezel>
            <DoubleBezel>
                <div class="text-center">
                    <div
                        class="text-3xl font-display font-bold"
                    >
                        {stats?.legsPlayed ?? 0}
                        <span class="text-zinc-400 text-lg font-medium"
                            >({stats?.legsWon ?? 0})</span
                        >
                    </div>
                    <div
                        class="text-xs text-zinc-400 uppercase tracking-wider mt-1"
                    >
                        Legs
                    </div>
                </div>
            </DoubleBezel>
        </div>

        <!-- Avg & Checkout -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <DoubleBezel>
                <div class="text-center">
                    <div
                        class="text-xs text-zinc-400 uppercase tracking-wider mb-1"
                    >
                        3-Dart Avg
                    </div>
                    <div class="text-3xl font-display font-bold">
                        {stats?.threeDartAvg ?? "0"}
                    </div>
                </div>
            </DoubleBezel>
            <DoubleBezel>
                <div class="text-center">
                    <div
                        class="text-xs text-zinc-400 uppercase tracking-wider mb-1"
                    >
                        Checkout %
                    </div>
                    <div class="text-3xl font-display font-bold">
                        {stats?.checkoutPct ?? "0"}%
                    </div>
                </div>
            </DoubleBezel>
        </div>

        <!-- Detailed Stats -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
            <DoubleBezel>
                <div class="flex items-center gap-2 mb-4">
                    <IconTarget size={20} class="text-zinc-400" />
                    <h2 class="font-display font-bold text-lg">
                        Scoring Stats
                    </h2>
                </div>
                <div class="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div
                            class="text-2xl font-display font-bold text-amber-500"
                        >
                            {stats?.total180s ?? 0}
                        </div>
                        <div class="text-xs text-zinc-400 mt-1">180s</div>
                    </div>
                    <div>
                        <div
                            class="text-2xl font-display font-bold text-emerald-500"
                        >
                            {stats?.total140s ?? 0}
                        </div>
                        <div class="text-xs text-zinc-400 mt-1">140+</div>
                    </div>
                    <div>
                        <div
                            class="text-2xl font-display font-bold text-blue-500"
                        >
                            {stats?.total100s ?? 0}
                        </div>
                        <div class="text-xs text-zinc-400 mt-1">100+</div>
                    </div>
                </div>
                <div
                    class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-zinc-200 dark:border-white/10"
                >
                    <div class="text-center">
                        <div class="text-xl font-display font-bold">
                            {stats?.highestFinish ?? 0}
                        </div>
                        <div class="text-xs text-zinc-400 mt-1">
                            Highest Finish
                        </div>
                    </div>
                    <div class="text-center">
                        <div class="text-xl font-display font-bold">
                            {stats?.totalDartsThrown ?? 0}
                        </div>
                        <div class="text-xs text-zinc-400 mt-1">
                            Darts Thrown
                        </div>
                    </div>
                </div>
            </DoubleBezel>

            <DoubleBezel>
                <div class="flex items-center gap-2 mb-4">
                    <IconTrophy size={20} class="text-zinc-400" />
                    <h2 class="font-display font-bold text-lg">Sets & Legs</h2>
                </div>
                <div class="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div class="text-2xl font-display font-bold">
                            {stats?.setsPlayed ?? 0}
                        </div>
                        <div class="text-xs text-zinc-400 mt-1">
                            Sets Played
                        </div>
                    </div>
                    <div>
                        <div class="text-2xl font-display font-bold">
                            {stats?.setsWon ?? 0}
                        </div>
                        <div class="text-xs text-zinc-400 mt-1">Sets Won</div>
                    </div>
                    <div>
                        <div class="text-2xl font-display font-bold">
                            {stats?.legsPlayed ?? 0}
                        </div>
                        <div class="text-xs text-zinc-400 mt-1">
                            Legs Played
                        </div>
                    </div>
                    <div>
                        <div class="text-2xl font-display font-bold">
                            {stats?.legsWon ?? 0}
                        </div>
                        <div class="text-xs text-zinc-400 mt-1">Legs Won</div>
                    </div>
                </div>
            </DoubleBezel>
        </div>

        <!-- Match History -->
        <DoubleBezel class="mt-3">
            <div class="flex items-center gap-2 mb-4">
                <IconHistory size={20} class="text-zinc-400" />
                <h2 class="font-display font-bold text-lg">Match History</h2>
            </div>
            {#if matches.length === 0}
                <div class="text-center text-zinc-400 py-8">
                    <p>No matches yet</p>
                </div>
            {:else}
                <div class="space-y-2">
                    {#each matches as match}
                        <a href="/match/{match.id}">
                            <div
                                class="flex items-center justify-between p-3 rounded-[5px] bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
                            >
                                <div>
                                    <div class="font-medium">
                                        {match.status === "completed"
                                            ? "Completed"
                                            : match.status === "abandoned"
                                              ? "Abandoned"
                                              : "In Progress"}
                                    </div>
                                    <div class="text-xs text-zinc-400 mt-0.5">
                                        {new Date(
                                            match.createdAt,
                                        ).toLocaleString()}
                                    </div>
                                </div>
                                <div class="text-right">
                                    {#if match.status === "completed"}
                                        <div
                                            class="text-sm font-bold {match.winnerId ===
                                            playerId
                                                ? 'text-emerald-500'
                                                : 'text-zinc-400'}"
                                        >
                                            {match.winnerId === playerId
                                                ? "Won"
                                                : "Lost"}
                                        </div>
                                    {:else}
                                        <div class="text-sm text-zinc-400">
                                            {match.status === "in_progress"
                                                ? "Playing"
                                                : "-"}
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}
        </DoubleBezel>
    {/if}
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
    <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onclick={() => (showDeleteConfirm = false)}
    >
        <div
            class="bg-white dark:bg-[#1C1C1C] rounded-[10px] p-6 max-w-md w-full shadow-2xl"
            onclick={(e) => e.stopPropagation()}
        >
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-display font-bold text-xl">Delete Player?</h3>
                <button
                    onclick={() => (showDeleteConfirm = false)}
                    class="text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                    <IconX size={24} />
                </button>
            </div>
            <p class="text-zinc-400 mb-6">
                This will permanently delete <strong class="text-white"
                    >{player?.name}</strong
                >
                and all associated match data. This action cannot be undone.
            </p>
            <div class="flex gap-3 justify-end">
                <PillButton onclick={() => (showDeleteConfirm = false)}>
                    Cancel
                </PillButton>
                <button
                    onclick={handleDelete}
                    class="rounded-full px-6 py-2.5 text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
{/if}
