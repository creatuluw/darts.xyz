---
type: Decision
title: Recap videos via HyperFrames for day-after match reminders
description: Context
tags: [trebles-and-territories, recap-videos, hyperframes, email, spec]
status: proposed
timestamp: "2026-09-07T21:48:53.330Z"
---

# Recap videos via HyperFrames for day-after match reminders

## Context

The user requested that each **Trebles & Territories** game be followed up the day after with a reminder: a recap video created by an LLM. Players who entered an email address receive a link to the video. This is a **separate feature** from the core game engine — specced as §07 of the implementation spec ([[trebles-territories-implementation-spec]]).

Research (showcase: hyperframes.heygen.com/showcase; skills: skills.sh/heygen-com/hyperframes) established HyperFrames' model: HTML-composed video with **seek-safe keyframes**, **audio carve** (voiceover/music mixing), **variables for per-render parametrization**, and CLI/cloud rendering.

## Choice

Pipeline specced in §07 ("Morning-After recap"): **daily cron → GLM-5.3-Flash script pass (reusing the verified OpenCode Zen endpoint, see [[opencode-zen-go-needs-session-header]]) → HyperFrames agent authors the composition with per-match variables → cloud render → email the link to players with a stored address** (email capture per [[darts-email-localstorage-stores-raw-email]]).

## Alternatives considered

- **Plain-text email reminder, no video** — cheapest, but drops the requested delight factor.
- **Manual/human video editing** — doesn't scale to one video per match per day.
- **Other programmatic video stacks (Remotion etc.)** — HyperFrames skills are already installed in this workspace and its HTML-composition model matches the existing web stack; per-match parametrization via variables is native.

## Consequences

- Adds infra: a daily cron job, cloud render dependency, and email delivery of links.
- Players without an email address get no reminder (link-only delivery).
- GLM writes the recap script, reusing the already-tested commentary integration rather than a second LLM path.

Status: **proposed** — specced in §07; implementation not started (M1 engine green light still pending).
