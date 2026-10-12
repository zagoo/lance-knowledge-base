import fs from 'node:fs';import path from 'node:path';import {root}from './inventory.mjs';
const read=f=>JSON.parse(fs.readFileSync(f)),write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n');
const file='verification/iteration-037.json',v=read(file),audit=read('verification/iteration-037-top-level-audit.json');if(v.checks.accuracy.manual_pass!==null)throw Error('Already recorded');
const notes=[
'Matches reference framing, literal LE bytes and16-byte hash comparison. Supplemental key.rs28-41 confirms U32 tag3.',
'Matches tag/name reservations; supplemental clustering-key declaration remains a bool with future-use comment.',
'Matches sparse ordered/unordered arrays, empty range and absent values. No malformed representation in sampled fixtures.',
'Matches exact constant-time vector accesses and prefix formulas; private indices rely on constructor invariants.',
'Matches seven unconditional serialized fields and Arc slice projection; errors propagate with question marks.',
'Matches both1048576-capacity assertions and registry path construction. Supplemental registry.rs210-216 confirms global shared serialization mutex.',
'Matches both constructors; complete builder file read this turn confirms lazy UUID generation/defaults and no commit/test/async code.',
'Matches cache_keys harness=false and inherited lints, no profile/runtime settings in range.',
'Matches three named harness=false targets. Full crate declaration audit separately retains fourth version_columns target.',
'Matches replacement-on-success loop. Supplemental manifest_build.rs73-123 confirms opt-in/current-byte identity handling and serde.rs232-255 expands Ranges to ordinary ranges.',
'Matches five index-envelope tags and vector-only oneof; no generic Any registry defined here.',
'Matches generic hasher parameter, capacity estimate and live child sum; no claim of exact layout/allocator measurement.',
'Matches eight integer key cases, nested struct/list recursion, no-op fallback and panic assumptions.',
'Matches corrupt creation fixture and exact[1]/[5] outcomes; source row-ID bytes remain valid.',
'Matches every config field and data-only docs. Full-file search confirms no Default implementation; runtime enforcement remains unclaimed.',
'Matches deterministic64-draw unitMAX regression and high-slot assertion; no execution claimed.',
'Matches direct tri-state update. Supplemental compact implementation738-764 confirms step-major mutation and no output-vector allocation.',
'Matches cardinality check and return. Supplemental complete constructor391-453 confirms old-ID checks, leftover rejection and no destination-uniqueness check.',
'Matches three-fragment config extension/removal assertions. Supplemental config_mut327-329 simply returns map borrow.',
'Matches exact variant payloads and Display templates; VersionConflict numbers are retained but not interpolated.'
];
for(const s of v.checks.accuracy.samples){s.manual_review='pass';s.review_note=notes[s.id-1];}Object.assign(v.checks.accuracy,{manual_pass:true,reviewed_count:20,passed_count:20});
for(const s of v.checks.line_accountability.samples){const a=audit.find(a=>a.path===s.path);s.manual_review='pass';s.review_note=a.unchanged_from_current_turn_review?'Unchanged mappings reused only from VERIFY36 manually reviewed earlier in this same active turn.':'Fresh mappings read in bounded VERIFY37 outputs; truncated initial mappings reread.';}
write('verification/iteration-037-no-items.json',audit.filter(a=>!a.items.length).map(a=>({path:a.path,evidence:fs.readlinkSync(path.join(root,a.path)),notes:a.no_items_notes,manual_review:'pass',review_note:'Unchanged exact symlink evidence reviewed earlier in same active turn.'})));
Object.assign(v.checks.line_accountability,{manual_pass:true,top_level_items_reviewed:552,fresh_files_reviewed:17,same_active_turn_reused_files:25,reused_iteration:36,mapping_evidence:'verification/iteration-037-top-level-audit.json',no_item_evidence:'verification/iteration-037-no-items.json'});
v.checks.self_sufficiency=read('verification/iteration-036.json').checks.self_sufficiency;
v.checks.self_sufficiency.reviewed_documents.push('L1-modules/rust-lance-table-transactions.md');v.checks.self_sufficiency.answers.transaction_commit='FAIL. All16 operation payloads, constructor behavior, map edits, attempt containers and local row-lineage helpers are now documented. Contextual snippets show prepare gate/clone/withdraw and prepared version check/repeated gate. Full pairwise conflicts, validation, protobuf persistence, manifest assembly and commit publication/retries still prevent a complete new-operation recipe.';v.checks.self_sufficiency.review_note='Freshly reconsidered all five KB-only answers after definition-side supplement/scenario/cookbook updates. Other four gaps remain unchanged. No source fills missing end-to-end steps.';
v.overall_pass=false;v.reviewed_at=new Date().toISOString();write(file,v);
fs.appendFileSync('verification-log.md',`\n## Iteration 37 — ANALYZE then VERIFY — FAIL (references and global gaps)\n\n- Fully read six files/1,039 lines; authored62 contiguous ranges, added185 Rust symbols, updated every layer and exact transaction API supplement. [Analysis](analysis/iteration-037-transaction-definitions.json).\n- [Verification](verification/iteration-037.json), [mapping audit](verification/iteration-037-top-level-audit.json), [no-item evidence](verification/iteration-037-no-items.json); seed ${v.seed}. Inventory/hash unchanged; final Git clean at c3c8d6fb505fb437b2b673c5195e1d4b74436b2f. Claimed107 files/42,985 lines,4,481 symbols.\n- Line accountability PASS:552 declarations/42 files,17 fresh and25 unchanged same-active-turn VERIFY36 mappings. Accuracy PASS:20/20 live source checks with supplemental dependencies. Cross-links FAIL:16 abbreviated heading citations in new supplement, among10,813 citations/6,852 links. All actual linked excerpts use full paths; headings must also use full paths.\n- All five complete KB-only answers FAIL;1,952 files including294 binaries pending. Decision: ANALYZE38 corrects the16 heading paths, then VERIFY38. Source stays read-only; no network or source tools/tests executed.\n`);
write('iteration-state.json',{iteration:38,phase:'ANALYZE',completed:false,previous_verification:file,totals:v.totals,read_not_analyzed:read('analysis/iteration-037-contextual-reads.json'),next:'Correct16 abbreviated supplement heading references, then VERIFY38. Next source slice: full transaction/conflicts.rs,validate.rs,proto.rs and manifest_build.rs.',acceptance_gaps:['16 heading references','1952 files pending','294 binaries pending','all five complete self-sufficiency answers fail']});
console.log({accuracy:'20/20',line_accountability:'552/42',reference_failures:16,next:38});
