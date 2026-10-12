import fs from 'node:fs';
import {root,linesOf} from './inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const destination='analysis/iteration-056-verify-corrections.json';
if(fs.existsSync(destination))throw Error('Already corrected');
fs.copyFileSync('verification/iteration-056-top-level-audit.json','verification/iteration-056-top-level-audit-initial.json');
const manifest=read('MANIFEST.json'),changes=[],files=[];
for(const p of ['rust/lance-file/src/lib.rs','rust/lance-file/src/writer.rs']){
 const e=manifest.files.find(f=>f.path===p),f=structuredClone(read(e.analysis_record).files.find(f=>f.path===p));
 const replace=(oldText,newText)=>{
  const range=f.ranges.find(r=>r[2].includes(oldText));
  if(!range)throw Error('Missing old text');
  changes.push({path:p,start:range[0],end:range[1],kind:'coverage status refresh',before:range[2],after:range[2].replace(oldText,newText)});
  range[2]=changes.at(-1).after;
 };
 if(p.endsWith('/lib.rs'))replace('Full reader IO and V2_0/V1 writers remain pending.','The V2_0 writer, testing helpers, exact-version compatibility tests and fixture generator sources are also covered. Full reader IO, writer_tests.rs, V1 writer and individual binary fixtures remain pending.');
 else{
  replace('V2_0 behavior remains pending.','V2_0 has a separately analyzed spill implementation: whole-column length-delimited page replay replaces in-memory pages, late setup does not migrate prior pages, and the caller owns sidecar deletion.');
  const before=f.limits;
  f.limits='All294 lines read. All four V2 concrete writer lifecycles, local completion/abort behavior and external metadata handling are covered by the structural-writer and V2_0 compatibility supplements. Underlying object-store completion/cleanup and writer_tests.rs remain pending. Public FieldTypeMismatch and private shared checker have separate coverage. No tests/benchmarks/builds were run.';
  changes.push({path:p,kind:'coverage limits refresh',before,after:f.limits});
 }
 files.push(f);
}
write(destination,{iteration:56,files,changes});
const symbols=read('analysis/rust-symbols.json');let synchronized=0;
for(const s of symbols){const f=files.find(f=>f.path===s.path);if(!f)continue;const r=f.ranges.find(r=>s.behavior_reference===`${s.path}:${r[0]}-${r[1]}`);if(r&&s.behavior!==r[2]){s.behavior=r[2];synchronized++;}}
write('analysis/rust-symbols.json',symbols);
const evidence=[];
for(const p of ['protos/license_header.txt','rust/lance-file/protos']){
 const e=manifest.files.find(e=>e.path===p),text=e.representation==='symlink-target'?fs.readlinkSync(root+'/'+p):fs.readFileSync(root+'/'+p,'utf8');
 const lines=linesOf(text),item={path:p,representation:e.representation,read_at:new Date().toISOString(),evidence:lines.map((l,i)=>`${i+1} | ${l}`).join('\n')};
 evidence.push(item);console.log(item);
}
write('verification/iteration-056-no-items.json',evidence);
console.log({changes:changes.length,synchronized});
