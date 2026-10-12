> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md).

# rust/lance-file/src/versions/v2_3/mod.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `44f1af5b511f270c95ec89e0d209c615439df1606090e643f6a3c3dd48849aaf`. Reviewed physical lines: 1-200.

[Module](../../../../../../L1-modules/rust-lance-file-composition.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Public V2_3 composition module. It selects an ordered field-encoder and page-mechanism policy, reexports its exact reader/writer surface, and delegates physical column mapping to shared structural code. (rust/lance-file/src/versions/v2_3/mod.rs:1-200)

## Complete range analysis

### Lines 1-41

SPDX/version docs/imports mirror structural V2_2 selection plus AtomicBool/Ordering. Private compression/reader/writer own exact mechanisms. Arc shares policies and ReadProjection; object Writer is consumed only by factory calls. (rust/lance-file/src/versions/v2_3/mod.rs:1-41)

### Lines 42-55

Metadata decode/finish/index/global-buffer reexports are pub(crate); projection constructors and Writer public. read_projection composes shared structural engine with V2_3 reader::decode_column. Private process static WARNED_ON_UNSTABLE_FORMAT starts false; it is not per-writer, per-file or persistent configuration. (rust/lance-file/src/versions/v2_3/mod.rs:42-55)

### Lines 56-69

Public physical_column_count/data_file_columns and pub(super) field_id_to_column_index directly delegate shared leaf mapping. This module adds no separate column numbering or checked arithmetic. (rust/lance-file/src/versions/v2_3/mod.rs:56-69)

### Lines 70-91

Private Debug FieldStrategy owns primitive. Trait create_field_encoder tries binary Blob then structural Blob, propagating errors and returning first Some. Mutable column-index state is shared across candidates; no rollback is added here. (rust/lance-file/src/versions/v2_3/mod.rs:70-91)

### Lines 92-111

Unhandled Blob returns InvalidInput with name/datatype. Map then structural fixed-size-list then primitive are tried in that exact order, each short-circuiting. These helper names identify delegation, not universal type support. (rust/lance-file/src/versions/v2_3/mod.rs:92-111)

### Lines 112-128

Try list then struct, finally NotSupported identifying Lance v2.3/field/datatype. No data compression or asynchronous work is performed in this dispatcher itself. (rust/lance-file/src/versions/v2_3/mod.rs:112-128)

### Lines 129-140

encoding_strategy consumes tuning into Arc<compression::Strategy>, gives an Arc clone to sparse mechanism, then adds constant() with no compression argument and gives the original compression Arc to dense_u32. Only sparse and dense share this policy Arc. Ordered page choices are sparse, constant, dense_u32; no reject_sparse mechanism. Construction does not emit instability warning. (rust/lance-file/src/versions/v2_3/mod.rs:129-140)

### Lines 141-151

warn_unstable_format compare_exchange(false,true,Relaxed,Relaxed) makes at most one caller execute log::warn per process static lifetime; failed exchanges are ignored. Relaxed ordering is adequate for warning deduplication and publishes no other state. Warning says development/experimentation only and future unreadability; static becomes true even if logs filtered or later writer creation fails. (rust/lance-file/src/versions/v2_3/mod.rs:141-151)

### Lines 152-172

Eager create_writer and create_writer_with_compression call warning before corresponding fallible Writer factory. Warning is neither a format rejection nor evidence of successful file creation. Inputs moved, errors propagate. Direct use of public Writer or footer helpers is not guarded by these wrapper calls. (rust/lance-file/src/versions/v2_3/mod.rs:152-172)

### Lines 173-191

Lazy create_writer variants also warn before concrete infallible new_lazy methods, with/without explicit tuning. They can log before any batch/schema/file output exists. (rust/lance-file/src/versions/v2_3/mod.rs:173-191)

### Lines 192-200

Self-described and mini batch helpers call exact concat_lance_footer true/false and do not call warn_unstable_format. Both return Result<Bytes>; no inline tests or unsafe code. (rust/lance-file/src/versions/v2_3/mod.rs:192-200)

## Interaction and interpretation limits

Every physical line was read in ANALYZE53. No source execution/build/test was performed. Exact current-version reader/writer bodies are analyzed; delegated compression/encoder helper internals remain pending; delegated calls are not evidence of their full behavior. 

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Lance v2.3 file composition.
    5 | 
    6 | use std::{
    7 |     collections::BTreeMap,
    8 |     sync::{
    9 |         Arc,
   10 |         atomic::{AtomicBool, Ordering},
   11 |     },
   12 | };
   13 | 
   14 | use bytes::Bytes;
   15 | use lance_core::{
   16 |     Error, Result,
   17 |     datatypes::{Field, Schema},
   18 | };
   19 | use lance_encoding::{
   20 |     compression_config::CompressionParams,
   21 |     encoder::{
   22 |         ColumnIndexSequence, EncodedBatch, FieldEncoder, FieldEncodingContext,
   23 |         FieldEncodingStrategy,
   24 |         structural::{
   25 |             PrimitiveFieldEncoding, PrimitivePageEncoding, try_create_binary_blob, try_create_list,
   26 |             try_create_map, try_create_struct, try_create_structural_blob,
   27 |             try_create_structural_fixed_size_list,
   28 |         },
   29 |     },
   30 | };
   31 | use lance_io::traits::Writer as ObjectWriter;
   32 | 
   33 | use crate::{
   34 |     reader::{ReadProjection, structural},
   35 |     writer::FileWriterOptions,
   36 | };
   37 | 
   38 | mod compression;
   39 | mod reader;
   40 | mod writer;
   41 | 
   42 | pub(crate) use reader::{
   43 |     decode_column_metadata, finish_metadata, finish_metadata_index, validate_global_buffers,
   44 | };
   45 | pub use reader::{
   46 |     projection_from_column_names, projection_from_field_ids, projection_from_whole_schema,
   47 | };
   48 | 
   49 | pub(crate) fn read_projection() -> Arc<dyn ReadProjection> {
   50 |     structural::read_projection(reader::decode_column)
   51 | }
   52 | pub use writer::Writer;
   53 | 
   54 | static WARNED_ON_UNSTABLE_FORMAT: AtomicBool = AtomicBool::new(false);
   55 | 
   56 | /// Count physical columns represented by a field in a v2.3 footer.
   57 | pub fn physical_column_count(field: &Field) -> usize {
   58 |     structural::physical_column_count(field)
   59 | }
   60 | 
   61 | /// Build persisted field-to-column entries for a v2.3 data file.
   62 | pub fn data_file_columns(schema: &Schema) -> (Vec<i32>, Vec<i32>) {
   63 |     structural::data_file_columns(schema)
   64 | }
   65 | 
   66 | pub(super) fn field_id_to_column_index(schema: &Schema) -> BTreeMap<u32, u32> {
   67 |     structural::field_id_to_column_index(schema)
   68 | }
   69 | 
   70 | #[derive(Debug)]
   71 | struct FieldStrategy {
   72 |     primitive: PrimitiveFieldEncoding,
   73 | }
   74 | 
   75 | impl FieldEncodingStrategy for FieldStrategy {
   76 |     fn create_field_encoder(
   77 |         &self,
   78 |         field: &Field,
   79 |         column_index: &mut ColumnIndexSequence,
   80 |         context: &FieldEncodingContext<'_>,
   81 |     ) -> Result<Box<dyn FieldEncoder>> {
   82 |         if let Some(encoder) =
   83 |             try_create_binary_blob(&self.primitive, field, column_index, context)?
   84 |         {
   85 |             return Ok(encoder);
   86 |         }
   87 |         if let Some(encoder) =
   88 |             try_create_structural_blob(&self.primitive, field, column_index, context)?
   89 |         {
   90 |             return Ok(encoder);
   91 |         }
   92 |         if field.is_blob() {
   93 |             return Err(Error::invalid_input_source(
   94 |                 format!(
   95 |                     "Blob encoding is not available for field '{}' with data type {}",
   96 |                     field.name,
   97 |                     field.data_type()
   98 |                 )
   99 |                 .into(),
  100 |             ));
  101 |         }
  102 |         if let Some(encoder) = try_create_map(field, column_index, context)? {
  103 |             return Ok(encoder);
  104 |         }
  105 |         if let Some(encoder) = try_create_structural_fixed_size_list(field, column_index, context)?
  106 |         {
  107 |             return Ok(encoder);
  108 |         }
  109 |         if let Some(encoder) = self.primitive.try_create(field, column_index, context)? {
  110 |             return Ok(encoder);
  111 |         }
  112 |         if let Some(encoder) = try_create_list(field, column_index, context)? {
  113 |             return Ok(encoder);
  114 |         }
  115 |         if let Some(encoder) = try_create_struct(field, column_index, context)? {
  116 |             return Ok(encoder);
  117 |         }
  118 |         Err(Error::not_supported_source(
  119 |             format!(
  120 |                 "Lance v2.3 has no field encoding for '{}' with data type {}",
  121 |                 field.name,
  122 |                 field.data_type()
  123 |             )
  124 |             .into(),
  125 |         ))
  126 |     }
  127 | }
  128 | 
  129 | /// Compose the v2.3 field encoding mechanisms.
  130 | pub fn encoding_strategy(params: CompressionParams) -> Arc<dyn FieldEncodingStrategy> {
  131 |     let compression = Arc::new(compression::Strategy::new(params));
  132 |     Arc::new(FieldStrategy {
  133 |         primitive: PrimitiveFieldEncoding::new([
  134 |             PrimitivePageEncoding::sparse(compression.clone()),
  135 |             PrimitivePageEncoding::constant(),
  136 |             PrimitivePageEncoding::dense_u32(compression),
  137 |         ]),
  138 |     })
  139 | }
  140 | 
  141 | fn warn_unstable_format() {
  142 |     if WARNED_ON_UNSTABLE_FORMAT
  143 |         .compare_exchange(false, true, Ordering::Relaxed, Ordering::Relaxed)
  144 |         .is_ok()
  145 |     {
  146 |         log::warn!(
  147 |             "You have requested an unstable format version.  Files written with this format version may not be readable in the future!  This is a development feature and should only be used for experimentation and never for production data."
  148 |         );
  149 |     }
  150 | }
  151 | 
  152 | /// Create a v2.3 writer with an explicit schema.
  153 | pub fn create_writer(
  154 |     object_writer: Box<dyn ObjectWriter>,
  155 |     schema: Schema,
  156 |     options: FileWriterOptions,
  157 | ) -> Result<Writer> {
  158 |     warn_unstable_format();
  159 |     Writer::try_new(object_writer, schema, options)
  160 | }
  161 | 
  162 | /// Create a v2.3 writer with explicit compression tuning.
  163 | pub fn create_writer_with_compression(
  164 |     object_writer: Box<dyn ObjectWriter>,
  165 |     schema: Schema,
  166 |     options: FileWriterOptions,
  167 |     compression: CompressionParams,
  168 | ) -> Result<Writer> {
  169 |     warn_unstable_format();
  170 |     Writer::try_new_with_compression(object_writer, schema, options, compression)
  171 | }
  172 | 
  173 | /// Create a v2.3 writer whose schema is inferred from the first batch.
  174 | pub fn create_lazy_writer(
  175 |     object_writer: Box<dyn ObjectWriter>,
  176 |     options: FileWriterOptions,
  177 | ) -> Writer {
  178 |     warn_unstable_format();
  179 |     Writer::new_lazy(object_writer, options)
  180 | }
  181 | 
  182 | /// Create a lazy v2.3 writer with explicit compression tuning.
  183 | pub fn create_lazy_writer_with_compression(
  184 |     object_writer: Box<dyn ObjectWriter>,
  185 |     options: FileWriterOptions,
  186 |     compression: CompressionParams,
  187 | ) -> Writer {
  188 |     warn_unstable_format();
  189 |     Writer::new_lazy_with_compression(object_writer, options, compression)
  190 | }
  191 | 
  192 | /// Encode a self-described v2.3 batch.
  193 | pub fn encode_self_described_batch(batch: &EncodedBatch) -> Result<Bytes> {
  194 |     writer::concat_lance_footer(batch, true)
  195 | }
  196 | 
  197 | /// Encode a mini-lance v2.3 batch.
  198 | pub fn encode_mini_batch(batch: &EncodedBatch) -> Result<Bytes> {
  199 |     writer::concat_lance_footer(batch, false)
  200 | }
``````
