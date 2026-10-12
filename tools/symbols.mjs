import fs from 'node:fs';
import path from 'node:path';
import {root, output, linesOf} from './inventory.mjs';

const manifest = JSON.parse(fs.readFileSync(path.join(output, 'MANIFEST.json'), 'utf8'));
const symbols = [];
for (const entry of manifest.files.filter(e => e.status === 'analyzed' && e.path.endsWith('.proto'))) {
  const lines = linesOf(fs.readFileSync(path.join(root, entry.path), 'utf8'));
  let block = false;
  let namespace = '';
  const scopes = [];
  for (let i = 0; i < lines.length; i++) {
    let code = '';
    for (let j = 0; j < lines[i].length; j++) {
      const pair = lines[i].slice(j, j + 2);
      if (block) { if (pair === '*/') { block = false; j++; } continue; }
      if (pair === '/*') { block = true; j++; continue; }
      if (pair === '//') break;
      code += lines[i][j];
    }
    const pkg = code.match(/^\s*package\s+([\w.]+)\s*;/);
    if (pkg) namespace = pkg[1];
    const declaration = code.match(/^\s*(message|enum|oneof)\s+(\w+)\s*\{/);
    const field = code.match(/^\s*((?:(?:optional|repeated)\s+)?(?:map<[^>]+>|[\w.]+))\s+(\w+)\s*=\s*(\d+)\s*;/);
    const value = code.match(/^\s*(\w+)\s*=\s*(\d+)\s*;/);
    const parent = [namespace, ...scopes.filter(s => s.kind !== 'oneof').map(s => s.name)].join('.');
    const found = declaration || field || value;
    if (found) {
      const kind = declaration ? declaration[1] : field ? 'field' : 'enum-value';
      const name = declaration ? declaration[2] : field ? field[2] : value[1];
      symbols.push({name: `${parent}.${name}`, kind, path: entry.path, line: i + 1,
        signature: code.trim(), visibility: 'public schema',
        oneof: scopes.findLast(s => s.kind === 'oneof')?.name ?? null,
        analysis: entry.l2_document,
        behavior: 'See authored range analysis in the linked L2 document; declaration retained exactly.',
        callers: 'Not applicable to schema declarations; runtime consumers not yet indexed.',
        callees: 'Not applicable; field type is a schema reference, not a function call.'});
    }
    for (const brace of code.matchAll(/[{}]/g)) {
      if (brace[0] === '{') scopes.push(declaration ? {kind: declaration[1], name: declaration[2]} : {kind: 'unknown', name: '?'});
      else scopes.pop();
    }
  }
}
const manualPath = path.join(output, 'analysis', 'rust-symbols.json');
if (fs.existsSync(manualPath)) {
  for (const item of JSON.parse(fs.readFileSync(manualPath,'utf8'))) {
    const entry = manifest.files.find(e=>e.path===item.path);
    if (!entry || entry.status!=='analyzed') throw new Error(`Manual symbol from unanalyzed file: ${item.path}`);
    const lines=linesOf(fs.readFileSync(path.join(root,item.path),'utf8'));
    symbols.push({...item,signature:lines.slice(item.line-1,item.end_line??item.line).join(' ').trim(),analysis:entry.l2_document});
  }
}
symbols.sort((a,b) => a.name.localeCompare(b.name) || a.path.localeCompare(b.path) || a.line - b.line);
fs.mkdirSync(path.join(output, 'L3-symbols'), {recursive:true});
fs.writeFileSync(path.join(output,'L3-symbols/symbols.json'), JSON.stringify(symbols,null,2)+'\n');
const rows = symbols.map(s => `| \`${s.name}\` | ${s.kind} | \`${s.signature.replaceAll('|','\\|')}\` | [${s.path}:${s.line}-${s.end_line??s.line}](../${s.analysis}) |`);
fs.writeFileSync(path.join(output,'L3-symbols/symbol-index.md'), [
  '# Symbol index',
  '**INCOMPLETE.** This index covers all analyzed protobufs, explicitly reviewed Rust symbols and the exact-version Python fixture generator. Most Rust and all Python/Java binding symbols remain pending. It is not the full public API catalog or a resolved whole-program call graph.',
  '[Orientation](../L0-orientation.md) · [Module](../L1-modules/protos.md) · [Contracts](behavior-contracts.md) · [Format](format-spec.md) · [Machine-readable symbols](symbols.json)',
  `Indexed declarations: ${symbols.length}. Signatures are literal declarations; schema numeric assignments are protobuf tags or enum values. Rust/Python visibility and local call relationships are recorded in symbols.json and the linked L2 analysis. Behavioral explanations are the contiguous authored ranges in each linked L2 document.`,
  'Callers/callees do not apply to schema data declarations; generated-code consumers remain unindexed. Reviewed local callees and observed lexical use sites are distinguished from a complete resolved call graph. Do not infer runtime registration or writer support from a declaration alone.',
  '| Fully qualified name | Kind | Exact declaration | Evidence and behavior analysis |\n|---|---|---|---|',
  rows.join('\n')
].join('\n\n')+'\n');
console.log(JSON.stringify({symbols:symbols.length, files: new Set(symbols.map(s=>s.path)).size}));
