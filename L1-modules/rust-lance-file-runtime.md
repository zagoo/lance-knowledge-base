> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

# lance-file runtime boundaries: schema, IO, exact dispatch and writer checks

**Retained production-contract supplement.** This supplement fully covers five local files (1,628 lines): datatypes.rs, io.rs, versions/mod.rs, writer.rs and writer/field_types.rs. Current composition/compression policies and shared structural reader are covered in the [composition supplement](rust-lance-file-composition.md). Exact current reader modules are covered in the [reader supplement](rust-lance-file-readers.md); V2_1/V2_2/V2_3 writers and shared pipeline are covered in the [structural writer supplement](rust-lance-file-structural-writer.md); the separate V2_0 writer and compatibility test/generator sources are covered in the [V2_0 supplement](rust-lance-file-v20-compatibility.md). The [shared reader](rust-lance-file-shared-reader.md) covers full/indexed metadata IO, caching and read dispatch; delegated scheduler behavior, all six binary fixture payloads are now interpreted; other delegated behavior remains pending. Source tests are described, not executed.

[File module](rust-lance-file.md) · [Orientation](../L0-orientation.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Format](../L3-symbols/format-spec.md) · [Scenarios](../L4-crosscutting/scenarios.md) · [Cookbook](../L4-crosscutting/cookbook.md)

## Schema reconstruction and persistence conversion

Fields(pub Vec<pb::Field>) and FieldsWithMeta{fields:Fields,metadata:HashMap<String,Vec<u8>>} are public. From<&Field> recursively flattens parent then children; From<&Schema> concatenates root subtrees. They preserve supplied IDs/parent IDs and do not validate or assign them. TryFrom<&Fields> for Schema reconstructs iteratively and supplies empty schema metadata; TryFrom<FieldsWithMeta> adds lossily decoded metadata. (rust/lance-file/src/datatypes.rs:95-129; rust/lance-file/src/datatypes.rs:157-314)

```text
protobuf list, parents before children
|-- arena: childless Field + child node indices
|-- ID map: unique ID -> node; duplicate ID -> ambiguous
|   '-- ambiguous parent -> first pre-order DFS match
|-- reverse arena order: take children into parent
'-- roots in input order -> Schema(fields, empty metadata)
    '-- FieldsWithMeta adds the converted schema metadata
```

Unique IDs use expected-linear hash lookups; ambiguous references allocate a DFS stack and may lead to quadratic work. Parent-before-child is enforced, strict flat pre-order is not. Historical duplicates are intentionally retained: a nested duplicate under an earlier root can win over a root encountered earlier in the flat list. Missing parents produce Schema errors with name/IDs; internal arena failures are Internal. No Schema::validate or key/type check follows. Iterative reconstruction does not make recursive flattening or Field destruction stack-safe. (rust/lance-file/src/datatypes.rs:102-245; rust/lance-file/src/datatypes.rs:502-520)

Field metadata bytes are decoded with UTF-8 replacement; nonempty dedicated extension_name overrides its metadata key. Unknown numeric encodings become None; encoding numbers1..4 map Plain/VarBinary/Dictionary/RLE, and encoding writes None as0. The legacy field-kind number is ignored on read and forced0 on write. Primary presence uses positive position or legacy bool->Some(0); clustering uses positive position only and writes its legacy bool=false. Dictionary i64 locations cast unchecked to usize and back; loaded dictionary values are discarded. (rust/lance-file/src/datatypes.rs:11-94; rust/lance-file/src/datatypes.rs:316-344)

Minimal local conversion example, derived from the source doctest (not compiled here):

```rust
use lance_core::datatypes::Schema;
use lance_file::{datatypes::Fields, format::pb};
fn decode_root() -> lance_core::Result<Schema> {
    Schema::try_from(&Fields(vec![pb::Field {
        id: 0,
        parent_id: -1,
        name: "value".to_owned(),
        logical_type: "int32".to_owned(),
        ..Default::default()
    }]))
}
```

The example only establishes reconstruction; it does not validate a complete dataset schema. The source metadata roundtrip unit test uses Schema equality, which ignores top-level metadata, so that test alone cannot prove metadata preservation. (rust/lance-file/src/datatypes.rs:139-156; rust/lance-file/src/datatypes.rs:394-410; rust/lance-core/src/datatypes/schema.rs:922-926)

## Encoding IO and retained memory

LanceEncodingsIo is public through the crate reexport. It owns a FileScheduler and starts with an8MiB read chunk target; the consuming setter accepts zero without validation. EncodingsIo promises one Bytes per input range including empties. This adapter preserves empty positions and original order, delegates priority unchanged to FileScheduler and always returns Some for optional bypass/stats handles. Stats replaces the extra recorder on a cloned scheduler; it does not reopen the file. (rust/lance-file/src/lib.rs:16-17; rust/lance-file/src/io.rs:12-50; rust/lance-file/src/reader.rs:56-58; rust/lance-encoding/src/lib.rs:40-104; rust/lance-io/src/scheduler.rs:1336-1352)

For a range of length n>limit, generate k=ceil(n/limit) chunks: k-1 chunks of floor(n/k), then a final remainder. This is a target, not a strict cap: n=10,limit=3 yields2,2,2,4. Zero limit divides by zero for nonempty requests; reversed bounds subtract unchecked. No sort/dedup occurs. FileScheduler checks actual split start order, coalesces nearby requests and can split again, so this adapter does not determine physical IOP size. (rust/lance-file/src/io.rs:51-98; rust/lance-io/src/scheduler.rs:1195-1264)

Scheduler submission occurs before returning the adapter's boxed async block, including for an empty split list. Await errors propagate; result-count mismatch is Internal. Unsplit requests return the scheduler Vec directly. Reassembly groups returned Bytes per original request, inserts empty Bytes, cheaply clones single chunks and allocates/copies multiple chunks. It does not verify individual result lengths; retained source chunks overlap the combined allocation. Scheduler queue/cancellation lifetime remains pending. (rust/lance-file/src/io.rs:98-148)

## Exact-version dispatch matrix

Every dispatch takes ConcreteFileVersion; callers resolve Stable/Next separately. There is no ordered comparison or implicit nearest-version fallback. (rust/lance-file/src/versions/mod.rs:4-48)

| Operation family | V1 | V2_0 | V2_1, V2_2, V2_3 |
|---|---|---|---|
| Field/name/whole-schema projections, physical counts and data-file column mapping | Own v1 module | Own module | Each own module |
| Current read projection / finish raw metadata | Internal | Own module | Each own module |
| Finish metadata index | VersionConflict(0,2) | Own module | Each own module |
| Decode embedded column metadata | NotSupported | Own module | Each own module |
| Validate global buffers | Successful no-op | Own module | Each own module |
| Copy external column | NotSupported, closure unused | Conditional callback | Always await callback |
| Finalize copied pages | NotSupported | Normalize pages | Successful no-op |
| Open projected reader | NotSupported | Full opener only | Eligible indexed attempt, then full on None |
| Create current/lazy writer; encode embedded/mini batch | NotSupported | Own module | Each own module |

Matrix evidence: rust/lance-file/src/versions/mod.rs:38-277; rust/lance-file/src/versions/mod.rs:285-401. Per-version byte grammars and concrete mechanisms are not inferred from this routing table.

External metadata validation checks whole-schema physical count, projection validity, sequential column.index values, then delegates rectangularity/normalized row count to the exact read projection. Indexed reader opening requires preference plus structural eligibility; an indexed error propagates, while None falls back. V2_0 never invokes the indexed closure. Self-described opening delegates optimistic-tail detection; OpenedFileReader::V1 only retains footer numbers, while Current owns FileReader. (rust/lance-file/src/versions/mod.rs:50-107; rust/lance-file/src/versions/mod.rs:279-326; rust/lance-file/src/reader.rs:1109-1136; rust/lance-file/src/reader.rs:1534-1547)

## Writer facade and diagnostics

FileWriter stores one boxed exact V2 writer. FileWriterOptions defaults all three Option fields to None; its local validator rejects only max_page_bytes=Some(0). The Arrow C-interface retention warning is documentation; current structural resolution uses 8 MiB per top-level field or a divided supplied budget, explicit max-page size before environment/default32 MiB, and keep_original_array=false. V2_0 uses the same local option resolution formulas (rust/lance-file/src/versions/v2_0/writer.rs:326-356). (rust/lance-file/src/writer/structural.rs:414-439) PAGE_BUFFER_ALIGNMENT=64 and LANCE_FILE_WRITER_MAX_PAGE_BYTES are declared here but used by concrete writers. (rust/lance-file/src/writer.rs:17-77)

write_batches awaits batches sequentially, stops at first error and does not roll back earlier effects. External-column initialization converts every ColumnInfo to protobuf first: both page encoding forms and column encoding become serialized prost Any in DirectEncoding; descriptor pairs unzip in order, page row counts/priorities persist, ColumnInfo.index is omitted. Only then is the concrete initializer called. The facade does not establish schema/column or state consistency. finish returns FileWriteSummary{num_rows,size_bytes}; abort returns unit; tell reports delegated position. Their durability/cleanup guarantees require concrete analysis. (rust/lance-file/src/writer.rs:79-115; rust/lance-file/src/writer.rs:160-289)

ExpectedTypes is effectively crate-internal despite pub declarations in its private module. It converts expected core fields to Arrow once, remembers the last successful SchemaRef, and compares schemas by value equality. It matches expected columns by name (same-position fast path, name-search fallback); absent fields and extras are outside this checker. It does not inspect array values/nulls. A failed check leaves the prior accepted schema cached. (rust/lance-file/src/writer.rs:17-21; rust/lance-file/src/writer/field_types.rs:67-114)

The recursive checker compares extension name/metadata when enabled, pairs Struct/List/LargeList/Map/FixedSizeList children by position, ignores names/nullability in those arms and ignores Map sortedness. Blob-v2 Struct/Struct short-circuits child validation after the extension gate; the blob encoder is responsible for descriptor checks. Utf8<-Utf8View and Binary<-BinaryView are directional exceptions. Other types use exact DataType equality, potentially including stricter embedded-field equality. Bare column writes skip only the top-level extension comparison; nested children still compare extensions. (rust/lance-file/src/writer/field_types.rs:115-199)

FieldTypeMismatch is publicly reexported and downcastable through Error::InvalidInput source. It retains expected/actual FieldRef and a path constructed from expected names. Dot separators are unescaped. Display prints type plus extension; metadata without an extension name prints as no extension even though comparison can reject it. Contextual concrete writers call type checks before encoder preparation/nullability checks; invalid bare column indices are guarded there rather than in ExpectedTypes::check_column. (rust/lance-file/src/writer/field_types.rs:21-65; rust/lance-file/src/writer/field_types.rs:120-199; rust/lance-file/src/writer/structural.rs:610-630; rust/lance-file/src/writer/structural.rs:663-689; rust/lance-file/src/versions/v2_0/writer.rs:458-477; rust/lance-file/src/versions/v2_0/writer.rs:544-572)

## Local files and exact callable catalog

- [rust/lance-file/src/datatypes.rs](../L2-files/rust/lance-file/src/datatypes.rs.md): Public wrappers and trait conversions between flat protobuf fields/dictionary metadata and Lance core field trees; arena reconstruction preserves historical duplicate-ID tie-breaking. No file IO is performed.
- [rust/lance-file/src/io.rs](../L2-files/rust/lance-file/src/io.rs.md): LanceEncodingsIo is the publicly reexported adapter from encoding single-file byte-range requests to FileScheduler, including range splitting, empty placeholders and reassembly.
- [rust/lance-file/src/versions/mod.rs](../L2-files/rust/lance-file/src/versions/mod.rs.md): Exact-version composition root for projection, metadata, reader and writer dispatch. It accepts ConcreteFileVersion after caller selector resolution and separates V1 compatibility from current-format runtime APIs.
- [rust/lance-file/src/writer.rs](../L2-files/rust/lance-file/src/writer.rs.md): Public runtime facade and options for current-format file writers, plus external ColumnInfo-to-protobuf conversion. Concrete version writers own encoding, IO, initialization and completion policy.
- [rust/lance-file/src/writer/field_types.rs](../L2-files/rust/lance-file/src/writer/field_types.rs.md): Shared crate-internal writer type/extension checker, with publicly reexported FieldTypeMismatch diagnostic. Caller conversion and encoder nullability/missing-column checks stay separate.

Signatures below are literal declarations; visibility accounts for the private field_types module. Trait conversions are public wherever their participating public types are accessible.

| Symbol | Declaration | Visibility | Evidence |
|---|---|---|---|
| `lance_file::datatypes::<Field as From<&pb::Field>>::from` | `fn from(field: &pb::Field) -> Self {` | trait implementation | [rust/lance-file/src/datatypes.rs:13-13](../L2-files/rust/lance-file/src/datatypes.rs.md) |
| `lance_file::datatypes::<pb::Field as From<&Field>>::from` | `fn from(field: &Field) -> Self {` | trait implementation | [rust/lance-file/src/datatypes.rs:59-59](../L2-files/rust/lance-file/src/datatypes.rs.md) |
| `lance_file::datatypes::first_field_index_by_id` | `fn first_field_index_by_id(     nodes: &[FieldNode],     root_indices: &[usize],     field_id: i32, ) -> Option<usize> {` | private | [rust/lance-file/src/datatypes.rs:104-108](../L2-files/rust/lance-file/src/datatypes.rs.md) |
| `lance_file::datatypes::<Fields as From<&Field>>::from` | `fn from(field: &Field) -> Self {` | trait implementation | [rust/lance-file/src/datatypes.rs:124-124](../L2-files/rust/lance-file/src/datatypes.rs.md) |
| `lance_file::datatypes::<Schema as TryFrom<&Fields>>::try_from` | `fn try_from(fields: &Fields) -> Result<Self> {` | trait implementation | [rust/lance-file/src/datatypes.rs:160-160](../L2-files/rust/lance-file/src/datatypes.rs.md) |
| `lance_file::datatypes::<Schema as TryFrom<FieldsWithMeta>>::try_from` | `fn try_from(fields_with_meta: FieldsWithMeta) -> Result<Self> {` | trait implementation | [rust/lance-file/src/datatypes.rs:273-273](../L2-files/rust/lance-file/src/datatypes.rs.md) |
| `lance_file::datatypes::<Fields as From<&Schema>>::from` | `fn from(schema: &Schema) -> Self {` | trait implementation | [rust/lance-file/src/datatypes.rs:293-293](../L2-files/rust/lance-file/src/datatypes.rs.md) |
| `lance_file::datatypes::<FieldsWithMeta as From<&Schema>>::from` | `fn from(schema: &Schema) -> Self {` | trait implementation | [rust/lance-file/src/datatypes.rs:304-304](../L2-files/rust/lance-file/src/datatypes.rs.md) |
| `lance_file::datatypes::<Dictionary as From<&pb::Dictionary>>::from` | `fn from(proto: &pb::Dictionary) -> Self {` | trait implementation | [rust/lance-file/src/datatypes.rs:317-317](../L2-files/rust/lance-file/src/datatypes.rs.md) |
| `lance_file::datatypes::<pb::Dictionary as From<&Dictionary>>::from` | `fn from(d: &Dictionary) -> Self {` | trait implementation | [rust/lance-file/src/datatypes.rs:327-327](../L2-files/rust/lance-file/src/datatypes.rs.md) |
| `lance_file::datatypes::<pb::Encoding as From<Encoding>>::from` | `fn from(e: Encoding) -> Self {` | trait implementation | [rust/lance-file/src/datatypes.rs:336-336](../L2-files/rust/lance-file/src/datatypes.rs.md) |
| `lance_file::io::LanceEncodingsIo::new` | `pub fn new(scheduler: FileScheduler) -> Self {` | public | [rust/lance-file/src/io.rs:20-20](../L2-files/rust/lance-file/src/io.rs.md) |
| `lance_file::io::LanceEncodingsIo::with_read_chunk_size` | `pub fn with_read_chunk_size(mut self, read_chunk_size: u64) -> Self {` | public | [rust/lance-file/src/io.rs:27-27](../L2-files/rust/lance-file/src/io.rs.md) |
| `lance_file::io::<LanceEncodingsIo as EncodingsIo>::with_bypass_backpressure` | `fn with_bypass_backpressure(&self) -> Option<Arc<dyn EncodingsIo>> {` | trait implementation | [rust/lance-file/src/io.rs:34-34](../L2-files/rust/lance-file/src/io.rs.md) |
| `lance_file::io::<LanceEncodingsIo as EncodingsIo>::with_io_stats` | `fn with_io_stats(         &self,         stats: Arc<dyn lance_core::utils::io_stats::IoStatsRecorder>,     ) -> Option<Arc<dyn EncodingsIo>> {` | trait implementation | [rust/lance-file/src/io.rs:41-44](../L2-files/rust/lance-file/src/io.rs.md) |
| `lance_file::io::<LanceEncodingsIo as EncodingsIo>::submit_request` | `fn submit_request(         &self,         ranges: Vec<std::ops::Range<u64>>,         priority: u64,     ) -> BoxFuture<'static, lance_core::Result<Vec<bytes::Bytes>>> {` | trait implementation | [rust/lance-file/src/io.rs:51-55](../L2-files/rust/lance-file/src/io.rs.md) |
| `lance_file::versions::read_projection` | `pub(crate) fn read_projection(version: ConcreteFileVersion) -> Result<Arc<dyn ReadProjection>> {` | pub(crate)  | [rust/lance-file/src/versions/mod.rs:38-38](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::versions::finish_metadata` | `pub(crate) fn finish_metadata(     version: ConcreteFileVersion,     metadata: RawFileMetadata, ) -> Result<CachedFileMetadata> {` | pub(crate)  | [rust/lance-file/src/versions/mod.rs:63-66](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::versions::validate_external_metadata` | `pub(crate) fn validate_external_metadata(     version: ConcreteFileVersion,     schema: &Schema,     metadata: &CachedFileMetadata, ) -> Result<u64> {` | pub(crate)  | [rust/lance-file/src/versions/mod.rs:80-84](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::versions::finish_metadata_index` | `pub(crate) fn finish_metadata_index(index: FileMetadataIndex) -> Result<FileMetadataIndex> {` | pub(crate)  | [rust/lance-file/src/versions/mod.rs:109-109](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::versions::decode_column_metadata` | `pub(crate) fn decode_column_metadata(     version: ConcreteFileVersion,     column_metadatas: &[pbfile::ColumnMetadata], ) -> Result<Vec<Arc<ColumnInfo>>> {` | pub(crate)  | [rust/lance-file/src/versions/mod.rs:123-126](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::versions::validate_global_buffers` | `pub(crate) fn validate_global_buffers(     version: ConcreteFileVersion,     buffers: &[BufferDescriptor], ) -> Result<()> {` | pub(crate)  | [rust/lance-file/src/versions/mod.rs:138-141](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::versions::reader_projection_from_field_ids` | `pub fn reader_projection_from_field_ids(     version: ConcreteFileVersion,     schema: &Schema,     field_id_to_column_index: &BTreeMap<u32, u32>, ) -> Result<ReaderProjection> {` | public | [rust/lance-file/src/versions/mod.rs:151-155](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::versions::reader_projection_from_whole_schema` | `pub fn reader_projection_from_whole_schema(     schema: &Schema,     version: ConcreteFileVersion, ) -> ReaderProjection {` | public | [rust/lance-file/src/versions/mod.rs:173-176](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::versions::reader_projection_from_column_names` | `pub fn reader_projection_from_column_names(     version: ConcreteFileVersion,     schema: &Schema,     column_names: &[&str], ) -> Result<ReaderProjection> {` | public | [rust/lance-file/src/versions/mod.rs:186-190](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::versions::physical_column_count` | `pub fn physical_column_count(     version: ConcreteFileVersion,     field: &lance_core::datatypes::Field, ) -> usize {` | public | [rust/lance-file/src/versions/mod.rs:201-204](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::versions::data_file_columns` | `pub fn data_file_columns(version: ConcreteFileVersion, schema: &Schema) -> (Vec<i32>, Vec<i32>) {` | public | [rust/lance-file/src/versions/mod.rs:215-215](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::versions::copy_external_metadata_column` | `pub async fn copy_external_metadata_column<Copy, CopyFuture>(     version: ConcreteFileVersion,     schema: &Schema,     column_index: usize,     has_existing_pages: bool,     copy: Copy, ) -> Result<()> where     Copy: FnOnce() -> CopyFuture + Send,     CopyFuture: Future<Output = Result<()>> + Send, {` | public | [rust/lance-file/src/versions/mod.rs:230-240](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::versions::finalize_external_metadata_column` | `pub fn finalize_external_metadata_column(     version: ConcreteFileVersion,     schema: &Schema,     column_index: usize,     pages: &mut Vec<PageInfo>,     num_rows: u64, ) -> Result<()> {` | public | [rust/lance-file/src/versions/mod.rs:260-266](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::versions::open_projected_reader` | `pub async fn open_projected_reader<OpenIndexed, IndexedFuture, OpenFull, FullFuture>(     version: ConcreteFileVersion,     projection: &ReaderProjection,     prefer_indexed: bool,     open_indexed: OpenIndexed,     open_full: OpenFull, ) -> Result<ProjectedFileReader> where     OpenIndexed: FnOnce() -> IndexedFuture + Send,     IndexedFuture: Future<Output = Result<Option<ProjectedFileReader>>> + Send,     OpenFull: FnOnce() -> FullFuture + Send,     FullFuture: Future<Output = Result<ProjectedFileReader>> + Send, {` | public | [rust/lance-file/src/versions/mod.rs:285-297](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::versions::open_self_described_reader` | `pub async fn open_self_described_reader(     scheduler: FileScheduler,     decoder_plugins: Arc<DecoderPlugins>,     cache: &LanceCache,     options: FileReaderOptions, ) -> Result<OpenedFileReader> {` | public | [rust/lance-file/src/versions/mod.rs:319-324](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::versions::create_writer` | `pub fn create_writer(     version: ConcreteFileVersion,     object_writer: Box<dyn Writer>,     schema: Schema,     options: FileWriterOptions, ) -> Result<FileWriter> {` | public | [rust/lance-file/src/versions/mod.rs:332-337](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::versions::create_lazy_writer` | `pub fn create_lazy_writer(     version: ConcreteFileVersion,     object_writer: Box<dyn Writer>,     options: FileWriterOptions, ) -> Result<FileWriter> {` | public | [rust/lance-file/src/versions/mod.rs:358-362](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::versions::encode_self_described_batch` | `pub fn encode_self_described_batch(     version: ConcreteFileVersion,     batch: &EncodedBatch, ) -> Result<Bytes> {` | public | [rust/lance-file/src/versions/mod.rs:375-378](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::versions::encode_mini_batch` | `pub fn encode_mini_batch(version: ConcreteFileVersion, batch: &EncodedBatch) -> Result<Bytes> {` | public | [rust/lance-file/src/versions/mod.rs:391-391](../L2-files/rust/lance-file/src/versions/mod.rs.md) |
| `lance_file::writer::FileWriterOptions::validate` | `pub(crate) fn validate(&self) -> Result<()> {` | pub(crate)  | [rust/lance-file/src/writer.rs:57-57](../L2-files/rust/lance-file/src/writer.rs.md) |
| `lance_file::writer::column_info_to_metadata` | `fn column_info_to_metadata(column: &ColumnInfo) -> Result<pbfile::ColumnMetadata> {` | private | [rust/lance-file/src/writer.rs:79-79](../L2-files/rust/lance-file/src/writer.rs.md) |
| `lance_file::writer::<FileWriter as From<versions::v2_0::Writer>>::from` | `fn from(writer: versions::v2_0::Writer) -> Self {` | trait implementation | [rust/lance-file/src/writer.rs:118-118](../L2-files/rust/lance-file/src/writer.rs.md) |
| `lance_file::writer::<FileWriter as From<versions::v2_1::Writer>>::from` | `fn from(writer: versions::v2_1::Writer) -> Self {` | trait implementation | [rust/lance-file/src/writer.rs:124-124](../L2-files/rust/lance-file/src/writer.rs.md) |
| `lance_file::writer::<FileWriter as From<versions::v2_2::Writer>>::from` | `fn from(writer: versions::v2_2::Writer) -> Self {` | trait implementation | [rust/lance-file/src/writer.rs:130-130](../L2-files/rust/lance-file/src/writer.rs.md) |
| `lance_file::writer::<FileWriter as From<versions::v2_3::Writer>>::from` | `fn from(writer: versions::v2_3::Writer) -> Self {` | trait implementation | [rust/lance-file/src/writer.rs:136-136](../L2-files/rust/lance-file/src/writer.rs.md) |
| `lance_file::writer::FileWriter::with_page_metadata_spill` | `pub fn with_page_metadata_spill(self, object_store: Arc<ObjectStore>, path: Path) -> Self {` | public | [rust/lance-file/src/writer.rs:143-143](../L2-files/rust/lance-file/src/writer.rs.md) |
| `lance_file::writer::FileWriter::write_batches` | `pub async fn write_batches(         &mut self,         batches: impl Iterator<Item = &RecordBatch>,     ) -> Result<()> {` | public | [rust/lance-file/src/writer.rs:161-164](../L2-files/rust/lance-file/src/writer.rs.md) |
| `lance_file::writer::FileWriter::write_batch` | `pub async fn write_batch(&mut self, batch: &RecordBatch) -> Result<()> {` | public | [rust/lance-file/src/writer.rs:172-172](../L2-files/rust/lance-file/src/writer.rs.md) |
| `lance_file::writer::FileWriter::write_column` | `pub async fn write_column(&mut self, column_index: usize, array: ArrayRef) -> Result<()> {` | public | [rust/lance-file/src/writer.rs:182-182](../L2-files/rust/lance-file/src/writer.rs.md) |
| `lance_file::writer::FileWriter::write_external_buffer` | `pub async fn write_external_buffer(&mut self, bytes: &[u8]) -> Result<(u64, u64)> {` | public | [rust/lance-file/src/writer.rs:192-192](../L2-files/rust/lance-file/src/writer.rs.md) |
| `lance_file::writer::FileWriter::add_schema_metadata` | `pub fn add_schema_metadata(&mut self, key: impl Into<String>, value: impl Into<String>) {` | public | [rust/lance-file/src/writer.rs:202-202](../L2-files/rust/lance-file/src/writer.rs.md) |
| `lance_file::writer::FileWriter::initialize_with_external_columns` | `pub fn initialize_with_external_columns(         &mut self,         schema: Schema,         columns: &[Arc<ColumnInfo>],         rows_written: u64,     ) -> Result<()> {` | public | [rust/lance-file/src/writer.rs:214-219](../L2-files/rust/lance-file/src/writer.rs.md) |
| `lance_file::writer::FileWriter::add_global_buffer` | `pub async fn add_global_buffer(&mut self, buffer: Bytes) -> Result<u32> {` | public | [rust/lance-file/src/writer.rs:242-242](../L2-files/rust/lance-file/src/writer.rs.md) |
| `lance_file::writer::FileWriter::finish` | `pub async fn finish(&mut self) -> Result<FileWriteSummary> {` | public | [rust/lance-file/src/writer.rs:252-252](../L2-files/rust/lance-file/src/writer.rs.md) |
| `lance_file::writer::FileWriter::abort` | `pub async fn abort(&mut self) {` | public | [rust/lance-file/src/writer.rs:262-262](../L2-files/rust/lance-file/src/writer.rs.md) |
| `lance_file::writer::FileWriter::tell` | `pub async fn tell(&mut self) -> Result<u64> {` | public | [rust/lance-file/src/writer.rs:272-272](../L2-files/rust/lance-file/src/writer.rs.md) |
| `lance_file::writer::FileWriter::field_id_to_column_indices` | `pub fn field_id_to_column_indices(&self) -> &[(u32, u32)] {` | public | [rust/lance-file/src/writer.rs:282-282](../L2-files/rust/lance-file/src/writer.rs.md) |
| `lance_file::writer::field_types::<FieldTypeMismatch as Display>::fmt` | `fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {` | trait implementation | [rust/lance-file/src/writer/field_types.rs:38-38](../L2-files/rust/lance-file/src/writer/field_types.rs.md) |
| `lance_file::writer::field_types::<FieldType as Display>::fmt` | `fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {` | trait implementation | [rust/lance-file/src/writer/field_types.rs:54-54](../L2-files/rust/lance-file/src/writer/field_types.rs.md) |
| `lance_file::writer::field_types::ExpectedTypes::new` | `pub fn new(schema: &Schema) -> Self {` | pub(crate) effective | [rust/lance-file/src/writer/field_types.rs:76-76](../L2-files/rust/lance-file/src/writer/field_types.rs.md) |
| `lance_file::writer::field_types::ExpectedTypes::check_batch` | `pub fn check_batch(&mut self, batch: &RecordBatch) -> Result<()> {` | pub(crate) effective | [rust/lance-file/src/writer/field_types.rs:91-91](../L2-files/rust/lance-file/src/writer/field_types.rs.md) |
| `lance_file::writer::field_types::ExpectedTypes::check_column` | `pub fn check_column(&self, index: usize, array: &ArrayRef) -> Result<()> {` | pub(crate) effective | [rust/lance-file/src/writer/field_types.rs:120-120](../L2-files/rust/lance-file/src/writer/field_types.rs.md) |
| `lance_file::writer::field_types::into_error` | `fn into_error(mismatch: FieldTypeMismatch) -> Error {` | private | [rust/lance-file/src/writer/field_types.rs:131-131](../L2-files/rust/lance-file/src/writer/field_types.rs.md) |
| `lance_file::writer::field_types::check_field` | `fn check_field(     expected: &FieldRef,     actual: &FieldRef,     compare_extension: bool, ) -> std::result::Result<(), FieldTypeMismatch> {` | private | [rust/lance-file/src/writer/field_types.rs:137-141](../L2-files/rust/lance-file/src/writer/field_types.rs.md) |

Excluded test declarations are retained in the [historical catalog](archive/rust-lance-file-runtime-excluded-declarations.md).
