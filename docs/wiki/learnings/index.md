# Learnings

- [$env/dynamic/private doesn't resolve in vitest — split the pure logic into its own module](./env-dynamic-private-vitest-split.md) - Vitest can't resolve `$env/dynamic/private` — importing it in a module under test fails at import time.
- [Windows worktree deletion: kill the process holding the directory first](./windows-worktree-delete-kill-holder-first.md) - Symptom
- ["Risk" name collision: new game exploration (Sep 2026) is distinct from the Risk-darts proposal that became Trebles & Territories](./risk-name-collision-new-game-exploration.md) - The name **"Risk"** is ambiguous in this project. It historically refers to the rolled-back **Risk-darts proposal** (documented at [[risk-darts-proposed-game-mo
- [Risk board SVGs: path attribute order varies — extract element-wise, not by regex lookahead](./risk-board-svg-attribute-order.md) - Gotcha
- [Large browser evaluate returns spill to disk wrapped in [UNTRUSTED_PAGE_CONTENT] markers](./large-browser-evaluate-returns-spill-to-disk-wrapped-in-untr.md) - When extracting a large payload (e.g. a 32KB serialized SVG) from a page via the browser, an `evaluate` whose return exceeds the inline threshold spills to a di
- [Patching board SVGs: replace existing attributes, never append duplicates](./patching-board-svgs-replace-existing-attributes-never-append.md) - Gotcha
- [Dartboard SVG paths encode box identity — read (number, ring) from geometry, don't hand-map](./dartboard-svg-paths-encode-box-identity-read-number-ring-fro.md) - The fact
- [SVG path parsing: arc arguments are not points — tokenize by command, never by coordinate-pair regex](./svg-path-parsing-arc-arguments-are-not-points-tokenize-by-co.md) - Gotcha
- [Flipped labels: negate radial offset on left half](./flipped-labels-negate-radial-offset-on-left-half.md) - Gotcha
- [Top-level return in a CJS script skips the file write — silent no-op](./top-level-return-in-a-cjs-script-skips-the-file-write-silent.md) - Gotcha
