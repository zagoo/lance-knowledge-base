import fs from 'node:fs';
import path from 'node:path';
import {root} from './inventory.mjs';
const read=f=>JSON.parse(fs.readFileSync(f)),write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n');
const file='verification/iteration-039.json',v=read(file),audit=read('verification/iteration-039-top-level-audit.json');
if(v.checks.accuracy.manual_pass!==null)throw Error('Already recorded');
const notes=[
'Exact jitter-disabled50/100/200/400ms assertions and attempts1-4 match.',
'Matches u32 parsing fallback, legacy0, clustering parse and JSON-before-blob logical-type branches.',
'Matches range filter and entry.or_insert. Supplemental95-151 confirms sorted fragment IDs, decoding/loading first, and no deletion filter.',
'All Flat field tags/types, uncompressed width comment and Constant TODO match schema.',
'Matches100 Throttled calls and unchanged100 assertion within real10-second window; no timing execution claimed.',
'Both comparison paths, missing/extra policy, last duplicate position and nondecreasing order match. Supplemental datatypes.rs16-29 confirms private module and absent reexport.',
'Matches optional timestamp/base tags8/9 and repeated file10 with unknown-size meaning.',
'Defaults and codec-less memory-only documentation match; type identity is not checked in these default methods.',
'Trait and blanket impl match. Supplemental329-361 confirms pin projection and single take of FnOnce on destruction.',
'Matches cfg(test) imports and all five exact variants.',
'Matches private cache/capacity/unit and Debug entry_count; capacity-zero behavior is explicitly source documentation here.',
'Matches both cache modes. Supplemental312-338 confirms three separate caches and threshold16;17th distinct insertion promotes.',
'Matches empty normalization and three-item Bitmap assertion without threshold minimization.',
'All six exact public system strings match; cross-module identity consequence retained as source deduction.',
'All cursor37, picks, masks, treemap and codec assertions match final fixture. Full file was previously line-read; no tests executed.',
'Matches Unicode character count, empty None, threshold division and separate output lifetime.',
'Matches absent/present data-format branches and schema conversion; explicit format bypasses inference here.',
'Matches base legacy projection, zipped nonnegative column map, exact raw version pairs and cloned schema metadata.',
'Matches architecture-only cfg and both unsafe getauxval feature checks; cross-platform compilation unverified.',
'Matches consumed projection, four metadata flags and project_by_schema TakeSelf before union/subtract; no filtering of metadata roots.'
];
for(const s of v.checks.accuracy.samples){s.manual_review='pass';s.review_note=notes[s.id-1];}
Object.assign(v.checks.accuracy,{manual_pass:true,reviewed_count:20,passed_count:20});
for(const s of v.checks.line_accountability.samples){s.manual_review='pass';s.review_note='Fresh complete declaration-to-authored-range mappings read in bounded VERIFY39 outputs; no mapping reused from earlier iterations.';}
write('verification/iteration-039-no-items.json',audit.filter(a=>!a.items.length).map(a=>({path:a.path,evidence:fs.lstatSync(path.join(root,a.path)).isSymbolicLink()?fs.readlinkSync(path.join(root,a.path)):fs.readFileSync(path.join(root,a.path),'utf8'),notes:a.no_items_notes,manual_review:'pass',review_note:'Exact two-line license header or13-byte symlink target freshly read in VERIFY39.'})));
Object.assign(v.checks.line_accountability,{manual_pass:true,top_level_items_reviewed:562,fresh_files_reviewed:42,same_active_turn_reused_files:0,reused_iterations:[],mapping_evidence:'verification/iteration-039-top-level-audit.json',no_item_evidence:'verification/iteration-039-no-items.json'});
v.checks.self_sufficiency={pass:false,kb_only:true,reviewed_documents:['L4-crosscutting/scenarios.md','L4-crosscutting/cookbook.md','L3-symbols/format-spec.md','L1-modules/rust-lance-table-transactions.md'],answers:{
write_then_compact:'FAIL. Local row-ID construction, rechunking, allocation and lineage stamping are documented, but Dataset::write/compact_files scheduling, memory ownership, file IO, index remapping, atomic publication and cleanup are missing.',
new_scalar_index:'FAIL. Metadata/schema, cache codec, overlay staleness and Bloom helper seams are present. Complete scalar traits, registration/loader dispatch, planner and writer/update integration, binding map and tests remain missing.',
v2_format:'FAIL. Schema envelope and encoding declarations, exact numeric/manifest versions, stable2.2/next2.3 and footer recognizer are present. Complete runtime algorithms/gates, released fixtures and remaining comment/code discrepancies prevent an exact full-format answer.',
python_api:'FAIL. Python module API document does not yet exist; contributor instructions do not supply public signatures, defaults, exceptions or Rust mappings.',
transaction_commit:'FAIL. All16 payloads, constructors, map edits, preparation containers, local row lineage, full in-memory equality and config/metadata-overlap predicates are now documented. Some consumers and durable-protobuf identity are contextual only. Validation, codec, manifest/index application, complete conflict resolver, retry and store publication still prevent a complete operation-extension recipe.'},review_note:'All five answers reconsidered using current KB only. Omitted output in a combined cookbook read was reread completely in a separate bounded call. No source lookup supplied missing scenario steps.'};
v.overall_pass=false;v.reviewed_at=new Date().toISOString();write(file,v);
fs.appendFileSync('verification-log.md',`\n## Iteration 39 — ANALYZE then VERIFY — FAIL (global coverage/self-sufficiency)\n\n- Added complete1,042-line transaction/conflicts.rs analysis:40 contiguous ranges,14 symbols, equality and both public overlap predicates, tests and contextual consumers. All L0-L4 layers updated. [Analysis](analysis/iteration-039-transaction-conflicts.json).\n- [Verification](verification/iteration-039.json), [mapping audit](verification/iteration-039-top-level-audit.json), [no-item evidence](verification/iteration-039-no-items.json); seed ${v.seed}. Full inventory/hash unchanged; final Git clean at c3c8d6fb505fb437b2b673c5195e1d4b74436b2f.\n- Claimed scope PASS:108 files/44,027 lines;4,495 symbols (971 protobuf+3,524 Rust). Line accountability PASS:562 declarations/42 files, all freshly read. Accuracy PASS:20/20 freshly opened claims, supplemental context read, no mismatch. Links PASS:10,935 citations/6,891 links.\n- All five complete KB-only answers FAIL;1,951 files including294 binaries pending. Decision: ANALYZE40 fully reads transaction/validate.rs, then protobuf, manifest assembly/index maintenance and commit IO. Goal remains active and INCOMPLETE; source read-only, no network/builds/tests/benchmarks.\n`);
write('iteration-state.json',{iteration:40,phase:'ANALYZE',completed:false,previous_verification:file,totals:v.totals,read_not_analyzed:read('analysis/iteration-039-contextual-reads.json'),next:'Fully read transaction/validate.rs755 lines; author validation order, errors, skips and test coverage, update L0-L4/symbols, then VERIFY40. Continue proto.rs885,manifest_build.rs5468,index_maintenance.rs1639 and commit IO.',acceptance_gaps:['1951 files pending','294 binary files pending','all five complete self-sufficiency answers fail','full runtime formats, bindings and call graph pending']});
let r=fs.readFileSync('README.md','utf8');r=r.slice(0,r.indexOf('## Current checkpoint'))+`## Current checkpoint

108 of 2,059 files and 44,027 of 1,166,813 inventory text lines are analyzed. Coverage includes all15 protobuf-subsystem files, all48 lance-core files,33 lance-table entries, seven lance-file entries and five other contributor guides. The symbol index contains4,495 records:971 protobuf and3,524 Rust. All294 binary files remain pending.

Thirty-nine VERIFY cycles are recorded. VERIFY39 passed20/20 sampled claims,562 declaration mappings across42 freshly reviewed files, and10,935 citations plus6,891 links. Source remains clean and unchanged. Global acceptance still fails:1,951 files and all five complete KB-only answers remain pending. ANALYZE40 continues operation validation. See [iteration state](iteration-state.json) and [verification log](verification-log.md).

The [transaction supplement](L1-modules/rust-lance-table-transactions.md) covers all16 operation payloads, constructors, map edits, attempt containers, equality and metadata/config-overlap predicates. Local row-ID assignment/version resolution is covered; full validation, conflict resolver, manifest construction and commit IO remain pending. Source tests and benchmarks were read, not executed; derived edge cases are not runtime reproductions.

Analysis records retain superseded drafts for provenance. Follow each file's current analysis_record in MANIFEST and its current L2 document; verification snapshots intentionally retain sampled claims. The source remains read-only and the goal remains active and INCOMPLETE.
`;fs.writeFileSync('README.md',r);
console.log({accuracy:'20/20',declarations:562,references:'pass',next:40,totals:v.totals,overall_pass:false});
