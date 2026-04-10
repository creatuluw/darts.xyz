<script lang="ts">
    import { onMount } from "svelte";
    import { DoubleBezel, PillButton, EyebrowTag } from "$lib/components/ui";
    import {
        IconTarget,
        IconSearch,
        IconArchive,
        IconTrash,
        IconRotateClockwise,
    } from "@tabler/icons-svelte";

    let archived = $state<any[]>([]);
    let search = $state("");
    let loading = $state(true);
    let restoring = $state<string | null>(null);
    let showRestoreConfirm = $state<string | null>(null);

    onMount(async () => {
        await loadArchived();
    });

    async function loadArchived() {
        loading = true;
        const res = await fetch("/api/players/archived");
        archived = await res.json();
        loading = false;
    }

    async function restorePlayer(id: string) {
        restoring = id;
        showRestoreConfirm = null;
        await fetch(`/api/players/archived/${id}/restore`, { method: "POST" });
        restoring = null;
        await loadArchived();
    }

    let filteredArchived = $derived(
        search
            ? archived.filter((p) =>
                  p.name.toLowerCase().includes(search.toLowerCase()),
              )
            : archived,
    );

    function formatDate(dateStr: string | null) {
        if (!dateStr) return "Unknown";
        return new Date(dateStr).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }
</script>

<svelte:head>
    <title>Archive — Darts 501</title>
</svelte:head>

<div class="py-8">
    <EyebrowTag>Data Management</EyebrowTag>
    <h1 class="font-display font-extrabold text-5xl md:text-6xl mt-4 mb-2">
        Archive
    </h1>
    <p class="text-zinc-400 text-sm mb-8">
        Archived players are hidden from the active roster but all match data
        remains preserved for replays and reporting.
    </p>

    <div class="mb-4">
        <div class="relative">
            <IconSearch
                size={16}
                class="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
                type="text"
                bind:value={search}
                placeholder="Search archived players..."
                class="w-full bg-zinc-50 dark:bg-white/5 rounded-full pl-10 pr-4 py-2.5 text-sm ring-1 ring-black/[0.06] dark:ring-white/10 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            />
        </div>
    </div>

    {#if loading}
        <div class="text-center text-zinc-400 py-12">Loading...</div>
    {:else if filteredArchived.length === 0}
        <div class="text-center text-zinc-400 py-12">
            <div class="mb-3 flex justify-center">
                <IconArchive
                    size={40}
                    class="text-zinc-300 dark:text-zinc-600"
                />
            </div>
            <p>
                {search
                    ? "No archived players match your search"
                    : "No archived players. Soft-deleted players will appear here."}
            </p>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            {#each filteredArchived as player}
                <DoubleBezel>
                    <div class="flex items-start justify-between">
                        <div class="flex-1 min-w-0">
                            <div
                                class="font-display font-semibold text-lg truncate"
                            >
                                {player.name}
                            </div>
                            <div
                                class="text-zinc-400 text-xs mt-0.5 flex items-center gap-1.5"
                            >
                                <IconArchive
                                    size={12}
                                    class="text-amber-500/60"
                                />
                                Archived{" "}
                                {formatDate(player.deletedAt)}
                            </div>
                            <div class="text-zinc-500 text-xs mt-0.5">
                                Created{" "}
                                {formatDate(player.createdAt)}
                            </div>
                        </div>

                        <div class="flex flex-col items-end gap-2">
                            {#if showRestoreConfirm === player.id}
                                <div
                                    class="flex items-center gap-1.5 text-xs text-zinc-400 bg-amber-500/10 px-3 py-1.5 rounded-full"
                                >
                                    <span>Restore?</span>
                                    <button
                                        onclick={() => restorePlayer(player.id)}
                                        disabled={restoring === player.id}
                                        class="text-emerald-400 hover:text-emerald-300 font-medium disabled:opacity-50 transition-colors"
                                    >
                                        {restoring === player.id
                                            ? "..."
                                            : "Yes"}
                                    </button>
                                    <button
                                        onclick={() =>
                                            (showRestoreConfirm = null)}
                                        class="text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        No
                                    </button>
                                </div>
                            {:else}
                                <PillButton
                                    onclick={() =>
                                        (showRestoreConfirm = player.id)}
                                    class="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 disabled:opacity-50"
                                >
                                    <span class="flex items-center gap-1">
                                        <IconRotateClockwise size={14} />
                                        Restore
                                    </span>
                                </PillButton>
                            {/if}
                        </div>
                    </div>
                </DoubleBezel>
            {/each}
        </div>
    {/if}
</div>
