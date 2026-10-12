import fs from 'node:fs';
const read=f=>JSON.parse(fs.readFileSync(f)),write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n');
const file='verification/iteration-040.json',v=read(file),audit=read('verification/iteration-040-top-level-audit.json');
if(v.checks.accuracy.manual_pass!==null)throw Error('Already recorded');
const notes=[
'Predicate insert/remove and intersection flags match. Supplemental field.rs274-309 confirms assertion for a selected nested parent with no projected children.',
'Both empty/null description cases and inner/outer layer declarations match schema exactly.',
'Running extrema/count and strict-less sorted check match; equal values do not unset sorted.',
'All five PQ fields/tags and both codebook size comments match; runtime validation not inferred.',
'Both struct components and accepted/rejected rows match assertions. Full test file was previously read; no execution claimed.',
'Matches five nullable Int32 fixture fields, conversion and assigned IDs.',
'Exactly one bitmap arm and cached cardinality match. Supplemental segment.rs346-354 confirms density formula.',
'Binary search/predecessor, unchecked cast and deep-size delegation match. Supplemental391-470 and563-625 confirms constructor cardinality and valid-rank call path.',
'Matches one three-value Int32 column and >=12 lower-bound assertion.',
'Decode/missing-span Internal errors, segment conversion and collection match; no cross-run normalization added.',
'ExternalFile and tree-only layout tags match. Supplemental74-81 confirms reserved removed lineage arms; writer-history comment remains source-only.',
'All13 explicitly listed UpdateMemWalState-left pairs have differing discriminants and return false; equality is not compatibility.',
'Manual schema construction and quoted resolutions match. Supplemental schema331-346/889-907 confirms dotted-root rejection under normal conversion.',
'Checked destination increment precedes physical counters, block snapshot and reset match. u32-count limitation is arithmetic deduction.',
'Ordered range/required-array/strict-order/bounds checks and preserved representation match.',
'Backend await precedes counters; exactly one hit or miss, wrong-type warning and no retry/eviction/accessor registration match.',
'All assertions match. Supplemental203-236 confirms four named zero-capacity/no-cache success/error cases and pending first loader.',
'Exact weight23 and configured1MiB assertions match; resident-memory measurement not claimed.',
'All16 operation tags100-115 match and no runtime dispatch inferred from schema alone.',
'Typo and unrelated-name suggestions/available fields plus three field-path membership assertions match.'
];
for(const s of v.checks.accuracy.samples){s.manual_review='pass';s.review_note=notes[s.id-1];}
Object.assign(v.checks.accuracy,{manual_pass:true,reviewed_count:20,passed_count:20});
for(const s of v.checks.line_accountability.samples){const a=audit.find(a=>a.path===s.path);s.manual_review='pass';s.review_note=a.unchanged_from_current_turn_review?'Exact unchanged mappings reused from VERIFY39 manually reviewed in the same continuous work sequence.':'Fresh declaration mappings read in VERIFY40 bounded outputs; truncated AIMD/tempfile region reread completely.';}
write('verification/iteration-040-no-items.json',read('verification/iteration-039-no-items.json').map(a=>({...a,review_note:'Exact license/symlink evidence unchanged from VERIFY39 freshly read in this continuous work sequence.'})));
Object.assign(v.checks.line_accountability,{manual_pass:true,top_level_items_reviewed:511,fresh_files_reviewed:20,same_active_turn_reused_files:22,reused_iterations:[39],mapping_evidence:'verification/iteration-040-top-level-audit.json',no_item_evidence:'verification/iteration-040-no-items.json'});
v.checks.self_sufficiency=read('verification/iteration-039.json').checks.self_sufficiency;
v.checks.self_sufficiency.answers.transaction_commit='FAIL. Full local validate_operation dispatch/errors, Merge schema/fragment guards and physical-rewrite predicate now join16 operation payloads, constructors, map edits, equality/overlap and lineage helpers. Contextual execute/execute_inner snippets show timeout, deep-clone guard and validation call. Complete codec, manifest/index application, conflict resolver, retries and store publication remain missing; this is not a complete new-operation recipe.';
v.checks.self_sufficiency.review_note='All five answers reconsidered from the current KB. New validation scenario/cookbook/API supplement read after generation; unchanged format/index/Python limitations persist from the preceding KB-only review. No source lookup supplied missing scenario steps.';
v.overall_pass=false;v.reviewed_at=new Date().toISOString();write(file,v);
fs.appendFileSync('verification-log.md',`\n## Iteration 40 — ANALYZE then VERIFY — FAIL (global coverage/self-sufficiency)\n\n- Added complete755-line transaction/validate.rs analysis:30 contiguous ranges,21 symbols and L0-L4 updates. Recorded modern-check scope, Merge identity and duplicate-ID semantics, validation order, internal/public routes, test coverage and comment/code differences. [Analysis](analysis/iteration-040-transaction-validation.json).\n- [Verification](verification/iteration-040.json), [mapping audit](verification/iteration-040-top-level-audit.json), [no-item evidence](verification/iteration-040-no-items.json); seed ${v.seed}. Full inventory/hash unchanged; final Git clean at c3c8d6fb505fb437b2b673c5195e1d4b74436b2f.\n- Claimed scope PASS:109 files/44,782 lines;4,516 symbols (971 protobuf+3,545 Rust). Line accountability PASS:511 declarations/42 files,20 fresh and22 exact unchanged mappings from VERIFY39 manually reviewed in this continuous work sequence. Accuracy PASS:20/20 fresh source claims plus supplemental context; no mismatch. Links PASS:11,058 citations/6,942 links.\n- All five complete KB-only answers FAIL;1,950 files including294 binaries pending. Decision: ANALYZE41 transaction/proto.rs and refresh superseded pending statements, then full manifest/index/commit paths. Goal remains active and INCOMPLETE; source read-only, no network/builds/tests/benchmarks.\n`);
write('iteration-state.json',{iteration:41,phase:'ANALYZE',completed:false,previous_verification:file,totals:v.totals,read_not_analyzed:read('analysis/iteration-040-contextual-reads.json'),next:'Fully read transaction/proto.rs885 lines, document all serialization/default/compatibility/error paths and tests. Refresh superseded pending statements about already-covered conflicts/validate definitions. Continue manifest_build.rs5468,index_maintenance.rs1639 and commit IO.',acceptance_gaps:['1950 files pending','294 binary files pending','all five complete self-sufficiency answers fail','full runtime formats, bindings and call graph pending']});
let r=fs.readFileSync('README.md','utf8');r=r.slice(0,r.indexOf('## Current checkpoint'))+`## Current checkpoint

109 of 2,059 files and 44,782 of 1,166,813 inventory text lines are analyzed. Coverage includes all15 protobuf-subsystem files, all48 lance-core files,34 lance-table entries, seven lance-file entries and five other contributor guides. The symbol index contains4,516 records:971 protobuf and3,545 Rust. All294 binary files remain pending.

Forty VERIFY cycles are recorded. VERIFY40 passed20/20 sampled claims,511 declaration mappings across42 files (20 fresh,22 unchanged from the immediately preceding review), and11,058 citations plus6,942 links. Source remains clean and unchanged. Global acceptance still fails:1,950 files and all five complete KB-only answers remain pending. ANALYZE41 continues transaction protobuf conversion. See [iteration state](iteration-state.json) and [verification log](verification-log.md).

The [transaction supplement](L1-modules/rust-lance-table-transactions.md) covers all16 payloads, constructors, map edits, attempt containers, equality, metadata/config overlap and local pre-validation. Local row-ID assignment/version resolution is covered; full conflict resolver, codec, manifest construction and commit IO remain pending. Source tests and benchmarks were read, not executed; derived edge cases are not runtime reproductions.

Analysis records retain superseded drafts for provenance. Follow each file's current analysis_record in MANIFEST and its current L2 document; verification snapshots intentionally retain sampled claims. The source remains read-only and the goal remains active and INCOMPLETE.
`;fs.writeFileSync('README.md',r);
console.log({accuracy:'20/20',declarations:511,references:'pass',next:41,totals:v.totals,overall_pass:false});
