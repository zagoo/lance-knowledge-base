> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

# Core datatype and Field API

**Retained production-contract supplement.** This supplement covers the complete datatype facade and Field implementation, including their tests. Schema, Projection, field-path parsing and validation are now analyzed separately in the [schema supplement](rust-lance-core-schema.md). Earlier two-file scope limits below identify boundaries supplied by that supplement. The exact declaration catalog below is limited to the two reviewed files. (rust/lance-core/src/datatypes.rs:1-29; rust/lance-core/src/datatypes/field.rs:1-2241)

[Core module](rust-lance-core.md) · [Datatype L2](../L2-files/rust/lance-core/src/datatypes.rs.md) · [Field L2](../L2-files/rust/lance-core/src/datatypes/field.rs.md) · [Symbols](../L3-symbols/symbol-index.md) · [Format](../L3-symbols/format-spec.md) · [Pitfalls](../L4-crosscutting/pitfalls.md)

## Representation and responsibility

`Field` is a public, mutable tree whose public members include name/id/parent_id, logical string, metadata, encoding, nullability, children, optional dictionary and primary/clustering key positions. `LogicalType` hides its String member, but `From<&str>` accepts arbitrary text. Consequently public construction does not guarantee validity; `Field::data_type` is infallible in signature and can panic when parsing malformed logical strings or indexing absent children. Arrow-to-Field conversion is a fallible boundary with partial validation; it is not a substitute for the separate Schema validation layer described in the schema supplement. (rust/lance-core/src/datatypes/field.rs:134-195; rust/lance-core/src/datatypes.rs:250-291; rust/lance-core/src/datatypes/field.rs:1225-1338)

Private `field` and `schema` modules are hidden behind `lance_core::datatypes` re-exports. `Field` owns local tree operations and metadata transformations. It performs no storage IO, asynchronous work or synchronization in its defined methods. It depends on Arrow datatypes/array casts, `lance_arrow` extension/type helpers, core errors/truthy parsing, and schema comparison/projection helpers. Lazy blob statics use `LazyLock` and shared `Arc` fields; loaded dictionaries share `ArrayRef` values. (rust/lance-core/src/datatypes.rs:4-156; rust/lance-core/src/datatypes/field.rs:4-35; rust/lance-core/src/datatypes/field.rs:163-1369)

## Blob representations

Child order and types below are exact; `?` denotes nullable child. The source explicitly identifies stored v2 field names as part of the stable file format. These declarations do not prove a runtime version gate or value validator. (rust/lance-core/src/datatypes.rs:31-156)

| Shape | Ordered children | Declaration / classifier contract |
|---|---|---|
| Legacy descriptor | position:UInt64?, size:UInt64? | Outer canonical description field nullable, blob metadata; rust/lance-core/src/datatypes.rs:31-49 |
| V2 logical minimal | data:LargeBinary?, uri:Utf8? | Exact two-field order/type/nullability; rust/lance-core/src/datatypes.rs:51-60; rust/lance-core/src/datatypes.rs:226-237 |
| V2 logical complete | data:LargeBinary?, uri:Utf8?, position:UInt64?, size:UInt64? | Classifier additionally accepts required position/size; rust/lance-core/src/datatypes.rs:62-82; rust/lance-core/src/datatypes.rs:226-237 |
| V2 prepared | kind:UInt8?, data:LargeBinary?, uri:Utf8?, blob_id:UInt32?, blob_size:UInt64?, position:UInt64? | Strict child nullability, metadata ignored; rust/lance-core/src/datatypes.rs:84-116; rust/lance-core/src/datatypes.rs:173-224 |
| V2 stored descriptor | kind:UInt8, position:UInt64, size:UInt64, blob_id:UInt32, blob_uri:Utf8 | Canonical outer description field required and packed; classifier accepts nullable children for released representations; rust/lance-core/src/datatypes.rs:118-194 |

Logical input documentation requires each non-null row to set exactly one of data/uri. The optional position/size range describes external objects, with provided size>0. Prepared `blob_size` differs from this input `size`; the stored descriptor uses `blob_uri`. `BlobKind` codes are Inline0, Packed1, Dedicated2, External3; unknown bytes return an InvalidInput error through `invalid_input_source`. The comments define storage meanings and external base-path interpretation; concrete writing, reading and range validation remain pending. (rust/lance-core/src/datatypes.rs:62-143; rust/lance-core/src/datatypes.rs:601-649)

`Field::is_blob` accepts presence of the legacy blob metadata key even when its value is false, or the exact v2 extension name. `is_blob_v2` accepts the extension marker or a blob-marked descriptor matching child names/types. Thus `unloaded_mut` can replace the entire metadata map with descriptor metadata and still retain v2 recognition. It preserves outer identity/nullability but introduces synthetic unassigned child IDs. `apply_projection` treats Maps and blobs atomically by parent ID, preserving those children across repeated projection. (rust/lance-core/src/datatypes/field.rs:274-310; rust/lance-core/src/datatypes/field.rs:548-567; rust/lance-core/src/datatypes/field.rs:623-658; rust/lance-core/src/datatypes/field.rs:2203-2241)

`promote_blob_v2` converts legacy blobs to the minimal logical v2 shape and recursively handles non-blob containers; callers persisting the result must assign child IDs. `binary_blob_mut` keeps the v2 extension marker while switching the logical type to LargeBinary and clearing children. `unload_blobs_recursive` directly unloads only v2 blobs; its test explicitly keeps a legacy blob as LargeBinary. These operations have different metadata effects and must not be substituted mechanically. (rust/lance-core/src/datatypes/field.rs:569-695; rust/lance-core/src/datatypes/field.rs:2134-2180)

## Logical type strings and conversion failures

Primitive spellings and the complete grammar are in [the format supplement](../L3-symbols/format-spec.md). Utf8View/BinaryView normalize to Utf8/Binary. `json` and `blob` decode as LargeBinary. Containers require separately retained Field children except scalar/nested fixed-size-list logical strings. Timezones are verbatim strings joined after `timestamp:unit:`; `-` is the no-timezone sentinel, and timezone validity is not checked. Size/precision integer parsing does not enforce all Arrow semantic bounds. (rust/lance-core/src/datatypes.rs:323-565; rust/lance-core/src/datatypes/field.rs:170-195)

Dictionary logical strings are `dict:value:index:false`, with exactly four colon-delimited components on decode. The last component is ignored by the parser. The encoder probes successful inverse parsing, rejecting colon-bearing or child-dependent components early; it allows view normalization and is not an exact-identity or integer-key validator. The tests cover every integer key and representative supported/rejected values. (rust/lance-core/src/datatypes.rs:360-376; rust/lance-core/src/datatypes.rs:508-519; rust/lance-core/src/datatypes.rs:818-922)

`Dictionary` equality compares loaded values only when both are present, unloaded offset/length when both are absent, and rejects mixed states. `Field::set_dictionary_values` stores an Arc clone with zero placement after a dictionary-type assertion. Recursive `set_dictionary` supports integer-key dictionaries, Struct, List and LargeList; it does not descend into Map/FixedSizeList. It uses Arrow casts, indexing and unwrap, so a mismatched array/schema may panic. (rust/lance-core/src/datatypes.rs:567-599; rust/lance-core/src/datatypes/field.rs:455-522)

## Comparison and tree operations

Derived `Field::PartialEq` compares the representation. Default `SchemaCompareOptions` instead ignores metadata, dictionaries and IDs, uses Strict nullability, and delegates child structure to schema helpers. OneWay nullability means a non-null actual can satisfy a nullable expected; not the reverse. Recognized minimal and complete v2 logical shapes compare only their shared prefix; two complete forms compare all four children. Parent IDs, encoding and separate key-position members are not directly compared by `compare_with_options`. (rust/lance-core/src/datatypes/field.rs:72-103; rust/lance-core/src/datatypes/field.rs:134-161; rust/lance-core/src/datatypes/field.rs:312-440; rust/lance-core/src/datatypes/field.rs:603-621)

| Operation | Concrete local contract | Evidence |
|---|---|---|
| merge_with_reference | Uses reference order and current child heads; unsorted/unmatched heads can cause omissions; Self parent properties win | rust/lance-core/src/datatypes/field.rs:202-272 |
| project(path) | Missing child yields Ok with empty children; empty path returns all children | rust/lance-core/src/datatypes/field.rs:697-725 |
| project_by_filter | Retains ancestors of selected descendants; skips parent predicate when children survive | rust/lance-core/src/datatypes/field.rs:727-747 |
| project_by_ids | Parent-only selection retains all children even with include_all_children=false; selected descendants can trim | rust/lance-core/src/datatypes/field.rs:749-784 |
| project_by_field | Same-name requirement; blob-compatible shortcut; primitive/binary-like mismatches error before TakeSelf fallback; Struct follows Other child order | rust/lance-core/src/datatypes/field.rs:786-867 |
| resolve / resolve_case_insensitive | Mutate the queue/output even on failure; case-insensitive form prefers exact then first ASCII-folded match | rust/lance-core/src/datatypes/field.rs:869-911 |
| intersection / ignore_types | Name mismatch always errors; compatible blobs use whole-field ID preference, and the matching-container branch returns blob Self unchanged before recursion; non-blob Struct/List/Map drops child errors; other whole-field choice can favor Other when Self ID is negative | rust/lance-core/src/datatypes/field.rs:913-1010 |
| exclude | Subtracts matching child names; non-nested Self immediately returns None; no parent name/type check | rust/lance-core/src/datatypes/field.rs:1012-1046 |
| merge, pub(super) | Struct union; List/LargeList recursion; same-length FixedSizeList accepted without comparing element type; partial mutation possible before error | rust/lance-core/src/datatypes/field.rs:1048-1085 |
| field_by_id variants | Depth-first descendants only, excluding Self | rust/lance-core/src/datatypes/field.rs:1134-1172 |

These are local helper contracts, not claims that every public Dataset path exposes these edge cases. Callers may validate inputs or select a different helper; that caller review remains pending.

## IDs, metadata and boundary checks

Arrow import removes `lance:field_id`, parses i32 and clamps any negative to -1. Map import requires sorted=false, Struct entries, at least two children and a non-null first key, but does not enforce exactly two children or entries-field nullability here. Primary/clustering position parsing silently drops invalid u32 text; a truthy legacy primary-key flag supplies position0 when no parsed position exists. Schema import enforces primary-key leaf/non-null/List/LargeList/Map ancestry constraints, but not one-based position validity; see rust/lance-core/src/datatypes/schema.rs:883-956. (rust/lance-core/src/datatypes/field.rs:37-60; rust/lance-core/src/datatypes/field.rs:1225-1291)

`set_id` rewrites parent IDs, assigns only negative IDs and increments a caller-owned seed; it does not advance the seed for retained IDs or validate collisions/overflow. `reset_id` leaves parent IDs intact. Arrow export reconstructs datatypes and metadata but does not restore field-ID metadata or derive key-position metadata from the separate members. Moving through Arrow can therefore change representation details even if logical types remain equal. (rust/lance-core/src/datatypes/field.rs:1087-1132; rust/lance-core/src/datatypes/field.rs:1348-1369)

## Tests and extension obligations

Tests pin dictionary equality/parse-back behavior, timestamp offsets, blob classifiers, view normalization, map rejection, comparison diagnostics and repeated descriptor projection. They were read, not executed. Local uncovered edges include intersection child-error suppression, several partial map-validation constraints and non-integer-but-parseable dictionary keys; this is a statement about these test blocks, not the entire repository. (rust/lance-core/src/datatypes.rs:652-1005; rust/lance-core/src/datatypes/field.rs:1371-2241)

For a logical-type addition, coordinate both conversion directions, Field child representation/reconstruction, dictionary representability checks, metadata normalization and targeted roundtrip/rejection tests. For a blob extension, distinguish logical/prepared/stored shape and stable stored field names, then trace writer/encoder/reader implementations before claiming completion. The currently reviewed files provide these local seams but not the full registration/version/compatibility recipe. (rust/lance-core/src/datatypes.rs:118-194; rust/lance-core/src/datatypes.rs:323-565; rust/lance-core/src/datatypes/field.rs:170-195; rust/lance-core/src/datatypes/field.rs:1225-1369)

## Exact public declarations

The table is generated only from manually reviewed symbol locations, including explicit trait implementations and associated types. Struct members and enum variants are separate entries; full bodies/attributes remain in L2. Generic derives expose additional standard trait behavior as indicated by source attributes; this table does not expand generated method bodies. Schema-module re-exports have a separate exact catalog in the linked schema supplement.

<!-- datatype-api-table -->

122 explicit public records.

| Name | Exact declaration | Contract and evidence |
|---|---|---|
| `<arrow_schema::DataType as TryFrom<&lance_core::datatypes::LogicalType>>::Error` | `type Error = Error;` | [rust/lance-core/src/datatypes.rs:423-423](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `<arrow_schema::DataType as TryFrom<&lance_core::datatypes::LogicalType>>::try_from` | `fn try_from(lt: &LogicalType) -> Result<Self> {` | [rust/lance-core/src/datatypes.rs:425-425](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `<arrow_schema::Field as From<&lance_core::datatypes::Field>>::from` | `fn from(field: &Field) -> Self {` | [rust/lance-core/src/datatypes/field.rs:1349-1349](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `<lance_core::datatypes::BlobKind as TryFrom<u8>>::Error` | `type Error = Error;` | [rust/lance-core/src/datatypes.rs:635-635](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `<lance_core::datatypes::BlobKind as TryFrom<u8>>::try_from` | `fn try_from(value: u8) -> Result<Self> {` | [rust/lance-core/src/datatypes.rs:637-637](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `<lance_core::datatypes::BlobV2Layout as std::fmt::Display>::fmt` | `fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {` | [rust/lance-core/src/datatypes.rs:197-197](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `<lance_core::datatypes::Dictionary as lance_core::deepsize::DeepSizeOf>::deep_size_of_children` | `fn deep_size_of_children(&self, context: &mut crate::deepsize::Context) -> usize {` | [rust/lance-core/src/datatypes.rs:577-577](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `<lance_core::datatypes::Dictionary as PartialEq>::eq` | `fn eq(&self, other: &Self) -> bool {` | [rust/lance-core/src/datatypes.rs:586-586](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `<lance_core::datatypes::Field as std::fmt::Display>::fmt` | `fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {` | [rust/lance-core/src/datatypes/field.rs:1202-1202](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `<lance_core::datatypes::Field as TryFrom<&arrow_schema::Field>>::Error` | `type Error = Error;` | [rust/lance-core/src/datatypes/field.rs:1226-1226](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `<lance_core::datatypes::Field as TryFrom<&arrow_schema::Field>>::try_from` | `fn try_from(field: &ArrowField) -> Result<Self> {` | [rust/lance-core/src/datatypes/field.rs:1228-1228](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `<lance_core::datatypes::Field as TryFrom<arrow_schema::Field>>::Error` | `type Error = Error;` | [rust/lance-core/src/datatypes/field.rs:1341-1341](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `<lance_core::datatypes::Field as TryFrom<arrow_schema::Field>>::try_from` | `fn try_from(field: ArrowField) -> Result<Self> {` | [rust/lance-core/src/datatypes/field.rs:1343-1343](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `<lance_core::datatypes::LogicalType as From<&str>>::from` | `fn from(s: &str) -> Self {` | [rust/lance-core/src/datatypes.rs:288-288](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `<lance_core::datatypes::LogicalType as std::fmt::Display>::fmt` | `fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {` | [rust/lance-core/src/datatypes.rs:256-256](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `<lance_core::datatypes::LogicalType as TryFrom<&arrow_schema::DataType>>::Error` | `type Error = Error;` | [rust/lance-core/src/datatypes.rs:324-324](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `<lance_core::datatypes::LogicalType as TryFrom<&arrow_schema::DataType>>::try_from` | `fn try_from(dt: &DataType) -> Result<Self> {` | [rust/lance-core/src/datatypes.rs:326-326](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BLOB_DESC_FIELD` | `pub static BLOB_DESC_FIELD: LazyLock<ArrowField> = LazyLock::new(\|\| {` | [rust/lance-core/src/datatypes.rs:41-41](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BLOB_DESC_FIELDS` | `pub static BLOB_DESC_FIELDS: LazyLock<Fields> = LazyLock::new(\|\| {` | [rust/lance-core/src/datatypes.rs:31-31](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BLOB_DESC_LANCE_FIELD` | `pub static BLOB_DESC_LANCE_FIELD: LazyLock<Field> =     LazyLock::new(\|\| Field::try_from(&*BLOB_DESC_FIELD).unwrap());` | [rust/lance-core/src/datatypes.rs:48-49](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BLOB_DESC_TYPE` | `pub static BLOB_DESC_TYPE: LazyLock<DataType> =     LazyLock::new(\|\| DataType::Struct(BLOB_DESC_FIELDS.clone()));` | [rust/lance-core/src/datatypes.rs:38-39](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BLOB_LOGICAL_TYPE` | `pub const BLOB_LOGICAL_TYPE: &str = "blob";` | [rust/lance-core/src/datatypes.rs:248-248](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BLOB_V2_DESC_FIELD` | `pub static BLOB_V2_DESC_FIELD: LazyLock<ArrowField> = LazyLock::new(\|\| {` | [rust/lance-core/src/datatypes.rs:148-148](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BLOB_V2_DESC_FIELDS` | `pub static BLOB_V2_DESC_FIELDS: LazyLock<Fields> = LazyLock::new(\|\| {` | [rust/lance-core/src/datatypes.rs:135-135](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BLOB_V2_DESC_LANCE_FIELD` | `pub static BLOB_V2_DESC_LANCE_FIELD: LazyLock<Field> =     LazyLock::new(\|\| Field::try_from(&*BLOB_V2_DESC_FIELD).unwrap());` | [rust/lance-core/src/datatypes.rs:155-156](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BLOB_V2_DESC_TYPE` | `pub static BLOB_V2_DESC_TYPE: LazyLock<DataType> =     LazyLock::new(\|\| DataType::Struct(BLOB_V2_DESC_FIELDS.clone()));` | [rust/lance-core/src/datatypes.rs:145-146](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BLOB_V2_LOGICAL_FIELDS` | `pub static BLOB_V2_LOGICAL_FIELDS: LazyLock<Fields> = LazyLock::new(\|\| {` | [rust/lance-core/src/datatypes.rs:68-68](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BLOB_V2_LOGICAL_MINIMAL_FIELDS` | `pub static BLOB_V2_LOGICAL_MINIMAL_FIELDS: LazyLock<Fields> = LazyLock::new(\|\| {` | [rust/lance-core/src/datatypes.rs:55-55](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BLOB_V2_LOGICAL_TYPE` | `pub static BLOB_V2_LOGICAL_TYPE: LazyLock<DataType> =     LazyLock::new(\|\| DataType::Struct(BLOB_V2_LOGICAL_FIELDS.clone()));` | [rust/lance-core/src/datatypes.rs:81-82](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BLOB_V2_PREPARED_FIELDS` | `pub static BLOB_V2_PREPARED_FIELDS: LazyLock<Fields> = LazyLock::new(\|\| {` | [rust/lance-core/src/datatypes.rs:103-103](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BLOB_V2_PREPARED_TYPE` | `pub static BLOB_V2_PREPARED_TYPE: LazyLock<DataType> =     LazyLock::new(\|\| DataType::Struct(BLOB_V2_PREPARED_FIELDS.clone()));` | [rust/lance-core/src/datatypes.rs:115-116](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BLOB_V2_USER_FIELDS` | `pub use self::BLOB_V2_LOGICAL_FIELDS as BLOB_V2_USER_FIELDS;` | [rust/lance-core/src/datatypes.rs:242-242](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BLOB_V2_USER_TYPE` | `pub use self::BLOB_V2_LOGICAL_TYPE as BLOB_V2_USER_TYPE;` | [rust/lance-core/src/datatypes.rs:246-246](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BlobKind` | `pub enum BlobKind {` | [rust/lance-core/src/datatypes.rs:604-604](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BlobKind::Dedicated` | `Dedicated = 2,` | [rust/lance-core/src/datatypes.rs:610-610](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BlobKind::External` | `External = 3,` | [rust/lance-core/src/datatypes.rs:619-619](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BlobKind::Inline` | `Inline = 0,` | [rust/lance-core/src/datatypes.rs:606-606](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BlobKind::Packed` | `Packed = 1,` | [rust/lance-core/src/datatypes.rs:608-608](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BlobV2Layout` | `pub enum BlobV2Layout {` | [rust/lance-core/src/datatypes.rs:161-161](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BlobV2Layout::classify` | `pub fn classify(fields: &Fields) -> Option<Self> {` | [rust/lance-core/src/datatypes.rs:183-183](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BlobV2Layout::Descriptor` | `Descriptor,` | [rust/lance-core/src/datatypes.rs:170-170](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BlobV2Layout::Logical` | `Logical,` | [rust/lance-core/src/datatypes.rs:166-166](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BlobV2Layout::Prepared` | `Prepared,` | [rust/lance-core/src/datatypes.rs:168-168](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::BlobVersion` | `pub enum BlobVersion {` | [rust/lance-core/src/datatypes/field.rs:107-107](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::BlobVersion::V1` | `V1,` | [rust/lance-core/src/datatypes/field.rs:110-110](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::BlobVersion::V2` | `V2,` | [rust/lance-core/src/datatypes/field.rs:112-112](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Dictionary` | `pub struct Dictionary {` | [rust/lance-core/src/datatypes.rs:568-568](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::Dictionary::length` | `pub length: usize,` | [rust/lance-core/src/datatypes.rs:571-571](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::Dictionary::offset` | `pub offset: usize,` | [rust/lance-core/src/datatypes.rs:569-569](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::Dictionary::values` | `pub values: Option<ArrayRef>,` | [rust/lance-core/src/datatypes.rs:573-573](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::Encoding` | `pub enum Encoding {` | [rust/lance-core/src/datatypes/field.rs:116-116](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Encoding::Dictionary` | `Dictionary,` | [rust/lance-core/src/datatypes/field.rs:122-122](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Encoding::Plain` | `Plain,` | [rust/lance-core/src/datatypes/field.rs:118-118](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Encoding::RLE` | `RLE,` | [rust/lance-core/src/datatypes/field.rs:124-124](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Encoding::VarBinary` | `VarBinary,` | [rust/lance-core/src/datatypes/field.rs:120-120](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field` | `pub struct Field {` | [rust/lance-core/src/datatypes/field.rs:137-137](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::apply_projection` | `pub fn apply_projection(&self, projection: &Projection) -> Option<Self> {` | [rust/lance-core/src/datatypes/field.rs:274-274](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::binary_blob_mut` | `pub fn binary_blob_mut(&mut self) {` | [rust/lance-core/src/datatypes/field.rs:665-665](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::child` | `pub fn child(&self, name: &str) -> Option<&Self> {` | [rust/lance-core/src/datatypes/field.rs:447-447](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::child_mut` | `pub fn child_mut(&mut self, name: &str) -> Option<&mut Self> {` | [rust/lance-core/src/datatypes/field.rs:451-451](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::children` | `pub children: Vec<Self>,` | [rust/lance-core/src/datatypes/field.rs:147-147](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::compare_nullability` | `pub fn compare_nullability(         expected_nullability: bool,         actual_nullability: bool,         options: &SchemaCompareOptions,     ) -> bool {` | [rust/lance-core/src/datatypes/field.rs:411-415](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::compare_with_options` | `pub fn compare_with_options(&self, expected: &Self, options: &SchemaCompareOptions) -> bool {` | [rust/lance-core/src/datatypes/field.rs:423-423](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::data_type` | `pub fn data_type(&self) -> DataType {` | [rust/lance-core/src/datatypes/field.rs:171-171](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::dictionary` | `pub dictionary: Option<Dictionary>,` | [rust/lance-core/src/datatypes/field.rs:150-150](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::encoding` | `pub encoding: Option<Encoding>,` | [rust/lance-core/src/datatypes/field.rs:144-144](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::exclude` | `pub fn exclude(&self, other: &Self) -> Option<Self> {` | [rust/lance-core/src/datatypes/field.rs:1012-1012](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::explain_difference` | `pub fn explain_difference(         &self,         expected: &Self,         options: &SchemaCompareOptions,     ) -> Option<String> {` | [rust/lance-core/src/datatypes/field.rs:398-402](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::extension_name` | `pub fn extension_name(&self) -> Option<&str> {` | [rust/lance-core/src/datatypes/field.rs:443-443](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::field_by_id` | `pub fn field_by_id(&self, id: impl Into<i32>) -> Option<&Self> {` | [rust/lance-core/src/datatypes/field.rs:1147-1147](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::field_by_id_mut` | `pub fn field_by_id_mut(&mut self, id: impl Into<i32>) -> Option<&mut Self> {` | [rust/lance-core/src/datatypes/field.rs:1134-1134](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::has_dictionary_types` | `pub fn has_dictionary_types(&self) -> bool {` | [rust/lance-core/src/datatypes/field.rs:197-197](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::id` | `pub id: i32,` | [rust/lance-core/src/datatypes/field.rs:139-139](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::intersection` | `pub fn intersection(&self, other: &Self) -> Result<Self> {` | [rust/lance-core/src/datatypes/field.rs:1003-1003](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::intersection_ignore_types` | `pub fn intersection_ignore_types(&self, other: &Self) -> Result<Self> {` | [rust/lance-core/src/datatypes/field.rs:1008-1008](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::is_blob` | `pub fn is_blob(&self) -> bool {` | [rust/lance-core/src/datatypes/field.rs:551-551](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::is_blob_v2` | `pub fn is_blob_v2(&self) -> bool {` | [rust/lance-core/src/datatypes/field.rs:561-561](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::is_leaf` | `pub fn is_leaf(&self) -> bool {` | [rust/lance-core/src/datatypes/field.rs:1187-1187](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::is_packed_struct` | `pub fn is_packed_struct(&self) -> bool {` | [rust/lance-core/src/datatypes/field.rs:1175-1175](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::is_unenforced_clustering_key` | `pub fn is_unenforced_clustering_key(&self) -> bool {` | [rust/lance-core/src/datatypes/field.rs:1196-1196](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::is_unenforced_primary_key` | `pub fn is_unenforced_primary_key(&self) -> bool {` | [rust/lance-core/src/datatypes/field.rs:1192-1192](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::logical_type` | `pub logical_type: LogicalType,` | [rust/lance-core/src/datatypes/field.rs:142-142](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::merge_with_reference` | `pub fn merge_with_reference(&self, other: &Self, reference: &Self) -> Self {` | [rust/lance-core/src/datatypes/field.rs:214-214](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::metadata` | `pub metadata: HashMap<String, String>,` | [rust/lance-core/src/datatypes/field.rs:143-143](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::name` | `pub name: String,` | [rust/lance-core/src/datatypes/field.rs:138-138](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::new_arrow` | `pub fn new_arrow(name: &str, data_type: DataType, nullable: bool) -> Result<Self> {` | [rust/lance-core/src/datatypes/field.rs:166-166](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::nullable` | `pub nullable: bool,` | [rust/lance-core/src/datatypes/field.rs:145-145](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::parent_id` | `pub parent_id: i32,` | [rust/lance-core/src/datatypes/field.rs:141-141](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::project` | `pub fn project(&self, path_components: &[&str]) -> Result<Self> {` | [rust/lance-core/src/datatypes/field.rs:697-697](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::project_by_field` | `pub fn project_by_field(&self, other: &Self, on_type_mismatch: OnTypeMismatch) -> Result<Self> {` | [rust/lance-core/src/datatypes/field.rs:788-788](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::project_by_filter` | `pub fn project_by_filter<F: Fn(&Self) -> bool>(&self, filter: &F) -> Option<Self> {` | [rust/lance-core/src/datatypes/field.rs:733-733](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::promote_blob_v2` | `pub fn promote_blob_v2(&mut self) -> Result<()> {` | [rust/lance-core/src/datatypes/field.rs:581-581](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::set_dictionary` | `pub fn set_dictionary(&mut self, arr: &ArrayRef) {` | [rust/lance-core/src/datatypes/field.rs:467-467](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::set_dictionary_values` | `pub fn set_dictionary_values(&mut self, arr: &ArrayRef) {` | [rust/lance-core/src/datatypes/field.rs:457-457](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::set_id` | `pub fn set_id(&mut self, parent_id: i32, id_seed: &mut i32) {` | [rust/lance-core/src/datatypes/field.rs:1096-1096](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::sub_field` | `pub fn sub_field(&self, path_components: &[&str]) -> Option<&Self> {` | [rust/lance-core/src/datatypes/field.rs:524-524](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::sub_field_mut` | `pub fn sub_field_mut(&mut self, path_components: &[&str]) -> Option<&mut Self> {` | [rust/lance-core/src/datatypes/field.rs:536-536](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::unenforced_clustering_key_position` | `pub unenforced_clustering_key_position: Option<u32>,` | [rust/lance-core/src/datatypes/field.rs:160-160](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::unenforced_primary_key_position` | `pub unenforced_primary_key_position: Option<u32>,` | [rust/lance-core/src/datatypes/field.rs:155-155](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::unload_blobs_recursive` | `pub fn unload_blobs_recursive(&mut self) {` | [rust/lance-core/src/datatypes/field.rs:686-686](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::Field::unloaded_mut` | `pub fn unloaded_mut(&mut self) {` | [rust/lance-core/src/datatypes/field.rs:648-648](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::LANCE_FIELD_ID_KEY` | `pub const LANCE_FIELD_ID_KEY: &str = "lance:field_id";` | [rust/lance-core/src/datatypes/field.rs:60-60](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::LANCE_UNENFORCED_CLUSTERING_KEY_POSITION` | `pub const LANCE_UNENFORCED_CLUSTERING_KEY_POSITION: &str =     "lance-schema:unenforced-clustering-key:position";` | [rust/lance-core/src/datatypes/field.rs:55-56](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::LANCE_UNENFORCED_PRIMARY_KEY` | `pub const LANCE_UNENFORCED_PRIMARY_KEY: &str = "lance-schema:unenforced-primary-key";` | [rust/lance-core/src/datatypes/field.rs:43-43](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::LANCE_UNENFORCED_PRIMARY_KEY_POSITION` | `pub const LANCE_UNENFORCED_PRIMARY_KEY_POSITION: &str =     "lance-schema:unenforced-primary-key:position";` | [rust/lance-core/src/datatypes/field.rs:49-50](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::LogicalType` | `pub struct LogicalType(String);` | [rust/lance-core/src/datatypes.rs:253-253](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::LogicalType::is_struct` | `pub fn is_struct(&self) -> bool {` | [rust/lance-core/src/datatypes.rs:274-274](../L2-files/rust/lance-core/src/datatypes.rs.md) |
| `lance_core::datatypes::NullabilityComparison` | `pub enum NullabilityComparison {` | [rust/lance-core/src/datatypes/field.rs:73-73](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::NullabilityComparison::Ignore` | `Ignore,` | [rust/lance-core/src/datatypes/field.rs:80-80](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::NullabilityComparison::OneWay` | `OneWay,` | [rust/lance-core/src/datatypes/field.rs:78-78](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::NullabilityComparison::Strict` | `Strict,` | [rust/lance-core/src/datatypes/field.rs:76-76](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::OnTypeMismatch` | `pub enum OnTypeMismatch {` | [rust/lance-core/src/datatypes/field.rs:129-129](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::OnTypeMismatch::Error` | `Error,` | [rust/lance-core/src/datatypes/field.rs:131-131](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::OnTypeMismatch::TakeSelf` | `TakeSelf,` | [rust/lance-core/src/datatypes/field.rs:130-130](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::SchemaCompareOptions` | `pub struct SchemaCompareOptions {` | [rust/lance-core/src/datatypes/field.rs:84-84](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::SchemaCompareOptions::allow_missing_if_nullable` | `pub allow_missing_if_nullable: bool,` | [rust/lance-core/src/datatypes/field.rs:98-98](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::SchemaCompareOptions::allow_subschema` | `pub allow_subschema: bool,` | [rust/lance-core/src/datatypes/field.rs:102-102](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::SchemaCompareOptions::compare_dictionary` | `pub compare_dictionary: bool,` | [rust/lance-core/src/datatypes/field.rs:88-88](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::SchemaCompareOptions::compare_field_ids` | `pub compare_field_ids: bool,` | [rust/lance-core/src/datatypes/field.rs:90-90](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::SchemaCompareOptions::compare_metadata` | `pub compare_metadata: bool,` | [rust/lance-core/src/datatypes/field.rs:86-86](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::SchemaCompareOptions::compare_nullability` | `pub compare_nullability: NullabilityComparison,` | [rust/lance-core/src/datatypes/field.rs:92-92](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
| `lance_core::datatypes::SchemaCompareOptions::ignore_field_order` | `pub ignore_field_order: bool,` | [rust/lance-core/src/datatypes/field.rs:100-100](../L2-files/rust/lance-core/src/datatypes/field.rs.md) |
