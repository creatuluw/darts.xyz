// Generate docs/risk/DartBoardInGame.svg from the Dartboard.svelte geometry,
// wedge by wedge, with self-explanatory ids:
//   <g id="wedge-20"> seg-20-double / seg-20-outer / seg-20-treble / seg-20-inner </g>
//   bull-25, bull-50, num-20..5, rim — same radii, colors, and number order as production.
const fs = require('fs');

const CX = 250, CY = 250;
const NUMBERS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
const R = { bullseye: 10, bull: 22, innerSingle: 115, tripleInner: 115, tripleOuter: 130, outerSingle: 190, doubleInner: 190, doubleOuter: 207, wireOuter: 220, numberMid: 228, numberOuter: 245 };
const COL = { black: '#1E2122', cream: '#FCE7BC', red: '#E63723', green: '#3A9434', wire: '#A9B1B2', numText: '#ffffff' };

const polarToXY = (cx, cy, r, angle) => ({ x: cx + r * Math.sin(angle), y: cy - r * Math.cos(angle) });
function annularSector(cx, cy, r1, r2, startAngle, endAngle) {
  const p1 = polarToXY(cx, cy, r1, startAngle), p2 = polarToXY(cx, cy, r2, startAngle);
  const p3 = polarToXY(cx, cy, r2, endAngle), p4 = polarToXY(cx, cy, r1, endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${r2} ${r2} 0 ${largeArc} 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${r1} ${r1} 0 ${largeArc} 0 ${p1.x} ${p1.y} Z`;
}
const f = n => +n.toFixed(6);

const segAngle = (2 * Math.PI) / 20;
const parts = [];
parts.push(`<svg viewBox="0 0 500 500" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`);
parts.push(`  <circle id="bg-number-ring" cx="${CX}" cy="${CY}" r="${R.numberOuter}" fill="#0d0d0d"/>`);
parts.push(`  <circle id="bg-wire-outer" cx="${CX}" cy="${CY}" r="${R.wireOuter}" fill="#111"/>`);

for (let idx = 0; idx < 20; idx++) {
  const num = NUMBERS[idx];
  const centerAngle = idx * segAngle, startAngle = centerAngle - segAngle / 2, endAngle = centerAngle + segAngle / 2;
  const ringColor = idx % 2 === 0 ? COL.red : COL.green;
  const singleColor = idx % 2 === 0 ? COL.black : COL.cream;
  const rings = [
    [`seg-${num}-double`, R.doubleInner, R.doubleOuter, ringColor],
    [`seg-${num}-outer`, R.tripleOuter, R.outerSingle, singleColor],
    [`seg-${num}-treble`, R.tripleInner, R.tripleOuter, ringColor],
    [`seg-${num}-inner`, R.bull, R.innerSingle, singleColor],
  ];
  parts.push(`  <g id="wedge-${num}">`);
  for (const [id, r1, r2, fill] of rings) {
    const d = annularSector(CX, CY, r1, r2, f(startAngle), f(endAngle));
    parts.push(`    <path id="${id}" class="seg" d="${d}" fill="${fill}" stroke="${COL.wire}" stroke-width="1.5" stroke-linejoin="round"/>`);
  }
  const lp = polarToXY(CX, CY, R.numberMid, centerAngle);
  parts.push(`    <text id="num-${num}" x="${f(lp.x)}" y="${f(lp.y)}" text-anchor="middle" dominant-baseline="central" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="${COL.numText}" pointer-events="none">${num}</text>`);
  parts.push(`  </g>`);
}

parts.push(`  <circle id="bull-25" class="seg" cx="${CX}" cy="${CY}" r="${R.bull}" fill="${COL.green}" stroke="${COL.wire}" stroke-width="1.5"/>`);
parts.push(`  <circle id="bull-50" class="seg" cx="${CX}" cy="${CY}" r="${R.bullseye}" fill="${COL.red}" stroke="${COL.wire}" stroke-width="1.5"/>`);
parts.push(`  <circle id="rim" cx="${CX}" cy="${CY}" r="${R.numberOuter}" fill="none" stroke="#2a2a2a" stroke-width="2"/>`);
parts.push(`</svg>`);

const svg = parts.join('\n');
fs.writeFileSync('docs/risk/DartBoardInGame.svg', svg);

// self-check: geometry identical to dart-board-orig.svg (ignoring ids/attrs order)
const norm = s => [...s.matchAll(/d="([^"]+)"/g)].map(m => m[1].replace(/-?\d+\.\d+/g, x => (+x).toFixed(3))).sort().join('|');
const orig = fs.readFileSync('docs/risk/dart-board-orig.svg', 'utf8');
console.log('paths:', (svg.match(/<path/g) || []).length,
  '| ids:', (svg.match(/id="/g) || []).length,
  '| geometry matches production export:', norm(svg) === norm(orig));
