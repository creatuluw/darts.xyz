<script lang="ts">
    import {
        DoubleBezel,
        PillButton,
        EyebrowTag,
        StyledSelect,
    } from "$lib/components/ui";
    import { IconTarget, IconChartBar } from "@tabler/icons-svelte";
    import ThemeSwitcher from "$lib/components/ui/ThemeSwitcher.svelte";
    import { voiceSettings, VOICE_OPTIONS } from "$lib/stores/voice-settings";
    import { addToast } from "$lib/stores/toast";

    let selectedVoiceId = $state("jack");

    // Sync store → local state and local state → store
    $effect(() => {
        const unsubscribe = voiceSettings.subscribe((value) => {
            selectedVoiceId = value;
        });
        return unsubscribe;
    });

    // When local state changes (via dropdown), persist to store and show toast
    $effect(() => {
        if (selectedVoiceId) {
            voiceSettings.set(selectedVoiceId);
            const voice = VOICE_OPTIONS.find((v) => v.id === selectedVoiceId);
            if (voice) {
                addToast(`Caller voice changed to ${voice.name}`, "success");
            }
        }
    });

    let voiceOptions = VOICE_OPTIONS.map((v) => ({
        value: v.id,
        label: v.name,
        previewSrc: `/audio/${v.prefix}score-26.mp3`,
    }));
</script>

<svelte:head>
    <title>dart.monster</title>
</svelte:head>

<div
    class="flex flex-col items-center justify-center min-h-[80dvh] text-center"
>
    <EyebrowTag>Darts Scoring App</EyebrowTag>

    <h1
        class="font-display font-black text-7xl md:text-8xl lg:text-7xl tracking-tight mt-6 mb-4"
    >
        dart.monster
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

    <!-- Voice Selection -->
    <DoubleBezel class="mt-12 w-full max-w-sm">
        <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 text-zinc-400">
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
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
                <span class="text-sm">Caller Voice</span>
            </div>
            <div class="flex-1">
                <StyledSelect
                    options={voiceOptions}
                    bind:value={selectedVoiceId}
                />
            </div>
        </div>
    </DoubleBezel>
</div>

<ThemeSwitcher />
