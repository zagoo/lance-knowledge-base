> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md).

# rust/lance-file/src/versions/v2_0/mod.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `06261c80973339b559e73155b701b93d157c4452fe78cb2ccf6b7b655fc279a5`. Reviewed physical lines: 1-164.

[Module](../../../../../../L1-modules/rust-lance-file-composition.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Public V2_0 composition module: header-inclusive physical column mapping, external-metadata structural-header normalization, original array field strategy and concrete writer factories. (rust/lance-file/src/versions/v2_0/mod.rs:1-164)

## Complete range analysis

### Lines 1-23

SPDX/module documentation and imports bind BTreeMap/Arc, Bytes, core Field/Schema/Result, PageInfo and encoder traits, object Writer and local ReadProjection/options. Private reader/writer children own concrete mechanisms. No IO is executed by module initialization. (rust/lance-file/src/versions/v2_0/mod.rs:1-23)

### Lines 24-37

cfg(test) exposes test_projection_length pub(crate); metadata decoding/finalization/global-buffer validation are pub(crate) reexports. Three projection constructors and Writer are public reexports. Crate-internal read_projection returns the exact V2_0 reader projection Arc, without additional validation. (rust/lance-file/src/versions/v2_0/mod.rs:24-37)

### Lines 38-49

Public physical_column_count returns one for Blob or packed-struct field (suppress descendants); otherwise one plus recursive children sum. Ordinary structs/lists contribute their own header column and their descendants. Counts use unchecked usize arithmetic and recursion proportional to field depth; invalid schema/type consistency is not checked. (rust/lance-file/src/versions/v2_0/mod.rs:38-49)

### Lines 50-67

Public data_file_columns allocates parallel Vec<i32> field IDs/column indices and traverses from signed counter0. pub(super) field_id_to_column_index consumes zipped vectors, casts both IDs and indices to u32 and collects BTreeMap; duplicate IDs keep the later entry, negative IDs are not rejected. This map is a projection lookup, not schema validation. (rust/lance-file/src/versions/v2_0/mod.rs:50-67)

### Lines 68-83

Private append_physical_fields appends each field before descendants, increments signed i32 column counter, recurses except for Blob/packed struct. Root and sibling order are preserved; empty schema gives empty vectors. No checked overflow, ID assignment, capacity estimate or cycle/depth guard is added. (rust/lance-file/src/versions/v2_0/mod.rs:68-83)

### Lines 84-104

Private is_external_metadata_structural_header walks the same physical traversal until target column. At the match return logical_type.is_struct() && !is_packed_struct(); there is no explicit !is_blob() in the match classification. Otherwise increment usize cursor and recurse only for non-Blob/nonpacked fields. Out-of-range target returns None. The search mutates only its local cursor and returns immediately on match. (rust/lance-file/src/versions/v2_0/mod.rs:84-104)

### Lines 105-116

pub(super) should_copy_external_metadata_column defaults missing target classification to false; return !is_header || !has_existing_pages. Thus a recognized ordinary structural header with existing pages is skipped; first header and every nonheader or unknown column is copied. Repeated calls rescan schema; no column bounds error is emitted. (rust/lance-file/src/versions/v2_0/mod.rs:105-116)

### Lines 117-133

pub(super) finalize_external_metadata_column rescans classification. If header and pages nonempty, replace only first page num_rows with supplied u64 and priority with0, then truncate to one page. Encoding and buffer descriptors of first page survive; later page metadata drops. Empty pages/nonheader/out-of-range target stay unchanged. It returns unit, does not validate row count, fetch/copy data, or rollback prior writes. (rust/lance-file/src/versions/v2_0/mod.rs:117-133)

### Lines 134-147

Public encoding_strategy allocates ArrayFieldEncodingStrategy::new behind Arc<dyn FieldEncodingStrategy>, without CompressionParams. create_writer consumes object writer/schema/options and directly propagates Writer::try_new result; concrete validation and ownership cleanup are delegated. (rust/lance-file/src/versions/v2_0/mod.rs:134-147)

### Lines 148-155

Public create_lazy_writer consumes object writer/options and returns Writer::new_lazy without Result. Documentation says first batch supplies schema; no inference is performed in this wrapper. (rust/lance-file/src/versions/v2_0/mod.rs:148-155)

### Lines 156-164

Public encode_self_described_batch and encode_mini_batch borrow EncodedBatch and delegate writer::concat_lance_footer with true/false respectively, returning Result<Bytes>. They do not locally validate EncodedBatch, inspect file version or write an object. No inline tests or unsafe code occur in this module. (rust/lance-file/src/versions/v2_0/mod.rs:156-164)

## Interaction and interpretation limits

Every physical line was read in ANALYZE53. No source execution/build/test was performed. Exact current-version reader/writer bodies are analyzed; delegated compression/encoder helper internals remain pending; delegated calls are not evidence of their full behavior. 

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Lance v2.0 file composition.
    5 | 
    6 | use std::{collections::BTreeMap, sync::Arc};
    7 | 
    8 | use bytes::Bytes;
    9 | use lance_core::{
   10 |     Result,
   11 |     datatypes::{Field, Schema},
   12 | };
   13 | use lance_encoding::{
   14 |     decoder::PageInfo,
   15 |     encoder::{ArrayFieldEncodingStrategy, EncodedBatch, FieldEncodingStrategy},
   16 | };
   17 | use lance_io::traits::Writer as ObjectWriter;
   18 | 
   19 | use crate::{reader::ReadProjection, writer::FileWriterOptions};
   20 | 
   21 | mod reader;
   22 | mod writer;
   23 | 
   24 | #[cfg(test)]
   25 | pub(crate) use reader::test_projection_length;
   26 | pub(crate) use reader::{
   27 |     decode_column_metadata, finish_metadata, finish_metadata_index, validate_global_buffers,
   28 | };
   29 | pub use reader::{
   30 |     projection_from_column_names, projection_from_field_ids, projection_from_whole_schema,
   31 | };
   32 | pub use writer::Writer;
   33 | 
   34 | pub(crate) fn read_projection() -> Arc<dyn ReadProjection> {
   35 |     reader::read_projection()
   36 | }
   37 | 
   38 | /// Count physical columns represented by a field in a v2.0 footer.
   39 | pub fn physical_column_count(field: &Field) -> usize {
   40 |     if field.is_blob() || field.is_packed_struct() {
   41 |         1
   42 |     } else {
   43 |         1 + field
   44 |             .children
   45 |             .iter()
   46 |             .map(physical_column_count)
   47 |             .sum::<usize>()
   48 |     }
   49 | }
   50 | 
   51 | /// Build persisted field-to-column entries for a v2.0 data file.
   52 | pub fn data_file_columns(schema: &Schema) -> (Vec<i32>, Vec<i32>) {
   53 |     let mut field_ids = Vec::new();
   54 |     let mut column_indices = Vec::new();
   55 |     append_physical_fields(&schema.fields, &mut field_ids, &mut column_indices, &mut 0);
   56 |     (field_ids, column_indices)
   57 | }
   58 | 
   59 | pub(super) fn field_id_to_column_index(schema: &Schema) -> BTreeMap<u32, u32> {
   60 |     let (field_ids, column_indices) = data_file_columns(schema);
   61 |     field_ids
   62 |         .into_iter()
   63 |         .zip(column_indices)
   64 |         .map(|(field_id, column_index)| (field_id as u32, column_index as u32))
   65 |         .collect()
   66 | }
   67 | 
   68 | fn append_physical_fields(
   69 |     fields: &[Field],
   70 |     field_ids: &mut Vec<i32>,
   71 |     column_indices: &mut Vec<i32>,
   72 |     next_column: &mut i32,
   73 | ) {
   74 |     for field in fields {
   75 |         field_ids.push(field.id);
   76 |         column_indices.push(*next_column);
   77 |         *next_column += 1;
   78 |         if !field.is_blob() && !field.is_packed_struct() {
   79 |             append_physical_fields(&field.children, field_ids, column_indices, next_column);
   80 |         }
   81 |     }
   82 | }
   83 | 
   84 | fn is_external_metadata_structural_header(
   85 |     fields: &[Field],
   86 |     target_column: usize,
   87 |     next_column: &mut usize,
   88 | ) -> Option<bool> {
   89 |     for field in fields {
   90 |         if *next_column == target_column {
   91 |             return Some(field.logical_type.is_struct() && !field.is_packed_struct());
   92 |         }
   93 |         *next_column += 1;
   94 |         if !field.is_blob()
   95 |             && !field.is_packed_struct()
   96 |             && let Some(is_header) =
   97 |                 is_external_metadata_structural_header(&field.children, target_column, next_column)
   98 |         {
   99 |             return Some(is_header);
  100 |         }
  101 |     }
  102 |     None
  103 | }
  104 | 
  105 | pub(super) fn should_copy_external_metadata_column(
  106 |     schema: &Schema,
  107 |     column_index: usize,
  108 |     has_existing_pages: bool,
  109 | ) -> bool {
  110 |     let mut next_column = 0;
  111 |     let is_header =
  112 |         is_external_metadata_structural_header(&schema.fields, column_index, &mut next_column)
  113 |             .unwrap_or(false);
  114 |     !is_header || !has_existing_pages
  115 | }
  116 | 
  117 | pub(super) fn finalize_external_metadata_column(
  118 |     schema: &Schema,
  119 |     column_index: usize,
  120 |     pages: &mut Vec<PageInfo>,
  121 |     num_rows: u64,
  122 | ) {
  123 |     let mut next_column = 0;
  124 |     let is_header =
  125 |         is_external_metadata_structural_header(&schema.fields, column_index, &mut next_column)
  126 |             .unwrap_or(false);
  127 |     if is_header && !pages.is_empty() {
  128 |         pages[0].num_rows = num_rows;
  129 |         pages[0].priority = 0;
  130 |         pages.truncate(1);
  131 |     }
  132 | }
  133 | 
  134 | /// Compose the v2.0 field encoding mechanisms.
  135 | pub fn encoding_strategy() -> Arc<dyn FieldEncodingStrategy> {
  136 |     Arc::new(ArrayFieldEncodingStrategy::new())
  137 | }
  138 | 
  139 | /// Create a v2.0 writer with an explicit schema.
  140 | pub fn create_writer(
  141 |     object_writer: Box<dyn ObjectWriter>,
  142 |     schema: Schema,
  143 |     options: FileWriterOptions,
  144 | ) -> Result<Writer> {
  145 |     Writer::try_new(object_writer, schema, options)
  146 | }
  147 | 
  148 | /// Create a v2.0 writer whose schema is inferred from the first batch.
  149 | pub fn create_lazy_writer(
  150 |     object_writer: Box<dyn ObjectWriter>,
  151 |     options: FileWriterOptions,
  152 | ) -> Writer {
  153 |     Writer::new_lazy(object_writer, options)
  154 | }
  155 | 
  156 | /// Encode a self-described v2.0 batch.
  157 | pub fn encode_self_described_batch(batch: &EncodedBatch) -> Result<Bytes> {
  158 |     writer::concat_lance_footer(batch, true)
  159 | }
  160 | 
  161 | /// Encode a mini-lance v2.0 batch.
  162 | pub fn encode_mini_batch(batch: &EncodedBatch) -> Result<Bytes> {
  163 |     writer::concat_lance_footer(batch, false)
  164 | }
``````
