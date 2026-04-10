<script lang="ts">
    import { page } from "$app/stores";
    import { derived } from "svelte/store";
    import {
        IconHome,
        IconTarget,
        IconUsers,
        IconHistory,
        IconArchive,
        IconLogout,
        IconChevronDown,
        IconUserPlus,
        IconMail,
        IconArrowRight,
        IconX,
        IconCheck,
        IconSettings,
    } from "@tabler/icons-svelte";
    import { emailStore, accountsStore } from "$lib/stores/email";
    import { addToast } from "$lib/stores/toast";
    import DoubleBezel from "./DoubleBezel.svelte";
    import PillButton from "./PillButton.svelte";
    import EyebrowTag from "./EyebrowTag.svelte";

    let currentPath = derived(page, ($page) => $page.url.pathname);

    const links = [
        { href: "/", label: "Home", icon: IconHome },
        { href: "/match/setup", label: "New Match", icon: IconTarget },
        { href: "/players", label: "Players", icon: IconUsers },
        { href: "/history", label: "History", icon: IconHistory },
        { href: "/archive", label: "Archive", icon: IconArchive },
    ];

    // Subscribe to stores
    let userEmail = $state("");
    let accounts = $state<string[]>([]);
    let showAccountMenu = $state(false);
    let showAddAccountModal = $state(false);
    let newAccountEmail = $state("");
    let newAccountError = $state("");

    $effect(() => {
        const unsubEmail = emailStore.subscribe((email) => {
            userEmail = email;
        });
        const unsubAccounts = accountsStore.subscribe((list) => {
            accounts = list;
        });
        return () => {
            unsubEmail();
            unsubAccounts();
        };
    });

    let initials = $derived(
        userEmail ? userEmail.split("@")[0].slice(0, 2).toUpperCase() : "??",
    );

    function toggleAccountMenu() {
        showAccountMenu = !showAccountMenu;
    }

    function closeAccountMenu() {
        showAccountMenu = false;
    }

    function openAddAccountModal() {
        showAccountMenu = false;
        newAccountEmail = "";
        newAccountError = "";
        showAddAccountModal = true;
    }

    function closeAddAccountModal() {
        showAddAccountModal = false;
        newAccountEmail = "";
        newAccountError = "";
    }

    function handleAddAccount() {
        const trimmed = newAccountEmail.trim().toLowerCase();

        if (!trimmed) {
            newAccountError = "Please enter an email address";
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
            newAccountError = "Please enter a valid email address";
            return;
        }

        if (accounts.includes(trimmed)) {
            emailStore.switchTo(trimmed);
            closeAddAccountModal();
            addToast(`Switched to ${trimmed}`, "success");
            return;
        }

        emailStore.setEmail(trimmed);
        closeAddAccountModal();
        addToast(`Account added: ${trimmed}`, "success");
    }

    function handleSwitchAccount(email: string) {
        emailStore.switchTo(email);
        closeAccountMenu();
        addToast(`Switched to ${email}`, "success");
    }

    function handleSignOut() {
        emailStore.signOut(userEmail);
        closeAccountMenu();
        addToast("Account removed", "success");
    }

    function handleClickOutside(e: MouseEvent) {
        if (showAccountMenu) {
            const target = e.target as HTMLElement;
            if (!target.closest("[data-account-menu]")) {
                closeAccountMenu();
            }
        }
    }
</script>

<svelte:window onclick={handleClickOutside} />

<!-- Navigation centered at top -->
<nav class="fixed top-3 left-1/2 -translate-x-1/2 z-40">
    <div
        class="flex items-center gap-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-full px-2 py-1.5 ring-1 ring-black/6 dark:ring-white/10 shadow-lg shadow-black/4"
    >
        {#each links as link}
            <a
                href={link.href}
                class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.