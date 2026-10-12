> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# protos/encodings_v2_0.proto

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `8f213a66dcfa666b2c3fdee207ea59762067802ef5dd2ba74999513995c4114f`. Reviewed physical lines: 1-358.

[Module](../../L1-modules/protos.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Behavior contracts](../../L3-symbols/behavior-contracts.md) · [Format](../../L3-symbols/format-spec.md) · [Entry](../../README.md)

## Role and visibility

Public lance.encodings schema describing Arrow-to-Lance array/buffer encoding trees associated with the 2.0 format. The header says it is superseded for 2.1, but actual cross-version use of individual messages must be traced before treating this whole file as unused. (protos/encodings_v2_0.proto:1-358)

## Complete range analysis

### Lines 1-9

SPDX license, proto3 syntax, lance.encodings namespace, and protobuf Empty import establish the schema. (protos/encodings_v2_0.proto:1-9)

### Lines 10-35

The specification maps Arrow arrays to array encodings (potentially multiple buffers) and single-buffer encodings. Encoding applies the root then feeds child encodings, decoding reverses that tree. Structs/lists may span multiple physical columns, although an encoding here describes a single column. The superseding filename in the comment is encodings21.proto, whereas the checked-in next schema is encodings_v2_1.proto; the comment is not an actual import (protos/encodings_v2_1.proto:6-9). (protos/encodings_v2_0.proto:10-35)

### Lines 36-58

Buffer is a reference by buffer_index uint32=1 and BufferType buffer_type=2, where page=0, column=1, file=2 choose the buffer collection. Writers may choose placement for sharing, e.g. a dictionary in column metadata; this schema does not impose a placement strategy. These indices are not raw file offsets. (protos/encodings_v2_0.proto:36-58)

### Lines 59-81

Nullable wraps an ArrayEncoding. NoNull contains values=1; SomeNull contains validity=1 and values=2; AllNull is empty. nullability oneof selects no_nulls=1, some_nulls=2, all_nulls=3. The comments describe one versus two versus no buffers, but child array encodings can themselves expand to multiple buffers, so these are logical components rather than a proven universal physical-buffer count (protos/encodings_v2_0.proto:16-19). (protos/encodings_v2_0.proto:59-81)

### Lines 82-112

List.offsets encodes num_rows non-null end offsets with the leading Arrow zero omitted. For row i, base is zero for i=0, otherwise previous offset modulo null_offset_adjustment. Non-null offset is base+list length; null offset adds the adjustment. Example [[A,B],null,[],[C,D,E]] with adjustment 7 becomes [2,9,2,5]. A single-list lookup needs only current and previous offset, enabling random access without a separate validity read. (protos/encodings_v2_0.proto:82-112)

### Lines 113-138

The text says an offset greater than the adjustment denotes null and otherwise length is offset minus base. There is a boundary ambiguity: the preceding null formula can produce exactly the adjustment for a first null/empty value, so the strict greater-than wording cannot be assumed correct without decoder evidence (protos/encodings_v2_0.proto:99-104). The range examples recover item spans using previous/end offsets modulo adjustment, with zero start requiring only the end index. Their 0..3-style notation appears to include list index 3 and must not be copied as Rust half-open range semantics. Offset scalar type is flexible and can be delta-bitpacked independently of the destination Arrow offset width. offsets is ArrayEncoding tag 1. (protos/encodings_v2_0.proto:113-138)

### Lines 139-157

null_offset_adjustment uint64=2 must exceed total item length so a null marker does not collide with a valid end offset; the proposed optimal choice is 1+number of items to minimize required bits. num_items uint64=3 counts items referenced by this offsets page, allowing it to map to child item pages. Integer overflow and malformed offsets require implementation validation; none occurs here. (protos/encodings_v2_0.proto:139-157)

### Lines 158-172

FixedSizeList has dimension uint32=1, items ArrayEncoding=2, and has_validity bool=3. Compression specifies string scheme=1 and optional signed level=2; the schema does not enumerate supported scheme strings, levels, or defaults. (protos/encodings_v2_0.proto:158-172)

### Lines 173-195

Flat encodes contiguous fixed-width items: positive bits_per_value uint64=1 may be non-byte-aligned, Buffer=2 locates values, and Compression=3 optionally describes decompression. Bit width refers to uncompressed data when compression is used. Constant stores bytes value=1 but a TODO leaves literal encoding undefined in this schema. (protos/encodings_v2_0.proto:173-195)

### Lines 196-222

Bitpacked uses compressed_bits_per_value=1, uncompressed_bits_per_value=2, Buffer=3, and signed bool=4 indicating a sign bit. BitpackedForNonNeg uses the same first three fields without signed. These declarations carry widths and locations but not bit order, sign-extension algorithm, packing chunk shape, or valid width combinations. (protos/encodings_v2_0.proto:196-222)

### Lines 223-236

InlineBitpacking stores uncompressed_bits_per_value at tag 2; compressed widths are inline in opaque chunks. OutOfLineBitpacking uses uncompressed_bits_per_value=2 and compressed_bits_per_value=3, fixed across the whole buffer and described as transparent. Their tags differ from the similarly named 2.1 package messages; names do not justify interchangeability. (protos/encodings_v2_0.proto:223-236)

### Lines 237-255

SimpleStruct is an empty encoding for shredded non-null structs with no data in its own column; validity support is a TODO. Binary uses ArrayEncoding indices=1, bytes=2, null_adjustment uint64=3; exact adjustment interpretation is not documented locally. Variable holds bits_per_offset uint32=1 without further offset layout rules. (protos/encodings_v2_0.proto:237-255)

### Lines 256-272

Fsst contains ArrayEncoding binary=1 plus symbol_table bytes=2. Dictionary contains indices ArrayEncoding=1, items ArrayEncoding=2, num_dictionary_items uint32=3. PackedStruct contains repeated inner ArrayEncoding=1 and Buffer=2. These state nesting/storage relationships but do not specify FSST symbol-table bytes, dictionary null conventions, or struct transposition. (protos/encodings_v2_0.proto:256-272)

### Lines 273-286

PackedStructFixedWidthMiniBlock has unusually capitalized ArrayEncoding Flat=1 and repeated uint32 bits_per_values=2. FixedSizeBinary carries bytes ArrayEncoding=1 and byte_width uint32=2. Block contains scheme string=1. The exact spelling/case is retained; none supplies numeric bounds here. (protos/encodings_v2_0.proto:273-286)

### Lines 287-306

Rle miniblock metadata stores bits_per_value uint64=1 with documented supported values 8,16,32,64,128. ByteStreamSplit stores bits_per_value=1, described as 32 for float or 64 for double. GeneralMiniBlock composes inner ArrayEncoding=1 with Compression=2 applying to miniblock buffers; it is distinct from the later General compression tree message. (protos/encodings_v2_0.proto:287-306)

### Lines 307-333

ArrayEncoding.array_encoding is the union of 21 declared alternatives: flat=1, nullable=2, fixed_size_list=3, list=4, struct=5, binary=6, dictionary=7, fsst=8, packed_struct=9, bitpacked=10, fixed_size_binary=11, bitpacked_for_non_neg=12, constant=13, inline_bitpacking=14, out_of_line_bitpacking=15, variable=16, packed_struct_fixed_width_mini_block=17, block=18, rle=19, general_mini_block=20, byte_stream_split=21. Dispatch must use this namespace/tag contract, not assume similarity with CompressiveEncoding. (protos/encodings_v2_0.proto:307-333)

### Lines 334-349

ZoneIndex wraps ColumnEncoding inner=3 with rows_per_zone uint32=1 and Buffer zone_map_buffer=2 for filter pushdown. Blob wraps ColumnEncoding inner=1 and marks a packed struct of u64 position and size. This Blob marker does not define the newer BlobLayout's null description rules. (protos/encodings_v2_0.proto:334-349)

### Lines 350-358

ColumnEncoding.column_encoding selects protobuf Empty values=1 for plain column values, ZoneIndex zone_index=2, or Blob blob=3. Array and column unions operate at different layers; their tags are not interchangeable. (protos/encodings_v2_0.proto:350-358)

## Interaction and interpretation limits

No executable encoder/decoder, active-version dispatch, or bit layout is implemented by these message declarations. Legacy policy and current writer use require tracing each consumer. Explicit unresolved issues are List's strict null comparison and range notation (protos/encodings_v2_0.proto:99-149), constant literal bytes (protos/encodings_v2_0.proto:190-194), and the superseding filename (protos/encodings_v2_0.proto:10-12).

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | syntax = "proto3";
    5 | 
    6 | package lance.encodings;
    7 | 
    8 | import "google/protobuf/empty.proto";
    9 | 
   10 | /* This file contains a specification for encodings that can be used
   11 |  * to store and load Arrow data into a Lance file for the 2.0 format.  It
   12 |  * has been superseded by encodings21.proto which is used for the 2.1 format.
   13 |  *
   14 |  * # Types
   15 |  *
   16 |  * This file assumes the user wants to load data into Arrow arrays and
   17 |  * explains how to map Arrow arrays into Lance files.  Encodings are divided
   18 |  * into "array encoding" (which maps to an Arrow array and may contain multiple
   19 |  * buffers) and "buffer encoding" (which encodes a single buffer of data).
   20 |  *
   21 |  * # Encoding Tree
   22 |  *
   23 |  * Most encodings are layered on top of each other.  These form a tree of
   24 |  * encodings with a single root node.  To encode an array you will typically
   25 |  * start with the root node and then take the output from that root encoding
   26 |  * and feed it into child encodings.  The decoding process works in reverse.
   27 |  *
   28 |  * # Multi-column Encodings
   29 |  *
   30 |  * Some Arrow arrays will map to more than one column of Lance data.  For
   31 |  * example, struct arrays and list arrays.  This file only contains encodings
   32 |  * for a single column.  However, it does describe how multi-column arrays can
   33 |  * be encoded.
   34 |  */
   35 | 
   36 | /* A pointer to a buffer in a Lance file
   37 |  *
   38 |  * A writer can place a buffer in three different locations.  The buffer
   39 |  * can go in the data page, in the column metadata, or in the file metadata.
   40 |  * The writer is free to choose whatever is most appropriate (for example, a dictionary
   41 |  * that is shared across all pages in a column will probably go in the column
   42 |  * metadata).  This specification does not dictate where the buffer should go.
   43 |  */
   44 | message Buffer {
   45 |     // The index of the buffer in the collection of buffers
   46 |     uint32 buffer_index = 1;
   47 |     // The collection holding the buffer
   48 |     enum BufferType {
   49 |       // The buffer is stored in the data page itself
   50 |       page = 0;
   51 |       // The buffer is stored in the column metadata
   52 |       column = 1;
   53 |       // The buffer is stored in the file metadata
   54 |       file = 2;
   55 |     };
   56 |     BufferType buffer_type = 2;
   57 | }
   58 | 
   59 | /* An encoding that adds nullability to another array encoding
   60 |  *
   61 |  * This can wrap any array encoding and add nullability information
   62 |  */
   63 | message Nullable {
   64 |   message NoNull {
   65 |     ArrayEncoding values = 1;
   66 |   }
   67 |   message AllNull {}
   68 |   message SomeNull {
   69 |     ArrayEncoding validity = 1;
   70 |     ArrayEncoding values = 2;
   71 |   }
   72 |   oneof nullability {
   73 |     // The array has no nulls and there is a single buffer needed
   74 |     NoNull no_nulls = 1;
   75 |     // The array may have nulls and we need two buffers
   76 |     SomeNull some_nulls = 2;
   77 |     // All values are null (no buffers needed)
   78 |     AllNull all_nulls = 3;
   79 |   }
   80 | }
   81 | 
   82 | // An array encoding for variable-length list fields
   83 | message List {
   84 |     /* An array containing the offsets into an items array.
   85 |      *
   86 |      * This array will have num_rows items and will never
   87 |      * have nulls.
   88 |      *
   89 |      * If the list at index i is not null then offsets[i] will
   90 |      * contain `base + len(list)` where `base` is defined as:
   91 |      *   i == 0: 0
   92 |      *   i >  0: (offsets[i-1] % null_offset_adjustment)
   93 |      *
   94 |      * To help understand we can consider the following example list:
   95 |      * [ [A, B], null, [], [C, D, E] ]
   96 |      *
   97 |      * The offsets will be [2, ?, 2, 5]
   98 |      *
   99 |      * If the incoming list at index i IS null then offsets[i] will
  100 |      * contain `base + len(list) + null_offset_adjustment` where `base`
  101 |      * is defined the same as above.
  102 |      *
  103 |      * To complete the above example let's assume that `null_offset_adjustment`
  104 |      * is 7.  Then the offsets will be [2, 9, 2, 5]
  105 |      *
  106 |      * If there are no nulls then the offsets we write here are exactly the
  107 |      * same as the offsets in an Arrow list array (except we omit the leading
  108 |      * 0 which is redundant)
  109 |      *
  110 |      * The reason we do this is so that reading a single list at index i only
  111 |      * requires us to load the indices at i and i-1.
  112 |      *
  113 |      * If the offset at index i is greater than `null_offset_adjustment``
  114 |      * then the list at index i is null.
  115 |      *
  116 |      * Otherwise the length of the list is `offsets[i] - base` where
  117 |      * base is defined the same as above.
  118 |      *
  119 |      * Let's consider our example offsets: [2, 9, 2, 5]
  120 |      *
  121 |      * We can take any range of lists and determine how many list items are
  122 |      * referenced by the sublist.
  123 |      *
  124 |      * 0..3: [_, 5] -> items 0..5 (base = 0* and end is 5)
  125 |      * 0..2: [_, 2] -> items 0..2 (base = 0* and end is 2)
  126 |      * 0..1: [_, 9] -> items 0..2 (base = 0* and end is 9 % 7)
  127 |      * 1..3: [2, 5] -> items 2..5 (base = 2 and end is 5)
  128 |      * 1..2: [2, 2] -> items 2..2 (base = 2 and end is 2)
  129 |      * 2..3: [9, 5] -> items 2..5 (base = 9 % 7 and end is 5)
  130 |      *
  131 |      * * When the start of our range is the 0th item the base is always 0 and we only
  132 |      *   need to load a single index from disk to determine the range.
  133 |      *
  134 |      * The data type of the offsets array is flexible and does not need
  135 |      * to match the data type of the destination array.  Please note that the offsets
  136 |      * array is very likely to be efficiently encoded by bit packing deltas.
  137 |      */
  138 |     ArrayEncoding offsets = 1;
  139 |     /* If a list is null then we add this value to the offset
  140 |      *
  141 |      * This value must be greater than the length of the items so that
  142 |      * (offset + null_offset_adjustment) is never used by a non-null list.
  143 |      *
  144 |      * Note that this value cannot be equal to the length of the items
  145 |      * because then a page with a single list would store [ X ] and we
  146 |      * couldn't know if that is a null list or a list with X items.
  147 |      *
  148 |      * Therefore, the best choice for this value is 1 + # of items.
  149 |      * Choosing this will maximize the bit packing that we can apply to the offsets.
  150 |      */
  151 |     uint64 null_offset_adjustment = 2;
  152 |     /* How many items are referenced by these offsets.  This is needed in
  153 |      * order to determine which items pages map to this offsets page.
  154 |      */
  155 |     uint64 num_items = 3;
  156 | }
  157 | 
  158 | // An array encoding for fixed-size list fields
  159 | message FixedSizeList {
  160 |   /// The number of items in each list
  161 |   uint32 dimension = 1;
  162 |   /// True if the list is nullable
  163 |   bool has_validity = 3;
  164 |   /// The items in the list
  165 |   ArrayEncoding items = 2;
  166 | }
  167 | 
  168 | message Compression {
  169 |   string scheme = 1;
  170 |   optional int32 level = 2;
  171 | }
  172 | 
  173 | // Fixed width items placed contiguously in a buffer
  174 | message Flat {
  175 |   /* the number of bits per value, must be greater than 0, does
  176 |    * not need to be a multiple of 8
  177 |    */
  178 |   uint64 bits_per_value = 1;
  179 |   // the buffer of values
  180 |   Buffer buffer = 2;
  181 |   /* The Compression message can specify the compression scheme (e.g. zstd) and any
  182 |    * other information that is needed for decompression.
  183 |    *
  184 |    * If this array is compressed then the bits_per_value refers to the uncompressed
  185 |    * data.
  186 |    */
  187 |   Compression compression = 3;
  188 | }
  189 | 
  190 | // Compression algorithm where all values have a constant value
  191 | message Constant {
  192 |   // The value (TODO: define encoding for literals?)
  193 |   bytes value = 1;
  194 | }
  195 | 
  196 | // Items are bitpacked in a buffer
  197 | message Bitpacked {
  198 |   // the number of bits used for a value in the buffer
  199 |   uint64 compressed_bits_per_value = 1;
  200 | 
  201 |   // the number of bits of the uncompressed value. e.g. for a u32, this will be 32
  202 |   uint64 uncompressed_bits_per_value = 2;
  203 | 
  204 |   // The items in the list
  205 |   Buffer buffer = 3;
  206 | 
  207 |   // Whether or not a sign bit is included in the bitpacked value
  208 |   bool signed = 4;
  209 | }
  210 | 
  211 | // Items are bitpacked in a buffer
  212 | message BitpackedForNonNeg {
  213 |   // the number of bits used for a value in the buffer
  214 |   uint64 compressed_bits_per_value = 1;
  215 | 
  216 |   // the number of bits of the uncompressed value. e.g. for a u32, this will be 32
  217 |   uint64 uncompressed_bits_per_value = 2;
  218 | 
  219 |   // The items in the list
  220 |   Buffer buffer = 3;
  221 | }
  222 | 
  223 | // Opaque bitpacking variant where the bits per value are stored inline in the chunks themselves
  224 | message InlineBitpacking {
  225 |   // the number of bits of the uncompressed value. e.g. for a u32, this will be 32
  226 |   uint64 uncompressed_bits_per_value = 2;
  227 | }
  228 | 
  229 | // Transparent bitpacking variant where the number of bits per value is fixed through the whole buffer
  230 | message OutOfLineBitpacking {
  231 |   // the number of bits of the uncompressed value. e.g. for a u32, this will be 32
  232 |   uint64 uncompressed_bits_per_value = 2;
  233 |   // The number of compressed bits per value, fixed across the entire buffer
  234 |   uint64 compressed_bits_per_value = 3;
  235 | }
  236 | 
  237 | /* An array encoding for shredded structs that will never be null
  238 |  *
  239 |  * There is no actual data in this column.
  240 |  *
  241 |  * TODO: Struct validity bitmaps will be placed here.
  242 |  */
  243 | message SimpleStruct {}
  244 | 
  245 | // An array encoding for binary fields
  246 | message Binary {
  247 |   ArrayEncoding indices = 1;
  248 |   ArrayEncoding bytes = 2;
  249 |   uint64 null_adjustment = 3;
  250 | }
  251 | 
  252 | message Variable {
  253 |   uint32 bits_per_offset = 1;
  254 | }
  255 | 
  256 | message Fsst {
  257 |   ArrayEncoding binary = 1;
  258 |   bytes symbol_table = 2;
  259 | }
  260 | 
  261 | // An array encoding for dictionary-encoded fields
  262 | message Dictionary {
  263 |   ArrayEncoding indices = 1;
  264 |   ArrayEncoding items = 2;
  265 |   uint32 num_dictionary_items = 3;
  266 | }
  267 | 
  268 | message PackedStruct {
  269 |   repeated ArrayEncoding inner = 1;
  270 |   Buffer buffer = 2;
  271 | }
  272 | 
  273 | message PackedStructFixedWidthMiniBlock {
  274 |   ArrayEncoding Flat = 1;
  275 |   repeated uint32 bits_per_values = 2;
  276 | }
  277 | 
  278 | message FixedSizeBinary {
  279 |   ArrayEncoding bytes = 1;
  280 |   uint32 byte_width = 2;
  281 | }
  282 | 
  283 | message Block {
  284 |   string scheme = 1;
  285 | }
  286 | 
  287 | // Run-Length Encoding for miniblock format
  288 | message Rle {
  289 |   // Number of bits per value (8, 16, 32, 64, or 128)
  290 |   uint64 bits_per_value = 1;
  291 | }
  292 | 
  293 | // Byte Stream Split encoding for floating point values
  294 | message ByteStreamSplit {
  295 |   // Number of bits per value (32 for float, 64 for double)
  296 |   uint64 bits_per_value = 1;
  297 | }
  298 | 
  299 | // General miniblock encoding - wraps another miniblock encoding with compression
  300 | message GeneralMiniBlock {
  301 |   // The inner miniblock encoding (e.g., Rle, Bitpacked, etc.)
  302 |   ArrayEncoding inner = 1;
  303 |   // The compression scheme to apply to the miniblock buffers
  304 |   Compression compression = 2;
  305 | }
  306 | 
  307 | // Encodings that decode into an Arrow array
  308 | message ArrayEncoding {
  309 |     oneof array_encoding {
  310 |         Flat flat = 1;
  311 |         Nullable nullable = 2;
  312 |         FixedSizeList fixed_size_list = 3;
  313 |         List list = 4;
  314 |         SimpleStruct struct = 5;
  315 |         Binary binary = 6;
  316 |         Dictionary dictionary = 7;
  317 |         Fsst fsst = 8;
  318 |         PackedStruct packed_struct = 9;
  319 |         Bitpacked bitpacked = 10;
  320 |         FixedSizeBinary fixed_size_binary = 11;
  321 |         BitpackedForNonNeg bitpacked_for_non_neg = 12;
  322 |         Constant constant = 13;
  323 |         InlineBitpacking inline_bitpacking = 14;
  324 |         OutOfLineBitpacking out_of_line_bitpacking = 15;
  325 |         Variable variable = 16;
  326 |         PackedStructFixedWidthMiniBlock packed_struct_fixed_width_mini_block = 17;
  327 |         Block block = 18;
  328 |         Rle rle = 19;
  329 |         GeneralMiniBlock general_mini_block = 20;
  330 |         ByteStreamSplit byte_stream_split = 21;
  331 |     }
  332 | }
  333 | 
  334 | /* Wraps a column with a zone map index that can be used
  335 |  * to apply pushdown filters
  336 |  */
  337 | message ZoneIndex {
  338 |   uint32 rows_per_zone = 1;
  339 |   Buffer zone_map_buffer = 2;
  340 |   ColumnEncoding inner = 3;
  341 | }
  342 | 
  343 | /* Marks a column as blob data.  It will contain a packed struct
  344 |  * with fields position and size (u64)
  345 |  */
  346 | message Blob {
  347 |   ColumnEncoding inner = 1;
  348 | }
  349 | 
  350 | // Encodings that describe a column of values
  351 | message ColumnEncoding {
  352 |   oneof column_encoding {
  353 |     // No special encoding, just column values
  354 |     google.protobuf.Empty values = 1;
  355 |     ZoneIndex zone_index = 2;
  356 |     Blob blob = 3;
  357 |   }
  358 | }
``````
