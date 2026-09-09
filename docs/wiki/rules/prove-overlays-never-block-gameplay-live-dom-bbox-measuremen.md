---
type: Rule
title: "Prove overlays never block gameplay: live-DOM bbox measurement + zero-intersection assert"
description: The guideline
timestamp: "2026-09-09T21:12:32.448Z"
---

# Prove overlays never block gameplay: live-DOM bbox measurement + zero-intersection assert

## The guideline

When UI overlays sit on top of a map/board (TV views especially), don't eyeball placement:

1. **Measure first**: extract the real gameplay-element bboxes (`getBoundingClientRect()` on every territory/path) from the **live page DOM on the running route**, not from the SVG source — TvStage scaling and safe margins mean source coordinates ≠ rendered coordinates (the same page renders 1529×860 in a test window and 1560×1080 on a real TV).
2. **Design into the gaps**: place overlays only in margins proven empty by those measurements.
3. **Assert after**: reload the page and assert every overlay rect intersects **zero** gameplay bboxes. Re-run after any later map or panel change — layout drift is silent.

## When it applies

Any TV/cast view or big-canvas UI where panels float over gameplay geometry (Risk 42 TV today; any future map/board second screen).

## Rationale / evidence

In the Risk 42 TV full-bleed redesign (2026-09-09) the final check ran 4 overlay rects against all 40 territory bboxes in the live DOM and proved 0 intersections — turning "looks fine in a screenshot" into a checkable invariant at a size nobody actually views (window-scaled). See [[risk-42-tv-full-bleed-map-with-overlay-panels-pinned-to-measured-e]].
