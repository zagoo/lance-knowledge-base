import fs from 'node:fs';
import path from 'node:path';
import {output,root} from './inventory.mjs';
const read=f=>JSON.parse(fs.readFileSync(path.join(output,f),'utf8'));
const write=(f,v)=>fs.writeFileSync(path.join(output,f),JSON.stringify(v,null,2)+'\n');
const file='verification/iteration-035.json',v=read(file);
if(v.checks.accuracy.manual_pass!==null)throw Error('Already recorded');
const notes=[
'Matches private variants/derives and all delegations, including conservative empty-Direct-only deletion proof.',
'Matches public exhaustive enum, selector visibility, payloads, implicit context and exact Display annotations; no macro expansion assumed.',
'Matches UpdateConfig nonempty-map condition and size-independent borrowed protobuf input; downstream ordering remains unclaimed.',
'Matches trait/default/blanket implementation. Supplemental futures.rs329-361 confirms pin projection and pinned drop; full-file unsafe search had no matches.',
'Matches fields and oneof. Supplemental fragment_metadata.proto74-81 confirms reserved removed external lineage arms.',
'Matches all size-comparison branches and unchecked casts. Supplemental segment.rs378-387 and rowids.rs302-320 confirms materializing slice and boundary range merge.',
'Matches four async benchmarks with one runtime and no Option assertion. Supplemental baseline get bodies and cache/mod.rs get/downcast/counter sites confirm whole-wrapper comparison.',
'Matches four structural fixtures and outcomes; no actual null values constructed or validated.',
'Matches all statistics tags and documented one-batch matrix. Supplemental file.proto25-29 confirms tag4 reservation rationale.',
'Matches all three variants and little-endian temporary Vec packing; no validation or measured optimizer claim.',
'Matches all four miss reasons, derives and documented recomputation intent; enum has no side effects.',
'Matches ordered destination prefix building and bitmap clone. Supplemental row_addr_remap.rs417-487 checks old IDs/counts but not destination uniqueness, and computes destination offset from positional prefix.',
'Matches Direct tri-state assertions and empty behavior. Supplemental direct constructor confirms no validation.',
'Matches empty-byte/empty-files normalization and delegated bitmap decode; no new metadata validation.',
'Matches wrapping salt multiplication,27-bit shift and fixed eight-lane array; exactly one bit per lane.',
'Matches both coverage arms and version/data fields. Supplemental overlay.rs97-104 confirms clone/optimize/serialize helper.',
'Matches owner synchronization,2threads and4contenders. Supplemental cache/mod.rs758-774 confirms TestKey alias ValueType Vec<u32>.',
'Matches private helper, rank variants and exact argument types; no oracle assertion attributed to this declaration range.',
'Matches rebuild/retain logic and preserved other fields. Supplemental overlay.rs54 confirms tombstone=-2; empty or all-tombstone lists removed.',
'Matches exact u64 mask formula and debug predicate. Supplemental bit.rs15-46 confirms corresponding usize versions and unchecked n-1 in is_pwr_two; invalid zero alignment is not safely validated.'
];
for(const s of v.checks.accuracy.samples){s.manual_review='pass';s.review_note=notes[s.id-1];}
Object.assign(v.checks.accuracy,{manual_pass:true,reviewed_count:20,passed_count:20});
const audit=read('verification/iteration-035-top-level-audit.json');
for(const s of v.checks.line_accountability.samples){const a=audit.find(a=>a.path===s.path);s.manual_review='pass';s.review_note=a.unchanged_from_current_turn_review?'Unchanged declaration mappings reused only from VERIFY34 reviewed earlier in this same active turn.':'Fresh declaration-to-authored-range mappings read in bounded VERIFY35 outputs; truncated initial output was reread.';}
write('verification/iteration-035-no-items.json',audit.filter(a=>!a.items.length).map(a=>({path:a.path,notes:a.no_items_notes,evidence:fs.lstatSync(path.join(root,a.path)).isSymbolicLink()?fs.readlinkSync(path.join(root,a.path)):fs.readFileSync(path.join(root,a.path),'utf8'),manual_review:'pass',review_note:'Freshly read exact seed-corpus or symlink evidence.'})));
Object.assign(v.checks.line_accountability,{manual_pass:true,top_level_items_reviewed:649,mapping_evidence:'verification/iteration-035-top-level-audit.json',fresh_files_reviewed:18,same_active_turn_reused_files:24,reused_iteration:34,no_item_evidence:'verification/iteration-035-no-items.json'});
v.checks.layer_consistency={pass:true,scope:'Three VERIFY34 status findings and one related scope clarification, not an exhaustive semantic proof.',evidence:'analysis/iteration-035-layer-corrections.json',review_note:'All four final paragraphs reread. Completed sequence, metadata/version mappings and truthy parsing are distinguished from pending index, stream, transaction and IO integration. Facade mappings and current MANIFEST agree.'};
v.checks.self_sufficiency=read('verification/iteration-034.json').checks.self_sufficiency;
v.checks.self_sufficiency.review_note='All five KB-only answers reconsidered after reading the corrected facade, table overview and scenario statements. Complete sequence and truthy parsing are available; none of the missing end-to-end implementation paths was added. Answers remain FAIL for the stated gaps. No source was used to fill scenario omissions.';
v.overall_pass=false;v.reviewed_at=new Date().toISOString();write(file,v);
fs.appendFileSync(path.join(output,'verification-log.md'),`\n## Iteration 35 — ANALYZE then VERIFY — FAIL (global coverage/self-sufficiency)\n\n- Corrected the three stale coverage statements found in VERIFY34 and clarified one HoleRuns helper-scope sentence. One prior L2 record refreshed; no new source coverage. [Corrections](analysis/iteration-035-layer-corrections.json).\n- [Verification](verification/iteration-035.json), [declaration audit](verification/iteration-035-top-level-audit.json), [no-item evidence](verification/iteration-035-no-items.json); seed ${v.seed}. Full inventory/hash unchanged; final Git status empty and HEAD c3c8d6fb505fb437b2b673c5195e1d4b74436b2f.\n- Claimed scope PASS:100 files/40,485 lines;4,262 symbols (971 protobuf+3,291 Rust). Line accountability PASS:649 declarations across42 files,18 fresh and24 unchanged mappings reused only from VERIFY34 in this same active turn. Accuracy PASS:20/20 new random claims. Links PASS:10,206 citations and6,495 links. All four corrected paragraphs verified.\n- All five complete KB-only answers still FAIL;1,959 files including294 binaries pending. No network, source edits, builds/tests/benchmarks. Decision: ANALYZE36 proceeds to transaction/row_version.rs (1,461 lines), then manifest builder/conflicts/IO. Goal remains active and no completion report is emitted.\n`);
const previous=read('iteration-state.json');
write('iteration-state.json',{iteration:36,phase:'ANALYZE',completed:false,previous_verification:file,totals:v.totals,read_not_analyzed:previous.read_not_analyzed,next:'Completely read transaction/row_version.rs1461 lines in bounded chunks, analyze row/version assignment and operation integration, add exact symbols and update every layer, then VERIFY36. Continue manifest builder, operation/conflict and IO paths; rowids/index.rs1641 lines also pending.',acceptance_gaps:['1959 files pending','294 binary files pending','all five complete self-sufficiency answers fail','full runtime formats, bindings and call graph pending']});
let r=fs.readFileSync(path.join(output,'README.md'),'utf8');r=r.slice(0,r.indexOf('## Current checkpoint'))+`## Current checkpoint

100 of 2,059 files and 40,485 of 1,166,813 inventory text lines are analyzed. Coverage includes all15 protobuf-subsystem files, all48 lance-core files,25 lance-table entries, seven lance-file entries and five other contributor guides. The symbol index contains4,262 records:971 protobuf and3,291 Rust. All294 binary files remain pending.

Thirty-five VERIFY cycles are recorded. VERIFY34 found three stale coverage notes; ANALYZE35 corrected them and clarified one related sentence. VERIFY35 passed20/20 new sampled claims,649 declaration mappings across42 files, and checks of10,206 citations plus6,495 links. Source remains clean and unchanged. Global acceptance still fails:1,959 files and all five complete KB-only answers remain pending. ANALYZE36 continues transaction row-version integration. See [iteration state](iteration-state.json) and [verification log](verification-log.md).

Full local RowIdSequence construction, mutation, selection/cursors, masking, set conversion and rechunking now have complete source analysis. Dataset/transaction IO integration remains pending. Source-derived edge cases and test gaps are documented without claiming reproduction. Source tests and benchmarks were read, not executed.

Analysis records retain superseded drafts for provenance. Follow each file's current analysis_record in MANIFEST and its current L2 document; verification snapshots intentionally retain sampled claims. The source remains read-only and the goal remains active and INCOMPLETE.
`;fs.writeFileSync(path.join(output,'README.md'),r);
console.log({accuracy:'20/20',declarations:649,corrections:4,next:36,totals:v.totals,overall_pass:false});
