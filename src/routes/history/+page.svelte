<script lang="ts">
    import { onMount } from "svelte";
    import { DoubleBezel } from "$lib/components/ui";
    import {
        IconCircleCheck,
        IconCircleX,
        IconDeviceGamepad2,
        IconClipboardList,
        IconSearch,
    } from "@tabler/icons-svelte";
    import { emailStore } from "$lib/stores/email";

    let matches = $state<any[]>([]);
    let search = $state("");
    let loading = $state(true);

    let filteredMatches = $derived(
        search
            ? matches.filter((m) => {
                  const playerNames =
                      m.players?.map((p: any) => p.name).join(" ") || "";
                  const searchText =
                      `${m.startingScore} ${m.legsPerSet} ${m.setsPerMatch} ${playerNames}`.toLowerCase();
                  return searchText.includes(search.toLowerCase());
              })
            : matches,
    );

    onMount(async () => {
        const accountId = emailStore.getEmail();
        const res = await fetch(
            `/api/matches/with-players?accountId=${encodeURIComponent(accountId)}&limit=50`,
        );
        matches = await res.json();
        loading = false;
    });
</script>

<svelte:head>
    <title>Match History — dart.monster</title>
</svelte:head>

<div class="py-8">
    <h1 class="font-display font-extrabold text-3xl md:text-4xl mt-2 mb-6">
        Match History
    </h1>

    <!-- Search -->
    <div class="mb-4">
        <div class="relative">
            <IconSearch
                size={16}
                class="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
                type="text"
                bind:value={search}
                placeholder="Search matches..."
                class="w-full bg-zinc-50 dark:bg-white/5 rounded-full pl-10 pr-4 py-2.5 text-sm ring-1 ring-black/[0.06] dark:ring-white/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
        </div>
    </div>

    {#if loading}
        <div class="text-center text-zinc-400 py-12">Loading...</div>
    {:else if filteredMatches.length === 0}
        <div class="text-center text-zinc-400 py-12">
            <div class="text-4xl mb-3 text-zinc-300">
                <IconClipboardList size={48} stroke={1.5} />
            </div>
            <p>
                {search
                    ? "No matches match your search"
                    : "No matches played yet"}
            </p>
        </div>
    {:else}
        <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
        >
            {#each filteredMatches as match}
                <a href="/history/{match.id}">
                    <DoubleBezel
                        class="cursor-pointer hover:scale-[1.02] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    >
                        <div
                            class="flex flex-col items-center text-center py-2"
                        >
                            <div
                                class="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/10 flex items-center justify-center mb-2"
                            >
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
                            </div>
                            <div class="font-display font-semibold text-sm">
                                {match.startingScore} · {match.legsPerSet}/{match.setsPerMatch}
                            </div>
                            <div class="text-zinc-400 text-[10px] mt-0.5">
                                {match.players
                                    ?.map((p: any) => p.name)
                                    .join(" vs ") || "No players"}
                            </div>
                            <div
                                class="text-zinc-300 dark:text-zinc-600 text-[9px] mt-0.5"
                            >
                                {new Date(match.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </DoubleBezel>
                </a>
            {/each}
        </div>
    {/if}
</div>
