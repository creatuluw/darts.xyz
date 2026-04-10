<script lang="ts">
    import { IconMaximize, IconMinimize } from "@tabler/icons-svelte";

    let isFullscreen = $state(false);

    $effect(() => {
        function onChange() {
            isFullscreen = !!document.fullscreenElement;
        }
        document.addEventListener("fullscreenchange", onChange);
        return () => document.removeEventListener("fullscreenchange", onChange);
    });

    async function toggleFullscreen() {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch {
            // Fullscreen not supported or blocked
        }
    }
</script>

<button
    onclick={toggleFullscreen}
    class="fixed top-3 right-3 z-40 w-10 h-10 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl ring-1 ring-black/6 dark:ring-white/10 shadow-lg shadow-black/4 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 cursor-pointer"
    title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
>
    {#if isFullscreen}
        <IconMinimize size={18} class="text-zinc-600 dark:text-zinc-400" />
    {:else}
        <IconMaximize size={18} class="text-zinc-600 dark:text-zinc-400" />
    {/if}
</button>
