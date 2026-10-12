> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-file/src/versions/v2_1/reader.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `9b21c0d5386a5d9553eb35f1a1c3c53cfaba42b642bf218aaa626a2e2a4b7722`. Reviewed physical lines: 1-304.

[Module](../../../../../../L1-modules/rust-lance-file-readers.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Exact V2_1 reader metadata/projection implementation inside a private reader child module. The parent publicly reexports three projection constructors and reexports metadata functions pub(crate); other pub declarations are implementation interfaces, not independently external API. (rust/lance-file/src/versions/v2_1/reader.rs:1-304)

## Complete range analysis

### Lines 1-17

SPDX/imports connect BTreeMap/Arc, core Schema/errors, ColumnInfo and pb21 grammar, file protobuf, shared structural normalization/projection, raw/cached/index metadata and ConcreteFileVersion. No IO scheduler, decompressor, plugin registry or environment input is used in this exact grammar validator. (rust/lance-file/src/versions/v2_1/reader.rs:1-17)

### Lines 18-25

Private required borrows Option<&T>, returns the same reference or InvalidInput source naming Lance v2.1, supplied label and missing nested encoding. It does not clone payloads or supply defaults. (rust/lance-file/src/versions/v2_1/reader.rs:18-25)

### Lines 26-45

Private validate_compressive_encoding requires compression oneof. Flat, InlineBitpacking and Constant immediately succeed without inspecting bit widths/data fields/literal size. Variable requires/revalidates offsets; OutOfLineBitpacking requires/revalidates values; Fsst likewise values. Local recursive validation has no explicit depth limit; external protobuf decode limits remain a separate concern. (rust/lance-file/src/versions/v2_1/reader.rs:26-45)

### Lines 46-55

Dictionary first requires and recursively validates indices, then items. Missing/invalid indices short-circuit before items. num_dictionary_items and index/value relationships are not checked. This is grammar validation, not decoding data bytes. (rust/lance-file/src/versions/v2_1/reader.rs:46-55)

### Lines 56-76

RLE requires values and run_lengths present before validating their shapes. Values must be direct Flat with bits_per_value 8/16/32/64 and data=None; lengths must be direct Flat8 with data=None. Flat.data is an optional BufferCompression descriptor, not the encoded bytes (protos/encodings_v2_1.proto:419-425). Wrappers, 128-bit values, any present buffer-compression descriptor (including a default descriptor), and any other shape fail InvalidInput requiring flat values and flat u8 run lengths. It does not inspect encoded runs or row totals. (rust/lance-file/src/versions/v2_1/reader.rs:56-76)

### Lines 77-101

ByteStreamSplit, General, FixedSizeList and PackedStruct each require and recursively validate their values child; scheme/level, dimensions, packed field widths and other properties are not inspected. VariablePackedStruct is rejected unconditionally as outside v2.1 grammar, even empty. Missing compression variant is InvalidInput. (rust/lance-file/src/versions/v2_1/reader.rs:77-101)

### Lines 102-127

validate_page_layout MiniBlock rejects has_large_chunk=true before nested checks. If false, validate optional rep then def, required value, optional dictionary, in order. Optional missing rep/def/dictionary are accepted. It does not inspect buffers, chunk counts, level widths or data values. (rust/lance-file/src/versions/v2_1/reader.rs:102-127)

### Lines 128-144

FullZip requires/revalidates value_compression only. Constant accepts only inline_value=None and both rep_compression/def_compression=None; any inline_value presence is first error (including empty), then compressed-level presence error, otherwise succeeds. Constant-layout acceptance includes all-null form even though writer policy list has no constant() mechanism. Other Constant fields are not inspected here. (rust/lance-file/src/versions/v2_1/reader.rs:128-144)

### Lines 145-160

Blob requires inner_layout with its own missing-inner InvalidInput, then recursively validates the same exact version. Nested Blob wrappers have no local recursion cap. Sparse is always InvalidInput outside v2.1 grammar; absent page layout has a distinct missing-layout error. (rust/lance-file/src/versions/v2_1/reader.rs:145-160)

### Lines 161-177

decode_column enumerates every page: shared syntax decode PageLayout, exact validate_page_layout, then shared build_page_info. First syntax/grammar failure precedes that page alignment checks. Fallibly collect pages then shared build_column_info decodes column encoding. No local ColumnEncoding variant validator, physical data read or schema comparison. Empty page list still requires a valid column-encoding envelope (rust/lance-file/src/reader/structural.rs:118-155). (rust/lance-file/src/versions/v2_1/reader.rs:161-177)

### Lines 178-192

decode_column_metadata enumerates and checked-converts zero-based indices to u32, decodes in order and collects Result<Vec<Arc<ColumnInfo>>>. Message says more than u32::MAX columns; actual guard is per-index and permits index u32::MAX. No parallelism; first error drops constructed Vec. (rust/lance-file/src/versions/v2_1/reader.rs:178-192)

### Lines 193-214

projection_from_field_ids forwards shared leaf traversal. Whole-schema projection first creates parent module mapping from entire schema. Name projection passes original full schema and its mapping to shared schema.project wrapper, so indices preserve original file numbering. Unknown mapping entries remain silently omitted until downstream checks; these functions add no new validation. (rust/lance-file/src/versions/v2_1/reader.rs:193-214)

### Lines 215-224

finish_metadata requires literal footer pair(2,1) before any alignment or grammar work; wrong pair returns VersionConflict with actual raw footer numbers and exact version message. Then validate_global_buffers and decode all column metadata in that order. (rust/lance-file/src/versions/v2_1/reader.rs:215-224)

### Lines 225-242

On success construct CachedFileMetadata moving raw schema, original protobuf columns, decoded infos, declared row count, descriptors, all four byte-accounting fields, file size and retained global bytes. Preserve literal major/minor; set exact ConcreteFileVersion::V2_1. Full metadata and normalized descriptors both remain retained. This function does not reconcile schema, total rows, counts, file bounds or byte-accounting totals and performs no IO. (rust/lance-file/src/versions/v2_1/reader.rs:225-242)

### Lines 243-246

validate_global_buffers delegates shared64-byte position-alignment check; no size/file-bound check at this boundary. (rust/lance-file/src/versions/v2_1/reader.rs:243-246)

### Lines 247-259

finish_metadata_index requires enum V2_1; mismatch uses actual enum standard footer tuple for VersionConflict. Matching identity then checks global-buffer alignment and returns index unchanged. Does not load/decode individual columns or establish projection eligibility/length. Global alignment error follows version check. (rust/lance-file/src/versions/v2_1/reader.rs:247-259)

### Lines 260-268

cfg(test) test_projection_length delegates shared structural synthetic-length helper; unlike V2_0 helper it inherits surplus-index checking. It is a helper, not a test case. (rust/lance-file/src/versions/v2_1/reader.rs:260-268)

### Lines 269-290

Private cfg(test) grammar_tests imports pb21 types. rejects_nested_variable_packed_struct builds an empty VariablePackedStruct wrapped in General with compression=None and values=Some(Box(child)); it tests traversal through General, not codec scheme validity. (rust/lance-file/src/versions/v2_1/reader.rs:269-290)

### Lines 291-304

Wrap in FullZip with other fields Default; validate_page_layout must error and display contain Variable packed struct compression is not part. The test does not assert the error variant, use bytes/IO, or test a valid packed payload. No other local grammar fixtures; no unsafe or async functions. (rust/lance-file/src/versions/v2_1/reader.rs:291-304)

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
   21 |             format!("Lance v2.1 {label} is missing its nested encoding").into(),
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
   57 |             let values = required(rle.values.as_deref(), "RLE values")?;
   58 |             let run_lengths = required(rle.run_lengths.as_deref(), "RLE run lengths")?;
   59 |             let fixed_values = matches!(
   60 |                 values.compression.as_ref(),
   61 |                 Some(Compression::Flat(flat))
   62 |                     if matches!(flat.bits_per_value, 8 | 16 | 32 | 64)
   63 |                         && flat.data.is_none()
   64 |             );
   65 |             let fixed_u8_lengths = matches!(
   66 |                 run_lengths.compression.as_ref(),
   67 |                 Some(Compression::Flat(flat))
   68 |                     if flat.bits_per_value == 8 && flat.data.is_none()
   69 |             );
   70 |             if !fixed_values || !fixed_u8_lengths {
   71 |                 return Err(Error::invalid_input_source(
   72 |                     "Lance v2.1 RLE requires flat values and flat u8 run lengths".into(),
   73 |                 ));
   74 |             }
   75 |             Ok(())
   76 |         }
   77 |         Some(Compression::ByteStreamSplit(split)) => validate_compressive_encoding(required(
   78 |             split.values.as_deref(),
   79 |             "byte-stream-split values",
   80 |         )?),
   81 |         Some(Compression::General(general)) => validate_compressive_encoding(required(
   82 |             general.values.as_deref(),
   83 |             "general-compression values",
   84 |         )?),
   85 |         Some(Compression::FixedSizeList(list)) => validate_compressive_encoding(required(
   86 |             list.values.as_deref(),
   87 |             "fixed-size-list values",
   88 |         )?),
   89 |         Some(Compression::PackedStruct(packed)) => validate_compressive_encoding(required(
   90 |             packed.values.as_deref(),
   91 |             "packed-struct values",
   92 |         )?),
   93 |         Some(Compression::VariablePackedStruct(_)) => Err(Error::invalid_input_source(
   94 |             "Variable packed struct compression is not part of the Lance v2.1 grammar".into(),
   95 |         )),
   96 |         None => Err(Error::invalid_input_source(
   97 |             "Lance v2.1 compressive encoding is missing its compression variant".into(),
   98 |         )),
   99 |     }
  100 | }
  101 | 
  102 | fn validate_page_layout(layout: &pb21::PageLayout) -> Result<()> {
  103 |     use pb21::page_layout::Layout;
  104 | 
  105 |     match layout.layout.as_ref() {
  106 |         Some(Layout::MiniBlockLayout(miniblock)) => {
  107 |             if miniblock.has_large_chunk {
  108 |                 return Err(Error::invalid_input_source(
  109 |                     "Large miniblock chunks are not part of the Lance v2.1 grammar".into(),
  110 |                 ));
  111 |             }
  112 |             if let Some(rep) = miniblock.rep_compression.as_ref() {
  113 |                 validate_compressive_encoding(rep)?;
  114 |             }
  115 |             if let Some(def) = miniblock.def_compression.as_ref() {
  116 |                 validate_compressive_encoding(def)?;
  117 |             }
  118 |             validate_compressive_encoding(required(
  119 |                 miniblock.value_compression.as_ref(),
  120 |                 "miniblock values",
  121 |             )?)?;
  122 |             if let Some(dictionary) = miniblock.dictionary.as_ref() {
  123 |                 validate_compressive_encoding(dictionary)?;
  124 |             }
  125 |             Ok(())
  126 |         }
  127 |         Some(Layout::FullZipLayout(fullzip)) => validate_compressive_encoding(required(
  128 |             fullzip.value_compression.as_ref(),
  129 |             "full-zip values",
  130 |         )?),
  131 |         Some(Layout::ConstantLayout(constant)) => {
  132 |             if constant.inline_value.is_some() {
  133 |                 Err(Error::invalid_input_source(
  134 |                     "Lance v2.1 only accepts the all-null form of constant page layout".into(),
  135 |                 ))
  136 |             } else if constant.rep_compression.is_some() || constant.def_compression.is_some() {
  137 |                 Err(Error::invalid_input_source(
  138 |                     "Compressed constant-page levels are not part of the Lance v2.1 grammar".into(),
  139 |                 ))
  140 |             } else {
  141 |                 Ok(())
  142 |             }
  143 |         }
  144 |         Some(Layout::BlobLayout(blob)) => {
  145 |             let inner = blob.inner_layout.as_deref().ok_or_else(|| {
  146 |                 Error::invalid_input_source(
  147 |                     "Lance v2.1 blob page layout is missing its inner layout".into(),
  148 |                 )
  149 |             })?;
  150 |             validate_page_layout(inner)
  151 |         }
  152 |         Some(Layout::SparseLayout(_)) => Err(Error::invalid_input_source(
  153 |             "Sparse page layout is not part of the Lance v2.1 grammar".into(),
  154 |         )),
  155 |         None => Err(Error::invalid_input_source(
  156 |             "Lance v2.1 page is missing its page layout".into(),
  157 |         )),
  158 |     }
  159 | }
  160 | 
  161 | pub fn decode_column(
  162 |     column_index: u32,
  163 |     metadata: &pbfile::ColumnMetadata,
  164 | ) -> Result<Arc<ColumnInfo>> {
  165 |     let page_infos = metadata
  166 |         .pages
  167 |         .iter()
  168 |         .enumerate()
  169 |         .map(|(page_index, page)| {
  170 |             let page_layout = structural::decode_page_layout(column_index, page_index, page)?;
  171 |             validate_page_layout(&page_layout)?;
  172 |             structural::build_page_info(column_index, page_index, page, page_layout)
  173 |         })
  174 |         .collect::<Result<Vec<_>>>()?;
  175 |     structural::build_column_info(column_index, metadata, page_infos)
  176 | }
  177 | 
  178 | pub fn decode_column_metadata(
  179 |     column_metadatas: &[pbfile::ColumnMetadata],
  180 | ) -> Result<Vec<Arc<ColumnInfo>>> {
  181 |     column_metadatas
  182 |         .iter()
  183 |         .enumerate()
  184 |         .map(|(column_index, metadata)| {
  185 |             let column_index = u32::try_from(column_index).map_err(|_| {
  186 |                 Error::invalid_input_source("File has more than u32::MAX columns".into())
  187 |             })?;
  188 |             decode_column(column_index, metadata)
  189 |         })
  190 |         .collect()
  191 | }
  192 | 
  193 | pub fn projection_from_field_ids(
  194 |     schema: &Schema,
  195 |     field_id_to_column_index: &BTreeMap<u32, u32>,
  196 | ) -> ReaderProjection {
  197 |     structural::projection_from_field_ids(schema, field_id_to_column_index)
  198 | }
  199 | 
  200 | pub fn projection_from_whole_schema(schema: &Schema) -> ReaderProjection {
  201 |     structural::projection_from_field_ids(schema, &super::field_id_to_column_index(schema))
  202 | }
  203 | 
  204 | pub fn projection_from_column_names(
  205 |     schema: &Schema,
  206 |     column_names: &[&str],
  207 | ) -> Result<ReaderProjection> {
  208 |     structural::projection_from_column_names(
  209 |         schema,
  210 |         column_names,
  211 |         &super::field_id_to_column_index(schema),
  212 |     )
  213 | }
  214 | 
  215 | pub fn finish_metadata(raw: RawFileMetadata) -> Result<CachedFileMetadata> {
  216 |     if (raw.footer.major_version, raw.footer.minor_version) != (2, 1) {
  217 |         return Err(Error::version_conflict(
  218 |             "Attempt to use the Lance v2.1 reader for a different file version".to_string(),
  219 |             raw.footer.major_version,
  220 |             raw.footer.minor_version,
  221 |         ));
  222 |     }
  223 |     validate_global_buffers(&raw.file_buffers)?;
  224 |     let column_infos = decode_column_metadata(&raw.column_metadatas)?;
  225 |     Ok(CachedFileMetadata {
  226 |         file_schema: raw.file_schema,
  227 |         column_metadatas: raw.column_metadatas,
  228 |         column_infos,
  229 |         num_rows: raw.num_rows,
  230 |         file_buffers: raw.file_buffers,
  231 |         num_data_bytes: raw.num_data_bytes,
  232 |         num_column_metadata_bytes: raw.num_column_metadata_bytes,
  233 |         num_global_buffer_bytes: raw.num_global_buffer_bytes,
  234 |         num_footer_bytes: raw.num_footer_bytes,
  235 |         major_version: raw.footer.major_version,
  236 |         minor_version: raw.footer.minor_version,
  237 |         version: ConcreteFileVersion::V2_1,
  238 |         file_size_bytes: raw.file_size_bytes,
  239 |         retained_global_buffers: raw.retained_global_buffers,
  240 |     })
  241 | }
  242 | 
  243 | pub fn validate_global_buffers(buffers: &[BufferDescriptor]) -> Result<()> {
  244 |     structural::validate_global_buffers(buffers)
  245 | }
  246 | 
  247 | pub fn finish_metadata_index(index: FileMetadataIndex) -> Result<FileMetadataIndex> {
  248 |     if index.version != ConcreteFileVersion::V2_1 {
  249 |         let (major, minor) = index.version.to_standard_footer_numbers();
  250 |         return Err(Error::version_conflict(
  251 |             "Attempt to use the Lance v2.1 reader for a different metadata index".to_string(),
  252 |             major,
  253 |             minor,
  254 |         ));
  255 |     }
  256 |     validate_global_buffers(&index.file_buffers)?;
  257 |     Ok(index)
  258 | }
  259 | 
  260 | #[cfg(test)]
  261 | pub fn test_projection_length(
  262 |     schema: &Schema,
  263 |     column_indices: &[u32],
  264 |     column_lengths: &[u64],
  265 | ) -> Result<u64> {
  266 |     structural::test_projection_length(schema, column_indices, column_lengths)
  267 | }
  268 | 
  269 | #[cfg(test)]
  270 | mod grammar_tests {
  271 |     use super::*;
  272 |     use pb21::{
  273 |         CompressiveEncoding, FullZipLayout, General, PageLayout, VariablePackedStruct,
  274 |         compressive_encoding::Compression, page_layout::Layout,
  275 |     };
  276 | 
  277 |     #[test]
  278 |     fn rejects_nested_variable_packed_struct() {
  279 |         let variable_packed = CompressiveEncoding {
  280 |             compression: Some(Compression::VariablePackedStruct(VariablePackedStruct {
  281 |                 fields: Vec::new(),
  282 |             })),
  283 |         };
  284 |         let wrapped = CompressiveEncoding {
  285 |             compression: Some(Compression::General(Box::new(General {
  286 |                 compression: None,
  287 |                 values: Some(Box::new(variable_packed)),
  288 |             }))),
  289 |         };
  290 |         let layout = PageLayout {
  291 |             layout: Some(Layout::FullZipLayout(FullZipLayout {
  292 |                 value_compression: Some(wrapped),
  293 |                 ..Default::default()
  294 |             })),
  295 |         };
  296 | 
  297 |         let error = validate_page_layout(&layout).unwrap_err();
  298 |         assert!(
  299 |             error
  300 |                 .to_string()
  301 |                 .contains("Variable packed struct compression is not part")
  302 |         );
  303 |     }
  304 | }
``````
