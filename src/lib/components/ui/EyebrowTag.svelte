<script lang="ts">
  let { children, class: className = '' }: { children: any; class?: string } = $props();
</script>

<span class="inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-zinc-100 dark:bg-white/10 text-zinc-500 dark:text-zinc-400 {className}">
  {@render children()}
</span>
