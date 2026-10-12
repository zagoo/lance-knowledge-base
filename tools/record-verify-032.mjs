import fs from 'node:fs';
import path from 'node:path';
import {output, root} from './inventory.mjs';
const read=f=>JSON.parse(fs.readFileSync(path.join(output,f),'utf8'));
const write=(f,v)=>fs.writeFileSync(path.join(output,f),JSON.stringify(v,null,2)+'\n');
const file='verification/iteration-032.json',v=read(file);
if(v.checks.accuracy.manual_pass!==null)throw Error('Already recorded');
const notes=[
'Matches all three locked registry fixtures and substring assertions; no exact error variant asserted.',
'Matches both macro arms and direct assert_eq forwarding without casts, Result or unsafe.',
'Matches both list arms, allocation, recursive extraction and null rejection. Supplemental key_existence.rs373-389 confirms unsupported fallback including FixedSizeList.',
'Matches all four track_caller builders and argument-to-field conversion.',
'Matches field tags, documented width constraints, compression interpretation and literal-encoding TODO; this is schema evidence.',
'Matches six descending/duplicate cases and adjacency text. Supplemental serde.rs462-469 confirms CorruptFile plus message-substring assertions, not whole-message equality.',
'Matches enum fields/attributes. Supplemental error.rs601-615 and753-761 confirms selected typed-source classification.',
'Matches u64 mask formula. Supplemental bit.rs15-46 confirms the shared unguarded power-of-two check and usize examples.',
'Matches synthetic time fixture and110 assertion. Supplemental aimd.rs247-275 confirms adjustment precedes new outcome accounting.',
'Matches repeated nested fields and bytes-valued metadata tags exactly.',
'Matches field IDs, multiple fragments/files and maximum43 assertion. Supplemental manifest.rs174-204 confirms constructor does not assign schema IDs.',
'Matches two list rows, exact first-row values and null-child rejection; listed other cases absent.',
'Matches imports, helper and nonnull Int32 batch. Supplemental entry_io.rs40-53 confirms with_pos only stores logical position.',
'Matches complete map replacement and missing-field InvalidInput, contradicting no-op comment; no primary-key check.',
'Matches all twelve field tags/presence markers and wider IPC filter schema comment; no empty-list policy declared.',
'Matches LazyLock and two aarch64 cfg branches without individual kernel checks.',
'Matches two-of-three throttle fixture. Supplemental aimd.rs253-269 confirms strict greater-than threshold.',
'Matches leaf fields and comments. Supplemental encodings_v2_1.proto385-407 confirms general buffer compression makes parents opaque.',
'Matches nested Option/error behavior and Arc sizing delegation. Supplemental deepsize.rs182-190 and row_addr_remap.rs167-174,391-470,563-625 confirms dedup and local validation/mapping references.',
'Matches four unchanged async delegations with no local count/policy mutation.'
];
for(const s of v.checks.accuracy.samples){s.manual_review='pass';s.review_note=notes[s.id-1];}
Object.assign(v.checks.accuracy,{manual_pass:true,reviewed_count:20,passed_count:20});
const audit=read('verification/iteration-032-top-level-audit.json');
const noItems=audit.filter(a=>a.items.length===0).map(a=>({path:a.path,notes:a.no_items_notes,evidence:fs.lstatSync(path.join(root,a.path)).isSymbolicLink()?fs.readlinkSync(path.join(root,a.path)):fs.readFileSync(path.join(root,a.path),'utf8'),manual_review:'pass'}));
write('verification/iteration-032-no-items.json',noItems);
for(const s of v.checks.line_accountability.samples){s.manual_review='pass';s.review_note='Fresh declaration-to-authored-range mappings read during VERIFY32; no previous-turn audit reuse.';}
Object.assign(v.checks.line_accountability,{manual_pass:true,top_level_items_reviewed:513,mapping_evidence:'verification/iteration-032-top-level-audit.json',fresh_files_reviewed:42,same_active_turn_reused_files:0,no_item_evidence:'verification/iteration-032-no-items.json'});
v.checks.layer_consistency={pass:false,findings:[
{path:'L0-orientation.md',line:177,issue:'Glossary still calls data-file version selection unreviewed although version.rs is analyzed; distinguish exact mapping from pending writer dispatch.'},
{path:'L3-symbols/format-spec.md',line:245,issue:'Fragment projection paragraph still says exact lance-file parsing/serialization remains pending, conflicting with the later complete version-codec section.'}
]};
v.checks.self_sufficiency={pass:false,kb_only:true,reviewed_documents:['L4-crosscutting/scenarios.md','L4-crosscutting/cookbook.md','L3-symbols/format-spec.md','L1-modules/rust-lance-file.md','L4-crosscutting/build-and-test.md'],answers:{
write_then_compact:'FAIL. KB explains schema import, manifest sharing/detachment, deletion predicates, ordered remapping, local row-ID construction/serialization and cursor costs. Segment construction collects a Vec and may scan the whole numeric span; sequence serialization clones and collects protobuf segments (segment.rs126-299; serde.rs232-344). Dataset::write/compact entry points, file IO scheduling, actual allocation ownership through compaction, index remapping lifecycle, atomic commit and cleanup remain missing. Local arithmetic is insufficient for complete disk/memory trace.',
new_scalar_index:'FAIL. KB supplies schema-message/package constraints, IndexMetadata coverage and cache codec, overlay stale sets and core Bloom behavior. Cookbook explicitly lacks index traits, registration/loader dispatch, planner, write/update integration, tests and binding mappings. It cannot provide a complete implementable scalar-index recipe.',
v2_format:'FAIL. KB specifies schema envelope order and derived40-byte footer, selectors Stable2.2/Next2.3, exact identity mappings and eight-byte footer recognition (file2.proto11-115; version.rs19-262; lib.rs25-60). It records schema gates for2.2 large chunks/constants/packed structs and2.3 sparse layout, plus implemented table feature flags. Full encoder/reader algorithms, exhaustive runtime gates, historical fixtures and list-null equality discrepancy remain unresolved. Two stale pending-status statements were additionally found in cross-layer review.',
python_api:'FAIL. Python/PyO3 APIs have not been analyzed. Contributor environment policy and core Rust APIs provide no complete Python signatures, defaults, exceptions or Rust binding mapping.',
transaction_commit:'FAIL. KB supplies protobuf operations, schema-change classifier, key filter representation, local manifest/lineage transformations, capability flags and typed unknown-commit/conflict errors. Runtime operation enum, operation-pair conflict matrix, manifest-builder orchestration, retries, atomic object-store publication and full new-operation recipe remain missing.'
},review_note:'Answers attempted from the named KB documents only. Source was consulted for accuracy auditing separately, not to invent missing scenario steps.'};
v.overall_pass=false;v.reviewed_at=new Date().toISOString();write(file,v);
fs.appendFileSync(path.join(output,'verification-log.md'),`\n## Iteration 32 — ANALYZE then VERIFY — FAIL (global coverage, self-sufficiency and stale cross-layer status)\n\n- Analyzed all1,624 lines of rowids/segment.rs, added83 Rust symbol records and refreshed eight dependent L2 analyses plus L0/L1/L3/L4. Coverage99 files/38,176 lines;4,147 symbols (971 protobuf+3,176 Rust); table24 entries/11,637 lines.\n- [Verification](verification/iteration-032.json), [top-level audit](verification/iteration-032-top-level-audit.json), [no-item evidence](verification/iteration-032-no-items.json); seed ${v.seed}. Full scan/hash unchanged, Git clean.\n- Line accountability PASS:513 lexical candidates across42 freshly reviewed files. Accuracy PASS:20/20 random claims with contextual checks. Cross-links PASS:9,777 citations and6,249 links.\n- KB-only scenario review found two stale pending-status statements about already analyzed exact file-version mappings in L0 and L3. These are recorded as cross-layer consistency FAIL and require a separate ANALYZE phase; no analysis edits occurred during VERIFY.\n- All five complete KB-only answers remain FAIL;1,960 files including294 binaries pending. No source edits, network, builds/tests/benchmarks. Decision: ANALYZE33 first corrects stale version-status prose, then fresh VERIFY; full RowIdSequence and transaction consumers remain next coverage targets. Goal active; no completion report.\n`);
write('iteration-state.json',{iteration:33,phase:'ANALYZE',completed:false,previous_verification:file,totals:v.totals,read_not_analyzed:[{path:'rust/lance-table/src/utils/stream.rs',note:'Prior truncated read; reread all1887 lines.'},{path:'rust/lance-table/src/rowids.rs',read_ranges:[[1,44]],note:'Only routing/opening contract; all2309 lines need complete analysis.'}],next:'Correct VERIFY32 stale version-status claims in L0 and L3, then VERIFY33. Next full coverage: rowids.rs2309; transaction/row_version.rs1461; manifest builder/conflicts/IO.',acceptance_gaps:['1960 files pending','294 binary files pending','all five complete self-sufficiency answers fail','two stale cross-layer status claims','full runtime formats, bindings and call graph pending']});
let r=fs.readFileSync(path.join(output,'README.md'),'utf8');r=r.slice(0,r.indexOf('## Current checkpoint'))+`## Current checkpoint

99 of 2,059 files and 38,176 of 1,166,813 inventory text lines are analyzed. The symbol index contains4,147 records:971 protobuf and3,176 Rust. All294 binary files remain pending.

VERIFY32 passed20/20 sampled claims,513 declaration mappings across42 files, and checks of9,777 citations plus6,249 links. Its KB-only review found two stale cross-layer status statements about exact file-version analysis; ANALYZE33 will correct them. Source is clean and unchanged. Global acceptance still fails:1,960 files and all five complete self-sufficiency answers remain pending. See [iteration state](iteration-state.json) and [verification log](verification-log.md).

Segment construction, representation selection, mutation and bitmap cursors now have complete local source analysis. Full RowIdSequence and dataset/transaction integration remain pending. The row-ID schema bitmap comment says MSB-first, while current implementation and byte-exact test use LSB-first; [format reconstruction](L3-symbols/format-spec.md) preserves the discrepancy. Historical compatibility remains unverified. (protos/rowids.proto:51-58; rust/lance-table/src/rowids/bitmap.rs:67-77; rust/lance-table/src/rowids/serde.rs:436-451)

Analysis records retain superseded drafts for provenance. Follow each file's current analysis_record in MANIFEST and its current L2 document; verification snapshots intentionally retain sampled claims. Source tests and benchmarks were read, not executed.
`;fs.writeFileSync(path.join(output,'README.md'),r);
console.log({accuracy:'20/20',top_items:513,layer_consistency:false,next:33,totals:v.totals,overall_pass:false});
