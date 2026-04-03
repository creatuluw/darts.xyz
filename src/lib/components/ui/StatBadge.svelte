<script lang="ts">
  let {
    label,
    value,
    suffix = '',
  }: {
    label: string;
    value: string | number;
    suffix?: string;
  } = $props();
</script>

<div class="text-center">
  <div class="font-mono text-2xl font-semibold text-zinc-900 dark:text-white">
    {value}{suffix}
  </div>
  <div class="text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mt-1">
    {label}
  </div>
</div>
