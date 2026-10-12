> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# protos/encodings_v2_1.proto

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `eddd68753d1c8e08860e2981386894d788e2b73bdfd9d2aa60e648f605348d5a`. Reviewed physical lines: 1-675.

[Module](../../L1-modules/protos.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Behavior contracts](../../L3-symbols/behavior-contracts.md) · [Format](../../L3-symbols/format-spec.md) · [Entry](../../README.md)

## Role and visibility

Public lance.encodings21 schema for structural page layouts and recursive compressive encodings. Despite its 2.1 name, it explicitly contains 2.2 and 2.3 extensions. The schema records contracts; actual runtime version checks, encoder selection, allocation limits, and byte serialization must be verified separately. (protos/encodings_v2_1.proto:1-675)

## Complete range analysis

### Lines 1-18

License, proto3 syntax, and lance.encodings21 package establish a separate namespace. Structural encodings describe Arrow list/struct structure; compressive encodings describe actual value compression. These layers replace the older array-versus-buffer framing for the described 2.1 format. (protos/encodings_v2_1.proto:1-18)

### Lines 19-42

Counting terms are deliberately distinct. num_rows is top-level user rows; num_elements multiplies rows by fixed-size-list wrapper dimensions and is the flattened FSL input to structural encoding; num_items counts fully flattened repetition/definition events; num_visible_items removes events with no value. A FIXED_SIZE_LIST<LIST<INT32>> example shows why replacing one count with another breaks nested-array interpretation. Blank lines delimit the next section. (protos/encodings_v2_1.proto:19-42)

### Lines 43-70

Structural encodings are called layouts. RepDefLayer records each peeled list/struct layer's interpretation: UNSPECIFIED=0 is invalid/debug; ALL_VALID_ITEM=1, ALL_VALID_LIST=2, NULLABLE_ITEM=3, NULLABLE_LIST=4 (null but no empty lists), EMPTYABLE_LIST=5 (empty but no null), NULL_AND_EMPTY_LIST=6. ITEM includes primitives or structs. Null and empty list layers are distinct even when neither emits a child value. (protos/encodings_v2_1.proto:43-70)

### Lines 71-103

MiniBlockLayout targets small values where per-value transposition is expensive; comments describe sector-sized compressed chunks and bulk compression tradeoffs. Its prose also says an entire page must be read, which requires checking against the actual mini-block reader rather than treating it as established scheduling behavior. Optional-in-presence rep_compression=1 and def_compression=2 describe levels, value_compression=3 values, dictionary=4 optional dictionary encoding, num_dictionary_items uint64=5, and repeated RepDefLayer layers=6. Omitted rep/def/dictionary messages mean those components are absent. (protos/encodings_v2_1.proto:71-103)

### Lines 104-129

MiniBlock num_buffers uint64=7 excludes repetition/definition buffers, whose existence follows their compression messages. repetition_index_depth uint32=8 must be at least one when repetition exists; greater depth enables nested random access (example depth at least three for rows[50][17][3] through five layers). Positive depth requires depth+1 u64 index values per mini-block, including leftover-item count so final-item validity can be known. num_items uint64=9 differs from page rows with lists. has_large_chunk bool=10 is documented as a 2.2 extension for chunk sizes at least 64 KB; this schema does not implement the gate. (protos/encodings_v2_1.proto:104-129)

### Lines 130-161

FullZipLayout targets large values where transposition cost is relatively low, zipping buffers. bits_rep uint32=1 and bits_def=2 use zero for none. details oneof selects fixed bits_per_value=3 or variable bits_per_offset=4; prose favors byte multiples for large values but does not declare a validation rule. num_items uint32=5 and num_visible_items=6 are separately stored; value_compression=7 and layers=8 describe values/structure. These counts are uint32, unlike MiniBlock's uint64 num_items. (protos/encodings_v2_1.proto:130-161)

### Lines 162-189

SparseLayout stores Arrow structure in layer-local slot domains, ordered outermost to innermost, with independently readable compressed value chunks. Fields: value_compression=1, num_buffers uint64=2 excluding structure, num_items uint64=3, num_visible_items uint64=4, has_large_chunk bool=5 choosing u32 versus u16 chunk-local value-buffer sizes, structural_layers repeated=6. num_items equals visible leaf slots plus one placeholder per list slot without children; null primitive slots remain visible slots. Thus a 100-slot primitive with 30 nulls has both counts 100. Structural layers can be empty for a flat non-null leaf when scheduling domain equals visible items. (protos/encodings_v2_1.proto:162-189)

### Lines 190-210

Domains are [0,num_slots) coordinates. Outermost means page rows; each layer's child domain is the next layer's parent; the final domain has num_visible_items slots. SparseStructuralLayer.layer requires exactly one validity=1, list=2, or fixed_size_list=3 arm. SparseValidityLayer preserves num_slots uint64=1 across parent/child and records SparseValiditySet validity=2. The requirement for exactly one is a semantic constraint; oneof alone also admits unset. (protos/encodings_v2_1.proto:190-210)

### Lines 211-232

SparseListLayer uses num_slots=1, num_child_slots=2, SparsePositionSet non_empty_positions=3, SparseCountSet counts=4, validity=5. Counts are positive and parallel non-empty positions; valid parents absent from that set are empty. SparseFixedSizeListLayer uses num_slots=1, dimension=2, validity=3, with child cardinality num_slots*dimension. Parent nullness and child coordinates are separate, and multiplication/consistency checks belong to implementation. (protos/encodings_v2_1.proto:211-232)

### Lines 233-254

SparseValiditySet has Meaning meaning=1 and SparsePositionSet positions=2. Meaning UNSPECIFIED=0, NULL_POSITIONS=1 (stored positions null, all others valid), VALID_POSITIONS=2 (inverse). Empty and All position markers are separate empty messages. SparsePositionRange has uint64 start=1 and length=2; it is a start/count representation, not start/end. (protos/encodings_v2_1.proto:233-254)

### Lines 255-269

SparsePositionSet.positions selects explicit CompressiveEncoding=1 for delta-compressed u64 positions, nonempty contiguous range=2, all=3, or empty=4. num_positions uint64=5 records semantic cardinality for every alternative. Explicit cardinality, range length, all-domain size, and empty-zero consistency are obligations implied by the contract, not validated by the schema. (protos/encodings_v2_1.proto:255-269)

### Lines 270-287

SparseCountEmpty is empty. SparseCountConstant.value uint64=1 is the common positive child count. SparseCountSet.counts selects explicit compressed u64 counts=1 with cardinality inherited from the containing position set, constant=2, or empty=3 allowed only when no nonempty list slots exist. No separate count-list length is stored. (protos/encodings_v2_1.proto:270-287)

### Lines 288-309

ConstantLayout generalizes prior all-null semantics at file_version >=2.2 to any page whose visible values are the same scalar. Repetition/definition buffers may still be required to explain visibility/null kinds. layers repeated=5; optional inline_value bytes=6 must be absent for all-null pages, at most 32 bytes when present, and only for a non-null scalar representable by one fixed-width Arrow value buffer without offsets or children. This is a structural page constant, distinct from the compressive Constant message. (protos/encodings_v2_1.proto:288-309)

### Lines 310-323

ConstantLayout rep_compression=7 and def_compression=8 are optional message fields; absence means raw u16 levels, not no levels. num_rep_values uint64=9 and num_def_values=10 count decompressed entries. Presence semantics here differ from MiniBlockLayout's absent-level compression meanings (protos/encodings_v2_1.proto:82-91). (protos/encodings_v2_1.proto:310-323)

### Lines 324-340

BlobLayout externalizes large binary payloads and stores position/size descriptions. (position=0,size=0) means empty; (nonzero position,size=0) means null and position carries repdef. inner_layout PageLayout=1 encodes descriptions with exactly one all-valid-item repdef layer, while outer layers repeated=2 describe original structure. Conflating zero-length null and empty corrupts semantics. (protos/encodings_v2_1.proto:324-340)

### Lines 341-358

PageLayout.layout selects MiniBlockLayout=1, ConstantLayout=2, FullZipLayout=3, BlobLayout=4, SparseLayout=5. The sparse arm explicitly requires file version 2.3 or later. Constant's non-null extension and MiniBlock large-chunk extension have their own 2.2 statements; the file's 2.1 name is not a universal gate (protos/encodings_v2_1.proto:126-127; protos/encodings_v2_1.proto:288-290). (protos/encodings_v2_1.proto:341-358)

### Lines 359-378

Compressive encodings form a recursive tree: an initial array becomes interpreted data blocks and finally fully compressed page buffers at leaves. Data-block kinds are fixed-width, variable-width, and packed struct; ordinary structs belong to structural encoding. A buffer has no further interpreted decomposition at this layer. (protos/encodings_v2_1.proto:359-378)

### Lines 379-409

CompressionScheme enumerates UNSPECIFIED=0, LZ4=1, ZSTD=2. BufferCompression.scheme=1 and optional signed level=2 apply to a whole buffer. Absent level uses a scheme-specific default whose number is not stated. General buffer compression makes a parent opaque even if its ordinary encoding is transparent. Higher levels generally trade CPU for compression, but no measured complexity is given. (protos/encodings_v2_1.proto:379-409)

### Lines 410-446

Flat takes fixed-width data to one buffer, with positive bits_per_value uint64=1 (not necessarily byte multiple) and optional BufferCompression data=2. Variable takes variable-width data to compressed offsets CompressiveEncoding=1 plus a value buffer with optional BufferCompression values=2. The prose calls them transparent/uncompressed leaves, but their declared optional buffer compression invokes the opacity rule above; readers must interpret those comments conditionally rather than ignore data/values compression (protos/encodings_v2_1.proto:385-407). (protos/encodings_v2_1.proto:410-446)

### Lines 447-479

Compressive Constant accepts any block, stores optional bytes value=1 in metadata, emits no output buffers, and leaves literal encoding as a TODO. OutOfLineBitpacking reduces fixed-width values by removing redundant upper bits; uncompressed_bits_per_value uint64=1 and CompressiveEncoding values=3 describe the result. Prose says compressed width is fixed and stored in this message, but there is no direct compressed-width scalar here; it must be recovered through nested encoding/implementation. Do not copy the old package's compressed_bits_per_value tag into this schema. (protos/encodings_v2_1.proto:447-479)

### Lines 480-496

InlineBitpacking stores original width uint64=1 and optional BufferCompression values=2. Compressed widths live inline per chunk, allowing variation to tolerate outliers; the encoding is opaque and turns a fixed-width data block into one buffer. Chunk header byte layout is not specified here. (protos/encodings_v2_1.proto:480-496)

### Lines 497-514

Fsst uses one page-wide symbol table stored in bytes symbol_table=1 and CompressiveEncoding values=2 for the transformed variable-width block. The contract calls the transform transparent. It does not specify symbol-table serialization or the FSST algorithm itself. (protos/encodings_v2_1.proto:497-514)

### Lines 515-533

Dictionary maps a data block of any kind to a same-kind dictionary and fixed-width indices, recursively compressed by indices=1 and items=2; num_dictionary_items uint32=3 stores dictionary size. It is opaque unless dictionary content is considered metadata. Index widths, null conventions, invalid-index errors, and metadata placement require implementation evidence. (protos/encodings_v2_1.proto:515-533)

### Lines 534-549

Rle emits same-kind run values and fixed-width run lengths, represented by CompressiveEncoding values=1 and run_lengths=2. It is opaque unless lengths are metadata. Unlike the older Rle declaration, it does not directly carry bits_per_value; the value-width description lives in the nested encoding. (protos/encodings_v2_1.proto:534-549)

### Lines 550-567

FixedSizeList is a transparent structural flattening transform within the compressive tree, converting wide/fewer fixed-width items to narrower/more items without itself compressing. items_per_value uint64=1 is this layer's dimension, values CompressiveEncoding=2 encodes flattened output, and has_validity bool=3 records validity buffer presence. This differs from SparseFixedSizeListLayer's parent/child-domain description. (protos/encodings_v2_1.proto:550-567)

### Lines 568-603

PackedStruct is the legacy fixed-width form: row-by-row concatenation of fixed-width children, repeated uint64 bits_per_value=1 specifying each contribution and CompressiveEncoding values=2. VariablePackedStruct is a 2.2 extension with repeated FieldEncoding fields=1 in struct order. Each child is independently compressed before row-major transposition, preserving field compression boundaries but disabling mini-block compression. FieldEncoding.value=1 describes compression and layout selects bits_per_value uint64=2 or bits_per_length uint64=3 for variable-length prefixes. The prose says readers prefer this form when present and fall back to legacy; the enclosing union makes the concrete selection explicit (protos/encodings_v2_1.proto:658-675). (protos/encodings_v2_1.proto:568-603)

### Lines 604-637

General wraps the output of its inner encoding, unlike other encodings' input-oriented composition. In mini-block layout it compresses the whole mini-block; in full-zip it compresses individual values. In the FSST/Variable/bitpacked-offset example, compression can apply to offsets alone, value bytes alone, or the combined mini-block, or combinations. General has BufferCompression compression=1 and CompressiveEncoding values=3, preserving data-block kind. Choosing placement changes random-access granularity and what must be decompressed together, as an inference from the documented units. (protos/encodings_v2_1.proto:604-637)

### Lines 638-657

ByteStreamSplit transposes fixed-width values into byte streams without reducing size by itself, then recursively encodes them using CompressiveEncoding values=1. It is opaque and keeps fixed-width block kind. The prose's attribution of upper bits to mantissa is not sufficient to define a numeric representation; this KB retains the text but requires implementation-level bit mapping before giving an exact algorithm. (protos/encodings_v2_1.proto:638-657)

### Lines 658-675

CompressiveEncoding.compression selects flat=1, variable=2, constant=3, out_of_line_bitpacking=4, inline_bitpacking=5, fsst=6, dictionary=7, rle=8, byte_stream_split=9, general=10, fixed_size_list=11, packed_struct=12, variable_packed_struct=13. These tags and nested types are different from the older ArrayEncoding union. No unknown/unset variant handling is implemented here. (protos/encodings_v2_1.proto:658-675)

## Interaction and interpretation limits

Version markers are schema evidence only: 2.2 large mini-block chunks, generalized constants, variable packed structs; 2.3 sparse page layout (protos/encodings_v2_1.proto:126-127; protos/encodings_v2_1.proto:288-290; protos/encodings_v2_1.proto:354-355; protos/encodings_v2_1.proto:580-602). Runtime gating, structure buffer order/endianness, codec implementation, limits, and validation need further review. Multiple prose/declaration tensions are recorded above rather than silently resolved.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | syntax = "proto3";
    5 | 
    6 | package lance.encodings21;
    7 | 
    8 | /* This file contains a specification for encodings that can be used
    9 |  * to store and load Arrow data into a Lance file for the 2.1 format.
   10 |  *
   11 |  * # Types
   12 |  *
   13 |  * This file assumes the user wants to load data into Arrow arrays and
   14 |  * explains how to map Arrow arrays into Lance files.  Encodings are divided
   15 |  * into "structural encodings" (which are used to encode the structure of the
   16 |  * data such as any list or struct layers) and "compressive encodings" (which
   17 |  * are used to compress the actual data values).
   18 |  *
   19 |  * # Standardized Interpretation of Counting Terms
   20 |  *
   21 |  * When working with 2.1 encodings we have a number of different "counting terms" and it can be
   22 |  * difficult to understand what we mean when we are talking about a "number of values".  Here is
   23 |  * a standard interpretation of these terms:
   24 |  *
   25 |  * To understand these definitions consider a data type FIXED_SIZE_LIST<LIST<INT32>>.
   26 |  *
   27 |  * A "value" is an abstract term when we aren't being specific.
   28 |  *
   29 |  * - num_rows: This is the highest level counting term.  A single row includes everything in the
   30 |  *             fixed size list.  This is what the user asks for when they asks for a range of rows.
   31 |  * - num_elements: The number of elements is the number of rows multiplied by the dimension of any
   32 |  *             fixed size list wrappers.  This is what you get when you flatten the FSL layer and
   33 |  *             is the starting point for structural encoding.  Note that an element can be a list
   34 |  *             value or a single primitive value.
   35 |  * - num_items: The number of items is the number of values in the repetition and definition vectors
   36 |  *             after everything has been flattened.
   37 |  * - num_visible_items: The number of visible items is the number of items after invisible items
   38 |  *             have been removed.  Invisible items are rep/def levels that don't correspond to an
   39 |  *             actual value.
   40 |  */
   41 | 
   42 | 
   43 | /* # Structural Encodings
   44 |  *
   45 |  * The following message are used to describe the structural encoding of the
   46 |  * data.  In this document, we refer to these structural encodings as layouts.
   47 |  */
   48 | 
   49 | /* Repetition and definition levels are described in more detail elsewhere.  As we peel through
   50 |  * the structure of an array we will encounter layers of struct and list.  Each of these layers
   51 |  * potentially adds a new level to the repetition and definition levels.  This message describes
   52 |  * the meaning of each layer.
   53 |  */
   54 | enum RepDefLayer {
   55 |   // Should never be used, included for debugging purporses and general protobuf best practice
   56 |   REPDEF_UNSPECIFIED = 0;
   57 |   // All values are valid (can be primitive or struct)
   58 |   REPDEF_ALL_VALID_ITEM = 1;
   59 |   // All list values are valid
   60 |   REPDEF_ALL_VALID_LIST = 2;
   61 |   // There are one or more null items (can be primitive or struct)
   62 |   REPDEF_NULLABLE_ITEM = 3;
   63 |   // A list layer with null lists but no empty lists
   64 |   REPDEF_NULLABLE_LIST = 4;
   65 |   // A list layer with empty lists but no null lists
   66 |   REPDEF_EMPTYABLE_LIST = 5;
   67 |   // A list layer with both empty lists and null lists
   68 |   REPDEF_NULL_AND_EMPTY_LIST = 6;
   69 | }
   70 | 
   71 | /* A layout used for pages where the data is small
   72 |  *
   73 |  * In this case we can fit many values into a single disk sector and transposing buffers is
   74 |  * expensive.  As a result, we do not transpose the buffers but compress the data into small
   75 |  * chunks (called mini blocks) which are roughly the size of a disk sector.
   76 |  *
   77 |  * The end result is a small amount of read amplification (since we must read an entire page
   78 |  * at a time) but we have more flexibility in compression and do less work per value when
   79 |  * compressing and decompressing in bulk.
   80 |  */
   81 | message MiniBlockLayout {
   82 |   /* Description of the compression of repetition levels (e.g. how many bits per rep)
   83 |    *
   84 |    * Optional, if there is no repetition then this field is not present
   85 |    */
   86 |   CompressiveEncoding rep_compression = 1;
   87 |   /* Description of the compression of definition levels (e.g. how many bits per def)
   88 |    *
   89 |    * Optional, if there is no definition then this field is not present
   90 |    */
   91 |   CompressiveEncoding def_compression = 2;
   92 |   // Description of the compression of values
   93 |   CompressiveEncoding value_compression = 3;
   94 |   /* Description of the compression of the dictionary data
   95 |    *
   96 |    * Optional, if there is no dictionary then this field is not present
   97 |    */
   98 |   CompressiveEncoding dictionary = 4;
   99 |   // Number of items in the dictionary
  100 |   uint64 num_dictionary_items = 5;
  101 |   // The meaning of each repdef layer, used to interpret repdef buffers correctly
  102 |   repeated RepDefLayer layers = 6;
  103 |   /* The number of buffers in each mini-block, this is determined by the compression and does
  104 |    * NOT include the repetition or definition buffers (the presence of these buffers can be determined
  105 |    * by looking at the rep_compression and def_compression fields)
  106 |    */
  107 |   uint64 num_buffers = 7;
  108 |   /* The depth of the repetition index.
  109 |    *
  110 |    * If there is repetition then the depth must be at least 1.  If there are many layers
  111 |    * of repetition then deeper repetition indices will support deeper nested random access.  For
  112 |    * example, given 5 layers of repetition then the repetition index depth must be at least
  113 |    * 3 to support access like `rows[50][17][3]`.
  114 |    *
  115 |    * We require `repetition_index_depth + 1` u64 values per mini-block to store the repetition
  116 |    * index if the `repetition_index_depth` is greater than 0.  The +1 is because we need to store
  117 |    * the number of "leftover items" at the end of the chunk.  Otherwise, we wouldn't have any way
  118 |    * to know if the final item in a chunk is valid or not.
  119 |    */
  120 |   uint32 repetition_index_depth = 8;
  121 |   /* The page already records how many rows are in the page.  For mini-block we also need to know how
  122 |    * many "items" are in the page.  A row and an item are the same thing unless the page has lists.
  123 |    */
  124 |   uint64 num_items = 9;
  125 | 
  126 |   // Since Lance 2.2, miniblocks have larger chunk sizes (>= 64KB)
  127 |   bool has_large_chunk = 10;
  128 | }
  129 | 
  130 | /* A layout used for pages where the data is large
  131 |  *
  132 |  * In this case the cost of transposing the data is relatively small (compared to the cost of writing the data)
  133 |  * and so we just zip the buffers together
  134 |  */
  135 | message FullZipLayout {
  136 |   // The number of bits of repetition info (0 if there is no repetition)
  137 |   uint32 bits_rep = 1;
  138 |   // The number of bits of definition info (0 if there is no definition)
  139 |   uint32 bits_def = 2;
  140 |   /* The number of bits of value info
  141 |    *
  142 |    * Note: we use bits here (and not bytes) for consistency with other encodings.  However, in practice,
  143 |    * there is never a reason to use a bits per value that is not a multiple of 8.  The complexity is not
  144 |    * worth the small savings in space since this encoding is typically used with large values already.
  145 |    */
  146 |   oneof details {
  147 |     // If this is a fixed width block then we need to have a fixed number of bits per value
  148 |     uint32 bits_per_value = 3;
  149 |     // If this is a variable width block then we need to have a fixed number of bits per offset
  150 |     uint32 bits_per_offset = 4;
  151 |   }
  152 |   // The number of items in the page
  153 |   uint32 num_items = 5;
  154 |   // The number of visible items in the page
  155 |   uint32 num_visible_items = 6;
  156 |   // Description of the compression of values
  157 |   CompressiveEncoding value_compression = 7;
  158 |   // The meaning of each repdef layer, used to interpret repdef buffers correctly
  159 |   repeated RepDefLayer layers = 8;
  160 | }
  161 | 
  162 | /* A layout used for sparse flat or nested pages where Arrow structure is represented directly
  163 |  * in layer-local slot domains instead of as dense repetition / definition events.
  164 |  *
  165 |  * Structural layers are ordered from outer-most to inner-most. Values remain mini-block
  166 |  * compressed and are split into independently readable chunks.
  167 |  */
  168 | message SparseLayout {
  169 |   // Description of the compression of values.
  170 |   CompressiveEncoding value_compression = 1;
  171 |   // Number of value buffers in each mini-block chunk. This does not include structural buffers.
  172 |   uint64 num_buffers = 2;
  173 |   /* Number of entries in the equivalent dense repetition / definition stream. This equals
  174 |    * num_visible_items plus one structural placeholder for every list slot without children.
  175 |    * Null leaf slots count as visible items because they still occupy positions in Arrow's
  176 |    * leaf value buffer. For example, a nullable primitive with 100 slots, 30 of them null,
  177 |    * has num_items = num_visible_items = 100.
  178 |    */
  179 |   uint64 num_items = 3;
  180 |   // Number of leaf value slots encoded in the value chunks, including null leaf slots.
  181 |   uint64 num_visible_items = 4;
  182 |   // If true, chunk-local value buffer sizes use u32. Otherwise they use u16.
  183 |   bool has_large_chunk = 5;
  184 |   /* Structural layers ordered from outer-most to inner-most. This may be empty for a flat,
  185 |    * non-nullable leaf page whose scheduling domain equals num_visible_items.
  186 |    */
  187 |   repeated SparseStructuralLayer structural_layers = 6;
  188 | }
  189 | 
  190 | /* A domain is a layer-local integer coordinate space [0, num_slots). A slot is one
  191 |  * element in that space. The outer-most domain is the page's top-level rows; each
  192 |  * layer's child domain is the next layer's parent domain, and the terminal child
  193 |  * domain contains num_visible_items leaf value slots.
  194 |  */
  195 | message SparseStructuralLayer {
  196 |   // Exactly one layer kind is required.
  197 |   oneof layer {
  198 |     SparseValidityLayer validity = 1;
  199 |     SparseListLayer list = 2;
  200 |     SparseFixedSizeListLayer fixed_size_list = 3;
  201 |   }
  202 | }
  203 | 
  204 | message SparseValidityLayer {
  205 |   // Number of nullable item or struct slots in this layer's parent and child domain.
  206 |   uint64 num_slots = 1;
  207 |   // Validity for the slots in this layer.
  208 |   SparseValiditySet validity = 2;
  209 | }
  210 | 
  211 | message SparseListLayer {
  212 |   // Number of list, large-list, or map slots in this layer's parent domain.
  213 |   uint64 num_slots = 1;
  214 |   // Number of slots in this layer's child domain.
  215 |   uint64 num_child_slots = 2;
  216 |   // Non-empty parent slots. Valid parent slots absent from this set are empty lists.
  217 |   SparsePositionSet non_empty_positions = 3;
  218 |   // Positive child counts corresponding one-for-one with non_empty_positions.
  219 |   SparseCountSet counts = 4;
  220 |   // Validity for the parent slots in this layer.
  221 |   SparseValiditySet validity = 5;
  222 | }
  223 | 
  224 | message SparseFixedSizeListLayer {
  225 |   // Number of fixed-size-list slots in this layer's parent domain.
  226 |   uint64 num_slots = 1;
  227 |   // Number of children per parent slot. The child domain has num_slots * dimension slots.
  228 |   uint64 dimension = 2;
  229 |   // Validity for the parent slots in this layer.
  230 |   SparseValiditySet validity = 3;
  231 | }
  232 | 
  233 | message SparseValiditySet {
  234 |   enum Meaning {
  235 |     SPARSE_VALIDITY_UNSPECIFIED = 0;
  236 |     // Stored positions are null; all other positions are valid.
  237 |     SPARSE_VALIDITY_NULL_POSITIONS = 1;
  238 |     // Stored positions are valid; all other positions are null.
  239 |     SPARSE_VALIDITY_VALID_POSITIONS = 2;
  240 |   }
  241 | 
  242 |   Meaning meaning = 1;
  243 |   SparsePositionSet positions = 2;
  244 | }
  245 | 
  246 | message SparsePositionEmpty {}
  247 | 
  248 | message SparsePositionAll {}
  249 | 
  250 | message SparsePositionRange {
  251 |   uint64 start = 1;
  252 |   uint64 length = 2;
  253 | }
  254 | 
  255 | message SparsePositionSet {
  256 |   oneof positions {
  257 |     // Delta-compressed u64 positions. Cardinality is num_positions.
  258 |     CompressiveEncoding explicit = 1;
  259 |     // One contiguous, non-empty range.
  260 |     SparsePositionRange range = 2;
  261 |     // Every position in the domain.
  262 |     SparsePositionAll all = 3;
  263 |     // No positions in the domain.
  264 |     SparsePositionEmpty empty = 4;
  265 |   }
  266 |   // Semantic cardinality of this set.
  267 |   uint64 num_positions = 5;
  268 | }
  269 | 
  270 | message SparseCountEmpty {}
  271 | 
  272 | message SparseCountConstant {
  273 |   // Child count shared by every non-empty list slot.
  274 |   uint64 value = 1;
  275 | }
  276 | 
  277 | message SparseCountSet {
  278 |   oneof counts {
  279 |     // Compressed u64 child counts. Cardinality comes from the containing position set.
  280 |     CompressiveEncoding explicit = 1;
  281 |     // One positive child count shared by every non-empty list slot.
  282 |     SparseCountConstant constant = 2;
  283 |     // No counts; valid only when there are no non-empty list slots.
  284 |     SparseCountEmpty empty = 3;
  285 |   }
  286 | }
  287 | 
  288 | /* A layout used for pages where all (visible) values are the same scalar value.
  289 |  *
  290 |  * This generalizes the prior AllNullLayout semantics for file_version >= 2.2.
  291 |  *
  292 |  * There may be buffers of repetition and definition information if required in order
  293 |  * to interpret what kind of nulls are present / which items are visible.
  294 |  */
  295 | message ConstantLayout {
  296 |   // The meaning of each repdef layer, used to interpret repdef buffers correctly
  297 |   repeated RepDefLayer layers = 5;
  298 | 
  299 |   /* Inline fixed-width scalar value bytes.
  300 |    *
  301 |    * This MUST only be used for types where a single non-null element is represented by a single
  302 |    * fixed-width Arrow value buffer (i.e. no offsets buffer, no child data).
  303 |    *
  304 |    * Constraints:
  305 |    * - MUST be absent for an all-null page
  306 |    * - MUST be <= 32 bytes if present
  307 |    */
  308 |   optional bytes inline_value = 6;
  309 | 
  310 |   /* Optional compression algorithm used for the repetition buffer.
  311 |    * If absent, repetition levels are stored as raw u16 values.
  312 |    */
  313 |   CompressiveEncoding rep_compression = 7;
  314 |   /* Optional compression algorithm used for the definition buffer.
  315 |    * If absent, definition levels are stored as raw u16 values.
  316 |    */
  317 |   CompressiveEncoding def_compression = 8;
  318 |   // Number of values in repetition buffer after decompression.
  319 |   uint64 num_rep_values = 9;
  320 |   // Number of values in definition buffer after decompression.
  321 |   uint64 num_def_values = 10;
  322 | }
  323 | 
  324 | /* A layout where large binary data is encoded externally and only
  325 |  * the descriptions (position + size) are placed in the page
  326 |  *
  327 |  * Repdef information is stored in the descriptions.  A description with a size of
  328 |  * 0 and a position of 0 is an empty value.  A description with a size of 0 and a
  329 |  * non-zero position is a null value and the position is the repdef value.
  330 |  */
  331 | message BlobLayout {
  332 |   // The inner layout used to store the descriptions
  333 |   PageLayout inner_layout = 1;
  334 |   /* The meaning of each repdef layer, used to interpret repdef buffers correctly
  335 |    *
  336 |    * The inner layout's repdef layers will always be 1 all valid item layer
  337 |    */
  338 |   repeated RepDefLayer layers = 2;
  339 | }
  340 | 
  341 | // Describes the structural encoding of a page
  342 | message PageLayout {
  343 |   oneof layout {
  344 |     // A layout used for pages where the data is small
  345 |     MiniBlockLayout mini_block_layout = 1;
  346 |     // A layout used for pages where all (visible) values are the same scalar value or null.
  347 |     ConstantLayout constant_layout = 2;
  348 |     // A layout used for pages where the data is large
  349 |     FullZipLayout full_zip_layout = 3;
  350 |     /* A layout where large binary data is encoded externally
  351 |      * and only the descriptions are put in the page
  352 |      */
  353 |     BlobLayout blob_layout = 4;
  354 |     // A sparse structural layout. This variant requires file version 2.3 or later.
  355 |     SparseLayout sparse_layout = 5;
  356 |   }
  357 | }
  358 | 
  359 | /* # Compressive Encodings
  360 |  *
  361 |  * These encodings describe how an array is compressed.  An encoding may split an
  362 |  * array into multiple buffers.  The buffers can then be compressed further (and split
  363 |  * into yet more buffers).  The entire process forms a tree of encodings with the root
  364 |  * of the tree being the initial array and the leaves being the final compressed buffers.
  365 |  *
  366 |  * # Data blocks and buffers
  367 |  *
  368 |  * Data blocks are a simplified version of arrays and represent a collection of buffers grouped
  369 |  * with some kind of interpretation.  Data blocks are the input and output of compressive encodings.
  370 |  * There are different kinds of data blocks:
  371 |  * - Fixed width data blocks (e.g. u8, u16, ...)
  372 |  * - Variable width data blocks (e.g. strings, binary)
  373 |  * - Struct data blocks (note: this is for packed structs, normal structs are encoded in the structural encoding)
  374 |  *
  375 |  * In addition, leaf encodings may output "buffers".  These are fully compressed buffers of data that
  376 |  * are stored in the page and no longer compressed.
  377 |  */
  378 | 
  379 | enum CompressionScheme {
  380 |   COMPRESSION_ALGORITHM_UNSPECIFIED = 0;
  381 |   COMPRESSION_ALGORITHM_LZ4 = 1;
  382 |   COMPRESSION_ALGORITHM_ZSTD = 2;
  383 | }
  384 | 
  385 | /* Compression applied to a single buffer of data
  386 |  *
  387 |  * A buffer is the leaf of the compression tree.  Unlike data blocks, which can
  388 |  * be further compressed with a variety of techniques, a buffer cannot be understood
  389 |  * in any particular way.
  390 |  *
  391 |  * A general compression scheme may be applied to a buffer.  This is something like
  392 |  * zstd, lz4, etc.  The entire buffer is compressed as a single unit.  If this happens
  393 |  * then any parent encoding becomes opaque, even if it would normally be transparent.
  394 |  *
  395 |  * This is a leaf, no further compression is applied to the data.
  396 |  */
  397 | message BufferCompression {
  398 |   // A general compression scheme to apply to the buffer
  399 |   CompressionScheme scheme = 1;
  400 |   /* The compression level
  401 |    *
  402 |    * Optional, if not present a scheme-specific default value will be used.
  403 |    *
  404 |    * Interpretation of this value depends on the compression scheme.  Generally, larger
  405 |    * values indicate more compression at the expense of more CPU time.
  406 |    */
  407 |   optional int32 level = 2;
  408 | }
  409 | 
  410 | /* Fixed width items placed contiguously in a single buffer
  411 |  *
  412 |  * This is a leaf encoding, there is no compression applied to the data.
  413 |  *
  414 |  * This is a transparent encoding by definition.
  415 |  *
  416 |  * The input is a fixed-width data block.
  417 |  * The output is a single buffer.
  418 |  */
  419 | message Flat {
  420 |   /* the number of bits per value, must be greater than 0, does
  421 |    * not need to be a multiple of 8
  422 |    */
  423 |   uint64 bits_per_value = 1;
  424 |   // The compression applied to the data
  425 |   optional BufferCompression data = 2;
  426 | }
  427 | 
  428 | /* Variable width items have the values stored in one buffer and the
  429 |  * offsets are output as a data block that may be further compressed.
  430 |  *
  431 |  * This is a partial leaf encoding.  Values are not compressed but
  432 |  * the offsets may be further compressed.
  433 |  *
  434 |  * This is a transparent encoding by definition.
  435 |  *
  436 |  * The input is a variable-width data block.
  437 |  * The output is a single fixed-width data block (the offsets) and
  438 |  * a single buffer (the values)
  439 |  */
  440 | message Variable {
  441 |   // Describes how the offsets data block is compressed
  442 |   CompressiveEncoding offsets = 1;
  443 |   // The compression applied to the values
  444 |   optional BufferCompression values = 2;
  445 | }
  446 | 
  447 | /* Compression algorithm where all values have a constant value (encoded in the description)
  448 |  *
  449 |  * This is a leaf encoding, there is no compression applied to the data.
  450 |  *
  451 |  * The input can be any kind of data block.
  452 |  * There is no output.
  453 |  */
  454 | message Constant {
  455 |   // The value (TODO: define encoding for literals?)
  456 |   optional bytes value = 1;
  457 | }
  458 | 
  459 | /* A compression scheme in which a single fixed-width block is "packed" into
  460 |  * a smaller fixed-width block values where each value has fewer bits.
  461 |  *
  462 |  * This is typically done by throwing away the most significant bits of each value when
  463 |  * those bits are all the same.
  464 |  *
  465 |  * In this scheme the number of bits per value is fixed across the entire buffer and stored
  466 |  * in this message.
  467 |  *
  468 |  * This is a transparent encoding.
  469 |  *
  470 |  * The input is a fixed-width data block.
  471 |  * The output is a single fixed-width data block.
  472 |  */
  473 | message OutOfLineBitpacking {
  474 |   // the number of bits of the uncompressed value. e.g. for a u32, this will be 32
  475 |   uint64 uncompressed_bits_per_value = 1;
  476 |   // The compression used to store the bitpacked values data block
  477 |   CompressiveEncoding values = 3;
  478 | }
  479 | 
  480 | /* Bitpacking variant where the bits per value are stored inline in the chunks themselves
  481 |  *
  482 |  * This variation of bitpacking allows for the number of bits per value to change throughout the
  483 |  * buffer, which makes the compression more robust to outliers.
  484 |  *
  485 |  * This is an opaque encoding.
  486 |  *
  487 |  * The input is a fixed-width data block.
  488 |  * The output is a single buffer.
  489 |  */
  490 | message InlineBitpacking {
  491 |   // the number of bits of the uncompressed value. e.g. for a u32, this will be 32
  492 |   uint64 uncompressed_bits_per_value = 1;
  493 |   // The compression applied to the values
  494 |   optional BufferCompression values = 2;
  495 | }
  496 | 
  497 | /* A compression scheme for variable-width data
  498 |  *
  499 |  * A small dictionary (referred to as a "symbol table") is used to compress the values.
  500 |  * In this scheme there is a single symbol table for the entire page and it is stored in the
  501 |  * encoding description itself.
  502 |  *
  503 |  * This is a transparent encoding.
  504 |  *
  505 |  * The input is a variable-width data block.
  506 |  * The output is a single variable-width data block.
  507 |  */
  508 | message Fsst {
  509 |   // The FSST symbol table
  510 |   bytes symbol_table = 1;
  511 |   // The compression used to store the compressed values data block
  512 |   CompressiveEncoding values = 2;
  513 | }
  514 | 
  515 | /* A compression scheme where common values are stored in a dictionary and the values are
  516 |  * encoded as indices into the dictionary.
  517 |  *
  518 |  * This is an opaque encoding unless the dictionary is considered metadata.
  519 |  *
  520 |  * The input is a any kind of data block.
  521 |  * There are two outputs:
  522 |  * - A data block of the same kind as the input (the dictionary)
  523 |  * - A fixed-width data block containing the indices into the dictionary.
  524 |  */
  525 | message Dictionary {
  526 |   // The compression used to store the indices data block
  527 |   CompressiveEncoding indices = 1;
  528 |   // The compression used to store the dictionary items data block
  529 |   CompressiveEncoding items = 2;
  530 |   // The number of items in the dictionary
  531 |   uint32 num_dictionary_items = 3;
  532 | }
  533 | 
  534 | /* A compression scheme where runs of common values are encoded as a single value and a count
  535 |  *
  536 |  * This is an opaque encoding unless the run lengths are considered metadata.
  537 |  *
  538 |  * The input is a single data block of any kind.
  539 |  * There are two outputs:
  540 |  * - A data block of the same kind as the input (the run values)
  541 |  * - A fixed-width data block containing the lengths of the runs
  542 |  */
  543 | message Rle {
  544 |   // The compression used to store the run values data block
  545 |   CompressiveEncoding values = 1;
  546 |   // The compression used to store the run lengths data block
  547 |   CompressiveEncoding run_lengths = 2;
  548 | }
  549 | 
  550 | /* Converts a fixed-size-list of values into a flattened list of values
  551 |  *
  552 |  * This encoding does not actually compress the data, it just flattens out the FSL layers.
  553 |  *
  554 |  * This is a transparent encoding.
  555 |  *
  556 |  * The input is a single block of fixed-width data (with a wide width and few items)
  557 |  * The output is a single block of fixed-width data (with a narrow width and many items)
  558 |  */
  559 | message FixedSizeList {
  560 |   // The number of items in this layer of FSL
  561 |   uint64 items_per_value = 1;
  562 |   // Whether or not there is a validity buffer
  563 |   bool has_validity = 3;
  564 |   // The compression used to store the flattened values data block
  565 |   CompressiveEncoding values = 2;
  566 | }
  567 | 
  568 | /* Packs a struct containing only fixed-width children into a single fixed-width data block
  569 |  *
  570 |  * The children are concatenated row by row and stored as a single fixed-width buffer. This is
  571 |  * the legacy packed struct representation and remains available for backwards compatibility.
  572 |  */
  573 | message PackedStruct {
  574 |   // The number of bits contributed by each child field in the packed row
  575 |   repeated uint64 bits_per_value = 1;
  576 |   // The compression used to store the packed fixed-width values
  577 |   CompressiveEncoding values = 2;
  578 | }
  579 | 
  580 | /* Variable-width packed struct encoding (2.2 extension)
  581 |  *
  582 |  * Each child value is compressed independently before being transposed into
  583 |  * a row-major layout. This preserves per-field compression boundaries at the
  584 |  * cost of disabling mini-block compression. Readers must prefer this field
  585 |  * when present and fall back to the legacy encoding otherwise.
  586 |  */
  587 | message VariablePackedStruct {
  588 |   // Per-field encoding metadata in struct order
  589 |   repeated FieldEncoding fields = 1;
  590 | 
  591 |   // Encoding description for a single child field
  592 |   message FieldEncoding {
  593 |     // Compression applied to individual field values before transposition
  594 |     CompressiveEncoding value = 1;
  595 |     oneof layout {
  596 |       // Bit width of each compressed value (when fixed width)
  597 |       uint64 bits_per_value = 2;
  598 |       // Bit width of the length prefix for variable-width compressed values
  599 |       uint64 bits_per_length = 3;
  600 |     }
  601 |   }
  602 | }
  603 | 
  604 | /* A compression scheme that wraps the underlying data with general compression
  605 |  *
  606 |  * Note: The application of wrapped compression will depend on the layout of the data.
  607 |  * If we apply it to mini-block data then we compress entire mini-blocks.  If we apply
  608 |  * it to full-zip data then we compress each value individually.
  609 |  *
  610 |  * Note: Wrapped compression is somewhat unique at the moment as it is applied to the
  611 |  * output of the inner encoding and not the input like all other compressive encodings.
  612 |  *
  613 |  * Note: General compression can usually be applied in two spots.  We can apply
  614 |  * it to individual buffers or we can apply it here, to the entire array.
  615 |  *
  616 |  * For example, let's say we are storing mini-blocks of strings and we are using
  617 |  * FSST and bitpacking the offsets.  We have something like this...
  618 |  *
  619 |  * WRAPPED(†3) -> FSST -> VARIABLE -(offsets)-> INLINE_BITPACKING -(data)-> FLAT -> BUFFER (†1)
  620 |  *                                 -(data)-> BUFFER (†2)
  621 |  *
  622 |  * General compression can be applied at †1, †2, or †3 (or any combination of these).
  623 |  *
  624 |  * If we apply it at †1 then we apply it just to the bitpacked offsets
  625 |  * If we apply it at †2 then we apply it just to the FSST compressed data
  626 |  * If we apply it at †3 then we apply it to the entire mini-block (both offsets and data)
  627 |  *
  628 |  * The input is a single data block of any kind.
  629 |  * The output is a single data block of the same kind as the input.
  630 |  */
  631 | message General {
  632 |   // The compression to apply to the values
  633 |   BufferCompression compression = 1;
  634 |   // The compression used to store the output data block
  635 |   CompressiveEncoding values = 3;
  636 | }
  637 | 
  638 | /* A compression scheme where fixed-width values are transposed into a series of byte streams
  639 |  *
  640 |  * This is commonly used for floating point values where the upper bits (the mantissa) have a
  641 |  * significantly different meaning than the lower bits.  By splitting the values into byte streams
  642 |  * we group the mantissa bits together and the exponent bits together.  The end result is typically
  643 |  * more compressible.
  644 |  *
  645 |  * Note that this encoding is mostly useful when combined with other encodings.  It does not do any
  646 |  * compression on its own.
  647 |  *
  648 |  * This is an opaque encoding.
  649 |  *
  650 |  * The input is a fixed-width data block
  651 |  * The output is a single fixed-width data block
  652 |  */
  653 | message ByteStreamSplit {
  654 |   // The compression used to store the values
  655 |   CompressiveEncoding values = 1;
  656 | }
  657 | 
  658 | // An encoding that compresses a data block into buffers
  659 | message CompressiveEncoding {
  660 |     oneof compression {
  661 |         Flat flat = 1;
  662 |         Variable variable = 2;
  663 |         Constant constant = 3;
  664 |         OutOfLineBitpacking out_of_line_bitpacking = 4;
  665 |         InlineBitpacking inline_bitpacking = 5;
  666 |         Fsst fsst = 6;
  667 |         Dictionary dictionary = 7;
  668 |         Rle rle = 8;
  669 |         ByteStreamSplit byte_stream_split = 9;
  670 |         General general = 10;
  671 |         FixedSizeList fixed_size_list = 11;
  672 |         PackedStruct packed_struct = 12;
  673 |         VariablePackedStruct variable_packed_struct = 13;
  674 |     }
  675 | }
``````
