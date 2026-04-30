<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import {
        DoubleBezel,
        PillButton,
        AnimatedNumber,
    } from "$lib/components/ui";
    import {
        IconArrowLeft,
        IconTarget,
        IconCheck,
        IconX,
        IconTrophy,
        IconHistory,
    } from "@tabler/icons-svelte";

    let playerId = $derived($page.params.id as string);
    let player = $state<any>(null);
    let checkoutData = $state<any>(null);
    let loading = $state(true);

    onMount(async () => {
        await loadCheckoutData();
    });

    async function loadCheckoutData() {
        loading = true;

        // Load player info
        const playerRes = await fetch(`/api/players/${playerId}`);
        if (playerRes.status === 404) {
            goto("/players");
            return;
        }
        player = await playerRes.json();

        // Load detailed checkout stats
        const checkoutRes = await fetch(`/api/stats/${playerId}/checkout`);
        if (checkoutRes.ok) {
            checkoutData = await checkoutRes.json();
        }

        loading = false;
    }

    function getCheckoutLevel(pct: number) {
        if (pct >= 40) return { label: "Elite", color: "text-emerald-400" };
        if (pct >= 30) return { label: "Strong", color: "text-blue-400" };
        if (pct >= 20) return { label: "Average", color: "text-amber-400" };
        return { label: "Needs Work", color: "text-rose-400" };
    }

    function formatRange(range: any) {
        if (!range) return "N/A";
        if (range.label) return range.label;
        return `${range.from}-${range.to}`;
    }
</script>

<svelte:head>
    <title>Checkout Breakdown - {player?.playerName || "Loading..."}</title>
</svelte:head>

<div class="py-8">
    {#if loading}
        <div class="text-center text-zinc-400 py-24">Loading...</div>
    {:else if player && checkoutData}
        <!-- Header -->
        <div class="flex items-center gap-3 mb-4">
            <button
                onclick={() => goto(`/players/${playerId}`)}
                class="p-2 hover:bg-white/5 rounded-lg transition-colors"
                title="Back to Player Profile"
            >
                <IconArrowLeft size={20} />
            </button>
            <div>
                <h1 class="font-display font-extrabold text-2xl md:text-3xl">
                    {player.playerName}
                </h1>
                <p class="text-zinc-400 text-sm">
                    Checkout Performance Breakdown
                </p>
            </div>
        </div>

        <!-- Summary Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <DoubleBezel>
                <div class="text-center">
                    <div
                        class="text-xs text-zinc-400 uppercase tracking-wider mb-1"
                    >
                        Double Conversion
                    </div>
                    <div
                        class="text-3xl font-display font-bold {checkoutData.doubleConversion >=
                        30
                            ? 'text-emerald-400'
                            : checkoutData.doubleConversion >= 20
                              ? 'text-blue-400'
                              : 'text-amber-400'}"
                    >
                        {checkoutData.doubleConversion}%
                    </div>
                </div>
            </DoubleBezel>
            <DoubleBezel>
                <div class="text-center">
                    <div
                        class="text-xs text-zinc-400 uppercase tracking-wider mb-1"
                    >
                        Successful
                    </div>
                    <div
                        class="text-3xl font-display font-bold text-emerald-400"
                    >
                        {checkoutData.checkoutSuccesses}
                    </div>
                </div>
            </DoubleBezel>
            <DoubleBezel>
                <div class="text-center">
                    <div
                        class="text-xs text-zinc-400 uppercase tracking-wider mb-1"
                    >
                        Throws on Double
                    </div>
                    <div class="text-3xl font-display font-bold text-blue-400">
                        {checkoutData.throwsOnDouble}
                    </div>
                </div>
            </DoubleBezel>
            <DoubleBezel>
                <div class="text-center">
                    <div
                        class="text-xs text-zinc-400 uppercase tracking-wider mb-1"
                    >
                        Double Chances
                    </div>
                    <div class="text-xl font-display font-bold text-purple-400">
                        {checkoutData.doubleChances}
                    </div>
                </div>
            </DoubleBezel>
        </div>

        <!-- Double Chance Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <DoubleBezel>
                <div class="text-center">
                    <div
                        class="text-xs text-zinc-400 uppercase tracking-wider mb-1"
                    >
                        Double Chances
                    </div>
                    <div
                        class="text-3xl font-display font-bold text-purple-400"
                    >
                        {checkoutData.doubleChances ?? 0}
                    </div>
                    <div class="text-xs text-zinc-500 mt-1">Left on double</div>
                </div>
            </DoubleBezel>
            <DoubleBezel>
                <div class="text-center">
                    <div
                        class="text-xs text-zinc-400 uppercase tracking-wider mb-1"
                    >
                        Throws on Double
                    </div>
                    <div class="text-3xl font-display font-bold text-amber-400">
                        {checkoutData.throwsOnDouble ?? 0}
                    </div>
                    <div class="text-xs text-zinc-500 mt-1">
                        Attempts while on double
                    </div>
                </div>
            </DoubleBezel>
            <DoubleBezel>
                <div class="text-center">
                    <div
                        class="text-xs text-zinc-400 uppercase tracking-wider mb-1"
                    >
                        Double Conversion
                    </div>
                    <div
                        class="text-3xl font-display font-bold {checkoutData.doubleConversion >=
                        30
                            ? 'text-emerald-400'
                            : checkoutData.doubleConversion >= 20
                              ? 'text-blue-400'
                              : 'text-amber-400'}"
                    >
                        {checkoutData.doubleConversion ?? 0}%
                    </div>
                    <div class="text-xs text-zinc-500 mt-1">
                        Success rate on doubles
                    </div>
                </div>
            </DoubleBezel>
            <DoubleBezel>
                <div class="text-center">
                    <div
                        class="text-xs text-zinc-400 uppercase tracking-wider mb-1"
                    >
                        Double Efficiency
                    </div>
                    <div class="text-3xl font-display font-bold text-cyan-400">
                        {checkoutData.checkoutAttempts > 0
                            ? (
                                  (checkoutData.doubleChances /
                                      checkoutData.checkoutAttempts) *
                                  100
                              ).toFixed(0)
                            : 0}%
                    </div>
                    <div class="text-xs text-zinc-500 mt-1">
                        Chances per attempt
                    </div>
                </div>
            </DoubleBezel>
        </div>

        <!-- Checkout Range Breakdown -->
        {#if checkoutData.checkoutRanges && checkoutData.checkoutRanges.length > 0}
            <DoubleBezel class="mb-6">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                        <IconTarget size={20} class="text-zinc-400" />
                        <h2 class="font-display font-bold text-lg">
                            By Score Range
                        </h2>
                    </div>
                    <span class="text-xs text-zinc-400">
                        Double Conversion %
                    </span>
                </div>
                <div class="space-y-2">
                    {#each checkoutData.checkoutRanges as range}
                        <div class="flex items-center gap-3">
                            <div class="w-20 text-xs text-zinc-400 font-mono">
                                {formatRange(range)}
                            </div>
                            <div class="flex-1">
                                <div
                                    class="h-2 bg-zinc-800 rounded-full overflow-hidden"
                                >
                                    <div
                                        class="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                                        style="width: {range.doubleConversion >
                                        0
                                            ? range.doubleConversion
                                            : 0}%"
                                    ></div>
                                </div>
                            </div>
                            <div class="w-24 text-right">
                                {#if range.throwsOnDouble > 0}
                                    <span
                                        class="text-sm font-mono {range.doubleConversion >=
                                        30
                                            ? 'text-emerald-400'
                                            : range.doubleConversion >= 20
                                              ? 'text-blue-400'
                                              : 'text-amber-400'}"
                                    >
                                        {range.doubleConversion}% ({range.successesOnDouble}/{range.throwsOnDouble})
                                    </span>
                                {:else}
                                    <span class="text-xs text-zinc-600"
                                        >No data</span
                                    >
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </DoubleBezel>
        {/if}

        <!-- Best Finishes -->
        {#if checkoutData.bestFinishes && checkoutData.bestFinishes.length > 0}
            <DoubleBezel class="mb-6">
                <div class="flex items-center gap-2 mb-4">
                    <IconTrophy size={20} class="text-zinc-400" />
                    <h2 class="font-display font-bold text-lg">
                        Best Finishes
                    </h2>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {#each checkoutData.bestFinishes as finish, idx}
                        <div class="text-center p-3 rounded-lg bg-white/5">
                            <div
                                class="text-2xl font-display font-bold text-amber-400"
                            >
                                {finish.score}
                            </div>
                            <div class="text-xs text-zinc-400 mt-1">
                                {finish.darts} darts
                            </div>
                        </div>
                    {/each}
                </div>
            </DoubleBezel>
        {/if}

        <!-- Recent Checkout History -->
        {#if checkoutData.recentCheckouts && checkoutData.recentCheckouts.length > 0}
            <DoubleBezel>
                <div class="flex items-center gap-2 mb-4">
                    <IconHistory size={20} class="text-zinc-400" />
                    <h2 class="font-display font-bold text-lg">
                        Recent Checkouts
                    </h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr
                                class="border-b border-zinc-100 dark:border-white/5"
                            >
                                <th
                                    class="text-left pb-2 pr-4 text-xs text-zinc-400 uppercase"
                                    >Date</th
                                >
                                <th
                                    class="text-center pb-2 px-2 text-xs text-zinc-400 uppercase"
                                    >Score</th
                                >
                                <th
                                    class="text-center pb-2 px-2 text-xs text-zinc-400 uppercase"
                                    >Darts</th
                                >
                                <th
                                    class="text-center pb-2 px-2 text-xs text-zinc-400 uppercase"
                                    >Route</th
                                >
                                <th
                                    class="text-center pb-2 pl-2 text-xs text-zinc-400 uppercase"
                                    >Result</th
                                >
                            </tr>
                        </thead>
                        <tbody>
                            {#each checkoutData.recentCheckouts as checkout}
                                <tr
                                    class="border-b border-zinc-100 dark:border-white/5"
                                >
                                    <td
                                        class="py-2 px-2 text-zinc-400 font-mono text-xs"
                                    >
                                        {new Date(
                                            checkout.date,
                                        ).toLocaleDateString()}
                                    </td>
                                    <td class="py-2 px-2 text-center font-mono">
                                        {checkout.score}
                                    </td>
                                    <td
                                        class="py-2 px-2 text-center font-mono text-zinc-400"
                                    >
                                        {checkout.darts}
                                    </td>
                                    <td
                                        class="py-2 px-2 text-center font-mono text-zinc-400"
                                    >
                                        {checkout.route || "—"}
                                    </td>
                                    <td class="py-2 px-2 text-center">
                                        {#if checkout.success}
                                            <span
                                                class="inline-flex items-center gap-1 text-emerald-400"
                                            >
                                                <IconCheck size={14} />
                                                <span class="text-xs"
                                                    >Success</span
                                                >
                                            </span>
                                        {:else}
                                            <span
                                                class="inline-flex items-center gap-1 text-rose-400"
                                            >
                                                <IconX size={14} />
                                                <span class="text-xs"
                                                    >Missed</span
                                                >
                                            </span>
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </DoubleBezel>
        {/if}
    {:else}
        <div class="text-center text-zinc-400 py-24">
            <p>No checkout data available</p>
            <button
                onclick={() => goto(`/players/${playerId}`)}
                class="mt-4 text-blue-400 hover:text-blue-300"
            >
                ← Back to Player
            </button>
        </div>
    {/if}
</div>
