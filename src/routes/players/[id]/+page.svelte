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
        IconChartBar,
        IconPlayerPlay,
        IconMail,
        IconCheck,
        IconPencil,
    } from "@tabler/icons-svelte";

    let playerId = $derived($page.params.id as string);
    let player = $state<any>(null);
    let stats = $state<any>(null);
    let matches = $state<any[]>([]);
    let loading = $state(true);
    let showDeleteConfirm = $state(false);
    let activeTab = $state<"profile" | "insights">("profile");
    let insights = $state<any>(null);
    let editEmail = $state(false);
    let emailInput = $state("");
    let savingEmail = $state(false);

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

        const statsRes = await fetch(`/api/stats/${playerId}`);
        stats = await statsRes.json();

        const matchesRes = await fetch(`/api/players/${playerId}/matches`);
        matches = await matchesRes.json();

        loading = false;
    }

    async function loadInsights() {
        if (insights) return;
        const res = await fetch(`/api/insights/${playerId}`);
        insights = await res.json();
    }

    $effect(() => {
        if (activeTab === "insights") loadInsights();
    });

    async function handleSaveEmail() {
        savingEmail = true;
        const trimmed = emailInput.trim();
        if (trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            savingEmail = false;
            return;
        }
        const res = await fetch(`/api/players/${playerId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerEmail: trimmed || null }),
        });
        player = await res.json();
        editEmail = false;
        savingEmail = false;
    }

    function startEditEmail() {
        emailInput = player?.playerEmail || "";
        editEmail = true;
    }

    async function handleDelete() {
        await fetch(`/api/players/${playerId}`, { method: "DELETE" });
        goto("/players");
    }

    function getLevelLabel(avg: number): { label: string; color: string } {
        if (avg >= 100) return { label: "Elite", color: "text-amber-400" };
        if (avg >= 85) return { label: "Pro", color: "text-emerald-400" };
        if (avg >= 70) return { label: "County", color: "text-blue-400" };
        if (avg >= 50) return { label: "Club", color: "text-zinc-300" };
        return { label: "Beginner", color: "text-zinc-500" };
    }

    function getCheckoutLevel(pct: number): { label: string; color: string } {
        if (pct >= 40) return { label: "Pro", color: "text-emerald-400" };
        if (pct >= 30) return { label: "County", color: "text-blue-400" };
        if (pct >= 20) return { label: "Club", color: "text-zinc-300" };
        return { label: "Developing", color: "text-zinc-500" };
    }

    function getDartsPerLegLevel(dpl: number): {
        label: string;
        color: string;
    } {
        if (dpl > 0 && dpl <= 16)
            return { label: "Elite", color: "text-amber-400" };
        if (dpl > 0 && dpl <= 19)
            return { label: "Pro", color: "text-emerald-400" };
        if (dpl > 0 && dpl <= 22)
            return { label: "County", color: "text-blue-400" };
        if (dpl > 0 && dpl <= 27)
            return { label: "Club", color: "text-zinc-300" };
        return { label: "-", color: "text-zinc-500" };
    }

    const maxBracketCount = $derived(
        insights?.scoringDistribution
            ? Math.max(
                  ...insights.scoringDistribution.map((b: any) => b.count),
                  1,
              )
            : 1,
    );
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

        <!-- Player Email -->
        <div class="mt-4">
            {#if editEmail}
                <div class="flex items-center gap-2 max-w-sm">
                    <div class="relative flex-1">
                        <IconMail
                            size={14}
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                        />
                        <input
                            type="email"
                            bind:value={emailInput}
                            placeholder="player@email.com"
                            class="w-full bg-zinc-50 dark:bg-white/5 rounded-full pl-9 pr-3 py-2 text-sm ring-1 ring-black/6 dark:ring-white/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            onkeydown={(e) =>
                                e.key === "Enter" && handleSaveEmail()}
                        />
                    </div>
                    <button
                        onclick={handleSaveEmail}
                        disabled={savingEmail}
                        class="p-1.5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
                    >
                        <IconCheck size={14} />
                    </button>
                    <button
                        onclick={() => (editEmail = false)}
                        class="p-1.5 rounded-full bg-zinc-200 dark:bg-white/10 text-zinc-500 hover:bg-zinc-300 dark:hover:bg-white/15 transition-colors"
                    >
                        <IconX size={14} />
                    </button>
                </div>
                <p class="text-[10px] text-zinc-400 mt-1.5 pl-1">
                    Link this player to their email for cross-account sync in
                    the future.
                </p>
            {:else}
                <button
                    onclick={startEditEmail}
                    class="flex items-center gap-1.5 text-sm transition-colors cursor-pointer {player.playerEmail
                        ? 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                        : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'}"
                >
                    <IconMail size={14} />
                    {#if player.playerEmail}
                        <span class="font-mono">{player.playerEmail}</span>
                        <IconPencil size={10} class="opacity-40" />
                    {:else}
                        <span>Add player email</span>
                    {/if}
                </button>
            {/if}
        </div>

        <!-- Tabs -->
        <div
            class="flex gap-1 mt-6 p-1 bg-zinc-100 dark:bg-white/5 rounded-[8px] w-fit"
        >
            <button
                onclick={() => (activeTab = "profile")}
                class="px-4 py-2 text-sm font-medium rounded-[6px] transition-colors {activeTab ===
                'profile'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}"
            >
                Profile
            </button>
            <button
                onclick={() => (activeTab = "insights")}
                class="px-4 py-2 text-sm font-medium rounded-[6px] transition-colors flex items-center gap-1.5 {activeTab ===
                'insights'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}"
            >
                <IconChartBar size={14} />
                Insights
            </button>
        </div>

        {#if activeTab === "profile"}
            <!-- Stats Grid -->
            <div class="grid grid-cols-3 gap-3 mt-6">
                <DoubleBezel>
                    <div class="text-center">
                        <div class="text-3xl font-display font-bold">
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
                        <div class="text-3xl font-display font-bold">
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
                        <div class="text-3xl font-display font-bold">
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
                        <h2 class="font-display font-bold text-lg">
                            Sets & Legs
                        </h2>
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
                            <div class="text-xs text-zinc-400 mt-1">
                                Sets Won
                            </div>
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
                            <div class="text-xs text-zinc-400 mt-1">
                                Legs Won
                            </div>
                        </div>
                    </div>
                </DoubleBezel>
            </div>

            <!-- Match History -->
            <DoubleBezel class="mt-3">
                <div class="flex items-center gap-2 mb-4">
                    <IconHistory size={20} class="text-zinc-400" />
                    <h2 class="font-display font-bold text-lg">
                        Match History
                    </h2>
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
                                        <div
                                            class="text-xs text-zinc-400 mt-0.5"
                                        >
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
        {:else if activeTab === "insights"}
            {#if !insights}
                <div class="text-center text-zinc-400 py-24">
                    Loading insights...
                </div>
            {:else if !insights.summary}
                <div class="text-center text-zinc-400 py-24">
                    <p>No match data yet. Play a match to see your insights.</p>
                </div>
            {:else}
                {@const s = insights.summary}
                {@const avgLevel = getLevelLabel(s.threeDartAvg)}
                {@const coLevel = getCheckoutLevel(s.checkoutPct)}
                {@const dplLevel = getDartsPerLegLevel(s.avgDartsPerLeg)}

                <!-- Performance Overview -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                    <DoubleBezel>
                        <div class="text-center">
                            <div
                                class="text-xs text-zinc-400 uppercase tracking-wider mb-1"
                            >
                                3-Dart Avg
                            </div>
                            <div class="text-3xl font-display font-bold">
                                {s.threeDartAvg}
                            </div>
                            <div
                                class="text-xs {avgLevel.color} mt-1 font-medium"
                            >
                                {avgLevel.label}
                            </div>
                        </div>
                    </DoubleBezel>
                    <DoubleBezel>
                        <div class="text-center">
                            <div
                                class="text-xs text-zinc-400 uppercase tracking-wider mb-1"
                            >
                                First 9 Avg
                            </div>
                            <div class="text-3xl font-display font-bold">
                                {s.first9Avg}
                            </div>
                            <div class="text-xs text-zinc-400 mt-1">
                                scoring power
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
                                {s.checkoutPct}%
                            </div>
                            <div
                                class="text-xs {coLevel.color} mt-1 font-medium"
                            >
                                {coLevel.label}
                            </div>
                        </div>
                    </DoubleBezel>
                    <DoubleBezel>
                        <div class="text-center">
                            <div
                                class="text-xs text-zinc-400 uppercase tracking-wider mb-1"
                            >
                                Darts / Leg
                            </div>
                            <div class="text-3xl font-display font-bold">
                                {s.avgDartsPerLeg || "—"}
                            </div>
                            <div
                                class="text-xs {dplLevel.color} mt-1 font-medium"
                            >
                                {dplLevel.label}
                            </div>
                        </div>
                    </DoubleBezel>
                </div>

                <!-- Performance Diagnosis -->
                <DoubleBezel class="mt-3">
                    <div class="flex items-center gap-2 mb-4">
                        <IconTarget size={20} class="text-zinc-400" />
                        <h2 class="font-display font-bold text-lg">
                            Performance Diagnosis
                        </h2>
                    </div>
                    <div class="space-y-3">
                        {#if s.threeDartAvg > 0}
                            {@const first9Delta =
                                s.first9Avg -
                                (s.first9Avg > 0 ? s.threeDartAvg : 0)}
                            {#if s.first9Avg > s.threeDartAvg + 8}
                                <div
                                    class="p-3 rounded-[5px] bg-amber-500/10 border border-amber-500/20"
                                >
                                    <div
                                        class="text-sm font-medium text-amber-400"
                                    >
                                        Scoring is strong, finishing needs work
                                    </div>
                                    <div class="text-xs text-zinc-400 mt-1">
                                        Your first-9 average ({s.first9Avg}) is
                                        significantly higher than your overall
                                        average ({s.threeDartAvg}). Focus
                                        practice on checkout routines and
                                        doubles.
                                    </div>
                                </div>
                            {:else if s.checkoutPct < 20 && s.legsPlayed > 2}
                                <div
                                    class="p-3 rounded-[5px] bg-amber-500/10 border border-amber-500/20"
                                >
                                    <div
                                        class="text-sm font-medium text-amber-400"
                                    >
                                        Checkout conversion is low
                                    </div>
                                    <div class="text-xs text-zinc-400 mt-1">
                                        At {s.checkoutPct}% checkout rate,
                                        you're converting fewer than 1 in 5
                                        attempts. Practice doubles (D16, D20,
                                        D8) and 2-dart checkout routes (41–60
                                        range).
                                    </div>
                                </div>
                            {:else if s.threeDartAvg >= 70}
                                <div
                                    class="p-3 rounded-[5px] bg-emerald-500/10 border border-emerald-500/20"
                                >
                                    <div
                                        class="text-sm font-medium text-emerald-400"
                                    >
                                        Well-rounded performance
                                    </div>
                                    <div class="text-xs text-zinc-400 mt-1">
                                        Your scoring and finishing are balanced.
                                        Keep working on consistency — reducing
                                        low-scoring visits will push your
                                        average up.
                                    </div>
                                </div>
                            {:else}
                                <div
                                    class="p-3 rounded-[5px] bg-blue-500/10 border border-blue-500/20"
                                >
                                    <div
                                        class="text-sm font-medium text-blue-400"
                                    >
                                        Build your scoring foundation
                                    </div>
                                    <div class="text-xs text-zinc-400 mt-1">
                                        Focus on treble accuracy (especially
                                        T20) to raise your scoring average.
                                        Consistent scoring creates more checkout
                                        opportunities.
                                    </div>
                                </div>
                            {/if}
                        {:else}
                            <div class="text-sm text-zinc-400">
                                Play more matches to get personalized insights.
                            </div>
                        {/if}
                    </div>
                </DoubleBezel>

                <!-- Scoring Distribution -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
                    <DoubleBezel>
                        <div class="flex items-center gap-2 mb-4">
                            <IconChartBar size={20} class="text-zinc-400" />
                            <h2 class="font-display font-bold text-lg">
                                Scoring Distribution
                            </h2>
                        </div>
                        <div class="space-y-2">
                            {#each insights.scoringDistribution as bracket}
                                <div class="flex items-center gap-3">
                                    <div
                                        class="text-xs font-mono text-zinc-400 w-16 text-right"
                                    >
                                        {bracket.range}
                                    </div>
                                    <div
                                        class="flex-1 h-5 bg-zinc-100 dark:bg-white/5 rounded-[3px] overflow-hidden"
                                    >
                                        <div
                                            class="h-full rounded-[3px] transition-all {bracket.range ===
                                            '180'
                                                ? 'bg-amber-500'
                                                : bracket.range === '140-179'
                                                  ? 'bg-emerald-500'
                                                  : bracket.range === '100-139'
                                                    ? 'bg-blue-500'
                                                    : 'bg-zinc-400 dark:bg-zinc-500'}"
                                            style="width: {bracket.count > 0
                                                ? Math.max(
                                                      (bracket.count /
                                                          maxBracketCount) *
                                                          100,
                                                      2,
                                                  )
                                                : 0}%"
                                        ></div>
                                    </div>
                                    <div
                                        class="text-xs font-mono text-zinc-400 w-14 text-right"
                                    >
                                        {bracket.count}
                                        <span class="text-zinc-500"
                                            >({bracket.pct}%)</span
                                        >
                                    </div>
                                </div>
                            {/each}
                        </div>
                        {#if insights.scoringDistribution.length > 0}
                            {@const tonsPlus = insights.scoringDistribution
                                .filter((b: any) =>
                                    ["100-139", "140-179", "180"].includes(
                                        b.range,
                                    ),
                                )
                                .reduce(
                                    (acc: number, b: any) => acc + b.count,
                                    0,
                                )}
                            {@const totalVisits =
                                insights.scoringDistribution.reduce(
                                    (acc: number, b: any) => acc + b.count,
                                    0,
                                )}
                            {@const tonsPct =
                                totalVisits > 0
                                    ? ((tonsPlus / totalVisits) * 100).toFixed(
                                          1,
                                      )
                                    : "0"}
                            <div
                                class="mt-3 pt-3 border-t border-zinc-200 dark:border-white/10 text-center"
                            >
                                <span class="text-xs text-zinc-400"
                                    >Ton+ rate:
                                </span>
                                <span
                                    class="text-sm font-bold {Number(tonsPct) >=
                                    40
                                        ? 'text-emerald-400'
                                        : Number(tonsPct) >= 25
                                          ? 'text-blue-400'
                                          : 'text-zinc-400'}">{tonsPct}%</span
                                >
                                <span class="text-xs text-zinc-500">
                                    of visits score 100+</span
                                >
                            </div>
                        {/if}
                    </DoubleBezel>

                    <!-- Checkout by Range -->
                    <DoubleBezel>
                        <div class="flex items-center gap-2 mb-4">
                            <IconTarget size={20} class="text-zinc-400" />
                            <h2 class="font-display font-bold text-lg">
                                Checkout by Range
                            </h2>
                        </div>
                        {#if insights.checkoutRanges.some((r: any) => r.attempts > 0)}
                            <div class="space-y-2">
                                {#each insights.checkoutRanges as range}
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="text-xs font-mono text-zinc-400 w-16 text-right"
                                        >
                                            {range.range}
                                        </div>
                                        <div
                                            class="flex-1 h-5 bg-zinc-100 dark:bg-white/5 rounded-[3px] overflow-hidden relative"
                                        >
                                            {#if range.attempts > 0}
                                                <div
                                                    class="h-full rounded-[3px] bg-emerald-500/60"
                                                    style="width: {range.pct}%"
                                                ></div>
                                            {/if}
                                        </div>
                                        <div
                                            class="text-xs font-mono w-20 text-right"
                                        >
                                            {#if range.attempts > 0}
                                                <span class="text-zinc-300"
                                                    >{range.successes}/{range.attempts}</span
                                                >
                                                <span class="text-zinc-500 ml-1"
                                                    >{range.pct}%</span
                                                >
                                            {:else}
                                                <span class="text-zinc-600"
                                                    >—</span
                                                >
                                            {/if}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <div class="text-sm text-zinc-500 text-center py-4">
                                No checkout data yet
                            </div>
                        {/if}
                    </DoubleBezel>
                </div>

                <!-- Key Metrics -->
                <DoubleBezel class="mt-3">
                    <div class="flex items-center gap-2 mb-4">
                        <IconTrophy size={20} class="text-zinc-400" />
                        <h2 class="font-display font-bold text-lg">
                            Key Metrics
                        </h2>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="text-center">
                            <div
                                class="text-2xl font-display font-bold text-amber-500"
                            >
                                {s.total180s}
                            </div>
                            <div class="text-xs text-zinc-400 mt-1">180s</div>
                        </div>
                        <div class="text-center">
                            <div
                                class="text-2xl font-display font-bold text-emerald-500"
                            >
                                {s.total140s}
                            </div>
                            <div class="text-xs text-zinc-400 mt-1">140+</div>
                        </div>
                        <div class="text-center">
                            <div
                                class="text-2xl font-display font-bold text-blue-500"
                            >
                                {s.total100s}
                            </div>
                            <div class="text-xs text-zinc-400 mt-1">100+</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-display font-bold">
                                {s.highestFinish}
                            </div>
                            <div class="text-xs text-zinc-400 mt-1">
                                Highest Finish
                            </div>
                        </div>
                    </div>
                </DoubleBezel>

                <!-- Match Trend -->
                {#if insights.perMatch.length > 0}
                    <DoubleBezel class="mt-3">
                        <div class="flex items-center gap-2 mb-4">
                            <IconHistory size={20} class="text-zinc-400" />
                            <h2 class="font-display font-bold text-lg">
                                Match Trend
                            </h2>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead>
                                    <tr
                                        class="text-xs text-zinc-400 border-b border-zinc-200 dark:border-white/10"
                                    >
                                        <th class="text-left pb-2 pr-4">Date</th
                                        >
                                        <th class="text-center pb-2 px-2"
                                            >Result</th
                                        >
                                        <th class="text-center pb-2 px-2"
                                            >Avg</th
                                        >
                                        <th class="text-center pb-2 px-2"
                                            >CO %</th
                                        >
                                        <th class="text-center pb-2 px-2"
                                            >Legs</th
                                        >
                                        <th class="text-center pb-2 pl-2"
                                            >Darts</th
                                        >
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each insights.perMatch as m}
                                        <tr
                                            class="border-b border-zinc-100 dark:border-white/5"
                                        >
                                            <td
                                                class="py-2 pr-4 text-zinc-400 text-xs"
                                            >
                                                {new Date(
                                                    m.date,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td class="py-2 px-2 text-center">
                                                {#if m.status === "in_progress"}
                                                    <span
                                                        class="inline-flex items-center gap-1 text-blue-400"
                                                    >
                                                        <IconPlayerPlay
                                                            size={10}
                                                        />
                                                        Live
                                                    </span>
                                                {:else if m.won}
                                                    <span
                                                        class="text-emerald-400 font-medium"
                                                        >W</span
                                                    >
                                                {:else}
                                                    <span class="text-zinc-500"
                                                        >L</span
                                                    >
                                                {/if}
                                            </td>
                                            <td
                                                class="py-2 px-2 text-center font-mono"
                                            >
                                                <span
                                                    class={m.threeDartAvg >= 90
                                                        ? "text-emerald-400"
                                                        : m.threeDartAvg >= 70
                                                          ? "text-zinc-300"
                                                          : "text-zinc-500"}
                                                >
                                                    {m.threeDartAvg}
                                                </span>
                                            </td>
                                            <td
                                                class="py-2 px-2 text-center font-mono text-zinc-400"
                                            >
                                                {m.checkoutPct}%
                                            </td>
                                            <td
                                                class="py-2 px-2 text-center font-mono text-zinc-400"
                                            >
                                                {m.legsWon}/{m.legsPlayed}
                                            </td>
                                            <td
                                                class="py-2 pl-2 text-center font-mono text-zinc-500 text-xs"
                                            >
                                                {m.dartsThrown}
                                            </td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    </DoubleBezel>
                {/if}
            {/if}
        {/if}
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
