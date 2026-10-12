> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# Standard V2_0 fixture: complete physical contract

Scope: all706,157 bytes of the pinned standard V2_0 file. [Main module](../rust-lance-file.md), [complete1010-region L2 map](../../L2-files/rust/lance-file/test_data/exact_versions/v2_0.lance.md), [format specification](../../L3-symbols/format-spec.md), [development recipes](../../L4-crosscutting/cookbook.md), [orientation](../../L0-orientation.md). V2_2 binary contents are now fully interpreted; complete encoding implementations remain pending. No Lance runtime was executed.

## Input and schema

The deterministic4097-row input and five batch writes are specified in the L2 contract. Six flattened schema Fields encode five logical roots: id0:Int32 nonnullable, name1:Utf8 nullable, items2:List nullable with item3:Int32 nullable, category4:Dictionary(Int8,Utf8) nullable, blob5:LargeBinary nullable. Name compression=none, category dict-values-compression=none, blob=true metadata persist. Field parent IDs are-1 except item parent2. All Field.type tags are absent/default0 despite the older proto comments describing separate leaf/repeated types; logical_type and parent IDs supply actual structure. Deprecated encoding tags1/2/3 remain in schema, but page encodings are authoritative. Category retains an empty deprecated Dictionary message with default offset/length0. Schema has no top-level metadata. (rust/lance-file/test_data/exact_versions/datagen.rs:37-99; protos/file.proto:123-223; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:619328-619655)

## Byte layout

| Region | Half-open bytes | Meaning |
|---|---|---|
| Data and alignment | 0–619328 | Five batches: out-of-line blobs, then columns0..5 |
| FileDescriptor | 619328–619655 | tag1 Schema321 bytes plus tag2 rows4097 |
| Column0 id | 619655–624182 | 69 pages;4527 metadata bytes |
| Column1 name | 624182–672445 | 513 pages;48263 bytes |
| Column2 items offsets | 672445–672864 | 5 pages;419 bytes |
| Column3 items.item | 672864–693681 | 263 pages;20817 bytes |
| Column4 category | 693681–700434 | 61 pages;6753 bytes |
| Column5 blob descriptions | 700434–706005 | 65 pages;5571 bytes |
| CMO | 706005–706101 | Six little-endian(position,size) UInt64 pairs |
| GBO | 706101–706117 | One pair(619328,327) |
| Footer | 706117–706157 | A619655,B706005,C706101,globals1,columns6,major0,minor3,LANC |

Every interval is fully interpreted in L2 and reproduced by the linked assembler during VERIFY. The standard writer's64-byte alignment uses0x48, unlike the unpadded embedded fixtures. Payload bytes439882 plus padding179446 total619328; padding is never part of a descriptor size or page buffer size. (rust/lance-file/src/versions/v2_0/writer.rs:222-276; rust/lance-file/src/versions/v2_0/writer.rs:451-506; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:0-706157)

## Page partitions and buffer semantics

- id: each full batch has16 pages of61 rows plus one48-row page; final batch has one1-row page. Flat32 little-endian values, NoNull envelope. (rust/lance-encoding/src/array_encoding/logical/primitive.rs:479-549; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:619655-624182)
- name: each full batch has128 pages of8 rows; final page has1. Buffer0 stores UInt64 cumulative ends; buffer1 stores concatenated32-byte nonnull strings. Binary A=payload bytes+1 is193 on74 pages,225 on438 and33 on the last. Null means raw>=A; normalized end=raw-A for null, raw otherwise. Name payload Flat8 has explicit Compression scheme none. (rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:624182-672445)
- items: one offset page per batch, with2790,2793,2793,2793,3 children and A2791,2794,2794,2794,4 respectively. Store one UInt64 end per list, omitting leading0. Add A for null lists; this fixture's null lists span zero children, while every valid list spans3. First raw value equals A2791 and denotes a null: the proto comment's strict greater-than wording is not sufficient; >=A is required. (protos/encodings_v2_0.proto:82-155; rust/lance-encoding/src/array_encoding/logical/list.rs:1098-1243; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:109568-117760; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:672445-672864)
- items.item:64 pages of43 children plus38 for batch0;64*43+41 for each other full batch; final three children each get a separate1-value page. Nullable/SomeNull stores bitmap buffer0 then Int32 buffer1. Bitmap bits are LSB-first; all1324 unused tail bits are zero. Null child's physical Int32 backing is0. SomeNull remains on pages with no null values. Children are flattened separately from list parent rows; reconstruct through normalized list ends. (rust/lance-encoding/src/array_encoding/logical/primitive.rs:479-549; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:672864-693681; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:618688-619072)
- category: each full batch has14*69+58 rows; final page has1. Every page repeats dictionary[green,blue,red,null], raw ends[5,9,12,25], A13, and12-byte greenbluered payload. Keys are one byte with3 representing null. Normalization moves key nulls into a dictionary item. All keys themselves use NoNull; the final page retains unused null dictionary item. Unlike name payloads, dictionary payload Flat8 has no Compression message on wire. (rust/lance-encoding/src/data.rs:1703-1778; rust/lance-encoding/src/array_encoding/physical/dictionary.rs:250-344; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:693681-700434)
- blob: each full batch has16 pages of64 descriptors; final page has1. ColumnEncoding Blob wraps Values. PackedStruct has two NoNull Flat64 children zipped into little-endian(position,size) pairs. Each31-byte payload is independently padded with33 H bytes. Row position is batch blob base+64*local_row; bases0,154560,309184,463808,618368. Null(1,0) and empty(0,0) conventions exist in the encoder but are not exercised here. This is not four-field BlobV2. (rust/lance-encoding/src/array_encoding/logical/blob.rs:308-399; rust/lance-encoding/src/array_encoding/physical/packed_struct.rs:154-256; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:700434-706005)

Page splitting depends on source array memory size and logical length, not solely serialized payload size. max_page_bytes1024 therefore does not imply one1024-byte integer buffer per page; the single8192-byte list-offset buffer in each full batch uses a separate list-offset encoder path. Every priority is omitted/default0; it is not a global row start. (rust/lance-file/test_data/exact_versions/datagen.rs:102-131; rust/lance-encoding/src/array_encoding/logical/primitive.rs:479-549; rust/lance-encoding/src/array_encoding/logical/list.rs:1187-1379; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:619655-706005)

## Protobuf reconstruction

Each ColumnMetadata begins tag1 Encoding containing tag2 DirectEncoding/tag1 bytes; those bytes encode Any(type_url=/lance.encodings.ColumnEncoding,value=...). Values is0a00 for columns0..4; Blob(inner Values) is1a040a020a00 for column5. The wrappers consume43/47 bytes. Repeated Page tag2 contains packed absolute offsets tag1, packed unpadded sizes tag2, logical length tag3 and Encoding tag4 with Any type_url=/lance.encodings.ArrayEncoding. Priority5 and column buffers are absent. Array oneof tags are Flat1,Nullable2,List4,Binary6,Dictionary7,PackedStruct9. Flat carries bits1,Buffer2 and optional Compression3; Buffer index1 and type2 default0. Nullable NoNull1 carries values1; SomeNull2 carries validity1/values2. List carries offsets1,A2,num_items3; Binary indices1,bytes2,A3; Dictionary indices1,items2,count3; PackedStruct repeats children1 and carries packed Buffer2. The L2 JSON wire tree retains every nested byte interval and varint. (protos/file2.proto:138-216; protos/encodings_v2_0.proto:44-155; protos/encodings_v2_0.proto:174-188; protos/encodings_v2_0.proto:246-271; protos/encodings_v2_0.proto:308-358; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:619655-706005)

## Secondary development and validation boundary

Use the full map to classify byte mismatches as payload/null encoding, batching/page partition, alignment, schema, metadata or footer. Preserve the stable V2_0 contract using existing pinned historical bytes; changing current writer output is not a reason to regenerate the oracle. The existing compatibility harness checks exact byte equality for stable versions, footer identity and decoded batch equality. Encoding implementations are contextual reads only; do not treat this supplement as a complete change recipe for unreviewed codecs. [Offline parser](../../tools/analyze-standard-v20-fixture.mjs) and [independent assembler](../../tools/verify-standard-v20-reconstruction.mjs) validate artifact content, not Lance runtime behavior. (rust/lance-file/src/compatibility_tests.rs:232-295; rust/lance-file/src/compatibility_tests.rs:352-399; rust/lance-file/test_data/exact_versions/README.md:10-41)

VERIFY68 [independent reconstruction](../../verification/iteration-068-standard-reconstruction.json) PASS: every706,157 source/preserved byte and all4097 decoded row objects equal independently assembled expected output. No Lance runtime was executed.

The [standard V2_1 fixture](rust-lance-file-standard-v21-fixture.md) is now fully interpreted, including structural levels, FastLanes bits, all 73 mini-blocks and 575 byte regions; V2_2 is now fully interpreted as well; no lance-file inventory entry remains pending.
