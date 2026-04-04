<script lang="ts">
    import "../app.css";
    import { FloatingNav } from "$lib/components/ui";

    let { children } = $props();
</script>

<svelte:head>
    <title>Darts 501</title>
</svelte:head>

<div
    class="min-h-[100dvh] bg-[#F4F2EE] dark:bg-[#0A0A0A] text-zinc-900 dark:text-white font-sans"
>
    <FloatingNav />
    <main class="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        {@render children()}
    </main>
</div>
