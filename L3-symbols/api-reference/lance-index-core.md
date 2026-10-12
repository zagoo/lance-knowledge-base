# lance-index-core: public declaration and documented-contract directory

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**Trust: declared source interface; body behavior is verified only where the linked family/protocol contract says so.** This catalog supplies exact argument/type entry points and the source author's first documentation paragraph. It is not an inferred call graph or a second symbol ledger. Rust `pub` can occur under a private/feature-gated module; confirm re-export and cfg boundaries before changing an external API. Trait method contracts and enum variants are reached through the trait/type entry. Python inherited external-library APIs are outside direct-source scope.

[Family contracts](../public-api.md) · [Module Map](../../L1-modules/rust-lance-index.md) · [Scope](../../V21-PROTOCOL.md)

<a id="source-rust-lance-index-core-src-lib-rs"></a>

## `rust/lance-index-core/src/lib.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod metrics;` | rust/lance-index-core/src/lib.rs:13-13 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod remapping;` | rust/lance-index-core/src/lib.rs:14-14 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod scalar;` | rust/lance-index-core/src/lib.rs:15-15 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait Index: Send + Sync + DeepSizeOf` | rust/lance-index-core/src/lib.rs:20-20 | Generic methods common across all types of secondary indices |
| `pub enum IndexType` | rust/lance-index-core/src/lib.rs:54-54 | Index Type |
| `pub fn is_scalar(&self) -&gt; bool` | rust/lance-index-core/src/lib.rs:187-187 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_vector(&self) -&gt; bool` | rust/lance-index-core/src/lib.rs:204-204 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_system(&self) -&gt; bool` | rust/lance-index-core/src/lib.rs:218-218 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn version(&self) -&gt; i32` | rust/lance-index-core/src/lib.rs:227-227 | Returns the current format version of the index type, bump this when the index format changes. Indices which higher version than these will be ignored for compatibility, This would happen when creating index in a newer version of Lance, but then opening the index in older version of Lance |
| `pub fn target_partition_size(&self) -&gt; usize` | rust/lance-index-core/src/lib.rs:266-266 | Returns the target partition size for the index type. |
| `pub fn max_vector_version() -&gt; u32` | rust/lance-index-core/src/lib.rs:281-281 | Returns the highest supported vector index version in this Lance build. |
| `pub fn matches_details(&self, details: &prost_types::Any) -&gt; bool` | rust/lance-index-core/src/lib.rs:298-298 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait IndexParams: Send + Sync` | rust/lance-index-core/src/lib.rs:325-325 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-core-src-metrics-rs"></a>

## `rust/lance-index-core/src/metrics.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub enum IndexTiming` | rust/lance-index-core/src/metrics.rs:11-11 | Coarse ANN stage timings. Durations are cumulative wall times, including waits. Nested stages and concurrent partitions overlap; these are not additive query latency. |
| `pub const ALL: [Self; 9] = [` | rust/lance-index-core/src/metrics.rs:34-34 | All stages in discriminant order, for fixed-size metric storage. |
| `pub fn name(self) -&gt; &'static str` | rust/lance-index-core/src/metrics.rs:47-47 | Key used in execution summaries and language-binding statistics. |
| `pub struct IndexTimer&lt;'a&gt;` | rust/lance-index-core/src/metrics.rs:63-63 | Records one partition/batch stage, never one candidate or distance evaluation. |
| `pub fn new(metrics: &'a dyn MetricsCollector, stage: IndexTiming) -&gt; Self` | rust/lance-index-core/src/metrics.rs:71-71 | Start a scope timer; dropping it also records early-return and cancellation paths. |
| `pub trait MetricsCollector: Send + Sync` | rust/lance-index-core/src/metrics.rs:92-92 | A trait used by the index to report metrics |
| `pub struct NoOpMetricsCollector;` | rust/lance-index-core/src/metrics.rs:204-204 | A no-op metrics collector that does nothing |
| `pub struct LocalMetricsCollector` | rust/lance-index-core/src/metrics.rs:213-213 | No standalone documentation summary; use the family contract and source entry. |
| `pub parts_loaded: AtomicUsize,` | rust/lance-index-core/src/metrics.rs:215-215 | No standalone documentation summary; use the family contract and source entry. |
| `pub index_loads: AtomicUsize,` | rust/lance-index-core/src/metrics.rs:216-216 | No standalone documentation summary; use the family contract and source entry. |
| `pub comparisons: AtomicUsize,` | rust/lance-index-core/src/metrics.rs:217-217 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn dump_into(self, other: &dyn MetricsCollector)` | rust/lance-index-core/src/metrics.rs:230-230 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn index_cache_hits(&self) -&gt; usize` | rust/lance-index-core/src/metrics.rs:247-247 | Cumulative index cache hits recorded so far. |
| `pub fn index_cache_misses(&self) -&gt; usize` | rust/lance-index-core/src/metrics.rs:252-252 | Cumulative index cache misses recorded so far. |
| `pub fn batch_reads(&self) -&gt; usize` | rust/lance-index-core/src/metrics.rs:257-257 | Cumulative batched `read_record_batches` calls recorded so far. |
| `pub fn single_page_reads(&self) -&gt; usize` | rust/lance-index-core/src/metrics.rs:262-262 | Cumulative unbatched `read_record_batch` calls recorded so far. |

<a id="source-rust-lance-index-core-src-remapping-rs"></a>

## `rust/lance-index-core/src/remapping.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub trait BatchRowIdRemapper: Send + Sync + std::fmt::Debug` | rust/lance-index-core/src/remapping.rs:28-28 | Translates a bounded batch of row IDs, allowing encodings to read external data. |
| `pub static LEGACY_TRAFFIC_ONLY: ();` | rust/lance-index-core/src/remapping.rs:228-228 | Armed by v0-lifecycle tests: any batch-remapping entry point reached within this scope fails, proving legacy traffic never crosses into the asynchronous translation code. |
| `pub fn check_batch_remapping_entry() -&gt; Result&lt;()&gt;` | rust/lance-index-core/src/remapping.rs:235-235 | Fail when a legacy-only scope reaches a batch-remapping entry point. |
| `pub async fn remap_row_ids_async( remapper: &dyn BatchRowIdRemapper, row_ids: &[u64], ) -&gt; Result&lt;Vec&lt;Option&lt;u64&gt;&gt;&gt;` | rust/lance-index-core/src/remapping.rs:368-371 | Translate row IDs in input order, preserving duplicates and deleted positions. |
| `pub async fn remap_row_ids_preserving_layout_async( remapper: &dyn BatchRowIdRemapper, batch: RecordBatch, row_id_idx: usize, ) -&gt; Result&lt;(RecordBatch, Arc&lt;dyn RowIdRemapper&gt;)&gt;` | rust/lance-index-core/src/remapping.rs:392-396 | Translate only the address column, leaving encoded columns in their original layout. |
| `pub async fn remap_record_batch_async( remapper: &dyn BatchRowIdRemapper, batch: RecordBatch, row_id_idx: usize, ) -&gt; Result&lt;RecordBatch&gt;` | rust/lance-index-core/src/remapping.rs:434-438 | Translate a row-ID column and remove deleted rows from every column. |
| `pub async fn remap_row_addrs_tree_map_async( remapper: &dyn BatchRowIdRemapper, rows: &RowAddrTreeMap, ) -&gt; Result&lt;RowAddrTreeMap&gt;` | rust/lance-index-core/src/remapping.rs:446-449 | Translate an explicit physical row selection, dropping deleted addresses. |
| `pub async fn remap_row_ids_roaring_tree_map_async( remapper: &dyn BatchRowIdRemapper, rows: &RoaringTreemap, ) -&gt; Result&lt;RoaringTreemap&gt;` | rust/lance-index-core/src/remapping.rs:458-461 | Translate a bitmap of row IDs, dropping deleted rows. |

<a id="source-rust-lance-index-core-src-scalar-rs"></a>

## `rust/lance-index-core/src/scalar.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct IndexFile` | rust/lance-index-core/src/scalar.rs:33-33 | Metadata about a single file within an index segment. |
| `pub path: String,` | rust/lance-index-core/src/scalar.rs:35-35 | Path relative to the index directory (e.g., "index.idx", "auxiliary.idx") |
| `pub size_bytes: u64,` | rust/lance-index-core/src/scalar.rs:37-37 | Size of the file in bytes |
| `pub const LANCE_SCALAR_INDEX: &str = "__lance_scalar_index";` | rust/lance-index-core/src/scalar.rs:40-40 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum BuiltinIndexType` | rust/lance-index-core/src/scalar.rs:48-48 | Builtin index types supported by the Lance library |
| `pub fn as_str(&self) -&gt; &str` | rust/lance-index-core/src/scalar.rs:62-62 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ScalarIndexParams` | rust/lance-index-core/src/scalar.rs:99-99 | No standalone documentation summary; use the family contract and source entry. |
| `pub index_type: String,` | rust/lance-index-core/src/scalar.rs:103-103 | The type of index to create |
| `pub params: Option&lt;String&gt;,` | rust/lance-index-core/src/scalar.rs:108-108 | The parameters to train the index |
| `pub fn for_builtin(index_type: BuiltinIndexType) -&gt; Self` | rust/lance-index-core/src/scalar.rs:122-122 | Creates a new ScalarIndexParams from one of the builtin index types |
| `pub fn new(index_type: String) -&gt; Self` | rust/lance-index-core/src/scalar.rs:130-130 | Create a new ScalarIndexParams with the given index type |
| `pub fn with_params&lt;ParamsType: Serialize&gt;(mut self, params: &ParamsType) -&gt; Self` | rust/lance-index-core/src/scalar.rs:138-138 | Set the parameters for the index |
| `pub trait IndexWriter: Send` | rust/lance-index-core/src/scalar.rs:156-156 | Trait for storing an index (or parts of an index) into storage |
| `pub trait IndexReader: Send + Sync` | rust/lance-index-core/src/scalar.rs:178-178 | Trait for reading an index (or parts of an index) from storage |
| `pub trait IndexStore: std::fmt::Debug + Send + Sync + DeepSizeOf` | rust/lance-index-core/src/scalar.rs:315-315 | Trait abstracting I/O away from index logic |
| `pub trait AnyQuery: std::fmt::Debug + Any + Send + Sync` | rust/lance-index-core/src/scalar.rs:398-398 | Different scalar indices may support different kinds of queries |
| `pub enum SearchResult` | rust/lance-index-core/src/scalar.rs:417-417 | The result of a search operation against a scalar index |
| `pub fn exact(row_ids: impl Into&lt;RowAddrTreeMap&gt;) -&gt; Self` | rust/lance-index-core/src/scalar.rs:432-432 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn at_most(row_ids: impl Into&lt;RowAddrTreeMap&gt;) -&gt; Self` | rust/lance-index-core/src/scalar.rs:436-436 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn at_least(row_ids: impl Into&lt;RowAddrTreeMap&gt;) -&gt; Self` | rust/lance-index-core/src/scalar.rs:440-440 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_nulls(self, nulls: impl Into&lt;RowAddrTreeMap&gt;) -&gt; Self` | rust/lance-index-core/src/scalar.rs:444-444 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn row_addrs(&self) -&gt; &NullableRowAddrSet` | rust/lance-index-core/src/scalar.rs:452-452 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_exact(&self) -&gt; bool` | rust/lance-index-core/src/scalar.rs:460-460 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct CreatedIndex` | rust/lance-index-core/src/scalar.rs:466-466 | Brief information about an index that was created |
| `pub index_details: prost_types::Any,` | rust/lance-index-core/src/scalar.rs:471-471 | The details of the index that was created |
| `pub index_version: u32,` | rust/lance-index-core/src/scalar.rs:475-475 | The version of the index that was created |
| `pub files: Vec&lt;IndexFile&gt;,` | rust/lance-index-core/src/scalar.rs:480-480 | List of files and their sizes for this index |
| `pub enum TrainingOrdering` | rust/lance-index-core/src/scalar.rs:485-485 | The ordering that training data must satisfy |
| `pub struct TrainingCriteria` | rust/lance-index-core/src/scalar.rs:495-495 | No standalone documentation summary; use the family contract and source entry. |
| `pub ordering: TrainingOrdering,` | rust/lance-index-core/src/scalar.rs:496-496 | No standalone documentation summary; use the family contract and source entry. |
| `pub needs_row_ids: bool,` | rust/lance-index-core/src/scalar.rs:497-497 | No standalone documentation summary; use the family contract and source entry. |
| `pub needs_row_addrs: bool,` | rust/lance-index-core/src/scalar.rs:498-498 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(ordering: TrainingOrdering) -&gt; Self` | rust/lance-index-core/src/scalar.rs:502-502 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_row_id(mut self) -&gt; Self` | rust/lance-index-core/src/scalar.rs:510-510 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_row_addr(mut self) -&gt; Self` | rust/lance-index-core/src/scalar.rs:515-515 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct UpdateCriteria` | rust/lance-index-core/src/scalar.rs:522-522 | The criteria that specifies how to update an index |
| `pub requires_old_data: bool,` | rust/lance-index-core/src/scalar.rs:526-526 | If true, then we need to read the old data to update the index |
| `pub data_criteria: TrainingCriteria,` | rust/lance-index-core/src/scalar.rs:528-528 | The criteria required for data (both old and new) |
| `pub enum OldIndexDataFilter` | rust/lance-index-core/src/scalar.rs:538-538 | Filter used when merging existing scalar-index rows during update. |
| `pub fn filter_row_ids(&self, row_ids: &UInt64Array) -&gt; BooleanArray` | rust/lance-index-core/src/scalar.rs:555-555 | Build a boolean mask that keeps only row IDs selected by this filter. |
| `pub fn retain_old_rows(&self, rows: &mut RowAddrTreeMap)` | rust/lance-index-core/src/scalar.rs:572-572 | Apply this filter in place to a set of existing (old) row ids/addresses, retaining only the rows the filter selects to keep. Used by index types that merge old postings directly (e.g. bitmap) instead of re-scanning a row-id array through [`Self::filter_row_ids`]. |
| `pub fn requires_old_data(data_criteria: TrainingCriteria) -&gt; Self` | rust/lance-index-core/src/scalar.rs:581-581 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn only_new_data(data_criteria: TrainingCriteria) -&gt; Self` | rust/lance-index-core/src/scalar.rs:588-588 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct SearchOptions` | rust/lance-index-core/src/scalar.rs:598-598 | Execution-time options for scalar index searches. |
| `pub fn with_track_nulls(mut self, track_nulls: bool) -&gt; Self` | rust/lance-index-core/src/scalar.rs:615-615 | Configure whether searches preserve rows where the query evaluates to NULL. When disabled, implementations return only TRUE rows. |
| `pub fn track_nulls(&self) -&gt; bool` | rust/lance-index-core/src/scalar.rs:621-621 | Whether searches preserve rows where the query evaluates to NULL. |
| `pub trait ScalarIndex: Send + Sync + std::fmt::Debug + Index + DeepSizeOf` | rust/lance-index-core/src/scalar.rs:628-628 | A trait for a scalar index, a structure that can determine row ids that satisfy scalar queries |
| `pub trait RowIdRemapper: Send + Sync + std::fmt::Debug` | rust/lance-index-core/src/scalar.rs:769-769 | Abstraction over any type that can remap row IDs during index loading. |


## Referenced remapping surfaces added in this refresh

`RemapUnavailable`, `RowAddrTranslator`, `RowAddrTranslatorRef`, `materialize_remap`, and `ScalarIndex::remap_streaming` — see rust/lance-index-core/src/remapping.rs:92-218,259-362 and rust/lance-index-core/src/scalar.rs:666-723. [Contracts](../refresh-2026-10-07.md#fragment-reuse-remapping-and-concurrency).
