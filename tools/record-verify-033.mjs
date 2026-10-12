import fs from 'node:fs';
import path from 'node:path';
import {output,root} from './inventory.mjs';
const read=f=>JSON.parse(fs.readFileSync(path.join(output,f),'utf8'));
const write=(f,v)=>fs.writeFileSync(path.join(output,f),JSON.stringify(v,null,2)+'\n');
const file='verification/iteration-033.json',v=read(file);
if(v.checks.accuracy.manual_pass!==null)throw Error('Already recorded');
const notes=[
'Matches gated unsafe environment assignment. Supplemental build.rs15-29 confirms no other explicit compiler override and prost-build delegation.',
'Matches all column tags and length contract. Supplemental file2.proto147-197 and encodings_v2_0.proto36-57 confirms page/column buffer-index scopes; both offset arrays ultimately contain file offsets.',
'Matches public generated module, allowances and include path. Inventory contains no generated lance.file.v2.rs source entry.',
'Matches page-wide table, two tags, variable-width input/output and transparent contract; no algorithm supplied.',
'Matches fields/derives/schema identity. Supplemental cache/mod.rs128-138,175-182 confirms both default bridges use LEGACY_TEXT and one write_str.',
'Matches conflict variants, version presence and implicit diagnostic fields; declarations contain no retry policy.',
'Matches all four workspace-inherited dev dependencies without asserting execution.',
'Matches both public fields, derives and documented relative path without validation.',
'Matches owned inputs, collected chunk-size vector, flattened Peekable and contextual error closures.',
'Matches deprecated fields and five RewrittenIndex fields; UUID-only comment is indeed stale.',
'Matches slice behavior. Supplemental segment.rs196-243,293-299 confirms copied constructor Vec and all selection arms excluding Ranges.',
'Matches adjacent strict-descending check and first-pair diagnostic; empty/equal cases pass by loop semantics.',
'Matches default async store.open/delegation, Arc reader and Self:Sized bounds; no local caching algorithm.',
'Matches XOR fold, wrapping constants and replacing integer writes. Generic map retains equality checks despite collisions.',
'Matches every emitted field, repeated empty normalization, cloned Any and signed-to-u64 timestamp cast; no validation here.',
'Matches all thirteen union tags. Supplemental encodings_v2_0.proto307-332 confirms different older union mapping/types.',
'Matches environment names. Supplemental feature_flags.rs233-251 confirms presence checks and debug predicate.',
'Matches clamp/range check. Supplemental sbbf.rs214-268 confirms5/27 limits and copy into block vector; requested FPP is not rechecked after clamping.',
'Matches recursive typed-source traversal without IO-kind/text recognition or cycle/depth guard; earlier same-turn is_not_found review confirms deliberate negative cases.',
'Matches retained temporary directory/fixed nonexistent leaf. Supplemental tempfile.rs40-65 confirms directory creation and Windows slash normalization.'
];
for(const s of v.checks.accuracy.samples){s.manual_review='pass';s.review_note=notes[s.id-1];}
Object.assign(v.checks.accuracy,{manual_pass:true,reviewed_count:20,passed_count:20});
const audit=read('verification/iteration-033-top-level-audit.json');
for(const s of v.checks.line_accountability.samples){const a=audit.find(a=>a.path===s.path);s.manual_review='pass';s.review_note=a.unchanged_from_current_turn_review?'Unchanged authored mappings reused only from VERIFY32 reviewed earlier in this same active turn.':'Fresh declaration-to-authored-range mappings read during VERIFY33.';}
write('verification/iteration-033-no-items.json',audit.filter(a=>!a.items.length).map(a=>({path:a.path,notes:a.no_items_notes,evidence:fs.lstatSync(path.join(root,a.path)).isSymbolicLink()?fs.readlinkSync(path.join(root,a.path)):fs.readFileSync(path.join(root,a.path),'utf8'),manual_review:'pass',review_note:a.unchanged_from_current_turn_review?'Exact no-item evidence already read in VERIFY32 this same active turn.':'Exact symlink target freshly read in VERIFY33.'})));
Object.assign(v.checks.line_accountability,{manual_pass:true,top_level_items_reviewed:630,mapping_evidence:'verification/iteration-033-top-level-audit.json',fresh_files_reviewed:18,same_active_turn_reused_files:24,reused_iteration:32,no_item_evidence:'verification/iteration-033-no-items.json'});
v.checks.layer_consistency={pass:true,scope:'Six specific status corrections in ANALYZE33, not an exhaustive cross-layer semantic proof.',evidence:'analysis/iteration-033-layer-corrections.json',review_note:'Reread all six corrected paragraphs. Exact file-version parsing is distinguished from pending reader/writer dispatch; completed core validation, row-ID codec, merge-insert extraction and backend/allocation source analysis are distinguished from missing consumers or unperformed execution. Both VERIFY32 findings resolved.'};
v.checks.self_sufficiency=read('verification/iteration-032.json').checks.self_sufficiency;
v.checks.self_sufficiency.answers.v2_format='FAIL. KB specifies schema envelope order and derived40-byte footer, selectors Stable2.2/Next2.3, exact identity mappings and eight-byte footer recognition (file2.proto11-115; version.rs19-262; lib.rs25-60). It records schema gates for2.2 large chunks/constants/packed structs and2.3 sparse layout, plus implemented table flags. Full encoder/reader algorithms, exhaustive runtime gates, historical fixtures and list-null equality discrepancy remain unresolved. ANALYZE33 repaired the two stale status statements; it added no missing runtime evidence.';
v.checks.self_sufficiency.review_note='All five answers reconsidered from the KB after rereading the six status corrections. Write/compact, scalar-index, Python and transaction gaps from VERIFY32 are unchanged. The v2 answer now consistently distinguishes complete exact-version mappings from incomplete full format implementation. No source was used to fill missing scenario steps.';
v.overall_pass=false;v.reviewed_at=new Date().toISOString();write(file,v);
fs.appendFileSync(path.join(output,'verification-log.md'),`\n## Iteration 33 — ANALYZE then VERIFY — FAIL (global coverage/self-sufficiency)\n\n- Corrected two stale exact-version status statements found by VERIFY32 and four related status ambiguities in L1/L4. No new coverage claimed and no L2 source behavior changed. [Correction record](analysis/iteration-033-layer-corrections.json).\n- [Verification](verification/iteration-033.json), [top-level audit](verification/iteration-033-top-level-audit.json), [no-item evidence](verification/iteration-033-no-items.json); seed ${v.seed}. Full scan/hash unchanged and Git clean at c3c8d6fb505fb437b2b673c5195e1d4b74436b2f.\n- Claimed-scope PASS:99 files/38,176 lines;4,147 symbols (971 protobuf+3,176 Rust). Line accountability PASS:630 candidates across42 files,18 fresh and24 unchanged mappings reused only from VERIFY32 in this same active turn. Accuracy PASS:20/20 new random claims with contextual checks. Cross-links PASS:9,777 citations and6,252 links. All six status corrections reread and verified.\n- All five complete KB-only answers still FAIL;1,960 files including294 binaries remain pending. No source edits, network, builds/tests/benchmarks. Decision: ANALYZE34 reads full rowids.rs, then transaction row-version/manifest/conflict/IO consumers. Goal remains active and no completion report is emitted.\n`);
write('iteration-state.json',{iteration:34,phase:'ANALYZE',completed:false,previous_verification:file,totals:v.totals,read_not_analyzed:[{path:'rust/lance-table/src/utils/stream.rs',note:'Prior truncated read; reread all1887 lines before complete analysis.'},{path:'rust/lance-table/src/rowids.rs',read_ranges:[[1,44]],note:'Only module routing and opening contract are established; all2309 lines require complete analysis. Prior lexical consumer lookups do not establish complete read coverage.'}],next:'Read all rowids.rs2309 lines in bounded chunks; resolve full RowIdSequence construction/concatenation/mask/selection, cursor reset and opt-in, rechunking and IO boundaries. Update all layers before VERIFY34. Then transaction/row_version.rs1461, manifest builder/conflicts/IO.',acceptance_gaps:['1960 files pending','294 binary files pending','all five complete self-sufficiency answers fail','full runtime formats, bindings and call graph pending']});
let r=fs.readFileSync(path.join(output,'README.md'),'utf8');r=r.slice(0,r.indexOf('## Current checkpoint'))+`## Current checkpoint

99 of 2,059 files and 38,176 of 1,166,813 inventory text lines are analyzed. Coverage includes all15 protobuf-subsystem files, all48 lance-core files,24 lance-table entries, seven lance-file entries and five other contributor guides. The symbol index contains4,147 records:971 protobuf and3,176 Rust. All294 binary files remain pending.

Thirty-three VERIFY cycles are recorded. VERIFY32 found two stale cross-layer status statements; ANALYZE33 corrected those and four related ambiguities. VERIFY33 passed20/20 new sampled claims,630 declaration mappings across42 files, and checks of9,777 citations plus6,252 links. Source remains clean and unchanged. Global acceptance still fails:1,960 files and all five complete self-sufficiency answers remain pending. ANALYZE34 continues full RowIdSequence operations and integration. See [iteration state](iteration-state.json) and [verification log](verification-log.md).

Segment construction, representation selection, mutation and bitmap cursors now have complete local source analysis. Full RowIdSequence and dataset/transaction integration remain pending. The row-ID schema bitmap comment says MSB-first, while current implementation and byte-exact test use LSB-first; [format reconstruction](L3-symbols/format-spec.md) preserves the discrepancy. Historical compatibility remains unverified. (protos/rowids.proto:51-58; rust/lance-table/src/rowids/bitmap.rs:67-77; rust/lance-table/src/rowids/serde.rs:436-451)

Analysis records retain superseded drafts for provenance. Follow each file's current analysis_record in MANIFEST and its current L2 document; verification snapshots intentionally retain sampled claims. Source tests and benchmarks were read, not executed.
`;fs.writeFileSync(path.join(output,'README.md'),r);
console.log({accuracy:'20/20',top_items:630,status_corrections:'6 verified',next:34,totals:v.totals,overall_pass:false});
