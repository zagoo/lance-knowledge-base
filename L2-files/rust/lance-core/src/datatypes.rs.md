> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-core/src/datatypes.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `f1ebe67579c95dd4336110fe1e75b79448e97a40f9983e3f97ce5f81f36f1cb1`. Reviewed physical lines: 1-985.

[Module](../../../../L1-modules/rust-lance-core.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public datatype facade, canonical blob layout declarations and structural classifiers, Arrow/logical-string conversion, dictionary metadata equality, and blob-kind numeric codes. Private field/schema submodules expose selected types through this facade. Layout declarations specify shapes and documented meanings; they do not themselves validate row values or implement IO. (rust/lance-core/src/datatypes.rs:1-985)

## Complete range analysis

### Lines 1-29

SPDX, module description and imports establish Arrow types, shared/lazy values, deep-size accounting and bfloat16 extension helpers. Private field and schema modules re-export the explicitly listed public types/functions/constants. Field-facing exports include comparison modes, blob version, encoding and metadata keys; schema-facing exports include projections, blob handling, field-path parsing/formatting and fixed-size-list dimension validation. The exported schema implementation is analyzed separately at rust/lance-core/src/datatypes/schema.rs:1-3225; these declarations alone do not establish its behavior. (rust/lance-core/src/datatypes.rs:1-29)

### Lines 30-49

Legacy blob descriptor is a lazily constructed Struct of position:UInt64 and size:UInt64, both nullable. BLOB_DESC_FIELD names it description, makes the outer Arrow field nullable, and sets BLOB_META_KEY to true. BLOB_DESC_LANCE_FIELD converts that Arrow field with try_from(...).unwrap(); the initializer assumes its built-in shape remains convertible. BLOB_DESC_TYPE clones the lazily built Fields. These are frozen legacy shapes, not a new writer design boundary. (rust/lance-core/src/datatypes.rs:30-49)

### Lines 50-82

V2 logical minimal fields are ordered data:LargeBinary nullable and uri:Utf8 nullable. Complete logical fields append nullable position:UInt64 and size:UInt64. Documentation requires each non-null logical row to choose exactly one of data/uri, limits position/size to external-object ranges, and says provided range size must be positive. These statics declare Arrow shapes only; no row exclusivity/range validation occurs here. BLOB_V2_LOGICAL_TYPE wraps the complete four-field layout in Struct. (rust/lance-core/src/datatypes.rs:50-82)

### Lines 83-113

Writer-prepared v2 fields have fixed order kind:UInt8, data:LargeBinary, uri:Utf8, blob_id:UInt32, blob_size:UInt64, position:UInt64, all nullable. Comments distinguish Inline carrying data, Packed carrying id/position/size, Dedicated carrying id/size with position0, and External carrying URI, optional id and range information. External blob_size0 denotes whole-object length resolved on read. blob_size prevents confusion with logical range size; stored descriptor renames uri to blob_uri. BLOB_V2_PREPARED_TYPE is the Struct of these fields; runtime routing/length resolution is not implemented here. (rust/lance-core/src/datatypes.rs:83-113)

### Lines 114-150

The source explicitly declares the stored descriptor field names part of the stable file format. Stored v2 descriptor fields, in order, are kind:UInt8, position:UInt64, size:UInt64, blob_id:UInt32, blob_uri:Utf8; all five children are non-nullable. Comments define Inline main-file out-of-line range, Packed shared sidecar range, Dedicated whole raw sidecar with position0, External URI/id plus optional range and size0 whole-object resolution. BLOB_V2_DESC_FIELD has name description, non-nullable outer field, BLOB_META_KEY=true and lance-encoding:packed=true. Its Lance Field conversion unwraps. These declarations and comments do not prove a release/version gate or that every writer enforces all meanings. (rust/lance-core/src/datatypes.rs:114-150)

### Lines 151-188

Public non-exhaustive BlobV2Layout has Logical, Prepared and Descriptor. classify(&Fields)->Option<Self> first recognizes logical forms, then prepared with strict child nullability, then descriptor ignoring child nullability. Comparisons ignore metadata throughout. The descriptor exception is documented for released schemas that represented null blobs using nullable kind versus parent struct validity. It is a structural classifier, not a data-value validator or an extension-name check. (rust/lance-core/src/datatypes.rs:151-188)

### Lines 189-218

BlobV2Layout Display emits logical, prepared or descriptor. Private blob_v2_field_matches compares exact name and DataType and optionally nullability, ignoring metadata. blob_v2_fields_match requires equal child count and ordered pairwise matches. Thus neither reordering nor width substitution is accepted, while arbitrary child metadata can be accepted. (rust/lance-core/src/datatypes.rs:189-218)

### Lines 219-240

Private logical classifier first checks the exact two-field minimal shape with nullability enforced; otherwise requires exactly the full four-field count and ordered names/types. In the full shape, nullable comparison is enforced only for data and uri, so position and size may be nullable or required. Deprecated public BLOB_V2_USER_FIELDS and BLOB_V2_USER_TYPE re-export the logical fields/type as aliases; they are not independent layouts. (rust/lance-core/src/datatypes.rs:219-240)

### Lines 241-279

BLOB_LOGICAL_TYPE is blob. Public LogicalType wraps a private String and derives Debug, Clone, PartialEq and DeepSizeOf; its Display writes that string. Exact internal predicates recognize list/list.struct, large_list/large_list.struct, blob and map; fixed-size-list-of-struct detection uses prefix fixed_size_list:struct:. Public is_struct tests exact struct. These recognizers do not validate child counts or dimension values. (rust/lance-core/src/datatypes.rs:241-279)

### Lines 280-305

From<&str> for LogicalType copies text without validation. timeunit_to_str maps Second/Millisecond/Microsecond/Nanosecond to s/ms/us/ns. is_supported_fixed_size_list_child rejects List, LargeList and Map; allows Struct only when not nested inside another fixed-size list; recurses into FixedSizeList with nested=true; all other DataType variants pass this structural precheck and may still fail later conversion. Immediate fixed-size-list Struct is allowed, nested fixed-size-list Struct is not. (rust/lance-core/src/datatypes.rs:280-305)

### Lines 306-344

parse_timeunit accepts only s/ms/us/ns and otherwise returns Error::arrow. Arrow-to-LogicalType uses Error as its associated error. Primitive spellings are null, bool, int8/uint8 through int64/uint64, halffloat/float/double; decimal strings encode bit width, precision and scale. Utf8View normalizes to string, BinaryView to binary; normal/large string and binary remain distinct. Date32/Date64 encode day/ms; Time32/Time64 use time32/time64:unit. This arm does not validate whether an arbitrarily constructed Time32/Time64 has an Arrow-valid unit; inverse conversion recognizes only the listed valid literal units at rust/lance-core/src/datatypes.rs:421-454. (rust/lance-core/src/datatypes.rs:306-344)

### Lines 345-378

Timestamp encoding is timestamp:unit:timezone; absent timezone uses -, present timezone text is verbatim. Duration uses duration:unit; Struct uses struct. Dictionary first converts value and index types, constructs dict:value:index:false, then immediately parses the result back through DataType::try_from. Failure becomes Error::schema explaining the type/string does not parse back, preventing a later Field::data_type unwrap on strings that embed unrepresentable colon-separated components or child-dependent types. The check is parse success, not exact Arrow identity (views normalize). List/LargeList distinguish a Struct element with .struct suffix; they do not inline the child logical type. View normalization is explicit at rust/lance-core/src/datatypes.rs:337-340. (rust/lance-core/src/datatypes.rs:345-378)

### Lines 379-414

FixedSizeList with a bfloat16-marked child uses fixed_size_list:lance.bfloat16:size, deliberately retaining the extension namespace to avoid collision with a future non-identical built-in bfloat16 type. Other children first pass the structural support check, then recursively encode their logical string followed by size. Immediate struct children are represented using separately retained Field children, as implemented in rust/lance-core/src/datatypes/field.rs:1207-1231. FixedSizeBinary uses fixed_size_binary:size. No positivity check is performed here. Map with keys_sorted=true is rejected with a schema error because Python Arrow loses that flag; false becomes map. Other unsupported Arrow types return a descriptive schema error. Map entries validation belongs to Field conversion, not this match. (rust/lance-core/src/datatypes.rs:379-414)

### Lines 415-454

LogicalType-to-Arrow conversion directly matches the primitive spellings, valid Time32 seconds/milliseconds, valid Time64 microseconds/nanoseconds and all four duration units. blob and json both become LargeBinary. Bare struct/list/map need Field children and are not handled by this literal conversion. The inverse returns Arrow types, not original view representations or arbitrary field metadata. (rust/lance-core/src/datatypes.rs:415-454)

### Lines 455-491

Fallback splits the string on colon. fixed_size_list requires at least three parts, parses the final part as i32 and rejoins all middle parts to support nested logical strings. The bfloat16 extension name creates nullable item:FixedSizeBinary(2) with ARROW extension name and empty extension metadata; other children recursively parse and become a nullable field named item. Original child names/nullability/metadata are not recovered by this string alone. Parse errors become schema errors; negative/zero list sizes are not rejected here. (rust/lance-core/src/datatypes.rs:455-491)

### Lines 492-513

fixed_size_binary requires exactly two parts and an i32 size; invalid integer/part count yields schema error, but size positivity is not checked. dict requires exactly four colon-separated parts, recursively parses value from part1 and index from part2, and constructs Dictionary(index,value). Part3 is ignored: parser does not validate that it is false or even a boolean. Colon-containing component types cannot fit this four-part grammar. No integer-only dictionary-key validation is performed in this parser. (rust/lance-core/src/datatypes.rs:492-513)

### Lines 514-538

decimal requires exactly four parts and parses bit width as i16, precision as u8, scale as i8, reporting each parse failure as schema error. Width128/256 selects Decimal128/Decimal256; other widths yield a descriptive unsupported-decimal error. Arrow semantic precision/scale bounds beyond these integer representations are not checked here. (rust/lance-core/src/datatypes.rs:514-538)

### Lines 539-559

timestamp requires at least three parts, parses the unit with parse_timeunit and rejoins every remaining timezone fragment with colon, preserving offsets such as +08:00. Exactly - maps to None; every other string, including an empty string, becomes Some without timezone validation. Consequently a deliberately supplied Some(-) cannot remain distinct from None through this grammar. Unsupported logical text yields Error::schema, while unsupported timestamp unit comes from Error::arrow. These are source-derived edges, not all covered by tests below. (rust/lance-core/src/datatypes.rs:539-559)

### Lines 560-577

Public Dictionary derives Debug, Clone, Default and exposes offset:usize, length:usize, values:Option<ArrayRef>. Its DeepSizeOf implementation delegates to the loaded values' deep children when Some and returns0 when None, with the supplied shared accounting context; it does not add its inline offset/length storage as children. (rust/lance-core/src/datatypes.rs:560-577)

### Lines 578-593

Dictionary PartialEq compares Arrow array values when both sides are loaded, ignoring their offsets/lengths; if both values are None, equality requires matching offsets and lengths; mixed loaded/unloaded is false. Comments explain why incoming write dictionaries with zero placement should equal persisted loaded dictionaries at real offsets, while unloaded equality must remain reflexive. This equality affects schema dictionary comparison when enabled. (rust/lance-core/src/datatypes.rs:578-593)

### Lines 594-630

Public repr(u8) BlobKind encodes Inline=0, Packed=1, Dedicated=2, External=3. Documentation describes External blob_id0 as absolute URI, id>0 as URI relative to manifest.base_paths[blob_id], and optional range position default0. TryFrom<u8> accepts only0..3 and otherwise returns Error::invalid_input_source wrapping the unknown numeric value in its message. The conversion classifies kind only; it does not resolve URI, inspect id, or validate payload/range fields. (rust/lance-core/src/datatypes.rs:594-630)

### Lines 631-674

Private tests import Arrow arrays/schema and rstest. dict builds a loaded StringArray dictionary with requested offset/length. Eight parameterized equality cases cover default reflexivity, equal unloaded placement, differing unloaded offset or length, equal/different loaded arrays, loaded-versus-unloaded, and loaded equality despite placement differences. Each case asserts both comparison orders; these are source assertions, not executed results. (rust/lance-core/src/datatypes.rs:631-674)

### Lines 675-698

test_manifest_derived_dictionary_schemas_compare_equal constructs a dictionary field with values=None, offset12, length2, clones its schema, enables dictionary comparison and asserts compare true/explanation None. Despite the manifest-oriented name/comment, this test does not serialize or load a historical manifest fixture; it models its unloaded metadata in memory. (rust/lance-core/src/datatypes.rs:675-698)

### Lines 699-718

Blob classifier test asserts both minimal and complete logical layouts classify Logical, prepared classifies Prepared and stored descriptor classifies Descriptor. It checks declared shapes, not logical row content or writer output. (rust/lance-core/src/datatypes.rs:699-718)

### Lines 719-769

Structural-contract test accepts required position/size in full logical input, accepts prepared child metadata, and accepts descriptor children made nullable. A descriptor whose size child becomes UInt32 is rejected. Together these assertions pin metadata/nullability exceptions and exact numeric width, but do not validate actual null row representations. (rust/lance-core/src/datatypes.rs:719-769)

### Lines 770-797

Timestamp roundtrip parameterization covers four units without timezone plus UTC, a named region and positive/negative offsets including colon-separated forms. It converts Arrow type to logical string and back and asserts exact type equality. No timezone validity service or locale conversion is involved. (rust/lance-core/src/datatypes.rs:770-797)

### Lines 798-828

Dictionary value roundtrip cases cover string/binary, large variants, Int32, Float64 and Utf8View/BinaryView. Expected value types explicitly normalize view variants to their base types while retaining the UInt32 key; parse-back validation therefore promises representability, not lossless view identity. (rust/lance-core/src/datatypes.rs:798-828)

### Lines 829-849

Dictionary index roundtrip parameterization spans all eight signed/unsigned integer key types with Utf8 values and asserts equality after logical encoding/decoding. These fixtures do not establish rejection of non-integer yet parseable dictionary key types. (rust/lance-core/src/datatypes.rs:829-849)

### Lines 850-903

Dictionary rejection cases cover colon-bearing/child-dependent values: decimal, date, time, timestamps with/without offset, duration, fixed-size binary, nested dictionary, struct and list. Additional invalid index cases use decimal and dictionary. All assert a schema error containing does not parse back, pinning the early guard rather than waiting for Field::data_type to panic. (rust/lance-core/src/datatypes.rs:850-903)

### Lines 904-941

Timestamp encoding assertions pin exact strings for absent/named/offset timezones, including the - sentinel. Direct parser cases assert the inverse for named and offset forms. Case arrays retain exact expected spelling and unit; joining timezone fragments after the second colon is essential. (rust/lance-core/src/datatypes.rs:904-941)

### Lines 942-971

Field roundtrip checks a timestamp with +08:00 through Lance Field and back to ArrowField. Schema roundtrip checks offset and named timezone fields together. These exercise child-independent logical strings through higher-level conversion, but do not substitute for complete schema implementation review. (rust/lance-core/src/datatypes.rs:942-971)

### Lines 972-985

Four invalid timestamp strings (bare prefix, missing timezone, unknown unit with named/offset timezone) assert only that parsing fails. This file has no BlobKind invalid-byte test or general value-level blob invariant test. Tests were read in full but not run; caller-level validation, format-version gates and on-disk encoding remain outside this file. (rust/lance-core/src/datatypes.rs:972-985)

## Interaction and interpretation limits

All declarations and tests in this file were read. Local interaction: Field uses these layouts and conversions and can unwrap the inverse (rust/lance-core/src/datatypes/field.rs:170-195); dictionary logical conversion therefore probes parseability (rust/lance-core/src/datatypes.rs:354-370). Schema implementation is now separately analyzed at rust/lance-core/src/datatypes/schema.rs:1-3225. Arrow extension helpers, downstream blob writer/reader behavior, current writer emission/version gates and whole-repository callers remain pending. No runtime tests were executed. Public statics/enum variants are schemas or documented semantics, not proof of value validation.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Lance data types, [Schema] and [Field]
    5 | 
    6 | use std::collections::HashMap;
    7 | use std::fmt::{self, Debug, Formatter};
    8 | use std::sync::{Arc, LazyLock};
    9 | 
   10 | use crate::deepsize::DeepSizeOf;
   11 | use arrow_array::ArrayRef;
   12 | use arrow_schema::{DataType, Field as ArrowField, Fields, TimeUnit};
   13 | use lance_arrow::bfloat16::{BFLOAT16_EXT_NAME, is_bfloat16_field};
   14 | use lance_arrow::{ARROW_EXT_META_KEY, ARROW_EXT_NAME_KEY};
   15 | 
   16 | mod field;
   17 | mod schema;
   18 | 
   19 | use crate::{Error, Result};
   20 | pub use field::{
   21 |     BlobVersion, Encoding, Field, LANCE_FIELD_ID_KEY, LANCE_UNENFORCED_CLUSTERING_KEY_POSITION,
   22 |     LANCE_UNENFORCED_PRIMARY_KEY, LANCE_UNENFORCED_PRIMARY_KEY_POSITION, NullabilityComparison,
   23 |     OnTypeMismatch, SchemaCompareOptions,
   24 | };
   25 | pub use schema::{
   26 |     BlobHandling, FieldRef, OnMissing, Projectable, Projection, Schema,
   27 |     escape_field_path_for_project, format_field_path, format_field_path_minimal, parse_field_path,
   28 |     validate_fixed_size_list_dimensions,
   29 | };
   30 | 
   31 | pub static BLOB_DESC_FIELDS: LazyLock<Fields> = LazyLock::new(|| {
   32 |     Fields::from(vec![
   33 |         ArrowField::new("position", DataType::UInt64, true),
   34 |         ArrowField::new("size", DataType::UInt64, true),
   35 |     ])
   36 | });
   37 | 
   38 | pub static BLOB_DESC_TYPE: LazyLock<DataType> =
   39 |     LazyLock::new(|| DataType::Struct(BLOB_DESC_FIELDS.clone()));
   40 | 
   41 | pub static BLOB_DESC_FIELD: LazyLock<ArrowField> = LazyLock::new(|| {
   42 |     ArrowField::new("description", BLOB_DESC_TYPE.clone(), true).with_metadata(HashMap::from([(
   43 |         lance_arrow::BLOB_META_KEY.to_string(),
   44 |         "true".to_string(),
   45 |     )]))
   46 | });
   47 | 
   48 | pub static BLOB_DESC_LANCE_FIELD: LazyLock<Field> =
   49 |     LazyLock::new(|| Field::try_from(&*BLOB_DESC_FIELD).unwrap());
   50 | 
   51 | /// The minimal logical blob v2 fields accepted from writers.
   52 | ///
   53 | /// Logical values may also use [`BLOB_V2_LOGICAL_FIELDS`] when an external
   54 | /// object range is present.
   55 | pub static BLOB_V2_LOGICAL_MINIMAL_FIELDS: LazyLock<Fields> = LazyLock::new(|| {
   56 |     Fields::from(vec![
   57 |         ArrowField::new("data", DataType::LargeBinary, true),
   58 |         ArrowField::new("uri", DataType::Utf8, true),
   59 |     ])
   60 | });
   61 | 
   62 | /// The complete logical blob v2 fields used for writer input and rewrite output.
   63 | ///
   64 | /// `position` and `size` are an optional range within the external object named
   65 | /// by `uri`; when present, `size` must be greater than zero. Every non-null row
   66 | /// must set exactly one of `data` and `uri`. These fields do not describe
   67 | /// Lance-managed data, packed, or dedicated storage.
   68 | pub static BLOB_V2_LOGICAL_FIELDS: LazyLock<Fields> = LazyLock::new(|| {
   69 |     let mut fields = BLOB_V2_LOGICAL_MINIMAL_FIELDS
   70 |         .iter()
   71 |         .cloned()
   72 |         .collect::<Vec<_>>();
   73 |     fields.extend([
   74 |         Arc::new(ArrowField::new("position", DataType::UInt64, true)),
   75 |         Arc::new(ArrowField::new("size", DataType::UInt64, true)),
   76 |     ]);
   77 |     Fields::from(fields)
   78 | });
   79 | 
   80 | /// The complete logical blob v2 struct type.
   81 | pub static BLOB_V2_LOGICAL_TYPE: LazyLock<DataType> =
   82 |     LazyLock::new(|| DataType::Struct(BLOB_V2_LOGICAL_FIELDS.clone()));
   83 | 
   84 | /// Writer-prepared blob v2 fields consumed by the structural encoder.
   85 | ///
   86 | /// The populated fields depend on [`BlobKind`]:
   87 | ///
   88 | /// - [`BlobKind::Inline`] carries `data`; the encoder derives the stored
   89 | ///   `position` and `size` from the out-of-line buffer it creates.
   90 | /// - [`BlobKind::Packed`] carries `blob_id`, `position`, and `blob_size`.
   91 | /// - [`BlobKind::Dedicated`] carries `blob_id` and `blob_size`; its stored
   92 | ///   `position` is zero.
   93 | /// - [`BlobKind::External`] carries `uri`, optional `blob_id`, `position`, and
   94 | ///   `blob_size`. A zero `blob_size` is resolved to the complete external object
   95 | ///   length when read.
   96 | ///
   97 | /// `blob_size` is distinct from the logical `size`, which is only an optional
   98 | /// external-object range before preparation. For external blobs, `uri` is
   99 | /// normalized into the stable stored `blob_uri` field.
  100 | pub static BLOB_V2_PREPARED_FIELDS: LazyLock<Fields> = LazyLock::new(|| {
  101 |     Fields::from(vec![
  102 |         ArrowField::new("kind", DataType::UInt8, true),
  103 |         ArrowField::new("data", DataType::LargeBinary, true),
  104 |         ArrowField::new("uri", DataType::Utf8, true),
  105 |         ArrowField::new("blob_id", DataType::UInt32, true),
  106 |         ArrowField::new("blob_size", DataType::UInt64, true),
  107 |         ArrowField::new("position", DataType::UInt64, true),
  108 |     ])
  109 | });
  110 | 
  111 | /// The writer-prepared blob v2 struct type.
  112 | pub static BLOB_V2_PREPARED_TYPE: LazyLock<DataType> =
  113 |     LazyLock::new(|| DataType::Struct(BLOB_V2_PREPARED_FIELDS.clone()));
  114 | 
  115 | /// Stored blob v2 descriptor fields.
  116 | ///
  117 | /// These field names are part of the stable file format. Their meaning depends
  118 | /// on `kind`:
  119 | ///
  120 | /// - [`BlobKind::Inline`]: `position` and `size` locate an out-of-line buffer in
  121 | ///   the Lance data file.
  122 | /// - [`BlobKind::Packed`]: `blob_id` identifies a shared packed blob file, and
  123 | ///   `position` and `size` locate a range within it.
  124 | /// - [`BlobKind::Dedicated`]: `blob_id` identifies a dedicated raw blob file,
  125 | ///   `position` is zero, and `size` is the complete file length.
  126 | /// - [`BlobKind::External`]: `blob_uri` and `blob_id` identify the object, while
  127 | ///   `position` and `size` select a range. A zero `size` is resolved to the
  128 | ///   object's complete length when read.
  129 | pub static BLOB_V2_DESC_FIELDS: LazyLock<Fields> = LazyLock::new(|| {
  130 |     Fields::from(vec![
  131 |         ArrowField::new("kind", DataType::UInt8, false),
  132 |         ArrowField::new("position", DataType::UInt64, false),
  133 |         ArrowField::new("size", DataType::UInt64, false),
  134 |         ArrowField::new("blob_id", DataType::UInt32, false),
  135 |         ArrowField::new("blob_uri", DataType::Utf8, false),
  136 |     ])
  137 | });
  138 | 
  139 | pub static BLOB_V2_DESC_TYPE: LazyLock<DataType> =
  140 |     LazyLock::new(|| DataType::Struct(BLOB_V2_DESC_FIELDS.clone()));
  141 | 
  142 | pub static BLOB_V2_DESC_FIELD: LazyLock<ArrowField> = LazyLock::new(|| {
  143 |     ArrowField::new("description", BLOB_V2_DESC_TYPE.clone(), false).with_metadata(HashMap::from([
  144 |         (lance_arrow::BLOB_META_KEY.to_string(), "true".to_string()),
  145 |         ("lance-encoding:packed".to_string(), "true".to_string()),
  146 |     ]))
  147 | });
  148 | 
  149 | pub static BLOB_V2_DESC_LANCE_FIELD: LazyLock<Field> =
  150 |     LazyLock::new(|| Field::try_from(&*BLOB_V2_DESC_FIELD).unwrap());
  151 | 
  152 | /// The in-memory representation of a blob v2 struct.
  153 | #[non_exhaustive]
  154 | #[derive(Debug, Clone, Copy, PartialEq, Eq)]
  155 | pub enum BlobV2Layout {
  156 |     /// Writer input or rewrite output.
  157 |     ///
  158 |     /// Both the minimal `data, uri` fields and the complete
  159 |     /// `data, uri, position, size` fields have this layout.
  160 |     Logical,
  161 |     /// Kind-aware writer intermediate consumed by the structural encoder.
  162 |     Prepared,
  163 |     /// Stable descriptor stored in Lance files and returned by descriptor scans.
  164 |     Descriptor,
  165 | }
  166 | 
  167 | impl BlobV2Layout {
  168 |     /// Classify blob v2 child fields by name, type, order, and layout-specific
  169 |     /// nullability requirements.
  170 |     ///
  171 |     /// Child metadata is not part of the representation. The complete logical
  172 |     /// layout also accepts non-nullable `position` and `size` fields, matching
  173 |     /// the existing writer-input contract. Descriptor child nullability is
  174 |     /// ignored because it changed across released schemas; row nullness has
  175 |     /// been represented by either parent struct validity or a nullable `kind`
  176 |     /// child.
  177 |     pub fn classify(fields: &Fields) -> Option<Self> {
  178 |         if logical_blob_v2_fields_match(fields) {
  179 |             Some(Self::Logical)
  180 |         } else if blob_v2_fields_match(fields, &BLOB_V2_PREPARED_FIELDS, true) {
  181 |             Some(Self::Prepared)
  182 |         } else if blob_v2_fields_match(fields, &BLOB_V2_DESC_FIELDS, false) {
  183 |             Some(Self::Descriptor)
  184 |         } else {
  185 |             None
  186 |         }
  187 |     }
  188 | }
  189 | 
  190 | impl fmt::Display for BlobV2Layout {
  191 |     fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
  192 |         match self {
  193 |             Self::Logical => write!(f, "logical"),
  194 |             Self::Prepared => write!(f, "prepared"),
  195 |             Self::Descriptor => write!(f, "descriptor"),
  196 |         }
  197 |     }
  198 | }
  199 | 
  200 | fn blob_v2_field_matches(
  201 |     actual: &ArrowField,
  202 |     expected: &ArrowField,
  203 |     compare_nullability: bool,
  204 | ) -> bool {
  205 |     actual.name() == expected.name()
  206 |         && actual.data_type() == expected.data_type()
  207 |         && (!compare_nullability || actual.is_nullable() == expected.is_nullable())
  208 | }
  209 | 
  210 | fn blob_v2_fields_match(actual: &Fields, expected: &Fields, compare_nullability: bool) -> bool {
  211 |     actual.len() == expected.len()
  212 |         && actual
  213 |             .iter()
  214 |             .zip(expected.iter())
  215 |             .all(|(actual, expected)| {
  216 |                 blob_v2_field_matches(actual.as_ref(), expected.as_ref(), compare_nullability)
  217 |             })
  218 | }
  219 | 
  220 | fn logical_blob_v2_fields_match(fields: &Fields) -> bool {
  221 |     if blob_v2_fields_match(fields, &BLOB_V2_LOGICAL_MINIMAL_FIELDS, true) {
  222 |         return true;
  223 |     }
  224 |     fields.len() == BLOB_V2_LOGICAL_FIELDS.len()
  225 |         && fields
  226 |             .iter()
  227 |             .zip(BLOB_V2_LOGICAL_FIELDS.iter())
  228 |             .enumerate()
  229 |             .all(|(index, (actual, expected))| {
  230 |                 blob_v2_field_matches(actual.as_ref(), expected.as_ref(), index < 2)
  231 |             })
  232 | }
  233 | 
  234 | /// Deprecated name for [`BLOB_V2_LOGICAL_FIELDS`].
  235 | #[deprecated(note = "use BLOB_V2_LOGICAL_FIELDS")]
  236 | pub use self::BLOB_V2_LOGICAL_FIELDS as BLOB_V2_USER_FIELDS;
  237 | 
  238 | /// Deprecated name for [`BLOB_V2_LOGICAL_TYPE`].
  239 | #[deprecated(note = "use BLOB_V2_LOGICAL_TYPE")]
  240 | pub use self::BLOB_V2_LOGICAL_TYPE as BLOB_V2_USER_TYPE;
  241 | 
  242 | pub const BLOB_LOGICAL_TYPE: &str = "blob";
  243 | 
  244 | /// LogicalType is a string presentation of arrow type.
  245 | /// to be serialized into protobuf.
  246 | #[derive(Debug, Clone, PartialEq, DeepSizeOf)]
  247 | pub struct LogicalType(String);
  248 | 
  249 | impl fmt::Display for LogicalType {
  250 |     fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
  251 |         write!(f, "{}", self.0)
  252 |     }
  253 | }
  254 | 
  255 | impl LogicalType {
  256 |     fn is_list(&self) -> bool {
  257 |         self.0 == "list" || self.0 == "list.struct"
  258 |     }
  259 | 
  260 |     fn is_large_list(&self) -> bool {
  261 |         self.0 == "large_list" || self.0 == "large_list.struct"
  262 |     }
  263 | 
  264 |     fn is_fixed_size_list_struct(&self) -> bool {
  265 |         self.0.starts_with("fixed_size_list:struct:")
  266 |     }
  267 | 
  268 |     pub fn is_struct(&self) -> bool {
  269 |         self.0 == "struct"
  270 |     }
  271 | 
  272 |     fn is_blob(&self) -> bool {
  273 |         self.0 == BLOB_LOGICAL_TYPE
  274 |     }
  275 | 
  276 |     fn is_map(&self) -> bool {
  277 |         self.0 == "map"
  278 |     }
  279 | }
  280 | 
  281 | impl From<&str> for LogicalType {
  282 |     fn from(s: &str) -> Self {
  283 |         Self(s.to_string())
  284 |     }
  285 | }
  286 | 
  287 | fn timeunit_to_str(unit: &TimeUnit) -> &'static str {
  288 |     match unit {
  289 |         TimeUnit::Second => "s",
  290 |         TimeUnit::Millisecond => "ms",
  291 |         TimeUnit::Microsecond => "us",
  292 |         TimeUnit::Nanosecond => "ns",
  293 |     }
  294 | }
  295 | 
  296 | fn is_supported_fixed_size_list_child(data_type: &DataType, nested: bool) -> bool {
  297 |     match data_type {
  298 |         DataType::Struct(_) => !nested,
  299 |         DataType::List(_) | DataType::LargeList(_) | DataType::Map(_, _) => false,
  300 |         DataType::FixedSizeList(field, _) => {
  301 |             is_supported_fixed_size_list_child(field.data_type(), true)
  302 |         }
  303 |         _ => true,
  304 |     }
  305 | }
  306 | 
  307 | fn parse_timeunit(unit: &str) -> Result<TimeUnit> {
  308 |     match unit {
  309 |         "s" => Ok(TimeUnit::Second),
  310 |         "ms" => Ok(TimeUnit::Millisecond),
  311 |         "us" => Ok(TimeUnit::Microsecond),
  312 |         "ns" => Ok(TimeUnit::Nanosecond),
  313 |         _ => Err(Error::arrow(format!("Unsupported TimeUnit: {unit}"))),
  314 |     }
  315 | }
  316 | 
  317 | impl TryFrom<&DataType> for LogicalType {
  318 |     type Error = Error;
  319 | 
  320 |     fn try_from(dt: &DataType) -> Result<Self> {
  321 |         let type_str = match dt {
  322 |             DataType::Null => "null".to_string(),
  323 |             DataType::Boolean => "bool".to_string(),
  324 |             DataType::Int8 => "int8".to_string(),
  325 |             DataType::UInt8 => "uint8".to_string(),
  326 |             DataType::Int16 => "int16".to_string(),
  327 |             DataType::UInt16 => "uint16".to_string(),
  328 |             DataType::Int32 => "int32".to_string(),
  329 |             DataType::UInt32 => "uint32".to_string(),
  330 |             DataType::Int64 => "int64".to_string(),
  331 |             DataType::UInt64 => "uint64".to_string(),
  332 |             DataType::Float16 => "halffloat".to_string(),
  333 |             DataType::Float32 => "float".to_string(),
  334 |             DataType::Float64 => "double".to_string(),
  335 |             DataType::Decimal128(precision, scale) => format!("decimal:128:{precision}:{scale}"),
  336 |             DataType::Decimal256(precision, scale) => format!("decimal:256:{precision}:{scale}"),
  337 |             DataType::Utf8 | DataType::Utf8View => "string".to_string(),
  338 |             DataType::Binary | DataType::BinaryView => "binary".to_string(),
  339 |             DataType::LargeUtf8 => "large_string".to_string(),
  340 |             DataType::LargeBinary => "large_binary".to_string(),
  341 |             DataType::Date32 => "date32:day".to_string(),
  342 |             DataType::Date64 => "date64:ms".to_string(),
  343 |             DataType::Time32(tu) => format!("time32:{}", timeunit_to_str(tu)),
  344 |             DataType::Time64(tu) => format!("time64:{}", timeunit_to_str(tu)),
  345 |             DataType::Timestamp(tu, tz) => format!(
  346 |                 "timestamp:{}:{}",
  347 |                 timeunit_to_str(tu),
  348 |                 tz.as_ref()
  349 |                     .map(|v| v.to_string())
  350 |                     .unwrap_or("-".to_string())
  351 |             ),
  352 |             DataType::Duration(tu) => format!("duration:{}", timeunit_to_str(tu)),
  353 |             DataType::Struct(_) => "struct".to_string(),
  354 |             DataType::Dictionary(key_type, value_type) => {
  355 |                 let value_logical = Self::try_from(value_type.as_ref())?.0;
  356 |                 let index_logical = Self::try_from(key_type.as_ref())?.0;
  357 |                 let logical_type = format!("dict:{value_logical}:{index_logical}:false");
  358 |                 // `dict:{value}:{index}:false` inlines both component strings, but
  359 |                 // the parser splits on ':', requires exactly four segments, and
  360 |                 // resolves only leaf types - so a component carrying ':' of its own
  361 |                 // (decimal, timestamp, ...) or a struct/list value composes a string
  362 |                 // it can never parse back. `Field::data_type` unwraps that parse, so
  363 |                 // without this check `Schema::try_from` panics instead of erroring.
  364 |                 if DataType::try_from(&Self::from(logical_type.as_str())).is_err() {
  365 |                     return Err(Error::schema(format!(
  366 |                         "Cannot encode dictionary type {dt:?}: the logical type \"{logical_type}\" does not parse back"
  367 |                     )));
  368 |                 }
  369 |                 logical_type
  370 |             }
  371 |             DataType::List(elem) => match elem.data_type() {
  372 |                 DataType::Struct(_) => "list.struct".to_string(),
  373 |                 _ => "list".to_string(),
  374 |             },
  375 |             DataType::LargeList(elem) => match elem.data_type() {
  376 |                 DataType::Struct(_) => "large_list.struct".to_string(),
  377 |                 _ => "large_list".to_string(),
  378 |             },
  379 |             DataType::FixedSizeList(field, len) => {
  380 |                 if is_bfloat16_field(field) {
  381 |                     // Don't want to directly use `bfloat16`, in case a built-in type is added
  382 |                     // that isn't identical to our extension type.
  383 |                     format!("fixed_size_list:lance.bfloat16:{}", *len)
  384 |                 } else if !is_supported_fixed_size_list_child(field.data_type(), false) {
  385 |                     return Err(Error::schema(format!("Unsupported data type: {:?}", dt)));
  386 |                 } else {
  387 |                     format!(
  388 |                         "fixed_size_list:{}:{}",
  389 |                         Self::try_from(field.data_type())?.0,
  390 |                         *len
  391 |                     )
  392 |                 }
  393 |             }
  394 |             DataType::FixedSizeBinary(len) => format!("fixed_size_binary:{}", *len),
  395 |             DataType::Map(_, keys_sorted) => {
  396 |                 // TODO: We only support keys_sorted=false for now,
  397 |                 //  because converting a rust arrow map field to the python arrow field will
  398 |                 //  lose the keys_sorted property.
  399 |                 if *keys_sorted {
  400 |                     return Err(Error::schema(format!(
  401 |                         "Unsupported map data type with keys_sorted=true: {:?}",
  402 |                         dt
  403 |                     )));
  404 |                 }
  405 |                 "map".to_string()
  406 |             }
  407 |             _ => {
  408 |                 return Err(Error::schema(format!("Unsupported data type: {:?}", dt)));
  409 |             }
  410 |         };
  411 | 
  412 |         Ok(Self(type_str))
  413 |     }
  414 | }
  415 | 
  416 | impl TryFrom<&LogicalType> for DataType {
  417 |     type Error = Error;
  418 | 
  419 |     fn try_from(lt: &LogicalType) -> Result<Self> {
  420 |         use DataType::*;
  421 |         if let Some(t) = match lt.0.as_str() {
  422 |             "null" => Some(Null),
  423 |             "bool" => Some(Boolean),
  424 |             "int8" => Some(Int8),
  425 |             "uint8" => Some(UInt8),
  426 |             "int16" => Some(Int16),
  427 |             "uint16" => Some(UInt16),
  428 |             "int32" => Some(Int32),
  429 |             "uint32" => Some(UInt32),
  430 |             "int64" => Some(Int64),
  431 |             "uint64" => Some(UInt64),
  432 |             "halffloat" => Some(Float16),
  433 |             "float" => Some(Float32),
  434 |             "double" => Some(Float64),
  435 |             "string" => Some(Utf8),
  436 |             "binary" => Some(Binary),
  437 |             "large_string" => Some(LargeUtf8),
  438 |             "large_binary" => Some(LargeBinary),
  439 |             BLOB_LOGICAL_TYPE => Some(LargeBinary),
  440 |             "json" => Some(LargeBinary),
  441 |             "date32:day" => Some(Date32),
  442 |             "date64:ms" => Some(Date64),
  443 |             "time32:s" => Some(Time32(TimeUnit::Second)),
  444 |             "time32:ms" => Some(Time32(TimeUnit::Millisecond)),
  445 |             "time64:us" => Some(Time64(TimeUnit::Microsecond)),
  446 |             "time64:ns" => Some(Time64(TimeUnit::Nanosecond)),
  447 |             "duration:s" => Some(Duration(TimeUnit::Second)),
  448 |             "duration:ms" => Some(Duration(TimeUnit::Millisecond)),
  449 |             "duration:us" => Some(Duration(TimeUnit::Microsecond)),
  450 |             "duration:ns" => Some(Duration(TimeUnit::Nanosecond)),
  451 |             _ => None,
  452 |         } {
  453 |             Ok(t)
  454 |         } else {
  455 |             let splits = lt.0.split(':').collect::<Vec<_>>();
  456 |             match splits[0] {
  457 |                 "fixed_size_list" => {
  458 |                     if splits.len() < 3 {
  459 |                         return Err(Error::schema(format!("Unsupported logical type: {}", lt)));
  460 |                     }
  461 | 
  462 |                     let size: i32 = splits
  463 |                         .last()
  464 |                         .unwrap()
  465 |                         .parse::<i32>()
  466 |                         .map_err(|e: _| Error::schema(e.to_string()))?;
  467 | 
  468 |                     let inner_type = splits[1..splits.len() - 1].join(":");
  469 | 
  470 |                     match inner_type.as_str() {
  471 |                         BFLOAT16_EXT_NAME => {
  472 |                             let field = ArrowField::new("item", Self::FixedSizeBinary(2), true)
  473 |                                 .with_metadata(
  474 |                                     [
  475 |                                         (ARROW_EXT_NAME_KEY.into(), BFLOAT16_EXT_NAME.into()),
  476 |                                         (ARROW_EXT_META_KEY.into(), "".into()),
  477 |                                     ]
  478 |                                     .into(),
  479 |                                 );
  480 |                             Ok(FixedSizeList(Arc::new(field), size))
  481 |                         }
  482 |                         data_type => {
  483 |                             let elem_type = (&LogicalType(data_type.to_string())).try_into()?;
  484 | 
  485 |                             Ok(FixedSizeList(
  486 |                                 Arc::new(ArrowField::new("item", elem_type, true)),
  487 |                                 size,
  488 |                             ))
  489 |                         }
  490 |                     }
  491 |                 }
  492 |                 "fixed_size_binary" => {
  493 |                     if splits.len() != 2 {
  494 |                         Err(Error::schema(format!("Unsupported logical type: {}", lt)))
  495 |                     } else {
  496 |                         let size: i32 = splits[1]
  497 |                             .parse::<i32>()
  498 |                             .map_err(|e: _| Error::schema(e.to_string()))?;
  499 |                         Ok(FixedSizeBinary(size))
  500 |                     }
  501 |                 }
  502 |                 "dict" => {
  503 |                     if splits.len() != 4 {
  504 |                         Err(Error::schema(format!(
  505 |                             "Unsupported dictionary type: {}",
  506 |                             lt
  507 |                         )))
  508 |                     } else {
  509 |                         let value_type: Self = (&LogicalType::from(splits[1])).try_into()?;
  510 |                         let index_type: Self = (&LogicalType::from(splits[2])).try_into()?;
  511 |                         Ok(Dictionary(Box::new(index_type), Box::new(value_type)))
  512 |                     }
  513 |                 }
  514 |                 "decimal" => {
  515 |                     if splits.len() != 4 {
  516 |                         Err(Error::schema(format!("Unsupported decimal type: {}", lt)))
  517 |                     } else {
  518 |                         let bits: i16 = splits[1]
  519 |                             .parse::<i16>()
  520 |                             .map_err(|err| Error::schema(err.to_string()))?;
  521 |                         let precision: u8 = splits[2]
  522 |                             .parse::<u8>()
  523 |                             .map_err(|err| Error::schema(err.to_string()))?;
  524 |                         let scale: i8 = splits[3]
  525 |                             .parse::<i8>()
  526 |                             .map_err(|err| Error::schema(err.to_string()))?;
  527 | 
  528 |                         if bits == 128 {
  529 |                             Ok(Decimal128(precision, scale))
  530 |                         } else if bits == 256 {
  531 |                             Ok(Decimal256(precision, scale))
  532 |                         } else {
  533 |                             Err(Error::schema(format!(
  534 |                                 "Only Decimal128 and Decimal256 is supported. Found {bits}"
  535 |                             )))
  536 |                         }
  537 |                     }
  538 |                 }
  539 |                 "timestamp" => {
  540 |                     if splits.len() < 3 {
  541 |                         Err(Error::schema(format!("Unsupported timestamp type: {}", lt)))
  542 |                     } else {
  543 |                         let timeunit = parse_timeunit(splits[1])?;
  544 |                         // A fixed-offset timezone such as "+08:00" contains a colon, so the
  545 |                         // trailing segments must be rejoined instead of read as a single one.
  546 |                         let tz_str = splits[2..].join(":");
  547 |                         let tz: Option<Arc<str>> = if tz_str == "-" {
  548 |                             None
  549 |                         } else {
  550 |                             Some(tz_str.into())
  551 |                         };
  552 |                         Ok(Timestamp(timeunit, tz))
  553 |                     }
  554 |                 }
  555 |                 _ => Err(Error::schema(format!("Unsupported logical type: {}", lt))),
  556 |             }
  557 |         }
  558 |     }
  559 | }
  560 | 
  561 | #[derive(Debug, Clone, Default)]
  562 | pub struct Dictionary {
  563 |     pub offset: usize,
  564 | 
  565 |     pub length: usize,
  566 | 
  567 |     pub values: Option<ArrayRef>,
  568 | }
  569 | 
  570 | impl DeepSizeOf for Dictionary {
  571 |     fn deep_size_of_children(&self, context: &mut crate::deepsize::Context) -> usize {
  572 |         self.values
  573 |             .as_ref()
  574 |             .map(|v| (v.as_ref() as &dyn arrow_array::Array).deep_size_of_children(context))
  575 |             .unwrap_or(0)
  576 |     }
  577 | }
  578 | 
  579 | impl PartialEq for Dictionary {
  580 |     fn eq(&self, other: &Self) -> bool {
  581 |         // Compare the values when both sides have them: the write path leaves
  582 |         // offset/length at 0 until the dictionary is persisted, so one append
  583 |         // can legitimately hold the same dictionary at two positions.
  584 |         // `From<&pb::Dictionary>` yields no values at all, and comparing only
  585 |         // the values made that case non-reflexive, so there offset and length
  586 |         // stand in for the content.
  587 |         match (&self.values, &other.values) {
  588 |             (Some(a), Some(b)) => a == b,
  589 |             (None, None) => self.offset == other.offset && self.length == other.length,
  590 |             _ => false,
  591 |         }
  592 |     }
  593 | }
  594 | 
  595 | /// Physical storage mode for blob v2 descriptors (one byte, stored in the packed struct column).
  596 | #[derive(Debug, Clone, Copy, PartialEq, Eq)]
  597 | #[repr(u8)]
  598 | pub enum BlobKind {
  599 |     /// Stored in the main data file’s out-of-line buffer; `position`/`size` point into that file.
  600 |     Inline = 0,
  601 |     /// Stored in a shared packed blob file; `position`/`size` locate the slice, `blob_id` selects the file.
  602 |     Packed = 1,
  603 |     /// Stored in a dedicated raw blob file; `blob_id` identifies the file, `size` is the full file length.
  604 |     Dedicated = 2,
  605 |     /// Not stored by Lance data files.
  606 |     ///
  607 |     /// For external blobs:
  608 |     /// - `blob_id == 0` means `blob_uri` is an absolute external URI.
  609 |     /// - `blob_id > 0` means `blob_uri` is a path relative to `manifest.base_paths[blob_id]`.
  610 |     ///
  611 |     /// External blobs can have a position and a size. If the position is not set,
  612 |     /// it defaults to 0, which points to the beginning of the blob.
  613 |     External = 3,
  614 | }
  615 | 
  616 | impl TryFrom<u8> for BlobKind {
  617 |     type Error = Error;
  618 | 
  619 |     fn try_from(value: u8) -> Result<Self> {
  620 |         match value {
  621 |             0 => Ok(Self::Inline),
  622 |             1 => Ok(Self::Packed),
  623 |             2 => Ok(Self::Dedicated),
  624 |             3 => Ok(Self::External),
  625 |             other => Err(Error::invalid_input_source(
  626 |                 format!("Unknown blob kind {other:?}").into(),
  627 |             )),
  628 |         }
  629 |     }
  630 | }
  631 | 
  632 | #[cfg(test)]
  633 | mod tests {
  634 |     use super::*;
  635 |     use arrow_schema::Schema as ArrowSchema;
  636 |     use rstest::rstest;
  637 | 
  638 |     fn dict(offset: usize, length: usize, values: Option<Vec<&str>>) -> Dictionary {
  639 |         Dictionary {
  640 |             offset,
  641 |             length,
  642 |             values: values.map(|v| Arc::new(arrow_array::StringArray::from(v)) as ArrayRef),
  643 |         }
  644 |     }
  645 | 
  646 |     /// The manifest schema stores a dictionary as offset/length with no attached
  647 |     /// values, so equality has to be reflexive over value-less dictionaries and
  648 |     /// still separate different positions. `set_dictionary_values` leaves
  649 |     /// offset/length at 0 until the dictionary is persisted, so for an in-memory
  650 |     /// pair the values array is all there is to compare.
  651 |     #[rstest]
  652 |     #[case::reflexive_default(Dictionary::default(), Dictionary::default(), true)]
  653 |     #[case::same_position_no_values(dict(4, 2, None), dict(4, 2, None), true)]
  654 |     #[case::different_offset(dict(4, 2, None), dict(8, 2, None), false)]
  655 |     #[case::different_length(dict(4, 2, None), dict(4, 3, None), false)]
  656 |     #[case::same_values(dict(0, 0, Some(vec!["a", "b"])), dict(0, 0, Some(vec!["a", "b"])), true)]
  657 |     #[case::different_values(dict(0, 0, Some(vec!["a", "b"])), dict(0, 0, Some(vec!["a", "c"])), false)]
  658 |     #[case::values_on_one_side_only(dict(4, 2, Some(vec!["a", "b"])), dict(4, 2, None), false)]
  659 |     // One side of a V1 append holds the incoming dictionary at 0/0 and the other
  660 |     // holds the persisted one at its real position, so equal values must win
  661 |     // over the differing offsets.
  662 |     #[case::same_values_different_offset(
  663 |         dict(0, 0, Some(vec!["a", "b"])),
  664 |         dict(8, 2, Some(vec!["a", "b"])),
  665 |         true
  666 |     )]
  667 |     fn test_dictionary_partial_eq_contract(
  668 |         #[case] left: Dictionary,
  669 |         #[case] right: Dictionary,
  670 |         #[case] is_equal: bool,
  671 |     ) {
  672 |         assert_eq!(left == right, is_equal, "{left:?} vs {right:?}");
  673 |         assert_eq!(right == left, is_equal, "equality must be symmetric");
  674 |     }
  675 | 
  676 |     /// `From<&pb::Dictionary>` restores offset and length with no values, so two
  677 |     /// schemas read back from a manifest have to compare equal. Otherwise merge
  678 |     /// validation reports a phantom dictionary change for every such field.
  679 |     #[test]
  680 |     fn test_manifest_derived_dictionary_schemas_compare_equal() {
  681 |         let arrow = ArrowSchema::new(vec![ArrowField::new(
  682 |             "d",
  683 |             DataType::Dictionary(Box::new(DataType::UInt32), Box::new(DataType::Utf8)),
  684 |             true,
  685 |         )]);
  686 |         let mut left = Schema::try_from(&arrow).unwrap();
  687 |         left.fields[0].dictionary = Some(dict(12, 2, None));
  688 |         let right = left.clone();
  689 | 
  690 |         assert_eq!(left, right);
  691 |         let compare_dictionary = SchemaCompareOptions {
  692 |             compare_dictionary: true,
  693 |             ..Default::default()
  694 |         };
  695 |         assert!(left.compare_with_options(&right, &compare_dictionary));
  696 |         assert_eq!(left.explain_difference(&right, &compare_dictionary), None);
  697 |     }
  698 | 
  699 |     #[test]
  700 |     fn test_classify_blob_v2_layouts() {
  701 |         assert_eq!(
  702 |             BlobV2Layout::classify(&BLOB_V2_LOGICAL_MINIMAL_FIELDS),
  703 |             Some(BlobV2Layout::Logical)
  704 |         );
  705 |         assert_eq!(
  706 |             BlobV2Layout::classify(&BLOB_V2_LOGICAL_FIELDS),
  707 |             Some(BlobV2Layout::Logical)
  708 |         );
  709 |         assert_eq!(
  710 |             BlobV2Layout::classify(&BLOB_V2_PREPARED_FIELDS),
  711 |             Some(BlobV2Layout::Prepared)
  712 |         );
  713 |         assert_eq!(
  714 |             BlobV2Layout::classify(&BLOB_V2_DESC_FIELDS),
  715 |             Some(BlobV2Layout::Descriptor)
  716 |         );
  717 |     }
  718 | 
  719 |     #[test]
  720 |     fn test_classify_blob_v2_layout_uses_structural_contract() {
  721 |         let logical_with_required_range = Fields::from(vec![
  722 |             ArrowField::new("data", DataType::LargeBinary, true),
  723 |             ArrowField::new("uri", DataType::Utf8, true),
  724 |             ArrowField::new("position", DataType::UInt64, false),
  725 |             ArrowField::new("size", DataType::UInt64, false),
  726 |         ]);
  727 |         assert_eq!(
  728 |             BlobV2Layout::classify(&logical_with_required_range),
  729 |             Some(BlobV2Layout::Logical)
  730 |         );
  731 | 
  732 |         let prepared_with_child_metadata =
  733 |             Fields::from(
  734 |                 BLOB_V2_PREPARED_FIELDS
  735 |                     .iter()
  736 |                     .map(|field| {
  737 |                         Arc::new(field.as_ref().clone().with_metadata(HashMap::from([(
  738 |                             "source".to_string(),
  739 |                             "test".to_string(),
  740 |                         )])))
  741 |                     })
  742 |                     .collect::<Vec<_>>(),
  743 |             );
  744 |         assert_eq!(
  745 |             BlobV2Layout::classify(&prepared_with_child_metadata),
  746 |             Some(BlobV2Layout::Prepared)
  747 |         );
  748 | 
  749 |         let nullable_descriptor = Fields::from(
  750 |             BLOB_V2_DESC_FIELDS
  751 |                 .iter()
  752 |                 .map(|field| Arc::new(field.as_ref().clone().with_nullable(true)))
  753 |                 .collect::<Vec<_>>(),
  754 |         );
  755 |         assert_eq!(
  756 |             BlobV2Layout::classify(&nullable_descriptor),
  757 |             Some(BlobV2Layout::Descriptor)
  758 |         );
  759 | 
  760 |         let malformed_descriptor = Fields::from(vec![
  761 |             ArrowField::new("kind", DataType::UInt8, false),
  762 |             ArrowField::new("position", DataType::UInt64, false),
  763 |             ArrowField::new("size", DataType::UInt32, false),
  764 |             ArrowField::new("blob_id", DataType::UInt32, false),
  765 |             ArrowField::new("blob_uri", DataType::Utf8, false),
  766 |         ]);
  767 |         assert_eq!(BlobV2Layout::classify(&malformed_descriptor), None);
  768 |     }
  769 | 
  770 |     /// The `timestamp:<unit>:<timezone>` encoding embeds the timezone verbatim, so a
  771 |     /// fixed-offset zone such as `+08:00` contributes a colon of its own. Round-tripping
  772 |     /// every timezone shape guards the parser against splitting on that colon.
  773 |     #[rstest]
  774 |     #[case::second_no_timezone(TimeUnit::Second, None)]
  775 |     #[case::millisecond_no_timezone(TimeUnit::Millisecond, None)]
  776 |     #[case::microsecond_no_timezone(TimeUnit::Microsecond, None)]
  777 |     #[case::nanosecond_no_timezone(TimeUnit::Nanosecond, None)]
  778 |     #[case::named_utc(TimeUnit::Microsecond, Some("UTC"))]
  779 |     #[case::named_region(TimeUnit::Nanosecond, Some("America/Los_Angeles"))]
  780 |     #[case::offset_without_colon(TimeUnit::Microsecond, Some("+0800"))]
  781 |     #[case::offset_positive(TimeUnit::Microsecond, Some("+08:00"))]
  782 |     #[case::offset_negative(TimeUnit::Millisecond, Some("-05:00"))]
  783 |     #[case::offset_half_hour(TimeUnit::Nanosecond, Some("+05:30"))]
  784 |     #[case::offset_zero(TimeUnit::Second, Some("+00:00"))]
  785 |     fn test_timestamp_logical_type_round_trip(
  786 |         #[case] timeunit: TimeUnit,
  787 |         #[case] timezone: Option<&str>,
  788 |     ) {
  789 |         let data_type = DataType::Timestamp(timeunit, timezone.map(Arc::from));
  790 |         let logical_type = LogicalType::try_from(&data_type).unwrap();
  791 |         assert_eq!(
  792 |             DataType::try_from(&logical_type).unwrap(),
  793 |             data_type,
  794 |             "logical type: {logical_type}"
  795 |         );
  796 |     }
  797 | 
  798 |     /// The `dict:{value}:{index}:false` encoding inlines both component logical
  799 |     /// strings, but the parser splits on ':' and requires exactly four segments.
  800 |     /// These value types keep the count at four, so they must keep working.
  801 |     #[rstest]
  802 |     #[case::string(DataType::Utf8, DataType::Utf8)]
  803 |     #[case::large_string(DataType::LargeUtf8, DataType::LargeUtf8)]
  804 |     #[case::binary(DataType::Binary, DataType::Binary)]
  805 |     #[case::large_binary(DataType::LargeBinary, DataType::LargeBinary)]
  806 |     #[case::int32(DataType::Int32, DataType::Int32)]
  807 |     #[case::double(DataType::Float64, DataType::Float64)]
  808 |     // The View variants share the `string` and `binary` logical types, so they
  809 |     // parse back as their non-View counterparts. That normalization is why the
  810 |     // encoder checks whether the composed string parses, not whether it round
  811 |     // trips to the same `DataType`.
  812 |     #[case::utf8_view(DataType::Utf8View, DataType::Utf8)]
  813 |     #[case::binary_view(DataType::BinaryView, DataType::Binary)]
  814 |     fn test_dictionary_logical_type_round_trip(
  815 |         #[case] value_type: DataType,
  816 |         #[case] parsed_value_type: DataType,
  817 |     ) {
  818 |         let key = Box::new(DataType::UInt8);
  819 |         let logical_type =
  820 |             LogicalType::try_from(&DataType::Dictionary(key.clone(), Box::new(value_type)))
  821 |                 .unwrap();
  822 |         assert_eq!(
  823 |             DataType::try_from(&logical_type).unwrap(),
  824 |             DataType::Dictionary(key, Box::new(parsed_value_type)),
  825 |             "logical type: {logical_type}"
  826 |         );
  827 |     }
  828 | 
  829 |     /// Every integer index type has a colon-free logical string, so none of them
  830 |     /// may be caught by the rejection above.
  831 |     #[rstest]
  832 |     fn test_dictionary_logical_type_accepts_every_integer_index(
  833 |         #[values(
  834 |             DataType::Int8,
  835 |             DataType::Int16,
  836 |             DataType::Int32,
  837 |             DataType::Int64,
  838 |             DataType::UInt8,
  839 |             DataType::UInt16,
  840 |             DataType::UInt32,
  841 |             DataType::UInt64
  842 |         )]
  843 |         key_type: DataType,
  844 |     ) {
  845 |         let data_type = DataType::Dictionary(Box::new(key_type), Box::new(DataType::Utf8));
  846 |         let logical_type = LogicalType::try_from(&data_type).unwrap();
  847 |         assert_eq!(DataType::try_from(&logical_type).unwrap(), data_type);
  848 |     }
  849 | 
  850 |     #[rstest]
  851 |     #[case::decimal(DataType::Decimal128(10, 2))]
  852 |     #[case::date32(DataType::Date32)]
  853 |     #[case::time32(DataType::Time32(TimeUnit::Second))]
  854 |     #[case::timestamp(DataType::Timestamp(TimeUnit::Microsecond, None))]
  855 |     #[case::timestamp_with_zone(DataType::Timestamp(
  856 |         TimeUnit::Microsecond,
  857 |         Some(Arc::from("+08:00"))
  858 |     ))]
  859 |     #[case::duration(DataType::Duration(TimeUnit::Second))]
  860 |     #[case::fixed_size_binary(DataType::FixedSizeBinary(16))]
  861 |     #[case::nested_dict(DataType::Dictionary(Box::new(DataType::UInt8), Box::new(DataType::Utf8)))]
  862 |     // `struct` and `list` keep the segment count at four, but the parser has no
  863 |     // arm for them: they only become a `DataType` through a field's children,
  864 |     // which this encoding cannot carry.
  865 |     #[case::struct_value(DataType::Struct(Fields::from(vec![ArrowField::new(
  866 |         "x",
  867 |         DataType::Int32,
  868 |         true
  869 |     )])))]
  870 |     #[case::list_value(DataType::List(Arc::new(ArrowField::new("item", DataType::Int32, true))))]
  871 |     fn test_dictionary_logical_type_rejects_unparsable_value(#[case] value_type: DataType) {
  872 |         let data_type = DataType::Dictionary(Box::new(DataType::UInt8), Box::new(value_type));
  873 |         let err = LogicalType::try_from(&data_type)
  874 |             .expect_err("a dictionary whose logical type cannot parse back must not encode");
  875 |         assert!(
  876 |             matches!(err, Error::Schema { .. }),
  877 |             "unexpected error: {err}"
  878 |         );
  879 |         assert!(
  880 |             err.to_string().contains("does not parse back"),
  881 |             "unexpected error: {err}"
  882 |         );
  883 |     }
  884 | 
  885 |     /// The index type is inlined in the same string, so an index type carrying
  886 |     /// ':' is just as unparsable as such a value type.
  887 |     #[rstest]
  888 |     #[case::decimal_index(DataType::Decimal128(10, 2))]
  889 |     #[case::dict_index(DataType::Dictionary(Box::new(DataType::UInt8), Box::new(DataType::Utf8)))]
  890 |     fn test_dictionary_logical_type_rejects_unparsable_index(#[case] key_type: DataType) {
  891 |         let data_type = DataType::Dictionary(Box::new(key_type), Box::new(DataType::Utf8));
  892 |         let err = LogicalType::try_from(&data_type)
  893 |             .expect_err("a dictionary whose logical type cannot parse back must not encode");
  894 |         assert!(
  895 |             matches!(err, Error::Schema { .. }),
  896 |             "unexpected error: {err}"
  897 |         );
  898 |         assert!(
  899 |             err.to_string().contains("does not parse back"),
  900 |             "unexpected error: {err}"
  901 |         );
  902 |     }
  903 | 
  904 |     /// Pins the on-disk spelling as well as the round trip: the timezone is written
  905 |     /// verbatim, which is why the parser cannot assume a fixed segment count.
  906 |     #[rstest]
  907 |     #[case::no_timezone(TimeUnit::Second, None, "timestamp:s:-")]
  908 |     #[case::named_utc(TimeUnit::Millisecond, Some("UTC"), "timestamp:ms:UTC")]
  909 |     #[case::offset_positive(TimeUnit::Microsecond, Some("+08:00"), "timestamp:us:+08:00")]
  910 |     #[case::offset_negative(TimeUnit::Nanosecond, Some("-05:00"), "timestamp:ns:-05:00")]
  911 |     fn test_timestamp_logical_type_encoding(
  912 |         #[case] timeunit: TimeUnit,
  913 |         #[case] timezone: Option<&str>,
  914 |         #[case] expected: &str,
  915 |     ) {
  916 |         let data_type = DataType::Timestamp(timeunit, timezone.map(Arc::from));
  917 |         assert_eq!(
  918 |             LogicalType::try_from(&data_type).unwrap().to_string(),
  919 |             expected
  920 |         );
  921 |     }
  922 | 
  923 |     /// Opening an existing dataset parses the stored string directly, so cover that
  924 |     /// direction on its own rather than only as half of a round trip.
  925 |     #[rstest]
  926 |     #[case::offset_positive("timestamp:us:+08:00", TimeUnit::Microsecond, Some("+08:00"))]
  927 |     #[case::offset_negative("timestamp:ms:-05:00", TimeUnit::Millisecond, Some("-05:00"))]
  928 |     #[case::offset_half_hour("timestamp:ns:+05:30", TimeUnit::Nanosecond, Some("+05:30"))]
  929 |     #[case::named_utc("timestamp:s:UTC", TimeUnit::Second, Some("UTC"))]
  930 |     #[case::no_timezone("timestamp:us:-", TimeUnit::Microsecond, None)]
  931 |     fn test_parse_timestamp_logical_type(
  932 |         #[case] encoded: &str,
  933 |         #[case] timeunit: TimeUnit,
  934 |         #[case] timezone: Option<&str>,
  935 |     ) {
  936 |         assert_eq!(
  937 |             DataType::try_from(&LogicalType::from(encoded)).unwrap(),
  938 |             DataType::Timestamp(timeunit, timezone.map(Arc::from))
  939 |         );
  940 |     }
  941 | 
  942 |     /// `Field::data_type` unwraps the parse, so a timezone it cannot read surfaces as a
  943 |     /// panic instead of an error. Walk the Arrow -> Lance -> Arrow trip end to end.
  944 |     #[test]
  945 |     fn test_field_round_trip_with_fixed_offset_timezone() {
  946 |         let data_type = DataType::Timestamp(TimeUnit::Microsecond, Some("+08:00".into()));
  947 |         let arrow_field = ArrowField::new("ts", data_type.clone(), true);
  948 |         let field = Field::try_from(&arrow_field).unwrap();
  949 |         assert_eq!(field.data_type(), data_type);
  950 |         assert_eq!(ArrowField::from(&field), arrow_field);
  951 |     }
  952 | 
  953 |     /// The conversion a write performs, mixing both timezone spellings in one schema.
  954 |     #[test]
  955 |     fn test_schema_round_trip_with_fixed_offset_timezone() {
  956 |         let arrow_schema = ArrowSchema::new(vec![
  957 |             ArrowField::new(
  958 |                 "ts_offset",
  959 |                 DataType::Timestamp(TimeUnit::Microsecond, Some("+08:00".into())),
  960 |                 true,
  961 |             ),
  962 |             ArrowField::new(
  963 |                 "ts_named",
  964 |                 DataType::Timestamp(TimeUnit::Nanosecond, Some("UTC".into())),
  965 |                 true,
  966 |             ),
  967 |         ]);
  968 |         let schema = Schema::try_from(&arrow_schema).unwrap();
  969 |         assert_eq!(ArrowSchema::from(&schema), arrow_schema);
  970 |     }
  971 | 
  972 |     /// A timezone cannot be recovered from fewer than three segments, and an unknown
  973 |     /// time unit is still an error, so neither becomes collateral damage of the rejoin.
  974 |     #[rstest]
  975 |     #[case::unit_and_timezone_missing("timestamp")]
  976 |     #[case::timezone_missing("timestamp:us")]
  977 |     #[case::unknown_timeunit("timestamp:decade:UTC")]
  978 |     #[case::unknown_timeunit_with_offset("timestamp:decade:+08:00")]
  979 |     fn test_malformed_timestamp_logical_type_is_rejected(#[case] encoded: &str) {
  980 |         assert!(
  981 |             DataType::try_from(&LogicalType::from(encoded)).is_err(),
  982 |             "expected {encoded} to be rejected"
  983 |         );
  984 |     }
  985 | }
``````
