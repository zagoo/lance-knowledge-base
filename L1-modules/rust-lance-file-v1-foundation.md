> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

# Frozen V1 foundations: projection, dictionaries, metadata and page tables

Complete local scope: five files / 854 physical lines, including five tests. Concrete binary/plain/dictionary codecs are covered in the [codec supplement](rust-lance-file-v1-codecs.md); the [full V1 reader](rust-lance-file-v1-reader.md) is covered; the [V1 binary fixture](archive/rust-lance-file-binary-fixtures.md) is fully interpreted; standard V2_2 fixture is now fully interpreted. These are historical compatibility surfaces; new capabilities belong in current formats/write paths. Tests were read, not run. (AGENTS.md:7-18)

[Crate](rust-lance-file.md) · [Current composition](rust-lance-file-composition.md) · [V2_0 and compatibility](rust-lance-file-v20-compatibility.md) · [Orientation](../L0-orientation.md) · [Symbols](../L3-symbols/symbol-index.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Format](../L3-symbols/format-spec.md) · [Scenarios](../L4-crosscutting/scenarios.md)

## Responsibilities and physical identity

The facade publicly owns encoding,format,page_table,reader,writer modules and V1 physical projection helpers. Its documentation declares accepted footer(0,0..=2) and write identity(0,2); the already analyzed exact-version parser maps those identities. The format child forwards metadata only. These files do not select current encoder strategies, commit manifests, publish a Dataset version or implement backend durability. (rust/lance-file/src/versions/v1/mod.rs:1-24) (rust/lance-file/src/versions/v1/format/mod.rs:1-4) (rust/lance-file/src/version.rs:172-272)

~~~text
v1
|-- mod: preorder Field IDs and physical-column projection
|-- encoding: value-codec dispatch and dictionary write/hydration
|   |-- plain / binary / dictionary: concrete codecs covered separately
|-- format/metadata: cumulative batch offsets and protobuf conversion
|-- page_table: sparse map <-> dense field-major pair matrix
+-- reader / writer: full local lifecycle covered in supplements
`-- writer/statistics: full algorithms and test oracles covered in supplement
~~~

The tree follows the public module declarations and dependencies. (rust/lance-file/src/versions/v1/mod.rs:10-23) (rust/lance-file/src/versions/v1/encoding.rs:16-33)

## Projection and field mapping

Visit fields in preorder, emitting the parent and then children. Blob and packed-struct fields each occupy one slot and stop recursion, while ordinary struct/container parents also occupy slots even when they have no data page. data_file_columns returns original signed IDs paired with consecutive signed physical indices from0. Counter/count arithmetic is unchecked. (rust/lance-file/src/versions/v1/mod.rs:72-116)

The private BTreeMap casts IDs/indices to u32; repeated IDs retain the final column value. projection_from_field_ids clones the entire supplied schema into an Arc and appends only mapped fields, silently omitting missing mappings. It does not validate empty/repeated/out-of-bounds indices or remove unmatched schema fields. Column-name projection builds the full original mapping before delegating Schema::project, then selects original physical indices. (rust/lance-file/src/versions/v1/mod.rs:25-71) (rust/lance-file/src/versions/v1/mod.rs:93-116)

## Dictionary dispatch and mutation order

read_binary_array accepts exactly Utf8,Binary,LargeUtf8,LargeBinary, converts parameters first and dispatches to the corresponding BinaryDecoder; other types return InvalidInput. read_fixed_stride_array checks the local fixed-stride predicate, returns Schema on false, constructs PlainDecoder, then converts parameters and awaits get. Neither wrapper independently checks offsets or response sizes. (rust/lance-file/src/versions/v1/encoding.rs:35-90)

write_schema_dictionaries scans every ID from0 through max_field_id, skipping holes/nondictionaries. Missing dictionary metadata is IO; missing values is InvalidInput. The actual array type chooses numeric PlainEncoder or binary-like BinaryEncoder; unsupported values give Schema. Only successful encode updates offset/length. Earlier writes and mutations survive later errors; no transaction, shutdown or abort is provided. Cost includes sparse ID-span traversal and repeated schema lookup. (rust/lance-file/src/versions/v1/encoding.rs:92-132)

Hydration recursively processes nondictionary roots/children in order. For a dictionary it uses the schema value type, reads the entire stored region and replaces values, even when values was already Some. Binary values use nullable=true; only eight signed/unsigned integer types take the fixed-stride branch. It does not recurse below a dictionary node. async_recursion boxes recursion without explicit task spawning; successful earlier fields remain mutated on error/cancellation. (rust/lance-file/src/versions/v1/encoding.rs:134-192)

Write and read predicates are asymmetric. The write side asks is_numeric rather than the read side's explicit integer whitelist. The local is_binary_like also accepts Utf8View/BinaryView, which the four-type binary reader rejects. Concrete BinaryEncoder also rejects both view types; PlainEncoder writes fixed-width numeric buffers, while hydration retains its narrower integer whitelist. Complete codec contracts and test limits are now documented separately. (rust/lance-file/src/versions/v1/encoding/binary.rs:91-105; rust/lance-file/src/versions/v1/encoding/plain.rs:90-115) (rust/lance-file/src/versions/v1/encoding.rs:47-70) (rust/lance-file/src/versions/v1/encoding.rs:116-127) (rust/lance-file/src/versions/v1/encoding.rs:143-176) (rust/lance-arrow/src/lib.rs:99-142)

The table manifest writer and schema-hydration adapter call these helpers only for ConcreteFileVersion::V1. The complete [V1 writer](rust-lance-file-v1-writer.md) now establishes provider/finish/error ordering: data page table, statistics, dictionaries/provider schema, Metadata and magics, followed by shutdown. (rust/lance-table/src/io/manifest.rs:212-230; rust/lance-table/src/format/manifest.rs:656-668; rust/lance-file/src/versions/v1/writer/mod.rs:627-651)

## Metadata and logical row grouping

Metadata stores Vec<i32> cumulative batch offsets, usize page-table position, Option manifest position and optional statistics. Empty offsets report0batches/rows; otherwise batches=len-1 and rows=last cast to usize. push_batch_length seeds0 and appends an unchecked signed sum. Negative/zero lengths and malformed sentinel vectors are not rejected. get_offset can access the terminal sentinel; get_batch_length computes next-current with current default0, including the unusual negative-ID boundary. (rust/lance-file/src/versions/v1/format/metadata.rs:14-33) (rust/lance-file/src/versions/v1/format/metadata.rs:85-123)

Protobuf conversion clones offsets and statistics IDs, casts positions unchecked and flattens only statistics fields, dropping schema-level metadata. Missing manifest position encodes0, while decode always yields Some, including Some(0). Wire0 means externally stored manifest; the object converter does not normalize it back to None. Statistics schema decoding can fail; remaining shape/monotonicity/range validation is absent. (rust/lance-file/src/versions/v1/format/metadata.rs:34-78) (protos/file.proto:25-93)

group_indices_to_batches clones and sorts input despite its sorted-input precondition comment. It preserves duplicate indices but loses original order, scans batch ends, groups in ascending batch ID and subtracts start offsets. Out-of-file rows can form terminal batch num_batches; nonempty indices with no offsets panic. range_to_batches unwraps the last offset and checks only end<=length, then binary-searches start cast to i32 and forms clamped subranges. Empty/reversed/overflow/malformed-offset cases are not fully guarded. (rust/lance-file/src/versions/v1/format/metadata.rs:124-194)

These are helper contracts. The observed V1 reader returns an empty RecordBatch for Range::is_empty before calling range_to_batches, and take checks grouped batch_id against num_batches afterward. Do not turn a missing helper check into an assertion that every public reader call exposes it. The complete reader is now covered in the [reader supplement](rust-lance-file-v1-reader.md), including sorted grouping, selector differences, cache assumptions and constructor validation limits. (rust/lance-file/src/versions/v1/reader.rs:342-396)

## Page-table representation and resource behavior

PageInfo holds position and logical length as usize; observed fixed/binary/dictionary writers use the number of array elements, not encoded byte count. PageTable privately owns BTreeMap<i32,BTreeMap<i32,PageInfo>>. set accepts arbitrary signed keys and overwrites; get distinguishes absent None from explicit Some(0,0). (rust/lance-file/src/versions/v1/page_table.rs:16-35) (rust/lance-file/src/versions/v1/page_table.rs:147-160) (rust/lance-file/src/versions/v1/writer/mod.rs:393-459)

On disk, table dimensions are implicit: inclusive min..=max field IDs and num_batches from surrounding schema/metadata. Each field has consecutive batches, each containing position and length as signed64 values; missing/struct slots emit0,0. For valid dimensions, values count=2*(max-min+1)*num_batches and byte count=16*(max-min+1)*num_batches. No header or dimension vector is written here. (rust/lance-file/src/versions/v1/page_table.rs:36-92) (rust/lance-file/src/versions/v1/page_table.rs:94-145) (protos/file.proto:41-59)

load rejects max<min as Internal, then decodes the entire Int64 array and expands every cell into maps, including holes. Negative dimensions/values, arithmetic overflow and actual decoded shape are not independently validated; casts/downcasts/indexing rely on external invariants. Zero batches create nonempty outer maps with empty inner maps. (rust/lance-file/src/versions/v1/page_table.rs:53-92)

write rejects empty outer maps and supplied min above observed minimum as InvalidInput. After tell it derives batch count=max batch key+1, builds two values per cell, writes the Arrow values buffer directly and returns starting position. The builder initially reserves only one element per cell. A loaded zero-batch table panics at the max-batch unwrap; sparse large IDs can amplify memory and bytes. This method has no explicit endian conversion, alignment, framing, flush, shutdown, abort or cancellation cleanup. It does not establish atomic persistence. (rust/lance-file/src/versions/v1/page_table.rs:103-145)

## Tests, dependencies and extension boundary

Two metadata tests assert one index-group example and four valid range splits. Three page-table tests assert set/get, missing-cell zeros after write/read and three error variants/messages. The roundtrip test starts expected from actual.clone and overwrites fourteen holes; six populated values lack independent expectations. No local tests cover dictionary dispatch, projection edge cases, metadata object presence roundtrip, malformed offsets, negative dimensions, zero-batch rewrite or partial IO. (rust/lance-file/src/versions/v1/format/metadata.rs:209-255) (rust/lance-file/src/versions/v1/page_table.rs:162-287) (rust/lance-file/src/versions/v1/encoding.rs:186-192) (rust/lance-file/src/versions/v1/mod.rs:102-116)

Dependencies are core Schema/Field/error/DeepSizeOf, file protobuf/schema adapters, Arrow arrays/builders/type predicates, IO Reader/Writer/ProtoStruct/ReadBatchParams, Tokio write extension and async-recursion. No local feature flag, environment variable or global mutable cache is declared. Reader/Writer/ProtoStruct are existing boundaries; these five files introduce no new extensible trait. Preserve historical behavior under the repository's frozen legacy policy, and use released historical fixtures for any explicitly required legacy repair. (rust/lance-file/src/versions/v1/encoding.rs:9-33) (rust/lance-file/src/versions/v1/format/metadata.rs:4-12) (rust/lance-file/src/versions/v1/page_table.rs:4-14) (AGENTS.md:13-18)

## Exact production declarations

All non-test declarations, including public fields, trait-associated types and private helpers, are retained here. Full literal implementations and contiguous annotations live in each linked L2 document.

| Qualified suffix within lance_file::versions::v1 | Visibility / kind | Exact declaration | Evidence |
|---|---|---|---|
| `encoding::binary` | pub / module | `pub mod binary;` | [rust/lance-file/src/versions/v1/encoding.rs:16-16](../L2-files/rust/lance-file/src/versions/v1/encoding.rs.md) |
| `encoding::dictionary` | pub / module | `pub mod dictionary;` | [rust/lance-file/src/versions/v1/encoding.rs:17-17](../L2-files/rust/lance-file/src/versions/v1/encoding.rs.md) |
| `encoding::plain` | pub / module | `pub mod plain;` | [rust/lance-file/src/versions/v1/encoding.rs:18-18](../L2-files/rust/lance-file/src/versions/v1/encoding.rs.md) |
| `encoding::read_binary_array` | pub / async function | `pub async fn read_binary_array(     reader: &dyn Reader,     data_type: &DataType,     nullable: bool,     position: usize,     length: usize,     params: impl Into<ReadBatchParams>, ) -> Result<ArrayRef> {` | [rust/lance-file/src/versions/v1/encoding.rs:36-43](../L2-files/rust/lance-file/src/versions/v1/encoding.rs.md) |
| `encoding::read_fixed_stride_array` | pub / async function | `pub async fn read_fixed_stride_array(     reader: &dyn Reader,     data_type: &DataType,     position: usize,     length: usize,     params: impl Into<ReadBatchParams>, ) -> Result<ArrayRef> {` | [rust/lance-file/src/versions/v1/encoding.rs:75-81](../L2-files/rust/lance-file/src/versions/v1/encoding.rs.md) |
| `encoding::write_schema_dictionaries` | pub / async function | `pub async fn write_schema_dictionaries(writer: &mut dyn Writer, schema: &mut Schema) -> Result<()> {` | [rust/lance-file/src/versions/v1/encoding.rs:93-93](../L2-files/rust/lance-file/src/versions/v1/encoding.rs.md) |
| `encoding::populate_field_dictionary` | private / async function | `async fn populate_field_dictionary(field: &mut Field, reader: &dyn Reader) -> Result<()> {` | [rust/lance-file/src/versions/v1/encoding.rs:135-135](../L2-files/rust/lance-file/src/versions/v1/encoding.rs.md) |
| `encoding::populate_schema_dictionaries` | pub / async function | `pub async fn populate_schema_dictionaries(schema: &mut Schema, reader: &dyn Reader) -> Result<()> {` | [rust/lance-file/src/versions/v1/encoding.rs:187-187](../L2-files/rust/lance-file/src/versions/v1/encoding.rs.md) |
| `format::metadata::Metadata` | pub / struct | `pub struct Metadata {` | [rust/lance-file/src/versions/v1/format/metadata.rs:16-16](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::Metadata::batch_offsets` | pub / field | `pub batch_offsets: Vec<i32>,` | [rust/lance-file/src/versions/v1/format/metadata.rs:18-18](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::Metadata::page_table_position` | pub / field | `pub page_table_position: usize,` | [rust/lance-file/src/versions/v1/format/metadata.rs:21-21](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::Metadata::manifest_position` | pub / field | `pub manifest_position: Option<usize>,` | [rust/lance-file/src/versions/v1/format/metadata.rs:24-24](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::Metadata::stats_metadata` | pub / field | `pub stats_metadata: Option<StatisticsMetadata>,` | [rust/lance-file/src/versions/v1/format/metadata.rs:27-27](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::<Metadata as ProtoStruct>::Proto` | trait implementation / associated type | `type Proto = pb::Metadata;` | [rust/lance-file/src/versions/v1/format/metadata.rs:31-31](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::<pb::Metadata as From<&Metadata>>::from` | trait implementation / function | `fn from(m: &Metadata) -> Self {` | [rust/lance-file/src/versions/v1/format/metadata.rs:35-35](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::<Metadata as TryFrom<pb::Metadata>>::Error` | trait implementation / associated type | `type Error = Error;` | [rust/lance-file/src/versions/v1/format/metadata.rs:57-57](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::<Metadata as TryFrom<pb::Metadata>>::try_from` | trait implementation / function | `fn try_from(m: pb::Metadata) -> Result<Self> {` | [rust/lance-file/src/versions/v1/format/metadata.rs:58-58](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::BatchOffsets` | pub / struct | `pub struct BatchOffsets {` | [rust/lance-file/src/versions/v1/format/metadata.rs:80-80](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::BatchOffsets::batch_id` | pub / field | `pub batch_id: i32,` | [rust/lance-file/src/versions/v1/format/metadata.rs:81-81](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::BatchOffsets::offsets` | pub / field | `pub offsets: Vec<u32>,` | [rust/lance-file/src/versions/v1/format/metadata.rs:82-82](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::Metadata::num_batches` | pub / function | `pub fn num_batches(&self) -> usize {` | [rust/lance-file/src/versions/v1/format/metadata.rs:87-87](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::Metadata::len` | pub / function | `pub fn len(&self) -> usize {` | [rust/lance-file/src/versions/v1/format/metadata.rs:96-96](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::Metadata::is_empty` | pub / function | `pub fn is_empty(&self) -> bool {` | [rust/lance-file/src/versions/v1/format/metadata.rs:100-100](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::Metadata::push_batch_length` | pub / function | `pub fn push_batch_length(&mut self, batch_len: i32) {` | [rust/lance-file/src/versions/v1/format/metadata.rs:105-105](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::Metadata::get_offset` | pub / function | `pub fn get_offset(&self, batch_id: i32) -> Option<i32> {` | [rust/lance-file/src/versions/v1/format/metadata.rs:114-114](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::Metadata::get_batch_length` | pub / function | `pub fn get_batch_length(&self, batch_id: i32) -> Option<i32> {` | [rust/lance-file/src/versions/v1/format/metadata.rs:119-119](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::Metadata::group_indices_to_batches` | pub / function | `pub fn group_indices_to_batches(&self, indices: &[u32]) -> Vec<BatchOffsets> {` | [rust/lance-file/src/versions/v1/format/metadata.rs:128-128](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::Metadata::range_to_batches` | pub / function | `pub fn range_to_batches(&self, range: Range<usize>) -> Result<Vec<(i32, Range<usize>)>> {` | [rust/lance-file/src/versions/v1/format/metadata.rs:169-169](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::StatisticsMetadata` | pub / struct | `pub struct StatisticsMetadata {` | [rust/lance-file/src/versions/v1/format/metadata.rs:199-199](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::StatisticsMetadata::schema` | pub / field | `pub schema: Schema,` | [rust/lance-file/src/versions/v1/format/metadata.rs:204-204](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::StatisticsMetadata::leaf_field_ids` | pub / field | `pub leaf_field_ids: Vec<i32>,` | [rust/lance-file/src/versions/v1/format/metadata.rs:205-205](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata::StatisticsMetadata::page_table_position` | pub / field | `pub page_table_position: usize,` | [rust/lance-file/src/versions/v1/format/metadata.rs:206-206](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) |
| `format::metadata` | pub / module | `pub mod metadata;` | [rust/lance-file/src/versions/v1/format/mod.rs:4-4](../L2-files/rust/lance-file/src/versions/v1/format/mod.rs.md) |
| `encoding` | pub / module | `pub mod encoding;` | [rust/lance-file/src/versions/v1/mod.rs:10-10](../L2-files/rust/lance-file/src/versions/v1/mod.rs.md) |
| `format` | pub / module | `pub mod format;` | [rust/lance-file/src/versions/v1/mod.rs:11-11](../L2-files/rust/lance-file/src/versions/v1/mod.rs.md) |
| `page_table` | pub / module | `pub mod page_table;` | [rust/lance-file/src/versions/v1/mod.rs:12-12](../L2-files/rust/lance-file/src/versions/v1/mod.rs.md) |
| `reader` | pub / module | `pub mod reader;` | [rust/lance-file/src/versions/v1/mod.rs:13-13](../L2-files/rust/lance-file/src/versions/v1/mod.rs.md) |
| `writer` | pub / module | `pub mod writer;` | [rust/lance-file/src/versions/v1/mod.rs:14-14](../L2-files/rust/lance-file/src/versions/v1/mod.rs.md) |
| `append_field_ids` | private / function | `fn append_field_ids(     fields: &[Field],     field_id_to_column_index: &BTreeMap<u32, u32>,     column_indices: &mut Vec<u32>, ) {` | [rust/lance-file/src/versions/v1/mod.rs:25-29](../L2-files/rust/lance-file/src/versions/v1/mod.rs.md) |
| `projection_from_field_ids` | pub / function | `pub fn projection_from_field_ids(     schema: &Schema,     field_id_to_column_index: &BTreeMap<u32, u32>, ) -> ReaderProjection {` | [rust/lance-file/src/versions/v1/mod.rs:40-43](../L2-files/rust/lance-file/src/versions/v1/mod.rs.md) |
| `projection_from_whole_schema` | pub / function | `pub fn projection_from_whole_schema(schema: &Schema) -> ReaderProjection {` | [rust/lance-file/src/versions/v1/mod.rs:56-56](../L2-files/rust/lance-file/src/versions/v1/mod.rs.md) |
| `projection_from_column_names` | pub / function | `pub fn projection_from_column_names(     schema: &Schema,     column_names: &[&str], ) -> Result<ReaderProjection> {` | [rust/lance-file/src/versions/v1/mod.rs:60-63](../L2-files/rust/lance-file/src/versions/v1/mod.rs.md) |
| `physical_column_count` | pub / function | `pub fn physical_column_count(field: &Field) -> usize {` | [rust/lance-file/src/versions/v1/mod.rs:73-73](../L2-files/rust/lance-file/src/versions/v1/mod.rs.md) |
| `data_file_columns` | pub / function | `pub fn data_file_columns(schema: &Schema) -> (Vec<i32>, Vec<i32>) {` | [rust/lance-file/src/versions/v1/mod.rs:86-86](../L2-files/rust/lance-file/src/versions/v1/mod.rs.md) |
| `field_id_to_column_index` | private / function | `fn field_id_to_column_index(schema: &Schema) -> BTreeMap<u32, u32> {` | [rust/lance-file/src/versions/v1/mod.rs:93-93](../L2-files/rust/lance-file/src/versions/v1/mod.rs.md) |
| `append_physical_fields` | private / function | `fn append_physical_fields(     fields: &[Field],     field_ids: &mut Vec<i32>,     column_indices: &mut Vec<i32>,     next_column: &mut i32, ) {` | [rust/lance-file/src/versions/v1/mod.rs:102-107](../L2-files/rust/lance-file/src/versions/v1/mod.rs.md) |
| `page_table::PageInfo` | pub / struct | `pub struct PageInfo {` | [rust/lance-file/src/versions/v1/page_table.rs:17-17](../L2-files/rust/lance-file/src/versions/v1/page_table.rs.md) |
| `page_table::PageInfo::position` | pub / field | `pub position: usize,` | [rust/lance-file/src/versions/v1/page_table.rs:18-18](../L2-files/rust/lance-file/src/versions/v1/page_table.rs.md) |
| `page_table::PageInfo::length` | pub / field | `pub length: usize,` | [rust/lance-file/src/versions/v1/page_table.rs:19-19](../L2-files/rust/lance-file/src/versions/v1/page_table.rs.md) |
| `page_table::PageInfo::new` | pub / function | `pub fn new(position: usize, length: usize) -> Self {` | [rust/lance-file/src/versions/v1/page_table.rs:23-23](../L2-files/rust/lance-file/src/versions/v1/page_table.rs.md) |
| `page_table::PageTable` | pub / struct | `pub struct PageTable {` | [rust/lance-file/src/versions/v1/page_table.rs:31-31](../L2-files/rust/lance-file/src/versions/v1/page_table.rs.md) |
| `page_table::PageTable::pages` | private / field | `pages: BTreeMap<i32, BTreeMap<i32, PageInfo>>,` | [rust/lance-file/src/versions/v1/page_table.rs:33-33](../L2-files/rust/lance-file/src/versions/v1/page_table.rs.md) |
| `page_table::PageTable::load` | pub / async function | `pub async fn load(         reader: &dyn Reader,         position: usize,         min_field_id: i32,         max_field_id: i32,         num_batches: i32,     ) -> Result<Self> {` | [rust/lance-file/src/versions/v1/page_table.rs:53-59](../L2-files/rust/lance-file/src/versions/v1/page_table.rs.md) |
| `page_table::PageTable::write` | pub / async function | `pub async fn write(&self, writer: &mut dyn Writer, min_field_id: i32) -> Result<usize> {` | [rust/lance-file/src/versions/v1/page_table.rs:103-103](../L2-files/rust/lance-file/src/versions/v1/page_table.rs.md) |
| `page_table::PageTable::set` | pub / function | `pub fn set(&mut self, field_id: i32, batch: i32, page_info: PageInfo) {` | [rust/lance-file/src/versions/v1/page_table.rs:148-148](../L2-files/rust/lance-file/src/versions/v1/page_table.rs.md) |
| `page_table::PageTable::get` | pub / function | `pub fn get(&self, field_id: i32, batch: i32) -> Option<&PageInfo> {` | [rust/lance-file/src/versions/v1/page_table.rs:155-155](../L2-files/rust/lance-file/src/versions/v1/page_table.rs.md) |

The [standard V2_0 fixture](archive/rust-lance-file-standard-v20-fixture.md) now has a complete byte/schema/page contract; V2_2 fixture is now fully interpreted.

The [standard V2_1 fixture](archive/rust-lance-file-standard-v21-fixture.md) is now fully interpreted, including structural levels, FastLanes bits, all 73 mini-blocks and 575 byte regions; V2_2 is now fully interpreted as well; no lance-file inventory entry remains pending.
