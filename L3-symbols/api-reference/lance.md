# lance: public declaration and documented-contract directory

> Refresh 2026-10-12, `011953c22097b67b699595adbe99e7f0155d83e4`: source coordinates updated. [Changed contracts](../refresh-2026-10-12.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refreshed 2026-10-04 against `ad12ed9e15e0046688b00568d0ac1a347fb2d328`; changed-source pointers re-anchored. Unchanged analysis retained.

**Trust: declared source interface; body behavior is verified only where the linked family/protocol contract says so.** This catalog supplies exact argument/type entry points and the source author's first documentation paragraph. It is not an inferred call graph or a second symbol ledger. Rust `pub` can occur under a private/feature-gated module; confirm re-export and cfg boundaries before changing an external API. Trait method contracts and enum variants are reached through the trait/type entry. Python inherited external-library APIs are outside direct-source scope.

[Family contracts](../public-api.md) · [Module Map](../../L1-modules/rust-lance.md) · [Scope](../../V21-PROTOCOL.md)

<a id="source-rust-lance-src-arrow-rs"></a>

## `rust/lance/src/arrow.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use lance_arrow::bfloat16;` | rust/lance/src/arrow.rs:9-9 | No standalone documentation summary; use the family contract and source entry. |
| `pub use lance_arrow::` | rust/lance/src/arrow.rs:12-12 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod json;` | rust/lance/src/arrow.rs:16-16 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-arrow-json-rs"></a>

## `rust/lance/src/arrow/json.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct JsonDataType` | rust/lance/src/arrow/json.rs:21-21 | JSON representation of an Apache Arrow [DataType]. |
| `pub struct JsonField` | rust/lance/src/arrow/json.rs:184-184 | JSON representation of an Apache Arrow [Field]. |
| `pub struct JsonSchema` | rust/lance/src/arrow/json.rs:230-230 | JSON representation of a Apache Arrow [Schema]. |
| `pub trait ArrowJsonExt: Sized` | rust/lance/src/arrow/json.rs:286-286 | Conversion between Arrow [Schema] and JSON representation (string). |

<a id="source-rust-lance-src-blob-rs"></a>

## `rust/lance/src/blob.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn blob_field(name: &str, nullable: bool) -&gt; Field` | rust/lance/src/blob.rs:55-55 | Construct the Arrow field for a blob v2 column. |
| `pub struct BlobFieldOptions` | rust/lance/src/blob.rs:61-61 | Options for constructing a blob v2 field. |
| `pub inline_size_threshold: Option&lt;usize&gt;,` | rust/lance/src/blob.rs:63-63 | Maximum payload size to keep inline in the data file before using packed blob storage. |
| `pub dedicated_size_threshold: Option&lt;NonZeroUsize&gt;,` | rust/lance/src/blob.rs:68-68 | Maximum payload size to store in packed blob storage before using dedicated blob storage. |
| `pub fn with_inline_size_threshold(mut self, threshold: usize) -&gt; Self` | rust/lance/src/blob.rs:73-73 | Set the maximum payload size to keep inline in the data file. |
| `pub fn with_dedicated_size_threshold(mut self, threshold: NonZeroUsize) -&gt; Self` | rust/lance/src/blob.rs:79-79 | Set the maximum payload size to store in packed blob storage. |
| `pub fn blob_field_with_options(name: &str, nullable: bool, options: BlobFieldOptions) -&gt; Field` | rust/lance/src/blob.rs:107-107 | Construct the Arrow field for a blob v2 column with storage layout options. |
| `pub struct BlobRange` | rust/lance/src/blob.rs:627-627 | Byte range inside a packed or external blob object. |
| `pub offset: u64,` | rust/lance/src/blob.rs:629-629 | Byte offset relative to the beginning of the blob object. |
| `pub size: u64,` | rust/lance/src/blob.rs:631-631 | Number of bytes in this range. |
| `pub enum BlobDescriptor` | rust/lance/src/blob.rs:636-636 | A kind-aware row used to build the writer-prepared blob representation. |
| `pub struct BlobDescriptorColumn` | rust/lance/src/blob.rs:670-670 | A writer-prepared blob column ready to be included in a `RecordBatch`. |
| `pub fn field(&self) -&gt; &Field` | rust/lance/src/blob.rs:677-677 | Return the Arrow field for the prepared column. |
| `pub fn array(&self) -&gt; &ArrayRef` | rust/lance/src/blob.rs:682-682 | Return the Arrow array for the prepared column. |
| `pub fn into_parts(self) -&gt; (Field, ArrayRef)` | rust/lance/src/blob.rs:687-687 | Consume this column into `(field, array)` parts. |
| `pub struct BlobDescriptorArrayBuilder` | rust/lance/src/blob.rs:696-696 | Builds the writer-prepared representation for one blob v2 column. |
| `pub fn new(column: impl Into&lt;String&gt;) -&gt; Self` | rust/lance/src/blob.rs:703-703 | Create a descriptor array builder for one blob column. |
| `pub fn push_packed(&mut self, blob_id: u32, range: BlobRange) -&gt; Result&lt;()&gt;` | rust/lance/src/blob.rs:721-721 | Append one packed blob descriptor. |
| `pub fn extend_packed( &mut self, blob_id: u32, ranges: impl IntoIterator&lt;Item = BlobRange&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/blob.rs:730-734 | Append multiple packed blob descriptors for the same blob object. |
| `pub fn push_dedicated(&mut self, blob_id: u32, size: u64) -&gt; Result&lt;()&gt;` | rust/lance/src/blob.rs:742-742 | Append one dedicated blob descriptor. |
| `pub fn push(&mut self, value: BlobDescriptor) -&gt; Result&lt;()&gt;` | rust/lance/src/blob.rs:747-747 | Append one blob descriptor to this column. |
| `pub fn extend(&mut self, values: impl IntoIterator&lt;Item = BlobDescriptor&gt;) -&gt; Result&lt;()&gt;` | rust/lance/src/blob.rs:754-754 | Append multiple blob descriptors to this column. |
| `pub fn push_inline(&mut self, data: impl Into&lt;Bytes&gt;) -&gt; Result&lt;()&gt;` | rust/lance/src/blob.rs:762-762 | Append an inline blob value. |
| `pub fn push_external( &mut self, uri: impl Into&lt;String&gt;, range: Option&lt;BlobRange&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/blob.rs:767-771 | Append an external blob reference. |
| `pub fn push_null(&mut self) -&gt; Result&lt;()&gt;` | rust/lance/src/blob.rs:782-782 | Append a null blob row. |
| `pub fn field(&self) -&gt; &Field` | rust/lance/src/blob.rs:787-787 | Return the prepared Arrow field for this blob column. |
| `pub fn finish(self) -&gt; Result&lt;BlobDescriptorColumn&gt;` | rust/lance/src/blob.rs:792-792 | Finish this column and return the writer-prepared struct array. |
| `pub struct PackedBlobWriter` | rust/lance/src/blob.rs:957-957 | Writes a Lance-owned packed sidecar blob for one data file and returns descriptors. |
| `pub async fn try_new( object_store: ObjectStore, data_file_path: Path, blob_id: u32, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/blob.rs:968-972 | Create a packed blob writer for `data_file_path` and `blob_id`. |
| `pub fn blob_id(&self) -&gt; u32` | rust/lance/src/blob.rs:994-994 | Return the blob id for this packed sidecar. |
| `pub fn path(&self) -&gt; &Path` | rust/lance/src/blob.rs:999-999 | Return the derived sidecar path for this packed blob. |
| `pub async fn write_blob(&mut self, bytes: impl AsRef&lt;[u8]&gt;) -&gt; Result&lt;()&gt;` | rust/lance/src/blob.rs:1004-1004 | Append one logical blob payload to the packed sidecar. |
| `pub async fn write_packed_blobs&lt;'a&gt;( &mut self, blobs: impl IntoIterator&lt;Item = Option&lt;&'a [u8]&gt;&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/blob.rs:1032-1035 | Append multiple logical blobs, one per iterator item. |
| `pub async fn finish(mut self) -&gt; Result&lt;Vec&lt;BlobDescriptor&gt;&gt;` | rust/lance/src/blob.rs:1097-1097 | Finish the packed sidecar and return descriptors in write order. |
| `pub struct DedicatedBlobWriter` | rust/lance/src/blob.rs:1107-1107 | Writes a Lance-owned dedicated sidecar blob for one data file and returns its descriptor. |
| `pub async fn try_new( object_store: ObjectStore, data_file_path: Path, blob_id: u32, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/blob.rs:1117-1121 | Create a dedicated blob writer for `data_file_path` and `blob_id`. |
| `pub fn blob_id(&self) -&gt; u32` | rust/lance/src/blob.rs:1142-1142 | Return the blob id for this dedicated sidecar. |
| `pub fn path(&self) -&gt; &Path` | rust/lance/src/blob.rs:1147-1147 | Return the derived sidecar path for this dedicated blob. |
| `pub async fn write(&mut self, bytes: impl AsRef&lt;[u8]&gt;) -&gt; Result&lt;()&gt;` | rust/lance/src/blob.rs:1152-1152 | Append bytes to the dedicated sidecar. |
| `pub async fn finish(mut self) -&gt; Result&lt;BlobDescriptor&gt;` | rust/lance/src/blob.rs:1180-1180 | Finish the dedicated sidecar and return its descriptor. |
| `pub struct BlobArrayBuilder` | rust/lance/src/blob.rs:1199-1199 | Builder for blob v2 input struct columns. |
| `pub fn new(capacity: usize) -&gt; Self` | rust/lance/src/blob.rs:1209-1209 | Create a new builder with the given row capacity. |
| `pub fn push_bytes(&mut self, bytes: impl AsRef&lt;[u8]&gt;) -&gt; Result&lt;()&gt;` | rust/lance/src/blob.rs:1220-1220 | Append a blob backed by raw bytes. |
| `pub fn push_uri(&mut self, uri: impl Into&lt;String&gt;) -&gt; Result&lt;()&gt;` | rust/lance/src/blob.rs:1230-1230 | Append a blob referenced by URI. |
| `pub fn push_empty(&mut self) -&gt; Result&lt;()&gt;` | rust/lance/src/blob.rs:1244-1244 | Append an empty blob (inline, zero-length payload). |
| `pub fn push_null(&mut self) -&gt; Result&lt;()&gt;` | rust/lance/src/blob.rs:1254-1254 | Append a null row. |
| `pub fn finish(mut self) -&gt; Result&lt;ArrayRef&gt;` | rust/lance/src/blob.rs:1264-1264 | Finish building and return an Arrow struct array. |


<a id="source-rust-lance-src-datafusion-rs"></a>

## `rust/lance/src/datafusion.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use dataframe::LanceTableProvider;` | rust/lance/src/datafusion.rs:9-9 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-datafusion-dataframe-rs"></a>

## `rust/lance/src/datafusion/dataframe.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct LanceTableProvider` | rust/lance/src/datafusion/dataframe.rs:36-36 | A [TableProvider] for Lance datasets. |
| `pub fn new(dataset: Arc&lt;Dataset&gt;, with_row_id: bool, with_row_addr: bool) -&gt; Self` | rust/lance/src/datafusion/dataframe.rs:48-48 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_ordering( dataset: Arc&lt;Dataset&gt;, with_row_id: bool, with_row_addr: bool, ordered: bool, ) -&gt; Self` | rust/lance/src/datafusion/dataframe.rs:52-57 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_blob_handling(mut self, handling: lance_core::datatypes::BlobHandling) -&gt; Self` | rust/lance/src/datafusion/dataframe.rs:84-84 | Overrides how blob columns are read during [`TableProvider::scan`]. When unset, the underlying dataset scan uses its default `BlobHandling` policy. |
| `pub fn with_batch_size(mut self, batch_size: usize) -&gt; Self` | rust/lance/src/datafusion/dataframe.rs:106-106 | Overrides the maximum number of rows produced by each dataset scan batch. |
| `pub fn with_batch_size_bytes(mut self, batch_size_bytes: u64) -&gt; Self` | rust/lance/src/datafusion/dataframe.rs:112-112 | Overrides the approximate maximum bytes produced by each dataset scan batch. |
| `pub fn dataset(&self) -&gt; Arc&lt;Dataset&gt;` | rust/lance/src/datafusion/dataframe.rs:117-117 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait SessionContextExt` | rust/lance/src/datafusion/dataframe.rs:200-200 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct OneShotPartitionStream` | rust/lance/src/datafusion/dataframe.rs:218-218 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(data: SendableRecordBatchStream) -&gt; Self` | rust/lance/src/datafusion/dataframe.rs:224-224 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-rs"></a>

## `rust/lance/src/dataset.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod builder;` | rust/lance/src/dataset.rs:70-70 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod cleanup;` | rust/lance/src/dataset.rs:71-71 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod delta;` | rust/lance/src/dataset.rs:74-74 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod files;` | rust/lance/src/dataset.rs:75-75 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod fragment;` | rust/lance/src/dataset.rs:76-76 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod index;` | rust/lance/src/dataset.rs:79-79 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod mem_wal;` | rust/lance/src/dataset.rs:80-80 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod optimize;` | rust/lance/src/dataset.rs:82-82 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod progress;` | rust/lance/src/dataset.rs:84-84 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod refs;` | rust/lance/src/dataset.rs:85-85 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod rowids;` | rust/lance/src/dataset.rs:86-86 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod scanner;` | rust/lance/src/dataset.rs:87-87 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod sql;` | rust/lance/src/dataset.rs:89-89 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod statistics;` | rust/lance/src/dataset.rs:90-90 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod transaction` | rust/lance/src/dataset.rs:106-106 | Transaction definitions for updating datasets |
| `pub use lance_table::transaction::` | rust/lance/src/dataset.rs:107-107 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod udtf;` | rust/lance/src/dataset.rs:114-114 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod updater;` | rust/lance/src/dataset.rs:115-115 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod write;` | rust/lance/src/dataset.rs:118-118 | No standalone documentation summary; use the family contract and source entry. |
| `pub use data_file::DataFileTarget;` | rust/lance/src/dataset.rs:120-120 | No standalone documentation summary; use the family contract and source entry. |
| `pub use data_file_part::DataFilePart;` | rust/lance/src/dataset.rs:121-121 | No standalone documentation summary; use the family contract and source entry. |
| `pub use blob::` | rust/lance/src/dataset.rs:145-145 | No standalone documentation summary; use the family contract and source entry. |
| `pub use lance_core::ROW_ID;` | rust/lance/src/dataset.rs:150-150 | No standalone documentation summary; use the family contract and source entry. |
| `pub use overlay::writer::` | rust/lance/src/dataset.rs:160-160 | No standalone documentation summary; use the family contract and source entry. |
| `pub use schema_evolution::` | rust/lance/src/dataset.rs:161-161 | No standalone documentation summary; use the family contract and source entry. |
| `pub use take::TakeBuilder;` | rust/lance/src/dataset.rs:164-164 | No standalone documentation summary; use the family contract and source entry. |
| `pub use write::merge_insert::` | rust/lance/src/dataset.rs:166-166 | No standalone documentation summary; use the family contract and source entry. |
| `pub use write::update::` | rust/lance/src/dataset.rs:172-172 | No standalone documentation summary; use the family contract and source entry. |
| `pub use write::` | rust/lance/src/dataset.rs:174-174 | No standalone documentation summary; use the family contract and source entry. |
| `pub const DEFAULT_INDEX_CACHE_SIZE: usize = 6 * 1024 * 1024 * 1024;` | rust/lance/src/dataset.rs:212-212 | No standalone documentation summary; use the family contract and source entry. |
| `pub const DEFAULT_METADATA_CACHE_SIZE: usize = 1024 * 1024 * 1024;` | rust/lance/src/dataset.rs:216-216 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct Dataset` | rust/lance/src/dataset.rs:220-220 | Lance Dataset |
| `pub manifest: Arc&lt;Manifest&gt;,` | rust/lance/src/dataset.rs:231-231 | No standalone documentation summary; use the family contract and source entry. |
| `pub refs: Refs,` | rust/lance/src/dataset.rs:236-236 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct Version` | rust/lance/src/dataset.rs:276-276 | Dataset Version |
| `pub version: u64,` | rust/lance/src/dataset.rs:278-278 | version number |
| `pub timestamp: DateTime&lt;Utc&gt;,` | rust/lance/src/dataset.rs:281-281 | Timestamp of dataset creation in UTC. |
| `pub metadata: BTreeMap&lt;String, String&gt;,` | rust/lance/src/dataset.rs:284-284 | Key-value pairs of metadata. |
| `pub struct VersionRef` | rust/lance/src/dataset.rs:290-290 | A lightweight reference to an attached dataset version, which could be used to uniquely identify a version. |
| `pub version: u64,` | rust/lance/src/dataset.rs:292-292 | Version number within the current branch's history. |
| `pub struct VersionTransaction` | rust/lance/src/dataset.rs:312-312 | The transaction that produced a version of the dataset, along with the version's commit timestamp. |
| `pub version: u64,` | rust/lance/src/dataset.rs:314-314 | Version number. |
| `pub timestamp: DateTime&lt;Utc&gt;,` | rust/lance/src/dataset.rs:317-317 | Timestamp the version was committed, in UTC. |
| `pub transaction: Option&lt;Transaction&gt;,` | rust/lance/src/dataset.rs:320-320 | The transaction that produced this version, if one was recorded. |
| `pub struct ReadParams` | rust/lance/src/dataset.rs:325-325 | Customize read behavior of a dataset. |
| `pub index_cache_size_bytes: usize,` | rust/lance/src/dataset.rs:328-328 | Size of the index cache in bytes. This cache stores index data in memory for faster lookups. The default is 6 GiB. |
| `pub metadata_cache_size_bytes: usize,` | rust/lance/src/dataset.rs:332-332 | Size of the metadata cache in bytes. This cache stores metadata in memory for faster open table and scans. The default is 1 GiB. |
| `pub session: Option&lt;Arc&lt;Session&gt;&gt;,` | rust/lance/src/dataset.rs:337-337 | If present, dataset will use this shared [`Session`] instead creating a new one. |
| `pub store_options: Option&lt;ObjectStoreParams&gt;,` | rust/lance/src/dataset.rs:339-339 | No standalone documentation summary; use the family contract and source entry. |
| `pub commit_handler: Option&lt;Arc&lt;dyn CommitHandler&gt;&gt;,` | rust/lance/src/dataset.rs:357-357 | If present, dataset will use this to resolve the latest version |
| `pub file_reader_options: Option&lt;FileReaderOptions&gt;,` | rust/lance/src/dataset.rs:365-365 | File reader options to use when reading data files. |
| `pub fn index_cache_size(&mut self, cache_size: usize) -&gt; &mut Self` | rust/lance/src/dataset.rs:374-374 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn index_cache_size_bytes(&mut self, cache_size: usize) -&gt; &mut Self` | rust/lance/src/dataset.rs:380-380 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn metadata_cache_size(&mut self, cache_size: usize) -&gt; &mut Self` | rust/lance/src/dataset.rs:390-390 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn metadata_cache_size_bytes(&mut self, cache_size: usize) -&gt; &mut Self` | rust/lance/src/dataset.rs:397-397 | Set the cache size for the file metadata in bytes. |
| `pub fn session(&mut self, session: Arc&lt;Session&gt;) -&gt; &mut Self` | rust/lance/src/dataset.rs:403-403 | Set a shared session for the datasets. |
| `pub fn set_commit_lock&lt;T: CommitLock + Send + Sync + 'static&gt;(&mut self, lock: Arc&lt;T&gt;)` | rust/lance/src/dataset.rs:409-409 | Use the explicit locking to resolve the latest version |
| `pub fn file_reader_options(&mut self, options: FileReaderOptions) -&gt; &mut Self` | rust/lance/src/dataset.rs:414-414 | Set the file reader options. |
| `pub enum ProjectionRequest` | rust/lance/src/dataset.rs:434-434 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn from_columns( columns: impl IntoIterator&lt;Item = impl AsRef&lt;str&gt;&gt;, dataset_schema: &Schema, ) -&gt; Self` | rust/lance/src/dataset.rs:440-443 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn from_schema(schema: Schema) -&gt; Self` | rust/lance/src/dataset.rs:455-455 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn from_sql( columns: impl IntoIterator&lt;Item = (impl Into&lt;String&gt;, impl Into&lt;String&gt;)&gt;, ) -&gt; Self` | rust/lance/src/dataset.rs:464-466 | Provide a list of projection with SQL transform. |
| `pub fn into_projection_plan(self, dataset: Arc&lt;Dataset&gt;) -&gt; Result&lt;ProjectionPlan&gt;` | rust/lance/src/dataset.rs:475-475 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn open(uri: &str) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset.rs:521-521 | Open an existing dataset. |
| `pub async fn checkout_version(&self, version: impl Into&lt;refs::Ref&gt;) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset.rs:529-529 | Check out a dataset version with a ref. |
| `pub fn tags(&self) -&gt; Tags&lt;'_&gt;` | rust/lance/src/dataset.rs:548-548 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn statistics(&self) -&gt; DatasetStatistics&lt;'_&gt;` | rust/lance/src/dataset.rs:554-554 | A handle for cheap, index-derived statistics about this dataset (e.g. a column's global value range) that never scan data. |
| `pub fn branches(&self) -&gt; Branches&lt;'_&gt;` | rust/lance/src/dataset.rs:558-558 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn checkout_latest(&mut self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:563-563 | Check out the latest version of the dataset |
| `pub async fn checkout_branch(&self, branch: &str) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset.rs:589-589 | Check out the latest version of the branch. |
| `pub async fn create_branch( &mut self, branch: &str, version: impl Into&lt;refs::Ref&gt;, store_params: Option&lt;ObjectStoreParams&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset.rs:610-615 | This is a two-phase operation: - Create the branch dataset by shallow cloning. - Create the branch metadata (a.k.a. `BranchContents`). |
| `pub async fn delete_branch(&mut self, branch: &str) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:649-649 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn force_delete_branch(&mut self, branch: &str) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:655-655 | Delete the branch even if the BranchContents is not found. This could be useful when we have zombie branches and want to clean them up immediately. |
| `pub async fn list_branches(&self) -&gt; Result&lt;HashMap&lt;String, BranchContents&gt;&gt;` | rust/lance/src/dataset.rs:659-659 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn write( batches: impl RecordBatchReader + Send + 'static, dest: impl Into&lt;WriteDestination&lt;'_&gt;&gt;, params: Option&lt;WriteParams&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset.rs:961-965 | Write to or Create a [Dataset] with a stream of [RecordBatch]s. |
| `pub async fn write_into_namespace( batches: impl RecordBatchReader + Send + 'static, namespace_client: Arc&lt;dyn LanceNamespace&gt;, table_id: Vec&lt;String&gt;, params: Option&lt;WriteParams&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset.rs:985-990 | Write into a namespace client-managed table with automatic credential vending. |
| `pub async fn write_into_namespace_on_branch( batches: impl RecordBatchReader + Send + 'static, namespace_client: Arc&lt;dyn LanceNamespace&gt;, table_id: Vec&lt;String&gt;, branch: &str, params: Option&lt;WriteParams&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset.rs:999-1005 | Write into a branch of a namespace client-managed table. |
| `pub async fn append( &mut self, batches: impl RecordBatchReader + Send + 'static, params: Option&lt;WriteParams&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:1181-1185 | Append to existing [Dataset] with a stream of [RecordBatch]s |
| `pub fn uri(&self) -&gt; &str` | rust/lance/src/dataset.rs:1202-1202 | Get the fully qualified URI of this dataset. |
| `pub fn branch_location(&self) -&gt; BranchLocation` | rust/lance/src/dataset.rs:1206-1206 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn branch_identifier(&self) -&gt; Result&lt;BranchIdentifier&gt;` | rust/lance/src/dataset.rs:1214-1214 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn manifest(&self) -&gt; &Manifest` | rust/lance/src/dataset.rs:1222-1222 | Get the full manifest of the dataset version. |
| `pub fn manifest_location(&self) -&gt; &ManifestLocation` | rust/lance/src/dataset.rs:1226-1226 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn delta(&self) -&gt; delta::DatasetDeltaBuilder` | rust/lance/src/dataset.rs:1244-1244 | Create a [`delta::DatasetDeltaBuilder`] to explore changes between dataset versions. |
| `pub async fn latest_manifest(&self) -&gt; Result&lt;(Arc&lt;Manifest&gt;, ManifestLocation)&gt;` | rust/lance/src/dataset.rs:1248-1248 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn read_transaction(&self) -&gt; Result&lt;Option&lt;Transaction&gt;&gt;` | rust/lance/src/dataset.rs:1267-1267 | Read the transaction file for this version of the dataset. |
| `pub async fn read_version_transaction(&self, version: u64) -&gt; Result&lt;VersionTransaction&gt;` | rust/lance/src/dataset.rs:1351-1351 | Read the transaction (if any) and commit timestamp of a version of the dataset. `version` is a version number on this dataset's current branch. |
| `pub async fn read_transaction_by_version(&self, version: u64) -&gt; Result&lt;Option&lt;Transaction&gt;&gt;` | rust/lance/src/dataset.rs:1413-1413 | Read the transaction file for this version of the dataset. |
| `pub async fn get_transactions( &self, recent_transactions: usize, ) -&gt; Result&lt;Vec&lt;Option&lt;Transaction&gt;&gt;&gt;` | rust/lance/src/dataset.rs:1431-1434 | List transactions for the dataset, up to a maximum number. |
| `pub async fn restore(&mut self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:1460-1460 | Restore the currently checked out version of the dataset as the latest version. |
| `pub fn cleanup_old_versions( &self, older_than: Duration, delete_unverified: Option&lt;bool&gt;, error_if_tagged_old_versions: Option&lt;bool&gt;, ) -&gt; BoxFuture&lt;'_, Result&lt;RemovalStats&gt;&gt;` | rust/lance/src/dataset.rs:1499-1504 | Removes old versions of the dataset from disk |
| `pub fn cleanup_with_policy( &self, policy: CleanupPolicy, ) -&gt; BoxFuture&lt;'_, Result&lt;RemovalStats&gt;&gt;` | rust/lance/src/dataset.rs:1533-1536 | Removes old versions of the dataset from storage |
| `pub fn cleanup(&self, policy: CleanupPolicy) -&gt; CleanupOperation&lt;'_&gt;` | rust/lance/src/dataset.rs:1544-1544 | Creates a cleanup operation for this dataset. |
| `pub async fn commit( dest: impl Into&lt;WriteDestination&lt;'_&gt;&gt;, operation: Operation, read_version: Option&lt;u64&gt;, store_params: Option&lt;ObjectStoreParams&gt;, commit_handler: Option&lt;Arc&lt;dyn CommitHandler&gt;&gt;, session: Arc&lt;Session&gt;, enable_v2_manifest_paths: bool, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset.rs:1621-1629 | Commit changes to the dataset |
| `pub async fn commit_detached( dest: impl Into&lt;WriteDestination&lt;'_&gt;&gt;, operation: Operation, read_version: Option&lt;u64&gt;, store_params: Option&lt;ObjectStoreParams&gt;, commit_handler: Option&lt;Arc&lt;dyn CommitHandler&gt;&gt;, session: Arc&lt;Session&gt;, enable_v2_manifest_paths: bool, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset.rs:1651-1659 | Commits changes exactly the same as [`Self::commit`] but the commit will not be associated with the dataset lineage. |
| `pub fn scan(&self) -&gt; Scanner` | rust/lance/src/dataset.rs:1698-1698 | Create a Scanner to scan the dataset. |
| `pub async fn count_rows(&self, filter: Option&lt;String&gt;) -&gt; Result&lt;usize&gt;` | rust/lance/src/dataset.rs:1706-1706 | Count the number of rows in the dataset. |
| `pub async fn take( &self, row_indices: &[u64], projection: impl Into&lt;ProjectionRequest&gt;, ) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset.rs:1732-1736 | Take rows by indices. |
| `pub async fn take_rows( &self, row_ids: &[u64], projection: impl Into&lt;ProjectionRequest&gt;, ) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset.rs:1774-1778 | Take Rows by the internal ROW ids. |
| `pub fn take_builder( self: &Arc&lt;Self&gt;, row_ids: &[u64], projection: impl Into&lt;ProjectionRequest&gt;, ) -&gt; Result&lt;TakeBuilder&gt;` | rust/lance/src/dataset.rs:1785-1789 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn take_blobs( self: &Arc&lt;Self&gt;, row_ids: &[u64], column: impl AsRef&lt;str&gt;, ) -&gt; Result&lt;Vec&lt;Option&lt;BlobFile&gt;&gt;&gt;` | rust/lance/src/dataset.rs:1813-1817 | Take [BlobFile] by row IDs. |
| `pub async fn take_blobs_by_addresses( self: &Arc&lt;Self&gt;, row_addrs: &[u64], column: impl AsRef&lt;str&gt;, ) -&gt; Result&lt;Vec&lt;Option&lt;BlobFile&gt;&gt;&gt;` | rust/lance/src/dataset.rs:1846-1850 | Take [BlobFile] by row addresses. |
| `pub async fn take_blobs_by_indices( self: &Arc&lt;Self&gt;, row_indices: &[u64], column: impl AsRef&lt;str&gt;, ) -&gt; Result&lt;Vec&lt;Option&lt;BlobFile&gt;&gt;&gt;` | rust/lance/src/dataset.rs:1873-1877 | Take [BlobFile] by row indices (offsets in the dataset). |
| `pub fn read_blobs(self: &Arc&lt;Self&gt;, column: impl AsRef&lt;str&gt;) -&gt; Result&lt;ReadBlobsBuilder&gt;` | rust/lance/src/dataset.rs:1907-1907 | Create a planned blob reader for a blob column. |
| `pub fn read_blob_ranges( self: &Arc&lt;Self&gt;, column: impl AsRef&lt;str&gt;, ) -&gt; Result&lt;ReadBlobRangesBuilder&gt;` | rust/lance/src/dataset.rs:1942-1945 | Create a planned reader for row-specific blob-local byte ranges. |
| `pub fn take_scan( &self, row_ranges: Pin&lt;Box&lt;dyn Stream&lt;Item = Result&lt;Range&lt;u64&gt;&gt;&gt; + Send&gt;&gt;, projection: Arc&lt;Schema&gt;, batch_readahead: usize, ) -&gt; DatasetRecordBatchStream` | rust/lance/src/dataset.rs:1952-1957 | Get a stream of batches based on iterator of ranges of row numbers. |
| `pub async fn sample( &self, n: usize, projection: &Schema, fragment_ids: Option&lt;&[u32]&gt;, ) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset.rs:1968-1973 | Randomly sample `n` rows from the dataset. |
| `pub async fn delete(&mut self, predicate: &str) -&gt; Result&lt;write::delete::DeleteResult&gt;` | rust/lance/src/dataset.rs:2015-2015 | Delete rows based on a predicate. |
| `pub async fn truncate_table(&mut self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:2021-2021 | Truncate the dataset by deleting all rows. |
| `pub async fn add_bases( self: &Arc&lt;Self&gt;, new_bases: Vec&lt;lance_table::format::BasePath&gt;, transaction_properties: Option&lt;HashMap&lt;String, String&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset.rs:2040-2044 | Add new base paths to the dataset. |
| `pub async fn count_deleted_rows(&self) -&gt; Result&lt;usize&gt;` | rust/lance/src/dataset.rs:2058-2058 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_object_store( &self, object_store: Arc&lt;ObjectStore&gt;, store_params: Option&lt;ObjectStoreParams&gt;, ) -&gt; Self` | rust/lance/src/dataset.rs:2071-2075 | Clone this dataset with a different object store binding. |
| `pub fn with_object_store_wrappers( &self, wrappers: impl IntoIterator&lt;Item = Arc&lt;dyn WrappingObjectStore&gt;&gt;, ) -&gt; Self` | rust/lance/src/dataset.rs:2090-2093 | Clone this dataset with extra object store wrappers applied to all read stores. |
| `pub fn storage_options(&self) -&gt; Option&lt;&HashMap&lt;String, String&gt;&gt;` | rust/lance/src/dataset.rs:2182-2182 | Returns the initial storage options used when opening this dataset, if any. |
| `pub fn initial_storage_options(&self) -&gt; Option&lt;&HashMap&lt;String, String&gt;&gt;` | rust/lance/src/dataset.rs:2189-2189 | Returns the initial storage options without triggering any refresh. |
| `pub fn storage_options_provider( &self, ) -&gt; Option&lt;Arc&lt;dyn lance_io::object_store::StorageOptionsProvider&gt;&gt;` | rust/lance/src/dataset.rs:2196-2198 | Returns the storage options provider used when opening this dataset, if any. |
| `pub fn storage_options_accessor(&self) -&gt; Option&lt;Arc&lt;StorageOptionsAccessor&gt;&gt;` | rust/lance/src/dataset.rs:2210-2210 | Returns the unified storage options accessor for this dataset, if any. |
| `pub async fn latest_storage_options(&self) -&gt; Result&lt;Option&lt;StorageOptions&gt;&gt;` | rust/lance/src/dataset.rs:2228-2228 | Returns the latest (possibly refreshed) storage options. |
| `pub fn data_dir(&self) -&gt; Path` | rust/lance/src/dataset.rs:2239-2239 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn indices_dir(&self) -&gt; Path` | rust/lance/src/dataset.rs:2243-2243 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn transactions_dir(&self) -&gt; Path` | rust/lance/src/dataset.rs:2247-2247 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn deletions_dir(&self) -&gt; Path` | rust/lance/src/dataset.rs:2251-2251 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn versions_dir(&self) -&gt; Path` | rust/lance/src/dataset.rs:2255-2255 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn create_data_file(&self, path: &str, base_id: Option&lt;u32&gt;) -&gt; Result&lt;DataFile&gt;` | rust/lance/src/dataset.rs:2274-2274 | Create a [`DataFile`] by reading metadata from an existing lance file. |
| `pub async fn object_store(&self, base_id: Option&lt;u32&gt;) -&gt; Result&lt;Arc&lt;ObjectStore&gt;&gt;` | rust/lance/src/dataset.rs:2536-2536 | Resolve the object store for the primary dataset or an additional base. |
| `pub fn store_params(&self) -&gt; Option&lt;&ObjectStoreParams&gt;` | rust/lance/src/dataset.rs:2546-2546 | The `ObjectStoreParams` this dataset was opened with, or `None` when opened without explicit params. Lets a caller re-open a derived path (e.g. a MemWAL SSTable) with the same store this dataset used. |
| `pub fn session(&self) -&gt; Arc&lt;Session&gt;` | rust/lance/src/dataset.rs:2617-2617 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn version_id(&self) -&gt; u64` | rust/lance/src/dataset.rs:2625-2625 | Get the currently checked-out version id. |
| `pub fn version(&self) -&gt; Version` | rust/lance/src/dataset.rs:2633-2633 | Get the currently checked-out version details. |
| `pub async fn index_cache_entry_count(&self) -&gt; usize` | rust/lance/src/dataset.rs:2638-2638 | Get the number of entries currently in the index cache. |
| `pub async fn index_cache_hit_rate(&self) -&gt; f32` | rust/lance/src/dataset.rs:2643-2643 | Get cache hit ratio. |
| `pub fn cache_size_bytes(&self) -&gt; u64` | rust/lance/src/dataset.rs:2648-2648 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn versions(&self) -&gt; Result&lt;Vec&lt;Version&gt;&gt;` | rust/lance/src/dataset.rs:2653-2653 | Get all versions. |
| `pub async fn count_versions(&self) -&gt; Result&lt;u64&gt;` | rust/lance/src/dataset.rs:2676-2676 | Get the number of versions in the current version history. |
| `pub async fn version_refs(&self) -&gt; Result&lt;Vec&lt;VersionRef&gt;&gt;` | rust/lance/src/dataset.rs:2690-2690 | List lightweight references to all attached versions in the current branch's history. |
| `pub async fn list_detached_manifests(&self) -&gt; Result&lt;Vec&lt;ManifestLocation&gt;&gt;` | rust/lance/src/dataset.rs:2717-2717 | List all detached manifest locations. |
| `pub async fn latest_version_id(&self) -&gt; Result&lt;u64&gt;` | rust/lance/src/dataset.rs:2727-2727 | Get the latest version of the dataset This is meant to be a fast path for checking if a dataset has changed. This is why we don't return the full version struct. |
| `pub async fn is_stale(&self) -&gt; Result&lt;bool&gt;` | rust/lance/src/dataset.rs:2736-2736 | Return whether the dataset has a newer committed version. |
| `pub async fn has_successor_version(&self) -&gt; Result&lt;bool&gt;` | rust/lance/src/dataset.rs:2748-2748 | Return whether the immediate attached successor manifest exists. |
| `pub fn count_fragments(&self) -&gt; usize` | rust/lance/src/dataset.rs:2768-2768 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn schema(&self) -&gt; &Schema` | rust/lance/src/dataset.rs:2773-2773 | Get the schema of the dataset |
| `pub fn empty_projection(self: &Arc&lt;Self&gt;) -&gt; Projection` | rust/lance/src/dataset.rs:2779-2779 | Similar to [Self::schema], but only returns fields that are not marked as blob columns Creates a new empty projection into the dataset schema |
| `pub fn full_projection(self: &Arc&lt;Self&gt;) -&gt; Projection` | rust/lance/src/dataset.rs:2784-2784 | Creates a projection that includes all columns in the dataset |
| `pub fn get_fragments(&self) -&gt; Vec&lt;FileFragment&gt;` | rust/lance/src/dataset.rs:2789-2789 | Get fragments. |
| `pub fn iter_fragments(&self) -&gt; impl Iterator&lt;Item = &Fragment&gt;` | rust/lance/src/dataset.rs:2799-2799 | Iterate over manifest fragments without allocating [`FileFragment`] wrappers. |
| `pub fn get_fragment(&self, fragment_id: usize) -&gt; Option&lt;FileFragment&gt;` | rust/lance/src/dataset.rs:2803-2803 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn fragments(&self) -&gt; &Arc&lt;Vec&lt;Fragment&gt;&gt;` | rust/lance/src/dataset.rs:2808-2808 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn get_frags_from_ordered_ids(&self, ordered_ids: &[u32]) -&gt; Vec&lt;Option&lt;FileFragment&gt;&gt;` | rust/lance/src/dataset.rs:2896-2896 | Resolves fragments for the given ids without scanning the manifest. |
| `pub async fn num_small_files(&self, max_rows_per_group: usize) -&gt; usize` | rust/lance/src/dataset.rs:3083-3083 | Gets the number of files that are so small they don't even have a full group. These are considered too small because reading many of them is much less efficient than reading a single file because the separate files split up what would otherwise be single IO requests into multiple. |
| `pub async fn validate(&self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:3092-3092 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn migrate_manifest_paths_v2(&mut self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:3218-3218 | Migrate the dataset to use the new manifest path scheme. |
| `pub async fn migrate_to_stable_row_ids(&mut self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:3266-3266 | Migrate a table to use stable row IDs. |
| `pub async fn migrate_to_non_reusable_field_ids(&mut self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:3320-3320 | Activate monotonic, non-reusable field IDs for a legacy dataset. |
| `pub async fn shallow_clone( &mut self, target_path: &str, version: impl Into&lt;refs::Ref&gt;, store_params: Option&lt;ObjectStoreParams&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset.rs:3374-3379 | Shallow clone the target version into a new dataset at target_path. 'target_path': the uri string to clone the dataset into. 'version': the version cloned from, could be a version number or tag. 'store_params': the object store params to use for the new dataset. |
| `pub async fn deep_clone( &mut self, target_path: &str, version: impl Into&lt;refs::Ref&gt;, store_params: Option&lt;ObjectStoreParams&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset.rs:3441-3446 | Deep clone the target version into a new dataset at target_path. This copies all relevant dataset files (data files, deletion files, and index files) into the target dataset with bounded memory use. |
| `pub fn sql(&self, sql: &str) -&gt; SqlQueryBuilder` | rust/lance/src/dataset.rs:3690-3690 | Run a SQL query against the dataset. The underlying SQL engine is DataFusion. Please refer to the DataFusion documentation for supported SQL syntax. |
| `pub dataset: BoxFuture&lt;'a, Result&lt;Dataset&gt;&gt;,` | rust/lance/src/dataset.rs:3696-3696 | No standalone documentation summary; use the family contract and source entry. |
| `pub new_transactions: BoxStream&lt;'a, Result&lt;(u64, Arc&lt;Transaction&gt;)&gt;&gt;,` | rust/lance/src/dataset.rs:3697-3697 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn add_columns( &mut self, transforms: NewColumnTransform, read_columns: Option&lt;Vec&lt;String&gt;&gt;, batch_size: Option&lt;u32&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:3824-3829 | Append new columns to the dataset. |
| `pub async fn alter_columns(&mut self, alterations: &[ColumnAlteration]) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:3841-3841 | Modify columns in the dataset, changing their name, type, or nullability. |
| `pub fn plan_drop_columns(&self, columns: &[&str]) -&gt; Result&lt;Schema&gt;` | rust/lance/src/dataset.rs:3856-3856 | Remove columns from the dataset. |
| `pub async fn drop_columns(&mut self, columns: &[&str]) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:3860-3860 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn drop(&mut self, columns: &[&str]) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:3871-3871 | Drop columns from the dataset and return updated dataset. Note that this is a zero-copy operation and column is not physically removed from the dataset. Parameters: - `columns`: the list of column names to drop. |
| `pub async fn merge( &mut self, stream: impl RecordBatchReader + Send + 'static, left_on: &str, right_on: &str, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:3955-3960 | Merge this dataset with another arrow Table / Dataset, and returns a new version of dataset. |
| `pub async fn merge_index_metadata( &self, index_uuid: &Uuid, index_type: IndexType, _batch_readhead: Option&lt;usize&gt;, progress: Arc&lt;dyn IndexBuildProgress&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:3967-3973 | Merge a distributed scalar index into a single root artifact and report progress via the supplied callback. |
| `pub fn metadata(&self) -&gt; &HashMap&lt;String, String&gt;` | rust/lance/src/dataset.rs:4034-4034 | Get dataset metadata. |
| `pub fn config(&self) -&gt; &HashMap&lt;String, String&gt;` | rust/lance/src/dataset.rs:4039-4039 | Get the dataset config from manifest |
| `pub async fn delete_config_keys(&mut self, delete_keys: &[&str]) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:4047-4047 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn update_metadata( &mut self, values: impl IntoIterator&lt;Item = impl Into&lt;UpdateMapEntry&gt;&gt;, ) -&gt; metadata::UpdateMetadataBuilder&lt;'_&gt;` | rust/lance/src/dataset.rs:4079-4082 | Update table metadata. |
| `pub fn update_config( &mut self, values: impl IntoIterator&lt;Item = impl Into&lt;UpdateMapEntry&gt;&gt;, ) -&gt; metadata::UpdateMetadataBuilder&lt;'_&gt;` | rust/lance/src/dataset.rs:4112-4115 | Update config. |
| `pub fn update_schema_metadata( &mut self, values: impl IntoIterator&lt;Item = impl Into&lt;UpdateMapEntry&gt;&gt;, ) -&gt; metadata::UpdateMetadataBuilder&lt;'_&gt;` | rust/lance/src/dataset.rs:4145-4148 | Update schema metadata. |
| `pub async fn replace_schema_metadata( &mut self, new_values: impl IntoIterator&lt;Item = (String, String)&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:4154-4157 | Update schema metadata |
| `pub fn update_field_metadata(&mut self) -&gt; UpdateFieldMetadataBuilder&lt;'_&gt;` | rust/lance/src/dataset.rs:4195-4195 | Update field metadata |
| `pub async fn replace_field_metadata( &mut self, new_values: impl IntoIterator&lt;Item = (u32, HashMap&lt;String, String&gt;)&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:4200-4203 | Update field metadata |
| `pub fn disable_transaction_file(&self) -&gt; bool` | rust/lance/src/dataset.rs:4275-4275 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn validate_dataset_root_for_drop(object_store: &ObjectStore, base: &Path) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset.rs:4474-4474 | Check that `base` is a Lance dataset root before deleting it recursively. |


<a id="source-rust-lance-src-dataset-blob-rs"></a>

## `rust/lance/src/dataset/blob.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub base_id: u32,` | rust/lance/src/dataset/blob.rs:136-136 | No standalone documentation summary; use the family contract and source entry. |
| `pub relative_path: String,` | rust/lance/src/dataset/blob.rs:137-137 | No standalone documentation summary; use the family contract and source entry. |
| `pub base_id: u32,` | rust/lance/src/dataset/blob.rs:142-142 | No standalone documentation summary; use the family contract and source entry. |
| `pub store_prefix: String,` | rust/lance/src/dataset/blob.rs:143-143 | No standalone documentation summary; use the family contract and source entry. |
| `pub base_path: Path,` | rust/lance/src/dataset/blob.rs:144-144 | No standalone documentation summary; use the family contract and source entry. |
| `pub store_params: ObjectStoreParams,` | rust/lance/src/dataset/blob.rs:145-145 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct BlobPreprocessor` | rust/lance/src/dataset/blob.rs:521-521 | Preprocesses blob v2 columns on the write path so the encoder sees bounded inline values and lightweight descriptors for larger payloads: |
| `pub fn prepared_blob_batch_to_descriptors(batch: &RecordBatch) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/blob.rs:1715-1715 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn prepared_blob_ids(batch: &RecordBatch) -&gt; Result&lt;HashSet&lt;u32&gt;&gt;` | rust/lance/src/dataset/blob.rs:1782-1782 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct BlobFile` | rust/lance/src/dataset/blob.rs:2035-2035 | A file-like object that represents a blob in a dataset |
| `pub const DEFAULT_READ_BUFFER_SIZE: usize = 512 * 1024;` | rust/lance/src/dataset/blob.rs:2059-2059 | Default sequential read-ahead size in bytes. |
| `pub fn new_inline( object_store: Arc&lt;ObjectStore&gt;, path: Path, position: u64, size: u64, ) -&gt; Self` | rust/lance/src/dataset/blob.rs:2089-2094 | Create an inline blob reader backed by a data file. |
| `pub fn new_dedicated(object_store: Arc&lt;ObjectStore&gt;, path: Path, size: u64) -&gt; Self` | rust/lance/src/dataset/blob.rs:2114-2114 | Create a dedicated blob reader backed by a sidecar `.blob` file. |
| `pub fn new_packed( object_store: Arc&lt;ObjectStore&gt;, path: Path, position: u64, size: u64, ) -&gt; Self` | rust/lance/src/dataset/blob.rs:2135-2140 | Create a packed blob reader for a slice inside a shared sidecar `.blob` file. |
| `pub fn new_external( object_store: Arc&lt;ObjectStore&gt;, path: Path, uri: String, position: u64, size: u64, ) -&gt; Self` | rust/lance/src/dataset/blob.rs:2163-2169 | Create an external blob reader backed by a caller-resolved object location. |
| `pub async fn close(&self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/blob.rs:2180-2180 | Close the blob file, releasing any associated resources |
| `pub async fn is_closed(&self) -&gt; bool` | rust/lance/src/dataset/blob.rs:2187-2187 | Returns true if the blob file is closed |
| `pub async fn read_range(&self, range: Range&lt;u64&gt;) -&gt; Result&lt;Bytes&gt;` | rust/lance/src/dataset/blob.rs:2235-2235 | Read a byte range relative to the beginning of this blob without changing the cursor. |
| `pub async fn read_ranges(&self, ranges: &[Range&lt;u64&gt;]) -&gt; Result&lt;Vec&lt;Bytes&gt;&gt;` | rust/lance/src/dataset/blob.rs:2245-2245 | Read multiple ranges relative to the beginning of this blob without changing the cursor. |
| `pub async fn read(&self) -&gt; Result&lt;bytes::Bytes&gt;` | rust/lance/src/dataset/blob.rs:2259-2259 | Read the entire blob file from the current cursor position to the end of the file |
| `pub async fn read_up_to(&self, len: usize) -&gt; Result&lt;bytes::Bytes&gt;` | rust/lance/src/dataset/blob.rs:2311-2311 | Read up to `len` bytes from the current cursor position |
| `pub async fn set_buffer_size(&self, buffer_size: usize) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/blob.rs:2387-2387 | Sequential read-ahead size in bytes. `0` disables read-ahead. Changing the size drops any unused prefetch. |
| `pub async fn seek(&self, new_cursor: u64) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/blob.rs:2408-2408 | Seek to a new cursor position in the file |
| `pub async fn tell(&self) -&gt; Result&lt;u64&gt;` | rust/lance/src/dataset/blob.rs:2428-2428 | Return the current cursor position in the file |
| `pub fn range_submission_count(&self) -&gt; usize` | rust/lance/src/dataset/blob.rs:2443-2443 | Number of range-read submissions on this handle's backing object. |
| `pub fn size(&self) -&gt; u64` | rust/lance/src/dataset/blob.rs:2448-2448 | Return the size of the blob file in bytes |
| `pub fn position(&self) -&gt; u64` | rust/lance/src/dataset/blob.rs:2452-2452 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn data_path(&self) -&gt; &Path` | rust/lance/src/dataset/blob.rs:2456-2456 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn kind(&self) -&gt; BlobKind` | rust/lance/src/dataset/blob.rs:2460-2460 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn uri(&self) -&gt; Option&lt;&str&gt;` | rust/lance/src/dataset/blob.rs:2464-2464 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ReadBlob` | rust/lance/src/dataset/blob.rs:2527-2527 | Blob bytes materialized by [`ReadBlobsBuilder`]. |
| `pub row_address: u64,` | rust/lance/src/dataset/blob.rs:2529-2529 | Row address of the blob that was read. |
| `pub data: Option&lt;Bytes&gt;,` | rust/lance/src/dataset/blob.rs:2533-2533 | Blob payload bytes, or `None` when the selected blob value is null. |
| `pub struct BlobReadRange` | rust/lance/src/dataset/blob.rs:2538-2538 | A byte range relative to the beginning of one logical blob value. |
| `pub offset: u64,` | rust/lance/src/dataset/blob.rs:2540-2540 | Byte offset from the beginning of the blob value. |
| `pub length: u64,` | rust/lance/src/dataset/blob.rs:2542-2542 | Number of bytes to read. |
| `pub const fn new(offset: u64, length: u64) -&gt; Self` | rust/lance/src/dataset/blob.rs:2547-2547 | Create a blob-local byte range from an offset and length. |
| `pub struct BlobRangeRequest` | rust/lance/src/dataset/blob.rs:2564-2564 | One row-specific blob range read request. |
| `pub row: u64,` | rust/lance/src/dataset/blob.rs:2567-2567 | Row selector interpreted by the selection method on [`ReadBlobRangesBuilder`]. |
| `pub range: BlobReadRange,` | rust/lance/src/dataset/blob.rs:2569-2569 | Blob-local byte range to read from the selected row. |
| `pub const fn new(row: u64, offset: u64, length: u64) -&gt; Self` | rust/lance/src/dataset/blob.rs:2574-2574 | Create a request for `length` bytes at `offset` in the selected row. |
| `pub struct ReadBlobRange` | rust/lance/src/dataset/blob.rs:2584-2584 | Bytes materialized for one request submitted through [`ReadBlobRangesBuilder`]. |
| `pub request_index: usize,` | rust/lance/src/dataset/blob.rs:2586-2586 | Zero-based position of this request in the caller's request list. |
| `pub row_address: u64,` | rust/lance/src/dataset/blob.rs:2588-2588 | Physical row address of the selected blob value. |
| `pub range: BlobReadRange,` | rust/lance/src/dataset/blob.rs:2590-2590 | Blob-local range supplied for this request. |
| `pub data: Option&lt;Bytes&gt;,` | rust/lance/src/dataset/blob.rs:2595-2595 | Bytes in `range`, or `None` when the selected blob value is null. |
| `pub type ReadBlobsStream = BoxStream&lt;'static, Result&lt;ReadBlob&gt;&gt;;` | rust/lance/src/dataset/blob.rs:2599-2599 | Stream returned by [`ReadBlobsBuilder::try_into_stream`]. |
| `pub type ReadBlobRangesStream = BoxStream&lt;'static, Result&lt;ReadBlobRange&gt;&gt;;` | rust/lance/src/dataset/blob.rs:2602-2602 | Stream returned by [`ReadBlobRangesBuilder::try_into_stream`]. |
| `pub struct ReadBlobsBuilder` | rust/lance/src/dataset/blob.rs:2674-2674 | Builder for sequential / planned blob reads. |
| `pub fn with_row_ids(mut self, row_ids: impl Into&lt;Vec&lt;u64&gt;&gt;) -&gt; Self` | rust/lance/src/dataset/blob.rs:2694-2694 | Read blobs for the provided stable row ids. |
| `pub fn with_row_indices(mut self, row_indices: impl Into&lt;Vec&lt;u64&gt;&gt;) -&gt; Self` | rust/lance/src/dataset/blob.rs:2700-2700 | Read blobs for the provided row offsets in dataset order. |
| `pub fn with_row_addresses(mut self, row_addrs: impl Into&lt;Vec&lt;u64&gt;&gt;) -&gt; Self` | rust/lance/src/dataset/blob.rs:2706-2706 | Read blobs for the provided physical row addresses. |
| `pub fn with_io_buffer_size_bytes(mut self, bytes: u64) -&gt; Self` | rust/lance/src/dataset/blob.rs:2712-2712 | Set the scheduler I/O buffer size used while materializing blobs. |
| `pub fn preserve_order(mut self, preserve: bool) -&gt; Self` | rust/lance/src/dataset/blob.rs:2718-2718 | Whether results must follow the caller's requested row order. |
| `pub async fn try_into_stream(self) -&gt; Result&lt;ReadBlobsStream&gt;` | rust/lance/src/dataset/blob.rs:2727-2727 | Execute the planned blob read and return a stream of blob payloads. |
| `pub async fn execute(self) -&gt; Result&lt;Vec&lt;ReadBlob&gt;&gt;` | rust/lance/src/dataset/blob.rs:2773-2773 | Execute the planned blob read and collect the full result in memory. |
| `pub struct ReadBlobRangesBuilder` | rust/lance/src/dataset/blob.rs:2799-2799 | Builder for planned blob-local range reads. |
| `pub fn with_row_ids(mut self, requests: impl IntoIterator&lt;Item = BlobRangeRequest&gt;) -&gt; Self` | rust/lance/src/dataset/blob.rs:2813-2813 | Read requests whose row values are stable row ids. |
| `pub fn with_row_indices( mut self, requests: impl IntoIterator&lt;Item = BlobRangeRequest&gt;, ) -&gt; Self` | rust/lance/src/dataset/blob.rs:2819-2822 | Read requests whose row values are offsets in dataset order. |
| `pub fn with_row_addresses( mut self, requests: impl IntoIterator&lt;Item = BlobRangeRequest&gt;, ) -&gt; Self` | rust/lance/src/dataset/blob.rs:2828-2831 | Read requests whose row values are physical row addresses. |
| `pub fn with_io_buffer_size_bytes(mut self, bytes: u64) -&gt; Self` | rust/lance/src/dataset/blob.rs:2837-2837 | Set the scheduler I/O buffer size used while materializing ranges. |
| `pub fn preserve_order(mut self, preserve: bool) -&gt; Self` | rust/lance/src/dataset/blob.rs:2843-2843 | Whether results must follow the caller's request order. |
| `pub async fn try_into_stream(self) -&gt; Result&lt;ReadBlobRangesStream&gt;` | rust/lance/src/dataset/blob.rs:2855-2855 | Execute the planned range read and return one result per request. |
| `pub async fn execute(self) -&gt; Result&lt;Vec&lt;ReadBlobRange&gt;&gt;` | rust/lance/src/dataset/blob.rs:2923-2923 | Execute the planned range read and collect all returned bytes in memory. |
| `pub struct BlobMaterializationAdmission` | rust/lance/src/dataset/blob.rs:3172-3172 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct BlobMaterializationContext` | rust/lance/src/dataset/blob.rs:3248-3248 | Shared state for asynchronously materializing blob v2 descriptor batches. |
| `pub struct MaterializedBlobBatch` | rust/lance/src/dataset/blob.rs:3291-3291 | A materialized batch that retains its byte-budget reservation until yielded. |
| `pub async fn take_blobs_by_addresses( dataset: &Arc&lt;Dataset&gt;, row_addrs: &[u64], column: &str, ) -&gt; Result&lt;Vec&lt;Option&lt;BlobFile&gt;&gt;&gt;` | rust/lance/src/dataset/blob.rs:3919-3923 | Take [BlobFile] by row addresses. |
| `pub fn public_blob_v2_binary_output_schema(schema: &Schema) -&gt; Schema` | rust/lance/src/dataset/blob.rs:4283-4283 | Return the public Arrow-facing schema for a blob v2 binary scan. |
| `pub fn schema_has_blob_v2_binary_view(schema: &Schema) -&gt; bool` | rust/lance/src/dataset/blob.rs:4304-4304 | Return true if the schema contains a blob v2 leaf in binary payload view. |
| `pub fn blob_v2_descriptor_schema(schema: &Schema) -&gt; Schema` | rust/lance/src/dataset/blob.rs:4327-4327 | Convert blob v2 binary-view leaves back to descriptor-view leaves. |
| `pub async fn materialize_blob_v2_binary_batch( dataset: &Arc&lt;Dataset&gt;, output_schema: &Schema, batch: RecordBatch, ) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/blob.rs:4345-4349 | Materialize blob v2 descriptor arrays in a decoded batch into binary arrays. |
| `pub fn split_batch_by_bytes(batch: RecordBatch, max_bytes: usize) -&gt; Result&lt;Vec&lt;RecordBatch&gt;&gt;` | rust/lance/src/dataset/blob.rs:4366-4366 | Split `batch` into row-aligned chunks whose total array memory size is at most `max_bytes`. |
| `pub fn materialize_blob_v2_binary_batch_with_context&lt;'a&gt;( dataset: &'a Arc&lt;Dataset&gt;, output_schema: &'a Schema, batch: RecordBatch, context: &'a Arc&lt;BlobMaterializationContext&gt;, ) -&gt; BoxFuture&lt;'a, Result&lt;MaterializedBlobBatch&gt;&gt;` | rust/lance/src/dataset/blob.rs:4402-4407 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn materialize_blob_v2_binary_batch_with_admission&lt;'a&gt;( dataset: &'a Arc&lt;Dataset&gt;, output_schema: &'a Schema, batch: RecordBatch, context: &'a Arc&lt;BlobMaterializationContext&gt;, admission: BlobMaterializationAdmission, ) -&gt; BoxFuture&lt;'a, Result&lt;MaterializedBlobBatch&gt;&gt;` | rust/lance/src/dataset/blob.rs:4418-4424 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-branch-location-rs"></a>

## `rust/lance/src/dataset/branch_location.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const BRANCH_DIR: &str = "tree";` | rust/lance/src/dataset/branch_location.rs:8-8 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct BranchLocation` | rust/lance/src/dataset/branch_location.rs:11-11 | No standalone documentation summary; use the family contract and source entry. |
| `pub path: Path,` | rust/lance/src/dataset/branch_location.rs:12-12 | No standalone documentation summary; use the family contract and source entry. |
| `pub uri: String,` | rust/lance/src/dataset/branch_location.rs:13-13 | No standalone documentation summary; use the family contract and source entry. |
| `pub branch: Option&lt;String&gt;,` | rust/lance/src/dataset/branch_location.rs:14-14 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn find_main(&self) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/branch_location.rs:19-19 | Find the root location |
| `pub fn branch_of(root: &str, location: &str) -&gt; Result&lt;Option&lt;String&gt;&gt;` | rust/lance/src/dataset/branch_location.rs:78-78 | The branch a location under `root` targets: the inverse of [`Self::find_branch`]. `location` must be either `root` itself (main) or `&lt;root&gt;/tree/&lt;branch&gt;`; anything else is rejected so a caller never misattributes an unrelated location to a branch. |
| `pub fn find_branch(&self, branch_name: Option&lt;&str&gt;) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/branch_location.rs:107-107 | Find the target branch location |

<a id="source-rust-lance-src-dataset-builder-rs"></a>

## `rust/lance/src/dataset/builder.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct DatasetBuilder` | rust/lance/src/dataset/builder.rs:37-37 | builder for loading a [`Dataset`]. |
| `pub fn from_uri&lt;T: AsRef&lt;str&gt;&gt;(table_uri: T) -&gt; Self` | rust/lance/src/dataset/builder.rs:87-87 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn from_namespace( namespace_client: Arc&lt;dyn LanceNamespace&gt;, table_id: Vec&lt;String&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/builder.rs:139-142 | Create a DatasetBuilder from a LanceNamespace client |
| `pub fn with_index_cache_size_bytes(mut self, cache_size: usize) -&gt; Self` | rust/lance/src/dataset/builder.rs:190-190 | Set the cache size for indices. Set to zero, to disable the cache. |
| `pub fn with_index_cache_backend(mut self, backend: Arc&lt;dyn CacheBackend&gt;) -&gt; Self` | rust/lance/src/dataset/builder.rs:199-199 | Use a custom index cache backend. |
| `pub fn with_index_cache_size(mut self, cache_size: usize) -&gt; Self` | rust/lance/src/dataset/builder.rs:206-206 | Set the cache size for indices. Set to zero, to disable the cache. |
| `pub fn with_metadata_cache_size_bytes(mut self, cache_size: usize) -&gt; Self` | rust/lance/src/dataset/builder.rs:214-214 | Size of the metadata cache in bytes. This cache stores metadata in memory for faster open table and scans. The default is 1 GiB. |
| `pub fn with_metadata_cache_size(mut self, cache_size: usize) -&gt; Self` | rust/lance/src/dataset/builder.rs:224-224 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_block_size(mut self, block_size: usize) -&gt; Self` | rust/lance/src/dataset/builder.rs:234-234 | The block size passed to the underlying Object Store reader. |
| `pub fn with_version(mut self, version: u64) -&gt; Self` | rust/lance/src/dataset/builder.rs:240-240 | Sets `version` for the builder using a version number |
| `pub fn with_branch(mut self, branch: &str, version_number: Option&lt;u64&gt;) -&gt; Self` | rust/lance/src/dataset/builder.rs:247-247 | Sets `version` for the builder using a branch and optional version number If version_number is null, checkout the latest version |
| `pub fn with_tag(mut self, tag: &str) -&gt; Self` | rust/lance/src/dataset/builder.rs:253-253 | Sets `version` for the builder using a tag |
| `pub fn with_commit_handler(mut self, commit_handler: Arc&lt;dyn CommitHandler&gt;) -&gt; Self` | rust/lance/src/dataset/builder.rs:258-258 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_s3_credentials_refresh_offset(mut self, offset: Duration) -&gt; Self` | rust/lance/src/dataset/builder.rs:265-265 | Sets the s3 credentials refresh. This only applies to s3 storage. |
| `pub fn with_aws_credentials_provider(mut self, credentials: AwsCredentialProvider) -&gt; Self` | rust/lance/src/dataset/builder.rs:273-273 | Sets the aws credentials provider. This only applies to aws object store. |
| `pub fn with_object_store( mut self, object_store: Arc&lt;DynObjectStore&gt;, location: Url, commit_handler: Arc&lt;dyn CommitHandler&gt;, ) -&gt; Self` | rust/lance/src/dataset/builder.rs:281-286 | Directly set the object store to use. |
| `pub fn with_serialized_manifest(mut self, manifest: &[u8]) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/builder.rs:295-295 | Use a serialized manifest instead of loading it from the object store. |
| `pub fn with_storage_options(mut self, storage_options: HashMap&lt;String, String&gt;) -&gt; Self` | rust/lance/src/dataset/builder.rs:317-317 | Set options used to initialize storage backend |
| `pub fn with_storage_option(mut self, key: impl AsRef&lt;str&gt;, value: impl AsRef&lt;str&gt;) -&gt; Self` | rust/lance/src/dataset/builder.rs:349-349 | Set a single option used to initialize storage backend For example, to set the region for S3, you can use: |
| `pub fn with_storage_options_provider( mut self, provider: Arc&lt;dyn lance_io::object_store::StorageOptionsProvider&gt;, ) -&gt; Self` | rust/lance/src/dataset/builder.rs:416-419 | Enable credential vending from a LanceNamespace client |
| `pub fn with_storage_options_accessor(mut self, accessor: Arc&lt;StorageOptionsAccessor&gt;) -&gt; Self` | rust/lance/src/dataset/builder.rs:462-462 | Set a unified storage options accessor for credential management |
| `pub fn with_base_store_params( mut self, base_path: impl AsRef&lt;str&gt;, store_params: ObjectStoreParams, ) -&gt; Self` | rust/lance/src/dataset/builder.rs:474-478 | Set runtime-only object store params for a specific registered base path. |
| `pub fn with_read_params(mut self, read_params: ReadParams) -&gt; Self` | rust/lance/src/dataset/builder.rs:485-485 | Set options based on [ReadParams]. |
| `pub fn with_write_params(mut self, write_params: WriteParams) -&gt; Self` | rust/lance/src/dataset/builder.rs:510-510 | Set options based on [WriteParams]. |
| `pub fn with_session(mut self, session: Arc&lt;Session&gt;) -&gt; Self` | rust/lance/src/dataset/builder.rs:527-527 | Re-use an existing session. |
| `pub fn with_store_params(mut self, store_params: ObjectStoreParams) -&gt; Self` | rust/lance/src/dataset/builder.rs:533-533 | Set exact object store params used as the dataset-level default binding. |
| `pub async fn build_object_store( mut self, ) -&gt; Result&lt;(Arc&lt;ObjectStore&gt;, Path, Arc&lt;dyn CommitHandler&gt;)&gt;` | rust/lance/src/dataset/builder.rs:539-541 | Build a lance object store for the given config |
| `pub async fn list_manifest_locations(mut self) -&gt; Result&lt;Vec&lt;ManifestLocation&gt;&gt;` | rust/lance/src/dataset/builder.rs:611-611 | List manifest locations without reading the manifest contents. |
| `pub async fn load(self) -&gt; Result&lt;Dataset&gt;` | rust/lance/src/dataset/builder.rs:635-635 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn load_by_uri( session: Arc&lt;Session&gt;, manifest: Option&lt;Manifest&gt;, file_reader_options: Option&lt;FileReaderOptions&gt;, table_uri: String, version_number: Option&lt;u64&gt;, object_store: Arc&lt;ObjectStore&gt;, base_path: Path, commit_handler: Arc&lt;dyn CommitHandler&gt;, store_params: Option&lt;ObjectStoreParams&gt;, base_store_params: Option&lt;Arc&lt;HashMap&lt;String, ObjectStoreParams&gt;&gt;&gt;, ) -&gt; Result&lt;Dataset&gt;` | rust/lance/src/dataset/builder.rs:871-882 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-cleanup-rs"></a>

## `rust/lance/src/dataset/cleanup.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct RemovalStats` | rust/lance/src/dataset/cleanup.rs:90-90 | No standalone documentation summary; use the family contract and source entry. |
| `pub bytes_removed: u64,` | rust/lance/src/dataset/cleanup.rs:91-91 | No standalone documentation summary; use the family contract and source entry. |
| `pub old_versions: u64,` | rust/lance/src/dataset/cleanup.rs:92-92 | No standalone documentation summary; use the family contract and source entry. |
| `pub data_files_removed: u64,` | rust/lance/src/dataset/cleanup.rs:93-93 | No standalone documentation summary; use the family contract and source entry. |
| `pub transaction_files_removed: u64,` | rust/lance/src/dataset/cleanup.rs:94-94 | No standalone documentation summary; use the family contract and source entry. |
| `pub index_files_removed: u64,` | rust/lance/src/dataset/cleanup.rs:95-95 | No standalone documentation summary; use the family contract and source entry. |
| `pub deletion_files_removed: u64,` | rust/lance/src/dataset/cleanup.rs:96-96 | No standalone documentation summary; use the family contract and source entry. |
| `pub failed_deletes: u64,` | rust/lance/src/dataset/cleanup.rs:99-99 | Files that could not be deleted. They are not counted as removed; the next cleanup finds them again by listing. |
| `pub struct CleanupExplanation` | rust/lance/src/dataset/cleanup.rs:108-108 | A read-only explanation of what a cleanup operation would remove. |
| `pub read_version: u64,` | rust/lance/src/dataset/cleanup.rs:110-110 | Dataset version observed when the explanation was produced. |
| `pub stats: RemovalStats,` | rust/lance/src/dataset/cleanup.rs:112-112 | Aggregate statistics for files that would be removed. |
| `pub candidate_files: Vec&lt;CleanupCandidateFile&gt;,` | rust/lance/src/dataset/cleanup.rs:114-114 | Candidate files that would be removed, capped by `candidate_file_limit`. |
| `pub candidate_files_truncated: bool,` | rust/lance/src/dataset/cleanup.rs:116-116 | True if more candidate files were found than are included. |
| `pub candidate_file_limit: usize,` | rust/lance/src/dataset/cleanup.rs:118-118 | Maximum number of candidate files included in this explanation. |
| `pub referenced_branches: Vec&lt;CleanupReferencedBranch&gt;,` | rust/lance/src/dataset/cleanup.rs:120-120 | Referenced child branches and whether cleanup would cascade into them. |
| `pub warnings: Vec&lt;String&gt;,` | rust/lance/src/dataset/cleanup.rs:122-122 | Non-fatal warnings about the explanation. |
| `pub struct CleanupCandidateFile` | rust/lance/src/dataset/cleanup.rs:127-127 | A file that cleanup identified as removable. |
| `pub path: String,` | rust/lance/src/dataset/cleanup.rs:129-129 | Dataset-relative or storage path for the candidate file. |
| `pub kind: CleanupFileKind,` | rust/lance/src/dataset/cleanup.rs:131-131 | Kind of file identified by cleanup. |
| `pub unverified: bool,` | rust/lance/src/dataset/cleanup.rs:134-134 | True if the file is removable only because it aged past the unverified retention threshold or `delete_unverified` is enabled. |
| `pub size_bytes: u64,` | rust/lance/src/dataset/cleanup.rs:136-136 | Candidate file size in bytes. |
| `pub struct CleanupReferencedBranch` | rust/lance/src/dataset/cleanup.rs:141-141 | A branch that references the current branch lineage. |
| `pub name: String,` | rust/lance/src/dataset/cleanup.rs:143-143 | Branch name. |
| `pub referenced_version: u64,` | rust/lance/src/dataset/cleanup.rs:145-145 | Version of the current lineage referenced by this branch. |
| `pub cleanup_candidate: bool,` | rust/lance/src/dataset/cleanup.rs:147-147 | True if this branch would be cleaned when cascading cleanup is enabled. |
| `pub enum CleanupFileKind` | rust/lance/src/dataset/cleanup.rs:151-151 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct CleanupOperation&lt;'a&gt;` | rust/lance/src/dataset/cleanup.rs:404-404 | Builder-style cleanup operation. |
| `pub fn with_max_candidate_files(mut self, max_candidate_files: usize) -&gt; Self` | rust/lance/src/dataset/cleanup.rs:423-423 | Set the maximum number of candidate files included in explanations. |
| `pub async fn explain(&self) -&gt; Result&lt;CleanupExplanation&gt;` | rust/lance/src/dataset/cleanup.rs:429-429 | Explain what cleanup would remove without deleting files. |
| `pub async fn execute(&self) -&gt; Result&lt;RemovalStats&gt;` | rust/lance/src/dataset/cleanup.rs:459-459 | Execute cleanup by re-evaluating the current dataset state. |
| `pub struct CleanupPolicy` | rust/lance/src/dataset/cleanup.rs:1946-1946 | No standalone documentation summary; use the family contract and source entry. |
| `pub before_timestamp: Option&lt;DateTime&lt;Utc&gt;&gt;,` | rust/lance/src/dataset/cleanup.rs:1948-1948 | If not none, cleanup all versions before the specified timestamp. |
| `pub before_version: Option&lt;u64&gt;,` | rust/lance/src/dataset/cleanup.rs:1950-1950 | If not none, cleanup all versions before the specified version. |
| `pub versions: Option&lt;HashSet&lt;u64&gt;&gt;,` | rust/lance/src/dataset/cleanup.rs:1952-1952 | If not none, cleanup only the specified versions. |
| `pub delete_unverified: bool,` | rust/lance/src/dataset/cleanup.rs:1954-1954 | If true, delete unverified data files even if they are recent |
| `pub error_if_tagged_old_versions: bool,` | rust/lance/src/dataset/cleanup.rs:1956-1956 | If true, return an Error if a tagged version is old |
| `pub clean_referenced_branches: bool,` | rust/lance/src/dataset/cleanup.rs:1958-1958 | If clean the referenced branches |
| `pub delete_rate_limit: Option&lt;u64&gt;,` | rust/lance/src/dataset/cleanup.rs:1967-1967 | Maximum number of delete requests per second. If None, no rate limiting is applied. |
| `pub fn should_clean(&self, manifest: &Manifest) -&gt; bool` | rust/lance/src/dataset/cleanup.rs:1971-1971 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct CleanupPolicyBuilder` | rust/lance/src/dataset/cleanup.rs:2001-2001 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn clean_referenced_branches(mut self, clean_referenced_branches: bool) -&gt; Self` | rust/lance/src/dataset/cleanup.rs:2007-2007 | If auto clean referenced branches. |
| `pub fn before_timestamp(mut self, timestamp: DateTime&lt;Utc&gt;) -&gt; Self` | rust/lance/src/dataset/cleanup.rs:2013-2013 | Cleanup all versions before the specified timestamp. |
| `pub fn versions(mut self, versions: Vec&lt;u64&gt;) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/cleanup.rs:2026-2026 | Cleanup only the specified dataset versions. |
| `pub async fn retain_n_versions(mut self, dataset: &Dataset, n: usize) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/cleanup.rs:2041-2041 | Cleanup all versions except the last `n` versions of the dataset. |
| `pub fn delete_unverified(mut self, delete: bool) -&gt; Self` | rust/lance/src/dataset/cleanup.rs:2064-2064 | Delete without verification. |
| `pub fn error_if_tagged_old_versions(mut self, error: bool) -&gt; Self` | rust/lance/src/dataset/cleanup.rs:2071-2071 | If this argument True, an exception will be raised if any tagged versions match the parameters. |
| `pub fn delete_rate_limit(mut self, rate: u64) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/cleanup.rs:2085-2085 | Limit the number of delete requests per second during cleanup. |
| `pub fn build(self) -&gt; CleanupPolicy` | rust/lance/src/dataset/cleanup.rs:2095-2095 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn cleanup_old_versions( dataset: &Dataset, policy: CleanupPolicy, ) -&gt; Result&lt;RemovalStats&gt;` | rust/lance/src/dataset/cleanup.rs:2110-2113 | Deletes old versions of a dataset, removing files that are no longer needed. |
| `pub async fn auto_cleanup_hook( dataset: &Dataset, manifest: &Manifest, ) -&gt; Result&lt;Option&lt;RemovalStats&gt;&gt;` | rust/lance/src/dataset/cleanup.rs:2123-2126 | If the dataset config has `lance.auto_cleanup` parameters set, this function automatically calls `dataset.cleanup_old_versions` every `lance.auto_cleanup.interval` versions. This function calls `dataset.cleanup_old_versions` with `lance.auto_cleanup.older_than` for `older_than` and `Some(false)` for both `delete_unverified` and `error_if_tagged_old_versions`. |
| `pub async fn cleanup_cascade_branch( dataset: &Dataset, manifest: &Manifest, ) -&gt; Result&lt;Option&lt;RemovalStats&gt;&gt;` | rust/lance/src/dataset/cleanup.rs:2137-2140 | This is trigger when a parent branch is cleaning and `clean_referenced_branches` is set as true For cascade branches, some cleanup parameters need be overridden. |
| `pub async fn build_cleanup_policy( dataset: &Dataset, manifest: &Manifest, ) -&gt; Result&lt;Option&lt;CleanupPolicy&gt;&gt;` | rust/lance/src/dataset/cleanup.rs:2181-2184 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-src-dataset-data-file-rs"></a>

## `rust/lance/src/dataset/data_file.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct DataFileTarget` | rust/lance/src/dataset/data_file.rs:47-47 | Serializable identity and logical schema of a final concatenated data file. |
| `pub fn new( base_id: Option&lt;u32&gt;, schema: Arc&lt;Schema&gt;, version: ConcreteFileVersion, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/data_file.rs:79-83 | Create a final data-file target with Lance's ordinary random file naming. |
| `pub async fn finish(&self, dataset: &Dataset) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/data_file.rs:174-174 | Release staging parts after a successful commit, keeping the final file and its managed Blob payloads. Stop all writers and assemblers first. |
| `pub async fn cleanup(&self, dataset: &Dataset) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/data_file.rs:203-203 | Delete an abandoned target's staging parts, final file, and managed Blob payloads, including objects left by failed writes or assembly. |

<a id="source-rust-lance-src-dataset-data-file-part-rs"></a>

## `rust/lance/src/dataset/data_file_part.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct DataFilePart` | rust/lance/src/dataset/data_file_part.rs:34-34 | Serializable description of a completed staging part, containing its identity and expected metadata rather than file contents or open readers. |
| `pub fn num_rows(&self) -&gt; u64` | rust/lance/src/dataset/data_file_part.rs:45-45 | Expected physical row count, verified against the footer during assembly. |
| `pub fn size_bytes(&self) -&gt; u64` | rust/lance/src/dataset/data_file_part.rs:50-50 | Expected complete file size, verified during assembly. |

<a id="source-rust-lance-src-dataset-delta-rs"></a>

## `rust/lance/src/dataset/delta.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct DatasetDeltaBuilder` | rust/lance/src/dataset/delta.rs:91-91 | Builder for creating a [`DatasetDelta`] to explore changes between dataset versions. |
| `pub fn new(dataset: Dataset) -&gt; Self` | rust/lance/src/dataset/delta.rs:102-102 | Create a new builder for the given dataset. |
| `pub fn compared_against_version(mut self, version: u64) -&gt; Self` | rust/lance/src/dataset/delta.rs:117-117 | Compare the current dataset version against the specified version. |
| `pub fn with_begin_version(mut self, version: u64) -&gt; Self` | rust/lance/src/dataset/delta.rs:126-126 | Set the beginning version for the delta (exclusive). |
| `pub fn with_end_version(mut self, version: u64) -&gt; Self` | rust/lance/src/dataset/delta.rs:135-135 | Set the ending version for the delta (inclusive). |
| `pub fn with_begin_date(mut self, timestamp: DateTime&lt;Utc&gt;) -&gt; Self` | rust/lance/src/dataset/delta.rs:144-144 | Set the beginning timestamp for the delta (exclusive). |
| `pub fn with_end_date(mut self, timestamp: DateTime&lt;Utc&gt;) -&gt; Self` | rust/lance/src/dataset/delta.rs:153-153 | Set the ending timestamp for the delta (inclusive). |
| `pub fn build(self) -&gt; Result&lt;DatasetDelta&gt;` | rust/lance/src/dataset/delta.rs:166-166 | Build the [`DatasetDelta`]. |
| `pub struct DatasetDelta` | rust/lance/src/dataset/delta.rs:233-233 | APIs for exploring changes between two versions of a dataset. |
| `pub async fn list_transactions(&self) -&gt; Result&lt;Vec&lt;Transaction&gt;&gt;` | rust/lance/src/dataset/delta.rs:289-289 | Listing the transactions between two versions. |
| `pub async fn get_deleted_row_ids(&self) -&gt; Result&lt;DatasetRecordBatchStream&gt;` | rust/lance/src/dataset/delta.rs:345-345 | The stable row ids live at the begin version and absent at the end version, as a stream of batches carrying a single [`ROW_ID`] column. Rows in a fragment the range removed outright count as deleted. |
| `pub async fn get_inserted_rows(&self) -&gt; Result&lt;DatasetRecordBatchStream&gt;` | rust/lance/src/dataset/delta.rs:451-451 | Get inserted rows between the two versions. |
| `pub async fn get_updated_rows(&self) -&gt; Result&lt;DatasetRecordBatchStream&gt;` | rust/lance/src/dataset/delta.rs:509-509 | Get updated rows between the two versions. |
| `pub async fn get_upserted_rows(&self) -&gt; Result&lt;DatasetRecordBatchStream&gt;` | rust/lance/src/dataset/delta.rs:572-572 | Get upserted rows between the two versions. |

<a id="source-rust-lance-src-dataset-files-rs"></a>

## `rust/lance/src/dataset/files.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct TrackedFilesProgress` | rust/lance/src/dataset/files.rs:252-252 | Progress update for [`Dataset::tracked_files_with_options`]. |
| `pub manifests_processed: usize,` | rust/lance/src/dataset/files.rs:254-254 | Number of manifests processed so far. |
| `pub manifests_total: Option&lt;usize&gt;,` | rust/lance/src/dataset/files.rs:257-257 | Total number of manifests, if known. This becomes `Some` once the listing stream is exhausted; until then it is `None`. |
| `pub struct TrackedFilesOptions` | rust/lance/src/dataset/files.rs:262-262 | Options for [`Dataset::tracked_files_with_options`]. |
| `pub min_version: Option&lt;u64&gt;,` | rust/lance/src/dataset/files.rs:264-264 | If set, only include manifests with `version &gt;= min_version`. |
| `pub progress: Option&lt;Box&lt;dyn Fn(TrackedFilesProgress) + Send + Sync&gt;&gt;,` | rust/lance/src/dataset/files.rs:269-269 | If set, called each time a manifest has been fully processed. The callback runs on a background tokio task, so it must not block (it will stall the manifest reader pipeline). Order is the order in which manifests finish processing, which is not the version order. |
| `pub async fn tracked_files(&self) -&gt; SendableRecordBatchStream` | rust/lance/src/dataset/files.rs:288-288 | Returns one row per (version, file) for every file referenced in any manifest. |
| `pub async fn tracked_files_with_options( &self, options: TrackedFilesOptions, ) -&gt; SendableRecordBatchStream` | rust/lance/src/dataset/files.rs:295-298 | Like [`Self::tracked_files`], but with additional options for filtering and progress reporting. |
| `pub async fn all_files(&self) -&gt; SendableRecordBatchStream` | rust/lance/src/dataset/files.rs:429-429 | Returns one row per file that physically exists at the dataset's base URI. |

<a id="source-rust-lance-src-dataset-files-arrow-rs"></a>

## `rust/lance/src/dataset/files/arrow.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub static FILE_TYPE_DICT_ARRAY: LazyLock&lt;ArrayRef&gt; = LazyLock::new(\|\|` | rust/lance/src/dataset/files/arrow.rs:17-17 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FileTypeArrayBuilder` | rust/lance/src/dataset/files/arrow.rs:27-27 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_capacity(capacity: usize) -&gt; Self` | rust/lance/src/dataset/files/arrow.rs:32-32 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn append_value(&mut self, file_type: FileType)` | rust/lance/src/dataset/files/arrow.rs:38-38 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn finish(mut self) -&gt; DictionaryArray&lt;Int8Type&gt;` | rust/lance/src/dataset/files/arrow.rs:43-43 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_capacity(capacity: usize) -&gt; Self` | rust/lance/src/dataset/files/arrow.rs:95-95 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn append(&mut self, row: &FileRow)` | rust/lance/src/dataset/files/arrow.rs:105-105 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn len(&self) -&gt; usize` | rust/lance/src/dataset/files/arrow.rs:112-112 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn finish(mut self) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/files/arrow.rs:116-116 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-files-file-types-rs"></a>

## `rust/lance/src/dataset/files/file_types.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub enum FileType` | rust/lance/src/dataset/files/file_types.rs:8-8 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-files-scan-rs"></a>

## `rust/lance/src/dataset/files/scan.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct ScannedManifest` | rust/lance/src/dataset/files/scan.rs:72-72 | One manifest produced by [`scan_manifests`], with what was read alongside it. |
| `pub manifest: Arc&lt;Manifest&gt;,` | rust/lance/src/dataset/files/scan.rs:73-73 | No standalone documentation summary; use the family contract and source entry. |
| `pub manifest_path: String,` | rust/lance/src/dataset/files/scan.rs:75-75 | The manifest's own path, relative to the dataset root. |
| `pub indexes: Vec&lt;IndexMetadata&gt;,` | rust/lance/src/dataset/files/scan.rs:77-77 | Index metadata from this manifest's index section. Empty when it has none. |
| `pub struct ManifestScan` | rust/lance/src/dataset/files/scan.rs:84-84 | A running manifest walk. |
| `pub stream: BoxStream&lt;'static, Result&lt;ScannedManifest&gt;&gt;,` | rust/lance/src/dataset/files/scan.rs:86-86 | Manifests in completion order, which is not version order. |
| `pub total: Arc&lt;std::sync::OnceLock&lt;usize&gt;&gt;,` | rust/lance/src/dataset/files/scan.rs:89-89 | Number of manifests the walk will yield. Set once listing finishes, so a consumer reading it mid-walk may still see `None`. |
| `pub fn scan_manifests(dataset: &Dataset, min_version: Option&lt;u64&gt;) -&gt; ManifestScan` | rust/lance/src/dataset/files/scan.rs:116-116 | Walk every present manifest of `dataset`. |

<a id="source-rust-lance-src-dataset-fragment-rs"></a>

## `rust/lance/src/dataset/fragment.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod session;` | rust/lance/src/dataset/fragment.rs:6-6 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod write;` | rust/lance/src/dataset/fragment.rs:7-7 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FragmentUpdateColumnsResult` | rust/lance/src/dataset/fragment.rs:85-85 | Result of [`FileFragment::update_columns_with_offsets`]: updated fragment metadata, modified field ids, and physical row offsets that matched the join (for stable row-id version metadata). |
| `pub fragment: Fragment,` | rust/lance/src/dataset/fragment.rs:86-86 | No standalone documentation summary; use the family contract and source entry. |
| `pub fields_modified: Vec&lt;u32&gt;,` | rust/lance/src/dataset/fragment.rs:87-87 | No standalone documentation summary; use the family contract and source entry. |
| `pub matched_offsets: RoaringBitmap,` | rust/lance/src/dataset/fragment.rs:89-89 | Physical row offsets (0-based within this fragment) whose columns were rewritten from the right-hand stream. |
| `pub struct FileFragment` | rust/lance/src/dataset/fragment.rs:96-96 | A Fragment of a Lance [`Dataset`]. |
| `pub trait GenericFileReader: std::fmt::Debug + Send + Sync` | rust/lance/src/dataset/fragment.rs:113-113 | A trait for file readers to be implemented by both the v1 and v2 readers |
| `pub struct Reader` | rust/lance/src/dataset/fragment.rs:428-428 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( reader: Arc&lt;ProjectedFileReader&gt;, projection: Arc&lt;Schema&gt;, field_id_to_column_idx: Arc&lt;BTreeMap&lt;u32, u32&gt;&gt;, default_priority: u32, file_scheduler: FileScheduler, ) -&gt; Self` | rust/lance/src/dataset/fragment.rs:437-443 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct BaseSchedulers` | rust/lance/src/dataset/fragment.rs:742-742 | A per-scan cache of `ScanScheduler`s for non-default bases. |
| `pub fn new(io_buffer_size: u64) -&gt; Self` | rust/lance/src/dataset/fragment.rs:759-759 | Create an empty cache whose schedulers will use `io_buffer_size`, the same budget as the scan's primary scheduler. |
| `pub fn max_bandwidth() -&gt; Self` | rust/lance/src/dataset/fragment.rs:769-769 | Create an empty cache whose schedulers are sized for the max bandwidth of their base's object store, for scans whose primary scheduler uses [`SchedulerConfig::max_bandwidth`]. |
| `pub struct FragReadConfig` | rust/lance/src/dataset/fragment.rs:800-800 | No standalone documentation summary; use the family contract and source entry. |
| `pub with_row_id: bool,` | rust/lance/src/dataset/fragment.rs:802-802 | No standalone documentation summary; use the family contract and source entry. |
| `pub with_row_address: bool,` | rust/lance/src/dataset/fragment.rs:804-804 | No standalone documentation summary; use the family contract and source entry. |
| `pub with_row_last_updated_at_version: bool,` | rust/lance/src/dataset/fragment.rs:806-806 | No standalone documentation summary; use the family contract and source entry. |
| `pub with_row_created_at_version: bool,` | rust/lance/src/dataset/fragment.rs:808-808 | No standalone documentation summary; use the family contract and source entry. |
| `pub scan_scheduler: Option&lt;Arc&lt;ScanScheduler&gt;&gt;,` | rust/lance/src/dataset/fragment.rs:813-813 | The scan scheduler to use for reading data files. |
| `pub reader_priority: Option&lt;u32&gt;,` | rust/lance/src/dataset/fragment.rs:821-821 | The default scan priority to use for reading data files |
| `pub file_reader_options: Option&lt;FileReaderOptions&gt;,` | rust/lance/src/dataset/fragment.rs:823-823 | File reader options to use when reading data files. |
| `pub base_schedulers: Option&lt;BaseSchedulers&gt;,` | rust/lance/src/dataset/fragment.rs:828-828 | Per-scan cache of schedulers for non-default bases. |
| `pub fn with_row_id(mut self, value: bool) -&gt; Self` | rust/lance/src/dataset/fragment.rs:832-832 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_row_address(mut self, value: bool) -&gt; Self` | rust/lance/src/dataset/fragment.rs:837-837 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_row_last_updated_at_version(mut self, value: bool) -&gt; Self` | rust/lance/src/dataset/fragment.rs:842-842 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_row_created_at_version(mut self, value: bool) -&gt; Self` | rust/lance/src/dataset/fragment.rs:847-847 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn has_system_cols(&self) -&gt; bool` | rust/lance/src/dataset/fragment.rs:852-852 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_scan_scheduler(mut self, value: Arc&lt;ScanScheduler&gt;) -&gt; Self` | rust/lance/src/dataset/fragment.rs:859-859 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_reader_priority(mut self, value: u32) -&gt; Self` | rust/lance/src/dataset/fragment.rs:864-864 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_file_reader_options(mut self, value: FileReaderOptions) -&gt; Self` | rust/lance/src/dataset/fragment.rs:869-869 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_base_schedulers(mut self, value: BaseSchedulers) -&gt; Self` | rust/lance/src/dataset/fragment.rs:874-874 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(dataset: Arc&lt;Dataset&gt;, metadata: Fragment) -&gt; Self` | rust/lance/src/dataset/fragment.rs:971-971 | Creates a new FileFragment. |
| `pub async fn create( dataset_uri: &str, id: usize, source: impl StreamingWriteSource, params: Option&lt;WriteParams&gt;, ) -&gt; Result&lt;Fragment&gt;` | rust/lance/src/dataset/fragment.rs:981-986 | Create a new [`FileFragment`] from a [`StreamingWriteSource`]. |
| `pub async fn create_fragments( dataset_uri: &str, source: impl StreamingWriteSource, params: Option&lt;WriteParams&gt;, ) -&gt; Result&lt;Vec&lt;Fragment&gt;&gt;` | rust/lance/src/dataset/fragment.rs:997-1001 | Create a list of [`FileFragment`] from a [`StreamingWriteSource`]. |
| `pub async fn create_from_file( filename: &str, dataset: &Dataset, fragment_id: usize, physical_rows: Option&lt;usize&gt;, ) -&gt; Result&lt;Fragment&gt;` | rust/lance/src/dataset/fragment.rs:1011-1016 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn dataset(&self) -&gt; &Dataset` | rust/lance/src/dataset/fragment.rs:1114-1114 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn schema(&self) -&gt; &Schema` | rust/lance/src/dataset/fragment.rs:1118-1118 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn metadata(&self) -&gt; &Fragment` | rust/lance/src/dataset/fragment.rs:1123-1123 | Returns the fragment's metadata. |
| `pub fn id(&self) -&gt; usize` | rust/lance/src/dataset/fragment.rs:1128-1128 | The id of this [`FileFragment`]. |
| `pub fn num_data_files(&self) -&gt; usize` | rust/lance/src/dataset/fragment.rs:1133-1133 | The number of data files in this fragment. |
| `pub fn data_file_for_field(&self, field_id: u32) -&gt; Option&lt;&DataFile&gt;` | rust/lance/src/dataset/fragment.rs:1138-1138 | Gets the data file for a given field |
| `pub async fn open( &self, projection: &Schema, read_config: FragReadConfig, ) -&gt; Result&lt;FragmentReader&gt;` | rust/lance/src/dataset/fragment.rs:1159-1163 | Open a FileFragment with a given default projection. |
| `pub async fn count_rows(&self, filter: Option&lt;String&gt;) -&gt; Result&lt;usize&gt;` | rust/lance/src/dataset/fragment.rs:1624-1624 | Count the rows in this fragment. |
| `pub async fn count_deletions(&self) -&gt; Result&lt;usize&gt;` | rust/lance/src/dataset/fragment.rs:1648-1648 | Get the number of rows that have been deleted in this fragment. |
| `pub fn fast_physical_rows(&self) -&gt; Result&lt;usize&gt;` | rust/lance/src/dataset/fragment.rs:1669-1669 | Get the number of physical rows in the fragment synchronously |
| `pub fn fast_num_deletions(&self) -&gt; Result&lt;usize&gt;` | rust/lance/src/dataset/fragment.rs:1690-1690 | Get the number of deleted rows in the fragment synchronously |
| `pub fn fast_logical_rows(&self) -&gt; Result&lt;usize&gt;` | rust/lance/src/dataset/fragment.rs:1708-1708 | Get the number of logical rows (physical rows - deleted rows) in the fragment synchronously |
| `pub async fn physical_rows(&self) -&gt; Result&lt;usize&gt;` | rust/lance/src/dataset/fragment.rs:1718-1718 | Get the number of physical rows in the fragment. This includes deleted rows. |
| `pub async fn validate(&self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/fragment.rs:1765-1765 | Validate the fragment |
| `pub async fn open_session( &self, projection: &Schema, with_row_address: bool, ) -&gt; Result&lt;FragmentSession&gt;` | rust/lance/src/dataset/fragment.rs:1946-1950 | Open a [`FragmentSession`], which manages a short-lived session of [`FileFragment`]. |
| `pub async fn take(&self, indices: &[u32], projection: &Schema) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/fragment.rs:1958-1958 | Take rows from this fragment based on the offset in the file. |
| `pub async fn read_physical_slice( &self, rows: Range&lt;u64&gt;, projection: &Schema, batch_size: u32, ) -&gt; Result&lt;ReadBatchFutStream&gt;` | rust/lance/src/dataset/fragment.rs:2013-2018 | Read a fragment-local half-open physical row interval without applying deletions. |
| `pub async fn get_deletion_vector(&self) -&gt; Result&lt;Option&lt;Arc&lt;DeletionVector&gt;&gt;&gt;` | rust/lance/src/dataset/fragment.rs:2100-2100 | Get the deletion vector for this fragment, using the cache if available. |
| `pub async fn get_file_metadata( &self, file_scheduler: &FileScheduler, ) -&gt; Result&lt;Arc&lt;CachedFileMetadata&gt;&gt;` | rust/lance/src/dataset/fragment.rs:2112-2115 | Get the file metadata for this fragment, using the cache if available. |
| `pub async fn get_file_metadata_index( &self, file_scheduler: &FileScheduler, known_schema: Option&lt;(Arc&lt;Schema&gt;, u64)&gt;, ) -&gt; Result&lt;Arc&lt;FileMetadataIndex&gt;&gt;` | rust/lance/src/dataset/fragment.rs:2129-2133 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn scan(&self) -&gt; Scanner` | rust/lance/src/dataset/fragment.rs:2214-2214 | Scan this [`FileFragment`]. |
| `pub async fn merge_columns( &mut self, stream: impl RecordBatchReader + Send + 'static, left_on: &str, right_on: &str, ) -&gt; Result&lt;(Fragment, Schema)&gt;` | rust/lance/src/dataset/fragment.rs:2313-2318 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn update_columns( &mut self, right_stream: impl RecordBatchReader + Send + 'static, left_on: &str, right_on: &str, ) -&gt; Result&lt;(Fragment, Vec&lt;u32&gt;)&gt;` | rust/lance/src/dataset/fragment.rs:2381-2386 | Same as [`Self::update_columns_with_offsets`] but discards the matched row offsets. Use [`Self::update_columns_with_offsets`] if you need per-row version metadata for stable row IDs. |
| `pub async fn update_columns_with_offsets( &mut self, right_stream: impl RecordBatchReader + Send + 'static, left_on: &str, right_on: &str, ) -&gt; Result&lt;FragmentUpdateColumnsResult&gt;` | rust/lance/src/dataset/fragment.rs:2394-2399 | Same operation as [`Self::update_columns`], and also returns matched physical row offsets for stable row IDs. |
| `pub async fn add_columns( &self, transforms: NewColumnTransform, read_columns: Option&lt;Vec&lt;String&gt;&gt;, batch_size: Option&lt;u32&gt;, ) -&gt; Result&lt;(Fragment, Schema)&gt;` | rust/lance/src/dataset/fragment.rs:2573-2578 | Append new columns to the fragment |
| `pub async fn write_columns( &self, data: impl Stream&lt;Item = Result&lt;RecordBatch&gt;&gt; + Send, schema: &Schema, ) -&gt; Result&lt;super::transaction::DataReplacementGroup&gt;` | rust/lance/src/dataset/fragment.rs:2624-2628 | Write new data for columns of this fragment as a standalone data file, without committing it, and return the `DataReplacementGroup` describing it. |
| `pub async fn write_column_with_version( &self, data: impl Stream&lt;Item = Result&lt;RecordBatch&gt;&gt; + Send, schema: &Schema, write_version: ConcreteFileVersion, ) -&gt; Result&lt;super::transaction::DataReplacementGroup&gt;` | rust/lance/src/dataset/fragment.rs:2658-2663 | Write replacement column data using an exact V2 data file version. |
| `pub async fn write_overlay( &self, schema: &Schema, ) -&gt; std::result::Result&lt;OverlayWriter, WriteOverlayError&gt;` | rust/lance/src/dataset/fragment.rs:2906-2909 | Stage a data overlay supplying new values for a subset of this fragment's cells, without rewriting its base data files. |
| `pub async fn delete(self, predicate: &str) -&gt; Result&lt;Option&lt;Self&gt;&gt;` | rust/lance/src/dataset/fragment.rs:2918-2918 | Delete rows from the fragment. |
| `pub async fn extend_deletions( self, new_deletions: impl IntoIterator&lt;Item = u32&gt;, ) -&gt; Result&lt;Option&lt;Self&gt;&gt;` | rust/lance/src/dataset/fragment.rs:2989-2992 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FragmentReader` | rust/lance/src/dataset/fragment.rs:3331-3331 | [`FragmentReader`] is an abstract reader for a [`FileFragment`]. |
| `pub async fn read_range( &self, range: Range&lt;u32&gt;, batch_size: u32, ) -&gt; Result&lt;ReadBatchFutStream&gt;` | rust/lance/src/dataset/fragment.rs:3790-3794 | Reads a range of rows from the fragment |
| `pub async fn take_range( &self, range: Range&lt;u32&gt;, batch_size: u32, ) -&gt; Result&lt;ReadBatchFutStream&gt;` | rust/lance/src/dataset/fragment.rs:3804-3808 | Takes a range of rows from the fragment |
| `pub async fn read_all(&self, batch_size: u32) -&gt; Result&lt;ReadBatchFutStream&gt;` | rust/lance/src/dataset/fragment.rs:3815-3815 | Reads all rows from the fragment. |
| `pub async fn read_ranges( &self, ranges: Arc&lt;[Range&lt;u64&gt;]&gt;, batch_size: u32, ) -&gt; Result&lt;ReadBatchFutStream&gt;` | rust/lance/src/dataset/fragment.rs:3827-3831 | This is async for the same reason as [`Self::read_range`]. |
| `pub async fn read_range_as_batch(&self, range: Range&lt;usize&gt;) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/fragment.rs:3932-3932 | Reads a range and concatenates the result into one batch. |
| `pub async fn take( &self, indices: &[u32], batch_size: u32, take_priority: Option&lt;u32&gt;, ) -&gt; Result&lt;ReadBatchFutStream&gt;` | rust/lance/src/dataset/fragment.rs:3946-3951 | Take rows from this fragment. |
| `pub async fn take_as_batch( &self, indices: &[u32], take_priority: Option&lt;u32&gt;, ) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/fragment.rs:3972-3976 | Take rows from this fragment, will perform a copy if the underlying reader returns multiple batches. May return an error if the taken rows do not fit into a single batch. |


<a id="source-rust-lance-src-dataset-fragment-session-rs"></a>

## `rust/lance/src/dataset/fragment/session.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct FragmentSession` | rust/lance/src/dataset/fragment/session.rs:18-18 | A [`FragmentSession`] manages a short-lived session of [`FileFragment`], allowing us to maintain internal states instead of creating new ones each time. |
| `pub async fn open( fragment: Arc&lt;FileFragment&gt;, projection: &Schema, with_row_address: bool, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/fragment/session.rs:24-28 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn take(&self, indices: &[u32]) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/fragment/session.rs:48-48 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-fragment-write-rs"></a>

## `rust/lance/src/dataset/fragment/write.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct FragmentCreateBuilder&lt;'a&gt;` | rust/lance/src/dataset/fragment/write.rs:73-73 | Builder for writing a new fragment. |
| `pub fn new(dataset_uri: &'a str) -&gt; Self` | rust/lance/src/dataset/fragment/write.rs:80-80 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn schema(mut self, schema: &'a Schema) -&gt; Self` | rust/lance/src/dataset/fragment/write.rs:94-94 | Set the schema of the fragment. If it is not known, it will be inferred. |
| `pub fn write_params(mut self, params: &'a WriteParams) -&gt; Self` | rust/lance/src/dataset/fragment/write.rs:100-100 | Set the write parameters. |
| `pub async fn write( &self, source: impl StreamingWriteSource, id: Option&lt;u64&gt;, ) -&gt; Result&lt;Fragment&gt;` | rust/lance/src/dataset/fragment/write.rs:112-116 | Write a fragment. |
| `pub async fn write_fragments( &self, source: impl StreamingWriteSource, ) -&gt; Result&lt;Vec&lt;Fragment&gt;&gt;` | rust/lance/src/dataset/fragment/write.rs:133-136 | Write multi fragment which separated by max_rows_per_file. |

<a id="source-rust-lance-src-dataset-hash-joiner-rs"></a>

## `rust/lance/src/dataset/hash_joiner.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct HashJoiner` | rust/lance/src/dataset/hash_joiner.rs:20-20 | `HashJoiner` does hash join on two datasets. |
| `pub async fn try_new(reader: Box&lt;dyn RecordBatchReader + Send&gt;, on: &str) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/hash_joiner.rs:40-40 | Create a new `HashJoiner`, building the hash index. |
| `pub fn out_schema(&self) -&gt; &SchemaRef` | rust/lance/src/dataset/hash_joiner.rs:120-120 | Returns the schema of data yielded by `collect()`. |
| `pub fn check_lance_support_null( column_name: &str, array: &ArrayRef, dataset: &Dataset, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/hash_joiner.rs:198-202 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-index-rs"></a>

## `rust/lance/src/dataset/index.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod frag_reuse;` | rust/lance/src/dataset/index.rs:4-4 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct DatasetIndexRemapperOptions` | rust/lance/src/dataset/index.rs:32-32 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait LanceIndexStoreExt` | rust/lance/src/dataset/index.rs:161-161 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-index-frag-reuse-rs"></a>

## `rust/lance/src/dataset/index/frag_reuse.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub async fn frag_reuse_index(&self) -&gt; Result&lt;Option&lt;Arc&lt;CompactFragReuseIndex&gt;&gt;&gt;` | rust/lance/src/dataset/index/frag_reuse.rs:78-78 | Opens the fragment reuse index (FRI) recorded in the dataset version this handle has loaded, or `None` if that version has none. The index is served from the session index cache, so repeated calls do not re-read it. |
| `pub async fn cleanup_frag_reuse_index(dataset: &mut Dataset) -&gt; lance_core::Result&lt;()&gt;` | rust/lance/src/dataset/index/frag_reuse.rs:120-120 | Cleanup a fragment reuse index based on the current condition of the indices. If all the indices currently available are already caught up to as a specific reuse version, all older reuse versions (inclusive) can be cleaned up. |

<a id="source-rust-lance-src-dataset-mem-wal-rs"></a>

## `rust/lance/src/dataset/mem_wal.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod index;` | rust/lance/src/dataset/mem_wal.rs:37-37 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod memtable;` | rust/lance/src/dataset/mem_wal.rs:39-39 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod observer;` | rust/lance/src/dataset/mem_wal.rs:40-40 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod scanner;` | rust/lance/src/dataset/mem_wal.rs:42-42 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod sharding;` | rust/lance/src/dataset/mem_wal.rs:43-43 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod util;` | rust/lance/src/dataset/mem_wal.rs:46-46 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod write;` | rust/lance/src/dataset/mem_wal.rs:48-48 | No standalone documentation summary; use the family contract and source entry. |
| `pub const TOMBSTONE: &str = "_tombstone";` | rust/lance/src/dataset/mem_wal.rs:75-75 | Column name for the mem_wal tombstone (delete sentinel) marker. |
| `pub generation: u64,` | rust/lance/src/dataset/mem_wal.rs:87-87 | No standalone documentation summary; use the family contract and source entry. |
| `pub generation_dir: String,` | rust/lance/src/dataset/mem_wal.rs:88-88 | No standalone documentation summary; use the family contract and source entry. |
| `pub data_file_name: String,` | rust/lance/src/dataset/mem_wal.rs:89-89 | No standalone documentation summary; use the family contract and source entry. |
| `pub creator_epoch: u64,` | rust/lance/src/dataset/mem_wal.rs:90-90 | No standalone documentation summary; use the family contract and source entry. |
| `pub batch_capacity: usize,` | rust/lance/src/dataset/mem_wal.rs:91-91 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(generation: u64, creator_epoch: u64, batch_capacity: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal.rs:95-95 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn generation_path(&self, base_path: &Path, shard_id: &Uuid) -&gt; Path` | rust/lance/src/dataset/mem_wal.rs:106-106 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn data_file_key(&self) -&gt; &str` | rust/lance/src/dataset/mem_wal.rs:110-110 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn tombstone_field() -&gt; ArrowField` | rust/lance/src/dataset/mem_wal.rs:148-148 | The mem_wal tombstone field appended to the logical schema on the way to the storage schema. |
| `pub fn relax_non_pk_nullability( logical_schema: &ArrowSchema, pk_columns: &[String], ) -&gt; Arc&lt;ArrowSchema&gt;` | rust/lance/src/dataset/mem_wal.rs:165-168 | Derive a shard's *storage* schema from its *logical* (base table) schema by widening every top-level field to nullable except the primary key and `_tombstone`. |
| `pub fn arrow_schema_with_field_ids(schema: &Schema) -&gt; ArrowSchema` | rust/lance/src/dataset/mem_wal.rs:199-199 | The schema's Arrow form, with each field's id carried in its metadata. |
| `pub fn schema_with_tombstone(base: &ArrowSchema) -&gt; Arc&lt;ArrowSchema&gt;` | rust/lance/src/dataset/mem_wal.rs:265-265 | Extend the logical schema with the trailing `_tombstone` column — the intermediate [`relax_non_pk_nullability`] widens into the storage schema. |
| `pub fn reconcile_batches( source_schema: &ArrowSchema, target_schema: &Arc&lt;ArrowSchema&gt;, pk_columns: &[String], batches: Vec&lt;RecordBatch&gt;, ) -&gt; lance_core::Result&lt;Vec&lt;RecordBatch&gt;&gt;` | rust/lance/src/dataset/mem_wal.rs:287-292 | `batches`, written under `source_schema`, brought to `target_schema`. |
| `pub use api::` | rust/lance/src/dataset/mem_wal.rs:318-318 | No standalone documentation summary; use the family contract and source entry. |
| `pub use index::` | rust/lance/src/dataset/mem_wal.rs:322-322 | No standalone documentation summary; use the family contract and source entry. |
| `pub use manifest::ShardManifestStore;` | rust/lance/src/dataset/mem_wal.rs:323-323 | No standalone documentation summary; use the family contract and source entry. |
| `pub use memtable::scanner::MemTableScanner;` | rust/lance/src/dataset/mem_wal.rs:324-324 | No standalone documentation summary; use the family contract and source entry. |
| `pub use scanner::` | rust/lance/src/dataset/mem_wal.rs:325-325 | No standalone documentation summary; use the family contract and source entry. |
| `pub use sharding::` | rust/lance/src/dataset/mem_wal.rs:326-326 | No standalone documentation summary; use the family contract and source entry. |
| `pub use wal::` | rust/lance/src/dataset/mem_wal.rs:330-330 | No standalone documentation summary; use the family contract and source entry. |
| `pub use write::SealFence;` | rust/lance/src/dataset/mem_wal.rs:331-331 | No standalone documentation summary; use the family contract and source entry. |
| `pub use write::ShardWriter;` | rust/lance/src/dataset/mem_wal.rs:332-332 | No standalone documentation summary; use the family contract and source entry. |
| `pub use write::ShardWriterConfig;` | rust/lance/src/dataset/mem_wal.rs:333-333 | No standalone documentation summary; use the family contract and source entry. |
| `pub use write::WriteResult;` | rust/lance/src/dataset/mem_wal.rs:334-334 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-src-dataset-mem-wal-api-rs"></a>

## `rust/lance/src/dataset/mem_wal/api.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct InitializeMemWalBuilder&lt;'a&gt;` | rust/lance/src/dataset/mem_wal/api.rs:160-160 | Builder for initializing MemWAL on a [`Dataset`]. |
| `pub fn unsharded(mut self) -&gt; Self` | rust/lance/src/dataset/mem_wal/api.rs:180-180 | Route every row to a single MemWAL shard. |
| `pub fn bucket_sharding(mut self, column: impl Into&lt;String&gt;, num_buckets: u32) -&gt; Self` | rust/lance/src/dataset/mem_wal/api.rs:190-190 | Hash-bucket `column` into `num_buckets` shards. |
| `pub fn identity_sharding(mut self, column: impl Into&lt;String&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/api.rs:205-205 | Shard by the raw value of `column` (the identity transform). |
| `pub fn maintained_indexes&lt;I, S&gt;(mut self, indexes: I) -&gt; Self where I: IntoIterator&lt;Item = S&gt;, S: Into&lt;String&gt;,` | rust/lance/src/dataset/mem_wal/api.rs:218-222 | Set the base-table indexes to maintain in MemTables, replacing any previously set list. |
| `pub fn mem_index_registry(mut self, registry: MemIndexRegistry) -&gt; Self` | rust/lance/src/dataset/mem_wal/api.rs:229-229 | Validate the maintained set against these plugins, the ones the writers will open with. |
| `pub fn writer_config_defaults(mut self, config: ShardWriterConfig) -&gt; Self` | rust/lance/src/dataset/mem_wal/api.rs:245-245 | Record `config` as the default `ShardWriter` configuration. |
| `pub fn add_writer_config_default( mut self, key: impl Into&lt;String&gt;, value: impl Into&lt;String&gt;, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/api.rs:255-259 | Record a single arbitrary writer-configuration default. |
| `pub async fn execute(self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/api.rs:272-272 | Initialize MemWAL on the dataset, committing the MemWAL system index. |
| `pub trait DatasetMemWalExt` | rust/lance/src/dataset/mem_wal/api.rs:550-550 | Extension trait for Dataset to support MemWAL operations. |
| `pub async fn evolve_to(&self, dataset: &Dataset) -&gt; Result&lt;Option&lt;SealFence&gt;&gt;` | rust/lance/src/dataset/mem_wal/api.rs:871-871 | Moves this writer onto `dataset`'s current schema and maintained indexes. |
| `pub async fn validate_maintained_indexes(dataset: &Dataset, index_names: &[String]) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/api.rs:1184-1184 | Whether the MemWAL can maintain `index_names` on `dataset`. |
| `pub async fn validate_maintained_indexes_with( dataset: &Dataset, index_names: &[String], registry: &MemIndexRegistry, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/api.rs:1190-1194 | [`validate_maintained_indexes`] against `registry`, the plugins the writers will open with. |


<a id="source-rust-lance-src-dataset-mem-wal-hnsw-graph-rs"></a>

## `rust/lance/src/dataset/mem_wal/hnsw/graph.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct BuildParams` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:33-33 | Parameters for HNSW graph construction. |
| `pub max_level: u16,` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:35-35 | Maximum number of graph levels. |
| `pub m: usize,` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:37-37 | Number of neighbors retained on upper levels. Level 0 retains `2 * m`. |
| `pub ef_construction: usize,` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:39-39 | Beam width used while inserting nodes. |
| `pub prefetch_distance: Option&lt;usize&gt;,` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:41-41 | Lance-compatible prefetch hint retained in exported metadata. |
| `pub seed: u64,` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:44-44 | Random seed used for deterministic level assignment. |
| `pub fn mem_wal_default() -&gt; Self` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:61-61 | Defaults intended for active MemTable indexing. |
| `pub fn max_level(mut self, max_level: u16) -&gt; Self` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:70-70 | Set the maximum number of graph levels. |
| `pub fn num_edges(mut self, m: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:76-76 | Set the HNSW `M` parameter. |
| `pub fn ef_construction(mut self, ef_construction: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:82-82 | Set the construction beam width. |
| `pub fn seed(mut self, seed: u64) -&gt; Self` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:88-88 | Set the deterministic level-assignment seed. |
| `pub struct SearchParams` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:123-123 | Query parameters for graph search. |
| `pub k: usize,` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:125-125 | Number of nearest neighbors to return. |
| `pub ef: usize,` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:127-127 | Beam width used by the bottom-level search. |
| `pub fn new(k: usize, ef: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:132-132 | Create search params, using `max(k, ef)` internally. |
| `pub struct ScoredPoint` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:139-139 | Candidate with an internal vector id and distance. |
| `pub id: u32,` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:140-140 | No standalone documentation summary; use the family contract and source entry. |
| `pub distance: f32,` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:141-141 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct SearchResult` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:168-168 | Search result with Lance row id attached. |
| `pub id: u32,` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:169-169 | No standalone documentation summary; use the family contract and source entry. |
| `pub row_id: u64,` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:170-170 | No standalone documentation summary; use the family contract and source entry. |
| `pub distance: f32,` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:171-171 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct LanceHnswMetadata` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:189-189 | Metadata stored under `lance:hnsw` in Lance HNSW batches. |
| `pub entry_point: u32,` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:190-190 | No standalone documentation summary; use the family contract and source entry. |
| `pub params: BuildParams,` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:191-191 | No standalone documentation summary; use the family contract and source entry. |
| `pub level_offsets: Vec&lt;usize&gt;,` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:192-192 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct HnswGraph` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:305-305 | Multi-reader / single-writer HNSW graph. |
| `pub fn try_new(capacity: usize, params: BuildParams) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:326-326 | Pre-allocate graph nodes and their random levels. |
| `pub fn len(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:417-417 | Number of nodes visible to readers. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:422-422 | Returns true if no nodes are visible to readers. |
| `pub fn indexed_len(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:428-428 | Number of nodes already inserted into the graph, including unpublished in-flight writer batches after insertion completes. |
| `pub fn params(&self) -&gt; &BuildParams` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:433-433 | Graph build parameters. |
| `pub fn insert(&self, id: u32, vectors: &impl VectorSource) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:438-438 | Insert and publish a single vector id. |
| `pub fn insert_batch(&self, ids: Range&lt;u32&gt;, vectors: &impl VectorSource) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:459-459 | Insert a contiguous id range using Rayon worker threads. |
| `pub fn insert_batch_serial(&self, ids: Range&lt;u32&gt;, vectors: &impl VectorSource) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:496-496 | Insert a contiguous id range serially. |
| `pub fn insert_batch_with_threads( &self, ids: Range&lt;u32&gt;, vectors: &impl VectorSource, threads: usize, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:521-526 | Insert a contiguous id range using the current thread. |
| `pub fn search( &self, query: &[f32], params: SearchParams, vectors: &impl VectorSource, ) -&gt; Result&lt;Vec&lt;SearchResult&gt;&gt;` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:534-539 | Search the published visible graph. |
| `pub fn to_lance_hnsw_batch(&self, max_nodes: Option&lt;usize&gt;) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/mem_wal/hnsw/graph.rs:611-611 | Emit the Lance HNSW sub-index record batch. |

<a id="source-rust-lance-src-dataset-mem-wal-hnsw-mod-rs"></a>

## `rust/lance/src/dataset/mem_wal/hnsw/mod.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use graph::` | rust/lance/src/dataset/mem_wal/hnsw/mod.rs:16-16 | No standalone documentation summary; use the family contract and source entry. |
| `pub use storage::` | rust/lance/src/dataset/mem_wal/hnsw/mod.rs:17-17 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-mem-wal-hnsw-storage-rs"></a>

## `rust/lance/src/dataset/mem_wal/hnsw/storage.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const FLAT_COLUMN: &str = "flat";` | rust/lance/src/dataset/mem_wal/hnsw/storage.rs:21-21 | Vector column name used by Lance's flat vector storage batches. |
| `pub trait VectorSource: Send + Sync` | rust/lance/src/dataset/mem_wal/hnsw/storage.rs:41-41 | Read-only vector source used by the HNSW graph. |
| `pub fn compute_f32_distance(query: &[f32], vector: &[f32], distance_type: DistanceType) -&gt; f32` | rust/lance/src/dataset/mem_wal/hnsw/storage.rs:82-82 | Compute a distance between two f32 vectors using Lance's SIMD-backed distance kernels. |
| `pub struct ArrowFixedSizeListVectorStore` | rust/lance/src/dataset/mem_wal/hnsw/storage.rs:96-96 | Zero-copy Arrow-backed vector store for active MemTables. |
| `pub fn try_new( capacity: usize, max_batches: usize, dim: usize, distance_type: DistanceType, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/hnsw/storage.rs:139-144 | Create an append-only vector store. |
| `pub fn committed_len(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/hnsw/storage.rs:219-219 | Number of committed vectors. |
| `pub fn dim(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/hnsw/storage.rs:224-224 | Number of `f32` values per vector. |
| `pub fn append_batch( &self, vectors: Arc&lt;FixedSizeListArray&gt;, row_id_start: u64, ) -&gt; Result&lt;Range&lt;u32&gt;&gt;` | rust/lance/src/dataset/mem_wal/hnsw/storage.rs:235-239 | Append one Arrow `FixedSizeList&lt;Float32&gt;` batch by reference. |
| `pub fn snapshot(self: &Arc&lt;Self&gt;) -&gt; VectorStoreSnapshot` | rust/lance/src/dataset/mem_wal/hnsw/storage.rs:353-353 | Capture a stable visible prefix of the store. |
| `pub fn to_record_batch(&self, total_rows: Option&lt;u64&gt;) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/mem_wal/hnsw/storage.rs:383-383 | Materialize the visible vectors into Lance flat-storage format. |
| `pub struct VectorStoreSnapshot` | rust/lance/src/dataset/mem_wal/hnsw/storage.rs:448-448 | Snapshot of an [`ArrowFixedSizeListVectorStore`]. |
| `pub fn to_record_batch(&self, total_rows: Option&lt;u64&gt;) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/mem_wal/hnsw/storage.rs:456-456 | Materialize the snapshot into Lance flat-storage format. |

<a id="source-rust-lance-src-dataset-mem-wal-index-rs"></a>

## `rust/lance/src/dataset/mem_wal/index.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod arena_skiplist;` | rust/lance/src/dataset/mem_wal/index.rs:7-7 | No standalone documentation summary; use the family contract and source entry. |
| `pub use btree::` | rust/lance/src/dataset/mem_wal/index.rs:38-38 | No standalone documentation summary; use the family contract and source entry. |
| `pub use fts::` | rust/lance/src/dataset/mem_wal/index.rs:42-42 | No standalone documentation summary; use the family contract and source entry. |
| `pub use hnsw::` | rust/lance/src/dataset/mem_wal/index.rs:44-44 | No standalone documentation summary; use the family contract and source entry. |
| `pub use pk_key::encode_pk_tuple;` | rust/lance/src/dataset/mem_wal/index.rs:45-45 | No standalone documentation summary; use the family contract and source entry. |
| `pub use plugin::` | rust/lance/src/dataset/mem_wal/index.rs:46-46 | No standalone documentation summary; use the family contract and source entry. |
| `pub use query::` | rust/lance/src/dataset/mem_wal/index.rs:50-50 | No standalone documentation summary; use the family contract and source entry. |
| `pub type RowPosition = u64;` | rust/lance/src/dataset/mem_wal/index.rs:57-57 | Row position in a memtable: the row's position across all its batches, which becomes its row id in the flushed file. |
| `pub fn validate_index_specs( specs: &[MemIndexSpec], schema: &ArrowSchema, lance_schema: &LanceSchema, pk_columns: &[String], ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/index.rs:83-88 | Reject index specs and primary-key columns that would fail every insert, so a writer never accepts a row that replay could not index. Call once, when a shard opens. |
| `pub enum MemTableVisibility` | rust/lance/src/dataset/mem_wal/index.rs:150-150 | Which prefix of a MemTable a reader may see. |
| `pub struct IndexStore` | rust/lance/src/dataset/mem_wal/index.rs:168-168 | The indexes one memtable maintains, keyed by name, and its two cursors: what every index holds, and what readers may see. |
| `pub fn new() -&gt; Self` | rust/lance/src/dataset/mem_wal/index.rs:238-238 | An empty store. |
| `pub fn from_specs( specs: &[MemIndexSpec], schema: &LanceSchema, max_rows: usize, max_batches: usize, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/index.rs:245-250 | Build every index a memtable is to maintain. `max_rows` and `max_batches` are the memtable's capacity, which sizes structures an index allocates up front. |
| `pub fn add_index(&mut self, name: String, index: Arc&lt;dyn MemIndex&gt;)` | rust/lance/src/dataset/mem_wal/index.rs:268-268 | Add a built index. Indexes are added before any row is inserted. Filters reach only indexes built by [`Self::from_specs`]. |
| `pub fn add_btree(&mut self, name: String, field_id: i32, column: String)` | rust/lance/src/dataset/mem_wal/index.rs:278-278 | Add a B-tree over one column. Filters do not reach it; build with [`Self::from_specs`] for that. |
| `pub fn add_hnsw( &mut self, name: String, field_id: i32, column: String, distance_type: DistanceType, capacity: usize, max_batches: usize, )` | rust/lance/src/dataset/mem_wal/index.rs:283-291 | Add an HNSW graph over one vector column, with default graph parameters. |
| `pub fn add_fts(&mut self, name: String, field_id: i32, column: String)` | rust/lance/src/dataset/mem_wal/index.rs:306-306 | Add a full-text index over one column, with default parameters. |
| `pub fn add_fts_with_params( &mut self, name: String, field_id: i32, column: String, params: InvertedIndexParams, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/index.rs:311-317 | Add a full-text index over one column. |
| `pub fn insert(&self, batch: &RecordBatch, row_offset: RowPosition) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/index.rs:326-326 | Insert a batch into every index. |
| `pub fn insert_with_batch_position( &self, batch: &RecordBatch, row_offset: RowPosition, batch_position: Option&lt;usize&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/index.rs:338-343 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn insert_batches(&self, batches: &[StoredBatch]) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/index.rs:354-354 | Insert the batches of one write into every index, each index on its own thread above a few dozen rows, then count them indexed. |
| `pub fn get_index(&self, name: &str) -&gt; Option&lt;&Arc&lt;dyn MemIndex&gt;&gt;` | rust/lance/src/dataset/mem_wal/index.rs:435-435 | The index named `name`. |
| `pub fn index_answering(&self, column: &str, query: &dyn MemQuery) -&gt; Option&lt;Arc&lt;dyn MemIndex&gt;&gt;` | rust/lance/src/dataset/mem_wal/index.rs:452-452 | The first index, by name, covering `column` that can answer `query`; the memtable's own key index last. |
| `pub fn fts_granularities_on(&self, column: &str) -&gt; Vec&lt;DocumentGranularity&gt;` | rust/lance/src/dataset/mem_wal/index.rs:464-464 | The granularities a full-text index on `column` answers, row before list element. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/index.rs:475-475 | Whether the store holds no named index. |
| `pub fn index_names(&self) -&gt; Vec&lt;String&gt;` | rust/lance/src/dataset/mem_wal/index.rs:480-480 | Every named index, sorted. |
| `pub fn len(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/index.rs:485-485 | How many named indexes the store holds. |
| `pub fn resident_bytes(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/index.rs:491-491 | Heap bytes held by every index. Not part of `MemTable::row_bytes`; add it when budgeting memory. |
| `pub fn indexed_count(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/index.rs:507-507 | Batches every index holds, as an exclusive count. Readers snapshot [`Self::visible_count`] instead. |
| `pub fn visible_count(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/index.rs:513-513 | The prefix readers may see: indexed and, under a writer, durable. Derived on every call, so no cached value can go stale. |
| `pub fn prefix_count(&self, visibility: MemTableVisibility) -&gt; usize` | rust/lance/src/dataset/mem_wal/index.rs:522-522 | The prefix readable under `visibility`. |


<a id="source-rust-lance-src-dataset-mem-wal-index-arena-skiplist-rs"></a>

## `rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn new_skiplist&lt;K: Ord + Send + Sync&gt;() -&gt; (SkipListWriter&lt;K&gt;, SkipListReader&lt;K&gt;)` | rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:231-231 | Create a paired writer and reader over a fresh, empty skiplist core. |
| `pub struct SkipListWriter&lt;K&gt;` | rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:244-244 | The sole mutator of a skiplist. Not `Sync`: only one writer may exist. |
| `pub fn insert_and_check_neighbors( &mut self, key: K, check: impl FnOnce(Option&lt;&K&gt;, Option&lt;&K&gt;) -&gt; bool, ) -&gt; bool` | rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:277-281 | Insert `key` and let the caller inspect its immediate level-0 neighbors. |
| `pub struct SkipListReader&lt;K&gt;` | rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:354-354 | A lock-free, pin-free reader. Cheaply cloned and shared across threads. |
| `pub fn resident_bytes(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:366-366 | Bytes of arena chunks backing this skiplist's nodes. |
| `pub fn upper_bound_with&lt;R&gt;(&self, target: &K, f: impl FnOnce(&K) -&gt; R) -&gt; Option&lt;R&gt;` | rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:373-373 | Greatest node with `key &lt;= target`, mapped through `f` while it is alive. Equivalent to crossbeam's `upper_bound(Included(target))`. `None` if no such node. The closure avoids cloning the key on the hot path. |
| `pub fn iter(&self) -&gt; Iter&lt;'_, K&gt;` | rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:418-418 | Iterate all keys in ascending order. |
| `pub fn range_from(&self, start: &K) -&gt; Iter&lt;'_, K&gt;` | rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:426-426 | Iterate keys in ascending order starting at the first `key &gt;= start`. |
| `pub fn front_with&lt;R&gt;(&self, f: impl FnOnce(&K) -&gt; R) -&gt; Option&lt;R&gt;` | rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:434-434 | The smallest key, mapped through `f`, or `None` if empty. |
| `pub fn len(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:445-445 | Number of entries. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:450-450 | Whether no node has been inserted. |
| `pub struct Iter&lt;'a, K&gt;` | rust/lance/src/dataset/mem_wal/index/arena_skiplist.rs:457-457 | Forward iterator over keys in ascending order. Yields `&K` borrowed from the reader: nodes are never freed while the core (and thus the reader) is alive. |


<a id="source-rust-lance-src-dataset-mem-wal-index-btree-rs"></a>

## `rust/lance/src/dataset/mem_wal/index/btree.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct IndexKey` | rust/lance/src/dataset/mem_wal/index/btree.rs:54-54 | Composite key for the scalar (fallback) backend. |
| `pub value: OrderableScalarValue,` | rust/lance/src/dataset/mem_wal/index/btree.rs:56-56 | The indexed scalar value. |
| `pub row_position: RowPosition,` | rust/lance/src/dataset/mem_wal/index/btree.rs:58-58 | Row position (makes the key unique for non-unique indexes). |
| `pub struct BTreeMemIndex` | rust/lance/src/dataset/mem_wal/index/btree.rs:1042-1042 | In-memory BTree index for scalar fields. |
| `pub fn new(field_id: i32, column_name: String) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/btree.rs:1060-1060 | Create a new BTree index for the given field. |
| `pub fn get_newest_visible( &self, value: &ScalarValue, max_visible_row: RowPosition, ) -&gt; Option&lt;RowPosition&gt;` | rust/lance/src/dataset/mem_wal/index/btree.rs:1072-1076 | The newest row position for `value` that is visible at `max_visible_row` (inclusive), or `None` if the value has no visible row. A single **seek-and-stop** on the backing skiplist — no range collect, no allocation. This is the point-lookup hot path. |
| `pub fn field_id(&self) -&gt; i32` | rust/lance/src/dataset/mem_wal/index/btree.rs:1083-1083 | Get the field ID this index is built on. |
| `pub fn insert(&self, batch: &RecordBatch, row_offset: RowPosition) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/index/btree.rs:1088-1088 | Insert rows from a batch into the index. |
| `pub fn insert_and_report_existing( &self, batch: &RecordBatch, row_offset: RowPosition, ) -&gt; Result&lt;bool&gt;` | rust/lance/src/dataset/mem_wal/index/btree.rs:1095-1099 | Insert rows and report whether any inserted key already existed in the index or repeated earlier in this batch. |
| `pub fn get(&self, value: &ScalarValue) -&gt; Vec&lt;RowPosition&gt;` | rust/lance/src/dataset/mem_wal/index/btree.rs:1119-1119 | Look up row positions for an exact value. |
| `pub fn range( &self, lower: Option&lt;&ScalarValue&gt;, upper: Option&lt;&ScalarValue&gt;, ) -&gt; Vec&lt;RowPosition&gt;` | rust/lance/src/dataset/mem_wal/index/btree.rs:1132-1136 | Row positions whose value falls in `[lower, upper)`, either bound open. |
| `pub fn len(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/index/btree.rs:1155-1155 | Get the number of entries (not unique values). |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/index/btree.rs:1169-1169 | Check if the index is empty. |
| `pub fn column_name(&self) -&gt; &str` | rust/lance/src/dataset/mem_wal/index/btree.rs:1174-1174 | Get the column name. |
| `pub fn snapshot(&self) -&gt; Vec&lt;(OrderableScalarValue, Vec&lt;RowPosition&gt;)&gt;` | rust/lance/src/dataset/mem_wal/index/btree.rs:1179-1179 | Get a snapshot of all entries grouped by value in sorted order. |
| `pub fn data_type(&self) -&gt; Option&lt;arrow_schema::DataType&gt;` | rust/lance/src/dataset/mem_wal/index/btree.rs:1186-1186 | Get the data type of the indexed column. |
| `pub fn to_training_batches(&self, batch_size: usize) -&gt; Result&lt;Vec&lt;RecordBatch&gt;&gt;` | rust/lance/src/dataset/mem_wal/index/btree.rs:1191-1191 | Export the index data as sorted RecordBatches for BTree index training. |
| `pub struct BTreeMemIndexPlugin;` | rust/lance/src/dataset/mem_wal/index/btree.rs:1433-1433 | Declares the built-in B-tree memtable index. |
| `pub fn btree(name: impl Into&lt;String&gt;, field_id: i32, column: impl Into&lt;String&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/btree.rs:1480-1480 | A B-tree over one column. |


<a id="source-rust-lance-src-dataset-mem-wal-index-fts-rs"></a>

## `rust/lance/src/dataset/mem_wal/index/fts.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct FtsEntry` | rust/lance/src/dataset/mem_wal/index/fts.rs:90-90 | In-memory FTS index entry returned from search. |
| `pub row_position: RowPosition,` | rust/lance/src/dataset/mem_wal/index/fts.rs:92-92 | Row position in MemTable. |
| `pub doc_index: Option&lt;Vec&lt;u32&gt;&gt;,` | rust/lance/src/dataset/mem_wal/index/fts.rs:94-94 | Root-to-leaf physical list ordinals for a ListElement document. |
| `pub score: f32,` | rust/lance/src/dataset/mem_wal/index/fts.rs:96-96 | BM25 score for this document. |
| `pub enum FtsQueryExpr` | rust/lance/src/dataset/mem_wal/index/fts.rs:135-135 | Full-text search query expression for composable queries. |
| `pub const DEFAULT_MAX_EXPANSIONS: usize = 50;` | rust/lance/src/dataset/mem_wal/index/fts.rs:211-211 | Default maximum number of fuzzy expansions. |
| `pub const DEFAULT_WAND_FACTOR: f32 = 1.0;` | rust/lance/src/dataset/mem_wal/index/fts.rs:214-214 | Default WAND factor for full recall (no early termination). |
| `pub struct SearchOptions` | rust/lance/src/dataset/mem_wal/index/fts.rs:218-218 | Search options for controlling performance/recall tradeoffs. |
| `pub wand_factor: f32,` | rust/lance/src/dataset/mem_wal/index/fts.rs:221-221 | WAND factor for early termination (0.0 to 1.0). 1.0 = full recall (default). |
| `pub limit: Option&lt;usize&gt;,` | rust/lance/src/dataset/mem_wal/index/fts.rs:223-223 | Maximum number of results to return. None means unlimited. |
| `pub include_tail: bool,` | rust/lance/src/dataset/mem_wal/index/fts.rs:230-230 | Whether to also search the mutable tail (rows written since the last freeze). `true` (default) is read-your-writes: every completed batch is visible, at the cost of scanning the un-indexed tail on each query. `false` searches only the immutable frozen partitions — the Lucene model (a reader sees only flushed segments), which removes the tail scan from the hot path. Trades read-recency for query latency. |
| `pub tail_skip: bool,` | rust/lance/src/dataset/mem_wal/index/fts.rs:235-235 | Whether to skip the whole tail scan when its score upper bound cannot beat the current top-k threshold (block-max-style tail pruning). `true` (default) prunes; `false` always scans the visible tail. Only affects top-k term queries; exposed mainly to A/B the optimization. |
| `pub fn new() -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:250-250 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_wand_factor(mut self, wand_factor: f32) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:255-255 | Set the WAND factor for early termination. |
| `pub fn with_limit(mut self, limit: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:261-261 | Set the maximum number of results to return. |
| `pub fn with_include_tail(mut self, include_tail: bool) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:267-267 | Set whether to search the mutable tail (see [`Self::include_tail`]). |
| `pub fn with_tail_skip(mut self, tail_skip: bool) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:273-273 | Set whether to prune the tail scan by score bound (see [`Self::tail_skip`]). |
| `pub fn match_query(query: impl Into&lt;String&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:280-280 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn match_query_with_operator(query: impl Into&lt;String&gt;, operator: Operator) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:284-284 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn phrase(query: impl Into&lt;String&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:293-293 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn phrase_with_slop(query: impl Into&lt;String&gt;, slop: u32) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:302-302 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn fuzzy(query: impl Into&lt;String&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:311-311 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn fuzzy_with_distance(query: impl Into&lt;String&gt;, fuzziness: u32) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:322-322 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn fuzzy_with_options( query: impl Into&lt;String&gt;, fuzziness: Option&lt;u32&gt;, prefix_length: u32, max_expansions: usize, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:333-338 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn boolean() -&gt; BooleanQueryBuilder` | rust/lance/src/dataset/mem_wal/index/fts.rs:349-349 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn boosting(positive: Self) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:353-353 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn boosting_with_negative(positive: Self, negative: Self, negative_boost: f32) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:361-361 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_boost(self, boost: f32) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:369-369 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_column(self, column: impl Into&lt;String&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:416-416 | Bind this leaf to `column`. Compound nodes carry no binding of their own; bind their leaves instead. |
| `pub fn column(&self) -&gt; Option&lt;&str&gt;` | rust/lance/src/dataset/mem_wal/index/fts.rs:459-459 | The column this leaf searches, or `None` for a compound node or an unbound leaf. |
| `pub fn bind_unbound_leaves(self, column: &str) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:470-470 | Bind every leaf that names no column to `column`, leaving bound leaves alone. Lets a tree built from bare terms be attached to one field. |
| `pub fn has_unbound_leaf(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/index/fts.rs:500-500 | Whether any leaf of this tree names no column. Cross-column routing has no single column to fall back to, so such a tree cannot be evaluated. |
| `pub fn bound_leaves(&self) -&gt; Vec&lt;(&str, &Self)&gt;` | rust/lance/src/dataset/mem_wal/index/fts.rs:523-523 | Every leaf that names a column, with that column, in tree order. |
| `pub fn columns(&self) -&gt; Vec&lt;&str&gt;` | rust/lance/src/dataset/mem_wal/index/fts.rs:560-560 | Distinct columns this tree's leaves name, in tree order. An unbound leaf contributes nothing, so an all-unbound tree yields an empty vec. |
| `pub fn auto_fuzziness(token: &str) -&gt; u32` | rust/lance/src/dataset/mem_wal/index/fts.rs:609-609 | Auto-fuzziness based on token length: 0–2 chars → 0, 3–5 chars → 1, 6+ chars → 2. |
| `pub fn levenshtein_distance(a: &str, b: &str) -&gt; u32` | rust/lance/src/dataset/mem_wal/index/fts.rs:618-618 | Levenshtein distance using two-row dynamic programming. |
| `pub struct BooleanQueryBuilder` | rust/lance/src/dataset/mem_wal/index/fts.rs:695-695 | Builder for constructing Boolean queries. |
| `pub fn new() -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:702-702 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn must(mut self, query: FtsQueryExpr) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:706-706 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn should(mut self, query: FtsQueryExpr) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:711-711 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn must_not(mut self, query: FtsQueryExpr) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:716-716 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn build(self) -&gt; FtsQueryExpr` | rust/lance/src/dataset/mem_wal/index/fts.rs:721-721 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FtsMemIndex` | rust/lance/src/dataset/mem_wal/index/fts.rs:1239-1239 | In-memory full-text search index. See module docs for the concurrency model and visibility contract. |
| `pub struct QueryLocalFtsIndex` | rust/lance/src/dataset/mem_wal/index/fts.rs:1277-1277 | Query-owned term-only postings for one residual scan. |
| `pub struct QueryLocalFtsStats` | rust/lance/src/dataset/mem_wal/index/fts.rs:1282-1282 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(field_id: i32, column_name: String) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:1549-1549 | Create a new FTS index for the given field with default parameters. |
| `pub fn with_params(field_id: i32, column_name: String, params: InvertedIndexParams) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:1554-1554 | Create a new FTS index with custom tokenizer parameters. |
| `pub fn try_with_params( field_id: i32, column_name: String, params: InvertedIndexParams, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/index/fts.rs:1560-1564 | Try to create a new FTS index with custom tokenizer parameters. |
| `pub fn with_freeze_threshold_rows(mut self, rows: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:1624-1624 | Override the tail freeze threshold (docs) — the analogue of Lucene's `ramBufferSizeMB`. Larger keeps more rows in the un-indexed mutable tail (cheaper writes, costlier read-your-writes scans); smaller freezes into block-max-searchable partitions sooner. |
| `pub fn field_id(&self) -&gt; i32` | rust/lance/src/dataset/mem_wal/index/fts.rs:1629-1629 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn column_name(&self) -&gt; &str` | rust/lance/src/dataset/mem_wal/index/fts.rs:1633-1633 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn params(&self) -&gt; &InvertedIndexParams` | rust/lance/src/dataset/mem_wal/index/fts.rs:1637-1637 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn document_granularity(&self) -&gt; lance_index::scalar::inverted::DocumentGranularity` | rust/lance/src/dataset/mem_wal/index/fts.rs:1641-1641 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn doc_count(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/index/fts.rs:1646-1646 | Number of visible documents across all partitions and the tail. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/index/fts.rs:1652-1652 | Whether there are any visible documents. |
| `pub fn entry_count(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/index/fts.rs:1658-1658 | Total number of visible (term, doc) postings. |
| `pub fn resident_bytes_exact(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/index/fts.rs:1681-1681 | Estimated bytes of heap memory held by this index. |
| `pub fn memory_breakdown(&self) -&gt; (usize, usize, usize, usize, usize, usize, usize, usize)` | rust/lance/src/dataset/mem_wal/index/fts.rs:1708-1708 | Component memory breakdown (bytes), for diagnostics: `(num_partitions, term_strings, postings_meta, block_meta, doc_freq, pos, docs, tail)`. |
| `pub fn insert(&self, batch: &RecordBatch, row_offset: u64) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/index/fts.rs:1736-1736 | Insert a batch into the mutable tail. |
| `pub fn insert_with_batch_position( &self, batch: &RecordBatch, row_offset: u64, _batch_position: usize, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/index/fts.rs:1743-1748 | Insert a batch. The explicit `batch_position` is accepted for API compatibility but not used for placement: the tail assigns its own dense, 0-based positions (required by the visibility filter). |
| `pub fn search(&self, term: &str) -&gt; Vec&lt;FtsEntry&gt;` | rust/lance/src/dataset/mem_wal/index/fts.rs:2130-2130 | Search for documents containing a term. |
| `pub fn search_phrase(&self, phrase: &str, slop: u32) -&gt; Vec&lt;FtsEntry&gt;` | rust/lance/src/dataset/mem_wal/index/fts.rs:2138-2138 | Search for documents containing an exact phrase, optionally allowing `slop` intervening tokens between consecutive query tokens. |
| `pub fn flush(&self)` | rust/lance/src/dataset/mem_wal/index/fts.rs:2148-2148 | Freeze the current mutable tail into an immutable partition, so a subsequent `include_tail = false` search sees all rows written so far (the analogue of a Lucene commit/flush before opening a reader). No-op when the tail is empty. Writer-side: callers hold the single-writer role. |
| `pub fn expand_fuzzy( &self, term: &str, max_distance: u32, max_expansions: usize, ) -&gt; Vec&lt;(String, u32)&gt;` | rust/lance/src/dataset/mem_wal/index/fts.rs:2160-2165 | Expand a term to fuzzy matches within the specified edit distance. Returns `(matched_term, distance)` pairs sorted by distance, capped at `max_expansions`. |
| `pub fn search_fuzzy( &self, query: &str, fuzziness: Option&lt;u32&gt;, max_expansions: usize, ) -&gt; Vec&lt;FtsEntry&gt;` | rust/lance/src/dataset/mem_wal/index/fts.rs:2171-2176 | Search for documents using fuzzy matching on each query token. |
| `pub fn search_query(&self, query: &FtsQueryExpr) -&gt; Vec&lt;FtsEntry&gt;` | rust/lance/src/dataset/mem_wal/index/fts.rs:2618-2618 | Execute a query expression and return matching documents with scores. |
| `pub fn search_with_options( &self, query: &FtsQueryExpr, options: SearchOptions, ) -&gt; Vec&lt;FtsEntry&gt;` | rust/lance/src/dataset/mem_wal/index/fts.rs:2713-2717 | Execute a query with options (sort + WAND prune + limit). |
| `pub fn to_index_builder( &self, partition_id: u64, total_rows: usize, ) -&gt; Result&lt;lance_index::scalar::inverted::builder::InnerBuilder&gt;` | rust/lance/src/dataset/mem_wal/index/fts.rs:2779-2783 | Export the in-memory FTS index to an `InnerBuilder` ready to be written to disk. |
| `pub fn search_cross_column&lt;F&gt;(expr: &FtsQueryExpr, eval_leaf: F) -&gt; Result&lt;Vec&lt;FtsEntry&gt;&gt; where F: Fn(&str, &FtsQueryExpr) -&gt; Result&lt;Vec&lt;FtsEntry&gt;&gt;,` | rust/lance/src/dataset/mem_wal/index/fts.rs:3670-3673 | Evaluate a tree whose leaves may name different columns: `eval_leaf` answers each leaf from the index on its column, and the first error it returns fails the search. |
| `pub struct FtsMemIndexPlugin;` | rust/lance/src/dataset/mem_wal/index/fts.rs:5132-5132 | Declares the built-in full-text memtable index. |
| `pub struct FtsParams` | rust/lance/src/dataset/mem_wal/index/fts.rs:5256-5256 | What an in-memory full-text index needs before it takes a row. |
| `pub params: InvertedIndexParams,` | rust/lance/src/dataset/mem_wal/index/fts.rs:5258-5258 | Tokenizer, granularity and format, from the base-table index. |
| `pub fn fts(name: impl Into&lt;String&gt;, field_id: i32, column: impl Into&lt;String&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:5273-5273 | A full-text index over one column, with default parameters. |
| `pub fn fts_with_params( name: impl Into&lt;String&gt;, field_id: i32, column: impl Into&lt;String&gt;, params: InvertedIndexParams, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/fts.rs:5278-5283 | A full-text index over one column. |


<a id="source-rust-lance-src-dataset-mem-wal-index-hnsw-rs"></a>

## `rust/lance/src/dataset/mem_wal/index/hnsw.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use super::RowPosition;` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:54-54 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn mem_wal_hnsw_default() -&gt; HnswBuildParams` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:67-67 | Write-optimized default HNSW build parameters for MemTable indexes. |
| `pub struct HnswMemIndex` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:74-74 | In-memory HNSW index queryable while building. |
| `pub fn with_capacity( field_id: i32, column: String, distance_type: DistanceType, build_params: HnswBuildParams, capacity: usize, max_batches: usize, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:107-114 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn field_id(&self) -&gt; i32` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:127-127 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn column_name(&self) -&gt; &str` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:131-131 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn distance_type(&self) -&gt; DistanceType` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:135-135 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn build_params(&self) -&gt; &HnswBuildParams` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:139-139 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn capacity(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:143-143 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn dim(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:148-148 | Vector dimension. Returns 0 before the first insert. |
| `pub fn len(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:152-152 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:156-156 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn insert(&self, batch: &RecordBatch, row_offset: u64) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:225-225 | Insert vectors from a single batch. |
| `pub fn insert_batches(&self, batches: &[StoredBatch]) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:267-267 | Insert vectors from multiple batches. |
| `pub fn search( &self, query: &FixedSizeListArray, k: usize, ef: Option&lt;usize&gt;, max_row_position: RowPosition, ) -&gt; Result&lt;Vec&lt;(f32, RowPosition)&gt;&gt;` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:356-362 | Search for nearest neighbors of `query` with MVCC visibility. |
| `pub fn to_lance_hnsw(&self, total_rows: Option&lt;u64&gt;) -&gt; Result&lt;Option&lt;(HNSW, RecordBatch)&gt;&gt;` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:418-418 | Snapshot the in-memory HNSW into the Lance on-disk representation: returns the graph + the FLAT vector storage record batch. |
| `pub struct HnswParams` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:687-687 | What an in-memory HNSW index needs before it takes a row. |
| `pub distance_type: DistanceType,` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:689-689 | The metric the base index was built with. |
| `pub build_params: HnswBuildParams,` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:691-691 | Graph parameters, defaulted unless the writer overrode them. |
| `pub struct HnswMemIndexPlugin;` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:696-696 | Declares the built-in HNSW memtable index. |
| `pub fn hnsw( name: impl Into&lt;String&gt;, field_id: i32, column: impl Into&lt;String&gt;, distance_type: DistanceType, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:804-809 | An HNSW graph over one vector column, with default graph parameters. |
| `pub fn hnsw_with_params( name: impl Into&lt;String&gt;, field_id: i32, column: impl Into&lt;String&gt;, distance_type: DistanceType, build_params: HnswBuildParams, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/index/hnsw.rs:820-826 | An HNSW graph over one vector column. |


<a id="source-rust-lance-src-dataset-mem-wal-index-pk-key-rs"></a>

## `rust/lance/src/dataset/mem_wal/index/pk_key.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn encode_pk_tuple(values: &[ScalarValue]) -&gt; Result&lt;Vec&lt;u8&gt;&gt;` | rust/lance/src/dataset/mem_wal/index/pk_key.rs:85-85 | Encode a PK tuple (values in PK column order) to one order-preserving key. |
| `pub fn encode_pk_batch(batch: &RecordBatch, pk_indices: &[usize]) -&gt; Result&lt;BinaryArray&gt;` | rust/lance/src/dataset/mem_wal/index/pk_key.rs:107-107 | Encode every row of `batch`'s PK columns (at `pk_indices`) into a `Binary` column of order-preserving composite keys — the form a [`super::BTreeMemIndex`] indexes directly (its byte backend), so the composite PK reuses the same index as a single-column one. |
| `pub fn is_encodable(data_type: &arrow_schema::DataType) -&gt; bool` | rust/lance/src/dataset/mem_wal/index/pk_key.rs:116-116 | Whether [`encode_pk_tuple`] can encode a value of this type. |


<a id="source-rust-lance-src-dataset-mem-wal-manifest-rs"></a>

## `rust/lance/src/dataset/mem_wal/manifest.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct ShardManifestStore` | rust/lance/src/dataset/mem_wal/manifest.rs:61-61 | Store for reading and writing shard manifests. |
| `pub fn new( object_store: Arc&lt;ObjectStore&gt;, base_path: &Path, shard_id: Uuid, manifest_scan_batch_size: usize, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/manifest.rs:86-91 | Create a new manifest store for the given shard. |
| `pub async fn latest(&self) -&gt; Result&lt;Option&lt;ShardManifest&gt;&gt;` | rust/lance/src/dataset/mem_wal/manifest.rs:134-134 | The latest manifest as far as this store knows: its own position when it has one, otherwise a scan of storage. |
| `pub async fn refresh_latest(&self) -&gt; Result&lt;Option&lt;ShardManifest&gt;&gt;` | rust/lance/src/dataset/mem_wal/manifest.rs:151-151 | Read the latest manifest from storage and adopt it as this store's position. |
| `pub async fn read_version(&self, version: u64) -&gt; Result&lt;ShardManifest&gt;` | rust/lance/src/dataset/mem_wal/manifest.rs:170-170 | Read a specific manifest version. |
| `pub async fn initialize_shard( &self, shard_spec_id: u32, shard_field_values: HashMap&lt;String, Vec&lt;u8&gt;&gt;, ) -&gt; Result&lt;ShardManifest&gt;` | rust/lance/src/dataset/mem_wal/manifest.rs:197-201 | Write an initial manifest for a newly-created shard. |
| `pub async fn list_versions(&self) -&gt; Result&lt;Vec&lt;u64&gt;&gt;` | rust/lance/src/dataset/mem_wal/manifest.rs:404-404 | List all manifest versions (for garbage collection or debugging). |
| `pub fn shard_id(&self) -&gt; Uuid` | rust/lance/src/dataset/mem_wal/manifest.rs:435-435 | Get the shard ID. |
| `pub async fn claim_epoch(&self, shard_spec_id: u32) -&gt; Result&lt;(u64, ShardManifest)&gt;` | rust/lance/src/dataset/mem_wal/manifest.rs:471-471 | Claim a shard by incrementing its writer epoch. |
| `pub async fn check_fenced(&self, local_epoch: u64) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/manifest.rs:560-560 | Check if the given epoch has been fenced by a newer writer. |
| `pub async fn commit_update&lt;F&gt;(&self, local_epoch: u64, prepare_fn: F) -&gt; Result&lt;ShardManifest&gt; where F: Fn(&ShardManifest) -&gt; ShardManifest,` | rust/lance/src/dataset/mem_wal/manifest.rs:617-620 | Update the manifest with retry on version conflict. |

<a id="source-rust-lance-src-dataset-mem-wal-memtable-rs"></a>

## `rust/lance/src/dataset/mem_wal/memtable.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod batch_store;` | rust/lance/src/dataset/mem_wal/memtable.rs:6-6 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod flush;` | rust/lance/src/dataset/mem_wal/memtable.rs:7-7 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod scanner;` | rust/lance/src/dataset/mem_wal/memtable.rs:8-8 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct CacheConfig` | rust/lance/src/dataset/mem_wal/memtable.rs:36-36 | Configuration for the reader cache. |
| `pub ttl: Duration,` | rust/lance/src/dataset/mem_wal/memtable.rs:38-38 | Time-to-live for cached Dataset. Default: 60 seconds. |
| `pub always_fresh: bool,` | rust/lance/src/dataset/mem_wal/memtable.rs:40-40 | Whether to always return fresh data (bypass cache). Default: false. |
| `pub struct MemTable` | rust/lance/src/dataset/mem_wal/memtable.rs:62-62 | In-memory table for buffering writes. |
| `pub fn pk_bloom_filter_bytes() -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable.rs:154-154 | Heap one memtable's PK bloom filter holds. |
| `pub fn new(schema: Arc&lt;ArrowSchema&gt;, generation: u64, pk_field_ids: Vec&lt;i32&gt;) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:171-171 | Create a new MemTable with default capacity. |
| `pub fn with_cache_config( schema: Arc&lt;ArrowSchema&gt;, generation: u64, pk_field_ids: Vec&lt;i32&gt;, cache_config: CacheConfig, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:189-194 | Create a new MemTable with custom cache configuration. |
| `pub fn with_capacity( schema: Arc&lt;ArrowSchema&gt;, generation: u64, pk_field_ids: Vec&lt;i32&gt;, cache_config: CacheConfig, batch_capacity: usize, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:213-219 | Create a new MemTable with custom capacity. |
| `pub fn with_capacity_at( schema: Arc&lt;ArrowSchema&gt;, generation: u64, pk_field_ids: Vec&lt;i32&gt;, cache_config: CacheConfig, batch_capacity: usize, global_offset: usize, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:235-242 | Create a memtable whose batch 0 sits at `global_offset` in the writer's batch sequence. Every memtable after the writer's first is rotated in by `freeze_memtable`, which stamps the outgoing memtable's `global_end()` here so writer-global cursors stay mappable onto local batch positions. |
| `pub fn set_indexes(&mut self, indexes: IndexStore)` | rust/lance/src/dataset/mem_wal/memtable.rs:327-327 | Set the index registry for indexed writes. |
| `pub fn set_indexes_arc(&mut self, indexes: Arc&lt;IndexStore&gt;)` | rust/lance/src/dataset/mem_wal/memtable.rs:332-332 | Set the index registry with an Arc (for sharing with async handler). |
| `pub fn freeze(&mut self, wal_entry_position: u64)` | rust/lance/src/dataset/mem_wal/memtable.rs:344-344 | Mark this memtable as frozen with the given WAL entry position. |
| `pub fn set_wal_flush_completion( &self, reader: WatchableOnceCellReader&lt;std::result::Result&lt;WalFlushResult, WalFlushFailure&gt;&gt;, )` | rust/lance/src/dataset/mem_wal/memtable.rs:353-356 | Set the WAL flush completion reader. |
| `pub fn take_wal_flush_completion( &self, ) -&gt; Option&lt;WatchableOnceCellReader&lt;std::result::Result&lt;WalFlushResult, WalFlushFailure&gt;&gt;&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:365-367 | Take the WAL flush completion reader. |
| `pub fn has_pending_wal_flush(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/memtable.rs:372-372 | Check if this memtable has a pending WAL flush completion to await. |
| `pub fn create_memtable_flush_completion(&self) -&gt; WatchableOnceCellReader&lt;DurabilityResult&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:385-385 | Get a reader for the memtable flush completion. |
| `pub fn get_memtable_flush_watcher(&self) -&gt; Option&lt;WatchableOnceCellReader&lt;DurabilityResult&gt;&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:398-398 | Get a reader for the memtable flush completion. |
| `pub fn signal_memtable_flush_complete(&self, result: DurabilityResult)` | rust/lance/src/dataset/mem_wal/memtable.rs:412-412 | Signal that the memtable flush has finished, with the outcome. |
| `pub fn frozen_at_wal_entry_position(&self) -&gt; Option&lt;u64&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:421-421 | Get the WAL entry position when this memtable was frozen. |
| `pub fn is_frozen(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/memtable.rs:426-426 | Check if this memtable has been frozen. |
| `pub async fn insert(&mut self, batch: RecordBatch) -&gt; Result&lt;usize&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:442-442 | Insert a record batch into the MemTable. |
| `pub async fn insert_batch_only(&mut self, batch: RecordBatch) -&gt; Result&lt;(usize, u64, usize)&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:487-487 | Insert a batch without updating indexes. |
| `pub async fn insert_batches_only( &mut self, batches: Vec&lt;RecordBatch&gt;, ) -&gt; Result&lt;Vec&lt;(usize, u64, usize)&gt;&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:525-528 | Insert multiple batches without updating indexes. |
| `pub fn should_flush(&self, max_bytes: usize) -&gt; bool` | rust/lance/src/dataset/mem_wal/memtable.rs:564-564 | Check if the MemTable should be flushed. |
| `pub async fn get_visible_batches(&self, visible_count: usize) -&gt; Vec&lt;RecordBatch&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:579-579 | Get the batches in the visible prefix. |
| `pub async fn get_visible_batch_positions(&self, visible_count: usize) -&gt; Vec&lt;usize&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:586-586 | Get the batch positions in the visible prefix. |
| `pub async fn is_batch_visible(&self, batch_position: usize, visible_count: usize) -&gt; bool` | rust/lance/src/dataset/mem_wal/memtable.rs:593-593 | Check if a specific batch is visible at a given visibility position. |
| `pub async fn scan_batches_at_position(&self, visible_count: usize) -&gt; Result&lt;Vec&lt;RecordBatch&gt;&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:601-601 | Scan batches visible up to a specific batch position. |
| `pub async fn get_or_create_dataset(&self) -&gt; Result&lt;Option&lt;Dataset&gt;&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:649-649 | Get or create a Dataset for reading. |
| `pub async fn scan_batches(&self) -&gt; Result&lt;Vec&lt;RecordBatch&gt;&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:708-708 | Scan all data from the MemTable. |
| `pub async fn scan_batches_reversed(&self) -&gt; Result&lt;(Vec&lt;RecordBatch&gt;, usize)&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:721-721 | Scan all data from the MemTable in reverse order (newest first). |
| `pub async fn scan_batches_by_ids(&self, batch_positions: &[usize]) -&gt; Result&lt;Vec&lt;RecordBatch&gt;&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:728-728 | Scan specific batches by their batch_positions. |
| `pub async fn get_batches_for_wal(&self, batch_positions: &[usize]) -&gt; Result&lt;Vec&lt;RecordBatch&gt;&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:740-740 | Get batches for WAL flush. |
| `pub fn might_contain_pk(&self, pk_hash: u64) -&gt; bool` | rust/lance/src/dataset/mem_wal/memtable.rs:748-748 | Check if a primary key might exist in this MemTable. |
| `pub fn schema(&self) -&gt; &Arc&lt;ArrowSchema&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:753-753 | Get the schema. |
| `pub fn lance_schema(&self) -&gt; &Schema` | rust/lance/src/dataset/mem_wal/memtable.rs:762-762 | Get the Lance schema. |
| `pub fn generation(&self) -&gt; u64` | rust/lance/src/dataset/mem_wal/memtable.rs:767-767 | Get the generation number. |
| `pub fn pk_bytes(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable.rs:781-781 | Get total row count. Decoded size of the primary-key columns this memtable holds. |
| `pub fn row_count(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable.rs:785-785 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn batch_count(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable.rs:790-790 | Get batch count. |
| `pub async fn batch_count_async(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable.rs:796-796 | Get batch count (async version for API compatibility). |
| `pub fn bloom_filter(&self) -&gt; &Sbbf` | rust/lance/src/dataset/mem_wal/memtable.rs:801-801 | Get the bloom filter for serialization. |
| `pub fn indexes(&self) -&gt; Option&lt;&IndexStore&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:806-806 | Get reference to indexes. |
| `pub fn indexes_arc(&self) -&gt; Option&lt;Arc&lt;IndexStore&gt;&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:811-811 | Get the Arc-wrapped indexes (for sharing with async handler). |
| `pub fn take_indexes(&mut self) -&gt; Option&lt;Arc&lt;IndexStore&gt;&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:817-817 | Take the index registry (for flushing). Returns the Arc, which may be shared with async handler. |
| `pub fn all_flushed_to_wal(&self, durable: usize) -&gt; bool` | rust/lance/src/dataset/mem_wal/memtable.rs:823-823 | Whether every committed batch in this memtable is WAL-durable, given the writer-global durability cursor. The L0 flush's precondition. |
| `pub fn global_end(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable.rs:828-828 | Writer-global coordinate one past this memtable's last committed batch. |
| `pub fn cache_config(&self) -&gt; &CacheConfig` | rust/lance/src/dataset/mem_wal/memtable.rs:833-833 | Get cache configuration. |
| `pub fn batch_capacity(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable.rs:838-838 | Get the batch store capacity. |
| `pub fn remaining_batch_capacity(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable.rs:843-843 | Get remaining batch capacity. |
| `pub fn scan(&self) -&gt; scanner::MemTableScanner` | rust/lance/src/dataset/mem_wal/memtable.rs:870-870 | Create a scanner for querying this MemTable. |
| `pub fn batch_store(&self) -&gt; Arc&lt;BatchStore&gt;` | rust/lance/src/dataset/mem_wal/memtable.rs:879-879 | Get a clone of the batch store Arc for external use. |

<a id="source-rust-lance-src-dataset-mem-wal-memtable-batch-store-rs"></a>

## `rust/lance/src/dataset/mem_wal/memtable/batch_store.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct StoredBatch` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:58-58 | A batch stored in the lock-free store. |
| `pub data: RecordBatch,` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:60-60 | The Arrow RecordBatch data. |
| `pub num_rows: usize,` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:62-62 | Number of rows in this batch (cached for quick access). |
| `pub estimated_size: usize,` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:64-64 | Estimated memory size in bytes. |
| `pub row_offset: u64,` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:66-66 | Row offset in the MemTable (cumulative rows before this batch). |
| `pub batch_position: usize,` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:68-68 | Position of this batch in the store (0-indexed). |
| `pub fn new(data: RecordBatch, row_offset: u64, batch_position: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:73-73 | Create a new StoredBatch. |
| `pub struct PendingWalFlushStats` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:140-140 | Snapshot of the active batches that have not yet been flushed to WAL. |
| `pub start_batch_position: Option&lt;usize&gt;,` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:142-142 | First pending batch position, inclusive. |
| `pub end_batch_position: Option&lt;usize&gt;,` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:144-144 | Last pending batch position, exclusive. |
| `pub batch_count: usize,` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:146-146 | Number of pending batches. |
| `pub row_count: usize,` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:148-148 | Number of rows in pending batches. |
| `pub estimated_bytes: usize,` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:150-150 | Estimated bytes in pending batches. |
| `pub struct StoreFull;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:155-155 | Error returned when the store is full. |
| `pub struct BatchStore` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:185-185 | Append-only storage with lock-free readers for memtable batches. |
| `pub fn with_capacity(capacity: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:265-265 | Create a new store with the given capacity. |
| `pub fn with_capacity_at(capacity: usize, global_offset: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:272-272 | Create a store whose batch 0 sits at `global_offset` in the writer's batch sequence. Used by `freeze_memtable` for every memtable after the first; the first starts at 0. |
| `pub fn recommended_capacity(max_memtable_bytes: usize) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:313-313 | Calculate recommended capacity from memtable size configuration. |
| `pub fn capacity(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:324-324 | Returns the capacity. |
| `pub fn is_full(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:330-330 | Returns true if the store is full. |
| `pub fn remaining_capacity(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:336-336 | Returns the number of remaining slots. |
| `pub fn append(&self, batch: RecordBatch) -&gt; Result&lt;(usize, u64, usize), StoreFull&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:351-351 | Append a batch to the store. |
| `pub fn append_batches( &self, batches: Vec&lt;RecordBatch&gt;, ) -&gt; Result&lt;Vec&lt;(usize, u64, usize)&gt;, StoreFull&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:401-404 | Append multiple batches to the store atomically. |
| `pub fn len(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:536-536 | Get the number of committed batches. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:542-542 | Check if empty. |
| `pub fn max_buffered_batch_position(&self) -&gt; Option&lt;usize&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:551-551 | Get the maximum buffered batch position (inclusive). |
| `pub fn total_rows(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:558-558 | Get total row count. |
| `pub fn row_bytes(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:564-564 | Get estimated size in bytes. |
| `pub fn retained_bytes(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:581-581 | Heap this store actually keeps alive: every distinct allocation its batches reference, counted once at its full capacity. |
| `pub fn global_end(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:591-591 | Writer-global coordinate one past this store's last committed batch. |
| `pub fn global_offset(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:597-597 | This store's writer-global coordinate for batch 0. |
| `pub fn local_end(&self, global_cursor: usize) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:617-617 | The local exclusive end of this store covered by a writer-global cursor. |
| `pub fn pending_wal_flush_count(&self, durable: usize) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:625-625 | Batches in this store still waiting on their WAL append. |
| `pub fn pending_wal_flush_range(&self, durable: usize) -&gt; Option&lt;(usize, usize)&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:632-632 | Local range `[start, end)` of batches still waiting on their WAL append, or `None` when the store is fully durable. |
| `pub fn pending_wal_flush_stats(&self, durable: usize) -&gt; PendingWalFlushStats` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:639-639 | Get a point-in-time summary of batches pending WAL flush. |
| `pub fn get(&self, index: usize) -&gt; Option&lt;&StoredBatch&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:673-673 | Get a reference to a batch by index. |
| `pub fn get_batch(&self, index: usize) -&gt; Option&lt;&RecordBatch&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:693-693 | Get the RecordBatch data at an index. |
| `pub fn iter(&self) -&gt; BatchStoreIter&lt;'_&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:701-701 | Iterate over all committed batches. |
| `pub fn to_vec(&self) -&gt; Vec&lt;RecordBatch&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:711-711 | Get all batches as a Vec (clones the RecordBatch data). |
| `pub fn to_stored_vec(&self) -&gt; Vec&lt;StoredBatch&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:716-716 | Get all StoredBatches as a Vec (clones). |
| `pub fn iter_reversed(&self) -&gt; BatchStoreIterReversed&lt;'_&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:724-724 | Iterate over all committed batches in reverse order (newest first). |
| `pub fn to_vec_reversed(&self) -&gt; Result&lt;Vec&lt;RecordBatch&gt;, arrow::error::ArrowError&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:741-741 | Get all batches as a Vec with rows in reverse order (newest first). |
| `pub fn to_stored_vec_reversed(&self) -&gt; Vec&lt;StoredBatch&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:771-771 | Get all StoredBatches as a Vec in reverse order (newest first). |
| `pub fn visible_batches(&self, visible_count: usize) -&gt; Vec&lt;&StoredBatch&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:786-786 | Batches in the visible prefix `[0, visible_count)`. |
| `pub fn visible_batch_positions(&self, visible_count: usize) -&gt; Vec&lt;usize&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:792-792 | Positions of the batches in the visible prefix. |
| `pub fn max_visible_row(&self, visible_count: usize) -&gt; Option&lt;u64&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:801-801 | The inclusive maximum visible *row* position, or `None` when no rows are visible. Each batch carries its cumulative `row_offset`, so this is the end of the last visible batch minus one. Bounds MVCC seeks against the maintained PK-position index. |
| `pub fn is_batch_visible(&self, batch_position: usize, visible_count: usize) -&gt; bool` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:810-810 | Whether a batch falls inside the visible prefix. |
| `pub fn visible_record_batches(&self, visible_count: usize) -&gt; Vec&lt;RecordBatch&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:816-816 | Visible RecordBatches (clones the data). |
| `pub fn visible_batches_with_offsets(&self, visible_count: usize) -&gt; Vec&lt;(RecordBatch, u64)&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:824-824 | Visible RecordBatches paired with the row position each one starts at. |
| `pub struct BatchStoreIter&lt;'a&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:853-853 | Iterator over committed batches in a BatchStore. |
| `pub struct BatchStoreIterReversed&lt;'a&gt;` | rust/lance/src/dataset/mem_wal/memtable/batch_store.rs:891-891 | Reverse iterator over committed batches in a BatchStore. |

<a id="source-rust-lance-src-dataset-mem-wal-memtable-flush-rs"></a>

## `rust/lance/src/dataset/mem_wal/memtable/flush.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct FlushResult` | rust/lance/src/dataset/mem_wal/memtable/flush.rs:40-40 | No standalone documentation summary; use the family contract and source entry. |
| `pub sstable: SsTable,` | rust/lance/src/dataset/mem_wal/memtable/flush.rs:41-41 | No standalone documentation summary; use the family contract and source entry. |
| `pub rows_flushed: usize,` | rust/lance/src/dataset/mem_wal/memtable/flush.rs:42-42 | No standalone documentation summary; use the family contract and source entry. |
| `pub covered_wal_entry_position: u64,` | rust/lance/src/dataset/mem_wal/memtable/flush.rs:43-43 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct MemTableFlusher` | rust/lance/src/dataset/mem_wal/memtable/flush.rs:69-69 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( object_store: Arc&lt;ObjectStore&gt;, base_path: Path, base_uri: impl Into&lt;String&gt;, shard_id: Uuid, manifest_store: Arc&lt;ShardManifestStore&gt;, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/flush.rs:130-136 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_warmer(mut self, warmer: Option&lt;Arc&lt;dyn SsTableWarmer&gt;&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/flush.rs:150-150 | Attach the warmer fired pre-commit for each new generation. |
| `pub fn with_storage_context( mut self, store_params: Option&lt;ObjectStoreParams&gt;, session: Option&lt;Arc&lt;Session&gt;&gt;, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/flush.rs:157-161 | Set the store params + session used for derived-URI opens. Injected by `mem_wal_writer` from the base `Dataset`. |
| `pub async fn flush( &self, memtable: &MemTable, epoch: u64, covered_wal_entry_position: u64, durable: usize, ) -&gt; Result&lt;FlushResult&gt;` | rust/lance/src/dataset/mem_wal/memtable/flush.rs:283-289 | Flush the MemTable to storage (data files, indexes, bloom filter). |
| `pub async fn flush_with_indexes( &self, memtable: &MemTable, epoch: u64, index_specs: &[MemIndexSpec], covered_wal_entry_position: u64, durable: usize, ) -&gt; Result&lt;FlushResult&gt;` | rust/lance/src/dataset/mem_wal/memtable/flush.rs:554-561 | Flush the MemTable to storage with indexes. |
| `pub enum TriggerMemTableFlush` | rust/lance/src/dataset/mem_wal/memtable/flush.rs:794-794 | Message driving the background memtable-flush task. |


<a id="source-rust-lance-src-dataset-mem-wal-memtable-scanner-rs"></a>

## `rust/lance/src/dataset/mem_wal/memtable/scanner.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use builder::MemTableScanner;` | rust/lance/src/dataset/mem_wal/memtable/scanner.rs:40-40 | No standalone documentation summary; use the family contract and source entry. |
| `pub use exec::` | rust/lance/src/dataset/mem_wal/memtable/scanner.rs:75-75 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-src-dataset-mem-wal-memtable-scanner-builder-rs"></a>

## `rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct VectorQuery` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:37-37 | Vector search query parameters. |
| `pub column: String,` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:39-39 | Column name containing vectors. |
| `pub query_vector: Arc&lt;dyn Array&gt;,` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:41-41 | Query vector. |
| `pub k: usize,` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:43-43 | Number of results to return. |
| `pub nprobes: usize,` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:46-46 | The minimum number of probes to search. More partitions may be searched if needed to satisfy k results or recall requirements. Defaults to 1. |
| `pub maximum_nprobes: Option&lt;usize&gt;,` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:49-49 | The maximum number of probes to search. If None, all partitions may be searched if needed to satisfy k results. |
| `pub distance_type: Option&lt;DistanceType&gt;,` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:51-51 | Distance metric type. If None, uses the index's metric. |
| `pub ef: Option&lt;usize&gt;,` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:53-53 | Number of candidates to reserve for HNSW search. |
| `pub refine_factor: Option&lt;u32&gt;,` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:55-55 | Refine factor for re-ranking results using original vectors. |
| `pub distance_lower_bound: Option&lt;f32&gt;,` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:57-57 | The lower bound (inclusive) of the distance to be searched. |
| `pub distance_upper_bound: Option&lt;f32&gt;,` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:59-59 | The upper bound (exclusive) of the distance to be searched. |
| `pub struct FtsQuery` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:99-99 | Full-text search query parameters. |
| `pub expr: FtsQueryExpr,` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:103-103 | The query tree, evaluated as given by the memtable's inverted index. Every leaf names the column it searches; the memtable routes each leaf to that column's index. |
| `pub document_granularity: DocumentGranularity,` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:105-105 | Logical document unit. Defaults to one document per dataset row. |
| `pub wand_factor: f32,` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:108-108 | WAND factor for early termination (0.0 to 1.0). 1.0 = full recall (default), &lt;1.0 = faster but may miss low-scoring results. |
| `pub limit: Option&lt;usize&gt;,` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:110-110 | Query-level result limit. |
| `pub include_tail: bool,` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:115-115 | Whether to also search the mutable tail (rows written since the last freeze). `true` (default) = read-your-writes; `false` = search only the immutable frozen partitions (the Lucene model), trading read-recency for query latency. See [`crate::dataset::mem_wal::index::SearchOptions`]. |
| `pub const DEFAULT_WAND_FACTOR: f32 = 1.0;` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:119-119 | Default WAND factor for full recall (no early termination). |
| `pub fn new(column: impl Into&lt;String&gt;, expr: FtsQueryExpr) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:153-153 | Wrap an already-built query tree, binding every unbound leaf to `column`. Leaves that already name a column keep it. |
| `pub fn cross_column(expr: FtsQueryExpr) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:165-165 | Wrap a tree whose leaves name several columns. Every leaf must already carry its binding — there is no single column to fall back to. |
| `pub fn columns(&self) -&gt; Vec&lt;&str&gt;` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:191-191 | Distinct columns this query's leaves name, in tree order. A tree with no leaves at all (an empty boolean) names none. |
| `pub fn match_query(column: impl Into&lt;String&gt;, query: impl Into&lt;String&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:196-196 | Create a simple term match query. |
| `pub fn match_query_with_operator( column: impl Into&lt;String&gt;, query: impl Into&lt;String&gt;, operator: Operator, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:200-204 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn phrase(column: impl Into&lt;String&gt;, query: impl Into&lt;String&gt;, slop: u32) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:212-212 | Create a phrase query. |
| `pub fn boolean( column: impl Into&lt;String&gt;, must: Vec&lt;String&gt;, should: Vec&lt;String&gt;, must_not: Vec&lt;String&gt;, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:218-223 | Create a Boolean query over plain terms. Nested clauses go through [`Self::new`] with a tree built on [`FtsQueryExpr::boolean`]. |
| `pub fn fuzzy(column: impl Into&lt;String&gt;, query: impl Into&lt;String&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:243-243 | Create a fuzzy match query with auto-fuzziness. |
| `pub fn fuzzy_with_distance( column: impl Into&lt;String&gt;, query: impl Into&lt;String&gt;, fuzziness: u32, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:248-252 | Create a fuzzy match query with specified edit distance. |
| `pub fn fuzzy_with_options( column: impl Into&lt;String&gt;, query: impl Into&lt;String&gt;, fuzziness: Option&lt;u32&gt;, prefix_length: u32, max_expansions: usize, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:257-263 | Create a fuzzy match query with full options. |
| `pub fn with_wand_factor(mut self, wand_factor: f32) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:275-275 | Set the WAND factor for early termination. |
| `pub fn with_limit(mut self, limit: Option&lt;usize&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:280-280 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_include_tail(mut self, include_tail: bool) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:287-287 | Set whether to search the mutable tail (read-your-writes) or only the immutable frozen partitions (the Lucene model). Default `true`. |
| `pub fn with_document_granularity(mut self, document_granularity: DocumentGranularity) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:292-292 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn local_fts_query( query: FullTextSearchQuery, indexes: Option&lt;&IndexStore&gt;, ) -&gt; Result&lt;FtsQuery&gt;` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:330-333 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct MemTableScanner` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:539-539 | Scanner builder for querying MemTable data. |
| `pub fn new(batch_store: Arc&lt;BatchStore&gt;, indexes: Arc&lt;IndexStore&gt;, schema: SchemaRef) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:578-578 | Create a new scanner over the published prefix. |
| `pub fn new_at_visibility( batch_store: Arc&lt;BatchStore&gt;, indexes: Arc&lt;IndexStore&gt;, schema: SchemaRef, visibility: MemTableVisibility, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:584-589 | As [`Self::new`], bounded by `visibility`. Snapshotted at construction, so every plan this scanner builds keys on one stable cursor. |
| `pub fn with_memtable_filter_indexes(&mut self, enabled: bool) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:616-616 | Let [`Self::create_dedup_plan`] answer a filter from the filter indexes, keeping a match only when it is its key's newest visible version. Past the match budget, or without a primary-key index, every visible row is read. |
| `pub fn with_pk_columns(&mut self, pk_columns: Vec&lt;String&gt;) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:625-625 | Provide the primary-key columns. When set, a filtered vector/FTS search evaluates the predicate against the newest version of each PK only, preventing a stale older match from leaking past an in-memtable update whose current version fails the predicate. |
| `pub fn project&lt;T: AsRef&lt;str&gt;&gt;(&mut self, columns: &[T]) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:639-639 | Project only the specified columns. Mirrors [`crate::dataset::scanner::Scanner::project`]. |
| `pub fn with_row_id(&mut self) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:660-660 | Include the _rowid column in output. |
| `pub fn readable_count(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:669-669 | The readable-prefix snapshot this scanner latched at construction. A downstream recency filter must key on this same snapshot (not a fresh read of the IndexStore cursor, which a concurrent append could have advanced) so it stays consistent with the rows the search saw. |
| `pub fn with_row_address(&mut self) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:677-677 | Include the _rowaddr column in output. |
| `pub fn filter(&mut self, filter_expr: &str) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:683-683 | Set a filter expression using SQL-like syntax. |
| `pub fn filter_expr(&mut self, expr: Expr) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:690-690 | Set a filter expression directly. |
| `pub fn limit(&mut self, limit: Option&lt;i64&gt;, offset: Option&lt;i64&gt;) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:698-698 | Limit the number of results, with an optional offset. Mirrors [`crate::dataset::scanner::Scanner::limit`]: both bounds are `Option&lt;i64&gt;` and must be non-negative. |
| `pub fn nearest(&mut self, column: &str, query: &dyn Array, k: usize) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:727-727 | Set up a vector similarity search. Mirrors [`crate::dataset::scanner::Scanner::nearest`] — the query vector is passed by reference. |
| `pub fn nprobes(&mut self, n: usize) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:754-754 | Set the number of probes for IVF search. |
| `pub fn minimum_nprobes(&mut self, n: usize) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:768-768 | Set the minimum number of probes for IVF search. |
| `pub fn maximum_nprobes(&mut self, n: usize) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:780-780 | Set the maximum number of probes for IVF search. |
| `pub fn distance_metric(&mut self, metric: DistanceType) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:792-792 | Set the distance metric type for vector search. |
| `pub fn ef(&mut self, ef: usize) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:805-805 | Set the ef parameter for HNSW search. |
| `pub fn refine(&mut self, factor: u32) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:818-818 | Set the refine factor for re-ranking results. |
| `pub fn distance_range(&mut self, lower: Option&lt;f32&gt;, upper: Option&lt;f32&gt;) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:831-831 | Set the distance range for filtering results. |
| `pub fn full_text_search(&mut self, query: FullTextSearchQuery) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:847-847 | Set up a full-text search. Mirrors [`crate::dataset::scanner::Scanner::full_text_search`], taking a [`FullTextSearchQuery`] whose column is set via `FullTextSearchQuery::with_column`. Match (exact/fuzzy) and phrase leaf queries are supported; compound queries (boolean/boost/multi-match) are not yet supported by the MemTable path and return an error. |
| `pub fn full_text_phrase(&mut self, column: &str, phrase: &str, slop: u32) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:860-860 | Set up a full-text phrase search. |
| `pub fn full_text_boolean( &mut self, column: &str, must: Vec&lt;String&gt;, should: Vec&lt;String&gt;, must_not: Vec&lt;String&gt;, ) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:873-879 | Set up a full-text Boolean search. |
| `pub fn full_text_fuzzy(&mut self, column: &str, query: &str) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:895-895 | Set up a full-text fuzzy search with auto-fuzziness. |
| `pub fn full_text_fuzzy_with_distance( &mut self, column: &str, query: &str, fuzziness: u32, ) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:907-912 | Set up a full-text fuzzy search with specified edit distance. |
| `pub fn full_text_fuzzy_with_options( &mut self, column: &str, query: &str, fuzziness: Option&lt;u32&gt;, max_expansions: usize, ) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:925-931 | Set up a full-text fuzzy search with full options. |
| `pub fn fts_wand_factor(&mut self, wand_factor: f32) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:953-953 | Set the WAND factor for FTS queries to control performance/recall tradeoff. |
| `pub fn fts_include_tail(&mut self, include_tail: bool) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:968-968 | Choose whether FTS searches the mutable tail (read-your-writes, default) or only the immutable frozen partitions (the Lucene model — lower latency, does not reflect rows written since the last freeze). Only applies when a full-text query is set. |
| `pub fn use_index(&mut self, use_index: bool) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:980-980 | Enable or disable index usage. |
| `pub fn batch_size(&mut self, size: usize) -&gt; &mut Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:986-986 | Set the batch size for output. |
| `pub async fn try_into_stream(&self) -&gt; Result&lt;SendableRecordBatchStream&gt;` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:992-992 | Execute the scan and return a stream of record batches. |
| `pub async fn try_into_batch(&self) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:1001-1001 | Execute the scan and collect all results into a single RecordBatch. |
| `pub async fn count_rows(&self) -&gt; Result&lt;u64&gt;` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:1023-1023 | Count the number of rows that match the query. |
| `pub fn output_schema(&self) -&gt; Result&lt;SchemaRef&gt;` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:1037-1037 | Get the output schema after projection. |
| `pub async fn create_plan(&self) -&gt; Result&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:1084-1084 | Create the execution plan based on the query configuration. |
| `pub async fn create_dedup_plan(&self, pk_columns: &[String]) -&gt; Result&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;` | rust/lance/src/dataset/mem_wal/memtable/scanner/builder.rs:1167-1167 | Plan a newest-per-PK active-arm scan via `MemTableDedupScanExec` — dedup runs before the predicate so a PK whose newest version fails the filter cannot leak an older version that passes. With [`Self::with_memtable_filter_indexes`] on, a filter the indexes answer within the match budget is read from their matches instead, each kept only if it is its key's newest visible version. It never pushes a limit (the LSM caps results above the cross-source merge). |


<a id="source-rust-lance-src-dataset-mem-wal-memtable-scanner-exec-rs"></a>

## `rust/lance/src/dataset/mem_wal/memtable/scanner/exec.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use brute_force_vector::MemTableBruteForceVectorExec;` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec.rs:33-33 | No standalone documentation summary; use the family contract and source entry. |
| `pub use dedup_scan::MemTableDedupScanExec;` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec.rs:34-34 | No standalone documentation summary; use the family contract and source entry. |
| `pub use fts::` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec.rs:35-35 | No standalone documentation summary; use the family contract and source entry. |
| `pub use scalar_index::ScalarMemIndexExec;` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec.rs:36-36 | No standalone documentation summary; use the family contract and source entry. |
| `pub use scan::` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec.rs:39-39 | No standalone documentation summary; use the family contract and source entry. |
| `pub use vector::VectorIndexExec;` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec.rs:40-40 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-src-dataset-mem-wal-memtable-scanner-exec-brute-force-vector-rs"></a>

## `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/brute_force_vector.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct MemTableBruteForceVectorExec` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec/brute_force_vector.rs:48-48 | Brute-force KNN over an active memtable without an HNSW. Produces the same output schema as [`super::VectorIndexExec`]. |
| `pub fn new( batch_store: Arc&lt;BatchStore&gt;, query: VectorQuery, readable_count: usize, projection: Option&lt;Vec&lt;usize&gt;&gt;, base_schema: SchemaRef, with_row_id: bool, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec/brute_force_vector.rs:82-89 | Build the exec. `base_schema` is the post-projection row schema (no `_distance`, no `_rowid`); `_distance` is appended unconditionally and `_rowid` only when `with_row_id` is set, matching [`VectorIndexExec`]. |
| `pub fn with_filter(mut self, filter: Option&lt;PhysicalExprRef&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec/brute_force_vector.rs:124-124 | Attach an optional prefilter predicate (compiled against the memtable schema). Rows that fail the predicate are excluded before the top-k cut. |
| `pub fn with_pk_columns(mut self, pk_columns: Option&lt;Vec&lt;String&gt;&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec/brute_force_vector.rs:131-131 | Provide the primary-key columns so search keeps only the newest version of each PK (see `pk_columns`). |

<a id="source-rust-lance-src-dataset-mem-wal-memtable-scanner-exec-btree-rs"></a>

## Removed BTreeIndexExec

The former specialized B-tree node was removed. Use the plugin-backed scalar node: `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/scalar_index.rs:1-521`; [plugin contract](../refresh-2026-10-11.md).

## `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/dedup_scan.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct MemTableDedupScanExec` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec/dedup_scan.rs:45-45 | Scans the active memtable newest-first and emits the newest-per-PK rows that satisfy the (optional) predicate. See the module doc. |
| `pub fn new( batch_store: Arc&lt;BatchStore&gt;, readable_count: usize, projection: Option&lt;Vec&lt;usize&gt;&gt;, output_schema: SchemaRef, pk_indices: Vec&lt;usize&gt;, with_row_id: bool, with_row_address: bool, filter_predicate: Option&lt;PhysicalExprRef&gt;, filter_expr: Option&lt;Expr&gt;, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec/dedup_scan.rs:77-87 | Create a new fused dedup + predicate scan over the active memtable. |

<a id="source-rust-lance-src-dataset-mem-wal-memtable-scanner-exec-fts-rs"></a>

## `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/fts.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const SCORE_COLUMN: &str = "_score";` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec/fts.rs:39-39 | Score column name in output. |
| `pub struct FtsIndexExec` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec/fts.rs:61-61 | ExecutionPlan node that queries FTS index with MVCC visibility. |
| `pub fn new( batch_store: Arc&lt;BatchStore&gt;, indexes: Arc&lt;IndexStore&gt;, query: FtsQuery, readable_count: usize, projection: Option&lt;Vec&lt;usize&gt;&gt;, base_schema: SchemaRef, with_row_id: bool, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec/fts.rs:110-118 | Create a new FtsIndexExec. |
| `pub fn with_filter(mut self, filter: Option&lt;PhysicalExprRef&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec/fts.rs:200-200 | Attach an optional prefilter predicate (compiled against the memtable schema). Hits that fail the predicate are dropped before projection. |
| `pub fn with_pk_columns(mut self, pk_columns: Option&lt;Vec&lt;String&gt;&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec/fts.rs:206-206 | Provide primary-key columns for newest-version filtering. |


<a id="source-rust-lance-src-dataset-mem-wal-memtable-scanner-exec-scan-rs"></a>

## `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/scan.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const ROW_ADDRESS_COLUMN: &str = "_rowaddr";` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec/scan.rs:30-30 | Column name for row address (consistent with base table scanner). |
| `pub struct MemTableScanExec` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec/scan.rs:37-37 | ExecutionPlan node that scans the readable prefix of a MemTable. |
| `pub fn new( batch_store: Arc&lt;BatchStore&gt;, readable_count: usize, projection: Option&lt;Vec&lt;usize&gt;&gt;, output_schema: SchemaRef, with_row_id: bool, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec/scan.rs:78-84 | Create a new MemTableScanExec without filter. |
| `pub fn with_filter( batch_store: Arc&lt;BatchStore&gt;, readable_count: usize, projection: Option&lt;Vec&lt;usize&gt;&gt;, output_schema: SchemaRef, source_schema: SchemaRef, with_row_id: bool, with_row_address: bool, filter_predicate: Option&lt;PhysicalExprRef&gt;, filter_expr: Option&lt;Expr&gt;, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec/scan.rs:112-122 | Create a new MemTableScanExec with optional filter pushdown. |

<a id="source-rust-lance-src-dataset-mem-wal-memtable-scanner-exec-vector-rs"></a>

## `rust/lance/src/dataset/mem_wal/memtable/scanner/exec/vector.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const DISTANCE_COLUMN: &str = "_distance";` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec/vector.rs:32-32 | Distance column name in output. |
| `pub struct VectorIndexExec` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec/vector.rs:36-36 | ExecutionPlan node that answers a vector search from the memtable index planning chose, with MVCC visibility. |
| `pub fn new( batch_store: Arc&lt;BatchStore&gt;, indexes: Arc&lt;IndexStore&gt;, query: VectorQuery, readable_count: usize, projection: Option&lt;Vec&lt;usize&gt;&gt;, base_schema: SchemaRef, with_row_id: bool, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/memtable/scanner/exec/vector.rs:82-90 | Create a new VectorIndexExec. |


<a id="source-rust-lance-src-dataset-mem-wal-observer-rs"></a>

## `rust/lance/src/dataset/mem_wal/observer.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub trait WalObserver: Send + Sync + Debug` | rust/lance/src/dataset/mem_wal/observer.rs:22-22 | Sink for individual write-path events, supplied by the consumer via `ShardWriterConfig::observer`. |

<a id="source-rust-lance-src-dataset-mem-wal-reconcile-rs"></a>

## `rust/lance/src/dataset/mem_wal/reconcile.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct Plan` | rust/lance/src/dataset/mem_wal/reconcile.rs:153-153 | One resolution of a source schema against a target schema. |


<a id="source-rust-lance-src-dataset-mem-wal-scanner-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod exec;` | rust/lance/src/dataset/mem_wal/scanner.rs:43-43 | No standalone documentation summary; use the family contract and source entry. |
| `pub use block_list::write_pk_sidecar;` | rust/lance/src/dataset/mem_wal/scanner.rs:52-52 | No standalone documentation summary; use the family contract and source entry. |
| `pub use builder::LsmScanner;` | rust/lance/src/dataset/mem_wal/scanner.rs:53-53 | No standalone documentation summary; use the family contract and source entry. |
| `pub use collector::` | rust/lance/src/dataset/mem_wal/scanner.rs:54-54 | No standalone documentation summary; use the family contract and source entry. |
| `pub use data_source::` | rust/lance/src/dataset/mem_wal/scanner.rs:57-57 | No standalone documentation summary; use the family contract and source entry. |
| `pub use fts_search::` | rust/lance/src/dataset/mem_wal/scanner.rs:58-58 | No standalone documentation summary; use the family contract and source entry. |
| `pub use point_lookup::LsmPointLookupPlanner;` | rust/lance/src/dataset/mem_wal/scanner.rs:59-59 | No standalone documentation summary; use the family contract and source entry. |
| `pub use projection::DISTANCE_COLUMN;` | rust/lance/src/dataset/mem_wal/scanner.rs:60-60 | No standalone documentation summary; use the family contract and source entry. |
| `pub use sstable_cache::` | rust/lance/src/dataset/mem_wal/scanner.rs:61-61 | No standalone documentation summary; use the family contract and source entry. |
| `pub use vector_search::LsmVectorSearchPlanner;` | rust/lance/src/dataset/mem_wal/scanner.rs:62-62 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn parse_filter_expr(schema: &ArrowSchema, filter_expr: &str) -&gt; Result&lt;Expr&gt;` | rust/lance/src/dataset/mem_wal/scanner.rs:65-65 | Parse a SQL filter expression against a MemWAL source schema. |

<a id="source-rust-lance-src-dataset-mem-wal-scanner-block-list-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/block_list.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub enum GenMembership` | rust/lance/src/dataset/mem_wal/scanner/block_list.rs:50-50 | One newer generation's PK membership, used to decide whether it shadows an older source's row. |
| `pub async fn contains(&self, key: &ScalarValue) -&gt; Result&lt;bool&gt;` | rust/lance/src/dataset/mem_wal/scanner/block_list.rs:67-67 | Whether this generation visibly contains the primary `key` — the typed value for a single-column PK, the encoded `Binary` tuple for a composite one (built by [`on_disk_pk_key`]). The same key probes the in-memory BTree and the flushed on-disk BTree, which now share a key space. |
| `pub async fn contains_keys(&self, keys: &[ScalarValue]) -&gt; Result&lt;Vec&lt;bool&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/block_list.rs:90-90 | Batched [`Self::contains`]: for each key in `keys`, whether this generation visibly contains it, returned as a mask aligned to `keys`. |
| `pub fn on_disk_pk_key(values: &[ScalarValue]) -&gt; Result&lt;ScalarValue&gt;` | rust/lance/src/dataset/mem_wal/scanner/block_list.rs:139-139 | The probe key for the on-disk PK BTree: a single-column PK indexes its typed value directly; a composite PK indexes the order-preserving encoded tuple as `Binary` (matching what flush wrote — see [`encode_pk_tuple`]). |
| `pub type SourceBlockLists = HashMap&lt;(Option&lt;Uuid&gt;, LsmGeneration), Vec&lt;GenMembership&gt;&gt;;` | rust/lance/src/dataset/mem_wal/scanner/block_list.rs:148-148 | Per-source blocked memberships, keyed by `(shard_id, generation)`. Each value is the memberships of the generations newer than that source. |
| `pub async fn compute_source_block_lists( sources: &[LsmDataSource], session: Option&lt;&Arc&lt;Session&gt;&gt;, store_params: Option&lt;&ObjectStoreParams&gt;, sstable_cache: Option&lt;&Arc&lt;dyn DatasetCache&gt;&gt;, ) -&gt; Result&lt;SourceBlockLists&gt;` | rust/lance/src/dataset/mem_wal/scanner/block_list.rs:158-163 | Per-source `NEWER(G)`, keyed by `(shard_id, generation)`. Generations are per-shard, so a source is superseded only by strictly-newer generations of the **same** shard — it never appears in its own blocked list. The base table is shardless (`None`, oldest) and superseded by every non-base generation. Only superseded sources get an entry; the newest of each shard never does. |
| `pub async fn fresh_tier_block_list( sources: &[LsmDataSource], session: Option&lt;&Arc&lt;Session&gt;&gt;, store_params: Option&lt;&ObjectStoreParams&gt;, sstable_cache: Option&lt;&Arc&lt;dyn DatasetCache&gt;&gt;, watermarks: Option&lt;&HashMap&lt;Uuid, FreshTierWatermark&gt;&gt;, ) -&gt; Result&lt;Vec&lt;GenMembership&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/block_list.rs:240-246 | The fresh-tier block-list: one [`GenMembership`] per generation that shadows the base table — active + frozen memtables (probed against their index) and SSTables (probed against their on-disk PK BTree). A base/external reader can test any PK against these (via [`GenMembership::contains`]) to decide whether the fresh tier shadows it. The base source, if present, is skipped (it is what gets shadowed). |
| `pub async fn write_pk_sidecar( uri: &str, batches: &[arrow_array::RecordBatch], pk_columns: &[&str], ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/scanner/block_list.rs:429-433 | Write an SSTable's standalone PK sidecar at `{uri}/_pk_index` from `batches`, mirroring what flush does in production. `pk_columns` are the primary-key column names (field ids are synthesized by position — `insert` resolves columns by name). A no-op when no batch carries the PK columns. |

<a id="source-rust-lance-src-dataset-mem-wal-scanner-builder-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/builder.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct LsmScanner` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:195-195 | Scanner for LSM tree data spanning base table, SSTables, and active MemTable. |
| `pub fn new( base_table: Arc&lt;Dataset&gt;, shard_snapshots: Vec&lt;ShardSnapshot&gt;, pk_columns: Vec&lt;String&gt;, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:253-257 | Create a new LSM scanner. |
| `pub fn without_base_table( schema: SchemaRef, base_path: impl Into&lt;String&gt;, shard_snapshots: Vec&lt;ShardSnapshot&gt;, pk_columns: Vec&lt;String&gt;, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:309-314 | Create a scanner that reads only the fresh tier (active memtable and SSTables) without including a base Lance table. |
| `pub fn with_active_memtable(mut self, shard_id: Uuid, memtable: InMemoryMemTableRef) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:344-344 | Set a shard's active memtable. Back-compat / test entry point; the read path uses [`Self::with_in_memory_memtables`]. Replaces the active memtable, preserving any frozen memtables already registered. |
| `pub fn with_identity_schema(mut self, identity_schema: SchemaRef) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:364-364 | Supply [`Self::schema`] with each field's id, so a sealed generation's columns resolve to the table's by id rather than by name. A rename keeps the id and moves the name, so without this a renamed column reads as absent. Built with `arrow_schema_with_field_ids`. |
| `pub fn with_in_memory_memtables( mut self, shard_id: Uuid, memtables: InMemoryMemTables, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:373-377 | Register a shard's in-memory memtables (active + frozen-awaiting- flush) captured atomically by `ShardWriter::in_memory_memtable_refs`. The read path's entry point — closes the concurrent-read-vs-flush hole by carrying frozen-undrained generations into the scan. |
| `pub fn with_session(mut self, session: Arc&lt;Session&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:384-384 | Set the session used to open SSTables. Defaults to the base table's; set explicitly on a fresh-tier-only scanner (no base table). |
| `pub fn with_store_params(mut self, store_params: ObjectStoreParams) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:396-396 | Set the store params used to open SSTables. Defaults to the base table's; set explicitly on a fresh-tier-only scanner (no base table). |
| `pub fn with_sstable_cache(mut self, cache: Arc&lt;dyn DatasetCache&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:408-408 | Inject a cache of opened SSTable datasets. |
| `pub fn with_warmer(mut self, warmer: Arc&lt;dyn SsTableWarmer&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:415-415 | Inject the warmer fired on first open of an SSTable. Not set by default, so behavior is unchanged unless opted in. |
| `pub fn with_memtable_filter_indexes(mut self, enabled: bool) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:424-424 | Answer a filtered scan of in-memory memtables from their filter indexes, keeping a match only when it is its key's newest visible version. A filter matching too many rows to check one by one reads every in-memory row instead. Off by default: every in-memory row is read. |
| `pub fn with_overfetch_factor(mut self, factor: f64) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:433-433 | Set the over-fetch multiple block-listed sources use in search plans so they still yield `k` live rows after cross-generation dedup. Threaded into the LSM search planners; values below `1.0` are rejected when the plan is created. |
| `pub fn project&lt;T: AsRef&lt;str&gt;&gt;(mut self, columns: &[T]) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:442-442 | Project specific columns. |
| `pub fn filter(mut self, filter_expr: &str) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:450-450 | Set filter expression using SQL-like syntax. |
| `pub fn filter_expr(mut self, expr: Expr) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:457-457 | Set filter expression directly. |
| `pub fn limit(mut self, limit: Option&lt;i64&gt;, offset: Option&lt;i64&gt;) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:465-465 | Limit the number of results, with an optional offset. Matches [`crate::dataset::scanner::Scanner::limit`]: both bounds are `Option&lt;i64&gt;` and must be non-negative. |
| `pub fn nearest(mut self, column: &str, key: &dyn Array, k: usize) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:492-492 | Find the `k` nearest neighbors of `key` in `column`. Routes `create_plan` through the LSM vector planner (base ∪ SSTables ∪ in-memory). Mirrors [`crate::dataset::scanner::Scanner::nearest`]; the LSM path supports a single Float32 query vector. When combined with an offset, the LSM path fetches `k + offset` per source before applying the final page. Tune with [`Self::nprobes`], [`Self::minimum_nprobes`], [`Self::maximum_nprobes`], [`Self::refine`], and [`Self::distance_metric`]. |
| `pub fn nprobes(mut self, nprobes: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:514-514 | Search exactly `nprobes` IVF partitions on indexed arms by setting both probe bounds. No-op unless [`Self::nearest`] was called. |
| `pub fn minimum_nprobes(mut self, minimum_nprobes: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:526-526 | Set the minimum number of IVF partitions to search on indexed arms. |
| `pub fn maximum_nprobes(mut self, maximum_nprobes: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:537-537 | Set the maximum number of IVF partitions to search on indexed arms. |
| `pub fn refine(mut self, refine_factor: u32) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:547-547 | Re-rank base-table candidates with exact distances so they are directly comparable to the exact memtable distances in the cross-source merge. The factor is treated as a boolean today. No-op unless `nearest` was set. |
| `pub fn distance_metric(mut self, metric: DistanceType) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:556-556 | Distance metric for the vector search. Defaults to L2. No-op unless [`Self::nearest`] was called. |
| `pub fn with_row_address(mut self) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:566-566 | Include `_rowaddr` column in output. |
| `pub fn with_memtable_gen(mut self) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:576-576 | Include `_memtable_gen` column in output. |
| `pub fn schema(&self) -&gt; SchemaRef` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:582-582 | Get the output schema. |
| `pub async fn create_plan(&self) -&gt; Result&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:598-598 | Create the execution plan. |
| `pub fn full_text_search(mut self, query: FullTextSearchQuery) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:825-825 | Find rows matching a full-text query. Routes `create_plan` through the LSM FTS planner (base ∪ SSTables ∪ in-memory), local-scored by BM25 and merged by `_score` DESC. Mirrors [`crate::dataset::scanner::Scanner::full_text_search`]: the searched column(s) come from the query (set via `FullTextSearchQuery::with_column`); the query limit, when present, controls the FTS source/merge top-k; scanner limit/offset still apply to the final merged result. The LSM path supports a single FTS-indexed column. |
| `pub async fn try_into_stream(&self) -&gt; Result&lt;SendableRecordBatchStream&gt;` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:831-831 | Execute the scan and return a stream of record batches. |
| `pub async fn try_into_batch(&self) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:840-840 | Execute the scan and collect all results into a single RecordBatch. |
| `pub async fn count_rows(&self) -&gt; Result&lt;u64&gt;` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:858-858 | Count the number of rows that match the query. |
| `pub async fn contains_pks(&self, pks: &RecordBatch) -&gt; Result&lt;Vec&lt;bool&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:875-875 | Test which `pks` have been (re)written in the WAL fresh tier — the active and frozen memtables and SSTables this scanner spans — i.e. are shadowed above the base table. `pks` is a batch whose columns include the primary-key columns; the returned `Vec&lt;bool&gt;` is aligned with its rows. Hashing matches the scanner's internal dedup, so the caller never hashes PKs itself. Flushed membership comes from the injected [`DatasetCache`] when one is set. |
| `pub async fn contains_pks_at( &self, pks: &RecordBatch, watermarks: Option&lt;&HashMap&lt;Uuid, FreshTierWatermark&gt;&gt;, ) -&gt; Result&lt;Vec&lt;bool&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/builder.rs:884-888 | As-of variant of [`Self::contains_pks`]. Membership is evaluated against a per-shard watermark on the fresh tier, supplied via `watermarks` (see [`FreshTierWatermark`]), matching the tier a prior scan observed and avoiding the two-snapshot skew that would drop a base row with no delivered replacement. `None` evaluates against the live tier. |


<a id="source-rust-lance-src-dataset-mem-wal-scanner-collector-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/collector.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct InMemoryMemTableRef` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:21-21 | A point-in-time handle to one in-memory memtable, active or frozen — structurally identical (a frozen memtable is just the immutable case). |
| `pub batch_store: Arc&lt;BatchStore&gt;,` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:23-23 | Batch store containing the data. |
| `pub index_store: Arc&lt;IndexStore&gt;,` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:25-25 | Index store for the MemTable. |
| `pub schema: SchemaRef,` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:27-27 | Schema of the data. |
| `pub generation: u64,` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:29-29 | Generation number. |
| `pub fn row_bytes(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:38-38 | Row-data bytes: the buffered batches. |
| `pub fn index_bytes(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:48-48 | Heap held by this memtable's auxiliary lookup structures: its in-memory indexes plus the fixed PK bloom filter. |
| `pub fn retained_row_bytes(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:56-56 | Heap the buffered batches keep alive, which is not [`Self::row_bytes`] once any batch is a zero-copy slice: a slice's window is a fraction of the parent buffer it pins. See [`BatchStore::retained_bytes`]. |
| `pub fn resident_bytes(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:62-62 | Total resident heap bytes. This, not [`Self::row_bytes`], is what a memory ceiling must be built on. |
| `pub type ActiveMemTableRef = InMemoryMemTableRef;` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:68-68 | Back-compat alias; prefer [`InMemoryMemTableRef`]. |
| `pub struct InMemoryMemTables` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:75-75 | A shard's in-memory memtables: the one live `active` memtable plus any `frozen` memtables awaiting flush (not yet recorded in the manifest). Mirrors the writer's `WriterState { memtable, frozen_memtables }` so the reader and writer name the same thing the same way. |
| `pub active: InMemoryMemTableRef,` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:77-77 | The single live memtable accepting writes. |
| `pub frozen: Vec&lt;InMemoryMemTableRef&gt;,` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:80-80 | Frozen memtables awaiting flush; element order is irrelevant — the collector sorts in-memory sources by `generation` before the scan. |
| `pub struct LsmDataSourceCollector` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:95-95 | Collects data sources from base table and MemWAL shards. |
| `pub fn new(base_table: Arc&lt;Dataset&gt;, shard_snapshots: Vec&lt;ShardSnapshot&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:113-113 | Create a new collector from base table and shard snapshots. |
| `pub fn without_base_table( base_path: impl Into&lt;String&gt;, shard_snapshots: Vec&lt;ShardSnapshot&gt;, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:130-133 | Create a collector without a base table (fresh-tier scan only). |
| `pub fn with_active_memtable(mut self, shard_id: Uuid, memtable: InMemoryMemTableRef) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:145-145 | Set a shard's active memtable. Back-compat / test entry point; the read path uses [`Self::with_in_memory_memtables`]. Replaces the active memtable, preserving any frozen memtables already registered. |
| `pub fn with_in_memory_memtables( mut self, shard_id: Uuid, memtables: InMemoryMemTables, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:161-165 | Register a shard's in-memory memtables (active + frozen-awaiting- flush) captured atomically by `ShardWriter::in_memory_memtable_refs`. The WAL read path's entry point. |
| `pub fn base_table(&self) -&gt; Option&lt;&Arc&lt;Dataset&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:171-171 | Get the base table, if any. |
| `pub fn shard_snapshots(&self) -&gt; &[ShardSnapshot]` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:176-176 | Get all shard snapshots. |
| `pub fn in_memory_memtables(&self) -&gt; &HashMap&lt;Uuid, InMemoryMemTables&gt;` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:181-181 | In-memory memtables (active + frozen-awaiting-flush) by shard. |
| `pub fn has_on_disk_sources(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:189-189 | Whether the collector has any on-disk source (base table or an SSTable). The point-lookup fast path uses this to decide, after missing every in-memory memtable, between "definitely absent" (`false`) and "must consult disk via the plan path" (`true`). Cheap: no allocation. |
| `pub fn in_memory_refs_newest_first(&self) -&gt; Vec&lt;&InMemoryMemTableRef&gt;` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:197-197 | The in-memory memtables (active + frozen across all shards) as references, **newest generation first**. Used by batch point lookups that probe many keys against the same set of memtables; clones no `Arc`s. Empty when there are no in-memory memtables. |
| `pub fn find_in_memory_newest_first&lt;T&gt;( &self, mut f: impl FnMut(&InMemoryMemTableRef) -&gt; Result&lt;Option&lt;T&gt;&gt;, ) -&gt; Result&lt;Option&lt;T&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:215-218 | Visit the in-memory memtables (active + frozen) **newest generation first** by reference, calling `f` until it returns `Some`; returns that value (or `None` if every memtable was visited without one). |
| `pub fn collect(&self) -&gt; Result&lt;Vec&lt;LsmDataSource&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:282-282 | Collect all data sources. |
| `pub fn collect_for_shards(&self, shard_ids: &HashSet&lt;Uuid&gt;) -&gt; Result&lt;Vec&lt;LsmDataSource&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:319-319 | Collect data sources for specific shards only. |
| `pub fn num_sources(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/scanner/collector.rs:358-358 | Get the total number of data sources. |

<a id="source-rust-lance-src-dataset-mem-wal-scanner-data-source-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/data_source.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct FreshTierWatermark` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:28-28 | A watermark marking how far into one shard's fresh tier a prior scan observed, so membership can be evaluated as of that point (see [`super::builder::LsmScanner::contains_pks_at`]). |
| `pub active_generation: u64,` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:31-31 | Active generation the scan observed. Higher generations are excluded; lower ones are immutable and included whole. |
| `pub active_batch_count: u64,` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:34-34 | Active-memtable batch count at snapshot time. Within the active generation, only batches at index `&lt; active_batch_count` were observed. |
| `pub struct LsmGeneration(u64);` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:44-44 | Generation number in LSM tree. |
| `pub const BASE_TABLE: Self = Self(0);` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:48-48 | Generation for the base table (compacted data). |
| `pub fn memtable(generation: u64) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:55-55 | Create a generation for a MemTable. |
| `pub fn as_u64(&self) -&gt; u64` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:64-64 | Get the raw u64 value. |
| `pub fn is_base_table(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:69-69 | Check if this is the base table generation. |
| `pub struct SsTable` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:98-98 | An SSTable with its storage path. |
| `pub generation: u64,` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:100-100 | Generation number. |
| `pub path: String,` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:102-102 | Path to the SSTable directory (relative to table root). |
| `pub struct ShardSnapshot` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:110-110 | Snapshot of a shard's state at a point in time. |
| `pub shard_id: Uuid,` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:112-112 | Shard UUID. |
| `pub spec_id: u32,` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:114-114 | Shard spec ID (0 if manual shard). |
| `pub current_generation: u64,` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:116-116 | Current generation being written (next flush will be this generation). |
| `pub sstables: Vec&lt;SsTable&gt;,` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:118-118 | List of SSTables and their paths. |
| `pub fn new(shard_id: Uuid) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:123-123 | Create a new shard snapshot. |
| `pub fn with_spec_id(mut self, spec_id: u32) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:133-133 | Set the spec ID. |
| `pub fn with_current_generation(mut self, generation: u64) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:139-139 | Set the current generation. |
| `pub fn with_sstable(mut self, generation: u64, path: String) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:145-145 | Add an SSTable. |
| `pub enum LsmDataSource` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:152-152 | A data source in the LSM tree that can be scanned. |
| `pub fn generation(&self) -&gt; LsmGeneration` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:184-184 | Get the generation of this data source. |
| `pub fn shard_id(&self) -&gt; Option&lt;Uuid&gt;` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:193-193 | Get the shard ID if this is a shard source. |
| `pub fn is_base_table(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:202-202 | Check if this is the base table. |
| `pub fn is_active_memtable(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:207-207 | Check if this is an active (in-memory) MemTable. |
| `pub fn display_name(&self) -&gt; String` | rust/lance/src/dataset/mem_wal/scanner/data_source.rs:212-212 | Get a display name for logging. |

<a id="source-rust-lance-src-dataset-mem-wal-scanner-exec-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/exec.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use bloom_guard::` | rust/lance/src/dataset/mem_wal/scanner/exec.rs:25-25 | No standalone documentation summary; use the family contract and source entry. |
| `pub use coalesce_first::CoalesceFirstExec;` | rust/lance/src/dataset/mem_wal/scanner/exec.rs:26-26 | No standalone documentation summary; use the family contract and source entry. |
| `pub use first_by_pk::FirstByPkExec;` | rust/lance/src/dataset/mem_wal/scanner/exec.rs:27-27 | No standalone documentation summary; use the family contract and source entry. |
| `pub use generation_tag::` | rust/lance/src/dataset/mem_wal/scanner/exec.rs:28-28 | No standalone documentation summary; use the family contract and source entry. |
| `pub use pk::` | rust/lance/src/dataset/mem_wal/scanner/exec.rs:29-29 | No standalone documentation summary; use the family contract and source entry. |
| `pub use pk_block_filter::PkBlockFilterExec;` | rust/lance/src/dataset/mem_wal/scanner/exec.rs:33-33 | No standalone documentation summary; use the family contract and source entry. |
| `pub use schema_relabel::SchemaRelabelExec;` | rust/lance/src/dataset/mem_wal/scanner/exec.rs:35-35 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-mem-wal-scanner-exec-bloom-guard-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/exec/bloom_guard.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct BloomFilterGuardExec` | rust/lance/src/dataset/mem_wal/scanner/exec/bloom_guard.rs:50-50 | Guards a child execution node with a bloom filter check. |
| `pub fn new( input: Arc&lt;dyn ExecutionPlan&gt;, bloom_filter: Arc&lt;Sbbf&gt;, pk_hash: u64, generation: u64, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/exec/bloom_guard.rs:74-79 | Create a new BloomFilterGuardExec. |
| `pub fn might_contain(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/scanner/exec/bloom_guard.rs:100-100 | Check if the key might be in this generation. |
| `pub fn generation(&self) -&gt; u64` | rust/lance/src/dataset/mem_wal/scanner/exec/bloom_guard.rs:105-105 | Get the generation number. |
| `pub fn pk_hash(&self) -&gt; u64` | rust/lance/src/dataset/mem_wal/scanner/exec/bloom_guard.rs:110-110 | Get the primary key hash. |
| `pub fn compute_pk_hash_from_scalars(values: &[datafusion::common::ScalarValue]) -&gt; u64` | rust/lance/src/dataset/mem_wal/scanner/exec/bloom_guard.rs:208-208 | Compute hash for a primary key value. |

<a id="source-rust-lance-src-dataset-mem-wal-scanner-exec-coalesce-first-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/exec/coalesce_first.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct CoalesceFirstExec` | rust/lance/src/dataset/mem_wal/scanner/exec/coalesce_first.rs:44-44 | Returns the first non-empty result from multiple inputs with short-circuit evaluation. |
| `pub fn new(inputs: Vec&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/exec/coalesce_first.rs:63-63 | Create a new CoalesceFirstExec. |

<a id="source-rust-lance-src-dataset-mem-wal-scanner-exec-first-by-pk-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/exec/first_by_pk.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct FirstByPkExec` | rust/lance/src/dataset/mem_wal/scanner/exec/first_by_pk.rs:38-38 | Emits the first row seen for each primary key, preserving input order. |
| `pub fn new(input: Arc&lt;dyn ExecutionPlan&gt;, pk_columns: Vec&lt;String&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/exec/first_by_pk.rs:45-45 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-mem-wal-scanner-exec-generation-tag-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/exec/generation_tag.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const MEMTABLE_GEN_COLUMN: &str = "_memtable_gen";` | rust/lance/src/dataset/mem_wal/scanner/exec/generation_tag.rs:29-29 | Column name for MemTable generation in LSM scans. |
| `pub struct MemtableGenTagExec` | rust/lance/src/dataset/mem_wal/scanner/exec/generation_tag.rs:38-38 | Wraps a scan executor to add MemTable generation column. |
| `pub fn new(input: Arc&lt;dyn ExecutionPlan&gt;, generation: LsmGeneration) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/exec/generation_tag.rs:51-51 | Create a new generation tagging executor. |
| `pub fn generation(&self) -&gt; LsmGeneration` | rust/lance/src/dataset/mem_wal/scanner/exec/generation_tag.rs:80-80 | Get the generation this executor tags. |

<a id="source-rust-lance-src-dataset-mem-wal-scanner-exec-pk-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/exec/pk.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const ROW_ADDRESS_COLUMN: &str = "_rowaddr";` | rust/lance/src/dataset/mem_wal/scanner/exec/pk.rs:19-19 | Column name for a row address (the in-source row offset). |
| `pub fn resolve_pk_indices(batch: &RecordBatch, pk_columns: &[String]) -&gt; DFResult&lt;Vec&lt;usize&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/exec/pk.rs:22-22 | Resolve the column index of each primary-key column in `batch`. |
| `pub fn is_supported_pk_type(data_type: &DataType) -&gt; bool` | rust/lance/src/dataset/mem_wal/scanner/exec/pk.rs:42-42 | Primary-key column types we can hash exactly in the fast path. |
| `pub fn validate_pk_types(schema: &Schema, pk_columns: &[String]) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/scanner/exec/pk.rs:66-66 | Validate that every primary-key column has a type we can hash exactly. |
| `pub fn compute_pk_hash(batch: &RecordBatch, pk_indices: &[usize], row_idx: usize) -&gt; u64` | rust/lance/src/dataset/mem_wal/scanner/exec/pk.rs:91-91 | Hash a single row's primary key, identified by the `pk_indices` column positions and `row_idx`. |

<a id="source-rust-lance-src-dataset-mem-wal-scanner-exec-pk-block-filter-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/exec/pk_block_filter.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct PkBlockFilterExec` | rust/lance/src/dataset/mem_wal/scanner/exec/pk_block_filter.rs:55-55 | Filters out rows whose PK is contained in any newer generation's membership. |
| `pub fn new( input: Arc&lt;dyn ExecutionPlan&gt;, pk_columns: Vec&lt;String&gt;, blocked: Vec&lt;GenMembership&gt;, k: usize, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/exec/pk_block_filter.rs:66-71 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-mem-wal-scanner-exec-reconcile-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/exec/reconcile.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct ReconcileExec` | rust/lance/src/dataset/mem_wal/scanner/exec/reconcile.rs:28-28 | Brings one source's batches to the schema the scan reads in. |
| `pub fn new(input: Arc&lt;dyn ExecutionPlan&gt;, plan: Arc&lt;Plan&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/exec/reconcile.rs:35-35 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-mem-wal-scanner-exec-schema-relabel-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/exec/schema_relabel.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct SchemaRelabelExec` | rust/lance/src/dataset/mem_wal/scanner/exec/schema_relabel.rs:33-33 | Re-labels every batch to an exact target schema, leaving the arrays untouched. `ProjectionExec` cannot: DataFusion derives output nullability from the expressions, not from the schema the planner intended. |
| `pub fn new(input: Arc&lt;dyn ExecutionPlan&gt;, schema: SchemaRef) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/exec/schema_relabel.rs:43-43 | Wrap `input` so its batches are re-labeled to `schema`: same column count, order, and data types; only names, nullability, and metadata may differ. A mismatch surfaces per batch at execution time, not plan time. |

<a id="source-rust-lance-src-dataset-mem-wal-scanner-fts-search-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/fts_search.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const SCORE_COLUMN: &str = "_score";` | rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:78-78 | `_score` column name in FTS results — kept aligned with `lance_index::scalar::inverted::SCORE_COL` so this module doesn't require an import for one string constant. |
| `pub struct LsmFtsSearchPlanner` | rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:571-571 | Plans local-scoring FTS queries over LSM data. |
| `pub fn new( collector: LsmDataSourceCollector, pk_columns: Vec&lt;String&gt;, base_schema: SchemaRef, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:596-600 | Create a new planner. |
| `pub fn with_filter(mut self, filter: Option&lt;Expr&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:618-618 | Attach an optional prefilter predicate. Every source arm restricts its FTS hits to rows matching the predicate, matching a normal filtered full-text scan over base ∪ SSTables ∪ in-memory data. |
| `pub fn with_overfetch_factor(mut self, factor: f64) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:626-626 | Set the over-fetch multiple for blocked sources so they still yield `k` live rows after cross-generation block-list filtering. Values below `1.0` are rejected by [`Self::plan_search`]. |
| `pub fn with_identity_schema(mut self, schema: SchemaRef) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:636-636 | The table's schema carrying each field's id, which is what resolves a generation's stored columns to the table's. |
| `pub fn with_session(mut self, session: Arc&lt;Session&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:642-642 | Set the session used to open SSTables. |
| `pub fn with_store_params(mut self, store_params: ObjectStoreParams) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:648-648 | Set the store params used to open SSTables. |
| `pub fn with_sstable_cache(mut self, cache: Arc&lt;dyn DatasetCache&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:655-655 | Inject a cache of opened SSTable datasets, making repeated searches against the same generation a pure `Arc::clone`. |
| `pub fn with_warmer(mut self, warmer: Arc&lt;dyn SsTableWarmer&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:661-661 | Inject the warmer fired on first open of an SSTable. |
| `pub async fn plan_search( &self, query: FullTextSearchQuery, limit: Option&lt;usize&gt;, projection: Option&lt;&[String]&gt;, ) -&gt; Result&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/fts_search.rs:682-687 | Build the FTS execution plan (local scoring). |


<a id="source-rust-lance-src-dataset-mem-wal-scanner-planner-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/planner.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct LsmScanPlanner` | rust/lance/src/dataset/mem_wal/scanner/planner.rs:42-42 | Plans scan queries over LSM data. |
| `pub fn new( collector: LsmDataSourceCollector, pk_columns: Vec&lt;String&gt;, base_schema: SchemaRef, identity_schema: SchemaRef, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/planner.rs:67-72 | Create a new planner. |
| `pub fn with_memtable_filter_indexes(mut self, enabled: bool) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/planner.rs:87-87 | See [`super::LsmScanner::with_memtable_filter_indexes`]. |
| `pub fn with_session(mut self, session: Arc&lt;Session&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/planner.rs:93-93 | Set the session used to open SSTables. |
| `pub fn with_store_params(mut self, store_params: ObjectStoreParams) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/planner.rs:99-99 | Set the store params used to open SSTables. |
| `pub fn with_sstable_cache(mut self, cache: Arc&lt;dyn DatasetCache&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/planner.rs:106-106 | Inject a cache of opened SSTable datasets, making repeated queries against the same generation a pure `Arc::clone`. |
| `pub fn with_warmer(mut self, warmer: Arc&lt;dyn SsTableWarmer&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/planner.rs:112-112 | Inject the warmer fired on first open of an SSTable. |
| `pub async fn plan_scan( &self, projection: Option&lt;&[String]&gt;, filter: Option&lt;&Expr&gt;, limit: Option&lt;usize&gt;, offset: Option&lt;usize&gt;, with_memtable_gen: bool, keep_row_address: bool, ) -&gt; Result&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/planner.rs:139-147 | Create scan plan with deduplication. |


<a id="source-rust-lance-src-dataset-mem-wal-scanner-point-lookup-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct LsmPointLookupPlanner` | rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:85-85 | Plans point lookup queries over LSM data. |
| `pub fn new( collector: LsmDataSourceCollector, pk_columns: Vec&lt;String&gt;, base_schema: SchemaRef, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:141-145 | Create a new planner. |
| `pub fn with_identity_schema(mut self, identity_schema: SchemaRef) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:166-166 | Supply the table's field ids, when `base_schema` was built without them. |
| `pub fn with_visibility(mut self, visibility: MemTableVisibility) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:174-174 | Read the in-memory memtables at `visibility`. See [`MemTableVisibility::Indexed`] for when a wider bound is sound. |
| `pub fn with_session(mut self, session: Arc&lt;Session&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:180-180 | Set the session used to open SSTables. |
| `pub fn with_store_params(mut self, store_params: ObjectStoreParams) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:186-186 | Set the store params used to open SSTables. |
| `pub fn with_sstable_cache(mut self, cache: Arc&lt;dyn DatasetCache&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:196-196 | Inject a cache of opened SSTable datasets, making repeated lookups against the same generation a pure `Arc::clone`. Populate it up front during scan setup via `DatasetMemWalExt::prewarm_mem_wal` so the first gen-key lookup does not pay the dataset open. |
| `pub fn with_warmer(mut self, warmer: Arc&lt;dyn SsTableWarmer&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:202-202 | Inject the warmer fired on first open of an SSTable. |
| `pub fn with_bloom_filter(mut self, generation: u64, bloom_filter: Arc&lt;Sbbf&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:211-211 | Add a bloom filter for a generation. |
| `pub fn with_bloom_filters( mut self, bloom_filters: impl IntoIterator&lt;Item = (u64, Arc&lt;Sbbf&gt;)&gt;, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:217-220 | Add multiple bloom filters. |
| `pub async fn plan_lookup( &self, pk_values: &[ScalarValue], projection: Option&lt;&[String]&gt;, ) -&gt; Result&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:237-241 | Create a point lookup plan for the given primary key values. |
| `pub async fn lookup_keep_tombstone( &self, pk_values: &[ScalarValue], projection: Option&lt;&[String]&gt;, ) -&gt; Result&lt;Option&lt;RecordBatch&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:341-345 | Like [`Self::lookup`] but does NOT drop a tombstone: the returned 1-row batch carries the `_tombstone` marker (`true` ⇒ the key's newest fresh version is a delete); `None` still means the key is absent from every source. Partial-update merge uses this to treat a fresh-deleted PK as absent, so it never resurrects stale, not-yet-compacted base columns. Always plans (no in-memory fast path) — used off the hot read path, on small partial-update batches. |
| `pub async fn lookup_many_keep_tombstone( &self, keys: &[Vec&lt;ScalarValue&gt;], projection: Option&lt;&[String]&gt;, ) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:366-370 | Tombstone-preserving [`Self::lookup_many`] for single- or multi-column keys: resolves each key with [`Self::lookup_keep_tombstone`] and concatenates the hits in the carry schema (canonical output + `_tombstone`); keys absent from every source are omitted. Per-key (no batched fast path) — the partial-update batches that use it are small. |
| `pub async fn lookup( &self, pk_values: &[ScalarValue], projection: Option&lt;&[String]&gt;, ) -&gt; Result&lt;Option&lt;RecordBatch&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:400-404 | Resolve a single-row point lookup, returning the newest matching row (a 1-row batch with the canonical output schema) or `None`. |
| `pub async fn lookup_many( &self, keys: &[ScalarValue], projection: Option&lt;&[String]&gt;, ) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:506-510 | Resolve many single-column keys in one pass, returning the found rows (newest visible per key) as a single `RecordBatch` in the canonical output schema. Missing keys are omitted; row order is not guaranteed to match the input (a set result, like the scan path). Amortizes per-call overhead and gathers rows columnar (one vectorized `take` per source batch). Equivalent to N× [`Self::lookup`], minus the per-key plan/stream. |
| `pub async fn plan_point_lookup( &self, keys: &[ScalarValue], projection: Option&lt;&[String]&gt;, ) -&gt; Result&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/point_lookup.rs:636-640 | Build a composable one-shot `ExecutionPlan` that yields the point-lookup result for `keys`, so the LSM scanner can place limit / projection / etc. on top and use the fast path inside general query execution. A single key uses [`Self::lookup`]; multiple keys use [`Self::lookup_many`]. |


<a id="source-rust-lance-src-dataset-mem-wal-scanner-projection-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/projection.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const DISTANCE_COLUMN: &str = "_distance";` | rust/lance/src/dataset/mem_wal/scanner/projection.rs:34-34 | Column name for distance in vector search results. |
| `pub fn wants_row_id(projection: Option&lt;&[String]&gt;) -&gt; bool` | rust/lance/src/dataset/mem_wal/scanner/projection.rs:37-37 | Did the caller list `_rowid` in their projection? |
| `pub fn wants_row_address(projection: Option&lt;&[String]&gt;) -&gt; bool` | rust/lance/src/dataset/mem_wal/scanner/projection.rs:44-44 | Did the caller list `_rowaddr` in their projection? |
| `pub fn build_scanner_projection( user_projection: Option&lt;&[String]&gt;, base_schema: &SchemaRef, pk_columns: &[String], ) -&gt; Vec&lt;String&gt;` | rust/lance/src/dataset/mem_wal/scanner/projection.rs:101-105 | Projection to pass to underlying scanners: user cols minus system/`_distance`, with PKs appended for dedup/staleness. |
| `pub fn validate_projection_names( user_projection: Option&lt;&[String]&gt;, base_schema: &SchemaRef, extra_columns: &[&str], ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/scanner/projection.rs:126-130 | Validate user-facing projection names before constructing a canonical schema. |
| `pub fn canonical_output_schema( user_projection: Option&lt;&[String]&gt;, base_schema: &SchemaRef, pk_columns: &[String], include_distance: bool, ) -&gt; Result&lt;SchemaRef&gt;` | rust/lance/src/dataset/mem_wal/scanner/projection.rs:162-167 | Canonical output schema honoring user column order. |
| `pub fn null_columns( plan: Arc&lt;dyn ExecutionPlan&gt;, names: &[&str], ) -&gt; Result&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/projection.rs:226-229 | Wrap `plan` so the named columns become typed NULL literals; all other columns are forwarded unchanged. Schema is preserved (same fields, same dtypes). Useful for stripping the *value* of an internal column after it has served its purpose (e.g. `_rowaddr` after the per-arm local sort) without breaking downstream schema matching. |
| `pub fn project_to_canonical( plan: Arc&lt;dyn ExecutionPlan&gt;, target_schema: &SchemaRef, ) -&gt; Result&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/projection.rs:283-286 | Wrap `plan` to emit exactly `target_schema`. Source columns are forwarded by name; anything the source lacks is filled with typed nulls. |

<a id="source-rust-lance-src-dataset-mem-wal-scanner-sstable-cache-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/sstable_cache.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct SsTableCache` | rust/lance/src/dataset/mem_wal/scanner/sstable_cache.rs:52-52 | Cache of opened SSTable datasets, keyed by resolved path. |
| `pub fn new(max_entries: u64) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/sstable_cache.rs:66-66 | Create a cache holding at most `max_entries` opened datasets. |
| `pub async fn get_or_open( &self, path: &str, session: Option&lt;Arc&lt;Session&gt;&gt;, store_params: Option&lt;ObjectStoreParams&gt;, ) -&gt; Result&lt;Arc&lt;Dataset&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/sstable_cache.rs:82-87 | Get the dataset for `path`, opening it (exactly once) on a miss. Concurrent callers share a single open via `moka`'s single-flight `try_get_with`; hits are a pure `Arc::clone`. `session` / `store_params` configure the open. |
| `pub fn retain_paths(&self, live_paths: &HashSet&lt;String&gt;)` | rust/lance/src/dataset/mem_wal/scanner/sstable_cache.rs:112-112 | Drop cached entries whose path is not in `live_paths`. |
| `pub trait DatasetCache: Send + Sync + std::fmt::Debug` | rust/lance/src/dataset/mem_wal/scanner/sstable_cache.rs:138-138 | Caching of opened SSTable datasets, keyed by immutable path. The opened dataset carries the session index cache, which also backs each generation's secondary indexes and its PK dedup sidecar (see `block_list::open_pk_index`) — so a single `get_or_open` is the whole caching surface. Implemented by [`SsTableCache`]; a [`SsTableWarmer`] composes one to warm through it, and a consumer may supply its own implementation. |
| `pub trait SsTableWarmer: Send + Sync + std::fmt::Debug` | rust/lance/src/dataset/mem_wal/scanner/sstable_cache.rs:185-185 | Proactively warms an SSTable into the shared caches: open the dataset and pre-load its secondary indexes and PK dedup sidecar so the first query sees no cold reads. This is the **seam** the flush and read paths fire — lance defines it; the consumer (e.g. the WAL pod) implements it. `None` =&gt; no warming, generations warm lazily on first read. |
| `pub async fn open_sstable( path: &str, session: Option&lt;&Arc&lt;Session&gt;&gt;, store_params: Option&lt;&ObjectStoreParams&gt;, cache: Option&lt;&Arc&lt;dyn DatasetCache&gt;&gt;, warmer: Option&lt;&Arc&lt;dyn SsTableWarmer&gt;&gt;, ) -&gt; Result&lt;Arc&lt;Dataset&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/sstable_cache.rs:200-206 | Open an SSTable dataset, shared by all three LSM open sites (scan, point lookup, vector search). |

<a id="source-rust-lance-src-dataset-mem-wal-scanner-vector-search-rs"></a>

## `rust/lance/src/dataset/mem_wal/scanner/vector_search.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub minimum_nprobes: Option&lt;usize&gt;,` | rust/lance/src/dataset/mem_wal/scanner/vector_search.rs:42-42 | No standalone documentation summary; use the family contract and source entry. |
| `pub maximum_nprobes: Option&lt;usize&gt;,` | rust/lance/src/dataset/mem_wal/scanner/vector_search.rs:43-43 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct LsmVectorSearchPlanner` | rust/lance/src/dataset/mem_wal/scanner/vector_search.rs:93-93 | Plans vector search queries over LSM data. |
| `pub fn new( collector: LsmDataSourceCollector, pk_columns: Vec&lt;String&gt;, base_schema: SchemaRef, vector_column: String, distance_type: lance_linalg::distance::DistanceType, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/vector_search.rs:145-151 | Create a new planner. |
| `pub fn with_filter(mut self, filter: Option&lt;Expr&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/vector_search.rs:173-173 | Attach an optional prefilter predicate. Every source arm restricts its KNN to rows matching the predicate (true prefilter), so results match a normal filtered vector scan over base ∪ SSTables ∪ in-memory data. |
| `pub fn with_distance_range(mut self, lower: Option&lt;f32&gt;, upper: Option&lt;f32&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/vector_search.rs:182-182 | Attach an optional distance range, `lower &lt;= _distance &lt; upper` — the same half-open semantics as [`crate::dataset::scanner::Scanner::distance_range`]. Every source arm applies it before its own top-k cut, so an out-of-range row can't displace an in-range one. |
| `pub fn with_ef(mut self, ef: Option&lt;usize&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/vector_search.rs:192-192 | Set the HNSW search-list size — the fresh tier's recall/latency knob. |
| `pub fn with_identity_schema(mut self, schema: SchemaRef) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/vector_search.rs:202-202 | The table's schema carrying each field's id, which is what resolves a generation's stored columns to the table's. |
| `pub fn with_session(mut self, session: Arc&lt;Session&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/vector_search.rs:208-208 | Set the session used to open SSTables. |
| `pub fn with_store_params(mut self, store_params: ObjectStoreParams) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/vector_search.rs:214-214 | Set the store params used to open SSTables. |
| `pub fn with_sstable_cache(mut self, cache: Arc&lt;dyn DatasetCache&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/vector_search.rs:221-221 | Inject a cache of opened SSTable datasets, making repeated searches against the same generation a pure `Arc::clone`. |
| `pub fn with_warmer(mut self, warmer: Arc&lt;dyn SsTableWarmer&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/vector_search.rs:227-227 | Inject the warmer fired on first open of an SSTable. |
| `pub fn with_dataset(mut self, dataset: Arc&lt;Dataset&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/scanner/vector_search.rs:239-239 | Set the base dataset for post-rerank take. |
| `pub async fn plan_search( &self, query_vector: &FixedSizeListArray, k: usize, nprobes: usize, projection: Option&lt;&[String]&gt;, refine_base_table: bool, overfetch_factor: f64, ) -&gt; Result&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;` | rust/lance/src/dataset/mem_wal/scanner/vector_search.rs:273-281 | Create a vector search plan. |

<a id="source-rust-lance-src-dataset-mem-wal-sharding-rs"></a>

## `rust/lance/src/dataset/mem_wal/sharding.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn evaluate_sharding_spec( batch: &RecordBatch, spec: &ShardingSpec, schema: &LanceSchema, ) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/mem_wal/sharding.rs:36-40 | Evaluate a MemWAL sharding specification against an Arrow record batch. |
| `pub fn evaluate_sharding_spec_with_embedded_columns( batch: &RecordBatch, spec: &ShardingSpec, ) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/mem_wal/sharding.rs:49-52 | Evaluate a MemWAL sharding specification that embeds source column names. |
| `pub fn evaluate_sharding_spec_with_source_columns( batch: &RecordBatch, spec: &ShardingSpec, source_id_to_column: &HashMap&lt;i32, String&gt;, ) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/mem_wal/sharding.rs:61-65 | Evaluate a MemWAL sharding specification with an explicit field-id mapping. |

<a id="source-rust-lance-src-dataset-mem-wal-util-rs"></a>

## `rust/lance/src/dataset/mem_wal/util.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct WatchableOnceCell&lt;T: Clone + std::fmt::Debug&gt;` | rust/lance/src/dataset/mem_wal/util.rs:18-18 | A cell that can be written to once and read by multiple readers. |
| `pub struct WatchableOnceCellReader&lt;T: Clone + std::fmt::Debug&gt;` | rust/lance/src/dataset/mem_wal/util.rs:27-27 | Reader handle for a WatchableOnceCell. |
| `pub fn new() -&gt; Self` | rust/lance/src/dataset/mem_wal/util.rs:33-33 | Create a new empty cell. |
| `pub fn write(&self, val: T)` | rust/lance/src/dataset/mem_wal/util.rs:41-41 | Write a value to the cell. |
| `pub fn reader(&self) -&gt; WatchableOnceCellReader&lt;T&gt;` | rust/lance/src/dataset/mem_wal/util.rs:52-52 | Get a reader handle for this cell. |
| `pub fn read(&self) -&gt; Option&lt;T&gt;` | rust/lance/src/dataset/mem_wal/util.rs:69-69 | Read the current value without waiting. |
| `pub async fn await_value(&mut self) -&gt; Option&lt;T&gt;` | rust/lance/src/dataset/mem_wal/util.rs:83-83 | Wait for a value to be written. |
| `pub fn bit_reverse_u64(n: u64) -&gt; u64` | rust/lance/src/dataset/mem_wal/util.rs:101-101 | Bit-reverse a 64-bit integer. |
| `pub fn bit_reversed_filename(id: u64, ext: &str) -&gt; String` | rust/lance/src/dataset/mem_wal/util.rs:114-114 | Generate a bit-reversed filename for a given ID. |
| `pub fn parse_bit_reversed_filename(filename: &str) -&gt; Option&lt;u64&gt;` | rust/lance/src/dataset/mem_wal/util.rs:125-125 | Parse a bit-reversed filename back to the original ID. |
| `pub fn mem_wal_path(base_path: &Path) -&gt; Path` | rust/lance/src/dataset/mem_wal/util.rs:157-157 | Path to the MemWAL root directory. |
| `pub fn shard_base_path(base_path: &Path, shard_id: &Uuid) -&gt; Path` | rust/lance/src/dataset/mem_wal/util.rs:164-164 | Base path for a shard within the MemWAL directory. |
| `pub fn shard_wal_path(base_path: &Path, shard_id: &Uuid) -&gt; Path` | rust/lance/src/dataset/mem_wal/util.rs:171-171 | Path to the WAL directory for a shard. |
| `pub fn shard_manifest_path(base_path: &Path, shard_id: &Uuid) -&gt; Path` | rust/lance/src/dataset/mem_wal/util.rs:178-178 | Path to the manifest directory for a shard. |
| `pub fn sstable_path(base_path: &Path, shard_id: &Uuid, random_hash: &str, generation: u64) -&gt; Path` | rust/lance/src/dataset/mem_wal/util.rs:185-185 | Path to an SSTable directory. |
| `pub const PK_INDEX_DIR: &str = "_pk_index";` | rust/lance/src/dataset/mem_wal/util.rs:192-192 | Subdirectory of an SSTable holding its standalone primary-key dedup index (a sidecar BTree, not registered in the manifest). Both the flush writer and the block-list probe join this onto the generation path. |
| `pub fn pk_index_path(gen_path: &Path) -&gt; Path` | rust/lance/src/dataset/mem_wal/util.rs:195-195 | Path to an SSTable's standalone primary-key dedup index. |
| `pub fn generate_random_hash() -&gt; String` | rust/lance/src/dataset/mem_wal/util.rs:200-200 | Generate an 8-character random hex string for SSTable directories. |
| `pub fn wal_entry_filename(wal_entry_position: u64) -&gt; String` | rust/lance/src/dataset/mem_wal/util.rs:211-211 | WAL entry filename. |
| `pub fn manifest_filename(version: u64) -&gt; String` | rust/lance/src/dataset/mem_wal/util.rs:218-218 | Shard manifest filename. |

<a id="source-rust-lance-src-dataset-mem-wal-wal-rs"></a>

## `rust/lance/src/dataset/mem_wal/wal.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const WRITER_EPOCH_KEY: &str = "writer_epoch";` | rust/lance/src/dataset/mem_wal/wal.rs:43-43 | Key for storing writer epoch in Arrow IPC file schema metadata. |
| `pub const GENERATION_KEY: &str = "generation";` | rust/lance/src/dataset/mem_wal/wal.rs:46-46 | The memtable generation an entry's batches belong to. Absent in WAL-only mode. |
| `pub const FENCE_SENTINEL_KEY: &str = "fence_sentinel";` | rust/lance/src/dataset/mem_wal/wal.rs:67-67 | Marks a WAL entry as a data-less fence sentinel (observability only; replay skips sentinels via their empty batch list). |
| `pub struct WalFlushFailure` | rust/lance/src/dataset/mem_wal/wal.rs:86-86 | Cloneable carrier that ferries a flush error across the async completion channels (`WalFlusher::terminal_error` and the per-flush `done` cell), since `lance_core::Error` is not `Clone`. Preserves the [`FenceReason`] so the typed [`Error::Fenced`] can be rebuilt rather than flattened to a string. |
| `pub fence_reason: Option&lt;FenceReason&gt;,` | rust/lance/src/dataset/mem_wal/wal.rs:88-88 | The fence reason if terminal; `None` for an ordinary flush error. |
| `pub message: String,` | rust/lance/src/dataset/mem_wal/wal.rs:90-90 | The error message carrying details about the flush failure. |
| `pub struct WriterCursors` | rust/lance/src/dataset/mem_wal/wal.rs:132-132 | The writer's cursors, shared by the WAL-append task, the index-apply task, every memtable's `IndexStore`, and every `put` waiting to become visible. |
| `pub fn new(durable_write: bool) -&gt; Self` | rust/lance/src/dataset/mem_wal/wal.rs:149-149 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn durable(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/wal.rs:161-161 | Writer-global count of WAL-durable batches. |
| `pub fn durable_write(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/wal.rs:165-165 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn visible_count(&self, indexed_count: usize, global_offset: usize) -&gt; usize` | rust/lance/src/dataset/mem_wal/wal.rs:184-184 | The visible prefix of one memtable, given its indexed prefix and its writer-global coordinate. |
| `pub struct BatchDurableWatcher` | rust/lance/src/dataset/mem_wal/wal.rs:231-231 | Blocks a `put` until its batches are visible: indexed, and — in durable mode — WAL-durable too. |
| `pub fn new( cursors: Arc&lt;WriterCursors&gt;, indexes: Option&lt;Arc&lt;IndexStore&gt;&gt;, target_indexed: usize, target_durable: usize, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/wal.rs:246-251 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn wait(&mut self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/wal.rs:282-282 | Wait until the write is visible, or until the writer poisons — in which case no cursor will ever reach the target, so surface the typed error rather than blocking forever. |
| `pub async fn wait_indexed(&mut self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/wal.rs:292-292 | Wait until the write is indexed, leaving durability outstanding. Pairs with `MemTableVisibility::Indexed` on the read side. |
| `pub fn is_durable(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/wal.rs:313-313 | Non-blocking check. |
| `pub struct WalEntry` | rust/lance/src/dataset/mem_wal/wal.rs:329-329 | A single WAL entry representing a batch of batches. |
| `pub position: u64,` | rust/lance/src/dataset/mem_wal/wal.rs:331-331 | WAL entry position (1-based, sequential — see `FIRST_WAL_ENTRY_POSITION`). |
| `pub writer_epoch: u64,` | rust/lance/src/dataset/mem_wal/wal.rs:333-333 | Writer epoch at the time of write. |
| `pub num_batches: usize,` | rust/lance/src/dataset/mem_wal/wal.rs:335-335 | Number of batches in this WAL entry. |
| `pub struct WalFlushResult` | rust/lance/src/dataset/mem_wal/wal.rs:342-342 | Result of a WAL flush. Append-only: index application runs on its own task (see `apply_index_range`), which records its own stats, so this no longer carries index-update timing or row counts. |
| `pub entry: Option&lt;WalEntry&gt;,` | rust/lance/src/dataset/mem_wal/wal.rs:344-344 | WAL entry that was written (if any). |
| `pub wal_io_duration: std::time::Duration,` | rust/lance/src/dataset/mem_wal/wal.rs:346-346 | Duration of WAL I/O operation. |
| `pub wal_bytes: usize,` | rust/lance/src/dataset/mem_wal/wal.rs:348-348 | Size of WAL data written in bytes. |
| `pub enum WalFlushSource` | rust/lance/src/dataset/mem_wal/wal.rs:353-353 | Source for a WAL flush — either a `BatchStore` range (MemTable mode) or a drainable in-memory pending queue (WAL-only mode). |
| `pub struct TriggerIndexApply` | rust/lance/src/dataset/mem_wal/wal.rs:395-395 | Message to trigger an index apply. |
| `pub batch_store: Arc&lt;BatchStore&gt;,` | rust/lance/src/dataset/mem_wal/wal.rs:396-396 | No standalone documentation summary; use the family contract and source entry. |
| `pub indexes: Arc&lt;IndexStore&gt;,` | rust/lance/src/dataset/mem_wal/wal.rs:397-397 | No standalone documentation summary; use the family contract and source entry. |
| `pub end_batch_position: usize,` | rust/lance/src/dataset/mem_wal/wal.rs:399-399 | Local exclusive end of the range to cover. |
| `pub struct IndexApplyStats` | rust/lance/src/dataset/mem_wal/wal.rs:414-414 | What an `apply_index_range` call actually indexed. `rows_indexed == 0` marks a routine coalesced no-op (the range was already covered) that must not be recorded as an index update. |
| `pub rows_indexed: usize,` | rust/lance/src/dataset/mem_wal/wal.rs:415-415 | No standalone documentation summary; use the family contract and source entry. |
| `pub duration: std::time::Duration,` | rust/lance/src/dataset/mem_wal/wal.rs:418-418 | Wall-clock time spent applying the range, including the thread-scheduling overhead of the blocking hand-off. |
| `pub async fn apply_index_range( cursors: &Arc&lt;WriterCursors&gt;, message: TriggerIndexApply, ) -&gt; Result&lt;IndexApplyStats&gt;` | rust/lance/src/dataset/mem_wal/wal.rs:433-436 | Apply a contiguous range of batches to a memtable's in-memory indexes. |
| `pub struct TriggerWalFlush` | rust/lance/src/dataset/mem_wal/wal.rs:494-494 | Message to trigger a WAL flush. |
| `pub source: WalFlushSource,` | rust/lance/src/dataset/mem_wal/wal.rs:495-495 | No standalone documentation summary; use the family contract and source entry. |
| `pub end_batch_position: usize,` | rust/lance/src/dataset/mem_wal/wal.rs:500-500 | End batch position (exclusive). For `BatchStore`, flush batches after the writer-global durable cursor up to this. For `WalOnly`, indicates the position the durability watermark must reach for callers waiting on this flush. Use `usize::MAX` to flush all pending batches. |
| `pub done: Option&lt;WatchableOnceCell&lt;std::result::Result&lt;WalFlushResult, WalFlushFailure&gt;&gt;&gt;,` | rust/lance/src/dataset/mem_wal/wal.rs:505-505 | Optional cell to write completion result. Uses `WalFlushFailure` (not `Error`) since `Error` doesn't implement `Clone`; the carrier preserves the fence reason so callers waiting on this cell still get a typed error. |
| `pub struct WalOnlyState` | rust/lance/src/dataset/mem_wal/wal.rs:522-522 | Drainable pending-batch queue used by `ShardWriter` in WAL-only mode. |
| `pub pending: StdMutex&lt;PendingWalBatches&gt;,` | rust/lance/src/dataset/mem_wal/wal.rs:523-523 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct PendingWalBatches` | rust/lance/src/dataset/mem_wal/wal.rs:527-527 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct WalOnlySnapshot` | rust/lance/src/dataset/mem_wal/wal.rs:547-547 | Snapshot of the pending queue used by the flush handler to attempt a WAL append without removing the batches first. On success the handler calls `WalOnlyState::commit_flushed(snapshot.count)` to remove the front of the queue; on failure the batches stay in the queue so a later flush can retry them, instead of being silently lost. |
| `pub batches: Vec&lt;RecordBatch&gt;,` | rust/lance/src/dataset/mem_wal/wal.rs:548-548 | No standalone documentation summary; use the family contract and source entry. |
| `pub count: usize,` | rust/lance/src/dataset/mem_wal/wal.rs:549-549 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn push(&self, batches: Vec&lt;RecordBatch&gt;) -&gt; std::ops::Range&lt;usize&gt;` | rust/lance/src/dataset/mem_wal/wal.rs:555-555 | Push batches and return the assigned `[start, end)` position range. Holds the lock for the entire push so position assignment is atomic. |
| `pub fn snapshot_pending(&self) -&gt; WalOnlySnapshot` | rust/lance/src/dataset/mem_wal/wal.rs:576-576 | Snapshot the pending queue for an attempted WAL append. Clones the `RecordBatch` handles (cheap; `RecordBatch` is `Arc`-backed) without removing them. The caller must call `commit_flushed(snapshot.count)` on success; on failure, the batches remain in the queue for the next flush attempt. |
| `pub fn commit_flushed(&self, count: usize)` | rust/lance/src/dataset/mem_wal/wal.rs:589-589 | Remove the first `count` batches from the pending queue and decrement `estimated_bytes` accordingly. Called by the flush handler after the WAL append for those batches succeeded. |
| `pub fn batch_count(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/wal.rs:603-603 | Pending batch count (for stats / triggers). |
| `pub fn queue_bytes(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/wal.rs:612-612 | Pending bytes (for size-based flush trigger). |
| `pub fn next_batch_position(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/wal.rs:622-622 | Position the next pushed batch will get. Equivalent to "total pushed since open." |
| `pub struct WalFlusher` | rust/lance/src/dataset/mem_wal/wal.rs:639-639 | Background WAL flush coordinator for `ShardWriter`. |
| `pub fn new(wal_appender: Arc&lt;WalAppender&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/wal.rs:662-662 | Create a new WAL flusher backed by an existing `WalAppender`. |
| `pub fn with_cursors(wal_appender: Arc&lt;WalAppender&gt;, cursors: Arc&lt;WriterCursors&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/wal.rs:668-668 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn cursors(&self) -&gt; &Arc&lt;WriterCursors&gt;` | rust/lance/src/dataset/mem_wal/wal.rs:681-681 | The writer's cursors, for the index-apply task and the memtables. |
| `pub fn set_flush_channel(&mut self, tx: mpsc::UnboundedSender&lt;TriggerWalFlush&gt;)` | rust/lance/src/dataset/mem_wal/wal.rs:686-686 | Set the flush channel for background flush handler. |
| `pub fn wal_appender(&self) -&gt; &Arc&lt;WalAppender&gt;` | rust/lance/src/dataset/mem_wal/wal.rs:691-691 | Underlying WAL appender (for tests and debug accessors). |
| `pub fn track_batch( &self, indexes: Option&lt;Arc&lt;IndexStore&gt;&gt;, target_indexed: usize, target_durable: usize, ) -&gt; BatchDurableWatcher` | rust/lance/src/dataset/mem_wal/wal.rs:708-713 | Track a batch for WAL durability. |
| `pub fn durable(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/wal.rs:724-724 | The writer-global WAL durability cursor: how many batches of this writer's batch sequence are durable. Exclusive count; 0 means none. |
| `pub fn check_poisoned(&self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/wal.rs:751-751 | Fail fast with the typed error if this writer has been fenced (by a peer or its own persistence failure). Both the read and write paths call this so a poisoned writer can neither diverge further nor serve a snapshot that replay will not reproduce. Recovery is to reopen and replay. |
| `pub fn durable_watermark(&self) -&gt; usize` | rust/lance/src/dataset/mem_wal/wal.rs:756-756 | Get the current durable watermark. |
| `pub fn wal_flush_watcher( &self, ) -&gt; Option&lt;super::util::WatchableOnceCellReader&lt;super::write::DurabilityResult&gt;&gt;` | rust/lance/src/dataset/mem_wal/wal.rs:764-766 | Get a watcher for WAL flush completion. |
| `pub fn trigger_flush( &self, source: WalFlushSource, end_batch_position: usize, done: Option&lt;WatchableOnceCell&lt;std::result::Result&lt;WalFlushResult, WalFlushFailure&gt;&gt;&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/wal.rs:795-800 | Trigger an immediate WAL flush. |
| `pub async fn flush( &self, source: &WalFlushSource, end_batch_position: usize, ) -&gt; Result&lt;WalFlushResult&gt;` | rust/lance/src/dataset/mem_wal/wal.rs:820-824 | Flush from the given source up to `end_batch_position`, optionally updating in-memory indexes in parallel with the WAL append. |
| `pub fn next_wal_entry_position(&self) -&gt; u64` | rust/lance/src/dataset/mem_wal/wal.rs:961-961 | Stats accessor: best-effort next-position hint, mirrored from the underlying appender. |
| `pub fn shard_id(&self) -&gt; Uuid` | rust/lance/src/dataset/mem_wal/wal.rs:966-966 | Get the shard ID. |
| `pub fn writer_epoch(&self) -&gt; u64` | rust/lance/src/dataset/mem_wal/wal.rs:971-971 | Get the writer epoch (delegated to the underlying appender). |
| `pub fn wal_entry_path(&self, wal_entry_position: u64) -&gt; Path` | rust/lance/src/dataset/mem_wal/wal.rs:976-976 | Get the path for a WAL entry. |
| `pub fn empty_flush_result() -&gt; WalFlushResult` | rust/lance/src/dataset/mem_wal/wal.rs:983-983 | Sentinel "nothing to flush" result, shared by `WalFlusher` and the `WalFlushHandler` early-out path in `write.rs`. |
| `pub struct WalEntryData` | rust/lance/src/dataset/mem_wal/wal.rs:993-993 | A WAL entry read from storage for replay. |
| `pub writer_epoch: u64,` | rust/lance/src/dataset/mem_wal/wal.rs:995-995 | Writer epoch from the WAL entry. |
| `pub batches: Vec&lt;RecordBatch&gt;,` | rust/lance/src/dataset/mem_wal/wal.rs:997-997 | Record batches from the WAL entry. |
| `pub async fn read(object_store: &ObjectStore, path: &Path) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/wal.rs:1012-1012 | Read a WAL entry from storage. |
| `pub struct WalRetryConfig` | rust/lance/src/dataset/mem_wal/wal.rs:1071-1071 | Retry policy for transient WAL persistence failures before the writer self-fences. On a non-conflict object-store error the appender retries the *same* WAL position up to `max_retries` times with exponential backoff from `base_delay`; exhausting the budget poisons the writer ([`Error::writer_poisoned`]). |
| `pub max_retries: usize,` | rust/lance/src/dataset/mem_wal/wal.rs:1074-1074 | Maximum number of retries for a transient WAL write failure before the writer self-fences. |
| `pub base_delay: Duration,` | rust/lance/src/dataset/mem_wal/wal.rs:1076-1076 | Base duration for exponential backoff between retry attempts. |
| `pub struct WalAppendResult` | rust/lance/src/dataset/mem_wal/wal.rs:1103-1103 | Result of appending a WAL entry. |
| `pub shard_id: Uuid,` | rust/lance/src/dataset/mem_wal/wal.rs:1104-1104 | No standalone documentation summary; use the family contract and source entry. |
| `pub entry_position: u64,` | rust/lance/src/dataset/mem_wal/wal.rs:1105-1105 | No standalone documentation summary; use the family contract and source entry. |
| `pub num_batches: usize,` | rust/lance/src/dataset/mem_wal/wal.rs:1106-1106 | No standalone documentation summary; use the family contract and source entry. |
| `pub num_rows: usize,` | rust/lance/src/dataset/mem_wal/wal.rs:1107-1107 | No standalone documentation summary; use the family contract and source entry. |
| `pub wal_bytes: usize,` | rust/lance/src/dataset/mem_wal/wal.rs:1108-1108 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct WalReadEntry` | rust/lance/src/dataset/mem_wal/wal.rs:1113-1113 | A WAL entry read from storage. |
| `pub shard_id: Uuid,` | rust/lance/src/dataset/mem_wal/wal.rs:1114-1114 | No standalone documentation summary; use the family contract and source entry. |
| `pub entry_position: u64,` | rust/lance/src/dataset/mem_wal/wal.rs:1115-1115 | No standalone documentation summary; use the family contract and source entry. |
| `pub writer_epoch: u64,` | rust/lance/src/dataset/mem_wal/wal.rs:1118-1118 | Writer epoch recorded in the WAL entry's IPC schema metadata. Replay logic uses this to fence-check against the current epoch. |
| `pub batches: Vec&lt;RecordBatch&gt;,` | rust/lance/src/dataset/mem_wal/wal.rs:1122-1122 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct WalAppender` | rust/lance/src/dataset/mem_wal/wal.rs:1130-1130 | WAL appender for a single MemWAL shard with epoch fencing. |
| `pub async fn open( object_store: Arc&lt;ObjectStore&gt;, base_path: Path, shard_id: Uuid, shard_spec_id: u32, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/wal.rs:1148-1153 | Open a WAL appender and claim a new writer epoch. |
| `pub fn shard_id(&self) -&gt; Uuid` | rust/lance/src/dataset/mem_wal/wal.rs:1209-1209 | Shard id. |
| `pub fn writer_epoch(&self) -&gt; u64` | rust/lance/src/dataset/mem_wal/wal.rs:1214-1214 | Writer epoch recorded in the shard manifest. |
| `pub async fn append(&self, batches: Vec&lt;RecordBatch&gt;) -&gt; Result&lt;WalAppendResult&gt;` | rust/lance/src/dataset/mem_wal/wal.rs:1245-1245 | Append batches as one durable WAL entry. |
| `pub async fn check_fenced(&self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/wal.rs:1355-1355 | Check that this writer's epoch has not been fenced. |
| `pub struct WalTailer` | rust/lance/src/dataset/mem_wal/wal.rs:1433-1433 | Ordered reader for MemWAL entries from a single shard. |
| `pub fn new(object_store: Arc&lt;ObjectStore&gt;, base_path: Path, shard_id: Uuid) -&gt; Self` | rust/lance/src/dataset/mem_wal/wal.rs:1445-1445 | Create a WAL tailer for a shard. |
| `pub async fn read_entry(&self, entry_position: u64) -&gt; Result&lt;Option&lt;WalReadEntry&gt;&gt;` | rust/lance/src/dataset/mem_wal/wal.rs:1463-1463 | Read a WAL entry at the given position. Returns `None` if no entry exists. On success, records the position as this tailer's cursor. |
| `pub async fn next_position(&self) -&gt; Result&lt;u64&gt;` | rust/lance/src/dataset/mem_wal/wal.rs:1505-1505 | Find the next append position (one past the latest entry). |
| `pub async fn first_position(&self) -&gt; Result&lt;u64&gt;` | rust/lance/src/dataset/mem_wal/wal.rs:1515-1515 | Find the earliest listed WAL position. |


<a id="source-rust-lance-src-dataset-mem-wal-write-rs"></a>

## `rust/lance/src/dataset/mem_wal/write.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use super::index::` | rust/lance/src/dataset/mem_wal/write.rs:40-40 | No standalone documentation summary; use the family contract and source entry. |
| `pub use super::memtable::CacheConfig;` | rust/lance/src/dataset/mem_wal/write.rs:41-41 | No standalone documentation summary; use the family contract and source entry. |
| `pub use super::memtable::MemTable;` | rust/lance/src/dataset/mem_wal/write.rs:42-42 | No standalone documentation summary; use the family contract and source entry. |
| `pub use super::memtable::batch_store::` | rust/lance/src/dataset/mem_wal/write.rs:43-43 | No standalone documentation summary; use the family contract and source entry. |
| `pub use super::memtable::flush::MemTableFlusher;` | rust/lance/src/dataset/mem_wal/write.rs:44-44 | No standalone documentation summary; use the family contract and source entry. |
| `pub use super::memtable::scanner::MemTableScanner;` | rust/lance/src/dataset/mem_wal/write.rs:45-45 | No standalone documentation summary; use the family contract and source entry. |
| `pub use super::util::` | rust/lance/src/dataset/mem_wal/write.rs:46-46 | No standalone documentation summary; use the family contract and source entry. |
| `pub use super::wal::` | rust/lance/src/dataset/mem_wal/write.rs:47-47 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ShardWriterConfig` | rust/lance/src/dataset/mem_wal/write.rs:72-72 | Configuration for a shard writer. |
| `pub shard_id: Uuid,` | rust/lance/src/dataset/mem_wal/write.rs:74-74 | Unique identifier for this shard (UUID v4). |
| `pub shard_spec_id: u32,` | rust/lance/src/dataset/mem_wal/write.rs:78-78 | Shard spec ID this shard was created with. A value of 0 indicates a manually-created shard not governed by any spec. |
| `pub durable_write: bool,` | rust/lance/src/dataset/mem_wal/write.rs:91-91 | Whether to wait for WAL flush before returning from writes. |
| `pub max_wal_buffer_size: usize,` | rust/lance/src/dataset/mem_wal/write.rs:98-98 | Maximum WAL buffer size in bytes before triggering a flush. |
| `pub max_wal_flush_interval: Option&lt;Duration&gt;,` | rust/lance/src/dataset/mem_wal/write.rs:106-106 | Time-based WAL flush interval. |
| `pub max_wal_persist_retries: usize,` | rust/lance/src/dataset/mem_wal/write.rs:112-112 | Times a failed WAL PUT is retried (same position, exponential backoff) before the writer self-fences. On exhaustion the writer is poisoned (`Error::writer_poisoned`) and must be reopened to replay. Absorbs transient errors beyond `object_store`'s own retries. Default: 3. |
| `pub wal_persist_retry_base_delay: Duration,` | rust/lance/src/dataset/mem_wal/write.rs:116-116 | Base backoff before the first WAL persistence retry; subsequent retries back off exponentially (capped). Default: 50ms. |
| `pub max_memtable_size: usize,` | rust/lance/src/dataset/mem_wal/write.rs:122-122 | Maximum MemTable size in bytes before triggering a flush to storage. |
| `pub max_memtable_rows: usize,` | rust/lance/src/dataset/mem_wal/write.rs:130-130 | Maximum number of rows in a MemTable. |
| `pub max_memtable_batches: usize,` | rust/lance/src/dataset/mem_wal/write.rs:138-138 | Maximum number of batches in a MemTable. |
| `pub manifest_scan_batch_size: usize,` | rust/lance/src/dataset/mem_wal/write.rs:144-144 | Batch size for parallel HEAD requests when scanning for manifest versions. |
| `pub max_unflushed_memtable_bytes: usize,` | rust/lance/src/dataset/mem_wal/write.rs:153-153 | Maximum unflushed bytes before applying backpressure. |
| `pub backpressure_log_interval: Duration,` | rust/lance/src/dataset/mem_wal/write.rs:163-163 | Interval for logging warnings when writes are blocked by backpressure. |
| `pub stats_log_interval: Option&lt;Duration&gt;,` | rust/lance/src/dataset/mem_wal/write.rs:171-171 | Interval for periodic stats logging. |
| `pub frozen_memtable_grace: Duration,` | rust/lance/src/dataset/mem_wal/write.rs:186-186 | How long a frozen memtable lingers in memory after its flush commits, before it is evicted and served only from the on-disk SSTable dataset. |
| `pub enable_memtable: bool,` | rust/lance/src/dataset/mem_wal/write.rs:211-211 | Whether to maintain an in-memory MemTable on top of the WAL. |
| `pub hnsw_params: HashMap&lt;String, HnswBuildParams&gt;,` | rust/lance/src/dataset/mem_wal/write.rs:226-226 | Per-index HNSW build-parameter overrides for maintained vector indexes, keyed by index name. |
| `pub index_overrides: HashMap&lt;String, Arc&lt;dyn std::any::Any + Send + Sync&gt;&gt;,` | rust/lance/src/dataset/mem_wal/write.rs:236-236 | Settings for the plugin maintaining an index, by index name, as the type the plugin reads through `ResolveContext::overrides`. Naming an index here and in `hnsw_params` is an error. Each writer passes its own: these are not recorded as writer defaults. |
| `pub mem_index_registry: MemIndexRegistry,` | rust/lance/src/dataset/mem_wal/write.rs:240-240 | The memtable index plugins this writer can maintain. Defaults to the kinds Lance builds in. |
| `pub warmer: Option&lt;Arc&lt;dyn SsTableWarmer&gt;&gt;,` | rust/lance/src/dataset/mem_wal/write.rs:245-245 | Optional warmer fired pre-commit for each new generation (zero cold reads on first query). Wired to the flusher; supplied by the consumer (e.g. the WAL pod). Default: `None`. |
| `pub observer: Option&lt;Arc&lt;dyn WalObserver&gt;&gt;,` | rust/lance/src/dataset/mem_wal/write.rs:251-251 | Optional sink for write-path events, currently flush latency. Wired to the flush handlers; supplied by the consumer (e.g. the WAL pod), which owns the aggregation Lance would otherwise have to pick for it. Default: `None`. |
| `pub store_params: Option&lt;ObjectStoreParams&gt;,` | rust/lance/src/dataset/mem_wal/write.rs:258-258 | Store params the base dataset was opened with, reused for the flusher's opens + writes (base + generations). Injected by `mem_wal_writer`; set these to the params of the dataset at `base_uri`, not to params bound to some other path — generation URIs are derived from them. Default: `None` (open by URI alone). |
| `pub session: Option&lt;Arc&lt;Session&gt;&gt;,` | rust/lance/src/dataset/mem_wal/write.rs:262-262 | Session for those opens, injected alongside `store_params`. Default: `None`. |
| `pub backpressure: Option&lt;Arc&lt;dyn BackpressureController&gt;&gt;,` | rust/lance/src/dataset/mem_wal/write.rs:274-274 | Admission control for every `put`, **replacing** lance's built-in per-shard valve ([`LocalBackpressureController`]). |
| `pub fn new(shard_id: Uuid) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:310-310 | Create a new configuration with the given shard ID. |
| `pub fn with_shard_spec_id(mut self, spec_id: u32) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:318-318 | Set the shard spec ID. |
| `pub fn with_durable_write(mut self, durable: bool) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:324-324 | Set durable writes mode. |
| `pub fn with_max_wal_buffer_size(mut self, size: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:330-330 | Set maximum WAL buffer size. |
| `pub fn with_max_wal_flush_interval(mut self, interval: Duration) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:336-336 | Set maximum flush interval. |
| `pub fn with_max_wal_persist_retries(mut self, retries: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:343-343 | Set the number of WAL persistence retries before the writer self-fences. See [`ShardWriterConfig::max_wal_persist_retries`]. |
| `pub fn with_wal_persist_retry_base_delay(mut self, delay: Duration) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:350-350 | Set the base backoff before the first WAL persistence retry. See [`ShardWriterConfig::wal_persist_retry_base_delay`]. |
| `pub fn with_max_memtable_size(mut self, size: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:356-356 | Set maximum MemTable size. |
| `pub fn with_max_memtable_rows(mut self, rows: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:362-362 | Set maximum MemTable rows for index pre-allocation. |
| `pub fn with_max_memtable_batches(mut self, batches: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:368-368 | Set maximum MemTable batches for batch store pre-allocation. |
| `pub fn with_manifest_scan_batch_size(mut self, size: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:374-374 | Set manifest scan batch size. |
| `pub fn with_max_unflushed_memtable_bytes(mut self, size: usize) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:380-380 | Set maximum unflushed bytes for backpressure. |
| `pub fn with_backpressure(mut self, controller: Arc&lt;dyn BackpressureController&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:387-387 | Replace the built-in per-shard valve with `controller`. See [`Self::backpressure`]. |
| `pub fn with_backpressure_log_interval(mut self, interval: Duration) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:393-393 | Set backpressure log interval. |
| `pub fn with_stats_log_interval(mut self, interval: Option&lt;Duration&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:399-399 | Set stats logging interval. Use None to disable periodic stats logging. |
| `pub fn with_frozen_memtable_grace(mut self, grace: Duration) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:406-406 | Set how long an SSTable lingers in memory before eviction. MUST exceed the maximum query elapsed time — see `frozen_memtable_grace`. |
| `pub fn with_enable_memtable(mut self, enable: bool) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:413-413 | Toggle the in-memory MemTable layer. See `enable_memtable` for the full WAL-only-mode contract. Defaults to `true`. |
| `pub fn with_mem_index_plugin(mut self, plugin: Arc&lt;dyn MemIndexPlugin&gt;) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/write.rs:420-420 | Register a memtable index plugin. Fails if another plugin already maintains the same base-table index. |
| `pub fn with_mem_index_registry(mut self, registry: MemIndexRegistry) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:426-426 | The plugins this writer maintains indexes with. |
| `pub fn with_index_override( mut self, index_name: impl Into&lt;String&gt;, settings: impl std::any::Any + Send + Sync, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:433-437 | Give the plugin maintaining `index_name` these settings, replacing any given before. |
| `pub fn with_hnsw_params( mut self, index_name: impl Into&lt;String&gt;, params: HnswBuildParams, ) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:448-452 | Override the HNSW build parameters for a maintained vector index. |
| `pub trait MessageHandler&lt;T: Send + Debug + 'static&gt;: Send` | rust/lance/src/dataset/mem_wal/write.rs:467-467 | Handler trait for processing messages in a background task. |
| `pub struct TaskExecutor` | rust/lance/src/dataset/mem_wal/write.rs:583-583 | Executor that manages multiple background tasks. |
| `pub fn new() -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:589-589 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn add_handler&lt;T: Send + Debug + 'static&gt;( &self, name: String, handler: Box&lt;dyn MessageHandler&lt;T&gt;&gt;, rx: mpsc::UnboundedReceiver&lt;T&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/write.rs:596-601 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn add_periodic&lt;F, Fut&gt;(&self, name: String, every: Duration, mut work: F) -&gt; Result&lt;()&gt; where F: FnMut() -&gt; Fut + Send + 'static, Fut: std::future::Future&lt;Output = ()&gt; + Send,` | rust/lance/src/dataset/mem_wal/write.rs:623-627 | Register periodic work that is **not** driven by a message. |
| `pub async fn shutdown_all(&self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/write.rs:657-657 | Cancel and join every handler registered by [`Self::add_handler`]. |
| `pub enum DurabilityResult` | rust/lance/src/dataset/mem_wal/write.rs:701-701 | Result of a durability notification. |
| `pub fn ok() -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:710-710 | Create a successful durability result. |
| `pub fn err(msg: impl Into&lt;String&gt;) -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:715-715 | Create a failed durability result. |
| `pub fn is_ok(&self) -&gt; bool` | rust/lance/src/dataset/mem_wal/write.rs:720-720 | Check if the result is durable. |
| `pub fn into_result(self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/write.rs:725-725 | Convert to a Result. |
| `pub type DurabilityWatcher = WatchableOnceCellReader&lt;DurabilityResult&gt;;` | rust/lance/src/dataset/mem_wal/write.rs:734-734 | Type alias for durability watchers. |
| `pub type DurabilityCell = WatchableOnceCell&lt;DurabilityResult&gt;;` | rust/lance/src/dataset/mem_wal/write.rs:737-737 | Type alias for durability cells. |
| `pub struct BackpressureStats` | rust/lance/src/dataset/mem_wal/write.rs:741-741 | Statistics for backpressure monitoring. |
| `pub fn new() -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:752-752 | Create new backpressure stats. |
| `pub fn record(&self, wait_ms: u64)` | rust/lance/src/dataset/mem_wal/write.rs:757-757 | Record a completed backpressure wait. |
| `pub fn begin_wait(&self) -&gt; BackpressureWaitGuard&lt;'_&gt;` | rust/lance/src/dataset/mem_wal/write.rs:765-765 | Count a writer as parked until the returned guard drops. Drop-based because the caller's future can be cancelled mid-wait, which would otherwise strand a waiter that never returns. |
| `pub fn count(&self) -&gt; u64` | rust/lance/src/dataset/mem_wal/write.rs:771-771 | Get the completed-wait count. |
| `pub fn total_wait_ms(&self) -&gt; u64` | rust/lance/src/dataset/mem_wal/write.rs:776-776 | Get the total time completed waits spent parked. |
| `pub fn snapshot(&self) -&gt; BackpressureStatsSnapshot` | rust/lance/src/dataset/mem_wal/write.rs:781-781 | Get a snapshot of all stats. |
| `pub struct BackpressureWaitGuard&lt;'a&gt;(&'a BackpressureStats);` | rust/lance/src/dataset/mem_wal/write.rs:792-792 | Keeps its writer counted in `active_count` for as long as it is held. |
| `pub struct BackpressureStatsSnapshot` | rust/lance/src/dataset/mem_wal/write.rs:802-802 | Snapshot of backpressure statistics. |
| `pub total_count: u64,` | rust/lance/src/dataset/mem_wal/write.rs:805-805 | Number of waits that have *finished*. A wait in progress is not counted here, and a cancelled one never is. |
| `pub total_wait_ms: u64,` | rust/lance/src/dataset/mem_wal/write.rs:808-808 | Total time finished waits spent parked (in milliseconds), on the same denominator as `total_count`. |
| `pub active_count: u64,` | rust/lance/src/dataset/mem_wal/write.rs:812-812 | Writers parked right now. This is the field that answers "am I being throttled at this instant" — the totals only move once a wait ends, so they read zero throughout a first, still-ongoing stall. |
| `pub struct ShardMemory` | rust/lance/src/dataset/mem_wal/write.rs:826-826 | A **live** view of what one shard is holding in memory. |
| `pub enum Drain` | rust/lance/src/dataset/mem_wal/write.rs:1062-1062 | What can bring a shard back under its ceiling while a writer waits. |
| `pub trait BackpressureController: Send + Sync + Debug` | rust/lance/src/dataset/mem_wal/write.rs:1097-1097 | Admission control for [`ShardWriter::put`], consulted before each write. |
| `pub struct LocalBackpressureController` | rust/lance/src/dataset/mem_wal/write.rs:1160-1160 | The per-shard memtable valve: lance's default when nothing is injected. |
| `pub fn stats(&self) -&gt; &Arc&lt;BackpressureStats&gt;` | rust/lance/src/dataset/mem_wal/write.rs:1176-1176 | Get backpressure stats. |
| `pub struct WriteResult` | rust/lance/src/dataset/mem_wal/write.rs:1281-1281 | Result of a write operation. |
| `pub batch_positions: std::ops::Range&lt;usize&gt;,` | rust/lance/src/dataset/mem_wal/write.rs:1284-1284 | Range of batch positions [start, end) for inserted batches. For a single batch, this is [pos, pos+1). |
| `pub struct ShardWriter` | rust/lance/src/dataset/mem_wal/write.rs:2648-2648 | Main writer for a MemWAL shard. |
| `pub async fn open( object_store: Arc&lt;ObjectStore&gt;, base_path: Path, base_uri: impl Into&lt;String&gt;, config: ShardWriterConfig, schema: Arc&lt;ArrowSchema&gt;, index_specs: Vec&lt;MemIndexSpec&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/mem_wal/write.rs:2668-2675 | Open or create a ShardWriter. |
| `pub async fn put(&self, batches: Vec&lt;RecordBatch&gt;) -&gt; Result&lt;WriteResult&gt;` | rust/lance/src/dataset/mem_wal/write.rs:3224-3224 | Write record batches to the shard. |
| `pub async fn delete(&self, keys: Vec&lt;RecordBatch&gt;) -&gt; Result&lt;WriteResult&gt;` | rust/lance/src/dataset/mem_wal/write.rs:3272-3272 | Delete rows by primary key. |
| `pub async fn delete_no_wait( &self, keys: Vec&lt;RecordBatch&gt;, ) -&gt; Result&lt;(WriteResult, Option&lt;BatchDurableWatcher&gt;)&gt;` | rust/lance/src/dataset/mem_wal/write.rs:3289-3292 | Like [`Self::delete`], but returns the durability watcher *without* awaiting it — the tombstone lands in the in-memory tier the instant this returns, but the index-driven LSM read only folds it once the watcher resolves the flush (which advances the visibility watermark and updates the PK index). The delete analog of [`Self::put_no_wait`], so a caller can hold an external lock across only the in-memory insert and await durability after releasing it. MemTable mode only. |
| `pub async fn put_no_wait( &self, batches: Vec&lt;RecordBatch&gt;, ) -&gt; Result&lt;(WriteResult, Option&lt;BatchDurableWatcher&gt;)&gt;` | rust/lance/src/dataset/mem_wal/write.rs:3336-3339 | Like [`Self::put`], but returns the durability watcher *without* awaiting it. The row lands in the in-memory tier the instant this returns, but the index-driven LSM read only surfaces it once the watcher resolves the flush (which advances the visibility watermark and updates the indexes); the caller awaits durability via the watcher (`None` when `durable_write` is off). |
| `pub fn stats(&self) -&gt; WriteStatsSnapshot` | rust/lance/src/dataset/mem_wal/write.rs:3698-3698 | Get a snapshot of current write statistics. |
| `pub fn stats_handle(&self) -&gt; SharedWriteStats` | rust/lance/src/dataset/mem_wal/write.rs:3703-3703 | Get the shared stats handle (for external monitoring). |
| `pub fn memory(&self) -&gt; ShardMemory` | rust/lance/src/dataset/mem_wal/write.rs:3717-3717 | What this writer is holding in memory, in both write modes. |
| `pub async fn manifest(&self) -&gt; Result&lt;Option&lt;ShardManifest&gt;&gt;` | rust/lance/src/dataset/mem_wal/write.rs:3731-3731 | Get the current shard manifest. |
| `pub fn manifest_store(&self) -&gt; Arc&lt;ShardManifestStore&gt;` | rust/lance/src/dataset/mem_wal/write.rs:3740-3740 | The shard's manifest store. |
| `pub fn epoch(&self) -&gt; u64` | rust/lance/src/dataset/mem_wal/write.rs:3745-3745 | Get the writer's epoch. |
| `pub fn config(&self) -&gt; &ShardWriterConfig` | rust/lance/src/dataset/mem_wal/write.rs:3750-3750 | The configuration this writer was opened with. |
| `pub async fn maintained_index_names(&self) -&gt; Vec&lt;String&gt;` | rust/lance/src/dataset/mem_wal/write.rs:3759-3759 | The indexes memtables are currently built with, sorted. |
| `pub fn shard_id(&self) -&gt; Uuid` | rust/lance/src/dataset/mem_wal/write.rs:3778-3778 | Get the shard ID. |
| `pub async fn check_fenced(&self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/write.rs:3783-3783 | Return `Err` if a successor writer has claimed a higher epoch. |
| `pub async fn memtable_stats(&self) -&gt; Result&lt;MemTableStats&gt;` | rust/lance/src/dataset/mem_wal/write.rs:3793-3793 | Get current MemTable statistics. Returns an error in WAL-only mode (no MemTable exists). |
| `pub fn backpressure_stats(&self) -&gt; BackpressureStatsSnapshot` | rust/lance/src/dataset/mem_wal/write.rs:3817-3817 | Snapshot of the backpressure counters. Both writer modes answer, so a caller asking "am I throttled" need not know which mode it is in. |
| `pub async fn scan(&self) -&gt; Result&lt;MemTableScanner&gt;` | rust/lance/src/dataset/mem_wal/write.rs:3833-3833 | Create a scanner for querying the current MemTable data. |
| `pub async fn active_memtable_ref( &self, ) -&gt; Result&lt;crate::dataset::mem_wal::scanner::InMemoryMemTableRef&gt;` | rust/lance/src/dataset/mem_wal/write.rs:3845-3847 | A handle to just the active memtable, for unified LSM scanning. Prefer [`Self::in_memory_memtable_refs`] on the read path — it also carries frozen-awaiting-flush generations. |
| `pub async fn in_memory_memtable_refs( &self, ) -&gt; Result&lt;crate::dataset::mem_wal::scanner::InMemoryMemTables&gt;` | rust/lance/src/dataset/mem_wal/write.rs:3861-3863 | The active memtable plus every frozen-awaiting-flush memtable, captured atomically under one `state.read()` (no torn freeze). Mirrors `WriterState { memtable, frozen_memtables }`. The WAL read path uses this instead of [`Self::active_memtable_ref`] so a concurrent reader sees no hole while a flush drains. |
| `pub fn wal_stats(&self) -&gt; WalStats` | rust/lance/src/dataset/mem_wal/write.rs:3889-3889 | Get WAL statistics. |
| `pub async fn evolve_schema( &self, schema: Arc&lt;ArrowSchema&gt;, index_specs: Vec&lt;MemIndexSpec&gt;, ) -&gt; Result&lt;Option&lt;SealFence&gt;&gt;` | rust/lance/src/dataset/mem_wal/write.rs:3989-3993 | Switch this writer to `schema` and `index_specs` without reopening it. |
| `pub async fn force_seal_active(&self) -&gt; Result&lt;SealFence&gt;` | rust/lance/src/dataset/mem_wal/write.rs:4019-4019 | Seal the active memtable so it's queued for L0 flush. Errors in WAL-only mode or if this writer has been fenced by a successor. |
| `pub async fn replace_index_configs( &self, specs: Vec&lt;MemIndexSpec&gt;, ) -&gt; Result&lt;Option&lt;SealFence&gt;&gt;` | rust/lance/src/dataset/mem_wal/write.rs:4068-4071 | Replace the indexes memtables are built with, and seal so the next one carries them. |
| `pub async fn wait_for_flush_drain(&self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/write.rs:4096-4096 | Block until every frozen memtable in the L0 flush queue has landed and been recorded in the manifest. Does not wait on the active memtable — call [`Self::force_seal_active`] first if you want everything-on-disk. Errors in WAL-only mode, or if any awaited flush reports `DurabilityResult::Failed`. |
| `pub async fn abort(&self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/write.rs:4149-4149 | Abort the writer without flushing. |
| `pub async fn close(self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/write.rs:4214-4214 | Close the writer gracefully. |
| `pub struct MemTableStats` | rust/lance/src/dataset/mem_wal/write.rs:4357-4357 | MemTable statistics: rows, generation, and what the memtable still owes the WAL. |
| `pub row_count: usize,` | rust/lance/src/dataset/mem_wal/write.rs:4358-4358 | No standalone documentation summary; use the family contract and source entry. |
| `pub batch_count: usize,` | rust/lance/src/dataset/mem_wal/write.rs:4359-4359 | No standalone documentation summary; use the family contract and source entry. |
| `pub generation: u64,` | rust/lance/src/dataset/mem_wal/write.rs:4360-4360 | No standalone documentation summary; use the family contract and source entry. |
| `pub max_buffered_batch_position: Option&lt;usize&gt;,` | rust/lance/src/dataset/mem_wal/write.rs:4361-4361 | No standalone documentation summary; use the family contract and source entry. |
| `pub durable_batch_count: usize,` | rust/lance/src/dataset/mem_wal/write.rs:4365-4365 | Writer-global count of WAL-durable batches. Exclusive: 0 means none. Compare against `global_offset + batch_count` to see what this memtable still owes the WAL. |
| `pub global_offset: usize,` | rust/lance/src/dataset/mem_wal/write.rs:4367-4367 | Writer-global coordinate of this memtable's batch 0. |
| `pub pending_wal_start_batch_position: Option&lt;usize&gt;,` | rust/lance/src/dataset/mem_wal/write.rs:4368-4368 | No standalone documentation summary; use the family contract and source entry. |
| `pub pending_wal_end_batch_position: Option&lt;usize&gt;,` | rust/lance/src/dataset/mem_wal/write.rs:4369-4369 | No standalone documentation summary; use the family contract and source entry. |
| `pub pending_wal_batch_count: usize,` | rust/lance/src/dataset/mem_wal/write.rs:4370-4370 | No standalone documentation summary; use the family contract and source entry. |
| `pub pending_wal_row_count: usize,` | rust/lance/src/dataset/mem_wal/write.rs:4371-4371 | No standalone documentation summary; use the family contract and source entry. |
| `pub pending_wal_estimated_bytes: usize,` | rust/lance/src/dataset/mem_wal/write.rs:4372-4372 | No standalone documentation summary; use the family contract and source entry. |
| `pub frozen_count: usize,` | rust/lance/src/dataset/mem_wal/write.rs:4375-4375 | Frozen memtables in the read view: sealed-awaiting-flush, plus flushed ones still inside `frozen_memtable_grace`. |
| `pub struct WalStats` | rust/lance/src/dataset/mem_wal/write.rs:4380-4380 | WAL statistics. |
| `pub next_wal_entry_position: u64,` | rust/lance/src/dataset/mem_wal/write.rs:4382-4382 | Next WAL entry position to be used. |
| `pub struct SealFence` | rust/lance/src/dataset/mem_wal/write.rs:4398-4398 | The L0 flushes outstanding when [`ShardWriter::force_seal_active`] returned — the exact predicate for "everything written before that call is in L0". |
| `pub fn sealed_generation(&self) -&gt; Option&lt;u64&gt;` | rust/lance/src/dataset/mem_wal/write.rs:4408-4408 | The generation the seal froze, or `None` when the active memtable was empty (a no-op seal). Independent of what the fence covers: an empty active memtable says nothing about generations frozen earlier and still awaiting flush, which the fence still waits on. |
| `pub async fn wait(self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/mem_wal/write.rs:4416-4416 | Block until every flush this fence covers has landed in L0. |
| `pub struct WriteStats` | rust/lance/src/dataset/mem_wal/write.rs:5002-5002 | Write performance statistics. |
| `pub struct WriteStatsSnapshot` | rust/lance/src/dataset/mem_wal/write.rs:5027-5027 | Snapshot of write statistics at a point in time. |
| `pub put_count: u64,` | rust/lance/src/dataset/mem_wal/write.rs:5028-5028 | No standalone documentation summary; use the family contract and source entry. |
| `pub put_time: Duration,` | rust/lance/src/dataset/mem_wal/write.rs:5029-5029 | No standalone documentation summary; use the family contract and source entry. |
| `pub wal_flush_count: u64,` | rust/lance/src/dataset/mem_wal/write.rs:5031-5031 | No standalone documentation summary; use the family contract and source entry. |
| `pub wal_flush_time: Duration,` | rust/lance/src/dataset/mem_wal/write.rs:5032-5032 | No standalone documentation summary; use the family contract and source entry. |
| `pub wal_flush_bytes: u64,` | rust/lance/src/dataset/mem_wal/write.rs:5033-5033 | No standalone documentation summary; use the family contract and source entry. |
| `pub wal_io_time: Duration,` | rust/lance/src/dataset/mem_wal/write.rs:5036-5036 | No standalone documentation summary; use the family contract and source entry. |
| `pub wal_io_count: u64,` | rust/lance/src/dataset/mem_wal/write.rs:5037-5037 | No standalone documentation summary; use the family contract and source entry. |
| `pub index_update_time: Duration,` | rust/lance/src/dataset/mem_wal/write.rs:5038-5038 | No standalone documentation summary; use the family contract and source entry. |
| `pub index_update_count: u64,` | rust/lance/src/dataset/mem_wal/write.rs:5039-5039 | No standalone documentation summary; use the family contract and source entry. |
| `pub index_update_rows: u64,` | rust/lance/src/dataset/mem_wal/write.rs:5040-5040 | No standalone documentation summary; use the family contract and source entry. |
| `pub memtable_flush_count: u64,` | rust/lance/src/dataset/mem_wal/write.rs:5042-5042 | No standalone documentation summary; use the family contract and source entry. |
| `pub memtable_flush_time: Duration,` | rust/lance/src/dataset/mem_wal/write.rs:5043-5043 | No standalone documentation summary; use the family contract and source entry. |
| `pub memtable_flush_rows: u64,` | rust/lance/src/dataset/mem_wal/write.rs:5044-5044 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new() -&gt; Self` | rust/lance/src/dataset/mem_wal/write.rs:5049-5049 | Create a new stats collector. |
| `pub fn record_put(&self, duration: Duration)` | rust/lance/src/dataset/mem_wal/write.rs:5054-5054 | Record a put operation. |
| `pub fn record_wal_flush(&self, duration: Duration, bytes: usize)` | rust/lance/src/dataset/mem_wal/write.rs:5061-5061 | Record a WAL flush operation (total time including parallel I/O and index). |
| `pub fn record_wal_io(&self, duration: Duration)` | rust/lance/src/dataset/mem_wal/write.rs:5070-5070 | Record WAL I/O duration (sub-component of WAL flush). |
| `pub fn record_index_update(&self, duration: Duration, rows: usize)` | rust/lance/src/dataset/mem_wal/write.rs:5077-5077 | Record index update duration (sub-component of WAL flush). |
| `pub fn record_memtable_flush(&self, duration: Duration, rows: usize)` | rust/lance/src/dataset/mem_wal/write.rs:5086-5086 | Record a MemTable flush operation. |
| `pub fn snapshot(&self) -&gt; WriteStatsSnapshot` | rust/lance/src/dataset/mem_wal/write.rs:5095-5095 | Get a snapshot of current statistics. |
| `pub fn reset(&self)` | rust/lance/src/dataset/mem_wal/write.rs:5121-5121 | Reset all statistics. |
| `pub fn avg_put_latency(&self) -&gt; Option&lt;Duration&gt;` | rust/lance/src/dataset/mem_wal/write.rs:5143-5143 | Get average put latency. |
| `pub fn put_throughput(&self) -&gt; f64` | rust/lance/src/dataset/mem_wal/write.rs:5152-5152 | Get put throughput (puts per second based on time spent in puts). |
| `pub fn avg_wal_flush_latency(&self) -&gt; Option&lt;Duration&gt;` | rust/lance/src/dataset/mem_wal/write.rs:5161-5161 | Get average WAL flush latency. |
| `pub fn avg_wal_flush_bytes(&self) -&gt; Option&lt;u64&gt;` | rust/lance/src/dataset/mem_wal/write.rs:5170-5170 | Get average WAL flush size in bytes. |
| `pub fn wal_throughput_bytes(&self) -&gt; f64` | rust/lance/src/dataset/mem_wal/write.rs:5175-5175 | Get WAL write throughput (bytes per second based on WAL flush time). |
| `pub fn avg_wal_io_latency(&self) -&gt; Option&lt;Duration&gt;` | rust/lance/src/dataset/mem_wal/write.rs:5184-5184 | Get average WAL I/O latency. |
| `pub fn avg_index_update_latency(&self) -&gt; Option&lt;Duration&gt;` | rust/lance/src/dataset/mem_wal/write.rs:5193-5193 | Get average index update latency. |
| `pub fn avg_index_update_rows(&self) -&gt; Option&lt;u64&gt;` | rust/lance/src/dataset/mem_wal/write.rs:5202-5202 | Get average rows per index update. |
| `pub fn avg_memtable_flush_latency(&self) -&gt; Option&lt;Duration&gt;` | rust/lance/src/dataset/mem_wal/write.rs:5207-5207 | Get average MemTable flush latency. |
| `pub fn avg_memtable_flush_rows(&self) -&gt; Option&lt;u64&gt;` | rust/lance/src/dataset/mem_wal/write.rs:5216-5216 | Get average MemTable flush size in rows. |
| `pub fn log_summary(&self, prefix: &str)` | rust/lance/src/dataset/mem_wal/write.rs:5222-5222 | Log stats summary using tracing (for structured telemetry). |
| `pub fn log_wal_breakdown(&self, prefix: &str)` | rust/lance/src/dataset/mem_wal/write.rs:5243-5243 | Log detailed WAL flush breakdown (WAL I/O vs index update) using tracing. |
| `pub type SharedWriteStats = Arc&lt;WriteStats&gt;;` | rust/lance/src/dataset/mem_wal/write.rs:5263-5263 | Shared stats handle for use across components. |
| `pub fn new_shared_stats() -&gt; SharedWriteStats` | rust/lance/src/dataset/mem_wal/write.rs:5266-5266 | Create a new shared stats collector. |


<a id="source-rust-lance-src-dataset-metadata-rs"></a>

## `rust/lance/src/dataset/metadata.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub async fn execute_metadata_update(dataset: &mut Dataset, operation: Operation) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/metadata.rs:16-16 | Execute a metadata update operation on a dataset. This is moved from Dataset::update_op to keep metadata logic in this module. |
| `pub struct UpdateMetadataBuilder&lt;'a&gt;` | rust/lance/src/dataset/metadata.rs:26-26 | Builder for metadata update operations that supports optional replace semantics. This provides backward compatibility while adding new functionality. |
| `pub enum MetadataType` | rust/lance/src/dataset/metadata.rs:34-34 | Type of metadata being updated |
| `pub fn new( dataset: &'a mut Dataset, values: impl IntoIterator&lt;Item = impl Into&lt;UpdateMapEntry&gt;&gt;, metadata_type: MetadataType, ) -&gt; Self` | rust/lance/src/dataset/metadata.rs:41-45 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn replace(mut self) -&gt; Self` | rust/lance/src/dataset/metadata.rs:56-56 | Set the replace flag to true, causing the entire metadata map to be replaced instead of merged. |
| `pub struct UpdateFieldMetadataBuilder&lt;'a&gt;` | rust/lance/src/dataset/metadata.rs:113-113 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(dataset: &'a mut Dataset) -&gt; Self` | rust/lance/src/dataset/metadata.rs:119-119 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn update&lt;'b&gt;( self, field: impl Into&lt;FieldRef&lt;'b&gt;&gt; + 'b, values: impl IntoIterator&lt;Item = impl Into&lt;UpdateMapEntry&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/metadata.rs:140-144 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn replace&lt;'b&gt;( self, field: impl Into&lt;FieldRef&lt;'b&gt;&gt; + 'b, values: impl IntoIterator&lt;Item = impl Into&lt;UpdateMapEntry&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/metadata.rs:148-152 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-optimize-rs"></a>

## `rust/lance/src/dataset/optimize.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod remapping;` | rust/lance/src/dataset/optimize.rs:149-149 | No standalone documentation summary; use the family contract and source entry. |
| `pub use remapping::` | rust/lance/src/dataset/optimize.rs:153-153 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum CompactionMode` | rust/lance/src/dataset/optimize.rs:157-157 | Controls how data is rewritten during compaction. |
| `pub enum IndexRemapMode` | rust/lance/src/dataset/optimize.rs:185-185 | Controls how the old-to-new row-address mapping is built when remapping indices during compaction. |
| `pub struct CompactionOptions` | rust/lance/src/dataset/optimize.rs:217-217 | Options to be passed to [compact_files]. |
| `pub target_rows_per_fragment: usize,` | rust/lance/src/dataset/optimize.rs:223-223 | Target number of rows per file. Defaults to 1 million. |
| `pub max_rows_per_group: usize,` | rust/lance/src/dataset/optimize.rs:228-228 | Max number of rows per group |
| `pub max_bytes_per_file: Option&lt;usize&gt;,` | rust/lance/src/dataset/optimize.rs:235-235 | Max number of bytes per file |
| `pub materialize_deletions: bool,` | rust/lance/src/dataset/optimize.rs:238-238 | Whether to compact fragments with deletions so there are no deletions. Defaults to true. |
| `pub materialize_deletions_threshold: f32,` | rust/lance/src/dataset/optimize.rs:243-243 | The fraction of rows that need to be deleted in a fragment before materializing the deletions. Defaults to 10% (0.1). Setting to zero (or lower) will materialize deletions for all fragments with deletions. Setting above 1.0 will never materialize deletions. |
| `pub num_threads: Option&lt;usize&gt;,` | rust/lance/src/dataset/optimize.rs:247-247 | The number of threads to use (how many compaction tasks to run in parallel). Defaults to the number of compute-intensive CPUs. Not used when running tasks manually using [`plan_compaction`] |
| `pub batch_size: Option&lt;usize&gt;,` | rust/lance/src/dataset/optimize.rs:251-251 | The batch size to use when scanning the input fragments. If not specified then the default (see [`crate::dataset::Scanner::batch_size`]) will be used. |
| `pub io_buffer_size: Option&lt;u64&gt;,` | rust/lance/src/dataset/optimize.rs:258-258 | The number of bytes to allow to queue up in the I/O buffer when scanning the input fragments. If not specified then the default (see [`crate::dataset::Scanner::io_buffer_size`]) will be used. |
| `pub defer_index_remap: bool,` | rust/lance/src/dataset/optimize.rs:262-262 | Whether to defer remapping indices during compaction. If true, indices will not be remapped during this compaction operation. Instead, the fragment reuse index is updated and will be used to perform remapping later. |
| `pub index_remap_mode: IndexRemapMode,` | rust/lance/src/dataset/optimize.rs:266-266 | How the old-to-new row-address mapping used to remap indices is built. Defaults to [`IndexRemapMode::Direct`]. |
| `pub compaction_mode: Option&lt;CompactionMode&gt;,` | rust/lance/src/dataset/optimize.rs:271-271 | The compaction mode to use. When set, this takes priority over the deprecated `enable_binary_copy` and `enable_binary_copy_force` fields. |
| `pub enable_binary_copy: bool,` | rust/lance/src/dataset/optimize.rs:274-274 | Deprecated: use `compaction_mode` instead. |
| `pub enable_binary_copy_force: bool,` | rust/lance/src/dataset/optimize.rs:277-277 | Deprecated: use `compaction_mode` instead. |
| `pub binary_copy_read_batch_bytes: Option&lt;usize&gt;,` | rust/lance/src/dataset/optimize.rs:281-281 | The batch size in bytes for reading during binary copy operations. Controls how much data is read at once when performing binary copy. Defaults to 16MB (16 * 1024 * 1024). |
| `pub max_source_fragments: Option&lt;usize&gt;,` | rust/lance/src/dataset/optimize.rs:287-287 | Maximum number of source fragments to compact in a single run. When set, tasks are included in the plan until adding the next task would exceed this limit. This allows for incremental compaction (e.g., compact 20 fragments at a time). Defaults to `None` (no limit, all eligible fragments are compacted). |
| `pub max_source_rows: Option&lt;usize&gt;,` | rust/lance/src/dataset/optimize.rs:293-293 | Maximum number of source rows to compact in a single run. Rows are counted as live rows (physical rows minus soft-deleted rows). When set, tasks are included in the plan until adding the next task would exceed this limit. Defaults to `None` (no limit). |
| `pub max_source_bytes: Option&lt;u64&gt;,` | rust/lance/src/dataset/optimize.rs:302-302 | Maximum number of source bytes to compact in a single run, measured as the total size of the source fragments' data and overlay files. When set, tasks are included in the plan until adding the next task would exceed this limit. Blob v2 payloads live in separate blob files and are not counted, so this is not a cap on total compaction I/O for datasets with blob columns. Defaults to `None` (no limit). |
| `pub excluded_fragment_ids: Vec&lt;u32&gt;,` | rust/lance/src/dataset/optimize.rs:310-310 | Fragment IDs to exclude from compaction planning. |
| `pub max_overlays_per_fragment: Option&lt;usize&gt;,` | rust/lance/src/dataset/optimize.rs:319-319 | Maximum number of data overlay files a fragment may carry before it is fully compacted. When set, any fragment with more than this many overlays is rewritten into a fresh fragment with its overlays (and deletions) materialized into the base data, dropping the fragment from any index left stale by those overlays. Defaults to `Some(10)`. Set to `Some(0)` to compact every fragment that carries any overlay, or `None` to disable the overlay-count trigger entirely. |
| `pub data_storage_version: Option&lt;LanceFileVersion&gt;,` | rust/lance/src/dataset/optimize.rs:334-334 | Exact data file version for compacted output. |
| `pub transaction_properties: Option&lt;Arc&lt;HashMap&lt;String, String&gt;&gt;&gt;,` | rust/lance/src/dataset/optimize.rs:341-341 | Transaction properties to store with this commit. |
| `pub const COMPACTION_CONFIG_PREFIX: &str = "lance.compaction.";` | rust/lance/src/dataset/optimize.rs:375-375 | Config key prefix for compaction options stored in the dataset manifest. |
| `pub fn from_dataset_config(config: &HashMap&lt;String, String&gt;) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/optimize.rs:399-399 | Create [`CompactionOptions`] by starting with defaults and applying any overrides found in the dataset manifest config. |
| `pub fn apply_dataset_config(&mut self, config: &HashMap&lt;String, String&gt;) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/optimize.rs:409-409 | Apply overrides from the dataset manifest config to this options struct. |
| `pub fn validate(&mut self) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/optimize.rs:554-554 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn compaction_mode(&self) -&gt; CompactionMode` | rust/lance/src/dataset/optimize.rs:581-581 | Returns the effective [`CompactionMode`], preferring the new `compaction_mode` field and falling back to the deprecated boolean fields for backwards compatibility. |
| `pub fn transaction_properties(mut self, properties: HashMap&lt;String, String&gt;) -&gt; Self` | rust/lance/src/dataset/optimize.rs:594-594 | Set transaction properties to store in the commit manifest. |
| `pub struct CompactionMetrics` | rust/lance/src/dataset/optimize.rs:753-753 | Metrics returned by [compact_files]. |
| `pub fragments_removed: usize,` | rust/lance/src/dataset/optimize.rs:755-755 | The number of fragments that have been overwritten. |
| `pub fragments_added: usize,` | rust/lance/src/dataset/optimize.rs:757-757 | The number of new fragments that have been added. |
| `pub files_removed: usize,` | rust/lance/src/dataset/optimize.rs:759-759 | The number of files that have been removed, including deletion files. |
| `pub files_added: usize,` | rust/lance/src/dataset/optimize.rs:762-762 | The number of files that have been added, which is always equal to the number of fragments. |
| `pub trait CompactionPlanner: Send + Sync` | rust/lance/src/dataset/optimize.rs:779-779 | Trait for implementing custom compaction planning strategies. |
| `pub struct DefaultCompactionPlanner` | rust/lance/src/dataset/optimize.rs:800-800 | Formulate a plan to compact the files in a dataset |
| `pub fn new(mut options: CompactionOptions) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/optimize.rs:806-806 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn compact_files( dataset: &mut Dataset, options: CompactionOptions, remap_options: Option&lt;Arc&lt;dyn IndexRemapperOptions&gt;&gt;, // These will be deprecated later ) -&gt; Result&lt;CompactionMetrics&gt;` | rust/lance/src/dataset/optimize.rs:1028-1032 | Compacts the files in the dataset without reordering them. |
| `pub async fn compact_files_with_planner( dataset: &mut Dataset, remap_options: Option&lt;Arc&lt;dyn IndexRemapperOptions&gt;&gt;, // These will be deprecated later planner: &dyn CompactionPlanner, ) -&gt; Result&lt;CompactionMetrics&gt;` | rust/lance/src/dataset/optimize.rs:1038-1042 | No standalone documentation summary; use the family contract and source entry. |
| `pub physical_rows: usize,` | rust/lance/src/dataset/optimize.rs:1099-1099 | The number of original rows in the fragment |
| `pub num_deletions: usize,` | rust/lance/src/dataset/optimize.rs:1101-1101 | The number of rows that have been deleted |
| `pub struct CompactionPlan` | rust/lance/src/dataset/optimize.rs:1277-1277 | A plan for what groups of fragments to compact. |
| `pub tasks: Vec&lt;TaskData&gt;,` | rust/lance/src/dataset/optimize.rs:1278-1278 | No standalone documentation summary; use the family contract and source entry. |
| `pub read_version: u64,` | rust/lance/src/dataset/optimize.rs:1279-1279 | No standalone documentation summary; use the family contract and source entry. |
| `pub options: CompactionOptions,` | rust/lance/src/dataset/optimize.rs:1280-1280 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn compaction_tasks(&self) -&gt; impl Iterator&lt;Item = CompactionTask&gt; + '_` | rust/lance/src/dataset/optimize.rs:1285-1285 | Retrieve standalone tasks that be be executed in a distributed fashion. |
| `pub fn num_tasks(&self) -&gt; usize` | rust/lance/src/dataset/optimize.rs:1296-1296 | The number of tasks in the plan. |
| `pub fn read_version(&self) -&gt; u64` | rust/lance/src/dataset/optimize.rs:1301-1301 | The version of the dataset that was read to produce this plan. |
| `pub fn options(&self) -&gt; &CompactionOptions` | rust/lance/src/dataset/optimize.rs:1306-1306 | The options used to produce this plan. |
| `pub struct TaskData` | rust/lance/src/dataset/optimize.rs:2135-2135 | A single group of fragments to compact, which is a view into the compaction plan. We keep the `replace_range` indices so we can map the result of the compact back to the fragments it replaces. |
| `pub fragments: Vec&lt;Fragment&gt;,` | rust/lance/src/dataset/optimize.rs:2137-2137 | The fragments to compact. |
| `pub struct CompactionTask` | rust/lance/src/dataset/optimize.rs:2143-2143 | A standalone task that can be serialized and sent to another machine for execution. |
| `pub task: TaskData,` | rust/lance/src/dataset/optimize.rs:2144-2144 | No standalone documentation summary; use the family contract and source entry. |
| `pub read_version: u64,` | rust/lance/src/dataset/optimize.rs:2145-2145 | No standalone documentation summary; use the family contract and source entry. |
| `pub options: CompactionOptions,` | rust/lance/src/dataset/optimize.rs:2146-2146 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn execute(&self, dataset: &Dataset) -&gt; Result&lt;RewriteResult&gt;` | rust/lance/src/dataset/optimize.rs:2158-2158 | Run the compaction task and return the result. |
| `pub fragments: Vec&lt;Fragment&gt;,` | rust/lance/src/dataset/optimize.rs:2196-2196 | No standalone documentation summary; use the family contract and source entry. |
| `pub pos_range: Range&lt;usize&gt;,` | rust/lance/src/dataset/optimize.rs:2197-2197 | No standalone documentation summary; use the family contract and source entry. |
| `pub candidacy: Vec&lt;CompactionCandidacy&gt;,` | rust/lance/src/dataset/optimize.rs:2198-2198 | No standalone documentation summary; use the family contract and source entry. |
| `pub row_counts: Vec&lt;usize&gt;,` | rust/lance/src/dataset/optimize.rs:2199-2199 | No standalone documentation summary; use the family contract and source entry. |
| `pub indices: Vec&lt;usize&gt;,` | rust/lance/src/dataset/optimize.rs:2200-2200 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn plan_compaction( dataset: &Dataset, options: &CompactionOptions, ) -&gt; Result&lt;CompactionPlan&gt;` | rust/lance/src/dataset/optimize.rs:2424-2427 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct RewriteResult` | rust/lance/src/dataset/optimize.rs:2436-2436 | The result of a single compaction task. |
| `pub metrics: CompactionMetrics,` | rust/lance/src/dataset/optimize.rs:2437-2437 | No standalone documentation summary; use the family contract and source entry. |
| `pub new_fragments: Vec&lt;Fragment&gt;,` | rust/lance/src/dataset/optimize.rs:2438-2438 | No standalone documentation summary; use the family contract and source entry. |
| `pub read_version: u64,` | rust/lance/src/dataset/optimize.rs:2440-2440 | The version of the dataset that was read to perform this compaction. |
| `pub original_fragments: Vec&lt;Fragment&gt;,` | rust/lance/src/dataset/optimize.rs:2442-2442 | The original fragments being replaced |
| `pub row_addrs: Option&lt;Vec&lt;u8&gt;&gt;,` | rust/lance/src/dataset/optimize.rs:2451-2451 | Serialized `RoaringTreemap` of the row addresses from the original fragments that were read during compaction. |
| `pub async fn commit_compaction( dataset: &mut Dataset, completed_tasks: Vec&lt;RewriteResult&gt;, remap_options: Arc&lt;dyn IndexRemapperOptions&gt;, options: &CompactionOptions, ) -&gt; Result&lt;CompactionMetrics&gt;` | rust/lance/src/dataset/optimize.rs:3227-3232 | Commit the results of file compaction. |


<a id="source-rust-lance-src-dataset-optimize-binary-copy-rs"></a>

## `rust/lance/src/dataset/optimize/binary_copy.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub async fn rewrite_files_binary_copy( version: ConcreteFileVersion, dataset: &Dataset, fragments: &[Fragment], params: &WriteParams, read_batch_bytes_opt: Option&lt;usize&gt;, ) -&gt; Result&lt;Vec&lt;Fragment&gt;&gt;` | rust/lance/src/dataset/optimize/binary_copy.rs:124-130 | Rewrite the files in a single task using binary copy semantics. |

<a id="source-rust-lance-src-dataset-optimize-remapping-rs"></a>

## `rust/lance/src/dataset/optimize/remapping.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub enum RemapResult` | rust/lance/src/dataset/optimize/remapping.rs:35-35 | The result of remapping an index |
| `pub struct RemappedIndex` | rust/lance/src/dataset/optimize/remapping.rs:46-46 | A remapped index |
| `pub old_id: Uuid,` | rust/lance/src/dataset/optimize/remapping.rs:47-47 | No standalone documentation summary; use the family contract and source entry. |
| `pub new_id: Uuid,` | rust/lance/src/dataset/optimize/remapping.rs:48-48 | No standalone documentation summary; use the family contract and source entry. |
| `pub index_details: prost_types::Any,` | rust/lance/src/dataset/optimize/remapping.rs:49-49 | No standalone documentation summary; use the family contract and source entry. |
| `pub index_version: u32,` | rust/lance/src/dataset/optimize/remapping.rs:50-50 | No standalone documentation summary; use the family contract and source entry. |
| `pub files: Option&lt;Vec&lt;IndexFile&gt;&gt;,` | rust/lance/src/dataset/optimize/remapping.rs:52-52 | List of files in the index with their sizes. |
| `pub trait IndexRemapper: Send + Sync` | rust/lance/src/dataset/optimize/remapping.rs:60-60 | When compaction runs the row ids will change. This typically means that indices will need to be remapped. The details of how this happens are not a part of the compaction process and so a trait is defined here to allow for inversion of control. |
| `pub trait IndexRemapperOptions: Send + Sync` | rust/lance/src/dataset/optimize/remapping.rs:73-73 | Options for creating an [IndexRemapper] |
| `pub struct IgnoreRemap` | rust/lance/src/dataset/optimize/remapping.rs:82-82 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn transpose_row_addrs( row_addrs: RoaringTreemap, old_fragments: &[Fragment], new_fragments: &[Fragment], ) -&gt; HashMap&lt;u64, Option&lt;u64&gt;&gt;` | rust/lance/src/dataset/optimize/remapping.rs:168-172 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn transpose_row_ids_from_digest( row_addrs: RoaringTreemap, old_fragments: &Vec&lt;FragDigest&gt;, new_fragments: &[FragDigest], ) -&gt; HashMap&lt;u64, Option&lt;u64&gt;&gt;` | rust/lance/src/dataset/optimize/remapping.rs:178-182 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn remap_column_index( dataset: &mut Dataset, columns: &[&str], name: Option&lt;String&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/optimize/remapping.rs:4314-4344 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-overlay-rs"></a>

## `rust/lance/src/dataset/overlay.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod writer;` | rust/lance/src/dataset/overlay.rs:37-37 | No standalone documentation summary; use the family contract and source entry. |
| `pub use lance_table::format::overlay::staleness::` | rust/lance/src/dataset/overlay.rs:56-56 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct LoadedAtomicField` | rust/lance/src/dataset/overlay.rs:304-304 | The overlays that apply to a single projected atomic field — a per-row field an overlay can replace as a unit (a primitive leaf, or a whole list/map field; structs are recursed through, not treated as atomic fields). Ordered newest-first, with readers opened and pruned to a specific read. Produced by [`resolve_overlays`] and consumed by [`merge_overlay_batch`]. |
| `pub struct OverlayReadPlanner` | rust/lance/src/dataset/overlay.rs:351-351 | A fragment's overlay-resolution plan for a projection, derived from coverage metadata alone — no file opened, no IO. [`resolve_overlays`] turns it into opened [`LoadedAtomicField`]s for one specific read, opening only the files whose cells the read's rows actually touch. |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance/src/dataset/overlay.rs:358-358 | True when no projected atomic field has any overlay, so there is nothing to resolve. |
| `pub fn plan_overlays(fragment: &FileFragment, projection: &Schema) -&gt; Result&lt;OverlayReadPlanner&gt;` | rust/lance/src/dataset/overlay.rs:381-381 | Plan `fragment`'s overlay resolution for a projection from coverage metadata alone. No files are opened here (see [`resolve_overlays`]) — this only reads the already-parsed coverage bitmaps, so it is cheap enough to run on every open. |
| `pub async fn resolve_overlays( planner: &OverlayReadPlanner, offsets_in_frag: &[u32], fragment: &FileFragment, read_config: &FragReadConfig, ) -&gt; Result&lt;Vec&lt;LoadedAtomicField&gt;&gt;` | rust/lance/src/dataset/overlay.rs:587-592 | Open the overlay readers a specific read needs and return the per-field plans to merge, pruned to that read. |
| `pub async fn merge_overlay_batch( base: ReadBatchFut, offsets_in_frag: &[u32], plans: &[LoadedAtomicField], ) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/overlay.rs:673-677 | Resolve overlays for one base batch: route each projected atomic field against the batch's `offsets_in_frag`, fetch only the overlay values the batch needs (concurrently with the base read), assemble the merged atomic field, and splice it into its output column. AtomicFields with no covered rows, and columns with no plan, pass through. |

<a id="source-rust-lance-src-dataset-overlay-writer-rs"></a>

## `rust/lance/src/dataset/overlay/writer.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub enum WriteOverlayError` | rust/lance/src/dataset/overlay/writer.rs:62-62 | Why staging a data overlay failed. |
| `pub struct OverlayWriter` | rust/lance/src/dataset/overlay/writer.rs:245-245 | Stages one data overlay file for one fragment. |
| `pub async fn write_batch(&mut self, data: &RecordBatch) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/overlay/writer.rs:341-341 | Supply values for some of the overlay's fields. |
| `pub async fn finish(mut self) -&gt; Result&lt;Option&lt;DataOverlayGroup&gt;&gt;` | rust/lance/src/dataset/overlay/writer.rs:397-397 | Finish the overlay. |
| `pub async fn abort(self)` | rust/lance/src/dataset/overlay/writer.rs:471-471 | Discard the staged file without committing anything. |

<a id="source-rust-lance-src-dataset-progress-rs"></a>

## `rust/lance/src/dataset/progress.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub trait WriteFragmentProgress: std::fmt::Debug + Sync + Send` | rust/lance/src/dataset/progress.rs:23-23 | Progress of writing a [Fragment]. |
| `pub struct WriteStats` | rust/lance/src/dataset/progress.rs:35-35 | Statistics reported to the write progress callback set via `InsertBuilder::progress` or `WriteParams::write_progress`. |
| `pub bytes_written: u64,` | rust/lance/src/dataset/progress.rs:41-41 | Cumulative bytes handed to the writer so far. |
| `pub rows_written: u64,` | rust/lance/src/dataset/progress.rs:43-43 | Cumulative rows written so far. |
| `pub files_written: u32,` | rust/lance/src/dataset/progress.rs:45-45 | Number of files (fragments) whose writes have completed so far. |
| `pub struct WriteProgressFn(Arc&lt;dyn Fn(WriteStats) + Send + Sync&gt;);` | rust/lance/src/dataset/progress.rs:54-54 | An opaque wrapper around a write-progress closure. |
| `pub fn new(f: impl Fn(WriteStats) + Send + Sync + 'static) -&gt; Self` | rust/lance/src/dataset/progress.rs:57-57 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct NoopFragmentWriteProgress` | rust/lance/src/dataset/progress.rs:74-74 | By default, Progress tracker is Noop. |
| `pub fn new() -&gt; Self` | rust/lance/src/dataset/progress.rs:77-77 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-refs-rs"></a>

## `rust/lance/src/dataset/refs.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const MAIN_BRANCH: &str = "main";` | rust/lance/src/dataset/refs.rs:26-26 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum Ref` | rust/lance/src/dataset/refs.rs:30-30 | Lance Ref |
| `pub struct Refs` | rust/lance/src/dataset/refs.rs:87-87 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( object_store: Arc&lt;ObjectStore&gt;, commit_handler: Arc&lt;dyn CommitHandler&gt;, base_location: BranchLocation, ) -&gt; Self` | rust/lance/src/dataset/refs.rs:94-98 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn tags(&self) -&gt; Tags&lt;'_&gt;` | rust/lance/src/dataset/refs.rs:106-106 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn branches(&self) -&gt; Branches&lt;'_&gt;` | rust/lance/src/dataset/refs.rs:110-110 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn base(&self) -&gt; &Path` | rust/lance/src/dataset/refs.rs:114-114 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn root(&self) -&gt; Result&lt;BranchLocation&gt;` | rust/lance/src/dataset/refs.rs:118-118 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct Tags&lt;'a&gt;` | rust/lance/src/dataset/refs.rs:125-125 | Tags operation |
| `pub struct Branches&lt;'a&gt;` | rust/lance/src/dataset/refs.rs:131-131 | Branches operation |
| `pub async fn fetch_tags(&self) -&gt; Result&lt;Vec&lt;(String, TagContents)&gt;&gt;` | rust/lance/src/dataset/refs.rs:167-167 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn list(&self) -&gt; Result&lt;HashMap&lt;String, TagContents&gt;&gt;` | rust/lance/src/dataset/refs.rs:191-191 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn list_tags_ordered( &self, order: Option&lt;Ordering&gt;, ) -&gt; Result&lt;Vec&lt;(String, TagContents)&gt;&gt;` | rust/lance/src/dataset/refs.rs:197-200 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn get_version(&self, tag: &str) -&gt; Result&lt;u64&gt;` | rust/lance/src/dataset/refs.rs:214-214 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn get(&self, tag: &str) -&gt; Result&lt;TagContents&gt;` | rust/lance/src/dataset/refs.rs:218-218 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn create(&self, tag: &str, reference: impl Into&lt;Ref&gt;) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/refs.rs:234-234 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn delete(&self, tag: &str) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/refs.rs:253-253 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn update(&self, tag: &str, reference: impl Into&lt;Ref&gt;) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/refs.rs:268-268 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn replace_metadata( &self, tag: &str, metadata: HashMap&lt;String, String&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/refs.rs:297-301 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn fetch(&self) -&gt; Result&lt;Vec&lt;(String, BranchContents)&gt;&gt;` | rust/lance/src/dataset/refs.rs:391-391 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn list(&self) -&gt; Result&lt;HashMap&lt;String, BranchContents&gt;&gt;` | rust/lance/src/dataset/refs.rs:427-427 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn get(&self, branch: &str) -&gt; Result&lt;BranchContents&gt;` | rust/lance/src/dataset/refs.rs:433-433 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn get_identifier(&self, branch: Option&lt;&str&gt;) -&gt; Result&lt;BranchIdentifier&gt;` | rust/lance/src/dataset/refs.rs:451-451 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn replace_metadata( &self, branch: &str, metadata: HashMap&lt;String, String&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/refs.rs:531-535 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn delete(&self, branch: &str, force: bool) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/refs.rs:563-563 | Delete a branch |
| `pub async fn list_ordered( &self, order: Option&lt;Ordering&gt;, ) -&gt; Result&lt;Vec&lt;(String, BranchContents)&gt;&gt;` | rust/lance/src/dataset/refs.rs:620-623 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct TagContents` | rust/lance/src/dataset/refs.rs:758-758 | No standalone documentation summary; use the family contract and source entry. |
| `pub branch: Option&lt;String&gt;,` | rust/lance/src/dataset/refs.rs:759-759 | No standalone documentation summary; use the family contract and source entry. |
| `pub version: u64,` | rust/lance/src/dataset/refs.rs:760-760 | No standalone documentation summary; use the family contract and source entry. |
| `pub created_at: Option&lt;DateTime&lt;Utc&gt;&gt;,` | rust/lance/src/dataset/refs.rs:762-762 | No standalone documentation summary; use the family contract and source entry. |
| `pub updated_at: Option&lt;DateTime&lt;Utc&gt;&gt;,` | rust/lance/src/dataset/refs.rs:764-764 | No standalone documentation summary; use the family contract and source entry. |
| `pub manifest_size: usize,` | rust/lance/src/dataset/refs.rs:765-765 | No standalone documentation summary; use the family contract and source entry. |
| `pub metadata: HashMap&lt;String, String&gt;,` | rust/lance/src/dataset/refs.rs:770-770 | Metadata associated with this tag. |
| `pub struct BranchContents` | rust/lance/src/dataset/refs.rs:775-775 | No standalone documentation summary; use the family contract and source entry. |
| `pub parent_branch: Option&lt;String&gt;,` | rust/lance/src/dataset/refs.rs:776-776 | No standalone documentation summary; use the family contract and source entry. |
| `pub identifier: BranchIdentifier,` | rust/lance/src/dataset/refs.rs:778-778 | No standalone documentation summary; use the family contract and source entry. |
| `pub parent_version: u64,` | rust/lance/src/dataset/refs.rs:779-779 | No standalone documentation summary; use the family contract and source entry. |
| `pub create_at: u64, // unix timestamp` | rust/lance/src/dataset/refs.rs:780-780 | No standalone documentation summary; use the family contract and source entry. |
| `pub manifest_size: usize,` | rust/lance/src/dataset/refs.rs:781-781 | No standalone documentation summary; use the family contract and source entry. |
| `pub metadata: HashMap&lt;String, String&gt;,` | rust/lance/src/dataset/refs.rs:786-786 | Metadata associated with this branch. |
| `pub struct BranchIdentifier` | rust/lance/src/dataset/refs.rs:790-790 | No standalone documentation summary; use the family contract and source entry. |
| `pub version_mapping: Vec&lt;(u64, String)&gt;,` | rust/lance/src/dataset/refs.rs:791-791 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(parent: &Self, parent_version: u64) -&gt; Self` | rust/lance/src/dataset/refs.rs:795-795 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn missing_identifier_sentinel() -&gt; Self` | rust/lance/src/dataset/refs.rs:807-807 | Creates a sentinel identifier for legacy branch metadata that lacks an explicit identifier. |
| `pub fn main() -&gt; Self` | rust/lance/src/dataset/refs.rs:855-855 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn parse(identifier: &str) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/refs.rs:861-861 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn find_referenced_version(&self, referenced_branch: &Self) -&gt; Option&lt;u64&gt;` | rust/lance/src/dataset/refs.rs:888-888 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn collect_referenced_versions( &self, branches: &HashMap&lt;String, BranchContents&gt;, ) -&gt; Vec&lt;(String, u64)&gt;` | rust/lance/src/dataset/refs.rs:899-902 | Collects all branches that reference this branch, returning (branch_name, version) tuples. Results are in post-order traversal (deepest branches first). |
| `pub fn base_tags_path(base_path: &Path) -&gt; Path` | rust/lance/src/dataset/refs.rs:920-920 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn base_branches_contents_path(base_path: &Path) -&gt; Path` | rust/lance/src/dataset/refs.rs:924-924 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn tag_path(base_path: &Path, branch: &str) -&gt; Path` | rust/lance/src/dataset/refs.rs:928-928 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn branch_contents_path(base_path: &Path, branch: &str) -&gt; Path` | rust/lance/src/dataset/refs.rs:933-933 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn from_path(path: &Path, object_store: &ObjectStore) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/refs.rs:968-968 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn from_path( path: &Path, object_store: &ObjectStore, branch_name: &str, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/refs.rs:974-978 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn check_valid_branch(branch_name: &str) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/refs.rs:995-995 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn check_valid_tag(s: &str) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/refs.rs:1057-1057 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-rowids-rs"></a>

## `rust/lance/src/dataset/rowids.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use spill::` | rust/lance/src/dataset/rowids.rs:28-28 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn load_row_id_sequence( dataset: &Dataset, fragment: &Fragment, ) -&gt; Result&lt;Arc&lt;RowIdSequence&gt;&gt;` | rust/lance/src/dataset/rowids.rs:37-40 | Load a row id sequence from the given dataset and fragment. |
| `pub enum RowVersionKind` | rust/lance/src/dataset/rowids.rs:66-66 | Which of a fragment's two per-row version sequences is meant. |
| `pub fn field_id(self) -&gt; i32` | rust/lance/src/dataset/rowids.rs:82-82 | The reserved field id of the hidden column a spilled sequence lives in. |
| `pub async fn load_row_version_sequence( dataset: &Dataset, fragment: &Fragment, kind: RowVersionKind, ) -&gt; Result&lt;Option&lt;Arc&lt;RowDatasetVersionSequence&gt;&gt;&gt;` | rust/lance/src/dataset/rowids.rs:95-99 | Load one of `fragment`'s per-row version sequences, wherever it is stored. |
| `pub async fn load_spilled_row_lineage&lt;'a&gt;( dataset: &Dataset, fragments: impl IntoIterator&lt;Item = &'a Fragment&gt;, ) -&gt; Result&lt;Arc&lt;SpilledRowLineage&gt;&gt;` | rust/lance/src/dataset/rowids.rs:142-145 | Read ahead every lineage sequence of `fragments` that lives outside the manifest, for a commit that will need to consult them. |
| `pub fn load_row_id_sequences&lt;'a&gt;( dataset: &'a Dataset, fragments: &'a [Fragment], ) -&gt; impl Stream&lt;Item = Result&lt;(u32, Arc&lt;RowIdSequence&gt;)&gt;&gt; + 'a` | rust/lance/src/dataset/rowids.rs:194-197 | Load row id sequences from the given dataset and fragments. |
| `pub async fn get_row_id_index(dataset: &Dataset) -&gt; Result&lt;Option&lt;Arc&lt;RowIdIndex&gt;&gt;&gt;` | rust/lance/src/dataset/rowids.rs:205-205 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn row_addrs_to_row_ids( dataset: &Dataset, addrs: impl IntoIterator&lt;Item = Option&lt;u64&gt;&gt;, ) -&gt; Result&lt;Vec&lt;Option&lt;u64&gt;&gt;&gt;` | rust/lance/src/dataset/rowids.rs:296-299 | Resolve row addresses to row ids, positionally: `addr = (fragment &lt;&lt; 32) \| offset` looks up `offset` in the fragment's [`RowIdSequence`]. The inverse companion of [`get_row_id_index`]. |

<a id="source-rust-lance-src-dataset-rowids-spill-rs"></a>

## `rust/lance/src/dataset/rowids/spill.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const DEFAULT_INLINE_ROW_LINEAGE_MAX_BYTES: usize = 200 * 1024;` | rust/lance/src/dataset/rowids/spill.rs:63-63 | Encoded sequences at or below this size stay in the manifest, unless [`INLINE_ROW_LINEAGE_MAX_BYTES_CONFIG_KEY`] says otherwise. |
| `pub const SPILL_ROW_LINEAGE_CONFIG_KEY: &str = "lance.row_lineage.spill";` | rust/lance/src/dataset/rowids/spill.rs:72-72 | Table config key that turns spilling on: `"true"` lets compaction and update move the oversized lineage sequences they carry over from existing rows out of the manifest -- row ids and created-at versions, and at compaction last-updated-at versions too; an update's last-updated-at version is the commit's and stays inline. Absent or anything else, every sequence stays inline however large it grows, which is what every released build does; a table that never sets it stays readable by them. |
| `pub const INLINE_ROW_LINEAGE_MAX_BYTES_CONFIG_KEY: &str = "lance.row_lineage.inline_max_bytes";` | rust/lance/src/dataset/rowids/spill.rs:76-76 | Table config key overriding [`DEFAULT_INLINE_ROW_LINEAGE_MAX_BYTES`], as a byte count. Only consulted when [`SPILL_ROW_LINEAGE_CONFIG_KEY`] is on. |
| `pub fn inline_row_lineage_max_bytes(dataset: &Dataset) -&gt; Result&lt;Option&lt;usize&gt;&gt;` | rust/lance/src/dataset/rowids/spill.rs:85-85 | The largest encoded lineage sequence `dataset` keeps inline, or `None` when the table does not spill at all. |
| `pub struct RowLineageSpill` | rust/lance/src/dataset/rowids/spill.rs:122-122 | Which of a compaction task's sequences leave the manifest as hidden columns of the data files it writes. Every file the task writes carries the same columns, so this holds for all of its output fragments. |
| `pub row_ids: bool,` | rust/lance/src/dataset/rowids/spill.rs:123-123 | No standalone documentation summary; use the family contract and source entry. |
| `pub created_at: bool,` | rust/lance/src/dataset/rowids/spill.rs:124-124 | No standalone documentation summary; use the family contract and source entry. |
| `pub last_updated_at: bool,` | rust/lance/src/dataset/rowids/spill.rs:125-125 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn any(&self) -&gt; bool` | rust/lance/src/dataset/rowids/spill.rs:129-129 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn field_ids(&self) -&gt; impl Iterator&lt;Item = i32&gt;` | rust/lance/src/dataset/rowids/spill.rs:134-134 | The reserved field ids of the spilled columns, in column order. |
| `pub fn take_columns(&self, lineages: &mut [RowLineage]) -&gt; Vec&lt;Vec&lt;u64&gt;&gt;` | rust/lance/src/dataset/rowids/spill.rs:147-147 | Move the spilled sequences out of `lineages` as the values of the hidden columns, one vector per column in column order, concatenated over `lineages`. The spilled sequences are left empty: nothing places them inline, and their run-length form would otherwise stay alive through the write next to the values built from it. |
| `pub fn schema_fields(&self) -&gt; Result&lt;Vec&lt;lance_core::datatypes::Field&gt;&gt;` | rust/lance/src/dataset/rowids/spill.rs:179-179 | The spilled columns as write-schema fields, in column order and under their reserved ids. |
| `pub fn place_in_file(&self, lineage: &RowLineage) -&gt; PlacedRowLineage` | rust/lance/src/dataset/rowids/spill.rs:186-186 | The placement for one fragment whose own data file was written with the spilled columns: those sequences are marked as spilled, the rest are placed inline. There is no lineage file to add to the fragment. |
| `pub enum RowLineagePlan` | rust/lance/src/dataset/rowids/spill.rs:230-230 | How a compaction task places the lineage of the fragments it writes. |
| `pub fn plan_row_lineage_spill(limit: usize, lineages: &[RowLineage]) -&gt; RowLineagePlan` | rust/lance/src/dataset/rowids/spill.rs:248-248 | Plan how the lineage of a compaction task's output fragments, `lineages`, is placed when every encoded sequence over `limit` bytes has to leave the manifest (see [`inline_row_lineage_max_bytes`]). |
| `pub struct RowLineage` | rust/lance/src/dataset/rowids/spill.rs:285-285 | The per-row lineage of one fragment, in row offset order. |
| `pub row_ids: RowIdSequence,` | rust/lance/src/dataset/rowids/spill.rs:286-286 | No standalone documentation summary; use the family contract and source entry. |
| `pub created_at: RowDatasetVersionSequence,` | rust/lance/src/dataset/rowids/spill.rs:287-287 | No standalone documentation summary; use the family contract and source entry. |
| `pub last_updated_at: RowDatasetVersionSequence,` | rust/lance/src/dataset/rowids/spill.rs:288-288 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct PlacedRowLineage` | rust/lance/src/dataset/rowids/spill.rs:294-294 | Where each of a fragment's lineage sequences ended up, and the data file the spilled ones were written to, which the fragment has to list among its files. [`Self::apply`] does both. |
| `pub row_ids: RowIdMeta,` | rust/lance/src/dataset/rowids/spill.rs:295-295 | No standalone documentation summary; use the family contract and source entry. |
| `pub created_at: RowDatasetVersionMeta,` | rust/lance/src/dataset/rowids/spill.rs:296-296 | No standalone documentation summary; use the family contract and source entry. |
| `pub last_updated_at: RowDatasetVersionMeta,` | rust/lance/src/dataset/rowids/spill.rs:297-297 | No standalone documentation summary; use the family contract and source entry. |
| `pub file: Option&lt;DataFile&gt;,` | rust/lance/src/dataset/rowids/spill.rs:298-298 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn apply(self, fragment: &mut Fragment)` | rust/lance/src/dataset/rowids/spill.rs:304-304 | Put the placement on `fragment`: its three lineage arms, and the lineage file, if any, as one more of its data files. |
| `pub async fn place_row_lineage( dataset: &Dataset, lineage: &RowLineage, ) -&gt; Result&lt;PlacedRowLineage&gt;` | rust/lance/src/dataset/rowids/spill.rs:324-327 | Place each sequence of `lineage` either inline in the manifest or in a hidden column of a new data file, as the table's spill policy (see [`inline_row_lineage_max_bytes`]) and the sequence's encoded size call for. Every sequence that spills goes into one file, which the caller adds to the fragment's data files (see [`PlacedRowLineage::apply`]). |
| `pub struct CarriedRowLineage` | rust/lance/src/dataset/rowids/spill.rs:400-400 | The lineage an update carries over into one of its new fragments, as [`place_carried_row_lineage`] placed it. |
| `pub fn apply(self, fragment: &mut Fragment)` | rust/lance/src/dataset/rowids/spill.rs:415-415 | Put the placement on `fragment`: its row ids, its created-at versions when they were placed, and the lineage file, if any, as one more of its data files. The last-updated-at versions are left for the commit. |
| `pub async fn place_carried_row_lineage( dataset: &Dataset, limit: usize, row_ids: &RowIdSequence, created_at: &RowDatasetVersionSequence, ) -&gt; Result&lt;CarriedRowLineage&gt;` | rust/lance/src/dataset/rowids/spill.rs:437-442 | Place the row ids and created-at versions that rewritten rows carry over into a new fragment, spilling each whose encoding exceeds `limit` into a hidden column of one new data file. |
| `pub async fn read_spilled_row_ids(dataset: &Dataset, fragment: &Fragment) -&gt; Result&lt;RowIdSequence&gt;` | rust/lance/src/dataset/rowids/spill.rs:537-537 | Read back `fragment`'s row id sequence from the data file that carries it. |
| `pub async fn read_spilled_versions( dataset: &Dataset, fragment: &Fragment, field_id: i32, ) -&gt; Result&lt;RowDatasetVersionSequence&gt;` | rust/lance/src/dataset/rowids/spill.rs:546-550 | Read back one of `fragment`'s version sequences from the data file that carries it; `field_id` says which of the two it is. |

<a id="source-rust-lance-src-dataset-rowids-validate-rs"></a>

## `rust/lance/src/dataset/rowids/validate.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub async fn validate_stable_row_ids(dataset: &Dataset) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/rowids/validate.rs:27-27 | Check the invariants that the stable row id machinery relies on. |

<a id="source-rust-lance-src-dataset-scanner-rs"></a>

## `rust/lance/src/dataset/scanner.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use super::fragment_slice::FragmentSlice;` | rust/lance/src/dataset/scanner.rs:91-91 | No standalone documentation summary; use the family contract and source entry. |
| `pub use lance_select::` | rust/lance/src/dataset/scanner.rs:92-92 | No standalone documentation summary; use the family contract and source entry. |
| `pub use lance_datafusion::exec::` | rust/lance/src/dataset/scanner.rs:146-146 | No standalone documentation summary; use the family contract and source entry. |
| `pub const BATCH_SIZE_FALLBACK: usize = 8192;` | rust/lance/src/dataset/scanner.rs:152-152 | Rows per output batch when neither the scan options nor `LANCE_DEFAULT_BATCH_SIZE` specify one. |
| `pub fn get_default_batch_size() -&gt; Option&lt;usize&gt;` | rust/lance/src/dataset/scanner.rs:522-522 | No standalone documentation summary; use the family contract and source entry. |
| `pub const LEGACY_DEFAULT_FRAGMENT_READAHEAD: usize = 4;` | rust/lance/src/dataset/scanner.rs:526-526 | No standalone documentation summary; use the family contract and source entry. |
| `pub static DEFAULT_FRAGMENT_READAHEAD: LazyLock&lt;Option&lt;usize&gt;&gt; = LazyLock::new(\|\|` | rust/lance/src/dataset/scanner.rs:528-528 | No standalone documentation summary; use the family contract and source entry. |
| `pub static DEFAULT_XTR_OVERFETCH: LazyLock&lt;u32&gt; = LazyLock::new(\|\|` | rust/lance/src/dataset/scanner.rs:537-537 | No standalone documentation summary; use the family contract and source entry. |
| `pub static DEFAULT_IO_BUFFER_SIZE: LazyLock&lt;u64&gt; = LazyLock::new(\|\|` | rust/lance/src/dataset/scanner.rs:550-550 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn get_default_io_buffer_size_override() -&gt; Option&lt;u64&gt;` | rust/lance/src/dataset/scanner.rs:563-563 | The user-set value of `LANCE_DEFAULT_IO_BUFFER_SIZE`, or `None` if the env var is unset or unparsable. Consult this from paths that have a sensible non-fixed default (e.g. `SchedulerConfig::max_bandwidth`) so the env var still takes precedence over that default. Re-reads the env var on each call so tests can mutate it. |
| `pub struct ColumnOrdering` | rust/lance/src/dataset/scanner.rs:575-575 | Defines an ordering for a single column |
| `pub ascending: bool,` | rust/lance/src/dataset/scanner.rs:576-576 | No standalone documentation summary; use the family contract and source entry. |
| `pub nulls_first: bool,` | rust/lance/src/dataset/scanner.rs:577-577 | No standalone documentation summary; use the family contract and source entry. |
| `pub column_name: String,` | rust/lance/src/dataset/scanner.rs:578-578 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn asc_nulls_first(column_name: String) -&gt; Self` | rust/lance/src/dataset/scanner.rs:582-582 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn asc_nulls_last(column_name: String) -&gt; Self` | rust/lance/src/dataset/scanner.rs:590-590 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn desc_nulls_first(column_name: String) -&gt; Self` | rust/lance/src/dataset/scanner.rs:598-598 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn desc_nulls_last(column_name: String) -&gt; Self` | rust/lance/src/dataset/scanner.rs:606-606 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum MaterializationStyle` | rust/lance/src/dataset/scanner.rs:629-629 | Materialization style for the scanner |
| `pub fn all_early_except(columns: &[impl AsRef&lt;str&gt;], schema: &Schema) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/scanner.rs:651-651 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FilterPlan` | rust/lance/src/dataset/scanner.rs:675-675 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(query_filter: Option&lt;QueryFilter&gt;, expr_filter_plan: ExprFilterPlan) -&gt; Self` | rust/lance/src/dataset/scanner.rs:684-684 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn disable_refine(&mut self)` | rust/lance/src/dataset/scanner.rs:692-692 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn make_refine_only(&mut self)` | rust/lance/src/dataset/scanner.rs:697-697 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn fts_filter(&self) -&gt; Option&lt;FullTextSearchQuery&gt;` | rust/lance/src/dataset/scanner.rs:702-702 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn vector_filter(&self) -&gt; Option&lt;Query&gt;` | rust/lance/src/dataset/scanner.rs:709-709 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn has_refine(&self) -&gt; bool` | rust/lance/src/dataset/scanner.rs:716-716 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn refine_columns(&self, dataset: &Arc&lt;Dataset&gt;) -&gt; Result&lt;Vec&lt;String&gt;&gt;` | rust/lance/src/dataset/scanner.rs:720-720 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn refine_filter( &self, input: Arc&lt;dyn ExecutionPlan&gt;, scanner: &Scanner, session: Option&lt;&dyn Session&gt;, ) -&gt; Result&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;` | rust/lance/src/dataset/scanner.rs:754-759 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct LanceFilter` | rust/lance/src/dataset/scanner.rs:788-788 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_none(&self) -&gt; bool` | rust/lance/src/dataset/scanner.rs:794-794 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum QueryFilter` | rust/lance/src/dataset/scanner.rs:801-801 | Query filter for filtering rows |
| `pub enum ExprFilter` | rust/lance/src/dataset/scanner.rs:808-808 | Expr filter for filtering rows |
| `pub fn to_datafusion(&self, dataset_schema: &Schema, full_schema: &Schema) -&gt; Result&lt;Expr&gt;` | rust/lance/src/dataset/scanner.rs:828-828 | Converts the filter to a Datafusion expression |
| `pub enum AggregateExpr` | rust/lance/src/dataset/scanner.rs:877-877 | Aggregate expression from Substrait or DataFusion. |
| `pub fn builder() -&gt; AggregateExprBuilder&lt;false&gt;` | rust/lance/src/dataset/scanner.rs:899-899 | Create a new builder for aggregate expressions. |
| `pub fn substrait(bytes: impl Into&lt;Vec&lt;u8&gt;&gt;) -&gt; Self` | rust/lance/src/dataset/scanner.rs:905-905 | Create from Substrait Plan bytes. |
| `pub fn datafusion(group_by: Vec&lt;Expr&gt;, aggregates: Vec&lt;Expr&gt;) -&gt; Self` | rust/lance/src/dataset/scanner.rs:911-911 | Create from DataFusion expressions. Use `.alias()` on expressions to set output column names. |
| `pub struct AggregateExprBuilder&lt;const HAS_PENDING: bool&gt;` | rust/lance/src/dataset/scanner.rs:949-949 | Builder for creating aggregate expressions without using DataFusion or Substrait directly. |
| `pub fn new() -&gt; Self` | rust/lance/src/dataset/scanner.rs:965-965 | Create a new builder. |
| `pub fn build(self) -&gt; AggregateExpr` | rust/lance/src/dataset/scanner.rs:970-970 | Build the aggregate expression. |
| `pub fn group_by(mut self, column: impl Into&lt;String&gt;) -&gt; AggregateExprBuilder&lt;false&gt;` | rust/lance/src/dataset/scanner.rs:983-983 | Add a column to group by. |
| `pub fn group_by_columns( mut self, columns: impl IntoIterator&lt;Item = impl Into&lt;String&gt;&gt;, ) -&gt; AggregateExprBuilder&lt;false&gt;` | rust/lance/src/dataset/scanner.rs:995-998 | Add multiple columns to group by. |
| `pub fn count_star(mut self) -&gt; AggregateExprBuilder&lt;true&gt;` | rust/lance/src/dataset/scanner.rs:1009-1009 | Add COUNT(*) aggregate that counts all rows. |
| `pub fn count(mut self, column: impl Into&lt;String&gt;) -&gt; AggregateExprBuilder&lt;true&gt;` | rust/lance/src/dataset/scanner.rs:1022-1022 | Add COUNT(column) aggregate. |
| `pub fn sum(mut self, column: impl Into&lt;String&gt;) -&gt; AggregateExprBuilder&lt;true&gt;` | rust/lance/src/dataset/scanner.rs:1032-1032 | Add SUM(column) aggregate. |
| `pub fn avg(mut self, column: impl Into&lt;String&gt;) -&gt; AggregateExprBuilder&lt;true&gt;` | rust/lance/src/dataset/scanner.rs:1042-1042 | Add AVG(column) aggregate. |
| `pub fn min(mut self, column: impl Into&lt;String&gt;) -&gt; AggregateExprBuilder&lt;true&gt;` | rust/lance/src/dataset/scanner.rs:1052-1052 | Add MIN(column) aggregate. |
| `pub fn max(mut self, column: impl Into&lt;String&gt;) -&gt; AggregateExprBuilder&lt;true&gt;` | rust/lance/src/dataset/scanner.rs:1062-1062 | Add MAX(column) aggregate. |
| `pub fn alias(mut self, name: impl Into&lt;String&gt;) -&gt; AggregateExprBuilder&lt;false&gt;` | rust/lance/src/dataset/scanner.rs:1074-1074 | Set an alias for the pending aggregate (the last added aggregate). |
| `pub fn build(self) -&gt; AggregateExpr` | rust/lance/src/dataset/scanner.rs:1084-1084 | Build the aggregate expression. |
| `pub struct Scanner` | rust/lance/src/dataset/scanner.rs:1113-1113 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum TakeOperation` | rust/lance/src/dataset/scanner.rs:1289-1289 | Represents a user-requested take operation |
| `pub async fn count_indexed_rows( &self, index_name: &str, filter: &str, segment_uuids: Option&lt;&[Uuid]&gt;, fragment_ids: Option&lt;&[u32]&gt;, ) -&gt; Result&lt;u64&gt;` | rust/lance/src/dataset/scanner.rs:1457-1463 | Count rows matching `filter` while pinning scalar-index planning to `index_name`. |
| `pub fn new(dataset: Arc&lt;Dataset&gt;) -&gt; Self` | rust/lance/src/dataset/scanner.rs:1659-1659 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn blob_handling(&mut self, blob_handling: BlobHandling) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:1718-1718 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn from_fragment(dataset: Arc&lt;Dataset&gt;, fragment: Fragment) -&gt; Self` | rust/lance/src/dataset/scanner.rs:1724-1724 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_fragments(&mut self, fragments: Vec&lt;Fragment&gt;) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:1734-1734 | Set which fragments should be scanned. |
| `pub fn with_index_segments(&mut self, segments: Vec&lt;Uuid&gt;) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/scanner.rs:1760-1760 | Restrict vector index search to the specified index segments. |
| `pub fn empty_project(&mut self) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/scanner.rs:1803-1803 | Empty Projection (useful for count queries) |
| `pub fn project&lt;T: AsRef&lt;str&gt;&gt;(&mut self, columns: &[T]) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/scanner.rs:1810-1810 | Projection. |
| `pub fn project_with_transform( &mut self, columns: &[(impl AsRef&lt;str&gt;, impl AsRef&lt;str&gt;)], ) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/scanner.rs:1822-1825 | Projection with transform |
| `pub fn project_with_schema( &mut self, projection: &lance_core::datatypes::Schema, ) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/scanner.rs:1864-1867 | Projection by a (possibly partial) schema. |
| `pub fn prefilter(&mut self, should_prefilter: bool) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:1888-1888 | Should the filter run before the vector index is applied |
| `pub fn with_row_id_prefilter(&mut self, mask: RowAddrMask) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:1929-1929 | Set an external [`RowAddrMask`] allow/block prefilter. |
| `pub fn with_row_addr_prefilter(&mut self, mask: RowAddrMask) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:1940-1940 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn with_fragment_slices(&mut self, slices: &[FragmentSlice]) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/scanner.rs:1964-1964 | Restrict the scan to physical slices in this dataset snapshot. |
| `pub fn with_physical_row_addr_prefilter(&mut self, rows: RowAddrTreeMap) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:1990-1990 | Restrict the scan to physical row addresses. |
| `pub fn scan_stats_callback(&mut self, callback: ExecutionStatsCallback) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:1996-1996 | Set the callback to be called after the scan with summary statistics |
| `pub fn materialization_style(&mut self, style: MaterializationStyle) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2012-2012 | Set the materialization style for the scan |
| `pub fn filter(&mut self, filter: &str) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/scanner.rs:2032-2032 | Apply filters |
| `pub fn filter_query(&mut self, filter: QueryFilter) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/scanner.rs:2055-2055 | Apply fts/vector query as filter. |
| `pub fn full_text_search(&mut self, query: FullTextSearchQuery) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/scanner.rs:2073-2073 | Filter by full text search The column must be a string column. The query is a string to search for. The search is case-insensitive, BM25 scoring is used. |
| `pub fn minhash_search(&mut self, query: MinHashQuery) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/scanner.rs:2084-2084 | Return the rows of `query.column` most similar to `query.text` under the column's MinHash LSH index. |
| `pub fn filter_substrait(&mut self, filter: &[u8]) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/scanner.rs:2098-2098 | Set a filter using a Substrait ExtendedExpression message |
| `pub fn filter_expr(&mut self, filter: Expr) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2103-2103 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn aggregate(&mut self, aggregate: AggregateExpr) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/scanner.rs:2112-2112 | Set aggregation. |
| `pub fn batch_size(&mut self, batch_size: usize) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2126-2126 | Set the maximum number of rows per batch. |
| `pub fn batch_size_bytes(&mut self, batch_size_bytes: u64) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2142-2142 | Set the target batch size in bytes. |
| `pub fn include_deleted_rows(&mut self) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2157-2157 | Include deleted rows |
| `pub fn io_buffer_size(&mut self, size: u64) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2177-2177 | Set the I/O buffer size |
| `pub fn materialization_readahead_bytes(&mut self, size: u64) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2198-2198 | Set the memory budget for asynchronous blob v2 materialization. |
| `pub fn batch_readahead(&mut self, nbatches: usize) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2209-2209 | Set the number of batches to decode concurrently. |
| `pub fn fragment_readahead(&mut self, nfragments: usize) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2219-2219 | Set the number of fragments whose reads may be scheduled concurrently. |
| `pub fn target_parallelism(&mut self, n: usize) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2229-2229 | Set the target number of partitions for the physical optimizer. |
| `pub fn scan_in_order(&mut self, ordered: bool) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2247-2247 | Set whether to read data in order (default: true) |
| `pub fn use_scalar_index(&mut self, use_scalar_index: bool) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2257-2257 | Set whether to use scalar index. |
| `pub fn strict_batch_size(&mut self, strict_batch_size: bool) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2272-2272 | Set whether to use strict batch size. |
| `pub fn limit(&mut self, limit: Option&lt;i64&gt;, offset: Option&lt;i64&gt;) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/scanner.rs:2283-2283 | Set limit and offset. |
| `pub fn nearest(&mut self, column: &str, q: &dyn Array, k: usize) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/scanner.rs:2317-2317 | Find k-nearest neighbor within the vector column. the query can be a Float16Array, Float32Array, Float64Array, UInt8Array, or a ListArray/FixedSizeListArray of the above types. |
| `pub fn distance_range( &mut self, lower_bound: Option&lt;f32&gt;, upper_bound: Option&lt;f32&gt;, ) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2446-2450 | Set the distance thresholds for the nearest neighbor search. |
| `pub fn nprobes(&mut self, n: usize) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2463-2463 | Configures how many partitions are searched in the vector index. |
| `pub fn search_effort(&mut self, effort: f64) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/scanner.rs:2494-2494 | Set the initial IVF search effort to a finite value in [0, 1]. |
| `pub fn nprobs(&mut self, n: usize) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2519-2519 | Configures how many partitions are searched in the vector index. |
| `pub fn minimum_nprobes(&mut self, n: usize) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2530-2530 | Configures the minimum number of partitions to search in the vector index. |
| `pub fn maximum_nprobes(&mut self, n: usize) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2548-2548 | Configures the maximum number of partitions to search in the vector index. |
| `pub fn ef(&mut self, ef: usize) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2558-2558 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn fast_search(&mut self) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2571-2571 | Only search the data being indexed. |
| `pub fn refine(&mut self, factor: u32) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2588-2588 | Apply a refine step to the vector search. |
| `pub fn distance_metric(&mut self, metric_type: MetricType) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2596-2596 | Change the distance [MetricType], i.e, L2 or Cosine distance. |
| `pub fn order_by(&mut self, ordering: Option&lt;Vec&lt;ColumnOrdering&gt;&gt;) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/dataset/scanner.rs:2608-2608 | Sort the results of the scan by one or more columns |
| `pub fn use_index(&mut self, use_index: bool) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2630-2630 | Set whether to use the index if available |
| `pub fn approx_mode(&mut self, approx_mode: ApproxMode) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2642-2642 | Configure the speed / accuracy tradeoff for approximate vector search. |
| `pub fn query_parallelism(&mut self, query_parallelism: i32) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2660-2660 | Configure partition-search concurrency for each vector query. |
| `pub fn with_row_id(&mut self) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2670-2670 | Instruct the scanner to return the `_rowid` meta column from the dataset. |
| `pub fn with_row_address(&mut self) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2677-2677 | Instruct the scanner to return the `_rowaddr` meta column from the dataset. |
| `pub fn disable_scoring_autoprojection(&mut self) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2698-2698 | Instruct the scanner to disable automatic projection of scoring columns |
| `pub fn with_file_reader_options(&mut self, options: FileReaderOptions) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2704-2704 | Set the file reader options to use when reading data files. |
| `pub fn use_stats(&mut self, use_stats: bool) -&gt; &mut Self` | rust/lance/src/dataset/scanner.rs:2812-2812 | Set whether to use statistics to optimize the scan (default: true) |
| `pub async fn schema(&self) -&gt; Result&lt;SchemaRef&gt;` | rust/lance/src/dataset/scanner.rs:2818-2818 | The Arrow schema of the output, including projections and vector / _distance |
| `pub fn get_expr_filter(&self) -&gt; Result&lt;Option&lt;Expr&gt;&gt;` | rust/lance/src/dataset/scanner.rs:2829-2829 | Fetches the currently set expr filter |
| `pub fn try_into_stream(&self) -&gt; BoxFuture&lt;'_, Result&lt;DatasetRecordBatchStream&gt;&gt;` | rust/lance/src/dataset/scanner.rs:2999-2999 | Create a stream from the Scanner. |
| `pub async fn try_into_batch(&self) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/scanner.rs:3038-3038 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn count_rows(&self) -&gt; BoxFuture&lt;'_, Result&lt;u64&gt;&gt;` | rust/lance/src/dataset/scanner.rs:3050-3050 | Scan and return the number of matching rows |
| `pub fn create_aggregate_plan(&self) -&gt; BoxFuture&lt;'_, Result&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;&gt;` | rust/lance/src/dataset/scanner.rs:3081-3081 | Create an execution plan with aggregation. |
| `pub fn create_plan(&self) -&gt; BoxFuture&lt;'_, Result&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;&gt;` | rust/lance/src/dataset/scanner.rs:3679-3679 | Create [`ExecutionPlan`] for Scan. |
| `pub async fn analyze_plan(&self) -&gt; Result&lt;String&gt;` | rust/lance/src/dataset/scanner.rs:8492-8492 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn explain_plan(&self, verbose: bool) -&gt; Result&lt;String&gt;` | rust/lance/src/dataset/scanner.rs:8505-8505 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn analyze_count_plan(&self) -&gt; Result&lt;String&gt;` | rust/lance/src/dataset/scanner.rs:8523-8523 | Run [`Self::count_rows`]'s underlying plan and return it formatted with runtime metrics. Equivalent to [`Self::analyze_plan`] but with a `COUNT(*)` aggregate auto-applied first — the only way for callers without a hand-built `AggregateExpr` (e.g. the Python bindings) to inspect the plan that `count_rows` actually executed. |
| `pub struct DatasetRecordBatchStream` | rust/lance/src/dataset/scanner.rs:8582-8582 | [`DatasetRecordBatchStream`] wraps the dataset into a [`RecordBatchStream`] for consumption by the user. |
| `pub fn new(exec_node: SendableRecordBatchStream) -&gt; Self` | rust/lance/src/dataset/scanner.rs:8589-8589 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-src-dataset-schema-evolution-rs"></a>

## `rust/lance/src/dataset/schema_evolution.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod optimize;` | rust/lance/src/dataset/schema_evolution.rs:36-36 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct BatchInfo` | rust/lance/src/dataset/schema_evolution.rs:75-75 | No standalone documentation summary; use the family contract and source entry. |
| `pub fragment_id: u32,` | rust/lance/src/dataset/schema_evolution.rs:76-76 | No standalone documentation summary; use the family contract and source entry. |
| `pub batch_index: usize,` | rust/lance/src/dataset/schema_evolution.rs:77-77 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait UDFCheckpointStore: Send + Sync` | rust/lance/src/dataset/schema_evolution.rs:84-84 | A mechanism for saving UDF results. |
| `pub struct BatchUDF` | rust/lance/src/dataset/schema_evolution.rs:91-91 | No standalone documentation summary; use the family contract and source entry. |
| `pub mapper: Box&lt;dyn Fn(&RecordBatch) -&gt; Result&lt;RecordBatch&gt; + Send + Sync&gt;,` | rust/lance/src/dataset/schema_evolution.rs:93-93 | No standalone documentation summary; use the family contract and source entry. |
| `pub output_schema: Arc&lt;ArrowSchema&gt;,` | rust/lance/src/dataset/schema_evolution.rs:95-95 | The schema of the returned RecordBatch |
| `pub result_checkpoint: Option&lt;Arc&lt;dyn UDFCheckpointStore&gt;&gt;,` | rust/lance/src/dataset/schema_evolution.rs:97-97 | A checkpoint store for the UDF results |
| `pub enum NewColumnTransform` | rust/lance/src/dataset/schema_evolution.rs:101-101 | A way to define one or more new columns in a dataset |
| `pub struct ColumnAlteration` | rust/lance/src/dataset/schema_evolution.rs:117-117 | Definition of a change to a column in a dataset |
| `pub path: String,` | rust/lance/src/dataset/schema_evolution.rs:119-119 | Path to the existing column to be altered. |
| `pub rename: Option&lt;String&gt;,` | rust/lance/src/dataset/schema_evolution.rs:121-121 | The new name of the column. If None, the column name will not be changed. |
| `pub nullable: Option&lt;bool&gt;,` | rust/lance/src/dataset/schema_evolution.rs:123-123 | Whether the column is nullable. If None, the nullability will not be changed. |
| `pub data_type: Option&lt;DataType&gt;,` | rust/lance/src/dataset/schema_evolution.rs:125-125 | The new data type of the column. If None, the data type will not be changed. |
| `pub fn new(path: String) -&gt; Self` | rust/lance/src/dataset/schema_evolution.rs:129-129 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn rename(mut self, name: String) -&gt; Self` | rust/lance/src/dataset/schema_evolution.rs:138-138 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn set_nullable(mut self, nullable: bool) -&gt; Self` | rust/lance/src/dataset/schema_evolution.rs:143-143 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn cast_to(mut self, data_type: DataType) -&gt; Self` | rust/lance/src/dataset/schema_evolution.rs:148-148 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn check_field_conflict_with( left: &ArrowField, right: &ArrowField, validate_nested_column_add: fn(&ArrowField) -&gt; Result&lt;()&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/schema_evolution.rs:177-181 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn plan_drop_columns(dataset: &Dataset, columns: &[&str]) -&gt; Result&lt;Schema&gt;` | rust/lance/src/dataset/schema_evolution.rs:1187-1187 | Remove columns from the dataset. |
| `pub fn exclude_with( source: &Schema, other: &Schema, exclude_nested_field: fn(&Field, &Field) -&gt; Option&lt;Field&gt;, ) -&gt; Result&lt;Schema&gt;` | rust/lance/src/dataset/schema_evolution.rs:1278-1282 | Exclude the fields from `other` Schema using the selected nested-field rule. |


<a id="source-rust-lance-src-dataset-schema-evolution-optimize-rs"></a>

## `rust/lance/src/dataset/schema_evolution/optimize.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub trait NewColumnTransformOptimizer: Send + Sync` | rust/lance/src/dataset/schema_evolution/optimize.rs:17-17 | Optimizes a `NewColumnTransform` into |
| `pub struct ChainedNewColumnTransformOptimizer` | rust/lance/src/dataset/schema_evolution/optimize.rs:27-27 | A `NewColumnTransformOptimizer` that chains multiple `NewColumnTransformOptimizer`s together. |
| `pub fn new(optimizers: Vec&lt;Box&lt;dyn NewColumnTransformOptimizer&gt;&gt;) -&gt; Self` | rust/lance/src/dataset/schema_evolution/optimize.rs:32-32 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn add_optimizer(&mut self, optimizer: Box&lt;dyn NewColumnTransformOptimizer&gt;)` | rust/lance/src/dataset/schema_evolution/optimize.rs:36-36 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct SqlToAllNullsOptimizer;` | rust/lance/src/dataset/schema_evolution/optimize.rs:62-62 | Optimizes a `NewColumnTransform` that is a SQL expression to a `NewColumnTransform::AllNulls` if the SQL expression is "NULL". For example `NewColumnTransform::SqlExpression(vec![("new_col", "CAST(NULL AS int)"])` would be optimized to `NewColumnTransform::AllNulls(Schema::new(vec![Field::new("new_col", DataType::Int)]))`. |
| `pub fn new() -&gt; Self` | rust/lance/src/dataset/schema_evolution/optimize.rs:65-65 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-sql-rs"></a>

## `rust/lance/src/dataset/sql.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct SqlQueryBuilder` | rust/lance/src/dataset/sql.rs:26-26 | A SQL builder to prepare options for running SQL queries against a Lance dataset. |
| `pub fn new(dataset: Dataset, sql: &str) -&gt; Self` | rust/lance/src/dataset/sql.rs:53-53 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn table_name(mut self, table_name: &str) -&gt; Self` | rust/lance/src/dataset/sql.rs:70-70 | The table name to register in the datafusion context. This is used to specify a "table name" for the dataset. So that you can run SQL queries against it. If not set, the default table name is "dataset". |
| `pub fn with_row_id(mut self, row_id: bool) -&gt; Self` | rust/lance/src/dataset/sql.rs:81-81 | Specify if the query result should include the internal row id. If true, the query result will include an additional column named "_rowid". |
| `pub fn with_row_addr(mut self, row_addr: bool) -&gt; Self` | rust/lance/src/dataset/sql.rs:92-92 | Specify if the query result should include the internal row address. If true, the query result will include an additional column named "_rowaddr". |
| `pub fn blob_handling(mut self, blob_handling: BlobHandling) -&gt; Self` | rust/lance/src/dataset/sql.rs:101-101 | Override how blob columns are materialized for this query. |
| `pub fn batch_size(mut self, batch_size: usize) -&gt; Self` | rust/lance/src/dataset/sql.rs:112-112 | Set the maximum number of rows produced by each query batch. |
| `pub fn batch_size_bytes(mut self, batch_size_bytes: u64) -&gt; Self` | rust/lance/src/dataset/sql.rs:121-121 | Set the approximate maximum number of bytes produced by each scan batch. |
| `pub async fn build(self) -&gt; lance_core::Result&lt;SqlQuery&gt;` | rust/lance/src/dataset/sql.rs:126-126 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct SqlQuery` | rust/lance/src/dataset/sql.rs:286-286 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(dataframe: DataFrame) -&gt; Self` | rust/lance/src/dataset/sql.rs:321-321 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn into_stream(self) -&gt; lance_core::Result&lt;SendableRecordBatchStream&gt;` | rust/lance/src/dataset/sql.rs:325-325 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn into_batch_records(self) -&gt; lance_core::Result&lt;Vec&lt;RecordBatch&gt;&gt;` | rust/lance/src/dataset/sql.rs:345-345 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn into_dataframe(self) -&gt; DataFrame` | rust/lance/src/dataset/sql.rs:353-353 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-statistics-rs"></a>

## `rust/lance/src/dataset/statistics.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct FieldStatistics` | rust/lance/src/dataset/statistics.rs:21-21 | Statistics about a single field in the dataset |
| `pub id: u32,` | rust/lance/src/dataset/statistics.rs:23-23 | Id of the field |
| `pub bytes_on_disk: u64,` | rust/lance/src/dataset/statistics.rs:27-27 | Amount of data in the field (after compression, if any) |
| `pub struct DataStatistics` | rust/lance/src/dataset/statistics.rs:31-31 | Statistics about the data in the dataset |
| `pub fields: Vec&lt;FieldStatistics&gt;,` | rust/lance/src/dataset/statistics.rs:33-33 | Statistics about each field in the dataset |
| `pub trait DatasetStatisticsExt` | rust/lance/src/dataset/statistics.rs:36-36 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct DatasetStatistics&lt;'a&gt;` | rust/lance/src/dataset/statistics.rs:107-107 | A read-only handle for cheap, index-derived statistics about a [`Dataset`]. |
| `pub async fn column_value_range( &self, column: &str, ) -&gt; Result&lt;Option&lt;(ScalarValue, ScalarValue)&gt;&gt;` | rust/lance/src/dataset/statistics.rs:129-132 | Global `[min, max]` for `column` from its min/max-capable scalar index (currently ZoneMap), without a scan. |

<a id="source-rust-lance-src-dataset-take-rs"></a>

## `rust/lance/src/dataset/take.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub async fn row_offsets_to_row_addresses( fragments: &[FileFragment], row_indices: &[u64], ) -&gt; Result&lt;Vec&lt;u64&gt;&gt;` | rust/lance/src/dataset/take.rs:47-50 | Convert a list of row offsets to a list of row addresses |
| `pub async fn take( dataset: &Dataset, offsets: &[u64], projection: ProjectionRequest, ) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/take.rs:104-108 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn take_scan( dataset: &Dataset, row_ranges: Pin&lt;Box&lt;dyn Stream&lt;Item = Result&lt;Range&lt;u64&gt;&gt;&gt; + Send&gt;&gt;, projection: Arc&lt;Schema&gt;, batch_readahead: usize, ) -&gt; DatasetRecordBatchStream` | rust/lance/src/dataset/take.rs:419-424 | Get a stream of batches based on iterator of ranges of row numbers. |
| `pub struct TakeBuilder` | rust/lance/src/dataset/take.rs:478-478 | Builder for the `take` operation. |
| `pub fn try_new_from_ids( dataset: Arc&lt;Dataset&gt;, row_ids: Vec&lt;u64&gt;, projection: ProjectionRequest, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/take.rs:496-500 | Create a new `TakeBuilder` for taking by id |
| `pub fn try_new_from_addresses( dataset: Arc&lt;Dataset&gt;, addresses: Vec&lt;u64&gt;, projection: Arc&lt;ProjectionPlan&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/take.rs:512-516 | Create a new `TakeBuilder` for taking by address |
| `pub fn with_row_address(mut self, with_row_address: bool) -&gt; Self` | rust/lance/src/dataset/take.rs:528-528 | Adds row addresses to the output |
| `pub async fn execute(self) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/take.rs:539-539 | Execute the take operation and return a single batch |
| `pub fn is_empty(&self) -&gt; bool` | rust/lance/src/dataset/take.rs:543-543 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-udtf-rs"></a>

## `rust/lance/src/dataset/udtf.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn new( dataset: Arc&lt;Dataset&gt;, fts_query: FullTextSearchQuery, with_row_id: bool, with_row_addr: bool, ordered: bool, ) -&gt; Self` | rust/lance/src/dataset/udtf.rs:32-38 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FtsQueryUDTF` | rust/lance/src/dataset/udtf.rs:165-165 | This function creates a virtual table from the input fts query. |
| `pub struct FtsQueryUDTFBuilder` | rust/lance/src/dataset/udtf.rs:230-230 | Builder of `FtsQueryUDTF` |
| `pub fn builder() -&gt; Self` | rust/lance/src/dataset/udtf.rs:235-235 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn register_table(mut self, table_name: &str, dataset: Arc&lt;Dataset&gt;) -&gt; Self` | rust/lance/src/dataset/udtf.rs:241-241 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn build(self) -&gt; FtsQueryUDTF` | rust/lance/src/dataset/udtf.rs:246-246 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-updater-rs"></a>

## `rust/lance/src/dataset/updater.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct Updater` | rust/lance/src/dataset/updater.rs:35-35 | Update or insert a new column. |
| `pub fn fragment(&self) -&gt; &FileFragment` | rust/lance/src/dataset/updater.rs:169-169 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn dataset(&self) -&gt; &Dataset` | rust/lance/src/dataset/updater.rs:173-173 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn next(&mut self) -&gt; Result&lt;Option&lt;&RecordBatch&gt;&gt;` | rust/lance/src/dataset/updater.rs:182-182 | Returns the next [`RecordBatch`] as input for updater. |
| `pub async fn update(&mut self, batch: RecordBatch) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/updater.rs:277-277 | Update one batch. |
| `pub async fn finish(&mut self) -&gt; Result&lt;Fragment&gt;` | rust/lance/src/dataset/updater.rs:380-380 | Finish updating this fragment, and returns the updated [`Fragment`]. |
| `pub fn schema(&self) -&gt; Option&lt;&Schema&gt;` | rust/lance/src/dataset/updater.rs:505-505 | Get the final schema of the fragment after the update. |


<a id="source-rust-lance-src-dataset-utils-rs"></a>

## `rust/lance/src/dataset/utils.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn make_rowid_capture_stream( mut target: SendableRecordBatchStream, stable_row_ids: bool, ) -&gt; Result&lt;(SendableRecordBatchStream, Receiver&lt;CapturedRowIds&gt;)&gt;` | rust/lance/src/dataset/utils.rs:55-58 | Given a stream that includes a row id column, return a stream that will capture the row id. At completion of the stream, the captured row ids can be received from the returned receiver. |
| `pub enum CapturedRowIds` | rust/lance/src/dataset/utils.rs:102-102 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(stable_row_ids: bool) -&gt; Self` | rust/lance/src/dataset/utils.rs:113-113 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn capture(&mut self, row_ids: &[u64]) -&gt; DFResult&lt;()&gt;` | rust/lance/src/dataset/utils.rs:124-124 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn capture_created_at(&mut self, versions: &[u64])` | rust/lance/src/dataset/utils.rs:141-141 | Record the created-at versions of the rows just passed to [`Self::capture`]. |
| `pub fn row_id_sequence(&self) -&gt; Option&lt;&RowIdSequence&gt;` | rust/lance/src/dataset/utils.rs:175-175 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn created_at_sequence(&self) -&gt; Option&lt;&RowDatasetVersionSequence&gt;` | rust/lance/src/dataset/utils.rs:184-184 | The captured rows' created-at versions, in capture order, when the stream carried them. |
| `pub fn row_addrs(&self, index: Option&lt;&RowIdIndex&gt;) -&gt; Result&lt;Cow&lt;'_, RoaringTreemap&gt;&gt;` | rust/lance/src/dataset/utils.rs:191-191 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct SchemaAdapter` | rust/lance/src/dataset/utils.rs:281-281 | Converts between the Arrow representations callers use and the ones Lance stores: Arrow JSON text ↔ Lance JSONB, and top-level view arrays → offset arrays. |
| `pub fn new(logical_schema: ArrowSchemaRef) -&gt; Self` | rust/lance/src/dataset/utils.rs:287-287 | Create a new adapter given the logical Arrow schema. |
| `pub fn requires_physical_conversion(&self) -&gt; bool` | rust/lance/src/dataset/utils.rs:292-292 | Determine if the logical schema includes fields that require physical conversion. |
| `pub fn requires_logical_conversion(schema: &ArrowSchemaRef) -&gt; bool` | rust/lance/src/dataset/utils.rs:300-300 | Determine if the physical schema includes Lance JSON fields that must be converted back. |
| `pub fn to_physical_batch(&self, batch: RecordBatch) -&gt; Result&lt;RecordBatch&gt;` | rust/lance/src/dataset/utils.rs:304-304 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn to_physical_reader( &self, reader: Box&lt;dyn RecordBatchReader + Send&gt;, ) -&gt; Box&lt;dyn RecordBatchReader + Send&gt;` | rust/lance/src/dataset/utils.rs:337-340 | Wrap a synchronous [`RecordBatchReader`] so each batch is converted from its logical form to the physical form Lance stores on disk (Arrow JSON → Lance JSON, view types → offset types). Returns the reader unchanged when no field needs conversion. |
| `pub fn to_logical_stream( &self, stream: SendableRecordBatchStream, ) -&gt; SendableRecordBatchStream` | rust/lance/src/dataset/utils.rs:354-357 | Convert a physical stream into a logical stream. |

<a id="source-rust-lance-src-dataset-versions-mod-rs"></a>

## `rust/lance/src/dataset/versions/mod.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn validate_write_version( default_version: ConcreteFileVersion, target: ConcreteFileVersion, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/versions/mod.rs:59-62 | Keep per-operation targets within the dataset's existing reader family. |
| `pub fn create_scan_stream( version: ConcreteFileVersion, dataset: Arc&lt;Dataset&gt;, fragments: Arc&lt;Vec&lt;Fragment&gt;&gt;, offsets: Option&lt;Range&lt;u64&gt;&gt;, projection: Arc&lt;Schema&gt;, config: LanceScanConfig, metrics: &ExecutionPlanMetricsSet, partition: usize, ) -&gt; datafusion::error::Result&lt;LanceStream&gt;` | rust/lance/src/dataset/versions/mod.rs:72-81 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn schema_compare_options(version: ConcreteFileVersion) -&gt; SchemaCompareOptions` | rust/lance/src/dataset/versions/mod.rs:95-95 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn write_fragments( version: ConcreteFileVersion, dataset: Option&lt;&Dataset&gt;, object_store: Arc&lt;ObjectStore&gt;, base_dir: &Path, normalized_schema: Schema, data: SendableRecordBatchStream, params: WriteParams, target_bases_info: Option&lt;Vec&lt;TargetBaseInfo&gt;&gt;, file_row_counts: Option&lt;Vec&lt;usize&gt;&gt;, preassigned_data_file_name: Option&lt;Arc&lt;String&gt;&gt;, keep_field_ids: bool, ) -&gt; Result&lt;(Vec&lt;Fragment&gt;, Schema)&gt;` | rust/lance/src/dataset/versions/mod.rs:137-149 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn write_fragments_direct( version: ConcreteFileVersion, dataset: Option&lt;&Dataset&gt;, object_store: Arc&lt;ObjectStore&gt;, base_dir: &Path, schema: &Schema, data: SendableRecordBatchStream, params: WriteParams, target_bases_info: Option&lt;Vec&lt;TargetBaseInfo&gt;&gt;, seed_writers: Vec&lt;Box&lt;dyn IndexSeedWriter&gt;&gt;, file_row_counts: Option&lt;Vec&lt;usize&gt;&gt;, preassigned_data_file_name: Option&lt;Arc&lt;String&gt;&gt;, ) -&gt; Result&lt;Vec&lt;Fragment&gt;&gt;` | rust/lance/src/dataset/versions/mod.rs:241-253 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn can_use_binary_copy( version: ConcreteFileVersion, dataset: &Dataset, options: &CompactionOptions, fragments: &[Fragment], ) -&gt; Result&lt;bool&gt;` | rust/lance/src/dataset/versions/mod.rs:331-336 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn rewrite_files_binary_copy( version: ConcreteFileVersion, dataset: &Dataset, fragments: &[Fragment], params: &WriteParams, read_batch_bytes: Option&lt;usize&gt;, ) -&gt; Result&lt;Vec&lt;Fragment&gt;&gt;` | rust/lance/src/dataset/versions/mod.rs:351-357 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn check_manifest_storage_version(manifest: &mut Manifest) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/versions/mod.rs:378-378 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn check_manifest_storage_version_for_commit(manifest: &mut Manifest) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/versions/mod.rs:382-382 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn finalize_manifest_storage_version(manifest: &mut Manifest) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/versions/mod.rs:386-386 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn write_fragment( version: ConcreteFileVersion, builder: &FragmentCreateBuilder&lt;'_&gt;, stream: SendableRecordBatchStream, schema: Schema, id: u64, ) -&gt; Result&lt;Fragment&gt;` | rust/lance/src/dataset/versions/mod.rs:601-607 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn open_writer( version: ConcreteFileVersion, object_store: &ObjectStore, schema: &Schema, base_dir: &Path, options: WriterOptions, ) -&gt; Result&lt;Box&lt;dyn GenericWriter&gt;&gt;` | rust/lance/src/dataset/versions/mod.rs:636-642 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn open_update_writer( version: ConcreteFileVersion, dataset: &Dataset, schema: &Schema, allow_external_blob_outside_bases: bool, ) -&gt; Result&lt;Box&lt;dyn GenericWriter&gt;&gt;` | rust/lance/src/dataset/versions/mod.rs:701-706 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn create_fragment_from_file( file_version: ConcreteFileVersion, dataset_version: ConcreteFileVersion, filename: &str, dataset: &Dataset, fragment_id: usize, physical_rows: Option&lt;usize&gt;, ) -&gt; Result&lt;Fragment&gt;` | rust/lance/src/dataset/versions/mod.rs:729-736 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn index_file_version(version: ConcreteFileVersion) -&gt; ConcreteFileVersion` | rust/lance/src/dataset/versions/mod.rs:770-770 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn open_file_reader( version: ConcreteFileVersion, fragment: &FileFragment, data_file: &DataFile, projection: Option&lt;&Schema&gt;, read_config: &FragReadConfig, metadata_mode: MetadataMode, ) -&gt; Result&lt;Option&lt;Box&lt;dyn GenericFileReader&gt;&gt;&gt;` | rust/lance/src/dataset/versions/mod.rs:779-786 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn open_v1_fragment_reader( fragment: &FileFragment, projection: &Schema, read_config: &FragReadConfig, ) -&gt; Result&lt;V1FragmentReader&gt;` | rust/lance/src/dataset/versions/mod.rs:800-804 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn row_group_size_for_rewrite( version: ConcreteFileVersion, fragment: &FileFragment, ) -&gt; Result&lt;Option&lt;u32&gt;&gt;` | rust/lance/src/dataset/versions/mod.rs:819-822 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_upcast_downcast( version: ConcreteFileVersion, from_type: &DataType, to_type: &DataType, ) -&gt; bool` | rust/lance/src/dataset/versions/mod.rs:840-844 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn validate_nulls( version: ConcreteFileVersion, column_name: &str, datatype: &DataType, has_nulls: bool, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/versions/mod.rs:891-896 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn check_field_conflict( version: ConcreteFileVersion, left: &ArrowField, right: &ArrowField, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/versions/mod.rs:943-947 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn exclude_schema( version: ConcreteFileVersion, source: &Schema, other: &Schema, ) -&gt; Result&lt;Schema&gt;` | rust/lance/src/dataset/versions/mod.rs:973-977 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn configure_new_column_optimizers( version: ConcreteFileVersion, optimizer: &mut ChainedNewColumnTransformOptimizer, )` | rust/lance/src/dataset/versions/mod.rs:987-990 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn validate_metadata_only_null_columns(version: ConcreteFileVersion) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/versions/mod.rs:1002-1002 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn take( version: ConcreteFileVersion, scanner: &Scanner, input: Arc&lt;dyn ExecutionPlan&gt;, output_projection: Projection, ) -&gt; Result&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;` | rust/lance/src/dataset/versions/mod.rs:1063-1068 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn collect_data_stats( version: ConcreteFileVersion, dataset: &Arc&lt;Dataset&gt;, field_stats: &mut HashMap&lt;u32, FieldStatistics&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/versions/mod.rs:1078-1082 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn merge_insert_indexed_take( version: ConcreteFileVersion, dataset: Arc&lt;Dataset&gt;, mut index_mapper: Arc&lt;dyn ExecutionPlan&gt;, projection: Projection, add_row_addr: bool, ) -&gt; Result&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;` | rust/lance/src/dataset/versions/mod.rs:1094-1100 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn validate_row_stream_read(version: ConcreteFileVersion) -&gt; Result&lt;()&gt;` | rust/lance/src/dataset/versions/mod.rs:1134-1134 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-src-dataset-write-rs"></a>

## `rust/lance/src/dataset/write.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod delete;` | rust/lance/src/dataset/write.rs:67-67 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod merge_insert;` | rust/lance/src/dataset/write.rs:69-69 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod update;` | rust/lance/src/dataset/write.rs:71-71 | No standalone documentation summary; use the family contract and source entry. |
| `pub use super::progress::` | rust/lance/src/dataset/write.rs:73-73 | No standalone documentation summary; use the family contract and source entry. |
| `pub use commit::` | rust/lance/src/dataset/write.rs:74-74 | No standalone documentation summary; use the family contract and source entry. |
| `pub use delete::` | rust/lance/src/dataset/write.rs:75-75 | No standalone documentation summary; use the family contract and source entry. |
| `pub use insert::InsertBuilder;` | rust/lance/src/dataset/write.rs:76-76 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn write_data_file_part( &self, target: &DataFileTarget, blob_ids: Option&lt;Range&lt;u32&gt;&gt;, data: impl Stream&lt;Item = Result&lt;RecordBatch&gt;&gt; + Send, ) -&gt; Result&lt;DataFilePart&gt;` | rust/lance/src/dataset/write.rs:156-161 | Encode one managed part and return its serializable description. |
| `pub async fn concat_data_file_parts( &self, target: &DataFileTarget, ordered_parts: &[DataFilePart], ) -&gt; Result&lt;DataFile&gt;` | rust/lance/src/dataset/write.rs:283-287 | Reopen, validate, and concatenate parts into the final data file. |
| `pub enum WriteDestination&lt;'a&gt;` | rust/lance/src/dataset/write.rs:351-351 | The destination to write data to. |
| `pub fn dataset(&self) -&gt; Option&lt;&Dataset&gt;` | rust/lance/src/dataset/write.rs:359-359 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn uri(&self) -&gt; String` | rust/lance/src/dataset/write.rs:366-366 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum WriteMode` | rust/lance/src/dataset/write.rs:400-400 | The mode to write dataset. |
| `pub enum ExternalBlobMode` | rust/lance/src/dataset/write.rs:427-427 | The strategy for handling external blob URIs on write. |
| `pub struct AutoCleanupParams` | rust/lance/src/dataset/write.rs:532-532 | Auto cleanup parameters |
| `pub interval: usize,` | rust/lance/src/dataset/write.rs:533-533 | No standalone documentation summary; use the family contract and source entry. |
| `pub older_than: TimeDelta,` | rust/lance/src/dataset/write.rs:534-534 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct WriteParams` | rust/lance/src/dataset/write.rs:548-548 | Dataset Write Parameters |
| `pub max_rows_per_file: usize,` | rust/lance/src/dataset/write.rs:550-550 | Max number of records per file. |
| `pub max_rows_per_group: usize,` | rust/lance/src/dataset/write.rs:553-553 | Max number of rows per row group. |
| `pub max_bytes_per_file: usize,` | rust/lance/src/dataset/write.rs:566-566 | Max file size in bytes. |
| `pub mode: WriteMode,` | rust/lance/src/dataset/write.rs:569-569 | Write mode |
| `pub store_params: Option&lt;ObjectStoreParams&gt;,` | rust/lance/src/dataset/write.rs:576-576 | Default object store params for the write. |
| `pub base_store_params: Option&lt;HashMap&lt;String, ObjectStoreParams&gt;&gt;,` | rust/lance/src/dataset/write.rs:581-581 | Exact object store params per base path URI, taking precedence over `base_&lt;id&gt;.&lt;key&gt;` storage options in [`Self::store_params`]. See [`Self::with_base_store_params`]. |
| `pub progress: Arc&lt;dyn WriteFragmentProgress&gt;,` | rust/lance/src/dataset/write.rs:583-583 | No standalone documentation summary; use the family contract and source entry. |
| `pub write_progress: Option&lt;WriteProgressFn&gt;,` | rust/lance/src/dataset/write.rs:590-590 | Optional callback invoked after each batch is written. |
| `pub commit_handler: Option&lt;Arc&lt;dyn CommitHandler&gt;&gt;,` | rust/lance/src/dataset/write.rs:599-599 | If present, dataset will use this to update the latest version |
| `pub data_storage_version: Option&lt;LanceFileVersion&gt;,` | rust/lance/src/dataset/write.rs:610-610 | The format version to use when writing data. |
| `pub enable_stable_row_ids: bool,` | rust/lance/src/dataset/write.rs:616-616 | Experimental: if set to true, the writer will use stable row ids. These row ids are stable after compaction operations, but not after updates. This makes compaction more efficient, since with stable row ids no secondary indices need to be updated to point to new row ids. |
| `pub enable_v2_manifest_paths: bool,` | rust/lance/src/dataset/write.rs:623-623 | If set to true, and this is a new dataset, uses the new v2 manifest paths. These allow constant-time lookups for the latest manifest on object storage. This parameter has no effect on existing datasets. To migrate an existing dataset, use the [`super::Dataset::migrate_manifest_paths_v2`] method. Default is True. |
| `pub session: Option&lt;Arc&lt;Session&gt;&gt;,` | rust/lance/src/dataset/write.rs:625-625 | No standalone documentation summary; use the family contract and source entry. |
| `pub auto_cleanup: Option&lt;AutoCleanupParams&gt;,` | rust/lance/src/dataset/write.rs:641-641 | If Some and this is a new dataset, old dataset versions will be automatically cleaned up after commits according to the parameters set out in [`AutoCleanupParams`]. This parameter has no effect on existing datasets. To add auto-cleanup to an existing dataset, use [`Dataset::update_config`] to set `lance.auto_cleanup.interval` and `lance.auto_cleanup.older_than`. Both parameters must be set to invoke auto-cleanup. |
| `pub skip_auto_cleanup: bool,` | rust/lance/src/dataset/write.rs:647-647 | If true, skip auto cleanup during commits. This should be set to true for high frequency writes to improve performance. This is also useful if the writer does not have delete permissions and the clean up would just try and log a failure anyway. Default is false. |
| `pub transaction_properties: Option&lt;Arc&lt;HashMap&lt;String, String&gt;&gt;&gt;,` | rust/lance/src/dataset/write.rs:652-652 | Configuration key-value pairs for this write operation. This can include commit messages, engine information, etc. this properties map will be persisted as part of Transaction object. |
| `pub initial_bases: Option&lt;Vec&lt;BasePath&gt;&gt;,` | rust/lance/src/dataset/write.rs:658-658 | New base paths to register in the manifest during dataset creation. Each BasePath must have a properly assigned ID (non-zero). Only used in CREATE/OVERWRITE modes for manifest registration. IDs should be assigned by the caller before passing to WriteParams. |
| `pub target_bases: Option&lt;Vec&lt;u32&gt;&gt;,` | rust/lance/src/dataset/write.rs:668-668 | Target base IDs for writing data files. When provided, all new data files will be written to bases with these IDs. Used in all modes (CREATE, APPEND, OVERWRITE) to specify where data should be written. The IDs must correspond to either: - IDs in initial_bases (for CREATE/OVERWRITE modes) - IDs already registered in the existing dataset manifest (for APPEND mode) - [`PRIMARY_BASE_ID`] (0), which targets the dataset's primary storage and participates in the round-robin like any other entry |
| `pub target_base_names_or_paths: Option&lt;Vec&lt;String&gt;&gt;,` | rust/lance/src/dataset/write.rs:674-674 | Target base names or paths as strings (unresolved). These will be resolved to IDs when the write operation executes. Resolution happens at builder execution time when dataset context is available. An entry equal to the dataset's URI targets the dataset's primary storage. |
| `pub target_all_bases: Option&lt;bool&gt;,` | rust/lance/src/dataset/write.rs:681-681 | Target every base registered in the dataset manifest, resolved when the write executes. `Some(include_primary)`: when `include_primary` is true the dataset's primary storage participates in the rotation as the first slot. Cannot be combined with `target_bases` or `target_base_names_or_paths`. |
| `pub allow_external_blob_outside_bases: bool,` | rust/lance/src/dataset/write.rs:685-685 | Allow writing external blob URIs that cannot be mapped to any registered non-dataset-root base path. When disabled, such rows are rejected. |
| `pub external_blob_mode: ExternalBlobMode,` | rust/lance/src/dataset/write.rs:688-688 | The strategy used when writing external blob URIs. |
| `pub blob_pack_file_size_threshold: Option&lt;usize&gt;,` | rust/lance/src/dataset/write.rs:693-693 | Maximum size in bytes for blob v2 pack (.blob) sidecar files. When a pack file reaches this size, a new one is started. If not set, defaults to 1 GiB. |
| `pub file_writer_options: Option&lt;FileWriterOptions&gt;,` | rust/lance/src/dataset/write.rs:700-700 | File writer options to use when writing data files. |
| `pub fn with_storage_version(version: LanceFileVersion) -&gt; Self` | rust/lance/src/dataset/write.rs:739-739 | Create a new WriteParams with the given storage version. The other fields are set to their default values. |
| `pub fn storage_version_or_default(&self) -&gt; ConcreteFileVersion` | rust/lance/src/dataset/write.rs:746-746 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn store_registry(&self) -&gt; Arc&lt;ObjectStoreRegistry&gt;` | rust/lance/src/dataset/write.rs:750-750 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_base_store_params( mut self, base_path: impl AsRef&lt;str&gt;, store_params: ObjectStoreParams, ) -&gt; Self` | rust/lance/src/dataset/write.rs:763-767 | Set exact runtime object store params for a registered base path. |
| `pub fn with_transaction_properties(self, properties: HashMap&lt;String, String&gt;) -&gt; Self` | rust/lance/src/dataset/write.rs:775-775 | Set the properties for this WriteParams. |
| `pub fn with_initial_bases(self, bases: Vec&lt;BasePath&gt;) -&gt; Self` | rust/lance/src/dataset/write.rs:787-787 | Set the initial_bases for this WriteParams. |
| `pub fn with_target_bases(self, base_ids: Vec&lt;u32&gt;) -&gt; Self` | rust/lance/src/dataset/write.rs:800-800 | Set the target_bases for this WriteParams. |
| `pub fn with_target_base_names_or_paths(self, references: Vec&lt;String&gt;) -&gt; Self` | rust/lance/src/dataset/write.rs:821-821 | Store target base names or paths for deferred resolution. |
| `pub fn with_target_all_bases(self, include_primary: bool) -&gt; Self` | rust/lance/src/dataset/write.rs:834-834 | Target every base registered in the dataset manifest, resolved when the write executes. When `include_primary` is true the dataset's primary storage participates in the rotation as the first slot. |
| `pub fn with_allow_external_blob_outside_bases(self, allow: bool) -&gt; Self` | rust/lance/src/dataset/write.rs:842-842 | Configure whether external blobs outside registered bases are allowed. |
| `pub fn with_external_blob_mode(self, mode: ExternalBlobMode) -&gt; Self` | rust/lance/src/dataset/write.rs:850-850 | Configure how external blob URIs are handled during writes. |
| `pub fn with_blob_pack_file_size_threshold(self, max_bytes: usize) -&gt; Self` | rust/lance/src/dataset/write.rs:858-858 | Set the maximum size in bytes for blob v2 pack (.blob) sidecar files. |
| `pub async fn write_fragments( dest: impl Into&lt;WriteDestination&lt;'_&gt;&gt;, data: impl StreamingWriteSource, params: WriteParams, ) -&gt; Result&lt;Transaction&gt;` | rust/lance/src/dataset/write.rs:875-879 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn validate_and_resolve_target_bases( params: &mut WriteParams, existing_base_paths: Option&lt;&HashMap&lt;u32, BasePath&gt;&gt;, ) -&gt; Result&lt;Option&lt;Vec&lt;TargetBaseInfo&gt;&gt;&gt;` | rust/lance/src/dataset/write.rs:1312-1315 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn write_fragments_internal( storage_version: ConcreteFileVersion, dataset: Option&lt;&Dataset&gt;, object_store: Arc&lt;ObjectStore&gt;, base_dir: &Path, schema: Schema, data: SendableRecordBatchStream, params: WriteParams, target_bases_info: Option&lt;Vec&lt;TargetBaseInfo&gt;&gt;, ) -&gt; Result&lt;(Vec&lt;Fragment&gt;, Schema)&gt;` | rust/lance/src/dataset/write.rs:1734-1743 | Writes the given data to the dataset and returns fragments. |
| `pub trait GenericWriter: Send` | rust/lance/src/dataset/write.rs:2016-2016 | No standalone documentation summary; use the family contract and source entry. |
| `pub const PRIMARY_BASE_ID: u32 = 0;` | rust/lance/src/dataset/write.rs:2509-2509 | Reserved base id that refers to the dataset's primary storage in [`WriteParams::target_bases`]. Real base ids are assigned starting from 1, so 0 is never a registered base. Files written through a primary slot carry no base id, exactly like a write without target bases. |
| `pub struct TargetBaseInfo` | rust/lance/src/dataset/write.rs:2514-2514 | Information about a target base for writing. Contains the base ID, object store, directory path, and whether it's a dataset root. |
| `pub base_id: u32,` | rust/lance/src/dataset/write.rs:2517-2517 | The registered base id, or [`PRIMARY_BASE_ID`] for the dataset's primary storage. |
| `pub object_store: Arc&lt;ObjectStore&gt;,` | rust/lance/src/dataset/write.rs:2518-2518 | No standalone documentation summary; use the family contract and source entry. |
| `pub base_dir: Path,` | rust/lance/src/dataset/write.rs:2520-2520 | The base directory path (without /data subdirectory) |
| `pub is_dataset_root: bool,` | rust/lance/src/dataset/write.rs:2524-2524 | Whether this base path is a dataset root. If true, /data will be added when creating file paths. If false, files will be written directly to base_dir. |
| `pub fn new( object_store: Arc&lt;ObjectStore&gt;, base_dir: &Path, schema: &Schema, open_writer: OpenWriter, target_bases_info: Option&lt;Vec&lt;TargetBaseInfo&gt;&gt;, external_base_resolver: Option&lt;Arc&lt;ExternalBaseResolver&gt;&gt;, allow_external_blob_outside_bases: bool, external_blob_mode: ExternalBlobMode, source_store_registry: Arc&lt;ObjectStoreRegistry&gt;, source_store_params: ObjectStoreParams, blob_pack_file_size_threshold: Option&lt;usize&gt;, file_writer_options: FileWriterOptions, preassigned_data_file_name: Option&lt;Arc&lt;String&gt;&gt;, ) -&gt; Self` | rust/lance/src/dataset/write.rs:2555-2569 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn new_writer(&self) -&gt; Result&lt;(Box&lt;dyn GenericWriter&gt;, Fragment)&gt;` | rust/lance/src/dataset/write.rs:2600-2600 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-src-dataset-write-commit-rs"></a>

## `rust/lance/src/dataset/write/commit.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct CommitBuilder&lt;'a&gt;` | rust/lance/src/dataset/write/commit.rs:38-38 | Create a new commit from a [`Transaction`]. |
| `pub const DEFAULT_COMMIT_TIMEOUT: Duration = Duration::from_secs(1800);` | rust/lance/src/dataset/write/commit.rs:64-64 | Default timeout applied to [`CommitBuilder::execute`] when none is set. |
| `pub fn new(dest: impl Into&lt;WriteDestination&lt;'a&gt;&gt;) -&gt; Self` | rust/lance/src/dataset/write/commit.rs:67-67 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn use_stable_row_ids(mut self, use_stable_row_ids: bool) -&gt; Self` | rust/lance/src/dataset/write/commit.rs:98-98 | Whether to use stable row ids. This makes the `_rowid` column stable after compaction, but not updates. |
| `pub fn with_storage_format(mut self, storage_format: LanceFileVersion) -&gt; Self` | rust/lance/src/dataset/write/commit.rs:113-113 | Pass the storage format to use for the dataset. |
| `pub fn with_object_store(mut self, object_store: Arc&lt;ObjectStore&gt;) -&gt; Self` | rust/lance/src/dataset/write/commit.rs:125-125 | Pass an object store to use. |
| `pub fn with_source_store(mut self, source_store: Arc&lt;ObjectStore&gt;) -&gt; Self` | rust/lance/src/dataset/write/commit.rs:137-137 | Pass the object store of the dataset being cloned from. |
| `pub fn with_source_dataset(self, source: &Dataset) -&gt; Self` | rust/lance/src/dataset/write/commit.rs:146-146 | Pass the object store of the dataset being cloned from. |
| `pub fn with_commit_handler(mut self, commit_handler: Arc&lt;dyn CommitHandler&gt;) -&gt; Self` | rust/lance/src/dataset/write/commit.rs:155-155 | Pass a commit handler to use for the dataset. |
| `pub fn with_store_params(mut self, store_params: ObjectStoreParams) -&gt; Self` | rust/lance/src/dataset/write/commit.rs:163-163 | Pass store parameters to use for the dataset. |
| `pub fn with_session(mut self, session: Arc&lt;Session&gt;) -&gt; Self` | rust/lance/src/dataset/write/commit.rs:176-176 | Pass a session to use for the dataset. |
| `pub fn enable_v2_manifest_paths(mut self, enable: bool) -&gt; Self` | rust/lance/src/dataset/write/commit.rs:190-190 | If set to true, and this is a new dataset, uses the new v2 manifest paths. These allow constant-time lookups for the latest manifest on object storage. This parameter has no effect on existing datasets. To migrate an existing dataset, use the [`Dataset::migrate_manifest_paths_v2`] method. **Default is True.** |
| `pub fn with_detached(mut self, detached: bool) -&gt; Self` | rust/lance/src/dataset/write/commit.rs:201-201 | Commit a version that is not part of the mainline history. |
| `pub fn with_max_retries(mut self, max_retries: u32) -&gt; Self` | rust/lance/src/dataset/write/commit.rs:209-209 | Set the maximum number of retries for commit operations. |
| `pub fn with_retry_timeout(mut self, retry_timeout: Duration) -&gt; Self` | rust/lance/src/dataset/write/commit.rs:229-229 | Set the wall-clock budget used by commit conflict backoff. |
| `pub fn with_skip_auto_cleanup(mut self, skip_auto_cleanup: bool) -&gt; Self` | rust/lance/src/dataset/write/commit.rs:234-234 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_affected_rows(mut self, affected_rows: RowAddrTreeMap) -&gt; Self` | rust/lance/src/dataset/write/commit.rs:241-241 | Provide the set of row addresses that were deleted or updated. This is used to perform fast conflict resolution. |
| `pub fn with_timeout(mut self, timeout: Option&lt;Duration&gt;) -&gt; Self` | rust/lance/src/dataset/write/commit.rs:260-260 | Set a timeout for the commit operation. |
| `pub fn with_transaction_properties( mut self, transaction_properties: HashMap&lt;String, String&gt;, ) -&gt; Self` | rust/lance/src/dataset/write/commit.rs:268-271 | provide Configuration key-value pairs associated with this transaction. This is used to store metadata about the transaction, such as commit messages, engine information, etc. this properties map will be persisted as a part of the transaction object |
| `pub async fn execute(self, transaction: Transaction) -&gt; Result&lt;Dataset&gt;` | rust/lance/src/dataset/write/commit.rs:310-310 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn execute_batch(self, transactions: Vec&lt;Transaction&gt;) -&gt; Result&lt;BatchCommitResult&gt;` | rust/lance/src/dataset/write/commit.rs:588-588 | Commit a set of transactions as a single new version. |
| `pub struct BatchCommitResult` | rust/lance/src/dataset/write/commit.rs:625-625 | No standalone documentation summary; use the family contract and source entry. |
| `pub dataset: Dataset,` | rust/lance/src/dataset/write/commit.rs:626-626 | No standalone documentation summary; use the family contract and source entry. |
| `pub merged: Transaction,` | rust/lance/src/dataset/write/commit.rs:628-628 | The final transaction that was committed. |


<a id="source-rust-lance-src-dataset-write-delete-rs"></a>

## `rust/lance/src/dataset/write/delete.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct DeleteResult` | rust/lance/src/dataset/write/delete.rs:27-27 | Result of a delete operation. |
| `pub new_dataset: Arc&lt;Dataset&gt;,` | rust/lance/src/dataset/write/delete.rs:29-29 | The new dataset after the delete operation. |
| `pub num_deleted_rows: u64,` | rust/lance/src/dataset/write/delete.rs:31-31 | The number of rows that were deleted. |
| `pub struct UncommittedDelete` | rust/lance/src/dataset/write/delete.rs:40-40 | Result of a staged delete operation. |
| `pub transaction: Transaction,` | rust/lance/src/dataset/write/delete.rs:42-42 | The transaction to commit. |
| `pub affected_rows: Option&lt;RowAddrTreeMap&gt;,` | rust/lance/src/dataset/write/delete.rs:44-44 | The row addresses affected by the delete, if available. |
| `pub num_deleted_rows: u64,` | rust/lance/src/dataset/write/delete.rs:46-46 | The number of rows that were deleted. |
| `pub struct DeleteBuilder` | rust/lance/src/dataset/write/delete.rs:121-121 | Builder for configuring delete operations with retry support |
| `pub fn new(dataset: Arc&lt;Dataset&gt;, predicate: impl Into&lt;String&gt;) -&gt; Self` | rust/lance/src/dataset/write/delete.rs:130-130 | Create a new DeleteBuilder with a SQL predicate string |
| `pub fn from_expr(dataset: Arc&lt;Dataset&gt;, expr: Expr) -&gt; Self` | rust/lance/src/dataset/write/delete.rs:140-140 | Create a new DeleteBuilder with a DataFusion expression filter |
| `pub fn conflict_retries(mut self, retries: u32) -&gt; Self` | rust/lance/src/dataset/write/delete.rs:150-150 | Set the number of retries for conflict resolution |
| `pub fn retry_timeout(mut self, timeout: Duration) -&gt; Self` | rust/lance/src/dataset/write/delete.rs:156-156 | Set the timeout for retry operations |
| `pub async fn execute(self) -&gt; Result&lt;DeleteResult&gt;` | rust/lance/src/dataset/write/delete.rs:162-162 | Execute the delete operation |
| `pub async fn execute_uncommitted(self) -&gt; Result&lt;UncommittedDelete&gt;` | rust/lance/src/dataset/write/delete.rs:202-202 | Execute the delete operation without committing the transaction. |
| `pub async fn delete(ds: &mut Dataset, predicate: &str) -&gt; Result&lt;DeleteResult&gt;` | rust/lance/src/dataset/write/delete.rs:384-384 | Legacy delete function - uses DeleteBuilder with no retries for backwards compatibility |

<a id="source-rust-lance-src-dataset-write-insert-rs"></a>

## `rust/lance/src/dataset/write/insert.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct InsertBuilder&lt;'a&gt;` | rust/lance/src/dataset/write/insert.rs:51-51 | Insert or create a new dataset. |
| `pub fn new(dest: impl Into&lt;WriteDestination&lt;'a&gt;&gt;) -&gt; Self` | rust/lance/src/dataset/write/insert.rs:61-61 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_params(mut self, params: &'a WriteParams) -&gt; Self` | rust/lance/src/dataset/write/insert.rs:71-71 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn progress(mut self, callback: impl Fn(WriteStats) + Send + Sync + 'static) -&gt; Self` | rust/lance/src/dataset/write/insert.rs:100-100 | Register a callback that is invoked after each batch of rows is written. |
| `pub async fn execute(&self, data: Vec&lt;RecordBatch&gt;) -&gt; Result&lt;Dataset&gt;` | rust/lance/src/dataset/write/insert.rs:108-108 | Execute the insert operation with the given data. |
| `pub async fn execute_stream(&self, source: impl StreamingWriteSource) -&gt; Result&lt;Dataset&gt;` | rust/lance/src/dataset/write/insert.rs:116-116 | Execute the insert operation with the given stream. |
| `pub async fn execute_uncommitted(&self, data: Vec&lt;RecordBatch&gt;) -&gt; Result&lt;Transaction&gt;` | rust/lance/src/dataset/write/insert.rs:154-154 | Write data files, but don't commit the transaction yet. |
| `pub async fn execute_uncommitted_stream( &self, source: impl StreamingWriteSource, ) -&gt; Result&lt;Transaction&gt;` | rust/lance/src/dataset/write/insert.rs:210-213 | Write data files, but don't commit the transaction yet. |


<a id="source-rust-lance-src-dataset-write-merge-insert-rs"></a>

## `rust/lance/src/dataset/write/merge_insert.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod inserted_rows;` | rust/lance/src/dataset/write/merge_insert.rs:39-39 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn format_key_values_on_columns( batch: &RecordBatch, row_idx: usize, on_columns: &[String], ) -&gt; String` | rust/lance/src/dataset/write/merge_insert.rs:338-342 | Format key values for error messages via extracting "on" column values from the given RecordBatch. |
| `pub fn create_duplicate_row_error( batch: &RecordBatch, row_idx: usize, on_columns: &[String], ) -&gt; DataFusionError` | rust/lance/src/dataset/write/merge_insert.rs:374-378 | Create duplicate rows error via extracting "on" column values from the given RecordBatch. |
| `pub enum MergeInsertWriteMode` | rust/lance/src/dataset/write/merge_insert.rs:428-428 | How a merge insert writes the merged rows to disk. |
| `pub enum WhenNotMatchedBySource` | rust/lance/src/dataset/write/merge_insert.rs:470-470 | Describes how rows should be handled when there is no matching row in the source table |
| `pub fn delete_if(dataset: &Dataset, expr: &str) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/write/merge_insert.rs:489-489 | Create an instance of WhenNotMatchedBySource::DeleteIf from an SQL filter string |
| `pub enum WhenMatched` | rust/lance/src/dataset/write/merge_insert.rs:505-505 | Describes how rows should be handled when there is a match between the target table and source table |
| `pub fn update_if(_dataset: &Dataset, expr: &str) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/write/merge_insert.rs:532-532 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn update_if_expr(expr: Expr) -&gt; Self` | rust/lance/src/dataset/write/merge_insert.rs:537-537 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum WhenNotMatched` | rust/lance/src/dataset/write/merge_insert.rs:546-546 | Describes how rows should be handled when there is no matching row in the target table |
| `pub enum SourceDedupeBehavior` | rust/lance/src/dataset/write/merge_insert.rs:562-562 | Describes how to handle duplicate source rows. |
| `pub updated_fragments: Vec&lt;Fragment&gt;,` | rust/lance/src/dataset/write/merge_insert.rs:658-658 | Existing fragments with column patches or updated row-version metadata. |
| `pub new_fragments: Vec&lt;Fragment&gt;,` | rust/lance/src/dataset/write/merge_insert.rs:660-660 | Fragments written for rows that carried no target address. |
| `pub fields_modified: Vec&lt;u32&gt;,` | rust/lance/src/dataset/write/merge_insert.rs:662-662 | Ids of the fields written, so the caller can prune indices covering them. |
| `pub matched_offsets: UpdatedFragmentOffsets,` | rust/lance/src/dataset/write/merge_insert.rs:672-672 | Physical row offsets patched in each updated fragment. |
| `pub struct MergeInsertJob` | rust/lance/src/dataset/write/merge_insert.rs:678-678 | A MergeInsertJob inserts new rows, deletes old rows, and updates existing rows all as part of a single transaction. |
| `pub struct MergeInsertBuilder` | rust/lance/src/dataset/write/merge_insert.rs:729-729 | Build a merge insert operation. |
| `pub fn try_new(dataset: Arc&lt;Dataset&gt;, on: Vec&lt;String&gt;) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/write/merge_insert.rs:743-743 | Creates a new builder |
| `pub fn when_matched(&mut self, behavior: WhenMatched) -&gt; &mut Self` | rust/lance/src/dataset/write/merge_insert.rs:804-804 | Specify what should happen when a target row matches a row in the source |
| `pub fn when_not_matched(&mut self, behavior: WhenNotMatched) -&gt; &mut Self` | rust/lance/src/dataset/write/merge_insert.rs:812-812 | Specify what should happen when a source row has no match in the target |
| `pub fn when_not_matched_by_source(&mut self, behavior: WhenNotMatchedBySource) -&gt; &mut Self` | rust/lance/src/dataset/write/merge_insert.rs:823-823 | Specify what should happen when a target row has no match in the source |
| `pub fn conflict_retries(&mut self, retries: u32) -&gt; &mut Self` | rust/lance/src/dataset/write/merge_insert.rs:835-835 | Set number of times to retry the operation if there is contention. |
| `pub fn spill_for_retry(&mut self, spill: bool) -&gt; &mut Self` | rust/lance/src/dataset/write/merge_insert.rs:856-856 | Controls whether a one-shot stream source is spilled so it can be replayed across retries. |
| `pub fn retry_timeout(&mut self, timeout: Duration) -&gt; &mut Self` | rust/lance/src/dataset/write/merge_insert.rs:870-870 | Set the timeout used to limit retries. |
| `pub fn skip_auto_cleanup(&mut self, skip: bool) -&gt; &mut Self` | rust/lance/src/dataset/write/merge_insert.rs:875-875 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn use_index(&mut self, use_index: bool) -&gt; &mut Self` | rust/lance/src/dataset/write/merge_insert.rs:886-886 | Controls whether to use indices for the merge operation. |
| `pub fn write_mode(&mut self, mode: MergeInsertWriteMode) -&gt; &mut Self` | rust/lance/src/dataset/write/merge_insert.rs:907-907 | Selects how the merged rows are written to disk. |
| `pub fn source_dedupe_behavior(&mut self, behavior: SourceDedupeBehavior) -&gt; &mut Self` | rust/lance/src/dataset/write/merge_insert.rs:922-922 | Specify how to handle duplicate source rows. |
| `pub fn mark_sstables_as_compacted(&mut self, sstables: Vec&lt;CompactedSsTable&gt;) -&gt; &mut Self` | rust/lance/src/dataset/write/merge_insert.rs:938-938 | Mark MemWAL SSTables as compacted when this commit succeeds. |
| `pub fn commit_retries(&mut self, retries: u32) -&gt; &mut Self` | rust/lance/src/dataset/write/merge_insert.rs:946-946 | Set the number of inner commit retries for manifest version conflicts. Different from `conflict_retries` which handles semantic conflicts. Default: 20 |
| `pub fn data_storage_version(&mut self, version: LanceFileVersion) -&gt; &mut Self` | rust/lance/src/dataset/write/merge_insert.rs:967-967 | Set the exact V2 data file version for rows written by this merge. |
| `pub fn target_bases(&mut self, base_ids: Vec&lt;u32&gt;) -&gt; &mut Self` | rust/lance/src/dataset/write/merge_insert.rs:983-983 | Write new fragments produced by this merge insert to these base IDs. |
| `pub fn target_base_names_or_paths(&mut self, refs: Vec&lt;String&gt;) -&gt; &mut Self` | rust/lance/src/dataset/write/merge_insert.rs:995-995 | Like [`Self::target_bases`], but referencing bases by name or path URI. |
| `pub fn target_all_bases(&mut self, include_primary: bool) -&gt; &mut Self` | rust/lance/src/dataset/write/merge_insert.rs:1007-1007 | Write new fragments produced by this merge insert to every base registered in the dataset manifest, resolved when the merge executes. When `include_primary` is true the dataset's primary storage participates in the rotation as the first slot. |
| `pub fn try_build(&mut self) -&gt; Result&lt;MergeInsertJob&gt;` | rust/lance/src/dataset/write/merge_insert.rs:1013-1013 | Crate a merge insert job |
| `pub async fn execute_reader( self, source: impl StreamingWriteSource, ) -&gt; Result&lt;(Arc&lt;Dataset&gt;, MergeStats)&gt;` | rust/lance/src/dataset/write/merge_insert.rs:1259-1262 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn execute( self, source: SendableRecordBatchStream, ) -&gt; Result&lt;(Arc&lt;Dataset&gt;, MergeStats)&gt;` | rust/lance/src/dataset/write/merge_insert.rs:2231-2234 | Executes the merge insert job from a one-shot stream source. |
| `pub async fn execute_provider( self, provider: Arc&lt;dyn TableProvider&gt;, ) -&gt; Result&lt;(Arc&lt;Dataset&gt;, MergeStats)&gt;` | rust/lance/src/dataset/write/merge_insert.rs:2249-2252 | Executes the merge insert job from a re-scannable [`TableProvider`]. |
| `pub async fn execute_batches( self, batches: Vec&lt;RecordBatch&gt;, ) -&gt; Result&lt;(Arc&lt;Dataset&gt;, MergeStats)&gt;` | rust/lance/src/dataset/write/merge_insert.rs:2263-2266 | Executes the merge insert job from materialized record batches. |
| `pub async fn execute_uncommitted_batches( self, batches: Vec&lt;RecordBatch&gt;, ) -&gt; Result&lt;UncommittedMergeInsert&gt;` | rust/lance/src/dataset/write/merge_insert.rs:2274-2277 | Like [`Self::execute_batches`] but returns the uncommitted transaction. |
| `pub async fn execute_uncommitted( self, source: impl StreamingWriteSource, ) -&gt; Result&lt;UncommittedMergeInsert&gt;` | rust/lance/src/dataset/write/merge_insert.rs:2363-2366 | Execute the merge insert job without committing the changes. |
| `pub async fn explain_plan(&self, schema: Option&lt;&Schema&gt;, verbose: bool) -&gt; Result&lt;String&gt;` | rust/lance/src/dataset/write/merge_insert.rs:3215-3215 | Generate the execution plan and return it as a formatted string for debugging. |
| `pub async fn analyze_plan(&self, source: SendableRecordBatchStream) -&gt; Result&lt;String&gt;` | rust/lance/src/dataset/write/merge_insert.rs:3267-3267 | Generate the execution plan, execute it with the provided data to collect metrics, and return the analysis. |
| `pub async fn analyze_plan_batches(&self, batches: Vec&lt;RecordBatch&gt;) -&gt; Result&lt;String&gt;` | rust/lance/src/dataset/write/merge_insert.rs:3287-3287 | [`Self::analyze_plan`] for materialized batches. |
| `pub async fn analyze_plan_provider(&self, provider: Arc&lt;dyn TableProvider&gt;) -&gt; Result&lt;String&gt;` | rust/lance/src/dataset/write/merge_insert.rs:3313-3313 | [`Self::analyze_plan`] from a re-scannable [`TableProvider`]. |
| `pub struct MergeStats` | rust/lance/src/dataset/write/merge_insert.rs:3343-3343 | Merger will store these statistics as it runs (for each batch) |
| `pub num_inserted_rows: u64,` | rust/lance/src/dataset/write/merge_insert.rs:3345-3345 | Number of inserted rows (for user statistics) |
| `pub num_updated_rows: u64,` | rust/lance/src/dataset/write/merge_insert.rs:3347-3347 | Number of updated rows (for user statistics) |
| `pub num_deleted_rows: u64,` | rust/lance/src/dataset/write/merge_insert.rs:3351-3351 | Number of deleted rows (for user statistics) Note: This is different from internal references to 'deleted_rows', since we technically "delete" updated rows during processing. However those rows are not shared with the user. |
| `pub num_attempts: u32,` | rust/lance/src/dataset/write/merge_insert.rs:3355-3355 | Number of attempts performed. |
| `pub bytes_written: u64,` | rust/lance/src/dataset/write/merge_insert.rs:3357-3357 | Total bytes written to storage. This currently only includes data files. |
| `pub num_files_written: u64,` | rust/lance/src/dataset/write/merge_insert.rs:3359-3359 | Number of data files written. This currently only includes data files. |
| `pub num_skipped_duplicates: u64,` | rust/lance/src/dataset/write/merge_insert.rs:3361-3361 | Number of duplicate source rows skipped (when SourceDedupeBehavior::FirstSeen) |
| `pub struct UncommittedMergeInsert` | rust/lance/src/dataset/write/merge_insert.rs:3364-3364 | No standalone documentation summary; use the family contract and source entry. |
| `pub transaction: Transaction,` | rust/lance/src/dataset/write/merge_insert.rs:3365-3365 | No standalone documentation summary; use the family contract and source entry. |
| `pub affected_rows: Option&lt;RowAddrTreeMap&gt;,` | rust/lance/src/dataset/write/merge_insert.rs:3366-3366 | No standalone documentation summary; use the family contract and source entry. |
| `pub stats: MergeStats,` | rust/lance/src/dataset/write/merge_insert.rs:3367-3367 | No standalone documentation summary; use the family contract and source entry. |
| `pub inserted_rows_filter: Option&lt;KeyExistenceFilter&gt;,` | rust/lance/src/dataset/write/merge_insert.rs:3368-3368 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-src-dataset-write-merge-insert-assign-action-rs"></a>

## `rust/lance/src/dataset/write/merge_insert/assign_action.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub enum Action` | rust/lance/src/dataset/write/merge_insert/assign_action.rs:23-23 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn merge_insert_action( params: &MergeInsertParams, schema: Option&lt;&arrow_schema::Schema&gt;, ) -&gt; Result&lt;Expr&gt;` | rust/lance/src/dataset/write/merge_insert/assign_action.rs:77-80 | Transforms merge insert parameters into a logical expression. The output is a single "action" column, that describes what to do with each row. |

<a id="source-rust-lance-src-dataset-write-merge-insert-exec-rs"></a>

## `rust/lance/src/dataset/write/merge_insert/exec.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use delete::DeleteOnlyMergeInsertExec;` | rust/lance/src/dataset/write/merge_insert/exec.rs:16-16 | No standalone documentation summary; use the family contract and source entry. |
| `pub use in_place::InPlaceMergeInsertExec;` | rust/lance/src/dataset/write/merge_insert/exec.rs:17-17 | No standalone documentation summary; use the family contract and source entry. |
| `pub use write::FullSchemaMergeInsertExec;` | rust/lance/src/dataset/write/merge_insert/exec.rs:18-18 | No standalone documentation summary; use the family contract and source entry. |
| `pub num_inserted_rows: Count,` | rust/lance/src/dataset/write/merge_insert/exec.rs:24-24 | No standalone documentation summary; use the family contract and source entry. |
| `pub num_updated_rows: Count,` | rust/lance/src/dataset/write/merge_insert/exec.rs:25-25 | No standalone documentation summary; use the family contract and source entry. |
| `pub num_deleted_rows: Count,` | rust/lance/src/dataset/write/merge_insert/exec.rs:26-26 | No standalone documentation summary; use the family contract and source entry. |
| `pub bytes_written: Count,` | rust/lance/src/dataset/write/merge_insert/exec.rs:27-27 | No standalone documentation summary; use the family contract and source entry. |
| `pub num_files_written: Count,` | rust/lance/src/dataset/write/merge_insert/exec.rs:28-28 | No standalone documentation summary; use the family contract and source entry. |
| `pub num_skipped_duplicates: Count,` | rust/lance/src/dataset/write/merge_insert/exec.rs:29-29 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(metrics: &ExecutionPlanMetricsSet, partition: usize) -&gt; Self` | rust/lance/src/dataset/write/merge_insert/exec.rs:47-47 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-write-merge-insert-exec-delete-rs"></a>

## `rust/lance/src/dataset/write/merge_insert/exec/delete.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct DeleteOnlyMergeInsertExec` | rust/lance/src/dataset/write/merge_insert/exec/delete.rs:46-46 | Specialized physical execution node for delete-only merge insert operations. |
| `pub fn try_new( input: Arc&lt;dyn ExecutionPlan&gt;, dataset: Arc&lt;Dataset&gt;, params: MergeInsertParams, source_skipped_duplicates: Arc&lt;AtomicU64&gt;, ) -&gt; DFResult&lt;Self&gt;` | rust/lance/src/dataset/write/merge_insert/exec/delete.rs:59-64 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn merge_stats(&self) -&gt; Option&lt;MergeStats&gt;` | rust/lance/src/dataset/write/merge_insert/exec/delete.rs:87-87 | Takes the merge statistics if the execution has completed. |
| `pub fn transaction(&self) -&gt; Option&lt;Transaction&gt;` | rust/lance/src/dataset/write/merge_insert/exec/delete.rs:95-95 | Takes the transaction if the execution has completed. |
| `pub fn affected_rows(&self) -&gt; Option&lt;RoaringTreemap&gt;` | rust/lance/src/dataset/write/merge_insert/exec/delete.rs:103-103 | Takes the affected rows (deleted row addresses) if the execution has completed. |

<a id="source-rust-lance-src-dataset-write-merge-insert-exec-in-place-rs"></a>

## `rust/lance/src/dataset/write/merge_insert/exec/in_place.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct InPlaceMergeInsertExec` | rust/lance/src/dataset/write/merge_insert/exec/in_place.rs:57-57 | Patches the source columns into the existing fragments instead of rewriting whole rows. |
| `pub fn try_new( input: Arc&lt;dyn ExecutionPlan&gt;, dataset: Arc&lt;Dataset&gt;, params: MergeInsertParams, source_skipped_duplicates: Arc&lt;AtomicU64&gt;, ) -&gt; DFResult&lt;Self&gt;` | rust/lance/src/dataset/write/merge_insert/exec/in_place.rs:72-77 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn merge_stats(&self) -&gt; Option&lt;MergeStats&gt;` | rust/lance/src/dataset/write/merge_insert/exec/in_place.rs:99-99 | Takes the merge statistics if the execution has completed. |
| `pub fn transaction(&self) -&gt; Option&lt;Transaction&gt;` | rust/lance/src/dataset/write/merge_insert/exec/in_place.rs:107-107 | Takes the transaction if the execution has completed. |


<a id="source-rust-lance-src-dataset-write-merge-insert-exec-write-rs"></a>

## `rust/lance/src/dataset/write/merge_insert/exec/write.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct FullSchemaMergeInsertExec` | rust/lance/src/dataset/write/merge_insert/exec/write.rs:219-219 | Inserts new rows and updates existing rows in the target table. |
| `pub fn try_new( input: Arc&lt;dyn ExecutionPlan&gt;, dataset: Arc&lt;Dataset&gt;, params: MergeInsertParams, source_skipped_duplicates: Arc&lt;AtomicU64&gt;, source_blob_columns: Vec&lt;String&gt;, ) -&gt; DFResult&lt;Self&gt;` | rust/lance/src/dataset/write/merge_insert/exec/write.rs:237-243 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn merge_stats(&self) -&gt; Option&lt;MergeStats&gt;` | rust/lance/src/dataset/write/merge_insert/exec/write.rs:284-284 | Takes the merge statistics if the execution has completed. Returns `None` if the execution is still in progress or hasn't started. |
| `pub fn transaction(&self) -&gt; Option&lt;Transaction&gt;` | rust/lance/src/dataset/write/merge_insert/exec/write.rs:293-293 | Takes the transaction if the execution has completed. Returns `None` if the execution is still in progress or hasn't started. |
| `pub fn inserted_rows_filter(&self) -&gt; Option&lt;KeyExistenceFilter&gt;` | rust/lance/src/dataset/write/merge_insert/exec/write.rs:303-303 | Returns the filter for inserted row keys if the execution has completed. This contains keys of newly inserted rows (not updates) for conflict detection. Returns `None` if the execution is still in progress or hasn't started. |
| `pub fn affected_rows(&self) -&gt; Option&lt;RoaringTreemap&gt;` | rust/lance/src/dataset/write/merge_insert/exec/write.rs:312-312 | Takes the affected rows (deleted/updated row addresses) if the execution has completed. Returns `None` if the execution is still in progress or hasn't started. |

<a id="source-rust-lance-src-dataset-write-merge-insert-inserted-rows-rs"></a>

## `rust/lance/src/dataset/write/merge_insert/inserted_rows.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use lance_table::format::key_existence::` | rust/lance/src/dataset/write/merge_insert/inserted_rows.rs:9-9 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-dataset-write-merge-insert-logical-plan-rs"></a>

## `rust/lance/src/dataset/write/merge_insert/logical_plan.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub enum WriteSink` | rust/lance/src/dataset/write/merge_insert/logical_plan.rs:34-34 | Which write half a planned merge insert will use. |
| `pub struct MergeInsertWriteNode` | rust/lance/src/dataset/write/merge_insert/logical_plan.rs:54-54 | Logical plan node for merge insert write. |
| `pub fn new( input: LogicalPlan, dataset: Arc&lt;Dataset&gt;, params: MergeInsertParams, source_skipped_duplicates: Arc&lt;AtomicU64&gt;, write_sink: WriteSink, source_blob_columns: Vec&lt;String&gt;, ) -&gt; Self` | rust/lance/src/dataset/write/merge_insert/logical_plan.rs:103-110 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct MergeInsertPlanner` | rust/lance/src/dataset/write/merge_insert/logical_plan.rs:262-262 | Physical planner for MergeInsertWriteNode. |

<a id="source-rust-lance-src-dataset-write-retry-rs"></a>

## `rust/lance/src/dataset/write/retry.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct RetryConfig` | rust/lance/src/dataset/write/retry.rs:15-15 | Configuration for retry behavior |
| `pub max_retries: u32,` | rust/lance/src/dataset/write/retry.rs:16-16 | No standalone documentation summary; use the family contract and source entry. |
| `pub retry_timeout: Duration,` | rust/lance/src/dataset/write/retry.rs:17-17 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait RetryExecutor: Clone` | rust/lance/src/dataset/write/retry.rs:30-30 | Trait for operations that can be retried on commit conflicts |
| `pub async fn execute_with_retry&lt;E: RetryExecutor&gt;( executor: E, dataset: Arc&lt;Dataset&gt;, config: RetryConfig, ) -&gt; Result&lt;E::Result&gt;` | rust/lance/src/dataset/write/retry.rs:45-49 | Execute an operation with retry logic for commit conflicts |

<a id="source-rust-lance-src-dataset-write-update-rs"></a>

## `rust/lance/src/dataset/write/update.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct UpdateBuilder` | rust/lance/src/dataset/write/update.rs:75-75 | Build an update operation. |
| `pub fn new(dataset: Arc&lt;Dataset&gt;) -&gt; Self` | rust/lance/src/dataset/write/update.rs:90-90 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn update_where(self, filter: &str) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/write/update.rs:113-113 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn update_where_expr(mut self, expr: Expr) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/write/update.rs:139-139 | Set the row filter from a DataFusion expression. |
| `pub fn set(mut self, column: impl AsRef&lt;str&gt;, value: &str) -&gt; Result&lt;Self&gt;` | rust/lance/src/dataset/write/update.rs:151-151 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn conflict_retries(mut self, retries: u32) -&gt; Self` | rust/lance/src/dataset/write/update.rs:231-231 | Set the number of times to retry on commit conflicts. |
| `pub fn retry_timeout(mut self, timeout: Duration) -&gt; Self` | rust/lance/src/dataset/write/update.rs:239-239 | Set the total timeout for all retries. |
| `pub fn data_storage_version(mut self, version: LanceFileVersion) -&gt; Self` | rust/lance/src/dataset/write/update.rs:261-261 | Set the exact V2 data file version for rewritten rows. |
| `pub fn build(self) -&gt; Result&lt;UpdateJob&gt;` | rust/lance/src/dataset/write/update.rs:269-269 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct UpdateResult` | rust/lance/src/dataset/write/update.rs:309-309 | No standalone documentation summary; use the family contract and source entry. |
| `pub new_dataset: Arc&lt;Dataset&gt;,` | rust/lance/src/dataset/write/update.rs:310-310 | No standalone documentation summary; use the family contract and source entry. |
| `pub rows_updated: u64,` | rust/lance/src/dataset/write/update.rs:311-311 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct UpdateData` | rust/lance/src/dataset/write/update.rs:315-315 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct UpdateJob` | rust/lance/src/dataset/write/update.rs:324-324 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn execute(self) -&gt; Result&lt;UpdateResult&gt;` | rust/lance/src/dataset/write/update.rs:334-334 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-index-rs"></a>

## `rust/lance/src/index.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use lance_index::IndexParams;` | rust/lance/src/index.rs:28-28 | No standalone documentation summary; use the family contract and source entry. |
| `pub use lance_index::progress::` | rust/lance/src/index.rs:35-35 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod frag_reuse;` | rust/lance/src/index.rs:84-84 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod frag_reuse_reader;` | rust/lance/src/index.rs:85-85 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod mem_wal;` | rust/lance/src/index.rs:88-88 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod prefilter;` | rust/lance/src/index.rs:89-89 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod scalar;` | rust/lance/src/index.rs:90-90 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod vector;` | rust/lance/src/index.rs:92-92 | No standalone documentation summary; use the family contract and source entry. |
| `pub use crate::index::api::` | rust/lance/src/index.rs:104-104 | No standalone documentation summary; use the family contract and source entry. |
| `pub use crate::index::prefilter::` | rust/lance/src/index.rs:107-107 | No standalone documentation summary; use the family contract and source entry. |
| `pub use crate::index::vector::` | rust/lance/src/index.rs:109-109 | No standalone documentation summary; use the family contract and source entry. |
| `pub use create::CreateIndexBuilder;` | rust/lance/src/index.rs:115-115 | No standalone documentation summary; use the family contract and source entry. |
| `pub use lance_index::IndexDescription;` | rust/lance/src/index.rs:116-116 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FragReuseIndexCacheKey&lt;'a&gt;` | rust/lance/src/index.rs:1763-1763 | No standalone documentation summary; use the family contract and source entry. |
| `pub uuid: &'a Uuid,` | rust/lance/src/index.rs:1764-1764 | No standalone documentation summary; use the family contract and source entry. |
| `pub fri_uuid: Option&lt;&'a Uuid&gt;,` | rust/lance/src/index.rs:1765-1765 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(uuid: &'a Uuid, fri_uuid: Option&lt;&'a Uuid&gt;) -&gt; Self` | rust/lance/src/index.rs:1769-1769 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct MemWalCacheKey&lt;'a&gt;` | rust/lance/src/index.rs:1799-1799 | No standalone documentation summary; use the family contract and source entry. |
| `pub uuid: &'a Uuid,` | rust/lance/src/index.rs:1800-1800 | No standalone documentation summary; use the family contract and source entry. |
| `pub fri_uuid: Option&lt;&'a Uuid&gt;,` | rust/lance/src/index.rs:1801-1801 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(uuid: &'a Uuid, fri_uuid: Option&lt;&'a Uuid&gt;) -&gt; Self` | rust/lance/src/index.rs:1805-1805 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait IndexBuilder` | rust/lance/src/index.rs:1884-1884 | Builds index. |
| `pub struct ScalarIndexInfo` | rust/lance/src/index.rs:2114-2114 | Snapshot of every scalar index on a dataset, captured at planning time and consumed by the scalar/aggregate pushdown machinery. |
| `pub trait DatasetIndexInternalExt: DatasetIndexExt` | rust/lance/src/index.rs:3890-3890 | A trait for internal dataset utilities |


<a id="source-rust-lance-src-index-api-rs"></a>

## `rust/lance/src/index/api.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct IndexSegment` | rust/lance/src/index/api.rs:23-23 | A single physical segment of a logical index. |
| `pub fn new&lt;I, F, C&gt;( uuid: Uuid, fragment_bitmap: I, fields: F, index_details: Arc&lt;prost_types::Any&gt;, index_version: i32, dataset_version: u64, covering_fields: C, ) -&gt; Self where I: IntoIterator&lt;Item = u32&gt;, F: IntoIterator&lt;Item = i32&gt;, C: IntoIterator&lt;Item = i32&gt;,` | rust/lance/src/index/api.rs:44-57 | Create a fully described segment with its physical build provenance. |
| `pub fn uuid(&self) -&gt; Uuid` | rust/lance/src/index/api.rs:70-70 | Return the UUID of this segment. |
| `pub fn fragment_bitmap(&self) -&gt; &RoaringBitmap` | rust/lance/src/index/api.rs:75-75 | Return the fragment coverage of this segment. |
| `pub fn fields(&self) -&gt; &[i32]` | rust/lance/src/index/api.rs:84-84 | Return the field IDs whose values are encoded in this segment. |
| `pub fn covering_fields(&self) -&gt; &[i32]` | rust/lance/src/index/api.rs:91-91 | Return the fields whose values this segment carries but is not keyed on. |
| `pub fn keyed_field(&self) -&gt; Option&lt;i32&gt;` | rust/lance/src/index/api.rs:102-102 | Return the single column this segment is keyed on, or `None` when it is keyed on several -- a genuinely composite index -- or on none at all. |
| `pub fn index_details(&self) -&gt; &Arc&lt;prost_types::Any&gt;` | rust/lance/src/index/api.rs:111-111 | Return the serialized index details for this segment. |
| `pub fn index_version(&self) -&gt; i32` | rust/lance/src/index/api.rs:116-116 | Return the on-disk index version for this segment. |
| `pub fn dataset_version(&self) -&gt; u64` | rust/lance/src/index/api.rs:121-121 | Return the source dataset version for this segment. |
| `pub fn into_parts( self, ) -&gt; ( Uuid, RoaringBitmap, Vec&lt;i32&gt;, Vec&lt;i32&gt;, Arc&lt;prost_types::Any&gt;, i32, u64, )` | rust/lance/src/index/api.rs:126-136 | Consume the segment and return its component parts. |
| `pub trait IntoIndexSegment` | rust/lance/src/index/api.rs:150-150 | Convert an existing index segment representation into [`IndexSegment`]. |
| `pub trait DatasetIndexExt` | rust/lance/src/index/api.rs:211-211 | Extends [`crate::Dataset`] with secondary index APIs. |

<a id="source-rust-lance-src-index-append-rs"></a>

## `rust/lance/src/index/append.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct IndexMergeResults&lt;'a&gt;` | rust/lance/src/index/append.rs:47-47 | No standalone documentation summary; use the family contract and source entry. |
| `pub new_uuid: Uuid,` | rust/lance/src/index/append.rs:48-48 | No standalone documentation summary; use the family contract and source entry. |
| `pub removed_indices: Vec&lt;&'a IndexMetadata&gt;,` | rust/lance/src/index/append.rs:49-49 | No standalone documentation summary; use the family contract and source entry. |
| `pub new_fragment_bitmap: RoaringBitmap,` | rust/lance/src/index/append.rs:50-50 | No standalone documentation summary; use the family contract and source entry. |
| `pub new_dataset_version: u64,` | rust/lance/src/index/append.rs:51-51 | No standalone documentation summary; use the family contract and source entry. |
| `pub new_index_version: i32,` | rust/lance/src/index/append.rs:52-52 | No standalone documentation summary; use the family contract and source entry. |
| `pub new_index_details: prost_types::Any,` | rust/lance/src/index/append.rs:53-53 | No standalone documentation summary; use the family contract and source entry. |
| `pub files: Vec&lt;lance_table::format::IndexFile&gt;,` | rust/lance/src/index/append.rs:55-55 | List of files and their sizes for the merged index |
| `pub async fn build_old_data_filter( dataset: &Dataset, effective_old_frags: &RoaringBitmap, deleted_old_frags: &RoaringBitmap, ) -&gt; Result&lt;Option&lt;OldIndexDataFilter&gt;&gt;` | rust/lance/src/index/append.rs:129-133 | Build the [`OldIndexDataFilter`] that must be applied to existing index rows when their owning fragments have been pruned by compaction or deletions. |
| `pub fn split_segment_coverage&lt;'a&gt;( dataset: &Dataset, segments: impl IntoIterator&lt;Item = &'a IndexMetadata&gt;, ) -&gt; (RoaringBitmap, RoaringBitmap)` | rust/lance/src/index/append.rs:220-223 | Split the stored fragment coverage of `segments` into fragments still live in `dataset` (`effective`) and fragments that compaction or deletion has already retired (`deleted`). |
| `pub fn fragment_reuse_affects_segments&lt;'a&gt;( frag_reuse_index: &CompactFragReuseIndex, segments: impl IntoIterator&lt;Item = &'a IndexMetadata&gt;, ) -&gt; bool` | rust/lance/src/index/append.rs:237-240 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn fragment_reuse_affects_segment( frag_reuse_index: &CompactFragReuseIndex, coverage: &RoaringBitmap, dataset_version: u64, ) -&gt; bool` | rust/lance/src/index/append.rs:249-253 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn build_per_segment_filters( dataset: &Dataset, segments: &[&IndexMetadata], ) -&gt; Result&lt;(RoaringBitmap, Vec&lt;Option&lt;OldIndexDataFilter&gt;&gt;)&gt;` | rust/lance/src/index/append.rs:278-282 | Build one [`OldIndexDataFilter`] per segment and return their effective coverage. |
| `pub async fn merge_indices&lt;'a&gt;( dataset: Arc&lt;Dataset&gt;, old_indices: &[&'a IndexMetadata], options: &OptimizeOptions, ) -&gt; Result&lt;Option&lt;IndexMergeResults&lt;'a&gt;&gt;&gt;` | rust/lance/src/index/append.rs:799-803 | Merge in-inflight unindexed data, with a specific number of previous indices into a new index, to improve the query performance. |
| `pub async fn merge_indices_with_unindexed_frags&lt;'a&gt;( dataset: Arc&lt;Dataset&gt;, old_indices: &[&'a IndexMetadata], unindexed: &[Fragment], options: &OptimizeOptions, ) -&gt; Result&lt;Option&lt;IndexMergeResults&lt;'a&gt;&gt;&gt;` | rust/lance/src/index/append.rs:989-994 | Merge a list of provided unindexed data, with a specific number of previous indices into a new index, to improve the query performance. |

<a id="source-rust-lance-src-index-create-rs"></a>

## `rust/lance/src/index/create.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct CreateIndexBuilder&lt;'a&gt;` | rust/lance/src/index/create.rs:76-76 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( dataset: &'a mut Dataset, columns: &[&str], index_type: IndexType, params: &'a dyn IndexParams, ) -&gt; Self` | rust/lance/src/index/create.rs:93-98 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn name(mut self, name: String) -&gt; Self` | rust/lance/src/index/create.rs:115-115 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn replace(mut self, replace: bool) -&gt; Self` | rust/lance/src/index/create.rs:120-120 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn train(mut self, train: bool) -&gt; Self` | rust/lance/src/index/create.rs:125-125 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn fragments(mut self, fragment_ids: Vec&lt;u32&gt;) -&gt; Self` | rust/lance/src/index/create.rs:130-130 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn index_uuid(mut self, uuid: Uuid) -&gt; Self` | rust/lance/src/index/create.rs:135-135 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn preprocessed_data(self, reader: Box&lt;dyn RecordBatchReader + Send + 'static&gt;) -&gt; Self` | rust/lance/src/index/create.rs:142-142 | Train from rows already in the B-tree's shape: sorted by value, each with its row id. An index that trains from another shape is refused. |
| `pub fn progress(mut self, p: Arc&lt;dyn IndexBuildProgress&gt;) -&gt; Self` | rust/lance/src/index/create.rs:160-160 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn transaction_properties(mut self, properties: HashMap&lt;String, String&gt;) -&gt; Self` | rust/lance/src/index/create.rs:170-170 | Set transaction properties to store with this commit. |
| `pub async fn execute_uncommitted(&mut self) -&gt; Result&lt;IndexMetadata&gt;` | rust/lance/src/index/create.rs:176-176 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-src-index-frag-reuse-rs"></a>

## `rust/lance/src/index/frag_reuse.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub async fn load_frag_reuse_index_details( dataset: &Dataset, index: &IndexMetadata, ) -&gt; lance_core::Result&lt;Arc&lt;FragReuseIndexDetails&gt;&gt;` | rust/lance/src/index/frag_reuse.rs:613-616 | Load fragment reuse index details from index metadata |
| `pub async fn frag_reuse_entry_appending( dataset: &Dataset, transitions: Vec&lt;pb_fri::Transition&gt;, ) -&gt; lance_core::Result&lt;IndexMetadata&gt;` | rust/lance/src/index/frag_reuse.rs:1240-1243 | The complete fragment reuse index entry a rewrite installs when it appends `transitions`: `dataset`'s entry (its records carried over verbatim, a v0 entry lifted to the tagged format) plus the new transitions. This is what `Operation::Rewrite::frag_reuse_index` carries for a rewrite on a tagged history. |
| `pub transitions: Vec&lt;pb_fri::Transition&gt;,` | rust/lance/src/index/frag_reuse.rs:1356-1356 | No standalone documentation summary; use the family contract and source entry. |
| `pub legacy_versions: Vec&lt;pb_fri::Version&gt;,` | rust/lance/src/index/frag_reuse.rs:1357-1357 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-src-index-frag-reuse-reader-rs"></a>

## `rust/lance/src/index/frag_reuse_reader.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct SegmentPlanParts` | rust/lance/src/index/frag_reuse_reader.rs:154-154 | One segment's derived query-time inputs from the coverage backtrack. |
| `pub coverage: RoaringBitmap,` | rust/lance/src/index/frag_reuse_reader.rs:156-156 | Live fragments this segment answers for in the current snapshot. |
| `pub excluded: RoaringBitmap,` | rust/lance/src/index/frag_reuse_reader.rs:159-159 | Fragments directly covered by other selected group members; translated paths entering them belong to those siblings. |
| `pub path: Vec&lt;usize&gt;,` | rust/lance/src/index/frag_reuse_reader.rs:163-163 | Positions (in ledger order) of the transitions this segment's rows pass through on their way to `coverage`: every transition whose resolved contributors include this segment. |
| `pub struct FragmentReuseIndex` | rust/lance/src/index/frag_reuse_reader.rs:167-167 | A validated FRI graph whose mapping payloads are opened only when needed. |
| `pub async fn open(dataset: &Dataset, index: &IndexMetadata) -&gt; Result&lt;Arc&lt;Self&gt;&gt;` | rust/lance/src/index/frag_reuse_reader.rs:175-175 | Open the history for this dataset snapshot without reading mapping labels. |
| `pub fn may_need_translation(&self, provenance: Option&lt;&RoaringBitmap&gt;) -&gt; bool` | rust/lance/src/index/frag_reuse_reader.rs:211-211 | Whether segment metadata could require translation. V1 may have projected coverage to destinations without changing addresses stored in the index. Identity requires live-only coverage disjoint from supported lineage. Dead fragments may belong to an omitted unknown mapping; those must not get an identity remapper merely because they are absent from the graph. |
| `pub fn segment_coverage(&self, provenance: &[RoaringBitmap]) -&gt; Vec&lt;RoaringBitmap&gt;` | rust/lance/src/index/frag_reuse_reader.rs:226-226 | Resolve each live fragment backwards to the nearest available index coverage. A mapping requires complete source coverage; failure for one destination does not discard another destination's coverage. Every contributing segment is retained. |
| `pub fn segment_plans(&self, provenance: &[RoaringBitmap]) -&gt; Vec&lt;SegmentPlanParts&gt;` | rust/lance/src/index/frag_reuse_reader.rs:247-247 | Resolve each segment's query coverage and sibling exclusions in one pass, so "direct coverage wins" is owned by one algorithm. |
| `pub fn translation_fingerprint( &self, coverage: &RoaringBitmap, excluded: &RoaringBitmap, path: &[usize], ) -&gt; [u8; 32]` | rust/lance/src/index/frag_reuse_reader.rs:358-363 | The translation identity of one segment: a hash of everything that decides its translated output, so cached objects that embed translated addresses can be keyed by it and go cold only when that state changes. |
| `pub async fn remap_row_ids(self: &Arc&lt;Self&gt;, row_ids: &[u64]) -&gt; Result&lt;Vec&lt;Option&lt;u64&gt;&gt;&gt;` | rust/lance/src/index/frag_reuse_reader.rs:392-392 | Remap physical row IDs through supported lineage, stopping at live fragments. Missing or deleted paths produce `None`. Input order and duplicates are preserved. |

<a id="source-rust-lance-src-index-frag-reuse-remapping-rs"></a>

## `rust/lance/src/index/frag_reuse_remapping.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub async fn inverted_supports_batch_remapping( dataset: &Dataset, index: &IndexMetadata, ) -&gt; Result&lt;bool&gt;` | rust/lance/src/index/frag_reuse_remapping.rs:59-62 | Whether a full-text segment can be loaded under a translating remapper. |
| `pub async fn vector_supports_batch_remapping( dataset: &Dataset, index: &IndexMetadata, ) -&gt; Result&lt;bool&gt;` | rust/lance/src/index/frag_reuse_remapping.rs:84-87 | Legacy vector file readers keep their existing V1 behavior and scan fallback. |

<a id="source-rust-lance-src-index-frag-reuse-with-stable-row-ids-rs"></a>

## `rust/lance/src/index/frag_reuse_with_stable_row_ids.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn has_frag_reuse_with_stable_row_ids(manifest: &Manifest, indices: &[IndexMetadata]) -&gt; bool` | rust/lance/src/index/frag_reuse_with_stable_row_ids.rs:38-38 | An empty fragment reuse index counts. |
| `pub fn apply_frag_reuse_with_stable_row_ids_flag( manifest: &mut Manifest, indices: &[IndexMetadata], )` | rust/lance/src/index/frag_reuse_with_stable_row_ids.rs:99-102 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn validate_frag_reuse_with_stable_row_ids( manifest: &Manifest, indices: &[IndexMetadata], ) -&gt; Result&lt;()&gt;` | rust/lance/src/index/frag_reuse_with_stable_row_ids.rs:112-115 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn ensure_index_allowed_with_frag_reuse( manifest: &Manifest, existing_indices: &[IndexMetadata], index: &IndexMetadata, ) -&gt; Result&lt;()&gt;` | rust/lance/src/index/frag_reuse_with_stable_row_ids.rs:175-179 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn ensure_index_kind_allowed_with_frag_reuse( manifest: &Manifest, existing_indices: &[IndexMetadata], index_kind: &str, column: &str, ) -&gt; Result&lt;()&gt;` | rust/lance/src/index/frag_reuse_with_stable_row_ids.rs:195-200 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_hidden_by_frag_reuse(index: &IndexMetadata) -&gt; bool` | rust/lance/src/index/frag_reuse_with_stable_row_ids.rs:214-214 | Only meaningful where [`has_frag_reuse_with_stable_row_ids`] holds. |
| `pub fn warn_about_indices_hidden_by_frag_reuse(manifest: &Manifest, indices: &[IndexMetadata])` | rust/lance/src/index/frag_reuse_with_stable_row_ids.rs:218-218 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn ensure_frag_reuse_applies( manifest: &Manifest, indices: &[IndexMetadata], index: &IndexMetadata, ) -&gt; Result&lt;()&gt;` | rust/lance/src/index/frag_reuse_with_stable_row_ids.rs:236-240 | Backstop for callers that load an index from the full list, not the usable view that already hides incompatible indices. |

<a id="source-rust-lance-src-index-prefilter-rs"></a>

## `rust/lance/src/index/prefilter.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use lance_index::prefilter::` | rust/lance/src/index/prefilter.rs:38-38 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct DatasetPreFilter` | rust/lance/src/index/prefilter.rs:46-46 | Filter out row ids that we know are not relevant to the query. |
| `pub fn new( dataset: Arc&lt;Dataset&gt;, indices: &[IndexMetadata], filter: Option&lt;Box&lt;dyn FilterLoader&gt;&gt;, ) -&gt; Self` | rust/lance/src/index/prefilter.rs:64-68 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn set_deleted_fragments(&mut self, fragments: RoaringBitmap)` | rust/lance/src/index/prefilter.rs:271-271 | Sets the deleted fragment IDs to block during search. |
| `pub fn with_overlay_block(mut self, block: RowAddrMask) -&gt; Self` | rust/lance/src/index/prefilter.rs:277-277 | Block specific row addresses from index results because their index entries are stale due to a data overlay committed after the index was built. |
| `pub fn create_deletion_mask( dataset: Arc&lt;Dataset&gt;, fragments: RoaringBitmap, ) -&gt; Option&lt;BoxFuture&lt;'static, Result&lt;Arc&lt;RowAddrMask&gt;&gt;&gt;&gt;` | rust/lance/src/index/prefilter.rs:298-301 | Creates a task to load a mask that filters out deleted rows and, when `restrict_to_fragments` is true, also restricts results to only the given `fragments`. |
| `pub fn create_restricted_deletion_mask( dataset: Arc&lt;Dataset&gt;, fragments: RoaringBitmap, ) -&gt; Option&lt;BoxFuture&lt;'static, Result&lt;Arc&lt;RowAddrMask&gt;&gt;&gt;&gt;` | rust/lance/src/index/prefilter.rs:307-310 | Like [`Self::create_deletion_mask`] but also restricts results to the given `fragments`, blocking any row from a fragment not in the set. |

<a id="source-rust-lance-src-index-scalar-rs"></a>

## `rust/lance/src/index/scalar.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use inverted::` | rust/lance/src/index/scalar.rs:20-20 | No standalone documentation summary; use the family contract and source entry. |
| `pub use crate::index::scalar_logical::` | rust/lance/src/index/scalar.rs:22-22 | No standalone documentation summary; use the family contract and source entry. |
| `pub fragment_ids: Option&lt;Vec&lt;u32&gt;&gt;,` | rust/lance/src/index/scalar.rs:75-75 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_fragment_ids( _dataset: Arc&lt;Dataset&gt;, _column: String, fragment_ids: Vec&lt;u32&gt;, ) -&gt; Self` | rust/lance/src/index/scalar.rs:79-83 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct IndexDetails(pub Arc&lt;prost_types::Any&gt;);` | rust/lance/src/index/scalar.rs:290-290 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn is_vector(&self) -&gt; bool` | rust/lance/src/index/scalar.rs:294-294 | Returns true if the index is a vector index |
| `pub fn supports_fts(&self) -&gt; bool` | rust/lance/src/index/scalar.rs:299-299 | Returns true if the index supports FTS |
| `pub fn supports_minhash(&self) -&gt; bool` | rust/lance/src/index/scalar.rs:305-305 | Returns true if the index supports MinHash similarity search |
| `pub fn get_plugin(&self) -&gt; Result&lt;&dyn ScalarIndexPlugin&gt;` | rust/lance/src/index/scalar.rs:310-310 | Returns the plugin for the index |
| `pub fn index_version(&self) -&gt; Result&lt;u32&gt;` | rust/lance/src/index/scalar.rs:332-332 | Returns the index version |
| `pub async fn fetch_index_details( dataset: &Dataset, column: &str, index: &IndexMetadata, ) -&gt; Result&lt;Arc&lt;prost_types::Any&gt;&gt;` | rust/lance/src/index/scalar.rs:512-516 | Fetches the scalar index plugin for a given index metadata |
| `pub async fn open_scalar_index( dataset: &Dataset, column: &str, index: &IndexMetadata, metrics: &dyn MetricsCollector, ) -&gt; Result&lt;Arc&lt;dyn ScalarIndex&gt;&gt;` | rust/lance/src/index/scalar.rs:579-584 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn index_matches_criteria( index: &IndexMetadata, criteria: &IndexCriteria, fields: &[&Field], has_multiple_indices: bool, schema: &lance_core::datatypes::Schema, ) -&gt; Result&lt;bool&gt;` | rust/lance/src/index/scalar.rs:779-785 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn initialize_scalar_index( target_dataset: &mut Dataset, source_dataset: &Dataset, source_index: &IndexMetadata, field_names: &[&str], ) -&gt; Result&lt;()&gt;` | rust/lance/src/index/scalar.rs:886-891 | Initialize a scalar index from a source dataset |

<a id="source-rust-lance-src-index-scalar-inverted-rs"></a>

## `rust/lance/src/index/scalar/inverted.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub final_field_id: i32,` | rust/lance/src/index/scalar/inverted.rs:66-66 | No standalone documentation summary; use the family contract and source entry. |
| `pub root_column: String,` | rust/lance/src/index/scalar/inverted.rs:67-67 | No standalone documentation summary; use the family contract and source entry. |
| `pub canonical_path: String,` | rust/lance/src/index/scalar/inverted.rs:68-68 | No standalone documentation summary; use the family contract and source entry. |
| `pub document_granularity: DocumentGranularity,` | rust/lance/src/index/scalar/inverted.rs:69-69 | No standalone documentation summary; use the family contract and source entry. |
| `pub row_index: usize,` | rust/lance/src/index/scalar/inverted.rs:77-77 | No standalone documentation summary; use the family contract and source entry. |
| `pub text: String,` | rust/lance/src/index/scalar/inverted.rs:78-78 | No standalone documentation summary; use the family contract and source entry. |
| `pub doc_index: Vec&lt;u32&gt;,` | rust/lance/src/index/scalar/inverted.rs:79-79 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn has_lists(&self) -&gt; bool` | rust/lance/src/index/scalar/inverted.rs:83-83 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn coordinate_rank(&self) -&gt; usize` | rust/lance/src/index/scalar/inverted.rs:87-87 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn documents_from_batch(&self, batch: &RecordBatch) -&gt; Result&lt;Vec&lt;FtsDocument&gt;&gt;` | rust/lance/src/index/scalar/inverted.rs:95-95 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn load_segments( dataset: &Dataset, column: &str, document_granularity: DocumentGranularity, ) -&gt; Result&lt;Option&lt;Vec&lt;IndexMetadata&gt;&gt;&gt;` | rust/lance/src/index/scalar/inverted.rs:1032-1036 | Load all committed inverted-index segments that belong to the same named FTS index on `column`. |
| `pub async fn load_segment_details( dataset: &Dataset, column: &str, segments: &[IndexMetadata], ) -&gt; Result&lt;InvertedIndexDetails&gt;` | rust/lance/src/index/scalar/inverted.rs:1104-1108 | Load and validate the shared [`InvertedIndexDetails`] across committed segments returned by [`load_segments`]. |
| `pub async fn load_segment_params( dataset: &Dataset, segment: &IndexMetadata, ) -&gt; Result&lt;InvertedIndexParams&gt;` | rust/lance/src/index/scalar/inverted.rs:1162-1165 | Read one segment's [`InvertedIndexParams`] |

<a id="source-rust-lance-src-index-scalar-logical-rs"></a>

## `rust/lance/src/index/scalar_logical.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct LogicalScalarIndex` | rust/lance/src/index/scalar_logical.rs:46-46 | Query-time view that exposes several physical scalar index segments as a single [`ScalarIndex`]. |
| `pub fn try_new( name: String, column: String, segments: Vec&lt;Arc&lt;dyn ScalarIndex&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/index/scalar_logical.rs:60-64 | Merge several already-opened segments of one scalar index into a single searchable [`ScalarIndex`]. |
| `pub async fn load_named_scalar_segments( dataset: &Dataset, column: &str, index_name: &str, ) -&gt; Result&lt;Vec&lt;IndexMetadata&gt;&gt;` | rust/lance/src/index/scalar_logical.rs:270-274 | List the committed, dataset-intersecting segments of a named scalar index. |
| `pub async fn scalar_index_fragment_bitmap( dataset: &Dataset, column: &str, index_name: &str, ) -&gt; Result&lt;Option&lt;RoaringBitmap&gt;&gt;` | rust/lance/src/index/scalar_logical.rs:328-332 | Return the union of fragment bitmaps across every usable segment of a named scalar index. |
| `pub async fn open_named_scalar_index( dataset: &Dataset, column: &str, index_name: &str, metrics: &dyn MetricsCollector, ) -&gt; Result&lt;Arc&lt;dyn ScalarIndex&gt;&gt;` | rust/lance/src/index/scalar_logical.rs:351-356 | Open a named scalar index, transparently bundling multiple segments when present. |
| `pub async fn open_scalar_index_segments( dataset: &Dataset, column: &str, index_name: &str, fragments: Option&lt;&RoaringBitmap&gt;, metrics: &dyn MetricsCollector, ) -&gt; Result&lt;Arc&lt;dyn ScalarIndex&gt;&gt;` | rust/lance/src/index/scalar_logical.rs:364-371 | Open scalar index segments whose coverage intersects `fragments`. |

<a id="source-rust-lance-src-index-vector-rs"></a>

## `rust/lance/src/index/vector.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod builder;` | rust/lance/src/index/vector.rs:12-12 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod dedup;` | rust/lance/src/index/vector.rs:13-13 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod hamming;` | rust/lance/src/index/vector.rs:15-15 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod ivf;` | rust/lance/src/index/vector.rs:16-16 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod pq;` | rust/lance/src/index/vector.rs:17-17 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod utils;` | rust/lance/src/index/vector.rs:18-18 | No standalone documentation summary; use the family contract and source entry. |
| `pub const LANCE_VECTOR_INDEX: &str = "__lance_vector_index";` | rust/lance/src/index/vector.rs:76-76 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct LogicalVectorIndex` | rust/lance/src/index/vector.rs:80-80 | A materialized snapshot of one logical vector index and all of its segments. |
| `pub struct LogicalIvfView&lt;'a&gt;` | rust/lance/src/index/vector.rs:92-92 | An IVF-specific inspection and maintenance view over a [`LogicalVectorIndex`]. |
| `pub fn name(&self) -&gt; &str` | rust/lance/src/index/vector.rs:117-117 | Returns the logical index name. |
| `pub fn column(&self) -&gt; &str` | rust/lance/src/index/vector.rs:122-122 | Returns the vector column that this logical index is built on. |
| `pub fn num_segments(&self) -&gt; usize` | rust/lance/src/index/vector.rs:127-127 | Returns the number of physical segments in this logical index. |
| `pub fn metadatas(&self) -&gt; impl ExactSizeIterator&lt;Item = &IndexMetadata&gt; + '_` | rust/lance/src/index/vector.rs:132-132 | Returns the committed metadata for all physical segments. |
| `pub fn num_rows_per_segment(&self) -&gt; Vec&lt;(Uuid, u64)&gt;` | rust/lance/src/index/vector.rs:137-137 | Returns the indexed row count for each segment. |
| `pub fn as_ivf(&self) -&gt; Result&lt;LogicalIvfView&lt;'_&gt;&gt;` | rust/lance/src/index/vector.rs:149-149 | Returns an IVF view over this logical index. |
| `pub fn num_partitions_per_segment(&self) -&gt; Vec&lt;(Uuid, usize)&gt;` | rust/lance/src/index/vector.rs:176-176 | Returns the partition count for each segment in this IVF index. |
| `pub fn partition_sizes(&self) -&gt; Vec&lt;(Uuid, Vec&lt;usize&gt;)&gt;` | rust/lance/src/index/vector.rs:184-184 | Returns the partition sizes for each segment in this IVF index. |
| `pub async fn read_partition( &self, partition_id: usize, with_vector: bool, ) -&gt; Result&lt;SendableRecordBatchStream&gt;` | rust/lance/src/index/vector.rs:201-205 | Reads one IVF partition across all segments in this logical index. |
| `pub enum StageParams` | rust/lance/src/index/vector.rs:234-234 | Parameters of each index stage. |
| `pub enum IndexFileVersion` | rust/lance/src/index/vector.rs:246-246 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn try_from(version: &str) -&gt; Result&lt;Self&gt;` | rust/lance/src/index/vector.rs:252-252 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct VectorIndexParams` | rust/lance/src/index/vector.rs:266-266 | The parameters to build vector index. |
| `pub stages: Vec&lt;StageParams&gt;,` | rust/lance/src/index/vector.rs:267-267 | No standalone documentation summary; use the family contract and source entry. |
| `pub metric_type: MetricType,` | rust/lance/src/index/vector.rs:270-270 | Vector distance metrics type. |
| `pub version: IndexFileVersion,` | rust/lance/src/index/vector.rs:273-273 | The version of the index file. |
| `pub skip_transpose: bool,` | rust/lance/src/index/vector.rs:276-276 | Skip transpose / packing for PQ and RQ storage. |
| `pub runtime_hints: HashMap&lt;String, String&gt;,` | rust/lance/src/index/vector.rs:281-281 | Runtime hints: optional build preferences stored in the index manifest. Keys use reverse-DNS namespacing (e.g., "lance.ivf.max_iters"). Populated by the build path and merged into VectorIndexDetails at creation time. |
| `pub fn version(&mut self, version: IndexFileVersion) -&gt; &mut Self` | rust/lance/src/index/vector.rs:285-285 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn skip_transpose(&mut self, skip_transpose: bool) -&gt; &mut Self` | rust/lance/src/index/vector.rs:290-290 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn ivf_flat(num_partitions: usize, metric_type: MetricType) -&gt; Self` | rust/lance/src/index/vector.rs:295-295 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_ivf_flat_params(metric_type: MetricType, ivf: IvfBuildParams) -&gt; Self` | rust/lance/src/index/vector.rs:307-307 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn ivf_pq( num_partitions: usize, num_bits: u8, num_sub_vectors: usize, metric_type: MetricType, max_iterations: usize, ) -&gt; Self` | rust/lance/src/index/vector.rs:326-332 | Create index parameters for `IVF_PQ` index. |
| `pub fn ivf_rq(num_partitions: usize, num_bits: u8, distance_type: DistanceType) -&gt; Self` | rust/lance/src/index/vector.rs:353-353 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn ivf_rq_with_rotation( num_partitions: usize, num_bits: u8, distance_type: DistanceType, rotation_type: RQRotationType, ) -&gt; Self` | rust/lance/src/index/vector.rs:362-367 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_ivf_pq_params( metric_type: MetricType, ivf: IvfBuildParams, pq: PQBuildParams, ) -&gt; Self` | rust/lance/src/index/vector.rs:381-385 | Create index parameters with `IVF` and `PQ` parameters, respectively. |
| `pub fn with_ivf_sq_params( metric_type: MetricType, ivf: IvfBuildParams, sq: SQBuildParams, ) -&gt; Self` | rust/lance/src/index/vector.rs:396-400 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_ivf_rq_params( metric_type: MetricType, ivf: IvfBuildParams, rq: RQBuildParams, ) -&gt; Self` | rust/lance/src/index/vector.rs:411-415 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn ivf_hnsw( distance_type: DistanceType, ivf: IvfBuildParams, hnsw: HnswBuildParams, ) -&gt; Self` | rust/lance/src/index/vector.rs:426-430 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_ivf_hnsw_pq_params( metric_type: MetricType, ivf: IvfBuildParams, hnsw: HnswBuildParams, pq: PQBuildParams, ) -&gt; Self` | rust/lance/src/index/vector.rs:443-448 | Create index parameters with `IVF`, `PQ` and `HNSW` parameters, respectively. This is used for `IVF_HNSW_PQ` index. |
| `pub fn with_ivf_hnsw_sq_params( metric_type: MetricType, ivf: IvfBuildParams, hnsw: HnswBuildParams, sq: SQBuildParams, ) -&gt; Self` | rust/lance/src/index/vector.rs:465-470 | Create index parameters with `IVF`, `HNSW` and `SQ` parameters, respectively. This is used for `IVF_HNSW_SQ` index. |
| `pub fn index_type(&self) -&gt; IndexType` | rust/lance/src/index/vector.rs:485-485 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn has_vectors_to_train(dataset: &Dataset, column: &str, minimum: usize) -&gt; Result&lt;bool&gt;` | rust/lance/src/index/vector.rs:515-515 | Whether `column` holds at least `minimum` vectors to train a quantizer from. |
| `pub fn pq_quantizer_minimum_rows(num_bits: usize) -&gt; Option&lt;usize&gt;` | rust/lance/src/index/vector.rs:658-658 | Rows a PQ codebook needs before it can be trained. |
| `pub async fn initialize_vector_index( target_dataset: &mut Dataset, source_dataset: &Dataset, source_index: &IndexMetadata, field_names: &[&str], ) -&gt; Result&lt;()&gt;` | rust/lance/src/index/vector.rs:2039-2044 | Initialize a vector index from a source dataset This will reuse the centroids from the source dataset, making the new indices basically a "delta index" of the source dataset, until the new dataset fully retains the index. |

<a id="source-rust-lance-src-index-vector-builder-rs"></a>

## `rust/lance/src/index/vector/builder.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct ExistingIndex` | rust/lance/src/index/vector/builder.rs:260-260 | An index segment an optimize pass reads existing rows from, paired with the rows that segment is still allowed to contribute. |
| `pub index: Arc&lt;dyn VectorIndex&gt;,` | rust/lance/src/index/vector/builder.rs:261-261 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn unfiltered(index: Arc&lt;dyn VectorIndex&gt;) -&gt; Self` | rust/lance/src/index/vector/builder.rs:275-275 | An existing index whose rows are all still valid. |
| `pub fn with_coverage( index: Arc&lt;dyn VectorIndex&gt;, dataset: Dataset, effective_frags: RoaringBitmap, deleted_frags: RoaringBitmap, ) -&gt; Self` | rust/lance/src/index/vector/builder.rs:283-288 | An existing index that may only contribute rows still live in `effective_frags`. |
| `pub struct IvfIndexBuilder&lt;S: IvfSubIndex, Q: Quantization&gt;` | rust/lance/src/index/vector/builder.rs:335-335 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct VectorIndexBuildSummary` | rust/lance/src/index/vector/builder.rs:434-434 | No standalone documentation summary; use the family contract and source entry. |
| `pub indices_merged: usize,` | rust/lance/src/index/vector/builder.rs:435-435 | No standalone documentation summary; use the family contract and source entry. |
| `pub files: Vec&lt;IndexFile&gt;,` | rust/lance/src/index/vector/builder.rs:436-436 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( dataset: Dataset, column: String, index_dir: Path, distance_type: DistanceType, shuffler: Box&lt;dyn Shuffler&gt;, ivf_params: Option&lt;IvfBuildParams&gt;, quantizer_params: Option&lt;Q::BuildParams&gt;, sub_index_params: S::BuildParams, frag_reuse_index: Option&lt;Arc&lt;CompactFragReuseIndex&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/index/vector/builder.rs:441-451 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_incremental( dataset: Dataset, column: String, index_dir: Path, distance_type: DistanceType, shuffler: Box&lt;dyn Shuffler&gt;, sub_index_params: S::BuildParams, frag_reuse_index: Option&lt;Arc&lt;CompactFragReuseIndex&gt;&gt;, optimize_options: OptimizeOptions, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/index/vector/builder.rs:485-494 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_remapper( dataset: Dataset, column: String, index_dir: Path, index: Arc&lt;dyn VectorIndex&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/index/vector/builder.rs:510-515 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn build(&mut self) -&gt; Result&lt;VectorIndexBuildSummary&gt;` | rust/lance/src/index/vector/builder.rs:553-553 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn remap(&mut self, mapping: &RowAddrRemap) -&gt; Result&lt;Vec&lt;IndexFile&gt;&gt;` | rust/lance/src/index/vector/builder.rs:599-599 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_ivf(&mut self, ivf: IvfModel) -&gt; &mut Self` | rust/lance/src/index/vector/builder.rs:669-669 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_quantizer(&mut self, quantizer: Q) -&gt; &mut Self` | rust/lance/src/index/vector/builder.rs:674-674 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_existing_indices(&mut self, indices: Vec&lt;Arc&lt;dyn VectorIndex&gt;&gt;) -&gt; &mut Self` | rust/lance/src/index/vector/builder.rs:680-680 | Read existing rows from `indices`, keeping every row they hold. |
| `pub fn with_existing_index_sources(&mut self, sources: Vec&lt;ExistingIndex&gt;) -&gt; &mut Self` | rust/lance/src/index/vector/builder.rs:687-687 | Read existing rows from `sources`, keeping only the rows each segment is still allowed to contribute. See [`ExistingIndex`]. |
| `pub fn with_fragment_filter(&mut self, fragment_ids: Vec&lt;u32&gt;) -&gt; &mut Self` | rust/lance/src/index/vector/builder.rs:693-693 | Set fragment filter for distributed indexing |
| `pub fn with_optional_fragment_filter(&mut self, fragment_ids: Option&lt;&[u32]&gt;) -&gt; &mut Self` | rust/lance/src/index/vector/builder.rs:698-698 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_transpose(&mut self, transpose: bool) -&gt; &mut Self` | rust/lance/src/index/vector/builder.rs:707-707 | Control whether codes are transposed when building storage. This mainly affects intermediate PQ/RQ storage when building distributed indices. |
| `pub fn with_target_partition_size( &mut self, target_partition_size: Option&lt;usize&gt;, ) -&gt; &mut Self` | rust/lance/src/index/vector/builder.rs:715-718 | Set progress callback for index building Rows per partition the index was created for. Split and join thresholds are derived from it; without it the index type's default is used. |
| `pub fn with_progress(&mut self, progress: Arc&lt;dyn IndexBuildProgress&gt;) -&gt; &mut Self` | rust/lance/src/index/vector/builder.rs:723-723 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn shuffle_data_input( &mut self, data: Option&lt;impl RecordBatchStream + Unpin + 'static&gt;, ) -&gt; &mut Self` | rust/lance/src/index/vector/builder.rs:944-947 | Attach an unindexed input stream. The shuffle is deferred until `build()` so progress reporting wraps the actual shuffle work. Data must have schema \| ROW_ID \| vector_column \|. |
| `pub async fn shuffle_data( &mut self, data: Option&lt;impl Stream&lt;Item = Result&lt;RecordBatch&gt;&gt; + Unpin + Send + 'static&gt;, ) -&gt; Result&lt;&mut Self&gt;` | rust/lance/src/index/vector/builder.rs:962-965 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-index-vector-dedup-rs"></a>

## `rust/lance/src/index/vector/dedup.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct DuplicatePairsOptions` | rust/lance/src/index/vector/dedup.rs:70-70 | Per-invocation code staging and ordered scoring concurrency. |
| `pub fn with_memory_limit(mut self, memory_limit: usize) -&gt; Self` | rust/lance/src/index/vector/dedup.rs:88-88 | Set the staged code budget in bytes (default 256 MiB). Partitions estimated to exceed it spill; zero forces spill. Source reads, quantizer preparation and scoring retain additional bounded batches. |
| `pub fn with_max_concurrency(mut self, max_concurrency: usize) -&gt; Self` | rust/lance/src/index/vector/dedup.rs:95-95 | Set the maximum number of in-flight scoring jobs. Must be positive. The default is the CPU pool size. Output order does not depend on it. |
| `pub async fn find_duplicate_pairs( dataset: Arc&lt;Dataset&gt;, column: &str, distance_threshold: f32, ) -&gt; Result&lt;SendableRecordBatchStream&gt;` | rust/lance/src/index/vector/dedup.rs:151-155 | Enumerate threshold-matching pairs independently in every index partition. |
| `pub async fn find_duplicate_pairs_with_options( dataset: Arc&lt;Dataset&gt;, column: &str, distance_threshold: f32, options: DuplicatePairsOptions, ) -&gt; Result&lt;SendableRecordBatchStream&gt;` | rust/lance/src/index/vector/dedup.rs:178-183 | Enumerate pairs with explicit resource settings; semantics are identical to [`find_duplicate_pairs`]. See [`DuplicatePairsOptions`] for memory accounting. |
| `pub async fn find_duplicate_pairs_in_partition( dataset: Arc&lt;Dataset&gt;, column: &str, segment_id: Uuid, partition_id: usize, distance_threshold: f32, ) -&gt; Result&lt;SendableRecordBatchStream&gt;` | rust/lance/src/index/vector/dedup.rs:205-211 | Enumerate pairs only within the specified physical segment and partition. |
| `pub async fn find_duplicate_pairs_in_partition_with_options( dataset: Arc&lt;Dataset&gt;, column: &str, segment_id: Uuid, partition_id: usize, distance_threshold: f32, options: DuplicatePairsOptions, ) -&gt; Result&lt;SendableRecordBatchStream&gt;` | rust/lance/src/index/vector/dedup.rs:238-245 | Run one segment/partition with explicit code staging and concurrency. Uses the snapshot, distance and ordering contract of [`find_duplicate_pairs_in_partition`]. |

<a id="source-rust-lance-src-index-vector-details-rs"></a>

## `rust/lance/src/index/vector/details.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn vector_index_details(params: &VectorIndexParams) -&gt; prost_types::Any` | rust/lance/src/index/vector/details.rs:86-86 | Build a `VectorIndexDetails` proto from build params at index creation time. |
| `pub fn vector_index_details_default() -&gt; prost_types::Any` | rust/lance/src/index/vector/details.rs:169-169 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn apply_runtime_hints(hints: &HashMap&lt;String, String&gt;, params: &mut VectorIndexParams)` | rust/lance/src/index/vector/details.rs:182-182 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn target_partition_size_from_details(details: &prost_types::Any) -&gt; Option&lt;usize&gt;` | rust/lance/src/index/vector/details.rs:241-241 | Reconstruct `VectorIndexParams` from a stored `VectorIndexDetails` proto. |
| `pub fn vector_params_from_details(details: &prost_types::Any) -&gt; Option&lt;VectorIndexParams&gt;` | rust/lance/src/index/vector/details.rs:250-250 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn metric_type_from_index_metadata(index: &IndexMetadata) -&gt; Option&lt;DistanceType&gt;` | rust/lance/src/index/vector/details.rs:338-338 | Extract metric type from index metadata without opening the index file. |
| `pub fn needs_vector_details_inference( index: &IndexMetadata, schema: &lance_core::datatypes::Schema, ) -&gt; bool` | rust/lance/src/index/vector/details.rs:367-370 | Returns true if this is a vector index whose details need to be inferred from disk. |
| `pub async fn infer_missing_vector_details(dataset: &Dataset, indices: &mut [IndexMetadata])` | rust/lance/src/index/vector/details.rs:386-386 | Infer missing vector index details for all indices that need it. |
| `pub fn derive_vector_index_type(details: &prost_types::Any) -&gt; String` | rust/lance/src/index/vector/details.rs:421-421 | Derive a human-readable index type string from VectorIndexDetails. |
| `pub fn vector_details_as_json(details: &prost_types::Any) -&gt; Result&lt;String&gt;` | rust/lance/src/index/vector/details.rs:443-443 | Serialize VectorIndexDetails as a JSON string. |
| `pub async fn infer_vector_index_details( dataset: &Dataset, index: &IndexMetadata, ) -&gt; Result&lt;prost_types::Any&gt;` | rust/lance/src/index/vector/details.rs:504-507 | Infer VectorIndexDetails from index files on disk. Used as a fallback for legacy indices where the manifest doesn't have populated details. |

<a id="source-rust-lance-src-index-vector-hamming-rs"></a>

## `rust/lance/src/index/vector/hamming.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub async fn hamming_clustering_for_ivf_partition( dataset: &Dataset, index_name: &str, partition_id: usize, hamming_threshold: u32, ) -&gt; Result&lt;Box&lt;dyn RecordBatchReader + Send&gt;&gt;` | rust/lance/src/index/vector/hamming.rs:323-328 | Perform pairwise hamming distance clustering on a partition of an IVF_FLAT index. |
| `pub async fn hamming_clustering_for_ivf_partition_segments( dataset: &Dataset, index_name: &str, segment_ids: &[Uuid], partition_id: usize, hamming_threshold: u32, ) -&gt; Result&lt;Box&lt;dyn RecordBatchReader + Send&gt;&gt;` | rust/lance/src/index/vector/hamming.rs:346-352 | Perform pairwise hamming distance clustering on a partition of selected segments of an IVF_FLAT index. |
| `pub async fn get_ivf_partition_info( dataset: &Dataset, index_name: &str, ) -&gt; Result&lt;Vec&lt;PartitionInfo&gt;&gt;` | rust/lance/src/index/vector/hamming.rs:394-397 | Get partition statistics for an IVF_FLAT index. |
| `pub async fn get_ivf_partition_info_segments( dataset: &Dataset, index_name: &str, segment_ids: &[Uuid], ) -&gt; Result&lt;Vec&lt;PartitionInfo&gt;&gt;` | rust/lance/src/index/vector/hamming.rs:405-409 | Get partition statistics for selected segments of an IVF_FLAT index. |
| `pub struct PartitionInfo` | rust/lance/src/index/vector/hamming.rs:415-415 | Information about an IVF partition. |
| `pub partition_id: usize,` | rust/lance/src/index/vector/hamming.rs:416-416 | No standalone documentation summary; use the family contract and source entry. |
| `pub size: usize,` | rust/lance/src/index/vector/hamming.rs:417-417 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn hamming_clustering_for_sample( dataset: &Dataset, column: &str, sample_size: Option&lt;usize&gt;, hamming_threshold: u32, ) -&gt; Result&lt;Box&lt;dyn RecordBatchReader + Send&gt;&gt;` | rust/lance/src/index/vector/hamming.rs:439-444 | Perform pairwise hamming distance clustering on sampled rows from a dataset. |
| `pub async fn hamming_clustering_for_range( dataset: &Dataset, column: &str, fragment_id: usize, start_row: usize, num_rows: usize, hamming_threshold: u32, ) -&gt; Result&lt;Box&lt;dyn RecordBatchReader + Send&gt;&gt;` | rust/lance/src/index/vector/hamming.rs:564-571 | Perform pairwise hamming distance clustering on a contiguous range of rows from a fragment. |
| `pub fn hamming_clustering_from_hashes( hashes: &[u64], row_ids: Option&lt;&[u64]&gt;, hamming_threshold: u32, ) -&gt; Box&lt;dyn RecordBatchReader + Send&gt;` | rust/lance/src/index/vector/hamming.rs:668-672 | Perform pairwise hamming distance clustering on provided hashes (no I/O). |

<a id="source-rust-lance-src-index-vector-ivf-rs"></a>

## `rust/lance/src/index/vector/ivf.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod builder;` | rust/lance/src/index/vector/ivf.rs:140-140 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod io;` | rust/lance/src/index/vector/ivf.rs:142-142 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod v2;` | rust/lance/src/index/vector/ivf.rs:145-145 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct LegacyIVFPartitionKey` | rust/lance/src/index/vector/ivf.rs:152-152 | No standalone documentation summary; use the family contract and source entry. |
| `pub partition_id: usize,` | rust/lance/src/index/vector/ivf.rs:153-153 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(partition_id: usize) -&gt; Self` | rust/lance/src/index/vector/ivf.rs:157-157 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct IVFIndex` | rust/lance/src/index/vector/ivf.rs:184-184 | IVF Index. WARNING: Internal API with no stability guarantees. |
| `pub ivf: IvfModel,` | rust/lance/src/index/vector/ivf.rs:188-188 | Ivf model |
| `pub metric_type: MetricType,` | rust/lance/src/index/vector/ivf.rs:197-197 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn load_partition( &self, partition_id: usize, write_cache: bool, metrics: &dyn MetricsCollector, ) -&gt; Result&lt;Arc&lt;dyn VectorIndex&gt;&gt;` | rust/lance/src/index/vector/ivf.rs:291-296 | Load one partition of the IVF sub-index. |
| `pub fn preprocess_query(&self, partition_id: usize, query: &Query) -&gt; Result&lt;Query&gt;` | rust/lance/src/index/vector/ivf.rs:346-346 | preprocess the query vector given the partition id. |
| `pub struct IvfIndexPartitionStatistics` | rust/lance/src/index/vector/ivf.rs:1288-1288 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct IvfIndexStatistics` | rust/lance/src/index/vector/ivf.rs:1293-1293 | No standalone documentation summary; use the family contract and source entry. |
| `pub const LANCE_INCLUDE_VECTOR_CENTROIDS_ENV: &str = "LANCE_INCLUDE_VECTOR_CENTROIDS";` | rust/lance/src/index/vector/ivf.rs:1312-1312 | Environment variable controlling whether vector index statistics include the centroid vectors. When unset, centroids are still included for backward compatibility, but a one-time warning is logged. Set to a truthy value (e.g. `1`, `true`) to keep the current behavior without the warning, or any other value (e.g. `0`, `false`) to omit centroids from stats. |
| `pub struct IvfPQIndexMetadata` | rust/lance/src/index/vector/ivf.rs:1598-1598 | Ivf PQ index metadata. |
| `pub fn new( name: String, column: String, dataset_version: u64, metric_type: MetricType, ivf: IvfModel, pq: ProductQuantizer, transforms: Vec&lt;pb::Transform&gt;, ) -&gt; Self` | rust/lance/src/index/vector/ivf.rs:1626-1634 | Create a new IvfPQIndexMetadata object |
| `pub async fn build_ivf_model( dataset: &Dataset, column: &str, dim: usize, metric_type: MetricType, params: &IvfBuildParams, fragment_ids: Option&lt;&[u32]&gt;, progress: std::sync::Arc&lt;dyn lance_index::progress::IndexBuildProgress&gt;, ) -&gt; Result&lt;IvfModel&gt;` | rust/lance/src/index/vector/ivf.rs:1747-1755 | Build IVF model from the dataset. |
| `pub async fn load_precomputed_partitions_if_available( ivf_params: &IvfBuildParams, ) -&gt; Result&lt;Option&lt;HashMap&lt;u64, u32&gt;&gt;&gt;` | rust/lance/src/index/vector/ivf.rs:1910-1912 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn build_ivf_pq_index( dataset: &Dataset, column: &str, index_name: &str, uuid: Uuid, metric_type: MetricType, ivf_params: &IvfBuildParams, pq_params: &PQBuildParams, progress: std::sync::Arc&lt;dyn lance_index::progress::IndexBuildProgress&gt;, ) -&gt; Result&lt;Vec&lt;IndexFile&gt;&gt;` | rust/lance/src/index/vector/ivf.rs:1931-1940 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn build_ivf_hnsw_pq_index( dataset: &Dataset, column: &str, index_name: &str, uuid: Uuid, metric_type: MetricType, ivf_params: &IvfBuildParams, hnsw_params: &HnswBuildParams, pq_params: &PQBuildParams, ) -&gt; Result&lt;()&gt;` | rust/lance/src/index/vector/ivf.rs:1974-1983 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn write_ivf_pq_file_from_existing_index( dataset: &Dataset, column: &str, index_name: &str, index_id: Uuid, mut ivf: IvfModel, pq: ProductQuantizer, streams: Vec&lt;impl Stream&lt;Item = Result&lt;RecordBatch&gt;&gt;&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/index/vector/ivf.rs:2370-2378 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-src-index-vector-ivf-builder-rs"></a>

## `rust/lance/src/index/vector/ivf/builder.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub async fn write_vector_storage( dataset: &Dataset, data: impl RecordBatchStream + Unpin + 'static, num_rows: u64, centroids: FixedSizeListArray, pq: ProductQuantizer, distance_type: DistanceType, column: &str, writer: Box&lt;dyn Writer&gt;, precomputed_partitions_ds_uri: Option&lt;&str&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/index/vector/ivf/builder.rs:194-204 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-index-vector-ivf-partition-serde-rs"></a>

## `rust/lance/src/index/vector/ivf/partition_serde.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn partition_entry_codec&lt;S: IvfSubIndex + 'static, Q: Quantization + 'static&gt;() -&gt; Option&lt;lance_core::cache::CacheCodec&gt;` | rust/lance/src/index/vector/ivf/partition_serde.rs:44-45 | Returns an erased codec for `PartitionEntry&lt;S, Q&gt;` by matching on the quantizer's [`QuantizationType`]. Returns `None` for quantizer types that don't have a `CacheCodecImpl` implementation. |

<a id="source-rust-lance-src-index-vector-ivf-v2-rs"></a>

## `rust/lance/src/index/vector/ivf/v2.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct PartitionEntry&lt;S: IvfSubIndex, Q: Quantization&gt;` | rust/lance/src/index/vector/ivf/v2.rs:916-916 | No standalone documentation summary; use the family contract and source entry. |
| `pub index: S,` | rust/lance/src/index/vector/ivf/v2.rs:917-917 | No standalone documentation summary; use the family contract and source entry. |
| `pub storage: Q::Storage,` | rust/lance/src/index/vector/ivf/v2.rs:918-918 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct IVFPartitionKey&lt;S: IvfSubIndex, Q: Quantization&gt;` | rust/lance/src/index/vector/ivf/v2.rs:991-991 | No standalone documentation summary; use the family contract and source entry. |
| `pub partition_id: usize,` | rust/lance/src/index/vector/ivf/v2.rs:992-992 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(partition_id: usize) -&gt; Self` | rust/lance/src/index/vector/ivf/v2.rs:997-997 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct IVFIndex&lt;S: IvfSubIndex + 'static, Q: Quantization + 'static&gt;` | rust/lance/src/index/vector/ivf/v2.rs:1039-1039 | IVF Index. |
| `pub async fn load_partition( &self, partition_id: usize, write_cache: bool, metrics: &dyn MetricsCollector, ) -&gt; Result&lt;Arc&lt;PartitionEntry&lt;S, Q&gt;&gt;&gt;` | rust/lance/src/index/vector/ivf/v2.rs:1717-1722 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn load_partition_storage( &self, partition_id: usize, io_stats: Option&lt;IoStats&gt;, ) -&gt; Result&lt;Q::Storage&gt;` | rust/lance/src/index/vector/ivf/v2.rs:1994-1998 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn preprocess_query(&self, partition_id: usize, query: &Query) -&gt; Result&lt;Query&gt;` | rust/lance/src/index/vector/ivf/v2.rs:2006-2006 | preprocess the query vector given the partition id. |
| `pub type IvfFlatIndex = IVFIndex&lt;FlatIndex, FlatQuantizer&gt;;` | rust/lance/src/index/vector/ivf/v2.rs:2973-2973 | No standalone documentation summary; use the family contract and source entry. |
| `pub type IvfPq = IVFIndex&lt;FlatIndex, ProductQuantizer&gt;;` | rust/lance/src/index/vector/ivf/v2.rs:2974-2974 | No standalone documentation summary; use the family contract and source entry. |
| `pub type IvfHnswSqIndex = IVFIndex&lt;HNSW, ScalarQuantizer&gt;;` | rust/lance/src/index/vector/ivf/v2.rs:2975-2975 | No standalone documentation summary; use the family contract and source entry. |
| `pub type IvfHnswPqIndex = IVFIndex&lt;HNSW, ProductQuantizer&gt;;` | rust/lance/src/index/vector/ivf/v2.rs:2976-2976 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-src-index-vector-pq-rs"></a>

## `rust/lance/src/index/vector/pq.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use lance_index::vector::pq::PQBuildParams;` | rust/lance/src/index/vector/pq.rs:49-49 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct PQIndex` | rust/lance/src/index/vector/pq.rs:62-62 | Product Quantization Index. |
| `pub pq: ProductQuantizer,` | rust/lance/src/index/vector/pq.rs:64-64 | Product quantizer. |
| `pub code: Option&lt;Arc&lt;UInt8Array&gt;&gt;,` | rust/lance/src/index/vector/pq.rs:69-69 | PQ code the PQ codes are stored in a transposed way, call `Self::get_pq_codes` to get the PQ code for a specific vector. |
| `pub row_ids: Option&lt;Arc&lt;UInt64Array&gt;&gt;,` | rust/lance/src/index/vector/pq.rs:72-72 | ROW Id used to refer to the actual row in dataset. |
| `pub async fn build_pq_model( dataset: &Dataset, column: &str, dim: usize, metric_type: MetricType, params: &PQBuildParams, ivf: Option&lt;&IvfModel&gt;, ) -&gt; Result&lt;ProductQuantizer&gt;` | rust/lance/src/index/vector/pq.rs:552-559 | Train Product Quantizer model. |
| `pub async fn build_pq_model_in_fragments( dataset: &Dataset, column: &str, dim: usize, metric_type: MetricType, params: &PQBuildParams, ivf: Option&lt;&IvfModel&gt;, fragment_ids: Option&lt;&[u32]&gt;, ) -&gt; Result&lt;ProductQuantizer&gt;` | rust/lance/src/index/vector/pq.rs:563-571 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-src-index-vector-utils-rs"></a>

## `rust/lance/src/index/vector/utils.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn get_vector_dim(schema: &Schema, column: &str) -&gt; Result&lt;usize&gt;` | rust/lance/src/index/vector/utils.rs:176-176 | Get the vector dimension of the given column in the schema. |
| `pub fn infer_vector_dim(data_type: &arrow::datatypes::DataType) -&gt; Result&lt;usize&gt;` | rust/lance/src/index/vector/utils.rs:185-185 | Infer the vector dimension from the given data type. |
| `pub fn get_vector_type( schema: &Schema, column: &str, ) -&gt; Result&lt;(arrow_schema::DataType, arrow_schema::DataType)&gt;` | rust/lance/src/index/vector/utils.rs:205-208 | Checks whether the given column is with a valid vector type returns the vector type (FixedSizeList for vectors, or List for multivectors), and element type (Float16/Float32/Float64 or UInt8 for binary vectors). |
| `pub fn default_distance_type_for(element_type: &arrow_schema::DataType) -&gt; DistanceType` | rust/lance/src/index/vector/utils.rs:220-220 | Returns the default distance type for the given vector element type. |
| `pub fn validate_distance_type_for( distance_type: DistanceType, element_type: &arrow_schema::DataType, ) -&gt; Result&lt;()&gt;` | rust/lance/src/index/vector/utils.rs:228-231 | Validate that the distance type is supported by the vector element type. |
| `pub fn infer_vector_element_type( data_type: &arrow::datatypes::DataType, ) -&gt; Result&lt;arrow_schema::DataType&gt;` | rust/lance/src/index/vector/utils.rs:260-262 | If the data type is a fixed size list or list of fixed size list return the inner element type and verify it is a type we can create a vector index on. |
| `pub async fn maybe_sample_training_data( dataset: &Dataset, column: &str, sample_size_hint: usize, fragment_ids: Option&lt;&[u32]&gt;, ) -&gt; Result&lt;FixedSizeListArray&gt;` | rust/lance/src/index/vector/utils.rs:305-310 | Maybe sample training data from dataset, specified by column name. |
| `pub fn filter_finite_training_data( training_data: FixedSizeListArray, ) -&gt; Result&lt;FixedSizeListArray&gt;` | rust/lance/src/index/vector/utils.rs:377-379 | Filter out non-finite vectors from sampled training data. |
| `pub struct PartitionLoadLock` | rust/lance/src/index/vector/utils.rs:390-390 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(num_partitions: usize) -&gt; Self` | rust/lance/src/index/vector/utils.rs:395-395 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn get_partition_mutex(&self, partition_id: usize) -&gt; Arc&lt;Mutex&lt;()&gt;&gt;` | rust/lance/src/index/vector/utils.rs:403-403 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-io-rs"></a>

## `rust/lance/src/io.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod commit;` | rust/lance/src/io.rs:6-6 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod deletion;` | rust/lance/src/io.rs:7-7 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod exec;` | rust/lance/src/io.rs:8-8 | No standalone documentation summary; use the family contract and source entry. |
| `pub use lance_io::` | rust/lance/src/io.rs:10-10 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-io-commit-rs"></a>

## `rust/lance/src/io/commit.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod conflict_resolver;` | rust/lance/src/io/commit.rs:81-81 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod namespace_manifest;` | rust/lance/src/io/commit.rs:86-86 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn manifest_needs_migration(manifest: &Manifest, indices: &[IndexMetadata]) -&gt; bool` | rust/lance/src/io/commit.rs:816-816 | Internal function to check if a manifest could use some migration. |
| `pub bad_indices: Vec&lt;(String, Vec&lt;u32&gt;)&gt;,` | rust/lance/src/io/commit.rs:1247-1247 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-src-io-commit-conflict-resolver-rs"></a>

## `rust/lance/src/io/commit/conflict_resolver.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct TransactionRebase&lt;'a&gt;` | rust/lance/src/io/commit/conflict_resolver.rs:42-42 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn try_new( dataset: &Dataset, transaction: Transaction, affected_rows: Option&lt;&'a RowAddrTreeMap&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/commit/conflict_resolver.rs:245-249 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn load_current_lineage(&mut self, dataset: &Dataset) -&gt; Result&lt;()&gt;` | rust/lance/src/io/commit/conflict_resolver.rs:545-545 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn check_txn(&mut self, other_transaction: &Transaction, other_version: u64) -&gt; Result&lt;()&gt;` | rust/lance/src/io/commit/conflict_resolver.rs:637-637 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn finish(self, dataset: &Dataset) -&gt; Result&lt;Transaction&gt;` | rust/lance/src/io/commit/conflict_resolver.rs:2538-2538 | Writes |
| `pub async fn finish_with_tagged_rewrite( self, dataset: &Dataset, ) -&gt; Result&lt;(Transaction, Option&lt;Arc&lt;TaggedRewriteAssembly&gt;&gt;)&gt;` | rust/lance/src/io/commit/conflict_resolver.rs:2548-2551 | [`Self::finish`], also returning what a rewrite on a tagged fragment reuse history assembled for this attempt: the complete entry merged against `dataset`'s manifest, which the commit hands to the manifest build as `FragReuseUpdate::Rewrite` on the prepared index list. The transaction itself keeps the caller's entry, so the next attempt diffs the same intent again instead of treating this assembly as its own. |


<a id="source-rust-lance-src-io-commit-namespace-manifest-rs"></a>

## `rust/lance/src/io/commit/namespace_manifest.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct LanceNamespaceExternalManifestStore` | rust/lance/src/io/commit/namespace_manifest.rs:36-36 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( namespace_client: Arc&lt;dyn LanceNamespace&gt;, table_id: Vec&lt;String&gt;, table_root: Path, ) -&gt; Self` | rust/lance/src/io/commit/namespace_manifest.rs:46-50 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn for_table_uri( namespace_client: Arc&lt;dyn LanceNamespace&gt;, table_id: Vec&lt;String&gt;, table_uri: &str, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/commit/namespace_manifest.rs:60-64 | Build a store for the table rooted at `table_uri`, resolving the root path from the uri without initializing an object store. |

<a id="source-rust-lance-src-io-deletion-rs"></a>

## `rust/lance/src/io/deletion.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub async fn read_dataset_deletion_file( dataset: &Dataset, fragment_id: u64, deletion_file: &DeletionFile, ) -&gt; lance_core::Result&lt;Arc&lt;DeletionVector&gt;&gt;` | rust/lance/src/io/deletion.rs:11-15 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-io-exec-rs"></a>

## `rust/lance/src/io/exec.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod ann_proto;` | rust/lance/src/io/exec.rs:9-9 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod count_from_mask;` | rust/lance/src/io/exec.rs:10-10 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod count_pushdown;` | rust/lance/src/io/exec.rs:11-11 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod filtered_read;` | rust/lance/src/io/exec.rs:13-13 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod filtered_read_proto;` | rust/lance/src/io/exec.rs:15-15 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod fts;` | rust/lance/src/io/exec.rs:16-16 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod minhash;` | rust/lance/src/io/exec.rs:18-18 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod scalar_index;` | rust/lance/src/io/exec.rs:24-24 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod table_identifier;` | rust/lance/src/io/exec.rs:27-27 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod utils;` | rust/lance/src/io/exec.rs:32-32 | No standalone documentation summary; use the family contract and source entry. |
| `pub use filter::LanceFilterExec;` | rust/lance/src/io/exec.rs:34-34 | No standalone documentation summary; use the family contract and source entry. |
| `pub use knn::` | rust/lance/src/io/exec.rs:35-35 | No standalone documentation summary; use the family contract and source entry. |
| `pub use lance_datafusion::planner::Planner;` | rust/lance/src/io/exec.rs:39-39 | No standalone documentation summary; use the family contract and source entry. |
| `pub use lance_index::scalar::expression::FilterPlan;` | rust/lance/src/io/exec.rs:40-40 | No standalone documentation summary; use the family contract and source entry. |
| `pub use minhash::` | rust/lance/src/io/exec.rs:41-41 | No standalone documentation summary; use the family contract and source entry. |
| `pub use optimizer::get_physical_optimizer;` | rust/lance/src/io/exec.rs:42-42 | No standalone documentation summary; use the family contract and source entry. |
| `pub use projection::project;` | rust/lance/src/io/exec.rs:43-43 | No standalone documentation summary; use the family contract and source entry. |
| `pub use pushdown_scan::` | rust/lance/src/io/exec.rs:44-44 | No standalone documentation summary; use the family contract and source entry. |
| `pub use row_addr_mask::RowAddrMaskFilterExec;` | rust/lance/src/io/exec.rs:45-45 | No standalone documentation summary; use the family contract and source entry. |
| `pub use rowids::` | rust/lance/src/io/exec.rs:46-46 | No standalone documentation summary; use the family contract and source entry. |
| `pub use scan::` | rust/lance/src/io/exec.rs:48-48 | No standalone documentation summary; use the family contract and source entry. |
| `pub use take::TakeExec;` | rust/lance/src/io/exec.rs:49-49 | No standalone documentation summary; use the family contract and source entry. |
| `pub use utils::PreFilterSource;` | rust/lance/src/io/exec.rs:50-50 | No standalone documentation summary; use the family contract and source entry. |
| `pub const LANCE_RELATIONAL_ALGEBRA_VERSION: u32 = 1;` | rust/lance/src/io/exec.rs:66-66 | Declares which vesrion of the relational algebra we are producing |

<a id="source-rust-lance-src-io-exec-ann-proto-rs"></a>

## `rust/lance/src/io/exec/ann_proto.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn query_to_proto(query: &Query) -&gt; Result&lt;pb::VectorQueryProto&gt;` | rust/lance/src/io/exec/ann_proto.rs:99-99 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn query_from_proto(proto: pb::VectorQueryProto) -&gt; Result&lt;Query&gt;` | rust/lance/src/io/exec/ann_proto.rs:129-129 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn ann_ivf_partition_exec_to_proto( exec: &ANNIvfPartitionExec, ) -&gt; Result&lt;pb::AnnIvfPartitionExecProto&gt;` | rust/lance/src/io/exec/ann_proto.rs:167-169 | Convert an [`ANNIvfPartitionExec`] to proto for serialization. |
| `pub async fn ann_ivf_partition_exec_from_proto( proto: pb::AnnIvfPartitionExecProto, dataset: Option&lt;Arc&lt;Dataset&gt;&gt;, ) -&gt; Result&lt;ANNIvfPartitionExec&gt;` | rust/lance/src/io/exec/ann_proto.rs:181-184 | Reconstruct an [`ANNIvfPartitionExec`] from proto. |
| `pub async fn ann_ivf_sub_index_exec_to_proto( exec: &ANNIvfSubIndexExec, ) -&gt; Result&lt;pb::AnnIvfSubIndexExecProto&gt;` | rust/lance/src/io/exec/ann_proto.rs:216-218 | Convert an [`ANNIvfSubIndexExec`] to proto for serialization. |
| `pub async fn ann_ivf_sub_index_exec_from_proto( proto: pb::AnnIvfSubIndexExecProto, dataset: Option&lt;Arc&lt;Dataset&gt;&gt;, input: Arc&lt;dyn datafusion::physical_plan::ExecutionPlan&gt;, prefilter_input: Option&lt;Arc&lt;dyn datafusion::physical_plan::ExecutionPlan&gt;&gt;, ) -&gt; Result&lt;ANNIvfSubIndexExec&gt;` | rust/lance/src/io/exec/ann_proto.rs:248-253 | Reconstruct an [`ANNIvfSubIndexExec`] from proto. |


<a id="source-rust-lance-src-io-exec-count-from-mask-rs"></a>

## `rust/lance/src/io/exec/count_from_mask.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct CountFromMaskExec` | rust/lance/src/io/exec/count_from_mask.rs:55-55 | An execution node that computes a `COUNT(*)`-style aggregate from an optional row-address mask supplied by an upstream scalar-index search, combined with the dataset's deletion mask and an optional restriction to a fragment subset. |
| `pub fn try_new( dataset: Arc&lt;Dataset&gt;, aggregate_funcs: Vec&lt;Arc&lt;AggregateFunctionExpr&gt;&gt;, prefilter_input: Option&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/count_from_mask.rs:94-98 | Build a new node. |
| `pub fn try_new_restricted( dataset: Arc&lt;Dataset&gt;, aggregate_funcs: Vec&lt;Arc&lt;AggregateFunctionExpr&gt;&gt;, prefilter_input: Option&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;, restrict_to_fragments: Option&lt;RoaringBitmap&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/count_from_mask.rs:106-111 | Like [`Self::try_new`] but scopes the count to a fragment subset rather than the whole dataset. The optimizer rule uses this for the pushdown branch of a partial-coverage split plan, so the count only covers the fragments the prefilter's index can answer for. |

<a id="source-rust-lance-src-io-exec-count-pushdown-rs"></a>

## `rust/lance/src/io/exec/count_pushdown.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct CountPushdown;` | rust/lance/src/io/exec/count_pushdown.rs:75-75 | Physical optimizer rule that rewrites a `COUNT(*)`-style aggregate into [`CountFromMaskExec`], optionally splitting into a parallel scan branch when the index has partial coverage of the dataset. |


<a id="source-rust-lance-src-io-exec-filter-rs"></a>

## `rust/lance/src/io/exec/filter.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct LanceFilterExec` | rust/lance/src/io/exec/filter.rs:19-19 | No standalone documentation summary; use the family contract and source entry. |
| `pub filter: Arc&lt;FilterExec&gt;,` | rust/lance/src/io/exec/filter.rs:21-21 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn try_new(expr: Expr, input: Arc&lt;dyn ExecutionPlan&gt;) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/filter.rs:31-31 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn try_new_with_session( expr: Expr, input: Arc&lt;dyn ExecutionPlan&gt;, session: &dyn Session, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/filter.rs:37-41 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn expr(&self) -&gt; &Expr` | rust/lance/src/io/exec/filter.rs:59-59 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-io-exec-filtered-read-rs"></a>

## `rust/lance/src/io/exec/filtered_read.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct EvaluatedIndex` | rust/lance/src/io/exec/filtered_read.rs:89-89 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn index_result(&self) -&gt; &IndexExprResult` | rust/lance/src/io/exec/filtered_read.rs:135-135 | Get the row id mask representing which rows matched the index filter. |
| `pub fn applicable_fragments(&self) -&gt; &RoaringBitmap` | rust/lance/src/io/exec/filtered_read.rs:141-141 | Get a reference to the applicable fragments bitmap, containing the set of fragment IDs implicated by the filter. |
| `pub fn try_from_arrow(batch: &RecordBatch) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/filtered_read.rs:145-145 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FilteredReadGlobalMetrics` | rust/lance/src/io/exec/filtered_read.rs:322-322 | Global metrics for the FilteredReadExec node |
| `pub fn new(metrics: &ExecutionPlanMetricsSet) -&gt; Self` | rust/lance/src/io/exec/filtered_read.rs:330-330 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FilteredReadPartitionMetrics` | rust/lance/src/io/exec/filtered_read.rs:344-344 | Partition metrics for the FilteredReadExec node |
| `pub fn new(metrics: &ExecutionPlanMetricsSet, partition: usize) -&gt; Self` | rust/lance/src/io/exec/filtered_read.rs:355-355 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum FilteredReadThreadingMode` | rust/lance/src/io/exec/filtered_read.rs:414-414 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn coalesce_batches( input: SendableRecordBatchStream, target: usize, ) -&gt; impl Stream&lt;Item = DataFusionResult&lt;RecordBatch&gt;&gt;` | rust/lance/src/io/exec/filtered_read.rs:503-506 | Merge batches up to `target` rows; batches already at the target pass through whole (never split). Order is preserved. |
| `pub struct FilteredReadOptions` | rust/lance/src/io/exec/filtered_read.rs:1745-1745 | Options for a filtered read. |
| `pub scan_range_before_filter: Option&lt;Range&lt;u64&gt;&gt;,` | rust/lance/src/io/exec/filtered_read.rs:1747-1747 | The range of rows to read before applying the filter. |
| `pub scan_range_after_filter: Option&lt;Range&lt;u64&gt;&gt;,` | rust/lance/src/io/exec/filtered_read.rs:1749-1749 | The range of rows to read after applying the filter. |
| `pub with_deleted_rows: bool,` | rust/lance/src/io/exec/filtered_read.rs:1751-1751 | Include deleted rows in the scan; they are returned with a null row id |
| `pub batch_size: Option&lt;u32&gt;,` | rust/lance/src/io/exec/filtered_read.rs:1753-1753 | The maximum number of rows per batch |
| `pub file_reader_options: Option&lt;FileReaderOptions&gt;,` | rust/lance/src/io/exec/filtered_read.rs:1755-1755 | File reader options to use when reading data files. |
| `pub fragment_readahead: Option&lt;usize&gt;,` | rust/lance/src/io/exec/filtered_read.rs:1757-1757 | Controls how many fragments to read ahead |
| `pub fragments: Option&lt;Arc&lt;Vec&lt;Fragment&gt;&gt;&gt;,` | rust/lance/src/io/exec/filtered_read.rs:1759-1759 | The fragments to read |
| `pub projection: Projection,` | rust/lance/src/io/exec/filtered_read.rs:1763-1763 | The projection to use for the scan |
| `pub refine_filter: Option&lt;Expr&gt;,` | rust/lance/src/io/exec/filtered_read.rs:1766-1766 | If there is a scalar index input, and the index result we get from that input is exact, then we will only apply the refine filter to batches covered by the result. |
| `pub full_filter: Option&lt;Expr&gt;,` | rust/lance/src/io/exec/filtered_read.rs:1770-1770 | The filter to apply during the read. If possible we will try and use the scalar index result to avoid applying this (and instead only apply the refine filter) but in some cases the index result does not cover all fragments or is not exact. |
| `pub threading_mode: FilteredReadThreadingMode,` | rust/lance/src/io/exec/filtered_read.rs:1773-1773 | The threading mode to use for the scan |
| `pub io_buffer_size_bytes: Option&lt;u64&gt;,` | rust/lance/src/io/exec/filtered_read.rs:1775-1775 | The size of the I/O buffer to use for the scan |
| `pub materialization_readahead_bytes: Option&lt;u64&gt;,` | rust/lance/src/io/exec/filtered_read.rs:1777-1777 | Total memory budget for asynchronously materialized blob v2 batches |
| `pub only_indexed_fragments: bool,` | rust/lance/src/io/exec/filtered_read.rs:1779-1779 | If true, skip fragments that are not covered by the scalar index result. |
| `pub overlay_block: Option&lt;RowAddrMask&gt;,` | rust/lance/src/io/exec/filtered_read.rs:1785-1785 | Row addresses whose index entries may be stale because an overlay committed after the index was built touches an indexed field. They are blocked from the index result so the index never emits them; the scanner re-evaluates just these rows against their current (overlay-merged) values on a targeted take path. Their fragments stay in the covered set, so non-stale rows keep the index. `None` on the common no-overlay fast path. |
| `pub fn basic_full_read(dataset: &Arc&lt;Dataset&gt;) -&gt; Self` | rust/lance/src/io/exec/filtered_read.rs:1797-1797 | Create a basic full scan of the dataset |
| `pub fn new(projection: Projection) -&gt; Self` | rust/lance/src/io/exec/filtered_read.rs:1801-1801 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_overlay_block(mut self, block: RowAddrMask) -&gt; Self` | rust/lance/src/io/exec/filtered_read.rs:1827-1827 | Block the given stale overlay row addresses (see the `overlay_block` field) from the scalar index result so the index never emits them. |
| `pub fn with_deleted_rows(mut self) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/filtered_read.rs:1842-1842 | Include deleted rows in the scan |
| `pub fn with_scan_range_before_filter(mut self, scan_range: Range&lt;u64&gt;) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/filtered_read.rs:1860-1860 | Specify the range of rows to read before applying the filter. |
| `pub fn with_scan_range_after_filter(mut self, scan_range: Range&lt;u64&gt;) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/filtered_read.rs:1892-1892 | The range of rows to read after applying the filter. |
| `pub fn with_fragments(mut self, fragments: Arc&lt;Vec&lt;Fragment&gt;&gt;) -&gt; Self` | rust/lance/src/io/exec/filtered_read.rs:1931-1931 | Specify the fragments to read. |
| `pub fn with_batch_size(mut self, batch_size: u32) -&gt; Self` | rust/lance/src/io/exec/filtered_read.rs:1948-1948 | Specify the batch size to use for the read |
| `pub fn with_file_reader_options(mut self, file_reader_options: FileReaderOptions) -&gt; Self` | rust/lance/src/io/exec/filtered_read.rs:1954-1954 | Specify the file reader options to use when reading data files. |
| `pub fn with_fragment_readahead(mut self, fragment_readahead: usize) -&gt; Self` | rust/lance/src/io/exec/filtered_read.rs:1965-1965 | Controls how many fragments to read ahead. |
| `pub fn with_filter( mut self, refine_filter: Option&lt;Expr&gt;, full_filter: Option&lt;Expr&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/filtered_read.rs:1984-1988 | Specify the filter plan to use for the scan. |
| `pub fn with_filter_plan(mut self, filter_plan: FilterPlan) -&gt; Self` | rust/lance/src/io/exec/filtered_read.rs:2001-2001 | An alternative to [`Self::with_filter`] to set the filters from a FilterPlan if you already have one |
| `pub fn with_projection(mut self, projection: Projection) -&gt; Self` | rust/lance/src/io/exec/filtered_read.rs:2050-2050 | Specify the projection to use for the scan |
| `pub fn with_io_buffer_size(mut self, io_buffer_size: u64) -&gt; Self` | rust/lance/src/io/exec/filtered_read.rs:2089-2089 | Specify the size of the I/O buffer (in bytes) to use for the scan |
| `pub fn with_materialization_readahead_bytes(mut self, size: u64) -&gt; Self` | rust/lance/src/io/exec/filtered_read.rs:2095-2095 | Specify the memory budget for asynchronous blob v2 materialization. |
| `pub fn with_only_indexed_fragments(mut self) -&gt; Self` | rust/lance/src/io/exec/filtered_read.rs:2101-2101 | Only read fragments covered by a scalar index result. |
| `pub fn with_threading_mode(mut self, threading_mode: FilteredReadThreadingMode) -&gt; Self` | rust/lance/src/io/exec/filtered_read.rs:2114-2114 | Specify the threading mode to use for the scan. |
| `pub struct FilteredReadExec` | rust/lance/src/io/exec/filtered_read.rs:2135-2135 | A plan node that reads a dataset, applying an optional filter and projection. |
| `pub struct FilteredReadPlan` | rust/lance/src/io/exec/filtered_read.rs:2200-2200 | Public plan for distributed execution - uses bitmap for flexibility |
| `pub rows: RowAddrTreeMap,` | rust/lance/src/io/exec/filtered_read.rs:2202-2202 | What fragments and physical rows to read |
| `pub filters: HashMap&lt;u32, Arc&lt;Expr&gt;&gt;,` | rust/lance/src/io/exec/filtered_read.rs:2205-2205 | Filter to apply per fragment fragments not here don't need filtering |
| `pub scan_range_after_filter: Option&lt;Range&lt;u64&gt;&gt;,` | rust/lance/src/io/exec/filtered_read.rs:2209-2209 | Row offset range to apply after filtering (skip N rows, take M rows). If the index guarantees enough matching rows, this is pushed down during planning and set to None. Otherwise, it's applied during execution. |
| `pub fn try_new( dataset: Arc&lt;Dataset&gt;, options: FilteredReadOptions, input: Option&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/filtered_read.rs:2245-2249 | Create a new filtered read |
| `pub async fn with_plan(self, plan: FilteredReadPlan) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/filtered_read.rs:2555-2555 | Set the pre-computed plan for execution |
| `pub async fn get_or_create_plan(&self, ctx: Arc&lt;TaskContext&gt;) -&gt; Result&lt;FilteredReadPlan&gt;` | rust/lance/src/io/exec/filtered_read.rs:2703-2703 | Get the existing plan or create it if it doesn't exist |
| `pub fn dataset(&self) -&gt; &Arc&lt;Dataset&gt;` | rust/lance/src/io/exec/filtered_read.rs:2826-2826 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn options(&self) -&gt; &FilteredReadOptions` | rust/lance/src/io/exec/filtered_read.rs:2830-2830 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn index_input(&self) -&gt; Option&lt;&Arc&lt;dyn ExecutionPlan&gt;&gt;` | rust/lance/src/io/exec/filtered_read.rs:2834-2834 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn row_stream_input(&self) -&gt; Option&lt;&Arc&lt;dyn ExecutionPlan&gt;&gt;` | rust/lance/src/io/exec/filtered_read.rs:2838-2838 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn plan(&self) -&gt; Option&lt;FilteredReadPlan&gt;` | rust/lance/src/io/exec/filtered_read.rs:2860-2860 | Return the pre-computed plan if one exists, without triggering initialization. |
| `pub fn attach_read_columns( batch: &RecordBatch, keys: &arrow_array::PrimitiveArray&lt;UInt64Type&gt;, read_data: &RecordBatch, read_keys: &arrow_array::PrimitiveArray&lt;UInt64Type&gt;, carried_schema: &arrow_schema::Schema, new_fields_schema: &arrow_schema::Schema, output_schema: &SchemaRef, ) -&gt; DataFusionResult&lt;RecordBatch&gt;` | rust/lance/src/io/exec/filtered_read.rs:3328-3336 | Align `read_data` rows back to a keyed batch's row order and merge the fetched columns on. |


<a id="source-rust-lance-src-io-exec-filtered-read-proto-rs"></a>

## `rust/lance/src/io/exec/filtered_read_proto.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub async fn filtered_read_exec_to_proto( exec: &FilteredReadExec, state: &SessionState, ) -&gt; Result&lt;pb::FilteredReadExecProto&gt;` | rust/lance/src/io/exec/filtered_read_proto.rs:50-53 | Convert a [`FilteredReadExec`] to proto for serialization. |
| `pub async fn filtered_read_exec_from_proto( proto: pb::FilteredReadExecProto, dataset: Option&lt;Arc&lt;Dataset&gt;&gt;, index_input: Option&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;, state: &SessionState, ) -&gt; Result&lt;FilteredReadExec&gt;` | rust/lance/src/io/exec/filtered_read_proto.rs:78-83 | Reconstruct a [`FilteredReadExec`] from proto. |
| `pub fn plan_to_proto( plan: &FilteredReadPlan, filter_schema: &Arc&lt;ArrowSchema&gt;, state: &SessionState, ) -&gt; Result&lt;pb::FilteredReadPlanProto&gt;` | rust/lance/src/io/exec/filtered_read_proto.rs:284-288 | Convert a [`FilteredReadPlan`] to proto. |


<a id="source-rust-lance-src-io-exec-fts-rs"></a>

## `rust/lance/src/io/exec/fts.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct FtsDocumentExec` | rust/lance/src/io/exec/fts.rs:191-191 | Expands a schema-derived nested FTS source into one canonical row per logical document before flat search or index building consumes it. |
| `pub struct CompoundQueryExec` | rust/lance/src/io/exec/fts.rs:682-682 | One DataFusion boundary around a posting-backed compound scorer tree. |
| `pub fn new_with_segments( dataset: Arc&lt;Dataset&gt;, query: FtsQuery, params: FtsSearchParams, prefilter_source: PreFilterSource, segments: Vec&lt;IndexMetadata&gt;, ) -&gt; Self` | rust/lance/src/io/exec/fts.rs:705-711 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_segment_uuids( dataset: Arc&lt;Dataset&gt;, query: FtsQuery, params: FtsSearchParams, prefilter_source: PreFilterSource, segment_uuids: Vec&lt;Uuid&gt;, ) -&gt; Self` | rust/lance/src/io/exec/fts.rs:721-727 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_external_mask(mut self, mask: Option&lt;Arc&lt;RowAddrMask&gt;&gt;) -&gt; Self` | rust/lance/src/io/exec/fts.rs:765-765 | See [`MatchQueryExec::with_external_mask`]. |
| `pub fn with_base_scorer(mut self, scorer: Arc&lt;MemBM25Scorer&gt;) -&gt; Self` | rust/lance/src/io/exec/fts.rs:774-774 | Override locally computed BM25 statistics with a corpus-wide scorer. |
| `pub fn with_prepared_match(mut self, prepared: Arc&lt;PreparedBm25Query&gt;) -&gt; Self` | rust/lance/src/io/exec/fts.rs:786-786 | Override root-Match preparation with one canonical vocabulary/scorer pair built against the complete corpus. |
| `pub fn dataset(&self) -&gt; &Arc&lt;Dataset&gt;` | rust/lance/src/io/exec/fts.rs:792-792 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn query(&self) -&gt; &FtsQuery` | rust/lance/src/io/exec/fts.rs:796-796 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn params(&self) -&gt; &FtsSearchParams` | rust/lance/src/io/exec/fts.rs:800-800 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn prefilter_source(&self) -&gt; &PreFilterSource` | rust/lance/src/io/exec/fts.rs:804-804 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn base_scorer(&self) -&gt; Option&lt;&Arc&lt;MemBM25Scorer&gt;&gt;` | rust/lance/src/io/exec/fts.rs:808-808 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_limit(&self, limit: usize) -&gt; Self` | rust/lance/src/io/exec/fts.rs:820-820 | Re-cut this scorer at `limit`, keeping its segment selection, prepared scorers and masks. |
| `pub fn explicit_segment_uuids(&self) -&gt; Option&lt;Vec&lt;Uuid&gt;&gt;` | rust/lance/src/io/exec/fts.rs:839-839 | See [`MatchQueryExec::explicit_segment_uuids`]. |
| `pub struct HybridCompoundQueryExec` | rust/lance/src/io/exec/fts.rs:1013-1013 | Compound FTS over committed postings plus a small append-only residual scan. |
| `pub fn new( dataset: Arc&lt;Dataset&gt;, query: FtsQuery, params: FtsSearchParams, column: String, segments: Vec&lt;IndexMetadata&gt;, residual_input: Arc&lt;dyn ExecutionPlan&gt;, ) -&gt; Self` | rust/lance/src/io/exec/fts.rs:1026-1033 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn dataset(&self) -&gt; &Arc&lt;Dataset&gt;` | rust/lance/src/io/exec/fts.rs:1052-1052 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn query(&self) -&gt; &FtsQuery` | rust/lance/src/io/exec/fts.rs:1056-1056 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn params(&self) -&gt; &FtsSearchParams` | rust/lance/src/io/exec/fts.rs:1060-1060 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn column(&self) -&gt; &str` | rust/lance/src/io/exec/fts.rs:1064-1064 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn segments(&self) -&gt; &[IndexMetadata]` | rust/lance/src/io/exec/fts.rs:1072-1072 | The indexed segments this scorer reads. Paired with [`Self::residual_input`] and [`Self::new`], this is what lets a caller rebuild the node — the FTS top-k lives in [`Self::params`], not in a fetch node, so changing it means reconstruction. |
| `pub fn with_indexed_input( &self, input: Arc&lt;dyn ExecutionPlan&gt;, committed_scorer: Arc&lt;MemBM25Scorer&gt;, ) -&gt; DataFusionResult&lt;Self&gt;` | rust/lance/src/io/exec/fts.rs:1100-1104 | Replace the indexed search with an externally computed bounded top-k. |
| `pub fn residual_input(&self) -&gt; &Arc&lt;dyn ExecutionPlan&gt;` | rust/lance/src/io/exec/fts.rs:1127-1127 | The scan over the fragments no segment covers. |
| `pub struct CrossColumnCompoundQueryExec` | rust/lance/src/io/exec/fts.rs:1890-1890 | One DataFusion boundary around a cross-column posting-backed scorer tree. |
| `pub fn new_with_segments( dataset: Arc&lt;Dataset&gt;, query: FtsQuery, params: FtsSearchParams, prefilter_source: PreFilterSource, columns: Vec&lt;(String, Vec&lt;IndexMetadata&gt;)&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/fts.rs:1905-1911 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_external_mask(mut self, mask: Option&lt;Arc&lt;RowAddrMask&gt;&gt;) -&gt; Self` | rust/lance/src/io/exec/fts.rs:1988-1988 | See [`MatchQueryExec::with_external_mask`]. |
| `pub fn dataset(&self) -&gt; &Arc&lt;Dataset&gt;` | rust/lance/src/io/exec/fts.rs:1993-1993 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn query(&self) -&gt; &FtsQuery` | rust/lance/src/io/exec/fts.rs:1997-1997 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn params(&self) -&gt; &FtsSearchParams` | rust/lance/src/io/exec/fts.rs:2001-2001 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn prefilter_source(&self) -&gt; &PreFilterSource` | rust/lance/src/io/exec/fts.rs:2005-2005 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_limit(&self, limit: usize) -&gt; Self` | rust/lance/src/io/exec/fts.rs:2017-2017 | Re-cut this scorer at `limit`, keeping its segment selection, prepared scorers and masks. |
| `pub const FTS_SEGMENT_BIND_DURATION_METRIC: &str = "fts_segment_bind_duration";` | rust/lance/src/io/exec/fts.rs:2529-2529 | Time spent resolving an exact ordered UUID selection to committed FTS segments. |
| `pub struct FtsIndexMetrics` | rust/lance/src/io/exec/fts.rs:2666-2666 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(metrics: &ExecutionPlanMetricsSet, partition: usize) -&gt; Self` | rust/lance/src/io/exec/fts.rs:2677-2677 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn record_parts_searched(&self, num_parts: usize)` | rust/lance/src/io/exec/fts.rs:2687-2687 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn record_scorer_build(&self, elapsed: std::time::Duration)` | rust/lance/src/io/exec/fts.rs:2691-2691 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct MatchQueryExec` | rust/lance/src/io/exec/fts.rs:2719-2719 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( dataset: Arc&lt;Dataset&gt;, query: MatchQuery, params: FtsSearchParams, prefilter_source: PreFilterSource, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/fts.rs:2782-2787 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_document_granularity( dataset: Arc&lt;Dataset&gt;, query: MatchQuery, params: FtsSearchParams, prefilter_source: PreFilterSource, document_granularity: DocumentGranularity, ) -&gt; Self` | rust/lance/src/io/exec/fts.rs:2800-2806 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_segments( dataset: Arc&lt;Dataset&gt;, query: MatchQuery, params: FtsSearchParams, prefilter_source: PreFilterSource, segments: Vec&lt;IndexMetadata&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/fts.rs:2843-2849 | Construct a `MatchQueryExec` bound to an explicit, pre-resolved set of FTS segments. Unlike [`Self::new`], `execute()` will not call [`load_segments`] — it will search exactly the segments supplied here. |
| `pub fn new_with_segments_and_document_granularity( dataset: Arc&lt;Dataset&gt;, query: MatchQuery, params: FtsSearchParams, prefilter_source: PreFilterSource, segments: Vec&lt;IndexMetadata&gt;, document_granularity: DocumentGranularity, ) -&gt; Self` | rust/lance/src/io/exec/fts.rs:2863-2870 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_segment_uuids( dataset: Arc&lt;Dataset&gt;, query: MatchQuery, params: FtsSearchParams, prefilter_source: PreFilterSource, segment_uuids: Vec&lt;Uuid&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/fts.rs:2905-2911 | Construct a `MatchQueryExec` bound to an exact ordered set of committed FTS segment UUIDs. |
| `pub fn with_base_scorer(mut self, scorer: Arc&lt;MemBM25Scorer&gt;) -&gt; Self` | rust/lance/src/io/exec/fts.rs:2956-2956 | Override the BM25 scorer used by `execute()`. When set, the local `build_global_bm25_scorer` call is skipped and the supplied scorer is threaded down to `InvertedIndex::bm25_search`. |
| `pub fn with_prepared_query(mut self, query: Arc&lt;PreparedBm25Query&gt;) -&gt; Self` | rust/lance/src/io/exec/fts.rs:2969-2969 | Override local query preparation with one canonical vocabulary/scorer pair built against the complete corpus. |
| `pub fn with_external_mask(mut self, mask: Option&lt;Arc&lt;RowAddrMask&gt;&gt;) -&gt; Self` | rust/lance/src/io/exec/fts.rs:2990-2990 | Restrict BM25 scoring to rows selected by an external row-address mask. The mask is combined (logical AND) with the prefilter built by `build_prefilter`, so top-k is computed over masked rows only. No-op when `mask` is `None`. |
| `pub fn query(&self) -&gt; &MatchQuery` | rust/lance/src/io/exec/fts.rs:2995-2995 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn params(&self) -&gt; &FtsSearchParams` | rust/lance/src/io/exec/fts.rs:2999-2999 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn dataset(&self) -&gt; &Arc&lt;Dataset&gt;` | rust/lance/src/io/exec/fts.rs:3003-3003 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn prefilter_source(&self) -&gt; &PreFilterSource` | rust/lance/src/io/exec/fts.rs:3007-3007 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn base_scorer(&self) -&gt; Option&lt;&Arc&lt;MemBM25Scorer&gt;&gt;` | rust/lance/src/io/exec/fts.rs:3011-3011 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn preset_segments(&self) -&gt; Option&lt;&[IndexMetadata]&gt;` | rust/lance/src/io/exec/fts.rs:3015-3015 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn explicit_segment_uuids(&self) -&gt; Option&lt;Vec&lt;Uuid&gt;&gt;` | rust/lance/src/io/exec/fts.rs:3024-3024 | Return the ordered segment UUIDs for an explicit selection. |
| `pub struct CombinedFieldsQueryExec` | rust/lance/src/io/exec/fts.rs:3267-3267 | Cross-field BM25F full-text search (`combined_fields`). |
| `pub fn new( dataset: Arc&lt;Dataset&gt;, query: CombinedFieldsQuery, params: FtsSearchParams, prefilter_source: PreFilterSource, ) -&gt; Self` | rust/lance/src/io/exec/fts.rs:3295-3300 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_external_mask(mut self, mask: Option&lt;Arc&lt;RowAddrMask&gt;&gt;) -&gt; Self` | rust/lance/src/io/exec/fts.rs:3324-3324 | See [`MatchQueryExec::with_external_mask`]. |
| `pub fn with_covered_fragments(mut self, fragments: roaring::RoaringBitmap) -&gt; Self` | rust/lance/src/io/exec/fts.rs:3343-3343 | Restrict this scan to `fragments`, the ones every target column's index covers. |
| `pub fn with_base_scorer(mut self, scorer: Arc&lt;CombinedFieldsBM25Scorer&gt;) -&gt; Self` | rust/lance/src/io/exec/fts.rs:3359-3359 | Override the blended BM25F scorer used by `execute()`. When set, the local `build_combined_bm25_scorer` call is skipped. Mirrors [`MatchQueryExec::with_base_scorer`] for distributed queries that aggregate cross-column corpus statistics out-of-band. |
| `pub fn query(&self) -&gt; &CombinedFieldsQuery` | rust/lance/src/io/exec/fts.rs:3379-3379 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn params(&self) -&gt; &FtsSearchParams` | rust/lance/src/io/exec/fts.rs:3383-3383 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn prefilter_source(&self) -&gt; &PreFilterSource` | rust/lance/src/io/exec/fts.rs:3387-3387 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FlatMatchFilterExec` | rust/lance/src/io/exec/fts.rs:3749-3749 | Filters the input according to a match query's token operator. |
| `pub fn new( input: Arc&lt;dyn ExecutionPlan&gt;, dataset: Arc&lt;Dataset&gt;, query: MatchQuery, params: FtsSearchParams, ) -&gt; Self` | rust/lance/src/io/exec/fts.rs:3867-3872 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_document_column( input: Arc&lt;dyn ExecutionPlan&gt;, dataset: Arc&lt;Dataset&gt;, query: MatchQuery, params: FtsSearchParams, document_column: String, ) -&gt; Self` | rust/lance/src/io/exec/fts.rs:3877-3883 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_segments( input: Arc&lt;dyn ExecutionPlan&gt;, dataset: Arc&lt;Dataset&gt;, query: MatchQuery, params: FtsSearchParams, segments: Vec&lt;IndexMetadata&gt;, ) -&gt; Self` | rust/lance/src/io/exec/fts.rs:3920-3926 | See [`MatchQueryExec::new_with_segments`]. `FlatMatchFilterExec` uses the first segment's tokenizer; the rest are kept for caller-side bookkeeping. |
| `pub fn query(&self) -&gt; &MatchQuery` | rust/lance/src/io/exec/fts.rs:3941-3941 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn params(&self) -&gt; &FtsSearchParams` | rust/lance/src/io/exec/fts.rs:3945-3945 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn dataset(&self) -&gt; &Arc&lt;Dataset&gt;` | rust/lance/src/io/exec/fts.rs:3949-3949 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn preset_segments(&self) -&gt; Option&lt;&[IndexMetadata]&gt;` | rust/lance/src/io/exec/fts.rs:3953-3953 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FlatMatchQueryExec` | rust/lance/src/io/exec/fts.rs:4194-4194 | Calculates the FTS score for each row in the input |
| `pub fn new( dataset: Arc&lt;Dataset&gt;, query: MatchQuery, params: FtsSearchParams, unindexed_input: Arc&lt;dyn ExecutionPlan&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/fts.rs:4242-4247 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_document_granularity( dataset: Arc&lt;Dataset&gt;, query: MatchQuery, params: FtsSearchParams, unindexed_input: Arc&lt;dyn ExecutionPlan&gt;, document_granularity: DocumentGranularity, document_column: String, ) -&gt; Self` | rust/lance/src/io/exec/fts.rs:4262-4269 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_segments( dataset: Arc&lt;Dataset&gt;, query: MatchQuery, params: FtsSearchParams, unindexed_input: Arc&lt;dyn ExecutionPlan&gt;, segments: Vec&lt;IndexMetadata&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/fts.rs:4295-4301 | See [`MatchQueryExec::new_with_segments`]. |
| `pub fn new_with_segments_and_document_granularity( dataset: Arc&lt;Dataset&gt;, query: MatchQuery, params: FtsSearchParams, unindexed_input: Arc&lt;dyn ExecutionPlan&gt;, segments: Vec&lt;IndexMetadata&gt;, document_granularity: DocumentGranularity, document_column: String, ) -&gt; Self` | rust/lance/src/io/exec/fts.rs:4317-4325 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_base_scorer(mut self, scorer: Arc&lt;MemBM25Scorer&gt;) -&gt; Self` | rust/lance/src/io/exec/fts.rs:4351-4351 | Override the local BM25 scorer; see [`MatchQueryExec::with_base_scorer`]. |
| `pub fn query(&self) -&gt; &MatchQuery` | rust/lance/src/io/exec/fts.rs:4361-4361 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn params(&self) -&gt; &FtsSearchParams` | rust/lance/src/io/exec/fts.rs:4365-4365 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn dataset(&self) -&gt; &Arc&lt;Dataset&gt;` | rust/lance/src/io/exec/fts.rs:4369-4369 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn base_scorer(&self) -&gt; Option&lt;&Arc&lt;MemBM25Scorer&gt;&gt;` | rust/lance/src/io/exec/fts.rs:4373-4373 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn preset_segments(&self) -&gt; Option&lt;&[IndexMetadata]&gt;` | rust/lance/src/io/exec/fts.rs:4377-4377 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FlatStatsCoverage` | rust/lance/src/io/exec/fts.rs:4582-4582 | The rows of one target column that a flat `combined_fields` scan folds into that column's corpus statistics: the ones its index does not already count. |
| `pub fragments: roaring::RoaringBitmap,` | rust/lance/src/io/exec/fts.rs:4584-4584 | Fragments this column's index does not cover at all. |
| `pub stale_rows: Arc&lt;RowAddrTreeMap&gt;,` | rust/lance/src/io/exec/fts.rs:4589-4589 | Rows it does cover, but whose entries a newer overlay made stale, in the id domain the scan's `_rowid` uses. Their current values are folded in, and their pre-overlay values are subtracted from the index statistics (see [`CombinedFieldColumn::stale_rows`]), so each counts once. |
| `pub enum FlatStatsScope` | rust/lance/src/io/exec/fts.rs:4594-4594 | Which corpus statistics a flat `combined_fields` scan contributes. |
| `pub struct FlatCombinedFieldsExec` | rust/lance/src/io/exec/fts.rs:4611-4611 | The sibling of [`CombinedFieldsQueryExec`] for the fragments that at least one target column's index is missing. Those rows cannot be scored from the indexes (`tf'`/`dl'` would omit the unindexed columns), so they are scored straight from their column values here. The two plans are unioned and re-sorted by the planner, exactly as the single-column match path does. |
| `pub struct PhraseQueryExec` | rust/lance/src/io/exec/fts.rs:4951-4951 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( dataset: Arc&lt;Dataset&gt;, query: PhraseQuery, params: FtsSearchParams, prefilter_source: PreFilterSource, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/fts.rs:5000-5005 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_document_granularity( dataset: Arc&lt;Dataset&gt;, query: PhraseQuery, params: FtsSearchParams, prefilter_source: PreFilterSource, document_granularity: DocumentGranularity, ) -&gt; Self` | rust/lance/src/io/exec/fts.rs:5018-5024 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_segments( dataset: Arc&lt;Dataset&gt;, query: PhraseQuery, params: FtsSearchParams, prefilter_source: PreFilterSource, segments: Vec&lt;IndexMetadata&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/fts.rs:5053-5059 | See [`MatchQueryExec::new_with_segments`]. |
| `pub fn new_with_segments_and_document_granularity( dataset: Arc&lt;Dataset&gt;, query: PhraseQuery, params: FtsSearchParams, prefilter_source: PreFilterSource, segments: Vec&lt;IndexMetadata&gt;, document_granularity: DocumentGranularity, ) -&gt; Self` | rust/lance/src/io/exec/fts.rs:5073-5080 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_with_segment_uuids( dataset: Arc&lt;Dataset&gt;, query: PhraseQuery, mut params: FtsSearchParams, prefilter_source: PreFilterSource, segment_uuids: Vec&lt;Uuid&gt;, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/fts.rs:5115-5121 | Construct a `PhraseQueryExec` bound to an exact ordered set of committed FTS segment UUIDs. |
| `pub fn with_base_scorer(mut self, scorer: Arc&lt;MemBM25Scorer&gt;) -&gt; Self` | rust/lance/src/io/exec/fts.rs:5153-5153 | Override the local BM25 scorer; see [`MatchQueryExec::with_base_scorer`]. |
| `pub fn with_external_mask(mut self, mask: Option&lt;Arc&lt;RowAddrMask&gt;&gt;) -&gt; Self` | rust/lance/src/io/exec/fts.rs:5170-5170 | See [`MatchQueryExec::with_external_mask`]. |
| `pub fn query(&self) -&gt; &PhraseQuery` | rust/lance/src/io/exec/fts.rs:5175-5175 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn params(&self) -&gt; &FtsSearchParams` | rust/lance/src/io/exec/fts.rs:5179-5179 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn dataset(&self) -&gt; &Arc&lt;Dataset&gt;` | rust/lance/src/io/exec/fts.rs:5183-5183 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn prefilter_source(&self) -&gt; &PreFilterSource` | rust/lance/src/io/exec/fts.rs:5187-5187 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn base_scorer(&self) -&gt; Option&lt;&Arc&lt;MemBM25Scorer&gt;&gt;` | rust/lance/src/io/exec/fts.rs:5191-5191 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn preset_segments(&self) -&gt; Option&lt;&[IndexMetadata]&gt;` | rust/lance/src/io/exec/fts.rs:5195-5195 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn explicit_segment_uuids(&self) -&gt; Option&lt;Vec&lt;Uuid&gt;&gt;` | rust/lance/src/io/exec/fts.rs:5204-5204 | Return the ordered segment UUIDs for an explicit selection. |
| `pub struct BoostQueryExec` | rust/lance/src/io/exec/fts.rs:5412-5412 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( query: BoostQuery, params: FtsSearchParams, positive: Arc&lt;dyn ExecutionPlan&gt;, negative: Arc&lt;dyn ExecutionPlan&gt;, ) -&gt; Self` | rust/lance/src/io/exec/fts.rs:5445-5450 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn query(&self) -&gt; &BoostQuery` | rust/lance/src/io/exec/fts.rs:5469-5469 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn params(&self) -&gt; &FtsSearchParams` | rust/lance/src/io/exec/fts.rs:5473-5473 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn positive(&self) -&gt; &Arc&lt;dyn ExecutionPlan&gt;` | rust/lance/src/io/exec/fts.rs:5477-5477 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn negative(&self) -&gt; &Arc&lt;dyn ExecutionPlan&gt;` | rust/lance/src/io/exec/fts.rs:5481-5481 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum BoolSlot` | rust/lance/src/io/exec/fts.rs:5591-5591 | Identifies which clause of a [`BooleanQuery`] a list of child execs belongs to. Used by [`build_boolean_query_children`] to pick the right exec shape per slot. |
| `pub fn build_boolean_query_children( slot: BoolSlot, children: Vec&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;, ) -&gt; Result&lt;Option&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;&gt;` | rust/lance/src/io/exec/fts.rs:5610-5613 | Combine N children into the per-slot exec shape that [`BooleanQueryExec::new`] expects. Used by `Scanner::plan_fts` to assemble the per-slot exec shape: |
| `pub fn build_boolean_query_children_with_schema( slot: BoolSlot, mut children: Vec&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;, schema: SchemaRef, ) -&gt; Result&lt;Option&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;&gt;` | rust/lance/src/io/exec/fts.rs:5617-5621 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct BooleanQueryExec` | rust/lance/src/io/exec/fts.rs:5671-5671 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( query: BooleanQuery, params: FtsSearchParams, should: Arc&lt;dyn ExecutionPlan&gt;, must: Option&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;, must_not: Arc&lt;dyn ExecutionPlan&gt;, ) -&gt; Self` | rust/lance/src/io/exec/fts.rs:5711-5717 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn query(&self) -&gt; &BooleanQuery` | rust/lance/src/io/exec/fts.rs:5737-5737 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn params(&self) -&gt; &FtsSearchParams` | rust/lance/src/io/exec/fts.rs:5741-5741 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn should(&self) -&gt; &Arc&lt;dyn ExecutionPlan&gt;` | rust/lance/src/io/exec/fts.rs:5745-5745 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn must(&self) -&gt; Option&lt;&Arc&lt;dyn ExecutionPlan&gt;&gt;` | rust/lance/src/io/exec/fts.rs:5749-5749 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn must_not(&self) -&gt; &Arc&lt;dyn ExecutionPlan&gt;` | rust/lance/src/io/exec/fts.rs:5753-5753 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-src-io-exec-knn-rs"></a>

## `rust/lance/src/io/exec/knn.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const QUERY_INDEX_COL: &str = "query_index";` | rust/lance/src/io/exec/knn.rs:82-82 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn query_index_field() -&gt; Field` | rust/lance/src/io/exec/knn.rs:84-84 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct AnnPartitionMetrics` | rust/lance/src/io/exec/knn.rs:88-88 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(metrics: &ExecutionPlanMetricsSet, partition: usize) -&gt; Self` | rust/lance/src/io/exec/knn.rs:97-97 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct AnnIndexMetrics` | rust/lance/src/io/exec/knn.rs:108-108 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(metrics: &ExecutionPlanMetricsSet, partition: usize) -&gt; Self` | rust/lance/src/io/exec/knn.rs:115-115 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct KNNVectorDistanceExec` | rust/lance/src/io/exec/knn.rs:237-237 | [ExecutionPlan] compute vector distance from a query vector. |
| `pub input: Arc&lt;dyn ExecutionPlan&gt;,` | rust/lance/src/io/exec/knn.rs:239-239 | Inner input node. |
| `pub query: ArrayRef,` | rust/lance/src/io/exec/knn.rs:242-242 | The vector query to execute. |
| `pub is_batch: bool,` | rust/lance/src/io/exec/knn.rs:243-243 | No standalone documentation summary; use the family contract and source entry. |
| `pub query_count: usize,` | rust/lance/src/io/exec/knn.rs:244-244 | No standalone documentation summary; use the family contract and source entry. |
| `pub k: usize,` | rust/lance/src/io/exec/knn.rs:245-245 | No standalone documentation summary; use the family contract and source entry. |
| `pub lower_bound: Option&lt;f32&gt;,` | rust/lance/src/io/exec/knn.rs:246-246 | No standalone documentation summary; use the family contract and source entry. |
| `pub upper_bound: Option&lt;f32&gt;,` | rust/lance/src/io/exec/knn.rs:247-247 | No standalone documentation summary; use the family contract and source entry. |
| `pub column: String,` | rust/lance/src/io/exec/knn.rs:248-248 | No standalone documentation summary; use the family contract and source entry. |
| `pub distance_type: DistanceType,` | rust/lance/src/io/exec/knn.rs:249-249 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct KnnBatchParams` | rust/lance/src/io/exec/knn.rs:259-259 | No standalone documentation summary; use the family contract and source entry. |
| `pub is_batch: bool,` | rust/lance/src/io/exec/knn.rs:260-260 | No standalone documentation summary; use the family contract and source entry. |
| `pub query_count: usize,` | rust/lance/src/io/exec/knn.rs:261-261 | No standalone documentation summary; use the family contract and source entry. |
| `pub k: usize,` | rust/lance/src/io/exec/knn.rs:262-262 | No standalone documentation summary; use the family contract and source entry. |
| `pub lower_bound: Option&lt;f32&gt;,` | rust/lance/src/io/exec/knn.rs:263-263 | No standalone documentation summary; use the family contract and source entry. |
| `pub upper_bound: Option&lt;f32&gt;,` | rust/lance/src/io/exec/knn.rs:264-264 | No standalone documentation summary; use the family contract and source entry. |
| `pub distance_type: DistanceType,` | rust/lance/src/io/exec/knn.rs:265-265 | No standalone documentation summary; use the family contract and source entry. |
| `pub retain_vector: bool,` | rust/lance/src/io/exec/knn.rs:266-266 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn try_new( input: Arc&lt;dyn ExecutionPlan&gt;, column: &str, query: ArrayRef, distance_type: DistanceType, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/knn.rs:429-434 | Create a new [`KNNVectorDistanceExec`] node. |
| `pub fn with_k(&self, k: usize) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/knn.rs:564-564 | Rebuild this node with a different per-query `k`. |
| `pub static KNN_INDEX_SCHEMA: LazyLock&lt;SchemaRef&gt; = LazyLock::new(\|\| knn_empty_result_schema(false));` | rust/lance/src/io/exec/knn.rs:1194-1194 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn knn_empty_result_schema(include_query_index: bool) -&gt; SchemaRef` | rust/lance/src/io/exec/knn.rs:1197-1197 | Schema for empty vector-search results (e.g. `fast_search` with no index). |
| `pub static KNN_PARTITION_SCHEMA: LazyLock&lt;SchemaRef&gt; = LazyLock::new(\|\|` | rust/lance/src/io/exec/knn.rs:1208-1208 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_knn_exec( dataset: Arc&lt;Dataset&gt;, indices: &[IndexMetadata], query: &Query, prefilter_source: PreFilterSource, overlay_block: Option&lt;RowAddrMask&gt;, external_mask: Option&lt;Arc&lt;RowAddrMask&gt;&gt;, ) -&gt; Result&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;` | rust/lance/src/io/exec/knn.rs:1272-1279 | Create a new ANN execution node. `overlay_block`, when `Some`, excludes rows whose index entries may be stale due to a newer data overlay (see [`ANNIvfSubIndexExec::with_overlay_block`]). `external_mask`, when `Some`, additionally restricts the scan to a caller-supplied allow/block set (see [`ANNIvfSubIndexExec::with_external_mask`]). |
| `pub struct ANNIvfPartitionExec` | rust/lance/src/io/exec/knn.rs:1327-1327 | [ExecutionPlan] to execute the find the closest IVF partitions. |
| `pub dataset: Arc&lt;Dataset&gt;,` | rust/lance/src/io/exec/knn.rs:1328-1328 | No standalone documentation summary; use the family contract and source entry. |
| `pub query: Query,` | rust/lance/src/io/exec/knn.rs:1331-1331 | The vector query to execute. |
| `pub index_uuids: Vec&lt;Uuid&gt;,` | rust/lance/src/io/exec/knn.rs:1334-1334 | The UUIDs of the indices to search. |
| `pub properties: Arc&lt;PlanProperties&gt;,` | rust/lance/src/io/exec/knn.rs:1336-1336 | No standalone documentation summary; use the family contract and source entry. |
| `pub metrics: ExecutionPlanMetricsSet,` | rust/lance/src/io/exec/knn.rs:1338-1338 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn try_new(dataset: Arc&lt;Dataset&gt;, index_uuids: Vec&lt;Uuid&gt;, query: Query) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/knn.rs:1342-1342 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ANNIvfSubIndexExec` | rust/lance/src/io/exec/knn.rs:1547-1547 | Datafusion [ExecutionPlan] to run search on vector index partitions. |
| `pub fn try_new( input: Arc&lt;dyn ExecutionPlan&gt;, dataset: Arc&lt;Dataset&gt;, indices: Vec&lt;IndexMetadata&gt;, query: Query, prefilter_source: PreFilterSource, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/knn.rs:1576-1582 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_overlay_block(mut self, overlay_block: RowAddrMask) -&gt; Self` | rust/lance/src/io/exec/knn.rs:1609-1609 | Block stale row addresses (see the `overlay_block` field) from index results. |
| `pub fn with_external_mask(mut self, mask: Option&lt;Arc&lt;RowAddrMask&gt;&gt;) -&gt; Self` | rust/lance/src/io/exec/knn.rs:1617-1617 | Restrict the ANN search to a caller-supplied row-address allow/block set. Intersected with the prefilter, so top-k is computed over surviving rows rather than filtered afterwards. No-op when `mask` is `None`. |
| `pub fn query(&self) -&gt; &Query` | rust/lance/src/io/exec/knn.rs:1623-1623 | Returns a reference to the vector query. |
| `pub fn dataset(&self) -&gt; &Arc&lt;Dataset&gt;` | rust/lance/src/io/exec/knn.rs:1628-1628 | Returns a reference to the dataset. |
| `pub fn indices(&self) -&gt; &[IndexMetadata]` | rust/lance/src/io/exec/knn.rs:1633-1633 | Returns a reference to the index metadata. |
| `pub fn prefilter_source(&self) -&gt; &PreFilterSource` | rust/lance/src/io/exec/knn.rs:1638-1638 | Returns a reference to the prefilter source. |
| `pub fn new_knn_batch_exec( dataset: Arc&lt;Dataset&gt;, indices: &[IndexMetadata], query: &Query, query_count: usize, prefilter_source: PreFilterSource, ) -&gt; Result&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;` | rust/lance/src/io/exec/knn.rs:2490-2496 | Build a batch (multi-query) indexed vector search plan. |
| `pub struct ANNIvfBatchExec` | rust/lance/src/io/exec/knn.rs:2529-2529 | [ExecutionPlan] for batch (multi-query) IVF vector search. |
| `pub fn try_new( dataset: Arc&lt;Dataset&gt;, indices: Vec&lt;IndexMetadata&gt;, query: Query, query_count: usize, prefilter_source: PreFilterSource, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/knn.rs:2541-2547 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn query(&self) -&gt; &Query` | rust/lance/src/io/exec/knn.rs:2578-2578 | Returns a reference to the vector query. Its `key` holds all [`Self::query_count`] vectors concatenated. |
| `pub fn query_count(&self) -&gt; usize` | rust/lance/src/io/exec/knn.rs:2583-2583 | Returns the number of query vectors packed into [`Self::query`]. |
| `pub fn dataset(&self) -&gt; &Arc&lt;Dataset&gt;` | rust/lance/src/io/exec/knn.rs:2588-2588 | Returns a reference to the dataset. |
| `pub fn indices(&self) -&gt; &[IndexMetadata]` | rust/lance/src/io/exec/knn.rs:2593-2593 | Returns a reference to the index metadata. |
| `pub fn prefilter_source(&self) -&gt; &PreFilterSource` | rust/lance/src/io/exec/knn.rs:2598-2598 | Returns a reference to the prefilter source. |
| `pub struct MultivectorScoringExec` | rust/lance/src/io/exec/knn.rs:2878-2878 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn try_new(inputs: Vec&lt;Arc&lt;dyn ExecutionPlan&gt;&gt;, query: Query) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/knn.rs:2886-2886 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-src-io-exec-minhash-rs"></a>

## `rust/lance/src/io/exec/minhash.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct MinHashSearchExec` | rust/lance/src/io/exec/minhash.rs:78-78 | Searches every segment of a MinHash LSH index and emits the `limit` rows with the smallest Jaccard distance as `_distance` and `_rowid`, ordered by ascending distance. |
| `pub fn new( dataset: Arc&lt;Dataset&gt;, query: MinHashQuery, limit: usize, segments: Vec&lt;IndexMetadata&gt;, prefilter_source: PreFilterSource, overlay_block: Option&lt;RowAddrMask&gt;, external_mask: Option&lt;Arc&lt;RowAddrMask&gt;&gt;, ) -&gt; Self` | rust/lance/src/io/exec/minhash.rs:93-101 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FlatMinHashExec` | rust/lance/src/io/exec/minhash.rs:360-360 | Scores rows the index does not cover (unindexed fragments and rows whose value was replaced by a data overlay) by computing their signatures on the fly, emitting the `limit` closest rows as `_distance` and `_rowid`. |
| `pub fn new( input: Arc&lt;dyn ExecutionPlan&gt;, query: MinHashQuery, params: MinHashLshIndexParams, limit: usize, ) -&gt; Self` | rust/lance/src/io/exec/minhash.rs:370-375 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-src-io-exec-optimizer-rs"></a>

## `rust/lance/src/io/exec/optimizer.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct CoalesceTake;` | rust/lance/src/io/exec/optimizer.rs:30-30 | Rule that eliminates take nodes that are immediately followed by another take node, fetching the union of the columns in a single node instead. |
| `pub struct SimplifyProjection;` | rust/lance/src/io/exec/optimizer.rs:155-155 | Rule that eliminates [ProjectionExec] nodes that projects all columns from its input with no additional expressions. |
| `pub fn get_physical_optimizer() -&gt; PhysicalOptimizer` | rust/lance/src/io/exec/optimizer.rs:206-206 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-io-exec-projection-rs"></a>

## `rust/lance/src/io/exec/projection.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn project(input: Arc&lt;dyn ExecutionPlan&gt;, projection: &ArrowSchema) -&gt; Result&lt;ProjectionExec&gt;` | rust/lance/src/io/exec/projection.rs:36-36 | Make a DataFusion projection node from a schema. |
| `pub enum Selection&lt;'a&gt;` | rust/lance/src/io/exec/projection.rs:151-151 | Represents selection of fields from a struct / schema. |
| `pub fn name(&self) -&gt; &str` | rust/lance/src/io/exec/projection.rs:160-160 | Returns the name of the field being selected. |
| `pub fn compute_projection&lt;'a&gt;( schema: &'_ Fields, projection: &'a Fields, ) -&gt; Result&lt;Vec&lt;Selection&lt;'a&gt;&gt;&gt;` | rust/lance/src/io/exec/projection.rs:169-172 | Resolves the projection into a list of selections. |

<a id="source-rust-lance-src-io-exec-pushdown-scan-rs"></a>

## `rust/lance/src/io/exec/pushdown_scan.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct ScanConfig` | rust/lance/src/io/exec/pushdown_scan.rs:54-54 | No standalone documentation summary; use the family contract and source entry. |
| `pub batch_readahead: usize,` | rust/lance/src/io/exec/pushdown_scan.rs:58-58 | Number of batches to read ahead, potentially concurrently. This determines the amount of concurrent IO a scan may perform as well as the amount of data that may be buffered. |
| `pub fragment_readahead: usize,` | rust/lance/src/io/exec/pushdown_scan.rs:60-60 | Number of fragments to read ahead, potentially concurrently. |
| `pub with_row_id: bool,` | rust/lance/src/io/exec/pushdown_scan.rs:63-63 | If true, a row id column will be added to the output. This will be the first column. |
| `pub with_row_address: bool,` | rust/lance/src/io/exec/pushdown_scan.rs:66-66 | If true, a row address column will be added to the output. This will be the first column after row id. |
| `pub make_deletions_null: bool,` | rust/lance/src/io/exec/pushdown_scan.rs:69-69 | If true, the scan will emit batches that contain deleted rows but have a null _rowid. This option is only valid if with_row_id is true. |
| `pub ordered_output: bool,` | rust/lance/src/io/exec/pushdown_scan.rs:72-72 | If true (default), the scan will emit batches in the same order as the fragments. If false, the scan may emit batches in an arbitrary order. |
| `pub file_reader_options: Option&lt;FileReaderOptions&gt;,` | rust/lance/src/io/exec/pushdown_scan.rs:74-74 | File reader options to use when reading data files. |
| `pub struct LancePushdownScanExec` | rust/lance/src/io/exec/pushdown_scan.rs:92-92 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn try_new( dataset: Arc&lt;Dataset&gt;, fragments: Arc&lt;Vec&lt;Fragment&gt;&gt;, projection: Arc&lt;Schema&gt;, predicate: Expr, config: ScanConfig, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/pushdown_scan.rs:105-111 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn open( fragment: Fragment, dataset: Arc&lt;Dataset&gt;, projection: Arc&lt;Schema&gt;, predicate_projection: Arc&lt;Schema&gt;, predicate: Expr, config: ScanConfig, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/pushdown_scan.rs:290-297 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn scan(self) -&gt; Result&lt;BoxStream&lt;'static, Result&lt;RecordBatch&gt;&gt;&gt;` | rust/lance/src/io/exec/pushdown_scan.rs:326-326 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-io-exec-row-addr-mask-rs"></a>

## `rust/lance/src/io/exec/row_addr_mask.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct MaskAndLoader` | rust/lance/src/io/exec/row_addr_mask.rs:39-39 | FilterLoader that combines an external RowAddrMask (logical AND) with an optional inner loader. |
| `pub fn new(mask: Arc&lt;RowAddrMask&gt;, inner: Option&lt;Box&lt;dyn FilterLoader&gt;&gt;) -&gt; Self` | rust/lance/src/io/exec/row_addr_mask.rs:45-45 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct RowAddrMaskFilterExec` | rust/lance/src/io/exec/row_addr_mask.rs:67-67 | Execution node that drops rows whose `_rowid` is not selected by `mask`. |
| `pub fn new(input: Arc&lt;dyn ExecutionPlan&gt;, mask: Arc&lt;RowAddrMask&gt;) -&gt; Self` | rust/lance/src/io/exec/row_addr_mask.rs:74-74 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-io-exec-rowids-rs"></a>

## `rust/lance/src/io/exec/rowids.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct AddRowAddrExec` | rust/lance/src/io/exec/rowids.rs:37-37 | Add a `_rowaddr` column to a stream of record batches that have a `_rowid`. |
| `pub fn try_new( input: Arc&lt;dyn ExecutionPlan&gt;, dataset: Arc&lt;Dataset&gt;, rowaddr_pos: usize, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/rowids.rs:80-84 | Create a new AddRowAddrExec node. |
| `pub struct AddRowOffsetExec` | rust/lance/src/io/exec/rowids.rs:354-354 | Add a `_rowoffset` column to a stream of record batches that have a `_rowaddr` column. |
| `pub async fn try_new( input: Arc&lt;dyn ExecutionPlan&gt;, dataset: Arc&lt;Dataset&gt;, ) -&gt; LanceResult&lt;Self&gt;` | rust/lance/src/io/exec/rowids.rs:403-406 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn compute_row_offset_array( row_addr: &ArrayRef, dataset: Arc&lt;Dataset&gt;, ) -&gt; Result&lt;ArrayRef&gt;` | rust/lance/src/io/exec/rowids.rs:432-435 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-io-exec-scalar-index-rs"></a>

## `rust/lance/src/io/exec/scalar_index.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct ScalarIndexExec` | rust/lance/src/io/exec/scalar_index.rs:153-153 | An execution node that performs a scalar index search |
| `pub fn new( dataset: Arc&lt;Dataset&gt;, expr: ScalarIndexExpr, result_format: IndexExprResultWireFormat, ) -&gt; Self` | rust/lance/src/io/exec/scalar_index.rs:177-181 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn dataset(&self) -&gt; &Arc&lt;Dataset&gt;` | rust/lance/src/io/exec/scalar_index.rs:214-214 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn expr(&self) -&gt; &ScalarIndexExpr` | rust/lance/src/io/exec/scalar_index.rs:219-219 | The parsed scalar-index expression this node will evaluate. |
| `pub fn result_format(&self) -&gt; IndexExprResultWireFormat` | rust/lance/src/io/exec/scalar_index.rs:225-225 | Return the wire format used when serializing this exec's [`IndexExprResult`] output. |
| `pub async fn fragments_covered_by_index_query( index_expr: &ScalarIndexExpr, dataset: &Dataset, ) -&gt; Result&lt;RoaringBitmap&gt;` | rust/lance/src/io/exec/scalar_index.rs:230-233 | No standalone documentation summary; use the family contract and source entry. |
| `pub static INDEX_LOOKUP_SCHEMA: LazyLock&lt;SchemaRef&gt; = LazyLock::new(\|\| Arc::new(Schema::new(vec![ROW_ID_FIELD.clone()])));` | rust/lance/src/io/exec/scalar_index.rs:387-388 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct IndexLookup` | rust/lance/src/io/exec/scalar_index.rs:396-396 | A single scalar-index lookup used by [`MapIndexExec`]. |
| `pub column: String,` | rust/lance/src/io/exec/scalar_index.rs:397-397 | No standalone documentation summary; use the family contract and source entry. |
| `pub index_name: String,` | rust/lance/src/io/exec/scalar_index.rs:398-398 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(column: impl Into&lt;String&gt;, index_name: impl Into&lt;String&gt;) -&gt; Self` | rust/lance/src/io/exec/scalar_index.rs:478-478 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct MapIndexExec` | rust/lance/src/io/exec/scalar_index.rs:500-500 | An execution node that translates index values into row addresses |
| `pub fn new( dataset: Arc&lt;Dataset&gt;, column_name: String, index_name: String, input: Arc&lt;dyn ExecutionPlan&gt;, ) -&gt; Self` | rust/lance/src/io/exec/scalar_index.rs:532-537 | Convenience constructor for the common single-column case. |
| `pub fn new_multi( dataset: Arc&lt;Dataset&gt;, lookups: Vec&lt;IndexLookup&gt;, input: Arc&lt;dyn ExecutionPlan&gt;, ) -&gt; Self` | rust/lance/src/io/exec/scalar_index.rs:549-553 | Build a `MapIndexExec` that probes one or more scalar indices and emits an upper bound on the row addresses matching every one of them (see the type docs). `lookups` must be non-empty and `input` must produce one column per lookup, in the same order. |
| `pub static MATERIALIZE_INDEX_SCHEMA: LazyLock&lt;SchemaRef&gt; = LazyLock::new(\|\| Arc::new(Schema::new(vec![ROW_ID_FIELD.clone()])));` | rust/lance/src/io/exec/scalar_index.rs:874-875 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct MaterializeIndexExec` | rust/lance/src/io/exec/scalar_index.rs:883-883 | An execution node that performs a scalar index search and materializes the mask into row ids |
| `pub fn new( dataset: Arc&lt;Dataset&gt;, expr: ScalarIndexExpr, fragments: Arc&lt;Vec&lt;Fragment&gt;&gt;, ) -&gt; Self` | rust/lance/src/io/exec/scalar_index.rs:950-954 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_overlay_block(mut self, block: RowAddrMask) -&gt; Self` | rust/lance/src/io/exec/scalar_index.rs:979-979 | Block specific row addresses (see the `overlay_block` field) from the index result. |

<a id="source-rust-lance-src-io-exec-scan-rs"></a>

## `rust/lance/src/io/exec/scan.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct LanceStream` | rust/lance/src/io/exec/scan.rs:130-130 | Dataset Scan Node. |
| `pub fn try_new( dataset: Arc&lt;Dataset&gt;, fragments: Arc&lt;Vec&lt;Fragment&gt;&gt;, offsets: Option&lt;Range&lt;u64&gt;&gt;, projection: Arc&lt;Schema&gt;, config: LanceScanConfig, metrics: &ExecutionPlanMetricsSet, partition: usize, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/scan.rs:165-173 | Create a new dataset scan node. |
| `pub fn try_new_v2( dataset: Arc&lt;Dataset&gt;, fragments: Arc&lt;Vec&lt;Fragment&gt;&gt;, offsets: Option&lt;Range&lt;u64&gt;&gt;, projection: Arc&lt;Schema&gt;, config: LanceScanConfig, metrics: &ExecutionPlanMetricsSet, partition: usize, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/scan.rs:181-189 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn try_new_v1( dataset: Arc&lt;Dataset&gt;, fragments: Arc&lt;Vec&lt;Fragment&gt;&gt;, _offsets: Option&lt;Range&lt;u64&gt;&gt;, projection: Arc&lt;Schema&gt;, config: LanceScanConfig, metrics: &ExecutionPlanMetricsSet, partition: usize, ) -&gt; Result&lt;Self&gt;` | rust/lance/src/io/exec/scan.rs:440-448 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct LanceScanConfig` | rust/lance/src/io/exec/scan.rs:590-590 | No standalone documentation summary; use the family contract and source entry. |
| `pub batch_size: usize,` | rust/lance/src/io/exec/scan.rs:591-591 | No standalone documentation summary; use the family contract and source entry. |
| `pub batch_readahead: usize,` | rust/lance/src/io/exec/scan.rs:592-592 | No standalone documentation summary; use the family contract and source entry. |
| `pub fragment_readahead: Option&lt;usize&gt;,` | rust/lance/src/io/exec/scan.rs:593-593 | No standalone documentation summary; use the family contract and source entry. |
| `pub io_buffer_size: u64,` | rust/lance/src/io/exec/scan.rs:594-594 | No standalone documentation summary; use the family contract and source entry. |
| `pub materialization_readahead_bytes: Option&lt;u64&gt;,` | rust/lance/src/io/exec/scan.rs:595-595 | No standalone documentation summary; use the family contract and source entry. |
| `pub with_row_id: bool,` | rust/lance/src/io/exec/scan.rs:596-596 | No standalone documentation summary; use the family contract and source entry. |
| `pub with_row_address: bool,` | rust/lance/src/io/exec/scan.rs:597-597 | No standalone documentation summary; use the family contract and source entry. |
| `pub with_row_last_updated_at_version: bool,` | rust/lance/src/io/exec/scan.rs:598-598 | No standalone documentation summary; use the family contract and source entry. |
| `pub with_row_created_at_version: bool,` | rust/lance/src/io/exec/scan.rs:599-599 | No standalone documentation summary; use the family contract and source entry. |
| `pub with_make_deletions_null: bool,` | rust/lance/src/io/exec/scan.rs:600-600 | No standalone documentation summary; use the family contract and source entry. |
| `pub ordered_output: bool,` | rust/lance/src/io/exec/scan.rs:601-601 | No standalone documentation summary; use the family contract and source entry. |
| `pub file_reader_options: Option&lt;FileReaderOptions&gt;,` | rust/lance/src/io/exec/scan.rs:602-602 | No standalone documentation summary; use the family contract and source entry. |
| `pub parallelism_cap: Option&lt;usize&gt;,` | rust/lance/src/io/exec/scan.rs:605-605 | Upper bound on frag_parallelism and CPU decode concurrency. Set from DataFusion's `target_partitions` session config in `LanceScanExec::execute`. |
| `pub struct LanceScanExec` | rust/lance/src/io/exec/scan.rs:632-632 | DataFusion [ExecutionPlan] for scanning one Lance dataset |
| `pub fn new( dataset: Arc&lt;Dataset&gt;, fragments: Arc&lt;Vec&lt;Fragment&gt;&gt;, range: Option&lt;Range&lt;u64&gt;&gt;, projection: Arc&lt;Schema&gt;, config: LanceScanConfig, ) -&gt; Self` | rust/lance/src/io/exec/scan.rs:685-691 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn dataset(&self) -&gt; &Arc&lt;Dataset&gt;` | rust/lance/src/io/exec/scan.rs:737-737 | Get the dataset for this scan. |
| `pub fn fragments(&self) -&gt; &Arc&lt;Vec&lt;Fragment&gt;&gt;` | rust/lance/src/io/exec/scan.rs:742-742 | Get the fragments for this scan. |
| `pub fn range(&self) -&gt; &Option&lt;Range&lt;u64&gt;&gt;` | rust/lance/src/io/exec/scan.rs:747-747 | Get the range for this scan. |
| `pub fn projection(&self) -&gt; &Arc&lt;Schema&gt;` | rust/lance/src/io/exec/scan.rs:752-752 | Get the projection for this scan. |
| `pub fn config(&self) -&gt; &LanceScanConfig` | rust/lance/src/io/exec/scan.rs:757-757 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-src-io-exec-table-identifier-rs"></a>

## `rust/lance/src/io/exec/table_identifier.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub async fn table_identifier_from_dataset(dataset: &Dataset) -&gt; Result&lt;pb::TableIdentifier&gt;` | rust/lance/src/io/exec/table_identifier.rs:21-21 | Build a [`TableIdentifier`] from a [`Dataset`]. |
| `pub async fn table_identifier_from_dataset_with_manifest( dataset: &Dataset, ) -&gt; Result&lt;pb::TableIdentifier&gt;` | rust/lance/src/io/exec/table_identifier.rs:38-40 | Build a [`TableIdentifier`] with serialized manifest bytes included. |
| `pub async fn open_dataset_from_table_identifier( table_id: &pb::TableIdentifier, ) -&gt; Result&lt;Arc&lt;Dataset&gt;&gt;` | rust/lance/src/io/exec/table_identifier.rs:56-58 | Open a dataset from a table identifier proto. |
| `pub async fn resolve_dataset( dataset: Option&lt;Arc&lt;Dataset&gt;&gt;, table_id: Option&lt;&pb::TableIdentifier&gt;, ) -&gt; Result&lt;Arc&lt;Dataset&gt;&gt;` | rust/lance/src/io/exec/table_identifier.rs:73-76 | Resolve a dataset from an optional pre-loaded instance or from a table identifier. |

<a id="source-rust-lance-src-io-exec-take-rs"></a>

## `rust/lance/src/io/exec/take.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct TakeExec` | rust/lance/src/io/exec/take.rs:463-463 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn try_new( dataset: Arc&lt;Dataset&gt;, input: Arc&lt;dyn ExecutionPlan&gt;, projection: Projection, ) -&gt; Result&lt;Option&lt;Self&gt;&gt;` | rust/lance/src/io/exec/take.rs:529-533 | Create a [`TakeExec`] node. |
| `pub fn try_new_with_batch_size( dataset: Arc&lt;Dataset&gt;, input: Arc&lt;dyn ExecutionPlan&gt;, projection: Projection, batch_size_bytes: Option&lt;u64&gt;, ) -&gt; Result&lt;Option&lt;Self&gt;&gt;` | rust/lance/src/io/exec/take.rs:538-543 | Create a [`TakeExec`] node with an explicit byte budget for output batches. |
| `pub fn dataset(&self) -&gt; &Arc&lt;Dataset&gt;` | rust/lance/src/io/exec/take.rs:679-679 | Get the dataset. |


<a id="source-rust-lance-src-io-exec-utils-rs"></a>

## `rust/lance/src/io/exec/utils.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub enum PreFilterSource` | rust/lance/src/io/exec/utils.rs:76-76 | No standalone documentation summary; use the family contract and source entry. |
| `pub overlay_block: Option&lt;RowAddrMask&gt;,` | rust/lance/src/io/exec/utils.rs:214-214 | No standalone documentation summary; use the family contract and source entry. |
| `pub external_mask: Option&lt;Arc&lt;RowAddrMask&gt;&gt;,` | rust/lance/src/io/exec/utils.rs:215-215 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ReplayExec` | rust/lance/src/io/exec/utils.rs:639-639 | An execution node that can be used as an input twice |
| `pub fn new(capacity: Capacity, input: Arc&lt;dyn ExecutionPlan&gt;) -&gt; Self` | rust/lance/src/io/exec/utils.rs:646-646 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ShareableRecordBatchStream(pub SendableRecordBatchStream);` | rust/lance/src/io/exec/utils.rs:677-677 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ShareableRecordBatchStreamAdapter&lt;S: Stream&lt;Item = SharedBatchResult&gt; + Unpin&gt;` | rust/lance/src/io/exec/utils.rs:698-698 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(schema: SchemaRef, stream: S) -&gt; Self` | rust/lance/src/io/exec/utils.rs:704-704 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct InstrumentedRecordBatchStreamAdapter&lt;S&gt;` | rust/lance/src/io/exec/utils.rs:735-735 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( schema: SchemaRef, stream: S, partition: usize, metrics: &ExecutionPlanMetricsSet, ) -&gt; Self` | rust/lance/src/io/exec/utils.rs:745-750 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct InstrumentedChildInputStream&lt;F, Fut&gt;` | rust/lance/src/io/exec/utils.rs:808-808 | Stream wrapper for an `ExecutionPlan` node that pulls from a child input and applies a per-batch async transform. |
| `pub fn new( input: SendableRecordBatchStream, schema: SchemaRef, transform: F, concurrency: usize, partition: usize, metrics: &ExecutionPlanMetricsSet, ) -&gt; Self` | rust/lance/src/io/exec/utils.rs:824-831 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct IoMetrics` | rust/lance/src/io/exec/utils.rs:974-974 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(metrics: &ExecutionPlanMetricsSet, partition: usize) -&gt; Self` | rust/lance/src/io/exec/utils.rs:984-984 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn record(&self, scan_scheduler: &ScanScheduler)` | rust/lance/src/io/exec/utils.rs:995-995 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn record_stats(&self, stats: ScanStats)` | rust/lance/src/io/exec/utils.rs:1003-1003 | Record a snapshot of cumulative I/O statistics. |
| `pub struct IndexMetrics` | rust/lance/src/io/exec/utils.rs:1011-1011 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(metrics: &ExecutionPlanMetricsSet, partition: usize) -&gt; Self` | rust/lance/src/io/exec/utils.rs:1027-1027 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn flush_io(&self)` | rust/lance/src/io/exec/utils.rs:1044-1044 | Publish the I/O accumulated in the per-query sink to the displayed `iops`/`requests`/`bytes_read` metrics. Call once when the operator's stream finishes; the sink only accumulates on cache misses, so a fully cache-resident query publishes zeros. |


<a id="source-rust-lance-src-io-object-store-rs"></a>

## `rust/lance/src/io/object_store.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use lance_core::io::object_store::*;` | rust/lance/src/io/object_store.rs:5-5 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-lib-rs"></a>

## `rust/lance/src/lib.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use lance_core::datatypes;` | rust/lance/src/lib.rs:82-82 | No standalone documentation summary; use the family contract and source entry. |
| `pub use lance_core::` | rust/lance/src/lib.rs:83-83 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod arrow;` | rust/lance/src/lib.rs:86-86 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod blob;` | rust/lance/src/lib.rs:87-87 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod datafusion;` | rust/lance/src/lib.rs:88-88 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod dataset;` | rust/lance/src/lib.rs:89-89 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod index;` | rust/lance/src/lib.rs:90-90 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod io;` | rust/lance/src/lib.rs:91-91 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod metrics;` | rust/lance/src/lib.rs:93-93 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod session;` | rust/lance/src/lib.rs:94-94 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod table;` | rust/lance/src/lib.rs:95-95 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod utils;` | rust/lance/src/lib.rs:96-96 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod pb` | rust/lance/src/lib.rs:98-98 | No standalone documentation summary; use the family contract and source entry. |
| `pub use blob::` | rust/lance/src/lib.rs:103-103 | No standalone documentation summary; use the family contract and source entry. |
| `pub use dataset::Dataset;` | rust/lance/src/lib.rs:108-108 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn open_dataset&lt;T: AsRef&lt;str&gt;&gt;(table_uri: T) -&gt; Result&lt;Dataset&gt;` | rust/lance/src/lib.rs:115-115 | Creates and loads a [`Dataset`] from the given path. Infers the storage backend to use from the scheme in the given table path. |
| `pub static DIST_FIELD: LazyLock&lt;arrow_schema::Field&gt; = LazyLock::new(\|\| arrow_schema::Field::new(DIST_COL, DataType::Float32, true));` | rust/lance/src/lib.rs:119-120 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod deps` | rust/lance/src/lib.rs:127-127 | Re-exports of 3rd party dependencies used in lance public APIs |
| `pub use arrow_array;` | rust/lance/src/lib.rs:128-128 | No standalone documentation summary; use the family contract and source entry. |
| `pub use arrow_schema;` | rust/lance/src/lib.rs:129-129 | No standalone documentation summary; use the family contract and source entry. |
| `pub use datafusion;` | rust/lance/src/lib.rs:130-130 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-session-rs"></a>

## `rust/lance/src/session.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod index_caches;` | rust/lance/src/session.rs:25-25 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum CacheSpec` | rust/lance/src/session.rs:30-30 | Cache selection for one session cache tier. |
| `pub struct Session` | rust/lance/src/session.rs:56-56 | A user session holds the runtime state for a [`crate::Dataset`] |
| `pub fn new( index_cache_size: usize, metadata_cache_size: usize, store_registry: Arc&lt;ObjectStoreRegistry&gt;, ) -&gt; Self` | rust/lance/src/session.rs:124-128 | Create a new session. |
| `pub fn with_index_cache_backend( index_cache_backend: Arc&lt;dyn CacheBackend&gt;, metadata_cache_size: usize, store_registry: Arc&lt;ObjectStoreRegistry&gt;, ) -&gt; Self` | rust/lance/src/session.rs:148-152 | Create a session with a custom index cache backend. |
| `pub fn with_spill_store(mut self, store: Arc&lt;dyn SpillStore&gt;) -&gt; Self` | rust/lance/src/session.rs:177-177 | Replace the spill store used by this session. |
| `pub fn spill_store(&self) -&gt; &dyn SpillStore` | rust/lance/src/session.rs:186-186 | Return a reference to the session's spill store. |
| `pub fn with_cache_backends( index_cache: CacheSpec, metadata_cache: CacheSpec, store_registry: Arc&lt;ObjectStoreRegistry&gt;, ) -&gt; Self` | rust/lance/src/session.rs:220-224 | Create a session with custom backends for both caches. |
| `pub fn register_index_extension( &mut self, name: String, extension: Arc&lt;dyn IndexExtension&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance/src/session.rs:274-278 | Register a new index extension. |
| `pub fn size_bytes(&self) -&gt; u64` | rust/lance/src/session.rs:313-313 | Return the current size of the session in bytes |
| `pub fn approx_num_items(&self) -&gt; usize` | rust/lance/src/session.rs:323-323 | Get the approximate number of items in the session. |
| `pub fn store_registry(&self) -&gt; Arc&lt;ObjectStoreRegistry&gt;` | rust/lance/src/session.rs:330-330 | Get the object store registry. |
| `pub fn file_metadata_cache(&self) -&gt; &LanceCache` | rust/lance/src/session.rs:335-335 | Get a reference to the raw metadata cache (for use in index reconstruction). |
| `pub async fn metadata_cache_stats(&self) -&gt; lance_core::cache::CacheStats` | rust/lance/src/session.rs:340-340 | Fetch statistics for the metadata cache |
| `pub async fn index_cache_stats(&self) -&gt; lance_core::cache::CacheStats` | rust/lance/src/session.rs:345-345 | Fetch statistics for the index cache |

<a id="source-rust-lance-src-session-caches-rs"></a>

## `rust/lance/src/session/caches.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct GlobalMetadataCache(pub(super) LanceCache);` | rust/lance/src/session/caches.rs:32-32 | A type-safe wrapper around a LanceCache that enforces namespaces for dataset metadata. |
| `pub fn for_dataset(&self, uri: &str) -&gt; DSMetadataCache` | rust/lance/src/session/caches.rs:35-35 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct DSMetadataCache(pub(crate) LanceCache);` | rust/lance/src/session/caches.rs:56-56 | A type-safe wrapper around a LanceCache that enforces namespaces and keys for dataset metadata. |
| `pub struct ManifestKey&lt;'a&gt;` | rust/lance/src/session/caches.rs:68-68 | No standalone documentation summary; use the family contract and source entry. |
| `pub version: u64,` | rust/lance/src/session/caches.rs:69-69 | No standalone documentation summary; use the family contract and source entry. |
| `pub e_tag: Option&lt;&'a str&gt;,` | rust/lance/src/session/caches.rs:70-70 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct TransactionKey` | rust/lance/src/session/caches.rs:102-102 | No standalone documentation summary; use the family contract and source entry. |
| `pub version: u64,` | rust/lance/src/session/caches.rs:103-103 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct DeletionFileKey&lt;'a&gt;` | rust/lance/src/session/caches.rs:125-125 | No standalone documentation summary; use the family contract and source entry. |
| `pub fragment_id: u64,` | rust/lance/src/session/caches.rs:126-126 | No standalone documentation summary; use the family contract and source entry. |
| `pub deletion_file: &'a DeletionFile,` | rust/lance/src/session/caches.rs:127-127 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct RowAddrMaskKey` | rust/lance/src/session/caches.rs:167-167 | No standalone documentation summary; use the family contract and source entry. |
| `pub version: u64,` | rust/lance/src/session/caches.rs:168-168 | No standalone documentation summary; use the family contract and source entry. |
| `pub restrict_hash: Option&lt;u64&gt;,` | rust/lance/src/session/caches.rs:172-172 | `Some(hash)` when the mask is restricted to a fragment subset; `None` when it covers all fragments in the dataset. Two consumers that ask for different subsets must not poison each other's cache entry. |
| `pub struct RowIdIndexKey&lt;'a&gt;` | rust/lance/src/session/caches.rs:203-203 | No standalone documentation summary; use the family contract and source entry. |
| `pub version: u64,` | rust/lance/src/session/caches.rs:204-204 | No standalone documentation summary; use the family contract and source entry. |
| `pub e_tag: Option&lt;&'a str&gt;,` | rust/lance/src/session/caches.rs:211-211 | A dataset dropped and recreated at the same URI restarts its version history at 1, so a long-lived session's cache can otherwise return the previous incarnation's index for a version number the new incarnation now also holds. The e-tag disambiguates generations the same way [`ManifestKey::e_tag`] does. Callers without one must not share the cached index at all (see `get_row_id_index`). |
| `pub struct RowIdSequenceKey&lt;'a&gt;` | rust/lance/src/session/caches.rs:244-244 | No standalone documentation summary; use the family contract and source entry. |
| `pub fragment_id: u64,` | rust/lance/src/session/caches.rs:245-245 | No standalone documentation summary; use the family contract and source entry. |
| `pub row_id_meta: &'a RowIdMeta,` | rust/lance/src/session/caches.rs:263-263 | Where the sequence is stored. A fragment id alone is not enough: this cache is namespaced by dataset URI only (see [`GlobalMetadataCache::for_dataset`]), and a dataset dropped and recreated at the same URI restarts fragment ids at 0, so a reused id would otherwise be served the earlier generation's sequence (#7645). The `row_id_meta` differentiates generations of dataset fragments. |
| `pub lineage_file: Option&lt;&'a DataFile&gt;,` | rust/lance/src/session/caches.rs:266-266 | The data file the sequence is spilled to, when `row_id_meta` says it is one; identifies the contents the way an inline digest does. |
| `pub struct RowVersionSequenceKey&lt;'a&gt;` | rust/lance/src/session/caches.rs:313-313 | Cache key for one of a fragment's per-row version sequences that is spilled to a data file column. |
| `pub fragment_id: u64,` | rust/lance/src/session/caches.rs:314-314 | No standalone documentation summary; use the family contract and source entry. |
| `pub field_id: i32,` | rust/lance/src/session/caches.rs:316-316 | Which sequence this is, by the reserved field id of its column. |
| `pub data_file: &'a DataFile,` | rust/lance/src/session/caches.rs:319-319 | The data file carrying the column, named freshly per rewrite, so its path identifies the contents the way an inline sequence's digest does. |

<a id="source-rust-lance-src-session-index-caches-rs"></a>

## `rust/lance/src/session/index_caches.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct GlobalIndexCache(pub(super) LanceCache);` | rust/lance/src/session/index_caches.rs:22-22 | A type-safe wrapper around a LanceCache that enforces namespaces for index data. |
| `pub fn for_dataset(&self, uri: &str) -&gt; DSIndexCache` | rust/lance/src/session/index_caches.rs:25-25 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct DSIndexCache(pub(crate) LanceCache);` | rust/lance/src/session/index_caches.rs:54-54 | A type-safe wrapper around a LanceCache that enforces namespaces and keys for dataset-specific index data. |
| `pub fn for_index(&self, uuid: &Uuid, fri_uuid: Option&lt;&Uuid&gt;) -&gt; LanceCache` | rust/lance/src/session/index_caches.rs:66-66 | Create an index-specific cache with the given UUID prefix. |
| `pub struct FragReuseIndexKey&lt;'a&gt;` | rust/lance/src/session/index_caches.rs:95-95 | No standalone documentation summary; use the family contract and source entry. |
| `pub uuid: &'a Uuid,` | rust/lance/src/session/index_caches.rs:96-96 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct IndexMetadataKey&lt;'a&gt;` | rust/lance/src/session/index_caches.rs:161-161 | No standalone documentation summary; use the family contract and source entry. |
| `pub version: u64,` | rust/lance/src/session/index_caches.rs:162-162 | No standalone documentation summary; use the family contract and source entry. |
| `pub store_identity: &'a str,` | rust/lance/src/session/index_caches.rs:163-163 | No standalone documentation summary; use the family contract and source entry. |
| `pub e_tag: Option&lt;&'a str&gt;,` | rust/lance/src/session/index_caches.rs:164-164 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct DerivedIndexListingKey&lt;'a&gt;` | rust/lance/src/session/index_caches.rs:229-229 | Cache key for the query-time index listing DERIVED from a v1 (tagged) FRI: the coverage-rewritten, filtered listing produced by `frag_reuse_reader`. |
| `pub version: u64,` | rust/lance/src/session/index_caches.rs:230-230 | No standalone documentation summary; use the family contract and source entry. |
| `pub store_identity: &'a str,` | rust/lance/src/session/index_caches.rs:231-231 | No standalone documentation summary; use the family contract and source entry. |
| `pub e_tag: Option&lt;&'a str&gt;,` | rust/lance/src/session/index_caches.rs:232-232 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ProstAny(pub Arc&lt;prost_types::Any&gt;);` | rust/lance/src/session/index_caches.rs:272-272 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ScalarIndexDetailsKey&lt;'a&gt;` | rust/lance/src/session/index_caches.rs:287-287 | Cache key for scalar index details |
| `pub uuid: &'a Uuid,` | rust/lance/src/session/index_caches.rs:288-288 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-session-index-extension-rs"></a>

## `rust/lance/src/session/index_extension.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub trait IndexExtension: Send + Sync + DeepSizeOf` | rust/lance/src/session/index_extension.rs:16-16 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait ScalarIndexExtension: IndexExtension` | rust/lance/src/session/index_extension.rs:28-28 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait VectorIndexExtension: IndexExtension` | rust/lance/src/session/index_extension.rs:33-33 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-table-rs"></a>

## `rust/lance/src/table.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use lance_table::format;` | rust/lance/src/table.rs:4-4 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-src-utils-future-rs"></a>

## `rust/lance/src/utils/future.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct SharedPrerequisite&lt;T: Clone&gt;(Arc&lt;AsyncCell&lt;std::result::Result&lt;T, String&gt;&gt;&gt;);` | rust/lance/src/utils/future.rs:16-16 | An async background task whose output can be shared across threads (via cloning) |
| `pub fn get_ready(&self) -&gt; T` | rust/lance/src/utils/future.rs:22-22 | Synchronously get a cloned copy of the cached output |
| `pub async fn wait_ready(&self) -&gt; crate::Result&lt;()&gt;` | rust/lance/src/utils/future.rs:34-34 | Asynchronously wait for the output to be ready |
| `pub fn spawn&lt;F&gt;(future: F) -&gt; Arc&lt;Self&gt; where T: Clone + Send + 'static, F: Future&lt;Output = crate::Result&lt;T&gt;&gt; + Send + 'static,` | rust/lance/src/utils/future.rs:43-47 | Launch a background task (using tokio::spawn) and get a shareable handle to the eventual result |

<a id="source-rust-lance-src-utils-temporal-rs"></a>

## `rust/lance/src/utils/temporal.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub type SystemTime = NativeSystemTime;` | rust/lance/src/utils/temporal.rs:15-15 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn utc_now() -&gt; DateTime&lt;Utc&gt;` | rust/lance/src/utils/temporal.rs:19-19 | Mirror function that mimics DateTime&lt;Utc&gt;::now() with the exception that it uses the potentially mocked system time. |
| `pub fn timestamp_to_nanos(timestamp: Option&lt;SystemTime&gt;) -&gt; u128` | rust/lance/src/utils/temporal.rs:29-29 | No standalone documentation summary; use the family contract and source entry. |


## Newly public in this refresh

`Scanner::project_with_schema` — public schema projection by compatible names/types; see rust/lance/src/dataset/scanner.rs:1864-1867 and [contract](../refresh-2026-10-07.md#query-and-public-api-changes).

## Referenced additions — 2026-10-09

Pin `db684d1f0726c00b6defb7963a604a7719e82b5a`. Dataset::count_indexed_rows: `rust/lance/src/dataset/scanner.rs:1447-1656`. ShardWriter::evolve_to: `rust/lance/src/dataset/mem_wal/api.rs:857-879`; evolve_schema: `rust/lance/src/dataset/mem_wal/write.rs:3966-3999`. TopKLateMaterialization: `rust/lance/src/io/exec/topk_late_materialization.rs:69-134`. [Contracts](../refresh-2026-10-09.md).
