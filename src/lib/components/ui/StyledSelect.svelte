<script lang="ts">
    import { onMount } from "svelte";

    interface Option {
        value: string;
        label: string;
        previewSrc?: string;
    }

    let {
        options = [],
        value = $bindable(""),
        placeholder = "Select...",
        class: className = "",
    }: {
        options: Option[];
        value?: string;
        placeholder?: string;
        class?: string;
    } = $props();

    let isOpen = $state(false);
    let dropdownRef: HTMLDivElement;
    let playingValue: string | null = $state(null);
    let currentAudio: HTMLAudioElement | null = null;

    const selectedLabel = $derived(
        options.find((o) => o.value === value)?.label || placeholder,
    );

    function toggle() {
        isOpen = !isOpen;
    }

    function selectOption(option: Option) {
        value = option.value;
        isOpen = false;
    }

    function playPreview(option: Option, event: MouseEvent) {
        event.stopPropagation();
        if (!option.previewSrc) return;

        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }

        if (playingValue === option.value) {
            playingValue = null;
            return;
        }

        playingValue = option.value;
        const audio = new Audio(option.previewSrc);
        audio.volume = 0.7;
        currentAudio = audio;

        audio.onended = () => {
            playingValue = null;
            currentAudio = null;
        };

        audio.onerror = () => {
            playingValue = null;
            currentAudio = null;
        };

        audio.play();
    }

    function handleClickOutside(event: MouseEvent) {
        if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
            isOpen = false;
        }
    }

    onMount(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
            if (currentAudio) {
                currentAudio.pause();
            }
        };
    });
</script>

<div bind:this={dropdownRef} class="relative w-full {className}">
    <!-- Trigger Button -->
    <button
        type="button"
        onclick={toggle}
        class="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-white dark:bg-[#1C1C1C] rounded border border-zinc-200 dark:border-white/10 shadow-sm dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] hover:border-zinc-300 dark:hover:border-white/20 focus:outline-none focus:border-amber-500/50 transition-colors duration-200 cursor-pointer"
    >
        <span
            class="{value
                ? 'text-zinc-900 dark:text-white'
                : 'text-zinc-400 dark:text-zinc-500'} font-medium truncate text-sm"
        >
            {selectedLabel}
        </span>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-zinc-400 shrink-0 transition-transform duration-200 {isOpen
                ? 'rotate-180'
                : ''}"
        >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    </button>

    <!-- Dropdown Panel -->
    {#if isOpen}
        <div
            class="absolute top-full left-0 right-0 mt-1.5 py-1 bg-white dark:bg-[#1C1C1C] rounded border border-zinc-200 dark:border-white/10 shadow-lg z-50 overflow-hidden"
        >
            {#each options as option (option.value)}
                <button
                    type="button"
                    onclick={() => selectOption(option)}
                    class="w-full px-3 py-2.5 text-left text-sm transition-colors duration-150 cursor-pointer flex items-center justify-between group {option.value ===
                    value
                        ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5'}"
                >
                    <span class="font-medium">{option.label}</span>
                    {#if option.previewSrc}
                        <span
                            role="button"
                            tabindex="0"
                            onclick={(e) => playPreview(option, e)}
                            onkeydown={(e) =>
                                e.key === "Enter" &&
                                playPreview(option, e as any)}
                            class="ml-2 flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-150 {playingValue ===
                            option.value
                                ? 'bg-amber-500 text-white'
                                : 'bg-zinc-100 dark:bg-white/10 text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-white/20'}"
                        >
                            {#if playingValue === option.value}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <rect
                                        x="6"
                                        y="4"
                                        width="4"
                                        height="16"
                                        rx="1"
                                    />
                                    <rect
                                        x="14"
                                        y="4"
                                        width="4"
                                        height="16"
                                        rx="1"
                                    />
                                </svg>
                            {:else}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                            {/if}
                        </span>
                    {/if}
                </button>
            {/each}
        </div>
    {/if}
</div>
