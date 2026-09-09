// usage: node docs/in-game-session-testing/_decode-shot.mjs <mcpTempOutputFile> <outPath>
// The MCP run tool saves large outputs to a temp file: line "ok" then `return: "<json string>"`.
// This parses the JSON string and writes the bytes to outPath.
import { readFileSync, writeFileSync } from 'node:fs';
const [src, out] = process.argv.slice(2);
const txt = readFileSync(src, 'utf8');
const i = txt.indexOf('return: ');
if (i < 0) throw new Error('no return: marker');
const rest = txt.slice(i + 8).trim();
const lit = rest.replace(/\s+$/, '');
const json = JSON.parse(lit.endsWith('"') ? lit : lit + '"');
writeFileSync(out, Buffer.from(json, 'base64'));
console.log('wrote', out, Buffer.from(json, 'base64').length, 'bytes');
