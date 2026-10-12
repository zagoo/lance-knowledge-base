> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-file/src/writer/field_types.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `fa1684669968637e7e98904b50b3c2c7567cedab335b2f11c9b5b4c7e03f8d24`. Reviewed physical lines: 1-193.

[Module](../../../../../L1-modules/rust-lance-file-runtime.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Shared crate-internal writer type/extension checker, with publicly reexported FieldTypeMismatch diagnostic. Caller conversion and encoder nullability/missing-column checks stay separate. (rust/lance-file/src/writer/field_types.rs:1-193)

## Complete range analysis

### Lines 1-20

SPDX/module docs explain rejecting input Arrow type/extension drift before encoding because schema controls readers; callers must convert representations such as JSON text to JSONB. Imports formatting/Arc, Arrow arrays/schema and Blob-v2 extension name, core errors/schema. No conversion or page encoding occurs here. (rust/lance-file/src/writer/field_types.rs:1-20)

### Lines 21-36

Publicly reexported Debug/Clone/PartialEq/Eq FieldTypeMismatch owns dot-separated expected-field path and expected/actual FieldRef Arcs, both public. Bare columns have no top-level extension metadata. This diagnostic is stored as InvalidInput source, not a separate top-level core error variant. (rust/lance-file/src/writer/field_types.rs:21-36)

### Lines 37-50

Display writes field path plus formatted expected/actual types using FieldType helper. Standard Error is implemented with default source behavior; no nested cause here. Cloned diagnostics share FieldRef allocations. (rust/lance-file/src/writer/field_types.rs:37-50)

### Lines 51-66

Private FieldType displays Arrow datatype, then extension name and metadata when both present, just name if metadata absent, otherwise no extension. Metadata without a name is rendered as no extension even though the checker can compare that metadata option. Formatting errors propagate. (rust/lance-file/src/writer/field_types.rs:51-66)

### Lines 67-86

ExpectedTypes is public inside a private module and reexported only pub(crate). It owns expected Arrow fields converted once from core Schema and optional last accepted SchemaRef. new clones/converts each field, starts accepted=None. Core conversion may normalize/add extension metadata (rust/lance-core/src/datatypes/field.rs:1327-1347); this constructor has no Result. (rust/lance-file/src/writer/field_types.rs:67-86)

### Lines 87-114

check_batch compares accepted.as_ref()==Some(&batch.schema()), using Arc/Schema value equality rather than only pointer identity. Equal accepted schema returns immediately. Otherwise for every expected field prefer same-position actual with matching name, else search schema by name. If present recursively check type/extensions; missing fields are skipped for encoders, extra fields ignored. Only successful complete loop replaces accepted; failure leaves previous accepted schema. The method reads batch schema, not array values/nulls, relying on RecordBatch consistency. Reordered-name fallback can cost quadratic name searches on wide schemas. (rust/lance-file/src/writer/field_types.rs:87-114)

### Lines 115-130

check_column indexes expected fields directly (invalid index panics in this helper), creates nullable=true ArrowField with expected name and array datatype but no field metadata, then calls check_field(compare_extension=false). Top-level extension identity is intentionally not compared; nested children are compared recursively. No accepted-schema cache update. Contextual concrete writers validate column index before calling this helper. (rust/lance-file/src/writer/field_types.rs:115-130)

### Lines 131-146

into_error wraps mismatch in Box as core Error::invalid_input_source, preserving downcastable diagnostic. Recursive private check_field returns Result<(),FieldTypeMismatch>; mismatch closure captures expected name and clones expected/actual Arcs. Docs say nested names/nullability are not compared because encoders address by position and check null values separately. (rust/lance-file/src/writer/field_types.rs:131-146)

### Lines 147-161

When compare_extension=true, differing extension-name OR extension-metadata Option returns mismatch before datatype checks. For Struct/Struct with expected Blob-v2 extension, immediately succeed after that gate, ignoring child count/types/names. Docs delegate preprocessed descriptor validation to blob encoder. Bare-column mode skips the outer extension gate but still gets this Blob structural exception. (rust/lance-file/src/writer/field_types.rs:147-161)

### Lines 162-179

Equal-length Struct children pair by position; differing lengths fall through to equality/failure. Same-kind List/LargeList and Map pair the item child recursively; Map sorted flag is ignored in this arm. FixedSizeList pairs only when sizes equal. Nested field names, nullability and ordinary non-extension metadata do not participate in these recursive comparisons. No List-vs-LargeList coercion. (rust/lance-file/src/writer/field_types.rs:162-179)

### Lines 180-185

Directional representation exceptions accept expected Utf8 with actual Utf8View and expected Binary with actual BinaryView after extension gate. Reverse direction and LargeUtf8/LargeBinary view mismatches have no special acceptance. Otherwise exact DataType equality succeeds; mismatches return diagnostic. Types outside explicit recursive arms (such as Dictionary/Union) rely on whole DataType equality, whose embedded field details can therefore be stricter than the nested-name comment. (rust/lance-file/src/writer/field_types.rs:180-185)

### Lines 186-193

Walk paired children recursively with compare_extension=true; prefix the failing path with expected parent name and propagate first failure. Successful traversal returns Ok. Dot-separated paths are not escaped and can be ambiguous when field names contain dots. Temporary child-pair Vec allocation occurs per visited composite; recursion depth follows datatype nesting. No tests in this file. (rust/lance-file/src/writer/field_types.rs:186-193)

## Interaction and interpretation limits

All193 lines read. Local checker semantics are complete, not full writer validation. Observed calls precede encoding in rust/lance-file/src/writer/structural.rs:610-630 and rust/lance-file/src/versions/v2_0/writer.rs:458-468; nullability/array preparation is separate. writer_tests.rs and all exact current writer callers are now analyzed; delegated encoders and backend lifecycle remains pending.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Checks that arrays handed to a file writer have the Arrow types recorded in
    5 | //! the file schema.
    6 | //!
    7 | //! The file schema is what readers use to decode a column, so an array whose
    8 | //! type or extension differs from it is written in a layout the file does not
    9 | //! describe. Callers own any conversion from their input representation (for
   10 | //! example Arrow JSON text to Lance JSONB); this check only rejects arrays that
   11 | //! skipped it, before any page is encoded.
   12 | 
   13 | use std::fmt;
   14 | use std::sync::Arc;
   15 | 
   16 | use arrow_array::{ArrayRef, RecordBatch};
   17 | use arrow_schema::{DataType, Field as ArrowField, FieldRef, SchemaRef};
   18 | use lance_arrow::BLOB_V2_EXT_NAME;
   19 | use lance_core::{Error, Result, datatypes::Schema};
   20 | 
   21 | /// An array whose Arrow type or extension differs from the field the file
   22 | /// schema records for it.
   23 | ///
   24 | /// Returned as the source of an [`Error::InvalidInput`] by the file writers.
   25 | #[derive(Debug, Clone, PartialEq, Eq)]
   26 | pub struct FieldTypeMismatch {
   27 |     /// Dot-separated path of the mismatched field, starting at the top-level
   28 |     /// column.
   29 |     pub field_path: String,
   30 |     /// The field the file schema records.
   31 |     pub expected: FieldRef,
   32 |     /// The field the input carries. A column written on its own is a bare
   33 |     /// array, so it carries no extension.
   34 |     pub actual: FieldRef,
   35 | }
   36 | 
   37 | impl fmt::Display for FieldTypeMismatch {
   38 |     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
   39 |         write!(
   40 |             f,
   41 |             "field `{}` does not match the file schema: expected {}, got {}",
   42 |             self.field_path,
   43 |             FieldType(&self.expected),
   44 |             FieldType(&self.actual)
   45 |         )
   46 |     }
   47 | }
   48 | 
   49 | impl std::error::Error for FieldTypeMismatch {}
   50 | 
   51 | struct FieldType<'a>(&'a ArrowField);
   52 | 
   53 | impl fmt::Display for FieldType<'_> {
   54 |     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
   55 |         write!(f, "{}", self.0.data_type())?;
   56 |         match (
   57 |             self.0.extension_type_name(),
   58 |             self.0.extension_type_metadata(),
   59 |         ) {
   60 |             (Some(name), Some(metadata)) => write!(f, " (extension {name}, metadata {metadata})"),
   61 |             (Some(name), None) => write!(f, " (extension {name})"),
   62 |             _ => write!(f, " (no extension)"),
   63 |         }
   64 |     }
   65 | }
   66 | 
   67 | /// The Arrow fields a file schema expects, built once per writer.
   68 | pub struct ExpectedTypes {
   69 |     fields: Vec<FieldRef>,
   70 |     /// The last batch schema that passed. Batches of one stream normally share
   71 |     /// a schema, so later batches are accepted without walking it again.
   72 |     accepted: Option<SchemaRef>,
   73 | }
   74 | 
   75 | impl ExpectedTypes {
   76 |     pub fn new(schema: &Schema) -> Self {
   77 |         Self {
   78 |             fields: schema
   79 |                 .fields
   80 |                 .iter()
   81 |                 .map(|field| Arc::new(ArrowField::from(field)))
   82 |                 .collect(),
   83 |             accepted: None,
   84 |         }
   85 |     }
   86 | 
   87 |     /// Check every column of `batch` that the file schema writes.
   88 |     ///
   89 |     /// Columns are matched by name, the same way the encoders select them. A
   90 |     /// missing column is left for the encoder to report.
   91 |     pub fn check_batch(&mut self, batch: &RecordBatch) -> Result<()> {
   92 |         let batch_schema = batch.schema();
   93 |         if self.accepted.as_ref() == Some(&batch_schema) {
   94 |             return Ok(());
   95 |         }
   96 |         for (index, expected) in self.fields.iter().enumerate() {
   97 |             // Batches usually list columns in schema order; only fall back to
   98 |             // a name search when they do not, so wide schemas stay linear.
   99 |             let actual = batch_schema
  100 |                 .fields()
  101 |                 .get(index)
  102 |                 .filter(|actual| actual.name() == expected.name())
  103 |                 .or_else(|| {
  104 |                     let (index, _) = batch_schema.column_with_name(expected.name())?;
  105 |                     batch_schema.fields().get(index)
  106 |                 });
  107 |             if let Some(actual) = actual {
  108 |                 check_field(expected, actual, true).map_err(into_error)?;
  109 |             }
  110 |         }
  111 |         self.accepted = Some(batch_schema);
  112 |         Ok(())
  113 |     }
  114 | 
  115 |     /// Check an array written to the top-level column at `index`.
  116 |     ///
  117 |     /// A bare array carries no field metadata, so the column's own extension
  118 |     /// is not compared; nested extensions live in the array's data type and
  119 |     /// are.
  120 |     pub fn check_column(&self, index: usize, array: &ArrayRef) -> Result<()> {
  121 |         let expected = &self.fields[index];
  122 |         let actual = Arc::new(ArrowField::new(
  123 |             expected.name(),
  124 |             array.data_type().clone(),
  125 |             true,
  126 |         ));
  127 |         check_field(expected, &actual, false).map_err(into_error)
  128 |     }
  129 | }
  130 | 
  131 | fn into_error(mismatch: FieldTypeMismatch) -> Error {
  132 |     Error::invalid_input_source(Box::new(mismatch))
  133 | }
  134 | 
  135 | /// Names and nullability of nested fields are not compared: the encoders
  136 | /// address children by position and verify nulls against the values.
  137 | fn check_field(
  138 |     expected: &FieldRef,
  139 |     actual: &FieldRef,
  140 |     compare_extension: bool,
  141 | ) -> std::result::Result<(), FieldTypeMismatch> {
  142 |     let mismatch = || FieldTypeMismatch {
  143 |         field_path: expected.name().clone(),
  144 |         expected: expected.clone(),
  145 |         actual: actual.clone(),
  146 |     };
  147 |     if compare_extension
  148 |         && (expected.extension_type_name() != actual.extension_type_name()
  149 |             || expected.extension_type_metadata() != actual.extension_type_metadata())
  150 |     {
  151 |         return Err(mismatch());
  152 |     }
  153 |     let children = match (expected.data_type(), actual.data_type()) {
  154 |         // The file schema records the Blob v2 struct users write, but blob
  155 |         // preprocessing hands the encoder a descriptor struct, which the blob
  156 |         // encoder validates itself.
  157 |         (DataType::Struct(_), DataType::Struct(_))
  158 |             if expected.extension_type_name() == Some(BLOB_V2_EXT_NAME) =>
  159 |         {
  160 |             return Ok(());
  161 |         }
  162 |         (DataType::Struct(expected_children), DataType::Struct(actual_children))
  163 |             if expected_children.len() == actual_children.len() =>
  164 |         {
  165 |             expected_children
  166 |                 .iter()
  167 |                 .zip(actual_children.iter())
  168 |                 .collect()
  169 |         }
  170 |         (DataType::List(expected_item), DataType::List(actual_item))
  171 |         | (DataType::LargeList(expected_item), DataType::LargeList(actual_item))
  172 |         | (DataType::Map(expected_item, _), DataType::Map(actual_item, _)) => {
  173 |             vec![(expected_item, actual_item)]
  174 |         }
  175 |         (
  176 |             DataType::FixedSizeList(expected_item, expected_size),
  177 |             DataType::FixedSizeList(actual_item, actual_size),
  178 |         ) if expected_size == actual_size => vec![(expected_item, actual_item)],
  179 |         // The encoders write view arrays in the equivalent offset layout.
  180 |         (DataType::Utf8, DataType::Utf8View) | (DataType::Binary, DataType::BinaryView) => {
  181 |             return Ok(());
  182 |         }
  183 |         (expected_type, actual_type) if expected_type == actual_type => return Ok(()),
  184 |         _ => return Err(mismatch()),
  185 |     };
  186 |     for (expected_child, actual_child) in children {
  187 |         check_field(expected_child, actual_child, true).map_err(|mut mismatch| {
  188 |             mismatch.field_path = format!("{}.{}", expected.name(), mismatch.field_path);
  189 |             mismatch
  190 |         })?;
  191 |     }
  192 |     Ok(())
  193 | }
``````
