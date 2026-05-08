<script lang="ts">
    import type { Multiplier } from "$lib/game";

    let {
        onHit,
        disabled = false,
    }: {
        onHit: (segment: number, multiplier: Multiplier) => void;
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
        numberMid: 228,
        numberOuter: 245,
    };

    const COL = {
        black: "#1E2122",
        cream: "#FCE7BC",
        red: "#E63723",
        green: "#3A9434",
        wire: "#A9B1B2",
        numText: "#ffffff",
    };

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
            isEven: idx % 2 !== 0,
            isBlack: idx % 2 === 0,
            labelPos: polarToXY(CX, CY, R.numberMid, centerAngle),
        };
    });

    function hit(seg: number, mult: Multiplier) {
        if (!disabled) onHit(seg, mult);
    }

    // ── Tooltip state ──
    let tooltip = $state<{ label: string; x: number; y: number } | null>(null);
    let wrapperEl: HTMLDivElement | undefined = $state();
    let svgEl: SVGSVGElement | undefined = $state();

    function showTooltip(e: MouseEvent, label: string) {
        if (!wrapperEl || !svgEl) return;
        const rect = wrapperEl.getBoundingClientRect();
        const svgRect = svgEl.getBoundingClientRect();
        const scale = svgRect.width / 500;
        tooltip = {
            label,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    function moveTooltip(e: MouseEvent) {
        if (!tooltip || !wrapperEl) return;
        const rect = wrapperEl.getBoundingClientRect();
        tooltip.x = e.clientX - rect.left;
        tooltip.y = e.clientY - rect.top;
    }

    function hideTooltip() {
        tooltip = null;
    }

    /* ── Touch long-press zoom ── */
    let zoomActive = $state(false);
    let longPressTimer: ReturnType<typeof setTimeout> | null = null;
    let touchId: number | null = null;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchMoved = false;
    const LONG_PRESS_MS = 400;
    const MOVE_THRESHOLD_PX = 15;

    function findTouch(touches: TouchList, id: number): Touch | undefined {
        for (let i = 0; i < touches.length; i++) {
            if (touches[i].identifier === id) return touches[i];
        }
        return undefined;
    }

    function getHitFromPoint(clientX: number, clientY: number) {
        if (!svgEl) return null;
        const rect = svgEl.getBoundingClientRect();
        const scaleX = 500 / rect.width;
        const scaleY = 500 / rect.height;
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;
        const dx = x - CX;
        const dy = y - CY;
        const d = Math.sqrt(dx * dx + dy * dy);

        let segment = 0;
        let multiplier: 1 | 2 | 3 = 1;

        if (d <= R.bullseye) {
            segment = 25;
            multiplier = 2;
        } else if (d <= R.bull) {
            segment = 25;
            multiplier = 1;
        } else {
            let angle = Math.atan2(dx, -dy);
            if (angle < 0) angle += 2 * Math.PI;
            const idx = Math.floor((angle + segAngle / 2) / segAngle) % 20;
            segment = NUMBERS[idx];

            if (d <= R.innerSingle) {
                multiplier = 1;
            } else if (d <= R.tripleOuter) {
                multiplier = 3;
            } else if (d <= R.outerSingle) {
                multiplier = 1;
            } else if (d <= R.doubleOuter) {
                multiplier = 2;
            } else {
                return null;
            }
        }
        return { segment, multiplier };
    }

    function handleTouchStart(e: TouchEvent) {
        if (disabled) return;
        e.preventDefault();
        if (touchId !== null) return;
        const t = e.touches[0];
        touchId = t.identifier;
        touchStartX = t.clientX;
        touchStartY = t.clientY;
        touchMoved = false;

        longPressTimer = setTimeout(() => {
            if (touchId !== null && !touchMoved) {
                zoomActive = true;
                if (wrapperEl && svgEl) {
                    const rect = wrapperEl.getBoundingClientRect();
                    const ox = ((touchStartX - rect.left) / rect.width) * 100;
                    const oy = ((touchStartY - rect.top) / rect.height) * 100;
                    svgEl.style.transformOrigin = `${ox}% ${oy}%`;
                }
            }
        }, LONG_PRESS_MS);
    }

    function handleTouchMove(e: TouchEvent) {
        if (touchId === null) return;
        const t = findTouch(e.touches, touchId);
        if (!t) return;
        const dx = t.clientX - touchStartX;
        const dy = t.clientY - touchStartY;
        if (Math.sqrt(dx * dx + dy * dy) > MOVE_THRESHOLD_PX) {
            touchMoved = true;
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        }
    }

    function handleTouchEnd(e: TouchEvent) {
        if (touchId === null) return;
        const t = findTouch(e.changedTouches, touchId);
        if (!t) return;
        touchId = null;
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }

        if (zoomActive) {
            zoomActive = false;
            if (svgEl) svgEl.style.transformOrigin = "";
            const hit = getHitFromPoint(t.clientX, t.clientY);
            if (hit) onHit(hit.segment, hit.multiplier);
            e.preventDefault();
        } else if (!touchMoved) {
            const hit = getHitFromPoint(t.clientX, t.clientY);
            if (hit) onHit(hit.segment, hit.multiplier);
            e.preventDefault();
        }
    }

    function handleTouchCancel() {
        touchId = null;
        touchMoved = false;
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        if (zoomActive) {
            zoomActive = false;
            if (svgEl) svgEl.style.transformOrigin = "";
        }
    }
</script>

<div
    class="relative w-full"
    bind:this={wrapperEl}
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
    ontouchcancel={handleTouchCancel}
>
    <svg
        bind:this={svgEl}
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full select-none transition-transform duration-300 ease-out {disabled
            ? 'opacity-40 pointer-events-none'
            : ''} {zoomActive ? 'tablet-zoom' : ''}"
    >
        <circle cx={CX} cy={CY} r={R.numberOuter} fill="#0d0d0d" />
        <circle cx={CX} cy={CY} r={R.wireOuter} fill="#111" />

        {#each segments as seg}
            {@const singleColor = seg.isEven ? COL.cream : COL.black}
            {@const ringColor = seg.isEven ? COL.green : COL.red}

            <path
                d={seg.doublePath}
                fill={ringColor}
                stroke={COL.wire}
                stroke-width="1.5"
                stroke-linejoin="round"
                class="seg"
                onclick={() => hit(seg.num, 2)}
                onmouseenter={(e) => showTooltip(e, "D" + seg.num + " (" + (seg.num * 2) + ")")}
                onmousemove={moveTooltip}
                onmouseleave={hideTooltip}
            />

            <path
                d={seg.outerSinglePath}
                fill={singleColor}
                stroke={COL.wire}
                stroke-width="1.5"
                stroke-linejoin="round"
                class="seg"
                class:seg-black={seg.isBlack}
                onclick={() => hit(seg.num, 1)}
                onmouseenter={(e) => showTooltip(e, `${seg.num}`)}
                onmousemove={moveTooltip}
                onmouseleave={hideTooltip}
            />

            <path
                d={seg.triplePath}
                fill={ringColor}
                stroke={COL.wire}
                stroke-width="1.5"
                stroke-linejoin="round"
                class="seg"
                onclick={() => hit(seg.num, 3)}
                onmouseenter={(e) => showTooltip(e, "T" + seg.num + " (" + (seg.num * 3) + ")")}
                onmousemove={moveTooltip}
                onmouseleave={hideTooltip}
            />

            <path
                d={seg.innerSinglePath}
                fill={singleColor}
                stroke={COL.wire}
                stroke-width="1.5"
                stroke-linejoin="round"
                class="seg"
                class:seg-black={seg.isBlack}
                onclick={() => hit(seg.num, 1)}
                onmouseenter={(e) => showTooltip(e, `${seg.num}`)}
                onmousemove={moveTooltip}
                onmouseleave={hideTooltip}
            />
        {/each}

        <circle
            cx={CX}
            cy={CY}
            r={R.bull}
            fill={COL.red}
            stroke={COL.wire}
            stroke-width="1.5"
            class="seg"
            onclick={() => hit(25, 1)}
            onmouseenter={(e) => showTooltip(e, "25")}
            onmousemove={moveTooltip}
            onmouseleave={hideTooltip}
        />

        <circle
            cx={CX}
            cy={CY}
            r={R.bullseye}
            fill={COL.green}
            stroke={COL.wire}
            stroke-width="1.5"
            class="seg"
            onclick={() => hit(25, 2)}
            onmouseenter={(e) => showTooltip(e, "Bull (50)")}
            onmousemove={moveTooltip}
            onmouseleave={hideTooltip}
        />

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

        <circle
            cx={CX}
            cy={CY}
            r={R.numberOuter}
            fill="none"
            stroke="#2a2a2a"
            stroke-width="2"
        />
    </svg>

    {#if tooltip}
        <div
            class="pointer-events-none absolute whitespace-nowrap rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg ring-1 ring-white/10 -translate-x-1/2 -translate-y-[calc(100%+8px)]"
            style="left:{tooltip.x}px;top:{tooltip.y}px"
            role="tooltip"
        >
            {tooltip.label}
        </div>
    {/if}
</div>

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
    .tablet-zoom {
        transform: scale(1.25);
        transition: transform 0.3s ease-out;
    }
</style>
