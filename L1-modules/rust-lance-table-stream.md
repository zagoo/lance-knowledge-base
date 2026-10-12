> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refreshed 2026-10-04 against `ad12ed9e15e0046688b00568d0ac1a347fb2d328`; changed-source pointers re-anchored. Unchanged analysis retained.

# Batch task alignment and system columns

Complete local scope: all 1,887 lines of utils/stream.rs. [Table](rust-lance-table.md) · [Exact file and ranges](../L2-files/rust/lance-table/src/utils/stream.rs.md) · [Benchmarks](archive/rust-lance-table-benchmarks.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Scenarios](../L4-crosscutting/scenarios.md).

This public utils::stream module aligns column streams and attaches row IDs, physical addresses and version arrays to already scheduled batches. It applies physical deletions by filtering or by nulling ID/address columns. It opens no files, spawns no tasks and chooses no downstream concurrency limit. Two fragment call sites merge reader streams, merge overlays, construct the configuration, wrap system columns, then begin projection reordering; complete FragmentReader orchestration remains pending. (rust/lance-table/src/utils.rs:1-4; rust/lance-table/src/utils/stream.rs:195-216; rust/lance-table/src/utils/stream.rs:643-848; rust/lance/src/dataset/fragment.rs:3681-3720; rust/lance/src/dataset/fragment.rs:3873-3917)

## Public API

| Symbol | Visibility | Exact declaration | Evidence |
|---|---|---|---|
| `ReadBatchFut` | public | `pub type ReadBatchFut = BoxFuture<'static, Result<RecordBatch>>;` | [rust/lance-table/src/utils/stream.rs:30-30](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `ReadBatchTask` | public | `pub struct ReadBatchTask {` | [rust/lance-table/src/utils/stream.rs:33-33](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `ReadBatchTask::task` | public | `pub task: ReadBatchFut,` | [rust/lance-table/src/utils/stream.rs:34-34](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `ReadBatchTask::num_rows` | public | `pub num_rows: u32,` | [rust/lance-table/src/utils/stream.rs:35-35](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `ReadBatchTaskStream` | public | `pub type ReadBatchTaskStream = BoxStream<'static, ReadBatchTask>;` | [rust/lance-table/src/utils/stream.rs:37-37](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `ReadBatchFutStream` | public | `pub type ReadBatchFutStream = BoxStream<'static, ReadBatchFut>;` | [rust/lance-table/src/utils/stream.rs:38-38](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `merge_streams` | public | `pub fn merge_streams(streams: Vec<ReadBatchTaskStream>) -> ReadBatchTaskStream {` | [rust/lance-table/src/utils/stream.rs:205-205](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `RowIdAndDeletesConfig` | public | `pub struct RowIdAndDeletesConfig {` | [rust/lance-table/src/utils/stream.rs:319-319](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `RowIdAndDeletesConfig::params` | public | `pub params: ReadBatchParams,` | [rust/lance-table/src/utils/stream.rs:321-321](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `RowIdAndDeletesConfig::with_row_id` | public | `pub with_row_id: bool,` | [rust/lance-table/src/utils/stream.rs:323-323](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `RowIdAndDeletesConfig::with_row_addr` | public | `pub with_row_addr: bool,` | [rust/lance-table/src/utils/stream.rs:325-325](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `RowIdAndDeletesConfig::with_row_last_updated_at_version` | public | `pub with_row_last_updated_at_version: bool,` | [rust/lance-table/src/utils/stream.rs:327-327](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `RowIdAndDeletesConfig::with_row_created_at_version` | public | `pub with_row_created_at_version: bool,` | [rust/lance-table/src/utils/stream.rs:329-329](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `RowIdAndDeletesConfig::deletion_vector` | public | `pub deletion_vector: Option<Arc<DeletionVector>>,` | [rust/lance-table/src/utils/stream.rs:331-331](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `RowIdAndDeletesConfig::row_id_sequence` | public | `pub row_id_sequence: Option<Arc<RowIdSequence>>,` | [rust/lance-table/src/utils/stream.rs:333-333](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `RowIdAndDeletesConfig::last_updated_at_sequence` | public | `pub last_updated_at_sequence: Option<Arc<crate::rowids::version::RowDatasetVersionSequence>>,` | [rust/lance-table/src/utils/stream.rs:335-335](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `RowIdAndDeletesConfig::created_at_sequence` | public | `pub created_at_sequence: Option<Arc<crate::rowids::version::RowDatasetVersionSequence>>,` | [rust/lance-table/src/utils/stream.rs:337-337](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `RowIdAndDeletesConfig::make_deletions_null` | public | `pub make_deletions_null: bool,` | [rust/lance-table/src/utils/stream.rs:339-339](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `RowIdAndDeletesConfig::total_num_rows` | public | `pub total_num_rows: u32,` | [rust/lance-table/src/utils/stream.rs:343-343](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `apply_row_id_and_deletes` | public | `pub fn apply_row_id_and_deletes(     batch: RecordBatch,     batch_offset: u32,     fragment_id: u32,     config: &RowIdAndDeletesConfig, ) -> Result<RecordBatch> {` | [rust/lance-table/src/utils/stream.rs:355-360](../L2-files/rust/lance-table/src/utils/stream.rs.md) |
| `wrap_with_row_id_and_delete` | public | `pub fn wrap_with_row_id_and_delete(     stream: ReadBatchTaskStream,     fragment_id: u32,     config: RowIdAndDeletesConfig, ) -> ReadBatchFutStream {` | [rust/lance-table/src/utils/stream.rs:648-652](../L2-files/rust/lance-table/src/utils/stream.rs.md) |

ReadBatchTask.num_rows is the promised physical/selected batch length before deletion. The wrapper advances a u32 selected-position offset using this declaration; actual future results are not comprehensively compared with it. Configuration fields are publicly mutable and no constructor validates combinations, row limits or selection shape. Missing stable IDs mean physical addresses serve as IDs; missing requested versions become 1. The default-value rule is independent of current manifest version. (rust/lance-table/src/utils/stream.rs:30-40; rust/lance-table/src/utils/stream.rs:317-369; rust/lance-table/src/utils/stream.rs:489-591; rust/lance-table/src/utils/stream.rs:692-719)

## Alignment and shared future lifecycle

MergeStream keeps one pending chunk from each input. It emits the minimum remaining count, splitting bigger chunks with shared futures and Arrow slices. A whole unsplit task moves its original future directly. Split errors become Wrapped with the original Error reachable through SharedReadError::source. Input task order determines column merge order; FuturesOrdered yields component results in that order. Any input stream ending stops the merge without checking remaining totals. Zero-row tasks are allowed. (rust/lance-table/src/utils/stream.rs:41-216)

The outer stream does not await batch data; emitted futures perform the actual merge. Dropping one split future does not itself invalidate another shared handle, and retained slices can retain the whole source batch. Declared sizes must match actual data or slicing can panic; equal actual lengths are checked by RecordBatchExt::merge. Matching field names are not simple concatenation: nested structures may merge and other conflicts keep the left column. Left schema metadata survives. Certain nested-list merge branches can panic; those dependency internals are only contextually read, not fully analyzed. (rust/lance-table/src/utils/stream.rs:90-159; rust/lance-arrow/src/lib.rs:653-673; rust/lance-arrow/src/lib.rs:1227-1328)

## Ordered expansion, read-ahead and schema reuse

The wrapper chooses dense versus ordinary row-ID cursor expansion once, then expands IDs and multi-run versions while pulling tasks in order. Batch futures may complete concurrently without sharing mutable cursors. Metadata Results are captured in those futures: an input batch error propagates first and can mask a precomputed metadata error. Work done while pulling can be discarded if a future is never consumed. (rust/lance-table/src/utils/stream.rs:648-691; rust/lance-table/src/utils/stream.rs:692-848)

Uniform nonzero task sizes enable a 65,536-row read-ahead target and shared output-schema cache. Chunks are aligned to whole batches, capped by selected rows left; a larger task can exceed the target. A nonfinal size change permanently disables both fast paths after draining any usable cached ID chunk. Zero-size tasks do not alter the inferred size; a different final size is allowed. A batch straddling chunks copies its prefix and suffix; fitting slices share storage. Retained output futures/batches can hold multiple old buffers, so the current chunk is not a global memory cap. (rust/lance-table/src/utils/stream.rs:378-405; rust/lance-table/src/utils/stream.rs:692-798)

The OnceLock caches the first completing batch's input/output schemas. Pointer-identical or structurally equal later schemas reuse its output Arc; differing schemas receive a fresh schema without replacing the cache. This path appends fields directly. The incremental fallback instead calls try_with_column repeatedly, which explicitly rejects duplicate names. Do not assume identical malformed-input behavior for both assembly paths. (rust/lance-table/src/utils/stream.rs:592-634; rust/lance-arrow/src/lib.rs:639-644; rust/lance-arrow/src/schema.rs:146-157)

## Selection, errors and deletion semantics

Selection offsets count rows in the requested selection, while ranges/indices identify physical positions in the sequence. Helpers slice params then often unwrap Results, so invalid selection can panic despite a Result-returning public transformer. ReadBatchParams materializers use raw index values and unchecked u32 endpoint conversions; the local total count is primarily a read-ahead estimate. The wrapper checks decoded stable-ID count and returns named CorruptFile on truncation. The direct fallback lacks that exact chunk check. (rust/lance-table/src/utils/stream.rs:266-315; rust/lance-table/src/utils/stream.rs:407-545; rust/lance-io/src/lib.rs:156-219; rust/lance-io/src/lib.rs:248-277)

A one-run version sequence repeats its value without validating the run length against selection. Its O(1) comment concerns locating a version, not allocating/filling the output vector. Multi-run streaming reuses version cursors; direct calls create a new cursor and repeat selection construction. System columns appear in ID, address, last-updated, created order after payload. (rust/lance-table/src/utils/stream.rs:266-315; rust/lance-table/src/utils/stream.rs:553-591; rust/lance-table/src/utils/stream.rs:681-690)

Deletion predicates use physical addresses regardless of stable IDs. Some(NoDeletions) is normalized away. Filter mode removes rows from every column; null mode keeps physical length and combines existing validity with deletion validity only for _rowid/_rowaddr. Payload and version values remain present under deleted rows. If no ID/address field is present, null mode has no identifying null output; test code treats that as an upstream-invalid configuration, but production code does not reject it. Empty filtered batches are returned. (rust/lance-table/src/utils/stream.rs:218-264; rust/lance-table/src/utils/stream.rs:479-551; rust/lance-table/src/utils/stream.rs:636-640; rust/lance-table/src/utils/stream.rs:1517-1526)

## Tests and boundaries

Fixtures cover aligned and differing-boundary merges, sparse IDs with deletion-preserved addresses, unsorted/repeated selection, shared read-ahead buffers, zero tasks, truncated IDs, variable-size fallback, equivalent-schema reuse, physical selection forms, a deletion matrix, one/many-run versions, backwards version selections and direct fallback. They use in-memory ready tasks and buffered consumers; no actual IO or forced delayed completion is present. They do not cover unequal total streams, split-error fanout, declared/actual length mismatches, duplicate system names, malformed uniform version length, or null-only deletion with version columns. Tests were read, not run. (rust/lance-table/src/utils/stream.rs:850-1887)
