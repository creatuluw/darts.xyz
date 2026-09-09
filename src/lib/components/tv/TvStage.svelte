<script lang="ts">
    // Fixed 16:9 canvas, scaled to fit whatever viewport it's cast to.
    // Letterboxes on non-16:9 windows; content never reflows.
    // ponytail: scale via JS resize listener — CSS can't turn a length into a scale() number.
    import type { Snippet } from "svelte";

    let { children }: { children: Snippet } = $props();

    let scale = $state(1);
    $effect(() => {
        const fit = () => {
            scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
        };
        fit();
        window.addEventListener("resize", fit);
        return () => window.removeEventListener("resize", fit);
    });
</script>

<div class="h-dvh bg-zinc-950 overflow-hidden flex items-center justify-center">
    <div class="w-[1920px] h-[1080px] shrink-0" style="transform: scale({scale})">
        {@render children()}
    </div>
</div>
