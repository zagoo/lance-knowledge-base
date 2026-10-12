import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p)),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const m=read('MANIFEST.json'),p='rust/lance-core/src/utils/row_addr_remap.rs',e=m.files.find(e=>e.path===p),f=structuredClone(read(e.analysis_record).files.find(f=>f.path===p));
const r=f.ranges.find(r=>r[0]===585),before=r[2];
r[2]='new_with_layout repeats the group-build and cross-group duplicate check using physical row counts. It retains every successfully built group, including a wholly empty group with no old fragments and no retained or destination rows; that case changes structural is_empty without matching any address. A zero-survivor group that lists old fragments is different: known in-bounds offsets return Some(None) (deleted), while offsets outside known physical_rows return None. Errors identify the duplicate fragment and current group. Supporting group construction and lookup: rust/lance-core/src/utils/row_addr_remap.rs:391-470 and rust/lance-core/src/utils/row_addr_remap.rs:606-628.';
if(before===r[2])throw Error('Already corrected');
const symbols=read('analysis/rust-symbols.json');let count=0;
for(const s of symbols)if(s.path===p&&s.behavior===before){s.behavior=r[2];count++;}
if(count!==1)throw Error('Expected one derived symbol, found '+count);
write('analysis/iteration-058-verify-corrections.json',{iteration:58,files:[f],changes:[{path:p,start:r[0],end:r[1],before,after:r[2],reason:'Random accuracy claim9 conflated a wholly empty rewrite group with a zero-survivor group containing old fragments; the latter changes deletion lookups.'}],derived_symbol_descriptions_synchronized:count});
write('analysis/rust-symbols.json',symbols);
console.log({corrections:1,symbols_synchronized:count});
