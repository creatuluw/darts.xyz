<script lang="ts">
    import DoubleBezel from "./DoubleBezel.svelte";
    import PillButton from "./PillButton.svelte";
    import EyebrowTag from "./EyebrowTag.svelte";
    import { IconMail, IconArrowRight } from "@tabler/icons-svelte";
    import { emailStore } from "$lib/stores/email";
    import { addToast } from "$lib/stores/toast";

    let email = $state("");
    let loading = $state(false);
    let error = $state("");

    async function handleSubmit() {
        const trimmed = email.trim().toLowerCase();

        if (!trimmed) {
            error = "Please enter an email address";
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
            error = "Please enter a valid email address";
            return;
        }

        error = "";
        loading = true;

        try {
            emailStore.setEmail(trimmed);
            addToast(`Welcome${trimmed ? `, ${trimmed}` : ""}!`, "success");
        } catch (e) {
            error = "Something went wrong. Please try again.";
            emailStore.clearEmail();
        } finally {
            loading = false;
        }
    }
</script>

<div
    class="flex flex-col items-center justify-center min-h-[80dvh] text-center px-4"
>
    <EyebrowTag>Darts Scoring App</EyebrowTag>

    <h1
        class="font-display font-black text-6xl md:text-7xl lg:text-8xl tracking-tight mt-6 mb-4"
    >
        DARTS
    </h1>

    <p
        class="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl max-w-md mb-12"
    >
        Enter your email to access your scores, stats, and history.
    </p>

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
</div>
