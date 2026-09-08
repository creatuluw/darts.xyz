# Learnings

- [GoDaddy DNS can't serve a Railway apex domain](./godaddy-dns-can-t-serve-a-railway-apex-domain.md) - The gotcha
- [Miss turns must persist with dartsThrown ≥ 1](./miss-turns-must-persist-with-dartsthrown-1.md) - The turns table / API has a constraint that `dartsThrown >= 1`. A miss (all three darts off the board) is still a turn and must be persisted with `dartsThrown`
- [GoDaddy apex domain on Railway: A record to live edge IP, not the documented one](./godaddy-apex-domain-a-record-to-edge-ip.md) - The pattern (snooze.monster / dart.monster, Sep 2026)
- [Refresh-resume depends on chronological turn order and persisted firstThrowerId](./refresh-resume-needs-chronological-turn-order.md) - Refreshing the browser mid-leg (resume logic in `src/routes/match/[id]/+page.svelte`) silently depends on two implicit contracts. Breaking either reproduces the
- [TS can't narrow $state inside closures — use $derived.by with local capture](./ts-can-t-narrow-state-in-closures.md) - Gotcha
- [wiki_search misses recently-written concepts — verify with wiki_validate or ls before writing](./wiki-search-misses-recent-concepts.md) - Discovered while recapping the Risk-darts rollback turn: `wiki_search("risk territory")` and `wiki_search("heat economies")` both returned **no results**, yet `
- [OpenCode zen/go LLM endpoint needs x-opencode-session header + custom User-Agent](./opencode-zen-go-needs-session-header.md) - The OpenCode Zen Go chat-completions endpoint (`https://opencode.ai/zen/go/v1/chat/completions`) rejects plain requests — it requires BOTH:
- [Tooltips must use fixed positioning to escape overflow clipping](./tooltips-must-use-fixed-positioning.md) - Gotcha
- [SSR pages are empty shells — EmailGate gates all rendering client-side](./ssr-pages-are-empty-shells-emailgate.md) - Gotcha
- [structuredClone can't clone Svelte 5 $state proxies — pass $state.snapshot() at the engine boundary](./structuredclone-can-t-clone-svelte-5-state.md) - Gotcha
- [EmailGate remember-me already ships — email persists, gate skips, saved accounts exist](./emailgate-remember-me-already-ships.md) - A feature request to "remember the email on the EmailGate" (2026-09, worktree `kees-remember-me`) turned out to be **already shipped in master** — recon before
- [Vitest/Playwright suite is uncommitted — master branches have no test runner](./vitest-suite-uncommitted-master-has-no-test-runner.md) - The 67 Vitest + 14 Playwright tests documented in [[test-suite]] live **uncommitted in the main working tree** — they are NOT committed to master. Any branch cu
- [Session-only logins are absent from the saved-accounts list — don't gate account switching on it](./session-only-logins-not-in-accounts-list.md) - Gotcha
- [Merged PR doesn't empty the branch](./merged-pr-doesn-t-empty-the-branch.md) - Master's head can be a "Merge pull request #N" commit for a branch while **later commits pushed to that branch are still unmerged**. PR status or merge commits
- [Match API is unauthenticated — the share link is the key](./match-api-unauthenticated.md) - The fact
- [Trebles & Territories code is uncommitted working-tree state — master has no fun games](./trebles-territories-code-is-uncommitted.md) - The state split
- [Trebles & Territories build lives uncommitted in the working tree (survived the git rollback on disk)](./trebles-territories-build-lives-uncommitted-in-the-working-t.md) - Discovered when hunting for the Fun tab / Trebles & Territories code (2026-09): the **entire conquest build exists only as untracked files in the main working t
