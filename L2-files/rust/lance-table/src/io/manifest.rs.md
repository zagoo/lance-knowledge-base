> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/io/manifest.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `291d8eac24b24733435255c296f4f3395d5d0d9f8653207b88857001fa2bc710`. Reviewed physical lines: 1-392.

[Module](../../../../../L1-modules/rust-lance-table-io.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Manifest body and separate index-section readers, mutable manifest serialization to an already-open Writer, and legacy schema-only ManifestProvider. Owns low-level metadata IO/framing interpretation, not dataset capability validation, commit arbitration or footer/shutdown publication. (rust/lance-table/src/io/manifest.rs:1-392)

## Complete range analysis

### Lines 1-31

SPDX and imports bind async_trait, LittleEndian, Bytes/Buf, fallible streams, exact storage version and legacy V1 dictionary/provider helpers, object-store paths/extensions, Prost, collections/Arc, tracing, core Schema/Error, lance-io Writer extensions/chunk utilities, table metadata/protobuf/MAGIC and ManifestLocation. Public io module exposes this child; no environment variables or global mutable state here. (rust/lance-table/src/io/manifest.rs:1-31)

### Lines 32-53

Public async read_manifest(store,path,known_size) reads manifest files only. Debug instrumentation skips store. Supplied u64 size bypasses explicit HEAD; absent size awaits inner.head. PREFETCH_SIZE is64*1024 bytes; saturating_sub chooses tail start and one inner.get_range fetches through supplied/observed end. GET errors propagate immediately; it does not verify supplied size first or read data files. (rust/lance-table/src/io/manifest.rs:32-53)

### Lines 54-71

Only a successfully returned tail shorter than16 or lacking trailing table MAGIC triggers one recursive boxed retry without cached size. Retry has None so cannot recurse again. If still short or wrong magic, CorruptFile includes path and reason. Arbitrary range/HEAD errors, bad offset, bad length or protobuf decode do not trigger this retry. Footer major/minor bytes are not inspected by these checks. (rust/lance-table/src/io/manifest.rs:54-71)

### Lines 72-85

Read footer offset as signed little-endian i64 then unchecked as usize; file_size is also unchecked cast to usize before ordinary subtraction. No explicit negative/out-of-file offset validation. If computed manifest_len fits tail, slice from its computed start; else open a sized reader. Corrupt offsets can cause arithmetic/slicing failures rather than contextual Result errors; this is source-level observation, not an executed repro. (rust/lance-table/src/io/manifest.rs:72-85)

### Lines 86-108

Large-body path fetches manifest_pos through file_size-64KiB in METADATA_READ_CHUNK_SIZE chunks, accumulating every Bytes in ChunkedBuf, then appends prefetched tail. Requires combined remaining>=20, reads u32 LE prefix, truncates trailing16, and returns decode_manifest. Errors drop local buffer/futures; no write. Contextual helper uses16MiB chunks with ordered buffered concurrency max(reader.io_parallelism,1); chunk handles avoid whole-body concatenation but all bytes remain resident for decode (rust/lance-io/src/utils.rs:27-95). Comment throughput/memory motivations are not measurements performed here. (rust/lance-table/src/io/manifest.rs:86-108)

### Lines 109-128

Fast path reads prefix buf[0..4], slices4..len-16 and delegates; unlike chunk branch no explicit20-byte minimum after trimming. Private decode_manifest requires exact remaining==recorded_length or InvalidInput with expected/actual sizes, then Prost decode, Manifest::try_from and sparse-inline-row-ID detach heuristic using message-body length. No capability/feature/footer-version validation occurs here. Length mismatch lacks path argument; conversion/decode errors propagate. Byte detachment may copy small inline payloads after otherwise shared decoding. (rust/lance-table/src/io/manifest.rs:109-128)

### Lines 129-159

Public async read_manifest_indexes(store,location,manifest) reads only when index_section Some; absent returns empty Vec without opening storage. On read_index_section error, retry once without cached size only if location.size Some and error.to_string contains exact file size is too small substring. Other errors propagate. Convert all returned protobuf entries in order, failing whole Result on first metadata conversion error. No independent count/UUID/type/capability validation here; None and encoded empty section both return empty Vec. (rust/lance-table/src/io/manifest.rs:129-159)

### Lines 160-176

Private read_index_section opens with unchecked u64->usize sized hint when Some, otherwise normal open, then awaits generic read_message at pos. Underlying helper validates length-prefix/body against reader.size and emits the retry substring for a too-small sized view (rust/lance-io/src/utils.rs:161-199). This wrapper does not read footer or verify offset belongs to an IndexSection. (rust/lance-table/src/io/manifest.rs:160-176)

### Lines 177-195

Private do_write_manifest borrows mutable Writer/Manifest, owns optional index Vec and optional inline transaction. Some indices (even empty) converts entire vector into pb::IndexSection, awaits write_protobuf and then updates manifest.index_section to returned position. None explicitly clears inherited index_section so stale offsets cannot refer to unrelated bytes. A failed write may leave bytes partly emitted; local code supplies no rollback. (rust/lance-table/src/io/manifest.rs:177-195)

### Lines 196-211

If transaction Some, take/move wrapper into pb::Transaction, await write_protobuf then set transaction_section; None clears inherited offset. Finally write_struct serializes current manifest and returns its starting offset. Earlier index/transaction writes and in-memory offset mutations survive later failure/cancellation; no footer, flush, shutdown, feature checks, CAS or cleanup in this helper. Transaction wrapper conversion itself is a move, while protobuf writer allocates encoding buffer (rust/lance-io/src/traits.rs:53-63; rust/lance-io/src/traits.rs:84-92). (rust/lance-table/src/io/manifest.rs:196-211)

### Lines 212-231

Public write_manifest on an open dyn Writer branches only on exact manifest default storage version: V1 awaits write_schema_dictionaries mutating schema, every V2_0/1/2/3 skips that step. Then delegate do_write_manifest. Legacy dictionary route is compatibility behavior, not a general new-format implementation hook. Return usize is metadata starting position, not byte count; caller must append footer and close writer. (rust/lance-table/src/io/manifest.rs:212-231)

### Lines 232-252

Public empty ManifestDescribing implements legacy V1ManifestProvider::store_schema asynchronously. Clone schema into new Manifest with no fragments/bases and explicit V1; directly call do_write_manifest with no index/transaction and return Some(position). It bypasses write_manifest dictionary step because provider delegates only schema-envelope writing at this boundary. No inherent constructor/Default or public fields beyond empty struct. (rust/lance-table/src/io/manifest.rs:232-252)

### Lines 253-268

Private cfg(test) module imports Arrow arrays/batches/schema, SelfDescribingFileReader, legacy FileReader/FileWriter and lance-file footer constants, random alphanumerics and tokio AsyncWriteExt. Tests below use in-memory stores and were read, not run. Imported footer major/minor are lance-file's0/2, not table facade's0/1; reader only checks magic/position here. (rust/lance-table/src/io/manifest.rs:253-268)

### Lines 269-297

Roundtrip helper creates memory store/path, writes random alphanumeric prefix of requested length, makes deterministic repeated-a field name at least requested payload size and constructs default-format empty-fragment manifest. Builds config key/value map but never attaches it to manifest, so this fixture does not test persisted config values. Size inflation is schema-name content, not many fragments or dictionaries. (rust/lance-table/src/io/manifest.rs:269-297)

### Lines 298-313

Roundtrip helper writes body, explicitly appends footer, explicitly shuts down, reads with unknown size and asserts Manifest equality, then deletes object. Manifest derives PartialEq, whose schema comparison ignores top-level schema metadata (rust/lance-table/src/format/manifest.rs:38-41; rust/lance-core/src/datatypes/schema.rs:874-878); this assertion is not a complete metadata-field oracle. The test pins body/footer/close sequence but not production commit arbitration or known-size retry behavior. (rust/lance-table/src/io/manifest.rs:298-313)

### Lines 314-327

test_read_large_manifest invokes helper with prefix/body sizes(0,100000),(1000,100000),(1000,1000). Separate larger-than-chunk case uses1000-byte prefix and METADATA_READ_CHUNK_SIZE+4MiB filler, i.e.20MiB with contextual16MiB constant. They cover whole-tail, extra-range and multi-chunk shapes; no timing/peak-memory assertions or injected concurrency failures. (rust/lance-table/src/io/manifest.rs:314-327)

### Lines 328-354

Clears-unwritten-index test sets index_section Some42, writes with indices/transaction None, adds footer/shuts down, then asserts in-memory and reread index_section None. It does not test inherited transaction_section clearing, Some(empty) indices, failed writes or retry on stale known size. (rust/lance-table/src/io/manifest.rs:328-354)

### Lines 355-392

Legacy schema metadata test writes one Int32 i batch0..10 through V1FileWriter<ManifestDescribing>, finish_with_metadata adds lance:extra=for_test, opens self-described V1 reader and checks Arrow schema metadata value. Exercises legacy provider integration with fresh current writer, not released historical fixtures or v2 metadata. Closing brace ends module/file. (rust/lance-table/src/io/manifest.rs:355-392)

## Interaction and interpretation limits

All392 physical lines read and authored. Source tests not run. Chunk utilities, WriteExt, canonical caller and dataset adapters are contextual excerpts only and remain pending as complete files. This IO layer is not complete storage commit, feature-gate validation or released-format compatibility qualification; unchecked malformed-footer boundaries are static observations only.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use async_trait::async_trait;
    5 | use byteorder::{ByteOrder, LittleEndian};
    6 | use bytes::{Buf, Bytes};
    7 | use futures::TryStreamExt;
    8 | use lance_file::{
    9 |     version::ConcreteFileVersion,
   10 |     versions::v1::{
   11 |         encoding::write_schema_dictionaries, writer::ManifestProvider as V1ManifestProvider,
   12 |     },
   13 | };
   14 | use object_store::ObjectStoreExt;
   15 | use object_store::path::Path;
   16 | use prost::Message;
   17 | use std::collections::HashMap;
   18 | use std::{ops::Range, sync::Arc};
   19 | use tracing::instrument;
   20 | 
   21 | use lance_core::{Error, Result, datatypes::Schema};
   22 | use lance_io::{
   23 |     object_store::ObjectStore,
   24 |     traits::{WriteExt, Writer},
   25 |     utils::{ChunkedBuf, METADATA_READ_CHUNK_SIZE, read_message, read_range_in_chunks},
   26 | };
   27 | 
   28 | use crate::format::{DataStorageFormat, IndexMetadata, MAGIC, Manifest, Transaction, pb};
   29 | 
   30 | use super::commit::ManifestLocation;
   31 | 
   32 | /// Read Manifest on URI.
   33 | ///
   34 | /// This only reads manifest files. It does not read data files.
   35 | #[instrument(level = "debug", skip(object_store))]
   36 | pub async fn read_manifest(
   37 |     object_store: &ObjectStore,
   38 |     path: &Path,
   39 |     known_size: Option<u64>,
   40 | ) -> Result<Manifest> {
   41 |     let file_size = if let Some(known_size) = known_size {
   42 |         known_size
   43 |     } else {
   44 |         object_store.inner.head(path).await?.size
   45 |     };
   46 |     const PREFETCH_SIZE: u64 = 64 * 1024;
   47 |     let initial_start = file_size.saturating_sub(PREFETCH_SIZE);
   48 |     let range = Range {
   49 |         start: initial_start,
   50 |         end: file_size,
   51 |     };
   52 |     let buf = object_store.inner.get_range(path, range).await?;
   53 | 
   54 |     // In case of corruption, the known_size might be wrong. We can retry without
   55 |     // the size to be more robust.
   56 |     if (buf.len() < 16 || !buf.ends_with(MAGIC)) && known_size.is_some() {
   57 |         return Box::pin(read_manifest(object_store, path, None)).await;
   58 |     }
   59 | 
   60 |     if buf.len() < 16 {
   61 |         return Err(Error::corrupt_file(
   62 |             path.clone(),
   63 |             "Invalid format: file size is smaller than 16 bytes".to_string(),
   64 |         ));
   65 |     }
   66 |     if !buf.ends_with(MAGIC) {
   67 |         return Err(Error::corrupt_file(
   68 |             path.clone(),
   69 |             "Invalid format: magic number does not match".to_string(),
   70 |         ));
   71 |     }
   72 |     let manifest_pos = LittleEndian::read_i64(&buf[buf.len() - 16..buf.len() - 8]) as usize;
   73 |     let manifest_len = file_size as usize - manifest_pos;
   74 | 
   75 |     let buf: Bytes = if manifest_len <= buf.len() {
   76 |         // The prefetch captured the entire manifest. We just need to trim the buffer.
   77 |         buf.slice(buf.len() - manifest_len..buf.len())
   78 |     } else {
   79 |         // The prefetch only captured part of the manifest. Fetch the remainder
   80 |         // as concurrent chunked range requests: a single GET is limited to one
   81 |         // connection's throughput, which dominates load time for manifests of
   82 |         // datasets with many fragments.
   83 |         let reader = object_store
   84 |             .open_with_size(path, file_size as usize)
   85 |             .await?;
   86 |         let mut chunks = read_range_in_chunks(
   87 |             reader.as_ref(),
   88 |             manifest_pos..(file_size - PREFETCH_SIZE) as usize,
   89 |             METADATA_READ_CHUNK_SIZE,
   90 |         );
   91 |         // Decode straight from the chunks rather than re-copying ~all of the
   92 |         // file into one buffer; see `ChunkedBuf`.
   93 |         let mut chunked = ChunkedBuf::default();
   94 |         while let Some(chunk) = chunks.try_next().await? {
   95 |             chunked.push(chunk);
   96 |         }
   97 |         chunked.push(buf);
   98 |         // A u32 length prefix in front, the 16 byte footer behind.
   99 |         if chunked.remaining() < 20 {
  100 |             return Err(Error::corrupt_file(
  101 |                 path.clone(),
  102 |                 "Invalid format: manifest shorter than its length prefix and footer".to_string(),
  103 |             ));
  104 |         }
  105 |         let recorded_length = chunked.get_u32_le() as usize;
  106 |         chunked.truncate(chunked.remaining() - 16);
  107 |         return decode_manifest(chunked, recorded_length);
  108 |     };
  109 | 
  110 |     let recorded_length = LittleEndian::read_u32(&buf[0..4]) as usize;
  111 |     // Need to trim the magic number at end and message length at beginning
  112 |     let buf = buf.slice(4..buf.len() - 16);
  113 |     decode_manifest(buf, recorded_length)
  114 | }
  115 | 
  116 | fn decode_manifest(buf: impl Buf, recorded_length: usize) -> Result<Manifest> {
  117 |     if buf.remaining() != recorded_length {
  118 |         return Err(Error::invalid_input(format!(
  119 |             "Invalid format: manifest length does not match. Expected {}, got {}",
  120 |             recorded_length,
  121 |             buf.remaining()
  122 |         )));
  123 |     }
  124 |     let proto = pb::Manifest::decode(buf)?;
  125 |     let mut manifest = Manifest::try_from(proto)?;
  126 |     manifest.detach_sparse_inline_row_ids(recorded_length);
  127 |     Ok(manifest)
  128 | }
  129 | 
  130 | #[instrument(level = "debug", skip(object_store, manifest))]
  131 | pub async fn read_manifest_indexes(
  132 |     object_store: &ObjectStore,
  133 |     location: &ManifestLocation,
  134 |     manifest: &Manifest,
  135 | ) -> Result<Vec<IndexMetadata>> {
  136 |     if let Some(pos) = manifest.index_section.as_ref() {
  137 |         let result = read_index_section(object_store, &location.path, location.size, *pos).await;
  138 |         // A stale cached size makes the index offset fall outside the sized view,
  139 |         // so the read fails as "file size is too small". Retry once with the true
  140 |         // size; surface any other error unchanged.
  141 |         let section = match result {
  142 |             Err(e)
  143 |                 if location.size.is_some() && e.to_string().contains("file size is too small") =>
  144 |             {
  145 |                 read_index_section(object_store, &location.path, None, *pos).await?
  146 |             }
  147 |             other => other?,
  148 |         };
  149 | 
  150 |         let indices = section
  151 |             .indices
  152 |             .into_iter()
  153 |             .map(IndexMetadata::try_from)
  154 |             .collect::<Result<Vec<_>>>()?;
  155 |         Ok(indices)
  156 |     } else {
  157 |         Ok(vec![])
  158 |     }
  159 | }
  160 | 
  161 | /// Read the index section message at `pos`, opening the manifest with a known
  162 | /// size when one is provided.
  163 | async fn read_index_section(
  164 |     object_store: &ObjectStore,
  165 |     path: &Path,
  166 |     size: Option<u64>,
  167 |     pos: usize,
  168 | ) -> Result<pb::IndexSection> {
  169 |     let reader = if let Some(size) = size {
  170 |         object_store.open_with_size(path, size as usize).await?
  171 |     } else {
  172 |         object_store.open(path).await?
  173 |     };
  174 |     read_message(reader.as_ref(), pos).await
  175 | }
  176 | 
  177 | async fn do_write_manifest(
  178 |     writer: &mut dyn Writer,
  179 |     manifest: &mut Manifest,
  180 |     indices: Option<Vec<IndexMetadata>>,
  181 |     mut transaction: Option<Transaction>,
  182 | ) -> Result<usize> {
  183 |     // Write indices if presented.
  184 |     if let Some(indices) = indices.as_ref() {
  185 |         let section = pb::IndexSection {
  186 |             indices: indices.iter().map(|i| i.into()).collect(),
  187 |         };
  188 |         let pos = writer.write_protobuf(&section).await?;
  189 |         manifest.index_section = Some(pos);
  190 |     } else {
  191 |         // No index section is written to this file, so an inherited offset
  192 |         // would point at unrelated bytes in the new manifest file.
  193 |         manifest.index_section = None;
  194 |     }
  195 | 
  196 |     // Write inline transaction if presented.
  197 |     if let Some(tx) = transaction.take() {
  198 |         // Convert to protobuf at the write boundary to persist inline
  199 |         let pb_tx: pb::Transaction = tx.into();
  200 |         let pos = writer.write_protobuf(&pb_tx).await?;
  201 |         manifest.transaction_section = Some(pos);
  202 |     } else {
  203 |         // No inline copy is written to this file. Clear any offset inherited
  204 |         // from a previous manifest (e.g. via restore or clone), which would
  205 |         // otherwise point at arbitrary bytes of the file being written.
  206 |         manifest.transaction_section = None;
  207 |     }
  208 | 
  209 |     writer.write_struct(manifest).await
  210 | }
  211 | 
  212 | /// Write manifest to an open file.
  213 | pub async fn write_manifest(
  214 |     writer: &mut dyn Writer,
  215 |     manifest: &mut Manifest,
  216 |     indices: Option<Vec<IndexMetadata>>,
  217 |     transaction: Option<Transaction>,
  218 | ) -> Result<usize> {
  219 |     match manifest.data_storage_format.version {
  220 |         ConcreteFileVersion::V1 => {
  221 |             write_schema_dictionaries(writer, &mut manifest.schema).await?;
  222 |         }
  223 |         ConcreteFileVersion::V2_0
  224 |         | ConcreteFileVersion::V2_1
  225 |         | ConcreteFileVersion::V2_2
  226 |         | ConcreteFileVersion::V2_3 => {}
  227 |     }
  228 | 
  229 |     do_write_manifest(writer, manifest, indices, transaction).await
  230 | }
  231 | 
  232 | /// Implementation of ManifestProvider that describes a Lance file by writing
  233 | /// a manifest that contains nothing but default fields and the schema
  234 | pub struct ManifestDescribing {}
  235 | 
  236 | #[async_trait]
  237 | impl V1ManifestProvider for ManifestDescribing {
  238 |     async fn store_schema(
  239 |         object_writer: &mut dyn Writer,
  240 |         schema: &Schema,
  241 |     ) -> Result<Option<usize>> {
  242 |         let mut manifest = Manifest::new(
  243 |             schema.clone(),
  244 |             Arc::new(vec![]),
  245 |             DataStorageFormat::new(ConcreteFileVersion::V1),
  246 |             HashMap::new(),
  247 |         );
  248 |         let pos = do_write_manifest(object_writer, &mut manifest, None, None).await?;
  249 |         Ok(Some(pos))
  250 |     }
  251 | }
  252 | 
  253 | #[cfg(test)]
  254 | mod test {
  255 |     use arrow_array::{Int32Array, RecordBatch};
  256 |     use std::collections::HashMap;
  257 | 
  258 |     use crate::format::SelfDescribingFileReader;
  259 |     use arrow_schema::{DataType, Field as ArrowField, Schema as ArrowSchema};
  260 |     use lance_file::format::{MAGIC, MAJOR_VERSION, MINOR_VERSION};
  261 |     use lance_file::versions::v1::{
  262 |         reader::FileReader as V1FileReader, writer::FileWriter as V1FileWriter,
  263 |     };
  264 |     use rand::{Rng, distr::Alphanumeric};
  265 |     use tokio::io::AsyncWriteExt;
  266 | 
  267 |     use super::*;
  268 | 
  269 |     async fn test_roundtrip_manifest(prefix_size: usize, manifest_min_size: usize) {
  270 |         let store = ObjectStore::memory();
  271 |         let path = Path::from("/read_large_manifest");
  272 | 
  273 |         let mut writer = store.create(&path).await.unwrap();
  274 | 
  275 |         // Write prefix we should ignore
  276 |         let prefix: Vec<u8> = rand::rng()
  277 |             .sample_iter(&Alphanumeric)
  278 |             .take(prefix_size)
  279 |             .collect();
  280 |         writer.write_all(&prefix).await.unwrap();
  281 | 
  282 |         // A cheap deterministic filler; only the size matters for these tests.
  283 |         let long_name: String = "a".repeat(manifest_min_size);
  284 | 
  285 |         let arrow_schema =
  286 |             ArrowSchema::new(vec![ArrowField::new(long_name, DataType::Int64, false)]);
  287 |         let schema = Schema::try_from(&arrow_schema).unwrap();
  288 | 
  289 |         let mut config = HashMap::new();
  290 |         config.insert("key".to_string(), "value".to_string());
  291 | 
  292 |         let mut manifest = Manifest::new(
  293 |             schema,
  294 |             Arc::new(vec![]),
  295 |             DataStorageFormat::default(),
  296 |             HashMap::new(),
  297 |         );
  298 |         let pos = write_manifest(writer.as_mut(), &mut manifest, None, None)
  299 |             .await
  300 |             .unwrap();
  301 |         writer
  302 |             .write_magics(pos, MAJOR_VERSION, MINOR_VERSION, MAGIC)
  303 |             .await
  304 |             .unwrap();
  305 |         Writer::shutdown(writer.as_mut()).await.unwrap();
  306 | 
  307 |         let roundtripped_manifest = read_manifest(&store, &path, None).await.unwrap();
  308 | 
  309 |         assert_eq!(manifest, roundtripped_manifest);
  310 | 
  311 |         store.inner.delete(&path).await.unwrap();
  312 |     }
  313 | 
  314 |     #[tokio::test]
  315 |     async fn test_read_large_manifest() {
  316 |         test_roundtrip_manifest(0, 100_000).await;
  317 |         test_roundtrip_manifest(1000, 100_000).await;
  318 |         test_roundtrip_manifest(1000, 1000).await;
  319 |     }
  320 | 
  321 |     #[tokio::test]
  322 |     async fn test_read_manifest_larger_than_read_chunk() {
  323 |         // Crosses METADATA_READ_CHUNK_SIZE so the manifest body is fetched as
  324 |         // multiple concurrent chunks and reassembled with the prefetched tail.
  325 |         test_roundtrip_manifest(1000, METADATA_READ_CHUNK_SIZE + 4 * 1024 * 1024).await;
  326 |     }
  327 | 
  328 |     #[tokio::test]
  329 |     async fn test_write_manifest_clears_unwritten_index_section() {
  330 |         let store = ObjectStore::memory();
  331 |         let path = Path::from("/clear_unwritten_index_section");
  332 |         let mut writer = store.create(&path).await.unwrap();
  333 |         let mut manifest = Manifest::new(
  334 |             Schema::default(),
  335 |             Arc::new(vec![]),
  336 |             DataStorageFormat::default(),
  337 |             HashMap::new(),
  338 |         );
  339 |         manifest.index_section = Some(42);
  340 | 
  341 |         let pos = write_manifest(writer.as_mut(), &mut manifest, None, None)
  342 |             .await
  343 |             .unwrap();
  344 |         writer
  345 |             .write_magics(pos, MAJOR_VERSION, MINOR_VERSION, MAGIC)
  346 |             .await
  347 |             .unwrap();
  348 |         Writer::shutdown(writer.as_mut()).await.unwrap();
  349 | 
  350 |         assert!(manifest.index_section.is_none());
  351 |         let roundtripped_manifest = read_manifest(&store, &path, None).await.unwrap();
  352 |         assert!(roundtripped_manifest.index_section.is_none());
  353 |     }
  354 | 
  355 |     #[tokio::test]
  356 |     async fn test_update_schema_metadata() {
  357 |         let store = ObjectStore::memory();
  358 |         let path = Path::from("/update_schema_metadata");
  359 | 
  360 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![ArrowField::new(
  361 |             "i",
  362 |             DataType::Int32,
  363 |             false,
  364 |         )]));
  365 |         let schema = Schema::try_from(arrow_schema.as_ref()).unwrap();
  366 |         let mut file_writer = V1FileWriter::<ManifestDescribing>::try_new(
  367 |             &store,
  368 |             &path,
  369 |             schema.clone(),
  370 |             &Default::default(),
  371 |         )
  372 |         .await
  373 |         .unwrap();
  374 | 
  375 |         let array = Int32Array::from_iter_values(0..10);
  376 |         let batch = RecordBatch::try_new(arrow_schema.clone(), vec![Arc::new(array)]).unwrap();
  377 |         file_writer
  378 |             .write(std::slice::from_ref(&batch))
  379 |             .await
  380 |             .unwrap();
  381 |         let mut metadata = HashMap::new();
  382 |         metadata.insert(String::from("lance:extra"), String::from("for_test"));
  383 |         file_writer.finish_with_metadata(&metadata).await.unwrap();
  384 | 
  385 |         let reader = store.open(&path).await.unwrap();
  386 |         let reader = V1FileReader::try_new_self_described_from_reader(reader.into(), None)
  387 |             .await
  388 |             .unwrap();
  389 |         let schema = ArrowSchema::from(reader.schema());
  390 |         assert_eq!(schema.metadata().get("lance:extra").unwrap(), "for_test");
  391 |     }
  392 | }
``````
