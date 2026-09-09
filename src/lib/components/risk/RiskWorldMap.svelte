<script lang="ts">
    // World map for the Risk 42 TV second screen — the board's twin surface:
    // dartboard to play (scorer), world map to spectate (TV).
    // Territory shapes come from the generated asset (docs/risk/generate-world-map-asset.cjs);
    // fills are overridden per owning player with the scorer's PLAYER_COLORS.
    import mapFragment from "$lib/assets/risk-world-map.svg?raw";
    import { MAP_ANCHORS, MAP_VIEWBOX } from "$lib/game/risk-map-anchors";
    import { CONTINENT_COLORS } from "$lib/game/risk-engine";
    import type { PlayerId, RiskGameState } from "$lib/game/risk-engine";

    let {
        game,
        playerColor,
        playerInitials,
        activePlayerId = null as PlayerId | null,
    }: {
        game: RiskGameState;
        playerColor: Record<string, string>;
        playerInitials: Record<string, string>;
        activePlayerId?: PlayerId | null;
    } = $props();

    const NEUTRAL = "#232a36";
    // border shade = the continent fill darkened a touch (thinner, quieter than the fill)
    const darken = (hex: string, f = 0.72): string => {
        const r = Math.round(parseInt(hex.slice(1, 3), 16) * f);
        const g = Math.round(parseInt(hex.slice(3, 5), 16) * f);
        const b = Math.round(parseInt(hex.slice(5, 7), 16) * f);
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
    };
    const borderOf = (box: RiskGameState["boxes"][number]) =>
        box.owner
            ? (playerColor[box.owner] ?? "#6b7a90")
            : darken(CONTINENT_COLORS[box.continent] ?? NEUTRAL);
    // Classic Risk look: territories wear their CONTINENT color (reference map
    // docs/risk/risk-board.svg); ownership rides on badge + initials + stroke.
    const baseFill = (box: RiskGameState["boxes"][number]) =>
        CONTINENT_COLORS[box.continent] ?? (box.owner ? (playerColor[box.owner] ?? NEUTRAL) : NEUTRAL);
    const slug = (t: string) => t.toLowerCase().replace(/ /g, "_");

    let mapG = $state(null as SVGGElement | null);

    // inject the generated shapes once
    $effect(() => {
        if (mapG) mapG.innerHTML = mapFragment;
    });

    // repaint ownership whenever the polled state changes
    $effect(() => {
        if (!mapG) return;
        const { boxes } = game; // reactive dep on the polled state
        for (const box of boxes) {
            const el = mapG.querySelector("#" + slug(box.territory));
            if (!el) continue;
            el.setAttribute("fill", baseFill(box));
            // ownership ring: owned territories wear a stroke in the OWNER's
            // color; unowned borders are a darker shade of the continent fill
            el.setAttribute("stroke", borderOf(box));
            el.setAttribute("stroke-width", box.owner ? "1.8" : "0.8");
        }
    });

    const fontSize = 8.6;
    const lineH = 9.6;
</script>

<svg
    viewBox="0 0 {MAP_VIEWBOX.w} {MAP_VIEWBOX.h}"
    preserveAspectRatio="xMidYMid meet"
    class="w-full h-full"
    role="img"
    aria-label="Risk 42 wereldkaart"
>
    <g bind:this={mapG}></g>
    {#each game.boxes as box (box.id)}
        {@const anchor = MAP_ANCHORS[box.territory]}
        {@const color = baseFill(box)}
        {@const nLines = anchor?.lines.length ?? 1}
        {#if anchor}
            <!-- territory name -->
            {#each anchor.lines as line, i}
                <text
                    x={anchor.x}
                    y={anchor.y + i * lineH}
                    text-anchor="middle"
                    font-size={fontSize}
                    font-weight="700"
                    font-family="Arial, Helvetica, sans-serif"
                    fill="#e8edf5"
                    stroke="#0a0f1a"
                    stroke-width="2.2"
                    stroke-linejoin="round"
                    paint-order="stroke fill"
                >{line}</text>
            {/each}
            <!-- army badge: ownership lives here (classic Risk — pieces on continent-colored land) -->
            <g transform="translate({anchor.x}, {anchor.y + nLines * lineH + 4})">
                <circle r="8.6" fill={box.owner ? (playerColor[box.owner] ?? NEUTRAL) : "#3f3f46"} stroke="#ffffff" stroke-width="2" />
                <text
                    text-anchor="middle"
                    dominant-baseline="central"
                    font-size="10.5"
                    font-weight="800"
                    font-family="Arial, Helvetica, sans-serif"
                    fill="#ffffff"
                >{box.armies}</text>
            </g>
            {#if box.owner}
                <text
                    x={anchor.x}
                    y={anchor.y - nLines * lineH - 2}
                    text-anchor="middle"
                    font-size="8.2"
                    font-weight="800"
                    font-family="Arial, Helvetica, sans-serif"
                    fill="#ffffff"
                    stroke="#0a0f1a"
                    stroke-width="2.4"
                    paint-order="stroke fill"
                >{playerInitials[box.owner] ?? ""}</text>
            {/if}
        {/if}
    {/each}
</svg>
