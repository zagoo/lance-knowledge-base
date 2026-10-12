import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {root, output, scan, totals, linesOf} from './inventory.mjs';

const iteration = 44;
if (!Number.isInteger(iteration) || iteration < 1) throw new Error('Supply a positive iteration number');
const destination = path.join(output, 'verification', `iteration-${String(iteration).padStart(3,'0')}.json`);

const manifest = JSON.parse(fs.readFileSync(path.join(output,'MANIFEST.json'),'utf8'));
const current = scan();
const baseline = new Map(manifest.files.map(e=>[e.path,e]));
const currentMap = new Map(current.entries.map(e=>[e.path,e]));
const drift = [];
for (const [p,e] of baseline) {
  const now = currentMap.get(p);
  if (!now) {drift.push({path:p,kind:'removed'}); continue;}
  for (const key of ['sha256','size','line_count','classification','representation']) {
    if (e[key] !== now[key]) drift.push({path:p,field:key,before:e[key],after:now[key]});
  }
}
for (const p of currentMap.keys()) if (!baseline.has(p)) drift.push({path:p,kind:'added'});
const issues = [];
const analyzed = manifest.files.filter(e=>e.status==='analyzed');
const sourceLines = entry => linesOf(entry.representation === 'symlink-target'
  ? fs.readlinkSync(path.join(root, entry.path))
  : fs.readFileSync(path.join(root, entry.path), 'utf8'));
const claims = [];
const records = new Set(analyzed.map(e=>e.analysis_record));
for (const record of records) {
  for (const f of JSON.parse(fs.readFileSync(path.join(output,record),'utf8')).files) {
    if (baseline.get(f.path)?.status !== 'analyzed' || baseline.get(f.path)?.analysis_record !== record) continue;
    for (const [start,end,note] of f.ranges) if (start > 7 && end-start > 1) claims.push({path:f.path,start,end,claim:note});
  }
}
for (const e of analyzed) {
  const filename = path.join(output,e.l2_document);
  if (!fs.existsSync(filename)) {issues.push({path:e.path,error:'missing L2'});continue;}
  const doc = fs.readFileSync(filename,'utf8');
  let next=1;
  for (const [a,b] of e.analyzed_ranges) {
    if (a!==next || b<a || !doc.includes(`### Lines ${a}-${b}`)) issues.push({path:e.path,error:'noncontiguous/missing range',range:[a,b]});
    next=b+1;
  }
  if (next!==e.line_count+1) issues.push({path:e.path,error:'unaccounted ending'});
  const src = sourceLines(e);
  for (let i=0;i<src.length;i++) if (!doc.includes(`${String(i+1).padStart(5)} | ${src[i]}\n`)) issues.push({path:e.path,error:'evidence line differs',line:i+1});
}
function markdowns(dir) {
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?markdowns(path.join(dir,e.name)):e.name.endsWith('.md')?[path.join(dir,e.name)]:[]);
}
let citations=0, links=0;
const broken=[];
for (const filename of markdowns(output)) {
  const raw=fs.readFileSync(filename,'utf8');
  const text=raw.replace(/^(`{3,}|~{3,}).*\n[\s\S]*?^\1\s*$/gm,'');
  for (const match of text.matchAll(/(?<![\w/])([\w.\/-]+\.(?:rs|proto|md|toml|py|java|txt|yml|yaml|json|sh)|rust\/lance-table\/protos):(\d+)(?:-(\d+))?/g)) {
    citations++;
    const e=baseline.get(match[1]); const a=Number(match[2]);const b=Number(match[3]||match[2]);
    if (!e || a<1 || b<a || e.line_count===null || b>e.line_count) broken.push({document:path.relative(output,filename),citation:match[0]});
  }
  for (const m of text.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g)) {
    const target=m[1].split('#')[0];
    if (!target || /^(https?:|mailto:)/.test(target)) continue;
    links++;
    if (!fs.existsSync(path.resolve(path.dirname(filename),target))) broken.push({document:path.relative(output,filename),link:target});
  }
}

const report={iteration,reason:'Targeted post-correction integrity check after updating superseded pending-status wording.',at:new Date().toISOString(),coverage:{scope_pass:drift.length===0&&issues.length===0,drift,issues},cross_links:{pass:broken.length===0,citations,links,broken}};fs.writeFileSync(path.join(output,'verification/iteration-044-post-correction.json'),JSON.stringify(report,null,2)+'\n');console.log(report);
