# Dataset engine and public Rust API

> Refresh 2026-10-12, `011953c22097b67b699595adbe99e7f0155d83e4`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-12.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refreshed 2026-10-04 against `ad12ed9e15e0046688b00568d0ac1a347fb2d328`; changed-source pointers re-anchored. Unchanged analysis retained.

**Trust: contract-verified entry paths; ordinary implementation files mapped.** Source snapshot `ad12ed9e15e0046688b00568d0ac1a347fb2d328`. [Entry](../README.md) · [Scope](../V21-PROTOCOL.md) · [Format](../L3-symbols/format-spec.md).

Owns Dataset snapshots, scans, mutations, compaction and index lifecycle orchestration. Delegates schemas/identity to lance-core, manifest and operation rules to lance-table, bytes to lance-file/encoding/IO, and index algorithms to lance-index. Finishing a file and committing a dataset are distinct boundaries. The four checked entry traces are in [L0](../L0-orientation.md).

The [commit and conflict contract](../L3-symbols/protocol-commit.md) supplies the operation matrix and publication/recovery rules; follow its bounded read sets for transaction changes.

## Module Map

<a id="rust-lance"></a>

### `rust/lance/`

Handwritten build entry; generated output is excluded. This file has navigation coverage only.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/build.rs` | 1-24 | mapped |
<a id="rust-lance-src"></a>

### `rust/lance/src/`

Public Dataset/index/session facade and module declarations. Choose a named API before descending to implementation directories.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/arrow.rs` | 1-16 | mapped |
| `rust/lance/src/blob.rs` | 1-435, 450-1293 | mapped |
| `rust/lance/src/datafusion.rs` | 1-9 | mapped |
| `rust/lance/src/dataset.rs` | 1-4278, 4284-4558 | Key File (checked ranges) |
| `rust/lance/src/index.rs` | 1-5082 | mapped |
| `rust/lance/src/io.rs` | 1-17 | mapped |
| `rust/lance/src/lib.rs` | 1-131 | mapped |
| `rust/lance/src/metrics.rs` | 1-10 | mapped |
| `rust/lance/src/session.rs` | 1-359 | mapped |
| `rust/lance/src/table.rs` | 1-4 | mapped |
| `rust/lance/src/utils.rs` | 1-7 | mapped |
<a id="rust-lance-src-arrow"></a>

### `rust/lance/src/arrow/`

Mapped-only Arrow interoperation helpers used by the engine; external Arrow implementation is excluded.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/arrow/json.rs` | 1-303 | mapped |
<a id="rust-lance-src-bin"></a>

### `rust/lance/src/bin/`

Mapped-only executable entry points; not the engine API contract.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/bin/fm_index_tool.rs` | 1-161 | mapped |
| `rust/lance/src/bin/lq.rs` | 1-181 | mapped |
<a id="rust-lance-src-datafusion"></a>

### `rust/lance/src/datafusion/`

Dataset TableProvider/DataFrame integration. Converts provider projection/filter/limit requests to Scanner plans and declares filter pushdown behavior.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/datafusion/dataframe.rs` | 1-278 | mapped |
| `rust/lance/src/datafusion/logical_plan.rs` | 1-78 | mapped |
<a id="rust-lance-src-dataset"></a>

### `rust/lance/src/dataset/`

Dataset builders, scanner, fragments, writes, compaction, cleanup, refs/branches, deltas, schema evolution and row/blob access. Start at the operation-named file, then use its subdirectory only if needed.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/dataset/blob.rs` | 1-3138, 3150-3165, 3170-3191, 3196-3280, 3288-3306, 3317-3858, 3872-5443 | mapped |
| `rust/lance/src/dataset/branch_location.rs` | 1-163 | mapped |
| `rust/lance/src/dataset/builder.rs` | 1-951 | mapped |
| `rust/lance/src/dataset/cleanup.rs` | 1-2295 | mapped |
| `rust/lance/src/dataset/data_file.rs` | 1-377 | mapped |
| `rust/lance/src/dataset/data_file_part.rs` | 1-131 | mapped |
| `rust/lance/src/dataset/delta.rs` | 1-945 | mapped |
| `rust/lance/src/dataset/files.rs` | 1-484 | mapped |
| `rust/lance/src/dataset/fragment.rs` | 1-792, 797-4009 | mapped |
| `rust/lance/src/dataset/hash_joiner.rs` | 1-290 | mapped |
| `rust/lance/src/dataset/index.rs` | 1-207 | mapped |
| `rust/lance/src/dataset/index/frag_reuse.rs` | 1-891 | mapped |
| `rust/lance/src/dataset/mem_wal.rs` | 1-43, 46-335 | mapped |
| `rust/lance/src/dataset/metadata.rs` | 1-177 | mapped |
| `rust/lance/src/dataset/optimize.rs` | 1-3747 | Key File (checked ranges) |
| `rust/lance/src/dataset/overlay.rs` | 1-765 | mapped |
| `rust/lance/src/dataset/progress.rs` | 1-93 | mapped |
| `rust/lance/src/dataset/refs.rs` | 1-1099 | mapped |
| `rust/lance/src/dataset/rowids.rs` | 1-420 | mapped |
| `rust/lance/src/dataset/scanner.rs` | 1-2439, 2444-8627, 8950-8950 | Key File (checked ranges) |
| `rust/lance/src/dataset/schema_evolution.rs` | 1-31, 34-157, 166-226, 235-1301, 1306-1306 | mapped |
| `rust/lance/src/dataset/sql.rs` | 1-357 | mapped |
| `rust/lance/src/dataset/statistics.rs` | 1-213 | mapped |
| `rust/lance/src/dataset/take.rs` | 1-619 | mapped |
| `rust/lance/src/dataset/udtf.rs` | 1-252 | mapped |
| `rust/lance/src/dataset/updater.rs` | 1-784 | mapped |
| `rust/lance/src/dataset/utils.rs` | 1-395 | mapped |
| `rust/lance/src/dataset/write.rs` | 1-2689 | mapped |
<a id="rust-lance-src-dataset-files"></a>

### `rust/lance/src/dataset/files/`

Dataset file management and data-file composition helpers. These operate below logical Dataset mutation and above object/file primitives; follow files.rs to the selected operation.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/dataset/files/arrow.rs` | 1-128 | mapped |
| `rust/lance/src/dataset/files/file_types.rs` | 1-34 | mapped |
| `rust/lance/src/dataset/files/scan.rs` | 1-93, 110-149, 194-282 | mapped |
<a id="rust-lance-src-dataset-fragment"></a>

### `rust/lance/src/dataset/fragment/`

Fragment write and read composition. A fragment is a logical row group with files/deletions/lineage; keep physical-file and fragment identity separate.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/dataset/fragment/session.rs` | 1-83 | mapped |
| `rust/lance/src/dataset/fragment/write.rs` | 1-10, 13-356 | mapped |
<a id="rust-lance-src-dataset-mem-wal"></a>

### `rust/lance/src/dataset/mem_wal/`

MemWAL shard, memtable and scanner integration. Descendant hnsw/index directories supply in-memory search; memtable/scanner/exec and scanner/exec own execution operators. These are mapped for navigation; protocol decisions must use the M3 contract and cited implementation.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/dataset/mem_wal/api.rs` | 1-1219 | mapped |
| `rust/lance/src/dataset/mem_wal/hnsw/graph.rs` | 1-1260 | mapped |
| `rust/lance/src/dataset/mem_wal/hnsw/mod.rs` | 1-18 | mapped |
| `rust/lance/src/dataset/mem_wal/hnsw/storage.rs` | 1-511 | mapped |
| `rust/lance/src/dataset/mem_wal/index.rs` | 1-15, 20-543 | mapped |
| `rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs` | 1-265, 270-477 | mapped |
| `rust/lance/src/dataset/mem_wal/index/btree.rs` | 1-1484 | mapped |
| `rust/lance/src/dataset/mem_wal/index/fts.rs` | 1-1326, 1342-1403, 1408-5296 | mapped |
| `rust/lance/src/dataset/mem_wal/index/hnsw.rs` | 1-839 | mapped |
| `rust/lance/src/dataset/mem_wal/index/pk_key.rs` | 1-138 | mapped |
| `rust/lance/src/dataset/mem_wal/manifest.rs` | 1-684 | mapped |
| `rust/lance/src/dataset/mem_wal/memtable.rs` | 1-912 | mapped |
| `rust/lance/src/dataset/mem_wal/memtable/batch_store.rs` | 1-927 | mapped |
| `rust/lance/src/dataset/mem_wal/memtable/flush.rs` | 1-851 | mapped |
| `rust/lance/src/dataset/mem_wal/memtable/scanner.rs` | 1-44, 51-53, 60-60, 75-75 | mapped |
| `rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs` | 1-1441 | mapped |
| `rust/lance/src/dataset/mem_wal/memtable/scanner/exec.rs` | 1-36, 39-128 | mapped |
| `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/brute_force_vector.rs` | 1-486 | mapped |
| `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/dedup_scan.rs` | 1-310 | mapped |
| `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/fts.rs` | 1-753 | mapped |
| `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/scan.rs` | 1-373 | mapped |
| `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/vector.rs` | 1-379 | mapped |
| `rust/lance/src/dataset/mem_wal/observer.rs` | 1-30 | mapped |
| `rust/lance/src/dataset/mem_wal/reconcile.rs` | 1-515 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner.rs` | 1-83 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/block_list.rs` | 1-474 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/builder.rs` | 1-980 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/collector.rs` | 1-377 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/data_source.rs` | 1-228 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/exec.rs` | 1-35 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/exec/bloom_guard.rs` | 1-250 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/exec/coalesce_first.rs` | 1-270 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/exec/first_by_pk.rs` | 1-184 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/exec/generation_tag.rs` | 1-185 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/exec/pk.rs` | 1-135 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/exec/pk_block_filter.rs` | 1-294 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/exec/reconcile.rs` | 1-128 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/exec/schema_relabel.rs` | 1-159 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/fts_search.rs` | 1-1466 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/generation_read.rs` | 1-575 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/planner.rs` | 1-519, 569-575 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs` | 1-1165 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/projection.rs` | 1-328 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/sstable_cache.rs` | 1-235 | mapped |
| `rust/lance/src/dataset/mem_wal/scanner/vector_search.rs` | 1-765 | mapped |
| `rust/lance/src/dataset/mem_wal/sharding.rs` | 1-371 | mapped |
| `rust/lance/src/dataset/mem_wal/util.rs` | 1-221 | mapped |
| `rust/lance/src/dataset/mem_wal/wal.rs` | 1-69, 74-1864 | mapped |
| `rust/lance/src/dataset/mem_wal/write.rs` | 1-847, 1052-5269, 11604-11604 | mapped |
<a id="rust-lance-src-dataset-optimize"></a>

### `rust/lance/src/dataset/optimize/`

Compaction helpers selected by optimize.rs. Planning/rewrite results carry source read versions; final publication remains the parent commit_compaction path.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/dataset/optimize/binary_copy.rs` | 1-441 | mapped |
| `rust/lance/src/dataset/optimize/remapping.rs` | 1-1198 | mapped |
<a id="rust-lance-src-dataset-overlay"></a>

### `rust/lance/src/dataset/overlay/`

Overlay read/write helpers use physical-offset coverage and field identity. Preserve precedence and deletion semantics described in frozen fragment/overlay contracts.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/dataset/overlay/writer.rs` | 1-630 | mapped |
<a id="rust-lance-src-dataset-rowids"></a>

### `rust/lance/src/dataset/rowids/`

Dataset-level lookup/translation between stable IDs and physical row addresses. These require fragment context unavailable to the core row-address type.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/dataset/rowids/spill.rs` | 1-738 | mapped |
| `rust/lance/src/dataset/rowids/validate.rs` | 1-163 | mapped |
<a id="rust-lance-src-dataset-schema-evolution"></a>

### `rust/lance/src/dataset/schema_evolution/`

Schema-evolution helpers coordinate schema changes with existing files and indices. Field identity and nullability are contracts, not cosmetic names.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/dataset/schema_evolution/optimize.rs` | 1-117 | mapped |
<a id="rust-lance-src-dataset-versions"></a>

### `rust/lance/src/dataset/versions/`

Version-specific dataset rewrite support. The parent version policy chooses exact file versions; stable legacy paths remain compatibility surfaces.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/dataset/versions/mod.rs` | 1-522, 540-1147 | mapped |
<a id="rust-lance-src-dataset-write"></a>

### `rust/lance/src/dataset/write/`

Mutation builders and commit destination/options. Insert writes data then constructs transaction intent; CommitBuilder publishes; merge/update paths have their own planning and conflict context.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/dataset/write/commit.rs` | 1-633 | mapped |
| `rust/lance/src/dataset/write/delete.rs` | 1-393 | mapped |
| `rust/lance/src/dataset/write/insert.rs` | 1-495 | Key File (checked ranges) |
| `rust/lance/src/dataset/write/merge_insert.rs` | 1-3891 | mapped |
| `rust/lance/src/dataset/write/retry.rs` | 1-107 | mapped |
| `rust/lance/src/dataset/write/update.rs` | 1-779 | mapped |
<a id="rust-lance-src-dataset-write-merge-insert"></a>

### `rust/lance/src/dataset/write/merge_insert/`

Merge-insert planning and execution substeps. The exec directory contains physical processing stages; start with the merge-insert builder before editing a stage in isolation.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/dataset/write/merge_insert/assign_action.rs` | 1-165 | mapped |
| `rust/lance/src/dataset/write/merge_insert/exec.rs` | 1-110 | mapped |
| `rust/lance/src/dataset/write/merge_insert/exec/delete.rs` | 1-368 | mapped |
| `rust/lance/src/dataset/write/merge_insert/exec/in_place.rs` | 1-527 | mapped |
| `rust/lance/src/dataset/write/merge_insert/exec/write.rs` | 1-1195 | mapped |
| `rust/lance/src/dataset/write/merge_insert/inserted_rows.rs` | 1-12 | mapped |
| `rust/lance/src/dataset/write/merge_insert/logical_plan.rs` | 1-325 | mapped |
<a id="rust-lance-src-index"></a>

### `rust/lance/src/index/`

Create/append/open/remap index state, query prefilters, scalar logical planning, and system-index integration. create.rs is the public build-to-commit route; api.rs/index.rs define caller-facing interfaces.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/index/api.rs` | 1-395 | mapped |
| `rust/lance/src/index/append.rs` | 1-1701 | mapped |
| `rust/lance/src/index/create.rs` | 1-1112 | mapped |
| `rust/lance/src/index/frag_reuse.rs` | 1-2437 | mapped |
| `rust/lance/src/index/frag_reuse_reader.rs` | 1-17, 22-22, 30-175, 178-464, 467-492, 2108-2108 | mapped |
| `rust/lance/src/index/frag_reuse_reader/cache.rs` | 1-135, 145-244 | mapped |
| `rust/lance/src/index/frag_reuse_remapping.rs` | 1-160 | mapped |
| `rust/lance/src/index/frag_reuse_with_stable_row_ids.rs` | 1-253 | mapped |
| `rust/lance/src/index/mem_wal.rs` | 1-13 | mapped |
| `rust/lance/src/index/prefilter.rs` | 1-476 | mapped |
| `rust/lance/src/index/scalar.rs` | 1-133, 139-148, 153-950 | mapped |
| `rust/lance/src/index/scalar_logical.rs` | 1-410 | mapped |
| `rust/lance/src/index/vector.rs` | 1-19, 22-2382 | mapped |
<a id="rust-lance-src-index-scalar"></a>

### `rust/lance/src/index/scalar/`

Dataset scalar adapters and index lifecycle integration. These connect plugin queries/training and index metadata to scans, row domains and fragment coverage.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/index/scalar/bitmap.rs` | 1-101 | mapped |
| `rust/lance/src/index/scalar/bloomfilter.rs` | 1-106 | mapped |
| `rust/lance/src/index/scalar/btree.rs` | 1-177 | mapped |
| `rust/lance/src/index/scalar/fmindex.rs` | 1-134 | mapped |
| `rust/lance/src/index/scalar/inverted.rs` | 1-1169 | mapped |
| `rust/lance/src/index/scalar/label_list.rs` | 1-156 | mapped |
| `rust/lance/src/index/scalar/minhash_lsh.rs` | 1-94 | mapped |
| `rust/lance/src/index/scalar/ngram.rs` | 1-212 | mapped |
| `rust/lance/src/index/scalar/rtree.rs` | 1-100 | mapped |
| `rust/lance/src/index/scalar/zonemap.rs` | 1-94 | mapped |
<a id="rust-lance-src-index-vector"></a>

### `rust/lance/src/index/vector/`

Dataset-owned vector build/open/update integration, including IVF partition handling. Numerical compression/storage mechanisms are in lance-index; manifest publication stays here.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/index/vector/bounded_partition_stream.rs` | 1-30, 43-157, 162-185, 230-271, 288-288, 298-359 | mapped |
| `rust/lance/src/index/vector/builder.rs` | 1-301, 308-3251 | mapped |
| `rust/lance/src/index/vector/dedup.rs` | 1-597 | mapped |
| `rust/lance/src/index/vector/details.rs` | 1-737 | mapped |
| `rust/lance/src/index/vector/hamming.rs` | 1-713 | mapped |
| `rust/lance/src/index/vector/ivf.rs` | 1-2568, 2594-5465 | mapped |
| `rust/lance/src/index/vector/ivf/builder.rs` | 1-310 | mapped |
| `rust/lance/src/index/vector/ivf/io.rs` | 1-671 | mapped |
| `rust/lance/src/index/vector/ivf/partition_serde.rs` | 1-488 | mapped |
| `rust/lance/src/index/vector/ivf/v2.rs` | 1-527, 532-533, 538-1710, 1715-3051 | mapped |
| `rust/lance/src/index/vector/pq.rs` | 1-694 | mapped |
| `rust/lance/src/index/vector/utils.rs` | 1-1190 | mapped |
<a id="rust-lance-src-io"></a>

### `rust/lance/src/io/`

Dataset-aware commit, deletion, execution and object-store composition. This layer supplies dataset context to lower-level I/O and publication contracts.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/io/commit.rs` | 1-30, 33-81, 86-86, 89-170, 181-422, 425-854, 859-879, 884-2087 | mapped |
| `rust/lance/src/io/deletion.rs` | 1-43 | mapped |
| `rust/lance/src/io/exec.rs` | 1-28, 31-66 | mapped |
| `rust/lance/src/io/object_store.rs` | 1-5 | mapped |
<a id="rust-lance-src-io-commit"></a>

### `rust/lance/src/io/commit/`

Commit support for conflict resolution, retry preparation and operation-specific publication context. This is the extension route for a new operation after the table-level intent/codec changes; read io/commit.rs first.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/io/commit/conflict_resolver.rs` | 1-3385 | mapped |
| `rust/lance/src/io/commit/dynamodb.rs` | 1-10 | mapped |
| `rust/lance/src/io/commit/external_manifest.rs` | 1-4 | mapped |
| `rust/lance/src/io/commit/namespace_manifest.rs` | 1-210 | mapped |
<a id="rust-lance-src-io-exec"></a>

### `rust/lance/src/io/exec/`

Dataset physical execution nodes consume planned projections, filters, row selections and vector candidates. Choose the node named by Scanner planning; do not change all nodes for a single pushdown task.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/io/exec/ann_proto.rs` | 1-301 | mapped |
| `rust/lance/src/io/exec/count_from_mask.rs` | 1-481 | mapped |
| `rust/lance/src/io/exec/count_pushdown.rs` | 1-462 | mapped |
| `rust/lance/src/io/exec/filter.rs` | 1-127 | mapped |
| `rust/lance/src/io/exec/filtered_read.rs` | 1-3827 | mapped |
| `rust/lance/src/io/exec/filtered_read_proto.rs` | 1-536 | mapped |
| `rust/lance/src/io/exec/fts.rs` | 1-5924 | mapped |
| `rust/lance/src/io/exec/knn.rs` | 1-3, 6-3062 | mapped |
| `rust/lance/src/io/exec/knn/adaptive_probe.rs` | 1-332 | mapped |
| `rust/lance/src/io/exec/minhash.rs` | 1-515 | mapped |
| `rust/lance/src/io/exec/optimizer.rs` | 1-221 | mapped |
| `rust/lance/src/io/exec/projection.rs` | 1-225 | mapped |
| `rust/lance/src/io/exec/pushdown_scan.rs` | 1-718 | mapped |
| `rust/lance/src/io/exec/row_addr_mask.rs` | 1-161 | mapped |
| `rust/lance/src/io/exec/rowids.rs` | 1-585 | mapped |
| `rust/lance/src/io/exec/scalar_index.rs` | 1-1198 | mapped |
| `rust/lance/src/io/exec/scan.rs` | 1-892 | mapped |
| `rust/lance/src/io/exec/table_identifier.rs` | 1-88 | mapped |
| `rust/lance/src/io/exec/take.rs` | 1-804 | mapped |
| `rust/lance/src/io/exec/utils.rs` | 1-1258 | mapped |
<a id="rust-lance-src-session"></a>

### `rust/lance/src/session/`

Session registries and cache configuration shared by Dataset handles. Treat cache identity and store reuse separately from persisted Dataset state.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/session/caches.rs` | 1-353 | mapped |
| `rust/lance/src/session/index_caches.rs` | 1-310 | mapped |
| `rust/lance/src/session/index_extension.rs` | 1-3, 6-54 | mapped |
<a id="rust-lance-src-utils"></a>

### `rust/lance/src/utils/`

Mapped-only local helpers; callers own higher-level Dataset policy.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance/src/utils/future.rs` | 1-60 | mapped |
| `rust/lance/src/utils/temporal.rs` | 1-8, 11-35 | mapped |

## Key types and files

### Dataset

`rust/lance/src/dataset.rs` — read `951-980,1688-1705`.

Owns the public Dataset write and scan entry points.  
Write delegates to InsertBuilder and returns the committed Dataset.  
Scan creates a Scanner over a cloned snapshot.  
Read these entry ranges before following the four paths in L0.

[Selected contract record](../L2-files/rust/lance/src/dataset.rs.md).

### Scanner

`rust/lance/src/dataset/scanner.rs` — read `2999-3042,3633-3801`.

Turns configured requests into physical plans and batch streams.  
Validate options before choosing vector, full-text, MinHash or filtered read sources.  
Planning separates source/filter/order/limit/projection stages.  
Read this file for query behavior; physical execution support lives in lance-datafusion.

[Selected contract record](../L2-files/rust/lance/src/dataset/scanner.rs.md).

### InsertBuilder

`rust/lance/src/dataset/write/insert.rs` — read `108-320`.

Converts inputs to a stream/schema and writes uncommitted fragments.  
Builds Overwrite or Append transaction intent from write mode.  
The committed path configures CommitBuilder; uncommitted methods stop before publication.  
Use this boundary when changing ingestion parameters or commit timing.

[Selected contract record](../L2-files/rust/lance/src/dataset/write/insert.rs.md).

### CompactionPlanner / RewriteResult

`rust/lance/src/dataset/optimize.rs` — read `1028-1152,2494-2569,3227-3337,3662-3693`.

Coordinates planner tasks, rewrite work and compaction publication.  
Carries original read versions through distributed RewriteResults.  
Uses the minimum task read version for conflict coverage.  
Tagged fragment-reuse histories require deferred remapping in the checked path.

[Selected contract record](../L2-files/rust/lance/src/dataset/optimize.rs.md).

## Contracts and extension boundaries

**Public mutation boundary.** Dataset::write → InsertBuilder::execute_stream → CommitBuilder. Uncommitted insert methods deliberately omit manifest publication. (rust/lance/src/dataset.rs:951-980; rust/lance/src/dataset/write/insert.rs:108-183)

**Query planning.** Scalar index use requires prefiltering or no nearest search. Nearest/full-text/MinHash modes cannot be combined indiscriminately. (rust/lance/src/dataset/scanner.rs:3716-3801)

**Compaction conflicts.** A refreshed Dataset handle must not replace the original task read version; doing so would skip intervening writes during conflict checks. (rust/lance/src/dataset/optimize.rs:3274-3297; rust/lance/src/dataset/optimize.rs:3662-3693)

M3 supplies the complete API-family/protocol decision tables and recipe navigation. This Module Map establishes ownership and the checked seams; it does not claim runtime qualification.


## Index lifecycle contract

See [index build, query and maintenance](../L3-symbols/protocol-index.md) for the scalar plugin seam, IVF-PQ build, whole-name segment maintenance and coverage/rebase rules.


## Public API route

[Public API family contracts and declaration directories](../L3-symbols/public-api.md) distinguish source-declared interfaces from checked implementation behavior and provide binding-to-engine read sets.

## Refresh: DatasetBuilder reference loading

The mapped builder entry now spans production lines 1–951. Its changed delayed-checkout branch first loads the URI chain's latest manifest, then resolves the requested branch/version; it no longer asks the initial chain for the target branch's version. Read the canonical [reference-resolution contract](../L3-symbols/public-api.md#dataset-open-reference-resolution), then rust/lance/src/dataset/builder.rs:734-866. The existing builder remains mapped; no new per-file L2 is required for this focused refresh.

<a id="rust-lance-src-dataset-blob"></a>
## `rust/lance/src/dataset/blob/` — managed object cloning

Copies Managed payloads for an independent deep clone and rebinds nested descriptors to destination-local objects. The entry point is `copy_blob_columns`; descriptor recursion and targeted column rewrites preserve fragment identity and unrelated column files.

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance/src/dataset/blob/clone.rs` | 1-259 | key-file |

### Key File: managed blob clone

[rust/lance/src/dataset/blob/clone.rs](../L2-files/rust/lance/src/dataset/blob/clone.rs.md) — read `1-259`.
Copies each discovered managed object once, keeping local relative paths and allocating fresh `_blobs` names for registered-base objects.
Recursively replaces the latter descriptors in structs/lists while preserving nulls and byte ranges.
Rewrites blob-containing columns, prunes replaced file fields, and substitutes resulting fragments before the clone manifest is published.

## Source refresh — 2026-10-07

Pinned `84d1681e07af565837f2d97e72ff1b8b040cd15c`. The entries below have updated source ranges. Their directory responsibilities remain as mapped; behavior changes are governed by [current delta contracts](../L3-symbols/refresh-2026-10-07.md). Ordinary files remain mapped, and Java/peripherals remain mapped only.

- `rust/lance/src/blob.rs`
- `rust/lance/src/dataset.rs`
- `rust/lance/src/dataset/blob.rs`
- `rust/lance/src/dataset/blob/clone.rs`
- `rust/lance/src/dataset/cleanup.rs`
- `rust/lance/src/dataset/data_file.rs`
- `rust/lance/src/dataset/fragment.rs`
- `rust/lance/src/dataset/index.rs`
- `rust/lance/src/dataset/index/frag_reuse.rs`
- `rust/lance/src/dataset/mem_wal/api.rs`
- `rust/lance/src/dataset/mem_wal/memtable/flush.rs`
- `rust/lance/src/dataset/mem_wal/scanner/block_list.rs`
- `rust/lance/src/dataset/mem_wal/scanner/fts_search.rs`
- `rust/lance/src/dataset/mem_wal/scanner/planner.rs`
- `rust/lance/src/dataset/mem_wal/scanner/vector_search.rs`
- `rust/lance/src/dataset/optimize.rs`
- `rust/lance/src/dataset/optimize/remapping.rs`
- `rust/lance/src/dataset/rowids.rs`
- `rust/lance/src/dataset/scanner.rs`
- `rust/lance/src/dataset/schema_evolution.rs`
- `rust/lance/src/dataset/versions/mod.rs`
- `rust/lance/src/dataset/write.rs`
- `rust/lance/src/dataset/write/commit.rs`
- `rust/lance/src/dataset/write/merge_insert.rs`
- `rust/lance/src/dataset/write/merge_insert/exec/write.rs`
- `rust/lance/src/dataset/write/update.rs`
- `rust/lance/src/index.rs`
- `rust/lance/src/index/api.rs`
- `rust/lance/src/index/append.rs`
- `rust/lance/src/index/create.rs`
- `rust/lance/src/index/frag_reuse.rs`
- `rust/lance/src/index/frag_reuse_reader.rs`
- `rust/lance/src/index/frag_reuse_reader/cache.rs`
- `rust/lance/src/index/scalar.rs`
- `rust/lance/src/index/scalar/bitmap.rs`
- `rust/lance/src/index/scalar/bloomfilter.rs`
- `rust/lance/src/index/scalar/btree.rs`
- `rust/lance/src/index/scalar/fmindex.rs`
- `rust/lance/src/index/scalar/inverted.rs`
- `rust/lance/src/index/scalar/label_list.rs`
- `rust/lance/src/index/scalar/minhash_lsh.rs`
- `rust/lance/src/index/scalar/ngram.rs`
- `rust/lance/src/index/scalar/rtree.rs`
- `rust/lance/src/index/scalar/zonemap.rs`
- `rust/lance/src/index/scalar_logical.rs`
- `rust/lance/src/index/vector.rs`
- `rust/lance/src/index/vector/builder.rs`
- `rust/lance/src/index/vector/ivf.rs`
- `rust/lance/src/index/vector/ivf/v2.rs`
- `rust/lance/src/index/vector/pq.rs`
- `rust/lance/src/io/commit.rs`
- `rust/lance/src/io/commit/conflict_resolver.rs`
- `rust/lance/src/io/exec/count_from_mask.rs`
- `rust/lance/src/io/exec/count_pushdown.rs`
- `rust/lance/src/io/exec/filtered_read.rs`
- `rust/lance/src/io/exec/filtered_read_proto.rs`
- `rust/lance/src/io/exec/scan.rs`
- `rust/lance/src/session/index_caches.rs`

<a id="rust-lance-src-dataset-updater"></a>

### Refresh map: `rust/lance/src/dataset/updater/`

Chooses typed placeholders for deleted physical rows during column rewrites; compacts reusable blank sources to bound retained payload memory.

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance/src/dataset/updater/blanks.rs` | 1-1087 | mapped |

<a id="rust-lance-src-index-vector-ivf-coreset-algo"></a>

### Refresh map: `rust/lance/src/index/vector/ivf/coreset_algo/`

Float-metric adapter for streaming coreset selection and weighted reclustering. Binary-vector Hamming coreset adapter with bit-majority centers. Shared coreset algorithm traits and metric-specific module boundary.

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance/src/index/vector/ivf/coreset_algo/float_coreset.rs` | 1-174 | mapped |
| `rust/lance/src/index/vector/ivf/coreset_algo/hamming_coreset.rs` | 1-140 | mapped |
| `rust/lance/src/index/vector/ivf/coreset_algo/mod.rs` | 1-92 | mapped |

<a id="rust-lance-src-index-vector-ivf"></a>

### Refresh map: `rust/lance/src/index/vector/ivf/`

Streaming Hamming IVF training, weighted k-modes initialization and refinement under sample/memory limits.

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance/src/index/vector/ivf/streaming_hamming.rs` | 1-23, 26-104, 132-933 | mapped |

<a id="rust-lance-src-index-vector-ivf-streaming-hamming"></a>

### Refresh map: `rust/lance/src/index/vector/ivf/streaming_hamming/`

Packed bit-count accumulators and Hamming center majority state.

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance/src/index/vector/ivf/streaming_hamming/counter.rs` | 1-231, 242-425, 430-430 | mapped |

### Refresh map: `rust/lance/src/io/exec/`

Public physical optimizer: narrows eligible top-k reads, takes deferred columns after sort, and restores the original output schema.

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance/src/io/exec/topk_late_materialization.rs` | 1-447 | key-file |

### Key File: top-k late materialization

[Focused record](../L2-files/rust/lance/src/io/exec/topk_late_materialization.rs.md) — `rust/lance/src/io/exec/topk_late_materialization.rs:1-446`.
Recognizes eligible sort/merge top-k shapes over FilteredReadExec.
Validates pass-through nodes and dataset identity before narrowing reads.
Rebuilds sort expressions and defers remaining columns to TakeExec.
Restores column order/metadata; unsupported shapes retain their original plan.

## Source refresh — 2026-10-09

Pin `db684d1f0726c00b6defb7963a604a7719e82b5a`. [Changed contracts](../L3-symbols/refresh-2026-10-09.md) cover affected behavior. The following entries have current production ranges; unchanged directory responsibilities and mapped-only limits remain.

- `rust/lance/src/dataset/blob.rs`
- `rust/lance/src/dataset/blob/clone.rs`
- `rust/lance/src/dataset/cleanup.rs`
- `rust/lance/src/dataset/fragment.rs`
- `rust/lance/src/dataset/mem_wal/api.rs`
- `rust/lance/src/dataset/mem_wal/memtable.rs`
- `rust/lance/src/dataset/mem_wal/memtable/batch_store.rs`
- `rust/lance/src/dataset/mem_wal/memtable/flush.rs`
- `rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs`
- `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/brute_force_vector.rs`
- `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/dedup_scan.rs`
- `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/fts.rs`
- `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/scan.rs`
- `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/vector.rs`
- `rust/lance/src/dataset/mem_wal/scanner/fts_search.rs`
- `rust/lance/src/dataset/mem_wal/scanner/generation_read.rs`
- `rust/lance/src/dataset/mem_wal/scanner/planner.rs`
- `rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs`
- `rust/lance/src/dataset/mem_wal/scanner/projection.rs`
- `rust/lance/src/dataset/mem_wal/scanner/vector_search.rs`
- `rust/lance/src/dataset/mem_wal/wal.rs`
- `rust/lance/src/dataset/mem_wal/write.rs`
- `rust/lance/src/dataset/rowids/spill.rs`
- `rust/lance/src/dataset/scanner.rs`
- `rust/lance/src/dataset/schema_evolution.rs`
- `rust/lance/src/dataset/updater.rs`
- `rust/lance/src/dataset/updater/blanks.rs`
- `rust/lance/src/index.rs`
- `rust/lance/src/index/append.rs`
- `rust/lance/src/index/create.rs`
- `rust/lance/src/index/frag_reuse_with_stable_row_ids.rs`
- `rust/lance/src/index/scalar.rs`
- `rust/lance/src/index/scalar_logical.rs`
- `rust/lance/src/index/vector.rs`
- `rust/lance/src/index/vector/ivf.rs`
- `rust/lance/src/index/vector/ivf/coreset_algo/float_coreset.rs`
- `rust/lance/src/index/vector/ivf/coreset_algo/hamming_coreset.rs`
- `rust/lance/src/index/vector/ivf/coreset_algo/mod.rs`
- `rust/lance/src/index/vector/ivf/streaming_hamming.rs`
- `rust/lance/src/index/vector/ivf/streaming_hamming/counter.rs`
- `rust/lance/src/index/vector/utils.rs`
- `rust/lance/src/io/exec.rs`
- `rust/lance/src/io/exec/filtered_read.rs`
- `rust/lance/src/io/exec/scalar_index.rs`
- `rust/lance/src/io/exec/take.rs`
- `rust/lance/src/io/exec/topk_late_materialization.rs`

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance/src/dataset/fragment_slice.rs` | 1-92 | key-file |

<a id="rust-lance-src-dataset-mem-wal-index"></a>

### `rust/lance/src/dataset/mem_wal/index/`

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance/src/dataset/mem_wal/index/filter.rs` | 1-212 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance/src/dataset/mem_wal/index/pk.rs` | 1-269 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance/src/dataset/mem_wal/index/plugin.rs` | 1-706 | key-file |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance/src/dataset/mem_wal/index/query.rs` | 1-353 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|

<a id="rust-lance-src-dataset-mem-wal-memtable-scanner-exec"></a>

### `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/`

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/scalar_index.rs` | 1-521 | mapped |

## Source refresh map — 2026-10-11

Current source `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`. [Changed contracts](../L3-symbols/refresh-2026-10-11.md). Existing directory responsibilities remain; declarations below locate changed boundaries.

### `rust/lance/src/blob.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `blob_field` (rust/lance/src/blob.rs:55-55), `BlobFieldOptions` (rust/lance/src/blob.rs:61-61), `with_inline_size_threshold` (rust/lance/src/blob.rs:73-73), `with_dedicated_size_threshold` (rust/lance/src/blob.rs:79-79), `blob_field_with_options` (rust/lance/src/blob.rs:107-107), `prepared_blob_field_with_metadata` (rust/lance/src/blob.rs:131-131), `logical_to_prepared_blob_schema` (rust/lance/src/blob.rs:173-173), `prepared_to_descriptor_blob_schema` (rust/lance/src/blob.rs:221-221).

### `rust/lance/src/dataset.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `Dataset` (rust/lance/src/dataset.rs:220-220), `BaseObjectStores` (rust/lance/src/dataset.rs:259-259), `Version` (rust/lance/src/dataset.rs:276-276), `VersionRef` (rust/lance/src/dataset.rs:290-290), `VersionTransaction` (rust/lance/src/dataset.rs:312-312), `ReadParams` (rust/lance/src/dataset.rs:325-325), `index_cache_size` (rust/lance/src/dataset.rs:374-374), `index_cache_size_bytes` (rust/lance/src/dataset.rs:380-380).

### `rust/lance/src/dataset/cleanup.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `RemovalStats` (rust/lance/src/dataset/cleanup.rs:90-90), `CleanupExplanation` (rust/lance/src/dataset/cleanup.rs:108-108), `CleanupCandidateFile` (rust/lance/src/dataset/cleanup.rs:127-127), `CleanupReferencedBranch` (rust/lance/src/dataset/cleanup.rs:141-141), `CleanupFileKind` (rust/lance/src/dataset/cleanup.rs:151-151), `CleanupOperation` (rust/lance/src/dataset/cleanup.rs:404-404), `new` (rust/lance/src/dataset/cleanup.rs:411-411), `with_max_candidate_files` (rust/lance/src/dataset/cleanup.rs:423-423).

### `rust/lance/src/dataset/fragment.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `FragmentUpdateColumnsResult` (rust/lance/src/dataset/fragment.rs:85-85), `FileFragment` (rust/lance/src/dataset/fragment.rs:96-96), `GenericFileReader` (rust/lance/src/dataset/fragment.rs:113-113), `legacy_blob_read_schema` (rust/lance/src/dataset/fragment.rs:321-321), `Reader` (rust/lance/src/dataset/fragment.rs:428-428), `new` (rust/lance/src/dataset/fragment.rs:437-437), `BaseSchedulers` (rust/lance/src/dataset/fragment.rs:742-742), `new` (rust/lance/src/dataset/fragment.rs:759-759).

### `rust/lance/src/dataset/fragment_slice.rs`

Validates physical fragment ranges and unions them into a row-address set.

Key declarations: `FragmentSlice` (rust/lance/src/dataset/fragment_slice.rs:17-17), `physical_rows_from_slices` (rust/lance/src/dataset/fragment_slice.rs:26-26), `validate_physical_rows` (rust/lance/src/dataset/fragment_slice.rs:69-69).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance/src/dataset/fragment_slice.rs` | 1-92 | key-file |

[Focused Key File](../L2-files/rust/lance/src/dataset/fragment_slice.rs.md).
Owns the interface described above.
Callers must enforce its contract before modifying helper implementations.
Verified ranges are explicit in the focused record; other bodies remain mapped.

### `rust/lance/src/dataset/mem_wal.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `MemTableDataTarget` (rust/lance/src/dataset/mem_wal.rs:86-86), `new` (rust/lance/src/dataset/mem_wal.rs:95-95), `generation_path` (rust/lance/src/dataset/mem_wal.rs:106-106), `data_file_key` (rust/lance/src/dataset/mem_wal.rs:110-110), `tombstone_field` (rust/lance/src/dataset/mem_wal.rs:148-148), `relax_non_pk_nullability` (rust/lance/src/dataset/mem_wal.rs:165-165), `arrow_schema_with_field_ids` (rust/lance/src/dataset/mem_wal.rs:199-199), `schema_with_tombstone` (rust/lance/src/dataset/mem_wal.rs:265-265).

### `rust/lance/src/dataset/mem_wal/api.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `InitializeMemWalBuilder` (rust/lance/src/dataset/mem_wal/api.rs:160-160), `unsharded` (rust/lance/src/dataset/mem_wal/api.rs:180-180), `bucket_sharding` (rust/lance/src/dataset/mem_wal/api.rs:190-190), `identity_sharding` (rust/lance/src/dataset/mem_wal/api.rs:205-205), `maintained_indexes` (rust/lance/src/dataset/mem_wal/api.rs:218-218), `mem_index_registry` (rust/lance/src/dataset/mem_wal/api.rs:229-229), `writer_config_defaults` (rust/lance/src/dataset/mem_wal/api.rs:245-245), `add_writer_config_default` (rust/lance/src/dataset/mem_wal/api.rs:255-255).

### `rust/lance/src/dataset/mem_wal/index.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `RowPosition` (rust/lance/src/dataset/mem_wal/index.rs:57-57), `validate_index_specs` (rust/lance/src/dataset/mem_wal/index.rs:83-83), `unsupported_index_type` (rust/lance/src/dataset/mem_wal/index.rs:131-131), `MemTableVisibility` (rust/lance/src/dataset/mem_wal/index.rs:150-150), `IndexStore` (rust/lance/src/dataset/mem_wal/index.rs:168-168), `new` (rust/lance/src/dataset/mem_wal/index.rs:238-238), `from_specs` (rust/lance/src/dataset/mem_wal/index.rs:245-245), `add_index` (rust/lance/src/dataset/mem_wal/index.rs:268-268).

### `rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `new_skiplist` (rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:231-231), `SkipListWriter` (rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:244-244), `insert_and_check_neighbors` (rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:277-277), `SkipListReader` (rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:354-354), `resident_bytes` (rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:366-366), `upper_bound_with` (rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:373-373), `iter` (rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:418-418), `range_from` (rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:426-426).

### `rust/lance/src/dataset/mem_wal/index/btree.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `IndexKey` (rust/lance/src/dataset/mem_wal/index/btree.rs:54-54), `BTreeMemIndex` (rust/lance/src/dataset/mem_wal/index/btree.rs:1042-1042), `new` (rust/lance/src/dataset/mem_wal/index/btree.rs:1060-1060), `get_newest_visible` (rust/lance/src/dataset/mem_wal/index/btree.rs:1072-1072), `field_id` (rust/lance/src/dataset/mem_wal/index/btree.rs:1083-1083), `insert` (rust/lance/src/dataset/mem_wal/index/btree.rs:1088-1088), `insert_and_report_existing` (rust/lance/src/dataset/mem_wal/index/btree.rs:1095-1095), `get` (rust/lance/src/dataset/mem_wal/index/btree.rs:1119-1119).

### `rust/lance/src/dataset/mem_wal/index/filter.rs`

Plans memtable scalar filter queries through plugin query parsers and certainty bounds.

Key declarations: `MemIndexCatalog` (rust/lance/src/dataset/mem_wal/index/filter.rs:35-35), `new` (rust/lance/src/dataset/mem_wal/index/filter.rs:44-44), `add_own_key_index` (rust/lance/src/dataset/mem_wal/index/filter.rs:64-64), `is_empty` (rust/lance/src/dataset/mem_wal/index/filter.rs:87-87), `IndexedFilter` (rust/lance/src/dataset/mem_wal/index/filter.rs:102-102), `plan_filter` (rust/lance/src/dataset/mem_wal/index/filter.rs:111-111), `evaluate` (rust/lance/src/dataset/mem_wal/index/filter.rs:161-161).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance/src/dataset/mem_wal/index/filter.rs` | 1-212 | mapped |

### `rust/lance/src/dataset/mem_wal/index/fts.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `FtsEntry` (rust/lance/src/dataset/mem_wal/index/fts.rs:90-90), `FtsQueryExpr` (rust/lance/src/dataset/mem_wal/index/fts.rs:135-135), `SearchOptions` (rust/lance/src/dataset/mem_wal/index/fts.rs:218-218), `new` (rust/lance/src/dataset/mem_wal/index/fts.rs:250-250), `with_wand_factor` (rust/lance/src/dataset/mem_wal/index/fts.rs:255-255), `with_limit` (rust/lance/src/dataset/mem_wal/index/fts.rs:261-261), `with_include_tail` (rust/lance/src/dataset/mem_wal/index/fts.rs:267-267), `with_tail_skip` (rust/lance/src/dataset/mem_wal/index/fts.rs:273-273).

### `rust/lance/src/dataset/mem_wal/index/hnsw.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `mem_wal_hnsw_default` (rust/lance/src/dataset/mem_wal/index/hnsw.rs:67-67), `HnswMemIndex` (rust/lance/src/dataset/mem_wal/index/hnsw.rs:74-74), `with_capacity` (rust/lance/src/dataset/mem_wal/index/hnsw.rs:107-107), `field_id` (rust/lance/src/dataset/mem_wal/index/hnsw.rs:127-127), `column_name` (rust/lance/src/dataset/mem_wal/index/hnsw.rs:131-131), `distance_type` (rust/lance/src/dataset/mem_wal/index/hnsw.rs:135-135), `build_params` (rust/lance/src/dataset/mem_wal/index/hnsw.rs:139-139), `capacity` (rust/lance/src/dataset/mem_wal/index/hnsw.rs:143-143).

### `rust/lance/src/dataset/mem_wal/index/pk.rs`

Maintains primary-key visibility and per-row duplicate state for memtables.

Key declarations: `PkIndex` (rust/lance/src/dataset/mem_wal/index/pk.rs:25-25), `OwnedPk` (rust/lance/src/dataset/mem_wal/index/pk.rs:38-38), `new` (rust/lance/src/dataset/mem_wal/index/pk.rs:53-53), `index` (rust/lance/src/dataset/mem_wal/index/pk.rs:90-90), `owned` (rust/lance/src/dataset/mem_wal/index/pk.rs:98-98), `describe` (rust/lance/src/dataset/mem_wal/index/pk.rs:105-105), `btree` (rust/lance/src/dataset/mem_wal/index/pk.rs:117-117), `insert` (rust/lance/src/dataset/mem_wal/index/pk.rs:125-125).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance/src/dataset/mem_wal/index/pk.rs` | 1-269 | mapped |

### `rust/lance/src/dataset/mem_wal/index/pk_key.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `encode_pk_tuple` (rust/lance/src/dataset/mem_wal/index/pk_key.rs:85-85), `encode_pk_batch` (rust/lance/src/dataset/mem_wal/index/pk_key.rs:107-107), `is_encodable` (rust/lance/src/dataset/mem_wal/index/pk_key.rs:116-116).

### `rust/lance/src/dataset/mem_wal/index/plugin.rs`

Public MemWAL index lifecycle, registry, build/resolve/flush contexts and identity comparison.

Key declarations: `MemIndexParams` (rust/lance/src/dataset/mem_wal/index/plugin.rs:40-40), `MemIndexBuildContext` (rust/lance/src/dataset/mem_wal/index/plugin.rs:52-52), `single_column` (rust/lance/src/dataset/mem_wal/index/plugin.rs:72-72), `check_columns_resolve` (rust/lance/src/dataset/mem_wal/index/plugin.rs:85-85), `check_top_level_columns` (rust/lance/src/dataset/mem_wal/index/plugin.rs:115-115), `params` (rust/lance/src/dataset/mem_wal/index/plugin.rs:131-131), `ResolveContext` (rust/lance/src/dataset/mem_wal/index/plugin.rs:145-145), `new` (rust/lance/src/dataset/mem_wal/index/plugin.rs:164-164).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance/src/dataset/mem_wal/index/plugin.rs` | 1-706 | key-file |

[Focused Key File](../L2-files/rust/lance/src/dataset/mem_wal/index/plugin.rs.md).
Owns the interface described above.
Callers must enforce its contract before modifying helper implementations.
Verified ranges are explicit in the focused record; other bodies remain mapped.

### `rust/lance/src/dataset/mem_wal/index/query.rs`

Memtable query types, position sets, certainty bounds and ranked results.

Key declarations: `MemQuery` (rust/lance/src/dataset/mem_wal/index/query.rs:22-22), `ScalarQuery` (rust/lance/src/dataset/mem_wal/index/query.rs:36-36), `PositionSet` (rust/lance/src/dataset/mem_wal/index/query.rs:46-46), `empty` (rust/lance/src/dataset/mem_wal/index/query.rs:50-50), `all_visible` (rust/lance/src/dataset/mem_wal/index/query.rs:55-55), `is_empty` (rust/lance/src/dataset/mem_wal/index/query.rs:62-62), `len` (rust/lance/src/dataset/mem_wal/index/query.rs:67-67), `contains` (rust/lance/src/dataset/mem_wal/index/query.rs:72-72).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance/src/dataset/mem_wal/index/query.rs` | 1-353 | mapped |

### `rust/lance/src/dataset/mem_wal/memtable/flush.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `FlushResult` (rust/lance/src/dataset/mem_wal/memtable/flush.rs:40-40), `MemTableFlusher` (rust/lance/src/dataset/mem_wal/memtable/flush.rs:69-69), `new` (rust/lance/src/dataset/mem_wal/memtable/flush.rs:130-130), `with_warmer` (rust/lance/src/dataset/mem_wal/memtable/flush.rs:150-150), `with_storage_context` (rust/lance/src/dataset/mem_wal/memtable/flush.rs:157-157), `flush` (rust/lance/src/dataset/mem_wal/memtable/flush.rs:283-283), `flush_with_indexes` (rust/lance/src/dataset/mem_wal/memtable/flush.rs:554-554), `TriggerMemTableFlush` (rust/lance/src/dataset/mem_wal/memtable/flush.rs:794-794).

### `rust/lance/src/dataset/mem_wal/memtable/scanner.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

### `rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `VectorQuery` (rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:37-37), `mem_query` (rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:64-64), `FtsQuery` (rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:99-99), `index_questions` (rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:125-125), `is_answered_by` (rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:143-143), `new` (rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:153-153), `cross_column` (rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:165-165), `columns` (rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:191-191).

### `rust/lance/src/dataset/mem_wal/memtable/scanner/exec.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `scan_record_batch` (rust/lance/src/dataset/mem_wal/memtable/scanner/exec.rs:42-42), `take_projected_columns` (rust/lance/src/dataset/mem_wal/memtable/scanner/exec.rs:55-55), `newest_pk_positions` (rust/lance/src/dataset/mem_wal/memtable/scanner/exec.rs:88-88).

### `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/fts.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `FtsIndexExec` (rust/lance/src/dataset/mem_wal/memtable/scanner/exec/fts.rs:61-61), `new` (rust/lance/src/dataset/mem_wal/memtable/scanner/exec/fts.rs:110-110), `with_filter` (rust/lance/src/dataset/mem_wal/memtable/scanner/exec/fts.rs:200-200), `with_pk_columns` (rust/lance/src/dataset/mem_wal/memtable/scanner/exec/fts.rs:206-206).

### `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/scalar_index.rs`

Executes memtable scalar plugin queries with visibility, projection and residual checks.

Key declarations: `ScalarMemIndexExec` (rust/lance/src/dataset/mem_wal/memtable/scanner/exec/scalar_index.rs:56-56), `new` (rust/lance/src/dataset/mem_wal/memtable/scanner/exec/scalar_index.rs:101-101), `with_newest_check` (rust/lance/src/dataset/mem_wal/memtable/scanner/exec/scalar_index.rs:140-140).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/scalar_index.rs` | 1-521 | mapped |

### `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/vector.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `VectorIndexExec` (rust/lance/src/dataset/mem_wal/memtable/scanner/exec/vector.rs:36-36), `new` (rust/lance/src/dataset/mem_wal/memtable/scanner/exec/vector.rs:82-82).

### `rust/lance/src/dataset/mem_wal/reconcile.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `field_id_of` (rust/lance/src/dataset/mem_wal/reconcile.rs:36-36), `relabel_to` (rust/lance/src/dataset/mem_wal/reconcile.rs:50-50), `without_field_ids_in` (rust/lance/src/dataset/mem_wal/reconcile.rs:86-86), `without_field_id` (rust/lance/src/dataset/mem_wal/reconcile.rs:92-92), `without_field_ids` (rust/lance/src/dataset/mem_wal/reconcile.rs:103-103), `Plan` (rust/lance/src/dataset/mem_wal/reconcile.rs:153-153), `emitting_plain_schema` (rust/lance/src/dataset/mem_wal/reconcile.rs:168-168), `resolve` (rust/lance/src/dataset/mem_wal/reconcile.rs:188-188).

### `rust/lance/src/dataset/mem_wal/scanner/builder.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `LsmScanner` (rust/lance/src/dataset/mem_wal/scanner/builder.rs:195-195), `new` (rust/lance/src/dataset/mem_wal/scanner/builder.rs:253-253), `without_base_table` (rust/lance/src/dataset/mem_wal/scanner/builder.rs:309-309), `with_active_memtable` (rust/lance/src/dataset/mem_wal/scanner/builder.rs:344-344), `with_identity_schema` (rust/lance/src/dataset/mem_wal/scanner/builder.rs:364-364), `with_in_memory_memtables` (rust/lance/src/dataset/mem_wal/scanner/builder.rs:373-373), `with_session` (rust/lance/src/dataset/mem_wal/scanner/builder.rs:384-384), `with_store_params` (rust/lance/src/dataset/mem_wal/scanner/builder.rs:396-396).

### `rust/lance/src/dataset/mem_wal/scanner/fts_search.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `LsmFtsSearchPlanner` (rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:571-571), `new` (rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:596-596), `with_filter` (rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:618-618), `with_overfetch_factor` (rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:626-626), `with_identity_schema` (rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:636-636), `with_session` (rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:642-642), `with_store_params` (rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:648-648), `with_sstable_cache` (rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:655-655).

### `rust/lance/src/dataset/mem_wal/scanner/generation_read.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `GenerationRead` (rust/lance/src/dataset/mem_wal/scanner/generation_read.rs:47-47), `new` (rust/lance/src/dataset/mem_wal/scanner/generation_read.rs:70-70), `for_memtable` (rust/lance/src/dataset/mem_wal/scanner/generation_read.rs:88-88), `stored_name` (rust/lance/src/dataset/mem_wal/scanner/generation_read.rs:130-130), `stored_fts_name` (rust/lance/src/dataset/mem_wal/scanner/generation_read.rs:137-137), `stored_pk_columns` (rust/lance/src/dataset/mem_wal/scanner/generation_read.rs:145-145), `also_produce` (rust/lance/src/dataset/mem_wal/scanner/generation_read.rs:161-161), `stored_projection` (rust/lance/src/dataset/mem_wal/scanner/generation_read.rs:171-171).

### `rust/lance/src/dataset/mem_wal/scanner/planner.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `LsmScanPlanner` (rust/lance/src/dataset/mem_wal/scanner/planner.rs:42-42), `new` (rust/lance/src/dataset/mem_wal/scanner/planner.rs:67-67), `with_memtable_filter_indexes` (rust/lance/src/dataset/mem_wal/scanner/planner.rs:87-87), `with_session` (rust/lance/src/dataset/mem_wal/scanner/planner.rs:93-93), `with_store_params` (rust/lance/src/dataset/mem_wal/scanner/planner.rs:99-99), `with_sstable_cache` (rust/lance/src/dataset/mem_wal/scanner/planner.rs:106-106), `with_warmer` (rust/lance/src/dataset/mem_wal/scanner/planner.rs:112-112), `plan_scan` (rust/lance/src/dataset/mem_wal/scanner/planner.rs:139-139).

### `rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `LsmPointLookupPlanner` (rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:85-85), `new` (rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:141-141), `with_identity_schema` (rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:166-166), `with_visibility` (rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:174-174), `with_session` (rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:180-180), `with_store_params` (rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:186-186), `with_sstable_cache` (rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:196-196), `with_warmer` (rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:202-202).

### `rust/lance/src/dataset/mem_wal/wal.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `WalFlushFailure` (rust/lance/src/dataset/mem_wal/wal.rs:86-86), `from_error` (rust/lance/src/dataset/mem_wal/wal.rs:94-94), `into_error` (rust/lance/src/dataset/mem_wal/wal.rs:102-102), `WriterCursors` (rust/lance/src/dataset/mem_wal/wal.rs:132-132), `new` (rust/lance/src/dataset/mem_wal/wal.rs:149-149), `durable` (rust/lance/src/dataset/mem_wal/wal.rs:161-161), `durable_write` (rust/lance/src/dataset/mem_wal/wal.rs:165-165), `advance_durable` (rust/lance/src/dataset/mem_wal/wal.rs:171-171).

### `rust/lance/src/dataset/mem_wal/write.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `ShardWriterConfig` (rust/lance/src/dataset/mem_wal/write.rs:72-72), `new` (rust/lance/src/dataset/mem_wal/write.rs:310-310), `with_shard_spec_id` (rust/lance/src/dataset/mem_wal/write.rs:318-318), `with_durable_write` (rust/lance/src/dataset/mem_wal/write.rs:324-324), `with_max_wal_buffer_size` (rust/lance/src/dataset/mem_wal/write.rs:330-330), `with_max_wal_flush_interval` (rust/lance/src/dataset/mem_wal/write.rs:336-336), `with_max_wal_persist_retries` (rust/lance/src/dataset/mem_wal/write.rs:343-343), `with_wal_persist_retry_base_delay` (rust/lance/src/dataset/mem_wal/write.rs:350-350).

### `rust/lance/src/dataset/optimize.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `CompactionMode` (rust/lance/src/dataset/optimize.rs:157-157), `IndexRemapMode` (rust/lance/src/dataset/optimize.rs:185-185), `CompactionOptions` (rust/lance/src/dataset/optimize.rs:217-217), `from_dataset_config` (rust/lance/src/dataset/optimize.rs:399-399), `apply_dataset_config` (rust/lance/src/dataset/optimize.rs:409-409), `validate` (rust/lance/src/dataset/optimize.rs:554-554), `compaction_mode` (rust/lance/src/dataset/optimize.rs:581-581), `transaction_properties` (rust/lance/src/dataset/optimize.rs:594-594).

### `rust/lance/src/dataset/scanner.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `validate_batch_size` (rust/lance/src/dataset/scanner.rs:154-154), `get_default_batch_size` (rust/lance/src/dataset/scanner.rs:522-522), `get_default_io_buffer_size_override` (rust/lance/src/dataset/scanner.rs:563-563), `ColumnOrdering` (rust/lance/src/dataset/scanner.rs:575-575), `asc_nulls_first` (rust/lance/src/dataset/scanner.rs:582-582), `asc_nulls_last` (rust/lance/src/dataset/scanner.rs:590-590), `desc_nulls_first` (rust/lance/src/dataset/scanner.rs:598-598), `desc_nulls_last` (rust/lance/src/dataset/scanner.rs:606-606).

### `rust/lance/src/dataset/schema_evolution.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `BatchInfo` (rust/lance/src/dataset/schema_evolution.rs:75-75), `UDFCheckpointStore` (rust/lance/src/dataset/schema_evolution.rs:84-84), `BatchUDF` (rust/lance/src/dataset/schema_evolution.rs:91-91), `NewColumnTransform` (rust/lance/src/dataset/schema_evolution.rs:101-101), `ColumnAlteration` (rust/lance/src/dataset/schema_evolution.rs:117-117), `new` (rust/lance/src/dataset/schema_evolution.rs:129-129), `rename` (rust/lance/src/dataset/schema_evolution.rs:138-138), `set_nullable` (rust/lance/src/dataset/schema_evolution.rs:143-143).

### `rust/lance/src/dataset/updater.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `Updater` (rust/lance/src/dataset/updater.rs:35-35), `try_new` (rust/lance/src/dataset/updater.rs:77-77), `fragment` (rust/lance/src/dataset/updater.rs:169-169), `dataset` (rust/lance/src/dataset/updater.rs:173-173), `next` (rust/lance/src/dataset/updater.rs:182-182), `allow_external_blob_outside_bases` (rust/lance/src/dataset/updater.rs:250-250), `update` (rust/lance/src/dataset/updater.rs:277-277), `finish` (rust/lance/src/dataset/updater.rs:380-380).

### `rust/lance/src/dataset/versions/mod.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `validate_write_version` (rust/lance/src/dataset/versions/mod.rs:59-59), `create_scan_stream` (rust/lance/src/dataset/versions/mod.rs:72-72), `schema_compare_options` (rust/lance/src/dataset/versions/mod.rs:95-95), `write_fragments` (rust/lance/src/dataset/versions/mod.rs:137-137), `write_fragments_direct` (rust/lance/src/dataset/versions/mod.rs:241-241), `can_use_binary_copy` (rust/lance/src/dataset/versions/mod.rs:331-331), `rewrite_files_binary_copy` (rust/lance/src/dataset/versions/mod.rs:351-351), `check_manifest_storage_version` (rust/lance/src/dataset/versions/mod.rs:378-378).

### `rust/lance/src/dataset/write.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `validate_data_file_target` (rust/lance/src/dataset/write.rs:79-79), `write_data_file_part` (rust/lance/src/dataset/write.rs:156-156), `concat_data_file_parts` (rust/lance/src/dataset/write.rs:283-283), `WriteDestination` (rust/lance/src/dataset/write.rs:351-351), `dataset` (rust/lance/src/dataset/write.rs:359-359), `uri` (rust/lance/src/dataset/write.rs:366-366), `WriteMode` (rust/lance/src/dataset/write.rs:400-400), `ExternalBlobMode` (rust/lance/src/dataset/write.rs:427-427).

### `rust/lance/src/dataset/write/commit.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `CommitBuilder` (rust/lance/src/dataset/write/commit.rs:38-38), `new` (rust/lance/src/dataset/write/commit.rs:67-67), `use_stable_row_ids` (rust/lance/src/dataset/write/commit.rs:98-98), `with_storage_format` (rust/lance/src/dataset/write/commit.rs:113-113), `with_exact_storage_format` (rust/lance/src/dataset/write/commit.rs:119-119), `with_object_store` (rust/lance/src/dataset/write/commit.rs:125-125), `with_source_store` (rust/lance/src/dataset/write/commit.rs:137-137), `with_source_dataset` (rust/lance/src/dataset/write/commit.rs:146-146).

### `rust/lance/src/dataset/write/merge_insert.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `canonical_source_schema` (rust/lance/src/dataset/write/merge_insert.rs:169-169), `format_key_values_on_columns` (rust/lance/src/dataset/write/merge_insert.rs:338-338), `create_duplicate_row_error` (rust/lance/src/dataset/write/merge_insert.rs:374-374), `MergeInsertWriteMode` (rust/lance/src/dataset/write/merge_insert.rs:428-428), `WhenNotMatchedBySource` (rust/lance/src/dataset/write/merge_insert.rs:470-470), `delete_if` (rust/lance/src/dataset/write/merge_insert.rs:489-489), `WhenMatched` (rust/lance/src/dataset/write/merge_insert.rs:505-505), `update_if` (rust/lance/src/dataset/write/merge_insert.rs:532-532).

### `rust/lance/src/dataset/write/merge_insert/exec/in_place.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `InPlaceMergeInsertExec` (rust/lance/src/dataset/write/merge_insert/exec/in_place.rs:57-57), `try_new` (rust/lance/src/dataset/write/merge_insert/exec/in_place.rs:72-72), `merge_stats` (rust/lance/src/dataset/write/merge_insert/exec/in_place.rs:99-99), `transaction` (rust/lance/src/dataset/write/merge_insert/exec/in_place.rs:107-107).

### `rust/lance/src/index.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `replay_staged_segments` (rust/lance/src/index.rs:889-889), `build_index_metadata_from_segments` (rust/lance/src/index.rs:995-995), `validate_segment_params_compatible` (rust/lance/src/index.rs:1509-1509), `segment_has_vector_details` (rust/lance/src/index.rs:1566-1566), `index_type_is_known` (rust/lance/src/index.rs:1582-1582), `LegacyVectorIndexCacheKey` (rust/lance/src/index.rs:1672-1672), `IvfIndexStateCacheKey` (rust/lance/src/index.rs:1718-1718), `CachedLegacyVectorIndex` (rust/lance/src/index.rs:1760-1760).

### `rust/lance/src/index/create.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `CreateIndexBuilder` (rust/lance/src/index/create.rs:76-76), `new` (rust/lance/src/index/create.rs:93-93), `name` (rust/lance/src/index/create.rs:115-115), `replace` (rust/lance/src/index/create.rs:120-120), `train` (rust/lance/src/index/create.rs:125-125), `fragments` (rust/lance/src/index/create.rs:130-130), `index_uuid` (rust/lance/src/index/create.rs:135-135), `preprocessed_data` (rust/lance/src/index/create.rs:142-142).

### `rust/lance/src/index/vector/ivf.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `LegacyIVFPartitionKey` (rust/lance/src/index/vector/ivf.rs:152-152), `new` (rust/lance/src/index/vector/ivf.rs:157-157), `IVFIndex` (rust/lance/src/index/vector/ivf.rs:184-184), `try_new` (rust/lance/src/index/vector/ivf.rs:219-219), `load_partition` (rust/lance/src/index/vector/ivf.rs:291-291), `preprocess_query` (rust/lance/src/index/vector/ivf.rs:346-346), `index_type_for_segmented_optimize` (rust/lance/src/index/vector/ivf.rs:390-390), `SteadyStateRebalance` (rust/lance/src/index/vector/ivf.rs:397-397).

### `rust/lance/src/index/vector/ivf/v2.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `RabitSearchCacheCell` (rust/lance/src/index/vector/ivf/v2.rs:97-97), `IvfIndexState` (rust/lance/src/index/vector/ivf/v2.rs:109-109), `PreparedPartitionTracker` (rust/lance/src/index/vector/ivf/v2.rs:515-515), `RabitSearchCache` (rust/lance/src/index/vector/ivf/v2.rs:549-549), `empty_rabit_search_cache_cell` (rust/lance/src/index/vector/ivf/v2.rs:554-554), `IvfStateEntry` (rust/lance/src/index/vector/ivf/v2.rs:640-640), `IvfStateEntryBox` (rust/lance/src/index/vector/ivf/v2.rs:658-658), `PartitionEntry` (rust/lance/src/index/vector/ivf/v2.rs:916-916).

### `rust/lance/src/index/vector/pq.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `PQIndex` (rust/lance/src/index/vector/pq.rs:62-62), `new` (rust/lance/src/index/vector/pq.rs:152-152), `build_pq_model` (rust/lance/src/index/vector/pq.rs:552-552), `build_pq_model_in_fragments` (rust/lance/src/index/vector/pq.rs:563-563), `build_pq_storage` (rust/lance/src/index/vector/pq.rs:667-667).

### `rust/lance/src/io/commit.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `default_commit_retry_timeout` (rust/lance/src/io/commit.rs:103-103), `timeout_error` (rust/lance/src/io/commit.rs:129-129), `maybe_timeout` (rust/lance/src/io/commit.rs:137-137), `write_transaction_file` (rust/lance/src/io/commit.rs:401-401), `commit_new_dataset` (rust/lance/src/io/commit.rs:780-780), `manifest_needs_migration` (rust/lance/src/io/commit.rs:816-816), `fix_schema` (rust/lance/src/io/commit.rs:888-888), `migrate_fragments` (rust/lance/src/io/commit.rs:991-991).

### `rust/lance/src/io/commit/conflict_resolver.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `TransactionRebase` (rust/lance/src/io/commit/conflict_resolver.rs:42-42), `try_new` (rust/lance/src/io/commit/conflict_resolver.rs:245-245), `for_staged_replay` (rust/lance/src/io/commit/conflict_resolver.rs:540-540), `load_current_lineage` (rust/lance/src/io/commit/conflict_resolver.rs:545-545), `needs_versions` (rust/lance/src/io/commit/conflict_resolver.rs:620-620), `check_txn` (rust/lance/src/io/commit/conflict_resolver.rs:637-637), `finish` (rust/lance/src/io/commit/conflict_resolver.rs:2538-2538), `finish_with_tagged_rewrite` (rust/lance/src/io/commit/conflict_resolver.rs:2548-2548).

### `rust/lance/src/io/exec/ann_proto.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `query_to_proto` (rust/lance/src/io/exec/ann_proto.rs:99-99), `query_from_proto` (rust/lance/src/io/exec/ann_proto.rs:129-129), `ann_ivf_partition_exec_to_proto` (rust/lance/src/io/exec/ann_proto.rs:167-167), `ann_ivf_partition_exec_from_proto` (rust/lance/src/io/exec/ann_proto.rs:181-181), `ann_ivf_sub_index_exec_to_proto` (rust/lance/src/io/exec/ann_proto.rs:216-216), `ann_ivf_sub_index_exec_from_proto` (rust/lance/src/io/exec/ann_proto.rs:248-248).

### `rust/lance/src/io/exec/count_pushdown.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `CountPushdown` (rust/lance/src/io/exec/count_pushdown.rs:75-75).

### `rust/lance/src/io/exec/filtered_read.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `EvaluatedIndex` (rust/lance/src/io/exec/filtered_read.rs:89-89), `index_result` (rust/lance/src/io/exec/filtered_read.rs:135-135), `applicable_fragments` (rust/lance/src/io/exec/filtered_read.rs:141-141), `try_from_arrow` (rust/lance/src/io/exec/filtered_read.rs:145-145), `FilteredReadGlobalMetrics` (rust/lance/src/io/exec/filtered_read.rs:322-322), `new` (rust/lance/src/io/exec/filtered_read.rs:330-330), `FilteredReadPartitionMetrics` (rust/lance/src/io/exec/filtered_read.rs:344-344), `new` (rust/lance/src/io/exec/filtered_read.rs:355-355).

### `rust/lance/src/io/exec/filtered_read_proto.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `filtered_read_exec_to_proto` (rust/lance/src/io/exec/filtered_read_proto.rs:50-50), `filtered_read_exec_from_proto` (rust/lance/src/io/exec/filtered_read_proto.rs:78-78), `plan_to_proto` (rust/lance/src/io/exec/filtered_read_proto.rs:284-284).

### `rust/lance/src/io/exec/fts.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `FtsDocumentExec` (rust/lance/src/io/exec/fts.rs:191-191), `new` (rust/lance/src/io/exec/fts.rs:198-198), `CompoundQueryExec` (rust/lance/src/io/exec/fts.rs:682-682), `new_with_segments` (rust/lance/src/io/exec/fts.rs:705-705), `new_with_segment_uuids` (rust/lance/src/io/exec/fts.rs:721-721), `with_external_mask` (rust/lance/src/io/exec/fts.rs:765-765), `with_base_scorer` (rust/lance/src/io/exec/fts.rs:774-774), `with_prepared_match` (rust/lance/src/io/exec/fts.rs:786-786).

### `rust/lance/src/io/exec/knn.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `query_index_field` (rust/lance/src/io/exec/knn.rs:84-84), `AnnPartitionMetrics` (rust/lance/src/io/exec/knn.rs:88-88), `new` (rust/lance/src/io/exec/knn.rs:97-97), `AnnIndexMetrics` (rust/lance/src/io/exec/knn.rs:108-108), `new` (rust/lance/src/io/exec/knn.rs:115-115), `KNNVectorDistanceExec` (rust/lance/src/io/exec/knn.rs:237-237), `KnnBatchParams` (rust/lance/src/io/exec/knn.rs:259-259), `try_new` (rust/lance/src/io/exec/knn.rs:429-429).

### `rust/lance/src/io/exec/knn/adaptive_probe.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `AutoProbePolicy` (rust/lance/src/io/exec/knn/adaptive_probe.rs:38-38), `from_env` (rust/lance/src/io/exec/knn/adaptive_probe.rs:45-45), `select_with_config` (rust/lance/src/io/exec/knn/adaptive_probe.rs:49-49), `apply` (rust/lance/src/io/exec/knn/adaptive_probe.rs:68-68), `AutoProbeConfig` (rust/lance/src/io/exec/knn/adaptive_probe.rs:125-125), `from_env` (rust/lance/src/io/exec/knn/adaptive_probe.rs:142-142), `apply` (rust/lance/src/io/exec/knn/adaptive_probe.rs:291-291).

### `rust/lance/src/io/exec/minhash.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `MinHashSearchExec` (rust/lance/src/io/exec/minhash.rs:78-78), `new` (rust/lance/src/io/exec/minhash.rs:93-93), `FlatMinHashExec` (rust/lance/src/io/exec/minhash.rs:360-360), `new` (rust/lance/src/io/exec/minhash.rs:370-370).

### `rust/lance/src/io/exec/scan.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `LanceStream` (rust/lance/src/io/exec/scan.rs:130-130), `try_new` (rust/lance/src/io/exec/scan.rs:165-165), `try_new_v2` (rust/lance/src/io/exec/scan.rs:181-181), `try_new_v1` (rust/lance/src/io/exec/scan.rs:440-440), `LanceScanConfig` (rust/lance/src/io/exec/scan.rs:590-590), `LanceScanExec` (rust/lance/src/io/exec/scan.rs:632-632), `new` (rust/lance/src/io/exec/scan.rs:685-685), `dataset` (rust/lance/src/io/exec/scan.rs:737-737).

### `rust/lance/src/io/exec/take.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `TakeExec` (rust/lance/src/io/exec/take.rs:463-463), `try_new` (rust/lance/src/io/exec/take.rs:529-529), `try_new_with_batch_size` (rust/lance/src/io/exec/take.rs:538-538), `calculate_output_schema` (rust/lance/src/io/exec/take.rs:634-634), `dataset` (rust/lance/src/io/exec/take.rs:679-679).

### `rust/lance/src/io/exec/topk_late_materialization.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `ReadEligibility` (rust/lance/src/io/exec/topk_late_materialization.rs:71-71), `PassThrough` (rust/lance/src/io/exec/topk_late_materialization.rs:75-75), `TopKLateMaterialization` (rust/lance/src/io/exec/topk_late_materialization.rs:90-90), `new` (rust/lance/src/io/exec/topk_late_materialization.rs:107-107), `with_read_eligibility` (rust/lance/src/io/exec/topk_late_materialization.rs:114-114), `with_pass_through` (rust/lance/src/io/exec/topk_late_materialization.rs:128-128).

### `rust/lance/src/io/exec/utils.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `buffered_fragment_opens` (rust/lance/src/io/exec/utils.rs:55-55), `PreFilterSource` (rust/lance/src/io/exec/utils.rs:76-76), `PreFilterMasks` (rust/lance/src/io/exec/utils.rs:213-213), `shared_for_multimatch_fields` (rust/lance/src/io/exec/utils.rs:221-221), `execution_plan` (rust/lance/src/io/exec/utils.rs:246-246), `with_execution_plan` (rust/lance/src/io/exec/utils.rs:253-253), `build_prefilter` (rust/lance/src/io/exec/utils.rs:455-455), `build_prefilter_restricted_to_fragments` (rust/lance/src/io/exec/utils.rs:481-481).


Refresh 2026-10-12 — `rust/lance/src/dataset/mem_wal/memtable/flush.rs`: Production delta is documented in the current contract; use the existing directory responsibility and current reading intervals.

Refresh 2026-10-12 — `rust/lance/src/dataset/versions/mod.rs`: Production delta is documented in the current contract; use the existing directory responsibility and current reading intervals.

Refresh 2026-10-12 — `rust/lance/src/dataset/write.rs`: Production delta is documented in the current contract; use the existing directory responsibility and current reading intervals.

Refresh 2026-10-12 — `rust/lance/src/dataset/write/commit.rs`: Production delta is documented in the current contract; use the existing directory responsibility and current reading intervals.

Refresh 2026-10-12 — `rust/lance/src/index/frag_reuse.rs`: No production changes; only excluded test ranges changed. Current production coordinates retained.

Refresh 2026-10-12 — `rust/lance/src/io/commit.rs`: Production delta is documented in the current contract; use the existing directory responsibility and current reading intervals.
