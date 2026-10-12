> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md).

# rust/lance-file/src/versions/v2_3/writer.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `ee48e2401a2a6e0a4d8104aa40c88aecc30fbcb394a4d9c08577219de2ff406e`. Reviewed physical lines: 1-224.

[Module](../../../../../../L1-modules/rust-lance-file-structural-writer.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Public concrete V2_3 Writer is reexported by its parent version module. It selects the exact encoding strategy, sequences shared structural writer mechanisms, and owns literal footer identity (2,3). Private helpers initialize schema/encoding state; public methods expose batch, column, external metadata, global buffer and finish operations. concat_lance_footer is public inside a private child module and reached through parent batch helpers. (rust/lance-file/src/versions/v2_3/writer.rs:1-224)

## Complete range analysis

### Lines 1-25

SPDX/imports connect Arc, Arrow arrays/batches, Bytes/BufMut, core Schema/Result, compression parameters, BatchEncoder/EncodedBatch, object store/writer/path, Tokio async writes, generated metadata/MAGIC and shared sink/pipeline/body functions. super::encoding_strategy supplies exact version composition. (rust/lance-file/src/versions/v2_3/writer.rs:1-25)

### Lines 26-38

Public Writer owns private StructuralFileSink, EncodingPipeline and CompressionParams. It has no Clone/Debug derive or local Drop implementation. Documentation assigns exact V2_3 composition, finish order and footer identity to this wrapper; shared components do not choose its version. (rust/lance-file/src/versions/v2_3/writer.rs:26-38)

### Lines 39-58

try_new delegates explicit-schema construction with default CompressionParams. try_new_with_compression first creates a lazy writer, then initializes it and returns Result. Initialization failure drops that temporary owned writer; no explicit async abort/cleanup is awaited here. (rust/lance-file/src/versions/v2_3/writer.rs:39-58)

### Lines 59-77

new_lazy supplies default compression. new_lazy_with_compression constructs a sink from the owned object writer and a pipeline from options, storing compression unchanged. It is infallible and does not validate options/schema, create encoders or perform IO. (rust/lance-file/src/versions/v2_3/writer.rs:59-77)

### Lines 78-94

Private initialize orders option validation, encoding_options computation, schema.validate, exact strategy creation from cloned compression, BatchEncoder::try_new, then pipeline initialization. A supplied cache budget with an empty schema can divide by zero during option computation before schema validation (rust/lance-file/src/writer/structural.rs:414-419). ensure_initialized converts the first RecordBatch Arrow schema only when schema is absent, then calls initialize; an empty batch can still initialize. (rust/lance-file/src/versions/v2_3/writer.rs:78-94)

### Lines 95-110

Consuming with_page_metadata_spill sets sink Pending and returns self; it adds no timing/state guard. write_batches awaits write_batch for each borrowed batch in iterator order and stops on first error; an empty iterator performs no initialization or IO. (rust/lance-file/src/versions/v2_3/writer.rs:95-110)

### Lines 111-124

write_batch ensures initialization, then delegates to pipeline. write_column delegates directly, without lazy schema inference; it requires an existing schema and uses a top-level field index, not a physical column index. It advances only that field through the shared pipeline and can create unequal field lengths. (rust/lance-file/src/versions/v2_3/writer.rs:111-124)

### Lines 125-134

write_external_buffer directly delegates to the sink alignment/write method and returns position/length. add_schema_metadata delegates insertion into the pipeline map. Neither requires schema initialization or validates that later external metadata actually refers to written bytes. (rust/lance-file/src/versions/v2_3/writer.rs:125-134)

### Lines 135-150

initialize_with_external_metadata returns unit: update pipeline schema/declared row count, then replace sink metadata. It does not validate schema/options/grammar, recreate/reset existing encoders or rebuild field mapping. add_global_buffer immediately writes via sink and returns one-based user-buffer index; descriptor later occupies table index0. (rust/lance-file/src/versions/v2_3/writer.rs:135-150)

### Lines 151-170

finish for V2_3 awaits pipeline flush then finish_encoders, constructs descriptor, writes descriptor/global table entries, obtains column-metadata start, writes all column metadata, then column offset table followed by global offset table. num_global_buffers is unchecked len as u32; sink supplies its declared column count. Failures propagate at each step with no local rollback/finished flag. Even a never-initialized lazy writer first flushes the sink before descriptor creation rejects unknown schema. (rust/lance-file/src/versions/v2_3/writer.rs:151-170)

### Lines 171-187

Footer fields in order: u64 LE column_metadata_start, column_metadata_offsets_start, global_buffer_offsets_start; u32 LE global-buffer count and column count; u16 LE major2 and minor3; four-byte MAGIC LANC. Total40 bytes (rust/lance-file/src/format.rs:33-33). Return pipeline rows_written with size from awaited object shutdown. No checksum, terminator retry guard, uniform field-length validation or explicit footer alignment is added. A partial footer or shutdown error does not restore consumed encoders/metadata. (rust/lance-file/src/versions/v2_3/writer.rs:171-187)

### Lines 188-202

Public async abort(&mut self) has an empty body and does not drop, replace, shutdown or abort the owned sink. Its comment refers to dropping a multipart ObjectWriter, which this call does not do. tell delegates current object position, not durable size. field_id_to_column_indices borrows pipeline mapping unchanged. No local state machine prevents writes/finish calls afterward. (rust/lance-file/src/versions/v2_3/writer.rs:188-202)

### Lines 203-224

concat_lance_footer borrows EncodedBatch, calls shared encode_batch_body(batch,write_schema), appends the same40-byte footer with literal(2,3), then freezes BytesMut. It performs no IO or exact-version grammar validation; it assumes supplied batch data/metadata fit this version. Shared body conversion retains given descriptors and optional schema; parent chooses self-described versus mini mode. (rust/lance-file/src/versions/v2_3/writer.rs:203-224)

## Interaction and interpretation limits

All 224 physical lines read in ANALYZE55. Local lifecycle and shared pipeline are covered; all six fixture bytes are interpreted; encoding algorithms, underlying object-writer durability/cancellation and Dataset commit remain pending. No tests, benchmarks, build or unsafe code in this file; source was not modified or executed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::sync::Arc;
    5 | 
    6 | use arrow_array::{ArrayRef, RecordBatch};
    7 | use bytes::{BufMut, Bytes};
    8 | use lance_core::{Result, datatypes::Schema};
    9 | use lance_encoding::{
   10 |     compression_config::CompressionParams,
   11 |     encoder::{BatchEncoder, EncodedBatch},
   12 | };
   13 | use lance_io::{object_store::ObjectStore, traits::Writer as ObjectWriter};
   14 | use object_store::path::Path;
   15 | use tokio::io::AsyncWriteExt;
   16 | 
   17 | use crate::{
   18 |     format::{MAGIC, pbfile},
   19 |     writer::{
   20 |         FileWriteSummary, FileWriterOptions,
   21 |         structural::{EncodedBatchBody, EncodingPipeline, StructuralFileSink, encode_batch_body},
   22 |     },
   23 | };
   24 | 
   25 | use super::encoding_strategy;
   26 | 
   27 | /// A writer for the Lance v2.3 file grammar.
   28 | ///
   29 | /// The concrete writer owns the v2.3 encoding composition, finish ordering,
   30 | /// and exact footer identity. Shared components only execute the structural
   31 | /// encoding and I/O mechanisms selected here.
   32 | pub struct Writer {
   33 |     sink: StructuralFileSink,
   34 |     encoding: EncodingPipeline,
   35 |     compression: CompressionParams,
   36 | }
   37 | 
   38 | impl Writer {
   39 |     /// Create a v2.3 writer with an explicit schema.
   40 |     pub fn try_new(
   41 |         object_writer: Box<dyn ObjectWriter>,
   42 |         schema: Schema,
   43 |         options: FileWriterOptions,
   44 |     ) -> Result<Self> {
   45 |         Self::try_new_with_compression(object_writer, schema, options, Default::default())
   46 |     }
   47 | 
   48 |     /// Create a v2.3 writer with explicit compression tuning.
   49 |     pub fn try_new_with_compression(
   50 |         object_writer: Box<dyn ObjectWriter>,
   51 |         schema: Schema,
   52 |         options: FileWriterOptions,
   53 |         compression: CompressionParams,
   54 |     ) -> Result<Self> {
   55 |         let mut writer = Self::new_lazy_with_compression(object_writer, options, compression);
   56 |         writer.initialize(schema)?;
   57 |         Ok(writer)
   58 |     }
   59 | 
   60 |     /// Create a v2.3 writer whose schema is inferred from the first batch.
   61 |     pub fn new_lazy(object_writer: Box<dyn ObjectWriter>, options: FileWriterOptions) -> Self {
   62 |         Self::new_lazy_with_compression(object_writer, options, Default::default())
   63 |     }
   64 | 
   65 |     /// Create a lazy v2.3 writer with explicit compression tuning.
   66 |     pub fn new_lazy_with_compression(
   67 |         object_writer: Box<dyn ObjectWriter>,
   68 |         options: FileWriterOptions,
   69 |         compression: CompressionParams,
   70 |     ) -> Self {
   71 |         Self {
   72 |             sink: StructuralFileSink::new(object_writer),
   73 |             encoding: EncodingPipeline::new(options),
   74 |             compression,
   75 |         }
   76 |     }
   77 | 
   78 |     fn initialize(&mut self, schema: Schema) -> Result<()> {
   79 |         self.encoding.validate_options()?;
   80 |         let encoding_options = self.encoding.encoding_options(&schema);
   81 |         schema.validate()?;
   82 |         let strategy = encoding_strategy(self.compression.clone());
   83 |         let encoder = BatchEncoder::try_new(&schema, strategy.as_ref(), &encoding_options)?;
   84 |         self.encoding.initialize(schema, encoder, &mut self.sink);
   85 |         Ok(())
   86 |     }
   87 | 
   88 |     fn ensure_initialized(&mut self, batch: &RecordBatch) -> Result<()> {
   89 |         if !self.encoding.is_initialized() {
   90 |             self.initialize(Schema::try_from(batch.schema().as_ref())?)?;
   91 |         }
   92 |         Ok(())
   93 |     }
   94 | 
   95 |     /// Spill page metadata to a sidecar file instead of retaining it in memory.
   96 |     pub fn with_page_metadata_spill(mut self, object_store: Arc<ObjectStore>, path: Path) -> Self {
   97 |         self.sink.with_page_metadata_spill(object_store, path);
   98 |         self
   99 |     }
  100 | 
  101 |     /// Schedule batches to be written in iteration order.
  102 |     pub async fn write_batches(
  103 |         &mut self,
  104 |         batches: impl Iterator<Item = &RecordBatch>,
  105 |     ) -> Result<()> {
  106 |         for batch in batches {
  107 |             self.write_batch(batch).await?;
  108 |         }
  109 |         Ok(())
  110 |     }
  111 | 
  112 |     /// Schedule one record batch for writing.
  113 |     pub async fn write_batch(&mut self, batch: &RecordBatch) -> Result<()> {
  114 |         self.ensure_initialized(batch)?;
  115 |         self.encoding.write_batch(batch, &mut self.sink).await
  116 |     }
  117 | 
  118 |     /// Write one top-level field, advancing only that field's row count.
  119 |     pub async fn write_column(&mut self, column_index: usize, array: ArrayRef) -> Result<()> {
  120 |         self.encoding
  121 |             .write_column(column_index, array, &mut self.sink)
  122 |             .await
  123 |     }
  124 | 
  125 |     /// Append a buffer whose page or column metadata is supplied externally.
  126 |     pub async fn write_external_buffer(&mut self, bytes: &[u8]) -> Result<(u64, u64)> {
  127 |         self.sink.write_external_buffer(bytes).await
  128 |     }
  129 | 
  130 |     /// Add an entry to the schema metadata written in the file descriptor.
  131 |     pub fn add_schema_metadata(&mut self, key: impl Into<String>, value: impl Into<String>) {
  132 |         self.encoding.add_schema_metadata(key, value);
  133 |     }
  134 | 
  135 |     /// Prepare the writer for encoded column data produced externally.
  136 |     pub fn initialize_with_external_metadata(
  137 |         &mut self,
  138 |         schema: Schema,
  139 |         column_metadata: Vec<pbfile::ColumnMetadata>,
  140 |         rows_written: u64,
  141 |     ) {
  142 |         self.encoding
  143 |             .initialize_with_external_metadata(schema, rows_written);
  144 |         self.sink.initialize_with_external_metadata(column_metadata);
  145 |     }
  146 | 
  147 |     /// Add an arbitrary global buffer and return its one-based index.
  148 |     pub async fn add_global_buffer(&mut self, buffer: Bytes) -> Result<u32> {
  149 |         self.sink.add_global_buffer(buffer).await
  150 |     }
  151 | 
  152 |     /// Finish the v2.3 file and close its object writer.
  153 |     pub async fn finish(&mut self) -> Result<FileWriteSummary> {
  154 |         // The order below is the v2.3 wire contract.
  155 |         self.encoding.flush(&mut self.sink).await?;
  156 |         self.encoding.finish_encoders(&mut self.sink).await?;
  157 | 
  158 |         let descriptor = self.encoding.make_file_descriptor()?;
  159 |         let global_buffer_offsets = self.sink.write_global_buffers(descriptor).await?;
  160 |         let num_global_buffers = global_buffer_offsets.len() as u32;
  161 | 
  162 |         let column_metadata_start = self.sink.tell().await?;
  163 |         let column_metadata_offsets = self.sink.write_column_metadatas().await?;
  164 |         let column_metadata_offsets_start = self
  165 |             .sink
  166 |             .write_offset_table(&column_metadata_offsets)
  167 |             .await?;
  168 |         let global_buffer_offsets_start =
  169 |             self.sink.write_offset_table(&global_buffer_offsets).await?;
  170 |         let num_columns = self.sink.num_columns();
  171 | 
  172 |         let output = self.sink.output_mut();
  173 |         output.write_u64_le(column_metadata_start).await?;
  174 |         output.write_u64_le(column_metadata_offsets_start).await?;
  175 |         output.write_u64_le(global_buffer_offsets_start).await?;
  176 |         output.write_u32_le(num_global_buffers).await?;
  177 |         output.write_u32_le(num_columns).await?;
  178 |         output.write_u16_le(2).await?;
  179 |         output.write_u16_le(3).await?;
  180 |         output.write_all(MAGIC).await?;
  181 | 
  182 |         Ok(FileWriteSummary {
  183 |             num_rows: self.encoding.rows_written(),
  184 |             size_bytes: self.sink.shutdown().await?,
  185 |         })
  186 |     }
  187 | 
  188 |     /// Abandon this write.
  189 |     pub async fn abort(&mut self) {
  190 |         // Dropping a multipart ObjectWriter aborts the upload.
  191 |     }
  192 | 
  193 |     /// Return the current object-writer position.
  194 |     pub async fn tell(&mut self) -> Result<u64> {
  195 |         self.sink.tell().await
  196 |     }
  197 | 
  198 |     /// Return the field-id to physical-column mapping selected by v2.3.
  199 |     pub fn field_id_to_column_indices(&self) -> &[(u32, u32)] {
  200 |         self.encoding.field_id_to_column_indices()
  201 |     }
  202 | }
  203 | 
  204 | /// Append a self-described or mini-lance v2.3 footer to an encoded batch.
  205 | pub fn concat_lance_footer(batch: &EncodedBatch, write_schema: bool) -> Result<Bytes> {
  206 |     let EncodedBatchBody {
  207 |         mut data,
  208 |         column_metadata_start,
  209 |         column_metadata_offsets_start,
  210 |         global_buffer_offsets_start,
  211 |         num_global_buffers,
  212 |         num_columns,
  213 |     } = encode_batch_body(batch, write_schema)?;
  214 | 
  215 |     data.put_u64_le(column_metadata_start);
  216 |     data.put_u64_le(column_metadata_offsets_start);
  217 |     data.put_u64_le(global_buffer_offsets_start);
  218 |     data.put_u32_le(num_global_buffers);
  219 |     data.put_u32_le(num_columns);
  220 |     data.put_u16_le(2);
  221 |     data.put_u16_le(3);
  222 |     data.extend_from_slice(MAGIC);
  223 |     Ok(data.freeze())
  224 | }
``````
