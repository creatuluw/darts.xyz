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
        IconServer,
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
    let showSettingsModal = $state(false);
    let newAccountEmail = $state("");
    let newAccountError = $state("");

    // Settings state
    let settingsLoading = $state(false);
    let settingsSaving = $state(false);
    let smtpHost = $state("");
    let smtpPort = $state("");
    let smtpUser = $state("");
    let smtpPassword = $state("");
    let smtpFrom = $state("");

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

    async function openSettingsModal() {
        showAccountMenu = false;
        smtpHost = "";
        smtpPort = "";
        smtpUser = "";
        smtpPassword = "";
        smtpFrom = "";
        showSettingsModal = true;
        settingsLoading = true;

        try {
            const accountId = emailStore.getEmail();
            const res = await fetch(
                `/api/settings?accountId=${encodeURIComponent(accountId)}`,
            );
            const data = await res.json();
            if (data.smtp_host) {
                smtpHost = data.smtp_host || "";
                smtpPort = data.smtp_port?.toString() || "";
                smtpUser = data.smtp_user || "";
                smtpPassword = data.smtp_password || "";
                smtpFrom = data.smtp_from || "";
            }
        } catch (e) {
            console.error("Failed to load settings:", e);
        } finally {
            settingsLoading = false;
        }
    }

    function closeSettingsModal() {
        showSettingsModal = false;
    }

    async function handleSaveSettings() {
        settingsSaving = true;
        const accountId = emailStore.getEmail();

        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accountId,
                    smtpHost: smtpHost.trim() || null,
                    smtpPort: smtpPort.trim() ? parseInt(smtpPort) : null,
                    smtpUser: smtpUser.trim() || null,
                    smtpPassword: smtpPassword.trim() || null,
                    smtpFrom: smtpFrom.trim() || null,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                addToast(data.error || "Failed to save settings", "error");
                settingsSaving = false;
                return;
            }

            addToast("Settings saved", "success");
            showSettingsModal = false;
        } catch (e) {
            console.error("Failed to save settings:", e);
            addToast("Failed to save settings", "error");
        } finally {
            settingsSaving = false;
        }
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
                class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                {$currentPath === link.href
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10'}"
            >
                <link.icon size={16} class="inline -mt-0.5" />
                <span class="hidden sm:inline">{link.label}</span>
            </a>
        {/each}

        <!-- Account avatar button -->
        <div class="relative ml-1" data-account-menu>
            <button
                onclick={toggleAccountMenu}
                class="flex items-center gap-1.5 rounded-full pl-1 pr-2 py-1 text-sm font-medium transition-all duration-300 {showAccountMenu
                    ? 'bg-zinc-100 dark:bg-white/15'
                    : 'hover:bg-zinc-100 dark:hover:bg-white/10'}"
                aria-label="Account menu"
            >
                <div
                    class="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold"
                >
                    {initials}
                </div>
                <IconChevronDown
                    size={12}
                    class="text-zinc-400 transition-transform duration-200 {showAccountMenu
                        ? 'rotate-180'
                        : ''}"
                />
            </button>

            {#if showAccountMenu}
                <div
                    class="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-900 rounded-xl ring-1 ring-black/6 dark:ring-white/10 shadow-xl shadow-black/10 overflow-hidden z-50"
                    role="menu"
                >
                    <!-- Accounts list -->
                    <div
                        class="px-4 py-3 border-b border-zinc-100 dark:border-white/10"
                    >
                        <p
                            class="text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-2"
                        >
                            Accounts
                        </p>
                        <div class="space-y-0.5">
                            {#each accounts as account}
                                {@const isActive = account === userEmail}
                                {@const accountInitials = account
                                    .split("@")[0]
                                    .slice(0, 2)
                                    .toUpperCase()}
                                <button
                                    onclick={() => handleSwitchAccount(account)}
                                    class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors cursor-pointer {isActive
                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                        : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5'}"
                                    role="menuitem"
                                >
                                    <div
                                        class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 {isActive
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-zinc-200 dark:bg-white/10 text-zinc-500 dark:text-zinc-400'}"
                                    >
                                        {accountInitials}
                                    </div>
                                    <span
                                        class="font-mono text-xs truncate flex-1 text-left"
                                    >
                                        {account}
                                    </span>
                                    {#if isActive}
                                        <IconCheck
                                            size={14}
                                            class="text-emerald-500 shrink-0"
                                        />
                                    {/if}
                                </button>
                            {/each}
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="p-1.5">
                        <button
                            onclick={openAddAccountModal}
                            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            role="menuitem"
                        >
                            <IconUserPlus size={16} />
                            Add account
                        </button>
                        <button
                            onclick={openSettingsModal}
                            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            role="menuitem"
                        >
                            <IconSettings size={16} />
                            Settings
                        </button>
                        {#if accounts.length > 0}
                            <button
                                onclick={handleSignOut}
                                class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                                role="menuitem"
                            >
                                <IconLogout size={16} />
                                Remove this account
                            </button>
                        {/if}
                    </div>
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
        onkeydown={(e) => e.key === "Escape" && closeAddAccountModal()}
        role="dialog"
        aria-modal="true"
        aria-label="Add account"
        tabindex="-1"
    >
        <div class="w-full max-w-sm mx-4">
            <DoubleBezel>
                <div class="flex items-center justify-between mb-4">
                    <EyebrowTag>Account</EyebrowTag>
                    <button
                        onclick={closeAddAccountModal}
                        class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                    >
                        <IconX size={18} />
                    </button>
                </div>

                <p class="text-zinc-500 dark:text-zinc-400 text-sm mb-4">
                    Enter an email address to add a new account or switch to an
                    existing one.
                </p>

                <form
                    onsubmit={(e) => {
                        e.preventDefault();
                        handleAddAccount();
                    }}
                    class="space-y-4"
                >
                    <div class="relative">
                        <IconMail
                            size={18}
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                        />
                        <input
                            type="email"
                            bind:value={newAccountEmail}
                            placeholder="your@email.com"
                            autocomplete="email"
                            class="w-full bg-zinc-50 dark:bg-white/5 rounded-full pl-12 pr-4 py-3 text-base ring-1 ring-black/6 dark:ring-white/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        />
                    </div>

                    {#if newAccountError}
                        <p class="text-red-500 text-sm">{newAccountError}</p>
                    {/if}

                    <PillButton
                        onclick={handleAddAccount}
                        disabled={!newAccountEmail.trim()}
                        class="w-full justify-center"
                    >
                        <span class="flex items-center justify-center gap-2">
                            Add account
                            <IconArrowRight size={18} />
                        </span>
                    </PillButton>
                </form>
            </DoubleBezel>
        </div>
    </div>
{/if}

<!-- Settings Modal -->
{#if showSettingsModal}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onclick={(e) => {
            if (e.target === e.currentTarget) closeSettingsModal();
        }}
        onkeydown={(e) => e.key === "Escape" && closeSettingsModal()}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        tabindex="-1"
    >
        <div class="w-full max-w-md mx-4">
            <DoubleBezel>
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                        <IconSettings size={18} class="text-zinc-400" />
                        <EyebrowTag>Settings</EyebrowTag>
                    </div>
                    <button
                        onclick={closeSettingsModal}
                        class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                    >
                        <IconX size={18} />
                    </button>
                </div>

                {#if settingsLoading}
                    <div class="text-center text-zinc-400 py-8">Loading...</div>
                {:else}
                    <!-- SMTP Configuration -->
                    <div class="mb-5">
                        <div class="flex items-center gap-2 mb-3">
                            <IconServer size={16} class="text-zinc-400" />
                            <h3
                                class="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                            >
                                SMTP Configuration
                            </h3>
                        </div>
                        <p class="text-xs text-zinc-400 mb-4">
                            Configure an SMTP server to enable email
                            verification for players. This allows cross-account
                            player linking.
                        </p>

                        <div class="space-y-3">
                            <div class="grid grid-cols-3 gap-3">
                                <div class="col-span-2">
                                    <label
                                        class="text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-1 block"
                                    >
                                        Host
                                    </label>
                                    <input
                                        type="text"
                                        bind:value={smtpHost}
                                        placeholder="smtp.gmail.com"
                                        class="w-full bg-zinc-50 dark:bg-white/5 rounded-lg px-3 py-2 text-sm ring-1 ring-black/6 dark:ring-white/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label
                                        class="text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-1 block"
                                    >
                                        Port
                                    </label>
                                    <input
                                        type="text"
                                        bind:value={smtpPort}
                                        placeholder="465"
                                        class="w-full bg-zinc-50 dark:bg-white/5 rounded-lg px-3 py-2 text-sm ring-1 ring-black/6 dark:ring-white/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    class="text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-1 block"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    bind:value={smtpUser}
                                    placeholder="user@example.com"
                                    autocomplete="off"
                                    class="w-full bg-zinc-50 dark:bg-white/5 rounded-lg px-3 py-2 text-sm ring-1 ring-black/6 dark:ring-white/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label
                                    class="text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-1 block"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    bind:value={smtpPassword}
                                    placeholder="••••••••"
                                    autocomplete="new-password"
                                    class="w-full bg-zinc-50 dark:bg-white/5 rounded-lg px-3 py-2 text-sm ring-1 ring-black/6 dark:ring-white/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label
                                    class="text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-1 block"
                                >
                                    From Address
                                </label>
                                <input
                                    type="email"
                                    bind:value={smtpFrom}
                                    placeholder="noreply@yourdomain.com"
                                    class="w-full bg-zinc-50 dark:bg-white/5 rounded-lg px-3 py-2 text-sm ring-1 ring-black/6 dark:ring-white/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        class="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-white/10"
                    >
                        <p class="text-[10px] text-zinc-400">
                            Settings stored per account
                        </p>
                        <PillButton
                            onclick={handleSaveSettings}
                            disabled={settingsSaving}
                        >
                            {settingsSaving ? "Saving..." : "Save Settings"}
                        </PillButton>
                    </div>
                {/if}
            </DoubleBezel>
        </div>
    </div>
{/if}
