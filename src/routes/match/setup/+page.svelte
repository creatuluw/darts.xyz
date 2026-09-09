<script lang="ts">
    import { onMount } from "svelte";
    import { goto, replaceState } from "$app/navigation";
    import { page } from "$app/stores";
    import { IconArrowLeft } from "@tabler/icons-svelte";
    import { DoubleBezel, PillButton } from "$lib/components/ui";
    import SearchSelect from "$lib/components/ui/SearchSelect.svelte";
    import { emailStore } from "$lib/stores/email";
    import {
        CONQUEST_PRESETS,
        CONQUEST_DEFAULT_PRESET,
        CONQUEST_MIN_PLAYERS,
        estimateDuration,
        validateConquestSetup,
    } from "$lib/game/conquest-setup";
    import {
        RISK_CLOCK_PRESETS,
        RISK_DEFAULT_MODE,
        estimateRiskDuration,
        validateRiskSetup,
    } from "$lib/game/risk-setup";

    let players = $state<any[]>([]);
    let selectedPlayers = $state<any[]>([]);
    let startingScore = $state(501);
    let legsPerSet = $state(3);
    let setsPerMatch = $state(1);
    let doubleIn = $state(false);
    let loading = $state(true);
    let starting = $state(false);

    // Tabs: match (classic x01) | fun (Trebles & Territories)
    let tab = $state<"match" | "fun">("match");

    // Conquest setup
    let conquestMode = $state<"clock" | "domination">("clock");
    let conquestPreset = $state(CONQUEST_DEFAULT_PRESET);
    // Fun-tab game format picker: Trebles & Territories | Risk 42
    let funGame = $state<"tnt" | "risk42">("tnt");
    let riskMode = $state<"domination" | "clock">(RISK_DEFAULT_MODE);
    let riskPreset = $state<(typeof RISK_CLOCK_PRESETS)[number]>(301);

    const conquestErrors = $derived(
        tab === "fun" ? validateConquestSetup(selectedPlayers) : [],
    );
    const riskErrors = $derived(
        tab === "fun" && funGame === "risk42"
            ? validateRiskSetup({ players: selectedPlayers, mode: riskMode, clockPreset: riskPreset })
            : [],
    );
    const riskEstimate = $derived(
        estimateRiskDuration({
            mode: riskMode,
            clockPreset: riskPreset,
            players: Math.max(selectedPlayers.length, 2),
        }),
    );
    const estimate = $derived(
        estimateDuration(
            conquestPreset,
            Math.max(selectedPlayers.length, CONQUEST_MIN_PLAYERS),
        ),
    );

    onMount(async () => {
        if ($page.url.searchParams.get("tab") === "fun") tab = "fun";

        const accountId = emailStore.getEmail();
        const res = await fetch(
            `/api/players?accountId=${encodeURIComponent(accountId)}&sortBy=recent`,
        );
        players = await res.json();
        loading = false;
    });

    function switchTab(next: "match" | "fun") {
        tab = next;
        const url = new URL($page.url);
        if (next === "fun") url.searchParams.set("tab", "fun");
        else url.searchParams.delete("tab");
        replaceState(url, $page.state ?? {});
    }

    function handlePlayerSelect(
        event: CustomEvent<{ id: string; name: string }[]>,
    ) {
        selectedPlayers = event.detail;
    }

    function shuffleSeats() {
        const seats = [...selectedPlayers];
        for (let i = seats.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [seats[i], seats[j]] = [seats[j], seats[i]];
        }
        selectedPlayers = seats;
    }

    function startConquest() {
        if (conquestErrors.length) return;
        sessionStorage.setItem(
            "conquest_setup",
            JSON.stringify({
                mode: conquestMode,
                preset: conquestPreset,
                players: selectedPlayers.map((p) => ({ id: p.id, name: p.name })),
            }),
        );
        sessionStorage.removeItem("conquest_state");
        goto("/match/conquest");
    }

    function startRisk() {
        if (riskErrors.length) return;
        sessionStorage.setItem(
            "risk42_setup",
            JSON.stringify({
                mode: riskMode,
                clockPreset: riskMode === "clock" ? riskPreset : undefined,
                players: selectedPlayers.map((p) => ({ id: p.id, name: p.name })),
            }),
        );
        sessionStorage.removeItem("risk42_state");
        goto("/match/risk");
    }

    async function startMatch() {
        if (selectedPlayers.length < 1) return;
        starting = true;

        const accountId = emailStore.getEmail();
        const res = await fetch("/api/matches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: accountId,
                startingScore,
                legsPerSet,
                setsPerMatch,
                doubleIn,
                players: selectedPlayers,
            }),
        });

        const data = await res.json();
        goto(`/match/${data.match.id}`);
    }

    const scoreOptions = [301, 501, 701, 1001];
    const legsOptions = [1, 3, 5, 7];
    const setsOptions = [1, 3, 5, 7];
</script>

<svelte:head>
    <title>New Match — dart.monster</title>
</svelte:head>

<div class="py-8">
    <h1 class="font-display font-extrabold text-3xl md:text-4xl mb-6">
        New Match
    </h1>

    <!-- Mode tabs -->
    <div
        class="inline-flex gap-1 rounded-full bg-zinc-100 dark:bg-white/10 ring-1 ring-black/6 dark:ring-white/10 p-1 mb-6"
    >
        <button
            onclick={() => switchTab("match")}
            aria-pressed={tab === "match"}
            class="rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-300 {tab ===
            'match'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'text-zinc-600 dark:text-zinc-400'}"
        >
            Match
        </button>
        <button
            onclick={() => switchTab("fun")}
            aria-pressed={tab === "fun"}
            class="rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-300 {tab ===
            'fun'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'text-zinc-600 dark:text-zinc-400'}"
        >
            Fun
        </button>
    </div>

    {#if tab === "fun"}
        <p class="text-zinc-400 text-sm mb-6 -mt-3">
            Pick a game — territories, darts and dice.
        </p>
    {/if}

    <!-- Step 1: Select Players (shared) -->
    <DoubleBezel class="mb-4">
        <div class="flex items-center justify-between mb-3">
            <h2 class="font-display font-bold text-lg">
                Players
                <span class="text-zinc-400 font-normal text-sm"
                    >({selectedPlayers.length}/6)</span
                >
            </h2>
            <div class="flex items-center gap-3">
                {#if selectedPlayers.length > 0}
                    <span class="text-xs text-zinc-400"
                        >{tab === "fun" ? "Seat" : "Throw"} order:
                        {selectedPlayers.map((p) => p.name).join(" → ")}</span
                    >
                {/if}
                {#if tab === "fun" && selectedPlayers.length > 1}
                    <button
                        onclick={shuffleSeats}
                        class="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors ring-1 ring-black/10 dark:ring-white/15 rounded-full px-3 py-1"
                    >
                        Shuffle seats
                    </button>
                {/if}
            </div>
        </div>

        {#if loading}
            <div class="text-zinc-400 text-center py-3">Loading players...</div>
        {:else if players.length === 0}
            <div class="text-center py-3">
                <p class="text-zinc-400 text-sm mb-2">
                    No players yet. Create one first!
                </p>
                <a href="/players"
                    ><PillButton variant="secondary">Go to Players</PillButton
                    ></a
                >
            </div>
        {:else}
            <SearchSelect
                options={players}
                bind:selected={selectedPlayers}
                placeholder="Search players to add..."
                maxSelected={6}
            />
        {/if}
    </DoubleBezel>

    {#if tab === "match"}
        <!-- Step 2: Configure (classic x01) -->
        <DoubleBezel class="mb-4">
            <h2 class="font-display font-bold text-lg mb-4">Match Format</h2>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                    <p
                        class="text-xs text-zinc-400 uppercase tracking-wider mb-2"
                    >
                        Starting Score
                    </p>
                    <div class="flex gap-1.5 flex-wrap">
                        {#each scoreOptions as opt}
                            <button
                                onclick={() => (startingScore = opt)}
                                class="rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 {startingScore ===
                                opt
                                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                    : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 ring-1 ring-black/6 dark:ring-white/10'}"
                            >
                                {opt}
                            </button>
                        {/each}
                    </div>
                </div>

                <div>
                    <p
                        class="text-xs text-zinc-400 uppercase tracking-wider mb-2"
                    >
                        Legs per Set
                    </p>
                    <div class="flex gap-1.5 flex-wrap">
                        {#each legsOptions as opt}
                            <button
                                onclick={() => (legsPerSet = opt)}
                                class="rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 {legsPerSet ===
                                opt
                                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                    : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 ring-1 ring-black/6 dark:ring-white/10'}"
                            >
                                {opt}
                            </button>
                        {/each}
                    </div>
                </div>

                <div>
                    <p
                        class="text-xs text-zinc-400 uppercase tracking-wider mb-2"
                    >
                        Sets per Match
                    </p>
                    <div class="flex gap-1.5 flex-wrap">
                        {#each setsOptions as opt}
                            <button
                                onclick={() => (setsPerMatch = opt)}
                                class="rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 {setsPerMatch ===
                                opt
                                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                    : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 ring-1 ring-black/6 dark:ring-white/10'}"
                            >
                                {opt}
                            </button>
                        {/each}
                    </div>
                </div>

                <div>
                    <p
                        class="text-xs text-zinc-400 uppercase tracking-wider mb-2"
                    >
                        Double-in
                    </p>
                    <button
                        onclick={() => (doubleIn = !doubleIn)}
                        role="switch"
                        aria-checked={doubleIn}
                        aria-label="Toggle double-in rule"
                        class="w-11 h-6 rounded-full transition-all duration-300 {doubleIn
                            ? 'bg-emerald-500'
                            : 'bg-zinc-200 dark:bg-white/10'}"
                    >
                        <div
                            class="w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-300 {doubleIn
                                ? 'translate-x-6'
                                : 'translate-x-1'}"
                        ></div>
                    </button>
                </div>
            </div>

            <!-- Start Match Button -->
            <div class="mt-5 flex justify-end">
                <PillButton
                    onclick={startMatch}
                    disabled={selectedPlayers.length < 1 || starting}
                >
                    {starting ? "Starting..." : "Start Match"}
                </PillButton>
            </div>
            {#if selectedPlayers.length < 1}
                <p class="text-zinc-400 text-xs mt-1.5 text-right">
                    Select at least 1 player
                </p>
            {/if}
        </DoubleBezel>
    {:else}
        <!-- Step 2: Configure (Fun games) -->
        <DoubleBezel class="mb-4">
            <h2 class="font-display font-bold text-lg mb-4">Game Format</h2>
            <div class="grid grid-cols-2 gap-3 mb-6">
                <button
                    onclick={() => (funGame = "tnt")}
                    aria-pressed={funGame === "tnt"}
                    class="text-left rounded-xl p-4 ring-1 transition-all {funGame ===
                    'tnt'
                        ? 'ring-zinc-900 dark:ring-white bg-zinc-100 dark:bg-white/10'
                        : 'ring-black/10 dark:ring-white/15'}"
                >
                    <p class="font-bold">Trebles &amp; Territories</p>
                    <p class="text-xs text-zinc-400 mt-1">Sprint — 20 wedges, treble-founding, clock by default</p>
                </button>
                <button
                    onclick={() => (funGame = "risk42")}
                    aria-pressed={funGame === "risk42"}
                    class="text-left rounded-xl p-4 ring-1 transition-all {funGame ===
                    'risk42'
                        ? 'ring-zinc-900 dark:ring-white bg-zinc-100 dark:bg-white/10'
                        : 'ring-black/10 dark:ring-white/15'}"
                >
                    <p class="font-bold">Risk 42</p>
                    <p class="text-xs text-zinc-400 mt-1">Marathon — 40 territories, armies, Arsenal at the bull</p>
                </button>
            </div>

            {#if funGame === "tnt"}
            <h2 class="font-display font-bold text-lg mb-4">Conquest Format</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <p
                        class="text-xs text-zinc-400 uppercase tracking-wider mb-2"
                    >
                        Win Condition
                    </p>
                    <div class="flex gap-1.5 flex-wrap">
                        <button
                            onclick={() => (conquestMode = "clock")}
                            aria-pressed={conquestMode === "clock"}
                            class="rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 {conquestMode ===
                            'clock'
                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 ring-1 ring-black/6 dark:ring-white/10'}"
                        >
                            Clock
                        </button>
                        <button
                            onclick={() => (conquestMode = "domination")}
                            aria-pressed={conquestMode === "domination"}
                            class="rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 {conquestMode ===
                            'domination'
                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 ring-1 ring-black/6 dark:ring-white/10'}"
                        >
                            Domination
                        </button>
                    </div>
                    <p class="text-xs text-zinc-400 mt-2">
                        {conquestMode === "clock"
                            ? "Fixed dart budget each — most points at the final dart wins. Points: 1 per territory, +2 per complete continent."
                            : "First to hold 7 territories — or any full continent — wins instantly."}
                    </p>
                </div>

                <div>
                    <p
                        class="text-xs text-zinc-400 uppercase tracking-wider mb-2"
                    >
                        Darts per Player
                    </p>
                    <div class="flex gap-1.5 flex-wrap max-h-28 overflow-y-auto pr-1">
                        {#each CONQUEST_PRESETS as opt}
                            <button
                                onclick={() => (conquestPreset = opt)}
                                aria-pressed={conquestPreset === opt}
                                class="rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-300 {conquestPreset ===
                                opt
                                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                    : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 ring-1 ring-black/6 dark:ring-white/10'}"
                            >
                                {opt}
                            </button>
                        {/each}
                    </div>
                </div>
            </div>

            <div
                class="flex flex-col md:flex-row md:items-end md:justify-between gap-3 border-t border-black/6 dark:border-white/10 pt-4"
            >
                <p class="text-sm text-zinc-500 dark:text-zinc-400">
                    Estimated match time:
                    <span class="font-semibold text-zinc-900 dark:text-white"
                        >{estimate}</span
                    >
                    <span class="text-zinc-400 text-xs"
                        >({Math.max(
                            selectedPlayers.length,
                            CONQUEST_MIN_PLAYERS,
                        )}
                        players, ~30s per turn) — long wars can be resumed any
                        night</span
                    >
                </p>

                <div class="flex flex-col items-end">
                    <PillButton onclick={startConquest} disabled={conquestErrors.length > 0}
                        >Start Conquest</PillButton
                    >
                    <p class="text-zinc-400 text-xs mt-1.5 text-right">
                        {#if conquestErrors.length}
                            {conquestErrors[0]}
                        {:else}
                            Blank board — treble a wedge to found your kingdom
                        {/if}
                    </p>
                </div>
            </div>
            {:else}
            <!-- Risk 42 -->
            <h2 class="font-display font-bold text-lg mb-4">Risk Format</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <p class="text-xs text-zinc-400 uppercase tracking-wider mb-2">Win Condition</p>
                    <div class="flex gap-1.5 flex-wrap">
                        <button
                            onclick={() => (riskMode = "domination")}
                            aria-pressed={riskMode === "domination"}
                            class="rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 {riskMode ===
                            'domination'
                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 ring-1 ring-black/6 dark:ring-white/10'}"
                        >
                            Domination
                        </button>
                        <button
                            onclick={() => (riskMode = "clock")}
                            aria-pressed={riskMode === "clock"}
                            class="rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 {riskMode ===
                            'clock'
                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 ring-1 ring-black/6 dark:ring-white/10'}"
                        >
                            Clock
                        </button>
                    </div>
                    <p class="text-xs text-zinc-400 mt-2">
                        {riskMode === "domination"
                            ? "Hold all 40 territories to win. The table deals, the shuffle decides, exiles claw back."
                            : "Equal turns each — 1 pt per territory, continents pay bonus points. Nearest bull breaks ties."}
                    </p>
                </div>
                {#if riskMode === "clock"}
                <div>
                    <p class="text-xs text-zinc-400 uppercase tracking-wider mb-2">Clock Length</p>
                    <div class="flex gap-1.5 flex-wrap">
                        {#each RISK_CLOCK_PRESETS as opt}
                            <button
                                onclick={() => (riskPreset = opt)}
                                aria-pressed={riskPreset === opt}
                                class="rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 {riskPreset ===
                                opt
                                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                    : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 ring-1 ring-black/6 dark:ring-white/10'}"
                            >
                                {opt}
                            </button>
                        {/each}
                    </div>
                </div>
                {/if}
            </div>
            <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-3 border-t border-black/6 dark:border-white/10 pt-4">
                <p class="text-sm text-zinc-500 dark:text-zinc-400">
                    Estimated match time:
                    <span class="font-semibold text-zinc-900 dark:text-white">{riskEstimate}</span>
                    <span class="text-zinc-400 text-xs">({Math.max(selectedPlayers.length, 2)} players — 40 territories dealt at random, 2 armies each)</span>
                </p>
                <div class="flex flex-col items-end">
                    <PillButton onclick={startRisk} disabled={riskErrors.length > 0}>Start Risk</PillButton>
                    <p class="text-zinc-400 text-xs mt-1.5 text-right">
                        {#if riskErrors.length}
                            {riskErrors[0]}
                        {:else}
                            Darts are the dice — trebles feed the homeland
                        {/if}
                    </p>
                </div>
            </div>
            {/if}
        </DoubleBezel>
    {/if}
</div>
