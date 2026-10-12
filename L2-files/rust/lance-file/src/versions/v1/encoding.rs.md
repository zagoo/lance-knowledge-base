> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md).

# rust/lance-file/src/versions/v1/encoding.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `258a4da3bc1753c8ab8d45f0a86142f46fec4f7df110c8ceb786eecdd7aa16f1`. Reviewed physical lines: 1-192.

[Module](../../../../../../L1-modules/rust-lance-file-v1-foundation.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Public V1 value-decoding dispatch and persisted schema dictionary write/load helpers. Concrete binary/plain/dictionary codecs are child modules; this facade separates frozen V1 grammar from version-free IO and modern encodings. (rust/lance-file/src/versions/v1/encoding.rs:1-192)

## Complete range analysis

### Lines 1-34

SPDX and module contract place V1 wire layout and schema dictionary payloads in this versioned module. Public binary,dictionary,plain children; Arrow arrays/types/DataType, async_recursion, local DataTypeExt, core schema/errors, Reader/Writer and ReadBatchParams dependencies. Only binary/plain concrete codecs are used by these dictionary-value helpers; dictionary child handles keys elsewhere. (rust/lance-file/src/versions/v1/encoding.rs:1-34)

### Lines 35-52

read_binary_array is public async with borrowed Reader/DataType, nullable, byte position, logical length and generic Into<ReadBatchParams>. It converts params first, then Utf8 instantiates BinaryDecoder<Utf8Type> and awaits get. Offset/range/null/layout validation and IO are delegated to the concrete decoder, not added here. (rust/lance-file/src/versions/v1/encoding.rs:35-52)

### Lines 53-73

Binary,LargeUtf8,LargeBinary dispatch to their corresponding Arrow generic BinaryDecoder. Any other type gives InvalidInput with displayed data_type. This exact four-type set is narrower than local DataTypeExt::is_binary_like, which also includes Utf8View/BinaryView; therefore passing the broad binary-like predicate does not guarantee successful dispatch. (rust/lance-file/src/versions/v1/encoding.rs:53-73)

### Lines 74-91

read_fixed_stride_array first checks DataTypeExt::is_fixed_stride and returns Schema error with type if false. It invokes PlainDecoder::new before params.into; the concrete constructor is now known to return Ok unconditionally (rust/lance-file/src/versions/v1/encoding/plain.rs:211-224). It has no nullable argument or local bounds check. Fixed-list range reads recurse, but FixedSizeList<Boolean> take reaches byte_width without a Boolean width (rust/lance-file/src/versions/v1/encoding/plain.rs:252-279; rust/lance-file/src/versions/v1/encoding/plain.rs:379-391; rust/lance-arrow/src/lib.rs:144-182). (rust/lance-file/src/versions/v1/encoding.rs:74-91)

### Lines 92-102

write_schema_dictionaries mutably borrows writer and schema. It computes maximum field ID once, defaults to-1, then iterates every integer0..=max, looks up a mutable field and skips holes or nondictionary types. Runtime work depends on ID span, not only field count; negative-only/empty schemas iterate nothing. Field data_type conversion uses the core schema contract and may panic for malformed logical metadata. (rust/lance-file/src/versions/v1/encoding.rs:92-102)

### Lines 103-115

For a dictionary field, absent dictionary metadata is IO error naming field; absent in-memory values is InvalidInput naming field. Existing dictionary values are borrowed, not removed. Checks occur per field during traversal, so a later field failure does not undo earlier writes or schema mutations. (rust/lance-file/src/versions/v1/encoding.rs:103-115)

### Lines 116-132

Choose encoder using actual values.data_type(): is_numeric -> PlainEncoder, otherwise is_binary_like -> BinaryEncoder, otherwise Schema error. Await encode on a one-array slice; after success store returned position and values.len in dictionary offset/length. No local comparison to schema dictionary value type, flush/shutdown, rollback or all-fields preflight. Numeric write predicate is not the explicit eight-integer read whitelist; broad binary-like predicate includes views that read_binary_array rejects. Concrete BinaryEncoder also rejects both view types as InvalidInput, while PlainEncoder writes fixed-width numeric buffers through byte_width (rust/lance-file/src/versions/v1/encoding/binary.rs:91-105; rust/lance-file/src/versions/v1/encoding/plain.rs:90-115). Full V1 reader is now analyzed; V1 writer lifecycle is now analyzed; statistics algorithms are now analyzed; backend lifecycle remains pending. (rust/lance-file/src/versions/v1/encoding.rs:116-132)

### Lines 133-152

Private async_recursion populate_field_dictionary branches on schema-declared DataType::Dictionary, requires metadata(IO error), and for binary-like values calls read_binary_array(nullable=true,stored offset/length,full range). Existing in-memory values do not bypass this load. IO can occur before later fields fail; helper holds mutable field state across await. (rust/lance-file/src/versions/v1/encoding.rs:133-152)

### Lines 153-176

Only Int8/16/32/64 and UInt8/16/32/64 dictionary value types enter fixed-stride loading with full range. Other nonbinary types produce Schema error with value_type, even though writer selection uses the broader numeric predicate. Binary view types enter the preceding branch but fail the four-type binary dispatcher as InvalidInput. No type fallback/migration is implemented. (rust/lance-file/src/versions/v1/encoding.rs:153-176)

### Lines 177-185

After successful load replace dict_info.values with Some(array). A dictionary node does not recurse into children; nondictionary nodes recursively process children in stored order. Error stops traversal after any prior successful mutations. async_recursion boxes recursive futures; no task is explicitly spawned, and no rollback or cancellation guard appears. (rust/lance-file/src/versions/v1/encoding.rs:177-185)

### Lines 186-192

populate_schema_dictionaries is public async, processes roots sequentially through the recursive helper, then returns unit. Empty schemas succeed without reads. File ends without tests, so local dictionary type asymmetry, invalid IDs, partial failure and view behavior have no unit oracles here; other modules must be checked separately. (rust/lance-file/src/versions/v1/encoding.rs:186-192)

## Interaction and interpretation limits

All physical lines of this file were read during ANALYZE60. Tests were inspected, not executed. Source remains read-only and offline; no build, test, benchmark, fixture generation or dependency installation was run. Frozen V1 behavior is recorded for compatibility, not proposed as the basis for new features. Concrete V1 binary/plain/dictionary codecs are now analyzed; full V1 reader is now analyzed; V1 statistics are fully analyzed; narrow external caller/helper context is recorded separately. Arithmetic, malformed-input, allocation and cancellation consequences are source-level observations, not executed reproductions. No unsafe block or global mutable state is declared in this file.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Lance v1 column encoding grammar.
    5 | //!
    6 | //! These codecs own the v1 wire layout, including schema dictionary payloads.
    7 | //! They are intentionally not exposed through the version-free I/O layer.
    8 | 
    9 | use arrow_array::{
   10 |     Array, ArrayRef,
   11 |     types::{BinaryType, LargeBinaryType, LargeUtf8Type, Utf8Type},
   12 | };
   13 | use arrow_schema::DataType;
   14 | use async_recursion::async_recursion;
   15 | 
   16 | pub mod binary;
   17 | pub mod dictionary;
   18 | pub mod plain;
   19 | 
   20 | use lance_arrow::DataTypeExt;
   21 | use lance_core::{
   22 |     Error, Result,
   23 |     datatypes::{Field, Schema},
   24 | };
   25 | use lance_io::{
   26 |     ReadBatchParams,
   27 |     traits::{Reader, Writer},
   28 | };
   29 | 
   30 | use self::{
   31 |     binary::{BinaryDecoder, BinaryEncoder},
   32 |     plain::{PlainDecoder, PlainEncoder},
   33 | };
   34 | 
   35 | /// Decode a binary-like array from a v1 values region.
   36 | pub async fn read_binary_array(
   37 |     reader: &dyn Reader,
   38 |     data_type: &DataType,
   39 |     nullable: bool,
   40 |     position: usize,
   41 |     length: usize,
   42 |     params: impl Into<ReadBatchParams>,
   43 | ) -> Result<ArrayRef> {
   44 |     use arrow_schema::DataType::*;
   45 | 
   46 |     let params = params.into();
   47 |     match data_type {
   48 |         Utf8 => {
   49 |             BinaryDecoder::<Utf8Type>::new(reader, position, length, nullable)
   50 |                 .get(params)
   51 |                 .await
   52 |         }
   53 |         Binary => {
   54 |             BinaryDecoder::<BinaryType>::new(reader, position, length, nullable)
   55 |                 .get(params)
   56 |                 .await
   57 |         }
   58 |         LargeUtf8 => {
   59 |             BinaryDecoder::<LargeUtf8Type>::new(reader, position, length, nullable)
   60 |                 .get(params)
   61 |                 .await
   62 |         }
   63 |         LargeBinary => {
   64 |             BinaryDecoder::<LargeBinaryType>::new(reader, position, length, nullable)
   65 |                 .get(params)
   66 |                 .await
   67 |         }
   68 |         _ => Err(lance_core::Error::invalid_input(format!(
   69 |             "unsupported v1 binary data type: {data_type}"
   70 |         ))),
   71 |     }
   72 | }
   73 | 
   74 | /// Decode a fixed-stride array from a v1 values region.
   75 | pub async fn read_fixed_stride_array(
   76 |     reader: &dyn Reader,
   77 |     data_type: &DataType,
   78 |     position: usize,
   79 |     length: usize,
   80 |     params: impl Into<ReadBatchParams>,
   81 | ) -> Result<ArrayRef> {
   82 |     if !lance_arrow::DataTypeExt::is_fixed_stride(data_type) {
   83 |         return Err(lance_core::Error::schema(format!(
   84 |             "{data_type} is not a fixed stride type"
   85 |         )));
   86 |     }
   87 |     PlainDecoder::new(reader, data_type, position, length)?
   88 |         .get(params.into())
   89 |         .await
   90 | }
   91 | 
   92 | /// Persist every schema dictionary using the v1 value codecs.
   93 | pub async fn write_schema_dictionaries(writer: &mut dyn Writer, schema: &mut Schema) -> Result<()> {
   94 |     let max_field_id = schema.max_field_id().unwrap_or(-1);
   95 |     for field_id in 0..=max_field_id {
   96 |         let Some(field) = schema.mut_field_by_id(field_id) else {
   97 |             continue;
   98 |         };
   99 |         if !field.data_type().is_dictionary() {
  100 |             continue;
  101 |         }
  102 | 
  103 |         let dict_info = field.dictionary.as_mut().ok_or_else(|| {
  104 |             Error::io(format!(
  105 |                 "v1 dictionary field '{}' is missing dictionary metadata",
  106 |                 field.name
  107 |             ))
  108 |         })?;
  109 |         let values = dict_info.values.as_ref().ok_or_else(|| {
  110 |             Error::invalid_input(format!(
  111 |                 "v1 dictionary field '{}' is missing dictionary values",
  112 |                 field.name
  113 |             ))
  114 |         })?;
  115 | 
  116 |         let data_type = values.data_type();
  117 |         let position = if data_type.is_numeric() {
  118 |             PlainEncoder::new(writer, data_type)
  119 |                 .encode(&[values])
  120 |                 .await?
  121 |         } else if data_type.is_binary_like() {
  122 |             BinaryEncoder::new(writer).encode(&[values]).await?
  123 |         } else {
  124 |             return Err(Error::schema(format!(
  125 |                 "v1 dictionary values do not support data type {data_type}"
  126 |             )));
  127 |         };
  128 |         dict_info.offset = position;
  129 |         dict_info.length = values.len();
  130 |     }
  131 |     Ok(())
  132 | }
  133 | 
  134 | #[async_recursion]
  135 | async fn populate_field_dictionary(field: &mut Field, reader: &dyn Reader) -> Result<()> {
  136 |     if let DataType::Dictionary(_, value_type) = field.data_type() {
  137 |         let dict_info = field.dictionary.as_mut().ok_or_else(|| {
  138 |             Error::io(format!(
  139 |                 "v1 dictionary field '{}' is missing dictionary metadata",
  140 |                 field.name
  141 |             ))
  142 |         })?;
  143 |         let values = if value_type.is_binary_like() {
  144 |             read_binary_array(
  145 |                 reader,
  146 |                 value_type.as_ref(),
  147 |                 true,
  148 |                 dict_info.offset,
  149 |                 dict_info.length,
  150 |                 ..,
  151 |             )
  152 |             .await?
  153 |         } else if matches!(
  154 |             value_type.as_ref(),
  155 |             DataType::Int8
  156 |                 | DataType::Int16
  157 |                 | DataType::Int32
  158 |                 | DataType::Int64
  159 |                 | DataType::UInt8
  160 |                 | DataType::UInt16
  161 |                 | DataType::UInt32
  162 |                 | DataType::UInt64
  163 |         ) {
  164 |             read_fixed_stride_array(
  165 |                 reader,
  166 |                 value_type.as_ref(),
  167 |                 dict_info.offset,
  168 |                 dict_info.length,
  169 |                 ..,
  170 |             )
  171 |             .await?
  172 |         } else {
  173 |             return Err(Error::schema(format!(
  174 |                 "v1 dictionary values do not support data type {value_type}"
  175 |             )));
  176 |         };
  177 |         dict_info.values = Some(values);
  178 |     } else {
  179 |         for child in &mut field.children {
  180 |             populate_field_dictionary(child, reader).await?;
  181 |         }
  182 |     }
  183 |     Ok(())
  184 | }
  185 | 
  186 | /// Load every persisted v1 schema dictionary into its in-memory field.
  187 | pub async fn populate_schema_dictionaries(schema: &mut Schema, reader: &dyn Reader) -> Result<()> {
  188 |     for field in &mut schema.fields {
  189 |         populate_field_dictionary(field, reader).await?;
  190 |     }
  191 |     Ok(())
  192 | }
``````
