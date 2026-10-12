> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

> Refreshed 2026-10-04 against `ad12ed9e15e0046688b00568d0ac1a347fb2d328`; changed-source pointers re-anchored. Unchanged analysis retained.

# Frozen V1 statistics reducers and collector

Current production contract: lines 1–931 are byte-identical across this refresh. The original 2,249-line whole-file review, including excluded tests, is historical provenance; current file length is 2,252. No new test coverage is claimed. These are frozen compatibility surfaces; modern statistics features belong in current-format paths. (rust/lance-file/src/versions/v1/writer/statistics.rs:1-931) (AGENTS.md:13-18)

[File crate](rust-lance-file.md) · [V1 writer](rust-lance-file-v1-writer.md) · [L2 statistics](../L2-files/rust/lance-file/src/versions/v1/writer/statistics.rs.md) · [Symbols](../L3-symbols/symbol-index.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Format](../L3-symbols/format-spec.md) · [Testing](../L4-crosscutting/build-and-test.md)

## Responsibility, visibility and dependencies

This synchronous module reduces borrowed Arrow arrays to a StatisticsRow, accumulates rows in per-field builders, and finishes one Arrow RecordBatch. It does not perform IO, serialize pages, schedule tasks, select file versions or enforce writer rollback. Pub declarations are enclosed by private writer::statistics, without a public re-export here. Arrow supplies arrays/builders, DataFusion ScalarValue stores typed bounds, Lance Field/Schema identifies columns, num_traits supplies numeric bounds and Float operations, and BTreeMap orders output by original field ID. (rust/lance-file/src/versions/v1/writer/statistics.rs:6-34) (rust/lance-file/src/versions/v1/writer/statistics.rs:611-670) (rust/lance-file/src/versions/v1/writer/mod.rs:4-4)

## Three separate type boundaries

| Boundary | Accepted types |
|---|---|
| collect_statistics | Boolean; eight integers; Float32/64; Date32/64; valid Time32/64 units; all Timestamp/Duration units; Decimal128; Binary/LargeBinary; Utf8/LargeUtf8; FixedSizeBinary; Dictionary with eight integer key types |
| supports_stats_collection / automatic collector | Boolean; eight integers; Float32/64; Date32/64; Decimal128; Binary/LargeBinary; Utf8/LargeUtf8 |
| StatisticsBuilder::append | Automatic set plus valid Time32/64, Timestamp and Duration; no FixedSizeBinary or Dictionary arm |

The dispatcher panics for an empty outer slice and reaches unreachable for unsupported types, while append uses todo! for unmatched stored dtype. Neither collect_statistics nor StatisticsBuilder::append returns a validation Result for mismatched input arrays or supplied bound scalar types; collector finish separately returns a Result for final batch construction. An empty eligible schema returns None from try_new. Commented list/FixedSizeBinary arms and Decimal256 TODOs are not support. (rust/lance-file/src/versions/v1/writer/statistics.rs:493-609) (rust/lance-file/src/versions/v1/writer/statistics.rs:619-633) (rust/lance-file/src/versions/v1/writer/statistics.rs:869-929)

## Reduction contracts

| Family | No valid ordered values | Ordinary bounds and null counting |
|---|---|---|
| Integers / temporal / Decimal128 | Present native MIN/MAX | Strict native partial comparisons; sum physical array nulls; first dtype carries temporal parameters; Decimal128 first precision/scale |
| Float32/64 | Present -infinity/+infinity | Ignore NaN for extrema without counting it as null; normalize zero minimum to negative zero and maximum to positive zero |
| Boolean | Present false/true | Presence flags; later arrays still add null counts after both values found |
| UTF8 / binary | Typed absent bounds | Lexical prefixes up to64 bytes; optional upper successor when any input was truncated |
| Fixed binary | Absent bounds tagged original width | Prefix payload up to64 bytes but original width retained in both scalar tags; excluded from collector |
| Dictionary | Determined by value reducer | Scan full dictionary values, including unused entries; null count concerns values arrays, not keys/decoded rows; shared dictionaries are rescanned |

These are source contracts, not results of executing Arrow/DataFusion dependencies. Native decimal extrema are not clamped to precision, and primitive scalar conversion can impose separate failures. (rust/lance-file/src/versions/v1/writer/statistics.rs:47-174) (rust/lance-file/src/versions/v1/writer/statistics.rs:241-513)

## Prefixes, successors and cost

BINARY_PREFIX_LENGTH is64 bytes. UTF8 truncation scans backward over the original string for the longest nonempty prefix ending at or before64. Binary truncation takes exactly64 bytes. The comments saying less than are weaker than the actual <= condition. Values exactly64 bytes are not truncated. Each string/binary reduction has one global flag: if ANY value was truncated, the selected maximum is incremented even if that maximum was short. A missing successor produces a null upper bound. (rust/lance-file/src/versions/v1/writer/statistics.rs:176-387)

Binary increment carries right-to-left, zeroing overflowed suffix bytes; all0xFF returns None. UTF8 increment instead tries successive larger bytes at each position, validates the full candidate, and restores the original byte on overflow before moving left. It keeps suffix bytes and total length unchanged. None is an algorithm limitation, not a proof that no upper bound with another length exists. Prefix comparison/storage is bounded, but UTF8 truncation can traverse a long suffix; reduction scans all valid values except Boolean arrays after both values are known. Dictionary extraction allocates a Vec of borrowed values references and rescans shared dictionaries. (rust/lance-file/src/versions/v1/writer/statistics.rs:176-239) (rust/lance-file/src/versions/v1/writer/statistics.rs:453-513)

## Collector lifecycle and failure boundaries

visit_fields emits roots and struct descendants in schema order, including struct nodes; it does not descend through lists/dictionaries. Eligibility removes unsupported types, and BTreeMap keys sort output numerically. Duplicate IDs overwrite during collection. The writer has a separate reversed traversal of scalar leaves, so traversal order is not row/output order. (rust/lance-file/src/versions/v1/writer/statistics.rs:619-686) (rust/lance-file/src/versions/v1/writer/mod.rs:654-692)

Each selected field receives one StatisticsRow for an entire nonempty write slice, before page IO. Builder construction uses initial capacity1. String/binary appenders turn missing OR wrong-variant bounds into null; Boolean falls back to false/true; primitive appender converts scalars to arrays and reads value0 without checking validity, then appends a nonnull value. Null counts accept arbitrary i64 with no local sign check. Downcast/conversion unwraps can panic. (rust/lance-file/src/versions/v1/writer/statistics.rs:704-929) (rust/lance-file/src/versions/v1/writer/mod.rs:189-199)

finish drains builders before checking the final RecordBatch. Every root is a nonnullable Struct named by original field ID, containing nonnullable Int64 null_count and nullable original-type min_value/max_value. Field names/metadata are not copied. Any RecordBatch error becomes the fixed same-length SchemaError; prior builder contents are already lost. StructArray validation can panic earlier. There is no completed flag, rollback or retained row snapshot. Writer finalization consumes this batch into legacy pages and its own statistics table. (rust/lance-file/src/versions/v1/writer/statistics.rs:635-670) (rust/lance-file/src/versions/v1/writer/mod.rs:588-625)

## Exact production declarations

Visibility below is syntactic visibility inside the private module. Full generic bounds and lifetimes are retained. Each declaration links to its complete L2 behavior; fields are separately indexed.

| Symbol | Visibility | Exact declaration | Source |
|---|---|---|---|
| BINARY_PREFIX_LENGTH | private (private enclosing module) | `const BINARY_PREFIX_LENGTH: usize = 64;` | rust/lance-file/src/versions/v1/writer/statistics.rs:34-34 |
| StatisticsRow | pub (private enclosing module) | `pub struct StatisticsRow {` | rust/lance-file/src/versions/v1/writer/statistics.rs:38-38 |
| StatisticsRow::null_count | pub(crate) (private enclosing module) | `pub(crate) null_count: i64,` | rust/lance-file/src/versions/v1/writer/statistics.rs:40-40 |
| StatisticsRow::min_value | pub(crate) (private enclosing module) | `pub(crate) min_value: ScalarValue,` | rust/lance-file/src/versions/v1/writer/statistics.rs:42-42 |
| StatisticsRow::max_value | pub(crate) (private enclosing module) | `pub(crate) max_value: ScalarValue,` | rust/lance-file/src/versions/v1/writer/statistics.rs:44-44 |
| compute_primitive_statistics | private (private enclosing module) | `fn compute_primitive_statistics<T: ArrowNumericType>(     arrays: &[&ArrayRef], ) -> (T::Native, T::Native, i64) where     T::Native: Bounded + PartialOrd, {` | rust/lance-file/src/versions/v1/writer/statistics.rs:47-52 |
| get_statistics | private (private enclosing module) | `fn get_statistics<T: ArrowNumericType>(arrays: &[&ArrayRef]) -> StatisticsRow where     T::Native: Bounded,     datafusion_common::scalar::ScalarValue: From<<T as ArrowPrimitiveType>::Native>, {` | rust/lance-file/src/versions/v1/writer/statistics.rs:84-88 |
| compute_float_statistics | private (private enclosing module) | `fn compute_float_statistics<T: ArrowNumericType>(     arrays: &[&ArrayRef], ) -> (T::Native, T::Native, i64) where     T::Native: Float, {` | rust/lance-file/src/versions/v1/writer/statistics.rs:101-106 |
| get_float_statistics | private (private enclosing module) | `fn get_float_statistics<T: ArrowNumericType>(arrays: &[&ArrayRef]) -> StatisticsRow where     T::Native: Bounded + Float,     datafusion_common::scalar::ScalarValue: From<<T as ArrowPrimitiveType>::Native>, {` | rust/lance-file/src/versions/v1/writer/statistics.rs:138-142 |
| get_decimal_statistics | private (private enclosing module) | `fn get_decimal_statistics(arrays: &[&ArrayRef]) -> StatisticsRow {` | rust/lance-file/src/versions/v1/writer/statistics.rs:163-163 |
| truncate_utf8 | private (private enclosing module) | `fn truncate_utf8(data: &str, length: usize) -> Option<&str> {` | rust/lance-file/src/versions/v1/writer/statistics.rs:177-177 |
| increment_utf8 | private (private enclosing module) | `fn increment_utf8(mut data: Vec<u8>) -> Option<Vec<u8>> {` | rust/lance-file/src/versions/v1/writer/statistics.rs:195-195 |
| truncate_binary | private (private enclosing module) | `fn truncate_binary(data: &[u8], length: usize) -> Option<&[u8]> {` | rust/lance-file/src/versions/v1/writer/statistics.rs:217-217 |
| increment | private (private enclosing module) | `fn increment(mut data: Vec<u8>) -> Option<Vec<u8>> {` | rust/lance-file/src/versions/v1/writer/statistics.rs:228-228 |
| get_string_statistics | private (private enclosing module) | `fn get_string_statistics<T: OffsetSizeTrait>(arrays: &[&ArrayRef]) -> StatisticsRow {` | rust/lance-file/src/versions/v1/writer/statistics.rs:241-241 |
| get_binary_statistics | private (private enclosing module) | `fn get_binary_statistics<T: OffsetSizeTrait>(arrays: &[&ArrayRef]) -> StatisticsRow {` | rust/lance-file/src/versions/v1/writer/statistics.rs:316-316 |
| get_fixed_size_binary_statistics | private (private enclosing module) | `fn get_fixed_size_binary_statistics(arrays: &[&ArrayRef]) -> StatisticsRow {` | rust/lance-file/src/versions/v1/writer/statistics.rs:389-389 |
| get_boolean_statistics | private (private enclosing module) | `fn get_boolean_statistics(arrays: &[&ArrayRef]) -> StatisticsRow {` | rust/lance-file/src/versions/v1/writer/statistics.rs:453-453 |
| cast_dictionary_arrays | private (private enclosing module) | `fn cast_dictionary_arrays<'a, T: ArrowDictionaryKeyType + 'static>(     arrays: &'a [&'a ArrayRef], ) -> Vec<&'a Arc<dyn Array>> {` | rust/lance-file/src/versions/v1/writer/statistics.rs:484-486 |
| get_dictionary_statistics | private (private enclosing module) | `fn get_dictionary_statistics(arrays: &[&ArrayRef]) -> StatisticsRow {` | rust/lance-file/src/versions/v1/writer/statistics.rs:493-493 |
| get_temporal_statistics | private (private enclosing module) | `fn get_temporal_statistics(arrays: &[&ArrayRef]) -> StatisticsRow {` | rust/lance-file/src/versions/v1/writer/statistics.rs:515-515 |
| collect_statistics | pub (private enclosing module) | `pub fn collect_statistics(arrays: &[&ArrayRef]) -> StatisticsRow {` | rust/lance-file/src/versions/v1/writer/statistics.rs:550-550 |
| supports_stats_collection | pub (private enclosing module) | `pub fn supports_stats_collection(datatype: &DataType) -> bool {` | rust/lance-file/src/versions/v1/writer/statistics.rs:586-586 |
| StatisticsCollector | pub (private enclosing module) | `pub struct StatisticsCollector {` | rust/lance-file/src/versions/v1/writer/statistics.rs:612-612 |
| StatisticsCollector::builders | private (private enclosing module) | `builders: BTreeMap<i32, (Field, StatisticsBuilder)>,` | rust/lance-file/src/versions/v1/writer/statistics.rs:613-613 |
| StatisticsCollector::try_new | pub (private enclosing module) | `pub fn try_new(schema: &Schema) -> Option<Self> {` | rust/lance-file/src/versions/v1/writer/statistics.rs:619-619 |
| StatisticsCollector::get_builder | pub (private enclosing module) | `pub fn get_builder(&mut self, field_id: i32) -> Option<&mut StatisticsBuilder> {` | rust/lance-file/src/versions/v1/writer/statistics.rs:631-631 |
| StatisticsCollector::finish | pub (private enclosing module) | `pub fn finish(&mut self) -> Result<RecordBatch> {` | rust/lance-file/src/versions/v1/writer/statistics.rs:635-635 |
| visit_fields | private (private enclosing module) | `fn visit_fields(schema: &Schema) -> impl Iterator<Item = &Field> {` | rust/lance-file/src/versions/v1/writer/statistics.rs:674-674 |
| StatisticsBuilder | pub (private enclosing module) | `pub struct StatisticsBuilder {` | rust/lance-file/src/versions/v1/writer/statistics.rs:688-688 |
| StatisticsBuilder::null_count | private (private enclosing module) | `null_count: PrimitiveBuilder<Int64Type>,` | rust/lance-file/src/versions/v1/writer/statistics.rs:689-689 |
| StatisticsBuilder::min_value | private (private enclosing module) | `min_value: Box<dyn ArrayBuilder>,` | rust/lance-file/src/versions/v1/writer/statistics.rs:690-690 |
| StatisticsBuilder::max_value | private (private enclosing module) | `max_value: Box<dyn ArrayBuilder>,` | rust/lance-file/src/versions/v1/writer/statistics.rs:691-691 |
| StatisticsBuilder::dt | private (private enclosing module) | `dt: DataType,` | rust/lance-file/src/versions/v1/writer/statistics.rs:692-692 |
| <StatisticsBuilder as Debug>::fmt | trait implementation (private enclosing module) | `fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {` | rust/lance-file/src/versions/v1/writer/statistics.rs:696-696 |
| StatisticsBuilder::new | private (private enclosing module) | `fn new(data_type: &DataType) -> Self {` | rust/lance-file/src/versions/v1/writer/statistics.rs:705-705 |
| StatisticsBuilder::string_statistics_appender | private (private enclosing module) | `fn string_statistics_appender<T: OffsetSizeTrait>(&mut self, row: StatisticsRow) {` | rust/lance-file/src/versions/v1/writer/statistics.rs:718-718 |
| StatisticsBuilder::binary_statistics_appender | private (private enclosing module) | `fn binary_statistics_appender<T: OffsetSizeTrait>(&mut self, row: StatisticsRow) {` | rust/lance-file/src/versions/v1/writer/statistics.rs:763-763 |
| StatisticsBuilder::statistics_appender | private (private enclosing module) | `fn statistics_appender<T: arrow_array::ArrowPrimitiveType>(&mut self, row: StatisticsRow) {` | rust/lance-file/src/versions/v1/writer/statistics.rs:808-808 |
| StatisticsBuilder::boolean_appender | private (private enclosing module) | `fn boolean_appender(&mut self, row: StatisticsRow) {` | rust/lance-file/src/versions/v1/writer/statistics.rs:842-842 |
| StatisticsBuilder::append | pub (private enclosing module) | `pub fn append(&mut self, row: StatisticsRow) {` | rust/lance-file/src/versions/v1/writer/statistics.rs:869-869 |


Historical test catalogs from this supplement are retained in the [archive](archive/rust-lance-file-v1-statistics-historical-sections.md); they are outside current coverage.
