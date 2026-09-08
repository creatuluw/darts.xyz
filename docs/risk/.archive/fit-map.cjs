// Territory -> dartboard box mapping. Globally-optimal assignment (Hungarian) per
// candidate projection center + compression b. Joint cost:
//   angle: deviation of bearing from wedge center (0..180)
//   radius: distance-rank -> radial position vs box ring center
// Anchors pinned: Iceland -> 5 outer, South Africa -> 3 outer.
const T = {
  Alaska: [225.9, 208.0], Alberta: [284.9, 239.9], 'Northwest Territory': [305.9, 190.1],
  Ontario: [340.4, 254.3], Quebec: [387.9, 249.1], 'Western United States': [292.0, 298.2],
  'Eastern United States': [347.7, 305.8], 'Central America': [294.2, 360.2], Greenland: [424.3, 185.3],
  Iceland: [490.1, 224.0], 'Great Britain': [475.2, 275.0], Scandinavia: [549.3, 222.5],
  'Northern Europe': [543.1, 286.6], 'Western Europe': [493.3, 341.3], 'Southern Europe': [548.6, 337.1],
  Ukraine: [614.4, 267.5], Ural: [689.2, 232.9], Siberia: [717.1, 220.2], Irkutsk: [770.3, 244.7],
  Yakutsk: [777.2, 189.8], Kamchatka: [838.0, 230.0], Mongolia: [779.8, 290.0], China: [755.2, 335.8],
  Siam: [770.7, 407.8], India: [712.1, 392.6], Afghanistan: [668.8, 307.9], 'Middle East': [625.6, 393.5],
  Egypt: [573.8, 407.4], 'North Africa': [524.1, 428.1], 'East Africa': [612.4, 481.5], Congo: [571.7, 492.1],
  'South Africa': [584.3, 552.8], Venezuela: [360.5, 404.3], Peru: [354.3, 458.8], Brazil: [389.9, 461.6],
  Argentina: [370.3, 537.7], Indonesia: [778.8, 483.1], 'New Guinea': [843.6, 465.4],
  'Western Australia': [823.0, 553.1], 'Eastern Australia': [865.9, 548.2],
};
const CONT = {}; [
  ['NA', ['Alaska','Alberta','Northwest Territory','Ontario','Quebec','Western United States','Eastern United States','Central America','Greenland']],
  ['SA', ['Venezuela','Peru','Brazil','Argentina']],
  ['EU', ['Iceland','Great Britain','Scandinavia','Northern Europe','Western Europe','Southern Europe','Ukraine']],
  ['AF', ['Egypt','North Africa','East Africa','Congo','South Africa']],
  ['AS', ['Ural','Siberia','Irkutsk','Yakutsk','Kamchatka','Mongolia','China','Siam','India','Afghanistan','Middle East']],
  ['OC', ['Indonesia','New Guinea','Western Australia','Eastern Australia']],
].forEach(([c, ts]) => ts.forEach(t => CONT[t] = c));

const WEDGE = ['20','1','18','4','13','6','10','15','2','17','3','19','7','16','8','11','14','9','12','5'];
const RI = 3, RO = 6, PIN = { Iceland: '5o', 'South Africa': '3o' };
const allNames = Object.keys(T);
const free = allNames.filter(n => !PIN[n]); // 38 free + 2 pinned

const boxCenter = (wi, ring) => {
  const th = wi * 18 * Math.PI / 180, r = ring === 'i' ? RI : RO;
  return [r * Math.sin(th), -r * Math.cos(th)];
};
const BOXES = [];
for (let wi = 0; wi < 20; wi++) for (const ring of ['i', 'o']) BOXES.push({ wi, ring, c: boxCenter(wi, ring) });

// Hungarian algorithm (O(n^3), 1-indexed, minimization) — standard JV-style potentials
function hungarian(a, n) {
  const INF = 1e9;
  const u = new Array(n + 1).fill(0), v = new Array(n + 1).fill(0), p = new Array(n + 1).fill(0), way = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    p[0] = i; let j0 = 0;
    const minv = new Array(n + 1).fill(INF), used = new Array(n + 1).fill(false);
    do {
      used[j0] = true;
      const i0 = p[j0]; let delta = INF, j1;
      for (let j = 1; j <= n; j++) if (!used[j]) {
        const cur = a[i0][j] - u[i0] - v[j];
        if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
        if (minv[j] < delta) { delta = minv[j]; j1 = j; }
      }
      for (let j = 0; j <= n; j++) {
        if (used[j]) { u[p[j]] += delta; v[j] -= delta; }
        else minv[j] -= delta;
      }
      j0 = j1;
    } while (p[j0] !== 0);
    do { const j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0);
  }
  const ans = new Array(n + 1); // ans[row] = col
  for (let j = 1; j <= n; j++) ans[p[j]] = j;
  return ans;
}

function evaluate(cx, cy, b) {
  const dist = allNames.map(n => Math.hypot(T[n][0] - cx, T[n][1] - cy));
  // radial position from distance rank, power-compressed
  const order = dist.map((d, i) => [d, i]).sort((x, y) => x[0] - y[0]);
  const rpos = new Array(40);
  order.forEach(([d, i], rank) => rpos[i] = RI + (RO - RI) * Math.pow(rank / 39, b));
  const brg = allNames.map(n => {
    const dx = T[n][0] - cx, dy = cy - T[n][1];
    return ((Math.atan2(dx, dy) * 180 / Math.PI) + 360) % 360;
  });
  const pos = allNames.map((n, i) => {
    const th = brg[i] * Math.PI / 180, r = rpos[i];
    return [r * Math.sin(th), -r * Math.cos(th)];
  });
  // cost matrix free territories (38) x free boxes (38)
  const freeBoxIdx = BOXES.map((bx, k) => ({ bx, k })).filter(({ bx }) => !(PIN.Iceland === WEDGE[bx.wi] + bx.ring || PIN['South Africa'] === WEDGE[bx.wi] + bx.ring));
  const N = free.length;
  const a = [null];
  free.forEach((n, i) => {
    const row = [null], gi = allNames.indexOf(n);
    freeBoxIdx.forEach(({ bx }) => {
      row.push((pos[gi][0] - bx.c[0]) ** 2 + (pos[gi][1] - bx.c[1]) ** 2);
    });
    a.push(row);
  });
  const assign = hungarian(a, N);
  let total = 0;
  const boxOf = {};
  free.forEach((n, i) => {
    const { bx } = freeBoxIdx[assign[i + 1] - 1];
    boxOf[n] = bx; total += a[i + 1][assign[i + 1]];
  });
  // pinned
  for (const [n, pin] of Object.entries(PIN)) {
    const wi = WEDGE.indexOf(pin[0]), ring = pin[1];
    boxOf[n] = { wi, ring };
    const gi = allNames.indexOf(n), bx = BOXES.find(x => x.wi === wi && x.ring === ring);
    total += (pos[gi][0] - bx.c[0]) ** 2 + (pos[gi][1] - bx.c[1]) ** 2;
  }
  return { total, boxOf, pos, brg, dist };
}

let best = null;
const tried = [];
for (let cx = 560; cx <= 660; cx += 5)
  for (let cy = 290; cy <= 390; cy += 5)
    for (const b of [0.6, 0.8, 1.0, 1.2, 1.4]) {
      if (allNames.some(n => Math.hypot(T[n][0] - cx, T[n][1] - cy) < 50)) continue;
      const r = evaluate(cx, cy, b);
      tried.push([r.total, cx, cy, b]);
      if (!best || r.total < best.total) best = { cx, cy, b, ...r };
    }
tried.sort((x, y) => x[0] - y[0]).slice(0, 5).forEach(t => console.error('cand', t.map(v => typeof v === 'number' ? v.toFixed(1) : v).join(' ')));

const idxOf = n => allNames.indexOf(n);
console.log(`center (${best.cx}, ${best.cy}) = board bull | compression b=${best.b} | total cost ${best.total.toFixed(1)}\n`);
console.log('WEDGE  INNER                         OUTER');
for (let wi = 0; wi < 20; wi++) {
  const inW = allNames.filter(n => best.boxOf[n].wi === wi && best.boxOf[n].ring === 'i');
  const outW = allNames.filter(n => best.boxOf[n].wi === wi && best.boxOf[n].ring === 'o');
  const pad = s => String(s + ' (' + CONT[s] + ')').padEnd(27);
  const dev = s => { const d = Math.abs(((best.brg[idxOf(s)] - wi * 18 + 540) % 360) - 180); return d.toFixed(0).padStart(2) + '\u00b0'; };
  console.log(String(WEDGE[wi]).padStart(2), ' ', pad(inW[0]), pad(outW[0]), ' dev', dev(inW[0]), '/', dev(outW[0]));
}
const flags = allNames.filter(n => {
  const d = Math.abs(((best.brg[idxOf(n)] - best.boxOf[n].wi * 18 + 540) % 360) - 180);
  return d > 19;
}).map(n => `${n} \u2192 ${WEDGE[best.boxOf[n].wi]}${best.boxOf[n].ring} (${Math.abs(((best.brg[idxOf(n)] - best.boxOf[n].wi * 18 + 540) % 360) - 180).toFixed(0)}\u00b0)`);
console.log('\ndeviations > 19\u00b0 (more than ~1 wedge off bearing):', flags.length ? flags.join(', ') : 'none');
console.log('anchors: Iceland ->', WEDGE[best.boxOf.Iceland.wi] + best.boxOf.Iceland.ring, '| South Africa ->', WEDGE[best.boxOf['South Africa'].wi] + best.boxOf['South Africa'].ring);

// --- emit board preview HTML ---
const SHORT = { 'Northwest Territory': 'NW Terr', 'Western United States': 'W US', 'Eastern United States': 'E US',
  'Northern Europe': 'N Europe', 'Western Europe': 'W Europe', 'Southern Europe': 'S Europe',
  'Western Australia': 'W Australia', 'Eastern Australia': 'E Australia', 'New Guinea': 'N Guinea',
  'Great Britain': 'G Britain', 'Middle East': 'Mid East', 'North Africa': 'N Africa', 'East Africa': 'E Africa',
  'South Africa': 'S Africa', 'Central America': 'C America' };
const CCOL = { NA: '#FFB703', SA: '#8ECAE6', EU: '#BB3E03', AF: '#219EBC', AS: '#126782', OC: '#3A6787' };
const CNAME = { NA: 'North America', SA: 'South America', EU: 'Europe', AF: 'Africa', AS: 'Asia', OC: 'Oceania' };
const P = (r, a) => [250 + r * Math.sin(a * Math.PI / 180), 250 - r * Math.cos(a * Math.PI / 180)];
const sector = (r1, r2, a1, a2) => {
  const [x1, y1] = P(r2, a1), [x2, y2] = P(r2, a2), [x3, y3] = P(r1, a2), [x4, y4] = P(r1, a1);
  return `M ${x1} ${y1} A ${r2} ${r2} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 0 0 ${x4} ${y4} Z`;
};
let g = '';
for (let wi = 0; wi < 20; wi++) {
  const a1 = wi * 18 - 9, a2 = wi * 18 + 9, num = WEDGE[wi];
  const inT = allNames.find(n => best.boxOf[n].wi === wi && best.boxOf[n].ring === 'i');
  const outT = allNames.find(n => best.boxOf[n].wi === wi && best.boxOf[n].ring === 'o');
  const cIn = CCOL[CONT[inT]], cOut = CCOL[CONT[outT]];
  g += `<path d="${sector(14, 74, a1, a2)}" fill="${cIn}" fill-opacity="0.85" stroke="#fff" stroke-width="1.2"/>`;
  g += `<path d="${sector(74, 82, a1, a2)}" fill="#141414"/>`; // treble band
  g += `<path d="${sector(82, 132, a1, a2)}" fill="${cOut}" fill-opacity="0.85" stroke="#fff" stroke-width="1.2"/>`;
  g += `<path d="${sector(132, 140, a1, a2)}" fill="#141414"/>`; // double band
  const [nx, ny] = P(152, wi * 18);
  g += `<text x="${nx}" y="${ny + 5}" text-anchor="middle" font-size="20" font-weight="700" fill="#ddd">${num}</text>`;
  const lab = (t, r) => {
    const [x, y] = P(r, wi * 18), lines = (SHORT[t] || t).split(' ');
    const anchorAng = ((wi * 18 - 180 + 360) % 360) > 180 ? 'start' : 'end';
    const s = lines.map((l, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : 9}">${l}</tspan>`).join('');
    const star = PIN[t] ? ' \u2605' : '';
    g += `<text x="${x}" y="${y}" text-anchor="middle" font-size="8.2" font-weight="700" fill="#0b0b0b">${s.replace('</tspan>', star + '</tspan>')}</text>`;
  };
  lab(inT, 46); lab(outT, 108);
}
g += `<circle cx="250" cy="250" r="14" fill="#1f7a1f"/><circle cx="250" cy="250" r="6" fill="#c0392b"/>`;
const legend = Object.entries(CNAME).map(([k, v]) =>
  `<span style="margin-right:14px"><span style="display:inline-block;width:12px;height:12px;background:${CCOL[k]};border:1px solid #000;vertical-align:-1px"></span> ${v}</span>`).join('');
const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Risk \u2192 dartboard mapping</title>
<style>body{background:#12202c;color:#ddd;font-family:system-ui;margin:0;padding:16px;display:flex;flex-direction:column;align-items:center}h1{font-size:16px;margin:0 0 4px}p{font-size:12px;color:#9ab;margin:0 0 10px}</style></head>
<body><h1>Risk \u2192 dartboard \u2014 proximity best-fit (bull = Black Sea, ${best.cx},${best.cy})</h1>
<p>Treble ring feeds the inner box \u00b7 double ring feeds the outer box \u00b7 \u2605 = your anchor\u00b7 pale = deviation &gt;25\u00b0 (dragged to fit)</p>
<svg width="640" height="640" viewBox="0 0 500 500">${g}</svg>
<div style="margin-top:10px">${legend}</div></body></html>`;
require('fs').writeFileSync('docs/risk/board-preview.html', html);
console.log('\nwrote docs/risk/board-preview.html');

// --- patch dart-board-for-map.svg from pristine dart-board-orig.svg ---
{
  const fs = require('fs');
  let svg = fs.readFileSync('docs/risk/dart-board-orig.svg', 'utf8');
  const CCOL2 = { NA: '#FFB703', SA: '#8ECAE6', EU: '#BB3E03', AF: '#219EBC', AS: '#126782', OC: '#3A6787' };
  const CTEXT = { NA: '#111', SA: '#111', EU: '#fff', AF: '#fff', AS: '#fff', OC: '#fff' };
  const SHORT2 = { 'Northwest Territory': 'NW Terr', 'Western United States': 'W US', 'Eastern United States': 'E US',
    'Northern Europe': 'N Europe', 'Western Europe': 'W Europe', 'Southern Europe': 'S Europe',
    'Western Australia': 'W Australia', 'Eastern Australia': 'E Australia', 'New Guinea': 'N Guinea',
    'Great Britain': 'G Britain', 'Middle East': 'Mid East', 'North Africa': 'N Africa', 'East Africa': 'E Africa',
    'South Africa': 'S Africa', 'Central America': 'C America', 'North America': 'N America' };
  const terrOf = {};
  for (const n of allNames) terrOf[WEDGE[best.boxOf[n].wi] + best.boxOf[n].ring] = n;

  const labels = [];
  svg = svg.replace(/<path\b([^>]*)\/>/g, (m, attrs) => {
    if (!/class="seg/.test(attrs)) return m;
    const d = (attrs.match(/\sd="([^"]+)"/) || [])[1];
    if (!d) return m;
    // ring from arc radii
    const radii = [...d.matchAll(/A (\d+(?:\.\d+)?) \1/g)].map(x => +x[1]);
    const rMax = Math.max(...radii), rMin = Math.min(...radii);
    // wedge bearing from first point
    const m0 = d.match(/^M (\S+) (\S+)/);
    const bx = +m0[1] - 250, by = 250 - +m0[2];
    let brg = Math.atan2(bx, by) * 180 / Math.PI; if (brg < 0) brg += 360;
    const wi = Math.round(((brg + 9) % 360) / 18) % 20; // M point sits on the CCW wedge edge
    const num = WEDGE[wi];
    if (rMin >= 190) return m;                    // double ring: keep traditional
    if (rMax - rMin < 20 && rMin >= 110) return m; // treble band: keep traditional
    const ring = rMax <= 115 ? 'i' : 'o';         // inner vs outer single
    const terr = terrOf[num + ring];
    if (!terr) return m;
    const col = CCOL2[CONT[terr]];
    let out = m.replace(/fill="#[0-9A-Fa-f]+"/, `fill="${col}"`);
    if (PIN[terr]) { out = out.replace(/stroke="#A9B1B2"/, 'stroke="#FFD700"').replace(/stroke-width="[\d.]+"/, 'stroke-width="2.5"'); }
    // radial label
    const th = wi * 18;
    const left = th > 180; // flip on left half
    const rot = left ? th + 90 : th - 90;
    const r0 = ring === 'i' ? (left ? 108 : 30) : (left ? 183 : 136);
    const name = SHORT2[terr] || terr;
    labels.push(`<text transform="rotate(${rot} 250 250)" x="${250 + r0}" y="250" dy="3" text-anchor="${left ? 'end' : 'start'}" font-family="system-ui, sans-serif" font-size="8.5" font-weight="700" fill="${CTEXT[CONT[terr]]}" pointer-events="none" letter-spacing="0.02em">${name}</text>`);
    return out;
  });
  svg = svg.replace(/<\/svg>\s*$/, labels.join('') + '\n</svg>');
  fs.writeFileSync('docs/risk/dart-board-for-map.svg', svg);
  console.log('patched docs/risk/dart-board-for-map.svg (' + labels.length + ' labels)');
}
