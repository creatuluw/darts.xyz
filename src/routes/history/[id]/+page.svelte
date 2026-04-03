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
    let legTurns = $state<Record<string, any[]>>({});
    let loading = $state(true);
    let showDeleteConfirm = $state(false);
    let deleting = $state(false);
    let showDebug = $state(false);

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

        // Fetch turns for each leg
        if (matchData?.legs) {
            for (const leg of matchData.legs) {
                try {
                    const tRes = await fetch(
                        `/api/matches/${matchId}/turns?legId=${leg.id}`,
                    );
                    const tData = await tRes.json();
                    legTurns[leg.id] = tData;
                } catch {
                    legTurns[leg.id] = [];
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

    function getCurrentSetInfo() {
        if (!matchData?.legs) return null;
        const legs = matchData.legs;
        // Find the highest set number
        const maxSet = Math.max(...legs.map((l: any) => l.setNumber));
        // Find legs in the current (highest) set
        const currentSetLegs = legs.filter((l: any) => l.setNumber === maxSet);
        // Find incomplete leg in current set
        const incompleteLeg = currentSetLegs.find((l: any) => !l.winnerId);
        // Count completed legs per player in current set
        const player1Legs = currentSetLegs.filter(
            (l: any) =>
                l.winnerId &&
                l.winnerId === matchData.matchPlayers?.[0]?.playerId,
        ).length;
        const player2Legs = currentSetLegs.filter(
            (l: any) =>
                l.winnerId &&
                l.winnerId === matchData.matchPlayers?.[1]?.playerId,
        ).length;
        return {
            currentSet: maxSet,
            currentLeg: incompleteLeg?.legNumber || currentSetLegs.length + 1,
            player1LegsInSet: player1Legs,
            player2LegsInSet: player2Legs,
            incompleteLegId: incompleteLeg?.id,
        };
    }

    function formatDart(segment: number, multiplier: number): string {
        if (segment === 0) return "";
        if (segment === 25 && multiplier === 2) return "Bull";
        const prefix = multiplier === 3 ? "T" : multiplier === 2 ? "D" : "";
        return `${prefix}${segment}`;
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

            <!-- Match State Summary -->
            <EyebrowTag class="mb-3 mt-8">Match State Summary</EyebrowTag>
            <DoubleBezel>
                <div class="space-y-4">
                    <!-- Current Set/Leg Info -->
                    {#if matchData.legs && matchData.legs.length > 0}
                        {@const setInfo = getCurrentSetInfo()}
                        <div
                            class="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-700"
                        >
                            <div>
                                <div
                                    class="text-xs text-zinc-400 uppercase tracking-wider"
                                >
                                    Current Set
                                </div>
                                <div
                                    class="text-2xl font-bold text-zinc-900 dark:text-white"
                                >
                                    {setInfo?.currentSet || 1}
                                </div>
                            </div>
                            <div>
                                <div
                                    class="text-xs text-zinc-400 uppercase tracking-wider"
                                >
                                    Current Leg
                                </div>
                                <div
                                    class="text-2xl font-bold text-zinc-900 dark:text-white"
                                >
                                    {setInfo?.currentLeg || 1}
                                </div>
                            </div>
                            <div>
                                <div
                                    class="text-xs text-zinc-400 uppercase tracking-wider"
                                >
                                    Legs in Set
                                </div>
                                <div
                                    class="text-lg font-mono text-zinc-700 dark:text-zinc-300"
                                >
                                    {setInfo?.player1LegsInSet || 0} - {setInfo?.player2LegsInSet ||
                                        0}
                                </div>
                            </div>
                            <div>
                                <div
                                    class="text-xs text-zinc-400 uppercase tracking-wider"
                                >
                                    Status
                                </div>
                                <div
                                    class="text-sm font-medium {matchData.match
                                        .status === 'in_progress'
                                        ? 'text-emerald-500'
                                        : 'text-zinc-500'}"
                                >
                                    {matchData.match.status === "in_progress"
                                        ? "In Progress"
                                        : matchData.match.status}
                                </div>
                            </div>
                        </div>
                    {/if}

                    <!-- Player Scores (Cumulative) -->
                    <div
                        class="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-700"
                    >
                        {#each matchData.matchPlayers || [] as mp, i}
                            <div
                                class="p-3 bg-zinc-50 dark:bg-white/5 rounded-lg"
                            >
                                <div class="text-sm font-medium mb-2">
                                    {getPlayerName(mp.playerId)}
                                </div>
                                <div class="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span class="text-zinc-400">Sets:</span>
                                        <span class="ml-1 font-mono font-bold"
                                            >{mp.setsWon || 0}</span
                                        >
                                    </div>
                                    <div>
                                        <span class="text-zinc-400"
                                            >Legs (total):</span
                                        >
                                        <span class="ml-1 font-mono font-bold"
                                            >{mp.legsWon || 0}</span
                                        >
                                    </div>
                                    <div>
                                        <span class="text-zinc-400"
                                            >Throw Order:</span
                                        >
                                        <span class="ml-1 font-mono"
                                            >{mp.throwOrder}</span
                                        >
                                    </div>
                                    {#if matchData.match.winnerId === mp.playerId}
                                        <div
                                            class="col-span-2 text-amber-500 font-medium"
                                        >
                                            ★ Winner
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>

                    <!-- All Legs Breakdown -->
                    <div
                        class="pb-4 border-b border-zinc-200 dark:border-zinc-700"
                    >
                        <div
                            class="text-xs text-zinc-400 uppercase tracking-wider mb-2"
                        >
                            All Legs
                        </div>
                        <div class="space-y-1 max-h-48 overflow-y-auto">
                            {#each matchData.legs || [] as leg}
                                <div
                                    class="flex items-center justify-between text-sm py-1 px-2 bg-zinc-50 dark:bg-white/5 rounded"
                                >
                                    <span class="font-mono text-xs">
                                        Set {leg.setNumber} · Leg {leg.legNumber}
                                    </span>
                                    <span
                                        class="text-xs {leg.winnerId
                                            ? 'text-emerald-500'
                                            : 'text-zinc-400'}"
                                    >
                                        {leg.winnerId
                                            ? getPlayerName(leg.winnerId) +
                                              " won"
                                            : "In progress"}
                                    </span>
                                </div>
                            {/each}
                        </div>
                    </div>

                    <!-- Raw Match Data -->
                    <div>
                        <button
                            onclick={() => (showDebug = !showDebug)}
                            class="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 flex items-center gap-1"
                        >
                            {showDebug ? "Hide" : "Show"} Raw Match Data
                            <span
                                class="transform transition-transform {showDebug
                                    ? 'rotate-180'
                                    : ''}">▼</span
                            >
                        </button>
                        {#if showDebug}
                            <pre
                                class="mt-2 text-xs bg-zinc-900 text-zinc-100 p-3 rounded overflow-x-auto max-h-96 overflow-y-auto">
{JSON.stringify(
                                    {
                                        match: matchData.match,
                                        matchPlayers:
                                            matchData.matchPlayers?.map(
                                                (mp: any) => ({
                                                    ...mp,
                                                    playerName: getPlayerName(
                                                        mp.playerId,
                                                    ),
                                                }),
                                            ),
                                        legs: matchData.legs?.map((l: any) => ({
                                            ...l,
                                            winnerName: l.winnerId
                                                ? getPlayerName(l.winnerId)
                                                : null,
                                        })),
                                        totalLegs: matchData.legs?.length || 0,
                                        completedLegs:
                                            matchData.legs?.filter(
                                                (l: any) => l.winnerId,
                                            ).length || 0,
                                    },
                                    null,
                                    2,
                                )}
                            </pre>
                        {/if}
                    </div>
                </div>
            </DoubleBezel>

            <!-- Match Details -->
            <EyebrowTag class="mb-3 mt-8">Match Details</EyebrowTag>
            <div class="space-y-4">
                {#each matchData.legs as leg}
                    <DoubleBezel>
                        <div class="space-y-3">
                            <div
                                class="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 pb-2"
                            >
                                <span class="font-semibold"
                                    >Set {leg.setNumber} · Leg {leg.legNumber}</span
                                >
                                {#if leg.winnerId}
                                    <span
                                        class="text-emerald-600 dark:text-emerald-400 text-sm font-medium"
                                        >Winner: {getPlayerName(
                                            leg.winnerId,
                                        )}</span
                                    >
                                {:else}
                                    <span class="text-zinc-400 text-sm"
                                        >In progress</span
                                    >
                                {/if}
                            </div>

                            <!-- Turns for this leg -->
                            {#if legTurns[leg.id] && legTurns[leg.id].length > 0}
                                <div class="space-y-1">
                                    <div
                                        class="grid grid-cols-6 gap-2 text-xs text-zinc-400 font-medium pb-1"
                                    >
                                        <span class="col-span-1">Player</span>
                                        <span class="col-span-3 text-center"
                                            >Darts</span
                                        >
                                        <span class="col-span-1 text-center"
                                            >Total</span
                                        >
                                        <span class="col-span-1 text-right"
                                            >Remaining</span
                                        >
                                    </div>
                                    {#each legTurns[leg.id] as turn}
                                        <div
                                            class="grid grid-cols-6 gap-2 text-sm py-1.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                                        >
                                            <span
                                                class="col-span-1 font-medium truncate"
                                                title={getPlayerName(
                                                    turn.playerId,
                                                )}
                                            >
                                                {getPlayerName(turn.playerId)}
                                            </span>
                                            <span
                                                class="col-span-3 text-center font-mono text-xs"
                                            >
                                                {#if turn.dart1Segment > 0}
                                                    {formatDart(
                                                        turn.dart1Segment,
                                                        turn.dart1Multiplier,
                                                    )}
                                                {/if}
                                                {#if turn.dart2Segment > 0}
                                                    {" "}
                                                    {formatDart(
                                                        turn.dart2Segment,
                                                        turn.dart2Multiplier,
                                                    )}
                                                {/if}
                                                {#if turn.dart3Segment > 0}
                                                    {" "}
                                                    {formatDart(
                                                        turn.dart3Segment,
                                                        turn.dart3Multiplier,
                                                    )}
                                                {/if}
                                                {#if turn.dartsThrown === 0 || (turn.dart1Segment === 0 && turn.dart2Segment === 0 && turn.dart3Segment === 0)}
                                                    <span class="text-zinc-500"
                                                        >MISS</span
                                                    >
                                                {/if}
                                                {#if turn.isBust}
                                                    <span
                                                        class="text-red-500 ml-1"
                                                        >(BUST)</span
                                                    >
                                                {/if}
                                            </span>
                                            <span
                                                class="col-span-1 text-center font-mono"
                                                >{turn.totalScore}</span
                                            >
                                            <span
                                                class="col-span-1 text-right font-mono"
                                                >{turn.remainingScore}</span
                                            >
                                        </div>
                                    {/each}
                                </div>
                            {:else}
                                <div
                                    class="text-zinc-400 text-sm text-center py-2"
                                >
                                    No turns recorded
                                </div>
                            {/if}
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
