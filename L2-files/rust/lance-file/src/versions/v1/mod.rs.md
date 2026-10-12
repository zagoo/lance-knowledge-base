> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-file/src/versions/v1/mod.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `2643d674057a1b50f88b0f3d08b87816e1c922fd383ea12f1c733894c751e1bd`. Reviewed physical lines: 1-116.

[Module](../../../../../../L1-modules/rust-lance-file-v1-foundation.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Public frozen V1 module facade and physical-column projection/mapping helpers. Declares encoding, format, page_table, reader and writer; maps core Field/Schema trees to shared ReaderProjection without IO or modern metadata grammar. (rust/lance-file/src/versions/v1/mod.rs:1-116)

## Complete range analysis

### Lines 1-24

SPDX and module documentation identify the canonical V1 reader/writer/metadata/page-table home, historical accepted footer identities(0,0..=2) and emitted(0,2). Those numbers are a declared contract here; exact version parsing/constants and writer call sites are elsewhere. Five child modules are public. BTreeMap, Arc, core Field/Schema/Result and shared ReaderProjection are the local dependencies. (rust/lance-file/src/versions/v1/mod.rs:1-24)

### Lines 25-39

Private append_field_ids walks supplied fields preorder. Cast each signed field.id to u32, append a mapped column if present, silently skip an unmapped node, then recurse into children unless the node is Blob or packed struct. A missing parent does not block ordinary children. Supplied map values are neither bounds-checked nor deduplicated; negative IDs wrap to u32. Blob/packed descendants never contribute separately. (rust/lance-file/src/versions/v1/mod.rs:25-39)

### Lines 40-55

Public projection_from_field_ids allocates an index vector, uses the above traversal, and clones the supplied Schema into a fresh Arc. This follows the derived Clone implementations of Schema, Field and Dictionary; loaded dictionary ArrayRef members retain shared array storage, so this is not a promise to copy all backing data (rust/lance-core/src/datatypes/schema.rs:24-31; rust/lance-core/src/datatypes/field.rs:134-161; rust/lance-core/src/datatypes.rs:561-568). It returns ReaderProjection directly, even for empty schema/indices, absent mappings or repeated physical values. It preserves the full supplied schema rather than removing unmapped fields; validation is a consumer responsibility. No IO or fallible Result. (rust/lance-file/src/versions/v1/mod.rs:40-55)

### Lines 56-59

projection_from_whole_schema builds the private full-schema ID-to-column map, then applies the same projection helper. Map creation uses two temporary vectors and a BTreeMap; duplicated field IDs collapse to the last assigned column in the map and may be repeated again in traversal. This is not a one-to-one mapping validator. (rust/lance-file/src/versions/v1/mod.rs:56-59)

### Lines 60-71

projection_from_column_names builds physical mapping from the original full schema before calling Schema::project. Projection errors propagate; otherwise compute indices from projected preorder using original physical columns. It does not renumber the selected subset or validate uniqueness/bounds beyond delegated schema projection. (rust/lance-file/src/versions/v1/mod.rs:60-71)

### Lines 72-84

physical_column_count returns1 for any Blob or packed struct without visiting descendants; otherwise returns1 plus recursive child counts. Ordinary struct/container parents count even when they have no data page. Addition/sum are unchecked usize arithmetic; recursive depth is not bounded. (rust/lance-file/src/versions/v1/mod.rs:72-84)

### Lines 85-92

data_file_columns creates parallel Vec<i32> IDs/indices and calls private preorder appender with a temporary counter0. Empty schema yields two empty vectors. Field IDs remain their original signed values, while physical indices are assigned consecutively. (rust/lance-file/src/versions/v1/mod.rs:85-92)

### Lines 93-101

Private field_id_to_column_index zips the parallel vectors, casts both sides to u32 and collects BTreeMap. Duplicate IDs overwrite earlier entries; negative IDs/overflowed signed columns are not rejected. The map is only a projection helper, not persisted itself here. (rust/lance-file/src/versions/v1/mod.rs:93-101)

### Lines 102-116

append_physical_fields emits every visited node ID and current physical counter before ordinary i32 increment and recursive descent. Blob/packed struct stop recursion; other parent/child nodes each occupy a slot. No overflow, duplicate-ID, negative-ID or schema validation. File ends without a local test module; compatibility/projection tests in other analyzed files do not constitute exhaustive edge-case coverage of these helpers. (rust/lance-file/src/versions/v1/mod.rs:102-116)

## Interaction and interpretation limits

All physical lines of this file were read during ANALYZE60. Tests were inspected, not executed. Source remains read-only and offline; no build, test, benchmark, fixture generation or dependency installation was run. Frozen V1 behavior is recorded for compatibility, not proposed as the basis for new features. Concrete V1 binary/plain/dictionary codecs are now analyzed; full V1 reader is now analyzed; V1 statistics are fully analyzed; narrow external caller/helper context is recorded separately. Arithmetic, malformed-input, allocation and cancellation consequences are source-level observations, not executed reproductions. No unsafe block or global mutable state is declared in this file.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Lance v1 file implementation.
    5 | //!
    6 | //! This module is the canonical home of the v1 reader, writer, metadata, and
    7 | //! page-table grammar. V1 accepts footer versions `(0, 0)` through `(0, 2)` and
    8 | //! writes the `(0, 2)` identity used by [`writer::FileWriter`].
    9 | 
   10 | pub mod encoding;
   11 | pub mod format;
   12 | pub mod page_table;
   13 | pub mod reader;
   14 | pub mod writer;
   15 | 
   16 | use std::{collections::BTreeMap, sync::Arc};
   17 | 
   18 | use lance_core::{
   19 |     Result,
   20 |     datatypes::{Field, Schema},
   21 | };
   22 | 
   23 | use crate::reader::ReaderProjection;
   24 | 
   25 | fn append_field_ids(
   26 |     fields: &[Field],
   27 |     field_id_to_column_index: &BTreeMap<u32, u32>,
   28 |     column_indices: &mut Vec<u32>,
   29 | ) {
   30 |     for field in fields {
   31 |         if let Some(column_index) = field_id_to_column_index.get(&(field.id as u32)).copied() {
   32 |             column_indices.push(column_index);
   33 |         }
   34 |         if !field.is_blob() && !field.is_packed_struct() {
   35 |             append_field_ids(&field.children, field_id_to_column_index, column_indices);
   36 |         }
   37 |     }
   38 | }
   39 | 
   40 | pub fn projection_from_field_ids(
   41 |     schema: &Schema,
   42 |     field_id_to_column_index: &BTreeMap<u32, u32>,
   43 | ) -> ReaderProjection {
   44 |     let mut column_indices = Vec::new();
   45 |     append_field_ids(
   46 |         &schema.fields,
   47 |         field_id_to_column_index,
   48 |         &mut column_indices,
   49 |     );
   50 |     ReaderProjection {
   51 |         schema: Arc::new(schema.clone()),
   52 |         column_indices,
   53 |     }
   54 | }
   55 | 
   56 | pub fn projection_from_whole_schema(schema: &Schema) -> ReaderProjection {
   57 |     projection_from_field_ids(schema, &field_id_to_column_index(schema))
   58 | }
   59 | 
   60 | pub fn projection_from_column_names(
   61 |     schema: &Schema,
   62 |     column_names: &[&str],
   63 | ) -> Result<ReaderProjection> {
   64 |     let field_id_to_column_index = field_id_to_column_index(schema);
   65 |     let projected = schema.project(column_names)?;
   66 |     Ok(projection_from_field_ids(
   67 |         &projected,
   68 |         &field_id_to_column_index,
   69 |     ))
   70 | }
   71 | 
   72 | /// Count physical columns represented by a field in a v1 footer.
   73 | pub fn physical_column_count(field: &Field) -> usize {
   74 |     if field.is_blob() || field.is_packed_struct() {
   75 |         1
   76 |     } else {
   77 |         1 + field
   78 |             .children
   79 |             .iter()
   80 |             .map(physical_column_count)
   81 |             .sum::<usize>()
   82 |     }
   83 | }
   84 | 
   85 | /// Build persisted field-to-column entries for a v1 data file.
   86 | pub fn data_file_columns(schema: &Schema) -> (Vec<i32>, Vec<i32>) {
   87 |     let mut field_ids = Vec::new();
   88 |     let mut column_indices = Vec::new();
   89 |     append_physical_fields(&schema.fields, &mut field_ids, &mut column_indices, &mut 0);
   90 |     (field_ids, column_indices)
   91 | }
   92 | 
   93 | fn field_id_to_column_index(schema: &Schema) -> BTreeMap<u32, u32> {
   94 |     let (field_ids, column_indices) = data_file_columns(schema);
   95 |     field_ids
   96 |         .into_iter()
   97 |         .zip(column_indices)
   98 |         .map(|(field_id, column_index)| (field_id as u32, column_index as u32))
   99 |         .collect()
  100 | }
  101 | 
  102 | fn append_physical_fields(
  103 |     fields: &[Field],
  104 |     field_ids: &mut Vec<i32>,
  105 |     column_indices: &mut Vec<i32>,
  106 |     next_column: &mut i32,
  107 | ) {
  108 |     for field in fields {
  109 |         field_ids.push(field.id);
  110 |         column_indices.push(*next_column);
  111 |         *next_column += 1;
  112 |         if !field.is_blob() && !field.is_packed_struct() {
  113 |             append_physical_fields(&field.children, field_ids, column_indices, next_column);
  114 |         }
  115 |     }
  116 | }
``````
