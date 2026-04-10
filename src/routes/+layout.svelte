<script lang="ts">
    import { onMount } from "svelte";
    import "../app.css";
    import { FloatingNav, Toast } from "$lib/components/ui";
    import FullscreenButton from "$lib/components/ui/FullscreenButton.svelte";
    import EmailGate from "$lib/components/ui/EmailGate.svelte";
    import { emailStore } from "$lib/stores/email";

    let { children } = $props();

    // Loading state - true while checking localStorage
    let isLoading = $state(true);
    let hasEmail = $state(false);
    let mounted = $state(false);

    onMount(() => {
        // Check localStorage for email
        hasEmail = emailStore.getEmail().length > 0;
        mounted = true;
        isLoading = false;

        // Subscribe to store updates
        const unsubscribe = emailStore.subscribe((email) => {
            hasEmail = email.length > 0;
        });

        return unsubscribe;
    });
</script>

<svelte:head>
    <title>dart.monster</title>
</svelte:head>

{#if isLoading}
    <!-- Loading spinner while checking localStorage -->
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
{:else if !hasEmail}
    <EmailGate />
{:else}
    <div
        class="min-h-dvh bg-page dark:bg-page-deep text-zinc-900 dark:text-white font-sans"
    >
        <FloatingNav />
        <main class="pt-16 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
            {@render children()}
        </main>
        <FullscreenButton />
        <Toast />
    </div>
{/if}
