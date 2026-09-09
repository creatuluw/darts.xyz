<script lang="ts">
    import { onMount } from "svelte";
    import { page as pageStore } from "$app/stores";
    import "../app.css";
    import { FloatingNav, Toast, LoadingOverlay } from "$lib/components/ui";
    import FullscreenButton from "$lib/components/ui/FullscreenButton.svelte";
    import EmailGate from "$lib/components/ui/EmailGate.svelte";
    import { emailStore } from "$lib/stores/email";
    import { fullscreenStore } from "$lib/stores/fullscreen";

    let { children } = $props();

    let isLoading = $state(true);
    let hasEmail = $state(false);
    let mounted = $state(false);
    let isFullscreen = $state(false);

    // 2nd-screen TV views are public-by-link: no email gate, no nav chrome
    const isTv = $derived($pageStore.url.pathname.endsWith("/tv"));

    onMount(() => {
        hasEmail = emailStore.getEmail().length > 0;
        mounted = true;
        isLoading = false;

        const unsubEmail = emailStore.subscribe((email) => {
            hasEmail = email.length > 0;
        });
        const unsubFullscreen = fullscreenStore.subscribe((v) => {
            isFullscreen = v;
        });

        return () => {
            unsubEmail();
            unsubFullscreen();
        };
    });
</script>

<svelte:head>
    <title>dart.monster</title>
</svelte:head>

{#if isLoading}
    <div
        class="min-h-dvh bg-page dark:bg-page-deep flex items-center justify-center"
    >
        <div class="flex flex-col items-center gap-4">
            <div
                class="w-10 h-10 border-3 border-zinc-200 dark:border-zinc-700 border-t-emerald-500 rounded-full animate-spin"
            ></div>
            <p class="text-zinc-400 dark:text-zinc-500 text-sm font-medium">
                Loading...
            </p>
        </div>
    </div>
{:else if !hasEmail && !isTv}
    <EmailGate />
{:else}
    <div
        class="min-h-dvh bg-page dark:bg-page-deep text-zinc-900 dark:text-white font-sans"
    >
        {#if !isTv}<FloatingNav />{/if}
        <main
            class="{isTv
                ? ''
                : isFullscreen
                    ? 'pt-2 pb-2 px-3 md:px-4'
                    : 'pt-16 pb-16 px-4 md:px-8'} {isTv ? '' : 'max-w-7xl mx-auto transition-all duration-300'}"
        >
            {@render children()}
        </main>
        <FullscreenButton />
        <LoadingOverlay />
        <Toast />
    </div>
{/if}
