<script lang="ts">
    import { loadingStore } from "$lib/stores/loading";

    let items = $state<{ key: string; message: string }[]>([]);

    $effect(() => {
        const unsubscribe = loadingStore.subscribe((v) => {
            items = v;
        });
        return unsubscribe;
    });
</script>

{#if items.length > 0}
    <div
        class="fixed inset-0 z-30 flex flex-col items-center justify-center bg-page/80 dark:bg-page-deep/80 backdrop-blur-sm pointer-events-none"
    >
        <div
            class="w-10 h-10 border-3 border-zinc-200 dark:border-zinc-700 border-t-emerald-500 rounded-full animate-spin"
        ></div>
        <div class="mt-4 text-center">
            {#each items as item (item.key)}
                <p class="text-sm text-zinc-500 dark:text-zinc-400">
                    {item.message}
                </p>
            {/each}
        </div>
    </div>
{/if}
