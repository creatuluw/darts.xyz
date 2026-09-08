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
        if (lastTouchHitTime && performance.now() - lastTouchHitTime < 400) return;
        if (!disabled) onHit(seg, mult);
    }

    // ── Tooltip state ──
    let tooltip = $state<{ label: string; x: number; y: number } | null>(null);
    let wrapperEl: HTMLDivElement | undefined = $state();
    let svgEl: SVGSVGElement | undefined = $state();

    function showTooltip(e: MouseEvent, label: string) {
        if (!wrapperEl || !svgEl || zoomActive) return;
        const rect = wrapperEl.getBoundingClientRect();
        tooltip = {
            label,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    function moveTooltip(e: MouseEvent) {
        if (!tooltip || !wrapperEl || zoomActive) return;
        const rect = wrapperEl.getBoundingClientRect();
        tooltip.x = e.clientX - rect.left;
        tooltip.y = e.clientY - rect.top;
    }

    function hideTooltip() {
        tooltip = null;
    }

    /* ── Touch hover highlight (during zoomed pan) ── */
    let touchHover = $state<{
        segment: number;
        multiplier: 1 | 2 | 3;
        label: string;
        score: number;
    } | null>(null);

    function updateTouchHover(clientX: number, clientY: number) {
        const hit = getHitFromPoint(clientX, clientY);
        if (!hit) {
            touchHover = null;
            return;
        }
        if (hit.segment === 0 || hit.multiplier === 0) {
            touchHover = { segment: 0, multiplier: 0, label: "Miss", score: 0 };
            return;
        }
        const score = hit.segment * hit.multiplier;
        let label: string;
        if (hit.segment === 25) {
            label = hit.multiplier === 2 ? "Bull (50)" : "25";
        } else {
            label =
                (hit.multiplier === 3
                    ? "T"
                    : hit.multiplier === 2
                      ? "D"
                      : "") + hit.segment;
        }
        touchHover = { ...hit, label, score };
    }

    function isTouchHover(seg: number, mult: 1 | 2 | 3) {
        return zoomActive && touchHover?.segment === seg && touchHover?.multiplier === mult;
    }

    /* ── Touch long-press zoom + pan ── */
    const LONG_PRESS_MS = 350;       // iOS / Android standard long-press threshold
    const TAP_SLOP_PX = 15;          // movement allowed before we cancel long-press
    const ZOOM_SCALE = 1.35;
    const MAX_PAN_PX = 120;          // keep board from vanishing off-screen

    let zoomActive = $state(false);
    let longPressTimer: ReturnType<typeof setTimeout> | null = null;
    let touchId: number | null = null;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchMoved = false;
    let lastTouchHitTime = 0;

    // Pan state (only active while zoomed)
    let panX = $state(0);
    let panY = $state(0);
    let prevTouchX = 0;
    let prevTouchY = 0;

    function findTouch(touches: TouchList, id: number): Touch | undefined {
        for (let i = 0; i < touches.length; i++) {
            if (touches[i].identifier === id) return touches[i];
        }
        return undefined;
    }

    function clamp(n: number, min: number, max: number) {
        return Math.max(min, Math.min(max, n));
    }

    /**
     * Convert screen coordinates to SVG internal coordinates (0-500).
     * Accounts for current CSS transform (scale + translate).
     */
    function screenToSvg(clientX: number, clientY: number) {
        if (!svgEl) return null;
        const rect = svgEl.getBoundingClientRect();
        const scaleX = 500 / rect.width;
        const scaleY = 500 / rect.height;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    }

    function getHitFromPoint(clientX: number, clientY: number) {
        const pt = screenToSvg(clientX, clientY);
        if (!pt) return null;

        const dx = pt.x - CX;
        const dy = pt.y - CY;
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
            } else if (d <= R.numberOuter) {
                // Outside the double ring but inside the number ring = miss
                return { segment: 0, multiplier: 0 };
            } else {
                // Completely outside the board = miss
                return { segment: 0, multiplier: 0 };
            }
        }
        return { segment, multiplier };
    }

    function resetZoom() {
        zoomActive = false;
        if (svgEl) svgEl.style.transformOrigin = "";
        panX = 0;
        panY = 0;
        prevTouchX = 0;
        prevTouchY = 0;
        touchHover = null;
    }

    function handleTouchStart(e: TouchEvent) {
        if (disabled) return;
        // Prevent browser default behaviours: context menu, text selection,
        // callout, magnifier, and delayed click synthesis.
        e.preventDefault();

        if (touchId !== null) return;           // ignore multi-touch
        const t = e.touches[0];
        touchId = t.identifier;
        touchStartX = t.clientX;
        touchStartY = t.clientY;
        touchMoved = false;
        panX = 0;
        panY = 0;
        prevTouchX = t.clientX;
        prevTouchY = t.clientY;

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
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Before zoom: if finger drifted past slop, cancel the long-press
        if (!zoomActive && dist > TAP_SLOP_PX) {
            touchMoved = true;
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            return;
        }

        // After zoom: pan by tracking delta between successive move events
        // Inverted so the finger feels like it's sliding across a fixed board
        // (finger moves right → board content shifts left, revealing area to the right)
        if (zoomActive) {
            e.preventDefault();                 // stop browser scrolling while zoomed
            const deltaX = t.clientX - prevTouchX;
            const deltaY = t.clientY - prevTouchY;
            panX = clamp(panX - deltaX, -MAX_PAN_PX, MAX_PAN_PX);
            panY = clamp(panY - deltaY, -MAX_PAN_PX, MAX_PAN_PX);
            prevTouchX = t.clientX;
            prevTouchY = t.clientY;
            updateTouchHover(t.clientX, t.clientY);
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
            e.preventDefault();                 // stop delayed click synthesis
            const hit = getHitFromPoint(t.clientX, t.clientY);
            resetZoom();
            if (hit) { lastTouchHitTime = performance.now(); onHit(hit.segment, hit.multiplier); }
        } else if (!touchMoved) {
            // Short tap = instant score
            const hit = getHitFromPoint(t.clientX, t.clientY);
            if (hit) { lastTouchHitTime = performance.now(); onHit(hit.segment, hit.multiplier); }
        }
        // else: finger scrolled away before zoom → do nothing
    }

    function handleTouchCancel() {
        touchId = null;
        touchMoved = false;
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        resetZoom();
    }
</script>

<div
    class="relative w-full overflow-hidden"
    bind:this={wrapperEl}
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
    ontouchcancel={handleTouchCancel}
    oncontextmenu={(e) => e.preventDefault()}
    style="touch-action: none;"
>
    <svg
        bind:this={svgEl}
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full select-none {disabled
            ? 'opacity-40 pointer-events-none'
            : ''}"
        style="transform: {zoomActive ? `translate(${panX.toFixed(1)}px, ${panY.toFixed(1)}px) scale(${ZOOM_SCALE})` : 'scale(1)'}; transition: {zoomActive ? 'none' : 'transform 0.25s ease-out'}; touch-action: none; will-change: transform;"
    >
        <circle
            cx={CX}
            cy={CY}
            r={R.numberOuter}
            fill="#0d0d0d"
            style="cursor: pointer;"
            onclick={() => hit(0, 0)}
            onmouseenter={(e) => showTooltip(e, "Miss")}
            onmousemove={moveTooltip}
            onmouseleave={hideTooltip}
        />
        <circle
            cx={CX}
            cy={CY}
            r={R.wireOuter}
            fill="#111"
            style="cursor: pointer;"
            onclick={() => hit(0, 0)}
            onmouseenter={(e) => showTooltip(e, "Miss")}
            onmousemove={moveTooltip}
            onmouseleave={hideTooltip}
        />

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
                class:seg-active={isTouchHover(seg.num, 2)}
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
                class:seg-active={isTouchHover(seg.num, 1)}
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
                class:seg-active={isTouchHover(seg.num, 3)}
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
                class:seg-active={isTouchHover(seg.num, 1)}
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
            fill={COL.green}
            stroke={COL.wire}
            stroke-width="1.5"
            class="seg"
            class:seg-active={isTouchHover(25, 1)}
            onclick={() => hit(25, 1)}
            onmouseenter={(e) => showTooltip(e, "25")}
            onmousemove={moveTooltip}
            onmouseleave={hideTooltip}
        />

        <circle
            cx={CX}
            cy={CY}
            r={R.bullseye}
            fill={COL.red}
            stroke={COL.wire}
            stroke-width="1.5"
            class="seg"
            class:seg-active={isTouchHover(25, 2)}
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

    {#if touchHover && zoomActive}
        <div class="pointer-events-none absolute top-2 left-0 right-0 flex justify-between px-3 z-10">
            <div class="rounded-md bg-zinc-900/90 px-2.5 py-1 text-xs font-medium text-white shadow-lg ring-1 ring-white/10">
                {touchHover.label}
            </div>
            <div class="rounded-md bg-zinc-900/90 px-2.5 py-1 text-xs font-medium text-white shadow-lg ring-1 ring-white/10">
                {touchHover.score}
            </div>
        </div>
    {/if}

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
    /* Only apply hover on devices with a fine pointing device (mouse/stylus).
       Touch devices get stuck :hover on the first touched element, which
       would mask our dynamic seg-active highlight. */
    @media (hover: hover) and (pointer: fine) {
        .seg:hover {
            filter: brightness(1.25);
        }
        .seg-black:hover {
            fill: #555555;
        }
    }
    .seg-active {
        filter: brightness(1.7) saturate(1.4) !important;
    }
    .seg-active.seg-black {
        fill: #777777 !important;
    }
</style>
