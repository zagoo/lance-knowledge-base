import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const path='verification/iteration-050.json', v=read(path);
if(v.checks.accuracy.manual_pass!==null)throw Error('Already recorded');
const corrections=read('analysis/iteration-050-verify-corrections.json');
const notes=[
 'Range arm delegates validation and preserves bounds. Fresh helper read confirms checked subtraction/usize conversion and permits equal bounds.',
 'All nine present offsets, two lookup directions, seven missing offsets and ordinal nine match the assertions.',
 'Initial hexadecimal transcription mismatched the final source bytes. Corrected the active L2 annotation and symbol behavior to the exact 32-byte array; rechecked the corrected string against the opened source.',
 'All three operation cases and original/prepared/final assertions match. Fresh helper reads confirm fragment zero, field zero, translating bitmap five and the in-place rewrite variants.',
 'The nine-field mapping, uniqueness exception for minus one, version tags and historical zero pair match the full schema comment.',
 'Optional fixed UUID key fields and branches match. Fresh KeyBuilder reads confirm tagged length-prefixed fixed bytes and separate presence markers.',
 'The guide explicitly requires duplicate-PR checks, Conventional Commit titles, Rust/Python lints and blocker reporting. No PR is created by this task.',
 'Test backend routing and borrowed legacy key match. Fresh CacheKey default methods confirm LEGACY_TEXT schema and string writer without any data-file compatibility implication.',
 'The memory-store fixture only asserts None for NoDeletions; no object listing or empty concrete vector case occurs in this test.',
 'write_all/error propagation, capacity and raw ordered output match. Fresh Block reads confirm eight u32 words and little-endian 32-byte serialization on both endian branches.',
 'Struct child order, null and recursive failure propagation, absence of names/type metadata, empty result and unsupported fallback match.',
 'Initial wording used a singular retained vector index. Clarified that both vec1 and vec2 survive and idx3 is removed, matching the explicit length-two assertion. Corrected L2 and symbols were rechecked.',
 'Column lookup, validity check, extraction order and zero/one/many key branches match. Fresh extractor reads confirm owned strings/binary and numeric widening; there is no explicit row-bound check.',
 'Zero-dimension and positive direct/nested cases match. Fresh validator read confirms dimension <= 0, so negative rejection is implemented but not exercised by this fixture.',
 'Every segment arm matches. Fresh encoded-array and hole-run helpers confirm binary/partition lookup; bitmap position explicitly scans the prefix through count_zeros.',
 'Known size bypasses explicit size lookup, while unknown size is awaited and checked-converted with path context. No underlying HEAD-elision guarantee is inferred.',
 'Page grouping and eight-megabyte size are advice; dynamic plugin support is expressed as an ideal, not an implemented registry.',
 'Lengths 48 through 55 and alternating constructors/clears match. Fresh Bitmap declaration and constructors confirm equality includes data/len and full-constructor padding is cleared.',
 'Destination ordering, zero skip, prefix arithmetic and cloned bitmaps match. Fresh remainder/helper reads confirm old-fragment uniqueness checks but no destination uniqueness check, and physical address construction can alias duplicate destination IDs.',
 'Trait bounds, physical-address terminology, None meaning and InvalidInput/CorruptFile/storage-error requirements match. These remain interface obligations rather than implementation proof.'
];
for(const s of v.checks.accuracy.samples){
 s.manual_review='pass';s.review_note=notes[s.id-1];
 if([3,12].includes(s.id)){
  const f=corrections.files.find(f=>f.path===s.path),r=f.ranges.find(r=>r[0]===s.start);
  s.initial_review='mismatch';s.corrected_claim=r[2];s.correction_evidence='analysis/iteration-050-verify-corrections.json';
 }else s.initial_review='pass';
}
Object.assign(v.checks.accuracy,{manual_pass:true,reviewed_count:20,initial_passed_count:18,initial_mismatch_count:2,corrected_count:2,passed_count:20,supplemental_evidence:[
 'rust/lance-table/src/rowids/serde.rs:19-31',
 'rust/lance-table/src/transaction/manifest_build.rs:2090-2174',
 'rust/lance-core/src/cache/key.rs:241-268',
 'rust/lance-core/src/cache/key.rs:294-305',
 'rust/lance-core/src/cache/mod.rs:104-142',
 'rust/lance-core/src/utils/bloomfilter/sbbf.rs:87-129',
 'rust/lance-table/src/format/key_existence.rs:311-344',
 'rust/lance-core/src/datatypes/schema.rs:116-143',
 'rust/lance-table/src/rowids/runs.rs:155-178',
 'rust/lance-table/src/rowids/encoded_array.rs:145-181',
 'rust/lance-table/src/rowids/bitmap.rs:1-63',
 'rust/lance-core/src/utils/row_addr_remap.rs:417-489'
]});
const audit=read('verification/iteration-050-top-level-audit.json');
for(const s of v.checks.line_accountability.samples){
 const a=audit.find(a=>a.path===s.path);if(!a||a.unchanged_from_current_turn_review)throw Error('Expected fresh audit');
 s.manual_review='pass';s.review_note='Fresh declaration-to-authored-range review in bounded outputs for this goal turn; no prior-turn review reused. Full contiguous ranges and exact numbered source checked structurally. Two superseded commit child-coverage annotations were corrected and their mappings rechecked.';
}
Object.assign(v.checks.line_accountability,{manual_pass:true,top_level_items_reviewed:645,fresh_files_reviewed:42,same_active_turn_reused_files:0,mapping_evidence:'verification/iteration-050-top-level-audit.json',initial_mapping_evidence:'verification/iteration-050-top-level-audit-initial.json',no_item_evidence:'verification/iteration-050-no-items.json'});
const noItems=read('verification/iteration-050-no-items.json');for(const item of noItems)item.review='pass';write('verification/iteration-050-no-items.json',noItems);
v.checks.status_refresh={pass:true,count:6,evidence:'analysis/iteration-050-status-refresh.json'};
v.checks.corrections=[{count:12,evidence:'analysis/iteration-050-verify-corrections.json',accuracy_count:2,coverage_note_count:10,note:'Corrected a test-vector transcription and retained-index count wording; refreshed superseded facade/commit/module/scenario/cookbook coverage statements.'}];
v.checks.cross_links_initial=v.checks.cross_links;
v.checks.self_sufficiency={pass:false,answers:{
 write_then_compact:'FAIL. The KB traces table candidate assembly, metadata serialization/publication and loaded stable-ID-to-address lookup, including deletion filtering, duplicate checks, retained memory and sorting costs. It still lacks complete Dataset::write/compact_files scheduling, data writers, cache lifecycle, index remapping, recovery and cleanup. A full disk/memory trace cannot be produced.',
 new_scalar_index:'FAIL. Index metadata, table admission/maintenance and local ID lookup are covered. The full scalar trait, registry/loader, planner and query/update integration, bindings and required tests are still missing. An every-file recipe would require guessing.',
 v2_format:'FAIL. Protobufs, exact selectors/version gates and table metadata framing are covered; row-ID lookup structures are in-memory helpers. Complete data-file V2 byte layouts, encoding implementations, reader/writer dispatch and stable compatibility evidence remain pending.',
 python_api:'FAIL. Contributor/environment instructions are covered, but public Python/PyO3 signatures and complete Rust mappings remain absent.',
 transaction_commit:'FAIL. Table candidate construction, CommitHandler/ExternalManifestStore interfaces, generic publication/repair and concrete DynamoDB request/schema/error behavior are covered. DynamoDB supplies no predecessor identity protocol. Namespace authority, the full Dataset operation-pair conflict matrix, rebase/retry/outcome recovery, transition assembly and cleanup remain pending.'
},review_note:'Re-evaluated using only current KB module supplements, scenario/cookbook traces and coverage records. The new local contracts do not complete any of the five end-to-end acceptance questions.'};
v.overall_pass=false;v.reviewed_at=new Date().toISOString();write(path,v);
fs.appendFileSync('verification-log.md',`\n## Iteration 50 — ANALYZE then VERIFY — FAIL (global coverage/self-sufficiency)\n\n- Added three complete files and 2,853 lines in 89 authored ranges: DynamoDB authority (586), row-ID index (1,641) and its benchmark (626), plus a six-line IO facade refresh. Added 159 symbol records. [Analysis](analysis/iteration-050-batch.json), [DynamoDB supplement](L1-modules/rust-lance-table-dynamodb.md), [row-ID index supplement](L1-modules/rust-lance-table-row-index.md).\n- [Verification](verification/iteration-050.json), [declaration audit](verification/iteration-050-top-level-audit.json), [initial declaration audit](verification/iteration-050-top-level-audit-initial.json), [nondeclaration evidence](verification/iteration-050-no-items.json); seed ${v.seed}. Full inventory hashes and source status are unchanged at c3c8d6fb505fb437b2b673c5195e1d4b74436b2f. No internet, source edits, builds, tests, benchmarks or service calls.\n- Claimed scope PASS: 125 files / 64,875 lines; table scope 50/54 entries / 38,336 lines. Symbol index: 5,538 records (971 protobuf + 4,567 Rust), 109 files. Line accountability PASS: 645 declaration mappings across 42 freshly reviewed sampled files; no previous-turn reuse.\n- Accuracy: 18/20 passed initially. Corrected one hexadecimal test-vector transcription and clarified two retained vector definitions in another test; all 20 pass after correction. [Twelve corrections](analysis/iteration-050-verify-corrections.json) also include ten superseded coverage notes. Six parent/facade status statements were refreshed during ANALYZE.\n- Initial integrity PASS: 13,983 citations / 8,589 links. [Post-correction integrity](verification/iteration-050-post-correction.json) records final counts, source hashes, complete ranges and links after corrections and checkpoint updates.\n- Global coverage and all five complete KB-only questions FAIL: 1,934 files, including 294 binaries, remain pending. Decision: ANALYZE51 targets table stream utilities and the remaining three table benchmarks (2,482 lines total). Full Dataset integration, file/encoding runtimes, remaining crates and bindings remain open. Goal stays active and INCOMPLETE.\n`);
write('iteration-state.json',{iteration:51,phase:'ANALYZE',completed:false,previous_verification:path,totals:v.totals,read_not_analyzed:read('analysis/iteration-050-contextual-reads.json'),next:'Read and author rust/lance-table/src/utils/stream.rs (1887 lines), benches/manifest_intern.rs (263), benches/system_columns.rs (172) and benches/version_columns.rs (160). These are the remaining four lance-table inventory entries. Preserve read-only source and offline constraints; then proceed to lance-file runtime. All five complete acceptance answers and full Dataset integration remain pending.',acceptance_gaps:['1934 files pending','294 binary files pending','all five complete KB-only answers fail','full runtime formats, bindings and caller graph pending']});
let r=fs.readFileSync('README.md','utf8');
r=r.slice(0,r.indexOf('## Current checkpoint'))+`## Current checkpoint

125 of 2,059 files and 64,875 of 1,166,813 inventory text lines are analyzed. This includes all 15 protobuf-subsystem files, all 48 lance-core files, 50 lance-table entries, seven lance-file entries and five other contributor guides. The symbol index has 5,538 records: 971 protobuf and 4,567 Rust. All 294 binary files remain pending.

Fifty VERIFY cycles are recorded. VERIFY50 reviewed 20 fresh random claims and 645 declaration mappings across 42 freshly reviewed sampled files. Two accuracy notes were corrected and rechecked; ten superseded coverage notes were refreshed. Full hashes/ranges and source cleanliness passed. All checked citations and links resolve; final counts are in [post-correction integrity](verification/iteration-050-post-correction.json). Global acceptance still fails: 1,934 files and all five complete KB-only answers remain pending. See [iteration state](iteration-state.json) and [verification log](verification-log.md).

The [DynamoDB supplement](L1-modules/rust-lance-table-dynamodb.md) covers schema checks, conditional requests, consistency, errors and deletion limits. The [row-ID index supplement](L1-modules/rust-lance-table-row-index.md) covers merged/probe lookup, deletion-preserved physical offsets, build/memory costs and benchmark limitations. ANALYZE51 targets stream utilities and the last three table benchmarks. Full Dataset conflict/retry/cleanup, data-file formats and bindings remain pending. Tests and benchmarks were read, not run.

Analysis records retain superseded drafts for provenance. Follow each file's current analysis_record in MANIFEST and current L2 document; verification snapshots retain their original sampled claims alongside corrections. Source remains read-only and the goal remains active and INCOMPLETE.
`;
fs.writeFileSync('README.md',r);
console.log({accuracy_initial:'18/20',accuracy_corrected:'20/20',declarations:645,fresh_files:42,next:51,totals:v.totals,overall_pass:false});
