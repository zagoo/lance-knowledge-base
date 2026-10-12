import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p)),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const m=read('MANIFEST.json'),p='rust/lance-file/src/versions/v1/mod.rs',e=m.files.find(e=>e.path===p),f=structuredClone(read(e.analysis_record).files.find(f=>f.path===p));
const r=f.ranges.find(r=>r[0]===40),before=r[2];
r[2]='Public projection_from_field_ids allocates an index vector, uses the above traversal, and clones the supplied Schema into a fresh Arc. This follows the derived Clone implementations of Schema, Field and Dictionary; loaded dictionary ArrayRef members retain shared array storage, so this is not a promise to copy all backing data (rust/lance-core/src/datatypes/schema.rs:24-31; rust/lance-core/src/datatypes/field.rs:134-161; rust/lance-core/src/datatypes.rs:561-568). It returns ReaderProjection directly, even for empty schema/indices, absent mappings or repeated physical values. It preserves the full supplied schema rather than removing unmapped fields; validation is a consumer responsibility. No IO or fallible Result.';
if(!before.includes('deep-clones'))throw Error('Unexpected prior wording');
const symbols=read('analysis/rust-symbols.json');let count=0;
for(const s of symbols)if(s.path===p&&s.behavior===before){s.behavior=r[2];count++;}
if(count!==1)throw Error('Expected one derived symbol, found '+count);
write('analysis/iteration-060-verify-corrections.json',{iteration:60,files:[f],changes:[{path:p,start:r[0],end:r[1],before,after:r[2],reason:'Nonrandom top-level audit found that deep-clones overstates Schema::clone by implying independent dictionary array backing. Fresh source confirms derived Clone and Option<ArrayRef>.'}],derived_symbol_descriptions_synchronized:count});
write('analysis/rust-symbols.json',symbols);
console.log({corrections:1,symbols_synchronized:count});
