<script lang="ts">
    import { onMount } from "svelte";
    import { DoubleBezel, PillButton, EyebrowTag } from "$lib/components/ui";
    import {
        IconTarget,
        IconSearch,
        IconUserPlus,
        IconArrowRight,
    } from "@tabler/icons-svelte";

    let players = $state<any[]>([]);
    let newName = $state("");
    let search = $state("");
    let loading = $state(true);
    let creating = $state(false);

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
        await loadPlayers();
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
    <h1 class="font-display font-extrabold text-5xl md:text-6xl mt-4 mb-8">
        Players
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Create player -->
        <DoubleBezel class="lg:col-span-1">
            <h2 class="font-display font-bold text-lg mb-4">New Player</h2>
            <div class="flex gap-2">
                <input
                    type="text"
                    bind:value={newName}
                    placeholder="Enter name..."
                    class="flex-1 bg-zinc-50 dark:bg-white/5 rounded-full px-4 py-2.5 text-sm ring-1 ring-black/[0.06] dark:ring-white/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    onkeydown={(e) => e.key === "Enter" && createPlayer()}
                />
                <PillButton
                    onclick={createPlayer}
                    disabled={creating || !newName.trim()}
                >
                    <span class="flex items-center gap-1.5">
                        <IconUserPlus size={16} />
                        {creating ? "..." : "Add"}
                    </span>
                </PillButton>
            </div>
        </DoubleBezel>

        <!-- Player list -->
        <div class="lg:col-span-2">
            <div class="mb-4">
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

            {#if loading}
                <div class="text-center text-zinc-400 py-12">Loading...</div>
            {:else if filteredPlayers.length === 0}
                <div class="text-center text-zinc-400 py-12">
                    <div class="mb-3 flex justify-center">
                        <IconTarget
                            size={40}
                            class="text-zinc-300 dark:text-zinc-600"
                        />
                    </div>
                    <p>
                        {search
                            ? "No players match your search"
                            : "No players yet. Create one above!"}
                    </p>
                </div>
            {:else}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {#each filteredPlayers as player}
                        <a href="/players/{player.id}">
                            <DoubleBezel
                                class="cursor-pointer hover:scale-[1.01] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                            >
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div
                                            class="font-display font-semibold text-lg"
                                        >
                                            {player.name}
                                        </div>
                                        <div
                                            class="text-zinc-400 text-xs mt-0.5"
                                        >
                                            Added {new Date(
                                                player.createdAt,
                                            ).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div
                                        class="text-zinc-300 dark:text-zinc-600"
                                    >
                                        <IconArrowRight size={20} />
                                    </div>
                                </div>
                            </DoubleBezel>
                        </a>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>
