import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const path='verification/iteration-051.json', v=read(path);
if(v.checks.accuracy.manual_pass!==null)throw Error('Already recorded');
const notes=[
 'Strictly newer probed entries become a collected vector of scheme-derived locations with size, ETag and identity None; this range does not read bytes.',
 'Direct protobuf construction matches. Fresh builder construction confirms the item count field is expected-capacity configuration rather than its independently initialized observed item_count.',
 'All five assertion dimensions match. Fresh test-name inspection confirms exactly two local tests; the reverse transaction conversion and listed malformed cases are not asserted here.',
 'Bytes [1,2,3], Error::Index and the exact indexed version/group substring match. The assertion checks contains, not equality of the entire rendered error.',
 'All matching files replace only path, size and base; coverage union and fallible new-file version check follow the loop. No byte read occurs.',
 'The canonical-path fixture supplies HEAD size plus one and asserts CorruptFile with the named mismatch text, preserving the known-size invariant.',
 'Naming and boundary validation requirements match the supplied repository guide exactly.',
 'None/Inline/Column map to the documented optional oneof shapes with copied bytes and no fallible branch.',
 'The iterator sums key footprint and callback-or-record size with shared mutable Context. No maintenance await or explicit whole-cache lock appears; dependency consistency remains unclaimed.',
 'Each enum maps to its canonical constant. Fresh strict decoder read confirms all exact identities roundtrip and selector aliases are rejected.',
 'Formula, rounding, clamp and 65536-byte constant match. Fresh MIN_SHARD_SHARE/doc read confirms the four-GiB budget statement and its small-capacity exception.',
 'The cfg(test) constructor builds sidecars/tree without the heuristic and always returns Ok if it returns; allocation/other helper panics are not asserted impossible. Fixture encodings and empty deletions match.',
 'The direct fallback test uses five singleton runs and indices [4,1,3], expecting [14,11,13], with all other system/deletion modes disabled.',
 'All five rejection checks match. Fresh check_label read confirms InvalidInput despite the nearby data-corruption wording.',
 'Both range adapters preallocate to requested length. Fresh cursor implementations confirm EOF clipping, backward rewind and lazy filter_map behavior; the returned iterator retains its borrows until dropped.',
 'Per-version compact layout construction, Index wrapping and ordered chaining match. Fresh constructors confirm empty groups/chains succeed and old-ID uniqueness is local, without global graph sorting.',
 'The borrowed private fields match. Fresh slice factory and entire BitmapSlice impl confirm there is no alternate exposed constructor in this file.',
 'Ten thousand physical rows across ten fragments, every-third deletion and every listed boundary/survivor assertion match. No timing assertion is present.',
 'The constructor borrows the linked blocks, starts inner_iter at None and copies the list count; ordinary mutable borrowing is excluded while this shared borrow lives.',
 'UInt32 downcast, set allocation/dedup, null rejection and direct Set return match. Fresh preceding exact schema and single-batch checks support the unwrap; no row-count bounds are enforced here.'
];
for(const s of v.checks.accuracy.samples){s.manual_review='pass';s.initial_review='pass';s.review_note=notes[s.id-1];}
Object.assign(v.checks.accuracy,{manual_pass:true,reviewed_count:20,initial_passed_count:20,initial_mismatch_count:0,corrected_count:0,passed_count:20,supplemental_evidence:[
 'rust/lance-table/src/format/key_existence.rs:67-86',
 'rust/lance-table/src/transaction/proto.rs:814-885',
 'rust/lance-file/src/version.rs:172-197',
 'rust/lance-core/src/cache/quick.rs:61-88',
 'rust/lance-core/src/utils/stable_partition.rs:306-314',
 'rust/lance-table/src/rowids.rs:60-169',
 'rust/lance-core/src/utils/row_addr_remap.rs:72-105',
 'rust/lance-core/src/utils/row_addr_remap.rs:390-471',
 'rust/lance-core/src/utils/row_addr_remap.rs:583-603',
 'rust/lance-core/src/utils/row_addr_remap.rs:726-735',
 'rust/lance-table/src/rowids/bitmap.rs:83-89',
 'rust/lance-table/src/rowids/bitmap.rs:126-167',
 'rust/lance-table/src/io/deletion.rs:156-183'
]});
const audit=read('verification/iteration-051-top-level-audit.json');
for(const s of v.checks.line_accountability.samples){
 const a=audit.find(a=>a.path===s.path);if(!a||a.unchanged_from_current_turn_review)throw Error('Expected fresh audit');
 s.manual_review='pass';s.review_note='Fresh declaration-to-authored-range review in bounded outputs for this goal turn; no prior-turn review reused. Full contiguous ranges and exact numbered source checked structurally. PreparedIndices coverage/cross-reference wording was refreshed and its affected mapping rechecked.';
}
Object.assign(v.checks.line_accountability,{manual_pass:true,top_level_items_reviewed:695,fresh_files_reviewed:42,same_active_turn_reused_files:0,mapping_evidence:'verification/iteration-051-top-level-audit.json',initial_mapping_evidence:'verification/iteration-051-top-level-audit-initial.json',no_item_evidence:'verification/iteration-051-no-items.json'});
const noItems=read('verification/iteration-051-no-items.json');for(const item of noItems)item.review='pass';write('verification/iteration-051-no-items.json',noItems);
v.checks.status_refresh={pass:true,count:10,evidence:'analysis/iteration-051-status-refresh.json'};
v.checks.corrections=[{count:4,evidence:'analysis/iteration-051-verify-corrections.json',accuracy_count:0,coverage_and_reference_note_count:4,note:'Refreshed PreparedIndices constructor/consumer notes and local-versus-Dataset coverage boundaries, including fully qualified source citations and symbol caller text.'}];
v.checks.cross_links_initial=v.checks.cross_links;
v.checks.self_sufficiency={pass:false,answers:{
 write_then_compact:'FAIL. Table candidate assembly, metadata publication, stable-ID lookup and scheduled-batch alignment/system-column/deletion wrapping are covered. Payload futures retain shared batch slices; pulled tasks eagerly prepare ID/version arrays before payload completion. Full Dataset::write/compact_files scheduling, data writers, cache lifecycle, index remapping, recovery and cleanup remain absent, so a complete disk/memory trace still requires source.',
 new_scalar_index:'FAIL. Metadata, table admission/maintenance, local ID lookup and output stream contracts are covered. Complete scalar traits, registry/loader, planner/query/update integration, bindings and required test/compatibility touch sets remain pending. An every-file recipe would require guessing.',
 v2_format:'FAIL. Protobufs, exact selectors/version mappings, table metadata framing and system-column stream behavior are covered. Stream configuration does not define encoded data-file bytes. Full V2 layouts, encoding implementations, reader/writer dispatch and historical compatibility evidence remain pending.',
 python_api:'FAIL. Contributor/environment instructions are covered. The public Python and PyO3 signature inventories and complete Rust mappings are absent.',
 transaction_commit:'FAIL. All local lance-table files are covered, including candidate construction, publication/repair, row/index metadata and the concrete DynamoDB backend. Full Dataset operation-pair conflict resolution, rebase/retry/outcome recovery, namespace authority and cleanup remain pending. Local crate completion does not establish the complete commit protocol.'
},review_note:'Re-evaluated using only current KB module documentation, scenario/cookbook traces, format summary and coverage records. All five questions require material information not yet present.'};
v.overall_pass=false;v.reviewed_at=new Date().toISOString();write(path,v);
fs.appendFileSync('verification-log.md',`\n## Iteration 51 — ANALYZE then VERIFY — FAIL (global coverage/self-sufficiency)\n\n- Added four complete files and 2,482 lines in 91 authored ranges: stream utilities (1,887), manifest interning benchmark (263), system-column benchmark (172) and version-column benchmark (160). Added 112 symbols. [Analysis](analysis/iteration-051-batch.json), [stream supplement](L1-modules/rust-lance-table-stream.md), [benchmark supplement](L1-modules/rust-lance-table-benchmarks.md).\n- [Verification](verification/iteration-051.json), [declaration audit](verification/iteration-051-top-level-audit.json), [initial declaration audit](verification/iteration-051-top-level-audit-initial.json), [nondeclaration evidence](verification/iteration-051-no-items.json); seed ${v.seed}. Full inventory hashes and source status are unchanged at c3c8d6fb505fb437b2b673c5195e1d4b74436b2f. No internet, source edits, builds, tests, benchmarks or service calls.\n- Claimed scope PASS: 129 files / 67,357 lines; all 54 lance-table inventory entries / 40,818 lines. Symbols: 5,650 (971 protobuf + 4,679 Rust), 113 files. Line accountability PASS: 695 declaration mappings across 42 freshly reviewed sampled files; no previous-turn reuse.\n- Accuracy PASS: all 20 random claims freshly opened and checked, with additional supporting helper reads. Ten stale status statements were refreshed during ANALYZE; [four PreparedIndices coverage/reference notes](analysis/iteration-051-verify-corrections.json) were refreshed during VERIFY and rechecked. No sampled behavioral claim required correction.\n- Initial integrity PASS: 14,323 citations / 8,786 links. [Post-correction integrity](verification/iteration-051-post-correction.json) records final counts, source hashes, full ranges and links after checkpoint updates.\n- Global coverage and all five complete KB-only questions FAIL: 1,930 files, including 294 binaries, remain pending. Decision: ANALYZE52 begins lance-file runtime with datatypes, encoding IO, version dispatch and writer facade/field classifications (1,628 lines). Full Dataset integration, encoding runtimes, remaining crates and bindings remain open. Goal stays active and INCOMPLETE.\n`);
write('iteration-state.json',{iteration:52,phase:'ANALYZE',completed:false,previous_verification:path,totals:v.totals,read_not_analyzed:read('analysis/iteration-051-contextual-reads.json'),next:'Read and author rust/lance-file/src/datatypes.rs (565 lines), io.rs (148), versions/mod.rs (428), writer.rs (294), and writer/field_types.rs (193): 1628 lines. This starts file runtime contracts after all local table inventory entries are covered. Preserve read-only source and offline constraints. Full Dataset integration and all five complete acceptance answers remain pending.',acceptance_gaps:['1930 files pending','294 binary files pending','all five complete KB-only answers fail','full runtime formats, bindings and caller graph pending']});
let r=fs.readFileSync('README.md','utf8');
r=r.slice(0,r.indexOf('## Current checkpoint'))+`## Current checkpoint

129 of 2,059 files and 67,357 of 1,166,813 inventory text lines are analyzed. This includes all 15 protobuf-subsystem files, all 48 lance-core files, all 54 lance-table entries, seven lance-file entries and five other contributor guides. The symbol index has 5,650 records: 971 protobuf and 4,679 Rust. All 294 binary files remain pending.

Fifty-one VERIFY cycles are recorded. VERIFY51 checked 20 fresh random claims and 695 declaration mappings across 42 freshly reviewed sampled files. All sampled claims passed; four coverage/reference notes were refreshed. Full hashes/ranges and source cleanliness passed. All checked citations and links resolve; final counts are in [post-correction integrity](verification/iteration-051-post-correction.json). Global acceptance still fails: 1,930 files and all five complete KB-only answers remain pending. See [iteration state](iteration-state.json) and [verification log](verification-log.md).

The [stream supplement](L1-modules/rust-lance-table-stream.md) covers task alignment, shared futures, stable-ID read-ahead, system-column materialization, deletion filtering and retained memory. The [benchmark supplement](L1-modules/rust-lance-table-benchmarks.md) records measured units, environment controls, edge cases and limits of source-only evidence. All 54 local table entries are covered, but full Dataset integration remains pending. ANALYZE52 starts lance-file datatype, encoding-IO, version-dispatch and writer interfaces. Tests and benchmarks were read, not run.

Analysis records retain superseded drafts for provenance. Follow each file's current analysis_record in MANIFEST and current L2 document; verification snapshots retain their original sampled claims alongside corrections. Source remains read-only and the goal remains active and INCOMPLETE.
`;
fs.writeFileSync('README.md',r);
console.log({accuracy:'20/20',declarations:695,fresh_files:42,next:52,totals:v.totals,overall_pass:false});
