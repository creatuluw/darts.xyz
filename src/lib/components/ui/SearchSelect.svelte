<script lang="ts">
    import { IconSearch, IconX } from "@tabler/icons-svelte";

    interface Option {
        id: string;
        name: string;
    }

    let {
        options = [],
        selected = $bindable<Option[]>([]),
        placeholder = "Search...",
        class: className = "",
    }: {
        options: Option[];
        selected?: Option[];
        placeholder?: string;
        class?: string;
    } = $props();

    let search = $state("");
    let isOpen = $state(false);
    let inputRef: HTMLInputElement;

    let filteredOptions = $derived(
        search.trim()
            ? options.filter(
                  (opt) =>
                      opt.name.toLowerCase().includes(search.toLowerCase()) &&
                      !selected.find((s) => s.id === opt.id),
              )
            : options.filter((opt) => !selected.find((s) => s.id === opt.id)),
    );

    function selectOption(option: Option) {
        selected = [...selected, option];
        search = "";
        inputRef?.focus();
    }

    function removeOption(id: string) {
        selected = selected.filter((s) => s.id !== id);
    }

    function handleFocus() {
        isOpen = true;
    }

    function handleBlur() {
        setTimeout(() => {
            isOpen = false;
        }, 150);
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            isOpen = false;
            search = "";
        }
    }
</script>

<div class="relative {className}">
    {#if selected.length > 0}
        <div class="flex flex-wrap gap-2 mb-3">
            {#each selected as item (item.id)}
                <span
                    class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                >
                    {item.name}
                    <button
                        type="button"
                        onclick={() => removeOption(item.id)}
                        class="hover:text-emerald-300 transition-colors"
                    >
                        <IconX size={12} />
                    </button>
                </span>
            {/each}
        </div>
    {/if}

    <div class="relative">
        <IconSearch
            size={16}
            class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
        />
        <input
            bind:this={inputRef}
            type="text"
            bind:value={search}
            {placeholder}
            onfocus={handleFocus}
            onblur={handleBlur}
            onkeydown={handleKeydown}
            class="w-full bg-zinc-50 dark:bg-white/5 rounded-full pl-10 pr-4 py-2.5 text-sm ring-1 ring-black/6 dark:ring-white/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
        />
    </div>

    {#if isOpen && filteredOptions.length > 0}
        <div
            class="absolute top-full left-0 right-0 mt-1.5 py-1 bg-white dark:bg-[#1C1C1C] rounded-lg border border-zinc-200 dark:border-white/10 shadow-lg z-50 max-h-48 overflow-y-auto"
        >
            {#each filteredOptions as option (option.id)}
                <button
                    type="button"
                    onmousedown={(e) => {
                        e.preventDefault();
                        selectOption(option);
                    }}
                    class="w-full px-3 py-2.5 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                    {option.name}
                </button>
            {/each}
        </div>
    {/if}
</div>
