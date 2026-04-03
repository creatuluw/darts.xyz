<script lang="ts">
    import { onMount } from "svelte";
    import { DoubleBezel, EyebrowTag } from "$lib/components/ui";
    import {
        IconCircleCheck,
        IconCircleX,
        IconDeviceGamepad2,
        IconClipboardList,
    } from "@tabler/icons-svelte";

    let matches = $state<any[]>([]);
    let loading = $state(true);

    onMount(async () => {
        const res = await fetch("/api/matches?limit=50");
        matches = await res.json();
        loading = false;
    });
</script>

<svelte:head>
    <title>Match History — Darts 501</title>
</svelte:head>

<div class="py-8">
    <EyebrowTag>History</EyebrowTag>
    <h1 class="font-display font-extrabold text-5xl md:text-6xl mt-4 mb-8">
        Match History
    </h1>

    {#if loading}
        <div class="text-center text-zinc-400 py-12">Loading...</div>
    {:else if matches.length === 0}
        <div class="text-center text-zinc-400 py-12">
            <div class="text-4xl mb-3 text-zinc-300">
                <IconClipboardList size={48} stroke={1.5} />
            </div>
            <p>No matches played yet</p>
        </div>
    {:else}
        <div class="space-y-3">
            {#each matches as match}
                <a href="/history/{match.id}">
                    <DoubleBezel
                        class="cursor-pointer hover:scale-[1.005] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    >
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <span class="text-lg">
                                    {#if match.status === "completed"}
                                        <IconCircleCheck
                                            size={22}
                                            class="text-emerald-500"
                                        />
                                    {:else if match.status === "abandoned"}
                                        <IconCircleX
                                            size={22}
                                            class="text-red-400"
                                        />
                                    {:else}
                                        <IconDeviceGamepad2
                                            size={22}
                                            class="text-blue-400"
                                        />
                                    {/if}
                                </span>
                                <div>
                                    <div class="text-sm font-medium">
                                        {match.startingScore} ·
                                        {match.legsPerSet} legs/set ·
                                        {match.setsPerMatch} sets
                                    </div>
                                    <div class="text-xs text-zinc-400 mt-0.5">
                                        {match.status === "in_progress"
                                            ? "In Progress"
                                            : match.status === "completed"
                                              ? "Completed"
                                              : "Abandoned"}
                                    </div>
                                </div>
                            </div>
                            <div class="text-zinc-400 text-xs">
                                {new Date(match.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </DoubleBezel>
                </a>
            {/each}
        </div>
    {/if}
</div>
