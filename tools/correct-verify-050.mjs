import fs from 'node:fs';
const read = p => JSON.parse(fs.readFileSync(p));
const write = (p,v) => fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const manifest=read('MANIFEST.json'), files=new Map(), corrections=[];
function revise(path,start,before,after,reason){
  if(!files.has(path)){
    const entry=manifest.files.find(e=>e.path===path);
    files.set(path,structuredClone(read(entry.analysis_record).files.find(f=>f.path===path)));
  }
  const file=files.get(path), range=file.ranges.find(r=>r[0]===start);
  if(!range || !range[2].includes(before))throw Error('Missing expected range text '+path+':'+start);
  corrections.push({path,range:range.slice(0,2),before,after,reason});
  range[2]=range[2].replace(before,after);
}
revise('rust/lance-core/src/cache/key.rs',342,
 '92b2b75604ed3c761f9d6f62392c8a9227ad0ea3f09573e7f83f14980d6d0d26',
 '92b2b75604ed3c761f9d6f62392c8a9227ad0ea3f09573e783f1498a4ed60d26',
 'Random claim 3: repair hexadecimal transcription to match all 32 source bytes.');
revise('rust/lance-table/src/transaction/index_maintenance.rs',1179,
 'actually retains the valid empty vector index while removing invalid-field metadata',
 'actually retains both valid empty vector definitions (vec1 and vec2) while removing invalid-field metadata',
 'Random claim 12: make the retained count explicit; the test asserts two definitions survive.');
revise('rust/lance-table/src/format.rs',15,
 'row-ID index, full stream and transaction consumers remain pending.',
 'row-ID index is now covered at rust/lance-table/src/rowids/index.rs:1-1641; full stream and Dataset transaction consumers remain pending.',
 'Coverage-note refresh after ANALYZE50.');
revise('rust/lance-table/src/io/commit.rs',231,
 'Generic external workflow promises not to persist/validate ETag; implementation is separate pending child.',
 'Generic external workflow does not persist/validate ETag; the complete child implementation is covered at rust/lance-table/src/io/commit/external_manifest.rs:1-2553.',
 'Sampled declaration audit found a superseded child-coverage note.');
revise('rust/lance-table/src/io/commit.rs',1139,
 'Child schema and remote IO behavior remain pending.',
 'Child schema validation, request construction and result/error handling are now covered at rust/lance-table/src/io/commit/dynamodb.rs:162-513; no remote service was exercised.',
 'Sampled declaration audit found a superseded DynamoDB-coverage note.');
function replaceDoc(path,before,after){
 let text=fs.readFileSync(path,'utf8');if(!text.includes(before))throw Error('Missing prose '+path);
 corrections.push({path,before,after,reason:'Coverage-note refresh after child analysis.'});
 fs.writeFileSync(path,text.replace(before,after));
}
replaceDoc('L1-modules/rust-lance-table-io.md',
 'while concrete backends and full Dataset retry/conflict remain pending.',
 'and the concrete DynamoDB store is covered in its supplement; namespace stores and full Dataset retry/conflict remain pending.');
replaceDoc('L1-modules/rust-lance-table-io.md',
 'Concrete backends and full Dataset integration remain pending.',
 'DynamoDB is covered in its supplement; namespace stores and full Dataset integration remain pending.');
replaceDoc('L1-modules/rust-lance-table.md',
 'commit arbitration and backends remain pending.',
 'local commit arbitration, generic external authority and DynamoDB are covered in their supplements; namespace authority and full Dataset orchestration remain pending.');
replaceDoc('L1-modules/rust-lance-table.md',
 'concrete backends and full Dataset conflict/retry/cleanup remain pending.',
 'DynamoDB is covered in its supplement; namespace authority and full Dataset conflict/retry/cleanup remain pending.');
write('analysis/iteration-050-verify-corrections.json',{iteration:50,files:[...files.values()],corrections});
const symbols=read('analysis/rust-symbols.json');
for(const symbol of symbols){const f=files.get(symbol.path);if(!f)continue;const r=f.ranges.find(([a,b])=>a<=symbol.line&&symbol.line<=b);symbol.behavior=r[2];symbol.behavior_reference=`${f.path}:${r[0]}-${r[1]}`;}
write('analysis/rust-symbols.json',symbols);
const contextual=read('analysis/iteration-049-contextual-reads.json');contextual.iteration=50;write('analysis/iteration-050-contextual-reads.json',contextual);
console.log({corrections:corrections.length,refreshed_files:files.size});
