# Index creation, querying and maintenance

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**Trust: checked orchestration and extension contracts; algorithm internals are mapped unless separately deep-linked.** [Index Module Map](../L1-modules/rust-lance-index.md) · [Dataset Module Map](../L1-modules/rust-lance.md) · [commit conflicts](protocol-commit.md) · [persisted index descriptors](format-spec.md#index-details).

## Identity, coverage and compatibility

An index name identifies a logical index that can have multiple physical UUID segments. Metadata includes indexed/covering field IDs, creation dataset version, fragment bitmap, Any details, index version, base ID and files. Keep dataset version, file format version and index implementation version distinct. Create names are reserved against **all** manifest entries, including unreadable ones. Query usability requires a known exact declared type and supported index version; hiding an unsupported entry from queries does not relinquish its name or coverage. (rust/lance/src/index/create.rs:197-215; rust/lance/src/index/create.rs:667-689; rust/lance/src/index.rs:3717-3737)

`IndexPluginRegistry` stores case-insensitive plugin aliases and full protobuf names. `supports_details` validates the full qualified type suffix after the final slash; lookup-by-details separately derives a short terminal name. The short-name lookup is not a replacement for exact type-identity admission. Historical detail package identities remain stable; put new messages in the current schema rather than relocating old ones. (rust/lance-index/src/registry.rs:26-177; protos/index.proto:6-383; protos/index_old.proto:8-28)

Scalar SearchResult carries set certainty: Exact is exact; AtMost is a superset requiring post-filtering; AtLeast is a subset and matters when composing negation. Row IDs may be opaque stable IDs; an index returning row addresses must advertise that distinction. Old-index filters use fragment membership only for address-style IDs and exact row-ID membership for stable IDs. Reinterpreting an opaque ID's high bits as fragment identity can revive or discard the wrong rows. (rust/lance-index-core/src/scalar.rs:398-480; rust/lance-index-core/src/scalar.rs:531-564; rust/lance-index-core/src/scalar.rs:628-762)

## Build and publish

`DatasetIndexExt::create_index` configures `CreateIndexBuilder`. It accepts one keyed column at this entry. Before training, vector/FTS requests undergo fragment-reuse admission. Scalar FTS resolves document granularity/nested paths separately. `execute_uncommitted` builds files and metadata without publishing; ordinary execution creates a `CreateIndex {new_indices, removed_indices}` transaction, applies the commit and reloads the committed UUID. Replacement removes the selected prior same-name declarations through that transaction; file creation alone has not made an index visible. Multi-segment FM construction has its own builder branch. (rust/lance/src/index.rs:2456-2481; rust/lance/src/index/create.rs:176-251; rust/lance/src/index/create.rs:696-767)

### Scalar plugin path

Resolve a field and plugin by `ScalarIndexParams.index_type`. The plugin must provide a BasicTrainer or this generic path rejects it. `new_training_request(params, field)` defines ordering and row-ID/address needs; the Dataset prepares a stream satisfying that request (or accepts caller-provided preprocessed data), then `train_index` writes to the new IndexStore and returns `CreatedIndex`. The result's details/version/file list must be persisted; the trainer does not commit a Dataset. FTS training can project resolved nested documents rather than treating every requested name as an ordinary scalar field. (rust/lance/src/index/scalar.rs:349-453; rust/lance-index/src/scalar/registry.rs:29-100; rust/lance-index-core/src/scalar.rs:483-529)

The plugin contract includes name, exactness, supported version, optional query parser, load/cache behavior, segment-compatibility validation and optional seed hooks. A default segment validator accepts any combination, so plugins needing identical models/hash parameters must override it. Seed-writer construction must derive parameters from details and perform no I/O; `might_use_seeds=false` avoids probing data files; `update_from_seeds=None` requests full-scan fallback. User-visible details JSON is part of the public API. (rust/lance-index/src/scalar/registry.rs:102-200; rust/lance-index/src/scalar/registry.rs:284-367)

Advertising asynchronous batch row-ID remapping requires implementing `load_index_with_remapping`; its default rejects a present remapper. Cache entries are already namespaced per index by the caller; serialized/store-bound representations must reconstruct against the correct store/remapping context. The load future supplied to single-flight caching is awaited at most once on a miss and may be dropped unawaited on a warm hit. (rust/lance-index/src/scalar/registry.rs:182-223; rust/lance-index/src/scalar/registry.rs:370-375)

### Vector path, including IVF-PQ

Whole-table builds may retain an index definition without training when the dataset is empty or has too few vectors for its quantizer. Such metadata has empty coverage and records details for later training. A caller-selected vector fragment subset is validated and owns its training-row math; it does not use whole-table definition-only fallback. Do not interpret an empty definition as a fully indexed table. (rust/lance/src/index/create.rs:667-686; rust/lance/src/index/create.rs:1016-1057)

Modern IVF-PQ uses `IvfIndexBuilder<FlatIndex, ProductQuantizer>`. The entry dispatches on index kind, element type and IndexFileVersion, propagates fragment filtering and transpose selection. The retained legacy IVF-PQ route rejects filtered builds; it is a frozen compatibility path, not the route for a new format feature. (rust/lance/src/index/vector.rs:1199-1325)

The modern builder stages are: load/train IVF → load/train quantizer → shuffle input into partitions → build partition streams → merge/write partition files. Pre-supplied IVF/quantizer objects skip their respective training. Quantizer training samples requested fragments, normalizes cosine data, filters nonfinite values, optionally computes IVF residuals, and invokes the quantizer with L2 training distance. These preparation choices must stay consistent with query-time distance/quantization interpretation. This contract does not qualify every numerical kernel. (rust/lance/src/index/vector/builder.rs:553-594; rust/lance/src/index/vector/builder.rs:729-830)

## Query contract

`VectorIndex::search` returns row-ID/distance batches and receives a PreFilter for deleted or otherwise excluded rows. Partition discovery returns partition IDs paired with centroid distances, closest first. A Query specifies k, inclusive lower/exclusive upper distance bounds, minimum/maximum probes, optional HNSW ef, refine factor, metric, index-use flag, parallelism and RQ approximation mode. ApproxMode currently affects RQ only; “Accurate” is not a global exact-search guarantee. Query parallelism 0 is automatic, -1 uses CPU-pool size, 1 is sequential and larger values are bounded by the execution layer. These are interface contracts; concrete implementations may override scheduling. (rust/lance-index/src/vector.rs:95-221; rust/lance-index/src/vector.rs:268-330)

Default `search_partitions` validates equal partition/distance counts and a valid half-open interval, then searches sequentially, sets each partition's centroid distance and consults optional stop/control callbacks. Prepared-partition and batch-search methods require implementation support; callers must gate batch search with `supports_batch_partition_search` (default false). Partition selection, approximate scoring and later refine/filter work are separate stages. (rust/lance-index/src/vector.rs:317-330; rust/lance-index/src/vector.rs:359-448)

Dataset Scanner validates incompatible search options and chooses vector/FTS/MinHash/ordinary filtered-read sources before residual filter, ordering, limit and take/projection stages. Scalar-index eligibility is conditional on scanner options and vector prefiltering. Preserve the SearchResult certainty and fragment coverage when composing this plan; a physical index hit is not proof that all rows or predicates are covered. (rust/lance/src/dataset/scanner.rs:3633-3801; rust/lance-index-core/src/scalar.rs:398-480)

## Update, merge and rebuild

`optimize_indices` groups the complete manifest list by name, excluding system indices. Any unknown type or too-new segment skips that whole logical group. Covering-field indices are skipped with a warning for table-wide maintenance but explicitly naming one returns an error, because current rebuilders do not preserve those carried values. A fully covered scalar group can skip work when neither retrain nor explicit merge is requested. A no-file-work optimize can still need a CreateIndex commit to advance MemWal catch-up state. (rust/lance/src/index.rs:3233-3404)

### Scalar maintenance

Select old segments and calculate live/deleted coverage. If no unindexed data and at most one selected segment, return no work. Merge old data without a full rebuild only when live old coverage exists, UpdateCriteria does not require old data, NGram fragment reuse does not force rebuilding, and either there is one selected segment or the type has an N:1 merge primitive (BTree/NGram/Bitmap). Otherwise rebuild precisely the intended fragment set. (rust/lance/src/index/append.rs:530-649)

The merge path tries compatible seeds only when the plugin says they might exist and harvesting succeeds for the relevant unindexed fragments. Otherwise scan new data, merge BTree/NGram/Bitmap with per-segment filters, or call the scalar index's `update` with a mode-correct old-data filter. Return new UUID/files/details/coverage and the minimum selected source dataset version; replacement publication goes through the normal CreateIndex transaction. A new index implementation must honor the old-data filter rather than copying every old posting. (rust/lance/src/index/append.rs:658-766; rust/lance-index-core/src/scalar.rs:531-564; rust/lance-index-core/src/scalar.rs:628-762)

### Vector maintenance

Stored coverage with no live coverage is **dormant**, distinct from a born-empty definition. Dormant stored vectors must be replaced, not merged back under stable row IDs. A deferred definition trains from saved parameters over the current column. Retrain/dormant rebuild checks exact expected coverage; definition-only degradation is accepted only when too-few-vector state is established and no files/coverage were produced. (rust/lance/src/index/append.rs:820-984; rust/lance/src/index/append.rs:1052-1190)

`num_indices_to_merge=Some(0)` appends a segment for unindexed rows without removing old ones; no unindexed rows makes that explicit append a no-op. The default can also append when existing segments are query-compatible but have different models, reusing the current suffix model. With no new rows, default optimize may rebalance. Ordinary merge selects a suffix, removes only segments actually merged, and derives metadata from those actual sources rather than an incompatible earlier segment. Preserve raw/provenance coverage and effective live coverage distinctions instead of replacing one with the other. (rust/lance/src/index/append.rs:1193-1437)

Concurrent changes are resolved at commit: CreateIndex/Rewrite ordering can withdraw coverage, preserve partial tagged provenance with scan fallback, or require a rebuild. A new segment's bitmap is a correctness assertion, not just a performance hint. Read the [directional conflict contract](protocol-commit.md#index-coverage-and-rewrite-lineage) before changing that assertion.

## Adding a scalar index: bounded subtasks

**Contract and implementation set (up to five files):**

1. `rust/lance-index-core/src/scalar.rs:398-762` — certainty, identity, training/update/filter contracts.
2. `rust/lance-index/src/scalar/registry.rs:29-367` — implement ScalarIndexPlugin and optionally BasicTrainer/query parser/seed/remapping hooks.
3. A new implementation under `rust/lance-index/src/scalar/` — new path chosen by the developer; use the [Module Map](../L1-modules/rust-lance-index.md) to select one comparable existing index, not all algorithms.
4. `rust/lance-index/src/scalar.rs:38-56` — expose the module.
5. `rust/lance-index/src/registry.rs:26-177` — register aliases and exact detail identity in the built-in registry when this is a built-in plugin.

**Persistence/integration set (up to five files):**

1. [Frozen index schema](../L2-files/protos/index.proto.md) — add details without moving historical identities or reusing stable tags.
2. `rust/lance/src/index/scalar.rs:349-453` — verify generic training request/data/CreatedIndex integration; specialized non-BasicTrainer construction needs an explicit route.
3. `rust/lance/src/index/create.rs:176-251,667-743` — metadata, FRI admission and transaction publication.
4. `rust/lance/src/index/append.rs:530-766` — update/merge/rebuild behavior and filters.
5. `rust/lance/src/index.rs:3233-3404,3717-3737` — whole-name maintenance and version admission.

Using the existing generic scalar plugin route does not by itself require inventing a new IndexType enum variant. If introducing a new built-in type discriminator or typed binding option, separately update its public API mapping and enum/version contract in the [Module Map](../L1-modules/rust-lance-index.md); do not silently treat a new numeric identity as a registration alias. Algorithm/null/recall/concurrency test design belongs to subsequent development under AGENTS.md, not excluded test-source analysis in this KB.

**IVF-PQ build change (four files):** `rust/lance/src/index/create.rs:667-686,1016-1057` → `rust/lance/src/index/vector.rs:1199-1325` → `rust/lance/src/index/vector/builder.rs:553-594,729-830` → `rust/lance-index/src/vector/pq.rs:44-120` for quantizer representation; choose a narrower quantization subtask before reading more numerical kernels.

**Update safety change (four files):** `rust/lance/src/index.rs:3233-3404` → `rust/lance/src/index/append.rs:530-766,1052-1437` (choose scalar or vector branch) → `rust/lance-index-core/src/scalar.rs:531-564,628-762` for scalar old-data semantics → `rust/lance/src/io/commit/conflict_resolver.rs:1071-1813` for the two directional index/rewrite branches.

## Refresh: streaming remap and tagged maintenance

The persisted segment version is passed to plugin load methods. New batch remapping and bounded fallback, bitmap N:1 merging, tagged trim/prune/rebase and JSON nested-version limits are specified in the [current delta contracts](refresh-2026-10-07.md#fragment-reuse-remapping-and-concurrency). These clauses supersede earlier narrower remap/update descriptions. Vector streaming support is implementation-specific: the current IVF v2 direct `remap_streaming` still returns an index error; a universal streaming-remap promise would be incorrect. (rust/lance/src/index/vector/ivf/v2.rs:2940-2945)

## Refresh — 2026-10-09

Pin `db684d1f0726c00b6defb7963a604a7719e82b5a`. [Current contract amendments](refresh-2026-10-09.md) cover json schema and scalar lifecycle. The JSON target-type declaration is ahead of the constructors at this pin: current constructors still emit Unspecified. Do not infer implemented preservation from the proto comments.

## Current delta — 2026-10-11

[Current refresh contracts](refresh-2026-10-11.md) supersede changed field-ID/transaction, unstable encoding, cache, API, MemWAL and index-coverage statements at the new pin. Follow the task index for bounded source reading.
