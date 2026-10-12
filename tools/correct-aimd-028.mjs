import fs from 'node:fs';import path from 'node:path';import{output}from './inventory.mjs';
const read=f=>JSON.parse(fs.readFileSync(path.join(output,f),'utf8'));
const write=(f,v)=>fs.writeFileSync(path.join(output,f),JSON.stringify(v,null,2)+'\n');
const state=read('iteration-state.json');if(state.iteration!==28||state.phase!=='ANALYZE')throw new Error('Wrong phase');
const m=read('MANIFEST.json'),entry=m.files.find(e=>e.path==='rust/lance-core/src/utils/aimd.rs');
const a=read(entry.analysis_record).files.find(f=>f.path===entry.path);
a.ranges.find(r=>r[0]===516)[2]='Unlimited fixture starts100,max0,increment50. It records five successes at150ms intervals, then a sixth success triggers the final pending window evaluation: five nonempty windows are evaluated in total, yielding100+5*50=350. This demonstrates no finite configured ceiling for these small values, not safe infinite-duration or f64-maximum growth.';
write('analysis/iteration-028-aimd-correction.json',{iteration:28,files:[a]});
const syms=read('analysis/rust-symbols.json');
for(const s of syms.filter(s=>s.path===a.path)){const r=a.ranges.find(([b,e])=>b<=s.line&&s.line<=e);s.behavior=r[2];s.behavior_reference=`${s.path}:${r[0]}-${r[1]}`;}
write('analysis/rust-symbols.json',syms);console.log({corrected:a.path,range:[516,545]});
