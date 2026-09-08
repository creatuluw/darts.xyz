<script lang="ts">
    import { IconSearch, IconX } from "@tabler/icons-svelte";
    import { IconGripVertical } from "@tabler/icons-svelte";

    interface Option {
        id: string;
        name: string;
    }

    let {
        options = [],
        selected = $bindable<Option[]>([]),
        placeholder = "Search players...",
        maxSelected = Infinity,
        class: className = "",
    }: {
        options: Option[];
        selected?: Option[];
        placeholder?: string;
        maxSelected?: number;
        class?: string;
    } = $props();

    let search = $state("");
    let showSearch = $state(false);
    let inputRef: HTMLInputElement;
    let dragIndex = $state<number | null>(null);
    let dragOverIndex = $state<number | null>(null);

    let isSelected = $derived(new Set(selected.map((s) => s.id)));
    let atMax = $derived(selected.length >= maxSelected);

    let filteredOptions = $derived(
        search.trim()
            ? options.filter((opt) =>
                  opt.name.toLowerCase().includes(search.toLowerCase()),
              )
            : options,
    );

    function toggleOption(option: Option) {
        if (isSelected.has(option.id)) {
            selected = selected.filter((s) => s.id !== option.id);
        } else if (!atMax) {
            selected = [...selected, option];
        }
    }

    function openSearch() {
        showSearch = true;
        setTimeout(() => inputRef?.focus(), 50);
    }

    function closeSearch() {
        showSearch = false;
        search = "";
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            closeSearch();
        }
    }

    function handleDragStart(index: number, e: DragEvent) {
        dragIndex = index;
        dragOverIndex = null;
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", index.toString());
        }
    }

    function handleDragOver(index: number, e: DragEvent) {
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = "move";
        }
        if (dragIndex !== null && dragIndex !== index) {
            dragOverIndex = index;
        }
    }

    function handleDragLeave() {
        dragOverIndex = null;
    }

    function handleDrop(index: number, e: DragEvent) {
        e.preventDefault();
        if (dragIndex === null || dragIndex === index) {
            resetDrag();
            return;
        }

        const reordered = [...selected];
        const [moved] = reordered.splice(dragIndex, 1);
        reordered.splice(index, 0, moved);
        selected = reordered;
        resetDrag();
    }

    function handleDragEnd() {
        resetDrag();
    }

    function resetDrag() {
        dragIndex = null;
        dragOverIndex = null;
    }
</script>

<div class="{className}">
    {#if selected.length > 0}
        <div class="flex flex-wrap gap-2 mb-3" role="list">
            {#each selected as item, i (item.id)}
                <span
                    role="listitem"
                    draggable={selected.length > 1}
                    ondragstart={(e) => handleDragStart(i, e)}
                    ondragover={(e) => handleDragOver(i, e)}
                    ondragleave={handleDragLeave}
                    ondrop={(e) => handleDrop(i, e)}
                    ondragend={handleDragEnd}
                    class="inline-flex items-center gap-1.5 rounded-full pl-2 pr-3 py-1.5 text-sm font-medium transition-all duration-200 {selected.length >
                    1
                        ? 'cursor-grab active:cursor-grabbing'
                        : ''} {dragIndex === i
                        ? 'opacity-40 scale-95'
                        : ''} {dragOverIndex === i &&
                    dragIndex !== null &&
                    dragIndex !== i
                        ? 'ring-2 ring-emerald-400 scale-105'
                        : 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'}"
                >
                    {#if selected.length > 1}
                        <IconGripVertical
                            size={12}
                            class="text-emerald-500/40 -ml-0.5"
                        />
                    {/if}
                    <span class="select-none">{item.name}</span>
                    <button
                        type="button"
                        onclick={() => toggleOption(item)}
                        class="hover:text-emerald-300 transition-colors"
                    >
                        <IconX size={12} />
                    </button>
                </span>
            {/each}
        </div>
    {/if}

    <div class="flex items-center justify-between mb-3">
        <span class="text-xs text-zinc-400 uppercase tracking-wider"
            >{options.length} player{options.length !== 1 ? 's' : ''}</span
        >
        {#if showSearch}
            <div class="relative flex-1 max-w-[200px] ml-3">
                <IconSearch
                    size={14}
                    class="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                />
                <input
                    bind:this={inputRef}
                    type="text"
                    inputmode="search"
                    bind:value={search}
                    {placeholder}
                    onkeydown={handleKeydown}
                    class="w-full bg-zinc-50 dark:bg-white/5 rounded-full pl-8 pr-3 py-1.5 text-sm ring-1 ring-black/6 dark:ring-white/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
            </div>
            <button
                type="button"
                onclick={closeSearch}
                class="ml-1.5 p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
                <IconX size={16} />
            </button>
        {:else}
            <button
                type="button"
                onclick={openSearch}
                class="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
            >
                <IconSearch size={16} />
            </button>
        {/if}
    </div>

    <div class="flex flex-wrap gap-2">
        {#each filteredOptions as option (option.id)}
            {@const active = isSelected.has(option.id)}
            <button
                type="button"
                onclick={() => toggleOption(option)}
                disabled={!active && atMax}
                class="rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 cursor-pointer {active
                    ? 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 ring-1 ring-emerald-500/30'
                    : 'bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 ring-1 ring-black/6 dark:ring-white/10 hover:bg-zinc-200 dark:hover:bg-white/10'} {!active && atMax
                    ? 'opacity-40 cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-white/5'
                    : ''}"
            >
                {option.name}
            </button>
        {/each}
        {#if filteredOptions.length === 0 && options.length > 0}
            <p class="text-zinc-400 text-sm py-2">No players match "{search}"</p>
        {/if}
    </div>
</div>
