> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-file/src/versions/mod.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `a5f9d0d63e4978614874b0f7529ea7852b1368ee3965feced19bd88b636d629a`. Reviewed physical lines: 1-428.

[Module](../../../../../L1-modules/rust-lance-file-runtime.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Exact-version composition root for projection, metadata, reader and writer dispatch. It accepts ConcreteFileVersion after caller selector resolution and separates V1 compatibility from current-format runtime APIs. (rust/lance-file/src/versions/mod.rs:1-428)

## Complete range analysis

### Lines 1-37

SPDX/module guidance prefers statically known version submodules and one exhaustive runtime dispatch. Imports core schema/errors/cache, bytes, encoding metadata/plugins/batches, scheduler/Writer, BTreeMap/Future/Arc and reader/writer types. Public modules are v1,v2_0,v2_1,v2_2,v2_3. No numeric version ordering or release-alias resolution occurs here. (rust/lance-file/src/versions/mod.rs:1-37)

### Lines 38-49

Crate-visible read_projection returns Internal for V1 with current reader composition received Lance v1. Each V2 variant obtains its own module projection as Arc<dyn ReadProjection>. No fallback to a newer grammar. (rust/lance-file/src/versions/mod.rs:38-49)

### Lines 50-62

Public OpenedFileReader has V1{major_version:u16,minor_version:u16}, retaining literal footer numbers for diagnostics, and Current(FileReader). V1 carries no opened legacy reader. No derive or third variant. (rust/lance-file/src/versions/mod.rs:50-62)

### Lines 63-77

Crate-visible finish_metadata consumes RawFileMetadata and dispatches to exact V2 module; V1 returns Internal current metadata dispatch received a Lance v1 file. Ownership/error cleanup are ordinary Rust drops; no retry or IO in this wrapper. (rust/lance-file/src/versions/mod.rs:63-77)

### Lines 78-108

validate_external_metadata builds a whole-schema projection for the requested exact version, rejects physical-column count mismatch as InvalidInput with expected/actual counts, then invokes FileReader::validate_projection. Require each ColumnInfo.index to equal its enumerate index as u32 or InvalidInput. Clone metadata column_infos into PreparedProjection and ask exact read_projection.read_length. No direct page-byte read or independent row-count arithmetic. Contextual validate_projection rejects zero schema fields, duplicate column indices and out-of-bounds indices (rust/lance-file/src/reader.rs:1117-1144); grammar-specific rectangularity remains delegated. (rust/lance-file/src/versions/mod.rs:78-108)

### Lines 109-122

finish_metadata_index dispatches using index.version; V1 gives VersionConflict with numeric0,2 and message about current reader with v1 metadata index. That diagnostic uses canonical legacy footer numbers, not a preserved original alias. V2 modules own accepted metadata-index grammar. (rust/lance-file/src/versions/mod.rs:109-122)

### Lines 123-137

decode_column_metadata takes exact version and protobuf slice, returning Vec<Arc<ColumnInfo>> via exact module. V1 is NotSupported because self-described batches are outside its grammar. Decoder/plugin/page validation is delegated, not implemented here. (rust/lance-file/src/versions/mod.rs:123-137)

### Lines 138-150

validate_global_buffers dispatches V2 checks; V1 returns Ok(()) without examining the descriptors. This exception is not a promise that current-format global buffers can be written/read through V1 APIs. (rust/lance-file/src/versions/mod.rs:138-150)

### Lines 151-172

Public reader_projection_from_field_ids delegates each of all five exact versions to its schema/BTreeMap<u32,u32> builder and wraps the returned ReaderProjection in Ok. No local error path or mapping validation; delegated builders may have their own assumptions. Argument order is version,schema,map. (rust/lance-file/src/versions/mod.rs:151-172)

### Lines 173-185

Public reader_projection_from_whole_schema is infallible in its signature and dispatches all five modules. Its argument order is schema,version, unlike the neighboring projection helpers. Exact physical column layout remains module-defined. (rust/lance-file/src/versions/mod.rs:173-185)

### Lines 186-199

Public reader_projection_from_column_names accepts version,schema,&[&str], delegates all five versions and propagates Result. Missing names and nesting rules belong to concrete builders. (rust/lance-file/src/versions/mod.rs:186-199)

### Lines 200-224

physical_column_count returns usize for one core Field via each exact grammar. data_file_columns returns (Vec<i32>,Vec<i32>) persisted field-to-column entries via each module. No local range checks, normalization or format policy beyond exhaustive matching. (rust/lance-file/src/versions/mod.rs:200-224)

### Lines 225-258

copy_external_metadata_column takes FnOnce()->Send Future<Result<()>>. V1 returns NotSupported and never calls the closure. V2_0 calls only if its schema/index/has-existing-pages predicate allows; otherwise successful no-op. V2_1/2/3 unconditionally call and await once. Closure failure propagates; cancellation does not roll back partial IO here. The concrete V2_0 predicate is now covered: recognized nonpacked logical struct header is skipped when pages already exist; unknown target is treated as nonheader (rust/lance-file/src/versions/v2_0/mod.rs:84-115). (rust/lance-file/src/versions/mod.rs:225-258)

### Lines 259-278

finalize_external_metadata_column takes mutable Vec<PageInfo> and row count. V1 NotSupported; V2_0 calls its infallible normalizer then returns Ok; V2_1/2/3 return Ok without mutating pages. No rollback or byte writes occur in this root. (rust/lance-file/src/versions/mod.rs:259-278)

### Lines 279-314

open_projected_reader: V1 NotSupported without opening either closure; V2_0 always awaits open_full, ignoring prefer_indexed/projection. V2_1/2/3 try open_indexed only when prefer_indexed and FileMetadataProvider::projection_matches_indexed_metadata. Some(reader) returns immediately; None falls back to open_full; Err propagates without fallback. Both closures are FnOnce and Send futures; no concurrent opens. Contextual predicate rejects empty schema and compares checked grammar-count sum to column-index length (rust/lance-file/src/reader.rs:1542-1555), not selectivity alone. (rust/lance-file/src/versions/mod.rs:279-314)

### Lines 315-327

open_self_described_reader takes FileScheduler,Arc<DecoderPlugins>,borrowed LanceCache,FileReaderOptions and awaits FileReader::try_open_for_dispatch with None metadata. Docs say its optimistic tail read detects exact identity without a separate footer probe; shared reader IO/cache orchestration is now analyzed, while delegated backend cost remains unmeasured. Returned enum retains V1 detection rather than constructing a v1 writer/reader here. (rust/lance-file/src/versions/mod.rs:315-327)

### Lines 328-356

create_writer consumes object writer,schema,options, matching exact V2 create_writer and mapping successful concrete writers into FileWriter. V1 NotSupported directs callers to versions::v1::writer::FileWriter with its manifest provider. No local option validation; each concrete creator owns it. Error drops moved inputs; underlying Writer drop/abort guarantees remain pending. (rust/lance-file/src/versions/mod.rs:328-356)

### Lines 357-373

create_lazy_writer consumes object writer/options with no schema. V1 NotSupported says explicit schema/manifest provider required. V2 lazy creators are wrapped in Ok and converted into the corresponding FileWriter variant. Root performs no option/schema validation, IO or first-batch initialization. (rust/lance-file/src/versions/mod.rs:357-373)

### Lines 374-402

encode_self_described_batch and encode_mini_batch borrow EncodedBatch and dispatch to exact V2 encoder Result<Bytes>; V1 returns separate NotSupported messages. No automatic alias resolution or batch-version reconciliation occurs in this root; concrete file framing is now covered in the exact writer/shared structural analyses; codec payload internals remain pending. (rust/lance-file/src/versions/mod.rs:374-402)

### Lines 403-428

Single cfg(test) case constructs empty EncodedBatch (empty data/page table/schema/top-level columns,0rows) and asserts both embedded encoders reject V1 with Error::NotSupported. Messages, V2 bytes, other V1 rejection methods and indexed-open fallback branches are not tested locally. No tests executed. (rust/lance-file/src/versions/mod.rs:403-428)

## Interaction and interpretation limits

All428 lines read. Every local exhaustive dispatch and wrapper contract is authored; exact current-version grammars, writers and shared/V1 readers are analyzed; delegated encoding and backend internals remain pending. Preserve the distinction between policy selection in version.rs, exact identity here and actual page/metadata mechanisms in version modules.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Exact file-format composition roots.
    5 | //!
    6 | //! Each version module lists the mechanisms used by that file format. Callers
    7 | //! resolve release selectors before entering this module. Prefer APIs under a
    8 | //! concrete module such as [`v2_1`] when the version is statically known. The
    9 | //! root functions perform the single exhaustive dispatch for runtime versions.
   10 | 
   11 | use bytes::Bytes;
   12 | use lance_core::{Error, Result, datatypes::Schema};
   13 | use lance_encoding::{
   14 |     decoder::{ColumnInfo, DecoderPlugins, PageInfo},
   15 |     encoder::EncodedBatch,
   16 | };
   17 | use lance_io::{scheduler::FileScheduler, traits::Writer};
   18 | use std::{collections::BTreeMap, future::Future, sync::Arc};
   19 | 
   20 | use crate::{
   21 |     format::pbfile,
   22 |     reader::{
   23 |         BufferDescriptor, CachedFileMetadata, FileMetadataIndex, FileMetadataProvider, FileReader,
   24 |         FileReaderOptions, PreparedProjection, ProjectedFileReader, RawFileMetadata,
   25 |         ReadProjection, ReaderProjection,
   26 |     },
   27 |     version::ConcreteFileVersion,
   28 |     writer::{FileWriter, FileWriterOptions},
   29 | };
   30 | use lance_core::cache::LanceCache;
   31 | 
   32 | pub mod v1;
   33 | pub mod v2_0;
   34 | pub mod v2_1;
   35 | pub mod v2_2;
   36 | pub mod v2_3;
   37 | 
   38 | pub(crate) fn read_projection(version: ConcreteFileVersion) -> Result<Arc<dyn ReadProjection>> {
   39 |     match version {
   40 |         ConcreteFileVersion::V1 => Err(Error::internal(
   41 |             "current reader composition received Lance v1".to_string(),
   42 |         )),
   43 |         ConcreteFileVersion::V2_0 => Ok(v2_0::read_projection()),
   44 |         ConcreteFileVersion::V2_1 => Ok(v2_1::read_projection()),
   45 |         ConcreteFileVersion::V2_2 => Ok(v2_2::read_projection()),
   46 |         ConcreteFileVersion::V2_3 => Ok(v2_3::read_projection()),
   47 |     }
   48 | }
   49 | 
   50 | /// A self-described file reader selected by the exact footer version.
   51 | pub enum OpenedFileReader {
   52 |     /// A v1 file. The persisted footer numbers are retained for diagnostics.
   53 |     V1 {
   54 |         /// The major version stored in the footer.
   55 |         major_version: u16,
   56 |         /// The minor version stored in the footer.
   57 |         minor_version: u16,
   58 |     },
   59 |     /// A current-format reader selected from the exact footer identity.
   60 |     Current(FileReader),
   61 | }
   62 | 
   63 | pub(crate) fn finish_metadata(
   64 |     version: ConcreteFileVersion,
   65 |     metadata: RawFileMetadata,
   66 | ) -> Result<CachedFileMetadata> {
   67 |     match version {
   68 |         ConcreteFileVersion::V1 => Err(Error::internal(
   69 |             "current metadata dispatch received a Lance v1 file".to_string(),
   70 |         )),
   71 |         ConcreteFileVersion::V2_0 => v2_0::finish_metadata(metadata),
   72 |         ConcreteFileVersion::V2_1 => v2_1::finish_metadata(metadata),
   73 |         ConcreteFileVersion::V2_2 => v2_2::finish_metadata(metadata),
   74 |         ConcreteFileVersion::V2_3 => v2_3::finish_metadata(metadata),
   75 |     }
   76 | }
   77 | 
   78 | /// Validate that decoded metadata is a complete rectangular file for an exact
   79 | /// grammar and return its normalized physical row count.
   80 | pub(crate) fn validate_external_metadata(
   81 |     version: ConcreteFileVersion,
   82 |     schema: &Schema,
   83 |     metadata: &CachedFileMetadata,
   84 | ) -> Result<u64> {
   85 |     let projection = reader_projection_from_whole_schema(schema, version);
   86 |     if projection.column_indices.len() != metadata.column_infos.len() {
   87 |         return Err(Error::invalid_input(format!(
   88 |             "schema requires {} physical columns but file metadata contains {}",
   89 |             projection.column_indices.len(),
   90 |             metadata.column_infos.len()
   91 |         )));
   92 |     }
   93 |     FileReader::validate_projection(&projection, metadata)?;
   94 |     for (expected_index, column) in metadata.column_infos.iter().enumerate() {
   95 |         if column.index != expected_index as u32 {
   96 |             return Err(Error::invalid_input(format!(
   97 |                 "physical column {} reports index {}",
   98 |                 expected_index, column.index
   99 |             )));
  100 |         }
  101 |     }
  102 |     let prepared = PreparedProjection {
  103 |         column_infos: metadata.column_infos.clone(),
  104 |         decoder_projection: projection,
  105 |     };
  106 |     read_projection(version)?.read_length(&prepared)
  107 | }
  108 | 
  109 | pub(crate) fn finish_metadata_index(index: FileMetadataIndex) -> Result<FileMetadataIndex> {
  110 |     match index.version {
  111 |         ConcreteFileVersion::V1 => Err(Error::version_conflict(
  112 |             "Attempt to use the Lance current-format reader with a v1 metadata index".to_string(),
  113 |             0,
  114 |             2,
  115 |         )),
  116 |         ConcreteFileVersion::V2_0 => v2_0::finish_metadata_index(index),
  117 |         ConcreteFileVersion::V2_1 => v2_1::finish_metadata_index(index),
  118 |         ConcreteFileVersion::V2_2 => v2_2::finish_metadata_index(index),
  119 |         ConcreteFileVersion::V2_3 => v2_3::finish_metadata_index(index),
  120 |     }
  121 | }
  122 | 
  123 | pub(crate) fn decode_column_metadata(
  124 |     version: ConcreteFileVersion,
  125 |     column_metadatas: &[pbfile::ColumnMetadata],
  126 | ) -> Result<Vec<Arc<ColumnInfo>>> {
  127 |     match version {
  128 |         ConcreteFileVersion::V1 => Err(Error::not_supported(
  129 |             "self-described batches are not part of the Lance v1 grammar".to_string(),
  130 |         )),
  131 |         ConcreteFileVersion::V2_0 => v2_0::decode_column_metadata(column_metadatas),
  132 |         ConcreteFileVersion::V2_1 => v2_1::decode_column_metadata(column_metadatas),
  133 |         ConcreteFileVersion::V2_2 => v2_2::decode_column_metadata(column_metadatas),
  134 |         ConcreteFileVersion::V2_3 => v2_3::decode_column_metadata(column_metadatas),
  135 |     }
  136 | }
  137 | 
  138 | pub(crate) fn validate_global_buffers(
  139 |     version: ConcreteFileVersion,
  140 |     buffers: &[BufferDescriptor],
  141 | ) -> Result<()> {
  142 |     match version {
  143 |         ConcreteFileVersion::V1 => Ok(()),
  144 |         ConcreteFileVersion::V2_0 => v2_0::validate_global_buffers(buffers),
  145 |         ConcreteFileVersion::V2_1 => v2_1::validate_global_buffers(buffers),
  146 |         ConcreteFileVersion::V2_2 => v2_2::validate_global_buffers(buffers),
  147 |         ConcreteFileVersion::V2_3 => v2_3::validate_global_buffers(buffers),
  148 |     }
  149 | }
  150 | 
  151 | pub fn reader_projection_from_field_ids(
  152 |     version: ConcreteFileVersion,
  153 |     schema: &Schema,
  154 |     field_id_to_column_index: &BTreeMap<u32, u32>,
  155 | ) -> Result<ReaderProjection> {
  156 |     Ok(match version {
  157 |         ConcreteFileVersion::V1 => v1::projection_from_field_ids(schema, field_id_to_column_index),
  158 |         ConcreteFileVersion::V2_0 => {
  159 |             v2_0::projection_from_field_ids(schema, field_id_to_column_index)
  160 |         }
  161 |         ConcreteFileVersion::V2_1 => {
  162 |             v2_1::projection_from_field_ids(schema, field_id_to_column_index)
  163 |         }
  164 |         ConcreteFileVersion::V2_2 => {
  165 |             v2_2::projection_from_field_ids(schema, field_id_to_column_index)
  166 |         }
  167 |         ConcreteFileVersion::V2_3 => {
  168 |             v2_3::projection_from_field_ids(schema, field_id_to_column_index)
  169 |         }
  170 |     })
  171 | }
  172 | 
  173 | pub fn reader_projection_from_whole_schema(
  174 |     schema: &Schema,
  175 |     version: ConcreteFileVersion,
  176 | ) -> ReaderProjection {
  177 |     match version {
  178 |         ConcreteFileVersion::V1 => v1::projection_from_whole_schema(schema),
  179 |         ConcreteFileVersion::V2_0 => v2_0::projection_from_whole_schema(schema),
  180 |         ConcreteFileVersion::V2_1 => v2_1::projection_from_whole_schema(schema),
  181 |         ConcreteFileVersion::V2_2 => v2_2::projection_from_whole_schema(schema),
  182 |         ConcreteFileVersion::V2_3 => v2_3::projection_from_whole_schema(schema),
  183 |     }
  184 | }
  185 | 
  186 | pub fn reader_projection_from_column_names(
  187 |     version: ConcreteFileVersion,
  188 |     schema: &Schema,
  189 |     column_names: &[&str],
  190 | ) -> Result<ReaderProjection> {
  191 |     match version {
  192 |         ConcreteFileVersion::V1 => v1::projection_from_column_names(schema, column_names),
  193 |         ConcreteFileVersion::V2_0 => v2_0::projection_from_column_names(schema, column_names),
  194 |         ConcreteFileVersion::V2_1 => v2_1::projection_from_column_names(schema, column_names),
  195 |         ConcreteFileVersion::V2_2 => v2_2::projection_from_column_names(schema, column_names),
  196 |         ConcreteFileVersion::V2_3 => v2_3::projection_from_column_names(schema, column_names),
  197 |     }
  198 | }
  199 | 
  200 | /// Count the physical columns represented by one field in an exact grammar.
  201 | pub fn physical_column_count(
  202 |     version: ConcreteFileVersion,
  203 |     field: &lance_core::datatypes::Field,
  204 | ) -> usize {
  205 |     match version {
  206 |         ConcreteFileVersion::V1 => v1::physical_column_count(field),
  207 |         ConcreteFileVersion::V2_0 => v2_0::physical_column_count(field),
  208 |         ConcreteFileVersion::V2_1 => v2_1::physical_column_count(field),
  209 |         ConcreteFileVersion::V2_2 => v2_2::physical_column_count(field),
  210 |         ConcreteFileVersion::V2_3 => v2_3::physical_column_count(field),
  211 |     }
  212 | }
  213 | 
  214 | /// Build persisted field-to-column entries for an exact grammar.
  215 | pub fn data_file_columns(version: ConcreteFileVersion, schema: &Schema) -> (Vec<i32>, Vec<i32>) {
  216 |     match version {
  217 |         ConcreteFileVersion::V1 => v1::data_file_columns(schema),
  218 |         ConcreteFileVersion::V2_0 => v2_0::data_file_columns(schema),
  219 |         ConcreteFileVersion::V2_1 => v2_1::data_file_columns(schema),
  220 |         ConcreteFileVersion::V2_2 => v2_2::data_file_columns(schema),
  221 |         ConcreteFileVersion::V2_3 => v2_3::data_file_columns(schema),
  222 |     }
  223 | }
  224 | 
  225 | /// Copy one column's external metadata and buffers according to the exact file
  226 | /// grammar.
  227 | ///
  228 | /// The caller supplies the version-free I/O operation. V2.0 may suppress that
  229 | /// operation when a structural header page has already been copied.
  230 | pub async fn copy_external_metadata_column<Copy, CopyFuture>(
  231 |     version: ConcreteFileVersion,
  232 |     schema: &Schema,
  233 |     column_index: usize,
  234 |     has_existing_pages: bool,
  235 |     copy: Copy,
  236 | ) -> Result<()>
  237 | where
  238 |     Copy: FnOnce() -> CopyFuture + Send,
  239 |     CopyFuture: Future<Output = Result<()>> + Send,
  240 | {
  241 |     match version {
  242 |         ConcreteFileVersion::V1 => Err(Error::not_supported(
  243 |             "binary-copy metadata operations are not supported for Lance v1".to_string(),
  244 |         )),
  245 |         ConcreteFileVersion::V2_0 => {
  246 |             if v2_0::should_copy_external_metadata_column(schema, column_index, has_existing_pages)
  247 |             {
  248 |                 copy().await
  249 |             } else {
  250 |                 Ok(())
  251 |             }
  252 |         }
  253 |         ConcreteFileVersion::V2_1 | ConcreteFileVersion::V2_2 | ConcreteFileVersion::V2_3 => {
  254 |             copy().await
  255 |         }
  256 |     }
  257 | }
  258 | 
  259 | /// Normalize one copied column before an exact-version footer is written.
  260 | pub fn finalize_external_metadata_column(
  261 |     version: ConcreteFileVersion,
  262 |     schema: &Schema,
  263 |     column_index: usize,
  264 |     pages: &mut Vec<PageInfo>,
  265 |     num_rows: u64,
  266 | ) -> Result<()> {
  267 |     match version {
  268 |         ConcreteFileVersion::V1 => Err(Error::not_supported(
  269 |             "binary-copy metadata operations are not supported for Lance v1".to_string(),
  270 |         )),
  271 |         ConcreteFileVersion::V2_0 => {
  272 |             v2_0::finalize_external_metadata_column(schema, column_index, pages, num_rows);
  273 |             Ok(())
  274 |         }
  275 |         ConcreteFileVersion::V2_1 | ConcreteFileVersion::V2_2 | ConcreteFileVersion::V2_3 => Ok(()),
  276 |     }
  277 | }
  278 | 
  279 | /// Open a projected reader while keeping exact metadata-form selection in the
  280 | /// file layer.
  281 | ///
  282 | /// `open_indexed` returns `None` when the loaded index is not selective enough
  283 | /// to justify a projected reader. V2.0 never invokes it because indexed
  284 | /// metadata is not part of that reader's accepted grammar.
  285 | pub async fn open_projected_reader<OpenIndexed, IndexedFuture, OpenFull, FullFuture>(
  286 |     version: ConcreteFileVersion,
  287 |     projection: &ReaderProjection,
  288 |     prefer_indexed: bool,
  289 |     open_indexed: OpenIndexed,
  290 |     open_full: OpenFull,
  291 | ) -> Result<ProjectedFileReader>
  292 | where
  293 |     OpenIndexed: FnOnce() -> IndexedFuture + Send,
  294 |     IndexedFuture: Future<Output = Result<Option<ProjectedFileReader>>> + Send,
  295 |     OpenFull: FnOnce() -> FullFuture + Send,
  296 |     FullFuture: Future<Output = Result<ProjectedFileReader>> + Send,
  297 | {
  298 |     match version {
  299 |         ConcreteFileVersion::V1 => Err(Error::not_supported(
  300 |             "projected current-format readers cannot open Lance v1 files".to_string(),
  301 |         )),
  302 |         ConcreteFileVersion::V2_0 => open_full().await,
  303 |         ConcreteFileVersion::V2_1 | ConcreteFileVersion::V2_2 | ConcreteFileVersion::V2_3 => {
  304 |             if prefer_indexed
  305 |                 && FileMetadataProvider::projection_matches_indexed_metadata(projection)
  306 |                 && let Some(reader) = open_indexed().await?
  307 |             {
  308 |                 return Ok(reader);
  309 |             }
  310 |             open_full().await
  311 |         }
  312 |     }
  313 | }
  314 | 
  315 | /// Open a self-described file and dispatch to the matching reader.
  316 | ///
  317 | /// The current-format reader's optimistic tail read is also used for exact
  318 | /// version detection, so current files do not pay for a separate footer probe.
  319 | pub async fn open_self_described_reader(
  320 |     scheduler: FileScheduler,
  321 |     decoder_plugins: Arc<DecoderPlugins>,
  322 |     cache: &LanceCache,
  323 |     options: FileReaderOptions,
  324 | ) -> Result<OpenedFileReader> {
  325 |     FileReader::try_open_for_dispatch(scheduler, None, decoder_plugins, cache, options).await
  326 | }
  327 | 
  328 | /// Create a current-format writer for an exact file version.
  329 | ///
  330 | /// V1 uses [`v1::writer::FileWriter`] directly because its manifest provider is
  331 | /// part of the writer type.
  332 | pub fn create_writer(
  333 |     version: ConcreteFileVersion,
  334 |     object_writer: Box<dyn Writer>,
  335 |     schema: Schema,
  336 |     options: FileWriterOptions,
  337 | ) -> Result<FileWriter> {
  338 |     match version {
  339 |         ConcreteFileVersion::V1 => Err(Error::not_supported(
  340 |             "Lance v1 files must be created with versions::v1::writer::FileWriter".to_string(),
  341 |         )),
  342 |         ConcreteFileVersion::V2_0 => {
  343 |             v2_0::create_writer(object_writer, schema, options).map(Into::into)
  344 |         }
  345 |         ConcreteFileVersion::V2_1 => {
  346 |             v2_1::create_writer(object_writer, schema, options).map(Into::into)
  347 |         }
  348 |         ConcreteFileVersion::V2_2 => {
  349 |             v2_2::create_writer(object_writer, schema, options).map(Into::into)
  350 |         }
  351 |         ConcreteFileVersion::V2_3 => {
  352 |             v2_3::create_writer(object_writer, schema, options).map(Into::into)
  353 |         }
  354 |     }
  355 | }
  356 | 
  357 | /// Create a lazy current-format writer for an exact file version.
  358 | pub fn create_lazy_writer(
  359 |     version: ConcreteFileVersion,
  360 |     object_writer: Box<dyn Writer>,
  361 |     options: FileWriterOptions,
  362 | ) -> Result<FileWriter> {
  363 |     match version {
  364 |         ConcreteFileVersion::V1 => Err(Error::not_supported(
  365 |             "legacy v1 files require an explicit schema and manifest provider".to_string(),
  366 |         )),
  367 |         ConcreteFileVersion::V2_0 => Ok(v2_0::create_lazy_writer(object_writer, options).into()),
  368 |         ConcreteFileVersion::V2_1 => Ok(v2_1::create_lazy_writer(object_writer, options).into()),
  369 |         ConcreteFileVersion::V2_2 => Ok(v2_2::create_lazy_writer(object_writer, options).into()),
  370 |         ConcreteFileVersion::V2_3 => Ok(v2_3::create_lazy_writer(object_writer, options).into()),
  371 |     }
  372 | }
  373 | 
  374 | /// Encode a self-described batch for an exact file version.
  375 | pub fn encode_self_described_batch(
  376 |     version: ConcreteFileVersion,
  377 |     batch: &EncodedBatch,
  378 | ) -> Result<Bytes> {
  379 |     match version {
  380 |         ConcreteFileVersion::V1 => Err(Error::not_supported(
  381 |             "Lance v1 does not support self-described current-format batches".to_string(),
  382 |         )),
  383 |         ConcreteFileVersion::V2_0 => v2_0::encode_self_described_batch(batch),
  384 |         ConcreteFileVersion::V2_1 => v2_1::encode_self_described_batch(batch),
  385 |         ConcreteFileVersion::V2_2 => v2_2::encode_self_described_batch(batch),
  386 |         ConcreteFileVersion::V2_3 => v2_3::encode_self_described_batch(batch),
  387 |     }
  388 | }
  389 | 
  390 | /// Encode a mini-lance batch for an exact file version.
  391 | pub fn encode_mini_batch(version: ConcreteFileVersion, batch: &EncodedBatch) -> Result<Bytes> {
  392 |     match version {
  393 |         ConcreteFileVersion::V1 => Err(Error::not_supported(
  394 |             "Lance v1 does not support mini-lance current-format batches".to_string(),
  395 |         )),
  396 |         ConcreteFileVersion::V2_0 => v2_0::encode_mini_batch(batch),
  397 |         ConcreteFileVersion::V2_1 => v2_1::encode_mini_batch(batch),
  398 |         ConcreteFileVersion::V2_2 => v2_2::encode_mini_batch(batch),
  399 |         ConcreteFileVersion::V2_3 => v2_3::encode_mini_batch(batch),
  400 |     }
  401 | }
  402 | 
  403 | #[cfg(test)]
  404 | mod tests {
  405 |     use std::sync::Arc;
  406 | 
  407 |     use super::*;
  408 | 
  409 |     #[test]
  410 |     fn v1_rejects_current_format_embedded_batches() {
  411 |         let batch = EncodedBatch {
  412 |             data: Bytes::new(),
  413 |             page_table: Vec::new(),
  414 |             schema: Arc::new(Schema::default()),
  415 |             top_level_columns: Vec::new(),
  416 |             num_rows: 0,
  417 |         };
  418 | 
  419 |         assert!(matches!(
  420 |             encode_self_described_batch(ConcreteFileVersion::V1, &batch),
  421 |             Err(Error::NotSupported { .. })
  422 |         ));
  423 |         assert!(matches!(
  424 |             encode_mini_batch(ConcreteFileVersion::V1, &batch),
  425 |             Err(Error::NotSupported { .. })
  426 |         ));
  427 |     }
  428 | }
``````
