import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p)),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const target='analysis/iteration-055-verify-corrections.json';
if(fs.existsSync(target))throw Error('Already applied');
const manifest=read('MANIFEST.json');
const files=[],changes=[];
function current(path){const e=manifest.files.find(e=>e.path===path);const f=structuredClone(read(e.analysis_record).files.find(f=>f.path===path));files.push(f);return f;}
function changeRange(f,start,text){const r=f.ranges.find(r=>r[0]===start);changes.push({path:f.path,start:r[0],end:r[1],before:r[2],after:text});r[2]=text;}
let f=current('rust/lance-file/src/lib.rs');
changeRange(f,1,f.ranges[0][2].replace('full reader and concrete version writers remain pending.','V2_1/V2_2/V2_3 concrete writers and shared structural pipeline are covered separately. Full reader IO and V2_0/V1 writers remain pending.'));
f=current('rust/lance-file/src/writer.rs');
let r=f.ranges.find(r=>r[0]===141);
changeRange(f,141,r[2].replace('Concrete spill threshold, sidecar layout and cleanup remain pending.','V2_1/V2_2/V2_3 use the separately analyzed shared structural spill path; V2_0 behavior remains pending. This facade itself specifies neither threshold nor sidecar cleanup.'));
changes.push({path:f.path,section:'limits',before:f.limits,after:'All294 lines read. V2_1/V2_2/V2_3 concrete pipelines, local completion/abort behavior and external metadata handling are now covered in the structural writer supplement. V2_0 writer, underlying object-store completion/cleanup and writer_tests.rs remain pending. Public FieldTypeMismatch and private shared checker have separate coverage. No tests/benchmarks/builds were run.'});
f.limits=changes.at(-1).after;
f=current('rust/lance-core/src/utils/stable_partition.rs');
changeRange(f,484,'Tests use StdRng and Rng/SeedableRng traits plus the parent NullBuffer import. random_labels chooses None with probability1/8; otherwise it draws from 0..m as u32 and narrows with unchecked as u16. It does not validate m: values above u16::MAX can truncate, and m=0 supplies an empty sampling range if the non-null branch runs. Both local callers use m=5 with seeds7/42 (rust/lance-core/src/utils/stable_partition.rs:598-599; rust/lance-core/src/utils/stable_partition.rs:646-648). build uses the public builder and unwraps each fixture operation. These helpers are local; tests were inspected, not executed.');
write(target,{iteration:55,files,changes});
fs.copyFileSync('verification/iteration-055-top-level-audit.json','verification/iteration-055-top-level-audit-initial.json');
const symbols=read('analysis/rust-symbols.json');let updated=0;
for(const s of symbols){const c=changes.find(c=>c.start&&c.path===s.path&&c.start<=s.line&&s.line<=c.end);if(c){s.behavior=c.after;updated++;}}
write('analysis/rust-symbols.json',symbols);
console.log({changes:changes.length,symbols_updated:updated});
