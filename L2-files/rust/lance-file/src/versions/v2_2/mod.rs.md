> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md).

# rust/lance-file/src/versions/v2_2/mod.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `b1a6988752ee387478e36335258e9fe59940978b1739546b693df17be4e63f0b`. Reviewed physical lines: 1-177.

[Module](../../../../../../L1-modules/rust-lance-file-composition.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Public V2_2 composition module. It selects an ordered field-encoder and page-mechanism policy, reexports its exact reader/writer surface, and delegates physical column mapping to shared structural code. (rust/lance-file/src/versions/v2_2/mod.rs:1-177)

## Complete range analysis

### Lines 1-35

SPDX/version docs/imports include structural Blob, Map and structural fixed-size-list helpers in addition to binary Blob, primitive, list and struct mechanisms. Compression, reader and writer child modules remain private; core Result/Error and object Writer provide factory boundaries. (rust/lance-file/src/versions/v2_2/mod.rs:1-35)

### Lines 36-47

Metadata decode/finish/index/global-buffer reexports are pub(crate); projection constructors and Writer are public. read_projection is crate-internal shared structural projection composed with exact V2_2 reader::decode_column. No cfg(test) test_projection_length reexport appears here. (rust/lance-file/src/versions/v2_2/mod.rs:36-47)

### Lines 48-61

Public physical_column_count/data_file_columns and parent-visible field_id_to_column_index directly use shared leaf mapping. Exact V2_2 reader grammar stays distinct from the shared mapping algorithm. (rust/lance-file/src/versions/v2_2/mod.rs:48-61)

### Lines 62-83

Private Debug FieldStrategy contains primitive strategy. create_field_encoder tries binary Blob then structural Blob, returning first Some and propagating each Result error. Both use the primitive policy and shared mutable ColumnIndexSequence/context. (rust/lance-file/src/versions/v2_2/mod.rs:62-83)

### Lines 84-103

If still Blob, InvalidInput names field/type. Then try Map, structural fixed-size-list, and primitive, in that order; unlike V2_1 there are no unconditional Map/FSL<Struct> rejection guards. Presence of a helper is not proof that every nested/type combination is supported; helpers may decline or error. (rust/lance-file/src/versions/v2_2/mod.rs:84-103)

### Lines 104-120

Try list then struct; propagate first error, return first match. Final NotSupported names Lance v2.2 plus field/datatype. No transactional restoration of mutable column-index state on a helper error is provided in this dispatcher. (rust/lance-file/src/versions/v2_2/mod.rs:104-120)

### Lines 121-132

Public encoding_strategy consumes CompressionParams into shared Arc compression strategy and selects ordered reject_sparse, constant, dense_u32 page mechanisms. Constant comes before dense; sparse is explicitly rejected by a mechanism. Exact eligibility and serialized bytes live in encoder dependencies. (rust/lance-file/src/versions/v2_2/mod.rs:121-132)

### Lines 133-151

Public eager create_writer and create_writer_with_compression move object/schema/options and optional explicit CompressionParams to concrete try_new methods and propagate Result. They do not compute defaults or validate independently. (rust/lance-file/src/versions/v2_2/mod.rs:133-151)

### Lines 152-168

Public lazy factories move object/options and optional explicit tuning to infallible concrete new_lazy constructors. Documentation says schema inferred from first batch; wrapper has no inference or IO logic. (rust/lance-file/src/versions/v2_2/mod.rs:152-168)

### Lines 169-177

Public self-described/mini EncodedBatch helpers select true/false on exact V2_2 concat_lance_footer and return Result<Bytes>. No inline tests, format warning or unsafe code. (rust/lance-file/src/versions/v2_2/mod.rs:169-177)

## Interaction and interpretation limits

Every physical line was read in ANALYZE53. No source execution/build/test was performed. Exact current-version reader/writer bodies are analyzed; delegated compression/encoder helper internals remain pending; delegated calls are not evidence of their full behavior. 

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Lance v2.2 file composition.
    5 | 
    6 | use std::{collections::BTreeMap, sync::Arc};
    7 | 
    8 | use bytes::Bytes;
    9 | use lance_core::{
   10 |     Error, Result,
   11 |     datatypes::{Field, Schema},
   12 | };
   13 | use lance_encoding::{
   14 |     compression_config::CompressionParams,
   15 |     encoder::{
   16 |         ColumnIndexSequence, EncodedBatch, FieldEncoder, FieldEncodingContext,
   17 |         FieldEncodingStrategy,
   18 |         structural::{
   19 |             PrimitiveFieldEncoding, PrimitivePageEncoding, try_create_binary_blob, try_create_list,
   20 |             try_create_map, try_create_struct, try_create_structural_blob,
   21 |             try_create_structural_fixed_size_list,
   22 |         },
   23 |     },
   24 | };
   25 | use lance_io::traits::Writer as ObjectWriter;
   26 | 
   27 | use crate::{
   28 |     reader::{ReadProjection, structural},
   29 |     writer::FileWriterOptions,
   30 | };
   31 | 
   32 | mod compression;
   33 | mod reader;
   34 | mod writer;
   35 | 
   36 | pub(crate) use reader::{
   37 |     decode_column_metadata, finish_metadata, finish_metadata_index, validate_global_buffers,
   38 | };
   39 | pub use reader::{
   40 |     projection_from_column_names, projection_from_field_ids, projection_from_whole_schema,
   41 | };
   42 | 
   43 | pub(crate) fn read_projection() -> Arc<dyn ReadProjection> {
   44 |     structural::read_projection(reader::decode_column)
   45 | }
   46 | pub use writer::Writer;
   47 | 
   48 | /// Count physical columns represented by a field in a v2.2 footer.
   49 | pub fn physical_column_count(field: &Field) -> usize {
   50 |     structural::physical_column_count(field)
   51 | }
   52 | 
   53 | /// Build persisted field-to-column entries for a v2.2 data file.
   54 | pub fn data_file_columns(schema: &Schema) -> (Vec<i32>, Vec<i32>) {
   55 |     structural::data_file_columns(schema)
   56 | }
   57 | 
   58 | pub(super) fn field_id_to_column_index(schema: &Schema) -> BTreeMap<u32, u32> {
   59 |     structural::field_id_to_column_index(schema)
   60 | }
   61 | 
   62 | #[derive(Debug)]
   63 | struct FieldStrategy {
   64 |     primitive: PrimitiveFieldEncoding,
   65 | }
   66 | 
   67 | impl FieldEncodingStrategy for FieldStrategy {
   68 |     fn create_field_encoder(
   69 |         &self,
   70 |         field: &Field,
   71 |         column_index: &mut ColumnIndexSequence,
   72 |         context: &FieldEncodingContext<'_>,
   73 |     ) -> Result<Box<dyn FieldEncoder>> {
   74 |         if let Some(encoder) =
   75 |             try_create_binary_blob(&self.primitive, field, column_index, context)?
   76 |         {
   77 |             return Ok(encoder);
   78 |         }
   79 |         if let Some(encoder) =
   80 |             try_create_structural_blob(&self.primitive, field, column_index, context)?
   81 |         {
   82 |             return Ok(encoder);
   83 |         }
   84 |         if field.is_blob() {
   85 |             return Err(Error::invalid_input_source(
   86 |                 format!(
   87 |                     "Blob encoding is not available for field '{}' with data type {}",
   88 |                     field.name,
   89 |                     field.data_type()
   90 |                 )
   91 |                 .into(),
   92 |             ));
   93 |         }
   94 |         if let Some(encoder) = try_create_map(field, column_index, context)? {
   95 |             return Ok(encoder);
   96 |         }
   97 |         if let Some(encoder) = try_create_structural_fixed_size_list(field, column_index, context)?
   98 |         {
   99 |             return Ok(encoder);
  100 |         }
  101 |         if let Some(encoder) = self.primitive.try_create(field, column_index, context)? {
  102 |             return Ok(encoder);
  103 |         }
  104 |         if let Some(encoder) = try_create_list(field, column_index, context)? {
  105 |             return Ok(encoder);
  106 |         }
  107 |         if let Some(encoder) = try_create_struct(field, column_index, context)? {
  108 |             return Ok(encoder);
  109 |         }
  110 |         Err(Error::not_supported_source(
  111 |             format!(
  112 |                 "Lance v2.2 has no field encoding for '{}' with data type {}",
  113 |                 field.name,
  114 |                 field.data_type()
  115 |             )
  116 |             .into(),
  117 |         ))
  118 |     }
  119 | }
  120 | 
  121 | /// Compose the v2.2 field encoding mechanisms.
  122 | pub fn encoding_strategy(params: CompressionParams) -> Arc<dyn FieldEncodingStrategy> {
  123 |     let compression = Arc::new(compression::Strategy::new(params));
  124 |     Arc::new(FieldStrategy {
  125 |         primitive: PrimitiveFieldEncoding::new([
  126 |             PrimitivePageEncoding::reject_sparse(),
  127 |             PrimitivePageEncoding::constant(),
  128 |             PrimitivePageEncoding::dense_u32(compression),
  129 |         ]),
  130 |     })
  131 | }
  132 | 
  133 | /// Create a v2.2 writer with an explicit schema.
  134 | pub fn create_writer(
  135 |     object_writer: Box<dyn ObjectWriter>,
  136 |     schema: Schema,
  137 |     options: FileWriterOptions,
  138 | ) -> Result<Writer> {
  139 |     Writer::try_new(object_writer, schema, options)
  140 | }
  141 | 
  142 | /// Create a v2.2 writer with explicit compression tuning.
  143 | pub fn create_writer_with_compression(
  144 |     object_writer: Box<dyn ObjectWriter>,
  145 |     schema: Schema,
  146 |     options: FileWriterOptions,
  147 |     compression: CompressionParams,
  148 | ) -> Result<Writer> {
  149 |     Writer::try_new_with_compression(object_writer, schema, options, compression)
  150 | }
  151 | 
  152 | /// Create a v2.2 writer whose schema is inferred from the first batch.
  153 | pub fn create_lazy_writer(
  154 |     object_writer: Box<dyn ObjectWriter>,
  155 |     options: FileWriterOptions,
  156 | ) -> Writer {
  157 |     Writer::new_lazy(object_writer, options)
  158 | }
  159 | 
  160 | /// Create a lazy v2.2 writer with explicit compression tuning.
  161 | pub fn create_lazy_writer_with_compression(
  162 |     object_writer: Box<dyn ObjectWriter>,
  163 |     options: FileWriterOptions,
  164 |     compression: CompressionParams,
  165 | ) -> Writer {
  166 |     Writer::new_lazy_with_compression(object_writer, options, compression)
  167 | }
  168 | 
  169 | /// Encode a self-described v2.2 batch.
  170 | pub fn encode_self_described_batch(batch: &EncodedBatch) -> Result<Bytes> {
  171 |     writer::concat_lance_footer(batch, true)
  172 | }
  173 | 
  174 | /// Encode a mini-lance v2.2 batch.
  175 | pub fn encode_mini_batch(batch: &EncodedBatch) -> Result<Bytes> {
  176 |     writer::concat_lance_footer(batch, false)
  177 | }
``````
