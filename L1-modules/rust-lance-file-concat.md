> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

> Refresh 2026-10-12, `011953c22097b67b699595adbe99e7f0155d83e4`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-12.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

# Encoded-file concatenation and validated parts

All 1,587 physical lines are analyzed, including seven test functions and two fixture helpers. This is a complete local module account; all six binary fixture contents are interpreted; Dataset lifecycle/authority and underlying encoder/decoder/IO implementations remain incomplete. Tests were read, not run. (rust/lance-file/src/concat.rs:1-1600)

[Crate](rust-lance-file.md) · [Shared reader](rust-lance-file-shared-reader.md) · [Version composition](rust-lance-file-composition.md) · [Structural writer](rust-lance-file-structural-writer.md) · [L2 and exact evidence](../L2-files/rust/lance-file/src/concat.rs.md) · [Orientation](../L0-orientation.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Format](../L3-symbols/format-spec.md) · [Scenarios](../L4-crosscutting/scenarios.md)

## Responsibility and runtime values

The module copies complete encoded pages into an ordinary output file, relocating buffer offsets and priorities and regenerating metadata/footer. It does not publish a Dataset transaction, choose a fallback, reserve Blob IDs or own source storage. EncodedFileInput holds a scheduler and optional expected physical row count; the expectation is checked later. DataFilePart additionally retains normalized schema, cached metadata and optional Blob lease/target. Neither object pins an ETag/hash or rechecks immutability during copying. (rust/lance-file/src/concat.rs:4-8; rust/lance-file/src/concat.rs:60-127; rust/lance-file/src/concat.rs:808-1048; rust/lance-file/src/concat.rs:1185-1193)

BlobTargetId is an arbitrary Arc string compared by value. It is not persisted and does not establish Dataset/base/object-store authority. FileConcatTarget stores an exact version, Arc schema and optional target identity. FileConcatResult separates Written, Reused(index, output metadata) and Unsupported(reason); malformed/missing inputs instead return Err. All public declarations and fields, private helpers and exact generic bounds are cataloged below. (rust/lance-file/src/concat.rs:39-58; rust/lance-file/src/concat.rs:513-538; rust/lance-file/src/concat.rs:558-691)

## Entry paths and validation order

1. Ordinary concat_files rejects empty inputs, concurrently reads raw metadata, then returns LegacyVersion if the target or any input is V1. It finalizes all current metadata before shared compatibility. IO/metadata errors can precede the legacy result. Ordinary target Blob fields are unsupported. (rust/lance-file/src/concat.rs:697-725; rust/lance-file/src/concat.rs:1091-1131)
2. DataFilePart::open first checks lease shape, reads full metadata and reconstructs anonymous Blob descriptor children, checks expected rows, rejects Blob v1, validates rectangular metadata and compares normalized/footer counts. Blob v2 descriptor validation happens before requiring a target ID. (rust/lance-file/src/concat.rs:140-225)
3. concat_data_file_parts rejects empty input, compares optional target identities for every part, then sorts declared leases and rejects overlap. It borrows already validated metadata/schema without reopening or checking Blob descriptors again. Touching leases are legal. (rust/lance-file/src/concat.rs:1151-1193)
4. Shared preparation rejects read_batch_bytes=0, then checks compatibility and total-row overflow. A single ordinary input is reused with no output factory or writer-option use. Part mode always writes a new file after successful validation, including one part. (rust/lance-file/src/concat.rs:929-968)

| Compatibility sequence | Outcome |
|---|---|
| Expected row count differs | InvalidInput with path/actual/expected |
| Exact version differs | Unsupported VersionMismatch |
| Schema differs from full target or descriptor-projected target | Unsupported SchemaMismatch |
| External metadata validation fails or normalized rows differ from footer | CorruptFile |
| More than one global buffer | Unsupported ExtraGlobalBuffers |
| Column count differs from first input | Unsupported ColumnLayoutMismatch(None) |
| Any column-level buffers | Unsupported ColumnBuffers |
| Physical column index differs | Unsupported ColumnLayoutMismatch(Some(index)) |
| Serialized column-level encoding differs | Unsupported ColumnEncodingMismatch |

Order is per input after baseline encoding serialization. Column encodings compare protobuf Any bytes; page encodings and page counts may differ. These checks precede the output factory, but page ranges and IO response lengths are checked later. (rust/lance-file/src/concat.rs:693-806)

## Blob schema and descriptor boundary

Footer reconstruction finds top-level consecutive runs matching anonymous descriptor children by ID=-1,parent=-1,name,logical type and empty children. It drains those runs and attaches them to childless Blob nodes in preorder. It does not compare child nullability/metadata/encoding, require all missing nodes be repaired or reject unconsumed queue entries. This is a local interpretation of existing footer metadata, not a migration or new persisted format. (rust/lance-file/src/concat.rs:232-302)

Descriptor validation requires distinct nonnegative Blob field IDs, constructs exact physical-column projection, then opens another FileReader with no cache and streams8192 rows/readahead4. Thus Blob part opening can read metadata twice. It validates decoded descriptor arrays; managed Blob payloads are not loaded here. (rust/lance-file/src/concat.rs:316-377)

| Selected nonnull descriptor kind | Required here | Outside this check |
|---|---|---|
| Inline | size must equal0 | position and ID |
| Packed | lease present and ID contained | payload existence, range bounds, size, repeated IDs |
| Dedicated | lease membership and position0 | payload existence and complete-file size |
| External | recognized kind only | URI, base authority, offset and size |

Unknown kinds propagate BlobKind conversion error. Missing named kind/position/size/blob_id fields are CorruptFile; incorrect Arrow types can panic at downcasts. Descriptor child nulls have no separate guard, and blob_uri is not inspected. Lease shape requires1<=start<end, independently of descriptor content. (rust/lance-file/src/concat.rs:304-314; rust/lance-file/src/concat.rs:379-457; rust/lance-core/src/datatypes.rs:601-649)

Struct validity intersects row selection; List/LargeList expand only selected valid parents into child offset ranges. Other containers receive no recursive branch here. A malformed Arrow array/selection can panic through indexing/casts; this function relies on typed decoded arrays. Whole leases are checked for overlap even for non-Blob parts that merely carry unused ranges. (rust/lance-file/src/concat.rs:458-511; rust/lance-file/src/concat.rs:1165-1183; rust/lance-file/src/concat.rs:1519-1556)

## Copying, memory and failure lifecycle

Inputs and physical columns are processed sequentially. Consecutive complete pages are batched by summed payload bytes; the default16MiB threshold is soft because the first page is admitted even when larger. Zero-length buffers consume no read result but still call the writer's empty external-buffer path. Offsets and sums use checked arithmetic; actual range<=EOF is delegated to IO. The scheduler may coalesce/split requests internally, so one submit_request is not a proven single backend read. (rust/lance-file/src/concat.rs:540-556; rust/lance-file/src/concat.rs:808-905)

Each positive buffer response must match its recorded length exactly. New PageInfo preserves rows and encoding, replaces physical offsets and checked-adds prior input row count to priority. Priority overflow and extra-response errors occur after potential writes. Metadata for all inputs and all output pages is retained even though payload reads are batched. (rust/lance-file/src/concat.rs:906-928; rust/lance-file/src/concat.rs:950-1024; rust/lance-file/src/concat.rs:1096-1130)

V2_0 structural header columns copy only until output pages exist, then normalize the first header page to total rows,priority0 and truncate to one. Other current versions copy every column and need no final page adjustment. Column-level encoding comes from the first input. An empty external-buffer write aligns the schema descriptor before initialize_with_external_columns and normal finish. (rust/lance-file/src/concat.rs:975-1034; rust/lance-file/src/versions/mod.rs:230-276; rust/lance-file/src/versions/v2_0/mod.rs:84-132)

The explicit abort runs only for errors inside the copy/finalize/finish async block. Factory and lazy-writer-construction failures occur before that block; cancellation does not reach its error match. Abort returns no Result at this boundary, so no successful deletion/durable rollback is established. A reused or unsupported result never invokes the output factory. Source and output object identity separation is not checked here. (rust/lance-file/src/concat.rs:955-969; rust/lance-file/src/concat.rs:1038-1048; rust/lance-file/src/writer.rs:261-269)

## Dependencies and caller seam

Core supplies Schema/Field/Blob conventions, errors and cache; Arrow arrays expose descriptor/null/offset structure; lance-encoding provides normalized ColumnInfo/PageInfo and decoder plugins; lance-io provides schedulers, row selectors and writer trait; prost/prost-types provide exact encoding comparison. The std ordered collections make field-ID maps and lease/schema reconstruction deterministic locally, while futures drives concurrent metadata reads and streaming descriptors. No new feature flag or environment variable is defined. (rust/lance-file/src/concat.rs:10-37; rust/lance-file/src/concat.rs:316-377; rust/lance-file/src/concat.rs:693-725; rust/lance-file/src/concat.rs:1096-1101)

A narrowly inspected Dataset wrapper opens all parts, derives target path/store/ID, calls concat with default options, treats Reused as Internal, maps version/schema/other unsupported reasons to distinct errors and returns DataFile with output size. Its loader checks stored size before opening parts with expected rows and lease; its target ID builder uses base:id or primary plus filename. These are observed integration snippets, not full Dataset authority/recovery analysis. (rust/lance/src/dataset/write.rs:283-346; rust/lance/src/dataset/data_file_part.rs:104-129; rust/lance/src/dataset/data_file.rs:125-136)

## Tests and evidence limits

| Test | Exact oracle and limits |
|---|---|
| concat_writes_relocated_metadata_and_reuses_single_input | V2_1 Written5rows,factory1,reopened5rows,two pages,increasing priorities; reuse index0/factory0. No decoded-value equality. |
| concat_preserves_schema_metadata | V2_0/1/2/3 Written and review-key retained; helper expected4rows is not checked by direct metadata read. |
| unsupported_does_not_create_output | MixedV2_1/V2_2 rejects input1 and factory0. |
| legacy_input_is_unsupported_without_creating_output | Checked-in v1 bytes produce LegacyVersion/factory0, before supplied expected rows0. |
| incompatible_column_buffers_and_incomplete_metadata_are_rejected | In-memory ColumnInfo buffer gives exact reason; missing columns and wrong normalized rows give CorruptFile/message substrings. |
| data_file_parts_reject_overlapping_blob_leases_before_output | Non-Blob parts with overlapping leases report both ranges and factory0. |
| missing_and_corrupt_inputs_are_errors_without_output | Deleted input gives Err/factory0; corrupt bytes give only Err and error-returning factory, which does not prove zero calls. |

Fixtures and assertions are at rust/lance-file/src/concat.rs:1211-1600. This file has no decoded payload equality, Blob descriptor/container/null matrix, short/extra IO, zero-threshold, overflow, single-part rewrite or cancellation/abort regression. Other Dataset tests exist but are not yet fully analyzed. [Full L2 evidence](../L2-files/rust/lance-file/src/concat.rs.md).

## Exact production declarations

Visibility is lexical: private fields remain inaccessible even inside public types; enum variant fields follow the owning public enum. The one anonymous callback label is descriptive, not a Rust item name.

| Symbol | Declaration | Visibility | Evidence |
|---|---|---|---|
| `lance_file::concat::BlobTargetId` | `pub struct BlobTargetId(Arc<str>);` | pub | rust/lance-file/src/concat.rs:46-46 |
| `lance_file::concat::BlobTargetId::0` | `pub struct BlobTargetId(Arc<str>);` | private | rust/lance-file/src/concat.rs:46-46 |
| `lance_file::concat::BlobTargetId::new` | `pub fn new(identity: impl Into<Arc<str>>) -> Self {` | pub | rust/lance-file/src/concat.rs:50-50 |
| `lance_file::concat::BlobTargetId::as_str` | `pub fn as_str(&self) -> &str {` | pub | rust/lance-file/src/concat.rs:55-55 |
| `lance_file::concat::EncodedFileInput` | `pub struct EncodedFileInput {` | pub | rust/lance-file/src/concat.rs:62-62 |
| `lance_file::concat::EncodedFileInput::scheduler` | `scheduler: FileScheduler,` | private | rust/lance-file/src/concat.rs:63-63 |
| `lance_file::concat::EncodedFileInput::expected_num_rows` | `expected_num_rows: Option<u64>,` | private | rust/lance-file/src/concat.rs:64-64 |
| `lance_file::concat::EncodedFileInput::new` | `pub fn new(scheduler: FileScheduler) -> Self {` | pub | rust/lance-file/src/concat.rs:69-69 |
| `lance_file::concat::EncodedFileInput::with_expected_num_rows` | `pub fn with_expected_num_rows(mut self, expected_num_rows: u64) -> Self {` | pub | rust/lance-file/src/concat.rs:79-79 |
| `lance_file::concat::EncodedFileInput::path` | `pub fn path(&self) -> &object_store::path::Path {` | pub | rust/lance-file/src/concat.rs:85-85 |
| `lance_file::concat::EncodedFileInput::scheduler` | `fn scheduler(&self) -> FileScheduler {` | private | rust/lance-file/src/concat.rs:89-89 |
| `lance_file::concat::DataFilePart` | `pub struct DataFilePart {` | pub | rust/lance-file/src/concat.rs:121-121 |
| `lance_file::concat::DataFilePart::input` | `input: EncodedFileInput,` | private | rust/lance-file/src/concat.rs:122-122 |
| `lance_file::concat::DataFilePart::metadata` | `metadata: Arc<CachedFileMetadata>,` | private | rust/lance-file/src/concat.rs:123-123 |
| `lance_file::concat::DataFilePart::schema` | `schema: Arc<Schema>,` | private | rust/lance-file/src/concat.rs:124-124 |
| `lance_file::concat::DataFilePart::blob_ids` | `blob_ids: Option<Range<u32>>,` | private | rust/lance-file/src/concat.rs:125-125 |
| `lance_file::concat::DataFilePart::blob_target_id` | `blob_target_id: Option<BlobTargetId>,` | private | rust/lance-file/src/concat.rs:126-126 |
| `lance_file::concat::<DataFilePart as fmt::Debug>::fmt` | `fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {` | trait implementation | rust/lance-file/src/concat.rs:130-130 |
| `lance_file::concat::DataFilePart::open` | `pub async fn open(         input: EncodedFileInput,         blob_ids: Option<Range<u32>>,         blob_target_id: Option<BlobTargetId>,     ) -> Result<Self> {` | pub | rust/lance-file/src/concat.rs:152-156 |
| `lance_file::concat::DataFilePart::num_rows` | `pub fn num_rows(&self) -> u64 {` | pub | rust/lance-file/src/concat.rs:228-228 |
| `lance_file::concat::descriptor_projection_schema` | `fn descriptor_projection_schema(schema: &Schema) -> Schema {` | private | rust/lance-file/src/concat.rs:233-233 |
| `lance_file::concat::descriptor_child_matches` | `fn descriptor_child_matches(field: &Field, expected: &Field) -> bool {` | private | rust/lance-file/src/concat.rs:243-243 |
| `lance_file::concat::attach_blob_descriptor_children` | `fn attach_blob_descriptor_children(     fields: &mut [Field],     descriptor_children: &mut VecDeque<Vec<Field>>, ) {` | private | rust/lance-file/src/concat.rs:251-254 |
| `lance_file::concat::normalize_blob_footer_schema` | `fn normalize_blob_footer_schema(schema: &Schema) -> Schema {` | private | rust/lance-file/src/concat.rs:270-270 |
| `lance_file::concat::validate_blob_id_range` | `fn validate_blob_id_range(blob_ids: Option<&Range<u32>>) -> Result<()> {` | private | rust/lance-file/src/concat.rs:304-304 |
| `lance_file::concat::validate_blob_descriptors` | `async fn validate_blob_descriptors(     input: &EncodedFileInput,     metadata: &CachedFileMetadata,     schema: &Schema,     blob_ids: Option<&Range<u32>>, ) -> Result<()> {` | private | rust/lance-file/src/concat.rs:316-321 |
| `lance_file::concat::validate_blob_field` | `fn validate_blob_field(     field: &ArrowField,     array: &ArrayRef,     selected: &[bool],     blob_ids: Option<&Range<u32>>,     path: &object_store::path::Path, ) -> Result<()> {` | private | rust/lance-file/src/concat.rs:379-385 |
| `lance_file::concat::FileConcatTarget` | `pub struct FileConcatTarget {` | pub | rust/lance-file/src/concat.rs:515-515 |
| `lance_file::concat::FileConcatTarget::version` | `pub version: ConcreteFileVersion,` | pub | rust/lance-file/src/concat.rs:517-517 |
| `lance_file::concat::FileConcatTarget::schema` | `pub schema: Arc<Schema>,` | pub | rust/lance-file/src/concat.rs:519-519 |
| `lance_file::concat::FileConcatTarget::blob_target_id` | `blob_target_id: Option<BlobTargetId>,` | private | rust/lance-file/src/concat.rs:520-520 |
| `lance_file::concat::FileConcatTarget::new` | `pub fn new(version: ConcreteFileVersion, schema: Arc<Schema>) -> Self {` | pub | rust/lance-file/src/concat.rs:525-525 |
| `lance_file::concat::FileConcatTarget::with_blob_target_id` | `pub fn with_blob_target_id(mut self, blob_target_id: BlobTargetId) -> Self {` | pub | rust/lance-file/src/concat.rs:534-534 |
| `lance_file::concat::FileConcatOptions` | `pub struct FileConcatOptions {` | pub | rust/lance-file/src/concat.rs:542-542 |
| `lance_file::concat::FileConcatOptions::read_batch_bytes` | `pub read_batch_bytes: usize,` | pub | rust/lance-file/src/concat.rs:544-544 |
| `lance_file::concat::FileConcatOptions::writer_options` | `pub writer_options: FileWriterOptions,` | pub | rust/lance-file/src/concat.rs:546-546 |
| `lance_file::concat::<FileConcatOptions as Default>::default` | `fn default() -> Self {` | trait implementation | rust/lance-file/src/concat.rs:550-550 |
| `lance_file::concat::FileConcatOutput` | `pub struct FileConcatOutput {` | pub | rust/lance-file/src/concat.rs:560-560 |
| `lance_file::concat::FileConcatOutput::version` | `pub version: ConcreteFileVersion,` | pub | rust/lance-file/src/concat.rs:562-562 |
| `lance_file::concat::FileConcatOutput::num_rows` | `pub num_rows: u64,` | pub | rust/lance-file/src/concat.rs:564-564 |
| `lance_file::concat::FileConcatOutput::size_bytes` | `pub size_bytes: u64,` | pub | rust/lance-file/src/concat.rs:566-566 |
| `lance_file::concat::FileConcatReason` | `pub enum FileConcatReason {` | pub | rust/lance-file/src/concat.rs:571-571 |
| `lance_file::concat::FileConcatReason::LegacyVersion` | `LegacyVersion,` | public via enum | rust/lance-file/src/concat.rs:573-573 |
| `lance_file::concat::FileConcatReason::VersionMismatch` | `VersionMismatch {         /// Zero-based input position.         input_index: usize,         /// Version found in the file footer.         actual: ConcreteFileVersion,         /// Version requested by the target.         expected: ConcreteFileVersion,     },` | public via enum | rust/lance-file/src/concat.rs:575-582 |
| `lance_file::concat::FileConcatReason::VersionMismatch::input_index` | `input_index: usize,` | public via enum variant | rust/lance-file/src/concat.rs:577-577 |
| `lance_file::concat::FileConcatReason::VersionMismatch::actual` | `actual: ConcreteFileVersion,` | public via enum variant | rust/lance-file/src/concat.rs:579-579 |
| `lance_file::concat::FileConcatReason::VersionMismatch::expected` | `expected: ConcreteFileVersion,` | public via enum variant | rust/lance-file/src/concat.rs:581-581 |
| `lance_file::concat::FileConcatReason::SchemaMismatch` | `SchemaMismatch {         /// Zero-based input position.         input_index: usize,     },` | public via enum | rust/lance-file/src/concat.rs:584-587 |
| `lance_file::concat::FileConcatReason::SchemaMismatch::input_index` | `input_index: usize,` | public via enum variant | rust/lance-file/src/concat.rs:586-586 |
| `lance_file::concat::FileConcatReason::ColumnLayoutMismatch` | `ColumnLayoutMismatch {         /// Zero-based input position.         input_index: usize,         /// Zero-based physical column when one could be identified.         column_index: Option<usize>,     },` | public via enum | rust/lance-file/src/concat.rs:589-594 |
| `lance_file::concat::FileConcatReason::ColumnLayoutMismatch::input_index` | `input_index: usize,` | public via enum variant | rust/lance-file/src/concat.rs:591-591 |
| `lance_file::concat::FileConcatReason::ColumnLayoutMismatch::column_index` | `column_index: Option<usize>,` | public via enum variant | rust/lance-file/src/concat.rs:593-593 |
| `lance_file::concat::FileConcatReason::ColumnEncodingMismatch` | `ColumnEncodingMismatch {         /// Zero-based input position.         input_index: usize,         /// Zero-based physical column.         column_index: usize,     },` | public via enum | rust/lance-file/src/concat.rs:596-601 |
| `lance_file::concat::FileConcatReason::ColumnEncodingMismatch::input_index` | `input_index: usize,` | public via enum variant | rust/lance-file/src/concat.rs:598-598 |
| `lance_file::concat::FileConcatReason::ColumnEncodingMismatch::column_index` | `column_index: usize,` | public via enum variant | rust/lance-file/src/concat.rs:600-600 |
| `lance_file::concat::FileConcatReason::ColumnBuffers` | `ColumnBuffers {         /// Zero-based input position.         input_index: usize,         /// Zero-based physical column.         column_index: usize,         /// Number of column buffers referenced by the column metadata.         count: usize,     },` | public via enum | rust/lance-file/src/concat.rs:603-610 |
| `lance_file::concat::FileConcatReason::ColumnBuffers::input_index` | `input_index: usize,` | public via enum variant | rust/lance-file/src/concat.rs:605-605 |
| `lance_file::concat::FileConcatReason::ColumnBuffers::column_index` | `column_index: usize,` | public via enum variant | rust/lance-file/src/concat.rs:607-607 |
| `lance_file::concat::FileConcatReason::ColumnBuffers::count` | `count: usize,` | public via enum variant | rust/lance-file/src/concat.rs:609-609 |
| `lance_file::concat::FileConcatReason::ExtraGlobalBuffers` | `ExtraGlobalBuffers {         /// Zero-based input position.         input_index: usize,         /// Number of global buffers, including the schema descriptor.         count: usize,     },` | public via enum | rust/lance-file/src/concat.rs:612-617 |
| `lance_file::concat::FileConcatReason::ExtraGlobalBuffers::input_index` | `input_index: usize,` | public via enum variant | rust/lance-file/src/concat.rs:614-614 |
| `lance_file::concat::FileConcatReason::ExtraGlobalBuffers::count` | `count: usize,` | public via enum variant | rust/lance-file/src/concat.rs:616-616 |
| `lance_file::concat::FileConcatReason::BlobColumns` | `BlobColumns,` | public via enum | rust/lance-file/src/concat.rs:619-619 |
| `lance_file::concat::<FileConcatReason as fmt::Display>::fmt` | `fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {` | trait implementation | rust/lance-file/src/concat.rs:623-623 |
| `lance_file::concat::FileConcatResult` | `pub enum FileConcatResult {` | pub | rust/lance-file/src/concat.rs:678-678 |
| `lance_file::concat::FileConcatResult::Written` | `Written(FileConcatOutput),` | public via enum | rust/lance-file/src/concat.rs:680-680 |
| `lance_file::concat::FileConcatResult::Reused` | `Reused(usize, FileConcatOutput),` | public via enum | rust/lance-file/src/concat.rs:682-682 |
| `lance_file::concat::FileConcatResult::Unsupported` | `Unsupported(FileConcatReason),` | public via enum | rust/lance-file/src/concat.rs:684-684 |
| `lance_file::concat::PreparedInput` | `struct PreparedInput<'a> {` | private | rust/lance-file/src/concat.rs:687-687 |
| `lance_file::concat::PreparedInput::input` | `input: &'a EncodedFileInput,` | private | rust/lance-file/src/concat.rs:688-688 |
| `lance_file::concat::PreparedInput::metadata` | `metadata: &'a CachedFileMetadata,` | private | rust/lance-file/src/concat.rs:689-689 |
| `lance_file::concat::PreparedInput::schema` | `schema: &'a Schema,` | private | rust/lance-file/src/concat.rs:690-690 |
| `lance_file::concat::encoded_column_encoding` | `fn encoded_column_encoding(column: &ColumnInfo) -> Result<Vec<u8>> {` | private | rust/lance-file/src/concat.rs:693-693 |
| `lance_file::concat::check_compatibility` | `fn check_compatibility(     target: &FileConcatTarget,     inputs: &[PreparedInput<'_>],     allow_blob_columns: bool, ) -> Result<Option<FileConcatReason>> {` | private | rust/lance-file/src/concat.rs:697-701 |
| `lance_file::concat::copy_page_buffers` | `async fn copy_page_buffers(     writer: &mut crate::writer::FileWriter,     scheduler: &FileScheduler,     pages: &[PageInfo],     read_batch_bytes: u64,     input_index: usize,     column_index: usize,     row_offset: u64, ) -> Result<Vec<PageInfo>> {` | private | rust/lance-file/src/concat.rs:808-816 |
| `lance_file::concat::concat_prepared` | `async fn concat_prepared<Factory, FactoryFuture>(     target: &FileConcatTarget,     prepared: &[PreparedInput<'_>],     allow_blob_columns: bool,     reuse_single_input: bool,     output_factory: Factory,     options: FileConcatOptions, ) -> Result<FileConcatResult> where     Factory: FnOnce() -> FactoryFuture,     FactoryFuture: Future<Output = Result<Box<dyn ObjectWriter>>>, {` | private | rust/lance-file/src/concat.rs:929-940 |
| `lance_file::concat::concat_prepared::<copy callback at line 971>` | `\|\| async {` | private lexical closure; descriptive name, not a Rust item | rust/lance-file/src/concat.rs:984-984 |
| `lance_file::concat::concat_files` | `pub async fn concat_files<Factory, FactoryFuture>(     target: &FileConcatTarget,     ordered_inputs: &[EncodedFileInput],     output_factory: Factory,     options: FileConcatOptions, ) -> Result<FileConcatResult> where     Factory: FnOnce() -> FactoryFuture,     FactoryFuture: Future<Output = Result<Box<dyn ObjectWriter>>>, {` | pub | rust/lance-file/src/concat.rs:1081-1090 |
| `lance_file::concat::concat_data_file_parts` | `pub async fn concat_data_file_parts<Factory, FactoryFuture>(     target: &FileConcatTarget,     ordered_parts: &[DataFilePart],     output_factory: Factory,     options: FileConcatOptions, ) -> Result<FileConcatResult> where     Factory: FnOnce() -> FactoryFuture,     FactoryFuture: Future<Output = Result<Box<dyn ObjectWriter>>>, {` | pub | rust/lance-file/src/concat.rs:1141-1150 |
