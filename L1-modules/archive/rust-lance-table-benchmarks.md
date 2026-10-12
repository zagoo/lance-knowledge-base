> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# Table metadata and system-column benchmarks

Complete local scope: manifest_intern.rs (263 lines), system_columns.rs (172), version_columns.rs (160). [Table](../rust-lance-table.md) · [Stream implementation](../rust-lance-table-stream.md) · [Row-ID index benchmark](../rust-lance-table-row-index.md) · [Build and testing](../../L4-crosscutting/build-and-test.md). These files expose no library public API; their helpers and Criterion registrations are cataloged below. None was executed.

## Fragment interning workload

BENCH_NUM_FRAGMENTS defaults to 100,000; successful malformed text panics. Uniform fixtures contain 10 or 50 fields, 1,000 physical rows per fragment and identical creation/update payloads at version 42. Diverse fixtures use ten fields and 10/100/500 version groups. Both measured conversion paths clone already-decoded protobuf messages; one directly converts Fragment, the other creates a new interner per iteration. They do not measure byte decoding or object-store IO. Positive fragment counts below the number of version groups trigger division by zero in fixture construction. (rust/lance-table/benches/manifest_intern.rs:20-205)

The memory group holds baseline and interned outputs, reports separate DeepSizeOf estimates in units of 1,048,576 bytes despite an MB label, and times only interned deep_size_of traversal. It does not measure process RSS, transient interner/protobuf allocation peaks or assert savings. Linux adds a 100 Hz flamegraph profiler; other systems use default Criterion. (rust/lance-table/benches/manifest_intern.rs:206-263)

| Symbol | Visibility | Exact declaration | Evidence |
|---|---|---|---|
| `manifest_intern::num_fragments` | private | `fn num_fragments() -> u64 {` | [rust/lance-table/benches/manifest_intern.rs:20-20](../../L2-files/rust/lance-table/benches/manifest_intern.rs.md) |
| `manifest_intern::make_uniform_pb_fragments` | private | `fn make_uniform_pb_fragments(n: u64, num_fields: usize) -> Vec<pb::DataFragment> {` | [rust/lance-table/benches/manifest_intern.rs:29-29](../../L2-files/rust/lance-table/benches/manifest_intern.rs.md) |
| `manifest_intern::deserialize_without_interning` | private | `fn deserialize_without_interning(protos: &[pb::DataFragment]) -> Vec<Fragment> {` | [rust/lance-table/benches/manifest_intern.rs:81-81](../../L2-files/rust/lance-table/benches/manifest_intern.rs.md) |
| `manifest_intern::deserialize_with_interning` | private | `fn deserialize_with_interning(protos: &[pb::DataFragment]) -> Vec<Fragment> {` | [rust/lance-table/benches/manifest_intern.rs:89-89](../../L2-files/rust/lance-table/benches/manifest_intern.rs.md) |
| `manifest_intern::make_diverse_pb_fragments` | private | `fn make_diverse_pb_fragments(     n: u64,     num_fields: usize,     unique_versions: u64, ) -> Vec<pb::DataFragment> {` | [rust/lance-table/benches/manifest_intern.rs:99-103](../../L2-files/rust/lance-table/benches/manifest_intern.rs.md) |
| `manifest_intern::bench_deserialization` | private | `fn bench_deserialization(c: &mut Criterion) {` | [rust/lance-table/benches/manifest_intern.rs:158-158](../../L2-files/rust/lance-table/benches/manifest_intern.rs.md) |
| `manifest_intern::bench_memory` | private | `fn bench_memory(c: &mut Criterion) {` | [rust/lance-table/benches/manifest_intern.rs:206-206](../../L2-files/rust/lance-table/benches/manifest_intern.rs.md) |
| `manifest_intern::benches::<registration at 256>` | private | `criterion_group!(     name = benches;` | [rust/lance-table/benches/manifest_intern.rs:256-257](../../L2-files/rust/lance-table/benches/manifest_intern.rs.md) |
| `manifest_intern::benches::<registration at 262>` | private | `criterion_group!(benches, bench_deserialization, bench_memory);` | [rust/lance-table/benches/manifest_intern.rs:262-262](../../L2-files/rust/lance-table/benches/manifest_intern.rs.md) |
| `manifest_intern::main::<criterion entry>` | private | `criterion_main!(benches);` | [rust/lance-table/benches/manifest_intern.rs:263-263](../../L2-files/rust/lance-table/benches/manifest_intern.rs.md) |

## Row-ID/system-column workload

BENCH_SYSTEM_ROWS defaults to 100,000 and BENCH_SYSTEM_BATCH_SIZE to 1,024 capped at total rows. BENCH_SYSTEM_VARIABLE_BATCHES enables only for exact string 1. The eight shapes cross hole stride 2/17, payload absent/present and row-ID-only/all-system columns. All-system versions have absent sequences and therefore materialize 1; no deletions are present. Zero batch size with positive rows can produce endless zero tasks or an invalid slice. (rust/lance-table/benches/system_columns.rs:18-130; rust/lance-table/src/utils/stream.rs:560-591)

SmallInput setup creates config and a lazy stream. Timed work includes producing ready tasks, wrapping them, buffering eight, running a current-thread runtime and collecting the full output Vec. Bulk ID encoding is outside timing. Ten samples, one-second warmup and three-second measurement are configured, with no result oracle or throughput normalization. Retaining all outputs also retains their shared buffers. (rust/lance-table/benches/system_columns.rs:107-172)

| Symbol | Visibility | Exact declaration | Evidence |
|---|---|---|---|
| `system_columns::make_batch` | private | `fn make_batch(batch_size: usize, has_payload: bool) -> RecordBatch {` | [rust/lance-table/benches/system_columns.rs:18-18](../../L2-files/rust/lance-table/benches/system_columns.rs.md) |
| `system_columns::make_tasks` | private | `fn make_tasks(     batch: RecordBatch,     total_rows: usize,     batch_size: usize,     variable_batches: bool, ) -> ReadBatchTaskStream {` | [rust/lance-table/benches/system_columns.rs:39-44](../../L2-files/rust/lance-table/benches/system_columns.rs.md) |
| `system_columns::make_config` | private | `fn make_config(     total_rows: usize,     sequence: Arc<RowIdSequence>,     with_all_system_columns: bool, ) -> RowIdAndDeletesConfig {` | [rust/lance-table/benches/system_columns.rs:72-76](../../L2-files/rust/lance-table/benches/system_columns.rs.md) |
| `system_columns::bench_stream_row_ids` | private | `fn bench_stream_row_ids(c: &mut Criterion) {` | [rust/lance-table/benches/system_columns.rs:92-92](../../L2-files/rust/lance-table/benches/system_columns.rs.md) |
| `system_columns::benches::<registration at 171>` | private | `criterion_group!(benches, bench_stream_row_ids);` | [rust/lance-table/benches/system_columns.rs:171-171](../../L2-files/rust/lance-table/benches/system_columns.rs.md) |
| `system_columns::main::<criterion entry>` | private | `criterion_main!(benches);` | [rust/lance-table/benches/system_columns.rs:172-172](../../L2-files/rust/lance-table/benches/system_columns.rs.md) |

## Version-column workload

BENCH_VERSION_ROWS defaults to 100,000 and BENCH_VERSION_BATCH_SIZE to 1,024 capped at total. Four run lengths are total rows, 1,024, 32 and 1. Only last-updated is requested. Direct timing processes one fixed-size batch per iteration, creates fresh cursor state and skips a nondivisible short tail; stream timing processes all rows including tail, with reusable cursors within that stream and retained output Vec. Their raw durations have different units. Zero total causes zero-step fixture panic; zero batch is also invalid for stream step_by. Small totals can produce duplicate run-count labels; dependency handling is unverified. (rust/lance-table/benches/version_columns.rs:22-157)

Both groups request ten samples, one-second warmup and three-second measurement, black-box outputs and assert no value oracle. There is no disk read, deletion, creation-version or address workload here. Repository benchmark policy selects release-with-debug; these configured workloads supply no measured performance claim. (rust/lance-table/benches/version_columns.rs:46-60; rust/lance-table/benches/version_columns.rs:80-160; AGENTS.md:19-31)

| Symbol | Visibility | Exact declaration | Evidence |
|---|---|---|---|
| `version_columns::make_version_sequence` | private | `fn make_version_sequence(total_rows: u64, run_length: u64) -> RowDatasetVersionSequence {` | [rust/lance-table/benches/version_columns.rs:22-22](../../L2-files/rust/lance-table/benches/version_columns.rs.md) |
| `version_columns::make_batch` | private | `fn make_batch(batch_size: u64) -> RecordBatch {` | [rust/lance-table/benches/version_columns.rs:34-34](../../L2-files/rust/lance-table/benches/version_columns.rs.md) |
| `version_columns::make_config` | private | `fn make_config(total_rows: u64, sequence: Arc<RowDatasetVersionSequence>) -> RowIdAndDeletesConfig {` | [rust/lance-table/benches/version_columns.rs:46-46](../../L2-files/rust/lance-table/benches/version_columns.rs.md) |
| `version_columns::make_tasks` | private | `fn make_tasks(batch: RecordBatch, total_rows: u64, batch_size: u64) -> ReadBatchTaskStream {` | [rust/lance-table/benches/version_columns.rs:62-62](../../L2-files/rust/lance-table/benches/version_columns.rs.md) |
| `version_columns::bench_apply_versions` | private | `fn bench_apply_versions(c: &mut Criterion) {` | [rust/lance-table/benches/version_columns.rs:80-80](../../L2-files/rust/lance-table/benches/version_columns.rs.md) |
| `version_columns::bench_stream_versions` | private | `fn bench_stream_versions(c: &mut Criterion) {` | [rust/lance-table/benches/version_columns.rs:114-114](../../L2-files/rust/lance-table/benches/version_columns.rs.md) |
| `version_columns::benches::<registration at 159>` | private | `criterion_group!(benches, bench_apply_versions, bench_stream_versions);` | [rust/lance-table/benches/version_columns.rs:159-159](../../L2-files/rust/lance-table/benches/version_columns.rs.md) |
| `version_columns::main::<criterion entry>` | private | `criterion_main!(benches);` | [rust/lance-table/benches/version_columns.rs:160-160](../../L2-files/rust/lance-table/benches/version_columns.rs.md) |
