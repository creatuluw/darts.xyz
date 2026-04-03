<script lang="ts">
    let { children, class: className = "" }: { children: any; class?: string } =
        $props();
</script>

<div
    class="bg-black/5 dark:bg-white/5 ring-2 ring-black/[0.06] dark:ring-white/10 p-[2px] rounded-[5px] {className}"
>
    <div
        class="bg-white dark:bg-[#1C1C1C] rounded-[3px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
    >
        <div class="p-5">
            {@render children()}
        </div>
    </div>
</div>
