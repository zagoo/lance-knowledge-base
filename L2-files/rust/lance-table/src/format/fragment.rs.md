> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/format/fragment.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `469c87b357e1bbfd21242186c04f21ae8d25f1eae362f844f001bf8d3fd486de`. Reviewed physical lines: 1-1252.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Data-file and fragment metadata, schema projection, deduplicated manifest conversion, lineage-carrier validation and protobuf/JSON boundaries. Public declarations are reexported by format; this is metadata logic, not a dataset reader or writer. (rust/lance-table/src/format/fragment.rs:1-1252)

## Complete range analysis

### Lines 1-27

SPDX and dependencies: HashMap, NonZero, Arc; core Error/Result/DeepSizeOf/Schema; ConcreteFileVersion, CachedFileSize, object-store Path and serde; overlay sorting/tombstone, row-ID constants/metadata and row-version converters. Implementations of file-version parsing, cached size and overlay/version codecs lie outside this file. (rust/lance-table/src/format/fragment.rs:1-27)

### Lines 28-62

DataFile derives Debug/Clone/PartialEq/Eq/DeepSizeOf with public path:String, fields/column_indices:Arc<[i32]>, major/minor:u32, CachedFileSize and optional base_id:u32. fields identify schema IDs; column_indices map corresponding positions, with -1 meaning no top-level column and extra unassociated columns allowed. Shared Arc arrays reduce duplicate owned lists; no size saving was measured. path is documented relative to dataset root, with base_id for external data. (rust/lance-table/src/format/fragment.rs:28-62)

### Lines 63-78

Custom Serialize emits exactly seven named fields: path, fields, column_indices, file_major_version, file_minor_version, file_size_bytes, base_id. Arc arrays serialize as slices, making JSON arrays transparent; serializer errors propagate. It does not sort, validate or omit None base IDs. (rust/lance-table/src/format/fragment.rs:63-78)

### Lines 79-108

Deserialize uses a local DataFileHelper: path/fields, Vec column_indices default empty, major/minor default zero, CachedFileSize and Option base_id. Moves vectors into new Arc slices, preserving other values. No validate/file_version call occurs, so serde decoding is not metadata validation or interning. (rust/lance-table/src/format/fragment.rs:79-108)

### Lines 109-144

new takes explicit ConcreteFileVersion, converts it via to_data_file_numbers, moves path/vectors into String/Arc, wraps Option<NonZero<u64>> in CachedFileSize and preserves base_id. new_unstarted uses exact version but empty field/column lists, default size and no base. Neither constructor validates array lengths or field ordering. (rust/lance-table/src/format/fragment.rs:109-144)

### Lines 145-170

Legacy constructors are frozen compatibility helpers: new_legacy_from_fields forwards supplied IDs unchanged with empty columns, V1 and unknown size; new_legacy obtains all schema IDs, sorts them (without deduplication), then forwards V1 plus supplied size/base. Their existence does not establish current writer usage. (rust/lance-table/src/format/fragment.rs:145-170)

### Lines 171-216

schema nested project_field treats blob/packed struct as atomic: clone entire field only if its own ID is mapped. Otherwise recursively projects children; any surviving children retain a cloned parent even if parent ID is absent. A leaf survives only if mapped. With no surviving children, V2.0 alone retains a mapped structural parent with empty children, preserving its physical header. Comments explain evolved child IDs must not be substituted from current schema; actual null filling belongs to a reader outside this file. (rust/lance-table/src/format/fragment.rs:171-216)

### Lines 217-240

V1-encoding metadata projects by IDs with include_all_children=false. Other encodings build HashMap from zipped fields/column_indices, keep only indices>=0, and recurse over full schema in its existing order, cloning schema metadata. Zip stops at the shorter list, duplicate IDs collapse in the map, negative columns are ignored and extra columns have no field mapping. Exact raw pairs (0,3) or (2,0) activate V2.0 structural-header retention; no full version validation is performed here. (rust/lance-table/src/format/fragment.rs:217-240)

### Lines 241-252

Private uses_v1_data_file_encoding is exactly major==0 && minor<3; it is a local layout predicate, not the general version parser. Public file_version delegates both stored numbers to ConcreteFileVersion::from_data_file_numbers and propagates its errors. Exact mapping is now covered at rust/lance-file/src/version.rs:198-224. (rust/lance-table/src/format/fragment.rs:241-252)

### Lines 253-281

validate checks only two shape rules. For V1 encoding, remove every TOMBSTONE_FIELD_ID then require strictly increasing live IDs (no duplicates); failure is CorruptFile at base_path.join(path) with unsorted/duplicate message. For other encodings require columns.len>=fields.len; extra columns accepted, failure contextual CorruptFile. It does not verify exact file version, nonnegative values, file existence, row count, base IDs or column uniqueness/range. V1 branch allocates a live-ID Vec. (rust/lance-table/src/format/fragment.rs:253-281)

### Lines 282-311

DataFile to protobuf clones path and copies both Arc slices to Vec, preserves exact numbers/base, and writes cached size as value or zero. TryFrom protobuf moves path, creates fresh Arc slices, wraps raw size using CachedFileSize::new and always returns Ok; no validation. Size-zero interpretation belongs to CachedFileSize implementation, not an error here. (rust/lance-table/src/format/fragment.rs:282-311)

### Lines 312-338

Default DataFileFieldInterner holds separate caches for field IDs and column indices plus one shared cache for inline created/updated version bytes. Private InternCache<T:Eq+Hash+Clone> is Small(Vec<Arc<[T]>>) or Large(HashMap<Arc<[T]>,()>), threshold16. Documentation claims multi-GB savings at20M fragments and a favorable linear-scan crossover for20-200-byte payloads; these are source assertions, not measured results. (rust/lance-table/src/format/fragment.rs:312-338)

### Lines 339-377

InternCache starts Small(empty). Small scans for content equality and returns a cloned existing Arc; on miss converts Vec to Arc, inserts a clone, and promotes only when unique entries exceed16 (the17th miss). Promotion drains all stored Arcs into a HashMap. Large performs borrowed slice lookup, returning stored Arc or inserting new Arc. Caches grow without eviction; no interning across the two separate i32 caches. Lookup complexity is linear in unique entries and comparison length before promotion; map hashing/equality still depends on payload contents after it. (rust/lance-table/src/format/fragment.rs:339-377)

### Lines 378-410

Private row-version converters receive generated oneof directly: inline Vec bytes pass through the shared u8 cache into RowDatasetVersionMeta::Inline; column marker becomes Column. Both functions return Result but known arms all succeed; no byte decoding or column validation. The shared cache can deduplicate equal created-at and last-updated-at byte payloads. (rust/lance-table/src/format/fragment.rs:378-410)

### Lines 411-423

intern_data_file performs the same structural protobuf conversion as DataFile::try_from, but routes fields and column_indices through their respective caches. It preserves exact version numbers and base ID, wraps raw size and returns Ok without shape validation. (rust/lance-table/src/format/fragment.rs:411-423)

### Lines 424-463

intern_fragment maps physical_rows>0 to Some(as usize), otherwise None; interns updated/created inline version bytes, then all base DataFiles. Overlay entries use DataOverlayFile::try_from and sort_overlays_newest_last, without this field interner. Deletion/row-ID metadata use optional TryFrom+transpose. Inline row IDs are not routed through inline_bytes. Conversion failures propagate after any earlier cache insertions, without rollback; it does not call carrier or DataFile validation. (rust/lance-table/src/format/fragment.rs:424-463)

### Lines 464-490

DeletionFileType Array/Bitmap derives equality, serde and sizing; serde names lowercase array/bitmap, while suffix() returns arrow/bin respectively. DeletionFile contains read_version/id:u64, type, optional num_deleted_rows:usize and optional base_id:u32. Unknown deleted count is None; no path is constructed here. (rust/lance-table/src/format/fragment.rs:464-490)

### Lines 491-518

DeletionFile protobuf conversion recognizes integer type0 Array and1 Bitmap, otherwise returns not_supported_source("Unknown deletion file type") without including the offending value. Deleted count zero maps None, positive casts to usize without checked conversion. Other fields move through; no count/file validation. (rust/lance-table/src/format/fragment.rs:491-518)

### Lines 519-558

Fragment public fields: id:u64, base files Vec<DataFile>, overlays Vec<DataOverlayFile>, optional deletion/row-ID metadata, physical_rows:Option<usize>, optional updated/created row-version metadata. Docs define one fragment as different columns of the same rows and missing schema columns as null. Overlays have default empty serde and skip when empty; deletion/lineage options skip when None, while physical_rows remains serialized even when unknown. Overlay order is significant, later newer by contract; serde itself does not normalize it. (rust/lance-table/src/format/fragment.rs:519-558)

### Lines 559-588

new(id) constructs empty base/overlay vectors and all optional metadata None. num_rows returns physical count if no deletion file, or physical minus known deleted count if both are known, otherwise None. Contrary to the nearby comment, the subtraction branch requires a known deleted count. Subtraction is unchecked and can underflow if metadata claims more deletions than rows; no Result is returned. (rust/lance-table/src/format/fragment.rs:559-588)

### Lines 589-634

referenced_lance_files and mutable counterpart yield base DataFiles first then every overlay.data_file, without allocation/deduplication. Exhaustive destructuring intentionally forces future Fragment fields to be considered. They omit deletion files and lineage metadata objects; lineage columns residing in base files are included through those base files. The documentation still mentions external raw-byte lineage ranges, whereas current RowIdMeta variants are Inline/Column (rust/lance-table/src/format/row_ids.rs:141-156). (rust/lance-table/src/format/fragment.rs:589-634)

### Lines 635-671

has_spilled_row_lineage is OR of RowIdMeta::Column and the two RowDatasetVersionMeta::Column states. row_lineage_file(field_id) scans only base files for fields.contains(id), returns None if absent, first file if unique, or CorruptFile naming the second carrier path and fragment/field IDs if duplicated across files. It accepts arbitrary i32 input and does not reject repeated IDs within one file or inspect column_indices/metadata state. Missing carrier is not itself an error in this lookup. (rust/lance-table/src/format/fragment.rs:635-671)

### Lines 672-699

spilled_row_lineage_field_ids creates a Vec of reserved IDs in row-ID, created-at, last-updated-at order, including each only when its metadata is Column. It consults metadata, not schema/files; this is a retention requirement for consumers deciding which data files can be removed. (rust/lance-table/src/format/fragment.rs:672-699)

### Lines 700-726

crate-visible validate_row_lineage_carriers loops the spilled IDs, propagates duplicate-carrier errors, returns Internal if a carrier is missing, delegates exact version decoding, and returns Internal when decoded V1 carries a spilled column. Non-V1 versions pass this check; absent spills pass vacuously. It reads metadata only, with no IO or column-index/page/count checks. Error messages include fragment/field and V1 path; it does not invoke feature-gate support. (rust/lance-table/src/format/fragment.rs:700-726)

### Lines 727-750

from_json delegates serde_json::from_str with error conversion and no extra validation or overlay sorting. with_file_legacy creates one V1 DataFile using schema IDs, supplied physical_rows, empty overlays and absent deletion/lineage. It performs no IO. (rust/lance-table/src/format/fragment.rs:727-750)

### Lines 751-799

with_file consumes/mutates self by appending DataFile::new with explicit IDs/columns/exact version/size and base_id=None; add_file does the same through &mut self. with_physical_rows sets Some, including zero. add_file_legacy appends schema-based V1 metadata with unknown size/base. None checks count consistency or writes files. (rust/lance-table/src/format/fragment.rs:751-799)

### Lines 800-830

try_infer_version considers all referenced_lance_files across fragments, including overlays. If no referenced file exists, returns Ok(None). Otherwise parses first exact version, then parses every file (including first again) and rejects any unequal ConcreteFileVersion with InvalidInput naming both versions. It ignores manifest mixed-version capability bits and does no IO. This strict helper is used for missing-format inference, not proof all supported manifests must be homogeneous. (rust/lance-table/src/format/fragment.rs:800-830)

### Lines 831-870

Noninterning Fragment::try_from follows the same physical zero->None and overlay conversion/sorting rules, uses DataFile::try_from for bases and RowDatasetVersionMeta::try_from for created/updated instead of shared version-byte cache. Row-ID and deletion optional conversions propagate errors. It neither validates field arrays nor checks lineage carriers, stable-row flags or schema consistency. (rust/lance-table/src/format/fragment.rs:831-870)

### Lines 871-910

Fragment->protobuf maps deletion type enum, writes unknown deleted/physical counts as zero, clones inline RowIdMeta Bytes handle, emits empty RowLineageColumn marker for Column, delegates version oneofs, copies base and overlay vectors in current order. It does not sort overlays or validate; Some(0) counts lose their known-zero distinction on later decode. Other cloning/memory costs depend on nested converters. (rust/lance-table/src/format/fragment.rs:871-910)

### Lines 911-957

cfg(test) imports Arrow schemas, legacy file constants, bitmap/JSON helpers. Dense overlay fixture carries offsets1/3, version7 and a legacy metadata DataFile; protobuf roundtrip checks complete Fragment equality and coverage_for_field at positions0 and5 returns same bitmap. It exercises metadata conversion, not on-disk legacy overlays. (rust/lance-table/src/format/fragment.rs:911-957)

### Lines 958-984

Sparse overlay fixture with fields2/4 and coverage{2,3}/{1} roundtrips protobuf then asserts coverage by position0/1. No IO, null values, overlapping overlay resolution or feature-gate enforcement is exercised. (rust/lance-table/src/format/fragment.rs:958-984)

### Lines 985-1016

Out-of-order overlay versions5,2,2,3 roundtrip to2,2,3,5; field IDs2 then3 assert original relative order among equal-version overlays. This pins stable load ordering for ordinary Fragment conversion; interner sorting calls the same helper. (rust/lance-table/src/format/fragment.rs:985-1016)

### Lines 1017-1045

New legacy Fragment fixture builds nested struct(si:Int32,sb:Binary) plus Boolean schema, asserts fragment ID123 and single DataFile with sorted IDs0..3. It does not assert physical_rows or actual file data. (rust/lance-table/src/format/fragment.rs:1017-1045)

### Lines 1046-1068

Fragment protobuf roundtrip uses Float16 schema and Array deletion descriptor with known count10, then repeats with no deletion. Equality asserts metadata preservation for these cases only; no row-ID, zero-count or error fixture. (rust/lance-table/src/format/fragment.rs:1046-1068)

### Lines 1069-1135

Exact-version fixture checks no files->None, new/new_unstarted V2_0 persist(2,0), two V2_0 fragments infer V2_0, and V2_1 overlay/base mismatches error with2.0/2.1 context. Base mismatch also matches InvalidInput. No file bytes are generated. (rust/lance-table/src/format/fragment.rs:1069-1135)

### Lines 1136-1199

Evolved-struct fixture changes current child ID while stale files keep old child: V2_0 projection preserves empty values parent plus id, V2_1 parent index-1 projection retains only id, and current V2_0 mapped child returns full schema. This tests projection metadata, not reader null materialization or blob/packed-struct branches. (rust/lance-table/src/format/fragment.rs:1136-1199)

### Lines 1200-1233

JSON fixture pins path/field array/empty columns/legacy major-minor constants, null size/base, lowercase array deletion fields, physical_rows null and omission of empty overlays/None lineage. from_json roundtrip equals original. No malformed JSON or old release fixture is used. (rust/lance-table/src/format/fragment.rs:1200-1233)

### Lines 1234-1252

Extra-column fixture constructs two fields and three column indices, using imported lance_file::format major/minor constants, and expects validate success. This test does not set an explicit nonlegacy ConcreteFileVersion, so the source here alone does not prove it reaches the non-V1 length branch. All tests in this file were read, not executed. (rust/lance-table/src/format/fragment.rs:1234-1252)

## Interaction and interpretation limits

All1252 lines read in bounded chunks. Public facade is rust/lance-table/src/format.rs:7-25. Manifest conversion and shallow clone consumers are traced in rust/lance-table/src/format/manifest.rs:249-268 and rust/lance-table/src/format/manifest.rs:987-1021. Exact file-version, overlay and row-version implementations are now covered in their own L2 entries; CachedFileSize, cleanup and actual read/write/commit consumers remain incomplete; no runtime qualification or compatibility claim beyond source behavior.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::collections::HashMap;
    5 | use std::num::NonZero;
    6 | use std::sync::Arc;
    7 | 
    8 | use lance_core::Error;
    9 | use lance_core::deepsize::DeepSizeOf;
   10 | use lance_file::version::ConcreteFileVersion;
   11 | use lance_io::utils::CachedFileSize;
   12 | use object_store::path::Path;
   13 | use serde::{Deserialize, Deserializer, Serialize, Serializer};
   14 | 
   15 | use super::overlay::{DataOverlayFile, TOMBSTONE_FIELD_ID, sort_overlays_newest_last};
   16 | use super::row_ids::{
   17 |     ROW_CREATED_AT_VERSION_FIELD_ID, ROW_ID_FIELD_ID, ROW_LAST_UPDATED_AT_VERSION_FIELD_ID,
   18 |     RowIdMeta,
   19 | };
   20 | use crate::format::pb;
   21 | 
   22 | use crate::rowids::version::{
   23 |     RowDatasetVersionMeta, created_at_version_meta_to_pb, last_updated_at_version_meta_to_pb,
   24 | };
   25 | use lance_core::datatypes::Schema;
   26 | use lance_core::error::Result;
   27 | 
   28 | /// Lance Data File
   29 | ///
   30 | /// A data file is one piece of file storing data.
   31 | #[derive(Debug, Clone, PartialEq, Eq, DeepSizeOf)]
   32 | pub struct DataFile {
   33 |     /// Relative path of the data file to dataset root.
   34 |     pub path: String,
   35 |     /// The ids of fields in this file.
   36 |     ///
   37 |     /// When identical across many fragments (common case), multiple `DataFile`
   38 |     /// instances share a single heap allocation via `Arc`, significantly
   39 |     /// reducing manifest memory for large tables.
   40 |     pub fields: Arc<[i32]>,
   41 |     /// The offsets of the fields listed in `fields`, empty in v1 files
   42 |     ///
   43 |     /// Note that -1 is a possibility and it indicates that the field has
   44 |     /// no top-level column in the file.
   45 |     ///
   46 |     /// Columns that lack a field id may still exist as extra entries in
   47 |     /// `column_indices`; such columns are ignored by field-id–based projection.
   48 |     /// For example, some fields, such as blob fields, occupy multiple
   49 |     /// columns in the file but only have a single field id.
   50 |     pub column_indices: Arc<[i32]>,
   51 |     /// The major version of the file format used to write this file.
   52 |     pub file_major_version: u32,
   53 |     /// The minor version of the file format used to write this file.
   54 |     pub file_minor_version: u32,
   55 | 
   56 |     /// The size of the file in bytes, if known.
   57 |     pub file_size_bytes: CachedFileSize,
   58 | 
   59 |     /// The base path of the datafile, when the datafile is outside the dataset.
   60 |     pub base_id: Option<u32>,
   61 | }
   62 | 
   63 | // Custom Serialize: convert Arc<[i32]> to slice for transparent JSON output
   64 | impl Serialize for DataFile {
   65 |     fn serialize<S: Serializer>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error> {
   66 |         use serde::ser::SerializeStruct;
   67 |         let mut s = serializer.serialize_struct("DataFile", 7)?;
   68 |         s.serialize_field("path", &self.path)?;
   69 |         s.serialize_field("fields", self.fields.as_ref())?;
   70 |         s.serialize_field("column_indices", self.column_indices.as_ref())?;
   71 |         s.serialize_field("file_major_version", &self.file_major_version)?;
   72 |         s.serialize_field("file_minor_version", &self.file_minor_version)?;
   73 |         s.serialize_field("file_size_bytes", &self.file_size_bytes)?;
   74 |         s.serialize_field("base_id", &self.base_id)?;
   75 |         s.end()
   76 |     }
   77 | }
   78 | 
   79 | // Custom Deserialize: read Vec<i32> and convert to Arc<[i32]>
   80 | impl<'de> Deserialize<'de> for DataFile {
   81 |     fn deserialize<D: Deserializer<'de>>(deserializer: D) -> std::result::Result<Self, D::Error> {
   82 |         #[derive(Deserialize)]
   83 |         struct DataFileHelper {
   84 |             path: String,
   85 |             fields: Vec<i32>,
   86 |             #[serde(default)]
   87 |             column_indices: Vec<i32>,
   88 |             #[serde(default)]
   89 |             file_major_version: u32,
   90 |             #[serde(default)]
   91 |             file_minor_version: u32,
   92 |             file_size_bytes: CachedFileSize,
   93 |             base_id: Option<u32>,
   94 |         }
   95 | 
   96 |         let helper = DataFileHelper::deserialize(deserializer)?;
   97 |         Ok(Self {
   98 |             path: helper.path,
   99 |             fields: Arc::from(helper.fields),
  100 |             column_indices: Arc::from(helper.column_indices),
  101 |             file_major_version: helper.file_major_version,
  102 |             file_minor_version: helper.file_minor_version,
  103 |             file_size_bytes: helper.file_size_bytes,
  104 |             base_id: helper.base_id,
  105 |         })
  106 |     }
  107 | }
  108 | 
  109 | impl DataFile {
  110 |     /// Create a `DataFile` and encode its exact format version for manifest storage.
  111 |     pub fn new(
  112 |         path: impl Into<String>,
  113 |         fields: Vec<i32>,
  114 |         column_indices: Vec<i32>,
  115 |         file_version: ConcreteFileVersion,
  116 |         file_size_bytes: Option<NonZero<u64>>,
  117 |         base_id: Option<u32>,
  118 |     ) -> Self {
  119 |         let (file_major_version, file_minor_version) = file_version.to_data_file_numbers();
  120 |         Self {
  121 |             path: path.into(),
  122 |             fields: Arc::from(fields),
  123 |             column_indices: Arc::from(column_indices),
  124 |             file_major_version,
  125 |             file_minor_version,
  126 |             file_size_bytes: file_size_bytes.into(),
  127 |             base_id,
  128 |         }
  129 |     }
  130 | 
  131 |     /// Create a new `DataFile` whose fields and column indices will be set later.
  132 |     pub fn new_unstarted(path: impl Into<String>, file_version: ConcreteFileVersion) -> Self {
  133 |         let (file_major_version, file_minor_version) = file_version.to_data_file_numbers();
  134 |         Self {
  135 |             path: path.into(),
  136 |             fields: Arc::from([]),
  137 |             column_indices: Arc::from([]),
  138 |             file_major_version,
  139 |             file_minor_version,
  140 |             file_size_bytes: Default::default(),
  141 |             base_id: None,
  142 |         }
  143 |     }
  144 | 
  145 |     pub fn new_legacy_from_fields(
  146 |         path: impl Into<String>,
  147 |         fields: Vec<i32>,
  148 |         base_id: Option<u32>,
  149 |     ) -> Self {
  150 |         Self::new(path, fields, vec![], ConcreteFileVersion::V1, None, base_id)
  151 |     }
  152 | 
  153 |     pub fn new_legacy(
  154 |         path: impl Into<String>,
  155 |         schema: &Schema,
  156 |         file_size_bytes: Option<NonZero<u64>>,
  157 |         base_id: Option<u32>,
  158 |     ) -> Self {
  159 |         let mut field_ids = schema.field_ids();
  160 |         field_ids.sort();
  161 |         Self::new(
  162 |             path,
  163 |             field_ids,
  164 |             vec![],
  165 |             ConcreteFileVersion::V1,
  166 |             file_size_bytes,
  167 |             base_id,
  168 |         )
  169 |     }
  170 | 
  171 |     pub fn schema(&self, full_schema: &Schema) -> Schema {
  172 |         // Structural field IDs describe physical headers in V2.0 and may also
  173 |         // appear with column_index=-1 in older V2.1+ manifests. They do not, by
  174 |         // themselves, mean that every child in the current dataset schema is
  175 |         // present in this file. In particular, a struct can retain its ID while
  176 |         // schema evolution replaces its last old child with a new one.
  177 |         fn project_field(
  178 |             field: &lance_core::datatypes::Field,
  179 |             mapped_columns: &HashMap<i32, i32>,
  180 |             is_v2_0: bool,
  181 |         ) -> Option<lance_core::datatypes::Field> {
  182 |             if field.is_blob() || field.is_packed_struct() {
  183 |                 return mapped_columns
  184 |                     .contains_key(&field.id)
  185 |                     .then(|| field.clone());
  186 |             }
  187 | 
  188 |             let children = field
  189 |                 .children
  190 |                 .iter()
  191 |                 .filter_map(|child| project_field(child, mapped_columns, is_v2_0))
  192 |                 .collect::<Vec<_>>();
  193 |             if !children.is_empty() {
  194 |                 return Some(lance_core::datatypes::Field {
  195 |                     children,
  196 |                     ..field.clone()
  197 |                 });
  198 |             }
  199 | 
  200 |             if field.children.is_empty() && mapped_columns.contains_key(&field.id) {
  201 |                 return Some(field.clone());
  202 |             }
  203 | 
  204 |             // V2.0 stores a physical header for structural fields. Keep that
  205 |             // header to preserve the parent's row count and validity, but leave
  206 |             // its children empty so missing descendants are null-filled by the
  207 |             // fragment reader instead of being added to this file's projection.
  208 |             if is_v2_0 && mapped_columns.contains_key(&field.id) {
  209 |                 return Some(lance_core::datatypes::Field {
  210 |                     children: Vec::new(),
  211 |                     ..field.clone()
  212 |                 });
  213 |             }
  214 |             None
  215 |         }
  216 | 
  217 |         if self.uses_v1_data_file_encoding() {
  218 |             return full_schema.project_by_ids(&self.fields, false);
  219 |         }
  220 |         let mapped_columns = self
  221 |             .fields
  222 |             .iter()
  223 |             .copied()
  224 |             .zip(self.column_indices.iter().copied())
  225 |             .filter(|(_, column_index)| *column_index >= 0)
  226 |             .collect::<HashMap<_, _>>();
  227 |         let is_v2_0 = matches!(
  228 |             (self.file_major_version, self.file_minor_version),
  229 |             (0, 3) | (2, 0)
  230 |         );
  231 |         Schema {
  232 |             fields: full_schema
  233 |                 .fields
  234 |                 .iter()
  235 |                 .filter_map(|field| project_field(field, &mapped_columns, is_v2_0))
  236 |                 .collect(),
  237 |             metadata: full_schema.metadata.clone(),
  238 |         }
  239 |     }
  240 | 
  241 |     fn uses_v1_data_file_encoding(&self) -> bool {
  242 |         self.file_major_version == 0 && self.file_minor_version < 3
  243 |     }
  244 | 
  245 |     /// Decode the exact file version stored in this `DataFile` metadata.
  246 |     pub fn file_version(&self) -> Result<ConcreteFileVersion> {
  247 |         ConcreteFileVersion::from_data_file_numbers(
  248 |             self.file_major_version,
  249 |             self.file_minor_version,
  250 |         )
  251 |     }
  252 | 
  253 |     pub fn validate(&self, base_path: &Path) -> Result<()> {
  254 |         if self.uses_v1_data_file_encoding() {
  255 |             // A tombstone marks a field superseded by a later data file. It is
  256 |             // not a field id, so it carries no ordering; the live ids around it
  257 |             // must still be sorted and distinct.
  258 |             let live: Vec<i32> = self
  259 |                 .fields
  260 |                 .iter()
  261 |                 .copied()
  262 |                 .filter(|field| *field != TOMBSTONE_FIELD_ID)
  263 |                 .collect();
  264 |             if !live.windows(2).all(|w| w[0] < w[1]) {
  265 |                 return Err(Error::corrupt_file(
  266 |                     base_path.clone().join(self.path.clone()),
  267 |                     "contained unsorted or duplicate field ids",
  268 |                 ));
  269 |             }
  270 |         } else if self.column_indices.len() < self.fields.len() {
  271 |             // Every recorded field id must have a column index, but not every column needs
  272 |             // to be associated with a field id (extra columns are allowed).
  273 |             return Err(Error::corrupt_file(
  274 |                 base_path.clone().join(self.path.clone()),
  275 |                 "contained fewer column_indices than fields",
  276 |             ));
  277 |         }
  278 |         Ok(())
  279 |     }
  280 | }
  281 | 
  282 | impl From<&DataFile> for pb::DataFile {
  283 |     fn from(df: &DataFile) -> Self {
  284 |         Self {
  285 |             path: df.path.clone(),
  286 |             fields: df.fields.to_vec(),
  287 |             column_indices: df.column_indices.to_vec(),
  288 |             file_major_version: df.file_major_version,
  289 |             file_minor_version: df.file_minor_version,
  290 |             file_size_bytes: df.file_size_bytes.get().map_or(0, |v| v.get()),
  291 |             base_id: df.base_id,
  292 |         }
  293 |     }
  294 | }
  295 | 
  296 | impl TryFrom<pb::DataFile> for DataFile {
  297 |     type Error = Error;
  298 | 
  299 |     fn try_from(proto: pb::DataFile) -> Result<Self> {
  300 |         Ok(Self {
  301 |             path: proto.path,
  302 |             fields: Arc::from(proto.fields),
  303 |             column_indices: Arc::from(proto.column_indices),
  304 |             file_major_version: proto.file_major_version,
  305 |             file_minor_version: proto.file_minor_version,
  306 |             file_size_bytes: CachedFileSize::new(proto.file_size_bytes),
  307 |             base_id: proto.base_id,
  308 |         })
  309 |     }
  310 | }
  311 | 
  312 | /// Interns repeated data so that fragments with identical content share a
  313 | /// single heap allocation via `Arc`.
  314 | ///
  315 | /// At 20M fragments the deduplication typically saves multiple GB of heap
  316 | /// because every fragment in a homogeneous table carries the same field list,
  317 | /// and post-compaction fragments share identical version metadata bytes.
  318 | ///
  319 | /// Uses a `Vec`-based linear scan when the cache is small (<=16 entries)
  320 | /// and upgrades to `HashMap` for larger caches. In the common homogeneous
  321 | /// case (1-3 unique values), linear scan avoids per-fragment hashing overhead.
  322 | #[derive(Default)]
  323 | pub struct DataFileFieldInterner {
  324 |     fields: InternCache<i32>,
  325 |     column_indices: InternCache<i32>,
  326 |     inline_bytes: InternCache<u8>,
  327 | }
  328 | 
  329 | /// A cache that uses linear scan for small sizes and HashMap for large.
  330 | /// The threshold is chosen so that scan + compare is cheaper than hash for
  331 | /// typical payload sizes (20-200 bytes).
  332 | enum InternCache<T: Eq + std::hash::Hash + Clone> {
  333 |     Small(Vec<Arc<[T]>>),
  334 |     Large(HashMap<Arc<[T]>, ()>),
  335 | }
  336 | 
  337 | const INTERN_CACHE_UPGRADE_THRESHOLD: usize = 16;
  338 | 
  339 | impl<T: Eq + std::hash::Hash + Clone> Default for InternCache<T> {
  340 |     fn default() -> Self {
  341 |         Self::Small(Vec::new())
  342 |     }
  343 | }
  344 | 
  345 | impl<T: Eq + std::hash::Hash + Clone> InternCache<T> {
  346 |     fn intern(&mut self, v: Vec<T>) -> Arc<[T]> {
  347 |         match self {
  348 |             Self::Small(entries) => {
  349 |                 for existing in entries.iter() {
  350 |                     if existing.as_ref() == v.as_slice() {
  351 |                         return existing.clone();
  352 |                     }
  353 |                 }
  354 |                 let arc: Arc<[T]> = Arc::from(v);
  355 |                 entries.push(arc.clone());
  356 |                 if entries.len() > INTERN_CACHE_UPGRADE_THRESHOLD {
  357 |                     let mut map = HashMap::with_capacity(entries.len());
  358 |                     for e in entries.drain(..) {
  359 |                         map.insert(e, ());
  360 |                     }
  361 |                     *self = Self::Large(map);
  362 |                 }
  363 |                 arc
  364 |             }
  365 |             Self::Large(map) => {
  366 |                 if let Some((existing, _)) = map.get_key_value(v.as_slice()) {
  367 |                     existing.clone()
  368 |                 } else {
  369 |                     let arc: Arc<[T]> = Arc::from(v);
  370 |                     map.insert(arc.clone(), ());
  371 |                     arc
  372 |                 }
  373 |             }
  374 |         }
  375 |     }
  376 | }
  377 | 
  378 | impl DataFileFieldInterner {
  379 |     /// Intern a `RowDatasetVersionMeta`, deduplicating inline byte payloads.
  380 |     /// Accepts the protobuf oneof value directly to avoid an intermediate
  381 |     /// `Arc<[u8]>` allocation that would need to be `.to_vec()`'d for the key lookup.
  382 |     fn intern_last_updated_version_meta(
  383 |         cache: &mut InternCache<u8>,
  384 |         pb: pb::data_fragment::LastUpdatedAtVersionSequence,
  385 |     ) -> Result<RowDatasetVersionMeta> {
  386 |         match pb {
  387 |             pb::data_fragment::LastUpdatedAtVersionSequence::InlineLastUpdatedAtVersions(data) => {
  388 |                 Ok(RowDatasetVersionMeta::Inline(cache.intern(data)))
  389 |             }
  390 |             pb::data_fragment::LastUpdatedAtVersionSequence::ColumnLastUpdatedAtVersions(_) => {
  391 |                 Ok(RowDatasetVersionMeta::Column)
  392 |             }
  393 |         }
  394 |     }
  395 | 
  396 |     /// Intern a `RowDatasetVersionMeta`, deduplicating inline byte payloads.
  397 |     fn intern_created_version_meta(
  398 |         cache: &mut InternCache<u8>,
  399 |         pb: pb::data_fragment::CreatedAtVersionSequence,
  400 |     ) -> Result<RowDatasetVersionMeta> {
  401 |         match pb {
  402 |             pb::data_fragment::CreatedAtVersionSequence::InlineCreatedAtVersions(data) => {
  403 |                 Ok(RowDatasetVersionMeta::Inline(cache.intern(data)))
  404 |             }
  405 |             pb::data_fragment::CreatedAtVersionSequence::ColumnCreatedAtVersions(_) => {
  406 |                 Ok(RowDatasetVersionMeta::Column)
  407 |             }
  408 |         }
  409 |     }
  410 | 
  411 |     /// Convert a protobuf `DataFile`, interning `fields` and `column_indices`.
  412 |     pub fn intern_data_file(&mut self, proto: pb::DataFile) -> Result<DataFile> {
  413 |         Ok(DataFile {
  414 |             path: proto.path,
  415 |             fields: self.fields.intern(proto.fields),
  416 |             column_indices: self.column_indices.intern(proto.column_indices),
  417 |             file_major_version: proto.file_major_version,
  418 |             file_minor_version: proto.file_minor_version,
  419 |             file_size_bytes: CachedFileSize::new(proto.file_size_bytes),
  420 |             base_id: proto.base_id,
  421 |         })
  422 |     }
  423 | 
  424 |     /// Convert a protobuf `DataFragment`, interning fields and version metadata.
  425 |     pub fn intern_fragment(&mut self, p: pb::DataFragment) -> Result<Fragment> {
  426 |         let physical_rows = if p.physical_rows > 0 {
  427 |             Some(p.physical_rows as usize)
  428 |         } else {
  429 |             None
  430 |         };
  431 |         let last_updated_at_version_meta = p
  432 |             .last_updated_at_version_sequence
  433 |             .map(|pb| Self::intern_last_updated_version_meta(&mut self.inline_bytes, pb))
  434 |             .transpose()?;
  435 |         let created_at_version_meta = p
  436 |             .created_at_version_sequence
  437 |             .map(|pb| Self::intern_created_version_meta(&mut self.inline_bytes, pb))
  438 |             .transpose()?;
  439 |         Ok(Fragment {
  440 |             id: p.id,
  441 |             files: p
  442 |                 .files
  443 |                 .into_iter()
  444 |                 .map(|f| self.intern_data_file(f))
  445 |                 .collect::<Result<_>>()?,
  446 |             overlays: {
  447 |                 let mut overlays = p
  448 |                     .overlays
  449 |                     .into_iter()
  450 |                     .map(DataOverlayFile::try_from)
  451 |                     .collect::<Result<Vec<_>>>()?;
  452 |                 sort_overlays_newest_last(&mut overlays);
  453 |                 overlays
  454 |             },
  455 |             deletion_file: p.deletion_file.map(DeletionFile::try_from).transpose()?,
  456 |             row_id_meta: p.row_id_sequence.map(RowIdMeta::try_from).transpose()?,
  457 |             physical_rows,
  458 |             last_updated_at_version_meta,
  459 |             created_at_version_meta,
  460 |         })
  461 |     }
  462 | }
  463 | 
  464 | #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, DeepSizeOf)]
  465 | #[serde(rename_all = "lowercase")]
  466 | pub enum DeletionFileType {
  467 |     Array,
  468 |     Bitmap,
  469 | }
  470 | 
  471 | impl DeletionFileType {
  472 |     // TODO: pub(crate)
  473 |     pub fn suffix(&self) -> &str {
  474 |         match self {
  475 |             Self::Array => "arrow",
  476 |             Self::Bitmap => "bin",
  477 |         }
  478 |     }
  479 | }
  480 | 
  481 | #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, DeepSizeOf)]
  482 | pub struct DeletionFile {
  483 |     pub read_version: u64,
  484 |     pub id: u64,
  485 |     pub file_type: DeletionFileType,
  486 |     /// Number of deleted rows in this file. If None, this is unknown.
  487 |     pub num_deleted_rows: Option<usize>,
  488 |     pub base_id: Option<u32>,
  489 | }
  490 | 
  491 | impl TryFrom<pb::DeletionFile> for DeletionFile {
  492 |     type Error = Error;
  493 | 
  494 |     fn try_from(value: pb::DeletionFile) -> Result<Self> {
  495 |         let file_type = match value.file_type {
  496 |             0 => DeletionFileType::Array,
  497 |             1 => DeletionFileType::Bitmap,
  498 |             _ => {
  499 |                 return Err(Error::not_supported_source(
  500 |                     "Unknown deletion file type".into(),
  501 |                 ));
  502 |             }
  503 |         };
  504 |         let num_deleted_rows = if value.num_deleted_rows == 0 {
  505 |             None
  506 |         } else {
  507 |             Some(value.num_deleted_rows as usize)
  508 |         };
  509 |         Ok(Self {
  510 |             read_version: value.read_version,
  511 |             id: value.id,
  512 |             file_type,
  513 |             num_deleted_rows,
  514 |             base_id: value.base_id,
  515 |         })
  516 |     }
  517 | }
  518 | 
  519 | /// Data fragment.
  520 | ///
  521 | /// A fragment is a set of files which represent the different columns of the same rows.
  522 | /// If column exists in the schema, but the related file does not exist, treat this column as `nulls`.
  523 | #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, DeepSizeOf)]
  524 | pub struct Fragment {
  525 |     /// Fragment ID
  526 |     pub id: u64,
  527 | 
  528 |     /// Files within the fragment.
  529 |     pub files: Vec<DataFile>,
  530 | 
  531 |     /// Overlay files supplying new values for a subset of cells without
  532 |     /// rewriting the base data files. Order is significant: a later entry is
  533 |     /// newer than an earlier one. See [`DataOverlayFile`] for resolution rules.
  534 |     #[serde(default, skip_serializing_if = "Vec::is_empty")]
  535 |     pub overlays: Vec<DataOverlayFile>,
  536 | 
  537 |     /// Optional file with deleted local row offsets.
  538 |     #[serde(skip_serializing_if = "Option::is_none")]
  539 |     pub deletion_file: Option<DeletionFile>,
  540 | 
  541 |     /// RowIndex
  542 |     #[serde(skip_serializing_if = "Option::is_none")]
  543 |     pub row_id_meta: Option<RowIdMeta>,
  544 | 
  545 |     /// Original number of rows in the fragment. If this is None, then it is
  546 |     /// unknown. This is only optional for legacy reasons. All new tables should
  547 |     /// have this set.
  548 |     pub physical_rows: Option<usize>,
  549 | 
  550 |     /// Last updated at version metadata
  551 |     #[serde(skip_serializing_if = "Option::is_none")]
  552 |     pub last_updated_at_version_meta: Option<RowDatasetVersionMeta>,
  553 | 
  554 |     /// Created at version metadata
  555 |     #[serde(skip_serializing_if = "Option::is_none")]
  556 |     pub created_at_version_meta: Option<RowDatasetVersionMeta>,
  557 | }
  558 | 
  559 | impl Fragment {
  560 |     pub fn new(id: u64) -> Self {
  561 |         Self {
  562 |             id,
  563 |             files: vec![],
  564 |             overlays: vec![],
  565 |             deletion_file: None,
  566 |             row_id_meta: None,
  567 |             physical_rows: None,
  568 |             last_updated_at_version_meta: None,
  569 |             created_at_version_meta: None,
  570 |         }
  571 |     }
  572 | 
  573 |     pub fn num_rows(&self) -> Option<usize> {
  574 |         match (self.physical_rows, &self.deletion_file) {
  575 |             // Known fragment length, no deletion file.
  576 |             (Some(len), None) => Some(len),
  577 |             // Known fragment length, but don't know deletion file size.
  578 |             (
  579 |                 Some(len),
  580 |                 Some(DeletionFile {
  581 |                     num_deleted_rows: Some(num_deleted_rows),
  582 |                     ..
  583 |                 }),
  584 |             ) => Some(len - num_deleted_rows),
  585 |             _ => None,
  586 |         }
  587 |     }
  588 | 
  589 |     /// Every Lance-format file this fragment references: the base data files
  590 |     /// plus the data file of each overlay. The fragment's other referenced
  591 |     /// files are not in this format: a deletion file is `.arrow` or `.bin`, and
  592 |     /// external row-id or row-version metadata is a raw byte range.
  593 |     ///
  594 |     /// Prefer this over `files`, which is the base data files only and so omits
  595 |     /// overlays.
  596 |     pub fn referenced_lance_files(&self) -> impl Iterator<Item = &DataFile> + '_ {
  597 |         // Destructured on purpose: a new field here fails to compile until
  598 |         // someone decides whether it references files.
  599 |         let Self {
  600 |             id: _,
  601 |             files,
  602 |             overlays,
  603 |             deletion_file: _,
  604 |             row_id_meta: _,
  605 |             physical_rows: _,
  606 |             last_updated_at_version_meta: _,
  607 |             created_at_version_meta: _,
  608 |         } = self;
  609 |         files
  610 |             .iter()
  611 |             .chain(overlays.iter().map(|overlay| &overlay.data_file))
  612 |     }
  613 | 
  614 |     /// Mutable counterpart of [`Self::referenced_lance_files`], for rewriting
  615 |     /// the fields a clone has to normalize (`base_id`) across base and overlay
  616 |     /// files alike.
  617 |     pub fn referenced_lance_files_mut(&mut self) -> impl Iterator<Item = &mut DataFile> + '_ {
  618 |         // Destructured for the same reason as `referenced_lance_files`, and so
  619 |         // the two disjoint field borrows are visible to the borrow checker.
  620 |         let Self {
  621 |             id: _,
  622 |             files,
  623 |             overlays,
  624 |             deletion_file: _,
  625 |             row_id_meta: _,
  626 |             physical_rows: _,
  627 |             last_updated_at_version_meta: _,
  628 |             created_at_version_meta: _,
  629 |         } = self;
  630 |         files
  631 |             .iter_mut()
  632 |             .chain(overlays.iter_mut().map(|overlay| &mut overlay.data_file))
  633 |     }
  634 | 
  635 |     /// Whether any of this fragment's row lineage sequences lives in a data
  636 |     /// file column rather than inline.
  637 |     pub fn has_spilled_row_lineage(&self) -> bool {
  638 |         matches!(self.row_id_meta, Some(RowIdMeta::Column))
  639 |             || matches!(
  640 |                 self.created_at_version_meta,
  641 |                 Some(RowDatasetVersionMeta::Column)
  642 |             )
  643 |             || matches!(
  644 |                 self.last_updated_at_version_meta,
  645 |                 Some(RowDatasetVersionMeta::Column)
  646 |             )
  647 |     }
  648 | 
  649 |     /// The data file holding the row lineage column with the reserved
  650 |     /// `field_id`, which is the one entry of [`Self::files`] whose fields carry
  651 |     /// it. `None` when no file does, which for a sequence whose metadata says
  652 |     /// it is spilled is corruption; so is more than one file carrying the id,
  653 |     /// which this reports as an error.
  654 |     pub fn row_lineage_file(&self, field_id: i32) -> Result<Option<&DataFile>> {
  655 |         let mut carriers = self
  656 |             .files
  657 |             .iter()
  658 |             .filter(|file| file.fields.contains(&field_id));
  659 |         let file = carriers.next();
  660 |         if let Some(extra) = carriers.next() {
  661 |             return Err(Error::corrupt_file_named(
  662 |                 &extra.path,
  663 |                 format!(
  664 |                     "fragment {} has more than one data file carrying row lineage field {}",
  665 |                     self.id, field_id
  666 |                 ),
  667 |             ));
  668 |         }
  669 |         Ok(file)
  670 |     }
  671 | 
  672 |     /// The reserved field ids of the row lineage sequences this fragment
  673 |     /// marks as spilled: [`ROW_ID_FIELD_ID`] when its row ids are, and
  674 |     /// likewise [`ROW_CREATED_AT_VERSION_FIELD_ID`] and
  675 |     /// [`ROW_LAST_UPDATED_AT_VERSION_FIELD_ID`] for its versions.
  676 |     ///
  677 |     /// These ids are never in the dataset schema, so code that decides whether
  678 |     /// a data file is still needed by its schema fields has to keep a file
  679 |     /// carrying one of them as well: that file is the sequence's only copy.
  680 |     pub fn spilled_row_lineage_field_ids(&self) -> Vec<i32> {
  681 |         let mut field_ids = Vec::new();
  682 |         if matches!(self.row_id_meta, Some(RowIdMeta::Column)) {
  683 |             field_ids.push(ROW_ID_FIELD_ID);
  684 |         }
  685 |         if matches!(
  686 |             self.created_at_version_meta,
  687 |             Some(RowDatasetVersionMeta::Column)
  688 |         ) {
  689 |             field_ids.push(ROW_CREATED_AT_VERSION_FIELD_ID);
  690 |         }
  691 |         if matches!(
  692 |             self.last_updated_at_version_meta,
  693 |             Some(RowDatasetVersionMeta::Column)
  694 |         ) {
  695 |             field_ids.push(ROW_LAST_UPDATED_AT_VERSION_FIELD_ID);
  696 |         }
  697 |         field_ids
  698 |     }
  699 | 
  700 |     /// Check that every sequence this fragment marks as spilled has exactly
  701 |     /// one carrier among [`Self::files`], and that the carrier is a v2 file,
  702 |     /// the only version that can hold the columns.
  703 |     ///
  704 |     /// This reads metadata only. Committing a fragment that fails it would
  705 |     /// publish lineage no reader can load, and once cleanup removed the
  706 |     /// unreferenced carrier that lineage would be lost for good.
  707 |     pub(crate) fn validate_row_lineage_carriers(&self) -> Result<()> {
  708 |         for field_id in self.spilled_row_lineage_field_ids() {
  709 |             let Some(file) = self.row_lineage_file(field_id)? else {
  710 |                 return Err(Error::internal(format!(
  711 |                     "cannot commit fragment {}: it marks row lineage field {} as spilled but \
  712 |                      none of its data files carries it",
  713 |                     self.id, field_id
  714 |                 )));
  715 |             };
  716 |             if file.file_version()? == ConcreteFileVersion::V1 {
  717 |                 return Err(Error::internal(format!(
  718 |                     "cannot commit fragment {}: its spilled row lineage field {} is carried by \
  719 |                      legacy v1 data file {}, which cannot hold row lineage columns",
  720 |                     self.id, field_id, file.path
  721 |                 )));
  722 |             }
  723 |         }
  724 |         Ok(())
  725 |     }
  726 | 
  727 |     pub fn from_json(json: &str) -> Result<Self> {
  728 |         let fragment: Self = serde_json::from_str(json)?;
  729 |         Ok(fragment)
  730 |     }
  731 | 
  732 |     /// Create a `Fragment` with one DataFile
  733 |     pub fn with_file_legacy(
  734 |         id: u64,
  735 |         path: &str,
  736 |         schema: &Schema,
  737 |         physical_rows: Option<usize>,
  738 |     ) -> Self {
  739 |         Self {
  740 |             id,
  741 |             files: vec![DataFile::new_legacy(path, schema, None, None)],
  742 |             overlays: vec![],
  743 |             deletion_file: None,
  744 |             physical_rows,
  745 |             row_id_meta: None,
  746 |             last_updated_at_version_meta: None,
  747 |             created_at_version_meta: None,
  748 |         }
  749 |     }
  750 | 
  751 |     pub fn with_file(
  752 |         mut self,
  753 |         path: impl Into<String>,
  754 |         field_ids: Vec<i32>,
  755 |         column_indices: Vec<i32>,
  756 |         version: ConcreteFileVersion,
  757 |         file_size_bytes: Option<NonZero<u64>>,
  758 |     ) -> Self {
  759 |         let data_file = DataFile::new(
  760 |             path,
  761 |             field_ids,
  762 |             column_indices,
  763 |             version,
  764 |             file_size_bytes,
  765 |             None,
  766 |         );
  767 |         self.files.push(data_file);
  768 |         self
  769 |     }
  770 | 
  771 |     pub fn with_physical_rows(mut self, physical_rows: usize) -> Self {
  772 |         self.physical_rows = Some(physical_rows);
  773 |         self
  774 |     }
  775 | 
  776 |     pub fn add_file(
  777 |         &mut self,
  778 |         path: impl Into<String>,
  779 |         field_ids: Vec<i32>,
  780 |         column_indices: Vec<i32>,
  781 |         version: ConcreteFileVersion,
  782 |         file_size_bytes: Option<NonZero<u64>>,
  783 |     ) {
  784 |         self.files.push(DataFile::new(
  785 |             path,
  786 |             field_ids,
  787 |             column_indices,
  788 |             version,
  789 |             file_size_bytes,
  790 |             None,
  791 |         ));
  792 |     }
  793 | 
  794 |     /// Add a new [`DataFile`] to this fragment.
  795 |     pub fn add_file_legacy(&mut self, path: &str, schema: &Schema) {
  796 |         self.files
  797 |             .push(DataFile::new_legacy(path, schema, None, None));
  798 |     }
  799 | 
  800 |     // Helper method to infer the Lance version from a set of fragments
  801 |     //
  802 |     // Returns None if there are no data files
  803 |     // Returns an error if the data files have different versions
  804 |     pub fn try_infer_version(fragments: &[Self]) -> Result<Option<ConcreteFileVersion>> {
  805 |         // Otherwise we need to check the actual file versions
  806 |         // Determine version from first file
  807 |         let Some(sample_file) = fragments
  808 |             .iter()
  809 |             .flat_map(Self::referenced_lance_files)
  810 |             .next()
  811 |         else {
  812 |             return Ok(None);
  813 |         };
  814 |         let file_version = sample_file.file_version()?;
  815 |         // Ensure all files match
  816 |         for frag in fragments {
  817 |             for file in frag.referenced_lance_files() {
  818 |                 let this_file_version = file.file_version()?;
  819 |                 if file_version != this_file_version {
  820 |                     return Err(Error::invalid_input(format!(
  821 |                         "All data files must have the same version.  Detected both {} and {}",
  822 |                         file_version, this_file_version
  823 |                     )));
  824 |                 }
  825 |             }
  826 |         }
  827 |         Ok(Some(file_version))
  828 |     }
  829 | }
  830 | 
  831 | impl TryFrom<pb::DataFragment> for Fragment {
  832 |     type Error = Error;
  833 | 
  834 |     fn try_from(p: pb::DataFragment) -> Result<Self> {
  835 |         let physical_rows = if p.physical_rows > 0 {
  836 |             Some(p.physical_rows as usize)
  837 |         } else {
  838 |             None
  839 |         };
  840 |         Ok(Self {
  841 |             id: p.id,
  842 |             files: p
  843 |                 .files
  844 |                 .into_iter()
  845 |                 .map(DataFile::try_from)
  846 |                 .collect::<Result<_>>()?,
  847 |             overlays: {
  848 |                 let mut overlays = p
  849 |                     .overlays
  850 |                     .into_iter()
  851 |                     .map(DataOverlayFile::try_from)
  852 |                     .collect::<Result<Vec<_>>>()?;
  853 |                 sort_overlays_newest_last(&mut overlays);
  854 |                 overlays
  855 |             },
  856 |             deletion_file: p.deletion_file.map(DeletionFile::try_from).transpose()?,
  857 |             row_id_meta: p.row_id_sequence.map(RowIdMeta::try_from).transpose()?,
  858 |             physical_rows,
  859 |             last_updated_at_version_meta: p
  860 |                 .last_updated_at_version_sequence
  861 |                 .map(RowDatasetVersionMeta::try_from)
  862 |                 .transpose()?,
  863 |             created_at_version_meta: p
  864 |                 .created_at_version_sequence
  865 |                 .map(RowDatasetVersionMeta::try_from)
  866 |                 .transpose()?,
  867 |         })
  868 |     }
  869 | }
  870 | 
  871 | impl From<&Fragment> for pb::DataFragment {
  872 |     fn from(f: &Fragment) -> Self {
  873 |         let deletion_file = f.deletion_file.as_ref().map(|f| {
  874 |             let file_type = match f.file_type {
  875 |                 DeletionFileType::Array => pb::deletion_file::DeletionFileType::ArrowArray,
  876 |                 DeletionFileType::Bitmap => pb::deletion_file::DeletionFileType::Bitmap,
  877 |             };
  878 |             pb::DeletionFile {
  879 |                 read_version: f.read_version,
  880 |                 id: f.id,
  881 |                 file_type: file_type.into(),
  882 |                 num_deleted_rows: f.num_deleted_rows.unwrap_or_default() as u64,
  883 |                 base_id: f.base_id,
  884 |             }
  885 |         });
  886 | 
  887 |         let row_id_sequence = f.row_id_meta.as_ref().map(|m| match m {
  888 |             RowIdMeta::Inline(data) => {
  889 |                 pb::data_fragment::RowIdSequence::InlineRowIds(data.bytes().clone())
  890 |             }
  891 |             RowIdMeta::Column => {
  892 |                 pb::data_fragment::RowIdSequence::ColumnRowIds(pb::RowLineageColumn {})
  893 |             }
  894 |         });
  895 |         let last_updated_at_version_sequence =
  896 |             last_updated_at_version_meta_to_pb(&f.last_updated_at_version_meta);
  897 |         let created_at_version_sequence = created_at_version_meta_to_pb(&f.created_at_version_meta);
  898 |         Self {
  899 |             id: f.id,
  900 |             files: f.files.iter().map(pb::DataFile::from).collect(),
  901 |             overlays: f.overlays.iter().map(pb::DataOverlayFile::from).collect(),
  902 |             deletion_file,
  903 |             row_id_sequence,
  904 |             physical_rows: f.physical_rows.unwrap_or_default() as u64,
  905 |             last_updated_at_version_sequence,
  906 |             created_at_version_sequence,
  907 |         }
  908 |     }
  909 | }
  910 | 
  911 | #[cfg(test)]
  912 | mod tests {
  913 |     use super::*;
  914 |     use crate::format::overlay::OverlayCoverage;
  915 |     use arrow_schema::{
  916 |         DataType, Field as ArrowField, Fields as ArrowFields, Schema as ArrowSchema,
  917 |     };
  918 |     use lance_file::format::{MAJOR_VERSION, MINOR_VERSION};
  919 |     use object_store::path::Path;
  920 |     use roaring::RoaringBitmap;
  921 |     use serde_json::{Value, json};
  922 | 
  923 |     #[test]
  924 |     fn test_data_overlay_roundtrip() {
  925 |         // A fragment carrying a dense overlay round-trips through protobuf and
  926 |         // back, and the parsed coverage bitmap is recovered per field.
  927 |         let mut bitmap = RoaringBitmap::new();
  928 |         bitmap.insert(1);
  929 |         bitmap.insert(3);
  930 | 
  931 |         let overlay = DataOverlayFile {
  932 |             data_file: DataFile::new_legacy_from_fields("overlay-0.lance", vec![3], None),
  933 |             coverage: OverlayCoverage::dense(bitmap.clone()),
  934 |             committed_version: 7,
  935 |         };
  936 |         let mut fragment = Fragment::new(0);
  937 |         fragment.files = vec![DataFile::new_legacy_from_fields(
  938 |             "base.lance",
  939 |             vec![1, 3],
  940 |             None,
  941 |         )];
  942 |         fragment.overlays = vec![overlay];
  943 | 
  944 |         let proto = pb::DataFragment::from(&fragment);
  945 |         assert_eq!(proto.overlays.len(), 1);
  946 |         let round_tripped = Fragment::try_from(proto).unwrap();
  947 |         assert_eq!(round_tripped, fragment);
  948 | 
  949 |         // Dense coverage applies to every field.
  950 |         let recovered = round_tripped.overlays[0].coverage_for_field(0).unwrap();
  951 |         assert_eq!(*recovered, bitmap);
  952 |         assert_eq!(
  953 |             *round_tripped.overlays[0].coverage_for_field(5).unwrap(),
  954 |             bitmap
  955 |         );
  956 |     }
  957 | 
  958 |     #[test]
  959 |     fn test_data_overlay_sparse_per_field_coverage() {
  960 |         // A sparse overlay carries one bitmap per field, recovered by position.
  961 |         let name_coverage = RoaringBitmap::from_iter([2u32, 3]);
  962 |         let embedding_coverage = RoaringBitmap::from_iter([1u32]);
  963 |         let overlay = DataOverlayFile {
  964 |             data_file: DataFile::new_legacy_from_fields("overlay-1.lance", vec![2, 4], None),
  965 |             coverage: OverlayCoverage::sparse(vec![
  966 |                 name_coverage.clone(),
  967 |                 embedding_coverage.clone(),
  968 |             ]),
  969 |             committed_version: 3,
  970 |         };
  971 |         let mut fragment = Fragment::new(1);
  972 |         fragment.overlays = vec![overlay];
  973 | 
  974 |         let round_tripped = Fragment::try_from(pb::DataFragment::from(&fragment)).unwrap();
  975 |         assert_eq!(
  976 |             *round_tripped.overlays[0].coverage_for_field(0).unwrap(),
  977 |             name_coverage
  978 |         );
  979 |         assert_eq!(
  980 |             *round_tripped.overlays[0].coverage_for_field(1).unwrap(),
  981 |             embedding_coverage
  982 |         );
  983 |     }
  984 | 
  985 |     #[test]
  986 |     fn test_overlays_sorted_newest_last_on_load() {
  987 |         // Overlays load stable-sorted by committed_version (newest last), with
  988 |         // list position preserved as the tiebreak for equal versions.
  989 |         let mk = |version: u64, field: i32| DataOverlayFile {
  990 |             data_file: DataFile::new_legacy_from_fields("o.lance", vec![field], None),
  991 |             coverage: OverlayCoverage::dense(RoaringBitmap::from_iter([0u32])),
  992 |             committed_version: version,
  993 |         };
  994 |         let mut fragment = Fragment::new(0);
  995 |         // Written out of order: v5, v2, v2 (second), v3.
  996 |         fragment.overlays = vec![mk(5, 1), mk(2, 2), mk(2, 3), mk(3, 4)];
  997 | 
  998 |         let loaded = Fragment::try_from(pb::DataFragment::from(&fragment)).unwrap();
  999 |         let versions: Vec<u64> = loaded
 1000 |             .overlays
 1001 |             .iter()
 1002 |             .map(|o| o.committed_version)
 1003 |             .collect();
 1004 |         assert_eq!(versions, vec![2, 2, 3, 5]);
 1005 |         // Stable: the two v2 overlays keep their original relative order (field 2
 1006 |         // before field 3).
 1007 |         assert_eq!(
 1008 |             loaded.overlays[0].data_file.fields.as_ref(),
 1009 |             [2i32].as_slice()
 1010 |         );
 1011 |         assert_eq!(
 1012 |             loaded.overlays[1].data_file.fields.as_ref(),
 1013 |             [3i32].as_slice()
 1014 |         );
 1015 |     }
 1016 | 
 1017 |     #[test]
 1018 |     fn test_new_fragment() {
 1019 |         let path = "foobar.lance";
 1020 | 
 1021 |         let arrow_schema = ArrowSchema::new(vec![
 1022 |             ArrowField::new(
 1023 |                 "s",
 1024 |                 DataType::Struct(ArrowFields::from(vec![
 1025 |                     ArrowField::new("si", DataType::Int32, false),
 1026 |                     ArrowField::new("sb", DataType::Binary, true),
 1027 |                 ])),
 1028 |                 true,
 1029 |             ),
 1030 |             ArrowField::new("bool", DataType::Boolean, true),
 1031 |         ]);
 1032 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 1033 |         let fragment = Fragment::with_file_legacy(123, path, &schema, Some(10));
 1034 | 
 1035 |         assert_eq!(123, fragment.id);
 1036 |         assert_eq!(
 1037 |             fragment.files,
 1038 |             vec![DataFile::new_legacy_from_fields(
 1039 |                 path.to_string(),
 1040 |                 vec![0, 1, 2, 3],
 1041 |                 None,
 1042 |             )]
 1043 |         )
 1044 |     }
 1045 | 
 1046 |     #[test]
 1047 |     fn test_roundtrip_fragment() {
 1048 |         let mut fragment = Fragment::new(123);
 1049 |         let schema = ArrowSchema::new(vec![ArrowField::new("x", DataType::Float16, true)]);
 1050 |         fragment.add_file_legacy("foobar.lance", &Schema::try_from(&schema).unwrap());
 1051 |         fragment.deletion_file = Some(DeletionFile {
 1052 |             read_version: 123,
 1053 |             id: 456,
 1054 |             file_type: DeletionFileType::Array,
 1055 |             num_deleted_rows: Some(10),
 1056 |             base_id: None,
 1057 |         });
 1058 | 
 1059 |         let proto = pb::DataFragment::from(&fragment);
 1060 |         let fragment2 = Fragment::try_from(proto).unwrap();
 1061 |         assert_eq!(fragment, fragment2);
 1062 | 
 1063 |         fragment.deletion_file = None;
 1064 |         let proto = pb::DataFragment::from(&fragment);
 1065 |         let fragment2 = Fragment::try_from(proto).unwrap();
 1066 |         assert_eq!(fragment, fragment2);
 1067 |     }
 1068 | 
 1069 |     #[test]
 1070 |     fn infer_exact_file_version_and_reject_mixed_fragments() {
 1071 |         assert_eq!(Fragment::try_infer_version(&[]).unwrap(), None);
 1072 | 
 1073 |         let v2_0 = Fragment::new(0).with_file(
 1074 |             "v2_0.lance",
 1075 |             vec![0],
 1076 |             vec![0],
 1077 |             ConcreteFileVersion::V2_0,
 1078 |             None,
 1079 |         );
 1080 |         assert_eq!(
 1081 |             (
 1082 |                 v2_0.files[0].file_major_version,
 1083 |                 v2_0.files[0].file_minor_version
 1084 |             ),
 1085 |             (2, 0)
 1086 |         );
 1087 |         let unstarted = DataFile::new_unstarted("unstarted.lance", ConcreteFileVersion::V2_0);
 1088 |         assert_eq!(
 1089 |             (unstarted.file_major_version, unstarted.file_minor_version),
 1090 |             (2, 0)
 1091 |         );
 1092 |         let v2_0_second = Fragment::new(1).with_file(
 1093 |             "v2_0_second.lance",
 1094 |             vec![0],
 1095 |             vec![0],
 1096 |             ConcreteFileVersion::V2_0,
 1097 |             None,
 1098 |         );
 1099 |         assert_eq!(
 1100 |             Fragment::try_infer_version(&[v2_0.clone(), v2_0_second]).unwrap(),
 1101 |             Some(ConcreteFileVersion::V2_0)
 1102 |         );
 1103 | 
 1104 |         let mut mixed_overlay = v2_0.clone();
 1105 |         mixed_overlay.overlays.push(DataOverlayFile {
 1106 |             data_file: DataFile::new(
 1107 |                 "overlay-v2_1.lance",
 1108 |                 vec![0],
 1109 |                 vec![0],
 1110 |                 ConcreteFileVersion::V2_1,
 1111 |                 None,
 1112 |                 None,
 1113 |             ),
 1114 |             coverage: OverlayCoverage::dense(RoaringBitmap::from_iter([0])),
 1115 |             committed_version: 1,
 1116 |         });
 1117 |         let error = Fragment::try_infer_version(&[mixed_overlay]).unwrap_err();
 1118 |         assert!(error.to_string().contains("2.0"));
 1119 |         assert!(error.to_string().contains("2.1"));
 1120 | 
 1121 |         let v2_1 = Fragment::new(2).with_file(
 1122 |             "v2_1.lance",
 1123 |             vec![0],
 1124 |             vec![0],
 1125 |             ConcreteFileVersion::V2_1,
 1126 |             None,
 1127 |         );
 1128 |         let error = Fragment::try_infer_version(&[v2_0, v2_1]).unwrap_err();
 1129 |         assert!(matches!(error, Error::InvalidInput { .. }));
 1130 |         let message = error.to_string();
 1131 |         assert!(message.contains("All data files must have the same version"));
 1132 |         assert!(message.contains("2.0"));
 1133 |         assert!(message.contains("2.1"));
 1134 |     }
 1135 | 
 1136 |     #[test]
 1137 |     fn data_file_schema_does_not_substitute_evolved_struct_children() {
 1138 |         let mut schema = Schema::try_from(&ArrowSchema::new(vec![
 1139 |             ArrowField::new(
 1140 |                 "values",
 1141 |                 DataType::Struct(ArrowFields::from(vec![ArrowField::new(
 1142 |                     "later",
 1143 |                     DataType::Int32,
 1144 |                     true,
 1145 |                 )])),
 1146 |                 true,
 1147 |             ),
 1148 |             ArrowField::new("id", DataType::Int32, false),
 1149 |         ]))
 1150 |         .unwrap();
 1151 |         schema.set_field_id(None);
 1152 |         let parent_id = schema.fields[0].id;
 1153 |         let later_id = schema.fields[0].children[0].id;
 1154 |         let id_field_id = schema.fields[1].id;
 1155 |         schema.fields[0].children[0].id = later_id + 2;
 1156 | 
 1157 |         let stale_file = DataFile::new(
 1158 |             "stale.lance",
 1159 |             vec![parent_id, later_id, id_field_id],
 1160 |             vec![0, 1, 2],
 1161 |             ConcreteFileVersion::V2_0,
 1162 |             None,
 1163 |             None,
 1164 |         );
 1165 |         let stale_schema = stale_file.schema(&schema);
 1166 |         assert_eq!(
 1167 |             stale_schema
 1168 |                 .fields
 1169 |                 .iter()
 1170 |                 .map(|field| field.name.as_str())
 1171 |                 .collect::<Vec<_>>(),
 1172 |             vec!["values", "id"]
 1173 |         );
 1174 |         assert!(stale_schema.fields[0].children.is_empty());
 1175 | 
 1176 |         let stale_v2_1_file = DataFile::new(
 1177 |             "stale-v2-1.lance",
 1178 |             vec![parent_id, later_id, id_field_id],
 1179 |             vec![-1, 0, 1],
 1180 |             ConcreteFileVersion::V2_1,
 1181 |             None,
 1182 |             None,
 1183 |         );
 1184 |         assert_eq!(
 1185 |             stale_v2_1_file.schema(&schema).fields,
 1186 |             vec![schema.fields[1].clone()]
 1187 |         );
 1188 | 
 1189 |         let current_file = DataFile::new(
 1190 |             "current.lance",
 1191 |             vec![parent_id, later_id + 2, id_field_id],
 1192 |             vec![0, 1, 2],
 1193 |             ConcreteFileVersion::V2_0,
 1194 |             None,
 1195 |             None,
 1196 |         );
 1197 |         assert_eq!(current_file.schema(&schema), schema);
 1198 |     }
 1199 | 
 1200 |     #[test]
 1201 |     fn test_to_json() {
 1202 |         let mut fragment = Fragment::new(123);
 1203 |         let schema = ArrowSchema::new(vec![ArrowField::new("x", DataType::Float16, true)]);
 1204 |         fragment.add_file_legacy("foobar.lance", &Schema::try_from(&schema).unwrap());
 1205 |         fragment.deletion_file = Some(DeletionFile {
 1206 |             read_version: 123,
 1207 |             id: 456,
 1208 |             file_type: DeletionFileType::Array,
 1209 |             num_deleted_rows: Some(10),
 1210 |             base_id: None,
 1211 |         });
 1212 | 
 1213 |         let json = serde_json::to_string(&fragment).unwrap();
 1214 | 
 1215 |         let value: Value = serde_json::from_str(&json).unwrap();
 1216 |         assert_eq!(
 1217 |             value,
 1218 |             json!({
 1219 |                 "id": 123,
 1220 |                 "files":[
 1221 |                     {"path": "foobar.lance", "fields": [0], "column_indices": [], 
 1222 |                      "file_major_version": MAJOR_VERSION, "file_minor_version": MINOR_VERSION,
 1223 |                      "file_size_bytes": null, "base_id": null }
 1224 |                 ],
 1225 |                 "deletion_file": {"read_version": 123, "id": 456, "file_type": "array",
 1226 |                                   "num_deleted_rows": 10, "base_id": null},
 1227 |                 "physical_rows": None::<usize>}),
 1228 |         );
 1229 | 
 1230 |         let frag2 = Fragment::from_json(&json).unwrap();
 1231 |         assert_eq!(fragment, frag2);
 1232 |     }
 1233 | 
 1234 |     #[test]
 1235 |     fn data_file_validate_allows_extra_columns() {
 1236 |         let data_file = DataFile {
 1237 |             path: "foo.lance".to_string(),
 1238 |             fields: Arc::from([1, 2]),
 1239 |             // One extra column without a field id mapping
 1240 |             column_indices: Arc::from([0, 1, 2]),
 1241 |             file_major_version: MAJOR_VERSION as u32,
 1242 |             file_minor_version: MINOR_VERSION as u32,
 1243 |             file_size_bytes: Default::default(),
 1244 |             base_id: None,
 1245 |         };
 1246 | 
 1247 |         let base_path = Path::from("base");
 1248 |         data_file
 1249 |             .validate(&base_path)
 1250 |             .expect("validation should allow extra columns without field ids");
 1251 |     }
 1252 | }
``````
