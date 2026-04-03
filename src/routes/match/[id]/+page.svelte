<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import {
        IconTrophy,
        IconArrowBack,
        IconArrowRight,
        IconPlayerPlay,
        IconArrowUp,
        IconArrowDown,
    } from "@tabler/icons-svelte";
    import {
        DoubleBezel,
        PillButton,
        EyebrowTag,
        AnimatedNumber,
        StatBadge,
    } from "$lib/components/ui";
    import {
        createMatchState,
        submitTurn,
        abandonMatch,
        getScoreDisplay,
    } from "$lib/game";
    import {
        getCheckoutSuggestions,
        canCheckout,
    } from "$lib/game/checkout-suggestions";
    import type {
        MatchState,
        DartData,
        Multiplier,
        TurnRecord,
    } from "$lib/game";

    let matchId = $derived($page.params.id as string);
    let matchState = $state<MatchState | null>(null);
    let matchData = $state<any>(null);
    let playerStats = $state<Record<string, any>>({});
    let loading = $state(true);

    // Dart input state
    let currentDarts = $state<DartData[]>([]);
    let showCheckout = $state(false);

    // Current player info
    let currentPlayer = $derived(
        matchState?.players[matchState.currentLeg.currentPlayerIndex],
    );
    let currentPlayerRemaining = $derived(currentPlayer?.remainingScore ?? 0);
    let turnTotal = $derived(currentDarts.reduce((sum, d) => sum + d.score, 0));
    let checkoutOptions = $derived(
        canCheckout(currentPlayerRemaining, 3 - currentDarts.length)
            ? getCheckoutSuggestions(
                  currentPlayerRemaining,
                  (3 - currentDarts.length) as 1 | 2 | 3,
              )
            : [],
    );

    // === Dartboard segment color map (red/green alternating on standard board) ===
    const segmentColors: Record<number, "red" | "green"> = {
        20: "red",
        1: "green",
        18: "red",
        4: "green",
        13: "red",
        6: "green",
        10: "red",
        15: "green",
        2: "red",
        17: "green",
        3: "red",
        19: "green",
        7: "red",
        16: "green",
        8: "red",
        11: "green",
        14: "red",
        9: "green",
        12: "red",
        5: "green",
        25: "green",
    };

    function getSegmentRingClass(
        segment: number,
        multiplier: Multiplier,
    ): string {
        // Bullseye (D25) is red on the board
        if (segment === 25 && multiplier === 2) {
            return "ring-red-400 dark:ring-red-500/40";
        }
        const color = segmentColors[segment] ?? "green";
        if (color === "red") {
            return "ring-red-400 dark:ring-red-500/40";
        }
        return "ring-green-400 dark:ring-green-500/40";
    }

    // Segments grouped by dartboard proximity (clockwise order, 4 quadrants of 5)
    const segmentGroups = [
        [20, 1, 18, 4, 13],
        [6, 10, 15, 2, 17],
        [3, 19, 7, 16, 8],
        [11, 14, 9, 12, 5],
    ];

    // === Match Stats Helpers ===
    function getPlayerTurns(playerId: string): TurnRecord[] {
        if (!matchState) return [];
        return matchState.currentLeg.turns.filter(
            (t) => t.playerId === playerId,
        );
    }

    function getDartsThrown(playerId: string): number {
        return getPlayerTurns(playerId).reduce(
            (sum, t) => sum + t.dartsThrown,
            0,
        );
    }

    function computeAvgFromTurns(turns: TurnRecord[]): number {
        if (turns.length === 0) return 0;
        let totalScore = 0;
        let totalDarts = 0;
        for (const turn of turns) {
            totalScore += turn.totalScore;
            totalDarts += turn.dartsThrown;
        }
        return totalDarts > 0 ? (totalScore / totalDarts) * 3 : 0;
    }

    function computeMatchStats(turns: TurnRecord[]) {
        const empty = {
            threeDartAvg: 0,
            checkoutPct: 0,
            countUnder20: 0,
            count60Plus: 0,
            count100Plus: 0,
            count140Plus: 0,
            count180: 0,
            count60PlusFinishes: 0,
            last3Avg: 0,
            prior15Avg: 0,
        };
        if (turns.length === 0) return empty;

        let totalScore = 0;
        let totalDarts = 0;
        let countUnder20 = 0;
        let count60Plus = 0;
        let count100Plus = 0;
        let count140Plus = 0;
        let count180 = 0;
        let checkoutAttempts = 0;
        let checkoutSuccesses = 0;
        let count60PlusFinishes = 0;

        for (const turn of turns) {
            totalScore += turn.totalScore;
            totalDarts += turn.dartsThrown;
            if (turn.totalScore < 20 && !turn.isBust) countUnder20++;
            if (turn.totalScore >= 60 && !turn.isBust) count60Plus++;
            if (turn.totalScore >= 100 && !turn.isBust) count100Plus++;
            if (turn.totalScore >= 140 && !turn.isBust) count140Plus++;
            if (turn.totalScore === 180) count180++;
            if (turn.remainingScore === 0 && !turn.isBust) {
                checkoutSuccesses++;
                checkoutAttempts++;
                if (turn.totalScore >= 60) count60PlusFinishes++;
            } else if (turn.isBust && turn.remainingScore <= 170) {
                checkoutAttempts++;
            }
        }

        const threeDartAvg = totalDarts > 0 ? (totalScore / totalDarts) * 3 : 0;
        const checkoutPct =
            checkoutAttempts > 0
                ? (checkoutSuccesses / checkoutAttempts) * 100
                : 0;

        // Last 3 vs prior turns (up to 15 before the last 3)
        const last3 = turns.slice(-3);
        const prior = turns.slice(0, -3).slice(-15);

        return {
            threeDartAvg,
            checkoutPct,
            countUnder20,
            count60Plus,
            count100Plus,
            count140Plus,
            count180,
            count60PlusFinishes,
            last3Avg: computeAvgFromTurns(last3),
            prior15Avg: computeAvgFromTurns(prior),
        };
    }

    function formatDart(dart: DartData | undefined): string {
        if (!dart) return "—";
        if (dart.segment === 0) return "MISS";
        const prefix =
            dart.multiplier === 3 ? "T" : dart.multiplier === 2 ? "D" : "";
        if (dart.segment === 25 && dart.multiplier === 2) return "Bull";
        return `${prefix}${dart.segment}`;
    }

    onMount(async () => {
        const res = await fetch(`/api/matches/${matchId}`);
        const data = await res.json();
        matchData = data;

        if (data.match.status !== "in_progress") {
            goto(`/history/${matchId}`);
            return;
        }

        // Fetch player details
        const playerDetails = await Promise.all(
            data.matchPlayers.map(async (mp: any) => {
                const res = await fetch(`/api/players/${mp.playerId}`);
                return res.json();
            }),
        );

        const playerData = data.matchPlayers.map((mp: any, i: number) => ({
            id: mp.playerId,
            name: playerDetails[i].name,
        }));

        matchState = createMatchState(
            matchId,
            {
                startingScore: Number(data.match.startingScore) as
                    | 301
                    | 501
                    | 701
                    | 1001,
                legsPerSet: Number(data.match.legsPerSet) as 1 | 3 | 5 | 7,
                setsPerMatch: Number(data.match.setsPerMatch) as 1 | 3 | 5 | 7,
                doubleIn: Boolean(data.match.doubleIn),
            },
            playerData,
        );

        // Load stats for each player
        for (const p of playerData) {
            const statsRes = await fetch(`/api/stats/${p.id}`);
            playerStats[p.id] = await statsRes.json();
        }

        loading = false;
    });

    function addDart(segment: number, multiplier: Multiplier) {
        if (currentDarts.length >= 3) return;
        const score = segment === 0 ? 0 : segment * multiplier;
        currentDarts = [...currentDarts, { segment, multiplier, score }];
    }

    function removeLastDart() {
        currentDarts = currentDarts.slice(0, -1);
    }

    async function submitCurrentTurn() {
        if (!matchState || currentDarts.length === 0) return;

        matchState = submitTurn(matchState, currentDarts);

        const leg = matchState.currentLeg;
        const lastTurn = leg.turns[leg.turns.length - 1];

        if (lastTurn) {
            // Get the current leg ID from API
            const legsRes = await fetch(`/api/matches/${matchId}/legs`);
            const legs = await legsRes.json();
            const currentLegData = legs.find(
                (l: any) =>
                    l.setNumber === leg.setNumber &&
                    l.legNumber === leg.legNumber,
            );

            if (currentLegData) {
                await fetch("/api/matches/" + matchId + "/turns", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        legId: currentLegData.id,
                        playerId: lastTurn.playerId,
                        turnNumber: lastTurn.turnNumber,
                        dart1Score: lastTurn.darts[0]?.score ?? 0,
                        dart1Multiplier: lastTurn.darts[0]?.multiplier ?? 0,
                        dart1Segment: lastTurn.darts[0]?.segment ?? 0,
                        dart2Score: lastTurn.darts[1]?.score ?? 0,
                        dart2Multiplier: lastTurn.darts[1]?.multiplier ?? 0,
                        dart2Segment: lastTurn.darts[1]?.segment ?? 0,
                        dart3Score: lastTurn.darts[2]?.score ?? 0,
                        dart3Multiplier: lastTurn.darts[2]?.multiplier ?? 0,
                        dart3Segment: lastTurn.darts[2]?.segment ?? 0,
                        totalScore: lastTurn.totalScore,
                        remainingScore: lastTurn.remainingScore,
                        isBust: lastTurn.isBust,
                        dartsThrown: lastTurn.dartsThrown,
                    }),
                });
            }

            // Handle leg completion — create next leg
            if (leg.isComplete && matchState.status === "in_progress") {
                await fetch(`/api/matches/${matchId}/legs`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        setNumber: matchState.currentLeg.setNumber,
                        legNumber: matchState.currentLeg.legNumber,
                        firstThrowerId:
                            matchState.currentLeg.firstThrowerIndex.toString(),
                    }),
                });
            }

            // Handle match completion
            if (matchState.status === "completed") {
                await fetch(`/api/matches/${matchId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        status: "completed",
                        winnerId: matchState.winnerId,
                    }),
                });
                setTimeout(() => goto(`/history/${matchId}`), 2000);
            }
        }

        currentDarts = [];
    }

    async function handleAbandon() {
        if (!matchState) return;
        matchState = abandonMatch(matchState);
        await fetch(`/api/matches/${matchId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "abandoned" }),
        });
        goto("/");
    }
</script>

<svelte:head>
    <title>Match — Darts 501</title>
</svelte:head>

{#if loading}
    <div class="text-center text-zinc-400 py-24">Loading match...</div>
{:else if matchState}
    <div class="py-4">
        <!-- Match completed overlay -->
        {#if matchState.status === "completed"}
            <div
                class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center"
            >
                <div class="text-center">
                    <div class="flex justify-center mb-4 text-amber-400">
                        <IconTrophy size={64} />
                    </div>
                    <h2
                        class="font-display font-black text-5xl text-white mb-2"
                    >
                        {matchState?.players.find(
                            (p) => p.id === matchState?.winnerId,
                        )?.name}
                        wins!
                    </h2>
                    <p class="text-zinc-400 mb-6">Match complete</p>
                    <a href="/history/{matchId}">
                        <PillButton>View Match Details</PillButton>
                    </a>
                </div>
            </div>
        {/if}

        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
            <div>
                <EyebrowTag
                    >Set {matchState.currentLeg.setNumber} · Leg
                    {matchState.currentLeg.legNumber}</EyebrowTag
                >
            </div>
            <button
                onclick={handleAbandon}
                class="text-xs text-zinc-400 hover:text-red-500 transition-colors"
            >
                Abandon
            </button>
        </div>

        <!-- 3-Column Bento Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <!-- ============================================ -->
            <!-- LEFT: Player 1 Scoreboard + Stats            -->
            <!-- ============================================ -->
            {#if matchState.players[0]}
                {@const p1 = matchState.players[0]}
                {@const p1Active =
                    matchState.currentLeg.currentPlayerIndex === 0}
                {@const p1Turns = getPlayerTurns(p1.id)}
                {@const p1Stats = computeMatchStats(p1Turns)}
                {@const p1Darts = getDartsThrown(p1.id)}
                {@const p1LifetimeAvg = playerStats[p1.id]?.threeDartAvg
                    ? Number(playerStats[p1.id].threeDartAvg).toFixed(1)
                    : "—"}
                <div class="lg:col-span-3 order-1 lg:order-none space-y-3">
                    <!-- Player 1 Scoreboard -->
                    <DoubleBezel>
                        <div class="text-center">
                            <div
                                class="font-display font-black text-5xl tracking-tight leading-none {p1Active
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : ''}"
                            >
                                <AnimatedNumber value={p1.remainingScore} />
                            </div>
                            <div
                                class="mt-2 font-medium text-sm {p1Active
                                    ? 'text-emerald-700 dark:text-emerald-400'
                                    : ''}"
                            >
                                {#if p1Active}
                                    <IconPlayerPlay
                                        size={14}
                                        class="inline -mt-0.5 text-emerald-500 mr-0.5"
                                    />
                                {/if}
                                {p1.name}
                            </div>
                            <div
                                class="mt-2 flex justify-center gap-4 text-xs font-mono text-zinc-400"
                            >
                                <span
                                    >Sets
                                    <span
                                        class="font-bold text-sm text-zinc-700 dark:text-zinc-300"
                                        >{p1.setsWon}</span
                                    ></span
                                >
                                <span
                                    >Legs
                                    <span
                                        class="font-bold text-sm text-zinc-700 dark:text-zinc-300"
                                        >{p1.legsWon}</span
                                    ></span
                                >
                            </div>
                            <div
                                class="mt-1.5 flex justify-center gap-3 text-[10px] text-zinc-400"
                            >
                                <span
                                    >Darts
                                    <span class="font-mono font-medium"
                                        >{p1Darts}</span
                                    ></span
                                >
                                <span
                                    >Avg
                                    <span class="font-mono font-medium"
                                        >{p1LifetimeAvg}</span
                                    ></span
                                >
                            </div>
                        </div>
                    </DoubleBezel>

                    <!-- Player 1 Stats -->
                    <DoubleBezel>
                        <EyebrowTag class="mb-2">Stats</EyebrowTag>
                        <div class="space-y-1.5 mt-2">
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-zinc-400"
                                    >3-Dart Avg</span
                                >
                                <span class="text-sm font-mono font-medium"
                                    >{p1Stats.threeDartAvg.toFixed(1)}</span
                                >
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-zinc-400"
                                    >Checkout %</span
                                >
                                <span class="text-sm font-mono font-medium"
                                    >{p1Stats.checkoutPct.toFixed(0)}%</span
                                >
                            </div>

                            <div
                                class="pt-2 mt-1 border-t border-zinc-100 dark:border-white/5"
                            >
                                <div class="grid grid-cols-3 gap-1 text-center">
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            60+
                                        </div>
                                        <div
                                            class="font-mono font-medium text-sm"
                                        >
                                            {p1Stats.count60Plus}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            100+
                                        </div>
                                        <div
                                            class="font-mono font-medium text-sm"
                                        >
                                            {p1Stats.count100Plus}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            140+
                                        </div>
                                        <div
                                            class="font-mono font-medium text-sm"
                                        >
                                            {p1Stats.count140Plus}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="pt-2 mt-1 border-t border-zinc-100 dark:border-white/5"
                            >
                                <div class="grid grid-cols-3 gap-1 text-center">
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            &lt;20
                                        </div>
                                        <div
                                            class="font-mono font-medium text-sm text-zinc-500"
                                        >
                                            {p1Stats.countUnder20}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            180
                                        </div>
                                        <div
                                            class="font-mono font-bold text-sm text-amber-600 dark:text-amber-400"
                                        >
                                            {p1Stats.count180}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            60+ Fin
                                        </div>
                                        <div
                                            class="font-mono font-medium text-sm text-emerald-600 dark:text-emerald-400"
                                        >
                                            {p1Stats.count60PlusFinishes}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Avg Trend: Last 3 vs Prior -->
                            <div
                                class="pt-2 mt-1 border-t border-zinc-100 dark:border-white/5"
                            >
                                <div
                                    class="text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5"
                                >
                                    Avg Trend
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-xs text-zinc-500"
                                        >Last 3</span
                                    >
                                    <div class="flex items-center gap-1">
                                        <span
                                            class="text-sm font-mono font-medium"
                                            >{p1Stats.last3Avg.toFixed(1)}</span
                                        >
                                        {#if p1Stats.prior15Avg > 0}
                                            {#if p1Stats.last3Avg > p1Stats.prior15Avg}
                                                <IconArrowUp
                                                    size={14}
                                                    class="text-emerald-500"
                                                />
                                            {:else if p1Stats.last3Avg < p1Stats.prior15Avg}
                                                <IconArrowDown
                                                    size={14}
                                                    class="text-red-500"
                                                />
                                            {/if}
                                        {/if}
                                    </div>
                                </div>
                                <div
                                    class="flex justify-between items-center mt-0.5"
                                >
                                    <span class="text-xs text-zinc-500"
                                        >Prior turns</span
                                    >
                                    <span
                                        class="text-sm font-mono text-zinc-400"
                                        >{p1Stats.prior15Avg > 0
                                            ? p1Stats.prior15Avg.toFixed(1)
                                            : "—"}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </DoubleBezel>
                </div>
            {/if}

            <!-- ============================================ -->
            <!-- CENTER: Score Display + Input + Turn History  -->
            <!-- ============================================ -->
            <div class="lg:col-span-6 order-3 lg:order-none space-y-3">
                <!-- Score Display -->
                <DoubleBezel>
                    <div class="text-center">
                        <div
                            class="text-xs text-zinc-400 uppercase tracking-wider mb-1"
                        >
                            {currentPlayer?.name}'s turn
                        </div>
                        <div
                            class="font-display font-black text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none"
                        >
                            <AnimatedNumber value={currentPlayerRemaining} />
                        </div>
                        <div
                            class="mt-2 text-sm text-zinc-500 inline-flex items-center gap-1 justify-center {currentDarts.length >
                            0
                                ? ''
                                : 'invisible'}"
                        >
                            Turn: {turnTotal}
                            <IconArrowRight size={14} />
                            {currentPlayerRemaining - turnTotal}
                        </div>
                    </div>
                </DoubleBezel>

                <!-- Combined Score Input Panel -->
                <DoubleBezel>
                    <div class="space-y-3">
                        <!-- Multiplier Selector -->
                        <div class="flex gap-1.5 justify-center">
                            {#each [{ label: "S", value: 1 }, { label: "D", value: 2 }, { label: "T", value: 3 }, { label: "Miss", value: 0 }] as opt}
                                <button
                                    onclick={() =>
                                        (selectedMultiplier =
                                            opt.value as Multiplier)}
                                    class="rounded-[5px] px-3.5 py-1.5 text-xs font-bold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] {selectedMultiplier ===
                                    opt.value
                                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                        : 'bg-zinc-100 dark:bg-white/10 text-zinc-500 dark:text-zinc-400 ring-2 ring-black/[0.06] dark:ring-white/10'}"
                                >
                                    {opt.label}
                                </button>
                            {/each}
                        </div>

                        <!-- Segment Buttons — grouped by dartboard proximity -->
                        {#if selectedMultiplier !== 0}
                            <div class="space-y-1.5">
                                {#each segmentGroups as group}
                                    <div class="grid grid-cols-5 gap-1">
                                        {#each group as seg}
                                            <button
                                                onclick={() => addDart(seg)}
                                                disabled={currentDarts.length >=
                                                    3}
                                                class="rounded-[5px] py-1.5 text-[11px] font-bold bg-zinc-100 dark:bg-white/10 ring-2 {getSegmentRingClass(
                                                    seg,
                                                    selectedMultiplier,
                                                )} hover:bg-zinc-200 dark:hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.95]"
                                            >
                                                {selectedMultiplier === 3
                                                    ? "T"
                                                    : selectedMultiplier === 2
                                                      ? "D"
                                                      : ""}{seg}
                                            </button>
                                        {/each}
                                    </div>
                                {/each}
                                <!-- Bull / 25 -->
                                <div class="grid grid-cols-5 gap-1">
                                    <div class="col-start-3">
                                        <button
                                            onclick={() => addDart(25)}
                                            disabled={currentDarts.length >= 3}
                                            class="w-full rounded-[5px] py-1.5 text-[11px] font-bold bg-zinc-100 dark:bg-white/10 ring-2 {getSegmentRingClass(
                                                25,
                                                selectedMultiplier,
                                            )} hover:bg-zinc-200 dark:hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.95]"
                                        >
                                            {selectedMultiplier === 2
                                                ? "Bull"
                                                : "25"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        {/if}

                        <!-- Current Darts -->
                        <div
                            class="flex items-center gap-2 justify-center min-h-8 {currentDarts.length >
                            0
                                ? ''
                                : 'invisible'}"
                        >
                            {#each currentDarts as dart, i}
                                <span
                                    class="rounded-[5px] px-2.5 py-1 text-xs font-mono bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                                >
                                    {dart.multiplier === 3
                                        ? "T"
                                        : dart.multiplier === 2
                                          ? "D"
                                          : ""}{dart.segment === 25
                                        ? dart.multiplier === 2
                                            ? "Bull"
                                            : "25"
                                        : dart.segment}
                                    <span
                                        class="text-zinc-400 dark:text-zinc-500 ml-1"
                                        >({dart.score})</span
                                    >
                                </span>
                            {/each}
                            <button
                                onclick={removeLastDart}
                                class="text-xs text-zinc-400 hover:text-red-500 ml-2 inline-flex items-center gap-0.5"
                                ><IconArrowBack size={12} /> Undo</button
                            >
                        </div>

                        <!-- Submit -->
                        <div class="text-center">
                            <PillButton
                                onclick={submitCurrentTurn}
                                disabled={currentDarts.length === 0}
                            >
                                Submit Turn ({currentDarts.length} dart{currentDarts.length !==
                                1
                                    ? "s"
                                    : ""})
                            </PillButton>
                        </div>
                    </div>
                </DoubleBezel>

                <!-- Checkout Suggestions -->
                {#if checkoutOptions.length > 0}
                    <DoubleBezel>
                        <EyebrowTag class="mb-2">Checkout</EyebrowTag>
                        <div class="space-y-1 mt-2">
                            {#each checkoutOptions as opt}
                                <div
                                    class="text-sm font-mono text-emerald-600 dark:text-emerald-400"
                                >
                                    {opt.description}
                                </div>
                            {/each}
                        </div>
                    </DoubleBezel>
                {/if}

                <!-- Turn History — Table -->
                <DoubleBezel>
                    <EyebrowTag class="mb-2">Turn History</EyebrowTag>
                    <div class="mt-3">
                        <table class="w-full text-sm">
                            <thead>
                                <tr
                                    class="text-[10px] uppercase tracking-wider text-zinc-400 border-b border-zinc-100 dark:border-white/5"
                                >
                                    <th class="text-left pb-2 pr-2">Player</th>
                                    <th class="text-center pb-2 px-1">D1</th>
                                    <th class="text-center pb-2 px-1">D2</th>
                                    <th class="text-center pb-2 px-1">D3</th>
                                    <th class="text-center pb-2 px-1">Tot</th>
                                    <th class="text-right pb-2 pl-2">Left</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each [...matchState.currentLeg.turns].reverse() as turn}
                                    {@const isCurrentPlayer =
                                        turn.playerId === currentPlayer?.id}
                                    {@const playerName =
                                        matchState.players.find(
                                            (p) => p.id === turn.playerId,
                                        )?.name ?? "?"}
                                    <tr
                                        class="border-b border-zinc-50 dark:border-white/5 last:border-0 transition-colors {isCurrentPlayer
                                            ? 'bg-emerald-50/60 dark:bg-emerald-500/5'
                                            : ''}"
                                    >
                                        <td class="py-1.5 pr-2">
                                            <span
                                                class="font-medium text-xs {isCurrentPlayer
                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                    : ''}"
                                            >
                                                {#if isCurrentPlayer}
                                                    <IconPlayerPlay
                                                        size={10}
                                                        class="inline -mt-0.5 mr-0.5"
                                                    />
                                                {/if}
                                                {playerName}
                                            </span>
                                        </td>
                                        <td
                                            class="py-1.5 px-1 text-center font-mono text-xs"
                                        >
                                            {formatDart(turn.darts[0])}
                                        </td>
                                        <td
                                            class="py-1.5 px-1 text-center font-mono text-xs"
                                        >
                                            {formatDart(turn.darts[1])}
                                        </td>
                                        <td
                                            class="py-1.5 px-1 text-center font-mono text-xs"
                                        >
                                            {formatDart(turn.darts[2])}
                                        </td>
                                        <td
                                            class="py-1.5 px-1 text-center font-mono text-xs font-medium {turn.isBust
                                                ? 'text-red-500'
                                                : ''}"
                                        >
                                            {#if turn.isBust}
                                                <span
                                                    class="text-red-500 text-[9px] font-bold"
                                                    >BUST</span
                                                >
                                                <br />
                                            {/if}
                                            {turn.totalScore}
                                        </td>
                                        <td
                                            class="py-1.5 pl-2 text-right font-mono text-xs font-medium"
                                        >
                                            {turn.remainingScore}
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                        {#if matchState.currentLeg.turns.length === 0}
                            <div class="text-zinc-400 text-center py-2 text-sm">
                                No turns yet
                            </div>
                        {/if}
                    </div>
                </DoubleBezel>
            </div>

            <!-- ============================================ -->
            <!-- RIGHT: Player 2 Scoreboard + Stats           -->
            <!-- ============================================ -->
            {#if matchState.players[1]}
                {@const p2 = matchState.players[1]}
                {@const p2Active =
                    matchState.currentLeg.currentPlayerIndex === 1}
                {@const p2Turns = getPlayerTurns(p2.id)}
                {@const p2Stats = computeMatchStats(p2Turns)}
                {@const p2Darts = getDartsThrown(p2.id)}
                {@const p2LifetimeAvg = playerStats[p2.id]?.threeDartAvg
                    ? Number(playerStats[p2.id].threeDartAvg).toFixed(1)
                    : "—"}
                <div class="lg:col-span-3 order-2 lg:order-none space-y-3">
                    <!-- Player 2 Scoreboard -->
                    <DoubleBezel>
                        <div class="text-center">
                            <div
                                class="font-display font-black text-5xl tracking-tight leading-none {p2Active
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : ''}"
                            >
                                <AnimatedNumber value={p2.remainingScore} />
                            </div>
                            <div
                                class="mt-2 font-medium text-sm {p2Active
                                    ? 'text-emerald-700 dark:text-emerald-400'
                                    : ''}"
                            >
                                {#if p2Active}
                                    <IconPlayerPlay
                                        size={14}
                                        class="inline -mt-0.5 text-emerald-500 mr-0.5"
                                    />
                                {/if}
                                {p2.name}
                            </div>
                            <div
                                class="mt-2 flex justify-center gap-4 text-xs font-mono text-zinc-400"
                            >
                                <span
                                    >Sets
                                    <span
                                        class="font-bold text-sm text-zinc-700 dark:text-zinc-300"
                                        >{p2.setsWon}</span
                                    ></span
                                >
                                <span
                                    >Legs
                                    <span
                                        class="font-bold text-sm text-zinc-700 dark:text-zinc-300"
                                        >{p2.legsWon}</span
                                    ></span
                                >
                            </div>
                            <div
                                class="mt-1.5 flex justify-center gap-3 text-[10px] text-zinc-400"
                            >
                                <span
                                    >Darts
                                    <span class="font-mono font-medium"
                                        >{p2Darts}</span
                                    ></span
                                >
                                <span
                                    >Avg
                                    <span class="font-mono font-medium"
                                        >{p2LifetimeAvg}</span
                                    ></span
                                >
                            </div>
                        </div>
                    </DoubleBezel>

                    <!-- Player 2 Stats -->
                    <DoubleBezel>
                        <EyebrowTag class="mb-2">Stats</EyebrowTag>
                        <div class="space-y-1.5 mt-2">
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-zinc-400"
                                    >3-Dart Avg</span
                                >
                                <span class="text-sm font-mono font-medium"
                                    >{p2Stats.threeDartAvg.toFixed(1)}</span
                                >
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-zinc-400"
                                    >Checkout %</span
                                >
                                <span class="text-sm font-mono font-medium"
                                    >{p2Stats.checkoutPct.toFixed(0)}%</span
                                >
                            </div>

                            <div
                                class="pt-2 mt-1 border-t border-zinc-100 dark:border-white/5"
                            >
                                <div class="grid grid-cols-3 gap-1 text-center">
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            60+
                                        </div>
                                        <div
                                            class="font-mono font-medium text-sm"
                                        >
                                            {p2Stats.count60Plus}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            100+
                                        </div>
                                        <div
                                            class="font-mono font-medium text-sm"
                                        >
                                            {p2Stats.count100Plus}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            140+
                                        </div>
                                        <div
                                            class="font-mono font-medium text-sm"
                                        >
                                            {p2Stats.count140Plus}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="pt-2 mt-1 border-t border-zinc-100 dark:border-white/5"
                            >
                                <div class="grid grid-cols-3 gap-1 text-center">
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            &lt;20
                                        </div>
                                        <div
                                            class="font-mono font-medium text-sm text-zinc-500"
                                        >
                                            {p2Stats.countUnder20}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            180
                                        </div>
                                        <div
                                            class="font-mono font-bold text-sm text-amber-600 dark:text-amber-400"
                                        >
                                            {p2Stats.count180}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            60+ Fin
                                        </div>
                                        <div
                                            class="font-mono font-medium text-sm text-emerald-600 dark:text-emerald-400"
                                        >
                                            {p2Stats.count60PlusFinishes}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Avg Trend: Last 3 vs Prior -->
                            <div
                                class="pt-2 mt-1 border-t border-zinc-100 dark:border-white/5"
                            >
                                <div
                                    class="text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5"
                                >
                                    Avg Trend
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-xs text-zinc-500"
                                        >Last 3</span
                                    >
                                    <div class="flex items-center gap-1">
                                        <span
                                            class="text-sm font-mono font-medium"
                                            >{p2Stats.last3Avg.toFixed(1)}</span
                                        >
                                        {#if p2Stats.prior15Avg > 0}
                                            {#if p2Stats.last3Avg > p2Stats.prior15Avg}
                                                <IconArrowUp
                                                    size={14}
                                                    class="text-emerald-500"
                                                />
                                            {:else if p2Stats.last3Avg < p2Stats.prior15Avg}
                                                <IconArrowDown
                                                    size={14}
                                                    class="text-red-500"
                                                />
                                            {/if}
                                        {/if}
                                    </div>
                                </div>
                                <div
                                    class="flex justify-between items-center mt-0.5"
                                >
                                    <span class="text-xs text-zinc-500"
                                        >Prior turns</span
                                    >
                                    <span
                                        class="text-sm font-mono text-zinc-400"
                                        >{p2Stats.prior15Avg > 0
                                            ? p2Stats.prior15Avg.toFixed(1)
                                            : "—"}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </DoubleBezel>
                </div>
            {/if}
        </div>
    </div>
{/if}
