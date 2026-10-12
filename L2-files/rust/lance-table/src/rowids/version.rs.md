> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-table/src/rowids/version.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `085a025118f8ad3080795946908f3eb0681c664147da9fbb73f6889890b79f83`. Reviewed physical lines: 1-1134.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public positional dataset-version runs, inline/column metadata codecs and synchronous fragment-update helpers; crate-internal range cursor. (rust/lance-table/src/rowids/version.rs:1-1134)

## Complete range analysis

### Lines 1-24

SPDX/module purpose and imports: HashMap, Range, Arc, core Error/Result/DeepSizeOf, prost Message, custom serde traits, Fragment/generated protobuf, U64Segment, RowIdSequence and read_row_ids. Dataset update version is not a file-format version or stable row ID. The module is public through rowids::version (rust/lance-table/src/rowids.rs:17-24). (rust/lance-table/src/rowids/version.rs:1-24)

### Lines 25-43

LoadedRowLineage is public Debug/Clone/Default with optional Arc row_ids, created_at and last_updated_at sequences. SpilledRowLineage aliases HashMap<u64,LoadedRowLineage> keyed by fragment ID. The contract says an IO-capable caller preloads spilled sequences because synchronous manifest construction has no store; inline sequences need not be included. Defaults are all None/empty map; no loader, validation, timestamp or IO is implemented by these declarations. (rust/lance-table/src/rowids/version.rs:25-43)

### Lines 44-71

RowDatasetVersionRun derives Debug/Clone/PartialEq/Eq/DeepSizeOf with public span:U64Segment and version:u64. Docs define span over positional offsets rather than stable IDs, enabling alignment with RowIdSequence order. len()->usize and is_empty delegate to span; version copies the scalar. Direct construction permits arbitrary segment shape/values, including empty runs; no invariant validator here. (rust/lance-table/src/rowids/version.rs:44-71)

### Lines 72-99

RowDatasetVersionSequence derives Debug/Clone/PartialEq/Eq/DeepSizeOf/Default around public Vec<RowDatasetVersionRun>. RowDatasetVersionCursor is pub(crate), Debug/Default, with private run index, intra-run offset, absolute position, optional cached run length, optional Vec run starts and indexed total; tests add seek counter. Cursor does not borrow, identify or hash its source sequence, so reuse assumes the same unchanged sequence. (rust/lance-table/src/rowids/version.rs:72-99)

### Lines 100-120

Private seek_indexed lazily builds one start offset per run and total length by ordinary usize additions. This allocates O(number of runs) memory once; it does not rebuild when another/mutated sequence is supplied. Empty runs produce duplicate starts. Construction calls general run.len, and overflow/malformed segment arithmetic is not checked here. (rust/lance-table/src/rowids/version.rs:100-120)

### Lines 121-146

Indexed seek rejects position>=cached total with Internal text containing position and total. Otherwise unwrap cached starts, binary-search position or take preceding start, then advance across every following start<=position to skip duplicate starts/empty runs. Sets run index, relative offset and position, clears cached length, increments test counter. Bounds failure may leave a newly built index installed but does not set a new position. (rust/lance-table/src/rowids/version.rs:121-146)

### Lines 147-167

current_run repeatedly gets the current run, caching its length. Range fast path uses (end-start) as usize; all other spans delegate len. If offset>=length, advance run and reset offset/cache until a usable run or None. It skips any number of empty runs and never consults absolute span positions for ordering. Range subtraction/cast and index increments are ordinary arithmetic; malformed reverse ranges are not rejected here. (rust/lance-table/src/rowids/version.rs:147-167)

### Lines 168-195

extend_range appends to caller Vec. Empty or reversed Range<usize> returns Ok immediately without validating bounds or moving cursor. A backwards start triggers indexed seek; after an index exists, every non-adjacent start in either direction uses it. Before indexing, forward gaps advance run lengths in place without output, returning Internal if exhausted. Existing cursor/output is not reset or cleared. (rust/lance-table/src/rowids/version.rs:168-195)

### Lines 196-211

For each selected portion, current_run yields version/length and repeat_n appends count=min(request remainder,run remainder), then advances position/offset. Exhaustion returns Internal at current consumed position; output and cursor may already contain partial progress. No reserve, cancellation or async boundary. Adjacent traversal costs visited runs plus emitted values; repeated unindexed forward scanning is monotonic, indexed jumps add binary-search work. (rust/lance-table/src/rowids/version.rs:196-211)

### Lines 212-229

new returns no runs. from_uniform_row_count(row_count:u64,version) returns empty for zero, otherwise exactly one Range(0..row_count) run. It neither checks fragment maximum count/usize fit nor rejects any version, and allocates only the run vector rather than per-row versions. (rust/lance-table/src/rowids/version.rs:212-229)

### Lines 230-251

from_versions scans adjacent u64 values, emits a Range for each change and one final run if nonempty. Spans use global slice positions starting0, versions are exact values; empty input gives empty, uniform input one run. O(input rows) scan and up to O(rows) runs; usize indices/length cast to u64 without checked conversion. It merges adjacent equal values only, not equal values separated by others. (rust/lance-table/src/rowids/version.rs:230-251)

### Lines 252-271

len sums run.len() cast to u64 with ordinary addition. is_empty is true for no runs or all-empty runs. versions constructs a borrowing VersionsIter; cursor returns a default unbound cursor and does not inspect self. Public runs remain mutable and no cached index lives in the sequence itself. (rust/lance-table/src/rowids/version.rs:252-271)

### Lines 272-284

version_at linearly accumulates usize run lengths and returns the first run whose cumulative end exceeds index, else None. It ignores span numeric values and gaps, using concatenated positional lengths; zero-length runs contribute nothing. Cost O(visited runs), ordinary offset+length arithmetic, no random-access index in this method. (rust/lance-table/src/rowids/version.rs:272-284)

### Lines 285-300

get_version_for_row_id scans RowIdSequence segments in stored order, first checks segment bounding range contains the ID and then position(row_id). On first match it calls version_at(prefix lengths+local position), otherwise adds segment length and continues. It does not assert equal row-ID/version lengths or unique IDs. Segment range supplies stored bounds and position then checks actual presence (rust/lance-table/src/rowids/segment.rs:360-431); no whole-dataset lookup or IO occurs. (rust/lance-table/src/rowids/version.rs:285-300)

### Lines 301-313

rows_with_version_greater_than zips row_ids.iter with lazy versions, filters strictly greater than threshold and collects owned Vec IDs. Zip silently stops at the shorter iterator, with no alignment error. It preserves row-ID iteration order and includes no deletion filtering beyond what supplied sequences already encode. VersionsIter empty-run caveat applies. (rust/lance-table/src/rowids/version.rs:301-313)

### Lines 314-342

mask consumes u32 positions once, tracks cumulative original run lengths before mutating each run and passes relative positions to span.mask. It implicitly needs ascending valid positions, but does not sort, deduplicate or validate them; a later position below the current run start can underflow subtraction. Remaining positions at/above final cutoff are ignored. Removes empty spans afterward, does not merge equal-version neighbors or rebase surviving span values, and always returns Ok locally. Segment mask is now covered: list cardinality equal to segment length clears all regardless of entries, and other paths assume ordered unique in-bounds positions (rust/lance-table/src/rowids/segment.rs:694-746). (rust/lance-table/src/rowids/version.rs:314-342)

### Lines 343-374

Public VersionsIter borrows runs and stores private run index, remaining count and current value. new initializes zeros then advance_run loads only the current run, or leaves remaining0 at exhaustion. It does not skip empty runs in advance_run. No allocation, size_hint override or ExactSize/DoubleEnded/FusedIterator implementation appears. (rust/lance-table/src/rowids/version.rs:343-374)

### Lines 375-391

Iterator::next advances by at most one run when remaining count is0, returning None if beyond the list; otherwise it loads that run, saturating-decrements count and returns the version even if the loaded run is empty. Thus [length1/version7,length0/version9] expands to [7,9], a source-derived counterexample not executed here. Consecutive empty runs can likewise emit phantom values. This differs from cursor/version_at, which skip empty spans. (rust/lance-table/src/rowids/version.rs:375-391)

### Lines 392-419

RowDatasetVersionMeta derives Debug/Clone/equality/DeepSizeOf: Inline(Arc<[u8]>) shares encoded bytes; Column is an empty marker locating reserved creation/update hidden fields via Fragment::row_lineage_file. Column requires IO through a dataset loader; this type stores no path or count. Private serde ColumnMarker has no fields, defining the empty-object column arm. (rust/lance-table/src/rowids/version.rs:392-419)

### Lines 420-442

Serialize creates an untagged local Helper: Inline {inline:&[u8]} or Column {column:ColumnMarker}. JSON inline is a numeric byte sequence under inline; column is {column:{}}. Bytes are borrowed for serialization, not decoded. Serializer failures propagate; local helper variants exist only within serialize. (rust/lance-table/src/rowids/version.rs:420-442)

### Lines 443-462

Deserialize uses untagged local Helper with Vec<u8> or empty marker, then allocates Arc::from(inline) or returns Column. It does not decode/validate version bytes, intern equivalent payloads or require a dataset context. No deny_unknown_fields annotation is present; exact unknown-field/ambiguous-arm acceptance delegates serde. (rust/lance-table/src/rowids/version.rs:443-462)

### Lines 463-484

from_sequence writes protobuf bytes and wraps Arc, returning Ok with no explicit Result error branch. load_sequence decodes Inline; Column returns NotSupported explaining fragment metadata alone cannot decode a data-file column. These synchronous methods perform no IO and no physical-row count validation. (rust/lance-table/src/rowids/version.rs:463-484)

### Lines 485-503

last_updated_at_version_meta_to_pb maps None to absent, Inline to copied Vec bytes under InlineLastUpdatedAtVersions, and Column to an empty RowLineageColumn under ColumnLastUpdatedAtVersions. It returns Option directly, with no validation, feature flag setting or version restamping. (rust/lance-table/src/rowids/version.rs:485-503)

### Lines 504-519

created_at_version_meta_to_pb mirrors the same mapping under creation-version oneof alternatives. Inline bytes are copied and column carries no file metadata. Correct carrier/feature validation belongs to separate metadata and transaction paths. (rust/lance-table/src/rowids/version.rs:504-519)

### Lines 520-536

write_dataset_versions clones every run.span into pb::U64Segment, stores Some(span) and exact version, collects all protobuf runs then encode_to_vec. It returns owned protobuf bytes directly without format prefix, separate version discriminator, checksum or validation. Segment conversion is covered at rust/lance-table/src/rowids/serde.rs:257-299 and panics for standalone Ranges; a directly constructed version span with that variant reaches this panic. This source-derived case was not executed. Clone+protobuf+output buffers can coexist. (rust/lance-table/src/rowids/version.rs:520-536)

### Lines 537-560

read_dataset_versions uses prost decode, mapping malformed protobuf to Internal with Failed to decode RowDatasetVersionSequence text. Every run must have span or Internal Missing positions in RowDatasetVersionRun; U64Segment::try_from errors propagate. Collects decoded runs, preserving order/versions. No cross-run positional normalization, equal-neighbor merge, empty-run filter, unique-row or length-alignment check is performed here. (rust/lance-table/src/rowids/version.rs:537-560)

### Lines 561-589

rechunk_version_sequences consumes owned sequences and u64 chunk sizes plus allow_incomplete. Collects all sizes first and allocates result Vec to that count; flattens owned run vectors through Peekable. Private closures build InvalidInput diagnostics for too few (chunk index, expected size, remaining) and too many runs (processed/expected chunk counts). It returns all output sequences, not a streaming interface. (rust/lance-table/src/rowids/version.rs:561-589)

### Lines 590-612

For each requested chunk create empty output and remaining size, tracking an offset into the current input run across chunks. A zero remaining input length consumes that run and retries. At true exhaustion allow_incomplete breaks, otherwise returns too-few error. Zero-size output chunks skip this loop entirely. Empty input runs are skipped only while a positive output remainder is being filled. (rust/lance-table/src/rowids/version.rs:590-612)

### Lines 613-639

If input remainder exceeds chunk remainder, slice that positional portion, copy its version and retain input run with increased segment_offset. Otherwise consume run, slice its remainder, reset offset and reduce needed count. Slicing delegates U64Segment::slice with unchecked u64->usize casts. No adjacent equal-version coalescing or explicit span rebasing; actual sliced span values follow the segment implementation. Segment slicing retains numeric values through skip/take and reconstruction, silently truncates excess selection and never selects Ranges (rust/lance-table/src/rowids/segment.rs:378-387). (rust/lance-table/src/rowids/version.rs:613-639)

### Lines 640-653

Every requested size produces one output sequence, including short/empty sequences under allow_incomplete and zero-size chunks. After all chunks, any peeked run causes too-many error even if it is empty; allow_incomplete does not permit excess input. Errors discard local outputs but consumed owned input/iterator progress is not recoverable from Result. No checked arithmetic or aggregate length prevalidation. (rust/lance-table/src/rowids/version.rs:640-653)

### Lines 654-679

build_version_meta returns uniform inline metadata only for known positive physical_rows. It panics if row_id_meta is absent, treating presence as stable-ID sanity check without decoding it. physical_rows is authoritative even if row-ID bytes disagree. from_sequence is unwrapped although locally always Ok. Leading comment says no existing metadata, but body never checks existing creation/update metadata; caller decides whether to replace. Zero/unknown physical rows yield None. (rust/lance-table/src/rowids/version.rs:654-679)

### Lines 680-712

Full-fragment rewrite refresh chooses any Some physical_rows first (including0), otherwise inline row-ID decode length using unwrap, Column/absent row IDs as0. Positive count replaces last_updated_at with uniform current version; zero count leaves existing metadata unchanged. It does not require row-ID metadata when count is known, use spilled sequences or touch creation versions. Malformed inline row IDs can panic despite Result return. (rust/lance-table/src/rowids/version.rs:680-712)

### Lines 713-749

Partial refresh documents updated local offsets and preserving untouched versions/default prev_version. Count selection prefers physical_rows, else inline row-ID decode unwrap; unlike full refresh, Column row IDs without physical_rows return NotSupported, and missing row IDs imply0. It does not consult spilled.row_ids to recover unknown count. Zero count later causes a no-op. (rust/lance-table/src/rowids/version.rs:713-749)

### Lines 750-782

Positive-count partial refresh allocates per-row Vec<u64>. Existing Column last-updated metadata requires spilled[fragment.id].last_updated_at or contextual NotSupported; loaded Arc payload is deep-cloned to an owned sequence. Existing Inline decode uses load_sequence().ok(), silently replacing a decode error with prev_version defaults. A decoded/loaded sequence is lazily expanded, truncated to count and padded with prev_version; no length mismatch error. Missing metadata also defaults every row. (rust/lance-table/src/rowids/version.rs:750-782)

### Lines 783-816

Partial refresh assigns current_version only for offsets<len, silently ignores out-of-range positions, and tolerates duplicates/unsorted input. It scans the full version Vec into maximal equal-version Range runs and serializes to Inline before assigning last_updated_at. No monotonic version check, creation metadata change or column-file deletion. Empty updated_offsets still recompresses/replaces metadata when row count>0. Allocation is O(rows+runs+encoded bytes); returned errors before final assignment leave fragment unchanged, though unwrap/allocation panic is possible. (rust/lance-table/src/rowids/version.rs:783-816)

### Lines 817-833

TryFrom last-updated protobuf arm declares Error but both arms return Ok: copied/moved Vec becomes new Arc or empty marker becomes Column. It validates neither payload bytes nor field carrier/flags/count. (rust/lance-table/src/rowids/version.rs:817-833)

### Lines 834-848

TryFrom creation-version protobuf arm has the same infallible local control flow and allocation/validation boundaries. Separate implementations are needed because protobuf uses distinct oneof types. (rust/lance-table/src/rowids/version.rs:834-848)

### Lines 849-864

Private cfg(test) imports parent; JSON test asserts exact column object string and roundtrips it, then roundtrips inline bytes[1,2,3] without interpreting those bytes as a valid sequence. (rust/lance-table/src/rowids/version.rs:849-864)

### Lines 865-889

from_versions fixture checks empty input, uniform[3,3,3] one run/version3/len3, and alternating[1,2,1,2] run versions plus expanded values. It does not directly assert span coordinates. (rust/lance-table/src/rowids/version.rs:865-889)

### Lines 890-915

Random-access fixture uses run spans0..3,0..2,0..1 with versions1/2/3, proving the reader uses concatenated lengths rather than absolute span positions. Checks positions0,2,3,4,5 and out-of-range6. (rust/lance-table/src/rowids/version.rs:890-915)

### Lines 916-952

Partial-refresh fixture creates10,000 alternating single-row runs inline, updates only final offset to3, then asserts length and first two/last two values. Despite test name streams, implementation materializes the per-row vector. This is a correctness fixture, not timing/memory measurement; source tests were not executed. (rust/lance-table/src/rowids/version.rs:916-952)

### Lines 953-975

Protobuf roundtrip uses two overlapping-coordinate Range runs of lengths4 and3 with versions42/99. Asserts two runs,total7,versions at0/5, not exact byte equality or every span field. No corrupt/missing-span case here. (rust/lance-table/src/rowids/version.rs:953-975)

### Lines 976-997

Row-ID lookup fixture pairs IDs10..14 with length2 version8 then length2 version9; asserts all four and absent99. No unsorted/sparse/duplicate/mismatched-length ID fixture locally. (rust/lance-table/src/rowids/version.rs:976-997)

### Lines 998-1035

Cursor fixture includes an empty middle run version99. Adjacent0..2/2..5 plus forward gap7..9 produce exact versions without99; backward1..6 matches expected slice and empty6..6 changes nothing. This exercises cursor empty-run handling, not VersionsIter. (rust/lance-table/src/rowids/version.rs:998-1035)

### Lines 1036-1059

Descending cursor fixture creates10,000 single-row runs and reads one position at a time in reverse, asserting exact reversed values and a10,000-entry index. Does not measure latency or assert seek counter. (rust/lance-table/src/rowids/version.rs:1036-1059)

### Lines 1060-1098

Alternating cursor fixture repeatedly selects last then first position over10,000 runs, asserts exact values/index length and RUNS-1 indexed seeks. First forward read scans without building index; first rewind creates it and subsequent nonadjacent jumps use it. (rust/lance-table/src/rowids/version.rs:1060-1098)

### Lines 1099-1113

Out-of-bounds cursor fixture selects4..5 from length4 and asserts Internal, exact position4/total_len4 diagnostic substring and unchanged empty output. It does not cover a selection that first appends valid values then overflows. (rust/lance-table/src/rowids/version.rs:1099-1113)

### Lines 1114-1134

Non-range cursor fixture constructs span from[0,2,4,6,8], asserts it is not Range, pairs with three-row version8 span and expects five4s then three8s. Local suite lacks direct mask/rechunk/build/full-refresh, corrupt-inline fallback, unloaded Column, length mismatch, invalid offsets, stale cursor source and VersionsIter empty-run tests; other files may test these but remain pending. (rust/lance-table/src/rowids/version.rs:1114-1134)

## Interaction and interpretation limits

All1,134 lines read in bounded chunks. Public rowids::version and selected format facade reexports are distinguished from pub(crate) cursor. Local RowIdSequence is covered at rust/lance-table/src/rowids.rs:1-2309; transaction/row_version.rs now supplies complete local creation resolution and assignment consumer analysis (rust/lance-table/src/transaction/row_version.rs:1-1461). Dataset loaders, stream consumers and full manifest/retry orchestration remain pending; contextual call sites are not a completed call graph. No source edits, network, builds, tests or benchmarks.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Row version tracking for cross-version diff functionality
    5 | //!
    6 | //! This module provides data structures and functionality to track the latest
    7 | //! update version for each row in a Lance dataset, enabling efficient
    8 | //! cross-version diff operations.
    9 | 
   10 | use std::collections::HashMap;
   11 | use std::{ops::Range, sync::Arc};
   12 | 
   13 | use lance_core::Error;
   14 | use lance_core::Result;
   15 | use lance_core::deepsize::DeepSizeOf;
   16 | use prost::Message;
   17 | use serde::de::Deserializer;
   18 | use serde::ser::Serializer;
   19 | use serde::{Deserialize, Serialize};
   20 | 
   21 | use crate::format::{Fragment, pb};
   22 | use crate::rowids::segment::U64Segment;
   23 | use crate::rowids::{RowIdSequence, read_row_ids};
   24 | 
   25 | /// One fragment's row lineage sequences that live outside the manifest, read
   26 | /// ahead of a commit by the caller.
   27 | ///
   28 | /// Building a manifest is synchronous and has no object store, so it cannot
   29 | /// read a sequence spilled to a data file column (`RowIdMeta::Column`,
   30 | /// `RowDatasetVersionMeta::Column`). A caller that can do IO loads them first
   31 | /// and hands them over in [`ManifestBuildConfig`](crate::format::ManifestBuildConfig).
   32 | /// Only the spilled sequences need to be present; inline ones are decoded on
   33 | /// the spot.
   34 | #[derive(Debug, Clone, Default)]
   35 | pub struct LoadedRowLineage {
   36 |     pub row_ids: Option<Arc<RowIdSequence>>,
   37 |     pub created_at: Option<Arc<RowDatasetVersionSequence>>,
   38 |     pub last_updated_at: Option<Arc<RowDatasetVersionSequence>>,
   39 | }
   40 | 
   41 | /// [`LoadedRowLineage`] per fragment id.
   42 | pub type SpilledRowLineage = HashMap<u64, LoadedRowLineage>;
   43 | 
   44 | /// A run of identical versions over a contiguous span of row positions.
   45 | ///
   46 | /// Span is expressed as a U64Segment over row offsets (0..N within a fragment),
   47 | /// not over row IDs. This keeps the encoding aligned with RowIdSequence order
   48 | /// and enables zipped iteration without building a map.
   49 | #[derive(Debug, Clone, PartialEq, Eq, DeepSizeOf)]
   50 | pub struct RowDatasetVersionRun {
   51 |     pub span: U64Segment,
   52 |     pub version: u64,
   53 | }
   54 | 
   55 | impl RowDatasetVersionRun {
   56 |     /// Number of rows covered by this run.
   57 |     pub fn len(&self) -> usize {
   58 |         self.span.len()
   59 |     }
   60 | 
   61 |     /// Whether this run covers no rows.
   62 |     pub fn is_empty(&self) -> bool {
   63 |         self.span.is_empty()
   64 |     }
   65 | 
   66 |     /// The version value of this run.
   67 |     pub fn version(&self) -> u64 {
   68 |         self.version
   69 |     }
   70 | }
   71 | 
   72 | /// Sequence of dataset versions
   73 | ///
   74 | /// Stores version runs aligned to the positional order of RowIdSequence.
   75 | /// Provides sequential iterators and optional lightweight indexing for
   76 | /// efficient random access.
   77 | #[derive(Debug, Clone, PartialEq, Eq, DeepSizeOf, Default)]
   78 | pub struct RowDatasetVersionSequence {
   79 |     pub runs: Vec<RowDatasetVersionRun>,
   80 | }
   81 | 
   82 | /// A reusable cursor for reading ranges from a version sequence in one pass.
   83 | ///
   84 | /// The cursor caches the current run length. Readers normally request adjacent
   85 | /// batches, so this avoids rebuilding all run offsets and rescanning the run
   86 | /// prefix for every batch. A backwards selection lazily builds a run-offset
   87 | /// index. Once built, non-adjacent selections use it in either direction.
   88 | #[derive(Debug, Default)]
   89 | pub(crate) struct RowDatasetVersionCursor {
   90 |     run_index: usize,
   91 |     offset_in_run: usize,
   92 |     position: usize,
   93 |     run_len: Option<usize>,
   94 |     run_offsets: Option<Vec<usize>>,
   95 |     indexed_total_len: usize,
   96 |     #[cfg(test)]
   97 |     indexed_seek_count: usize,
   98 | }
   99 | 
  100 | impl RowDatasetVersionCursor {
  101 |     fn seek_indexed(
  102 |         &mut self,
  103 |         sequence: &RowDatasetVersionSequence,
  104 |         position: usize,
  105 |     ) -> Result<()> {
  106 |         if self.run_offsets.is_none() {
  107 |             let mut total_len = 0;
  108 |             let run_offsets = sequence
  109 |                 .runs
  110 |                 .iter()
  111 |                 .map(|run| {
  112 |                     let offset = total_len;
  113 |                     total_len += run.len();
  114 |                     offset
  115 |                 })
  116 |                 .collect();
  117 |             self.run_offsets = Some(run_offsets);
  118 |             self.indexed_total_len = total_len;
  119 |         }
  120 | 
  121 |         if position >= self.indexed_total_len {
  122 |             return Err(Error::internal(format!(
  123 |                 "version column position {} out of range (total_len={})",
  124 |                 position, self.indexed_total_len
  125 |             )));
  126 |         }
  127 | 
  128 |         let run_offsets = self.run_offsets.as_ref().unwrap();
  129 |         let mut run_index = match run_offsets.binary_search(&position) {
  130 |             Ok(run_index) => run_index,
  131 |             Err(run_index) => run_index - 1,
  132 |         };
  133 |         while run_index + 1 < run_offsets.len() && run_offsets[run_index + 1] <= position {
  134 |             run_index += 1;
  135 |         }
  136 |         self.run_index = run_index;
  137 |         self.offset_in_run = position - run_offsets[run_index];
  138 |         self.position = position;
  139 |         self.run_len = None;
  140 |         #[cfg(test)]
  141 |         {
  142 |             self.indexed_seek_count += 1;
  143 |         }
  144 |         Ok(())
  145 |     }
  146 | 
  147 |     fn current_run<'a>(
  148 |         &mut self,
  149 |         sequence: &'a RowDatasetVersionSequence,
  150 |     ) -> Option<(&'a RowDatasetVersionRun, usize)> {
  151 |         loop {
  152 |             let run = sequence.runs.get(self.run_index)?;
  153 |             let run_len = *self.run_len.get_or_insert_with(|| match &run.span {
  154 |                 // Version runs are normally positional ranges. Keep this hot
  155 |                 // path local instead of using the general segment length path.
  156 |                 U64Segment::Range(range) => (range.end - range.start) as usize,
  157 |                 span => span.len(),
  158 |             });
  159 |             if self.offset_in_run < run_len {
  160 |                 return Some((run, run_len));
  161 |             }
  162 |             self.run_index += 1;
  163 |             self.offset_in_run = 0;
  164 |             self.run_len = None;
  165 |         }
  166 |     }
  167 | 
  168 |     /// Append the versions in `selection` to `versions`.
  169 |     pub(crate) fn extend_range(
  170 |         &mut self,
  171 |         sequence: &RowDatasetVersionSequence,
  172 |         selection: Range<usize>,
  173 |         versions: &mut Vec<u64>,
  174 |     ) -> Result<()> {
  175 |         if selection.is_empty() {
  176 |             return Ok(());
  177 |         }
  178 |         if selection.start < self.position
  179 |             || (self.run_offsets.is_some() && selection.start != self.position)
  180 |         {
  181 |             self.seek_indexed(sequence, selection.start)?;
  182 |         }
  183 | 
  184 |         while self.position < selection.start {
  185 |             let Some((_, run_len)) = self.current_run(sequence) else {
  186 |                 return Err(Error::internal(format!(
  187 |                     "version column position {} out of range (total_len={})",
  188 |                     selection.start, self.position
  189 |                 )));
  190 |             };
  191 |             let advance = (selection.start - self.position).min(run_len - self.offset_in_run);
  192 |             self.offset_in_run += advance;
  193 |             self.position += advance;
  194 |         }
  195 | 
  196 |         while self.position < selection.end {
  197 |             let Some((run, run_len)) = self.current_run(sequence) else {
  198 |                 return Err(Error::internal(format!(
  199 |                     "version column position {} out of range (total_len={})",
  200 |                     self.position, self.position
  201 |                 )));
  202 |             };
  203 |             let count = (selection.end - self.position).min(run_len - self.offset_in_run);
  204 |             versions.extend(std::iter::repeat_n(run.version(), count));
  205 |             self.offset_in_run += count;
  206 |             self.position += count;
  207 |         }
  208 |         Ok(())
  209 |     }
  210 | }
  211 | 
  212 | impl RowDatasetVersionSequence {
  213 |     /// Create a new empty version sequence
  214 |     pub fn new() -> Self {
  215 |         Self { runs: Vec::new() }
  216 |     }
  217 | 
  218 |     /// Create a version sequence with a single uniform run of `row_count` rows.
  219 |     pub fn from_uniform_row_count(row_count: u64, version: u64) -> Self {
  220 |         if row_count == 0 {
  221 |             return Self::new();
  222 |         }
  223 |         let run = RowDatasetVersionRun {
  224 |             span: U64Segment::Range(0..row_count),
  225 |             version,
  226 |         };
  227 |         Self { runs: vec![run] }
  228 |     }
  229 | 
  230 |     /// Run-length encode one version per row, in row offset order.
  231 |     pub fn from_versions(versions: &[u64]) -> Self {
  232 |         let mut runs = Vec::new();
  233 |         let mut run_start = 0u64;
  234 |         for (i, window) in versions.windows(2).enumerate() {
  235 |             if window[0] != window[1] {
  236 |                 runs.push(RowDatasetVersionRun {
  237 |                     span: U64Segment::Range(run_start..i as u64 + 1),
  238 |                     version: window[0],
  239 |                 });
  240 |                 run_start = i as u64 + 1;
  241 |             }
  242 |         }
  243 |         if let Some(last) = versions.last() {
  244 |             runs.push(RowDatasetVersionRun {
  245 |                 span: U64Segment::Range(run_start..versions.len() as u64),
  246 |                 version: *last,
  247 |             });
  248 |         }
  249 |         Self { runs }
  250 |     }
  251 | 
  252 |     /// Number of rows tracked by this sequence (sum of run lengths).
  253 |     pub fn len(&self) -> u64 {
  254 |         self.runs.iter().map(|s| s.len() as u64).sum()
  255 |     }
  256 | 
  257 |     /// Empty if there are no runs or all runs are empty.
  258 |     pub fn is_empty(&self) -> bool {
  259 |         self.runs.is_empty() || self.runs.iter().all(|s| s.is_empty())
  260 |     }
  261 | 
  262 |     /// Returns a forward iterator over versions, expanding runs lazily.
  263 |     pub fn versions(&self) -> VersionsIter<'_> {
  264 |         VersionsIter::new(&self.runs)
  265 |     }
  266 | 
  267 |     /// Create a reusable cursor for sequential range reads.
  268 |     pub(crate) fn cursor(&self) -> RowDatasetVersionCursor {
  269 |         RowDatasetVersionCursor::default()
  270 |     }
  271 | 
  272 |     /// Random access: get the version at global row position `index`.
  273 |     pub fn version_at(&self, index: usize) -> Option<u64> {
  274 |         let mut offset = 0usize;
  275 |         for run in &self.runs {
  276 |             let len = run.len();
  277 |             if index < offset + len {
  278 |                 return Some(run.version());
  279 |             }
  280 |             offset += len;
  281 |         }
  282 |         None
  283 |     }
  284 | 
  285 |     /// Get the version associated with a specific row id.
  286 |     /// This reconstructs the positional offset from RowIdSequence and then
  287 |     /// performs `version_at` lookup.
  288 |     pub fn get_version_for_row_id(&self, row_ids: &RowIdSequence, row_id: u64) -> Option<u64> {
  289 |         let mut offset = 0usize;
  290 |         for seg in &row_ids.0 {
  291 |             if seg.range().is_some_and(|r| r.contains(&row_id))
  292 |                 && let Some(local) = seg.position(row_id)
  293 |             {
  294 |                 return self.version_at(offset + local);
  295 |             }
  296 |             offset += seg.len();
  297 |         }
  298 |         None
  299 |     }
  300 | 
  301 |     /// Convenience: collect row IDs with version strictly greater than `threshold`.
  302 |     pub fn rows_with_version_greater_than(
  303 |         &self,
  304 |         row_ids: &RowIdSequence,
  305 |         threshold: u64,
  306 |     ) -> Vec<u64> {
  307 |         row_ids
  308 |             .iter()
  309 |             .zip(self.versions())
  310 |             .filter_map(|(rid, v)| if v > threshold { Some(rid) } else { None })
  311 |             .collect()
  312 |     }
  313 | 
  314 |     /// Delete rows by positional offsets (e.g., from a deletion vector)
  315 |     pub fn mask(&mut self, positions: impl IntoIterator<Item = u32>) -> Result<()> {
  316 |         let mut local_positions: Vec<u32> = Vec::new();
  317 |         let mut positions_iter = positions.into_iter();
  318 |         let mut curr_position = positions_iter.next();
  319 |         let mut offset: usize = 0;
  320 |         let mut cutoff: usize = 0;
  321 | 
  322 |         for run in self.runs.iter_mut() {
  323 |             cutoff += run.span.len();
  324 |             while let Some(position) = curr_position {
  325 |                 if position as usize >= cutoff {
  326 |                     break;
  327 |                 }
  328 |                 local_positions.push(position - offset as u32);
  329 |                 curr_position = positions_iter.next();
  330 |             }
  331 | 
  332 |             if !local_positions.is_empty() {
  333 |                 run.span.mask(local_positions.as_slice());
  334 |                 local_positions.clear();
  335 |             }
  336 |             offset = cutoff;
  337 |         }
  338 | 
  339 |         self.runs.retain(|r| !r.span.is_empty());
  340 |         Ok(())
  341 |     }
  342 | }
  343 | 
  344 | /// Iterator over versions expanding runs lazily.
  345 | pub struct VersionsIter<'a> {
  346 |     runs: &'a [RowDatasetVersionRun],
  347 |     run_idx: usize,
  348 |     remaining_in_run: usize,
  349 |     current_version: u64,
  350 | }
  351 | 
  352 | impl<'a> VersionsIter<'a> {
  353 |     fn new(runs: &'a [RowDatasetVersionRun]) -> Self {
  354 |         let mut it = Self {
  355 |             runs,
  356 |             run_idx: 0,
  357 |             remaining_in_run: 0,
  358 |             current_version: 0,
  359 |         };
  360 |         it.advance_run();
  361 |         it
  362 |     }
  363 | 
  364 |     fn advance_run(&mut self) {
  365 |         if self.run_idx < self.runs.len() {
  366 |             let run = &self.runs[self.run_idx];
  367 |             self.remaining_in_run = run.len();
  368 |             self.current_version = run.version();
  369 |         } else {
  370 |             self.remaining_in_run = 0;
  371 |         }
  372 |     }
  373 | }
  374 | 
  375 | impl<'a> Iterator for VersionsIter<'a> {
  376 |     type Item = u64;
  377 | 
  378 |     fn next(&mut self) -> Option<Self::Item> {
  379 |         if self.remaining_in_run == 0 {
  380 |             // Move to next run
  381 |             self.run_idx += 1;
  382 |             if self.run_idx >= self.runs.len() {
  383 |                 return None;
  384 |             }
  385 |             self.advance_run();
  386 |         }
  387 |         self.remaining_in_run = self.remaining_in_run.saturating_sub(1);
  388 |         Some(self.current_version)
  389 |     }
  390 | }
  391 | 
  392 | /// Metadata about the location of dataset version sequence data
  393 | /// Following the same pattern as RowIdMeta
  394 | ///
  395 | /// When stored inline, identical byte sequences are shared across fragments
  396 | /// via `Arc<[u8]>` to reduce manifest memory for large tables.
  397 | #[derive(Debug, Clone, PartialEq, Eq, DeepSizeOf)]
  398 | pub enum RowDatasetVersionMeta {
  399 |     /// Small sequences stored inline in the fragment metadata
  400 |     Inline(Arc<[u8]>),
  401 |     /// The sequence is spilled to a hidden column of one of the fragment's
  402 |     /// data files, one version per physical row in offset order, at
  403 |     /// [`ROW_CREATED_AT_VERSION_FIELD_ID`](crate::format::ROW_CREATED_AT_VERSION_FIELD_ID)
  404 |     /// or
  405 |     /// [`ROW_LAST_UPDATED_AT_VERSION_FIELD_ID`](crate::format::ROW_LAST_UPDATED_AT_VERSION_FIELD_ID)
  406 |     /// depending on which sequence this is; see
  407 |     /// [`Fragment::row_lineage_file`](crate::format::Fragment::row_lineage_file).
  408 |     /// Reading it needs IO, so it goes through the dataset's loader rather
  409 |     /// than [`Self::load_sequence`].
  410 |     Column,
  411 | }
  412 | 
  413 | /// The JSON form of [`RowDatasetVersionMeta::Column`]: `{"column": {}}`, an
  414 | /// empty object under the arm's name, mirroring the empty `RowLineageColumn`
  415 | /// protobuf message. The name alone tells the arms apart; there is nothing to
  416 | /// carry.
  417 | #[derive(Serialize, Deserialize)]
  418 | struct ColumnMarker {}
  419 | 
  420 | // Custom Serialize: convert Arc<[u8]> to slice for transparent JSON output
  421 | impl Serialize for RowDatasetVersionMeta {
  422 |     fn serialize<S: Serializer>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error> {
  423 |         #[derive(Serialize)]
  424 |         #[serde(untagged)]
  425 |         enum Helper<'a> {
  426 |             Inline { inline: &'a [u8] },
  427 |             Column { column: ColumnMarker },
  428 |         }
  429 | 
  430 |         match self {
  431 |             Self::Inline(data) => Helper::Inline {
  432 |                 inline: data.as_ref(),
  433 |             }
  434 |             .serialize(serializer),
  435 |             Self::Column => Helper::Column {
  436 |                 column: ColumnMarker {},
  437 |             }
  438 |             .serialize(serializer),
  439 |         }
  440 |     }
  441 | }
  442 | 
  443 | // Custom Deserialize: read Vec<u8> and convert to Arc<[u8]>
  444 | impl<'de> Deserialize<'de> for RowDatasetVersionMeta {
  445 |     fn deserialize<D: Deserializer<'de>>(deserializer: D) -> std::result::Result<Self, D::Error> {
  446 |         #[derive(Deserialize)]
  447 |         #[serde(untagged)]
  448 |         enum Helper {
  449 |             Inline { inline: Vec<u8> },
  450 |             Column { column: ColumnMarker },
  451 |         }
  452 | 
  453 |         match Helper::deserialize(deserializer)? {
  454 |             Helper::Inline { inline } => Ok(Self::Inline(Arc::from(inline))),
  455 |             Helper::Column { column } => {
  456 |                 let ColumnMarker {} = column;
  457 |                 Ok(Self::Column)
  458 |             }
  459 |         }
  460 |     }
  461 | }
  462 | 
  463 | impl RowDatasetVersionMeta {
  464 |     /// Create inline metadata from a version sequence
  465 |     pub fn from_sequence(sequence: &RowDatasetVersionSequence) -> lance_core::Result<Self> {
  466 |         let bytes = write_dataset_versions(sequence);
  467 |         Ok(Self::Inline(Arc::from(bytes)))
  468 |     }
  469 | 
  470 |     /// Decode the version sequence stored inline in this metadata.
  471 |     ///
  472 |     /// A sequence stored outside the manifest needs IO to read, which this
  473 |     /// synchronous accessor cannot do; it is an error here and is loaded
  474 |     /// through the dataset instead.
  475 |     pub fn load_sequence(&self) -> lance_core::Result<RowDatasetVersionSequence> {
  476 |         match self {
  477 |             Self::Inline(data) => read_dataset_versions(data),
  478 |             Self::Column => Err(Error::not_supported(
  479 |                 "row version sequence spilled to a data file column cannot be decoded from \
  480 |                  fragment metadata alone",
  481 |             )),
  482 |         }
  483 |     }
  484 | }
  485 | 
  486 | /// Helper function to convert RowDatasetVersionMeta to protobuf format for last_updated_at
  487 | pub fn last_updated_at_version_meta_to_pb(
  488 |     meta: &Option<RowDatasetVersionMeta>,
  489 | ) -> Option<pb::data_fragment::LastUpdatedAtVersionSequence> {
  490 |     meta.as_ref().map(|m| match m {
  491 |         RowDatasetVersionMeta::Inline(data) => {
  492 |             pb::data_fragment::LastUpdatedAtVersionSequence::InlineLastUpdatedAtVersions(
  493 |                 data.to_vec(),
  494 |             )
  495 |         }
  496 |         RowDatasetVersionMeta::Column => {
  497 |             pb::data_fragment::LastUpdatedAtVersionSequence::ColumnLastUpdatedAtVersions(
  498 |                 pb::RowLineageColumn {},
  499 |             )
  500 |         }
  501 |     })
  502 | }
  503 | 
  504 | /// Helper function to convert RowDatasetVersionMeta to protobuf format for created_at
  505 | pub fn created_at_version_meta_to_pb(
  506 |     meta: &Option<RowDatasetVersionMeta>,
  507 | ) -> Option<pb::data_fragment::CreatedAtVersionSequence> {
  508 |     meta.as_ref().map(|m| match m {
  509 |         RowDatasetVersionMeta::Inline(data) => {
  510 |             pb::data_fragment::CreatedAtVersionSequence::InlineCreatedAtVersions(data.to_vec())
  511 |         }
  512 |         RowDatasetVersionMeta::Column => {
  513 |             pb::data_fragment::CreatedAtVersionSequence::ColumnCreatedAtVersions(
  514 |                 pb::RowLineageColumn {},
  515 |             )
  516 |         }
  517 |     })
  518 | }
  519 | 
  520 | /// Serialize a dataset version sequence to a buffer (following RowIdSequence pattern)
  521 | pub fn write_dataset_versions(sequence: &RowDatasetVersionSequence) -> Vec<u8> {
  522 |     // Convert to protobuf sequence
  523 |     let pb_sequence = pb::RowDatasetVersionSequence {
  524 |         runs: sequence
  525 |             .runs
  526 |             .iter()
  527 |             .map(|run| pb::RowDatasetVersionRun {
  528 |                 span: Some(pb::U64Segment::from(run.span.clone())),
  529 |                 version: run.version,
  530 |             })
  531 |             .collect(),
  532 |     };
  533 | 
  534 |     pb_sequence.encode_to_vec()
  535 | }
  536 | 
  537 | /// Deserialize a dataset version sequence from bytes (following RowIdSequence pattern)
  538 | pub fn read_dataset_versions(data: &[u8]) -> lance_core::Result<RowDatasetVersionSequence> {
  539 |     let pb_sequence = pb::RowDatasetVersionSequence::decode(data).map_err(|e| {
  540 |         Error::internal(format!("Failed to decode RowDatasetVersionSequence: {}", e))
  541 |     })?;
  542 | 
  543 |     let segments = pb_sequence
  544 |         .runs
  545 |         .into_iter()
  546 |         .map(|pb_run| {
  547 |             let positions_pb = pb_run.span.ok_or_else(|| {
  548 |                 Error::internal("Missing positions in RowDatasetVersionRun".to_string())
  549 |             })?;
  550 |             let segment = U64Segment::try_from(positions_pb)?;
  551 |             Ok(RowDatasetVersionRun {
  552 |                 span: segment,
  553 |                 version: pb_run.version,
  554 |             })
  555 |         })
  556 |         .collect::<Result<Vec<_>>>()?;
  557 | 
  558 |     Ok(RowDatasetVersionSequence { runs: segments })
  559 | }
  560 | 
  561 | /// Re-chunk a sequence of dataset version runs into new chunk sizes (aligned with RowIdSequence rechunking)
  562 | pub fn rechunk_version_sequences(
  563 |     sequences: impl IntoIterator<Item = RowDatasetVersionSequence>,
  564 |     chunk_sizes: impl IntoIterator<Item = u64>,
  565 |     allow_incomplete: bool,
  566 | ) -> Result<Vec<RowDatasetVersionSequence>> {
  567 |     let chunk_sizes_vec: Vec<u64> = chunk_sizes.into_iter().collect();
  568 |     let total_chunks = chunk_sizes_vec.len();
  569 |     let mut chunked_sequences: Vec<RowDatasetVersionSequence> = Vec::with_capacity(total_chunks);
  570 | 
  571 |     let mut run_iter = sequences
  572 |         .into_iter()
  573 |         .flat_map(|sequence| sequence.runs.into_iter())
  574 |         .peekable();
  575 | 
  576 |     let too_few_segments_error = |chunk_index: usize, expected_chunk_size: u64, remaining: u64| {
  577 |         Error::invalid_input(format!(
  578 |             "Got too few version runs for chunk {}. Expected chunk size: {}, remaining needed: {}",
  579 |             chunk_index, expected_chunk_size, remaining
  580 |         ))
  581 |     };
  582 | 
  583 |     let too_many_segments_error = |processed_chunks: usize, total_chunk_sizes: usize| {
  584 |         Error::invalid_input(format!(
  585 |             "Got too many version runs for the provided chunk lengths. Processed {} chunks out of {} expected",
  586 |             processed_chunks, total_chunk_sizes
  587 |         ))
  588 |     };
  589 | 
  590 |     let mut segment_offset = 0_u64;
  591 | 
  592 |     for (chunk_index, chunk_size) in chunk_sizes_vec.iter().enumerate() {
  593 |         let chunk_size = *chunk_size;
  594 |         let mut out_seq = RowDatasetVersionSequence::new();
  595 |         let mut remaining = chunk_size;
  596 | 
  597 |         while remaining > 0 {
  598 |             let remaining_in_segment = run_iter
  599 |                 .peek()
  600 |                 .map_or(0, |run| run.span.len() as u64 - segment_offset);
  601 | 
  602 |             if remaining_in_segment == 0 {
  603 |                 if run_iter.next().is_some() {
  604 |                     segment_offset = 0;
  605 |                     continue;
  606 |                 } else if allow_incomplete {
  607 |                     break;
  608 |                 } else {
  609 |                     return Err(too_few_segments_error(chunk_index, chunk_size, remaining));
  610 |                 }
  611 |             }
  612 | 
  613 |             match remaining_in_segment.cmp(&remaining) {
  614 |                 std::cmp::Ordering::Greater => {
  615 |                     let run = run_iter.peek().unwrap();
  616 |                     let seg = run.span.slice(segment_offset as usize, remaining as usize);
  617 |                     out_seq.runs.push(RowDatasetVersionRun {
  618 |                         span: seg,
  619 |                         version: run.version,
  620 |                     });
  621 |                     segment_offset += remaining;
  622 |                     remaining = 0;
  623 |                 }
  624 |                 std::cmp::Ordering::Equal | std::cmp::Ordering::Less => {
  625 |                     let run = run_iter.next().ok_or_else(|| {
  626 |                         too_few_segments_error(chunk_index, chunk_size, remaining)
  627 |                     })?;
  628 |                     let seg = run
  629 |                         .span
  630 |                         .slice(segment_offset as usize, remaining_in_segment as usize);
  631 |                     out_seq.runs.push(RowDatasetVersionRun {
  632 |                         span: seg,
  633 |                         version: run.version,
  634 |                     });
  635 |                     segment_offset = 0;
  636 |                     remaining -= remaining_in_segment;
  637 |                 }
  638 |             }
  639 |         }
  640 | 
  641 |         chunked_sequences.push(out_seq);
  642 |     }
  643 | 
  644 |     if run_iter.peek().is_some() {
  645 |         return Err(too_many_segments_error(
  646 |             chunked_sequences.len(),
  647 |             total_chunks,
  648 |         ));
  649 |     }
  650 | 
  651 |     Ok(chunked_sequences)
  652 | }
  653 | 
  654 | /// Build version metadata for a fragment if it has physical rows and no existing metadata.
  655 | pub fn build_version_meta(
  656 |     fragment: &Fragment,
  657 |     current_version: u64,
  658 | ) -> Option<RowDatasetVersionMeta> {
  659 |     if let Some(physical_rows) = fragment.physical_rows
  660 |         && physical_rows > 0
  661 |     {
  662 |         // Verify row_id_meta exists (sanity check for stable row IDs)
  663 |         if fragment.row_id_meta.is_none() {
  664 |             panic!("Can not find row id meta, please make sure you have enabled stable row id.")
  665 |         }
  666 | 
  667 |         // Use physical_rows directly as the authoritative row count
  668 |         // This is correct even for compacted fragments where row_id_meta might
  669 |         // have been partially copied
  670 |         let version_sequence = RowDatasetVersionSequence::from_uniform_row_count(
  671 |             physical_rows as u64,
  672 |             current_version,
  673 |         );
  674 | 
  675 |         return Some(RowDatasetVersionMeta::from_sequence(&version_sequence).unwrap());
  676 |     }
  677 |     None
  678 | }
  679 | 
  680 | /// Refresh row-level latest update version metadata for a full fragment rewrite-column update.
  681 | ///
  682 | /// This sets a uniform version sequence for all rows in the fragment to `current_version`.
  683 | pub fn refresh_row_latest_update_meta_for_full_frag_rewrite_cols(
  684 |     fragment: &mut Fragment,
  685 |     current_version: u64,
  686 | ) -> Result<()> {
  687 |     let row_count = if let Some(pr) = fragment.physical_rows {
  688 |         pr as u64
  689 |     } else if let Some(row_id_meta) = fragment.row_id_meta.as_ref() {
  690 |         match row_id_meta {
  691 |             crate::format::RowIdMeta::Inline(data) => {
  692 |                 let sequence = read_row_ids(data).unwrap();
  693 |                 sequence.len()
  694 |             }
  695 |             // Follow existing behavior: a sequence that is not inline needs IO
  696 |             // to read, which this synchronous path cannot do.
  697 |             crate::format::RowIdMeta::Column => 0,
  698 |         }
  699 |     } else {
  700 |         0
  701 |     };
  702 | 
  703 |     if row_count > 0 {
  704 |         let version_seq =
  705 |             RowDatasetVersionSequence::from_uniform_row_count(row_count, current_version);
  706 |         let version_meta = RowDatasetVersionMeta::from_sequence(&version_seq)?;
  707 |         fragment.last_updated_at_version_meta = Some(version_meta);
  708 |     }
  709 | 
  710 |     Ok(())
  711 | }
  712 | 
  713 | /// Refresh row-level latest update version metadata for a partial fragment rewrite-column update.
  714 | ///
  715 | /// `updated_offsets` are local row offsets (within the fragment) that have been updated.
  716 | /// Existing version metadata is preserved and only the updated positions are set to `current_version`.
  717 | /// If no existing metadata is present, positions default to `prev_version`.
  718 | ///
  719 | /// A fragment whose existing versions are spilled has them read from
  720 | /// `spilled`; the refreshed sequence is placed inline.
  721 | pub fn refresh_row_latest_update_meta_for_partial_frag_rewrite_cols(
  722 |     fragment: &mut Fragment,
  723 |     updated_offsets: &[usize],
  724 |     current_version: u64,
  725 |     prev_version: u64,
  726 |     spilled: &SpilledRowLineage,
  727 | ) -> Result<()> {
  728 |     // Determine row count for fragment
  729 |     let row_count_u64: u64 = if let Some(pr) = fragment.physical_rows {
  730 |         pr as u64
  731 |     } else if let Some(row_id_meta) = fragment.row_id_meta.as_ref() {
  732 |         match row_id_meta {
  733 |             crate::format::RowIdMeta::Inline(data) => {
  734 |                 let sequence = read_row_ids(data).unwrap();
  735 |                 sequence.len()
  736 |             }
  737 |             // Reading these needs IO, which this synchronous path cannot do.
  738 |             // Reachable only for a fragment that also has no `physical_rows`.
  739 |             crate::format::RowIdMeta::Column => {
  740 |                 return Err(Error::not_supported(
  741 |                     "refreshing row update versions for a fragment whose row id \
  742 |                      sequence is stored outside the manifest",
  743 |                 ));
  744 |             }
  745 |         }
  746 |     } else {
  747 |         0
  748 |     };
  749 | 
  750 |     if row_count_u64 > 0 {
  751 |         // Build base version vector from existing meta or previous dataset version
  752 |         let mut base_versions: Vec<u64> = Vec::with_capacity(row_count_u64 as usize);
  753 |         if let Some(meta) = fragment.last_updated_at_version_meta.as_ref() {
  754 |             let base_seq = if matches!(meta, RowDatasetVersionMeta::Column) {
  755 |                 // The existing versions of the rows this update leaves alone
  756 |                 // live in a data file, which this path cannot read. Defaulting
  757 |                 // them would silently rewrite their lineage, so the caller has
  758 |                 // to have read them ahead of time.
  759 |                 let loaded = spilled
  760 |                     .get(&fragment.id)
  761 |                     .and_then(|lineage| lineage.last_updated_at.clone())
  762 |                     .ok_or_else(|| {
  763 |                         Error::not_supported(format!(
  764 |                             "fragment {} stores its last-updated-at versions outside the \
  765 |                              manifest and they were not loaded ahead of the commit",
  766 |                             fragment.id
  767 |                         ))
  768 |                     })?;
  769 |                 Some(loaded.as_ref().clone())
  770 |             } else {
  771 |                 meta.load_sequence().ok()
  772 |             };
  773 |             if let Some(base_seq) = base_seq {
  774 |                 base_versions.extend(base_seq.versions().take(row_count_u64 as usize));
  775 |                 base_versions.resize(row_count_u64 as usize, prev_version);
  776 |             } else {
  777 |                 base_versions.resize(row_count_u64 as usize, prev_version);
  778 |             }
  779 |         } else {
  780 |             base_versions.resize(row_count_u64 as usize, prev_version);
  781 |         }
  782 | 
  783 |         // Apply updates to updated positions
  784 |         for &pos in updated_offsets {
  785 |             if pos < base_versions.len() {
  786 |                 base_versions[pos] = current_version;
  787 |             }
  788 |         }
  789 | 
  790 |         // Compress into runs
  791 |         let mut runs: Vec<RowDatasetVersionRun> = Vec::new();
  792 |         if !base_versions.is_empty() {
  793 |             let mut start = 0usize;
  794 |             let mut curr_ver = base_versions[0];
  795 |             for (idx, &ver) in base_versions.iter().enumerate().skip(1) {
  796 |                 if ver != curr_ver {
  797 |                     runs.push(RowDatasetVersionRun {
  798 |                         span: U64Segment::Range(start as u64..idx as u64),
  799 |                         version: curr_ver,
  800 |                     });
  801 |                     start = idx;
  802 |                     curr_ver = ver;
  803 |                 }
  804 |             }
  805 |             runs.push(RowDatasetVersionRun {
  806 |                 span: U64Segment::Range(start as u64..base_versions.len() as u64),
  807 |                 version: curr_ver,
  808 |             });
  809 |         }
  810 |         let new_seq = RowDatasetVersionSequence { runs };
  811 |         let new_meta = RowDatasetVersionMeta::from_sequence(&new_seq)?;
  812 |         fragment.last_updated_at_version_meta = Some(new_meta);
  813 |     }
  814 | 
  815 |     Ok(())
  816 | }
  817 | 
  818 | // Protobuf conversion implementations
  819 | impl TryFrom<pb::data_fragment::LastUpdatedAtVersionSequence> for RowDatasetVersionMeta {
  820 |     type Error = Error;
  821 | 
  822 |     fn try_from(value: pb::data_fragment::LastUpdatedAtVersionSequence) -> Result<Self> {
  823 |         match value {
  824 |             pb::data_fragment::LastUpdatedAtVersionSequence::InlineLastUpdatedAtVersions(data) => {
  825 |                 Ok(Self::Inline(Arc::from(data)))
  826 |             }
  827 |             pb::data_fragment::LastUpdatedAtVersionSequence::ColumnLastUpdatedAtVersions(_) => {
  828 |                 Ok(Self::Column)
  829 |             }
  830 |         }
  831 |     }
  832 | }
  833 | 
  834 | impl TryFrom<pb::data_fragment::CreatedAtVersionSequence> for RowDatasetVersionMeta {
  835 |     type Error = Error;
  836 | 
  837 |     fn try_from(value: pb::data_fragment::CreatedAtVersionSequence) -> Result<Self> {
  838 |         match value {
  839 |             pb::data_fragment::CreatedAtVersionSequence::InlineCreatedAtVersions(data) => {
  840 |                 Ok(Self::Inline(Arc::from(data)))
  841 |             }
  842 |             pb::data_fragment::CreatedAtVersionSequence::ColumnCreatedAtVersions(_) => {
  843 |                 Ok(Self::Column)
  844 |             }
  845 |         }
  846 |     }
  847 | }
  848 | 
  849 | #[cfg(test)]
  850 | mod tests {
  851 |     use super::*;
  852 | 
  853 |     #[test]
  854 |     fn column_meta_json_is_an_empty_object_under_the_arm_name() {
  855 |         let json = serde_json::to_string(&RowDatasetVersionMeta::Column).unwrap();
  856 |         assert_eq!(json, r#"{"column":{}}"#);
  857 |         let parsed: RowDatasetVersionMeta = serde_json::from_str(&json).unwrap();
  858 |         assert_eq!(parsed, RowDatasetVersionMeta::Column);
  859 |         let inline = RowDatasetVersionMeta::Inline(Arc::from(vec![1u8, 2, 3]));
  860 |         let parsed: RowDatasetVersionMeta =
  861 |             serde_json::from_str(&serde_json::to_string(&inline).unwrap()).unwrap();
  862 |         assert_eq!(parsed, inline);
  863 |     }
  864 | 
  865 |     #[test]
  866 |     fn from_versions_run_length_encodes() {
  867 |         assert!(
  868 |             RowDatasetVersionSequence::from_versions(&[])
  869 |                 .runs
  870 |                 .is_empty()
  871 |         );
  872 | 
  873 |         let single = RowDatasetVersionSequence::from_versions(&[3, 3, 3]);
  874 |         assert_eq!(single.runs.len(), 1);
  875 |         assert_eq!(single.runs[0].version, 3);
  876 |         assert_eq!(single.len(), 3);
  877 | 
  878 |         let alternating = RowDatasetVersionSequence::from_versions(&[1, 2, 1, 2]);
  879 |         assert_eq!(
  880 |             alternating
  881 |                 .runs
  882 |                 .iter()
  883 |                 .map(|run| run.version)
  884 |                 .collect::<Vec<_>>(),
  885 |             [1, 2, 1, 2]
  886 |         );
  887 |         assert_eq!(alternating.versions().collect::<Vec<_>>(), [1, 2, 1, 2]);
  888 |     }
  889 | 
  890 |     #[test]
  891 |     fn test_version_random_access() {
  892 |         let seq = RowDatasetVersionSequence {
  893 |             runs: vec![
  894 |                 RowDatasetVersionRun {
  895 |                     span: U64Segment::Range(0..3),
  896 |                     version: 1,
  897 |                 },
  898 |                 RowDatasetVersionRun {
  899 |                     span: U64Segment::Range(0..2),
  900 |                     version: 2,
  901 |                 },
  902 |                 RowDatasetVersionRun {
  903 |                     span: U64Segment::Range(0..1),
  904 |                     version: 3,
  905 |                 },
  906 |             ],
  907 |         };
  908 |         assert_eq!(seq.version_at(0), Some(1));
  909 |         assert_eq!(seq.version_at(2), Some(1));
  910 |         assert_eq!(seq.version_at(3), Some(2));
  911 |         assert_eq!(seq.version_at(4), Some(2));
  912 |         assert_eq!(seq.version_at(5), Some(3));
  913 |         assert_eq!(seq.version_at(6), None);
  914 |     }
  915 | 
  916 |     #[test]
  917 |     fn test_partial_refresh_streams_many_lineage_runs() {
  918 |         const ROWS: usize = 10_000;
  919 |         let prior_sequence = RowDatasetVersionSequence {
  920 |             runs: (0..ROWS)
  921 |                 .map(|position| RowDatasetVersionRun {
  922 |                     span: U64Segment::Range(position as u64..position as u64 + 1),
  923 |                     version: (position % 2 + 1) as u64,
  924 |                 })
  925 |                 .collect(),
  926 |         };
  927 |         let mut fragment = Fragment::new(1);
  928 |         fragment.physical_rows = Some(ROWS);
  929 |         fragment.last_updated_at_version_meta =
  930 |             Some(RowDatasetVersionMeta::from_sequence(&prior_sequence).unwrap());
  931 | 
  932 |         refresh_row_latest_update_meta_for_partial_frag_rewrite_cols(
  933 |             &mut fragment,
  934 |             &[ROWS - 1],
  935 |             3,
  936 |             1,
  937 |             &Default::default(),
  938 |         )
  939 |         .unwrap();
  940 | 
  941 |         let refreshed = fragment
  942 |             .last_updated_at_version_meta
  943 |             .unwrap()
  944 |             .load_sequence()
  945 |             .unwrap();
  946 |         assert_eq!(refreshed.len(), ROWS as u64);
  947 |         assert_eq!(refreshed.version_at(0), Some(1));
  948 |         assert_eq!(refreshed.version_at(1), Some(2));
  949 |         assert_eq!(refreshed.version_at(ROWS - 2), Some(1));
  950 |         assert_eq!(refreshed.version_at(ROWS - 1), Some(3));
  951 |     }
  952 | 
  953 |     #[test]
  954 |     fn test_serialization_round_trip() {
  955 |         let seq = RowDatasetVersionSequence {
  956 |             runs: vec![
  957 |                 RowDatasetVersionRun {
  958 |                     span: U64Segment::Range(0..4),
  959 |                     version: 42,
  960 |                 },
  961 |                 RowDatasetVersionRun {
  962 |                     span: U64Segment::Range(0..3),
  963 |                     version: 99,
  964 |                 },
  965 |             ],
  966 |         };
  967 |         let bytes = write_dataset_versions(&seq);
  968 |         let seq2 = read_dataset_versions(&bytes).unwrap();
  969 |         assert_eq!(seq2.runs.len(), 2);
  970 |         assert_eq!(seq2.len(), 7);
  971 |         assert_eq!(seq2.version_at(0), Some(42));
  972 |         assert_eq!(seq2.version_at(5), Some(99));
  973 |     }
  974 | 
  975 |     #[test]
  976 |     fn test_get_version_for_row_id() {
  977 |         let seq = RowDatasetVersionSequence {
  978 |             runs: vec![
  979 |                 RowDatasetVersionRun {
  980 |                     span: U64Segment::Range(0..2),
  981 |                     version: 8,
  982 |                 },
  983 |                 RowDatasetVersionRun {
  984 |                     span: U64Segment::Range(0..2),
  985 |                     version: 9,
  986 |                 },
  987 |             ],
  988 |         };
  989 |         let rows = RowIdSequence::from(10..14); // row ids: 10,11,12,13
  990 |         assert_eq!(seq.get_version_for_row_id(&rows, 10), Some(8));
  991 |         assert_eq!(seq.get_version_for_row_id(&rows, 11), Some(8));
  992 |         assert_eq!(seq.get_version_for_row_id(&rows, 12), Some(9));
  993 |         assert_eq!(seq.get_version_for_row_id(&rows, 13), Some(9));
  994 |         assert_eq!(seq.get_version_for_row_id(&rows, 99), None);
  995 |     }
  996 | 
  997 |     #[test]
  998 |     fn test_version_cursor_ranges_gaps_and_rewind() {
  999 |         let seq = RowDatasetVersionSequence {
 1000 |             runs: vec![
 1001 |                 RowDatasetVersionRun {
 1002 |                     span: U64Segment::Range(0..3),
 1003 |                     version: 10,
 1004 |                 },
 1005 |                 RowDatasetVersionRun {
 1006 |                     span: U64Segment::Range(3..3),
 1007 |                     version: 99,
 1008 |                 },
 1009 |                 RowDatasetVersionRun {
 1010 |                     span: U64Segment::Range(3..5),
 1011 |                     version: 20,
 1012 |                 },
 1013 |                 RowDatasetVersionRun {
 1014 |                     span: U64Segment::Range(5..9),
 1015 |                     version: 30,
 1016 |                 },
 1017 |             ],
 1018 |         };
 1019 |         let expected = [10, 10, 10, 20, 20, 30, 30, 30, 30];
 1020 |         let mut cursor = seq.cursor();
 1021 |         let mut actual = Vec::new();
 1022 | 
 1023 |         cursor.extend_range(&seq, 0..2, &mut actual).unwrap();
 1024 |         cursor.extend_range(&seq, 2..5, &mut actual).unwrap();
 1025 |         cursor.extend_range(&seq, 7..9, &mut actual).unwrap();
 1026 |         assert_eq!(actual, [10, 10, 10, 20, 20, 30, 30]);
 1027 | 
 1028 |         actual.clear();
 1029 |         cursor.extend_range(&seq, 1..6, &mut actual).unwrap();
 1030 |         assert_eq!(actual, expected[1..6]);
 1031 | 
 1032 |         cursor.extend_range(&seq, 6..6, &mut actual).unwrap();
 1033 |         assert_eq!(actual, expected[1..6]);
 1034 |     }
 1035 | 
 1036 |     #[test]
 1037 |     fn test_version_cursor_descending_ranges_use_indexed_seek() {
 1038 |         const RUNS: usize = 10_000;
 1039 |         let seq = RowDatasetVersionSequence {
 1040 |             runs: (0..RUNS)
 1041 |                 .map(|position| RowDatasetVersionRun {
 1042 |                     span: U64Segment::Range(position as u64..position as u64 + 1),
 1043 |                     version: position as u64,
 1044 |                 })
 1045 |                 .collect(),
 1046 |         };
 1047 |         let mut cursor = seq.cursor();
 1048 |         let mut actual = Vec::with_capacity(RUNS);
 1049 | 
 1050 |         for position in (0..RUNS).rev() {
 1051 |             cursor
 1052 |                 .extend_range(&seq, position..position + 1, &mut actual)
 1053 |                 .unwrap();
 1054 |         }
 1055 | 
 1056 |         assert_eq!(actual, (0..RUNS as u64).rev().collect::<Vec<_>>());
 1057 |         assert_eq!(cursor.run_offsets.as_ref().unwrap().len(), RUNS);
 1058 |     }
 1059 | 
 1060 |     #[test]
 1061 |     fn test_version_cursor_alternating_ranges_use_indexed_seek_both_directions() {
 1062 |         const RUNS: usize = 10_000;
 1063 |         let seq = RowDatasetVersionSequence {
 1064 |             runs: (0..RUNS)
 1065 |                 .map(|position| RowDatasetVersionRun {
 1066 |                     span: U64Segment::Range(position as u64..position as u64 + 1),
 1067 |                     version: position as u64,
 1068 |                 })
 1069 |                 .collect(),
 1070 |         };
 1071 |         let mut cursor = seq.cursor();
 1072 |         let mut actual = Vec::with_capacity(RUNS);
 1073 | 
 1074 |         for selection_index in 0..RUNS {
 1075 |             let position = if selection_index % 2 == 0 {
 1076 |                 RUNS - 1
 1077 |             } else {
 1078 |                 0
 1079 |             };
 1080 |             cursor
 1081 |                 .extend_range(&seq, position..position + 1, &mut actual)
 1082 |                 .unwrap();
 1083 |         }
 1084 | 
 1085 |         let expected = (0..RUNS)
 1086 |             .map(|selection_index| {
 1087 |                 if selection_index % 2 == 0 {
 1088 |                     (RUNS - 1) as u64
 1089 |                 } else {
 1090 |                     0
 1091 |                 }
 1092 |             })
 1093 |             .collect::<Vec<_>>();
 1094 |         assert_eq!(actual, expected);
 1095 |         assert_eq!(cursor.run_offsets.as_ref().unwrap().len(), RUNS);
 1096 |         assert_eq!(cursor.indexed_seek_count, RUNS - 1);
 1097 |     }
 1098 | 
 1099 |     #[test]
 1100 |     fn test_version_cursor_reports_out_of_bounds() {
 1101 |         let seq = RowDatasetVersionSequence::from_uniform_row_count(4, 7);
 1102 |         let mut cursor = seq.cursor();
 1103 |         let mut actual = Vec::new();
 1104 |         let error = cursor.extend_range(&seq, 4..5, &mut actual).unwrap_err();
 1105 |         assert!(matches!(error, Error::Internal { .. }));
 1106 |         assert!(
 1107 |             error
 1108 |                 .to_string()
 1109 |                 .contains("position 4 out of range (total_len=4)")
 1110 |         );
 1111 |         assert!(actual.is_empty());
 1112 |     }
 1113 | 
 1114 |     #[test]
 1115 |     fn test_version_cursor_non_range_span() {
 1116 |         let non_range_span = U64Segment::from_slice(&[0, 2, 4, 6, 8]);
 1117 |         assert!(!matches!(non_range_span, U64Segment::Range(_)));
 1118 |         let seq = RowDatasetVersionSequence {
 1119 |             runs: vec![
 1120 |                 RowDatasetVersionRun {
 1121 |                     span: non_range_span,
 1122 |                     version: 4,
 1123 |                 },
 1124 |                 RowDatasetVersionRun {
 1125 |                     span: U64Segment::Range(0..3),
 1126 |                     version: 8,
 1127 |                 },
 1128 |             ],
 1129 |         };
 1130 |         let mut actual = Vec::new();
 1131 |         seq.cursor().extend_range(&seq, 0..8, &mut actual).unwrap();
 1132 |         assert_eq!(actual, [4, 4, 4, 4, 4, 8, 8, 8]);
 1133 |     }
 1134 | }
``````
