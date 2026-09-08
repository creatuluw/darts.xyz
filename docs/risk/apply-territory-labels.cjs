// Label docs/risk/risk-dart-board.svg (the id'd DartBoardInGame clone) with the
// territory names from the world map (docs/risk/risk-board.svg styling: full
// names, wrapped to two lines where needed). Uses path ids, design untouched.
// Idempotent: regenerates risk-dart-board.svg from DartBoardInGame.svg each run.
const fs = require('fs');
let svg = fs.readFileSync('docs/risk/DartBoardInGame.svg', 'utf8');

const MAP = {
  '20i': 'Northern Europe', '20o': 'Scandinavia',
  '1i': 'Ukraine', '1o': 'Siberia',
  '18i': 'Ural', '18o': 'Yakutsk',
  '4i': 'Afghanistan', '4o': 'Irkutsk',
  '13i': 'Mongolia', '13o': 'Kamchatka',
  '6i': 'Siam', '6o': 'China',
  '10i': 'India', '10o': 'New Guinea',
  '15i': 'Indonesia', '15o': 'Eastern Australia',
  '2i': 'Middle East', '2o': 'Western Australia',
  '17i': 'Congo', '17o': 'East Africa',
  '3i': 'Egypt', '3o': 'South Africa',
  '19i': 'North Africa', '19o': 'Argentina',
  '7i': 'Southern Europe', '7o': 'Brazil',
  '16i': 'Venezuela', '16o': 'Peru',
  '8i': 'Western Europe', '8o': 'Central America',
  '11i': 'Eastern United States', '11o': 'Western United States',
  '14i': 'Ontario', '14o': 'Alberta',
  '9i': 'Quebec', '9o': 'Alaska',
  '12i': 'Great Britain', '12o': 'Northwest Territory',
  '5i': 'Greenland', '5o': 'Iceland',
};
// two-line wraps, mirroring the world-map labels
const LINES = {
  'Northwest Territory': ['Northwest', 'Territory'], 'Western United States': ['Western', 'United States'],
  'Eastern United States': ['Eastern', 'United States'], 'Central America': ['Central', 'America'],
  'Great Britain': ['Great', 'Britain'], 'Northern Europe': ['Northern', 'Europe'],
  'Western Europe': ['Western', 'Europe'], 'Southern Europe': ['Southern', 'Europe'],
  'Middle East': ['Middle', 'East'], 'North Africa': ['North', 'Africa'], 'East Africa': ['East', 'Africa'],
  'South Africa': ['South', 'Africa'], 'New Guinea': ['New', 'Guinea'],
  'Western Australia': ['Western', 'Australia'], 'Eastern Australia': ['Eastern', 'Australia'],
};
const NUMBERS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

const fills = {}; // path id -> fill, read from the svg
for (const m of svg.matchAll(/<path id="(seg-[\w-]+)"[^>]*fill="(#[0-9A-Fa-f]+)"/g)) fills[m[1]] = m[2];

const labels = [];
for (const [key, terr] of Object.entries(MAP)) {
  const num = key.slice(0, -1), ring = key.slice(-1);
  const pathId = `seg-${num}-${ring === 'i' ? 'inner' : 'outer'}`;
  const fill = fills[pathId];
  if (!fill) throw new Error('missing ' + pathId);
  const tcol = fill === '#1E2122' ? '#ffffff' : '#111111';
  const wi = NUMBERS.indexOf(+num), thRad = wi * 18 * Math.PI / 180;
  // outer: 20% toward double; inner: +30px toward triple
  const rMid = ring === 'i' ? 68 + 30 : 160 + 0.20 * (190 - 160);
  const cx = 250 + rMid * Math.sin(thRad), cy = 250 - rMid * Math.cos(thRad);
  const lines = LINES[terr] || [terr];
  const fs = 7, lineH = 8.5, chW = 0.54 * fs; // system-ui bold approx
  const w = Math.max(...lines.map(l => l.length)) * chW + 4;
  const h = lines.length * lineH + 3;
  const bg = fill; // patch matches its box color
  const spans = lines.map((l, i) => `<tspan x="${cx.toFixed(1)}" dy="${i === 0 ? (lines.length > 1 ? -1.8 : 2.6) : lineH}">${l}</tspan>`).join('');
  labels.push(`<text id="label-${num}-${ring === 'i' ? 'inner' : 'outer'}" x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${fs}" font-weight="700" fill="${tcol}" pointer-events="none" letter-spacing="0.02em">${spans}</text>`);
}

fs.writeFileSync('docs/risk/risk-dart-board.svg', svg.replace(/<\/svg>\s*$/, labels.join('\n') + '\n</svg>'));
console.log('labels injected:', labels.length);
