import fs from 'node:fs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n');
const manifest=read('MANIFEST.json');
const p='rust/lance-table/src/format.rs';
const entry=manifest.files.find(x=>x.path===p);
const record=structuredClone(read(entry.analysis_record).files.find(x=>x.path===p));
const range=record.ranges.find(x=>x[0]===15);
const old=range[2];
const stale='full sequence and transaction consumers remain pending.';
if(!old.includes(stale))throw Error('Missing facade status');
range[2]=old.replace(stale,'full sequence operations are now covered at rust/lance-table/src/rowids.rs:1-2309; row-ID index, full stream and transaction consumers remain pending.');
write('analysis/iteration-035-status-corrections.json',{iteration:35,files:[record]});
const changes=[{file:entry.l2_document,source_range:p+':15-30',before:old,after:range[2]}];
function replace(file,before,after){let s=fs.readFileSync(file,'utf8');if(s.split(before).length!==2)throw Error('Expected one match: '+file);fs.writeFileSync(file,s.replace(before,after));changes.push({file,before,after});}
replace('L1-modules/rust-lance-table.md',
'Next analysis must establish metadata parsing/serialization, exact per-file versions, hidden-column semantics, covering emission, caller ordering around apply/ensure and writer atomicity. Comment references to build_manifest/write_manifest_file are leads, not a completed call graph. The five full KB-only acceptance questions remain FAIL.',
'Metadata parsing/serialization, exact per-file version mappings and reserved-column carrier lookup are covered in the sections below. Remaining work includes actual hidden-column decoding, covering emission, caller ordering around apply/ensure and writer atomicity. Contextual manifest-builder snippets establish only range-segment opt-in; full build_manifest/write_manifest_file traces remain incomplete. The five full KB-only acceptance questions remain FAIL.');
replace('L1-modules/rust-lance-table.md',
'Full manifest preparation, exact truthy parsing, atomic commit and release compatibility remain pending. (rust/lance-table/src/transaction/manifest_build.rs:73-122)',
'The reviewed truthy helper accepts ASCII-case-insensitive 1/true/on/yes/y without trimming; other strings return false. Full manifest preparation, atomic commit and release compatibility remain pending. (rust/lance-table/src/transaction/manifest_build.rs:73-122; rust/lance-core/src/utils/parse.rs:4-11)');
replace('L4-crosscutting/scenarios.md',
'This helper explains local materialization cost but does not establish full RowIdSequence, scan or deletion-file behavior. (rust/lance-table/src/rowids/runs.rs:156-215)',
'This helper explains local materialization cost; complete RowIdSequence behavior is covered in the sequence trace below. Full scan and deletion-file integration remain pending. (rust/lance-table/src/rowids/runs.rs:156-215; rust/lance-table/src/rowids.rs:67-170)');
write('analysis/iteration-035-layer-corrections.json',{iteration:35,reason:'Resolve three VERIFY34 status findings and clarify one local-helper scope sentence.',new_files:0,new_lines:0,changes});
console.log({corrections:changes.length,coverage_unchanged:true});
