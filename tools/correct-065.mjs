import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p)),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const manifest=read('MANIFEST.json'),path='rust/lance-table/src/transaction/index_maintenance.rs';
const entry=manifest.files.find(f=>f.path===path),file=structuredClone(read(entry.analysis_record).files.find(f=>f.path===path));
const range=file.ranges.find(r=>r[0]===793&&r[1]===837);
const before=range[2],old='cfg(test) module imports BTreeMap, Arrow schema types, fragment-reuse metadata helpers and parent internals.';
const replacement='cfg(test) module imports parent internals, the shared overlay_with_field test helper and Uuid; the first test locally aliases fragment_reuse_index_details as pb_fri.';
if(!before.startsWith(old))throw Error('Unexpected canonical claim');
range[2]=before.replace(old,replacement);
const symbols=read('analysis/rust-symbols.json');let count=0;
for(const symbol of symbols)if(symbol.path===path&&symbol.behavior?.includes(old)){symbol.behavior=symbol.behavior.replace(old,replacement);count++;}
write('analysis/rust-symbols.json',symbols);
write('analysis/iteration-065-verify-corrections.json',{iteration:65,phase:'VERIFY',changes:[{path,start:793,end:837,claim_id:9,kind:'inaccurate import list',before,after:range[2],reason:'Fresh source lines795-801 show parent glob, shared overlay_with_field, Uuid and a local pb_fri alias; they do not match the prior module import description.'}],derived_symbols_synchronized:count,files:[file]});
const supplemental=read('verification/iteration-065-supplemental-source.json');
write('verification/iteration-065-no-items.json',supplemental.filter(e=>e.path==='protos/license_header.txt'));
console.log({corrected:1,derived_symbols_synchronized:count});
