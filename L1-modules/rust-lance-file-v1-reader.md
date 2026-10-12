> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

# Frozen V1 file reader

Complete local scope: all 1,562 lines of reader.rs, including 12 active tests and four helpers. Source tests were read, not run. Backend scheduling and complete Dataset lifecycle remain pending. Preserve this historical compatibility surface; new features belong in current-format paths. (AGENTS.md:13-18)

[Crate](rust-lance-file.md) · [V1 foundations](rust-lance-file-v1-foundation.md) · [Concrete codecs](rust-lance-file-v1-codecs.md) · [L2](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) · [Orientation](../L0-orientation.md) · [Symbols](../L3-symbols/symbol-index.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Scenarios](../L4-crosscutting/scenarios.md)

## Ownership and opening

FileReader shares its Reader, Metadata, ordinary PageTable and optional statistics PageTable through Arcs, while owning the supplied Schema. Clone retains shared underlying dictionary arrays through Schema's Clone behavior. object_reader is public and can be replaced without refreshing stored metadata. fragment_id is retained for Debug; this file does not generate row IDs. There is no custom Drop or shutdown protocol. (rust/lance-file/src/versions/v1/reader.rs:41-66)

~~~text
try_new(store, path, supplied_schema)
`-- try_new_with_fragment_id(fragment=0, min=0, max=schema.max_id, cache=None)
    |-- ObjectStore.open
    |-- read_metadata
    `-- try_new_from_reader(metadata=Some)
        |-- ordinary PageTable load/cache using supplied path and bounds
        `-- statistics PageTable load/cache using Reader.path/stats
            `-- read_metadata again unless cache serves it
~~~

The two table futures are polled concurrently with try_join. Supplied metadata is trusted for ordinary-table loading; the statistics loader independently obtains metadata from the reader. Without a cache, ordinary construction reads metadata twice. The separate path, reader path, metadata, schema and field bounds are not reconciled. An error returns before construction; no rollback or explicit abort guard is installed. (rust/lance-file/src/versions/v1/reader.rs:139-208; rust/lance-file/src/versions/v1/reader.rs:239-294)

Every constructor here requires Schema. It neither discovers schema nor hydrates dictionary values, despite stale documentation about an optional manifest. Self-describing opening is a separate table-layer trait: it reads Metadata, requires manifest_position, reads Manifest, populates schema dictionaries, then calls try_new_from_reader. Dataset fragment opening supplies its schema and file field bounds; the full Dataset wrapper remains pending. (rust/lance-file/src/versions/v1/reader.rs:126-163; rust/lance-table/src/format/manifest.rs:1190-1246; rust/lance/src/dataset/fragment.rs:1374-1401)

## Cache and metadata contract

The private typed string key has stable schema `lance.file.previous.string-key`, version 1, and writes one string. Stable value IDs are `lance.file.previous.Metadata`, `lance.file.previous.PageTable` and `lance.file.previous.OptionalPageTable`; compiler type names are diagnostic only. The key contains no explicit schema, field bounds, fragment ID, object-store identity, ETag or file version. The supplied LanceCache may add a namespace; this local adapter adds no invalidation or persistent codec. Cached statistics absence is an Option value. (rust/lance-file/src/versions/v1/reader.rs:68-123; rust/lance-file/src/versions/v1/reader.rs:181-198; rust/lance-file/src/versions/v1/reader.rs:239-288)

A cache miss reads the last min(file_size, block_size) bytes, extracts the eight-byte metadata position at footer[-16..-8], and either fetches the earlier framed struct or decodes its tail slice. That helper checks at least 16 tail bytes but does not check magic/version. Tail-position arithmetic and in-buffer framing do not locally guard malformed offsets/lengths; they can panic before decoding returns an error. Do not infer current-reader footer validation from this V1 path. (rust/lance-file/src/versions/v1/reader.rs:210-234; rust/lance-io/src/utils.rs:221-231; rust/lance-io/src/utils.rs:248-263)

Statistics opening loads one batch covering field IDs 0 through max(leaf_field_ids), panicking on an empty leaf-ID list. page_stats_schema matches requested data IDs against parsed statistics root names, then projects their IDs and immediate children. It retains schema order and can return Some(empty). read_page_stats returns None for absent table or empty projection; otherwise reads batch 0. A disagreement between caller metadata and the independently loaded statistics table can reach an unwrap. (rust/lance-file/src/versions/v1/reader.rs:239-267; rust/lance-file/src/versions/v1/reader.rs:398-445)

## Read APIs and scheduling

The method and free read_batch use the explicit per-call schema, rather than the stored reader schema promised by the method comment. Empty projection returns InvalidInput; the free-function comment about a with_row_id flag and panic is obsolete. No upfront subset/type validation occurs. Root fields are read with ordered buffered(reader.io_parallelism), and RecordBatch construction performs the final assembled-array check. (rust/lance-file/src/versions/v1/reader.rs:324-335; rust/lance-file/src/versions/v1/reader.rs:485-507)

read_range immediately accepts any empty/reversed range as an empty batch, even beyond the end. Otherwise metadata splits across batches; reads are ordered and all results are retained. A single result is cloned; multiple results are concatenated in spawn_blocking. take first uses metadata grouping, which copies and sorts input, preserving duplicates but losing original order. It checks grouped batch IDs afterward, and its secondary offset check compares against whole-file length rather than batch length. Both APIs materialize the complete result; no local abort-on-drop mechanism is provided for blocking concat. (rust/lance-file/src/versions/v1/reader.rs:342-396; rust/lance-file/src/versions/v1/format/metadata.rs:128-194)

batches_stream lazily filters ascending batch IDs and requests complete batches with fixed outer concurrency 2. It owns reader/projection through Arcs and advertises the supplied Arrow schema. Inner field reads retain their own Reader parallelism. This function does not spawn a Tokio task; a separately inspected Dataset ranges_to_tasks wrapper does spawn per-range tasks. Do not merge their cancellation or scheduling contracts. (rust/lance-file/src/versions/v1/reader.rs:448-483; rust/lance/src/dataset/fragment.rs:158-186)

## Recursive reconstruction and edge cases

read_array dispatches by reconstructed DataType, not field.encoding: fixed stride first, then Null, the four byte-array types, Struct, Dictionary and the two variable-list widths. Unsupported types reach unimplemented. Every FSL enters fixed-stride dispatch regardless of its child; Interval has a width helper but is absent from that predicate. get_page_info reports missing field/batch entries as InvalidInput. (rust/lance-file/src/versions/v1/reader.rs:509-576; rust/lance-arrow/src/lib.rs:111-181)

| Type/path | Local reconstruction | Relevant boundary |
|---|---|---|
| Fixed stride | Page position/length and selector go to plain codec | No field-nullability bitmap passed |
| Binary/string | Same, plus field.nullable | Equal offsets become null only when nullable |
| Dictionary | Plain keys plus cloned loaded values Arc | Missing dictionary/values unwraps |
| Struct | Sequential recursive child reads | No parent page/validity restored |
| Null | Synthesize count, no payload IO | End/max checks differ from plain; reversed range can underflow; Ranges panics |
| List/LargeList | Read offsets, read child values, normalize and build | Parent validity absent; reconstructed child is item/nullable=true |

Evidence: rust/lance-file/src/versions/v1/reader.rs:559-808; rust/lance-arrow/src/lib.rs:202-229.

List range offsets include the terminal endpoint. Direct empty Indices accesses first/last and panics; public empty FileReader.take avoids per-column reads because grouping yields no groups. List Indices reads the whole first-to-last offset span, then sequentially reads each selected child range and concatenates; duplicates repeat those reads. Its offset lookup uses reader.page_table even when the function received another table, while child recursion uses that argument. Null selector validity is ignored on list and Null paths. Sortedness, arithmetic, child existence and offset coherence are caller/file assumptions. (rust/lance-file/src/versions/v1/reader.rs:370-395; rust/lance-file/src/versions/v1/reader.rs:578-623; rust/lance-file/src/versions/v1/reader.rs:689-807)

The list constructor chooses a child field named item with nullable=true from actual child data type. It does not preserve arbitrary child metadata/name/nullability or parent nullness. Struct reconstruction similarly supplies no parent validity. These are frozen representation and reconstruction limits, not promises made by current-format readers. (rust/lance-file/src/versions/v1/reader.rs:671-686; rust/lance-file/src/versions/v1/reader.rs:724-738; rust/lance-file/src/versions/v1/reader.rs:795-807; rust/lance-arrow/src/lib.rs:202-229)

## Tests, dependencies and extension boundary

Twelve active tests pin stable cache discriminator strings; seven-row multi-batch numeric/string/dictionary take; nullable empty-string conversion; combined-input struct/list roundtrip; one-row struct/list slice; Null lengths and weak is_err boundaries; List/LargeList take; sliced list equality plus file size<1000; one-batch numeric range; even-batch stream order; Boolean take with 256-byte blocks; and a narrow file opened under a wider schema with explicit field bounds. They do not prove malformed-file safety, cache invalidation, cancellation, parent-null preservation, arbitrary selectors or full multi-fragment behavior. (rust/lance-file/src/versions/v1/reader.rs:827-1562)

The Boolean test is active reader-level coverage: 5,000 modulo-5 bits, indices [2,4,5,8,4555], expected [false,false,true,false,true]. It supplements the commented-out codec-local test and does not assert actual IO request counts. The projection test writes only f50 from a 100-field schema, then opens with full schema but min=max=f50; it does not test projection from a physically 100-column file. (rust/lance-file/src/versions/v1/reader.rs:1459-1561)

Dependencies provide Arrow arrays/arithmetic/concat, borrowed async Reader/ObjectStore IO, Lance typed cache and metadata framing, tracing and boxed recursion/ordered futures. There is no local environment variable, Cargo feature, runtime registry, mutable global, unsafe block, durability commit or writer lifecycle. The generic offset type and private cache trait adapt existing implementations; they are not new-format plugin seams. Preserve historical behavior unless legacy repair is explicitly in scope. (rust/lance-file/src/versions/v1/reader.rs:6-40; rust/lance-file/src/versions/v1/reader.rs:83-123; rust/lance-file/src/versions/v1/reader.rs:271-288; rust/lance-file/src/versions/v1/reader.rs:689-808; AGENTS.md:13-18)

## Exact production declarations

The following 51 declarations include private implementation methods, fields, trait constants and associated type. The linked L2 retains complete bodies, generic implementation contexts and every test/helper.

| Qualified suffix within lance_file::versions::v1::reader | Visibility / kind | Exact declaration | Evidence |
|---|---|---|---|
| `FileReader` | pub / struct | `pub struct FileReader {` | [rust/lance-file/src/versions/v1/reader.rs:45-45](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::object_reader` | pub / field | `pub object_reader: Arc<dyn Reader>,` | [rust/lance-file/src/versions/v1/reader.rs:46-46](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::metadata` | private / field | `metadata: Arc<Metadata>,` | [rust/lance-file/src/versions/v1/reader.rs:47-47](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::page_table` | private / field | `page_table: Arc<PageTable>,` | [rust/lance-file/src/versions/v1/reader.rs:48-48](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::schema` | private / field | `schema: Schema,` | [rust/lance-file/src/versions/v1/reader.rs:49-49](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::fragment_id` | private / field | `fragment_id: u64,` | [rust/lance-file/src/versions/v1/reader.rs:53-53](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::stats_page_table` | private / field | `stats_page_table: Arc<Option<PageTable>>,` | [rust/lance-file/src/versions/v1/reader.rs:56-56](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `<FileReader as std::fmt::Debug>::fmt` | trait implementation / function | `fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {` | [rust/lance-file/src/versions/v1/reader.rs:60-60](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `StringCacheKey` | private / struct | `struct StringCacheKey<'a, T> {` | [rust/lance-file/src/versions/v1/reader.rs:69-69](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `StringCacheKey::key` | private / field | `key: &'a str,` | [rust/lance-file/src/versions/v1/reader.rs:70-70](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `StringCacheKey::_phantom` | private / field | `_phantom: std::marker::PhantomData<T>,` | [rust/lance-file/src/versions/v1/reader.rs:71-71](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `StringCacheKey::new` | private / function | `fn new(key: &'a str) -> Self {` | [rust/lance-file/src/versions/v1/reader.rs:75-75](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `StableStringCacheValue` | private / trait | `trait StableStringCacheValue: 'static {` | [rust/lance-file/src/versions/v1/reader.rs:83-83](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `StableStringCacheValue::STABLE_TYPE_ID` | private trait contract / associated constant | `const STABLE_TYPE_ID: &'static str;` | [rust/lance-file/src/versions/v1/reader.rs:84-84](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `<Metadata as StableStringCacheValue>::STABLE_TYPE_ID` | private trait contract / associated constant | `const STABLE_TYPE_ID: &'static str = "lance.file.previous.Metadata";` | [rust/lance-file/src/versions/v1/reader.rs:88-88](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `<PageTable as StableStringCacheValue>::STABLE_TYPE_ID` | private trait contract / associated constant | `const STABLE_TYPE_ID: &'static str = "lance.file.previous.PageTable";` | [rust/lance-file/src/versions/v1/reader.rs:92-92](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `<Option<PageTable> as StableStringCacheValue>::STABLE_TYPE_ID` | private trait contract / associated constant | `const STABLE_TYPE_ID: &'static str = "lance.file.previous.OptionalPageTable";` | [rust/lance-file/src/versions/v1/reader.rs:96-96](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `<StringCacheKey as CacheKey>::ValueType` | trait implementation / associated type | `type ValueType = T;` | [rust/lance-file/src/versions/v1/reader.rs:100-100](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `<StringCacheKey as CacheKey>::key` | trait implementation / function | `fn key(&self) -> Cow<'_, str> {` | [rust/lance-file/src/versions/v1/reader.rs:102-102](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `<StringCacheKey as CacheKey>::type_name` | trait implementation / function | `fn type_name() -> &'static str {` | [rust/lance-file/src/versions/v1/reader.rs:106-106](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `<StringCacheKey as CacheKey>::stable_type_id` | trait implementation / function | `fn stable_type_id() -> &'static str {` | [rust/lance-file/src/versions/v1/reader.rs:112-112](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `<StringCacheKey as CacheKey>::schema` | trait implementation / function | `fn schema() -> CacheKeySchema {` | [rust/lance-file/src/versions/v1/reader.rs:116-116](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `<StringCacheKey as CacheKey>::write_key` | trait implementation / function | `fn write_key(&self, builder: &mut KeyBuilder) {` | [rust/lance-file/src/versions/v1/reader.rs:120-120](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::try_new_with_fragment_id` | pub / async function | `pub async fn try_new_with_fragment_id(         object_store: &ObjectStore,         path: &Path,         schema: Schema,         fragment_id: u32,         field_id_offset: i32,         max_field_id: i32,         session: Option<&LanceCache>,     ) -> Result<Self> {` | [rust/lance-file/src/versions/v1/reader.rs:139-147](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::try_new_from_reader` | pub / async function | `pub async fn try_new_from_reader(         path: &Path,         object_reader: Arc<dyn Reader>,         metadata: Option<Arc<Metadata>>,         schema: Schema,         fragment_id: u32,         field_id_offset: i32,         max_field_id: i32,         session: Option<&LanceCache>,     ) -> Result<Self> {` | [rust/lance-file/src/versions/v1/reader.rs:166-175](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::read_metadata` | pub / async function | `pub async fn read_metadata(         object_reader: &dyn Reader,         cache: Option<&LanceCache>,     ) -> Result<Arc<Metadata>> {` | [rust/lance-file/src/versions/v1/reader.rs:210-213](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::read_stats_page_table` | private / async function | `async fn read_stats_page_table(         reader: &dyn Reader,         cache: Option<&LanceCache>,     ) -> Result<Arc<Option<PageTable>>> {` | [rust/lance-file/src/versions/v1/reader.rs:239-242](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::load_from_cache` | private / async function | `async fn load_from_cache<T: DeepSizeOf + Send + Sync + StableStringCacheValue, F, Fut>(         cache: Option<&LanceCache>,         key: String,         loader: F,     ) -> Result<Arc<T>>     where         F: Fn(&str) -> Fut + Send + Sync,         Fut: Future<Output = Result<T>> + Send,     {` | [rust/lance-file/src/versions/v1/reader.rs:271-279](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::try_new` | pub / async function | `pub async fn try_new(object_store: &ObjectStore, path: &Path, schema: Schema) -> Result<Self> {` | [rust/lance-file/src/versions/v1/reader.rs:291-291](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::io_parallelism` | private / function | `fn io_parallelism(&self) -> usize {` | [rust/lance-file/src/versions/v1/reader.rs:297-297](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::schema` | pub / function | `pub fn schema(&self) -> &Schema {` | [rust/lance-file/src/versions/v1/reader.rs:302-302](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::num_batches` | pub / function | `pub fn num_batches(&self) -> usize {` | [rust/lance-file/src/versions/v1/reader.rs:306-306](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::num_rows_in_batch` | pub / function | `pub fn num_rows_in_batch(&self, batch_id: i32) -> usize {` | [rust/lance-file/src/versions/v1/reader.rs:311-311](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::len` | pub / function | `pub fn len(&self) -> usize {` | [rust/lance-file/src/versions/v1/reader.rs:316-316](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::is_empty` | pub / function | `pub fn is_empty(&self) -> bool {` | [rust/lance-file/src/versions/v1/reader.rs:320-320](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::read_batch` | pub / async function | `pub async fn read_batch(         &self,         batch_id: i32,         params: impl Into<ReadBatchParams>,         projection: &Schema,     ) -> Result<RecordBatch> {` | [rust/lance-file/src/versions/v1/reader.rs:328-333](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::read_range` | pub / async function | `pub async fn read_range(         &self,         range: Range<usize>,         projection: &Schema,     ) -> Result<RecordBatch> {` | [rust/lance-file/src/versions/v1/reader.rs:342-346](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::take` | pub / async function | `pub async fn take(&self, indices: &[u32], projection: &Schema) -> Result<RecordBatch> {` | [rust/lance-file/src/versions/v1/reader.rs:370-370](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::page_stats_schema` | pub / function | `pub fn page_stats_schema(&self, field_ids: &[i32]) -> Option<Schema> {` | [rust/lance-file/src/versions/v1/reader.rs:399-399](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `FileReader::read_page_stats` | pub / async function | `pub async fn read_page_stats(&self, field_ids: &[i32]) -> Result<Option<RecordBatch>> {` | [rust/lance-file/src/versions/v1/reader.rs:417-417](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `batches_stream` | pub / function | `pub fn batches_stream(     reader: FileReader,     projection: Schema,     predicate: impl FnMut(&i32) -> bool + Send + Sync + 'static, ) -> impl RecordBatchStream {` | [rust/lance-file/src/versions/v1/reader.rs:458-462](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `read_batch` | pub / async function | `pub async fn read_batch(     reader: &FileReader,     params: &ReadBatchParams,     schema: &Schema,     batch_id: i32, ) -> Result<RecordBatch> {` | [rust/lance-file/src/versions/v1/reader.rs:489-494](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `read_array` | private / async function | `async fn read_array(     reader: &FileReader,     field: &Field,     batch_id: i32,     page_table: &PageTable,     params: &ReadBatchParams, ) -> Result<ArrayRef> {` | [rust/lance-file/src/versions/v1/reader.rs:510-516](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `get_page_info` | private / function | `fn get_page_info<'a>(     page_table: &'a PageTable,     field: &'a Field,     batch_id: i32, ) -> Result<&'a PageInfo> {` | [rust/lance-file/src/versions/v1/reader.rs:546-550](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `_read_fixed_stride_array` | private / async function | `async fn _read_fixed_stride_array(     reader: &FileReader,     field: &Field,     batch_id: i32,     page_table: &PageTable,     params: &ReadBatchParams, ) -> Result<ArrayRef> {` | [rust/lance-file/src/versions/v1/reader.rs:560-566](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `read_null_array` | private / function | `fn read_null_array(     field: &Field,     batch_id: i32,     page_table: &PageTable,     params: &ReadBatchParams, ) -> Result<ArrayRef> {` | [rust/lance-file/src/versions/v1/reader.rs:578-583](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `read_binary_array` | private / async function | `async fn read_binary_array(     reader: &FileReader,     field: &Field,     batch_id: i32,     page_table: &PageTable,     params: &ReadBatchParams, ) -> Result<ArrayRef> {` | [rust/lance-file/src/versions/v1/reader.rs:625-631](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `read_dictionary_array` | private / async function | `async fn read_dictionary_array(     reader: &FileReader,     field: &Field,     batch_id: i32,     page_table: &PageTable,     params: &ReadBatchParams, ) -> Result<ArrayRef> {` | [rust/lance-file/src/versions/v1/reader.rs:645-651](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `read_struct_array` | private / async function | `async fn read_struct_array(     reader: &FileReader,     field: &Field,     batch_id: i32,     page_table: &PageTable,     params: &ReadBatchParams, ) -> Result<ArrayRef> {` | [rust/lance-file/src/versions/v1/reader.rs:671-677](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `take_list_array` | private / async function | `async fn take_list_array<T: ArrowNumericType>(     reader: &FileReader,     field: &Field,     batch_id: i32,     page_table: &PageTable,     positions: &PrimitiveArray<T>,     indices: &UInt32Array, ) -> Result<ArrayRef> where     T::Native: ArrowNativeTypeOp + OffsetSizeTrait, {` | [rust/lance-file/src/versions/v1/reader.rs:689-699](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
| `read_list_array` | private / async function | `async fn read_list_array<T: ArrowNumericType>(     reader: &FileReader,     field: &Field,     batch_id: i32,     page_table: &PageTable,     params: &ReadBatchParams, ) -> Result<ArrayRef> where     T::Native: ArrowNativeTypeOp + OffsetSizeTrait, {` | [rust/lance-file/src/versions/v1/reader.rs:741-750](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) |
