# lance-index: public declaration and documented-contract directory

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**Trust: declared source interface; body behavior is verified only where the linked family/protocol contract says so.** This catalog supplies exact argument/type entry points and the source author's first documentation paragraph. It is not an inferred call graph or a second symbol ledger. Rust `pub` can occur under a private/feature-gated module; confirm re-export and cfg boundaries before changing an external API. Trait method contracts and enum variants are reached through the trait/type entry. Python inherited external-library APIs are outside direct-source scope.

[Family contracts](../public-api.md) · [Module Map](../../L1-modules/rust-lance-index.md) · [Scope](../../V21-PROTOCOL.md)

<a id="source-rust-lance-index-src-frag-reuse-rs"></a>

## `rust/lance-index/src/frag_reuse.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use lance_table::system_index::frag_reuse::*;` | rust/lance-index/src/frag_reuse.rs:22-22 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod row_map;` | rust/lance-index/src/frag_reuse.rs:24-24 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod stable_partition;` | rust/lance-index/src/frag_reuse.rs:26-26 | Fragment-level stable-partition mapping reader. |
| `pub struct FragReuseIndexHandle(pub Arc&lt;FragReuseIndex&gt;);` | rust/lance-index/src/frag_reuse.rs:34-34 | Newtype wrapping [`FragReuseIndex`] so that `lance-index` can implement the `Index` and `RowIdRemapper` traits (orphan rules prevent implementing them directly in `lance-table`). |
| `pub struct CompactFragReuseIndexHandle(pub Arc&lt;CompactFragReuseIndex&gt;);` | rust/lance-index/src/frag_reuse.rs:38-38 | Adapter for the compact runtime representation loaded from persisted FRI details. |

<a id="source-rust-lance-index-src-frag-reuse-row-map-rs"></a>

## `rust/lance-index/src/frag_reuse/row_map.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const LABEL_COLUMN: &str = "label";` | rust/lance-index/src/frag_reuse/row_map.rs:53-53 | The single column of a row map file. |
| `pub struct SourceRows` | rust/lance-index/src/frag_reuse/row_map.rs:182-182 | The physical layout of one source fragment, in scan order. |
| `pub physical_rows: u64,` | rust/lance-index/src/frag_reuse/row_map.rs:184-184 | Physical rows of the fragment, including deleted rows. |
| `pub deleted: Option&lt;RoaringBitmap&gt;,` | rust/lance-index/src/frag_reuse/row_map.rs:186-186 | Deleted row offsets within the fragment at the rewrite's read version. |
| `pub struct RowMapWriter` | rust/lance-index/src/frag_reuse/row_map.rs:195-195 | Streaming writer for a row map file. |
| `pub fn schema() -&gt; Arc&lt;ArrowSchema&gt;` | rust/lance-index/src/frag_reuse/row_map.rs:208-208 | The Arrow schema of a row map file, for `IndexStore::new_index_file`. |
| `pub fn try_new( writer: Box&lt;dyn IndexWriter&gt;, sources: Vec&lt;SourceRows&gt;, num_destinations: u32, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/frag_reuse/row_map.rs:215-219 | Create a writer over `sources` (the rewrite's source fragments in scan order) targeting `num_destinations` ordered destinations, with the default 64K-row block size. |
| `pub fn try_new_with_block_rows( writer: Box&lt;dyn IndexWriter&gt;, sources: Vec&lt;SourceRows&gt;, num_destinations: u32, block_rows: u32, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/frag_reuse/row_map.rs:225-230 | [`Self::try_new`] with an explicit block size, the counts granularity and label IO unit; tests use small blocks to exercise boundaries. |
| `pub async fn append_labels(&mut self, labels: &[u16]) -&gt; Result&lt;()&gt;` | rust/lance-index/src/frag_reuse/row_map.rs:310-310 | Append the destination labels of the next live source rows, in scan order. |
| `pub async fn finish(mut self) -&gt; Result&lt;(IndexFile, CountsMatrix)&gt;` | rust/lance-index/src/frag_reuse/row_map.rs:325-325 | Finish the file: drain trailing deleted rows, write the counts matrix into a global buffer, and close the writer. |
| `pub struct RowMapReader` | rust/lance-index/src/frag_reuse/row_map.rs:352-352 | Reader over a row map file: one tail read at open, block reads on demand. |
| `pub async fn open(reader: Arc&lt;dyn IndexReader&gt;) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/frag_reuse/row_map.rs:372-372 | Open a row map file: decodes and validates the counts matrix from its global buffer without touching any label data. A corrupt counts buffer must fail here rather than translate rows to wrong addresses. |
| `pub fn counts(&self) -&gt; &CountsMatrix` | rust/lance-index/src/frag_reuse/row_map.rs:440-440 | The validated counts matrix decoded at open: per-destination totals and per-block counter bases without any label IO. |
| `pub async fn block_labels(&self, block: usize) -&gt; Result&lt;UInt16Array&gt;` | rust/lance-index/src/frag_reuse/row_map.rs:450-450 | The decoded labels of one block. |
| `pub async fn translate(&self, row: u64) -&gt; Result&lt;Option&lt;(u16, u32)&gt;&gt;` | rust/lance-index/src/frag_reuse/row_map.rs:563-563 | Translate one physical source row (concatenated scan order). Returns `None` when the row was deleted at the source, otherwise `(destination index, destination row offset)`. Reads one block. |
| `pub async fn translate_many(&self, rows: &[u64]) -&gt; Result&lt;Vec&lt;Option&lt;(u16, u32)&gt;&gt;&gt;` | rust/lance-index/src/frag_reuse/row_map.rs:573-573 | Translate a batch of physical source rows with one coalesced read of the touched blocks. |
| `pub async fn sweep( &self, rows: Range&lt;u64&gt;, mut f: impl FnMut(u64, Option&lt;(u16, u32)&gt;) -&gt; Result&lt;()&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance-index/src/frag_reuse/row_map.rs:624-628 | Translate every physical source row in `rows` in order, block by block, calling `f(row, translation)` for each. O(1) per row after the per-block read. |

<a id="source-rust-lance-index-src-frag-reuse-stable-partition-rs"></a>

## `rust/lance-index/src/frag_reuse/stable_partition.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const MAPPING_FILE: &str = "stable_partition.lance";` | rust/lance-index/src/frag_reuse/stable_partition.rs:21-21 | Immutable file name within the mapping's independently owned directory. |
| `pub struct StablePartitionMapping` | rust/lance-index/src/frag_reuse/stable_partition.rs:24-24 | A mapping reader that opens labels only when addresses need translation. |
| `pub fn try_new( store: Arc&lt;dyn IndexStore&gt;, sources: Vec&lt;FragmentDigest&gt;, destinations: Vec&lt;FragmentDigest&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/frag_reuse/stable_partition.rs:47-58 | Bind the file store to source scan order and destination label order. The store resolves the dataset base; this reader does not interpret manifests. |

<a id="source-rust-lance-index-src-lib-rs"></a>

## `rust/lance-index/src/lib.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod frag_reuse;` | rust/lance-index/src/lib.rs:17-17 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod mem_wal;` | rust/lance-index/src/lib.rs:18-18 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod metrics;` | rust/lance-index/src/lib.rs:19-19 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod optimize;` | rust/lance-index/src/lib.rs:20-20 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod prefilter;` | rust/lance-index/src/lib.rs:21-21 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod progress;` | rust/lance-index/src/lib.rs:22-22 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod registry;` | rust/lance-index/src/lib.rs:23-23 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod scalar;` | rust/lance-index/src/lib.rs:24-24 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod traits;` | rust/lance-index/src/lib.rs:25-25 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod vector;` | rust/lance-index/src/lib.rs:26-26 | No standalone documentation summary; use the family contract and source entry. |
| `pub use crate::traits::*;` | rust/lance-index/src/lib.rs:28-28 | No standalone documentation summary; use the family contract and source entry. |
| `pub use lance_index_core::` | rust/lance-index/src/lib.rs:31-31 | No standalone documentation summary; use the family contract and source entry. |
| `pub const INDEX_FILE_NAME: &str = "index.idx";` | rust/lance-index/src/lib.rs:33-33 | No standalone documentation summary; use the family contract and source entry. |
| `pub const INDEX_AUXILIARY_FILE_NAME: &str = "auxiliary.idx";` | rust/lance-index/src/lib.rs:38-38 | The name of the auxiliary index file. |
| `pub const INDEX_METADATA_SCHEMA_KEY: &str = "lance:index";` | rust/lance-index/src/lib.rs:39-39 | No standalone documentation summary; use the family contract and source entry. |
| `pub const VECTOR_INDEX_VERSION: u32 = 1;` | rust/lance-index/src/lib.rs:45-45 | Default version for vector index metadata. |
| `pub const IVF_RQ_INDEX_VERSION: u32 = 2;` | rust/lance-index/src/lib.rs:47-47 | Version for IVF_RQ indices. |
| `pub const MAX_PARTITION_SIZE_FACTOR: usize = 4;` | rust/lance-index/src/lib.rs:55-55 | The factor of threshold to trigger split / join for vector index. |
| `pub const MIN_PARTITION_SIZE_PERCENT: usize = 25;` | rust/lance-index/src/lib.rs:56-56 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod pb` | rust/lance-index/src/lib.rs:58-58 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod pbold` | rust/lance-index/src/lib.rs:63-63 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod cache_pb` | rust/lance-index/src/lib.rs:70-70 | Protobuf headers for serialized index cache entries (FTS posting lists, scalar indices, and IVF vector partitions). |
| `pub struct IndexMetadata` | rust/lance-index/src/lib.rs:76-76 | No standalone documentation summary; use the family contract and source entry. |
| `pub index_type: String,` | rust/lance-index/src/lib.rs:78-78 | No standalone documentation summary; use the family contract and source entry. |
| `pub distance_type: String,` | rust/lance-index/src/lib.rs:79-79 | No standalone documentation summary; use the family contract and source entry. |
| `pub use lance_table::system_index::is_system_index;` | rust/lance-index/src/lib.rs:82-82 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn infer_system_index_type( index_meta: &lance_table::format::IndexMetadata, ) -&gt; Option&lt;IndexType&gt;` | rust/lance-index/src/lib.rs:84-86 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-mem-wal-rs"></a>

## `rust/lance-index/src/mem_wal.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use lance_table::system_index::mem_wal::*;` | rust/lance-index/src/mem_wal.rs:19-19 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct MemWalIndexHandle(pub Arc&lt;MemWalIndex&gt;);` | rust/lance-index/src/mem_wal.rs:26-26 | Newtype wrapping [`MemWalIndex`] so that `lance-index` can implement the `Index` trait (orphan rules prevent implementing it directly in `lance-table`). |

<a id="source-rust-lance-index-src-metrics-rs"></a>

## `rust/lance-index/src/metrics.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use lance_index_core::metrics::*;` | rust/lance-index/src/metrics.rs:4-4 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-optimize-rs"></a>

## `rust/lance-index/src/optimize.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct OptimizeOptions` | rust/lance-index/src/optimize.rs:12-12 | Options for optimizing all indices. |
| `pub num_indices_to_merge: Option&lt;usize&gt;,` | rust/lance-index/src/optimize.rs:24-24 | Number of delta indices to merge for one column. Default: 1. |
| `pub index_names: Option&lt;Vec&lt;String&gt;&gt;,` | rust/lance-index/src/optimize.rs:27-27 | the index names to optimize. If None, all indices will be optimized. |
| `pub retrain: bool,` | rust/lance-index/src/optimize.rs:40-40 | whether to retrain the whole index. Default: false. |
| `pub transaction_properties: Option&lt;Arc&lt;HashMap&lt;String, String&gt;&gt;&gt;,` | rust/lance-index/src/optimize.rs:47-47 | Transaction properties to store with this commit. |
| `pub progress: Arc&lt;dyn IndexBuildProgress&gt;,` | rust/lance-index/src/optimize.rs:50-50 | Progress callback for index building during optimization. |
| `pub fn new() -&gt; Self` | rust/lance-index/src/optimize.rs:66-66 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn merge(num: usize) -&gt; Self` | rust/lance-index/src/optimize.rs:70-70 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn append() -&gt; Self` | rust/lance-index/src/optimize.rs:78-78 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn retrain() -&gt; Self` | rust/lance-index/src/optimize.rs:86-86 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn num_indices_to_merge(mut self, num: Option&lt;usize&gt;) -&gt; Self` | rust/lance-index/src/optimize.rs:95-95 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn index_names(mut self, names: Vec&lt;String&gt;) -&gt; Self` | rust/lance-index/src/optimize.rs:100-100 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn transaction_properties(mut self, properties: HashMap&lt;String, String&gt;) -&gt; Self` | rust/lance-index/src/optimize.rs:106-106 | Set transaction properties to store in the commit manifest. |
| `pub fn progress(mut self, progress: Arc&lt;dyn IndexBuildProgress&gt;) -&gt; Self` | rust/lance-index/src/optimize.rs:112-112 | Set progress callback for index building during optimization. |

<a id="source-rust-lance-index-src-prefilter-rs"></a>

## `rust/lance-index/src/prefilter.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub trait FilterLoader: Send + 'static` | rust/lance-index/src/prefilter.rs:14-14 | A trait to be implemented by anything supplying a prefilter row addr mask |
| `pub trait PreFilter: Send + Sync` | rust/lance-index/src/prefilter.rs:27-27 | Filter out row ids that we know are not relevant to the query. |
| `pub struct NoFilter;` | rust/lance-index/src/prefilter.rs:71-71 | A prefilter that does nothing |

<a id="source-rust-lance-index-src-progress-rs"></a>

## `rust/lance-index/src/progress.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub trait IndexBuildProgress: std::fmt::Debug + Sync + Send` | rust/lance-index/src/progress.rs:21-21 | Progress callback for index building and distributed index finalization. |
| `pub struct NoopIndexBuildProgress;` | rust/lance-index/src/progress.rs:36-36 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn noop_progress() -&gt; Arc&lt;dyn IndexBuildProgress&gt;` | rust/lance-index/src/progress.rs:52-52 | Helper to create a default noop progress instance. |

<a id="source-rust-lance-index-src-registry-rs"></a>

## `rust/lance-index/src/registry.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn plugin_name_from_details_url(type_url: &str) -&gt; String` | rust/lance-index/src/registry.rs:32-32 | Derive the scalar index plugin name from a details type URL. |
| `pub fn display_type_from_url(type_url: &str) -&gt; &str` | rust/lance-index/src/registry.rs:48-48 | Derive a human-readable index type name from a details type URL. |
| `pub struct IndexPluginRegistry` | rust/lance-index/src/registry.rs:57-57 | A registry of index plugins |
| `pub fn add_plugin&lt; DetailsType: prost::Message + prost::Name, PluginType: ScalarIndexPlugin + std::default::Default + 'static, &gt;( &mut self, )` | rust/lance-index/src/registry.rs:79-84 | Adds a plugin to the registry, using the name of the details message to determine the plugin name. |
| `pub fn with_default_plugins() -&gt; Arc&lt;Self&gt;` | rust/lance-index/src/registry.rs:98-98 | Create a registry with the default plugins |
| `pub fn supports_details(&self, details: &prost_types::Any) -&gt; bool` | rust/lance-index/src/registry.rs:141-141 | Returns whether the complete protobuf type name in `details` belongs to a registered scalar index reader. |
| `pub fn get_plugin_by_name(&self, name: &str) -&gt; Result&lt;&dyn ScalarIndexPlugin&gt;` | rust/lance-index/src/registry.rs:153-153 | Get an index plugin suitable for training an index with the given parameters |
| `pub fn get_plugin_by_details( &self, details: &prost_types::Any, ) -&gt; Result&lt;&dyn ScalarIndexPlugin&gt;` | rust/lance-index/src/registry.rs:171-174 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-rs"></a>

## `rust/lance-index/src/scalar.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use crate::metrics::MetricsCollector;` | rust/lance-index/src/scalar.rs:26-26 | No standalone documentation summary; use the family contract and source entry. |
| `pub use lance_index_core::remapping::` | rust/lance-index/src/scalar.rs:27-27 | No standalone documentation summary; use the family contract and source entry. |
| `pub use lance_index_core::scalar::` | rust/lance-index/src/scalar.rs:32-32 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod bitmap;` | rust/lance-index/src/scalar.rs:38-38 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod bloomfilter;` | rust/lance-index/src/scalar.rs:39-39 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod btree;` | rust/lance-index/src/scalar.rs:40-40 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod expression;` | rust/lance-index/src/scalar.rs:41-41 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod fmindex;` | rust/lance-index/src/scalar.rs:42-42 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod inverted;` | rust/lance-index/src/scalar.rs:43-43 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod json;` | rust/lance-index/src/scalar.rs:44-44 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod label_list;` | rust/lance-index/src/scalar.rs:45-45 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod lance_format;` | rust/lance-index/src/scalar.rs:46-46 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod minhash_lsh;` | rust/lance-index/src/scalar.rs:47-47 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod ngram;` | rust/lance-index/src/scalar.rs:48-48 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod registry;` | rust/lance-index/src/scalar.rs:49-49 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod rtree;` | rust/lance-index/src/scalar.rs:53-53 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod seed;` | rust/lance-index/src/scalar.rs:54-54 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod zoned;` | rust/lance-index/src/scalar.rs:55-55 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod zonemap;` | rust/lance-index/src/scalar.rs:56-56 | No standalone documentation summary; use the family contract and source entry. |
| `pub use inverted::tokenizer::InvertedIndexParams;` | rust/lance-index/src/scalar.rs:58-58 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn index_files_to_table( files: Vec&lt;lance_index_core::scalar::IndexFile&gt;, ) -&gt; Vec&lt;lance_table::format::IndexFile&gt;` | rust/lance-index/src/scalar.rs:65-67 | Convert a `Vec&lt;`[`lance_index_core::scalar::IndexFile`]`&gt;` to a `Vec&lt;`[`lance_table::format::IndexFile`]`&gt;`. |
| `pub fn table_files_to_index( files: Vec&lt;lance_table::format::IndexFile&gt;, ) -&gt; Vec&lt;lance_index_core::scalar::IndexFile&gt;` | rust/lance-index/src/scalar.rs:82-84 | Convert a `Vec&lt;`[`lance_table::format::IndexFile`]`&gt;` to a `Vec&lt;`[`lance_index_core::scalar::IndexFile`]`&gt;`. |
| `pub struct FullTextSearchQuery` | rust/lance-index/src/scalar.rs:106-106 | A full text search query |
| `pub query: FtsQuery,` | rust/lance-index/src/scalar.rs:107-107 | No standalone documentation summary; use the family contract and source entry. |
| `pub limit: Option&lt;i64&gt;,` | rust/lance-index/src/scalar.rs:110-110 | The maximum number of results to return |
| `pub wand_factor: Option&lt;f32&gt;,` | rust/lance-index/src/scalar.rs:116-116 | The wand factor to use for ranking if None, use the default value of 1.0 Increasing this value will reduce the recall and improve the performance 1.0 is the value that would give the best performance without recall loss |
| `pub fn new(query: String) -&gt; Self` | rust/lance-index/src/scalar.rs:121-121 | Create a new terms query |
| `pub fn new_fuzzy(term: String, max_distance: Option&lt;u32&gt;) -&gt; Self` | rust/lance-index/src/scalar.rs:131-131 | Create a new fuzzy query |
| `pub fn new_query(query: FtsQuery) -&gt; Self` | rust/lance-index/src/scalar.rs:141-141 | Create a new compound query |
| `pub fn with_column(mut self, column: String) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar.rs:151-151 | Set the column to search over This is available for only MatchQuery and PhraseQuery |
| `pub fn with_columns(mut self, columns: &[String]) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar.rs:158-158 | Set the column to search over This is available for only MatchQuery |
| `pub fn limit(mut self, limit: Option&lt;i64&gt;) -&gt; Self` | rust/lance-index/src/scalar.rs:165-165 | limit the number of results to return if None, return all results |
| `pub fn wand_factor(mut self, wand_factor: Option&lt;f32&gt;) -&gt; Self` | rust/lance-index/src/scalar.rs:170-170 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn columns(&self) -&gt; HashSet&lt;String&gt;` | rust/lance-index/src/scalar.rs:175-175 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn params(&self) -&gt; FtsSearchParams` | rust/lance-index/src/scalar.rs:179-179 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum SargableQuery` | rust/lance-index/src/scalar.rs:196-196 | A query that a basic scalar index (e.g. btree / bitmap) can satisfy |
| `pub enum LabelListQuery` | rust/lance-index/src/scalar.rs:376-376 | A query that a LabelListIndex can satisfy |
| `pub enum TextQuery` | rust/lance-index/src/scalar.rs:447-447 | A query that a NGramIndex can satisfy |
| `pub enum TokenQuery` | rust/lance-index/src/scalar.rs:503-503 | A query that a InvertedIndex can satisfy |
| `pub enum BloomFilterQuery` | rust/lance-index/src/scalar.rs:514-514 | A query that a BloomFilter index can satisfy |
| `pub struct RelationQuery` | rust/lance-index/src/scalar.rs:604-604 | No standalone documentation summary; use the family contract and source entry. |
| `pub value: ScalarValue,` | rust/lance-index/src/scalar.rs:605-605 | No standalone documentation summary; use the family contract and source entry. |
| `pub field: Field,` | rust/lance-index/src/scalar.rs:606-606 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum GeoQuery` | rust/lance-index/src/scalar.rs:612-612 | A query that a Geo index can satisfy |
| `pub fn compute_next_prefix(prefix: &str) -&gt; Option&lt;String&gt;` | rust/lance-index/src/scalar.rs:665-665 | Compute the lexicographically next prefix by incrementing the last character's code point. Returns None if no valid upper bound exists. |

<a id="source-rust-lance-index-src-scalar-bitmap-rs"></a>

## `rust/lance-index/src/scalar/bitmap.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const BITMAP_LOOKUP_NAME: &str = "bitmap_page_lookup.lance";` | rust/lance-index/src/scalar/bitmap.rs:64-64 | No standalone documentation summary; use the family contract and source entry. |
| `pub const INDEX_STATS_METADATA_KEY: &str = "lance:index_stats";` | rust/lance-index/src/scalar/bitmap.rs:65-65 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct BitmapIndex` | rust/lance-index/src/scalar/bitmap.rs:139-139 | A scalar index that stores a bitmap for each possible value |
| `pub struct BitmapKey` | rust/lance-index/src/scalar/bitmap.rs:164-164 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct BitmapIndexState` | rust/lance-index/src/scalar/bitmap.rs:215-215 | The serializable state of a [`BitmapIndex`]. |
| `pub struct BitmapParameters` | rust/lance-index/src/scalar/bitmap.rs:787-787 | No standalone documentation summary; use the family contract and source entry. |
| `pub shard_id: Option&lt;u32&gt;,` | rust/lance-index/src/scalar/bitmap.rs:790-790 | Optional shard identifier for distributed bitmap builds spanning multiple fragments. |
| `pub struct BitmapIndexPlugin;` | rust/lance-index/src/scalar/bitmap.rs:1569-1569 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn train_bitmap_index( data: SendableRecordBatchStream, index_store: &dyn IndexStore, ) -&gt; Result&lt;IndexFile&gt;` | rust/lance-index/src/scalar/bitmap.rs:1743-1746 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn merge_index_files( object_store: &ObjectStore, index_dir: &Path, store: Arc&lt;dyn IndexStore&gt;, progress: Arc&lt;dyn IndexBuildProgress&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance-index/src/scalar/bitmap.rs:1904-1909 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn merge_bitmap_indices( source_indices: &[Arc&lt;BitmapIndex&gt;], dest_store: &dyn IndexStore, progress: Arc&lt;dyn IndexBuildProgress&gt;, ) -&gt; Result&lt;CreatedIndex&gt;` | rust/lance-index/src/scalar/bitmap.rs:2247-2251 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-bloomfilter-rs"></a>

## `rust/lance-index/src/scalar/bloomfilter.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct BloomFilterIndex` | rust/lance-index/src/scalar/bloomfilter.rs:89-89 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn merge_bloomfilter_indices( source_indices: &[(&BloomFilterIndex, &RoaringBitmap)], dest_store: &dyn IndexStore, ) -&gt; Result&lt;CreatedIndex&gt;` | rust/lance-index/src/scalar/bloomfilter.rs:676-679 | Merge caller-selected BloomFilter segments into one self-contained segment. |
| `pub struct BloomFilterIndexBuilderParams` | rust/lance-index/src/scalar/bloomfilter.rs:800-800 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct BloomFilterIndexBuilder` | rust/lance-index/src/scalar/bloomfilter.rs:826-826 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn try_new(params: BloomFilterIndexBuilderParams) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/bloomfilter.rs:836-836 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn train(&mut self, batches_source: SendableRecordBatchStream) -&gt; Result&lt;()&gt;` | rust/lance-index/src/scalar/bloomfilter.rs:847-847 | Train the builder using the shared ZoneTrainer. The input stream is expected to contain the value column followed by `_rowaddr`, matching the order emitted by the scalar index training pipeline. |
| `pub async fn write_index(self, index_store: &dyn IndexStore) -&gt; Result&lt;Vec&lt;IndexFile&gt;&gt;` | rust/lance-index/src/scalar/bloomfilter.rs:895-895 | Serialize the trained bloom filter zone statistics into an index file in `index_store`, returning the resulting [`IndexFile`]s. |
| `pub struct BloomFilterIndexPlugin;` | rust/lance-index/src/scalar/bloomfilter.rs:1378-1378 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct BloomFilterIndexTrainingRequest` | rust/lance-index/src/scalar/bloomfilter.rs:1546-1546 | No standalone documentation summary; use the family contract and source entry. |
| `pub params: BloomFilterIndexBuilderParams,` | rust/lance-index/src/scalar/bloomfilter.rs:1547-1547 | No standalone documentation summary; use the family contract and source entry. |
| `pub criteria: TrainingCriteria,` | rust/lance-index/src/scalar/bloomfilter.rs:1548-1548 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(params: BloomFilterIndexBuilderParams) -&gt; Self` | rust/lance-index/src/scalar/bloomfilter.rs:1552-1552 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-btree-rs"></a>

## `rust/lance-index/src/scalar/btree.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const BTREE_LOOKUP_NAME: &str = "page_lookup.lance";` | rust/lance-index/src/scalar/btree.rs:92-92 | No standalone documentation summary; use the family contract and source entry. |
| `pub const DEFAULT_BTREE_BATCH_SIZE: u64 = 4096;` | rust/lance-index/src/scalar/btree.rs:94-94 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct OrderableScalarValue(pub ScalarValue);` | rust/lance-index/src/scalar/btree.rs:105-105 | Wraps a ScalarValue and implements Ord (ScalarValue only implements PartialOrd) |
| `pub struct BTreeLookup` | rust/lance-index/src/scalar/btree.rs:715-715 | Satisfies scalar queries by searching the `page_lookup.lance` batch directly. |
| `pub struct CachedScalarIndex(Arc&lt;dyn ScalarIndex&gt;);` | rust/lance-index/src/scalar/btree.rs:1441-1441 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(index: Arc&lt;dyn ScalarIndex&gt;) -&gt; Self` | rust/lance-index/src/scalar/btree.rs:1444-1444 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn into_inner(self) -&gt; Arc&lt;dyn ScalarIndex&gt;` | rust/lance-index/src/scalar/btree.rs:1448-1448 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct BTreePageKey` | rust/lance-index/src/scalar/btree.rs:1454-1454 | No standalone documentation summary; use the family contract and source entry. |
| `pub page_number: u32,` | rust/lance-index/src/scalar/btree.rs:1455-1455 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct BTreeIndex` | rust/lance-index/src/scalar/btree.rs:1619-1619 | Note: this is very similar to the IVF index except we store the IVF part in a btree for faster lookup |
| `pub async fn contains_keys( &self, keys: &[ScalarValue], metrics: &dyn MetricsCollector, ) -&gt; Result&lt;Vec&lt;bool&gt;&gt;` | rust/lance-index/src/scalar/btree.rs:1706-1710 | For each key in `keys`, whether this index contains it — a batched existence check returning a mask aligned to `keys`. |
| `pub async fn merge_segments( segments: &[Arc&lt;Self&gt;], new_data: SendableRecordBatchStream, dest_store: &dyn IndexStore, old_data_filters: &[Option&lt;OldIndexDataFilter&gt;], ) -&gt; Result&lt;CreatedIndex&gt;` | rust/lance-index/src/scalar/btree.rs:2199-2204 | Merge N source BTree segments plus an additional `new_data` stream into a single BTree under `dest_store`, without re-reading the dataset. |
| `pub trait BTreeSubIndex: Debug + Send + Sync + DeepSizeOf` | rust/lance-index/src/scalar/btree.rs:2847-2847 | A trait that must be implemented by anything that wishes to act as a btree subindex |
| `pub async fn train_btree_index( batches_source: SendableRecordBatchStream, index_store: &dyn IndexStore, batch_size: u64, fragment_ids: Option&lt;Vec&lt;u32&gt;&gt;, range_id: Option&lt;u32&gt;, ) -&gt; Result&lt;Vec&lt;IndexFile&gt;&gt;` | rust/lance-index/src/scalar/btree.rs:2935-2941 | Train a btree index from a stream of sorted page-size batches of values and row ids |
| `pub struct BTreeParameters` | rust/lance-index/src/scalar/btree.rs:3592-3592 | Parameters for a btree index |
| `pub zone_size: Option&lt;u64&gt;,` | rust/lance-index/src/scalar/btree.rs:3594-3594 | The number of rows to include in each zone |
| `pub range_id: Option&lt;u32&gt;,` | rust/lance-index/src/scalar/btree.rs:3609-3609 | DEPRECATED: range-based distributed BTree building has been retired. Setting this to `Some(..)` now emits a warning and is ignored at build time (see `BTreeIndexPlugin::train_index`). Build one segment per worker and commit them with `commit_existing_index_segments(...)`, optionally consolidating with `merge_existing_index_segments(...)`. The field is retained (rather than removed) so the plugin can detect stale `range_id` inputs and warn loudly instead of serde silently dropping an unknown field. |
| `pub fn new(parameters: BTreeParameters) -&gt; Self` | rust/lance-index/src/scalar/btree.rs:3618-3618 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct BTreeIndexPlugin;` | rust/lance-index/src/scalar/btree.rs:3638-3638 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-btree-flat-rs"></a>

## `rust/lance-index/src/scalar/btree/flat.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct PageMatches` | rust/lance-index/src/scalar/btree/flat.rs:52-52 | The rows of one page that matched a query, before they are assembled into a [`NullableRowAddrSet`]. |
| `pub fn empty() -&gt; Self` | rust/lance-index/src/scalar/btree/flat.rs:62-62 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn selected(&self) -&gt; &[u64]` | rust/lance-index/src/scalar/btree/flat.rs:67-67 | Row ids for which the predicate was TRUE, sorted ascending. |
| `pub fn nulls(&self) -&gt; &[u64]` | rust/lance-index/src/scalar/btree/flat.rs:72-72 | Row ids for which the predicate was NULL, sorted ascending. |
| `pub fn into_row_addr_set(self) -&gt; Result&lt;NullableRowAddrSet&gt;` | rust/lance-index/src/scalar/btree/flat.rs:78-78 | Build the set for this page alone. For many pages, assemble once from [`Self::selected`] / [`Self::nulls`] across all of them instead. |
| `pub struct FlatIndex` | rust/lance-index/src/scalar/btree/flat.rs:97-97 | A flat index is just a batch of value/row-id pairs |
| `pub fn try_new(data: RecordBatch) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/btree/flat.rs:115-115 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn all_matches(&self) -&gt; Result&lt;PageMatches&gt;` | rust/lance-index/src/scalar/btree/flat.rs:202-202 | Every row as TRUE, with the NULL rows also reported as NULL. |
| `pub fn all_ignore_nulls_matches(&self) -&gt; PageMatches` | rust/lance-index/src/scalar/btree/flat.rs:208-208 | Every row as TRUE, NULL rows included, without reporting any NULLs. |
| `pub fn all_non_null_matches(&self) -&gt; Result&lt;PageMatches&gt;` | rust/lance-index/src/scalar/btree/flat.rs:213-213 | Every non-null row as TRUE without preserving NULL rows. |
| `pub fn all(&self) -&gt; Result&lt;NullableRowAddrSet&gt;` | rust/lance-index/src/scalar/btree/flat.rs:217-217 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn all_ignore_nulls(&self) -&gt; Result&lt;NullableRowAddrSet&gt;` | rust/lance-index/src/scalar/btree/flat.rs:221-221 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn all_non_null(&self) -&gt; Result&lt;NullableRowAddrSet&gt;` | rust/lance-index/src/scalar/btree/flat.rs:226-226 | Return every non-null row as TRUE without preserving NULL rows. |
| `pub fn remap_batch(batch: RecordBatch, mapping: &RowAddrRemap) -&gt; Result&lt;RecordBatch&gt;` | rust/lance-index/src/scalar/btree/flat.rs:242-242 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn search_matches( &self, query: &dyn AnyQuery, track_nulls: bool, metrics: &dyn MetricsCollector, ) -&gt; Result&lt;PageMatches&gt;` | rust/lance-index/src/scalar/btree/flat.rs:275-280 | Evaluate `query` against this page, returning the matched row ids. |
| `pub fn search( &self, query: &dyn AnyQuery, track_nulls: bool, metrics: &dyn MetricsCollector, ) -&gt; Result&lt;NullableRowAddrSet&gt;` | rust/lance-index/src/scalar/btree/flat.rs:335-340 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn search_prebuilt_matches( &self, expr: &Arc&lt;dyn PhysicalExpr&gt;, track_nulls: bool, metrics: &dyn MetricsCollector, ) -&gt; Result&lt;PageMatches&gt;` | rust/lance-index/src/scalar/btree/flat.rs:348-353 | Evaluate a predicate compiled once by the caller. Lets a large IsIn that spans many pages build the physical expr a single time instead of rebuilding the whole IN-list per page (the dominant cost of a big lookup). |
| `pub fn search_prebuilt( &self, expr: &Arc&lt;dyn PhysicalExpr&gt;, track_nulls: bool, metrics: &dyn MetricsCollector, ) -&gt; Result&lt;NullableRowAddrSet&gt;` | rust/lance-index/src/scalar/btree/flat.rs:359-364 | [`Self::search_prebuilt_matches`] wrapped into a [`NullableRowAddrSet`]. |
| `pub fn calculate_included_frags(&self) -&gt; Result&lt;RoaringBitmap&gt;` | rust/lance-index/src/scalar/btree/flat.rs:392-392 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-expression-rs"></a>

## `rust/lance-index/src/scalar/expression.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct IndexedExpression` | rust/lance-index/src/scalar/expression.rs:63-63 | An indexed expression consists of a scalar index query with a post-scan filter |
| `pub scalar_query: Option&lt;ScalarIndexExpr&gt;,` | rust/lance-index/src/scalar/expression.rs:65-65 | The portion of the query that can be satisfied by scalar indices |
| `pub refine_expr: Option&lt;Expr&gt;,` | rust/lance-index/src/scalar/expression.rs:67-67 | The portion of the query that cannot be satisfied by scalar indices |
| `pub trait ScalarQueryParser: std::fmt::Debug + Send + Sync` | rust/lance-index/src/scalar/expression.rs:70-70 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct MultiQueryParser` | rust/lance-index/src/scalar/expression.rs:171-171 | A generic parser that wraps multiple scalar query parsers |
| `pub fn single(parser: Box&lt;dyn ScalarQueryParser&gt;) -&gt; Self` | rust/lance-index/src/scalar/expression.rs:177-177 | Create a new MultiQueryParser with a single parser |
| `pub fn add(&mut self, other: Box&lt;dyn ScalarQueryParser&gt;)` | rust/lance-index/src/scalar/expression.rs:184-184 | Add a new parser to the MultiQueryParser |
| `pub fn select( &self, expr: &Expr, data_type: &DataType, ) -&gt; Option&lt;(&dyn ScalarQueryParser, DataType)&gt;` | rust/lance-index/src/scalar/expression.rs:189-193 | Pick the first underlying parser whose `is_valid_reference` accepts `expr`. |
| `pub struct SargableQueryParser` | rust/lance-index/src/scalar/expression.rs:273-273 | A parser for indices that handle SARGable queries |
| `pub fn new(index_name: String, index_type: String, needs_recheck: bool) -&gt; Self` | rust/lance-index/src/scalar/expression.rs:285-285 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn without_like_prefix(mut self) -&gt; Self` | rust/lance-index/src/scalar/expression.rs:298-298 | Bitmap (and similar) indexes cannot answer prefix queries; disabling `LikePrefix` emission makes `LIKE`/`starts_with` predicates fall back to ordinary filtering instead of failing at search time. |
| `pub fn with_exact_null_tracking(mut self) -&gt; Self` | rust/lance-index/src/scalar/expression.rs:306-306 | Mark IS NULL as exact so that IS NOT NULL can be served by the index without a post-filter. Use this when the index tracks null row addresses precisely (e.g. a zone map with a null bitmap). |
| `pub struct BloomFilterQueryParser` | rust/lance-index/src/scalar/expression.rs:640-640 | A parser for bloom filter indices that only support equals, is_null, and is_in operations |
| `pub fn new(index_name: String, index_type: String, needs_recheck: bool) -&gt; Self` | rust/lance-index/src/scalar/expression.rs:647-647 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct LabelListQueryParser` | rust/lance-index/src/scalar/expression.rs:735-735 | A parser for indices that handle label list queries |
| `pub fn new(index_name: String, index_type: String) -&gt; Self` | rust/lance-index/src/scalar/expression.rs:741-741 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct TextQueryParser` | rust/lance-index/src/scalar/expression.rs:854-854 | A parser for indices that handle string `contains` queries, and -- when `supports_regex` is set -- `regexp_like` / `regexp_match` queries. |
| `pub fn new( index_name: String, index_type: String, needs_recheck: bool, supports_regex: bool, min_contains_chars: usize, ) -&gt; Self` | rust/lance-index/src/scalar/expression.rs:866-872 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FtsQueryParser` | rust/lance-index/src/scalar/expression.rs:1084-1084 | A parser for indices that handle queries with the contains_tokens function |
| `pub fn new(name: String, index_type: String) -&gt; Self` | rust/lance-index/src/scalar/expression.rs:1090-1090 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct GeoQueryParser` | rust/lance-index/src/scalar/expression.rs:1158-1158 | A parser for geo indices that handles spatial queries |
| `pub fn new(index_name: String, index_type: String) -&gt; Self` | rust/lance-index/src/scalar/expression.rs:1165-1165 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait ScalarIndexLoader: Send + Sync` | rust/lance-index/src/scalar/expression.rs:1435-1435 | A trait implemented by anything that can load indices by name |
| `pub struct ScalarIndexSearch` | rust/lance-index/src/scalar/expression.rs:1461-1461 | This represents a search into a scalar index |
| `pub column: String,` | rust/lance-index/src/scalar/expression.rs:1463-1463 | The column to search (redundant, used for debugging messages) |
| `pub index_name: String,` | rust/lance-index/src/scalar/expression.rs:1465-1465 | The name of the index to search |
| `pub index_type: String,` | rust/lance-index/src/scalar/expression.rs:1467-1467 | The type of the index being searched (e.g. "BTree", "Bitmap"), used for display purposes |
| `pub query: Arc&lt;dyn AnyQuery&gt;,` | rust/lance-index/src/scalar/expression.rs:1469-1469 | The query to search for |
| `pub needs_recheck: bool,` | rust/lance-index/src/scalar/expression.rs:1471-1471 | If true, the query results are inexact and will need a recheck |
| `pub fragment_bitmap: Option&lt;RoaringBitmap&gt;,` | rust/lance-index/src/scalar/expression.rs:1479-1479 | The fragments the underlying index has entries for. |
| `pub enum ScalarIndexExpr` | rust/lance-index/src/scalar/expression.rs:1498-1498 | This represents a lookup into one or more scalar indices |
| `pub fn optimize(self) -&gt; Self` | rust/lance-index/src/scalar/expression.rs:1691-1691 | Apply scalar-index optimizer rules within each contiguous AND region. |
| `pub async fn evaluate_nullable( &self, index_loader: &dyn ScalarIndexLoader, metrics: &dyn MetricsCollector, ) -&gt; Result&lt;NullableIndexExprResult&gt;` | rust/lance-index/src/scalar/expression.rs:1937-1941 | Evaluates the scalar index expression |
| `pub async fn evaluate( &self, index_loader: &dyn ScalarIndexLoader, metrics: &dyn MetricsCollector, ) -&gt; Result&lt;IndexExprResult&gt;` | rust/lance-index/src/scalar/expression.rs:1999-2003 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn to_expr(&self) -&gt; Expr` | rust/lance-index/src/scalar/expression.rs:2010-2010 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn needs_recheck(&self) -&gt; bool` | rust/lance-index/src/scalar/expression.rs:2027-2027 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait IndexInformationProvider` | rust/lance-index/src/scalar/expression.rs:2484-2484 | A trait to be used in `apply_scalar_indices` to inform the function which columns are indexeds |
| `pub fn apply_scalar_indices( expr: Expr, index_info: &dyn IndexInformationProvider, ) -&gt; Result&lt;IndexedExpression&gt;` | rust/lance-index/src/scalar/expression.rs:2502-2505 | Attempt to split a filter expression into a search of scalar indexes and an optional post-search refinement query |
| `pub struct FilterPlan` | rust/lance-index/src/scalar/expression.rs:2534-2534 | No standalone documentation summary; use the family contract and source entry. |
| `pub index_query: Option&lt;ScalarIndexExpr&gt;,` | rust/lance-index/src/scalar/expression.rs:2535-2535 | No standalone documentation summary; use the family contract and source entry. |
| `pub skip_recheck: bool,` | rust/lance-index/src/scalar/expression.rs:2537-2537 | True if the index query is guaranteed to return exact results |
| `pub refine_expr: Option&lt;Expr&gt;,` | rust/lance-index/src/scalar/expression.rs:2538-2538 | No standalone documentation summary; use the family contract and source entry. |
| `pub full_expr: Option&lt;Expr&gt;,` | rust/lance-index/src/scalar/expression.rs:2539-2539 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn empty() -&gt; Self` | rust/lance-index/src/scalar/expression.rs:2543-2543 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_refine_only(expr: Expr) -&gt; Self` | rust/lance-index/src/scalar/expression.rs:2552-2552 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance-index/src/scalar/expression.rs:2561-2561 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn all_columns(&self) -&gt; Vec&lt;String&gt;` | rust/lance-index/src/scalar/expression.rs:2565-2565 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn refine_columns(&self) -&gt; Vec&lt;String&gt;` | rust/lance-index/src/scalar/expression.rs:2572-2572 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn has_refine(&self) -&gt; bool` | rust/lance-index/src/scalar/expression.rs:2580-2580 | Return true if this has a refine step, regardless of the status of prefilter |
| `pub fn has_index_query(&self) -&gt; bool` | rust/lance-index/src/scalar/expression.rs:2585-2585 | Return true if this has a scalar index query |
| `pub fn has_any_filter(&self) -&gt; bool` | rust/lance-index/src/scalar/expression.rs:2589-2589 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn make_refine_only(&mut self)` | rust/lance-index/src/scalar/expression.rs:2593-2593 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_exact_index_search(&self) -&gt; bool` | rust/lance-index/src/scalar/expression.rs:2599-2599 | Return true if there is no refine or recheck of any kind and there is an index query |
| `pub trait PlannerIndexExt` | rust/lance-index/src/scalar/expression.rs:2604-2604 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-fmindex-rs"></a>

## `rust/lance-index/src/scalar/fmindex.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct FMIndex` | rust/lance-index/src/scalar/fmindex.rs:903-903 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FMIndexScalarIndex` | rust/lance-index/src/scalar/fmindex.rs:1426-1426 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FMIndexPlugin;` | rust/lance-index/src/scalar/fmindex.rs:2267-2267 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-rs"></a>

## `rust/lance-index/src/scalar/inverted.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod builder;` | rust/lance-index/src/scalar/inverted.rs:4-4 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod json;` | rust/lance-index/src/scalar/inverted.rs:14-14 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod oracle;` | rust/lance-index/src/scalar/inverted.rs:18-18 | Brute-force scoring reference for tests and benches. Never built normally; see the module docs for the gating. |
| `pub mod parser;` | rust/lance-index/src/scalar/inverted.rs:19-19 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod query;` | rust/lance-index/src/scalar/inverted.rs:20-20 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod tokenizer;` | rust/lance-index/src/scalar/inverted.rs:22-22 | No standalone documentation summary; use the family contract and source entry. |
| `pub use builder::InvertedIndexBuilder;` | rust/lance-index/src/scalar/inverted.rs:31-31 | No standalone documentation summary; use the family contract and source entry. |
| `pub use combined::` | rust/lance-index/src/scalar/inverted.rs:32-32 | No standalone documentation summary; use the family contract and source entry. |
| `pub use compound::` | rust/lance-index/src/scalar/inverted.rs:36-36 | No standalone documentation summary; use the family contract and source entry. |
| `pub use cross_column::cross_column_compound_search;` | rust/lance-index/src/scalar/inverted.rs:43-43 | No standalone documentation summary; use the family contract and source entry. |
| `pub use index::*;` | rust/lance-index/src/scalar/inverted.rs:45-45 | No standalone documentation summary; use the family contract and source entry. |
| `pub use lance_tokenizer::Language;` | rust/lance-index/src/scalar/inverted.rs:47-47 | No standalone documentation summary; use the family contract and source entry. |
| `pub use scorer::` | rust/lance-index/src/scalar/inverted.rs:48-48 | No standalone documentation summary; use the family contract and source entry. |
| `pub use tokenizer::*;` | rust/lance-index/src/scalar/inverted.rs:49-49 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct PreparedBm25Query` | rust/lance-index/src/scalar/inverted.rs:60-60 | Canonical token vocabulary and BM25 statistics for one indexed query leaf. |
| `pub fn tokens(&self) -&gt; &Arc&lt;Tokens&gt;` | rust/lance-index/src/scalar/inverted.rs:96-96 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn scorer(&self) -&gt; &Arc&lt;MemBM25Scorer&gt;` | rust/lance-index/src/scalar/inverted.rs:101-101 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn prepare_bm25_query( indices: &[Arc&lt;InvertedIndex&gt;], query_tokens: Tokens, params: &FtsSearchParams, metrics: Option&lt;&dyn crate::scalar::MetricsCollector&gt;, base_scorer: Option&lt;Arc&lt;MemBM25Scorer&gt;&gt;, ) -&gt; Result&lt;PreparedBm25Query&gt;` | rust/lance-index/src/scalar/inverted.rs:317-323 | Expand and score one indexed query leaf exactly once across all segments. |
| `pub async fn build_global_bm25_scorer( indices: &[Arc&lt;InvertedIndex&gt;], query_tokens: &Tokens, params: &FtsSearchParams, metrics: Option&lt;&dyn crate::scalar::MetricsCollector&gt;, ) -&gt; Result&lt;MemBM25Scorer&gt;` | rust/lance-index/src/scalar/inverted.rs:418-423 | Build a shared [`MemBM25Scorer`] across a set of FTS index segments. |
| `pub struct InvertedIndexPlugin;` | rust/lance-index/src/scalar/inverted.rs:444-444 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn train_inverted_index( data: SendableRecordBatchStream, index_store: &dyn IndexStore, params: InvertedIndexParams, fragment_ids: Option&lt;Vec&lt;u32&gt;&gt;, progress: Arc&lt;dyn IndexBuildProgress&gt;, ) -&gt; Result&lt;CreatedIndex&gt;` | rust/lance-index/src/scalar/inverted.rs:447-453 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(parameters: InvertedIndexParams) -&gt; Self` | rust/lance-index/src/scalar/inverted.rs:499-499 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-builder-rs"></a>

## `rust/lance-index/src/scalar/inverted/builder.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const BLOCK_SIZE: usize = BitPacker4x::BLOCK_LEN;` | rust/lance-index/src/scalar/inverted/builder.rs:48-48 | No standalone documentation summary; use the family contract and source entry. |
| `pub static LANCE_FTS_NUM_SHARDS: LazyLock&lt;usize&gt; = LazyLock::new(\|\|` | rust/lance-index/src/scalar/inverted/builder.rs:53-53 | No standalone documentation summary; use the family contract and source entry. |
| `pub static LANCE_FTS_PARTITION_SIZE: LazyLock&lt;u64&gt; = LazyLock::new(\|\|` | rust/lance-index/src/scalar/inverted/builder.rs:60-60 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct InvertedIndexBuilder` | rust/lance-index/src/scalar/inverted/builder.rs:197-197 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(params: InvertedIndexParams) -&gt; Self` | rust/lance-index/src/scalar/inverted/builder.rs:211-211 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_fragment_mask(params: InvertedIndexParams, fragment_mask: Option&lt;u64&gt;) -&gt; Self` | rust/lance-index/src/scalar/inverted/builder.rs:215-215 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn from_existing_index( params: InvertedIndexParams, store: Option&lt;Arc&lt;dyn IndexStore&gt;&gt;, partitions: Vec&lt;u64&gt;, token_set_format: TokenSetFormat, fragment_mask: Option&lt;u64&gt;, deleted_fragments: RoaringBitmap, ) -&gt; Self` | rust/lance-index/src/scalar/inverted/builder.rs:232-239 | Creates an InvertedIndexBuilder from existing index with fragment filtering. This method is used to create a builder from an existing index while applying fragment-based filtering for distributed indexing scenarios. fragment_mask Optional mask with fragment_id in high 32 bits for filtering. Constructed as `(fragment_id as u64) &lt;&lt; 32`. When provided, ensures that generated IDs belong to the specified fragment. |
| `pub fn with_posting_tail_codec(mut self, posting_tail_codec: PostingTailCodec) -&gt; Self` | rust/lance-index/src/scalar/inverted/builder.rs:255-255 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_format_version(mut self, format_version: InvertedListFormatVersion) -&gt; Self` | rust/lance-index/src/scalar/inverted/builder.rs:265-265 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_token_set_format(mut self, token_set_format: TokenSetFormat) -&gt; Self` | rust/lance-index/src/scalar/inverted/builder.rs:271-271 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_progress(mut self, progress: Arc&lt;dyn IndexBuildProgress&gt;) -&gt; Self` | rust/lance-index/src/scalar/inverted/builder.rs:276-276 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn update( &mut self, new_data: SendableRecordBatchStream, dest_store: &dyn IndexStore, old_data_filter: Option&lt;crate::scalar::OldIndexDataFilter&gt;, ) -&gt; Result&lt;Vec&lt;IndexFile&gt;&gt;` | rust/lance-index/src/scalar/inverted/builder.rs:281-286 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn update_from_segments( &mut self, new_data: SendableRecordBatchStream, dest_store: &dyn IndexStore, old_segments: &[Arc&lt;InvertedIndex&gt;], old_data_filter: Option&lt;crate::scalar::OldIndexDataFilter&gt;, ) -&gt; Result&lt;Vec&lt;IndexFile&gt;&gt;` | rust/lance-index/src/scalar/inverted/builder.rs:315-321 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn remap( &mut self, mapping: &RowAddrRemap, src_store: Arc&lt;dyn IndexStore&gt;, dest_store: &dyn IndexStore, ) -&gt; Result&lt;Vec&lt;IndexFile&gt;&gt;` | rust/lance-index/src/scalar/inverted/builder.rs:593-619 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct InnerBuilder` | rust/lance-index/src/scalar/inverted/builder.rs:894-894 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(id: u64, with_position: bool, token_set_format: TokenSetFormat) -&gt; Self` | rust/lance-index/src/scalar/inverted/builder.rs:907-907 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_format_version( id: u64, with_position: bool, token_set_format: TokenSetFormat, format_version: InvertedListFormatVersion, ) -&gt; Self` | rust/lance-index/src/scalar/inverted/builder.rs:916-921 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_block_size( id: u64, with_position: bool, token_set_format: TokenSetFormat, block_size: usize, ) -&gt; Self` | rust/lance-index/src/scalar/inverted/builder.rs:931-936 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_format_version_and_block_size( id: u64, with_position: bool, token_set_format: TokenSetFormat, format_version: InvertedListFormatVersion, block_size: usize, ) -&gt; Self` | rust/lance-index/src/scalar/inverted/builder.rs:948-954 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_posting_tail_codec( id: u64, with_position: bool, token_set_format: TokenSetFormat, posting_tail_codec: PostingTailCodec, ) -&gt; Self` | rust/lance-index/src/scalar/inverted/builder.rs:970-975 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_posting_tail_codec_and_block_size( id: u64, with_position: bool, token_set_format: TokenSetFormat, posting_tail_codec: PostingTailCodec, block_size: usize, ) -&gt; Self` | rust/lance-index/src/scalar/inverted/builder.rs:985-991 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn id(&self) -&gt; u64` | rust/lance-index/src/scalar/inverted/builder.rs:1008-1008 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/builder.rs:1016-1016 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn set_tokens(&mut self, tokens: TokenSet)` | rust/lance-index/src/scalar/inverted/builder.rs:1026-1026 | Set the token set for this builder. |
| `pub fn set_docs(&mut self, docs: DocSet)` | rust/lance-index/src/scalar/inverted/builder.rs:1032-1032 | Set the document set for this builder. |
| `pub fn set_posting_lists(&mut self, posting_lists: Vec&lt;PostingListBuilder&gt;)` | rust/lance-index/src/scalar/inverted/builder.rs:1037-1037 | Set the posting lists for this builder. |
| `pub async fn remap(&mut self, mapping: &RowAddrRemap) -&gt; Result&lt;()&gt;` | rust/lance-index/src/scalar/inverted/builder.rs:1042-1042 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn merge_from(&mut self, other: Self) -&gt; Result&lt;()&gt;` | rust/lance-index/src/scalar/inverted/builder.rs:1095-1095 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn write(&mut self, store: &dyn IndexStore) -&gt; Result&lt;Vec&lt;IndexFile&gt;&gt;` | rust/lance-index/src/scalar/inverted/builder.rs:1196-1196 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum PositionRecorder` | rust/lance-index/src/scalar/inverted/builder.rs:1938-1938 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn len(&self) -&gt; u32` | rust/lance-index/src/scalar/inverted/builder.rs:1944-1944 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/builder.rs:1951-1951 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn into_vec(self) -&gt; Vec&lt;u32&gt;` | rust/lance-index/src/scalar/inverted/builder.rs:1955-1955 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ScoredDoc` | rust/lance-index/src/scalar/inverted/builder.rs:1964-1964 | No standalone documentation summary; use the family contract and source entry. |
| `pub row_id: u64,` | rust/lance-index/src/scalar/inverted/builder.rs:1965-1965 | No standalone documentation summary; use the family contract and source entry. |
| `pub doc_index: Vec&lt;u32&gt;,` | rust/lance-index/src/scalar/inverted/builder.rs:1966-1966 | No standalone documentation summary; use the family contract and source entry. |
| `pub score: OrderedFloat,` | rust/lance-index/src/scalar/inverted/builder.rs:1967-1967 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(row_id: u64, score: f32) -&gt; Self` | rust/lance-index/src/scalar/inverted/builder.rs:1971-1971 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_doc_index(row_id: u64, doc_index: Vec&lt;u32&gt;, score: f32) -&gt; Self` | rust/lance-index/src/scalar/inverted/builder.rs:1979-1979 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn legacy_inverted_list_schema(with_position: bool) -&gt; SchemaRef` | rust/lance-index/src/scalar/inverted/builder.rs:2000-2000 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn inverted_list_schema(with_position: bool) -&gt; SchemaRef` | rust/lance-index/src/scalar/inverted/builder.rs:2019-2019 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn inverted_list_schema_for_version( with_position: bool, format_version: InvertedListFormatVersion, ) -&gt; SchemaRef` | rust/lance-index/src/scalar/inverted/builder.rs:2023-2026 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn inverted_list_schema_for_version_with_block_size( with_position: bool, format_version: InvertedListFormatVersion, block_size: usize, ) -&gt; SchemaRef` | rust/lance-index/src/scalar/inverted/builder.rs:2034-2038 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn inverted_list_schema_with_tail_codec( with_position: bool, posting_tail_codec: PostingTailCodec, ) -&gt; SchemaRef` | rust/lance-index/src/scalar/inverted/builder.rs:2128-2131 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn merge_index_files( object_store: &ObjectStore, index_dir: &Path, store: Arc&lt;dyn IndexStore&gt;, progress: Arc&lt;dyn IndexBuildProgress&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance-index/src/scalar/inverted/builder.rs:2254-2259 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn document_input( input: SendableRecordBatchStream, column: &str, ) -&gt; Result&lt;SendableRecordBatchStream&gt;` | rust/lance-index/src/scalar/inverted/builder.rs:2480-2483 | Convert input stream into a stream of documents. |

<a id="source-rust-lance-index-src-scalar-inverted-combined-rs"></a>

## `rust/lance-index/src/scalar/inverted/combined.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use flat::flat_combined_fields_search_stream;` | rust/lance-index/src/scalar/inverted/combined.rs:37-37 | No standalone documentation summary; use the family contract and source entry. |
| `pub use search::combined_fields_search;` | rust/lance-index/src/scalar/inverted/combined.rs:38-38 | No standalone documentation summary; use the family contract and source entry. |
| `pub use stats::` | rust/lance-index/src/scalar/inverted/combined.rs:39-39 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct CombinedFieldColumn` | rust/lance-index/src/scalar/inverted/combined.rs:46-46 | One target column of a `combined_fields` query: its per-column weight and the opened FTS segments (one per committed segment; usually a single one). |
| `pub column: String,` | rust/lance-index/src/scalar/inverted/combined.rs:48-48 | Column name, used only for error messages. |
| `pub weight: f32,` | rust/lance-index/src/scalar/inverted/combined.rs:50-50 | Per-column BM25F weight `w_f` (`&gt;= 1`, validated at query construction). |
| `pub indices: Vec&lt;Arc&lt;InvertedIndex&gt;&gt;,` | rust/lance-index/src/scalar/inverted/combined.rs:52-52 | Opened inverted-index segments for this column. |
| `pub stale_rows: Option&lt;Arc&lt;RowAddrTreeMap&gt;&gt;,` | rust/lance-index/src/scalar/inverted/combined.rs:58-58 | Rows an overlay made stale, in the row-id domain index results use. |
| `pub fn validate_combined_tokenizers(columns: &[CombinedFieldColumn]) -&gt; Result&lt;()&gt;` | rust/lance-index/src/scalar/inverted/combined.rs:79-79 | Reject a `combined_fields` query whose target columns do not share an identical index/tokenizer configuration. BM25F is only well-defined when the fields tokenize the same way, so mixing configurations is an error rather than a silently wrong score. The error lists the offending columns. |

<a id="source-rust-lance-index-src-scalar-inverted-combined-flat-rs"></a>

## `rust/lance-index/src/scalar/inverted/combined/flat.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub async fn flat_combined_fields_search_stream( input: SendableRecordBatchStream, columns: &[CombinedFieldColumn], doc_col_indices: Vec&lt;usize&gt;, stats_masks: &[Arc&lt;RowAddrMask&gt;], emit_mask: Option&lt;Arc&lt;RowAddrMask&gt;&gt;, flat_covers_whole_corpus: bool, tokens: &Tokens, tokenizer: Box&lt;dyn LanceTokenizer&gt;, operator: Operator, target_batch_size: usize, elapsed_compute: Option&lt;Time&gt;, metrics: Option&lt;&dyn MetricsCollector&gt;, ) -&gt; DataFusionResult&lt;(SendableRecordBatchStream, Arc&lt;CombinedFieldsBM25Scorer&gt;)&gt;` | rust/lance-index/src/scalar/inverted/combined/flat.rs:44-57 | Exact cross-field BM25F search over rows that no index fully covers, scored straight from their column values. Together with the indexed `combined_fields_search` this covers the whole dataset, with the same term deduplication and `operator` semantics. |

<a id="source-rust-lance-index-src-scalar-inverted-combined-search-rs"></a>

## `rust/lance-index/src/scalar/inverted/combined/search.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub async fn combined_fields_search( columns: &[CombinedFieldColumn], tokens: &Tokens, params: &FtsSearchParams, operator: Operator, scorer: &CombinedFieldsBM25Scorer, prefilter: Arc&lt;dyn PreFilter&gt;, metrics: &dyn MetricsCollector, ) -&gt; Result&lt;(Vec&lt;u64&gt;, Vec&lt;f32&gt;)&gt;` | rust/lance-index/src/scalar/inverted/combined/search.rs:64-72 | Exact cross-field BM25F search over the target columns. |

<a id="source-rust-lance-index-src-scalar-inverted-combined-stats-rs"></a>

## `rust/lance-index/src/scalar/inverted/combined/stats.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct FlatFieldStats` | rust/lance-index/src/scalar/inverted/combined/stats.rs:33-33 | Per-column corpus contributions of the rows a `combined_fields` flat scan covers, i.e. rows in fragments that at least one target column's index is missing. |
| `pub doc_counts: Vec&lt;usize&gt;,` | rust/lance-index/src/scalar/inverted/combined/stats.rs:35-35 | Per column: flat docs with at least one token in that column. |
| `pub total_tokens: Vec&lt;u64&gt;,` | rust/lance-index/src/scalar/inverted/combined/stats.rs:37-37 | Per column: total tokens over all flat docs. |
| `pub doc_freqs: Vec&lt;Vec&lt;usize&gt;&gt;,` | rust/lance-index/src/scalar/inverted/combined/stats.rs:39-39 | `[column][term]`: flat docs containing that term in that column. |
| `pub enum CombinedCorpusStats&lt;'a&gt;` | rust/lance-index/src/scalar/inverted/combined/stats.rs:106-106 | Which statistics [`build_combined_bm25_scorer`] folds into the BM25F blend. |
| `pub fn for_flat_scan(flat: &'a FlatFieldStats, covers_whole_corpus: bool) -&gt; Self` | rust/lance-index/src/scalar/inverted/combined/stats.rs:124-124 | The variant for a flat scan's statistics, by whether the scan read every target fragment or only the rows no index covers. |
| `pub async fn build_combined_bm25_scorer( columns: &[CombinedFieldColumn], tokens: &Tokens, corpus: CombinedCorpusStats&lt;'_&gt;, metrics: Option&lt;&dyn MetricsCollector&gt;, ) -&gt; Result&lt;CombinedFieldsBM25Scorer&gt;` | rust/lance-index/src/scalar/inverted/combined/stats.rs:163-168 | Fold the target columns' segment statistics into a single [`CombinedFieldsBM25Scorer`]. |

<a id="source-rust-lance-index-src-scalar-inverted-compound-rs"></a>

## `rust/lance-index/src/scalar/inverted/compound.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub row_id: K,` | rust/lance-index/src/scalar/inverted/compound.rs:48-48 | No standalone documentation summary; use the family contract and source entry. |
| `pub score: f32,` | rust/lance-index/src/scalar/inverted/compound.rs:49-49 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn exclusive_scaled_score_floor(scaled_score_floor: f32, factor: f32) -&gt; Option&lt;f32&gt;` | rust/lance-index/src/scalar/inverted/compound.rs:218-218 | Find the greatest finite non-negative raw score whose actual `f32` multiplication remains strictly below an inclusive scaled score floor. |
| `pub fn materialized_compound_top_k( query: &FtsQuery, leaves: Vec&lt;Vec&lt;(u64, f32)&gt;&gt;, limit: usize, ) -&gt; Result&lt;(Vec&lt;u64&gt;, Vec&lt;f32&gt;)&gt;` | rust/lance-index/src/scalar/inverted/compound.rs:2173-2177 | Evaluate a compound query over exact, materialized leaf result sets. |
| `pub async fn compound_search( indices: &[Arc&lt;InvertedIndex&gt;], query: &FtsQuery, params: &FtsSearchParams, prefilter: Arc&lt;dyn PreFilter&gt;, metrics: Arc&lt;dyn MetricsCollector&gt;, ) -&gt; Result&lt;(Vec&lt;u64&gt;, Vec&lt;f32&gt;)&gt;` | rust/lance-index/src/scalar/inverted/compound.rs:4232-4238 | Search one-column compound FTS directly over posting-backed scorers. |
| `pub async fn compound_search_with_base_scorer( indices: &[Arc&lt;InvertedIndex&gt;], query: &FtsQuery, params: &FtsSearchParams, prefilter: Arc&lt;dyn PreFilter&gt;, metrics: Arc&lt;dyn MetricsCollector&gt;, base_scorer: Arc&lt;MemBM25Scorer&gt;, ) -&gt; Result&lt;(Vec&lt;u64&gt;, Vec&lt;f32&gt;)&gt;` | rust/lance-index/src/scalar/inverted/compound.rs:4247-4254 | Search one-column compound FTS with caller-supplied corpus-wide BM25 statistics. |
| `pub async fn compound_search_with_base_scorer_and_score_floor( indices: &[Arc&lt;InvertedIndex&gt;], query: &FtsQuery, params: &FtsSearchParams, prefilter: Arc&lt;dyn PreFilter&gt;, metrics: Arc&lt;dyn MetricsCollector&gt;, base_scorer: Arc&lt;MemBM25Scorer&gt;, score_floor: f32, ) -&gt; Result&lt;(Vec&lt;u64&gt;, Vec&lt;f32&gt;)&gt;` | rust/lance-index/src/scalar/inverted/compound.rs:4273-4281 | Search one-column compound FTS with corpus-wide BM25 statistics and an inclusive initial score floor. |
| `pub async fn compound_search_prepared_match( indices: &[Arc&lt;InvertedIndex&gt;], query: &FtsQuery, params: &FtsSearchParams, prefilter: Arc&lt;dyn PreFilter&gt;, metrics: Arc&lt;dyn MetricsCollector&gt;, prepared_match: Arc&lt;PreparedBm25Query&gt;, ) -&gt; Result&lt;(Vec&lt;u64&gt;, Vec&lt;f32&gt;)&gt;` | rust/lance-index/src/scalar/inverted/compound.rs:4298-4305 | Replay one root Match query with the exact vocabulary/scorer pair used by an earlier bounded WAND probe. |
| `pub async fn compound_search_prepared_match_with_score_floor( indices: &[Arc&lt;InvertedIndex&gt;], query: &FtsQuery, params: &FtsSearchParams, prefilter: Arc&lt;dyn PreFilter&gt;, metrics: Arc&lt;dyn MetricsCollector&gt;, prepared_match: Arc&lt;PreparedBm25Query&gt;, score_floor: f32, ) -&gt; Result&lt;(Vec&lt;u64&gt;, Vec&lt;f32&gt;)&gt;` | rust/lance-index/src/scalar/inverted/compound.rs:4327-4335 | Replay one root Match query with a prepared vocabulary/scorer pair and an inclusive initial score floor. |

<a id="source-rust-lance-index-src-scalar-inverted-cross-column-rs"></a>

## `rust/lance-index/src/scalar/inverted/cross_column.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub async fn cross_column_compound_search( columns: &[(String, Vec&lt;Arc&lt;InvertedIndex&gt;&gt;)], query: &FtsQuery, params: &FtsSearchParams, prefilter: Arc&lt;dyn PreFilter&gt;, metrics: Arc&lt;dyn MetricsCollector&gt;, ) -&gt; Result&lt;(Vec&lt;u64&gt;, Vec&lt;f32&gt;)&gt;` | rust/lance-index/src/scalar/inverted/cross_column.rs:1344-1350 | Internal cross-crate hook for a bounded compound FTS query over multiple indexed columns. |

<a id="source-rust-lance-index-src-scalar-inverted-encoding-rs"></a>

## `rust/lance-index/src/scalar/inverted/encoding.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const MAX_POSTING_BLOCK_SIZE: usize = BitPacker8x::BLOCK_LEN;` | rust/lance-index/src/scalar/inverted/encoding.rs:15-15 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn posting_block_score_prefix_len(block_size: usize) -&gt; usize` | rust/lance-index/src/scalar/inverted/encoding.rs:135-135 | Byte length of the block-max-score prefix on posting blocks. 128-doc blocks store a per-block max score, patched in at build time; 256-document blocks always carry impact skip data, which supersedes it, so they store none. |
| `pub fn encode_full_posting_block_into( doc_ids: &[u32], frequencies: &[u32], block: &mut Vec&lt;u8&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance-index/src/scalar/inverted/encoding.rs:143-147 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn encode_remainder_posting_block_into( doc_ids: &[u32], frequencies: &[u32], codec: PostingTailCodec, block_size: usize, block: &mut Vec&lt;u8&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance-index/src/scalar/inverted/encoding.rs:272-278 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn compress_positions(positions: &[u32]) -&gt; Result&lt;arrow::array::LargeBinaryArray&gt;` | rust/lance-index/src/scalar/inverted/encoding.rs:388-388 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn encode_varint_u32(dst: &mut Vec&lt;u8&gt;, mut value: u32)` | rust/lance-index/src/scalar/inverted/encoding.rs:417-417 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn decode_varint_u32(src: &[u8], offset: &mut usize) -&gt; Result&lt;u32&gt;` | rust/lance-index/src/scalar/inverted/encoding.rs:527-527 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn decode_position_stream_block( src: &[u8], frequencies: &[u32], codec: PositionStreamCodec, dst: &mut Vec&lt;u32&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance-index/src/scalar/inverted/encoding.rs:911-916 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn decompress_positions(compressed: &arrow::array::LargeBinaryArray) -&gt; Vec&lt;u32&gt;` | rust/lance-index/src/scalar/inverted/encoding.rs:991-991 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn read_num_positions(compressed: &arrow::array::LargeBinaryArray) -&gt; u32` | rust/lance-index/src/scalar/inverted/encoding.rs:1011-1011 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn decompress_posting_block( block: &[u8], buffer: &mut [u32], doc_ids: &mut Vec&lt;u32&gt;, frequencies: &mut Vec&lt;u32&gt;, block_size: usize, )` | rust/lance-index/src/scalar/inverted/encoding.rs:1015-1021 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn decompress_posting_remainder( block: &[u8], n: usize, codec: PostingTailCodec, block_size: usize, doc_ids: &mut Vec&lt;u32&gt;, frequencies: &mut Vec&lt;u32&gt;, )` | rust/lance-index/src/scalar/inverted/encoding.rs:1078-1085 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn decode_full_posting_block( block: &[u8], doc_ids: &mut Vec&lt;u32&gt;, frequencies: &mut Vec&lt;u32&gt;, block_size: usize, )` | rust/lance-index/src/scalar/inverted/encoding.rs:1160-1165 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn decompress_sorted_block( block: &[u8], buffer: &mut [u32; BLOCK_SIZE],` | rust/lance-index/src/scalar/inverted/encoding.rs:1170-1172 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn decompress_raw_remainder(compressed: &[u8], n: usize, dest: &mut Vec&lt;u32&gt;)` | rust/lance-index/src/scalar/inverted/encoding.rs:1207-1207 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn read_posting_tail_first_doc( block: &[u8], codec: PostingTailCodec, block_size: usize, ) -&gt; u32` | rust/lance-index/src/scalar/inverted/encoding.rs:1214-1218 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-impact-rs"></a>

## `rust/lance-index/src/scalar/inverted/impact.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const IMPACT_LEVEL1_BLOCKS: usize = 32;` | rust/lance-index/src/scalar/inverted/impact.rs:13-13 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ImpactSkipData(Arc&lt;ImpactSkipDataInner&gt;);` | rust/lance-index/src/scalar/inverted/impact.rs:28-28 | On-disk encoding of one impact entry, shared by every posting block size. |
| `pub struct ImpactScoreCache` | rust/lance-index/src/scalar/inverted/impact.rs:73-73 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(entries: LargeBinaryArray, level0_len: usize) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/inverted/impact.rs:112-112 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn global_max_doc_weight_cached&lt;S: Scorer + ?Sized&gt;( &self, scorer: &S, cache: &mut ImpactScoreCache, ) -&gt; f32` | rust/lance-index/src/scalar/inverted/impact.rs:214-218 | List-wide max doc weight, from the scorer-specific cached bounds. The tightest valid global score bound is `query_weight * this`, matching what the non-impact format stores as `max_score` at build time. |
| `pub fn entries(&self) -&gt; &LargeBinaryArray` | rust/lance-index/src/scalar/inverted/impact.rs:232-232 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn level0_score_cached&lt;S: Scorer + ?Sized&gt;( &self, block_idx: usize, query_weight: f32, scorer: &S, cache: &mut ImpactScoreCache, ) -&gt; f32` | rust/lance-index/src/scalar/inverted/impact.rs:291-297 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ImpactSkipDataBuilder` | rust/lance-index/src/scalar/inverted/impact.rs:385-385 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_capacity(level0_blocks: usize, block_size: usize) -&gt; Self` | rust/lance-index/src/scalar/inverted/impact.rs:393-393 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn append_block(&mut self, docs: &[(u32, u32, u32)]) -&gt; Result&lt;()&gt;` | rust/lance-index/src/scalar/inverted/impact.rs:405-405 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn finish(mut self) -&gt; Result&lt;ImpactSkipData&gt;` | rust/lance-index/src/scalar/inverted/impact.rs:416-416 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-index-rs"></a>

## `rust/lance-index/src/scalar/inverted/index.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use cache::*;` | rust/lance-index/src/scalar/inverted/index.rs:118-118 | No standalone documentation summary; use the family contract and source entry. |
| `pub use doc_set::*;` | rust/lance-index/src/scalar/inverted/index.rs:119-119 | No standalone documentation summary; use the family contract and source entry. |
| `pub use flat_search::*;` | rust/lance-index/src/scalar/inverted/index.rs:120-120 | No standalone documentation summary; use the family contract and source entry. |
| `pub use format::*;` | rust/lance-index/src/scalar/inverted/index.rs:121-121 | No standalone documentation summary; use the family contract and source entry. |
| `pub use inverted_index::*;` | rust/lance-index/src/scalar/inverted/index.rs:122-122 | No standalone documentation summary; use the family contract and source entry. |
| `pub use partition::*;` | rust/lance-index/src/scalar/inverted/index.rs:123-123 | No standalone documentation summary; use the family contract and source entry. |
| `pub use posting_builder::*;` | rust/lance-index/src/scalar/inverted/index.rs:125-125 | No standalone documentation summary; use the family contract and source entry. |
| `pub use posting_list::*;` | rust/lance-index/src/scalar/inverted/index.rs:126-126 | No standalone documentation summary; use the family contract and source entry. |
| `pub use posting_reader::*;` | rust/lance-index/src/scalar/inverted/index.rs:127-127 | No standalone documentation summary; use the family contract and source entry. |
| `pub use token_set::*;` | rust/lance-index/src/scalar/inverted/index.rs:130-130 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-index-cache-rs"></a>

## `rust/lance-index/src/scalar/inverted/index/cache.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct Positions(pub(in super::super) CompressedPositionStorage);` | rust/lance-index/src/scalar/inverted/index/cache.rs:9-9 | New type just to allow Positions implement DeepSizeOf so it can be put in the cache. |
| `pub struct PostingListKey` | rust/lance-index/src/scalar/inverted/index/cache.rs:62-62 | No standalone documentation summary; use the family contract and source entry. |
| `pub token_id: u32,` | rust/lance-index/src/scalar/inverted/index/cache.rs:63-63 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct PostingListGroupKey` | rust/lance-index/src/scalar/inverted/index/cache.rs:95-95 | Cache key for a group of consecutive posting lists stored as a single entry, covering rows `[start, end)` (issue #7040). The range, not a token id, is the key so a runtime group-size change simply misses old entries instead of serving a differently-shaped group. |
| `pub start: u32,` | rust/lance-index/src/scalar/inverted/index/cache.rs:96-96 | No standalone documentation summary; use the family contract and source entry. |
| `pub end: u32,` | rust/lance-index/src/scalar/inverted/index/cache.rs:97-97 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct PositionKey` | rust/lance-index/src/scalar/inverted/index/cache.rs:223-223 | No standalone documentation summary; use the family contract and source entry. |
| `pub token_id: u32,` | rust/lance-index/src/scalar/inverted/index/cache.rs:224-224 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum CompressedPositionStorage` | rust/lance-index/src/scalar/inverted/index/cache.rs:252-252 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct SharedPositionStream` | rust/lance-index/src/scalar/inverted/index/cache.rs:267-267 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(codec: PositionStreamCodec, block_offsets: Vec&lt;u32&gt;, bytes: bytes::Bytes) -&gt; Self` | rust/lance-index/src/scalar/inverted/index/cache.rs:276-276 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn codec(&self) -&gt; PositionStreamCodec` | rust/lance-index/src/scalar/inverted/index/cache.rs:284-284 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn block_count(&self) -&gt; usize` | rust/lance-index/src/scalar/inverted/index/cache.rs:288-288 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn block_range(&self, index: usize) -&gt; Range&lt;usize&gt;` | rust/lance-index/src/scalar/inverted/index/cache.rs:292-292 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn block(&self, index: usize) -&gt; &[u8]` | rust/lance-index/src/scalar/inverted/index/cache.rs:302-302 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn bytes(&self) -&gt; &[u8]` | rust/lance-index/src/scalar/inverted/index/cache.rs:307-307 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn block_offsets(&self) -&gt; &[u32]` | rust/lance-index/src/scalar/inverted/index/cache.rs:311-311 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn size(&self) -&gt; usize` | rust/lance-index/src/scalar/inverted/index/cache.rs:315-315 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct PostingListGroup` | rust/lance-index/src/scalar/inverted/index/cache.rs:328-328 | A group of consecutive posting lists held in a single cache entry, in row order (issue #7040). Prewarmed modern groups without positions retain only the compact Arrow posting rows read from `invert.lance`; max-score/length metadata stays in the reader and is injected when a query creates a posting-list view. Cold-loaded groups may keep inline metadata to preserve one-read query loading. Legacy and position-bearing prewarm paths use the materialized fallback. |

<a id="source-rust-lance-index-src-scalar-inverted-index-doc-set-rs"></a>

## `rust/lance-index/src/scalar/inverted/index/doc_set.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub enum DocInfo` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:7-7 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn doc_id(&self) -&gt; u64` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:13-13 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn frequency(&self) -&gt; u32` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:20-20 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct LocatedDocInfo` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:49-49 | No standalone documentation summary; use the family contract and source entry. |
| `pub row_id: u64,` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:50-50 | No standalone documentation summary; use the family contract and source entry. |
| `pub frequency: f32,` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:51-51 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(row_id: u64, frequency: f32) -&gt; Self` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:55-55 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct RawDocInfo` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:81-81 | No standalone documentation summary; use the family contract and source entry. |
| `pub doc_id: u32,` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:82-82 | No standalone documentation summary; use the family contract and source entry. |
| `pub frequency: u32,` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:83-83 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(doc_id: u32, frequency: u32) -&gt; Self` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:87-87 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct DocSet` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:223-223 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn len(&self) -&gt; usize` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:283-283 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:291-291 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn has_row_ids(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:301-301 | True iff the per-doc `row_id` array is populated. The deferred-row_id scoring path constructs DocSets with the array left empty so wand can skip the load; callers that need to do row_id lookups in the inner loop must check this and fall back to async resolution otherwise. |
| `pub fn iter(&self) -&gt; impl Iterator&lt;Item = (&u64, &u32)&gt;` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:305-305 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn row_id(&self, doc_id: u32) -&gt; u64` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:309-309 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn doc_index(&self, doc_id: u32) -&gt; Vec&lt;u32&gt;` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:313-313 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn coordinate(&self, doc_id: u32, rank: usize) -&gt; u32` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:320-320 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn coordinate_rank(&self) -&gt; usize` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:324-324 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn row_ids_strictly_ascending(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:347-347 | True iff `row_id(doc_id)` is strictly increasing in `doc_id`, i.e. the per-doc `row_ids` array is sorted with no duplicates. This is the exact condition the combined_fields read-pruning fast path requires: doc-id order equals row-id order (so a posting block's row-id span is an interval, letting a row-id seek skip whole blocks) and every row owns a single doc (no list-element or legacy list multiplicity, so a term contributes at most one posting per partition per row). |
| `pub fn num_distinct_rows(&self) -&gt; usize` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:365-365 | Number of distinct row ids this set covers, which row-granularity BM25F statistics need. |
| `pub fn doc_ids(&self, row_id: u64) -&gt; impl Iterator&lt;Item = u64&gt; + '_` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:388-388 | Resolve a `row_id` to every `doc_id` it owns. |
| `pub fn total_tokens_num(&self) -&gt; u64` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:401-401 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn average_length(&self) -&gt; f32` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:406-406 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn calculate_block_max_scores&lt;'a&gt;( &self, doc_ids: impl Iterator&lt;Item = &'a u32&gt;, freqs: impl Iterator&lt;Item = &'a u32&gt;, ) -&gt; Vec&lt;f32&gt;` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:410-414 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn calculate_block_max_scores_with_block_size&lt;'a&gt;( &self, doc_ids: impl Iterator&lt;Item = &'a u32&gt;, freqs: impl Iterator&lt;Item = &'a u32&gt;, block_size: usize, ) -&gt; Vec&lt;f32&gt;` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:418-423 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn to_batch(&self) -&gt; Result&lt;RecordBatch&gt;` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:451-451 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn load( reader: Arc&lt;dyn IndexReader&gt;, is_legacy: bool, frag_reuse_index: Option&lt;Arc&lt;dyn RowIdRemapper&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:479-483 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn from_num_tokens_only(num_tokens_col: &arrow_array::UInt32Array) -&gt; Self` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:547-547 | Build a `DocSet` carrying only the per-doc `num_tokens` array; `row_ids` and `inv` are left empty. Used by the deferred-row_id scoring path: wand checks `has_row_ids()` to skip `row_id` / `num_tokens_by_row_id` calls, and the per-partition caller resolves doc_id → row_id for the surviving top-K post-wand. |
| `pub fn from_columns( row_id_col: &UInt64Array, num_tokens_col: &arrow_array::UInt32Array, is_legacy: bool, frag_reuse_index: Option&lt;Arc&lt;dyn RowIdRemapper&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:573-578 | Build a `DocSet` from already-loaded `row_id` and `num_tokens` Arrow columns without re-reading either column. |
| `pub fn from_columns_with_doc_indices( row_id_col: &UInt64Array, num_tokens_col: &arrow_array::UInt32Array, doc_index_cols: &[&arrow_array::UInt32Array], is_legacy: bool, frag_reuse_index: Option&lt;Arc&lt;dyn RowIdRemapper&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:588-594 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn remap(&mut self, mapping: &RowAddrRemap) -&gt; Vec&lt;u32&gt;` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:711-711 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn num_tokens(&self, doc_id: u32) -&gt; u32` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:756-756 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn set_quantized_scoring(&mut self, quantized: bool)` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:761-761 | Enable quantized document-length scoring for 256-document-block partitions. |
| `pub fn scoring_norms(&self) -&gt; Option&lt;&[u8]&gt;` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:767-767 | The quantized document-length slab when this set scores quantized, baked on first use; `None` for exact-scoring sets. |
| `pub fn scoring_num_tokens(&self, doc_id: u32) -&gt; u32` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:786-786 | Document length as scoring sees it: the quantized bucket floor for 256-document-block partitions, the exact value otherwise. |
| `pub fn num_tokens_by_row_id(&self, row_id: u64) -&gt; u32` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:796-796 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn doc_length_by_row_id(&self, row_id: u64) -&gt; u64` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:819-819 | Total document length of `row_id`: the sum of `num_tokens` over every document the row owns, or `0` when the row is absent (e.g. an empty or null field that was never indexed). |
| `pub fn append(&mut self, row_id: u64, num_tokens: u32) -&gt; u32` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:840-840 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn append_with_doc_index( &mut self, row_id: u64, num_tokens: u32, doc_index: &[u32], ) -&gt; Result&lt;u32&gt;` | rust/lance-index/src/scalar/inverted/index/doc_set.rs:849-854 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-index-flat-search-rs"></a>

## `rust/lance-index/src/scalar/inverted/index/flat_search.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn doc_index_storage_column(rank: usize) -&gt; String` | rust/lance-index/src/scalar/inverted/index/flat_search.rs:6-6 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn document_coordinate_rank(schema: &arrow_schema::Schema) -&gt; usize` | rust/lance-index/src/scalar/inverted/index/flat_search.rs:10-10 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn flat_full_text_search( batches: &[&RecordBatch], doc_col: &str, query: &str, tokenizer: Option&lt;Box&lt;dyn LanceTokenizer&gt;&gt;, ) -&gt; Result&lt;Vec&lt;u64&gt;&gt;` | rust/lance-index/src/scalar/inverted/index/flat_search.rs:20-25 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn flat_bm25_search_stream( input: SendableRecordBatchStream, doc_col: String, query: String, tokenizer: Box&lt;dyn LanceTokenizer&gt;, base_scorer: Option&lt;MemBM25Scorer&gt;, target_batch_size: usize, ) -&gt; DataFusionResult&lt;SendableRecordBatchStream&gt;` | rust/lance-index/src/scalar/inverted/index/flat_search.rs:951-958 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn flat_bm25_search_stream_with_metrics( input: SendableRecordBatchStream, doc_col: String, query: String, tokenizer: Box&lt;dyn LanceTokenizer&gt;, base_scorer: Option&lt;MemBM25Scorer&gt;, target_batch_size: usize, elapsed_compute: Option&lt;Time&gt;, ) -&gt; DataFusionResult&lt;SendableRecordBatchStream&gt;` | rust/lance-index/src/scalar/inverted/index/flat_search.rs:976-984 | Same as [`flat_bm25_search_stream`] but accepts an optional `Time` handle that, if provided, will receive the CPU time spent in (a) per-batch tokenization on the `spawn_cpu` worker threads and (b) the synchronous scoring phase. This lets a calling `ExecutionPlan` report accurate `elapsed_compute` without double-counting upstream poll time. |
| `pub async fn flat_bm25_search_stream_with_metrics_and_operator( input: SendableRecordBatchStream, doc_col: String, query: String, tokenizer: Box&lt;dyn LanceTokenizer&gt;, base_scorer: Option&lt;MemBM25Scorer&gt;, target_batch_size: usize, operator: Operator, elapsed_compute: Option&lt;Time&gt;, ) -&gt; DataFusionResult&lt;SendableRecordBatchStream&gt;` | rust/lance-index/src/scalar/inverted/index/flat_search.rs:1027-1036 | Same as [`flat_bm25_search_stream_with_metrics`] but applies the provided match operator when deciding whether a flat-scanned row is a hit. |
| `pub struct FlatBm25SearchOptions` | rust/lance-index/src/scalar/inverted/index/flat_search.rs:1057-1057 | Options for flat BM25 search execution. |
| `pub target_batch_size: usize,` | rust/lance-index/src/scalar/inverted/index/flat_search.rs:1059-1059 | Maximum output record batch size. |
| `pub elapsed_compute: Option&lt;Time&gt;,` | rust/lance-index/src/scalar/inverted/index/flat_search.rs:1061-1061 | Optional DataFusion metric tracking compute time. |
| `pub document_granularity: DocumentGranularity,` | rust/lance-index/src/scalar/inverted/index/flat_search.rs:1063-1063 | Logical FTS document boundary. |
| `pub operator: Operator,` | rust/lance-index/src/scalar/inverted/index/flat_search.rs:1065-1065 | Match operator applied within each logical document. |
| `pub boost: f32,` | rust/lance-index/src/scalar/inverted/index/flat_search.rs:1067-1067 | Score multiplier for the match query. |
| `pub phrase_slop: Option&lt;u32&gt;,` | rust/lance-index/src/scalar/inverted/index/flat_search.rs:1069-1069 | Phrase slop. When set, documents must contain the query tokens in order. |
| `pub async fn flat_bm25_search_stream_with_options_and_scorer( input: SendableRecordBatchStream, doc_col: String, query: String, tokenizer: Box&lt;dyn LanceTokenizer&gt;, base_scorer: Option&lt;MemBM25Scorer&gt;, options: FlatBm25SearchOptions, ) -&gt; DataFusionResult&lt;(SendableRecordBatchStream, MemBM25Scorer)&gt;` | rust/lance-index/src/scalar/inverted/index/flat_search.rs:1074-1081 | Run a flat BM25 search and return the scorer initialized from both the optional indexed corpus and the flat input corpus. |
| `pub fn is_phrase_query(query: &str) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/flat_search.rs:1198-1198 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-index-format-rs"></a>

## `rust/lance-index/src/scalar/inverted/index/format.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const INVERTED_INDEX_VERSION_V1: u32 = 1;` | rust/lance-index/src/scalar/inverted/index/format.rs:11-11 | No standalone documentation summary; use the family contract and source entry. |
| `pub const INVERTED_INDEX_VERSION_V2: u32 = 2;` | rust/lance-index/src/scalar/inverted/index/format.rs:12-12 | No standalone documentation summary; use the family contract and source entry. |
| `pub const INVERTED_INDEX_VERSION_V3: u32 = 3;` | rust/lance-index/src/scalar/inverted/index/format.rs:13-13 | No standalone documentation summary; use the family contract and source entry. |
| `pub const TOKENS_FILE: &str = "tokens.lance";` | rust/lance-index/src/scalar/inverted/index/format.rs:14-14 | No standalone documentation summary; use the family contract and source entry. |
| `pub const INVERT_LIST_FILE: &str = "invert.lance";` | rust/lance-index/src/scalar/inverted/index/format.rs:15-15 | No standalone documentation summary; use the family contract and source entry. |
| `pub const DOCS_FILE: &str = "docs.lance";` | rust/lance-index/src/scalar/inverted/index/format.rs:16-16 | No standalone documentation summary; use the family contract and source entry. |
| `pub const METADATA_FILE: &str = "metadata.lance";` | rust/lance-index/src/scalar/inverted/index/format.rs:17-17 | No standalone documentation summary; use the family contract and source entry. |
| `pub const TOKEN_COL: &str = "_token";` | rust/lance-index/src/scalar/inverted/index/format.rs:34-34 | No standalone documentation summary; use the family contract and source entry. |
| `pub const TOKEN_ID_COL: &str = "_token_id";` | rust/lance-index/src/scalar/inverted/index/format.rs:35-35 | No standalone documentation summary; use the family contract and source entry. |
| `pub const TOKEN_FST_BYTES_COL: &str = "_token_fst_bytes";` | rust/lance-index/src/scalar/inverted/index/format.rs:36-36 | No standalone documentation summary; use the family contract and source entry. |
| `pub const TOKEN_NEXT_ID_COL: &str = "_token_next_id";` | rust/lance-index/src/scalar/inverted/index/format.rs:37-37 | No standalone documentation summary; use the family contract and source entry. |
| `pub const TOKEN_TOTAL_LENGTH_COL: &str = "_token_total_length";` | rust/lance-index/src/scalar/inverted/index/format.rs:38-38 | No standalone documentation summary; use the family contract and source entry. |
| `pub const FREQUENCY_COL: &str = "_frequency";` | rust/lance-index/src/scalar/inverted/index/format.rs:39-39 | No standalone documentation summary; use the family contract and source entry. |
| `pub const POSITION_COL: &str = "_position";` | rust/lance-index/src/scalar/inverted/index/format.rs:40-40 | No standalone documentation summary; use the family contract and source entry. |
| `pub const COMPRESSED_POSITION_COL: &str = "_compressed_position";` | rust/lance-index/src/scalar/inverted/index/format.rs:41-41 | No standalone documentation summary; use the family contract and source entry. |
| `pub const POSITION_BLOCK_OFFSET_COL: &str = "_position_block_offset";` | rust/lance-index/src/scalar/inverted/index/format.rs:42-42 | No standalone documentation summary; use the family contract and source entry. |
| `pub const POSTING_COL: &str = "_posting";` | rust/lance-index/src/scalar/inverted/index/format.rs:43-43 | No standalone documentation summary; use the family contract and source entry. |
| `pub const IMPACT_COL: &str = "_impacts";` | rust/lance-index/src/scalar/inverted/index/format.rs:44-44 | No standalone documentation summary; use the family contract and source entry. |
| `pub const MAX_SCORE_COL: &str = "_max_score";` | rust/lance-index/src/scalar/inverted/index/format.rs:45-45 | No standalone documentation summary; use the family contract and source entry. |
| `pub const LENGTH_COL: &str = "_length";` | rust/lance-index/src/scalar/inverted/index/format.rs:46-46 | No standalone documentation summary; use the family contract and source entry. |
| `pub const BLOCK_MAX_SCORE_COL: &str = "_block_max_score";` | rust/lance-index/src/scalar/inverted/index/format.rs:47-47 | No standalone documentation summary; use the family contract and source entry. |
| `pub const NUM_TOKEN_COL: &str = "_num_tokens";` | rust/lance-index/src/scalar/inverted/index/format.rs:48-48 | No standalone documentation summary; use the family contract and source entry. |
| `pub const DOC_INDEX_COL: &str = "_doc_index";` | rust/lance-index/src/scalar/inverted/index/format.rs:49-49 | No standalone documentation summary; use the family contract and source entry. |
| `pub const DOC_INDEX_STORAGE_PREFIX: &str = "_doc_index_";` | rust/lance-index/src/scalar/inverted/index/format.rs:50-50 | No standalone documentation summary; use the family contract and source entry. |
| `pub const SCORE_COL: &str = "_score";` | rust/lance-index/src/scalar/inverted/index/format.rs:51-51 | No standalone documentation summary; use the family contract and source entry. |
| `pub const TOKEN_SET_FORMAT_KEY: &str = "token_set_format";` | rust/lance-index/src/scalar/inverted/index/format.rs:52-52 | No standalone documentation summary; use the family contract and source entry. |
| `pub const POSTING_TAIL_CODEC_KEY: &str = "posting_tail_codec";` | rust/lance-index/src/scalar/inverted/index/format.rs:53-53 | No standalone documentation summary; use the family contract and source entry. |
| `pub const FTS_FORMAT_VERSION_KEY: &str = "format_version";` | rust/lance-index/src/scalar/inverted/index/format.rs:54-54 | No standalone documentation summary; use the family contract and source entry. |
| `pub const POSITIONS_LAYOUT_KEY: &str = "positions_layout";` | rust/lance-index/src/scalar/inverted/index/format.rs:55-55 | No standalone documentation summary; use the family contract and source entry. |
| `pub const POSITIONS_CODEC_KEY: &str = "positions_codec";` | rust/lance-index/src/scalar/inverted/index/format.rs:56-56 | No standalone documentation summary; use the family contract and source entry. |
| `pub const POSTING_BLOCK_SIZE_KEY: &str = "posting_block_size";` | rust/lance-index/src/scalar/inverted/index/format.rs:57-57 | No standalone documentation summary; use the family contract and source entry. |
| `pub const POSTING_TAIL_CODEC_FIXED32_V1: &str = "fixed32_v1";` | rust/lance-index/src/scalar/inverted/index/format.rs:58-58 | No standalone documentation summary; use the family contract and source entry. |
| `pub const POSTING_TAIL_CODEC_VARINT_DELTA_V1: &str = "varint_delta_v1";` | rust/lance-index/src/scalar/inverted/index/format.rs:59-59 | No standalone documentation summary; use the family contract and source entry. |
| `pub const POSITIONS_LAYOUT_SHARED_STREAM_V2: &str = "shared_stream_v2";` | rust/lance-index/src/scalar/inverted/index/format.rs:60-60 | No standalone documentation summary; use the family contract and source entry. |
| `pub const POSITIONS_CODEC_VARINT_DOC_DELTA_V2: &str = "varint_doc_delta_v2";` | rust/lance-index/src/scalar/inverted/index/format.rs:61-61 | No standalone documentation summary; use the family contract and source entry. |
| `pub const POSITIONS_CODEC_PACKED_DELTA_V1: &str = "packed_delta_v1";` | rust/lance-index/src/scalar/inverted/index/format.rs:62-62 | No standalone documentation summary; use the family contract and source entry. |
| `pub const DELETED_FRAGMENTS_COL: &str = "deleted_fragments";` | rust/lance-index/src/scalar/inverted/index/format.rs:63-63 | No standalone documentation summary; use the family contract and source entry. |
| `pub const ESTIMATED_MAX_TOKENS_PER_ROW: usize = 4 * 1024;` | rust/lance-index/src/scalar/inverted/index/format.rs:66-66 | No standalone documentation summary; use the family contract and source entry. |
| `pub static SCORE_FIELD: LazyLock&lt;Field&gt; = LazyLock::new(\|\| Field::new(SCORE_COL, DataType::Float32, true));` | rust/lance-index/src/scalar/inverted/index/format.rs:68-69 | No standalone documentation summary; use the family contract and source entry. |
| `pub static DOC_INDEX_FIELD: LazyLock&lt;Field&gt; = LazyLock::new(\|\|` | rust/lance-index/src/scalar/inverted/index/format.rs:70-70 | No standalone documentation summary; use the family contract and source entry. |
| `pub static FTS_SCHEMA: LazyLock&lt;SchemaRef&gt; = LazyLock::new(\|\| Arc::new(Schema::new(vec![ROW_ID_FIELD.clone(), SCORE_FIELD.clone()])));` | rust/lance-index/src/scalar/inverted/index/format.rs:77-78 | No standalone documentation summary; use the family contract and source entry. |
| `pub static ELEMENT_FTS_SCHEMA: LazyLock&lt;SchemaRef&gt; = LazyLock::new(\|\|` | rust/lance-index/src/scalar/inverted/index/format.rs:79-79 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn fts_schema(document_granularity: DocumentGranularity) -&gt; SchemaRef` | rust/lance-index/src/scalar/inverted/index/format.rs:87-87 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn resolve_fts_format_version( value: Option&lt;&str&gt;, ) -&gt; std::result::Result&lt;InvertedListFormatVersion, Error&gt;` | rust/lance-index/src/scalar/inverted/index/format.rs:97-99 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn default_fts_format_version() -&gt; InvertedListFormatVersion` | rust/lance-index/src/scalar/inverted/index/format.rs:106-106 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn current_fts_format_version() -&gt; InvertedListFormatVersion` | rust/lance-index/src/scalar/inverted/index/format.rs:110-110 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn max_supported_fts_format_version() -&gt; InvertedListFormatVersion` | rust/lance-index/src/scalar/inverted/index/format.rs:114-114 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum InvertedListFormatVersion` | rust/lance-index/src/scalar/inverted/index/format.rs:119-119 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn from_posting_tail_codec(codec: PostingTailCodec) -&gt; Self` | rust/lance-index/src/scalar/inverted/index/format.rs:127-127 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn from_posting_tail_codec_and_block_size( codec: PostingTailCodec, block_size: usize, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/inverted/index/format.rs:134-137 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn index_version(self) -&gt; u32` | rust/lance-index/src/scalar/inverted/index/format.rs:154-154 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn posting_tail_codec(self) -&gt; PostingTailCodec` | rust/lance-index/src/scalar/inverted/index/format.rs:162-162 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn position_codec(self) -&gt; Option&lt;PositionStreamCodec&gt;` | rust/lance-index/src/scalar/inverted/index/format.rs:169-169 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn uses_shared_position_stream(self) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/format.rs:176-176 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn default_fts_format_version_for_block_size( block_size: usize, ) -&gt; Result&lt;InvertedListFormatVersion&gt;` | rust/lance-index/src/scalar/inverted/index/format.rs:197-199 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn validate_format_version_block_size( format_version: InvertedListFormatVersion, block_size: usize, ) -&gt; Result&lt;()&gt;` | rust/lance-index/src/scalar/inverted/index/format.rs:208-211 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum TokenSetFormat` | rust/lance-index/src/scalar/inverted/index/format.rs:226-226 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum PositionStreamCodec` | rust/lance-index/src/scalar/inverted/index/format.rs:264-264 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum PostingTailCodec` | rust/lance-index/src/scalar/inverted/index/format.rs:271-271 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn as_str(self) -&gt; &'static str` | rust/lance-index/src/scalar/inverted/index/format.rs:278-278 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn as_str(self) -&gt; &'static str` | rust/lance-index/src/scalar/inverted/index/format.rs:325-325 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-index-inverted-index-rs"></a>

## `rust/lance-index/src/scalar/inverted/index/inverted_index.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct InvertedIndex` | rust/lance-index/src/scalar/inverted/index/inverted_index.rs:22-22 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn tokenizer(&self) -&gt; Box&lt;dyn LanceTokenizer&gt;` | rust/lance-index/src/scalar/inverted/index/inverted_index.rs:128-128 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn params(&self) -&gt; &InvertedIndexParams` | rust/lance-index/src/scalar/inverted/index/inverted_index.rs:132-132 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn partition_count(&self) -&gt; usize` | rust/lance-index/src/scalar/inverted/index/inverted_index.rs:137-137 | Returns the number of partitions in this inverted index. |
| `pub fn deleted_fragments(&self) -&gt; &RoaringBitmap` | rust/lance-index/src/scalar/inverted/index/inverted_index.rs:145-145 | Returns the set of fragments which are contained in the index, but no longer in the dataset. |
| `pub async fn merge_segments( segments: &[Arc&lt;Self&gt;], new_data: SendableRecordBatchStream, dest_store: &dyn IndexStore, old_data_filter: Option&lt;OldIndexDataFilter&gt;, progress: Arc&lt;dyn IndexBuildProgress&gt;, ) -&gt; Result&lt;CreatedIndex&gt;` | rust/lance-index/src/scalar/inverted/index/inverted_index.rs:149-155 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_legacy(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/inverted_index.rs:388-388 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn supports_wand_exactness_certificate(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/inverted_index.rs:398-398 | Returns whether bounded WAND results can certify exact global top-k membership. |
| `pub async fn load_params(store: &dyn IndexStore) -&gt; Result&lt;InvertedIndexParams&gt;` | rust/lance-index/src/scalar/inverted/index/inverted_index.rs:408-408 | Read only the index's [`InvertedIndexParams`], Contains more complete info than manifest's lossy `InvertedIndexDetails`. |
| `pub async fn load( store: Arc&lt;dyn IndexStore&gt;, frag_reuse_index: Option&lt;Arc&lt;dyn RowIdRemapper&gt;&gt;, index_cache: &LanceCache, ) -&gt; Result&lt;Arc&lt;Self&gt;&gt; where Self: Sized,` | rust/lance-index/src/scalar/inverted/index/inverted_index.rs:437-444 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn shares_prewarm_state(&self, other: &Self) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/inverted_index.rs:730-730 | Return whether both handles share the same runtime prewarm state. |
| `pub async fn prewarm_with_options(&self, options: &FtsPrewarmOptions) -&gt; Result&lt;()&gt;` | rust/lance-index/src/scalar/inverted/index/inverted_index.rs:747-747 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn prewarm_with_options_result( &self, options: &FtsPrewarmOptions, ) -&gt; Result&lt;FtsPrewarmResult&gt;` | rust/lance-index/src/scalar/inverted/index/inverted_index.rs:751-754 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn prewarm_residency_result(&self, with_position: bool) -&gt; FtsPrewarmResult` | rust/lance-index/src/scalar/inverted/index/inverted_index.rs:861-861 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-index-partition-rs"></a>

## `rust/lance-index/src/scalar/inverted/index/partition.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct InvertedPartition` | rust/lance-index/src/scalar/inverted/index/partition.rs:677-677 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn belongs_to_fragment(&self, fragment_mask: u64) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/partition.rs:700-700 | Check if this partition belongs to the specified fragment. |
| `pub fn id(&self) -&gt; u64` | rust/lance-index/src/scalar/inverted/index/partition.rs:704-704 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn store(&self) -&gt; &dyn IndexStore` | rust/lance-index/src/scalar/inverted/index/partition.rs:708-708 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_legacy(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/partition.rs:712-712 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn load( store: Arc&lt;dyn IndexStore&gt;, id: u64, frag_reuse_index: Option&lt;Arc&lt;dyn RowIdRemapper&gt;&gt;, index_cache: &LanceCache, token_set_format: TokenSetFormat, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/inverted/index/partition.rs:852-858 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn expand_fuzzy(&self, tokens: &Tokens, params: &FtsSearchParams) -&gt; Result&lt;Tokens&gt;` | rust/lance-index/src/scalar/inverted/index/partition.rs:946-946 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn into_builder(self) -&gt; Result&lt;InnerBuilder&gt;` | rust/lance-index/src/scalar/inverted/index/partition.rs:1586-1586 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-index-posting-batch-builder-rs"></a>

## `rust/lance-index/src/scalar/inverted/index/posting_batch_builder.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn new( schema: SchemaRef, with_positions: bool, format_version: InvertedListFormatVersion, capacity: usize, ) -&gt; Self` | rust/lance-index/src/scalar/inverted/index/posting_batch_builder.rs:38-43 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn len(&self) -&gt; usize` | rust/lance-index/src/scalar/inverted/index/posting_batch_builder.rs:72-72 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/posting_batch_builder.rs:76-76 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn finish(&mut self) -&gt; Result&lt;RecordBatch&gt;` | rust/lance-index/src/scalar/inverted/index/posting_batch_builder.rs:166-166 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-index-posting-builder-rs"></a>

## `rust/lance-index/src/scalar/inverted/index/posting_builder.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct PostingListBuilder` | rust/lance-index/src/scalar/inverted/index/posting_builder.rs:25-25 | Builds the posting list of one token during indexing. |
| `pub fn size(&self) -&gt; u64` | rust/lance-index/src/scalar/inverted/index/posting_builder.rs:123-123 | Heap bytes owned by this builder, excluding the builder struct itself. |
| `pub fn has_positions(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/posting_builder.rs:142-142 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(with_position: bool) -&gt; Self` | rust/lance-index/src/scalar/inverted/index/posting_builder.rs:146-146 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_posting_tail_codec( with_position: bool, posting_tail_codec: PostingTailCodec, ) -&gt; Self` | rust/lance-index/src/scalar/inverted/index/posting_builder.rs:154-157 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_block_size(with_position: bool, block_size: usize) -&gt; Self` | rust/lance-index/src/scalar/inverted/index/posting_builder.rs:165-165 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_posting_tail_codec_and_block_size( with_position: bool, posting_tail_codec: PostingTailCodec, block_size: usize, ) -&gt; Self` | rust/lance-index/src/scalar/inverted/index/posting_builder.rs:173-177 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn len(&self) -&gt; usize` | rust/lance-index/src/scalar/inverted/index/posting_builder.rs:194-194 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/posting_builder.rs:210-210 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn iter(&self) -&gt; std::vec::IntoIter&lt;(u32, u32, Option&lt;Vec&lt;u32&gt;&gt;)&gt;` | rust/lance-index/src/scalar/inverted/index/posting_builder.rs:214-214 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn for_each_entry&lt;E&gt;( &self, mut visit: impl FnMut(u32, u32, Option&lt;Vec&lt;u32&gt;&gt;) -&gt; std::result::Result&lt;(), E&gt;, ) -&gt; std::result::Result&lt;(), E&gt;` | rust/lance-index/src/scalar/inverted/index/posting_builder.rs:232-235 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn add(&mut self, doc_id: u32, term_positions: PositionRecorder)` | rust/lance-index/src/scalar/inverted/index/posting_builder.rs:301-301 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn add_occurrence(&mut self, doc_id: u32, position: u32) -&gt; Result&lt;bool&gt;` | rust/lance-index/src/scalar/inverted/index/posting_builder.rs:318-318 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn finish_open_doc(&mut self, doc_id: u32) -&gt; Result&lt;()&gt;` | rust/lance-index/src/scalar/inverted/index/posting_builder.rs:351-351 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn to_batch(self, block_max_scores: Vec&lt;f32&gt;) -&gt; Result&lt;RecordBatch&gt;` | rust/lance-index/src/scalar/inverted/index/posting_builder.rs:722-722 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn to_batch_with_docs(self, docs: &DocSet, schema: SchemaRef) -&gt; Result&lt;RecordBatch&gt;` | rust/lance-index/src/scalar/inverted/index/posting_builder.rs:753-753 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn remap(&mut self, removed: &[u32])` | rust/lance-index/src/scalar/inverted/index/posting_builder.rs:779-779 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-index-posting-list-rs"></a>

## `rust/lance-index/src/scalar/inverted/index/posting_list.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub enum PostingList` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:8-8 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn from_batch( batch: &RecordBatch, max_score: Option&lt;f32&gt;, length: Option&lt;u32&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:14-18 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn from_batch_with_tail_codec( batch: &RecordBatch, max_score: Option&lt;f32&gt;, length: Option&lt;u32&gt;, posting_tail_codec: PostingTailCodec, block_size: usize, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:24-30 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn iter(&self) -&gt; PostingListIterator&lt;'_&gt;` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:82-82 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn has_position(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:86-86 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn has_impacts(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:93-93 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn set_positions(&mut self, positions: CompressedPositionStorage)` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:100-100 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn take_positions(&mut self) -&gt; Option&lt;CompressedPositionStorage&gt;` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:116-116 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn max_score(&self) -&gt; Option&lt;f32&gt;` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:126-126 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn len(&self) -&gt; usize` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:133-133 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:140-140 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn into_builder(self, docs: &DocSet) -&gt; PostingListBuilder` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:144-144 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct PlainPostingList` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:210-210 | No standalone documentation summary; use the family contract and source entry. |
| `pub row_ids: ScalarBuffer&lt;u64&gt;,` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:211-211 | No standalone documentation summary; use the family contract and source entry. |
| `pub frequencies: ScalarBuffer&lt;f32&gt;,` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:212-212 | No standalone documentation summary; use the family contract and source entry. |
| `pub max_score: Option&lt;f32&gt;,` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:213-213 | No standalone documentation summary; use the family contract and source entry. |
| `pub positions: Option&lt;ListArray&gt;, // List of Int32` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:214-214 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( row_ids: ScalarBuffer&lt;u64&gt;, frequencies: ScalarBuffer&lt;f32&gt;, max_score: Option&lt;f32&gt;, positions: Option&lt;ListArray&gt;, ) -&gt; Self` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:230-235 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn from_batch(batch: &RecordBatch, max_score: Option&lt;f32&gt;) -&gt; Self` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:244-244 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn len(&self) -&gt; usize` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:257-257 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:261-261 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn iter(&self) -&gt; PlainPostingListIterator&lt;'_&gt;` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:265-265 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn doc(&self, i: usize) -&gt; LocatedDocInfo` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:290-290 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn positions(&self, index: usize) -&gt; Option&lt;Arc&lt;dyn Array&gt;&gt;` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:294-294 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn max_score(&self) -&gt; Option&lt;f32&gt;` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:300-300 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn row_id(&self, i: usize) -&gt; u64` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:304-304 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct CompressedPostingList` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:354-354 | No standalone documentation summary; use the family contract and source entry. |
| `pub max_score: f32,` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:355-355 | No standalone documentation summary; use the family contract and source entry. |
| `pub length: u32,` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:356-356 | No standalone documentation summary; use the family contract and source entry. |
| `pub blocks: LargeBinaryArray,` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:360-360 | No standalone documentation summary; use the family contract and source entry. |
| `pub posting_tail_codec: PostingTailCodec,` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:361-361 | No standalone documentation summary; use the family contract and source entry. |
| `pub block_size: usize,` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:362-362 | No standalone documentation summary; use the family contract and source entry. |
| `pub positions: Option&lt;CompressedPositionStorage&gt;,` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:363-363 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn from_batch( batch: &RecordBatch, max_score: f32, length: u32, posting_tail_codec: PostingTailCodec, block_size: usize, shared_position_codec: Option&lt;PositionStreamCodec&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:468-475 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn iter(&self) -&gt; CompressedPostingListIterator` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:524-524 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn block_max_score(&self, block_idx: usize) -&gt; f32` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:534-534 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn block_least_doc_id(&self, block_idx: usize) -&gt; u32` | rust/lance-index/src/scalar/inverted/index/posting_list.rs:547-547 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-index-posting-reader-rs"></a>

## `rust/lance-index/src/scalar/inverted/index/posting_reader.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct PostingListReader` | rust/lance-index/src/scalar/inverted/index/posting_reader.rs:83-83 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn len(&self) -&gt; usize` | rust/lance-index/src/scalar/inverted/index/posting_reader.rs:316-316 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/posting_reader.rs:323-323 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-index-search-rs"></a>

## `rust/lance-index/src/scalar/inverted/index/search.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub async fn bm25_base_scorer( &self, query_tokens: &Tokens, params: &FtsSearchParams, metrics: Option&lt;&dyn MetricsCollector&gt;, ) -&gt; Result&lt;MemBM25Scorer&gt;` | rust/lance-index/src/scalar/inverted/index/search.rs:89-94 | Build a single-segment [`MemBM25Scorer`] whose per-term IDF table covers every token that the per-partition scoring loop will look up. For fuzzy queries that means the union of Levenshtein expansions, not just the raw query tokens — otherwise `query_weight(expanded_token)` returns 0 and the BM25 contribution of every expanded match is discarded. |
| `pub async fn bm25_stats_for_terms( &self, terms: &[String], metrics: Option&lt;&dyn MetricsCollector&gt;, ) -&gt; Result&lt;(u64, usize, Vec&lt;usize&gt;)&gt;` | rust/lance-index/src/scalar/inverted/index/search.rs:133-137 | Corpus statistics at document granularity: `(total_tokens, docCount, per_term_docFreq)`, where a document is one entry of a partition's [`DocSet`]. This is what the single-column scoring path pairs with, since wand scores one posting per document. |
| `pub async fn bm25_row_stats_for_terms( &self, terms: &[String], stale_rows: Option&lt;&RowAddrTreeMap&gt;, metrics: Option&lt;&dyn MetricsCollector&gt;, ) -&gt; Result&lt;(u64, usize, Vec&lt;usize&gt;)&gt;` | rust/lance-index/src/scalar/inverted/index/search.rs:236-241 | Corpus statistics at row granularity: `(total_tokens, docCount, per_term_docFreq)` counted over distinct row ids. |
| `pub fn expand_fuzzy_tokens(&self, tokens: &Tokens, params: &FtsSearchParams) -&gt; Result&lt;Tokens&gt;` | rust/lance-index/src/scalar/inverted/index/search.rs:423-423 | Expand fuzzy query tokens against all partitions in this segment. |
| `pub async fn bm25_search( &self, tokens: Arc&lt;Tokens&gt;, params: Arc&lt;FtsSearchParams&gt;, operator: Operator, prefilter: Arc&lt;dyn PreFilter&gt;, metrics: Arc&lt;dyn MetricsCollector&gt;, base_scorer: Option&lt;&MemBM25Scorer&gt;, ) -&gt; Result&lt;(Vec&lt;u64&gt;, Vec&lt;f32&gt;)&gt;` | rust/lance-index/src/scalar/inverted/index/search.rs:481-489 | Search documents that match the query and return row ids sorted by BM25 score. |
| `pub async fn bm25_search_documents( &self, tokens: Arc&lt;Tokens&gt;, params: Arc&lt;FtsSearchParams&gt;, operator: Operator, prefilter: Arc&lt;dyn PreFilter&gt;, metrics: Arc&lt;dyn MetricsCollector&gt;, base_scorer: Option&lt;&MemBM25Scorer&gt;, ) -&gt; Result&lt;Vec&lt;ScoredDoc&gt;&gt;` | rust/lance-index/src/scalar/inverted/index/search.rs:505-513 | Search logical FTS documents, retaining element coordinates when present. |
| `pub async fn bm25_search_documents_with_score_floor( &self, tokens: Arc&lt;Tokens&gt;, params: Arc&lt;FtsSearchParams&gt;, operator: Operator, prefilter: Arc&lt;dyn PreFilter&gt;, metrics: Arc&lt;dyn MetricsCollector&gt;, base_scorer: Option&lt;&MemBM25Scorer&gt;, initial_score_floor: f32, ) -&gt; Result&lt;Vec&lt;ScoredDoc&gt;&gt;` | rust/lance-index/src/scalar/inverted/index/search.rs:534-543 | Search logical FTS documents with an exclusive initial raw-score floor. |
| `pub async fn bm25_search_prepared( &self, prepared: Arc&lt;crate::scalar::inverted::PreparedBm25Query&gt;, params: Arc&lt;FtsSearchParams&gt;, operator: Operator, prefilter: Arc&lt;dyn PreFilter&gt;, metrics: Arc&lt;dyn MetricsCollector&gt;, ) -&gt; Result&lt;(Vec&lt;u64&gt;, Vec&lt;f32&gt;)&gt;` | rust/lance-index/src/scalar/inverted/index/search.rs:631-638 | Search with a vocabulary/scorer pair prepared once across every physical segment. No fuzzy expansion or local scorer construction is permitted below this boundary. |
| `pub async fn bm25_search_prepared_documents( &self, prepared: Arc&lt;crate::scalar::inverted::PreparedBm25Query&gt;, params: Arc&lt;FtsSearchParams&gt;, operator: Operator, prefilter: Arc&lt;dyn PreFilter&gt;, metrics: Arc&lt;dyn MetricsCollector&gt;, ) -&gt; Result&lt;Vec&lt;ScoredDoc&gt;&gt;` | rust/lance-index/src/scalar/inverted/index/search.rs:651-658 | Search logical FTS documents with a vocabulary/scorer pair prepared once across every physical segment. |
| `pub async fn bm25_search_prepared_documents_with_score_floor( &self, prepared: Arc&lt;crate::scalar::inverted::PreparedBm25Query&gt;, params: Arc&lt;FtsSearchParams&gt;, operator: Operator, prefilter: Arc&lt;dyn PreFilter&gt;, metrics: Arc&lt;dyn MetricsCollector&gt;, initial_score_floor: f32, ) -&gt; Result&lt;Vec&lt;ScoredDoc&gt;&gt;` | rust/lance-index/src/scalar/inverted/index/search.rs:669-677 | Search logical FTS documents with a prepared vocabulary/scorer pair and an exclusive initial raw-score floor. |

<a id="source-rust-lance-index-src-scalar-inverted-index-token-set-rs"></a>

## `rust/lance-index/src/scalar/inverted/index/token_set.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub enum TokenMap` | rust/lance-index/src/scalar/inverted/index/token_set.rs:13-13 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn len(&self) -&gt; usize` | rust/lance-index/src/scalar/inverted/index/token_set.rs:34-34 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/token_set.rs:41-41 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct TokenSet` | rust/lance-index/src/scalar/inverted/index/token_set.rs:65-65 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn into_mut(self) -&gt; Self` | rust/lance-index/src/scalar/inverted/index/token_set.rs:73-73 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn len(&self) -&gt; usize` | rust/lance-index/src/scalar/inverted/index/token_set.rs:94-94 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/index/token_set.rs:98-98 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn to_batch(self, format: TokenSetFormat) -&gt; Result&lt;RecordBatch&gt;` | rust/lance-index/src/scalar/inverted/index/token_set.rs:102-102 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn load(reader: Arc&lt;dyn IndexReader&gt;, format: TokenSetFormat) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/inverted/index/token_set.rs:152-152 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn add(&mut self, token: String) -&gt; u32` | rust/lance-index/src/scalar/inverted/index/token_set.rs:231-231 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn get(&self, token: &str) -&gt; Option&lt;u32&gt;` | rust/lance-index/src/scalar/inverted/index/token_set.rs:248-248 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn remap(&mut self, removed_token_ids: &[u32])` | rust/lance-index/src/scalar/inverted/index/token_set.rs:334-334 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn next_id(&self) -&gt; u32` | rust/lance-index/src/scalar/inverted/index/token_set.rs:374-374 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-iter-rs"></a>

## `rust/lance-index/src/scalar/inverted/iter.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub enum PostingListIterator&lt;'a&gt;` | rust/lance-index/src/scalar/inverted/iter.rs:15-15 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(posting: &'a PostingList) -&gt; Self` | rust/lance-index/src/scalar/inverted/iter.rs:21-21 | No standalone documentation summary; use the family contract and source entry. |
| `pub type PlainPostingListIterator&lt;'a&gt; = Box&lt;dyn Iterator&lt;Item = (u64, f32, Option&lt;Box&lt;dyn Iterator&lt;Item = u32&gt; + 'a&gt;&gt;)&gt; + 'a&gt;;` | rust/lance-index/src/scalar/inverted/iter.rs:52-53 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct CompressedPostingListIterator` | rust/lance-index/src/scalar/inverted/iter.rs:79-79 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( length: usize, blocks: LargeBinaryArray, posting_tail_codec: PostingTailCodec, positions: Option&lt;CompressedPositionStorage&gt;, block_size: usize, ) -&gt; Self` | rust/lance-index/src/scalar/inverted/iter.rs:96-102 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn take_fst_keys&lt;'f, I, S&gt;(s: I, dst: &mut Vec&lt;String&gt;, max_expansion: usize) where I: for&lt;'a&gt; fst::IntoStreamer&lt;'a, Into = S, Item = (&'a [u8], u64)&gt;, S: 'f + for&lt;'a&gt; fst::Streamer&lt;'a, Item = (&'a [u8], u64)&gt;,` | rust/lance-index/src/scalar/inverted/iter.rs:205-209 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-json-rs"></a>

## `rust/lance-index/src/scalar/inverted/json.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct JsonTextStream` | rust/lance-index/src/scalar/inverted/json.rs:16-16 | Presents a JSON column as JSON text documents, whichever encoding the column arrives in. |
| `pub fn try_new(inner: SendableRecordBatchStream, json_col: String) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/inverted/json.rs:24-24 | Fails when `json_col` is missing or does not hold JSON. |

<a id="source-rust-lance-index-src-scalar-inverted-oracle-rs"></a>

## `rust/lance-index/src/scalar/inverted/oracle.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn brute_force_bm25f( columns: &[(f32, Vec&lt;&str&gt;)], query: &str, require_all_terms: bool, ) -&gt; Vec&lt;Option&lt;f32&gt;&gt;` | rust/lance-index/src/scalar/inverted/oracle.rs:32-36 | Exact BM25F: `docFreq'`/`docCount'` are the max across fields, `tf'`/`dl'`/ `sumTotalTermFreq'` weighted sums, and the `(k1 + 1)` numerator is Lance's. `None` for a document that does not match. `columns` pairs each field's weight with its text, one entry per document. |
| `pub fn brute_force_ids(scores: &[Option&lt;f32&gt;]) -&gt; HashSet&lt;i32&gt;` | rust/lance-index/src/scalar/inverted/oracle.rs:122-122 | The ids [`brute_force_bm25f`] matched. |
| `pub fn brute_force_top_k(scores: &[Option&lt;f32&gt;], k: usize) -&gt; Vec&lt;i32&gt;` | rust/lance-index/src/scalar/inverted/oracle.rs:131-131 | The `k` highest-scoring ids, descending, id as tiebreak. |

<a id="source-rust-lance-index-src-scalar-inverted-parser-rs"></a>

## `rust/lance-index/src/scalar/inverted/parser.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub trait JsonParser` | rust/lance-index/src/scalar/inverted/parser.rs:12-12 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn from_json(json: &str) -&gt; Result&lt;FtsQuery&gt;` | rust/lance-index/src/scalar/inverted/parser.rs:234-234 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-query-rs"></a>

## `rust/lance-index/src/scalar/inverted/query.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn uses_fuzzy_expansion(fuzziness: Option&lt;u32&gt;) -&gt; bool` | rust/lance-index/src/scalar/inverted/query.rs:18-18 | Return whether a Match query requires vocabulary expansion. |
| `pub struct FtsSearchParams` | rust/lance-index/src/scalar/inverted/query.rs:56-56 | No standalone documentation summary; use the family contract and source entry. |
| `pub limit: Option&lt;usize&gt;,` | rust/lance-index/src/scalar/inverted/query.rs:64-64 | Controls result completeness for each recursively planned FTS node. |
| `pub wand_factor: f32,` | rust/lance-index/src/scalar/inverted/query.rs:65-65 | No standalone documentation summary; use the family contract and source entry. |
| `pub fuzziness: Option&lt;u32&gt;,` | rust/lance-index/src/scalar/inverted/query.rs:66-66 | No standalone documentation summary; use the family contract and source entry. |
| `pub max_expansions: usize,` | rust/lance-index/src/scalar/inverted/query.rs:69-69 | Final fuzzy vocabulary budget for one Match leaf across all selected segments and partitions. |
| `pub phrase_slop: Option&lt;u32&gt;,` | rust/lance-index/src/scalar/inverted/query.rs:72-72 | No standalone documentation summary; use the family contract and source entry. |
| `pub prefix_length: u32,` | rust/lance-index/src/scalar/inverted/query.rs:74-74 | The number of beginning characters being unchanged for fuzzy matching. |
| `pub fn new() -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:78-78 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_limit(mut self, limit: Option&lt;usize&gt;) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:89-89 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_wand_factor(mut self, factor: f32) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:94-94 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_fuzziness(mut self, fuzziness: Option&lt;u32&gt;) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:99-99 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_max_expansions(mut self, max_expansions: usize) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:104-104 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_phrase_slop(mut self, phrase_slop: Option&lt;u32&gt;) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:109-109 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_prefix_length(mut self, prefix_length: u32) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:114-114 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum Operator` | rust/lance-index/src/scalar/inverted/query.rs:127-127 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait FtsQueryNode` | rust/lance-index/src/scalar/inverted/query.rs:153-153 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum FtsQuery` | rust/lance-index/src/scalar/inverted/query.rs:159-159 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn query(&self) -&gt; String` | rust/lance-index/src/scalar/inverted/query.rs:218-218 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_missing_column(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/query.rs:232-232 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_column(self, column: String) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:251-251 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct MatchQuery` | rust/lance-index/src/scalar/inverted/query.rs:340-340 | No standalone documentation summary; use the family contract and source entry. |
| `pub column: Option&lt;String&gt;,` | rust/lance-index/src/scalar/inverted/query.rs:343-343 | No standalone documentation summary; use the family contract and source entry. |
| `pub terms: String,` | rust/lance-index/src/scalar/inverted/query.rs:344-344 | No standalone documentation summary; use the family contract and source entry. |
| `pub boost: f32,` | rust/lance-index/src/scalar/inverted/query.rs:350-350 | Finite, non-negative score multiplier. Validation occurs at the FTS query boundary so direct struct deserialization follows the same contract as builder-created queries. |
| `pub fuzziness: Option&lt;u32&gt;,` | rust/lance-index/src/scalar/inverted/query.rs:358-358 | No standalone documentation summary; use the family contract and source entry. |
| `pub max_expansions: usize,` | rust/lance-index/src/scalar/inverted/query.rs:366-366 | The maximum final vocabulary size for this Match leaf. |
| `pub operator: Operator,` | rust/lance-index/src/scalar/inverted/query.rs:373-373 | The operator to use for combining terms. This can be either `And` or `Or`, it's 'Or' by default. - `And`: All terms must match. - `Or`: At least one term must match. |
| `pub prefix_length: u32,` | rust/lance-index/src/scalar/inverted/query.rs:378-378 | The number of beginning characters being unchanged for fuzzy matching. Default to 0. |
| `pub document_granularity: Option&lt;DocumentGranularity&gt;,` | rust/lance-index/src/scalar/inverted/query.rs:387-387 | The requested logical document unit. |
| `pub fn new(terms: String) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:391-391 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_column(mut self, column: Option&lt;String&gt;) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:412-412 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_boost(mut self, boost: f32) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:417-417 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_fuzziness(mut self, fuzziness: Option&lt;u32&gt;) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:422-422 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_max_expansions(mut self, max_expansions: usize) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:427-427 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_operator(mut self, operator: Operator) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:432-432 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_prefix_length(mut self, prefix_length: u32) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:437-437 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_document_granularity(mut self, document_granularity: DocumentGranularity) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:442-442 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn auto_fuzziness(token: &str) -&gt; u32` | rust/lance-index/src/scalar/inverted/query.rs:447-447 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct PhraseQuery` | rust/lance-index/src/scalar/inverted/query.rs:467-467 | No standalone documentation summary; use the family contract and source entry. |
| `pub column: Option&lt;String&gt;,` | rust/lance-index/src/scalar/inverted/query.rs:470-470 | No standalone documentation summary; use the family contract and source entry. |
| `pub terms: String,` | rust/lance-index/src/scalar/inverted/query.rs:471-471 | No standalone documentation summary; use the family contract and source entry. |
| `pub slop: u32,` | rust/lance-index/src/scalar/inverted/query.rs:473-473 | No standalone documentation summary; use the family contract and source entry. |
| `pub document_granularity: Option&lt;DocumentGranularity&gt;,` | rust/lance-index/src/scalar/inverted/query.rs:481-481 | The requested logical document unit. |
| `pub fn new(terms: String) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:485-485 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_column(mut self, column: Option&lt;String&gt;) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:494-494 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_slop(mut self, slop: u32) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:499-499 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_document_granularity(mut self, document_granularity: DocumentGranularity) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:504-504 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct BoostQuery` | rust/lance-index/src/scalar/inverted/query.rs:521-521 | No standalone documentation summary; use the family contract and source entry. |
| `pub positive: Box&lt;FtsQuery&gt;,` | rust/lance-index/src/scalar/inverted/query.rs:522-522 | No standalone documentation summary; use the family contract and source entry. |
| `pub negative: Box&lt;FtsQuery&gt;,` | rust/lance-index/src/scalar/inverted/query.rs:523-523 | No standalone documentation summary; use the family contract and source entry. |
| `pub negative_boost: f32,` | rust/lance-index/src/scalar/inverted/query.rs:526-526 | Finite, non-negative multiplier subtracted from the positive score. |
| `pub fn new(positive: FtsQuery, negative: FtsQuery, negative_boost: Option&lt;f32&gt;) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:530-530 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct MultiMatchQuery` | rust/lance-index/src/scalar/inverted/query.rs:552-552 | No standalone documentation summary; use the family contract and source entry. |
| `pub match_queries: Vec&lt;MatchQuery&gt;,` | rust/lance-index/src/scalar/inverted/query.rs:554-554 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn try_new(query: String, columns: Vec&lt;String&gt;) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/inverted/query.rs:632-632 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn try_with_boosts(mut self, boosts: Vec&lt;f32&gt;) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/inverted/query.rs:646-646 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_operator(mut self, operator: Operator) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:659-659 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct CombinedFieldsQuery` | rust/lance-index/src/scalar/inverted/query.rs:695-695 | A cross-field (BM25F) full-text query, exposing Elasticsearch's `combined_fields` semantics: the target columns are treated as one virtual field so term statistics (document frequency, term frequency, and document length) are blended across fields rather than scored independently. |
| `pub fn try_new(terms: String, columns: Vec&lt;String&gt;) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/inverted/query.rs:725-725 | Create a combined-fields query over `columns`, with every weight defaulting to `1.0` and the `Or` operator. |
| `pub fn try_with_boosts(mut self, boosts: Vec&lt;f32&gt;) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/inverted/query.rs:761-761 | Set per-column weights, positionally aligned with the columns passed to [`Self::try_new`]. |
| `pub fn with_operator(mut self, operator: Operator) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:787-787 | Set the operator used to combine terms. |
| `pub fn terms(&self) -&gt; &str` | rust/lance-index/src/scalar/inverted/query.rs:793-793 | The query string, tokenized once and matched against every target column. |
| `pub fn operator(&self) -&gt; Operator` | rust/lance-index/src/scalar/inverted/query.rs:798-798 | How the query terms are combined. |
| `pub fn column_names(&self) -&gt; impl ExactSizeIterator&lt;Item = &str&gt;` | rust/lance-index/src/scalar/inverted/query.rs:803-803 | The target columns in query order. |
| `pub fn weighted_columns(&self) -&gt; impl ExactSizeIterator&lt;Item = (&str, f32)&gt;` | rust/lance-index/src/scalar/inverted/query.rs:814-814 | Each target column paired with its BM25F weight, in query order. |
| `pub enum Occur` | rust/lance-index/src/scalar/inverted/query.rs:873-873 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct BooleanQuery` | rust/lance-index/src/scalar/inverted/query.rs:908-908 | No standalone documentation summary; use the family contract and source entry. |
| `pub should: Vec&lt;FtsQuery&gt;,` | rust/lance-index/src/scalar/inverted/query.rs:910-910 | Optional scoring clauses, at least one of which must match when there are no MUST clauses. |
| `pub must: Vec&lt;FtsQuery&gt;,` | rust/lance-index/src/scalar/inverted/query.rs:912-912 | Required scoring clauses whose scores are summed. |
| `pub must_not: Vec&lt;FtsQuery&gt;,` | rust/lance-index/src/scalar/inverted/query.rs:914-914 | Prohibited non-scoring clauses. |
| `pub fn new(iter: impl IntoIterator&lt;Item = (Occur, FtsQuery)&gt;) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:918-918 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_should(mut self, query: FtsQuery) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:936-936 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_must(mut self, query: FtsQuery) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:941-941 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_must_not(mut self, query: FtsQuery) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:946-946 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct Tokens` | rust/lance-index/src/scalar/inverted/query.rs:1045-1045 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(tokens: Vec&lt;String&gt;, token_type: DocType) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:1053-1053 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_positions(tokens: Vec&lt;String&gt;, positions: Vec&lt;u32&gt;, token_type: DocType) -&gt; Self` | rust/lance-index/src/scalar/inverted/query.rs:1058-1058 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn len(&self) -&gt; usize` | rust/lance-index/src/scalar/inverted/query.rs:1075-1075 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/query.rs:1079-1079 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn token_type(&self) -&gt; &DocType` | rust/lance-index/src/scalar/inverted/query.rs:1083-1083 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn contains(&self, token: &str) -&gt; bool` | rust/lance-index/src/scalar/inverted/query.rs:1087-1087 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn token_index(&self, token: &str) -&gt; Option&lt;usize&gt;` | rust/lance-index/src/scalar/inverted/query.rs:1091-1091 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn get_token(&self, index: usize) -&gt; &str` | rust/lance-index/src/scalar/inverted/query.rs:1095-1095 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn position(&self, index: usize) -&gt; u32` | rust/lance-index/src/scalar/inverted/query.rs:1099-1099 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn collect_query_tokens(text: &str, tokenizer: &mut Box&lt;dyn LanceTokenizer&gt;) -&gt; Tokens` | rust/lance-index/src/scalar/inverted/query.rs:1122-1122 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn try_collect_query_tokens( text: &str, tokenizer: &mut Box&lt;dyn LanceTokenizer&gt;, ) -&gt; Result&lt;Tokens&gt;` | rust/lance-index/src/scalar/inverted/query.rs:1129-1132 | Tokenize search text, returning tokenizer-specific query syntax errors. |
| `pub fn has_query_token( text: &str, tokenizer: &mut Box&lt;dyn LanceTokenizer&gt;, query_tokens: &Tokens, ) -&gt; bool` | rust/lance-index/src/scalar/inverted/query.rs:1175-1179 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn fill_fts_query_column( query: &FtsQuery, columns: &[String], replace: bool, ) -&gt; Result&lt;FtsQuery&gt;` | rust/lance-index/src/scalar/inverted/query.rs:1208-1212 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-scorer-rs"></a>

## `rust/lance-index/src/scalar/inverted/scorer.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub trait Scorer: Send + Sync` | rust/lance-index/src/scalar/inverted/scorer.rs:11-11 | No standalone documentation summary; use the family contract and source entry. |
| `pub const K1: f32 = 1.2;` | rust/lance-index/src/scalar/inverted/scorer.rs:73-73 | No standalone documentation summary; use the family contract and source entry. |
| `pub const B: f32 = 0.75;` | rust/lance-index/src/scalar/inverted/scorer.rs:74-74 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct MemBM25Scorer` | rust/lance-index/src/scalar/inverted/scorer.rs:89-89 | No standalone documentation summary; use the family contract and source entry. |
| `pub total_tokens: u64,` | rust/lance-index/src/scalar/inverted/scorer.rs:90-90 | No standalone documentation summary; use the family contract and source entry. |
| `pub num_docs: usize,` | rust/lance-index/src/scalar/inverted/scorer.rs:91-91 | No standalone documentation summary; use the family contract and source entry. |
| `pub token_docs: HashMap&lt;String, usize&gt;,` | rust/lance-index/src/scalar/inverted/scorer.rs:92-92 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(total_tokens: u64, num_docs: usize, token_docs: HashMap&lt;String, usize&gt;) -&gt; Self` | rust/lance-index/src/scalar/inverted/scorer.rs:96-96 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn update(&mut self, doc_token_count: &HashMap&lt;String, usize&gt;, num_tokens: u64)` | rust/lance-index/src/scalar/inverted/scorer.rs:109-109 | Incremental update bm25 scorer with one new document. |
| `pub fn num_docs(&self) -&gt; usize` | rust/lance-index/src/scalar/inverted/scorer.rs:123-123 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn avg_doc_length(&self) -&gt; f32` | rust/lance-index/src/scalar/inverted/scorer.rs:127-127 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn num_docs_containing_token(&self, token: &str) -&gt; usize` | rust/lance-index/src/scalar/inverted/scorer.rs:131-131 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct IndexBM25Scorer&lt;'a&gt;` | rust/lance-index/src/scalar/inverted/scorer.rs:166-166 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(partitions: impl Iterator&lt;Item = &'a InvertedPartition&gt;) -&gt; Self` | rust/lance-index/src/scalar/inverted/scorer.rs:175-175 | Sync constructor. Query setup populates immutable partition stats before entering the CPU-only WAND executor. |
| `pub fn num_docs_containing_token(&self, token: &str) -&gt; usize` | rust/lance-index/src/scalar/inverted/scorer.rs:195-195 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn idf(token_docs: usize, num_docs: usize) -&gt; f32` | rust/lance-index/src/scalar/inverted/scorer.rs:237-237 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct CombinedFieldsBM25Scorer` | rust/lance-index/src/scalar/inverted/scorer.rs:259-259 | BM25F scorer over a virtual field formed by combining several columns (Lucene `CombinedFieldQuery` / Elasticsearch `combined_fields`). |
| `pub fn new(doc_count: usize, avg_doc_length: f32, doc_freq: HashMap&lt;String, usize&gt;) -&gt; Self` | rust/lance-index/src/scalar/inverted/scorer.rs:266-266 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn doc_count(&self) -&gt; usize` | rust/lance-index/src/scalar/inverted/scorer.rs:274-274 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn avg_doc_length(&self) -&gt; f32` | rust/lance-index/src/scalar/inverted/scorer.rs:278-278 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn query_weight(&self, term: &str) -&gt; f32` | rust/lance-index/src/scalar/inverted/scorer.rs:288-288 | Blended IDF for `term` over the virtual field. Returns `0.0` for a term absent from every target column (`docFreq' == 0`), and for the inconsistent statistics (`docFreq' &gt; docCount'`) that drive `idf` negative or, once `docFreq'` is large enough for the ratio to round to `-1`, to `-inf`. A `-inf` weight times a zero document weight is `NaN`; see [`Self::doc_weight`] for why no score may be non-finite. |
| `pub fn doc_weight(&self, tf_prime: f32, dl_prime: f32) -&gt; f32` | rust/lance-index/src/scalar/inverted/scorer.rs:314-314 | BM25 term contribution for a document, given the blended term frequency `tf'` and blended document length `dl'`. |

<a id="source-rust-lance-index-src-scalar-inverted-tokenizer-rs"></a>

## `rust/lance-index/src/scalar/inverted/tokenizer.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod document_tokenizer;` | rust/lance-index/src/scalar/inverted/tokenizer.rs:11-11 | No standalone documentation summary; use the family contract and source entry. |
| `pub use lance_tokenizer::Language;` | rust/lance-index/src/scalar/inverted/tokenizer.rs:30-30 | No standalone documentation summary; use the family contract and source entry. |
| `pub const LEGACY_BLOCK_SIZE: usize = 128;` | rust/lance-index/src/scalar/inverted/tokenizer.rs:40-40 | Posting block size for indexes whose metadata predates configurable block sizes. |
| `pub const DEFAULT_BLOCK_SIZE: usize = 128;` | rust/lance-index/src/scalar/inverted/tokenizer.rs:44-44 | Default posting block size for newly created indexes when none is configured. |
| `pub const VALID_BLOCK_SIZES: [usize; 2] = [128, 256];` | rust/lance-index/src/scalar/inverted/tokenizer.rs:45-45 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum DocumentGranularity` | rust/lance-index/src/scalar/inverted/tokenizer.rs:51-51 | The unit treated as one logical full-text-search document. |
| `pub fn is_list_element(self) -&gt; bool` | rust/lance-index/src/scalar/inverted/tokenizer.rs:61-61 | Whether results identify a list element within the dataset row. |
| `pub struct InvertedIndexParams` | rust/lance-index/src/scalar/inverted/tokenizer.rs:105-105 | Tokenizer configs |
| `pub fn validate_block_size(block_size: usize) -&gt; Result&lt;usize&gt;` | rust/lance-index/src/scalar/inverted/tokenizer.rs:529-529 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(base_tokenizer: String, language: Language) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:634-634 | Create a new `InvertedIndexParams` with the given base tokenizer and language. |
| `pub fn code() -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:707-707 | Create parameters for the code analyzer profile. |
| `pub fn analyzer(mut self, analyzer: &str) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/inverted/tokenizer.rs:727-727 | Apply an analyzer profile to the concrete tokenizer parameters. |
| `pub fn lance_tokenizer(mut self, lance_tokenizer: String) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:795-795 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn document_granularity(mut self, document_granularity: DocumentGranularity) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:801-801 | Set the logical FTS document boundary. |
| `pub fn get_document_granularity(&self) -&gt; DocumentGranularity` | rust/lance-index/src/scalar/inverted/tokenizer.rs:807-807 | Return the logical FTS document boundary. |
| `pub fn base_tokenizer(mut self, base_tokenizer: String) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:827-827 | Set the lexical tokenizer implementation. |
| `pub fn language(mut self, language: &str) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/inverted/tokenizer.rs:837-837 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_position(mut self, with_position: bool) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:849-849 | Set whether to store the position of the term in the document. This can significantly increase the size of the index. If false, only store the frequency of the term in the document. This doesn't work with `ngram` tokenizer. Default to `false`. |
| `pub fn has_positions(&self) -&gt; bool` | rust/lance-index/src/scalar/inverted/tokenizer.rs:855-855 | Get whether positions are stored in this index. |
| `pub fn max_token_length(mut self, max_token_length: Option&lt;usize&gt;) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:859-859 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn lower_case(mut self, lower_case: bool) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:864-864 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn stem(mut self, stem: bool) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:869-869 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn remove_stop_words(mut self, remove_stop_words: bool) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:874-874 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn custom_stop_words(mut self, custom_stop_words: Option&lt;Vec&lt;String&gt;&gt;) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:879-879 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn ascii_folding(mut self, ascii_folding: bool) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:884-884 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn split_identifiers(mut self, split_identifiers: bool) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:903-903 | Set whether code identifiers are split into subwords. |
| `pub fn split_on_numerics(mut self, split_on_numerics: bool) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:909-909 | Set whether identifier subwords are split at letter/number boundaries. |
| `pub fn preserve_original(mut self, preserve_original: bool) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:915-915 | Set whether the complete identifier is indexed alongside subwords. |
| `pub fn index_operators(mut self, index_operators: bool) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:921-921 | Set whether operator tokens such as `::`, `-&gt;`, and `!=` are indexed. |
| `pub fn ngram_min_length(mut self, min_length: u32) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:929-929 | Set the minimum N-Gram length, only works when `base_tokenizer` is `ngram`. Must be greater than 0 and not greater than `max_ngram_length`. Default to 3. |
| `pub fn ngram_max_length(mut self, max_length: u32) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:937-937 | Set the maximum N-Gram length, only works when `base_tokenizer` is `ngram`. Must be greater than 0 and not less than `min_ngram_length`. Default to 3. |
| `pub fn ngram_prefix_only(mut self, prefix_only: bool) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:944-944 | Set whether only prefix N-Gram is generated, only works when `base_tokenizer` is `ngram`. Default to `false`. |
| `pub fn block_size(mut self, block_size: usize) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/inverted/tokenizer.rs:956-956 | Set the compressed posting block size. |
| `pub fn posting_block_size(&self) -&gt; usize` | rust/lance-index/src/scalar/inverted/tokenizer.rs:964-964 | Get the compressed posting block size. |
| `pub fn memory_limit_mb(mut self, memory_limit_mb: u64) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:968-968 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn num_workers(mut self, num_workers: usize) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:977-977 | Set the number of workers to use for this build. |
| `pub fn format_version(mut self, format_version: InvertedListFormatVersion) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer.rs:989-989 | Set the on-disk FTS format version to use when creating a new index. |
| `pub fn resolved_format_version(&self) -&gt; InvertedListFormatVersion` | rust/lance-index/src/scalar/inverted/tokenizer.rs:996-996 | Resolve the requested FTS format version, falling back to the default for the configured analyzer and block size. |
| `pub fn validate_format_version(&self) -&gt; Result&lt;()&gt;` | rust/lance-index/src/scalar/inverted/tokenizer.rs:1009-1009 | Validate that the requested FTS format version can safely encode the configured posting block size. |
| `pub fn to_training_json(&self) -&gt; serde_json::Result&lt;serde_json::Value&gt;` | rust/lance-index/src/scalar/inverted/tokenizer.rs:1035-1035 | Serialize params for the build/training path, including build-only fields. |
| `pub fn build(&self) -&gt; Result&lt;Box&lt;dyn LanceTokenizer&gt;&gt;` | rust/lance-index/src/scalar/inverted/tokenizer.rs:1079-1079 | No standalone documentation summary; use the family contract and source entry. |
| `pub const LANCE_LANGUAGE_MODEL_HOME_ENV_KEY: &str = "LANCE_LANGUAGE_MODEL_HOME";` | rust/lance-index/src/scalar/inverted/tokenizer.rs:1198-1198 | No standalone documentation summary; use the family contract and source entry. |
| `pub const LANCE_LANGUAGE_MODEL_DEFAULT_DIRECTORY: &str = "lance/language_models";` | rust/lance-index/src/scalar/inverted/tokenizer.rs:1200-1200 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn language_model_home() -&gt; Option&lt;PathBuf&gt;` | rust/lance-index/src/scalar/inverted/tokenizer.rs:1202-1202 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-tokenizer-document-tokenizer-rs"></a>

## `rust/lance-index/src/scalar/inverted/tokenizer/document_tokenizer.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub enum DocType` | rust/lance-index/src/scalar/inverted/tokenizer/document_tokenizer.rs:11-11 | Document type for full text search. |
| `pub fn prefix_len(&self, token: &str) -&gt; usize` | rust/lance-index/src/scalar/inverted/tokenizer/document_tokenizer.rs:51-51 | Get the length of the prefix before value. - JSON Token: path,type,value - Text Token: value |
| `pub trait LanceTokenizer: Send + Sync + std::fmt::Debug` | rust/lance-index/src/scalar/inverted/tokenizer/document_tokenizer.rs:73-73 | Lance full text search tokenizer. |
| `pub struct TextTokenizer` | rust/lance-index/src/scalar/inverted/tokenizer/document_tokenizer.rs:91-91 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(tokenizer: TextAnalyzer) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer/document_tokenizer.rs:102-102 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct JsonTokenizer` | rust/lance-index/src/scalar/inverted/tokenizer/document_tokenizer.rs:126-126 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(tokenizer: TextAnalyzer) -&gt; Self` | rust/lance-index/src/scalar/inverted/tokenizer/document_tokenizer.rs:131-131 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-tokenizer-jieba-rs"></a>

## `rust/lance-index/src/scalar/inverted/tokenizer/jieba.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct JiebaConfig` | rust/lance-index/src/scalar/inverted/tokenizer/jieba.rs:11-11 | No standalone documentation summary; use the family contract and source entry. |
| `pub const JIEBA_LANGUAGE_MODEL_CONFIG_FILE: &str = "config.json";` | rust/lance-index/src/scalar/inverted/tokenizer/jieba.rs:16-16 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait JiebaTokenizerBuilder: Sized` | rust/lance-index/src/scalar/inverted/tokenizer/jieba.rs:18-18 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct JiebaBuilder` | rust/lance-index/src/scalar/inverted/tokenizer/jieba.rs:44-44 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-tokenizer-lindera-rs"></a>

## `rust/lance-index/src/scalar/inverted/tokenizer/lindera.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const LINDERA_LANGUAGE_MODEL_CONFIG_FILE: &str = "config.yml";` | rust/lance-index/src/scalar/inverted/tokenizer/lindera.rs:9-9 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait LinderaTokenizerBuilder: Sized` | rust/lance-index/src/scalar/inverted/tokenizer/lindera.rs:11-11 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct LinderaBuilder` | rust/lance-index/src/scalar/inverted/tokenizer/lindera.rs:28-28 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-inverted-wand-rs"></a>

## `rust/lance-index/src/scalar/inverted/wand.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct SharedNormAddends(Arc&lt;OnceLock&lt;Option&lt;Arc&lt;[f32; 256]&gt;&gt;&gt;&gt;);` | rust/lance-index/src/scalar/inverted/wand.rs:68-68 | Norm-code BM25 denominator addends (Lucene's norm cache) computed once for every partition a query searches with the same scorer. Each partition otherwise rebuilds the same 256 entries for its first scored window. |
| `pub static FLAT_SEARCH_PERCENT_THRESHOLD: LazyLock&lt;u64&gt; = LazyLock::new(\|\|` | rust/lance-index/src/scalar/inverted/wand.rs:239-239 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct PostingIterator` | rust/lance-index/src/scalar/inverted/wand.rs:464-464 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct DocCandidate&lt;C&gt;` | rust/lance-index/src/scalar/inverted/wand.rs:1993-1993 | No standalone documentation summary; use the family contract and source entry. |
| `pub document: C,` | rust/lance-index/src/scalar/inverted/wand.rs:1994-1994 | No standalone documentation summary; use the family contract and source entry. |
| `pub posting_doc_id: u64,` | rust/lance-index/src/scalar/inverted/wand.rs:1997-1997 | The document key used by the posting lists: doc_id for compressed postings, row_id for legacy plain postings. |
| `pub freqs: Vec&lt;(u32, u32)&gt;,` | rust/lance-index/src/scalar/inverted/wand.rs:1999-1999 | (term_index, freq) |
| `pub doc_length: u32,` | rust/lance-index/src/scalar/inverted/wand.rs:2000-2000 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct Wand&lt;'a, S: Scorer, D: WandDocuments&gt;` | rust/lance-index/src/scalar/inverted/wand.rs:2422-2422 | No standalone documentation summary; use the family contract and source entry. |
| `pub position_in_query: i32,` | rust/lance-index/src/scalar/inverted/wand.rs:5965-5965 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-json-rs"></a>

## `rust/lance-index/src/scalar/json.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct JsonIndex` | rust/lance-index/src/scalar/json.rs:59-59 | A JSON index that indexes a field in a JSON column |
| `pub fn new(target_index: Arc&lt;dyn ScalarIndex&gt;, path: String) -&gt; Self` | rust/lance-index/src/scalar/json.rs:65-65 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct JsonIndexParameters` | rust/lance-index/src/scalar/json.rs:241-241 | Parameters for a [`JsonIndex`] |
| `pub struct JsonQuery` | rust/lance-index/src/scalar/json.rs:293-293 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(target_query: Arc&lt;dyn AnyQuery&gt;, path: String) -&gt; Self` | rust/lance-index/src/scalar/json.rs:299-299 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct JsonQueryParser` | rust/lance-index/src/scalar/json.rs:332-332 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(path: String, target_parser: Box&lt;dyn ScalarQueryParser&gt;) -&gt; Self` | rust/lance-index/src/scalar/json.rs:338-338 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct JsonTrainingRequest` | rust/lance-index/src/scalar/json.rs:460-460 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(parameters: JsonIndexParameters, target_request: Box&lt;dyn TrainingRequest&gt;) -&gt; Self` | rust/lance-index/src/scalar/json.rs:477-477 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct JsonIndexPlugin` | rust/lance-index/src/scalar/json.rs:499-499 | Plugin implementation for a [`JsonIndex`] |


<a id="source-rust-lance-index-src-scalar-label-list-rs"></a>

## `rust/lance-index/src/scalar/label_list.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const BITMAP_LOOKUP_NAME: &str = "bitmap_page_lookup.lance";` | rust/lance-index/src/scalar/label_list.rs:62-62 | No standalone documentation summary; use the family contract and source entry. |
| `pub const LABEL_LIST_NULLS_METADATA_KEY: &str = "lance:label_list_nulls";` | rust/lance-index/src/scalar/label_list.rs:63-63 | No standalone documentation summary; use the family contract and source entry. |
| `pub const LABEL_LIST_NULLS_MIN_VERSION: i32 = 1;` | rust/lance-index/src/scalar/label_list.rs:64-64 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct LabelListIndex` | rust/lance-index/src/scalar/label_list.rs:95-95 | A scalar index that can be used on `List&lt;T&gt;` columns to accelerate list membership filters such as `array_has_all`, `array_has_any`, and `array_has` / `array_contains`, using an underlying bitmap index. |
| `pub async fn merge_label_list_indices( source_indices: &[Arc&lt;LabelListIndex&gt;], dest_store: &dyn IndexStore, old_data_filter: Option&lt;OldIndexDataFilter&gt;, progress: Arc&lt;dyn crate::progress::IndexBuildProgress&gt;, ) -&gt; Result&lt;CreatedIndex&gt;` | rust/lance-index/src/scalar/label_list.rs:761-766 | Merge multiple LabelList index segments into a single index. |
| `pub struct LabelListIndexState` | rust/lance-index/src/scalar/label_list.rs:847-847 | The serializable state of a [`LabelListIndex`]. |
| `pub struct LabelListIndexPlugin;` | rust/lance-index/src/scalar/label_list.rs:953-953 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-lance-format-rs"></a>

## `rust/lance-index/src/scalar/lance_format.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct LanceIndexStore` | rust/lance-index/src/scalar/lance_format.rs:72-72 | An index store that serializes scalar indices using the lance format |
| `pub fn new( object_store: Arc&lt;ObjectStore&gt;, index_dir: Path, metadata_cache: Arc&lt;LanceCache&gt;, ) -&gt; Self` | rust/lance-index/src/scalar/lance_format.rs:100-104 | Create a new index store at the given directory |
| `pub fn with_format_version( object_store: Arc&lt;ObjectStore&gt;, index_dir: Path, metadata_cache: Arc&lt;LanceCache&gt;, format_version: ConcreteFileVersion, ) -&gt; Self` | rust/lance-index/src/scalar/lance_format.rs:114-119 | Create a new index store at the given directory with a specific format version |
| `pub fn with_file_sizes(mut self, file_sizes: HashMap&lt;String, u64&gt;) -&gt; Self` | rust/lance-index/src/scalar/lance_format.rs:139-139 | Set cached file sizes to avoid HEAD calls when opening files. |
| `pub fn io_priority(&self) -&gt; u64` | rust/lance-index/src/scalar/lance_format.rs:145-145 | The base I/O priority all this store's requests are submitted at. |

<a id="source-rust-lance-index-src-scalar-minhash-lsh-builder-rs"></a>

## `rust/lance-index/src/scalar/minhash_lsh/builder.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub reader: Arc&lt;dyn IndexReader&gt;,` | rust/lance-index/src/scalar/minhash_lsh/builder.rs:130-130 | No standalone documentation summary; use the family contract and source entry. |
| `pub num_docs: usize,` | rust/lance-index/src/scalar/minhash_lsh/builder.rs:131-131 | No standalone documentation summary; use the family contract and source entry. |
| `pub frag_reuse_index: Option&lt;Arc&lt;dyn RowIdRemapper&gt;&gt;,` | rust/lance-index/src/scalar/minhash_lsh/builder.rs:134-134 | The deferred compactions the segment was opened with; see [`RowIdTransform::apply`]. |
| `pub transform: RowIdTransform&lt;'a&gt;,` | rust/lance-index/src/scalar/minhash_lsh/builder.rs:135-135 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct MinHashLshIndexBuilder` | rust/lance-index/src/scalar/minhash_lsh/builder.rs:753-753 | Builds the two index files from a stream of `value` (text) and `_rowid` batches. |
| `pub fn try_new(params: MinHashLshIndexParams) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/minhash_lsh/builder.rs:768-768 | A builder with the memory budget and the temporary disk limit of the DataFusion-backed index builds (`LANCE_MEM_POOL_SIZE`, `LANCE_MAX_TEMP_DIRECTORY_SIZE`). |
| `pub fn params(&self) -&gt; &MinHashLshIndexParams` | rust/lance-index/src/scalar/minhash_lsh/builder.rs:791-791 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_page_rows(mut self, page_rows: usize) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/minhash_lsh/builder.rs:797-797 | Rows per logical page of `bands.lance`; exposed so tests can force multi-page layouts with small inputs. |
| `pub fn with_sort_run_records(mut self, sort_run_records: usize) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/minhash_lsh/builder.rs:808-808 | Records per in-memory sort run; exposed so tests can force spilling. |
| `pub fn with_merge_group_records(mut self, merge_group_records: usize) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/minhash_lsh/builder.rs:820-820 | Records per merge group; exposed so tests can force streaming merges with small inputs. |
| `pub fn with_spill_limit_bytes(mut self, bytes: u64) -&gt; Self` | rust/lance-index/src/scalar/minhash_lsh/builder.rs:832-832 | Bound the temporary disk space of the build; a build that would exceed it fails before writing the spill that crosses the limit. |
| `pub async fn train( &self, data: SendableRecordBatchStream, store: &dyn IndexStore, ) -&gt; Result&lt;Vec&lt;IndexFile&gt;&gt;` | rust/lance-index/src/scalar/minhash_lsh/builder.rs:839-843 | Build the index files from a stream of `value` (text) and `_rowid` batches. |

<a id="source-rust-lance-index-src-scalar-minhash-lsh-index-rs"></a>

## `rust/lance-index/src/scalar/minhash_lsh/index.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct MinHashLshIndex` | rust/lance-index/src/scalar/minhash_lsh/index.rs:105-105 | A single segment of a MinHash LSH index. |
| `pub async fn load( store: Arc&lt;dyn IndexStore&gt;, details: &prost_types::Any, frag_reuse_index: Option&lt;Arc&lt;dyn RowIdRemapper&gt;&gt;, cache: &LanceCache, ) -&gt; Result&lt;Arc&lt;Self&gt;&gt;` | rust/lance-index/src/scalar/minhash_lsh/index.rs:188-193 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn params(&self) -&gt; &MinHashLshIndexParams` | rust/lance-index/src/scalar/minhash_lsh/index.rs:271-271 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn num_docs(&self) -&gt; usize` | rust/lance-index/src/scalar/minhash_lsh/index.rs:276-276 | Number of documents (rows with at least one token) in this segment. |
| `pub fn query_signature(&self, text: &str) -&gt; Option&lt;QuerySignature&gt;` | rust/lance-index/src/scalar/minhash_lsh/index.rs:304-304 | Signature and band keys of `text`, or `None` when the text has no tokens and therefore matches nothing. |
| `pub async fn search_text( &self, text: &str, limit: usize, mask: &RowAddrMask, metrics: &dyn MetricsCollector, ) -&gt; Result&lt;Vec&lt;MinHashHit&gt;&gt;` | rust/lance-index/src/scalar/minhash_lsh/index.rs:311-317 | Return the `limit` rows with the smallest Jaccard distance to `text` among rows selected by `mask`, ordered by ascending distance and then row id. Which rows are returned among equal distances is not specified. |
| `pub async fn search_signature( &self, query: &QuerySignature, limit: usize, mask: &RowAddrMask, metrics: &dyn MetricsCollector, ) -&gt; Result&lt;Vec&lt;MinHashHit&gt;&gt;` | rust/lance-index/src/scalar/minhash_lsh/index.rs:326-332 | Like [`Self::search_text`] for a signature computed by [`Self::query_signature`] on any segment with the same parameters. |
| `pub async fn merge_minhash_indices( sources: &[(&MinHashLshIndex, Option&lt;&OldIndexDataFilter&gt;)], dest_store: &dyn IndexStore, ) -&gt; Result&lt;CreatedIndex&gt;` | rust/lance-index/src/scalar/minhash_lsh/index.rs:1319-1322 | Merge segments into one new segment in `dest_store`, keeping only the rows each segment's filter selects. Every segment must have been built with the same parameters. |

<a id="source-rust-lance-index-src-scalar-minhash-lsh-mod-rs"></a>

## `rust/lance-index/src/scalar/minhash_lsh/mod.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use builder::MinHashLshIndexBuilder;` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:51-51 | No standalone documentation summary; use the family contract and source entry. |
| `pub use index::` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:52-52 | No standalone documentation summary; use the family contract and source entry. |
| `pub const MINHASH_LSH_INDEX_VERSION: u32 = 0;` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:110-110 | On-disk format version of the index files. The format is unstable; bump on any layout change instead of adding compatibility paths. |
| `pub const SIGNATURE_VERSION: u32 = 0;` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:115-115 | Version of the signature generation behavior (the token streams of the tokenizers that ship with Lance, shingle hashing, permutation family, the 16-bit compression and the band keys); bumped whenever a change would make old and new signatures incomparable. |
| `pub type SignatureValue = u16;` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:129-129 | A stored MinHash value: the 64-bit permuted minimum compressed to 16 bits by multiply-shift hashing (b-bit MinHash). A minimum is not uniformly distributed (it shrinks as the set grows), so its bits cannot be stored directly; multiply-shift with a random odd multiplier is 2-universal, so two unrelated documents agree on a stored value with probability at most 2^-15 whatever their length, far below the 1/num_hashes resolution of the Jaccard estimate. |
| `pub const SIGNATURES_FILENAME: &str = "signatures.lance";` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:131-131 | No standalone documentation summary; use the family contract and source entry. |
| `pub const BANDS_FILENAME: &str = "bands.lance";` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:132-132 | No standalone documentation summary; use the family contract and source entry. |
| `pub const SIGNATURE_COL: &str = "signature";` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:133-133 | No standalone documentation summary; use the family contract and source entry. |
| `pub const BAND_KEY_COL: &str = "band_key";` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:134-134 | No standalone documentation summary; use the family contract and source entry. |
| `pub const DOC_ID_COL: &str = "doc_id";` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:135-135 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct MinHashQuery` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:254-254 | A MinHash similarity search: the rows of `column` whose token shingles have the highest estimated Jaccard similarity to `text`. |
| `pub column: String,` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:256-256 | Column with a MinHash LSH index. |
| `pub text: String,` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:258-258 | Query text, tokenized and shingled exactly like the indexed rows. |
| `pub fn new(text: impl Into&lt;String&gt;, column: impl Into&lt;String&gt;) -&gt; Self` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:262-262 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct MinHashLshIndexParams` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:276-276 | Parameters of a MinHash LSH index. |
| `pub num_hashes: u32,` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:279-279 | Number of MinHash values per signature (k), in `[1, 4096]` and a multiple of `num_bands`. The Jaccard estimate has error ~1/sqrt(k). |
| `pub num_bands: u32,` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:282-282 | Number of LSH bands (b), in `[1, 256]`. Two rows become candidates when all `num_hashes / num_bands` values of at least one band agree. |
| `pub shingle_size: u32,` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:285-285 | Number of consecutive tokens joined into one shingle. Documents shorter than this produce a single shingle of all their tokens. |
| `pub tokenizer: InvertedIndexParams,` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:290-290 | Tokenizer configuration, using the same keys as the inverted (full text search) index. Defaults to lower-casing without stemming or stop word removal: aggressive normalization inflates Jaccard similarity and turns "related" into "duplicate". |
| `pub fn from_json(params: &str) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:320-320 | Parse user parameters from JSON, filling omitted keys with defaults and validating the result. |
| `pub fn from_details_any(details: &prost_types::Any) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:467-467 | Parse the details stored in the index metadata. |
| `pub struct SignatureGenerator` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:502-502 | Computes signatures and band keys. Cloned per batch during builds and per query during searches; the build and query side must share this code path so signatures stay comparable. |
| `pub fn try_new(params: &MinHashLshIndexParams) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:521-521 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn num_hashes(&self) -&gt; usize` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:547-547 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn num_bands(&self) -&gt; usize` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:551-551 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn signature(&mut self, text: &str, signature: &mut [SignatureValue]) -&gt; bool` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:558-558 | Fill `signature` (length `num_hashes`) with the MinHash signature of `text`. Returns false, leaving `signature` unspecified, when the text has no tokens and therefore no signature. |
| `pub fn band_keys(&self, signature: &[SignatureValue], keys: &mut Vec&lt;u64&gt;)` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:625-625 | Append the `num_bands` band keys of `signature` to `keys`. |
| `pub fn estimate_jaccard(a: &[SignatureValue], b: &[SignatureValue]) -&gt; f32` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:641-641 | Estimated Jaccard similarity of two signatures: the fraction of positions whose MinHash values agree. |
| `pub struct QuerySignature` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:666-666 | A query's signature and band keys, computed once and searched against every segment of a logical index. |
| `pub fn compute(generator: &mut SignatureGenerator, text: &str) -&gt; Option&lt;Self&gt;` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:674-674 | Compute the query signature with `generator`, or `None` when the text has no tokens. |
| `pub fn signature(&self) -&gt; &[SignatureValue]` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:687-687 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn shares_band( &self, generator: &SignatureGenerator, signature: &[SignatureValue], scratch: &mut Vec&lt;u64&gt;, ) -&gt; bool` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:694-699 | Whether a row signature shares at least one band with the query: the candidate test the index applies, so rows scored without the index (unindexed fragments) follow the same rule. |
| `pub struct MinHashHit` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:712-712 | One search hit: its Jaccard distance (`1 - estimated Jaccard`) and row id, ordered by distance and then row id. |
| `pub distance: OrderedFloat,` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:713-713 | No standalone documentation summary; use the family contract and source entry. |
| `pub row_id: u64,` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:714-714 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct TopHits` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:718-718 | Bounded collection of the `limit` best (smallest distance) hits. |
| `pub fn new(limit: usize) -&gt; Self` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:724-724 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn push(&mut self, hit: MinHashHit)` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:731-731 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn missing(&self) -&gt; usize` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:744-744 | Hits still missing to hold `limit` of them. |
| `pub fn cutoff(&self) -&gt; Option&lt;f32&gt;` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:749-749 | The distance a new hit must beat, once `limit` hits are held. |
| `pub fn into_sorted(self) -&gt; Vec&lt;MinHashHit&gt;` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:757-757 | Hits ordered by ascending distance, ties broken by row id. |
| `pub struct MinHashLshIndexPlugin;` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:771-771 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct MinHashLshTrainingRequest` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:774-774 | No standalone documentation summary; use the family contract and source entry. |
| `pub params: MinHashLshIndexParams,` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:775-775 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(params: MinHashLshIndexParams) -&gt; Self` | rust/lance-index/src/scalar/minhash_lsh/mod.rs:780-780 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-ngram-rs"></a>

## `rust/lance-index/src/scalar/ngram.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const POSTINGS_FILENAME: &str = "ngram_postings.lance";` | rust/lance-index/src/scalar/ngram.rs:65-65 | No standalone documentation summary; use the family contract and source entry. |
| `pub static TOKENS_FIELD: LazyLock&lt;Field&gt; = LazyLock::new(\|\| Field::new(TOKENS_COL, DataType::UInt32, true));` | rust/lance-index/src/scalar/ngram.rs:76-77 | No standalone documentation summary; use the family contract and source entry. |
| `pub static POSTINGS_FIELD: LazyLock&lt;Field&gt; = LazyLock::new(\|\|` | rust/lance-index/src/scalar/ngram.rs:78-78 | No standalone documentation summary; use the family contract and source entry. |
| `pub static POSTINGS_SCHEMA: LazyLock&lt;SchemaRef&gt; = LazyLock::new(\|\|` | rust/lance-index/src/scalar/ngram.rs:84-84 | No standalone documentation summary; use the family contract and source entry. |
| `pub static TEXT_PREPPER: LazyLock&lt;TextAnalyzer&gt; = LazyLock::new(\|\|` | rust/lance-index/src/scalar/ngram.rs:90-90 | No standalone documentation summary; use the family contract and source entry. |
| `pub static NGRAM_TOKENIZER: LazyLock&lt;TextAnalyzer&gt; = LazyLock::new(\|\|` | rust/lance-index/src/scalar/ngram.rs:97-97 | Currently we ALWAYS use trigrams with ascii folding and lower casing. We may want to make this configurable in the future. |
| `pub struct NGramPostingList` | rust/lance-index/src/scalar/ngram.rs:180-180 | The row ids that contain a given ngram |
| `pub struct NGramPostingListKey` | rust/lance-index/src/scalar/ngram.rs:192-192 | No standalone documentation summary; use the family contract and source entry. |
| `pub row_offset: u32,` | rust/lance-index/src/scalar/ngram.rs:193-193 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn ngram_list( &self, row_offset: u32, metrics: &dyn MetricsCollector, ) -&gt; Result&lt;Arc&lt;NGramPostingList&gt;&gt;` | rust/lance-index/src/scalar/ngram.rs:279-283 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct NGramIndex` | rust/lance-index/src/scalar/ngram.rs:324-324 | An ngram index |
| `pub async fn merge_segments( segment_stores: &[Arc&lt;dyn IndexStore&gt;], new_data: Option&lt;SendableRecordBatchStream&gt;, dest_store: &dyn IndexStore, old_data_filters: &[Option&lt;super::OldIndexDataFilter&gt;], frag_reuse_index: Option&lt;Arc&lt;FragReuseIndex&gt;&gt;, ) -&gt; Result&lt;CreatedIndex&gt;` | rust/lance-index/src/scalar/ngram.rs:477-483 | Merge several built NGram segments (and optional new data) into a single canonical segment in `dest_store`, unioning their posting lists by token without rescanning the dataset. |
| `pub async fn merge_segments_with_remapper( segment_stores: &[Arc&lt;dyn IndexStore&gt;], new_data: Option&lt;SendableRecordBatchStream&gt;, dest_store: &dyn IndexStore, old_data_filters: &[Option&lt;super::OldIndexDataFilter&gt;], frag_reuse_index: Option&lt;Arc&lt;dyn RowIdRemapper&gt;&gt;, ) -&gt; Result&lt;CreatedIndex&gt;` | rust/lance-index/src/scalar/ngram.rs:497-503 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct NGramIndexBuilderOptions` | rust/lance-index/src/scalar/ngram.rs:750-750 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct NGramIndexBuilder` | rust/lance-index/src/scalar/ngram.rs:1085-1085 | A builder for an ngram index |
| `pub fn try_new(options: NGramIndexBuilderOptions) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/ngram.rs:1102-1102 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn train(&mut self, data: SendableRecordBatchStream) -&gt; Result&lt;Vec&lt;usize&gt;&gt;` | rust/lance-index/src/scalar/ngram.rs:1281-1281 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn write_index( mut self, store: &dyn IndexStore, spill_files: Vec&lt;usize&gt;, old_index: Option&lt;Arc&lt;dyn IndexStore&gt;&gt;, ) -&gt; Result&lt;IndexFile&gt;` | rust/lance-index/src/scalar/ngram.rs:1629-1634 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct NGramIndexPlugin;` | rust/lance-index/src/scalar/ngram.rs:1788-1788 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn train_ngram_index( batches_source: SendableRecordBatchStream, index_store: &dyn IndexStore, ) -&gt; Result&lt;IndexFile&gt;` | rust/lance-index/src/scalar/ngram.rs:1791-1794 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-ngram-ngram-regex-rs"></a>

## `rust/lance-index/src/scalar/ngram/ngram_regex.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub enum TrigramQuery` | rust/lance-index/src/scalar/ngram/ngram_regex.rs:56-56 | A boolean condition over trigram presence that is *necessary* for a regex to match. `All` means "no constraint" and `None` means "unsatisfiable"; by construction these only ever appear at the root of the tree. |
| `pub fn regex_to_trigram_query(pattern: &str) -&gt; TrigramQuery` | rust/lance-index/src/scalar/ngram/ngram_regex.rs:432-432 | Derive a necessary trigram condition from a regular expression pattern. |
| `pub fn regex_can_use_index(pattern: &str) -&gt; bool` | rust/lance-index/src/scalar/ngram/ngram_regex.rs:457-457 | Whether a regular expression yields any trigram condition the index can use to prune candidates. When it does not (e.g. `a.b`, `.*`, or a case-insensitive pattern), callers should leave the predicate to a full scan rather than route it to the index, which would otherwise have to ask the scan to recheck every row -- a path the index result type (`AtLeast`) does not support. |
| `pub fn collect_tokens(query: &TrigramQuery, out: &mut HashSet&lt;u32&gt;)` | rust/lance-index/src/scalar/ngram/ngram_regex.rs:462-462 | Collect the distinct trigram tokens referenced anywhere in the tree. |
| `pub fn eval_trigram_query( query: &TrigramQuery, bitmaps: &HashMap&lt;u32, RoaringTreemap&gt;, ) -&gt; RoaringTreemap` | rust/lance-index/src/scalar/ngram/ngram_regex.rs:480-483 | Evaluate the tree against a map of `trigram token -&gt; posting list`. A token missing from the map contributes an empty set (sound: a required trigram that is absent everywhere yields no rows; an absent OR branch contributes nothing). `All` / `None` are handled by the caller before evaluation. |

<a id="source-rust-lance-index-src-scalar-registry-rs"></a>

## `rust/lance-index/src/scalar/registry.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use crate::scalar::` | rust/lance-index/src/scalar/registry.rs:25-25 | No standalone documentation summary; use the family contract and source entry. |
| `pub const VALUE_COLUMN_NAME: &str = "value";` | rust/lance-index/src/scalar/registry.rs:27-27 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait TrainingRequest: std::any::Any + Send + Sync` | rust/lance-index/src/scalar/registry.rs:35-35 | A trait object for plugin-specific training parameters and data requirements. |
| `pub fn new(criteria: TrainingCriteria) -&gt; Self` | rust/lance-index/src/scalar/registry.rs:46-46 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait BasicTrainer: Send + Sync` | rust/lance-index/src/scalar/registry.rs:72-72 | Implemented by indexes that can train on a stream of column data. |
| `pub trait ScalarIndexPlugin: Send + Sync + std::fmt::Debug` | rust/lance-index/src/scalar/registry.rs:102-102 | A trait for scalar index plugins |
| `pub type ScalarIndexLoad&lt;'a&gt; = BoxFuture&lt;'a, Result&lt;Arc&lt;dyn ScalarIndex&gt;&gt;&gt;;` | rust/lance-index/src/scalar/registry.rs:375-375 | A boxed, `Send` future performing the storage-level load of a scalar index (compat checks, `load_index`, metrics). |
| `pub async fn single_flight_open&lt;K, ToState, FromState&gt;( cache: &LanceCache, state_key: K, load: ScalarIndexLoad&lt;'_&gt;, to_state: ToState, from_state: FromState, ) -&gt; Result&lt;Arc&lt;dyn ScalarIndex&gt;&gt; where K: CacheKey + Send, K::ValueType: DeepSizeOf + Send + Sync + 'static, ToState: FnOnce(&dyn ScalarIndex) -&gt; Result&lt;K::ValueType&gt; + Send, FromState: FnOnce(Arc&lt;K::ValueType&gt;) -&gt; Result&lt;Arc&lt;dyn ScalarIndex&gt;&gt; + Send,` | rust/lance-index/src/scalar/registry.rs:390-402 | Single-flight open helper for plugins with a serializable form. |
| `pub async fn single_flight_store_bound_open&lt;Rebind, RebindFuture&gt;( index_store: Arc&lt;dyn IndexStore&gt;, cache: &LanceCache, load: ScalarIndexLoad&lt;'_&gt;, rebind: Rebind, ) -&gt; Result&lt;Arc&lt;dyn ScalarIndex&gt;&gt; where Rebind: FnOnce(Arc&lt;dyn ScalarIndex&gt;) -&gt; RebindFuture + Send, RebindFuture: Future&lt;Output = Result&lt;Option&lt;Arc&lt;dyn ScalarIndex&gt;&gt;&gt;&gt; + Send,` | rust/lance-index/src/scalar/registry.rs:413-422 | Coalesce index loading, rebinding cached state when supported by the caller. |
| `pub struct StoreBoundScalarIndexCacheEntry` | rust/lance-index/src/scalar/registry.rs:510-510 | A stable cache slot for one live, store-bound scalar index. |
| `pub fn index(&self) -&gt; Arc&lt;dyn ScalarIndex&gt;` | rust/lance-index/src/scalar/registry.rs:544-544 | Return a shared handle to the cached scalar index. |
| `pub struct ScalarIndexCacheKey;` | rust/lance-index/src/scalar/registry.rs:557-557 | In-memory cache key for a live, store-bound scalar index. |

<a id="source-rust-lance-index-src-scalar-rtree-rs"></a>

## `rust/lance-index/src/scalar/rtree.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use lance_geo::bbox::` | rust/lance-index/src/scalar/rtree.rs:40-40 | No standalone documentation summary; use the family contract and source entry. |
| `pub const DEFAULT_RTREE_PAGE_SIZE: u32 = 4096;` | rust/lance-index/src/scalar/rtree.rs:57-57 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct RTreeMetadata` | rust/lance-index/src/scalar/rtree.rs:155-155 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(page_size: u32, num_pages: u64, num_items: usize, bbox: BoundingBox) -&gt; Self` | rust/lance-index/src/scalar/rtree.rs:164-164 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn extract_bounding_boxes( geometry_array: &dyn Array, geometry_field: &ArrowField, ) -&gt; Result&lt;RectArray&gt;` | rust/lance-index/src/scalar/rtree.rs:233-236 | Extract bounding boxes from geometry columns |
| `pub enum RTreeCacheKey` | rust/lance-index/src/scalar/rtree.rs:256-256 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct RTreeCacheValue(Arc&lt;RecordBatch&gt;);` | rust/lance-index/src/scalar/rtree.rs:262-262 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct RTreeIndex` | rust/lance-index/src/scalar/rtree.rs:300-300 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn load( store: Arc&lt;dyn IndexStore&gt;, frag_reuse_index: Option&lt;Arc&lt;dyn RowIdRemapper&gt;&gt;, index_cache: &LanceCache, ) -&gt; Result&lt;Arc&lt;Self&gt;&gt;` | rust/lance-index/src/scalar/rtree.rs:323-327 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn merge_rtree_indices( source_indices: &[Arc&lt;RTreeIndex&gt;], dest_store: &dyn IndexStore, old_data_filters: &[Option&lt;OldIndexDataFilter&gt;], ) -&gt; Result&lt;CreatedIndex&gt;` | rust/lance-index/src/scalar/rtree.rs:586-590 | Merge caller-selected RTree segments into one self-contained segment. |
| `pub page_size: Option&lt;u32&gt;,` | rust/lance-index/src/scalar/rtree.rs:880-880 | The number of rows to include in each page |
| `pub struct RTreeTrainingRequest` | rust/lance-index/src/scalar/rtree.rs:883-883 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct RTreeIndexPlugin;` | rust/lance-index/src/scalar/rtree.rs:916-916 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn write_index( sorted_data: SendableRecordBatchStream, num_items: usize, total_bbox: BoundingBox, store: &dyn IndexStore, page_size: u32, ) -&gt; Result&lt;IndexFile&gt;` | rust/lance-index/src/scalar/rtree.rs:1086-1092 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn write_nulls( store: &dyn IndexStore, null_map: RowAddrTreeMap, ) -&gt; Result&lt;IndexFile&gt;` | rust/lance-index/src/scalar/rtree.rs:1134-1137 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-rtree-sort-rs"></a>

## `rust/lance-index/src/scalar/rtree/sort.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod hilbert_sort;` | rust/lance-index/src/scalar/rtree/sort.rs:8-8 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait Sorter` | rust/lance-index/src/scalar/rtree/sort.rs:11-11 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-rtree-sort-hilbert-sort-rs"></a>

## `rust/lance-index/src/scalar/rtree/sort/hilbert_sort.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct HilbertSorter` | rust/lance-index/src/scalar/rtree/sort/hilbert_sort.rs:28-28 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(bbox: BoundingBox) -&gt; Self` | rust/lance-index/src/scalar/rtree/sort/hilbert_sort.rs:33-33 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-scalar-seed-rs"></a>

## `rust/lance-index/src/scalar/seed.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const SEED_META_KEY_PREFIX: &str = "lance.seed.";` | rust/lance-index/src/scalar/seed.rs:18-18 | Schema metadata key prefix for all seed buffers: `"lance.seed.&lt;column_name&gt;"`. |
| `pub trait IndexSeedWriter: Send + std::fmt::Debug` | rust/lance-index/src/scalar/seed.rs:26-26 | A hook registered during data file writes that observes column values batch by batch, accumulates compact statistics in memory, and serializes them to a byte buffer that is embedded in the data file footer as a global buffer. |
| `pub struct FragmentSeed` | rust/lance-index/src/scalar/seed.rs:51-51 | A pre-harvested seed buffer from a single fragment's data file. |
| `pub fragment_id: u64,` | rust/lance-index/src/scalar/seed.rs:52-52 | No standalone documentation summary; use the family contract and source entry. |
| `pub bytes: Bytes,` | rust/lance-index/src/scalar/seed.rs:53-53 | No standalone documentation summary; use the family contract and source entry. |
| `pub metadata_value: String,` | rust/lance-index/src/scalar/seed.rs:58-58 | The raw value that was stored in the data file's schema metadata under the seed key (i.e. the output of [`IndexSeedWriter::schema_metadata_value`]). Plugins can inspect this to validate that the seed is compatible with the current index configuration before consuming `bytes`. |

<a id="source-rust-lance-index-src-scalar-zoned-rs"></a>

## `rust/lance-index/src/scalar/zoned.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct ZoneBound` | rust/lance-index/src/scalar/zoned.rs:34-34 | Zone bound within a fragment |
| `pub fragment_id: u64,` | rust/lance-index/src/scalar/zoned.rs:35-35 | No standalone documentation summary; use the family contract and source entry. |
| `pub start: u64,` | rust/lance-index/src/scalar/zoned.rs:39-39 | No standalone documentation summary; use the family contract and source entry. |
| `pub length: usize,` | rust/lance-index/src/scalar/zoned.rs:43-43 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait ZoneProcessor` | rust/lance-index/src/scalar/zoned.rs:47-47 | Index-specific logic used while building zones. |
| `pub struct ZoneTrainer&lt;P&gt;` | rust/lance-index/src/scalar/zoned.rs:62-62 | Trainer that handles chunking, fragment boundaries, and zone flushing. |
| `pub fn new(processor: P, zone_capacity: u64) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/zoned.rs:72-72 | Create a new trainer that buffers at most `zone_capacity` rows per zone. |
| `pub async fn train( mut self, stream: SendableRecordBatchStream, ) -&gt; Result&lt;(Vec&lt;P::ZoneStatistics&gt;, RowAddrTreeMap)&gt;` | rust/lance-index/src/scalar/zoned.rs:92-95 | Consume the `_rowaddr`-annotated stream, split it into zones, and let the processor compute zone statistics. |
| `pub fn search_zones&lt;T, F&gt;( zones: &[T], metrics: &dyn crate::metrics::MetricsCollector, mut zone_matches: F, ) -&gt; Result&lt;crate::scalar::SearchResult&gt; where T: AsRef&lt;ZoneBound&gt;, F: FnMut(&T) -&gt; Result&lt;bool&gt;,` | rust/lance-index/src/scalar/zoned.rs:251-259 | Shared search helper that loops over zones, records metrics, and collects row address ranges for matching zones. The result is always returned as `SearchResult::AtMost` because zone-level pruning can only guarantee a superset of the true matches. |
| `pub async fn rebuild_zones&lt;P&gt;( existing: &[P::ZoneStatistics], trainer: ZoneTrainer&lt;P&gt;, stream: SendableRecordBatchStream, ) -&gt; Result&lt;(Vec&lt;P::ZoneStatistics&gt;, RowAddrTreeMap)&gt; where P: ZoneProcessor, P::ZoneStatistics: Clone,` | rust/lance-index/src/scalar/zoned.rs:282-290 | Helper that retrains zones from `stream` and appends them to the existing statistics. Returns the combined zone list and the null-row bitmap for the new data only — callers are responsible for merging with any existing bitmap. |

<a id="source-rust-lance-index-src-scalar-zonemap-rs"></a>

## `rust/lance-index/src/scalar/zonemap.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct ZoneMapIndex` | rust/lance-index/src/scalar/zonemap.rs:111-111 | ZoneMap index At high level it's a columnar database technique for predicate push down and scan pruning. It breaks data into fixed-size chunks called `zones` and store summary statistics(min, max, null_count, nan_count, fragment_id, local_row_offset) for each zone. It enables efficient filtering by skipping zones that do not contain matching values |
| `pub fn rows_per_zone(&self) -&gt; u64` | rust/lance-index/src/scalar/zonemap.rs:151-151 | Returns the rows-per-zone parameter for this index. |
| `pub fn value_range_over&lt;'a&gt;( segments: impl IntoIterator&lt;Item = &'a Self&gt;, ) -&gt; Option&lt;(ScalarValue, ScalarValue)&gt;` | rust/lance-index/src/scalar/zonemap.rs:198-200 | Global `[min, max]` folded across one or more ZoneMap segments (the disjoint per-column segments of a multi-segment index), without a scan. |
| `pub async fn merge_zonemap_indices( source_indices: &[&ZoneMapIndex], dest_store: &dyn IndexStore, fragment_filter: &RoaringBitmap, ) -&gt; Result&lt;CreatedIndex&gt;` | rust/lance-index/src/scalar/zonemap.rs:1042-1046 | Merge caller-selected ZoneMap segments into one self-contained segment. |
| `pub struct ZoneMapIndexBuilderParams` | rust/lance-index/src/scalar/zonemap.rs:1129-1129 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(rows_per_zone: u64) -&gt; Self` | rust/lance-index/src/scalar/zonemap.rs:1157-1157 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn rows_per_zone(&self) -&gt; u64` | rust/lance-index/src/scalar/zonemap.rs:1164-1164 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ZoneMapIndexBuilder` | rust/lance-index/src/scalar/zonemap.rs:1170-1170 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn try_new(options: ZoneMapIndexBuilderParams, items_type: DataType) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/zonemap.rs:1182-1182 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn train(&mut self, batches_source: SendableRecordBatchStream) -&gt; Result&lt;()&gt;` | rust/lance-index/src/scalar/zonemap.rs:1194-1194 | Train the builder using the shared zone trainer. The input stream must contain the value column followed by `_rowaddr`, matching the dataset scan order enforced by the scalar index registry. |
| `pub async fn write_index(self, index_store: &dyn IndexStore) -&gt; Result&lt;Vec&lt;IndexFile&gt;&gt;` | rust/lance-index/src/scalar/zonemap.rs:1259-1259 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ZoneMapIndexPlugin;` | rust/lance-index/src/scalar/zonemap.rs:1444-1444 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ZoneMapIndexTrainingRequest` | rust/lance-index/src/scalar/zonemap.rs:1462-1462 | No standalone documentation summary; use the family contract and source entry. |
| `pub params: ZoneMapIndexBuilderParams,` | rust/lance-index/src/scalar/zonemap.rs:1463-1463 | No standalone documentation summary; use the family contract and source entry. |
| `pub criteria: TrainingCriteria,` | rust/lance-index/src/scalar/zonemap.rs:1464-1464 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(params: ZoneMapIndexBuilderParams) -&gt; Self` | rust/lance-index/src/scalar/zonemap.rs:1468-1468 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ZoneMapSeedWriter` | rust/lance-index/src/scalar/zonemap.rs:1675-1675 | A seed writer that observes column values during data file writes and accumulates zone map statistics for later harvest during index updates. |
| `pub fn new( column_name: impl Into&lt;String&gt;, rows_per_zone: u64, data_type: DataType, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/scalar/zonemap.rs:1689-1693 | Create a new `ZoneMapSeedWriter` for the given column. |


<a id="source-rust-lance-index-src-traits-rs"></a>

## `rust/lance-index/src/traits.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct IndexCriteria&lt;'a&gt;` | rust/lance-index/src/traits.rs:14-14 | A set of criteria used to filter potential indices to use for a query |
| `pub for_column: Option&lt;&'a str&gt;,` | rust/lance-index/src/traits.rs:17-17 | Only consider indices for this column (this also means the index maps to a single column) |
| `pub has_name: Option&lt;&'a str&gt;,` | rust/lance-index/src/traits.rs:19-19 | Only consider indices with this name |
| `pub must_support_fts: bool,` | rust/lance-index/src/traits.rs:21-21 | If true, only consider indices that support FTS |
| `pub fts_document_granularity: Option&lt;DocumentGranularity&gt;,` | rust/lance-index/src/traits.rs:23-23 | Logical FTS document boundary. FTS lookups default to row documents. |
| `pub must_support_exact_equality: bool,` | rust/lance-index/src/traits.rs:25-25 | If true, only consider indices that support exact equality |
| `pub must_support_minhash: bool,` | rust/lance-index/src/traits.rs:27-27 | If true, only consider indices that support MinHash similarity search |
| `pub fn for_column(mut self, column: &'a str) -&gt; Self` | rust/lance-index/src/traits.rs:33-33 | Only consider indices for this column (this also means the index maps to a single column) |
| `pub fn with_name(mut self, name: &'a str) -&gt; Self` | rust/lance-index/src/traits.rs:39-39 | Only consider indices with this name |
| `pub fn supports_fts(mut self) -&gt; Self` | rust/lance-index/src/traits.rs:45-45 | Only consider indices that support FTS |
| `pub fn with_fts_document_granularity( mut self, document_granularity: DocumentGranularity, ) -&gt; Self` | rust/lance-index/src/traits.rs:51-54 | Select an FTS index with the requested logical document boundary. |
| `pub fn supports_exact_equality(mut self) -&gt; Self` | rust/lance-index/src/traits.rs:63-63 | Only consider indices that support exact equality |
| `pub fn supports_minhash(mut self) -&gt; Self` | rust/lance-index/src/traits.rs:69-69 | Only consider MinHash LSH indices |
| `pub type ScalarIndexCriteria&lt;'a&gt; = IndexCriteria&lt;'a&gt;;` | rust/lance-index/src/traits.rs:76-76 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FtsPrewarmOptions` | rust/lance-index/src/traits.rs:81-81 | Options for prewarming an inverted index. |
| `pub with_position: bool,` | rust/lance-index/src/traits.rs:83-83 | If true, prewarm positions along with posting lists. |
| `pub mode: FtsPrewarmMode,` | rust/lance-index/src/traits.rs:86-86 | Controls whether prewarm requires the full requested FTS working set to remain resident when the operation completes. |
| `pub fn new() -&gt; Self` | rust/lance-index/src/traits.rs:90-90 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_position(mut self, with_position: bool) -&gt; Self` | rust/lance-index/src/traits.rs:94-94 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_mode(mut self, mode: FtsPrewarmMode) -&gt; Self` | rust/lance-index/src/traits.rs:99-99 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn best_effort(mut self) -&gt; Self` | rust/lance-index/src/traits.rs:104-104 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum FtsPrewarmMode` | rust/lance-index/src/traits.rs:111-111 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_best_effort(self) -&gt; bool` | rust/lance-index/src/traits.rs:118-118 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FtsPrewarmResult` | rust/lance-index/src/traits.rs:124-124 | No standalone documentation summary; use the family contract and source entry. |
| `pub fully_resident: bool,` | rust/lance-index/src/traits.rs:125-125 | No standalone documentation summary; use the family contract and source entry. |
| `pub diagnostics: Option&lt;FtsPrewarmDiagnostics&gt;,` | rust/lance-index/src/traits.rs:126-126 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn fully_resident() -&gt; Self` | rust/lance-index/src/traits.rs:130-130 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn partial(diagnostics: FtsPrewarmDiagnostics) -&gt; Self` | rust/lance-index/src/traits.rs:137-137 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FtsPrewarmDiagnostics` | rust/lance-index/src/traits.rs:146-146 | No standalone documentation summary; use the family contract and source entry. |
| `pub partition_count: usize,` | rust/lance-index/src/traits.rs:147-147 | No standalone documentation summary; use the family contract and source entry. |
| `pub failing_segments: Vec&lt;FtsPrewarmSegmentStatus&gt;,` | rust/lance-index/src/traits.rs:148-148 | No standalone documentation summary; use the family contract and source entry. |
| `pub failing_partitions: Vec&lt;FtsPrewarmPartitionStatus&gt;,` | rust/lance-index/src/traits.rs:149-149 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn fully_resident(&self) -&gt; bool` | rust/lance-index/src/traits.rs:153-153 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FtsPrewarmSegmentStatus` | rust/lance-index/src/traits.rs:196-196 | No standalone documentation summary; use the family contract and source entry. |
| `pub segment_id: String,` | rust/lance-index/src/traits.rs:197-197 | No standalone documentation summary; use the family contract and source entry. |
| `pub scalar_index_container_resident: bool,` | rust/lance-index/src/traits.rs:198-198 | No standalone documentation summary; use the family contract and source entry. |
| `pub scalar_index_container_matches_prewarmed: bool,` | rust/lance-index/src/traits.rs:201-201 | Whether the cached container shares the opened segment's prewarm state, including when its storage readers have been rebound to another request. |
| `pub fn query_ready(&self) -&gt; bool` | rust/lance-index/src/traits.rs:205-205 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FtsPrewarmPartitionStatus` | rust/lance-index/src/traits.rs:229-229 | No standalone documentation summary; use the family contract and source entry. |
| `pub segment_id: Option&lt;String&gt;,` | rust/lance-index/src/traits.rs:230-230 | No standalone documentation summary; use the family contract and source entry. |
| `pub partition_id: u64,` | rust/lance-index/src/traits.rs:231-231 | No standalone documentation summary; use the family contract and source entry. |
| `pub documents: FtsPrewarmDocumentStatus,` | rust/lance-index/src/traits.rs:232-232 | No standalone documentation summary; use the family contract and source entry. |
| `pub posting_validation_ready: bool,` | rust/lance-index/src/traits.rs:233-233 | No standalone documentation summary; use the family contract and source entry. |
| `pub posting_resident: bool,` | rust/lance-index/src/traits.rs:234-234 | No standalone documentation summary; use the family contract and source entry. |
| `pub position_resident: Option&lt;bool&gt;,` | rust/lance-index/src/traits.rs:235-235 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn query_ready(&self) -&gt; bool` | rust/lance-index/src/traits.rs:239-239 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FtsPrewarmDocumentStatus` | rust/lance-index/src/traits.rs:290-290 | No standalone documentation summary; use the family contract and source entry. |
| `pub prewarm_complete: bool,` | rust/lance-index/src/traits.rs:291-291 | No standalone documentation summary; use the family contract and source entry. |
| `pub scoring_ready: bool,` | rust/lance-index/src/traits.rs:292-292 | No standalone documentation summary; use the family contract and source entry. |
| `pub reverse_lookup_ready: bool,` | rust/lance-index/src/traits.rs:293-293 | No standalone documentation summary; use the family contract and source entry. |
| `pub ascending_addresses_ready: bool,` | rust/lance-index/src/traits.rs:298-298 | Whether the memoized "are the stored addresses strictly ascending?" answer is populated. Cross-field search reads it on every query, so a prewarmed partition that left it empty would still pay an O(num_docs) address scan on its first query. |
| `pub projection_resident: bool,` | rust/lance-index/src/traits.rs:299-299 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn query_ready(&self) -&gt; bool` | rust/lance-index/src/traits.rs:303-303 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum PrewarmOptions` | rust/lance-index/src/traits.rs:315-315 | Options for prewarming an index. |
| `pub trait IndexDescription: Send + Sync` | rust/lance-index/src/traits.rs:325-325 | Additional information about an index |

<a id="source-rust-lance-index-src-vector-rs"></a>

## `rust/lance-index/src/vector.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod bq;` | rust/lance-index/src/vector.rs:29-29 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod distributed;` | rust/lance-index/src/vector.rs:30-30 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod flat;` | rust/lance-index/src/vector.rs:31-31 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod graph;` | rust/lance-index/src/vector.rs:32-32 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod hnsw;` | rust/lance-index/src/vector.rs:33-33 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod ivf;` | rust/lance-index/src/vector.rs:34-34 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod kmeans;` | rust/lance-index/src/vector.rs:35-35 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod pairwise;` | rust/lance-index/src/vector.rs:36-36 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod pq;` | rust/lance-index/src/vector.rs:37-37 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod quantizer;` | rust/lance-index/src/vector.rs:38-38 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod residual;` | rust/lance-index/src/vector.rs:39-39 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod shared;` | rust/lance-index/src/vector.rs:40-40 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod sq;` | rust/lance-index/src/vector.rs:41-41 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod storage;` | rust/lance-index/src/vector.rs:42-42 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod transform;` | rust/lance-index/src/vector.rs:43-43 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod utils;` | rust/lance-index/src/vector.rs:44-44 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod v3;` | rust/lance-index/src/vector.rs:45-45 | No standalone documentation summary; use the family contract and source entry. |
| `pub const DIST_COL: &str = "_distance";` | rust/lance-index/src/vector.rs:52-52 | No standalone documentation summary; use the family contract and source entry. |
| `pub const DISTANCE_TYPE_KEY: &str = "distance_type";` | rust/lance-index/src/vector.rs:53-53 | No standalone documentation summary; use the family contract and source entry. |
| `pub const INDEX_UUID_COLUMN: &str = "__index_uuid";` | rust/lance-index/src/vector.rs:54-54 | No standalone documentation summary; use the family contract and source entry. |
| `pub const PART_ID_COLUMN: &str = "__ivf_part_id";` | rust/lance-index/src/vector.rs:55-55 | No standalone documentation summary; use the family contract and source entry. |
| `pub const DIST_Q_C_COLUMN: &str = "__dist_q_c";` | rust/lance-index/src/vector.rs:56-56 | No standalone documentation summary; use the family contract and source entry. |
| `pub const CENTROID_DIST_COLUMN: &str = "__centroid_dist";` | rust/lance-index/src/vector.rs:58-58 | No standalone documentation summary; use the family contract and source entry. |
| `pub const PQ_CODE_COLUMN: &str = "__pq_code";` | rust/lance-index/src/vector.rs:59-59 | No standalone documentation summary; use the family contract and source entry. |
| `pub const SQ_CODE_COLUMN: &str = "__sq_code";` | rust/lance-index/src/vector.rs:60-60 | No standalone documentation summary; use the family contract and source entry. |
| `pub const LOSS_METADATA_KEY: &str = "_loss";` | rust/lance-index/src/vector.rs:61-61 | No standalone documentation summary; use the family contract and source entry. |
| `pub type PreparedPartitionSearchHandle = Box&lt;dyn Any + Send&gt;;` | rust/lance-index/src/vector.rs:63-63 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait PartitionSearchControl: Send + Sync` | rust/lance-index/src/vector.rs:66-66 | Controls when a multi-partition search should stop producing more partition results. |
| `pub static VECTOR_RESULT_SCHEMA: LazyLock&lt;arrow_schema::SchemaRef&gt; = LazyLock::new(\|\|` | rust/lance-index/src/vector.rs:72-72 | No standalone documentation summary; use the family contract and source entry. |
| `pub static PART_ID_FIELD: LazyLock&lt;arrow_schema::Field&gt; = LazyLock::new(\|\|` | rust/lance-index/src/vector.rs:79-79 | No standalone documentation summary; use the family contract and source entry. |
| `pub static CENTROID_DIST_FIELD: LazyLock&lt;arrow_schema::Field&gt; = LazyLock::new(\|\|` | rust/lance-index/src/vector.rs:83-83 | No standalone documentation summary; use the family contract and source entry. |
| `pub const DEFAULT_QUERY_PARALLELISM: i32 = 0;` | rust/lance-index/src/vector.rs:87-87 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum ApproxMode` | rust/lance-index/src/vector.rs:95-95 | Controls the speed / accuracy tradeoff for approximate vector search. |
| `pub struct ProbeParams` | rust/lance-index/src/vector.rs:109-109 | Caller-supplied IVF probe parameters before defaults and precedence are resolved. |
| `pub nprobes: Option&lt;usize&gt;,` | rust/lance-index/src/vector.rs:111-111 | Fixed probe count, used only when `search_effort` is absent. |
| `pub minimum_nprobes: Option&lt;usize&gt;,` | rust/lance-index/src/vector.rs:113-113 | Explicit lower bound, overriding the fixed count's lower bound. Defaults to 1. |
| `pub maximum_nprobes: Option&lt;usize&gt;,` | rust/lance-index/src/vector.rs:116-116 | Explicit upper bound, overriding the fixed count's upper bound. Without either bound or a fixed count, all partitions are available. |
| `pub search_effort: Option&lt;f64&gt;,` | rust/lance-index/src/vector.rs:119-119 | Optional effort in [0, 1]. Absence resolves to 0.5; any supplied value ignores `nprobes`, including an explicit 0.5. |
| `pub fn resolve(&self) -&gt; (usize, Option&lt;usize&gt;, f64)` | rust/lance-index/src/vector.rs:136-136 | Resolve the minimum, maximum and effort used by [`Query`]. |
| `pub struct Query` | rust/lance-index/src/vector.rs:149-149 | Resolved query parameters for the vector indices. |
| `pub column: String,` | rust/lance-index/src/vector.rs:151-151 | The column to be searched. |
| `pub key: ArrayRef,` | rust/lance-index/src/vector.rs:154-154 | The vector to be searched. |
| `pub k: usize,` | rust/lance-index/src/vector.rs:157-157 | Top k results to return. |
| `pub lower_bound: Option&lt;f32&gt;,` | rust/lance-index/src/vector.rs:160-160 | The lower bound (inclusive) of the distance to be searched. |
| `pub upper_bound: Option&lt;f32&gt;,` | rust/lance-index/src/vector.rs:163-163 | The upper bound (exclusive) of the distance to be searched. |
| `pub minimum_nprobes: usize,` | rust/lance-index/src/vector.rs:170-170 | The minimum number of probes to load and search. More partitions will only be loaded if we have not found k results, or the algorithm determines more partitions are needed to satisfy recall requirements. |
| `pub maximum_nprobes: Option&lt;usize&gt;,` | rust/lance-index/src/vector.rs:174-174 | The maximum number of probes to load and search. If not set then ALL partitions will be searched, if needed, to satisfy k results. |
| `pub search_effort: f64,` | rust/lance-index/src/vector.rs:185-185 | Continuous initial IVF search budget in [0, 1], default 0.5. |
| `pub ef: Option&lt;usize&gt;,` | rust/lance-index/src/vector.rs:189-189 | The number of candidates to reserve while searching. this is an optional parameter for HNSW related index types. |
| `pub refine_factor: Option&lt;u32&gt;,` | rust/lance-index/src/vector.rs:193-193 | If presented, apply a refine step. TODO: should we support fraction / float number here? |
| `pub metric_type: Option&lt;DistanceType&gt;,` | rust/lance-index/src/vector.rs:197-197 | Distance metric type. If None, uses the index's metric (if available) or the default for the data type. |
| `pub use_index: bool,` | rust/lance-index/src/vector.rs:200-200 | Whether to use an ANN index if available |
| `pub query_parallelism: i32,` | rust/lance-index/src/vector.rs:211-211 | Maximum partition-search concurrency for a single vector query. |
| `pub dist_q_c: f32,` | rust/lance-index/src/vector.rs:215-215 | the distance between the query and the centroid this is only used for IVF index with Rabit quantization |
| `pub approx_mode: ApproxMode,` | rust/lance-index/src/vector.rs:221-221 | Controls the speed / accuracy tradeoff for approximate vector search. |
| `pub fn validate_search_effort(&self) -&gt; Result&lt;()&gt;` | rust/lance-index/src/vector.rs:226-226 | Validate the resolved effort range. |
| `pub trait VectorIndex: Send + Sync + std::fmt::Debug + Index` | rust/lance-index/src/vector.rs:268-268 | Vector Index for (Approximate) Nearest Neighbor (ANN) Search. |
| `pub trait VectorIndexCacheEntry: Debug + Send + Sync + DeepSizeOf` | rust/lance-index/src/vector.rs:608-608 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-index-src-vector-bq-rs"></a>

## `rust/lance-index/src/vector/bq.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod builder;` | rust/lance-index/src/vector/bq.rs:20-20 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod ex_dot;` | rust/lance-index/src/vector/bq.rs:22-22 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod prune;` | rust/lance-index/src/vector/bq.rs:24-24 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod rotation;` | rust/lance-index/src/vector/bq.rs:25-25 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod storage;` | rust/lance-index/src/vector/bq.rs:26-26 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod transform;` | rust/lance-index/src/vector/bq.rs:27-27 | No standalone documentation summary; use the family contract and source entry. |
| `pub const RABIT_MIN_NUM_BITS: u8 = 1;` | rust/lance-index/src/vector/bq.rs:29-29 | No standalone documentation summary; use the family contract and source entry. |
| `pub const RABIT_MAX_NUM_BITS: u8 = 9;` | rust/lance-index/src/vector/bq.rs:30-30 | No standalone documentation summary; use the family contract and source entry. |
| `pub const RABIT_BINARY_NUM_BITS: u8 = 1;` | rust/lance-index/src/vector/bq.rs:31-31 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct BinaryQuantization` | rust/lance-index/src/vector/bq.rs:36-36 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn transform(&self, data: &dyn Array) -&gt; Result&lt;ArrayRef&gt;` | rust/lance-index/src/vector/bq.rs:40-40 | Transform an array of float vectors to binary vectors. |
| `pub enum RQRotationType` | rust/lance-index/src/vector/bq.rs:94-94 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct RQBuildParams` | rust/lance-index/src/vector/bq.rs:116-116 | No standalone documentation summary; use the family contract and source entry. |
| `pub num_bits: u8,` | rust/lance-index/src/vector/bq.rs:118-118 | Number of bits per dimension. Defaults to 5. |
| `pub rotation_type: RQRotationType,` | rust/lance-index/src/vector/bq.rs:119-119 | No standalone documentation summary; use the family contract and source entry. |
| `pub rotation: Option&lt;RabitQuantizationMetadata&gt;,` | rust/lance-index/src/vector/bq.rs:125-125 | Optional pre-built rotation to reuse instead of generating a fresh random one. |
| `pub fn validate_rq_num_bits(num_bits: u8) -&gt; Result&lt;()&gt;` | rust/lance-index/src/vector/bq.rs:128-128 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn validate_supported_rq_num_bits(num_bits: u8) -&gt; Result&lt;()&gt;` | rust/lance-index/src/vector/bq.rs:138-138 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn rabit_ex_bits(num_bits: u8) -&gt; Result&lt;u8&gt;` | rust/lance-index/src/vector/bq.rs:142-142 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn rabit_binary_code_bytes(rotated_dim: usize) -&gt; usize` | rust/lance-index/src/vector/bq.rs:147-147 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn rabit_ex_code_bytes(rotated_dim: usize, ex_bits: u8) -&gt; Result&lt;usize&gt;` | rust/lance-index/src/vector/bq.rs:151-151 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(num_bits: u8) -&gt; Self` | rust/lance-index/src/vector/bq.rs:162-162 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_rotation_type(num_bits: u8, rotation_type: RQRotationType) -&gt; Self` | rust/lance-index/src/vector/bq.rs:170-170 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-bq-builder-rs"></a>

## `rust/lance-index/src/vector/bq/builder.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct RabitBuildParams` | rust/lance-index/src/vector/bq/builder.rs:37-37 | Build parameters for RabitQuantizer. |
| `pub num_bits: u8,` | rust/lance-index/src/vector/bq/builder.rs:38-38 | No standalone documentation summary; use the family contract and source entry. |
| `pub rotation_type: RQRotationType,` | rust/lance-index/src/vector/bq/builder.rs:39-39 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct RabitQuantizer` | rust/lance-index/src/vector/bq/builder.rs:59-59 | No standalone documentation summary; use the family contract and source entry. |
| `pub binary_codes: ArrayRef,` | rust/lance-index/src/vector/bq/builder.rs:64-64 | No standalone documentation summary; use the family contract and source entry. |
| `pub ex_codes: Option&lt;ArrayRef&gt;,` | rust/lance-index/src/vector/bq/builder.rs:65-65 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn best_ex_rescale_factor(abs_normalized: &[f32], ex_bits: u8) -&gt; f32` | rust/lance-index/src/vector/bq/builder.rs:218-218 | Select the native ex-code rescale factor for normalized magnitudes. |
| `pub fn ex_abs_normalized(rotated: &[f32]) -&gt; Option&lt;Vec&lt;f32&gt;&gt;` | rust/lance-index/src/vector/bq/builder.rs:305-305 | `\|v_d\| / \|\|v\|\|` for every dimension, or `None` for a zero / non-finite vector (which encodes as all-zero ex codes). |
| `pub fn quantize_ex_code_with_scale( rotated: &[f32], abs_normalized: &[f32], ex_bits: u8, t: f32, ex_code_dst: &mut [u8], ex_code_values_dst: &mut [u8], ) -&gt; f32` | rust/lance-index/src/vector/bq/builder.rs:358-365 | Quantize the ex codes of one rotated residual with an explicit rescale factor `t` (normally the output of [`best_ex_rescale_factor`]). Writes the blocked-layout codes into `ex_code_dst`, the per-dim code values into `ex_code_values_dst`, and returns `sum_d rotated[d] * (full_code[d] + code_bias)`. |
| `pub fn new_with_rotation&lt;T: ArrowFloatType&gt;( num_bits: u8, dim: i32, rotation_type: RQRotationType, ) -&gt; Self` | rust/lance-index/src/vector/bq/builder.rs:558-562 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn num_bits(&self) -&gt; u8` | rust/lance-index/src/vector/bq/builder.rs:603-603 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn rotation_type(&self) -&gt; RQRotationType` | rust/lance-index/src/vector/bq/builder.rs:607-607 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn metadata_ref(&self) -&gt; &RabitQuantizationMetadata` | rust/lance-index/src/vector/bq/builder.rs:611-611 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn rotate_fsl_to_f32(&self, vectors: &FixedSizeListArray) -&gt; Result&lt;Vec&lt;f32&gt;&gt;` | rust/lance-index/src/vector/bq/builder.rs:739-739 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn dim(&self) -&gt; usize` | rust/lance-index/src/vector/bq/builder.rs:793-793 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn codes_res_dot_dists&lt;T: ArrowFloatType&gt;( &self, residual_vectors: &FixedSizeListArray, ) -&gt; Result&lt;Vec&lt;f32&gt;&gt; where T::Native: AsPrimitive&lt;f32&gt; + Sync,` | rust/lance-index/src/vector/bq/builder.rs:798-804 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-index-src-vector-bq-dist-table-quant-rs"></a>

## `rust/lance-index/src/vector/bq/dist_table_quant.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub enum DistTableDequant` | rust/lance-index/src/vector/bq/dist_table_quant.rs:42-42 | How the caller reconstructs binary inner-product distances from the FastScan accumulator sums computed against the quantized LUT. |
| `pub fn quantize_dist_table_into( dist_table: &[f32], quantized_dist_table: &mut Vec&lt;u8&gt;, ) -&gt; DistTableDequant` | rust/lance-index/src/vector/bq/dist_table_quant.rs:59-62 | Quantize `dist_table` into `u8` FastScan LUT entries in the caller-owned scratch buffer, returning how the caller must dequantize the FastScan sums (see [`DistTableDequant`]). `dist_table` must be non-empty and all values finite. |
| `pub fn quantize_dist_table_u16_into( dist_table: &[f32], quantized_dist_table: &mut Vec&lt;u16&gt;, ) -&gt; DistTableDequant` | rust/lance-index/src/vector/bq/dist_table_quant.rs:98-101 | `u16` variant of [`quantize_dist_table_into`] for the accurate approx mode. |

<a id="source-rust-lance-index-src-vector-bq-ex-dot-rs"></a>

## `rust/lance-index/src/vector/bq/ex_dot.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const EX_DOT_BLOCK_DIMS: usize = 64;` | rust/lance-index/src/vector/bq/ex_dot.rs:45-45 | Dims are packed in blocks of this size; the query is zero-padded to a whole number of blocks when the rotated dim is not already a multiple. |
| `pub fn padded_query_len(dim: usize) -&gt; usize` | rust/lance-index/src/vector/bq/ex_dot.rs:48-48 | `f32` length of the query consumed by the kernels. |
| `pub fn sequential_matches_blocked(ex_bits: u8) -&gt; bool` | rust/lance-index/src/vector/bq/ex_dot.rs:55-55 | Whether the legacy sequential layout of a row already matches the blocked layout (modulo trailing zero padding, which the kernels tolerate), so legacy rows can be consumed without repacking. |
| `pub fn blocked_ex_code_bytes(dim: usize, ex_bits: u8) -&gt; usize` | rust/lance-index/src/vector/bq/ex_dot.rs:60-60 | Bytes per row of the blocked ex-code layout. |
| `pub fn packed_ex_code_value(row_codes: &[u8], dim_idx: usize, ex_bits: u8) -&gt; u8` | rust/lance-index/src/vector/bq/ex_dot.rs:80-80 | Extract the `ex_bits`-wide code of `dim_idx` from a sequentially bit-packed row (LSB-first, codes may straddle byte boundaries). |
| `pub fn pad_query_into(rotated_query: &[f32], out: &mut [f32])` | rust/lance-index/src/vector/bq/ex_dot.rs:97-97 | Zero-pad the rotated query to a whole number of 64-dim blocks. Only needed when `dim` is not a multiple of [`EX_DOT_BLOCK_DIMS`]; aligned queries are passed to the kernels as-is. |
| `pub fn pack_blocked_row(values: &[u8], ex_bits: u8, out: &mut [u8])` | rust/lance-index/src/vector/bq/ex_dot.rs:183-183 | Pack one row of unpacked code values (one `u8` per dim) into the blocked layout; the writer path. `out` must have [`blocked_ex_code_bytes`] bytes. |
| `pub fn repack_sequential_row(seq_row: &[u8], dim: usize, ex_bits: u8, out: &mut [u8])` | rust/lance-index/src/vector/bq/ex_dot.rs:198-198 | Repack one legacy sequentially bit-packed row into the blocked layout. `out` must have [`blocked_ex_code_bytes`] bytes. |
| `pub type ExDotFn = fn(&[f32], &[u8]) -&gt; f32;` | rust/lance-index/src/vector/bq/ex_dot.rs:299-299 | `sum_d query[d] * code[d]` for one row of blocked-layout codes. |
| `pub fn ex_dot_kernel(ex_bits: u8) -&gt; ExDotFn` | rust/lance-index/src/vector/bq/ex_dot.rs:303-303 | Resolve the dot kernel for `ex_bits` once; the result can be cached by the caller for per-candidate use. |
| `pub fn ex_dot_kernel_variants(ex_bits: u8) -&gt; Vec&lt;(&'static str, ExDotFn)&gt;` | rust/lance-index/src/vector/bq/ex_dot.rs:311-311 | Available native kernels for controlled profiling and parity tests. |


<a id="source-rust-lance-index-src-vector-bq-pairwise-rs"></a>

## `rust/lance-index/src/vector/bq/pairwise.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct RQPairScorer` | rust/lance-index/src/vector/bq/pairwise.rs:43-43 | Partition-local RQ code scoring. |
| `pub struct RQKernel&lt;'a&gt;` | rust/lance-index/src/vector/bq/pairwise.rs:884-884 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-bq-prune-rs"></a>

## `rust/lance-index/src/vector/bq/prune.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const PRUNE_LANES: usize = 16;` | rust/lance-index/src/vector/bq/prune.rs:42-42 | Rows classified per kernel invocation. |
| `pub struct LowerBoundTerms` | rust/lance-index/src/vector/bq/prune.rs:46-46 | Per-query constants for the unscaled raw-query lower bound. |
| `pub half_sum_q: f32,` | rust/lance-index/src/vector/bq/prune.rs:48-48 | `0.5 * sum_q`, subtracted from the binary inner product. |
| `pub query_factor: f32,` | rust/lance-index/src/vector/bq/prune.rs:49-49 | No standalone documentation summary; use the family contract and source entry. |
| `pub query_error: f32,` | rust/lance-index/src/vector/bq/prune.rs:50-50 | No standalone documentation summary; use the family contract and source entry. |
| `pub type PruneMaskFn = fn( &[f32; PRUNE_LANES],` | rust/lance-index/src/vector/bq/prune.rs:54-55 | Classify rows using the stored additive factors without rescaling them. |
| `pub fn prune_mask_kernel() -&gt; PruneMaskFn` | rust/lance-index/src/vector/bq/prune.rs:65-65 | Resolve the unscaled prune-mask kernel, preserving the public kernel API. |
| `pub half_sum_q: f32,` | rust/lance-index/src/vector/bq/prune.rs:90-90 | `0.5 * sum_q`, subtracted from the binary inner product. |
| `pub add_factor_scale: f32,` | rust/lance-index/src/vector/bq/prune.rs:92-92 | Scales the stored centroid correction for dot queries; one for L2. |
| `pub add_factor_offset: f32,` | rust/lance-index/src/vector/bq/prune.rs:94-94 | Removes the constant one from dot factors before projection scaling. |
| `pub query_factor: f32,` | rust/lance-index/src/vector/bq/prune.rs:95-95 | No standalone documentation summary; use the family contract and source entry. |
| `pub query_error: f32,` | rust/lance-index/src/vector/bq/prune.rs:96-96 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-bq-rotation-rs"></a>

## `rust/lance-index/src/vector/bq/rotation.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn random_fast_rotation_signs(dim: usize) -&gt; Vec&lt;u8&gt;` | rust/lance-index/src/vector/bq/rotation.rs:145-145 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn apply_fast_rotation&lt;T: AsPrimitive&lt;f32&gt;&gt;(input: &[T], output: &mut [f32], signs: &[u8])` | rust/lance-index/src/vector/bq/rotation.rs:153-153 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn apply_fast_rotation_in_place(output: &mut [f32], signs: &[u8])` | rust/lance-index/src/vector/bq/rotation.rs:173-173 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-bq-storage-rs"></a>

## `rust/lance-index/src/vector/bq/storage.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const RABIT_METADATA_KEY: &str = "lance:rabit";` | rust/lance-index/src/vector/bq/storage.rs:71-71 | No standalone documentation summary; use the family contract and source entry. |
| `pub const RABIT_CODE_COLUMN: &str = "_rabit_codes";` | rust/lance-index/src/vector/bq/storage.rs:72-72 | No standalone documentation summary; use the family contract and source entry. |
| `pub const RABIT_EX_CODE_COLUMN: &str = "__ex_codes";` | rust/lance-index/src/vector/bq/storage.rs:75-75 | Legacy ex-code column: sequential LSB-first bit stream per row. Read-only; rows are repacked into the blocked layout at load time. |
| `pub const RABIT_BLOCKED_EX_CODE_COLUMN: &str = "__blocked_ex_codes";` | rust/lance-index/src/vector/bq/storage.rs:80-80 | Ex-code column in the blocked layout consumed by the ex-dot kernels (see `ex_dot` module docs). Indexes written with this column cannot be read by older versions, which fail with a missing-column error instead of misinterpreting the bytes. |
| `pub const SEGMENT_LENGTH: usize = 4;` | rust/lance-index/src/vector/bq/storage.rs:81-81 | No standalone documentation summary; use the family contract and source entry. |
| `pub const SEGMENT_NUM_CODES: usize = 1 &lt;&lt; SEGMENT_LENGTH;` | rust/lance-index/src/vector/bq/storage.rs:82-82 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum RabitQueryEstimator` | rust/lance-index/src/vector/bq/storage.rs:218-218 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn rabit_binary_code_field(rotated_dim: usize) -&gt; Field` | rust/lance-index/src/vector/bq/storage.rs:223-223 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn rabit_ex_code_field(rotated_dim: usize, num_bits: u8) -&gt; Result&lt;Option&lt;Field&gt;&gt;` | rust/lance-index/src/vector/bq/storage.rs:234-234 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct RabitQuantizationMetadata` | rust/lance-index/src/vector/bq/storage.rs:250-250 | No standalone documentation summary; use the family contract and source entry. |
| `pub rotate_mat: Option&lt;FixedSizeListArray&gt;,` | rust/lance-index/src/vector/bq/storage.rs:255-255 | No standalone documentation summary; use the family contract and source entry. |
| `pub rotate_mat_position: Option&lt;u32&gt;,` | rust/lance-index/src/vector/bq/storage.rs:257-257 | No standalone documentation summary; use the family contract and source entry. |
| `pub fast_rotation_signs: Option&lt;Vec&lt;u8&gt;&gt;,` | rust/lance-index/src/vector/bq/storage.rs:259-259 | No standalone documentation summary; use the family contract and source entry. |
| `pub rotation_type: RQRotationType,` | rust/lance-index/src/vector/bq/storage.rs:261-261 | No standalone documentation summary; use the family contract and source entry. |
| `pub code_dim: u32,` | rust/lance-index/src/vector/bq/storage.rs:263-263 | No standalone documentation summary; use the family contract and source entry. |
| `pub num_bits: u8,` | rust/lance-index/src/vector/bq/storage.rs:264-264 | No standalone documentation summary; use the family contract and source entry. |
| `pub packed: bool,` | rust/lance-index/src/vector/bq/storage.rs:265-265 | No standalone documentation summary; use the family contract and source entry. |
| `pub query_estimator: RabitQueryEstimator,` | rust/lance-index/src/vector/bq/storage.rs:267-267 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn rotated_dim(&self) -&gt; usize` | rust/lance-index/src/vector/bq/storage.rs:271-271 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn binary_code_bytes(&self) -&gt; usize` | rust/lance-index/src/vector/bq/storage.rs:282-282 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn prepare_raw_query_context(&self, query: &dyn Array) -&gt; Result&lt;RabitRawQueryContext&gt;` | rust/lance-index/src/vector/bq/storage.rs:374-374 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct RabitQuantizationStorage` | rust/lance-index/src/vector/bq/storage.rs:481-481 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct RabitDistCalculator&lt;'a&gt;` | rust/lance-index/src/vector/bq/storage.rs:874-874 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( dim: usize, num_bits: u8, query_estimator: RabitQueryEstimator, dist_table: Cow&lt;'a, [f32]&gt;, ex_query: Cow&lt;'a, [f32]&gt;, sum_q: f32, codes: &'a [u8], ex_codes: Option&lt;&'a [u8]&gt;, ex_code_len: usize, add_factors: &'a [f32], scale_factors: &'a [f32], error_factors: Option&lt;&'a [f32]&gt;, ex_add_factors: Option&lt;&'a [f32]&gt;, ex_scale_factors: Option&lt;&'a [f32]&gt;, packed_ex_codes: Option&lt;&'a [u8]&gt;, query_factor: f32, query_error: f32, approx_mode: ApproxMode, ) -&gt; Self` | rust/lance-index/src/vector/bq/storage.rs:911-930 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn build_dist_table_direct&lt;T: ArrowFloatType&gt;(qc: &[T::Native]) -&gt; Vec&lt;f32&gt; where T::Native: AsPrimitive&lt;f32&gt;,` | rust/lance-index/src/vector/bq/storage.rs:1601-1604 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn pack_codes(codes: &FixedSizeListArray) -&gt; FixedSizeListArray` | rust/lance-index/src/vector/bq/storage.rs:2320-2320 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn unpack_codes(codes: &FixedSizeListArray) -&gt; FixedSizeListArray` | rust/lance-index/src/vector/bq/storage.rs:2390-2390 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-bq-transform-rs"></a>

## `rust/lance-index/src/vector/bq/transform.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const ADD_FACTORS_COLUMN: &str = "__add_factors";` | rust/lance-index/src/vector/bq/transform.rs:29-29 | No standalone documentation summary; use the family contract and source entry. |
| `pub const SCALE_FACTORS_COLUMN: &str = "__scale_factors";` | rust/lance-index/src/vector/bq/transform.rs:31-31 | No standalone documentation summary; use the family contract and source entry. |
| `pub const EX_ADD_FACTORS_COLUMN: &str = "__add_factors_ex";` | rust/lance-index/src/vector/bq/transform.rs:32-32 | No standalone documentation summary; use the family contract and source entry. |
| `pub const EX_SCALE_FACTORS_COLUMN: &str = "__scale_factors_ex";` | rust/lance-index/src/vector/bq/transform.rs:33-33 | No standalone documentation summary; use the family contract and source entry. |
| `pub const ERROR_FACTORS_COLUMN: &str = "__error_factors";` | rust/lance-index/src/vector/bq/transform.rs:34-34 | No standalone documentation summary; use the family contract and source entry. |
| `pub static ADD_FACTORS_FIELD: LazyLock&lt;arrow_schema::Field&gt; = LazyLock::new(\|\|` | rust/lance-index/src/vector/bq/transform.rs:38-38 | No standalone documentation summary; use the family contract and source entry. |
| `pub static SCALE_FACTORS_FIELD: LazyLock&lt;arrow_schema::Field&gt; = LazyLock::new(\|\|` | rust/lance-index/src/vector/bq/transform.rs:41-41 | No standalone documentation summary; use the family contract and source entry. |
| `pub static EX_ADD_FACTORS_FIELD: LazyLock&lt;arrow_schema::Field&gt; = LazyLock::new(\|\|` | rust/lance-index/src/vector/bq/transform.rs:44-44 | No standalone documentation summary; use the family contract and source entry. |
| `pub static EX_SCALE_FACTORS_FIELD: LazyLock&lt;arrow_schema::Field&gt; = LazyLock::new(\|\|` | rust/lance-index/src/vector/bq/transform.rs:47-47 | No standalone documentation summary; use the family contract and source entry. |
| `pub static ERROR_FACTORS_FIELD: LazyLock&lt;arrow_schema::Field&gt; = LazyLock::new(\|\|` | rust/lance-index/src/vector/bq/transform.rs:54-54 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct RQTransformer` | rust/lance-index/src/vector/bq/transform.rs:58-58 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( rq: RabitQuantizer, distance_type: DistanceType, centroids: FixedSizeListArray, vector_column: impl Into&lt;String&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/bq/transform.rs:157-162 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct RabitRawQueryFactors` | rust/lance-index/src/vector/bq/transform.rs:182-182 | No standalone documentation summary; use the family contract and source entry. |
| `pub add_factors: Float32Array,` | rust/lance-index/src/vector/bq/transform.rs:183-183 | No standalone documentation summary; use the family contract and source entry. |
| `pub scale_factors: Float32Array,` | rust/lance-index/src/vector/bq/transform.rs:184-184 | No standalone documentation summary; use the family contract and source entry. |
| `pub error_factors: Float32Array,` | rust/lance-index/src/vector/bq/transform.rs:185-185 | No standalone documentation summary; use the family contract and source entry. |
| `pub ex_add_factors: Option&lt;Float32Array&gt;,` | rust/lance-index/src/vector/bq/transform.rs:186-186 | No standalone documentation summary; use the family contract and source entry. |
| `pub ex_scale_factors: Option&lt;Float32Array&gt;,` | rust/lance-index/src/vector/bq/transform.rs:187-187 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn compute_raw_query_factors( distance_type: DistanceType, res_norm_square: &Float32Array, rotated_residuals: &[f32], rotated_centroids: &[f32], part_ids: &UInt32Array, ex_code_values: Option&lt;&[u8]&gt;, ex_res_dot_dists: Option&lt;&[f32]&gt;, ex_bits: u8, code_dim: usize, ) -&gt; Result&lt;RabitRawQueryFactors&gt;` | rust/lance-index/src/vector/bq/transform.rs:300-310 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-index-src-vector-distributed-index-merger-rs"></a>

## `rust/lance-index/src/vector/distributed/index_merger.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub async fn init_writer_for_flat( object_store: &lance_io::object_store::ObjectStore, aux_out: &object_store::path::Path, d0: usize, item_type: &DataType, dt: DistanceType, format_version: ConcreteFileVersion, ) -&gt; Result&lt;FileWriter&gt;` | rust/lance-index/src/vector/distributed/index_merger.rs:253-260 | Create and initialize a unified writer for FLAT storage. |
| `pub async fn init_writer_for_pq( object_store: &lance_io::object_store::ObjectStore, aux_out: &object_store::path::Path, dt: DistanceType, pm: &ProductQuantizationMetadata, format_version: ConcreteFileVersion, ) -&gt; Result&lt;FileWriter&gt;` | rust/lance-index/src/vector/distributed/index_merger.rs:288-294 | Create and initialize a unified writer for PQ storage. |
| `pub async fn init_writer_for_sq( object_store: &lance_io::object_store::ObjectStore, aux_out: &object_store::path::Path, dt: DistanceType, sq_meta: &ScalarQuantizationMetadata, format_version: ConcreteFileVersion, ) -&gt; Result&lt;FileWriter&gt;` | rust/lance-index/src/vector/distributed/index_merger.rs:333-339 | Create and initialize a unified writer for SQ storage. |
| `pub async fn init_writer_for_rq( object_store: &lance_io::object_store::ObjectStore, aux_out: &object_store::path::Path, dt: DistanceType, rq_meta: &RabitQuantizationMetadata, format_version: ConcreteFileVersion, ) -&gt; Result&lt;FileWriter&gt;` | rust/lance-index/src/vector/distributed/index_merger.rs:365-371 | Create and initialize a unified writer for RQ storage. |
| `pub async fn write_partition_rows( reader: &V2Reader, w: &mut FileWriter, range: Range&lt;usize&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance-index/src/vector/distributed/index_merger.rs:410-414 | Stream and write a range of rows from reader into writer. |
| `pub async fn merge_partial_vector_auxiliary_files( object_store: &lance_io::object_store::ObjectStore, aux_paths: &[object_store::path::Path], target_dir: &object_store::path::Path, progress: Arc&lt;dyn IndexBuildProgress&gt;, ) -&gt; Result&lt;lance_table::format::IndexFile&gt;` | rust/lance-index/src/vector/distributed/index_merger.rs:827-832 | Merge the selected segment auxiliary files into `target_dir`. |
| `pub async fn merge_partial_vector_auxiliary_files_with_row_filters( object_store: &lance_io::object_store::ObjectStore, aux_paths: &[object_store::path::Path], target_dir: &object_store::path::Path, row_filters: &[OldIndexDataFilter], progress: Arc&lt;dyn IndexBuildProgress&gt;, ) -&gt; Result&lt;lance_table::format::IndexFile&gt;` | rust/lance-index/src/vector/distributed/index_merger.rs:838-844 | Merge auxiliary files while retaining only rows owned by each source segment. |

<a id="source-rust-lance-index-src-vector-distributed-mod-rs"></a>

## `rust/lance-index/src/vector/distributed/mod.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod index_merger;` | rust/lance-index/src/vector/distributed/mod.rs:6-6 | No standalone documentation summary; use the family contract and source entry. |
| `pub use index_merger::*;` | rust/lance-index/src/vector/distributed/mod.rs:7-7 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-flat-rs"></a>

## `rust/lance-index/src/vector/flat.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod index;` | rust/lance-index/src/vector/flat.rs:19-19 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod storage;` | rust/lance-index/src/vector/flat.rs:21-21 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod transform;` | rust/lance-index/src/vector/flat.rs:22-22 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn compute_distance( key: ArrayRef, dt: DistanceType, column: &str, mut batch: RecordBatch, ) -&gt; Result&lt;RecordBatch&gt;` | rust/lance-index/src/vector/flat.rs:90-95 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-flat-index-rs"></a>

## `rust/lance-index/src/vector/flat/index.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct FlatIndex` | rust/lance-index/src/vector/flat/index.rs:57-57 | A Flat index is any index that stores no metadata, and during query, it simply scans over the storage and returns the top k results |
| `pub struct FlatQueryParams` | rust/lance-index/src/vector/flat/index.rs:85-85 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FlatMetadata` | rust/lance-index/src/vector/flat/index.rs:369-369 | No standalone documentation summary; use the family contract and source entry. |
| `pub dim: usize,` | rust/lance-index/src/vector/flat/index.rs:370-370 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FlatQuantizer` | rust/lance-index/src/vector/flat/index.rs:381-381 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(dim: usize, distance_type: DistanceType) -&gt; Self` | rust/lance-index/src/vector/flat/index.rs:387-387 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FlatBinQuantizer` | rust/lance-index/src/vector/flat/index.rs:467-467 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(dim: usize, distance_type: DistanceType) -&gt; Self` | rust/lance-index/src/vector/flat/index.rs:473-473 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-flat-pairwise-rs"></a>

## `rust/lance-index/src/vector/flat/pairwise.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct FlatPairScorer` | rust/lance-index/src/vector/flat/pairwise.rs:31-31 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum FlatKernel&lt;'a&gt;` | rust/lance-index/src/vector/flat/pairwise.rs:180-180 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FloatKernel&lt;'a, T&gt;` | rust/lance-index/src/vector/flat/pairwise.rs:191-191 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait FlatFloat: L2 + Dot` | rust/lance-index/src/vector/flat/pairwise.rs:208-208 | Float element types of IVF_FLAT vectors. |

<a id="source-rust-lance-index-src-vector-flat-storage-rs"></a>

## `rust/lance-index/src/vector/flat/storage.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const FLAT_COLUMN: &str = "flat";` | rust/lance-index/src/vector/flat/storage.rs:27-27 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FlatFloatStorage` | rust/lance-index/src/vector/flat/storage.rs:44-44 | All data are stored in memory |
| `pub fn new(vectors: FixedSizeListArray, distance_type: DistanceType) -&gt; Self` | rust/lance-index/src/vector/flat/storage.rs:135-135 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn vector(&self, id: u32) -&gt; ArrayRef` | rust/lance-index/src/vector/flat/storage.rs:158-158 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FlatBinStorage` | rust/lance-index/src/vector/flat/storage.rs:230-230 | All data are stored in memory |
| `pub fn new(vectors: FixedSizeListArray, distance_type: DistanceType) -&gt; Self` | rust/lance-index/src/vector/flat/storage.rs:313-313 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn vector(&self, id: u32) -&gt; ArrayRef` | rust/lance-index/src/vector/flat/storage.rs:334-334 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FlatDistanceCal&lt;'a, T: ArrowPrimitiveType&gt;` | rust/lance-index/src/vector/flat/storage.rs:401-401 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum FlatFloatDistanceCalc&lt;'a&gt;` | rust/lance-index/src/vector/flat/storage.rs:570-570 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-flat-transform-rs"></a>

## `rust/lance-index/src/vector/flat/transform.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct FlatTransformer` | rust/lance-index/src/vector/flat/transform.rs:15-15 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(input_column: impl AsRef&lt;str&gt;) -&gt; Self` | rust/lance-index/src/vector/flat/transform.rs:20-20 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-graph-rs"></a>

## `rust/lance-index/src/vector/graph.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod builder;` | rust/lance-index/src/vector/graph.rs:16-16 | No standalone documentation summary; use the family contract and source entry. |
| `pub static NEIGHBORS_FIELD: LazyLock&lt;Field&gt; = LazyLock::new(\|\|` | rust/lance-index/src/vector/graph.rs:27-27 | NEIGHBORS field. |
| `pub static DISTS_FIELD: LazyLock&lt;Field&gt; = LazyLock::new(\|\|` | rust/lance-index/src/vector/graph.rs:34-34 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct GraphNode&lt;I = u32&gt;` | rust/lance-index/src/vector/graph.rs:42-42 | No standalone documentation summary; use the family contract and source entry. |
| `pub id: I,` | rust/lance-index/src/vector/graph.rs:43-43 | No standalone documentation summary; use the family contract and source entry. |
| `pub neighbors: Vec&lt;I&gt;,` | rust/lance-index/src/vector/graph.rs:44-44 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(id: I, neighbors: Vec&lt;I&gt;) -&gt; Self` | rust/lance-index/src/vector/graph.rs:48-48 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct OrderedFloat(pub f32);` | rust/lance-index/src/vector/graph.rs:65-65 | A wrapper for f32 to make it ordered, so that we can put it into a BTree or Heap |
| `pub struct OrderedNode&lt;T = u32&gt; where T: PartialEq + Eq,` | rust/lance-index/src/vector/graph.rs:96-99 | No standalone documentation summary; use the family contract and source entry. |
| `pub id: T,` | rust/lance-index/src/vector/graph.rs:100-100 | No standalone documentation summary; use the family contract and source entry. |
| `pub dist: OrderedFloat,` | rust/lance-index/src/vector/graph.rs:101-101 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(id: T, dist: OrderedFloat) -&gt; Self` | rust/lance-index/src/vector/graph.rs:105-105 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait DistanceCalculator` | rust/lance-index/src/vector/graph.rs:138-138 | Distance calculator. |
| `pub trait Graph` | rust/lance-index/src/vector/graph.rs:150-150 | Graph trait. |
| `pub trait BorrowingGraph` | rust/lance-index/src/vector/graph.rs:163-163 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct Visited&lt;'a&gt;` | rust/lance-index/src/vector/graph.rs:179-179 | Compact visited list for graph traversals. |
| `pub fn insert(&mut self, node_id: u32)` | rust/lance-index/src/vector/graph.rs:185-185 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn contains(&self, node_id: u32) -&gt; bool` | rust/lance-index/src/vector/graph.rs:195-195 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn iter_ones(&self) -&gt; impl Iterator&lt;Item = usize&gt; + '_` | rust/lance-index/src/vector/graph.rs:203-203 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn count_ones(&self) -&gt; usize` | rust/lance-index/src/vector/graph.rs:209-209 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct VisitedGenerator` | rust/lance-index/src/vector/graph.rs:227-227 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(capacity: usize) -&gt; Self` | rust/lance-index/src/vector/graph.rs:234-234 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn generate(&mut self, node_count: usize) -&gt; Visited&lt;'_&gt;` | rust/lance-index/src/vector/graph.rs:242-242 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn beam_search( graph: &dyn Graph, ep: &OrderedNode, params: &HnswQueryParams, dist_calc: &impl DistCalculator, bitset: Option&lt;&Visited&gt;, prefetch_distance: Option&lt;usize&gt;, visited: &mut Visited, ) -&gt; Vec&lt;OrderedNode&gt;` | rust/lance-index/src/vector/graph.rs:390-398 | Beam search over a graph |
| `pub fn beam_search_borrowed( graph: &impl BorrowingGraph, ep: &OrderedNode, params: &HnswQueryParams, dist_calc: &impl DistCalculator, bitset: Option&lt;&Visited&gt;, prefetch_distance: Option&lt;usize&gt;, visited: &mut Visited, ) -&gt; Vec&lt;OrderedNode&gt;` | rust/lance-index/src/vector/graph.rs:469-477 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn beam_search_acorn( graph: &impl BorrowingGraph, ep: &OrderedNode, params: &HnswQueryParams, dist_calc: &impl DistCalculator, bitset: &Visited, prefetch_distance: Option&lt;usize&gt;, visited: &mut Visited, expanded: &mut Visited, ) -&gt; Vec&lt;OrderedNode&gt;` | rust/lance-index/src/vector/graph.rs:563-572 | Beam search over the mask-passing subgraph (ACORN-1). |
| `pub fn greedy_search( graph: &dyn Graph, start: OrderedNode, dist_calc: &impl DistCalculator, prefetch_distance: Option&lt;usize&gt;, ) -&gt; OrderedNode` | rust/lance-index/src/vector/graph.rs:711-716 | Greedy search over a graph |
| `pub fn greedy_search_borrowed( graph: &impl BorrowingGraph, start: OrderedNode, dist_calc: &impl DistCalculator, prefetch_distance: Option&lt;usize&gt;, ) -&gt; OrderedNode` | rust/lance-index/src/vector/graph.rs:731-736 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-graph-builder-rs"></a>

## `rust/lance-index/src/vector/graph/builder.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct GraphBuilderNode` | rust/lance-index/src/vector/graph/builder.rs:14-14 | GraphNode during build. |

<a id="source-rust-lance-index-src-vector-hnsw-rs"></a>

## `rust/lance-index/src/vector/hnsw.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod builder;` | rust/lance-index/src/vector/hnsw.rs:18-18 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod index;` | rust/lance-index/src/vector/hnsw.rs:19-19 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod online;` | rust/lance-index/src/vector/hnsw.rs:20-20 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod remap;` | rust/lance-index/src/vector/hnsw.rs:21-21 | No standalone documentation summary; use the family contract and source entry. |
| `pub use builder::HNSW;` | rust/lance-index/src/vector/hnsw.rs:23-23 | No standalone documentation summary; use the family contract and source entry. |
| `pub use index::HNSWIndex;` | rust/lance-index/src/vector/hnsw.rs:24-24 | No standalone documentation summary; use the family contract and source entry. |
| `pub use online::OnlineHnswBuilder;` | rust/lance-index/src/vector/hnsw.rs:25-25 | No standalone documentation summary; use the family contract and source entry. |
| `pub static POINTER_FIELD: LazyLock&lt;Field&gt; = LazyLock::new(\|\| Field::new(POINTER_COL, DataType::UInt32, true));` | rust/lance-index/src/vector/hnsw.rs:35-36 | POINTER field. |
| `pub static VECTOR_ID_FIELD: LazyLock&lt;Field&gt; = LazyLock::new(\|\| Field::new(VECTOR_ID_COL, DataType::UInt32, true));` | rust/lance-index/src/vector/hnsw.rs:39-40 | Id of the vector in the `VectorStorage`. |
| `pub struct HnswMetadata` | rust/lance-index/src/vector/hnsw.rs:43-43 | No standalone documentation summary; use the family contract and source entry. |
| `pub entry_point: u32,` | rust/lance-index/src/vector/hnsw.rs:44-44 | No standalone documentation summary; use the family contract and source entry. |
| `pub params: HnswBuildParams,` | rust/lance-index/src/vector/hnsw.rs:45-45 | No standalone documentation summary; use the family contract and source entry. |
| `pub level_offsets: Vec&lt;usize&gt;,` | rust/lance-index/src/vector/hnsw.rs:46-46 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-hnsw-builder-rs"></a>

## `rust/lance-index/src/vector/hnsw/builder.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const HNSW_METADATA_KEY: &str = "lance:hnsw";` | rust/lance-index/src/vector/hnsw/builder.rs:49-49 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct HnswBuildParams` | rust/lance-index/src/vector/hnsw/builder.rs:75-75 | Parameters of building HNSW index |
| `pub max_level: u16,` | rust/lance-index/src/vector/hnsw/builder.rs:77-77 | Maximum number of levels in the graph. |
| `pub m: usize,` | rust/lance-index/src/vector/hnsw/builder.rs:80-80 | number of connections to establish while inserting new element |
| `pub ef_construction: usize,` | rust/lance-index/src/vector/hnsw/builder.rs:83-83 | size of the dynamic list for the candidates |
| `pub prefetch_distance: Option&lt;usize&gt;,` | rust/lance-index/src/vector/hnsw/builder.rs:86-86 | number of vectors ahead to prefetch while building the graph |
| `pub fn max_level(mut self, max_level: u16) -&gt; Self` | rust/lance-index/src/vector/hnsw/builder.rs:113-113 | The maximum level of the graph. The default value is `7`. |
| `pub fn num_edges(mut self, m: usize) -&gt; Self` | rust/lance-index/src/vector/hnsw/builder.rs:123-123 | The number of connections to establish while inserting new element |
| `pub fn ef_construction(mut self, ef_construction: usize) -&gt; Self` | rust/lance-index/src/vector/hnsw/builder.rs:132-132 | Number of candidates to be considered when searching for the nearest neighbors during the construction of the graph. |
| `pub async fn build(self, data: ArrayRef, distance_type: DistanceType) -&gt; Result&lt;HNSW&gt;` | rust/lance-index/src/vector/hnsw/builder.rs:171-171 | Build the HNSW index from the given data. |
| `pub struct HNSW` | rust/lance-index/src/vector/hnsw/builder.rs:202-202 | Build a HNSW graph. |
| `pub fn empty() -&gt; Self` | rust/lance-index/src/vector/hnsw/builder.rs:267-267 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn len(&self) -&gt; usize` | rust/lance-index/src/vector/hnsw/builder.rs:279-279 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance-index/src/vector/hnsw/builder.rs:287-287 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn max_level(&self) -&gt; u16` | rust/lance-index/src/vector/hnsw/builder.rs:291-291 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn num_nodes(&self, level: usize) -&gt; usize` | rust/lance-index/src/vector/hnsw/builder.rs:295-295 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn nodes(&self) -&gt; Option&lt;Arc&lt;Vec&lt;GraphBuilderNode&gt;&gt;&gt;` | rust/lance-index/src/vector/hnsw/builder.rs:303-303 | Returns the in-memory builder nodes, if this graph was freshly built. |
| `pub fn search_inner( &self, query: ArrayRef, k: usize, params: &HnswQueryParams, bitset: Option&lt;Visited&gt;, visited_generator: &mut VisitedGenerator, storage: &impl VectorStore, prefetch_distance: Option&lt;usize&gt;, ) -&gt; Result&lt;Vec&lt;OrderedNode&gt;&gt;` | rust/lance-index/src/vector/hnsw/builder.rs:340-349 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn search_basic( &self, query: ArrayRef, k: usize, params: &HnswQueryParams, bitset: Option&lt;Visited&gt;, storage: &impl VectorStore, ) -&gt; Result&lt;Vec&lt;OrderedNode&gt;&gt;` | rust/lance-index/src/vector/hnsw/builder.rs:451-458 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn search_acorn( &self, query: ArrayRef, k: usize, params: &HnswQueryParams, bitset: &Visited, storage: &impl VectorStore, ) -&gt; Result&lt;Vec&lt;OrderedNode&gt;&gt;` | rust/lance-index/src/vector/hnsw/builder.rs:486-493 | Like [Self::search_basic] but the bottom level runs [beam_search_acorn], which only scores mask-passing nodes. |
| `pub fn metadata(&self) -&gt; HnswMetadata` | rust/lance-index/src/vector/hnsw/builder.rs:686-686 | Returns the metadata of this [`HNSW`]. |
| `pub fn with_params(params: HnswBuildParams, storage: &impl VectorStore) -&gt; Self` | rust/lance-index/src/vector/hnsw/builder.rs:764-764 | Create a new [`HNSWBuilder`] with prepared params and in memory vector storage. |
| `pub fn new(level: u16, nodes: &'a [RwLock&lt;GraphBuilderNode&gt;]) -&gt; Self` | rust/lance-index/src/vector/hnsw/builder.rs:1151-1151 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(level: u16, nodes: &'a [GraphBuilderNode]) -&gt; Self` | rust/lance-index/src/vector/hnsw/builder.rs:1173-1173 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(nodes: &'a [GraphBuilderNode]) -&gt; Self` | rust/lance-index/src/vector/hnsw/builder.rs:1203-1203 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct HnswQueryParams` | rust/lance-index/src/vector/hnsw/builder.rs:1470-1470 | No standalone documentation summary; use the family contract and source entry. |
| `pub ef: usize,` | rust/lance-index/src/vector/hnsw/builder.rs:1471-1471 | No standalone documentation summary; use the family contract and source entry. |
| `pub lower_bound: Option&lt;f32&gt;,` | rust/lance-index/src/vector/hnsw/builder.rs:1472-1472 | No standalone documentation summary; use the family contract and source entry. |
| `pub upper_bound: Option&lt;f32&gt;,` | rust/lance-index/src/vector/hnsw/builder.rs:1473-1473 | No standalone documentation summary; use the family contract and source entry. |
| `pub dist_q_c: f32,` | rust/lance-index/src/vector/hnsw/builder.rs:1474-1474 | No standalone documentation summary; use the family contract and source entry. |
| `pub use_acorn: bool,` | rust/lance-index/src/vector/hnsw/builder.rs:1475-1475 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-hnsw-index-rs"></a>

## `rust/lance-index/src/vector/hnsw/index.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct HNSWIndexOptions` | rust/lance-index/src/vector/hnsw/index.rs:45-45 | No standalone documentation summary; use the family contract and source entry. |
| `pub use_residual: bool,` | rust/lance-index/src/vector/hnsw/index.rs:46-46 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct HNSWIndex&lt;Q: Quantization&gt;` | rust/lance-index/src/vector/hnsw/index.rs:50-50 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn try_new( reader: Arc&lt;dyn Reader&gt;, aux_reader: Arc&lt;dyn Reader&gt;, options: HNSWIndexOptions, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/hnsw/index.rs:69-73 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn quantizer(&self) -&gt; &Quantizer` | rust/lance-index/src/vector/hnsw/index.rs:94-94 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn metadata(&self) -&gt; HnswMetadata` | rust/lance-index/src/vector/hnsw/index.rs:98-98 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-hnsw-online-rs"></a>

## `rust/lance-index/src/vector/hnsw/online.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct OnlineGraphBuilderNode` | rust/lance-index/src/vector/hnsw/online.rs:58-58 | A node in the online HNSW graph. |
| `pub fn new(target_level: u16) -&gt; Self` | rust/lance-index/src/vector/hnsw/online.rs:69-69 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct OnlineHnswBuilder` | rust/lance-index/src/vector/hnsw/online.rs:129-129 | Online HNSW builder with pre-allocated capacity. |
| `pub fn try_with_capacity(capacity: usize, params: HnswBuildParams) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/hnsw/online.rs:161-161 | Create a new builder with validated parameters. |
| `pub fn with_capacity(capacity: usize, params: HnswBuildParams) -&gt; Self` | rust/lance-index/src/vector/hnsw/online.rs:175-175 | Create a new builder with the given capacity. |
| `pub fn capacity(&self) -&gt; usize` | rust/lance-index/src/vector/hnsw/online.rs:205-205 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn len(&self) -&gt; usize` | rust/lance-index/src/vector/hnsw/online.rs:209-209 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance-index/src/vector/hnsw/online.rs:213-213 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn params(&self) -&gt; &HnswBuildParams` | rust/lance-index/src/vector/hnsw/online.rs:217-217 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn insert(&self, id: u32, storage: &impl VectorStore)` | rust/lance-index/src/vector/hnsw/online.rs:226-226 | Insert the node at `id` into the graph. |
| `pub fn search( &self, query: arrow_array::ArrayRef, k: usize, ef: usize, storage: &impl VectorStore, ) -&gt; Vec&lt;OrderedNode&gt;` | rust/lance-index/src/vector/hnsw/online.rs:399-405 | Search the graph for the k nearest neighbors of `query`. |
| `pub fn to_hnsw(&self) -&gt; HNSW` | rust/lance-index/src/vector/hnsw/online.rs:475-475 | Snapshot the current graph as an immutable on-disk Lance HNSW. |
| `pub fn finalize(self) -&gt; HNSW` | rust/lance-index/src/vector/hnsw/online.rs:553-553 | Backwards-compat shim: equivalent to `to_hnsw()` but consumes self. |
| `pub struct OnlineHnswLevelView&lt;'a&gt;` | rust/lance-index/src/vector/hnsw/online.rs:560-560 | View of a single level of an [`OnlineHnswBuilder`]'s graph for use with the shared [`Graph`]-trait search algorithms. |
| `pub fn new(level: u16, nodes: &'a [OnlineGraphBuilderNode]) -&gt; Self` | rust/lance-index/src/vector/hnsw/online.rs:566-566 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct OnlineHnswBottomView&lt;'a&gt;` | rust/lance-index/src/vector/hnsw/online.rs:588-588 | View of the bottom level (level 0) of an online HNSW for search. |
| `pub fn new(nodes: &'a [OnlineGraphBuilderNode]) -&gt; Self` | rust/lance-index/src/vector/hnsw/online.rs:593-593 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-hnsw-remap-rs"></a>

## `rust/lance-index/src/vector/hnsw/remap.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn remap_graph_batch(graph: &RecordBatch, new_ids: &[Option&lt;u32&gt;]) -&gt; Result&lt;RecordBatch&gt;` | rust/lance-index/src/vector/hnsw/remap.rs:50-50 | Rewrite a serialized HNSW graph after some of its nodes were removed. |
| `pub fn remap_graph_repair&lt;S: VectorStore + Sync&gt;( graph: &RecordBatch, new_ids: &[Option&lt;u32&gt;], storage: &S, ) -&gt; Result&lt;RecordBatch&gt;` | rust/lance-index/src/vector/hnsw/remap.rs:606-610 | Remap a graph and replace edges that pointed at deleted nodes. |

<a id="source-rust-lance-index-src-vector-ivf-rs"></a>

## `rust/lance-index/src/vector/ivf.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use builder::IvfBuildParams;` | rust/lance-index/src/vector/ivf.rs:11-11 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod builder;` | rust/lance-index/src/vector/ivf.rs:32-32 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod shuffler;` | rust/lance-index/src/vector/ivf.rs:33-33 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod storage;` | rust/lance-index/src/vector/ivf.rs:34-34 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_ivf_transformer( centroids: FixedSizeListArray, metric_type: DistanceType, transforms: Vec&lt;Arc&lt;dyn Transformer&gt;&gt;, ) -&gt; IvfTransformer` | rust/lance-index/src/vector/ivf.rs:46-50 | Create an IVF from the flatten centroids. |
| `pub fn new_ivf_transformer_with_quantizer( centroids: FixedSizeListArray, metric_type: MetricType, vector_column: &str, quantizer: Quantizer, range: Option&lt;Range&lt;u32&gt;&gt;, ) -&gt; Result&lt;IvfTransformer&gt;` | rust/lance-index/src/vector/ivf.rs:54-60 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct IvfTransformer` | rust/lance-index/src/vector/ivf.rs:91-91 | IVF - IVF file partition |
| `pub fn new( centroids: FixedSizeListArray, metric_type: MetricType, transforms: Vec&lt;Arc&lt;dyn Transformer&gt;&gt;, ) -&gt; Self` | rust/lance-index/src/vector/ivf.rs:106-110 | Create a new Ivf model. |
| `pub fn new_partition_transformer( centroids: FixedSizeListArray, distance_type: DistanceType, vector_column: &str, ) -&gt; Self` | rust/lance-index/src/vector/ivf.rs:118-122 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_flat( centroids: FixedSizeListArray, distance_type: DistanceType, vector_column: &str, range: Option&lt;Range&lt;u32&gt;&gt;, ) -&gt; Self` | rust/lance-index/src/vector/ivf.rs:145-150 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_pq( centroids: FixedSizeListArray, distance_type: DistanceType, vector_column: &str, pq: ProductQuantizer, range: Option&lt;Range&lt;u32&gt;&gt;, ) -&gt; Self` | rust/lance-index/src/vector/ivf.rs:188-194 | Create a IVF_PQ struct. |
| `pub fn compute_residual(&self, data: &FixedSizeListArray) -&gt; Result&lt;FixedSizeListArray&gt;` | rust/lance-index/src/vector/ivf.rs:331-331 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn compute_partitions(&self, data: &FixedSizeListArray) -&gt; Result&lt;UInt32Array&gt;` | rust/lance-index/src/vector/ivf.rs:336-336 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn find_partitions( &self, query: &dyn Array, nprobes: usize, ) -&gt; Result&lt;(UInt32Array, Float32Array)&gt;` | rust/lance-index/src/vector/ivf.rs:343-347 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-ivf-builder-rs"></a>

## `rust/lance-index/src/vector/ivf/builder.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct IvfBuildParams` | rust/lance-index/src/vector/ivf/builder.rs:19-19 | Parameters to build IVF partitions |
| `pub num_partitions: Option&lt;usize&gt;,` | rust/lance-index/src/vector/ivf/builder.rs:22-22 | Deprecated: use `target_partition_size` instead. Number of partitions to build. |
| `pub target_partition_size: Option&lt;usize&gt;,` | rust/lance-index/src/vector/ivf/builder.rs:27-27 | Target partition size. If set, the number of partitions will be computed based on the target partition size. Otherwise, the `target_partition_size` will be set by index type. |
| `pub max_iters: usize,` | rust/lance-index/src/vector/ivf/builder.rs:31-31 | Max number of iterations to train kmeans. |
| `pub centroids: Option&lt;Arc&lt;FixedSizeListArray&gt;&gt;,` | rust/lance-index/src/vector/ivf/builder.rs:34-34 | Use provided IVF centroids. |
| `pub retrain: bool,` | rust/lance-index/src/vector/ivf/builder.rs:38-38 | Retrain centroids. If true, the centroids will be retrained based on provided `centroids`. |
| `pub sample_rate: usize,` | rust/lance-index/src/vector/ivf/builder.rs:40-40 | No standalone documentation summary; use the family contract and source entry. |
| `pub streaming_sample_rate: Option&lt;usize&gt;,` | rust/lance-index/src/vector/ivf/builder.rs:51-51 | Optional per-step sample rate for streaming IVF kmeans training. |
| `pub streaming_coreset_rate: Option&lt;usize&gt;,` | rust/lance-index/src/vector/ivf/builder.rs:59-59 | Optional coreset rate for streaming IVF kmeans training. |
| `pub streaming_refine_passes: usize,` | rust/lance-index/src/vector/ivf/builder.rs:67-67 | Number of extra streaming Lloyd refinement passes to run after streaming coreset training. |
| `pub precomputed_partitions_file: Option&lt;String&gt;,` | rust/lance-index/src/vector/ivf/builder.rs:71-71 | Precomputed partitions file (row_id -&gt; partition_id) mutually exclusive with `precomputed_shuffle_buffers` |
| `pub precomputed_shuffle_buffers: Option&lt;(Path, Vec&lt;String&gt;)&gt;,` | rust/lance-index/src/vector/ivf/builder.rs:78-78 | Precomputed shuffle buffers (row_id -&gt; partition_id, pq_code) mutually exclusive with `precomputed_partitions_file` requires `centroids` to be set |
| `pub shuffle_partition_batches: usize,` | rust/lance-index/src/vector/ivf/builder.rs:80-80 | No standalone documentation summary; use the family contract and source entry. |
| `pub shuffle_partition_concurrency: usize,` | rust/lance-index/src/vector/ivf/builder.rs:82-82 | No standalone documentation summary; use the family contract and source entry. |
| `pub storage_options: Option&lt;HashMap&lt;String, String&gt;&gt;,` | rust/lance-index/src/vector/ivf/builder.rs:85-85 | Storage options used to load precomputed partitions. |
| `pub fn new(num_partitions: usize) -&gt; Self` | rust/lance-index/src/vector/ivf/builder.rs:111-111 | Create a new instance of `IvfBuildParams`. |
| `pub fn with_target_partition_size(target_partition_size: usize) -&gt; Self` | rust/lance-index/src/vector/ivf/builder.rs:118-118 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn try_with_centroids( num_partitions: usize, centroids: Arc&lt;FixedSizeListArray&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/ivf/builder.rs:126-129 | Create a new instance of [`IvfBuildParams`] with centroids. |
| `pub fn recommended_num_partitions(num_rows: usize, target_partition_size: usize) -&gt; usize` | rust/lance-index/src/vector/ivf/builder.rs:145-145 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn load_precomputed_partitions( stream: impl RecordBatchStream + Unpin + 'static, size_hint: usize, ) -&gt; Result&lt;HashMap&lt;u64, u32&gt;&gt;` | rust/lance-index/src/vector/ivf/builder.rs:156-159 | Load precomputed partitions from disk. |

<a id="source-rust-lance-index-src-vector-ivf-shuffler-rs"></a>

## `rust/lance-index/src/vector/ivf/shuffler.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub async fn shuffle_dataset( data: impl RecordBatchStream + Unpin + 'static, ivf: Arc&lt;IvfTransformer&gt;, precomputed_partitions: Option&lt;HashMap&lt;u64, u32&gt;&gt;, num_partitions: u32, shuffle_partition_batches: usize, shuffle_partition_concurrency: usize, precomputed_shuffle_buffers: Option&lt;(Path, Vec&lt;String&gt;)&gt;, ) -&gt; Result&lt;Vec&lt;impl Stream&lt;Item = Result&lt;RecordBatch&gt;&gt;&gt;&gt;` | rust/lance-index/src/vector/ivf/shuffler.rs:244-252 | Disk-based shuffle for a stream of [RecordBatch] into each IVF partition. Sub-quantizer will be applied if provided. |
| `pub async fn shuffle_vectors( unsorted_filenames: Vec&lt;String&gt;, dir_path: Path, ivf_centroids: FixedSizeListArray, shuffle_output_root_filename: &str, ) -&gt; Result&lt;Vec&lt;String&gt;&gt;` | rust/lance-index/src/vector/ivf/shuffler.rs:364-369 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct IvfShuffler` | rust/lance-index/src/vector/ivf/shuffler.rs:390-390 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn try_new( num_partitions: u32, output_dir: Option&lt;Path&gt;, is_legacy: bool, shuffle_output_root_filename: Option&lt;String&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/ivf/shuffler.rs:420-425 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_format_version(mut self, format_version: ConcreteFileVersion) -&gt; Self` | rust/lance-index/src/vector/ivf/shuffler.rs:450-450 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn set_unsorted_buffers(&mut self, unsorted_buffers: &[impl ToString])` | rust/lance-index/src/vector/ivf/shuffler.rs:456-456 | Set the unsorted buffers to be shuffled. |
| `pub async fn write_unsorted_stream( &mut self, data: impl Stream&lt;Item = Result&lt;RecordBatch&gt;&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance-index/src/vector/ivf/shuffler.rs:460-463 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn write_partitioned_shuffles( &self, batches_per_partition: usize, concurrent_jobs: usize, ) -&gt; Result&lt;Vec&lt;String&gt;&gt;` | rust/lance-index/src/vector/ivf/shuffler.rs:724-728 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn load_partitioned_shuffles( basedir: &Path, files: Vec&lt;String&gt;, ) -&gt; Result&lt;Vec&lt;impl Stream&lt;Item = Result&lt;RecordBatch&gt;&gt; + use&lt;&gt;&gt;&gt;` | rust/lance-index/src/vector/ivf/shuffler.rs:829-832 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-ivf-storage-rs"></a>

## `rust/lance-index/src/vector/ivf/storage.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const IVF_METADATA_KEY: &str = "lance:ivf";` | rust/lance-index/src/vector/ivf/storage.rs:22-22 | No standalone documentation summary; use the family contract and source entry. |
| `pub const IVF_PARTITION_KEY: &str = "lance:ivf:partition";` | rust/lance-index/src/vector/ivf/storage.rs:23-23 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct IvfModel` | rust/lance-index/src/vector/ivf/storage.rs:27-27 | Ivf Model |
| `pub centroids: Option&lt;FixedSizeListArray&gt;,` | rust/lance-index/src/vector/ivf/storage.rs:31-31 | Centroids of each partition. |
| `pub offsets: Vec&lt;usize&gt;,` | rust/lance-index/src/vector/ivf/storage.rs:34-34 | Offset of each partition in the file. |
| `pub lengths: Vec&lt;u32&gt;,` | rust/lance-index/src/vector/ivf/storage.rs:37-37 | Number of vectors in each partition. |
| `pub loss: Option&lt;f64&gt;,` | rust/lance-index/src/vector/ivf/storage.rs:40-40 | Kmeans loss |
| `pub fn empty() -&gt; Self` | rust/lance-index/src/vector/ivf/storage.rs:55-55 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(centroids: FixedSizeListArray, loss: Option&lt;f64&gt;) -&gt; Self` | rust/lance-index/src/vector/ivf/storage.rs:64-64 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn centroid(&self, partition: usize) -&gt; Option&lt;ArrayRef&gt;` | rust/lance-index/src/vector/ivf/storage.rs:73-73 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn dimension(&self) -&gt; usize` | rust/lance-index/src/vector/ivf/storage.rs:78-78 | Ivf model dimension. |
| `pub fn num_partitions(&self) -&gt; usize` | rust/lance-index/src/vector/ivf/storage.rs:86-86 | Number of IVF partitions. |
| `pub fn partition_size(&self, part: usize) -&gt; usize` | rust/lance-index/src/vector/ivf/storage.rs:93-93 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn num_rows(&self) -&gt; u64` | rust/lance-index/src/vector/ivf/storage.rs:97-97 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn loss(&self) -&gt; Option&lt;f64&gt;` | rust/lance-index/src/vector/ivf/storage.rs:101-101 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn find_partitions( &self, query: &dyn Array, nprobes: usize, distance_type: DistanceType, ) -&gt; Result&lt;(UInt32Array, Float32Array)&gt;` | rust/lance-index/src/vector/ivf/storage.rs:106-111 | Use the query vector to find `nprobes` closest partitions. |
| `pub fn add_partition(&mut self, len: u32)` | rust/lance-index/src/vector/ivf/storage.rs:121-121 | Add the offset and length of one partition. |
| `pub fn add_partition_with_offset(&mut self, offset: usize, len: u32)` | rust/lance-index/src/vector/ivf/storage.rs:131-131 | Add the offset and length of one partition with the given offset. this is used for old index format of IVF_PQ. |
| `pub fn centroids_array(&self) -&gt; Option&lt;&FixedSizeListArray&gt;` | rust/lance-index/src/vector/ivf/storage.rs:139-139 | Get a reference to all centroids as a [`FixedSizeListArray`]. |
| `pub fn row_range(&self, partition: usize) -&gt; Range&lt;usize&gt;` | rust/lance-index/src/vector/ivf/storage.rs:143-143 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn load(reader: &V1FileReader) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/ivf/storage.rs:149-149 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn write(&self, writer: &mut V1FileWriter&lt;ManifestDescribing&gt;) -&gt; Result&lt;()&gt;` | rust/lance-index/src/vector/ivf/storage.rs:170-170 | Write the IVF metadata to the lance file. |

<a id="source-rust-lance-index-src-vector-ivf-transform-rs"></a>

## `rust/lance-index/src/vector/ivf/transform.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct PartitionTransformer` | rust/lance-index/src/vector/ivf/transform.rs:37-37 | PartitionTransformer |
| `pub fn new( centroids: FixedSizeListArray, distance_type: DistanceType, input_column: impl AsRef&lt;str&gt;, ) -&gt; Self` | rust/lance-index/src/vector/ivf/transform.rs:47-51 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_distance(mut self, with_distance: bool) -&gt; Self` | rust/lance-index/src/vector/ivf/transform.rs:69-69 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(column: impl AsRef&lt;str&gt;, partition_range: Range&lt;u32&gt;) -&gt; Self` | rust/lance-index/src/vector/ivf/transform.rs:176-176 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-kmeans-rs"></a>

## `rust/lance-index/src/vector/kmeans.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub enum KMeanInit` | rust/lance-index/src/vector/kmeans.rs:57-57 | KMean initialization method. |
| `pub struct KMeansParams` | rust/lance-index/src/vector/kmeans.rs:64-64 | KMean Training Parameters |
| `pub max_iters: u32,` | rust/lance-index/src/vector/kmeans.rs:66-66 | Max number of iterations. |
| `pub tolerance: f64,` | rust/lance-index/src/vector/kmeans.rs:70-70 | When the difference of mean distance to the centroids is less than this `tolerance` threshold, stop the training. |
| `pub redos: usize,` | rust/lance-index/src/vector/kmeans.rs:73-73 | Run kmeans multiple times and pick the best (balanced) one. |
| `pub init: KMeanInit,` | rust/lance-index/src/vector/kmeans.rs:76-76 | Init methods. |
| `pub distance_type: DistanceType,` | rust/lance-index/src/vector/kmeans.rs:79-79 | The metric to calculate distance. |
| `pub balance_factor: f32,` | rust/lance-index/src/vector/kmeans.rs:86-86 | Balance factor for the kmeans clustering. Higher value means more balanced clustering. |
| `pub hierarchical_k: usize,` | rust/lance-index/src/vector/kmeans.rs:94-94 | The number of sub-clusters each node of the hierarchy is split into. |
| `pub refine_iters: u32,` | rust/lance-index/src/vector/kmeans.rs:104-104 | Number of global Lloyd iterations run over the whole training sample after the hierarchical tree is built, with every centroid competing for every vector. The tree fits each centroid only against its own sub-tree's vectors, so this pass repairs the boundaries between sub-trees. Each iteration costs about as much as assigning the training sample to the centroids once. Off by default (`0`); two iterations typically recover most of the gap to flat k-means in WCSS and recall. Non-hierarchical training already iterates globally and ignores it. |
| `pub seed: Option&lt;u64&gt;,` | rust/lance-index/src/vector/kmeans.rs:108-108 | Seed for centroid initialization. `None` draws a seed from the OS, so two trainings of the same data may pick different initial centroids. |
| `pub on_progress: Option&lt;Arc&lt;dyn Fn(u32, u32) + Send + Sync&gt;&gt;,` | rust/lance-index/src/vector/kmeans.rs:111-111 | Optional sync callback for iteration progress: (current_iteration, max_iterations). |
| `pub fn new( centroids: Option&lt;Arc&lt;FixedSizeListArray&gt;&gt;, max_iters: u32, redos: usize, distance_type: DistanceType, ) -&gt; Self` | rust/lance-index/src/vector/kmeans.rs:149-154 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_balance_factor(mut self, balance_factor: f32) -&gt; Self` | rust/lance-index/src/vector/kmeans.rs:173-173 | Set the balance factor for the kmeans clustering. |
| `pub fn with_on_progress(mut self, cb: Arc&lt;dyn Fn(u32, u32) + Send + Sync&gt;) -&gt; Self` | rust/lance-index/src/vector/kmeans.rs:178-178 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_hierarchical_k(mut self, hierarchical_k: usize) -&gt; Self` | rust/lance-index/src/vector/kmeans.rs:185-185 | Set the number of sub-clusters each node of the hierarchy is split into. See [`KMeansParams::hierarchical_k`]. |
| `pub fn with_refine_iters(mut self, refine_iters: u32) -&gt; Self` | rust/lance-index/src/vector/kmeans.rs:192-192 | Set the number of global refinement iterations run after hierarchical training. See [`KMeansParams::refine_iters`]. |
| `pub fn with_seed(mut self, seed: u64) -&gt; Self` | rust/lance-index/src/vector/kmeans.rs:198-198 | Seed centroid initialization, making training reproducible. |
| `pub trait KMeansAlgo&lt;T: Num&gt;` | rust/lance-index/src/vector/kmeans.rs:341-341 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct KMeansAlgoFloat&lt;T: ArrowNumericType&gt; where T::Native: Float + Num,` | rust/lance-index/src/vector/kmeans.rs:518-521 | No standalone documentation summary; use the family contract and source entry. |
| `pub type KMeansMembership = Vec&lt;Option&lt;u32&gt;&gt;;` | rust/lance-index/src/vector/kmeans.rs:771-771 | Cluster id assignment for each vector in a batch. |
| `pub type KMeansDistances = Vec&lt;Option&lt;f32&gt;&gt;;` | rust/lance-index/src/vector/kmeans.rs:774-774 | Distance from each vector to its assigned centroid. |
| `pub type KMeansClusterRadii = Vec&lt;f32&gt;;` | rust/lance-index/src/vector/kmeans.rs:777-777 | Maximum assignment distance per centroid. |
| `pub type KMeansClusterLosses = Vec&lt;f64&gt;;` | rust/lance-index/src/vector/kmeans.rs:780-780 | Sum of assignment distances per centroid. |
| `pub type KMeansMembershipAndLoss = (KMeansMembership, KMeansClusterRadii, KMeansClusterLosses);` | rust/lance-index/src/vector/kmeans.rs:783-783 | Batch assignment results with per-centroid radii and losses. |
| `pub type KMeansMembershipAndDistances = (KMeansMembership, KMeansDistances);` | rust/lance-index/src/vector/kmeans.rs:786-786 | Batch assignment results with per-vector distances. |
| `pub struct KMeans` | rust/lance-index/src/vector/kmeans.rs:844-844 | KMeans implementation for Apache Arrow Arrays. |
| `pub centroids: ArrayRef,` | rust/lance-index/src/vector/kmeans.rs:848-848 | Flattened array of centroids. |
| `pub dimension: usize,` | rust/lance-index/src/vector/kmeans.rs:851-851 | The dimension of each vector. |
| `pub distance_type: DistanceType,` | rust/lance-index/src/vector/kmeans.rs:854-854 | How to calculate distance between two vectors. |
| `pub loss: f64,` | rust/lance-index/src/vector/kmeans.rs:857-857 | The loss of the last training. |
| `pub fn with_centroids( centroids: ArrayRef, dimension: usize, distance_type: DistanceType, loss: f64, ) -&gt; Self` | rust/lance-index/src/vector/kmeans.rs:890-895 | Create a [`KMeans`] with existing centroids. It is useful for continuing training. |
| `pub fn new(data: &FixedSizeListArray, k: usize, max_iters: u32) -&gt; arrow::error::Result&lt;Self&gt;` | rust/lance-index/src/vector/kmeans.rs:926-926 | Train a KMeans model on data with `k` clusters. |
| `pub fn compute_membership_and_loss( &self, data: &FixedSizeListArray, ) -&gt; arrow::error::Result&lt;KMeansMembershipAndLoss&gt;` | rust/lance-index/src/vector/kmeans.rs:936-939 | Assign a batch of vectors to these centroids and return membership, radius, and loss. |
| `pub fn compute_membership_and_distances( &self, data: &FixedSizeListArray, ) -&gt; arrow::error::Result&lt;KMeansMembershipAndDistances&gt;` | rust/lance-index/src/vector/kmeans.rs:960-963 | Assign a batch of vectors to these centroids and return per-vector distances. |
| `pub fn compute_loss(&self, data: &FixedSizeListArray) -&gt; arrow::error::Result&lt;f64&gt;` | rust/lance-index/src/vector/kmeans.rs:1045-1045 | Compute the kmeans loss for a batch of vectors against these centroids. |
| `pub fn new_with_params( data: &FixedSizeListArray, k: usize, params: &KMeansParams, ) -&gt; arrow::error::Result&lt;Self&gt;` | rust/lance-index/src/vector/kmeans.rs:1595-1599 | Train a [`KMeans`] model with full parameters. |
| `pub fn kmeans_find_partitions_arrow_array( centroids: &FixedSizeListArray, query: &dyn Array, nprobes: usize, distance_type: DistanceType, ) -&gt; arrow::error::Result&lt;(UInt32Array, Float32Array)&gt;` | rust/lance-index/src/vector/kmeans.rs:1661-1666 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn kmeans_find_partitions&lt;T: Float + L2 + Dot&gt;( centroids: &[T], query: &[T], nprobes: usize, distance_type: DistanceType, ) -&gt; arrow::error::Result&lt;(UInt32Array, Float32Array)&gt;` | rust/lance-index/src/vector/kmeans.rs:1792-1797 | - *centroids*: a `k * dimension` floating array. - *query*: a `dimension` floating array. - *nprobes*: the number of partitions to find. - *distance_type*: the distance type to calculate distance. |
| `pub fn kmeans_find_partitions_binary( centroids: &[u8], query: &[u8], nprobes: usize, distance_type: DistanceType, ) -&gt; arrow::error::Result&lt;(UInt32Array, Float32Array)&gt;` | rust/lance-index/src/vector/kmeans.rs:1812-1817 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn compute_partitions_arrow_array( centroids: &FixedSizeListArray, vectors: &FixedSizeListArray, distance_type: DistanceType, ) -&gt; arrow::error::Result&lt;(Vec&lt;Option&lt;u32&gt;&gt;, Vec&lt;Option&lt;f32&gt;&gt;)&gt;` | rust/lance-index/src/vector/kmeans.rs:1839-1843 | Compute partitions from Arrow FixedSizeListArray. |
| `pub fn compute_partitions&lt;T: ArrowNumericType, K: KMeansAlgo&lt;T::Native&gt;&gt;( centroids: &PrimitiveArray&lt;T&gt;, vectors: &PrimitiveArray&lt;T&gt;, dimension: impl AsPrimitive&lt;usize&gt;, distance_type: DistanceType, ) -&gt; (Vec&lt;Option&lt;u32&gt;&gt;, f64) where T::Native: Num,` | rust/lance-index/src/vector/kmeans.rs:1903-1911 | Compute partition ID of each vector in the KMeans. |
| `pub fn compute_partitions_with_dists&lt;T: ArrowNumericType, K: KMeansAlgo&lt;T::Native&gt;&gt;( centroids: &PrimitiveArray&lt;T&gt;, vectors: &PrimitiveArray&lt;T&gt;, dimension: impl AsPrimitive&lt;usize&gt;, distance_type: DistanceType, ) -&gt; (Vec&lt;Option&lt;u32&gt;&gt;, Vec&lt;Option&lt;f32&gt;&gt;) where T::Native: Num,` | rust/lance-index/src/vector/kmeans.rs:1927-1935 | compute the partition id and the distance to the centroid for each vector, NOTE the distance is squared distance for L2 |
| `pub fn train_kmeans&lt;T: ArrowPrimitiveType&gt;( array: &PrimitiveArray&lt;T&gt;, mut params: KMeansParams, dimension: usize, k: usize, sample_rate: usize, ) -&gt; Result&lt;KMeans&gt; where T::Native: Dot + L2 + Normalize, PrimitiveArray&lt;T&gt;: From&lt;Vec&lt;T::Native&gt;&gt;,` | rust/lance-index/src/vector/kmeans.rs:1961-1971 | Train KMeans model and returns the centroids of each cluster. |
| `pub fn compute_partition&lt;T: Float + L2 + Dot&gt;( centroids: &[T], vector: &[T], distance_type: DistanceType, ) -&gt; Option&lt;u32&gt;` | rust/lance-index/src/vector/kmeans.rs:2002-2006 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-pairwise-rs"></a>

## `rust/lance-index/src/vector/pairwise.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const PAIRWISE_MEMORY_LIMIT: usize = 256 * 1024 * 1024;` | rust/lance-index/src/vector/pairwise.rs:49-49 | Default budget for staged codes. Larger partitions use session spill storage. |
| `pub struct PairwiseVectorBatch` | rust/lance-index/src/vector/pairwise.rs:65-65 | One staged batch of index rows in storage order. |
| `pub row_ids: UInt64Array,` | rust/lance-index/src/vector/pairwise.rs:67-67 | Current row IDs; null where compaction remapping deleted the row. |
| `pub codes: RecordBatch,` | rust/lance-index/src/vector/pairwise.rs:69-69 | Quantizer-specific staged payload, including the row IDs. |
| `pub fn batch_id(&self) -&gt; usize` | rust/lance-index/src/vector/pairwise.rs:76-76 | Position of this batch in the partition's storage order. |
| `pub fn num_rows(&self) -&gt; usize` | rust/lance-index/src/vector/pairwise.rs:80-80 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn selected(&self) -&gt; &[bool]` | rust/lance-index/src/vector/pairwise.rs:85-85 | Per-row eligibility for pairing. Rows with null IDs are never eligible. |
| `pub fn filter_rows(&mut self, keep: impl Fn(u64) -&gt; bool)` | rust/lance-index/src/vector/pairwise.rs:91-91 | Restrict pairing to rows whose current row ID satisfies `keep`, evaluated once per row rather than once per pair. |
| `pub struct PairwiseHits` | rust/lance-index/src/vector/pairwise.rs:101-101 | Qualifying pairs of one scoring block, ordered by anchor row, then by candidate row, in storage order. |
| `pub row_id_a: Vec&lt;u64&gt;,` | rust/lance-index/src/vector/pairwise.rs:102-102 | No standalone documentation summary; use the family contract and source entry. |
| `pub row_id_b: Vec&lt;u64&gt;,` | rust/lance-index/src/vector/pairwise.rs:103-103 | No standalone documentation summary; use the family contract and source entry. |
| `pub distances: Vec&lt;f32&gt;,` | rust/lance-index/src/vector/pairwise.rs:104-104 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct PairwisePartition` | rust/lance-index/src/vector/pairwise.rs:404-404 | Invocation-owned staged codes and quantizer state. Replays do not access the original index or source-table vectors. |
| `pub fn stage_in_memory( quantizer: &Quantizer, centroid: ArrayRef, metric: DistanceType, sources: &[RecordBatch], ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/pairwise.rs:416-421 | Stage each source batch as one in-memory staged batch, without row ID remapping. PQ sources must hold column-major codes. Benchmark support only; production staging goes through the IVF storage reader. |
| `pub fn vector_batch_size(&self) -&gt; usize` | rust/lance-index/src/vector/pairwise.rs:441-441 | Number of rows per staged batch, possibly smaller than the requested maximum to bound wide code arrays. The final batch can contain fewer rows. |
| `pub fn num_batches(&self) -&gt; usize` | rust/lance-index/src/vector/pairwise.rs:445-445 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn row_bytes(&self) -&gt; usize` | rust/lance-index/src/vector/pairwise.rs:450-450 | Estimated staged bytes per row, a proxy for per-pair scoring work. |
| `pub fn is_spilled(&self) -&gt; bool` | rust/lance-index/src/vector/pairwise.rs:457-457 | Whether staged batches live in spill storage. Each spilled [`Self::read_vectors`] decodes a fresh copy of the batch, while in-memory reads share the staged buffers. |
| `pub async fn read_vectors(&self, batch_id: usize) -&gt; Result&lt;PairwiseVectorBatch&gt;` | rust/lance-index/src/vector/pairwise.rs:462-462 | Read one staged batch. All rows with non-null IDs start out selected. |
| `pub fn score_block( &self, anchor: &PairwiseVectorBatch, anchor_rows: Range&lt;usize&gt;, candidates: &PairwiseVectorBatch, threshold: f32, ) -&gt; Result&lt;PairwiseHits&gt;` | rust/lance-index/src/vector/pairwise.rs:498-504 | Score `anchor_rows` of `anchor` against every later row of `candidates` (all of its rows for a later batch, rows after the anchor within the same batch) and keep selected pairs with distinct IDs and finite `distance &lt;= threshold`. Hits are ordered by anchor row, then candidate row. |

<a id="source-rust-lance-index-src-vector-pq-rs"></a>

## `rust/lance-index/src/vector/pq.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod builder;` | rust/lance-index/src/vector/pq.rs:24-24 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod distance;` | rust/lance-index/src/vector/pq.rs:25-25 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod storage;` | rust/lance-index/src/vector/pq.rs:27-27 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod transform;` | rust/lance-index/src/vector/pq.rs:28-28 | No standalone documentation summary; use the family contract and source entry. |
| `pub use self::utils::num_centroids;` | rust/lance-index/src/vector/pq.rs:34-34 | No standalone documentation summary; use the family contract and source entry. |
| `pub use builder::PQBuildParams;` | rust/lance-index/src/vector/pq.rs:40-40 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ProductQuantizer` | rust/lance-index/src/vector/pq.rs:44-44 | No standalone documentation summary; use the family contract and source entry. |
| `pub num_sub_vectors: usize,` | rust/lance-index/src/vector/pq.rs:45-45 | No standalone documentation summary; use the family contract and source entry. |
| `pub num_bits: u32,` | rust/lance-index/src/vector/pq.rs:46-46 | No standalone documentation summary; use the family contract and source entry. |
| `pub dimension: usize,` | rust/lance-index/src/vector/pq.rs:47-47 | No standalone documentation summary; use the family contract and source entry. |
| `pub codebook: FixedSizeListArray,` | rust/lance-index/src/vector/pq.rs:48-48 | No standalone documentation summary; use the family contract and source entry. |
| `pub distance_type: DistanceType,` | rust/lance-index/src/vector/pq.rs:49-49 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( num_sub_vectors: usize, num_bits: u32, dimension: usize, codebook: FixedSizeListArray, distance_type: DistanceType, ) -&gt; Self` | rust/lance-index/src/vector/pq.rs:100-106 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn from_proto(proto: &pb::Pq, distance_type: DistanceType) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/pq.rs:124-124 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn compute_distances(&self, query: &dyn Array, code: &UInt8Array) -&gt; Result&lt;Float32Array&gt;` | rust/lance-index/src/vector/pq.rs:272-272 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn centroids&lt;T: ArrowPrimitiveType&gt;(&self, sub_vector_idx: usize) -&gt; &[T::Native]` | rust/lance-index/src/vector/pq.rs:426-426 | Get the centroids for one sub-vector. |
| `pub fn validate_supplied_codebook( codebook_len: usize, dimension: usize, num_sub_vectors: usize, num_bits: usize, ) -&gt; Result&lt;()&gt;` | rust/lance-index/src/vector/pq.rs:456-461 | Reject a caller-supplied codebook whose size disagrees with the column. |

<a id="source-rust-lance-index-src-vector-pq-builder-rs"></a>

## `rust/lance-index/src/vector/pq/builder.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct PQBuildParams` | rust/lance-index/src/vector/pq/builder.rs:27-27 | Parameters for building product quantizer. |
| `pub num_sub_vectors: usize,` | rust/lance-index/src/vector/pq/builder.rs:29-29 | Number of sub-vectors to build PQ code |
| `pub num_bits: usize,` | rust/lance-index/src/vector/pq/builder.rs:32-32 | The number of bits to present one PQ centroid. |
| `pub max_iters: usize,` | rust/lance-index/src/vector/pq/builder.rs:35-35 | The max number of iterations for kmeans training. |
| `pub kmeans_redos: usize,` | rust/lance-index/src/vector/pq/builder.rs:39-39 | Run kmeans `REDOS` times and take the best result. Default to 1. |
| `pub codebook: Option&lt;ArrayRef&gt;,` | rust/lance-index/src/vector/pq/builder.rs:42-42 | User provided codebook. |
| `pub sample_rate: usize,` | rust/lance-index/src/vector/pq/builder.rs:45-45 | Sample rate to train PQ codebook. |
| `pub fn new(num_sub_vectors: usize, num_bits: usize) -&gt; Self` | rust/lance-index/src/vector/pq/builder.rs:86-86 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_codebook(num_sub_vectors: usize, num_bits: usize, codebook: ArrayRef) -&gt; Self` | rust/lance-index/src/vector/pq/builder.rs:94-94 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn build(&self, data: &dyn Array, distance_type: DistanceType) -&gt; Result&lt;ProductQuantizer&gt;` | rust/lance-index/src/vector/pq/builder.rs:201-201 | Build a [ProductQuantizer] from the given data. |

<a id="source-rust-lance-index-src-vector-pq-distance-rs"></a>

## `rust/lance-index/src/vector/pq/distance.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn build_distance_table_l2&lt;T: L2&gt;( codebook: &[T], num_bits: u32, num_sub_vectors: usize, query: &[T], ) -&gt; Vec&lt;f32&gt;` | rust/lance-index/src/vector/pq/distance.rs:15-20 | Build a Distance Table from the query to each PQ centroid using L2 distance. |
| `pub fn build_distance_table_l2_impl&lt;const NUM_BITS: u32, T: L2&gt;( codebook: &[T], num_sub_vectors: usize, query: &[T], ) -&gt; Vec&lt;f32&gt;` | rust/lance-index/src/vector/pq/distance.rs:29-33 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn build_distance_table_l2_prepared(l2_targets: &[L2Prepared], query: &[f32]) -&gt; Vec&lt;f32&gt;` | rust/lance-index/src/vector/pq/distance.rs:60-60 | Build an L2 distance table using pre-prepared [L2Prepared] per sub-vector. |
| `pub fn build_distance_table_dot&lt;T: Dot&gt;( codebook: &[T], num_bits: u32, num_sub_vectors: usize, query: &[T], ) -&gt; Vec&lt;f32&gt;` | rust/lance-index/src/vector/pq/distance.rs:79-84 | Build a Distance Table from the query to each PQ centroid using Dot distance. |
| `pub fn build_distance_table_dot_impl&lt;const NUM_BITS: u32, T: Dot&gt;( codebook: &[T], num_sub_vectors: usize, query: &[T], ) -&gt; Vec&lt;f32&gt;` | rust/lance-index/src/vector/pq/distance.rs:93-97 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-pq-pairwise-rs"></a>

## `rust/lance-index/src/vector/pq/pairwise.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct PQPairScorer` | rust/lance-index/src/vector/pq/pairwise.rs:28-28 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct PQKernel&lt;'a&gt;` | rust/lance-index/src/vector/pq/pairwise.rs:297-297 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-pq-storage-rs"></a>

## `rust/lance-index/src/vector/pq/storage.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const PQ_METADATA_KEY: &str = "lance:pq";` | rust/lance-index/src/vector/pq/storage.rs:61-61 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ProductQuantizationMetadata` | rust/lance-index/src/vector/pq/storage.rs:64-64 | No standalone documentation summary; use the family contract and source entry. |
| `pub codebook_position: usize,` | rust/lance-index/src/vector/pq/storage.rs:65-65 | No standalone documentation summary; use the family contract and source entry. |
| `pub nbits: u32,` | rust/lance-index/src/vector/pq/storage.rs:66-66 | No standalone documentation summary; use the family contract and source entry. |
| `pub num_sub_vectors: usize,` | rust/lance-index/src/vector/pq/storage.rs:67-67 | No standalone documentation summary; use the family contract and source entry. |
| `pub dimension: usize,` | rust/lance-index/src/vector/pq/storage.rs:68-68 | No standalone documentation summary; use the family contract and source entry. |
| `pub codebook: Option&lt;FixedSizeListArray&gt;,` | rust/lance-index/src/vector/pq/storage.rs:71-71 | No standalone documentation summary; use the family contract and source entry. |
| `pub codebook_tensor: Vec&lt;u8&gt;,` | rust/lance-index/src/vector/pq/storage.rs:76-76 | No standalone documentation summary; use the family contract and source entry. |
| `pub transposed: bool,` | rust/lance-index/src/vector/pq/storage.rs:77-77 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ProductQuantizationStorage` | rust/lance-index/src/vector/pq/storage.rs:169-169 | Product Quantization Storage |
| `pub fn new( codebook: FixedSizeListArray, batch: RecordBatch, num_bits: u32, num_sub_vectors: usize, dimension: usize, distance_type: DistanceType, transposed: bool, frag_reuse_index: Option&lt;Arc&lt;FragReuseIndex&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/pq/storage.rs:209-218 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn batch(&self) -&gt; &RecordBatch` | rust/lance-index/src/vector/pq/storage.rs:363-363 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn build( quantizer: ProductQuantizer, batch: &RecordBatch, vector_col: &str, frag_reuse_index: Option&lt;Arc&lt;FragReuseIndex&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/pq/storage.rs:377-382 | Build a PQ storage from ProductQuantizer and a RecordBatch. |
| `pub fn codebook(&self) -&gt; &FixedSizeListArray` | rust/lance-index/src/vector/pq/storage.rs:402-402 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn load( object_store: &ObjectStore, path: &Path, frag_reuse_index: Option&lt;Arc&lt;FragReuseIndex&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/pq/storage.rs:421-425 | Load full PQ storage from disk. |
| `pub fn schema(&self) -&gt; SchemaRef` | rust/lance-index/src/vector/pq/storage.rs:453-453 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn get_row_ids(&self, ids: &[u32]) -&gt; Vec&lt;u64&gt;` | rust/lance-index/src/vector/pq/storage.rs:457-457 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn write_partition( &self, writer: &mut V1FileWriter&lt;ManifestDescribing&gt;, ) -&gt; Result&lt;usize&gt;` | rust/lance-index/src/vector/pq/storage.rs:507-510 | Write the PQ storage as a Lance partition to disk, and returns the number of rows written. |
| `pub fn transpose&lt;T: ArrowPrimitiveType&gt;( original: &PrimitiveArray&lt;T&gt;, num_rows: usize, num_columns: usize, ) -&gt; PrimitiveArray&lt;T&gt; where PrimitiveArray&lt;T&gt;: From&lt;Vec&lt;T::Native&gt;&gt;,` | rust/lance-index/src/vector/pq/storage.rs:521-528 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct PQDistCalculator` | rust/lance-index/src/vector/pq/storage.rs:847-847 | Distance calculator backed by PQ code. |

<a id="source-rust-lance-index-src-vector-pq-transform-rs"></a>

## `rust/lance-index/src/vector/pq/transform.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct PQTransformer` | rust/lance-index/src/vector/pq/transform.rs:20-20 | Product Quantizer Transformer |
| `pub fn new(quantizer: ProductQuantizer, input_column: &str, output_column: &str) -&gt; Self` | rust/lance-index/src/vector/pq/transform.rs:27-27 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-pq-utils-rs"></a>

## `rust/lance-index/src/vector/pq/utils.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn num_centroids(num_bits: impl Into&lt;u32&gt;) -&gt; usize` | rust/lance-index/src/vector/pq/utils.rs:57-57 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn get_sub_vector_centroids&lt;const NUM_BITS: u32, T&gt;( codebook: &[T], dimension: usize, num_sub_vectors: usize, sub_vector_idx: usize, ) -&gt; &[T]` | rust/lance-index/src/vector/pq/utils.rs:62-67 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-quantizer-rs"></a>

## `rust/lance-index/src/vector/quantizer.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub trait Quantization: Send + Sync + Clone + Debug + DeepSizeOf + Into&lt;Quantizer&gt; + TryFrom&lt;Quantizer, Error = lance_core::Error&gt;` | rust/lance-index/src/vector/quantizer.rs:32-40 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum QuantizationType` | rust/lance-index/src/vector/quantizer.rs:68-68 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait QuantizerBuildParams: Send + Sync` | rust/lance-index/src/vector/quantizer.rs:105-105 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum Quantizer` | rust/lance-index/src/vector/quantizer.rs:146-146 | Quantization Method. |
| `pub fn code_dim(&self) -&gt; usize` | rust/lance-index/src/vector/quantizer.rs:155-155 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn column(&self) -&gt; &'static str` | rust/lance-index/src/vector/quantizer.rs:165-165 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn metadata_key(&self) -&gt; &'static str` | rust/lance-index/src/vector/quantizer.rs:175-175 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn quantization_type(&self) -&gt; QuantizationType` | rust/lance-index/src/vector/quantizer.rs:185-185 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn metadata(&self, args: Option&lt;QuantizationMetadata&gt;) -&gt; Result&lt;serde_json::Value&gt;` | rust/lance-index/src/vector/quantizer.rs:195-195 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct QuantizationMetadata` | rust/lance-index/src/vector/quantizer.rs:220-220 | No standalone documentation summary; use the family contract and source entry. |
| `pub codebook_position: Option&lt;usize&gt;,` | rust/lance-index/src/vector/quantizer.rs:222-222 | No standalone documentation summary; use the family contract and source entry. |
| `pub codebook: Option&lt;FixedSizeListArray&gt;,` | rust/lance-index/src/vector/quantizer.rs:223-223 | No standalone documentation summary; use the family contract and source entry. |
| `pub transposed: bool,` | rust/lance-index/src/vector/quantizer.rs:224-224 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait QuantizerMetadata: fmt::Debug + Clone + Sized + DeepSizeOf + for&lt;'a&gt; Deserialize&lt;'a&gt; + Serialize` | rust/lance-index/src/vector/quantizer.rs:228-230 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait QuantizerStorage: Clone + Sized + DeepSizeOf + VectorStore` | rust/lance-index/src/vector/quantizer.rs:260-260 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct IvfQuantizationStorage&lt;Q: Quantization&gt;` | rust/lance-index/src/vector/quantizer.rs:336-336 | Loader to load partitioned [VectorStore] from disk. |
| `pub async fn open(reader: Arc&lt;dyn Reader&gt;) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/quantizer.rs:371-371 | Open a Loader. |
| `pub fn distance_type(&self) -&gt; DistanceType` | rust/lance-index/src/vector/quantizer.rs:400-400 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn quantizer(&self) -&gt; &Quantizer` | rust/lance-index/src/vector/quantizer.rs:404-404 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn metadata(&self) -&gt; &Q::Metadata` | rust/lance-index/src/vector/quantizer.rs:408-408 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn num_partitions(&self) -&gt; usize` | rust/lance-index/src/vector/quantizer.rs:413-413 | Get the number of partitions in the storage. |
| `pub async fn load_partition(&self, part_id: usize) -&gt; Result&lt;Q::Storage&gt;` | rust/lance-index/src/vector/quantizer.rs:423-423 | Load one partition of vector storage. |

<a id="source-rust-lance-index-src-vector-residual-rs"></a>

## `rust/lance-index/src/vector/residual.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct ResidualTransform` | rust/lance-index/src/vector/residual.rs:29-29 | Compute the residual vector of a Vector Matrix to their centroids. |
| `pub fn new(centroids: FixedSizeListArray, part_col: &str, column: &str) -&gt; Self` | rust/lance-index/src/vector/residual.rs:47-47 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-shared-mod-rs"></a>

## `rust/lance-index/src/vector/shared/mod.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod partition_merger;` | rust/lance-index/src/vector/shared/mod.rs:10-10 | No standalone documentation summary; use the family contract and source entry. |
| `pub use partition_merger::*;` | rust/lance-index/src/vector/shared/mod.rs:11-11 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-shared-partition-merger-rs"></a>

## `rust/lance-index/src/vector/shared/partition_merger.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub enum SupportedIvfIndexType` | rust/lance-index/src/vector/shared/partition_merger.rs:34-34 | Supported vector index types for unified IVF metadata writing. |
| `pub fn as_str(&self) -&gt; &'static str` | rust/lance-index/src/vector/shared/partition_merger.rs:46-46 | Get the index type string used in metadata. |
| `pub fn from_index_type_str(s: &str) -&gt; Option&lt;Self&gt;` | rust/lance-index/src/vector/shared/partition_merger.rs:61-61 | Map an index type string (as stored in metadata) to a [`SupportedIvfIndexType`] if it is one of the IVF variants this helper understands. |
| `pub fn detect_from_reader_and_schema(reader: &V2Reader, schema: &ArrowSchema) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/shared/partition_merger.rs:78-78 | Detect index type from reader metadata and schema. |
| `pub async fn write_unified_ivf_and_index_metadata( w: &mut FileWriter, ivf_model: &IvfModel, dt: DistanceType, idx_type: SupportedIvfIndexType, ) -&gt; Result&lt;()&gt;` | rust/lance-index/src/vector/shared/partition_merger.rs:134-139 | Write unified IVF and index metadata to the writer. |

<a id="source-rust-lance-index-src-vector-sq-rs"></a>

## `rust/lance-index/src/vector/sq.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod builder;` | rust/lance-index/src/vector/sq.rs:23-23 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod storage;` | rust/lance-index/src/vector/sq.rs:25-25 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod transform;` | rust/lance-index/src/vector/sq.rs:26-26 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ScalarQuantizer` | rust/lance-index/src/vector/sq.rs:33-33 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(num_bits: u16, dim: usize) -&gt; Self` | rust/lance-index/src/vector/sq.rs:44-44 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_bounds(num_bits: u16, dim: usize, bounds: Range&lt;f64&gt;) -&gt; Self` | rust/lance-index/src/vector/sq.rs:57-57 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn num_bits(&self) -&gt; u16` | rust/lance-index/src/vector/sq.rs:63-63 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn update_bounds&lt;T: ArrowFloatType&gt;( &mut self, vectors: &FixedSizeListArray, ) -&gt; Result&lt;Range&lt;f64&gt;&gt;` | rust/lance-index/src/vector/sq.rs:67-70 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn transform&lt;T: ArrowFloatType&gt;(&self, data: &dyn Array) -&gt; Result&lt;ArrayRef&gt;` | rust/lance-index/src/vector/sq.rs:88-88 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn bounds(&self) -&gt; Range&lt;f64&gt;` | rust/lance-index/src/vector/sq.rs:115-115 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn use_residual(&self) -&gt; bool` | rust/lance-index/src/vector/sq.rs:120-120 | Whether to use residual as input or not. |

<a id="source-rust-lance-index-src-vector-sq-builder-rs"></a>

## `rust/lance-index/src/vector/sq/builder.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct SQBuildParams` | rust/lance-index/src/vector/sq/builder.rs:7-7 | No standalone documentation summary; use the family contract and source entry. |
| `pub num_bits: u16,` | rust/lance-index/src/vector/sq/builder.rs:9-9 | Number of bits of scaling range. |
| `pub sample_rate: usize,` | rust/lance-index/src/vector/sq/builder.rs:12-12 | Sample rate for training. |

<a id="source-rust-lance-index-src-vector-sq-pairwise-rs"></a>

## `rust/lance-index/src/vector/sq/pairwise.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct SQPairScorer` | rust/lance-index/src/vector/sq/pairwise.rs:45-45 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct SQKernel&lt;'a&gt;` | rust/lance-index/src/vector/sq/pairwise.rs:243-243 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-sq-storage-rs"></a>

## `rust/lance-index/src/vector/sq/storage.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const SQ_METADATA_KEY: &str = "lance:sq";` | rust/lance-index/src/vector/sq/storage.rs:40-40 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ScalarQuantizationMetadata` | rust/lance-index/src/vector/sq/storage.rs:43-43 | No standalone documentation summary; use the family contract and source entry. |
| `pub dim: usize,` | rust/lance-index/src/vector/sq/storage.rs:44-44 | No standalone documentation summary; use the family contract and source entry. |
| `pub num_bits: u16,` | rust/lance-index/src/vector/sq/storage.rs:45-45 | No standalone documentation summary; use the family contract and source entry. |
| `pub bounds: Range&lt;f64&gt;,` | rust/lance-index/src/vector/sq/storage.rs:46-46 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ScalarQuantizationStorage` | rust/lance-index/src/vector/sq/storage.rs:150-150 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn try_new( num_bits: u16, distance_type: DistanceType, bounds: Range&lt;f64&gt;, batches: impl IntoIterator&lt;Item = RecordBatch&gt;, frag_reuse_index: Option&lt;Arc&lt;FragReuseIndex&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/sq/storage.rs:172-178 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn load( object_store: &ObjectStore, path: &Path, frag_reuse_index: Option&lt;Arc&lt;FragReuseIndex&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/sq/storage.rs:226-230 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct SQDistCalculator&lt;'a&gt;` | rust/lance-index/src/vector/sq/storage.rs:446-446 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-sq-transform-rs"></a>

## `rust/lance-index/src/vector/sq/transform.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct SQTransformer` | rust/lance-index/src/vector/sq/transform.rs:24-24 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(quantizer: ScalarQuantizer, input_column: String, output_column: String) -&gt; Self` | rust/lance-index/src/vector/sq/transform.rs:31-31 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-storage-rs"></a>

## `rust/lance-index/src/vector/storage.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub trait DistCalculator` | rust/lance-index/src/vector/storage.rs:117-117 | &lt;section class="warning"&gt; Internal API |
| `pub const STORAGE_METADATA_KEY: &str = "storage_metadata";` | rust/lance-index/src/vector/storage.rs:249-249 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct QueryScratch` | rust/lance-index/src/vector/storage.rs:252-252 | No standalone documentation summary; use the family contract and source entry. |
| `pub distances: Vec&lt;f32&gt;,` | rust/lance-index/src/vector/storage.rs:253-253 | No standalone documentation summary; use the family contract and source entry. |
| `pub query_f32: Vec&lt;f32&gt;,` | rust/lance-index/src/vector/storage.rs:254-254 | No standalone documentation summary; use the family contract and source entry. |
| `pub u16: Vec&lt;u16&gt;,` | rust/lance-index/src/vector/storage.rs:255-255 | No standalone documentation summary; use the family contract and source entry. |
| `pub u8: Vec&lt;u8&gt;,` | rust/lance-index/src/vector/storage.rs:256-256 | No standalone documentation summary; use the family contract and source entry. |
| `pub u32: Vec&lt;u32&gt;,` | rust/lance-index/src/vector/storage.rs:257-257 | No standalone documentation summary; use the family contract and source entry. |
| `pub const fn new() -&gt; Self` | rust/lance-index/src/vector/storage.rs:261-261 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_capacity(capacity: QueryScratchCapacity) -&gt; Self` | rust/lance-index/src/vector/storage.rs:271-271 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct QueryScratchCapacity` | rust/lance-index/src/vector/storage.rs:299-299 | No standalone documentation summary; use the family contract and source entry. |
| `pub distances: usize,` | rust/lance-index/src/vector/storage.rs:300-300 | No standalone documentation summary; use the family contract and source entry. |
| `pub query_f32: usize,` | rust/lance-index/src/vector/storage.rs:301-301 | No standalone documentation summary; use the family contract and source entry. |
| `pub u16: usize,` | rust/lance-index/src/vector/storage.rs:302-302 | No standalone documentation summary; use the family contract and source entry. |
| `pub u8: usize,` | rust/lance-index/src/vector/storage.rs:303-303 | No standalone documentation summary; use the family contract and source entry. |
| `pub u32: usize,` | rust/lance-index/src/vector/storage.rs:304-304 | No standalone documentation summary; use the family contract and source entry. |
| `pub const fn new(distances: usize, query_f32: usize, u16: usize, u8: usize) -&gt; Self` | rust/lance-index/src/vector/storage.rs:308-308 | No standalone documentation summary; use the family contract and source entry. |
| `pub const fn new_with_u32( distances: usize, query_f32: usize, u16: usize, u8: usize, u32: usize, ) -&gt; Self` | rust/lance-index/src/vector/storage.rs:312-318 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct DistanceCalculatorOptions` | rust/lance-index/src/vector/storage.rs:338-338 | No standalone documentation summary; use the family contract and source entry. |
| `pub approx_mode: ApproxMode,` | rust/lance-index/src/vector/storage.rs:339-339 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct RabitRawQueryContext` | rust/lance-index/src/vector/storage.rs:343-343 | No standalone documentation summary; use the family contract and source entry. |
| `pub code_dim: usize,` | rust/lance-index/src/vector/storage.rs:344-344 | No standalone documentation summary; use the family contract and source entry. |
| `pub ex_bits: u8,` | rust/lance-index/src/vector/storage.rs:345-345 | No standalone documentation summary; use the family contract and source entry. |
| `pub rotated_query: Vec&lt;f32&gt;,` | rust/lance-index/src/vector/storage.rs:346-346 | No standalone documentation summary; use the family contract and source entry. |
| `pub dist_table: Vec&lt;f32&gt;,` | rust/lance-index/src/vector/storage.rs:347-347 | No standalone documentation summary; use the family contract and source entry. |
| `pub ex_query: Vec&lt;f32&gt;,` | rust/lance-index/src/vector/storage.rs:351-351 | The rotated query zero-padded to a 64-dim multiple for the ex-dot kernels; empty when `code_dim` is already aligned (the kernels then read `rotated_query` directly). |
| `pub sum_q: f32,` | rust/lance-index/src/vector/storage.rs:352-352 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum QueryResidual&lt;'a&gt;` | rust/lance-index/src/vector/storage.rs:356-356 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct QueryScratchPool` | rust/lance-index/src/vector/storage.rs:365-365 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(size: usize) -&gt; Self` | rust/lance-index/src/vector/storage.rs:371-371 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_capacity(size: usize, capacity: QueryScratchCapacity) -&gt; Self` | rust/lance-index/src/vector/storage.rs:375-375 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn scratch(&self) -&gt; QueryScratchGuard&lt;'_&gt;` | rust/lance-index/src/vector/storage.rs:389-389 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_scratch&lt;T&gt;(&self, f: impl FnOnce(&mut QueryScratch) -&gt; T) -&gt; T` | rust/lance-index/src/vector/storage.rs:402-402 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct QueryScratchGuard&lt;'a&gt;` | rust/lance-index/src/vector/storage.rs:408-408 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait VectorStore: Send + Sync + Sized + Clone` | rust/lance-index/src/vector/storage.rs:476-476 | Vector Storage is the abstraction to store the vectors. |
| `pub struct StorageBuilder&lt;Q: Quantization&gt;` | rust/lance-index/src/vector/storage.rs:540-540 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( vector_column: String, distance_type: DistanceType, quantizer: Q, frag_reuse_index: Option&lt;Arc&lt;FragReuseIndex&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/storage.rs:549-554 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_remapper( vector_column: String, distance_type: DistanceType, quantizer: Q, frag_reuse_index: Option&lt;Arc&lt;dyn RowIdRemapper&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/storage.rs:561-566 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn build(&self, batches: Vec&lt;RecordBatch&gt;) -&gt; Result&lt;Q::Storage&gt;` | rust/lance-index/src/vector/storage.rs:575-575 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct IvfQuantizationStorage&lt;Q: Quantization&gt;` | rust/lance-index/src/vector/storage.rs:606-606 | Loader to load partitioned PQ storage from disk. |
| `pub async fn try_new( reader: FileReader, frag_reuse_index: Option&lt;Arc&lt;FragReuseIndex&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/storage.rs:630-633 | Open a Loader. |
| `pub async fn try_new_with_remapper( reader: FileReader, frag_reuse_index: Option&lt;Arc&lt;dyn RowIdRemapper&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance-index/src/vector/storage.rs:640-643 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn from_cached( reader: FileReader, ivf: IvfModel, metadata: Q::Metadata, distance_type: DistanceType, frag_reuse_index: Option&lt;Arc&lt;FragReuseIndex&gt;&gt;, ) -&gt; Self` | rust/lance-index/src/vector/storage.rs:708-714 | Construct from pre-parsed metadata, skipping global buffer reads. Used when reconstructing from a disk cache. |
| `pub fn from_cached_with_remapper( reader: FileReader, ivf: IvfModel, metadata: Q::Metadata, distance_type: DistanceType, frag_reuse_index: Option&lt;Arc&lt;dyn RowIdRemapper&gt;&gt;, ) -&gt; Self` | rust/lance-index/src/vector/storage.rs:721-727 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_row_id_remapping(mut self, remapping: Arc&lt;dyn BatchRowIdRemapper&gt;) -&gt; Self` | rust/lance-index/src/vector/storage.rs:742-742 | Set the batch row-ID remapper used when decoding each partition. |
| `pub fn reader(&self) -&gt; &FileReader` | rust/lance-index/src/vector/storage.rs:749-749 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn ivf(&self) -&gt; &IvfModel` | rust/lance-index/src/vector/storage.rs:753-753 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn num_rows(&self) -&gt; u64` | rust/lance-index/src/vector/storage.rs:757-757 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn partition_size(&self, part_id: usize) -&gt; usize` | rust/lance-index/src/vector/storage.rs:761-761 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn quantizer(&self) -&gt; Result&lt;Quantizer&gt;` | rust/lance-index/src/vector/storage.rs:765-765 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn metadata(&self) -&gt; &Q::Metadata` | rust/lance-index/src/vector/storage.rs:770-770 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn distance_type(&self) -&gt; DistanceType` | rust/lance-index/src/vector/storage.rs:774-774 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn schema(&self) -&gt; SchemaRef` | rust/lance-index/src/vector/storage.rs:778-778 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn num_partitions(&self) -&gt; usize` | rust/lance-index/src/vector/storage.rs:783-783 | Get the number of partitions in the storage. |
| `pub async fn load_partition( &self, part_id: usize, io_stats: Option&lt;IoStats&gt;, ) -&gt; Result&lt;Q::Storage&gt;` | rust/lance-index/src/vector/storage.rs:794-798 | Load a partition's quantization storage, optionally measuring the exact I/O it performs into `io_stats`. |
| `pub async fn prepare_pairwise_partition( &self, partition_id: usize, batch_size: usize, memory_limit: usize, centroid: ArrayRef, spill_store: &dyn SpillStore, ) -&gt; Result&lt;PairwisePartition&gt;` | rust/lance-index/src/vector/storage.rs:894-901 | Stage a partition's codes once for native pair scoring, in storage order. |
| `pub async fn materialize_partition_for_prewarm( &self, batches: Vec&lt;RecordBatch&gt;, ) -&gt; Result&lt;Q::Storage&gt; where Q::Metadata: 'static, Q::Storage: 'static,` | rust/lance-index/src/vector/storage.rs:1117-1124 | Materialize a compact partition for the parallel prewarm path. |

<a id="source-rust-lance-index-src-vector-transform-rs"></a>

## `rust/lance-index/src/vector/transform.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub trait Transformer: Debug + Send + Sync` | rust/lance-index/src/vector/transform.rs:25-25 | Transform of a Vector Matrix. |
| `pub struct NormalizeTransformer` | rust/lance-index/src/vector/transform.rs:35-35 | Normalize Transformer |
| `pub fn new(column: impl AsRef&lt;str&gt;) -&gt; Self` | rust/lance-index/src/vector/transform.rs:41-41 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_output(input_column: impl AsRef&lt;str&gt;, output_column: impl AsRef&lt;str&gt;) -&gt; Self` | rust/lance-index/src/vector/transform.rs:50-50 | Create Normalize output transform that will be stored in a different column. |
| `pub fn new(column: impl AsRef&lt;str&gt;) -&gt; Self` | rust/lance-index/src/vector/transform.rs:89-89 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct DropColumn` | rust/lance-index/src/vector/transform.rs:156-156 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(column: &str) -&gt; Self` | rust/lance-index/src/vector/transform.rs:161-161 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct Flatten` | rust/lance-index/src/vector/transform.rs:175-175 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(column: &str) -&gt; Self` | rust/lance-index/src/vector/transform.rs:180-180 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-utils-rs"></a>

## `rust/lance-index/src/vector/utils.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct SimpleIndex` | rust/lance-index/src/vector/utils.rs:92-92 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn may_train_index( centroids: ArrayRef, dimension: usize, distance_type: DistanceType, ) -&gt; Result&lt;Option&lt;Self&gt;&gt;` | rust/lance-index/src/vector/utils.rs:125-129 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_finite(fsl: &FixedSizeListArray) -&gt; BooleanArray` | rust/lance-index/src/vector/utils.rs:321-321 | Check if all vectors in the FixedSizeListArray are finite null values are considered as not finite returns a BooleanArray with the same length as the FixedSizeListArray with true for finite values and false for non-finite values |

<a id="source-rust-lance-index-src-vector-v3-rs"></a>

## `rust/lance-index/src/vector/v3.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod shuffle_bench;` | rust/lance-index/src/vector/v3.rs:5-5 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod shuffler;` | rust/lance-index/src/vector/v3.rs:6-6 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod subindex;` | rust/lance-index/src/vector/v3.rs:7-7 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-v3-shuffler-rs"></a>

## `rust/lance-index/src/vector/v3/shuffler.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const DEFAULT_PARTITION_WINDOW_BYTES: usize = 128 * 1024 * 1024;` | rust/lance-index/src/vector/v3/shuffler.rs:39-39 | Target decoded size for a contiguous shuffle partition window. |
| `pub struct ShufflePartition` | rust/lance-index/src/vector/v3/shuffler.rs:42-42 | One partition returned by [`ShuffleReader::read_partition_window`]. |
| `pub partition_id: usize,` | rust/lance-index/src/vector/v3/shuffler.rs:44-44 | Zero-based IVF partition identifier. |
| `pub data: Option&lt;Box&lt;dyn RecordBatchStream + Unpin + 'static&gt;&gt;,` | rust/lance-index/src/vector/v3/shuffler.rs:46-46 | Partition rows, or `None` when the partition is empty. |
| `pub struct ShufflePartitionWindow` | rust/lance-index/src/vector/v3/shuffler.rs:50-50 | A contiguous range of shuffled partitions read as one I/O window. |
| `pub partition_range: Range&lt;usize&gt;,` | rust/lance-index/src/vector/v3/shuffler.rs:52-52 | Half-open range covered by `partitions`. |
| `pub partitions: Vec&lt;ShufflePartition&gt;,` | rust/lance-index/src/vector/v3/shuffler.rs:54-54 | One entry per partition in `partition_range`, including empty ones. |
| `pub materialized_decoded_bytes: Option&lt;usize&gt;,` | rust/lance-index/src/vector/v3/shuffler.rs:57-57 | Decoded bytes already materialized by the reader, counted once per backing Arrow allocation. `None` means the returned streams are lazy. |
| `pub struct ShufflePartitionWindowPlan` | rust/lance-index/src/vector/v3/shuffler.rs:61-61 | Metadata-only plan for a contiguous shuffle partition window. |
| `pub partition_range: Range&lt;usize&gt;,` | rust/lance-index/src/vector/v3/shuffler.rs:63-63 | Half-open partition range that the subsequent read will return. |
| `pub estimated_decoded_bytes: usize,` | rust/lance-index/src/vector/v3/shuffler.rs:65-65 | Conservative decoded-memory admission charge for the read. |
| `pub trait ShuffleReader: Send + Sync` | rust/lance-index/src/vector/v3/shuffler.rs:70-70 | A reader that can read the shuffled partitions. |
| `pub trait Shuffler: Send + Sync` | rust/lance-index/src/vector/v3/shuffler.rs:155-155 | A shuffler that can shuffle the incoming stream of record batches into IVF partitions. Returns a IvfShuffleReader that can be used to read the shuffled partitions. |
| `pub struct IvfShuffler` | rust/lance-index/src/vector/v3/shuffler.rs:164-164 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(output_dir: Path, num_partitions: usize) -&gt; Self` | rust/lance-index/src/vector/v3/shuffler.rs:174-174 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_format_version(mut self, format_version: ConcreteFileVersion) -&gt; Self` | rust/lance-index/src/vector/v3/shuffler.rs:184-184 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_progress(mut self, progress: Arc&lt;dyn crate::progress::IndexBuildProgress&gt;) -&gt; Self` | rust/lance-index/src/vector/v3/shuffler.rs:189-189 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct IvfShufflerReader` | rust/lance-index/src/vector/v3/shuffler.rs:310-310 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( object_store: Arc&lt;ObjectStore&gt;, output_dir: Path, partition_sizes: Vec&lt;usize&gt;, loss: f64, ) -&gt; Self` | rust/lance-index/src/vector/v3/shuffler.rs:319-324 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct EmptyReader;` | rust/lance-index/src/vector/v3/shuffler.rs:427-427 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn create_ivf_shuffler( output_dir: Path, num_partitions: usize, format_version: ConcreteFileVersion, progress: Option&lt;Arc&lt;dyn crate::progress::IndexBuildProgress&gt;&gt;, ) -&gt; Box&lt;dyn Shuffler&gt;` | rust/lance-index/src/vector/v3/shuffler.rs:454-459 | Create an IVF shuffler. Uses [`TwoFileShuffler`] by default, which writes all data to just two files (data + offsets) instead of one file per partition. Set `LANCE_LEGACY_SHUFFLER=1` to fall back to [`IvfShuffler`], which opens one file per partition. |
| `pub struct TwoFileShuffler` | rust/lance-index/src/vector/v3/shuffler.rs:554-554 | A shuffler that writes all data to just two files (data + offsets) instead of one file per partition. This avoids hitting OS file descriptor limits when there are many partitions. |
| `pub fn new(output_dir: Path, num_partitions: usize) -&gt; Self` | rust/lance-index/src/vector/v3/shuffler.rs:564-564 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_progress(mut self, progress: Arc&lt;dyn crate::progress::IndexBuildProgress&gt;) -&gt; Self` | rust/lance-index/src/vector/v3/shuffler.rs:574-574 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct TwoFileShuffleReader` | rust/lance-index/src/vector/v3/shuffler.rs:857-857 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-index-src-vector-v3-subindex-rs"></a>

## `rust/lance-index/src/vector/v3/subindex.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub trait IvfSubIndex: Send + Sync + Debug + DeepSizeOf` | rust/lance-index/src/vector/v3/subindex.rs:19-19 | A sub index for IVF index |
| `pub enum SubIndexType` | rust/lance-index/src/vector/v3/subindex.rs:128-128 | No standalone documentation summary; use the family contract and source entry. |

