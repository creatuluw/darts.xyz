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

    let currentPath = derived(page, ($page) => $page.url.pathname);

    const links = [
        { href: "/", label: "Home", icon: IconHome },
        { href: "/match/setup", label: "Play", icon: IconTarget },
        { href: "/players", label: "Players", icon: IconUsers },
        { href: "/history", label: "History", icon: IconHistory },
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
                class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] {$currentPath ===
                link.href
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10'}"
                aria-current={$currentPath === link.href ? "page" : undefined}
            >
                <div class="flex items-center gap-1.5">
                    <link.icon size={16} />
                    <span class="hidden md:inline">{link.label}</span>
                </div>
            </a>
        {/each}

        <!-- Account button -->
        <div class="relative ml-1" data-account-menu>
            <button
                onclick={toggleAccountMenu}
                class="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-zinc-100 dark:hover:bg-white/10"
            >
                <div
                    class="w-7 h-7 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-xs font-bold"
                >
                    {initials}
                </div>
                <IconChevronDown size={14} class="text-zinc-400" />
            </button>

            <!-- Account dropdown -->
            {#if showAccountMenu}
                <div
                    class="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-900 rounded-2xl ring-1 ring-black/6 dark:ring-white/10 shadow-xl shadow-black/8 p-2 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                >
                    <!-- Current account -->
                    <div
                        class="px-3 py-2.5 flex items-center gap-3 rounded-xl bg-zinc-50 dark:bg-white/5 mb-1"
                    >
                        <div
                            class="w-9 h-9 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-sm font-bold flex-shrink-0"
                        >
                            {initials}
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="text-xs text-zinc-500 dark:text-zinc-400">
                                Current account
                            </p>
                            <p class="text-sm font-medium truncate">
                                {userEmail}
                            </p>
                        </div>
                        <IconCheck
                            size={16}
                            class="text-green-500 flex-shrink-0"
                        />
                    </div>

                    <!-- Other accounts -->
                    {#if accounts.length > 1}
                        <div
                            class="border-t border-zinc-100 dark:border-white/5 my-1"
                        ></div>
                        <p
                            class="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 font-medium"
                        >
                            Other accounts
                        </p>
                        {#each accounts as account}
                            {#if account !== userEmail}
                                <button
                                    onclick={() => handleSwitchAccount(account)}
                                    class="w-full px-3 py-2 flex items-center gap-3 rounded-xl text-sm text-left transition-colors duration-200 hover:bg-zinc-50 dark:hover:bg-white/5 cursor-pointer"
                                >
                                    <div
                                        class="w-7 h-7 rounded-full bg-zinc-200 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 flex items-center justify-center text-xs font-bold flex-shrink-0"
                                    >
                                        {account
                                            .split("@")[0]
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </div>
                                    <span
                                        class="truncate text-zinc-700 dark:text-zinc-300"
                                        >{account}</span
                                    >
                                    <IconArrowRight
                                        size={14}
                                        class="text-zinc-400 ml-auto flex-shrink-0"
                                    />
                                </button>
                            {/if}
                        {/each}
                    {/if}

                    <!-- Actions -->
                    <div
                        class="border-t border-zinc-100 dark:border-white/5 my-1"
                    ></div>
                    <button
                        onclick={openAddAccountModal}
                        class="w-full px-3 py-2.5 flex items-center gap-3 rounded-xl text-sm text-left transition-colors duration-200 hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 cursor-pointer"
                    >
                        <IconUserPlus
                            size={16}
                            class="text-zinc-500 dark:text-zinc-400"
                        />
                        Add another account
                    </button>
                    <a
                        href="/archive"
                        class="w-full px-3 py-2.5 flex items-center gap-3 rounded-xl text-sm text-left transition-colors duration-200 hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 cursor-pointer"
                    >
                        <IconArchive
                            size={16}
                            class="text-zinc-500 dark:text-zinc-400"
                        />
                        Archive
                    </a>
                    <button
                        onclick={handleSignOut}
                        class="w-full px-3 py-2.5 flex items-center gap-3 rounded-xl text-sm text-left transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 cursor-pointer"
                    >
                        <IconLogout size={16} />
                        Sign out
                    </button>
                </div>
            {/if}
        </div>
    </div>
</nav>

<!-- Add Account Modal -->
{#if showAddAccountModal}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onclick={(e) => {
            if (e.target === e.currentTarget) closeAddAccountModal();
        }}
        onkeydown={(e) => {
            if (e.key === "Escape") closeAddAccountModal();
        }}
    >
        <div class="w-full max-w-md mx-4">
            <DoubleBezel>
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-lg font-semibold">Add Account</h2>
                        <button
                            onclick={closeAddAccountModal}
                            class="p-1.5 rounded-full transition-colors hover:bg-zinc-100 dark:hover:bg-white/10"
                        >
                            <IconX size={18} class="text-zinc-500" />
                        </button>
                    </div>

                    <label
                        class="text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-1"
                    >
                        <IconMail size={10} />
                        Email
                    </label>

                    <div class="mt-3">
                        <input
                            type="email"
                            bind:value={newAccountEmail}
                            placeholder="name@example.com"
                            class="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-white/5 ring-1 ring-black/6 dark:ring-white/10 text-sm outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-white/20 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                            onkeydown={(e) => {
                                if (e.key === "Enter") handleAddAccount();
                            }}
                        />
                        {#if newAccountError}
                            <p
                                class="mt-2 text-xs text-red-500 dark:text-red-400"
                            >
                                {newAccountError}
                            </p>
                        {/if}
                    </div>

                    <div class="mt-6 flex gap-3">
                        <button
                            onclick={closeAddAccountModal}
                            class="flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/15 text-zinc-700 dark:text-zinc-300"
                        >
                            Cancel
                        </button>
                        <button
                            onclick={handleAddAccount}
                            class="flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
                        >
                            Add Account
                        </button>
                    </div>
                </div>
            </DoubleBezel>
        </div>
    </div>
{/if}
