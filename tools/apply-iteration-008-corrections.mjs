import fs from 'node:fs';
import path from 'node:path';
import {output} from './inventory.mjs';
const read=f=>JSON.parse(fs.readFileSync(path.join(output,f),'utf8'));
const manifest=read('MANIFEST.json');const files=[];
for(const p of ['rust/AGENTS.md','rust/lance-core/src/datatypes/schema.rs']){
 const entry=manifest.files.find(e=>e.path===p);const f=read(entry.analysis_record).files.find(f=>f.path===p);
 if(p==='rust/AGENTS.md'){
  f.ranges.find(r=>r[0]===20)[2]='spawn_cpu closures must compute and return without channel waits, IO, locks, block_on or blocking APIs. The guide warns that resource-constrained pools can have one worker and deadlock when blocked; keep waiting outside in async code and dispatch substantial (~100 microseconds+) CPU work. This is policy and a rule of thumb, not a measured threshold. Actual sizing includes an explicit thread override and configurable IO reservation, so the guide\'s <=3-CPU example is not universal under all settings. Implementation: rust/lance-core/src/utils/tokio.rs:23-76; rust/lance-core/src/utils/tokio.rs:135-208.';
 }else{
  f.ranges.find(r=>r[0]===1985)[2]='test_resolve_quoted_fields asserts Arrow-schema import rejects a dotted top-level name with the expected message, then permits a dotted nested child and resolves it with backticks, plus normal root/nested fields. Both candidate schemas go through Schema::try_from(&ArrowSchema). The test demonstrates rejected top-level versus accepted nested dotted names at this import/resolution boundary; it does not exercise direct construction of an invalid core Schema. An additional DataType import follows.';
 }
 files.push(f);
}
fs.writeFileSync(path.join(output,'analysis/iteration-008-corrections.json'),JSON.stringify({iteration:8,previous_evidence:'verification/iteration-007.json',files,fixed:['Narrow quoted-field test statement to the actual Arrow-import cases','Correct concurrency module pointer and qualify sizing policy','Replace out-of-range build/test guide citation'],verification_status:'Awaiting VERIFY8'},null,2)+'\n');
for(const f of ['L4-crosscutting/build-and-test.md','tools/update-storage-layers.mjs']){
 const full=path.join(output,f);fs.writeFileSync(full,fs.readFileSync(full,'utf8').replaceAll('rust/AGENTS.md:1-113','rust/AGENTS.md:1-90'));
}
const s=read('iteration-state.json');s.corrections='analysis/iteration-008-corrections.json';s.read_not_analyzed=['rust/lance-core/src/utils/deletion.rs','rust/lance-core/src/utils/fragment_reuse.rs'];s.next='Author deletion/mapping slice and symbols, update cross-cutting layers, then VERIFY8.';fs.writeFileSync(path.join(output,'iteration-state.json'),JSON.stringify(s,null,2)+'\n');
console.log(JSON.stringify({corrected_files:files.map(f=>f.path),guide_citation:'1-90',phase:s.phase}));
