<script lang="ts">
    import DoubleBezel from "./DoubleBezel.svelte";
    import PillButton from "./PillButton.svelte";

    import {
        IconMail,
        IconArrowRight,
        IconUserPlus,
    } from "@tabler/icons-svelte";
    import { emailStore, accountsStore } from "$lib/stores/email";
    import { addToast } from "$lib/stores/toast";

    let email = $state("");
    let loading = $state(false);
    let error = $state("");
    let accounts = $state<string[]>([]);
    let showNewAccount = $state(false);

    $effect(() => {
        const unsub = accountsStore.subscribe((list) => {
            accounts = list;
        });
        return unsub;
    });

    let hasExistingAccounts = $derived(accounts.length > 0);

    function selectAccount(account: string) {
        emailStore.switchTo(account);
        addToast(`Welcome back, ${account}`, "success");
    }

    async function handleSubmit() {
        const trimmed = email.trim().toLowerCase();

        if (!trimmed) {
            error = "Please enter an email address";
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
            error = "Please enter a valid email address";
            return;
        }

        error = "";
        loading = true;

        try {
            emailStore.setEmail(trimmed);
            addToast(`Welcome, ${trimmed}!`, "success");
        } catch (e) {
            error = "Something went wrong. Please try again.";
            emailStore.clearEmail();
        } finally {
            loading = false;
        }
    }

    function getInitials(account: string): string {
        return account.split("@")[0].slice(0, 2).toUpperCase();
    }
</script>

<div
    class="flex flex-col items-center justify-center min-h-[80dvh] text-center px-4"
>
    <h1
        class="font-display font-black text-6xl md:text-7xl lg:text-8xl tracking-tight mt-6 mb-4"
    >
        DARTS
    </h1>

    <p
        class="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl max-w-md mb-12"
    >
        {hasExistingAccounts
            ? "Select an account or add a new one."
            : "Enter your email to access your scores, stats, and history."}
    </p>

    {#if hasExistingAccounts}
        <!-- Existing accounts list -->
        <DoubleBezel class="w-full max-w-sm mb-4">
            <div class="space-y-1">
                {#each accounts as account}
                    {@const initials = getInitials(account)}
                    <button
                        onclick={() => selectAccount(account)}
                        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5"
                    >
                        <div
                            class="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0"
                        >
                            {initials}
                        </div>
                        <span
                            class="font-mono text-sm truncate flex-1 text-left"
                        >
                            {account}
                        </span>
                        <IconArrowRight
                            size={14}
                            class="text-zinc-300 dark:text-zinc-600 shrink-0"
                        />
                    </button>
                {/each}
            </div>
        </DoubleBezel>

        <!-- Toggle for new account input -->
        {#if !showNewAccount}
            <button
                onclick={() => (showNewAccount = true)}
                class="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
                <IconUserPlus size={16} />
                Add a new account
            </button>
        {:else}
            <DoubleBezel class="w-full max-w-sm mt-3">
                <form
                    onsubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
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
                            bind:value={email}
                            placeholder="your@email.com"
                            autofocus
                            autocomplete="email"
                            class="w-full bg-zinc-50 dark:bg-white/5 rounded-full pl-12 pr-4 py-3.5 text-base ring-1 ring-black/6 dark:ring-white/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        />
                    </div>

                    {#if error}
                        <p class="text-red-500 text-sm">{error}</p>
                    {/if}

                    <PillButton
                        onclick={handleSubmit}
                        disabled={loading || !email.trim()}
                        class="w-full justify-center"
                    >
                        <span class="flex items-center justify-center gap-2">
                            {loading ? "Loading..." : "Add account"}
                            {#if !loading}
                                <IconArrowRight size={18} />
                            {/if}
                        </span>
                    </PillButton>
                </form>
            </DoubleBezel>
        {/if}
    {:else}
        <!-- No existing accounts — show the original single-input gate -->
        <DoubleBezel class="w-full max-w-sm">
            <form
                onsubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
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
                        bind:value={email}
                        placeholder="your@email.com"
                        autofocus
                        autocomplete="email"
                        class="w-full bg-zinc-50 dark:bg-white/5 rounded-full pl-12 pr-4 py-3.5 text-base ring-1 ring-black/6 dark:ring-white/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                </div>

                {#if error}
                    <p class="text-red-500 text-sm">{error}</p>
                {/if}

                <PillButton
                    onclick={handleSubmit}
                    disabled={loading || !email.trim()}
                    class="w-full justify-center"
                >
                    <span class="flex items-center justify-center gap-2">
                        {loading ? "Loading..." : "Continue"}
                        {#if !loading}
                            <IconArrowRight size={18} />
                        {/if}
                    </span>
                </PillButton>
            </form>
        </DoubleBezel>

        <p class="text-zinc-400 dark:text-zinc-500 text-sm mt-8 max-w-xs">
            Your data is associated with your email address and stored securely.
        </p>
    {/if}
</div>
