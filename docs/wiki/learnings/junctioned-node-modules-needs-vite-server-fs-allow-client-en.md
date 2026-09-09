---
type: Learning
title: Junctioned node_modules needs Vite server.fs.allow — client entry 403s otherwise
description: The fact
tags: [vite, worktree, junction, node-modules, e2e]
timestamp: "2026-09-09T12:19:50.348Z"
---

# Junctioned node_modules needs Vite server.fs.allow — client entry 403s otherwise

## The fact

With `node_modules` junctioned from the main checkout (the house worktree trick), the junction target lives **outside the worktree root** — Vite's dev-server fs guard then returns **403 for the client entry**, the page never hydrates, and EmailGate (all rendering is client-side, see [[ssr-pages-are-empty-shells-emailgate]]) never appears. A cold-start dep-optimization race can mask it on first boot, making the failure look intermittent when it's deterministic on a warm server.

## The fix

One line in `vite.config.ts`: add the junction target (e.g. `E:/dart.monster`) to `server.fs.allow`. Landed with PR #13. Every future junctioned worktree needs it for browser/E2E testing — M1 "worked" only because the race happened to hide the wall.
