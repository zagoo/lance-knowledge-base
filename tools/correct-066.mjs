import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p)),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const m=read('MANIFEST.json'),path='rust/lance-file/src/versions/v1/writer/mod.rs',e=m.files.find(e=>e.path===path);
const file=structuredClone(read(e.analysis_record).files.find(f=>f.path===path)),range=file.ranges.find(r=>r[0]===1152&&r[1]===1172),before=range[2];
const old='stats_schema helper creates one nonnullable Struct root named decimal field ID,',replacement='stats_schema helper creates one nonnullable Struct root per input (field_id, DataType) pair, named by that decimal field ID,';
if(!before.startsWith(old))throw Error('Unexpected claim');range[2]=before.replace(old,replacement);
const symbols=read('analysis/rust-symbols.json');let synchronized=0;
for(const symbol of symbols)if(symbol.path===path&&symbol.behavior?.includes(old)){symbol.behavior=symbol.behavior.replace(old,replacement);synchronized++;}
write('analysis/rust-symbols.json',symbols);
write('analysis/iteration-066-verify-corrections.json',{iteration:66,phase:'VERIFY',changes:[{path,start:1152,end:1172,claim_id:9,kind:'cardinality clarification',before,after:range[2],reason:'Fresh source maps each input pair to one Struct root; make the per-input cardinality explicit rather than allowing a single-root reading.'}],derived_symbols_synchronized:synchronized,files:[file]});
console.log({clarifications:1,derived_symbols_synchronized:synchronized});
