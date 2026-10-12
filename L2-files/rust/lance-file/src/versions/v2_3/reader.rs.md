> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-file/src/versions/v2_3/reader.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `d5172a94b42ae743b8ce8538e941759510ecef03ff1f4bcecb9f412fa607f010`. Reviewed physical lines: 1-341.

[Module](../../../../../../L1-modules/rust-lance-file-readers.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Exact V2_3 reader metadata/projection implementation inside a private reader child module. The parent publicly reexports three projection constructors and reexports metadata functions pub(crate); other pub declarations are implementation interfaces, not independently external API. (rust/lance-file/src/versions/v2_3/reader.rs:1-341)

## Complete range analysis

### Lines 1-17

SPDX/imports connect BTreeMap/Arc, core Schema/errors, ColumnInfo and pb21 grammar, file protobuf, shared structural normalization/projection, raw/cached/index metadata and ConcreteFileVersion. No IO scheduler, decompressor, plugin registry or environment input is used in this exact grammar validator. (rust/lance-file/src/versions/v2_3/reader.rs:1-17)

### Lines 18-25

Private required borrows Option<&T>, returns the same reference or InvalidInput source naming Lance v2.3, supplied label and missing nested encoding. It does not clone payloads or supply defaults. (rust/lance-file/src/versions/v2_3/reader.rs:18-25)

### Lines 26-45

Private validate_compressive_encoding requires compression oneof. Flat, InlineBitpacking and Constant immediately succeed without inspecting bit widths/data fields/literal size. Variable requires/revalidates offsets; OutOfLineBitpacking requires/revalidates values; Fsst likewise values. Local recursive validation has no explicit depth limit; external protobuf decode limits remain a separate concern. (rust/lance-file/src/versions/v2_3/reader.rs:26-45)

### Lines 46-55

Dictionary first requires and recursively validates indices, then items. Missing/invalid indices short-circuit before items. num_dictionary_items and index/value relationships are not checked. This is grammar validation, not decoding data bytes. (rust/lance-file/src/versions/v2_3/reader.rs:46-55)

### Lines 56-76

RLE now recursively validates required values then required run lengths using full v2.3 grammar; direct Flat8 run lengths and fixed flat values are no longer mandatory here. ByteStreamSplit/General/FixedSizeList/PackedStruct likewise require/revalidate values only. No numeric width/domain/codec fields are checked on accepted leaf nodes. (rust/lance-file/src/versions/v2_3/reader.rs:56-76)

### Lines 77-90

VariablePackedStruct requires each field.value and recursively validates, first failure stops; empty fields accepted. Missing compression oneof returns v2.3 InvalidInput. Logical schema/child count and value decoding are outside this function. (rust/lance-file/src/versions/v2_3/reader.rs:77-90)

### Lines 91-108

validate_sparse_positions inspects only a present Positions::Explicit encoding and applies compressive validation; absent SparsePositionSet, absent positions oneof and nonexplicit variants all succeed. validate_sparse_validity does nothing for absent validity, otherwise delegates its optional positions. It does not require a complete set representation or check position ordering/count/range. (rust/lance-file/src/versions/v2_3/reader.rs:91-108)

### Lines 109-126

validate_sparse_layout first requires has_large_chunk=true, then required/validated value_compression. Iterate structural layers; Validity layer checks only optional validity set via helper. No check that layers is nonempty, num_slots agrees with row count or sparse data exists. (rust/lance-file/src/versions/v2_3/reader.rs:109-126)

### Lines 127-147

List layer validates optional non_empty_positions, only explicit counts encoding, then optional validity. Absent count set/oneof and nonexplicit counts pass. FixedSizeList checks only optional validity. Missing structural layer variant returns InvalidInput; all layers otherwise complete with Ok. Fixed-size dimension/counts/slot arithmetic are not checked here. (rust/lance-file/src/versions/v2_3/reader.rs:127-147)

### Lines 148-172

validate_page_layout MiniBlock requires has_large_chunk=true then traverses optional rep, optional def, required values and optional dictionary in order. Error precedence follows this order; this dense page branch is separate from sparse layout checks. (rust/lance-file/src/versions/v2_3/reader.rs:148-172)

### Lines 173-200

FullZip validates required value only. Constant validates optional rep/def and leaves inline_value unchecked. Sparse invokes validate_sparse_layout; Blob requires inner_layout then recursive exact validation. Missing layout errors. No local recursion limit, file-bound/data-byte/codec-level validation or fallback to earlier grammar. (rust/lance-file/src/versions/v2_3/reader.rs:173-200)

### Lines 201-217

decode_column enumerates every page: shared syntax decode PageLayout, exact validate_page_layout, then shared build_page_info. First syntax/grammar failure precedes that page alignment checks. Fallibly collect pages then shared build_column_info decodes column encoding. No local ColumnEncoding variant validator, physical data read or schema comparison. Empty page list still requires a valid column-encoding envelope (rust/lance-file/src/reader/structural.rs:118-155). (rust/lance-file/src/versions/v2_3/reader.rs:201-217)

### Lines 218-232

decode_column_metadata enumerates and checked-converts zero-based indices to u32, decodes in order and collects Result<Vec<Arc<ColumnInfo>>>. Message says more than u32::MAX columns; actual guard is per-index and permits index u32::MAX. No parallelism; first error drops constructed Vec. (rust/lance-file/src/versions/v2_3/reader.rs:218-232)

### Lines 233-254

projection_from_field_ids forwards shared leaf traversal. Whole-schema projection first creates parent module mapping from entire schema. Name projection passes original full schema and its mapping to shared schema.project wrapper, so indices preserve original file numbering. Unknown mapping entries remain silently omitted until downstream checks; these functions add no new validation. (rust/lance-file/src/versions/v2_3/reader.rs:233-254)

### Lines 255-264

finish_metadata requires literal footer pair(2,3) before any alignment or grammar work; wrong pair returns VersionConflict with actual raw footer numbers and exact version message. Then validate_global_buffers and decode all column metadata in that order. (rust/lance-file/src/versions/v2_3/reader.rs:255-264)

### Lines 265-282

On success construct CachedFileMetadata moving raw schema, original protobuf columns, decoded infos, declared row count, descriptors, all four byte-accounting fields, file size and retained global bytes. Preserve literal major/minor; set exact ConcreteFileVersion::V2_3. Full metadata and normalized descriptors both remain retained. This function does not reconcile schema, total rows, counts, file bounds or byte-accounting totals and performs no IO. (rust/lance-file/src/versions/v2_3/reader.rs:265-282)

### Lines 283-286

validate_global_buffers delegates shared64-byte position-alignment check; no size/file-bound check at this boundary. (rust/lance-file/src/versions/v2_3/reader.rs:283-286)

### Lines 287-299

finish_metadata_index requires enum V2_3; mismatch uses actual enum standard footer tuple for VersionConflict. Matching identity then checks global-buffer alignment and returns index unchanged. Does not load/decode individual columns or establish projection eligibility/length. Global alignment error follows version check. (rust/lance-file/src/versions/v2_3/reader.rs:287-299)

### Lines 300-316

Private cfg(test) grammar_tests imports pb21 types and defines flat(bits) with data=None. No sparse fixture appears in this file despite v2.3 sparse validation code. (rust/lance-file/src/versions/v2_3/reader.rs:300-316)

### Lines 317-338

accepts_nested_variable_width_rle uses Flat32 RLE values with Flat16 run lengths, nested as Dictionary indices with Flat32 items/count1, then FullZip with defaults. It is structurally the v2.2 rejection fixture with opposite outcome; name variable_width describes broader grammar, not a constructed Variable encoding. (rust/lance-file/src/versions/v2_3/reader.rs:317-338)

### Lines 339-341

The sole test unwraps validate_page_layout success. It asserts local grammar acceptance only, not actual compression/decompression, offsets, data correctness or compatibility. No async/unsafe code and no source test execution. (rust/lance-file/src/versions/v2_3/reader.rs:339-341)

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
    6 | use lance_core::{Error, Result, datatypes::Schema};
    7 | use lance_encoding::{decoder::ColumnInfo, format::pb21};
    8 | 
    9 | use crate::{
   10 |     format::pbfile,
   11 |     reader::{
   12 |         BufferDescriptor, CachedFileMetadata, FileMetadataIndex, RawFileMetadata, ReaderProjection,
   13 |         structural,
   14 |     },
   15 |     version::ConcreteFileVersion,
   16 | };
   17 | 
   18 | fn required<'a, T>(value: Option<&'a T>, label: &str) -> Result<&'a T> {
   19 |     value.ok_or_else(|| {
   20 |         Error::invalid_input_source(
   21 |             format!("Lance v2.3 {label} is missing its nested encoding").into(),
   22 |         )
   23 |     })
   24 | }
   25 | 
   26 | fn validate_compressive_encoding(encoding: &pb21::CompressiveEncoding) -> Result<()> {
   27 |     use pb21::compressive_encoding::Compression;
   28 | 
   29 |     match encoding.compression.as_ref() {
   30 |         Some(Compression::Flat(_))
   31 |         | Some(Compression::InlineBitpacking(_))
   32 |         | Some(Compression::Constant(_)) => Ok(()),
   33 |         Some(Compression::Variable(variable)) => validate_compressive_encoding(required(
   34 |             variable.offsets.as_deref(),
   35 |             "variable offsets",
   36 |         )?),
   37 |         Some(Compression::OutOfLineBitpacking(bitpacking)) => {
   38 |             validate_compressive_encoding(required(
   39 |                 bitpacking.values.as_deref(),
   40 |                 "out-of-line bitpacking values",
   41 |             )?)
   42 |         }
   43 |         Some(Compression::Fsst(fsst)) => {
   44 |             validate_compressive_encoding(required(fsst.values.as_deref(), "FSST values")?)
   45 |         }
   46 |         Some(Compression::Dictionary(dictionary)) => {
   47 |             validate_compressive_encoding(required(
   48 |                 dictionary.indices.as_deref(),
   49 |                 "dictionary indices",
   50 |             )?)?;
   51 |             validate_compressive_encoding(required(
   52 |                 dictionary.items.as_deref(),
   53 |                 "dictionary items",
   54 |             )?)
   55 |         }
   56 |         Some(Compression::Rle(rle)) => {
   57 |             validate_compressive_encoding(required(rle.values.as_deref(), "RLE values")?)?;
   58 |             validate_compressive_encoding(required(rle.run_lengths.as_deref(), "RLE run lengths")?)
   59 |         }
   60 |         Some(Compression::ByteStreamSplit(split)) => validate_compressive_encoding(required(
   61 |             split.values.as_deref(),
   62 |             "byte-stream-split values",
   63 |         )?),
   64 |         Some(Compression::General(general)) => validate_compressive_encoding(required(
   65 |             general.values.as_deref(),
   66 |             "general-compression values",
   67 |         )?),
   68 |         Some(Compression::FixedSizeList(list)) => validate_compressive_encoding(required(
   69 |             list.values.as_deref(),
   70 |             "fixed-size-list values",
   71 |         )?),
   72 |         Some(Compression::PackedStruct(packed)) => validate_compressive_encoding(required(
   73 |             packed.values.as_deref(),
   74 |             "packed-struct values",
   75 |         )?),
   76 |         Some(Compression::VariablePackedStruct(packed)) => {
   77 |             for field in &packed.fields {
   78 |                 validate_compressive_encoding(required(
   79 |                     field.value.as_ref(),
   80 |                     "variable packed-struct field",
   81 |                 )?)?;
   82 |             }
   83 |             Ok(())
   84 |         }
   85 |         None => Err(Error::invalid_input_source(
   86 |             "Lance v2.3 compressive encoding is missing its compression variant".into(),
   87 |         )),
   88 |     }
   89 | }
   90 | 
   91 | fn validate_sparse_positions(positions: Option<&pb21::SparsePositionSet>) -> Result<()> {
   92 |     use pb21::sparse_position_set::Positions;
   93 | 
   94 |     if let Some(Positions::Explicit(encoding)) =
   95 |         positions.and_then(|positions| positions.positions.as_ref())
   96 |     {
   97 |         validate_compressive_encoding(encoding)?;
   98 |     }
   99 |     Ok(())
  100 | }
  101 | 
  102 | fn validate_sparse_validity(validity: Option<&pb21::SparseValiditySet>) -> Result<()> {
  103 |     if let Some(validity) = validity {
  104 |         validate_sparse_positions(validity.positions.as_ref())?;
  105 |     }
  106 |     Ok(())
  107 | }
  108 | 
  109 | fn validate_sparse_layout(layout: &pb21::SparseLayout) -> Result<()> {
  110 |     use pb21::{sparse_count_set::Counts, sparse_structural_layer::Layer};
  111 | 
  112 |     if !layout.has_large_chunk {
  113 |         return Err(Error::invalid_input_source(
  114 |             "Lance v2.3 sparse pages require the u32 chunk grammar".into(),
  115 |         ));
  116 |     }
  117 |     validate_compressive_encoding(required(
  118 |         layout.value_compression.as_ref(),
  119 |         "sparse values",
  120 |     )?)?;
  121 |     for layer in &layout.structural_layers {
  122 |         match layer.layer.as_ref() {
  123 |             Some(Layer::Validity(validity)) => {
  124 |                 validate_sparse_validity(validity.validity.as_ref())?
  125 |             }
  126 |             Some(Layer::List(list)) => {
  127 |                 validate_sparse_positions(list.non_empty_positions.as_ref())?;
  128 |                 if let Some(Counts::Explicit(encoding)) = list
  129 |                     .counts
  130 |                     .as_ref()
  131 |                     .and_then(|counts| counts.counts.as_ref())
  132 |                 {
  133 |                     validate_compressive_encoding(encoding)?;
  134 |                 }
  135 |                 validate_sparse_validity(list.validity.as_ref())?;
  136 |             }
  137 |             Some(Layer::FixedSizeList(list)) => validate_sparse_validity(list.validity.as_ref())?,
  138 |             None => {
  139 |                 return Err(Error::invalid_input_source(
  140 |                     "Lance v2.3 sparse structural layer is missing its layer variant".into(),
  141 |                 ));
  142 |             }
  143 |         }
  144 |     }
  145 |     Ok(())
  146 | }
  147 | 
  148 | fn validate_page_layout(layout: &pb21::PageLayout) -> Result<()> {
  149 |     use pb21::page_layout::Layout;
  150 | 
  151 |     match layout.layout.as_ref() {
  152 |         Some(Layout::MiniBlockLayout(miniblock)) => {
  153 |             if !miniblock.has_large_chunk {
  154 |                 return Err(Error::invalid_input_source(
  155 |                     "Lance v2.3 miniblock pages require the u32 chunk grammar".into(),
  156 |                 ));
  157 |             }
  158 |             if let Some(rep) = miniblock.rep_compression.as_ref() {
  159 |                 validate_compressive_encoding(rep)?;
  160 |             }
  161 |             if let Some(def) = miniblock.def_compression.as_ref() {
  162 |                 validate_compressive_encoding(def)?;
  163 |             }
  164 |             validate_compressive_encoding(required(
  165 |                 miniblock.value_compression.as_ref(),
  166 |                 "miniblock values",
  167 |             )?)?;
  168 |             if let Some(dictionary) = miniblock.dictionary.as_ref() {
  169 |                 validate_compressive_encoding(dictionary)?;
  170 |             }
  171 |             Ok(())
  172 |         }
  173 |         Some(Layout::FullZipLayout(fullzip)) => validate_compressive_encoding(required(
  174 |             fullzip.value_compression.as_ref(),
  175 |             "full-zip values",
  176 |         )?),
  177 |         Some(Layout::ConstantLayout(constant)) => {
  178 |             if let Some(rep) = constant.rep_compression.as_ref() {
  179 |                 validate_compressive_encoding(rep)?;
  180 |             }
  181 |             if let Some(def) = constant.def_compression.as_ref() {
  182 |                 validate_compressive_encoding(def)?;
  183 |             }
  184 |             Ok(())
  185 |         }
  186 |         Some(Layout::SparseLayout(sparse)) => validate_sparse_layout(sparse),
  187 |         Some(Layout::BlobLayout(blob)) => {
  188 |             let inner = blob.inner_layout.as_deref().ok_or_else(|| {
  189 |                 Error::invalid_input_source(
  190 |                     "Lance v2.3 blob page layout is missing its inner layout".into(),
  191 |                 )
  192 |             })?;
  193 |             validate_page_layout(inner)
  194 |         }
  195 |         None => Err(Error::invalid_input_source(
  196 |             "Lance v2.3 page is missing its page layout".into(),
  197 |         )),
  198 |     }
  199 | }
  200 | 
  201 | pub fn decode_column(
  202 |     column_index: u32,
  203 |     metadata: &pbfile::ColumnMetadata,
  204 | ) -> Result<Arc<ColumnInfo>> {
  205 |     let page_infos = metadata
  206 |         .pages
  207 |         .iter()
  208 |         .enumerate()
  209 |         .map(|(page_index, page)| {
  210 |             let page_layout = structural::decode_page_layout(column_index, page_index, page)?;
  211 |             validate_page_layout(&page_layout)?;
  212 |             structural::build_page_info(column_index, page_index, page, page_layout)
  213 |         })
  214 |         .collect::<Result<Vec<_>>>()?;
  215 |     structural::build_column_info(column_index, metadata, page_infos)
  216 | }
  217 | 
  218 | pub fn decode_column_metadata(
  219 |     column_metadatas: &[pbfile::ColumnMetadata],
  220 | ) -> Result<Vec<Arc<ColumnInfo>>> {
  221 |     column_metadatas
  222 |         .iter()
  223 |         .enumerate()
  224 |         .map(|(column_index, metadata)| {
  225 |             let column_index = u32::try_from(column_index).map_err(|_| {
  226 |                 Error::invalid_input_source("File has more than u32::MAX columns".into())
  227 |             })?;
  228 |             decode_column(column_index, metadata)
  229 |         })
  230 |         .collect()
  231 | }
  232 | 
  233 | pub fn projection_from_field_ids(
  234 |     schema: &Schema,
  235 |     field_id_to_column_index: &BTreeMap<u32, u32>,
  236 | ) -> ReaderProjection {
  237 |     structural::projection_from_field_ids(schema, field_id_to_column_index)
  238 | }
  239 | 
  240 | pub fn projection_from_whole_schema(schema: &Schema) -> ReaderProjection {
  241 |     structural::projection_from_field_ids(schema, &super::field_id_to_column_index(schema))
  242 | }
  243 | 
  244 | pub fn projection_from_column_names(
  245 |     schema: &Schema,
  246 |     column_names: &[&str],
  247 | ) -> Result<ReaderProjection> {
  248 |     structural::projection_from_column_names(
  249 |         schema,
  250 |         column_names,
  251 |         &super::field_id_to_column_index(schema),
  252 |     )
  253 | }
  254 | 
  255 | pub fn finish_metadata(raw: RawFileMetadata) -> Result<CachedFileMetadata> {
  256 |     if (raw.footer.major_version, raw.footer.minor_version) != (2, 3) {
  257 |         return Err(Error::version_conflict(
  258 |             "Attempt to use the Lance v2.3 reader for a different file version".to_string(),
  259 |             raw.footer.major_version,
  260 |             raw.footer.minor_version,
  261 |         ));
  262 |     }
  263 |     validate_global_buffers(&raw.file_buffers)?;
  264 |     let column_infos = decode_column_metadata(&raw.column_metadatas)?;
  265 |     Ok(CachedFileMetadata {
  266 |         file_schema: raw.file_schema,
  267 |         column_metadatas: raw.column_metadatas,
  268 |         column_infos,
  269 |         num_rows: raw.num_rows,
  270 |         file_buffers: raw.file_buffers,
  271 |         num_data_bytes: raw.num_data_bytes,
  272 |         num_column_metadata_bytes: raw.num_column_metadata_bytes,
  273 |         num_global_buffer_bytes: raw.num_global_buffer_bytes,
  274 |         num_footer_bytes: raw.num_footer_bytes,
  275 |         major_version: raw.footer.major_version,
  276 |         minor_version: raw.footer.minor_version,
  277 |         version: ConcreteFileVersion::V2_3,
  278 |         file_size_bytes: raw.file_size_bytes,
  279 |         retained_global_buffers: raw.retained_global_buffers,
  280 |     })
  281 | }
  282 | 
  283 | pub fn validate_global_buffers(buffers: &[BufferDescriptor]) -> Result<()> {
  284 |     structural::validate_global_buffers(buffers)
  285 | }
  286 | 
  287 | pub fn finish_metadata_index(index: FileMetadataIndex) -> Result<FileMetadataIndex> {
  288 |     if index.version != ConcreteFileVersion::V2_3 {
  289 |         let (major, minor) = index.version.to_standard_footer_numbers();
  290 |         return Err(Error::version_conflict(
  291 |             "Attempt to use the Lance v2.3 reader for a different metadata index".to_string(),
  292 |             major,
  293 |             minor,
  294 |         ));
  295 |     }
  296 |     validate_global_buffers(&index.file_buffers)?;
  297 |     Ok(index)
  298 | }
  299 | 
  300 | #[cfg(test)]
  301 | mod grammar_tests {
  302 |     use super::*;
  303 |     use pb21::{
  304 |         CompressiveEncoding, Dictionary, Flat, FullZipLayout, PageLayout, Rle,
  305 |         compressive_encoding::Compression, page_layout::Layout,
  306 |     };
  307 | 
  308 |     fn flat(bits_per_value: u64) -> CompressiveEncoding {
  309 |         CompressiveEncoding {
  310 |             compression: Some(Compression::Flat(Flat {
  311 |                 bits_per_value,
  312 |                 data: None,
  313 |             })),
  314 |         }
  315 |     }
  316 | 
  317 |     #[test]
  318 |     fn accepts_nested_variable_width_rle() {
  319 |         let rle = CompressiveEncoding {
  320 |             compression: Some(Compression::Rle(Box::new(Rle {
  321 |                 values: Some(Box::new(flat(32))),
  322 |                 run_lengths: Some(Box::new(flat(16))),
  323 |             }))),
  324 |         };
  325 |         let dictionary = CompressiveEncoding {
  326 |             compression: Some(Compression::Dictionary(Box::new(Dictionary {
  327 |                 indices: Some(Box::new(rle)),
  328 |                 items: Some(Box::new(flat(32))),
  329 |                 num_dictionary_items: 1,
  330 |             }))),
  331 |         };
  332 |         let layout = PageLayout {
  333 |             layout: Some(Layout::FullZipLayout(FullZipLayout {
  334 |                 value_compression: Some(dictionary),
  335 |                 ..Default::default()
  336 |             })),
  337 |         };
  338 | 
  339 |         validate_page_layout(&layout).unwrap();
  340 |     }
  341 | }
``````
