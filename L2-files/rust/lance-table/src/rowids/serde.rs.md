> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-table/src/rowids/serde.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `0326a421f961d34ced39e4117c53a7060893a9e4def869e6d58547ccb22f19cc`. Reviewed physical lines: 1-884.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Row-ID protobuf conversion and handwritten top-level decoder, validated segment/array payloads, compact range folding and wire flattening. (rust/lance-table/src/rowids/serde.rs:1-884)

## Complete range analysis

### Lines 1-18

SPDX/imports connect generated protobuf, internal bitmap/array, U64Segment/RowIdSequence, prost Message and raw key/varint/WireType helpers. ROW_ID_METADATA is row ID metadata; pub(super) corrupt_row_id_metadata returns Error::corrupt_file_named with that name. The private serde module publicly reexports read/write through rowids (rust/lance-table/src/rowids.rs:17-33). (rust/lance-table/src/rowids/serde.rs:1-18)

### Lines 19-31

validate_range checked-subtracts end-start, rejecting reversed bounds as CorruptFile with context/start/end; converts resulting length to usize with contextual overflow error. Empty ranges are permitted. This helper is used by protobuf conversion paths, not the successful plain_range fast path. (rust/lance-table/src/rowids/serde.rs:19-31)

### Lines 32-40

validate_packed_array_length rejects byte lengths not divisible by width, reporting context, actual length and element width. All local callers supply constant nonzero2/4/8. It returns unit without decoding any values. (rust/lance-table/src/rowids/serde.rs:32-40)

### Lines 41-59

first_non_increasing_pair obtains an array iterator, returns None for empty/singleton or strict ascent, otherwise returns the first adjacent pair previous>=next with left index/values. It rejects duplicates as well as descent; source comment ties duplicate holes to invalid missing-count subtraction. Iteration arithmetic assumes decoded arrays already passed overflow checks. (rust/lance-table/src/rowids/serde.rs:41-59)

### Lines 60-78

push_range merges immediate adjacency by extending the last pending end. If previous end>new start, it first flushes pending, covering overlaps and out-of-order segments; it does not reject them. Disjoint ascending ranges accumulate. Numeric ID order is preserved in the resulting segment stream. Comment motivates reducing per-segment storage, but no allocation benchmark appears here. (rust/lance-table/src/rowids/serde.rs:60-78)

### Lines 79-87

flush_ranges asks U64Segment::from_sorted_ranges for a compact segment; Some is pushed, None extends one Range per pending range, then pending.clear retains capacity. Eligibility is at least two ranges, enclosing span fitting u32 and valid HoleRuns gaps; no cost threshold is used (rust/lance-table/src/rowids/segment.rs:245-266). (rust/lance-table/src/rowids/serde.rs:79-87)

### Lines 88-97

TryFrom<pb::RowIdSequence> serializes the already decoded protobuf with encode_to_vec then calls read_row_ids, deliberately sharing folding behavior. This allocates a complete temporary encoded sequence and loses any unknown fields already discarded by prost before entry. It is not a direct per-element conversion. (rust/lance-table/src/rowids/serde.rs:88-97)

### Lines 98-108

TryFrom<pb::U64Segment> plain Range validates bounds/usize length then preserves start/end, including empty range. The conversion returns core Error. (rust/lance-table/src/rowids/serde.rs:98-108)

### Lines 109-131

RangeWithHoles validates range, requires holes message, decodes array, rejects non-strict order with adjacent indices/values, then rejects any hole outside half-open range. It preserves encoded array representation/base; no canonical rebasing or requirement for nonempty holes. Errors are CorruptFile with detailed range/hole context. (rust/lance-table/src/rowids/serde.rs:109-131)

### Lines 132-155

RangeWithBitmap validates bounds/usize length, requires exact ceil(length/8) backing bytes and zero unused high bits of a partial final byte. It then uses unchecked Bitmap::from_parts because those invariants are established. Empty range with empty bitmap is accepted. Error messages include expected/actual bytes or padding requirement. (rust/lance-table/src/rowids/serde.rs:132-155)

### Lines 156-173

SortedArray decodes the array and rejects first duplicate/descent with index/value context. Array merely decodes and permits arbitrary order/duplicates. Missing segment oneof is CorruptFile. Commented non-exhaustive TODO has no runtime arm; current match enumerates generated variants. No cross-segment disjointness or unique-ID check is made here. (rust/lance-table/src/rowids/serde.rs:156-173)

### Lines 174-197

EncodedU16 conversion requires byte multiple2, reads little-endian chunks into Vec<u16>, then checked-adds maximum offset to base, rejecting u64 overflow. Empty offsets accept any base. It does not require offset0 or normalize base; this matters because EncodedU64Array::min returns base directly. (rust/lance-table/src/rowids/serde.rs:174-197)

### Lines 198-214

EncodedU32 repeats width4 little-endian decoding and maximum-offset overflow validation. It retains original base/order/duplicates and accepts empty or noncanonical offsets. Local unwraps operate on exact-width chunks after divisibility check. (rust/lance-table/src/rowids/serde.rs:198-214)

### Lines 215-231

EncodedU64 requires byte multiple8 and decodes each little-endian u64; every u64 value, including MAX, is accepted. Missing array oneof is CorruptFile. Entire offset/value vectors are allocated; no zero-copy packed-byte view or element count cap appears. (rust/lance-table/src/rowids/serde.rs:215-231)

### Lines 232-256

From<RowIdSequence> flattens in-memory Ranges: iterate runs.present_ranges, add enclosing base to each u32 start/end and emit separate protobuf plain Range segments. Other variants become one-element Vec; flat_map collects all. There is no Ranges wire arm. Additions are ordinary unchecked arithmetic; enclosing range end is ignored by this arm, and no payload validation is performed. (rust/lance-table/src/rowids/serde.rs:232-256)

### Lines 257-300

From<U64Segment> writes Range bounds, RangeWithHoles with present array, RangeWithBitmap raw into_bytes, SortedArray and Array through encoded-array conversion. Standalone Ranges is unreachable! and panics with explanation that only sequence serialization handles it. Therefore write_dataset_versions cloning a directly constructed Ranges span into pb::U64Segment can panic (rust/lance-table/src/rowids/version.rs:520-535); this is a source deduction, not an executed case. from_slice/slice/mask indeed do not emit Ranges (rust/lance-table/src/rowids/segment.rs:196-243; rust/lance-table/src/rowids/segment.rs:378-387; rust/lance-table/src/rowids/segment.rs:694-746). (rust/lance-table/src/rowids/serde.rs:257-300)

### Lines 301-339

From<EncodedU64Array> preserves variant/base and packs offsets/values as little-endian bytes. Each element uses to_le_bytes().to_vec() inside flat_map before final collect, creating a tiny temporary Vec in source; compiler optimization is not measured. Input vectors remain owned during borrowed iteration. Writer does not validate overflow, sortedness, canonical base or collection length. (rust/lance-table/src/rowids/serde.rs:301-339)

### Lines 340-345

Public write_row_ids borrows the sequence but clones it entirely, converts to protobuf and encode_to_vec. Returns owned bytes directly with no Result, IO, framing magic, checksum or format version prefix. Cloned storage, protobuf collections and final encoded output can coexist. (rust/lance-table/src/rowids/serde.rs:340-345)

### Lines 346-375

Public read_row_ids walks a borrowed byte slice using prost low-level key/varint decoding and wraps DecodeError as CorruptFile. Every outer key must be field1/LengthDelimited, so unknown top-level fields or wrong wire type are rejected rather than skipped. Length varint is cast as usize without checked conversion, then compared to remaining bytes; on a32-bit target the cast can truncate, a source-only portability observation. Complete segment bytes are borrowed with split_at. (rust/lance-table/src/rowids/serde.rs:346-375)

### Lines 376-400

Each segment tries plain_range; successful ranges accumulate/fold, fallback first flushes pending then prost-decodes U64Segment and invokes validated TryFrom. Final flush precedes checked u64 aggregate sum of segment.len() as u64; overflow reports CorruptFile including segment count. No cross-segment overlap/duplicates or version alignment validation. Fast-path ranges bypass validate_range/usize conversion; segment.len casts range spans to usize before aggregate summation, so32-bit truncation is not prevented here (rust/lance-table/src/rowids/segment.rs:330-344). (rust/lance-table/src/rowids/serde.rs:376-400)

### Lines 401-427

plain_range recognizes only a sole length-delimited Range arm whose nested encoded length equals all remaining bytes. Inner fields must be varint tags1/2; start/end default0, repeated fields overwrite earlier values, unknown/nonvarint fields return None. It returns Some only for start<end; zero/reversed/other shapes fall back to prost conversion. Nested lengths also use unchecked usize casts. No explicit usize fit validation occurs on success. (rust/lance-table/src/rowids/serde.rs:401-427)

### Lines 428-452

cfg(test) imports pretty assertions, proptest and rstest. Byte-exact bitmap fixture creates full length10, clears bit2, uses range100..110, asserts len9, encoded bytes[0xfb,0x03], and protobuf conversion equality. This checks LSB order and zero padding. (rust/lance-table/src/rowids/serde.rs:428-452)

### Lines 453-470

Private read_segment wraps one generated segment in a protobuf sequence then uses public decoder. assert_corrupt_segment requires Error::CorruptFile and a supplied diagnostic substring; it supports malformed-payload tests without relying only on panic/print output. (rust/lance-table/src/rowids/serde.rs:453-470)

### Lines 471-496

Overflow fixture constructs two Range(0..u64MAX) segments, decodes and requires CorruptFile containing total length exceeding u64::MAX. It asserts aggregate overflow rejection; no32-bit target run is recorded. (rust/lance-table/src/rowids/serde.rs:471-496)

### Lines 497-534

Mixed roundtrip combines two leading ranges, holes, one-present-bit bitmap, compressed sorted array and arbitrary[3,1,2]. It expects leading ranges fold to Ranges, all other segments equal original tail and complete values remain identical. It deliberately does not assert structural identity of the whole sequence. (rust/lance-table/src/rowids/serde.rs:497-534)

### Lines 535-607

Properties roundtrip a sorted unique btree_set of arbitrary u64 values with length0..128, compare sequence len and values; generate range lengths1..512 with one-too-short/long bitmaps; generate nonzero high padding; and reversed bitmap ranges. They assert CorruptFile plus relevant message substrings where malformed. Successful arbitrary Array duplicate behavior is covered only indirectly by other examples, not this sorted-unique generator. (rust/lance-table/src/rowids/serde.rs:535-607)

### Lines 608-639

Misaligned-byte property selects width2/4/8 and element_count0..16, appends one byte beyond multiple, wraps as Array and requires CorruptFile containing byte length. This covers every packed representation. (rust/lance-table/src/rowids/serde.rs:608-639)

### Lines 640-662

Offset overflow fixture uses baseu64MAX plus offset1 for both U16/U32 arrays and requires corrupt-file overflow diagnostic. It does not test a legal maximum sum or arbitrary empty base. (rust/lance-table/src/rowids/serde.rs:640-662)

### Lines 663-694

Parameterized holes tests reject descending[6,5], duplicate[5,5], below-range4 and exclusive-end7 for range5..7; separate fixture rejects absent holes array. They use U64 storage for values and verify error variant/message through helper. (rust/lance-table/src/rowids/serde.rs:663-694)

### Lines 695-726

Explicit width-specific misalignment fixtures use byte lengths1/3/7 and assert exact descriptive substrings for widths2/4/8. This overlaps the property with stable diagnostic examples rather than testing only creation failure. (rust/lance-table/src/rowids/serde.rs:695-726)

### Lines 727-767

Parameterized reverse-range fixtures cover plain, holes and bitmap forms with10..9, requiring range start10 exceeds end9. Bitmap length fixtures supply one/three bytes for a nine-position span and require expected2 diagnostic. (rust/lance-table/src/rowids/serde.rs:727-767)

### Lines 768-779

Padding fixture uses range5..14 and bytes[0xff,0x03], where bit9 is beyond the nine logical positions, and requires zero-padding diagnostic. (rust/lance-table/src/rowids/serde.rs:768-779)

### Lines 780-821

SortedArray parameterization rejects descending and duplicate values for each U16/U32/U64 representation. Exact message identifies adjacent indices0/1. It does not test unsorted arbitrary Array rejection because that form intentionally permits order. (rust/lance-table/src/rowids/serde.rs:780-821)

### Lines 822-884

Ranges roundtrip fixture compacts three disjoint intervals, asserts wire is exactly three plain ranges and decode restores sequence/value equality. Mixed fixture checks adjacent ranges merge to one Range, SortedArray interrupts grouping, and three following ranges fold to Ranges. Wire comment claims compatibility with any version, but this fixture runs only current generated protobuf; released historical compatibility remains unverified. No local unknown-field, malformed-varint/length, missing oneof, empty-range, overlapping-order, noncanonical-base or standalone-Ranges panic regression is present. (rust/lance-table/src/rowids/serde.rs:822-884)

## Interaction and interpretation limits

All884 physical lines read in bounded chunks. Segment/array/bitmap/HoleRuns operations are now covered; local RowIdSequence is covered at rust/lance-table/src/rowids.rs:1-2309; dataset integration remains pending. Tests were read, not run; released interoperability and32-bit concerns remain unverified. Source remained read-only.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use crate::{format::pb, rowids::bitmap::Bitmap};
    5 | use lance_core::{Error, Result};
    6 | 
    7 | use super::{RowIdSequence, U64Segment, encoded_array::EncodedU64Array};
    8 | use std::ops::Range;
    9 | 
   10 | use prost::Message;
   11 | use prost::encoding::{WireType, decode_key, decode_varint};
   12 | 
   13 | const ROW_ID_METADATA: &str = "row ID metadata";
   14 | 
   15 | pub(super) fn corrupt_row_id_metadata(message: impl Into<String>) -> Error {
   16 |     Error::corrupt_file_named(ROW_ID_METADATA, message)
   17 | }
   18 | 
   19 | fn validate_range(segment_type: &str, start: u64, end: u64) -> Result<usize> {
   20 |     let len = end.checked_sub(start).ok_or_else(|| {
   21 |         corrupt_row_id_metadata(format!(
   22 |             "{segment_type} range start {start} exceeds end {end}"
   23 |         ))
   24 |     })?;
   25 |     usize::try_from(len).map_err(|_| {
   26 |         corrupt_row_id_metadata(format!(
   27 |             "{segment_type} range length {len} for start {start} and end {end} exceeds usize::MAX"
   28 |         ))
   29 |     })
   30 | }
   31 | 
   32 | fn validate_packed_array_length(array_type: &str, byte_len: usize, width: usize) -> Result<()> {
   33 |     if !byte_len.is_multiple_of(width) {
   34 |         return Err(corrupt_row_id_metadata(format!(
   35 |             "encoded {array_type} array byte length {byte_len} is not a multiple of element width {width}"
   36 |         )));
   37 |     }
   38 |     Ok(())
   39 | }
   40 | 
   41 | /// Find the first pair of neighbours that is not strictly increasing.
   42 | ///
   43 | /// Both `RangeWithHoles` holes and `SortedArray` values are documented as
   44 | /// strictly increasing, so equal neighbours are as corrupt as descending ones:
   45 | /// `SegmentStats::n_holes` derives the hole count by subtracting the value
   46 | /// count from the slot span, which underflows once a value is repeated.
   47 | fn first_non_increasing_pair(array: &EncodedU64Array) -> Option<(usize, u64, u64)> {
   48 |     let mut values = array.iter();
   49 |     let previous = values.next()?;
   50 |     values
   51 |         .scan(previous, |previous, value| {
   52 |             let pair = (*previous, value);
   53 |             *previous = value;
   54 |             Some(pair)
   55 |         })
   56 |         .enumerate()
   57 |         .find_map(|(index, (previous, next))| (previous >= next).then_some((index, previous, next)))
   58 | }
   59 | 
   60 | /// Add a non-empty range to the run of consecutive, sorted, disjoint `Range`
   61 | /// segments being folded into one [`U64Segment::Ranges`], merging an adjacent
   62 | /// one and flushing the run first when `range` does not continue it.
   63 | ///
   64 | /// A table whose deletions cluster is written as many small `Range` segments
   65 | /// (see `RowIdSequence::use_range_segments`). Kept as separate segments they
   66 | /// would cost a heap-allocated enum each and linear scans in every lookup;
   67 | /// folded, they are two `u32` per range and a binary search.
   68 | fn push_range(pending: &mut Vec<Range<u64>>, out: &mut Vec<U64Segment>, range: Range<u64>) {
   69 |     match pending.last_mut() {
   70 |         Some(last) if last.end == range.start => last.end = range.end,
   71 |         Some(last) if last.end > range.start => {
   72 |             flush_ranges(pending, out);
   73 |             pending.push(range);
   74 |         }
   75 |         _ => pending.push(range),
   76 |     }
   77 | }
   78 | 
   79 | fn flush_ranges(pending: &mut Vec<Range<u64>>, out: &mut Vec<U64Segment>) {
   80 |     match U64Segment::from_sorted_ranges(pending.as_slice()) {
   81 |         Some(segment) => out.push(segment),
   82 |         // A single range, or a run wider than the compact form can index.
   83 |         None => out.extend(pending.iter().cloned().map(U64Segment::Range)),
   84 |     }
   85 |     pending.clear();
   86 | }
   87 | 
   88 | impl TryFrom<pb::RowIdSequence> for RowIdSequence {
   89 |     type Error = Error;
   90 | 
   91 |     /// Goes through [`read_row_ids`] so the proto and wire paths fold `Range`
   92 |     /// runs the same way.
   93 |     fn try_from(pb: pb::RowIdSequence) -> Result<Self> {
   94 |         read_row_ids(&pb.encode_to_vec())
   95 |     }
   96 | }
   97 | 
   98 | impl TryFrom<pb::U64Segment> for U64Segment {
   99 |     type Error = Error;
  100 | 
  101 |     fn try_from(pb: pb::U64Segment) -> Result<Self> {
  102 |         use pb::u64_segment as pb_seg;
  103 |         use pb::u64_segment::Segment::*;
  104 |         match pb.segment {
  105 |             Some(Range(pb_seg::Range { start, end })) => {
  106 |                 validate_range("Range", start, end)?;
  107 |                 Ok(Self::Range(start..end))
  108 |             }
  109 |             Some(RangeWithHoles(pb_seg::RangeWithHoles { start, end, holes })) => {
  110 |                 validate_range("RangeWithHoles", start, end)?;
  111 |                 let holes = holes
  112 |                     .ok_or_else(|| {
  113 |                         corrupt_row_id_metadata("RangeWithHoles is missing its holes array")
  114 |                     })?
  115 |                     .try_into()?;
  116 |                 if let Some((index, previous, next)) = first_non_increasing_pair(&holes) {
  117 |                     return Err(corrupt_row_id_metadata(format!(
  118 |                         "RangeWithHoles values are not strictly increasing at indices {index} and {}: {previous} is not less than {next}",
  119 |                         index + 1
  120 |                     )));
  121 |                 }
  122 |                 if let Some(hole) = holes.iter().find(|hole| *hole < start || *hole >= end) {
  123 |                     return Err(corrupt_row_id_metadata(format!(
  124 |                         "RangeWithHoles hole {hole} is outside the range {start}..{end}"
  125 |                     )));
  126 |                 }
  127 |                 Ok(Self::RangeWithHoles {
  128 |                     range: start..end,
  129 |                     holes,
  130 |                 })
  131 |             }
  132 |             Some(RangeWithBitmap(pb_seg::RangeWithBitmap { start, end, bitmap })) => {
  133 |                 let range_len = validate_range("RangeWithBitmap", start, end)?;
  134 |                 let expected_bitmap_len = range_len.div_ceil(8);
  135 |                 if bitmap.len() != expected_bitmap_len {
  136 |                     return Err(corrupt_row_id_metadata(format!(
  137 |                         "RangeWithBitmap byte length {} does not match expected {expected_bitmap_len} for range start {start}, end {end}, and length {range_len}",
  138 |                         bitmap.len()
  139 |                     )));
  140 |                 }
  141 |                 let remainder = range_len % 8;
  142 |                 if remainder != 0 {
  143 |                     let padding_mask = !((1_u8 << remainder) - 1);
  144 |                     let last_byte = bitmap[expected_bitmap_len - 1];
  145 |                     if last_byte & padding_mask != 0 {
  146 |                         return Err(corrupt_row_id_metadata(format!(
  147 |                             "RangeWithBitmap padding bits must be zero for range start {start}, end {end}, and length {range_len}: last byte {last_byte:#04x} has padding mask {padding_mask:#04x} set"
  148 |                         )));
  149 |                     }
  150 |                 }
  151 |                 Ok(Self::RangeWithBitmap {
  152 |                     range: start..end,
  153 |                     bitmap: Bitmap::from_parts(bitmap, range_len),
  154 |                 })
  155 |             }
  156 |             Some(SortedArray(array)) => {
  157 |                 let array = EncodedU64Array::try_from(array)?;
  158 |                 if let Some((index, previous, next)) = first_non_increasing_pair(&array) {
  159 |                     return Err(corrupt_row_id_metadata(format!(
  160 |                         "SortedArray values are not strictly increasing at indices {index} and {}: {previous} is not less than {next}",
  161 |                         index + 1
  162 |                     )));
  163 |                 }
  164 |                 Ok(Self::SortedArray(array))
  165 |             }
  166 |             Some(Array(array)) => Ok(Self::Array(EncodedU64Array::try_from(array)?)),
  167 |             // TODO: why non-exhaustive?
  168 |             // Some(_) => Err(Error::invalid_input("unknown segment type")),
  169 |             None => Err(corrupt_row_id_metadata("missing row ID segment type")),
  170 |         }
  171 |     }
  172 | }
  173 | 
  174 | impl TryFrom<pb::EncodedU64Array> for EncodedU64Array {
  175 |     type Error = Error;
  176 | 
  177 |     fn try_from(pb: pb::EncodedU64Array) -> Result<Self> {
  178 |         use pb::encoded_u64_array as pb_arr;
  179 |         use pb::encoded_u64_array::Array::*;
  180 |         match pb.array {
  181 |             Some(U16Array(pb_arr::U16Array { base, offsets })) => {
  182 |                 validate_packed_array_length("u16", offsets.len(), 2)?;
  183 |                 let offsets = offsets
  184 |                     .as_chunks::<2>()
  185 |                     .0
  186 |                     .iter()
  187 |                     .map(|chunk| u16::from_le_bytes(*chunk))
  188 |                     .collect::<Vec<_>>();
  189 |                 if let Some(max_offset) = offsets.iter().copied().max()
  190 |                     && base.checked_add(u64::from(max_offset)).is_none()
  191 |                 {
  192 |                     return Err(corrupt_row_id_metadata(format!(
  193 |                         "U16Array base {base} plus maximum offset {max_offset} overflows u64"
  194 |                     )));
  195 |                 }
  196 |                 Ok(Self::U16 { base, offsets })
  197 |             }
  198 |             Some(U32Array(pb_arr::U32Array { base, offsets })) => {
  199 |                 validate_packed_array_length("u32", offsets.len(), 4)?;
  200 |                 let offsets = offsets
  201 |                     .as_chunks::<4>()
  202 |                     .0
  203 |                     .iter()
  204 |                     .map(|chunk| u32::from_le_bytes(*chunk))
  205 |                     .collect::<Vec<_>>();
  206 |                 if let Some(max_offset) = offsets.iter().copied().max()
  207 |                     && base.checked_add(u64::from(max_offset)).is_none()
  208 |                 {
  209 |                     return Err(corrupt_row_id_metadata(format!(
  210 |                         "U32Array base {base} plus maximum offset {max_offset} overflows u64"
  211 |                     )));
  212 |                 }
  213 |                 Ok(Self::U32 { base, offsets })
  214 |             }
  215 |             Some(U64Array(pb_arr::U64Array { values })) => {
  216 |                 validate_packed_array_length("u64", values.len(), 8)?;
  217 |                 let values = values
  218 |                     .as_chunks::<8>()
  219 |                     .0
  220 |                     .iter()
  221 |                     .map(|chunk| u64::from_le_bytes(*chunk))
  222 |                     .collect();
  223 |                 Ok(Self::U64(values))
  224 |             }
  225 |             // TODO: shouldn't this enum be non-exhaustive?
  226 |             // Some(_) => Err(Error::invalid_input("unknown array type")),
  227 |             None => Err(corrupt_row_id_metadata("missing encoded row ID array type")),
  228 |         }
  229 |     }
  230 | }
  231 | 
  232 | impl From<RowIdSequence> for pb::RowIdSequence {
  233 |     fn from(sequence: RowIdSequence) -> Self {
  234 |         let segments = sequence
  235 |             .0
  236 |             .into_iter()
  237 |             .flat_map(|segment| match segment {
  238 |                 // On the wire a run of ranges is just its `Range` segments, which
  239 |                 // every reader understands; `read_row_ids` folds them back
  240 |                 // together.
  241 |                 U64Segment::Ranges { range, runs } => runs
  242 |                     .present_ranges()
  243 |                     .map(|present| {
  244 |                         U64Segment::Range(
  245 |                             range.start + present.start as u64..range.start + present.end as u64,
  246 |                         )
  247 |                     })
  248 |                     .map(pb::U64Segment::from)
  249 |                     .collect::<Vec<_>>(),
  250 |                 other => vec![pb::U64Segment::from(other)],
  251 |             })
  252 |             .collect();
  253 |         Self { segments }
  254 |     }
  255 | }
  256 | 
  257 | impl From<U64Segment> for pb::U64Segment {
  258 |     fn from(segment: U64Segment) -> Self {
  259 |         match segment {
  260 |             U64Segment::Range(range) => Self {
  261 |                 segment: Some(pb::u64_segment::Segment::Range(pb::u64_segment::Range {
  262 |                     start: range.start,
  263 |                     end: range.end,
  264 |                 })),
  265 |             },
  266 |             U64Segment::RangeWithHoles { range, holes } => Self {
  267 |                 segment: Some(pb::u64_segment::Segment::RangeWithHoles(
  268 |                     pb::u64_segment::RangeWithHoles {
  269 |                         start: range.start,
  270 |                         end: range.end,
  271 |                         holes: Some(holes.into()),
  272 |                     },
  273 |                 )),
  274 |             },
  275 |             U64Segment::RangeWithBitmap { range, bitmap } => Self {
  276 |                 segment: Some(pb::u64_segment::Segment::RangeWithBitmap(
  277 |                     pb::u64_segment::RangeWithBitmap {
  278 |                         start: range.start,
  279 |                         end: range.end,
  280 |                         bitmap: bitmap.into_bytes(),
  281 |                     },
  282 |                 )),
  283 |             },
  284 |             // A run of ranges has no message of its own: `pb::RowIdSequence`
  285 |             // writes it as its `Range` segments. Nothing else produces this
  286 |             // variant (`from_slice`, `mask` and `slice` never pick it), so a
  287 |             // standalone conversion is a caller bug rather than an encoding.
  288 |             U64Segment::Ranges { .. } => {
  289 |                 unreachable!("U64Segment::Ranges is only serialized as part of a RowIdSequence")
  290 |             }
  291 |             U64Segment::SortedArray(array) => Self {
  292 |                 segment: Some(pb::u64_segment::Segment::SortedArray(array.into())),
  293 |             },
  294 |             U64Segment::Array(array) => Self {
  295 |                 segment: Some(pb::u64_segment::Segment::Array(array.into())),
  296 |             },
  297 |         }
  298 |     }
  299 | }
  300 | 
  301 | impl From<EncodedU64Array> for pb::EncodedU64Array {
  302 |     fn from(array: EncodedU64Array) -> Self {
  303 |         match array {
  304 |             EncodedU64Array::U16 { base, offsets } => Self {
  305 |                 array: Some(pb::encoded_u64_array::Array::U16Array(
  306 |                     pb::encoded_u64_array::U16Array {
  307 |                         base,
  308 |                         offsets: offsets
  309 |                             .iter()
  310 |                             .flat_map(|&offset| offset.to_le_bytes().to_vec())
  311 |                             .collect(),
  312 |                     },
  313 |                 )),
  314 |             },
  315 |             EncodedU64Array::U32 { base, offsets } => Self {
  316 |                 array: Some(pb::encoded_u64_array::Array::U32Array(
  317 |                     pb::encoded_u64_array::U32Array {
  318 |                         base,
  319 |                         offsets: offsets
  320 |                             .iter()
  321 |                             .flat_map(|&offset| offset.to_le_bytes().to_vec())
  322 |                             .collect(),
  323 |                     },
  324 |                 )),
  325 |             },
  326 |             EncodedU64Array::U64(values) => Self {
  327 |                 array: Some(pb::encoded_u64_array::Array::U64Array(
  328 |                     pb::encoded_u64_array::U64Array {
  329 |                         values: values
  330 |                             .iter()
  331 |                             .flat_map(|&value| value.to_le_bytes().to_vec())
  332 |                             .collect(),
  333 |                     },
  334 |                 )),
  335 |             },
  336 |         }
  337 |     }
  338 | }
  339 | 
  340 | /// Serialize a rowid sequence to a buffer.
  341 | pub fn write_row_ids(sequence: &RowIdSequence) -> Vec<u8> {
  342 |     let pb_sequence = pb::RowIdSequence::from(sequence.clone());
  343 |     pb_sequence.encode_to_vec()
  344 | }
  345 | 
  346 | /// Deserialize a rowid sequence from some bytes.
  347 | ///
  348 | /// Walks the `RowIdSequence` wire format directly: a sequence written as
  349 | /// `Range` segments can hold tens of millions of them, and decoding through
  350 | /// `pb::RowIdSequence` would materialize a proto message per segment before
  351 | /// folding. Plain `Range` segments are read straight into the fold, everything
  352 | /// else goes through prost.
  353 | pub fn read_row_ids(mut buf: &[u8]) -> Result<RowIdSequence> {
  354 |     let corrupt = |error: prost::DecodeError| {
  355 |         corrupt_row_id_metadata(format!("failed to decode row ID sequence: {error}"))
  356 |     };
  357 |     let mut segments = Vec::new();
  358 |     let mut pending: Vec<Range<u64>> = Vec::new();
  359 |     while !buf.is_empty() {
  360 |         let (field, wire_type) = decode_key(&mut buf).map_err(corrupt)?;
  361 |         if field != 1 || wire_type != WireType::LengthDelimited {
  362 |             return Err(corrupt_row_id_metadata(format!(
  363 |                 "unexpected field {field} with wire type {wire_type:?} in row ID sequence"
  364 |             )));
  365 |         }
  366 |         let len = decode_varint(&mut buf).map_err(corrupt)? as usize;
  367 |         if len > buf.len() {
  368 |             return Err(corrupt_row_id_metadata(format!(
  369 |                 "row ID segment of {len} bytes exceeds the {} remaining",
  370 |                 buf.len()
  371 |             )));
  372 |         }
  373 |         let (segment, rest) = buf.split_at(len);
  374 |         buf = rest;
  375 |         match plain_range(segment) {
  376 |             Some(range) => push_range(&mut pending, &mut segments, range),
  377 |             None => {
  378 |                 flush_ranges(&mut pending, &mut segments);
  379 |                 let segment = pb::U64Segment::decode(segment).map_err(corrupt)?;
  380 |                 segments.push(U64Segment::try_from(segment)?);
  381 |             }
  382 |         }
  383 |     }
  384 |     flush_ranges(&mut pending, &mut segments);
  385 |     // Each segment length fits a usize on its own, but the total need not fit a u64.
  386 |     // Reject that here so `RowIdSequence::len()` stays total for anything decoded.
  387 |     segments
  388 |         .iter()
  389 |         .try_fold(0_u64, |total, segment| {
  390 |             total.checked_add(segment.len() as u64)
  391 |         })
  392 |         .ok_or_else(|| {
  393 |             corrupt_row_id_metadata(format!(
  394 |                 "row ID sequence of {} segments has a total length exceeding u64::MAX",
  395 |                 segments.len()
  396 |             ))
  397 |         })?;
  398 |     Ok(RowIdSequence(segments))
  399 | }
  400 | 
  401 | /// The non-empty range of a serialized `U64Segment` that holds nothing but a
  402 | /// `Range`; `None` for any other shape, which prost decodes instead.
  403 | fn plain_range(mut bytes: &[u8]) -> Option<Range<u64>> {
  404 |     let (field, wire_type) = decode_key(&mut bytes).ok()?;
  405 |     if field != 1 || wire_type != WireType::LengthDelimited {
  406 |         return None;
  407 |     }
  408 |     let len = decode_varint(&mut bytes).ok()? as usize;
  409 |     if len != bytes.len() {
  410 |         return None;
  411 |     }
  412 |     let (mut start, mut end) = (0_u64, 0_u64);
  413 |     while !bytes.is_empty() {
  414 |         let (field, wire_type) = decode_key(&mut bytes).ok()?;
  415 |         if wire_type != WireType::Varint {
  416 |             return None;
  417 |         }
  418 |         let value = decode_varint(&mut bytes).ok()?;
  419 |         match field {
  420 |             1 => start = value,
  421 |             2 => end = value,
  422 |             _ => return None,
  423 |         }
  424 |     }
  425 |     (start < end).then_some(start..end)
  426 | }
  427 | 
  428 | #[cfg(test)]
  429 | mod test {
  430 |     use pretty_assertions::assert_eq;
  431 |     use proptest::prelude::*;
  432 |     use rstest::rstest;
  433 | 
  434 |     use super::*;
  435 | 
  436 |     #[test]
  437 |     fn test_bitmap_serialization_is_byte_exact() {
  438 |         let mut bitmap = Bitmap::new_full(10);
  439 |         bitmap.clear(2);
  440 |         let segment = U64Segment::RangeWithBitmap {
  441 |             range: 100..110,
  442 |             bitmap,
  443 |         };
  444 |         assert_eq!(segment.len(), 9);
  445 | 
  446 |         let serialized = pb::U64Segment::from(segment.clone());
  447 |         let Some(pb::u64_segment::Segment::RangeWithBitmap(encoded)) = &serialized.segment else {
  448 |             panic!("expected bitmap segment");
  449 |         };
  450 |         assert_eq!(encoded.bitmap, vec![0xfb, 0x03]);
  451 |         assert_eq!(U64Segment::try_from(serialized).unwrap(), segment);
  452 |     }
  453 |     fn read_segment(segment: pb::u64_segment::Segment) -> Result<RowIdSequence> {
  454 |         let sequence = pb::RowIdSequence {
  455 |             segments: vec![pb::U64Segment {
  456 |                 segment: Some(segment),
  457 |             }],
  458 |         };
  459 |         read_row_ids(&sequence.encode_to_vec())
  460 |     }
  461 | 
  462 |     fn assert_corrupt_segment(segment: pb::u64_segment::Segment, expected_message: &str) {
  463 |         let error = read_segment(segment).unwrap_err();
  464 |         assert!(matches!(&error, Error::CorruptFile { .. }));
  465 |         assert!(
  466 |             error.to_string().contains(expected_message),
  467 |             "expected error containing {expected_message:?}, got {error}"
  468 |         );
  469 |     }
  470 | 
  471 |     /// Each segment length fits a usize, but the aggregate does not fit a u64. Accepting
  472 |     /// this would leave `RowIdSequence::len()` overflowing for callers such as
  473 |     /// `Dataset::validate()`.
  474 |     #[test]
  475 |     fn test_reject_sequence_length_overflow() {
  476 |         let segment = || pb::U64Segment {
  477 |             segment: Some(pb::u64_segment::Segment::Range(pb::u64_segment::Range {
  478 |                 start: 0,
  479 |                 end: u64::MAX,
  480 |             })),
  481 |         };
  482 |         let sequence = pb::RowIdSequence {
  483 |             segments: vec![segment(), segment()],
  484 |         };
  485 | 
  486 |         let error = read_row_ids(&sequence.encode_to_vec()).unwrap_err();
  487 |         assert!(matches!(&error, Error::CorruptFile { .. }));
  488 |         assert!(
  489 |             error
  490 |                 .to_string()
  491 |                 .contains("total length exceeding u64::MAX"),
  492 |             "got {error}"
  493 |         );
  494 |     }
  495 | 
  496 |     #[test]
  497 |     fn test_write_read_row_ids() {
  498 |         let mut sequence = RowIdSequence::from(0..20);
  499 |         sequence.0.push(U64Segment::Range(30..100));
  500 |         sequence.0.push(U64Segment::RangeWithHoles {
  501 |             range: 100..200,
  502 |             holes: EncodedU64Array::U64(vec![104, 108, 150]),
  503 |         });
  504 |         let mut bitmap = Bitmap::new_empty(100);
  505 |         bitmap.set(99);
  506 |         sequence.0.push(U64Segment::RangeWithBitmap {
  507 |             range: 200..300,
  508 |             bitmap,
  509 |         });
  510 |         sequence
  511 |             .0
  512 |             .push(U64Segment::SortedArray(EncodedU64Array::U16 {
  513 |                 base: 200,
  514 |                 offsets: vec![1, 2, 3],
  515 |             }));
  516 |         sequence
  517 |             .0
  518 |             .push(U64Segment::Array(EncodedU64Array::U64(vec![3, 1, 2])));
  519 | 
  520 |         let serialized = write_row_ids(&sequence);
  521 | 
  522 |         let sequence2 = read_row_ids(&serialized).unwrap();
  523 | 
  524 |         // Decoding folds the two leading `Range` segments into one `Ranges`
  525 |         // segment; everything else round-trips unchanged.
  526 |         assert!(matches!(sequence2.0[0], U64Segment::Ranges { .. }));
  527 |         assert_eq!(&sequence2.0[1..], &sequence.0[2..]);
  528 |         assert_eq!(
  529 |             sequence2.iter().collect::<Vec<_>>(),
  530 |             sequence.iter().collect::<Vec<_>>()
  531 |         );
  532 |     }
  533 | 
  534 |     proptest! {
  535 |         #[test]
  536 |         fn test_row_id_sequence_len_round_trips(
  537 |             values in proptest::collection::btree_set(any::<u64>(), 0..128)
  538 |         ) {
  539 |             let values = values.into_iter().collect::<Vec<_>>();
  540 |             let sequence = RowIdSequence::from(values.as_slice());
  541 |             let deserialized = read_row_ids(&write_row_ids(&sequence)).unwrap();
  542 | 
  543 |             prop_assert_eq!(deserialized.len(), sequence.len());
  544 |             prop_assert_eq!(deserialized.iter().collect::<Vec<_>>(), values);
  545 |         }
  546 | 
  547 |         #[test]
  548 |         fn test_rejects_wrong_range_with_bitmap_length(
  549 |             range_len in 1usize..512,
  550 |         ) {
  551 |             let expected_len = range_len.div_ceil(8);
  552 |             for actual_len in [expected_len - 1, expected_len + 1] {
  553 |                 let segment = pb::u64_segment::Segment::RangeWithBitmap(
  554 |                     pb::u64_segment::RangeWithBitmap {
  555 |                         start: 0,
  556 |                         end: range_len as u64,
  557 |                         bitmap: vec![0; actual_len],
  558 |                     },
  559 |                 );
  560 | 
  561 |                 let error = read_segment(segment).unwrap_err();
  562 |                 let is_corrupt_file = matches!(&error, Error::CorruptFile { .. });
  563 |                 prop_assert!(is_corrupt_file);
  564 |                 prop_assert!(error.to_string().contains("byte length"));
  565 |             }
  566 |         }
  567 | 
  568 |         #[test]
  569 |         fn test_rejects_range_with_bitmap_padding_bits(
  570 |             full_bytes in 0usize..64,
  571 |             valid_bits in 1usize..8,
  572 |         ) {
  573 |             let range_len = full_bytes * 8 + valid_bits;
  574 |             let mut bitmap = vec![0; full_bytes + 1];
  575 |             bitmap[full_bytes] = 1 << valid_bits;
  576 |             let segment = pb::u64_segment::Segment::RangeWithBitmap(
  577 |                 pb::u64_segment::RangeWithBitmap {
  578 |                     start: 0,
  579 |                     end: range_len as u64,
  580 |                     bitmap,
  581 |                 },
  582 |             );
  583 | 
  584 |             let error = read_segment(segment).unwrap_err();
  585 |             let is_corrupt_file = matches!(&error, Error::CorruptFile { .. });
  586 |             prop_assert!(is_corrupt_file);
  587 |             prop_assert!(error.to_string().contains("padding bits must be zero"));
  588 |         }
  589 | 
  590 |         #[test]
  591 |         fn test_rejects_reversed_range_with_bitmap(
  592 |             start in 1u64..u64::MAX,
  593 |         ) {
  594 |             let segment = pb::u64_segment::Segment::RangeWithBitmap(
  595 |                 pb::u64_segment::RangeWithBitmap {
  596 |                     start,
  597 |                     end: start - 1,
  598 |                     bitmap: Vec::new(),
  599 |                 },
  600 |             );
  601 | 
  602 |             let error = read_segment(segment).unwrap_err();
  603 |             let is_corrupt_file = matches!(&error, Error::CorruptFile { .. });
  604 |             prop_assert!(is_corrupt_file);
  605 |             prop_assert!(error.to_string().contains("range start"));
  606 |         }
  607 | 
  608 |         #[test]
  609 |         fn test_rejects_misaligned_encoded_array_bytes(
  610 |             encoding in 0u8..3,
  611 |             element_count in 0usize..16,
  612 |         ) {
  613 |             let width = match encoding {
  614 |                 0 => 2,
  615 |                 1 => 4,
  616 |                 _ => 8,
  617 |             };
  618 |             let bytes = vec![0; element_count * width + 1];
  619 |             let array = match encoding {
  620 |                 0 => pb::encoded_u64_array::Array::U16Array(
  621 |                     pb::encoded_u64_array::U16Array { base: 0, offsets: bytes },
  622 |                 ),
  623 |                 1 => pb::encoded_u64_array::Array::U32Array(
  624 |                     pb::encoded_u64_array::U32Array { base: 0, offsets: bytes },
  625 |                 ),
  626 |                 _ => pb::encoded_u64_array::Array::U64Array(
  627 |                     pb::encoded_u64_array::U64Array { values: bytes },
  628 |                 ),
  629 |             };
  630 |             let segment = pb::u64_segment::Segment::Array(pb::EncodedU64Array {
  631 |                 array: Some(array),
  632 |             });
  633 | 
  634 |             let error = read_segment(segment).unwrap_err();
  635 |             let is_corrupt_file = matches!(&error, Error::CorruptFile { .. });
  636 |             prop_assert!(is_corrupt_file);
  637 |             prop_assert!(error.to_string().contains("byte length"));
  638 |         }
  639 |     }
  640 | 
  641 |     #[test]
  642 |     fn test_rejects_encoded_offset_overflow() {
  643 |         use pb::encoded_u64_array as pb_array;
  644 | 
  645 |         let arrays = [
  646 |             pb_array::Array::U16Array(pb_array::U16Array {
  647 |                 base: u64::MAX,
  648 |                 offsets: 1u16.to_le_bytes().to_vec(),
  649 |             }),
  650 |             pb_array::Array::U32Array(pb_array::U32Array {
  651 |                 base: u64::MAX,
  652 |                 offsets: 1u32.to_le_bytes().to_vec(),
  653 |             }),
  654 |         ];
  655 |         for array in arrays {
  656 |             assert_corrupt_segment(
  657 |                 pb::u64_segment::Segment::Array(pb::EncodedU64Array { array: Some(array) }),
  658 |                 "overflows u64",
  659 |             );
  660 |         }
  661 |     }
  662 | 
  663 |     #[rstest]
  664 |     #[case::descending(vec![6, 5], "not strictly increasing")]
  665 |     #[case::duplicate(vec![5, 5], "not strictly increasing")]
  666 |     #[case::below_range(vec![4], "outside the range")]
  667 |     #[case::at_end(vec![7], "outside the range")]
  668 |     fn test_rejects_invalid_range_with_holes(#[case] values: Vec<u64>, #[case] message: &str) {
  669 |         let values = values.into_iter().flat_map(u64::to_le_bytes).collect();
  670 |         assert_corrupt_segment(
  671 |             pb::u64_segment::Segment::RangeWithHoles(pb::u64_segment::RangeWithHoles {
  672 |                 start: 5,
  673 |                 end: 7,
  674 |                 holes: Some(pb::EncodedU64Array {
  675 |                     array: Some(pb::encoded_u64_array::Array::U64Array(
  676 |                         pb::encoded_u64_array::U64Array { values },
  677 |                     )),
  678 |                 }),
  679 |             }),
  680 |             message,
  681 |         );
  682 |     }
  683 | 
  684 |     #[test]
  685 |     fn test_rejects_missing_range_with_holes_array() {
  686 |         assert_corrupt_segment(
  687 |             pb::u64_segment::Segment::RangeWithHoles(pb::u64_segment::RangeWithHoles {
  688 |                 start: 5,
  689 |                 end: 7,
  690 |                 holes: None,
  691 |             }),
  692 |             "missing its holes array",
  693 |         );
  694 |     }
  695 | 
  696 |     #[rstest]
  697 |     #[case::u16(
  698 |         pb::encoded_u64_array::Array::U16Array(pb::encoded_u64_array::U16Array {
  699 |             base: 0,
  700 |             offsets: vec![1],
  701 |         }),
  702 |         "encoded u16 array byte length 1 is not a multiple of element width 2"
  703 |     )]
  704 |     #[case::u32(
  705 |         pb::encoded_u64_array::Array::U32Array(pb::encoded_u64_array::U32Array {
  706 |             base: 0,
  707 |             offsets: vec![1, 2, 3],
  708 |         }),
  709 |         "encoded u32 array byte length 3 is not a multiple of element width 4"
  710 |     )]
  711 |     #[case::u64(
  712 |         pb::encoded_u64_array::Array::U64Array(pb::encoded_u64_array::U64Array {
  713 |             values: vec![1, 2, 3, 4, 5, 6, 7],
  714 |         }),
  715 |         "encoded u64 array byte length 7 is not a multiple of element width 8"
  716 |     )]
  717 |     fn test_rejects_misaligned_encoded_array(
  718 |         #[case] array: pb::encoded_u64_array::Array,
  719 |         #[case] message: &str,
  720 |     ) {
  721 |         assert_corrupt_segment(
  722 |             pb::u64_segment::Segment::Array(pb::EncodedU64Array { array: Some(array) }),
  723 |             message,
  724 |         );
  725 |     }
  726 | 
  727 |     #[rstest]
  728 |     #[case::range(pb::u64_segment::Segment::Range(pb::u64_segment::Range {
  729 |         start: 10,
  730 |         end: 9,
  731 |     }))]
  732 |     #[case::range_with_holes(pb::u64_segment::Segment::RangeWithHoles(
  733 |         pb::u64_segment::RangeWithHoles {
  734 |             start: 10,
  735 |             end: 9,
  736 |             holes: Some(pb::EncodedU64Array {
  737 |                 array: Some(pb::encoded_u64_array::Array::U64Array(
  738 |                     pb::encoded_u64_array::U64Array { values: Vec::new() },
  739 |                 )),
  740 |             }),
  741 |         }
  742 |     ))]
  743 |     #[case::range_with_bitmap(pb::u64_segment::Segment::RangeWithBitmap(
  744 |         pb::u64_segment::RangeWithBitmap {
  745 |             start: 10,
  746 |             end: 9,
  747 |             bitmap: Vec::new(),
  748 |         }
  749 |     ))]
  750 |     fn test_rejects_reversed_range(#[case] segment: pb::u64_segment::Segment) {
  751 |         assert_corrupt_segment(segment, "range start 10 exceeds end 9");
  752 |     }
  753 | 
  754 |     #[rstest]
  755 |     #[case::short(vec![0])]
  756 |     #[case::long(vec![0, 0, 0])]
  757 |     fn test_rejects_incorrect_bitmap_length(#[case] bitmap: Vec<u8>) {
  758 |         assert_corrupt_segment(
  759 |             pb::u64_segment::Segment::RangeWithBitmap(pb::u64_segment::RangeWithBitmap {
  760 |                 start: 5,
  761 |                 end: 14,
  762 |                 bitmap,
  763 |             }),
  764 |             "does not match expected 2 for range start 5, end 14, and length 9",
  765 |         );
  766 |     }
  767 | 
  768 |     #[test]
  769 |     fn test_rejects_set_bitmap_padding_bits() {
  770 |         assert_corrupt_segment(
  771 |             pb::u64_segment::Segment::RangeWithBitmap(pb::u64_segment::RangeWithBitmap {
  772 |                 start: 5,
  773 |                 end: 14,
  774 |                 bitmap: vec![0xff, 0x03],
  775 |             }),
  776 |             "padding bits must be zero",
  777 |         );
  778 |     }
  779 | 
  780 |     #[rstest]
  781 |     #[case::u16_descending(pb::encoded_u64_array::Array::U16Array(
  782 |         pb::encoded_u64_array::U16Array {
  783 |             base: 100,
  784 |             offsets: vec![2, 0, 1, 0],
  785 |         }
  786 |     ))]
  787 |     #[case::u32_descending(pb::encoded_u64_array::Array::U32Array(
  788 |         pb::encoded_u64_array::U32Array {
  789 |             base: 100,
  790 |             offsets: vec![2, 0, 0, 0, 1, 0, 0, 0],
  791 |         }
  792 |     ))]
  793 |     #[case::u64_descending(pb::encoded_u64_array::Array::U64Array(
  794 |         pb::encoded_u64_array::U64Array {
  795 |             values: vec![2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  796 |         }
  797 |     ))]
  798 |     #[case::u16_duplicate(pb::encoded_u64_array::Array::U16Array(
  799 |         pb::encoded_u64_array::U16Array {
  800 |             base: 100,
  801 |             offsets: vec![5, 0, 5, 0],
  802 |         }
  803 |     ))]
  804 |     #[case::u32_duplicate(pb::encoded_u64_array::Array::U32Array(
  805 |         pb::encoded_u64_array::U32Array {
  806 |             base: 100,
  807 |             offsets: vec![5, 0, 0, 0, 5, 0, 0, 0],
  808 |         }
  809 |     ))]
  810 |     #[case::u64_duplicate(pb::encoded_u64_array::Array::U64Array(
  811 |         pb::encoded_u64_array::U64Array {
  812 |             values: vec![5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0],
  813 |         }
  814 |     ))]
  815 |     fn test_rejects_unsorted_sorted_array(#[case] array: pb::encoded_u64_array::Array) {
  816 |         assert_corrupt_segment(
  817 |             pb::u64_segment::Segment::SortedArray(pb::EncodedU64Array { array: Some(array) }),
  818 |             "SortedArray values are not strictly increasing at indices 0 and 1",
  819 |         );
  820 |     }
  821 | 
  822 |     #[test]
  823 |     fn test_ranges_are_written_as_range_segments_and_folded_back() {
  824 |         // 1000..1100, 1300..1500, 1650..2000 as one compact segment.
  825 |         let ranges = vec![1000..1100, 1300..1500, 1650..2000];
  826 |         let sequence = RowIdSequence(vec![U64Segment::from_sorted_ranges(&ranges).unwrap()]);
  827 |         let encoded = write_row_ids(&sequence);
  828 | 
  829 |         // On the wire: three plain `Range` segments, readable by any version.
  830 |         let wire = pb::RowIdSequence::decode(encoded.as_slice()).unwrap();
  831 |         let wire_ranges: Vec<Range<u64>> = wire
  832 |             .segments
  833 |             .iter()
  834 |             .map(|segment| match &segment.segment {
  835 |                 Some(pb::u64_segment::Segment::Range(range)) => range.start..range.end,
  836 |                 other => panic!("expected a Range segment, got {other:?}"),
  837 |             })
  838 |             .collect();
  839 |         assert_eq!(wire_ranges, ranges);
  840 | 
  841 |         // Decoding folds them back into the compact segment.
  842 |         let decoded = read_row_ids(encoded.as_slice()).unwrap();
  843 |         assert_eq!(decoded, sequence);
  844 |         assert_eq!(
  845 |             decoded.iter().collect::<Vec<_>>(),
  846 |             sequence.iter().collect::<Vec<_>>()
  847 |         );
  848 | 
  849 |         // A lone range, adjacent ranges and non-range neighbours: adjacent
  850 |         // ranges merge, a single range stays a `Range`, others are untouched.
  851 |         let mixed = pb::RowIdSequence {
  852 |             segments: vec![
  853 |                 U64Segment::Range(0..10),
  854 |                 U64Segment::Range(10..20),
  855 |                 U64Segment::SortedArray(vec![100, 200].into()),
  856 |                 U64Segment::Range(300..310),
  857 |                 U64Segment::Range(320..330),
  858 |                 U64Segment::Range(340..350),
  859 |             ]
  860 |             .into_iter()
  861 |             .map(pb::U64Segment::from)
  862 |             .collect(),
  863 |         };
  864 |         let folded = RowIdSequence::try_from(mixed).unwrap();
  865 |         assert!(matches!(
  866 |             folded.0.as_slice(),
  867 |             [
  868 |                 U64Segment::Range(_),
  869 |                 U64Segment::SortedArray(_),
  870 |                 U64Segment::Ranges { .. }
  871 |             ]
  872 |         ));
  873 |         assert_eq!(folded.0[0], U64Segment::Range(0..20));
  874 |         assert_eq!(
  875 |             folded.iter().collect::<Vec<_>>(),
  876 |             (0..20)
  877 |                 .chain([100, 200])
  878 |                 .chain(300..310)
  879 |                 .chain(320..330)
  880 |                 .chain(340..350)
  881 |                 .collect::<Vec<_>>()
  882 |         );
  883 |     }
  884 | }
``````
