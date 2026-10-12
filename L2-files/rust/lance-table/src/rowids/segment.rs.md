> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-table/src/rowids/segment.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `c3326525cf7b71f8035d00bba01ad1b681eeca9dd81f83531de4182d6928e621`. Reviewed physical lines: 1-1624.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public row-ID segment representations, selection/cost policy, positional operations, append/delete/mask and bitmap scan cursors. (rust/lance-table/src/rowids/segment.rs:1-1624)

## Complete range analysis

### Lines 1-15

SPDX/imports Range/RangeInclusive, sibling Bitmap/EncodedU64Array/HoleRuns and DeepSizeOf. Private inline u128_byte_cost_to_usize uses checked conversion with usize::MAX fallback for infeasible estimated costs. This saturates a cost, not an input row value or validated length. (rust/lance-table/src/rowids/segment.rs:1-15)

### Lines 16-39

Type docs assume distinct u64s and describe sorted/contiguous/dense/sparse selection with approximate storage formulas. These are estimates and rationale, not actual serialized lengths, heap bounds or enforced uniqueness. Runtime cost formulas below use inclusive total_slots and fixed assumed offset widths; no benchmark is supplied here. (rust/lance-table/src/rowids/segment.rs:16-39)

### Lines 40-63

Public U64Segment derives Debug/equality/Clone and exposes Range half-open u64 bounds, RangeWithHoles with EncodedU64Array, and RangeWithBitmap. Hole payload is a sorted array of absolute missing values despite comment calling it a bitmap of offsets; membership code compares values directly (rust/lance-table/src/rowids/segment.rs:398-410). Bitmap set means present. Size/threshold comments are heuristic and not authoritative selection conditions. Public segment module route is rust/lance-table/src/rowids.rs:17-24; field types from private modules can still be observed through public variants. (rust/lance-table/src/rowids/segment.rs:40-63)

### Lines 64-83

Ranges stores enclosing Range plus HoleRuns; SortedArray and Array store encoded arrays. Ranges doc describes compact in-memory grouping and repeated plain wire Range representation; serde implements flattening only at sequence level (rust/lance-table/src/rowids/serde.rs:232-299). Comment says opted-in tables and fewer than one range/128 slots, but no table/config argument exists here. from_slice never selects Ranges; actual admission through as_ranges uses a strict byte estimate. The heap-enum and wire-byte statements are comment-level motivation, not allocation measurements. (rust/lance-table/src/rowids/segment.rs:64-83)

### Lines 84-96

DeepSizeOf children returns0 for Range and delegates to owned holes/bitmap/runs/array for all other arms using shared Context. It omits inline enum size because the trait outer method accounts for it, and does not compute serialized protobuf size. (rust/lance-table/src/rowids/segment.rs:84-96)

### Lines 97-125

Private Debug SegmentStats stores min/max/count u64 and sorted bool. n_holes debug-asserts sorted, returns0 for count0, otherwise computes (max-min+1)-count in u128 so the full u64 domain has representable slot count. It assumes count<=slots and min<=max; duplicate-derived count can underflow despite u128. No Result or duplicate validation. (rust/lance-table/src/rowids/segment.rs:97-125)

### Lines 126-143

Private holes_in_slice returns lazy inclusive-range filter with one peekable existing iterator. A matching next existing value is consumed and excluded; every other range value is yielded as missing. Correctness assumes existing values appear in increasing order without duplicates and within the range. A stale unmatched peek can cause later existing values to be reported as holes. Iteration work visits all numeric slots, not just holes. (rust/lance-table/src/rowids/segment.rs:126-143)

### Lines 144-175

compute_stats scans all values, updates min/max and count, then marks sorted=false if a later value is below running maximum. Equal adjacent values remain sorted; this detects nondecreasing order, not strict uniqueness. Empty stats are min0/max0/count0/sortedtrue. Ordinary u64 count increment has no overflow error. (rust/lance-table/src/rowids/segment.rs:144-175)

### Lines 176-195

sorted_sequence_sizes returns [holes,bitmap,array] estimates using u128:24+4*n_holes,24+ceil(total_slots/8),24+2*count, each saturating and then converting to usize with MAX fallback. Assumed four-byte holes and two-byte array entries need not match selected EncodedU64Array width/base or actual protobuf tags/lengths. Return order matters for ties. This function expects valid sorted stats. (rust/lance-table/src/rowids/segment.rs:176-195)

### Lines 196-219

from_stats_and_sequence for sorted stats computes holes and checked max+1 exclusive end. Empty yields Range0..0; zero holes with representable end yields Range(min..end) without consuming the supplied sequence. Otherwise choose minimum estimated size; ties favor holes first. Hole path scans all slots, collects/sorts missing absolute values and compresses them through EncodedU64Array. Distinctness is only a precondition: sorted[0,0,2] has slots3/count3 and becomes Range0..3, replacing the duplicate with1. This counterexample is source-derived, not executed. (rust/lance-table/src/rowids/segment.rs:196-219)

### Lines 220-240

Bitmap wins when its estimate equals remaining minimum: allocate full bitmap for max-min+1 (unchecked usize cast/add), enumerate every missing value and clear relative bit. Otherwise create SortedArray from sequence. If max==u64MAX, all range-backed forms are excluded and SortedArray used; unsorted stats choose Array regardless of extrema/count. Costs do not add an allocation budget or checked32-bit span guard here. (rust/lance-table/src/rowids/segment.rs:220-240)

### Lines 241-267

from_slice delegates to FromIterator and therefore copies input values before selection. from_sorted_ranges requires at least two inputs through slice pattern, computes last.end-first.start then checked u32 span conversion, builds gap starts/ends with unchecked subtractions/casts and calls HoleRuns::try_new(...).ok(). Invalid holes become None, but malformed interval order/bounds can panic or truncate before validation; it does not independently check every input range is nonempty/forward. Valid sorted separated ranges produce Ranges even when a byte-cost comparison would not favor it. (rust/lance-table/src/rowids/segment.rs:241-267)

### Lines 268-292

as_ranges handles only RangeWithBitmap; bitmap.len>u32MAX returns None. It first builds HoleRuns from the entire bitmap, then accepts only (num_missing_runs+1)*16 < bitmap.bytes().len. This compares estimated plain-range bytes to bitmap payload bytes, not equal full-wire overhead, and can overcount present ranges at missing endpoints. It clones bounds, does not validate range span against bitmap length, and supplies no feature opt-in check. All other variants return None; even a rejected bitmap conversion paid temporary HoleRuns construction. (rust/lance-table/src/rowids/segment.rs:268-292)

### Lines 293-300

FromIterator materializes all u64 values into Vec, scans stats over a copied iterator, then moves Vec into selection. This is not a streaming compression interface; compressed array paths can allocate additional backing. A selected contiguous Range drops the collected Vec without using sequence contents again. (rust/lance-table/src/rowids/segment.rs:293-300)

### Lines 301-329

iter returns a boxed DoubleEndedIterator. Range clones its bounds; holes scan every value with binary_search per slot; bitmap scans every value with get at relative offset; Ranges flat_maps HoleRuns present gaps with base-adjusted half-open ranges; arrays wrap their already boxed iterators in another Box. Range-backed iteration uses ordinary base/offset arithmetic. Costs for holes/bitmap scale with numeric span, not only present count; Ranges skips holes as intervals. (rust/lance-table/src/rowids/segment.rs:301-329)

### Lines 330-345

len returns range.end-start as usize, subtracting hole count or bitmap.count_zeros for holes/bitmap; Ranges returns runs.present_len, arrays own len. Thus holes count is O(1), bitmap count scans bytes, other counts constant. Range subtraction/casts and missing-count subtraction are unchecked. Inconsistent public bounds/backing can make len disagree with iteration or underflow; this is not an invariant validator. (rust/lance-table/src/rowids/segment.rs:330-345)

### Lines 346-359

pub(crate) use_dense_range_expansion only accepts bitmap segments and compares caller-supplied segment_len against bitmap.len - floor(bitmap.len/4), using saturating_sub. This is ceil(3*logical_len/4) without multiplication overflow. It trusts segment_len rather than recomputing popcount; other variants false. is_empty delegates len==0 and inherits its arithmetic/precondition behavior. (rust/lance-table/src/rowids/segment.rs:346-359)

### Lines 360-377

range returns stored start..=end-1 whenever the enclosing Range is nonempty for Range/holes/bitmap/Ranges. It does not inspect presence bits/holes; despite doc saying excludes tombstones and no extrema for empty segments, an all-zero bitmap on0..8 has len0 but rangeSome0..=7. SortedArray uses first/last, general Array min/max (noncanonical compressed min caveat applies). Reversed/zero stored bounds return None. Counterexample is source-derived, unexecuted. (rust/lance-table/src/rowids/segment.rs:360-377)

### Lines 378-388

slice with requested len0 returns canonical Range0..0 without checking offset. Otherwise collects iter.skip(offset).take(len) then from_slice, allocating selected Vec plus the constructor copy before re-encoding. Excess length silently truncates; offset past end yields empty; no bounds Result. It retains numeric values rather than rebasing positions, and never emits Ranges because from_slice does not. (rust/lance-table/src/rowids/segment.rs:378-388)

### Lines 389-432

position maps value to present ordinal: Range containment then subtraction; holes containment then binary search (found means absent; insertion index counts earlier holes); Ranges containment then runs.position on relative u32 cast; bitmap containment/get then counts zeros before offset and subtracts; sorted array binary search, general array first linear match. No validation of sortedness, uniqueness, bitmap shape or u32 fit for direct malformed variants. Bitmap rank scans prefix bytes; holes/Ranges use logarithmic lookup. (rust/lance-table/src/rowids/segment.rs:389-432)

### Lines 433-461

get Range uses checked start+i then end guard, returning None on overflow/bounds. Holes first computes unchecked length and bounds-checks i, then binary-searches smallest k with holes[k].saturating_sub(k)>start+i, returning start+i+k. Assumes unique sorted bounded holes; ordinary final arithmetic and usize/u64 casts are not checked, but valid invariants make ordinal select correct. This avoids scanning every numeric slot. (rust/lance-table/src/rowids/segment.rs:433-461)

### Lines 462-479

Bitmap get creates a fresh cursor then selects index, so separate get calls do not retain progress. Ranges checked-converts i to u32, asks runs.offset_at and adds range base; arrays delegate get. cursor returns public borrowing SegmentCursor with default byte state, binding that wrapper to one immutable segment. (rust/lance-table/src/rowids/segment.rs:462-479)

### Lines 480-506

contains uses bounds for Range; holes checks bounds then linearly searches decoded hole values (unlike logarithmic position); bitmap checks bounds then bit; Ranges uses bounds plus runs.position; SortedArray binary search; Array linear any. It performs no IO/allocation of result collections but array iterators are boxed. Invalid direct backing follows delegated panic/arithmetic behavior. (rust/lance-table/src/rowids/segment.rs:480-506)

### Lines 507-519

with_new_high consumes self and returns Result. It obtains range() and rejects val<=reported end with InvalidInput text giving new/current values. Empty reported range skips guard. For range-backed missing endpoints, reported stored end can exceed actual greatest present value and reject an otherwise greater present value. Error consumes ownership; it does not return the original segment. (rust/lance-table/src/rowids/segment.rs:507-519)

### Lines 520-563

Append to Range handles empty, adjacent and gapped values. Gaps allocate U64 holes across old end..val; holes variant retains storage for adjacent append, otherwise decodes all old holes and appends every gap into plain U64. Every range-backed branch uses unchecked val+1, so appending u64MAX can overflow despite Result and despite safe max handling in constructors. No cost reselection for these two variants. (rust/lance-table/src/rowids/segment.rs:520-563)

### Lines 564-588

Bitmap append builds new end=val+1, computes unchecked gap usize, collects old logical bools plus false gap plus true into Vec<bool>, then copies into Bitmap; memory scales with expanded span. Ranges append expands all current values into Vec, pushes val and from_slice copies/reselects, dropping compact-Ranges representation until a caller optimizes again. Commit re-encoding in comment is not a traced caller guarantee here. (rust/lance-table/src/rowids/segment.rs:564-588)

### Lines 589-628

SortedArray append keeps U64 backing with push. U16 retains base/width when checked delta fits, widens all offsets to U32 if it fits there, otherwise decodes all old values and recompresses with EncodedU64Array::from. U32 retains if delta fits, else decode/recompress. On normal valid nonempty sorted input the higher-value guard implies no base decrease, but empty/direct malformed state can enter fallback. It keeps SortedArray variant rather than reselecting dense segment representation. (rust/lance-table/src/rowids/segment.rs:589-628)

### Lines 629-669

Array append mirrors U64 push, U16 keep/widen/fallback and U32 keep/fallback, preserving Array even if values become sorted. It adds only a value greater than reported maximum, never arbitrary insertion. Delta checks avoid subtraction overflow, while decoding existing malformed offsets still uses ordinary addition. Every retained/widened path returns Ok early; outer match wraps other successful paths in Ok. (rust/lance-table/src/rowids/segment.rs:629-669)

### Lines 670-693

delete borrows self and expects supplied values to exist and follow appearance order. Debug assertion checks only range().unwrap().contains for each requested value, not actual presence or order, and may panic for nonempty deletion from empty segment. A peekable requested-value filter removes a value only when it equals the current front request; missing/duplicate/out-of-order requests can block later removals. It scans once to compute surviving stats and again to reconstruct representation, with no Result or runtime validation in release. Empty request still rebuilds/reselects. (rust/lance-table/src/rowids/segment.rs:670-693)

### Lines 694-710

mask mutates self using u32 positions. Empty list returns immediately. If positions.len()==self.len(), it replaces with empty Range regardless of position values; e.g.Range0..2 masked by[0,0] clears both. Larger list can underflow count. It infers sortedness from variant and trusts positions are valid/unique/ordered without checking. Counterexample is source-only, not executed. (rust/lance-table/src/rowids/segment.rs:694-710)

### Lines 711-734

mask finds first/last presumed unmasked ordinal by zipping forward/reverse ordinal ranges with cycling position lists, then unwraps get for extrema and constructs stats with old length minus requested count. This assumes an ascending distinct in-bounds mask. For Array the first/last surviving numeric values are not necessarily min/max, but sorted=false makes reconstruction ignore these stats. Ordinary casts can truncate huge ordinals. (rust/lance-table/src/rowids/segment.rs:711-734)

### Lines 735-748

mask enumerates current values and advances a single peekable positions iterator only on exact ordinal equality, retaining all others. It assigns reconstructed segment only after construction finishes. Wrong masks can produce inconsistent stats versus filtered sequence, wrong reconstruction or panic; there is no partial in-place per-bit mutation/rollback API. Successful mask reselects one of five constructor forms and never Ranges. (rust/lance-table/src/rowids/segment.rs:735-748)

### Lines 749-769

Public SegmentCursor borrows a U64Segment and owns private SegmentCursorState. Crate-visible Debug/Default state has private byte_idx and ones_before, counting set bits in preceding bytes; default zero. Public cursor.get simply delegates state.get with its bound segment. State itself accepts arbitrary segments on calls, with no identity/lifetime binding or automatic reset between sources. (rust/lance-table/src/rowids/segment.rs:749-769)

### Lines 770-803

Crate-visible state.extend_range appends to caller Vec. Non-bitmap Range clips selection.end to segment length and extends base-adjusted interval if start<end; Ranges clamps both ordinals to u32MAX and delegates runs.extend_values; other variants loop every requested ordinal and filter_map get, omitting out-of-bounds entries. Non-bitmap calls leave bitmap scan state untouched. Empty/reversed selections append nothing on valid state; no Result or reserve. (rust/lance-table/src/rowids/segment.rs:770-803)

### Lines 804-839

Bitmap extend_range rewinds only when selection.start<ones_before, then scans bytes. Skip bytes whose cumulative set-bit count is<=selection.start. Within selected byte repeatedly extract trailing set bit in LSB order, append base+byte*8+bit for ranks in selection and clear lowest bit. A return inside a byte leaves state at that byte start; completing a byte updates both counters. Requests past end emit only available values, with no error. Empty/reversed selections may still advance scan state before emitting nothing. Logical length/range end are not checked; valid zero padding is assumed. (rust/lance-table/src/rowids/segment.rs:804-839)

### Lines 840-856

extend_dense_range delegates nonbitmap segments to ordinary extension. Bitmap rewinds by same ones_before condition then calls private dense helper with range.start and entire byte slice. No density check occurs in this method; use_dense_range_expansion is a separate caller advisory. (rust/lance-table/src/rowids/segment.rs:840-856)

### Lines 857-902

Dense helper skips by popcount. If selection includes every set bit of a byte and popcount>=6, full0xff byte appends one interval of eight values; otherwise it skips zero runs and appends consecutive one-bit intervals. Nonfull branch cannot have eight trailing ones, avoiding shift-by8; full-byte branch handles that case. It updates state after complete byte and stops when reaching requested end. Ordinary base+offset/exclusive-end arithmetic remains unchecked. (rust/lance-table/src/rowids/segment.rs:857-902)

### Lines 903-924

Dense helper fallback handles partial selected bytes or fewer than six set bits with the same trailing-zero/per-set-bit rank loop as ordinary extension. Early return preserves byte-start state; full completion advances counters. It visits bytes and emitted values, but no runtime performance measurement proves the threshold optimal. Malformed nonzero padding can be emitted beyond logical range. (rust/lance-table/src/rowids/segment.rs:903-924)

### Lines 925-956

State.get delegates nonbitmap to segment.get. Bitmap rewinds if i<ones_before, computes remaining rank and scans byte popcounts; in target byte clear remaining lowest set bits and return base+byte*8+trailing_zeros. It retains target byte state so repeated/reversed indices within it need no reset. Exhaustion advances to byte end and returns None; a later smaller request resets as needed. No bitmap.len/range.end guard: it relies on deserializer zero-padding contract, while direct fields are mutable. (rust/lance-table/src/rowids/segment.rs:925-956)

### Lines 957-975

cfg(test) module plus public-mutability fixture pattern-matches bitmap arm, overwrites raw byte with0b10100101 and asserts stored length8/popcount4. This tests mutability and immediate popcount, not malformed padding/shape or cursor invalidation. (rust/lance-table/src/rowids/segment.rs:957-975)

### Lines 976-1011

Dense-extension fixture uses24 bits, clears10/17/22 and asserts density advisory true, while three separated bits give false. It compares sequential selections0..8,8..15,15..21 and partial9..20 against ordinary iterator values. No timing or rewind/source-reuse behavior is asserted. (rust/lance-table/src/rowids/segment.rs:976-1011)

### Lines 1012-1067

Nested check_segment helper asserts exact selected representation, count, full iteration, numeric extrema and get/position inverses for every supplied value. Nested check_segment_iter compares forward/reverse and alternating next/next_back against get. It does not test duplicate inputs or iterator exhaustion guarantees. (rust/lance-table/src/rowids/segment.rs:1012-1067)

### Lines 1068-1112

Selection fixtures cover empty Range, singleton42, contiguous100..200, one missing100 from0..1000 as holes, alternating even values as bitmap0..999, sparse sorted[1,7000,24000] and unsorted[7000,1,24000] as array forms. Exact representation assertions pin current heuristic choices. (rust/lance-table/src/rowids/segment.rs:1068-1112)

### Lines 1113-1136

Empty range fixture includes Range5..5, zero-span holes/bitmap and empty sorted/general arrays, requiring rangeNone. It omits Ranges and nonzero enclosing ranges with no present values, so it does not establish the broad comment for every empty segment shape. (rust/lance-table/src/rowids/segment.rs:1113-1136)

### Lines 1137-1195

Overflow-boundary fixture asserts SortedArray for sparse span to i64MAX, [0,u64MAX], dense values ending u64MAX and singletonu64MAX, with lengths/value roundtrips. Three contiguous values ending u64MAX-1 must remain Range ending u64MAX. This covers constructor exclusive-end safety, not append-to-u64MAX. (rust/lance-table/src/rowids/segment.rs:1137-1195)

### Lines 1196-1221

Further constructor regressions retain RangeWithHoles for one missing500 in100..1100 and bitmap for five values with one gap100..105. Exact/value assertions protect cost selection while u128 overflow handling changes. (rust/lance-table/src/rowids/segment.rs:1196-1221)

### Lines 1222-1242

Hole-length fixture uses50,000 holes at3*i+1 over150,000 slots and a wide-base ten-slot range with two holes, comparing len against count and iterator. Comment says every encoding width, but first input selects U32 offsets and wide-base pair selects U16; there is no forced plain-U64 hole representation in this test. It is correctness evidence, not a measured time bound. (rust/lance-table/src/rowids/segment.rs:1222-1242)

### Lines 1243-1280

Cost tests require helper map0/42/usizeMAX exactly and u128MAX to usizeMAX, sparse-hole estimate saturation, and huge array estimate saturation. Synthetic stats avoid allocating those spans. Tests assert sizes, not actual serialized lengths or allocations. (rust/lance-table/src/rowids/segment.rs:1243-1280)

### Lines 1281-1295

Full-span synthetic bitmap-cost fixture compares bitmap estimate with saturated holes and requires bitmap cost<usizeMAX. Its comment explicitly assumes64-bit; no target-width cfg guards the test. On32-bit that estimate would saturate too, so this assertion is not portable as written; source deduction only, no32-bit execution. (rust/lance-table/src/rowids/segment.rs:1281-1295)

### Lines 1296-1340

with_new_high test starts Range10..20, appends adjacent20 or gap25, and checks exact Range/U64-hole forms; repeats existing holes15/17 with adjacent/gapped append. It pins lack of re-compression on holes append. (rust/lance-table/src/rowids/segment.rs:1296-1340)

### Lines 1341-1385

Bitmap append tests range10..20 with missing13/17, adjacent20 and gap25; constructs expected bitmaps length11/16 and verifies full structural equality including added gap bits. (rust/lance-table/src/rowids/segment.rs:1341-1385)

### Lines 1386-1421

Append fixtures for plain-U64 SortedArray/Array verify push15, empty Range appends5, and singleton42 appends50 with explicit holes43..49. No compressed widening, standalone Ranges max boundary or u64MAX append case is tested here. (rust/lance-table/src/rowids/segment.rs:1386-1421)

### Lines 1422-1449

Two append rejection fixtures pass value below/equal current max and assert is_err plus exact diagnostic substring. They do not assert Error::InvalidInput variant, although implementation selects it. (rust/lance-table/src/rowids/segment.rs:1422-1449)

### Lines 1450-1501

Membership tests cover Range boundaries, holes15/17, bitmap-cleared13/17 and out-of-range20, with explicit positive/negative assertions. These use plainU64 holes and valid padding. (rust/lance-table/src/rowids/segment.rs:1450-1501)

### Lines 1502-1531

Membership fixtures test sparse SortedArray/general Array and empty Range, asserting absent gaps/extremes. No malformed direct storage or noncanonical relative base is covered. (rust/lance-table/src/rowids/segment.rs:1502-1531)

### Lines 1532-1564

clustered_values returns1000..2000 excluding1100..1300,1500..1650 and1999. Semantic comparison constructs bitmap then as_ranges, asserts two missing runs, same length/range/forward/reverse values and all position/get/contains inverses. Highest present is1998, so constructed bounding span is999, not1000. (rust/lance-table/src/rowids/segment.rs:1532-1564)

### Lines 1565-1602

Ranges comparison checks selected missing/outside IDs and out-of-bounds get, slice95..115, deletes[1000,1050,1400] and mask[0,1,7] compared to bitmap path. Cursor extension tests90..110 then300..len+10 truncation and get400; append2500 checks last value/count. Delete/mask comparisons share implementation paths rather than independent expected survivors; no malformed inputs or cursor rewind assertions. (rust/lance-table/src/rowids/segment.rs:1565-1602)

### Lines 1603-1624

as_ranges rejects alternating bitmap, plain Range, SortedArray and holes form. No local direct from_sorted_ranges invalid-input test, duplicate-constructor test, arbitrary mask validation, empty-presence bounding range or same-state source-switch regression appears. These tests were fully read, not run. (rust/lance-table/src/rowids/segment.rs:1603-1624)

## Interaction and interpretation limits

All1,624 physical lines read in bounded numbered chunks. Public U64Segment/SegmentCursor versus pub(crate) SegmentCursorState are distinguished. Array/bitmap/HoleRuns/serde/version helpers are already analyzed; full local RowIdSequence cursor/reset behavior is covered at rust/lance-table/src/rowids.rs:54-170 and rust/lance-table/src/rowids.rs:538-592; its conversion has no opt-in gate, while full dataset/transaction consumers remain pending. Caller references from searches are lexical evidence, not a completed resolved call graph. No source edits, network, build/test/benchmark execution or measured performance claims.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::ops::{Range, RangeInclusive};
    5 | 
    6 | use super::{bitmap::Bitmap, encoded_array::EncodedU64Array, runs::HoleRuns};
    7 | use lance_core::deepsize::DeepSizeOf;
    8 | 
    9 | /// Convert an estimated serialized byte cost from `u128` to `usize`, saturating
   10 | /// at [`usize::MAX`] when the value does not fit (infeasible encodings).
   11 | #[inline]
   12 | fn u128_byte_cost_to_usize(v: u128) -> usize {
   13 |     usize::try_from(v).unwrap_or(usize::MAX)
   14 | }
   15 | 
   16 | /// Different ways to represent a sequence of distinct u64s.
   17 | ///
   18 | /// This is designed to be especially efficient for sequences that are sorted,
   19 | /// but not meaningfully larger than a `Vec<u64>` in the worst case.
   20 | ///
   21 | /// The representation is chosen based on the properties of the sequence:
   22 | ///                                                           
   23 | ///  Sorted?───►Yes ───►Contiguous?─► Yes─► Range            
   24 | ///    │                ▼                                 
   25 | ///    │                No                                
   26 | ///    │                ▼                                 
   27 | ///    │              Dense?─────► Yes─► RangeWithBitmap/RangeWithHoles
   28 | ///    │                ▼                                 
   29 | ///    │                No─────────────► SortedArray      
   30 | ///    ▼                                                    
   31 | ///    No──────────────────────────────► Array            
   32 | ///
   33 | /// "Dense" is decided based on the estimated byte size of the representation.
   34 | ///
   35 | /// Size of RangeWithBitMap for N values:
   36 | ///     8 bytes + 8 bytes + ceil((max - min) / 8) bytes
   37 | /// Size of SortedArray for N values (assuming u16 packed):
   38 | ///     8 bytes + 8 bytes + 8 bytes + 2 bytes * N
   39 | ///
   40 | #[derive(Debug, PartialEq, Eq, Clone)]
   41 | pub enum U64Segment {
   42 |     /// A contiguous sorted range of row ids.
   43 |     ///
   44 |     /// Total size: 16 bytes
   45 |     Range(Range<u64>),
   46 |     /// A sorted range of row ids, that is mostly contiguous.
   47 |     ///
   48 |     /// Total size: 24 bytes + n_holes * 4 bytes
   49 |     /// Use when: 32 * n_holes < max - min
   50 |     RangeWithHoles {
   51 |         range: Range<u64>,
   52 |         /// Bitmap of offsets from the start of the range that are holes.
   53 |         /// This is sorted, so binary search can be used. It's typically
   54 |         /// relatively small.
   55 |         holes: EncodedU64Array,
   56 |     },
   57 |     /// A sorted range of row ids, that is mostly contiguous.
   58 |     ///
   59 |     /// Bitmap is 1 when the value is present, 0 when it's missing.
   60 |     ///
   61 |     /// Total size: 24 bytes + ceil((max - min) / 8) bytes
   62 |     /// Use when: max - min > 16 * len
   63 |     RangeWithBitmap { range: Range<u64>, bitmap: Bitmap },
   64 |     /// Two or more sorted, disjoint ranges of row ids, held compactly.
   65 |     ///
   66 |     /// This is how a run of consecutive `Range` segments is kept in memory:
   67 |     /// on the wire it is exactly those `Range` segments, so it needs no format
   68 |     /// support (see `read_row_ids` in `serde`). In memory it is two
   69 |     /// `u32` per range plus prefix sums, and lookups are a binary search,
   70 |     /// where separate segments would cost a heap enum each and linear scans.
   71 |     ///
   72 |     /// Total size on the wire: ~16 bytes per range.
   73 |     /// Use when: fewer than one range per 128 slots, and only for tables that
   74 |     /// opted in (see [`Self::as_ranges`]); `from_slice` never picks it.
   75 |     Ranges { range: Range<u64>, runs: HoleRuns },
   76 |     /// A sorted array of row ids, that is sparse.
   77 |     ///
   78 |     /// Total size: 24 bytes + 2 * n_values bytes
   79 |     SortedArray(EncodedU64Array),
   80 |     /// An array of row ids, that is not sorted.
   81 |     Array(EncodedU64Array),
   82 | }
   83 | 
   84 | impl DeepSizeOf for U64Segment {
   85 |     fn deep_size_of_children(&self, context: &mut lance_core::deepsize::Context) -> usize {
   86 |         match self {
   87 |             Self::Range(_) => 0,
   88 |             Self::RangeWithHoles { holes, .. } => holes.deep_size_of_children(context),
   89 |             Self::RangeWithBitmap { bitmap, .. } => bitmap.deep_size_of_children(context),
   90 |             Self::Ranges { runs, .. } => runs.deep_size_of_children(context),
   91 |             Self::SortedArray(array) => array.deep_size_of_children(context),
   92 |             Self::Array(array) => array.deep_size_of_children(context),
   93 |         }
   94 |     }
   95 | }
   96 | 
   97 | /// Statistics about a segment of u64s.
   98 | #[derive(Debug)]
   99 | struct SegmentStats {
  100 |     /// Min value in the segment.
  101 |     min: u64,
  102 |     /// Max value in the segment
  103 |     max: u64,
  104 |     /// Total number of values in the segment
  105 |     count: u64,
  106 |     /// Whether the segment is sorted
  107 |     sorted: bool,
  108 | }
  109 | 
  110 | impl SegmentStats {
  111 |     /// Number of missing values ("holes") in the range `[min, max]`.
  112 |     ///
  113 |     /// Returns `u128` because the total slot count `max - min + 1` can be up
  114 |     /// to `2^64` (when `min = 0, max = u64::MAX`), which exceeds `u64::MAX`.
  115 |     fn n_holes(&self) -> u128 {
  116 |         debug_assert!(self.sorted);
  117 |         if self.count == 0 {
  118 |             0
  119 |         } else {
  120 |             let total_slots = self.max as u128 - self.min as u128 + 1;
  121 |             total_slots - self.count as u128
  122 |         }
  123 |     }
  124 | }
  125 | 
  126 | impl U64Segment {
  127 |     /// Return the values that are missing from the slice.
  128 |     fn holes_in_slice<'a>(
  129 |         range: RangeInclusive<u64>,
  130 |         existing: impl IntoIterator<Item = u64> + 'a,
  131 |     ) -> impl Iterator<Item = u64> + 'a {
  132 |         let mut existing = existing.into_iter().peekable();
  133 |         range.filter(move |val| {
  134 |             if let Some(&existing_val) = existing.peek()
  135 |                 && existing_val == *val
  136 |             {
  137 |                 existing.next();
  138 |                 return false;
  139 |             }
  140 |             true
  141 |         })
  142 |     }
  143 | 
  144 |     fn compute_stats(values: impl IntoIterator<Item = u64>) -> SegmentStats {
  145 |         let mut sorted = true;
  146 |         let mut min = u64::MAX;
  147 |         let mut max = 0;
  148 |         let mut count = 0;
  149 | 
  150 |         for val in values {
  151 |             count += 1;
  152 |             if val < min {
  153 |                 min = val;
  154 |             }
  155 |             if val > max {
  156 |                 max = val;
  157 |             }
  158 |             if sorted && count > 1 && val < max {
  159 |                 sorted = false;
  160 |             }
  161 |         }
  162 | 
  163 |         if count == 0 {
  164 |             min = 0;
  165 |             max = 0;
  166 |         }
  167 | 
  168 |         SegmentStats {
  169 |             min,
  170 |             max,
  171 |             count,
  172 |             sorted,
  173 |         }
  174 |     }
  175 | 
  176 |     /// Estimate the serialized byte size of each sorted encoding variant.
  177 |     ///
  178 |     /// All arithmetic is performed in `u128` to avoid overflow when the range
  179 |     /// span `max - min + 1` approaches or exceeds `2^64`. Infeasible sizes
  180 |     /// saturate to `usize::MAX` so they always lose the `min()` comparison.
  181 |     fn sorted_sequence_sizes(stats: &SegmentStats) -> [usize; 3] {
  182 |         let n_holes = stats.n_holes();
  183 |         let total_slots = stats.max as u128 - stats.min as u128 + 1;
  184 | 
  185 |         let range_with_holes = 24u128.saturating_add(4u128.saturating_mul(n_holes));
  186 |         let range_with_bitmap = 24u128.saturating_add(total_slots.div_ceil(8));
  187 |         let sorted_array = 24u128.saturating_add(2u128.saturating_mul(stats.count as u128));
  188 | 
  189 |         [
  190 |             u128_byte_cost_to_usize(range_with_holes),
  191 |             u128_byte_cost_to_usize(range_with_bitmap),
  192 |             u128_byte_cost_to_usize(sorted_array),
  193 |         ]
  194 |     }
  195 | 
  196 |     fn from_stats_and_sequence(
  197 |         stats: SegmentStats,
  198 |         sequence: impl IntoIterator<Item = u64>,
  199 |     ) -> Self {
  200 |         if stats.sorted {
  201 |             let n_holes = stats.n_holes();
  202 |             // Range-backed encodings store an exclusive end as `Range<u64>`,
  203 |             // which cannot represent `u64::MAX + 1`. Compute the end once and
  204 |             // gate all range-backed branches on its representability.
  205 |             let exclusive_end = stats.max.checked_add(1);
  206 |             if stats.count == 0 {
  207 |                 Self::Range(0..0)
  208 |             } else if n_holes == 0 && exclusive_end.is_some() {
  209 |                 Self::Range(stats.min..exclusive_end.unwrap())
  210 |             } else if let Some(end) = exclusive_end {
  211 |                 let sizes = Self::sorted_sequence_sizes(&stats);
  212 |                 let min_size = sizes.iter().min().unwrap();
  213 |                 if min_size == &sizes[0] {
  214 |                     let range = stats.min..end;
  215 |                     let mut holes =
  216 |                         Self::holes_in_slice(stats.min..=stats.max, sequence).collect::<Vec<_>>();
  217 |                     holes.sort_unstable();
  218 |                     let holes = EncodedU64Array::from(holes);
  219 |                     Self::RangeWithHoles { range, holes }
  220 |                 } else if min_size == &sizes[1] {
  221 |                     let range = stats.min..end;
  222 |                     let mut bitmap = Bitmap::new_full((stats.max - stats.min) as usize + 1);
  223 |                     for hole in Self::holes_in_slice(stats.min..=stats.max, sequence) {
  224 |                         let offset = (hole - stats.min) as usize;
  225 |                         bitmap.clear(offset);
  226 |                     }
  227 |                     Self::RangeWithBitmap { range, bitmap }
  228 |                 } else {
  229 |                     Self::SortedArray(EncodedU64Array::from_iter(sequence))
  230 |                 }
  231 |             } else {
  232 |                 // max == u64::MAX: exclusive end is unrepresentable in Range<u64>,
  233 |                 // so no range-backed encoding can be used.
  234 |                 Self::SortedArray(EncodedU64Array::from_iter(sequence))
  235 |             }
  236 |         } else {
  237 |             Self::Array(EncodedU64Array::from_iter(sequence))
  238 |         }
  239 |     }
  240 | 
  241 |     pub fn from_slice(slice: &[u64]) -> Self {
  242 |         Self::from_iter(slice.iter().copied())
  243 |     }
  244 | 
  245 |     /// Two or more sorted, disjoint, non-adjacent ranges as one [`Self::Ranges`]
  246 |     /// segment; `None` for fewer ranges or a span that does not fit `u32`.
  247 |     pub fn from_sorted_ranges(ranges: &[Range<u64>]) -> Option<Self> {
  248 |         let [first, .., last] = ranges else {
  249 |             return None;
  250 |         };
  251 |         let base = first.start;
  252 |         let span = u32::try_from(last.end - base).ok()?;
  253 |         let hole_starts = ranges[..ranges.len() - 1]
  254 |             .iter()
  255 |             .map(|range| (range.end - base) as u32)
  256 |             .collect();
  257 |         let hole_ends = ranges[1..]
  258 |             .iter()
  259 |             .map(|range| (range.start - base) as u32)
  260 |             .collect();
  261 |         let runs = HoleRuns::try_new(span, hole_starts, hole_ends).ok()?;
  262 |         Some(Self::Ranges {
  263 |             range: base..last.end,
  264 |             runs,
  265 |         })
  266 |     }
  267 | 
  268 |     /// The same values as a run of ranges, when writing them as `Range`
  269 |     /// segments is smaller than the current encoding; `None` when it is not
  270 |     /// (or the span does not fit the compact form's 32-bit offsets).
  271 |     ///
  272 |     /// A `Range` segment costs about 16 bytes on the wire, so ranges beat a
  273 |     /// bitmap when there is less than one range per 128 slots. Hole arrays
  274 |     /// are small by construction and are left alone.
  275 |     pub fn as_ranges(&self) -> Option<Self> {
  276 |         const RANGE_BYTES: usize = 16;
  277 |         match self {
  278 |             Self::RangeWithBitmap { range, bitmap } => {
  279 |                 if bitmap.len() > u32::MAX as usize {
  280 |                     return None;
  281 |                 }
  282 |                 let runs = HoleRuns::from_bitmap(bitmap);
  283 |                 ((runs.num_runs() + 1) * RANGE_BYTES < bitmap.bytes().len()).then(|| Self::Ranges {
  284 |                     range: range.clone(),
  285 |                     runs,
  286 |                 })
  287 |             }
  288 |             _ => None,
  289 |         }
  290 |     }
  291 | }
  292 | 
  293 | impl FromIterator<u64> for U64Segment {
  294 |     fn from_iter<T: IntoIterator<Item = u64>>(iter: T) -> Self {
  295 |         let values: Vec<u64> = iter.into_iter().collect();
  296 |         let stats = Self::compute_stats(values.iter().copied());
  297 |         Self::from_stats_and_sequence(stats, values)
  298 |     }
  299 | }
  300 | 
  301 | impl U64Segment {
  302 |     pub fn iter(&self) -> Box<dyn DoubleEndedIterator<Item = u64> + '_> {
  303 |         match self {
  304 |             Self::Range(range) => Box::new(range.clone()),
  305 |             Self::RangeWithHoles { range, holes } => {
  306 |                 Box::new((range.start..range.end).filter(move |&val| {
  307 |                     // TODO: we could write a more optimal version of this
  308 |                     // iterator, but would need special handling to make it
  309 |                     // double ended.
  310 |                     holes.binary_search(val).is_err()
  311 |                 }))
  312 |             }
  313 |             Self::RangeWithBitmap { range, bitmap } => {
  314 |                 Box::new((range.start..range.end).filter(|val| {
  315 |                     let offset = (val - range.start) as usize;
  316 |                     bitmap.get(offset)
  317 |                 }))
  318 |             }
  319 |             Self::Ranges { range, runs } => {
  320 |                 let start = range.start;
  321 |                 Box::new(runs.present_ranges().flat_map(move |offsets| {
  322 |                     (start + offsets.start as u64)..(start + offsets.end as u64)
  323 |                 }))
  324 |             }
  325 |             Self::SortedArray(array) => Box::new(array.iter()),
  326 |             Self::Array(array) => Box::new(array.iter()),
  327 |         }
  328 |     }
  329 | 
  330 |     pub fn len(&self) -> usize {
  331 |         match self {
  332 |             Self::Range(range) => (range.end - range.start) as usize,
  333 |             Self::RangeWithHoles { range, holes } => {
  334 |                 (range.end - range.start) as usize - holes.len()
  335 |             }
  336 |             Self::RangeWithBitmap { range, bitmap } => {
  337 |                 let holes = bitmap.count_zeros();
  338 |                 (range.end - range.start) as usize - holes
  339 |             }
  340 |             Self::Ranges { runs, .. } => runs.present_len() as usize,
  341 |             Self::SortedArray(array) => array.len(),
  342 |             Self::Array(array) => array.len(),
  343 |         }
  344 |     }
  345 | 
  346 |     pub(crate) fn use_dense_range_expansion(&self, segment_len: usize) -> bool {
  347 |         let Self::RangeWithBitmap { bitmap, .. } = self else {
  348 |             return false;
  349 |         };
  350 |         // Keep sparse segments on the compact per-bit decoder. Contiguous-run
  351 |         // expansion pays off when dense bytes dominate the segment.
  352 |         let dense_threshold = bitmap.len().saturating_sub(bitmap.len() / 4);
  353 |         segment_len >= dense_threshold
  354 |     }
  355 | 
  356 |     pub fn is_empty(&self) -> bool {
  357 |         self.len() == 0
  358 |     }
  359 | 
  360 |     /// Get the min and max value of the segment, excluding tombstones.
  361 |     ///
  362 |     /// Returns `None` for an empty segment, which has no extrema. Decoding accepts an
  363 |     /// empty encoding of every variant, so no arm here may assume it holds a value.
  364 |     pub fn range(&self) -> Option<RangeInclusive<u64>> {
  365 |         match self {
  366 |             Self::Range(range)
  367 |             | Self::RangeWithBitmap { range, .. }
  368 |             | Self::Ranges { range, .. }
  369 |             | Self::RangeWithHoles { range, .. } => {
  370 |                 (!range.is_empty()).then(|| range.start..=(range.end - 1))
  371 |             }
  372 |             // We can assume that the array is sorted.
  373 |             Self::SortedArray(array) => Some(array.first()?..=array.last()?),
  374 |             Self::Array(array) => Some(array.min()?..=array.max()?),
  375 |         }
  376 |     }
  377 | 
  378 |     pub fn slice(&self, offset: usize, len: usize) -> Self {
  379 |         if len == 0 {
  380 |             return Self::Range(0..0);
  381 |         }
  382 | 
  383 |         let values: Vec<u64> = self.iter().skip(offset).take(len).collect();
  384 | 
  385 |         // `from_slice` will compute stats and select the best representation.
  386 |         Self::from_slice(&values)
  387 |     }
  388 | 
  389 |     pub fn position(&self, val: u64) -> Option<usize> {
  390 |         match self {
  391 |             Self::Range(range) => {
  392 |                 if range.contains(&val) {
  393 |                     Some((val - range.start) as usize)
  394 |                 } else {
  395 |                     None
  396 |                 }
  397 |             }
  398 |             Self::RangeWithHoles { range, holes } => {
  399 |                 if !range.contains(&val) {
  400 |                     return None;
  401 |                 }
  402 |                 // binary_search returns Err(idx) where idx is the count of holes
  403 |                 // strictly less than val (holes are unique and sorted).
  404 |                 match holes.binary_search(val) {
  405 |                     Ok(_) => None,
  406 |                     Err(num_holes_before) => {
  407 |                         let offset = (val - range.start) as usize;
  408 |                         Some(offset - num_holes_before)
  409 |                     }
  410 |                 }
  411 |             }
  412 |             Self::Ranges { range, runs } => {
  413 |                 if !range.contains(&val) {
  414 |                     return None;
  415 |                 }
  416 |                 runs.position((val - range.start) as u32)
  417 |                     .map(|position| position as usize)
  418 |             }
  419 |             Self::RangeWithBitmap { range, bitmap } => {
  420 |                 if range.contains(&val) && bitmap.get((val - range.start) as usize) {
  421 |                     let offset = (val - range.start) as usize;
  422 |                     let num_zeros = bitmap.slice(0, offset).count_zeros();
  423 |                     Some(offset - num_zeros)
  424 |                 } else {
  425 |                     None
  426 |                 }
  427 |             }
  428 |             Self::SortedArray(array) => array.binary_search(val).ok(),
  429 |             Self::Array(array) => array.iter().position(|v| v == val),
  430 |         }
  431 |     }
  432 | 
  433 |     pub fn get(&self, i: usize) -> Option<u64> {
  434 |         match self {
  435 |             Self::Range(range) => match range.start.checked_add(i as u64) {
  436 |                 Some(val) if val < range.end => Some(val),
  437 |                 _ => None,
  438 |             },
  439 |             Self::RangeWithHoles { range, holes } => {
  440 |                 let len = (range.end - range.start) as usize - holes.len();
  441 |                 if i >= len {
  442 |                     return None;
  443 |                 }
  444 |                 // The i-th surviving value v satisfies v = range.start + i + k,
  445 |                 // where k = |{h ∈ holes : h < v}|. holes[k] - k is monotone
  446 |                 // non-decreasing in k (holes are sorted and unique), so binary
  447 |                 // search for the smallest k such that holes[k] - k > range.start + i.
  448 |                 let target = range.start + i as u64;
  449 |                 let mut lo = 0usize;
  450 |                 let mut hi = holes.len();
  451 |                 while lo < hi {
  452 |                     let mid = (lo + hi) / 2;
  453 |                     let h = holes.get(mid).unwrap();
  454 |                     if h.saturating_sub(mid as u64) > target {
  455 |                         hi = mid;
  456 |                     } else {
  457 |                         lo = mid + 1;
  458 |                     }
  459 |                 }
  460 |                 Some(range.start + i as u64 + lo as u64)
  461 |             }
  462 |             Self::RangeWithBitmap { .. } => self.cursor().get(i),
  463 |             Self::Ranges { range, runs } => u32::try_from(i)
  464 |                 .ok()
  465 |                 .and_then(|position| runs.offset_at(position))
  466 |                 .map(|offset| range.start + offset as u64),
  467 |             Self::SortedArray(array) => array.get(i),
  468 |             Self::Array(array) => array.get(i),
  469 |         }
  470 |     }
  471 | 
  472 |     /// Reads values at non-decreasing indices in one pass.
  473 |     pub fn cursor(&self) -> SegmentCursor<'_> {
  474 |         SegmentCursor {
  475 |             segment: self,
  476 |             state: SegmentCursorState::default(),
  477 |         }
  478 |     }
  479 | 
  480 |     /// Check if a value is contained in the segment
  481 |     pub fn contains(&self, val: u64) -> bool {
  482 |         match self {
  483 |             Self::Range(range) => range.contains(&val),
  484 |             Self::RangeWithHoles { range, holes } => {
  485 |                 if !range.contains(&val) {
  486 |                     return false;
  487 |                 }
  488 |                 // Check if the value is not in the holes
  489 |                 !holes.iter().any(|hole| hole == val)
  490 |             }
  491 |             Self::RangeWithBitmap { range, bitmap } => {
  492 |                 if !range.contains(&val) {
  493 |                     return false;
  494 |                 }
  495 |                 // Check if the bitmap has the value set (not cleared)
  496 |                 let idx = (val - range.start) as usize;
  497 |                 bitmap.get(idx)
  498 |             }
  499 |             Self::Ranges { range, runs } => {
  500 |                 range.contains(&val) && runs.position((val - range.start) as u32).is_some()
  501 |             }
  502 |             Self::SortedArray(array) => array.binary_search(val).is_ok(),
  503 |             Self::Array(array) => array.iter().any(|v| v == val),
  504 |         }
  505 |     }
  506 | 
  507 |     /// Produce a new segment that has `val` as the new highest value in the segment
  508 |     pub fn with_new_high(self, val: u64) -> lance_core::Result<Self> {
  509 |         // Check that the new value is higher than the current maximum
  510 |         if let Some(range) = self.range()
  511 |             && val <= *range.end()
  512 |         {
  513 |             return Err(lance_core::Error::invalid_input(format!(
  514 |                 "New value {} must be higher than current maximum {}",
  515 |                 val,
  516 |                 range.end()
  517 |             )));
  518 |         }
  519 | 
  520 |         Ok(match self {
  521 |             Self::Range(range) => {
  522 |                 // Special case for empty range: create a range containing only the new value
  523 |                 if range.start == range.end {
  524 |                     Self::Range(Range {
  525 |                         start: val,
  526 |                         end: val + 1,
  527 |                     })
  528 |                 } else if val == range.end {
  529 |                     Self::Range(Range {
  530 |                         start: range.start,
  531 |                         end: val + 1,
  532 |                     })
  533 |                 } else {
  534 |                     Self::RangeWithHoles {
  535 |                         range: Range {
  536 |                             start: range.start,
  537 |                             end: val + 1,
  538 |                         },
  539 |                         holes: EncodedU64Array::U64((range.end..val).collect()),
  540 |                     }
  541 |                 }
  542 |             }
  543 |             Self::RangeWithHoles { range, holes } => {
  544 |                 if val == range.end {
  545 |                     Self::RangeWithHoles {
  546 |                         range: Range {
  547 |                             start: range.start,
  548 |                             end: val + 1,
  549 |                         },
  550 |                         holes,
  551 |                     }
  552 |                 } else {
  553 |                     let mut new_holes: Vec<u64> = holes.iter().collect();
  554 |                     new_holes.extend(range.end..val);
  555 |                     Self::RangeWithHoles {
  556 |                         range: Range {
  557 |                             start: range.start,
  558 |                             end: val + 1,
  559 |                         },
  560 |                         holes: EncodedU64Array::U64(new_holes),
  561 |                     }
  562 |                 }
  563 |             }
  564 |             Self::RangeWithBitmap { range, bitmap } => {
  565 |                 let new_range = Range {
  566 |                     start: range.start,
  567 |                     end: val + 1,
  568 |                 };
  569 |                 let gap_size = (val - range.end) as usize;
  570 |                 let new_bitmap = bitmap
  571 |                     .iter()
  572 |                     .chain(std::iter::repeat_n(false, gap_size))
  573 |                     .chain(std::iter::once(true))
  574 |                     .collect::<Vec<bool>>();
  575 | 
  576 |                 Self::RangeWithBitmap {
  577 |                     range: new_range,
  578 |                     bitmap: Bitmap::from(new_bitmap.as_slice()),
  579 |                 }
  580 |             }
  581 |             Self::Ranges { range, runs } => {
  582 |                 // Rare on the append path; rebuild from the values and let
  583 |                 // `from_slice` pick an encoding (the commit re-encodes runs).
  584 |                 let current = Self::Ranges { range, runs };
  585 |                 let mut values: Vec<u64> = current.iter().collect();
  586 |                 values.push(val);
  587 |                 Self::from_slice(&values)
  588 |             }
  589 |             Self::SortedArray(array) => match array {
  590 |                 EncodedU64Array::U64(mut vec) => {
  591 |                     vec.push(val);
  592 |                     Self::SortedArray(EncodedU64Array::U64(vec))
  593 |                 }
  594 |                 EncodedU64Array::U16 { base, offsets } => {
  595 |                     if let Some(offset) = val.checked_sub(base) {
  596 |                         if offset <= u16::MAX as u64 {
  597 |                             let mut offsets = offsets;
  598 |                             offsets.push(offset as u16);
  599 |                             return Ok(Self::SortedArray(EncodedU64Array::U16 { base, offsets }));
  600 |                         } else if offset <= u32::MAX as u64 {
  601 |                             let mut u32_offsets: Vec<u32> =
  602 |                                 offsets.into_iter().map(|o| o as u32).collect();
  603 |                             u32_offsets.push(offset as u32);
  604 |                             return Ok(Self::SortedArray(EncodedU64Array::U32 {
  605 |                                 base,
  606 |                                 offsets: u32_offsets,
  607 |                             }));
  608 |                         }
  609 |                     }
  610 |                     let mut new_array: Vec<u64> =
  611 |                         offsets.into_iter().map(|o| base + o as u64).collect();
  612 |                     new_array.push(val);
  613 |                     Self::SortedArray(EncodedU64Array::from(new_array))
  614 |                 }
  615 |                 EncodedU64Array::U32 { base, mut offsets } => {
  616 |                     if let Some(offset) = val.checked_sub(base)
  617 |                         && offset <= u32::MAX as u64
  618 |                     {
  619 |                         offsets.push(offset as u32);
  620 |                         return Ok(Self::SortedArray(EncodedU64Array::U32 { base, offsets }));
  621 |                     }
  622 |                     let mut new_array: Vec<u64> =
  623 |                         offsets.into_iter().map(|o| base + o as u64).collect();
  624 |                     new_array.push(val);
  625 |                     Self::SortedArray(EncodedU64Array::from(new_array))
  626 |                 }
  627 |             },
  628 |             Self::Array(array) => match array {
  629 |                 EncodedU64Array::U64(mut vec) => {
  630 |                     vec.push(val);
  631 |                     Self::Array(EncodedU64Array::U64(vec))
  632 |                 }
  633 |                 EncodedU64Array::U16 { base, offsets } => {
  634 |                     if let Some(offset) = val.checked_sub(base) {
  635 |                         if offset <= u16::MAX as u64 {
  636 |                             let mut offsets = offsets;
  637 |                             offsets.push(offset as u16);
  638 |                             return Ok(Self::Array(EncodedU64Array::U16 { base, offsets }));
  639 |                         } else if offset <= u32::MAX as u64 {
  640 |                             let mut u32_offsets: Vec<u32> =
  641 |                                 offsets.into_iter().map(|o| o as u32).collect();
  642 |                             u32_offsets.push(offset as u32);
  643 |                             return Ok(Self::Array(EncodedU64Array::U32 {
  644 |                                 base,
  645 |                                 offsets: u32_offsets,
  646 |                             }));
  647 |                         }
  648 |                     }
  649 |                     let mut new_array: Vec<u64> =
  650 |                         offsets.into_iter().map(|o| base + o as u64).collect();
  651 |                     new_array.push(val);
  652 |                     Self::Array(EncodedU64Array::from(new_array))
  653 |                 }
  654 |                 EncodedU64Array::U32 { base, mut offsets } => {
  655 |                     if let Some(offset) = val.checked_sub(base)
  656 |                         && offset <= u32::MAX as u64
  657 |                     {
  658 |                         offsets.push(offset as u32);
  659 |                         return Ok(Self::Array(EncodedU64Array::U32 { base, offsets }));
  660 |                     }
  661 |                     let mut new_array: Vec<u64> =
  662 |                         offsets.into_iter().map(|o| base + o as u64).collect();
  663 |                     new_array.push(val);
  664 |                     Self::Array(EncodedU64Array::from(new_array))
  665 |                 }
  666 |             },
  667 |         })
  668 |     }
  669 | 
  670 |     /// Delete a set of row ids from the segment.
  671 |     /// The row ids are assumed to be in the segment. (within the range, not
  672 |     /// already deleted.)
  673 |     /// They are also assumed to be ordered by appearance in the segment.
  674 |     pub fn delete(&self, vals: &[u64]) -> Self {
  675 |         // TODO: can we enforce these assumptions? or make them safer?
  676 |         debug_assert!(vals.iter().all(|&val| self.range().unwrap().contains(&val)));
  677 | 
  678 |         let make_new_iter = || {
  679 |             let mut vals_iter = vals.iter().copied().peekable();
  680 |             self.iter().filter(move |val| {
  681 |                 if let Some(&next_val) = vals_iter.peek()
  682 |                     && next_val == *val
  683 |                 {
  684 |                     vals_iter.next();
  685 |                     return false;
  686 |                 }
  687 |                 true
  688 |             })
  689 |         };
  690 |         let stats = Self::compute_stats(make_new_iter());
  691 |         Self::from_stats_and_sequence(stats, make_new_iter())
  692 |     }
  693 | 
  694 |     pub fn mask(&mut self, positions: &[u32]) {
  695 |         if positions.is_empty() {
  696 |             return;
  697 |         }
  698 |         if positions.len() == self.len() {
  699 |             *self = Self::Range(0..0);
  700 |             return;
  701 |         }
  702 |         let count = (self.len() - positions.len()) as u64;
  703 |         let sorted = match self {
  704 |             Self::Range(_) => true,
  705 |             Self::RangeWithHoles { .. } => true,
  706 |             Self::RangeWithBitmap { .. } => true,
  707 |             Self::Ranges { .. } => true,
  708 |             Self::SortedArray(_) => true,
  709 |             Self::Array(_) => false,
  710 |         };
  711 |         // To get minimum, need to find the first value that is not masked.
  712 |         let first_unmasked = (0..self.len())
  713 |             .zip(positions.iter().cycle())
  714 |             .find(|(sequential_i, i)| **i != *sequential_i as u32)
  715 |             .map(|(sequential_i, _)| sequential_i)
  716 |             .unwrap();
  717 |         let min = self.get(first_unmasked).unwrap();
  718 | 
  719 |         let last_unmasked = (0..self.len())
  720 |             .rev()
  721 |             .zip(positions.iter().rev().cycle())
  722 |             .filter(|(sequential_i, i)| **i != *sequential_i as u32)
  723 |             .map(|(sequential_i, _)| sequential_i)
  724 |             .next()
  725 |             .unwrap();
  726 |         let max = self.get(last_unmasked).unwrap();
  727 | 
  728 |         let stats = SegmentStats {
  729 |             min,
  730 |             max,
  731 |             count,
  732 |             sorted,
  733 |         };
  734 | 
  735 |         let mut positions = positions.iter().copied().peekable();
  736 |         let sequence = self.iter().enumerate().filter_map(move |(i, val)| {
  737 |             if let Some(next_pos) = positions.peek()
  738 |                 && *next_pos == i as u32
  739 |             {
  740 |                 positions.next();
  741 |                 return None;
  742 |             }
  743 |             Some(val)
  744 |         });
  745 |         *self = Self::from_stats_and_sequence(stats, sequence)
  746 |     }
  747 | }
  748 | 
  749 | /// Segment reader that keeps its scan position across calls.
  750 | pub struct SegmentCursor<'a> {
  751 |     segment: &'a U64Segment,
  752 |     state: SegmentCursorState,
  753 | }
  754 | 
  755 | #[derive(Debug, Default)]
  756 | pub(crate) struct SegmentCursorState {
  757 |     /// Byte the next select1 scan resumes at.
  758 |     byte_idx: usize,
  759 |     /// Set bits in the bitmap bytes before `byte_idx`.
  760 |     ones_before: usize,
  761 | }
  762 | 
  763 | impl SegmentCursor<'_> {
  764 |     /// The value at index `i`. A decreasing index rewinds the scan.
  765 |     pub fn get(&mut self, i: usize) -> Option<u64> {
  766 |         self.state.get(self.segment, i)
  767 |     }
  768 | }
  769 | 
  770 | impl SegmentCursorState {
  771 |     /// Append a contiguous range of values while preserving the bitmap scan
  772 |     /// position for the next call.
  773 |     pub(crate) fn extend_range(
  774 |         &mut self,
  775 |         segment: &U64Segment,
  776 |         selection: Range<usize>,
  777 |         values: &mut Vec<u64>,
  778 |     ) {
  779 |         let U64Segment::RangeWithBitmap { range, bitmap } = segment else {
  780 |             match segment {
  781 |                 U64Segment::Range(range) => {
  782 |                     let segment_len = (range.end - range.start) as usize;
  783 |                     let end = selection.end.min(segment_len);
  784 |                     if selection.start < end {
  785 |                         values.extend(
  786 |                             (range.start + selection.start as u64)..(range.start + end as u64),
  787 |                         );
  788 |                     }
  789 |                 }
  790 |                 U64Segment::Ranges { range, runs } => {
  791 |                     // Positions are below the span, which fits u32.
  792 |                     let clamp = |position: usize| position.min(u32::MAX as usize) as u32;
  793 |                     runs.extend_values(
  794 |                         range.start,
  795 |                         clamp(selection.start)..clamp(selection.end),
  796 |                         values,
  797 |                     );
  798 |                 }
  799 |                 _ => values.extend(selection.filter_map(|index| segment.get(index))),
  800 |             }
  801 |             return;
  802 |         };
  803 | 
  804 |         if selection.start < self.ones_before {
  805 |             self.byte_idx = 0;
  806 |             self.ones_before = 0;
  807 |         }
  808 | 
  809 |         while let Some(&byte) = bitmap.data.get(self.byte_idx) {
  810 |             let ones = byte.count_ones() as usize;
  811 |             let ones_after_byte = self.ones_before + ones;
  812 |             if selection.start >= ones_after_byte {
  813 |                 self.ones_before = ones_after_byte;
  814 |                 self.byte_idx += 1;
  815 |                 continue;
  816 |             }
  817 | 
  818 |             let mut remaining_bits = byte;
  819 |             let mut rank = self.ones_before;
  820 |             while remaining_bits != 0 {
  821 |                 if rank >= selection.end {
  822 |                     return;
  823 |                 }
  824 |                 let bit = remaining_bits.trailing_zeros() as usize;
  825 |                 if rank >= selection.start {
  826 |                     values.push(range.start + (self.byte_idx * 8 + bit) as u64);
  827 |                 }
  828 |                 remaining_bits &= remaining_bits - 1;
  829 |                 rank += 1;
  830 |             }
  831 | 
  832 |             self.ones_before = ones_after_byte;
  833 |             self.byte_idx += 1;
  834 |             if self.ones_before >= selection.end {
  835 |                 return;
  836 |             }
  837 |         }
  838 |     }
  839 | 
  840 |     pub(crate) fn extend_dense_range(
  841 |         &mut self,
  842 |         segment: &U64Segment,
  843 |         selection: Range<usize>,
  844 |         values: &mut Vec<u64>,
  845 |     ) {
  846 |         let U64Segment::RangeWithBitmap { range, bitmap } = segment else {
  847 |             self.extend_range(segment, selection, values);
  848 |             return;
  849 |         };
  850 |         if selection.start < self.ones_before {
  851 |             self.byte_idx = 0;
  852 |             self.ones_before = 0;
  853 |         }
  854 |         self.extend_dense_bitmap_range(range.start, bitmap.bytes(), selection, values);
  855 |     }
  856 | 
  857 |     #[inline]
  858 |     fn extend_dense_bitmap_range(
  859 |         &mut self,
  860 |         range_start: u64,
  861 |         bitmap_bytes: &[u8],
  862 |         selection: Range<usize>,
  863 |         values: &mut Vec<u64>,
  864 |     ) {
  865 |         while let Some(&byte) = bitmap_bytes.get(self.byte_idx) {
  866 |             let ones = byte.count_ones() as usize;
  867 |             let ones_after_byte = self.ones_before + ones;
  868 |             if selection.start >= ones_after_byte {
  869 |                 self.ones_before = ones_after_byte;
  870 |                 self.byte_idx += 1;
  871 |                 continue;
  872 |             }
  873 | 
  874 |             let includes_entire_byte =
  875 |                 selection.start <= self.ones_before && selection.end >= ones_after_byte;
  876 |             if includes_entire_byte && ones >= 6 {
  877 |                 let byte_start = range_start + (self.byte_idx * 8) as u64;
  878 |                 if byte == u8::MAX {
  879 |                     values.extend(byte_start..byte_start + 8);
  880 |                 } else {
  881 |                     let mut remaining_bits = byte;
  882 |                     let mut bit_offset = 0_u64;
  883 |                     while remaining_bits != 0 {
  884 |                         let zeros = remaining_bits.trailing_zeros();
  885 |                         remaining_bits >>= zeros;
  886 |                         bit_offset += u64::from(zeros);
  887 |                         let run = remaining_bits.trailing_ones();
  888 |                         values.extend(
  889 |                             (byte_start + bit_offset)..(byte_start + bit_offset + u64::from(run)),
  890 |                         );
  891 |                         remaining_bits >>= run;
  892 |                         bit_offset += u64::from(run);
  893 |                     }
  894 |                 }
  895 |                 self.ones_before = ones_after_byte;
  896 |                 self.byte_idx += 1;
  897 |                 if self.ones_before >= selection.end {
  898 |                     return;
  899 |                 }
  900 |                 continue;
  901 |             }
  902 | 
  903 |             let mut remaining_bits = byte;
  904 |             let mut rank = self.ones_before;
  905 |             while remaining_bits != 0 {
  906 |                 if rank >= selection.end {
  907 |                     return;
  908 |                 }
  909 |                 let bit = remaining_bits.trailing_zeros() as usize;
  910 |                 if rank >= selection.start {
  911 |                     values.push(range_start + (self.byte_idx * 8 + bit) as u64);
  912 |                 }
  913 |                 remaining_bits &= remaining_bits - 1;
  914 |                 rank += 1;
  915 |             }
  916 | 
  917 |             self.ones_before = ones_after_byte;
  918 |             self.byte_idx += 1;
  919 |             if self.ones_before >= selection.end {
  920 |                 return;
  921 |             }
  922 |         }
  923 |     }
  924 | 
  925 |     /// The value at index `i`. A decreasing index rewinds the scan.
  926 |     pub(crate) fn get(&mut self, segment: &U64Segment, i: usize) -> Option<u64> {
  927 |         let U64Segment::RangeWithBitmap { range, bitmap } = segment else {
  928 |             return segment.get(i);
  929 |         };
  930 |         if i < self.ones_before {
  931 |             self.byte_idx = 0;
  932 |             self.ones_before = 0;
  933 |         }
  934 |         // Deserialization rejects a bitmap whose padding bits are set, so
  935 |         // popcount counts only valid positions.
  936 |         let mut remaining = i - self.ones_before;
  937 |         let range_start = range.start;
  938 |         let bitmap_bytes = bitmap.bytes();
  939 |         while let Some(&byte) = bitmap_bytes.get(self.byte_idx) {
  940 |             let ones = byte.count_ones() as usize;
  941 |             if remaining < ones {
  942 |                 let mut b = byte;
  943 |                 for _ in 0..remaining {
  944 |                     b &= b - 1; // clear lowest set bit
  945 |                 }
  946 |                 let bit = b.trailing_zeros() as usize;
  947 |                 return Some(range_start + (self.byte_idx * 8 + bit) as u64);
  948 |             }
  949 |             remaining -= ones;
  950 |             self.ones_before += ones;
  951 |             self.byte_idx += 1;
  952 |         }
  953 |         None
  954 |     }
  955 | }
  956 | 
  957 | #[cfg(test)]
  958 | mod test {
  959 |     use super::*;
  960 | 
  961 |     #[test]
  962 |     fn test_range_with_bitmap_data_remains_publicly_mutable() {
  963 |         let mut segment = U64Segment::RangeWithBitmap {
  964 |             range: 0..8,
  965 |             bitmap: Bitmap::new_empty(8),
  966 |         };
  967 |         let U64Segment::RangeWithBitmap { bitmap, .. } = &mut segment else {
  968 |             unreachable!();
  969 |         };
  970 | 
  971 |         bitmap.data[0] = 0b1010_0101;
  972 |         assert_eq!(bitmap.len, 8);
  973 |         assert_eq!(bitmap.count_ones(), 4);
  974 |     }
  975 | 
  976 |     #[test]
  977 |     fn test_extend_range_over_full_and_near_dense_bitmap_bytes() {
  978 |         let mut bitmap = Bitmap::new_full(24);
  979 |         bitmap.clear(10);
  980 |         bitmap.clear(17);
  981 |         bitmap.clear(22);
  982 |         let segment = U64Segment::RangeWithBitmap {
  983 |             range: 100..124,
  984 |             bitmap,
  985 |         };
  986 |         assert!(segment.use_dense_range_expansion(segment.len()));
  987 | 
  988 |         let mut sparse_bitmap = Bitmap::new_empty(24);
  989 |         for i in [0, 8, 16] {
  990 |             sparse_bitmap.set(i);
  991 |         }
  992 |         let sparse_segment = U64Segment::RangeWithBitmap {
  993 |             range: 0..24,
  994 |             bitmap: sparse_bitmap,
  995 |         };
  996 |         assert!(!sparse_segment.use_dense_range_expansion(sparse_segment.len()));
  997 |         let expected = segment.iter().collect::<Vec<_>>();
  998 | 
  999 |         let mut state = SegmentCursorState::default();
 1000 |         let mut actual = Vec::new();
 1001 |         for selection in [0..8, 8..15, 15..21] {
 1002 |             state.extend_dense_range(&segment, selection, &mut actual);
 1003 |         }
 1004 |         assert_eq!(actual, expected);
 1005 | 
 1006 |         let mut state = SegmentCursorState::default();
 1007 |         let mut partial = Vec::new();
 1008 |         state.extend_dense_range(&segment, 9..20, &mut partial);
 1009 |         assert_eq!(partial, expected[9..20]);
 1010 |     }
 1011 | 
 1012 |     #[test]
 1013 |     fn test_segments() {
 1014 |         fn check_segment(values: &[u64], expected: &U64Segment) {
 1015 |             let segment = U64Segment::from_slice(values);
 1016 |             assert_eq!(segment, *expected);
 1017 |             assert_eq!(values.len(), segment.len());
 1018 | 
 1019 |             let roundtripped = segment.iter().collect::<Vec<_>>();
 1020 |             assert_eq!(roundtripped, values);
 1021 | 
 1022 |             let expected_min = values.iter().copied().min();
 1023 |             let expected_max = values.iter().copied().max();
 1024 |             match segment.range() {
 1025 |                 Some(range) => {
 1026 |                     assert_eq!(range.start(), &expected_min.unwrap());
 1027 |                     assert_eq!(range.end(), &expected_max.unwrap());
 1028 |                 }
 1029 |                 None => {
 1030 |                     assert_eq!(expected_min, None);
 1031 |                     assert_eq!(expected_max, None);
 1032 |                 }
 1033 |             }
 1034 | 
 1035 |             for (i, value) in values.iter().enumerate() {
 1036 |                 assert_eq!(segment.get(i), Some(*value), "i = {}", i);
 1037 |                 assert_eq!(segment.position(*value), Some(i), "i = {}", i);
 1038 |             }
 1039 | 
 1040 |             check_segment_iter(&segment);
 1041 |         }
 1042 | 
 1043 |         fn check_segment_iter(segment: &U64Segment) {
 1044 |             // Should be able to iterate forwards and backwards, and get the same thing.
 1045 |             let forwards = segment.iter().collect::<Vec<_>>();
 1046 |             let mut backwards = segment.iter().rev().collect::<Vec<_>>();
 1047 |             backwards.reverse();
 1048 |             assert_eq!(forwards, backwards);
 1049 | 
 1050 |             // Should be able to pull from both sides in lockstep.
 1051 |             let mut expected = Vec::with_capacity(segment.len());
 1052 |             let mut actual = Vec::with_capacity(segment.len());
 1053 |             let mut iter = segment.iter();
 1054 |             // Alternating forwards and backwards
 1055 |             for i in 0..segment.len() {
 1056 |                 if i % 2 == 0 {
 1057 |                     actual.push(iter.next().unwrap());
 1058 |                     expected.push(segment.get(i / 2).unwrap());
 1059 |                 } else {
 1060 |                     let i = segment.len() - 1 - i / 2;
 1061 |                     actual.push(iter.next_back().unwrap());
 1062 |                     expected.push(segment.get(i).unwrap());
 1063 |                 };
 1064 |             }
 1065 |             assert_eq!(expected, actual);
 1066 |         }
 1067 | 
 1068 |         // Empty
 1069 |         check_segment(&[], &U64Segment::Range(0..0));
 1070 | 
 1071 |         // Single value
 1072 |         check_segment(&[42], &U64Segment::Range(42..43));
 1073 | 
 1074 |         // Contiguous range
 1075 |         check_segment(
 1076 |             &(100..200).collect::<Vec<_>>(),
 1077 |             &U64Segment::Range(100..200),
 1078 |         );
 1079 | 
 1080 |         // Range with a hole
 1081 |         let values = (0..1000).filter(|&x| x != 100).collect::<Vec<_>>();
 1082 |         check_segment(
 1083 |             &values,
 1084 |             &U64Segment::RangeWithHoles {
 1085 |                 range: 0..1000,
 1086 |                 holes: vec![100].into(),
 1087 |             },
 1088 |         );
 1089 | 
 1090 |         // Range with every other value missing
 1091 |         let values = (0..1000).filter(|&x| x % 2 == 0).collect::<Vec<_>>();
 1092 |         check_segment(
 1093 |             &values,
 1094 |             &U64Segment::RangeWithBitmap {
 1095 |                 range: 0..999,
 1096 |                 bitmap: Bitmap::from((0..999).map(|x| x % 2 == 0).collect::<Vec<_>>().as_slice()),
 1097 |             },
 1098 |         );
 1099 | 
 1100 |         // Sparse but sorted sequence
 1101 |         check_segment(
 1102 |             &[1, 7000, 24000],
 1103 |             &U64Segment::SortedArray(vec![1, 7000, 24000].into()),
 1104 |         );
 1105 | 
 1106 |         // Sparse unsorted sequence
 1107 |         check_segment(
 1108 |             &[7000, 1, 24000],
 1109 |             &U64Segment::Array(vec![7000, 1, 24000].into()),
 1110 |         );
 1111 |     }
 1112 | 
 1113 |     /// Decoding accepts an empty encoding of every variant, so `range()` must report the
 1114 |     /// absence of extrema for all of them rather than unwrapping a value or computing
 1115 |     /// `end - 1` on a zero-length range.
 1116 |     #[test]
 1117 |     fn test_empty_segments_have_no_range() {
 1118 |         let empty: Vec<u64> = Vec::new();
 1119 |         let segments = [
 1120 |             U64Segment::Range(5..5),
 1121 |             U64Segment::RangeWithHoles {
 1122 |                 range: 0..0,
 1123 |                 holes: empty.clone().into(),
 1124 |             },
 1125 |             U64Segment::RangeWithBitmap {
 1126 |                 range: 0..0,
 1127 |                 bitmap: Bitmap::new_empty(0),
 1128 |             },
 1129 |             U64Segment::SortedArray(empty.clone().into()),
 1130 |             U64Segment::Array(empty.into()),
 1131 |         ];
 1132 |         for segment in segments {
 1133 |             assert_eq!(segment.range(), None, "{segment:?} should have no range");
 1134 |         }
 1135 |     }
 1136 | 
 1137 |     #[test]
 1138 |     fn test_segment_overflow_boundary() {
 1139 |         // Sparse range spanning i64::MAX — the original overflow reproducer.
 1140 |         // n_holes ≈ 2^63, which overflows `4 * n_holes as usize` without u128 arithmetic.
 1141 |         let values: Vec<u64> = vec![0, 1, 2, 100, i64::MAX as u64];
 1142 |         let segment = U64Segment::from_slice(&values);
 1143 |         assert!(
 1144 |             matches!(segment, U64Segment::SortedArray(_)),
 1145 |             "sparse range spanning i64::MAX should be SortedArray, got {:?}",
 1146 |             std::mem::discriminant(&segment)
 1147 |         );
 1148 |         assert_eq!(segment.len(), 5);
 1149 |         assert_eq!(segment.iter().collect::<Vec<_>>(), values);
 1150 | 
 1151 |         // Two values at u64 extremes — triggers n_holes() total_slots overflow
 1152 |         // (u64::MAX - 0 + 1 wraps to 0 without u128).
 1153 |         let values: Vec<u64> = vec![0, u64::MAX];
 1154 |         let segment = U64Segment::from_slice(&values);
 1155 |         assert!(
 1156 |             matches!(segment, U64Segment::SortedArray(_)),
 1157 |             "full u64 span should be SortedArray, got {:?}",
 1158 |             std::mem::discriminant(&segment)
 1159 |         );
 1160 |         assert_eq!(segment.len(), 2);
 1161 |         assert_eq!(segment.iter().collect::<Vec<_>>(), values);
 1162 | 
 1163 |         // Small dense set near u64::MAX — cost estimation correctly prefers a
 1164 |         // range-backed encoding, but Range<u64> cannot represent u64::MAX + 1
 1165 |         // as the exclusive end. Must fall back to SortedArray.
 1166 |         let values: Vec<u64> = vec![u64::MAX - 3, u64::MAX - 1, u64::MAX];
 1167 |         let segment = U64Segment::from_slice(&values);
 1168 |         assert!(
 1169 |             matches!(segment, U64Segment::SortedArray(_)),
 1170 |             "dense set near u64::MAX should be SortedArray (exclusive end unrepresentable), got {:?}",
 1171 |             std::mem::discriminant(&segment)
 1172 |         );
 1173 |         assert_eq!(segment.len(), 3);
 1174 |         assert_eq!(segment.iter().collect::<Vec<_>>(), values);
 1175 | 
 1176 |         // Single value at u64::MAX — contiguous range with n_holes == 0, but
 1177 |         // exclusive end u64::MAX + 1 overflows.
 1178 |         let values: Vec<u64> = vec![u64::MAX];
 1179 |         let segment = U64Segment::from_slice(&values);
 1180 |         assert!(
 1181 |             matches!(segment, U64Segment::SortedArray(_)),
 1182 |             "single u64::MAX should be SortedArray, got {:?}",
 1183 |             std::mem::discriminant(&segment)
 1184 |         );
 1185 |         assert_eq!(segment.len(), 1);
 1186 |         assert_eq!(segment.iter().collect::<Vec<_>>(), values);
 1187 | 
 1188 |         // Contiguous range ending just below u64::MAX — exclusive end is
 1189 |         // representable, so Range encoding should still be used.
 1190 |         let values: Vec<u64> = vec![u64::MAX - 3, u64::MAX - 2, u64::MAX - 1];
 1191 |         let segment = U64Segment::from_slice(&values);
 1192 |         assert_eq!(segment, U64Segment::Range((u64::MAX - 3)..u64::MAX));
 1193 |         assert_eq!(segment.len(), 3);
 1194 |         assert_eq!(segment.iter().collect::<Vec<_>>(), values);
 1195 | 
 1196 |         // Regression: normal dense range with few holes still picks RangeWithHoles.
 1197 |         // Needs total_slots > 32 * n_holes for RangeWithHoles to beat RangeWithBitmap.
 1198 |         let values: Vec<u64> = (100..1100).filter(|&x| x != 500).collect();
 1199 |         let segment = U64Segment::from_slice(&values);
 1200 |         assert_eq!(
 1201 |             segment,
 1202 |             U64Segment::RangeWithHoles {
 1203 |                 range: 100..1100,
 1204 |                 holes: vec![500].into(),
 1205 |             }
 1206 |         );
 1207 |         assert_eq!(segment.len(), 999);
 1208 |         assert_eq!(segment.iter().collect::<Vec<_>>(), values);
 1209 | 
 1210 |         // Regression: small dense range with hole picks RangeWithBitmap.
 1211 |         let values: Vec<u64> = vec![100, 101, 102, 103, 105];
 1212 |         let segment = U64Segment::from_slice(&values);
 1213 |         assert!(
 1214 |             matches!(segment, U64Segment::RangeWithBitmap { .. }),
 1215 |             "small dense range with hole should be RangeWithBitmap, got {:?}",
 1216 |             std::mem::discriminant(&segment)
 1217 |         );
 1218 |         assert_eq!(segment.len(), 5);
 1219 |         assert_eq!(segment.iter().collect::<Vec<_>>(), values);
 1220 |     }
 1221 | 
 1222 |     #[test]
 1223 |     fn test_range_with_holes_len_counts_holes_without_iterating() {
 1224 |         // Many holes: `len` must equal the range span minus the hole count and
 1225 |         // agree with the iterator, for every hole encoding width.
 1226 |         let holes: Vec<u64> = (0..50_000_u64).map(|i| 3 * i + 1).collect();
 1227 |         let segment = U64Segment::RangeWithHoles {
 1228 |             range: 0..150_000,
 1229 |             holes: holes.clone().into(),
 1230 |         };
 1231 |         assert_eq!(segment.len(), 150_000 - holes.len());
 1232 |         assert_eq!(segment.len(), segment.iter().count());
 1233 | 
 1234 |         let wide_holes: Vec<u64> = vec![1 << 40, (1 << 40) + 7];
 1235 |         let wide = U64Segment::RangeWithHoles {
 1236 |             range: (1 << 40)..((1 << 40) + 10),
 1237 |             holes: wide_holes.into(),
 1238 |         };
 1239 |         assert_eq!(wide.len(), 8);
 1240 |         assert_eq!(wide.len(), wide.iter().count());
 1241 |     }
 1242 | 
 1243 |     #[test]
 1244 |     fn test_u128_byte_cost_to_usize() {
 1245 |         assert_eq!(super::u128_byte_cost_to_usize(0), 0);
 1246 |         assert_eq!(super::u128_byte_cost_to_usize(42), 42);
 1247 |         assert_eq!(
 1248 |             super::u128_byte_cost_to_usize(usize::MAX as u128),
 1249 |             usize::MAX
 1250 |         );
 1251 |         assert_eq!(super::u128_byte_cost_to_usize(u128::MAX), usize::MAX);
 1252 |     }
 1253 | 
 1254 |     #[test]
 1255 |     fn test_sorted_sequence_sizes_sparse_span_saturates_range_with_holes_cost() {
 1256 |         let stats = super::SegmentStats {
 1257 |             min: 0,
 1258 |             max: i64::MAX as u64,
 1259 |             count: 5,
 1260 |             sorted: true,
 1261 |         };
 1262 |         let sizes = U64Segment::sorted_sequence_sizes(&stats);
 1263 |         assert_eq!(sizes[0], usize::MAX);
 1264 |         assert!(sizes[2] < sizes[0]);
 1265 |     }
 1266 | 
 1267 |     #[test]
 1268 |     fn test_sorted_sequence_sizes_sorted_array_cost_saturates() {
 1269 |         // Nearly full [0, u64::MAX] with one hole: count = u64::MAX, n_holes = 1.
 1270 |         // SortedArray cost 24 + 2 * u64::MAX does not fit in usize on 64-bit.
 1271 |         let stats = super::SegmentStats {
 1272 |             min: 0,
 1273 |             max: u64::MAX,
 1274 |             count: u64::MAX,
 1275 |             sorted: true,
 1276 |         };
 1277 |         let sizes = U64Segment::sorted_sequence_sizes(&stats);
 1278 |         assert_eq!(sizes[2], usize::MAX);
 1279 |     }
 1280 | 
 1281 |     #[test]
 1282 |     fn test_sorted_sequence_sizes_full_span_bitmap_cost() {
 1283 |         // Synthetic stats: full [0, u64::MAX] slot space; exercises `range_with_bitmap`
 1284 |         // cost path (always fits in `usize` on 64-bit targets).
 1285 |         let stats = super::SegmentStats {
 1286 |             min: 0,
 1287 |             max: u64::MAX,
 1288 |             count: 1,
 1289 |             sorted: true,
 1290 |         };
 1291 |         let sizes = U64Segment::sorted_sequence_sizes(&stats);
 1292 |         assert!(sizes[1] < sizes[0]);
 1293 |         assert!(sizes[1] < usize::MAX);
 1294 |     }
 1295 | 
 1296 |     #[test]
 1297 |     fn test_with_new_high() {
 1298 |         // Test Range: contiguous sequence
 1299 |         let segment = U64Segment::Range(10..20);
 1300 | 
 1301 |         // Test adding value that extends the range
 1302 |         let result = segment.clone().with_new_high(20).unwrap();
 1303 |         assert_eq!(result, U64Segment::Range(10..21));
 1304 | 
 1305 |         // Test adding value that creates holes
 1306 |         let result = segment.with_new_high(25).unwrap();
 1307 |         assert_eq!(
 1308 |             result,
 1309 |             U64Segment::RangeWithHoles {
 1310 |                 range: 10..26,
 1311 |                 holes: EncodedU64Array::U64(vec![20, 21, 22, 23, 24]),
 1312 |             }
 1313 |         );
 1314 | 
 1315 |         // Test RangeWithHoles: sequence with existing holes
 1316 |         let segment = U64Segment::RangeWithHoles {
 1317 |             range: 10..20,
 1318 |             holes: EncodedU64Array::U64(vec![15, 17]),
 1319 |         };
 1320 | 
 1321 |         // Test adding value that extends the range without new holes
 1322 |         let result = segment.clone().with_new_high(20).unwrap();
 1323 |         assert_eq!(
 1324 |             result,
 1325 |             U64Segment::RangeWithHoles {
 1326 |                 range: 10..21,
 1327 |                 holes: EncodedU64Array::U64(vec![15, 17]),
 1328 |             }
 1329 |         );
 1330 | 
 1331 |         // Test adding value that creates additional holes
 1332 |         let result = segment.with_new_high(25).unwrap();
 1333 |         assert_eq!(
 1334 |             result,
 1335 |             U64Segment::RangeWithHoles {
 1336 |                 range: 10..26,
 1337 |                 holes: EncodedU64Array::U64(vec![15, 17, 20, 21, 22, 23, 24]),
 1338 |             }
 1339 |         );
 1340 | 
 1341 |         // Test RangeWithBitmap: sequence with bitmap representation
 1342 |         let mut bitmap = Bitmap::new_full(10);
 1343 |         bitmap.clear(3); // Clear position 3 (value 13)
 1344 |         bitmap.clear(7); // Clear position 7 (value 17)
 1345 |         let segment = U64Segment::RangeWithBitmap {
 1346 |             range: 10..20,
 1347 |             bitmap,
 1348 |         };
 1349 | 
 1350 |         // Test adding value that extends the range without new holes
 1351 |         let result = segment.clone().with_new_high(20).unwrap();
 1352 |         let expected_bitmap = {
 1353 |             let mut b = Bitmap::new_full(11);
 1354 |             b.clear(3); // Clear position 3 (value 13)
 1355 |             b.clear(7); // Clear position 7 (value 17)
 1356 |             b
 1357 |         };
 1358 |         assert_eq!(
 1359 |             result,
 1360 |             U64Segment::RangeWithBitmap {
 1361 |                 range: 10..21,
 1362 |                 bitmap: expected_bitmap,
 1363 |             }
 1364 |         );
 1365 | 
 1366 |         // Test adding value that creates additional holes
 1367 |         let result = segment.with_new_high(25).unwrap();
 1368 |         let expected_bitmap = {
 1369 |             let mut b = Bitmap::new_full(16);
 1370 |             b.clear(3); // Clear position 3 (value 13)
 1371 |             b.clear(7); // Clear position 7 (value 17)
 1372 |             // Clear positions 10-14 (values 20-24)
 1373 |             for i in 10..15 {
 1374 |                 b.clear(i);
 1375 |             }
 1376 |             b
 1377 |         };
 1378 |         assert_eq!(
 1379 |             result,
 1380 |             U64Segment::RangeWithBitmap {
 1381 |                 range: 10..26,
 1382 |                 bitmap: expected_bitmap,
 1383 |             }
 1384 |         );
 1385 | 
 1386 |         // Test SortedArray: sparse sorted sequence
 1387 |         let segment = U64Segment::SortedArray(EncodedU64Array::U64(vec![1, 5, 10]));
 1388 | 
 1389 |         let result = segment.with_new_high(15).unwrap();
 1390 |         assert_eq!(
 1391 |             result,
 1392 |             U64Segment::SortedArray(EncodedU64Array::U64(vec![1, 5, 10, 15]))
 1393 |         );
 1394 | 
 1395 |         // Test Array: unsorted sequence
 1396 |         let segment = U64Segment::Array(EncodedU64Array::U64(vec![10, 5, 1]));
 1397 | 
 1398 |         let result = segment.with_new_high(15).unwrap();
 1399 |         assert_eq!(
 1400 |             result,
 1401 |             U64Segment::Array(EncodedU64Array::U64(vec![10, 5, 1, 15]))
 1402 |         );
 1403 | 
 1404 |         // Test edge cases
 1405 |         // Empty segment
 1406 |         let segment = U64Segment::Range(0..0);
 1407 |         let result = segment.with_new_high(5).unwrap();
 1408 |         assert_eq!(result, U64Segment::Range(5..6));
 1409 | 
 1410 |         // Single value segment
 1411 |         let segment = U64Segment::Range(42..43);
 1412 |         let result = segment.with_new_high(50).unwrap();
 1413 |         assert_eq!(
 1414 |             result,
 1415 |             U64Segment::RangeWithHoles {
 1416 |                 range: 42..51,
 1417 |                 holes: EncodedU64Array::U64(vec![43, 44, 45, 46, 47, 48, 49]),
 1418 |             }
 1419 |         );
 1420 |     }
 1421 | 
 1422 |     #[test]
 1423 |     fn test_with_new_high_assertion() {
 1424 |         let segment = U64Segment::Range(10..20);
 1425 |         // This should return an error because 15 is not higher than the current maximum 19
 1426 |         let result = segment.with_new_high(15);
 1427 |         assert!(result.is_err());
 1428 |         let error = result.unwrap_err();
 1429 |         assert!(
 1430 |             error
 1431 |                 .to_string()
 1432 |                 .contains("New value 15 must be higher than current maximum 19")
 1433 |         );
 1434 |     }
 1435 | 
 1436 |     #[test]
 1437 |     fn test_with_new_high_assertion_equal() {
 1438 |         let segment = U64Segment::Range(1..6);
 1439 |         // This should return an error because 5 is not higher than the current maximum 5
 1440 |         let result = segment.with_new_high(5);
 1441 |         assert!(result.is_err());
 1442 |         let error = result.unwrap_err();
 1443 |         assert!(
 1444 |             error
 1445 |                 .to_string()
 1446 |                 .contains("New value 5 must be higher than current maximum 5")
 1447 |         );
 1448 |     }
 1449 | 
 1450 |     #[test]
 1451 |     fn test_contains() {
 1452 |         // Test Range: contiguous sequence
 1453 |         let segment = U64Segment::Range(10..20);
 1454 |         assert!(segment.contains(10), "Should contain 10");
 1455 |         assert!(segment.contains(15), "Should contain 15");
 1456 |         assert!(segment.contains(19), "Should contain 19");
 1457 |         assert!(!segment.contains(9), "Should not contain 9");
 1458 |         assert!(!segment.contains(20), "Should not contain 20");
 1459 |         assert!(!segment.contains(25), "Should not contain 25");
 1460 | 
 1461 |         // Test RangeWithHoles: sequence with holes
 1462 |         let segment = U64Segment::RangeWithHoles {
 1463 |             range: 10..20,
 1464 |             holes: EncodedU64Array::U64(vec![15, 17]),
 1465 |         };
 1466 |         assert!(segment.contains(10), "Should contain 10");
 1467 |         assert!(segment.contains(14), "Should contain 14");
 1468 |         assert!(!segment.contains(15), "Should not contain 15 (hole)");
 1469 |         assert!(segment.contains(16), "Should contain 16");
 1470 |         assert!(!segment.contains(17), "Should not contain 17 (hole)");
 1471 |         assert!(segment.contains(18), "Should contain 18");
 1472 |         assert!(
 1473 |             !segment.contains(20),
 1474 |             "Should not contain 20 (out of range)"
 1475 |         );
 1476 | 
 1477 |         // Test RangeWithBitmap: sequence with bitmap
 1478 |         let mut bitmap = Bitmap::new_full(10);
 1479 |         bitmap.clear(3); // Clear position 3 (value 13)
 1480 |         bitmap.clear(7); // Clear position 7 (value 17)
 1481 |         let segment = U64Segment::RangeWithBitmap {
 1482 |             range: 10..20,
 1483 |             bitmap,
 1484 |         };
 1485 |         assert!(segment.contains(10), "Should contain 10");
 1486 |         assert!(segment.contains(12), "Should contain 12");
 1487 |         assert!(
 1488 |             !segment.contains(13),
 1489 |             "Should not contain 13 (cleared in bitmap)"
 1490 |         );
 1491 |         assert!(segment.contains(16), "Should contain 16");
 1492 |         assert!(
 1493 |             !segment.contains(17),
 1494 |             "Should not contain 17 (cleared in bitmap)"
 1495 |         );
 1496 |         assert!(segment.contains(19), "Should contain 19");
 1497 |         assert!(
 1498 |             !segment.contains(20),
 1499 |             "Should not contain 20 (out of range)"
 1500 |         );
 1501 | 
 1502 |         // Test SortedArray: sparse sorted sequence
 1503 |         let segment = U64Segment::SortedArray(EncodedU64Array::U64(vec![1, 5, 10]));
 1504 |         assert!(segment.contains(1), "Should contain 1");
 1505 |         assert!(segment.contains(5), "Should contain 5");
 1506 |         assert!(segment.contains(10), "Should contain 10");
 1507 |         assert!(!segment.contains(0), "Should not contain 0");
 1508 |         assert!(!segment.contains(3), "Should not contain 3");
 1509 |         assert!(!segment.contains(15), "Should not contain 15");
 1510 | 
 1511 |         // Test Array: unsorted sequence
 1512 |         let segment = U64Segment::Array(EncodedU64Array::U64(vec![10, 5, 1]));
 1513 |         assert!(segment.contains(1), "Should contain 1");
 1514 |         assert!(segment.contains(5), "Should contain 5");
 1515 |         assert!(segment.contains(10), "Should contain 10");
 1516 |         assert!(!segment.contains(0), "Should not contain 0");
 1517 |         assert!(!segment.contains(3), "Should not contain 3");
 1518 |         assert!(!segment.contains(15), "Should not contain 15");
 1519 | 
 1520 |         // Test empty segment
 1521 |         let segment = U64Segment::Range(0..0);
 1522 |         assert!(
 1523 |             !segment.contains(0),
 1524 |             "Empty segment should not contain anything"
 1525 |         );
 1526 |         assert!(
 1527 |             !segment.contains(5),
 1528 |             "Empty segment should not contain anything"
 1529 |         );
 1530 |     }
 1531 | 
 1532 |     /// Row ids 1000..2000 minus three clusters of holes: dense enough that
 1533 |     /// `from_slice` picks a bitmap, clustered enough that runs are smaller.
 1534 |     fn clustered_values() -> Vec<u64> {
 1535 |         (1000..2000u64)
 1536 |             .filter(|v| !(1100..1300).contains(v) && !(1500..1650).contains(v) && *v != 1999)
 1537 |             .collect()
 1538 |     }
 1539 | 
 1540 |     #[test]
 1541 |     fn test_ranges_segment_matches_bitmap_semantics() {
 1542 |         let values = clustered_values();
 1543 |         let bitmap = U64Segment::from_slice(&values);
 1544 |         assert!(matches!(bitmap, U64Segment::RangeWithBitmap { .. }));
 1545 |         let runs = bitmap
 1546 |             .as_ranges()
 1547 |             .expect("three runs are smaller than a 125 byte bitmap");
 1548 |         let U64Segment::Ranges { runs: holes, .. } = &runs else {
 1549 |             panic!("expected a run-length segment");
 1550 |         };
 1551 |         assert_eq!(holes.num_runs(), 2);
 1552 | 
 1553 |         assert_eq!(runs.len(), bitmap.len());
 1554 |         assert_eq!(runs.range(), bitmap.range());
 1555 |         assert_eq!(runs.iter().collect::<Vec<_>>(), values);
 1556 |         assert_eq!(
 1557 |             runs.iter().rev().collect::<Vec<_>>(),
 1558 |             values.iter().rev().copied().collect::<Vec<_>>()
 1559 |         );
 1560 |         for (position, &value) in values.iter().enumerate() {
 1561 |             assert_eq!(runs.position(value), Some(position), "value {value}");
 1562 |             assert_eq!(runs.get(position), Some(value), "position {position}");
 1563 |             assert!(runs.contains(value));
 1564 |         }
 1565 |         for missing in [999, 1100, 1250, 1299, 1500, 1649, 1999, 2000, 5000] {
 1566 |             assert_eq!(runs.position(missing), None, "missing {missing}");
 1567 |             assert!(!runs.contains(missing));
 1568 |         }
 1569 |         assert_eq!(runs.get(values.len()), None);
 1570 |         assert_eq!(
 1571 |             runs.slice(95, 20).iter().collect::<Vec<_>>(),
 1572 |             values[95..115].to_vec()
 1573 |         );
 1574 | 
 1575 |         let deleted = [1000, 1050, 1400];
 1576 |         assert_eq!(
 1577 |             runs.delete(&deleted).iter().collect::<Vec<_>>(),
 1578 |             bitmap.delete(&deleted).iter().collect::<Vec<_>>()
 1579 |         );
 1580 |         let (mut masked_runs, mut masked_bitmap) = (runs.clone(), bitmap);
 1581 |         masked_runs.mask(&[0, 1, 7]);
 1582 |         masked_bitmap.mask(&[0, 1, 7]);
 1583 |         assert_eq!(
 1584 |             masked_runs.iter().collect::<Vec<_>>(),
 1585 |             masked_bitmap.iter().collect::<Vec<_>>()
 1586 |         );
 1587 | 
 1588 |         // The cursor path streaming readers use.
 1589 |         let mut cursor = SegmentCursorState::default();
 1590 |         let mut got = Vec::new();
 1591 |         cursor.extend_range(&runs, 90..110, &mut got);
 1592 |         assert_eq!(got, values[90..110].to_vec());
 1593 |         got.clear();
 1594 |         cursor.extend_range(&runs, 300..values.len() + 10, &mut got);
 1595 |         assert_eq!(got, values[300..].to_vec());
 1596 |         assert_eq!(runs.cursor().get(400), Some(values[400]));
 1597 | 
 1598 |         let higher = runs.clone().with_new_high(2500).unwrap();
 1599 |         assert_eq!(higher.iter().last(), Some(2500));
 1600 |         assert_eq!(higher.len(), values.len() + 1);
 1601 |     }
 1602 | 
 1603 |     #[test]
 1604 |     fn test_as_ranges_only_when_smaller() {
 1605 |         // Alternating holes: one run per two slots, far more than one per 64.
 1606 |         let alternating: Vec<u64> = (0..1024u64).filter(|v| v % 2 == 0).collect();
 1607 |         let bitmap = U64Segment::from_slice(&alternating);
 1608 |         assert!(matches!(bitmap, U64Segment::RangeWithBitmap { .. }));
 1609 |         assert_eq!(bitmap.as_ranges(), None);
 1610 | 
 1611 |         assert_eq!(U64Segment::Range(0..10).as_ranges(), None);
 1612 |         assert_eq!(
 1613 |             U64Segment::SortedArray(vec![1, 1000, 1_000_000].into()).as_ranges(),
 1614 |             None
 1615 |         );
 1616 | 
 1617 |         // Hole arrays are already small; only bitmaps convert.
 1618 |         let holes = U64Segment::RangeWithHoles {
 1619 |             range: 0..1000,
 1620 |             holes: vec![3, 77, 500].into(),
 1621 |         };
 1622 |         assert_eq!(holes.as_ranges(), None);
 1623 |     }
 1624 | }
``````
