import fs from 'node:fs';
import path from 'node:path';
import {output,root} from './inventory.mjs';
const read=f=>JSON.parse(fs.readFileSync(path.join(output,f),'utf8'));
const write=(f,v)=>fs.writeFileSync(path.join(output,f),JSON.stringify(v,null,2)+'\n');
const file='verification/iteration-034.json',v=read(file);
if(v.checks.accuracy.manual_pass!==null)throw Error('Already recorded');
const notes=[
'Matches empty SimpleStruct, validity TODO and all Binary/Variable fields; does not invent offset semantics.',
'Matches all three uint32 fields and documented recall/memory/build tradeoff; no default or legality promise.',
'Matches move-only wrapper conversions; no wire encoding, clone or validation occurs.',
'Matches projection ordering, dot rejection, missing policy and metadata. Supplemental schema.rs889-928 confirms differing Arrow and borrowed-Schema conversion checks.',
'Matches ten explicit negative tokens and Some(false) assertion; unknown input is not asserted here.',
'Matches one sequential await per input, ordered output, duplicates and fail-fast Result propagation; no side-effect rollback contract.',
'Matches SlotBackoff max-attempt fixture. Supplemental backoff.rs1-84 confirms ordinary Backoff attempt increment is unsaturated.',
'Matches private AtomicBool wrapper and SeqCst wake store; no Pending check is substituted.',
'Matches the complete comment list and separate nullable field; explicitly limits this to schema documentation.',
'Matches four track_caller constructors. Supplemental error.rs157-159 derives Debug and Snafu, not Clone.',
'Matches range assertions and all four parameterized constructor fixtures; no executed-test claim.',
'Matches permit forgetting, peer count, conditional clone and original return. Supplemental futures.rs34-35,160-196,225-246 confirms u32 counters and mutex reacquisition/unwrap; panic/overflow edges remain source deductions.',
'Matches enum numbers, field tags and signed IDs; bare parent_id has no optional presence.',
'Matches both recursive list branches. Supplemental key_existence.rs373-390 confirms remaining Struct and default None branches, excluding FixedSizeList.',
'Matches high-water fallback and field maximum. Supplemental fragment.rs589-613 confirms referenced files include base and overlay data files.',
'Matches private semver parse, optional nonempty pre/build extraction, clearing and failure None.',
'Matches byte allocation, increment, membership and error translation. Supplemental sbbf.rs297-305 inserts into existing block without growth.',
'Matches feature gates and actual environment-presence predicate; comment mismatch is accurately scoped, with no runtime result claimed.',
'Matches atomic blob/packed handling, recursively surviving children and V2.0 empty structural parent; null fill is delegated.',
'Matches first-row delegation, half-open range and unchecked next-fragment addition; edge case explicitly source-derived.'
];
for(const s of v.checks.accuracy.samples){s.manual_review='pass';s.review_note=notes[s.id-1];}
Object.assign(v.checks.accuracy,{manual_pass:true,reviewed_count:20,passed_count:20});
const audit=read('verification/iteration-034-top-level-audit.json');
for(const s of v.checks.line_accountability.samples){s.manual_review='pass';s.review_note='Fresh declaration-to-authored-range mapping reviewed in VERIFY34; source declarations mapped, with stale format-facade status recorded separately.';}
write('verification/iteration-034-no-items.json',audit.filter(a=>!a.items.length).map(a=>({path:a.path,notes:a.no_items_notes,evidence:fs.lstatSync(path.join(root,a.path)).isSymbolicLink()?fs.readlinkSync(path.join(root,a.path)):fs.readFileSync(path.join(root,a.path),'utf8'),manual_review:'pass',review_note:'Exact two-line license or symlink target freshly read in VERIFY34.'})));
Object.assign(v.checks.line_accountability,{manual_pass:true,top_level_items_reviewed:527,mapping_evidence:'verification/iteration-034-top-level-audit.json',fresh_files_reviewed:42,same_active_turn_reused_files:0,no_item_evidence:'verification/iteration-034-no-items.json'});
v.checks.layer_consistency={pass:false,findings:[
{path:'L2-files/rust/lance-table/src/format.rs.md',source_range:'rust/lance-table/src/format.rs:15-30',problem:'Authored range still says full sequence pending after rowids.rs was completely analyzed.'},
{path:'L1-modules/rust-lance-table.md',line:90,problem:'Historical next-analysis paragraph still calls metadata parsing/serialization and exact per-file versions pending although later sections cover them.'},
{path:'L1-modules/rust-lance-table.md',line:845,problem:'Exact truthy parsing called pending although core utils/parse.rs is already fully analyzed.'}
],scope:'Targeted inconsistencies noticed during declaration and KB-only scenario checks, not an exhaustive semantic sweep.'};
v.checks.self_sufficiency={pass:false,kb_only:true,reviewed_documents:['L4-crosscutting/scenarios.md','L4-crosscutting/cookbook.md','L3-symbols/format-spec.md','L1-modules/rust-lance-table.md','L1-modules/rust-lance-file.md'],answers:{
write_then_compact:'FAIL. KB now explains full local sequence construction, selection/cursor reset, deletion, masking, cloning, set conversion and rechunking. Rechunking materializes even whole range segments; incomplete mode permits shortage but does not assign IDs (rowids.rs946-1052). These functions perform no IO. Dataset write/compact entry points, scheduling, disk writes, complete lifetime/ownership, index remapping, atomic commit and cleanup remain missing.',
new_scalar_index:'FAIL. Schema and metadata rules, index cache codec and overlay stale sets are covered. Cookbook still lacks scalar traits, registry/loader dispatch, planner and writer/update integration, complete tests and binding mappings. No complete implementation recipe is possible.',
v2_format:'FAIL. KB provides envelope fields and derived40-byte footer, exact version/alias mapping, Stable2.2/Next2.3 policy and eight-byte footer recognition, schema gates for2.2 large chunks/constants/packed structs and2.3 sparse layout. Full encoder/reader algorithms, exhaustive runtime gates, historical fixture validation and list-null equality discrepancy are unresolved.',
python_api:'FAIL. Python/PyO3 APIs remain unanalyzed; contributor policy does not supply signatures, defaults, exceptions or Rust mappings.',
transaction_commit:'FAIL. Protobuf operations, metadata converters, schema-change classifier, flags, lineage helpers and contextual range-segment opt-in are documented. Full operation enum, pairwise conflict rules, manifest orchestration, retries, publication protocol and new-operation recipe remain missing.'},review_note:'Fresh answers from the current KB documents after sequence integration. No source lookup filled missing scenario steps. All five fail global self-sufficiency.'};
v.overall_pass=false;v.reviewed_at=new Date().toISOString();write(file,v);
fs.appendFileSync(path.join(output,'verification-log.md'),`\n## Iteration 34 — ANALYZE then VERIFY — FAIL (global gaps and stale status)\n\n- Completely read and analyzed rowids.rs (2,309 lines), updated seven earlier L2 limitations and added115 Rust symbols. Narrow dependency/caller snippets remain partial, not analyzed files.\n- [Verification](verification/iteration-034.json), [declaration audit](verification/iteration-034-top-level-audit.json), [no-item evidence](verification/iteration-034-no-items.json); seed ${v.seed}. Full inventory/hash unchanged.\n- Claimed coverage100 files/40,485 lines;4,262 symbols (971 protobuf+3,291 Rust). Line accountability PASS:527 declarations across42 freshly reviewed files. Accuracy PASS:20/20 claims with contextual checks. Links PASS:10,206 citations and6,493 links.\n- Three stale coverage-status statements found in the format facade and table overview. No analysis was edited during VERIFY. Next ANALYZE35 corrects these; a local helper-scope sentence will also point to the completed sequence trace for clarity.\n- All five KB-only acceptance answers FAIL;1,959 files including294 binaries pending. No source edits, network or source build/test/benchmark execution. Goal active; no completion report.\n`);
write('iteration-state.json',{iteration:35,phase:'ANALYZE',completed:false,previous_verification:file,totals:v.totals,next:'Correct the three stale coverage statements recorded by VERIFY34, clarify local HoleRuns trace scope, then VERIFY35. Next substantive analysis: transaction/row_version.rs and manifest/conflict/IO consumers.',read_not_analyzed:[{path:'rust/lance-select/src/mask.rs',read_ranges:[[1,100],[340,412],[475,527],[545,592],[750,835],[1014,1031]],note:'Contextual reads only for RowIdSequence mask semantics.'},{path:'rust/lance-table/src/transaction/manifest_build.rs',read_ranges:[[70,140]],note:'Only range-segment opt-in context read; complete builder pending.'},{path:'rust/lance-table/src/utils/stream.rs',read_ranges:[[390,445],[640,680]],note:'Contextual decoder/cursor dispatch only; earlier full attempt truncated. Reread all1887 lines for complete analysis.'}],acceptance_gaps:['1959 files pending','294 binary files pending','three stale coverage statements','all five complete self-sufficiency answers fail','full runtime formats, bindings and call graph pending']});
let r=fs.readFileSync(path.join(output,'README.md'),'utf8');r=r.slice(0,r.indexOf('## Current checkpoint'))+`## Current checkpoint

100 of 2,059 files and 40,485 of 1,166,813 inventory text lines are analyzed. Coverage includes all15 protobuf-subsystem files, all48 lance-core files,25 lance-table entries, seven lance-file entries and five other contributor guides. The symbol index contains4,262 records:971 protobuf and3,291 Rust. All294 binary files remain pending.

Thirty-four VERIFY cycles are recorded. VERIFY34 passed20/20 sampled claims,527 declaration mappings across42 fresh files, and checks of10,206 citations plus6,493 links. It found three stale coverage-status statements, which ANALYZE35 will correct. Global acceptance still fails:1,959 files and all five complete KB-only answers remain pending. See [iteration state](iteration-state.json) and [verification log](verification-log.md).

Full local RowIdSequence construction, mutation, selection/cursors, masking, set conversion and rechunking now have complete source analysis. Dataset/transaction IO integration remains pending. Source-derived edge cases and test gaps are documented without claiming reproduction. Source tests and benchmarks were read, not executed.

Analysis records retain superseded drafts for provenance. Follow each file's current analysis_record in MANIFEST and its current L2 document; verification snapshots intentionally retain sampled claims. The source remains read-only and the goal remains active and INCOMPLETE.
`;fs.writeFileSync(path.join(output,'README.md'),r);
console.log({accuracy:'20/20',declarations:527,findings:3,next:35,overall_pass:false});
