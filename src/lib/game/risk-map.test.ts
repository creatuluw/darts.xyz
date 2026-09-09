import { describe, expect, it } from "vitest";
import mapFragment from "$lib/assets/risk-world-map.svg?raw";
import { MAP_ANCHORS, MAP_VIEWBOX } from "./risk-map-anchors";
import { BOARD } from "./risk-engine";

/**
 * Invariants tying the generated world-map asset to the engine's board:
 * every engine territory must have a paintable country path and a label
 * anchor inside the viewBox. Regenerating either side without the other
 * breaks this test.
 */
describe("risk world map asset", () => {
    const territories = BOARD.map(([, , territory]) => territory);

    it("covers every engine territory with a country path", () => {
        for (const t of territories) {
            const slug = t.toLowerCase().replace(/ /g, "_");
            expect(mapFragment, `missing path #${slug}`).toMatch(new RegExp(`id="${slug}"`));
        }
    });

    it("marks exactly the engine territories as interactive", () => {
        const marked = mapFragment.match(/data-territory="1"/g)?.length ?? 0;
        expect(marked).toBe(territories.length);
    });

    it("anchors every engine territory inside the viewBox", () => {
        for (const t of territories) {
            const a = MAP_ANCHORS[t];
            expect(a, `missing anchor for ${t}`).toBeDefined();
            expect(a.x).toBeGreaterThanOrEqual(0);
            expect(a.x).toBeLessThanOrEqual(MAP_VIEWBOX.w);
            expect(a.y).toBeGreaterThanOrEqual(0);
            expect(a.y).toBeLessThanOrEqual(MAP_VIEWBOX.h);
            expect(a.lines.join(" ")).toBe(t);
        }
    });
});
