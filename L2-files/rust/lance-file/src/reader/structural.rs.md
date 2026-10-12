> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-file/src/reader/structural.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `db150f1e7360b72eb2a24cd26c96a0a716e7cdc022a8aa8b905f55338a5bcf6a`. Reviewed physical lines: 1-445.

[Module](../../../../../L1-modules/rust-lance-file-composition.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Shared structural metadata syntax, alignment, leaf-column mapping and projection length/preparation for exact V2_1+ readers. Helpers are public within crate-internal reader::structural; exact grammar remains supplied by per-version DecodeColumn. (rust/lance-file/src/reader/structural.rs:1-445)

## Complete range analysis

### Lines 1-28

SPDX/imports connect BTreeMap/Arc, async_trait, Bytes, LanceCache/Field/Schema/errors, EncodingsIo/ColumnInfo/PageInfo/PageEncoding, legacy column and structural page protobufs, prost Name/Message, file protobuf and read-provider/projection helpers. PAGE_BUFFER_ALIGNMENT comes from writer (64 bytes). (rust/lance-file/src/reader/structural.rs:1-28)

### Lines 29-55

Private generic fetch_encoding<M:Default+Name+Sized> matches file encoding location. Indirect is InvalidInput unsupported; Direct clones payload Vec into Bytes, decodes Any envelope then to_msg<M>, mapping both errors to InvalidInput with M::NAME and original display. Explicit None encoding and absent location have distinct Missing description/location errors. It never follows external buffers; type URL/message validation is delegated to prost Any conversion. (rust/lance-file/src/reader/structural.rs:29-55)

### Lines 56-72

decode_page_layout requires page.encoding or InvalidInput naming column/page, then uses fetch_encoding to decode pb21::PageLayout syntax. It does not examine layout variant, version, required subfields or buffer grammar; exact reader must validate those before building normalized page info. (rust/lance-file/src/reader/structural.rs:56-72)

### Lines 73-92

build_page_info accepts already-supplied PageLayout. Before pairing offsets/sizes, reject unequal vector lengths with column/page and both counts. A caller can supply a layout not decoded from this page; no cross-check is performed here. (rust/lance-file/src/reader/structural.rs:73-92)

### Lines 93-117

Zip page buffers, reject every offset not divisible by PAGE_BUFFER_ALIGNMENT=64, collect fallibly and Arc-own descriptor slice. Empty pairs pass; zero size does not waive alignment. Construct Structural encoding with provided layout, page.length as num_rows and page.priority. No offset+size overflow, file bounds, overlap, buffer-size or row-count validation here. Temporary Vec drops on first error. (rust/lance-file/src/reader/structural.rs:93-117)

### Lines 118-143

build_column_info rejects unequal column buffer offset/size counts then copies pairs into Arc slice. Unlike page/global helpers, this column-level pairing performs no alignment check. page_infos is supplied by caller and is not compared against metadata.pages count or content. (rust/lance-file/src/reader/structural.rs:118-143)

### Lines 144-156

Require metadata.encoding (column-specific InvalidInput) and fetch pb::ColumnEncoding. Arc<ColumnInfo> records caller-supplied column_index, Arc page_infos, descriptor slice and encoding. Column encoding grammar/version is not validated here; descriptor allocation occurs before encoding decode and drops on error. (rust/lance-file/src/reader/structural.rs:144-156)

### Lines 157-172

validate_global_buffers iterates positions and rejects first unaligned position with zero-based buffer index/position/alignment. Empty buffers succeeds. Size, overlap, offset+size overflow and total file bounds are not inspected. No IO. (rust/lance-file/src/reader/structural.rs:157-172)

### Lines 173-188

Private field_column_shape returns contributes=true,recurse=false for Blob/packed, otherwise children-empty versus nonempty. Public physical_column_count mirrors this: one for Blob/packed/leaf (including an empty struct), otherwise sum descendants without a parent header. Child shape, not only logical type, drives physical mapping. Recursion and unchecked usize sums have no local bound. (rust/lance-file/src/reader/structural.rs:173-188)

### Lines 189-213

append_physical_fields recursively emits only leaves or opaque Blob/packed fields in source order, records existing i32 field ID and successive i32 counter then increments. Containers with children get no map entry. Public data_file_columns begins two empty vectors/counter0. Empty schema returns empty pair, no IDs assigned or validated; signed overflow not checked. (rust/lance-file/src/reader/structural.rs:189-213)

### Lines 214-225

field_id_to_column_index zips owned mappings, filters negative column_index (not negative field ID), casts to u32 and collects BTreeMap. Duplicate field IDs overwrite earlier entries; negative field IDs cast. Normal nonoverflowed numbering is nonnegative, but no schema validation is added. (rust/lance-file/src/reader/structural.rs:214-225)

### Lines 226-243

append_field_ids walks same shape, looks up contributing field.id as u32 and pushes found column index; absent IDs are silently omitted. Recursion is suppressed for opaque fields. It preserves schema traversal order and does not sort or deduplicate mapped columns. (rust/lance-file/src/reader/structural.rs:226-243)

### Lines 244-260

projection_from_field_ids is infallible: collect mapped columns and Arc-own a complete schema clone. Missing mappings do not remove corresponding schema fields, so later projection length validation can fail or mismap if caller supplied inconsistent mapping. It does not prune schema or verify rectangularity. (rust/lance-file/src/reader/structural.rs:244-260)

### Lines 261-277

projection_from_column_names first core schema.project(names)? then uses caller mapping with that schema. Errors from name projection propagate; no independent mapping validation. Private children_share_parent_length returns only logical_type.is_struct(); list-like children are intentionally not assumed to share parent row count. (rust/lance-file/src/reader/structural.rs:261-277)

### Lines 278-296

validate_field_length accepts comparable flag, index list, shared mutable cursor and fallible column-length closure. For a contributing field consume next index or InvalidInput naming the field; increment cursor before invoking column_len(index as usize). Leaf/Blob/packed lengths come from that physical column; first error returns immediately. (rust/lance-file/src/reader/structural.rs:278-296)

### Lines 297-318

For a recursing container, enforce_children = comparable && logical struct. Recurse with this flag and common cursor; first returned child length initializes field_rows. If enforced, any later child mismatch errors naming parent, child, actual and expected rows. Once a nonstruct ancestor makes comparable false, descendant structs do not reenable comparison. Container reports first child length; it does not multiply/divide list sizes or compute offsets. No resulting length gives maps-to-no-columns InvalidInput. Recursive depth unbounded locally. (rust/lance-file/src/reader/structural.rs:297-318)

### Lines 319-337

prepared_read_length closure indexes prepared.column_infos by supplied decoder index, errors with index/available count if out of range, then calls normalized_column_num_rows. Contextual helper uses checked u64 sums and sparse first structural layer num_slots when present, otherwise page.num_rows (rust/lance-file/src/reader.rs:539-561). Pass decoder schema and indices to projection_length; no I/O in this path. (rust/lance-file/src/reader/structural.rs:319-337)

### Lines 338-358

projection_length starts cursor0, reserves top-level length pairs, validates every field with comparable=true and stores borrowed name/length. After traversal reject surplus indices with supplied/required counts. Then verify_uniform_lengths enforces equal top-level lengths (empty schema+emptyindices =>0), contextual helper lists mismatching names/lengths (rust/lance-file/src/reader.rs:563-577). It does not independently reject duplicate column indices or zero fields. (rust/lance-file/src/reader/structural.rs:338-358)

### Lines 359-370

DecodeColumn is a plain fn(u32,&pbfile::ColumnMetadata)->Result<Arc<ColumnInfo>> type alias; capturing closures cannot be stored. Private Debug StructuralReadProjection owns that function pointer. read_projection wraps it in Arc<dyn ReadProjection>; exact grammar selection is injected without a version enum in this struct. (rust/lance-file/src/reader/structural.rs:359-370)

### Lines 371-392

async_trait ReadProjection impl: validate_indexed first calls provider structural validator, then requires projection_matches_indexed_metadata, else returns provider indexed_projection_error. read_length directly calls prepared_read_length. No metadata is fetched by these two methods. (rust/lance-file/src/reader/structural.rs:371-392)

### Lines 393-408

Async prepare Full branch validates projection against metadata and clones column_infos plus ReaderProjection. Shared metadata/schema allocations may remain Arc-shared; it does not decode/revalidate each column here or read disk. Validation errors abort before preparation. (rust/lance-file/src/reader/structural.rs:393-408)

### Lines 409-432

Indexed branch validates projection, awaits load_indexed_column_infos with exact decode fn, IO/cache and original column indices, then builds decoder projection with same schema Arc but dense 0..N indices cast to u32 in requested order. Metadata loader must return correspondingly ordered infos. After either branch, calculate read_length and return tuple; length failure can occur after indexed IO/cache work. No rollback/cancellation guard/spawn here; loader cache/concurrency/IO lifecycle remains delegated. (rust/lance-file/src/reader/structural.rs:409-432)

### Lines 433-445

cfg(test) public test_projection_length calls private length engine using synthetic lengths indexed by column number; missing synthetic index returns InvalidInput identifying column. It is a helper, not an executing test, and supplies no local fixtures/assertions. This file has no unsafe blocks or inline test cases. (rust/lance-file/src/reader/structural.rs:433-445)

## Interaction and interpretation limits

Every physical line was read in ANALYZE53. No source execution/build/test was performed. Exact current-version reader/writer bodies are analyzed; delegated compression/encoder helper internals remain pending; delegated calls are not evidence of their full behavior. 

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::{collections::BTreeMap, sync::Arc};
    5 | 
    6 | use async_trait::async_trait;
    7 | use bytes::Bytes;
    8 | use lance_core::{
    9 |     Error, Result,
   10 |     cache::LanceCache,
   11 |     datatypes::{Field, Schema},
   12 | };
   13 | use lance_encoding::{
   14 |     EncodingsIo,
   15 |     decoder::{ColumnInfo, PageEncoding, PageInfo},
   16 |     format::{pb, pb21},
   17 | };
   18 | use prost::{Message, Name};
   19 | 
   20 | use crate::{
   21 |     format::pbfile,
   22 |     reader::{
   23 |         BufferDescriptor, FileMetadataIndex, FileMetadataProvider, FileReader, PreparedProjection,
   24 |         ReadProjection, ReaderProjection, normalized_column_num_rows, verify_uniform_lengths,
   25 |     },
   26 |     writer::PAGE_BUFFER_ALIGNMENT,
   27 | };
   28 | 
   29 | fn fetch_encoding<M: Default + Name + Sized>(encoding: &pbfile::Encoding) -> Result<M> {
   30 |     match &encoding.location {
   31 |         Some(pbfile::encoding::Location::Indirect(_)) => Err(Error::invalid_input_source(
   32 |             "Indirect file encodings are not supported".into(),
   33 |         )),
   34 |         Some(pbfile::encoding::Location::Direct(encoding)) => {
   35 |             let envelope = prost_types::Any::decode(Bytes::from(encoding.encoding.clone()))
   36 |                 .map_err(|error| {
   37 |                     Error::invalid_input_source(
   38 |                         format!("Invalid direct {} encoding envelope: {error}", M::NAME).into(),
   39 |                     )
   40 |                 })?;
   41 |             envelope.to_msg::<M>().map_err(|error| {
   42 |                 Error::invalid_input_source(
   43 |                     format!("Invalid direct {} encoding: {error}", M::NAME).into(),
   44 |                 )
   45 |             })
   46 |         }
   47 |         Some(pbfile::encoding::Location::None(_)) => Err(Error::invalid_input_source(
   48 |             format!("Missing {} encoding description", M::NAME).into(),
   49 |         )),
   50 |         None => Err(Error::invalid_input_source(
   51 |             format!("Missing {} encoding location", M::NAME).into(),
   52 |         )),
   53 |     }
   54 | }
   55 | 
   56 | /// Decode structural page syntax before an exact reader validates its grammar.
   57 | pub fn decode_page_layout(
   58 |     column_index: u32,
   59 |     page_index: usize,
   60 |     page: &pbfile::column_metadata::Page,
   61 | ) -> Result<pb21::PageLayout> {
   62 |     fetch_encoding(page.encoding.as_ref().ok_or_else(|| {
   63 |         Error::invalid_input_source(
   64 |             format!(
   65 |                 "Column {} page {} is missing its encoding",
   66 |                 column_index, page_index
   67 |             )
   68 |             .into(),
   69 |         )
   70 |     })?)
   71 | }
   72 | 
   73 | /// Build normalized page metadata after exact grammar validation.
   74 | pub fn build_page_info(
   75 |     column_index: u32,
   76 |     page_index: usize,
   77 |     page: &pbfile::column_metadata::Page,
   78 |     page_layout: pb21::PageLayout,
   79 | ) -> Result<PageInfo> {
   80 |     if page.buffer_offsets.len() != page.buffer_sizes.len() {
   81 |         return Err(Error::invalid_input_source(
   82 |             format!(
   83 |                 "Column {} page {} has {} buffer offsets but {} buffer sizes",
   84 |                 column_index,
   85 |                 page_index,
   86 |                 page.buffer_offsets.len(),
   87 |                 page.buffer_sizes.len()
   88 |             )
   89 |             .into(),
   90 |         ));
   91 |     }
   92 |     let buffer_offsets_and_sizes = Arc::from(
   93 |         page.buffer_offsets
   94 |             .iter()
   95 |             .zip(&page.buffer_sizes)
   96 |             .map(|(offset, size)| {
   97 |                 if offset % PAGE_BUFFER_ALIGNMENT as u64 != 0 {
   98 |                     return Err(Error::invalid_input_source(
   99 |                         format!(
  100 |                             "Column {} page {} buffer offset {} is not aligned to {} bytes",
  101 |                             column_index, page_index, offset, PAGE_BUFFER_ALIGNMENT
  102 |                         )
  103 |                         .into(),
  104 |                     ));
  105 |                 }
  106 |                 Ok((*offset, *size))
  107 |             })
  108 |             .collect::<Result<Vec<_>>>()?,
  109 |     );
  110 |     Ok(PageInfo {
  111 |         buffer_offsets_and_sizes,
  112 |         encoding: PageEncoding::Structural(page_layout),
  113 |         num_rows: page.length,
  114 |         priority: page.priority,
  115 |     })
  116 | }
  117 | 
  118 | /// Finish normalized column metadata after all pages have been validated.
  119 | pub fn build_column_info(
  120 |     column_index: u32,
  121 |     metadata: &pbfile::ColumnMetadata,
  122 |     page_infos: Vec<PageInfo>,
  123 | ) -> Result<Arc<ColumnInfo>> {
  124 |     if metadata.buffer_offsets.len() != metadata.buffer_sizes.len() {
  125 |         return Err(Error::invalid_input_source(
  126 |             format!(
  127 |                 "Column {} has {} buffer offsets but {} buffer sizes",
  128 |                 column_index,
  129 |                 metadata.buffer_offsets.len(),
  130 |                 metadata.buffer_sizes.len()
  131 |             )
  132 |             .into(),
  133 |         ));
  134 |     }
  135 |     let buffer_offsets_and_sizes = Arc::from(
  136 |         metadata
  137 |             .buffer_offsets
  138 |             .iter()
  139 |             .zip(&metadata.buffer_sizes)
  140 |             .map(|(offset, size)| (*offset, *size))
  141 |             .collect::<Vec<_>>(),
  142 |     );
  143 |     let encoding: pb::ColumnEncoding =
  144 |         fetch_encoding(metadata.encoding.as_ref().ok_or_else(|| {
  145 |             Error::invalid_input_source(
  146 |                 format!("Column {} is missing its encoding", column_index).into(),
  147 |             )
  148 |         })?)?;
  149 |     Ok(Arc::new(ColumnInfo {
  150 |         index: column_index,
  151 |         page_infos: Arc::from(page_infos),
  152 |         buffer_offsets_and_sizes,
  153 |         encoding,
  154 |     }))
  155 | }
  156 | 
  157 | /// Validate the structural global-buffer alignment contract.
  158 | pub fn validate_global_buffers(buffers: &[BufferDescriptor]) -> Result<()> {
  159 |     for (buffer_index, buffer) in buffers.iter().enumerate() {
  160 |         if buffer.position % PAGE_BUFFER_ALIGNMENT as u64 != 0 {
  161 |             return Err(Error::invalid_input_source(
  162 |                 format!(
  163 |                     "Global buffer {} position {} is not aligned to {} bytes",
  164 |                     buffer_index, buffer.position, PAGE_BUFFER_ALIGNMENT
  165 |                 )
  166 |                 .into(),
  167 |             ));
  168 |         }
  169 |     }
  170 |     Ok(())
  171 | }
  172 | 
  173 | fn field_column_shape(field: &Field) -> (bool, bool) {
  174 |     if field.is_blob() || field.is_packed_struct() {
  175 |         return (true, false);
  176 |     }
  177 |     (field.children.is_empty(), !field.children.is_empty())
  178 | }
  179 | 
  180 | /// Count physical columns in the leaf-column layout used by v2.1+.
  181 | pub fn physical_column_count(field: &Field) -> usize {
  182 |     if field.children.is_empty() || field.is_blob() || field.is_packed_struct() {
  183 |         1
  184 |     } else {
  185 |         field.children.iter().map(physical_column_count).sum()
  186 |     }
  187 | }
  188 | 
  189 | fn append_physical_fields(
  190 |     fields: &[Field],
  191 |     field_ids: &mut Vec<i32>,
  192 |     column_indices: &mut Vec<i32>,
  193 |     next_column: &mut i32,
  194 | ) {
  195 |     for field in fields {
  196 |         if field.children.is_empty() || field.is_blob() || field.is_packed_struct() {
  197 |             field_ids.push(field.id);
  198 |             column_indices.push(*next_column);
  199 |             *next_column += 1;
  200 |         } else {
  201 |             append_physical_fields(&field.children, field_ids, column_indices, next_column);
  202 |         }
  203 |     }
  204 | }
  205 | 
  206 | /// Build persisted field-to-column entries for the v2.1+ leaf layout.
  207 | pub fn data_file_columns(schema: &Schema) -> (Vec<i32>, Vec<i32>) {
  208 |     let mut field_ids = Vec::new();
  209 |     let mut column_indices = Vec::new();
  210 |     append_physical_fields(&schema.fields, &mut field_ids, &mut column_indices, &mut 0);
  211 |     (field_ids, column_indices)
  212 | }
  213 | 
  214 | /// Build the field-id lookup for the v2.1+ leaf layout.
  215 | pub fn field_id_to_column_index(schema: &Schema) -> BTreeMap<u32, u32> {
  216 |     let (field_ids, column_indices) = data_file_columns(schema);
  217 |     field_ids
  218 |         .into_iter()
  219 |         .zip(column_indices)
  220 |         .filter_map(|(field_id, column_index)| {
  221 |             (column_index >= 0).then_some((field_id as u32, column_index as u32))
  222 |         })
  223 |         .collect()
  224 | }
  225 | 
  226 | fn append_field_ids(
  227 |     fields: &[Field],
  228 |     field_id_to_column_index: &BTreeMap<u32, u32>,
  229 |     column_indices: &mut Vec<u32>,
  230 | ) {
  231 |     for field in fields {
  232 |         let (contributes, recurse) = field_column_shape(field);
  233 |         if contributes
  234 |             && let Some(column_index) = field_id_to_column_index.get(&(field.id as u32)).copied()
  235 |         {
  236 |             column_indices.push(column_index);
  237 |         }
  238 |         if recurse {
  239 |             append_field_ids(&field.children, field_id_to_column_index, column_indices);
  240 |         }
  241 |     }
  242 | }
  243 | 
  244 | /// Build the leaf-column projection selected by a v2.1+ exact reader.
  245 | pub fn projection_from_field_ids(
  246 |     schema: &Schema,
  247 |     field_id_to_column_index: &BTreeMap<u32, u32>,
  248 | ) -> ReaderProjection {
  249 |     let mut column_indices = Vec::new();
  250 |     append_field_ids(
  251 |         &schema.fields,
  252 |         field_id_to_column_index,
  253 |         &mut column_indices,
  254 |     );
  255 |     ReaderProjection {
  256 |         schema: Arc::new(schema.clone()),
  257 |         column_indices,
  258 |     }
  259 | }
  260 | 
  261 | /// Project names using a caller-selected leaf-column mapping.
  262 | pub fn projection_from_column_names(
  263 |     schema: &Schema,
  264 |     column_names: &[&str],
  265 |     field_id_to_column_index: &BTreeMap<u32, u32>,
  266 | ) -> Result<ReaderProjection> {
  267 |     let projected = schema.project(column_names)?;
  268 |     Ok(projection_from_field_ids(
  269 |         &projected,
  270 |         field_id_to_column_index,
  271 |     ))
  272 | }
  273 | 
  274 | fn children_share_parent_length(field: &Field) -> bool {
  275 |     field.logical_type.is_struct()
  276 | }
  277 | 
  278 | fn validate_field_length<F: Fn(usize) -> Result<u64>>(
  279 |     field: &Field,
  280 |     comparable: bool,
  281 |     column_indices: &[u32],
  282 |     cursor: &mut usize,
  283 |     column_len: &F,
  284 | ) -> Result<u64> {
  285 |     let (contributes, recurse) = field_column_shape(field);
  286 |     let mut field_rows = None;
  287 |     if contributes {
  288 |         let column = *column_indices.get(*cursor).ok_or_else(|| {
  289 |             Error::invalid_input(format!(
  290 |                 "projection supplied fewer column indices than its fields require (ran out at field '{}')",
  291 |                 field.name
  292 |             ))
  293 |         })?;
  294 |         *cursor += 1;
  295 |         field_rows = Some(column_len(column as usize)?);
  296 |     }
  297 |     if recurse {
  298 |         let enforce_children = comparable && children_share_parent_length(field);
  299 |         for child in &field.children {
  300 |             let child_rows =
  301 |                 validate_field_length(child, enforce_children, column_indices, cursor, column_len)?;
  302 |             let expected = *field_rows.get_or_insert(child_rows);
  303 |             if enforce_children && child_rows != expected {
  304 |                 return Err(Error::invalid_input(format!(
  305 |                     "cannot read field '{}': its children have differing lengths (child '{}' has {} rows, but the field has {}); a struct's children must all have the same length",
  306 |                     field.name, child.name, child_rows, expected
  307 |                 )));
  308 |             }
  309 |         }
  310 |     }
  311 |     field_rows.ok_or_else(|| {
  312 |         Error::invalid_input(format!(
  313 |             "projected field '{}' maps to no columns",
  314 |             field.name
  315 |         ))
  316 |     })
  317 | }
  318 | 
  319 | /// Determine the normalized logical read length for a structural projection.
  320 | pub fn prepared_read_length(prepared: &PreparedProjection) -> Result<u64> {
  321 |     let column_len = |column: usize| {
  322 |         let info = prepared.column_infos.get(column).ok_or_else(|| {
  323 |             Error::invalid_input(format!(
  324 |                 "projection references column index {} but only {} columns are available",
  325 |                 column,
  326 |                 prepared.column_infos.len()
  327 |             ))
  328 |         })?;
  329 |         normalized_column_num_rows(info)
  330 |     };
  331 |     projection_length(
  332 |         &prepared.decoder_projection.schema,
  333 |         &prepared.decoder_projection.column_indices,
  334 |         &column_len,
  335 |     )
  336 | }
  337 | 
  338 | fn projection_length<F: Fn(usize) -> Result<u64>>(
  339 |     schema: &Schema,
  340 |     column_indices: &[u32],
  341 |     column_len: &F,
  342 | ) -> Result<u64> {
  343 |     let mut cursor = 0;
  344 |     let mut field_lengths = Vec::with_capacity(schema.fields.len());
  345 |     for field in &schema.fields {
  346 |         let rows = validate_field_length(field, true, column_indices, &mut cursor, column_len)?;
  347 |         field_lengths.push((field.name.as_str(), rows));
  348 |     }
  349 |     if cursor != column_indices.len() {
  350 |         return Err(Error::invalid_input(format!(
  351 |             "projection supplied {} column indices but its fields require {}",
  352 |             column_indices.len(),
  353 |             cursor
  354 |         )));
  355 |     }
  356 |     verify_uniform_lengths(&field_lengths)
  357 | }
  358 | 
  359 | pub type DecodeColumn = fn(u32, &pbfile::ColumnMetadata) -> Result<Arc<ColumnInfo>>;
  360 | 
  361 | #[derive(Debug)]
  362 | struct StructuralReadProjection {
  363 |     decode_column: DecodeColumn,
  364 | }
  365 | 
  366 | /// Compose structural projection execution with an exact column grammar.
  367 | pub fn read_projection(decode_column: DecodeColumn) -> Arc<dyn ReadProjection> {
  368 |     Arc::new(StructuralReadProjection { decode_column })
  369 | }
  370 | 
  371 | #[async_trait]
  372 | impl ReadProjection for StructuralReadProjection {
  373 |     fn validate_indexed(
  374 |         &self,
  375 |         projection: &ReaderProjection,
  376 |         metadata_index: &FileMetadataIndex,
  377 |     ) -> Result<()> {
  378 |         FileMetadataProvider::validate_indexed_projection_structure(projection, metadata_index)?;
  379 |         if FileMetadataProvider::projection_matches_indexed_metadata(projection) {
  380 |             Ok(())
  381 |         } else {
  382 |             Err(FileMetadataProvider::indexed_projection_error(
  383 |                 projection,
  384 |                 metadata_index,
  385 |             ))
  386 |         }
  387 |     }
  388 | 
  389 |     fn read_length(&self, prepared: &PreparedProjection) -> Result<u64> {
  390 |         prepared_read_length(prepared)
  391 |     }
  392 | 
  393 |     async fn prepare(
  394 |         &self,
  395 |         metadata_provider: &FileMetadataProvider,
  396 |         projection: &ReaderProjection,
  397 |         io: &Arc<dyn EncodingsIo>,
  398 |         cache: &Arc<LanceCache>,
  399 |     ) -> Result<(PreparedProjection, u64)> {
  400 |         let prepared = match metadata_provider {
  401 |             FileMetadataProvider::Full(metadata) => {
  402 |                 FileReader::validate_projection(projection, metadata)?;
  403 |                 PreparedProjection {
  404 |                     column_infos: metadata.column_infos.clone(),
  405 |                     decoder_projection: projection.clone(),
  406 |                 }
  407 |             }
  408 |             FileMetadataProvider::Indexed(metadata_index) => {
  409 |                 self.validate_indexed(projection, metadata_index)?;
  410 |                 let column_infos = FileMetadataProvider::load_indexed_column_infos(
  411 |                     metadata_index,
  412 |                     io,
  413 |                     cache,
  414 |                     &projection.column_indices,
  415 |                     self.decode_column,
  416 |                 )
  417 |                 .await?;
  418 |                 PreparedProjection {
  419 |                     column_infos,
  420 |                     decoder_projection: ReaderProjection {
  421 |                         schema: projection.schema.clone(),
  422 |                         column_indices: (0..projection.column_indices.len())
  423 |                             .map(|index| index as u32)
  424 |                             .collect(),
  425 |                     },
  426 |                 }
  427 |             }
  428 |         };
  429 |         let read_len = self.read_length(&prepared)?;
  430 |         Ok((prepared, read_len))
  431 |     }
  432 | }
  433 | 
  434 | #[cfg(test)]
  435 | pub fn test_projection_length(
  436 |     schema: &Schema,
  437 |     column_indices: &[u32],
  438 |     column_lengths: &[u64],
  439 | ) -> Result<u64> {
  440 |     projection_length(schema, column_indices, &|column| {
  441 |         column_lengths.get(column).copied().ok_or_else(|| {
  442 |             Error::invalid_input(format!("missing synthetic length for column {column}"))
  443 |         })
  444 |     })
  445 | }
``````
