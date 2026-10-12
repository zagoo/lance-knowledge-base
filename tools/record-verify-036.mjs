import fs from 'node:fs';
import path from 'node:path';
import {output,root} from './inventory.mjs';
const read=f=>JSON.parse(fs.readFileSync(path.join(output,f),'utf8'));
const write=(f,v)=>fs.writeFileSync(path.join(output,f),JSON.stringify(v,null,2)+'\n');
const file='verification/iteration-036.json',v=read(file);
if(v.checks.accuracy.manual_pass!==null)throw Error('Already recorded');
const notes=[
'Matches derives, public field types, field/column mapping and relative path documentation. No measured Arc savings claimed.',
'Matches sorted/disjoint/nonadjacent validation and prefix arithmetic. Supplemental lines36-61 establish bounded nonempty holes and equal input lengths.',
'Matches consumed projection mutation and delegated schema validation. Supplemental schema.rs474-502,889-908 and field.rs788-868 confirm missing/type mismatch failures can precede TakeSelf fallback.',
'Matches ceiling allocation, high-bit padding and zero-length behavior. Supplemental lines33-38 and54-66 distinguish empty constructor and unvalidated from_parts.',
'Matches feature gates, source-preserving IO/External conversions and track_caller. Supplemental lines996-1007 confirm distinct SQL InvalidInput mapping.',
'Matches exact default V2_2 and selector documentation. No Hash/order derive or whole-system enforcement claimed.',
'Matches retained raw fields, unchecked usize casts, empty-string normalization and collected base paths. Full-file fragment_tree search finds only encoder None, consistent with missing Rust field.',
'Matches writer helper logical position and nonnull Int32 fixture. Supplemental lines31-57 confirm with_pos stores position without writing prefix bytes.',
'Matches constructor field types and exact metadata version conversion. No content validation is performed.',
'Matches empty backtrace feature and datafusion dependencies. Supplemental error.rs10-56 confirms enabled optional Snafu backtrace and disabled unit wrapper; no measured whole-Error size claim.',
'Matches optional index offset6, timestamp7 and ordinary string tag8 presence semantics.',
'Matches sparse overlay fields/coverage bitmap roundtrip by position. No storage IO, null-value resolution or gate enforcement asserted.',
'Matches rechunk empty-input skip behavior, short final chunk policy and zero-size no-consumption case.',
'Matches default async open, Arc reader delegation and required Sized reader method; no local cache/detection implementation.',
'Matches query field tags1-13, option presence and default metric comment. Numeric domains and semantics are not locally enforced.',
'Matches missing-physical-count fixture and Internal/message assertions. No Column or later-fragment rollback case present in the sampled test.',
'Matches UInt64 mixed-section sequencing. Supplemental entire remaining test region230-365 confirms no failing-writer, huge-header, bad constructor offset or pointer-identity fixture.',
'Matches six-representation slice fixture and loop exclusions plus empty terminal slice. No Ranges or invalid-positive-bound case in these tests.',
'Matches private config/Mutex ownership and Debug delegation. Supplemental entire controller implementation222-290 confirms poisoned lock unwrap, no mutable-config API or Clone implementation.',
'Matches optional file-list normalization, cloned metadata, explicit index-version presence and signed-to-unsigned timestamp cast. No covering validation in encoder.'
];
for(const s of v.checks.accuracy.samples){s.manual_review='pass';s.review_note=notes[s.id-1];}
Object.assign(v.checks.accuracy,{manual_pass:true,reviewed_count:20,passed_count:20});
const audit=read('verification/iteration-036-top-level-audit.json');
for(const s of v.checks.line_accountability.samples){s.manual_review='pass';s.review_note='Fresh declaration-to-authored-range mappings read in bounded VERIFY36 outputs; truncated portions reread. No previous-turn review reused.';}
write('verification/iteration-036-no-items.json',audit.filter(a=>!a.items.length).map(a=>({path:a.path,notes:a.no_items_notes,evidence:fs.lstatSync(path.join(root,a.path)).isSymbolicLink()?fs.readlinkSync(path.join(root,a.path)):fs.readFileSync(path.join(root,a.path),'utf8'),manual_review:'pass',review_note:'Fresh exact license or symlink content checked.'})));
Object.assign(v.checks.line_accountability,{manual_pass:true,top_level_items_reviewed:508,mapping_evidence:'verification/iteration-036-top-level-audit.json',fresh_files_reviewed:42,same_active_turn_reused_files:0,no_item_evidence:'verification/iteration-036-no-items.json'});
v.checks.self_sufficiency={pass:false,kb_only:true,reviewed_documents:['L4-crosscutting/scenarios.md','L4-crosscutting/cookbook.md','L3-symbols/format-spec.md','L1-modules/rust-lance-table.md'],answers:{
write_then_compact:'FAIL. KB describes local sequence construction, rechunking, fresh-ID allocation and lineage stamping without IO. It cannot trace Dataset::write/compact_files scheduling, complete memory ownership, data-file writes, index remapping, atomic publication or cleanup.',
new_scalar_index:'FAIL. Protobuf metadata, cache codec, overlay staleness and local Bloom helper extension steps are available. Scalar traits, registration/loader dispatch, planner, full writer/update integration, tests and bindings remain absent from the complete recipe.',
v2_format:'FAIL. The schema-derived40-byte envelope, numeric/manifest identities, Stable2.2/Next2.3 selectors, footer recognition and documented2.2/2.3 encoding gates are available. Full runtime reader/writer algorithms and exhaustive gates, historical fixtures and list-null equality discrepancy remain unresolved.',
python_api:'FAIL. Contributor instructions are present, but Python/PyO3 public signatures, defaults, exceptions and Rust mappings remain unanalyzed.',
transaction_commit:'FAIL. Local assignment and creation/update resolver are now complete: physical-count requirement, metadata matrix, preload failures, source ordering, fallback1 and partial mutation are documented. Narrow builder context locates calls, but full operation definitions, pairwise conflicts, manifest construction, retries and storage publication protocol remain missing.'},review_note:'Fresh answers from the current KB. Source spot-checks did not fill missing scenario steps. All five remain global self-sufficiency failures.'};
v.overall_pass=false;v.reviewed_at=new Date().toISOString();write(file,v);
fs.appendFileSync(path.join(output,'verification-log.md'),`\n## Iteration 36 — ANALYZE then VERIFY — FAIL (global coverage/self-sufficiency)\n\n- Fully read and authored57 contiguous ranges for transaction/row_version.rs,1,461 lines; refreshed two prior L2 limits and updated L0-L4. Added34 Rust symbols. Contextual builder/facade/test-support reads remain pending full-file coverage.\n- [Verification](verification/iteration-036.json), [declaration audit](verification/iteration-036-top-level-audit.json), [no-item evidence](verification/iteration-036-no-items.json); seed ${v.seed}. Full inventory/hash unchanged; final Git status empty and HEAD c3c8d6fb505fb437b2b673c5195e1d4b74436b2f.\n- Claimed scope PASS:101 files/41,946 lines;4,296 symbols (971 protobuf+3,325 Rust). Line accountability PASS:508 declarations across42 freshly reviewed files. Accuracy PASS:20/20 random claims with supplemental source checks. Links PASS:10,429 citations and6,575 links. No accuracy mismatch found.\n- All five complete KB-only answers remain FAIL;1,958 files including294 binaries pending. No network, source edits, builds/tests/benchmarks. Decision: ANALYZE37 studies transaction facade, builder, operation/preparation definitions and shared fixtures before full manifest/conflict work. Goal remains active; no completion report.\n`);
write('iteration-state.json',{iteration:37,phase:'ANALYZE',completed:false,previous_verification:file,totals:v.totals,read_not_analyzed:read('analysis/iteration-036-contextual-reads.json'),next:'Completely read transaction facade, builder, operation/preparation definitions and shared test support; author complete ranges, symbols and layer integration, then VERIFY37. Continue full manifest builder, conflict resolution and IO paths.',acceptance_gaps:['1958 files pending','294 binary files pending','all five complete self-sufficiency answers fail','full runtime formats, bindings and call graph pending']});
let r=fs.readFileSync(path.join(output,'README.md'),'utf8');r=r.slice(0,r.indexOf('## Current checkpoint'))+`## Current checkpoint

101 of 2,059 files and 41,946 of 1,166,813 inventory text lines are analyzed. Coverage includes all15 protobuf-subsystem files, all48 lance-core files,26 lance-table entries, seven lance-file entries and five other contributor guides. The symbol index contains4,296 records:971 protobuf and3,325 Rust. All294 binary files remain pending.

Thirty-six VERIFY cycles are recorded. VERIFY36 passed20/20 random claims,508 declaration mappings across42 freshly reviewed files, and checks of10,429 citations plus6,575 links. Source remains clean and unchanged. Global acceptance still fails:1,958 files and all five complete KB-only answers remain pending. ANALYZE37 continues transaction definitions and preparation before the full manifest/commit path. See [iteration state](iteration-state.json) and [verification log](verification-log.md).

Local row-ID sequence operations, assignment and creation/update lineage resolution now have complete source analysis. Full operation/conflict/commit and IO integration remain pending. Source-derived edge cases and test gaps are documented without claiming reproduction. Source tests and benchmarks were read, not executed.

Analysis records retain superseded drafts for provenance. Follow each file's current analysis_record in MANIFEST and its current L2 document; verification snapshots intentionally retain sampled claims. The source remains read-only and the goal remains active and INCOMPLETE.
`;fs.writeFileSync(path.join(output,'README.md'),r);
console.log({accuracy:'20/20',declarations:508,next:37,totals:v.totals,overall_pass:false});
