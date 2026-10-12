import fs from 'node:fs';import assert from 'node:assert/strict';
const read=p=>JSON.parse(fs.readFileSync(p)),m=read('MANIFEST.json'),corrections=[
{path:'rust/lance-table/src/rowids.rs',start:559,kind:'random claim12 semantic wording',old:'Cursor lifetime in the iterator borrows the supplied state and sequence only during that call, not across calls.',replacement:'The returned iterator borrows the sequence and cursor for its lifetime, which extends beyond the method return while the iterator is used. The cursor itself stores scan state without a sequence reference, so it can be reused after that borrow ends.'},
{path:'rust/lance-encoding/src/compression.rs',start:346,kind:'line audit progress refresh',old:'Full entry collection/codec file remains pending.',replacement:'Full entry collection and payload behavior are now covered in the physical RLE analysis. (rust/lance-encoding/src/encodings/physical/rle.rs:221-328; rust/lance-encoding/src/encodings/physical/rle.rs:385-1944)'}
];
const files=[];
for(const c of corrections){const e=m.files.find(f=>f.path===c.path),f=structuredClone(read(e.analysis_record).files.find(f=>f.path===c.path)),r=f.ranges.find(r=>r[0]===c.start);assert(r[2].includes(c.old));c.previous_analysis=e.analysis_record;c.before=r[2];r[2]=r[2].replace(c.old,c.replacement);c.after=r[2];files.push(f);}
fs.writeFileSync('analysis/iteration-078-correction-batch.json',JSON.stringify({iteration:78,files},null,2)+'\n');
const syms=read('analysis/rust-symbols.json');for(const s of syms)for(const c of corrections)if(s.path===c.path&&s.behavior?.includes(c.old))s.behavior=s.behavior.replaceAll(c.old,c.replacement);fs.writeFileSync('analysis/rust-symbols.json',JSON.stringify(syms,null,2)+'\n');
fs.writeFileSync('verification/iteration-078-corrections.json',JSON.stringify({iteration:78,random_claim_mismatches:1,progress_refreshes:1,unresolved:0,source_changes:0,corrections},null,2)+'\n');
console.log({random_claim_mismatches:1,progress_refreshes:1,files:files.length});
