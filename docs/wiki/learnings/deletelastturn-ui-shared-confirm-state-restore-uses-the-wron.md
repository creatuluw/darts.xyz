---
type: Learning
title: "deleteLastTurn UI: shared confirm state + restore uses the wrong player's remaining score"
description: **Found during the 2026-10-28 neo-browser delete-turn test campaign**, verified live in both a 2-player and a 3-player match. The trash-icon delete on PlayerPan
tags: [bug, ui, playerpanel, delete, playtest, multiplayer]
timestamp: "2026-10-28T18:11:08.334Z"
---

# deleteLastTurn UI: shared confirm state + restore uses the wrong player's remaining score

**Found during the 2026-10-28 neo-browser delete-turn test campaign**, verified live in both a 2-player and a 3-player match. The trash-icon delete on PlayerPanel has three distinct defects:

1. **Shared confirm state** — `showDeleteConfirm` is ONE shared `$state` for all panels: clicking any panel's trash opens the Delete/Cancel dialog on **every** panel simultaneously (confirmed with 2 and 3 panels).

2. **Wrong restore value** — after deleting the global-last turn via a panel, the affected player is restored to **another player's remaining score**, not their own. Live-verified twice:
   - 2p: B threw last (B at 124 after their 57); deleting via B's panel restored B to **141 = A's remaining**, not B's own 181.
   - 3p: five distinct scores so every restore value was unambiguous; deleting B's turn restored B to **202 = A's remaining**, not B's own 244.

3. **Deletes globally by design, misleadingly placed** — every panel shows the identical trash icon, but the action is always "delete the global last turn". Deleting via player C's panel would delete B's throw (last thrower), not anything of C's. Per-panel placement implies per-panel scope.

Combined with the server-side DELETE no-op ([[turns-delete-endpoint-silently-no-ops-params-id-match-id-shadows-the-turn-id-query-param]]), the UI's local restore is the *only* effect the user sees — until refresh resurrects the turn.

Also net-new confirmed: there is **no edit-turn feature anywhere** in the UI or code — user wants edit = click edit, then re-click the board.
