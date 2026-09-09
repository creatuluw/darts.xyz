<script lang="ts">
    // Fixed 16:9 design canvas, stretched to FILL its host box edge-to-edge.
    // On a true 16:9 viewport (fullscreen/cast) this is pixel-perfect 1:1;
    // on chrome'd landscape screens it stretches a few % instead of letterboxing.
    // Measures the host (clientWidth excludes the global scrollbar-gutter),
    // not window.innerWidth — the app reserves a stable gutter.
    // ponytail: non-uniform scale distorts on far-off aspects (portrait phones) — cover-crop if TV pages ever need portrait.
    import type { Snippet } from "svelte";

    let { children }: { children: Snippet } = $props();

    let host = $state<HTMLElement | null>(null);
    let sx = $state(1);
    let sy = $state(1);
    $effect(() => {
        if (!host) return;
        const fit = () => {
            sx = host.clientWidth / 1920;
            sy = host.clientHeight / 1080;
        };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(host);
        return () => ro.disconnect();
    });
</script>

<div bind:this={host} class="h-dvh w-full bg-zinc-950 overflow-hidden flex items-center justify-center">
    <div class="w-[1920px] h-[1080px] shrink-0" style="transform: scale({sx}, {sy})">
        {@render children()}
    </div>
</div>
