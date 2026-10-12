> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md).

# rust/lance-file/src/versions/v2_1/mod.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `2828b1d0bce21bb375b495b77be2ac84ea4fc9094a145a524a90ea77346f87ca`. Reviewed physical lines: 1-180.

[Module](../../../../../../L1-modules/rust-lance-file-composition.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Public V2_1 composition module. It selects an ordered field-encoder and page-mechanism policy, reexports its exact reader/writer surface, and delegates physical column mapping to shared structural code. (rust/lance-file/src/versions/v2_1/mod.rs:1-180)

## Complete range analysis

### Lines 1-34

SPDX/version docs and imports connect CompressionParams, field strategy/context/encoder traits, primitive page mechanisms, binary Blob/list/struct helpers, core error/schema and object Writer. compression/reader/writer are private child modules. Shared structural reader is imported for leaf mapping. (rust/lance-file/src/versions/v2_1/mod.rs:1-34)

### Lines 35-49

Public projection constructor and Writer reexports; cfg(test) test_projection_length and metadata decode/finish/global-buffer methods are pub(crate). read_projection constructs shared structural ReadProjection with exact reader::decode_column function pointer; shared projection mechanics do not select a more recent grammar. (rust/lance-file/src/versions/v2_1/mod.rs:35-49)

### Lines 50-63

physical_column_count and data_file_columns are public leaf-layout forwards; pub(super) field_id_to_column_index forwards the map construction. These add no validation and inherit shared Blob/packed/leaf handling and signed counter/cast behavior. (rust/lance-file/src/versions/v2_1/mod.rs:50-63)

### Lines 64-80

Private Debug FieldStrategy owns PrimitiveFieldEncoding. Its trait create_field_encoder borrows field/context and mutable ColumnIndexSequence, first tries binary Blob; helper Err aborts, Some returns immediately, None continues. No speculative rollback of index state is implemented here. (rust/lance-file/src/versions/v2_1/mod.rs:64-80)

### Lines 81-93

If unhandled field is_blob, return InvalidInput source naming field and Arrow datatype. Otherwise try primitive and return success immediately. Primitive helper errors propagate before the explicit compound-type guards. (rust/lance-file/src/versions/v2_1/mod.rs:81-93)

### Lines 94-107

After primitive declines, direct FixedSizeList whose item datatype is Struct returns NotSupported with selected-format message; Map likewise returns NotSupported. The guard only pattern-matches immediate FSL<Struct>, not every possible nested list shape; overall acceptance also depends on primitive/helper recognition. (rust/lance-file/src/versions/v2_1/mod.rs:94-107)

### Lines 108-124

Try list then struct; each error propagates and first Some wins. If neither recognizes field, return NotSupported naming Lance v2.1, field and datatype. Strategy dispatch itself neither encodes data nor performs async IO. (rust/lance-file/src/versions/v2_1/mod.rs:108-124)

### Lines 125-135

encoding_strategy consumes CompressionParams into Arc<compression::Strategy>, builds PrimitiveFieldEncoding with ordered reject_sparse then dense_u16 mechanisms, wraps private FieldStrategy in Arc<dyn FieldEncodingStrategy>. There is no constant-page mechanism in this list. Actual page applicability and byte encoding are delegated. (rust/lance-file/src/versions/v2_1/mod.rs:125-135)

### Lines 136-154

Public create_writer calls Writer::try_new; create_writer_with_compression passes explicit CompressionParams to try_new_with_compression. Both consume object writer, Schema/options and return Result<Writer>; no default compression values or validation are supplied locally. (rust/lance-file/src/versions/v2_1/mod.rs:136-154)

### Lines 155-171

Public create_lazy_writer and create_lazy_writer_with_compression delegate corresponding infallible new_lazy constructors with options and optional explicit tuning. Schema inference from first batch is documented, not implemented at this layer. (rust/lance-file/src/versions/v2_1/mod.rs:155-171)

### Lines 172-180

encode_self_described_batch and encode_mini_batch call this exact version writer concat_lance_footer with true/false. Result<Bytes> propagates; no local version/metadata validation and no inline tests/unsafe code. (rust/lance-file/src/versions/v2_1/mod.rs:172-180)

## Interaction and interpretation limits

Every physical line was read in ANALYZE53. No source execution/build/test was performed. Exact current-version reader/writer bodies are analyzed; delegated compression/encoder helper internals remain pending; delegated calls are not evidence of their full behavior. 

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Lance v2.1 file composition.
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
   20 |             try_create_struct,
   21 |         },
   22 |     },
   23 | };
   24 | use lance_io::traits::Writer as ObjectWriter;
   25 | 
   26 | use crate::{
   27 |     reader::{ReadProjection, structural},
   28 |     writer::FileWriterOptions,
   29 | };
   30 | 
   31 | mod compression;
   32 | mod reader;
   33 | mod writer;
   34 | 
   35 | pub use reader::{
   36 |     projection_from_column_names, projection_from_field_ids, projection_from_whole_schema,
   37 | };
   38 | pub use writer::Writer;
   39 | 
   40 | #[cfg(test)]
   41 | pub(crate) use reader::test_projection_length;
   42 | pub(crate) use reader::{
   43 |     decode_column_metadata, finish_metadata, finish_metadata_index, validate_global_buffers,
   44 | };
   45 | 
   46 | pub(crate) fn read_projection() -> Arc<dyn ReadProjection> {
   47 |     structural::read_projection(reader::decode_column)
   48 | }
   49 | 
   50 | /// Count physical columns represented by a field in a v2.1 footer.
   51 | pub fn physical_column_count(field: &Field) -> usize {
   52 |     structural::physical_column_count(field)
   53 | }
   54 | 
   55 | /// Build persisted field-to-column entries for a v2.1 data file.
   56 | pub fn data_file_columns(schema: &Schema) -> (Vec<i32>, Vec<i32>) {
   57 |     structural::data_file_columns(schema)
   58 | }
   59 | 
   60 | pub(super) fn field_id_to_column_index(schema: &Schema) -> BTreeMap<u32, u32> {
   61 |     structural::field_id_to_column_index(schema)
   62 | }
   63 | 
   64 | #[derive(Debug)]
   65 | struct FieldStrategy {
   66 |     primitive: PrimitiveFieldEncoding,
   67 | }
   68 | 
   69 | impl FieldEncodingStrategy for FieldStrategy {
   70 |     fn create_field_encoder(
   71 |         &self,
   72 |         field: &Field,
   73 |         column_index: &mut ColumnIndexSequence,
   74 |         context: &FieldEncodingContext<'_>,
   75 |     ) -> Result<Box<dyn FieldEncoder>> {
   76 |         if let Some(encoder) =
   77 |             try_create_binary_blob(&self.primitive, field, column_index, context)?
   78 |         {
   79 |             return Ok(encoder);
   80 |         }
   81 |         if field.is_blob() {
   82 |             return Err(Error::invalid_input_source(
   83 |                 format!(
   84 |                     "Blob encoding is not available for field '{}' with data type {}",
   85 |                     field.name,
   86 |                     field.data_type()
   87 |                 )
   88 |                 .into(),
   89 |             ));
   90 |         }
   91 |         if let Some(encoder) = self.primitive.try_create(field, column_index, context)? {
   92 |             return Ok(encoder);
   93 |         }
   94 |         if matches!(
   95 |             field.data_type(),
   96 |             arrow_schema::DataType::FixedSizeList(item, _)
   97 |                 if matches!(item.data_type(), arrow_schema::DataType::Struct(_))
   98 |         ) {
   99 |             return Err(Error::not_supported_source(
  100 |                 "FixedSizeList<Struct> is not enabled by the selected file format".into(),
  101 |             ));
  102 |         }
  103 |         if matches!(field.data_type(), arrow_schema::DataType::Map(_, _)) {
  104 |             return Err(Error::not_supported_source(
  105 |                 "Map data type is not enabled by the selected file format".into(),
  106 |             ));
  107 |         }
  108 |         if let Some(encoder) = try_create_list(field, column_index, context)? {
  109 |             return Ok(encoder);
  110 |         }
  111 |         if let Some(encoder) = try_create_struct(field, column_index, context)? {
  112 |             return Ok(encoder);
  113 |         }
  114 |         Err(Error::not_supported_source(
  115 |             format!(
  116 |                 "Lance v2.1 has no field encoding for '{}' with data type {}",
  117 |                 field.name,
  118 |                 field.data_type()
  119 |             )
  120 |             .into(),
  121 |         ))
  122 |     }
  123 | }
  124 | 
  125 | /// Compose the v2.1 field encoding mechanisms.
  126 | pub fn encoding_strategy(params: CompressionParams) -> Arc<dyn FieldEncodingStrategy> {
  127 |     let compression = Arc::new(compression::Strategy::new(params));
  128 |     Arc::new(FieldStrategy {
  129 |         primitive: PrimitiveFieldEncoding::new([
  130 |             PrimitivePageEncoding::reject_sparse(),
  131 |             PrimitivePageEncoding::dense_u16(compression),
  132 |         ]),
  133 |     })
  134 | }
  135 | 
  136 | /// Create a v2.1 writer with an explicit schema.
  137 | pub fn create_writer(
  138 |     object_writer: Box<dyn ObjectWriter>,
  139 |     schema: Schema,
  140 |     options: FileWriterOptions,
  141 | ) -> Result<Writer> {
  142 |     Writer::try_new(object_writer, schema, options)
  143 | }
  144 | 
  145 | /// Create a v2.1 writer with explicit compression tuning.
  146 | pub fn create_writer_with_compression(
  147 |     object_writer: Box<dyn ObjectWriter>,
  148 |     schema: Schema,
  149 |     options: FileWriterOptions,
  150 |     compression: CompressionParams,
  151 | ) -> Result<Writer> {
  152 |     Writer::try_new_with_compression(object_writer, schema, options, compression)
  153 | }
  154 | 
  155 | /// Create a v2.1 writer whose schema is inferred from the first batch.
  156 | pub fn create_lazy_writer(
  157 |     object_writer: Box<dyn ObjectWriter>,
  158 |     options: FileWriterOptions,
  159 | ) -> Writer {
  160 |     Writer::new_lazy(object_writer, options)
  161 | }
  162 | 
  163 | /// Create a lazy v2.1 writer with explicit compression tuning.
  164 | pub fn create_lazy_writer_with_compression(
  165 |     object_writer: Box<dyn ObjectWriter>,
  166 |     options: FileWriterOptions,
  167 |     compression: CompressionParams,
  168 | ) -> Writer {
  169 |     Writer::new_lazy_with_compression(object_writer, options, compression)
  170 | }
  171 | 
  172 | /// Encode a self-described v2.1 batch.
  173 | pub fn encode_self_described_batch(batch: &EncodedBatch) -> Result<Bytes> {
  174 |     writer::concat_lance_footer(batch, true)
  175 | }
  176 | 
  177 | /// Encode a mini-lance v2.1 batch.
  178 | pub fn encode_mini_batch(batch: &EncodedBatch) -> Result<Bytes> {
  179 |     writer::concat_lance_footer(batch, false)
  180 | }
``````
