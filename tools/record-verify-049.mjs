import fs from 'node:fs';
const read = p => JSON.parse(fs.readFileSync(p));
const write = (p,v) => fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const file='verification/iteration-049.json';
const v=read(file), audit=read('verification/iteration-049-top-level-audit.json');
if(v.checks.accuracy.manual_pass!==null) throw Error('Already recorded');
const notes=[
  'Counted 24 explicit backtrace arms and 13 explicit non-backtrace arms; feature/docs/delegation match. No wildcard or runtime-capture guarantee inferred.',
  'Every U64Segment encoder arm matches, including unreachable standalone Ranges. Fresh supplemental reads confirm dataset-version conversion calls this encoder and from_slice/slice/nonempty mask reconstruction choose other variants; an empty mask can preserve an existing representation without emitting a new one.',
  'Bits 0 through 5 and inline-transaction wording match. Fresh apply_feature_flags read confirms reset/rebuild does not emit the deprecated bit.',
  'LazyLock initializer and getter dereference match the once-initialized environment/CPU behavior.',
  'Active default and Sealed discriminant conversions match; unknown signed values become Active. Fencing remains a documented consumer contract, not implemented by this enum.',
  'Tag 11, bit-13 independent key/value declarations, legacy trailing suffix and legal payload withdrawal all match the full schema comment.',
  'The fixture constructs a valid empty Int32 list and asserts KeyValue::List has zero elements; no null-list case is present.',
  'Only env read failure selects default; successful strings are trimmed and passed to the truthy predicate. Supplemental predicate confirms unknown/empty values are false.',
  'V1 adapter metadata/manifest-position check, dictionary hydration, max-field default and delegated numeric arguments match exactly; no V2 implementation inferred.',
  'Two mixed-segment sequences and all seven selection parameter forms compare against explicit flattened selection oracle. Listed omitted edge cases are absent from this fixture.',
  'Old package width tags 2/3 and transparency comments match; freshly opened 2.1 definitions use different tags/nested compression.',
  'Resolve returns local ancestry only on success and converts parsing failure to None. Supplemental Field::resolve confirms local partial mutation; parser implements backticks despite the double-quote example.',
  'All three format-documentation content requirements and bitmap reference match verbatim source intent.',
  'TaggedLineage has only Debug derive, private optional bitmap/Arc ledger and public module route. Unknown coverage differs from missing interpretable ledger.',
  'Transparent External/FieldNotFound, Namespace fields and non-backtrace disk-cap fields match. Supplemental constructor and 100/50 test confirm no used-greater-than-cap validation.',
  'Ten explicit falsy spellings assert Some(false); no claim that unknown text is an explicit negative token.',
  'Optional tags 13/14, ordered admission, single oversized-batch exception and absent independent bound match schema comments; not a total-memory guarantee.',
  'Inline source/destination IDs and supplied versions match; assertions replace destination creation 7 with source 3 and stamp update 9.',
  'Bounds check, start partition, preceding missing-run rejection and subtraction match. Second partition excludes the terminal prefix and uses <= under sorted invariants.',
  'One-million bitmap slots, every-17th clearing, initial range and stride-9973/boundary/tail/past-end selection match. There is no timing assertion.'
];
for(const s of v.checks.accuracy.samples){s.manual_review='pass';s.review_note=notes[s.id-1];}
Object.assign(v.checks.accuracy,{manual_pass:true,reviewed_count:20,passed_count:20,supplemental_evidence:[
  'rust/lance-table/src/rowids/version.rs:520-535',
  'rust/lance-table/src/rowids/segment.rs:196-243',
  'rust/lance-table/src/rowids/segment.rs:290-307',
  'rust/lance-table/src/rowids/segment.rs:378-387',
  'rust/lance-table/src/rowids/segment.rs:694-746',
  'rust/lance-table/src/feature_flags.rs:128-217',
  'rust/lance-core/src/utils/parse.rs:1-32',
  'protos/encodings_v2_1.proto:470-496',
  'rust/lance-core/src/datatypes/schema.rs:1567-1663',
  'rust/lance-core/src/datatypes/field.rs:869-887',
  'rust/lance-table/src/system_index/frag_reuse.rs:1-10',
  'rust/lance-core/src/error.rs:768-775',
  'rust/lance-core/src/error.rs:1311-1327'
]});
for(const s of v.checks.line_accountability.samples){
  const a=audit.find(a=>a.path===s.path);
  if(!a || a.unchanged_from_current_turn_review) throw Error('Expected fresh audit');
  s.manual_review='pass';
  s.review_note='Fresh declaration-to-authored-range review in bounded outputs for this goal turn; no earlier-turn reviews reused. Full contiguous ranges and exact numbered source were independently checked. Superseded coverage wording is corrected in the separate correction record.';
}
Object.assign(v.checks.line_accountability,{manual_pass:true,top_level_items_reviewed:562,fresh_files_reviewed:42,same_active_turn_reused_files:0,mapping_evidence:'verification/iteration-049-top-level-audit.json',no_item_evidence:'verification/iteration-049-no-items.json'});
v.checks.status_refresh={pass:true,count:2,evidence:'analysis/iteration-049-status-refresh.json'};
v.checks.corrections=[{evidence:'analysis/iteration-049-verify-corrections.json',count:10,note:'Refreshed superseded io facade, parent module, scenario and cookbook coverage notes. No sampled behavioral claim mismatch was found.'}];
v.checks.cross_links_initial=v.checks.cross_links;
v.checks.self_sufficiency={pass:false,answers:{
  write_then_compact:'FAIL. The KB can trace candidate metadata assembly, manifest body/footer writes, ordinary selected-staging COPY/index repair and identity-conditioned unique-object publication. It distinguishes retained staging/orphans, size/ETag checks and multipart-buffer costs. Dataset::write and compact_files scheduling, data writers, complete index remapping, retry/readback and cleanup remain missing, so the full disk/memory trace cannot be supplied.',
  new_scalar_index:'FAIL. Schema metadata, candidate maintenance/admission and several system-index contracts are covered. The complete scalar trait, registry/loader, planner/update integration, language bindings and required tests remain unindexed; a complete every-file recipe would require guessing.',
  v2_format:'FAIL. Protobufs and exact version selectors/gates plus table metadata framing are covered. Canonical versus unique manifest naming is not the complete data-file V2 format. Encoding bit layouts, reader/writer dispatch and all stable compatibility evidence remain pending.',
  python_api:'FAIL. Only contributor/environment rules are covered. All public Python/PyO3 signatures and their complete Rust mappings remain absent.',
  transaction_commit:'FAIL. Table operations/candidate assembly and local CommitHandler/ExternalManifestStore contracts now identify publication seams, conflict versus prerequisite outcomes, record identities, listing and retirement. Concrete DynamoDB/namespace authority and the full Dataset operation-pair conflict matrix, rebase/retry/outcome recovery, transition assembly and cleanup remain pending. The local interfaces cannot establish those end-to-end rules.'
},review_note:'Re-evaluated using only KB modules, scenarios, cookbook and coverage gaps after external-manifest analysis. All five complete questions remain failures; local improvements are explicitly separated from full acceptance.'};
v.overall_pass=false;v.reviewed_at=new Date().toISOString();write(file,v);
fs.appendFileSync('verification-log.md',`\n## Iteration 49 — ANALYZE then VERIFY — FAIL (global coverage/self-sufficiency)\n\n- Added all 2,553 lines of external_manifest.rs in 76 authored ranges and 129 symbols; refreshed the six-line io facade. The [external commit supplement](L1-modules/rust-lance-table-external-commit.md) covers both publication protocols, ETag versus identity, repair/error paths, authoritative history, multipart lifecycle and all local fixtures. [Analysis](analysis/iteration-049-external.json).\n- [Verification](verification/iteration-049.json), [declaration audit](verification/iteration-049-top-level-audit.json), [nondeclaration evidence](verification/iteration-049-no-items.json); seed ${v.seed}. Inventory hashes and source status are unchanged at c3c8d6fb505fb437b2b673c5195e1d4b74436b2f. No internet, source edits, builds, tests or services.\n- Claimed scope PASS: 122 files / 62,022 lines. Symbol index: 5,379 declarations (971 protobuf + 4,408 Rust), 106 files. Line accountability PASS: 562 declarations across 42 freshly reviewed sampled files; no earlier-turn reuse. Accuracy PASS: 20/20 freshly opened random claims with supplemental source checks.\n- Initial integrity PASS: 13,597 citations / 8,371 links. [Ten coverage-note corrections](analysis/iteration-049-verify-corrections.json) refresh superseded local scope statements; no sampled behavioral mismatch. [Post-correction integrity](verification/iteration-049-post-correction.json) records final range/hash/link checks. Two parent status statements were also refreshed during ANALYZE.\n- Global coverage and all five complete KB-only answers FAIL: 1,937 files, including 294 binaries, remain pending. Decision: ANALYZE50 targets DynamoDB, then row-ID index, stream utilities and four table benchmarks. Full Dataset integration and remaining crates/bindings remain open. Goal stays active and INCOMPLETE.\n`);
write('iteration-state.json',{iteration:50,phase:'ANALYZE',completed:false,previous_verification:file,totals:v.totals,read_not_analyzed:read('analysis/iteration-049-contextual-reads.json'),next:'Read and author rust/lance-table/src/io/commit/dynamodb.rs (586 lines), then rowids/index.rs (1641), utils/stream.rs (1887) and four benchmarks. Preserve read-only source and offline constraints. Full Dataset conflict/rebase/retry/transition assembly and all five complete acceptance questions remain pending.',acceptance_gaps:['1937 files pending','294 binary files pending','all five complete KB-only answers fail','full runtime formats, bindings and caller graph pending']});
let r=fs.readFileSync('README.md','utf8');
r=r.slice(0,r.indexOf('## Current checkpoint'))+`## Current checkpoint

122 of 2,059 files and 62,022 of 1,166,813 inventory text lines are analyzed. This includes all 15 protobuf-subsystem files, all 48 lance-core files, 47 lance-table entries, seven lance-file entries and five other contributor guides. The symbol index has 5,379 records: 971 protobuf and 4,408 Rust. All 294 binary files remain pending.

Forty-nine VERIFY cycles are recorded. VERIFY49 passed 20/20 fresh random claims and 562 declaration mappings across 42 freshly reviewed sampled files. Full hashes/ranges and source cleanliness passed. All checked citations and links resolve; final counts are in [post-correction integrity](verification/iteration-049-post-correction.json). Ten superseded coverage notes were corrected. Global acceptance still fails: 1,937 files and all five complete KB-only answers remain pending. See [iteration state](iteration-state.json) and [verification log](verification-log.md).

The [external commit supplement](L1-modules/rust-lance-table-external-commit.md) now covers selected-staging canonical publication, identity-conditioned unique-path publication, reader repair, authoritative history, multipart copy and cancellation. [Parent commit mechanics](L1-modules/rust-lance-table-commit.md), [manifest assembly](L1-modules/rust-lance-table-manifest-build.md) and [metadata IO](L1-modules/rust-lance-table-io.md) are also covered. ANALYZE50 proceeds to DynamoDB. Complete Dataset conflict/retry/cleanup, byte formats and bindings remain pending. Tests were read, not run.

Analysis records retain superseded drafts for provenance. Follow each file's current analysis_record in MANIFEST and current L2 document; verification snapshots retain their sampled claims. Source remains read-only and the goal remains active and INCOMPLETE.
`;
fs.writeFileSync('README.md',r);
console.log({accuracy:'20/20',declarations:562,fresh_files:42,next:50,totals:v.totals,overall_pass:false});
