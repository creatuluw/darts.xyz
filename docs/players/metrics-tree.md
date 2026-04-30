# Player Metrics Tree

All metrics displayed on the player detail page at `/players/:id`.

## Coding Convention

`[TAB-SEC-NN]` where:
- **TAB** — tab prefix: `P` (Profile) or `I` (Insights)
- **SEC** — section code (2-3 letters, e.g. `SG` Stats Grid, `PO` Performance Overview)
- **NN** — sequential number within the section

```
Player Page
│
├── [P] Tab: PROFILE
│   │
│   ├── [P-SG] Stats Grid (3 columns)
│   │   ├── [P-SG-01] Matches ──────── matchesPlayed (matchesWon)
│   │   ├── [P-SG-02] Sets ─────────── setsPlayed (setsWon)
│   │   └── [P-SG-03] Legs ─────────── legsPlayed (legsWon)
│   │
│   ├── [P-AC] Avg & Checkout (2 columns)
│   │   ├── [P-AC-01] 3-Dart Avg ───── threeDartAvg
│   │   └── [P-AC-02] Double Conv. ─── doubleConversion
│   │
│   ├── [P-SS] Scoring Stats (IconTarget)
│   │   ├── [P-SS-01] 180s ─────────── total180s
│   │   ├── [P-SS-02] 140+ ─────────── total140s
│   │   ├── [P-SS-03] 100+ ─────────── total100s
│   │   ├── ───────────────────────── (separator)
│   │   ├── [P-SS-04] Highest Finish ─ highestFinish
│   │   └── [P-SS-05] Darts Thrown ─── totalDartsThrown
│   │
│   ├── [P-SL] Sets & Legs (IconTrophy)
│   │   ├── [P-SL-01] Sets Played ──── setsPlayed
│   │   ├── [P-SL-02] Sets Won ─────── setsWon
│   │   ├── [P-SL-03] Legs Played ──── legsPlayed
│   │   └── [P-SL-04] Legs Won ─────── legsWon
│   │
│   └── [P-MH] Match History (IconHistory)
│       └── [P-MH-00] Per match entry
│           ├── [P-MH-01] Status ───── status (Completed / Abandoned / In Progress)
│           ├── [P-MH-02] Date ─────── createdAt (locale date string)
│           ├── [P-MH-03] Result ───── winnerId === playerId → Won / Lost
│           └── [P-MH-04] Playing ──── status === "in_progress" → "Playing"
│
└── [I] Tab: INSIGHTS
    │
    │   ├── [I-PO] Performance Overview (4 cards)
    │   │   ├── [I-PO-01] 3-Dart Avg ───── threeDartAvg
    │   │   │   └── Level badges: Elite (>=100) / Pro (>=85) / County (>=70) / Club (>=50) / Beginner (<50)
    │   │   ├── [I-PO-02] First 9 Avg ──── first9Avg (subtitle: "scoring power")
    │   │   ├── [I-PO-03] Double Conv. ─── doubleConversion
    │   │   │   └── Level badges: Elite (>=30%) / Strong (>=20%) / Needs Work (<20%)
    │   │   └── [I-PO-04] Darts / Leg ──── avgDartsPerLeg
    │   │       └── Level badges: Elite (<=16) / Pro (<=19) / County (<=22) / Club (<=27)
    │
    ├── [I-PD] Performance Diagnosis (IconTarget, computed)
    │   ├── [I-PD-01] "Scoring is strong, finishing needs work" ── first9Avg > threeDartAvg + 8
    │   ├── [I-PD-02] "Double conversion is low" ───────────────── doubleConversion < 20 && legsPlayed > 2
    │   ├── [I-PD-03] "Well-rounded performance" ──────────────── threeDartAvg >= 70 (fallback)
    │   └── [I-PD-04] "Build your scoring foundation" ─────────── default fallback
    │
    ├── [I-SD] Scoring Distribution (IconChartBar, bar chart)
    │   ├── [I-SD-01] 0-39 ──────────── range / count / pct
    │   ├── [I-SD-02] 40-59 ─────────── range / count / pct
    │   ├── [I-SD-03] 60-79 ─────────── range / count / pct
    │   ├── [I-SD-04] 80-99 ─────────── range / count / pct
    │   ├── [I-SD-05] 100-139 ───────── range / count / pct (blue)
    │   ├── [I-SD-06] 140-179 ───────── range / count / pct (emerald)
    │   ├── [I-SD-07] 180 ───────────── range / count / pct (amber)
    │   └── [I-SD-08] Ton+ rate ─────── derived: sum(100+) counts / total visits * 100
    │
    ├── [I-CR] Checkout by Range (IconTarget, bar chart)
    │   ├── [I-CR-01] 2-40 ──────────── successes / attempts / pct
    │   ├── [I-CR-02] 41-60 ─────────── successes / attempts / pct
    │   ├── [I-CR-03] 61-80 ─────────── successes / attempts / pct
    │   ├── [I-CR-04] 81-100 ────────── successes / attempts / pct
    │   ├── [I-CR-05] 101-130 ───────── successes / attempts / pct
    │   └── [I-CR-06] 131-170 ───────── successes / attempts / pct
    │
    ├── [I-KM] Key Metrics (IconTrophy, 4 columns)
    │   ├── [I-KM-01] 180s ──────────── total180s (amber)
    │   ├── [I-KM-02] 140+ ──────────── total140s (emerald)
    │   ├── [I-KM-03] 100+ ──────────── total100s (blue)
    │   └── [I-KM-04] Highest Finish ── highestFinish
    │
    └── [I-MT] Match Trend (IconHistory, conditional: perMatch.length > 0)
        └── [I-MT-00] Per match row
            ├── [I-MT-01] Date ──────── date (locale date string)
            ├── [I-MT-02] Result ────── won → W/L, status → "Live" (if in_progress)
            ├── [I-MT-03] Avg ───────── threeDartAvg (emerald >=90, zinc-300 >=70)
            ├── [I-MT-04] CO % ──────── checkoutPct
            ├── [I-MT-05] Legs ──────── legsWon / legsPlayed
            └── [I-MT-06] Darts ─────── dartsThrown
```

## Code Index

| Code | Label | Field | Tab |
|---|---|---|---|
| P-SG-01 | Matches | matchesPlayed, matchesWon | Profile |
| P-SG-02 | Sets | setsPlayed, setsWon | Profile |
| P-SG-03 | Legs | legsPlayed, legsWon | Profile |
| P-AC-01 | 3-Dart Avg | threeDartAvg | Profile |
| P-AC-02 | Double Conv. | doubleConversion | Profile |
| P-SS-01 | 180s | total180s | Profile |
| P-SS-02 | 140+ | total140s | Profile |
| P-SS-03 | 100+ | total100s | Profile |
| P-SS-04 | Highest Finish | highestFinish | Profile |
| P-SS-05 | Darts Thrown | totalDartsThrown | Profile |
| P-SL-01 | Sets Played | setsPlayed | Profile |
| P-SL-02 | Sets Won | setsWon | Profile |
| P-SL-03 | Legs Played | legsPlayed | Profile |
| P-SL-04 | Legs Won | legsWon | Profile |
| P-MH-01 | Status | status | Profile |
| P-MH-02 | Date | createdAt | Profile |
| P-MH-03 | Result | winnerId | Profile |
| P-MH-04 | Playing | status | Profile |
| I-PO-01 | 3-Dart Avg | threeDartAvg | Insights |
| I-PO-02 | First 9 Avg | first9Avg | Insights |
| I-PO-03 | Double Conv. | doubleConversion | Insights |
| I-PO-04 | Darts / Leg | avgDartsPerLeg | Insights |
| I-PD-01 | Scoring strong, finishing needs work | first9Avg, threeDartAvg | Insights |
| I-PD-02 | Double conversion low | doubleConversion, legsPlayed | Insights |
| I-PD-03 | Well-rounded performance | threeDartAvg | Insights |
| I-PD-04 | Build your scoring foundation | — | Insights |
| I-SD-01 | 0-39 bracket | range, count, pct | Insights |
| I-SD-02 | 40-59 bracket | range, count, pct | Insights |
| I-SD-03 | 60-79 bracket | range, count, pct | Insights |
| I-SD-04 | 80-99 bracket | range, count, pct | Insights |
| I-SD-05 | 100-139 bracket | range, count, pct | Insights |
| I-SD-06 | 140-179 bracket | range, count, pct | Insights |
| I-SD-07 | 180 bracket | range, count, pct | Insights |
| I-SD-08 | Ton+ rate | derived | Insights |
| I-CR-01 | 2-40 checkout | successes, attempts, pct | Insights |
| I-CR-02 | 41-60 checkout | successes, attempts, pct | Insights |
| I-CR-03 | 61-80 checkout | successes, attempts, pct | Insights |
| I-CR-04 | 81-100 checkout | successes, attempts, pct | Insights |
| I-CR-05 | 101-130 checkout | successes, attempts, pct | Insights |
| I-CR-06 | 131-170 checkout | successes, attempts, pct | Insights |
| I-KM-01 | 180s | total180s | Insights |
| I-KM-02 | 140+ | total140s | Insights |
| I-KM-03 | 100+ | total100s | Insights |
| I-KM-04 | Highest Finish | highestFinish | Insights |
| I-MT-01 | Date | date | Insights |
| I-MT-02 | Result | won, status | Insights |
| I-MT-03 | Avg | threeDartAvg | Insights |
| I-MT-04 | Double Conv. | doubleConversion | Insights |
| I-MT-05 | Legs | legsWon, legsPlayed | Insights |
| I-MT-06 | Darts | dartsThrown | Insights |

## Data Sources

| Endpoint | Used In | Type |
|---|---|---|
| `GET /api/stats/{playerId}` | Profile tab | `PlayerStats` |
| `GET /api/players/{playerId}/matches` | Profile tab (Match History) | `Match[]` |
| `GET /api/insights/{playerId}` | Insights tab | `PlayerInsights` |
| `GET /api/stats/{playerId}/checkout` | Checkout Breakdown page | `CheckoutBreakdown` |

## Double Conversion Tracking

The **Double Conversion** metric (`doubleConversion`) replaces the legacy **Checkout %** (`checkoutPct`) as the primary finishing metric. It provides a more accurate measurement of a player's ability to finish legs.

### How It Works

**Per-Dart Tracking** (when player is below 170):
- **Double Chance**: After any dart, if the remaining score is **even** (2, 4, 6, ... 170), it's counted as a `doubleChances` — the player left themselves on a double finish
- **Throw on Double**: When a player throws a dart while already on an even number, it's counted as `throwsOnDouble`
- **Tracking State**: If a dart leaves an **odd number**, the `onDoubleChance` flag is cleared. We wait until another dart leaves an **even number** to start counting `throwsOnDouble` again

### Calculation

```
doubleConversion = (checkoutSuccesses / throwsOnDouble) × 100
```

### Rating Levels

| Level | Double Conversion | Description |
|---|---|---|
| Elite | ≥30% | Exceptional finishing ability |
| Strong | ≥20% | Solid doubles under pressure |
| Needs Work | <20% | Room for improvement on doubles |

### Why Double Conversion is Better

| Old Metric (Checkout %) | New Metric (Double Conversion) |
|---|---|
| Turn-based: counts entire turn as attempt | Dart-based: tracks each dart individually |
| Counts busts with remaining ≤170 | Tracks actual throws taken while on a double |
| Less accurate representation | More accurate: measures real finishing opportunities |
| Typical range: 60-80% | Typical range: 20-35% |

### Example Scenario

Player has **98** remaining:
- **Dart 1**: Hits T20 (60), leaves **38** (even) → `doubleChances++`
- **Dart 2**: Hits S18 (18), leaves **20** (even) → `throwsOnDouble++` (throwing while on double)
- **Dart 3**: Hits D10 (20), leaves **0** → Checkout success!

This gives insight into how often players set up double chances and how well they convert them.

## Data Models

### PlayerStats

| Field | Type | Displayed |
|---|---|---|
| matchesPlayed | number | Profile |
| matchesWon | number | Profile |
| setsPlayed | number | Profile |
| setsWon | number | Profile |
| legsPlayed | number | Profile, Insights |
| legsWon | number | Profile, Insights |
| totalDartsThrown | number | Profile |
| totalScore | number | computed only |
| threeDartAvg | number | Profile, Insights |
| checkoutAttempts | number | Insights (checkout ranges) |
| checkoutSuccesses | number | Insights (checkout ranges) |
| checkoutPct | number | Insights (checkout ranges - legacy) |
| doubleChances | number | Profile, Insights |
| throwsOnDouble | number | Profile, Insights |
| doubleConversion | number | Profile, Insights |
| total180s | number | Profile, Insights |
| total140s | number | Profile, Insights |
| total100s | number | Profile, Insights |
| highestFinish | number | Profile, Insights |
| first9Avg | number | Insights |
| avgDartsPerLeg | number | Insights |

### PlayerInsights

| Field | Type | Description |
|---|---|---|
| summary | PlayerStats | Aggregate stats |
| perMatch | MatchInsight[] | Per-match breakdown |
| scoringDistribution | ScoringBracket[] | Score ranges with counts |
| checkoutRanges | CheckoutRange[] | Checkout success by range |

### CheckoutBreakdown

| Field | Type | Description |
|---|---|---|
| checkoutPct | number | Legacy checkout percentage |
| checkoutAttempts | number | Total checkout attempts |
| checkoutSuccesses | number | Successful checkouts |
| doubleChances | number | Times a dart left an even score |
| throwsOnDouble | number | Throws taken while on a double |
| doubleConversion | number | Success rate on double throws |
| checkoutRanges | CheckoutRange[] | Checkout stats by score range |
| bestFinishes | BestFinish[] | Top 4 highest checkout scores |
| recentCheckouts | RecentCheckout[] | Last 10 checkout attempts |
