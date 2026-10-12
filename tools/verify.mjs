import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {root, output, scan, totals, linesOf} from './inventory.mjs';
import {checkBinary,binaryCitations} from './binary-integrity.mjs';

if (fs.existsSync(path.join(output, 'CORE-MANIFEST.json'))) {
  throw new Error('The user replaced the all-file scope with core-only production analysis. This historical verifier reads excluded tests/binaries and must not run. Follow workflows/analyze-verify.md and CORE-MANIFEST.json.');
}

const iteration = Number(process.argv[2]);
if (!Number.isInteger(iteration) || iteration < 1) throw new Error('Supply a positive iteration number');
const destination = path.join(output, 'verification', `iteration-${String(iteration).padStart(3,'0')}.json`);
if (fs.existsSync(destination)) throw new Error('Evidence already exists; do not overwrite a verification run');
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
const sourceLines = entry => entry.representation === 'binary' ? [] : linesOf(entry.representation === 'symlink-target'
  ? fs.readlinkSync(path.join(root, entry.path))
  : fs.readFileSync(path.join(root, entry.path), 'utf8'));
const claims = [];
const records = new Set(analyzed.map(e=>e.analysis_record));
for (const record of records) {
  for (const f of JSON.parse(fs.readFileSync(path.join(output,record),'utf8')).files) {
    if (baseline.get(f.path)?.status !== 'analyzed' || baseline.get(f.path)?.analysis_record !== record) continue;
    for (const [start,end,note] of f.ranges??[]) if (start > 7 && end-start > 1) claims.push({path:f.path,start,end,claim:note});
    for (const [start,end,note] of f.byte_ranges??[]) claims.push({path:f.path,start,end,unit:'bytes',claim:note});
  }
}
for (const e of analyzed) {
  const filename = path.join(output,e.l2_document);
  if (!fs.existsSync(filename)) {issues.push({path:e.path,error:'missing L2'});continue;}
  const doc = fs.readFileSync(filename,'utf8');
  if(e.representation==='binary'){
    const analysis=JSON.parse(fs.readFileSync(path.join(output,e.analysis_record))).files.find(f=>f.path===e.path);
    issues.push(...checkBinary(e,analysis,doc));continue;
  }
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
  const binary=binaryCitations(text,baseline,path.relative(output,filename));citations+=binary.count;broken.push(...binary.broken);
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
const seed=crypto.randomBytes(4).readUInt32LE(0);
let randomState=seed;
function random(){randomState=(Math.imul(1664525,randomState)+1013904223)>>>0;return randomState/4294967296;}
function sample(array,n){const copy=[...array];for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy.slice(0,n);}
const grouped=new Map();
for (const e of analyzed) {const group=e.path.startsWith('rust/')?e.path.split('/').slice(0,2).join('/'):e.path.split('/')[0];if(!grouped.has(group))grouped.set(group,[]);grouped.get(group).push(e);}
function topLevelItems(entry) {
  if(entry.representation==='binary'){
    const a=JSON.parse(fs.readFileSync(path.join(output,entry.analysis_record))).files.find(f=>f.path===entry.path);
    return a.byte_ranges.map(([start,end,note])=>({kind:'binary region',name:note,byte_start:start,byte_end:end}));
  }
  const src=sourceLines(entry);
  if(entry.path.endsWith('.proto'))return src.flatMap((line,i)=>{
    const m=line.match(/^(message|enum)\s+(\w+)/);
    return m?[{kind:m[1],name:m[2],line:i+1}]:[];
  });
  if(entry.path.endsWith('.rs'))return src.flatMap((line,i)=>{
    // Column-zero declaration candidates, manually audited for each sampled file.
    // This is not a Rust parser: cfg branches remain separate, and macro output
    // and nested items require the authored L2 review, not this lexical check.
    const m=line.match(/^(?:pub(?:\([^)]*\))?\s+)?(?:(?:async|unsafe|extern\s+"[^"]+")\s+)*(fn|struct|enum|trait|mod|type|const|static|use|extern crate|macro_rules!|impl)\b/);
    const macro=line.match(/^macro_rules!\s+(\w+)/);
    return m||macro?[{kind:m?.[1]??'macro_rules!',name:line.trim(),line:i+1}]:[];
  });
  if(entry.path.endsWith('.py'))return src.flatMap((line,i)=>{
    // Lexical top-level candidates; multiline values, decorators and nested
    // bodies still require manual review of the full authored line ranges.
    const m=line.match(/^(?:(async\s+def|def|class|import|from)\s|([A-Za-z_]\w*)\s*(?::[^=]+)?=|if\s+__name__\s*==)/);
    return m?[{kind:m[1]??(m[2]?'assignment':'entrypoint guard'),name:line.trim(),line:i+1}]:[];
  });
  if(entry.path.endsWith('.toml'))return src.flatMap((line,i)=>/^\[/.test(line)?[{kind:'TOML section',name:line.trim(),line:i+1}]:[]);
  if(entry.path.endsWith('.md'))return src.flatMap((line,i)=>/^#{1,6} /.test(line)?[{kind:'Markdown heading',name:line.trim(),line:i+1}]:[]);
  return [];
}
const lineSamples=[...grouped].flatMap(([group,files])=>sample(files,Math.min(files.length,10)).map(e=>({group,path:e.path,range:e.representation==='binary'?[0,e.size]:[1,e.line_count],unit:e.representation==='binary'?'bytes':'lines',top_level_items:topLevelItems(e),item_detection:'Lexical declaration/section candidates for text; contiguous authored byte regions for binary. Semantic coverage requires manual review, not merely preserved source.',manual_review:'pending'})));
const accuracySamples=sample(claims,20).map((c,i)=>({...c,id:i+1,evidence:c.unit==='bytes'?fs.readFileSync(path.join(root,c.path)).subarray(c.start,c.end).toString('hex'):sourceLines(baseline.get(c.path)).slice(c.start-1,c.end).map((line,j)=>`${c.start+j} | ${line}`).join('\n'),manual_review:'pending'}));
const status=execFileSync('git',['-C',root,'status','--porcelain=v1','--untracked-files=all'],{encoding:'utf8'}).trimEnd();
const result={iteration,phase:'VERIFY',at:new Date().toISOString(),seed,snapshot:manifest.snapshot,source_status:status,source_unchanged:drift.length===0 && status===manifest.snapshot.status,totals:totals(manifest.files),claimed_scope:analyzed.map(e=>e.path),checks:{coverage:{scope_pass:drift.length===0&&issues.length===0,repository_pass:manifest.files.every(e=>e.status==='analyzed'||e.status==='excluded'),drift,issues},line_accountability:{structural_pass:issues.length===0,samples:lineSamples,manual_pass:null},accuracy:{samples:accuracySamples,manual_pass:null},cross_links:{pass:broken.length===0,citations,links,broken},self_sufficiency:{pass:false,answers:{write_then_compact:'FAIL: executable write/compaction/commit traces absent',new_scalar_index:'FAIL: traits, registrations, implementation paths and tests absent',v2_format:'FAIL: encoding layouts and runtime version gates incomplete',python_api:'FAIL: Python and PyO3 surfaces not analyzed',transaction_commit:'FAIL: operation and conflict-resolution implementations not analyzed'}}},overall_pass:false};
fs.mkdirSync(path.dirname(destination),{recursive:true});
fs.writeFileSync(destination,JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(path.join(output,'iteration-state.json'),JSON.stringify({iteration,phase:'VERIFY',completed:false,evidence:path.relative(output,destination),next:'Manually inspect sampled claims and top-level items, then log results and return to ANALYZE.'},null,2)+'\n');
console.log(JSON.stringify({destination,totals:result.totals,source_unchanged:result.source_unchanged,coverage:result.checks.coverage,cross_links:result.checks.cross_links,sampled_files:lineSamples.length,sampled_claims:accuracySamples.length,self_sufficiency:result.checks.self_sufficiency},null,2));
