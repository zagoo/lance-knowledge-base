import fs from 'node:fs';
import path from 'node:path';
import {output} from './inventory.mjs';
const read=f=>JSON.parse(fs.readFileSync(path.join(output,f),'utf8'));const manifest=read('MANIFEST.json'),files=[];
for(const [p,start,text]of [
 ['rust/lance-core/src/utils/futures.rs',196,' Lock reacquisition before the match and returning the original poll result are at rust/lance-core/src/utils/futures.rs:184-195 and rust/lance-core/src/utils/futures.rs:225-246.'],
 ['rust/lance-core/src/error.rs',373,' The unvalidated constructor and cap100/used50 recovery fixture are at rust/lance-core/src/error.rs:768-775 and rust/lance-core/src/error.rs:1311-1327.']
]){
 const entry=manifest.files.find(e=>e.path===p),f=read(entry.analysis_record).files.find(f=>f.path===p);const r=f.ranges.find(r=>r[0]===start);if(!r[2].includes(text.trim()))r[2]+=text;files.push(f);
}
fs.writeFileSync(path.join(output,'analysis/iteration-009-precision.json'),JSON.stringify({iteration:9,previous_evidence:'verification/iteration-008.json',files,verification_status:'Additional references confirmed during VERIFY8; full next-cycle verification pending'},null,2)+'\n');
const state=read('iteration-state.json');state.corrections='analysis/iteration-009-precision.json';state.next='Read and analyze rust/lance-core/src/utils/row_addr_remap.rs, then remaining core utilities/cache. No read-but-unanalyzed files remain. VERIFY9 should confirm the new source slice and citation precision.';fs.writeFileSync(path.join(output,'iteration-state.json'),JSON.stringify(state,null,2)+'\n');
const readmeFile=path.join(output,'README.md');let entry=fs.readFileSync(readmeFile,'utf8');const checkpoint=entry.indexOf('## Current checkpoint');entry=entry.slice(0,checkpoint)+`## Current checkpoint

48 of 2,059 files and 16,833 of 1,166,813 text lines are analyzed. Coverage includes all 15 protobuf-subsystem files, twenty-eight lance-core files and five other contributor guides. The index contains 2,133 records: 971 protobuf and 1,162 Rust declarations. All 294 binary files remain pending.

Eight VERIFY cycles are recorded. VERIFY8 confirmed 20/20 random claims, covered 400 top-level candidates in 25 sampled files, and resolved all 4,499 citations and 3,056 links checked at that checkpoint. The source remained clean and unchanged. Global acceptance still fails: 2,011 files and all five complete self-sufficiency answers are pending. Two verified cross-range references were made explicit in ANALYZE9. Next: RowAddrRemap and remaining core utilities/cache, then VERIFY9. See [iteration state](iteration-state.json) and [verification log](verification-log.md).

Analysis records may retain superseded drafts for provenance. Follow each file's current analysis_record in MANIFEST and its current L2 document; verification snapshots intentionally retain the claims as they were sampled.
`;fs.writeFileSync(readmeFile,entry);
console.log(JSON.stringify({files:files.map(f=>f.path),iteration:state.iteration,phase:state.phase,next:state.next}));
