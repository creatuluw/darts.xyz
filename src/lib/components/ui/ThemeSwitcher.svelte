<script lang="ts">
    import { IconPalette, IconCheck } from "@tabler/icons-svelte";
    import { themeStore } from "$lib/stores/theme";

    type ThemeOption = {
        name: string;
        label: string;
        fonts: string;
        swatches: string[];
    };

    const themes: ThemeOption[] = [
        {
            name: "focus",
            label: "Focus",
            fonts: "Bricolage Grotesque · Lekton",
            swatches: ["#F4F2EE", "#0A0A0A", "#3A9434"],
        },
        {
            name: "coastal",
            label: "Coastal",
            fonts: "Space Grotesk · DM Sans",
            swatches: ["#2B2D42", "#8D99AE", "#EDF2F4", "#EF233C", "#D90429"],
        },
        {
            name: "ogee",
            label: "Ogee",
            fonts: "Caveat · JetBrains Mono",
            swatches: ["#252E41", "#BAAB97", "#E08380", "#A0CDD9", "#F0F9F9"],
        },
    ];

    let showMenu = $state(false);
    let currentTheme = $state("focus");

    $effect(() => {
        const unsub = themeStore.subscribe((t) => {
            currentTheme = t;
        });
        return unsub;
    });

    function toggleMenu() {
        showMenu = !showMenu;
    }

    function selectTheme(name: string) {
        themeStore.setTheme(name as any);
        showMenu = false;
    }

    function handleClickOutside(e: MouseEvent) {
        if (showMenu) {
            const target = e.target as HTMLElement;
            if (!target.closest("[data-theme-switcher]")) {
                showMenu = false;
            }
        }
    }
</script>

<svelte:window onclick={handleClickOutside} />

<div class="fixed bottom-5 right-5 z-40" data-theme-switcher>
    {#if showMenu}
        <div
            class="absolute bottom-full right-0 mb-2 w-64 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl ring-1 ring-black/6 dark:ring-white/10 shadow-xl shadow-black/8 p-2 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        >
            <p
                class="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 font-medium"
            >
                Theme
            </p>
            {#each themes as theme}
                <button
                    onclick={() => selectTheme(theme.name)}
                    class="w-full px-3 py-2.5 flex items-center gap-3 rounded-xl text-sm text-left transition-colors duration-200 hover:bg-zinc-50 dark:hover:bg-white/5 cursor-pointer {currentTheme === theme.name ? 'bg-zinc-50 dark:bg-white/5' : ''}"
                >
                    <div class="flex gap-1 flex-shrink-0">
                        {#each theme.swatches as color}
                            <div
                                class="w-3.5 h-3.5 rounded-full ring-1 ring-black/10 dark:ring-white/10"
                                style="background-color: {color}"
                            ></div>
                        {/each}
                    </div>
                    <div class="min-w-0 flex-1">
                        <span class="font-medium">{theme.label}</span>
                        <span class="block text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5"
                            >{theme.fonts}</span
                        >
                    </div>
                    {#if currentTheme === theme.name}
                        <IconCheck size={16} class="text-emerald-500 flex-shrink-0" />
                    {/if}
                </button>
            {/each}
        </div>
    {/if}

    <button
        onclick={toggleMenu}
        class="w-11 h-11 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl ring-1 ring-black/6 dark:ring-white/10 shadow-lg shadow-black/4 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 cursor-pointer {showMenu ? 'rotate-180' : ''}"
    >
        <IconPalette size={20} class="text-zinc-600 dark:text-zinc-400" />
    </button>
</div>
