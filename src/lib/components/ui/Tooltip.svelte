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

    function show() {
        timer = setTimeout(() => (visible = true), delay);
    }

    function hide() {
        clearTimeout(timer);
        visible = false;
    }

    const posClasses: Record<string, string> = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="relative inline-block {className}" onmouseenter={show} onmouseleave={hide}>
    {@render children()}
    {#if visible}
        <div
            class="absolute pointer-events-none whitespace-nowrap rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg ring-1 ring-white/10 {posClasses[position]}"
            role="tooltip"
        >
            {content}
        </div>
    {/if}
</div>
