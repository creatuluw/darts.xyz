---
type: Learning
title: Neo ref-clicks silently no-op on some SvelteKit buttons — use evaluate el.click()
description: During the 2026-09-09 playtest sessions, driving the real app through BrowserOS neo's CDP-based `input().click(ref)` **failed silently** on several SvelteKit bu
tags: [browseros-neo, automation, testing]
timestamp: "2026-09-09T19:46:47.835Z"
---

# Neo ref-clicks silently no-op on some SvelteKit buttons — use evaluate el.click()

During the 2026-09-09 playtest sessions, driving the real app through BrowserOS neo's CDP-based `input().click(ref)` **failed silently** on several SvelteKit buttons — the "Risk 42 Marathon" format card on `/match/setup?tab=fun` and the "Start turn" gate on `/match/risk` — while the same mechanism worked on pills and player chips. Direct `element.click()` via `browser.evaluate` worked every time. If automating this app: prefer evaluate-with-click over ref clicks for composite buttons; symptom is a click that "lands" but leaves aria-pressed/state unchanged and no error.
