import fs from 'node:fs';import path from 'node:path';import {root}from './inventory.mjs';
const read=f=>JSON.parse(fs.readFileSync(f)),write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n');
const file='verification/iteration-038.json',v=read(file),audit=read('verification/iteration-038-top-level-audit.json');if(v.checks.accuracy.manual_pass!==null)throw Error('Already recorded');
const notes=[
'Matches compression tags4/5/6/8 and hints9; ignored unknown hints are schema guidance, not runtime enforcement proof.',
'Matches detached bit test and N+1 prefix algorithm including unknown count zero and unchecked usize sum.',
'Matches three separate Column marker fixtures, default inline row IDs and both spilled-flag assertions; no column reader executed.',
'Matches historical diagram and UUID byte16 comment without schema-side validation.',
'Matches trait bounds, defaults, blob guard and cast-based set lookup; no storage-read behavior claimed.',
'Matches unchecked four-value constructor. Contextual producer474-522 was fully read in ANALYZE37 and supports stated gate/withdraw ordering.',
'Freshly reread exact prefix formulas and constant-time vector access; constructor invariants remain necessary.',
'Matches source creation5 fixture. Supplemental1025-1049 confirms destination10/999 and both resulting arrays5; fixture/build version distinction preserved in KB.',
'Matches exact runtime builder settings, one worker, blocking limit, maximum keepalive and build unwrap.',
'Matches child-first recursive search, no self.id check and three distinct method visibilities.',
'Matches encode-before-size-check, two writes and pos update after success. Partial-write caveat follows sequence; no flush/rollback.',
'Matches conversion and ordering. Supplemental fragment.rs346-424 confirms mutable interning before later fallible fields and no carrier/DataFile validation.',
'Matches four track_caller constructors; supplemental Error derive157-159 is Debug/Snafu, and no Clone implementation found.',
'Matches three five-value arrays, reverse comparison and alternating-end assertions; exhaustion after loop not checked.',
'Matches ten private modules and cfg(test) pub(crate) test_support; no execution order inferred.',
'Matches raw fields, casts and normalization. Full-file fragment_tree search confirms only encoder None and no stored Rust representation.',
'Matches four malformed holes cases plus absent array. Supplemental serde.rs453-469 confirms decoding and CorruptFile/message assertions.',
'Matches bool defaults and BlobVersion V1 default; supplemental field.rs72-81 confirms Strict nullability default.',
'Matches base clone and repeated clone/join; no IO or local tests in complete18-line file.',
'Matches table order/footer widths and40-byte arithmetic. Supplemental file2.proto44-57 explains asterisk alignment and little-endian footer; no reader constant claimed.'
];
for(const s of v.checks.accuracy.samples){s.manual_review='pass';s.review_note=notes[s.id-1];}Object.assign(v.checks.accuracy,{manual_pass:true,reviewed_count:20,passed_count:20});
for(const s of v.checks.line_accountability.samples){const a=audit.find(a=>a.path===s.path);s.manual_review='pass';s.review_note=a.unchanged_from_current_turn_review?'Unchanged mappings reused only from VERIFY36/37 manually reviewed in the same continuous work sequence before VERIFY38.':'Fresh complete declaration mappings read in bounded VERIFY38 outputs.';}
write('verification/iteration-038-no-items.json',audit.filter(a=>!a.items.length).map(a=>({path:a.path,evidence:fs.lstatSync(path.join(root,a.path)).isSymbolicLink()?fs.readlinkSync(path.join(root,a.path)):fs.readFileSync(path.join(root,a.path),'utf8'),notes:a.no_items_notes,manual_review:'pass',review_note:a.unchanged_from_current_turn_review?'Unchanged exact symlink evidence already reviewed in continuous work sequence.':'All12 seed-corpus lines freshly read, including six exact seed records.'})));
Object.assign(v.checks.line_accountability,{manual_pass:true,top_level_items_reviewed:515,fresh_files_reviewed:12,same_active_turn_reused_files:30,reused_iterations:[36,37],mapping_evidence:'verification/iteration-038-top-level-audit.json',no_item_evidence:'verification/iteration-038-no-items.json'});
v.checks.reference_repairs={pass:true,evidence:'analysis/iteration-038-heading-corrections.json',corrected_headings:16,review_note:'All16 final full-path headings read; complete reference scan passes. Generator also corrected; coverage unchanged.'};
v.checks.self_sufficiency=read('verification/iteration-037.json').checks.self_sufficiency;v.checks.self_sufficiency.review_note='All five answers reconsidered from corrected API supplement and current scenario/cookbook gaps. Reference repair adds no missing runtime behavior; all five remain FAIL. No source lookup fills missing scenario steps.';
v.overall_pass=false;v.reviewed_at=new Date().toISOString();write(file,v);
fs.appendFileSync('verification-log.md',`\n## Iteration 38 — ANALYZE then VERIFY — FAIL (global coverage/self-sufficiency)\n\n- Corrected16 abbreviated API-supplement heading paths and clarified excerpt description; fixed its generator. No new source coverage. [Corrections](analysis/iteration-038-heading-corrections.json).\n- [Verification](verification/iteration-038.json), [mapping audit](verification/iteration-038-top-level-audit.json), [no-item evidence](verification/iteration-038-no-items.json); seed ${v.seed}. Full inventory/hash unchanged; final Git clean at c3c8d6fb505fb437b2b673c5195e1d4b74436b2f.\n- Claimed scope PASS:107 files/42,985 lines;4,481 symbols (971 protobuf+3,510 Rust). Line accountability PASS:515 declarations/42 files,12 fresh and30 unchanged mappings from VERIFY36/37 reviewed in the same continuous work sequence. Accuracy PASS:20/20 freshly opened claims; no mismatch. Links PASS:10,813 citations/6,856 links. All16 repairs confirmed.\n- All five complete KB-only answers FAIL;1,952 files including294 binaries pending. Decision: ANALYZE39 fully reads transaction/conflicts.rs, then validation/proto/manifest assembly and commit IO. Goal remains active and INCOMPLETE; source read-only, no network/builds/tests/benchmarks.\n`);
write('iteration-state.json',{iteration:39,phase:'ANALYZE',completed:false,previous_verification:file,totals:v.totals,read_not_analyzed:read('analysis/iteration-037-contextual-reads.json'),next:'Fully read transaction/conflicts.rs1042 lines, author equality and metadata-conflict predicates/tests with exact callers, update L0-L4 and symbols, then VERIFY39. Continue validate.rs755,proto.rs885,manifest_build.rs5468,index_maintenance.rs1639 and commit IO.',acceptance_gaps:['1952 files pending','294 binary files pending','all five complete self-sufficiency answers fail','full runtime formats, bindings and call graph pending']});
let r=fs.readFileSync('README.md','utf8');r=r.slice(0,r.indexOf('## Current checkpoint'))+`## Current checkpoint

107 of 2,059 files and 42,985 of 1,166,813 inventory text lines are analyzed. Coverage includes all15 protobuf-subsystem files, all48 lance-core files,32 lance-table entries, seven lance-file entries and five other contributor guides. The symbol index contains4,481 records:971 protobuf and3,510 Rust. All294 binary files remain pending.

Thirty-eight VERIFY cycles are recorded. VERIFY37 found16 abbreviated heading citations; ANALYZE38 corrected them. VERIFY38 passed20/20 sampled claims,515 declaration mappings across42 files, and10,813 citations plus6,856 links. Source remains clean and unchanged. Global acceptance still fails:1,952 files and all five complete KB-only answers remain pending. ANALYZE39 continues operation equality and conflict-related metadata checks. See [iteration state](iteration-state.json) and [verification log](verification-log.md).

The [transaction supplement](L1-modules/rust-lance-table-transactions.md) now includes all16 operation payloads, constructors, map edits and attempt containers. Local row-ID sequence/assignment/version resolution is covered; full validation/conflict/manifest/commit IO remains pending. Source tests and benchmarks were read, not executed, and derived edge cases are not runtime reproductions.

Analysis records retain superseded drafts for provenance. Follow each file's current analysis_record in MANIFEST and its current L2 document; verification snapshots intentionally retain sampled claims. The source remains read-only and the goal remains active and INCOMPLETE.
`;fs.writeFileSync('README.md',r);
console.log({accuracy:'20/20',declarations:515,references:'pass',next:39,totals:v.totals,overall_pass:false});
