import fs from 'node:fs';
import {root,linesOf} from './inventory.mjs';
const a=JSON.parse(fs.readFileSync('analysis/iteration-036-transaction-row-version.json','utf8')).files[0];
const src=linesOf(fs.readFileSync(root+'/'+a.path,'utf8')),added=[],pre='lance_table::transaction::row_version::';
const edges={
resolve_created_at_version:['resolve_update_version_metadata at row_version.rs263-267.','HashMap::get; RowDatasetVersionSequence::version_at; fallback constant.'],
has_writer_placed_lineage:['Public transaction facade reexport at transaction.rs51; resolver filter at row_version.rs104; doc/local tests.','RowIdMeta/RowDatasetVersionMeta Column pattern tests.'],
resolve_update_version_metadata:['Contextual manifest_build.rs952-957; direct local tests.','has_writer_placed_lineage; read_row_ids; RowIdSequence::iter/row_id_range; Cow/preload maps; load_sequence/len/version_at/from_versions/from_sequence; resolve_created_at_version; build_version_meta; core errors.'],
'collect_pure_rewrite_row_update_frags_ids':['Contextual manifest_build.rs964-965 after assignment; complete downstream index behavior pending.','read_row_ids; RowIdSequence::len; Error::internal; trusts Column cardinality.'],
'assign_row_ids':['Contextual manifest_build.rs766,948,998,1029; local assignment tests.','read_row_ids twice on shortage; RowIdSequence::len/iter/From; write_row_ids; Error::internal; mutable counter arithmetic.']
};
function add(name,line,end_line,kind,visibility,callers,callees){const r=a.ranges.find(([s,e])=>s<=line&&line<=e);if(!r)throw Error('Range '+line);added.push({name,path:a.path,line,end_line,kind,visibility,behavior:r[2],behavior_reference:`${a.path}:${r[0]}-${r[1]}`,callers,callees});}
add(pre+'UNKNOWN_CREATED_AT_VERSION',23,23,'constant','private','resolve_created_at_version.','Literal1.');
add('lance_table::transaction::Transaction::<row_version implementation@298>',298,298,'implementation','transaction-internal methods','Manifest builder.','See contained methods.');
add(pre+'tests',409,409,'module','private cfg(test)','Rust test harness.','Local metadata fixtures, transaction test_support and build_manifest.');
for(let i=0;i<src.length;i++){
 const m=src[i].match(/^\s*(pub(?:\(super\))? )?fn (\w+)/);if(!m)continue;
 const short=m[2],test=i>=408,method=i>=297&&i<407;let end=i+1;while(!/[{;]\s*$/.test(src[end-1]))end++;
 const name=method?'lance_table::transaction::Transaction::'+short:pre+(test?'tests::':'')+short;
 const edge=edges[short]??['Test harness/local fixture callers; tests read, not executed.','Metadata fixture construction, assignment/resolution or build_manifest, decoding and assertions in full L2 ranges.'];
 add(name,i+1,end,'function/method',test?'private cfg(test)':m[1]?.includes('(super)')?'pub(super), transaction module':m[1]?'public, reexported via transaction':'private',...edge);
}
add(pre+'tests::test_resolve_update_versions_reads_spilled_source_lineage_from_config::new_fragment',645,645,'local closure','private cfg(test)','Local test.','Fragment construction; RowIdSequence::from and write_row_ids.');
add(pre+'tests::test_resolve_update_versions_reads_spilled_source_lineage_from_config::versions',690,690,'local closure','private cfg(test)','Local test assertions.','Option unwrap; load_sequence; versions; collect.');
let prior=JSON.parse(fs.readFileSync('analysis/rust-symbols.json','utf8')).filter(s=>s.path!==a.path);
const consumers={
 'lance_table::rowids::serde::read_row_ids':' Transaction row-version helpers decode counts, needed/source IDs and destination IDs; some paths propagate errors while resolver paths use ok() (rust/lance-table/src/transaction/row_version.rs:102-110; rust/lance-table/src/transaction/row_version.rs:134-150; rust/lance-table/src/transaction/row_version.rs:254-255; rust/lance-table/src/transaction/row_version.rs:311-319; rust/lance-table/src/transaction/row_version.rs:346-375).',
 'lance_table::rowids::serde::write_row_ids':' Transaction::assign_row_ids serializes new/extended inline IDs (rust/lance-table/src/transaction/row_version.rs:377-401).',
 'lance_table::rowids::version::build_version_meta':' Transaction row-version resolver stamps latest updates and fallback creation (rust/lance-table/src/transaction/row_version.rs:206-295).',
 'lance_table::rowids::version::RowDatasetVersionSequence::version_at':' resolve_created_at_version performs one positional lookup per found rewritten row (rust/lance-table/src/transaction/row_version.rs:39-52; rust/lance-table/src/transaction/row_version.rs:258-274).',
 'lance_table::rowids::version::RowDatasetVersionSequence::from_versions':' Transaction creation resolution compresses one expanded value per new row (rust/lance-table/src/transaction/row_version.rs:258-285).'
};
for(const [n,c]of Object.entries(consumers)){const s=prior.find(s=>s.name===n);if(!s)throw Error('Missing '+n);s.callers+=c;}
fs.writeFileSync('analysis/rust-symbols.json',JSON.stringify([...prior,...added],null,2)+'\n');
console.log({new_symbols:added.length,functions:added.filter(s=>s.kind==='function/method').length,rust_total:prior.length+added.length});
