<script lang="ts">
    import { page } from "$app/stores";
    import { derived } from "svelte/store";
    import {
        IconHome,
        IconTarget,
        IconUsers,
        IconHistory,
    } from "@tabler/icons-svelte";

    let currentPath = derived(page, ($page) => $page.url.pathname);

    const links = [
        { href: "/", label: "Home", icon: IconHome },
        { href: "/match/setup", label: "New Match", icon: IconTarget },
        { href: "/players", label: "Players", icon: IconUsers },
        { href: "/history", label: "History", icon: IconHistory },
    ];
</script>

<nav class="fixed top-4 left-1/2 -translate-x-1/2 z-40 mt-2">
    <div
        class="flex items-center gap-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-full px-2 py-1.5 ring-1 ring-black/[0.06] dark:ring-white/10 shadow-lg shadow-black/[0.04] dark:shadow-black/20"
    >
        {#each links as link}
            <a
                href={link.href}
                class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          {$currentPath === link.href
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10'}"
            >
                <link.icon size={16} class="inline -mt-0.5" />
                <span class="hidden sm:inline">{link.label}</span>
            </a>
        {/each}
    </div>
</nav>
