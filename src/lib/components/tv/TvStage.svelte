<script lang="ts">
    // Fixed 16:9 design canvas, scaled UNIFORMLY to fit its host box (centered).
    // Circles stay circles: an off-16:9 viewport letterboxes instead of stretching
    // (the bars fall away visually — host and page roots share bg-zinc-950).
    // Measures the host (clientWidth excludes the global scrollbar-gutter),
    // not window.innerWidth — the app reserves a stable gutter.
    import type { Snippet } from "svelte";

    let { children }: { children: Snippet } = $props();

    let host = $state<HTMLElement | null>(null);
    let s = $state(1);
    $effect(() => {
        if (!host) return;
        const el = host;
        const fit = () => {
            s = Math.min(el.clientWidth / 1920, el.clientHeight / 1080);
        };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(host);
        return () => ro.disconnect();
    });
</script>

<div bind:this={host} class="h-dvh w-full bg-zinc-950 overflow-hidden flex items-center justify-center">
    <div class="w-[1920px] h-[1080px] shrink-0" style="transform: scale({s})">
        {@render children()}
    </div>
</div>
