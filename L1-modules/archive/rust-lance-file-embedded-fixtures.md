> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# Embedded V2_0 fixture byte contracts

This supplement fully interprets both embedded fixtures: **46,038 bytes, 318 contiguous authored regions, and 257 rows in each file**. All three standard V2 fixtures are now fully interpreted in their dedicated supplements; complete encoding implementations remain pending. [Crate](../rust-lance-file.md) · [fixture provenance/tests](../rust-lance-file-v20-compatibility.md) · [V1 artifact](rust-lance-file-binary-fixtures.md) · [format](../../L3-symbols/format-spec.md) · [scenarios](../../L4-crosscutting/scenarios.md). Byte coordinates are zero-based, half-open; no binary line counts are invented.

| Artifact | Size | SHA-256 | Full interpretation |
|---|---:|---|---|
| mini | 22,961 | `5e3fc99b01a4d2f5d16a2fb051dacb49b4a736428b1494715cd83633ad142a63` | [158 regions](../../L2-files/rust/lance-file/test_data/exact_versions/v2_0_mini.lance.md) |
| self-described | 23,077 | `6a3a9ce8ef56f058d1d105e7f4494ce35a9026479e2f76fc6f26c04b3201a406` | [160 regions](../../L2-files/rust/lance-file/test_data/exact_versions/v2_0_self_described.lance.md) |

Hashes identify the checked-in bytes and match the source README. The README pins commit `3a72f8a61e14613f517dded6816d4bfc77817c93`; a pin is not proof of a released package or execution of baseline regeneration. Exact bytes, all decoded rows and parsed protobuf fields are preserved inside the KB. [Mini report](../../analysis/iteration-067-v2_0_mini-fixture.json), [self-described report](../../analysis/iteration-067-v2_0_self_described-fixture.json), [shared-byte comparison](../../analysis/iteration-067-shared-bytes.json). (rust/lance-file/test_data/exact_versions/README.md:3-41; rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:0-22961; rust/lance-file/test_data/exact_versions/v2_0_self_described.lance@bytes:0-23077)

## Producer, consumer and scope

The generator projects fields 0 and 1 from its 4,097-row batch and slices rows 0..257. It uses exact V2_0, cache_bytes_per_column=1, max_page_bytes=1024, keep_original_array=true and buffer_alignment=64. The current harness has the same four encoding options and calls the explicit V2_0 strategy. The pinned historical generator uses its historical `version` option/API; it is not a current compilable API example. No generator was run. (rust/lance-file/test_data/exact_versions/datagen.rs:158-183; rust/lance-file/test_data/exact_versions/datagen.rs:219-225; rust/lance-file/src/compatibility_tests.rs:295-315)

The current public wrappers are `encode_self_described_batch(batch: &EncodedBatch) -> Result<Bytes>` and `encode_mini_batch(batch: &EncodedBatch) -> Result<Bytes>`. They call `writer::concat_lance_footer(batch, true/false)` respectively. The latter copies batch data, optionally serializes a FileDescriptor, serializes every column/page encoding in direct Any wrappers, appends tables, and emits `(2,0,LANC)`. Standard V2_0 file output uses `(0,3,LANC)`; both map to exact V2_0. These binaries add no callable symbols. (rust/lance-file/src/versions/v2_0/mod.rs:156-164; rust/lance-file/src/versions/v2_0/writer.rs:852-951; rust/lance-file/src/version.rs:200-262)

The dedicated compatibility test compares both writer outputs byte-for-byte against these fixtures, checks their embedded footer identities, reads the self-described file without a supplied schema, reads the mini file with the supplied schema, and decodes both with Array layout and no filter before asserting complete record-batch equality. Those assertions were inspected, **not executed**. This fixture does not cover list, dictionary or blob columns, malformed inputs, concurrency, cancellation, standard-file writer alignment or later structural encodings. (rust/lance-file/src/compatibility_tests.rs:401-449)

## Data and page boundaries

Schema: root `id` has field ID 0, Int32, nonnullable; root `name` has field ID 1, Utf8, nullable, metadata `lance-encoding:compression=none`. For row r in 0..257, id=r; name is null when r%7=0, otherwise the 32 ASCII bytes `value-NNNN-deterministic-fixture` using a four-digit decimal row number. There are 37 nulls and 220 strings. Every decoded row is preserved in the [mini values](../../evidence/binary/v2_0_mini-decoded-rows.json) and [self-described values](../../evidence/binary/v2_0_self_described-decoded-rows.json). (rust/lance-file/test_data/exact_versions/datagen.rs:37-42; rust/lance-file/test_data/exact_versions/datagen.rs:73-78; rust/lance-file/test_data/exact_versions/datagen.rs:219-225; rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:0-10124)

```text
Both files: identical data [0,10124)
|-- id [0,1028): 17 pages
|   |-- pages 0..15: 16 Int32 values / 64 bytes each
|   `-- page 16: id256 / 4 bytes
`-- name [1028,10124): 129 pages
    |-- pages 0..127: two rows each
    |   |-- UInt64 cumulative end offsets: 16 bytes
    |   `-- UTF-8 bytes: 32 or 64 bytes
    `-- page 128: one offset / 8 bytes and name256 / 32 bytes
```

The complete per-page byte positions, lengths and metadata intervals are in both L2 catalogs. Integer values occupy 1,028 bytes, name indices 2,056 bytes and name payloads 7,040 bytes. Buffers and pages abut; there are **zero padding bytes**. Embedded `write_page_to_data_buffer` simply extends a BytesMut for each page buffer and does not apply `buffer_alignment`. Alignment for external buffers is a different path. In particular, the first name indices start at 1,028 and the first name bytes at 1,044, neither 64-aligned. (rust/lance-encoding/src/encoder.rs:380-395; rust/lance-encoding/src/encoder.rs:435-460; rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:0-10124)

The current V2_0 primitive encoder splits a single queued array using `ceil(array.get_buffer_memory_size()/max_page_bytes)`, capped by row count, then `ceil(array.len()/num_parts)`. This is an allocated-buffer estimate, not a guarantee that page payloads reach 1,024 bytes. The fixture's observed partitions are 16-row integer and 2-row string pages; exact Arrow allocation sizes were not measured. Every page's `row_number` is explicitly zero in that encoder, so priority0 is not its logical row start. Readers must derive column order from page order and lengths. (rust/lance-encoding/src/array_encoding/logical/primitive.rs:479-549; rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:10124-22889)

## Encoding and null reconstruction

Integer pages encode `Nullable(NoNull(Flat32(page_buffer0)))`. There is no validity buffer or compression message. Name pages encode `Binary(indices=Nullable(NoNull(Flat64(page_buffer0))), bytes=Flat8(page_buffer1, compression="none"), null_adjustment=A)`. Buffer references use page scope0, omitted on the wire; index0 is also omitted while index1 is explicit. No bitpacking, dictionary, FSST or compressed payload occurs. Both column encodings are `ColumnEncoding.values` with an explicitly present empty message. (protos/encodings_v2_0.proto:44-80; protos/encodings_v2_0.proto:174-188; protos/encodings_v2_0.proto:246-250; protos/encodings_v2_0.proto:308-358; rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:10124-22889)

For each name page, A is total string bytes+1. Store one cumulative end offset per row, omit the leading zero, and add A to the end offset for a null row. The reader compares `raw >= A`, subtracts A for nulls and uses the normalized ends to bound the bytes. Page-local origin is zero, so a raw offset may decrease across a null boundary without corruption. All actual normalized ends are nondecreasing. The physical binary normalizer rejects a decreasing normalized end with a contextual invalid-input error. (rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107; rust/lance-encoding/src/array_encoding/physical/binary.rs:447-577)

| Page pattern | Raw indices | Normalized ends | A |
|---|---|---|---:|
| null, string | 33,32 | 0,32 | 33 |
| string, null | 32,65 | 32,32 | 33 |
| string, string | 32,64 | 32,64 | 65 |
| final single string | 32 | 32 | 33 |

These four patterns exhaust all 129 name pages. No page has two nulls because nulls occur every seven rows. Null identity is fully preserved here, unlike V1's equal-offset ambiguity. These artifacts contain no empty nonnull strings, so they do not themselves test the empty-string/null distinction even though the explicit marker supports it. (rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:1028-10124; rust/lance-file/test_data/exact_versions/datagen.rs:40-42)

## Metadata, tables and footer

Each column starts with 43 bytes describing its direct encoding. The nested path is `ColumnMetadata.tag1 -> Encoding.tag2 direct -> DirectEncoding.tag1 bytes -> Any {type_url(tag1), value(tag2)}`. The actual URLs are `/lance.encodings.ColumnEncoding` and `/lance.encodings.ArrayEncoding`; they do not have a type.googleapis.com prefix. Column values encode as payload hex `0a00`. Every subsequent outer tag2 is one Page, whose tag1 offsets and tag2 sizes are packed varints, tag3 is length, and tag4 is its direct Any encoding. Priority tag5 is absent/default0; no column-level buffer fields appear. (protos/file2.proto:138-216; rust/lance-file/src/versions/v2_0/writer.rs:875-925; rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:10124-22889)

The integer column metadata is 1,112 bytes: 43+2*62+15*63. Its first two page offsets fit one-byte varints; later offsets require two bytes. The name column metadata is 11,653 bytes: 43+129*90. All its offsets are two-byte varints and every page record has the same length, including the final one-row page. Both metadata blocks are byte-identical between fixtures, because buffer pointers address the shared data before the inserted descriptor. (rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:10124-22889; rust/lance-file/test_data/exact_versions/v2_0_self_described.lance@bytes:10224-22989)

| Region | Mini [start,end) | Self-described [start,end) |
|---|---|---|
| Data | 0,10124 | 0,10124 |
| FileDescriptor | absent | 10124,10224 |
| id metadata | 10124,11236 | 10224,11336 |
| name metadata | 11236,22889 | 11336,22989 |
| CMO table | 22889,22921 | 22989,23021 |
| GBO table | empty at22921 | 23021,23037 |
| Footer | 22921,22961 | 23037,23077 |

CMO entries are little-endian u64(position),u64(size), one per column in order. Self-described GBO has one identical-format entry (10124,100); mini has none. Footer is exactly 40 bytes: u64 A(column metadata start), u64 B(CMO start), u64 C(GBO start), u32 global count(0/1), u32 column count2, u16 major2, u16 minor0 and four bytes LANC. Mini's C points to the footer itself because its GBO table is empty. There is no checksum, extra length prefix, padding or trailing data. Self-described is 116 bytes larger: 100 descriptor bytes plus 16 GBO bytes; CMO positions/footer pointers change accordingly. (protos/file2.proto:40-93; rust/lance-file/src/versions/v2_0/writer.rs:927-951; rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:22889-22961; rust/lance-file/test_data/exact_versions/v2_0_self_described.lance@bytes:22989-23077)

## Self-described schema and mini's external dependency

The unframed 100-byte descriptor has Schema tag1, length95, followed by row-count tag2, value257 (`10 81 02`). Schema holds two Field tag1 records of payload lengths24 and67 and no schema metadata. Both roots encode parent_id=-1 as a ten-byte sign-extended int32 varint. Field id0, false nullability and type0 defaults are omitted; field id1 and nullable=true are explicit. The id logical type is `int32`; name is `string`, with the one compression metadata entry. Legacy Field.encoding values Plain1 and VarBinary2 are also serialized even though current page encodings are authoritative. The current conversion explicitly sets protobuf type=0, so a decoder must not infer LEAF=2 just from these scalar logical types. (protos/file.proto:9-22; protos/file.proto:123-223; rust/lance-file/src/datatypes.rs:65-91; rust/lance-file/test_data/exact_versions/v2_0_self_described.lance@bytes:10124-10224)

Mini has no descriptor and therefore needs the matching external schema to restore names, logical types, nullability and field metadata. Its pages still expose 257 rows per column through summed lengths. Absence of GBO/schema must not be confused with an empty dataset or missing data. The dedicated reader API accepts the supplied schema for mini; self-described obtains it from GBO0. (rust/lance-file/src/compatibility_tests.rs:421-448; rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:10124-22961)

## Development implications and evidence limits

Stable compatibility includes exact page partitioning, metadata field presence, Any URLs, buffer order, null markers, descriptor bytes and both footer aliases. A byte mismatch can arise from an allocation-dependent page partition before any logical values change. Use the complete L2 catalog to locate the field/page or framing component, then inspect the linked encoder or footer method. Do not regenerate the baseline from the changed implementation to erase a regression; follow the pinned provenance workflow and run its existing byte/read test in the documented environment when implementing a fix. This KB analysis did not execute it. (rust/lance-file/test_data/exact_versions/README.md:10-41; rust/lance-file/src/compatibility_tests.rs:401-449; rust/lance-encoding/src/array_encoding/logical/primitive.rs:511-549)

The [KB parser](../../tools/inspect-embedded-fixtures.mjs) and [semantic checks](../../tools/analyze-embedded-fixtures.mjs) decode every byte region and compare all rows against the generator formulas. The [independent assembler](../../tools/verify-embedded-reconstruction.mjs) constructs expected protobuf/data/table/footer bytes from the documented layout without importing the parser; its result is recorded separately during VERIFY. This supports artifact interpretation, not runtime qualification or complete understanding of the pending encoding crate.

VERIFY67 [independent reconstruction](../../verification/iteration-067-embedded-reconstruction.json) PASS: all46,038 source/preserved bytes and both257-row decoded sets match independently assembled expected output. This is a KB-side check; no Lance runtime was executed.
