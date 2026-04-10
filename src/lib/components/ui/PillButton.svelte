<script lang="ts">
    let {
        type = "button",
        onclick,
        children,
        variant = "primary",
        class: className = "",
        disabled = false,
    }: {
        type?: "button" | "submit" | "reset";
        onclick?: () => void;
        children: any;
        variant?: "primary" | "secondary" | "ghost" | "danger";
        class?: string;
        disabled?: boolean;
    } = $props();

    const baseClasses =
        "rounded-full px-6 py-3 font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer inline-flex items-center gap-2";

    const variantClasses = {
        primary:
            "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100",
        secondary:
            "bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-white/15",
        ghost: "bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white",
        danger: "bg-red-500 text-white hover:bg-red-600",
    };
</script>

<button
    {type}
    {onclick}
    {disabled}
    class="{baseClasses} {variantClasses[variant]} {className}"
>
    {@render children()}
</button>
