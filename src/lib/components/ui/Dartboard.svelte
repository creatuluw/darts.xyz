<script lang="ts">
    import type { Multiplier } from "$lib/game";

    let {
        onHit,
        disabled = false,
    }: {
        onHit: (segment: number, multiplier: Multiplier) => void;
        disabled?: boolean;
    } = $props();

    // ── Board constants ──
    const CX = 250,
        CY = 250;

    // BDO/WDF clockwise segment order starting at top (20 at 12 o'clock)
    const NUMBERS = [
        20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
    ];

    // Radii
    const R = {
        bullseye: 15,
        bull: 30,
        innerSingle: 115,
        tripleInner: 115,
        tripleOuter: 130,
        outerSingle: 190,
        doubleInner: 190,
        doubleOuter: 207,
        wireOuter: 220,
        numberMid: 228,
        numberOuter: 245,
    };

    // Colors
    const COL = {
        black: "#191B1B",
        cream: "#F7E3B8",
        red: "#E63624",
        green: "#3A9434",
        wire: "#B9BFBD",
        numText: "#ffffff",
    };

    // ── Geometry helpers ──

    function polarToXY(
        cx: number,
        cy: number,
        r: number,
        angle: number,
    ): { x: number; y: number } {
        return {
            x: cx + r * Math.sin(angle),
            y: cy - r * Math.cos(angle),
        };
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

    // ── Pre-compute segment data ──

    const segAngle = (2 * Math.PI) / 20;

    interface SegmentData {
        num: number;
        doublePath: string;
        outerSinglePath: string;
        triplePath: string;
        innerSinglePath: string;
        isEven: boolean;
        isBlack: boolean;
        labelPos: { x: number; y: number };
    }

    const segments: SegmentData[] = NUMBERS.map((num, idx) => {
        const centerAngle = idx * segAngle;
        const startAngle = centerAngle - segAngle / 2;
        const endAngle = centerAngle + segAngle / 2;

        return {
            num,
            doublePath: annularSector(
                CX,
                CY,
                R.doubleInner,
                R.doubleOuter,
                startAngle,
                endAngle,
            ),
            outerSinglePath: annularSector(
                CX,
                CY,
                R.tripleOuter,
                R.outerSingle,
                startAngle,
                endAngle,
            ),
            triplePath: annularSector(
                CX,
                CY,
                R.tripleInner,
                R.tripleOuter,
                startAngle,
                endAngle,
            ),
            innerSinglePath: annularSector(
                CX,
                CY,
                R.bull,
                R.innerSingle,
                startAngle,
                endAngle,
            ),
            isEven: idx % 2 === 0,
            isBlack: idx % 2 !== 0,
            labelPos: polarToXY(CX, CY, R.numberMid, centerAngle),
        };
    });

    // ── Click handler ──
    function hit(seg: number, mult: Multiplier) {
        if (!disabled) onHit(seg, mult);
    }
</script>

<svg
    viewBox="0 0 500 500"
    xmlns="http://www.w3.org/2000/svg"
    class="w-full select-none {disabled
        ? 'opacity-40 pointer-events-none'
        : ''}"
>
    <!-- Outer number ring background -->
    <circle cx={CX} cy={CY} r={R.numberOuter} fill="#0d0d0d" />
    <!-- Wire ring -->
    <circle cx={CX} cy={CY} r={R.wireOuter} fill="#111" />

    {#each segments as seg}
        {@const singleColor = seg.isEven ? COL.cream : COL.black}
        {@const ringColor = seg.isEven ? COL.green : COL.red}

        <!-- Double -->
        <path
            d={seg.doublePath}
            fill={ringColor}
            stroke={COL.wire}
            stroke-width="1.5"
            stroke-linejoin="round"
            class="seg"
            onclick={() => hit(seg.num, 2)}
        >
            <title>D{seg.num} ({seg.num * 2})</title>
        </path>

        <!-- Outer Single -->
        <path
            d={seg.outerSinglePath}
            fill={singleColor}
            stroke={COL.wire}
            stroke-width="1.5"
            stroke-linejoin="round"
            class="seg"
            class:seg-black={seg.isBlack}
            onclick={() => hit(seg.num, 1)}
        >
            <title>{seg.num}</title>
        </path>

        <!-- Triple -->
        <path
            d={seg.triplePath}
            fill={ringColor}
            stroke={COL.wire}
            stroke-width="1.5"
            stroke-linejoin="round"
            class="seg"
            onclick={() => hit(seg.num, 3)}
        >
            <title>T{seg.num} ({seg.num * 3})</title>
        </path>

        <!-- Inner Single -->
        <path
            d={seg.innerSinglePath}
            fill={singleColor}
            stroke={COL.wire}
            stroke-width="1.5"
            stroke-linejoin="round"
            class="seg"
            class:seg-black={seg.isBlack}
            onclick={() => hit(seg.num, 1)}
        >
            <title>{seg.num}</title>
        </path>
    {/each}

    <!-- Outer Bull (25) -->
    <circle
        cx={CX}
        cy={CY}
        r={R.bull}
        fill={COL.red}
        stroke={COL.wire}
        stroke-width="1.5"
        class="seg"
        onclick={() => hit(25, 1)}
    >
        <title>25</title>
    </circle>

    <!-- Bullseye (50) -->
    <circle
        cx={CX}
        cy={CY}
        r={R.bullseye}
        fill={COL.green}
        stroke={COL.wire}
        stroke-width="1.5"
        class="seg"
        onclick={() => hit(25, 2)}
    >
        <title>Bull (50)</title>
    </circle>

    <!-- Number labels -->
    {#each segments as seg}
        <text
            x={seg.labelPos.x}
            y={seg.labelPos.y}
            text-anchor="middle"
            dominant-baseline="central"
            fill={COL.numText}
            font-family="system-ui, sans-serif"
            font-size="13"
            font-weight="700"
            pointer-events="none"
            letter-spacing="0.02em"
        >
            {seg.num}
        </text>
    {/each}

    <!-- Thin outer border -->
    <circle
        cx={CX}
        cy={CY}
        r={R.numberOuter}
        fill="none"
        stroke="#2a2a2a"
        stroke-width="2"
    />
</svg>

<style>
    .seg {
        cursor: pointer;
        transition: filter 0.12s;
    }
    .seg:hover {
        filter: brightness(1.25);
    }
    .seg-black:hover {
        fill: #555555;
    }
</style>
