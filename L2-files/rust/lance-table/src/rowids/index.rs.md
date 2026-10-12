> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/rowids/index.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `b19734c0b71bb4456aef6fdb93391ed8e1346a8d93f4a95573ec1b7500aab792`. Reviewed physical lines: 1-1641.

[Module](../../../../../L1-modules/rust-lance-table-row-index.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

In-memory stable-row-ID to physical RowAddress lookup, selecting a merged range map or a fragment-probing interval tree, with deletion filtering, per-segment accelerators, retained-memory accounting and unit/property fixtures. Public types are reexported from the otherwise private rowids::index module. (rust/lance-table/src/rowids/index.rs:1-1641)

## Complete range analysis

### Lines 1-28

SPDX/imports connect Arc, inclusive ranges, Bitmap/count_ones, RowIdSequence/U64Segment, DeepSizeOf, RowAddress, DeletionVector, core errors and RangeInclusiveMap. Private MAX_PROBE_DEPTH=64 bounds overlapping fragment envelopes for the probe choice; MERGE_ROWS_BUDGET=1<<20 estimates rows read by merging; RANK_BLOCK_BYTES=256 means 2,048 bitmap slots per rank directory entry. Source comments' measured depth 46 is historical rationale, not a measurement from this task. (rust/lance-table/src/rowids/index.rs:1-28)

### Lines 29-61

Public Debug RowIdIndex owns private sorted fragment entries, a max-end tree and optional merged RangeInclusiveMap<u64,(row-ID segment,address segment)>. Public FragmentRowIdIndex has public u32 fragment_id plus Arc<RowIdSequence> and Arc<DeletionVector>, without validation or a derive here. The opening comment says tombstoned addresses may be returned; current probe and merged construction actually filter supplied deletions, so the comment is stale. Empty deletion input naturally provides no such filtering. (rust/lance-table/src/rowids/index.rs:29-61)

### Lines 62-81

Public new borrows a fragment-index slice, builds FragmentEntry/lookup sidecars for every nonempty source, sorts by lowest row ID and constructs the end tree before deciding representation. It builds a merged map unless probing_beats_merging returns true. Returns Result for duplicate-live-ID merge failures; input capacities, offsets and within-fragment uniqueness are not comprehensively validated. Both original fragment/sidecar state and the tree remain retained even when merged is Some. (rust/lance-table/src/rowids/index.rs:62-81)

### Lines 82-115

build_merged clones Arc handles into temporary source descriptors, decomposes every source into chunks, eagerly collects them, groups overlapping numeric envelopes and merges only those groups. Nonoverlapping chunks pass through. Sparse bounds may overlap without live-ID collision, so duplicate detection examines enumerated IDs rather than span cardinality. Final chunks become RangeInclusiveMap. Construction materializes multiple intermediate vectors and may error after significant temporary allocation, but publishes no external state. (rust/lance-table/src/rowids/index.rs:82-115)

### Lines 116-130

Public get(row_id:u64)->Result<Option<RowAddress>> dispatches to merged_get when a map exists, wrapping its Option in Ok, otherwise probes fragments. Thus merged cross-chunk duplicate errors happen at construction, while probe errors happen only for requested duplicated IDs. Missing IDs return None; no row bytes, file IO or mutable cache is accessed. (rust/lance-table/src/rowids/index.rs:116-130)

### Lines 131-159

Public get_many allocates one None per input and returns it immediately for empty input. It builds/sorts a working Vec<(row_id,original_index)> and restores results to original positions, preserving input duplicates. Probe mode simply invokes self.probe for every sorted ID with no explicit persistent traversal cursor; first error aborts the whole call. The doc's O(F+N) amortization omits sorting and applies to merged chunk traversal, not total work in both modes. (rust/lance-table/src/rowids/index.rs:131-159)

### Lines 160-184

Merged get_many walks sorted map chunks with a peekable iterator, advancing while range end < requested ID, skipping IDs before the next start and stopping when no chunks remain. Within a covering envelope it finds the row-ID segment position and corresponding address; either absence leaves None. Output remains in caller order. Work includes O(N log N) input sort plus chunk traversal and encoding-specific position/get costs; sparse envelope membership alone is not a live hit. (rust/lance-table/src/rowids/index.rs:160-184)

### Lines 185-244

Private probe returns None for zero fragments or no start <= row ID. partition_point finds the candidate upper bound. An iterative stackless left-to-right DFS uses max-end tree values to prune subtrees, tests FragmentEntry::resolve at leaves, and continues after the first live hit to detect a second. Two hits return Internal naming the row ID. Ascending from right children adjusts lo/width; reaching root ends the walk, while lo>=upper terminates remaining sorted starts. No recursion or heap stack per lookup; worst work depends on overlapping envelopes and segment searches, not solely one binary search. (rust/lance-table/src/rowids/index.rs:185-244)

### Lines 245-275

merged_get queries the range map, calls row-ID segment.position then address segment.get, converts raw address and returns None on either miss. Private SegmentEntry stores original sequence index, inclusive envelope, u32 starting physical offset and lookup. SegmentLookup::Native delegates to encoding; Positions stores sorted (ID,u32 position) pairs for unsorted arrays; BitmapRank stores u32 prefix popcounts per 256-byte block. These are memory-only accelerators, not serialized format fields. (rust/lance-table/src/rowids/index.rs:245-275)

### Lines 276-305

SegmentEntry::position uses its original sequence index. Native delegates; Positions binary-searches ID and returns the saved offset. BitmapRank verifies the source variant and range, rejects a clear bit, then sums the directory prefix and bit count from the block start up to but excluding this bit. At most one 256-byte block prefix is scanned. It trusts valid bitmap storage, rank lengths and u32 offsets; malformed backing or stale sequence/sidecar correspondence can panic or misresolve. Arc ownership keeps ordinary safe mutation from changing this stored sequence. (rust/lance-table/src/rowids/index.rs:276-305)

### Lines 306-328

build_lookup eagerly iterates Array into (ID,position as u32), sorts tuples and deduplicates by ID so the smallest original position wins; returned length remains the original segment length, not deduplicated count. Bitmap builds a rank directory and uses total counted ones as length; all other encodings use Native plus segment.len. Therefore construction does more than reading bounds: Array sidecars require full enumeration/sort and bitmap sidecars scan bytes even when probe mode is chosen. (rust/lance-table/src/rowids/index.rs:306-328)

### Lines 329-351

build_bitmap_rank reserves ceil(data byte length/256) entries, stores cumulative ones cast to u32 before each chunk and counts all supplied bytes, returning directory and usize total. It does not mask logical trailing padding or validate bitmap.len; correctness relies on canonical bitmap storage. Private Debug FragmentEntry retains ID, Arc sequence/deletions, segment sidecars, min/max envelope and estimated merge_rows. (rust/lance-table/src/rowids/index.rs:329-351)

### Lines 352-390

FragmentEntry::new iterates all sequence segments, builds lookup and len, counts len toward merge_rows whenever any deletion exists for the fragment or the segment is not a plain Range. Only positive-len segments with a reported range become entries; physical offset still advances for every segment. It computes min start/max end over retained segments or drops a source with none. u32 length casts and offset addition, u64 merge estimate addition are unchecked. Entirely deleted but physically nonempty sources may remain as probe candidates because deletion filtering occurs later. (rust/lance-table/src/rowids/index.rs:352-390)

### Lines 391-410

FragmentEntry::resolve scans segments in sequence order, filters envelopes, asks the sidecar for a position, adds the segment start offset, then skips supplied deletion offsets. First surviving hit becomes RowAddress(fragment_id,physical_offset); later segments are not checked after that hit. Consequently this path detects cross-entry duplicates in probe, not every duplicate within one fragment; Positions collapses repeated IDs to their first original position. It preserves physical holes rather than compacting surviving offsets. (rust/lance-table/src/rowids/index.rs:391-410)

### Lines 411-436

probing_beats_merging requires estimated merge rows strictly greater than 1,048,576 AND max envelope overlap depth <=64; exact budget or depth 65 selects merging. Short-circuit avoids overlap calculation below budget. max_overlap_depth sorts ends and sweeps start-sorted fragments, closing only end < next start because envelopes are inclusive. Depth counts fragment envelopes, including holes/deleted IDs, not exact live overlap. It assumes starts already sorted; totals use ordinary arithmetic. (rust/lance-table/src/rowids/index.rs:411-436)

### Lines 437-453

build_end_tree returns empty Vec for no fragments; otherwise pads leaf count to next power of two, allocates 2*leaves zero u64s, stores fragment ends in leaves and fills internal maxima bottom-up. Index 0 is unused; root is 1. Padding zero may pass an ID-zero end check but is excluded by slot bounds. Capacity arithmetic/allocation are not fallible Result paths. (rust/lance-table/src/rowids/index.rs:437-453)

### Lines 454-501

Manual DeepSizeOf traverses shared sequences/deletion vectors with the supplied Context, counts segment Vec capacity and Positions/BitmapRank allocation capacities, then estimates merged entries as two u64 bounds plus segment pair inline sizes and owned children. It adds fragment Vec/end-tree capacities. Arc dedup follows shared Context, but separately cached roots may each charge retained sequences. Range-map node/allocation overhead is not measured; this is an estimate, not exact RSS. Both probe accelerators and merged storage are charged when retained. (rust/lance-table/src/rowids/index.rs:454-501)

### Lines 502-534

decompose_sequence starts at RowAddress::first_row(fragment_id), tracks u32 physical offset and u64 raw address, and chooses a no-deletion fast path only if the entire deletion vector is empty. After processing each segment, both offsets advance by its full physical length, including deleted rows; None chunks are filtered out. Length casts/additions are unchecked and no fragment-size bounds are validated here. Result is eagerly collected Vec. (rust/lance-table/src/rowids/index.rs:502-534)

### Lines 535-549

build_chunk_from_pairs returns None for empty input, sorts (row ID,address) pairs by row ID, unzips into two owned Vecs, compresses each with U64Segment::from_iter and obtains inclusive coverage from the row-ID segment. Address order follows sorted IDs, preserving the original physical pairing. It does not explicitly reject duplicates within this single chunk; later overlapping-group merge is a separate check. (rust/lance-table/src/rowids/index.rs:535-549)

### Lines 550-572

Without deletions a nonempty plain Range becomes cloned ID Range, arithmetic address Range and inclusive start..=end-1 in constant row-independent time. Empty segments return None. Every other encoding, including compact Ranges, is enumerated into pairs then sorted/compressed. Unchecked address end arithmetic assumes fragment lengths fit the RowAddress representation. Fast-path complexity is per segment, not total index construction including fragment/chunk sorting. (rust/lance-table/src/rowids/index.rs:550-572)

### Lines 573-611

With deletions, every segment value is enumerated; local position plus current_offset is checked against DeletionVector, surviving values retain original raw address, then build_chunk_from_pairs sorts/compresses. Private IndexChunk aliases coverage plus ID/address segments. RawIndexChunk distinguishes one nonoverlapping chunk from an overlapping-envelope group; range_end extracts inclusive end. No tombstone is returned from either decomposition path when supplied deletion metadata is correct. (rust/lance-table/src/rowids/index.rs:573-611)

### Lines 612-648

prep_index_chunks sorts all chunks by u64::MAX-start (descending start) and pops to process ascending starts. Empty input returns empty owned iterator; otherwise seed output with the first nonoverlapping chunk. It tracks a current overlapping group/envelope. Debug assertions repeatedly recompute minimum start/maximum end, using zero defaults for an empty group; these add debug-only work and encode internal grouping invariants. (rust/lance-table/src/rowids/index.rs:612-648)

### Lines 649-691

When no group is active, compare next start <= previous output end. Overlap removes the previous nonoverlapping chunk, starts a two-chunk group and expands end; otherwise append it standalone. An active group absorbs any chunk starting within its current inclusive end, transitively extending the envelope; a gap flushes the group via replace/take then appends a standalone chunk. unwrap/unreachable rely on seeded-output/group state, not user validation. (rust/lance-table/src/rowids/index.rs:649-691)

### Lines 692-718

Final debug assertions repeat group min/max agreement. Any remaining overlap group is appended, then the owned output Vec becomes an iterator. Adjacent but nonoverlapping inclusive envelopes are not grouped; sparse holes within overlapping bounds are handled later by live-ID merge. Despite its iterator return type, all grouping is completed and materialized before return. (rust/lance-table/src/rowids/index.rs:692-718)

### Lines 719-744

merge_overlapping_chunks preallocates summed row-ID lengths, extends with zip of each ID/address iterator, stable-sorts by ID and rejects the first adjacent duplicate as Internal. Zip would truncate mismatched inputs; private decomposition is expected to maintain pairing. Duplicate check does not know actual fragment identities, so its multiple fragments message can also describe malformed overlapping chunks from one source. Rebuilds compressed ID/address segments and unwraps nonempty range, relying on nonempty overlap inputs. (rust/lance-table/src/rowids/index.rs:719-744)

### Lines 745-784

cfg(test) RowIdIndex::probing bypasses the heuristic but still builds/sorts fragment sidecars and tree; its Result currently always succeeds. The tests module imports proptest. sparse_sequence makes even IDs in an explicit SortedArray; fragment wraps a sequence in Arc with empty deletion vector. Helpers are fixtures, not public construction alternatives. (rust/lance-table/src/rowids/index.rs:745-784)

### Lines 785-821

Heuristic tests require a one-million-row plain Range and 16-element sparse sequence to merge, while a sparse sequence with budget+1 rows probes and resolves ID6 to offset3. A second fixture creates 65 interleaved fragments with just over the total row budget and requires merging despite build size. These tests establish selection thresholds in source, not measured performance or sub-second execution. (rust/lance-table/src/rowids/index.rs:785-821)

### Lines 822-860

One test rejects duplicated live ID2 across two fragments during normal merged construction, then successfully probes only the first fragment; its name does not mean probe tolerates the same corrupt two-fragment input. The next forced-probe fixture uses both sources, resolves unique ID0, requires Internal plus the duplicate message for get(2), and requires get_many([0,2]) to error. (rust/lance-table/src/rowids/index.rs:822-860)

### Lines 861-902

Bitmap rank test spans three full 2,048-slot blocks plus 17 slots, clears every slot congruent to1 mod3 and checks every live/missing lookup plus outside bounds. Unsorted-array probe fixture permutes 2,048 IDs by multiply7919 modulo2048 and asserts every original physical position, keeping merged None. Neither test benchmarks latency. (rust/lance-table/src/rowids/index.rs:861-902)

### Lines 903-961

test_new_index combines fragment10 Range/holes/sorted-array segments with fragment20 bitmap/Array segments. Assertions check first values, omitted IDs15/61, end-of-hole rank and cumulative offsets across segments: ID25 at fragment10 offset16, ID40/60 at fragment20 offsets2/4. Both deletion vectors are empty; holes are sequence representation gaps. (rust/lance-table/src/rowids/index.rs:903-961)

### Lines 962-1028

test_new_index_overlap interleaves IDs1..9 across fragments10/42/23 with overlapping sparse envelopes, then asserts all nine exact fragment/offset pairs. This verifies valid overlapping envelopes merge without requiring dense ownership by one fragment. (rust/lance-table/src/rowids/index.rs:962-1028)

### Lines 1029-1100

Unsorted fixture supplies [9,3,6], [8,2,5] and [7,1,4] across fragments10/20/30 as explicit Arrays. It verifies all nine IDs map to original physical positions after sorting the merged ID dimension, and IDs0/10 are absent. This tests pairing preservation, not sorted-input assumptions. (rust/lance-table/src/rowids/index.rs:1029-1100)

### Lines 1101-1143

Partial-overlap fixture has fragment0 RangeWithHoles(0..100, hole50) and fragment1 Range50..51. It checks ownership of50 by fragment1 and fragment0 offsets before/after the hole (ID51 at50, ID99 at98). Sequence holes do not occupy physical positions, unlike deletion-vector holes. (rust/lance-table/src/rowids/index.rs:1101-1143)

### Lines 1144-1199

Sparse-overlap deletion fixture alternates odd/even IDs across two fragments and tombstones even-source offset2 (ID4). It asserts ID4 missing and surviving IDs6/8 retain physical offsets3/4. Thus overlapping span union may have holes and deletion filtering must not renumber surviving addresses. (rust/lance-table/src/rowids/index.rs:1144-1199)

### Lines 1200-1232

Single Range0..6 with deletion offsets2/3 returns addresses for0/1/4/5 at unchanged offsets and None for2/3. This directly contradicts the stale type comment that this index can return supplied tombstoned addresses. (rust/lance-table/src/rowids/index.rs:1200-1232)

### Lines 1233-1270

Empty-fragment fixture mixes no segments with Range5..8 and checks live boundary lookup plus missing4. Completely empty constructor returns an index whose get(0) and get(100) are None. No error is expected from empty inputs. (rust/lance-table/src/rowids/index.rs:1233-1270)

### Lines 1271-1317

Three adjacent nonoverlapping ranges0..5,5..10,10..15 across fragments10/20/30 assert each first/last physical offset. Inclusive coverage boundaries derived from exclusive ranges must not cause false overlap or off-by-one mapping. (rust/lance-table/src/rowids/index.rs:1271-1317)

### Lines 1318-1342

arbitrary_row_ids generates fragment sizes in supplied ranges, constructs globally unique IDs0..sum, shuffles all IDs, partitions by sizes and compresses each sequence. Fragment IDs are cumulative starting row positions cast to u32, not sequential fragment ordinal; zero-size sources may reuse a cumulative ID but hold no rows. Strategy materializes the global ID Vec. (rust/lance-table/src/rowids/index.rs:1318-1342)

### Lines 1343-1378

arbitrary_row_ids_with_deletions pairs the generated sources with one arbitrary bool per physical row, then consumes those flags in source/offset order into Roaring deletion bitmaps. Each result retains its Arc sequence and a Bitmap deletion vector, possibly empty. Test generation uses unwrap under guaranteed vector cardinality and bounded inputs. (rust/lance-table/src/rowids/index.rs:1343-1378)

### Lines 1379-1441

Large-range regression constructs100 fragments of250,000 rows (25 million total) without deletions, times only RowIdIndex::new and asserts selected boundaries plus missing final+1. It requires elapsed.as_secs()<1. The comment's typically<1ms and O(fragments) language are rationale, not observed here; range decomposition is row-independent but fragment/chunk sorting still exists. This test was not run. (rust/lance-table/src/rowids/index.rs:1379-1441)

### Lines 1442-1516

Large-deletion fixture uses10 fragments of1,000 rows with every third physical offset removed, checks missing0/3/next-fragment-start/last-row and unchanged survivor offsets including final998. It checks final out-of-range too. No timing assertion in this test; it exercises deletion-aware enumeration and mapping. (rust/lance-table/src/rowids/index.rs:1442-1516)

### Lines 1517-1553

Proptest robustness generates0..4 fragments each0..31 rows with deletions, constructs both heuristic and forced-probe indices, and checks every generated physical ID against an explicit deletion/address oracle. It covers both representations on small fixtures, not malformed global duplicates or all sidecar encodings by guarantee. (rust/lance-table/src/rowids/index.rs:1517-1553)

### Lines 1554-1582

Moved-ID property chooses any u64 row ID, source fragment below1024 and positive delta below1024, marks source offset0 deleted and target live. New merged index must resolve to target offset0. This includes u64::MAX candidates through the generator and establishes live uniqueness rather than physical-history uniqueness. (rust/lance-table/src/rowids/index.rs:1554-1582)

### Lines 1583-1612

Duplicate-live property creates two distinct fragments holding the same arbitrary u64 ID without deletions. Construction must fail with Internal and exact ID context. It tests merged validation on small sources; forced probe's delayed duplicate behavior is tested separately. (rust/lance-table/src/rowids/index.rs:1583-1612)

### Lines 1613-1641

Range-segment fixture excludes1200..1900 from1000..3000, asserts use_range_segments changes representation, then verifies every remaining ID's ordinal address and missing1500. get_many on [2999,1000,1199,1900,1500] must preserve requested order and return last,0,199,200,None. This is the file's explicit successful batch-lookup case; there is no broad get_many property matrix, retained-size fixture or overflow/padding-corruption test here. (rust/lance-table/src/rowids/index.rs:1613-1641)

## Interaction and interpretation limits

All 1,641 physical lines were read and authored. This synchronous structure uses no unsafe blocks, locks, awaits or object IO. Segment/bitmap/deletion/RowAddress contracts are separately documented; no source tests or benchmarks were executed. Heuristic thresholds and test timing assertions are source facts, not verified latency promises. Complete Dataset construction/caching/refresh and scan callers remain pending; the benchmark is analyzed separately.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::ops::RangeInclusive;
    5 | use std::sync::Arc;
    6 | 
    7 | use super::bitmap::{Bitmap, count_ones};
    8 | use super::{RowIdSequence, U64Segment};
    9 | use lance_core::deepsize::DeepSizeOf;
   10 | use lance_core::utils::address::RowAddress;
   11 | use lance_core::utils::deletion::DeletionVector;
   12 | use lance_core::{Error, Result};
   13 | use rangemap::RangeInclusiveMap;
   14 | 
   15 | /// Fragments one lookup may have to probe before the merged map is worth its
   16 | /// build, whatever that build costs. A compacted table interleaves its
   17 | /// fragments, and one measured at 46.
   18 | const MAX_PROBE_DEPTH: u64 = 64;
   19 | 
   20 | /// Row ids the merged build may read before probing is worth its per-lookup
   21 | /// cost instead.
   22 | const MERGE_ROWS_BUDGET: u64 = 1 << 20;
   23 | 
   24 | /// Bitmap bytes summarized by one entry of a bitmap rank directory. A lookup
   25 | /// counts at most this many bytes; the directory costs one `u32` per block,
   26 | /// 1/64 of the bitmap.
   27 | const RANK_BLOCK_BYTES: usize = 256;
   28 | 
   29 | /// An index of row ids
   30 | ///
   31 | /// This index is used to map row ids to their corresponding addresses. These
   32 | /// addresses correspond to physical positions in the dataset. See [RowAddress].
   33 | ///
   34 | /// This structure only contains rows that physically exist. However, it may
   35 | /// map to addresses that have been tombstoned. A separate tombstone index is
   36 | /// used to track tombstoned rows.
   37 | // (Implementation)
   38 | // Two representations answer the same lookups, chosen once by `new`. The merged
   39 | // map keys disjoint ranges of row ids to a pair of segments, the row ids and
   40 | // the addresses, and reads every row id to build. A probe instead reads each
   41 | // segment's bounds and asks the covering segment for the position of the id;
   42 | // `new` takes that when few fragments cover one id and the merged build would
   43 | // read a lot of them.
   44 | #[derive(Debug)]
   45 | pub struct RowIdIndex {
   46 |     /// Fragments that hold at least one row id, sorted by their lowest row id.
   47 |     fragments: Vec<FragmentEntry>,
   48 |     /// Max-`end` heap over `fragments`: `end_tree[1]` is the root and leaf `i`
   49 |     /// sits at `end_tree[len() / 2 + i]`.
   50 |     end_tree: Vec<u64>,
   51 |     merged: Option<MergedIndex>,
   52 | }
   53 | 
   54 | type MergedIndex = RangeInclusiveMap<u64, (U64Segment, U64Segment)>;
   55 | 
   56 | pub struct FragmentRowIdIndex {
   57 |     pub fragment_id: u32,
   58 |     pub row_id_sequence: Arc<RowIdSequence>,
   59 |     pub deletion_vector: Arc<DeletionVector>,
   60 | }
   61 | 
   62 | impl RowIdIndex {
   63 |     /// Create a new index from a list of fragment ids and their corresponding row id sequences.
   64 |     pub fn new(fragment_indices: &[FragmentRowIdIndex]) -> Result<Self> {
   65 |         let mut fragments: Vec<FragmentEntry> = fragment_indices
   66 |             .iter()
   67 |             .filter_map(FragmentEntry::new)
   68 |             .collect();
   69 |         fragments.sort_unstable_by_key(|entry| entry.start);
   70 | 
   71 |         let mut index = Self {
   72 |             end_tree: build_end_tree(&fragments),
   73 |             fragments,
   74 |             merged: None,
   75 |         };
   76 |         if !probing_beats_merging(&index.fragments) {
   77 |             index.merged = Some(index.build_merged()?);
   78 |         }
   79 |         Ok(index)
   80 |     }
   81 | 
   82 |     fn build_merged(&self) -> Result<MergedIndex> {
   83 |         let sources: Vec<FragmentRowIdIndex> = self
   84 |             .fragments
   85 |             .iter()
   86 |             .map(|entry| FragmentRowIdIndex {
   87 |                 fragment_id: entry.fragment_id,
   88 |                 row_id_sequence: entry.sequence.clone(),
   89 |                 deletion_vector: entry.deletion_vector.clone(),
   90 |             })
   91 |             .collect();
   92 |         let chunks = sources
   93 |             .iter()
   94 |             .flat_map(decompose_sequence)
   95 |             .collect::<Vec<_>>();
   96 | 
   97 |         let mut final_chunks = Vec::new();
   98 |         for processed_chunk in prep_index_chunks(chunks) {
   99 |             match processed_chunk {
  100 |                 RawIndexChunk::NonOverlapping(chunk) => {
  101 |                     final_chunks.push(chunk);
  102 |                 }
  103 |                 RawIndexChunk::Overlapping(_range, overlapping_chunks) => {
  104 |                     // Intersecting row-id ranges don't imply intersecting id sets;
  105 |                     // sparse ids and deletion holes leave the union short of the span.
  106 |                     // The real invariant (no id in two fragments) is checked in the merge.
  107 |                     let merged_chunk = merge_overlapping_chunks(overlapping_chunks)?;
  108 |                     final_chunks.push(merged_chunk);
  109 |                 }
  110 |             }
  111 |         }
  112 | 
  113 |         Ok(RangeInclusiveMap::from_iter(final_chunks))
  114 |     }
  115 | 
  116 |     /// Get the address for a given row id.
  117 |     ///
  118 |     /// Will return None if the row id does not exist in the index.
  119 |     ///
  120 |     /// # Errors
  121 |     ///
  122 |     /// Returns an error if the row id is live in more than one fragment,
  123 |     /// which means the stable row ids are corrupt.
  124 |     pub fn get(&self, row_id: u64) -> Result<Option<RowAddress>> {
  125 |         if let Some(merged) = &self.merged {
  126 |             return Ok(merged_get(merged, row_id));
  127 |         }
  128 |         self.probe(row_id)
  129 |     }
  130 | 
  131 |     /// Get addresses for many row ids in one pass over the index.
  132 |     ///
  133 |     /// Returns one entry per input id, in input order (`None` for missing).
  134 |     /// Sorts a working copy of the input internally so the chunk iterator
  135 |     /// is advanced at most once per chunk, amortizing the per-id tree walk
  136 |     /// from O(N · log F) to O(F + N).
  137 |     ///
  138 |     /// # Errors
  139 |     ///
  140 |     /// Returns an error if any requested row id is live in more than one
  141 |     /// fragment, which means the stable row ids are corrupt.
  142 |     pub fn get_many(&self, row_ids: &[u64]) -> Result<Vec<Option<RowAddress>>> {
  143 |         let n = row_ids.len();
  144 |         let mut out = vec![None; n];
  145 |         if n == 0 {
  146 |             return Ok(out);
  147 |         }
  148 | 
  149 |         let mut sorted: Vec<(u64, usize)> = row_ids.iter().copied().zip(0..n).collect();
  150 |         sorted.sort_unstable_by_key(|&(id, _)| id);
  151 | 
  152 |         let Some(merged) = &self.merged else {
  153 |             // Sorted ids keep one fragment and its segments warm across the run.
  154 |             for (id, orig_idx) in sorted {
  155 |                 out[orig_idx] = self.probe(id)?;
  156 |             }
  157 |             return Ok(out);
  158 |         };
  159 | 
  160 |         let mut chunks = merged.iter().peekable();
  161 |         for (id, orig_idx) in sorted {
  162 |             // Advance past chunks that end before this id.
  163 |             while let Some((range, _)) = chunks.peek() {
  164 |                 if *range.end() < id {
  165 |                     chunks.next();
  166 |                 } else {
  167 |                     break;
  168 |                 }
  169 |             }
  170 |             let Some((range, (row_id_seg, addr_seg))) = chunks.peek() else {
  171 |                 break;
  172 |             };
  173 |             if id < *range.start() {
  174 |                 continue; // falls in a gap between chunks
  175 |             }
  176 |             if let Some(pos) = row_id_seg.position(id)
  177 |                 && let Some(addr) = addr_seg.get(pos)
  178 |             {
  179 |                 out[orig_idx] = Some(RowAddress::from(addr));
  180 |             }
  181 |         }
  182 |         Ok(out)
  183 |     }
  184 | 
  185 |     /// Address of `row_id`, from the fragment that holds it live. Descends the
  186 |     /// max-`end` tree, so a fragment out of reach of the id costs nothing.
  187 |     ///
  188 |     /// Visits every candidate rather than stopping at the first hit, and
  189 |     /// errors when a second fragment holds the id live.
  190 |     fn probe(&self, row_id: u64) -> Result<Option<RowAddress>> {
  191 |         let fragments = self.fragments.len();
  192 |         if fragments == 0 {
  193 |             return Ok(None);
  194 |         }
  195 |         // Only a fragment that starts at or below the id can hold it.
  196 |         let upper = self
  197 |             .fragments
  198 |             .partition_point(|entry| entry.start <= row_id);
  199 |         if upper == 0 {
  200 |             return Ok(None);
  201 |         }
  202 |         let mut found: Option<RowAddress> = None;
  203 |         // Depth-first, left to right, without a stack: `node` covers `width`
  204 |         // slots from `lo`. A pruned subtree or a visited leaf moves on to the
  205 |         // next subtree: up while `node` is a right child, then over to the
  206 |         // sibling.
  207 |         let (mut node, mut lo, mut width) = (1usize, 0usize, self.end_tree.len() / 2);
  208 |         loop {
  209 |             if lo >= upper {
  210 |                 // Every slot from here on starts above the id.
  211 |                 break;
  212 |             }
  213 |             if self.end_tree[node] >= row_id {
  214 |                 if width > 1 {
  215 |                     node *= 2;
  216 |                     width /= 2;
  217 |                     continue;
  218 |                 }
  219 |                 if lo < fragments
  220 |                     && let Some(candidate) = self.fragments[lo].resolve(row_id)
  221 |                 {
  222 |                     if found.is_some() {
  223 |                         return Err(Error::internal(format!(
  224 |                             "row id index corrupt: stable row id {row_id} is \
  225 |                              live in multiple fragments",
  226 |                         )));
  227 |                     }
  228 |                     found = Some(candidate);
  229 |                 }
  230 |             }
  231 |             while node & 1 == 1 {
  232 |                 if node == 1 {
  233 |                     return Ok(found);
  234 |                 }
  235 |                 node /= 2;
  236 |                 lo -= width;
  237 |                 width *= 2;
  238 |             }
  239 |             node += 1;
  240 |             lo += width;
  241 |         }
  242 |         Ok(found)
  243 |     }
  244 | }
  245 | 
  246 | fn merged_get(merged: &MergedIndex, row_id: u64) -> Option<RowAddress> {
  247 |     let (row_id_segment, address_segment) = merged.get(&row_id)?;
  248 |     let pos = row_id_segment.position(row_id)?;
  249 |     let address = address_segment.get(pos)?;
  250 |     Some(RowAddress::from(address))
  251 | }
  252 | 
  253 | /// One segment of a sequence, and the offset its first row sits at.
  254 | #[derive(Debug)]
  255 | struct SegmentEntry {
  256 |     seq_idx: usize,
  257 |     range: RangeInclusive<u64>,
  258 |     start_offset: u32,
  259 |     lookup: SegmentLookup,
  260 | }
  261 | 
  262 | /// How a [`SegmentEntry`] finds the position of a row id.
  263 | #[derive(Debug)]
  264 | enum SegmentLookup {
  265 |     /// The encoding searches itself in logarithmic or constant time.
  266 |     Native,
  267 |     /// Row id to position for an unsorted [`U64Segment::Array`], whose own
  268 |     /// `position` scans.
  269 |     Positions(Vec<(u64, u32)>),
  270 |     /// Set bits before each [`RANK_BLOCK_BYTES`] block of a
  271 |     /// [`U64Segment::RangeWithBitmap`] bitmap, whose own `position` counts
  272 |     /// the whole prefix.
  273 |     BitmapRank(Vec<u32>),
  274 | }
  275 | 
  276 | impl SegmentEntry {
  277 |     /// Position of `row_id` in this segment, or `None` if it holds no such id.
  278 |     fn position(&self, sequence: &RowIdSequence, row_id: u64) -> Option<usize> {
  279 |         let segment = &sequence.0[self.seq_idx];
  280 |         match &self.lookup {
  281 |             SegmentLookup::Native => segment.position(row_id),
  282 |             SegmentLookup::Positions(positions) => positions
  283 |                 .binary_search_by_key(&row_id, |(id, _)| *id)
  284 |                 .ok()
  285 |                 .map(|found| positions[found].1 as usize),
  286 |             SegmentLookup::BitmapRank(rank) => {
  287 |                 let U64Segment::RangeWithBitmap { range, bitmap } = segment else {
  288 |                     return None;
  289 |                 };
  290 |                 if !range.contains(&row_id) {
  291 |                     return None;
  292 |                 }
  293 |                 let offset = (row_id - range.start) as usize;
  294 |                 if !bitmap.get(offset) {
  295 |                     return None;
  296 |                 }
  297 |                 let block_start = offset / (RANK_BLOCK_BYTES * 8) * (RANK_BLOCK_BYTES * 8);
  298 |                 let ones_before = rank[offset / (RANK_BLOCK_BYTES * 8)] as usize
  299 |                     + bitmap.slice(block_start, offset - block_start).count_ones();
  300 |                 Some(ones_before)
  301 |             }
  302 |         }
  303 |     }
  304 | }
  305 | 
  306 | /// The lookup structure for `segment`, and the ids it holds. A bitmap's rank
  307 | /// directory counts its ones on the way, so the segment is read once.
  308 | fn build_lookup(segment: &U64Segment) -> (SegmentLookup, usize) {
  309 |     match segment {
  310 |         U64Segment::Array(_) => {
  311 |             let mut positions: Vec<(u64, u32)> = segment
  312 |                 .iter()
  313 |                 .enumerate()
  314 |                 .map(|(position, row_id)| (row_id, position as u32))
  315 |                 .collect();
  316 |             positions.sort_unstable();
  317 |             // The first position of a repeated id wins, as `position` does.
  318 |             positions.dedup_by_key(|(row_id, _)| *row_id);
  319 |             (SegmentLookup::Positions(positions), segment.len())
  320 |         }
  321 |         U64Segment::RangeWithBitmap { bitmap, .. } => {
  322 |             let (rank, ones) = build_bitmap_rank(bitmap);
  323 |             (SegmentLookup::BitmapRank(rank), ones)
  324 |         }
  325 |         _ => (SegmentLookup::Native, segment.len()),
  326 |     }
  327 | }
  328 | 
  329 | /// Set bits before each [`RANK_BLOCK_BYTES`] block of `bitmap`, and in total.
  330 | fn build_bitmap_rank(bitmap: &Bitmap) -> (Vec<u32>, usize) {
  331 |     let mut rank = Vec::with_capacity(bitmap.data.len().div_ceil(RANK_BLOCK_BYTES));
  332 |     let mut ones = 0usize;
  333 |     for block in bitmap.data.chunks(RANK_BLOCK_BYTES) {
  334 |         rank.push(ones as u32);
  335 |         ones += count_ones(block);
  336 |     }
  337 |     (rank, ones)
  338 | }
  339 | 
  340 | #[derive(Debug)]
  341 | struct FragmentEntry {
  342 |     fragment_id: u32,
  343 |     sequence: Arc<RowIdSequence>,
  344 |     deletion_vector: Arc<DeletionVector>,
  345 |     segments: Vec<SegmentEntry>,
  346 |     start: u64,
  347 |     end: u64,
  348 |     /// Row ids the merged build reads one by one.
  349 |     merge_rows: u64,
  350 | }
  351 | 
  352 | impl FragmentEntry {
  353 |     fn new(source: &FragmentRowIdIndex) -> Option<Self> {
  354 |         let mut segments: Vec<SegmentEntry> = Vec::new();
  355 |         let mut start_offset: u32 = 0;
  356 |         let mut merge_rows: u64 = 0;
  357 |         let deleted = !source.deletion_vector.is_empty();
  358 |         for (seq_idx, segment) in source.row_id_sequence.0.iter().enumerate() {
  359 |             let (lookup, len) = build_lookup(segment);
  360 |             // A `Range` without deletions decomposes in constant time.
  361 |             if deleted || !matches!(segment, U64Segment::Range(_)) {
  362 |                 merge_rows += len as u64;
  363 |             }
  364 |             // `range()` reports the span of a holed encoding, so ask `len` which
  365 |             // ids the segment actually holds before trusting those bounds.
  366 |             if len > 0
  367 |                 && let Some(range) = segment.range()
  368 |             {
  369 |                 segments.push(SegmentEntry {
  370 |                     seq_idx,
  371 |                     range,
  372 |                     start_offset,
  373 |                     lookup,
  374 |                 });
  375 |             }
  376 |             start_offset += len as u32;
  377 |         }
  378 |         let start = segments.iter().map(|entry| *entry.range.start()).min()?;
  379 |         let end = segments.iter().map(|entry| *entry.range.end()).max()?;
  380 |         Some(Self {
  381 |             fragment_id: source.fragment_id,
  382 |             sequence: source.row_id_sequence.clone(),
  383 |             deletion_vector: source.deletion_vector.clone(),
  384 |             segments,
  385 |             start,
  386 |             end,
  387 |             merge_rows,
  388 |         })
  389 |     }
  390 | 
  391 |     /// Address of `row_id` here, or `None` when the fragment lacks it or holds
  392 |     /// it deleted.
  393 |     fn resolve(&self, row_id: u64) -> Option<RowAddress> {
  394 |         for entry in &self.segments {
  395 |             if !entry.range.contains(&row_id) {
  396 |                 continue;
  397 |             }
  398 |             let Some(position) = entry.position(&self.sequence, row_id) else {
  399 |                 continue;
  400 |             };
  401 |             let row_offset = entry.start_offset + position as u32;
  402 |             if self.deletion_vector.contains(row_offset) {
  403 |                 continue;
  404 |             }
  405 |             return Some(RowAddress::new_from_parts(self.fragment_id, row_offset));
  406 |         }
  407 |         None
  408 |     }
  409 | }
  410 | 
  411 | /// Whether to answer lookups by probing the fragments rather than by merging
  412 | /// every row id.
  413 | ///
  414 | /// Probing costs the fragments that cover one id, per lookup; merging costs the
  415 | /// row ids it reads, once. So probe only when both stay on the right side of
  416 | /// [`MAX_PROBE_DEPTH`] and [`MERGE_ROWS_BUDGET`].
  417 | fn probing_beats_merging(fragments: &[FragmentEntry]) -> bool {
  418 |     let merge_rows: u64 = fragments.iter().map(|entry| entry.merge_rows).sum();
  419 |     merge_rows > MERGE_ROWS_BUDGET && max_overlap_depth(fragments) <= MAX_PROBE_DEPTH
  420 | }
  421 | 
  422 | /// Most fragments that cover any one row id.
  423 | fn max_overlap_depth(fragments: &[FragmentEntry]) -> u64 {
  424 |     let mut ends: Vec<u64> = fragments.iter().map(|entry| entry.end).collect();
  425 |     ends.sort_unstable();
  426 |     let mut closed = 0;
  427 |     let mut depth: u64 = 0;
  428 |     for (opened, entry) in fragments.iter().enumerate() {
  429 |         while closed < ends.len() && ends[closed] < entry.start {
  430 |             closed += 1;
  431 |         }
  432 |         depth = depth.max((opened + 1 - closed) as u64);
  433 |     }
  434 |     depth
  435 | }
  436 | 
  437 | /// Implicit max-`end` heap over `fragments`, padded to a power of two. Padding
  438 | /// leaves hold 0, which prunes for every id above 0 and is filtered by slot.
  439 | fn build_end_tree(fragments: &[FragmentEntry]) -> Vec<u64> {
  440 |     if fragments.is_empty() {
  441 |         return Vec::new();
  442 |     }
  443 |     let leaves = fragments.len().next_power_of_two();
  444 |     let mut tree = vec![0_u64; 2 * leaves];
  445 |     for (slot, entry) in fragments.iter().enumerate() {
  446 |         tree[leaves + slot] = entry.end;
  447 |     }
  448 |     for node in (1..leaves).rev() {
  449 |         tree[node] = tree[2 * node].max(tree[2 * node + 1]);
  450 |     }
  451 |     tree
  452 | }
  453 | 
  454 | impl DeepSizeOf for RowIdIndex {
  455 |     /// Charges the sequences and deletion vectors the `Arc`s keep alive, which
  456 |     /// a sequence cached under its own key is charged for as well.
  457 |     fn deep_size_of_children(&self, context: &mut lance_core::deepsize::Context) -> usize {
  458 |         let fragment_bytes: usize = self
  459 |             .fragments
  460 |             .iter()
  461 |             .map(|entry| {
  462 |                 entry.sequence.deep_size_of_children(context)
  463 |                     + entry.deletion_vector.deep_size_of_children(context)
  464 |                     + entry.segments.capacity() * std::mem::size_of::<SegmentEntry>()
  465 |                     + entry
  466 |                         .segments
  467 |                         .iter()
  468 |                         .map(|segment| match &segment.lookup {
  469 |                             SegmentLookup::Native => 0,
  470 |                             SegmentLookup::Positions(positions) => {
  471 |                                 positions.capacity() * std::mem::size_of::<(u64, u32)>()
  472 |                             }
  473 |                             SegmentLookup::BitmapRank(rank) => {
  474 |                                 rank.capacity() * std::mem::size_of::<u32>()
  475 |                             }
  476 |                         })
  477 |                         .sum::<usize>()
  478 |             })
  479 |             .sum();
  480 |         let merged_bytes: usize = self
  481 |             .merged
  482 |             .as_ref()
  483 |             .map(|merged| {
  484 |                 merged
  485 |                     .iter()
  486 |                     .map(|(_, (row_id_segment, address_segment))| {
  487 |                         (2 * std::mem::size_of::<u64>())
  488 |                             + std::mem::size_of::<(U64Segment, U64Segment)>()
  489 |                             + row_id_segment.deep_size_of_children(context)
  490 |                             + address_segment.deep_size_of_children(context)
  491 |                     })
  492 |                     .sum()
  493 |             })
  494 |             .unwrap_or(0);
  495 |         fragment_bytes
  496 |             + merged_bytes
  497 |             + self.fragments.capacity() * std::mem::size_of::<FragmentEntry>()
  498 |             + self.end_tree.capacity() * std::mem::size_of::<u64>()
  499 |     }
  500 | }
  501 | 
  502 | fn decompose_sequence(
  503 |     frag_index: &FragmentRowIdIndex,
  504 | ) -> Vec<(RangeInclusive<u64>, (U64Segment, U64Segment))> {
  505 |     let mut start_address: u64 = RowAddress::first_row(frag_index.fragment_id).into();
  506 |     let mut current_offset = 0u32;
  507 |     let no_deletions = frag_index.deletion_vector.is_empty();
  508 | 
  509 |     frag_index
  510 |         .row_id_sequence
  511 |         .0
  512 |         .iter()
  513 |         .filter_map(|segment| {
  514 |             let segment_len = segment.len();
  515 | 
  516 |             let result = if no_deletions {
  517 |                 decompose_segment_no_deletions(segment, start_address)
  518 |             } else {
  519 |                 decompose_segment_with_deletions(
  520 |                     segment,
  521 |                     start_address,
  522 |                     current_offset,
  523 |                     &frag_index.deletion_vector,
  524 |                 )
  525 |             };
  526 | 
  527 |             current_offset += segment_len as u32;
  528 |             start_address += segment_len as u64;
  529 | 
  530 |             result
  531 |         })
  532 |         .collect()
  533 | }
  534 | 
  535 | /// Build an IndexChunk from a list of (row_id, address) pairs.
  536 | fn build_chunk_from_pairs(mut pairs: Vec<(u64, u64)>) -> Option<IndexChunk> {
  537 |     if pairs.is_empty() {
  538 |         return None;
  539 |     }
  540 |     // Sorted, so the row id segment encodes as one a lookup can search rather
  541 |     // than an `Array` it has to scan. The address segment follows the pairing.
  542 |     pairs.sort_unstable_by_key(|(row_id, _)| *row_id);
  543 |     let (row_ids, addresses): (Vec<u64>, Vec<u64>) = pairs.into_iter().unzip();
  544 |     let row_id_segment = U64Segment::from_iter(row_ids);
  545 |     let address_segment = U64Segment::from_iter(addresses);
  546 |     let coverage = row_id_segment.range()?;
  547 |     Some((coverage, (row_id_segment, address_segment)))
  548 | }
  549 | 
  550 | /// Fast path: no deletions. O(1) for Range segments.
  551 | fn decompose_segment_no_deletions(segment: &U64Segment, start_address: u64) -> Option<IndexChunk> {
  552 |     match segment {
  553 |         U64Segment::Range(range) if !range.is_empty() => {
  554 |             let len = range.end - range.start;
  555 |             let row_id_segment = U64Segment::Range(range.clone());
  556 |             let address_segment = U64Segment::Range(start_address..start_address + len);
  557 |             let coverage = range.start..=range.end - 1;
  558 |             Some((coverage, (row_id_segment, address_segment)))
  559 |         }
  560 |         _ if segment.is_empty() => None,
  561 |         _ => {
  562 |             // Non-Range segments: must iterate to build address mapping.
  563 |             let pairs: Vec<(u64, u64)> = segment
  564 |                 .iter()
  565 |                 .enumerate()
  566 |                 .map(|(i, row_id)| (row_id, start_address + i as u64))
  567 |                 .collect();
  568 |             build_chunk_from_pairs(pairs)
  569 |         }
  570 |     }
  571 | }
  572 | 
  573 | /// Slow path: has deletions, must check each row.
  574 | fn decompose_segment_with_deletions(
  575 |     segment: &U64Segment,
  576 |     start_address: u64,
  577 |     current_offset: u32,
  578 |     deletion_vector: &DeletionVector,
  579 | ) -> Option<IndexChunk> {
  580 |     let pairs: Vec<(u64, u64)> = segment
  581 |         .iter()
  582 |         .enumerate()
  583 |         .filter_map(|(i, row_id)| {
  584 |             let row_offset = current_offset + i as u32;
  585 |             if !deletion_vector.contains(row_offset) {
  586 |                 Some((row_id, start_address + i as u64))
  587 |             } else {
  588 |                 None
  589 |             }
  590 |         })
  591 |         .collect();
  592 |     build_chunk_from_pairs(pairs)
  593 | }
  594 | 
  595 | type IndexChunk = (RangeInclusive<u64>, (U64Segment, U64Segment));
  596 | 
  597 | #[derive(Debug)]
  598 | enum RawIndexChunk {
  599 |     NonOverlapping(IndexChunk),
  600 |     Overlapping(RangeInclusive<u64>, Vec<IndexChunk>),
  601 | }
  602 | 
  603 | impl RawIndexChunk {
  604 |     fn range_end(&self) -> u64 {
  605 |         match self {
  606 |             Self::NonOverlapping((range, _)) => *range.end(),
  607 |             Self::Overlapping(range, _) => *range.end(),
  608 |         }
  609 |     }
  610 | }
  611 | 
  612 | /// Given a vector of index chunks, sort them and return an iterator of index chunks.
  613 | ///
  614 | /// The iterator will yield chunks that are non-overlapping or a set of chunks
  615 | /// that are overlapping.
  616 | fn prep_index_chunks(mut chunks: Vec<IndexChunk>) -> impl Iterator<Item = RawIndexChunk> {
  617 |     chunks.sort_by_key(|(range, _)| u64::MAX - *range.start());
  618 | 
  619 |     let mut output = Vec::new();
  620 | 
  621 |     // Start assuming non-overlapping in first chunk.
  622 |     if let Some(first_chunk) = chunks.pop() {
  623 |         output.push(RawIndexChunk::NonOverlapping(first_chunk));
  624 |     } else {
  625 |         // Early return for empty.
  626 |         return output.into_iter();
  627 |     }
  628 | 
  629 |     let mut current_range = 0..=0;
  630 |     let mut current_overlap = Vec::new();
  631 |     while let Some(chunk) = chunks.pop() {
  632 |         debug_assert_eq!(
  633 |             current_overlap
  634 |                 .iter()
  635 |                 .map(|(range, _): &IndexChunk| *range.start())
  636 |                 .min()
  637 |                 .unwrap_or_default(),
  638 |             *current_range.start(),
  639 |         );
  640 |         debug_assert_eq!(
  641 |             current_overlap
  642 |                 .iter()
  643 |                 .map(|(range, _): &IndexChunk| *range.end())
  644 |                 .max()
  645 |                 .unwrap_or_default(),
  646 |             *current_range.end(),
  647 |         );
  648 | 
  649 |         if current_overlap.is_empty() {
  650 |             // We haven't found overlap yet.
  651 |             let last_chunk_end = output.last().unwrap().range_end();
  652 |             if *chunk.0.start() <= last_chunk_end {
  653 |                 // We have found overlap.
  654 |                 match output.pop().unwrap() {
  655 |                     RawIndexChunk::NonOverlapping(chunk) => {
  656 |                         current_overlap.push(chunk);
  657 |                     }
  658 |                     _ => unreachable!(),
  659 |                 }
  660 |                 current_overlap.push(chunk);
  661 | 
  662 |                 let range_start = *current_overlap.first().unwrap().0.start();
  663 |                 let range_end = *current_overlap
  664 |                     .last()
  665 |                     .unwrap()
  666 |                     .0
  667 |                     .end()
  668 |                     .max(current_overlap.first().unwrap().0.end());
  669 |                 current_range = range_start..=range_end;
  670 |             } else {
  671 |                 // We are still in non-overlapping space.
  672 |                 output.push(RawIndexChunk::NonOverlapping(chunk));
  673 |             }
  674 |         } else {
  675 |             // We are making an overlap chunk
  676 |             if chunk.0.start() <= current_range.end() {
  677 |                 // We are still in overlap.
  678 |                 let range_end = *chunk.0.end().max(current_range.end());
  679 |                 current_range = *current_range.start()..=range_end;
  680 | 
  681 |                 current_overlap.push(chunk);
  682 |             } else {
  683 |                 // We have exited overlap.
  684 |                 output.push(RawIndexChunk::Overlapping(
  685 |                     std::mem::replace(&mut current_range, 0..=0),
  686 |                     std::mem::take(&mut current_overlap),
  687 |                 ));
  688 |                 output.push(RawIndexChunk::NonOverlapping(chunk));
  689 |             }
  690 |         }
  691 |     }
  692 |     debug_assert_eq!(
  693 |         current_overlap
  694 |             .iter()
  695 |             .map(|(range, _): &IndexChunk| *range.start())
  696 |             .min()
  697 |             .unwrap_or_default(),
  698 |         *current_range.start(),
  699 |     );
  700 |     debug_assert_eq!(
  701 |         current_overlap
  702 |             .iter()
  703 |             .map(|(range, _): &IndexChunk| *range.end())
  704 |             .max()
  705 |             .unwrap_or_default(),
  706 |         *current_range.end(),
  707 |     );
  708 | 
  709 |     if !current_overlap.is_empty() {
  710 |         output.push(RawIndexChunk::Overlapping(
  711 |             current_range.clone(),
  712 |             current_overlap,
  713 |         ));
  714 |     }
  715 | 
  716 |     output.into_iter()
  717 | }
  718 | 
  719 | fn merge_overlapping_chunks(overlapping_chunks: Vec<IndexChunk>) -> Result<IndexChunk> {
  720 |     let total_capacity = overlapping_chunks
  721 |         .iter()
  722 |         .map(|(_, (row_ids, _))| row_ids.len())
  723 |         .sum();
  724 |     let mut values = Vec::with_capacity(total_capacity);
  725 |     for (_, (row_ids, row_addrs)) in overlapping_chunks.iter() {
  726 |         values.extend(row_ids.iter().zip(row_addrs.iter()));
  727 |     }
  728 |     values.sort_by_key(|(row_id, _)| *row_id);
  729 |     // A duplicate row id here means two fragments claim the same live id: a
  730 |     // corrupt index, not a resolvable sparse-coverage case.
  731 |     if let Some(w) = values.windows(2).find(|w| w[0].0 == w[1].0) {
  732 |         return Err(Error::internal(format!(
  733 |             "row id index corrupt: stable row id {} is live in multiple fragments",
  734 |             w[0].0
  735 |         )));
  736 |     }
  737 |     let row_id_segment = U64Segment::from_iter(values.iter().map(|(row_id, _)| *row_id));
  738 |     let address_segment = U64Segment::from_iter(values.iter().map(|(_, row_addr)| *row_addr));
  739 | 
  740 |     let range = row_id_segment.range().unwrap();
  741 | 
  742 |     Ok((range, (row_id_segment, address_segment)))
  743 | }
  744 | 
  745 | #[cfg(test)]
  746 | impl RowIdIndex {
  747 |     /// Index that answers from the probe path, whatever the gate decided.
  748 |     fn probing(fragment_indices: &[FragmentRowIdIndex]) -> Result<Self> {
  749 |         let mut fragments: Vec<FragmentEntry> = fragment_indices
  750 |             .iter()
  751 |             .filter_map(FragmentEntry::new)
  752 |             .collect();
  753 |         fragments.sort_unstable_by_key(|entry| entry.start);
  754 |         Ok(Self {
  755 |             end_tree: build_end_tree(&fragments),
  756 |             fragments,
  757 |             merged: None,
  758 |         })
  759 |     }
  760 | }
  761 | 
  762 | #[cfg(test)]
  763 | mod tests {
  764 |     use super::*;
  765 |     use proptest::{
  766 |         prelude::{Just, Strategy, any},
  767 |         prop_assert, prop_assert_eq,
  768 |     };
  769 | 
  770 |     /// Sequence of `len` even row ids, held as a sorted array.
  771 |     fn sparse_sequence(len: u64) -> RowIdSequence {
  772 |         RowIdSequence(vec![U64Segment::SortedArray(
  773 |             (0..len).map(|value| value * 2).collect::<Vec<u64>>().into(),
  774 |         )])
  775 |     }
  776 | 
  777 |     fn fragment(fragment_id: u32, sequence: RowIdSequence) -> FragmentRowIdIndex {
  778 |         FragmentRowIdIndex {
  779 |             fragment_id,
  780 |             row_id_sequence: Arc::new(sequence),
  781 |             deletion_vector: Arc::new(DeletionVector::default()),
  782 |         }
  783 |     }
  784 | 
  785 |     #[test]
  786 |     fn test_new_builds_the_merged_map_unless_probing_wins() {
  787 |         // Ranges decompose in constant time, and a small sequence is cheap to
  788 |         // read whatever its encoding.
  789 |         let ranges = fragment(1, RowIdSequence(vec![U64Segment::Range(0..1_000_000)]));
  790 |         assert!(RowIdIndex::new(&[ranges]).unwrap().merged.is_some());
  791 |         let small = fragment(1, sparse_sequence(16));
  792 |         assert!(RowIdIndex::new(&[small]).unwrap().merged.is_some());
  793 | 
  794 |         // Past the row budget, with one fragment covering any id.
  795 |         let wide = fragment(1, sparse_sequence(MERGE_ROWS_BUDGET + 1));
  796 |         let index = RowIdIndex::new(&[wide]).unwrap();
  797 |         assert!(index.merged.is_none());
  798 |         assert_eq!(
  799 |             index.get(6).unwrap(),
  800 |             Some(RowAddress::new_from_parts(1, 3))
  801 |         );
  802 |     }
  803 | 
  804 |     #[test]
  805 |     fn test_deep_overlap_merges_however_many_rows_it_reads() {
  806 |         // Just past the row budget in total, interleaved so every fragment
  807 |         // covers every id: the depth alone forces the merged build.
  808 |         let fragments = MAX_PROBE_DEPTH + 1;
  809 |         let rows_per_fragment = MERGE_ROWS_BUDGET / fragments + 1;
  810 |         let deep: Vec<FragmentRowIdIndex> = (0..fragments as u32)
  811 |             .map(|id| {
  812 |                 let ids: Vec<u64> = (0..rows_per_fragment)
  813 |                     .map(|value| value * fragments + id as u64)
  814 |                     .collect();
  815 |                 fragment(id, RowIdSequence(vec![U64Segment::SortedArray(ids.into())]))
  816 |             })
  817 |             .collect();
  818 | 
  819 |         assert!(RowIdIndex::new(&deep).unwrap().merged.is_some());
  820 |     }
  821 | 
  822 |     #[test]
  823 |     fn test_probe_resolves_a_row_id_the_merged_map_rejects() {
  824 |         let sources = [
  825 |             fragment(1, RowIdSequence::from(&[0, 2][..])),
  826 |             fragment(2, RowIdSequence::from(&[1, 2][..])),
  827 |         ];
  828 |         assert!(RowIdIndex::new(&sources).is_err());
  829 | 
  830 |         let index = RowIdIndex::probing(&sources[..1]).unwrap();
  831 |         assert_eq!(
  832 |             index.get(2).unwrap(),
  833 |             Some(RowAddress::new_from_parts(1, 1))
  834 |         );
  835 |     }
  836 | 
  837 |     #[test]
  838 |     fn test_probe_errors_when_two_fragments_hold_an_id_live() {
  839 |         let sources = [
  840 |             fragment(1, RowIdSequence::from(&[0, 2][..])),
  841 |             fragment(2, RowIdSequence::from(&[1, 2][..])),
  842 |         ];
  843 |         let index = RowIdIndex::probing(&sources).unwrap();
  844 |         assert_eq!(
  845 |             index.get(0).unwrap(),
  846 |             Some(RowAddress::new_from_parts(1, 0))
  847 |         );
  848 | 
  849 |         let error = index.get(2).unwrap_err();
  850 |         assert!(matches!(&error, Error::Internal { .. }));
  851 |         assert!(
  852 |             error
  853 |                 .to_string()
  854 |                 .contains("stable row id 2 is live in multiple fragments")
  855 |         );
  856 | 
  857 |         let error = index.get_many(&[0, 2]).unwrap_err();
  858 |         assert!(matches!(&error, Error::Internal { .. }));
  859 |     }
  860 | 
  861 |     #[test]
  862 |     fn test_probe_ranks_a_bitmap_wider_than_one_block() {
  863 |         // Three rank blocks and a partial fourth, with every third slot a hole,
  864 |         // so each lookup combines a directory entry with a partial popcount.
  865 |         let span = (RANK_BLOCK_BYTES * 8 * 3 + 17) as u64;
  866 |         let present: Vec<bool> = (0..span).map(|slot| slot % 3 != 1).collect();
  867 |         let segment = U64Segment::RangeWithBitmap {
  868 |             range: 1000..1000 + span,
  869 |             bitmap: present.as_slice().into(),
  870 |         };
  871 |         let index = RowIdIndex::probing(&[fragment(7, RowIdSequence(vec![segment]))]).unwrap();
  872 |         let mut position = 0;
  873 |         for slot in 0..span {
  874 |             let found = index.get(1000 + slot).unwrap();
  875 |             if slot % 3 == 1 {
  876 |                 assert_eq!(found, None);
  877 |             } else {
  878 |                 assert_eq!(found, Some(RowAddress::new_from_parts(7, position)));
  879 |                 position += 1;
  880 |             }
  881 |         }
  882 |         assert_eq!(index.get(999).unwrap(), None);
  883 |         assert_eq!(index.get(1000 + span).unwrap(), None);
  884 |     }
  885 | 
  886 |     #[test]
  887 |     fn test_probe_finds_every_position_of_an_unsorted_array() {
  888 |         let row_ids: Vec<u64> = (0..2048).map(|value| (value * 7919) % 2048).collect();
  889 |         let index = RowIdIndex::probing(&[fragment(
  890 |             3,
  891 |             RowIdSequence(vec![U64Segment::Array(row_ids.clone().into())]),
  892 |         )])
  893 |         .unwrap();
  894 |         for (offset, row_id) in row_ids.iter().enumerate() {
  895 |             assert_eq!(
  896 |                 index.get(*row_id).unwrap(),
  897 |                 Some(RowAddress::new_from_parts(3, offset as u32))
  898 |             );
  899 |         }
  900 |         assert!(index.merged.is_none());
  901 |     }
  902 | 
  903 |     #[test]
  904 |     fn test_new_index() {
  905 |         let fragment_indices = vec![
  906 |             FragmentRowIdIndex {
  907 |                 fragment_id: 10,
  908 |                 row_id_sequence: Arc::new(RowIdSequence(vec![
  909 |                     U64Segment::Range(0..10),
  910 |                     U64Segment::RangeWithHoles {
  911 |                         range: 10..17,
  912 |                         holes: vec![12, 15].into(),
  913 |                     },
  914 |                     U64Segment::SortedArray(vec![20, 25, 30].into()),
  915 |                 ])),
  916 |                 deletion_vector: Arc::new(DeletionVector::default()),
  917 |             },
  918 |             FragmentRowIdIndex {
  919 |                 fragment_id: 20,
  920 |                 row_id_sequence: Arc::new(RowIdSequence(vec![
  921 |                     U64Segment::RangeWithBitmap {
  922 |                         range: 17..20,
  923 |                         bitmap: [true, false, true].as_slice().into(),
  924 |                     },
  925 |                     U64Segment::Array(vec![40, 50, 60].into()),
  926 |                 ])),
  927 |                 deletion_vector: Arc::new(DeletionVector::default()),
  928 |             },
  929 |         ];
  930 | 
  931 |         let index = RowIdIndex::new(&fragment_indices).unwrap();
  932 | 
  933 |         // Check various queries.
  934 |         assert_eq!(
  935 |             index.get(0).unwrap(),
  936 |             Some(RowAddress::new_from_parts(10, 0))
  937 |         );
  938 |         assert_eq!(index.get(15).unwrap(), None);
  939 |         assert_eq!(
  940 |             index.get(16).unwrap(),
  941 |             Some(RowAddress::new_from_parts(10, 14))
  942 |         );
  943 |         assert_eq!(
  944 |             index.get(17).unwrap(),
  945 |             Some(RowAddress::new_from_parts(20, 0))
  946 |         );
  947 |         assert_eq!(
  948 |             index.get(25).unwrap(),
  949 |             Some(RowAddress::new_from_parts(10, 16))
  950 |         );
  951 |         assert_eq!(
  952 |             index.get(40).unwrap(),
  953 |             Some(RowAddress::new_from_parts(20, 2))
  954 |         );
  955 |         assert_eq!(
  956 |             index.get(60).unwrap(),
  957 |             Some(RowAddress::new_from_parts(20, 4))
  958 |         );
  959 |         assert_eq!(index.get(61).unwrap(), None);
  960 |     }
  961 | 
  962 |     #[test]
  963 |     fn test_new_index_overlap() {
  964 |         let fragment_indices = vec![
  965 |             FragmentRowIdIndex {
  966 |                 fragment_id: 23,
  967 |                 row_id_sequence: Arc::new(RowIdSequence(vec![U64Segment::SortedArray(
  968 |                     vec![3, 6, 9].into(),
  969 |                 )])),
  970 |                 deletion_vector: Arc::new(DeletionVector::default()),
  971 |             },
  972 |             FragmentRowIdIndex {
  973 |                 fragment_id: 42,
  974 |                 row_id_sequence: Arc::new(RowIdSequence(vec![U64Segment::SortedArray(
  975 |                     vec![2, 5, 8].into(),
  976 |                 )])),
  977 |                 deletion_vector: Arc::new(DeletionVector::default()),
  978 |             },
  979 |             FragmentRowIdIndex {
  980 |                 fragment_id: 10,
  981 |                 row_id_sequence: Arc::new(RowIdSequence(vec![U64Segment::SortedArray(
  982 |                     vec![1, 4, 7].into(),
  983 |                 )])),
  984 |                 deletion_vector: Arc::new(DeletionVector::default()),
  985 |             },
  986 |         ];
  987 | 
  988 |         let index = RowIdIndex::new(&fragment_indices).unwrap();
  989 | 
  990 |         // Check various queries.
  991 |         assert_eq!(
  992 |             index.get(1).unwrap(),
  993 |             Some(RowAddress::new_from_parts(10, 0))
  994 |         );
  995 |         assert_eq!(
  996 |             index.get(2).unwrap(),
  997 |             Some(RowAddress::new_from_parts(42, 0))
  998 |         );
  999 |         assert_eq!(
 1000 |             index.get(3).unwrap(),
 1001 |             Some(RowAddress::new_from_parts(23, 0))
 1002 |         );
 1003 |         assert_eq!(
 1004 |             index.get(4).unwrap(),
 1005 |             Some(RowAddress::new_from_parts(10, 1))
 1006 |         );
 1007 |         assert_eq!(
 1008 |             index.get(5).unwrap(),
 1009 |             Some(RowAddress::new_from_parts(42, 1))
 1010 |         );
 1011 |         assert_eq!(
 1012 |             index.get(6).unwrap(),
 1013 |             Some(RowAddress::new_from_parts(23, 1))
 1014 |         );
 1015 |         assert_eq!(
 1016 |             index.get(7).unwrap(),
 1017 |             Some(RowAddress::new_from_parts(10, 2))
 1018 |         );
 1019 |         assert_eq!(
 1020 |             index.get(8).unwrap(),
 1021 |             Some(RowAddress::new_from_parts(42, 2))
 1022 |         );
 1023 |         assert_eq!(
 1024 |             index.get(9).unwrap(),
 1025 |             Some(RowAddress::new_from_parts(23, 2))
 1026 |         );
 1027 |     }
 1028 | 
 1029 |     #[test]
 1030 |     fn test_new_index_unsorted_row_ids() {
 1031 |         // Test case with unsorted row ids within fragments
 1032 |         let fragment_indices = vec![
 1033 |             FragmentRowIdIndex {
 1034 |                 fragment_id: 10,
 1035 |                 row_id_sequence: Arc::new(RowIdSequence(vec![U64Segment::Array(
 1036 |                     vec![9, 3, 6].into(), // Unsorted array
 1037 |                 )])),
 1038 |                 deletion_vector: Arc::new(DeletionVector::default()),
 1039 |             },
 1040 |             FragmentRowIdIndex {
 1041 |                 fragment_id: 20,
 1042 |                 row_id_sequence: Arc::new(RowIdSequence(vec![U64Segment::Array(
 1043 |                     vec![8, 2, 5].into(), // Unsorted array
 1044 |                 )])),
 1045 |                 deletion_vector: Arc::new(DeletionVector::default()),
 1046 |             },
 1047 |             FragmentRowIdIndex {
 1048 |                 fragment_id: 30,
 1049 |                 row_id_sequence: Arc::new(RowIdSequence(vec![U64Segment::Array(
 1050 |                     vec![7, 1, 4].into(), // Unsorted array
 1051 |                 )])),
 1052 |                 deletion_vector: Arc::new(DeletionVector::default()),
 1053 |             },
 1054 |         ];
 1055 | 
 1056 |         let index = RowIdIndex::new(&fragment_indices).unwrap();
 1057 | 
 1058 |         // Check that all row ids can be found regardless of their order in the segments
 1059 |         assert_eq!(
 1060 |             index.get(1).unwrap(),
 1061 |             Some(RowAddress::new_from_parts(30, 1))
 1062 |         );
 1063 |         assert_eq!(
 1064 |             index.get(2).unwrap(),
 1065 |             Some(RowAddress::new_from_parts(20, 1))
 1066 |         );
 1067 |         assert_eq!(
 1068 |             index.get(3).unwrap(),
 1069 |             Some(RowAddress::new_from_parts(10, 1))
 1070 |         );
 1071 |         assert_eq!(
 1072 |             index.get(4).unwrap(),
 1073 |             Some(RowAddress::new_from_parts(30, 2))
 1074 |         );
 1075 |         assert_eq!(
 1076 |             index.get(5).unwrap(),
 1077 |             Some(RowAddress::new_from_parts(20, 2))
 1078 |         );
 1079 |         assert_eq!(
 1080 |             index.get(6).unwrap(),
 1081 |             Some(RowAddress::new_from_parts(10, 2))
 1082 |         );
 1083 |         assert_eq!(
 1084 |             index.get(7).unwrap(),
 1085 |             Some(RowAddress::new_from_parts(30, 0))
 1086 |         );
 1087 |         assert_eq!(
 1088 |             index.get(8).unwrap(),
 1089 |             Some(RowAddress::new_from_parts(20, 0))
 1090 |         );
 1091 |         assert_eq!(
 1092 |             index.get(9).unwrap(),
 1093 |             Some(RowAddress::new_from_parts(10, 0))
 1094 |         );
 1095 | 
 1096 |         // Check that non-existent row ids return None
 1097 |         assert_eq!(index.get(0).unwrap(), None);
 1098 |         assert_eq!(index.get(10).unwrap(), None);
 1099 |     }
 1100 | 
 1101 |     #[test]
 1102 |     fn test_new_index_partial_overlap() {
 1103 |         let fragment_indices = vec![
 1104 |             FragmentRowIdIndex {
 1105 |                 fragment_id: 0,
 1106 |                 row_id_sequence: Arc::new(RowIdSequence(vec![U64Segment::RangeWithHoles {
 1107 |                     range: 0..100,
 1108 |                     holes: vec![50].into(),
 1109 |                 }])),
 1110 |                 deletion_vector: Arc::new(DeletionVector::default()),
 1111 |             },
 1112 |             FragmentRowIdIndex {
 1113 |                 fragment_id: 1,
 1114 |                 row_id_sequence: Arc::new(RowIdSequence(vec![U64Segment::Range(50..51)])),
 1115 |                 deletion_vector: Arc::new(DeletionVector::default()),
 1116 |             },
 1117 |         ];
 1118 | 
 1119 |         let index = RowIdIndex::new(&fragment_indices).unwrap();
 1120 | 
 1121 |         // Check various queries.
 1122 |         assert_eq!(
 1123 |             index.get(0).unwrap(),
 1124 |             Some(RowAddress::new_from_parts(0, 0))
 1125 |         );
 1126 |         assert_eq!(
 1127 |             index.get(49).unwrap(),
 1128 |             Some(RowAddress::new_from_parts(0, 49))
 1129 |         );
 1130 |         assert_eq!(
 1131 |             index.get(50).unwrap(),
 1132 |             Some(RowAddress::new_from_parts(1, 0))
 1133 |         );
 1134 |         assert_eq!(
 1135 |             index.get(51).unwrap(),
 1136 |             Some(RowAddress::new_from_parts(0, 50))
 1137 |         );
 1138 |         assert_eq!(
 1139 |             index.get(99).unwrap(),
 1140 |             Some(RowAddress::new_from_parts(0, 98))
 1141 |         );
 1142 |     }
 1143 | 
 1144 |     #[test]
 1145 |     fn test_overlapping_chunks_sparse_with_deletions() {
 1146 |         // Interleaved (overlapping) id ranges plus a deletion that leaves a hole,
 1147 |         // so the union doesn't tile the span. Every live id must still resolve.
 1148 |         let fragment_indices = vec![
 1149 |             FragmentRowIdIndex {
 1150 |                 fragment_id: 10,
 1151 |                 row_id_sequence: Arc::new(RowIdSequence(vec![U64Segment::SortedArray(
 1152 |                     vec![1, 3, 5, 7, 9].into(),
 1153 |                 )])),
 1154 |                 deletion_vector: Arc::new(DeletionVector::default()),
 1155 |             },
 1156 |             FragmentRowIdIndex {
 1157 |                 fragment_id: 20,
 1158 |                 row_id_sequence: Arc::new(RowIdSequence(vec![U64Segment::SortedArray(
 1159 |                     vec![0, 2, 4, 6, 8].into(),
 1160 |                 )])),
 1161 |                 // Delete offset 2 (id 4) -> a hole in the span.
 1162 |                 deletion_vector: Arc::new(DeletionVector::from_iter(vec![2])),
 1163 |             },
 1164 |         ];
 1165 | 
 1166 |         let index = RowIdIndex::new(&fragment_indices).unwrap();
 1167 | 
 1168 |         assert_eq!(
 1169 |             index.get(0).unwrap(),
 1170 |             Some(RowAddress::new_from_parts(20, 0))
 1171 |         );
 1172 |         assert_eq!(
 1173 |             index.get(1).unwrap(),
 1174 |             Some(RowAddress::new_from_parts(10, 0))
 1175 |         );
 1176 |         assert_eq!(
 1177 |             index.get(2).unwrap(),
 1178 |             Some(RowAddress::new_from_parts(20, 1))
 1179 |         );
 1180 |         assert_eq!(
 1181 |             index.get(3).unwrap(),
 1182 |             Some(RowAddress::new_from_parts(10, 1))
 1183 |         );
 1184 |         assert_eq!(index.get(4).unwrap(), None);
 1185 |         // Surviving ids keep their original offsets (the hole is not compacted).
 1186 |         assert_eq!(
 1187 |             index.get(6).unwrap(),
 1188 |             Some(RowAddress::new_from_parts(20, 3))
 1189 |         );
 1190 |         assert_eq!(
 1191 |             index.get(8).unwrap(),
 1192 |             Some(RowAddress::new_from_parts(20, 4))
 1193 |         );
 1194 |         assert_eq!(
 1195 |             index.get(9).unwrap(),
 1196 |             Some(RowAddress::new_from_parts(10, 4))
 1197 |         );
 1198 |     }
 1199 | 
 1200 |     #[test]
 1201 |     fn test_index_with_deletion_vector() {
 1202 |         let deletion_vector = DeletionVector::from_iter(vec![2, 3]);
 1203 | 
 1204 |         let fragment_indices = vec![FragmentRowIdIndex {
 1205 |             fragment_id: 10,
 1206 |             row_id_sequence: Arc::new(RowIdSequence(vec![U64Segment::Range(0..6)])),
 1207 |             deletion_vector: Arc::new(deletion_vector),
 1208 |         }];
 1209 | 
 1210 |         let index = RowIdIndex::new(&fragment_indices).unwrap();
 1211 | 
 1212 |         assert_eq!(
 1213 |             index.get(0).unwrap(),
 1214 |             Some(RowAddress::new_from_parts(10, 0))
 1215 |         );
 1216 |         assert_eq!(
 1217 |             index.get(1).unwrap(),
 1218 |             Some(RowAddress::new_from_parts(10, 1))
 1219 |         );
 1220 |         assert_eq!(
 1221 |             index.get(4).unwrap(),
 1222 |             Some(RowAddress::new_from_parts(10, 4))
 1223 |         );
 1224 |         assert_eq!(
 1225 |             index.get(5).unwrap(),
 1226 |             Some(RowAddress::new_from_parts(10, 5))
 1227 |         );
 1228 | 
 1229 |         assert_eq!(index.get(2).unwrap(), None);
 1230 |         assert_eq!(index.get(3).unwrap(), None);
 1231 |     }
 1232 | 
 1233 |     #[test]
 1234 |     fn test_empty_fragment_sequences() {
 1235 |         let fragment_indices = vec![
 1236 |             FragmentRowIdIndex {
 1237 |                 fragment_id: 10,
 1238 |                 row_id_sequence: Arc::new(RowIdSequence(vec![])),
 1239 |                 deletion_vector: Arc::new(DeletionVector::default()),
 1240 |             },
 1241 |             FragmentRowIdIndex {
 1242 |                 fragment_id: 20,
 1243 |                 row_id_sequence: Arc::new(RowIdSequence(vec![U64Segment::Range(5..8)])),
 1244 |                 deletion_vector: Arc::new(DeletionVector::default()),
 1245 |             },
 1246 |         ];
 1247 | 
 1248 |         let index = RowIdIndex::new(&fragment_indices).unwrap();
 1249 | 
 1250 |         assert_eq!(
 1251 |             index.get(5).unwrap(),
 1252 |             Some(RowAddress::new_from_parts(20, 0))
 1253 |         );
 1254 |         assert_eq!(
 1255 |             index.get(7).unwrap(),
 1256 |             Some(RowAddress::new_from_parts(20, 2))
 1257 |         );
 1258 |         assert_eq!(index.get(4).unwrap(), None);
 1259 |     }
 1260 | 
 1261 |     #[test]
 1262 |     fn test_completely_empty_index() {
 1263 |         let fragment_indices = vec![];
 1264 |         let index = RowIdIndex::new(&fragment_indices).unwrap();
 1265 | 
 1266 |         assert_eq!(index.get(0).unwrap(), None);
 1267 |         assert_eq!(index.get(100).unwrap(), None);
 1268 |     }
 1269 | 
 1270 |     #[test]
 1271 |     fn test_non_overlapping_ranges() {
 1272 |         let fragment_indices = vec![
 1273 |             FragmentRowIdIndex {
 1274 |                 fragment_id: 10,
 1275 |                 row_id_sequence: Arc::new(RowIdSequence(vec![U64Segment::Range(0..5)])),
 1276 |                 deletion_vector: Arc::new(DeletionVector::default()),
 1277 |             },
 1278 |             FragmentRowIdIndex {
 1279 |                 fragment_id: 20,
 1280 |                 row_id_sequence: Arc::new(RowIdSequence(vec![U64Segment::Range(5..10)])),
 1281 |                 deletion_vector: Arc::new(DeletionVector::default()),
 1282 |             },
 1283 |             FragmentRowIdIndex {
 1284 |                 fragment_id: 30,
 1285 |                 row_id_sequence: Arc::new(RowIdSequence(vec![U64Segment::Range(10..15)])),
 1286 |                 deletion_vector: Arc::new(DeletionVector::default()),
 1287 |             },
 1288 |         ];
 1289 | 
 1290 |         let index = RowIdIndex::new(&fragment_indices).unwrap();
 1291 | 
 1292 |         assert_eq!(
 1293 |             index.get(0).unwrap(),
 1294 |             Some(RowAddress::new_from_parts(10, 0))
 1295 |         );
 1296 |         assert_eq!(
 1297 |             index.get(4).unwrap(),
 1298 |             Some(RowAddress::new_from_parts(10, 4))
 1299 |         );
 1300 |         assert_eq!(
 1301 |             index.get(5).unwrap(),
 1302 |             Some(RowAddress::new_from_parts(20, 0))
 1303 |         );
 1304 |         assert_eq!(
 1305 |             index.get(9).unwrap(),
 1306 |             Some(RowAddress::new_from_parts(20, 4))
 1307 |         );
 1308 |         assert_eq!(
 1309 |             index.get(10).unwrap(),
 1310 |             Some(RowAddress::new_from_parts(30, 0))
 1311 |         );
 1312 |         assert_eq!(
 1313 |             index.get(14).unwrap(),
 1314 |             Some(RowAddress::new_from_parts(30, 4))
 1315 |         );
 1316 |     }
 1317 | 
 1318 |     fn arbitrary_row_ids(
 1319 |         num_fragments_range: std::ops::Range<usize>,
 1320 |         frag_size_range: std::ops::Range<usize>,
 1321 |     ) -> impl Strategy<Value = Vec<(u32, Arc<RowIdSequence>)>> {
 1322 |         let fragment_sizes = proptest::collection::vec(frag_size_range, num_fragments_range);
 1323 |         fragment_sizes.prop_flat_map(|fragment_sizes| {
 1324 |             let num_rows = fragment_sizes.iter().sum::<usize>() as u64;
 1325 |             let row_ids = 0..num_rows;
 1326 |             let row_ids = row_ids.collect::<Vec<_>>();
 1327 |             let row_ids_shuffled = proptest::strategy::Just(row_ids).prop_shuffle();
 1328 |             row_ids_shuffled.prop_map(move |row_ids| {
 1329 |                 let mut sequences = Vec::with_capacity(fragment_sizes.len());
 1330 |                 let mut i = 0;
 1331 |                 for size in &fragment_sizes {
 1332 |                     let end = i + size;
 1333 |                     let sequence =
 1334 |                         RowIdSequence(vec![U64Segment::from_slice(row_ids[i..end].into())]);
 1335 |                     sequences.push((i as u32, Arc::new(sequence)));
 1336 |                     i = end;
 1337 |                 }
 1338 |                 sequences
 1339 |             })
 1340 |         })
 1341 |     }
 1342 | 
 1343 |     fn arbitrary_row_ids_with_deletions(
 1344 |         num_fragments_range: std::ops::Range<usize>,
 1345 |         frag_size_range: std::ops::Range<usize>,
 1346 |     ) -> impl Strategy<Value = Vec<(u32, Arc<RowIdSequence>, Arc<DeletionVector>)>> {
 1347 |         arbitrary_row_ids(num_fragments_range, frag_size_range)
 1348 |             .prop_flat_map(|row_ids| {
 1349 |                 let num_rows = row_ids
 1350 |                     .iter()
 1351 |                     .map(|(_, sequence)| sequence.len() as usize)
 1352 |                     .sum::<usize>();
 1353 |                 (
 1354 |                     Just(row_ids),
 1355 |                     proptest::collection::vec(any::<bool>(), num_rows),
 1356 |                 )
 1357 |             })
 1358 |             .prop_map(|(row_ids, deleted_rows)| {
 1359 |                 let mut deleted_rows = deleted_rows.into_iter();
 1360 |                 row_ids
 1361 |                     .into_iter()
 1362 |                     .map(|(fragment_id, sequence)| {
 1363 |                         let mut deletion_bitmap = roaring::RoaringBitmap::new();
 1364 |                         for offset in 0..sequence.len() as u32 {
 1365 |                             if deleted_rows.next().unwrap() {
 1366 |                                 deletion_bitmap.insert(offset);
 1367 |                             }
 1368 |                         }
 1369 |                         (
 1370 |                             fragment_id,
 1371 |                             sequence,
 1372 |                             Arc::new(DeletionVector::Bitmap(deletion_bitmap)),
 1373 |                         )
 1374 |                     })
 1375 |                     .collect()
 1376 |             })
 1377 |     }
 1378 | 
 1379 |     #[test]
 1380 |     fn test_large_range_segments_no_deletions() {
 1381 |         // Simulates a real-world scenario: many fragments with large Range segments
 1382 |         // and no deletions. Before optimization, this would iterate over all rows
 1383 |         // (O(total_rows)). After optimization, it's O(num_fragments).
 1384 |         let rows_per_fragment = 250_000u64;
 1385 |         let num_fragments = 100u32;
 1386 |         let mut offset = 0u64;
 1387 | 
 1388 |         let fragment_indices: Vec<FragmentRowIdIndex> = (0..num_fragments)
 1389 |             .map(|frag_id| {
 1390 |                 let start = offset;
 1391 |                 offset += rows_per_fragment;
 1392 |                 FragmentRowIdIndex {
 1393 |                     fragment_id: frag_id,
 1394 |                     row_id_sequence: Arc::new(RowIdSequence(vec![U64Segment::Range(
 1395 |                         start..start + rows_per_fragment,
 1396 |                     )])),
 1397 |                     deletion_vector: Arc::new(DeletionVector::default()),
 1398 |                 }
 1399 |             })
 1400 |             .collect();
 1401 | 
 1402 |         let start = std::time::Instant::now();
 1403 |         let index = RowIdIndex::new(&fragment_indices).unwrap();
 1404 |         let elapsed = start.elapsed();
 1405 | 
 1406 |         // Verify correctness at boundaries
 1407 |         assert_eq!(
 1408 |             index.get(0).unwrap(),
 1409 |             Some(RowAddress::new_from_parts(0, 0))
 1410 |         );
 1411 |         assert_eq!(
 1412 |             index.get(rows_per_fragment - 1).unwrap(),
 1413 |             Some(RowAddress::new_from_parts(0, rows_per_fragment as u32 - 1))
 1414 |         );
 1415 |         assert_eq!(
 1416 |             index.get(rows_per_fragment).unwrap(),
 1417 |             Some(RowAddress::new_from_parts(1, 0))
 1418 |         );
 1419 |         let last_row = num_fragments as u64 * rows_per_fragment - 1;
 1420 |         assert_eq!(
 1421 |             index.get(last_row).unwrap(),
 1422 |             Some(RowAddress::new_from_parts(
 1423 |                 num_fragments - 1,
 1424 |                 rows_per_fragment as u32 - 1
 1425 |             ))
 1426 |         );
 1427 |         assert_eq!(index.get(last_row + 1).unwrap(), None);
 1428 | 
 1429 |         // With the optimization, building an index for 25M rows across 100 fragments
 1430 |         // should complete in well under 1 second (typically < 1ms).
 1431 |         assert!(
 1432 |             elapsed.as_secs() < 1,
 1433 |             "Index build took {:?} for {} fragments x {} rows = {} total rows. \
 1434 |              This suggests the O(rows) -> O(fragments) optimization is not working.",
 1435 |             elapsed,
 1436 |             num_fragments,
 1437 |             rows_per_fragment,
 1438 |             num_fragments as u64 * rows_per_fragment,
 1439 |         );
 1440 |     }
 1441 | 
 1442 |     #[test]
 1443 |     fn test_large_range_segments_with_deletions() {
 1444 |         let rows_per_fragment = 1_000u64;
 1445 |         let num_fragments = 10u32;
 1446 |         let mut offset = 0u64;
 1447 | 
 1448 |         let fragment_indices: Vec<FragmentRowIdIndex> = (0..num_fragments)
 1449 |             .map(|frag_id| {
 1450 |                 let start = offset;
 1451 |                 offset += rows_per_fragment;
 1452 | 
 1453 |                 // Delete every 3rd row (offsets 0, 3, 6, ...) within each fragment.
 1454 |                 let mut deleted = roaring::RoaringBitmap::new();
 1455 |                 for i in (0..rows_per_fragment as u32).step_by(3) {
 1456 |                     deleted.insert(i);
 1457 |                 }
 1458 | 
 1459 |                 FragmentRowIdIndex {
 1460 |                     fragment_id: frag_id,
 1461 |                     row_id_sequence: Arc::new(RowIdSequence(vec![U64Segment::Range(
 1462 |                         start..start + rows_per_fragment,
 1463 |                     )])),
 1464 |                     deletion_vector: Arc::new(DeletionVector::Bitmap(deleted)),
 1465 |                 }
 1466 |             })
 1467 |             .collect();
 1468 | 
 1469 |         let index = RowIdIndex::new(&fragment_indices).unwrap();
 1470 | 
 1471 |         // Deleted rows (offset 0, 3, 6, ...) should not be found.
 1472 |         // Row ID 0 has offset 0 in fragment 0 -> deleted.
 1473 |         assert_eq!(index.get(0).unwrap(), None);
 1474 |         // Row ID 3 has offset 3 in fragment 0 -> deleted.
 1475 |         assert_eq!(index.get(3).unwrap(), None);
 1476 | 
 1477 |         // Non-deleted rows should resolve correctly.
 1478 |         // Row ID 1 has offset 1 in fragment 0 -> address (frag=0, row=1).
 1479 |         assert_eq!(
 1480 |             index.get(1).unwrap(),
 1481 |             Some(RowAddress::new_from_parts(0, 1))
 1482 |         );
 1483 |         // Row ID 2 has offset 2 in fragment 0 -> address (frag=0, row=2).
 1484 |         assert_eq!(
 1485 |             index.get(2).unwrap(),
 1486 |             Some(RowAddress::new_from_parts(0, 2))
 1487 |         );
 1488 |         // Row ID 4 has offset 4 in fragment 0 -> address (frag=0, row=4).
 1489 |         assert_eq!(
 1490 |             index.get(4).unwrap(),
 1491 |             Some(RowAddress::new_from_parts(0, 4))
 1492 |         );
 1493 | 
 1494 |         // Check second fragment: row IDs start at 1000.
 1495 |         // Row ID 1000 has offset 0 in fragment 1 -> deleted.
 1496 |         assert_eq!(index.get(rows_per_fragment).unwrap(), None);
 1497 |         // Row ID 1001 has offset 1 in fragment 1 -> address (frag=1, row=1).
 1498 |         assert_eq!(
 1499 |             index.get(rows_per_fragment + 1).unwrap(),
 1500 |             Some(RowAddress::new_from_parts(1, 1))
 1501 |         );
 1502 | 
 1503 |         // Last fragment, last non-deleted row.
 1504 |         // Row ID 9999 has offset 999 in fragment 9 -> 999 % 3 == 0 -> deleted.
 1505 |         let last_row = num_fragments as u64 * rows_per_fragment - 1;
 1506 |         assert_eq!(index.get(last_row).unwrap(), None);
 1507 |         // Row ID 9998 has offset 998 -> 998 % 3 == 2 -> not deleted.
 1508 |         assert_eq!(
 1509 |             index.get(last_row - 1).unwrap(),
 1510 |             Some(RowAddress::new_from_parts(num_fragments - 1, 998))
 1511 |         );
 1512 | 
 1513 |         // Out of range.
 1514 |         assert_eq!(index.get(last_row + 1).unwrap(), None);
 1515 |     }
 1516 | 
 1517 |     proptest::proptest! {
 1518 |         #[test]
 1519 |         fn test_new_index_robustness(
 1520 |             row_ids in arbitrary_row_ids_with_deletions(0..5, 0..32)
 1521 |         ) {
 1522 |             let fragment_indices: Vec<FragmentRowIdIndex> = row_ids
 1523 |                 .iter()
 1524 |                 .map(|(frag_id, sequence, deletion_vector)| FragmentRowIdIndex {
 1525 |                     fragment_id: *frag_id,
 1526 |                     row_id_sequence: sequence.clone(),
 1527 |                     deletion_vector: deletion_vector.clone(),
 1528 |                 })
 1529 |                 .collect();
 1530 | 
 1531 |             let merged = RowIdIndex::new(&fragment_indices).unwrap();
 1532 |             let probing = RowIdIndex::probing(&fragment_indices).unwrap();
 1533 |             for index in [&merged, &probing] {
 1534 |                 for (frag_id, sequence, deletion_vector) in row_ids.iter() {
 1535 |                     for (local_offset, row_id) in sequence.iter().enumerate() {
 1536 |                         let expected = if deletion_vector.contains(local_offset as u32) {
 1537 |                             None
 1538 |                         } else {
 1539 |                             Some(RowAddress::new_from_parts(*frag_id, local_offset as u32))
 1540 |                         };
 1541 |                         prop_assert_eq!(
 1542 |                             index.get(row_id).unwrap(),
 1543 |                             expected,
 1544 |                             "Row id {} in sequence {:?} not found in index {:?}",
 1545 |                             row_id,
 1546 |                             sequence,
 1547 |                             index
 1548 |                         );
 1549 |                     }
 1550 |                 }
 1551 |             }
 1552 |         }
 1553 | 
 1554 |         #[test]
 1555 |         fn test_new_index_moved_row_id(
 1556 |             row_id in any::<u64>(),
 1557 |             source_fragment in 0u32..1024,
 1558 |             fragment_delta in 1u32..1024,
 1559 |         ) {
 1560 |             let target_fragment = source_fragment + fragment_delta;
 1561 |             let fragment_indices = [
 1562 |                 FragmentRowIdIndex {
 1563 |                     fragment_id: source_fragment,
 1564 |                     row_id_sequence: Arc::new(RowIdSequence::from(&[row_id][..])),
 1565 |                     deletion_vector: Arc::new(DeletionVector::Bitmap(
 1566 |                         roaring::RoaringBitmap::from_iter([0]),
 1567 |                     )),
 1568 |                 },
 1569 |                 FragmentRowIdIndex {
 1570 |                     fragment_id: target_fragment,
 1571 |                     row_id_sequence: Arc::new(RowIdSequence::from(&[row_id][..])),
 1572 |                     deletion_vector: Arc::new(DeletionVector::default()),
 1573 |                 },
 1574 |             ];
 1575 | 
 1576 |             let index = RowIdIndex::new(&fragment_indices).unwrap();
 1577 |             prop_assert_eq!(
 1578 |                 index.get(row_id).unwrap(),
 1579 |                 Some(RowAddress::new_from_parts(target_fragment, 0))
 1580 |             );
 1581 |         }
 1582 | 
 1583 |         #[test]
 1584 |         fn test_new_index_rejects_duplicate_live_row_id(
 1585 |             row_id in any::<u64>(),
 1586 |             first_fragment in 0u32..1024,
 1587 |             fragment_delta in 1u32..1024,
 1588 |         ) {
 1589 |             let second_fragment = first_fragment + fragment_delta;
 1590 |             let fragment_indices = [
 1591 |                 FragmentRowIdIndex {
 1592 |                     fragment_id: first_fragment,
 1593 |                     row_id_sequence: Arc::new(RowIdSequence::from(&[row_id][..])),
 1594 |                     deletion_vector: Arc::new(DeletionVector::default()),
 1595 |                 },
 1596 |                 FragmentRowIdIndex {
 1597 |                     fragment_id: second_fragment,
 1598 |                     row_id_sequence: Arc::new(RowIdSequence::from(&[row_id][..])),
 1599 |                     deletion_vector: Arc::new(DeletionVector::default()),
 1600 |                 },
 1601 |             ];
 1602 | 
 1603 |             let error = RowIdIndex::new(&fragment_indices).unwrap_err();
 1604 |             let is_internal = matches!(&error, Error::Internal { .. });
 1605 |             let expected_message =
 1606 |                 format!("stable row id {row_id} is live in multiple fragments");
 1607 |             let error_message = error.to_string();
 1608 |             prop_assert!(is_internal);
 1609 |             prop_assert!(error_message.contains(&expected_message));
 1610 |         }
 1611 |     }
 1612 | 
 1613 |     #[test]
 1614 |     fn test_index_resolves_range_segments() {
 1615 |         let live: Vec<u64> = (1000..3000u64)
 1616 |             .filter(|v| !(1200..1900).contains(v))
 1617 |             .collect();
 1618 |         let mut runs_sequence = RowIdSequence::from(live.as_slice());
 1619 |         assert!(runs_sequence.use_range_segments());
 1620 |         let index = RowIdIndex::new(&[fragment(7, runs_sequence)]).unwrap();
 1621 |         for (position, &row_id) in live.iter().enumerate() {
 1622 |             assert_eq!(
 1623 |                 index.get(row_id).unwrap(),
 1624 |                 Some(RowAddress::new_from_parts(7, position as u32)),
 1625 |                 "row id {row_id}"
 1626 |             );
 1627 |         }
 1628 |         assert_eq!(index.get(1500).unwrap(), None);
 1629 |         let addr = |position: u32| Some(RowAddress::new_from_parts(7, position));
 1630 |         assert_eq!(
 1631 |             index.get_many(&[2999, 1000, 1199, 1900, 1500]).unwrap(),
 1632 |             vec![
 1633 |                 addr(live.len() as u32 - 1),
 1634 |                 addr(0),
 1635 |                 addr(199),
 1636 |                 addr(200),
 1637 |                 None
 1638 |             ]
 1639 |         );
 1640 |     }
 1641 | }
``````
