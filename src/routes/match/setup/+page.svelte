<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { IconArrowLeft } from "@tabler/icons-svelte";
    import { DoubleBezel, PillButton } from "$lib/components/ui";
    import SearchSelect from "$lib/components/ui/SearchSelect.svelte";
    import { emailStore } from "$lib/stores/email";

    let players = $state<any[]>([]);
    let selectedPlayers = $state<any[]>([]);
    let startingScore = $state(501);
    let legsPerSet = $state(3);
    let setsPerMatch = $state(1);
    let doubleIn = $state(false);
    let loading = $state(true);
    let starting = $state(false);

    onMount(async () => {
        const accountId = emailStore.getEmail();
        const res = await fetch(
            `/api/players?accountId=${encodeURIComponent(accountId)}`,
        );
        players = await res.json();
        loading = false;
    });

    function handlePlayerSelect(
        event: CustomEvent<{ id: string; name: string }[]>,
    ) {
        selectedPlayers = event.detail;
    }

    async function startMatch() {
        if (selectedPlayers.length < 1) return;
        starting = true;

        const accountId = emailStore.getEmail();
        const res = await fetch("/api/matches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: accountId,
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
    <title>New Match — dart.monster</title>
</svelte:head>

<div class="py-8">
    <h1 class="font-display font-extrabold text-3xl md:text-4xl mt-2 mb-6">
        New Match
    </h1>

    <!-- Step 1: Select Players -->
    <DoubleBezel class="mb-4">
        <div class="flex items-center justify-between mb-3">
            <h2 class="font-display font-bold text-lg">
                Players
                <span class="text-zinc-400 font-normal text-sm"
                    >({selectedPlayers.length}/4)</span
                >
            </h2>
            {#if selectedPlayers.length > 0}
                <span class="text-xs text-zinc-400"
                    >Throw order: {selectedPlayers
                        .map((p) => p.name)
                        .join(" → ")}</span
                >
            {/if}
        </div>

        {#if loading}
            <div class="text-zinc-400 text-center py-3">Loading players...</div>
        {:else if players.length === 0}
            <div class="text-center py-3">
                <p class="text-zinc-400 text-sm mb-2">
                    No players yet. Create one first!
                </p>
                <a href="/players"
                    ><PillButton variant="secondary">Go to Players</PillButton
                    ></a
                >
            </div>
        {:else}
            <SearchSelect
                options={players}
                bind:selected={selectedPlayers}
                placeholder="Search players to add..."
            />
        {/if}
    </DoubleBezel>

    <!-- Step 2: Configure -->
    <DoubleBezel class="mb-4">
        <h2 class="font-display font-bold text-lg mb-4">Match Format</h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
                <p class="text-xs text-zinc-400 uppercase tracking-wider mb-2">
                    Starting Score
                </p>
                <div class="flex gap-1.5 flex-wrap">
                    {#each scoreOptions as opt}
                        <button
                            onclick={() => (startingScore = opt)}
                            class="rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 {startingScore ===
                            opt
                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 ring-1 ring-black/6 dark:ring-white/10'}"
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
                <div class="flex gap-1.5 flex-wrap">
                    {#each legsOptions as opt}
                        <button
                            onclick={() => (legsPerSet = opt)}
                            class="rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 {legsPerSet ===
                            opt
                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 ring-1 ring-black/6 dark:ring-white/10'}"
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
                <div class="flex gap-1.5 flex-wrap">
                    {#each setsOptions as opt}
                        <button
                            onclick={() => (setsPerMatch = opt)}
                            class="rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 {setsPerMatch ===
                            opt
                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 ring-1 ring-black/6 dark:ring-white/10'}"
                        >
                            {opt}
                        </button>
                    {/each}
                </div>
            </div>

            <div>
                <p class="text-xs text-zinc-400 uppercase tracking-wider mb-2">
                    Double-in
                </p>
                <button
                    onclick={() => (doubleIn = !doubleIn)}
                    role="switch"
                    aria-checked={doubleIn}
                    aria-label="Toggle double-in rule"
                    class="w-11 h-6 rounded-full transition-all duration-300 {doubleIn
                        ? 'bg-emerald-500'
                        : 'bg-zinc-200 dark:bg-white/10'}"
                >
                    <div
                        class="w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-300 {doubleIn
                            ? 'translate-x-6'
                            : 'translate-x-1'}"
                    ></div>
                </button>
            </div>
        </div>

        <!-- Start Match Button -->
        <div class="mt-5 flex justify-end">
            <PillButton
                onclick={startMatch}
                disabled={selectedPlayers.length < 1 || starting}
            >
                {starting ? "Starting..." : "Start Match"}
            </PillButton>
        </div>
        {#if selectedPlayers.length < 1}
            <p class="text-zinc-400 text-xs mt-1.5 text-right">
                Select at least 1 player
            </p>
        {/if}
    </DoubleBezel>
</div>
