<script lang="ts">
    let { value, class: className = "" }: { value: number; class?: string } =
        $props();

    let pulsing = $state(false);
    let displayValue = $state(value);

    $effect(() => {
        if (value !== displayValue) {
            pulsing = true;
            displayValue = value;
            setTimeout(() => {
                pulsing = false;
            }, 300);
        }
    });
</script>

<span
    class="font-mono tabular-nums transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] {pulsing
        ? 'scale-110'
        : 'scale-100'} {className}"
>
    {displayValue}
</span>
