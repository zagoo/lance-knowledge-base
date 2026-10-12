> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../V21-PROTOCOL.md).

# protos/rowids.proto

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `132435ade17f3edb1f7ec5334578060c5af4108fbb7009cfadb2d2c3adcaebf1`. Reviewed physical lines: 1-120.

[Module](../../L1-modules/protos.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Behavior contracts](../../L3-symbols/behavior-contracts.md) · [Format](../../L3-symbols/format-spec.md) · [Entry](../../README.md)

## Role and visibility

Public persisted schema in lance.table for row-ID segments and run-length encoded dataset-version lineage. It declares serialized alternatives without choosing an encoding or performing validation. (protos/rowids.proto:1-120)

## Complete range analysis

### Lines 1-10

License, proto3, and lance.table namespace establish the schema. The LanceV2-versus-flatbuffers question is explicitly a TODO, not the present representation or an authorization to migrate it. (protos/rowids.proto:1-10)

### Lines 11-29

RowIdSequence.segments tag 1 is an ordered repeated U64Segment sequence. Segment encodings favor sorted and differently sparse IDs. Nested U64Segment.Range uses uint64 start=1 inclusive and end=2 exclusive; empty or reversed-range validation is not encoded here. (protos/rowids.proto:11-29)

### Lines 30-44

RangeWithHoles has start=1 inclusive, end=2 exclusive, and EncodedU64Array holes=3 storing sorted omitted values. Binary search can determine exclusion and the count of preceding holes, enabling logical offset calculation. Sorting is a semantic requirement in the comment, not a protobuf-enforced property. (protos/rowids.proto:30-44)

### Lines 45-61

RangeWithBitmap uses start=1/end=2 half-open bounds and bitmap bytes=3. Comment specifies MSB-first and set means present. This contradicts current implementation: Bitmap uses bit i%8 from LSB and codec byte-exact fixture asserts[0xfb,0x03] for length10 with bit2 cleared (rust/lance-table/src/rowids/bitmap.rs:67-77; rust/lance-table/src/rowids/serde.rs:436-451). Decoder requires ceiling byte length and zero high padding (rust/lance-table/src/rowids/serde.rs:132-155). Schema-only MSB interpretation must not be treated as observed writer behavior; historical compatibility remains unverified. (protos/rowids.proto:45-61)

### Lines 62-75

U64Segment.segment chooses Range tag 1 for sorted-contiguous values, RangeWithHoles tag 2 for few gaps, RangeWithBitmap tag 3 for many gaps, EncodedU64Array sorted_array tag 4 for sparse sorted values, or EncodedU64Array array tag 5 for general unsorted values. Order must be retained in the general case. The trailing comment says RowIdSegment but the declared type is U64Segment; this is a naming discrepancy in a comment, not a second type. (protos/rowids.proto:62-75)

### Lines 76-105

EncodedU64Array contains U16Array(base uint64=1, offsets bytes=2), U32Array(base uint64=1, offsets bytes=2), and U64Array(values bytes=2). Offsets are unsigned 16- or 32-bit deltas; bytes avoid unsupported uint16 and uint32 varint overhead, while full u64 bytes avoid varints. The array oneof selects u16_array=1, u32_array=2, or u64_array=3. Endianness, alignment, and overflow checks are not stated, so exact byte decoding requires the Rust implementation. The heading calls this bitpacked, whereas declarations explicitly provide fixed-width byte variants; retain that distinction. (protos/rowids.proto:76-105)

### Lines 106-120

RowDatasetVersionSequence stores repeated RowDatasetVersionRun runs=1 for runs of equal dataset versions. Each run carries U64Segment span=1 and uint64 version=2. The span comment describes the number of consecutive rows, but its declared type is a segment rather than a scalar count; do not replace it with a count or assume how it is interpreted without checking the converter. (protos/rowids.proto:106-120)

## Interaction and interpretation limits

Schema arms/tags and comment contracts are preserved here. Actual arrays use LE bytes, bitmap uses LSB contrary to the comment, and validation/folding is covered by rust/lance-table/src/rowids/serde.rs:1-884. Exact segment selection and complete local sequence operations are covered at rust/lance-table/src/rowids/segment.rs:1-1624 and rust/lance-table/src/rowids.rs:1-2309; released compatibility remains pending. Version positional behavior is covered at rust/lance-table/src/rowids/version.rs:44-391.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | syntax = "proto3";
    5 | 
    6 | package lance.table;
    7 | /* TODO: what would it take to store this in a LanceV2 file?
    8 |  * Or would flatbuffers be better for this?
    9 |  */
   10 | 
   11 | /* A sequence of row IDs. This is split up into one or more segments,
   12 |  * each of which can be encoded in different ways. The encodings are optimized
   13 |  * for values that are sorted, which will often be the case with row ids.
   14 |  * They also have optimized forms depending on how sparse the values are.
   15 |  */
   16 | message RowIdSequence {
   17 |     repeated U64Segment segments = 1;
   18 | }
   19 | 
   20 | /// Different ways to encode a sequence of u64 values.
   21 | message U64Segment {
   22 |     /// A range of u64 values.
   23 |     message Range {
   24 |         /// The start of the range, inclusive.
   25 |         uint64 start = 1;
   26 |         /// The end of the range, exclusive.
   27 |         uint64 end = 2;
   28 |     }
   29 | 
   30 |     /// A range of u64 values with holes.
   31 |     message RangeWithHoles {
   32 |         /// The start of the range, inclusive.
   33 |         uint64 start = 1;
   34 |         /// The end of the range, exclusive.
   35 |         uint64 end = 2;
   36 |         /* The holes in the range, as a sorted array of values;
   37 |          * Binary search can be used to check whether a value is a hole and should
   38 |          * be skipped. This can also be used to count the number of holes before a
   39 |          * given value, if you need to find the logical offset of a value in the
   40 |          * segment.
   41 |          */
   42 |         EncodedU64Array holes = 3;
   43 |     }
   44 | 
   45 |     /// A range of u64 values with a bitmap.
   46 |     message RangeWithBitmap {
   47 |         /// The start of the range, inclusive.
   48 |         uint64 start = 1;
   49 |         /// The end of the range, exclusive.
   50 |         uint64 end = 2;
   51 |         /* A bitmap of the values in the range. The bitmap is a sequence of bytes,
   52 |          * where each byte represents 8 values. The first byte represents values
   53 |          * start to start + 7, the second byte represents values start + 8 to
   54 |          * start + 15, and so on. The most significant bit of each byte represents
   55 |          * the first value in the range, and the least significant bit represents
   56 |          * the last value in the range. If the bit is set, the value is in the
   57 |          * range; if it is not set, the value is not in the range.
   58 |          */
   59 |         bytes bitmap = 3;
   60 |     }
   61 | 
   62 |     oneof segment {
   63 |         /// When the values are sorted and contiguous.
   64 |         Range range = 1;
   65 |         /// When the values are sorted but have a few gaps.
   66 |         RangeWithHoles range_with_holes = 2;
   67 |         /// When the values are sorted but have many gaps.
   68 |         RangeWithBitmap range_with_bitmap = 3;
   69 |         /// When the values are sorted but are sparse.
   70 |         EncodedU64Array sorted_array = 4;
   71 |         /// A general array of values, which is not sorted.
   72 |         EncodedU64Array array = 5;
   73 |     }
   74 | } // RowIdSegment
   75 | 
   76 | /// A basic bitpacked array of u64 values.
   77 | message EncodedU64Array {
   78 |     message U16Array {
   79 |         uint64 base = 1;
   80 |         /* The deltas are stored as 16-bit unsigned integers.
   81 |          * (protobuf doesn't support 16-bit integers, so we use bytes instead)
   82 |          */
   83 |         bytes offsets = 2;
   84 |     }
   85 | 
   86 |     message U32Array {
   87 |         uint64 base = 1;
   88 |         /* The deltas are stored as 32-bit unsigned integers.
   89 |          * (we use bytes instead of uint32 to avoid overhead of varint encoding)
   90 |          */
   91 |         bytes offsets = 2;
   92 |     }
   93 | 
   94 |     message U64Array {
   95 |         /// (We use bytes instead of uint64 to avoid overhead of varint encoding)
   96 |         bytes values = 2;
   97 |     }
   98 | 
   99 |     oneof array {
  100 |         U16Array u16_array = 1;
  101 |         U32Array u32_array = 2;
  102 |         U64Array u64_array = 3;
  103 |     }
  104 | }
  105 | 
  106 | /* A sequence of dataset versions. Similar to RowIdSequence but tracks
  107 |  * version runs. It uses RLE (Run-Length Encoding) to efficiently
  108 |  * represent consecutive rows with the same version.
  109 |  */
  110 | message RowDatasetVersionSequence {
  111 |     repeated RowDatasetVersionRun runs = 1;
  112 | }
  113 | 
  114 | /// A run of rows with the same version.
  115 | message RowDatasetVersionRun {
  116 |     /// The number of consecutive rows with the same version.
  117 |     U64Segment span = 1;
  118 | 
  119 |     uint64 version = 2;
  120 | }
``````
