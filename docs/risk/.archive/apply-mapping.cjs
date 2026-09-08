// Read each seg's true identity (number + ring) from dart-board-orig.svg geometry,
// inject ONLY territory labels (no recoloring — design stays untouched), and emit
// docs/risk/mapping.json: the canonical (number, ring) -> territory data for the game.
const fs = require('fs');
let svg = fs.readFileSync('docs/risk/dart-board-orig.svg', 'utf8');

// locked mapping from the proximity fit (fit-map.cjs derivation, anchors starred)
const MAP = {
  '20i': ['Northern Europe', 'EU'], '20o': ['Scandinavia', 'EU'],
  '1i': ['Ukraine', 'EU'], '1o': ['Siberia', 'AS'],
  '18i': ['Ural', 'AS'], '18o': ['Yakutsk', 'AS'],
  '4i': ['Afghanistan', 'AS'], '4o': ['Irkutsk', 'AS'],
  '13i': ['Mongolia', 'AS'], '13o': ['Kamchatka', 'AS'],
  '6i': ['Siam', 'AS'], '6o': ['China', 'AS'],
  '10i': ['India', 'AS'], '10o': ['New Guinea', 'OC'],
  '15i': ['Indonesia', 'OC'], '15o': ['Eastern Australia', 'OC'],
  '2i': ['Middle East', 'AS'], '2o': ['Western Australia', 'OC'],
  '17i': ['Congo', 'AF'], '17o': ['East Africa', 'AF'],
  '3i': ['Egypt', 'AF'], '3o': ['South Africa', 'AF'],
  '19i': ['North Africa', 'AF'], '19o': ['Argentina', 'SA'],
  '7i': ['Southern Europe', 'EU'], '7o': ['Brazil', 'SA'],
  '16i': ['Venezuela', 'SA'], '16o': ['Peru', 'SA'],
  '8i': ['Western Europe', 'EU'], '8o': ['Central America', 'NA'],
  '11i': ['Eastern United States', 'NA'], '11o': ['Western United States', 'NA'],
  '14i': ['Ontario', 'NA'], '14o': ['Alberta', 'NA'],
  '9i': ['Quebec', 'NA'], '9o': ['Alaska', 'NA'],
  '12i': ['Great Britain', 'EU'], '12o': ['Northwest Territory', 'NA'],
  '5i': ['Greenland', 'NA'], '5o': ['Iceland', 'EU'],
};
const LINES = {
  'Northwest Territory': ['Northwest', 'Territory'], 'Western United States': ['Western', 'United States'], 'Eastern United States': ['Eastern', 'United States'],
  'Central America': ['Central', 'America'], 'Great Britain': ['Great', 'Britain'],
  'Northern Europe': ['Northern', 'Europe'], 'Western Europe': ['Western', 'Europe'], 'Southern Europe': ['Southern', 'Europe'],
  'Middle East': ['Middle', 'East'], 'North Africa': ['North', 'Africa'], 'East Africa': ['East', 'Africa'], 'South Africa': ['South', 'Africa'],
  'New Guinea': ['New', 'Guinea'], 'Western Australia': ['Western', 'Australia'], 'Eastern Australia': ['Eastern', 'Australia'],
};

const WEDGE = ['20', '1', '18', '4', '13', '6', '10', '15', '2', '17', '3', '19', '7', '16', '8', '11', '14', '9', '12', '5'];
const boxes = []; // {key, ring, number, fill}

const out = svg.replace(/<path\b([^>]*)\/>/g, (m, attrs) => {
  if (!/class="seg/.test(attrs)) return m;
  const d = (attrs.match(/\sd="([^"]+)"/) || [])[1];
  if (!d) return m;
  const tok = d.match(/[MLAZmlaz]|-?\d+(?:\.\d+)?/g) || [];
  const pts = [];
  for (let i = 0; i < tok.length;) {
    const c = tok[i++];
    if (c === 'M' || c === 'L' || c === 'm' || c === 'l') pts.push([+tok[i++], +tok[i++]]);
    else if (c === 'A' || c === 'a') { i += 5; pts.push([+tok[i++], +tok[i++]]); } // rx ry rot laf sf x y
  }
  const radii = [...d.matchAll(/A (\d+(?:\.\d+)?) \1/g)].map(x => +x[1]);
  const rMax = Math.max(...radii), rMin = Math.min(...radii);
  // ring identity
  let ring = null;
  if (rMin >= 190) ring = 'd';                                   // double
  else if (rMax - rMin < 20 && rMin >= 110) ring = 't';          // treble
  else if (rMax <= 120) ring = 'i';                              // inner single
  else if (rMin >= 120) ring = 'o';                              // outer single
  if (ring !== 'i' && ring !== 'o') return m;                    // labels only on singles
  // wedge center = circular mean of all point angles (points span one 18-degree wedge)
  let sx = 0, sy = 0;
  for (const [x, y] of pts) { const a = Math.atan2(y - 250, x - 250); sx += Math.cos(a); sy += Math.sin(a); }
  let ctr = Math.atan2(sy, sx) * 180 / Math.PI;                  // screen angle, 0=east, cw
  ctr = ((ctr % 360) + 360) % 360;
  // convert to bearing (0 = top = 20, clockwise): bearing = (screenAngle - 90 + 360) % 360... east=90bearing
  const bearing = (ctr + 90) % 360;
  const number = WEDGE[Math.round(bearing / 18) % 20];
  const key = number + ring;
  if (!MAP[key]) return m;
  const fill = (attrs.match(/fill="(#[0-9A-Fa-f]+)"/) || [])[1];
  boxes.push({ key, number, ring, territory: MAP[key][0], fill });
  return m; // no path modification — design untouched
});

// build labels (added after all paths, before </svg>)
const labels = [];
for (const b of boxes) {
  const wi = WEDGE.indexOf(b.number);
  const th = wi * 18;
  const left = th > 180; // flip on left half so nothing reads upside-down
  const rot = left ? th + 90 : th - 90;
  const r0 = b.ring === 'i' ? (left ? 106 : 44) : (left ? 184 : 136);
  const lines = [b.number + '-' + (b.ring === 'i' ? 'IN' : 'OUT')];
  const tcol = b.fill === '#1E2122' ? '#ffffff' : '#111111';
  const spans = lines.map((l, i) => `<tspan x="${250 + r0}" dy="${i === 0 ? 3.5 : 11}">${l}</tspan>`).join('');
  labels.push(`<text transform="rotate(${rot.toFixed(2)} 250 250)" text-anchor="${left ? 'end' : 'start'}" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="${tcol}" pointer-events="none" letter-spacing="0.03em">${spans}</text>`);
}
fs.writeFileSync('docs/risk/dart-board-for-map.svg', out.replace(/<\/svg>\s*$/, labels.join('') + '\n</svg>'));

// canonical game data: click (number, multiplier) -> territory + armies
const terrByBox = {};
for (const [k, [name, cont]] of Object.entries(MAP)) terrByBox[k] = { name, continent: cont };
const mapping = {
  source: 'derived by docs/risk/fit-map.cjs (proximity fit, bull = Black Sea); locked by design session',
  territories: Object.entries(MAP).map(([k, [name, continent]]) => ({
    name, continent, number: k.slice(0, -1), ring: k.slice(-1) === 'i' ? 'inner' : 'outer',
  })),
  deposits: {
    single: { armies: 1, target: 'the hit box (inner or outer of that number)' },
    double: { armies: 2, target: 'outer box of that number' },
    treble: { armies: 2, target: 'inner box of that number' },
    bull25: null, // TBD — bulls have no function yet
    bull50: null,
  },
  findTerritory: (number, ring) => terrByBox[String(number) + (ring === 'inner' ? 'i' : 'o')]?.name || null,
};
fs.writeFileSync('docs/risk/mapping.json', JSON.stringify(mapping, (k, v) => k === 'findTerritory' ? undefined : v, 2));
console.log('labels injected:', labels.length, '| boxes parsed:', boxes.length);
