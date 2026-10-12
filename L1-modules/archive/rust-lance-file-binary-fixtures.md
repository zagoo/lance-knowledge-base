> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# lance-file binary fixture contents

This supplement currently interprets **v1.lance only**, all 387,133 bytes and 4,097 rows. The two [embedded V2_0 fixtures](rust-lance-file-embedded-fixtures.md) are covered separately; the standard V2_2 fixture is now fully interpreted. [Crate](../rust-lance-file.md), [V1 codecs](../rust-lance-file-v1-codecs.md), [V1 writer](../rust-lance-file-v1-writer.md), [V1 reader](../rust-lance-file-v1-reader.md), [complete fixture byte map](../../L2-files/rust/lance-file/test_data/exact_versions/v1.lance.md), [format contracts](../../L3-symbols/format-spec.md), [test workflow](../../L4-crosscutting/build-and-test.md).

All binary coordinates use zero-based half-open intervals, written `path@bytes:start-end`; they are byte references, never invented source line numbers. The [inspection report](../../analysis/iteration-066-v1-fixture.json), [original bytes](../../evidence/binary/v1.lance), [all decoded rows](../../evidence/binary/v1-decoded-rows.json) and [offline inspection implementation](../../tools/inspect-v1-fixture.mjs) are preserved inside the KB. Inspection asserts every payload and offset against the generator's deterministic rules. The Lance runtime, repository tests and baseline generator have not been executed.

## Provenance and external schema

The checked-in README identifies baseline commit `3a72f8a61e14613f517dded6816d4bfc77817c93`; this is a Git pin, not independent evidence of a released package. The observed SHA-256 is `fa8b3d81b9d4fd4ade5a7c3d077ebf2155664e12b9335e26fac1c0d0774e916c`, matching the pinned README. Regeneration is a distinct baseline workflow and was not performed. (rust/lance-file/test_data/exact_versions/README.md:3-41; rust/lance-file/test_data/exact_versions/v1.lance@bytes:0-387133)

The generator constructs a schema from an Arrow batch, populates dictionary values and writes five slices of at most 1,024 rows. Its NoManifest provider returns `Ok(None)`, so the file contains no self-describing schema. It explicitly requests no statistics fields. Required schema information comes from the fixture generator or another external owner; inferring arbitrary unknown schemas from this binary is unsupported. (rust/lance-file/test_data/exact_versions/datagen.rs:25-36; rust/lance-file/test_data/exact_versions/datagen.rs:37-100; rust/lance-file/test_data/exact_versions/datagen.rs:133-157; rust/lance-file/test_data/exact_versions/datagen.rs:191-206)

| Field ID | Name | External Arrow type / nullable | Stored representation |
|---|---|---|---|
| 0 | id | Int32 / false | Int32 value array |
| 1 | name | Utf8 / true | UTF-8 bytes then absolute Int64 positions |
| 2 | items | List(item:Int32 nullable) / true | Relative Int32 positions, N+1 entries |
| 3 | items.item | Int32 / true | Child Int32 values, no validity |
| 4 | category | Dictionary(Int8,Utf8) / true | Int8 keys; separate dictionary after page table |
| 5 | blob | LargeBinary / true | Inline payload bytes then absolute Int64 positions |

The schema's `name` metadata requests `lance-encoding:compression=none`; category requests `lance-encoding:dict-values-compression=none`; blob marks `lance-encoding:blob=true`. These metadata strings are externally supplied and absent from this binary. In the observed V1 file all blob bytes are inline. The field IDs above are the generator's preorder assignment interpreted against all 30 matching table cells; the file stores neither field names nor data types. (rust/lance-file/test_data/exact_versions/datagen.rs:73-100; rust/lance-file/src/versions/v1/writer/mod.rs:427-460; rust/lance-file/test_data/exact_versions/v1.lance@bytes:386572-387052)

## Exact physical layout

```text
v1.lance: 387133 bytes
+-- [0,386572) five batches, each in field order
|   +-- id values
|   +-- name bytes; absolute Int64 positions
|   +-- list relative Int32 positions; child Int32 values
|   +-- category Int8 keys
|   +-- blob bytes; absolute Int64 positions
+-- [386572,387052) 6 fields x 5 batches x (position,length): 480 bytes
+-- [387052,387064) dictionary UTF-8: greenbluered
+-- [387064,387096) dictionary absolute Int64 positions: 32 bytes
+-- [387096,387100) UInt32 metadata length: 17
+-- [387100,387117) Metadata protobuf: 17 bytes
+-- [387117,387125) Int64 metadata pointer: 387096
+-- [387125,387127) Int16 major: 0
+-- [387127,387129) Int16 minor: 2
+-- [387129,387133) ASCII LANC
```

These intervals exhaust the file without padding, gaps, checksums, embedded manifest or statistics block. Integer buffers in this artifact are little-endian; the current plain/page-table writers copy Arrow native buffers, so the artifact observation is not a proof of portable output on every host endianness. Framing/footer writers explicitly use little-endian operations. (rust/lance-file/test_data/exact_versions/v1.lance@bytes:0-387133; rust/lance-file/src/versions/v1/encoding/plain.rs:91-117; rust/lance-file/src/versions/v1/page_table.rs:119-144; rust/lance-file/src/versions/v1/writer/mod.rs:627-651; rust/lance-io/src/traits.rs:83-106)

| Batch | Global row interval | Byte interval | Name nulls | Input list nulls | Input child nulls | Child values | Input category nulls |
|---|---|---|---|---|---|---|---|
| 0 | [0,1024) | [0,96588) | 147 | 94 | 186 | 2790 | 79 |
| 1 | [1024,2048) | [96588,193220) | 146 | 93 | 186 | 2793 | 79 |
| 2 | [2048,3072) | [193220,289852) | 146 | 93 | 187 | 2793 | 79 |
| 3 | [3072,4096) | [289852,386452) | 147 | 93 | 186 | 2793 | 79 |
| 4 | [4096,4097) | [386452,386572) | 0 | 0 | 0 | 3 | 0 |
| Total | 4097 rows | 386572 data bytes | 586 | 373 | 745 | 11172 | 316 |

Each count follows the generator's modulo rules and is checked against the actual offsets/value buffers; input null intent for lists, child integers and dictionary keys is external information that these V1 buffers lose. (rust/lance-file/test_data/exact_versions/datagen.rs:37-100; rust/lance-file/test_data/exact_versions/v1.lance@bytes:0-386572)

## Values, offsets and null semantics

For global row `r` in 0..4097, id is r. Name is null exactly when r%7=0, otherwise the 32-byte ASCII string `value-{r:04}-deterministic-fixture`. The name block concatenates non-null strings; N+1 absolute Int64 positions follow it, and the page pointer addresses those positions rather than the first string byte. The nullable binary reader identifies equal adjacent positions as null, which also means this representation cannot distinguish a nullable empty string from null. All observed non-null names have length32. (rust/lance-file/test_data/exact_versions/datagen.rs:37-42; rust/lance-file/src/versions/v1/encoding/binary.rs:49-89; rust/lance-file/src/versions/v1/encoding/binary.rs:165-178; rust/lance-file/src/versions/v1/encoding/binary.rs:193-233; rust/lance-file/test_data/exact_versions/v1.lance@bytes:4096-40360)

Items is originally null when r%11=0, otherwise `[r, r%5==0 ? null : 2*r, 3*r]`. The V1 file writes a list offset increment of0 or3 and child triples `[r, r%5==0 ? 0 : 2*r, 3*r]`. Parent and child validity are not stored. The fixture's expected V1 read therefore maps 373 parent nulls to empty lists and 745 child nulls to zero. This is a frozen compatibility behavior, not a feature to retrofit or silently correct in the legacy writer/reader. (rust/lance-file/test_data/exact_versions/datagen.rs:43-53; rust/lance-file/src/versions/v1/writer/mod.rs:491-537; rust/lance-file/src/versions/v1/encoding/plain.rs:91-117; rust/lance-file/src/compatibility_tests.rs:100-135; rust/lance-file/test_data/exact_versions/v1.lance@bytes:40360-55620; AGENTS.md:13-18)

Category is originally null when r%13=0; other rows select red/green/blue by r%3=0/1/2. First appearance orders dictionary values `[green,blue,red]`, hence corresponding keys2/0/1, and null key backing bytes are0. V1 persists those Int8 bytes without validity, so 316 input nulls read as green. The dictionary value block's positions are `[387052,387057,387061,387064]`; a schema that hydrates dictionary bytes needs offset387064 and length3. A reader may instead receive the already populated dictionary values, as the local compatibility test does. The file itself stores no schema field linking category to that block. (rust/lance-file/test_data/exact_versions/datagen.rs:54-68; rust/lance-file/src/versions/v1/encoding/dictionary.rs:36-57; rust/lance-file/src/versions/v1/encoding.rs:93-130; rust/lance-file/src/compatibility_tests.rs:115-135; rust/lance-file/src/compatibility_tests.rs:467-524; rust/lance-file/test_data/exact_versions/v1.lance@bytes:387052-387096)

Blob is the non-null 31-byte `blob-{r:04}-deterministic-payload`. Its N+1 positions are absolute Int64 addresses advancing31 each time. The nullable schema does not introduce nulls in this fixture, and the blob field's metadata does not transform V1 storage into a modern external blob description. (rust/lance-file/test_data/exact_versions/datagen.rs:69-100; rust/lance-file/src/versions/v1/writer/mod.rs:293-392; rust/lance-file/test_data/exact_versions/v1.lance@bytes:56644-96588)

## Table, metadata and footer interpretation

The page table is field-major: cell(field,batch) starts at `386572 + (field*5+batch)*16`. Each cell is two little-endian Int64 values, position then logical length. Id/category/child positions point directly to values; name/blob positions point to absolute-offset arrays; items points to relative positions and reports N+1, not N. The complete 30-cell matrix and every physical data interval are in L2 and the report. Dimensions must come from external schema and metadata; this block has no independent count header. (protos/file.proto:41-61; rust/lance-file/src/versions/v1/page_table.rs:36-144; rust/lance-file/test_data/exact_versions/v1.lance@bytes:386572-387052)

The metadata payload is exact hex `120b0080088010801880208120188ccc17`. Byte0 `12` means field2/wire2, byte1 `0b` means packed length11. Packed values are `00`, `8008`, `8010`, `8018`, `8020`, `8120`, decoding `[0,1024,2048,3072,4096,4097]`; byte13 `18` means field3/wire0 and `8ccc17` decodes386572. Field1 is absent, so manifest_position defaults0 (external); field5 statistics is absent. The framing prefix is `11000000`. Footer bytes are `18e8050000000000000002004c414e43`, selecting raw version(0,2), the V1 identity. (protos/file.proto:24-93; rust/lance-file/test_data/exact_versions/v1.lance@bytes:387096-387133)

## Evidence and extension limits

The existing `v1_writer_and_reader_are_wire_compatible` test writes five batches with no stats, compares every output byte to the pinned fixture, checks footer identity, reads the pinned bytes with a supplied populated schema and asserts five batches plus the normalized expected values. These are source assertions; they were not run. The KB-side parser establishes static byte meaning and agreement with fixture formulas, not runtime IO, scheduling, cancellation, Arrow implementation behavior or actual historical writer execution. (rust/lance-file/src/compatibility_tests.rs:467-524)

There are no callable symbols, configuration knobs, mutable state or unsafe blocks inside the binary itself. Its consumers are the include_bytes fixture switch and that compatibility test; its producer is the pinned generator. New format functionality belongs to current writers and version contracts. To investigate a changed V1 byte, first locate its L2 interval, decode the complete logical element/offset/cell, then trace the cited frozen encoder or framing path. Do not regenerate from the implementation under test as a substitute for independent baseline evidence. (rust/lance-file/src/compatibility_tests.rs:137-145; rust/lance-file/test_data/exact_versions/datagen.rs:133-157; rust/lance-file/test_data/exact_versions/datagen.rs:191-206; rust/lance-file/test_data/exact_versions/README.md:34-41; AGENTS.md:13-18)

The [standard V2_0 fixture](rust-lance-file-standard-v20-fixture.md) now has a complete byte/schema/page contract; V2_2 fixture is now fully interpreted.

The [standard V2_1 fixture](rust-lance-file-standard-v21-fixture.md) is now fully interpreted, including structural levels, FastLanes bits, all 73 mini-blocks and 575 byte regions; V2_2 is now fully interpreted as well; no lance-file inventory entry remains pending.
