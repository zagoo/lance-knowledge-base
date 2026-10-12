> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen. Refresh 2026-10-12: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-12-011953c2.md) at `011953c22097b67b699595adbe99e7f0155d83e4` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/io/deletion.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `8ac13992c05b18149c0118a97ea7011813e0717c2e326d5813f5024b96074530`. Reviewed physical lines: 1-370.

[Module](../../../../../L1-modules/rust-lance-table-io.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Physical deletion-vector path construction, whole-object Arrow IPC/Roaring serialization and deserialization, audit tracing and local memory-store regression tests. Operates on u32 row offsets for caller-supplied fragment/base, not logical row IDs or transactional manifest publication. (rust/lance-table/src/io/deletion.rs:1-370)

## Complete range analysis

### Lines 1-24

SPDX/imports HashSet,Arc,LazyLock; Arrow UInt32Array/batches/IPC ZSTD reader-writer/schema errors; Bytes Buf; core errors/DeletionVector/audit labels; object store, Path, RNG, Roaring, Snafu and tracing. Existing HashSet use reflects actual implementation despite general repository preference for Roaring. No feature gate or per-module config declaration. (rust/lance-table/src/io/deletion.rs:1-24)

### Lines 25-35

Public DELETIONS_DIR exactly _deletions. Private LazyLock<SchemaRef> initializes one nonnullable UInt32 field named row_id. Despite name these values are physical offsets, not u64 stable IDs. Protobuf comment says Int32Array whereas implementation schema/array are UInt32 (protos/fragment_metadata.proto:251-268); preserve discrepancy, do not silently rewrite either contract. (rust/lance-table/src/io/deletion.rs:25-35)

### Lines 36-49

Public deletion_file_path(base,fragment_id,metadata) destructures read_version/random id/file_type, gets suffix arrow/bin and joins base/_deletions/{fragment}-{read_version}-{id}.{suffix}. Returns Path rooted at supplied base, despite doc saying relative to dataset root. Ignores num_deleted_rows and base_id; caller resolves external base/store. No validation or IO. (rust/lance-table/src/io/deletion.rs:36-49)

### Lines 50-60

Public relative_deletion_file_path creates exact relative String _deletions/{fragment}-{read_version}-{id}.{suffix}. Same metadata fields/suffix; supplied base not involved, base_id ignored. Used by contextual operation diagnostics, not independently a resolver. (rust/lance-table/src/io/deletion.rs:50-60)

### Lines 61-84

Public async write_deletion_file borrows base/DeletionVector/store, accepts u64 fragment/read version and returns Option<DeletionFile>. Match NoDeletions=>None without storage calls. Set arm generates random u64 id, Array metadata, Some(set.len()) and base_idNone, then builds path. It does not normalize Set(empty) to no file, check physical row bounds or reserve collision-free IDs; comment no deletions returnsNone is strictly the enum arm, not generic emptiness. (rust/lance-table/src/io/deletion.rs:61-84)

### Lines 85-110

Set write iterates HashSet in unspecified order into UInt32Array, Arc and one RecordBatch with fixed schema. Allocate full Vec<u8>; configure Arrow IPC default options with ZSTD, write one batch and finish IPC synchronously, drop writer to release Vec borrow, then await object_store.put. Successful put precedes create audit info and Some(metadata). Errors before put have no object effect; put error/cancellation outcome/cleanup depend on store. No explicit sorting, streaming, row validation or transaction commit here. (rust/lance-table/src/io/deletion.rs:85-110)

### Lines 111-134

Bitmap arm independently creates random ID and Bitmap metadata with len as usize, serializes Roaring directly into full Vec, awaits put and logs creation after success. Does not call run_optimize or add custom footer/compression framing. Empty bitmap is still written; no conversion based on density at this boundary. Serialization error propagates; metadata returned only after put succeeds. Both branches leave input vector borrowed/unchanged. (rust/lance-table/src/io/deletion.rs:111-134)

### Lines 135-161

Public async read_deletion_file debug instrumentation skips base/store arguments but explicitly records base and later bytes_read. Dispatch from metadata.file_type. Array path reads whole object, records raw byte count, wraps cursor, builds Arrow IPC reader and collects all batches before shape check. Batch iteration errors are boxed and reclassified CorruptFile(path); Arrow reader-construction error propagates through generic conversion, without this explicit path wrapper. Memory includes full bytes plus all decoded batches. (rust/lance-table/src/io/deletion.rs:135-161)

### Lines 162-183

Require exactly one decoded RecordBatch or CorruptFile including count. Pop unwrap is guarded by len1. Require exact schema equality with fixed LazyLock schema or contextual CorruptFile; equality includes field name/type/nullability and metadata, not only one integer column. This rejects signed Int32 even though protobuf comment uses it. No metadata.num_deleted_rows check is done. (rust/lance-table/src/io/deletion.rs:162-183)

### Lines 184-202

Access column0 and downcast UInt32 with unwrap after schema check. Allocate HashSet capacity equal array length; insert every Some value, deduplicating repeated offsets; any null returns CorruptFile(path). Return Set directly even if empty, with no density selection or normalization to NoDeletions. No fragment physical-row bound or count-versus-metadata validation; accepted values can span u32 domain. (rust/lance-table/src/io/deletion.rs:184-202)

### Lines 203-217

Bitmap path reads all bytes, records length, creates Bytes reader and calls Roaring deserialize_from. Decode failures boxed as CorruptFile(path); success returns Bitmap as read. Caller does not inspect remaining trailing bytes, optimize representation, verify metadata count or physical bounds. Whether decoder consumes/rejects extra bytes is dependency behavior, not checked by this function. No global cache here. (rust/lance-table/src/io/deletion.rs:203-217)

### Lines 218-236

Private cfg(test) imports parent and ObjectStoreExt. NoDeletions test constructs memory URI, writes fragment0/version0 and asserts returnedNone only. Does not list store to prove no object, or test empty Set/Bitmap. Tests were read, not executed. (rust/lance-table/src/io/deletion.rs:218-236)

### Lines 237-265

Array-write test starts explicit Set of0..100,fragment21,readversion12 at /write. Asserts Some(Array), metadata read_version and computed path /write/_deletions/21-12-{random}.arrow. Does not assert random uniqueness, num_deleted_rows, base_id or deterministic byte order. (rust/lance-table/src/io/deletion.rs:237-265)

### Lines 266-290

Array test GETs complete object, uses ArrowFileReader to collect, requires one batch and exact schema, downcasts named row_id, unwraps all values, builds DeletionVector::from_iter and compares set semantics to original. Reads Arrow independently of read_deletion_file, but performs no IPC compression-marker assertion or released-file compatibility check. (rust/lance-table/src/io/deletion.rs:266-290)

### Lines 291-332

Bitmap-write test explicit bitmap0..100,fragment21/version12 at /bitmap. Checks Bitmap variant/read version/exact .bin path, GETs bytes, deserializes Roaring and compares to original consumed iterator collected as bitmap. No invalid-file cases, density threshold, count metadata or buffer-size assertion. (rust/lance-table/src/io/deletion.rs:291-332)

### Lines 333-351

Array roundtrip test explicit Set0..100 at /roundtrip, writes then read_deletion_file with resulting metadata and asserts DeletionVector equality. One fragment, current writer, no deleted-row scan or dataset commit exercised. (rust/lance-table/src/io/deletion.rs:333-351)

### Lines 352-370

Bitmap roundtrip analog uses explicit Bitmap0..100 at /bitmap and exact vector equality after public read. Closes test module/file. All five tests are valid-format local fixtures; no empty variants, NULL/schema mismatch, duplicate offsets, corruption, stale/mismatched count, base relocation or failure/cancellation tests occur here. (rust/lance-table/src/io/deletion.rs:352-370)

## Interaction and interpretation limits

All370 physical lines read and authored. No source tests executed. Arrow/Roaring dependency internals and object-store atomicity are not inferred. Dataset cache/base resolution and fragment mutation caller were inspected as bounded context only; complete dataset operations, concurrent conflict merge and cleanup remain pending.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::{collections::HashSet, sync::Arc, sync::LazyLock};
    5 | 
    6 | use arrow_array::{RecordBatch, UInt32Array};
    7 | use arrow_ipc::CompressionType;
    8 | use arrow_ipc::reader::FileReader as ArrowFileReader;
    9 | use arrow_ipc::writer::{FileWriter as ArrowFileWriter, IpcWriteOptions};
   10 | use arrow_schema::{ArrowError, DataType, Field, Schema, SchemaRef};
   11 | use bytes::Buf;
   12 | use lance_core::error::{CorruptFileSnafu, box_error};
   13 | use lance_core::utils::deletion::DeletionVector;
   14 | use lance_core::utils::tracing::{AUDIT_MODE_CREATE, AUDIT_TYPE_DELETION, TRACE_FILE_AUDIT};
   15 | use lance_core::{Error, Result};
   16 | use lance_io::object_store::ObjectStore;
   17 | use object_store::path::Path;
   18 | use rand::Rng;
   19 | use roaring::bitmap::RoaringBitmap;
   20 | use snafu::ResultExt;
   21 | use tracing::{info, instrument};
   22 | 
   23 | use crate::format::{DeletionFile, DeletionFileType};
   24 | 
   25 | pub const DELETIONS_DIR: &str = "_deletions";
   26 | 
   27 | /// The Arrow schema for an Arrow deletion file.
   28 | static DELETION_ARROW_SCHEMA: LazyLock<SchemaRef> = LazyLock::new(|| {
   29 |     Arc::new(Schema::new(vec![Field::new(
   30 |         "row_id",
   31 |         DataType::UInt32,
   32 |         false,
   33 |     )]))
   34 | });
   35 | 
   36 | /// Get the file path for a deletion file. This is relative to the dataset root.
   37 | pub fn deletion_file_path(base: &Path, fragment_id: u64, deletion_file: &DeletionFile) -> Path {
   38 |     let DeletionFile {
   39 |         read_version,
   40 |         id,
   41 |         file_type,
   42 |         ..
   43 |     } = deletion_file;
   44 |     let suffix = file_type.suffix();
   45 |     base.clone()
   46 |         .join(DELETIONS_DIR)
   47 |         .join(format!("{fragment_id}-{read_version}-{id}.{suffix}"))
   48 | }
   49 | 
   50 | pub fn relative_deletion_file_path(fragment_id: u64, deletion_file: &DeletionFile) -> String {
   51 |     let DeletionFile {
   52 |         read_version,
   53 |         id,
   54 |         file_type,
   55 |         ..
   56 |     } = deletion_file;
   57 |     let suffix = file_type.suffix();
   58 |     format!("{DELETIONS_DIR}/{fragment_id}-{read_version}-{id}.{suffix}")
   59 | }
   60 | 
   61 | /// Write a deletion file for a fragment for a given deletion vector.
   62 | ///
   63 | /// Returns the deletion file if one was written. If no deletions were present,
   64 | /// returns `Ok(None)`.
   65 | pub async fn write_deletion_file(
   66 |     base: &Path,
   67 |     fragment_id: u64,
   68 |     read_version: u64,
   69 |     removed_rows: &DeletionVector,
   70 |     object_store: &ObjectStore,
   71 | ) -> Result<Option<DeletionFile>> {
   72 |     let deletion_file = match removed_rows {
   73 |         DeletionVector::NoDeletions => None,
   74 |         DeletionVector::Set(set) => {
   75 |             let id = rand::rng().random::<u64>();
   76 |             let deletion_file = DeletionFile {
   77 |                 read_version,
   78 |                 id,
   79 |                 file_type: DeletionFileType::Array,
   80 |                 num_deleted_rows: Some(set.len()),
   81 |                 base_id: None,
   82 |             };
   83 |             let path = deletion_file_path(base, fragment_id, &deletion_file);
   84 | 
   85 |             let array = UInt32Array::from_iter(set.iter().copied());
   86 |             let array = Arc::new(array);
   87 | 
   88 |             let schema = DELETION_ARROW_SCHEMA.clone();
   89 |             let batch = RecordBatch::try_new(schema.clone(), vec![array])?;
   90 | 
   91 |             let mut out: Vec<u8> = Vec::new();
   92 |             let write_options =
   93 |                 IpcWriteOptions::default().try_with_compression(Some(CompressionType::ZSTD))?;
   94 |             {
   95 |                 let mut writer = ArrowFileWriter::try_new_with_options(
   96 |                     &mut out,
   97 |                     schema.as_ref(),
   98 |                     write_options,
   99 |                 )?;
  100 |                 writer.write(&batch)?;
  101 |                 writer.finish()?;
  102 |                 // Drop writer so out is no longer borrowed.
  103 |             }
  104 | 
  105 |             object_store.put(&path, &out).await?;
  106 | 
  107 |             info!(target: TRACE_FILE_AUDIT, mode=AUDIT_MODE_CREATE, r#type=AUDIT_TYPE_DELETION, path = path.to_string());
  108 | 
  109 |             Some(deletion_file)
  110 |         }
  111 |         DeletionVector::Bitmap(bitmap) => {
  112 |             let id = rand::rng().random::<u64>();
  113 |             let deletion_file = DeletionFile {
  114 |                 read_version,
  115 |                 id,
  116 |                 file_type: DeletionFileType::Bitmap,
  117 |                 num_deleted_rows: Some(bitmap.len() as usize),
  118 |                 base_id: None,
  119 |             };
  120 |             let path = deletion_file_path(base, fragment_id, &deletion_file);
  121 | 
  122 |             let mut out: Vec<u8> = Vec::new();
  123 |             bitmap.serialize_into(&mut out)?;
  124 | 
  125 |             object_store.put(&path, &out).await?;
  126 | 
  127 |             info!(target: TRACE_FILE_AUDIT, mode=AUDIT_MODE_CREATE, r#type=AUDIT_TYPE_DELETION, path = path.to_string());
  128 | 
  129 |             Some(deletion_file)
  130 |         }
  131 |     };
  132 |     Ok(deletion_file)
  133 | }
  134 | 
  135 | #[instrument(
  136 |     level = "debug",
  137 |     skip(base, object_store),
  138 |     fields(
  139 |         base = base.as_ref(),
  140 |         bytes_read = tracing::field::Empty
  141 |     )
  142 | )]
  143 | pub async fn read_deletion_file(
  144 |     fragment_id: u64,
  145 |     deletion_file: &DeletionFile,
  146 |     base: &Path,
  147 |     object_store: &ObjectStore,
  148 | ) -> Result<DeletionVector> {
  149 |     let span = tracing::Span::current();
  150 |     match deletion_file.file_type {
  151 |         DeletionFileType::Array => {
  152 |             let path = deletion_file_path(base, fragment_id, deletion_file);
  153 | 
  154 |             let data = object_store.read_one_all(&path).await?;
  155 |             span.record("bytes_read", data.len());
  156 |             let data = std::io::Cursor::new(data);
  157 |             let mut batches: Vec<RecordBatch> = ArrowFileReader::try_new(data, None)?
  158 |                 .collect::<std::result::Result<_, ArrowError>>()
  159 |                 .map_err(box_error)
  160 |                 .context(CorruptFileSnafu { path: path.clone() })?;
  161 | 
  162 |             if batches.len() != 1 {
  163 |                 return Err(Error::corrupt_file(
  164 |                     path,
  165 |                     format!(
  166 |                         "Expected exactly one batch in deletion file, got {}",
  167 |                         batches.len()
  168 |                     ),
  169 |                 ));
  170 |             }
  171 | 
  172 |             let batch = batches.pop().unwrap();
  173 |             if batch.schema().as_ref() != DELETION_ARROW_SCHEMA.as_ref() {
  174 |                 return Err(Error::corrupt_file(
  175 |                     path,
  176 |                     format!(
  177 |                         "Expected schema {:?} in deletion file, got {:?}",
  178 |                         DELETION_ARROW_SCHEMA.as_ref(),
  179 |                         batch.schema()
  180 |                     ),
  181 |                 ));
  182 |             }
  183 | 
  184 |             let array = batch.columns()[0]
  185 |                 .as_any()
  186 |                 .downcast_ref::<UInt32Array>()
  187 |                 .unwrap();
  188 | 
  189 |             let mut set = HashSet::with_capacity(array.len());
  190 |             for val in array.iter() {
  191 |                 if let Some(val) = val {
  192 |                     set.insert(val);
  193 |                 } else {
  194 |                     return Err(Error::corrupt_file(
  195 |                         path,
  196 |                         "Null values are not allowed in deletion files",
  197 |                     ));
  198 |                 }
  199 |             }
  200 | 
  201 |             Ok(DeletionVector::Set(set))
  202 |         }
  203 |         DeletionFileType::Bitmap => {
  204 |             let path = deletion_file_path(base, fragment_id, deletion_file);
  205 | 
  206 |             let data = object_store.read_one_all(&path).await?;
  207 |             span.record("bytes_read", data.len());
  208 |             let reader = data.reader();
  209 |             let bitmap = RoaringBitmap::deserialize_from(reader)
  210 |                 .map_err(box_error)
  211 |                 .context(CorruptFileSnafu { path })?;
  212 | 
  213 |             Ok(DeletionVector::Bitmap(bitmap))
  214 |         }
  215 |     }
  216 | }
  217 | 
  218 | #[cfg(test)]
  219 | mod test {
  220 | 
  221 |     use super::*;
  222 |     use object_store::ObjectStoreExt;
  223 | 
  224 |     #[tokio::test]
  225 |     async fn test_write_no_deletions() {
  226 |         let dv = DeletionVector::NoDeletions;
  227 | 
  228 |         let (object_store, path) = ObjectStore::from_uri("memory:///no_deletion")
  229 |             .await
  230 |             .unwrap();
  231 |         let file = write_deletion_file(&path, 0, 0, &dv, &object_store)
  232 |             .await
  233 |             .unwrap();
  234 |         assert!(file.is_none());
  235 |     }
  236 | 
  237 |     #[tokio::test]
  238 |     async fn test_write_array() {
  239 |         let dv = DeletionVector::Set(HashSet::from_iter(0..100));
  240 | 
  241 |         let fragment_id = 21;
  242 |         let read_version = 12;
  243 | 
  244 |         let object_store = ObjectStore::memory();
  245 |         let path = Path::from("/write");
  246 |         let file = write_deletion_file(&path, fragment_id, read_version, &dv, &object_store)
  247 |             .await
  248 |             .unwrap();
  249 | 
  250 |         assert!(matches!(
  251 |             file,
  252 |             Some(DeletionFile {
  253 |                 file_type: DeletionFileType::Array,
  254 |                 ..
  255 |             })
  256 |         ));
  257 | 
  258 |         let file = file.unwrap();
  259 |         assert_eq!(file.read_version, read_version);
  260 |         let path = deletion_file_path(&path, fragment_id, &file);
  261 |         assert_eq!(
  262 |             path,
  263 |             Path::from(format!("/write/_deletions/21-12-{}.arrow", file.id))
  264 |         );
  265 | 
  266 |         let data = object_store
  267 |             .inner
  268 |             .get(&path)
  269 |             .await
  270 |             .unwrap()
  271 |             .bytes()
  272 |             .await
  273 |             .unwrap();
  274 |         let data = std::io::Cursor::new(data);
  275 |         let mut batches: Vec<RecordBatch> = ArrowFileReader::try_new(data, None)
  276 |             .unwrap()
  277 |             .collect::<std::result::Result<_, ArrowError>>()
  278 |             .unwrap();
  279 | 
  280 |         assert_eq!(batches.len(), 1);
  281 |         let batch = batches.pop().unwrap();
  282 |         assert_eq!(batch.schema(), *DELETION_ARROW_SCHEMA);
  283 |         let array = batch["row_id"]
  284 |             .as_any()
  285 |             .downcast_ref::<UInt32Array>()
  286 |             .unwrap();
  287 |         let read_dv = DeletionVector::from_iter(array.iter().map(|v| v.unwrap()));
  288 |         assert_eq!(read_dv, dv);
  289 |     }
  290 | 
  291 |     #[tokio::test]
  292 |     async fn test_write_bitmap() {
  293 |         let dv = DeletionVector::Bitmap(RoaringBitmap::from_iter(0..100));
  294 | 
  295 |         let fragment_id = 21;
  296 |         let read_version = 12;
  297 | 
  298 |         let object_store = ObjectStore::memory();
  299 |         let path = Path::from("/bitmap");
  300 |         let file = write_deletion_file(&path, fragment_id, read_version, &dv, &object_store)
  301 |             .await
  302 |             .unwrap();
  303 | 
  304 |         assert!(matches!(
  305 |             file,
  306 |             Some(DeletionFile {
  307 |                 file_type: DeletionFileType::Bitmap,
  308 |                 ..
  309 |             })
  310 |         ));
  311 | 
  312 |         let file = file.unwrap();
  313 |         assert_eq!(file.read_version, read_version);
  314 |         let path = deletion_file_path(&path, fragment_id, &file);
  315 |         assert_eq!(
  316 |             path,
  317 |             Path::from(format!("/bitmap/_deletions/21-12-{}.bin", file.id))
  318 |         );
  319 | 
  320 |         let data = object_store
  321 |             .inner
  322 |             .get(&path)
  323 |             .await
  324 |             .unwrap()
  325 |             .bytes()
  326 |             .await
  327 |             .unwrap();
  328 |         let reader = data.reader();
  329 |         let read_bitmap = RoaringBitmap::deserialize_from(reader).unwrap();
  330 |         assert_eq!(read_bitmap, dv.into_iter().collect::<RoaringBitmap>());
  331 |     }
  332 | 
  333 |     #[tokio::test]
  334 |     async fn test_roundtrip_array() {
  335 |         let dv = DeletionVector::Set(HashSet::from_iter(0..100));
  336 | 
  337 |         let fragment_id = 21;
  338 |         let read_version = 12;
  339 | 
  340 |         let object_store = ObjectStore::memory();
  341 |         let path = Path::from("/roundtrip");
  342 |         let file = write_deletion_file(&path, fragment_id, read_version, &dv, &object_store)
  343 |             .await
  344 |             .unwrap();
  345 | 
  346 |         let read_dv = read_deletion_file(fragment_id, &file.unwrap(), &path, &object_store)
  347 |             .await
  348 |             .unwrap();
  349 |         assert_eq!(read_dv, dv);
  350 |     }
  351 | 
  352 |     #[tokio::test]
  353 |     async fn test_roundtrip_bitmap() {
  354 |         let dv = DeletionVector::Bitmap(RoaringBitmap::from_iter(0..100));
  355 | 
  356 |         let fragment_id = 21;
  357 |         let read_version = 12;
  358 | 
  359 |         let object_store = ObjectStore::memory();
  360 |         let path = Path::from("/bitmap");
  361 |         let file = write_deletion_file(&path, fragment_id, read_version, &dv, &object_store)
  362 |             .await
  363 |             .unwrap();
  364 | 
  365 |         let read_dv = read_deletion_file(fragment_id, &file.unwrap(), &path, &object_store)
  366 |             .await
  367 |             .unwrap();
  368 |         assert_eq!(read_dv, dv);
  369 |     }
  370 | }
``````
