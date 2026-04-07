<script lang="ts">
    import { onMount } from "svelte";
    import { DoubleBezel, PillButton, EyebrowTag } from "$lib/components/ui";
    import {
        IconSearch,
        IconUserPlus,
        IconArrowRight,
        IconPlus,
        IconX,
    } from "@tabler/icons-svelte";

    let players = $state<any[]>([]);
    let newName = $state("");
    let search = $state("");
    let loading = $state(true);
    let creating = $state(false);
    let showModal = $state(false);

    onMount(async () => {
        await loadPlayers();
    });

    async function loadPlayers() {
        loading = true;
        const res = await fetch("/api/players");
        players = await res.json();
        loading = false;
    }

    async function createPlayer() {
        if (!newName.trim()) return;
        creating = true;
        await fetch("/api/players", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName.trim() }),
        });
        newName = "";
        creating = false;
        showModal = false;
        await loadPlayers();
    }

    function closeModal() {
        showModal = false;
        newName = "";
    }

    let filteredPlayers = $derived(
        search
            ? players.filter((p) =>
                  p.name.toLowerCase().includes(search.toLowerCase()),
              )
            : players,
    );
</script>

<svelte:head>
    <title>Players — Darts 501</title>
</svelte:head>

<div class="py-8">
    <EyebrowTag>Player Management</EyebrowTag>

    <!-- Title row with + button -->
    <div class="flex items-end justify-between mt-4 mb-8">
        <h1 class="font-display font-extrabold text-5xl md:text-6xl">
            Players
        </h1>
        <button
            onclick={() => (showModal = true)}
            class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/10 rounded border border-zinc-200 dark:border-white/10 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/15 transition-colors cursor-pointer"
        >
            <IconPlus size={16} />
            <span class="hidden sm:inline">Add Player</span>
        </button>
    </div>

    <!-- Search -->
    <div class="mb-4 max-w-md">
        <div class="relative">
            <IconSearch
                size={16}
                class="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
                type="text"
                bind:value={search}
                placeholder="Search players..."
                class="w-full bg-zinc-50 dark:bg-white/5 rounded-full pl-10 pr-4 py-2.5 text-sm ring-1 ring-black/[0.06] dark:ring-white/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
        </div>
    </div>

    <!-- Player grid -->
    {#if loading}
        <div class="text-center text-zinc-400 py-12">Loading...</div>
    {:else if filteredPlayers.length === 0}
        <div class="text-center text-zinc-400 py-12">
            <p>
                {search
                    ? "No players match your search"
                    : "No players yet. Add one!"}
            </p>
        </div>
    {:else}
        <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
        >
            {#each filteredPlayers as player}
                <a href="/players/{player.id}">
                    <DoubleBezel
                        class="cursor-pointer hover:scale-[1.02] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    >
                        <div
                            class="flex flex-col items-center text-center py-2"
                        >
                            <div
                                class="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/10 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-2"
                            >
                                <span class="text-sm font-bold"
                                    >{player.name.charAt(0).toUpperCase()}</span
                                >
                            </div>
                            <div
                                class="font-display font-semibold text-sm truncate w-full"
                            >
                                {player.name}
                            </div>
                            <div class="text-zinc-400 text-[10px] mt-0.5">
                                {new Date(
                                    player.createdAt,
                                ).toLocaleDateString()}
                            </div>
                        </div>
                    </DoubleBezel>
                </a>
            {/each}
        </div>
    {/if}
</div>

<!-- Modal overlay -->
{#if showModal}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onclick={(e) => {
            if (e.target === e.currentTarget) closeModal();
        }}
        onkeydown={(e) => e.key === "Escape" && closeModal()}
    >
        <div class="w-full max-w-sm mx-4">
            <DoubleBezel>
                <div class="flex items-center justify-between mb-4">
                    <h2 class="font-display font-bold text-lg">New Player</h2>
                    <button
                        onclick={closeModal}
                        class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                    >
                        <IconX size={18} />
                    </button>
                </div>
                <div class="space-y-4">
                    <input
                        type="text"
                        bind:value={newName}
                        placeholder="Enter name..."
                        autofocus
                        class="w-full bg-zinc-50 dark:bg-white/5 rounded-full px-4 py-2.5 text-sm ring-1 ring-black/[0.06] dark:ring-white/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        onkeydown={(e) => e.key === "Enter" && createPlayer()}
                    />
                    <PillButton
                        onclick={createPlayer}
                        disabled={creating || !newName.trim()}
                        class="w-full justify-center"
                    >
                        <span class="flex items-center justify-center gap-1.5">
                            <IconUserPlus size={16} />
                            {creating ? "Creating..." : "Add Player"}
                        </span>
                    </PillButton>
                </div>
            </DoubleBezel>
        </div>
    </div>
{/if}
