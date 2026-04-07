<script lang="ts">
    import { fade } from "svelte/transition";
    import { toasts, removeToast } from "$lib/stores/toast";
</script>

<div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-1.5">
    {#each $toasts as toast (toast.id)}
        <div
            class="flex items-center gap-2 rounded border border-zinc-200 bg-white px-3 py-2 shadow-lg dark:border-white/10 dark:bg-[#1C1C1C]"
            transition:fade={{ duration: 200 }}
        >
            <span class="text-xs text-zinc-600 dark:text-zinc-300"
                >{toast.message}</span
            >
            <button
                onclick={() => removeToast(toast.id)}
                class="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                aria-label="Dismiss"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    {/each}
</div>
