> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# File writer test contracts and their limits

All 1,976 physical lines of writer_tests.rs are analyzed: 27 named tests, 10 function helpers, four significant local closures and the private nested module. Tests were read, not run. This is a test-contract catalog; shared-reader analysis is now in the [shared reader supplement](../rust-lance-file-shared-reader.md), while underlying encoder/decoder algorithms and runtime qualification remain pending. Parent writer.rs loads this file as writer_tests, and the file adds its own cfg(test) tests module. (rust/lance-file/src/writer_tests.rs:1-44; rust/lance-file/src/writer.rs:292-294)

[Crate](../rust-lance-file.md) · [V2_0 writer and compatibility](../rust-lance-file-v20-compatibility.md) · [Structural writers](../rust-lance-file-structural-writer.md) · [Reader grammar](../rust-lance-file-readers.md) · [Full L2](../../L2-files/rust/lance-file/src/writer_tests.rs.md) · [Orientation](../../L0-orientation.md) · [Contracts](../../L3-symbols/behavior-contracts.md) · [Tests](../../L4-crosscutting/build-and-test.md)

## Local dependencies and execution shape

Private factory wrappers choose exact writers/projections and V2_1 compression construction. FsFixture supplies local paths/stores/schedulers; most reopens use unknown size, no cache, default plugins and options. read_int32_column fully collects a projected stream at batch size 1,024 and readahead 16, then allocates nullable value vectors. The spill helper retains all input and decoded output, so these utilities are not streaming memory-bound examples. (rust/lance-file/src/writer_tests.rs:45-71; rust/lance-file/src/writer_tests.rs:155-188; rust/lance-file/src/writer_tests.rs:1916-1945)

Tokio tests run async IO; the blocking projection test explicitly uses spawn_blocking around the blocking reader. rstest expands only the declared matrices. Panics/unwraps are test failure mechanisms. FieldTypeMismatch helper checks InvalidInput plus a downcast source; many other rejection tests inspect only strings or is_err. No production extension trait is declared in this file. (rust/lance-file/src/writer_tests.rs:554-621; rust/lance-file/src/writer_tests.rs:1084-1176)

## Per-test matrix

| Named test | Exact versions or cases | Actual oracle |
|---|---|---|
| basic_write | V2_1 | Ten 1,000-row score batches, metadata added, finish succeeds; no read assertion |
| negative_dictionary_values_with_runt_tail | V2_1, V2_2, V2_3 | 9,216 deterministic signed values roundtrip exactly; chosen encoding not asserted |
| write_empty | V2_1 | Explicit schema and zero generated batches finish; no read or row-count check |
| write_columns_unequal_lengths | V2_0, V2_1 | a=5,b=1,c=0; empty append no-op; max summary5; exact separate reads/take |
| read_unequal_length_projection | V2_0, V2_1 | Equal roots scan; unequal roots reject even common prefix; bounds use selected root |
| read_nested_columns_under_validation | V2_0, V2_1 | Three nested projections each return3 rows; no value check |
| write_column_validation_errors | V2_1 | Uninitialized lazy, index5 of2, nonnullable null produce matching error text |
| writer_rejects_unconverted_arrow_json | Four V2 versions x top-level/struct | Structured type/extension mismatch, field path, finish retains one accepted row |
| write_column_rejects_mismatched_type | Four V2 versions | Bare Utf8 rejected against JSONB, with no actual extension |
| v2_0_writer_atomically_rejects_reordered_null_structs | V2_0 | InvalidInput and message; recovered id read contains only4,5,6 |
| v2_0_writer_validates_logical_list_structs | Four slice/null cases | Three acceptance cases finish; selected null struct rejects |
| v2_0_writer_validates_logical_fixed_size_list_structs | Three mask/nullability cases | Masked nulls accepted, selected null struct rejected; width1 only |
| v2_0_encoding_strategy_rejects_null_structs | Ordinary/packed x three entry paths | Direct BatchEncoder/factory and encode_batch all reject |
| v2_0_primitive_fsl_preparation_reuses_array | Float32 width2 with parent null | prepare_array returns pointer-identical Arc |
| blocking_read_unequal_length | V2_0, V2_1 | Short projection yields one row; unequal constructor returns error |
| write_batch_keeps_equal_lengths | V2_1 | Summary3 and both metadata column counts3; no value decode |
| max_page_bytes_enforced | V2_0, explicit1MiB | Every page buffer-size sum<=1MiB; exactly8 pages |
| zero_max_page_bytes_rejected | V2_0 generic eager/lazy | InvalidInput with exact zero-limit message; lazy failure on first batch |
| v2_0_writer_rejects_zero_max_page_bytes | Direct V2_0 eager | Same structured zero-limit oracle |
| v2_1_lazy_writer_rejects_zero_max_page_bytes | Direct V2_1 lazy | Same oracle on first batch |
| max_page_bytes_env_var | V2_1, env2MiB | Existing page sums<=2MiB; no page-count assertion |
| compression_overrides_end_to_end | V2_1 wildcard *_id | Metadata/version and first-page RLE descriptions; no data decode or baseline comparison |
| field_metadata_compression | V2_1, text zstd6/data none | First-page Zstd and Flat/compression: None descriptions; level6 not asserted |
| field_metadata_rle_threshold | V2_1, threshold0.9/lz4/BSS off | First-page RLE description only |
| large_page_split_on_read | V2_1,128MiB cap/10MiB read chunk | Two values, one batch, full40MiB byte check and actual file-size equality |
| page_metadata_spill_roundtrip | V2_1,20 or50 batches x2 columns x100 rows | Decoded output equals a separate current-code unspilled baseline |
| page_metadata_spill_many_columns | V2_1,10x500x100 | Same baseline equality; no flush-threshold instrumentation |

Matrix evidence: smoke/dictionary rust/lance-file/src/writer_tests.rs:72-154; unequal/nested rust/lance-file/src/writer_tests.rs:190-553; validation/JSON rust/lance-file/src/writer_tests.rs:554-719; V2_0 null/preparation rust/lance-file/src/writer_tests.rs:731-1083; blocking/rectangular rust/lance-file/src/writer_tests.rs:1084-1225; limits rust/lance-file/src/writer_tests.rs:1226-1447; compression rust/lance-file/src/writer_tests.rs:1448-1793; large reads/spill rust/lance-file/src/writer_tests.rs:1794-1976. RowCount in the smoke generator is per batch, confirmed by rust/lance-datagen/src/generator.rs:2360-2373.

## Projection semantics and contradictory prose

The unequal projection fixture has a/b length5 and c length1. [a,b] full scan returns exact values; [a,c] rejects both RangeFull and Range(0..1), while single-root full/open-ended ranges use that root's own length. The introductory comment that a common bounded range is valid contradicts the explicit assertion. The async helper merges opening and collection errors, so it cannot prove the comment's before-any-batch timing. The blocking test calls is_err on the reader constructor directly and does establish constructor rejection for its full-scan case. (rust/lance-file/src/writer_tests.rs:297-448; rust/lance-file/src/writer_tests.rs:1136-1176)

Nested fixture a/s/list has three roots rows, while list values contain six items. Three projections assert only total row count3. This protects against one physical-column partition error but is not a nested value/null roundtrip. The ordinary write_batch test similarly observes equal metadata counts, not released-file compatibility despite its comment. (rust/lance-file/src/writer_tests.rs:450-553; rust/lance-file/src/writer_tests.rs:1178-1225)

## Preflight and error-state contracts

JSON tests deliberately write a valid JSONB batch before rejecting an Arrow-JSON text batch, exercising a changed schema after cache acceptance. Structured mismatch includes j or s.j, LargeBinary/Lance JSON versus Utf8/Arrow JSON; a bare array carries no extension. Remaining summary length1 is a state oracle, not direct observation of every encoder. (rust/lance-file/src/writer_tests.rs:622-719)

The reordered V2_0 fixture uses writer order[id,s] and batch order[s,id]. A null struct rejects before later valid data is written; the persisted id column must contain only4,5,6. Separate list/FSL cases distinguish selected null structs from unreachable backing slots or children under null parents. These cases check rejection/finish, not successful decoded list values. Direct encoder/factory and encode_batch cases protect access outside FileWriter for both packed and ordinary structs. Primitive Float32 FSL preparation separately requires Arc pointer reuse. (rust/lance-file/src/writer_tests.rs:731-1083)

These narrow recovery oracles do not establish transactional rollback after page IO failure, repeated finish, abort, external metadata initialization, late spill setup or cancellation. No such injected case occurs among the complete tests cataloged above. (rust/lance-file/src/writer_tests.rs:1-1976)

## Resource limits and unsafe environment mutation

Explicit1MiB V2_0 test writes one million UInt64 values and requires exactly8 metadata pages with recorded buffer-size sums<=1MiB. This sum does not include padding/metadata/global buffers and is not a universal cap across arbitrary indivisible values. Zero option rejection covers generic V2_0 eager/lazy, direct V2_0 eager and direct V2_1 lazy; environment zero is absent. (rust/lance-file/src/writer_tests.rs:1226-1381)

The environment fixture uses two unsafe set_var calls under a current-thread runtime. It saves no original value, has no process-wide lock or safety rationale, and resets to an empty string only after all awaits/assertions succeed. Runtime flavor alone does not serialize other tests in the same process; panic/cancellation can leave the configured value. The final empty string is not restoration/removal. This is a source-derived test-isolation concern, not an observed failure. Raw input sizes labeled8MiB/4MiB in comments are actually8,000,000/4,000,000 bytes. (rust/lance-file/src/writer_tests.rs:1226-1241; rust/lance-file/src/writer_tests.rs:1382-1447)

The40MiB binary test verifies every byte after a10MiB read-chunk configuration, but never counts IO requests. Its one output batch must not be confused with one IO chunk. Spill cases use default writer cache/page budgets and do not assert a mid-write sidecar flush; many-column comments state intent only. Baseline equality can miss bugs shared by both write modes. (rust/lance-file/src/writer_tests.rs:1794-1976)

## Compression evidence boundaries

Override test contains deterministic quantity values and short repetitive descriptions despite comments describing random/long input. Only *_id receives RLE threshold0.5/BSS Off. A file called no_compression actually uses default compression policy and is never read/compared. Both ID first pages must describe RLE; metadata and version are checked, but decoded values, compression ratios and all-page choices are not. (rust/lance-file/src/writer_tests.rs:1448-1619)

Field metadata tests inspect first-page description strings for Zstd, Flat/compression: None and RLE. They do not assert level6, Lz4 payload use, threshold boundaries or decompressed value equality. Keep those distinct from negative-dictionary and large-binary tests, which compare values. (rust/lance-file/src/writer_tests.rs:1620-1793; rust/lance-file/src/writer_tests.rs:101-125; rust/lance-file/src/writer_tests.rs:1877-1890)

## Exact private declarations

All entries below are cfg(test) private declarations; no public API is added by this file. Complete behavior and local calls are in the linked L2 and machine-readable symbol catalog.

| Symbol | Kind | Literal declaration | L2 evidence |
|---|---|---|---|
| `lance_file::writer::writer_tests::tests` | module | `mod tests {` | [5-5](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::create_writer` | helper function | `fn create_writer(         object_writer: Box<dyn Writer>,         schema: LanceSchema,         version: ConcreteFileVersion,         options: FileWriterOptions,     ) -> lance_core::Result<FileWriter> {` | [45-50](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::create_v2_1_writer_with_compression` | helper function | `fn create_v2_1_writer_with_compression(         object_writer: Box<dyn Writer>,         schema: LanceSchema,         options: FileWriterOptions,         compression: CompressionParams,     ) -> lance_core::Result<FileWriter> {` | [54-59](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::reader_projection_from_column_names` | helper function | `fn reader_projection_from_column_names(         version: ConcreteFileVersion,         schema: &LanceSchema,         column_names: &[&str],     ) -> lance_core::Result<ReaderProjection> {` | [64-68](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_basic_write` | test function | `async fn test_basic_write() {` | [73-73](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_negative_dictionary_values_with_runt_tail` | test function | `async fn test_negative_dictionary_values_with_runt_tail(#[case] version: ConcreteFileVersion) {` | [107-107](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_write_empty` | test function | `async fn test_write_empty() {` | [127-127](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::read_int32_column` | async helper | `async fn read_int32_column(         reader: &FileReader,         schema: &LanceSchema,         version: ConcreteFileVersion,         name: &str,         params: lance_io::ReadBatchParams,     ) -> Vec<Option<i32>> {` | [159-165](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_write_columns_unequal_lengths` | test function | `async fn test_write_columns_unequal_lengths(         #[values(ConcreteFileVersion::V2_0, ConcreteFileVersion::V2_1)]         version: ConcreteFileVersion,     ) {` | [195-198](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_read_unequal_length_projection` | test function | `async fn test_read_unequal_length_projection(         #[values(ConcreteFileVersion::V2_0, ConcreteFileVersion::V2_1)]         version: ConcreteFileVersion,     ) {` | [306-309](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_read_nested_columns_under_validation` | test function | `async fn test_read_nested_columns_under_validation(         #[values(ConcreteFileVersion::V2_0, ConcreteFileVersion::V2_1)]         version: ConcreteFileVersion,     ) {` | [457-460](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_write_column_validation_errors` | test function | `async fn test_write_column_validation_errors() {` | [558-558](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::field_type_mismatch` | helper function | `fn field_type_mismatch(error: lance_core::Error) -> FieldTypeMismatch {` | [612-612](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_writer_rejects_unconverted_arrow_json` | test function | `async fn test_writer_rejects_unconverted_arrow_json(         #[case] nested: bool,         #[values(             ConcreteFileVersion::V2_0,             ConcreteFileVersion::V2_1,             ConcreteFileVersion::V2_2,             ConcreteFileVersion::V2_3         )]         version: ConcreteFileVersion,     ) {` | [628-637](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_write_column_rejects_mismatched_type` | test function | `async fn test_write_column_rejects_mismatched_type(         #[values(             ConcreteFileVersion::V2_0,             ConcreteFileVersion::V2_1,             ConcreteFileVersion::V2_2,             ConcreteFileVersion::V2_3         )]         version: ConcreteFileVersion,     ) {` | [692-700](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::struct_array` | helper function | `fn struct_array(fields: ArrowFields, nulls: Option<NullBuffer>) -> StructArray {` | [720-720](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_v2_0_writer_atomically_rejects_reordered_null_structs` | test function | `async fn test_v2_0_writer_atomically_rejects_reordered_null_structs() {` | [734-734](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_v2_0_writer_validates_logical_list_structs` | test function | `async fn test_v2_0_writer_validates_logical_list_structs(         #[case] offset: usize,         #[case] len: usize,         #[case] has_null_list: bool,         #[case] should_succeed: bool,     ) {` | [825-830](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_v2_0_writer_validates_logical_fixed_size_list_structs` | test function | `async fn test_v2_0_writer_validates_logical_fixed_size_list_structs(         #[case] mask_child_null: bool,         #[case] has_non_nullable_child_null: bool,         #[case] should_succeed: bool,     ) {` | [891-895](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_v2_0_encoding_strategy_rejects_null_structs` | test function | `async fn test_v2_0_encoding_strategy_rejects_null_structs(#[case] is_packed: bool) {` | [960-960](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_v2_0_primitive_fsl_preparation_reuses_array` | test function | `fn test_v2_0_primitive_fsl_preparation_reuses_array() {` | [1052-1052](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_blocking_read_unequal_length` | test function | `async fn test_blocking_read_unequal_length(         #[values(ConcreteFileVersion::V2_0, ConcreteFileVersion::V2_1)]         version: ConcreteFileVersion,     ) {` | [1089-1092](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_write_batch_keeps_equal_lengths` | test function | `async fn test_write_batch_keeps_equal_lengths() {` | [1181-1181](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_max_page_bytes_enforced` | test function | `async fn test_max_page_bytes_enforced() {` | [1227-1227](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::assert_zero_max_page_bytes_error` | helper function | `fn assert_zero_max_page_bytes_error(error: lance_core::Error) {` | [1298-1298](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_zero_max_page_bytes_rejected` | test function | `async fn test_zero_max_page_bytes_rejected(#[case] lazy: bool) {` | [1314-1314](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_v2_0_writer_rejects_zero_max_page_bytes` | test function | `async fn test_v2_0_writer_rejects_zero_max_page_bytes() {` | [1345-1345](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_v2_1_lazy_writer_rejects_zero_max_page_bytes` | test function | `async fn test_v2_1_lazy_writer_rejects_zero_max_page_bytes() {` | [1367-1367](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_max_page_bytes_env_var` | test function | `async fn test_max_page_bytes_env_var() {` | [1383-1383](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_compression_overrides_end_to_end` | test function | `async fn test_compression_overrides_end_to_end() {` | [1449-1449](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_field_metadata_compression` | test function | `async fn test_field_metadata_compression() {` | [1621-1621](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_field_metadata_rle_threshold` | test function | `async fn test_field_metadata_rle_threshold() {` | [1717-1717](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_large_page_split_on_read` | test function | `async fn test_large_page_split_on_read() {` | [1795-1795](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::spill_config` | helper function | `fn spill_config() -> (TempObjFile, Arc<ObjectStore>) {` | [1892-1892](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::make_batches` | helper function | `fn make_batches(num_batches: i32, num_cols: usize, rows_per_batch: i32) -> Vec<RecordBatch> {` | [1897-1897](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::write_and_read_batches` | async helper | `async fn write_and_read_batches(         batches: &[RecordBatch],         spill: Option<(Arc<ObjectStore>, object_store::path::Path)>,     ) -> Vec<RecordBatch> {` | [1916-1919](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_page_metadata_spill_roundtrip` | test function | `async fn test_page_metadata_spill_roundtrip(         #[case] num_batches: i32,         #[case] num_cols: usize,         #[case] rows_per_batch: i32,     ) {` | [1951-1955](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_page_metadata_spill_many_columns` | test function | `async fn test_page_metadata_spill_many_columns() {` | [1966-1966](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_read_unequal_length_projection::read` | local closure | `let read = \|names: &'static [&'static str], params: ReadBatchParams\| {` | [358-358](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_read_unequal_length_projection::col_values` | local closure | `let col_values = \|batches: &[RecordBatch], idx: usize\| -> Vec<Option<i32>> {` | [377-377](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_writer_rejects_unconverted_arrow_json::in_struct` | local closure | `let in_struct = \|field: ArrowField\| {` | [644-644](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
| `lance_file::writer::writer_tests::tests::test_writer_rejects_unconverted_arrow_json::batch_of` | local closure | `let batch_of = \|field: ArrowField, values: ArrayRef\| {` | [652-652](../../L2-files/rust/lance-file/src/writer_tests.rs.md) |
