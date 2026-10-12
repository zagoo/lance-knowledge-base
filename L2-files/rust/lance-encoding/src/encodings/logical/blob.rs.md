> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/encodings/logical/blob.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `66747ae4b918bc27b87882411175dd13644f2daa27426a88316fc74bae08349a`. Reviewed physical lines: 1-904.

[Module](../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Original binary BlobLayout encoder and Blob-v2 prepared-record to stable five-field descriptor encoder, with source-only test cases. (rust/lance-encoding/src/encodings/logical/blob.rs:1-904)

## Complete range analysis

### Lines 1-42

Imports supply Arrow descriptor builders, core BlobV2 schema/classification/kind, field metadata, external-buffer collector and encoder/repdef contracts. Public BlobStructuralEncoder stores descriptor FieldEncoder and optional cached definition meanings. External here means outside page structure in same file, not automatically remote URI/sidecar. (rust/lance-encoding/src/encodings/logical/blob.rs:1-42)

### Lines 43-72

BlobStructuralEncoder::new creates Struct(position UInt64 nonnull,size UInt64 nonnull) with original name/outer nullability and metadata containing only packed=true. Despite comment about preserving original metadata, input metadata is not cloned. Field::try_from supplies a new field; original IDs/children are not directly copied. Caller closure creates descriptor encoder and errors propagate. (rust/lance-encoding/src/encodings/logical/blob.rs:43-72)

### Lines 73-104

wrap_tasks maps futures with then: await each inner encode, require Structural layout or Internal, wrap BlobLayout with supplied meanings, preserve data buffers, column index, row number and row count. It does not execute tasks or write external buffers. Errors from inner futures pass through. (rust/lance-encoding/src/encodings/logical/blob.rs:73-104)

### Lines 105-132

maybe_encode first appends array validity/no-null to supplied RepDefBuilder, then requires LargeBinary/i64 offsets (InvalidInput for other arrays), serializes levels and derives meanings. Existing builder assertions can happen before type rejection. Direct Binary/i32 input is not cast here, despite broader factory type predicate. (rust/lance-encoding/src/encodings/logical/blob.rs:105-132)

### Lines 133-145

If current meanings differ from cached meanings, flush buffered descriptor pages and wrap them with old meanings before replacing cache with new meanings. Flush failure returns before replacement; after success later failures can still leave state/external-buffer side effects. This prevents mixing all-valid and nullable arrays under one page interpretation. (rust/lance-encoding/src/encodings/logical/blob.rs:133-145)

### Lines 146-178

For each binary row: null requires definition buffer and stores (def<<16)+rep (if any) in position with size0, debug-asserting nonzero; empty valid stores0/0; other valid value copies bytes into Arrow Buffer/LanceBuffer and reserves out-of-line position, storing byte length. Nonnull values do not retain repetition level here. Level indexing assumes serialized positions correspond to binary rows; arbitrary nested correctness is not established by this loop alone. (rust/lance-encoding/src/encodings/logical/blob.rs:146-178)

### Lines 179-203

Construct nonnull two-child descriptor StructArray with no parent null bitmap, delegate maybe_encode with fresh empty RepDefBuilder and original row_number/num_rows, wrap resulting pages with outer meanings and append any prior flush tasks. Descriptor/data count and supplied row metadata consistency is delegated. Failure does not roll back buffers already added. (rust/lance-encoding/src/encodings/logical/blob.rs:179-203)

### Lines 204-228

flush delegates descriptor flush and wraps using cached meanings or dummy[AllValidItem] before any data. finish and num_columns simply delegate; finish does not independently wrap final_pages or force flush here. Lifecycle correctness follows caller/inner encoder contract. (rust/lance-encoding/src/encodings/logical/blob.rs:204-228)

### Lines 229-254

Public BlobV2StructuralEncoder owns one descriptor encoder. new creates stable BLOB_V2_DESC_FIELDS Struct, original field name/nullability and only packed=true metadata, then invokes caller FnOnce. There is no local format version check, upstream payload preparation or storage backend. (rust/lance-encoding/src/encodings/logical/blob.rs:229-254)

### Lines 255-285

V2 maybe_encode requires StructArray then BlobV2Layout::Prepared, otherwise InvalidInput with actual dtype or classified/unrecognized layout. Classifier is called twice on rejection. This verifies six-field prepared schema shape, not row-level required values or kind-specific consistency. Logical and already-descriptor arrays are rejected. (rust/lance-encoding/src/encodings/logical/blob.rs:255-285)

### Lines 286-322

Read kind UInt8,data LargeBinary,uri Utf8,blob_id UInt32,blob_size UInt64,position UInt64 by name, with contextual missing-field errors then infallible typed casts. Shape classification normally proves types/names; direct row null/value requirements remain unchecked. (rust/lance-encoding/src/encodings/logical/blob.rs:286-322)

### Lines 323-344

Allocate five output builders by row count, URI capacity row_count*16 unchecked. Parent-null OR kind-null row emits valid placeholder child values Inline/0/0/0/empty URI; output later preserves only parent null bitmap, so a null kind under valid parent becomes a valid empty-looking inline descriptor. Dedicated emits kind,position0,raw blob_size/blob_id and empty URI, ignoring those child validities. (rust/lance-encoding/src/encodings/logical/blob.rs:323-344)

### Lines 345-376

External copies URI even if its validity is null, defaults missing position/size/base-id child values to0, otherwise copies them. Packed directly copies position/blob_size/blob_id without checking their validity and emits empty URI. No URI validation, sidecar existence, positive size/ID, offset bounds or checked range arithmetic here. Unknown nonnull kind fails BlobKind::try_from. (rust/lance-encoding/src/encodings/logical/blob.rs:345-376)

### Lines 377-400

Inline directly reads data even if child null, copies bytes to external-buffer collector even when empty, stores reserved position/length and id0/empty URI. Append all output children as nonnull values. Earlier rows can already have appended external buffers when a later unknown kind fails. No local rollback. (rust/lance-encoding/src/encodings/logical/blob.rs:377-400)

### Lines 401-422

Finish builders and create five-field descriptor StructArray with cloned original parent nulls only; pass original repdef,row metadata and collector to descriptor encoder. No BlobLayout wrapper or original-binary sentinel scheme. V2 null structure is ordinary Arrow parent validity. (rust/lance-encoding/src/encodings/logical/blob.rs:401-422)

### Lines 423-438

V2 flush, finish and num_columns delegate unchanged. This module does not create packed/dedicated sidecar files, fetch external objects, resolve bases or persist manifests. It prepares descriptor data for normal structural encoding. No local unsafe or environment/feature dispatch. (rust/lance-encoding/src/encodings/logical/blob.rs:423-438)

### Lines 439-473

Private tests import encoding harness and Arrow fixtures. Creation test uses original binary blob metadata, StructuralU16 strategy and only asserts constructor success. It does not encode or decode values. (rust/lance-encoding/src/encodings/logical/blob.rs:439-473)

### Lines 474-518

V2 rejection test gives extension-marked two-field logical layout to StructuralU32 encoder, invokes maybe_encode and requires InvalidInput plus expected prepared/got logical message. Does not test unknown kind, missing per-kind values or malformed prepared child types. (rust/lance-encoding/src/encodings/logical/blob.rs:474-518)

### Lines 519-565

Simple async test has hello/null/100KiB/empty binary rows. Calls maybe_encode and optionally flush, but never awaits returned encode futures; checks positive column count and nonempty external buffers only. It proves setup/collection source assertions, not encoded pages or roundtrip. (rust/lance-encoding/src/encodings/logical/blob.rs:519-565)

### Lines 566-591

Original Blob roundtrip test has1KiB,null,10KiB,100KiB and uses Array plus StructuralU16 harness modes. Harness invocation was read, not executed; does not exercise32MiB shard boundary. (rust/lance-encoding/src/encodings/logical/blob.rs:566-591)

### Lines 592-617

Empty-value regression places empties before payloads with interspersed nulls, invoking default harness. This can detect accidentally consuming a following nonempty read result for an empty descriptor. Exact default mode/matrix is in contextual testing.rs; no test was run. (rust/lance-encoding/src/encodings/logical/blob.rs:592-617)

### Lines 618-637

Nullability transition regression feeds all-valid, nullable with empty/null, then all-valid arrays to StructuralU16 harness. It targets descriptor buffering across changing meanings, not a direct assertion of exact page counts or flush timings. (rust/lance-encoding/src/encodings/logical/blob.rs:618-637)

### Lines 638-675

V2 external test prepares Inline plus two External rows with nullable six-field schema, payload inline, URI file:///tmp/external.bin and s3://bucket/blob, IDs/sizes/positions0. These are literal descriptor strings, not fetched remote resources. (rust/lance-encoding/src/encodings/logical/blob.rs:638-675)

### Lines 676-715

Expected external-test descriptor has nonnull children kind[Inline,External,External],position[0,0,0],size[6,0,0],id0,URIs empty/file/s3. Harness compares descriptor output in StructuralU32 and StructuralSparse modes, not external blob contents. Position0 depends on collector starting offset in harness. (rust/lance-encoding/src/encodings/logical/blob.rs:676-715)

### Lines 716-745

Dedicated test prepares Dedicated id42,size12 and Inline abc, with null irrelevant data/URI. Uses exact prepared field order and types; it does not create the sidecar containing12 bytes. (rust/lance-encoding/src/encodings/logical/blob.rs:716-745)

### Lines 746-780

Expected dedicated-test descriptor preserves id42,size12,position0 and Inline size3,id0,position0, empty URIs. Runs same U32/Sparse descriptor harness. It does not qualify actual sidecar retrieval or dedicated range validity. (rust/lance-encoding/src/encodings/logical/blob.rs:746-780)

### Lines 781-810

External range test prepares one External URI memory://container.pack,position7,size42,id0. It provides metadata only, no corresponding object. (rust/lance-encoding/src/encodings/logical/blob.rs:781-810)

### Lines 811-842

Expected range descriptor exactly preserves kind/position7/size42/id0/URI and runs U32/Sparse harness. There is no assertion of byte-range fetching or rejecting invalid external ranges. (rust/lance-encoding/src/encodings/logical/blob.rs:811-842)

### Lines 843-872

Packed test prepares one Packed id7,position10,size5 with absent data/URI. Schema uses nullable prepared children. No packing/sidecar allocation is performed by this test. (rust/lance-encoding/src/encodings/logical/blob.rs:843-872)

### Lines 873-904

Expected packed descriptor preserves kind/id7/position10/size5, empty URI and runs U32/Sparse harness. Ten local tests total; none directly cover payload scheduler cache views, malformed descriptors, oversized shards, all-empty request vectors, null-kind-only V2 rows, invalid required children or errors after collector mutation. Parent/harness tests elsewhere remain separate pending context. (rust/lance-encoding/src/encodings/logical/blob.rs:873-904)

## Interaction and interpretation limits

Every physical line read in bounded untruncated primary-source outputs. No repository execution. Potential panic/invalid-input behavior is source deduction; contextual parent/testing snippets do not count as full-file analysis. Original binary Blob and five-field Blob-v2 representations are kept distinct.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::{collections::HashMap, sync::Arc};
    5 | 
    6 | use arrow_array::{
    7 |     Array, ArrayRef, StructArray, UInt64Array,
    8 |     builder::{PrimitiveBuilder, StringBuilder},
    9 |     cast::AsArray,
   10 |     types::{UInt8Type, UInt32Type, UInt64Type},
   11 | };
   12 | use arrow_buffer::Buffer;
   13 | use arrow_schema::{DataType, Field as ArrowField, Fields};
   14 | use futures::{FutureExt, future::BoxFuture};
   15 | use lance_core::{
   16 |     Error, Result,
   17 |     datatypes::{BLOB_V2_DESC_FIELDS, BlobV2Layout, Field},
   18 |     error::LanceOptionExt,
   19 | };
   20 | 
   21 | use crate::{
   22 |     buffer::LanceBuffer,
   23 |     constants::PACKED_STRUCT_META_KEY,
   24 |     decoder::PageEncoding,
   25 |     encoder::{EncodeTask, EncodedColumn, EncodedPage, FieldEncoder, OutOfLineBuffers},
   26 |     format::ProtobufUtils21,
   27 |     repdef::{DefinitionInterpretation, RepDefBuilder},
   28 | };
   29 | use lance_core::datatypes::BlobKind;
   30 | 
   31 | /// Blob structural encoder - stores large binary data in external buffers
   32 | ///
   33 | /// This encoder takes large binary arrays and stores them outside the normal
   34 | /// page structure. It creates a descriptor (position, size) for each blob
   35 | /// that is stored inline in the page.
   36 | pub struct BlobStructuralEncoder {
   37 |     // Encoder for the descriptors (position/size struct)
   38 |     descriptor_encoder: Box<dyn FieldEncoder>,
   39 |     // Set when we first see data
   40 |     def_meaning: Option<Arc<[DefinitionInterpretation]>>,
   41 | }
   42 | 
   43 | impl BlobStructuralEncoder {
   44 |     pub fn new(
   45 |         field: &Field,
   46 |         make_descriptor_encoder: impl FnOnce(Field) -> Result<Box<dyn FieldEncoder>>,
   47 |     ) -> Result<Self> {
   48 |         // Create descriptor field: struct<position: u64, size: u64>
   49 |         // Preserve the original field's metadata for packed struct
   50 |         let mut descriptor_metadata = HashMap::with_capacity(1);
   51 |         descriptor_metadata.insert(PACKED_STRUCT_META_KEY.to_string(), "true".to_string());
   52 | 
   53 |         let descriptor_data_type = DataType::Struct(Fields::from(vec![
   54 |             ArrowField::new("position", DataType::UInt64, false),
   55 |             ArrowField::new("size", DataType::UInt64, false),
   56 |         ]));
   57 | 
   58 |         // Use the original field's name for the descriptor
   59 |         let descriptor_field = Field::try_from(
   60 |             ArrowField::new(&field.name, descriptor_data_type, field.nullable)
   61 |                 .with_metadata(descriptor_metadata),
   62 |         )?;
   63 | 
   64 |         // Use PrimitiveStructuralEncoder to handle the descriptor
   65 |         let descriptor_encoder = make_descriptor_encoder(descriptor_field)?;
   66 | 
   67 |         Ok(Self {
   68 |             descriptor_encoder,
   69 |             def_meaning: None,
   70 |         })
   71 |     }
   72 | 
   73 |     fn wrap_tasks(
   74 |         tasks: Vec<EncodeTask>,
   75 |         def_meaning: Arc<[DefinitionInterpretation]>,
   76 |     ) -> Vec<EncodeTask> {
   77 |         tasks
   78 |             .into_iter()
   79 |             .map(|task| {
   80 |                 let def_meaning = def_meaning.clone();
   81 |                 task.then(|encoded_page| async move {
   82 |                     let encoded_page = encoded_page?;
   83 | 
   84 |                     let PageEncoding::Structural(inner_layout) = encoded_page.description else {
   85 |                         return Err(Error::internal(
   86 |                             "Expected inner encoding to return structural layout".to_string(),
   87 |                         ));
   88 |                     };
   89 | 
   90 |                     let wrapped = ProtobufUtils21::blob_layout(inner_layout, &def_meaning);
   91 |                     Ok(EncodedPage {
   92 |                         column_idx: encoded_page.column_idx,
   93 |                         data: encoded_page.data,
   94 |                         description: PageEncoding::Structural(wrapped),
   95 |                         num_rows: encoded_page.num_rows,
   96 |                         row_number: encoded_page.row_number,
   97 |                     })
   98 |                 })
   99 |                 .boxed()
  100 |             })
  101 |             .collect::<Vec<_>>()
  102 |     }
  103 | }
  104 | 
  105 | impl FieldEncoder for BlobStructuralEncoder {
  106 |     fn maybe_encode(
  107 |         &mut self,
  108 |         array: ArrayRef,
  109 |         external_buffers: &mut OutOfLineBuffers,
  110 |         mut repdef: RepDefBuilder,
  111 |         row_number: u64,
  112 |         num_rows: u64,
  113 |     ) -> Result<Vec<EncodeTask>> {
  114 |         if let Some(validity) = array.nulls() {
  115 |             repdef.add_validity_bitmap(validity.clone());
  116 |         } else {
  117 |             repdef.add_no_null(array.len());
  118 |         }
  119 | 
  120 |         // Convert input array to LargeBinary
  121 |         let binary_array = array.as_binary_opt::<i64>().ok_or_else(|| {
  122 |             Error::invalid_input_source(
  123 |                 format!("Expected LargeBinary array, got {}", array.data_type()).into(),
  124 |             )
  125 |         })?;
  126 | 
  127 |         let repdef = RepDefBuilder::serialize(vec![repdef]);
  128 | 
  129 |         let rep = repdef.repetition_levels.as_ref();
  130 |         let def = repdef.definition_levels.as_ref();
  131 |         let def_meaning: Arc<[DefinitionInterpretation]> = repdef.def_meaning.into();
  132 | 
  133 |         // A blob page stores one definition interpretation for all of its rows.
  134 |         // The descriptor encoder can buffer multiple input arrays, so finish the
  135 |         // pending page before a later array changes from all-valid to nullable (or
  136 |         // vice versa).
  137 |         let mut encode_tasks = match self.def_meaning.as_ref() {
  138 |             Some(existing) if existing != &def_meaning => {
  139 |                 let existing = existing.clone();
  140 |                 Self::wrap_tasks(self.descriptor_encoder.flush(external_buffers)?, existing)
  141 |             }
  142 |             _ => Vec::new(),
  143 |         };
  144 |         self.def_meaning = Some(def_meaning.clone());
  145 | 
  146 |         // Collect positions and sizes
  147 |         let mut positions = Vec::with_capacity(binary_array.len());
  148 |         let mut sizes = Vec::with_capacity(binary_array.len());
  149 | 
  150 |         for i in 0..binary_array.len() {
  151 |             if binary_array.is_null(i) {
  152 |                 // Null values are smuggled into the positions array
  153 | 
  154 |                 // If we have null values we must have definition levels
  155 |                 let mut repdef = (def.expect_ok()?[i] as u64) << 16;
  156 |                 if let Some(rep) = rep {
  157 |                     repdef += rep[i] as u64;
  158 |                 }
  159 | 
  160 |                 debug_assert_ne!(repdef, 0);
  161 |                 positions.push(repdef);
  162 |                 sizes.push(0);
  163 |             } else {
  164 |                 let value = binary_array.value(i);
  165 |                 if value.is_empty() {
  166 |                     // Empty values
  167 |                     positions.push(0);
  168 |                     sizes.push(0);
  169 |                 } else {
  170 |                     // Add data to external buffers
  171 |                     let position =
  172 |                         external_buffers.add_buffer(LanceBuffer::from(Buffer::from(value)));
  173 |                     positions.push(position);
  174 |                     sizes.push(value.len() as u64);
  175 |                 }
  176 |             }
  177 |         }
  178 | 
  179 |         // Create descriptor array
  180 |         let position_array = Arc::new(UInt64Array::from(positions));
  181 |         let size_array = Arc::new(UInt64Array::from(sizes));
  182 |         let descriptor_array = Arc::new(StructArray::new(
  183 |             Fields::from(vec![
  184 |                 ArrowField::new("position", DataType::UInt64, false),
  185 |                 ArrowField::new("size", DataType::UInt64, false),
  186 |             ]),
  187 |             vec![position_array as ArrayRef, size_array as ArrayRef],
  188 |             None, // Descriptors are never null
  189 |         ));
  190 | 
  191 |         // Delegate to descriptor encoder
  192 |         let descriptor_tasks = self.descriptor_encoder.maybe_encode(
  193 |             descriptor_array,
  194 |             external_buffers,
  195 |             RepDefBuilder::default(),
  196 |             row_number,
  197 |             num_rows,
  198 |         )?;
  199 |         encode_tasks.extend(Self::wrap_tasks(descriptor_tasks, def_meaning));
  200 | 
  201 |         Ok(encode_tasks)
  202 |     }
  203 | 
  204 |     fn flush(&mut self, external_buffers: &mut OutOfLineBuffers) -> Result<Vec<EncodeTask>> {
  205 |         let encode_tasks = self.descriptor_encoder.flush(external_buffers)?;
  206 | 
  207 |         // Use the cached def meaning.  If we haven't seen any data yet then we can just use a dummy
  208 |         // value (not clear there would be any encode tasks in that case)
  209 |         let def_meaning = self
  210 |             .def_meaning
  211 |             .clone()
  212 |             .unwrap_or_else(|| Arc::new([DefinitionInterpretation::AllValidItem]));
  213 | 
  214 |         Ok(Self::wrap_tasks(encode_tasks, def_meaning))
  215 |     }
  216 | 
  217 |     fn finish(
  218 |         &mut self,
  219 |         external_buffers: &mut OutOfLineBuffers,
  220 |     ) -> BoxFuture<'_, Result<Vec<EncodedColumn>>> {
  221 |         self.descriptor_encoder.finish(external_buffers)
  222 |     }
  223 | 
  224 |     fn num_columns(&self) -> u32 {
  225 |         self.descriptor_encoder.num_columns()
  226 |     }
  227 | }
  228 | 
  229 | /// Blob v2 structural encoder
  230 | pub struct BlobV2StructuralEncoder {
  231 |     descriptor_encoder: Box<dyn FieldEncoder>,
  232 | }
  233 | 
  234 | impl BlobV2StructuralEncoder {
  235 |     pub fn new(
  236 |         field: &Field,
  237 |         make_descriptor_encoder: impl FnOnce(Field) -> Result<Box<dyn FieldEncoder>>,
  238 |     ) -> Result<Self> {
  239 |         let mut descriptor_metadata = HashMap::with_capacity(1);
  240 |         descriptor_metadata.insert(PACKED_STRUCT_META_KEY.to_string(), "true".to_string());
  241 | 
  242 |         let descriptor_data_type = DataType::Struct(BLOB_V2_DESC_FIELDS.clone());
  243 | 
  244 |         let descriptor_field = Field::try_from(
  245 |             ArrowField::new(&field.name, descriptor_data_type, field.nullable)
  246 |                 .with_metadata(descriptor_metadata),
  247 |         )?;
  248 | 
  249 |         let descriptor_encoder = make_descriptor_encoder(descriptor_field)?;
  250 | 
  251 |         Ok(Self { descriptor_encoder })
  252 |     }
  253 | }
  254 | 
  255 | impl FieldEncoder for BlobV2StructuralEncoder {
  256 |     fn maybe_encode(
  257 |         &mut self,
  258 |         array: ArrayRef,
  259 |         external_buffers: &mut OutOfLineBuffers,
  260 |         repdef: RepDefBuilder,
  261 |         row_number: u64,
  262 |         num_rows: u64,
  263 |     ) -> Result<Vec<EncodeTask>> {
  264 |         let struct_arr = array
  265 |             .as_any()
  266 |             .downcast_ref::<StructArray>()
  267 |             .ok_or_else(|| {
  268 |                 Error::invalid_input_source(
  269 |                     format!(
  270 |                         "Blob v2 encoder expected StructArray, got {}",
  271 |                         array.data_type()
  272 |                     )
  273 |                     .into(),
  274 |                 )
  275 |             })?;
  276 |         if BlobV2Layout::classify(struct_arr.fields()) != Some(BlobV2Layout::Prepared) {
  277 |             let actual = BlobV2Layout::classify(struct_arr.fields())
  278 |                 .map(|layout| layout.to_string())
  279 |                 .unwrap_or_else(|| format!("unrecognized ({:?})", struct_arr.fields()));
  280 |             return Err(Error::invalid_input_source(
  281 |                 format!("Blob v2 encoder expected prepared array layout, got {actual} layout")
  282 |                     .into(),
  283 |             ));
  284 |         }
  285 | 
  286 |         let kind_col = struct_arr
  287 |             .column_by_name("kind")
  288 |             .ok_or_else(|| {
  289 |                 Error::invalid_input_source("Blob v2 struct missing `kind` field".into())
  290 |             })?
  291 |             .as_primitive::<UInt8Type>();
  292 |         let data_col = struct_arr
  293 |             .column_by_name("data")
  294 |             .ok_or_else(|| {
  295 |                 Error::invalid_input_source("Blob v2 struct missing `data` field".into())
  296 |             })?
  297 |             .as_binary::<i64>();
  298 |         let uri_col = struct_arr
  299 |             .column_by_name("uri")
  300 |             .ok_or_else(|| {
  301 |                 Error::invalid_input_source("Blob v2 struct missing `uri` field".into())
  302 |             })?
  303 |             .as_string::<i32>();
  304 |         let blob_id_col = struct_arr
  305 |             .column_by_name("blob_id")
  306 |             .ok_or_else(|| {
  307 |                 Error::invalid_input_source("Blob v2 struct missing `blob_id` field".into())
  308 |             })?
  309 |             .as_primitive::<UInt32Type>();
  310 |         let blob_size_col = struct_arr
  311 |             .column_by_name("blob_size")
  312 |             .ok_or_else(|| {
  313 |                 Error::invalid_input_source("Blob v2 struct missing `blob_size` field".into())
  314 |             })?
  315 |             .as_primitive::<UInt64Type>();
  316 |         let packed_position_col = struct_arr
  317 |             .column_by_name("position")
  318 |             .ok_or_else(|| {
  319 |                 Error::invalid_input_source("Blob v2 struct missing `position` field".into())
  320 |             })?
  321 |             .as_primitive::<UInt64Type>();
  322 | 
  323 |         let row_count = struct_arr.len();
  324 | 
  325 |         let mut kind_builder = PrimitiveBuilder::<UInt8Type>::with_capacity(row_count);
  326 |         let mut position_builder = PrimitiveBuilder::<UInt64Type>::with_capacity(row_count);
  327 |         let mut size_builder = PrimitiveBuilder::<UInt64Type>::with_capacity(row_count);
  328 |         let mut blob_id_builder = PrimitiveBuilder::<UInt32Type>::with_capacity(row_count);
  329 |         let mut uri_builder = StringBuilder::with_capacity(row_count, row_count * 16);
  330 | 
  331 |         for i in 0..row_count {
  332 |             let (kind_value, position_value, size_value, blob_id_value, uri_value) =
  333 |                 if struct_arr.is_null(i) || kind_col.is_null(i) {
  334 |                     (BlobKind::Inline as u8, 0, 0, 0, "".to_string())
  335 |                 } else {
  336 |                     let kind_val = BlobKind::try_from(kind_col.value(i))?;
  337 |                     match kind_val {
  338 |                         BlobKind::Dedicated => (
  339 |                             BlobKind::Dedicated as u8,
  340 |                             0,
  341 |                             blob_size_col.value(i),
  342 |                             blob_id_col.value(i),
  343 |                             "".to_string(),
  344 |                         ),
  345 |                         BlobKind::External => {
  346 |                             let uri = uri_col.value(i).to_string();
  347 |                             let position = if packed_position_col.is_null(i) {
  348 |                                 0
  349 |                             } else {
  350 |                                 packed_position_col.value(i)
  351 |                             };
  352 |                             let size = if blob_size_col.is_null(i) {
  353 |                                 0
  354 |                             } else {
  355 |                                 blob_size_col.value(i)
  356 |                             };
  357 |                             let external_base_id = if blob_id_col.is_null(i) {
  358 |                                 0
  359 |                             } else {
  360 |                                 blob_id_col.value(i)
  361 |                             };
  362 |                             (
  363 |                                 BlobKind::External as u8,
  364 |                                 position,
  365 |                                 size,
  366 |                                 external_base_id,
  367 |                                 uri,
  368 |                             )
  369 |                         }
  370 |                         BlobKind::Packed => (
  371 |                             BlobKind::Packed as u8,
  372 |                             packed_position_col.value(i),
  373 |                             blob_size_col.value(i),
  374 |                             blob_id_col.value(i),
  375 |                             "".to_string(),
  376 |                         ),
  377 |                         BlobKind::Inline => {
  378 |                             let data_val = data_col.value(i);
  379 |                             let blob_len = data_val.len() as u64;
  380 |                             let position = external_buffers
  381 |                                 .add_buffer(LanceBuffer::from(Buffer::from(data_val)));
  382 | 
  383 |                             (
  384 |                                 BlobKind::Inline as u8,
  385 |                                 position,
  386 |                                 blob_len,
  387 |                                 0,
  388 |                                 "".to_string(),
  389 |                             )
  390 |                         }
  391 |                     }
  392 |                 };
  393 | 
  394 |             kind_builder.append_value(kind_value);
  395 |             position_builder.append_value(position_value);
  396 |             size_builder.append_value(size_value);
  397 |             blob_id_builder.append_value(blob_id_value);
  398 |             uri_builder.append_value(uri_value);
  399 |         }
  400 |         let children: Vec<ArrayRef> = vec![
  401 |             Arc::new(kind_builder.finish()),
  402 |             Arc::new(position_builder.finish()),
  403 |             Arc::new(size_builder.finish()),
  404 |             Arc::new(blob_id_builder.finish()),
  405 |             Arc::new(uri_builder.finish()),
  406 |         ];
  407 | 
  408 |         let descriptor_array = Arc::new(StructArray::try_new(
  409 |             BLOB_V2_DESC_FIELDS.clone(),
  410 |             children,
  411 |             struct_arr.nulls().cloned(),
  412 |         )?) as ArrayRef;
  413 | 
  414 |         self.descriptor_encoder.maybe_encode(
  415 |             descriptor_array,
  416 |             external_buffers,
  417 |             repdef,
  418 |             row_number,
  419 |             num_rows,
  420 |         )
  421 |     }
  422 | 
  423 |     fn flush(&mut self, external_buffers: &mut OutOfLineBuffers) -> Result<Vec<EncodeTask>> {
  424 |         self.descriptor_encoder.flush(external_buffers)
  425 |     }
  426 | 
  427 |     fn finish(
  428 |         &mut self,
  429 |         external_buffers: &mut OutOfLineBuffers,
  430 |     ) -> BoxFuture<'_, Result<Vec<EncodedColumn>>> {
  431 |         self.descriptor_encoder.finish(external_buffers)
  432 |     }
  433 | 
  434 |     fn num_columns(&self) -> u32 {
  435 |         self.descriptor_encoder.num_columns()
  436 |     }
  437 | }
  438 | 
  439 | #[cfg(test)]
  440 | mod tests {
  441 |     use super::*;
  442 |     use crate::{
  443 |         encoder::{ColumnIndexSequence, EncodingOptions},
  444 |         testing::{
  445 |             TestCases, TestEncoding, check_round_trip_encoding_of_data,
  446 |             check_round_trip_encoding_of_data_with_expected, create_test_field_encoder,
  447 |             test_encoding_strategy,
  448 |         },
  449 |     };
  450 |     use arrow_array::{
  451 |         ArrayRef, LargeBinaryArray, StringArray, StructArray, UInt8Array, UInt32Array, UInt64Array,
  452 |     };
  453 |     use arrow_schema::{DataType, Field as ArrowField};
  454 |     use lance_core::datatypes::BLOB_V2_LOGICAL_MINIMAL_FIELDS;
  455 | 
  456 |     #[test]
  457 |     fn test_blob_encoder_creation() {
  458 |         let field = Field::try_from(
  459 |             ArrowField::new("blob_field", DataType::LargeBinary, true).with_metadata(
  460 |                 HashMap::from([(lance_arrow::BLOB_META_KEY.to_string(), "true".to_string())]),
  461 |             ),
  462 |         )
  463 |         .unwrap();
  464 |         let mut column_index = ColumnIndexSequence::default();
  465 |         let options = EncodingOptions::default();
  466 |         let strategy = test_encoding_strategy(TestEncoding::StructuralU16);
  467 | 
  468 |         let encoder =
  469 |             create_test_field_encoder(strategy.as_ref(), &field, &mut column_index, &options);
  470 | 
  471 |         assert!(encoder.is_ok());
  472 |     }
  473 | 
  474 |     #[test]
  475 |     fn test_blob_v2_encoder_rejects_logical_array_layout() {
  476 |         let field = Field::try_from(
  477 |             ArrowField::new(
  478 |                 "blob_field",
  479 |                 DataType::Struct(BLOB_V2_LOGICAL_MINIMAL_FIELDS.clone()),
  480 |                 true,
  481 |             )
  482 |             .with_metadata(HashMap::from([(
  483 |                 lance_arrow::ARROW_EXT_NAME_KEY.to_string(),
  484 |                 lance_arrow::BLOB_V2_EXT_NAME.to_string(),
  485 |             )])),
  486 |         )
  487 |         .unwrap();
  488 |         let mut column_index = ColumnIndexSequence::default();
  489 |         let options = EncodingOptions::default();
  490 |         let strategy = test_encoding_strategy(TestEncoding::StructuralU32);
  491 |         let mut encoder =
  492 |             create_test_field_encoder(strategy.as_ref(), &field, &mut column_index, &options)
  493 |                 .unwrap();
  494 |         let array = Arc::new(
  495 |             StructArray::try_new(
  496 |                 BLOB_V2_LOGICAL_MINIMAL_FIELDS.clone(),
  497 |                 vec![
  498 |                     Arc::new(LargeBinaryArray::from(vec![Some(b"payload".as_ref())])) as ArrayRef,
  499 |                     Arc::new(StringArray::from(vec![None::<&str>])) as ArrayRef,
  500 |                 ],
  501 |                 None,
  502 |             )
  503 |             .unwrap(),
  504 |         ) as ArrayRef;
  505 |         let mut external_buffers = OutOfLineBuffers::new(0, 8);
  506 |         let Err(error) =
  507 |             encoder.maybe_encode(array, &mut external_buffers, RepDefBuilder::default(), 0, 1)
  508 |         else {
  509 |             panic!("logical array layout unexpectedly reached the descriptor encoder");
  510 |         };
  511 |         assert!(matches!(error, Error::InvalidInput { .. }));
  512 |         assert!(
  513 |             error
  514 |                 .to_string()
  515 |                 .contains("expected prepared array layout, got logical layout")
  516 |         );
  517 |     }
  518 | 
  519 |     #[tokio::test]
  520 |     async fn test_blob_encoding_simple() {
  521 |         let field = Field::try_from(
  522 |             ArrowField::new("blob_field", DataType::LargeBinary, true).with_metadata(
  523 |                 HashMap::from([(lance_arrow::BLOB_META_KEY.to_string(), "true".to_string())]),
  524 |             ),
  525 |         )
  526 |         .unwrap();
  527 |         let mut column_index = ColumnIndexSequence::default();
  528 |         let options = EncodingOptions::default();
  529 |         let strategy = test_encoding_strategy(TestEncoding::StructuralU16);
  530 | 
  531 |         let mut encoder =
  532 |             create_test_field_encoder(strategy.as_ref(), &field, &mut column_index, &options)
  533 |                 .unwrap();
  534 | 
  535 |         // Create test data with larger blobs
  536 |         let large_data = vec![0u8; 1024 * 100]; // 100KB blob
  537 |         let data: Vec<Option<&[u8]>> =
  538 |             vec![Some(b"hello world"), None, Some(&large_data), Some(b"")];
  539 |         let array = Arc::new(LargeBinaryArray::from(data));
  540 | 
  541 |         // Test encoding
  542 |         let mut external_buffers = OutOfLineBuffers::new(0, 8);
  543 |         let repdef = RepDefBuilder::default();
  544 | 
  545 |         let tasks = encoder
  546 |             .maybe_encode(array, &mut external_buffers, repdef, 0, 4)
  547 |             .unwrap();
  548 | 
  549 |         // If no tasks yet, flush to force encoding
  550 |         if tasks.is_empty() {
  551 |             let _flush_tasks = encoder.flush(&mut external_buffers).unwrap();
  552 |         }
  553 | 
  554 |         // Should produce encode tasks for the descriptor (or we need more data)
  555 |         // For now, just verify no errors occurred
  556 |         assert!(encoder.num_columns() > 0);
  557 | 
  558 |         // Verify external buffers were used for large data
  559 |         let buffers = external_buffers.take_buffers();
  560 |         assert!(
  561 |             !buffers.is_empty(),
  562 |             "Large blobs should be stored in external buffers"
  563 |         );
  564 |     }
  565 | 
  566 |     #[tokio::test]
  567 |     async fn test_blob_round_trip() {
  568 |         // Test round-trip encoding with blob metadata
  569 |         let blob_metadata =
  570 |             HashMap::from([(lance_arrow::BLOB_META_KEY.to_string(), "true".to_string())]);
  571 | 
  572 |         // Create test data
  573 |         let val1: &[u8] = &vec![1u8; 1024]; // 1KB
  574 |         let val2: &[u8] = &vec![2u8; 10240]; // 10KB
  575 |         let val3: &[u8] = &vec![3u8; 102400]; // 100KB
  576 |         let array = Arc::new(LargeBinaryArray::from(vec![
  577 |             Some(val1),
  578 |             None,
  579 |             Some(val2),
  580 |             Some(val3),
  581 |         ]));
  582 | 
  583 |         // Use the standard test harness
  584 |         check_round_trip_encoding_of_data(
  585 |             vec![array],
  586 |             &TestCases::default().with_array_and_u16_encodings(),
  587 |             blob_metadata,
  588 |         )
  589 |         .await;
  590 |     }
  591 | 
  592 |     #[tokio::test]
  593 |     async fn test_blob_round_trip_empty_values() {
  594 |         // Empty values share size == 0 with nulls in the descriptor layout
  595 |         // and schedule no read; each must decode to zero-length bytes without
  596 |         // consuming the read result of a following non-empty blob. Empties
  597 |         // are placed before payloads so a misassignment corrupts the output
  598 |         // instead of only exhausting the read iterator.
  599 |         let blob_metadata =
  600 |             HashMap::from([(lance_arrow::BLOB_META_KEY.to_string(), "true".to_string())]);
  601 | 
  602 |         let val1: &[u8] = &vec![1u8; 1024];
  603 |         let val2: &[u8] = &vec![2u8; 10240];
  604 |         let empty: &[u8] = &[];
  605 |         let array = Arc::new(LargeBinaryArray::from(vec![
  606 |             Some(empty),
  607 |             Some(val1),
  608 |             None,
  609 |             Some(empty),
  610 |             Some(val2),
  611 |             None,
  612 |             Some(empty),
  613 |         ]));
  614 | 
  615 |         check_round_trip_encoding_of_data(vec![array], &TestCases::default(), blob_metadata).await;
  616 |     }
  617 | 
  618 |     #[tokio::test]
  619 |     async fn test_blob_round_trip_varying_chunk_nullability() {
  620 |         let blob_metadata =
  621 |             HashMap::from([(lance_arrow::BLOB_META_KEY.to_string(), "true".to_string())]);
  622 |         let all_valid = Arc::new(LargeBinaryArray::from(vec![Some(b"first".as_ref())]));
  623 |         let with_null = Arc::new(LargeBinaryArray::from(vec![
  624 |             Some(b"second".as_ref()),
  625 |             None,
  626 |             Some(b"".as_ref()),
  627 |         ]));
  628 |         let all_valid_again = Arc::new(LargeBinaryArray::from(vec![Some(b"last".as_ref())]));
  629 | 
  630 |         check_round_trip_encoding_of_data(
  631 |             vec![all_valid, with_null, all_valid_again],
  632 |             &TestCases::default().with_encoding(TestEncoding::StructuralU16),
  633 |             blob_metadata,
  634 |         )
  635 |         .await;
  636 |     }
  637 | 
  638 |     #[tokio::test]
  639 |     async fn test_blob_v2_external_round_trip() {
  640 |         let blob_metadata = HashMap::from([(
  641 |             lance_arrow::ARROW_EXT_NAME_KEY.to_string(),
  642 |             lance_arrow::BLOB_V2_EXT_NAME.to_string(),
  643 |         )]);
  644 | 
  645 |         let kind_field = Arc::new(ArrowField::new("kind", DataType::UInt8, true));
  646 |         let data_field = Arc::new(ArrowField::new("data", DataType::LargeBinary, true));
  647 |         let uri_field = Arc::new(ArrowField::new("uri", DataType::Utf8, true));
  648 |         let blob_id_field = Arc::new(ArrowField::new("blob_id", DataType::UInt32, true));
  649 |         let blob_size_field = Arc::new(ArrowField::new("blob_size", DataType::UInt64, true));
  650 |         let position_field = Arc::new(ArrowField::new("position", DataType::UInt64, true));
  651 | 
  652 |         let kind_array = UInt8Array::from(vec![
  653 |             BlobKind::Inline as u8,
  654 |             BlobKind::External as u8,
  655 |             BlobKind::External as u8,
  656 |         ]);
  657 |         let data_array = LargeBinaryArray::from(vec![Some(b"inline".as_ref()), None, None]);
  658 |         let uri_array = StringArray::from(vec![
  659 |             None,
  660 |             Some("file:///tmp/external.bin"),
  661 |             Some("s3://bucket/blob"),
  662 |         ]);
  663 |         let blob_id_array = UInt32Array::from(vec![0, 0, 0]);
  664 |         let blob_size_array = UInt64Array::from(vec![0, 0, 0]);
  665 |         let position_array = UInt64Array::from(vec![0, 0, 0]);
  666 | 
  667 |         let struct_array = StructArray::from(vec![
  668 |             (kind_field, Arc::new(kind_array) as ArrayRef),
  669 |             (data_field, Arc::new(data_array) as ArrayRef),
  670 |             (uri_field, Arc::new(uri_array) as ArrayRef),
  671 |             (blob_id_field, Arc::new(blob_id_array) as ArrayRef),
  672 |             (blob_size_field, Arc::new(blob_size_array) as ArrayRef),
  673 |             (position_field, Arc::new(position_array) as ArrayRef),
  674 |         ]);
  675 | 
  676 |         let expected_descriptor = StructArray::from(vec![
  677 |             (
  678 |                 Arc::new(ArrowField::new("kind", DataType::UInt8, false)),
  679 |                 Arc::new(UInt8Array::from(vec![
  680 |                     BlobKind::Inline as u8,
  681 |                     BlobKind::External as u8,
  682 |                     BlobKind::External as u8,
  683 |                 ])) as ArrayRef,
  684 |             ),
  685 |             (
  686 |                 Arc::new(ArrowField::new("position", DataType::UInt64, false)),
  687 |                 Arc::new(UInt64Array::from(vec![0, 0, 0])) as ArrayRef,
  688 |             ),
  689 |             (
  690 |                 Arc::new(ArrowField::new("size", DataType::UInt64, false)),
  691 |                 Arc::new(UInt64Array::from(vec![6, 0, 0])) as ArrayRef,
  692 |             ),
  693 |             (
  694 |                 Arc::new(ArrowField::new("blob_id", DataType::UInt32, false)),
  695 |                 Arc::new(UInt32Array::from(vec![0, 0, 0])) as ArrayRef,
  696 |             ),
  697 |             (
  698 |                 Arc::new(ArrowField::new("blob_uri", DataType::Utf8, false)),
  699 |                 Arc::new(StringArray::from(vec![
  700 |                     "",
  701 |                     "file:///tmp/external.bin",
  702 |                     "s3://bucket/blob",
  703 |                 ])) as ArrayRef,
  704 |             ),
  705 |         ]);
  706 | 
  707 |         check_round_trip_encoding_of_data_with_expected(
  708 |             vec![Arc::new(struct_array)],
  709 |             Some(Arc::new(expected_descriptor)),
  710 |             &TestCases::default().with_u32_structural_encodings(),
  711 |             blob_metadata,
  712 |         )
  713 |         .await;
  714 |     }
  715 | 
  716 |     #[tokio::test]
  717 |     async fn test_blob_v2_dedicated_round_trip() {
  718 |         let blob_metadata = HashMap::from([(
  719 |             lance_arrow::ARROW_EXT_NAME_KEY.to_string(),
  720 |             lance_arrow::BLOB_V2_EXT_NAME.to_string(),
  721 |         )]);
  722 | 
  723 |         let kind_field = Arc::new(ArrowField::new("kind", DataType::UInt8, true));
  724 |         let data_field = Arc::new(ArrowField::new("data", DataType::LargeBinary, true));
  725 |         let uri_field = Arc::new(ArrowField::new("uri", DataType::Utf8, true));
  726 |         let blob_id_field = Arc::new(ArrowField::new("blob_id", DataType::UInt32, true));
  727 |         let blob_size_field = Arc::new(ArrowField::new("blob_size", DataType::UInt64, true));
  728 |         let position_field = Arc::new(ArrowField::new("position", DataType::UInt64, true));
  729 | 
  730 |         let kind_array = UInt8Array::from(vec![BlobKind::Dedicated as u8, BlobKind::Inline as u8]);
  731 |         let data_array = LargeBinaryArray::from(vec![None, Some(b"abc".as_ref())]);
  732 |         let uri_array = StringArray::from(vec![Option::<&str>::None, None]);
  733 |         let blob_id_array = UInt32Array::from(vec![42, 0]);
  734 |         let blob_size_array = UInt64Array::from(vec![12, 0]);
  735 |         let position_array = UInt64Array::from(vec![0, 0]);
  736 | 
  737 |         let struct_array = StructArray::from(vec![
  738 |             (kind_field, Arc::new(kind_array) as ArrayRef),
  739 |             (data_field, Arc::new(data_array) as ArrayRef),
  740 |             (uri_field, Arc::new(uri_array) as ArrayRef),
  741 |             (blob_id_field, Arc::new(blob_id_array) as ArrayRef),
  742 |             (blob_size_field, Arc::new(blob_size_array) as ArrayRef),
  743 |             (position_field, Arc::new(position_array) as ArrayRef),
  744 |         ]);
  745 | 
  746 |         let expected_descriptor = StructArray::from(vec![
  747 |             (
  748 |                 Arc::new(ArrowField::new("kind", DataType::UInt8, false)),
  749 |                 Arc::new(UInt8Array::from(vec![
  750 |                     BlobKind::Dedicated as u8,
  751 |                     BlobKind::Inline as u8,
  752 |                 ])) as ArrayRef,
  753 |             ),
  754 |             (
  755 |                 Arc::new(ArrowField::new("position", DataType::UInt64, false)),
  756 |                 Arc::new(UInt64Array::from(vec![0, 0])) as ArrayRef,
  757 |             ),
  758 |             (
  759 |                 Arc::new(ArrowField::new("size", DataType::UInt64, false)),
  760 |                 Arc::new(UInt64Array::from(vec![12, 3])) as ArrayRef,
  761 |             ),
  762 |             (
  763 |                 Arc::new(ArrowField::new("blob_id", DataType::UInt32, false)),
  764 |                 Arc::new(UInt32Array::from(vec![42, 0])) as ArrayRef,
  765 |             ),
  766 |             (
  767 |                 Arc::new(ArrowField::new("blob_uri", DataType::Utf8, false)),
  768 |                 Arc::new(StringArray::from(vec!["", ""])) as ArrayRef,
  769 |             ),
  770 |         ]);
  771 | 
  772 |         check_round_trip_encoding_of_data_with_expected(
  773 |             vec![Arc::new(struct_array)],
  774 |             Some(Arc::new(expected_descriptor)),
  775 |             &TestCases::default().with_u32_structural_encodings(),
  776 |             blob_metadata,
  777 |         )
  778 |         .await;
  779 |     }
  780 | 
  781 |     #[tokio::test]
  782 |     async fn test_blob_v2_external_with_range_round_trip() {
  783 |         let blob_metadata = HashMap::from([(
  784 |             lance_arrow::ARROW_EXT_NAME_KEY.to_string(),
  785 |             lance_arrow::BLOB_V2_EXT_NAME.to_string(),
  786 |         )]);
  787 | 
  788 |         let kind_field = Arc::new(ArrowField::new("kind", DataType::UInt8, true));
  789 |         let data_field = Arc::new(ArrowField::new("data", DataType::LargeBinary, true));
  790 |         let uri_field = Arc::new(ArrowField::new("uri", DataType::Utf8, true));
  791 |         let blob_id_field = Arc::new(ArrowField::new("blob_id", DataType::UInt32, true));
  792 |         let blob_size_field = Arc::new(ArrowField::new("blob_size", DataType::UInt64, true));
  793 |         let position_field = Arc::new(ArrowField::new("position", DataType::UInt64, true));
  794 | 
  795 |         let kind_array = UInt8Array::from(vec![BlobKind::External as u8]);
  796 |         let data_array = LargeBinaryArray::from(vec![None::<&[u8]>]);
  797 |         let uri_array = StringArray::from(vec![Some("memory://container.pack")]);
  798 |         let blob_id_array = UInt32Array::from(vec![0]);
  799 |         let blob_size_array = UInt64Array::from(vec![42]);
  800 |         let position_array = UInt64Array::from(vec![7]);
  801 | 
  802 |         let struct_array = StructArray::from(vec![
  803 |             (kind_field, Arc::new(kind_array) as ArrayRef),
  804 |             (data_field, Arc::new(data_array) as ArrayRef),
  805 |             (uri_field, Arc::new(uri_array) as ArrayRef),
  806 |             (blob_id_field, Arc::new(blob_id_array) as ArrayRef),
  807 |             (blob_size_field, Arc::new(blob_size_array) as ArrayRef),
  808 |             (position_field, Arc::new(position_array) as ArrayRef),
  809 |         ]);
  810 | 
  811 |         let expected_descriptor = StructArray::from(vec![
  812 |             (
  813 |                 Arc::new(ArrowField::new("kind", DataType::UInt8, false)),
  814 |                 Arc::new(UInt8Array::from(vec![BlobKind::External as u8])) as ArrayRef,
  815 |             ),
  816 |             (
  817 |                 Arc::new(ArrowField::new("position", DataType::UInt64, false)),
  818 |                 Arc::new(UInt64Array::from(vec![7])) as ArrayRef,
  819 |             ),
  820 |             (
  821 |                 Arc::new(ArrowField::new("size", DataType::UInt64, false)),
  822 |                 Arc::new(UInt64Array::from(vec![42])) as ArrayRef,
  823 |             ),
  824 |             (
  825 |                 Arc::new(ArrowField::new("blob_id", DataType::UInt32, false)),
  826 |                 Arc::new(UInt32Array::from(vec![0])) as ArrayRef,
  827 |             ),
  828 |             (
  829 |                 Arc::new(ArrowField::new("blob_uri", DataType::Utf8, false)),
  830 |                 Arc::new(StringArray::from(vec!["memory://container.pack"])) as ArrayRef,
  831 |             ),
  832 |         ]);
  833 | 
  834 |         check_round_trip_encoding_of_data_with_expected(
  835 |             vec![Arc::new(struct_array)],
  836 |             Some(Arc::new(expected_descriptor)),
  837 |             &TestCases::default().with_u32_structural_encodings(),
  838 |             blob_metadata,
  839 |         )
  840 |         .await;
  841 |     }
  842 | 
  843 |     #[tokio::test]
  844 |     async fn test_blob_v2_packed_round_trip() {
  845 |         let blob_metadata = HashMap::from([(
  846 |             lance_arrow::ARROW_EXT_NAME_KEY.to_string(),
  847 |             lance_arrow::BLOB_V2_EXT_NAME.to_string(),
  848 |         )]);
  849 | 
  850 |         let kind_field = Arc::new(ArrowField::new("kind", DataType::UInt8, true));
  851 |         let data_field = Arc::new(ArrowField::new("data", DataType::LargeBinary, true));
  852 |         let uri_field = Arc::new(ArrowField::new("uri", DataType::Utf8, true));
  853 |         let blob_id_field = Arc::new(ArrowField::new("blob_id", DataType::UInt32, true));
  854 |         let blob_size_field = Arc::new(ArrowField::new("blob_size", DataType::UInt64, true));
  855 |         let position_field = Arc::new(ArrowField::new("position", DataType::UInt64, true));
  856 | 
  857 |         let kind_array = UInt8Array::from(vec![BlobKind::Packed as u8]);
  858 |         let data_array = LargeBinaryArray::from(vec![None::<&[u8]>]);
  859 |         let uri_array = StringArray::from(vec![None::<&str>]);
  860 |         let blob_id_array = UInt32Array::from(vec![7]);
  861 |         let blob_size_array = UInt64Array::from(vec![5]);
  862 |         let position_array = UInt64Array::from(vec![10]);
  863 | 
  864 |         let struct_array = StructArray::from(vec![
  865 |             (kind_field, Arc::new(kind_array) as ArrayRef),
  866 |             (data_field, Arc::new(data_array) as ArrayRef),
  867 |             (uri_field, Arc::new(uri_array) as ArrayRef),
  868 |             (blob_id_field, Arc::new(blob_id_array) as ArrayRef),
  869 |             (blob_size_field, Arc::new(blob_size_array) as ArrayRef),
  870 |             (position_field, Arc::new(position_array) as ArrayRef),
  871 |         ]);
  872 | 
  873 |         let expected_descriptor = StructArray::from(vec![
  874 |             (
  875 |                 Arc::new(ArrowField::new("kind", DataType::UInt8, false)),
  876 |                 Arc::new(UInt8Array::from(vec![BlobKind::Packed as u8])) as ArrayRef,
  877 |             ),
  878 |             (
  879 |                 Arc::new(ArrowField::new("position", DataType::UInt64, false)),
  880 |                 Arc::new(UInt64Array::from(vec![10])) as ArrayRef,
  881 |             ),
  882 |             (
  883 |                 Arc::new(ArrowField::new("size", DataType::UInt64, false)),
  884 |                 Arc::new(UInt64Array::from(vec![5])) as ArrayRef,
  885 |             ),
  886 |             (
  887 |                 Arc::new(ArrowField::new("blob_id", DataType::UInt32, false)),
  888 |                 Arc::new(UInt32Array::from(vec![7])) as ArrayRef,
  889 |             ),
  890 |             (
  891 |                 Arc::new(ArrowField::new("blob_uri", DataType::Utf8, false)),
  892 |                 Arc::new(StringArray::from(vec![""])) as ArrayRef,
  893 |             ),
  894 |         ]);
  895 | 
  896 |         check_round_trip_encoding_of_data_with_expected(
  897 |             vec![Arc::new(struct_array)],
  898 |             Some(Arc::new(expected_descriptor)),
  899 |             &TestCases::default().with_u32_structural_encodings(),
  900 |             blob_metadata,
  901 |         )
  902 |         .await;
  903 |     }
  904 | }
``````
