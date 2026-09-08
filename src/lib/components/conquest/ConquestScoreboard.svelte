<script lang="ts">
    import type { ConquestState } from "$lib/game/conquest-engine";
    import {
        CONTINENTS,
        CONTINENT_NAMES,
        territoriesOf,
        continentCounts,
        scoreOf,
    } from "$lib/game/conquest-engine";

    let {
        state,
        players,
    }: {
        state: ConquestState;
        players: { id: string; name: string; initials: string; color: string }[];
    } = $props();

    const activeId = $derived(
        state.phase === 'turn' || state.phase === 'resurrect_pick' || state.phase === 'duel_pick'
            ? state.players[state.activeSeat].id
            : state.phase === 'duel_save'
              ? state.pendingDuel!.defender
              : state.phase === 'tiebreak'
                ? state.tiebreak!.participants[state.tiebreak!.activeIndex]
                : null,
    );
</script>

<div class="space-y-2">
    {#each state.players as p (p.id)}
        {@const meta = players.find((m) => m.id === p.id)!}
        {@const lands = territoriesOf(state, p.id)}
        {@const cc = continentCounts(state, p.id)}
        {@const active = activeId === p.id}
        {@const remaining = state.preset - p.dartsThrown}
        <div
            class="rounded-xl px-3 py-2.5 ring-1 transition-all duration-300 {p.dead
                ? 'bg-zinc-50 dark:bg-white/5 ring-black/5 dark:ring-white/5 opacity-60'
                : active
                  ? 'bg-white dark:bg-white/10 ring-black/10 dark:ring-white/20 shadow-md'
                  : 'bg-white/60 dark:bg-white/5 ring-black/5 dark:ring-white/10'}"
        >
            <div class="flex items-center gap-2">
                <span
                    class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white shrink-0"
                    style="background:{meta.color}"
                >
                    {meta.initials}
                </span>
                <span class="font-semibold text-sm truncate">{p.name}</span>
                {#if active}
                    <span class="text-[10px] uppercase tracking-wide font-bold text-zinc-400">
                        {state.phase === 'duel_save' ? 'defending' : 'throwing'}
                    </span>
                {/if}
                {#if p.bonusDarts > 0}
                    <span class="text-xs" title="Shanghai bonus dart next visit">🔥</span>
                {/if}
                {#if p.dead}
                    <span
                        class="text-[10px] uppercase tracking-wide font-bold rounded-full px-2 py-0.5 bg-zinc-200 dark:bg-white/10 text-zinc-600 dark:text-zinc-400"
                        >dead — altar</span
                    >
                {/if}
                <span class="ml-auto font-display font-extrabold text-lg tabular-nums"
                    >{scoreOf(state, p.id)}</span
                >
            </div>

            <div class="mt-1.5 flex items-center gap-3 text-xs text-zinc-400">
                <span title="territories">🏰 {lands.length}</span>
                <span title="darts thrown / remaining"
                    >🎯 {p.dartsThrown}/{remaining}</span
                >
                <span class="flex gap-1 ml-auto" title="continent progress">
                    {#each CONTINENTS as members, ci (ci)}
                        {@const owned = members.filter((n) => state.territories[n].owner === p.id).length}
                        <span
                            class="w-2 h-2 rounded-full {owned === members.length
                                ? 'ring-2 ring-offset-1 ring-zinc-400 dark:ring-zinc-300'
                                : ''}"
                            style="background:{owned > 0 ? ['#FFB703', '#8ECAE6', '#BB3E03', '#219EBC', '#126782', '#3A6787'][ci] : 'currentColor'}; opacity:{owned === 0 ? 0.25 : 1}"
                            title="{CONTINENT_NAMES[ci]}: {owned}/{members.length}"
                        ></span>
                    {/each}
                </span>
            </div>
        </div>
    {/each}
</div>
