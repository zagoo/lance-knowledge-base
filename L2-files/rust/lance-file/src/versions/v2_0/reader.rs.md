> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-file/src/versions/v2_0/reader.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `c4aed54b0a95be680a2921bea09ae562cc67394914ed03c05a1645e392ce0337`. Reviewed physical lines: 1-415.

[Module](../../../../../../L1-modules/rust-lance-file-readers.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Exact V2_0 reader metadata/projection implementation inside a private reader child module. The parent publicly reexports three projection constructors and reexports metadata functions pub(crate); other pub declarations are implementation interfaces, not independently external API. (rust/lance-file/src/versions/v2_0/reader.rs:1-415)

## Complete range analysis

### Lines 1-29

SPDX/imports connect Arc/BTreeMap, async_trait, Bytes, core cache/errors/schema/fields, EncodingsIo and normalized metadata, pb Array/Column encodings, prost Name/Message, file protobuf/provider/read-projection types and exact version. Unlike newer readers this file owns syntax decoding and header-inclusive traversal. (rust/lance-file/src/versions/v2_0/reader.rs:1-29)

### Lines 30-56

Private generic fetch_encoding accepts only Direct location, clones encoding bytes into Bytes, decodes prost Any envelope then to_msg<M>, wrapping failures as InvalidInput with message type and error display. Indirect unsupported, explicit None description and absent location each return contextual InvalidInput. No recursive ArrayEncoding grammar validation, IO or deferred-buffer lookup here. (rust/lance-file/src/versions/v2_0/reader.rs:30-56)

### Lines 57-76

decode_column enumerates pages in input order. Each requires encoding (InvalidInput names column/page), then decodes pb::ArrayEncoding through Any before checking buffer counts. This reader uses legacy array grammar namespace, not pb21 structural PageLayout. A syntactically valid ArrayEncoding with absent or otherwise invalid nested variant is not inspected at this stage. (rust/lance-file/src/versions/v2_0/reader.rs:57-76)

### Lines 77-103

Unequal page buffer offset/size counts return InvalidInput with column/page/counts. Equal pairs are copied into Arc slice; no alignment, bounds, overlap, size or checked end-position validation. Construct PageInfo with PageEncoding::Legacy(array_encoding), length as num_rows and priority unchanged; fallible Vec collection aborts on first bad page. Empty pages accepted. (rust/lance-file/src/versions/v2_0/reader.rs:77-103)

### Lines 104-134

After all pages decode, reject unequal column buffer counts, copy pairs to Arc, require column encoding and decode its Any to ColumnEncoding inferred by the target field type. Return Arc<ColumnInfo> with supplied index, Arc pages, descriptors and encoding. No column index validation, ColumnEncoding arm traversal or consistency between declared rows/schema/pages is added. Allocation before a later failure is dropped. (rust/lance-file/src/versions/v2_0/reader.rs:104-134)

### Lines 135-149

decode_column_metadata enumerates columns, checked-converts each zero-based index to u32 then calls decode_column and fallibly collects Vec<Arc<ColumnInfo>> in order. Error text says more than u32::MAX columns, but the actual check is on index: index u32::MAX itself is accepted. Empty input yields empty Vec. No decoded-column concurrency. (rust/lance-file/src/versions/v2_0/reader.rs:135-149)

### Lines 150-176

Async prepare_projection ignores supplied IO/cache. Full provider runs FileReader::validate_projection, clones column infos and projection, then succeeds. Indexed provider first runs structural validity checks (so malformed input error precedes unsupported), then always returns indexed_projection_error. No await/IO within this body despite async signature; no metadata decode or row-length check until caller. Contextual validators reject empty schema/duplicate/out-of-bounds indices (rust/lance-file/src/reader.rs:1117-1144; rust/lance-file/src/reader.rs:1557-1595). (rust/lance-file/src/versions/v2_0/reader.rs:150-176)

### Lines 177-201

field_column_shape always contributes one column; Blob/packed stop recursion, other fields recurse only when children exist. append_field_ids traverses parent before descendants, looks up field.id as u32, silently omits missing mappings and never prunes schema. Preserve source order, no dedup/sort/checked ID conversion; recursion has no local depth bound. (rust/lance-file/src/versions/v2_0/reader.rs:177-201)

### Lines 202-221

projection_from_field_ids is infallible, builds traversal indices then Arc-wraps a complete Schema clone. projection_from_whole_schema constructs parent module physical ID map and invokes it. Duplicate/negative IDs inherit map collapse/cast semantics; this layer adds no schema or index validation. (rust/lance-file/src/versions/v2_0/reader.rs:202-221)

### Lines 222-237

projection_from_column_names builds the mapping from the full original schema before schema.project(names)?, then maps projected fields through it. Thus selected physical indices retain original file numbering rather than renumbering from selected schema. Name projection errors propagate. children_share_parent_length recognizes only logical structs. (rust/lance-file/src/versions/v2_0/reader.rs:222-237)

### Lines 238-257

validate_field_length consumes one supplied index per contributing field, errors with field name if exhausted, advances cursor then calls fallible column_len. Unlike leaf layout, ordinary container field_rows is initialized from its own header column. Missing column infos later produce their own bounds error. (rust/lance-file/src/versions/v2_0/reader.rs:238-257)

### Lines 258-278

When recursing, comparable && logical struct controls equality and is passed to descendants. Each child must equal the parent header length when enabled; error wording says children differ but expected is already the parent column count. A nonstruct ancestor disables comparisons for all deeper descendants. Parent returns its own header count (not first child) regardless of child counts when disabled. maps-to-no-columns guard is defensive because this shape always contributes. No list-size/offset arithmetic or local recursion bound. (rust/lance-file/src/versions/v2_0/reader.rs:258-278)

### Lines 279-301

prepared_read_length indexes column_infos using decoder indices and errors with index/available count when absent. normalized_column_num_rows computes each length. Walk all top-level fields with comparable=true, reserve name/length pairs. For columns decoded by this file PageEncoding is Legacy so helper sums page.num_rows with checked u64 addition; manually supplied PreparedProjection may contain other encodings (rust/lance-file/src/reader.rs:539-561). (rust/lance-file/src/versions/v2_0/reader.rs:279-301)

### Lines 302-318

Reject surplus supplied indices after full traversal, then verify_uniform_lengths returns common top-level length or contextual mismatch; empty schema+empty indices yields0 at this helper layer (caller full-projection validation rejects zero fields). Private Debug unit V20ReadProjection stores no state; parent-visible read_projection allocates it in Arc<dyn ReadProjection>. (rust/lance-file/src/versions/v2_0/reader.rs:302-318)

### Lines 319-336

async_trait ReadProjection implementation validate_indexed first performs provider structural validation then always returns provider NotSupported diagnostic. read_length forwards prepared_read_length. Matching V2_0 FileMetadataIndex does not imply indexed projection support. (rust/lance-file/src/versions/v2_0/reader.rs:319-336)

### Lines 337-349

Trait async prepare awaits prepare_projection, then checks read_length and returns (PreparedProjection,u64). The inner V2_0 preparation performs no IO and ignores IO/cache; errors short-circuit in validation then length order. No task spawn, cancellation guard or rollback. (rust/lance-file/src/versions/v2_0/reader.rs:337-349)

### Lines 350-361

finish_metadata accepts raw footer pair exactly(0,3) or(2,0). Every other pair returns VersionConflict with actual major/minor and V2_0 reader message before column decoding. Then decode all raw column metadata. It does not call validate_global_buffers here (that function is a no-op below). (rust/lance-file/src/versions/v2_0/reader.rs:350-361)

### Lines 362-379

Build CachedFileMetadata by moving raw schema, original protobuf column metadata, decoded infos, declared num_rows, file buffers, data/column-metadata/global/footer byte counts, raw footer major/minor, file size and retained global buffers; set exact version V2_0. Literal accepted alias is preserved in major/minor while concrete identity canonicalizes. No row/count/size reconciliation or metadata IO in finalization. Both protobuf and normalized metadata remain owned in the cache object. (rust/lance-file/src/versions/v2_0/reader.rs:362-379)

### Lines 380-396

validate_global_buffers unconditionally Ok without examining descriptors. finish_metadata_index accepts only exact enum V2_0 and returns index unchanged; mismatch converts actual enum to standard footer numbers and returns VersionConflict. It does not decode columns or validate global alignment/projection eligibility. (rust/lance-file/src/versions/v2_0/reader.rs:380-396)

### Lines 397-415

cfg(test) test_projection_length creates synthetic indexed length closure, uses the same header-inclusive field walker and uniform top-level check, errors for missing synthetic length. Unlike production prepared_read_length it does not reject leftover column_indices after traversal. Thus synthetic helper success alone does not test surplus-index validation. No executing test functions or fixtures are defined in this file; no unsafe blocks. (rust/lance-file/src/versions/v2_0/reader.rs:397-415)

## Interaction and interpretation limits

All physical lines read in ANALYZE54. No source builds/tests/benchmarks run. Local metadata grammar, dispatch and projection behavior are covered; shared reader IO/cache orchestration and exact current writer pipelines are analyzed; delegated encoding byte decompression and backend lifecycle remains pending. Exact declarations/source appendix preserve every signature. No source modification.

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
   16 |     format::pb,
   17 | };
   18 | use prost::{Message, Name};
   19 | 
   20 | use crate::{
   21 |     format::pbfile,
   22 |     reader::{
   23 |         BufferDescriptor, CachedFileMetadata, FileMetadataIndex, FileMetadataProvider, FileReader,
   24 |         PreparedProjection, RawFileMetadata, ReadProjection, ReaderProjection,
   25 |         normalized_column_num_rows, verify_uniform_lengths,
   26 |     },
   27 |     version::ConcreteFileVersion,
   28 | };
   29 | 
   30 | fn fetch_encoding<M: Default + Name + Sized>(encoding: &pbfile::Encoding) -> Result<M> {
   31 |     match &encoding.location {
   32 |         Some(pbfile::encoding::Location::Indirect(_)) => Err(Error::invalid_input_source(
   33 |             "Indirect file encodings are not supported".into(),
   34 |         )),
   35 |         Some(pbfile::encoding::Location::Direct(encoding)) => {
   36 |             let envelope = prost_types::Any::decode(Bytes::from(encoding.encoding.clone()))
   37 |                 .map_err(|error| {
   38 |                     Error::invalid_input_source(
   39 |                         format!("Invalid direct {} encoding envelope: {error}", M::NAME).into(),
   40 |                     )
   41 |                 })?;
   42 |             envelope.to_msg::<M>().map_err(|error| {
   43 |                 Error::invalid_input_source(
   44 |                     format!("Invalid direct {} encoding: {error}", M::NAME).into(),
   45 |                 )
   46 |             })
   47 |         }
   48 |         Some(pbfile::encoding::Location::None(_)) => Err(Error::invalid_input_source(
   49 |             format!("Missing {} encoding description", M::NAME).into(),
   50 |         )),
   51 |         None => Err(Error::invalid_input_source(
   52 |             format!("Missing {} encoding location", M::NAME).into(),
   53 |         )),
   54 |     }
   55 | }
   56 | 
   57 | pub fn decode_column(
   58 |     column_index: u32,
   59 |     metadata: &pbfile::ColumnMetadata,
   60 | ) -> Result<Arc<ColumnInfo>> {
   61 |     let page_infos = metadata
   62 |         .pages
   63 |         .iter()
   64 |         .enumerate()
   65 |         .map(|(page_index, page)| {
   66 |             let array_encoding =
   67 |                 fetch_encoding::<pb::ArrayEncoding>(page.encoding.as_ref().ok_or_else(|| {
   68 |                     Error::invalid_input_source(
   69 |                         format!(
   70 |                             "Column {} page {} is missing its encoding",
   71 |                             column_index, page_index
   72 |                         )
   73 |                         .into(),
   74 |                     )
   75 |                 })?)?;
   76 |             if page.buffer_offsets.len() != page.buffer_sizes.len() {
   77 |                 return Err(Error::invalid_input_source(
   78 |                     format!(
   79 |                         "Column {} page {} has {} buffer offsets but {} buffer sizes",
   80 |                         column_index,
   81 |                         page_index,
   82 |                         page.buffer_offsets.len(),
   83 |                         page.buffer_sizes.len()
   84 |                     )
   85 |                     .into(),
   86 |                 ));
   87 |             }
   88 |             let buffer_offsets_and_sizes = Arc::from(
   89 |                 page.buffer_offsets
   90 |                     .iter()
   91 |                     .zip(&page.buffer_sizes)
   92 |                     .map(|(offset, size)| (*offset, *size))
   93 |                     .collect::<Vec<_>>(),
   94 |             );
   95 |             Ok(PageInfo {
   96 |                 buffer_offsets_and_sizes,
   97 |                 encoding: PageEncoding::Legacy(array_encoding),
   98 |                 num_rows: page.length,
   99 |                 priority: page.priority,
  100 |             })
  101 |         })
  102 |         .collect::<Result<Vec<_>>>()?;
  103 | 
  104 |     if metadata.buffer_offsets.len() != metadata.buffer_sizes.len() {
  105 |         return Err(Error::invalid_input_source(
  106 |             format!(
  107 |                 "Column {} has {} buffer offsets but {} buffer sizes",
  108 |                 column_index,
  109 |                 metadata.buffer_offsets.len(),
  110 |                 metadata.buffer_sizes.len()
  111 |             )
  112 |             .into(),
  113 |         ));
  114 |     }
  115 |     let buffer_offsets_and_sizes = Arc::from(
  116 |         metadata
  117 |             .buffer_offsets
  118 |             .iter()
  119 |             .zip(&metadata.buffer_sizes)
  120 |             .map(|(offset, size)| (*offset, *size))
  121 |             .collect::<Vec<_>>(),
  122 |     );
  123 |     Ok(Arc::new(ColumnInfo {
  124 |         index: column_index,
  125 |         page_infos: Arc::from(page_infos),
  126 |         buffer_offsets_and_sizes,
  127 |         encoding: fetch_encoding(metadata.encoding.as_ref().ok_or_else(|| {
  128 |             Error::invalid_input_source(
  129 |                 format!("Column {} is missing its encoding", column_index).into(),
  130 |             )
  131 |         })?)?,
  132 |     }))
  133 | }
  134 | 
  135 | pub fn decode_column_metadata(
  136 |     column_metadatas: &[pbfile::ColumnMetadata],
  137 | ) -> Result<Vec<Arc<ColumnInfo>>> {
  138 |     column_metadatas
  139 |         .iter()
  140 |         .enumerate()
  141 |         .map(|(column_index, metadata)| {
  142 |             let column_index = u32::try_from(column_index).map_err(|_| {
  143 |                 Error::invalid_input_source("File has more than u32::MAX columns".into())
  144 |             })?;
  145 |             decode_column(column_index, metadata)
  146 |         })
  147 |         .collect()
  148 | }
  149 | 
  150 | pub async fn prepare_projection(
  151 |     metadata_provider: &FileMetadataProvider,
  152 |     projection: &ReaderProjection,
  153 |     _io: &Arc<dyn EncodingsIo>,
  154 |     _cache: &Arc<LanceCache>,
  155 | ) -> Result<PreparedProjection> {
  156 |     match metadata_provider {
  157 |         FileMetadataProvider::Full(metadata) => {
  158 |             FileReader::validate_projection(projection, metadata)?;
  159 |             Ok(PreparedProjection {
  160 |                 column_infos: metadata.column_infos.clone(),
  161 |                 decoder_projection: projection.clone(),
  162 |             })
  163 |         }
  164 |         FileMetadataProvider::Indexed(metadata_index) => {
  165 |             FileMetadataProvider::validate_indexed_projection_structure(
  166 |                 projection,
  167 |                 metadata_index,
  168 |             )?;
  169 |             Err(FileMetadataProvider::indexed_projection_error(
  170 |                 projection,
  171 |                 metadata_index,
  172 |             ))
  173 |         }
  174 |     }
  175 | }
  176 | 
  177 | fn field_column_shape(field: &Field) -> (bool, bool) {
  178 |     if field.is_blob() || field.is_packed_struct() {
  179 |         return (true, false);
  180 |     }
  181 |     (true, !field.children.is_empty())
  182 | }
  183 | 
  184 | fn append_field_ids(
  185 |     fields: &[Field],
  186 |     field_id_to_column_index: &BTreeMap<u32, u32>,
  187 |     column_indices: &mut Vec<u32>,
  188 | ) {
  189 |     for field in fields {
  190 |         let (contributes, recurse) = field_column_shape(field);
  191 |         if contributes
  192 |             && let Some(column_index) = field_id_to_column_index.get(&(field.id as u32)).copied()
  193 |         {
  194 |             column_indices.push(column_index);
  195 |         }
  196 |         if recurse {
  197 |             append_field_ids(&field.children, field_id_to_column_index, column_indices);
  198 |         }
  199 |     }
  200 | }
  201 | 
  202 | pub fn projection_from_field_ids(
  203 |     schema: &Schema,
  204 |     field_id_to_column_index: &BTreeMap<u32, u32>,
  205 | ) -> ReaderProjection {
  206 |     let mut column_indices = Vec::new();
  207 |     append_field_ids(
  208 |         &schema.fields,
  209 |         field_id_to_column_index,
  210 |         &mut column_indices,
  211 |     );
  212 |     ReaderProjection {
  213 |         schema: Arc::new(schema.clone()),
  214 |         column_indices,
  215 |     }
  216 | }
  217 | 
  218 | pub fn projection_from_whole_schema(schema: &Schema) -> ReaderProjection {
  219 |     projection_from_field_ids(schema, &super::field_id_to_column_index(schema))
  220 | }
  221 | 
  222 | pub fn projection_from_column_names(
  223 |     schema: &Schema,
  224 |     column_names: &[&str],
  225 | ) -> Result<ReaderProjection> {
  226 |     let field_id_to_column_index = super::field_id_to_column_index(schema);
  227 |     let projected = schema.project(column_names)?;
  228 |     Ok(projection_from_field_ids(
  229 |         &projected,
  230 |         &field_id_to_column_index,
  231 |     ))
  232 | }
  233 | 
  234 | fn children_share_parent_length(field: &Field) -> bool {
  235 |     field.logical_type.is_struct()
  236 | }
  237 | 
  238 | fn validate_field_length<F: Fn(usize) -> Result<u64>>(
  239 |     field: &Field,
  240 |     comparable: bool,
  241 |     column_indices: &[u32],
  242 |     cursor: &mut usize,
  243 |     column_len: &F,
  244 | ) -> Result<u64> {
  245 |     let (contributes, recurse) = field_column_shape(field);
  246 |     let mut field_rows = None;
  247 |     if contributes {
  248 |         let column = *column_indices.get(*cursor).ok_or_else(|| {
  249 |             Error::invalid_input(format!(
  250 |                 "projection supplied fewer column indices than its fields require (ran out at field '{}')",
  251 |                 field.name
  252 |             ))
  253 |         })?;
  254 |         *cursor += 1;
  255 |         field_rows = Some(column_len(column as usize)?);
  256 |     }
  257 |     if recurse {
  258 |         let enforce_children = comparable && children_share_parent_length(field);
  259 |         for child in &field.children {
  260 |             let child_rows =
  261 |                 validate_field_length(child, enforce_children, column_indices, cursor, column_len)?;
  262 |             let expected = *field_rows.get_or_insert(child_rows);
  263 |             if enforce_children && child_rows != expected {
  264 |                 return Err(Error::invalid_input(format!(
  265 |                     "cannot read field '{}': its children have differing lengths (child '{}' has {} rows, but the field has {}); a struct's children must all have the same length",
  266 |                     field.name, child.name, child_rows, expected
  267 |                 )));
  268 |             }
  269 |         }
  270 |     }
  271 |     field_rows.ok_or_else(|| {
  272 |         Error::invalid_input(format!(
  273 |             "projected field '{}' maps to no columns",
  274 |             field.name
  275 |         ))
  276 |     })
  277 | }
  278 | 
  279 | pub fn prepared_read_length(prepared: &PreparedProjection) -> Result<u64> {
  280 |     let column_len = |column: usize| {
  281 |         let info = prepared.column_infos.get(column).ok_or_else(|| {
  282 |             Error::invalid_input(format!(
  283 |                 "projection references column index {} but only {} columns are available",
  284 |                 column,
  285 |                 prepared.column_infos.len()
  286 |             ))
  287 |         })?;
  288 |         normalized_column_num_rows(info)
  289 |     };
  290 |     let mut cursor = 0;
  291 |     let mut field_lengths = Vec::with_capacity(prepared.decoder_projection.schema.fields.len());
  292 |     for field in &prepared.decoder_projection.schema.fields {
  293 |         let rows = validate_field_length(
  294 |             field,
  295 |             true,
  296 |             &prepared.decoder_projection.column_indices,
  297 |             &mut cursor,
  298 |             &column_len,
  299 |         )?;
  300 |         field_lengths.push((field.name.as_str(), rows));
  301 |     }
  302 |     if cursor != prepared.decoder_projection.column_indices.len() {
  303 |         return Err(Error::invalid_input(format!(
  304 |             "projection supplied {} column indices but its fields require {}",
  305 |             prepared.decoder_projection.column_indices.len(),
  306 |             cursor
  307 |         )));
  308 |     }
  309 |     verify_uniform_lengths(&field_lengths)
  310 | }
  311 | 
  312 | #[derive(Debug)]
  313 | struct V20ReadProjection;
  314 | 
  315 | pub(super) fn read_projection() -> Arc<dyn ReadProjection> {
  316 |     Arc::new(V20ReadProjection)
  317 | }
  318 | 
  319 | #[async_trait]
  320 | impl ReadProjection for V20ReadProjection {
  321 |     fn validate_indexed(
  322 |         &self,
  323 |         projection: &ReaderProjection,
  324 |         metadata_index: &FileMetadataIndex,
  325 |     ) -> Result<()> {
  326 |         FileMetadataProvider::validate_indexed_projection_structure(projection, metadata_index)?;
  327 |         Err(FileMetadataProvider::indexed_projection_error(
  328 |             projection,
  329 |             metadata_index,
  330 |         ))
  331 |     }
  332 | 
  333 |     fn read_length(&self, prepared: &PreparedProjection) -> Result<u64> {
  334 |         prepared_read_length(prepared)
  335 |     }
  336 | 
  337 |     async fn prepare(
  338 |         &self,
  339 |         metadata_provider: &FileMetadataProvider,
  340 |         projection: &ReaderProjection,
  341 |         io: &Arc<dyn EncodingsIo>,
  342 |         cache: &Arc<LanceCache>,
  343 |     ) -> Result<(PreparedProjection, u64)> {
  344 |         let prepared = prepare_projection(metadata_provider, projection, io, cache).await?;
  345 |         let read_len = self.read_length(&prepared)?;
  346 |         Ok((prepared, read_len))
  347 |     }
  348 | }
  349 | 
  350 | pub fn finish_metadata(raw: RawFileMetadata) -> Result<CachedFileMetadata> {
  351 |     if !matches!(
  352 |         (raw.footer.major_version, raw.footer.minor_version),
  353 |         (0, 3) | (2, 0)
  354 |     ) {
  355 |         return Err(Error::version_conflict(
  356 |             "Attempt to use the Lance v2.0 reader for a different file version".to_string(),
  357 |             raw.footer.major_version,
  358 |             raw.footer.minor_version,
  359 |         ));
  360 |     }
  361 |     let column_infos = decode_column_metadata(&raw.column_metadatas)?;
  362 |     Ok(CachedFileMetadata {
  363 |         file_schema: raw.file_schema,
  364 |         column_metadatas: raw.column_metadatas,
  365 |         column_infos,
  366 |         num_rows: raw.num_rows,
  367 |         file_buffers: raw.file_buffers,
  368 |         num_data_bytes: raw.num_data_bytes,
  369 |         num_column_metadata_bytes: raw.num_column_metadata_bytes,
  370 |         num_global_buffer_bytes: raw.num_global_buffer_bytes,
  371 |         num_footer_bytes: raw.num_footer_bytes,
  372 |         major_version: raw.footer.major_version,
  373 |         minor_version: raw.footer.minor_version,
  374 |         version: ConcreteFileVersion::V2_0,
  375 |         file_size_bytes: raw.file_size_bytes,
  376 |         retained_global_buffers: raw.retained_global_buffers,
  377 |     })
  378 | }
  379 | 
  380 | pub fn validate_global_buffers(_buffers: &[BufferDescriptor]) -> Result<()> {
  381 |     Ok(())
  382 | }
  383 | 
  384 | pub fn finish_metadata_index(index: FileMetadataIndex) -> Result<FileMetadataIndex> {
  385 |     if index.version == ConcreteFileVersion::V2_0 {
  386 |         Ok(index)
  387 |     } else {
  388 |         let (major, minor) = index.version.to_standard_footer_numbers();
  389 |         Err(Error::version_conflict(
  390 |             "Attempt to use the Lance v2.0 reader for a different metadata index".to_string(),
  391 |             major,
  392 |             minor,
  393 |         ))
  394 |     }
  395 | }
  396 | 
  397 | #[cfg(test)]
  398 | pub fn test_projection_length(
  399 |     schema: &Schema,
  400 |     column_indices: &[u32],
  401 |     column_lengths: &[u64],
  402 | ) -> Result<u64> {
  403 |     let column_len = |column: usize| {
  404 |         column_lengths.get(column).copied().ok_or_else(|| {
  405 |             Error::invalid_input(format!("missing synthetic length for column {column}"))
  406 |         })
  407 |     };
  408 |     let mut cursor = 0;
  409 |     let mut field_lengths = Vec::with_capacity(schema.fields.len());
  410 |     for field in &schema.fields {
  411 |         let rows = validate_field_length(field, true, column_indices, &mut cursor, &column_len)?;
  412 |         field_lengths.push((field.name.as_str(), rows));
  413 |     }
  414 |     verify_uniform_lengths(&field_lengths)
  415 | }
``````
