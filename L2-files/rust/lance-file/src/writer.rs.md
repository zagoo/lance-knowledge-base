> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-file/src/writer.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `301722a9d08d799682ea0a33d5036a4327c658e29652f04013c1e50b618a58cc`. Reviewed physical lines: 1-294.

[Module](../../../../L1-modules/rust-lance-file-runtime.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public runtime facade and options for current-format file writers, plus external ColumnInfo-to-protobuf conversion. Concrete version writers own encoding, IO, initialization and completion policy. (rust/lance-file/src/writer.rs:1-294)

## Complete range analysis

### Lines 1-22

SPDX/imports connect Arrow arrays/batches, bytes, core schema/errors, encoding column/page metadata, ObjectStore/path and prost Any. field_types is private; structural is crate-visible. ExpectedTypes is reexported pub(crate), FieldTypeMismatch publicly; public declarations inside the private field_types module are not all external API. (rust/lance-file/src/writer.rs:1-22)

### Lines 23-35

PAGE_BUFFER_ALIGNMENT=64 bytes and ENV_LANCE_FILE_WRITER_MAX_PAGE_BYTES exact string are crate-visible constants. This file declares but does not enforce alignment or read the environment. Public FileWriteSummary derives Debug/Clone/Copy/PartialEq/Eq, with public u64 num_rows and size_bytes; construction does not validate either. (rust/lance-file/src/writer.rs:23-35)

### Lines 36-55

Public Debug/Clone/Default FileWriterOptions contains optional u64 data_cache_bytes,max_page_bytes and optional bool keep_original_array. Derived Default leaves all None. Docs say runtime buffering/execution only, budget divided across columns and default8MiB per column; concrete default resolution is outside this file. Docs caution retained Arrow C-interface child arrays can pin whole batches when keeping originals. (rust/lance-file/src/writer.rs:36-55)

### Lines 56-66

Crate-visible validate rejects only max_page_bytes=Some(0) as InvalidInput with exact greater-than-zero message. None or positive pass; data_cache_bytes=0 and either keep_original_array state are not rejected here. No environment parsing or mutual option constraints. (rust/lance-file/src/writer.rs:56-66)

### Lines 67-78

Public FileWriter is an exhaustive enum holding Box of each exact V2_0,V2_1,V2_2,V2_3 Writer. No V1, trait-object variant, default or derives. Runtime methods forward to their matching version without common format policy. (rust/lance-file/src/writer.rs:67-78)

### Lines 79-103

Private column_info_to_metadata walks page_infos in order. Both PageEncoding::Legacy and ::Structural are prost Any-wrapped then serialized to bytes, stored in DirectEncoding; unzip copied (offset,size) pairs, preserve num_rows and priority. Collect all pages fallibly; any Any creation error aborts conversion before writer mutation by its caller. No byte fetching or range validation. (rust/lance-file/src/writer.rs:79-103)

### Lines 104-116

Unzip column-level buffer descriptors and serialize column.encoding as prost Any bytes in DirectEncoding; assemble ColumnMetadata with page vector. ColumnInfo.index is not a protobuf field here, so external column slice order supplies ordering. No consistency, type-url compatibility or row-count check is added in this converter. (rust/lance-file/src/writer.rs:104-116)

### Lines 117-140

Four From<versions::v2_x::Writer> implementations allocate one Box and construct exactly the corresponding FileWriter variant. They consume initialized/lazy concrete writer unchanged, without validation or IO. (rust/lance-file/src/writer.rs:117-140)

### Lines 141-159

with_page_metadata_spill consumes self, unboxes the active writer, calls its consuming builder with shared ObjectStore and owned path, then boxes that same variant again. It adds no validation or writes itself. V2_1/V2_2/V2_3 use the separately analyzed shared structural spill path; V2_0 has a separately analyzed spill implementation: whole-column length-delimited page replay replaces in-memory pages, late setup does not migrate prior pages, and the caller owns sidecar deletion. This facade itself specifies neither threshold nor sidecar cleanup. (rust/lance-file/src/writer.rs:141-159)

### Lines 160-170

write_batches iterates borrowed RecordBatch references and awaits self.write_batch for each sequentially. First error stops later iterations; earlier writer effects are not rolled back. Empty iterator returns Ok. The facade does not collect batches or guarantee each awaited concrete call has flushed buffered bytes. (rust/lance-file/src/writer.rs:160-170)

### Lines 171-190

write_batch and write_column forward asynchronously to the same enum variant, propagating Result. Column index is usize and ArrayRef is moved. No shared type/nullability/row-count/index validation is performed by these dispatch methods; concrete implementations own it. (rust/lance-file/src/writer.rs:171-190)

### Lines 191-212

write_external_buffer forwards borrowed bytes and returns delegated (u64,u64), documented as externally described page/column data. Alignment and tuple semantics beyond concrete writer behavior are not checked here. add_schema_metadata converts key/value Into<String> exactly once then delegates; it returns no Result and does not locally merge a map. (rust/lance-file/src/writer.rs:191-212)

### Lines 213-240

initialize_with_external_columns eagerly converts every Arc<ColumnInfo> to owned protobuf metadata before matching the writer. Conversion failure returns without calling any concrete initializer. Success moves schema/metadata/rows_written to the exact initializer then returns Ok; that call is not fallible in this facade. No local schema-versus-column count, current writer state or metadata-version validation. Partial conversion allocations drop on error. (rust/lance-file/src/writer.rs:213-240)

### Lines 241-260

add_global_buffer moves Bytes to the concrete async writer and propagates u32 index; one-based indexing is a documented contract, not computed here. finish borrows mutably and delegates Result<FileWriteSummary>, documented to close object writer. Repeated finish, flush ordering and durability require concrete implementation analysis. (rust/lance-file/src/writer.rs:241-260)

### Lines 261-280

abort delegates asynchronously and returns unit, so no cleanup error can be surfaced through this facade signature. It adds no cancellation/drop handler. tell delegates asynchronously as Result<u64>, documented current object position, not total buffered data or guaranteed final size. (rust/lance-file/src/writer.rs:261-280)

### Lines 281-294

field_id_to_column_indices borrows the exact writer mapping &[(u32,u32)] without copy or validation. Closing impl is followed by cfg(test),path=writer_tests.rs private module; this facade itself has no inline test bodies. The separate writer_tests.rs is now fully analyzed; it adds a nested private tests module and no production API. (rust/lance-file/src/writer.rs:281-294)

## Interaction and interpretation limits

All294 lines read. All four V2 concrete writer lifecycles, local completion/abort behavior and external metadata handling are covered by the structural-writer and V2_0 compatibility supplements. writer_tests.rs test oracles are fully analyzed. Underlying object-store completion/cleanup remains pending. Public FieldTypeMismatch and private shared checker have separate coverage. No tests/benchmarks/builds were run.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::sync::Arc;
    5 | 
    6 | use arrow_array::{ArrayRef, RecordBatch};
    7 | use bytes::Bytes;
    8 | use lance_core::{Error, Result, datatypes::Schema};
    9 | use lance_encoding::decoder::{ColumnInfo, PageEncoding};
   10 | use lance_io::object_store::ObjectStore;
   11 | use object_store::path::Path;
   12 | use prost::Message;
   13 | use prost_types::Any;
   14 | 
   15 | use crate::{format::pbfile, versions};
   16 | 
   17 | mod field_types;
   18 | pub(crate) mod structural;
   19 | 
   20 | pub(crate) use field_types::ExpectedTypes;
   21 | pub use field_types::FieldTypeMismatch;
   22 | 
   23 | /// Page buffers in current Lance files are aligned to 64 bytes.
   24 | pub(crate) const PAGE_BUFFER_ALIGNMENT: usize = 64;
   25 | pub(crate) const ENV_LANCE_FILE_WRITER_MAX_PAGE_BYTES: &str = "LANCE_FILE_WRITER_MAX_PAGE_BYTES";
   26 | 
   27 | /// Summary of a completed Lance file write.
   28 | #[derive(Debug, Clone, Copy, PartialEq, Eq)]
   29 | pub struct FileWriteSummary {
   30 |     /// The number of rows written to the file.
   31 |     pub num_rows: u64,
   32 |     /// The final size of the file in bytes.
   33 |     pub size_bytes: u64,
   34 | }
   35 | 
   36 | /// Runtime options shared by all current-format writers.
   37 | ///
   38 | /// These options control buffering and execution only. Select the file grammar
   39 | /// by constructing a writer under [`crate::versions`].
   40 | #[derive(Debug, Clone, Default)]
   41 | pub struct FileWriterOptions {
   42 |     /// How many bytes to use for buffering column data.
   43 |     ///
   44 |     /// The budget is divided evenly across columns. The default is 8 MiB per
   45 |     /// column.
   46 |     pub data_cache_bytes: Option<u64>,
   47 |     /// A best-effort maximum encoded page size.
   48 |     pub max_page_bytes: Option<u64>,
   49 |     /// Keep input arrays instead of copying buffered slices.
   50 |     ///
   51 |     /// Do not enable this for arrays arriving through the Arrow C data
   52 |     /// interface because a small child array can keep an entire batch alive.
   53 |     pub keep_original_array: Option<bool>,
   54 | }
   55 | 
   56 | impl FileWriterOptions {
   57 |     pub(crate) fn validate(&self) -> Result<()> {
   58 |         if self.max_page_bytes == Some(0) {
   59 |             return Err(Error::invalid_input(
   60 |                 "max_page_bytes must be greater than 0, got 0",
   61 |             ));
   62 |         }
   63 |         Ok(())
   64 |     }
   65 | }
   66 | 
   67 | /// A type-erased current-format file writer.
   68 | ///
   69 | /// This enum exists for callers that select a concrete file version at
   70 | /// runtime. Each variant owns the complete implementation for exactly one file
   71 | /// grammar; this type only forwards operations without adding format policy.
   72 | pub enum FileWriter {
   73 |     V2_0(Box<versions::v2_0::Writer>),
   74 |     V2_1(Box<versions::v2_1::Writer>),
   75 |     V2_2(Box<versions::v2_2::Writer>),
   76 |     V2_3(Box<versions::v2_3::Writer>),
   77 | }
   78 | 
   79 | fn column_info_to_metadata(column: &ColumnInfo) -> Result<pbfile::ColumnMetadata> {
   80 |     let pages = column
   81 |         .page_infos
   82 |         .iter()
   83 |         .map(|page| {
   84 |             let encoding = match &page.encoding {
   85 |                 PageEncoding::Legacy(encoding) => Any::from_msg(encoding)?.encode_to_vec(),
   86 |                 PageEncoding::Structural(encoding) => Any::from_msg(encoding)?.encode_to_vec(),
   87 |             };
   88 |             let (buffer_offsets, buffer_sizes) =
   89 |                 page.buffer_offsets_and_sizes.iter().copied().unzip();
   90 |             Ok(pbfile::column_metadata::Page {
   91 |                 buffer_offsets,
   92 |                 buffer_sizes,
   93 |                 encoding: Some(pbfile::Encoding {
   94 |                     location: Some(pbfile::encoding::Location::Direct(pbfile::DirectEncoding {
   95 |                         encoding,
   96 |                     })),
   97 |                 }),
   98 |                 length: page.num_rows,
   99 |                 priority: page.priority,
  100 |             })
  101 |         })
  102 |         .collect::<Result<Vec<_>>>()?;
  103 |     let (buffer_offsets, buffer_sizes) = column.buffer_offsets_and_sizes.iter().copied().unzip();
  104 |     let encoding = Any::from_msg(&column.encoding)?.encode_to_vec();
  105 |     Ok(pbfile::ColumnMetadata {
  106 |         pages,
  107 |         buffer_offsets,
  108 |         buffer_sizes,
  109 |         encoding: Some(pbfile::Encoding {
  110 |             location: Some(pbfile::encoding::Location::Direct(pbfile::DirectEncoding {
  111 |                 encoding,
  112 |             })),
  113 |         }),
  114 |     })
  115 | }
  116 | 
  117 | impl From<versions::v2_0::Writer> for FileWriter {
  118 |     fn from(writer: versions::v2_0::Writer) -> Self {
  119 |         Self::V2_0(Box::new(writer))
  120 |     }
  121 | }
  122 | 
  123 | impl From<versions::v2_1::Writer> for FileWriter {
  124 |     fn from(writer: versions::v2_1::Writer) -> Self {
  125 |         Self::V2_1(Box::new(writer))
  126 |     }
  127 | }
  128 | 
  129 | impl From<versions::v2_2::Writer> for FileWriter {
  130 |     fn from(writer: versions::v2_2::Writer) -> Self {
  131 |         Self::V2_2(Box::new(writer))
  132 |     }
  133 | }
  134 | 
  135 | impl From<versions::v2_3::Writer> for FileWriter {
  136 |     fn from(writer: versions::v2_3::Writer) -> Self {
  137 |         Self::V2_3(Box::new(writer))
  138 |     }
  139 | }
  140 | 
  141 | impl FileWriter {
  142 |     /// Spill page metadata to a sidecar file.
  143 |     pub fn with_page_metadata_spill(self, object_store: Arc<ObjectStore>, path: Path) -> Self {
  144 |         match self {
  145 |             Self::V2_0(writer) => Self::V2_0(Box::new(
  146 |                 (*writer).with_page_metadata_spill(object_store, path),
  147 |             )),
  148 |             Self::V2_1(writer) => Self::V2_1(Box::new(
  149 |                 (*writer).with_page_metadata_spill(object_store, path),
  150 |             )),
  151 |             Self::V2_2(writer) => Self::V2_2(Box::new(
  152 |                 (*writer).with_page_metadata_spill(object_store, path),
  153 |             )),
  154 |             Self::V2_3(writer) => Self::V2_3(Box::new(
  155 |                 (*writer).with_page_metadata_spill(object_store, path),
  156 |             )),
  157 |         }
  158 |     }
  159 | 
  160 |     /// Schedule batches of data to be written to the file.
  161 |     pub async fn write_batches(
  162 |         &mut self,
  163 |         batches: impl Iterator<Item = &RecordBatch>,
  164 |     ) -> Result<()> {
  165 |         for batch in batches {
  166 |             self.write_batch(batch).await?;
  167 |         }
  168 |         Ok(())
  169 |     }
  170 | 
  171 |     /// Schedule a batch of data to be written to the file.
  172 |     pub async fn write_batch(&mut self, batch: &RecordBatch) -> Result<()> {
  173 |         match self {
  174 |             Self::V2_0(writer) => writer.write_batch(batch).await,
  175 |             Self::V2_1(writer) => writer.write_batch(batch).await,
  176 |             Self::V2_2(writer) => writer.write_batch(batch).await,
  177 |             Self::V2_3(writer) => writer.write_batch(batch).await,
  178 |         }
  179 |     }
  180 | 
  181 |     /// Write one top-level column.
  182 |     pub async fn write_column(&mut self, column_index: usize, array: ArrayRef) -> Result<()> {
  183 |         match self {
  184 |             Self::V2_0(writer) => writer.write_column(column_index, array).await,
  185 |             Self::V2_1(writer) => writer.write_column(column_index, array).await,
  186 |             Self::V2_2(writer) => writer.write_column(column_index, array).await,
  187 |             Self::V2_3(writer) => writer.write_column(column_index, array).await,
  188 |         }
  189 |     }
  190 | 
  191 |     /// Append a buffer whose page or column metadata is supplied externally.
  192 |     pub async fn write_external_buffer(&mut self, bytes: &[u8]) -> Result<(u64, u64)> {
  193 |         match self {
  194 |             Self::V2_0(writer) => writer.write_external_buffer(bytes).await,
  195 |             Self::V2_1(writer) => writer.write_external_buffer(bytes).await,
  196 |             Self::V2_2(writer) => writer.write_external_buffer(bytes).await,
  197 |             Self::V2_3(writer) => writer.write_external_buffer(bytes).await,
  198 |         }
  199 |     }
  200 | 
  201 |     /// Add a metadata entry to the schema.
  202 |     pub fn add_schema_metadata(&mut self, key: impl Into<String>, value: impl Into<String>) {
  203 |         let key = key.into();
  204 |         let value = value.into();
  205 |         match self {
  206 |             Self::V2_0(writer) => writer.add_schema_metadata(key, value),
  207 |             Self::V2_1(writer) => writer.add_schema_metadata(key, value),
  208 |             Self::V2_2(writer) => writer.add_schema_metadata(key, value),
  209 |             Self::V2_3(writer) => writer.add_schema_metadata(key, value),
  210 |         }
  211 |     }
  212 | 
  213 |     /// Prepare a writer from encoded columns whose buffers were produced externally.
  214 |     pub fn initialize_with_external_columns(
  215 |         &mut self,
  216 |         schema: Schema,
  217 |         columns: &[Arc<ColumnInfo>],
  218 |         rows_written: u64,
  219 |     ) -> Result<()> {
  220 |         let column_metadata = columns
  221 |             .iter()
  222 |             .map(|column| column_info_to_metadata(column))
  223 |             .collect::<Result<Vec<_>>>()?;
  224 |         match self {
  225 |             Self::V2_0(writer) => {
  226 |                 writer.initialize_with_external_metadata(schema, column_metadata, rows_written)
  227 |             }
  228 |             Self::V2_1(writer) => {
  229 |                 writer.initialize_with_external_metadata(schema, column_metadata, rows_written)
  230 |             }
  231 |             Self::V2_2(writer) => {
  232 |                 writer.initialize_with_external_metadata(schema, column_metadata, rows_written)
  233 |             }
  234 |             Self::V2_3(writer) => {
  235 |                 writer.initialize_with_external_metadata(schema, column_metadata, rows_written)
  236 |             }
  237 |         }
  238 |         Ok(())
  239 |     }
  240 | 
  241 |     /// Add an arbitrary global buffer and return its one-based index.
  242 |     pub async fn add_global_buffer(&mut self, buffer: Bytes) -> Result<u32> {
  243 |         match self {
  244 |             Self::V2_0(writer) => writer.add_global_buffer(buffer).await,
  245 |             Self::V2_1(writer) => writer.add_global_buffer(buffer).await,
  246 |             Self::V2_2(writer) => writer.add_global_buffer(buffer).await,
  247 |             Self::V2_3(writer) => writer.add_global_buffer(buffer).await,
  248 |         }
  249 |     }
  250 | 
  251 |     /// Finish the file and close its object writer.
  252 |     pub async fn finish(&mut self) -> Result<FileWriteSummary> {
  253 |         match self {
  254 |             Self::V2_0(writer) => writer.finish().await,
  255 |             Self::V2_1(writer) => writer.finish().await,
  256 |             Self::V2_2(writer) => writer.finish().await,
  257 |             Self::V2_3(writer) => writer.finish().await,
  258 |         }
  259 |     }
  260 | 
  261 |     /// Abandon the file write.
  262 |     pub async fn abort(&mut self) {
  263 |         match self {
  264 |             Self::V2_0(writer) => writer.abort().await,
  265 |             Self::V2_1(writer) => writer.abort().await,
  266 |             Self::V2_2(writer) => writer.abort().await,
  267 |             Self::V2_3(writer) => writer.abort().await,
  268 |         }
  269 |     }
  270 | 
  271 |     /// Return the current object-writer position.
  272 |     pub async fn tell(&mut self) -> Result<u64> {
  273 |         match self {
  274 |             Self::V2_0(writer) => writer.tell().await,
  275 |             Self::V2_1(writer) => writer.tell().await,
  276 |             Self::V2_2(writer) => writer.tell().await,
  277 |             Self::V2_3(writer) => writer.tell().await,
  278 |         }
  279 |     }
  280 | 
  281 |     /// Return the field-id to physical-column mapping.
  282 |     pub fn field_id_to_column_indices(&self) -> &[(u32, u32)] {
  283 |         match self {
  284 |             Self::V2_0(writer) => writer.field_id_to_column_indices(),
  285 |             Self::V2_1(writer) => writer.field_id_to_column_indices(),
  286 |             Self::V2_2(writer) => writer.field_id_to_column_indices(),
  287 |             Self::V2_3(writer) => writer.field_id_to_column_indices(),
  288 |         }
  289 |     }
  290 | }
  291 | 
  292 | #[cfg(test)]
  293 | #[path = "writer_tests.rs"]
  294 | mod writer_tests;
``````
