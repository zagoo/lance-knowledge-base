import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {root} from './inventory.mjs';

const read = p => JSON.parse(fs.readFileSync(p));
const write = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + '\n');
const p = 'verification/iteration-054.json';
const v = read(p);
if (v.checks.accuracy.manual_pass !== null) throw Error('Already recorded');
const notes = [
  'Page enumeration, missing-encoding error and decoding before buffer-count validation match. Fresh fetch_encoding and remainder of decode_column confirm Direct Any conversion and absence of recursive ArrayEncoding validation.',
  'The raw -2 predicate retains any other ID and removes empty field arrays. Rewritten source IDs use unchecked u32 casts; cloned bitmap receives removals only.',
  'GET, full body collection and JSON errors each become None. Fresh VersionHint definition confirms a single u64 field; no local range or freshness validation.',
  'Every synthetic fragment/file field matches, including identical cloned version bytes, physical_rows1000, literal file version2.0 and absent lineage/deletion metadata. No persisted fixture is implied.',
  'Exact fixed-u8 RLE, bitpacking, general, raw order and parameter arguments match. Fallible helper errors propagate before later choices.',
  'Strict estimated-size comparison and eager HoleRuns construction match. Fresh from_bitmap confirms cleared-bit runs and temporary vectors; endpoint overcount is a deduction from num_runs+1, not a measured wire size.',
  'LE u128 key generation and post-push count comparison match. Fresh call sites use existing shard0 and counts3 or4. Zero count has no special return.',
  'All three option flags, extra-field rejection, last duplicate mapping, nondecreasing positions and missing-field precedence match. Fresh datatypes module confirms private schema module and no compare_fields reexport.',
  'Fresh EXACT_VERSIONS lists V1 and V2_0 through V2_3. Roundtrip assertions and four rejected aliases/selectors match; rejection checks only is_err.',
  'Map-to-direct-to-chain construction and unchanged details match. Fresh direct/chained helpers confirm representation construction without map/details validation or IO.',
  'Exact aarch64+macOS cfg and unconditional true body match. The platform-support comment is an assumption; no runtime feature query is executed by this branch.',
  'Test asserts only the reserved system-index UUID remains equal. Fresh apply/table/progress helpers and production equality shortcut confirm why unchanged coverage returns before replacing metadata. This is source inspection, not an executed test.',
  'Fresh constants confirm deprecated bit2, mixed bit8, FRI bit10 and sticky mask8|10. Validation order and CorruptFile diagnostics match.',
  'Async get extracts entry.value; insert clones key and wraps declared size. No local serialization, validation or metric counter update.',
  'Capacity times inline element size plus live element child sizes matches. Fresh trait default confirms enclosing inline footprint is accounted separately.',
  'Destructuring, normalization of only NoDeletions and debug assertion match. Fresh has_system_cols includes row ID, address, updated-at and created-at flags.',
  'Full Vec collection, copied-iterator statistics and moved sequence match. Fresh selection helper confirms contiguous Range branches do not consume sequence contents again; other representations may allocate.',
  'Historical namespace restriction and permitted extension of existing messages match the comment. Fresh index.proto package is lance.index.pb, supporting the documented comment/declaration discrepancy.',
  'Architecture-only cfg, unsafe getauxval and separate LSX/LASX masks match. No additional OS cfg or cross-platform compilation claim.',
  'Named cases and two-fragment fixture match. Fresh helper constructs nullable Int32 and legacy file metadata with unknown physical counts; manifest storage identity is V2_0. The annotation does not mistake that manifest identity for the files themselves.'
];
const fresh = read('verification/iteration-054-fresh-claim-reads.json');
if (fresh.length !== 20) throw Error('Missing fresh reads');
for (const s of v.checks.accuracy.samples) {
  if (!fresh.some(f => f.id === s.id && f.path === s.path && f.start === s.start && f.end === s.end)) throw Error('Missing claim ' + s.id);
  s.manual_review = 'pass';
  s.initial_review = 'pass';
  s.review_note = notes[s.id - 1];
}
Object.assign(v.checks.accuracy, {
  manual_pass: true, reviewed_count: 20, initial_passed_count: 20,
  initial_mismatch_count: 0, passed_count: 20,
  fresh_source_evidence: 'verification/iteration-054-fresh-claim-reads.json',
  supplemental_evidence: 'verification/iteration-054-supplemental-source.json'
});
const audit = read('verification/iteration-054-top-level-audit.json');
const count = audit.reduce((n, f) => n + f.items.length, 0);
if (audit.length !== 45 || count !== 756) throw Error('Audit counts changed');
for (const s of v.checks.line_accountability.samples) {
  s.manual_review = 'pass';
  s.review_note = 'Fresh declaration-to-authored-range mapping inspected in this goal turn; full ranges and source appendix were independently checked by verifier.';
  if (/versions\/v2_[12]\/reader.rs$/.test(s.path)) s.review_note += ' Corrected RLE Flat.data wording using the protobuf field type and rechecked both exact reader branches.';
  if (['protos/license_header.txt', 'rust/lance-file/protos'].includes(s.path)) s.review_note += ' Complete nondeclaration text/symlink target freshly opened and recorded.';
}
Object.assign(v.checks.line_accountability, {
  manual_pass: true, reviewed_files: 45, reviewed_items: count,
  fresh_files: 45, prior_turn_reuse: 0,
  audit: 'verification/iteration-054-top-level-audit.json',
  initial_audit: 'verification/iteration-054-top-level-audit-initial.json',
  nondeclaration_evidence: 'verification/iteration-054-no-items.json',
  corrections: 'analysis/iteration-054-verify-corrections.json',
  review_note: 'All 45 mapping outputs reviewed in complete fresh batches; no previous goal-turn review reused. Corrected reader mappings reread. No source audit or accuracy output was truncated; oversized KB-only narrative reads were replaced with bounded excerpts.'
});
v.checks.self_sufficiency = {
  pass: false,
  review_note: 'Evaluated from current reader/runtime/commit supplements, scenarios, cookbook and coverage ledger. No source was used to invent missing steps. Partial local subtraces below do not satisfy the complete questions.',
  evidence: ['L1-modules/rust-lance-file-readers.md', 'L1-modules/rust-lance-file-runtime.md', 'L1-modules/rust-lance-table-commit.md', 'L4-crosscutting/scenarios.md', 'L4-crosscutting/cookbook.md', 'MANIFEST.json'],
  answers: {
    write_then_compact: 'FAIL. The KB explains exact writer dispatch and field/page/compression selection, projection preparation and now exact reader metadata acceptance. Table candidate/publication/repair and row remapping are covered. Dataset::write buffering, concrete page emission and writer shutdown, compact_files orchestration, retry/index rewrite and cleanup remain incomplete; none of219 rust/lance/src files is fully analyzed. The full disk-and-memory trace cannot be supplied.',
    new_scalar_index: 'FAIL. Known starting points include protobuf detail namespace rules, IndexMetadata/Any representation and table retention/admission. Complete scalar traits, implementation/registry/loader/planner/update/binding/test touch sets are absent; none of174 lance-index files is analyzed. No complete new-index recipe is claimed.',
    v2_format: 'FAIL. The KB now specifies exact footer acceptance, metadata finish order, Direct Any and buffer checks, V2_0 header versus structural leaf projection, and exact V2_1/2/3 recursive grammar. It distinguishes V2_1 small chunks and fixed-flat RLE, V2_2 large chunks and packed fields, V2_3 general child RLE and sparse validation. Local grammar acceptance does not establish valid byte decoding: full reader IO/cache, writer lifecycle, byte algorithms and compatibility fixtures remain pending; none of74 lance-encoding files is fully analyzed.',
    python_api: 'FAIL. Only python/AGENTS.md is analyzed among247 Python-subtree files. Complete Python APIs, PyO3 signatures and mappings to Rust remain unavailable in the KB.',
    transaction_commit: 'FAIL. Table-local operations, preparation, candidate building, publication and repair handlers are covered. Complete Dataset operation-pair conflict resolution, rebasing/retries, outcome recovery, namespace authority and cleanup remain pending. These missing layers prevent a complete operation-hook recipe.'
  }
};
v.previous_goal_turn_classification = 'progress';
v.checks.final_source_status = {
  head: execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim(),
  clean: execFileSync('git', ['status', '--porcelain=v1', '--untracked-files=all'], {cwd: root, encoding: 'utf8'}).trim() === ''
};
v.checks.verify_corrections = {
  record: 'analysis/iteration-054-verify-corrections.json',
  changes: 4, underlying_behavior_mismatches: 1,
  explanation: 'Corrected the same Flat.data type confusion in two complete L2 records and two L1 narrative statements. Flat.data is optional BufferCompression metadata, not embedded data bytes.',
  analysis_status_refreshes: 'analysis/iteration-054-status-refresh.json',
  analysis_status_refresh_count: 9
};
v.checks.initial_cross_links = structuredClone(v.checks.cross_links);
v.overall_pass = false;
write(p, v);
const next = 'Read and author current structural writer pipeline: rust/lance-file/src/versions/v2_1/writer.rs, v2_2/writer.rs and v2_3/writer.rs (224 lines each), plus rust/lance-file/src/writer/structural.rs (1025), total1697. Resolve initialization/lazy schema, buffering, page IO, spill, external metadata and finish/footer lifecycle. Then V2_0 writer, full reader and tests/fixtures. Maintain offline/read-only source constraints and ANALYZE then VERIFY.';
write('iteration-state.json', {
  iteration: 55, phase: 'ANALYZE', completed: false,
  previous_verification: p, totals: v.totals,
  read_not_analyzed: read('analysis/iteration-054-contextual-reads.json'),
  next, acceptance_gaps: ['1913 files pending', '294 binary files pending', 'all five complete KB-only answers fail', 'concrete writer lifecycle/byte algorithms, full Dataset and binding call graphs pending']
});
fs.appendFileSync('verification-log.md', `\n## Iteration 54 — ANALYZE then VERIFY — FAIL (global coverage/self-sufficiency)\n\n- Added all four current version reader modules: 1,368 lines, 79 authored ranges and 67 symbol records. [Analysis](analysis/iteration-054-batch.json), [reader supplement](L1-modules/rust-lance-file-readers.md), [context reads](analysis/iteration-054-contextual-reads.json). [Nine status refreshes](analysis/iteration-054-status-refresh.json) distinguish newly covered grammar from pending IO/byte algorithms. Previous goal turn classified progress.\n- [VERIFY54](verification/iteration-054.json), seed ${v.seed}: full inventory hashes, source status and contiguous coverage PASS for 146 files / 71,905 lines. File crate: 24/56 entries / 5,179 lines. Source remains clean at ${v.checks.final_source_status.head}. No internet, source edits, source builds/tests/benchmarks or installations.\n- Line accountability: 45 freshly reviewed sampled files, 756 top-level mappings, all pass after correction. [Audit](verification/iteration-054-top-level-audit.json), [initial audit](verification/iteration-054-top-level-audit-initial.json), [nondeclaration evidence](verification/iteration-054-no-items.json). No prior-turn review reused.\n- Accuracy: 20/20 random claims pass after fresh source opening. [Fresh reads](verification/iteration-054-fresh-claim-reads.json) and [supplemental helpers](verification/iteration-054-supplemental-source.json) verify error order, fixture setup, feature bits, allocation and actual test oracles. Tests were inspected, not executed.\n- [Four wording corrections](analysis/iteration-054-verify-corrections.json) fix one underlying type confusion: Flat.data is an optional BufferCompression descriptor, not data bytes. Two L2 records and two module statements corrected; exact protobuf and both RLE branches rechecked.\n- Initial integrity PASS: 15,532 citations / 9,608 links. Final [integrity report](verification/iteration-054-post-correction.json) includes corrections and checkpoint links. Symbol index: 6,021 records across 130 files (971 protobuf, 5,050 Rust).\n- Global coverage FAIL: 1,913 files including 294 binaries pending. All five full KB-only questions still FAIL. Decision: ANALYZE55 three current structural writer wrappers and shared writer pipeline (1,697 lines). Goal active and INCOMPLETE; no completion report.\n`);
let r = fs.readFileSync('README.md', 'utf8');
r = r.slice(0, r.indexOf('## Current checkpoint')) + `## Current checkpoint\n\n146 of 2,059 files and 71,905 of 1,166,813 inventory text lines are analyzed. Covered scope includes all 15 protobuf-subsystem files, all 48 lance-core files, all 54 lance-table entries, 24 lance-file entries and five other contributor guides. The symbol index has 6,021 records (971 protobuf and 5,050 Rust). All 294 binary files remain pending.\n\nFifty-four VERIFY cycles are recorded. VERIFY54 checked 20 fresh random claims and 756 top-level mappings across 45 sampled files. The audit corrected one type-description error in four places: Flat.data is optional buffer-compression metadata. Sampled claims all pass. Full hashes, ranges and source cleanliness pass; final citation/link counts are in the [integrity report](verification/iteration-054-post-correction.json). Global acceptance remains FAIL: 1,913 files and all five complete KB-only answers need further analysis.\n\nThe new [reader supplement](L1-modules/rust-lance-file-readers.md) documents exact version grammars, metadata acceptance/error ordering, projections and local test limitations. It complements [composition](L1-modules/rust-lance-file-composition.md) and [runtime boundaries](L1-modules/rust-lance-file-runtime.md). Next: three current structural writer wrappers and the shared writer pipeline. Source tests were read, not run.\n\n[Iteration state](iteration-state.json) and [verification log](verification-log.md) preserve progress. Analysis records retain superseded drafts for provenance; follow each file's current analysis_record in MANIFEST and current L2 document. Source remains read-only; goal active and INCOMPLETE.\n`;
fs.writeFileSync('README.md', r);
console.log({claims: 20, declarations: count, samples: audit.length, totals: v.totals, next: 55, overall_pass: false});
