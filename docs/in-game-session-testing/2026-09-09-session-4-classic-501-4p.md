# Session 4 — Classic 501, 4 players (1 leg × 1 set)

- **Date**: 2026-09-09 · **Build**: master `46a429e` (localhost:5173)
- **Setup**: Match tab · 501 · 1 leg × 1 set · PT, VOLT, KAAL, JO (throw order)
- **Match id**: `2b1fbec2-fd69-48d3-9845-7425ab3b2cc6`
- **2nd screen**: `/match/{id}/tv` open throughout
- **Result**: 🏆 **PT wins in 9 darts** (visits 180, 180, 141-out on the TV-suggested route). Final standings: PT 0 left, KAAL 153, VOLT 186, JO 376.
- **Screenshots**: `screenshots/session4/` (scorer 4-player end, TV 4-player end)

## 1. Rules & scoring verification

| Turn | Player | Visit | Remaining after | ✓ |
|---|---|---|---|---|
| 1 | PT | T20 T20 T20 = 180 | 321 | ✓ |
| 2 | VOLT | T20 T20 T5 = 125 | 376 | ✓ |
| 3 | KAAL | T19 ×3 = 171 | 330 | ✓ |
| 4 | JO | S20 ×3 = 60 | 441 | ✓ |
| 5 | PT | T20 ×3 = 180 | **141 — checkout range** | ✓ |
| 6 | VOLT | T20 ×3 = 180 | 196 | ✓ |
| 7 | KAAL | T20 T20 T19 = 179 | 151 | ✓ |
| 8 | JO | S20 D20 S5 = 65 | 376 | ✓ |
| 9 | PT | **T20 T19 D12 = 141** (the TV-suggested route) | **0 — double-out checkout** | ✓ |

- Rotation across 4 players correct at every step; averages live and correct (PT 167.0 over 9 darts; VOLT 157.5; KAAL 174.0; JO 62.5 — all verified against visit math).
- **Checkout suggestion accuracy**: TV showed "Checkout 141: T20 → T19 → D12" — 60+57+24 = 141 exactly, and the suggested route was thrown and won the match ✓.

## 2. 4-player rendering (this session's specific coverage)

- **Scorer**: condensed player cards for 3–6 players render around the board (PT 1st / KAAL 2nd / VOLT 3rd / JO 4th with live remaining, Leg avg, darts); full stats per card (tons, 180s); the standings/throw-order strip and dual-layout switch behave per the cards-around-the-board decision.
- **TV**: all four player cards with remaining + live averages; turn banner cycles through all four names; last-visit readout ("JO → 20 D20 5 = 65"); **checkout hint on live turns** ("Checkout 141: T20 → T19 → D12"); freeze card "Wedstrijd afgelopen PT wint met 1–0/0/0 sets" (per-player leg tallies) ✓.

## 3. Commentary

- Layer present, cadence control visible; "Interview komt eraan…" showed generation starting at boundary 4 — and then the failure toast ("Commentaar mislukt") again. No cached rows for either matchRef form. Across sessions 3+4: **0 of 5 classic boundaries delivered** — the F1 timeout dominates short matches (boundaries land while players throw fast; generation takes ~25 s vs the 20 s cap).

## 4. Acceptance criteria verdict

| Criterion | Verdict |
|---|---|
| All Session-3 criteria (scoring, bust, checkout, rotation, stats, TV) | ✅ |
| Condensed 3–6 player cards + standings strip | ✅ |
| Rotation across 4 players | ✅ |
| Stats tab / per-card stats all players | ✅ |
| Commentary quality with more players (cross-player comparisons) | ⚠️ not observable — every boundary failed (F1) |

**Session verdict: PASS** on game + rendering; commentary reliability remains the blocker (0/5 across the classic sessions).

## 5. Feedback / improvements

- **D1 · P1 — commentary reliability now 0-for-5 on classic** (with 1-of-17 on conquest): the single highest-impact fix in this whole test campaign remains the ~25 s pipeline vs `TIMEOUT_MS = 20_000`. Parallelizing the four ElevenLabs TTS calls would cut most of the gap.
- **D2 · P3 — Turn order on TV**: the four cards render in throw order, which is right; consider a subtle "on throw" pulse so spectators can find the active player faster (the banner exists, but peripheral vision goes to the cards).
- **D3 · P3 — Winning-checkout on freeze card**: after the match the TV shows the final visit as text ("PT → T20T19D12} = 141") — note the stray `}` formatting glitch in that readout (likely a template artifact; also seen in Session 3's "T20T15D18} = 141").
- **D4 · Praise**: the TV checkout suggestion turned the finish into a spectator moment — following it verbatim on the last visit is exactly the broadcast-assist behavior you want from a second screen.

## 6. Fun assessment

4-player 501 with the second screen felt like a proper tournament corner: four live average cards, checkout routes on the big screen, and a clean freeze with per-player legs. The missing piece is again the commentary layer — in a 4-player friendly the interviews (who's the shark, who's sandbagging) would carry the between-turns dead time, and it is precisely the part that never fired.
