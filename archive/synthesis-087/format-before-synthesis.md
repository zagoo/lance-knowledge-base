> Historical chronology before M1 synthesis. [Current contract](../../L3-symbols/format-spec.md).

> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

# Persisted and wire format reconstruction

**M1 synthesis pending.** Verified schema, file-version and encoding contracts below are retained. V2.1 requires a complete format contract with precise implementation pointers; it does not require new exhaustive source or binary analysis.

[Orientation](../../L0-orientation.md) · [Module](../../L1-modules/protos.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Behavior](../../L3-symbols/behavior-contracts.md) · [Pitfalls](../../L4-crosscutting/pitfalls.md)

## Contract classes

Persisted stable schemas must retain existing tags; schemas used exclusively in unstable formats may change without old-unstable compatibility. Verify shared use before making a breaking change. ANN, filtered-read, and table-identity are execution wire schemas and keep field-number compatibility unless producers and consumers upgrade atomically. (protos/AGENTS.md:5-15)

## Fragment and row lineage state

See the [complete fragment schema analysis](../../L2-files/protos/fragment_metadata.proto.md) for every tag and exact declaration. A fragment owns a unique ID, data-file list, optional deletion metadata, overlays, physical row count, and three mutually exclusive inline/column lineage pairs. Column lineage uses -3/-4/-5 system field IDs, one matching file per sequence, non-null uint64 values, and exactly physical_rows values. Only v2 data files supply the needed column mapping; flag 2048 protects old readers from silently interpreting an unknown arm as absence. (protos/fragment_metadata.proto:8-87; protos/fragment_metadata.proto:288-305)

Overlay interpretation is ordered by committed_version, then list position. Deleted offsets never become visible because of an overlay. Rank below an offset in its field bitmap selects a value, so unequal field coverage permits unequal physical value-column lengths. A covered NULL differs from a missing offset. Flag 64 gates use. (protos/fragment_metadata.proto:19-27; protos/fragment_metadata.proto:185-249)

Deletion paths combine fragment ID, read version, and opaque concurrent-write ID; protobuf comments describe one Int32Array Arrow IPC column/batch and .arrow, Roaring .bin. The current implementation uses UInt32 instead, as documented in the actual-payload section below. (protos/fragment_metadata.proto:251-286)

The [row-ID schema](../../L2-files/protos/rowids.proto.md) defines half-open ranges, sorted holes and sorted/general arrays with16/32-bit relative deltas or raw u64 values. Its bitmap comment says MSB-first, but this checkout reads/writes LSB-first and asserts bytes[0xfb,0x03] for ten positions with bit2 cleared. Packed integers use little-endian bytes in implementation; schema alone omits endianness. This is a documented comment/code discrepancy, not a verified historical migration. (protos/rowids.proto:20-104; rust/lance-table/src/rowids/bitmap.rs:67-77; rust/lance-table/src/rowids/serde.rs:174-230; rust/lance-table/src/rowids/serde.rs:301-338; rust/lance-table/src/rowids/serde.rs:436-451)

## Fragment-tree representation

A version selects an inline root or 16-byte display-order UUID root stored at _bt/root/{lowercase hyphenated UUID}.root, plus mutations absent from the root. Children partition fragment IDs by half-open min-key boundaries; counts include buffered changes. Leaf materialization watermarks certify no earlier pending mutation above the leaf, while interiors use zero. Mutations carry exact signed aggregate deltas. These describe persisted state, not a verified balancing or commit algorithm. (protos/fragment_metadata.proto:317-405)

## Index details

Exact fields and values are retained in [index.proto](../../L2-files/protos/index.proto.md) and [index_old.proto](../../L2-files/protos/index_old.proto.md). Historical detail package identities stay in lance.table; new ones belong to lance.index.pb. Empty detail messages carry kind identity even without parameters. (protos/index_old.proto:8-28; protos/index.proto:6-6; protos/index.proto:250-258)

MinHash LSH is explicitly experimental. num_hashes is 1..4096 and divisible by num_bands (1..256); shingle_size is positive; tokenizer details must be self-contained and identical across segments. Signature version is separate from file format, and readers reject unsupported procedures. (protos/index.proto:260-310)

## Execution-wire state

The complete [ANN](../../L2-files/protos/ann.proto.md), [filtered read](../../L2-files/protos/filtered_read.proto.md), and [table identity](../../L2-files/protos/table_identifier.proto.md) analyses retain all message tags. Covering projection preserves absent/present-empty/present-selected states. Child execution plans are handled by the physical codec rather than embedded here. Planned filters use a deduplicated expression array with fragment-to-array-index mapping. (protos/ann.proto:28-41; protos/ann.proto:73-90; protos/filtered_read.proto:79-116)

## V2 envelope and encoding layers

The minimal envelope permits independent item counts per column and stores byte buffers without imposing logical types. Data precedes column metadata, column metadata offset table, global buffer offset table, then the footer. Footer fields in order are three little-endian u64 offsets (column metadata start, column metadata table, global buffer table), two u32 counts (global buffers, columns), two u16 versions (major, minor), and LANC. Those widths imply 40 bytes by arithmetic, pending comparison to reader constants. Padding may precede aligned buffers/metadata/table starts. Page buffers may be noncontiguous; 8 MB pages are advice, not a hard validity bound. (protos/file2.proto:11-115)

```text
file2 envelope
  data buffers
  column metadata blocks
    column encoding + optional column buffers
    pages: buffers + length + encoding + priority
  column metadata position/size table
  global buffer position/size table
  footer: A:u64 B:u64 C:u64 globals:u32 columns:u32 major:u16 minor:u16 LANC
```

The tree above reproduces the schema's composition: encoding locations are direct bytes, deferred byte range, or explicit none; page/column buffer offsets and sizes must have matching cardinality. Top-level row priority is distinct from a page's logical length. (protos/file2.proto:117-216)

The older lance.encodings namespace models Nullable/List/FixedSizeList and scalar transformations as ArrayEncoding, with ColumnEncoding wrappers for plain values, zone maps and blob descriptions. Its List encoding folds nullness into end offsets, but a strict greater-than null test in the comments conflicts with the formula at an equality boundary; see the [full analysis](../../L2-files/protos/encodings_v2_0.proto.md). This must be resolved from the decoder before implementing compatible list bytes. (protos/encodings_v2_0.proto:59-155; protos/encodings_v2_0.proto:307-358)

The newer lance.encodings21 namespace separates structural layouts from compressive blocks. Layouts are MiniBlock, Constant, FullZip, Blob and Sparse; recursive compression alternatives include Flat, Variable, Constant, both bitpacking forms, FSST, Dictionary, RLE, ByteStreamSplit, General, FixedSizeList and both packed-struct forms. Exact fields and tag identities are in the [complete encoding analysis](../../L2-files/protos/encodings_v2_1.proto.md). (protos/encodings_v2_1.proto:341-357; protos/encodings_v2_1.proto:658-675)

| Declared extension | Schema gate or constraint | Evidence |
|---|---|---|
| Large mini-block chunks | Since 2.2; has_large_chunk marker; comment describes at least 64 KB | protos/encodings_v2_1.proto:126-127 |
| Non-null ConstantLayout | Version >=2.2; inline fixed-width scalar <=32 bytes; absent for all-null | protos/encodings_v2_1.proto:288-308 |
| VariablePackedStruct | 2.2 extension; child compression before row transposition; disables mini-block compression | protos/encodings_v2_1.proto:580-602 |
| SparseLayout | File version 2.3 or later | protos/encodings_v2_1.proto:354-355 |
| Blob description null/empty | Zero size+zero position empty; zero size+nonzero position null, position is repdef | protos/encodings_v2_1.proto:324-339 |
| Constant rep/def absence | Raw u16 level buffers when compression description absent | protos/encodings_v2_1.proto:310-321 |

These are documented gates, not an exhaustive list of accepted runtime versions. The schema name alone does not imply every arm is valid in 2.1. (protos/encodings_v2_1.proto:126-127; protos/encodings_v2_1.proto:288-290; protos/encodings_v2_1.proto:354-355; protos/encodings_v2_1.proto:580-585)

## Manifest flags and index interpretation

Unknown reader bits prohibit reads; unknown writer bits prohibit writes. Bit identities are shared but the two words need not be equal. The following list joins explicitly reviewed schema comments; it is not a claim to exhaust implementation flags. (protos/table.proto:116-171)

| Bit / value | Declared meaning | Evidence |
|---|---|---|
| 0 / 1 | Deletion files | protos/table.proto:123-123 |
| 1 / 2 | Stable row IDs | protos/table.proto:124-124 |
| 2 / 4 | Deprecated v2 marker | protos/table.proto:125-125 |
| 3 / 8 | Table config | protos/table.proto:126-126 |
| 4 / 16 | Multiple bases | protos/table.proto:127-127 |
| 5 / 32 | Transaction file writes disabled | protos/table.proto:128-128 |
| 6 / 64 | Overlay cells present | protos/table.proto:129-131 |
| 7 / 128 | Covering index columns; coupled to bit 13 when independent declarations are used | protos/table.proto:132-139; protos/table.proto:147-158 |
| 8 / 256 | Mixed recognized exact v2 data-file versions; paired and one-way | protos/table.proto:140-143 |
| 9 / 512 | Stable IDs with fragment reuse index | protos/table.proto:144-144 |
| 11 / 2048 | Spilled row-lineage columns; omitted from table.proto's comment list | protos/fragment_metadata.proto:43-51 |
| 12 / 4096 | Fragment tree; inline fragment list empty | protos/table.proto:47-50; protos/table.proto:145-146 |
| 13 / 8192 | Independent key and covering declarations; atomic normalization and retained paired bit 7 | protos/table.proto:147-158 |

DataStorageFormat.version is a default write version. Without mixed capability it constrains every referenced data file; with capability, each recognized exact v2 DataFile version drives decoding. It does not constrain index files. (protos/table.proto:203-223)

Index Any type URLs are compared case-insensitively; simple btree resolves to /lance.table.BTreeIndexDetails. Fragment coverage is a persisted 32-bit Roaring bitmap because the historical build version can disappear. Under bit 13 keys and covering fields are independent and maintenance depends on their union; under the legacy form carrying is a suffix and a keyed-and-carried field appears twice. In either case, actual segment storage determines whether covered payload can be served: missing declared payload is legal and requires a base take. (protos/table.proto:290-388)

## Transactions and MemWAL

External transaction files use _transactions/{read_version}-{uuid}.txn; inline transaction sections start with u32 message length. The transaction operation union uses tags 100..115, while old blob operations 200/202 are reserved. Every operation payload is retained in the [transaction L2 analysis](../../L2-files/protos/transaction.proto.md). These declarations do not reconstruct commit conflict resolution by themselves. (protos/table.proto:179-195; protos/transaction.proto:410-433)

MemWAL metadata separates shard-manifest authority, background discovery snapshots, atomic compacted-generation progress, and asynchronous per-index catch-up. Recovery lists actual WAL state because last-seen position is a hint. Missing catch-up means unknown and keeps SSTables live. This separation prevents snapshot refresh from falsely certifying compaction/index coverage. (protos/table.proto:530-562; protos/table.proto:612-650; protos/table.proto:698-722)

## Core logical-type grammar

This is the reviewed core string grammar, used with separate Field children. It is not a complete wire codec or version-gate specification. [Exact source and annotations](../../L2-files/rust/lance-core/src/datatypes.rs.md) retain every parsing arm. (rust/lance-core/src/datatypes.rs:317-559; rust/lance-core/src/datatypes/field.rs:170-195)

| Logical text | Arrow type / restrictions | Evidence |
|---|---|---|
| null; bool | Null; Boolean | rust/lance-core/src/datatypes.rs:321-324; rust/lance-core/src/datatypes.rs:420-423 |
| int8/uint8, int16/uint16, int32/uint32, int64/uint64 | Corresponding signed/unsigned width | rust/lance-core/src/datatypes.rs:324-331; rust/lance-core/src/datatypes.rs:424-431 |
| halffloat; float; double | Float16; Float32; Float64 | rust/lance-core/src/datatypes.rs:332-334; rust/lance-core/src/datatypes.rs:432-434 |
| string; binary; large_string; large_binary | Utf8; Binary; LargeUtf8; LargeBinary; views encode as base string/binary | rust/lance-core/src/datatypes.rs:337-340; rust/lance-core/src/datatypes.rs:435-438 |
| blob; json | LargeBinary in the inverse parser; metadata interpretation is separate | rust/lance-core/src/datatypes.rs:439-440; rust/lance-core/src/datatypes/field.rs:1279-1292 |
| date32:day; date64:ms | Date32; Date64 | rust/lance-core/src/datatypes.rs:341-342; rust/lance-core/src/datatypes.rs:441-442 |
| time32:s/ms; time64:us/ns | Inverse accepts these exact valid unit combinations | rust/lance-core/src/datatypes.rs:443-446 |
| duration:s/ms/us/ns | All four TimeUnit values | rust/lance-core/src/datatypes.rs:447-450 |
| timestamp:unit:timezone | unit s/ms/us/ns; timezone tail rejoined with colon; exactly - => None; no timezone validity check | rust/lance-core/src/datatypes.rs:345-351; rust/lance-core/src/datatypes.rs:539-554 |
| decimal:bits:precision:scale | bits i16 restricted to128/256; precision u8; scale i8; other semantic bounds not checked here | rust/lance-core/src/datatypes.rs:335-336; rust/lance-core/src/datatypes.rs:514-538 |
| fixed_size_binary:size | Exact two components; size i32 without positivity check here | rust/lance-core/src/datatypes.rs:394-394; rust/lance-core/src/datatypes.rs:492-501 |
| fixed_size_list:child:size | Last component i32, middle rejoined then recursively parsed; bfloat extension creates nullable item FixedSizeBinary(2) | rust/lance-core/src/datatypes.rs:379-393; rust/lance-core/src/datatypes.rs:457-491 |
| dict:value:index:flag | Exactly four components; recursive value/index parse, flag ignored; encoder emits false and probes parseability | rust/lance-core/src/datatypes.rs:354-370; rust/lance-core/src/datatypes.rs:502-513 |
| struct; list/list.struct; large_list/large_list.struct; map | Requires separately retained children through Field::data_type; map reconstructed sorted=false | rust/lance-core/src/datatypes.rs:353-353; rust/lance-core/src/datatypes.rs:371-378; rust/lance-core/src/datatypes.rs:395-406; rust/lance-core/src/datatypes/field.rs:170-195 |

An immediate FixedSizeList Struct child is stored as a Field child and reconstructed by a special prefix path. Nested fixed-size-list Struct and variable List/LargeList/Map inside a fixed-size list are rejected by the support check. Changing the string grammar requires coordinating both conversion directions and child representation; parseability alone does not promise exact original Arrow metadata or view identity. (rust/lance-core/src/datatypes.rs:296-305; rust/lance-core/src/datatypes.rs:354-393; rust/lance-core/src/datatypes/field.rs:175-183; rust/lance-core/src/datatypes/field.rs:1217-1226)

## Blob descriptor schema contract

The source explicitly marks stored v2 descriptor field names as stable. Ordered children are kind:UInt8, position:UInt64, size:UInt64, blob_id:UInt32, blob_uri:Utf8, canonically all required. The canonical outer description field is required and has blob=true plus lance-encoding:packed=true metadata. The structural classifier deliberately ignores descriptor child nullability to accept released representations that used nullable kind versus parent validity, while still requiring exact names/order/types. (rust/lance-core/src/datatypes.rs:115-188; rust/lance-core/src/datatypes.rs:200-218)

| Kind byte | Documented location interpretation | Evidence |
|---|---|---|
| 0 Inline | position/size point into main-file out-of-line buffer | rust/lance-core/src/datatypes.rs:120-121; rust/lance-core/src/datatypes.rs:599-600 |
| 1 Packed | blob_id selects shared packed sidecar, position/size select slice | rust/lance-core/src/datatypes.rs:122-123; rust/lance-core/src/datatypes.rs:601-602 |
| 2 Dedicated | blob_id selects raw sidecar, position0, size whole file length | rust/lance-core/src/datatypes.rs:124-125; rust/lance-core/src/datatypes.rs:603-604 |
| 3 External | blob_id0 means absolute blob_uri; positive id selects manifest base path; position/size range with zero size resolved to whole-object length | rust/lance-core/src/datatypes.rs:126-128; rust/lance-core/src/datatypes.rs:605-613 |

Unknown kind bytes return InvalidInput. No offsets, lengths, URI bases or actual data bytes are validated by this enum conversion. Read/write implementation, byte packing, feature/version gates and historical fixture validation remain pending. Logical/prepared layout tables and metadata transformations are in the [datatype supplement](../../L1-modules/rust-lance-core-datatypes.md). (rust/lance-core/src/datatypes.rs:616-629)
## Ordered and stable-partition row mapping

The local counts codec is implemented, unlike the still-pending full FRI label-column format. All integers here are little-endian. LSPC/version1/repr0 belong to this helper; released stability and enclosing dataset version gates are not established. (rust/lance-core/src/utils/stable_partition.rs:74-82; rust/lance-core/src/utils/stable_partition.rs:220-290)

| Byte offset | Width | Value | Evidence |
|---|---|---|---|
| 0 | 4 bytes | ASCII LSPC magic | rust/lance-core/src/utils/stable_partition.rs:74-77; rust/lance-core/src/utils/stable_partition.rs:223-225 |
| 4 | u32 | version=1; only1 accepted | rust/lance-core/src/utils/stable_partition.rs:226-226; rust/lance-core/src/utils/stable_partition.rs:254-257 |
| 8 | u32 | representation=0 (dense); unknown tags rejected | rust/lance-core/src/utils/stable_partition.rs:227-227; rust/lance-core/src/utils/stable_partition.rs:258-263 |
| 12 | u32 | num_destinations m, 1..=65536 | rust/lance-core/src/utils/stable_partition.rs:228-228; rust/lance-core/src/utils/stable_partition.rs:264-267; rust/lance-core/src/utils/stable_partition.rs:292-298 |
| 16 | u32 | positive block_rows | rust/lance-core/src/utils/stable_partition.rs:229-229; rust/lance-core/src/utils/stable_partition.rs:264-267; rust/lance-core/src/utils/stable_partition.rs:299-304 |
| 20 | u64 | total_rows, including deleted physical rows | rust/lance-core/src/utils/stable_partition.rs:101-102; rust/lance-core/src/utils/stable_partition.rs:230-230; rust/lance-core/src/utils/stable_partition.rs:266-266 |
| 28 | u32 cells | B*m cumulative counts, block-major then label-major; B=ceil(total_rows/block_rows) | rust/lance-core/src/utils/stable_partition.rs:103-104; rust/lance-core/src/utils/stable_partition.rs:231-234; rust/lance-core/src/utils/stable_partition.rs:267-289 |

Exact length is28+4*B*m. decode uses checked payload multiplication and rejects both truncation and trailing bytes. Empty input rows produce no grid cells but still require valid shape and a28-byte header. decode checks shape with InvalidInput, while magic/version/tag/length use CorruptFile. It does not check count contents. (rust/lance-core/src/utils/stable_partition.rs:237-304; rust/lance-core/src/utils/stable_partition.rs:374-385)

Call validate separately: every label must be nondecreasing and each block's increase in total live count must be <=that block's physical length. Counts are u32 and totals are summed as u64. It does not cross-check actual labels or destination metadata. encode does not validate first. The test deliberately encodes a decreasing grid that decodes successfully and fails validate. (rust/lance-core/src/utils/stable_partition.rs:191-235; rust/lance-core/src/utils/stable_partition.rs:624-631)

The matrix owns no validity bitmap; NULL/deleted positions belong to the separate label stream and contribute no destination counts. Point translation ignores null payload values. The precise persisted storage for that label stream remains pending. (rust/lance-core/src/utils/stable_partition.rs:8-17; rust/lance-core/src/utils/stable_partition.rs:348-385; rust/lance-core/src/utils/stable_partition.rs:387-444)

[Exact codec/body](../../L2-files/rust/lance-core/src/utils/stable_partition.rs.md) · [API supplement](../../L1-modules/rust-lance-core-row-mapping.md).
## Generic split-block Bloom filters

Local SBBF raw bytes contain only concatenated32-byte blocks; each is eight little-endian u32 words. new accepts any multiple of32, including0, and no power-of-two/minimum/maximum check is imposed. There is no magic,version,seed,type,NDV orFPP header. to_bytes and write_bitset preserve block then lane order. Empty input is structurally accepted but membership methods panic because no block exists. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:243-269; rust/lance-core/src/utils/bloomfilter/sbbf.rs:290-352)

Membership identity is xxHash64(seed0) over the exact AsBytes representation. high32 selects floor(high32*block_count/2^32) via saturating multiplication; low32 x sets bit ((x*salt_i wrapping u32)>>27) in each lane. All eight selected bits are required for a positive membership result. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:98-151; rust/lance-core/src/utils/bloomfilter/sbbf.rs:290-317; rust/lance-core/src/utils/bloomfilter/sbbf.rs:419-425)

| Lane | Salt |
|---|---|
| 0 | 0x47b6137b |
| 1 | 0x44974d91 |
| 2 | 0x8824ad5b |
| 3 | 0xa2b7289d |
| 4 | 0x705495c7 |
| 5 | 0x2df1424b |
| 6 | 0x9efc4947 |
| 7 | 0x5c6bfb31 |

Exact constants: rust/lance-core/src/utils/bloomfilter/sbbf.rs:76-86. Numeric input is little-endian without type tags; strings are raw UTF-8, bool0/1, byte slices unchanged. Floating bit patterns are not normalized. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:15-92)

The source claims Parquet compatibility, but no external spec was fetched and no upstream fixture was executed. Full xxHash64 algorithm internals and enclosing Lance scalar-index schema/version selection remain unreviewed dependencies, so the KB cannot yet independently implement the complete persisted index solely from this local raw-bitset description. [Detailed APIs](../../L1-modules/rust-lance-core-bloom.md). (rust/lance-core/src/utils/bloomfilter/sbbf.rs:21-36; rust/lance-core/src/utils/bloomfilter/sbbf.rs:419-425)

## Canonical cache-key protocol blake3-128-v1

This protocol names cache identities, independently of Lance file-version numbers. Source declares stable framing and recommends putting CACHE_KEY_FORMAT in persistent physical namespaces. It uses deterministic non-secret namespaces and explicitly disclaims authentication/access-control purpose. BLAKE3 dependency internals were not inspected. (rust/lance-core/src/cache/key.rs:4-28; rust/lance-core/src/cache/backend.rs:11-22)

Define frame(x)=LEu64(byte_length(x)) || x. Root R=derive_key(context="lance-format/lance 2026-07-17 cache namespace v1", material=empty). Child(N,s)=32-byte keyed BLAKE3 under N of frame("lance-cache-namespace" plus terminal NUL) || LEu32(1) || frame(UTF8(s)). Entry preamble under namespace N is frame("lance-cache-entry" plus terminal NUL) || LEu32(1) || frame(UTF8(stable_type_id)) || frame(UTF8(schema.id)) || LEu32(schema.version). Entry result is first16 bytes of keyed BLAKE3(preamble || emitted fields), in digest byte order. (rust/lance-core/src/cache/key.rs:25-28; rust/lance-core/src/cache/key.rs:124-138; rust/lance-core/src/cache/key.rs:168-179; rust/lance-core/src/cache/key.rs:288-314)

| Tag byte | Field | Following payload | Evidence |
|---|---|---|---|
| 1 | u8 | one byte | rust/lance-core/src/cache/key.rs:182-186 |
| 2,3,4 | u16,u32,u64 | fixed2/4/8-byte LE | rust/lance-core/src/cache/key.rs:188-213 |
| 5,6 | i32,i64 | fixed4/8-byte signed LE | rust/lance-core/src/cache/key.rs:215-231 |
| 7 | bool |0 or1 byte | rust/lance-core/src/cache/key.rs:233-238 |
| 8,9,10 | str,bytes,fixed bytes | LEu64 length then UTF-8/raw bytes, even fixed arrays | rust/lance-core/src/cache/key.rs:240-256; rust/lance-core/src/cache/key.rs:297-302 |
| 11,12 | None,Some | no payload in marker method | rust/lance-core/src/cache/key.rs:258-268 |
| 13 | variant ordinal | LEu32 | rust/lance-core/src/cache/key.rs:270-277 |
| 14 | sequence length | LEu64 | rust/lance-core/src/cache/key.rs:279-286 |

Grammar correctness is caller-owned: a sequence marker does not consume elements and Some does not require a following payload. Schema constructors do not validate ids/versions. Golden fixture: root.child("s3://bucket/dataset"), value type test.Value, schema test.key/v1, fields u32(7),str(page),Some,fixed[AB;16] -> c438ff22305530fc741638e97d45a568. This is a source fixture, not a freshly executed hash computation. (rust/lance-core/src/cache/key.rs:70-84; rust/lance-core/src/cache/key.rs:252-287; rust/lance-core/src/cache/key.rs:320-328; rust/lance-core/src/cache/key.rs:461-475)

The separate LCE1 codec envelope is reconstructed below; key identity does not encode the body layout.

## LCE1 cache entry envelope and section primitives

All offsets below are from start of entire entry; N is UTF-8 type-id byte length (0..65535). No envelope checksum, body length or section directory exists. Body schema is selected by type/version and read in implementation-defined sequence. (rust/lance-core/src/cache/codec.rs:89-138; rust/lance-core/src/cache/codec.rs:191-228)

| Absolute offset | Bytes | Meaning | Evidence |
|---|---|---|---|
| 0 |4 | ASCII LCE1 | rust/lance-core/src/cache/codec.rs:60-60; rust/lance-core/src/cache/codec.rs:93-97 |
| 4 |1 | envelope version1 | rust/lance-core/src/cache/codec.rs:74-74; rust/lance-core/src/cache/codec.rs:99-102 |
| 5 |2 | LEu16 N | rust/lance-core/src/cache/codec.rs:104-105 |
| 7 |N | UTF-8 type-id, empty permitted by parser | rust/lance-core/src/cache/codec.rs:107-108 |
| 7+N |4 | LEu32 type/body version | rust/lance-core/src/cache/codec.rs:110-111 |
| 11+N |remaining | concrete codec body | rust/lance-core/src/cache/codec.rs:113-117; rust/lance-core/src/cache/codec.rs:358-369 |

The wrapper accepts only envelope version1, exact expected type id, and body version<=current writer version; older support belongs to the body implementation. Unknown framing/type/future version or body Result error is a reasoned Miss. has_cache_envelope only checks4 magic bytes and can return true for a truncated entry. There is no trailing-data check. (rust/lance-core/src/cache/codec.rs:62-74; rust/lance-core/src/cache/codec.rs:330-369)

Body primitives: discriminant is raw1 byte; protobuf header is LEu32 encoded-length plus exactly that slice; raw blob is documented/delegated LEu64 length plus bytes; IPC is documented/delegated zero padding to the next64-byte absolute-entry boundary plus a self-delimiting stream. The local alignment test uses a13-byte prefix and confirms padding is nonempty and zero. The exact IPC protocol and raw-helper error/bounds behavior require pending lance_arrow analysis, so this is not a complete standalone IPC decoder recipe. (rust/lance-core/src/cache/entry_io.rs:12-18; rust/lance-core/src/cache/entry_io.rs:55-97; rust/lance-core/src/cache/entry_io.rs:145-190; rust/lance-core/src/cache/entry_io.rs:327-354)

Do not conflate this with Lance file2 versions or infer released stability from the LCE1 name: the source uses both stabilized-envelope language and experimental-codec-format language. Apply repository stable/unstable rules after actual released-contract classification. (rust/lance-core/src/cache/codec.rs:22-26; rust/lance-core/src/cache/codec.rs:51-60; rust/lance-core/src/cache/codec.rs:191-218; AGENTS.md:7-18)

## Reviewed table entry-point format gates

The generated table protobuf module is included from OUT_DIR; .lance.file fields map to lance_file's generated module, while inline_row_ids is configured as Bytes. Generation consumes shared root schemas through the protos symlink; generated output was not built. (rust/lance-table/src/format.rs:39-50; rust/lance-table/build.rs:15-29; rust/lance-table/protos:1-1)

Table format facade footer identifiers are signed16-bit constants major0/minor1 and four-byte ASCII LANC. The actual manifest writer framing and differing canonical footer pair are now documented in Actual manifest byte framing and deletion payloads below. pb::Uuid must contain16 bytes; conversion preserves raw ordering without validating version or variant. (rust/lance-table/src/format.rs:52-78)

The feature support gate accepts deprecated v2 bit2; a helper can detect it, but apply_feature_flags does not derive or preserve it. Mixed recognized v2 file-version capability is bit8, validated as paired reader/writer state and retained across apply/inherit. This does not specify exact legal per-file versions or parser behavior. (rust/lance-table/src/feature_flags.rs:15-16; rust/lance-table/src/feature_flags.rs:53-56; rust/lance-table/src/feature_flags.rs:127-232; rust/lance-table/src/feature_flags.rs:343-378)

Fragment-tree bit12 and independent-covering bit13 are declared by schemas but explicitly rejected by this implementation, even with all experimental gates enabled. Bit13's documented dependent bit7/migration contract is therefore not currently writable support in this module. Overlay bit6/spilled-lineage bit11 require debug assertions or named environment presence; stable-ID FRI bit9 requires debug assertions only. (rust/lance-table/src/feature_flags.rs:82-99; rust/lance-table/src/feature_flags.rs:234-291)

## Inline row-ID wrapper wire boundary

The inline digest is runtime-only. Serialization delegates to Bytes, and the source JSON test requires {"Inline":[7,8,9]}; protobuf Fragment roundtrip also preserves metadata in that fixture. The RowIdMeta converter accepts generated InlineRowIds bytes or ColumnRowIds marker without validating encoding or feature flags. The marker references a hidden row-ID column by contract, but base-carrier lookup is now covered in the fragment section; actual column decoding remains pending. (rust/lance-table/src/format/row_ids.rs:100-126; rust/lance-table/src/format/row_ids.rs:141-166; rust/lance-table/src/format/row_ids.rs:228-244)

The format Transaction wrapper's From conversion is an ownership move, not protobuf encoding. Inline-vs-external transaction persistence policy cannot be derived from it; classification before size selection is the documented motivation for the standalone helper. (rust/lance-table/src/format/transaction.rs:42-82)

## Fragment and manifest conversion details

| Rust value / input | Protobuf or JSON boundary |
|---|---|
| DataFile fields/columns | Arc slices become protobuf Vec or serde arrays; decoding allocates fresh Arcs unless manifest interner used |
| physical_rows / num_deleted_rows | None and Some(0) write zero; protobuf zero decodes None |
| RowIdMeta Inline / Column | Bytes handle clone / empty RowLineageColumn marker |
| Fragment overlays | protobuf decode sorts newest last; encode preserves current order; serde parsing does not sort |
| Empty Manifest tag / transaction file | protobuf empty String decodes None |
| Manifest timestamp zero | omitted protobuf Timestamp; absence decodes0 |
| Manifest data_format | always emitted with exact version string; absent input invokes inference/fallback |
| Manifest fragment_tree | no Rust field; output None; converter alone does not reject input tree |

The table follows rust/lance-table/src/format/fragment.rs:63-107, rust/lance-table/src/format/fragment.rs:282-310, rust/lance-table/src/format/fragment.rs:491-516, rust/lance-table/src/format/fragment.rs:727-730, rust/lance-table/src/format/fragment.rs:831-909 and rust/lance-table/src/format/manifest.rs:963-1124. Unknown fields and ignored reserved representations need support gates elsewhere; a successful local conversion is insufficient to certify readable dataset contents.

V2.0 structural projection recognizes both historical raw(0,3) and canonical(2,0) pairs, retaining mapped parent headers without inventing evolved children. Exact version parsing/serialization delegates to lance-file and is documented in the exact file-version codecs section below; complete reader/writer dispatch remains pending. The manifest-local test pins V2_0 output2.0 and rejection of stable/next/legacy/0.3 as persisted manifest strings. No new compatibility fallback was added. (rust/lance-table/src/format/fragment.rs:171-250; rust/lance-table/src/format/manifest.rs:714-722; rust/lance-table/src/format/manifest.rs:1262-1286)

Timestamp input casts signed seconds/nanos to u128 without validating protobuf timestamp ranges; output casts whole seconds to i64. Offset fields cast between u64 and usize. Base-path list duplicate IDs collapse through HashMap collection, and encoding HashMap values gives no canonical order. These are current conversion boundaries, not validated wire constraints. (rust/lance-table/src/format/manifest.rs:966-971; rust/lance-table/src/format/manifest.rs:1025-1069; rust/lance-table/src/format/manifest.rs:1111-1121)

## Index, overlay and conflict-key representations

| Representation | Encoding / normalization |
|---|---|
| Index unknown fragment bitmap | Empty protobuf bytes; valid encoded empty bitmap remains known-empty |
| Index files | None and Some(empty) both serialize repeated-empty and decode None |
| Index version/time | Version emitted Some(i32), absent decode0; time signed milliseconds cast to/from u64 |
| Index list cache body | pb::IndexSection inside CacheEntryWriter.write_header; type ID lance.table.IndexMetadataList and version1 |
| Overlay coverage | SharedOffsetBitmap bytes or FieldCoverage repeated Roaring bytes; serde private enum Shared/PerField byte vectors |
| Overlay tombstone | Field ID-2 retains physical column/coverage slot until whole overlay removed |
| Key existence Exact | Unordered repeated u64 hashes; decode deduplicates |
| Key existence Bloom | Raw Sbbf bytes plus num_bits, expected item count and probability; only zero config defaults on decode |

Evidence: rust/lance-table/src/format/index.rs:261-415; rust/lance-table/src/format/overlay.rs:51-135; rust/lance-table/src/format/overlay.rs:242-327; rust/lance-table/src/format/key_existence.rs:215-280. Cache protobuf framing is not a complete manifest or transaction format. No canonical hash-set ordering, Any schema validation or probability-range validation is introduced by these conversions.

Overlay rank is zero-based number of covered offsets below the physical row; deletions do not renumber it. Format comments require one value column per field and version/position precedence. Local metadata code preserves and sorts descriptors, while actual field-column storage, rank read kernels and stamping remain pending. (rust/lance-table/src/format/overlay.rs:4-34; rust/lance-table/src/format/overlay.rs:181-240)

## Exact file-version codecs

| Exact | Canonical manifest | DataFile pair | Standard footer | Embedded footer | Unstable predicate |
|---|---|---|---|---|---|
|V1|0.1|(0,2)|(0,2)|(0,2)|false|
|V2_0|2.0|(2,0)|(0,3)|(2,0)|false|
|V2_1|2.1|(2,1)|(2,1)|(2,1)|false|
|V2_2|2.2|(2,2)|(2,2)|(2,2)|false|
|V2_3|2.3|(2,3)|(2,3)|(2,3)|true|

Both numeric readers also accept historical(0,0)/(0,1) as V1 and both listed V2_0 pairs; metadata takes u32, footer takes u16. Strict manifest decoder accepts only canonical strings. Public selector parser is separate: lowercase without trim, with legacy/0.3/stable/next aliases. stable/next are2.2/2.3 code policy and default selector is exactV2_2. (rust/lance-file/src/version.rs:13-50; rust/lance-file/src/version.rs:92-107; rust/lance-file/src/version.rs:167-262)

Footer recognition expects final8 bytes = major LEu16, minor LEu16, LANC. Legacy format module constants are0.2, whereas table manifest constants are0.1; accepted identity alone cannot distinguish a valid data file from another byte stream with a matching suffix. Full v2 footer offsets/pages/encoding semantics and release fixtures remain pending. (rust/lance-file/src/lib.rs:36-60; rust/lance-file/src/format.rs:30-33; rust/lance-table/src/format.rs:51-55)

## Dataset-version sequence encoding and column markers

The wire sequence has repeated runs tag1; each run has U64Segment span tag1 and uint64 version tag2. Writer clones spans, makes them present and encodes the protobuf directly. Reader rejects malformed protobuf/missing spans as Internal and delegates nested segment validation; it does not normalize coordinates, remove empty spans or validate total physical length. Default protobuf version0 is not rejected. (protos/rowids.proto:106-120; rust/lance-table/src/rowids/version.rs:520-559)

Inline metadata owns shared encoded bytes; custom JSON borrows/reads them as an inline numeric array. Column serializes as an empty object under column, with no path/count. Creation and update oneof converters select different generated arms but apply identical byte-copy/marker policy. Neither applies spilled-lineage flags or carrier checks; those remain separate fragment/manifest boundaries. (rust/lance-table/src/rowids/version.rs:392-518; rust/lance-table/src/rowids/version.rs:818-847; rust/lance-table/src/format/fragment.rs:635-725)

HoleRuns is an in-memory representation with span:u32, missing starts and one present-before count per run plus terminal total. Missing bounds reconstruct as end[k]=start[k]+missing_before[k+1]-missing_before[k], where missing_before[k]=start_or_span[k]-present_before[k]. Sequence conversion now shows that Ranges expands to multiple plain wire Range arms; standalone segment conversion panics for this variant. Never serialize HoleRuns struct layout directly. (rust/lance-table/src/rowids/serde.rs:232-299) (rust/lance-table/src/rowids/runs.rs:14-81; rust/lance-table/src/rowids/runs.rs:132-154)

## Row-ID wire parsing and payload validation

RowIdSequence is repeated U64Segment tag1. Segment oneof tags are Range1, RangeWithHoles2, RangeWithBitmap3, SortedArray4, Array5. Ranges has no wire tag: each present interval becomes a plain Range. Bitmap range bounds determine logical bit count; byte count must equal ceil((end-start)/8), with high unused bits zero. Hole arrays must be strictly increasing and within half-open range. (protos/rowids.proto:16-73; rust/lance-table/src/rowids/serde.rs:98-172; rust/lance-table/src/rowids/serde.rs:232-255)

Packed U16/U32 arrays use base tag1 and offsets bytes tag2, with oneof arms1/2; U64 uses values bytes tag2 under arm3. Every packed value uses fixed-width LE bytes, not protobuf scalar varints. Decode rejects byte lengths not divisible by2/4/8 and relative values exceeding u64MAX, but accepts empty arrays and noncanonical bases. SortedArray additionally rejects equality/descent; Array permits both. (protos/rowids.proto:76-104; rust/lance-table/src/rowids/serde.rs:156-230; rust/lance-table/src/rowids/serde.rs:301-338)

Top-level read_row_ids requires every field be tag1/LengthDelimited; unknown outer tags fail CorruptFile. Segment lengths are varints cast as usize before remaining-byte checks. Its plain-range fast path accepts only one Range arm with varint start/end, default0, last duplicate field wins, and start<end; other shapes fall back to prost+validated conversion. A positive range fast path bypasses explicit usize range validation. These unchecked casts require separate32-bit qualification; no such execution was performed. (rust/lance-table/src/rowids/serde.rs:346-426)

Consecutive adjacent ranges merge, separated ascending ranges may compact, and overlap/out-of-order boundaries flush accumulated ranges. Decode checks aggregate u64 length after folding. Writer does not enforce the decoder's validations. Unknown nested-field behavior follows generated prost fallback, whose dependency implementation is outside this reviewed slice. Released compatibility cannot be concluded from a current-code roundtrip alone. (rust/lance-table/src/rowids/serde.rs:60-96; rust/lance-table/src/rowids/serde.rs:257-338; rust/lance-table/src/rowids/serde.rs:376-398; rust/lance-table/src/rowids/serde.rs:822-884)

## Segment selection versus wire representation

The selector's24+4*holes,24+ceil(span/8),24+2*count costs are heuristic byte estimates, saturated through u128→usize. They do not equal actual protobuf lengths or adapt to the eventual array width. Range exclusivity prevents constructors from using a range-backed form when maximum is u64MAX; SortedArray handles that case. No Ranges variant is selected by from_slice. (rust/lance-table/src/rowids/segment.rs:176-243)

Decoder folding calls from_sorted_ranges: at least two inputs, u32 enclosing span and valid maximal gaps produce Ranges, independently of as_ranges cost policy. The explicit bitmap optimization uses16 bytes per estimated present interval and strict less-than against bitmap payload length. No feature flag check exists in either helper. Actual sequence/commit opt-in must be traced before claiming a dataset-format gate. Both forms serialize through existing Range wire arms only at RowIdSequence level. (rust/lance-table/src/rowids/segment.rs:245-289; rust/lance-table/src/rowids/serde.rs:60-96; rust/lance-table/src/rowids/serde.rs:232-299)

On32-bit targets, segment.len casts a potentially larger u64 span to usize; the row-ID decoder fast path does not call validate_range, unlike protobuf conversion fallback. Aggregate checked u64 summation occurs after these segment lengths, so it does not independently establish that no earlier truncation happened. This is source-derived portability analysis; no32-bit build/test was run. (rust/lance-table/src/rowids/segment.rs:330-344; rust/lance-table/src/rowids/serde.rs:19-30; rust/lance-table/src/rowids/serde.rs:376-426)

## Sequence representation versus wire identity

RowIdSequence equality and is_empty operate on the in-memory segment vector. Two sequences with equal yielded values may compare unequal, and empty payloads may retain a Range0..0 segment. use_range_segments transforms only eligible bitmaps; the byte writer still flattens Ranges into existing Range messages and the decoder can refold them. Do not use Rust structural equality as a universal canonical wire identity. (rust/lance-table/src/rowids.rs:51-52; rust/lance-table/src/rowids.rs:209-219; rust/lance-table/src/rowids.rs:267-277; rust/lance-table/src/rowids.rs:329-337; rust/lance-table/src/rowids/serde.rs:232-299; rust/lance-table/src/rowids/serde.rs:346-398)

Local conversion does not gate by file version or table config. A contextual manifest-builder helper checks lance.row_ids.range_segments before rewriting changed inline row-ID bytes; full caller ordering remains untraced. This is a reader-performance opt-in using existing wire arms, not evidence of a new stable format revision. (rust/lance-table/src/rowids.rs:321-338; rust/lance-table/src/transaction/manifest_build.rs:73-122)


## Transaction producers of inline row and version metadata

This module adds no wire format or version discriminator. New IDs are serialized as existing RowIdSequence bytes; creation values are compressed into version runs and stored as existing Inline RowDatasetVersionMeta. Assignment never spills a new file despite its TODO. Existing Column IDs are trusted complete, and writer-placed creation Column is preserved while latest versions are replaced with inline uniform metadata for positive known counts. Physical count0/unknown yields no latest metadata. (rust/lance-table/src/transaction/row_version.rs:206-240; rust/lance-table/src/transaction/row_version.rs:278-295; rust/lance-table/src/transaction/row_version.rs:332-405; rust/lance-table/src/rowids/version.rs:655-678)

Fallback creation1 is semantic data, not an encoding version or null marker. It applies to found source rows with unavailable creation; unmatched IDs receive caller new_version. No monotonicity validation or history migration occurs here. Stability/release compatibility of surrounding formats remains governed by existing contracts and pending full writers/readers. (rust/lance-table/src/transaction/row_version.rs:21-52; rust/lance-table/src/transaction/row_version.rs:258-285)



## Transaction intent versus persisted representation

Operation declarations document frag_reuse_index as in-memory only: conflict decisions need groups, while the manifest records history. PreparedIndices and FragReuseUpdate are also attempt metadata. The complete object codec below confirms transient omission. UpdateMap models ordered edits and a replace flag; bidirectional conversion preserves them. (rust/lance-table/src/transaction/proto.rs:151-184; rust/lance-table/src/transaction/proto.rs:555-569; rust/lance-table/src/transaction/proto.rs:767-797) (rust/lance-table/src/transaction/operation.rs:89-111; rust/lance-table/src/transaction/prepare.rs:4-18; rust/lance-table/src/transaction/prepare.rs:24-58; rust/lance-table/src/transaction/update_map.rs:13-56)

Test-only tagged_entry encodes FragmentReuseIndexDetails into Any with type_url /lance.table.FragmentReuseIndexDetails, inline transitions and empty legacy_versions. It uses OrderedCompaction address bitmaps, casts lineage IDs to u32 unchecked and assumes evenly divisible destination counts. Fixture bytes are not a production writer-validation guarantee. (rust/lance-table/src/transaction/test_support.rs:127-199)



## Durable versus in-memory transaction equality

In-memory Rewrite equality includes frag_reuse_index. Operation docs designate that payload transient; inspected verify_commit_outcome converts the attempt to pb::Transaction and compares it to the persisted form to avoid misclassifying a landed commit. This distinction is verified locally; the object codec is now covered below, while complete byte framing and outcome recovery remain pending. (rust/lance-table/src/transaction/conflicts.rs:97-112; rust/lance-table/src/transaction/operation.rs:108-111; rust/lance/src/io/commit.rs:246-283)



## Pre-validation does not verify file formats

Schema-fragment dispatch trusts manifest exact format (V1 versus V2_0 throughV2_3); Overwrite bypasses prior format and uses modern checks. Modern checks do not validate per-file versions, schema membership, overlay coverage or byte layout. Merge binding identity uses base_id+path for files carrying a changed field, while physical-rewrite detection additionally compares ordered fields/column mappings/raw versions but ignores cached size. Neither opens files. (rust/lance-table/src/transaction/validate.rs:58-65; rust/lance-table/src/transaction/validate.rs:120-200; rust/lance-table/src/transaction/validate.rs:360-389)



## Transaction object conversion and legacy reads

The16 operation oneof tags100-115 are declared in the transaction schema; exhaustive Rust conversion covers all16. Current writers use Rewrite.groups, Update offset bitmap field10 and new UpdateConfig maps only. Existing readers retain old flat Rewrite lists, field9 lists and old config-map translation. Full released-version qualification and file framing remain pending; current-branch intermediate states do not create compatibility obligations. (protos/transaction.proto:410-429; rust/lance-table/src/transaction/proto.rs:151-184; rust/lance-table/src/transaction/proto.rs:252-374; rust/lance-table/src/transaction/proto.rs:555-675; AGENTS.md:7-18)

| Rust/protobuf input | Conversion result |
|---|---|
| Empty tag / properties / Overwrite config or bases / RewrittenIndex file list | Decode None |
| Rewrite groups empty | Decode one group from old flat lists, even both empty |
| Rewrite transient frag_reuse_index | Never encoded; decode None |
| Update mode None | Encode0; decode Some(RewriteRows) |
| Unknown update mode integer | Decode Some(RewriteRows) |
| Update empty bitmap entries | Encoder omits them; resulting empty map decodes None |
| Nonempty field10 map with only zero-byte values | Select field10, discard entries, decode None; field9 ignored |
| Valid encoded empty Roaring bitmap in field10 | Decode retains keyed empty bitmap, unlike encoder |
| Overwrite/Merge schema_metadata | Encoder emits empty; decoder ignores supplied map |
| UpdateMap | Entry order, duplicates, optional values and replace preserved |

These are object-conversion rules, not a claim of byte-canonical protobuf encoding or complete operation identity. Their source is rust/lance-table/src/transaction/proto.rs:121-184, rust/lance-table/src/transaction/proto.rs:244-283, rust/lance-table/src/transaction/proto.rs:410-469, rust/lance-table/src/transaction/proto.rs:525-640 and rust/lance-table/src/transaction/proto.rs:711-797. Fields excludes schema-level metadata for Project as well (rust/lance-file/src/datatypes.rs:240-243; rust/lance-file/src/datatypes.rs:292-300; rust/lance-table/src/transaction/proto.rs:285-293; rust/lance-table/src/transaction/proto.rs:642-647).


The in-memory rewrite test checks only dropped transient entry, allowing empty groups to normalize unnoticed. The overlay test decodes a hand-built transaction protobuf after encoding only the nested overlay, and checks group/coverage/version. Neither test writes complete transaction bytes. (rust/lance-table/src/transaction/proto.rs:814-885)



## Fragment-reuse lineage interpretation boundary

TaggedLineage chooses the first name/version-tagged entry and accepts caller-supplied decoded ledger or decodes inline details. It does not fetch external details. Missing details/unprefetched external payload errors; unsupported transitions yield a view without a usable ledger. contains() consults the cloned bitmap, while mentions()/walks consult the ledger. No new persistent format is defined by TaggedLineage; full ledger decoding/version semantics are now covered below, while assembly and query IO remain pending. (rust/lance-table/src/system_index/frag_reuse/lineage.rs:36-140; rust/lance-table/src/system_index/frag_reuse/metadata.rs:16-18)



## Sticky tagged-history format policy

Capability bit is 1<<10. uses_tagged_fri checks reader bit or supplied nonzero-version reserved entry; validate_flags requires both reader/writer bits when any tagged entry exists. Entry absence with retained flag is allowed locally. Comments specify append-transition record form and no v0 replacement after activation; the classifier rejects unassembled tagged snapshots and flagged v0 replacements, while actual byte-verbatim lifting/assembly remains pending. (rust/lance-table/src/feature_flags.rs:65-65; rust/lance-table/src/system_index/frag_reuse/metadata.rs:20-49; rust/lance-table/src/system_index/frag_reuse/gate.rs:61-110)

A future or negative entry version is still tagged by recognition but cannot use the bare-uncovered rewrite escape, whose reserved-name version list must be0/1. Other admission branches do not prove version decoding support; separate capability/ledger checks remain necessary. (rust/lance-table/src/system_index/frag_reuse/metadata.rs:16-18; rust/lance-table/src/system_index/frag_reuse/gate.rs:113-224)



## FRI raw-wire decoder and transition identity

Details type URL final component is case-sensitive lance.table.FragmentReuseIndexDetails; inline/external content tags1/2 cannot repeat. The raw scanner preserves length-delimited slices after one Any-value copy and skips other well-formed wire fields. Legacy groups are reconstructed with ordered mapping tag3; tagged transitions in content tag2 require index_version1 and exactly one recognized mapping3/4 unless unknown outer fields cause omission. This stricter scanner avoids ordinary oneof last-value-wins hiding duplicated mapping/content alternatives. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:99-233; rust/lance-table/src/system_index/frag_reuse/ledger.rs:316-355)

External-history offset+size must fit u64 and usize, and callback output length must match size. No path or positive-size validation is added for that descriptor. Stable-partition row-map reference is a different payload: UUID text must parse and declared map size must be positive, but no labels or file bytes are read. Ledger recognition is stricter/different than name/version is_tagged and slash/case-insensitive is_frag_reuse_index_entry; do not merge those predicates. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:125-169; rust/lance-table/src/system_index/frag_reuse/ledger.rs:430-440; rust/lance-table/src/system_index/frag_reuse/metadata.rs:16-18; rust/lance-table/src/system_index/frag_reuse.rs:31-40)

Legacy compatibility conversion sorts versions on write and discards tagged transitions on reverse conversion. New tagged history must retain its complete representation; serializing through FragReuseIndexDetails loses it. No migration or legacy writer extension is proposed. (rust/lance-table/src/system_index/frag_reuse.rs:175-210)



## MemWAL object-to-protobuf semantics

SsTable optional measurements preserve None versus Some(0); unmeasured flush metadata cannot be charged as zero reader memory. ShardManifest requires a16-byte UUID, folds duplicate repeated shard-field entries last-wins into HashMap, and reencodes fields in unspecified HashMap order. The converter checks no WAL-position relation or field-byte type. Status discriminator1 is Sealed; all others decode Active and reencode0. (rust/lance-table/src/system_index/mem_wal.rs:31-92; rust/lance-table/src/system_index/mem_wal.rs:125-138; rust/lance-table/src/system_index/mem_wal.rs:209-327; rust/lance-table/src/format.rs:57-68)

MemWalIndexDetails missing maintain_all_indexes becomes false; writing always emits Some(bool). Snapshot bytes remain opaque. Structured compaction/catchup UUIDs are validated, but config strings, transform/expression combinations and duplicate IDs are not. new_mem_wal_index_meta emits index_version0, no files and inline Any; that metadata version is distinct from shard generation, writer epoch and manifest version. These object codecs do not define WAL file framing or store commit protocol. (rust/lance-table/src/system_index/mem_wal.rs:329-458; rust/lance-table/src/system_index/mem_wal.rs:598-618)



## Manifest-builder format gates

Default storage selection and referenced file validation are separate. New dataset explicit V1 requires homogeneous inferred V1; explicit modern version bypasses inference here. Existing default changes locally only for Overwrite. Legacy blob schema roots referenced by V2_2/V2_3 files promote to blob-v2 shape; this is metadata construction, not byte rewrite. Covering index flags derive from final covering_fields; sticky features carry from current; tagged records set paired bits at return. (rust/lance-table/src/transaction/manifest_build.rs:142-166; rust/lance-table/src/transaction/manifest_build.rs:1598-1725; rust/lance-table/src/transaction/manifest_build.rs:1909-1919)

Update transaction object conversion tests assert field10 bitmap encoding, field9 legacy reading and field10 priority when both supply same key. They do not use historical released files or test full protobuf wire IO. Nullability bool fixtures similarly test true/false conversion for Project/Merge without executing conflict policy. (rust/lance-table/src/transaction/manifest_build.rs:3695-3835; rust/lance-table/src/transaction/manifest_build.rs:4816-4857)

Range-segment opt-in serializes compact in-memory ranges through existing Range records according to comments; compatibility/performance with old readers is not measured here. Hidden lineage carriers must be V2 even if other file behavior supports legacy compatibility. No full v2 page/encoding specification is established by these manifest-level gates. (rust/lance-table/src/transaction/manifest_build.rs:59-124; rust/lance-table/src/transaction/manifest_build.rs:4726-4764)


## Actual manifest byte framing and deletion payloads

Contextual WriteExt emits u32 little-endian encoded_len followed by Prost bytes, returning prefix offset. Length uses unchecked usize->u32. Manifest writer places optional index section, optional inline transaction and manifest in that order, preceded by dictionaries only for V1. Footer writer emits i64 LE manifest offset, i16 LE major, i16 LE minor and magic bytes. Body writer alone does not emit footer. (rust/lance-io/src/traits.rs:84-107; rust/lance-table/src/io/manifest.rs:177-230)

Canonical table commit writer imports lance-file's0/2/LANC, while table format facade exposes0/1/LANC. Current read_manifest checks trailing LANC and offset/length, not the version pair. This is observed call-boundary behavior, not a proposed format migration or proof every writer emits the same footer. (rust/lance-table/src/io/commit.rs:31-40; rust/lance-table/src/io/commit.rs:213-230; rust/lance-file/src/format.rs:30-33; rust/lance-table/src/format.rs:51-56; rust/lance-table/src/io/manifest.rs:54-128)

Deletion schema discrepancy: protobuf comments specify Int32Array; the current writer and reader use a single nonnullable row_id:UInt32 Arrow IPC column with ZSTD. Reader exact schema equality would reject signed Int32. Bitmap files use Roaring serialize/deserialize with no added wrapper here. Both are physical offsets and extension comes from metadata kind, not content sniffing. Historical compatibility cannot be inferred without released fixtures. (protos/fragment_metadata.proto:251-287; rust/lance-table/src/io/deletion.rs:25-34; rust/lance-table/src/io/deletion.rs:85-134; rust/lance-table/src/io/deletion.rs:162-216)


## Manifest directory names and hint payload

The directory is _versions for V1 and V2. Attached names encode decimal version or zero-padded 20-digit u64MAX-version; detached names are d plus the full number and .manifest. Staging appends hyphen UUIDv4 to the final path. A migration changes names through unconditional rename under a documented quiescence requirement; it does not rewrite manifest bytes. (rust/lance-table/src/io/commit.rs:70-197; rust/lance-table/src/io/commit.rs:772-775)

latest_version_hint.json contains a serde object with u64 version. It is a nonauthoritative accelerator, not a commit record, schema version or monotonic CAS. Its generation token is not retained. ManifestLocation ETag is also separate from external record identity. (rust/lance-table/src/io/commit.rs:232-264; rust/lance-table/src/io/commit.rs:315-385)

Detached parser documentation overstates mask validation: it accepts d12345.manifest unchanged, as its test explicitly requires. Suffix validation is separate and detached listing does not add it. Do not infer persisted record validity from filename detection alone. (rust/lance-table/src/io/commit.rs:114-164; rust/lance-table/src/io/commit.rs:739-770; rust/lance-table/src/io/commit.rs:2090-2116)


## External record and physical-object identity boundaries

This trait specifies logical record fields (base URI/version/path/size/optional ETag) and optional incarnation identity, but no universal serialized external schema. Generic writes clear indexed ETags; returned ETags describe a HEAD/PUT observation. Identity-conditioned final objects retain the normal staging suffix, so filename shape alone cannot classify all committed versions. Changing object naming or record layout therefore requires concrete backend and listing analysis. (rust/lance-table/src/io/commit/external_manifest.rs:162-368; rust/lance-table/src/io/commit/external_manifest.rs:1049-1090; rust/lance-table/src/io/commit.rs:772-775)

The existing equal-size replacement test deliberately accepts a new object generation without byte validation. Size is the only generic finalization check here; no checksum or Manifest decode establishes content identity. Do not infer a persisted format integrity guarantee from this resolver. (rust/lance-table/src/io/commit/external_manifest.rs:434-485; rust/lance-table/src/io/commit/external_manifest.rs:1438-1487)


## DynamoDB rows and nonpersistent row-index structures

DynamoDB requests use base_uri/path/committer strings and numeric version/size. Missing old size means unknown; malformed present size fails. ETag is omitted/ignored and record identity is unsupported. This external attribute schema is separate from manifest bytes. (rust/lance-table/src/io/commit/dynamodb.rs:117-160; rust/lance-table/src/io/commit/dynamodb.rs:299-343; rust/lance-table/src/io/commit/dynamodb.rs:423-484)

RowIdIndex's envelope tree, position arrays, rank directory and merged ID/address map are in-memory derived structures; this file defines no serialization for them. The benchmark's size labeled RowIdIndex serializes input RowIdSequences, not these structures. Preserve persisted sequence contracts separately from freely derived cache representation changes. (rust/lance-table/src/rowids/index.rs:29-60; rust/lance-table/src/rowids/index.rs:253-350; rust/lance-table/benches/row_id_index.rs:142-154)


## Materialization does not add a wire format

System-column wrapping consumes decoded row-ID/version sequences and physical selection metadata. Missing requested version sequences produce value 1; this is a runtime fallback, not a newly persisted field default or file-format version. The one-run fast path trusts its sequence span, so it is not a byte-decoder validation boundary. (rust/lance-table/src/utils/stream.rs:266-315; rust/lance-table/src/utils/stream.rs:560-591)


## File field conversion and exact runtime composition

Persisted protobuf Field decoding ignores r#type, treats unknown encoding numbers as None, lossily decodes byte metadata, and lets a nonempty dedicated extension name override metadata. Writes force r#type=0 and encode None as0. Primary key position0 requires the legacy bool for presence; clustering position0 decodes absent and its old bool is not emitted true. Dictionary locations/counts cast i64<->usize unchecked; loaded values do not cross this converter. (rust/lance-file/src/datatypes.rs:11-94; rust/lance-file/src/datatypes.rs:316-344)

Flat field lists require earlier parents, tolerate historical duplicate IDs and choose the first reconstructed pre-order match on ambiguity. Both field order and parent tie-breaking affect schema interpretation; the decoder does not validate unique IDs or logical types. (rust/lance-file/src/datatypes.rs:131-245; rust/lance-file/src/datatypes.rs:502-520)

External ColumnInfo serialization writes DirectEncoding containing prost Any bytes for each page and column, preserving ordered descriptors, page rows and priority. The in-memory column.index is not emitted by this converter. Exact dispatch selects concrete modules for metadata finishing and embedded batch framing; it does not imply their byte layouts are already covered. (rust/lance-file/src/writer.rs:79-115; rust/lance-file/src/versions/mod.rs:63-149; rust/lance-file/src/versions/mod.rs:374-401)

See [runtime matrix](../../L1-modules/rust-lance-file-runtime.md). Complete V2 specification acceptance still fails pending concrete versions, encoding runtimes and historical fixtures.

## Runtime composition and normalization boundary

V2_0 physical schema includes ordinary structural headers, with repeated external header metadata normalized to first page/total num_rows/priority0. V2_1+ maps leaves and opaque Blob/packed units. Exact page mechanisms are V2_1 reject_sparse+dense_u16, V2_2 reject_sparse+constant+dense_u32, V2_3 sparse+constant+dense_u32. These are runtime policy selections, not a complete byte-layout specification; exact reader grammar is covered below, while encoder/decoder byte algorithms remain pending. (rust/lance-file/src/versions/v2_0/mod.rs:38-132; rust/lance-file/src/reader/structural.rs:173-224; rust/lance-file/src/versions/v2_1/mod.rs:125-134; rust/lance-file/src/versions/v2_2/mod.rs:121-131; rust/lance-file/src/versions/v2_3/mod.rs:129-139)

Structural page/column encoding envelopes are Direct prost Any. Indirect/missing descriptions are rejected; page uses pb21 PageLayout, column uses pb ColumnEncoding. Page/global positions align to64, while column-buffer descriptor construction checks only count parity. Exact grammar validation is a per-version responsibility before normalization. (rust/lance-file/src/reader/structural.rs:29-171) See [composition detail](../../L1-modules/rust-lance-file-composition.md).

## Exact current reader acceptance

The [reader grammar matrix](../../L1-modules/rust-lance-file-readers.md) reconstructs every local branch. V2_0 accepts raw(0,3)/(2,0), decodes Direct Any to pb ArrayEncoding without recursive grammar/alignment validation. Structural versions require literal(2,minor), global64-byte alignment, exact PageLayout grammar then page normalization. RLE values/lengths are direct Flat fixed-width/u8 in2.1/2.2;2.3 validates arbitrary supported child trees. VariablePackedStruct rejects in2.1, traverses fields in2.2/2.3. MiniBlock large flag must befalse in2.1, true in2.2/2.3; Sparse only2.3 with selective nested validation. Full metadata finishing retains raw declared counts without row/byte reconciliation. This completes these local validators, not the full format byte algorithms. (rust/lance-file/src/versions/v2_0/reader.rs:30-148; rust/lance-file/src/versions/v2_0/reader.rs:350-395; rust/lance-file/src/versions/v2_1/reader.rs:26-258; rust/lance-file/src/versions/v2_2/reader.rs:26-260; rust/lance-file/src/versions/v2_3/reader.rs:26-298)

## Reconstructed V2_1/V2_2/V2_3 writer tail

After payload IO, exact wrappers finish field encoders, write raw descriptor protobuf, raw per-column metadata, column offset table, global offset table and a 40-byte footer. Every offset entry is a pair of LEu64 position/length. Descriptor occupies global-table entry0; user globals retain one-based indices even though their bytes were written earlier. Footer is three LEu64 starts, two LEu32 counts, LEu16 major2, LEu16 exact minor1/2/3, then LANC. No checksum or local count-cast validation. (rust/lance-file/src/writer/structural.rs:279-350; rust/lance-file/src/versions/v2_1/writer.rs:152-185; rust/lance-file/src/versions/v2_2/writer.rs:152-185; rust/lance-file/src/versions/v2_3/writer.rs:152-185; rust/lance-file/src/format.rs:33-33)

Ordinary buffers receive trailing 0x48 length padding; externally supplied buffers receive leading zero position padding only. Mini-batch helpers can omit descriptor/global entries and append the same footer while preserving supplied offsets. These writers do not validate every emitted page grammar and helper bodies do not repair alignment. Complete byte algorithms and backend reader/writer execution remain missing; this is still not a full v2 format qualification. (rust/lance-file/src/writer/structural.rs:187-229; rust/lance-file/src/writer/structural.rs:352-360; rust/lance-file/src/writer/structural.rs:834-921) [Detailed byte table](../../L1-modules/rust-lance-file-structural-writer.md).

## Concrete V2_0 standard versus embedded tails

Both tails use three LEu64 start offsets, two LEu32 counts, two LEu16 version numbers and LANC, totaling40 bytes. The standard writer emits(0,3), embedded self-described/mini helper emits(2,0); neither rewrites the other into a canonical footer. Embedded mini omits schema/global entry; self-described appends one descriptor. Offset tables contain16-byte position/length entries and raw protobuf metadata lacks length prefixes. Buffer descriptors are preserved by the embedded helper without validating offsets or exact grammar. (rust/lance-file/src/versions/v2_0/writer.rs:647-664; rust/lance-file/src/versions/v2_0/writer.rs:790-820; rust/lance-file/src/versions/v2_0/writer.rs:852-952)

The pinned fixture source requires this distinction; exact byte reproduction is stricter than merely normalizing both footers to V2_0. V2_3 has no historical fixture contract here. Binary fixture content and full decoder byte algorithms remain pending. (rust/lance-file/test_data/exact_versions/README.md:34-41; rust/lance-file/src/compatibility_tests.rs:379-465) [Footer table](../../L1-modules/rust-lance-file-v20-compatibility.md).

## Writer-test evidence is not a byte-format proof

The explicit V2_0 page fixture asserts eight pages whose raw buffer-size sums do not exceed1MiB. Structural large-value test verifies a40MiB Binary payload with128MiB write cap and10MiB read-chunk option; it does not inspect exact page bytes or IO request counts. Compression tests match first-page description strings rather than reconstruct bit layouts. This is historical test evidence only. Binary/test analysis is excluded; remaining production format synthesis belongs to M1. (rust/lance-file/src/writer_tests.rs:1226-1296; rust/lance-file/src/writer_tests.rs:1598-1792; rust/lance-file/src/writer_tests.rs:1794-1890) [Full oracles](../../L1-modules/archive/rust-lance-file-writer-tests.md).

## Shared footer/index loader and accounting

Footer decoding reads the final40bytes as three LEu64 offsets, two LEu32 counts, two LEu16 versions and4magic bytes. GBO entries are LE(position,size); checked ranges validate overflow/EOF after exact-version alignment. CMO entries are16bytes each and must stay inside the declared metadata region; zero/overlap/order are not separately constrained. Several pre-slice footer-order calculations remain unchecked. Missing FileDescriptor.schema unwraps. These parser limits must not be replaced by a blanket corrupt-file rejection guarantee. (rust/lance-file/src/reader.rs:740-861; rust/lance-file/src/reader.rs:893-1028)

Full-loader counters overlap: footer_bytes=file_size-schema_start, global_bytes=sumGBOsizes, data_bytes=column_meta_start-global_bytes, column_metadata_bytes=GBOstart-column_meta_start. ColumnStatistics.size_bytes counts page buffers alone. Embedded EncodedBatch constructors derive rows from first physical column page counts, not descriptor length or sparse slot normalization. [Parser detail](../../L1-modules/rust-lance-file-shared-reader.md). (rust/lance-file/src/reader.rs:659-685; rust/lance-file/src/reader.rs:978-1028; rust/lance-file/src/reader.rs:2344-2422)

## Copy-compatible ordinary files

Encoded concat requires exact version and full schema equality, rectangular normalized metadata, no extra globals, no column buffers and equal physical indices/serialized column encodings. Page encodings can vary. Output relocates each page buffer and adds preceding physical rows to priority; schema/footer are regenerated through the exact writer. V2_0 struct headers are copied once and normalized to total rows/priority0; other current versions preserve copied page lists. This adds no persisted part/target-ID format. (rust/lance-file/src/concat.rs:39-44; rust/lance-file/src/concat.rs:684-793; rust/lance-file/src/concat.rs:893-905; rust/lance-file/src/concat.rs:996-1021; rust/lance-file/src/versions/v2_0/mod.rs:105-132)

Anonymous Blob descriptor children are reconstructed by narrow ID/name/type shape matching before part validation. Packed/Dedicated descriptors retain external managed payload locations; nonempty Inline payload references cannot be reused in a different data file and are rejected. Lease/target association remains runtime/caller state. [Concat format boundary](../../L1-modules/rust-lance-file-concat.md). (rust/lance-file/src/concat.rs:140-151; rust/lance-file/src/concat.rs:243-302; rust/lance-file/src/concat.rs:408-440)

## V1 metadata and dense page-table implementation

V1 Metadata maps manifest position to protobuf tag1(0 external), cumulative signed32 batch offsets to tag2, page-table position to tag3 and statistics to tag5; tag4 is reserved due to an older-reader bug. Statistics stores flattened fields(tag1), leaf IDs(tag2)and table position(tag3), omitting schema-level metadata. Rust decode uses Some even for wire0 and unchecked usize casts. (protos/file.proto:25-93) (rust/lance-file/src/versions/v1/format/metadata.rs:34-78)

For valid caller-supplied field range and batch count, V1 table shape is N fields x M batches x2 signed64 values, field-major. Slot f,b is pair at2*((f-min_field_id)*M+b). Position is a file offset; length is the page encoding's logical element count in observed data writers. Missing/struct slots are0,0. Writer emits raw Arrow Int64 values bytes without a local endian-conversion step; reader delegates to V1 PlainDecoder. This is not a modern ColumnInfo/page-metadata representation. (rust/lance-file/src/versions/v1/page_table.rs:36-145) (rust/lance-file/src/versions/v1/writer/mod.rs:393-459)

Data-file physical mapping counts ordinary parents, and Blob/packed parents each stop child traversal. Do not confuse consecutive physical indices from this mapping with raw field-ID coordinates in the dense legacy table. (rust/lance-file/src/versions/v1/mod.rs:72-116) (rust/lance-file/src/versions/v1/page_table.rs:67-89) [Foundation detail](../../L1-modules/rust-lance-file-v1-foundation.md); [concrete codecs](../../L1-modules/rust-lance-file-v1-codecs.md) are covered; historical binary payload inspection remains pending.

## Concrete V1 value layouts

| Codec | Stored region / returned position | Validity and reconstruction |
|---|---|---|
| Plain primitive / FixedSizeBinary | Raw values buffer spans; return start | No validity or explicit endian conversion |
| Plain Boolean | One packed value bitmap across all input arrays | None encoded false; no validity bitmap |
| Plain FixedSizeList | Recursively flattened child values | Parent validity omitted; dimensions supplied externally |
| Binary four byte-array families | Payload bytes followed by N+1 absolute Int64 positions; return positions start | Equal positions imply null when nullable=true; empty and null are conflated |
| Dictionary | Plain integer key page; return keys start | Values supplied separately; key validity omitted |

Layout evidence: rust/lance-file/src/versions/v1/encoding/plain.rs:44-152; rust/lance-file/src/versions/v1/encoding/binary.rs:48-105; rust/lance-file/src/versions/v1/encoding/dictionary.rs:37-77. None of these regions independently stores logical length/type or a page header. Surrounding V1 schema/page metadata supplies those inputs. (rust/lance-file/src/versions/v1/writer/mod.rs:406-459; rust/lance-file/src/versions/v1/reader.rs:625-668)

Range byte addressing is floor/ceil over bits for Boolean, width multiplication for other plain values, and two absolute endpoints for Binary. Short fixed-width reads may be zero-filled; no new corruption-rejection guarantee is inferred. (rust/lance-file/src/versions/v1/encoding/plain.rs:165-249; rust/lance-file/src/versions/v1/encoding/binary.rs:190-232) [Codec detail](../../L1-modules/rust-lance-file-v1-codecs.md).

## V1 metadata and nested-array consumption

The V1 reader extracts a LEu64 metadata position from the last16..8 bytes through read_metadata_offset; that helper checks minimum16 bytes without magic/version validation. It decodes a framed metadata struct from the tail or a separate read. Current-version footer admission belongs to another boundary and is not implied here. (rust/lance-file/src/versions/v1/reader.rs:210-234; rust/lance-io/src/utils.rs:221-231; rust/lance-io/src/utils.rs:248-263)

Variable lists read Int32/Int64 position pages containing the terminal endpoint, normalize selected offsets and recursively read child values. Parent validity is not restored; the generic Arrow constructor replaces child field metadata/name/nullability with item/true. Struct reads likewise reconstruct only children. Dictionary keys are paired with caller-loaded schema values. [Reader supplement](../../L1-modules/rust-lance-file-v1-reader.md). (rust/lance-file/src/versions/v1/reader.rs:645-808; rust/lance-arrow/src/lib.rs:202-229)

## Full V1 writer emission order and list-page units

The historical writer emits each list parent as normalized i32/i64 positions, with PageInfo.length equal to logical rows plus one terminal position, then writes selected child spans recursively at the same batch ID. Struct parents have no payload/validity page; Null stores cursor and count without payload. Other page lengths are logical array elements, not bytes. List validity is not serialized separately. (rust/lance-file/src/versions/v1/writer/mod.rs:393-586)

At finalization, ordinary dense page table uses minimum schema ID, followed by optional stats arrays and table at batch0, schema dictionary values, optional provider manifest, framed Metadata and tail. Statistics leaf_field_ids actually receives every stats-schema preorder ID, including struct roots. Tail bytes are i64 LE metadata position, i16 LE0, i16 LE2, LANC; protobuf framing is u32 LE size followed by encoded bytes. No alignment padding is added by this footer. [Writer supplement](../../L1-modules/rust-lance-file-v1-writer.md). (rust/lance-file/src/versions/v1/writer/mod.rs:588-651; rust/lance-core/src/datatypes/schema.rs:600-604; rust/lance-io/src/traits.rs:83-106; rust/lance-file/src/format.rs:30-33)

## V1 statistics row schema and prefix bounds

Each statistics root is nonnullable Struct named by decimal original field ID, ordered by BTreeMap ID. Children are null_count:Int64 nonnullable, min_value and max_value nullable in the original dtype; source field metadata/name are not retained. The writer stores this finished batch separately at statistics batch0. (rust/lance-file/src/versions/v1/writer/statistics.rs:611-670) (rust/lance-file/src/versions/v1/writer/mod.rs:588-625)

Prefixes use64 bytes, with UTF8 boundary preservation. Any truncation causes upper-bound successor attempt; failure makes the upper bound absent. Binary carry zeroes suffixes while UTF8 successor preserves them and repeatedly validates bytes. Exact64-byte values remain exact when no value is truncated. Fixed-binary low-level results retain original-width tags with shortened payloads and are excluded from automatic collector output. [Full contract](../../L1-modules/rust-lance-file-v1-statistics.md). (rust/lance-file/src/versions/v1/writer/statistics.rs:176-450) (rust/lance-file/src/versions/v1/writer/statistics.rs:586-609)

## Benchmark evidence is not a format guarantee

The reader benchmarks generate exact V2_0,V2_1,V2_2 files with default writer options; they omit V1/V2_3 and do not inspect on-disk encodings or compare decoded values. Schema reconstruction starts from parsed protobuf Field messages. These workloads therefore supply no new byte-layout/version compatibility proof. [Benchmark guide](../../L1-modules/archive/rust-lance-file-benchmarks.md). (rust/lance-file/benches/reader.rs:30-62) (rust/lance-file/benches/reader.rs:365-369) (rust/lance-file/benches/reader.rs:311-334) (rust/lance-file/benches/schema.rs:10-70)

## Fully interpreted V1 compatibility artifact

The [V1 binary specification](../../L1-modules/archive/rust-lance-file-binary-fixtures.md) and [78-region byte map](../../L2-files/rust/lance-file/test_data/exact_versions/v1.lance.md) exhaust v1.lance. Byte coordinates use zero-based half-open intervals. Data[0,386572), page table[386572,387052), dictionary bytes[387052,387064), dictionary positions[387064,387096), UInt32 length17[387096,387100), protobuf[387100,387117), footer[387117,387133). No other regions exist. Footer stores metadata pointer387096, major0/minor2 and LANC. (rust/lance-file/test_data/exact_versions/v1.lance@bytes:0-387133)

The field-major table has6x5 pairs of Int64(position,logical length). Variable binary positions address an absolute Int64 offset vector; list positions address relative Int32 offsets with N+1 length; child lengths count flattened Int32 values. Dictionary values are green/blue/red with positions[387052,387057,387061,387064]. Metadata hex120b0080088010801880208120188ccc17 contains packed batch offsets[0,1024,2048,3072,4096,4097] and table pointer386572 only. External schema and dictionary values/offsets are required to interpret the file. (rust/lance-file/test_data/exact_versions/v1.lance@bytes:386572-387133; protos/file.proto:24-93; rust/lance-file/src/versions/v1/page_table.rs:36-144; rust/lance-file/test_data/exact_versions/datagen.rs:25-36)

The fixture demonstrates the historical null transformation:586 name nulls retained through equal positions,373 null lists read empty,745 null child integers read0 and316 null dictionary keys read green. These counts are derived from every checked row, not sampling. Stable compatibility must preserve the declared legacy read behavior; modern formats require their own layouts and null semantics. (rust/lance-file/test_data/exact_versions/v1.lance@bytes:0-386572; rust/lance-file/src/compatibility_tests.rs:100-135; AGENTS.md:13-18)

## Complete embedded V2_0 artifacts

The [embedded fixture contract](../../L1-modules/archive/rust-lance-file-embedded-fixtures.md) gives all318 byte regions and146 pages per file. Both share data[0,10124): id bytes1028, name indices2056, name payload7040. Mini has column metadata[10124,22889), CMO[22889,22921), empty GBO, footer[22921,22961). Self-described inserts FileDescriptor[10124,10224), moves metadata to[10224,22989), CMO to[22989,23021), adds GBO[23021,23037), then footer[23037,23077). The12765 column-metadata bytes are identical. No padding/checksum/trailing bytes exist. (rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:0-22961; rust/lance-file/test_data/exact_versions/v2_0_self_described.lance@bytes:0-23077)

Every column uses direct Any ColumnEncoding.values. Integer pages are Nullable/NoNull/Flat32; string pages are Binary with NoNull Flat64 end offsets and Flat8 bytes with explicit none compression. Null raw end=A+normalized_end, A=page payload bytes+1, and comparison is>=A. All37 string nulls survive. Descriptor rows257 and scalar schema fields include legacy encoding tags1/2 and type0 defaults; page encoding remains authoritative. Full nested tags, URLs, offsets, payload values, lengths and schema fields appear in both L2 catalogs. (protos/file2.proto:138-216; protos/encodings_v2_0.proto:44-80; protos/encodings_v2_0.proto:174-188; protos/encodings_v2_0.proto:246-250; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107; rust/lance-file/test_data/exact_versions/v2_0_self_described.lance@bytes:10124-10224)

## Fully interpreted standard V2_0 artifact

The [1010-region contract](../../L1-modules/archive/rust-lance-file-standard-v20-fixture.md) covers706157 bytes:619328 data/alignment,327 unframed FileDescriptor,86350 column metadata,96 CMO,16 GBO and40 footer. The six columns have69/513/5/263/61/65 pages respectively. Data includes127007 blob-payload bytes,312875 page-payload bytes and179446 padding bytes; all padding equals0x48. Nested Any wrappers, all protobuf tags/defaults and every physical buffer offset/size are cataloged. (protos/file2.proto:40-93; protos/file2.proto:138-216; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:0-706157)

Name/list nulls add a page-local A to cumulative end offsets; raw>=A signals null. The first list's raw2791 equals A2791 and is null, exposing the proto comment's strict-greater-than wording. Child nulls use LSB-first validity bits with zero invalid backing; dictionary nulls use ordinary key3 pointing to dictionary item null. Every dictionary page stores[green,blue,red,null] with ends[5,9,12,25],A13. Blob descriptions are two interleaved UInt64 values and ColumnEncoding Blob(inner Values), not BlobV2. Field.type defaults0; deprecated encoding tags remain but do not select page codecs. (protos/encodings_v2_0.proto:82-155; rust/lance-encoding/src/array_encoding/logical/list.rs:1116-1243; rust/lance-encoding/src/data.rs:1703-1778; rust/lance-encoding/src/array_encoding/logical/blob.rs:308-399; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:0-706157)

## Fully interpreted V2_1 structural artifact

The [575-region contract](../../L1-modules/archive/rust-lance-file-standard-v21-fixture.md) specifies 501,167 bytes: data/alignment498240, descriptor327, column metadata2464, CMO80, GBO16, footer40. Footer(2,1), five Values columns, structural PageLayout Any wrappers, priorities0/1024/2048/3072/4096. There are25 pages,73 mini-blocks and60 page buffers. Stored list items differ from level counts; each chunk supplies its own UInt16 num_levels. Mini-block data uses8-byte0xFE padding, outer buffers64-byte0x48 padding. (protos/file2.proto:40-93; rust/lance-encoding/src/encodings/logical/primitive.rs:5751-5910; rust/lance-file/test_data/exact_versions/v2_1.lance@bytes:0-501167)

FastLanes transposes native-word lanes before packing; InlineBitpacking stores a native-word width header, while OutOfLineBitpacking gets width from metadata and may use raw16-bit tails. Name offsets include their own offset-array size; dictionary-block offsets instead start at zero relative to a separately marked payload. Final full blob chunks have log8, showing that a final log0 sentinel is optional for full chunks despite the struct comment. [Exact lane equations, partitions and per-buffer meaning](../../L1-modules/archive/rust-lance-file-standard-v21-fixture.md). (rust/compression/bitpacking/src/lib.rs:4-172; rust/lance-encoding/src/encodings/physical/bitpacking.rs:389-536; rust/lance-encoding/src/encodings/physical/value.rs:83-111; rust/lance-file/test_data/exact_versions/v2_1.lance@bytes:0-501167)

## V2_2 pinned structural and scalar bytes

The [complete544-region map](../../L1-modules/archive/rust-lance-file-standard-v22-fixture.md) covers500987 bytes:498048 data/alignment,327 descriptor,2476 column metadata,80 CMO,16 GBO,40 footer. Footer(2,2),25 pages,71 chunks,57 buffers. Every mini-block has_large_chunk=true and UInt32 metadata/value lengths; rep/def byte sizes and level counts remain UInt16. Final id4096 is inline00100000 with no buffers. Final name uses52 bytes: UInt32[2,8,32], Arrow Int32 offsets[0,32],32 UTF-8 bytes. No inline value plus one buffer selects a scalar constant, not all-null. (rust/lance-arrow/src/scalar.rs:61-191; rust/lance-encoding/src/encodings/logical/primitive.rs:4541-4581; rust/lance-encoding/src/encodings/logical/primitive.rs:5751-5910; rust/lance-file/test_data/exact_versions/v2_2.lance@bytes:0-500987)

## Constructor contracts are narrower than format acceptance

The complete [constructor catalog](../../L1-modules/rust-lance-encoding.md) reconstructs all helper signatures and fields. Older ArrayEncoding embeds page-buffer indices and string compression schemes. Structural CompressiveEncoding instead nests child descriptions and uses optional BufferCompression enums; its out-of-line bitpacking child differs from the older direct compressed-width field. Fixed-list dimensions narrow to u32 in the older helper and remain u64 structurally. (rust/lance-encoding/src/format.rs:101-194; rust/lance-encoding/src/format.rs:312-415)

Generated bytes fields use Bytes because the build script configures every bytes field. Optional constant bytes preserve None versus Some(empty). A Constant compression node is distinct from a ConstantLayout page; constant_layout clears level fields, while compressed_all_null_constant_layout retains caller counts and optional streams. Neither enforces scalar size, nullness, page buffers or exact-version legality. (rust/lance-encoding/build.rs:15-20; rust/lance-encoding/src/format.rs:328-338; rust/lance-encoding/src/format.rs:673-716)

The pb21 suffix denotes a shared schema family. Exact V2.1 rejects variable packed structs and large mini-block framing and only admits constant layouts without inline bytes or compressed levels. Exact V2.2 recursively validates variable fields, requires large mini-block framing and validates optional constant-level encodings. These reader checks are separate from the infallible layout constructors; even the checks listed here are not a claim that every cross-field invariant is validated. (rust/lance-encoding/src/format.rs:19-33; rust/lance-encoding/src/format.rs:532-773; rust/lance-file/src/versions/v2_1/reader.rs:93-142; rust/lance-file/src/versions/v2_2/reader.rs:93-144)

## General buffer compression framing

[Codec APIs and failure contracts](../../L1-modules/rust-lance-encoding.md) · [Complete physical block source analysis](../../L2-files/rust/lance-encoding/src/encodings/physical/block.rs.md). These codecs do not themselves choose exact file versions.

| Scheme | Written bytes and decode rule | Evidence |
|---|---|---|
| Zstd | 8-byte LE uncompressed length followed by bulk Zstd output. Dispatcher treats empty input as no-op; <8 bytes as raw; otherwise magic0xFD2FB528 plus byte4 mask0x10 clear as raw; remaining input is length-prefixed. Raw path uses stream copy_decode. Prefix path sizes output from declared length and ignores returned byte count. | rust/lance-encoding/src/encodings/physical/block.rs:202-298 |
| LZ4 | Dependency block compressor with prepend_size=true, four-byte LE declared uncompressed size. Decode rejects <4 bytes, allocates declared tail and truncates to returned count. No local equality assertion. | rust/lance-encoding/src/encodings/physical/block.rs:302-368 |
| None | Input copied with no framing, but not legal as structural General BufferCompression enum. | rust/lance-encoding/src/encodings/physical/block.rs:82-110; rust/lance-encoding/src/encodings/physical/block.rs:370-390 |
| FSST | Runtime enum/string exists but generic buffer factory rejects it; separate codec remains pending. | rust/lance-encoding/src/encodings/physical/block.rs:75-138; rust/lance-encoding/src/encodings/physical/block.rs:394-403 |

Zstd comment identifies reserved bit3 while executed0x10 mask tests bit4. Preserve this discrepancy as evidence; do not silently rewrite the byte rule from external assumptions. Decoder length fields can cause large allocations, and mutation is not transactional on failure. Writer output appends, so multi-frame boundaries must be carried by caller offsets; the repeated-compression test explicitly splits frames before decoding. (rust/lance-encoding/src/encodings/physical/block.rs:203-290; rust/lance-encoding/src/encodings/physical/block.rs:724-769)

Whole-block General descriptors preserve requested optional level; per-value descriptors use normalized runtime config. Fixed-width block inner descriptor is Flat, variable-width delegates to VariableEncoder, and recursive General decoding selects the inner codec from metadata. This structure is independent of the variable-only convenience decompressor. Byte-packed repetition indices use raw1/2/4/8-byte LE integers with external width/count; Zero intentionally emits nothing, not a zero-length integer representation. (rust/lance-encoding/src/encodings/physical/block.rs:553-675; rust/lance-encoding/src/compression.rs:1213-1231; rust/lance-encoding/src/utils/bytepack.rs:73-224; rust/lance-encoding/src/encodings/logical/primitive.rs:6555-6607)

## Mini-block records versus persisted framing

The in-memory MiniBlockChunk uses Vec<u32> byte sizes for parallel buffers and u8 log count. A positive log means2^log values; zero means total-page values minus previously decoded counts. The record does not validate arithmetic, configured limits or final position. Comments describe2.1 u16/32KiB chunk framing and2.2 u32 framing, but exact file composition and serializers remain the wire-format authority. [Record analysis](../../L2-files/rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs.md). (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:80-126)

General mini-block output retains buffer ordering and all size/count metadata except size0, which becomes each independent outer-compressed chunk's byte length. Decoder requires separated chunk buffers and unwraps only first. Strict whole-first-buffer savings choose whether General metadata exists at all; a configured codec is not a guarantee of a General descriptor. Full-zip per-value output instead permits fixed/variable representation and guarantees value-independent decode by trait contract. (rust/lance-encoding/src/encodings/physical/general.rs:39-145; rust/lance-encoding/src/encodings/logical/primitive/fullzip.rs:20-54)

Constant block decoding requires no payload and uses descriptor scalar plus enclosing row count; zero-length present payload is invalid. Typed scalar presence distinguishes constant-empty from all-null. Changing payload convention or log sentinel changes interpretation and must obey stable contracts; sparse eligibility itself is composed by2.3, not by the version-free lazy helper. (rust/lance-encoding/src/encodings/physical/constant.rs:14-62; rust/lance-file/src/versions/v2_2/mod.rs:121-131; rust/lance-file/src/versions/v2_3/mod.rs:129-139; AGENTS.md:5-20)

## Raw FSL and current bitpacking layouts

[Reviewed codec APIs](../../L1-modules/rust-lance-encoding.md); [value L2](../../L2-files/rust/lance-encoding/src/encodings/physical/value.rs.md); [bitpacking L2](../../L2-files/rust/lance-encoding/src/encodings/physical/bitpacking.rs.md). These codecs do not themselves select a file version. Full v2 composition and all encodings remain incomplete.

Raw FSL mini-block buffers are parallel: zero or more child-validity buffers in outer-to-inner order, then one leaf buffer. Each chunk's sizes list follows the same order. Validity bits span that chunk's expanded child count and are byte-padded independently per chunk. Raw per-value nullable FSL instead stores each outer row's validity slices, each independently padded to a byte, followed by that row's leaf bytes. Dimensions and validity presence are in nested FixedSizeList metadata ending in Flat or Constant. Identical descriptors therefore require the correct enclosing interface to interpret their buffers. (rust/lance-encoding/src/encodings/physical/value.rs:141-309; rust/lance-encoding/src/encodings/physical/value.rs:323-465; rust/lance-encoding/src/encodings/physical/value.rs:546-806)

Inline payload is [native-width word containing W][128*W payload bytes] per chunk. Native width T is supplied by InlineBitpacking metadata; W may differ per chunk. Final residual input is zero-padded to1024 values; W=0 has no packed payload. Full chunks use log10, final chunk log0 even if it has1024 values. In contrast, raw ValueEncoder uses positive log for a complete final chunk. The reviewed serializer preserves supplied logs: after size>0, alignment8 and log<=15 checks, it forms ((aligned_bytes/8-1)<<4)|log and writes little-endian u16 or u32 according to preamble, with different size limits. Codec payload length and this aligned serialized framing are separate quantities. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:75-166; rust/lance-encoding/src/encodings/physical/value.rs:80-115; rust/lance-encoding/src/encodings/logical/primitive.rs:5863-5902)

OOL has no width headers. Metadata is OutOfLineBitpacking(native T, nested Flat W). Full chunks each use1024*W/T native words. Residual R is raw if1024*W>=R*T, otherwise padded and packed. On decode raw is detected by compressed native-word count equaling full_chunks*(1024*W/T)+R. Equality MUST select raw; the two representations can have the same size but different bytes. W=0 can encode zero values in zero payload bytes; count remains external. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:389-650)

FastLanes packing is not ordinary consecutive-value bit concatenation. For native width T, lanes=1024/T and row r in0..T, input index=FL_ORDER[floor(r/8)]*16+(r%8)*128+lane, where FL_ORDER=[0,4,2,6,1,5,3,7]. A value's low W bits begin in packed word lanes*floor(r*W/T)+lane at bit(r*W)%T, with carry into the next word for that lane when crossing a word boundary. W=T still transposes; W=0 emits nothing and decode fills zeros. Kernels use exact1024-value input/output shape. Their crate is only contextually read; complete specialized implementation and tests remain pending. (rust/compression/bitpacking/src/lib.rs:1-278)

The bitpacking intro's example0..5000 requires13 bits, although its comment says12. The ignored OOL example sketches compression ratios but omits the kernel's permutation and is not an exact byte specification. Current definitions, version composition and stable-format compatibility rules control changes; frozen legacy paths are excluded from new feature design. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:4-22; rust/lance-encoding/src/encodings/physical/bitpacking.rs:532-555; AGENTS.md:5-20)

## Current variable-width, FSST and BSS byte layouts

These local layouts do not supply complete file-version composition. [API contracts](../../L1-modules/rust-lance-encoding.md); [binary](../../L2-files/rust/lance-encoding/src/encodings/physical/binary.rs.md), [FSST](../../L2-files/rust/lance-encoding/src/encodings/physical/fsst.rs.md), [BSS](../../L2-files/rust/lance-encoding/src/encodings/physical/byte_stream_split.rs.md).

For N variable mini-block values of offset width W=4/8 bytes, header is N+1 native offsets, each original offset minus chunk's first plus (N+1)*W. Copy only selected payload and pad to W with0x48. Endpoints address the whole chunk, not just payload. Decoder accepts a prefix when the first offset exceeds the requested smaller table size. Chunk count/log and boundaries are supplied externally. (rust/lance-encoding/src/encodings/physical/binary.rs:58-152; rust/lance-encoding/src/encodings/physical/binary.rs:214-246; rust/lance-encoding/src/encodings/physical/binary.rs:331-441)

Current32-bit whole-block header is [u32LE32][u32LE bytes_start];64-bit is [u64LE64][u64LE bytes_start]. Follow with original offset buffer and entire value buffer. bytes_start=8/16+offset bytes; first offset must0 at decode. Count lives outside this current header. Frozen old reader accepts [u8 width][u32/u64 count][u32/u64 bytes_start], detects it when any bytes1..3 nonzero, and only debug-checks embedded count. Preserve existing old read behavior; new features belong in current writers and stable compatibility contracts. (rust/lance-encoding/src/encodings/physical/binary.rs:457-534; rust/lance-encoding/src/encodings/physical/binary.rs:564-714; AGENTS.md:5-20)

FSST protobuf wrapper stores symbol_table and nested values compression separately. Local kernel table is2312bytes=8+256*8+256. Native-endian u64 header combines MAGIC=0x46535354<<32, switch bit24,suffix limit bits16+,terminator bits8+,low8-bit symbol count. Export writes nsyms native u64 symbol words beginning byte8, then nsyms lengths immediately afterward; unused bytes remain as allocated. Decoder checks MAGIC by bit inclusion (header&MAGIC)==MAGIC, validates table size and symbol lengths1..8, and uses ESC255 for literal bytes. Public kernel comments placing the magic in input data disagree with actual table handling. Below32768 input bytes switch is off and payload/offsets are copied. Full kernel format/unsafe analysis remains pending. (rust/compression/fsst/src/fsst.rs:22-56; rust/compression/fsst/src/fsst.rs:910-1098; rust/compression/fsst/src/fsst.rs:1115-1455; rust/lance-encoding/src/encodings/physical/fsst.rs:147-194)

BSS chunk payload contains W consecutive byte streams of N bytes each. Stream j contains the jth byte of each original value; inverse uses input[j*N+i]. Width32/64 is nested Flat metadata; no separate local header or padding. Values split at1024/512 before transposition, so the same total bytes cannot be decoded as one chunk without preserving boundaries. Positive count needs exact one-buffer byte length; zero count ignores input. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:83-274)

## Packed-struct field framing

For fixed packing with child byte widths w0..wk and N rows, row i is concat(child0[i*w0..(i+1)*w0],...,childk[i*wk..(i+1)*wk]). PackedStruct stores widths in bits and nested Flat row compression. The fixed per-value path has no per-child codec descriptor; it synthesizes raw child readers. Mini-block framing is supplied by the inner ValueEncoder; it is distinct from the fixed per-value interface. (rust/lance-encoding/src/encodings/physical/packed.rs:40-187; rust/lance-encoding/src/encodings/physical/packed.rs:432-494; rust/lance-encoding/src/encodings/physical/packed.rs:879-980)

VariablePackedStruct fields carry nested value codec and one of bits_per_value or bits_per_length. Within each row, fixed fields occupy bits_per_value/8 bytes, variable fields occupy a4/8-byte little-endian length plus that many compressed bytes. Outer VariableWidth offsets identify row boundaries separately. Decoder accepts unused leading/trailing outer bytes but rejects trailing bytes within each nonempty row. An empty row has identical neighboring outer offsets and produces zero/empty field placeholders. Default strategy requires both descriptor value/layout and recursively constructs the selected child interface. (rust/lance-encoding/src/encodings/physical/packed.rs:222-417; rust/lance-encoding/src/encodings/physical/packed.rs:606-866; rust/lance-encoding/src/compression.rs:1127-1165)

Production feature selection: V2.1 no packed per-value, V2.2 variable-packed per-value, V2.3 fixed or variable packed per-value. Schema/file-policy validity is separate from local descriptor parsing. [Contracts and version caveat](../../L1-modules/rust-lance-encoding.md). (rust/lance-file/src/versions/v2_1/compression.rs:85-98; rust/lance-file/src/versions/v2_2/compression.rs:77-93; rust/lance-file/src/versions/v2_3/compression.rs:77-92)

## Compression descriptor acceptance is interface-specific

The [shared strategy contract](../../L1-modules/rust-lance-encoding.md) now lists the complete default decoder dispatch matrix. A protobuf tag being representable does not mean every interface accepts it or every stable writer emits it. RLE supports direct Flat or selected block-coded children, validates value/run-length widths separately, and rejects a pair whose two children both require the run count. General-wrapped RLE child grammar permits only one General level and Flat/OutOfLine inner forms. Structural context and production version registration remain separate contracts. (rust/lance-encoding/src/compression.rs:988-1407; rust/lance-file/src/versions/v2_1/compression.rs:51-83; rust/lance-file/src/versions/v2_2/compression.rs:41-75; rust/lance-file/src/versions/v2_3/compression.rs:41-75)

## RLE byte grammar and count authority

```text
RLE mini result
+-- descriptor: RLE(values child, lengths child)
+-- global values buffer: concatenated child chunks
+-- global lengths buffer: concatenated child chunks
+-- each chunk: [values bytes, lengths bytes] sizes + logical-count log
RLE whole-block payload
+-- u64 little-endian values section byte size
+-- values section: one native value per physical run
+-- lengths section: matching positive literal u8/u16/u32 counts
```

Raw lengths are literal, never minus-one encoded. Run width comes from the child descriptor, while expected logical count comes from the enclosing interface. The block writer always emits raw children; the reader can accept permitted block-coded children constructed elsewhere, and its header still counts the encoded values section. Empty raw block is eight zero bytes. Mini child candidates retain per-chunk boundaries through sizes; concatenating General frames does not authorize decoding all chunks as one frame. Nonfinal log0 cannot represent a one-value chunk because zero is the final-count sentinel. (rust/lance-encoding/src/encodings/physical/rle.rs:121-139; rust/lance-encoding/src/encodings/physical/rle.rs:474-500; rust/lance-encoding/src/encodings/physical/rle.rs:621-634; rust/lance-encoding/src/encodings/physical/rle.rs:745-813; rust/lance-encoding/src/encodings/physical/rle.rs:1049-1151; rust/lance-encoding/src/encodings/physical/rle.rs:1673-1709)

Compatibility behavior is interface-specific: mini eager decoding clamps excess repeats; strict block/lazy decoding rejects them. Count inference recognizes only the historical raw16/U8 signature. These are existing read contracts to preserve, separate from permission to extend legacy writers. Production format version selection remains in lance-file strategies. [Full RLE contract](../../L1-modules/rust-lance-encoding.md). (rust/lance-encoding/src/encodings/physical/rle.rs:1533-1668; rust/lance-encoding/src/encodings/physical/rle.rs:1793-1877; rust/lance-file/src/versions/v2_1/compression.rs:51-83; rust/lance-file/src/versions/v2_2/compression.rs:41-75; rust/lance-file/src/versions/v2_3/compression.rs:41-75; AGENTS.md:5-20)

## DataBlock buffers are not a file format

```text
DataBlock physical buffers
+-- Empty / AllNull: no buffers
+-- Constant / FixedWidth: data
+-- VariableWidth: offsets, payload
+-- Nullable: validity, child buffers
+-- FixedSizeList: child buffers
+-- Struct: concatenated child buffers (own validity omitted)
+-- Dictionary: indices, dictionary buffers
+-- Opaque: existing buffer vector
```

The flattening API emits no schema, logical count, dimensions, offsets width, encoding descriptors or version markers. Outer codec/file framing must supply interpretation; using this API alone cannot preserve every Arrow validity layout. Dictionary null normalization and string offset rebasing are in-memory transformations, not additional file-version gates. Existing AllNull/Nullable future-deprecation comments do not remove their current dispatch. Stable file compatibility and frozen legacy boundaries remain governed by the repository policy and actual writer strategies. (rust/lance-encoding/src/data.rs:40-120; rust/lance-encoding/src/data.rs:958-960; rust/lance-encoding/src/data.rs:1030-1035; rust/lance-encoding/src/data.rs:1139-1143; rust/lance-encoding/src/data.rs:1211-1227; rust/lance-encoding/src/data.rs:1504-1597; rust/lance-encoding/src/data.rs:1685-1778; AGENTS.md:5-20)

## Dense structural representation

Arrow outer-first layers become normalized batch-concatenated layers, then dense u16 rep/def plus leaf-first meanings. Mini-block slicing maps visible values to dense level ranges; full-zip places repetition above definition in little-endian words. The sparse-planning seam consumes the same normalized layers, but its full wire specification remains pending. Temporary SPECIAL_THRESHOLD32767 tags are removed before output. All-zero present buffers require zero-byte NIL on both sides. This module selects no file version; stable compatibility and frozen legacy boundaries remain governed by actual writer/format policy. (rust/lance-encoding/src/repdef.rs:153-164; rust/lance-encoding/src/repdef.rs:224-340; rust/lance-encoding/src/repdef.rs:426-451; rust/lance-encoding/src/repdef.rs:714-738; rust/lance-encoding/src/repdef.rs:950-956; rust/lance-encoding/src/repdef.rs:2412-2548; rust/lance-encoding/src/repdef.rs:2808-2840; AGENTS.md:5-20)

## Encoder metadata versus physical serialization

EncodedArray couples DataBlock with protobuf ArrayEncoding; EncodedPage supplies data buffers, PageEncoding, top-row priority and physical column index; EncodedColumn adds column buffers, ColumnEncoding and final pages. The minimum declared page-buffer alignment is8. These records alone emit no footer or protobuf framing. The memory helper stores absolute offset/size pairs while appending unpadded buffers; complete file-writer alignment and framing must be taken from writer analysis. Blob builders reserve one original-field-ID column for synthesized descriptors and use the same root metadata. Version-free builders do not widen stable format policy. (rust/lance-encoding/src/encoder.rs:36-115; rust/lance-encoding/src/encoder.rs:380-501; rust/lance-encoding/src/encoder/structural.rs:75-88; rust/lance-encoding/src/encoder/structural.rs:133-165; rust/lance-file/src/versions/v2_1/mod.rs:69-122; rust/lance-file/src/versions/v2_2/mod.rs:67-131)

## Decode metadata and wire-format boundaries

PageEncoding tags Legacy ArrayEncoding versus Structural PageLayout; ColumnInfo first-page classification is a planner heuristic, not validation of a homogeneous wire grammar. PageInfo priority is a top-level row position used by newer structural formats, despite its only-2.1 comment. File/column/page buffer views hold positions and sizes without parsing a footer. Rep/def exhaustion is checked when converting structural tasks into root arrays. Candidate decoded-byte APIs default NotSupported. Memory layout selection is explicit and must agree with encoded metadata. (rust/lance-encoding/src/decoder.rs:424-526; rust/lance-encoding/src/decoder.rs:635-651; rust/lance-encoding/src/decoder.rs:3221-3232; rust/lance-encoding/src/decoder.rs:3325-3464)

## Primitive helper representation contracts

Nested repetition-index groups are little-endian u64 words; first word counts ends, second indicates partial trailer, higher words are ignored by this local top-row parser. Row starts per chunk=ends+(partial>0)-previous_trailer. Relative byte prefixes and row/leaf counts have separate storage. Parent metadata low four bits encode item log; upper bits encode aligned byte length minus one alignment unit. These local rules do not establish every version gate or complete page validation. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:141-343; rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:387-431; rust/lance-encoding/src/encodings/logical/primitive.rs:2668-2810)

Constant scalar-present layouts are inline with0/2 buffers or external with1/3 buffers. Optional levels use paired rep/def slots. External scalar frame is u32 buffer count, u32 length per buffer, then payload, all little-endian. Dictionary helper emits signed32-bit indices regardless of dictionary value width; supported fixed values64/128, variable offsets32/64. Parent policy supplies size/entry limits. Scalar-free all-null pages follow a distinct dispatch. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:30-205; rust/lance-arrow/src/scalar.rs:46-129; rust/lance-encoding/src/encodings/logical/primitive/dict.rs:172-427; rust/lance-encoding/src/encodings/logical/primitive.rs:4543-4572)

## Blob descriptor distinctions

Original binary Blob wraps a structural position/size page: zero-size position0 is empty, zero-size nonzero position packs definition in bits16..31 and repetition in bits0..15. Positive size uses actual byte offset. Reader ignores high32 bits in zero-size packed levels. Outer meanings accompany BlobLayout; descriptor inner is encoded without its original validity. Payload task creates64-bit Arrow offsets. (rust/lance-encoding/src/encodings/logical/blob.rs:73-199; rust/lance-encoding/src/encodings/logical/primitive/blob.rs:174-214; rust/lance-encoding/src/encodings/logical/primitive/blob.rs:386-405; rust/lance-encoding/src/encodings/logical/primitive/blob.rs:499-552)

Blob-v2 five-field descriptors are ordinary packed structural data and preserve parent Struct nulls. Kind-specific sidecar ID/URI/position/size semantics must not be interpreted as original two-field sentinels. Exact V2.1 rejects marked nonbinary shapes; V2.2/V2.3 include structural Blob factory. No numeric gate in these helper constructors independently overrides version strategy. Cache-key schema version2 and view variants are cache identity only. (rust/lance-encoding/src/encodings/logical/blob.rs:234-437; rust/lance-file/src/versions/v2_1/mod.rs:69-90; rust/lance-file/src/versions/v2_2/mod.rs:67-93; rust/lance-file/src/versions/v2_3/mod.rs:75-101; rust/lance-encoding/src/encodings/logical/primitive.rs:4746-4778)

## Structural FSL and Map shape contract

These logical wrappers contribute rep/def structure and reuse child columns. FSL records dimension/validity and later decimates child levels before Arrow reconstruction. Map records normalized offsets/validity and reconstructs i32 offsets, with Struct entries. They do not write standalone FSL or Map offset pages here. Exact V2.1 composition rejects these complex shapes; V2.2/V2.3 select these structural factories. This is not a new compatibility promise for unstable branch-only representations. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:48-106; rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:278-304; rust/lance-encoding/src/encodings/logical/map.rs:43-88; rust/lance-encoding/src/encodings/logical/map.rs:192-237; rust/lance-file/src/versions/v2_1/mod.rs:95-122; rust/lance-file/src/versions/v2_2/mod.rs:95-118; rust/lance-file/src/versions/v2_3/mod.rs:103-126; AGENTS.md:5-20)
