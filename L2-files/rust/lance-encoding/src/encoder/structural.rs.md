> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/encoder/structural.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `d59c3d2c6e4ff66a624cbe649efa01b8c5722ded12e7bc6e3e190fac68ae8243`. Reviewed physical lines: 1-285.

[Module](../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Version-free field builder mechanisms for primitive leaves, blob descriptors, lists, direct fixed-size-list structs, maps and nonpacked structs. (rust/lance-encoding/src/encoder/structural.rs:1-285)

## Complete range analysis

### Lines 1-23

License, version-free builder description, Arc/Arrow/core imports and public re-export of PrimitivePageEncoding. Logical child implementations are BlobStructuralEncoder,BlobV2StructuralEncoder,FixedSizeListStructuralEncoder,ListStructuralEncoder,MapStructuralEncoder,PrimitiveStructuralEncoder and StructStructuralEncoder. Their full bodies are not covered by this facade. (rust/lance-encoding/src/encoder/structural.rs:1-23)

### Lines 24-38

Public Debug+Clone PrimitiveFieldEncoding stores private Arc<[PrimitivePageEncoding]>. new collects an ordered iterator of executable page behaviors; an empty sequence, duplicate behaviors and ordering are not checked here. Clone shares the sequence. (rust/lance-encoding/src/encoder/structural.rs:24-38)

### Lines 39-74

Private primitive recognition recurses through any FixedSizeList depth and accepts Boolean,Date32/64,Decimal128/256,Duration,Float16/32/64,signed/unsigned8/16/32/64,Interval,Null,Time32/64,Timestamp,FixedSizeBinary,Binary,LargeBinary,Utf8,LargeUtf8. It excludes view types, variable lists, maps, structs and dictionaries at this recursive predicate; no FSL dimension/primitive-parameter validity check here. (rust/lance-encoding/src/encoder/structural.rs:39-74)

### Lines 75-89

create_at delegates owned Field and concrete column index to PrimitiveStructuralEncoder::try_new with borrowed options, shared page behaviors and a newly cloned root metadata HashMap inside Arc. It propagates constructor errors. Each call makes its own metadata clone rather than sharing one root metadata Arc across siblings. (rust/lance-encoding/src/encoder/structural.rs:75-89)

### Lines 90-111

try_create immediately declines any blob-marked field. Otherwise accepts the primitive predicate, a packed or empty Struct, or Dictionary whose value satisfies the recursive primitive predicate. It does not validate dictionary key type or packed Struct member types locally. Dictionaries of dictionaries/Struct/list/map values fail this primitive predicate. (rust/lance-encoding/src/encoder/structural.rs:90-111)

### Lines 112-131

Unrecognized Dictionary returns NotSupported with value type; another unrecognized type returns Ok(None). Accepted type clones Field and allocates column_index.next_column_index(field.id as u32) before fallible construction. Negative IDs cast to u32; a constructor failure leaves the caller sequence advanced. No rollback or ID-range validation here. (rust/lance-encoding/src/encoder/structural.rs:112-131)

### Lines 132-149

try_create_binary_blob recognizes blob flag plus Binary/LargeBinary only. Reserve one column for original field ID, build BlobStructuralEncoder, and feed its synthesized descriptor Field into primitive.create_at at that same index. Recognition None mutates nothing; constructor failure can leave allocation consumed. Original root metadata/context is retained. (rust/lance-encoding/src/encoder/structural.rs:132-149)

### Lines 150-166

try_create_structural_blob recognizes blob flag plus Struct only and similarly reserves one column before BlobV2StructuralEncoder constructor. The descriptor uses the supplied primitive mechanism and original root metadata. Blob metadata legality and descriptor shape are delegated, not checked by this guard. (rust/lance-encoding/src/encoder/structural.rs:150-166)

### Lines 167-188

try_create_list accepts List/LargeList. first child required through LanceOptionExt::expect_ok; recursively ask context.strategy for a child encoder using the same context and shared column sequence, then wrap with ListStructuralEncoder(keep_original_array, child). No physical column is allocated for the list parent by this helper. Additional children are ignored here. (rust/lance-encoding/src/encoder/structural.rs:167-188)

### Lines 189-210

try_create_structural_fixed_size_list accepts only an immediate FSL child whose Arrow type is Struct. It does not recursively recognize FSL<FSL<Struct>> and does not check dimension positivity. Require first Field child, recurse through full strategy/context then wrap with FixedSizeListStructuralEncoder and ownership flag. Parent allocates no column locally. Actual format gating is outside this version-free function. (rust/lance-encoding/src/encoder/structural.rs:189-210)

### Lines 211-229

try_create_map declines non-Map; keys_sorted=true returns NotSupported with actual true value before child recursion. It does not sort keys or convert sorted-map input. (rust/lance-encoding/src/encoder/structural.rs:211-229)

### Lines 230-249

Map must have first entries child or Schema error, that child must be Struct or Schema error, and the reconstructed Arrow struct must have at least2 fields. First field must be nonnullable or Schema error naming it. More than2 entries fields are accepted locally; exact arity, names, actual null key values, duplicate keys, parent validity and child-array shape are not validated in this helper. (rust/lance-encoding/src/encoder/structural.rs:230-249)

### Lines 250-259

For valid metadata, recurse once on entire entries child through complete strategy, shared index sequence and original root context, then wrap MapStructuralEncoder with keep_original_array. Map parent has no local column allocation; recursion can consume indices before an error. (rust/lance-encoding/src/encoder/structural.rs:250-259)

### Lines 260-271

try_create_struct declines non-Struct, any blob Struct, packed Struct or empty Struct. Those cases are routed elsewhere by the composing strategy; calling this helper alone never supplies a fallback. (rust/lance-encoding/src/encoder/structural.rs:260-271)

### Lines 272-285

For ordinary nonempty Struct, iterate all field.children in order, recursively create children with same strategy/root metadata/index sequence, short-circuit on first error, and construct StructStructuralEncoder with ownership flag. No parent column allocated here, no rollback of earlier child allocations, no validation that Field.children and reconstructed Arrow field list agree. No local test module. (rust/lance-encoding/src/encoder/structural.rs:272-285)

## Interaction and interpretation limits

All285 lines freshly read untruncated. Full logical encoders remain pending. These builders express mechanism, while actual file-version strategy composition chooses policy; no tests or unsafe blocks here.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Version-free structural field encoder builders.
    5 | 
    6 | use std::sync::Arc;
    7 | 
    8 | use arrow_schema::DataType;
    9 | use lance_core::{Error, Result, datatypes::Field, error::LanceOptionExt};
   10 | 
   11 | pub use crate::encodings::logical::primitive::PrimitivePageEncoding;
   12 | 
   13 | use crate::encodings::logical::{
   14 |     blob::{BlobStructuralEncoder, BlobV2StructuralEncoder},
   15 |     fixed_size_list::FixedSizeListStructuralEncoder,
   16 |     list::ListStructuralEncoder,
   17 |     map::MapStructuralEncoder,
   18 |     primitive::PrimitiveStructuralEncoder,
   19 |     r#struct::StructStructuralEncoder,
   20 | };
   21 | 
   22 | use super::{ColumnIndexSequence, FieldEncoder, FieldEncodingContext};
   23 | 
   24 | /// Encode primitive leaves, primitive fixed-size lists, dictionaries, and
   25 | /// packed or empty structs using one concrete primitive page grammar.
   26 | #[derive(Debug, Clone)]
   27 | pub struct PrimitiveFieldEncoding {
   28 |     page_encodings: Arc<[PrimitivePageEncoding]>,
   29 | }
   30 | 
   31 | impl PrimitiveFieldEncoding {
   32 |     /// Create a primitive field mechanism from ordered executable page behaviors.
   33 |     pub fn new(page_encodings: impl IntoIterator<Item = PrimitivePageEncoding>) -> Self {
   34 |         Self {
   35 |             page_encodings: page_encodings.into_iter().collect(),
   36 |         }
   37 |     }
   38 | 
   39 |     fn is_primitive_type(data_type: &DataType) -> bool {
   40 |         match data_type {
   41 |             DataType::FixedSizeList(inner, _) => Self::is_primitive_type(inner.data_type()),
   42 |             _ => matches!(
   43 |                 data_type,
   44 |                 DataType::Boolean
   45 |                     | DataType::Date32
   46 |                     | DataType::Date64
   47 |                     | DataType::Decimal128(_, _)
   48 |                     | DataType::Decimal256(_, _)
   49 |                     | DataType::Duration(_)
   50 |                     | DataType::Float16
   51 |                     | DataType::Float32
   52 |                     | DataType::Float64
   53 |                     | DataType::Int16
   54 |                     | DataType::Int32
   55 |                     | DataType::Int64
   56 |                     | DataType::Int8
   57 |                     | DataType::Interval(_)
   58 |                     | DataType::Null
   59 |                     | DataType::Time32(_)
   60 |                     | DataType::Time64(_)
   61 |                     | DataType::Timestamp(_, _)
   62 |                     | DataType::UInt16
   63 |                     | DataType::UInt32
   64 |                     | DataType::UInt64
   65 |                     | DataType::UInt8
   66 |                     | DataType::FixedSizeBinary(_)
   67 |                     | DataType::Binary
   68 |                     | DataType::LargeBinary
   69 |                     | DataType::Utf8
   70 |                     | DataType::LargeUtf8,
   71 |             ),
   72 |         }
   73 |     }
   74 | 
   75 |     fn create_at(
   76 |         &self,
   77 |         field: Field,
   78 |         column_index: u32,
   79 |         context: &FieldEncodingContext<'_>,
   80 |     ) -> Result<Box<dyn FieldEncoder>> {
   81 |         Ok(Box::new(PrimitiveStructuralEncoder::try_new(
   82 |             context.options,
   83 |             self.page_encodings.clone(),
   84 |             column_index,
   85 |             field,
   86 |             Arc::new(context.root_field_metadata.clone()),
   87 |         )?))
   88 |     }
   89 | 
   90 |     /// Create a primitive field encoder when this mechanism recognizes `field`.
   91 |     pub fn try_create(
   92 |         &self,
   93 |         field: &Field,
   94 |         column_index: &mut ColumnIndexSequence,
   95 |         context: &FieldEncodingContext<'_>,
   96 |     ) -> Result<Option<Box<dyn FieldEncoder>>> {
   97 |         if field.is_blob() {
   98 |             return Ok(None);
   99 |         }
  100 | 
  101 |         let data_type = field.data_type();
  102 |         let is_primitive = Self::is_primitive_type(&data_type);
  103 |         let is_packed_or_empty_struct = matches!(
  104 |             &data_type,
  105 |             DataType::Struct(fields) if field.is_packed_struct() || fields.is_empty()
  106 |         );
  107 |         let is_primitive_dictionary = matches!(
  108 |             &data_type,
  109 |             DataType::Dictionary(_, value_type) if Self::is_primitive_type(value_type)
  110 |         );
  111 | 
  112 |         if !is_primitive && !is_packed_or_empty_struct && !is_primitive_dictionary {
  113 |             if let DataType::Dictionary(_, value_type) = data_type {
  114 |                 return Err(Error::not_supported_source(
  115 |                     format!(
  116 |                         "cannot encode a dictionary column whose value type is a logical type ({})",
  117 |                         value_type
  118 |                     )
  119 |                     .into(),
  120 |                 ));
  121 |             }
  122 |             return Ok(None);
  123 |         }
  124 | 
  125 |         Ok(Some(self.create_at(
  126 |             field.clone(),
  127 |             column_index.next_column_index(field.id as u32),
  128 |             context,
  129 |         )?))
  130 |     }
  131 | }
  132 | 
  133 | /// Create the original binary blob descriptor when `field` matches.
  134 | pub fn try_create_binary_blob(
  135 |     primitive: &PrimitiveFieldEncoding,
  136 |     field: &Field,
  137 |     column_index: &mut ColumnIndexSequence,
  138 |     context: &FieldEncodingContext<'_>,
  139 | ) -> Result<Option<Box<dyn FieldEncoder>>> {
  140 |     if !field.is_blob() || !matches!(field.data_type(), DataType::Binary | DataType::LargeBinary) {
  141 |         return Ok(None);
  142 |     }
  143 |     let descriptor_column_index = column_index.next_column_index(field.id as u32);
  144 |     Ok(Some(Box::new(BlobStructuralEncoder::new(
  145 |         field,
  146 |         |descriptor_field| primitive.create_at(descriptor_field, descriptor_column_index, context),
  147 |     )?)))
  148 | }
  149 | 
  150 | /// Create the structural blob descriptor when `field` matches.
  151 | pub fn try_create_structural_blob(
  152 |     primitive: &PrimitiveFieldEncoding,
  153 |     field: &Field,
  154 |     column_index: &mut ColumnIndexSequence,
  155 |     context: &FieldEncodingContext<'_>,
  156 | ) -> Result<Option<Box<dyn FieldEncoder>>> {
  157 |     if !field.is_blob() || !matches!(field.data_type(), DataType::Struct(_)) {
  158 |         return Ok(None);
  159 |     }
  160 |     let descriptor_column_index = column_index.next_column_index(field.id as u32);
  161 |     Ok(Some(Box::new(BlobV2StructuralEncoder::new(
  162 |         field,
  163 |         |descriptor_field| primitive.create_at(descriptor_field, descriptor_column_index, context),
  164 |     )?)))
  165 | }
  166 | 
  167 | /// Create a variable-size list encoder when `field` matches.
  168 | pub fn try_create_list(
  169 |     field: &Field,
  170 |     column_index: &mut ColumnIndexSequence,
  171 |     context: &FieldEncodingContext<'_>,
  172 | ) -> Result<Option<Box<dyn FieldEncoder>>> {
  173 |     if !matches!(
  174 |         field.data_type(),
  175 |         DataType::List(_) | DataType::LargeList(_)
  176 |     ) {
  177 |         return Ok(None);
  178 |     }
  179 |     let child = field.children.first().expect_ok()?;
  180 |     let child_encoder = context
  181 |         .strategy
  182 |         .create_field_encoder(child, column_index, context)?;
  183 |     Ok(Some(Box::new(ListStructuralEncoder::new(
  184 |         context.options.keep_original_array,
  185 |         child_encoder,
  186 |     ))))
  187 | }
  188 | 
  189 | /// Create a fixed-size-list encoder whose child is a struct when applicable.
  190 | pub fn try_create_structural_fixed_size_list(
  191 |     field: &Field,
  192 |     column_index: &mut ColumnIndexSequence,
  193 |     context: &FieldEncodingContext<'_>,
  194 | ) -> Result<Option<Box<dyn FieldEncoder>>> {
  195 |     if !matches!(
  196 |         field.data_type(),
  197 |         DataType::FixedSizeList(inner, _) if matches!(inner.data_type(), DataType::Struct(_))
  198 |     ) {
  199 |         return Ok(None);
  200 |     }
  201 |     let child = field.children.first().expect_ok()?;
  202 |     let child_encoder = context
  203 |         .strategy
  204 |         .create_field_encoder(child, column_index, context)?;
  205 |     Ok(Some(Box::new(FixedSizeListStructuralEncoder::new(
  206 |         context.options.keep_original_array,
  207 |         child_encoder,
  208 |     ))))
  209 | }
  210 | 
  211 | /// Create an Arrow map encoder when `field` matches.
  212 | pub fn try_create_map(
  213 |     field: &Field,
  214 |     column_index: &mut ColumnIndexSequence,
  215 |     context: &FieldEncodingContext<'_>,
  216 | ) -> Result<Option<Box<dyn FieldEncoder>>> {
  217 |     let DataType::Map(_, keys_sorted) = field.data_type() else {
  218 |         return Ok(None);
  219 |     };
  220 |     if keys_sorted {
  221 |         return Err(Error::not_supported_source(
  222 |             format!(
  223 |                 "Map data type is not supported with keys_sorted=true now, current value is {}",
  224 |                 keys_sorted
  225 |             )
  226 |             .into(),
  227 |         ));
  228 |     }
  229 |     let entries_child = field
  230 |         .children
  231 |         .first()
  232 |         .ok_or_else(|| Error::schema("Map should have an entries child".to_string()))?;
  233 |     let DataType::Struct(struct_fields) = entries_child.data_type() else {
  234 |         return Err(Error::schema(
  235 |             "Map entries field must be a Struct<key, value>".to_string(),
  236 |         ));
  237 |     };
  238 |     if struct_fields.len() < 2 {
  239 |         return Err(Error::schema(
  240 |             "Map entries struct must contain both key and value fields".to_string(),
  241 |         ));
  242 |     }
  243 |     let key_field = &struct_fields[0];
  244 |     if key_field.is_nullable() {
  245 |         return Err(Error::schema(format!(
  246 |             "Map key field '{}' must be non-nullable according to Arrow Map specification",
  247 |             key_field.name()
  248 |         )));
  249 |     }
  250 |     let child_encoder =
  251 |         context
  252 |             .strategy
  253 |             .create_field_encoder(entries_child, column_index, context)?;
  254 |     Ok(Some(Box::new(MapStructuralEncoder::new(
  255 |         context.options.keep_original_array,
  256 |         child_encoder,
  257 |     ))))
  258 | }
  259 | 
  260 | /// Create a non-packed, non-empty struct encoder when `field` matches.
  261 | pub fn try_create_struct(
  262 |     field: &Field,
  263 |     column_index: &mut ColumnIndexSequence,
  264 |     context: &FieldEncodingContext<'_>,
  265 | ) -> Result<Option<Box<dyn FieldEncoder>>> {
  266 |     let DataType::Struct(fields) = field.data_type() else {
  267 |         return Ok(None);
  268 |     };
  269 |     if field.is_blob() || field.is_packed_struct() || fields.is_empty() {
  270 |         return Ok(None);
  271 |     }
  272 |     let children_encoders = field
  273 |         .children
  274 |         .iter()
  275 |         .map(|child| {
  276 |             context
  277 |                 .strategy
  278 |                 .create_field_encoder(child, column_index, context)
  279 |         })
  280 |         .collect::<Result<Vec<_>>>()?;
  281 |     Ok(Some(Box::new(StructStructuralEncoder::new(
  282 |         context.options.keep_original_array,
  283 |         children_encoders,
  284 |     ))))
  285 | }
``````
