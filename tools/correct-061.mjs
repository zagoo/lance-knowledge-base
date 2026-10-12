import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p)),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const m=read('MANIFEST.json'),p='rust/lance-core/src/datatypes/schema.rs',e=m.files.find(e=>e.path===p),f=structuredClone(read(e.analysis_record).files.find(f=>f.path===p));
const r=f.ranges.find(r=>r[0]===2712),before=r[2];
if(!before.includes('top-level legacy boolean key'))throw Error('Unexpected prior claim');
r[2]='Primary-key success cases cover no key, a non-null Int32 root carrying the legacy boolean key metadata marker, and a non-null nested Struct leaf key alongside a root key. Assertions compare returned leaf names/order. No values are checked for uniqueness, and these fixtures do not test explicit position parsing.';
const symbols=read('analysis/rust-symbols.json');let count=0;
for(const s of symbols)if(s.path===p&&s.behavior.includes(before)){s.behavior=s.behavior.replace(before,r[2]);count++;}
if(count!==1)throw Error('Expected one derived symbol, found '+count);
write('analysis/iteration-061-verify-corrections.json',{iteration:61,files:[f],changes:[{claim_id:3,path:p,start:r[0],end:r[1],before,after:r[2],reason:'Random claim wording clarification: boolean describes the legacy metadata marker, while the actual root field data type is Int32. Fresh source distinguishes these explicitly.'}],derived_symbol_descriptions_synchronized:count});
write('analysis/rust-symbols.json',symbols);console.log({clarifications:1,symbols_synchronized:count});
