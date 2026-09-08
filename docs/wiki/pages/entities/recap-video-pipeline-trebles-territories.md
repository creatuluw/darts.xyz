---
type: Entity
title: Recap Video Pipeline (Trebles & Territories)
description: "The planned Morning-After recap feature for Trebles & Territories: the day after a game, each match gets an LLM-generated recap video, and players who stored an email address receive a link to it."
tags: [trebles-and-territories, recap-videos, hyperframes, pipeline]
timestamp: "2026-09-07T21:48:53.331Z"
---

# Recap Video Pipeline (Trebles & Territories)

The planned **Morning-After recap** feature for [Trebles & Territories](../concepts/risk-darts-proposed-game-mode.md): the day after a game, each match gets an LLM-generated recap video, and players who stored an email address receive a link to it. Specced in §07 of the [implementation spec](../artifacts/trebles-territories-implementation-spec.md); not yet implemented.

## Details

- **Location**: spec §07 in `.specs/trebles-and-territories/spec.html`
- **Pipeline**: daily cron → GLM-5.3-Flash script pass → HyperFrames agent authors the composition (per-match variables, seek-safe keyframes, audio carve) → cloud render → email link
- **Configuration**: GLM via OpenCode Zen endpoint (requires `x-opencode-session` header — see the [endpoint-headers learning](../../learnings/opencode-zen-go-needs-session-header.md)); recipient emails from the [darts email capture](../../learnings/darts-email-localstorage-stores-raw-email.md)
- **External tooling**: HyperFrames (HeyGen) — showcase at hyperframes.heygen.com/showcase, skills at skills.sh/heygen-com/hyperframes; HyperFrames keyframes/audio skills are installed in this workspace

## Relationships

- [risk-darts-proposed-game-mode](../concepts/risk-darts-proposed-game-mode.md) — the game mode it recaps
- [llm-commentary-trebles-territories](../entities/llm-commentary-trebles-territories.md) — sibling LLM feature; recap script reuses the same GLM endpoint
- [trebles-territories-implementation-spec](../artifacts/trebles-territories-implementation-spec.md) — the spec that defines it (§07)

## Lifecycle

- First added: specced as §07 ("Recap Videos / Morning-After"); implementation pending green light on M1.
