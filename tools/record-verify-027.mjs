import fs from 'node:fs';
import path from 'node:path';
import {root,output} from './inventory.mjs';
const read=f=>fs.readFileSync(path.join(output,f),'utf8');
const write=(f,s)=>fs.writeFileSync(path.join(output,f),s.trimEnd()+'\n');
const file='verification/iteration-027.json',v=JSON.parse(read(file));
if(v.checks.accuracy.manual_pass!==null)throw new Error('Already recorded');
const notes=[
'Matches the 970-byte admission boundary and three 400-byte weighted entries. Supplemental moka.rs26-31 and key.rs86-96 confirm size_of a 16-byte key; TEST_CAPACITY is1000.',
'Matches data-file legacy0.2/LANC constants. Supplemental table format.rs51-55 confirms its distinct0.1 manifest constants.',
'Matches retained layout groups and duplicate detection. Supplemental391-409 and607-629 confirm physical-row destinations, zero-row omission, lookup and group-based is_empty.',
'FAIL: wording says five evaluated successful windows plus a final trigger. The loop records five successes, producing four nonempty-window evaluations; the sixth/final record evaluates the fifth window. Total is five evaluations, not five before the final trigger. Correct chronology in ANALYZE28. Supplemental238-290 confirms evaluation before recording the current outcome.',
'Matches Tensor enum values and dimension/data fields/tags.',
'Matches loongarch Lasx/Lsx/None order and other-architecture None. Supplemental164-206 confirms no environment override in the full initializer.',
'Matches parent-only retention and child-selection trimming in project_by_ids.',
'Matches 256 16KiB insertions, capacity/entry-count assertions and clear. Supplemental528-563 confirms1MiB capacity and prior two entries.',
'Matches test-only OnceLock mutex and poison recovery.',
'Matches runtime alignment formula, debug assertion and invalid-alignment implications.',
'Matches OffsetMapper documentation/state/init and absence of bounds checking in this range.',
'Matches BTreeMap/BTreeSet child estimates and explicit heuristic formula.',
'Matches DataFile serde helper defaults, fresh Arc allocation and no validation.',
'Matches host-dependent x86 sse2 versus non-x86 empty-flag tests.',
'Matches Rust documentation contributor policy; this is a workflow requirement, not execution evidence.',
'Matches power-of-two input matrices and the100-to64 padding result28.',
'Matches two UTF8 list values [a,bc] and [de] producing different hashes; not a proof against all framing collisions.',
'Matches null-adjustment field comment contract, greater-than-item-count requirement and1+num_items preferred value.',
'Matches macOS aarch64 true-return assumption, not runtime feature probing.',
'Matches Arc bitmap deduplication and serialized-size estimate; excludes allocator/capacity/refcount overhead.'
];
for(const s of v.checks.accuracy.samples){s.manual_review=s.id===4?'fail':'pass';s.review_note=notes[s.id-1];}
v.checks.accuracy.manual_pass=false;v.checks.accuracy.reviewed_count=20;v.checks.accuracy.passed_count=19;
const audit=JSON.parse(read('verification/iteration-027-top-level-audit.json'));
for(const s of v.checks.line_accountability.samples){const a=audit.find(a=>a.path===s.path);s.manual_review='pass';s.review_note=a.items.length?'All lexical declaration-to-authored-range mappings freshly reviewed in this active turn.':'No lexical declarations; full raw license/corpus/symlink target read this turn.';}
v.checks.line_accountability.manual_pass=true;v.checks.line_accountability.top_level_items_reviewed=482;v.checks.line_accountability.mapping_evidence='verification/iteration-027-top-level-audit.json';v.checks.line_accountability.fresh_files_reviewed=42;
const corpus=fs.readFileSync(path.join(root,'rust/lance-core/proptest-regressions/utils/mask.txt'),'utf8');
const right=corpus.match(/right_rows = \[([^\]]*)\]/)[1].split(',').map(s=>BigInt(s.trim()));
const left=BigInt(corpus.match(/left_rows = \[(\d+)\]/)[1]);
const corpusCheck={path:'rust/lance-core/proptest-regressions/utils/mask.txt',right_rows:right.length,left_fragment:String(left>>32n),same_fragment_right_rows:right.filter(n=>(n>>32n)===(left>>32n)).map(String),seeds:corpus.split('\n').filter(s=>s.startsWith('cc ')).length};
if(right.length!==344||corpusCheck.seeds!==2)throw new Error('Unexpected corpus');
write('verification/iteration-027-corpus-check.json',JSON.stringify(corpusCheck,null,2));
v.checks.line_accountability.corpus_evidence='verification/iteration-027-corpus-check.json';
v.checks.self_sufficiency={pass:false,review_note:'Five questions attempted using current KB. Exact version mapping and local staleness are now known; no source was used to supply missing end-to-end answers.',answers:{
write_then_compact:'FAIL. KB supplies core schema/remapping, manifest ownership/offsets, metadata file versions, overlay freshness and index coverage. Dataset::write scheduling, complete file output, compaction orchestration/remap, atomic publication, cleanup and memory lifetime remain absent.',
new_scalar_index:'FAIL. KB supplies protobuf envelopes, Bloom/key filters, keyed/covering metadata, cache contracts and overlay stale-fragment/row accumulation. ScalarIndex traits, implementations, registration/factory, planner, persistence/update/remap, null integration tests and bindings remain absent.',
v2_format:'FAIL. KB now gives exact caller selectors versus concrete identity, strict manifest strings, numeric metadata/standard/embedded-footer mappings, accepted aliases and eight-byte recognizer. It still lacks encoding/decoding byte algorithms, full reader/writer dispatch/capability gates and released historical fixtures.',
python_api:'FAIL. Contributor policy is covered; public Python API signatures, PyO3 export/argument conversions and exhaustive Rust mappings remain unanalyzed.',
transaction_commit:'FAIL. KB supplies protobuf/wrapper operation metadata, core conflict errors, local key extraction/overlap and overlay metadata/staleness rules. Builder enforcement, operation-pair conflict matrix, retry/rebase, atomic protocol and unknown-outcome recovery remain unanalyzed.'
},documents_used:['L0-orientation.md','L1-modules/rust-lance-table.md','L1-modules/rust-lance-file.md','L3-symbols/behavior-contracts.md','L3-symbols/format-spec.md','L4-crosscutting/scenarios.md','L4-crosscutting/cookbook.md']};
v.overall_pass=false;v.reviewed_at=new Date().toISOString();write(file,JSON.stringify(v,null,2));
fs.appendFileSync(path.join(output,'verification-log.md'),`\n## Iteration 27 — ANALYZE then VERIFY — FAIL (one accuracy finding, global coverage and self-sufficiency)\n\n- Added eight files /1,046 lines: file version.rs/lib.rs/format.rs/build.rs/Cargo.toml/README.md/protos and table overlay/staleness.rs. Refreshed three already-analyzed metadata files. Added96 Rust symbols, exact callable tables and L0–L4 version/staleness contracts.\n- [Verification](verification/iteration-027.json), [top-level audit](verification/iteration-027-top-level-audit.json), [corpus counts](verification/iteration-027-corpus-check.json); seed ${v.seed}. Inventory and hashes unchanged; checkout clean.\n- Claimed-scope structure PASS:93 files /33,451 lines;3,822 symbols (971 protobuf,2,851 Rust). All482 lexical candidates across42 sampled files were freshly reviewed in this active turn; declaration-free sources were read in full.\n- Accuracy FAIL:19/20 claims pass. AIMD no-ceiling fixture annotation ambiguously overcounts evaluations: five loop records plus a final record evaluate five windows total. Correct this wording before another verification. Other sampled claims match, with supplemental checks of key size, table footer constants, remap destination filtering, CPU initialization and cache capacity.\n- Cross-links PASS:8,685 citations and5,546 links. All five complete KB-only questions still fail. Repository coverage remains incomplete:1,966 pending files including294 binary. No source edits, network, builds, tests or benchmarks.\n- Decision: ANALYZE28 corrects the AIMD chronology and derived symbol text, then runs a new randomized verification. Goal remains active; no completion report.\n`);
write('iteration-state.json',JSON.stringify({iteration:28,phase:'ANALYZE',completed:false,previous_verification:file,totals:v.totals,read_not_analyzed:[{path:'rust/lance-table/src/utils/stream.rs',note:'Prior truncated read; reread all1887 lines before analysis.'}],next:'Correct AIMD annotation516-545 and derived symbol behavior, then VERIFY28. Continue row-ID/version/sequence and transaction/IO analysis afterward.',acceptance_gaps:['1966 files pending','294 binary files pending','AIMD chronology correction required','all five self-sufficiency answers fail']},null,2));
let r=read('README.md');r=r.slice(0,r.indexOf('## Current checkpoint'))+`## Current checkpoint

93 of 2,059 files and 33,451 of 1,166,813 inventory text lines are analyzed. Coverage includes all 15 protobuf-subsystem files, all 48 lance-core files, 18 lance-table entries, seven lance-file entries and five other contributor guides. The symbol index contains 3,822 records: 971 protobuf and 2,851 Rust. All 294 binary files remain pending.

Twenty-seven VERIFY cycles are recorded. VERIFY27 checked 482 top-level candidates across 42 freshly reviewed files and validated 8,685 citations plus 5,546 links. Accuracy is 19/20: an AIMD test annotation needs a chronology correction. Source remains clean and unchanged. Global acceptance still fails: 1,966 files and all five complete self-sufficiency answers remain pending. ANALYZE28 corrects the finding before fresh verification. See [iteration state](iteration-state.json) and [verification log](verification-log.md).

Analysis records retain superseded drafts for provenance. Follow each file's current analysis_record in MANIFEST and its current L2 document; verification snapshots intentionally retain sampled claims. Source tests and benchmarks were read, not executed.
`;write('README.md',r);console.log({claims:'19/20',top_items:482,next:28,corpusCheck});
