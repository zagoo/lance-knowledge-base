# Python public API and Rust boundary

> Refresh 2026-10-12, `011953c22097b67b699595adbe99e7f0155d83e4`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-12.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**Trust: contract-verified primary API mapping; optional integrations mapped only.** Source snapshot `c3c8d6fb505fb437b2b673c5195e1d4b74436b2f`. [Entry](../README.md) · [Scope](../V21-PROTOCOL.md) · [Format](../L3-symbols/format-spec.md).

The Python package shapes public arguments and Arrow interoperability; PyO3 Rust methods map to Dataset/Scanner/builders. Keep business validation in Rust core and parameter names aligned. Python commands in a development checkout must use the documented uv workflow; none are run for this read-only KB. See python/AGENTS.md:5-23 and python/AGENTS.md:33-36.

## Module Map

<a id="python-python-lance"></a>

### `python/python/lance/`

Public dataset/scanner/fragment/file/blob/schema/query/vector/MemWAL APIs and optional integrations (namespace, HF, pydantic, sampling, telemetry). __init__.py is the package export list; dataset.py supplies the primary facade.

| Source file | Production ranges | Coverage |
|---|---|---|
| `python/python/lance/__init__.py` | 1-376 | mapped |
| `python/python/lance/arrow.py` | 1-583 | mapped |
| `python/python/lance/bitmap.py` | 1-16 | mapped |
| `python/python/lance/blob.py` | 1-583 | mapped |
| `python/python/lance/commit.py` | 1-21 | mapped |
| `python/python/lance/dataset.py` | 1-8833 | Key File (checked ranges) |
| `python/python/lance/debug.py` | 1-11 | mapped |
| `python/python/lance/dependencies.py` | 1-289 | mapped |
| `python/python/lance/download.py` | 1-125 | mapped |
| `python/python/lance/file.py` | 1-641 | mapped |
| `python/python/lance/fragment.py` | 1-1476 | mapped |
| `python/python/lance/hf.py` | 1-43 | mapped |
| `python/python/lance/io.py` | 1-8 | mapped |
| `python/python/lance/log.py` | 1-54 | mapped |
| `python/python/lance/mem_wal.py` | 1-634 | mapped |
| `python/python/lance/namespace.py` | 1-1617 | mapped |
| `python/python/lance/optimize.py` | 1-133 | mapped |
| `python/python/lance/otel.py` | 1-166 | mapped |
| `python/python/lance/progress.py` | 1-186 | mapped |
| `python/python/lance/pydantic.py` | 1-434 | mapped |
| `python/python/lance/query.py` | 1-371 | mapped |
| `python/python/lance/sampler.py` | 1-670 | mapped |
| `python/python/lance/schema.py` | 1-34 | mapped |
| `python/python/lance/tracing.py` | 1-55 | mapped |
| `python/python/lance/types.py` | 1-182 | mapped |
| `python/python/lance/udf.py` | 1-273 | mapped |
| `python/python/lance/util.py` | 1-290 | mapped |
| `python/python/lance/vector.py` | 1-1087 | mapped |
<a id="python-python-lance--arrow"></a>

### `python/python/lance/_arrow/`

Mapped-only Arrow interoperability helpers; external PyArrow internals are excluded.

| Source file | Production ranges | Coverage |
|---|---|---|
| `python/python/lance/_arrow/__init__.py` | 1-2 | mapped |
| `python/python/lance/_arrow/bf16.py` | 1-200 | mapped |
<a id="python-python-lance--dataset"></a>

### `python/python/lance/_dataset/`

Dataset Python support modules, selected from the public dataset facade. Use them for argument/result shaping rather than duplicating Rust transaction logic.

| Source file | Production ranges | Coverage |
|---|---|---|
| `python/python/lance/_dataset/__init__.py` | 1-4 | mapped |
| `python/python/lance/_dataset/cache.py` | 1-75 | mapped |
| `python/python/lance/_dataset/sharded_batch_iterator.py` | 1-152 | mapped |
<a id="python-python-lance-indices"></a>

### `python/python/lance/indices/`

Python index configuration/training/query helpers; core persisted/index correctness stays in Rust. Accelerator-specific behavior is an optional integration boundary.

| Source file | Production ranges | Coverage |
|---|---|---|
| `python/python/lance/indices/__init__.py` | 1-41 | mapped |
| `python/python/lance/indices/builder.py` | 1-638 | mapped |
| `python/python/lance/indices/ivf.py` | 1-74 | mapped |
| `python/python/lance/indices/pq.py` | 1-81 | mapped |
<a id="python-python-lance-torch"></a>

### `python/python/lance/torch/`

Mapped-only PyTorch training/data-loader integration. External torch internals and performance behavior are excluded.

| Source file | Production ranges | Coverage |
|---|---|---|
| `python/python/lance/torch/__init__.py` | 1-31 | mapped |
| `python/python/lance/torch/async_dataset.py` | 1-90 | mapped |
| `python/python/lance/torch/data.py` | 1-539 | mapped |
| `python/python/lance/torch/dist.py` | 1-80 | mapped |
| `python/python/lance/torch/distance.py` | 1-266 | mapped |
| `python/python/lance/torch/kmeans.py` | 1-305 | mapped |
<a id="python-src"></a>

### `python/src/`

PyO3 classes, runtime/executor, Arrow stream conversion, Dataset/Scanner and operation adapters. lib.rs registers exported extension classes/functions; dataset.rs maps primary operations.

| Source file | Production ranges | Coverage |
|---|---|---|
| `python/src/bitmap.rs` | 1-425 | mapped |
| `python/src/blob.rs` | 1-524 | mapped |
| `python/src/dataset.rs` | 1-5972 | Key File (checked ranges) |
| `python/src/debug.rs` | 1-148 | mapped |
| `python/src/error.rs` | 1-198 | mapped |
| `python/src/executor.rs` | 1-302 | mapped |
| `python/src/file.rs` | 1-1014 | mapped |
| `python/src/fragment.rs` | 1-1012 | mapped |
| `python/src/fts.rs` | 1-258 | mapped |
| `python/src/indices.rs` | 1-774 | mapped |
| `python/src/lib.rs` | 1-525 | mapped |
| `python/src/mem_wal.rs` | 1-1104 | mapped |
| `python/src/namespace.rs` | 1-1859 | mapped |
| `python/src/object_store.rs` | 1-238 | mapped |
| `python/src/otel.rs` | 1-425 | mapped |
| `python/src/reader.rs` | 1-171 | mapped |
| `python/src/rowids.rs` | 1-223 | mapped |
| `python/src/scanner.rs` | 1-176 | mapped |
| `python/src/schema.rs` | 1-270 | mapped |
| `python/src/session.rs` | 1-232 | mapped |
| `python/src/storage_options.rs` | 1-92 | mapped |
| `python/src/tracing.rs` | 1-394 | mapped |
| `python/src/transaction.rs` | 1-1107 | mapped |
| `python/src/utils.rs` | 1-44, 60-313 | mapped |
<a id="python-src-dataset"></a>

### `python/src/dataset/`

PyO3 dataset operation adapters for commit, optimization, cleanup, blobs and statistics. They bridge Python values/results to the existing Rust engine.

| Source file | Production ranges | Coverage |
|---|---|---|
| `python/src/dataset/blob.rs` | 1-149 | mapped |
| `python/src/dataset/cleanup.rs` | 1-85 | mapped |
| `python/src/dataset/commit.rs` | 1-134 | mapped |
| `python/src/dataset/io_stats.rs` | 1-48 | mapped |
| `python/src/dataset/optimize.rs` | 1-608 | mapped |
| `python/src/dataset/stats.rs` | 1-55 | mapped |

## Key types and files

### LanceDataset / LanceScanner / ScannerBuilder / DatasetOptimizer

`python/python/lance/dataset.py` — read `1498-1567,2940-2945,3149-3160,4609-4640,7790-7811,8405-8432`.

Primary Python operation and query facade.  
Scanner applies defaults first and forwards only non-None option overrides, with separate column-default handling.  
Delete/update serialize Arrow expressions before calling the Rust extension.  
Committed create_index returns self; write_dataset wraps the returned extension Dataset in a new Python facade.

[Selected contract record](../L2-files/python/python/lance/dataset.py.md).

### Dataset / write_dataset

`python/src/dataset.rs` — read `4920-4959`.

Primary PyO3 Dataset bridge, including write stream conversion.  
A native Scanner obtains a reader; other inputs use ArrowArrayStreamReader.  
Both branches await Rust LanceDataset::write on the shared runtime.  
Write-mode parsing accepts lowercase-normalized create/append/overwrite and rejects other strings.

[Selected contract record](../L2-files/python/src/dataset.rs.md).

## Contracts and extension boundaries

**Export mapping.** Package exports include Dataset/Scanner/fragment/write, blob/file/schema, query/indices, diagnostics and MemWAL objects. PyO3 lib.rs registers the underlying extension classes/functions. (python/python/lance/__init__.py:10-134; python/src/lib.rs:264-330)

**Scanner defaults.** Non-None arguments override default scan options; columns=None uses special default-column logic. Full-text and nearest/MinHash requests are converted to builder calls before to_scanner. (python/python/lance/dataset.py:1498-1567)

**Write mapping.** Python write_dataset calls _write_dataset, stores the returned handle and URI, and clears per-instance default scan/read params. The Rust shim invokes LanceDataset::write and maps engine errors to PyIOError. (python/python/lance/dataset.py:8405-8432; python/src/dataset.rs:4920-4949)

**Mutations.** delete/update serialize Arrow expressions when supplied, forward conflict retry/timeout parameters, and leave engine transaction behavior to the Rust adapter/core. (python/python/lance/dataset.py:2940-2945; python/python/lance/dataset.py:3149-3160)

M3 supplies the complete API-family/protocol decision tables and recipe navigation. This Module Map establishes ownership and the checked seams; it does not claim runtime qualification.


## Public API route

[Public API family contracts and declaration directories](../L3-symbols/public-api.md) distinguish source-declared interfaces from checked implementation behavior and provide binding-to-engine read sets.

## Source refresh — 2026-10-07

Pinned `84d1681e07af565837f2d97e72ff1b8b040cd15c`. The entries below have updated source ranges. Their directory responsibilities remain as mapped; behavior changes are governed by [current delta contracts](../L3-symbols/refresh-2026-10-07.md). Ordinary files remain mapped, and Java/peripherals remain mapped only.

- `python/python/lance/dataset.py`
- `python/python/lance/fragment.py`

## Source refresh — 2026-10-09

Pin `db684d1f0726c00b6defb7963a604a7719e82b5a`. [Changed contracts](../L3-symbols/refresh-2026-10-09.md) cover affected behavior. The following entries have current production ranges; unchanged directory responsibilities and mapped-only limits remain.

- `python/python/lance/dataset.py`
- `python/src/dataset.rs`

## Source refresh map — 2026-10-11

Current source `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`. [Changed contracts](../L3-symbols/refresh-2026-10-11.md). Existing directory responsibilities remain; declarations below locate changed boundaries.

### `python/python/lance/dataset.py`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

### `python/src/blob.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `PyBlobDescriptor` (python/src/blob.rs:164-164), `PyBlobDescriptorArrayBuilder` (python/src/blob.rs:182-182), `new` (python/src/blob.rs:198-198), `field` (python/src/blob.rs:207-207), `extend_packed` (python/src/blob.rs:211-211), `append_dedicated` (python/src/blob.rs:234-234), `append_managed` (python/src/blob.rs:257-257), `append` (python/src/blob.rs:274-274).

### `python/src/dataset.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `MergeInsertBuilder` (python/src/dataset.rs:312-312), `new` (python/src/dataset.rs:321-321), `when_matched_update_all` (python/src/dataset.rs:365-365), `when_matched_fail` (python/src/dataset.rs:380-380), `when_matched_delete` (python/src/dataset.rs:385-385), `when_not_matched_insert_all` (python/src/dataset.rs:390-390), `when_not_matched_by_source_delete` (python/src/dataset.rs:396-396), `conflict_retries` (python/src/dataset.rs:411-411).

### `python/src/schema.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `LanceField` (python/src/schema.rs:22-22), `__repr__` (python/src/schema.rs:29-29), `__richcmp__` (python/src/schema.rs:33-33), `children` (python/src/schema.rs:43-43), `name` (python/src/schema.rs:47-47), `id` (python/src/schema.rs:51-51), `metadata` (python/src/schema.rs:56-56), `is_unenforced_primary_key` (python/src/schema.rs:61-61).

### `python/src/transaction.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `PyUpdateMode` (python/src/transaction.rs:397-397).


Refresh 2026-10-12 — `python/python/lance/namespace.py`: Production delta is documented in the current contract; use the existing directory responsibility and current reading intervals.
