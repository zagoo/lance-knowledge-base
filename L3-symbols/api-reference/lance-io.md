# lance-io: public declaration and documented-contract directory

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**Trust: declared source interface; body behavior is verified only where the linked family/protocol contract says so.** This catalog supplies exact argument/type entry points and the source author's first documentation paragraph. It is not an inferred call graph or a second symbol ledger. Rust `pub` can occur under a private/feature-gated module; confirm re-export and cfg boundaries before changing an external API. Trait method contracts and enum variants are reached through the trait/type entry. Python inherited external-library APIs are outside direct-source scope.

[Family contracts](../public-api.md) · [Module Map](../../L1-modules/rust-lance-io.md) · [Scope](../../V21-PROTOCOL.md)

<a id="source-rust-lance-io-src-lib-rs"></a>

## `rust/lance-io/src/lib.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod ffi;` | rust/lance-io/src/lib.rs:13-13 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod local;` | rust/lance-io/src/lib.rs:14-14 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod object_reader;` | rust/lance-io/src/lib.rs:15-15 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod object_store;` | rust/lance-io/src/lib.rs:16-16 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod object_writer;` | rust/lance-io/src/lib.rs:17-17 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod scheduler;` | rust/lance-io/src/lib.rs:18-18 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod spill;` | rust/lance-io/src/lib.rs:19-19 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod stream;` | rust/lance-io/src/lib.rs:20-20 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod traits;` | rust/lance-io/src/lib.rs:23-23 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod uring;` | rust/lance-io/src/lib.rs:25-25 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod utils;` | rust/lance-io/src/lib.rs:26-26 | No standalone documentation summary; use the family contract and source entry. |
| `pub use scheduler::` | rust/lance-io/src/lib.rs:28-28 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum ReadBatchParams` | rust/lance-io/src/lib.rs:32-32 | Defines a selection of rows to read from a file/batch |
| `pub fn valid_given_len(&self, len: usize) -&gt; bool` | rust/lance-io/src/lib.rs:126-126 | Validate that the selection is valid given the length of the batch |
| `pub fn slice(&self, start: usize, length: usize) -&gt; Result&lt;Self&gt;` | rust/lance-io/src/lib.rs:156-156 | Slice the selection |
| `pub fn to_offsets(&self) -&gt; Result&lt;PrimitiveArray&lt;UInt32Type&gt;&gt;` | rust/lance-io/src/lib.rs:225-225 | Convert a read range into a vector of row offsets |
| `pub fn iter_offset_ranges&lt;'a&gt;( &'a self, ) -&gt; Result&lt;Box&lt;dyn Iterator&lt;Item = Range&lt;u32&gt;&gt; + Send + 'a&gt;&gt;` | rust/lance-io/src/lib.rs:248-250 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn to_ranges(&self) -&gt; Result&lt;Vec&lt;Range&lt;u64&gt;&gt;&gt;` | rust/lance-io/src/lib.rs:264-264 | Convert a read range into a vector of row ranges |
| `pub fn to_offsets_total(&self, total: u32) -&gt; PrimitiveArray&lt;UInt32Type&gt;` | rust/lance-io/src/lib.rs:282-282 | Same thing as to_offsets but the caller knows the total number of rows in the file |

<a id="source-rust-lance-io-src-local-rs"></a>

## `rust/lance-io/src/local.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn to_local_path(path: &Path) -&gt; String` | rust/lance-io/src/local.rs:36-36 | Convert an [`object_store::path::Path`] to a [`std::path::Path`]. |
| `pub fn remove_dir_all(path: &Path) -&gt; Result&lt;()&gt;` | rust/lance-io/src/local.rs:45-45 | Recursively remove a directory, specified by [`object_store::path::Path`]. |
| `pub fn copy_file(from: &Path, to: &Path) -&gt; Result&lt;()&gt;` | rust/lance-io/src/local.rs:177-177 | Copy a file from one location to another, supporting cross-filesystem copies. |
| `pub struct LocalObjectReader` | rust/lance-io/src/local.rs:213-213 | Object reader for local file system. |
| `pub async fn open_local_path( path: impl AsRef&lt;std::path::Path&gt;, block_size: usize, known_size: Option&lt;usize&gt;, ) -&gt; Result&lt;Box&lt;dyn Reader&gt;&gt;` | rust/lance-io/src/local.rs:239-243 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn open( path: &Path, block_size: usize, known_size: Option&lt;usize&gt;, ) -&gt; Result&lt;Box&lt;dyn Reader&gt;&gt;` | rust/lance-io/src/local.rs:253-257 | Open a local object reader, with default prefetch size. |

<a id="source-rust-lance-io-src-object-reader-rs"></a>

## `rust/lance-io/src/object_reader.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct CloudObjectReader` | rust/lance-io/src/object_reader.rs:65-65 | Object Reader |
| `pub object_store: Arc&lt;dyn ObjectStore&gt;,` | rust/lance-io/src/object_reader.rs:67-67 | No standalone documentation summary; use the family contract and source entry. |
| `pub path: Path,` | rust/lance-io/src/object_reader.rs:69-69 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( object_store: Arc&lt;dyn ObjectStore&gt;, path: Path, block_size: usize, known_size: Option&lt;usize&gt;, download_retry_count: usize, ) -&gt; Result&lt;Self&gt;` | rust/lance-io/src/object_reader.rs:87-93 | Create an ObjectReader from URI |
| `pub fn with_io_parallelism(mut self, io_parallelism: usize) -&gt; Self` | rust/lance-io/src/object_reader.rs:110-110 | Override the I/O parallelism this reader advertises. |
| `pub struct SmallReaderInner` | rust/lance-io/src/object_reader.rs:268-268 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct SmallReader` | rust/lance-io/src/object_reader.rs:282-282 | A reader for a file so small, we just eagerly read it all into memory. |
| `pub fn new( store: Arc&lt;dyn ObjectStore&gt;, path: Path, download_retry_count: usize, size: usize, ) -&gt; Self` | rust/lance-io/src/object_reader.rs:306-311 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-io-src-object-store-rs"></a>

## `rust/lance-io/src/object_store.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod metrics;` | rust/lance-io/src/object_store.rs:51-51 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod providers;` | rust/lance-io/src/object_store.rs:63-63 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod storage_options;` | rust/lance-io/src/object_store.rs:65-65 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod throttle;` | rust/lance-io/src/object_store.rs:68-68 | No standalone documentation summary; use the family contract and source entry. |
| `pub const DEFAULT_LOCAL_IO_PARALLELISM: usize = 8;` | rust/lance-io/src/object_store.rs:81-81 | No standalone documentation summary; use the family contract and source entry. |
| `pub const DEFAULT_CLOUD_IO_PARALLELISM: usize = 64;` | rust/lance-io/src/object_store.rs:83-83 | No standalone documentation summary; use the family contract and source entry. |
| `pub static DEFAULT_MAX_IOP_SIZE: std::sync::LazyLock&lt;u64&gt; = std::sync::LazyLock::new(\|\|` | rust/lance-io/src/object_store.rs:100-100 | No standalone documentation summary; use the family contract and source entry. |
| `pub const DEFAULT_DOWNLOAD_RETRY_COUNT: usize = 3;` | rust/lance-io/src/object_store.rs:106-106 | No standalone documentation summary; use the family contract and source entry. |
| `pub use providers::` | rust/lance-io/src/object_store.rs:146-146 | No standalone documentation summary; use the family contract and source entry. |
| `pub use read_dir::ReadDirOptions;` | rust/lance-io/src/object_store.rs:147-147 | No standalone documentation summary; use the family contract and source entry. |
| `pub use storage_options::` | rust/lance-io/src/object_store.rs:148-148 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait ObjectStoreExt` | rust/lance-io/src/object_store.rs:156-156 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ObjectStore` | rust/lance-io/src/object_store.rs:203-203 | Wraps ObjectStore |
| `pub inner: Arc&lt;dyn OSObjectStore&gt;,` | rust/lance-io/src/object_store.rs:205-205 | No standalone documentation summary; use the family contract and source entry. |
| `pub use_constant_size_upload_parts: bool,` | rust/lance-io/src/object_store.rs:213-213 | Whether to use constant size upload parts for multipart uploads. This is only necessary for Cloudflare R2. |
| `pub list_is_lexically_ordered: bool,` | rust/lance-io/src/object_store.rs:216-216 | Whether we can assume that the list of files is lexically ordered. This is true for object stores, but not for local filesystems. |
| `pub store_prefix: String,` | rust/lance-io/src/object_store.rs:225-225 | The datastore prefix that uniquely identifies this object store. It encodes information which usually cannot be found in the URL such as Azure account name. The prefix plus the path uniquely identifies any object inside the store. |
| `pub trait WrappingObjectStore: std::fmt::Debug + Send + Sync` | rust/lance-io/src/object_store.rs:269-269 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ChainedWrappingObjectStore` | rust/lance-io/src/object_store.rs:306-306 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(wrappers: Vec&lt;Arc&lt;dyn WrappingObjectStore&gt;&gt;) -&gt; Self` | rust/lance-io/src/object_store.rs:311-311 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn add_wrapper(&mut self, wrapper: Arc&lt;dyn WrappingObjectStore&gt;)` | rust/lance-io/src/object_store.rs:315-315 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ObjectStoreParams` | rust/lance-io/src/object_store.rs:343-343 | Parameters to create an [ObjectStore] |
| `pub block_size: Option&lt;usize&gt;,` | rust/lance-io/src/object_store.rs:344-344 | No standalone documentation summary; use the family contract and source entry. |
| `pub object_store: Option&lt;(Arc&lt;DynObjectStore&gt;, Url)&gt;,` | rust/lance-io/src/object_store.rs:346-346 | No standalone documentation summary; use the family contract and source entry. |
| `pub s3_credentials_refresh_offset: Duration,` | rust/lance-io/src/object_store.rs:349-349 | Refresh offset for AWS credentials when using the legacy AWS credentials path. For StorageOptionsAccessor, use `refresh_offset_millis` storage option instead. |
| `pub aws_credentials: Option&lt;AwsCredentialProvider&gt;,` | rust/lance-io/src/object_store.rs:351-351 | No standalone documentation summary; use the family contract and source entry. |
| `pub object_store_wrapper: Option&lt;Arc&lt;dyn WrappingObjectStore&gt;&gt;,` | rust/lance-io/src/object_store.rs:352-352 | No standalone documentation summary; use the family contract and source entry. |
| `pub storage_options_accessor: Option&lt;Arc&lt;StorageOptionsAccessor&gt;&gt;,` | rust/lance-io/src/object_store.rs:358-358 | Unified storage options accessor with caching and automatic refresh |
| `pub use_constant_size_upload_parts: bool,` | rust/lance-io/src/object_store.rs:363-363 | Use constant size upload parts for multipart uploads. Only necessary for Cloudflare R2, which doesn't support variable size parts. When this is false, max upload size is 2.5TB. When this is true, the max size is 50GB. |
| `pub list_is_lexically_ordered: Option&lt;bool&gt;,` | rust/lance-io/src/object_store.rs:364-364 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn get_accessor(&self) -&gt; Option&lt;Arc&lt;StorageOptionsAccessor&gt;&gt;` | rust/lance-io/src/object_store.rs:386-386 | Get the StorageOptionsAccessor from the params |
| `pub fn storage_options(&self) -&gt; Option&lt;&HashMap&lt;String, String&gt;&gt;` | rust/lance-io/src/object_store.rs:393-393 | Get storage options from the accessor, if any |
| `pub fn resolved_block_size(&self) -&gt; Result&lt;Option&lt;usize&gt;&gt;` | rust/lance-io/src/object_store.rs:401-401 | The block size to use: the explicit `block_size` parameter, else the `block_size` storage option, else `None` for the store's default. |
| `pub fn scoped_to_base(&self, base_id: Option&lt;u32&gt;) -&gt; Cow&lt;'_, Self&gt;` | rust/lance-io/src/object_store.rs:417-417 | Resolve these params for a single base path scope. |
| `pub fn uri_to_url(uri: &str) -&gt; Result&lt;Url&gt;` | rust/lance-io/src/object_store.rs:528-528 | Convert a URI string or local path to a URL |
| `pub async fn from_uri(uri: &str) -&gt; Result&lt;(Arc&lt;Self&gt;, Path)&gt;` | rust/lance-io/src/object_store.rs:628-628 | Parse from a string URI. |
| `pub async fn from_uri_and_params( registry: Arc&lt;ObjectStoreRegistry&gt;, uri: &str, params: &ObjectStoreParams, ) -&gt; Result&lt;(Arc&lt;Self&gt;, Path)&gt;` | rust/lance-io/src/object_store.rs:637-641 | Parse from a string URI. |
| `pub async fn from_uri_and_params_uncached( registry: Arc&lt;ObjectStoreRegistry&gt;, uri: &str, params: &ObjectStoreParams, ) -&gt; Result&lt;(Arc&lt;Self&gt;, Path)&gt;` | rust/lance-io/src/object_store.rs:650-654 | Parse a URI and build a fresh object store outside the registry cache. |
| `pub fn extract_path_from_uri(registry: Arc&lt;ObjectStoreRegistry&gt;, uri: &str) -&gt; Result&lt;Path&gt;` | rust/lance-io/src/object_store.rs:729-729 | Extract the path component from a URI without initializing the object store. |
| `pub fn from_path(str_path: &str) -&gt; Result&lt;(Arc&lt;Self&gt;, Path)&gt;` | rust/lance-io/src/object_store.rs:738-738 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn local() -&gt; Self` | rust/lance-io/src/object_store.rs:749-749 | Local object store. |
| `pub fn memory() -&gt; Self` | rust/lance-io/src/object_store.rs:759-759 | Create a in-memory object store directly for testing. |
| `pub fn is_local(&self) -&gt; bool` | rust/lance-io/src/object_store.rs:769-769 | Returns true if the object store pointed to a local file system. |
| `pub fn has_direct_local_paths(&self) -&gt; bool` | rust/lance-io/src/object_store.rs:777-777 | Returns true when object paths directly encode absolute local filesystem paths. |
| `pub fn is_cloud(&self) -&gt; bool` | rust/lance-io/src/object_store.rs:781-781 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn prefers_lite_scheduler(&self) -&gt; bool` | rust/lance-io/src/object_store.rs:792-792 | Whether this object store prefers the lite scheduler. |
| `pub fn scheme(&self) -&gt; &str` | rust/lance-io/src/object_store.rs:796-796 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn block_size(&self) -&gt; usize` | rust/lance-io/src/object_store.rs:800-800 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn max_iop_size(&self) -&gt; u64` | rust/lance-io/src/object_store.rs:804-804 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn io_parallelism(&self) -&gt; usize` | rust/lance-io/src/object_store.rs:814-814 | The amount of parallelism to use for I/O operations. |
| `pub fn io_tracker(&self) -&gt; &IOTracker` | rust/lance-io/src/object_store.rs:825-825 | Get the IO tracker for this object store |
| `pub fn io_stats_snapshot(&self) -&gt; IoStats` | rust/lance-io/src/object_store.rs:833-833 | Get a snapshot of current IO statistics without resetting counters |
| `pub fn io_stats_incremental(&self) -&gt; IoStats` | rust/lance-io/src/object_store.rs:842-842 | Get incremental IO statistics since the last call to this method |
| `pub fn apply_wrapper(&mut self, wrapper: &dyn WrappingObjectStore)` | rust/lance-io/src/object_store.rs:851-851 | Apply a [`WrappingObjectStore`] to both `inner` and `paginated_lister` together. |
| `pub async fn open(&self, path: &Path) -&gt; Result&lt;Box&lt;dyn Reader&gt;&gt;` | rust/lance-io/src/object_store.rs:863-863 | Open a file for path. |
| `pub async fn open_with_size(&self, path: &Path, known_size: usize) -&gt; Result&lt;Box&lt;dyn Reader&gt;&gt;` | rust/lance-io/src/object_store.rs:917-917 | Open a reader for a file with known size. |
| `pub async fn create_local_writer(path: &std::path::Path) -&gt; Result&lt;ObjectWriter&gt;` | rust/lance-io/src/object_store.rs:978-978 | Create an [ObjectWriter] from local [std::path::Path] |
| `pub async fn open_local(path: &std::path::Path) -&gt; Result&lt;Box&lt;dyn Reader&gt;&gt;` | rust/lance-io/src/object_store.rs:986-986 | Open an [Reader] from local [std::path::Path] |
| `pub async fn create(&self, path: &Path) -&gt; Result&lt;Box&lt;dyn Writer&gt;&gt;` | rust/lance-io/src/object_store.rs:994-994 | Create a new file. |
| `pub async fn put(&self, path: &Path, content: &[u8]) -&gt; Result&lt;WriteResult&gt;` | rust/lance-io/src/object_store.rs:1033-1033 | A helper function to create a file and write content to it. |
| `pub async fn put_if_absent( &self, path: &Path, content: PutPayload, ) -&gt; object_store::Result&lt;()&gt;` | rust/lance-io/src/object_store.rs:1047-1051 | Atomically creates an object without replacing an existing object. |
| `pub async fn delete(&self, path: &Path) -&gt; Result&lt;()&gt;` | rust/lance-io/src/object_store.rs:1090-1090 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn copy(&self, from: &Path, to: &Path) -&gt; Result&lt;()&gt;` | rust/lance-io/src/object_store.rs:1099-1099 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn copy_bulk( &self, source_path: &Path, destination_store: &Self, destination_path: &Path, ) -&gt; Result&lt;WriteResult&gt;` | rust/lance-io/src/object_store.rs:1138-1143 | Copy an object using the policy for bulk file movement. |
| `pub async fn copy_via_stream( &self, source_path: &Path, destination_store: &Self, destination_path: &Path, ) -&gt; Result&lt;WriteResult&gt;` | rust/lance-io/src/object_store.rs:1245-1250 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn read_dir(&self, dir_path: impl Into&lt;Path&gt;) -&gt; Result&lt;Vec&lt;String&gt;&gt;` | rust/lance-io/src/object_store.rs:1480-1480 | Read a directory (start from base directory) and returns all sub-paths in the directory. |
| `pub async fn list_with_delimiter(&self, prefix: Option&lt;&Path&gt;) -&gt; Result&lt;ListResult&gt;` | rust/lance-io/src/object_store.rs:1498-1498 | Non-recursive, path-segment delimited list of a single directory level. |
| `pub fn list( &self, path: Option&lt;Path&gt;, ) -&gt; Pin&lt;Box&lt;dyn Stream&lt;Item = Result&lt;ObjectMeta&gt;&gt; + Send&gt;&gt;` | rust/lance-io/src/object_store.rs:1502-1505 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn read_dir_all&lt;'a, 'b&gt;( &'a self, dir_path: impl Into&lt;&'b Path&gt; + Send, unmodified_since: Option&lt;DateTime&lt;Utc&gt;&gt;, ) -&gt; BoxStream&lt;'a, Result&lt;ObjectMeta&gt;&gt;` | rust/lance-io/src/object_store.rs:1512-1516 | Read all files (start from base directory) recursively |
| `pub async fn remove_dir_all(&self, dir_path: impl Into&lt;Path&gt;) -&gt; Result&lt;()&gt;` | rust/lance-io/src/object_store.rs:1521-1521 | Remove a directory recursively. |
| `pub async fn remove_empty_dirs( &self, root_path: impl Into&lt;Path&gt;, retained_dirs: HashSet&lt;Path&gt;, verified_dirs: HashSet&lt;Path&gt;, unmodified_since: Option&lt;DateTime&lt;Utc&gt;&gt;, ) -&gt; Result&lt;()&gt;` | rust/lance-io/src/object_store.rs:1582-1588 | Remove eligible materialized empty directories below a local root. |
| `pub fn remove_stream&lt;'a&gt;( &'a self, locations: BoxStream&lt;'a, Result&lt;Path&gt;&gt;, ) -&gt; BoxStream&lt;'a, Result&lt;Path&gt;&gt;` | rust/lance-io/src/object_store.rs:1618-1621 | Delete every location in the stream, up to `io_parallelism` at a time. |
| `pub async fn exists(&self, path: &Path) -&gt; Result&lt;bool&gt;` | rust/lance-io/src/object_store.rs:1640-1640 | Check a file exists. |
| `pub async fn size(&self, path: &Path) -&gt; Result&lt;u64&gt;` | rust/lance-io/src/object_store.rs:1649-1649 | Get file size. |
| `pub async fn read_one_all(&self, path: &Path) -&gt; Result&lt;Bytes&gt;` | rust/lance-io/src/object_store.rs:1654-1654 | Convenience function to open a reader and read all the bytes |
| `pub async fn read_one_range(&self, path: &Path, range: Range&lt;usize&gt;) -&gt; Result&lt;Bytes&gt;` | rust/lance-io/src/object_store.rs:1663-1663 | Convenience function open a reader and make a single request |
| `pub enum LanceConfigKey` | rust/lance-io/src/object_store.rs:1671-1671 | Options that can be set for multiple object stores |
| `pub struct StorageOptions(pub HashMap&lt;String, String&gt;);` | rust/lance-io/src/object_store.rs:1690-1690 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(options: HashMap&lt;String, String&gt;) -&gt; Self` | rust/lance-io/src/object_store.rs:1752-1752 | Create a new instance of [`StorageOptions`] |
| `pub fn allow_http(&self) -&gt; bool` | rust/lance-io/src/object_store.rs:1773-1773 | Denotes if unsecure connections via http are allowed |
| `pub fn block_size(&self) -&gt; Result&lt;Option&lt;usize&gt;&gt;` | rust/lance-io/src/object_store.rs:1781-1781 | Byte gap below which the I/O scheduler merges two reads of one file into a single request, overriding the store's default. |
| `pub fn download_retry_count(&self) -&gt; usize` | rust/lance-io/src/object_store.rs:1798-1798 | Number of times to retry a download that fails |
| `pub fn client_max_retries(&self) -&gt; usize` | rust/lance-io/src/object_store.rs:1807-1807 | Max retry times to set in RetryConfig for object store client |
| `pub fn client_retry_timeout(&self) -&gt; u64` | rust/lance-io/src/object_store.rs:1816-1816 | Seconds of timeout to set in RetryConfig for object store client |
| `pub fn get(&self, key: &str) -&gt; Option&lt;&String&gt;` | rust/lance-io/src/object_store.rs:1824-1824 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn client_options(&self) -&gt; Result&lt;ClientOptions&gt;` | rust/lance-io/src/object_store.rs:1836-1836 | Build [`ClientOptions`] with default headers extracted from `headers.*` keys. |
| `pub fn expires_at_millis(&self) -&gt; Option&lt;u64&gt;` | rust/lance-io/src/object_store.rs:1859-1859 | Get the expiration time in milliseconds since epoch, if present |
| `pub fn new( mut store: Arc&lt;DynObjectStore&gt;, location: Url, block_size: Option&lt;usize&gt;, wrapper: Option&lt;Arc&lt;dyn WrappingObjectStore&gt;&gt;, use_constant_size_upload_parts: bool, list_is_lexically_ordered: bool, io_parallelism: usize, download_retry_count: usize, storage_options: Option&lt;&HashMap&lt;String, String&gt;&gt;, ) -&gt; Self` | rust/lance-io/src/object_store.rs:1877-1887 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-io-src-object-store-dynamic-credentials-rs"></a>

## `rust/lance-io/src/object_store/dynamic_credentials.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct DynamicCredentials(pub HashMap&lt;String, String&gt;);` | rust/lance-io/src/object_store/dynamic_credentials.rs:27-27 | Raw dynamic storage options fetched from a credential-vending source. |
| `pub struct NamespaceCredentialsProvider&lt;T&gt;` | rust/lance-io/src/object_store/dynamic_credentials.rs:38-38 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(accessor: Arc&lt;StorageOptionsAccessor&gt;) -&gt; Self` | rust/lance-io/src/object_store/dynamic_credentials.rs:53-53 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn from_provider(provider: Arc&lt;dyn StorageOptionsProvider&gt;) -&gt; Self` | rust/lance-io/src/object_store/dynamic_credentials.rs:60-60 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn from_provider_with_initial( provider: Arc&lt;dyn StorageOptionsProvider&gt;, initial_options: HashMap&lt;String, String&gt;, ) -&gt; Self` | rust/lance-io/src/object_store/dynamic_credentials.rs:64-67 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn build_dynamic_credential_provider&lt;T&gt;( accessor: Option&lt;Arc&lt;StorageOptionsAccessor&gt;&gt;, ) -&gt; Result&lt;Option&lt;Arc&lt;dyn CredentialProvider&lt;Credential = T&gt;&gt;&gt;&gt; where T: TryFrom&lt;DynamicCredentials, Error = Error&gt; + fmt::Debug + Send + Sync + 'static,` | rust/lance-io/src/object_store/dynamic_credentials.rs:77-82 | Build a dynamic credential provider for any cloud type, returning `None` if the accessor has no provider or the provider options are incompatible with `T`. |

<a id="source-rust-lance-io-src-object-store-list-retry-rs"></a>

## `rust/lance-io/src/object_store/list_retry.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct ListRetryStream` | rust/lance-io/src/object_store/list_retry.rs:19-19 | A stream that does outer retries on list operations. |
| `pub fn new( object_store: Arc&lt;dyn ObjectStore&gt;, prefix: Option&lt;Path&gt;, max_retries: usize, ) -&gt; Self` | rust/lance-io/src/object_store/list_retry.rs:32-36 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-io-src-object-store-metrics-rs"></a>

## `rust/lance-io/src/object_store/metrics.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const METRIC_REQUESTS: &str = "lance_object_store_requests_total";` | rust/lance-io/src/object_store/metrics.rs:76-76 | Total number of object store requests, labelled by `operation` and `base`. |
| `pub const METRIC_BYTES: &str = "lance_object_store_request_bytes_total";` | rust/lance-io/src/object_store/metrics.rs:78-78 | Total bytes transferred by object store requests, labelled by `operation` and `base`. |
| `pub const METRIC_DURATION: &str = "lance_object_store_request_duration_seconds";` | rust/lance-io/src/object_store/metrics.rs:80-80 | Object store request latency in seconds, labelled by `operation` and `base`. |
| `pub const METRIC_ERRORS: &str = "lance_object_store_errors_total";` | rust/lance-io/src/object_store/metrics.rs:82-82 | Total number of failed object store requests, labelled by `operation` and `base`. |
| `pub const METRIC_THROTTLE: &str = "lance_object_store_throttle_total";` | rust/lance-io/src/object_store/metrics.rs:85-85 | Total number of throttle responses (HTTP 429 / 503) seen at the HTTP layer, labelled by `status` and `base`. Counts every attempt, including retries. |
| `pub const METRIC_RETRYABLE: &str = "lance_object_store_retryable_responses_total";` | rust/lance-io/src/object_store/metrics.rs:90-90 | Total number of retryable responses (HTTP 5xx / 429 / 408) seen at the HTTP layer, labelled by `status` and `base`. Counts every attempt, including retries. This is a superset of [`METRIC_THROTTLE`]; 409 (conflict) is deliberately excluded so commit conflicts are not counted as retries. |
| `pub const METRIC_IN_FLIGHT: &str = "lance_object_store_in_flight_requests";` | rust/lance-io/src/object_store/metrics.rs:93-93 | Number of object store requests currently in flight, labelled by `operation` and `base`. |
| `pub const BASE_LABEL_ENV_VAR: &str = "LANCE_OBJECT_STORE_METRICS_LABEL";` | rust/lance-io/src/object_store/metrics.rs:96-96 | Environment variable controlling the cardinality of the `base` label. |
| `pub const REQUEST_DURATION_BOUNDS: &[f64] = &[ 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, // sub-10s 10.0, 20.0, 30.0, 45.0, 60.0, 90.0, 120.0, 150.0, 180.0, 240.0, 300.0, // 10s–5min ];` | rust/lance-io/src/object_store/metrics.rs:187-190 | Recommended histogram bucket boundaries for [`METRIC_DURATION`], in seconds. |
| `pub fn describe_metrics()` | rust/lance-io/src/object_store/metrics.rs:198-198 | Register descriptions (units and help text) for the object store metrics. |
| `pub fn histogram_bounds() -&gt; &'static [(&'static str, &'static [f64])]` | rust/lance-io/src/object_store/metrics.rs:239-239 | Recommended fixed bucket boundaries for the histogram metrics defined here, as `(metric_name, boundaries)` pairs. Exporters that aggregate histograms into fixed buckets read this to configure each histogram. |
| `pub fn record_request&lt;T&gt;( base: &str, operation: &'static str, start: Instant, bytes: u64, result: &OSResult&lt;T&gt;, )` | rust/lance-io/src/object_store/metrics.rs:244-250 | Record the outcome of a unary request: count, latency, bytes (on success), and errors. |
| `pub fn record_outcome( base: &str, operation: &'static str, start: Instant, bytes: u64, is_error: bool, )` | rust/lance-io/src/object_store/metrics.rs:257-263 | Record count, latency, and either transferred bytes or an error for a completed request. Used both for unary requests and for streamed GETs whose bytes are only known once the body finishes. |
| `pub fn record_count(base: &str, operation: &'static str)` | rust/lance-io/src/object_store/metrics.rs:277-277 | Record a single request count without latency, used for streaming operations (list / delete) whose work happens lazily as the stream is polled. |
| `pub fn record_error(base: &str, operation: &'static str)` | rust/lance-io/src/object_store/metrics.rs:282-282 | Record a single error for an operation. |
| `pub struct InFlightGuard` | rust/lance-io/src/object_store/metrics.rs:289-289 | Raises the in-flight gauge for an operation on creation and lowers it on drop, so the count stays balanced even if the request future or stream is cancelled or dropped before completing. |
| `pub fn new(base: &str, operation: &'static str) -&gt; Self` | rust/lance-io/src/object_store/metrics.rs:294-294 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct MeteredObjectStore` | rust/lance-io/src/object_store/metrics.rs:308-308 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait ObjectStoreMetricsExt` | rust/lance-io/src/object_store/metrics.rs:612-612 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct MeteringHttpConnector` | rust/lance-io/src/object_store/metrics.rs:637-637 | An [`HttpConnector`] that records throttle and retryable responses observed by the underlying HTTP client. Install it on the S3 / GCS / Azure builders via `with_http_connector`. |
| `pub fn new(base: String) -&gt; Self` | rust/lance-io/src/object_store/metrics.rs:643-643 | No standalone documentation summary; use the family contract and source entry. |
| `pub use http::MeteringHttpConnector;` | rust/lance-io/src/object_store/metrics.rs:820-820 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-io-src-object-store-providers-rs"></a>

## `rust/lance-io/src/object_store/providers.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod aws;` | rust/lance-io/src/object_store/providers.rs:22-22 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod azure;` | rust/lance-io/src/object_store/providers.rs:24-24 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod gcp;` | rust/lance-io/src/object_store/providers.rs:26-26 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod goosefs;` | rust/lance-io/src/object_store/providers.rs:28-28 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod huggingface;` | rust/lance-io/src/object_store/providers.rs:30-30 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod local;` | rust/lance-io/src/object_store/providers.rs:31-31 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod memory;` | rust/lance-io/src/object_store/providers.rs:32-32 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod oss;` | rust/lance-io/src/object_store/providers.rs:34-34 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod shared_memory;` | rust/lance-io/src/object_store/providers.rs:35-35 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod tencent;` | rust/lance-io/src/object_store/providers.rs:37-37 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod tos;` | rust/lance-io/src/object_store/providers.rs:39-39 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait ObjectStoreProvider: std::fmt::Debug + Sync + Send` | rust/lance-io/src/object_store/providers.rs:42-42 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ObjectStoreRegistryStats` | rust/lance-io/src/object_store/providers.rs:85-85 | Statistics for the object store registry cache. |
| `pub hits: u64,` | rust/lance-io/src/object_store/providers.rs:87-87 | Number of cache hits (store was already cached and reused). |
| `pub misses: u64,` | rust/lance-io/src/object_store/providers.rs:89-89 | Number of cache misses (new store had to be created). |
| `pub active_stores: usize,` | rust/lance-io/src/object_store/providers.rs:91-91 | Number of currently active object stores in the cache. |
| `pub struct ObjectStoreRegistry` | rust/lance-io/src/object_store/providers.rs:116-116 | A registry of object store providers. |
| `pub fn empty() -&gt; Self` | rust/lance-io/src/object_store/providers.rs:132-132 | Create a new registry with no providers registered. |
| `pub fn get_provider(&self, scheme: &str) -&gt; Option&lt;Arc&lt;dyn ObjectStoreProvider&gt;&gt;` | rust/lance-io/src/object_store/providers.rs:142-142 | Get the object store provider for a given scheme. |
| `pub fn active_stores(&self) -&gt; Vec&lt;Arc&lt;ObjectStore&gt;&gt;` | rust/lance-io/src/object_store/providers.rs:154-154 | Get a list of all active object stores. |
| `pub fn stats(&self) -&gt; ObjectStoreRegistryStats` | rust/lance-io/src/object_store/providers.rs:186-186 | Get cache statistics for monitoring and debugging. |
| `pub async fn new_store( &self, base_path: Url, params: &ObjectStoreParams, ) -&gt; Result&lt;Arc&lt;ObjectStore&gt;&gt;` | rust/lance-io/src/object_store/providers.rs:244-248 | Build a fresh object store without consulting or populating the cache. |
| `pub async fn get_store( &self, base_path: Url, params: &ObjectStoreParams, ) -&gt; Result&lt;Arc&lt;ObjectStore&gt;&gt;` | rust/lance-io/src/object_store/providers.rs:271-275 | Get an object store for a given base path and parameters. |
| `pub fn calculate_object_store_prefix( &self, uri: &str, storage_options: Option&lt;&HashMap&lt;String, String&gt;&gt;, ) -&gt; Result&lt;String&gt;` | rust/lance-io/src/object_store/providers.rs:341-345 | Calculate the datastore prefix based on the URI and the storage options. The data store prefix should uniquely identify the datastore. |
| `pub fn insert(&self, scheme: &str, provider: Arc&lt;dyn ObjectStoreProvider&gt;)` | rust/lance-io/src/object_store/providers.rs:418-418 | Add a new object store provider to the registry. The provider will be used in [`Self::get_store()`] when a URL is passed with a matching scheme. |

<a id="source-rust-lance-io-src-object-store-providers-aws-rs"></a>

## `rust/lance-io/src/object_store/providers/aws.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct AwsStoreProvider;` | rust/lance-io/src/object_store/providers/aws.rs:44-44 | No standalone documentation summary; use the family contract and source entry. |
| `pub enum AwsProviderScheme` | rust/lance-io/src/object_store/providers/aws.rs:331-331 | Selects which AWS credential provider to use for a dataset. |
| `pub async fn build_aws_credential( credentials_refresh_offset: Duration, credentials: Option&lt;AwsCredentialProvider&gt;, storage_options: Option&lt;&HashMap&lt;AmazonS3ConfigKey, String&gt;&gt;, region: Option&lt;String&gt;, storage_options_accessor: Option&lt;Arc&lt;StorageOptionsAccessor&gt;&gt;, provider_scheme: Option&lt;AwsProviderScheme&gt;, ) -&gt; Result&lt;(AwsCredentialProvider, String)&gt;` | rust/lance-io/src/object_store/providers/aws.rs:364-371 | Build AWS credentials |
| `pub struct AwsCredentialAdapter` | rust/lance-io/src/object_store/providers/aws.rs:489-489 | Adapt an AWS SDK cred into object_store credentials |
| `pub inner: Arc&lt;dyn ProvideCredentials&gt;,` | rust/lance-io/src/object_store/providers/aws.rs:490-490 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( provider: Arc&lt;dyn ProvideCredentials&gt;, credentials_refresh_offset: Duration, ) -&gt; Self` | rust/lance-io/src/object_store/providers/aws.rs:503-506 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_env_s3(&mut self)` | rust/lance-io/src/object_store/providers/aws.rs:619-619 | Add values from the environment to storage options. |
| `pub fn as_s3_options(&self) -&gt; HashMap&lt;AmazonS3ConfigKey, String&gt;` | rust/lance-io/src/object_store/providers/aws.rs:644-644 | Return options recognized by [`AmazonS3ConfigKey`], ignoring unknown keys. |
| `pub fn aws_provider_scheme(&self) -&gt; Result&lt;Option&lt;AwsProviderScheme&gt;&gt;` | rust/lance-io/src/object_store/providers/aws.rs:649-649 | Parse the `aws_provider_scheme` storage option, if set. |
| `pub fn with_aws_credentials( aws_credentials: Option&lt;AwsCredentialProvider&gt;, region: Option&lt;String&gt;, ) -&gt; Self` | rust/lance-io/src/object_store/providers/aws.rs:665-668 | Create a new instance of [`ObjectStoreParams`] based on the AWS credentials. |
| `pub type DynamicStorageOptionsCredentialProvider = NamespaceCredentialsProvider&lt;ObjectStoreAwsCredential&gt;;` | rust/lance-io/src/object_store/providers/aws.rs:682-683 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-rust-lance-io-src-object-store-providers-azure-rs"></a>

## `rust/lance-io/src/object_store/providers/azure.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct AzureBlobStoreProvider;` | rust/lance-io/src/object_store/providers/azure.rs:32-32 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_env_azure(&mut self)` | rust/lance-io/src/object_store/providers/azure.rs:340-340 | Add values from the environment without overriding explicit options, including aliases, case variants, and empty-string values. |
| `pub fn as_azure_options(&self) -&gt; HashMap&lt;AzureConfigKey, String&gt;` | rust/lance-io/src/object_store/providers/azure.rs:366-366 | Return options recognized by [`AzureConfigKey`], ignoring unknown keys. |


<a id="source-rust-lance-io-src-object-store-providers-gcp-rs"></a>

## `rust/lance-io/src/object_store/providers/gcp.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct GcsStoreProvider;` | rust/lance-io/src/object_store/providers/gcp.rs:33-33 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_env_gcs(&mut self)` | rust/lance-io/src/object_store/providers/gcp.rs:361-361 | Add values from the environment without overriding explicit options, including aliases, case variants, and empty-string values. |
| `pub fn as_gcs_options(&self) -&gt; HashMap&lt;GoogleConfigKey, String&gt;` | rust/lance-io/src/object_store/providers/gcp.rs:397-397 | Return options recognized by [`GoogleConfigKey`], ignoring unknown keys. |


<a id="source-rust-lance-io-src-object-store-providers-goosefs-rs"></a>

## `rust/lance-io/src/object_store/providers/goosefs.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct GooseFsStoreProvider;` | rust/lance-io/src/object_store/providers/goosefs.rs:98-98 | GooseFS object store provider. |

<a id="source-rust-lance-io-src-object-store-providers-huggingface-rs"></a>

## `rust/lance-io/src/object_store/providers/huggingface.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct HuggingfaceStoreProvider;` | rust/lance-io/src/object_store/providers/huggingface.rs:23-23 | Hugging Face object store provider backed by OpenDAL. |

<a id="source-rust-lance-io-src-object-store-providers-local-rs"></a>

## `rust/lance-io/src/object_store/providers/local.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct FileStoreProvider;` | rust/lance-io/src/object_store/providers/local.rs:20-20 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-io-src-object-store-providers-memory-rs"></a>

## `rust/lance-io/src/object_store/providers/memory.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct MemoryStoreProvider;` | rust/lance-io/src/object_store/providers/memory.rs:16-16 | Provides a fresh in-memory object store for each call to `new_store`. |

<a id="source-rust-lance-io-src-object-store-providers-oss-rs"></a>

## `rust/lance-io/src/object_store/providers/oss.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct OssStoreProvider;` | rust/lance-io/src/object_store/providers/oss.rs:20-20 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-io-src-object-store-providers-shared-memory-rs"></a>

## `rust/lance-io/src/object_store/providers/shared_memory.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct SharedMemoryStoreProvider` | rust/lance-io/src/object_store/providers/shared_memory.rs:46-46 | Like [`MemoryStoreProvider`], but every caller resolving a `shared-memory://&lt;authority&gt;/...` URL with the same `&lt;authority&gt;` sees the same backing bytes — across `ObjectStoreRegistry` instances, threads, and unrelated components in the same process. |

<a id="source-rust-lance-io-src-object-store-providers-tencent-rs"></a>

## `rust/lance-io/src/object_store/providers/tencent.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct TencentStoreProvider;` | rust/lance-io/src/object_store/providers/tencent.rs:18-18 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-io-src-object-store-providers-tos-rs"></a>

## `rust/lance-io/src/object_store/providers/tos.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct TosStoreProvider;` | rust/lance-io/src/object_store/providers/tos.rs:20-20 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-io-src-object-store-read-dir-rs"></a>

## `rust/lance-io/src/object_store/read_dir.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct ReadDirOptions` | rust/lance-io/src/object_store/read_dir.rs:39-39 | Options for [`ObjectStore::read_dir_page`]. |
| `pub page_token: Option&lt;String&gt;,` | rust/lance-io/src/object_store/read_dir.rs:45-45 | Resume after the page a previous call returned, using the token it handed back. |
| `pub limit: Option&lt;usize&gt;,` | rust/lance-io/src/object_store/read_dir.rs:48-48 | The page size to ask the backend for. Must be at least one. `None` lets the backend return as much as it will. |
| `pub async fn read_dir_page( &self, dir: impl Into&lt;Path&gt;, options: ReadDirOptions, ) -&gt; Result&lt;PaginatedListResult&gt;` | rust/lance-io/src/object_store/read_dir.rs:89-93 | One page of the immediate children of `dir`, one directory level deep. |

<a id="source-rust-lance-io-src-object-store-storage-options-rs"></a>

## `rust/lance-io/src/object_store/storage_options.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub const EXPIRES_AT_MILLIS_KEY: &str = "expires_at_millis";` | rust/lance-io/src/object_store/storage_options.rs:31-31 | Key for the expiration timestamp in storage options HashMap |
| `pub const REFRESH_OFFSET_MILLIS_KEY: &str = "refresh_offset_millis";` | rust/lance-io/src/object_store/storage_options.rs:34-34 | Key for the refresh offset in storage options HashMap (milliseconds before expiry to refresh) |
| `pub trait StorageOptionsProvider: Send + Sync + fmt::Debug` | rust/lance-io/src/object_store/storage_options.rs:72-72 | Trait for providing storage options with expiration tracking |
| `pub struct LanceNamespaceStorageOptionsProvider` | rust/lance-io/src/object_store/storage_options.rs:105-105 | StorageOptionsProvider implementation that fetches options from a LanceNamespace |
| `pub fn new(namespace_client: Arc&lt;dyn LanceNamespace&gt;, table_id: Vec&lt;String&gt;) -&gt; Self` | rust/lance-io/src/object_store/storage_options.rs:128-128 | Create a new LanceNamespaceStorageOptionsProvider |
| `pub const BASE_SCOPED_OPTION_PREFIX: &str = "base_";` | rust/lance-io/src/object_store/storage_options.rs:175-175 | Prefix marking a storage option as scoped to a single registered base path. |
| `pub fn parse_base_scoped_key(key: &str) -&gt; Option&lt;(u32, &str)&gt;` | rust/lance-io/src/object_store/storage_options.rs:183-183 | Parse a base-scoped storage option key of the form `base_&lt;id&gt;.&lt;key&gt;`. |
| `pub fn has_base_scoped_options(options: &HashMap&lt;String, String&gt;) -&gt; bool` | rust/lance-io/src/object_store/storage_options.rs:194-194 | Returns true if any key in `options` is base-scoped (`base_&lt;id&gt;.&lt;key&gt;`). |
| `pub fn resolve_base_scoped_options( options: &HashMap&lt;String, String&gt;, base_id: Option&lt;u32&gt;, ) -&gt; HashMap&lt;String, String&gt;` | rust/lance-io/src/object_store/storage_options.rs:206-209 | Resolve the effective storage options for one base path scope. |
| `pub struct BaseScopedStorageOptionsProvider` | rust/lance-io/src/object_store/storage_options.rs:236-236 | A [`StorageOptionsProvider`] that resolves another accessor's options for a single base path scope. |
| `pub fn new(inner: Arc&lt;StorageOptionsAccessor&gt;, base_id: Option&lt;u32&gt;) -&gt; Self` | rust/lance-io/src/object_store/storage_options.rs:242-242 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct StorageOptionsAccessor` | rust/lance-io/src/object_store/storage_options.rs:284-284 | Unified access to storage options with automatic caching and refresh |
| `pub fn with_static_options(options: HashMap&lt;String, String&gt;) -&gt; Self` | rust/lance-io/src/object_store/storage_options.rs:354-354 | Create an accessor with only static options (no refresh capability) |
| `pub fn with_provider(provider: Arc&lt;dyn StorageOptionsProvider&gt;) -&gt; Self` | rust/lance-io/src/object_store/storage_options.rs:378-378 | Create an accessor with a dynamic provider (no initial options) |
| `pub fn with_initial_and_provider( initial_options: HashMap&lt;String, String&gt;, provider: Arc&lt;dyn StorageOptionsProvider&gt;, ) -&gt; Self` | rust/lance-io/src/object_store/storage_options.rs:397-400 | Create an accessor with initial options and a dynamic provider |
| `pub async fn get_storage_options(&self) -&gt; Result&lt;super::StorageOptions&gt;` | rust/lance-io/src/object_store/storage_options.rs:427-427 | Get current valid storage options |
| `pub fn initial_storage_options(&self) -&gt; Option&lt;&HashMap&lt;String, String&gt;&gt;` | rust/lance-io/src/object_store/storage_options.rs:598-598 | Get the initial storage options without refresh |
| `pub fn accessor_id(&self) -&gt; String` | rust/lance-io/src/object_store/storage_options.rs:606-606 | Get the accessor ID for equality/hashing |
| `pub fn scoped_to_base(self: &Arc&lt;Self&gt;, base_id: Option&lt;u32&gt;) -&gt; Arc&lt;Self&gt;` | rust/lance-io/src/object_store/storage_options.rs:642-642 | Resolve this accessor for a single base path scope. |
| `pub fn has_provider(&self) -&gt; bool` | rust/lance-io/src/object_store/storage_options.rs:672-672 | Check if this accessor has a dynamic provider |
| `pub fn refresh_offset(&self) -&gt; Duration` | rust/lance-io/src/object_store/storage_options.rs:677-677 | Get the refresh offset duration |
| `pub fn provider(&self) -&gt; Option&lt;&Arc&lt;dyn StorageOptionsProvider&gt;&gt;` | rust/lance-io/src/object_store/storage_options.rs:682-682 | Get the storage options provider, if any |

<a id="source-rust-lance-io-src-object-store-throttle-rs"></a>

## `rust/lance-io/src/object_store/throttle.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn is_throttle_error(err: &object_store::Error) -&gt; bool` | rust/lance-io/src/object_store/throttle.rs:72-72 | Check whether an `object_store::Error` represents a throttle response (HTTP 429 / 503) from a cloud object store. |
| `pub struct AimdThrottleConfig` | rust/lance-io/src/object_store/throttle.rs:102-102 | Configuration for the AIMD-throttled ObjectStore wrapper. |
| `pub read: AimdConfig,` | rust/lance-io/src/object_store/throttle.rs:104-104 | AIMD configuration for read operations (get, get_opts, get_range, get_ranges, head). |
| `pub write: AimdConfig,` | rust/lance-io/src/object_store/throttle.rs:106-106 | AIMD configuration for write operations (put, put_opts, put_multipart, copy, rename, etc.). |
| `pub delete: AimdConfig,` | rust/lance-io/src/object_store/throttle.rs:108-108 | AIMD configuration for delete operations. |
| `pub list: AimdConfig,` | rust/lance-io/src/object_store/throttle.rs:110-110 | AIMD configuration for list operations. |
| `pub burst_capacity: u32,` | rust/lance-io/src/object_store/throttle.rs:112-112 | Maximum tokens that can accumulate for bursts (shared across all categories). |
| `pub max_retries: usize,` | rust/lance-io/src/object_store/throttle.rs:114-114 | Maximum number of retries for throttle errors within the AIMD layer. |
| `pub min_backoff_ms: u64,` | rust/lance-io/src/object_store/throttle.rs:116-116 | Minimum backoff in milliseconds between retry attempts. |
| `pub max_backoff_ms: u64,` | rust/lance-io/src/object_store/throttle.rs:118-118 | Maximum backoff in milliseconds between retry attempts. |
| `pub fn with_aimd(self, aimd: AimdConfig) -&gt; Self` | rust/lance-io/src/object_store/throttle.rs:139-139 | Set the AIMD configuration for all four operation categories at once. |
| `pub fn with_read_aimd(self, aimd: AimdConfig) -&gt; Self` | rust/lance-io/src/object_store/throttle.rs:150-150 | Set the AIMD configuration for read operations. |
| `pub fn with_write_aimd(self, aimd: AimdConfig) -&gt; Self` | rust/lance-io/src/object_store/throttle.rs:155-155 | Set the AIMD configuration for write operations. |
| `pub fn with_delete_aimd(self, aimd: AimdConfig) -&gt; Self` | rust/lance-io/src/object_store/throttle.rs:163-163 | Set the AIMD configuration for delete operations. |
| `pub fn with_list_aimd(self, aimd: AimdConfig) -&gt; Self` | rust/lance-io/src/object_store/throttle.rs:171-171 | Set the AIMD configuration for list operations. |
| `pub fn is_disabled(&self) -&gt; bool` | rust/lance-io/src/object_store/throttle.rs:176-176 | Returns `true` when the AIMD throttle layer should be bypassed entirely. |
| `pub fn with_burst_capacity(self, burst_capacity: u32) -&gt; Self` | rust/lance-io/src/object_store/throttle.rs:180-180 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn from_storage_options( storage_options: Option&lt;&HashMap&lt;String, String&gt;&gt;, ) -&gt; lance_core::Result&lt;Self&gt;` | rust/lance-io/src/object_store/throttle.rs:204-206 | Build an `AimdThrottleConfig` from storage options and environment variables. |
| `pub struct AimdThrottledStore` | rust/lance-io/src/object_store/throttle.rs:886-886 | An ObjectStore wrapper that rate-limits operations using per-category token buckets whose fill rates are controlled by AIMD algorithms. |
| `pub fn new( target: Arc&lt;dyn ObjectStore&gt;, config: AimdThrottleConfig, ) -&gt; lance_core::Result&lt;Self&gt;` | rust/lance-io/src/object_store/throttle.rs:918-921 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn wrap_paginated( &self, inner: Arc&lt;dyn PaginatedListStore&gt;, ) -&gt; Arc&lt;dyn PaginatedListStore&gt;` | rust/lance-io/src/object_store/throttle.rs:945-948 | Put a paginated lister on the same list budget as this store. |

<a id="source-rust-lance-io-src-object-store-tracing-rs"></a>

## `rust/lance-io/src/object_store/tracing.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct TracedMultipartUpload` | rust/lance-io/src/object_store/tracing.rs:22-22 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct TracedObjectStore` | rust/lance-io/src/object_store/tracing.rs:51-51 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait ObjectStoreTracingExt` | rust/lance-io/src/object_store/tracing.rs:147-147 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-io-src-object-writer-rs"></a>

## `rust/lance-io/src/object_writer.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct ObjectWriter` | rust/lance-io/src/object_writer.rs:88-88 | Writer to an object in an object store. |
| `pub struct WriteResult` | rust/lance-io/src/object_writer.rs:98-98 | No standalone documentation summary; use the family contract and source entry. |
| `pub size: usize,` | rust/lance-io/src/object_writer.rs:99-99 | No standalone documentation summary; use the family contract and source entry. |
| `pub e_tag: Option&lt;String&gt;,` | rust/lance-io/src/object_writer.rs:100-100 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn new(object_store: &LanceObjectStore, path: &Path) -&gt; Result&lt;Self&gt;` | rust/lance-io/src/object_writer.rs:293-293 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn abort(&mut self)` | rust/lance-io/src/object_writer.rs:425-425 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct LocalWriter` | rust/lance-io/src/object_writer.rs:636-636 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new( file: tokio::fs::File, path: Path, temp_path: tempfile::TempPath, io_tracker: Arc&lt;IOTracker&gt;, ) -&gt; Self` | rust/lance-io/src/object_writer.rs:666-671 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn get_etag(metadata: &std::fs::Metadata) -&gt; String` | rust/lance-io/src/object_writer.rs:833-833 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-io-src-scheduler-rs"></a>

## `rust/lance-io/src/scheduler.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn iops_counter() -&gt; u64` | rust/lance-io/src/scheduler.rs:40-40 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn bytes_read_counter() -&gt; u64` | rust/lance-io/src/scheduler.rs:44-44 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct ScanStats` | rust/lance-io/src/scheduler.rs:644-644 | No standalone documentation summary; use the family contract and source entry. |
| `pub iops: u64,` | rust/lance-io/src/scheduler.rs:645-645 | No standalone documentation summary; use the family contract and source entry. |
| `pub requests: u64,` | rust/lance-io/src/scheduler.rs:646-646 | No standalone documentation summary; use the family contract and source entry. |
| `pub bytes_read: u64,` | rust/lance-io/src/scheduler.rs:647-647 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct IoStats(Arc&lt;StatsCollector&gt;);` | rust/lance-io/src/scheduler.rs:749-749 | A shareable, cloneable handle to a set of cumulative I/O counters. |
| `pub fn new() -&gt; Self` | rust/lance-io/src/scheduler.rs:752-752 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn record_request(&self, request: &[Range&lt;u64&gt;])` | rust/lance-io/src/scheduler.rs:759-759 | Record a single completed request. `request` holds the byte ranges as actually submitted to storage (post coalescing/splitting), so the counts reflect physical I/O. |
| `pub fn snapshot(&self) -&gt; ScanStats` | rust/lance-io/src/scheduler.rs:764-764 | Take an immutable snapshot of the current cumulative counters. |
| `pub fn recorder(&self) -&gt; Arc&lt;dyn IoStatsRecorder&gt;` | rust/lance-io/src/scheduler.rs:771-771 | Return this handle as a type-erased [`IoStatsRecorder`], suitable for attaching to a file reader (e.g. `FileReader::with_io_stats`). The returned recorder shares the same underlying counters as `self`. |
| `pub fn add_scan_stats(&self, stats: &ScanStats)` | rust/lance-io/src/scheduler.rs:778-778 | Add a snapshot of already-aggregated statistics into this sink. Used to fold in I/O measured on a separate scheduler (e.g. the one-time reads performed while opening an index). |
| `pub struct ScanScheduler` | rust/lance-io/src/scheduler.rs:802-802 | An I/O scheduler which wraps an ObjectStore and throttles the amount of parallel I/O that can be run. |
| `pub struct SchedulerConfig` | rust/lance-io/src/scheduler.rs:837-837 | No standalone documentation summary; use the family contract and source entry. |
| `pub io_buffer_size_bytes: u64,` | rust/lance-io/src/scheduler.rs:841-841 | the # of bytes that can be buffered but not yet requested. This controls back pressure. If data is not processed quickly enough then this buffer will fill up and the I/O loop will pause until the buffer is drained. |
| `pub use_lite_scheduler: Option&lt;bool&gt;,` | rust/lance-io/src/scheduler.rs:847-847 | Whether to use the lite scheduler. |
| `pub fn new(io_buffer_size_bytes: u64) -&gt; Self` | rust/lance-io/src/scheduler.rs:851-851 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn default_for_testing() -&gt; Self` | rust/lance-io/src/scheduler.rs:861-861 | Big enough for unit testing |
| `pub fn max_bandwidth(store: &ObjectStore) -&gt; Self` | rust/lance-io/src/scheduler.rs:870-870 | Configuration that should generally maximize bandwidth (not trying to save RAM at all). We assume a max page size of 32MiB and then allow 32MiB per I/O thread |
| `pub fn with_lite_scheduler(self) -&gt; Self` | rust/lance-io/src/scheduler.rs:874-874 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(object_store: Arc&lt;ObjectStore&gt;, config: SchedulerConfig) -&gt; Arc&lt;Self&gt;` | rust/lance-io/src/scheduler.rs:889-889 | Create a new scheduler with the given I/O capacity |
| `pub async fn open_file_with_priority( self: &Arc&lt;Self&gt;, path: &Path, base_priority: u64, file_size_bytes: &CachedFileSize, ) -&gt; Result&lt;FileScheduler&gt;` | rust/lance-io/src/scheduler.rs:930-935 | Open a file for reading |
| `pub async fn open_file( self: &Arc&lt;Self&gt;, path: &Path, file_size_bytes: &CachedFileSize, ) -&gt; Result&lt;FileScheduler&gt;` | rust/lance-io/src/scheduler.rs:965-969 | Open a file with a default priority of 0 |
| `pub fn open_reader(self: &Arc&lt;Self&gt;, reader: Arc&lt;dyn Reader&gt;) -&gt; FileScheduler` | rust/lance-io/src/scheduler.rs:983-983 | Open a [`FileScheduler`] over an already-open [`Reader`]. |
| `pub fn submit_request( &self, reader: Arc&lt;dyn Reader&gt;, request: Vec&lt;Range&lt;u64&gt;&gt;, priority: u128, bypass_backpressure: bool, ) -&gt; impl Future&lt;Output = Result&lt;Vec&lt;Bytes&gt;&gt;&gt; + Send + use&lt;&gt;` | rust/lance-io/src/scheduler.rs:1104-1110 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn stats(&self) -&gt; ScanStats` | rust/lance-io/src/scheduler.rs:1127-1127 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct FileScheduler` | rust/lance-io/src/scheduler.rs:1159-1159 | A throttled file reader |
| `pub fn submit_request( &self, request: Vec&lt;Range&lt;u64&gt;&gt;, priority: u64, ) -&gt; impl Future&lt;Output = Result&lt;Vec&lt;Bytes&gt;&gt;&gt; + Send + use&lt;&gt;` | rust/lance-io/src/scheduler.rs:1196-1200 | Submit a batch of I/O requests to the reader |
| `pub fn with_priority(&self, priority: u64) -&gt; Self` | rust/lance-io/src/scheduler.rs:1315-1315 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_io_stats(&self, stats: Arc&lt;dyn IoStatsRecorder&gt;) -&gt; Self` | rust/lance-io/src/scheduler.rs:1336-1336 | Returns a copy of this scheduler that additionally records the I/O it performs into `stats`, on top of the scheduler's global statistics. |
| `pub fn with_bypass_backpressure(&self) -&gt; Self` | rust/lance-io/src/scheduler.rs:1347-1347 | Returns a copy of this scheduler that bypasses backpressure for all requests. |
| `pub fn submit_single( &self, range: Range&lt;u64&gt;, priority: u64, ) -&gt; impl Future&lt;Output = Result&lt;Bytes&gt;&gt; + Send` | rust/lance-io/src/scheduler.rs:1360-1364 | Submit a single IOP to the reader |
| `pub fn reader(&self) -&gt; &Arc&lt;dyn Reader&gt;` | rust/lance-io/src/scheduler.rs:1374-1374 | Provides access to the underlying reader |

<a id="source-rust-lance-io-src-scheduler-lite-rs"></a>

## `rust/lance-io/src/scheduler/lite.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn new(max_concurrency: u64, max_bytes: u64, stats: IoStats) -&gt; Self` | rust/lance-io/src/scheduler/lite.rs:534-534 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-io-src-spill-rs"></a>

## `rust/lance-io/src/spill.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub trait SpillStore: Send + Sync + 'static` | rust/lance-io/src/spill.rs:62-62 | A factory for scratch storage. |
| `pub trait Spill: Send + Sync` | rust/lance-io/src/spill.rs:77-77 | The readable half of a spill, and the owner of its backing storage. |
| `pub struct LocalSpillStore` | rust/lance-io/src/spill.rs:202-202 | A [`SpillStore`] that writes temporary files to a local temp directory. |
| `pub fn new() -&gt; Result&lt;Self&gt;` | rust/lance-io/src/spill.rs:236-236 | Create a store with no disk cap. |
| `pub fn with_cap(cap_bytes: u64) -&gt; Result&lt;Self&gt;` | rust/lance-io/src/spill.rs:242-242 | Create a store that returns [`lance_core::Error::DiskCapExceeded`] once total bytes written across all live handles would exceed `cap_bytes`. |

<a id="source-rust-lance-io-src-stream-rs"></a>

## `rust/lance-io/src/stream.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub type BatchStream = BoxStream&lt;'static, Result&lt;RecordBatch&gt;&gt;;` | rust/lance-io/src/stream.rs:15-15 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn arrow_stream_to_lance_stream( arrow_stream: BoxStream&lt;'static, std::result::Result&lt;RecordBatch, ArrowError&gt;&gt;, ) -&gt; BatchStream` | rust/lance-io/src/stream.rs:17-19 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait RecordBatchStream: Stream&lt;Item = Result&lt;RecordBatch&gt;&gt; + Send` | rust/lance-io/src/stream.rs:24-24 | RecordBatch Stream trait. |
| `pub struct RecordBatchStreamAdapter&lt;S&gt;` | rust/lance-io/src/stream.rs:32-32 | Combines a [`Stream`] with a [`SchemaRef`] implementing [`RecordBatchStream`] for the combination |
| `pub fn new(schema: SchemaRef, stream: S) -&gt; Self` | rust/lance-io/src/stream.rs:41-41 | Creates a new [`RecordBatchStreamAdapter`] from the provided schema and stream |

<a id="source-rust-lance-io-src-traits-rs"></a>

## `rust/lance-io/src/traits.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub trait ProtoStruct` | rust/lance-io/src/traits.rs:18-18 | No standalone documentation summary; use the family contract and source entry. |
| `pub type ByteStream = BoxStream&lt;'static, object_store::Result&lt;Bytes&gt;&gt;;` | rust/lance-io/src/traits.rs:22-22 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait Writer: AsyncWrite + Unpin + Send` | rust/lance-io/src/traits.rs:26-26 | A trait for writing to a file on local file system or object store. |
| `pub trait WriteExt` | rust/lance-io/src/traits.rs:48-48 | Lance Write Extension. |
| `pub trait Reader: std::fmt::Debug + Send + Sync + DeepSizeOf` | rust/lance-io/src/traits.rs:136-136 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-io-src-uring-rs"></a>

## `rust/lance-io/src/uring.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub use reader::UringReader;` | rust/lance-io/src/uring.rs:68-68 | No standalone documentation summary; use the family contract and source entry. |
| `pub const DEFAULT_URING_BLOCK_SIZE: usize = 4 * 1024;` | rust/lance-io/src/uring.rs:71-71 | Default block size for io_uring reads (4KB) |
| `pub const DEFAULT_URING_IO_PARALLELISM: usize = 128;` | rust/lance-io/src/uring.rs:74-74 | Default I/O parallelism for io_uring (128 concurrent operations) |
| `pub const DEFAULT_URING_QUEUE_DEPTH: usize = 16 * 1024;` | rust/lance-io/src/uring.rs:77-77 | Default io_uring queue depth (16K entries) |

<a id="source-rust-lance-io-src-uring-current-thread-rs"></a>

## `rust/lance-io/src/uring/current_thread.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct UringCurrentThreadReader` | rust/lance-io/src/uring/current_thread.rs:246-246 | Thread-local io_uring-based reader for current-thread runtimes |

<a id="source-rust-lance-io-src-uring-current-thread-future-rs"></a>

## `rust/lance-io/src/uring/current_thread_future.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct UringCurrentThreadFuture` | rust/lance-io/src/uring/current_thread_future.rs:18-18 | Future that awaits completion of a thread-local io_uring read operation |

<a id="source-rust-lance-io-src-uring-reader-rs"></a>

## `rust/lance-io/src/uring/reader.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct UringReader` | rust/lance-io/src/uring/reader.rs:97-97 | io_uring-based reader for local files. |

<a id="source-rust-lance-io-src-uring-requests-rs"></a>

## `rust/lance-io/src/uring/requests.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub completed: bool,` | rust/lance-io/src/uring/requests.rs:14-14 | No standalone documentation summary; use the family contract and source entry. |
| `pub waker: Option&lt;Waker&gt;,` | rust/lance-io/src/uring/requests.rs:15-15 | No standalone documentation summary; use the family contract and source entry. |
| `pub err: Option&lt;io::Error&gt;,` | rust/lance-io/src/uring/requests.rs:16-16 | No standalone documentation summary; use the family contract and source entry. |
| `pub buffer: BytesMut,` | rust/lance-io/src/uring/requests.rs:17-17 | No standalone documentation summary; use the family contract and source entry. |
| `pub bytes_read: usize,` | rust/lance-io/src/uring/requests.rs:19-19 | Accumulated bytes read across retries (for handling short reads). |
| `pub fd: RawFd,` | rust/lance-io/src/uring/requests.rs:26-26 | File descriptor to read from. |
| `pub offset: u64,` | rust/lance-io/src/uring/requests.rs:29-29 | Byte offset to start reading from. |
| `pub length: usize,` | rust/lance-io/src/uring/requests.rs:32-32 | Number of bytes to read. |
| `pub thread_id: ThreadId,` | rust/lance-io/src/uring/requests.rs:34-34 | No standalone documentation summary; use the family contract and source entry. |
| `pub state: Mutex&lt;RequestState&gt;,` | rust/lance-io/src/uring/requests.rs:37-37 | Completion flag - set to true when operation completes. |

<a id="source-rust-lance-io-src-uring-thread-rs"></a>

## `rust/lance-io/src/uring/thread.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub request_tx: SyncSender&lt;QueuedRequest&gt;,` | rust/lance-io/src/uring/thread.rs:24-24 | No standalone documentation summary; use the family contract and source entry. |
| `pub is_alive: Arc&lt;AtomicBool&gt;,` | rust/lance-io/src/uring/thread.rs:25-25 | No standalone documentation summary; use the family contract and source entry. |
| `pub threads: Vec&lt;UringThreadHandle&gt;,` | rust/lance-io/src/uring/thread.rs:69-69 | No standalone documentation summary; use the family contract and source entry. |
| `pub initialization_errors: Vec&lt;String&gt;,` | rust/lance-io/src/uring/thread.rs:70-70 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-io-src-utils-rs"></a>

## `rust/lance-io/src/utils.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod tracking_store;` | rust/lance-io/src/utils.rs:16-16 | No standalone documentation summary; use the family contract and source entry. |
| `pub const METADATA_READ_CHUNK_SIZE: usize = 16 * 1024 * 1024;` | rust/lance-io/src/utils.rs:27-27 | Chunk size for splitting a large metadata read into concurrent range requests. |
| `pub fn read_range_in_chunks( reader: &dyn Reader, range: Range&lt;usize&gt;, chunk_size: usize, ) -&gt; impl Stream&lt;Item = object_store::Result&lt;Bytes&gt;&gt; + '_` | rust/lance-io/src/utils.rs:34-38 | Read `range` from `reader` as `chunk_size`-sized concurrent range requests, yielding the chunks in file order. Concurrency is bounded by [`Reader::io_parallelism`], clamped to at least 1: a `buffered(0)` window never polls its input, so an unvalidated reader value (e.g. `LANCE_URING_IO_PARALLELISM=0`) would hang the read. |
| `pub struct ChunkedBuf` | rust/lance-io/src/utils.rs:57-57 | A [`Buf`] over a sequence of [`Bytes`] chunks in file order. |
| `pub fn push(&mut self, chunk: Bytes)` | rust/lance-io/src/utils.rs:65-65 | Append `chunk` after the chunks pushed so far. Empty chunks are dropped so `chunk()` never reports an empty slice while data remains. |
| `pub fn truncate(&mut self, len: usize)` | rust/lance-io/src/utils.rs:77-77 | Keep only the first `len` bytes. |
| `pub async fn read_message&lt;M: Message + Default&gt;(reader: &dyn Reader, pos: usize) -&gt; Result&lt;M&gt;` | rust/lance-io/src/utils.rs:165-165 | Read a protobuf message at file position 'pos'. |
| `pub async fn read_struct&lt; M: Message + Default + 'static, T: ProtoStruct&lt;Proto = M&gt; + TryFrom&lt;M, Error = Error&gt;, &gt;( reader: &dyn Reader, pos: usize, ) -&gt; Result&lt;T&gt;` | rust/lance-io/src/utils.rs:203-209 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn read_last_block(reader: &dyn Reader) -&gt; object_store::Result&lt;Bytes&gt;` | rust/lance-io/src/utils.rs:214-214 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn read_metadata_offset(bytes: &Bytes) -&gt; Result&lt;usize&gt;` | rust/lance-io/src/utils.rs:221-221 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn read_version(bytes: &Bytes) -&gt; Result&lt;(u16, u16)&gt;` | rust/lance-io/src/utils.rs:234-234 | Read the version from the footer bytes |
| `pub fn read_message_from_buf&lt;M: Message + Default&gt;(buf: &Bytes) -&gt; Result&lt;M&gt;` | rust/lance-io/src/utils.rs:249-249 | Read protobuf from a buffer. |
| `pub fn read_struct_from_buf&lt; M: Message + Default, T: ProtoStruct&lt;Proto = M&gt; + TryFrom&lt;M, Error = Error&gt;, &gt;( buf: &Bytes, ) -&gt; Result&lt;T&gt;` | rust/lance-io/src/utils.rs:255-260 | Read a Protobuf-backed struct from a buffer. |
| `pub struct CachedFileSize(AtomicU64);` | rust/lance-io/src/utils.rs:272-272 | A cached file size. |
| `pub fn new(size: u64) -&gt; Self` | rust/lance-io/src/utils.rs:335-335 | Create a `CachedFileSize` from a raw byte count. |
| `pub fn unknown() -&gt; Self` | rust/lance-io/src/utils.rs:339-339 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn get(&self) -&gt; Option&lt;NonZero&lt;u64&gt;&gt;` | rust/lance-io/src/utils.rs:343-343 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn set(&self, size: NonZero&lt;u64&gt;)` | rust/lance-io/src/utils.rs:347-347 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-io-src-utils-tracking-store-rs"></a>

## `rust/lance-io/src/utils/tracking_store.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct IOTracker` | rust/lance-io/src/utils/tracking_store.rs:36-36 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn incremental_stats(&self) -&gt; IoStats` | rust/lance-io/src/utils/tracking_store.rs:51-51 | Get IO statistics and reset the counters (incremental pattern). |
| `pub fn stats(&self) -&gt; IoStats` | rust/lance-io/src/utils/tracking_store.rs:59-59 | Get a snapshot of current IO statistics without resetting counters. |
| `pub fn record_read( &self, #[allow(unused_variables)] method: &'static str, #[allow(unused_variables)] path: Path, num_bytes: u64, #[allow(unused_variables)] range: Option&lt;Range&lt;u64&gt;&gt;, )` | rust/lance-io/src/utils/tracking_store.rs:67-73 | Record a read operation for tracking. |
| `pub fn record_write( &self, #[allow(unused_variables)] method: &'static str, #[allow(unused_variables)] path: Path, num_bytes: u64, )` | rust/lance-io/src/utils/tracking_store.rs:89-94 | Record a write operation for tracking. |
| `pub fn begin_io(&self, operation: &'static str) -&gt; IoMetricsGuard` | rust/lance-io/src/utils/tracking_store.rs:125-125 | Begin an operation that talks to storage without going through the `object_store` layer, and so is invisible to the `MeteredObjectStore` wrapper: the optimized local reads and writes go straight to the filesystem. `operation` must be one of the labels that wrapper uses (`get`, `put`, `head`, ...) so this IO aggregates with the rest. |
| `pub fn begin_io(&self, _operation: &'static str) -&gt; IoMetricsGuard` | rust/lance-io/src/utils/tracking_store.rs:138-138 | Without the `metrics` feature there is nothing to publish. |
| `pub struct IoMetricsGuard` | rust/lance-io/src/utils/tracking_store.rs:150-150 | Publishes the object store metrics for a single operation that bypassed the `object_store` layer (see [`IOTracker::begin_io`]). |
| `pub fn record&lt;T, E&gt;(self, result: &std::result::Result&lt;T, E&gt;, num_bytes: u64)` | rust/lance-io/src/utils/tracking_store.rs:167-167 | Record the operation's count and latency, along with `num_bytes` transferred if `result` is `Ok` or an error if it is not. |
| `pub struct IoStats` | rust/lance-io/src/utils/tracking_store.rs:200-200 | No standalone documentation summary; use the family contract and source entry. |
| `pub read_iops: u64,` | rust/lance-io/src/utils/tracking_store.rs:201-201 | No standalone documentation summary; use the family contract and source entry. |
| `pub read_bytes: u64,` | rust/lance-io/src/utils/tracking_store.rs:202-202 | No standalone documentation summary; use the family contract and source entry. |
| `pub write_iops: u64,` | rust/lance-io/src/utils/tracking_store.rs:203-203 | No standalone documentation summary; use the family contract and source entry. |
| `pub written_bytes: u64,` | rust/lance-io/src/utils/tracking_store.rs:204-204 | No standalone documentation summary; use the family contract and source entry. |
| `pub num_stages: u64,` | rust/lance-io/src/utils/tracking_store.rs:208-208 | Number of disjoint periods where at least one IO is in-flight. |
| `pub requests: Vec&lt;IoRequestRecord&gt;,` | rust/lance-io/src/utils/tracking_store.rs:210-210 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct IoRequestRecord` | rust/lance-io/src/utils/tracking_store.rs:298-298 | No standalone documentation summary; use the family contract and source entry. |
| `pub method: &'static str,` | rust/lance-io/src/utils/tracking_store.rs:299-299 | No standalone documentation summary; use the family contract and source entry. |
| `pub path: Path,` | rust/lance-io/src/utils/tracking_store.rs:300-300 | No standalone documentation summary; use the family contract and source entry. |
| `pub range: Option&lt;Range&lt;u64&gt;&gt;,` | rust/lance-io/src/utils/tracking_store.rs:301-301 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct IoTrackingStore` | rust/lance-io/src/utils/tracking_store.rs:328-328 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(target: Arc&lt;dyn ObjectStore&gt;, stats: Arc&lt;Mutex&lt;IoStats&gt;&gt;) -&gt; Self` | rust/lance-io/src/utils/tracking_store.rs:342-342 | No standalone documentation summary; use the family contract and source entry. |

