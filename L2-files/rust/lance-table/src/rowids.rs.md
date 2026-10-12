> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/rowids.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `60042d473d14f91f487bd312c3e4230ce6b39b26c959fdd3b74f67fecb584650`. Reviewed physical lines: 1-2309.

[Module](../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Row-ID sequence facade, construction and mutation, stateful selection, ID-mask to positional-range conversion, set conversion, slicing, rechunking and ReadBatchParams selection. (rust/lance-table/src/rowids.rs:1-2309)

## Complete range analysis

### Lines 1-38

SPDX/module docs describe fragment-order row IDs and dataset-wide RowIdIndex. bitmap,encoded_array,index,runs,serde modules are private; segment/version are public despite the preceding all-private comment. Reexports expose FragmentRowIdIndex,RowIdIndex,read_row_ids,write_row_ids. Imports connect DeepSizeOf,core errors,ReadBatchParams,RowAddrMask/TreeMap/RowSetOps,exact-size iterator adapter,segment cursor and tracing. No storage IO is performed by this file; serialization is a reexport from serde. (rust/lance-table/src/rowids.rs:1-38)

### Lines 39-66

Public RowIdSequence is a private Vec<U64Segment> tuple field, deriving Debug,Clone,DeepSizeOf,PartialEq,Eq,Default. Equality compares representations, not only yielded IDs. Type contract assumes table-wide unique u64 IDs except tombstones, without requiring global order/contiguity. Crate-visible Debug/Default RowIdSequenceCursor stores segment index, preceding row count, optional cached segment length, SegmentCursorState and last requested index; it owns no sequence reference or identity. (rust/lance-table/src/rowids.rs:39-66)

### Lines 67-91

Private advance_segment adds cached length (or0), increments segment index, clears length and resets segment cursor. get resets the whole cursor if index precedes rows_passed or last_index, then remembers the request. It scans segments, lazily caches len, delegates local rank to SegmentCursorState or advances. Empty segments are skipped; exhaustion returns None. Arithmetic is unchecked usize. Switching source/mutating it without a reset is unsupported by the state assumptions but not prevented by a lifetime tie. (rust/lance-table/src/rowids.rs:67-91)

### Lines 92-130

extend_range returns immediately for empty/reversed selection, leaving state/output unchanged. Otherwise it resets on backward start, stores requested end-1 even if beyond EOF, walks segments and appends clipped local subranges. End exhaustion truncates silently. Finishing a segment advances and resets the bitmap state. It advances logical count by requested count, assuming segment extension emitted exactly that many valid values; malformed segment invariants are not revalidated. (rust/lance-table/src/rowids.rs:92-130)

### Lines 131-172

extend_dense_range duplicates the sparse sequence traversal but calls SegmentCursorState::extend_dense_range. Comment says sharing the loop measurably slowed sparse system-only scans; this is source rationale, not a benchmark measured here. Empty/backward/EOF/segment-reset behavior matches the ordinary path. No density test occurs inside this method. (rust/lance-table/src/rowids.rs:131-172)

### Lines 173-208

Display reads up to11 front values and11 back values because break is after len>10, reverses the back vector and probes one remaining item to choose ellipsis. Front values are written without separators; last values use comma-space; ellipsis is comma-space-dot-dot-dot. Thus Range0..3 displays [012], not a conventional comma-separated list. At most23 values are consumed, but underlying sparse-span iteration may scan more slots. It is diagnostic text, not a parsable canonical serialization. (rust/lance-table/src/rowids.rs:173-208)

### Lines 209-236

From<Range<u64>> wraps one raw range without validation; From<&[u64]> wraps one selected segment even for empty input and assumes uniqueness. Private find_duplicate first checks strictly increasing adjacent pairs without allocating; if that fails, clones/sorts all values and returns the first equal pair, hence the smallest duplicate value after sorting. Unsorted unique inputs pay the sorting copy; empty/singleton input passes the fast check. (rust/lance-table/src/rowids.rs:209-236)

### Lines 237-266

new uses empty Vec Default. try_from_iter collects all input into Vec, returns canonical empty sequence for empty input, rejects a duplicate with InvalidInput including duplicate ID and total count, then constructs one U64Segment from the original order. It validates uniqueness only within this input. Comment says commit does not recheck dataset-wide uniqueness; that downstream claim remains pending commit analysis. Segment constructor is another collection stage, though moving a Vec iterator can permit allocation reuse; no streaming interface or global uniqueness proof. (rust/lance-table/src/rowids.rs:237-266)

### Lines 267-278

iter flat_maps boxed segment iterators and exposes DoubleEndedIterator, preserving segment order. len sums segment.len as u64 with ordinary addition, inheriting per-segment usize casts/popcount work. is_empty checks only whether the segment Vec is empty, not whether total len is0. From(0..0), From(empty slice) and delete-all can therefore have len0 but is_empty false, unlike new/try_from_iter(empty). (rust/lance-table/src/rowids.rs:267-278)

### Lines 279-301

row_id_range scans segment bounds twice for minimum start and maximum end and returns inclusive bounds, or None if no segment supplies bounds. It is conservative and does not test membership. The comment that no values implies None has a caveat: a nonempty enclosing bitmap range with zero present bits still supplies bounds via segment.range (rust/lance-table/src/rowids/segment.rs:360-376). It does not canonicalize malformed compressed array bases. (rust/lance-table/src/rowids.rs:279-301)

### Lines 302-320

extend consumes another sequence, merging only the existing final plain Range and incoming first plain Range when their endpoints touch. It replaces the final segment then moves remaining incoming segments; otherwise appends all. No overlap/duplicate/order validation, empty-segment cleanup, total-length overflow check or other representation optimization. Existing internal adjacent ranges are not swept. (rust/lance-table/src/rowids.rs:302-320)

### Lines 321-339

use_range_segments visits every segment and replaces each successful as_ranges result, reporting whether any changed. No config/version gate exists in this public method. Comment explains reader performance motivation and intended table opt-in. A contextual caller in transaction/manifest_build.rs75-122 gates through lance.row_ids.range_segments and read/rewrites changed inline sequences; full transaction integration remains pending. Wire expansion is the existing sequence serde path, not a new protobuf arm. (rust/lance-table/src/rowids.rs:321-339)

### Lines 340-366

delete first find_ids orders matching requested values by segment/local position. It replaces the backing Vec with a new Vec of equal capacity, clones unaffected segments from old storage, rebuilds affected ones through segment.delete and clones the tail. Even no matching IDs clones every segment. Empty results are retained as segments, so delete-all differs from mask-all. Duplicate requests are not deduplicated and may violate segment.delete preconditions; panic during rebuilding can leave self partially reconstructed. (rust/lance-table/src/rowids.rs:340-366)

### Lines 367-397

mask accepts u32 physical positions and returns Result but has no Err branch. It walks original segment cutoffs using unchecked len-as-u32 and additions, consumes each position below cutoff, subtracts original offset and passes local positions to segment.mask. Inputs are assumed ordered/unique: descending positions can underflow after crossing a segment, duplicates can trigger segment count shortcuts, and an out-of-range front can hide later smaller positions. Remaining past-end positions are ignored. Segments mutate incrementally, then empty segments are removed even for an empty mask. (rust/lance-table/src/rowids.rs:367-397)

### Lines 398-430

find_ids allocates one match Vec per segment and cycles segment enumeration. Despite the optimization comment, each input ID always scans exactly all segments because there is no break after a match; the iterator returns to its initial position for the next input. It first checks segment.range then segment.position, recording each matching local ordinal, including repeated requests and IDs present in multiple segments. Missing IDs are ignored. It sorts every segment match list but does not deduplicate. (rust/lance-table/src/rowids.rs:398-430)

### Lines 431-455

find_ids computes contiguous slices into its eventual output for nonempty match lists, then converts each ordinal back to an ID with segment.get(...).unwrap. Output is segment order then local ordinal order, preserving duplicate requested matches. Position/get consistency is assumed; inconsistent public segment state can panic. Work includes all-segment searches plus sorting and another get for every match. (rust/lance-table/src/rowids.rs:431-455)

### Lines 456-494

slice(len0) returns an empty borrowed RowIdSeqSlice regardless of offset. Positive len subtracts segment lengths to locate start and endpoint, then forms an inclusive segment slice. It does not return Result or clamp: offset at/past total or excessive positive len leads to slice-index panic; offset_start+len can overflow. A boundary end remains in the preceding segment because comparison is<=. Empty intermediate segments are traversed. Values are not copied at construction. (rust/lance-table/src/rowids.rs:456-494)

### Lines 495-515

segments exposes immutable &[U64Segment]. The preceding get/out-of-bounds/None doc lines are misplaced on this accessor; it always returns a slice. Public get instead scans segment lengths from the beginning, returns delegated local get at first containing ordinal or None after EOF. Offsets/additions are unchecked usize; bitmap len recomputation can scan its storage on every independent get. (rust/lance-table/src/rowids.rs:495-515)

### Lines 516-541

select creates a private cursor and last-index tracker and returns a lazy filter_map iterator. On consumption, strict decrease panics with Selection is not sorted; equal indices are allowed and repeat values. Out-of-bounds requests are dropped but still become last_index, so a later lower valid request panics. Crate-visible cursor() merely creates default state without binding its lifetime to self. (rust/lance-table/src/rowids.rs:516-541)

### Lines 542-558

cursor_with_dense_range_expansion chooses dense mode only for exactly one RangeWithBitmap segment. It computes segment.len once, seeds cached length and calls segment density advisory; other shapes return an uncached default cursor/false. The threshold is segment.len>=bitmap.len-floor(bitmap.len/4), from segment.rs346-354. This avoids repeating initial popcount but does not validate storage or select among multiple dense segments. (rust/lance-table/src/rowids.rs:542-558)

### Lines 559-593

select_range_with_cursor and dense counterpart preallocate Vec to selection.len before delegating; oversized requested ranges can allocate far beyond available output even though EOF is clipped. select_with_cursor returns lazy filter_map over the reusable cursor and permits decreasing indices via rewind. All three are pub(crate). Dense method trusts the caller policy. The returned iterator borrows the sequence and cursor for its lifetime, which extends beyond the method return while the iterator is used. The cursor itself stores scan state without a sequence reference, so it can be reused after that borrow ends. (rust/lance-table/src/rowids.rs:559-593)

### Lines 594-620

mask_to_offset_ranges is public and instrumented at debug with skip_all. It translates selected row IDs to present ordinal ranges, preserving sequence order and separate segment boundaries. Extracts finite allow-list with RowSetOps::len; bitmap segment count/total span and optional shared sorted-ID Vec are computed lazily. RowAddrMask is an exclusive AllowList/BlockList enum, so this fast path omits no simultaneous block list (context: rust/lance-select/src/mask.rs:24-79). (rust/lance-table/src/rowids.rs:594-620)

### Lines 621-646

Plain Range path constructs RowAddrTreeMap, applies mask, walks inclusive low32 runs, recombines high32 fragment and offsets, subtracts range.start/adds prior sequence offset, and coalesces adjacent runs within this segment. End reconstruction uses bitwise OR of frag<<32 and low_end+1. At low_end=u32MAX with odd fragment, carry bit overlaps existing high bits: for singleton ID8589934591 in range8589934591..8589934592, computed end is4294967296 and subtraction underflows instead of producing ordinal1. This is source-derived, unexecuted; iter_runs exposes inclusive u32 runs and insert_range can store that singleton (rust/lance-select/src/mask.rs:545-588; rust/lance-select/src/mask.rs:801-810). (rust/lance-table/src/rowids.rs:621-646)

### Lines 647-674

Holes path creates full range set, removes each hole and subtracts only successful removals from total offset, applies mask, clones/decodes/sorts holes and walks selected addresses. For each address it subtracts count of holes strictly below it, then groups ordinals. Sorting permits the tested unsorted unique hole list here, unlike several segment methods. Duplicate/outside holes can disagree with the successful-removal count and rank subtraction; valid unique in-range holes are assumed. (rust/lance-table/src/rowids.rs:647-674)

### Lines 675-705

Bitmap fast path applies only with finite allow count. On first such bitmap, scans all sequence segments to cache bitmap count and summed enclosing numeric span, using ordinary u64 additions/subtractions. Uses direct selected-ID processing only if total selected count<=total bitmap span; otherwise fallback. This is a global heuristic, not each segment density. One bitmap streams allowed IDs; multiple bitmaps materialize allowed IDs once for binary-search slicing. (rust/lance-table/src/rowids.rs:675-705)

### Lines 706-740

For multiple bitmap segments, lazily call allow_list.row_addrs once and cache Some(Vec<sorted IDs>) or None. For each applicable segment increment offset by bitmap.count_ones, binary-search the cached IDs at start/end and feed that subrange to bitmap_selected_offsets; single bitmap filters streamed addresses by range containment. If row_addrs unavailable, fall through. Contextual row_addrs collects an iterator per tree entry before flattening, so streaming avoids copying all IDs but is not allocation-free (rust/lance-select/src/mask.rs:497-515). (rust/lance-table/src/rowids.rs:706-740)

### Lines 741-763

Bitmap fallback materializes full range set, scans every numeric slot, removes missing bits while reducing total count, applies mask, then incrementally consumes bitmap logical iterator to count earlier holes for selected addresses. Iterator unwrap relies on valid bitmap length. This path scales with enclosing span plus selected values, whereas fast path popcounts intervening prefixes and selected IDs. No errors are returned locally; malformed padding/span can make fast and fallback lengths disagree. (rust/lance-table/src/rowids.rs:741-763)

### Lines 764-781

Ranges path advances total by runs.present_len, inserts each base-adjusted present gap into a new tree map, applies mask and translates each address through runs.position(relative as u32).expect before grouping. HoleRuns invariants and inserted-set containment justify expect for valid data. It does not coalesce output with a prior segment. (rust/lance-table/src/rowids.rs:764-781)

### Lines 782-800

SortedArray and Array both enumerate values in stored order and use mask.selected, producing ordinal=local index+prior count through GroupingIterator; sorting the IDs is neither required nor performed. Then advance by array length. Method returns accumulated Vec with no cross-segment range merge. Comment suggests sorted-array optimization but no separate algorithm exists. (rust/lance-table/src/rowids.rs:782-800)

### Lines 801-839

Private GroupingIterator stores inner iterator and optional current half-open range. next extends only when next ID equals current end; otherwise yields old range and starts ID..ID+1. At inner EOF it takes the remaining range. It assumes appropriate order/distinctness for nonoverlapping increasing output; does not validate either, and ID+1 is unchecked at u64MAX. No FusedIterator/ExactSizeIterator guarantee is added. (rust/lance-table/src/rowids.rs:801-839)

### Lines 840-864

bitmap_selected_offsets assumes sorted in-range IDs. Missing bitmap bits return None without advancing prefix state. Present IDs add popcount over bitmap slice previous_position..position, leave previous_position at the selected position, and emit offset_start+live_before. Including the previous selected bit in the next slice gives correct rank increments; repeated IDs repeat offsets. Relative subtraction/casts and sorted-delta subtraction are unchecked. GroupingIterator collects the local output Vec. (rust/lance-table/src/rowids.rs:840-864)

### Lines 865-907

From<&RowIdSequence> for RowAddrTreeMap builds each segment in a fresh temporary set, then unions it into aggregate. Range inserts bounds; bitmap removes every absent slot; holes remove listed values; Ranges inserts present gaps; arrays insert each value. Isolating removals per segment preserves values present in overlapping other segments. Set conversion loses sequence order/duplicate multiplicity. It inherits tree-map edge behavior: contextual insert_range saturates excluded end0 to0, so Range0..0 inserts ID0 rather than nothing (rust/lance-select/src/mask.rs:545-588; rust/lance-select/src/mask.rs:1014-1019); full dependency analysis remains pending. (rust/lance-table/src/rowids.rs:865-907)

### Lines 908-945

Public Debug RowIdSeqSlice has private borrowed segment slice, first start offset and last end offset. iter computes exact remaining size from sum of segment lengths minus trimmed prefixes/suffixes, then boxes iterators using skip/take for edge segments and full iteration for middle segments. One-segment case takes offset_last-offset_start. Calls exact_size adapter but return type advertises only Iterator; size_hint still reflects supplied count and decrements through that adapter. Arithmetic assumes valid slice; source borrow forbids ordinary mutation while view lives. (rust/lance-table/src/rowids.rs:908-945)

### Lines 946-987

Public rechunk_sequences consumes sequence and u64 size iterables plus allow_incomplete, collecting all sizes/output upfront. Flattens owned segment vectors into Peekable and tracks u64 offset within current segment. InvalidInput closures include chunk index/expected size/remaining count or processed/expected chunk counts. Docs motivate later allocation of IDs for inserted rows, but this function never creates those IDs itself and returns a Vec, not a stream. (rust/lance-table/src/rowids.rs:946-987)

### Lines 988-1013

For each requested chunk create an empty sequence. While remaining>0, inspect current segment length minus segment_offset. Empty/exhausted segments are consumed and offset reset; if no segment remains, allow_incomplete breaks with a short chunk, otherwise error. Later requested chunks still appear as empty when exhausted and incomplete allowed. A zero-sized chunk skips this loop and emits an empty Vec-backed sequence without consuming empty input segments. (rust/lance-table/src/rowids.rs:988-1013)

### Lines 1014-1043

If segment has more remaining values than requested, slice requested ordinal range, extend output and keep current segment with increased offset. Equal/less consumes segment, slices remaining values and extends, resetting offset and subtracting count. Even a whole uncut segment is rebuilt through U64Segment::slice, which materializes/re-encodes values; plain range input can cost proportional rows. u64-to-usize casts are unchecked. Adjacent plain output ranges may merge through extend. (rust/lance-table/src/rowids.rs:1014-1043)

### Lines 1044-1053

After all chunk sizes, any peeked segment produces too-many error regardless of its length or allow_incomplete. Thus leftover empty segments cause an error even when total row cardinalities match; zero chunk sizes do not drain them. allow_incomplete allows shortages only, never excess input. Earlier output allocations are discarded on Result error; consumed inputs cannot be recovered. (rust/lance-table/src/rowids.rs:1044-1053)

### Lines 1054-1089

select_row_ids accepts borrowed sequence and ReadBatchParams and returns owned Vec. Error closure includes u32 index and freshly computed sequence.len. Indices reads Arrow values buffer directly, without inspecting validity. Nondecreasing values check only last against length then use cursor-based select; arbitrary order uses independent get per index and errors at first missing. Duplicates preserve repeated output; empty values return empty. Nullable index-array policy belongs to ReadBatchParams producers and is not enforced here. (rust/lance-table/src/rowids.rs:1054-1089)

### Lines 1090-1113

Range checks only end<=sequence.len as usize then slices start,end-start. Ranges sums lengths with unchecked subtraction/casts, preallocates full requested count before per-range end checks, then slices/extends in supplied order. Neither rejects reverse bounds explicitly; arithmetic/panics can precede an InvalidInput. Error offset casts end to u32 and can truncate diagnostic values. A zero-length range accepted by end check uses slice empty shortcut. (rust/lance-table/src/rowids.rs:1090-1113)

### Lines 1114-1129

RangeFull collects every ID. RangeTo checks end, then slices0..end. RangeFrom performs sequence.len as usize minus start with no explicit start bound check; excessive start can underflow/panic rather than return InvalidInput. All returned data is materialized; no IO, schema conversion or cancellation handling occurs here. (rust/lance-table/src/rowids.rs:1114-1129)

### Lines 1130-1157

cfg(test) imports module, pretty_assertions and Bitmap. Range fixture asserts len10/nonempty/exact iteration. rstest checked-constructor cases cover sorted contiguous, sorted gapped, sparse and reverse inputs, checking exact order and length. These tests were read, not executed. (rust/lance-table/src/rowids.rs:1130-1157)

### Lines 1158-1190

Checked construction tests pin contiguous input to one Range and empty input to len0/is_empty true. Three duplicate patterns (adjacent,separated,unsorted) require InvalidInput and must-be-unique substring. No global cross-sequence duplicate or infallible constructor rejection is asserted. (rust/lance-table/src/rowids.rs:1158-1190)

### Lines 1191-1233

Extend test pins adjacent plain range merge and disjoint range retention. Delete test pins alternating survivors to bitmap, cross-segment deletion with missing requested IDs ignored, and delete-all to one Range0..0. It does not assert is_empty after delete-all or test duplicate deletion requests. (rust/lance-table/src/rowids.rs:1191-1233)

### Lines 1234-1284

Slice fixture uses six segments spanning Range,holes,sorted array,bitmap,general array and final Range. Nested offset/len loops keep only valid bounds, compare values with full-iteration skip/take and check equal size-hint bounds/actual length. Loops exclude len==total and offset==total; separate test covers offset10,len0. Ranges representation and invalid positive bounds are absent. (rust/lance-table/src/rowids.rs:1234-1284)

### Lines 1285-1334

Nested assert_rechunked compares exact sequence structures for small-to-large, large-to-small and equal chunks, including adjacency coalescing. Too-few and too-many cases assert only is_err, not error variants/messages. All chunks here are positive and valid total counts except deliberate mismatches. (rust/lance-table/src/rowids.rs:1285-1334)

### Lines 1335-1401

select_row_ids fixture covers sorted/unsorted Indices, Range,Full,To,From and multiple Ranges across two mixed segment sequences. It constructs a flattened-values/explicit-index oracle and checks exact output. No compact Ranges segment, nullable indices, reverse bounds or oversized From case appears. (rust/lance-table/src/rowids.rs:1335-1401)

### Lines 1402-1446

Bounds fixture checks InvalidInput for sorted/unsorted index1000, Range end1000 and RangeTo1000 over ten IDs; omits Ranges/RangeFrom. Treemap conversion fixture asserts explicit sorted union of six mixed segments. It does not assert sequence order survives set conversion. (rust/lance-table/src/rowids.rs:1402-1446)

### Lines 1447-1467

Overlapping-bounds regression uses complementary even/odd bitmaps over0..6 and requires the aggregate set contain all six IDs, preventing one segment missing-bit removal from erasing another segment live ID. Oracle includes both explicit0..6 and collected sequence membership. (rust/lance-table/src/rowids.rs:1447-1467)

### Lines 1468-1523

Position-mask fixture derives ordered positions for one removal from each of five representation segments, applies mask and asserts exact survivor segment encodings. It covers valid unique offsets, not malformed ordering/duplicates or Result failure. (rust/lance-table/src/rowids.rs:1468-1523)

### Lines 1524-1558

Mask-all fixture over Range and SortedArray requires an empty segment Vec, unlike delete-all. Selection fixture constructs five mixed segments and checks sorted picks including past-end57 drop against flattened expected values. (rust/lance-table/src/rowids.rs:1524-1558)

### Lines 1559-1583

Ordinary cursor selection tests chunk sizes1/3/7/16 across all values, a forward6..19 request, rewind1..8 and a tail request extending five past EOF. Results match independent slices of the flattened sequence; they do not reuse a cursor on a different sequence. (rust/lance-table/src/rowids.rs:1559-1583)

### Lines 1584-1620

Bitmap40 with holes3/4/17/39 plus a plain five-row segment yields41 values. Tests full selection, sparse/repeated/past-end picks, sequential range chunks and rewind2..6 against flattened values. This covers bitmap byte boundaries and segment transition but not cached-length invalidation after mutation. (rust/lance-table/src/rowids.rs:1584-1620)

### Lines 1621-1665

Dense cursor fixture uses one90%-present bitmap and asserts dense selection plus seeded len. Sequential chunks (including byte boundary and past-end) and rewind match expected. Half-full bitmap chooses sparse while still caching20; adding another segment disables dense and leaves lenNone. Threshold equality and all-zero nonempty bitmap are not tested. (rust/lance-table/src/rowids.rs:1621-1665)

### Lines 1666-1697

Large cursor regression creates one-million-slot bitmap with every17th bit cleared after initial Range0..8. It compares full selection and sorted boundary/stride9973/tail/past-end picks to a flattened oracle. Comment predicts a restart-per-index slowdown, but no elapsed-time assertion or benchmark measurement is performed. (rust/lance-table/src/rowids.rs:1666-1697)

### Lines 1698-1730

Large fixture additionally reads final100,000 values in one range and chunks1/7/8/9/1024/4097, checking exact concatenation. Separate should_panic test consumes public selection[2,4,3] and requires Selection is not sorted. Internal select_with_cursor decreasing-index iterator is not directly tested by this case. (rust/lance-table/src/rowids.rs:1698-1730)

### Lines 1731-1774

Mask-to-offset examples cover even selection in Range0..10, allow/block54 within40..60, holes2/6, and an intentionally unsorted hole array[47,43] with allow/block44. Exact expected ordinal ranges demonstrate holes sorted locally for rank correction. These low-value fixtures do not reach high32 boundaries. (rust/lance-table/src/rowids.rs:1731-1774)

### Lines 1775-1804

Bitmap mask examples cover live0/1/4/5/6/7 with even allowed IDs and separate40..45 bitmap allow/block44. Expected ranges pin omitted holes and present ordinal rank; only allow-list case takes the finite-ID optimization. (rust/lance-table/src/rowids.rs:1775-1804)

### Lines 1805-1839

Sparse bitmap1024 with holes3/7/64/1000 follows a five-row segment. Mask includes live/hole/outside boundary IDs and expected offsets7..8,66..68,1024..1025. Empty and all-missing masks yield empty. Full-fragment allow marker forces fallback and preserves adjacent segment boundary ranges0..5,5..1025. (rust/lance-table/src/rowids.rs:1805-1839)

### Lines 1840-1879

Sorted/general array masks check stored-order ordinal grouping, mixed-segment example preserves global offsets, default mask selects full Range and allow_nothing selects none. No empty Range0..0/high32 carry case is included. (rust/lance-table/src/rowids.rs:1840-1879)

### Lines 1880-1901

Brute-force oracle enumerates each segment values, tests mask.selected and groups resulting ordinals separately per segment. Comment claims no shared logic, but it reuses GroupingIterator and segment.iter/len, so it is independent of optimized mask branches rather than wholly independent. Agreement on fixtures cannot prove all-input equivalence. (rust/lance-table/src/rowids.rs:1880-1901)

### Lines 1902-1924

Private TestRng holds u64 state. next replaces zero with1, performs xorshift12/25/27 and wrapping multiplication0x2545_F491_4F6C_DD1D; below debug-asserts positive bound then modulo. Seeds0 and1 start identically; modulo sampling is not claimed unbiased. Generator comments introduce disjoint-range fixtures and missing-ID lists. (rust/lance-table/src/rowids.rs:1902-1924)

### Lines 1925-1955

random_sequence chooses1..4 segments with initial cursor<1000. Kind0 is Range span1..300; kind1/2 bitmap span50..1999 with random hole probability10..90 percent but first slot forced live. Records missing IDs and advances cursor; these generated segments never have empty presence. (rust/lance-table/src/rowids.rs:1925-1955)

### Lines 1956-1996

Kind3 builds range span20..199 with1..5 sampled holes, sorts/deduplicates them and records them. Final kind makes1..8 sampled IDs within span3*count+1, deduplicates then chooses shuffled Array or SortedArray; advances cursor by full span. No Ranges form, overlapping ranges, huge IDs, empty segments or malformed storage. Returns sequence, recorded holes and next cursor. (rust/lance-table/src/rowids.rs:1956-1996)

### Lines 1997-2019

random_allow_mask chooses mainly live IDs, sometimes known holes, lower-outside IDs when live[0]>0, or IDs at/past past_end. It preallocates requested count then converts through TreeMap, so duplicates collapse and actual allowed cardinality can be smaller. It assumes live nonempty; random_sequence guarantees that for its fixtures. (rust/lance-table/src/rowids.rs:1997-2019)

### Lines 2020-2043

Fifty seeded randomized cases generate sequence/live IDs, assert nonempty, and compare allow_nothing,allow_all-live,default,empty/nonempty block masks, three small mixed allow masks and one medium mask. Seeds0/1 duplicate initial generator state. Assertions verify equality to the local brute-force oracle, not timing or a formal proof. (rust/lance-table/src/rowids.rs:2020-2043)

### Lines 2044-2071

Further randomized masks add a broad allowed region beyond every segment to force fallback and masks containing only holes/outside IDs. Each mask compares optimized result and oracle with seed/mask-index context. The generator restricts ID domains to small values, so u32/u64 boundary arithmetic is not exercised. (rust/lance-table/src/rowids.rs:2044-2071)

### Lines 2072-2105

Two-bitmap regression follows Range0..5 with100..110 missing102/107 and200..205 missing200. Selected/live/hole/outside IDs yield explicit split ranges0..1,4..5,5..6,7..8,12..13,13..14,16..17 plus oracle equality. All-missing mask yields empty. This pins shared finite-selection cache semantics and lack of cross-segment merging. (rust/lance-table/src/rowids.rs:2072-2105)

### Lines 2106-2118

Broad two-bitmap allow list includes all live IDs and100 outside IDs, requiring equality with oracle through fallback. It does not measure one-time materialization or assert how many dependency iterators were created. (rust/lance-table/src/rowids.rs:2106-2118)

### Lines 2119-2152

Rechunk empty-segment test begins with exact-fit two chunks and a smaller-segment accumulation into one chunk, asserting both counts and concrete values. These first scenarios contain no empty segments despite the test name. (rust/lance-table/src/rowids.rs:2119-2152)

### Lines 2153-2186

Rechunk fixtures then place one empty Range between live runs with split3/1 and multiple consecutive empties while building a three-row chunk. Both assert output cardinality and values. Empty segments are consumed only while some requested chunk still needs rows. (rust/lance-table/src/rowids.rs:2153-2186)

### Lines 2187-2219

Boundary empty between two positive chunks is skipped when filling the next chunk. Incomplete fixture has two live IDs then trailing empty and requested5, returning only those two. It does not cover trailing empty after an exactly filled final chunk, zero-sized chunks or excess input with allow_incomplete. (rust/lance-table/src/rowids.rs:2187-2219)

### Lines 2220-2250

row_id_range tests cover empty raw Range returningNone, exact10..=19, unsorted input bounded around10/50 and disjoint-range union0..=104. They do not test is_empty consistency, all-missing nonzero bitmap bounds or noncanonical relative array bases. (rust/lance-table/src/rowids.rs:2220-2250)

### Lines 2251-2271

Clustered live values0..600 excluding50..250 and300..310 initially select bitmap. use_range_segments returns true and yields one Ranges; second call returns false and preserves exact equality. It validates local idempotence, not manifest configuration or on-disk reader performance. (rust/lance-table/src/rowids.rs:2251-2271)

### Lines 2272-2309

Compact Ranges fixture compares full values/count, cursor chunks37, selected indices, allow/block masks and treemap conversion against bitmap; protobuf encode/decode must equal the compact sequence. It exercises serde folding but does not establish historical released compatibility. File ends here; no direct Display, invalid mask, duplicate delete, source-switch cursor or high-domain range regression is present. All tests are source-read only. (rust/lance-table/src/rowids.rs:2272-2309)

## Interaction and interpretation limits

All2,309 physical lines read in ten bounded numbered chunks. This file is synchronous; no storage reads/writes, task scheduling, cancellation or commit occurs locally. Segment/serde/version primitives are fully analyzed. Contextual snippets in lance-select mask.rs, table utils/stream.rs and transaction/manifest_build.rs establish limited dependencies/callers only; those full files remain pending and their snippets do not count as completed coverage. Dataset compaction/update/merge-insert rechunk callers were located lexically, not fully traced. No source edits, network, build/test/benchmark execution or measured performance claims. Transaction::assign_row_ids now supplies a reviewed allocation/extension consumer and resolve_update_version_metadata supplies ID-to-source scanning (rust/lance-table/src/transaction/row_version.rs:97-295; rust/lance-table/src/transaction/row_version.rs:332-405); full builder and dataset callers remain pending.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | //! Indices for mapping row ids to their corresponding addresses.
    4 | //!
    5 | //! Each fragment in a table has a [RowIdSequence] that contains the row ids
    6 | //! in the order they appear in the fragment. The [RowIdIndex] aggregates these
    7 | //! sequences and maps row ids to their corresponding addresses across the
    8 | //! whole dataset.
    9 | //!
   10 | //! [RowIdSequence]s are serialized individually and stored in the fragment
   11 | //! metadata. Use [read_row_ids] and [write_row_ids] to read and write these
   12 | //! sequences. The on-disk format is designed to align well with the in-memory
   13 | //! representation, to avoid unnecessary deserialization.
   14 | use std::ops::{Range, RangeInclusive};
   15 | // TODO: replace this with Arrow BooleanBuffer.
   16 | 
   17 | // These are all internal data structures, and are private.
   18 | mod bitmap;
   19 | mod encoded_array;
   20 | mod index;
   21 | mod runs;
   22 | pub mod segment;
   23 | mod serde;
   24 | pub mod version;
   25 | 
   26 | use lance_core::deepsize::DeepSizeOf;
   27 | // These are the public API.
   28 | pub use index::FragmentRowIdIndex;
   29 | pub use index::RowIdIndex;
   30 | use lance_core::{Error, Result};
   31 | use lance_io::ReadBatchParams;
   32 | use lance_select::{RowAddrMask, RowAddrTreeMap, RowSetOps};
   33 | pub use serde::{read_row_ids, write_row_ids};
   34 | 
   35 | use crate::utils::LanceIteratorExtension;
   36 | use segment::{SegmentCursorState, U64Segment};
   37 | use tracing::instrument;
   38 | 
   39 | /// A sequence of row ids.
   40 | ///
   41 | /// Row ids are u64s that:
   42 | ///
   43 | /// 1. Are **unique** within a table (except for tombstones)
   44 | /// 2. Are *often* but not always sorted and/or contiguous.
   45 | ///
   46 | /// This sequence of row ids is optimized to be compact when the row ids are
   47 | /// contiguous and sorted. However, it does not require that the row ids are
   48 | /// contiguous or sorted.
   49 | ///
   50 | /// We can make optimizations that assume uniqueness.
   51 | #[derive(Debug, Clone, DeepSizeOf, PartialEq, Eq, Default)]
   52 | pub struct RowIdSequence(Vec<U64Segment>);
   53 | 
   54 | /// Stateful reader for selections that usually advance through a sequence.
   55 | ///
   56 | /// Streaming readers reuse this cursor across record batches. If a later
   57 | /// selection moves backwards then the cursor rewinds before continuing.
   58 | #[derive(Debug, Default)]
   59 | pub(crate) struct RowIdSequenceCursor {
   60 |     segment_idx: usize,
   61 |     rows_passed: usize,
   62 |     segment_len: Option<usize>,
   63 |     segment_cursor: SegmentCursorState,
   64 |     last_index: Option<usize>,
   65 | }
   66 | 
   67 | impl RowIdSequenceCursor {
   68 |     fn advance_segment(&mut self) {
   69 |         self.rows_passed += self.segment_len.unwrap_or_default();
   70 |         self.segment_idx += 1;
   71 |         self.segment_len = None;
   72 |         self.segment_cursor = SegmentCursorState::default();
   73 |     }
   74 | 
   75 |     fn get(&mut self, sequence: &RowIdSequence, index: usize) -> Option<u64> {
   76 |         if index < self.rows_passed || self.last_index.is_some_and(|last| index < last) {
   77 |             *self = Self::default();
   78 |         }
   79 |         self.last_index = Some(index);
   80 | 
   81 |         loop {
   82 |             let segment = sequence.0.get(self.segment_idx)?;
   83 |             let segment_len = *self.segment_len.get_or_insert_with(|| segment.len());
   84 |             let local_index = index - self.rows_passed;
   85 |             if local_index < segment_len {
   86 |                 return self.segment_cursor.get(segment, local_index);
   87 |             }
   88 |             self.advance_segment();
   89 |         }
   90 |     }
   91 | 
   92 |     fn extend_range(
   93 |         &mut self,
   94 |         sequence: &RowIdSequence,
   95 |         selection: Range<usize>,
   96 |         row_ids: &mut Vec<u64>,
   97 |     ) {
   98 |         if selection.is_empty() {
   99 |             return;
  100 |         }
  101 |         if selection.start < self.rows_passed
  102 |             || self.last_index.is_some_and(|last| selection.start < last)
  103 |         {
  104 |             *self = Self::default();
  105 |         }
  106 |         self.last_index = Some(selection.end - 1);
  107 | 
  108 |         let mut index = selection.start;
  109 |         while index < selection.end {
  110 |             let Some(segment) = sequence.0.get(self.segment_idx) else {
  111 |                 break;
  112 |             };
  113 |             let segment_len = *self.segment_len.get_or_insert_with(|| segment.len());
  114 |             let local_start = index - self.rows_passed;
  115 |             if local_start >= segment_len {
  116 |                 self.advance_segment();
  117 |                 continue;
  118 |             }
  119 | 
  120 |             let count = (selection.end - index).min(segment_len - local_start);
  121 |             let local_end = local_start + count;
  122 |             self.segment_cursor
  123 |                 .extend_range(segment, local_start..local_end, row_ids);
  124 |             index += count;
  125 |             if local_end == segment_len {
  126 |                 self.advance_segment();
  127 |             }
  128 |         }
  129 |     }
  130 | 
  131 |     // Keep the sparse loop in `extend_range` unchanged. Sharing this loop with
  132 |     // the dense decoder measurably slows sparse system-only scans.
  133 |     fn extend_dense_range(
  134 |         &mut self,
  135 |         sequence: &RowIdSequence,
  136 |         selection: Range<usize>,
  137 |         row_ids: &mut Vec<u64>,
  138 |     ) {
  139 |         if selection.is_empty() {
  140 |             return;
  141 |         }
  142 |         if selection.start < self.rows_passed
  143 |             || self.last_index.is_some_and(|last| selection.start < last)
  144 |         {
  145 |             *self = Self::default();
  146 |         }
  147 |         self.last_index = Some(selection.end - 1);
  148 | 
  149 |         let mut index = selection.start;
  150 |         while index < selection.end {
  151 |             let Some(segment) = sequence.0.get(self.segment_idx) else {
  152 |                 break;
  153 |             };
  154 |             let segment_len = *self.segment_len.get_or_insert_with(|| segment.len());
  155 |             let local_start = index - self.rows_passed;
  156 |             if local_start >= segment_len {
  157 |                 self.advance_segment();
  158 |                 continue;
  159 |             }
  160 | 
  161 |             let count = (selection.end - index).min(segment_len - local_start);
  162 |             let local_end = local_start + count;
  163 |             self.segment_cursor
  164 |                 .extend_dense_range(segment, local_start..local_end, row_ids);
  165 |             index += count;
  166 |             if local_end == segment_len {
  167 |                 self.advance_segment();
  168 |             }
  169 |         }
  170 |     }
  171 | }
  172 | 
  173 | impl std::fmt::Display for RowIdSequence {
  174 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
  175 |         let mut iter = self.iter();
  176 |         let mut first_10 = Vec::new();
  177 |         let mut last_10 = Vec::new();
  178 |         for row_id in iter.by_ref() {
  179 |             first_10.push(row_id);
  180 |             if first_10.len() > 10 {
  181 |                 break;
  182 |             }
  183 |         }
  184 | 
  185 |         while let Some(row_id) = iter.next_back() {
  186 |             last_10.push(row_id);
  187 |             if last_10.len() > 10 {
  188 |                 break;
  189 |             }
  190 |         }
  191 |         last_10.reverse();
  192 | 
  193 |         let theres_more = iter.next().is_some();
  194 | 
  195 |         write!(f, "[")?;
  196 |         for row_id in first_10 {
  197 |             write!(f, "{}", row_id)?;
  198 |         }
  199 |         if theres_more {
  200 |             write!(f, ", ...")?;
  201 |         }
  202 |         for row_id in last_10 {
  203 |             write!(f, ", {}", row_id)?;
  204 |         }
  205 |         write!(f, "]")
  206 |     }
  207 | }
  208 | 
  209 | impl From<Range<u64>> for RowIdSequence {
  210 |     fn from(range: Range<u64>) -> Self {
  211 |         Self(vec![U64Segment::Range(range)])
  212 |     }
  213 | }
  214 | 
  215 | impl From<&[u64]> for RowIdSequence {
  216 |     fn from(row_ids: &[u64]) -> Self {
  217 |         Self(vec![U64Segment::from_slice(row_ids)])
  218 |     }
  219 | }
  220 | 
  221 | /// Return some value that appears more than once in `row_ids`, if any.
  222 | ///
  223 | /// The already-sorted case is the common one for row id sequences, and is
  224 | /// checked in a single pass without allocating.
  225 | fn find_duplicate(row_ids: &[u64]) -> Option<u64> {
  226 |     if row_ids.windows(2).all(|pair| pair[0] < pair[1]) {
  227 |         return None;
  228 |     }
  229 |     let mut sorted = row_ids.to_vec();
  230 |     sorted.sort_unstable();
  231 |     sorted
  232 |         .windows(2)
  233 |         .find(|pair| pair[0] == pair[1])
  234 |         .map(|pair| pair[0])
  235 | }
  236 | 
  237 | impl RowIdSequence {
  238 |     pub fn new() -> Self {
  239 |         Self::default()
  240 |     }
  241 | 
  242 |     /// Build a sequence from row ids, rejecting duplicates within the sequence.
  243 |     ///
  244 |     /// The segment encodings represent a sorted run as a range plus its holes,
  245 |     /// so a repeated value would be silently encoded as a shorter sequence with
  246 |     /// a spurious hole. Callers assembling a sequence from untrusted input
  247 |     /// should use this instead of the infallible `From` conversions, which
  248 |     /// assume uniqueness.
  249 |     ///
  250 |     /// Row ids must also be unique across the dataset. That is not checked
  251 |     /// here, and commit does not re-check it either.
  252 |     pub fn try_from_iter(row_ids: impl IntoIterator<Item = u64>) -> Result<Self> {
  253 |         let row_ids: Vec<u64> = row_ids.into_iter().collect();
  254 |         if row_ids.is_empty() {
  255 |             return Ok(Self::new());
  256 |         }
  257 |         if let Some(duplicate) = find_duplicate(&row_ids) {
  258 |             return Err(Error::invalid_input(format!(
  259 |                 "Row ids must be unique, but row id {} appears more than once in the sequence of {} row ids",
  260 |                 duplicate,
  261 |                 row_ids.len()
  262 |             )));
  263 |         }
  264 |         Ok(Self(vec![U64Segment::from_iter(row_ids)]))
  265 |     }
  266 | 
  267 |     pub fn iter(&self) -> impl DoubleEndedIterator<Item = u64> + '_ {
  268 |         self.0.iter().flat_map(|segment| segment.iter())
  269 |     }
  270 | 
  271 |     pub fn len(&self) -> u64 {
  272 |         self.0.iter().map(|segment| segment.len() as u64).sum()
  273 |     }
  274 | 
  275 |     pub fn is_empty(&self) -> bool {
  276 |         self.0.is_empty()
  277 |     }
  278 | 
  279 |     /// Returns the bounding range `[min, max]` across all row IDs in this sequence,
  280 |     /// or `None` if the sequence contains no values.
  281 |     ///
  282 |     /// This is a conservative bounding box: a value falling within the returned range
  283 |     /// is not guaranteed to exist in the sequence (segments may be sparse), but any
  284 |     /// value that *does* exist is guaranteed to fall within the range.  This makes
  285 |     /// the result suitable as a cheap pre-filter before a full scan.
  286 |     pub fn row_id_range(&self) -> Option<RangeInclusive<u64>> {
  287 |         let min = self
  288 |             .0
  289 |             .iter()
  290 |             .filter_map(|s| s.range())
  291 |             .map(|r| *r.start())
  292 |             .min()?;
  293 |         let max = self
  294 |             .0
  295 |             .iter()
  296 |             .filter_map(|s| s.range())
  297 |             .map(|r| *r.end())
  298 |             .max()?;
  299 |         Some(min..=max)
  300 |     }
  301 | 
  302 |     /// Combines this row id sequence with another row id sequence.
  303 |     pub fn extend(&mut self, other: Self) {
  304 |         // If the last element of this sequence and the first element of next
  305 |         // sequence are ranges, we might be able to combine them into a single
  306 |         // range.
  307 |         if let (Some(U64Segment::Range(range1)), Some(U64Segment::Range(range2))) =
  308 |             (self.0.last(), other.0.first())
  309 |             && range1.end == range2.start
  310 |         {
  311 |             let new_range = U64Segment::Range(range1.start..range2.end);
  312 |             self.0.pop();
  313 |             self.0.push(new_range);
  314 |             self.0.extend(other.0.into_iter().skip(1));
  315 |             return;
  316 |         }
  317 |         // TODO: add other optimizations, such as combining two RangeWithHoles.
  318 |         self.0.extend(other.0);
  319 |     }
  320 | 
  321 |     /// Re-encode every segment that is smaller as a run of `Range` segments
  322 |     /// than as it is stored now (see [`U64Segment::as_ranges`]). Returns
  323 |     /// whether anything changed.
  324 |     ///
  325 |     /// The result is written as plain `Range` segments, which every reader
  326 |     /// understands, but a reader without the compact in-memory form handles
  327 |     /// thousands of segments per fragment slowly, so this is only called for
  328 |     /// tables that opted in.
  329 |     pub fn use_range_segments(&mut self) -> bool {
  330 |         let mut changed = false;
  331 |         for segment in &mut self.0 {
  332 |             if let Some(ranges) = segment.as_ranges() {
  333 |                 *segment = ranges;
  334 |                 changed = true;
  335 |             }
  336 |         }
  337 |         changed
  338 |     }
  339 | 
  340 |     /// Remove a set of row ids from the sequence.
  341 |     pub fn delete(&mut self, row_ids: impl IntoIterator<Item = u64>) {
  342 |         // Order the row ids by position in which they appear in the sequence.
  343 |         let (row_ids, offsets) = self.find_ids(row_ids);
  344 | 
  345 |         let capacity = self.0.capacity();
  346 |         let old_segments = std::mem::replace(&mut self.0, Vec::with_capacity(capacity));
  347 |         let mut remaining_segments = old_segments.as_slice();
  348 | 
  349 |         for (segment_idx, range) in offsets {
  350 |             let segments_handled = old_segments.len() - remaining_segments.len();
  351 |             let segments_to_add = segment_idx - segments_handled;
  352 |             self.0
  353 |                 .extend_from_slice(&remaining_segments[..segments_to_add]);
  354 |             remaining_segments = &remaining_segments[segments_to_add..];
  355 | 
  356 |             let segment;
  357 |             (segment, remaining_segments) = remaining_segments.split_first().unwrap();
  358 | 
  359 |             let segment_ids = &row_ids[range];
  360 |             self.0.push(segment.delete(segment_ids));
  361 |         }
  362 | 
  363 |         // Add the remaining segments.
  364 |         self.0.extend_from_slice(remaining_segments);
  365 |     }
  366 | 
  367 |     /// Delete row ids by position.
  368 |     pub fn mask(&mut self, positions: impl IntoIterator<Item = u32>) -> Result<()> {
  369 |         let mut local_positions = Vec::new();
  370 |         let mut positions_iter = positions.into_iter();
  371 |         let mut curr_position = positions_iter.next();
  372 |         let mut offset = 0;
  373 |         let mut cutoff = 0;
  374 | 
  375 |         for segment in &mut self.0 {
  376 |             // Make vector of local positions
  377 |             cutoff += segment.len() as u32;
  378 |             while let Some(position) = curr_position {
  379 |                 if position >= cutoff {
  380 |                     break;
  381 |                 }
  382 |                 local_positions.push(position - offset);
  383 |                 curr_position = positions_iter.next();
  384 |             }
  385 | 
  386 |             if !local_positions.is_empty() {
  387 |                 segment.mask(&local_positions);
  388 |                 local_positions.clear();
  389 |             }
  390 |             offset = cutoff;
  391 |         }
  392 | 
  393 |         self.0.retain(|segment| !segment.is_empty());
  394 | 
  395 |         Ok(())
  396 |     }
  397 | 
  398 |     /// Find the row ids in the sequence.
  399 |     ///
  400 |     /// Returns the row ids sorted by their appearance in the sequence.
  401 |     /// Also returns the segment index and the range where that segment's
  402 |     /// row id matches are found in the returned row id vector.
  403 |     fn find_ids(
  404 |         &self,
  405 |         row_ids: impl IntoIterator<Item = u64>,
  406 |     ) -> (Vec<u64>, Vec<(usize, Range<usize>)>) {
  407 |         // Often, the row ids will already be provided in the order they appear.
  408 |         // So the optimal way to search will be to cycle through rather than
  409 |         // restarting the search from the beginning each time.
  410 |         let mut segment_iter = self.0.iter().enumerate().cycle();
  411 | 
  412 |         let mut segment_matches = vec![Vec::new(); self.0.len()];
  413 | 
  414 |         row_ids.into_iter().for_each(|row_id| {
  415 |             let mut i = 0;
  416 |             // If we've cycled through all segments, we know the row id is not in the sequence.
  417 |             while i < self.0.len() {
  418 |                 let (segment_idx, segment) = segment_iter.next().unwrap();
  419 |                 if segment.range().is_some_and(|range| range.contains(&row_id))
  420 |                     && let Some(offset) = segment.position(row_id)
  421 |                 {
  422 |                     segment_matches.get_mut(segment_idx).unwrap().push(offset);
  423 |                     // The row id was not found it the segment. It might be in a later segment.
  424 |                 }
  425 |                 i += 1;
  426 |             }
  427 |         });
  428 |         for matches in &mut segment_matches {
  429 |             matches.sort_unstable();
  430 |         }
  431 | 
  432 |         let mut offset = 0;
  433 |         let segment_ranges = segment_matches
  434 |             .iter()
  435 |             .enumerate()
  436 |             .filter(|(_, matches)| !matches.is_empty())
  437 |             .map(|(segment_idx, matches)| {
  438 |                 let range = offset..offset + matches.len();
  439 |                 offset += matches.len();
  440 |                 (segment_idx, range)
  441 |             })
  442 |             .collect();
  443 |         let row_ids = segment_matches
  444 |             .into_iter()
  445 |             .enumerate()
  446 |             .flat_map(|(segment_idx, offset)| {
  447 |                 offset
  448 |                     .into_iter()
  449 |                     .map(move |offset| self.0[segment_idx].get(offset).unwrap())
  450 |             })
  451 |             .collect();
  452 | 
  453 |         (row_ids, segment_ranges)
  454 |     }
  455 | 
  456 |     pub fn slice(&self, offset: usize, len: usize) -> RowIdSeqSlice<'_> {
  457 |         if len == 0 {
  458 |             return RowIdSeqSlice {
  459 |                 segments: &[],
  460 |                 offset_start: 0,
  461 |                 offset_last: 0,
  462 |             };
  463 |         }
  464 | 
  465 |         // Find the starting position
  466 |         let mut offset_start = offset;
  467 |         let mut segment_offset = 0;
  468 |         for segment in &self.0 {
  469 |             let segment_len = segment.len();
  470 |             if offset_start < segment_len {
  471 |                 break;
  472 |             }
  473 |             offset_start -= segment_len;
  474 |             segment_offset += 1;
  475 |         }
  476 | 
  477 |         // Find the ending position
  478 |         let mut offset_last = offset_start + len;
  479 |         let mut segment_offset_last = segment_offset;
  480 |         for segment in &self.0[segment_offset..] {
  481 |             let segment_len = segment.len();
  482 |             if offset_last <= segment_len {
  483 |                 break;
  484 |             }
  485 |             offset_last -= segment_len;
  486 |             segment_offset_last += 1;
  487 |         }
  488 | 
  489 |         RowIdSeqSlice {
  490 |             segments: &self.0[segment_offset..=segment_offset_last],
  491 |             offset_start,
  492 |             offset_last,
  493 |         }
  494 |     }
  495 | 
  496 |     /// Get the row id at the given index.
  497 |     ///
  498 |     /// If the index is out of bounds, this will return None.
  499 |     /// The segments backing the sequence, in offset order.
  500 |     pub fn segments(&self) -> &[U64Segment] {
  501 |         &self.0
  502 |     }
  503 | 
  504 |     pub fn get(&self, index: usize) -> Option<u64> {
  505 |         let mut offset = 0;
  506 |         for segment in &self.0 {
  507 |             let segment_len = segment.len();
  508 |             if index < offset + segment_len {
  509 |                 return segment.get(index - offset);
  510 |             }
  511 |             offset += segment_len;
  512 |         }
  513 |         None
  514 |     }
  515 | 
  516 |     /// Get row ids from the sequence based on the provided _sorted_ offsets
  517 |     ///
  518 |     /// Any out of bounds offsets will be ignored
  519 |     ///
  520 |     /// # Panics
  521 |     ///
  522 |     /// If the input selection is not sorted, this function will panic
  523 |     pub fn select<'a>(
  524 |         &'a self,
  525 |         selection: impl Iterator<Item = usize> + 'a,
  526 |     ) -> impl Iterator<Item = u64> + 'a {
  527 |         let mut cursor = RowIdSequenceCursor::default();
  528 |         let mut last_index = None;
  529 |         selection.filter_map(move |index| {
  530 |             if last_index.is_some_and(|last| index < last) {
  531 |                 panic!("Selection is not sorted");
  532 |             }
  533 |             last_index = Some(index);
  534 |             cursor.get(self, index)
  535 |         })
  536 |     }
  537 | 
  538 |     pub(crate) fn cursor(&self) -> RowIdSequenceCursor {
  539 |         RowIdSequenceCursor::default()
  540 |     }
  541 | 
  542 |     /// Choose the dense decoder once for a stream and reuse its cardinality.
  543 |     ///
  544 |     /// A stream uses one decoder for its lifetime, so multi-segment sequences
  545 |     /// conservatively retain the sparse path. For a single bitmap segment, the
  546 |     /// cardinality computed for the density decision seeds the cursor instead
  547 |     /// of scanning the bitmap again on the first batch.
  548 |     pub(crate) fn cursor_with_dense_range_expansion(&self) -> (RowIdSequenceCursor, bool) {
  549 |         let mut cursor = self.cursor();
  550 |         let [segment @ U64Segment::RangeWithBitmap { .. }] = self.0.as_slice() else {
  551 |             return (cursor, false);
  552 |         };
  553 |         let segment_len = segment.len();
  554 |         cursor.segment_len = Some(segment_len);
  555 |         let use_dense_range_expansion = segment.use_dense_range_expansion(segment_len);
  556 |         (cursor, use_dense_range_expansion)
  557 |     }
  558 | 
  559 |     /// Get a contiguous range of row ids while preserving scan state from a
  560 |     /// previous call.
  561 |     pub(crate) fn select_range_with_cursor(
  562 |         &self,
  563 |         cursor: &mut RowIdSequenceCursor,
  564 |         selection: Range<usize>,
  565 |     ) -> Vec<u64> {
  566 |         let mut row_ids = Vec::with_capacity(selection.len());
  567 |         cursor.extend_range(self, selection, &mut row_ids);
  568 |         row_ids
  569 |     }
  570 | 
  571 |     /// Get a contiguous range from a sequence whose bitmap segments are dense.
  572 |     pub(crate) fn select_dense_range_with_cursor(
  573 |         &self,
  574 |         cursor: &mut RowIdSequenceCursor,
  575 |         selection: Range<usize>,
  576 |     ) -> Vec<u64> {
  577 |         let mut row_ids = Vec::with_capacity(selection.len());
  578 |         cursor.extend_dense_range(self, selection, &mut row_ids);
  579 |         row_ids
  580 |     }
  581 | 
  582 |     /// Get row ids while preserving scan state from a previous call.
  583 |     ///
  584 |     /// Decreasing offsets are supported by rewinding the cursor. This matters
  585 |     /// for take requests, whose indices are not required to be sorted.
  586 |     pub(crate) fn select_with_cursor<'a>(
  587 |         &'a self,
  588 |         cursor: &'a mut RowIdSequenceCursor,
  589 |         selection: impl Iterator<Item = usize> + 'a,
  590 |     ) -> impl Iterator<Item = u64> + 'a {
  591 |         selection.filter_map(move |index| cursor.get(self, index))
  592 |     }
  593 | 
  594 |     /// Given a mask of row ids, calculate the offset ranges of the row ids that are present
  595 |     /// in the sequence.
  596 |     ///
  597 |     /// For example, given a mask that selects all even ids and a sequence that is
  598 |     /// [80..85, 86..90, 14]
  599 |     ///
  600 |     /// this will return [0, 2, 4, 5, 7, 9]
  601 |     /// because the range expands to
  602 |     ///
  603 |     /// [80, 81, 82, 83, 84, 86, 87, 88, 89, 14] with offsets
  604 |     /// [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9]
  605 |     ///
  606 |     /// This function is useful when determining which row offsets to read from a fragment given
  607 |     /// a mask.
  608 |     #[instrument(level = "debug", skip_all)]
  609 |     pub fn mask_to_offset_ranges(&self, mask: &RowAddrMask) -> Vec<Range<u64>> {
  610 |         let mut offset = 0;
  611 |         let mut ranges = Vec::new();
  612 |         let finite_allow_list = mask
  613 |             .allow_list()
  614 |             .and_then(|allow_list| allow_list.len().map(|len| (allow_list, len)));
  615 |         // Bitmap segment count/span and the shared selection below are
  616 |         // computed lazily on the first bitmap segment: masks and sequences
  617 |         // that never reach the per-id path pay nothing extra.
  618 |         let mut bitmap_info: Option<(u64, u64)> = None;
  619 |         let mut shared_cache: Option<Option<Vec<u64>>> = None;
  620 |         for segment in &self.0 {
  621 |             match segment {
  622 |                 U64Segment::Range(range) => {
  623 |                     let mut ids = RowAddrTreeMap::from(range.clone());
  624 |                     ids.mask(mask);
  625 |                     // Range-aware path: walk the bitmap's runs directly via
  626 |                     // iter_runs so the per-row cost collapses to per-run cost.
  627 |                     let mut cur: Option<Range<u64>> = None;
  628 |                     for (fragment, run) in ids.iter_runs() {
  629 |                         let frag = u64::from(fragment);
  630 |                         let run_start = (frag << 32) | u64::from(*run.start());
  631 |                         let run_end_excl = (frag << 32) | (u64::from(*run.end()) + 1);
  632 |                         let start = run_start - range.start + offset;
  633 |                         let end = run_end_excl - range.start + offset;
  634 |                         match cur.as_mut() {
  635 |                             Some(c) if c.end == start => c.end = end,
  636 |                             Some(c) => {
  637 |                                 ranges.push(std::mem::replace(c, start..end));
  638 |                             }
  639 |                             None => cur = Some(start..end),
  640 |                         }
  641 |                     }
  642 |                     if let Some(c) = cur {
  643 |                         ranges.push(c);
  644 |                     }
  645 |                     offset += range.end - range.start;
  646 |                 }
  647 |                 U64Segment::RangeWithHoles { range, holes } => {
  648 |                     let offset_start = offset;
  649 |                     let mut ids = RowAddrTreeMap::from(range.clone());
  650 |                     offset += range.end - range.start;
  651 |                     for hole in holes.iter() {
  652 |                         if ids.remove(hole) {
  653 |                             offset -= 1;
  654 |                         }
  655 |                     }
  656 |                     ids.mask(mask);
  657 | 
  658 |                     // Sadly we can't just subtract the offset because of the holes
  659 |                     let mut sorted_holes = holes.clone().into_iter().collect::<Vec<_>>();
  660 |                     sorted_holes.sort_unstable();
  661 |                     let mut next_holes_iter = sorted_holes.into_iter().peekable();
  662 |                     let mut holes_passed = 0;
  663 |                     ranges.extend(GroupingIterator::new(ids.into_addr_iter().map(|addr| {
  664 |                         while let Some(next_hole) = next_holes_iter.peek() {
  665 |                             if *next_hole < addr {
  666 |                                 next_holes_iter.next();
  667 |                                 holes_passed += 1;
  668 |                             } else {
  669 |                                 break;
  670 |                             }
  671 |                         }
  672 |                         addr - range.start + offset_start - holes_passed
  673 |                     })));
  674 |                 }
  675 |                 U64Segment::RangeWithBitmap { range, bitmap } => {
  676 |                     // When the mask is a finite allow-list, walk the selected
  677 |                     // ids directly instead of materializing the whole range.
  678 |                     // `row_addrs()` yields addresses in sorted order, so bitmap
  679 |                     // prefix counts accumulate incrementally. Per-id work grows
  680 |                     // with the selection size while the range path grows with
  681 |                     // the bitmap span, so selections broader than the span keep
  682 |                     // the old range-based path below (a heuristic holding each
  683 |                     // call near the old cost), as do masks without finite
  684 |                     // cardinality (e.g. full-fragment markers).
  685 |                     if let Some((allow_list, num_selected)) = finite_allow_list {
  686 |                         // Count/span computed once, on first use, so masks and
  687 |                         // sequences that never take this path pay nothing extra.
  688 |                         let (bitmap_segments, bitmap_span) =
  689 |                             *bitmap_info.get_or_insert_with(|| {
  690 |                                 let mut info = (0u64, 0u64);
  691 |                                 for segment in &self.0 {
  692 |                                     if let U64Segment::RangeWithBitmap { range, .. } = segment {
  693 |                                         info.0 += 1;
  694 |                                         info.1 += range.end - range.start;
  695 |                                     }
  696 |                                 }
  697 |                                 info
  698 |                             });
  699 |                         if num_selected <= bitmap_span {
  700 |                             // Rescanning the whole selection in every bitmap
  701 |                             // segment would cost O(segments x selected). With
  702 |                             // more than one bitmap segment, the sorted selection
  703 |                             // is materialized once so each segment only visits
  704 |                             // its own id range (binary search); a single bitmap
  705 |                             // segment streams the selection directly with no copy.
  706 |                             let offset_start = offset;
  707 |                             if bitmap_segments > 1 {
  708 |                                 let cached = shared_cache.get_or_insert_with(|| {
  709 |                                     allow_list
  710 |                                         .row_addrs()
  711 |                                         .map(|selected| selected.map(u64::from).collect())
  712 |                                 });
  713 |                                 if let Some(ids) = cached {
  714 |                                     offset += bitmap.count_ones() as u64;
  715 |                                     let start = ids.partition_point(|id| *id < range.start);
  716 |                                     let end = ids.partition_point(|id| *id < range.end);
  717 |                                     ranges.extend(bitmap_selected_offsets(
  718 |                                         ids[start..end].iter().copied(),
  719 |                                         range,
  720 |                                         bitmap,
  721 |                                         offset_start,
  722 |                                     ));
  723 |                                     continue;
  724 |                                 }
  725 |                             } else if let Some(selected) = allow_list.row_addrs() {
  726 |                                 offset += bitmap.count_ones() as u64;
  727 |                                 let in_range = selected.filter_map(|address| {
  728 |                                     let row_id = u64::from(address);
  729 |                                     range.contains(&row_id).then_some(row_id)
  730 |                                 });
  731 |                                 ranges.extend(bitmap_selected_offsets(
  732 |                                     in_range,
  733 |                                     range,
  734 |                                     bitmap,
  735 |                                     offset_start,
  736 |                                 ));
  737 |                                 continue;
  738 |                             }
  739 |                         }
  740 |                     }
  741 |                     let mut ids = RowAddrTreeMap::from(range.clone());
  742 |                     let offset_start = offset;
  743 |                     offset += range.end - range.start;
  744 |                     for (i, val) in range.clone().enumerate() {
  745 |                         if !bitmap.get(i) && ids.remove(val) {
  746 |                             offset -= 1;
  747 |                         }
  748 |                     }
  749 |                     ids.mask(mask);
  750 |                     let mut bitmap_iter = bitmap.iter();
  751 |                     let mut bitmap_iter_pos = 0;
  752 |                     let mut holes_passed = 0;
  753 |                     ranges.extend(GroupingIterator::new(ids.into_addr_iter().map(|addr| {
  754 |                         let position_in_range = addr - range.start;
  755 |                         while bitmap_iter_pos < position_in_range {
  756 |                             if !bitmap_iter.next().unwrap() {
  757 |                                 holes_passed += 1;
  758 |                             }
  759 |                             bitmap_iter_pos += 1;
  760 |                         }
  761 |                         offset_start + position_in_range - holes_passed
  762 |                     })));
  763 |                 }
  764 |                 U64Segment::Ranges { range, runs } => {
  765 |                     let offset_start = offset;
  766 |                     offset += runs.present_len() as u64;
  767 |                     let mut ids = RowAddrTreeMap::new();
  768 |                     for present in runs.present_ranges() {
  769 |                         ids.insert_range(
  770 |                             (range.start + present.start as u64)
  771 |                                 ..(range.start + present.end as u64),
  772 |                         );
  773 |                     }
  774 |                     ids.mask(mask);
  775 |                     ranges.extend(GroupingIterator::new(ids.into_addr_iter().map(|addr| {
  776 |                         let position = runs
  777 |                             .position((addr - range.start) as u32)
  778 |                             .expect("addresses were inserted from the present ranges");
  779 |                         offset_start + position as u64
  780 |                     })));
  781 |                 }
  782 |                 U64Segment::SortedArray(array) | U64Segment::Array(array) => {
  783 |                     // TODO: Could probably optimize the sorted array case to be O(N) instead of O(N log N)
  784 |                     ranges.extend(GroupingIterator::new(array.iter().enumerate().filter_map(
  785 |                         |(off, id)| {
  786 |                             if mask.selected(id) {
  787 |                                 Some(off as u64 + offset)
  788 |                             } else {
  789 |                                 None
  790 |                             }
  791 |                         },
  792 |                     )));
  793 |                     offset += array.len() as u64;
  794 |                 }
  795 |             }
  796 |         }
  797 |         ranges
  798 |     }
  799 | }
  800 | 
  801 | /// An iterator that groups row ids into ranges
  802 | ///
  803 | /// For example, given an input iterator of [1, 2, 3, 5, 6, 7, 10, 11, 12]
  804 | /// this will return an iterator of [(1..4), (5..8), (10..13)]
  805 | struct GroupingIterator<I: Iterator<Item = u64>> {
  806 |     iter: I,
  807 |     cur_range: Option<Range<u64>>,
  808 | }
  809 | 
  810 | impl<I: Iterator<Item = u64>> GroupingIterator<I> {
  811 |     fn new(iter: I) -> Self {
  812 |         Self {
  813 |             iter,
  814 |             cur_range: None,
  815 |         }
  816 |     }
  817 | }
  818 | 
  819 | impl<I: Iterator<Item = u64>> Iterator for GroupingIterator<I> {
  820 |     type Item = Range<u64>;
  821 | 
  822 |     fn next(&mut self) -> Option<Self::Item> {
  823 |         for id in self.iter.by_ref() {
  824 |             if let Some(range) = self.cur_range.as_mut() {
  825 |                 if range.end == id {
  826 |                     range.end = id + 1;
  827 |                 } else {
  828 |                     let ret = Some(range.clone());
  829 |                     self.cur_range = Some(id..id + 1);
  830 |                     return ret;
  831 |                 }
  832 |             } else {
  833 |                 self.cur_range = Some(id..id + 1);
  834 |             }
  835 |         }
  836 |         self.cur_range.take()
  837 |     }
  838 | }
  839 | 
  840 | /// Offsets of sorted `ids` (all within `range`) via incremental bitmap
  841 | /// prefix counts, grouped into ranges. Every id is visited once; the bitmap
  842 | /// slice between consecutive ids is popcounted exactly once overall.
  843 | fn bitmap_selected_offsets(
  844 |     ids: impl Iterator<Item = u64>,
  845 |     range: &Range<u64>,
  846 |     bitmap: &bitmap::Bitmap,
  847 |     offset_start: u64,
  848 | ) -> Vec<Range<u64>> {
  849 |     let mut previous_position = 0;
  850 |     let mut live_before = 0;
  851 |     let selected_offsets = ids.filter_map(|row_id| {
  852 |         let position = (row_id - range.start) as usize;
  853 |         if !bitmap.get(position) {
  854 |             return None;
  855 |         }
  856 |         live_before += bitmap
  857 |             .slice(previous_position, position - previous_position)
  858 |             .count_ones();
  859 |         previous_position = position;
  860 |         Some(offset_start + live_before as u64)
  861 |     });
  862 |     GroupingIterator::new(selected_offsets).collect()
  863 | }
  864 | 
  865 | impl From<&RowIdSequence> for RowAddrTreeMap {
  866 |     fn from(row_ids: &RowIdSequence) -> Self {
  867 |         let mut tree_map = Self::new();
  868 |         for segment in &row_ids.0 {
  869 |             let mut seg = Self::new();
  870 |             match segment {
  871 |                 U64Segment::Range(range) => {
  872 |                     seg.insert_range(range.clone());
  873 |                 }
  874 |                 U64Segment::RangeWithBitmap { range, bitmap } => {
  875 |                     seg.insert_range(range.clone());
  876 |                     for (i, val) in range.clone().enumerate() {
  877 |                         if !bitmap.get(i) {
  878 |                             seg.remove(val);
  879 |                         }
  880 |                     }
  881 |                 }
  882 |                 U64Segment::RangeWithHoles { range, holes } => {
  883 |                     seg.insert_range(range.clone());
  884 |                     for hole in holes.iter() {
  885 |                         seg.remove(hole);
  886 |                     }
  887 |                 }
  888 |                 U64Segment::Ranges { range, runs } => {
  889 |                     for present in runs.present_ranges() {
  890 |                         seg.insert_range(
  891 |                             (range.start + present.start as u64)
  892 |                                 ..(range.start + present.end as u64),
  893 |                         );
  894 |                     }
  895 |                 }
  896 |                 U64Segment::SortedArray(array) | U64Segment::Array(array) => {
  897 |                     for val in array.iter() {
  898 |                         seg.insert(val);
  899 |                     }
  900 |                 }
  901 |             }
  902 |             tree_map |= seg;
  903 |         }
  904 |         tree_map
  905 |     }
  906 | }
  907 | 
  908 | #[derive(Debug)]
  909 | pub struct RowIdSeqSlice<'a> {
  910 |     /// Current slice of the segments we cover
  911 |     segments: &'a [U64Segment],
  912 |     /// Offset into the first segment to start iterating from
  913 |     offset_start: usize,
  914 |     /// Offset into the last segment to stop iterating at
  915 |     offset_last: usize,
  916 | }
  917 | 
  918 | impl RowIdSeqSlice<'_> {
  919 |     pub fn iter(&self) -> impl Iterator<Item = u64> + '_ {
  920 |         let mut known_size = self.segments.iter().map(|segment| segment.len()).sum();
  921 |         known_size -= self.offset_start;
  922 |         known_size -= self.segments.last().map(|s| s.len()).unwrap_or_default() - self.offset_last;
  923 | 
  924 |         let end = self.segments.len().saturating_sub(1);
  925 |         self.segments
  926 |             .iter()
  927 |             .enumerate()
  928 |             .flat_map(move |(i, segment)| {
  929 |                 match i {
  930 |                     0 if self.segments.len() == 1 => {
  931 |                         let len = self.offset_last - self.offset_start;
  932 |                         // TODO: Optimize this so we don't have to use skip
  933 |                         // (take is probably fine though.)
  934 |                         Box::new(segment.iter().skip(self.offset_start).take(len))
  935 |                             as Box<dyn Iterator<Item = u64>>
  936 |                     }
  937 |                     0 => Box::new(segment.iter().skip(self.offset_start)),
  938 |                     i if i == end => Box::new(segment.iter().take(self.offset_last)),
  939 |                     _ => Box::new(segment.iter()),
  940 |                 }
  941 |             })
  942 |             .exact_size(known_size)
  943 |     }
  944 | }
  945 | 
  946 | /// Re-chunk a sequences of row ids into chunks of a given size.
  947 | ///
  948 | /// The sequences may less than chunk sizes, because the sequences only
  949 | /// contains the row ids that we want to keep, they come from the updates records.
  950 | /// But the chunk sizes are based on the fragment physical rows(may contain inserted records).
  951 | /// So if the sequences are smaller than the chunk sizes, we need to
  952 | /// assign the incremental row ids in the further step. This behavior is controlled by the
  953 | /// `allow_incomplete` parameter.
  954 | ///
  955 | /// # Errors
  956 | ///
  957 | /// If `allow_incomplete` is false, will return an error if the sum of the chunk sizes
  958 | /// is not equal to the total number of row ids in the sequences.
  959 | pub fn rechunk_sequences(
  960 |     sequences: impl IntoIterator<Item = RowIdSequence>,
  961 |     chunk_sizes: impl IntoIterator<Item = u64>,
  962 |     allow_incomplete: bool,
  963 | ) -> Result<Vec<RowIdSequence>> {
  964 |     // TODO: return an iterator. (with a good size hint?)
  965 |     let chunk_sizes_vec: Vec<u64> = chunk_sizes.into_iter().collect();
  966 |     let total_chunks = chunk_sizes_vec.len();
  967 |     let mut chunked_sequences = Vec::with_capacity(total_chunks);
  968 |     let mut segment_iter = sequences
  969 |         .into_iter()
  970 |         .flat_map(|sequence| sequence.0.into_iter())
  971 |         .peekable();
  972 | 
  973 |     let too_few_segments_error = |chunk_index: usize, expected_chunk_size: u64, remaining: u64| {
  974 |         Error::invalid_input(format!(
  975 |             "Got too few segments for chunk {}. Expected chunk size: {}, remaining needed: {}",
  976 |             chunk_index, expected_chunk_size, remaining
  977 |         ))
  978 |     };
  979 | 
  980 |     let too_many_segments_error = |processed_chunks: usize, total_chunk_sizes: usize| {
  981 |         Error::invalid_input(format!(
  982 |             "Got too many segments for the provided chunk lengths. Processed {} chunks out of {} expected",
  983 |             processed_chunks, total_chunk_sizes
  984 |         ))
  985 |     };
  986 | 
  987 |     let mut segment_offset = 0_u64;
  988 | 
  989 |     for (chunk_index, chunk_size) in chunk_sizes_vec.iter().enumerate() {
  990 |         let chunk_size = *chunk_size;
  991 |         let mut sequence = RowIdSequence(Vec::new());
  992 |         let mut remaining = chunk_size;
  993 | 
  994 |         while remaining > 0 {
  995 |             let remaining_in_segment = segment_iter
  996 |                 .peek()
  997 |                 .map_or(0, |segment| segment.len() as u64 - segment_offset);
  998 | 
  999 |             // Step 1: Handle segment remaining to be empty(also empty seg) - skip and continue
 1000 |             if remaining_in_segment == 0 {
 1001 |                 if segment_iter.next().is_some() {
 1002 |                     segment_offset = 0;
 1003 |                     continue;
 1004 |                 } else {
 1005 |                     // No more segments available
 1006 |                     if allow_incomplete {
 1007 |                         break;
 1008 |                     } else {
 1009 |                         return Err(too_few_segments_error(chunk_index, chunk_size, remaining));
 1010 |                     }
 1011 |                 }
 1012 |             }
 1013 | 
 1014 |             // Step 2: Handle still remaining segment based on size comparison
 1015 |             match remaining_in_segment.cmp(&remaining) {
 1016 |                 std::cmp::Ordering::Greater => {
 1017 |                     // Segment is larger than remaining space - slice it
 1018 |                     let segment = segment_iter
 1019 |                         .peek()
 1020 |                         .ok_or_else(|| too_few_segments_error(chunk_index, chunk_size, remaining))?
 1021 |                         .slice(segment_offset as usize, remaining as usize);
 1022 |                     sequence.extend(RowIdSequence(vec![segment]));
 1023 |                     segment_offset += remaining;
 1024 |                     remaining = 0;
 1025 |                 }
 1026 |                 std::cmp::Ordering::Equal | std::cmp::Ordering::Less => {
 1027 |                     // UNIFIED HANDLING: Both equal and less cases subtract from remaining
 1028 |                     // Equal case: remaining -= remaining_in_segment (remaining becomes 0)
 1029 |                     // Less case: remaining -= remaining_in_segment (remaining becomes positive)
 1030 |                     let segment = segment_iter
 1031 |                         .next()
 1032 |                         .ok_or_else(|| too_few_segments_error(chunk_index, chunk_size, remaining))?
 1033 |                         .slice(segment_offset as usize, remaining_in_segment as usize);
 1034 |                     sequence.extend(RowIdSequence(vec![segment]));
 1035 |                     segment_offset = 0;
 1036 |                     remaining -= remaining_in_segment;
 1037 |                 }
 1038 |             }
 1039 |         }
 1040 | 
 1041 |         chunked_sequences.push(sequence);
 1042 |     }
 1043 | 
 1044 |     if segment_iter.peek().is_some() {
 1045 |         return Err(too_many_segments_error(
 1046 |             chunked_sequences.len(),
 1047 |             total_chunks,
 1048 |         ));
 1049 |     }
 1050 | 
 1051 |     Ok(chunked_sequences)
 1052 | }
 1053 | 
 1054 | /// Selects the row ids from a sequence based on the provided offsets.
 1055 | pub fn select_row_ids<'a>(
 1056 |     sequence: &'a RowIdSequence,
 1057 |     offsets: &'a ReadBatchParams,
 1058 | ) -> Result<Vec<u64>> {
 1059 |     let out_of_bounds_err = |offset: u32| {
 1060 |         Error::invalid_input(format!(
 1061 |             "Index out of bounds: {} for sequence of length {}",
 1062 |             offset,
 1063 |             sequence.len()
 1064 |         ))
 1065 |     };
 1066 | 
 1067 |     match offsets {
 1068 |         ReadBatchParams::Indices(indices) => {
 1069 |             let indices = indices.values();
 1070 |             if indices.windows(2).all(|pair| pair[0] <= pair[1]) {
 1071 |                 // `select` drops out-of-bounds indices instead of erroring.
 1072 |                 if let Some(&last) = indices.last()
 1073 |                     && last as u64 >= sequence.len()
 1074 |                 {
 1075 |                     return Err(out_of_bounds_err(last));
 1076 |                 }
 1077 |                 return Ok(sequence
 1078 |                     .select(indices.iter().map(|&index| index as usize))
 1079 |                     .collect());
 1080 |             }
 1081 |             indices
 1082 |                 .iter()
 1083 |                 .map(|index| {
 1084 |                     sequence
 1085 |                         .get(*index as usize)
 1086 |                         .ok_or_else(|| out_of_bounds_err(*index))
 1087 |                 })
 1088 |                 .collect()
 1089 |         }
 1090 |         ReadBatchParams::Range(range) => {
 1091 |             if range.end > sequence.len() as usize {
 1092 |                 return Err(out_of_bounds_err(range.end as u32));
 1093 |             }
 1094 |             let sequence = sequence.slice(range.start, range.end - range.start);
 1095 |             Ok(sequence.iter().collect())
 1096 |         }
 1097 |         ReadBatchParams::Ranges(ranges) => {
 1098 |             let num_rows = ranges
 1099 |                 .iter()
 1100 |                 .map(|r| (r.end - r.start) as usize)
 1101 |                 .sum::<usize>();
 1102 |             let mut result = Vec::with_capacity(num_rows);
 1103 |             for range in ranges.as_ref() {
 1104 |                 if range.end > sequence.len() {
 1105 |                     return Err(out_of_bounds_err(range.end as u32));
 1106 |                 }
 1107 |                 let sequence =
 1108 |                     sequence.slice(range.start as usize, (range.end - range.start) as usize);
 1109 |                 result.extend(sequence.iter());
 1110 |             }
 1111 |             Ok(result)
 1112 |         }
 1113 | 
 1114 |         ReadBatchParams::RangeFull => Ok(sequence.iter().collect()),
 1115 |         ReadBatchParams::RangeTo(to) => {
 1116 |             if to.end > sequence.len() as usize {
 1117 |                 return Err(out_of_bounds_err(to.end as u32));
 1118 |             }
 1119 |             let len = to.end;
 1120 |             let sequence = sequence.slice(0, len);
 1121 |             Ok(sequence.iter().collect())
 1122 |         }
 1123 |         ReadBatchParams::RangeFrom(from) => {
 1124 |             let sequence = sequence.slice(from.start, sequence.len() as usize - from.start);
 1125 |             Ok(sequence.iter().collect())
 1126 |         }
 1127 |     }
 1128 | }
 1129 | 
 1130 | #[cfg(test)]
 1131 | mod test {
 1132 |     use super::*;
 1133 | 
 1134 |     use pretty_assertions::assert_eq;
 1135 |     use test::bitmap::Bitmap;
 1136 | 
 1137 |     #[test]
 1138 |     fn test_row_id_sequence_from_range() {
 1139 |         let sequence = RowIdSequence::from(0..10);
 1140 |         assert_eq!(sequence.len(), 10);
 1141 |         assert_eq!(sequence.is_empty(), false);
 1142 | 
 1143 |         let iter = sequence.iter();
 1144 |         assert_eq!(iter.collect::<Vec<_>>(), (0..10).collect::<Vec<_>>());
 1145 |     }
 1146 | 
 1147 |     #[rstest::rstest]
 1148 |     #[case::sorted_contiguous(vec![0, 1, 2, 3])]
 1149 |     #[case::sorted_with_gaps(vec![0, 2, 4])]
 1150 |     #[case::sparse(vec![0, 1_000_000])]
 1151 |     #[case::unsorted(vec![12, 11, 10])]
 1152 |     fn test_row_id_sequence_try_from_iter(#[case] row_ids: Vec<u64>) {
 1153 |         let sequence = RowIdSequence::try_from_iter(row_ids.clone()).unwrap();
 1154 |         assert_eq!(sequence.len(), row_ids.len() as u64);
 1155 |         assert_eq!(sequence.iter().collect::<Vec<_>>(), row_ids);
 1156 |     }
 1157 | 
 1158 |     #[test]
 1159 |     fn test_row_id_sequence_try_from_iter_contiguous_is_a_range() {
 1160 |         let sequence = RowIdSequence::try_from_iter(0..10).unwrap();
 1161 |         assert_eq!(sequence.0, vec![U64Segment::Range(0..10)]);
 1162 |     }
 1163 | 
 1164 |     #[test]
 1165 |     fn test_row_id_sequence_try_from_iter_empty() {
 1166 |         let sequence = RowIdSequence::try_from_iter(std::iter::empty()).unwrap();
 1167 |         assert_eq!(sequence.len(), 0);
 1168 |         assert!(sequence.is_empty());
 1169 |     }
 1170 | 
 1171 |     #[rstest::rstest]
 1172 |     #[case::adjacent(vec![1, 1, 2])]
 1173 |     #[case::separated(vec![1, 2, 3, 1])]
 1174 |     #[case::unsorted(vec![5, 3, 5])]
 1175 |     fn test_row_id_sequence_try_from_iter_rejects_duplicates(#[case] row_ids: Vec<u64>) {
 1176 |         // Without validation these encode to a shorter sequence with a spurious
 1177 |         // hole rather than failing, so assert the error rather than the output.
 1178 |         let error = RowIdSequence::try_from_iter(row_ids).unwrap_err();
 1179 |         assert!(
 1180 |             matches!(error, Error::InvalidInput { .. }),
 1181 |             "expected InvalidInput, got {:?}",
 1182 |             error
 1183 |         );
 1184 |         assert!(
 1185 |             error.to_string().contains("must be unique"),
 1186 |             "unexpected message: {}",
 1187 |             error
 1188 |         );
 1189 |     }
 1190 | 
 1191 |     #[test]
 1192 |     fn test_row_id_sequence_extend() {
 1193 |         let mut sequence = RowIdSequence::from(0..10);
 1194 |         sequence.extend(RowIdSequence::from(10..20));
 1195 |         assert_eq!(sequence.0, vec![U64Segment::Range(0..20)]);
 1196 | 
 1197 |         let mut sequence = RowIdSequence::from(0..10);
 1198 |         sequence.extend(RowIdSequence::from(20..30));
 1199 |         assert_eq!(
 1200 |             sequence.0,
 1201 |             vec![U64Segment::Range(0..10), U64Segment::Range(20..30)]
 1202 |         );
 1203 |     }
 1204 | 
 1205 |     #[test]
 1206 |     fn test_row_id_sequence_delete() {
 1207 |         let mut sequence = RowIdSequence::from(0..10);
 1208 |         sequence.delete(vec![1, 3, 5, 7, 9]);
 1209 |         let mut expected_bitmap = Bitmap::new_empty(9);
 1210 |         for i in [0, 2, 4, 6, 8] {
 1211 |             expected_bitmap.set(i as usize);
 1212 |         }
 1213 |         assert_eq!(
 1214 |             sequence.0,
 1215 |             vec![U64Segment::RangeWithBitmap {
 1216 |                 range: 0..9,
 1217 |                 bitmap: expected_bitmap
 1218 |             },]
 1219 |         );
 1220 | 
 1221 |         let mut sequence = RowIdSequence::from(0..10);
 1222 |         sequence.extend(RowIdSequence::from(12..20));
 1223 |         sequence.delete(vec![0, 9, 10, 11, 12, 13]);
 1224 |         assert_eq!(
 1225 |             sequence.0,
 1226 |             vec![U64Segment::Range(1..9), U64Segment::Range(14..20),]
 1227 |         );
 1228 | 
 1229 |         let mut sequence = RowIdSequence::from(0..10);
 1230 |         sequence.delete(vec![0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
 1231 |         assert_eq!(sequence.0, vec![U64Segment::Range(0..0)]);
 1232 |     }
 1233 | 
 1234 |     #[test]
 1235 |     fn test_row_id_slice() {
 1236 |         // The type of sequence isn't that relevant to the implementation, so
 1237 |         // we can just have a single one with all the segment types.
 1238 |         let sequence = RowIdSequence(vec![
 1239 |             U64Segment::Range(30..35), // 5
 1240 |             U64Segment::RangeWithHoles {
 1241 |                 // 8
 1242 |                 range: 50..60,
 1243 |                 holes: vec![53, 54].into(),
 1244 |             },
 1245 |             U64Segment::SortedArray(vec![7, 9].into()), // 2
 1246 |             U64Segment::RangeWithBitmap {
 1247 |                 range: 0..5,
 1248 |                 bitmap: [true, false, true, false, true].as_slice().into(),
 1249 |             },
 1250 |             U64Segment::Array(vec![35, 39].into()),
 1251 |             U64Segment::Range(40..50),
 1252 |         ]);
 1253 | 
 1254 |         // All possible offsets and lengths
 1255 |         for offset in 0..sequence.len() as usize {
 1256 |             for len in 0..sequence.len() as usize {
 1257 |                 if offset + len > sequence.len() as usize {
 1258 |                     continue;
 1259 |                 }
 1260 |                 let slice = sequence.slice(offset, len);
 1261 | 
 1262 |                 let actual = slice.iter().collect::<Vec<_>>();
 1263 |                 let expected = sequence.iter().skip(offset).take(len).collect::<Vec<_>>();
 1264 |                 assert_eq!(
 1265 |                     actual, expected,
 1266 |                     "Failed for offset {} and len {}",
 1267 |                     offset, len
 1268 |                 );
 1269 | 
 1270 |                 let (claimed_size, claimed_max) = slice.iter().size_hint();
 1271 |                 assert_eq!(claimed_max, Some(claimed_size)); // Exact size hint
 1272 |                 assert_eq!(claimed_size, actual.len()); // Correct size hint
 1273 |             }
 1274 |         }
 1275 |     }
 1276 | 
 1277 |     #[test]
 1278 |     fn test_row_id_slice_empty() {
 1279 |         let sequence = RowIdSequence::from(0..10);
 1280 |         let slice = sequence.slice(10, 0);
 1281 |         assert_eq!(slice.iter().collect::<Vec<_>>(), Vec::<u64>::new());
 1282 |     }
 1283 | 
 1284 |     #[test]
 1285 |     fn test_row_id_sequence_rechunk() {
 1286 |         fn assert_rechunked(
 1287 |             input: Vec<RowIdSequence>,
 1288 |             chunk_sizes: Vec<u64>,
 1289 |             expected: Vec<RowIdSequence>,
 1290 |         ) {
 1291 |             let chunked = rechunk_sequences(input, chunk_sizes, false).unwrap();
 1292 |             assert_eq!(chunked, expected);
 1293 |         }
 1294 | 
 1295 |         // Small pieces to larger ones
 1296 |         let many_segments = vec![
 1297 |             RowIdSequence(vec![U64Segment::Range(0..5), U64Segment::Range(35..40)]),
 1298 |             RowIdSequence::from(10..18),
 1299 |             RowIdSequence::from(18..28),
 1300 |             RowIdSequence::from(28..30),
 1301 |         ];
 1302 |         let fewer_segments = vec![
 1303 |             RowIdSequence(vec![U64Segment::Range(0..5), U64Segment::Range(35..40)]),
 1304 |             RowIdSequence::from(10..30),
 1305 |         ];
 1306 |         assert_rechunked(
 1307 |             many_segments.clone(),
 1308 |             fewer_segments.iter().map(|seq| seq.len()).collect(),
 1309 |             fewer_segments.clone(),
 1310 |         );
 1311 | 
 1312 |         // Large pieces to smaller ones
 1313 |         assert_rechunked(
 1314 |             fewer_segments,
 1315 |             many_segments.iter().map(|seq| seq.len()).collect(),
 1316 |             many_segments.clone(),
 1317 |         );
 1318 | 
 1319 |         // Equal pieces
 1320 |         assert_rechunked(
 1321 |             many_segments.clone(),
 1322 |             many_segments.iter().map(|seq| seq.len()).collect(),
 1323 |             many_segments.clone(),
 1324 |         );
 1325 | 
 1326 |         // Too few segments -> error
 1327 |         let result = rechunk_sequences(many_segments.clone(), vec![100], false);
 1328 |         assert!(result.is_err());
 1329 | 
 1330 |         // Too many segments -> error
 1331 |         let result = rechunk_sequences(many_segments, vec![5], false);
 1332 |         assert!(result.is_err());
 1333 |     }
 1334 | 
 1335 |     #[test]
 1336 |     fn test_select_row_ids() {
 1337 |         // All forms of offsets
 1338 |         let offsets = [
 1339 |             ReadBatchParams::Indices(vec![1, 3, 9, 5, 7, 6].into()),
 1340 |             ReadBatchParams::Indices(vec![1, 3, 5, 6, 7, 9].into()),
 1341 |             ReadBatchParams::Range(2..8),
 1342 |             ReadBatchParams::RangeFull,
 1343 |             ReadBatchParams::RangeTo(..5),
 1344 |             ReadBatchParams::RangeFrom(5..),
 1345 |             ReadBatchParams::Ranges(vec![2..3, 5..10].into()),
 1346 |         ];
 1347 | 
 1348 |         // Sequences with all segment types. These have at least 10 elements,
 1349 |         // so they are valid for all the above offsets.
 1350 |         let sequences = [
 1351 |             RowIdSequence(vec![
 1352 |                 U64Segment::Range(0..5),
 1353 |                 U64Segment::RangeWithHoles {
 1354 |                     range: 50..60,
 1355 |                     holes: vec![53, 54].into(),
 1356 |                 },
 1357 |                 U64Segment::SortedArray(vec![7, 9].into()),
 1358 |             ]),
 1359 |             RowIdSequence(vec![
 1360 |                 U64Segment::RangeWithBitmap {
 1361 |                     range: 0..5,
 1362 |                     bitmap: [true, false, true, false, true].as_slice().into(),
 1363 |                 },
 1364 |                 U64Segment::Array(vec![30, 20, 10].into()),
 1365 |                 U64Segment::Range(40..50),
 1366 |             ]),
 1367 |         ];
 1368 | 
 1369 |         for params in offsets {
 1370 |             for sequence in &sequences {
 1371 |                 let row_ids = select_row_ids(sequence, &params).unwrap();
 1372 |                 let flat_sequence = sequence.iter().collect::<Vec<_>>();
 1373 | 
 1374 |                 // Transform params into bounded ones
 1375 |                 let selection: Vec<usize> = match &params {
 1376 |                     ReadBatchParams::RangeFull => (0..flat_sequence.len()).collect(),
 1377 |                     ReadBatchParams::RangeTo(to) => (0..to.end).collect(),
 1378 |                     ReadBatchParams::RangeFrom(from) => (from.start..flat_sequence.len()).collect(),
 1379 |                     ReadBatchParams::Range(range) => range.clone().collect(),
 1380 |                     ReadBatchParams::Ranges(ranges) => ranges
 1381 |                         .iter()
 1382 |                         .flat_map(|r| r.start as usize..r.end as usize)
 1383 |                         .collect(),
 1384 |                     ReadBatchParams::Indices(indices) => {
 1385 |                         indices.values().iter().map(|i| *i as usize).collect()
 1386 |                     }
 1387 |                 };
 1388 | 
 1389 |                 let expected = selection
 1390 |                     .into_iter()
 1391 |                     .map(|i| flat_sequence[i])
 1392 |                     .collect::<Vec<_>>();
 1393 |                 assert_eq!(
 1394 |                     row_ids, expected,
 1395 |                     "Failed for params {:?} on the sequence {:?}",
 1396 |                     &params, sequence
 1397 |                 );
 1398 |             }
 1399 |         }
 1400 |     }
 1401 | 
 1402 |     #[test]
 1403 |     fn test_select_row_ids_out_of_bounds() {
 1404 |         let offsets = [
 1405 |             ReadBatchParams::Indices(vec![1, 1000, 4].into()),
 1406 |             ReadBatchParams::Indices(vec![1, 4, 1000].into()),
 1407 |             ReadBatchParams::Range(2..1000),
 1408 |             ReadBatchParams::RangeTo(..1000),
 1409 |         ];
 1410 | 
 1411 |         let sequence = RowIdSequence::from(0..10);
 1412 | 
 1413 |         for params in offsets {
 1414 |             let result = select_row_ids(&sequence, &params);
 1415 |             assert!(result.is_err());
 1416 |             assert!(matches!(result.unwrap_err(), Error::InvalidInput { .. }));
 1417 |         }
 1418 |     }
 1419 | 
 1420 |     #[test]
 1421 |     fn test_row_id_sequence_to_treemap() {
 1422 |         let sequence = RowIdSequence(vec![
 1423 |             U64Segment::Range(0..5),
 1424 |             U64Segment::RangeWithHoles {
 1425 |                 range: 50..60,
 1426 |                 holes: vec![53, 54].into(),
 1427 |             },
 1428 |             U64Segment::SortedArray(vec![7, 9].into()),
 1429 |             U64Segment::RangeWithBitmap {
 1430 |                 range: 10..15,
 1431 |                 bitmap: [true, false, true, false, true].as_slice().into(),
 1432 |             },
 1433 |             U64Segment::Array(vec![35, 39].into()),
 1434 |             U64Segment::Range(40..50),
 1435 |         ]);
 1436 | 
 1437 |         let tree_map = RowAddrTreeMap::from(&sequence);
 1438 |         let expected = vec![
 1439 |             0, 1, 2, 3, 4, 7, 9, 10, 12, 14, 35, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
 1440 |             51, 52, 55, 56, 57, 58, 59,
 1441 |         ]
 1442 |         .into_iter()
 1443 |         .collect::<RowAddrTreeMap>();
 1444 |         assert_eq!(tree_map, expected);
 1445 |     }
 1446 | 
 1447 |     #[test]
 1448 |     fn test_row_id_sequence_to_treemap_overlapping_segments() {
 1449 |         // Compaction can concatenate segments whose ranges overlap but whose
 1450 |         // selected ids are disjoint (here: even ids, then odd ids over 0..6).
 1451 |         // The tree map must contain every id the sequence yields.
 1452 |         let sequence = RowIdSequence(vec![
 1453 |             U64Segment::RangeWithBitmap {
 1454 |                 range: 0..6,
 1455 |                 bitmap: [true, false, true, false, true, false].as_slice().into(),
 1456 |             },
 1457 |             U64Segment::RangeWithBitmap {
 1458 |                 range: 0..6,
 1459 |                 bitmap: [false, true, false, true, false, true].as_slice().into(),
 1460 |             },
 1461 |         ]);
 1462 | 
 1463 |         let expected = sequence.iter().collect::<RowAddrTreeMap>();
 1464 |         assert_eq!(expected, (0..6).collect::<RowAddrTreeMap>());
 1465 |         assert_eq!(RowAddrTreeMap::from(&sequence), expected);
 1466 |     }
 1467 | 
 1468 |     #[test]
 1469 |     fn test_row_addr_mask() {
 1470 |         // 0, 1, 2, 3, 4
 1471 |         // 50, 51, 52, 55, 56, 57, 58, 59
 1472 |         // 7, 9
 1473 |         // 10, 12, 14
 1474 |         // 35, 39
 1475 |         let sequence = RowIdSequence(vec![
 1476 |             U64Segment::Range(0..5),
 1477 |             U64Segment::RangeWithHoles {
 1478 |                 range: 50..60,
 1479 |                 holes: vec![53, 54].into(),
 1480 |             },
 1481 |             U64Segment::SortedArray(vec![7, 9].into()),
 1482 |             U64Segment::RangeWithBitmap {
 1483 |                 range: 10..15,
 1484 |                 bitmap: [true, false, true, false, true].as_slice().into(),
 1485 |             },
 1486 |             U64Segment::Array(vec![35, 39].into()),
 1487 |         ]);
 1488 | 
 1489 |         // Masking one in each segment
 1490 |         let values_to_remove = [4, 55, 7, 12, 39];
 1491 |         let positions_to_remove = sequence
 1492 |             .iter()
 1493 |             .enumerate()
 1494 |             .filter_map(|(i, val)| {
 1495 |                 if values_to_remove.contains(&val) {
 1496 |                     Some(i as u32)
 1497 |                 } else {
 1498 |                     None
 1499 |                 }
 1500 |             })
 1501 |             .collect::<Vec<_>>();
 1502 |         let mut sequence = sequence;
 1503 |         sequence.mask(positions_to_remove).unwrap();
 1504 |         let expected = RowIdSequence(vec![
 1505 |             U64Segment::Range(0..4),
 1506 |             U64Segment::RangeWithBitmap {
 1507 |                 range: 50..60,
 1508 |                 bitmap: [
 1509 |                     true, true, true, false, false, false, true, true, true, true,
 1510 |                 ]
 1511 |                 .as_slice()
 1512 |                 .into(),
 1513 |             },
 1514 |             U64Segment::Range(9..10),
 1515 |             U64Segment::RangeWithBitmap {
 1516 |                 range: 10..15,
 1517 |                 bitmap: [true, false, false, false, true].as_slice().into(),
 1518 |             },
 1519 |             U64Segment::Array(vec![35].into()),
 1520 |         ]);
 1521 |         assert_eq!(sequence, expected);
 1522 |     }
 1523 | 
 1524 |     #[test]
 1525 |     fn test_row_addr_mask_everything() {
 1526 |         let mut sequence = RowIdSequence(vec![
 1527 |             U64Segment::Range(0..5),
 1528 |             U64Segment::SortedArray(vec![7, 9].into()),
 1529 |         ]);
 1530 |         sequence.mask(0..sequence.len() as u32).unwrap();
 1531 |         let expected = RowIdSequence(vec![]);
 1532 |         assert_eq!(sequence, expected);
 1533 |     }
 1534 | 
 1535 |     #[test]
 1536 |     fn test_selection() {
 1537 |         let sequence = RowIdSequence(vec![
 1538 |             U64Segment::Range(0..5),
 1539 |             U64Segment::RangeWithHoles {
 1540 |                 range: 10..16,
 1541 |                 holes: vec![12].into(),
 1542 |             },
 1543 |             U64Segment::RangeWithBitmap {
 1544 |                 range: 20..28,
 1545 |                 bitmap: [true, false, true, true, false, true, false, true]
 1546 |                     .as_slice()
 1547 |                     .into(),
 1548 |             },
 1549 |             U64Segment::SortedArray(vec![40, 42, 45].into()),
 1550 |             U64Segment::Array(vec![60, 50, 70].into()),
 1551 |         ]);
 1552 |         let live = sequence.iter().collect::<Vec<_>>();
 1553 |         let selection = sequence.select(vec![2, 4, 13, 14, 57].into_iter());
 1554 |         assert_eq!(
 1555 |             selection.collect::<Vec<_>>(),
 1556 |             vec![live[2], live[4], live[13], live[14]]
 1557 |         );
 1558 | 
 1559 |         for chunk_size in [1, 3, 7, 16] {
 1560 |             let mut cursor = sequence.cursor();
 1561 |             let mut chunked = Vec::new();
 1562 |             for start in (0..live.len()).step_by(chunk_size) {
 1563 |                 let end = (start + chunk_size).min(live.len());
 1564 |                 chunked.extend(sequence.select_range_with_cursor(&mut cursor, start..end));
 1565 |             }
 1566 |             assert_eq!(chunked, live);
 1567 |         }
 1568 | 
 1569 |         let mut cursor = sequence.cursor();
 1570 |         assert_eq!(
 1571 |             sequence.select_range_with_cursor(&mut cursor, 6..19),
 1572 |             live[6..19]
 1573 |         );
 1574 |         assert_eq!(
 1575 |             sequence.select_range_with_cursor(&mut cursor, 1..8),
 1576 |             live[1..8]
 1577 |         );
 1578 |         assert_eq!(
 1579 |             sequence.select_range_with_cursor(&mut cursor, live.len() - 2..live.len() + 5),
 1580 |             live[live.len() - 2..]
 1581 |         );
 1582 |     }
 1583 | 
 1584 |     #[test]
 1585 |     fn test_selection_over_bitmap_segments() {
 1586 |         let mut bitmap = Bitmap::new_full(40);
 1587 |         for hole in [3, 4, 17, 39] {
 1588 |             bitmap.clear(hole);
 1589 |         }
 1590 |         let sequence = RowIdSequence(vec![
 1591 |             U64Segment::RangeWithBitmap {
 1592 |                 range: 100..140,
 1593 |                 bitmap,
 1594 |             },
 1595 |             U64Segment::Range(200..205),
 1596 |         ]);
 1597 |         let live: Vec<u64> = sequence.iter().collect();
 1598 |         assert_eq!(live.len(), 41);
 1599 | 
 1600 |         // Every index, one cursor pass.
 1601 |         let all = sequence.select(0..live.len()).collect::<Vec<_>>();
 1602 |         assert_eq!(all, live);
 1603 |         // Sparse, repeated, and past-the-end indices agree with the full pass.
 1604 |         let picks = vec![0, 2, 3, 3, 15, 16, 35, 36, 40, 99];
 1605 |         let got = sequence.select(picks.iter().copied()).collect::<Vec<_>>();
 1606 |         let want: Vec<u64> = picks.iter().filter_map(|&i| live.get(i).copied()).collect();
 1607 |         assert_eq!(got, want);
 1608 | 
 1609 |         let mut cursor = sequence.cursor();
 1610 |         let mut chunked = Vec::new();
 1611 |         for range in [0..7, 7..30, 30..live.len()] {
 1612 |             chunked.extend(sequence.select_range_with_cursor(&mut cursor, range));
 1613 |         }
 1614 |         assert_eq!(chunked, live);
 1615 |         assert_eq!(
 1616 |             sequence.select_range_with_cursor(&mut cursor, 2..6),
 1617 |             live[2..6]
 1618 |         );
 1619 |     }
 1620 | 
 1621 |     #[test]
 1622 |     fn test_dense_range_cursor_selection() {
 1623 |         let mut bitmap = Bitmap::new_full(40);
 1624 |         for hole in [3, 4, 17, 39] {
 1625 |             bitmap.clear(hole);
 1626 |         }
 1627 |         let sequence = RowIdSequence(vec![U64Segment::RangeWithBitmap {
 1628 |             range: 100..140,
 1629 |             bitmap,
 1630 |         }]);
 1631 |         let expected = sequence.iter().collect::<Vec<_>>();
 1632 |         let (mut cursor, use_dense_range_expansion) = sequence.cursor_with_dense_range_expansion();
 1633 |         assert!(use_dense_range_expansion);
 1634 |         assert_eq!(cursor.segment_len, Some(expected.len()));
 1635 | 
 1636 |         let mut actual = Vec::new();
 1637 |         for selection in [0..7, 7..8, 8..31, 31..expected.len() + 5] {
 1638 |             actual.extend(sequence.select_dense_range_with_cursor(&mut cursor, selection));
 1639 |         }
 1640 |         assert_eq!(actual, expected);
 1641 |         assert_eq!(
 1642 |             sequence.select_dense_range_with_cursor(&mut cursor, 2..9),
 1643 |             expected[2..9]
 1644 |         );
 1645 | 
 1646 |         let mut sparse_bitmap = Bitmap::new_empty(40);
 1647 |         for value in (0..40).step_by(2) {
 1648 |             sparse_bitmap.set(value);
 1649 |         }
 1650 |         let sparse = RowIdSequence(vec![U64Segment::RangeWithBitmap {
 1651 |             range: 0..40,
 1652 |             bitmap: sparse_bitmap,
 1653 |         }]);
 1654 |         let (sparse_cursor, use_dense_range_expansion) = sparse.cursor_with_dense_range_expansion();
 1655 |         assert!(!use_dense_range_expansion);
 1656 |         assert_eq!(sparse_cursor.segment_len, Some(20));
 1657 | 
 1658 |         let mut multiple_segments = sequence.clone();
 1659 |         multiple_segments.extend(RowIdSequence::from(200..205));
 1660 |         let (multiple_cursor, use_dense_range_expansion) =
 1661 |             multiple_segments.cursor_with_dense_range_expansion();
 1662 |         assert!(!use_dense_range_expansion);
 1663 |         assert_eq!(multiple_cursor.segment_len, None);
 1664 |     }
 1665 | 
 1666 |     #[test]
 1667 |     fn test_selection_over_a_large_bitmap_segment() {
 1668 |         // A restart-per-index scan of this segment takes tens of seconds, so a
 1669 |         // regression to that shows up as a test that no longer finishes quickly.
 1670 |         const ROWS: usize = 1_000_000;
 1671 |         let mut bitmap = Bitmap::new_full(ROWS);
 1672 |         for hole in (0..ROWS).step_by(17) {
 1673 |             bitmap.clear(hole);
 1674 |         }
 1675 |         let sequence = RowIdSequence(vec![
 1676 |             U64Segment::Range(0..8),
 1677 |             U64Segment::RangeWithBitmap {
 1678 |                 range: 1_000..(1_000 + ROWS as u64),
 1679 |                 bitmap,
 1680 |             },
 1681 |         ]);
 1682 |         let live: Vec<u64> = sequence.iter().collect();
 1683 | 
 1684 |         let all = sequence.select(0..live.len()).collect::<Vec<_>>();
 1685 |         assert_eq!(all, live);
 1686 | 
 1687 |         // Byte-boundary and tail indices, read through one cursor.
 1688 |         let mut picks: Vec<usize> = [0, 7, 8, 9, 15, 16, 63, 64, 65]
 1689 |             .into_iter()
 1690 |             .chain((0..live.len()).step_by(9973))
 1691 |             .chain([live.len() - 1, live.len()])
 1692 |             .collect();
 1693 |         picks.sort_unstable();
 1694 |         let got = sequence.select(picks.iter().copied()).collect::<Vec<_>>();
 1695 |         let want: Vec<u64> = picks.iter().filter_map(|&i| live.get(i).copied()).collect();
 1696 |         assert_eq!(got, want);
 1697 | 
 1698 |         let tail_start = live.len() - 100_000;
 1699 |         let mut cursor = sequence.cursor();
 1700 |         assert_eq!(
 1701 |             sequence.select_range_with_cursor(&mut cursor, tail_start..live.len()),
 1702 |             live[tail_start..]
 1703 |         );
 1704 | 
 1705 |         for chunk_size in [1, 7, 8, 9, 1_024, 4_097] {
 1706 |             let mut cursor = sequence.cursor();
 1707 |             let mut chunked = Vec::with_capacity(live.len() - tail_start);
 1708 |             let mut start = tail_start;
 1709 |             while start < live.len() {
 1710 |                 let end = (start + chunk_size).min(live.len());
 1711 |                 chunked.extend(sequence.select_range_with_cursor(&mut cursor, start..end));
 1712 |                 start = end;
 1713 |             }
 1714 |             assert_eq!(chunked, live[tail_start..]);
 1715 |         }
 1716 |     }
 1717 | 
 1718 |     #[test]
 1719 |     #[should_panic(expected = "Selection is not sorted")]
 1720 |     fn test_selection_unsorted() {
 1721 |         let sequence = RowIdSequence(vec![
 1722 |             U64Segment::Range(0..5),
 1723 |             U64Segment::Range(10..15),
 1724 |             U64Segment::Range(20..25),
 1725 |         ]);
 1726 |         let _ = sequence
 1727 |             .select(vec![2, 4, 3].into_iter())
 1728 |             .collect::<Vec<_>>();
 1729 |     }
 1730 | 
 1731 |     #[test]
 1732 |     fn test_mask_to_offset_ranges() {
 1733 |         // Tests with a simple range segment
 1734 |         let sequence = RowIdSequence(vec![U64Segment::Range(0..10)]);
 1735 |         let mask = RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(&[0, 2, 4, 6, 8]));
 1736 |         let ranges = sequence.mask_to_offset_ranges(&mask);
 1737 |         assert_eq!(ranges, vec![0..1, 2..3, 4..5, 6..7, 8..9]);
 1738 | 
 1739 |         let sequence = RowIdSequence(vec![U64Segment::Range(40..60)]);
 1740 |         let mask = RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(&[54]));
 1741 |         let ranges = sequence.mask_to_offset_ranges(&mask);
 1742 |         assert_eq!(ranges, vec![14..15]);
 1743 | 
 1744 |         let sequence = RowIdSequence(vec![U64Segment::Range(40..60)]);
 1745 |         let mask = RowAddrMask::from_block(RowAddrTreeMap::from_iter(&[54]));
 1746 |         let ranges = sequence.mask_to_offset_ranges(&mask);
 1747 |         assert_eq!(ranges, vec![0..14, 15..20]);
 1748 | 
 1749 |         // Test with a range segment with holes
 1750 |         // 0, 1, 3, 4, 5, 7, 8, 9
 1751 |         let sequence = RowIdSequence(vec![U64Segment::RangeWithHoles {
 1752 |             range: 0..10,
 1753 |             holes: vec![2, 6].into(),
 1754 |         }]);
 1755 |         let mask = RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(&[0, 2, 4, 6, 8]));
 1756 |         let ranges = sequence.mask_to_offset_ranges(&mask);
 1757 |         assert_eq!(ranges, vec![0..1, 3..4, 6..7]);
 1758 | 
 1759 |         let sequence = RowIdSequence(vec![U64Segment::RangeWithHoles {
 1760 |             range: 40..60,
 1761 |             holes: vec![47, 43].into(),
 1762 |         }]);
 1763 |         let mask = RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(&[44]));
 1764 |         let ranges = sequence.mask_to_offset_ranges(&mask);
 1765 |         assert_eq!(ranges, vec![3..4]);
 1766 | 
 1767 |         let sequence = RowIdSequence(vec![U64Segment::RangeWithHoles {
 1768 |             range: 40..60,
 1769 |             holes: vec![47, 43].into(),
 1770 |         }]);
 1771 |         let mask = RowAddrMask::from_block(RowAddrTreeMap::from_iter(&[44]));
 1772 |         let ranges = sequence.mask_to_offset_ranges(&mask);
 1773 |         assert_eq!(ranges, vec![0..3, 4..18]);
 1774 | 
 1775 |         // Test with a range segment with bitmap
 1776 |         // 0, 1, 4, 5, 6, 7
 1777 |         let sequence = RowIdSequence(vec![U64Segment::RangeWithBitmap {
 1778 |             range: 0..10,
 1779 |             bitmap: [
 1780 |                 true, true, false, false, true, true, true, true, false, false,
 1781 |             ]
 1782 |             .as_slice()
 1783 |             .into(),
 1784 |         }]);
 1785 |         let mask = RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(&[0, 2, 4, 6, 8]));
 1786 |         let ranges = sequence.mask_to_offset_ranges(&mask);
 1787 |         assert_eq!(ranges, vec![0..1, 2..3, 4..5]);
 1788 | 
 1789 |         let sequence = RowIdSequence(vec![U64Segment::RangeWithBitmap {
 1790 |             range: 40..45,
 1791 |             bitmap: [true, true, false, false, true].as_slice().into(),
 1792 |         }]);
 1793 |         let mask = RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(&[44]));
 1794 |         let ranges = sequence.mask_to_offset_ranges(&mask);
 1795 |         assert_eq!(ranges, vec![2..3]);
 1796 | 
 1797 |         let sequence = RowIdSequence(vec![U64Segment::RangeWithBitmap {
 1798 |             range: 40..45,
 1799 |             bitmap: [true, true, false, false, true].as_slice().into(),
 1800 |         }]);
 1801 |         let mask = RowAddrMask::from_block(RowAddrTreeMap::from_iter(&[44]));
 1802 |         let ranges = sequence.mask_to_offset_ranges(&mask);
 1803 |         assert_eq!(ranges, vec![0..2]);
 1804 | 
 1805 |         // Sparse selections across bitmap bytes must count earlier live ids,
 1806 |         // skip holes, and include the preceding segment's offset.
 1807 |         let mut bitmap = Bitmap::new_full(1_024);
 1808 |         for hole in [3, 7, 64, 1_000] {
 1809 |             bitmap.clear(hole);
 1810 |         }
 1811 |         let sequence = RowIdSequence(vec![
 1812 |             U64Segment::Range(0..5),
 1813 |             U64Segment::RangeWithBitmap {
 1814 |                 range: 1_000..2_024,
 1815 |                 bitmap,
 1816 |             },
 1817 |         ]);
 1818 |         let mask = RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(&[
 1819 |             999, 1_002, 1_003, 1_063, 1_064, 1_065, 2_000, 2_023, 2_024,
 1820 |         ]));
 1821 |         assert_eq!(
 1822 |             sequence.mask_to_offset_ranges(&mask),
 1823 |             vec![7..8, 66..68, 1_024..1_025]
 1824 |         );
 1825 |         assert!(
 1826 |             sequence
 1827 |                 .mask_to_offset_ranges(&RowAddrMask::allow_nothing())
 1828 |                 .is_empty()
 1829 |         );
 1830 |         let missing = RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(&[999, 2_024]));
 1831 |         assert!(sequence.mask_to_offset_ranges(&missing).is_empty());
 1832 | 
 1833 |         // A full-fragment allow-list has no finite cardinality and uses the
 1834 |         // range-based path.
 1835 |         let mut full_fragment = RowAddrTreeMap::new();
 1836 |         full_fragment.insert_fragment(0);
 1837 |         let mask = RowAddrMask::from_allowed(full_fragment);
 1838 |         assert_eq!(sequence.mask_to_offset_ranges(&mask), vec![0..5, 5..1_025]);
 1839 | 
 1840 |         // Test with a sorted array segment
 1841 |         let sequence = RowIdSequence(vec![U64Segment::SortedArray(vec![0, 2, 4, 6, 8].into())]);
 1842 |         let mask = RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(&[0, 6, 8]));
 1843 |         let ranges = sequence.mask_to_offset_ranges(&mask);
 1844 |         assert_eq!(ranges, vec![0..1, 3..5]);
 1845 | 
 1846 |         let sequence = RowIdSequence(vec![U64Segment::Array(vec![8, 2, 6, 0, 4].into())]);
 1847 |         let mask = RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(&[0, 6, 8]));
 1848 |         let ranges = sequence.mask_to_offset_ranges(&mask);
 1849 |         assert_eq!(ranges, vec![0..1, 2..4]);
 1850 | 
 1851 |         // Test with multiple segments
 1852 |         // 0, 1, 2, 3, 4, 100, 101, 102, 104, 44, 46, 78
 1853 |         // *, -, *, -, -, ***, ---, ---, ***, --, **, --
 1854 |         // 0, 1, 2, 3, 4,   5,   6,   7,   8,  9, 10, 11
 1855 |         let sequence = RowIdSequence(vec![
 1856 |             U64Segment::Range(0..5),
 1857 |             U64Segment::RangeWithHoles {
 1858 |                 range: 100..105,
 1859 |                 holes: vec![103].into(),
 1860 |             },
 1861 |             U64Segment::SortedArray(vec![44, 46, 78].into()),
 1862 |         ]);
 1863 |         let mask = RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(&[0, 2, 46, 100, 104]));
 1864 |         let ranges = sequence.mask_to_offset_ranges(&mask);
 1865 |         assert_eq!(ranges, vec![0..1, 2..3, 5..6, 8..9, 10..11]);
 1866 | 
 1867 |         // Test with empty mask (should select everything)
 1868 |         let sequence = RowIdSequence(vec![U64Segment::Range(0..10)]);
 1869 |         let mask = RowAddrMask::default();
 1870 |         let ranges = sequence.mask_to_offset_ranges(&mask);
 1871 |         assert_eq!(ranges, vec![0..10]);
 1872 | 
 1873 |         // Test with allow nothing mask
 1874 |         let sequence = RowIdSequence(vec![U64Segment::Range(0..10)]);
 1875 |         let mask = RowAddrMask::allow_nothing();
 1876 |         let ranges = sequence.mask_to_offset_ranges(&mask);
 1877 |         assert_eq!(ranges, vec![]);
 1878 |     }
 1879 | 
 1880 |     /// Brute-force oracle for `mask_to_offset_ranges`: expand every live id
 1881 |     /// in order and keep the offsets selected by the mask. It shares no logic
 1882 |     /// with the optimized paths, so agreement proves semantic equivalence.
 1883 |     /// Like the implementation, offsets are grouped per segment, so ranges
 1884 |     /// adjacent across a segment boundary stay split (e.g. `0..5, 5..1025`).
 1885 |     fn oracle_mask_to_offset_ranges(
 1886 |         sequence: &RowIdSequence,
 1887 |         mask: &RowAddrMask,
 1888 |     ) -> Vec<Range<u64>> {
 1889 |         let mut ranges = Vec::new();
 1890 |         let mut offset = 0u64;
 1891 |         for segment in &sequence.0 {
 1892 |             let selected = segment
 1893 |                 .iter()
 1894 |                 .enumerate()
 1895 |                 .filter_map(|(i, row_id)| mask.selected(row_id).then_some(offset + i as u64));
 1896 |             ranges.extend(GroupingIterator::new(selected));
 1897 |             offset += segment.len() as u64;
 1898 |         }
 1899 |         ranges
 1900 |     }
 1901 | 
 1902 |     /// Deterministic xorshift64* generator; keeps randomized tests free of new
 1903 |     /// dev-dependencies.
 1904 |     struct TestRng(u64);
 1905 | 
 1906 |     impl TestRng {
 1907 |         fn next(&mut self) -> u64 {
 1908 |             let mut x = self.0.max(1);
 1909 |             x ^= x >> 12;
 1910 |             x ^= x << 25;
 1911 |             x ^= x >> 27;
 1912 |             self.0 = x;
 1913 |             x.wrapping_mul(0x2545_F491_4F6C_DD1D)
 1914 |         }
 1915 | 
 1916 |         fn below(&mut self, bound: u64) -> u64 {
 1917 |             debug_assert!(bound > 0);
 1918 |             self.next() % bound
 1919 |         }
 1920 |     }
 1921 | 
 1922 |     /// Random multi-segment sequence over disjoint id ranges. Returns the
 1923 |     /// sequence, every hole id (in-span but absent), and the first id past
 1924 |     /// the end, for mask generation.
 1925 |     fn random_sequence(rng: &mut TestRng) -> (RowIdSequence, Vec<u64>, u64) {
 1926 |         let mut segments = Vec::new();
 1927 |         let mut holes = Vec::new();
 1928 |         let mut cursor = rng.below(1_000);
 1929 |         for _ in 0..(1 + rng.below(4)) {
 1930 |             match rng.below(5) {
 1931 |                 // Contiguous range.
 1932 |                 0 => {
 1933 |                     let span = 1 + rng.below(300);
 1934 |                     segments.push(U64Segment::Range(cursor..cursor + span));
 1935 |                     cursor += span;
 1936 |                 }
 1937 |                 // Bitmap with 10%-90% holes; first slot stays live so the
 1938 |                 // segment is never empty.
 1939 |                 1 | 2 => {
 1940 |                     let span = (50 + rng.below(1_950)) as usize;
 1941 |                     let hole_pct = 10 + rng.below(81);
 1942 |                     let present: Vec<bool> = (0..span)
 1943 |                         .map(|i| i == 0 || rng.next() % 100 >= hole_pct)
 1944 |                         .collect();
 1945 |                     for (i, live) in present.iter().enumerate() {
 1946 |                         if !live {
 1947 |                             holes.push(cursor + i as u64);
 1948 |                         }
 1949 |                     }
 1950 |                     segments.push(U64Segment::RangeWithBitmap {
 1951 |                         range: cursor..cursor + span as u64,
 1952 |                         bitmap: present.as_slice().into(),
 1953 |                     });
 1954 |                     cursor += span as u64;
 1955 |                 }
 1956 |                 // Range with a few holes.
 1957 |                 3 => {
 1958 |                     let span = 20 + rng.below(180);
 1959 |                     let mut hole_ids: Vec<u64> = (0..1 + rng.below(5).min(span - 1))
 1960 |                         .map(|_| cursor + rng.below(span))
 1961 |                         .collect();
 1962 |                     hole_ids.sort_unstable();
 1963 |                     hole_ids.dedup();
 1964 |                     if hole_ids.len() as u64 == span {
 1965 |                         hole_ids.pop();
 1966 |                     }
 1967 |                     holes.extend(hole_ids.clone());
 1968 |                     segments.push(U64Segment::RangeWithHoles {
 1969 |                         range: cursor..cursor + span,
 1970 |                         holes: hole_ids.into(),
 1971 |                     });
 1972 |                     cursor += span;
 1973 |                 }
 1974 |                 // Sorted or unsorted array of a few ids.
 1975 |                 _ => {
 1976 |                     let count = 1 + rng.below(8);
 1977 |                     let span = count * 3 + 1;
 1978 |                     let mut ids: Vec<u64> = (0..count).map(|_| cursor + rng.below(span)).collect();
 1979 |                     ids.sort_unstable();
 1980 |                     ids.dedup();
 1981 |                     if rng.below(2) == 0 {
 1982 |                         // Fisher-Yates shuffle for the unsorted encoding.
 1983 |                         for i in (1..ids.len()).rev() {
 1984 |                             ids.swap(i, rng.below(i as u64 + 1) as usize);
 1985 |                         }
 1986 |                         segments.push(U64Segment::Array(ids.into()));
 1987 |                     } else {
 1988 |                         segments.push(U64Segment::SortedArray(ids.into()));
 1989 |                     }
 1990 |                     cursor += span;
 1991 |                 }
 1992 |             }
 1993 |         }
 1994 |         (RowIdSequence(segments), holes, cursor)
 1995 |     }
 1996 | 
 1997 |     /// Random allow-list mixing live ids, hole ids, and ids outside every
 1998 |     /// segment.
 1999 |     fn random_allow_mask(
 2000 |         rng: &mut TestRng,
 2001 |         live: &[u64],
 2002 |         holes: &[u64],
 2003 |         past_end: u64,
 2004 |         count: usize,
 2005 |     ) -> RowAddrMask {
 2006 |         let mut ids = Vec::with_capacity(count);
 2007 |         for _ in 0..count {
 2008 |             match rng.below(10) {
 2009 |                 0..=5 => ids.push(live[rng.below(live.len() as u64) as usize]),
 2010 |                 6..=7 if !holes.is_empty() => {
 2011 |                     ids.push(holes[rng.below(holes.len() as u64) as usize])
 2012 |                 }
 2013 |                 8 if live[0] > 0 => ids.push(live[0] - 1 - rng.below(live[0].min(500))),
 2014 |                 _ => ids.push(past_end + rng.below(500)),
 2015 |             }
 2016 |         }
 2017 |         RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(ids.as_slice()))
 2018 |     }
 2019 | 
 2020 |     #[test]
 2021 |     fn test_mask_to_offset_ranges_matches_brute_force() {
 2022 |         for seed in 0..50u64 {
 2023 |             let mut rng = TestRng(seed);
 2024 |             let (sequence, holes, past_end) = random_sequence(&mut rng);
 2025 |             let live: Vec<u64> = sequence.iter().collect();
 2026 |             assert!(!live.is_empty(), "seed {seed} generated no live ids");
 2027 | 
 2028 |             let blocked: Vec<u64> = (0..30.min(live.len()))
 2029 |                 .map(|_| live[rng.below(live.len() as u64) as usize])
 2030 |                 .collect();
 2031 |             let mut masks = vec![
 2032 |                 RowAddrMask::allow_nothing(),
 2033 |                 RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(live.as_slice())),
 2034 |                 RowAddrMask::default(),
 2035 |                 RowAddrMask::from_block(RowAddrTreeMap::new()),
 2036 |                 RowAddrMask::from_block(RowAddrTreeMap::from_iter(blocked.as_slice())),
 2037 |             ];
 2038 |             for _ in 0..3 {
 2039 |                 let count = 1 + rng.below(20) as usize;
 2040 |                 masks.push(random_allow_mask(&mut rng, &live, &holes, past_end, count));
 2041 |             }
 2042 |             let medium = live.len().clamp(1, 1_000);
 2043 |             masks.push(random_allow_mask(&mut rng, &live, &holes, past_end, medium));
 2044 |             // Broader than the bitmap span: keeps the old range-based path.
 2045 |             let min_live = live.iter().min().copied().unwrap_or(0);
 2046 |             let cover = past_end.saturating_sub(min_live).max(1);
 2047 |             let mut broad: Vec<u64> = live.clone();
 2048 |             broad.extend(past_end..past_end + 2 * cover + 50);
 2049 |             masks.push(RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(
 2050 |                 broad.as_slice(),
 2051 |             )));
 2052 |             // Only missing ids: holes plus ids outside every segment.
 2053 |             if holes.is_empty() {
 2054 |                 let beyond: Vec<u64> = (0..50).map(|i| past_end + i).collect();
 2055 |                 masks.push(RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(
 2056 |                     beyond.as_slice(),
 2057 |                 )));
 2058 |             } else {
 2059 |                 masks.push(random_allow_mask(&mut rng, &holes, &holes, past_end, 50));
 2060 |             }
 2061 | 
 2062 |             for (i, mask) in masks.iter().enumerate() {
 2063 |                 assert_eq!(
 2064 |                     sequence.mask_to_offset_ranges(mask),
 2065 |                     oracle_mask_to_offset_ranges(&sequence, mask),
 2066 |                     "seed {seed} mask {i}"
 2067 |                 );
 2068 |             }
 2069 |         }
 2070 |     }
 2071 | 
 2072 |     #[test]
 2073 |     fn test_mask_to_offset_ranges_multiple_bitmap_segments() {
 2074 |         // Live ids and their offsets:
 2075 |         // seg0 Range(0..5):                0..5      -> offsets 0..5
 2076 |         // seg1 bitmap 100..110, holes
 2077 |         //   102, 107: 100,101,103,104,105,106,108,109 -> offsets 5..13
 2078 |         // seg2 bitmap 200..205, hole 200: 201,202,203,204 -> offsets 13..17
 2079 |         let bitmap_a: Vec<bool> = (0..10).map(|i| i != 2 && i != 7).collect();
 2080 |         let bitmap_b: Vec<bool> = (0..5).map(|i| i != 0).collect();
 2081 |         let sequence = RowIdSequence(vec![
 2082 |             U64Segment::Range(0..5),
 2083 |             U64Segment::RangeWithBitmap {
 2084 |                 range: 100..110,
 2085 |                 bitmap: bitmap_a.as_slice().into(),
 2086 |             },
 2087 |             U64Segment::RangeWithBitmap {
 2088 |                 range: 200..205,
 2089 |                 bitmap: bitmap_b.as_slice().into(),
 2090 |             },
 2091 |         ]);
 2092 |         // Hits in every segment plus hole ids (102, 107, 200) and ids
 2093 |         // outside every segment (50, 1_000).
 2094 |         let mask = RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(&[
 2095 |             0, 4, 100, 103, 109, 201, 204, 102, 107, 200, 50, 1_000,
 2096 |         ]));
 2097 |         let ranges = sequence.mask_to_offset_ranges(&mask);
 2098 |         // Offsets 0, 4, 5, 7, 12, 13, 16. Ranges stay split at the segment
 2099 |         // boundaries (4..5 vs 5..6, 12..13 vs 13..14), matching the old path.
 2100 |         assert_eq!(ranges, vec![0..1, 4..5, 5..6, 7..8, 12..13, 13..14, 16..17]);
 2101 |         assert_eq!(ranges, oracle_mask_to_offset_ranges(&sequence, &mask));
 2102 |         // A mask with no live ids selects nothing even across segments.
 2103 |         let missing = RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(&[102, 200, 50, 1_000]));
 2104 |         assert!(sequence.mask_to_offset_ranges(&missing).is_empty());
 2105 | 
 2106 |         // A selection broader than the bitmap span (17 live + 100 beyond
 2107 |         // every segment) keeps the old range-based path; results must match.
 2108 |         let mut broad: Vec<u64> = (0..5).collect();
 2109 |         broad.extend((100..110).filter(|id| *id != 102 && *id != 107));
 2110 |         broad.extend(201..205);
 2111 |         broad.extend(10_000..10_100);
 2112 |         let broad_mask = RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(broad.as_slice()));
 2113 |         assert_eq!(
 2114 |             sequence.mask_to_offset_ranges(&broad_mask),
 2115 |             oracle_mask_to_offset_ranges(&sequence, &broad_mask)
 2116 |         );
 2117 |     }
 2118 | 
 2119 |     #[test]
 2120 |     fn test_row_id_sequence_rechunk_with_empty_segments() {
 2121 |         // equal case (segment exactly fills remaining space)
 2122 |         let input_sequences = vec![
 2123 |             RowIdSequence::from(0..2),   // [0, 1] - 2 elements
 2124 |             RowIdSequence::from(20..23), // [20, 21, 22] - 3 elements
 2125 |         ];
 2126 |         let chunk_sizes = vec![2, 3]; // First chunk wants 2, second wants 3
 2127 | 
 2128 |         let result = rechunk_sequences(input_sequences, chunk_sizes, false).unwrap();
 2129 |         assert_eq!(result.len(), 2);
 2130 |         assert_eq!(result[0].len(), 2);
 2131 |         assert_eq!(result[1].len(), 3);
 2132 | 
 2133 |         let first_chunk: Vec<u64> = result[0].iter().collect();
 2134 |         let second_chunk: Vec<u64> = result[1].iter().collect();
 2135 |         assert_eq!(first_chunk, vec![0, 1]);
 2136 |         assert_eq!(second_chunk, vec![20, 21, 22]);
 2137 | 
 2138 |         // less case (segment smaller than remaining space)
 2139 |         let input_sequences = vec![
 2140 |             RowIdSequence::from(0..2),   // [0, 1] - 2 elements (less than remaining)
 2141 |             RowIdSequence::from(20..21), // [20] - 1 element (less than remaining)
 2142 |             RowIdSequence::from(30..32), // [30, 31] - 2 elements (exactly fills remaining)
 2143 |         ];
 2144 |         let chunk_sizes = vec![5]; // Request 5 elements, have exactly 5
 2145 | 
 2146 |         let result = rechunk_sequences(input_sequences, chunk_sizes, false).unwrap();
 2147 |         assert_eq!(result.len(), 1);
 2148 |         assert_eq!(result[0].len(), 5);
 2149 | 
 2150 |         let elements: Vec<u64> = result[0].iter().collect();
 2151 |         assert_eq!(elements, vec![0, 1, 20, 30, 31]);
 2152 | 
 2153 |         // empty segment in the middle
 2154 |         let input_sequences = vec![
 2155 |             RowIdSequence::from(0..2),   // [0, 1] - 2 elements
 2156 |             RowIdSequence::from(10..10), // [] - 0 elements (empty)
 2157 |             RowIdSequence::from(20..22), // [20, 21] - 2 elements
 2158 |         ];
 2159 |         let chunk_sizes = vec![3, 1];
 2160 |         let result = rechunk_sequences(input_sequences, chunk_sizes, false).unwrap();
 2161 | 
 2162 |         assert_eq!(result.len(), 2);
 2163 |         assert_eq!(result[0].len(), 3);
 2164 |         assert_eq!(result[1].len(), 1);
 2165 | 
 2166 |         let first_chunk_elements: Vec<u64> = result[0].iter().collect();
 2167 |         let second_chunk_elements: Vec<u64> = result[1].iter().collect();
 2168 |         assert_eq!(first_chunk_elements, vec![0, 1, 20]);
 2169 |         assert_eq!(second_chunk_elements, vec![21]);
 2170 | 
 2171 |         // multiple empty segments
 2172 |         let input_sequences = vec![
 2173 |             RowIdSequence::from(0..1),   // [0] - 1 element
 2174 |             RowIdSequence::from(10..10), // [] - 0 elements (empty)
 2175 |             RowIdSequence::from(20..20), // [] - 0 elements (empty)
 2176 |             RowIdSequence::from(30..32), // [30, 31] - 2 elements
 2177 |         ];
 2178 |         let chunk_sizes = vec![3];
 2179 |         let result = rechunk_sequences(input_sequences, chunk_sizes, false).unwrap();
 2180 | 
 2181 |         assert_eq!(result.len(), 1);
 2182 |         assert_eq!(result[0].len(), 3);
 2183 | 
 2184 |         let elements: Vec<u64> = result[0].iter().collect();
 2185 |         assert_eq!(elements, vec![0, 30, 31]);
 2186 | 
 2187 |         // empty segment at chunk boundary
 2188 |         let input_sequences = vec![
 2189 |             RowIdSequence::from(0..3), // [0, 1, 2] - 3 elements (exactly fills first chunk)
 2190 |             RowIdSequence::from(10..10), // [] - 0 elements (empty, at boundary)
 2191 |             RowIdSequence::from(20..22), // [20, 21] - 2 elements (for second chunk)
 2192 |         ];
 2193 |         let chunk_sizes = vec![3, 2];
 2194 |         let result = rechunk_sequences(input_sequences, chunk_sizes, false).unwrap();
 2195 | 
 2196 |         assert_eq!(result.len(), 2);
 2197 |         assert_eq!(result[0].len(), 3);
 2198 |         assert_eq!(result[1].len(), 2);
 2199 | 
 2200 |         let first_chunk_elements: Vec<u64> = result[0].iter().collect();
 2201 |         let second_chunk_elements: Vec<u64> = result[1].iter().collect();
 2202 |         assert_eq!(first_chunk_elements, vec![0, 1, 2]);
 2203 |         assert_eq!(second_chunk_elements, vec![20, 21]);
 2204 | 
 2205 |         // empty segments with allow_incomplete = true
 2206 |         let input_sequences = vec![
 2207 |             RowIdSequence::from(0..2),   // [0, 1] - 2 elements
 2208 |             RowIdSequence::from(10..10), // [] - 0 elements (empty)
 2209 |         ];
 2210 |         let chunk_sizes = vec![5]; // Request more than available
 2211 |         let result = rechunk_sequences(input_sequences, chunk_sizes, true).unwrap();
 2212 | 
 2213 |         assert_eq!(result.len(), 1);
 2214 |         assert_eq!(result[0].len(), 2);
 2215 | 
 2216 |         let elements: Vec<u64> = result[0].iter().collect();
 2217 |         assert_eq!(elements, vec![0, 1]);
 2218 |     }
 2219 | 
 2220 |     #[test]
 2221 |     fn test_row_id_range_empty() {
 2222 |         let seq = RowIdSequence::from(0u64..0);
 2223 |         assert_eq!(seq.row_id_range(), None);
 2224 |     }
 2225 | 
 2226 |     #[test]
 2227 |     fn test_row_id_range_single_contiguous() {
 2228 |         let seq = RowIdSequence::from(10u64..20);
 2229 |         assert_eq!(seq.row_id_range(), Some(10..=19));
 2230 |     }
 2231 | 
 2232 |     #[test]
 2233 |     fn test_row_id_range_unsorted_array() {
 2234 |         // Array variant: range() returns min..=max as bounding box
 2235 |         let seq = RowIdSequence::from([50u64, 10, 30].as_slice());
 2236 |         let r = seq.row_id_range().unwrap();
 2237 |         assert!(*r.start() <= 10);
 2238 |         assert!(*r.end() >= 50);
 2239 |     }
 2240 | 
 2241 |     #[test]
 2242 |     fn test_row_id_range_multi_segment() {
 2243 |         // Two disjoint ranges; bounding box should span both
 2244 |         let mut seq = RowIdSequence::from(0u64..5);
 2245 |         seq.extend(RowIdSequence::from(100u64..105));
 2246 |         let r = seq.row_id_range().unwrap();
 2247 |         assert_eq!(*r.start(), 0);
 2248 |         assert_eq!(*r.end(), 104);
 2249 |     }
 2250 | 
 2251 |     #[test]
 2252 |     fn test_range_segments_sequence_matches_bitmap_sequence() {
 2253 |         let live: Vec<u64> = (0..600u64)
 2254 |             .filter(|v| !(50..250).contains(v) && !(300..310).contains(v))
 2255 |             .collect();
 2256 |         let bitmap_sequence = RowIdSequence::from(live.as_slice());
 2257 |         assert!(matches!(
 2258 |             bitmap_sequence.0.as_slice(),
 2259 |             [U64Segment::RangeWithBitmap { .. }]
 2260 |         ));
 2261 |         let mut runs_sequence = bitmap_sequence.clone();
 2262 |         assert!(runs_sequence.use_range_segments());
 2263 |         assert!(matches!(
 2264 |             runs_sequence.0.as_slice(),
 2265 |             [U64Segment::Ranges { .. }]
 2266 |         ));
 2267 |         // Idempotent: a second pass has nothing left to convert.
 2268 |         let again = runs_sequence.clone();
 2269 |         assert!(!runs_sequence.use_range_segments());
 2270 |         assert_eq!(runs_sequence, again);
 2271 | 
 2272 |         assert_eq!(runs_sequence.iter().collect::<Vec<_>>(), live);
 2273 |         assert_eq!(runs_sequence.len(), bitmap_sequence.len());
 2274 |         let mut cursor = runs_sequence.cursor();
 2275 |         let mut chunked = Vec::new();
 2276 |         for start in (0..live.len()).step_by(37) {
 2277 |             let end = (start + 37).min(live.len());
 2278 |             chunked.extend(runs_sequence.select_range_with_cursor(&mut cursor, start..end));
 2279 |         }
 2280 |         assert_eq!(chunked, live);
 2281 |         let picks = [0usize, 5, 49, 50, 300];
 2282 |         assert_eq!(
 2283 |             runs_sequence
 2284 |                 .select(picks.iter().copied())
 2285 |                 .collect::<Vec<_>>(),
 2286 |             bitmap_sequence
 2287 |                 .select(picks.iter().copied())
 2288 |                 .collect::<Vec<_>>()
 2289 |         );
 2290 | 
 2291 |         for mask in [
 2292 |             RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(&[0, 49, 50, 100, 250, 251, 599])),
 2293 |             RowAddrMask::from_block(RowAddrTreeMap::from_iter(&[0, 250, 305, 599])),
 2294 |         ] {
 2295 |             assert_eq!(
 2296 |                 runs_sequence.mask_to_offset_ranges(&mask),
 2297 |                 bitmap_sequence.mask_to_offset_ranges(&mask)
 2298 |             );
 2299 |         }
 2300 |         assert_eq!(
 2301 |             RowAddrTreeMap::from(&runs_sequence),
 2302 |             RowAddrTreeMap::from(&bitmap_sequence)
 2303 |         );
 2304 |         assert_eq!(
 2305 |             read_row_ids(write_row_ids(&runs_sequence).as_slice()).unwrap(),
 2306 |             runs_sequence
 2307 |         );
 2308 |     }
 2309 | }
``````
