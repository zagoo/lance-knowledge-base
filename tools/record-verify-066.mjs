import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {root} from './inventory.mjs';

const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const write = (p, value) => fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n');
const destination = 'verification/iteration-066.json';
const v = read(destination);
if (v.checks.accuracy.manual_pass !== null) throw Error('Review already recorded');
const notes = [
  'Fresh ColumnAnyDirect serialization produces ColumnMetadata and pages; the containing caller unzips output in order. No index field or validation occurs in this wrapper.',
  'Fresh fixture writes ten separate batches, takes rows [1,15,20,25,30,48,90], and compares exact dictionary keys [1,1,6,4,2,6,6] and values. Supplemental construction confirms the mod-seven dictionary and prepared schema; no null or multi-fragment fixture is asserted.',
  'Fresh overlay transformation clones each field list into a fresh Arc, replaces eligible IDs with -2, retains any ID not equal to -2, including other negative IDs, and removes empty or fully tombstoned files. Supplemental constant confirms -2; no IO is performed.',
  'Fresh legacy blob-ID handling runs only for a nonempty set, then visits referenced data files including overlays. Version parsing can reject an unrelated malformed file version. V2_2/V2_3 IDs collect into a BTreeSet; this path does not rewrite bytes.',
  'Fresh cfg(test) public synthetic column-length helper returns InvalidInput for a missing index. It contains no binary fixture read or unsafe block; the whole sampled file declaration mapping was inspected.',
  'Fresh UUID conversion copies its byte slice into a Vec. It is locally infallible and performs no textual UUID parsing.',
  'Fresh tests cover two NotFound constructions, recognition, display/debug/source, object-store and IO wrapping, Wrapped behavior, and Timeout/IO clone variants. Assertions match the authored range; tests were read, not executed.',
  'Fresh index conversion clones fields and Any details, collapses empty file lists into None, retains Some version, casts a negative timestamp to u64, and copies base information without local validation.',
  'Cardinality clarification: the iterator maps each input (field_id, DataType) pair to one nonnullable Struct root. The initial wording could imply one root total. Canonical L2 and the one derived stats_schema symbol now explicitly say per input pair; null_count/min/max contracts and ordering already matched.',
  'Fresh complete parameterized gate test has 45 case attributes spanning four decision states and absence cases; it is not a full Cartesian product. The initial broad search was truncated, so the entire 451-622 source span was reread and the case count independently counted.',
  'Fresh Boolean take implementation calculates a u32 block size multiplied by eight and assumes sorted nonempty indices. Arithmetic is unchecked and null selectors are ignored. Supplemental public take branch handles an empty selector before reaching this helper.',
  'Fresh DynamoDB result handling returns None for absent/empty results, rejects more than one item, requires attributes, and parses optional size before type validation. Supplemental query applies limit one; type handling confirms the documented failure order.',
  'Fresh private PageTable owns a BTreeMap keyed by field and batch IDs. Supplemental PageInfo contains scalar position and length; no Arc or shared mutable ownership is introduced by these declarations.',
  'Fresh fixed-size-binary decode scales element count and requested range to UInt8 bytes. Supplemental Arrow helper divides by stride without a zero guard and adds no validity; this is a source-derived precondition, not a runtime reproduction.',
  'Fresh structural column counting treats blob/packed fields as opaque, assigns a leaf one column including an empty struct, and recursively sums children without a separate struct header. usize addition is unchecked.',
  'Fresh field conversion preserves extension name, uses rtype zero, and encodes primary-key presence separately from position. Clustering uses a false/default position convention; supplemental reverse conversion confirms primary Some(0) survives while clustering Some(0) does not.',
  'Fresh metadata-only overlay fixture uses four V2_0 files and verifies normal/mixed tombstones are retained and all-minus-two files removed, including exact size values. No physical file deletion is asserted.',
  'Fresh row-ID fixture has five physical rows with IDs 10 through 14, dataset versions one, and two offsets 0 and 100. Cardinality is two but maximum offset is invalid; the assertion matches error text, not an exact error enum variant.',
  'Fresh typed StringCacheKey uses borrowed Cow text, stable type/schema version identity and a single string write. Supplemental neighboring cache-key types have separate Metadata, PageTable and Option<PageTable> identities. The wrapper adds no physical-file identity validation.',
  'Fresh async ledger helper accepts FnOnce, validates external ranges before invoking it and received length afterward, and avoids the callback for inline data. Version is checked first; local path validation, Send/static bounds and cancellation handling are not added here.'
];
const fresh = read('verification/iteration-066-fresh-claim-reads.json');
if (fresh.length !== 20 || notes.length !== 20) throw Error('Claim count differs');
const correction = read('analysis/iteration-066-verify-corrections.json');
if (!read('verification/iteration-066-correction-recheck.json').pass) throw Error('Correction not verified');
for (const sample of v.checks.accuracy.samples) {
  if (!fresh.some(x => x.id === sample.id && x.path === sample.path && x.start === sample.start && x.end === sample.end)) throw Error('Missing fresh claim evidence');
  Object.assign(sample, {initial_review: sample.id === 9 ? 'clarification' : 'pass', manual_review: 'pass', review_note: notes[sample.id - 1]});
  if (sample.id === 9) sample.corrected_claim = correction.changes[0].after;
}
Object.assign(v.checks.accuracy, {
  manual_pass: true, reviewed_count: 20, initial_passed_count: 19,
  initial_mismatch_count: 0, initial_clarification_count: 1, passed_count: 20,
  fresh_source_evidence: 'verification/iteration-066-fresh-claim-reads.json',
  supplemental_evidence: 'verification/iteration-066-supplemental-source.json'
});
const audit = read('verification/iteration-066-top-level-audit.json');
const count = audit.reduce((n, file) => n + file.items.length, 0);
const noItems = read('verification/iteration-066-no-items.json');
if (audit.length !== 45 || count !== 645 || noItems.length !== 2) throw Error('Audit counts differ');
for (const sample of v.checks.line_accountability.samples) Object.assign(sample, {
  manual_review: 'pass',
  review_note: 'Fresh declaration-to-authored-range mappings manually inspected. Files without detected declarations received full fresh content reads. Structural checks separately verify contiguous ranges and exact source appendices.'
});
Object.assign(v.checks.line_accountability, {
  manual_pass: true, reviewed_files: 45, reviewed_items: count, fresh_files: 45, prior_turn_reuse: 0,
  audit: 'verification/iteration-066-top-level-audit.json',
  nondeclaration_evidence: 'verification/iteration-066-no-items.json',
  review_note: 'All 45 files and 645 mappings reviewed in complete outputs this cycle. License header and mask regression fixture read fully, including all numeric values. All 20 claim excerpts and supplemental reads were inspected. A truncated broad gate search was superseded by the full 451-622 span. Carried-state/KB/tool-file output truncation added no source coverage. No sampled file or claim selected a binary; the new V1 binary received separate exhaustive byte and independent reconstruction checks.'
});
const reconstruction = read('verification/iteration-066-v1-reconstruction.json');
if (!reconstruction.pass || reconstruction.compared_bytes !== 387133 || reconstruction.compared_rows !== 4097) throw Error('Incomplete reconstruction');
v.checks.binary_accountability = {
  pass: true, files: 1, regions: 78, bytes: 387133, decoded_rows: 4097,
  evidence: 'analysis/iteration-066-v1-fixture.json',
  preserved_artifact: 'evidence/binary/v1.lance',
  decoded_values: 'evidence/binary/v1-decoded-rows.json',
  independent_verification: 'verification/iteration-066-v1-reconstruction.json',
  method: reconstruction.method,
  repository_runtime_executed: false,
  limitation: 'Byte-level reconstruction establishes this fixture interpretation. It is not execution of Lance compatibility tests, proof of the documented historical release provenance, or a runtime qualification result.'
};
v.checks.self_sufficiency = {
  pass: false,
  review_note: 'Fresh KB-only review of the complete binary fixture supplement, commit publication/lease sections, scenarios, cookbook and MANIFEST. One complete binary layout does not establish whole-repository self-sufficiency.',
  evidence: ['L1-modules/rust-lance-file-binary-fixtures.md', 'L1-modules/rust-lance-table-commit.md', 'L4-crosscutting/scenarios.md', 'L4-crosscutting/cookbook.md', 'MANIFEST.json'],
  answers: {
    write_then_compact: 'FAIL. File IO contracts, table candidate publication and the V1 fixture are covered. All 219 rust/lance/src files remain pending, including Dataset write/compaction orchestration, retries and cleanup.',
    new_scalar_index: 'FAIL. Protobuf and table metadata/admission contracts are covered. All 174 lance-index files remain pending, so complete implementation traits, registrations, loaders/planners, update paths and binding/test touch sets are unavailable.',
    v2_format: 'FAIL. File version dispatch/gates, metadata/projection grammar, footers/alignment, writers/readers and concat are covered locally. All 74 lance-encoding files and five V2 lance-file fixtures remain pending; complete encoding layouts and decoder algorithms are unavailable.',
    python_api: 'FAIL. Only python/AGENTS.md is analyzed among 247 Python-subtree entries. Fixture-generator symbols elsewhere do not document Python/PyO3 public APIs or their Rust mappings.',
    transaction_commit: 'FAIL. Table operation conversion/validation, preparation, candidate assembly, publication and repair are covered. Complete Dataset conflict/rebase/retry/readback behavior, namespace authority and end-to-end recovery remain pending.'
  }
};
v.previous_goal_turn_classification = 'progress';
v.checks.final_source_status = {
  head: execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim(),
  clean: execFileSync('git', ['status', '--porcelain=v1', '--untracked-files=all'], {cwd: root, encoding: 'utf8'}).trim() === ''
};
const refresh = read('analysis/iteration-066-status-refresh.json');
v.checks.verify_corrections = {
  changes: 1, random_claim_mismatches: 0, random_claim_clarifications: 1,
  derived_symbols_synchronized: correction.derived_symbols_synchronized,
  explanation: 'Made stats_schema root cardinality explicit per input pair in one canonical file and one derived symbol. No source change.',
  evidence: 'analysis/iteration-066-verify-corrections.json', recheck: 'verification/iteration-066-correction-recheck.json',
  analysis_status_refreshes: 'analysis/iteration-066-status-refresh.json',
  analysis_status_refresh_count: refresh.changes.length,
  analysis_canonical_files_refreshed: refresh.canonical_files,
  analysis_derived_symbols_synchronized: refresh.derived_symbols_synchronized
};
v.checks.initial_cross_links = structuredClone(v.checks.cross_links);
v.overall_pass = false;
write(destination, v);
const manifest = read('MANIFEST.json');
const pendingFileFixtures = manifest.files.filter(f => f.path.startsWith('rust/lance-file/') && f.status === 'pending');
if (pendingFileFixtures.length !== 5 || pendingFileFixtures.some(f => f.representation !== 'binary')) throw Error('Next fixture scope differs');
const selected = pendingFileFixtures.filter(f => /v2_0_(mini|self_described)\.lance$/.test(f.path));
if (selected.length !== 2 || selected.reduce((n, f) => n + f.size, 0) !== 46038) throw Error('Embedded fixture scope differs');
const next = 'ANALYZE67: completely interpret the two embedded V2_0 fixtures, v2_0_mini.lance (22961 bytes) and v2_0_self_described.lance (23077 bytes). Read every byte through offline KB-side parsing, map footer/schema/global buffers/page encodings/data/nulls/padding, independently verify decoded values and layout, and author all byte ranges across L0-L4 before marking analyzed. Use already-analyzed generator/file-format source and narrowly read encoding dependencies where required; preserve their pending status until fully authored. Do not count opaque dumps, hashes or generic region labels as semantic coverage. Follow with VERIFY67. Then continue remaining standard V2_0/V2_1/V2_2 fixtures and all other repository files. No source writes, repository generators/builds/tests, installations or network.';
write('iteration-state.json', {
  iteration: 67, phase: 'ANALYZE', completed: false, previous_verification: destination, totals: v.totals,
  read_not_analyzed: read('analysis/iteration-066-contextual-reads.json'), next,
  next_files: selected.map(({path, size, line_count, representation}) => ({path, size, line_count, representation})),
  remaining_file_fixtures: pendingFileFixtures.map(({path, size}) => ({path, size})),
  acceptance_gaps: ['1886 files pending', '293 binary files pending', 'all five complete KB-only answers fail', 'Modern encoding/IO implementations, Dataset and language bindings remain pending']
});
fs.appendFileSync('verification-log.md', `
## Iteration 66 — ANALYZE then VERIFY — FAIL (global coverage/self-sufficiency)

- Added complete V1 fixture interpretation: 387,133 bytes in 78 contiguous authored regions, all 4,097 decoded rows, every offset and all 30 page-table cells. [Analysis](analysis/iteration-066-batch.json), [fixture supplement](L1-modules/rust-lance-file-binary-fixtures.md), [byte evidence](analysis/iteration-066-v1-fixture.json), [read evidence](analysis/iteration-066-read-evidence.json). The [independent reconstruction](verification/iteration-066-v1-reconstruction.json) matches every source/preserved byte and every decoded row. No Lance runtime or historical generator was executed.
- [VERIFY66](verification/iteration-066.json), seed ${v.seed}: source inventory hashes, source cleanliness and full text/byte accountability PASS for 173 files / 92,307 text lines / 387,133 binary bytes. File crate 51/56 entries: 25,581 text lines plus one binary. Source clean at ${v.checks.final_source_status.head}. Previous goal turn classified progress; no internet, source edits/builds/tests/lint/benchmarks, repository generators or installations.
- Line accountability: 45 fresh sampled files / 645 declaration mappings pass. [Audit](verification/iteration-066-top-level-audit.json); both [declaration-free files](verification/iteration-066-no-items.json) reread in full. All mappings were printed completely. A truncated broad gate search was recovered by the complete test span. No truncated output supplied new source coverage. No sampled binary; separate exhaustive reconstruction verifies the newly analyzed fixture.
- Accuracy: 19 unchanged claims and one per-input root-cardinality clarification; all 20 pass after [clarification](analysis/iteration-066-verify-corrections.json) and [recheck](verification/iteration-066-correction-recheck.json). One canonical file and one derived symbol synchronized. [Fresh claims](verification/iteration-066-fresh-claim-reads.json), [supplemental evidence](verification/iteration-066-supplemental-source.json). ANALYZE also recorded [13 status refreshes](analysis/iteration-066-status-refresh.json), three canonical files and 11 synchronized symbols.
- Initial integrity PASS: 19,591 citations / 11,858 links. The final [integrity report](verification/iteration-066-post-correction.json) includes all checkpoint links and binary byte citations. Symbol index remains 7,066 records across 155 files: 971 protobuf, 6,089 Rust and six Python fixture-generator records.
- Global coverage FAIL: 1,886 files, including 293 binaries, remain pending. All five complete KB-only answers remain FAIL. Decision: ANALYZE67 covers the two embedded V2_0 fixtures, then remaining file fixtures and modern encoding. Goal active and INCOMPLETE; no completion report.
`);
let overview = fs.readFileSync('README.md', 'utf8');
const checkpoint = overview.indexOf('## Current checkpoint');
if (checkpoint < 0) throw Error('README checkpoint missing');
overview = overview.slice(0, checkpoint) + `## Current checkpoint

173 of 2,059 files and 92,307 of 1,166,813 inventory text lines are analyzed, plus one binary fixture containing 387,133 fully interpreted bytes. Covered scope includes all 15 protobuf-subsystem files, all 48 lance-core files, all 54 lance-table entries, 51 lance-file entries and five other contributor guides. The symbol index has 7,066 records (971 protobuf, 6,089 Rust and six Python fixture-generator symbols). Another 293 binary files remain pending.

Sixty-six VERIFY cycles are recorded. VERIFY66 checked 20 fresh random claims and 645 declaration mappings across 45 sampled files. One cardinality clarification was applied; all 20 claims pass. Full hashes, text and byte ranges, and source cleanliness pass. Final citation/link counts are in the [integrity report](verification/iteration-066-post-correction.json). Global acceptance remains FAIL: 1,886 files and all five complete KB-only answers need further analysis.

The [binary fixture supplement](L1-modules/rust-lance-file-binary-fixtures.md) documents all 78 V1 byte regions, all 30 page-table cells, dictionary/metadata/footer structure and all 4,097 decoded rows, including legacy null normalization. An [independent reconstruction](verification/iteration-066-v1-reconstruction.json) matches every byte and row. This is offline KB-side validation; Lance tests and historical generators were not executed. Next: the two embedded V2_0 fixtures, totaling 46,038 bytes, followed by the remaining standard V2 fixtures.

[Iteration state](iteration-state.json) and [verification log](verification-log.md) preserve progress. Analysis records retain superseded drafts for provenance; follow each file's current analysis_record in MANIFEST and current L2 document. Source remains read-only; goal active and INCOMPLETE.
`;
fs.writeFileSync('README.md', overview);
console.log(JSON.stringify({claims: 20, clarifications: 1, declarations: count, samples: audit.length, totals: v.totals, next: 67, overall_pass: false, source: v.checks.final_source_status}, null, 2));
