// usage: node _risk-state.mjs [gameId] — compact Risk 42 state for turn verification
const id = process.argv[2] || '92836cfe-bd8a-4a3f-8a9e-42be35304d80';
const res = await fetch(`http://localhost:5173/api/conquest/${id}`);
const { state } = await res.json();
const P = {};
for (const p of state.players) P[p.id] = p.name;
const g = state.game;
const by = {};
for (const b of g.boxes) (by[P[b.owner] ?? b.owner] = by[P[b.owner] ?? b.owner] ?? []).push(`${b.id}:${b.armies}`);
const t = g.turn;
console.log(`turn ${t.index} | ${P[t.playerId]} | dartsLeft ${t.dartsLeft} | charge ${t.charge} | winner ${g.winner ? P[g.winner] : '-'}`);
for (const [k, v] of Object.entries(by)) console.log(`${k} (${v.length}): ${v.join(' ')}`);
