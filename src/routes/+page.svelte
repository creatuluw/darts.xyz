<script lang="ts">
    import { DoubleBezel, PillButton, EyebrowTag } from "$lib/components/ui";
    import {
        IconTarget,
        IconChartBar,
        IconArrowRight,
    } from "@tabler/icons-svelte";
</script>

<svelte:head>
    <title>Darts.xyz — Score Your Game</title>
</svelte:head>

<div
    class="flex flex-col items-center justify-center min-h-[80dvh] text-center"
>
    <EyebrowTag>Darts Scoring App</EyebrowTag>

    <h1
        class="font-display font-black text-7xl md:text-8xl lg:text-9xl tracking-tight mt-6 mb-4"
    >
        DARTS
    </h1>

    <p
        class="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl max-w-md mb-12"
    >
        Track every leg. Every set. Every 180. Score your matches with
        precision.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
        <a href="/match/setup">
            <DoubleBezel
                class="cursor-pointer hover:scale-[1.02] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
                <div class="text-center py-4">
                    <div
                        class="mb-2 text-zinc-600 dark:text-zinc-300 flex justify-center"
                    >
                        <IconTarget size={32} stroke={1.5} />
                    </div>
                    <div class="font-display font-bold text-xl">New Match</div>
                    <div class="text-zinc-400 text-sm mt-1">Start scoring</div>
                </div>
            </DoubleBezel>
        </a>

        <a href="/players">
            <DoubleBezel
                class="cursor-pointer hover:scale-[1.02] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
                <div class="text-center py-4">
                    <div
                        class="mb-2 text-zinc-600 dark:text-zinc-300 flex justify-center"
                    >
                        <IconChartBar size={32} stroke={1.5} />
                    </div>
                    <div class="font-display font-bold text-xl">Players</div>
                    <div class="text-zinc-400 text-sm mt-1">View stats</div>
                </div>
            </DoubleBezel>
        </a>
    </div>

    <div class="mt-12">
        <a
            href="/history"
            class="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-500 inline-flex items-center gap-1"
        >
            View Match History <IconArrowRight size={16} />
        </a>
    </div>
</div>
