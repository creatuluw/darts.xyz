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
        IconTrash,
        IconExternalLink,
    } from "@tabler/icons-svelte";
    import {
        DoubleBezel,
        PillButton,
        AnimatedNumber,
        StatBadge,
        Dartboard,
        Tooltip,
        PlayerPanel,
    } from "$lib/components/ui";
    import {
        createMatchState,
        submitTurn,
        abandonMatch,
        getScoreDisplay,
    } from "$lib/game";
    import { processTurn } from "$lib/game/scoring";
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
    import {
        voiceSettings,
        VOICE_OPTIONS,
        getVoicePrefix,
    } from "$lib/stores/voice-settings";
    import { addToast } from "$lib/stores/toast";
    import { loadingStore } from "$lib/stores/loading";
    import { StyledSelect } from "$lib/components/ui";

    let matchId = $derived($page.params.id as string);
    let matchState = $state<MatchState | null>(null);
    let matchData = $state<any>(null);
    let playerStats = $state<Record<string, any>>({});
    let loading = $state(true);
    let isSoloGame = $derived(matchState?.players.length === 1);

    // 3+ players: side scoreboards switch to condensed single-card mode
    let isMultiGame = $derived((matchState?.players.length ?? 0) > 2);
    // Throw-order rotation starting from the current thrower
    let rotation = $derived.by(() => {
        const ms = matchState;
        if (!ms) return [];
        return ms.players.map(
            (_, i) =>
                (ms.currentLeg.currentPlayerIndex + i) % ms.players.length,
        );
    });
    // 1–2 players: halves around the board. 3+: current + next on the left,
    // everyone else on the right (in throw order)
    let leftPlayers = $derived.by(() => {
        const ms = matchState;
        if (!ms) return [];
        if (isMultiGame)
            return rotation.slice(0, 2).map((i) => ms.players[i]);
        return ms.players.slice(0, Math.ceil(ms.players.length / 2));
    });
    let rightPlayers = $derived.by(() => {
        const ms = matchState;
        if (!ms) return [];
        if (isMultiGame) return rotation.slice(2).map((i) => ms.players[i]);
        return ms.players.slice(Math.ceil(ms.players.length / 2));
    });
    // Standings rank per player: sets won, then legs won, then current-leg
    // remaining score (closer to the checkout ranks higher; ties share a rank)
    let playerRanks = $derived.by(() => {
        const ms = matchState;
        const ranks = new Map<string, number>();
        if (!ms || ms.players.length < 2) return ranks;
        const sorted = [...ms.players].sort(
            (a, b) =>
                b.setsWon - a.setsWon ||
                b.legsWon - a.legsWon ||
                a.remainingScore - b.remainingScore,
        );
        let lastKey = "";
        let lastRank = 0;
        sorted.forEach((p, idx) => {
            const key = `${p.setsWon}-${p.legsWon}-${p.remainingScore}`;
            const rank = key === lastKey ? lastRank : idx + 1;
            ranks.set(p.id, rank);
            lastKey = key;
            lastRank = rank;
        });
        return ranks;
    });

    // Dart input state - 3 fixed slots with active slot tracking
    type DartSlot = DartData | null;
    let dartSlots = $state<[DartSlot, DartSlot, DartSlot]>([null, null, null]);
    let activeSlotIndex = $derived(dartSlots.findIndex((d) => d === null));

    let currentDarts = $derived(dartSlots.filter((d): d is DartData => d !== null));
    let filledSlotCount = $derived(currentDarts.length);
    let showCheckout = $state(false);
    let showDeleteConfirm = $state(false);

    // Input mode: board or numpad
    let inputMode = $state<"board" | "numpad">(
        typeof localStorage !== "undefined" && localStorage.getItem("inputMode") === "numpad" ? "numpad" : "board"
    );
    $effect(() => {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem("inputMode", inputMode);
        }
    });

    // Numpad multiplier state
    let numpadMultiplier = $state<1 | 2 | 3>(1);

    // Active tab state
    let activeTab = $state<"board" | "turns" | "stats" | "settings">("board");

    // In-game voice setting
    let inGameVoiceId = $state("jack");
    let inGameVoiceOptions = VOICE_OPTIONS.map((v) => ({
        value: v.id,
        label: v.name,
        previewSrc: `/audio/${v.prefix}score-26.mp3`,
    }));

    // Sync store → local voice state
    $effect(() => {
        const unsubscribe = voiceSettings.subscribe((value) => {
            inGameVoiceId = value;
        });
        return unsubscribe;
    });

    // When voice changes in-game, persist and reinitialize caller
    $effect(() => {
        if (inGameVoiceId) {
            voiceSettings.set(inGameVoiceId);
            const setting = VOICE_OPTIONS.find((v) => v.id === inGameVoiceId);
            if (setting) {
                import("$lib/utils/darts-caller").then(({ initDartsCaller }) => {
                    initDartsCaller({
                        profile: "dartsCaller",
                        voicePrefix: setting.prefix,
                    });
                });
                addToast(`Caller voice changed to ${setting.name}`, "success");
            }
        }
    });

    // Active tab state
    let allMatchTurns = $state<TurnRecord[]>([]);
    let allLegsData = $state<any[]>([]);

    interface TurnWithLeg extends TurnRecord {
        setNumber: number;
        legNumber: number;
    }

    let allTurnsWithLeg: TurnWithLeg[] = $derived(
        allMatchTurns.map((t) => {
            const leg = allLegsData.find((l: any) => l.id === t.legId);
            return {
                ...t,
                setNumber: leg?.setNumber ?? 0,
                legNumber: leg?.legNumber ?? 0,
            };
        }),
    );

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

    // === Match Stats Helpers ===
    // Uses allMatchTurns (turns from ALL legs) for full-match statistics
    function getPlayerTurns(playerId: string): TurnRecord[] {
        return allMatchTurns.filter((t) => t.playerId === playerId);
    }

    // Get turns from only the current leg (for turn history display)
    function getCurrentLegTurns(): TurnRecord[] {
        if (!matchState) return [];
        return matchState.currentLeg.turns;
    }

    function getDartsThrown(playerId: string): number {
        return getPlayerTurns(playerId).reduce(
            (sum, t) => sum + t.dartsThrown,
            0,
        );
    }

    // 3-dart average from the current leg's turns only
    function getLegAvg(playerId: string): number {
        if (!matchState) return 0;
        return computeMatchStats(
            matchState.currentLeg.turns.filter((t) => t.playerId === playerId),
        ).threeDartAvg;
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
            doubleConversion: 0,
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
        let doubleChances = 0;
        let throwsOnDouble = 0;

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

        // Per-dart tracking for double conversion
        const isValidDoubleOut = (score: number) =>
            score > 0 && score % 2 === 0;

        for (const turn of turns) {
            const startOfTurnRemaining = turn.remainingScore + turn.totalScore;
            let onDoubleChance = false;
            let runningRemaining = startOfTurnRemaining;

            for (let i = 0; i < turn.darts.length; i++) {
                const dart = turn.darts[i];
                if (dart.score === 0) continue;

                if (runningRemaining <= 170 && runningRemaining > 0) {
                    if (isValidDoubleOut(runningRemaining)) {
                        throwsOnDouble++;
                        onDoubleChance = true;
                    } else if (onDoubleChance) {
                        onDoubleChance = false;
                    }
                }

                runningRemaining -= dart.score;

                if (
                    runningRemaining <= 170 &&
                    runningRemaining > 0 &&
                    isValidDoubleOut(runningRemaining)
                ) {
                    doubleChances++;
                    onDoubleChance = true;
                } else if (
                    runningRemaining % 2 !== 0 ||
                    runningRemaining > 170
                ) {
                    onDoubleChance = false;
                }
            }
        }

        const doubleConversion =
            throwsOnDouble > 0 ? (checkoutSuccesses / throwsOnDouble) * 100 : 0;

        // Last 3 vs prior turns (up to 15 before the last 3)
        const last3 = turns.slice(-3);
        const prior = turns.slice(0, -3).slice(-15);

        return {
            threeDartAvg,
            checkoutPct,
            doubleConversion,
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
        loadingStore.start("audio", "Loading voice caller...");
        loadingStore.start("data", "Loading match data...");
        loadingStore.start("stats", "Loading player stats...");

        import("$lib/utils/darts-caller")
            .then(async ({ initDartsCaller }) => {
                await initDartsCaller({
                    profile: "dartsCaller",
                    voicePrefix: getVoicePrefix(),
                });
            })
            .catch((err) => {
                console.warn("Voice caller initialization failed:", err);
            })
            .finally(() => {
                loadingStore.finish("audio");
            });

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

        // Fetch all legs and turns for resume logic
        const legsRes = await fetch(`/api/matches/${matchId}/legs`);
        const allLegs: any[] = await legsRes.json();
        allLegsData = allLegs;

        const turnsRes = await fetch(`/api/matches/${matchId}/turns`);
        const allTurns: any[] = await turnsRes.json();

        // Announce GAME ON for fresh matches (no turns yet)
        if (allTurns.length === 0) {
            import("$lib/utils/darts-caller").then((caller) => caller.announceGameOn());
        }

        const config = {
            startingScore: Number(data.match.startingScore) as
                | 301
                | 501
                | 701
                | 1001,
            legsPerSet: Number(data.match.legsPerSet) as 1 | 3 | 5 | 7,
            setsPerMatch: Number(data.match.setsPerMatch) as 1 | 3 | 5 | 7,
            doubleIn: Boolean(data.match.doubleIn),
        };

        if (allLegs.length > 0) {
            // === RESUME EXISTING MATCH ===

            // Find current set (highest set number)
            const currentSetNum = Math.max(
                ...allLegs.map((l: any) => l.setNumber),
            );

            // Find current leg within current set
            const currentSetLegs = allLegs.filter(
                (l: any) => l.setNumber === currentSetNum,
            );
            const currentLegNum = Math.max(
                ...currentSetLegs.map((l: any) => l.legNumber),
            );
            const currentLegData = currentSetLegs.find(
                (l: any) => l.legNumber === currentLegNum,
            );

            // Calculate per-set legsWon from legs with winnerId in current set
            const legsWonInCurrentSet: Record<string, number> = {};
            for (const leg of currentSetLegs) {
                if (leg.winnerId) {
                    legsWonInCurrentSet[leg.winnerId] =
                        (legsWonInCurrentSet[leg.winnerId] || 0) + 1;
                }
            }

            // Count completed sets won by each player (from earlier sets)
            const setsWonByPlayer: Record<string, number> = {};
            for (let s = 1; s < currentSetNum; s++) {
                const setLegs = allLegs.filter((l: any) => l.setNumber === s);
                const legsNeeded = Math.ceil(config.legsPerSet / 2);
                const playerLegWins: Record<string, number> = {};
                for (const leg of setLegs) {
                    if (leg.winnerId) {
                        playerLegWins[leg.winnerId] =
                            (playerLegWins[leg.winnerId] || 0) + 1;
                    }
                }
                for (const [playerId, wins] of Object.entries(playerLegWins)) {
                    if (wins >= legsNeeded) {
                        setsWonByPlayer[playerId] =
                            (setsWonByPlayer[playerId] || 0) + 1;
                        break;
                    }
                }
            }

            // Get turns for current leg to determine remaining scores
            const currentLegTurns = allTurns.filter(
                (t: any) => t.legId === currentLegData.id,
            );

            // Build player state with restored scores
            const players = playerData.map((p: any, i: number) => {
                const playerLegTurns = currentLegTurns.filter(
                    (t: any) => t.playerId === p.id,
                );
                const lastTurn = playerLegTurns[playerLegTurns.length - 1];

                return {
                    id: p.id,
                    name: p.name,
                    throwOrder: i,
                    remainingScore: lastTurn
                        ? lastTurn.remainingScore
                        : config.startingScore,
                    setsWon: setsWonByPlayer[p.id] || 0,
                    legsWon: legsWonInCurrentSet[p.id] || 0,
                };
            });

            // Determine current player index
            // If turns exist in current leg, next player after last thrower
            // Otherwise, use firstThrowerId from leg data
            let currentPlayerIndex = 0;
            if (currentLegTurns.length > 0) {
                const lastTurnPlayerId =
                    currentLegTurns[currentLegTurns.length - 1].playerId;
                const lastTurnIndex = players.findIndex(
                    (p: any) => p.id === lastTurnPlayerId,
                );
                currentPlayerIndex = (lastTurnIndex + 1) % players.length;
            } else if (currentLegData.firstThrowerId) {
                // firstThrowerId is a match_player ID — find the player
                const firstThrowerMp = data.matchPlayers.find(
                    (mp: any) => mp.id === currentLegData.firstThrowerId,
                );
                if (firstThrowerMp) {
                    currentPlayerIndex = players.findIndex(
                        (p: any) => p.id === firstThrowerMp.playerId,
                    );
                }
            }

            // The leg's actual first thrower — keeps leg-start alternation in
            // sync with the DB after a refresh (NOT the current player)
            let firstThrowerIndex = 0;
            if (currentLegData.firstThrowerId) {
                const firstThrowerMp = data.matchPlayers.find(
                    (mp: any) => mp.id === currentLegData.firstThrowerId,
                );
                if (firstThrowerMp) {
                    const idx = players.findIndex(
                        (p: any) => p.id === firstThrowerMp.playerId,
                    );
                    if (idx >= 0) firstThrowerIndex = idx;
                }
            }

            // Convert API turns to TurnRecord format for current leg
            const turnRecords: TurnRecord[] = currentLegTurns.map((t: any) => ({
                id: t.id,
                playerId: t.playerId,
                turnNumber: t.turnNumber,
                darts: [
                    t.dart1Segment > 0
                        ? {
                              segment: t.dart1Segment,
                              multiplier: t.dart1Multiplier as Multiplier,
                              score: t.dart1Score,
                          }
                        : {
                              segment: 0,
                              multiplier: 0 as Multiplier,
                              score: 0,
                          },
                    t.dart2Segment > 0
                        ? {
                              segment: t.dart2Segment,
                              multiplier: t.dart2Multiplier as Multiplier,
                              score: t.dart2Score,
                          }
                        : {
                              segment: 0,
                              multiplier: 0 as Multiplier,
                              score: 0,
                          },
                    t.dart3Segment > 0
                        ? {
                              segment: t.dart3Segment,
                              multiplier: t.dart3Multiplier as Multiplier,
                              score: t.dart3Score,
                          }
                        : {
                              segment: 0,
                              multiplier: 0 as Multiplier,
                              score: 0,
                          },
                ].filter((d: any) => d.segment > 0 || d.score > 0),
                totalScore: t.totalScore,
                remainingScore: t.remainingScore,
                isBust: t.isBust,
                dartsThrown: t.dartsThrown,
            }));

            // Build allMatchTurns from ALL turns across all legs
            allMatchTurns = allTurns.map((t: any) => ({
                id: t.id,
                legId: t.legId,
                playerId: t.playerId,
                turnNumber: t.turnNumber,
                darts: [
                    t.dart1Segment > 0
                        ? {
                              segment: t.dart1Segment,
                              multiplier: t.dart1Multiplier as Multiplier,
                              score: t.dart1Score,
                          }
                        : { segment: 0, multiplier: 0 as Multiplier, score: 0 },
                    t.dart2Segment > 0
                        ? {
                              segment: t.dart2Segment,
                              multiplier: t.dart2Multiplier as Multiplier,
                              score: t.dart2Score,
                          }
                        : { segment: 0, multiplier: 0 as Multiplier, score: 0 },
                    t.dart3Segment > 0
                        ? {
                              segment: t.dart3Segment,
                              multiplier: t.dart3Multiplier as Multiplier,
                              score: t.dart3Score,
                          }
                        : { segment: 0, multiplier: 0 as Multiplier, score: 0 },
                ].filter((d: any) => d.segment > 0 || d.score > 0),
                totalScore: t.totalScore,
                remainingScore: t.remainingScore,
                isBust: t.isBust,
                dartsThrown: t.dartsThrown,
            }));

            matchState = {
                matchId,
                config,
                players,
                currentLeg: {
                    setNumber: currentSetNum,
                    legNumber: currentLegNum,
                    currentPlayerIndex,
                    firstThrowerIndex,
                    turns: turnRecords,
                    isComplete: false,
                    winnerId: null,
                },
                status: "in_progress",
                winnerId: null,
            };
        } else {
            // === NEW MATCH (no legs yet) ===
            matchState = createMatchState(matchId, config, playerData);
            allMatchTurns = [];
        }

        loadingStore.finish("data");

        // Load stats for each player
        for (const p of playerData) {
            const statsRes = await fetch(`/api/stats/${p.id}`);
            playerStats[p.id] = await statsRes.json();
        }

        loadingStore.finish("stats");
        loading = false;
    });

    function addDart(segment: number, multiplier: Multiplier) {
        if (activeSlotIndex === -1) return;
        const score = segment === 0 ? 0 : segment * multiplier;
        const dart: DartData = { segment, multiplier, score };
        dartSlots[activeSlotIndex] = dart;
        dartSlots = [...dartSlots];
    }

    function removeLastDart() {
        const lastFilled = dartSlots.map((d, i) => d !== null ? i : -1).filter(i => i !== -1).pop();
        if (lastFilled !== undefined) {
            dartSlots[lastFilled] = null;
            dartSlots = [...dartSlots];
        }
    }

    function removeDartAt(index: number) {
        dartSlots[index] = null;
        dartSlots = [...dartSlots];
    }

    function clearAllDarts() {
        dartSlots = [null, null, null];
    }

    async function submitCurrentTurn() {
        if (!matchState || currentDarts.length === 0) return;

        // Capture pre-submit state for checkout detection
        const preLegSetNum = matchState.currentLeg.setNumber;
        const preLegLegNum = matchState.currentLeg.legNumber;
        const preTurnCount = matchState.currentLeg.turns.length;
        const prePlayerIdx = matchState.currentLeg.currentPlayerIndex;
        const prePlayerId = matchState.players[prePlayerIdx].id;
        const preRemaining = matchState.players[prePlayerIdx].remainingScore;

        // Submit turn to state machine
        matchState = submitTurn(matchState, currentDarts);

        // Determine what happened
        const postLeg = matchState.currentLeg;
        const legChanged =
            postLeg.setNumber !== preLegSetNum ||
            postLeg.legNumber !== preLegLegNum;
        const matchEnded = matchState.status === "completed";
        const checkoutHappened = legChanged || matchEnded;

        // Get the turn record for persistence
        let lastTurn: TurnRecord;
        let persistSetNum: number;
        let persistLegNum: number;

        if (checkoutHappened && legChanged) {
            // Checkout happened, new leg started, match continues.
            // The completed leg's turns are no longer in state — reconstruct
            // using processTurn to get correct darts/dartsThrown.
            const turnResult = processTurn(currentDarts, preRemaining);
            lastTurn = {
                playerId: prePlayerId,
                turnNumber: preTurnCount + 1,
                darts: turnResult.darts,
                totalScore: turnResult.totalScore,
                remainingScore: turnResult.isBust
                    ? preRemaining
                    : preRemaining - turnResult.totalScore,
                isBust: turnResult.isBust,
                dartsThrown: turnResult.dartsThrown,
            };
            persistSetNum = preLegSetNum;
            persistLegNum = preLegLegNum;
        } else {
            // No checkout, or match ended (completed leg is currentLeg)
            lastTurn = postLeg.turns[postLeg.turns.length - 1];
            persistSetNum = postLeg.setNumber;
            persistLegNum = postLeg.legNumber;
        }

        if (!lastTurn) {
            dartSlots = [null, null, null];
            return;
        }

        // Accumulate turn for full-match stats
        allMatchTurns = [...allMatchTurns, lastTurn];

        // Find the DB leg record for the turn's leg
        const legsRes = await fetch(`/api/matches/${matchId}/legs`);
        const legs = await legsRes.json();
        allLegsData = legs;
        const targetLegData = legs.find(
            (l: any) =>
                l.setNumber === persistSetNum && l.legNumber === persistLegNum,
        );

        if (targetLegData) {
            const persistRes = await fetch(
                "/api/matches/" + matchId + "/turns",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        legId: targetLegData.id,
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
                },
            );
            const persisted = await persistRes.json();
            lastTurn.id = persisted.id;
            lastTurn.legId = targetLegData.id;
        }

        // Handle leg completion — persist winner & scores, create next leg
        if (checkoutHappened) {
            const legWinnerId = matchEnded ? postLeg.winnerId! : prePlayerId;

            // Persist leg winner (even when match ends)
            if (targetLegData) {
                await fetch(`/api/matches/${matchId}/legs`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        legId: targetLegData.id,
                        winnerId: legWinnerId,
                    }),
                });
            }

            // Persist setsWon/legsWon for all players
            for (const player of matchState.players) {
                const matchPlayer = matchData.matchPlayers.find(
                    (mp: any) => mp.playerId === player.id,
                );
                if (matchPlayer) {
                    await fetch(
                        `/api/matches/${matchId}/players/${matchPlayer.id}`,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                setsWon: player.setsWon,
                                legsWon: player.legsWon,
                            }),
                        },
                    );
                }
            }

            // Create next leg if match continues
            if (matchState.status === "in_progress") {
                // Alternate who throws first each leg.
                // firstThrowerId must be a match_player UUID, not a player UUID.
                const completedLegData = legs.find(
                    (l: any) =>
                        l.setNumber === persistSetNum &&
                        l.legNumber === persistLegNum,
                );
                const currentFirstMp = completedLegData
                    ? matchData.matchPlayers.find(
                          (mp: any) =>
                              mp.id === completedLegData.firstThrowerId,
                      )
                    : null;
                const currentFirstIndex = currentFirstMp
                    ? matchData.matchPlayers.findIndex(
                          (mp: any) => mp.id === currentFirstMp.id,
                      )
                    : 0;
                const nextFirstIndex =
                    (currentFirstIndex + 1) % matchData.matchPlayers.length;
                const firstThrowerId =
                    matchData.matchPlayers[nextFirstIndex]?.id || "";

                await fetch(`/api/matches/${matchId}/legs`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        setNumber: postLeg.setNumber,
                        legNumber: postLeg.legNumber,
                        firstThrowerId,
                    }),
                });
            }
        }

        // Handle match completion
        if (matchEnded) {
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

        dartSlots = [null, null, null];

        // Announce the score like a darts caller
        if (lastTurn) {
            const playerName =
                matchState?.players.find((p) => p.id === prePlayerId)?.name ??
                "Unknown";

            import("$lib/utils/darts-caller").then((caller) => {
                // Announce score
                if (lastTurn.totalScore === 180) {
                    caller.announce180();
                } else if (lastTurn.totalScore > 0) {
                    caller.announceScore(lastTurn.totalScore);
                }

                // Handle bust or checkout
                if (lastTurn.isBust) {
                    setTimeout(() => caller.announceBust(), 300);
                } else if (checkoutHappened) {
                    setTimeout(() => caller.announceCheckout(playerName), 300);
                    setTimeout(() => caller.announceLegWinner(playerName), 600);

                    // Detect and announce set winner
                    // If set number changed, the previous set just ended
                    if (postLeg.setNumber !== preLegSetNum) {
                        const setWinnerName = playerName;
                        setTimeout(() => caller.announceSetWinner(setWinnerName), 1000);
                        setTimeout(() => caller.announceNextSet(), 1300);
                    }

                    setTimeout(() => caller.announceNextLeg(), 1600);
                }
            });
        }

        // Announce match winner (after all leg/set announcements complete)
        if (matchEnded) {
            const winnerId = matchState?.winnerId;
            const winner = matchState?.players.find((p) => p.id === winnerId);
            if (winner) {
                setTimeout(() => {
                    import("$lib/utils/darts-caller").then((caller) => {
                        caller.announceMatchWinner(winner.name);
                    });
                }, 2500);
            }
        }
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

    async function deleteLastTurn() {
        if (!matchState) return;
        const turns = matchState.currentLeg.turns;
        if (turns.length === 0) return;

        const lastTurn = turns[turns.length - 1];
        if (lastTurn.id) {
            await fetch(`/api/matches/${matchId}/turns?id=${lastTurn.id}`, {
                method: "DELETE",
            });
        }

        matchState.currentLeg.turns = turns.slice(0, -1);
        allMatchTurns = allMatchTurns.slice(0, -1);

        const lastPlayerIdx = matchState.players.findIndex(
            (p) => p.id === lastTurn.playerId,
        );
        matchState.currentLeg.currentPlayerIndex = lastPlayerIdx;

        matchState.players[lastPlayerIdx].remainingScore =
            turns.length > 1
                ? turns[turns.length - 2].remainingScore
                : matchState.config.startingScore;
    }
</script>

<svelte:head>
    <title>Match — dart.monster</title>
</svelte:head>

<svelte:window
    onkeydown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
            e.preventDefault();
            if (currentDarts.length > 0 && !matchState?.currentLeg.isComplete) {
                submitCurrentTurn();
            }
        }
    }}
/>

{#if loading}
    <div></div>
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

        <!-- Header with Tabs -->
        <div class="grid grid-cols-3 items-center mb-4">
            <div>
                <span class="text-xs text-zinc-400 font-medium"
                    >Set {matchState.currentLeg.setNumber} · Leg {matchState
                        .currentLeg.legNumber}</span
                >
            </div>
            <div class="flex justify-center gap-2">
                <button
                    onclick={() => (activeTab = "board")}
                    class="px-6 py-1.5 text-sm font-medium rounded transition-colors cursor-pointer border border-[#E2DFD8] {activeTab ===
                    'board'
                        ? 'bg-white text-zinc-900 font-semibold'
                        : 'bg-transparent text-zinc-400 hover:bg-black hover:text-white'}"
                >
                    Board
                </button>
                <button
                    onclick={() => (activeTab = "turns")}
                    class="px-6 py-1.5 text-sm font-medium rounded transition-colors cursor-pointer border border-[#E2DFD8] {activeTab ===
                    'turns'
                        ? 'bg-white text-zinc-900 font-semibold'
                        : 'bg-transparent text-zinc-400 hover:bg-black hover:text-white'}"
                >
                    Turns
                </button>
                <button
                    onclick={() => (activeTab = "stats")}
                    class="px-6 py-1.5 text-sm font-medium rounded transition-colors cursor-pointer border border-[#E2DFD8] {activeTab ===
                    'stats'
                        ? 'bg-white text-zinc-900 font-semibold'
                        : 'bg-transparent text-zinc-400 hover:bg-black hover:text-white'}"
                >
                    Stats
                </button>
                <button
                    onclick={() => (activeTab = "settings")}
                    class="px-6 py-1.5 text-sm font-medium rounded transition-colors cursor-pointer border border-[#E2DFD8] {activeTab ===
                    'settings'
                        ? 'bg-white text-zinc-900 font-semibold'
                        : 'bg-transparent text-zinc-400 hover:bg-black hover:text-white'}"
                >
                    Settings
                </button>
            </div>
            <div class="flex justify-end">
                <button
                    onclick={handleAbandon}
                    class="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                >
                    Abandon
                </button>
            </div>
        </div>

        <!-- 3-Column Bento Grid -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3">

            <!-- ============================================ -->
            <!-- LEFT: Player scoreboards (first half)        -->
            <!-- ============================================ -->
            {#if leftPlayers.length > 0}
                <div class="md:col-span-3 order-1 md:order-none space-y-3">
                    {#each leftPlayers as p, i (p.id)}
                        {@const legDarts = matchState.currentLeg.turns
                            .filter((t) => t.playerId === p.id)
                            .reduce((sum, t) => sum + t.dartsThrown, 0)}
                    {#if i === 1 && currentPlayer}
                        {@const cs = computeMatchStats(
                            getPlayerTurns(currentPlayer.id),
                        )}
                        <!-- Current thrower: live stats + throw-out options -->
                        <DoubleBezel>
                            <div class="space-y-1.5">
                                <div
                                    class="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold"
                                >
                                    {currentPlayer.name} — live
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-xs text-zinc-400"
                                        >Match Avg</span
                                    >
                                    <span
                                        class="text-sm font-mono font-medium"
                                        >{cs.threeDartAvg.toFixed(1)}</span
                                    >
                                </div>
                                {#if matchState.currentLeg.setNumber > 1 ||
                                    matchState.currentLeg.legNumber > 1}
                                    <div
                                        class="flex justify-between items-center"
                                    >
                                        <span class="text-xs text-zinc-400"
                                            >Leg Avg</span
                                        >
                                        <span
                                            class="text-sm font-mono font-medium"
                                            >{getLegAvg(currentPlayer.id).toFixed(1)}</span
                                        >
                                    </div>
                                {/if}
                                <div
                                    class="grid grid-cols-4 gap-1 text-center"
                                >
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            60+
                                        </div>
                                        <div
                                            class="font-mono font-medium text-sm"
                                            >{cs.count60Plus}</div
                                        >
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            100+
                                        </div>
                                        <div
                                            class="font-mono font-medium text-sm"
                                            >{cs.count100Plus}</div
                                        >
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            140+
                                        </div>
                                        <div
                                            class="font-mono font-medium text-sm"
                                            >{cs.count140Plus}</div
                                        >
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            180
                                        </div>
                                        <div
                                            class="font-mono font-bold text-sm text-amber-600 dark:text-amber-400"
                                            >{cs.count180}</div
                                        >
                                    </div>
                                </div>
                                {#if checkoutOptions.length > 0}
                                    <div
                                        class="pt-2 mt-1 border-t border-zinc-100 dark:border-white/5"
                                    >
                                        <div
                                            class="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-1.5"
                                        >
                                            Throw out — {currentPlayer.remainingScore}
                                        </div>
                                        <div class="space-y-1">
                                            {#each checkoutOptions.slice(0, 3) as opt}
                                                <div
                                                    class="text-sm font-mono text-emerald-600 dark:text-emerald-400"
                                                >
                                                    {opt.description}
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        </DoubleBezel>
                    {/if}
                        <PlayerPanel
                            player={p}
                            isActive={p.id === currentPlayer?.id}
                            allMatchTurns={allMatchTurns}
                            stats={computeMatchStats(getPlayerTurns(p.id))}
                            dartsThrown={getDartsThrown(p.id)}
                            condensed={isMultiGame}
                            large={matchState.players.length <= 4}
                            rank={playerRanks.get(p.id) ?? 0}
                            legDarts={legDarts}
                            legAvg={getLegAvg(p.id)}
                            next={isMultiGame
                                ? i === 1
                                : p.id !== currentPlayer?.id}
                            bind:showDeleteConfirm
                            onDeleteLastTurn={deleteLastTurn}
                        />
                    {/each}

                </div>
            {/if}

            <!-- ============================================ -->
            <!-- CENTER: Score Display + Input + Turn History  -->
            <!-- ============================================ -->
            <div class="md:col-span-6 order-3 md:order-none space-y-3">
                {#if activeTab === "board"}
                    <!-- Dartboard / Numpad Input -->
                    <DoubleBezel>
                        <div class="space-y-0">
                            {#if inputMode === "board"}
                                <div class="w-full">
                                    <Dartboard
                                        onHit={addDart}
                                        disabled={currentDarts.length >= 3}
                                    />
                                </div>
                            {:else}
                                <!-- Numpad Input -->
                                <div class="w-full px-1 py-2 space-y-2">
                                    <!-- Multiplier row -->
                                    <div class="flex gap-1.5">
                                        <button
                                            onclick={() => (numpadMultiplier = 1)}
                                            class="flex-1 rounded-md py-2 text-sm font-bold transition-colors text-white dark:text-zinc-900 {numpadMultiplier === 1 ? 'bg-zinc-800 dark:bg-white' : 'bg-zinc-200 dark:bg-white/20'}"
                                        >Single</button>
                                        <button
                                            onclick={() => (numpadMultiplier = 2)}
                                            class="flex-1 rounded-md py-2 text-sm font-bold transition-colors {numpadMultiplier === 2 ? 'bg-red-600 text-white' : 'bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-300'}"
                                        >Double</button>
                                        <button
                                            onclick={() => (numpadMultiplier = 3)}
                                            class="flex-1 rounded-md py-2 text-sm font-bold transition-colors {numpadMultiplier === 3 ? 'bg-green-600 text-white' : 'bg-green-200 text-green-800 dark:bg-green-900/40 dark:text-green-300'}"
                                        >Triple</button>
                                    </div>
                                    <!-- Number grid: 1-20 darts order -->
                                    <div class="grid grid-cols-5 gap-1.5">
                                        {#each [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5] as num}
                                            <button
                                                onclick={() => addDart(num, numpadMultiplier)}
                                                disabled={currentDarts.length >= 3}
                                                class="rounded-md py-2.5 text-sm font-mono font-bold transition-colors {numpadMultiplier === 1 ? 'bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-white/15' : numpadMultiplier === 2 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'} disabled:opacity-30 disabled:pointer-events-none"
                                            >{numpadMultiplier === 3 ? 'T' : numpadMultiplier === 2 ? 'D' : ''}{num}</button>
                                        {/each}
                                    </div>
                                    <!-- Bull & Miss row -->
                                    <div class="flex gap-1.5">
                                        <button
                                            onclick={() => addDart(25, numpadMultiplier === 1 ? 1 : numpadMultiplier)}
                                            disabled={numpadMultiplier === 3 || currentDarts.length >= 3}
                                            class="flex-1 rounded-md py-2.5 text-sm font-bold transition-colors bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50 disabled:opacity-30 disabled:pointer-events-none"
                                        >{numpadMultiplier === 2 ? 'Bull' : '25'}</button>
                                        <button
                                            onclick={() => addDart(0, 0 as Multiplier)}
                                            disabled={currentDarts.length >= 3}
                                            class="flex-1 rounded-md py-2.5 text-sm font-bold transition-colors bg-zinc-200 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none"
                                        >Miss</button>
                                    </div>
                                </div>
                            {/if}

                            <!-- Current Darts - 3 fixed slots + total -->
                            <div class="flex items-center justify-center gap-2 mt-2 mb-4 h-10">
                                <div class="flex items-center gap-2">
                                    {#each dartSlots as dart, i}
                                        {#if dart}
                                            <span
                                                class="inline-flex items-center rounded-[5px] text-xs font-mono bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 w-[6.5rem] h-8"
                                            >
                                                <span class="w-[75%] inline-flex items-center justify-center gap-1">
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
                                                        class="text-zinc-400 dark:text-zinc-500"
                                                        >({dart.score})</span
                                                    >
                                                </span>
                                                <span class="w-[25%] flex justify-center items-center">
                                                    <button
                                                        onclick={() => removeDartAt(i)}
                                                        class="flex items-center justify-center w-5 h-5 -ml-[1px] rounded-[3px] text-sm leading-none bg-red-600 text-white hover:bg-red-500 transition-colors touch-manipulation cursor-pointer"
                                                        aria-label="Remove dart"
                                                    ><span class="mt-[1px]">&times;</span></button>
                                                </span>
                                            </span>
                                        {:else if i === activeSlotIndex}
                                            <span
                                                class="inline-flex items-center justify-center rounded-[5px] px-2.5 py-1.5 text-xs font-mono border border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400 w-[6.5rem] h-8 animate-[pulse-bg_3s_ease-in-out_infinite] bg-zinc-100 dark:bg-white/5"
                                            >
                                                {i + 1}
                                            </span>
                                        {:else}
                                            <span
                                                class="inline-flex items-center justify-center rounded-[5px] px-2.5 py-1.5 text-xs font-mono border border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-400 dark:text-zinc-500 w-[6.5rem] h-8"
                                            >
                                                {i + 1}
                                            </span>
                                        {/if}
                                    {/each}
                                </div>
                                <div class="inline-flex items-center gap-1">
                                    <span class="inline-flex items-center justify-center rounded-[5px] w-[3.5rem] h-8 text-sm font-mono font-bold {currentDarts.length > 0 ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'border border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-400 dark:text-zinc-500'}">
                                        {currentDarts.length > 0 ? turnTotal : '='}
                                    </span>
                                    {#if currentDarts.length > 0}
                                        <button
                                            onclick={clearAllDarts}
                                            class="flex items-center justify-center w-8 h-8 rounded-[5px] bg-red-600 text-white hover:bg-red-500 transition-colors touch-manipulation cursor-pointer"
                                            aria-label="Clear all darts"
                                        >
                                            <IconTrash size={14} />
                                        </button>
                                    {:else}
                                        <span class="flex items-center justify-center w-8 h-8 rounded-[5px] bg-zinc-200 dark:bg-white/10 text-zinc-400 dark:text-zinc-500">
                                            <IconTrash size={14} />
                                        </span>
                                    {/if}
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex items-center justify-center gap-2">
                                {#if inputMode === "board"}
                                    <button
                                        onclick={() => addDart(0, 0 as Multiplier)}
                                        disabled={currentDarts.length >= 3}
                                        class="rounded px-3 py-1 text-xs font-bold bg-zinc-100 dark:bg-white/10 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                    >Miss</button
                                >
                                {/if}
                                <button
                                    onclick={removeLastDart}
                                    disabled={currentDarts.length === 0}
                                    class="rounded px-3 py-1 text-xs font-bold bg-zinc-100 dark:bg-white/10 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none transition-colors inline-flex items-center gap-1"
                                ><IconArrowBack size={12} /> Undo</button
                                >
                                <PillButton
                                    onclick={submitCurrentTurn}
                                    disabled={currentDarts.length === 0}
                                    size="sm"
                                >
                                    Submit ({currentDarts.length})
                                </PillButton>
                            </div>
                        </div>
                    </DoubleBezel>

                    <!-- Checkout Suggestions (shown in the left stats card for 3+ players) -->
                    {#if !isMultiGame && checkoutOptions.length > 0}
                        <DoubleBezel>
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
                {:else if activeTab === "turns"}
                    <!-- Turn History — Grouped by Set > Leg -->
                    <DoubleBezel>
                        <div class="mt-3 space-y-4">
                            {#each [...new Set(allTurnsWithLeg.map((t) => t.setNumber))].sort((a, b) => b - a) as setNum}
                                {@const setTurns = allTurnsWithLeg.filter(
                                    (t) => t.setNumber === setNum,
                                )}
                                {@const legsInSet = [
                                    ...new Set(
                                        setTurns.map((t) => t.legNumber),
                                    ),
                                ].sort((a, b) => b - a)}
                                <div>
                                    <div
                                        class="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2"
                                    >
                                        Set {setNum}
                                    </div>
                                    {#each legsInSet as legNum}
                                        {@const legTurns = setTurns.filter(
                                            (t) => t.legNumber === legNum,
                                        )}
                                        <div class="mb-3">
                                            <div
                                                class="text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5 pl-1"
                                            >
                                                Leg {legNum}
                                            </div>
                                            <table class="w-full text-sm">
                                                <thead>
                                                    <tr
                                                        class="text-[10px] uppercase tracking-wider text-zinc-400 border-b border-zinc-100 dark:border-white/5"
                                                    >
                                                        <th
                                                            class="text-left pb-2 pr-2"
                                                            >Player</th
                                                        >
                                                        <th
                                                            class="text-center pb-2 px-1"
                                                            >D1</th
                                                        >
                                                        <th
                                                            class="text-center pb-2 px-1"
                                                            >D2</th
                                                        >
                                                        <th
                                                            class="text-center pb-2 px-1"
                                                            >D3</th
                                                        >
                                                        <th
                                                            class="text-center pb-2 px-1"
                                                            >Tot</th
                                                        >
                                                        <th
                                                            class="text-right pb-2 pl-2"
                                                            >Left</th
                                                        >
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {#each [...legTurns].reverse() as turn}
                                                        {@const isCurrentPlayer =
                                                            turn.playerId ===
                                                            currentPlayer?.id}
                                                        {@const playerName =
                                                            matchState.players.find(
                                                                (p) =>
                                                                    p.id ===
                                                                    turn.playerId,
                                                            )?.name ?? "?"}
                                                        <tr
                                                            class="border-b border-zinc-50 dark:border-white/5 last:border-0 transition-colors {isCurrentPlayer
                                                                ? 'bg-emerald-50/60 dark:bg-emerald-500/5'
                                                                : ''}"
                                                        >
                                                            <td
                                                                class="py-1.5 pr-2"
                                                            >
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
                                                                >{formatDart(
                                                                    turn
                                                                        .darts[0],
                                                                )}</td
                                                            >
                                                            <td
                                                                class="py-1.5 px-1 text-center font-mono text-xs"
                                                                >{formatDart(
                                                                    turn
                                                                        .darts[1],
                                                                )}</td
                                                            >
                                                            <td
                                                                class="py-1.5 px-1 text-center font-mono text-xs"
                                                                >{formatDart(
                                                                    turn
                                                                        .darts[2],
                                                                )}</td
                                                            >
                                                            <td
                                                                class="py-1.5 px-1 text-center font-mono text-xs font-medium {turn.isBust
                                                                    ? 'text-red-500'
                                                                    : ''}"
                                                            >
                                                                {#if turn.isBust}
                                                                    <span
                                                                        class="text-red-500 text-[9px] font-bold"
                                                                        >BUST</span
                                                                    ><br />
                                                                {/if}
                                                                {turn.totalScore}
                                                            </td>
                                                            <td
                                                                class="py-1.5 pl-2 text-right font-mono text-xs font-medium"
                                                                >{turn.remainingScore}</td
                                                            >
                                                        </tr>
                                                    {/each}
                                                </tbody>
                                            </table>
                                        </div>
                                    {/each}
                                </div>
                            {/each}
                            {#if allTurnsWithLeg.length === 0}
                                <div
                                    class="text-zinc-400 text-center py-2 text-sm"
                                >
                                    No turns yet
                                </div>
                            {/if}
                        </div>
                    </DoubleBezel>
                {:else if activeTab === "stats"}
                    <!-- All stats for all players -->
                    <DoubleBezel>
                        <div class="mt-2">
                            <div
                                class="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2"
                            >
                                Match Stats
                            </div>
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm">
                                    <thead>
                                        <tr
                                            class="text-[10px] uppercase tracking-wider text-zinc-400 border-b border-zinc-100 dark:border-white/5"
                                        >
                                            <th class="text-left pb-2 pr-2"
                                                ><Tooltip
                                                    position="bottom"
                                                    delay={100}
                                                    content="Player (leading number = standings rank)"
                                                    >Player</Tooltip
                                                ></th
                                            >
                                            <th class="text-right pb-2 px-1"
                                                ><Tooltip
                                                    position="bottom"
                                                    delay={100}
                                                    content="Total darts thrown in the match"
                                                    >Darts</Tooltip
                                                ></th
                                            >
                                            <th class="text-right pb-2 px-1"
                                                ><Tooltip
                                                    position="bottom"
                                                    delay={100}
                                                    content="3-dart average — points scored per 3 darts"
                                                    >Avg</Tooltip
                                                ></th
                                            >
                                            <th class="text-right pb-2 px-1"
                                                ><Tooltip
                                                    position="bottom"
                                                    delay={100}
                                                    content="Checkout % — legs won vs. checkout attempts"
                                                    >CO%</Tooltip
                                                ></th
                                            >
                                            <th class="text-right pb-2 px-1"
                                                ><Tooltip
                                                    position="bottom"
                                                    delay={100}
                                                    content="Double conversion % — checkouts vs. darts thrown at a double"
                                                    >Dbl</Tooltip
                                                ></th
                                            >
                                            <th class="text-right pb-2 px-1"
                                                ><Tooltip
                                                    position="bottom"
                                                    delay={100}
                                                    content="Turns scoring 60 or more (busts excluded)"
                                                    >60+</Tooltip
                                                ></th
                                            >
                                            <th class="text-right pb-2 px-1"
                                                ><Tooltip
                                                    position="bottom"
                                                    delay={100}
                                                    content="Turns scoring 100 or more (busts excluded)"
                                                    >100+</Tooltip
                                                ></th
                                            >
                                            <th class="text-right pb-2 px-1"
                                                ><Tooltip
                                                    position="bottom"
                                                    delay={100}
                                                    content="Turns scoring 140 or more (busts excluded)"
                                                    >140+</Tooltip
                                                ></th
                                            >
                                            <th class="text-right pb-2 px-1"
                                                ><Tooltip
                                                    position="bottom"
                                                    delay={100}
                                                    content="Perfect 180 turns"
                                                    >180</Tooltip
                                                ></th
                                            >
                                            <th class="text-right pb-2 px-1"
                                                ><Tooltip
                                                    position="bottom"
                                                    delay={100}
                                                    content="Turns scoring under 20 (busts excluded)"
                                                    >&lt;20</Tooltip
                                                ></th
                                            >
                                            <th class="text-right pb-2 px-1"
                                                ><Tooltip
                                                    position="bottom"
                                                    delay={100}
                                                    content="Leg-winning checkouts of 60+"
                                                    >60+F</Tooltip
                                                ></th
                                            >
                                            <th class="text-right pb-2 px-1"
                                                ><Tooltip
                                                    position="bottom"
                                                    delay={100}
                                                    content="3-dart average over the last 3 turns"
                                                    >Last 3</Tooltip
                                                ></th
                                            >
                                            <th class="text-right pb-2 pl-2"
                                                ><Tooltip
                                                    position="bottom"
                                                    delay={100}
                                                    content="3-dart average over the previous turns (up to 15)"
                                                    >Prior</Tooltip
                                                ></th
                                            >
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each matchState.players as p (p.id)}
                                            {@const s = computeMatchStats(
                                                getPlayerTurns(p.id),
                                            )}
                                            {@const rank = playerRanks.get(p.id) ?? 0}
                                            <tr
                                                class="border-b border-zinc-50 dark:border-white/5 last:border-0"
                                            >
                                                <td class="py-2 pr-2">
                                                    <span
                                                        class="font-medium text-xs flex items-center gap-1.5"
                                                    >
                                                        {#if rank}
                                                            <span
                                                                class="text-zinc-400 font-mono text-[10px]"
                                                                >{rank}</span
                                                            >
                                                        {/if}
                                                        {p.name}
                                                    </span>
                                                </td>
                                                <td
                                                    class="py-2 px-1 text-right font-mono text-xs"
                                                    >{getDartsThrown(p.id)}</td
                                                >
                                                <td
                                                    class="py-2 px-1 text-right font-mono text-xs font-medium"
                                                    >{s.threeDartAvg.toFixed(1)}</td
                                                >
                                                <td
                                                    class="py-2 px-1 text-right font-mono text-xs"
                                                    >{s.checkoutPct.toFixed(0)}%</td
                                                >
                                                <td
                                                    class="py-2 px-1 text-right font-mono text-xs"
                                                    >{s.doubleConversion.toFixed(0)}%</td
                                                >
                                                <td
                                                    class="py-2 px-1 text-right font-mono text-xs"
                                                    >{s.count60Plus}</td
                                                >
                                                <td
                                                    class="py-2 px-1 text-right font-mono text-xs"
                                                    >{s.count100Plus}</td
                                                >
                                                <td
                                                    class="py-2 px-1 text-right font-mono text-xs"
                                                    >{s.count140Plus}</td
                                                >
                                                <td
                                                    class="py-2 px-1 text-right font-mono text-xs font-bold text-amber-600 dark:text-amber-400"
                                                    >{s.count180}</td
                                                >
                                                <td
                                                    class="py-2 px-1 text-right font-mono text-xs text-zinc-500"
                                                    >{s.countUnder20}</td
                                                >
                                                <td
                                                    class="py-2 px-1 text-right font-mono text-xs text-emerald-600 dark:text-emerald-400"
                                                    >{s.count60PlusFinishes}</td
                                                >
                                                <td
                                                    class="py-2 px-1 text-right font-mono text-xs"
                                                    >{s.last3Avg.toFixed(1)}</td
                                                >
                                                <td
                                                    class="py-2 pl-2 text-right font-mono text-xs text-zinc-500"
                                                    >{s.prior15Avg > 0
                                                        ? s.prior15Avg.toFixed(1)
                                                        : "—"}</td
                                                >
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </DoubleBezel>
                {:else if activeTab === "settings"}
                    <DoubleBezel>
                        <div class="space-y-6">
                            <div class="flex items-center gap-2 text-amber-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path
                                        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                                    />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                <h2 class="font-display font-bold text-lg">
                                    Settings
                                </h2>
                            </div>

                            <!-- Voice Selection -->
                            <div class="space-y-3">
                                <div
                                    class="flex items-center gap-2 text-zinc-400"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <polygon
                                            points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                                        />
                                        <path
                                            d="M15.54 8.46a5 5 0 0 1 0 7.07"
                                        />
                                        <path
                                            d="M19.07 4.93a10 10 0 0 1 0 14.14"
                                        />
                                    </svg>
                                    <span class="text-sm font-medium"
                                        >Caller Voice</span
                                    >
                                </div>
                                <p class="text-xs text-zinc-500">
                                    Change the announcer voice during the match.
                                    Tap the play button to preview.
                                </p>
                                <StyledSelect
                                    options={inGameVoiceOptions}
                                    bind:value={inGameVoiceId}
                                />
                            </div>
                        </div>
                    </DoubleBezel>
                {/if}
            </div>

            <!-- ============================================ -->
            <!-- RIGHT: Player scoreboards (second half)      -->
            <!-- ============================================ -->
            {#if rightPlayers.length > 0}
                <div class="md:col-span-3 order-2 md:order-none space-y-3">
                    {#each rightPlayers as p, i (p.id)}
                        {@const legDarts = matchState.currentLeg.turns
                            .filter((t) => t.playerId === p.id)
                            .reduce((sum, t) => sum + t.dartsThrown, 0)}
                        <PlayerPanel
                            player={p}
                            isActive={p.id === currentPlayer?.id}
                            allMatchTurns={allMatchTurns}
                            stats={computeMatchStats(getPlayerTurns(p.id))}
                            dartsThrown={getDartsThrown(p.id)}
                            condensed={isMultiGame}
                            large={matchState.players.length <= 4}
                            rank={playerRanks.get(p.id) ?? 0}
                            legDarts={legDarts}
                            legAvg={getLegAvg(p.id)}
                            next={!isMultiGame && p.id !== currentPlayer?.id}
                            bind:showDeleteConfirm
                            onDeleteLastTurn={deleteLastTurn}
                        />
                    {/each}
                </div>
            {/if}

            {#if isSoloGame}
                {@const sp = matchState.players[0]}
                {@const spStats = computeMatchStats(getPlayerTurns(sp.id))}
                {@const spDarts = getDartsThrown(sp.id)}
                <div
                    class="md:col-span-3 order-2 md:order-none space-y-3 opacity-25 pointer-events-none select-none"
                >
                    <!-- Muted mirror: Scoreboard -->
                    <DoubleBezel>
                        <div class="text-center">
                            <div
                                class="font-display font-black text-8xl tracking-tight leading-none"
                            >
                                <AnimatedNumber value={sp.remainingScore} />
                            </div>
                            <div class="mt-2 font-medium text-sm">
                                {sp.name}
                            </div>
                            <div
                                class="mt-2 flex justify-center gap-4 text-xs font-mono text-zinc-400"
                            >
                                <span
                                    >Sets
                                    <span
                                        class="font-bold text-sm text-zinc-700 dark:text-zinc-300"
                                        >{sp.setsWon}</span
                                    ></span
                                >
                                <span
                                    >Legs
                                    <span
                                        class="font-bold text-sm text-zinc-700 dark:text-zinc-300"
                                        >{sp.legsWon}</span
                                    ></span
                                >
                            </div>
                            <div
                                class="mt-1.5 flex justify-center gap-3 text-[10px] text-zinc-400"
                            >
                                <span
                                    >Darts
                                    <span class="font-mono font-medium"
                                        >{spDarts}</span
                                    ></span
                                >
                                <span
                                    >Avg
                                    <span class="font-mono font-medium"
                                        >{spStats.threeDartAvg.toFixed(1)}</span
                                    ></span
                                >
                            </div>
                        </div>
                    </DoubleBezel>

                    <!-- Muted mirror: Stats -->
                    <!-- Solo Player Stats -->
                    <DoubleBezel>
                        <div class="space-y-1.5 mt-2">
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-zinc-400"
                                    >3-Dart Avg</span
                                >
                                <span class="text-sm font-mono font-medium"
                                    >{spStats.threeDartAvg.toFixed(1)}</span
                                >
                            </div>
                            <a
                                href="/players/{sp.id}/checkout"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="flex justify-between items-center group -mx-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                                title="View checkout breakdown"
                            >
                                <span
                                    class="text-xs text-zinc-400 flex items-center gap-1"
                                    >Double Conv.
                                    <IconExternalLink
                                        size={10}
                                        class="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500"
                                    />
                                </span>
                                <span
                                    class="text-sm font-mono font-medium group-hover:text-blue-400 transition-colors"
                                >
                                    {spStats.doubleConversion.toFixed(0)}%
                                </span>
                            </a>

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
                                            {spStats.count60Plus}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            100+
                                        </div>
                                        <div
                                            class="font-mono font-medium text-sm"
                                        >
                                            {spStats.count100Plus}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            140+
                                        </div>
                                        <div
                                            class="font-mono font-medium text-sm"
                                        >
                                            {spStats.count140Plus}
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
                                            {spStats.countUnder20}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            180
                                        </div>
                                        <div
                                            class="font-mono font-bold text-sm text-amber-600 dark:text-amber-400"
                                        >
                                            {spStats.count180}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-zinc-400">
                                            60+ Fin
                                        </div>
                                        <div
                                            class="font-mono font-medium text-sm text-emerald-600 dark:text-emerald-400"
                                        >
                                            {spStats.count60PlusFinishes}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Avg Trend -->
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
                                            >{spStats.last3Avg.toFixed(1)}</span
                                        >
                                        {#if spStats.prior15Avg > 0}
                                            {#if spStats.last3Avg > spStats.prior15Avg}
                                                <IconArrowUp
                                                    size={14}
                                                    class="text-emerald-500"
                                                />
                                            {:else if spStats.last3Avg < spStats.prior15Avg}
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
                                        >{spStats.prior15Avg > 0
                                            ? spStats.prior15Avg.toFixed(1)
                                            : "—"}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </DoubleBezel>

                    <!-- Muted mirror: Last 3 Turns -->
                    <DoubleBezel>
                        <div class="mt-2 space-y-1.5">
                            {#each [...allMatchTurns]
                                .filter((t) => t.playerId === sp.id)
                                .slice(-3)
                                .reverse() as turn}
                                <div
                                    class="flex items-center justify-between gap-1.5 text-xs"
                                >
                                    <div
                                        class="flex items-center gap-1 font-mono"
                                    >
                                        {#each turn.darts as dart}
                                            <span
                                                class="rounded px-1.5 py-0.5 bg-zinc-100 dark:bg-white/10"
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
                                            </span>
                                        {/each}
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="font-mono font-medium">
                                            {turn.totalScore}
                                        </span>
                                        <span class="text-zinc-400"
                                            >→ {turn.remainingScore}</span
                                        >
                                    </div>
                                </div>
                            {/each}
                            {#if allMatchTurns.filter((t) => t.playerId === sp.id).length === 0}
                                <div
                                    class="text-zinc-400 text-center py-1 text-xs"
                                >
                                    No turns yet
                                </div>
                            {/if}
                        </div>
                    </DoubleBezel>
                </div>
            {/if}
        </div>
    </div>
{/if}
