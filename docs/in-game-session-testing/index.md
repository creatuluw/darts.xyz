# In-game session testing — 2026-09-09

Four full game sessions played through the real UI (BrowserOS neo against the dev server, master `46a429e`), each with the TV second screen open, every turn verified against the engine/API state. Reports + screenshots live in this folder.

## Sessions

| # | Game | Players | Result | Report |
|---|---|---|---|---|
| 1 | Trebles & Territories · Clock 51 | 2 (PT, VOLT) | 🏆 VOLT 32 pts (20 boxes · 6 continents) | [2026-09-09-session-1-tt-2p.md](./2026-09-09-session-1-tt-2p.md) |
| 2 | Risk 42 · Clock 170 | 4 (PT, VOLT, KAAL, JO) | 🏆 PT 16 pts at the horn (13 boxes · Africa) | [2026-09-09-session-2-risk42-4p.md](./2026-09-09-session-2-risk42-4p.md) |
| 3 | Classic 501 · 1 leg × 1 set | 2 (PT, VOLT) | 🏆 PT in 9 darts (167 avg), VOLT busted once | [2026-09-09-session-3-classic-501-2p.md](./2026-09-09-session-3-classic-501-2p.md) |
| 4 | Classic 501 · 1 leg × 1 set | 4 (PT, VOLT, KAAL, JO) | 🏆 PT in 9 darts on the TV-suggested checkout | [2026-09-09-session-4-classic-501-4p.md](./2026-09-09-session-4-classic-501-4p.md) |
| 5 | Risk 42 world-map TV + commentary fixes | — (verification session) | Map labels aligned (vision-verified 10/10), TvStage oval fixed, commentary queue + persona + grounding | [2026-09-09-session-5-risk-map-and-commentary.md](./2026-09-09-session-5-risk-map-and-commentary.md) |

Screenshots: `screenshots/session1..4/` — referenced from each report.

## Cross-session verdict

### Rules & engines — 100% pass
Every locked rule live-verified at least once: T&T treble-founding, S/D/T sieges, capture-at-0, reinforce cap 3, Shanghai (+1 dart incl. the altar-visit edge), Bull Altar blank-first resurrection, no-blank duels **both branches** (bull save = denied; miss = stolen), clock scoring (1/terr +2/continent), podium math; Risk 42 equal deal (2 armies/box), two-feeder deposits (S+1, T→inner+2, D→outer+2), mirror damage with Arsenal charge (single +2, stacked 25+50=+3), mid-turn capture→deposit chains, continent income with itemized pre-turn budget banner, exile & clawback (0→3 boxes in one turn), clock horn standings; classic scoring/bust/double-out/checkout math/rotation/stat averages — all exact.

### #1 issue — commentary pipeline reliability (P1)
Measured directly: the 4-segment broadcast pipeline (glm-5.3-flash + 4 sequential ElevenLabs TTS calls) takes **~25 s** while `src/lib/server/opencode.ts` caps the LLM call at **20 s** (`TIMEOUT_MS = 20_000`). Delivery rate: **1 of 17 conquest boundaries, 0 of 5 classic boundaries**. Fix candidates: raise the timeout to 45 s and/or parallelize the four TTS calls; also queue/retry boundaries lost while a generation is in flight (TvCommentary currently consumes-and-drops them), and note the API key in `.env` is quoted (`"sk-…"`) — harmless for Vite's parser but worth normalizing.

### When it does land, the commentary is genuinely good
The three successful broadcasts show the goal is attainable: real stat grounding ("PT kocht twee gebieden voor 80 punten, VOLT exact hetzelfde voor 131", "van negen gebieden naar nul gezakt"), distinct personas (spectator "Kick" — *"GOOI EENS EEN TRIPLE EROP MAN! …oh wacht, dat heette hier trebles. TREBLES DAN!"* — and a dry analyst), 4-segment structure with Leo/Theodore swapping per parity, Dutch throughout. Weak spots to fix alongside the timeout: occasional invented facts ("ze gooien niks" — false), an empty outlook segment on one row, and the spectator shown by raw voice-library label ("Hugo_V - Dutch, Selling…") instead of the persona name.

### Gaps vs the fun goal
- **No commentary on Risk 42 TV at all** (scope decision, not a bug) — it's the marathon mode that would benefit most; the conquest pipeline looks portable.
- No bust callout on TV; no commentary playback history on TV.

### Full improvement backlog (per session reports)
Priority order across all feedback IDs: **F1** timeout/parallelization → **F2** in-flight boundary drop → **R1** port commentary to risk TV → **F3** spectator name bug → **F8** grounding instruction → **F9** missing-outlook validation → UX polish (F4/F5 dead-dart & miss logging, R3–R5/R7 risk-42 screen info, C2 bust flash, C4 submit label, D3 `}` template glitch, D2 active-player pulse, F7 TV background hint, F10/R6 preset & cap notes) → design confirmations (F11 Shanghai-into-altar, F12 duel denial ending the visit, R6 uncapped stacks).

### Testing artifacts kept
`_decode-shot.mjs` (screenshot decoder for the neo MCP pipeline), `_risk-state.mjs` (Risk 42 API state dump) — reusable for future sessions.
