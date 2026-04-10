<script lang="ts">
    import { page } from "$app/stores";
    import { derived } from "svelte/store";
    import {
        IconHome,
        IconTarget,
        IconUsers,
        IconHistory,
        IconArchive,
        IconMail,
    } from "@tabler/icons-svelte";
    import { emailStore } from "$lib/stores/email";

    let currentPath = derived(page, ($page) => $page.url.pathname);

    const links = [
        { href: "/", label: "Home", icon: IconHome },
        { href: "/match/setup", label: "New Match", icon: IconTarget },
        { href: "/players", label: "Players", icon: IconUsers },
        { href: "/history", label: "History", icon: IconHistory },
        { href: "/archive", label: "Archive", icon: IconArchive },
    ];

    // Subscribe to email store
    let userEmail = $state("");

    $effect(() => {
        userEmail = emailStore.getEmail();
        const unsubscribe = emailStore.subscribe((email) => {
            userEmail = email;
        });
        return unsubscribe;
    });

    // Only show email badge on home page
    let showEmailBadge = $derived($currentPath === "/");
</script>

<!-- Navigation centered at top -->
<nav class="fixed top-3 left-1/2 -translate-x-1/2 z-40">
    <div
        class="flex items-center gap-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-full px-2 py-1.5 ring-1 ring-black/6 dark:ring-white/10 shadow-lg shadow-black/4"
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

<!-- Email badge fixed at bottom-left, only shown on home page -->
{#if showEmailBadge}
    <div class="fixed bottom-4 left-4 z-40">
        <div
            class="flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-full px-4 py-2 ring-1 ring-black/6 dark:ring-white/10 shadow-lg shadow-black/4"
        >
            <div
                class="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center"
            >
                <IconMail size={14} class="text-white" />
            </div>
            <span
                class="text-sm font-medium text-zinc-600 dark:text-zinc-300 max-w-48 truncate sm:max-w-64 font-mono"
            >
                {userEmail || "Not signed in"}
            </span>
        </div>
    </div>
{/if}
