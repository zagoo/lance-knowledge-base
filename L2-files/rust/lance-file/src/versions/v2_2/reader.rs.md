> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-file/src/versions/v2_2/reader.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `72a4d467d6701e1c105cb036476a352aeb92a5d4bc779228f8ac76cc113213e9`. Reviewed physical lines: 1-308.

[Module](../../../../../../L1-modules/rust-lance-file-readers.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Exact V2_2 reader metadata/projection implementation inside a private reader child module. The parent publicly reexports three projection constructors and reexports metadata functions pub(crate); other pub declarations are implementation interfaces, not independently external API. (rust/lance-file/src/versions/v2_2/reader.rs:1-308)

## Complete range analysis

### Lines 1-17

SPDX/imports connect BTreeMap/Arc, core Schema/errors, ColumnInfo and pb21 grammar, file protobuf, shared structural normalization/projection, raw/cached/index metadata and ConcreteFileVersion. No IO scheduler, decompressor, plugin registry or environment input is used in this exact grammar validator. (rust/lance-file/src/versions/v2_2/reader.rs:1-17)

### Lines 18-25

Private required borrows Option<&T>, returns the same reference or InvalidInput source naming Lance v2.2, supplied label and missing nested encoding. It does not clone payloads or supply defaults. (rust/lance-file/src/versions/v2_2/reader.rs:18-25)

### Lines 26-45

Private validate_compressive_encoding requires compression oneof. Flat, InlineBitpacking and Constant immediately succeed without inspecting bit widths/data fields/literal size. Variable requires/revalidates offsets; OutOfLineBitpacking requires/revalidates values; Fsst likewise values. Local recursive validation has no explicit depth limit; external protobuf decode limits remain a separate concern. (rust/lance-file/src/versions/v2_2/reader.rs:26-45)

### Lines 46-55

Dictionary first requires and recursively validates indices, then items. Missing/invalid indices short-circuit before items. num_dictionary_items and index/value relationships are not checked. This is grammar validation, not decoding data bytes. (rust/lance-file/src/versions/v2_2/reader.rs:46-55)

### Lines 56-76

RLE requires both nested children, then demands direct Flat values at 8/16/32/64 bits with data=None and direct Flat8 run lengths with data=None. InvalidInput on any other shape; no recursive generic validation here because children must already be literal flat forms. Flat.data is an optional BufferCompression descriptor, not the encoded bytes; any present descriptor, including a default descriptor, is rejected (protos/encodings_v2_1.proto:419-425). (rust/lance-file/src/versions/v2_2/reader.rs:56-76)

### Lines 77-107

ByteStreamSplit, General, FixedSizeList and PackedStruct require/revalidate values. VariablePackedStruct loops fields in order, requires each field.value and recursively validates; empty field list succeeds. Other packed field properties and width/schema correspondence are not checked. Missing compression variant errors; all other ancillary numeric/codec fields are unchecked locally. (rust/lance-file/src/versions/v2_2/reader.rs:77-107)

### Lines 108-133

MiniBlock requires has_large_chunk=true (u32 chunk grammar); false returns InvalidInput before rep/def/value/dictionary traversal. Validate optional rep then def, required value then optional dictionary. Absence of optional fields accepted; no buffer/chunk/row validation. (rust/lance-file/src/versions/v2_2/reader.rs:108-133)

### Lines 134-146

FullZip validates required value only. Constant validates optional rep then def encodings, otherwise succeeds; it does not reject or inspect inline_value presence/content. Thus both all-null and literal-bearing forms pass this local gate, subject to later decoding. (rust/lance-file/src/versions/v2_2/reader.rs:134-146)

### Lines 147-162

Blob requires inner_layout and recursively validates exact v2.2 grammar. Sparse always rejected, missing page-layout variant gets InvalidInput. No local depth limit; acceptance of syntax does not prove data payload validity. (rust/lance-file/src/versions/v2_2/reader.rs:147-162)

### Lines 163-179

decode_column enumerates every page: shared syntax decode PageLayout, exact validate_page_layout, then shared build_page_info. First syntax/grammar failure precedes that page alignment checks. Fallibly collect pages then shared build_column_info decodes column encoding. No local ColumnEncoding variant validator, physical data read or schema comparison. Empty page list still requires a valid column-encoding envelope (rust/lance-file/src/reader/structural.rs:118-155). (rust/lance-file/src/versions/v2_2/reader.rs:163-179)

### Lines 180-194

decode_column_metadata enumerates and checked-converts zero-based indices to u32, decodes in order and collects Result<Vec<Arc<ColumnInfo>>>. Message says more than u32::MAX columns; actual guard is per-index and permits index u32::MAX. No parallelism; first error drops constructed Vec. (rust/lance-file/src/versions/v2_2/reader.rs:180-194)

### Lines 195-216

projection_from_field_ids forwards shared leaf traversal. Whole-schema projection first creates parent module mapping from entire schema. Name projection passes original full schema and its mapping to shared schema.project wrapper, so indices preserve original file numbering. Unknown mapping entries remain silently omitted until downstream checks; these functions add no new validation. (rust/lance-file/src/versions/v2_2/reader.rs:195-216)

### Lines 217-226

finish_metadata requires literal footer pair(2,2) before any alignment or grammar work; wrong pair returns VersionConflict with actual raw footer numbers and exact version message. Then validate_global_buffers and decode all column metadata in that order. (rust/lance-file/src/versions/v2_2/reader.rs:217-226)

### Lines 227-244

On success construct CachedFileMetadata moving raw schema, original protobuf columns, decoded infos, declared row count, descriptors, all four byte-accounting fields, file size and retained global bytes. Preserve literal major/minor; set exact ConcreteFileVersion::V2_2. Full metadata and normalized descriptors both remain retained. This function does not reconcile schema, total rows, counts, file bounds or byte-accounting totals and performs no IO. (rust/lance-file/src/versions/v2_2/reader.rs:227-244)

### Lines 245-248

validate_global_buffers delegates shared64-byte position-alignment check; no size/file-bound check at this boundary. (rust/lance-file/src/versions/v2_2/reader.rs:245-248)

### Lines 249-261

finish_metadata_index requires enum V2_2; mismatch uses actual enum standard footer tuple for VersionConflict. Matching identity then checks global-buffer alignment and returns index unchanged. Does not load/decode individual columns or establish projection eligibility/length. Global alignment error follows version check. (rust/lance-file/src/versions/v2_2/reader.rs:249-261)

### Lines 262-278

Private cfg(test) grammar_tests imports compression/layout types. flat(bits) constructs Flat with requested width and data=None without validation. No helper asserts the width itself. (rust/lance-file/src/versions/v2_2/reader.rs:262-278)

### Lines 279-300

rejects_nested_variable_width_rle builds RLE Flat32 values and Flat16 run lengths, nests as Dictionary indices with Flat32 items/count1, nests that in FullZip/default other fields. The disallowed shape here is sixteen-bit run lengths, not actual variable-width data payload. (rust/lance-file/src/versions/v2_2/reader.rs:279-300)

### Lines 301-308

Assert validate_page_layout errors and string contains flat values and flat u8 run lengths. No variant assertion, byte decode, file fixture or positive RLE matrix; nested wrapper traversal is what this test demonstrates. No unsafe/async functions in this file. (rust/lance-file/src/versions/v2_2/reader.rs:301-308)

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
   21 |             format!("Lance v2.2 {label} is missing its nested encoding").into(),
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
   72 |                     "Lance v2.2 RLE requires flat values and flat u8 run lengths".into(),
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
   93 |         Some(Compression::VariablePackedStruct(packed)) => {
   94 |             for field in &packed.fields {
   95 |                 validate_compressive_encoding(required(
   96 |                     field.value.as_ref(),
   97 |                     "variable packed-struct field",
   98 |                 )?)?;
   99 |             }
  100 |             Ok(())
  101 |         }
  102 |         None => Err(Error::invalid_input_source(
  103 |             "Lance v2.2 compressive encoding is missing its compression variant".into(),
  104 |         )),
  105 |     }
  106 | }
  107 | 
  108 | fn validate_page_layout(layout: &pb21::PageLayout) -> Result<()> {
  109 |     use pb21::page_layout::Layout;
  110 | 
  111 |     match layout.layout.as_ref() {
  112 |         Some(Layout::MiniBlockLayout(miniblock)) => {
  113 |             if !miniblock.has_large_chunk {
  114 |                 return Err(Error::invalid_input_source(
  115 |                     "Lance v2.2 miniblock pages require the u32 chunk grammar".into(),
  116 |                 ));
  117 |             }
  118 |             if let Some(rep) = miniblock.rep_compression.as_ref() {
  119 |                 validate_compressive_encoding(rep)?;
  120 |             }
  121 |             if let Some(def) = miniblock.def_compression.as_ref() {
  122 |                 validate_compressive_encoding(def)?;
  123 |             }
  124 |             validate_compressive_encoding(required(
  125 |                 miniblock.value_compression.as_ref(),
  126 |                 "miniblock values",
  127 |             )?)?;
  128 |             if let Some(dictionary) = miniblock.dictionary.as_ref() {
  129 |                 validate_compressive_encoding(dictionary)?;
  130 |             }
  131 |             Ok(())
  132 |         }
  133 |         Some(Layout::FullZipLayout(fullzip)) => validate_compressive_encoding(required(
  134 |             fullzip.value_compression.as_ref(),
  135 |             "full-zip values",
  136 |         )?),
  137 |         Some(Layout::ConstantLayout(constant)) => {
  138 |             if let Some(rep) = constant.rep_compression.as_ref() {
  139 |                 validate_compressive_encoding(rep)?;
  140 |             }
  141 |             if let Some(def) = constant.def_compression.as_ref() {
  142 |                 validate_compressive_encoding(def)?;
  143 |             }
  144 |             Ok(())
  145 |         }
  146 |         Some(Layout::BlobLayout(blob)) => {
  147 |             let inner = blob.inner_layout.as_deref().ok_or_else(|| {
  148 |                 Error::invalid_input_source(
  149 |                     "Lance v2.2 blob page layout is missing its inner layout".into(),
  150 |                 )
  151 |             })?;
  152 |             validate_page_layout(inner)
  153 |         }
  154 |         Some(Layout::SparseLayout(_)) => Err(Error::invalid_input_source(
  155 |             "Sparse page layout is not part of the Lance v2.2 grammar".into(),
  156 |         )),
  157 |         None => Err(Error::invalid_input_source(
  158 |             "Lance v2.2 page is missing its page layout".into(),
  159 |         )),
  160 |     }
  161 | }
  162 | 
  163 | pub fn decode_column(
  164 |     column_index: u32,
  165 |     metadata: &pbfile::ColumnMetadata,
  166 | ) -> Result<Arc<ColumnInfo>> {
  167 |     let page_infos = metadata
  168 |         .pages
  169 |         .iter()
  170 |         .enumerate()
  171 |         .map(|(page_index, page)| {
  172 |             let page_layout = structural::decode_page_layout(column_index, page_index, page)?;
  173 |             validate_page_layout(&page_layout)?;
  174 |             structural::build_page_info(column_index, page_index, page, page_layout)
  175 |         })
  176 |         .collect::<Result<Vec<_>>>()?;
  177 |     structural::build_column_info(column_index, metadata, page_infos)
  178 | }
  179 | 
  180 | pub fn decode_column_metadata(
  181 |     column_metadatas: &[pbfile::ColumnMetadata],
  182 | ) -> Result<Vec<Arc<ColumnInfo>>> {
  183 |     column_metadatas
  184 |         .iter()
  185 |         .enumerate()
  186 |         .map(|(column_index, metadata)| {
  187 |             let column_index = u32::try_from(column_index).map_err(|_| {
  188 |                 Error::invalid_input_source("File has more than u32::MAX columns".into())
  189 |             })?;
  190 |             decode_column(column_index, metadata)
  191 |         })
  192 |         .collect()
  193 | }
  194 | 
  195 | pub fn projection_from_field_ids(
  196 |     schema: &Schema,
  197 |     field_id_to_column_index: &BTreeMap<u32, u32>,
  198 | ) -> ReaderProjection {
  199 |     structural::projection_from_field_ids(schema, field_id_to_column_index)
  200 | }
  201 | 
  202 | pub fn projection_from_whole_schema(schema: &Schema) -> ReaderProjection {
  203 |     structural::projection_from_field_ids(schema, &super::field_id_to_column_index(schema))
  204 | }
  205 | 
  206 | pub fn projection_from_column_names(
  207 |     schema: &Schema,
  208 |     column_names: &[&str],
  209 | ) -> Result<ReaderProjection> {
  210 |     structural::projection_from_column_names(
  211 |         schema,
  212 |         column_names,
  213 |         &super::field_id_to_column_index(schema),
  214 |     )
  215 | }
  216 | 
  217 | pub fn finish_metadata(raw: RawFileMetadata) -> Result<CachedFileMetadata> {
  218 |     if (raw.footer.major_version, raw.footer.minor_version) != (2, 2) {
  219 |         return Err(Error::version_conflict(
  220 |             "Attempt to use the Lance v2.2 reader for a different file version".to_string(),
  221 |             raw.footer.major_version,
  222 |             raw.footer.minor_version,
  223 |         ));
  224 |     }
  225 |     validate_global_buffers(&raw.file_buffers)?;
  226 |     let column_infos = decode_column_metadata(&raw.column_metadatas)?;
  227 |     Ok(CachedFileMetadata {
  228 |         file_schema: raw.file_schema,
  229 |         column_metadatas: raw.column_metadatas,
  230 |         column_infos,
  231 |         num_rows: raw.num_rows,
  232 |         file_buffers: raw.file_buffers,
  233 |         num_data_bytes: raw.num_data_bytes,
  234 |         num_column_metadata_bytes: raw.num_column_metadata_bytes,
  235 |         num_global_buffer_bytes: raw.num_global_buffer_bytes,
  236 |         num_footer_bytes: raw.num_footer_bytes,
  237 |         major_version: raw.footer.major_version,
  238 |         minor_version: raw.footer.minor_version,
  239 |         version: ConcreteFileVersion::V2_2,
  240 |         file_size_bytes: raw.file_size_bytes,
  241 |         retained_global_buffers: raw.retained_global_buffers,
  242 |     })
  243 | }
  244 | 
  245 | pub fn validate_global_buffers(buffers: &[BufferDescriptor]) -> Result<()> {
  246 |     structural::validate_global_buffers(buffers)
  247 | }
  248 | 
  249 | pub fn finish_metadata_index(index: FileMetadataIndex) -> Result<FileMetadataIndex> {
  250 |     if index.version != ConcreteFileVersion::V2_2 {
  251 |         let (major, minor) = index.version.to_standard_footer_numbers();
  252 |         return Err(Error::version_conflict(
  253 |             "Attempt to use the Lance v2.2 reader for a different metadata index".to_string(),
  254 |             major,
  255 |             minor,
  256 |         ));
  257 |     }
  258 |     validate_global_buffers(&index.file_buffers)?;
  259 |     Ok(index)
  260 | }
  261 | 
  262 | #[cfg(test)]
  263 | mod grammar_tests {
  264 |     use super::*;
  265 |     use pb21::{
  266 |         CompressiveEncoding, Dictionary, Flat, FullZipLayout, PageLayout, Rle,
  267 |         compressive_encoding::Compression, page_layout::Layout,
  268 |     };
  269 | 
  270 |     fn flat(bits_per_value: u64) -> CompressiveEncoding {
  271 |         CompressiveEncoding {
  272 |             compression: Some(Compression::Flat(Flat {
  273 |                 bits_per_value,
  274 |                 data: None,
  275 |             })),
  276 |         }
  277 |     }
  278 | 
  279 |     #[test]
  280 |     fn rejects_nested_variable_width_rle() {
  281 |         let rle = CompressiveEncoding {
  282 |             compression: Some(Compression::Rle(Box::new(Rle {
  283 |                 values: Some(Box::new(flat(32))),
  284 |                 run_lengths: Some(Box::new(flat(16))),
  285 |             }))),
  286 |         };
  287 |         let dictionary = CompressiveEncoding {
  288 |             compression: Some(Compression::Dictionary(Box::new(Dictionary {
  289 |                 indices: Some(Box::new(rle)),
  290 |                 items: Some(Box::new(flat(32))),
  291 |                 num_dictionary_items: 1,
  292 |             }))),
  293 |         };
  294 |         let layout = PageLayout {
  295 |             layout: Some(Layout::FullZipLayout(FullZipLayout {
  296 |                 value_compression: Some(dictionary),
  297 |                 ..Default::default()
  298 |             })),
  299 |         };
  300 | 
  301 |         let error = validate_page_layout(&layout).unwrap_err();
  302 |         assert!(
  303 |             error
  304 |                 .to_string()
  305 |                 .contains("flat values and flat u8 run lengths")
  306 |         );
  307 |     }
  308 | }
``````
