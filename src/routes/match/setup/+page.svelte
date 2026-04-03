<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { IconArrowLeft } from "@tabler/icons-svelte";
    import { DoubleBezel, PillButton, EyebrowTag } from "$lib/components/ui";

    let players = $state<any[]>([]);
    let selectedPlayers = $state<any[]>([]);
    let startingScore = $state(501);
    let legsPerSet = $state(3);
    let setsPerMatch = $state(1);
    let doubleIn = $state(false);
    let loading = $state(true);
    let starting = $state(false);

    onMount(async () => {
        const res = await fetch("/api/players");
        players = await res.json();
        loading = false;
    });

    function togglePlayer(player: any) {
        if (selectedPlayers.find((p) => p.id === player.id)) {
            selectedPlayers = selectedPlayers.filter((p) => p.id !== player.id);
        } else if (selectedPlayers.length < 4) {
            selectedPlayers = [...selectedPlayers, player];
        }
    }

    async function startMatch() {
        if (selectedPlayers.length < 2) return;
        starting = true;

        const res = await fetch("/api/matches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                startingScore,
                legsPerSet,
                setsPerMatch,
                doubleIn,
                players: selectedPlayers,
            }),
        });

        const data = await res.json();
        goto(`/match/${data.match.id}`);
    }

    const scoreOptions = [301, 501, 701, 1001];
    const legsOptions = [1, 3, 5, 7];
    const setsOptions = [1, 3, 5, 7];
</script>

<svelte:head>
    <title>New Match — Darts 501</title>
</svelte:head>

<div class="py-8">
    <a
        href="/"
        class="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm mb-4 inline-flex items-center gap-1"
    >
        <IconArrowLeft size={14} />
        Home
    </a>
    <EyebrowTag>Match Setup</EyebrowTag>
    <h1 class="font-display font-extrabold text-5xl md:text-6xl mt-4 mb-8">
        New Match
    </h1>

    <!-- Step 1: Select Players -->
    <DoubleBezel class="mb-6">
        <h2 class="font-display font-bold text-xl mb-4">
            Select Players
            <span class="text-zinc-400 font-normal text-sm"
                >({selectedPlayers.length}/4)</span
            >
        </h2>

        {#if loading}
            <div class="text-zinc-400 text-center py-4">Loading players...</div>
        {:else if players.length === 0}
            <div class="text-center py-4">
                <p class="text-zinc-400 mb-3">
                    No players yet. Create one first!
                </p>
                <a href="/players"
                    ><PillButton variant="secondary">Go to Players</PillButton
                    ></a
                >
            </div>
        {:else}
            <div class="flex flex-wrap gap-2">
                {#each players as player}
                    {@const isSelected = selectedPlayers.find(
                        (p) => p.id === player.id,
                    )}
                    <button
                        onclick={() => togglePlayer(player)}
                        class="rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] {isSelected
                            ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                            : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 ring-1 ring-black/[0.06] dark:ring-white/10 hover:bg-zinc-200 dark:hover:bg-white/15'}"
                    >
                        {player.name}
                    </button>
                {/each}
            </div>
        {/if}

        {#if selectedPlayers.length > 0}
            <div class="mt-4 pt-4 border-t border-zinc-100 dark:border-white/5">
                <p class="text-xs text-zinc-400 uppercase tracking-wider mb-2">
                    Throw order
                </p>
                <div class="flex gap-2 flex-wrap">
                    {#each selectedPlayers as player, i}
                        <span
                            class="rounded-full px-4 py-1.5 text-sm font-mono bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                        >
                            {i + 1}. {player.name}
                        </span>
                    {/each}
                </div>
            </div>
        {/if}
    </DoubleBezel>

    <!-- Step 2: Configure -->
    <DoubleBezel class="mb-6">
        <h2 class="font-display font-bold text-xl mb-4">Match Format</h2>

        <div class="space-y-5">
            <div>
                <p class="text-xs text-zinc-400 uppercase tracking-wider mb-2">
                    Starting Score
                </p>
                <div class="flex gap-2 flex-wrap">
                    {#each scoreOptions as opt}
                        <button
                            onclick={() => (startingScore = opt)}
                            class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] {startingScore ===
                            opt
                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 ring-1 ring-black/[0.06] dark:ring-white/10'}"
                        >
                            {opt}
                        </button>
                    {/each}
                </div>
            </div>

            <div>
                <p class="text-xs text-zinc-400 uppercase tracking-wider mb-2">
                    Legs per Set
                </p>
                <div class="flex gap-2 flex-wrap">
                    {#each legsOptions as opt}
                        <button
                            onclick={() => (legsPerSet = opt)}
                            class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] {legsPerSet ===
                            opt
                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 ring-1 ring-black/[0.06] dark:ring-white/10'}"
                        >
                            {opt}
                        </button>
                    {/each}
                </div>
            </div>

            <div>
                <p class="text-xs text-zinc-400 uppercase tracking-wider mb-2">
                    Sets per Match
                </p>
                <div class="flex gap-2 flex-wrap">
                    {#each setsOptions as opt}
                        <button
                            onclick={() => (setsPerMatch = opt)}
                            class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] {setsPerMatch ===
                            opt
                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 ring-1 ring-black/[0.06] dark:ring-white/10'}"
                        >
                            {opt}
                        </button>
                    {/each}
                </div>
            </div>

            <div class="flex items-center gap-3">
                <button
                    onclick={() => (doubleIn = !doubleIn)}
                    role="switch"
                    aria-checked={doubleIn}
                    aria-label="Toggle double-in rule"
                    class="w-12 h-7 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] {doubleIn
                        ? 'bg-emerald-500'
                        : 'bg-zinc-200 dark:bg-white/10'}"
                >
                    <div
                        class="w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] {doubleIn
                            ? 'translate-x-6'
                            : 'translate-x-1'}"
                    ></div>
                </button>
                <span class="text-sm">Double-in rule</span>
            </div>
        </div>

        <!-- Start Match Button -->
        <div class="mt-6 flex justify-end">
            <PillButton
                onclick={startMatch}
                disabled={selectedPlayers.length < 2 || starting}
            >
                {starting ? "Starting..." : "Start Match"}
            </PillButton>
        </div>
        {#if selectedPlayers.length < 2}
            <p class="text-zinc-400 text-sm mt-2 text-right">
                Select at least 2 players
            </p>
        {/if}
    </DoubleBezel>
</div>
