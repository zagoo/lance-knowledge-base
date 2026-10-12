> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

> Refresh 2026-10-12, `011953c22097b67b699595adbe99e7f0155d83e4`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-12.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

# Frozen V1 writer, schema provider and finalization

Complete local scope: all 1,311 lines of writer/mod.rs, including seven active tests. The [statistics supplement](rust-lance-file-v1-statistics.md) now covers its complete algorithms, collector lifecycle and test oracles. These are frozen compatibility paths, not a base for new format capabilities. Tests were read, not run. (AGENTS.md:13-18)

[File crate](rust-lance-file.md) · [L2 writer](../L2-files/rust/lance-file/src/versions/v1/writer/mod.rs.md) · [V1 reader](rust-lance-file-v1-reader.md) · [Codecs](rust-lance-file-v1-codecs.md) · [Foundations](rust-lance-file-v1-foundation.md) · [Symbols](../L3-symbols/symbol-index.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Scenarios](../L4-crosscutting/scenarios.md)

## Ownership and configuration

FileWriter<M: ManifestProvider + Send + Sync> owns a Box<dyn Writer>, Schema, signed next batch ID, ordinary page table, cumulative metadata and optional statistics collector. Only object_writer is public; the provider is a PhantomData marker, not a runtime instance. The writer has no closed flag, custom Drop, abort guard or ownership-consuming finish. Replacing the public writer does not reset stored state. The ignored example is obsolete: actual calls are try_new, write with a slice, and async finish. (rust/lance-file/src/versions/v1/writer/mod.rs:66-87; rust/lance-file/src/versions/v1/writer/mod.rs:98-137; rust/lance-file/src/versions/v1/writer/mod.rs:255-290)

FileWriterOptions has one field: collect_stats_for_fields. None selects every schema ID; Some(empty) disables statistics; nonempty IDs are projected with include_all_children=true before supported fields become collector builders. Unknown IDs are not explicitly rejected here. The collector may return None even after a nonempty request. The fully analyzed support predicate accepts Boolean, signed/unsigned integers, Float32/64, Date32/64, UTF8/Binary with both offset widths and Decimal128; it excludes several types that collect_statistics can independently dispatch, including timestamps, duration, dictionary and fixed binary. Do not equate dispatcher support with automatic collection. (rust/lance-file/src/versions/v1/writer/mod.rs:89-137; rust/lance-core/src/datatypes/schema.rs:463-478; rust/lance-file/src/versions/v1/writer/statistics.rs:550-633)

try_new creates the target object before constructing local state. with_object_writer accepts an arbitrary writer position and supplied schema without validation or dictionary hydration. There is no local environment variable, version selector, compression setting or memory budget. Store creation/overwrite policy and backend cleanup are delegated and still require IO implementation analysis. (rust/lance-file/src/versions/v1/writer/mod.rs:99-137)

## Per-call state transitions

| Stage | Effects and failure boundary |
|---|---|
| Empty input slice | Returns Ok without validation, stats, IO, flush or counter changes |
| Validate every input batch | Convert Arrow schema; compare with stored schema ignoring declared nullability, metadata, field IDs and dictionary contents; recursively reject actual nulls in stored nonnullable fields |
| Collect stats | One row per supported selected field for the entire slice; mutates builders before writes |
| Write roots sequentially | Clone schema fields, find batch columns by name, recursively encode all arrays at current batch ID; earlier page entries and bytes survive later failure |
| Append logical length | Unchecked i32 row casts/sum and cumulative offset mutation |
| Flush | Polls in-flight writer requests before caller regains control; a failure leaves cumulative metadata advanced |
| Advance batch ID | Happens only after successful flush |

Evidence: rust/lance-file/src/versions/v1/writer/mod.rs:166-236. A single call with several batches creates one stored batch. A nonempty slice containing a zero-row batch still traverses encoding and advances the batch ID on success; it is not the empty-slice no-op. The zero-row UTF8 test explicitly reopens batch0. (rust/lance-file/src/versions/v1/writer/mod.rs:985-1014)

Schema comparison retains normal ordered name/logical-type/child matching, with the shared blob-child comparison exception inherited from Field. Recursive nullability checks zip field children with ArrayData child_data and inspect physical null counts without ancestor masks or list-child logical-span slicing. They do not independently validate counts; normal schema comparison occurs first. Dictionary equality is assumed by a comment to have been checked earlier, but this writer performs no comparison or unification. (rust/lance-core/src/datatypes/field.rs:83-103; rust/lance-core/src/datatypes/field.rs:423-440; rust/lance-core/src/datatypes/schema.rs:978-1028; rust/lance-file/src/versions/v1/writer/mod.rs:144-199)

Statistics traversal uses a LIFO stack: roots and struct children are visited in reverse schema order, structs are expanded without emitting their own node, and other nested types are skipped with descendants. It uses borrowed arrays, allocates per-field vectors and does no task spawning or ancestor-validity combination. Collector output ordering instead follows its BTreeMap by original field ID. (rust/lance-file/src/versions/v1/writer/mod.rs:654-692; rust/lance-file/src/versions/v1/writer/statistics.rs:612-670)

## Page grammar and recursive writes

```text
one nonempty write(slice)
+-- scalar/null root -> one (field ID, batch ID) PageInfo
+-- struct root
|   `-- each child recursively; no parent payload/validity page
+-- list root
|   +-- parent Int32 normalized offsets, logical row count + 1
|   `-- selected child spans recursively at same batch ID
`-- large-list root
    +-- parent Int64 normalized offsets, logical row count + 1
    `-- selected child spans recursively at same batch ID
```

Dispatch uses the first actual array DataType. Plain/VarBinary/Dictionary adapters assert the corresponding field.encoding rather than return a validation error. Arrays are processed sequentially; boxed async recursion does not spawn a task. Unsupported final match returns Schema error. The earlier fixed-stride guard already covers FixedSizeList/FixedSizeBinary, so the later explicit arm adds no extra support. The binary-like predicate includes view types; the concrete legacy BinaryEncoder rejects views as InvalidInput and does not normalize them. (rust/lance-file/src/versions/v1/writer/mod.rs:292-391; rust/lance-file/src/versions/v1/writer/mod.rs:406-459; rust/lance-arrow/src/lib.rs:99-137; rust/lance-file/src/versions/v1/encoding/binary.rs:91-105)

| Adapter | Stored position and length | Additional contract |
|---|---|---|
| Null | Current cursor; logical row count | No payload or encoding-tag check |
| Plain | Encoder return at value bytes; logical elements | Assert Plain and nonempty input; validity is delegated to frozen codec semantics |
| Binary | Offset table after payload; logical elements | Assert VarBinary; absolute i64 offsets rather than a separate validity bitmap |
| Dictionary | Key bytes; logical keys | Values come from stored schema at footer time, not batch arrays |
| Struct | No parent page | Assert child count, find children by name and recurse; no parent validity |
| List/LargeList | Parent offset bytes; rows+1 | Normalize selected child spans; recursively write children[0]; no parent validity |

Evidence: rust/lance-file/src/versions/v1/writer/mod.rs:393-586; rust/lance-file/src/versions/v1/encoding/binary.rs:48-87. PageInfo length is not encoded byte length. Counts and offsets use unchecked casts/sums; encoding errors may occur after bytes are written but before the current page entry is installed. (rust/lance-file/src/versions/v1/writer/mod.rs:393-459)

List writers retain each sliced values array from first through final offset, excluding outside tails but retaining storage inside null-list spans. They append initial zero and normalized offsets using usize arithmetic, then cast to i32/i64. Builder capacity is rows although rows+1 positions are appended. Position bytes/table entry precede child writes, so child failure leaves partial output. children[0] is unchecked, and no list validity is persisted. (rust/lance-file/src/versions/v1/writer/mod.rs:491-586)

## Footer, provider and shutdown

```text
ordinary data pages, written across calls
`-- finish()
    +-- ordinary dense PageTable, minimum schema field ID
    +-- optional statistics arrays and separate PageTable at batch 0
    +-- schema dictionary values; update stored offset/length metadata
    +-- M::store_schema -> optional schema/manifest position
    +-- u32 LE framed Metadata protobuf
    +-- i64 LE metadata position, i16 LE 0, i16 LE 2, "LANC"
    `-- Writer::shutdown -> authoritative size_bytes
```

The minimum schema field ID includes struct roots and is unwrapped; an empty schema panics. A nonempty schema with no page entries returns the page-table empty InvalidInput. Holes and parent fields are represented by the dense page-table contract; the writer does not add alignment padding. (rust/lance-file/src/versions/v1/writer/mod.rs:627-651; rust/lance-file/src/versions/v1/page_table.rs:94-145; rust/lance-io/src/traits.rs:83-106; rust/lance-file/src/format.rs:30-33)

Statistics finish mutates builders before writing any statistics bytes. A debug assertion compares stats rows to the next batch ID. Every root is written recursively under batch0 in a separate table; the field list named leaf_field_ids actually comes from all preorder schema IDs, including struct roots. Original data field IDs are encoded as statistics root names; newly converted statistics-schema IDs index statistics pages. None/zero-row collector output omits metadata; errors propagate. (rust/lance-file/src/versions/v1/writer/mod.rs:588-625; rust/lance-core/src/datatypes/schema.rs:623-627; rust/lance-file/src/versions/v1/writer/statistics.rs:635-670)

ManifestProvider is a public static async hook accepting &mut dyn Writer and &Schema, returning Result<Option<usize>>. The caller writes dictionaries first and trusts the returned position. Table ManifestDescribing creates a V1 Manifest with no fragments, then calls do_write_manifest directly with no indices/transaction, so dictionaries are not written a second time. The test-only NotSelfDescribing returns None and writes nothing. Metadata serialization maps None to zero; it is not an on-disk option-presence bit. (rust/lance-file/src/versions/v1/writer/mod.rs:35-64; rust/lance-file/src/versions/v1/writer/mod.rs:639-650; rust/lance-table/src/io/manifest.rs:177-230; rust/lance-table/src/io/manifest.rs:232-250; rust/lance-file/src/versions/v1/format/metadata.rs:34-75)

finish uses shutdown's authoritative size and the last cumulative row count, returning FileWriteSummary. It does not call tell afterward or retain other object identity fields. finish_with_metadata extends schema metadata first; both it and add_metadata overwrite duplicate keys. Failed/repeated finish is not locally guarded, and stats/dictionary/schema/footer side effects are not rolled back. No local abort or deletion follows cancellation; underlying Writer behavior remains a separate dependency. (rust/lance-file/src/versions/v1/writer/mod.rs:238-290; rust/lance-file/src/versions/v1/writer/mod.rs:588-651)

## Observed Dataset seam and limits

A contextual read of open_v1_writer shows path preparation followed by FileWriter<ManifestDescribing>::try_new with cloned schema/default statistics options. V1WriterAdapter delegates write/tell, and finish casts returned row count to u32 and constructs DataFile::new_legacy from path, writer schema, NonZero size and base ID. GenericWriter's default add_schema_metadata is a no-op for this adapter, distinct from the concrete writer's public add_metadata. This narrow trace does not establish full Dataset write scheduling, dispatch selection, compaction, commit or cleanup. (rust/lance/src/dataset/write.rs:2056-2096; rust/lance/src/dataset/write.rs:2317-2345)

## Exact production declarations

The table below retains every production type, field, function and private child-module declaration. Generic methods belong to impl<M: ManifestProvider + Send + Sync> FileWriter<M>. Bodies and contracts are fully annotated in L2; test declarations are also indexed in L3. (rust/lance-file/src/versions/v1/writer/mod.rs:98-692)

| Symbol | Visibility | Exact declaration | Evidence |
|---|---|---|---|
| `statistics` | private | `mod statistics;` | rust/lance-file/src/versions/v1/writer/mod.rs:4-4 |
| `ManifestProvider` | public | `pub trait ManifestProvider {` | rust/lance-file/src/versions/v1/writer/mod.rs:43-43 |
| `ManifestProvider::store_schema` | public | `async fn store_schema(object_writer: &mut dyn Writer, schema: &Schema)     -> Result<Option<usize>>;` | rust/lance-file/src/versions/v1/writer/mod.rs:50-51 |
| `FileWriter` | pub | `pub struct FileWriter<M: ManifestProvider + Send + Sync> {` | rust/lance-file/src/versions/v1/writer/mod.rs:79-79 |
| `FileWriter::object_writer` | pub | `pub object_writer: Box<dyn Writer>,` | rust/lance-file/src/versions/v1/writer/mod.rs:80-80 |
| `FileWriter::schema` | private | `schema: Schema,` | rust/lance-file/src/versions/v1/writer/mod.rs:81-81 |
| `FileWriter::batch_id` | private | `batch_id: i32,` | rust/lance-file/src/versions/v1/writer/mod.rs:82-82 |
| `FileWriter::page_table` | private | `page_table: PageTable,` | rust/lance-file/src/versions/v1/writer/mod.rs:83-83 |
| `FileWriter::metadata` | private | `metadata: Metadata,` | rust/lance-file/src/versions/v1/writer/mod.rs:84-84 |
| `FileWriter::stats_collector` | private | `stats_collector: Option<statistics::StatisticsCollector>,` | rust/lance-file/src/versions/v1/writer/mod.rs:85-85 |
| `FileWriter::manifest_provider` | private | `manifest_provider: PhantomData<M>,` | rust/lance-file/src/versions/v1/writer/mod.rs:86-86 |
| `FileWriterOptions` | pub | `pub struct FileWriterOptions {` | rust/lance-file/src/versions/v1/writer/mod.rs:90-90 |
| `FileWriterOptions::collect_stats_for_fields` | pub | `pub collect_stats_for_fields: Option<Vec<i32>>,` | rust/lance-file/src/versions/v1/writer/mod.rs:95-95 |
| `FileWriter::try_new` | pub | `pub async fn try_new(         object_store: &ObjectStore,         path: &Path,         schema: Schema,         options: &FileWriterOptions,     ) -> Result<Self> {` | rust/lance-file/src/versions/v1/writer/mod.rs:99-104 |
| `FileWriter::with_object_writer` | pub | `pub fn with_object_writer(         object_writer: Box<dyn Writer>,         schema: Schema,         options: &FileWriterOptions,     ) -> Result<Self> {` | rust/lance-file/src/versions/v1/writer/mod.rs:109-113 |
| `FileWriter::schema` | pub | `pub fn schema(&self) -> &Schema {` | rust/lance-file/src/versions/v1/writer/mod.rs:140-140 |
| `FileWriter::verify_field_nullability` | private | `fn verify_field_nullability(arr: &ArrayData, field: &Field) -> Result<()> {` | rust/lance-file/src/versions/v1/writer/mod.rs:144-144 |
| `FileWriter::verify_nullability_constraints` | private | `fn verify_nullability_constraints(&self, batch: &RecordBatch) -> Result<()> {` | rust/lance-file/src/versions/v1/writer/mod.rs:159-159 |
| `FileWriter::write` | pub | `pub async fn write(&mut self, batches: &[RecordBatch]) -> Result<()> {` | rust/lance-file/src/versions/v1/writer/mod.rs:170-170 |
| `FileWriter::add_metadata` | pub | `pub fn add_metadata(&mut self, key: &str, value: &str) {` | rust/lance-file/src/versions/v1/writer/mod.rs:239-239 |
| `FileWriter::finish_with_metadata` | pub | `pub async fn finish_with_metadata(         &mut self,         metadata: &HashMap<String, String>,     ) -> Result<FileWriteSummary> {` | rust/lance-file/src/versions/v1/writer/mod.rs:245-248 |
| `FileWriter::finish` | pub | `pub async fn finish(&mut self) -> Result<FileWriteSummary> {` | rust/lance-file/src/versions/v1/writer/mod.rs:255-255 |
| `FileWriter::len` | pub | `pub fn len(&self) -> usize {` | rust/lance-file/src/versions/v1/writer/mod.rs:274-274 |
| `FileWriter::tell` | pub | `pub async fn tell(&mut self) -> Result<usize> {` | rust/lance-file/src/versions/v1/writer/mod.rs:279-279 |
| `FileWriter::next_batch_id` | pub | `pub fn next_batch_id(&self) -> i32 {` | rust/lance-file/src/versions/v1/writer/mod.rs:284-284 |
| `FileWriter::is_empty` | pub | `pub fn is_empty(&self) -> bool {` | rust/lance-file/src/versions/v1/writer/mod.rs:288-288 |
| `FileWriter::write_array` | private | `async fn write_array(         object_writer: &mut dyn Writer,         field: &Field,         arrs: &[&ArrayRef],         batch_id: i32,         page_table: &mut PageTable,     ) -> Result<()> {` | rust/lance-file/src/versions/v1/writer/mod.rs:293-299 |
| `FileWriter::write_null_array` | private | `async fn write_null_array(         object_writer: &mut dyn Writer,         field: &Field,         arrs: &[&dyn Array],         batch_id: i32,         page_table: &mut PageTable,     ) -> Result<()> {` | rust/lance-file/src/versions/v1/writer/mod.rs:393-399 |
| `FileWriter::write_fixed_stride_array` | private | `async fn write_fixed_stride_array(         object_writer: &mut dyn Writer,         field: &Field,         arrs: &[&dyn Array],         batch_id: i32,         page_table: &mut PageTable,     ) -> Result<()> {` | rust/lance-file/src/versions/v1/writer/mod.rs:407-413 |
| `FileWriter::write_binary_array` | private | `async fn write_binary_array(         object_writer: &mut dyn Writer,         field: &Field,         arrs: &[&dyn Array],         batch_id: i32,         page_table: &mut PageTable,     ) -> Result<()> {` | rust/lance-file/src/versions/v1/writer/mod.rs:427-433 |
| `FileWriter::write_dictionary_arr` | private | `async fn write_dictionary_arr(         object_writer: &mut dyn Writer,         field: &Field,         arrs: &[&dyn Array],         key_type: &DataType,         batch_id: i32,         page_table: &mut PageTable,     ) -> Result<()> {` | rust/lance-file/src/versions/v1/writer/mod.rs:443-450 |
| `FileWriter::write_struct_array` | private | `async fn write_struct_array(         object_writer: &mut dyn Writer,         field: &Field,         arrays: &[&StructArray],         batch_id: i32,         page_table: &mut PageTable,     ) -> Result<()> {` | rust/lance-file/src/versions/v1/writer/mod.rs:463-469 |
| `FileWriter::write_list_array` | private | `async fn write_list_array(         object_writer: &mut dyn Writer,         field: &Field,         arrs: &[&dyn Array],         batch_id: i32,         page_table: &mut PageTable,     ) -> Result<()> {` | rust/lance-file/src/versions/v1/writer/mod.rs:491-497 |
| `FileWriter::write_large_list_array` | private | `async fn write_large_list_array(         object_writer: &mut dyn Writer,         field: &Field,         arrs: &[&dyn Array],         batch_id: i32,         page_table: &mut PageTable,     ) -> Result<()> {` | rust/lance-file/src/versions/v1/writer/mod.rs:539-545 |
| `FileWriter::write_statistics` | private | `async fn write_statistics(&mut self) -> Result<Option<StatisticsMetadata>> {` | rust/lance-file/src/versions/v1/writer/mod.rs:588-588 |
| `FileWriter::write_footer` | private | `async fn write_footer(&mut self) -> Result<()> {` | rust/lance-file/src/versions/v1/writer/mod.rs:627-627 |
| `fields_in_batches` | private | `fn fields_in_batches<'a>(     batches: &'a [RecordBatch],     schema: &'a Schema, ) -> impl Iterator<Item = (&'a Field, Vec<&'a ArrayRef>)> {` | rust/lance-file/src/versions/v1/writer/mod.rs:658-661 |

Historical test catalogs from this supplement are retained in the [archive](archive/rust-lance-file-v1-writer-historical-sections.md); they are outside current coverage.
