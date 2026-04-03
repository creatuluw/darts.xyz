<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import {
        DoubleBezel,
        PillButton,
        EyebrowTag,
        StatBadge,
    } from "$lib/components/ui";
    import {
        IconArrowLeft,
        IconCircleCheck,
        IconCircleX,
        IconDeviceGamepad2,
        IconPlayerPlay,
        IconTrash,
        IconAlertTriangle,
    } from "@tabler/icons-svelte";

    let matchId = $derived($page.params.id);
    let matchData = $state<any>(null);
    let playerNames = $state<Record<string, string>>({});
    let loading = $state(true);
    let showDeleteConfirm = $state(false);
    let deleting = $state(false);

    onMount(async () => {
        const res = await fetch(`/api/matches/${matchId}`);
        matchData = await res.json();

        // Fetch player names
        if (matchData?.matchPlayers) {
            for (const mp of matchData.matchPlayers) {
                try {
                    const pRes = await fetch(`/api/players/${mp.playerId}`);
                    const pData = await pRes.json();
                    playerNames[mp.playerId] = pData.name;
                } catch {
                    playerNames[mp.playerId] =
                        mp.playerId.substring(0, 8) + "…";
                }
            }
        }

        loading = false;
    });

    async function handleResume() {
        goto(`/match/${matchId}`);
    }

    async function handleDelete() {
        if (!showDeleteConfirm) {
            showDeleteConfirm = true;
            return;
        }

        deleting = true;
        try {
            await fetch(`/api/matches/${matchId}`, { method: "DELETE" });
            goto("/history");
        } catch (e) {
            console.error("Failed to delete match", e);
            deleting = false;
        }
    }

    function cancelDelete() {
        showDeleteConfirm = false;
    }

    function getPlayerName(id: string): string {
        return playerNames[id] || id.substring(0, 8) + "…";
    }

    function getStatusInfo(status: string) {
        if (status === "completed")
            return {
                icon: IconCircleCheck,
                text: "Completed",
                color: "text-emerald-500",
            };
        if (status === "abandoned")
            return {
                icon: IconCircleX,
                text: "Abandoned",
                color: "text-red-500",
            };
        return {
            icon: IconDeviceGamepad2,
            text: "In Progress",
            color: "text-blue-400",
        };
    }
</script>

<svelte:head>
    <title>Match Detail — Darts 501</title>
</svelte:head>

<div class="py-8">
    <a
        href="/history"
        class="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm mb-4 inline-flex items-center gap-1"
    >
        <IconArrowLeft size={14} />
        History
    </a>

    {#if loading}
        <div class="text-center text-zinc-400 py-12">Loading...</div>
    {:else if matchData}
        {@const status = getStatusInfo(matchData.match.status)}
        {@const isInProgress = matchData.match.status === "in_progress"}

        <div class="flex items-start justify-between gap-4 flex-wrap">
            <div>
                <EyebrowTag>Match Detail</EyebrowTag>
                <h1 class="font-display font-extrabold text-4xl mt-4 mb-2">
                    {matchData.match.startingScore} · Best of
                    {matchData.match.legsPerSet} legs ·
                    {matchData.match.setsPerMatch} set{matchData.match
                        .setsPerMatch !== 1
                        ? "s"
                        : ""}
                </h1>
                <p class="text-zinc-400 mb-2 flex items-center gap-1.5">
                    <svelte:component
                        this={status.icon}
                        size={16}
                        class={status.color}
                    />
                    {status.text}
                    <span class="ml-1"
                        >· {new Date(
                            matchData.match.createdAt,
                        ).toLocaleString()}</span
                    >
                </p>

                <!-- Players -->
                {#if matchData.matchPlayers?.length > 0}
                    <div class="flex flex-wrap gap-2 mt-3 mb-4">
                        {#each matchData.matchPlayers as mp, i}
                            <span
                                class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium bg-zinc-100 dark:bg-white/10 ring-1 ring-black/[0.06] dark:ring-white/10"
                            >
                                {getPlayerName(mp.playerId)}
                                {#if matchData.match.winnerId === mp.playerId}
                                    <span class="text-amber-500">★</span>
                                {/if}
                            </span>
                            {#if i < matchData.matchPlayers.length - 1}
                                <span
                                    class="text-zinc-300 dark:text-zinc-600 self-center text-xs"
                                    >vs</span
                                >
                            {/if}
                        {/each}
                    </div>
                {/if}
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 flex-shrink-0 mt-6">
                {#if isInProgress}
                    <button onclick={handleResume}>
                        <PillButton>
                            <IconPlayerPlay size={16} />
                            Resume
                        </PillButton>
                    </button>
                {/if}

                {#if !showDeleteConfirm}
                    <button
                        onclick={handleDelete}
                        class="rounded-full px-4 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors inline-flex items-center gap-1.5"
                    >
                        <IconTrash size={14} />
                        Delete
                    </button>
                {:else}
                    <div
                        class="flex items-center gap-2 rounded-[5px] px-3 py-2 bg-red-50 dark:bg-red-500/10 ring-1 ring-red-200 dark:ring-red-500/20"
                    >
                        <IconAlertTriangle
                            size={16}
                            class="text-red-500 flex-shrink-0"
                        />
                        <span
                            class="text-xs text-red-600 dark:text-red-400 font-medium"
                            >Delete this match?</span
                        >
                        <button
                            onclick={handleDelete}
                            disabled={deleting}
                            class="rounded-[5px] px-3 py-1 text-xs font-bold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                        >
                            {deleting ? "Deleting…" : "Yes, delete"}
                        </button>
                        <button
                            onclick={cancelDelete}
                            disabled={deleting}
                            class="rounded-[5px] px-3 py-1 text-xs font-medium bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/15 disabled:opacity-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                {/if}
            </div>
        </div>

        <!-- Legs -->
        {#if matchData.legs && matchData.legs.length > 0}
            <EyebrowTag class="mb-3 mt-6">Legs</EyebrowTag>
            <div class="space-y-2">
                {#each matchData.legs as leg}
                    <DoubleBezel>
                        <div class="flex items-center justify-between">
                            <div>
                                <span class="text-sm font-medium"
                                    >Set {leg.setNumber} · Leg
                                    {leg.legNumber}</span
                                >
                            </div>
                            <div class="text-sm text-zinc-400">
                                {#if leg.winnerId}
                                    <span
                                        class="text-emerald-600 dark:text-emerald-400 font-medium"
                                        >{getPlayerName(leg.winnerId)}</span
                                    >
                                    won
                                {:else}
                                    In progress
                                {/if}
                            </div>
                        </div>
                    </DoubleBezel>
                {/each}
            </div>
        {:else}
            <div class="text-zinc-400 text-center py-8">No legs recorded</div>
        {/if}
    {:else}
        <div class="text-center text-zinc-400 py-12">Match not found</div>
    {/if}
</div>
