# python: public declaration and documented-contract directory

> Refresh 2026-10-12, `011953c22097b67b699595adbe99e7f0155d83e4`: source coordinates updated. [Changed contracts](../refresh-2026-10-12.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**Trust: declared source interface; body behavior is verified only where the linked family/protocol contract says so.** This catalog supplies exact argument/type entry points and the source author's first documentation paragraph. It is not an inferred call graph or a second symbol ledger. Rust `pub` can occur under a private/feature-gated module; confirm re-export and cfg boundaries before changing an external API. Trait method contracts and enum variants are reached through the trait/type entry. Python inherited external-library APIs are outside direct-source scope.

[Family contracts](../public-api.md) · [Module Map](../../L1-modules/python.md) · [Scope](../../V21-PROTOCOL.md)

## Explicit root exports

`Blob`, `BlobArray`, `BlobColumn`, `BlobFile`, `DedicatedBlobWriter`, `BlobDescriptorArrayBuilder`, `PackedBlobWriter`, `BlobDescriptor`, `blob_array`, `blob_field`, `CleanupCandidateFile`, `CleanupExplanation`, `CleanupReferencedBranch`, `CleanupStats`, `DatasetBasePath`, `DataStatistics`, `FieldStatistics`, `FragmentMetadata`, `FtsToken`, `Index`, `IndexFile`, `LanceDataset`, `LanceFragment`, `LanceOperation`, `LanceScanner`, `MergeInsertBuilder`, `ScanStatistics`, `Transaction`, `__version__`, `batch_udf`, `bytes_read_counter`, `dataset`, `io`, `iops_counter`, `json_to_schema`, `schema_to_json`, `set_logger`, `simd_info`, `tokenize`, `write_dataset`, `FFILanceTableProvider`, `IndexProgress`, `ExecutionPlan`, `LsmPointLookupPlanner`, `LsmScanner`, `LsmVectorSearchPlanner`, `CompactedSsTable`, `ShardSnapshot`, `ShardWriter`, `ShardingField`, `ShardingSpec`, `evaluate_sharding_spec`.

python/python/lance/__init__.py:81-134. Imported root attributes not in __all__ can also be reachable; this is the explicit export list, not Python runtime introspection.

<a id="source-python-python-lance-init-py"></a>

## `python/python/lance/__init__.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `dataset(uri: Optional[Union[str, Path]]=None, version: Optional[int \| str]=None, asof: Optional[ts_types]=None, block_size: Optional[int]=None, commit_lock: Optional[CommitLock]=None, index_cache_size: Optional[int]=None, storage_options: Optional[Dict[str, str]]=None, default_scan_options: Optional[Dict[str, str]]=None, metadata_cache_size_bytes: Optional[int]=None, index_cache_size_bytes: Optional[int]=None, read_params: Optional[Dict[str, Any]]=None, session: Optional[Session]=None, namespace_client: Optional[LanceNamespace]=None, table_id: Optional[List[str]]=None, base_store_params: Optional[Dict[str, Dict[str, str]]]=None) -&gt; LanceDataset` | python/python/lance/__init__.py:137-344 | Opens the Lance dataset from the address specified. |
| `set_logger(file_path='pylance.log', name='pylance', level=logging.INFO, format_string=None, log_handler=None)` | python/python/lance/__init__.py:347-354 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-python-python-lance-arrow-bf16-py"></a>

## `python/python/lance/_arrow/bf16.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class BFloat16Array(pa.ExtensionArray)` | python/python/lance/_arrow/bf16.py:16-80 | Bfloat16 PyArrow Array. |
| `BFloat16Array.to_numpy(self, zero_copy_only=False)` | python/python/lance/_arrow/bf16.py:36-50 | Convert to a NumPy array. |
| `BFloat16Array.from_numpy(cls, array: np.ndarray)` | python/python/lance/_arrow/bf16.py:53-80 | Create a :class:`BFloat16Array` from a NumPy array. |
| `class BFloat16Scalar(pa.ExtensionScalar)` | python/python/lance/_arrow/bf16.py:83-100 | No standalone documentation summary; use the family contract and source entry. |
| `BFloat16Scalar.as_py(self, **kwargs) -&gt; Optional[BFloat16]` | python/python/lance/_arrow/bf16.py:84-88 | No standalone documentation summary; use the family contract and source entry. |
| `class BFloat16Type(pa.ExtensionType)` | python/python/lance/_arrow/bf16.py:103-123 | No standalone documentation summary; use the family contract and source entry. |
| `BFloat16Type.__init__(self)` | python/python/lance/_arrow/bf16.py:104-105 | No standalone documentation summary; use the family contract and source entry. |
| `BFloat16Type.to_pandas_dtype(self)` | python/python/lance/_arrow/bf16.py:122-123 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-python-python-lance-dataset-cache-py"></a>

## `python/python/lance/_dataset/cache.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class CachedDataset()` | python/python/lance/_dataset/cache.py:12-75 | No standalone documentation summary; use the family contract and source entry. |
| `CachedDataset.__init__(self, stream: Iterable[pa.RecordBatch], cache: Optional[Union[str, Path, bool]]=None)` | python/python/lance/_dataset/cache.py:13-34 | No standalone documentation summary; use the family contract and source entry. |
| `CachedDataset.close(self)` | python/python/lance/_dataset/cache.py:36-40 | Close the dataset and delete tmp files |

<a id="source-python-python-lance-dataset-sharded-batch-iterator-py"></a>

## `python/python/lance/_dataset/sharded_batch_iterator.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class ShardedBatchIterator()` | python/python/lance/_dataset/sharded_batch_iterator.py:21-152 | An iterator of RecordBatches, over the sharded dataset. |
| `ShardedBatchIterator.__init__(self, data: Union[str, Path, LanceDataset], rank: int, world_size: int, *, columns: Optional[Union[List[str], Dict[str, str]]]=None, batch_size: int=1024 * 10, granularity: Literal['fragment', 'batch']='fragment', batch_readahead: int=8, with_row_id: bool=False)` | python/python/lance/_dataset/sharded_batch_iterator.py:57-82 | No standalone documentation summary; use the family contract and source entry. |
| `ShardedBatchIterator.from_torch(data: Union[str, Path, LanceDataset], *, columns: Optional[Union[List[str], Dict[str, str]]]=None, batch_size: int=1024 * 10, granularity: Literal['fragment', 'batch']='fragment', batch_readahead: int=8, with_row_id: bool=False) -&gt; ShardedBatchIterator` | python/python/lance/_dataset/sharded_batch_iterator.py:85-111 | Use from a PyTorch distributed environment. |

<a id="source-python-python-lance-arrow-py"></a>

## `python/python/lance/arrow.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class ImageURIType(pa.ExtensionType)` | python/python/lance/arrow.py:49-75 | No standalone documentation summary; use the family contract and source entry. |
| `ImageURIType.__init__(self, storage_type: pa.DataType=pa.string())` | python/python/lance/arrow.py:50-54 | No standalone documentation summary; use the family contract and source entry. |
| `class EncodedImageType(pa.ExtensionType)` | python/python/lance/arrow.py:78-104 | No standalone documentation summary; use the family contract and source entry. |
| `EncodedImageType.__init__(self, storage_type: pa.DataType=pa.binary())` | python/python/lance/arrow.py:79-83 | No standalone documentation summary; use the family contract and source entry. |
| `class FixedShapeImageTensorType(pa.ExtensionType)` | python/python/lance/arrow.py:107-144 | No standalone documentation summary; use the family contract and source entry. |
| `FixedShapeImageTensorType.__init__(self, arrow_type: pa.DataType, shape)` | python/python/lance/arrow.py:108-121 | No standalone documentation summary; use the family contract and source entry. |
| `class ImageArray(pa.ExtensionArray)` | python/python/lance/arrow.py:152-194 | No standalone documentation summary; use the family contract and source entry. |
| `ImageArray.from_array(cls, images)` | python/python/lance/arrow.py:161-194 | Create an one of subclasses of ImageArray from input data. |
| `class ImageURIArray(ImageArray)` | python/python/lance/arrow.py:197-294 | Array of image URIs. URIs may represent local files or remote files on the web, S3 or GCS if they are accessible by the machine executing this. |
| `ImageURIArray.from_uris(cls, uris: Union[pa.StringArray, pa.LargeStringArray, Iterable[Union[str, Path]]])` | python/python/lance/arrow.py:204-235 | Create an ImageURIArray from an array or iterable of URIs (such as a list). |
| `ImageURIArray.read_uris(self, storage_type=pa.binary()) -&gt; 'EncodedImageArray'` | python/python/lance/arrow.py:237-294 | Read the images from the URIs into memory and return an EncodedImageArray |
| `class EncodedImageArray(ImageArray)` | python/python/lance/arrow.py:297-406 | Array of encoded images. Images may be encoded in any format. Format is not stored by the array but can typically be inferred from the image bytes. Alternatively a separate record of encoding can be kept in a separate array outside this library. |
| `EncodedImageArray.to_tensor(self, decoder: Optional[Callable[[Union[pa.BinaryArray, pa.LargeBinaryArray]], np.ndarray]]=None)` | python/python/lance/arrow.py:331-406 | Decode encoded images and return a FixedShapeImageTensorArray |
| `class FixedShapeImageTensorArray(ImageArray)` | python/python/lance/arrow.py:410-497 | Array of fixed shape tensors representing image pixels. |
| `FixedShapeImageTensorArray.to_numpy(self)` | python/python/lance/arrow.py:415-435 | Convert FixedShapeImageTensorArray to a numpy.ndarray. |
| `FixedShapeImageTensorArray.to_encoded(self, encoder=None, storage_type=pa.binary()) -&gt; 'EncodedImageArray'` | python/python/lance/arrow.py:437-497 | Encode FixedShapeImageTensorArray to PNG bytes and return an EncodedImageArray. |
| `class ImageScalar(pa.ExtensionScalar)` | python/python/lance/arrow.py:500-502 | No standalone documentation summary; use the family contract and source entry. |
| `ImageScalar.as_py(self, **kwargs)` | python/python/lance/arrow.py:501-502 | No standalone documentation summary; use the family contract and source entry. |
| `class ImageURIScalar(ImageScalar)` | python/python/lance/arrow.py:505-506 | No standalone documentation summary; use the family contract and source entry. |
| `class EncodedImageScalar(ImageScalar)` | python/python/lance/arrow.py:509-510 | No standalone documentation summary; use the family contract and source entry. |
| `class FixedShapeImageTensorScalar(ImageScalar)` | python/python/lance/arrow.py:513-514 | No standalone documentation summary; use the family contract and source entry. |
| `cast(arr: pa.Array, target_type: Union[pa.DataType, str], *args, **kwargs) -&gt; pa.Array` | python/python/lance/arrow.py:519-583 | Cast an array to another data type. |

<a id="source-python-python-lance-blob-py"></a>

## `python/python/lance/blob.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class Blob()` | python/python/lance/blob.py:40-93 | A logical blob value for writing Lance blob columns. |
| `Blob.from_bytes(data: Union[bytes, bytearray, memoryview]) -&gt; 'Blob'` | python/python/lance/blob.py:78-79 | No standalone documentation summary; use the family contract and source entry. |
| `Blob.from_uri(uri: str, position: Optional[int]=None, size: Optional[int]=None) -&gt; 'Blob'` | python/python/lance/blob.py:82-89 | No standalone documentation summary; use the family contract and source entry. |
| `Blob.empty() -&gt; 'Blob'` | python/python/lance/blob.py:92-93 | No standalone documentation summary; use the family contract and source entry. |
| `class BlobType(pa.ExtensionType)` | python/python/lance/blob.py:96-175 | A PyArrow extension type for Lance blob columns. |
| `BlobType.__init__(self) -&gt; None` | python/python/lance/blob.py:110-119 | No standalone documentation summary; use the family contract and source entry. |
| `class BlobArray(pa.ExtensionArray)` | python/python/lance/blob.py:185-250 | A PyArrow extension array for Lance blob columns. |
| `BlobArray.from_pylist(cls, values: list[Any]) -&gt; 'BlobArray'` | python/python/lance/blob.py:193-250 | No standalone documentation summary; use the family contract and source entry. |
| `blob_array(values: list[Any]) -&gt; BlobArray` | python/python/lance/blob.py:253-264 | Construct a blob array from Python values. |
| `blob_field(name: str, *, nullable: bool=True, inline_size_threshold: Optional[int]=None, dedicated_size_threshold: Optional[int]=None, pack_file_size_threshold: Optional[int]=None) -&gt; pa.Field` | python/python/lance/blob.py:281-345 | Construct an Arrow field for a Lance blob column. |
| `class BlobIterator()` | python/python/lance/blob.py:348-356 | No standalone documentation summary; use the family contract and source entry. |
| `BlobIterator.__init__(self, binary_iter: Iterator[pa.BinaryScalar])` | python/python/lance/blob.py:349-350 | No standalone documentation summary; use the family contract and source entry. |
| `class BlobColumn()` | python/python/lance/blob.py:359-387 | A utility to wrap a Pyarrow binary column and iterate over the rows as file-like objects. |
| `BlobColumn.__init__(self, blob_column: Union[pa.Array, pa.ChunkedArray])` | python/python/lance/blob.py:372-384 | No standalone documentation summary; use the family contract and source entry. |
| `class BlobFile(io.BufferedIOBase)` | python/python/lance/blob.py:390-516 | Represents a blob in a Lance dataset as a file-like object. |
| `BlobFile.__init__(self, inner: LanceBlobFile, buffer_size: int=DEFAULT_BLOB_BUFFER_SIZE)` | python/python/lance/blob.py:399-407 | No standalone documentation summary; use the family contract and source entry. |
| `BlobFile.close(self) -&gt; None` | python/python/lance/blob.py:409-410 | No standalone documentation summary; use the family contract and source entry. |
| `BlobFile.closed(self) -&gt; bool` | python/python/lance/blob.py:413-414 | No standalone documentation summary; use the family contract and source entry. |
| `BlobFile.readable(self) -&gt; bool` | python/python/lance/blob.py:416-417 | No standalone documentation summary; use the family contract and source entry. |
| `BlobFile.seek(self, offset: int, whence: int=io.SEEK_SET) -&gt; int` | python/python/lance/blob.py:419-420 | No standalone documentation summary; use the family contract and source entry. |
| `BlobFile.seekable(self) -&gt; bool` | python/python/lance/blob.py:422-423 | No standalone documentation summary; use the family contract and source entry. |
| `BlobFile.tell(self) -&gt; int` | python/python/lance/blob.py:425-426 | No standalone documentation summary; use the family contract and source entry. |
| `BlobFile.size(self) -&gt; int` | python/python/lance/blob.py:428-432 | Returns the size of the blob in bytes. |
| `BlobFile.read(self, size: int=-1) -&gt; bytes` | python/python/lance/blob.py:434-445 | No standalone documentation summary; use the family contract and source entry. |
| `BlobFile.read1(self, size: int=-1) -&gt; bytes` | python/python/lance/blob.py:447-452 | No standalone documentation summary; use the family contract and source entry. |
| `BlobFile.readall(self) -&gt; bytes` | python/python/lance/blob.py:454-457 | No standalone documentation summary; use the family contract and source entry. |
| `BlobFile.readinto(self, b) -&gt; int` | python/python/lance/blob.py:459-478 | No standalone documentation summary; use the family contract and source entry. |
| `BlobFile.read_range(self, offset: int, length: int) -&gt; bytes` | python/python/lance/blob.py:480-482 | Read a blob-local byte range without changing the current cursor. |
| `BlobFile.read_ranges(self, ranges: list[tuple[int, int]]) -&gt; list[bytes]` | python/python/lance/blob.py:484-504 | Read multiple blob-local byte ranges without changing the current cursor. |

<a id="source-python-python-lance-commit-py"></a>

## `python/python/lance/commit.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class CommitConflictError(OSError)` | python/python/lance/commit.py:10-21 | A commit conflicted with a concurrent transaction. |
| `CommitConflictError.__init__(self, message: str='', retryable: bool=True)` | python/python/lance/commit.py:19-21 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-python-python-lance-dataset-py"></a>

## `python/python/lance/dataset.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class MergeInsertBuilder(_MergeInsertBuilder)` | python/python/lance/dataset.py:378-856 | No standalone documentation summary; use the family contract and source entry. |
| `MergeInsertBuilder.execute(self, data_obj: ReaderLike, *, schema: Optional[pa.Schema]=None)` | python/python/lance/dataset.py:379-405 | Executes the merge insert operation |
| `MergeInsertBuilder.execute_uncommitted(self, data_obj: ReaderLike, *, schema: Optional[pa.Schema]=None) -&gt; Tuple[Transaction, Dict[str, Any]]` | python/python/lance/dataset.py:407-432 | Executes the merge insert operation without committing |
| `MergeInsertBuilder.when_matched_update_all(self, condition: Optional[str]=None) -&gt; 'MergeInsertBuilder'` | python/python/lance/dataset.py:436-457 | Configure the operation to update matched rows |
| `MergeInsertBuilder.when_matched_delete(self) -&gt; 'MergeInsertBuilder'` | python/python/lance/dataset.py:459-467 | Configure the operation to delete matched rows in the target table. |
| `MergeInsertBuilder.when_matched_fail(self) -&gt; 'MergeInsertBuilder'` | python/python/lance/dataset.py:469-478 | Configure the operation to fail if any rows match |
| `MergeInsertBuilder.when_not_matched_insert_all(self) -&gt; 'MergeInsertBuilder'` | python/python/lance/dataset.py:480-488 | Configure the operation to insert not matched rows |
| `MergeInsertBuilder.when_not_matched_by_source_delete(self, expr: Optional[str]=None) -&gt; 'MergeInsertBuilder'` | python/python/lance/dataset.py:490-502 | Configure the operation to delete source rows that do not match |
| `MergeInsertBuilder.conflict_retries(self, max_retries: int) -&gt; 'MergeInsertBuilder'` | python/python/lance/dataset.py:504-514 | Set number of times to retry the operation if there is contention. |
| `MergeInsertBuilder.retry_timeout(self, timeout: timedelta) -&gt; 'MergeInsertBuilder'` | python/python/lance/dataset.py:516-528 | Set the timeout used to limit retries. |
| `MergeInsertBuilder.data_storage_version(self, version: str) -&gt; 'MergeInsertBuilder'` | python/python/lance/dataset.py:530-543 | Set the exact data storage version for files written by this operation. |
| `MergeInsertBuilder.use_index(self, use_index: bool) -&gt; 'MergeInsertBuilder'` | python/python/lance/dataset.py:545-564 | Controls whether to use indices for the merge operation. |
| `MergeInsertBuilder.write_mode(self, mode: Literal['auto', 'rewrite_rows', 'rewrite_columns']) -&gt; 'MergeInsertBuilder'` | python/python/lance/dataset.py:566-607 | Selects how the merged rows are written to disk. |
| `MergeInsertBuilder.target_bases(self, bases: List[str]) -&gt; 'MergeInsertBuilder'` | python/python/lance/dataset.py:609-633 | Write new fragments produced by this merge insert to these bases. |
| `MergeInsertBuilder.target_all_bases(self, include_primary: bool=True) -&gt; 'MergeInsertBuilder'` | python/python/lance/dataset.py:635-655 | Write new fragments to every base registered in the dataset manifest. |
| `MergeInsertBuilder.explain_plan(self, schema: Optional[pa.Schema]=None, verbose: bool=False) -&gt; str` | python/python/lance/dataset.py:657-728 | Generate the execution plan for the merge insert operation. |
| `MergeInsertBuilder.analyze_plan(self, data_obj: ReaderLike, *, schema: Optional[pa.Schema]=None) -&gt; str` | python/python/lance/dataset.py:730-830 | Generate the execution plan and analyze its performance with real data. |
| `MergeInsertBuilder.mark_sstables_as_compacted(self, sstables: 'List[mem_wal.CompactedSsTable]') -&gt; 'MergeInsertBuilder'` | python/python/lance/dataset.py:832-856 | Mark MemWAL SSTables as compacted into the base table. |
| `class LanceDataset(pa.dataset.Dataset)` | python/python/lance/dataset.py:859-5901 | A Lance Dataset in Lance format where the data is stored at the given uri. |
| `LanceDataset.__init__(self, uri: Union[str, Path], version: Optional[int \| str]=None, block_size: Optional[int]=None, index_cache_size: Optional[int]=None, metadata_cache_size: Optional[int]=None, commit_lock: Optional[CommitLock]=None, storage_options: Optional[Dict[str, str]]=None, serialized_manifest: Optional[bytes]=None, default_scan_options: Optional[Dict[str, Any]]=None, metadata_cache_size_bytes: Optional[int]=None, index_cache_size_bytes: Optional[int]=None, read_params: Optional[Dict[str, Any]]=None, session: Optional[Session]=None, namespace_client: Optional[Any]=None, table_id: Optional[List[str]]=None, namespace_client_managed_versioning: bool=False, base_store_params: Optional[Dict[str, Dict[str, str]]]=None)` | python/python/lance/dataset.py:862-923 | No standalone documentation summary; use the family contract and source entry. |
| `LanceDataset.from_pydantic_model(cls, model_class, data, uri: Optional[Union[str, Path]]=None, mode: str='create', **kwargs) -&gt; 'LanceDataset'` | python/python/lance/dataset.py:947-993 | Create a LanceDataset from a Pydantic model class and a list of instances. |
| `LanceDataset.uri(self) -&gt; str` | python/python/lance/dataset.py:1065-1069 | The location of the data |
| `LanceDataset.tags(self) -&gt; Tags` | python/python/lance/dataset.py:1072-1097 | Tag management for the dataset. |
| `LanceDataset.branches(self) -&gt; 'Branches'` | python/python/lance/dataset.py:1100-1115 | Branch management for the dataset. |
| `LanceDataset.create_branch(self, branch: str, reference: Optional[int \| str \| Tuple[Optional[str], Optional[int]]]=None, storage_options: Optional[Dict[str, str]]=None) -&gt; 'LanceDataset'` | python/python/lance/dataset.py:1117-1159 | Create a new branch from a version or tag. |
| `LanceDataset.checkout_latest(self)` | python/python/lance/dataset.py:1161-1163 | Check out the latest version of the current branch. |
| `LanceDataset.list_indices(self) -&gt; List[IndexInformation]` | python/python/lance/dataset.py:1165-1192 | Returns index information for all indices in the dataset. |
| `LanceDataset.describe_indices(self) -&gt; List[IndexDescription]` | python/python/lance/dataset.py:1194-1196 | Returns index information for all indices in the dataset. |
| `LanceDataset.remap_row_addrs(self, addrs: 'pa.Array') -&gt; 'Optional[pa.Array]'` | python/python/lance/dataset.py:1198-1206 | Remap row addresses across compactions still recorded in the fragment-reuse index. Rows a compaction dropped become null. The index retains only recent rounds (older ones are pruned as index remap catches up), so remap promptly: an address whose round was pruned is returned unchanged, not remapped. Returns ``None`` when there is no fragment-reuse index. |
| `LanceDataset.index_statistics(self, index_name: str) -&gt; Dict[str, Any]` | python/python/lance/dataset.py:1208-1214 | No standalone documentation summary; use the family contract and source entry. |
| `LanceDataset.has_index(self)` | python/python/lance/dataset.py:1217-1218 | No standalone documentation summary; use the family contract and source entry. |
| `LanceDataset.scanner(self, columns: Optional[Union[List[str], Dict[str, str]]]=None, filter: Optional[Union[str, Expression, FullTextQuery, VectorSearchQuery, Dict[str, Any]]]=None, limit: Optional[int]=None, offset: Optional[int]=None, nearest: Optional[Union[Dict[str, Any], MinHashQuery]]=None, batch_size: Optional[int]=None, batch_size_bytes: Optional[int]=None, batch_readahead: Optional[int]=None, fragment_readahead: Optional[int]=None, scan_in_order: Optional[bool]=None, fragments: Optional[Iterable[LanceFragment]]=None, index_segments: Optional[Iterable[Union[str, uuid.UUID]]]=None, full_text_query: Optional[Union[str, Dict[str, Any], FullTextQuery]]=None, *, prefilter: Optional[bool]=None, with_row_id: Optional[bool]=None, with_row_address: Optional[bool]=None, use_stats: Optional[bool]=None, fast_search: Optional[bool]=None, io_buffer_size: Optional[int]=None, late_materialization: Optional[bool \| List[str]]=None, blob_handling: Optional[Literal['all_binary', 'blobs_descriptions', 'all_descriptions']]=None, use_scalar_index: Optional[bool]=None, include_deleted_rows: Optional[bool]=None, scan_stats_callback: Optional[Callable[[ScanStatistics], None]]=None, strict_batch_size: Optional[bool]=None, order_by: Optional[List[Union[ColumnOrdering, str]]]=None, disable_scoring_autoprojection: Optional[bool]=None, row_addr_allowlist: Optional[bytes]=None, row_addr_blocklist: Optional[bytes]=None) -&gt; LanceScanner` | python/python/lance/dataset.py:1225-1567 | Return a Scanner that can support various pushdowns. |
| `LanceDataset.schema(self) -&gt; pa.Schema` | python/python/lance/dataset.py:1570-1577 | The pyarrow Schema for this dataset |
| `LanceDataset.lance_schema(self) -&gt; 'LanceSchema'` | python/python/lance/dataset.py:1580-1584 | The LanceSchema for this dataset |
| `LanceDataset.data_storage_version(self) -&gt; str` | python/python/lance/dataset.py:1587-1593 | The default data file version for writes that omit ``data_storage_version``. Existing files may use other V2 versions; this is not a snapshot version summary. |
| `LanceDataset.has_stable_row_ids(self) -&gt; bool` | python/python/lance/dataset.py:1596-1603 | Whether this dataset has stable row IDs enabled. |
| `LanceDataset.max_field_id(self) -&gt; int` | python/python/lance/dataset.py:1606-1610 | The max_field_id in manifest |
| `LanceDataset.to_table(self, columns: Optional[Union[List[str], Dict[str, str]]]=None, filter: Optional[Union[str, Expression]]=None, limit: Optional[int]=None, offset: Optional[int]=None, nearest: Optional[Union[Dict[str, Any], MinHashQuery]]=None, batch_size: Optional[int]=None, batch_size_bytes: Optional[int]=None, batch_readahead: Optional[int]=None, fragment_readahead: Optional[int]=None, scan_in_order: Optional[bool]=None, *, prefilter: Optional[bool]=None, with_row_id: Optional[bool]=None, with_row_address: Optional[bool]=None, use_stats: Optional[bool]=None, fast_search: Optional[bool]=None, full_text_query: Optional[Union[str, Dict[str, Any], FullTextQuery]]=None, io_buffer_size: Optional[int]=None, late_materialization: Optional[bool \| List[str]]=None, blob_handling: Optional[str]=None, use_scalar_index: Optional[bool]=None, include_deleted_rows: Optional[bool]=None, order_by: Optional[List[ColumnOrdering]]=None, disable_scoring_autoprojection: Optional[bool]=None) -&gt; pa.Table` | python/python/lance/dataset.py:1612-1772 | Read the data into memory as a :py:class:`pyarrow.Table` |
| `LanceDataset.to_pandas(self, columns: Optional[Union[List[str], Dict[str, str]]]=None, filter: Optional[Union[str, Expression]]=None, limit: Optional[int]=None, offset: Optional[int]=None, nearest: Optional[Union[Dict[str, Any], MinHashQuery]]=None, batch_size: Optional[int]=None, batch_readahead: Optional[int]=None, fragment_readahead: Optional[int]=None, scan_in_order: Optional[bool]=None, *, prefilter: Optional[bool]=None, with_row_id: Optional[bool]=None, with_row_address: Optional[bool]=None, use_stats: Optional[bool]=None, fast_search: Optional[bool]=None, full_text_query: Optional[Union[str, Dict[str, Any], FullTextQuery]]=None, io_buffer_size: Optional[int]=None, late_materialization: Optional[bool \| List[str]]=None, blob_mode: str=_BLOB_PANDAS_MODE_LAZY, use_scalar_index: Optional[bool]=None, include_deleted_rows: Optional[bool]=None, order_by: Optional[List[ColumnOrdering]]=None, disable_scoring_autoprojection: Optional[bool]=None, **kwargs) -&gt; 'pd.DataFrame'` | python/python/lance/dataset.py:1774-1839 | Read the data into a :py:class:`pandas.DataFrame`. |
| `LanceDataset.partition_expression(self)` | python/python/lance/dataset.py:1842-1846 | Not implemented (just override pyarrow dataset to prevent segfault) |
| `LanceDataset.replace_schema(self, schema: Schema)` | python/python/lance/dataset.py:1848-1858 | Not implemented (just override pyarrow dataset to prevent segfault) |
| `LanceDataset.replace_schema_metadata(self, new_metadata: Dict[str, str])` | python/python/lance/dataset.py:1860-1879 | Replace the schema metadata of the dataset |
| `LanceDataset.replace_field_metadata(self, field_name: str, new_metadata: Dict[str, str])` | python/python/lance/dataset.py:1881-1902 | Replace the metadata of a field in the schema |
| `LanceDataset.metadata(self) -&gt; Dict[str, str]` | python/python/lance/dataset.py:1907-1916 | Get the table metadata of the dataset. |
| `LanceDataset.schema_metadata(self) -&gt; Dict[str, str]` | python/python/lance/dataset.py:1919-1928 | Get the schema metadata of the dataset. |
| `LanceDataset.update_metadata(self, values: Dict[str, Optional[str]], *, replace: bool=False) -&gt; Dict[str, str]` | python/python/lance/dataset.py:1930-1966 | Update the table metadata of the dataset. |
| `LanceDataset.update_config(self, values: Dict[str, Optional[str]], *, replace: bool=False) -&gt; Dict[str, str]` | python/python/lance/dataset.py:1968-2004 | Update the configuration of the dataset using unified API. |
| `LanceDataset.update_schema_metadata(self, values: Dict[str, Optional[str]], *, replace: bool=False) -&gt; Dict[str, str]` | python/python/lance/dataset.py:2006-2042 | Update the schema metadata of the dataset. |
| `LanceDataset.update_field_metadata(self, field_updates: Dict[str, Dict[str, Optional[str]]], *, replace: bool=False) -&gt; None` | python/python/lance/dataset.py:2044-2089 | Update metadata for multiple fields in the dataset. |
| `LanceDataset.get_fragments(self, filter: Optional[Expression]=None) -&gt; List[LanceFragment]` | python/python/lance/dataset.py:2091-2101 | Get all fragments from the dataset. |
| `LanceDataset.get_fragment(self, fragment_id: int) -&gt; Optional[LanceFragment]` | python/python/lance/dataset.py:2103-2108 | Get the fragment with fragment id. |
| `LanceDataset.io_stats_snapshot(self) -&gt; IOStats` | python/python/lance/dataset.py:2110-2147 | Get a snapshot of current IO statistics without resetting counters. |
| `LanceDataset.io_stats_incremental(self) -&gt; IOStats` | python/python/lance/dataset.py:2149-2189 | Get incremental IO statistics and reset the counters. |
| `LanceDataset.to_batches(self, columns: Optional[Union[List[str], Dict[str, str]]]=None, filter: Optional[Union[str, Expression]]=None, limit: Optional[int]=None, offset: Optional[int]=None, nearest: Optional[Union[Dict[str, Any], MinHashQuery]]=None, batch_size: Optional[int]=None, batch_size_bytes: Optional[int]=None, batch_readahead: Optional[int]=None, fragment_readahead: Optional[int]=None, scan_in_order: Optional[bool]=None, *, prefilter: Optional[bool]=None, with_row_id: Optional[bool]=None, with_row_address: Optional[bool]=None, use_stats: Optional[bool]=None, full_text_query: Optional[Union[str, Dict[str, Any]]]=None, io_buffer_size: Optional[int]=None, late_materialization: Optional[bool \| List[str]]=None, blob_handling: Optional[str]=None, use_scalar_index: Optional[bool]=None, strict_batch_size: Optional[bool]=None, order_by: Optional[List[ColumnOrdering]]=None, disable_scoring_autoprojection: Optional[bool]=None, **kwargs) -&gt; Iterator[pa.RecordBatch]` | python/python/lance/dataset.py:2191-2252 | Read the dataset as materialized record batches. |
| `LanceDataset.sample(self, num_rows: int, columns: Optional[Union[List[str], Dict[str, str]]]=None, randomize_order: bool=True, **kwargs) -&gt; pa.Table` | python/python/lance/dataset.py:2254-2284 | Select a random sample of data |
| `LanceDataset.take(self, indices: Union[List[int], pa.Array], columns: Optional[Union[List[str], Dict[str, str]]]=None) -&gt; pa.Table` | python/python/lance/dataset.py:2286-2312 | Select rows of data by index. |
| `LanceDataset.take_blobs(self, blob_column: str, ids: Optional[Union[List[int], pa.Array]]=None, addresses: Optional[Union[List[int], pa.Array]]=None, indices: Optional[Union[List[int], pa.Array]]=None, *, buffer_size: int=DEFAULT_BLOB_BUFFER_SIZE) -&gt; List[Optional[BlobFile]]` | python/python/lance/dataset.py:2347-2411 | Select blobs by row IDs. |
| `LanceDataset.read_blobs(self, blob_column: str, ids: Optional[Union[List[int], pa.Array]]=None, addresses: Optional[Union[List[int], pa.Array]]=None, indices: Optional[Union[List[int], pa.Array]]=None, *, io_buffer_size: Optional[int]=None, preserve_order: Optional[bool]=None) -&gt; List[Tuple[int, Optional[bytes]]]` | python/python/lance/dataset.py:2413-2468 | Read blobs directly into memory using Lance's planned blob reader. |
| `LanceDataset.read_blob_ranges(self, blob_column: str, requests: Sequence[Tuple[int, int, int]], *, selector: Literal['ids', 'addresses', 'indices'], io_buffer_size: Optional[int]=None, preserve_order: Optional[bool]=None) -&gt; List[Tuple[int, int, Optional[bytes]]]` | python/python/lance/dataset.py:2470-2536 | Read row-specific blob-local byte ranges with one planned API call. |
| `LanceDataset.head(self, num_rows, **kwargs)` | python/python/lance/dataset.py:2538-2554 | Load the first N rows of the dataset. |
| `LanceDataset.slice(self, start: int, end: int, columns: Optional[Union[List[str], Dict[str, str]]]=None) -&gt; pa.Table` | python/python/lance/dataset.py:2556-2600 | Select a contiguous range of rows by position. |
| `LanceDataset.count_rows(self, filter: Optional[Union[str, Expression]]=None, **kwargs: Any) -&gt; int` | python/python/lance/dataset.py:2602-2624 | Count rows matching the scanner filter. |
| `LanceDataset.join(self, right_dataset, keys, right_keys=None, join_type='left outer', left_suffix=None, right_suffix=None, coalesce_keys=True, use_threads=True)` | python/python/lance/dataset.py:2626-2640 | Not implemented (just override pyarrow dataset to prevent segfault) |
| `LanceDataset.alter_columns(self, *alterations: Iterable[AlterColumn])` | python/python/lance/dataset.py:2642-2701 | Alter column name, data type, and nullability. |
| `LanceDataset.merge(self, data_obj: ReaderLike, left_on: str, right_on: Optional[str]=None, schema=None)` | python/python/lance/dataset.py:2703-2760 | Merge another dataset into this one. |
| `LanceDataset.add_columns(self, transforms: Dict[str, str] \| BatchUDF \| ReaderLike \| pyarrow.Field \| List[pyarrow.Field] \| pyarrow.Schema, read_columns: List[str] \| None=None, reader_schema: Optional[pa.Schema]=None, batch_size: Optional[int]=None)` | python/python/lance/dataset.py:2762-2865 | Add new columns with defined values. |
| `LanceDataset.drop_columns(self, columns: List[str])` | python/python/lance/dataset.py:2867-2896 | Drop one or more columns from the dataset |
| `LanceDataset.delete(self, predicate: Union[str, Expression], *, conflict_retries: int=10, retry_timeout: timedelta=timedelta(seconds=30)) -&gt; DeleteResult` | python/python/lance/dataset.py:2898-2945 | Delete rows from the dataset. |
| `LanceDataset.truncate_table(self) -&gt; None` | python/python/lance/dataset.py:2947-2953 | Truncate the dataset by deleting all rows. The schema is preserved and a new version is created. |
| `LanceDataset.insert(self, data: ReaderLike, *, mode='append', **kwargs)` | python/python/lance/dataset.py:2955-2981 | Insert data into the dataset. |
| `LanceDataset.merge_insert(self, on: Optional[Union[str, Iterable[str]]]=None) -&gt; MergeInsertBuilder` | python/python/lance/dataset.py:2983-3097 | Returns a builder that can be used to create a "merge insert" operation |
| `LanceDataset.update(self, updates: Dict[str, str], where: Optional[Union[str, Expression]]=None, conflict_retries: int=10, retry_timeout: timedelta=timedelta(seconds=30), data_storage_version: Optional[str]=None) -&gt; UpdateResult` | python/python/lance/dataset.py:3099-3160 | Update column values for rows matching where. |
| `LanceDataset.versions(self) -&gt; List[Version]` | python/python/lance/dataset.py:3162-3169 | Return all versions in this dataset. |
| `LanceDataset.get_version(self) -&gt; Version` | python/python/lance/dataset.py:3171-3194 | Return the currently checked out version, with its timestamp and the summary of its manifest. |
| `LanceDataset.version_refs(self) -&gt; List[VersionRef]` | python/python/lance/dataset.py:3196-3203 | Return lightweight references to all attached versions in the current branch. |
| `LanceDataset.version(self) -&gt; int` | python/python/lance/dataset.py:3206-3210 | Returns the currently checked out version of the dataset |
| `LanceDataset.latest_version(self) -&gt; int` | python/python/lance/dataset.py:3213-3217 | Returns the latest version of the dataset. |
| `LanceDataset.initial_storage_options(self) -&gt; Optional[Dict[str, str]]` | python/python/lance/dataset.py:3220-3228 | Get the initial storage options used to open this dataset. |
| `LanceDataset.latest_storage_options(self) -&gt; Optional[Dict[str, str]]` | python/python/lance/dataset.py:3230-3248 | Get the latest storage options, potentially refreshed from the provider. |
| `LanceDataset.storage_options_accessor(self)` | python/python/lance/dataset.py:3251-3260 | Get the storage options accessor for this dataset. |
| `LanceDataset.new_file_session(self)` | python/python/lance/dataset.py:3262-3282 | Create a new file session for reading and writing files in this dataset. |
| `LanceDataset.checkout_version(self, version: int \| str \| Tuple[Optional[str], Optional[int]]) -&gt; 'LanceDataset'` | python/python/lance/dataset.py:3284-3310 | Load the given version of the dataset. |
| `LanceDataset.restore(self)` | python/python/lance/dataset.py:3312-3318 | Restore the currently checked out version as the latest version of the dataset. |
| `LanceDataset.base_paths(self) -&gt; Dict[int, DatasetBasePath]` | python/python/lance/dataset.py:3320-3359 | Return the base paths registered in the current dataset snapshot. |
| `LanceDataset.add_bases(self, new_bases: list, transaction_properties: Optional[Dict[str, str]]=None)` | python/python/lance/dataset.py:3361-3385 | Add new base paths to the dataset for multi-base storage. |
| `LanceDataset.cleanup_old_versions(self, older_than: Optional[timedelta]=None, retain_versions: Optional[int]=None, *, delete_unverified: bool=False, error_if_tagged_old_versions: bool=True, delete_rate_limit: Optional[int]=None, versions: Optional[List[int]]=None) -&gt; CleanupStats` | python/python/lance/dataset.py:3387-3457 | Cleans up old versions of the dataset. |
| `LanceDataset.explain_cleanup_old_versions(self, older_than: Optional[timedelta]=None, retain_versions: Optional[int]=None, *, delete_unverified: bool=False, error_if_tagged_old_versions: bool=True, delete_rate_limit: Optional[int]=None, versions: Optional[List[int]]=None, include_files: bool=False, max_files: int=1000) -&gt; CleanupExplanation` | python/python/lance/dataset.py:3459-3520 | Explain what :meth:`cleanup_old_versions` would remove without deleting files. |
| `LanceDataset.create_scalar_index(self, column: str, index_type: Union[Literal['BTREE'], Literal['BITMAP'], Literal['LABEL_LIST'], Literal['INVERTED'], Literal['FTS'], Literal['NGRAM'], Literal['ZONEMAP'], Literal['BLOOMFILTER'], Literal['RTREE'], IndexConfig], name: Optional[str]=None, *, replace: bool=True, train: bool=True, fragment_ids: Optional[List[int]]=None, index_uuid: Optional[str]=None, progress_callback: Optional[Callable[[IndexProgress], None]]=None, format_version: Optional[Union[int, str]]=None, document_granularity: DocumentGranularity=DocumentGranularity.ROW, **kwargs: Any) -&gt; None` | python/python/lance/dataset.py:3678-3953 | Create a scalar index on a column. |
| `LanceDataset.create_index(self, column: Union[str, List[str]], index_type: str, name: Optional[str]=None, metric: str='L2', replace: bool=False, num_partitions: Optional[int]=None, ivf_centroids: Optional[Union[np.ndarray, pa.FixedSizeListArray, pa.FixedShapeTensorArray]]=None, pq_codebook: Optional[Union[np.ndarray, pa.FixedSizeListArray, pa.FixedShapeTensorArray]]=None, num_sub_vectors: Optional[int]=None, accelerator: Optional[Union[str, 'torch.Device']]=None, index_cache_size: Optional[int]=None, shuffle_partition_batches: Optional[int]=None, shuffle_partition_concurrency: Optional[int]=None, ivf_centroids_file: Optional[str]=None, precomputed_partition_dataset: Optional[str]=None, storage_options: Optional[Dict[str, str]]=None, filter_nan: bool=True, train: bool=True, fragment_ids: Optional[List[int]]=None, index_uuid: Optional[str]=None, *, target_partition_size: Optional[int]=None, streaming_sample_rate: Optional[int]=None, streaming_coreset_rate: Optional[int]=None, streaming_refine_passes: Optional[int]=None, skip_transpose: bool=False, progress_callback: Optional[Callable[[IndexProgress], None]]=None, **kwargs) -&gt; LanceDataset` | python/python/lance/dataset.py:4365-4640 | Create index on column. |
| `LanceDataset.create_index_uncommitted(self, column: Union[str, List[str]], index_type: Union[str, IndexConfig], name: Optional[str]=None, metric: str='L2', replace: bool=False, num_partitions: Optional[int]=None, ivf_centroids: Optional[Union[np.ndarray, pa.FixedSizeListArray, pa.FixedShapeTensorArray]]=None, pq_codebook: Optional[Union[np.ndarray, pa.FixedSizeListArray, pa.FixedShapeTensorArray]]=None, num_sub_vectors: Optional[int]=None, accelerator: Optional[Union[str, 'torch.Device']]=None, index_cache_size: Optional[int]=None, shuffle_partition_batches: Optional[int]=None, shuffle_partition_concurrency: Optional[int]=None, ivf_centroids_file: Optional[str]=None, precomputed_partition_dataset: Optional[str]=None, storage_options: Optional[Dict[str, str]]=None, filter_nan: bool=True, train: bool=True, fragment_ids: Optional[List[int]]=None, index_uuid: Optional[str]=None, *, target_partition_size: Optional[int]=None, streaming_sample_rate: Optional[int]=None, streaming_coreset_rate: Optional[int]=None, streaming_refine_passes: Optional[int]=None, skip_transpose: bool=False, rabitq_model: Optional[str]=None, **kwargs) -&gt; Index` | python/python/lance/dataset.py:4642-4785 | Create one segment without publishing it and return its metadata. |
| `LanceDataset.drop_index(self, name: str)` | python/python/lance/dataset.py:4787-4796 | Drops an index from the dataset |
| `LanceDataset.prewarm_index(self, name: str, *, with_position: bool=False, index_segments: Optional[Iterable[Union[str, uuid.UUID]]]=None)` | python/python/lance/dataset.py:4798-4832 | Prewarm an index |
| `LanceDataset.merge_index_metadata(self, index_uuid: str, index_type: str, batch_readhead: Optional[int]=None, progress_callback: Optional[Callable[[IndexProgress], None]]=None)` | python/python/lance/dataset.py:4834-4883 | Merge distributed scalar index metadata. |
| `LanceDataset.merge_existing_index_segments(self, segments: List[Index]) -&gt; Index` | python/python/lance/dataset.py:4885-4889 | Merge one caller-defined group of existing uncommitted segments. |
| `LanceDataset.commit_existing_index_segments(self, index_name: str, column: str, segments: List[Union[IndexSegment, Index]]) -&gt; LanceDataset` | python/python/lance/dataset.py:4891-4898 | Commit built index segments as one logical index. |
| `LanceDataset.session(self) -&gt; Session` | python/python/lance/dataset.py:4900-4904 | Return the dataset session, which holds the dataset's state. |
| `LanceDataset.commit(base_uri: Union[str, Path, LanceDataset], operation: Union[LanceOperation.BaseOperation, Transaction], read_version: Optional[int]=None, commit_lock: Optional[CommitLock]=None, storage_options: Optional[Dict[str, str]]=None, enable_v2_manifest_paths: Optional[bool]=None, detached: Optional[bool]=False, max_retries: int=20, *, commit_message: Optional[str]=None, enable_stable_row_ids: Optional[bool]=None, namespace_client: Optional['LanceNamespace']=None, table_id: Optional[List[str]]=None, namespace_client_managed_versioning: bool=False, base_store_params: Optional[Dict[str, Dict[str, str]]]=None, commit_timeout: Optional[timedelta]=_DEFAULT_COMMIT_TIMEOUT) -&gt; LanceDataset` | python/python/lance/dataset.py:4929-5136 | Create a new version of dataset |
| `LanceDataset.commit_batch(dest: Union[str, Path, LanceDataset], transactions: Sequence[Transaction], commit_lock: Optional[CommitLock]=None, storage_options: Optional[Dict[str, str]]=None, enable_v2_manifest_paths: Optional[bool]=None, detached: Optional[bool]=False, max_retries: int=20, base_store_params: Optional[Dict[str, Dict[str, str]]]=None, commit_timeout: Optional[timedelta]=_DEFAULT_COMMIT_TIMEOUT) -&gt; BulkCommitResult` | python/python/lance/dataset.py:5139-5248 | Create a new version of dataset with multiple transactions. |
| `LanceDataset.validate(self)` | python/python/lance/dataset.py:5250-5257 | Validate the dataset. |
| `LanceDataset.shallow_clone(self, target_path: str \| Path, reference: int \| str \| Tuple[Optional[str], Optional[int]], storage_options: Optional[Dict[str, str]]=None, **kwargs) -&gt; 'LanceDataset'` | python/python/lance/dataset.py:5259-5302 | Shallow clone the specified version into a new dataset at target_path. |
| `LanceDataset.deep_clone(self, target_path: str \| Path, reference: int \| str \| Tuple[Optional[str], Optional[int]], storage_options: Optional[Dict[str, str]]=None, **kwargs) -&gt; 'LanceDataset'` | python/python/lance/dataset.py:5304-5343 | Deep clone the specified version into a new dataset at target_path. |
| `LanceDataset.migrate_manifest_paths_v2(self)` | python/python/lance/dataset.py:5345-5357 | Migrate the manifest paths to the new format. |
| `LanceDataset.delete_config_keys(self, keys: list[str]) -&gt; None` | python/python/lance/dataset.py:5359-5368 | Delete specified configuration keys from the dataset. |
| `LanceDataset.config(self) -&gt; dict[str, str]` | python/python/lance/dataset.py:5370-5380 | Get configs of the dataset. |
| `LanceDataset.read_transaction(self, version: int) -&gt; Optional[Transaction]` | python/python/lance/dataset.py:5382-5419 | Get Transaction at a specific version. |
| `LanceDataset.get_transactions(self, recent_transactions=10) -&gt; List[Optional[Transaction]]` | python/python/lance/dataset.py:5421-5422 | No standalone documentation summary; use the family contract and source entry. |
| `LanceDataset.sql(self, sql: str) -&gt; 'SqlQueryBuilder'` | python/python/lance/dataset.py:5424-5448 | Execute SQL query on the dataset. |
| `LanceDataset.delta(self, compared_against: Optional[int]=None, *, begin_version: Optional[int]=None, end_version: Optional[int]=None) -&gt; 'DatasetDelta'` | python/python/lance/dataset.py:5450-5530 | Compare changes between two versions of this dataset. |
| `LanceDataset.optimize(self) -&gt; 'DatasetOptimizer'` | python/python/lance/dataset.py:5533-5534 | No standalone documentation summary; use the family contract and source entry. |
| `LanceDataset.stats(self) -&gt; 'LanceStats'` | python/python/lance/dataset.py:5537-5541 | **Experimental API** |
| `LanceDataset.drop(base_uri: Union[str, Path], storage_options: Optional[Dict[str, str]]=None, ignore_not_found: Optional[bool]=None) -&gt; None` | python/python/lance/dataset.py:5544-5574 | Delete a dataset and everything under ``base_uri``. |
| `LanceDataset.get_ivf_model(self, index_name: str)` | python/python/lance/dataset.py:5576-5587 | Return the IVF model for a vector index. |
| `LanceDataset.centroids(self, *, index_name: str \| None=None, column: str \| None=None)` | python/python/lance/dataset.py:5609-5634 | Return IVF centroids for a given index/column. |
| `LanceDataset.initialize_mem_wal(self, *, maintained_indexes: Optional[List[str]]=None, bucket_column: Optional[str]=None, num_buckets: Optional[int]=None, identity_column: Optional[str]=None, unsharded: bool=False, durable_write: Optional[bool]=None, max_wal_buffer_size: Optional[int]=None, max_wal_flush_interval_ms: Optional[int]=None, max_memtable_size: Optional[int]=None, max_memtable_rows: Optional[int]=None, max_memtable_batches: Optional[int]=None, max_unflushed_memtable_bytes: Optional[int]=None, manifest_scan_batch_size: Optional[int]=None, backpressure_log_interval_ms: Optional[int]=None, stats_log_interval_ms: Optional[int]=None, hnsw_params: Optional[Dict[str, Dict[str, int]]]=None) -&gt; None` | python/python/lance/dataset.py:5636-5724 | Initialize MemWAL on this dataset. |
| `LanceDataset.mem_wal_index_details(self) -&gt; Optional[Dict[str, Any]]` | python/python/lance/dataset.py:5726-5736 | Return the MemWAL index details, or ``None`` if not initialized. |
| `LanceDataset.mem_wal_writer(self, shard_id: str, *, durable_write: Optional[bool]=None, max_wal_buffer_size: Optional[int]=None, max_wal_flush_interval_ms: Optional[int]=None, max_memtable_size: Optional[int]=None, max_memtable_rows: Optional[int]=None, max_memtable_batches: Optional[int]=None, max_unflushed_memtable_bytes: Optional[int]=None, manifest_scan_batch_size: Optional[int]=None, backpressure_log_interval_ms: Optional[int]=None, stats_log_interval_ms: Optional[int]=None, hnsw_params: Optional[Dict[str, Dict[str, int]]]=None) -&gt; 'mem_wal.ShardWriter'` | python/python/lance/dataset.py:5738-5842 | Get a ShardWriter for the specified shard. |
| `LanceDataset.tracked_files(self, *, min_version: Optional[int]=None, progress: Optional[Callable]=None) -&gt; pa.RecordBatchReader` | python/python/lance/dataset.py:5844-5886 | Stream all files referenced by any manifest version of this dataset. |
| `LanceDataset.all_files(self) -&gt; pa.RecordBatchReader` | python/python/lance/dataset.py:5888-5901 | Stream all files physically present at this dataset's base URI. |
| `class SqlQuery()` | python/python/lance/dataset.py:5904-5936 | An executable SQL query. |
| `SqlQuery.__init__(self, query)` | python/python/lance/dataset.py:5911-5912 | No standalone documentation summary; use the family contract and source entry. |
| `SqlQuery.to_batch_records(self) -&gt; list[pa.RecordBatch]` | python/python/lance/dataset.py:5914-5924 | Execute the query and return a list of RecordBatches. |
| `SqlQuery.to_stream_reader(self) -&gt; pa.RecordBatchReader` | python/python/lance/dataset.py:5926-5936 | Execute the query and return a RecordBatchReader. |
| `class SqlQueryBuilder()` | python/python/lance/dataset.py:5939-6030 | A builder for SQL queries on a Lance dataset. |
| `SqlQueryBuilder.__init__(self, builder)` | python/python/lance/dataset.py:5947-5948 | No standalone documentation summary; use the family contract and source entry. |
| `SqlQueryBuilder.table_name(self, table_name: str) -&gt; 'SqlQueryBuilder'` | python/python/lance/dataset.py:5950-5960 | Set the table name for the query. |
| `SqlQueryBuilder.with_row_id(self, with_row_id: bool=True) -&gt; 'SqlQueryBuilder'` | python/python/lance/dataset.py:5962-5972 | Include the row ID in the query result. |
| `SqlQueryBuilder.with_row_addr(self, with_row_addr: bool=True) -&gt; 'SqlQueryBuilder'` | python/python/lance/dataset.py:5974-5984 | Include the row address in the query result. |
| `SqlQueryBuilder.blob_handling(self, blob_handling: Literal['all_binary', 'blobs_descriptions', 'all_descriptions']) -&gt; 'SqlQueryBuilder'` | python/python/lance/dataset.py:5986-5999 | Control how blob columns are returned by this SQL query. |
| `SqlQueryBuilder.batch_size(self, batch_size: int) -&gt; 'SqlQueryBuilder'` | python/python/lance/dataset.py:6001-6009 | Set the maximum number of rows produced by each query batch. |
| `SqlQueryBuilder.batch_size_bytes(self, batch_size_bytes: int) -&gt; 'SqlQueryBuilder'` | python/python/lance/dataset.py:6011-6019 | Set the approximate maximum bytes produced by each scan batch. |
| `SqlQueryBuilder.build(self) -&gt; SqlQuery` | python/python/lance/dataset.py:6021-6030 | Build the query. |
| `class DatasetDelta()` | python/python/lance/dataset.py:6033-6068 | A view of differences between two versions. |
| `DatasetDelta.__init__(self, delta)` | python/python/lance/dataset.py:6041-6042 | No standalone documentation summary; use the family contract and source entry. |
| `DatasetDelta.list_transactions(self) -&gt; List[Transaction]` | python/python/lance/dataset.py:6044-6048 | List transactions in the range from begin_version + 1 to end_version. |
| `DatasetDelta.get_inserted_rows(self) -&gt; pa.RecordBatchReader` | python/python/lance/dataset.py:6050-6054 | Return a streaming RecordBatchReader for inserted rows. |
| `DatasetDelta.get_updated_rows(self) -&gt; pa.RecordBatchReader` | python/python/lance/dataset.py:6056-6060 | Return a streaming RecordBatchReader for updated rows. |
| `DatasetDelta.get_deleted_row_ids(self) -&gt; pa.RecordBatchReader` | python/python/lance/dataset.py:6062-6068 | Return a streaming RecordBatchReader of the row ids deleted in the range. |
| `class BulkCommitResult(TypedDict)` | python/python/lance/dataset.py:6096-6098 | No standalone documentation summary; use the family contract and source entry. |
| `class Transaction()` | python/python/lance/dataset.py:6102-6108 | No standalone documentation summary; use the family contract and source entry. |
| `class Tag(TypedDict)` | python/python/lance/dataset.py:6111-6117 | No standalone documentation summary; use the family contract and source entry. |
| `class Branch(TypedDict)` | python/python/lance/dataset.py:6120-6126 | No standalone documentation summary; use the family contract and source entry. |
| `class Version(TypedDict)` | python/python/lance/dataset.py:6129-6132 | No standalone documentation summary; use the family contract and source entry. |
| `class VersionRef(TypedDict)` | python/python/lance/dataset.py:6146-6147 | No standalone documentation summary; use the family contract and source entry. |
| `class UpdateResult(TypedDict)` | python/python/lance/dataset.py:6150-6151 | No standalone documentation summary; use the family contract and source entry. |
| `class DeleteResult(TypedDict)` | python/python/lance/dataset.py:6154-6155 | No standalone documentation summary; use the family contract and source entry. |
| `class AlterColumn(TypedDict)` | python/python/lance/dataset.py:6158-6162 | No standalone documentation summary; use the family contract and source entry. |
| `class ExecuteResult(TypedDict)` | python/python/lance/dataset.py:6165-6168 | No standalone documentation summary; use the family contract and source entry. |
| `class IndexFile()` | python/python/lance/dataset.py:6172-6176 | Metadata about a file in an index segment. |
| `class Index()` | python/python/lance/dataset.py:6180-6195 | Represents an index in the dataset. |
| `class IndexInformation(TypedDict)` | python/python/lance/dataset.py:6198-6208 | Information about a single index segment, as returned by :meth:`LanceDataset.list_indices`. |
| `class AutoCleanupConfig(TypedDict)` | python/python/lance/dataset.py:6211-6213 | No standalone documentation summary; use the family contract and source entry. |
| `class LanceOperation()` | python/python/lance/dataset.py:6217-6814 | No standalone documentation summary; use the family contract and source entry. |
| `class LanceOperation.BaseOperation(ABC)` | python/python/lance/dataset.py:6231-6236 | Base class for operations that can be applied to a dataset. |
| `class LanceOperation.Overwrite(BaseOperation)` | python/python/lance/dataset.py:6239-6296 | Overwrite or create a new dataset. |
| `class LanceOperation.Append(BaseOperation)` | python/python/lance/dataset.py:6299-6342 | Append new rows to the dataset. |
| `class LanceOperation.Delete(BaseOperation)` | python/python/lance/dataset.py:6345-6410 | Remove fragments or rows from the dataset. |
| `class LanceOperation.Update(BaseOperation)` | python/python/lance/dataset.py:6413-6460 | Operation that updates rows in the dataset. |
| `class LanceOperation.Merge(BaseOperation)` | python/python/lance/dataset.py:6463-6537 | Operation that adds columns. Unlike Overwrite, this should not change the structure of the fragments, allowing existing indices to be kept. |
| `class LanceOperation.Restore(BaseOperation)` | python/python/lance/dataset.py:6540-6545 | Operation that restores a previous version of the dataset. |
| `class LanceOperation.Clone(BaseOperation)` | python/python/lance/dataset.py:6548-6577 | Operation that creates a clone or branch from a dataset reference. |
| `class LanceOperation.RewriteGroup()` | python/python/lance/dataset.py:6580-6586 | Collection of rewritten files |
| `class LanceOperation.RewrittenIndex()` | python/python/lance/dataset.py:6589-6598 | An index that has been rewritten |
| `class LanceOperation.Rewrite(BaseOperation)` | python/python/lance/dataset.py:6601-6624 | Operation that rewrites one or more files and indices into one or more files and indices. |
| `class LanceOperation.CreateIndex(BaseOperation)` | python/python/lance/dataset.py:6627-6633 | Operation that creates an index on the dataset. |
| `class LanceOperation.DataReplacementGroup()` | python/python/lance/dataset.py:6636-6642 | Group of data replacements |
| `class LanceOperation.DataReplacement(BaseOperation)` | python/python/lance/dataset.py:6645-6650 | Operation that replaces existing datafiles in the dataset. |
| `class LanceOperation.DataOverlayFile()` | python/python/lance/dataset.py:6653-6692 | An overlay file supplying new values for a subset of ``(physical offset, field)`` cells of a fragment, resolved on read and layered over the base data without rewriting the base files. |
| `class LanceOperation.DataOverlayGroup()` | python/python/lance/dataset.py:6695-6709 | Overlay files to append to a single fragment. |
| `class LanceOperation.DataOverlay(BaseOperation)` | python/python/lance/dataset.py:6712-6724 | Operation that appends data overlay files to fragments. |
| `class LanceOperation.Project(BaseOperation)` | python/python/lance/dataset.py:6727-6769 | Operation that project columns. Use this operator for drop column or rename/swap column. |
| `class LanceOperation.UpdateMap()` | python/python/lance/dataset.py:6772-6786 | Represents updates to a metadata map. |
| `class LanceOperation.UpdateConfig(BaseOperation)` | python/python/lance/dataset.py:6789-6814 | Operation that updates dataset metadata. |
| `class ColumnOrdering()` | python/python/lance/dataset.py:6818-6827 | This class is used to define the column ordering rules for the `sort` operator. It allows users to specify the sorting order (ascending or descending) and the position of null values (first or last). |
| `serialize_row_addrs(addrs: Iterable[int]) -&gt; bytes` | python/python/lance/dataset.py:6887-6896 | Encode row addresses for ``row_addr_allowlist`` / ``row_addr_blocklist``. |
| `class ScannerBuilder()` | python/python/lance/dataset.py:6899-7440 | No standalone documentation summary; use the family contract and source entry. |
| `ScannerBuilder.__init__(self, ds: LanceDataset)` | python/python/lance/dataset.py:6900-6935 | No standalone documentation summary; use the family contract and source entry. |
| `ScannerBuilder.apply_defaults(self, default_opts: Dict[str, Any]) -&gt; ScannerBuilder` | python/python/lance/dataset.py:6937-6946 | No standalone documentation summary; use the family contract and source entry. |
| `ScannerBuilder.batch_size(self, batch_size: int) -&gt; ScannerBuilder` | python/python/lance/dataset.py:6948-6955 | Set the maximum number of rows per batch. |
| `ScannerBuilder.batch_size_bytes(self, batch_size_bytes: int) -&gt; ScannerBuilder` | python/python/lance/dataset.py:6957-6969 | Set the target batch size in bytes. |
| `ScannerBuilder.io_buffer_size(self, io_buffer_size: int) -&gt; ScannerBuilder` | python/python/lance/dataset.py:6971-6991 | Set the I/O buffer size for the Scanner |
| `ScannerBuilder.batch_readahead(self, nbatches: Optional[int]=None) -&gt; ScannerBuilder` | python/python/lance/dataset.py:6993-7002 | Set the maximum number of batches to decode concurrently. |
| `ScannerBuilder.fragment_readahead(self, nfragments: Optional[int]=None) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7004-7008 | No standalone documentation summary; use the family contract and source entry. |
| `ScannerBuilder.scan_in_order(self, scan_in_order: bool=True) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7010-7023 | Whether to scan the dataset in order of fragments and batches. |
| `ScannerBuilder.limit(self, n: Optional[int]=None) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7025-7029 | No standalone documentation summary; use the family contract and source entry. |
| `ScannerBuilder.offset(self, n: Optional[int]=None) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7031-7035 | No standalone documentation summary; use the family contract and source entry. |
| `ScannerBuilder.columns(self, cols: Optional[Union[List[str], Dict[str, str]]]=None) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7037-7050 | No standalone documentation summary; use the family contract and source entry. |
| `ScannerBuilder.filter(self, filter: Union[str, pa.compute.Expression, FullTextQuery, VectorSearchQuery, dict]) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7052-7085 | Add a filter to the scanner. |
| `ScannerBuilder.row_addr_prefilter(self, allowlist: Optional[bytes]=None, blocklist: Optional[bytes]=None) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7087-7104 | Restrict the scan to an externally supplied set of row addresses. |
| `ScannerBuilder.prefilter(self, prefilter: bool) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7106-7108 | No standalone documentation summary; use the family contract and source entry. |
| `ScannerBuilder.with_row_id(self, with_row_id: bool=True) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7110-7113 | Enable returns with row IDs. |
| `ScannerBuilder.with_row_address(self, with_row_address: bool=True) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7115-7126 | Enables returns with row addresses. |
| `ScannerBuilder.late_materialization(self, late_materialization: bool \| List[str]) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7128-7132 | No standalone documentation summary; use the family contract and source entry. |
| `ScannerBuilder.blob_handling(self, blob_handling: Optional[str]) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7134-7146 | No standalone documentation summary; use the family contract and source entry. |
| `ScannerBuilder.use_stats(self, use_stats: bool=True) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7148-7156 | Enable use of statistics for query planning. |
| `ScannerBuilder.use_scalar_index(self, use_scalar_index: bool=True) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7158-7167 | Set whether scalar indices should be used in a query |
| `ScannerBuilder.with_fragments(self, fragments: Optional[Iterable[LanceFragment]]) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7169-7185 | No standalone documentation summary; use the family contract and source entry. |
| `ScannerBuilder.with_index_segments(self, index_segments: Optional[Iterable[Union[str, uuid.UUID]]]) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7187-7191 | No standalone documentation summary; use the family contract and source entry. |
| `ScannerBuilder.nearest(self, column: str, q: QueryVectorLike, k: Optional[int]=None, metric: Optional[str]=None, nprobes: Optional[int]=None, minimum_nprobes: Optional[int]=None, maximum_nprobes: Optional[int]=None, refine_factor: Optional[int]=None, use_index: bool=True, ef: Optional[int]=None, query_parallelism: Optional[int]=None, approx_mode: Literal['fast', 'normal', 'accurate']='normal', distance_range: Optional[tuple[Optional[float], Optional[float]]]=None, search_effort: Optional[float]=None) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7193-7265 | Configure nearest neighbor search. |
| `ScannerBuilder.fast_search(self, flag: bool) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7267-7274 | Enable fast search, which only performs search on indexed fragments. |
| `ScannerBuilder.include_deleted_rows(self, flag: bool) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7276-7283 | Include deleted rows |
| `ScannerBuilder.full_text_search(self, query: str \| FullTextQuery, columns: Optional[List[str]]=None) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7285-7312 | Filter rows by full text searching. *Experimental API*, may remove it after we support to do this within `filter` SQL-like expression |
| `ScannerBuilder.minhash_search(self, query: MinHashQuery) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7314-7339 | Find the rows most similar to ``query.text`` using the MinHash LSH index on ``query.column``. |
| `ScannerBuilder.scan_stats_callback(self, callback: Callable[[ScanStatistics], None]) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7341-7350 | Set a callback function that will be called with the scan statistics after the scan is complete. Errors raised by the callback will be logged but not re-raised. |
| `ScannerBuilder.strict_batch_size(self, strict_batch_size: bool=False) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7352-7365 | If True, then all batches except the last batch will have exactly `batch_size` rows. By default, it is false. If this is true then small batches will need to be merged together which will require a data copy and incur a (typically very small) performance penalty. |
| `ScannerBuilder.order_by(self, orderings: Optional[list[ColumnOrdering]]) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7367-7380 | No standalone documentation summary; use the family contract and source entry. |
| `ScannerBuilder.disable_scoring_autoprojection(self, disable: bool=True) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7382-7384 | No standalone documentation summary; use the family contract and source entry. |
| `ScannerBuilder.substrait_aggregate(self, aggregate: bytes) -&gt; ScannerBuilder` | python/python/lance/dataset.py:7386-7401 | Set a Substrait aggregate expression for the scanner. |
| `ScannerBuilder.to_scanner(self) -&gt; LanceScanner` | python/python/lance/dataset.py:7403-7440 | No standalone documentation summary; use the family contract and source entry. |
| `class LanceScanner(pa.dataset.Scanner)` | python/python/lance/dataset.py:7443-7638 | No standalone documentation summary; use the family contract and source entry. |
| `LanceScanner.__init__(self, scanner: _Scanner, dataset: LanceDataset, snapshot: Optional[Dict[str, Any]]=None)` | python/python/lance/dataset.py:7444-7452 | No standalone documentation summary; use the family contract and source entry. |
| `LanceScanner.to_table(self) -&gt; pa.Table` | python/python/lance/dataset.py:7454-7458 | Read the data into memory and return a pyarrow Table. |
| `LanceScanner.to_reader(self) -&gt; pa.RecordBatchReader` | python/python/lance/dataset.py:7460-7461 | No standalone documentation summary; use the family contract and source entry. |
| `LanceScanner.to_batches(self) -&gt; Iterator[RecordBatch]` | python/python/lance/dataset.py:7463-7464 | No standalone documentation summary; use the family contract and source entry. |
| `LanceScanner.to_pandas(self, *, blob_mode: str=_BLOB_PANDAS_MODE_LAZY, **kwargs: Any) -&gt; 'pd.DataFrame'` | python/python/lance/dataset.py:7466-7524 | Read the scan results into a :py:class:`pandas.DataFrame`. |
| `LanceScanner.projected_schema(self) -&gt; Schema` | python/python/lance/dataset.py:7527-7528 | No standalone documentation summary; use the family contract and source entry. |
| `LanceScanner.from_dataset(*args, **kwargs)` | python/python/lance/dataset.py:7531-7535 | Not implemented |
| `LanceScanner.from_fragment(*args, **kwargs)` | python/python/lance/dataset.py:7538-7542 | Not implemented |
| `LanceScanner.from_batches(*args, **kwargs)` | python/python/lance/dataset.py:7545-7549 | Not implemented |
| `LanceScanner.dataset_schema(self) -&gt; Schema` | python/python/lance/dataset.py:7552-7554 | The schema with which batches will be read from fragments. |
| `LanceScanner.scan_batches(self)` | python/python/lance/dataset.py:7556-7572 | Consume a Scanner in record batches with corresponding fragments. |
| `LanceScanner.take(self, indices)` | python/python/lance/dataset.py:7574-7578 | Not implemented |
| `LanceScanner.head(self, num_rows)` | python/python/lance/dataset.py:7580-7593 | Load the first N rows of the dataset. |
| `LanceScanner.count_rows(self) -&gt; int` | python/python/lance/dataset.py:7595-7603 | Count rows matching the scanner filter. |
| `LanceScanner.explain_plan(self, verbose=False) -&gt; str` | python/python/lance/dataset.py:7605-7618 | Return the execution plan for this scanner. |
| `LanceScanner.analyze_plan(self, count_rows: bool=False) -&gt; str` | python/python/lance/dataset.py:7620-7638 | Execute the plan for this scanner and display with runtime metrics. |
| `class DatasetOptimizer()` | python/python/lance/dataset.py:7641-7867 | No standalone documentation summary; use the family contract and source entry. |
| `DatasetOptimizer.__init__(self, dataset: LanceDataset)` | python/python/lance/dataset.py:7642-7643 | No standalone documentation summary; use the family contract and source entry. |
| `DatasetOptimizer.compact_files(self, *, target_rows_per_fragment: Optional[int]=None, max_rows_per_group: Optional[int]=None, max_bytes_per_file: Optional[int]=None, materialize_deletions: Optional[bool]=None, materialize_deletions_threshold: Optional[float]=None, defer_index_remap: Optional[bool]=None, num_threads: Optional[int]=None, batch_size: Optional[int]=None, compaction_mode: Optional[Literal['reencode', 'try_binary_copy', 'force_binary_copy']]=None, binary_copy_read_batch_bytes: Optional[int]=None, max_source_fragments: Optional[int]=None, max_source_rows: Optional[int]=None, max_source_bytes: Optional[int]=None, excluded_fragment_ids: Optional[list[int]]=None, data_storage_version: Optional[str]=None) -&gt; CompactionMetrics` | python/python/lance/dataset.py:7645-7811 | Compacts small files in the dataset, reducing total number of files. |
| `DatasetOptimizer.optimize_indices(self, **kwargs) -&gt; None` | python/python/lance/dataset.py:7813-7844 | Optimizes index performance. |
| `DatasetOptimizer.enable_auto_cleanup(self, auto_cleanup_config: AutoCleanupConfig, **kwargs)` | python/python/lance/dataset.py:7846-7861 | Enable autocleaning for an existing dataset. |
| `DatasetOptimizer.disable_auto_cleanup(self, **kwargs)` | python/python/lance/dataset.py:7863-7867 | Disable autocleaning via delete related keys. |
| `class Tags()` | python/python/lance/dataset.py:7870-7994 | Dataset tag manager. |
| `Tags.__init__(self, dataset: _Dataset)` | python/python/lance/dataset.py:7875-7876 | No standalone documentation summary; use the family contract and source entry. |
| `Tags.list(self) -&gt; dict[str, Tag]` | python/python/lance/dataset.py:7878-7889 | List all dataset tags. |
| `Tags.get_version(self, tag: str) -&gt; int` | python/python/lance/dataset.py:7891-7910 | Get the version of a specific tag by name. |
| `Tags.list_ordered(self, order: Optional[str]=None) -&gt; List[Tuple[str, Tag]]` | python/python/lance/dataset.py:7912-7928 | List all dataset tags. |
| `Tags.create(self, tag: str, reference: Optional[int \| str \| Tuple[Optional[str], Optional[int]]]=None) -&gt; None` | python/python/lance/dataset.py:7930-7950 | Create a tag for a given dataset version. |
| `Tags.delete(self, tag: str) -&gt; None` | python/python/lance/dataset.py:7952-7962 | Delete tag from the dataset. |
| `Tags.update(self, tag: str, reference: Optional[int \| str \| Tuple[Optional[str], Optional[int]]]=None) -&gt; None` | python/python/lance/dataset.py:7964-7983 | Update tag to a new version. |
| `Tags.replace_metadata(self, tag: str, metadata: Dict[str, str]) -&gt; None` | python/python/lance/dataset.py:7985-7994 | Replace metadata for an existing tag. |
| `class Branches()` | python/python/lance/dataset.py:7997-8032 | Dataset branch manager. |
| `Branches.__init__(self, dataset: _Dataset)` | python/python/lance/dataset.py:8002-8003 | No standalone documentation summary; use the family contract and source entry. |
| `Branches.list(self) -&gt; dict[str, Branch]` | python/python/lance/dataset.py:8005-8014 | List all dataset branches. |
| `Branches.list_ordered(self, order: Optional[str]=None) -&gt; List[Tuple[str, Branch]]` | python/python/lance/dataset.py:8016-8020 | List all dataset branches ordered by parent version. |
| `Branches.delete(self, branch: str) -&gt; None` | python/python/lance/dataset.py:8022-8026 | Delete a branch. |
| `Branches.replace_metadata(self, branch: str, metadata: Dict[str, str]) -&gt; None` | python/python/lance/dataset.py:8028-8032 | Replace metadata for a branch. |
| `class FieldStatistics()` | python/python/lance/dataset.py:8036-8040 | Statistics about a field in the dataset |
| `class DataStatistics()` | python/python/lance/dataset.py:8044-8047 | Statistics about the data in the dataset |
| `class DatasetStats(TypedDict)` | python/python/lance/dataset.py:8050-8053 | No standalone documentation summary; use the family contract and source entry. |
| `class LanceStats()` | python/python/lance/dataset.py:8056-8090 | Statistics about a LanceDataset. |
| `LanceStats.__init__(self, dataset: _Dataset)` | python/python/lance/dataset.py:8061-8062 | No standalone documentation summary; use the family contract and source entry. |
| `LanceStats.dataset_stats(self, max_rows_per_group: int=1024) -&gt; DatasetStats` | python/python/lance/dataset.py:8064-8072 | Statistics about the dataset. |
| `LanceStats.index_stats(self, index_name: str) -&gt; Dict[str, Any]` | python/python/lance/dataset.py:8074-8084 | Statistics about an index. |
| `LanceStats.data_stats(self) -&gt; DataStatistics` | python/python/lance/dataset.py:8086-8090 | Statistics about the data in the dataset. |
| `write_dataset(data_obj: ReaderLike, uri: Optional[Union[str, Path, LanceDataset]]=None, schema: Optional[pa.Schema]=None, mode: str='create', *, max_rows_per_file: int=1024 * 1024, max_rows_per_group: int=1024, max_bytes_per_file: int=90 * 1024 * 1024 * 1024, data_cache_bytes: Optional[int]=None, max_page_bytes: Optional[int]=None, commit_lock: Optional[CommitLock]=None, progress: Optional[FragmentWriteProgress]=None, storage_options: Optional[Dict[str, str]]=None, data_storage_version: Optional[Literal['stable', '2.0', '2.1', '2.2', '2.3', 'next', 'legacy', '0.1']]=None, use_legacy_format: Optional[bool]=None, enable_v2_manifest_paths: bool=True, enable_stable_row_ids: bool=False, auto_cleanup_options: Optional[AutoCleanupConfig]=None, commit_message: Optional[str]=None, transaction_properties: Optional[Dict[str, str]]=None, initial_bases: Optional[List[DatasetBasePath]]=None, target_bases: Optional[List[str]]=None, target_all_bases: Optional[bool]=None, base_store_params: Optional[Dict[str, Dict[str, str]]]=None, external_blob_mode: Literal['reference', 'ingest']='reference', allow_external_blob_outside_bases: bool=False, blob_pack_file_size_threshold: Optional[int]=None, namespace_client: Optional[LanceNamespace]=None, table_id: Optional[List[str]]=None, session: Optional[Session]=None) -&gt; LanceDataset` | python/python/lance/dataset.py:8093-8432 | Write a given data_obj to the given uri |
| `class VectorIndexReader()` | python/python/lance/dataset.py:8698-8787 | This class allows you to initialize a reader for a specific vector index, retrieve the number of partitions, and read specific partitions of the index. |
| `VectorIndexReader.__init__(self, dataset: LanceDataset, index_name: str)` | python/python/lance/dataset.py:8736-8744 | No standalone documentation summary; use the family contract and source entry. |
| `VectorIndexReader.num_partitions(self) -&gt; int` | python/python/lance/dataset.py:8746-8756 | Returns the number of partitions in the dataset. |
| `VectorIndexReader.read_partition(self, partition_id: int, *, with_vector: bool=False) -&gt; pa.Table` | python/python/lance/dataset.py:8758-8787 | Returns a pyarrow table for the given IVF partition |
| `class VectorSearchQuery()` | python/python/lance/dataset.py:8790-8833 | Vector search parameters, including continuous ``search_effort`` in [0, 1]. |
| `VectorSearchQuery.__init__(self, column: str, q: QueryVectorLike, k: Optional[int]=None, metric: Optional[str]=None, nprobes: Optional[int]=None, minimum_nprobes: Optional[int]=None, maximum_nprobes: Optional[int]=None, refine_factor: Optional[int]=None, use_index: bool=True, ef: Optional[int]=None, query_parallelism: Optional[int]=None, approx_mode: Literal['fast', 'normal', 'accurate']='normal', search_effort: Optional[float]=None)` | python/python/lance/dataset.py:8800-8830 | No standalone documentation summary; use the family contract and source entry. |
| `VectorSearchQuery.inner(self)` | python/python/lance/dataset.py:8832-8833 | No standalone documentation summary; use the family contract and source entry. |


<a id="source-python-python-lance-dependencies-py"></a>

## `python/python/lance/dependencies.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `model_to_dict(obj: Any) -&gt; dict[str, Any]` | python/python/lance/dependencies.py:238-239 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-python-python-lance-download-py"></a>

## `python/python/lance/download.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `check_lindera()` | python/python/lance/download.py:37-41 | No standalone documentation summary; use the family contract and source entry. |
| `import_requests()` | python/python/lance/download.py:44-49 | No standalone documentation summary; use the family contract and source entry. |
| `download_jieba()` | python/python/lance/download.py:52-69 | No standalone documentation summary; use the family contract and source entry. |
| `download_lindera(lm: str)` | python/python/lance/download.py:72-105 | No standalone documentation summary; use the family contract and source entry. |
| `main()` | python/python/lance/download.py:108-121 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-python-python-lance-file-py"></a>

## `python/python/lance/file.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class ReaderResults()` | python/python/lance/file.py:33-56 | Utility class for converting results from Lance's internal format (RecordBatchReader) to a desired format such as a pyarrow Table, etc. |
| `ReaderResults.__init__(self, reader: pa.RecordBatchReader)` | python/python/lance/file.py:40-44 | Creates a new instance, not meant for external use |
| `ReaderResults.to_batches(self) -&gt; pa.RecordBatchReader` | python/python/lance/file.py:46-50 | Return the results as a pyarrow RecordBatchReader |
| `ReaderResults.to_table(self) -&gt; pa.Table` | python/python/lance/file.py:52-56 | Return the results as a pyarrow Table |
| `class LanceFileReader()` | python/python/lance/file.py:59-209 | A file reader for reading Lance files |
| `LanceFileReader.__init__(self, path: str, storage_options: Optional[Dict[str, str]]=None, columns: Optional[List[str]]=None, *, namespace_client: Optional['LanceNamespace']=None, table_id: Optional[List[str]]=None, _inner_reader: Optional[_LanceFileReader]=None)` | python/python/lance/file.py:68-111 | Creates a new file reader to read the given file |
| `LanceFileReader.read_all(self, *, batch_size: int=1024, batch_readahead=16) -&gt; ReaderResults` | python/python/lance/file.py:113-126 | Reads the entire file |
| `LanceFileReader.read_range(self, start: int, num_rows: int, *, batch_size: int=1024, batch_readahead=16) -&gt; ReaderResults` | python/python/lance/file.py:128-149 | Read a range of rows from the file |
| `LanceFileReader.take_rows(self, indices, *, batch_size: int=1024, batch_readahead=16) -&gt; ReaderResults` | python/python/lance/file.py:151-177 | Read a specific set of rows from the file |
| `LanceFileReader.metadata(self) -&gt; LanceFileMetadata` | python/python/lance/file.py:179-183 | Return metadata describing the file contents |
| `LanceFileReader.file_statistics(self) -&gt; LanceFileStatistics` | python/python/lance/file.py:185-189 | Return file statistics of the file |
| `LanceFileReader.read_global_buffer(self, index: int) -&gt; bytes` | python/python/lance/file.py:191-205 | Read a global buffer from the file at a given index |
| `LanceFileReader.num_rows(self) -&gt; int` | python/python/lance/file.py:207-209 | Return the number of rows belonging to the data file. |
| `class ListResult()` | python/python/lance/file.py:213-229 | Result of a non-recursive, delimited list (see :meth:`LanceFileSession.list_with_delimiter`). |
| `class LanceFileSession()` | python/python/lance/file.py:232-476 | A file session for reading and writing Lance files. |
| `LanceFileSession.__init__(self, base_path: str, storage_options: Optional[Dict[str, str]]=None, namespace_client: Optional['LanceNamespace']=None, table_id: Optional[List[str]]=None)` | python/python/lance/file.py:241-274 | Creates a new file session |
| `LanceFileSession.open_reader(self, path: str, columns: Optional[List[str]]=None) -&gt; LanceFileReader` | python/python/lance/file.py:276-287 | Opens a new reader for the given path |
| `LanceFileSession.open_writer(self, path: str, *, schema: Optional[pa.Schema]=None, data_cache_bytes: Optional[int]=None, version: Optional[str]=None, keep_original_array: Optional[bool]=None, max_page_bytes: Optional[int]=None) -&gt; 'LanceFileWriter'` | python/python/lance/file.py:289-335 | Opens a new writer for the given path (relative to this session's base path), reusing the session's underlying object store. |
| `LanceFileSession.open_packed_blob_writer(self, path: str, blob_id: int) -&gt; 'PackedBlobWriter'` | python/python/lance/file.py:337-343 | Opens a packed blob writer for the given data file path. |
| `LanceFileSession.open_dedicated_blob_writer(self, path: str, blob_id: int) -&gt; 'DedicatedBlobWriter'` | python/python/lance/file.py:345-353 | Opens a dedicated blob writer for the given data file path. |
| `LanceFileSession.contains(self, path: str) -&gt; bool` | python/python/lance/file.py:355-369 | Check if a file exists at the given path (relative to this session's base path). |
| `LanceFileSession.list(self, path: Optional[str]=None) -&gt; List[str]` | python/python/lance/file.py:371-386 | List all files at the given path (relative to this session's base path). |
| `LanceFileSession.list_with_delimiter(self, path: Optional[str]=None) -&gt; ListResult` | python/python/lance/file.py:388-409 | Non-recursively list a single directory level (relative to this session's base path). |
| `LanceFileSession.read_range(self, path: str, offset: int, length: int) -&gt; bytes` | python/python/lance/file.py:411-432 | Read a byte range from a file (relative to this session's base path). |
| `LanceFileSession.delete_file(self, path: str) -&gt; None` | python/python/lance/file.py:434-446 | Delete a file (relative to this session's base path). |
| `LanceFileSession.upload_file(self, local_path: Union[str, Path], remote_path: str) -&gt; None` | python/python/lance/file.py:448-461 | Upload a file from local filesystem to the object store. |
| `LanceFileSession.download_file(self, remote_path: str, local_path: Union[str, Path]) -&gt; None` | python/python/lance/file.py:463-476 | Download a file from object store to local filesystem. |
| `class LanceFileWriter()` | python/python/lance/file.py:479-629 | A file writer for writing Lance data files |
| `LanceFileWriter.__init__(self, path: str, schema: Optional[pa.Schema]=None, *, data_cache_bytes: Optional[int]=None, version: Optional[str]=None, storage_options: Optional[Dict[str, str]]=None, namespace_client: Optional['LanceNamespace']=None, table_id: Optional[List[str]]=None, max_page_bytes: Optional[int]=None, _inner_writer: Optional[_LanceFileWriter]=None, **kwargs)` | python/python/lance/file.py:494-559 | Create a new LanceFileWriter to write to the given path |
| `LanceFileWriter.write_batch(self, batch: Union[pa.RecordBatch, pa.Table]) -&gt; None` | python/python/lance/file.py:561-574 | Write a batch of data to the file |
| `LanceFileWriter.close(self) -&gt; Optional[int]` | python/python/lance/file.py:576-591 | Write the file metadata and close the file |
| `LanceFileWriter.add_schema_metadata(self, key: str, value: str) -&gt; None` | python/python/lance/file.py:593-605 | Add a metadata (key/value pair) entry to the schema. This method allows you to alter the schema metadata. It must be called before `close` is called. |
| `LanceFileWriter.add_global_buffer(self, data: bytes) -&gt; int` | python/python/lance/file.py:607-623 | Add a global buffer to the file. The global buffer can contain any arbitrary bytes. |

<a id="source-python-python-lance-fragment-py"></a>

## `python/python/lance/fragment.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class FragmentMetadata()` | python/python/lance/fragment.py:68-229 | Metadata for a fragment. |
| `FragmentMetadata.num_deletions(self) -&gt; int` | python/python/lance/fragment.py:116-121 | The number of rows that have been deleted from this fragment. |
| `FragmentMetadata.num_rows(self) -&gt; int` | python/python/lance/fragment.py:124-126 | The number of rows in this fragment after deletions. |
| `FragmentMetadata.data_files(self) -&gt; List[DataFile]` | python/python/lance/fragment.py:128-133 | No standalone documentation summary; use the family contract and source entry. |
| `FragmentMetadata.to_json(self) -&gt; dict` | python/python/lance/fragment.py:135-180 | Get this as a simple JSON-serializable dictionary. |
| `FragmentMetadata.from_json(json_data: str) -&gt; FragmentMetadata` | python/python/lance/fragment.py:183-229 | No standalone documentation summary; use the family contract and source entry. |
| `class DataFile()` | python/python/lance/fragment.py:233-342 | A data file in a fragment. |
| `DataFile.__init__(self, path: str, fields: List[int], column_indices: List[int]=None, file_major_version: int=0, file_minor_version: int=0, file_size_bytes: Optional[int]=None, base_id: Optional[int]=None)` | python/python/lance/fragment.py:262-279 | No standalone documentation summary; use the family contract and source entry. |
| `DataFile.path(self) -&gt; str` | python/python/lance/fragment.py:292-305 | No standalone documentation summary; use the family contract and source entry. |
| `DataFile.field_ids(self) -&gt; List[int]` | python/python/lance/fragment.py:307-312 | No standalone documentation summary; use the family contract and source entry. |
| `DataFile.create(cls, dataset: 'LanceDataset', path: str, *, base_id: Optional[int]=None) -&gt; 'DataFile'` | python/python/lance/fragment.py:315-342 | Create a DataFile by reading metadata from an existing lance file. |
| `class LanceFragment(pa.dataset.Fragment)` | python/python/lance/fragment.py:345-1165 | No standalone documentation summary; use the family contract and source entry. |
| `LanceFragment.__init__(self, dataset: 'LanceDataset', fragment_id: Optional[int], *, fragment: Optional[_Fragment]=None)` | python/python/lance/fragment.py:346-360 | No standalone documentation summary; use the family contract and source entry. |
| `LanceFragment.create_from_file(filename: str, dataset: LanceDataset, fragment_id: int) -&gt; FragmentMetadata` | python/python/lance/fragment.py:369-391 | Create a fragment from the given datafile uri. |
| `LanceFragment.create(dataset_uri: Union[str, Path], data: ReaderLike, fragment_id: Optional[int]=None, schema: Optional[pa.Schema]=None, max_rows_per_group: Optional[int]=1024, progress: Optional[FragmentWriteProgress]=None, mode: str='append', *, data_storage_version: Optional[str]=None, use_legacy_format: Optional[bool]=None, storage_options: Optional[Dict[str, str]]=None, namespace_client: Optional['LanceNamespace']=None, table_id: Optional[List[str]]=None, session: Optional[Session]=None) -&gt; FragmentMetadata` | python/python/lance/fragment.py:394-515 | Create a :class:`FragmentMetadata` from the given data. |
| `LanceFragment.fragment_id(self)` | python/python/lance/fragment.py:518-519 | No standalone documentation summary; use the family contract and source entry. |
| `LanceFragment.count_rows(self, filter: Optional[Union[Expression, str]]=None) -&gt; int` | python/python/lance/fragment.py:521-526 | No standalone documentation summary; use the family contract and source entry. |
| `LanceFragment.num_deletions(self) -&gt; int` | python/python/lance/fragment.py:529-531 | Return the number of deleted rows in this fragment. |
| `LanceFragment.physical_rows(self) -&gt; int` | python/python/lance/fragment.py:534-541 | Return the number of rows originally in this fragment. |
| `LanceFragment.validate(self) -&gt; None` | python/python/lance/fragment.py:543-551 | Validate the fragment. |
| `LanceFragment.physical_schema(self) -&gt; pa.Schema` | python/python/lance/fragment.py:554-556 | No standalone documentation summary; use the family contract and source entry. |
| `LanceFragment.partition_expression(self) -&gt; pa.Schema` | python/python/lance/fragment.py:559-561 | No standalone documentation summary; use the family contract and source entry. |
| `LanceFragment.head(self, num_rows: int) -&gt; pa.Table` | python/python/lance/fragment.py:563-564 | No standalone documentation summary; use the family contract and source entry. |
| `LanceFragment.scanner(self, *, columns: Optional[Union[List[str], Dict[str, str]]]=None, batch_size: Optional[int]=None, filter: Optional[Union[str, Expression]]=None, limit: Optional[int]=None, offset: Optional[int]=None, with_row_id: bool=False, with_row_address: bool=False, batch_readahead: int=16, blob_handling: Optional[Literal['all_binary', 'blobs_descriptions', 'all_descriptions']]=None, order_by: Optional[List[ColumnOrdering]]=None, use_scalar_index: Optional[bool]=None, io_buffer_size: Optional[int]=None, late_materialization: Optional[bool \| List[str]]=None, include_deleted_rows: Optional[bool]=None, batch_size_bytes: Optional[int]=None, strict_batch_size: Optional[bool]=None) -&gt; 'LanceScanner'` | python/python/lance/fragment.py:566-660 | See Dataset::scanner for details |
| `LanceFragment.open_session(self, columns: Optional[Union[List[str], Dict[str, str]]]=None, with_row_address: Optional[bool]=None) -&gt; 'FragmentSession'` | python/python/lance/fragment.py:662-682 | Open a FragmentSession, which manages a short-lived session of LanceFragment. This API works well for users making repeated requests over the same columns. |
| `LanceFragment.take(self, indices, columns: Optional[Union[List[str], Dict[str, str]]]=None) -&gt; pa.Table` | python/python/lance/fragment.py:684-689 | No standalone documentation summary; use the family contract and source entry. |
| `LanceFragment.to_batches(self, *, columns: Optional[Union[List[str], Dict[str, str]]]=None, batch_size: Optional[int]=None, filter: Optional[Union[str, Expression]]=None, limit: Optional[int]=None, offset: Optional[int]=None, with_row_id: bool=False, with_row_address: bool=False, batch_readahead: int=16, blob_handling: Optional[Literal['all_binary', 'blobs_descriptions', 'all_descriptions']]=None, order_by: Optional[List[ColumnOrdering]]=None, use_scalar_index: Optional[bool]=None, io_buffer_size: Optional[int]=None, late_materialization: Optional[bool \| List[str]]=None, include_deleted_rows: Optional[bool]=None, batch_size_bytes: Optional[int]=None, strict_batch_size: Optional[bool]=None) -&gt; Iterator[pa.RecordBatch]` | python/python/lance/fragment.py:691-730 | No standalone documentation summary; use the family contract and source entry. |
| `LanceFragment.to_table(self, columns: Optional[Union[List[str], Dict[str, str]]]=None, filter: Optional[Union[str, Expression]]=None, limit: Optional[int]=None, offset: Optional[int]=None, with_row_id: bool=False, with_row_address: bool=False, blob_handling: Optional[Literal['all_binary', 'blobs_descriptions', 'all_descriptions']]=None, order_by: Optional[List[ColumnOrdering]]=None, use_scalar_index: Optional[bool]=None, io_buffer_size: Optional[int]=None, late_materialization: Optional[bool \| List[str]]=None, include_deleted_rows: Optional[bool]=None, batch_size_bytes: Optional[int]=None, strict_batch_size: Optional[bool]=None) -&gt; pa.Table` | python/python/lance/fragment.py:732-766 | No standalone documentation summary; use the family contract and source entry. |
| `LanceFragment.to_pandas(self, columns: Optional[Union[List[str], Dict[str, str]]]=None, filter: Optional[Union[str, Expression]]=None, limit: Optional[int]=None, offset: Optional[int]=None, batch_size: Optional[int]=None, with_row_id: bool=False, with_row_address: bool=False, blob_mode: str='lazy', order_by: Optional[List[ColumnOrdering]]=None, **kwargs: Any) -&gt; Any` | python/python/lance/fragment.py:768-809 | Read this fragment into a :py:class:`pandas.DataFrame`. |
| `LanceFragment.merge(self, data_obj: ReaderLike, left_on: str, right_on: Optional[str]=None, schema=None) -&gt; Tuple[FragmentMetadata, LanceSchema]` | python/python/lance/fragment.py:811-880 | Merge another dataset into this fragment. |
| `LanceFragment.update_columns(self, data_obj: ReaderLike, left_on: str='_rowid', right_on: Optional[str]=None, schema=None, *, with_offsets: Literal[False]=False) -&gt; Tuple[FragmentMetadata, List[int]]` | python/python/lance/fragment.py:883-891 | No standalone documentation summary; use the family contract and source entry. |
| `LanceFragment.update_columns(self, data_obj: ReaderLike, left_on: str='_rowid', right_on: Optional[str]=None, schema=None, *, with_offsets: Literal[True]) -&gt; Tuple[FragmentMetadata, List[int], bytes]` | python/python/lance/fragment.py:894-902 | No standalone documentation summary; use the family contract and source entry. |
| `LanceFragment.update_columns(self, data_obj: ReaderLike, left_on: str='_rowid', right_on: Optional[str]=None, schema=None, *, with_offsets: bool=False) -&gt; Union[Tuple[FragmentMetadata, List[int]], Tuple[FragmentMetadata, List[int], bytes]]` | python/python/lance/fragment.py:904-1021 | Update existing columns in this fragment. |
| `LanceFragment.merge_columns(self, value_func: Dict[str, str] \| BatchUDF \| ReaderLike \| Callable[[pa.RecordBatch], pa.RecordBatch], columns: Optional[list[str]]=None, batch_size: Optional[int]=None, reader_schema: Optional[pa.Schema]=None) -&gt; Tuple[FragmentMetadata, LanceSchema]` | python/python/lance/fragment.py:1023-1078 | Add columns to this Fragment. |
| `LanceFragment.delete(self, predicate: str) -&gt; FragmentMetadata \| None` | python/python/lance/fragment.py:1080-1122 | Delete rows from this Fragment. |
| `LanceFragment.delete_rows(self, offsets: 'Iterable[int]') -&gt; FragmentMetadata \| None` | python/python/lance/fragment.py:1124-1140 | Delete rows by their local (within-fragment) physical row offsets. |
| `LanceFragment.schema(self) -&gt; pa.Schema` | python/python/lance/fragment.py:1143-1146 | Return the schema of this fragment. |
| `LanceFragment.data_files(self) -&gt; List[DataFile]` | python/python/lance/fragment.py:1148-1151 | Return the data files of this fragment. |
| `LanceFragment.deletion_file(self) -&gt; Optional[str]` | python/python/lance/fragment.py:1153-1155 | Return the deletion file, if any |
| `LanceFragment.metadata(self) -&gt; FragmentMetadata` | python/python/lance/fragment.py:1158-1165 | Return the metadata of this fragment. |
| `write_fragments(data: ReaderLike, dataset_uri: Union[str, Path, LanceDataset], schema: Optional[pa.Schema]=None, *, return_transaction: bool=False, mode: str='append', max_rows_per_file: int=1024 * 1024, max_rows_per_group: Optional[int]=1024, max_bytes_per_file: int=DEFAULT_MAX_BYTES_PER_FILE, data_cache_bytes: Optional[int]=None, max_page_bytes: Optional[int]=None, progress: Optional[FragmentWriteProgress]=None, data_storage_version: Optional[str]=None, use_legacy_format: Optional[bool]=None, storage_options: Optional[Dict[str, str]]=None, enable_stable_row_ids: bool=False, target_bases: Optional[List[str]]=None, target_all_bases: Optional[bool]=None, initial_bases: Optional[List['DatasetBasePath']]=None, base_store_params: Optional[Dict[str, Dict[str, str]]]=None, external_blob_mode: Literal['reference', 'ingest']='reference', allow_external_blob_outside_bases: bool=False, namespace_client: Optional[LanceNamespace]=None, table_id: Optional[List[str]]=None, session: Optional[Session]=None) -&gt; List[FragmentMetadata] \| Transaction` | python/python/lance/fragment.py:1229-1456 | Write data into one or more fragments. |
| `class FragmentSession()` | python/python/lance/fragment.py:1459-1476 | No standalone documentation summary; use the family contract and source entry. |
| `FragmentSession.__init__(self, session)` | python/python/lance/fragment.py:1460-1461 | No standalone documentation summary; use the family contract and source entry. |
| `FragmentSession.take(self, indices)` | python/python/lance/fragment.py:1463-1476 | Take rows from this fragment based on the offset in the fragment. |

<a id="source-python-python-lance-hf-py"></a>

## `python/python/lance/hf.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class HuggingFaceConverter()` | python/python/lance/hf.py:14-43 | Utility class for from PyArrow RecordBatch to Huggingface internal Type |
| `HuggingFaceConverter.__init__(self, ds_info: dict[str, Any])` | python/python/lance/hf.py:19-21 | Create HuggingFaceConverter from Huggingface dataset info |
| `HuggingFaceConverter.to_pytorch(self, col: str, array: pa.Array) -&gt; Optional[Union['torch.Tensor', list['PIL.Image.Image']]]` | python/python/lance/hf.py:31-43 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-python-python-lance-indices-init-py"></a>

## `python/python/lance/indices/__init__.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class IndexFileVersion(str, Enum)` | python/python/lance/indices/__init__.py:25-27 | No standalone documentation summary; use the family contract and source entry. |
| `class SupportedDistributedIndices(str, Enum)` | python/python/lance/indices/__init__.py:30-41 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-python-python-lance-indices-builder-py"></a>

## `python/python/lance/indices/builder.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class IndicesBuilder()` | python/python/lance/indices/builder.py:26-632 | A class with helper functions for building indices on a dataset. |
| `IndicesBuilder.__init__(self, dataset, column: str)` | python/python/lance/indices/builder.py:43-61 | Create an index builder for the given vector column |
| `IndicesBuilder.train_ivf(self, num_partitions=None, *, distance_type='l2', accelerator: Optional[Union[str, 'torch.Device']]=None, sample_rate: int=256, max_iters: int=50, fragment_ids: Optional[list[int]]=None) -&gt; IvfModel` | python/python/lance/indices/builder.py:63-158 | Train IVF centroids for the given vector column. |
| `IndicesBuilder.train_pq(self, ivf_model: IvfModel, num_subvectors=None, *, sample_rate: int=256, max_iters: int=50, num_bits: int=8, fragment_ids: Optional[list[int]]=None) -&gt; PqModel` | python/python/lance/indices/builder.py:160-222 | Train a PQ model for a given column. |
| `IndicesBuilder.prepare_global_ivf_pq(self, num_partitions: Optional[int], num_subvectors: Optional[int], *, distance_type: str='l2', accelerator: Optional[Union[str, 'torch.Device']]=None, sample_rate: int=256, max_iters: int=50, num_bits: int=8, fragment_ids: Optional[list[int]]=None) -&gt; dict` | python/python/lance/indices/builder.py:224-279 | Perform global training for IVF+PQ using existing CPU training paths and return preprocessed artifacts for distributed builds. |
| `IndicesBuilder.assign_ivf_partitions(self, ivf_model: IvfModel, accelerator: Union[str, 'torch.Device'], *, output_uri: Optional[str]=None) -&gt; str` | python/python/lance/indices/builder.py:281-334 | Calculates which IVF partition each vector belongs to. This searches the IVF centroids and assigns the closest centroid to the vector. The result is stored in a Lance dataset located at output_uri. The schema of the partition assignment dataset is: |
| `IndicesBuilder.transform_vectors(self, ivf: IvfModel, pq: PqModel, dest_uri: str, fragments: Optional[list['LanceFragment']]=None, partition_ds_uri: Optional[str]=None)` | python/python/lance/indices/builder.py:336-391 | Apply transformations to the vectors in the dataset and create an unsorted storage file. The unsorted storage file is a lance file that will at least have a row id column. Normally it will have other columns containing the transform outputs (such as partition id and PQ code) |
| `IndicesBuilder.shuffle_transformed_vectors(self, unsorted_filenames: list[str], dir_path: str, ivf: IvfModel, shuffle_output_root_filename: Optional[str]='sorted') -&gt; list[str]` | python/python/lance/indices/builder.py:393-434 | Take the transformed, unsorted vector files as input, and create sorted storage files. Sorting is done based on the partition id. This function only makes sense if the transformed vector file contains a partition_id column. |
| `IndicesBuilder.load_shuffled_vectors(self, filenames: list[str], dir_path: str, ivf: IvfModel, pq: PqModel, index_name: Optional[str]=None)` | python/python/lance/indices/builder.py:436-484 | Takes filenames of the sorted, transformed vector files as input. Loads these sorted files and commits the index into the dataset. |
| `class IndexConfig()` | python/python/lance/indices/builder.py:636-638 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-python-python-lance-indices-ivf-py"></a>

## `python/python/lance/indices/ivf.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class IvfModel()` | python/python/lance/indices/ivf.py:11-74 | A class that represents a trained IVF model. |
| `IvfModel.__init__(self, centroids: pa.Array, distance_type: str)` | python/python/lance/indices/ivf.py:16-20 | No standalone documentation summary; use the family contract and source entry. |
| `IvfModel.num_partitions(self) -&gt; int` | python/python/lance/indices/ivf.py:23-27 | The number of partitions / centroids in the IVF model |
| `IvfModel.save(self, uri: str, *, storage_options: Optional[Dict[str, str]]=None)` | python/python/lance/indices/ivf.py:29-51 | Save the IVF model to a lance file. |
| `IvfModel.load(cls, uri: str, *, storage_options: Optional[Dict[str, str]]=None)` | python/python/lance/indices/ivf.py:54-74 | Load an IVF model from a lance file. |

<a id="source-python-python-lance-indices-pq-py"></a>

## `python/python/lance/indices/pq.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class PqModel()` | python/python/lance/indices/pq.py:11-81 | A class that represents a Product Quantization model. |
| `PqModel.__init__(self, num_subvectors: int, codebook: pa.FixedSizeListArray, *, num_bits: int=8)` | python/python/lance/indices/pq.py:17-25 | No standalone documentation summary; use the family contract and source entry. |
| `PqModel.dimension(self)` | python/python/lance/indices/pq.py:28-30 | The dimension of the vectors this model was trained on |
| `PqModel.save(self, uri: str, *, storage_options: Optional[Dict[str, str]]=None)` | python/python/lance/indices/pq.py:32-57 | Save the PQ model to a lance file. |
| `PqModel.load(cls, uri: str, *, storage_options: Optional[Dict[str, str]]=None)` | python/python/lance/indices/pq.py:60-81 | Load a PQ model from a lance file. |

<a id="source-python-python-lance-log-py"></a>

## `python/python/lance/log.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `get_python_log_level(rust_log_level: str) -&gt; str` | python/python/lance/log.py:12-15 | No standalone documentation summary; use the family contract and source entry. |
| `get_log_level()` | python/python/lance/log.py:18-29 | No standalone documentation summary; use the family contract and source entry. |
| `set_logger(file_path: Optional[str]='pylance.log', name='pylance', level=logging.INFO, format_string=None, log_handler=None)` | python/python/lance/log.py:36-54 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-python-python-lance-mem-wal-py"></a>

## `python/python/lance/mem_wal.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class ShardingField()` | python/python/lance/mem_wal.py:59-83 | Defines one MemWAL sharding field. |
| `class ShardingSpec()` | python/python/lance/mem_wal.py:87-91 | Specification for deriving MemWAL shard routing values. |
| `evaluate_sharding_spec(batch: pa.RecordBatch, spec: Union[ShardingSpec, Mapping[str, object]], schema: 'lance.schema.LanceSchema') -&gt; pa.RecordBatch` | python/python/lance/mem_wal.py:94-117 | Evaluate a MemWAL sharding spec against one PyArrow RecordBatch. |
| `class CompactedSsTable()` | python/python/lance/mem_wal.py:127-143 | Points to an SSTable compacted into the base table. |
| `class ShardSnapshot()` | python/python/lance/mem_wal.py:146-179 | Snapshot of a MemWAL shard's state, used when constructing scanners. |
| `ShardSnapshot.__init__(self, shard_id: str) -&gt; None` | python/python/lance/mem_wal.py:155-156 | No standalone documentation summary; use the family contract and source entry. |
| `ShardSnapshot.shard_id(self) -&gt; str` | python/python/lance/mem_wal.py:159-161 | UUID string for this shard. |
| `ShardSnapshot.with_spec_id(self, spec_id: int) -&gt; 'ShardSnapshot'` | python/python/lance/mem_wal.py:163-166 | Set the sharding spec ID. |
| `ShardSnapshot.with_current_generation(self, generation: int) -&gt; 'ShardSnapshot'` | python/python/lance/mem_wal.py:168-171 | Set the current (active) generation number. |
| `ShardSnapshot.with_sstable(self, generation: int, path: str) -&gt; 'ShardSnapshot'` | python/python/lance/mem_wal.py:173-176 | Add an SSTable with its storage path. |
| `class ShardWriter()` | python/python/lance/mem_wal.py:182-317 | Stateful writer for one MemWAL shard. |
| `ShardWriter.__init__(self, _raw: _ShardWriter) -&gt; None` | python/python/lance/mem_wal.py:198-199 | No standalone documentation summary; use the family contract and source entry. |
| `ShardWriter.shard_id(self) -&gt; str` | python/python/lance/mem_wal.py:202-204 | UUID string for this writer's shard. |
| `ShardWriter.put(self, data, *, schema: Optional[pa.Schema]=None) -&gt; None` | python/python/lance/mem_wal.py:206-226 | Write data to the MemWAL. |
| `ShardWriter.delete(self, keys, *, schema: Optional[pa.Schema]=None) -&gt; None` | python/python/lance/mem_wal.py:228-256 | Delete rows by primary key from the MemWAL. |
| `ShardWriter.close(self) -&gt; None` | python/python/lance/mem_wal.py:258-264 | Flush and close the writer. |
| `ShardWriter.stats(self) -&gt; dict` | python/python/lance/mem_wal.py:266-277 | Return a snapshot of write statistics. |
| `ShardWriter.memtable_stats(self) -&gt; dict` | python/python/lance/mem_wal.py:279-288 | Return current MemTable statistics. |
| `ShardWriter.lsm_scanner(self, shard_snapshots: Optional[List[ShardSnapshot]]=None) -&gt; 'LsmScanner'` | python/python/lance/mem_wal.py:290-310 | Create an LSM scanner that includes the active MemTable. |
| `class LsmScanner()` | python/python/lance/mem_wal.py:320-404 | LSM-aware scanner covering all data levels. |
| `LsmScanner.__init__(self, _raw: _LsmScanner) -&gt; None` | python/python/lance/mem_wal.py:339-340 | No standalone documentation summary; use the family contract and source entry. |
| `LsmScanner.from_snapshots(dataset: 'lance.LanceDataset', shard_snapshots: List[ShardSnapshot]) -&gt; 'LsmScanner'` | python/python/lance/mem_wal.py:343-360 | Create a scanner from dataset and shard snapshots. |
| `LsmScanner.project(self, columns: List[str]) -&gt; 'LsmScanner'` | python/python/lance/mem_wal.py:362-365 | Select specific columns to return. |
| `LsmScanner.filter(self, expr: str) -&gt; 'LsmScanner'` | python/python/lance/mem_wal.py:367-370 | Set a SQL filter expression (e.g. ``"value &gt; 0.5"``). |
| `LsmScanner.limit(self, n: Optional[int]=None, offset: Optional[int]=None) -&gt; 'LsmScanner'` | python/python/lance/mem_wal.py:372-377 | Limit rows returned, optionally with an offset. |
| `LsmScanner.with_row_address(self) -&gt; 'LsmScanner'` | python/python/lance/mem_wal.py:379-382 | Include the ``_rowaddr`` internal column in results. |
| `LsmScanner.with_memtable_gen(self) -&gt; 'LsmScanner'` | python/python/lance/mem_wal.py:384-387 | Include the ``_memtable_gen`` internal column in results. |
| `LsmScanner.to_batch(self) -&gt; pa.RecordBatch` | python/python/lance/mem_wal.py:389-391 | Execute the scan and return a single merged :class:`~pyarrow.RecordBatch`. |
| `LsmScanner.to_batches(self) -&gt; List[pa.RecordBatch]` | python/python/lance/mem_wal.py:393-395 | Execute the scan and return a list of :class:`~pyarrow.RecordBatch`. |
| `LsmScanner.to_table(self) -&gt; pa.Table` | python/python/lance/mem_wal.py:397-400 | Execute the scan and return a :class:`~pyarrow.Table`. |
| `LsmScanner.count_rows(self) -&gt; int` | python/python/lance/mem_wal.py:402-404 | Return the row count without loading all column data. |
| `class ExecutionPlan()` | python/python/lance/mem_wal.py:407-445 | Executable physical plan returned by MemWAL planners. |
| `ExecutionPlan.__init__(self, _raw: _ExecutionPlan) -&gt; None` | python/python/lance/mem_wal.py:418-419 | No standalone documentation summary; use the family contract and source entry. |
| `ExecutionPlan.schema(self) -&gt; pa.Schema` | python/python/lance/mem_wal.py:422-424 | Output schema of this physical plan. |
| `ExecutionPlan.dataset_schema(self) -&gt; pa.Schema` | python/python/lance/mem_wal.py:427-429 | Base dataset schema used to construct this plan. |
| `ExecutionPlan.explain(self) -&gt; str` | python/python/lance/mem_wal.py:431-433 | Return the physical plan as an indented string. |
| `ExecutionPlan.to_reader(self) -&gt; pa.RecordBatchReader` | python/python/lance/mem_wal.py:435-437 | Execute the plan and return a streaming reader. |
| `ExecutionPlan.to_batches(self) -&gt; List[pa.RecordBatch]` | python/python/lance/mem_wal.py:439-441 | Execute the plan and return all record batches. |
| `ExecutionPlan.to_table(self) -&gt; pa.Table` | python/python/lance/mem_wal.py:443-445 | Execute the plan and return a table. |
| `class LsmPointLookupPlanner()` | python/python/lance/mem_wal.py:448-504 | Plans primary-key point lookups across all LSM levels. |
| `LsmPointLookupPlanner.__init__(self, dataset: 'lance.LanceDataset', shard_snapshots: List[ShardSnapshot], pk_columns: Optional[List[str]]=None) -&gt; None` | python/python/lance/mem_wal.py:470-480 | No standalone documentation summary; use the family contract and source entry. |
| `LsmPointLookupPlanner.plan_lookup(self, pk_value: pa.Array, columns: Optional[List[str]]=None) -&gt; ExecutionPlan` | python/python/lance/mem_wal.py:482-504 | Plan a point lookup by primary key value. |
| `class LsmVectorSearchPlanner()` | python/python/lance/mem_wal.py:507-619 | Plans IVF-PQ vector KNN search across all LSM levels. |
| `LsmVectorSearchPlanner.__init__(self, dataset: 'lance.LanceDataset', shard_snapshots: List[ShardSnapshot], vector_column: str, pk_columns: Optional[List[str]]=None, distance_type: Optional[str]=None, filter: Optional[str]=None) -&gt; None` | python/python/lance/mem_wal.py:539-560 | No standalone documentation summary; use the family contract and source entry. |
| `LsmVectorSearchPlanner.plan_search(self, query: pa.Array, k: int=10, nprobes: int=20, columns: Optional[List[str]]=None, refine_base_table: bool=False, overfetch_factor: float=1.0) -&gt; ExecutionPlan` | python/python/lance/mem_wal.py:562-619 | Plan a KNN vector search. |

<a id="source-python-python-lance-namespace-py"></a>

## `python/python/lance/namespace.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class DynamicContextProvider(ABC)` | python/python/lance/namespace.py:136-182 | Abstract base class for dynamic context providers. |
| `DynamicContextProvider.provide_context(self, info: Dict[str, str]) -&gt; Dict[str, str]` | python/python/lance/namespace.py:166-182 | Provide context for a namespace operation. |
| `class DirectoryNamespace(LanceNamespace)` | python/python/lance/namespace.py:269-918 | Directory-based Lance Namespace implementation backed by Rust. |
| `DirectoryNamespace.__init__(self, session=None, context_provider=None, **properties)` | python/python/lance/namespace.py:375-389 | No standalone documentation summary; use the family contract and source entry. |
| `DirectoryNamespace.namespace_id(self) -&gt; str` | python/python/lance/namespace.py:391-393 | Return a human-readable unique identifier for this namespace instance. |
| `DirectoryNamespace.create_namespace(self, request: CreateNamespaceRequest) -&gt; CreateNamespaceResponse` | python/python/lance/namespace.py:400-404 | No standalone documentation summary; use the family contract and source entry. |
| `DirectoryNamespace.list_namespaces(self, request: ListNamespacesRequest) -&gt; ListNamespacesResponse` | python/python/lance/namespace.py:406-408 | No standalone documentation summary; use the family contract and source entry. |
| `DirectoryNamespace.describe_namespace(self, request: DescribeNamespaceRequest) -&gt; DescribeNamespaceResponse` | python/python/lance/namespace.py:410-414 | No standalone documentation summary; use the family contract and source entry. |
| `DirectoryNamespace.drop_namespace(self, request: DropNamespaceRequest) -&gt; DropNamespaceResponse` | python/python/lance/namespace.py:416-418 | No standalone documentation summary; use the family contract and source entry. |
| `DirectoryNamespace.namespace_exists(self, request: NamespaceExistsRequest) -&gt; NamespaceExistsResponse` | python/python/lance/namespace.py:420-424 | No standalone documentation summary; use the family contract and source entry. |
| `DirectoryNamespace.list_tables(self, request: ListTablesRequest) -&gt; ListTablesResponse` | python/python/lance/namespace.py:428-430 | No standalone documentation summary; use the family contract and source entry. |
| `DirectoryNamespace.describe_table(self, request: DescribeTableRequest) -&gt; DescribeTableResponse` | python/python/lance/namespace.py:432-434 | No standalone documentation summary; use the family contract and source entry. |
| `DirectoryNamespace.register_table(self, request: RegisterTableRequest) -&gt; RegisterTableResponse` | python/python/lance/namespace.py:436-438 | No standalone documentation summary; use the family contract and source entry. |
| `DirectoryNamespace.table_exists(self, request: TableExistsRequest) -&gt; TableExistsResponse` | python/python/lance/namespace.py:440-442 | No standalone documentation summary; use the family contract and source entry. |
| `DirectoryNamespace.drop_table(self, request: DropTableRequest) -&gt; DropTableResponse` | python/python/lance/namespace.py:444-446 | No standalone documentation summary; use the family contract and source entry. |
| `DirectoryNamespace.deregister_table(self, request: DeregisterTableRequest) -&gt; DeregisterTableResponse` | python/python/lance/namespace.py:448-452 | No standalone documentation summary; use the family contract and source entry. |
| `DirectoryNamespace.create_table(self, request: CreateTableRequest, request_data: bytes) -&gt; CreateTableResponse` | python/python/lance/namespace.py:454-458 | No standalone documentation summary; use the family contract and source entry. |
| `DirectoryNamespace.declare_table(self, request: DeclareTableRequest) -&gt; DeclareTableResponse` | python/python/lance/namespace.py:460-462 | No standalone documentation summary; use the family contract and source entry. |
| `DirectoryNamespace.rename_table(self, request: RenameTableRequest) -&gt; RenameTableResponse` | python/python/lance/namespace.py:464-466 | No standalone documentation summary; use the family contract and source entry. |
| `DirectoryNamespace.list_table_versions(self, request: ListTableVersionsRequest) -&gt; ListTableVersionsResponse` | python/python/lance/namespace.py:470-474 | No standalone documentation summary; use the family contract and source entry. |
| `DirectoryNamespace.create_table_version(self, request: dict) -&gt; dict` | python/python/lance/namespace.py:476-494 | Create a table version (for external manifest store integration). |
| `DirectoryNamespace.describe_table_version(self, request: dict) -&gt; dict` | python/python/lance/namespace.py:496-512 | Describe a specific table version. |
| `DirectoryNamespace.batch_delete_table_versions(self, request: dict) -&gt; dict` | python/python/lance/namespace.py:514-530 | Delete multiple table versions in a single request. |
| `DirectoryNamespace.count_table_rows(self, request: CountTableRowsRequest) -&gt; CountTableRowsResponse` | python/python/lance/namespace.py:534-550 | Count the number of rows in a table, optionally filtered by a predicate. |
| `DirectoryNamespace.insert_into_table(self, request: InsertIntoTableRequest, request_data: bytes) -&gt; InsertIntoTableResponse` | python/python/lance/namespace.py:552-572 | Insert data into a table. |
| `DirectoryNamespace.merge_insert_into_table(self, request: MergeInsertIntoTableRequest, request_data: bytes) -&gt; MergeInsertIntoTableResponse` | python/python/lance/namespace.py:574-594 | Merge-insert data into a table (upsert operation). |
| `DirectoryNamespace.update_table(self, request: UpdateTableRequest) -&gt; UpdateTableResponse` | python/python/lance/namespace.py:596-610 | Update rows in a table matching a filter. |
| `DirectoryNamespace.delete_from_table(self, request: DeleteFromTableRequest) -&gt; DeleteFromTableResponse` | python/python/lance/namespace.py:612-628 | Delete rows from a table matching a filter. |
| `DirectoryNamespace.query_table(self, request) -&gt; QueryTableResponse` | python/python/lance/namespace.py:630-647 | Query a table and return results as Arrow IPC. |
| `DirectoryNamespace.create_table_index(self, request: CreateTableIndexRequest) -&gt; CreateTableIndexResponse` | python/python/lance/namespace.py:651-667 | Create an index on a table. |
| `DirectoryNamespace.list_table_indices(self, request: ListTableIndicesRequest) -&gt; ListTableIndicesResponse` | python/python/lance/namespace.py:669-685 | List all indices on a table. |
| `DirectoryNamespace.describe_table_index_stats(self, request: DescribeTableIndexStatsRequest) -&gt; DescribeTableIndexStatsResponse` | python/python/lance/namespace.py:687-703 | Get statistics for a specific index. |
| `DirectoryNamespace.describe_transaction(self, request: DescribeTransactionRequest) -&gt; DescribeTransactionResponse` | python/python/lance/namespace.py:707-723 | Describe a transaction. |
| `DirectoryNamespace.alter_transaction(self, request: AlterTransactionRequest) -&gt; AlterTransactionResponse` | python/python/lance/namespace.py:725-741 | Alter a transaction (commit or abort). |
| `DirectoryNamespace.create_table_scalar_index(self, request: CreateTableIndexRequest) -&gt; CreateTableIndexResponse` | python/python/lance/namespace.py:745-750 | Create a scalar index on a table column. |
| `DirectoryNamespace.drop_table_index(self, request: DropTableIndexRequest) -&gt; DropTableIndexResponse` | python/python/lance/namespace.py:752-757 | Drop an index from a table. |
| `DirectoryNamespace.list_all_tables(self, request: ListTablesRequest) -&gt; ListTablesResponse` | python/python/lance/namespace.py:761-764 | List all tables recursively across all namespaces. |
| `DirectoryNamespace.restore_table(self, request: RestoreTableRequest) -&gt; RestoreTableResponse` | python/python/lance/namespace.py:766-769 | Restore a previously dropped table. |
| `DirectoryNamespace.update_table_schema_metadata(self, request: UpdateTableSchemaMetadataRequest) -&gt; UpdateTableSchemaMetadataResponse` | python/python/lance/namespace.py:771-776 | Update the schema metadata of a table. |
| `DirectoryNamespace.get_table_stats(self, request: GetTableStatsRequest) -&gt; GetTableStatsResponse` | python/python/lance/namespace.py:778-781 | Get statistics for a table. |
| `DirectoryNamespace.explain_table_query_plan(self, request: ExplainTableQueryPlanRequest) -&gt; str` | python/python/lance/namespace.py:785-787 | Explain the query plan for a table query. |
| `DirectoryNamespace.analyze_table_query_plan(self, request: AnalyzeTableQueryPlanRequest) -&gt; str` | python/python/lance/namespace.py:789-791 | Analyze the query plan for a table query with execution statistics. |
| `DirectoryNamespace.alter_table_add_columns(self, request: AlterTableAddColumnsRequest) -&gt; AlterTableAddColumnsResponse` | python/python/lance/namespace.py:795-800 | Add columns to a table. |
| `DirectoryNamespace.alter_table_alter_columns(self, request: AlterTableAlterColumnsRequest) -&gt; AlterTableAlterColumnsResponse` | python/python/lance/namespace.py:802-807 | Alter existing columns in a table. |
| `DirectoryNamespace.alter_table_drop_columns(self, request: AlterTableDropColumnsRequest) -&gt; AlterTableDropColumnsResponse` | python/python/lance/namespace.py:809-814 | Drop columns from a table. |
| `DirectoryNamespace.alter_table_backfill_columns(self, request: AlterTableBackfillColumnsRequest) -&gt; AlterTableBackfillColumnsResponse` | python/python/lance/namespace.py:816-821 | Trigger an async backfill job for a computed column. |
| `DirectoryNamespace.refresh_materialized_view(self, request: RefreshMaterializedViewRequest) -&gt; RefreshMaterializedViewResponse` | python/python/lance/namespace.py:823-828 | Trigger an async materialized view refresh. |
| `DirectoryNamespace.create_materialized_view(self, request: CreateMaterializedViewRequest) -&gt; CreateMaterializedViewResponse` | python/python/lance/namespace.py:830-835 | Create a materialized view backed by an optional UDTF/chunker. |
| `DirectoryNamespace.list_table_tags(self, request: ListTableTagsRequest) -&gt; ListTableTagsResponse` | python/python/lance/namespace.py:839-842 | List all tags on a table. |
| `DirectoryNamespace.get_table_tag_version(self, request: GetTableTagVersionRequest) -&gt; GetTableTagVersionResponse` | python/python/lance/namespace.py:844-849 | Get the version associated with a table tag. |
| `DirectoryNamespace.create_table_tag(self, request: CreateTableTagRequest) -&gt; CreateTableTagResponse` | python/python/lance/namespace.py:851-856 | Create a new tag pointing to a table version. |
| `DirectoryNamespace.delete_table_tag(self, request: DeleteTableTagRequest) -&gt; DeleteTableTagResponse` | python/python/lance/namespace.py:858-863 | Delete a tag from a table. |
| `DirectoryNamespace.update_table_tag(self, request: UpdateTableTagRequest) -&gt; UpdateTableTagResponse` | python/python/lance/namespace.py:865-870 | Update a tag to point to a different version. |
| `DirectoryNamespace.create_table_branch(self, request: CreateTableBranchRequest) -&gt; CreateTableBranchResponse` | python/python/lance/namespace.py:872-877 | Create a new branch forked from a table version. |
| `DirectoryNamespace.list_table_branches(self, request: ListTableBranchesRequest) -&gt; ListTableBranchesResponse` | python/python/lance/namespace.py:879-884 | List all branches of a table. |
| `DirectoryNamespace.delete_table_branch(self, request: DeleteTableBranchRequest) -&gt; DeleteTableBranchResponse` | python/python/lance/namespace.py:886-891 | Delete a branch from a table. |
| `DirectoryNamespace.retrieve_ops_metrics(self) -&gt; Dict[str, int]` | python/python/lance/namespace.py:895-910 | Retrieve operation metrics as a dictionary. |
| `DirectoryNamespace.reset_ops_metrics(self) -&gt; None` | python/python/lance/namespace.py:912-918 | Reset all operation metrics counters to zero. |
| `class RestNamespace(LanceNamespace)` | python/python/lance/namespace.py:921-1517 | REST-based Lance Namespace implementation backed by Rust. |
| `RestNamespace.__init__(self, context_provider=None, **properties)` | python/python/lance/namespace.py:968-988 | No standalone documentation summary; use the family contract and source entry. |
| `RestNamespace.namespace_id(self) -&gt; str` | python/python/lance/namespace.py:990-992 | Return a human-readable unique identifier for this namespace instance. |
| `RestNamespace.create_namespace(self, request: CreateNamespaceRequest) -&gt; CreateNamespaceResponse` | python/python/lance/namespace.py:999-1003 | No standalone documentation summary; use the family contract and source entry. |
| `RestNamespace.list_namespaces(self, request: ListNamespacesRequest) -&gt; ListNamespacesResponse` | python/python/lance/namespace.py:1005-1007 | No standalone documentation summary; use the family contract and source entry. |
| `RestNamespace.describe_namespace(self, request: DescribeNamespaceRequest) -&gt; DescribeNamespaceResponse` | python/python/lance/namespace.py:1009-1013 | No standalone documentation summary; use the family contract and source entry. |
| `RestNamespace.drop_namespace(self, request: DropNamespaceRequest) -&gt; DropNamespaceResponse` | python/python/lance/namespace.py:1015-1017 | No standalone documentation summary; use the family contract and source entry. |
| `RestNamespace.namespace_exists(self, request: NamespaceExistsRequest) -&gt; NamespaceExistsResponse` | python/python/lance/namespace.py:1019-1023 | No standalone documentation summary; use the family contract and source entry. |
| `RestNamespace.list_tables(self, request: ListTablesRequest) -&gt; ListTablesResponse` | python/python/lance/namespace.py:1027-1029 | No standalone documentation summary; use the family contract and source entry. |
| `RestNamespace.describe_table(self, request: DescribeTableRequest) -&gt; DescribeTableResponse` | python/python/lance/namespace.py:1031-1033 | No standalone documentation summary; use the family contract and source entry. |
| `RestNamespace.register_table(self, request: RegisterTableRequest) -&gt; RegisterTableResponse` | python/python/lance/namespace.py:1035-1037 | No standalone documentation summary; use the family contract and source entry. |
| `RestNamespace.table_exists(self, request: TableExistsRequest) -&gt; TableExistsResponse` | python/python/lance/namespace.py:1039-1041 | No standalone documentation summary; use the family contract and source entry. |
| `RestNamespace.drop_table(self, request: DropTableRequest) -&gt; DropTableResponse` | python/python/lance/namespace.py:1043-1045 | No standalone documentation summary; use the family contract and source entry. |
| `RestNamespace.deregister_table(self, request: DeregisterTableRequest) -&gt; DeregisterTableResponse` | python/python/lance/namespace.py:1047-1051 | No standalone documentation summary; use the family contract and source entry. |
| `RestNamespace.create_table(self, request: CreateTableRequest, request_data: bytes) -&gt; CreateTableResponse` | python/python/lance/namespace.py:1053-1057 | No standalone documentation summary; use the family contract and source entry. |
| `RestNamespace.declare_table(self, request: DeclareTableRequest) -&gt; DeclareTableResponse` | python/python/lance/namespace.py:1059-1061 | No standalone documentation summary; use the family contract and source entry. |
| `RestNamespace.rename_table(self, request: RenameTableRequest) -&gt; RenameTableResponse` | python/python/lance/namespace.py:1063-1065 | No standalone documentation summary; use the family contract and source entry. |
| `RestNamespace.list_table_versions(self, request: ListTableVersionsRequest) -&gt; ListTableVersionsResponse` | python/python/lance/namespace.py:1069-1073 | No standalone documentation summary; use the family contract and source entry. |
| `RestNamespace.create_table_version(self, request: dict) -&gt; dict` | python/python/lance/namespace.py:1075-1093 | Create a table version (for external manifest store integration). |
| `RestNamespace.describe_table_version(self, request: dict) -&gt; dict` | python/python/lance/namespace.py:1095-1111 | Describe a specific table version. |
| `RestNamespace.batch_delete_table_versions(self, request: dict) -&gt; dict` | python/python/lance/namespace.py:1113-1129 | Delete multiple table versions in a single request. |
| `RestNamespace.count_table_rows(self, request: CountTableRowsRequest) -&gt; CountTableRowsResponse` | python/python/lance/namespace.py:1133-1149 | Count the number of rows in a table, optionally filtered by a predicate. |
| `RestNamespace.insert_into_table(self, request: InsertIntoTableRequest, request_data: bytes) -&gt; InsertIntoTableResponse` | python/python/lance/namespace.py:1151-1171 | Insert data into a table. |
| `RestNamespace.merge_insert_into_table(self, request: MergeInsertIntoTableRequest, request_data: bytes) -&gt; MergeInsertIntoTableResponse` | python/python/lance/namespace.py:1173-1193 | Merge-insert data into a table (upsert operation). |
| `RestNamespace.update_table(self, request: UpdateTableRequest) -&gt; UpdateTableResponse` | python/python/lance/namespace.py:1195-1209 | Update rows in a table matching a filter. |
| `RestNamespace.delete_from_table(self, request: DeleteFromTableRequest) -&gt; DeleteFromTableResponse` | python/python/lance/namespace.py:1211-1227 | Delete rows from a table matching a filter. |
| `RestNamespace.query_table(self, request) -&gt; QueryTableResponse` | python/python/lance/namespace.py:1229-1246 | Query a table and return results as Arrow IPC. |
| `RestNamespace.create_table_index(self, request: CreateTableIndexRequest) -&gt; CreateTableIndexResponse` | python/python/lance/namespace.py:1250-1266 | Create an index on a table. |
| `RestNamespace.list_table_indices(self, request: ListTableIndicesRequest) -&gt; ListTableIndicesResponse` | python/python/lance/namespace.py:1268-1284 | List all indices on a table. |
| `RestNamespace.describe_table_index_stats(self, request: DescribeTableIndexStatsRequest) -&gt; DescribeTableIndexStatsResponse` | python/python/lance/namespace.py:1286-1302 | Get statistics for a specific index. |
| `RestNamespace.describe_transaction(self, request: DescribeTransactionRequest) -&gt; DescribeTransactionResponse` | python/python/lance/namespace.py:1306-1322 | Describe a transaction. |
| `RestNamespace.alter_transaction(self, request: AlterTransactionRequest) -&gt; AlterTransactionResponse` | python/python/lance/namespace.py:1324-1340 | Alter a transaction (commit or abort). |
| `RestNamespace.create_table_scalar_index(self, request: CreateTableIndexRequest) -&gt; CreateTableIndexResponse` | python/python/lance/namespace.py:1344-1349 | Create a scalar index on a table column. |
| `RestNamespace.drop_table_index(self, request: DropTableIndexRequest) -&gt; DropTableIndexResponse` | python/python/lance/namespace.py:1351-1356 | Drop an index from a table. |
| `RestNamespace.list_all_tables(self, request: ListTablesRequest) -&gt; ListTablesResponse` | python/python/lance/namespace.py:1360-1363 | List all tables recursively across all namespaces. |
| `RestNamespace.restore_table(self, request: RestoreTableRequest) -&gt; RestoreTableResponse` | python/python/lance/namespace.py:1365-1368 | Restore a previously dropped table. |
| `RestNamespace.update_table_schema_metadata(self, request: UpdateTableSchemaMetadataRequest) -&gt; UpdateTableSchemaMetadataResponse` | python/python/lance/namespace.py:1370-1375 | Update the schema metadata of a table. |
| `RestNamespace.get_table_stats(self, request: GetTableStatsRequest) -&gt; GetTableStatsResponse` | python/python/lance/namespace.py:1377-1380 | Get statistics for a table. |
| `RestNamespace.explain_table_query_plan(self, request: ExplainTableQueryPlanRequest) -&gt; str` | python/python/lance/namespace.py:1384-1386 | Explain the query plan for a table query. |
| `RestNamespace.analyze_table_query_plan(self, request: AnalyzeTableQueryPlanRequest) -&gt; str` | python/python/lance/namespace.py:1388-1390 | Analyze the query plan for a table query with execution statistics. |
| `RestNamespace.alter_table_add_columns(self, request: AlterTableAddColumnsRequest) -&gt; AlterTableAddColumnsResponse` | python/python/lance/namespace.py:1394-1399 | Add columns to a table. |
| `RestNamespace.alter_table_alter_columns(self, request: AlterTableAlterColumnsRequest) -&gt; AlterTableAlterColumnsResponse` | python/python/lance/namespace.py:1401-1406 | Alter existing columns in a table. |
| `RestNamespace.alter_table_drop_columns(self, request: AlterTableDropColumnsRequest) -&gt; AlterTableDropColumnsResponse` | python/python/lance/namespace.py:1408-1413 | Drop columns from a table. |
| `RestNamespace.alter_table_backfill_columns(self, request: AlterTableBackfillColumnsRequest) -&gt; AlterTableBackfillColumnsResponse` | python/python/lance/namespace.py:1415-1420 | Trigger an async backfill job for a computed column. |
| `RestNamespace.refresh_materialized_view(self, request: RefreshMaterializedViewRequest) -&gt; RefreshMaterializedViewResponse` | python/python/lance/namespace.py:1422-1427 | Trigger an async materialized view refresh. |
| `RestNamespace.create_materialized_view(self, request: CreateMaterializedViewRequest) -&gt; CreateMaterializedViewResponse` | python/python/lance/namespace.py:1429-1434 | Create a materialized view backed by an optional UDTF/chunker. |
| `RestNamespace.list_table_tags(self, request: ListTableTagsRequest) -&gt; ListTableTagsResponse` | python/python/lance/namespace.py:1438-1441 | List all tags on a table. |
| `RestNamespace.get_table_tag_version(self, request: GetTableTagVersionRequest) -&gt; GetTableTagVersionResponse` | python/python/lance/namespace.py:1443-1448 | Get the version associated with a table tag. |
| `RestNamespace.create_table_tag(self, request: CreateTableTagRequest) -&gt; CreateTableTagResponse` | python/python/lance/namespace.py:1450-1455 | Create a new tag pointing to a table version. |
| `RestNamespace.delete_table_tag(self, request: DeleteTableTagRequest) -&gt; DeleteTableTagResponse` | python/python/lance/namespace.py:1457-1462 | Delete a tag from a table. |
| `RestNamespace.update_table_tag(self, request: UpdateTableTagRequest) -&gt; UpdateTableTagResponse` | python/python/lance/namespace.py:1464-1469 | Update a tag to point to a different version. |
| `RestNamespace.create_table_branch(self, request: CreateTableBranchRequest) -&gt; CreateTableBranchResponse` | python/python/lance/namespace.py:1471-1476 | Create a new branch forked from a table version. |
| `RestNamespace.list_table_branches(self, request: ListTableBranchesRequest) -&gt; ListTableBranchesResponse` | python/python/lance/namespace.py:1478-1483 | List all branches of a table. |
| `RestNamespace.delete_table_branch(self, request: DeleteTableBranchRequest) -&gt; DeleteTableBranchResponse` | python/python/lance/namespace.py:1485-1490 | Delete a branch from a table. |
| `RestNamespace.retrieve_ops_metrics(self) -&gt; Dict[str, int]` | python/python/lance/namespace.py:1494-1509 | Retrieve operation metrics as a dictionary. |
| `RestNamespace.reset_ops_metrics(self) -&gt; None` | python/python/lance/namespace.py:1511-1517 | Reset all operation metrics counters to zero. |
| `class RestAdapter()` | python/python/lance/namespace.py:1520-1617 | REST adapter server that creates a namespace backend and exposes it via REST. |
| `RestAdapter.__init__(self, namespace_client_impl: str, namespace_client_properties: Dict[str, str]=None, session=None, host: str=None, port: int=None)` | python/python/lance/namespace.py:1561-1588 | No standalone documentation summary; use the family contract and source entry. |
| `RestAdapter.port(self) -&gt; int` | python/python/lance/namespace.py:1591-1596 | Get the actual port the server is listening on. |
| `RestAdapter.start(self)` | python/python/lance/namespace.py:1598-1600 | Start the REST server in the background. |
| `RestAdapter.stop(self)` | python/python/lance/namespace.py:1602-1604 | Stop the REST server. |


<a id="source-python-python-lance-optimize-py"></a>

## `python/python/lance/optimize.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class CompactionOptions(TypedDict)` | python/python/lance/optimize.py:16-133 | Options for compaction. |

<a id="source-python-python-lance-otel-py"></a>

## `python/python/lance/otel.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `instrument_lance_metrics(meter_provider: Optional['MeterProvider']=None) -&gt; bool` | python/python/lance/otel.py:35-166 | Register Lance metrics as OpenTelemetry observable instruments. |

<a id="source-python-python-lance-progress-py"></a>

## `python/python/lance/progress.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class IndexProgress()` | python/python/lance/progress.py:20-51 | Progress event emitted while creating or merging an index. |
| `IndexProgress.fraction(self) -&gt; Optional[float]` | python/python/lance/progress.py:44-51 | Return fractional progress if both ``completed`` and ``total`` are known. |
| `class FragmentWriteProgress(ABC)` | python/python/lance/progress.py:54-105 | Progress tracking for Writing a Dataset or Fragment. |
| `FragmentWriteProgress.begin(self, fragment: 'FragmentMetadata', **kwargs) -&gt; None` | python/python/lance/progress.py:70-85 | Called when a new fragment is about to be written. |
| `FragmentWriteProgress.complete(self, fragment: 'FragmentMetadata', **kwargs) -&gt; None` | python/python/lance/progress.py:95-105 | Callback when a fragment is completely written. |
| `class NoopFragmentWriteProgress(FragmentWriteProgress)` | python/python/lance/progress.py:108-118 | No-op implementation of WriteProgressTracker. |
| `NoopFragmentWriteProgress.begin(self, fragment: 'FragmentMetadata', **kargs)` | python/python/lance/progress.py:114-115 | No standalone documentation summary; use the family contract and source entry. |
| `NoopFragmentWriteProgress.complete(self, fragment: 'FragmentMetadata', **kwargs)` | python/python/lance/progress.py:117-118 | No standalone documentation summary; use the family contract and source entry. |
| `class FileSystemFragmentWriteProgress(FragmentWriteProgress)` | python/python/lance/progress.py:121-186 | Progress tracking for Writing a Dataset or Fragment. |
| `FileSystemFragmentWriteProgress.__init__(self, base_uri: str, metadata: Optional[Dict[str, str]]=None)` | python/python/lance/progress.py:136-153 | Create a FileSystemFragmentWriteProgress tracker. |
| `FileSystemFragmentWriteProgress.begin(self, fragment: 'FragmentMetadata', **kwargs)` | python/python/lance/progress.py:163-182 | Called when a new fragment is created. |
| `FileSystemFragmentWriteProgress.complete(self, fragment: 'FragmentMetadata', **kwargs)` | python/python/lance/progress.py:184-186 | Called when a fragment is completed |

<a id="source-python-python-lance-pydantic-py"></a>

## `python/python/lance/pydantic.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class FixedSizeListMixin(ABC)` | python/python/lance/pydantic.py:39-48 | No standalone documentation summary; use the family contract and source entry. |
| `FixedSizeListMixin.dim() -&gt; int` | python/python/lance/pydantic.py:42-43 | No standalone documentation summary; use the family contract and source entry. |
| `FixedSizeListMixin.value_arrow_type() -&gt; pa.DataType` | python/python/lance/pydantic.py:47-48 | No standalone documentation summary; use the family contract and source entry. |
| `Vector(dim: int, value_type: pa.DataType=pa.float32(), nullable: bool=True) -&gt; Type[FixedSizeListMixin]` | python/python/lance/pydantic.py:51-114 | Pydantic type for a fixed-size-list embedding vector column. |
| `MultiVector(dim: int, value_type: pa.DataType=pa.float32(), nullable: bool=True) -&gt; Type[FixedSizeListMixin]` | python/python/lance/pydantic.py:117-195 | Pydantic type for a list of fixed-size-list embedding vectors. |
| `get_extras(field: Any, key: str) -&gt; Any` | python/python/lance/pydantic.py:208-214 | Get extra metadata (from `json_schema_extra`) off a pydantic field. |
| `is_nullable(field: Any) -&gt; bool` | python/python/lance/pydantic.py:344-384 | Check if a pydantic field (v1 ModelField or v2 FieldInfo) is nullable. |
| `pydantic_to_schema(model: Type[pydantic.BaseModel]) -&gt; pa.Schema` | python/python/lance/pydantic.py:393-434 | Convert a [Pydantic Model][pydantic.BaseModel] to a [PyArrow Schema][pyarrow.Schema]. |

<a id="source-python-python-lance-query-py"></a>

## `python/python/lance/query.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class FullTextQueryType(Enum)` | python/python/lance/query.py:13-19 | No standalone documentation summary; use the family contract and source entry. |
| `class FullTextOperator(Enum)` | python/python/lance/query.py:22-24 | No standalone documentation summary; use the family contract and source entry. |
| `class DocumentGranularity(str, Enum)` | python/python/lance/query.py:27-31 | The unit treated as one full-text-search document. |
| `class Occur(Enum)` | python/python/lance/query.py:34-37 | No standalone documentation summary; use the family contract and source entry. |
| `class FullTextQuery(abc.ABC)` | python/python/lance/query.py:40-96 | No standalone documentation summary; use the family contract and source entry. |
| `FullTextQuery.inner(self) -&gt; PyFullTextQuery` | python/python/lance/query.py:44-53 | Get the inner query object. |
| `FullTextQuery.query_type(self) -&gt; FullTextQueryType` | python/python/lance/query.py:56-64 | Get the query type of the query. |
| `class MatchQuery(FullTextQuery)` | python/python/lance/query.py:99-161 | No standalone documentation summary; use the family contract and source entry. |
| `MatchQuery.__init__(self, query: str, column: str, *, boost: float=1.0, fuzziness: int=0, max_expansions: int=50, operator: FullTextOperator=FullTextOperator.OR, prefix_length: int=0, document_granularity: Optional[DocumentGranularity]=None)` | python/python/lance/query.py:100-158 | Match query for full-text search. |
| `MatchQuery.query_type(self) -&gt; FullTextQueryType` | python/python/lance/query.py:160-161 | No standalone documentation summary; use the family contract and source entry. |
| `class PhraseQuery(FullTextQuery)` | python/python/lance/query.py:164-199 | No standalone documentation summary; use the family contract and source entry. |
| `PhraseQuery.__init__(self, query: str, column: str, *, slop: int=0, document_granularity: Optional[DocumentGranularity]=None)` | python/python/lance/query.py:165-196 | Phrase query for full-text search. |
| `PhraseQuery.query_type(self) -&gt; FullTextQueryType` | python/python/lance/query.py:198-199 | No standalone documentation summary; use the family contract and source entry. |
| `class BoostQuery(FullTextQuery)` | python/python/lance/query.py:202-227 | No standalone documentation summary; use the family contract and source entry. |
| `BoostQuery.__init__(self, positive: FullTextQuery, negative: FullTextQuery, *, negative_boost: float=0.5)` | python/python/lance/query.py:203-224 | Boost query for full-text search. |
| `BoostQuery.query_type(self) -&gt; FullTextQueryType` | python/python/lance/query.py:226-227 | No standalone documentation summary; use the family contract and source entry. |
| `class MultiMatchQuery(FullTextQuery)` | python/python/lance/query.py:230-264 | No standalone documentation summary; use the family contract and source entry. |
| `MultiMatchQuery.__init__(self, query: str, columns: list[str], *, boosts: Optional[list[float]]=None, operator: FullTextOperator=FullTextOperator.OR)` | python/python/lance/query.py:231-261 | Multi-match query for full-text search. |
| `MultiMatchQuery.query_type(self) -&gt; FullTextQueryType` | python/python/lance/query.py:263-264 | No standalone documentation summary; use the family contract and source entry. |
| `class CombinedFieldsQuery(FullTextQuery)` | python/python/lance/query.py:267-323 | No standalone documentation summary; use the family contract and source entry. |
| `CombinedFieldsQuery.__init__(self, query: str, columns: list[str], *, boosts: Optional[list[float]]=None, operator: FullTextOperator=FullTextOperator.OR)` | python/python/lance/query.py:268-320 | Combined-fields (BM25F) query for full-text search. |
| `CombinedFieldsQuery.query_type(self) -&gt; FullTextQueryType` | python/python/lance/query.py:322-323 | No standalone documentation summary; use the family contract and source entry. |
| `class BooleanQuery(FullTextQuery)` | python/python/lance/query.py:326-343 | No standalone documentation summary; use the family contract and source entry. |
| `BooleanQuery.__init__(self, queries: list[tuple[Occur, FullTextQuery]])` | python/python/lance/query.py:327-340 | Boolean query for full-text search. |
| `BooleanQuery.query_type(self) -&gt; FullTextQueryType` | python/python/lance/query.py:342-343 | No standalone documentation summary; use the family contract and source entry. |
| `class MinHashQuery()` | python/python/lance/query.py:347-371 | A MinHash similarity search over a column with a MinHash LSH index. |

<a id="source-python-python-lance-sampler-py"></a>

## `python/python/lance/sampler.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `maybe_sample(dataset: Union[str, Path, lance.LanceDataset], n: int, columns: Union[list[str], str], batch_size: int=10240, max_takes: int=2048, filt: Optional[str]=None) -&gt; Generator[pa.RecordBatch, None, None]` | python/python/lance/sampler.py:171-230 | Sample n records from the dataset. |
| `class PrioritizedItem(Generic[T])` | python/python/lance/sampler.py:237-239 | No standalone documentation summary; use the family contract and source entry. |
| `reservoir_sampling(stream: Iterable[T], k: int) -&gt; list[T]` | python/python/lance/sampler.py:242-257 | No standalone documentation summary; use the family contract and source entry. |
| `class Sampler(ABC)` | python/python/lance/sampler.py:260-280 | Sampler over LanceDataset. |
| `class FragmentSampler(Sampler)` | python/python/lance/sampler.py:283-317 | Sampling over Fragments. |
| `FragmentSampler.iter_fragments(self, ds: lance.LanceDataset, *args, **kwargs) -&gt; Generator[lance.LanceFragment, None, None]` | python/python/lance/sampler.py:313-317 | Iterate over data fragments. |
| `class FullScanSampler(FragmentSampler)` | python/python/lance/sampler.py:320-327 | Default Sampler, which scan the entire dataset sequentially. |
| `FullScanSampler.iter_fragments(self, dataset: lance.LanceDataset, **kwargs) -&gt; Generator[lance.LanceFragment, None, None]` | python/python/lance/sampler.py:323-327 | No standalone documentation summary; use the family contract and source entry. |
| `class ShardedFragmentSampler(FragmentSampler)` | python/python/lance/sampler.py:330-384 | Sharded fragments by rank and world_size. |
| `ShardedFragmentSampler.__init__(self, rank: int, world_size: int, randomize: bool=False, seed: int=0)` | python/python/lance/sampler.py:350-359 | No standalone documentation summary; use the family contract and source entry. |
| `ShardedFragmentSampler.set_epoch(self, epoch: int)` | python/python/lance/sampler.py:361-362 | No standalone documentation summary; use the family contract and source entry. |
| `ShardedFragmentSampler.from_torch(randomize: bool=False, seed: int=0) -&gt; ShardedFragmentSampler` | python/python/lance/sampler.py:365-374 | Use from a PyTorch distributed environment. |
| `ShardedFragmentSampler.iter_fragments(self, dataset: lance.LanceDataset, **kwargs) -&gt; Generator[lance.LanceFragment, None, None]` | python/python/lance/sampler.py:376-384 | No standalone documentation summary; use the family contract and source entry. |
| `class ShardedBatchSampler(Sampler)` | python/python/lance/sampler.py:387-577 | Sharded batch sampler. |
| `ShardedBatchSampler.__init__(self, rank: int, world_size: int, randomize: bool=False, seed: int=0)` | python/python/lance/sampler.py:409-416 | No standalone documentation summary; use the family contract and source entry. |
| `ShardedBatchSampler.set_epoch(self, epoch: int)` | python/python/lance/sampler.py:421-422 | No standalone documentation summary; use the family contract and source entry. |
| `ShardedBatchSampler.from_torch(randomize: bool=False, seed: int=0) -&gt; ShardedBatchSampler` | python/python/lance/sampler.py:425-434 | Use it from a PyTorch distributed environment. |
| `class ShardedFixedBatchSampler(ShardedBatchSampler)` | python/python/lance/sampler.py:580-670 | Sharded fixed batch sampler for distributed index-based batching. |
| `ShardedFixedBatchSampler.__init__(self, rank: int, world_size: int, randomize: bool=False, seed: int=0, batch_size: int=0, total_num_rows: int=0)` | python/python/lance/sampler.py:616-628 | No standalone documentation summary; use the family contract and source entry. |
| `ShardedFixedBatchSampler.from_torch(batch_size: int, total_num_rows: int, randomize: bool=False, seed: int=0) -&gt; ShardedFixedBatchSampler` | python/python/lance/sampler.py:661-670 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-python-python-lance-schema-py"></a>

## `python/python/lance/schema.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `schema_to_json(schema: pa.Schema) -&gt; Dict[str, Any]` | python/python/lance/schema.py:13-22 | Converts a pyarrow schema to a JSON-compatible dict. |
| `json_to_schema(schema_json: Dict[str, Any]) -&gt; pa.Schema` | python/python/lance/schema.py:25-34 | Converts a JSON-compatible dict to a PyArrow schema. |

<a id="source-python-python-lance-torch-init-py"></a>

## `python/python/lance/torch/__init__.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `preferred_device(device: Optional[str]=None)` | python/python/lance/torch/__init__.py:9-31 | Get the preferred device for computation. |

<a id="source-python-python-lance-torch-async-dataset-py"></a>

## `python/python/lance/torch/async_dataset.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class AsyncDataset(IterableDataset)` | python/python/lance/torch/async_dataset.py:37-77 | No standalone documentation summary; use the family contract and source entry. |
| `AsyncDataset.__init__(self, dataset_creator: Callable[[], IterableDataset], *, queue_size: int=4)` | python/python/lance/torch/async_dataset.py:38-48 | No standalone documentation summary; use the family contract and source entry. |
| `AsyncDataset.close(self)` | python/python/lance/torch/async_dataset.py:65-77 | No standalone documentation summary; use the family contract and source entry. |
| `async_dataset(dataset_creator: Callable[[], IterableDataset], *, queue_size: int=4) -&gt; Iterable[AsyncDataset]` | python/python/lance/torch/async_dataset.py:81-90 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-python-python-lance-torch-data-py"></a>

## `python/python/lance/torch/data.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class ToTensorFn(Protocol)` | python/python/lance/torch/data.py:44-52 | No standalone documentation summary; use the family contract and source entry. |
| `class TensorDataset(torch.utils.data.Dataset)` | python/python/lance/torch/data.py:190-217 | A PyTorch Dataset that wraps over a tensor, returns in batches. |
| `TensorDataset.__init__(self, data: Union[torch.Tensor, np.ndarray], batch_size: int, *args, **kwargs)` | python/python/lance/torch/data.py:197-204 | No standalone documentation summary; use the family contract and source entry. |
| `concat_batches(bs)` | python/python/lance/torch/data.py:220-227 | No standalone documentation summary; use the family contract and source entry. |
| `class LanceDataset(torch.utils.data.IterableDataset)` | python/python/lance/torch/data.py:253-467 | PyTorch :class:`torch.utils.data.IterableDataset` over lance dataset. |
| `LanceDataset.__init__(self, dataset: Union[torch.utils.data.Dataset, str, Path], batch_size: int, *args, dataset_options: Optional[Dict[str, Any]]=None, columns: Optional[Union[List[str], Dict[str, str]]]=None, filter: Optional[str]=None, samples: Optional[int]=0, cache: Optional[Union[str, bool]]=None, with_row_id: bool=False, rank: Optional[int]=None, world_size: Optional[int]=None, shard_granularity: Optional[Literal['fragment', 'batch']]=None, batch_readahead: int=16, to_tensor_fn: Optional[ToTensorFn]=_to_tensor, sampler: Optional[Sampler]=None, auto_detect_rank: bool=True, **kwargs)` | python/python/lance/torch/data.py:256-357 | Use PyTorch Dataset API to read Lance dataset. |
| `LanceDataset.schema(self) -&gt; pa.Schema` | python/python/lance/torch/data.py:363-367 | No standalone documentation summary; use the family contract and source entry. |
| `class SafeLanceDataset(torch.utils.data.Dataset)` | python/python/lance/torch/data.py:470-508 | No standalone documentation summary; use the family contract and source entry. |
| `SafeLanceDataset.__init__(self, uri, *, dataset_options=None, **kwargs)` | python/python/lance/torch/data.py:471-476 | No standalone documentation summary; use the family contract and source entry. |
| `get_safe_loader(dataset, batch_size=32, num_workers=4, **kwargs)` | python/python/lance/torch/data.py:511-539 | Create a DataLoader with safe multiprocessing defaults |

<a id="source-python-python-lance-torch-dist-py"></a>

## `python/python/lance/torch/dist.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `get_dist_world_size() -&gt; int` | python/python/lance/torch/dist.py:10-20 | Get the number of processes in the distributed training setup. |
| `get_dist_rank() -&gt; int` | python/python/lance/torch/dist.py:23-33 | Get the rank of the current process in the distributed training setup. |
| `get_mp_world_size() -&gt; int` | python/python/lance/torch/dist.py:36-46 | Get the number of worker processes for the current DataLoader. |
| `get_mp_rank() -&gt; int` | python/python/lance/torch/dist.py:49-59 | Get the rank of the current DataLoader worker process. |
| `get_global_world_size() -&gt; int` | python/python/lance/torch/dist.py:62-69 | Get the global world size across distributed and multiprocessing contexts. |
| `get_global_rank() -&gt; int` | python/python/lance/torch/dist.py:72-80 | Get the global rank of the current process across distributed and multiprocessing contexts. |

<a id="source-python-python-lance-torch-distance-py"></a>

## `python/python/lance/torch/distance.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pairwise_cosine(x: torch.Tensor, y: torch.Tensor, *, y2: Optional[torch.Tensor]=None) -&gt; torch.Tensor` | python/python/lance/torch/distance.py:26-48 | Compute pair-wise cosine distance between x and y. |
| `cosine_distance(vectors: torch.Tensor, centroids: torch.Tensor) -&gt; Tuple[torch.Tensor, torch.Tensor]` | python/python/lance/torch/distance.py:83-113 | Cosine pair-wise distances between two 2-D Tensors. |
| `argmin_l2(x: torch.Tensor, y: torch.Tensor) -&gt; Tuple[torch.Tensor, torch.Tensor]` | python/python/lance/torch/distance.py:117-124 | No standalone documentation summary; use the family contract and source entry. |
| `pairwise_l2(x: torch.Tensor, y: torch.Tensor, y2: Optional[torch.Tensor]=None) -&gt; torch.Tensor` | python/python/lance/torch/distance.py:128-170 | Compute pair-wise L2 distances between x and y. |
| `l2_distance(vectors: torch.Tensor, centroids: torch.Tensor, y2: Optional[torch.Tensor]=None) -&gt; Tuple[torch.Tensor, torch.Tensor]` | python/python/lance/torch/distance.py:204-237 | Pair-wise L2 / Euclidean distance between two 2-D Tensors. |
| `dot_distance(x: torch.Tensor, y: torch.Tensor) -&gt; Tuple[torch.Tensor, torch.Tensor]` | python/python/lance/torch/distance.py:241-266 | Pair-wise dot distance between two 2-D Tensors. |

<a id="source-python-python-lance-torch-kmeans-py"></a>

## `python/python/lance/torch/kmeans.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class KMeans()` | python/python/lance/torch/kmeans.py:26-305 | K-Means trains over vectors and divide into K clusters. |
| `KMeans.__init__(self, k: int, *, metric: MetricType='l2', init: Literal['random']='random', max_iters: int=50, tolerance: float=0.0001, centroids: Optional[torch.Tensor]=None, seed: Optional[int]=None, device: Optional[str]=None)` | python/python/lance/torch/kmeans.py:53-86 | No standalone documentation summary; use the family contract and source entry. |
| `KMeans.fit(self, data: Union[torch.utils.data.IterableDataset, np.ndarray, torch.Tensor, pa.FixedSizeListArray], column: Optional[str]=None) -&gt; None` | python/python/lance/torch/kmeans.py:126-170 | Fit - Train the kmeans model. |
| `KMeans.rebuild_index(self)` | python/python/lance/torch/kmeans.py:282-283 | No standalone documentation summary; use the family contract and source entry. |
| `KMeans.transform(self, data: Union[pa.Array, np.ndarray, torch.Tensor]) -&gt; torch.Tensor` | python/python/lance/torch/kmeans.py:298-305 | Transform the input data to cluster ids for each row. |

<a id="source-python-python-lance-tracing-py"></a>

## `python/python/lance/tracing.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `trace_to_chrome(*, file: Optional[str]=None)` | python/python/lance/tracing.py:19-36 | Begins tracing lance events to a chrome trace file. |
| `capture_trace_events(callback: Callable[[TraceEvent], None])` | python/python/lance/tracing.py:39-55 | Capture trace events and call the given callback with each event. |

<a id="source-python-python-lance-udf-py"></a>

## `python/python/lance/udf.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `class BatchUDF()` | python/python/lance/udf.py:27-67 | A user-defined function that can be passed to :meth:`LanceDataset.add_columns`. |
| `BatchUDF.__init__(self, func: Callable[[pa.RecordBatch], Any], output_schema: Optional[pa.Schema]=None, checkpoint_file: Optional[Union[str, Path]]=None) -&gt; None` | python/python/lance/udf.py:33-45 | No standalone documentation summary; use the family contract and source entry. |
| `batch_udf(output_schema: Optional[pa.Schema]=None, checkpoint_file: Optional[Union[str, Path]]=None) -&gt; Callable[[Callable[[pa.RecordBatch], Any]], BatchUDF]` | python/python/lance/udf.py:70-105 | Create a user defined function (UDF) that adds columns to a dataset. |
| `class BatchUDFCheckpoint()` | python/python/lance/udf.py:108-182 | A cache for BatchUDF results to avoid recomputation. |
| `class BatchUDFCheckpoint.BatchInfo(NamedTuple)` | python/python/lance/udf.py:114-116 | No standalone documentation summary; use the family contract and source entry. |
| `BatchUDFCheckpoint.__init__(self, path)` | python/python/lance/udf.py:118-137 | No standalone documentation summary; use the family contract and source entry. |
| `BatchUDFCheckpoint.cleanup(self)` | python/python/lance/udf.py:139-140 | No standalone documentation summary; use the family contract and source entry. |
| `BatchUDFCheckpoint.get_batch(self, info: BatchInfo) -&gt; Optional[pa.RecordBatch]` | python/python/lance/udf.py:142-151 | No standalone documentation summary; use the family contract and source entry. |
| `BatchUDFCheckpoint.insert_batch(self, info: BatchInfo, batch: pa.RecordBatch)` | python/python/lance/udf.py:153-160 | No standalone documentation summary; use the family contract and source entry. |
| `BatchUDFCheckpoint.get_fragment(self, fragment_id: int) -&gt; Optional[str]` | python/python/lance/udf.py:162-171 | Retrieves a fragment as a JSON string. |
| `BatchUDFCheckpoint.insert_fragment(self, fragment_id: int, fragment: str)` | python/python/lance/udf.py:173-182 | Save a JSON string of a fragment to the cache. |
| `normalize_transform(udf_like: Dict[str, str] \| BatchUDF \| ReaderLike, data_source: LanceDataset \| LanceFragment, read_columns: Optional[List[str]]=None, reader_schema: Optional[pa.Schema]=None)` | python/python/lance/udf.py:185-273 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-python-python-lance-util-py"></a>

## `python/python/lance/util.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `sanitize_ts(ts: ts_types) -&gt; datetime` | python/python/lance/util.py:41-56 | Returns a python datetime object from various timestamp input types. |
| `td_to_micros(td: timedelta) -&gt; int` | python/python/lance/util.py:59-61 | Returns the number of microseconds in a timedelta object. |
| `class KMeans()` | python/python/lance/util.py:87-201 | KMean model for clustering. |
| `KMeans.__init__(self, k: int, metric_type: MetricType='l2', max_iters: int=50, centroids: Optional[pa.FixedSizeListArray]=None)` | python/python/lance/util.py:111-136 | Create a KMeans model. |
| `KMeans.centroids(self) -&gt; Optional[pa.FixedShapeTensorArray]` | python/python/lance/util.py:142-154 | Returns the centroids of the model, |
| `KMeans.fit(self, data: Union[pa.FixedSizeListArray, 'pa.FixedShapeTensorArray', np.ndarray])` | python/python/lance/util.py:183-194 | Fit the model to the data. |
| `KMeans.predict(self, data: Union[pa.FixedSizeListArray, 'pa.FixedShapeTensorArray', np.ndarray]) -&gt; pa.UInt32Array` | python/python/lance/util.py:196-201 | Predict the cluster for each vector in the data. |
| `validate_vector_index(dataset, column: str, refine_factor: int=5, sample_size: Optional[int]=None, pass_threshold: float=1.0)` | python/python/lance/util.py:204-253 | Run in-sample queries and make sure that the recall for k=1 is very high (should be near 100%) |
| `class HNSW()` | python/python/lance/util.py:256-281 | No standalone documentation summary; use the family contract and source entry. |
| `HNSW.__init__(self, hnsw) -&gt; None` | python/python/lance/util.py:259-260 | No standalone documentation summary; use the family contract and source entry. |
| `HNSW.build(vectors_array: Iterator[pa.Array], max_level=7, m=20, ef_construction=100) -&gt; HNSW` | python/python/lance/util.py:263-275 | No standalone documentation summary; use the family contract and source entry. |
| `HNSW.to_lance_file(self, file_path)` | python/python/lance/util.py:277-278 | No standalone documentation summary; use the family contract and source entry. |
| `HNSW.vectors(self) -&gt; pa.Array` | python/python/lance/util.py:280-281 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-python-python-lance-vector-py"></a>

## `python/python/lance/vector.py`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `vec_to_table(data: Union[dict, list, np.ndarray], names: Optional[Union[str, list]]=None, ndim: Optional[int]=None, check_ndim: bool=True) -&gt; pa.Table` | python/python/lance/vector.py:48-129 | Create a pyarrow Table containing vectors. Vectors are created as FixedSizeListArray's in pyarrow with Float32 values. |
| `train_pq_codebook_on_accelerator(dataset: LanceDataset \| Path \| str, metric_type: MetricType, accelerator: Union[str, 'torch.Device'], num_sub_vectors: int, batch_size: int=1024 * 10 * 4, dtype: np.dtype=np.float32) -&gt; Tuple[np.ndarray, List[Any]]` | python/python/lance/vector.py:135-198 | Use accelerator (GPU or MPS) to train pq codebook. |
| `train_ivf_centroids_on_accelerator(dataset: LanceDataset, column: str, k: int, metric_type: MetricType, accelerator: Union[str, 'torch.Device'], batch_size: int=1024 * 10 * 4, *, sample_rate: int=256, max_iters: int=50, filter_nan: bool=True) -&gt; Tuple[np.ndarray, Any]` | python/python/lance/vector.py:228-301 | Use accelerator (GPU or MPS) to train kmeans. |
| `compute_pq_codes(dataset: LanceDataset, kmeans_list: List[Any], batch_size: int=1024 * 10 * 4, dst_dataset_uri: Optional[Union[str, Path]]=None, allow_cuda_tf32: bool=True) -&gt; Tuple[Union[str, Path], List[str]]` | python/python/lance/vector.py:304-420 | Compute pq codes for each row using GPU kmeans and spill to disk. |
| `compute_partitions(dataset: LanceDataset, column: str, kmeans: Any, batch_size: int=1024 * 10 * 4, dst_dataset_uri: Optional[Union[str, Path]]=None, allow_cuda_tf32: bool=True, num_sub_vectors: Optional[int]=None, filter_nan: bool=True, sample_size: Optional[int]=None) -&gt; str` | python/python/lance/vector.py:427-587 | Compute partitions for each row using GPU kmeans and spill to disk. |
| `one_pass_train_ivf_pq_on_accelerator(dataset: LanceDataset, column: str, k: int, metric_type: MetricType, accelerator: Union[str, 'torch.Device'], num_sub_vectors: int, batch_size: int=1024 * 10 * 4, *, sample_rate: int=256, max_iters: int=50, filter_nan: bool=True)` | python/python/lance/vector.py:590-628 | No standalone documentation summary; use the family contract and source entry. |
| `one_pass_assign_ivf_pq_on_accelerator(dataset: LanceDataset, column: str, metric_type: MetricType, accelerator: Union[str, 'torch.Device'], ivf_kmeans: Any, pq_kmeans_list: List[Any], dst_dataset_uri: Optional[Union[str, Path]]=None, batch_size: int=1024 * 10 * 4, *, filter_nan: bool=True, allow_cuda_tf32: bool=True)` | python/python/lance/vector.py:631-779 | Compute partitions for each row using GPU kmeans and spill to disk. |
| `find_duplicate_pairs(dataset: LanceDataset, column: str, distance_threshold: float, *, memory_limit: Optional[int]=None, max_concurrency: Optional[int]=None) -&gt; pa.RecordBatchReader` | python/python/lance/vector.py:787-871 | Stream embedding duplicate pairs from an existing vector index. |
| `find_duplicate_pairs_in_partition(dataset: LanceDataset, column: str, segment_id: Union[str, uuid.UUID], partition_id: int, distance_threshold: float, *, memory_limit: Optional[int]=None, max_concurrency: Optional[int]=None) -&gt; pa.RecordBatchReader` | python/python/lance/vector.py:874-916 | Stream duplicate pairs from one physical index segment and partition. |
| `hamming_clustering_for_ivf_partition(dataset: 'LanceDataset', index_name: str, partition_id: int, hamming_threshold: int, *, index_segments: Optional[Iterable[Union[str, uuid.UUID]]]=None) -&gt; pa.RecordBatchReader` | python/python/lance/vector.py:924-970 | Perform hamming clustering on a partition of an IVF_FLAT index. |
| `get_ivf_partition_info(dataset: 'LanceDataset', index_name: str, *, index_segments: Optional[Iterable[Union[str, uuid.UUID]]]=None) -&gt; List[dict]` | python/python/lance/vector.py:973-1002 | Get partition information for an IVF_FLAT index. |
| `hamming_clustering_for_sample(dataset: 'LanceDataset', column: str, sample_size: Optional[int]=None, hamming_threshold: int=10) -&gt; pa.RecordBatchReader` | python/python/lance/vector.py:1005-1040 | Perform pairwise hamming distance clustering on a sample of the dataset. |
| `hamming_clustering_for_range(dataset: 'LanceDataset', column: str, fragment_id: int, start_row: int, num_rows: int, hamming_threshold: int=10) -&gt; pa.RecordBatchReader` | python/python/lance/vector.py:1043-1087 | Perform pairwise hamming distance clustering on a contiguous range of rows. |


## get_version — 2026-10-09

Pin `db684d1f0726c00b6defb7963a604a7719e82b5a`. `LanceDataset.get_version`: `python/python/lance/dataset.py:3171-3194` → `python/src/dataset.rs:2149-2153`. [Contract](../refresh-2026-10-09.md#indexed-counting-and-public-apis).
