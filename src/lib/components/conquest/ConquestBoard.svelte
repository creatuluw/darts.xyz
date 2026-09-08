<script lang="ts">
    import type { ConquestState, ConquestDart } from "$lib/game/conquest-engine";
    import { CONTINENT_OF } from "$lib/game/conquest-engine";
    import type { Multiplier } from "$lib/game/types";

    let {
        state,
        players,
        onHit,
        pickCandidates = [],
        duelActive = false,
        markers = [],
        disabled = false,
    }: {
        state: ConquestState;
        players: { id: string; name: string; initials: string; color: string }[];
        onHit: (segment: number, multiplier: Multiplier) => void;
        /** Wedges that may be clicked in a pick phase (blank or victim lands). */
        pickCandidates?: number[];
        /** DUEL AT THE ALTAR overlay while the defender throws the save dart. */
        duelActive?: boolean;
        /** Dart markers for the current visit. */
        markers?: ConquestDart[];
        disabled?: boolean;
    } = $props();

    const CX = 250,
        CY = 250;

    const NUMBERS = [
        20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
    ];

    const R = {
        bullseye: 10,
        bull: 22,
        innerSingle: 115,
        tripleInner: 115,
        tripleOuter: 130,
        outerSingle: 190,
        doubleInner: 190,
        doubleOuter: 207,
        wireOuter: 220,
        numberMid: 231,
        numberOuter: 248,
    };

    // spec §04 palette — continent base + darker treble/double ring shades
    const CONTINENT_NAMES = [
        "Gold Coast",
        "Highgate",
        "Iron Ridge",
        "The Pass",
        "Mercia",
        "Fourlands",
    ];
    const CONTINENT_COLORS = [
        "#FFB703",
        "#8ECAE6",
        "#BB3E03",
        "#219EBC",
        "#126782",
        "#3A6787",
    ];
    const CONTINENT_DARK = [
        "#D19602",
        "#63A9C6",
        "#933002",
        "#1A7F98",
        "#0E5164",
        "#274A63",
    ];

    const WIRE = "#A9B1B2";

    function polarToXY(
        cx: number,
        cy: number,
        r: number,
        angle: number,
    ): { x: number; y: number } {
        return { x: cx + r * Math.sin(angle), y: cy - r * Math.cos(angle) };
    }

    function annularSector(
        cx: number,
        cy: number,
        r1: number,
        r2: number,
        startAngle: number,
        endAngle: number,
    ): string {
        const p1 = polarToXY(cx, cy, r1, startAngle);
        const p2 = polarToXY(cx, cy, r2, startAngle);
        const p3 = polarToXY(cx, cy, r2, endAngle);
        const p4 = polarToXY(cx, cy, r1, endAngle);
        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
        return [
            `M ${p1.x} ${p1.y}`,
            `L ${p2.x} ${p2.y}`,
            `A ${r2} ${r2} 0 ${largeArc} 1 ${p3.x} ${p3.y}`,
            `L ${p4.x} ${p4.y}`,
            `A ${r1} ${r1} 0 ${largeArc} 0 ${p1.x} ${p1.y}`,
            "Z",
        ].join(" ");
    }

    /** Player-coloured arc riding the outer rim of a wedge. */
    function rimArc(centerAngle: number): string {
        return annularSector(
            CX,
            CY,
            R.wireOuter + 2,
            R.wireOuter + 13,
            centerAngle - 0.9 * (Math.PI / 20),
            centerAngle + 0.9 * (Math.PI / 20),
        );
    }

    const segAngle = (2 * Math.PI) / 20;

    interface SegmentData {
        num: number;
        ci: number;
        doublePath: string;
        outerSinglePath: string;
        triplePath: string;
        innerSinglePath: string;
        rimPath: string;
        centerAngle: number;
        badgePos: { x: number; y: number };
        pipPos: { x: number; y: number }[];
    }

    const segments: SegmentData[] = NUMBERS.map((num, idx) => {
        const centerAngle = idx * segAngle;
        const startAngle = centerAngle - segAngle / 2;
        const endAngle = centerAngle + segAngle / 2;
        const badge = polarToXY(CX, CY, (R.bull + R.innerSingle) / 2, centerAngle);
        return {
            num,
            ci: CONTINENT_OF[num],
            doublePath: annularSector(CX, CY, R.doubleInner, R.doubleOuter, startAngle, endAngle),
            outerSinglePath: annularSector(CX, CY, R.tripleOuter, R.outerSingle, startAngle, endAngle),
            triplePath: annularSector(CX, CY, R.tripleInner, R.tripleOuter, startAngle, endAngle),
            innerSinglePath: annularSector(CX, CY, R.bull, R.innerSingle, startAngle, endAngle),
            rimPath: rimArc(centerAngle),
            centerAngle,
            badgePos: badge,
            pipPos: [-1, 0, 1].map((o) => ({
                x: badge.x + o * 11,
                y: badge.y + 26,
            })),
        };
    });

    const playerOf = (id: string | null) =>
        id === null ? null : (players.find((p) => p.id === id) ?? null);

    function wedgeTitle(seg: SegmentData): string {
        const t = state.territories[seg.num];
        const owner = playerOf(t.owner);
        const hp = owner ? ` — ${t.hp} HP` : "";
        return `${seg.num} · ${CONTINENT_NAMES[seg.ci]} · ${owner ? owner.name + hp : "unclaimed"}`;
    }

    function markerPos(d: ConquestDart): { x: number; y: number } {
        const seg = segments.find((s) => s.num === d.segment);
        if (!seg) return { x: CX, y: CY }; // bull / miss visual fallback
        const r =
            d.multiplier === 3
                ? (R.tripleInner + R.tripleOuter) / 2
                : d.multiplier === 2
                  ? (R.doubleInner + R.doubleOuter) / 2
                  : (R.innerSingle + R.outerSingle) / 2;
        return polarToXY(CX, CY, r, seg.centerAngle);
    }

    function hit(seg: number, mult: Multiplier) {
        if (!disabled) onHit(seg, mult);
    }

    const isPickable = (num: number) => pickCandidates.includes(num);
</script>

<div class="relative w-full overflow-hidden">
    <svg
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full select-none {disabled ? 'opacity-40 pointer-events-none' : ''}"
        role="img"
        aria-label="Conquest dartboard"
    >
        <circle cx={CX} cy={CY} r={R.numberOuter} fill="#0d0d0d" onclick={() => hit(0, 0)} />
        <circle cx={CX} cy={CY} r={R.wireOuter} fill="#111" onclick={() => hit(0, 0)} />

        {#each segments as seg (seg.num)}
            {@const t = state.territories[seg.num]}
            {@const owner = playerOf(t.owner)}
            {@const base = CONTINENT_COLORS[seg.ci]}
            {@const dark = CONTINENT_DARK[seg.ci]}
            {@const pickable = isPickable(seg.num)}

            <title>{wedgeTitle(seg)}</title>

            <path
                d={seg.doublePath}
                fill={dark}
                stroke={WIRE}
                stroke-width="1.5"
                class="seg"
                onclick={() => hit(seg.num, 2)}
            />
            <path
                d={seg.outerSinglePath}
                fill={base}
                stroke={WIRE}
                stroke-width="1.5"
                class="seg"
                onclick={() => hit(seg.num, 1)}
            />
            <path
                d={seg.triplePath}
                fill={dark}
                stroke={WIRE}
                stroke-width="1.5"
                class="seg"
                onclick={() => hit(seg.num, 3)}
            />
            <path
                d={seg.innerSinglePath}
                fill={base}
                stroke={WIRE}
                stroke-width="1.5"
                class="seg"
                onclick={() => hit(seg.num, 1)}
            />

            {#if owner}
                <!-- player-coloured rim arc -->
                <path d={seg.rimPath} fill={owner.color} pointer-events="none" />
                <!-- HP pips -->
                {#each [0, 1, 2] as i (i)}
                    <circle
                        cx={seg.pipPos[i].x}
                        cy={seg.pipPos[i].y}
                        r="3.6"
                        fill={i < t.hp ? owner.color : "transparent"}
                        stroke="#ffffff"
                        stroke-width="1.4"
                        pointer-events="none"
                    />
                {/each}
            {/if}

            {#if pickable}
                <path
                    d={seg.doublePath}
                    fill="none"
                    stroke="#AE2012"
                    stroke-width="4"
                    stroke-dasharray="7 5"
                    class="pulse"
                    pointer-events="none"
                />
                <path
                    d={seg.innerSinglePath}
                    fill="none"
                    stroke="#AE2012"
                    stroke-width="4"
                    stroke-dasharray="7 5"
                    class="pulse"
                    pointer-events="none"
                />
            {/if}
        {/each}

        <!-- owner initials badges (on top of wedges) -->
        {#each segments as seg (seg.num)}
            {@const t = state.territories[seg.num]}
            {@const owner = playerOf(t.owner)}
            {#if owner}
                <g pointer-events="none">
                    <circle
                        cx={seg.badgePos.x}
                        cy={seg.badgePos.y}
                        r="12"
                        fill={owner.color}
                        stroke="#ffffff"
                        stroke-width="2"
                    />
                    <text
                        x={seg.badgePos.x}
                        y={seg.badgePos.y}
                        text-anchor="middle"
                        dominant-baseline="central"
                        fill="#ffffff"
                        font-family="system-ui, sans-serif"
                        font-size="10.5"
                        font-weight="800"
                    >
                        {owner.initials}
                    </text>
                </g>
            {/if}
        {/each}

        <!-- the Bull Altar -->
        <circle
            cx={CX}
            cy={CY}
            r={R.bull}
            fill="#023047"
            stroke={WIRE}
            stroke-width="1.5"
            class="seg"
            onclick={() => hit(25, 1)}
        ><title>The Bull Altar — dead players resurrect here</title></circle>
        <circle
            cx={CX}
            cy={CY}
            r={R.bullseye}
            fill="#FD9E02"
            stroke={WIRE}
            stroke-width="1.5"
            class="seg"
            onclick={() => hit(25, 2)}
        ><title>Altar core</title></circle>
        <text
            x={CX}
            y={CY - 15}
            text-anchor="middle"
            fill="#FD9E02"
            font-family="system-ui, sans-serif"
            font-size="11"
            font-weight="800"
            pointer-events="none"
        >
            †
        </text>

        {#if duelActive}
            <circle
                cx={CX}
                cy={CY}
                r={R.bull + 12}
                fill="none"
                stroke="#AE2012"
                stroke-width="5"
                class="pulse"
                pointer-events="none"
            />
            <text
                x={CX}
                y={CY + 40}
                text-anchor="middle"
                fill="#AE2012"
                font-family="system-ui, sans-serif"
                font-size="12"
                font-weight="800"
                pointer-events="none"
            >
                DUEL AT THE ALTAR
            </text>
        {/if}

        <!-- numbers ring -->
        {#each segments as seg (seg.num)}
            <text
                x={polarToXY(CX, CY, R.numberMid, seg.centerAngle).x}
                y={polarToXY(CX, CY, R.numberMid, seg.centerAngle).y}
                text-anchor="middle"
                dominant-baseline="central"
                fill="#ffffff"
                font-family="system-ui, sans-serif"
                font-size="13"
                font-weight="700"
                pointer-events="none"
            >
                {seg.num}
            </text>
        {/each}

        <!-- this visit's dart markers -->
        {#each markers as d, i (i)}
            {@const pos = markerPos(d)}
            <circle
                cx={pos.x}
                cy={pos.y}
                r="7"
                fill="#ffffff"
                stroke="#023047"
                stroke-width="2.5"
                pointer-events="none"
            />
        {/each}

        <circle cx={CX} cy={CY} r={R.numberOuter} fill="none" stroke="#2a2a2a" stroke-width="2" />
    </svg>
</div>

<style>
    .seg {
        cursor: pointer;
        transition: filter 0.12s;
    }
    @media (hover: hover) and (pointer: fine) {
        .seg:hover {
            filter: brightness(1.25);
        }
    }
    .pulse {
        animation: conquest-pulse 1.4s ease-in-out infinite;
    }
    @keyframes conquest-pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.35;
        }
    }
</style>
