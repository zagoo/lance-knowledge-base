import fs from 'node:fs';import {root,linesOf} from './inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const m=read('MANIFEST.json'),p='rust/lance-core/src/cache/mod.rs',e=m.files.find(e=>e.path===p),f=structuredClone(read(e.analysis_record).files.find(f=>f.path===p));
const r=f.ranges.find(r=>r[0]===1193),before=r[2];
r[2]='Moka physical-key weight test computes cache_entry_size(value)=value.deep_size_of()+2*size_of::<AtomicUsize>(), then checked_adds size_of::<InternalCacheKey>(), chooses twice expected capacity, inserts and asserts weighted bytes equal expected. Only the key addition is checked; the helper adds Arc counter overhead with ordinary arithmetic. Small capacity gives weight_unit1, avoiding coarse Moka units. Supporting helpers: rust/lance-core/src/cache/mod.rs:189-192; rust/lance-core/src/cache/moka.rs:34-46.';
write('analysis/iteration-057-verify-corrections.json',{iteration:57,files:[f],changes:[{path:p,start:r[0],end:r[1],before,after:r[2],reason:'Random accuracy claim8 omitted two atomic counter words charged by cache_entry_size; make the exact tested formula explicit.'}]});
const symbols=read('analysis/rust-symbols.json');let count=0;
for(const s of symbols){if(s.path===p&&s.behavior===before){s.behavior=r[2];count++;}}
write('analysis/rust-symbols.json',symbols);
const evidence=[];for(const p of ['rust/lance-core/proptest-regressions/io/writer/statistics.txt','rust/lance-file/protos']){const e=m.files.find(e=>e.path===p),body=e.representation==='symlink-target'?fs.readlinkSync(root+'/'+p):fs.readFileSync(root+'/'+p,'utf8');const item={path:p,read_at:new Date().toISOString(),representation:e.representation,evidence:linesOf(body).map((l,i)=>`${i+1} | ${l}`).join('\n')};evidence.push(item);console.log(item);}
write('verification/iteration-057-no-items.json',evidence);
const context=read('analysis/iteration-057-contextual-reads.json');context.partial_only.find(e=>e.path==='rust/lance-datagen/src/generator.rs').note='Row-count forwarding and stream eager collection inspected for test fixture interpretation; whole generator remains pending.';write('analysis/iteration-057-contextual-reads.json',context);
console.log({corrections:1,symbols_synchronized:count});
