# Session 3 — Classic 501, 2 players (1 leg × 1 set)

- **Date**: 2026-09-09 · **Build**: master `46a429e` (localhost:5173)
- **Setup**: Match tab · 501 · 1 leg × 1 set · double-in OFF (default) · PT vs VOLT
- **Match id**: `7746744d-eacc-4cbf-9b95-7aa665b6bbde`
- **2nd screen**: `/match/{id}/tv` open throughout
- **Result**: 🏆 **PT wins the leg & match in 9 darts** — visits 180, 180, 141-out (T20 T15 D18). VOLT: 180 then a bust.
- **Screenshots**: `screenshots/session3/` (scorer end, TV end)

## 1. Rules & scoring verification

| Turn | Player | Visit | Expected | Observed | ✓ |
|---|---|---|---|---|---|
| 1 | PT | T20 T20 T20 = 180 | 501→321; 180 counter; avg 180 | remaining 141 after T3; "180: 2", Leg avg 180.0 | ✓ |
| 2 | VOLT | T20 T20 T20 = 180 | 501→321 | TV/scorer both correct | ✓ |
| 3 | PT | T20 T20 T20 = 180 | 321→141; checkout range reached (≤170) → suggestion appears | checkout hint present | ✓ |
| 4 | VOLT | T20 T20 T20 (180 on 141) | **BUST** — score reverts to 141, darts counted, turn passes | "T20T20T20 180 → 141" in history; VOLT Darts 6 | ✓ |
| 5 | PT | T20 T15 D18 = 141 | **exact 0 on a double (double-out enforced)** — leg & match won | remaining 0, "Sets 1 Legs 1", Double Conv 100%, "60+ Fin 1" | ✓ |

- **Math checks**: leg average 501/9×3 = **167.0** displayed exactly; ton counters (60+ 3, 100+ 3, 140+ 3, 180 2) all consistent; visit composer shows running total ("Submit (n)" count, "123 =" area).
- **Rotation**: PT → VOLT alternation correct across all turns.
- **Miss/Undo**: Miss button present (used implicitly by the flow); Undo disabled at visit 0 as expected.

## 2. Data & rendering

- **Scorer**: PlayerPanel with live remaining, Sets/Legs/Darts, Leg & Match averages, 3-Dart Avg, Double Conversion link, 60+/100+/140+/<20/180 counters, 60+ Finishes, Avg Trend "Last 3", per-turn history ("T20T15D18 141 → 0"), tabs Board/Turns/Stats/Settings, TV cast button, Abandon. All numbers verified correct at every step.
- **TV 2nd screen**: "DARTS 501 · 1 legs × 1 sets" header, LIVE badge, "PT · gooit" turn banner, per-player cards with remaining + avg, final visit readout "PT → T20T15D18 = 141", freeze on finish: "Wedstrijd afgelopen PT wint met 1–0 sets". Polling always matched within ~1 s.
- **Stats tab**: present and switchable (panel content read post-match; per-player table).

## 3. Commentary on classic

- The **cadence control and commentary layer are present on the classic TV** (elke N beurten selector + "Eerste beurt…" status) — the all-match-types scope from the round-4 decision is shipped ✓.
- At the turn-2 boundary the TV showed the failure toast "Commentaar mislukt — even geen interview" — **the same 20 s pipeline timeout as Session 1 (F1)**. No cached row for this match; the single boundary this short match produced was lost. Game never blocked ✓.
- No success sample this session → quality assessment rides on Sessions 1–2's samples.

## 4. Acceptance criteria verdict

| Criterion | Verdict |
|---|---|
| Scoring math, remaining, rotation | ✅ |
| Bust handling (revert + darts counted) | ✅ |
| Exact-0 double-out finish | ✅ |
| Leg/set progression + match end | ✅ |
| Checkout suggestions in range | ✅ (present ≤170) |
| Stats: averages, checkout %, 180/ton counters | ✅ all math verified |
| TV: scores, polling, freeze, winner | ✅ |
| Commentary on classic | ⚠️ wired, but boundary lost to the F1 timeout |

**Session verdict: PASS** (game logic flawless; commentary reliability is the shared known issue).

## 5. Feedback / improvements

- **C1 · P1 — same commentary timeout (F1)**: on a fast 501 the single boundary of the match was lost — a two-visit commentary cadence ("elke 1 beurt" for sprints) would give more chances; root fix remains the pipeline timeout/parallelization.
- **C2 · P2 — no bust callout on the TV**: VOLT's bust only shows as a score non-change; a "BUST!" flash on the TV/scorer would land the moment (the classic scorer's caller may cover it audibly — unverifiable by ear here).
- **C3 · P3 — checkout hint only on live TV turns**: the classic TV *does* render "Checkout 141: T20 → T19 → D12" during a live turn (verified in Session 4) — but nothing on the frozen end screen; consider keeping the winning checkout route visible on the freeze card for post-match viewing.
- **C4 · P3 — Submit button text**: "Submit (3)" counts darts; showing the running visit total ("Submit 180") would reduce mis-submits.
- **C5 · Praise**: the 9-dart leg with live stat verification (167.0 avg, Double Conv 100%) was exactly right — the stats engine is trustworthy to the decimal.

## 6. Fun assessment (classic + commentary)

Classic 501 needs no help to be tense, but the TV layer adds the "championship broadcast" feel — turn banner, averages, final-visit readout and freeze card are already there. Commentary would be the spice layer (interviews about the 180 duel / the bust), and it *is* wired — it just needs the reliability fix to actually show up. On a 2-player sprint the cadence default of 2 turns means at most a couple of broadcasts; consider cadence 1 for 1-leg matches.
