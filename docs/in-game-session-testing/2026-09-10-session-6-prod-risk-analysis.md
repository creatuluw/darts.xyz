# Session 6 — Risk 42 production playtest & analysis campaign (2026-09-09/10)

**Where**: https://www.dart.monster/ (prod, via BrowserOS neo + vision agent)
**Player**: patrick@hoipippeloi.nl · **Games**: 8 · **Screenshots**: `screenshots/session6/`
**Focus**: rules drift, edge cases, visuals/legends, LLM commentary quality, fun factor, style — inputs for the roadmap.

Games played:

| # | Setup | Result | Focus |
|---|--------|--------|-------|
| 1 | 2P Domination (PT/VOLT) | abandoned mid-game | core mechanics |
| 2 | 3P Clock 170 | horn → 3-way tie → tiebreak → JO | full lifecycle |
| 3 | 4P Clock 170 | mid-game + commentary | colors, live TV |
| 4 | 6P Clock 170 | mid-game | roster cap, 6 colors |
| 5 | 3P Domination | PT wins by full Domination | exile, clawback, continents |
| 6 | 2P Clock 170 | horn → VOLT wins | edge gauntlet + commentary flow |
| 7 | 3P Domination | PT wins | end-screen validation |
| 8 | 6P Domination | PT wins | 6-row end table validation |

---

## 1. Rules verification — zero drift found

Every rule was verified against the engine (`src/lib/game/risk-engine.ts`) **and** observed live on prod:

| Rule | Verdict | Evidence |
|------|---------|----------|
| Deal: all 40 territories, exactly 2 armies each, equal split | ✅ | g1: 20×2 armies each; g2/3/4/5 same invariant on roster sizes 2–6 |
| Miss consumes a dart, changes nothing | ✅ | g1 t4: 3 misses → identical board state |
| Bull 25 = Arsenal +1, 50 = +2 (this turn only, applies to later darts) | ✅ | g1 t2 (25→+1 charged attacks), g6 (50→+2) |
| Single → hit box +1 · treble → inner box +2 · double → outer box +2 | ✅ | g1 t1 (T20→NE+2, D20→outer, S→+1) |
| Attack: enemy box −value; ≤0 → capture at 1 | ✅ | g1 t1 capture-at-1 then +1 = 2; multiple captures across games |
| Continent income: +1 dart/continent (Asia +2), shown pre-turn | ✅ | g5: "4 darts — base 3 · +1 OC" after OC completed |
| Score = boxes + continent points (NA2 SA3 EU3 AF3 AS5 OC3) | ✅ | g5: 24+3=27; g7 end: 40+19=59 with all continents |
| Clock horn at turns = clockTurns × players | ✅ | g2 horn at 43 (14×3), g6 at 29 (14×2) |
| Tie → tiebreak by boxes then armies | ✅ | g2: 3-way 13pt/13box tie → JO (84 arm > 69 > 67) |
| Domination: own all 40 → instant win | ✅ | g5/g7: winner set the moment box 40 flipped |
| Exile: 0 boxes ≠ death, turn keeps rotating | ✅ | g5: VOLT at 0 boxes from turn 8–33, game continues |
| Clawback: exiled player captures a box → back in | ✅ | g5: VOLT captured 4-outer at turn 34 |
| Refresh-resume via server game id | ✅ | g2 mid-game reload → "Resumed campaign", state intact |
| Roster cap 6 | ✅ | g4/g8 with 6 players |

**Engine-vs-copies drift**: none. One copy drift: setup says "Points: 1 per territory, **+2 per complete continent**" but the engine pays 2–5 per continent (NA2…AS5). Update the setup copy or unify.

## 2. Bugs found & fixed during the campaign

1. **P1 — new game silently resumes the old one** (`startRisk` clears `risk42_state` but not `risk42_game_id`): starting a Risk 42 game in a tab with an unfinished game resumed the OLD campaign. Reproduced 2×. *Still open — one-line fix in setup's `startRisk()`.*
2. **P1 — `/api/commentary` 502**: our own catch block returned 502 on ANY upstream error; a single ElevenLabs hiccup killed the whole broadcast. **Fixed + deployed**: per-segment TTS degradation (failed segment → subtitles-only), client 60s fetch timeout.
3. **P1 — broadcast hung on one segment** (root cause of "I don't see the host flow"): `Audio.play()` in throttled/hidden windows stays pending and `onended` never fires → the whole 4-segment broadcast pinned forever. **Fixed + deployed**: every segment resolves at `min(audio end, ~reading time)`.

## 3. Visuals & alignment (vision agent, 5 batches)

**Scorer** — PASS across games: board wears continent colors with territory names, zero player noise on the SVG, Next-up panel in the sidebar above Standings, war log legible. Nit: inner-ring territory labels ("Northern Europe") run tight.

**TV** — PASS: full-bleed map dominant, overlays strictly in measured-empty margins (DOM-proven 0 territory intersections), classic Risk palette correct (incl. greyed-out cut territories Japan/Madagascar), LIVE pill + Dutch ticker read as real broadcast chrome.

**New end screens (games 6–8)** — PASS: scorer swaps the board for the frozen final map + stats strip (turns/captures/⚡/misses) + continent chips; TV winner overlay shows KAMPIOEN + full standings over the dimmed end-state map; commentary drawer lists every segment with role chips/speakers/boundary numbers.

**FAIL — 6-player legibility** (g4, vision-confirmed): PT vs KAAL (two dark reds) indistinguishable; JER-brown blends into Africa; initial chips collide (K = KAAL+KAUW, J = JO+JER). **Fixed in this session (uncommitted)**: hue-spread palette (red/navy/orange/teal/purple/sky) + collision-free chips (KAAL→KAA, KAUW→KAU) + scrim behind the KAMPIOEN podium + Score/Continenten header spacing.

## 4. LLM commentary (DeepSeek deepseek-v4-flash + ElevenLabs)

- **Content: excellent.** Grounded in the real standings (names, box/army counts, even density math: *"43/17 is 2,53 leger per gebied, tegenover 42/23 is 1,83"*), properly Dutch, genuinely funny (*"ongeveer hetzelfde als een iets langere tuinslang bij de buren"*), 4-segment arc intact (question → spectator answer → analysis → cliffhanger).
- **Flow now visible**: role-labeled subtitles (PRESENTATOR/TOESCHOUWER/ANALIST/VOORUITBLIK) advance live; replay drawer fills per segment and survives reloads via `?all=1`.
- **Latency**: ~22–28s per broadcast end-to-end (TTS-dominated; LLM ~1s). Acceptable for every-3-turn cadence; feel would improve with streaming or shorter first segment.

## 5. Fun factor & style assessment

**Works**: the two-screen identity (dartboard to play, world map to spectate) is genuinely novel; Arsenal charge and exile/clawback create stories; war log lines are punchy; clock ladder (170→14 turns) fits an evening.

**Friction**: mid-game ownership is quiet (dark strokes); nothing signals WHY a capture happened (no last-turn recap on TV); commentary arrives late (22–28s) so reactions lag the moment; no comeback mechanic for the scoreboard-visible loser beyond exile.

## 6. Improvement backlog (roadmap inputs, ranked)

1. **Ownership pop on TV map** — brighter badge fills / thicker owner strokes (vision: "quiet ownership encoding" is the weakest link; new palette shipped, stroke weight next).
2. **Instant replay / last-turn recap card on TV** — "PT captured Scandinavia (2 dmg)" as a transient card, not just war log.
3. **Faster commentary**: stream the question segment first (~5s), synthesize the rest in parallel; or pre-generate at boundary-1 turn early.
4. **Per-player match stats** (needs engine counters): captures, territories lost, Arsenal uses, biggest swing turn — feeds the new end screen + player profiles.
5. **Setup copy fix**: continent points 2–5, not "+2".
6. **Start-new-game bug** (P1 above).
7. **Turn timer / pressure option** (fun experiment for couch play).
8. **Sound cues** on capture/horn on TV (voice exists; add SFX).

## 7. Testing points this instruction was missing (now added to the routine)

- **Start-new-game-while-unfinished** (found P1 #1) — always test session-storage lifecycle.
- **Throttled/background TV behavior** — audio + timers hang; any media pipeline needs wall-clock caps (found P1 #3).
- **6-player legibility check** — roster-max games need a dedicated color/chip pass.
- **End-state review** — the game AFTER the last dart (end screens, drawer, rematch) is part of the fun loop; test it every mode.
- **Commentary latency budget** — measure E2E, not just LLM.
- **i18n sweep** — scorer mixes English (Next up, darts, Start turn) with Dutch elsewhere; pick one voice.

## 8. Artifacts

- Screenshots: `screenshots/session6/` (12 files: g1–g4, end screens, drawer, g6–g7 end states)
- Fixes deployed during campaign: commentary 502 + segment-cap + flow labels + drawer + end screens (commits `5e6dc11`, `1cf0d05`)
- Uncommitted after this session: 6-player palette, collision-free chips, scrim, header fix, this report
