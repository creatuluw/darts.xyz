<script lang="ts">
    import { CONTINENT_COLORS, CONTINENT_DARK } from "$lib/game/risk-engine";
    import type { DartHit, RiskGameState } from "$lib/game/risk-engine";

    let {
        state,
        onHit,
        disabled = false,
    }: {
        state: RiskGameState;
        onHit: (hit: DartHit) => void;
        disabled?: boolean;
    } = $props();

    const CX = 250,
        CY = 250;
    const NUMBERS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
    const R = {
        bullseye: 10,
        bull: 22,
        innerSingle: 115,
        tripleInner: 115,
        tripleOuter: 130,
        outerSingle: 190,
        doubleInner: 190,
        doubleOuter: 207,
        numberMid: 228,
    };
    const COL = {
        black: "#1E2122",
        cream: "#FCE7BC",
        red: "#E63723",
        green: "#3A9434",
        wire: "#A9B1B2",
        numText: "#ffffff",
    };
    // label wrapping mirrors docs/risk/risk-dart-board.svg (apply-territory-labels.cjs)
    const LINES: Record<string, string[]> = {
        "Northwest Territory": ["Northwest", "Territory"],
        "Western United States": ["Western", "United States"],
        "Eastern United States": ["Eastern", "United States"],
        "Central America": ["Central", "America"],
        "Great Britain": ["Great", "Britain"],
        "Northern Europe": ["Northern", "Europe"],
        "Western Europe": ["Western", "Europe"],
        "Southern Europe": ["Southern", "Europe"],
        "Middle East": ["Middle", "East"],
        "North Africa": ["North", "Africa"],
        "East Africa": ["East", "Africa"],
        "South Africa": ["South", "Africa"],
        "New Guinea": ["New", "Guinea"],
        "Western Australia": ["Western", "Australia"],
        "Eastern Australia": ["Eastern", "Australia"],
    };

    const boxOf = (id: string) => state.boxes.find((b) => b.id === id);

    const segAngle = (2 * Math.PI) / 20;
    const polarToXY = (r: number, angle: number) => ({ x: CX + r * Math.sin(angle), y: CY - r * Math.cos(angle) });
    function annularSector(r1: number, r2: number, startAngle: number, endAngle: number): string {
        const p1 = polarToXY(r1, startAngle), p2 = polarToXY(r2, startAngle);
        const p3 = polarToXY(r2, endAngle), p4 = polarToXY(r1, endAngle);
        return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${r2} ${r2} 0 0 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${r1} ${r1} 0 0 0 ${p1.x} ${p1.y} Z`;
    }

    const wedges = $derived(
        NUMBERS.map((num, idx) => {
            const center = idx * segAngle;
            const a1 = center - segAngle / 2,
                a2 = center + segAngle / 2;
            const ringColor = idx % 2 === 0 ? COL.red : COL.green;
            // classic Risk continent colors: outer box = body shade, inner box = darker companion
            const outerColor =
                CONTINENT_COLORS[boxOf(`${num}-outer`)?.continent ?? "NA"] ?? COL.cream;
            const singleColor =
                CONTINENT_DARK[boxOf(`${num}-inner`)?.continent ?? "NA"] ?? COL.black;
            const labelPos = polarToXY(R.numberMid, center);
            return {
                num,
                double: annularSector(R.doubleInner, R.doubleOuter, a1, a2),
                outer: annularSector(R.tripleOuter, R.outerSingle, a1, a2),
                treble: annularSector(R.tripleInner, R.tripleOuter, a1, a2),
                inner: annularSector(R.bull, R.innerSingle, a1, a2),
                ringColor,
                singleColor,
                outerColor,
                labelPos,
            };
        }),
    );

    // classic Risk look, same as the map: territories wear their continent color;
    // ownership lives on the TV map badges (removed from the dartboard).
    function ownedFill(_id: string, base: string): string {
        return base;
    }

    // label colors: white on dark fills, dark on light ones
    function textOn(fill: string): string {
        const r = parseInt(fill.slice(1, 3), 16),
            g = parseInt(fill.slice(3, 5), 16),
            b = parseInt(fill.slice(5, 7), 16);
        return r * 0.299 + g * 0.587 + b * 0.114 > 150 ? "#111111" : "#ffffff";
    }

    const labelPos = (ring: "inner" | "outer") => {
        const r = ring === "inner" ? 98 : 166;
        return (idx: number) => polarToXY(r, idx * segAngle);
    };
    const innerLabelPos = labelPos("inner");
    const outerLabelPos = labelPos("outer");

    function hit(seg: number, mult: 1 | 2 | 3, ring?: "inner" | "outer") {
        if (!disabled) onHit({ segment: seg, multiplier: mult, singleRing: ring });
    }
</script>

<svg viewBox="0 0 500 500" class="w-full h-auto select-none" role="img" aria-label="Risk 42 board">
    <circle cx={CX} cy={CY} r={245} fill="#0d0d0d" />
    <circle cx={CX} cy={CY} r={220} fill="#111" />

    {#each wedges as w, idx}
        <g id="wedge-{w.num}">
            <path
                id="seg-{w.num}-double"
                class="seg cursor-pointer transition-opacity hover:opacity-80"
                d={w.double}
                fill={w.ringColor}
                stroke={COL.wire}
                stroke-width="1.5"
                stroke-linejoin="round"
                onclick={() => hit(w.num, 2)}
            />
            <path
                id="seg-{w.num}-outer"
                class="seg cursor-pointer transition-opacity hover:opacity-80"
                d={w.outer}
                fill={ownedFill(`${w.num}-outer`, w.outerColor)}
                stroke={COL.wire}
                stroke-width="1.5"
                stroke-linejoin="round"
                onclick={() => hit(w.num, 1, "outer")}
            />
            <path
                id="seg-{w.num}-treble"
                class="seg cursor-pointer transition-opacity hover:opacity-80"
                d={w.treble}
                fill={w.ringColor}
                stroke={COL.wire}
                stroke-width="1.5"
                stroke-linejoin="round"
                onclick={() => hit(w.num, 3)}
            />
            <path
                id="seg-{w.num}-inner"
                class="seg cursor-pointer transition-opacity hover:opacity-80"
                d={w.inner}
                fill={ownedFill(`${w.num}-inner`, w.singleColor)}
                stroke={COL.wire}
                stroke-width="1.5"
                stroke-linejoin="round"
                onclick={() => hit(w.num, 1, "inner")}
            />

            {#if boxOf(`${w.num}-outer`)?.territory}
                {@const p = outerLabelPos(idx)}
                {@const fill = ownedFill(`${w.num}-outer`, w.outerColor)}
                {@const lines = LINES[boxOf(`${w.num}-outer`)!.territory] ?? [boxOf(`${w.num}-outer`)!.territory]}
                <text
                    x={p.x}
                    y={p.y}
                    text-anchor="middle"
                    font-size="7"
                    font-weight="700"
                    fill={textOn(fill)}
                    pointer-events="none"
                >
                    {#each lines as l, i}
                        <tspan x={p.x} dy={i === 0 ? (lines.length > 1 ? -2 : 3) : 9.5}>{l}</tspan>
                    {/each}
                </text>
            {/if}
            {#if boxOf(`${w.num}-inner`)?.territory}
                {@const p = innerLabelPos(idx)}
                {@const fill = ownedFill(`${w.num}-inner`, w.singleColor)}
                {@const lines = LINES[boxOf(`${w.num}-inner`)!.territory] ?? [boxOf(`${w.num}-inner`)!.territory]}
                <text
                    x={p.x}
                    y={p.y}
                    text-anchor="middle"
                    font-size="7"
                    font-weight="700"
                    fill={textOn(fill)}
                    pointer-events="none"
                >
                    {#each lines as l, i}
                        <tspan x={p.x} dy={i === 0 ? (lines.length > 1 ? -2 : 3) : 9.5}>{l}</tspan>
                    {/each}
                </text>
            {/if}



            <text
                x={w.labelPos.x}
                y={w.labelPos.y}
                text-anchor="middle"
                dominant-baseline="central"
                font-size="13"
                font-weight="700"
                fill={COL.numText}
                pointer-events="none"
            >
                {w.num}
            </text>
        </g>
    {/each}

    <circle
        id="bull-25"
        class="seg cursor-pointer transition-opacity hover:opacity-80"
        cx={CX}
        cy={CY}
        r={R.bull}
        fill={COL.green}
        stroke={COL.wire}
        stroke-width="1.5"
        onclick={() => hit(25, 1)}
    />
    <circle
        id="bull-50"
        class="seg cursor-pointer transition-opacity hover:opacity-80"
        cx={CX}
        cy={CY}
        r={R.bullseye}
        fill={COL.red}
        stroke={COL.wire}
        stroke-width="1.5"
        onclick={() => hit(50, 1)}
    />
</svg>
