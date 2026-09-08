<script lang="ts">
    let {
        content,
        position = "top",
        delay = 200,
        children,
        class: className = "",
    }: {
        content: string;
        position?: "top" | "bottom" | "left" | "right";
        delay?: number;
        children: any;
        class?: string;
    } = $props();

    let visible = $state(false);
    let timer: ReturnType<typeof setTimeout>;
    let triggerEl: HTMLDivElement | null = null;
    let tipEl: HTMLDivElement | null = $state(null);

    function show() {
        timer = setTimeout(() => (visible = true), delay);
    }

    function hide() {
        clearTimeout(timer);
        visible = false;
    }

    // Position the fixed-position bubble at the trigger. Fixed positioning
    // escapes overflow-hidden/auto ancestors, so the tooltip never clips.
    $effect(() => {
        if (!visible || !triggerEl || !tipEl) return;
        const r = triggerEl.getBoundingClientRect();
        const t = tipEl.getBoundingClientRect();
        let top = 0;
        let left = 0;
        switch (position) {
            case "top":
                top = r.top - t.height - 8;
                left = r.left + r.width / 2 - t.width / 2;
                break;
            case "bottom":
                top = r.bottom + 8;
                left = r.left + r.width / 2 - t.width / 2;
                break;
            case "left":
                top = r.top + r.height / 2 - t.height / 2;
                left = r.left - t.width - 8;
                break;
            case "right":
                top = r.top + r.height / 2 - t.height / 2;
                left = r.right + 8;
                break;
        }
        tipEl.style.top = `${top}px`;
        tipEl.style.left = `${left}px`;
    });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="relative inline-block {className}"
    bind:this={triggerEl}
    onmouseenter={show}
    onmouseleave={hide}
>
    {@render children()}
</div>

{#if visible}
    <div
        bind:this={tipEl}
        role="tooltip"
        style="top: -9999px; left: -9999px;"
        class="fixed z-50 pointer-events-none whitespace-nowrap rounded bg-zinc-900 px-1.5 py-0.5 text-[9px] font-medium text-white shadow-lg ring-1 ring-white/10"
    >
        {content}
    </div>
{/if}
