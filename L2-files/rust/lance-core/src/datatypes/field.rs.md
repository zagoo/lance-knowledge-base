> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-core/src/datatypes/field.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `d171d5676a550f527d9a6768cfecc21f298ed61320630f308830c098288e2c20`. Reviewed physical lines: 1-2220.

[Module](../../../../../L1-modules/rust-lance-core.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Field tree representation and metadata keys, schema-comparison policy, Arrow conversion, dictionary attachment, blob layout transformations, projection/intersection/exclusion/merge and recursive field-ID operations. The module is private but its selected types/constants are re-exported by datatypes. This file includes tests of its contracts and selected Schema/Projection integration; those neighboring implementations are separately analyzed in schema.rs. (rust/lance-core/src/datatypes/field.rs:1-2220)

## Complete range analysis

### Lines 1-36

SPDX and module introduction; imports supply ordering/max, HashMap/VecDeque, formatting, Arc, deep sizing, Arrow arrays and integer dictionary key types, Arrow extension/blob/JSON helpers, logical/dictionary/projection types, schema child-comparison functions, errors, canonical blob layouts and truthy parsing. Imported functions are dependencies, not implementations defined in this file. (rust/lance-core/src/datatypes/field.rs:1-36)

### Lines 37-63

Public metadata keys are lance-schema:unenforced-primary-key; lance-schema:unenforced-primary-key:position; lance-schema:unenforced-clustering-key:position; and lance:field_id. Comments specify primary-key leaf/non-null-ancestor/not-in-list constraints and one-based ordering positions; validation of those constraints is not implemented by these declarations. Field IDs are documented as nonnegative i32, with negative parsed values treated as -1. Private PACKED_KEYS accepts packed and lance-encoding:packed. The latter is an alias, not a separate packed representation. (rust/lance-core/src/datatypes/field.rs:37-63)

### Lines 64-81

Private has_blob_v2_extension checks exact ARROW extension-name metadata equality with the imported v2 extension constant. Public NullabilityComparison derives Default with Strict; OneWay means nullable expected accepts either actual nullability, while non-null expected rejects nullable actual; Ignore bypasses comparison. The concrete boolean formula is at rust/lance-core/src/datatypes/field.rs:411-421. (rust/lance-core/src/datatypes/field.rs:64-81)

### Lines 82-113

SchemaCompareOptions derives Default: compare_metadata/dictionary/field_ids, allow_missing_if_nullable, ignore_field_order and allow_subschema are false; compare_nullability defaults Strict. Comments describe nullable missing-field and source-subset behavior, implemented through schema helpers outside this file. Public BlobVersion defaults V1 (legacy position/size descriptor), with V2 for the newer descriptor. These options are data configuration, not a schema validation routine. (rust/lance-core/src/datatypes/field.rs:82-113)

### Lines 114-161

Public Encoding variants Plain, VarBinary, Dictionary and RLE describe this Field encoding metadata; do not equate them with the modern page-encoding tree. Public OnTypeMismatch has TakeSelf and Error. Public Field derives Debug, Clone, PartialEq and DeepSizeOf; every stored member is public: name, id, parent_id, logical_type, metadata, encoding, nullable, children, dictionary, unenforced_primary_key_position and unenforced_clustering_key_position. The TODO requesting private fields does not change visibility. Derived PartialEq compares the whole representation and differs from configurable compare_with_options. Position Options and logical text can be constructed without validation. (rust/lance-core/src/datatypes/field.rs:114-161)

### Lines 162-200

new_arrow constructs an ArrowField then invokes TryFrom. data_type reconstructs List/LargeList using children[0], fixed-size-list-of-struct by parsing the last logical-string component with expect and taking children[0], Struct from all children, and Map from children[0] with sorted=false; other logical strings parse through DataType::try_from(...).unwrap(). Malformed strings/missing required children can panic. has_dictionary_types checks whether the reconstructed own type is Dictionary or recursively checks Field children; it does not recursively walk every embedded Arrow DataType when no Field children exist. (rust/lance-core/src/datatypes/field.rs:162-200)

### Lines 201-273

merge_with_reference merges two child sequences using peekable cursors while traversing reference.children. A reference name equal to both heads recursively merges them; equality with one head clones/advances that one; neither equal advances neither input; exhaustion handles the remaining head similarly. It clones Self parent properties and replaces children. This preserves reference order only when relevant input heads already follow that order; it does not search/sort arbitrary children, and an unmatched head can prevent later children from appearing. Children absent from the reference are omitted. Field IDs are not the matching key; parent/type compatibility is not validated. (rust/lance-core/src/datatypes/field.rs:201-273)

### Lines 274-311

apply_projection treats Map and any is_blob field as atomic: only selection of the parent id retains it, and retention clones all children, including synthetic IDs. Other fields recursively filter children. An assertion rejects a selected nested parent with no remaining child when it originally had children. An unselected field with no surviving children returns None; otherwise a clone with projected children is passed through projection.blob_handling.unload_if_needed. Thus an unselected ancestor can survive selected descendants. BlobHandling policy is separately analyzed at rust/lance-core/src/datatypes/schema.rs:1110-1189. (rust/lance-core/src/datatypes/field.rs:274-311)

### Lines 312-397

pub(crate) explain_differences constructs a dotted path from the supplied prefix and this name (no escaping here). It reports name, optional id, logical type, nullability, optional dictionary and optional metadata differences. Child comparison delegates to explain_fields_difference, using only the shared minimal prefix when both fields are recognized logical v2 blobs; child messages are joined and wrapped. parent_id, encoding and separate primary/clustering position members are not compared by this method; metadata comparison may still observe their original metadata strings. Diagnostics retain actual/expected ordering and field-path text. (rust/lance-core/src/datatypes/field.rs:312-397)

### Lines 398-445

Public explain_difference returns None for no messages or their comma-joined string. compare_nullability(expected,actual,options) is equality for Strict, expected || !actual for OneWay, true for Ignore. compare_with_options computes children_match using the same logical-blob prefix rule, then checks name, logical type, configured nullability, children and optional id/dictionary/metadata. It does not require full derived Field equality. extension_name borrows the ARROW extension-name metadata value. (rust/lance-core/src/datatypes/field.rs:398-445)

### Lines 446-466

child/child_mut find the first immediate child with exact name. set_dictionary_values asserts that this field reconstructs as Dictionary, then attaches Arc-cloned values with offset0/length0. It does not validate the supplied values array type against the dictionary's declared value type; malformed field reconstruction can panic before the dictionary assertion. (rust/lance-core/src/datatypes/field.rs:446-466)

### Lines 467-523

set_dictionary dispatches eight integer dictionary key types to arr.as_dictionary::<T>().values() and panics on any other dictionary key type. Struct converts its field definitions, finds each mutable child by name with unwrap, casts arr.as_struct and recursively attaches column dictionaries. List/LargeList cast to i32/i64 list arrays and recurse into children[0]. Other types are no-ops, including Map and FixedSizeList. Array shape/type and child presence are caller invariants enforced only by casts/indexing/unwrap, not a Result boundary. (rust/lance-core/src/datatypes/field.rs:467-523)

### Lines 524-568

sub_field/sub_field_mut take a slice of path segments; empty means self, otherwise exact first-match child traversal. is_blob is true if BLOB_META_KEY exists regardless of its value, or if the v2 extension name matches. is_blob_v2's comment emphasizes explicit extension metadata, but implementation also recognizes the stored descriptor structurally through is_blob_v2_descriptor. Therefore a transformed descriptor without extension metadata can remain v2; ordinary arbitrary structs are not recognized solely by five names without blob metadata. (rust/lance-core/src/datatypes/field.rs:524-568)

### Lines 569-602

promote_blob_v2 recursively visits children of non-blob fields; already-v2 blobs are unchanged. A legacy blob becomes logical struct, encoding=None, with converted minimal data/uri children; it removes BLOB_META_KEY and inserts the v2 extension name. It preserves outer name/id/parent_id/nullability, dictionary, position members and other metadata. New child IDs and parent IDs start -1 and require later assignment. It returns Result and mutates logical_type/encoding before collecting converted children, so no general transactional rollback contract is encoded; built-in minimal fields are expected convertible. (rust/lance-core/src/datatypes/field.rs:569-602)

### Lines 603-643

Private blob_v2_layout requires the exact extension marker and an Arrow Struct before calling BlobV2Layout::classify. blob_v2_logical_shared_child_count returns min(child counts) only when both layouts classify Logical. Hence minimal versus complete logical blobs compare just data/uri, but two complete layouts compare all four children. is_blob_v2_descriptor requires blob metadata presence, descriptor logical type and exact child count/name/type; it ignores child nullability, child metadata, IDs, outer nullability and packed marker. is_compatible_blob_projection requires both is_blob and equal is_blob_v2 booleans, permitting loaded/descriptor representation differences. (rust/lance-core/src/datatypes/field.rs:603-643)

### Lines 644-659

unloaded_mut replaces logical_type, children and the entire metadata map with canonical v2 descriptor fields when is_blob_v2; otherwise uses the legacy descriptor for any blob; non-blobs remain unchanged. Name/id/parent_id/nullable, encoding, dictionary and position members are preserved. The cloned synthetic children carry unassigned IDs, not automatically reparented values. Replacing the metadata map discards unrelated metadata, including the extension name; structural recognition keeps a v2 descriptor recognizable. (rust/lance-core/src/datatypes/field.rs:644-659)

### Lines 660-696

binary_blob_mut returns immediately for a non-blob. Otherwise it captures v2 status, sets LargeBinary logical type with expect, clears children and sets VarBinary encoding. For v2 it removes the blob marker and both packed keys and sets the v2 extension marker; legacy metadata is retained. The comment describes later plain Arrow payload behavior, but this method retains v2 metadata and From<&Field> itself does not strip it. unload_blobs_recursive unloads a v2 field then stops recursion beneath it; otherwise it visits children. Legacy blobs are not directly unloaded by that recursive function despite its broad name. (rust/lance-core/src/datatypes/field.rs:660-696)

### Lines 697-748

project(path) clones all parent properties into a field with no children. Empty path restores all original children; a matching next child recursively projects only it. Missing next child returns Ok with empty children, rather than a missing-field error, which can later produce an invalid nested field. No atomic map/blob handling appears here. project_by_filter evaluates descendants first and retains a field if any child survives or its predicate returns true. The predicate is short-circuited for a parent with retained children. The final Returns None doc sentence omits the ancestor-retention exception, although preceding doc lines729-730 explicitly state it. Later reconstruction risk follows the child indexing at rust/lance-core/src/datatypes/field.rs:170-195. (rust/lance-core/src/datatypes/field.rs:697-748)

### Lines 749-785

pub(crate) project_by_ids recursively selects children, then returns the complete clone when the field id is selected and either no children were separately selected or include_all_children=true. If any child survives otherwise, it returns a trimmed clone; else None. Thus include_all_children=false plus parent-only selection still retains the whole subtree, while parent plus a selected child can trim it. IDs are tested with slice contains per node, not a bitmap; names and atomic blob/map semantics are not considered in this method. (rust/lance-core/src/datatypes/field.rs:749-785)

### Lines 786-817

project_by_field first rejects different names with Error::schema regardless of mode. Compatible blob representations immediately return Self unchanged. Equal booleans clone. For two primitive types or two binary-like types, unequal Arrow types produce a schema error before the fallback policy, so TakeSelf is not a universal permission to ignore type differences. These early branches must be preserved separately from the later mismatch fallback. (rust/lance-core/src/datatypes/field.rs:786-817)

### Lines 818-868

For two Structs, a blob Self is atomic and returned unchanged; otherwise project_by_field follows other.children order, looks up each requested child by exact name in Self, errors if missing, and recursively projects with the same mode. List/List, LargeList/LargeList and Map/Map recurse into children[0]; this can prune map entries and does not rerun Arrow map validation. Equal FixedSizeList child Arrow field and size, equal dictionary key/value, Null/Null and equal FixedSizeBinary width clone. Remaining mismatches return Error::schema under Error or Self under TakeSelf. Parent properties come from Self. (rust/lance-core/src/datatypes/field.rs:818-868)

### Lines 869-912

pub(crate) resolve appends self to the output chain, succeeds when no segments remain, otherwise pops the next segment and recursively follows an exact child. Failure leaves consumed input and a partial output chain. resolve_case_insensitive uses exact match first, then the first ASCII-case-insensitive match; ambiguous folded names are not diagnosed. Both are mutable traversal helpers, not rollback-safe parsers, and both exclude any independent validation of the initial root name. (rust/lance-core/src/datatypes/field.rs:869-912)

### Lines 913-952

pub(crate) do_intersection always errors with Error::arrow on differing names. If blob membership differs, ignore_types chooses whole Self when its id>=0, otherwise whole Other; strict mode errors. Compatible blobs use the same whole-field choice. This preserves a persisted field when paired with an unassigned projection, but ignore_types does not invariably preserve Self's type or metadata when Self has a negative id. (rust/lance-core/src/datatypes/field.rs:913-952)

### Lines 953-1011

After the preceding name/blob guards, Struct/Struct, List/List and Map/Map enter the matching-container branch. It first returns Self.clone() unchanged when Self is a blob, preserving its descriptor layout without child intersection or ID replacement. Otherwise it recurses over Self children in Self order, finds matching Other names, and filter_map discards every recursive error through .ok()?. Consequently strict intersection can silently omit an incompatible child and still succeed with empty children. Non-blob parent properties remain Self's except id selects Self when nonnegative else Other; parent_id is not similarly selected. LargeList and FixedSizeList do not enter this recursive branch. Outside it, strict mismatched types or different names return Error::arrow; name mismatch was already rejected at method entry. Otherwise whole-field choice follows id sign. Public intersection and intersection_ignore_types forward false/true respectively. (rust/lance-core/src/datatypes/field.rs:913-1011) (rust/lance-core/src/datatypes/field.rs:953-1011)

### Lines 1012-1047

exclude immediately returns None for a non-nested Self, without comparing parent names/types. For nested types it keeps Self children absent from Other, recursively excludes matching names, drops None results and returns None if none remain; retained parent properties are Self's. It does not implement blob atomicity or a parent compatibility check. Callers must establish the intended subtraction relationship. (rust/lance-core/src/datatypes/field.rs:1012-1047)

### Lines 1048-1086

pub(super) merge unions Struct children in existing Self order, recursively merging same-name children and appending new Other children. List and LargeList recurse into first children. FixedSizeList with equal size succeeds without comparing element types; equal-width FixedSizeBinary succeeds. Other pairs require exact Arrow type equality, so Map has no recursive union here. No root-name check or parent metadata merge occurs. Earlier mutations are not rolled back if a later child produces a schema error. (rust/lance-core/src/datatypes/field.rs:1048-1086)

### Lines 1087-1112

max_id recursively takes max(self.id, maximum child id or -1), so a leaf with id below -1 still contributes -1. set_id always sets parent_id, assigns/increments the seed only for any negative id, retains nonnegative ids without advancing the seed, and recurses with the field's resulting id. It does not validate seed sign, avoid collisions with retained ids, reserve system negative ids, or guard increment overflow. reset_id sets every id to -1 but leaves parent_id values unchanged. These helpers depend on higher-level allocation policy. (rust/lance-core/src/datatypes/field.rs:1087-1112)

### Lines 1113-1152

field_by_id_mut and field_by_id accept impl Into<i32>; mut_field_by_id is a separate pub(super) mutable helper. All search children first and recurse depth-first, returning the first matching descendant. None checks self.id. A caller expecting root-inclusive lookup must handle the root separately. Duplicate IDs therefore resolve by child traversal order rather than error. (rust/lance-core/src/datatypes/field.rs:1113-1152)

### Lines 1153-1178

is_packed_struct checks whether either accepted metadata key has a str_is_truthy value; it does not verify Struct datatype. Truthy matching is case-insensitive for values, not key lookup, and does not trim (rust/lance-core/src/utils/parse.rs:5-12). is_leaf is exactly children.is_empty(), which can include scalar-element FixedSizeList representations despite the simplified doc wording. is_unenforced_primary_key/is_unenforced_clustering_key test Option::is_some, including position0; they do not validate one-based numbering or non-null leaf constraints. (rust/lance-core/src/datatypes/field.rs:1153-1178)

### Lines 1179-1203

Field Display prints id, name and logical type, optional Debug dictionary metadata and recursively formatted children, with a trailing comma/space after each child. It omits parent_id, nullability, encoding, most metadata and key-position members, so Display output is not a full serialized schema or equality key. (rust/lance-core/src/datatypes/field.rs:1179-1203)

### Lines 1204-1226

TryFrom<&ArrowField> clones metadata and removes lance:field_id. A present value must parse as i32 or returns Error::invalid_input; parsed negatives clamp to -1 via max(-1), absent means -1. No trimming occurs. Struct recursively converts all children, List/LargeList convert one, and FixedSizeList stores a Field child only when the Arrow element is Struct. Other scalar fixed-size-list children are encoded in logical_type. The imported metadata field ID is intentionally absent from retained metadata. (rust/lance-core/src/datatypes/field.rs:1204-1226)

### Lines 1227-1257

Map conversion rejects keys_sorted=true, requires entries datatype Struct, requires at least two fields, and rejects a nullable first key field. It then converts the entries field recursively. It does not locally enforce exactly two entries children, names key/value, or non-null entries field. Error messages distinguish sorted, non-Struct, missing key/value and nullable-key cases. The guard is a conversion boundary, not proof that every publicly constructed Field has valid map structure. (rust/lance-core/src/datatypes/field.rs:1227-1257)

### Lines 1258-1293

Primary-key position parsing uses u32 .ok(); invalid text silently falls back to the legacy truthy primary-key flag, yielding Some(0), or None. Clustering position similarly parses to Option and drops invalid text. Zero is accepted locally despite one-based docs. V2 extension detection preserves/inserts that extension value. Arrow/Lance JSON helpers normalize metadata to the Lance JSON extension and logical_type json; otherwise v2 extension forces logical_type struct, without requiring the Arrow datatype itself to be a valid blob Struct here. All other fields use LogicalType::try_from. (rust/lance-core/src/datatypes/field.rs:1258-1293)

### Lines 1294-1326

Constructed Field uses parent_id=-1, original name/nullability, converted children, dictionary=None and parsed positions. Encoding selection uses original Arrow datatype: fixed stride=>Plain, binary-like=>VarBinary, Dictionary=>Dictionary, List/LargeList/Map=>Plain for offsets, otherwise None. V2/JSON logical-type overrides do not independently recompute this choice. Owned ArrowField TryFrom delegates to borrowed conversion; it adds no validation. (rust/lance-core/src/datatypes/field.rs:1294-1326)

### Lines 1327-1349

From<&Field> for ArrowField reconstructs datatype through the potentially panicking data_type(), preserves name/nullability, clones metadata, inserts blob metadata only for the literal blob logical type when absent, and normalizes literal json to the Lance JSON extension. It does not reinsert lance:field_id, derive metadata from the separate key-position members, or strip v2 extension metadata from a binary blob representation. Existing metadata key-position strings remain if previously retained. (rust/lance-core/src/datatypes/field.rs:1327-1349)

### Lines 1350-1370

Private tests import arrays, Arrow types, metadata constants and blob layouts. Helper blob_v2_logical_field builds a nullable blob Struct with exact v2 extension marker and converts it with unwrap. It supplies structural fixture shapes, not data batches. (rust/lance-core/src/datatypes/field.rs:1350-1370)

### Lines 1371-1438

Logical-blob compatibility test compares minimal and complete layouts (including required range fields) in both directions and expects default match/explanation None. Two complete layouts with differing range nullability fail Strict and pass Ignore. Changed data child metadata fails when compare_metadata=true. Nested minimal/complete blob fields also compare both directions. These assertions distinguish prefix equivalence from globally ignoring range/nullability or child metadata. (rust/lance-core/src/datatypes/field.rs:1371-1438)

### Lines 1439-1471

A malformed logical blob whose uri is LargeUtf8 fails comparison and yields explanations in both directions. Arrow-field metadata conversion test extracts field id42, removes its metadata key and preserves an unrelated metadata entry. These do not cover every malformed extension shape or negative/invalid id case. (rust/lance-core/src/datatypes/field.rs:1439-1471)

### Lines 1472-1530

Arrow-to-Field roundtrip loop covers Null, Boolean, eight integers, Float16/32/64, Decimal128, timestamp units and named timezone, valid time32/time64 units, duration units, FixedSizeBinary and scalar FixedSizeList. Assertions check name, reconstructed DataType and reverse ArrowField equality. Fixture labels are field names, not independent expected logical-string assertions. (rust/lance-core/src/datatypes/field.rs:1472-1530)

### Lines 1531-1598

View conversion tests expect Utf8View=>Utf8 logical string and BinaryView=>Binary logical binary. Nested-type tests pin list, list.struct, struct and map logical spellings only; these assertions do not convert through Field or assert retained children. These assert intended representation normalization, not zero-copy view preservation. (rust/lance-core/src/datatypes/field.rs:1531-1598)

### Lines 1599-1631

Struct field test verifies children and Arrow roundtrip. Map nullable-key test constructs a nullable first key field and asserts conversion error. It does not assert exact text or prove validation of all Arrow map constraints. (rust/lance-core/src/datatypes/field.rs:1599-1631)

### Lines 1632-1698

Map sorted test requires sorted=true failure with matching message and sorted=false success with false preserved. Further tests reject a non-Struct entries type and a one-child entries Struct with descriptive text. Extra entries children and nullable entries fields are not rejected/tested by these particular guards; no broader Arrow validation claim follows. (rust/lance-core/src/datatypes/field.rs:1632-1698)

### Lines 1699-1777

Null projection test accepts same-name Null, rejects a different name and rejects Int32 under Error mode. Scalar intersection accepts equal named Int32 and rejects name mismatch. Struct intersection preserves the common child c from Self[b,c] and Other[c,a]. These tests do not exercise child-error suppression or the TakeSelf early primitive branch. (rust/lance-core/src/datatypes/field.rs:1699-1777)

### Lines 1778-1851

test_compare constructs dictionary values and metadata/ID differences. Default comparison ignores dictionary, metadata and field IDs; enabling each corresponding option makes the difference visible. It explicitly assigns an ID through set_id for the ID case. This configurable policy differs from derived PartialEq, not from a mutation of the underlying field representation. (rust/lance-core/src/datatypes/field.rs:1778-1851)

### Lines 1852-2028

test_explain_difference asserts no message for equality, exact text for root name mismatch, child nullability mismatch with nested path, missing/unexpected children, and differing child order. Expected diagnostic ordering and path formatting are part of the assertions. Schema helper internals are separately analyzed at rust/lance-core/src/datatypes/schema.rs:930-1090. Remaining explanation assertions combine name/type differences, dictionary mismatch under its flag, metadata mismatch under its flag and field-ID mismatch under its flag. Full literal diagnostic strings are retained in the evidence appendix. These are exact assertion expectations, not logs from executed tests. (rust/lance-core/src/datatypes/field.rs:1852-2028)

### Lines 2029-2060

test_nullability_comparison is declared pub within the private cfg(test) module; it is not a production API export. Strict rejects both directions of differing nullability; OneWay accepts non-null actual against nullable expected and rejects the reverse; Ignore accepts both. This pins expected/actual argument direction. (rust/lance-core/src/datatypes/field.rs:2029-2060)

### Lines 2061-2112

Blob unloading test selects legacy versus v2 from metadata/shape. Legacy binary conversion retains blob metadata; legacy unload produces two children and is idempotent. V2 unload produces five children, removes extension-name metadata, remains is_blob_v2 via descriptor recognition, and is also idempotent. It checks shape/idempotence, not storage IO. (rust/lance-core/src/datatypes/field.rs:2061-2112)

### Lines 2113-2160

Recursive unloading fixture nests a legacy and a v2 field: after unload_blobs_recursive, legacy remains LargeBinary with no children and blob metadata, while v2 has the five-child descriptor. This explicitly prevents interpreting that method as unconditionally unloading all blob generations. (rust/lance-core/src/datatypes/field.rs:2113-2160)

### Lines 2161-2181

project_by_field accepts legacy loaded blob versus descriptor in both directions, preserving the Self layout in each result. It proves logical compatibility can bypass exact Arrow datatype equality for matching blob generation; unrelated type mismatches remain subject to earlier/later branches. (rust/lance-core/src/datatypes/field.rs:2161-2181)

### Lines 2182-2220

Descriptor projection test assigns IDs to a v2 blob, applies Projection::full with BlobsDescriptions, obtains a bare schema whose five synthetic child IDs are all -1, then projects that bare schema again and asserts all five children survive. This is evidence for atomic parent selection preserving unassigned synthetic children. It invokes Schema/Projection behavior but does not constitute full review of those definitions. All tests were read and none executed during KB creation. (rust/lance-core/src/datatypes/field.rs:2182-2220)

## Interaction and interpretation limits

Public Field construction exposes invariants that fallible Arrow conversion only partly enforces; schema import adds checks as described at rust/lance-core/src/datatypes/schema.rs:328-383 and rust/lance-core/src/datatypes/schema.rs:835-908. Local call relationships include datatype/layout helpers in datatypes.rs, truthy parsing, Arrow casts, schema child-comparison helpers and Projection blob handling. Exact local bodies/signatures are retained in L2 and indexed in L3. Local schema projection resolution is separately analyzed; complete repository callers, query execution, persistence conversion, dictionary writer/reader lifecycles and runtime validation/version gates remain pending. No source modifications, runtime tests or dependency builds were performed. VERIFY73 correction: freshly reread lines913-1011 and made the same-container blob short-circuit explicit. Earlier full-file analysis remains the coverage basis; no fresh whole-file reread is claimed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Lance Schema Field
    5 | 
    6 | use std::{
    7 |     cmp::{Ordering, max},
    8 |     collections::{HashMap, VecDeque},
    9 |     fmt,
   10 |     sync::Arc,
   11 | };
   12 | 
   13 | use crate::deepsize::DeepSizeOf;
   14 | use arrow_array::{
   15 |     ArrayRef,
   16 |     cast::AsArray,
   17 |     types::{
   18 |         Int8Type, Int16Type, Int32Type, Int64Type, UInt8Type, UInt16Type, UInt32Type, UInt64Type,
   19 |     },
   20 | };
   21 | use arrow_schema::{DataType, Field as ArrowField};
   22 | use lance_arrow::{
   23 |     ARROW_EXT_NAME_KEY, BLOB_META_KEY, BLOB_V2_EXT_NAME, DataTypeExt,
   24 |     json::{is_arrow_json_field, is_json_field},
   25 | };
   26 | 
   27 | use super::{
   28 |     Dictionary, LogicalType, Projection,
   29 |     schema::{compare_fields, explain_fields_difference},
   30 | };
   31 | use crate::{
   32 |     Error, Result,
   33 |     datatypes::{BLOB_DESC_LANCE_FIELD, BLOB_V2_DESC_LANCE_FIELD, BlobV2Layout},
   34 |     utils::parse::str_is_truthy,
   35 | };
   36 | 
   37 | /// Use this config key in Arrow field metadata to indicate a column is a part of the primary key.
   38 | /// The value can be any true values like `true`, `1`, `yes` (case-insensitive).
   39 | /// A primary key column must satisfy:
   40 | /// (1) The field, and all its ancestors must not be nullable.
   41 | /// (2) The field must be a leaf without child (i.e. it is a primitive data type).
   42 | /// (3) The field must not be within a list type.
   43 | pub const LANCE_UNENFORCED_PRIMARY_KEY: &str = "lance-schema:unenforced-primary-key";
   44 | 
   45 | /// Use this config key in Arrow field metadata to specify the position of a primary key column.
   46 | /// The value is a 1-based integer indicating the order within the composite primary key.
   47 | /// When specified, primary key fields are ordered by this position value.
   48 | /// When not specified, primary key fields are ordered by their schema field id.
   49 | pub const LANCE_UNENFORCED_PRIMARY_KEY_POSITION: &str =
   50 |     "lance-schema:unenforced-primary-key:position";
   51 | 
   52 | /// Use this config key in Arrow field metadata to specify the position of a clustering key column.
   53 | /// The value is a 1-based integer indicating the order within the composite clustering key.
   54 | /// Clustering key fields are ordered by this position value.
   55 | pub const LANCE_UNENFORCED_CLUSTERING_KEY_POSITION: &str =
   56 |     "lance-schema:unenforced-clustering-key:position";
   57 | 
   58 | /// Use this config key in Arrow field metadata to specify the field id of the lance field.
   59 | /// The value should be non-negative i32 value. Any negative value will be seen as -1.
   60 | pub const LANCE_FIELD_ID_KEY: &str = "lance:field_id";
   61 | 
   62 | const PACKED_KEYS: [&str; 2] = ["packed", "lance-encoding:packed"];
   63 | 
   64 | fn has_blob_v2_extension(field: &ArrowField) -> bool {
   65 |     field
   66 |         .metadata()
   67 |         .get(ARROW_EXT_NAME_KEY)
   68 |         .map(|name| name == BLOB_V2_EXT_NAME)
   69 |         .unwrap_or(false)
   70 | }
   71 | 
   72 | #[derive(Debug, Default)]
   73 | pub enum NullabilityComparison {
   74 |     // If the nullabilities don't match then the fields don't match
   75 |     #[default]
   76 |     Strict,
   77 |     // If the expected schema is nullable then a non-nullable version of the field is allowed
   78 |     OneWay,
   79 |     // Nullability is ignored when comparing fields
   80 |     Ignore,
   81 | }
   82 | 
   83 | #[derive(Default)]
   84 | pub struct SchemaCompareOptions {
   85 |     /// Should the metadata be compared (default false)
   86 |     pub compare_metadata: bool,
   87 |     /// Should the dictionaries be compared (default false)
   88 |     pub compare_dictionary: bool,
   89 |     /// Should the field ids be compared (default false)
   90 |     pub compare_field_ids: bool,
   91 |     /// Should nullability be compared (default Strict)
   92 |     pub compare_nullability: NullabilityComparison,
   93 |     /// Allow fields in the expected schema to be missing from the schema being tested if
   94 |     /// they are nullable (default false)
   95 |     ///
   96 |     /// Fields in the schema being tested must always be present in the expected schema
   97 |     /// regardless of this flag.
   98 |     pub allow_missing_if_nullable: bool,
   99 |     /// Allow out of order fields (default false)
  100 |     pub ignore_field_order: bool,
  101 |     /// Allow the source schema to be a subset of the target schema (default false)
  102 |     pub allow_subschema: bool,
  103 | }
  104 | 
  105 | /// Blob column format version.
  106 | #[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
  107 | pub enum BlobVersion {
  108 |     /// Legacy blob format (position / size only).
  109 |     #[default]
  110 |     V1,
  111 |     /// Blob v2 struct format.
  112 |     V2,
  113 | }
  114 | /// Encoding enum.
  115 | #[derive(Debug, Clone, PartialEq, Eq, DeepSizeOf)]
  116 | pub enum Encoding {
  117 |     /// Plain encoding.
  118 |     Plain,
  119 |     /// Binary encoding.
  120 |     VarBinary,
  121 |     /// Dictionary encoding.
  122 |     Dictionary,
  123 |     /// RLE encoding.
  124 |     RLE,
  125 | }
  126 | 
  127 | /// What to do on a merge operation if the types of the fields don't match
  128 | #[derive(Debug, Clone, Copy, PartialEq, Eq, DeepSizeOf)]
  129 | pub enum OnTypeMismatch {
  130 |     TakeSelf,
  131 |     Error,
  132 | }
  133 | 
  134 | /// Lance Schema Field
  135 | ///
  136 | #[derive(Debug, Clone, PartialEq, DeepSizeOf)]
  137 | pub struct Field {
  138 |     pub name: String,
  139 |     pub id: i32,
  140 |     // TODO: Find way to move these next three fields to private
  141 |     pub parent_id: i32,
  142 |     pub logical_type: LogicalType,
  143 |     pub metadata: HashMap<String, String>,
  144 |     pub encoding: Option<Encoding>,
  145 |     pub nullable: bool,
  146 | 
  147 |     pub children: Vec<Self>,
  148 | 
  149 |     /// Dictionary value array if this field is dictionary.
  150 |     pub dictionary: Option<Dictionary>,
  151 | 
  152 |     /// Position of this field in the primary key (1-based).
  153 |     /// None means the field is not part of the primary key.
  154 |     /// Some(n) means this field is the nth column in the primary key.
  155 |     pub unenforced_primary_key_position: Option<u32>,
  156 | 
  157 |     /// Position of this field in the clustering key (1-based).
  158 |     /// None means the field is not part of the clustering key.
  159 |     /// Some(n) means this field is the nth column in the clustering key.
  160 |     pub unenforced_clustering_key_position: Option<u32>,
  161 | }
  162 | 
  163 | impl Field {
  164 |     /// Shortcut for creating a field with no field id (i.e. from the same info
  165 |     /// needed to create an Arrow field)
  166 |     pub fn new_arrow(name: &str, data_type: DataType, nullable: bool) -> Result<Self> {
  167 |         Self::try_from(ArrowField::new(name, data_type, nullable))
  168 |     }
  169 | 
  170 |     /// Returns arrow data type.
  171 |     pub fn data_type(&self) -> DataType {
  172 |         match &self.logical_type {
  173 |             lt if lt.is_list() => DataType::List(Arc::new(ArrowField::from(&self.children[0]))),
  174 |             lt if lt.is_large_list() => {
  175 |                 DataType::LargeList(Arc::new(ArrowField::from(&self.children[0])))
  176 |             }
  177 |             lt if lt.is_fixed_size_list_struct() => {
  178 |                 // Parse size from "fixed_size_list:struct:N"
  179 |                 let size: i32 =
  180 |                     lt.0.split(':')
  181 |                         .next_back()
  182 |                         .expect("fixed_size_list:struct logical type missing size suffix")
  183 |                         .parse()
  184 |                         .expect("fixed_size_list:struct logical type has invalid size");
  185 |                 DataType::FixedSizeList(Arc::new(ArrowField::from(&self.children[0])), size)
  186 |             }
  187 |             lt if lt.is_struct() => {
  188 |                 DataType::Struct(self.children.iter().map(ArrowField::from).collect())
  189 |             }
  190 |             lt if lt.is_map() => {
  191 |                 DataType::Map(Arc::new(ArrowField::from(&self.children[0])), false)
  192 |             }
  193 |             lt => DataType::try_from(lt).unwrap(),
  194 |         }
  195 |     }
  196 | 
  197 |     pub fn has_dictionary_types(&self) -> bool {
  198 |         matches!(self.data_type(), DataType::Dictionary(_, _))
  199 |             || self.children.iter().any(Self::has_dictionary_types)
  200 |     }
  201 | 
  202 |     /// Merge a field with another field using a reference field to ensure
  203 |     /// the correct order of fields
  204 |     ///
  205 |     /// For each child in the reference field we look for a matching child
  206 |     /// in self and other.
  207 |     ///
  208 |     /// If we find a match in both we recursively merge the children.
  209 |     /// If we find a match in one but not the other we take the matching child.
  210 |     ///
  211 |     /// Primitive fields we simply clone self and return.
  212 |     ///
  213 |     /// Matches are determined using field names and so ids are not required.
  214 |     pub fn merge_with_reference(&self, other: &Self, reference: &Self) -> Self {
  215 |         let mut new_children = Vec::with_capacity(reference.children.len());
  216 |         let mut self_children_itr = self.children.iter().peekable();
  217 |         let mut other_children_itr = other.children.iter().peekable();
  218 |         for ref_child in &reference.children {
  219 |             match (self_children_itr.peek(), other_children_itr.peek()) {
  220 |                 (Some(&only_child), None) => {
  221 |                     // other is exhausted so just check if self matches
  222 |                     if only_child.name == ref_child.name {
  223 |                         new_children.push(only_child.clone());
  224 |                         self_children_itr.next();
  225 |                     }
  226 |                 }
  227 |                 (None, Some(&only_child)) => {
  228 |                     // Self is exhausted so just check if other matches
  229 |                     if only_child.name == ref_child.name {
  230 |                         new_children.push(only_child.clone());
  231 |                         other_children_itr.next();
  232 |                     }
  233 |                 }
  234 |                 (Some(&self_child), Some(&other_child)) => {
  235 |                     // Both iterators have potential, see if any match
  236 |                     match (
  237 |                         ref_child.name.cmp(&self_child.name),
  238 |                         ref_child.name.cmp(&other_child.name),
  239 |                     ) {
  240 |                         (Ordering::Equal, Ordering::Equal) => {
  241 |                             // Both match, recursively merge
  242 |                             new_children
  243 |                                 .push(self_child.merge_with_reference(other_child, ref_child));
  244 |                             self_children_itr.next();
  245 |                             other_children_itr.next();
  246 |                         }
  247 |                         (Ordering::Equal, _) => {
  248 |                             // Self matches, other doesn't, use self as-is
  249 |                             new_children.push(self_child.clone());
  250 |                             self_children_itr.next();
  251 |                         }
  252 |                         (_, Ordering::Equal) => {
  253 |                             // Other matches, self doesn't, use other as-is
  254 |                             new_children.push(other_child.clone());
  255 |                             other_children_itr.next();
  256 |                         }
  257 |                         _ => {
  258 |                             // Neither match, field is projected out
  259 |                         }
  260 |                     }
  261 |                 }
  262 |                 (None, None) => {
  263 |                     // Both iterators are exhausted, we can quit, all remaining fields projected out
  264 |                     break;
  265 |                 }
  266 |             }
  267 |         }
  268 |         Self {
  269 |             children: new_children,
  270 |             ..self.clone()
  271 |         }
  272 |     }
  273 | 
  274 |     pub fn apply_projection(&self, projection: &Projection) -> Option<Self> {
  275 |         // Maps and blob descriptors are atomic physical layouts. Map children
  276 |         // must remain together, while projected blob descriptor children may
  277 |         // have synthetic IDs that cannot be selected independently.
  278 |         let is_atomic_layout = self.logical_type.is_map() || self.is_blob();
  279 |         if is_atomic_layout && !projection.contains_field_id(self.id) {
  280 |             return None;
  281 |         }
  282 | 
  283 |         let children = if is_atomic_layout {
  284 |             self.children.clone()
  285 |         } else {
  286 |             self.children
  287 |                 .iter()
  288 |                 .filter_map(|c| c.apply_projection(projection))
  289 |                 .collect::<Vec<_>>()
  290 |         };
  291 | 
  292 |         // The following case is invalid:
  293 |         // - This is a nested field (has children)
  294 |         // - All children were projected away
  295 |         // - Caller is asking for the parent field
  296 |         assert!(
  297 |             // One of the following must be true
  298 |             !children.is_empty() // Some children were projected
  299 |                 || !projection.contains_field_id(self.id) // Caller is not asking for this field
  300 |                 || self.children.is_empty() // This isn't a nested field
  301 |         );
  302 | 
  303 |         if children.is_empty() && !projection.contains_field_id(self.id) {
  304 |             None
  305 |         } else {
  306 |             let mut new_field = self.clone();
  307 |             new_field.children = children;
  308 |             Some(projection.blob_handling.unload_if_needed(new_field))
  309 |         }
  310 |     }
  311 | 
  312 |     pub(crate) fn explain_differences(
  313 |         &self,
  314 |         expected: &Self,
  315 |         options: &SchemaCompareOptions,
  316 |         path: Option<&str>,
  317 |     ) -> Vec<String> {
  318 |         let mut differences = Vec::new();
  319 |         let self_name = path
  320 |             .map(|path| {
  321 |                 let mut self_name = path.to_owned();
  322 |                 self_name.push('.');
  323 |                 self_name.push_str(&self.name);
  324 |                 self_name
  325 |             })
  326 |             .unwrap_or_else(|| self.name.clone());
  327 |         if self.name != expected.name {
  328 |             let expected_path = path
  329 |                 .map(|path| {
  330 |                     let mut expected_path = path.to_owned();
  331 |                     expected_path.push('.');
  332 |                     expected_path.push_str(&expected.name);
  333 |                     expected_path
  334 |                 })
  335 |                 .unwrap_or_else(|| expected.name.clone());
  336 |             differences.push(format!(
  337 |                 "expected name '{}' but name was '{}'",
  338 |                 expected_path, self_name
  339 |             ));
  340 |         }
  341 |         if options.compare_field_ids && self.id != expected.id {
  342 |             differences.push(format!(
  343 |                 "`{}` should have id {} but id was {}",
  344 |                 self_name, expected.id, self.id
  345 |             ));
  346 |         }
  347 |         if self.logical_type != expected.logical_type {
  348 |             differences.push(format!(
  349 |                 "`{}` should have type {} but type was {}",
  350 |                 self_name, expected.logical_type, self.logical_type
  351 |             ));
  352 |         }
  353 |         if !Self::compare_nullability(expected.nullable, self.nullable, options) {
  354 |             differences.push(format!(
  355 |                 "`{}` should have nullable={} but nullable={}",
  356 |                 self_name, expected.nullable, self.nullable
  357 |             ))
  358 |         }
  359 |         if options.compare_dictionary && self.dictionary != expected.dictionary {
  360 |             differences.push(format!(
  361 |                 "dictionary for `{}` did not match expected dictionary",
  362 |                 self_name
  363 |             ));
  364 |         }
  365 |         if options.compare_metadata && self.metadata != expected.metadata {
  366 |             differences.push(format!(
  367 |                 "metadata for `{}` did not match expected metadata",
  368 |                 self_name
  369 |             ));
  370 |         }
  371 |         let children_differences =
  372 |             if let Some(shared_child_count) = self.blob_v2_logical_shared_child_count(expected) {
  373 |                 explain_fields_difference(
  374 |                     &self.children[..shared_child_count],
  375 |                     &expected.children[..shared_child_count],
  376 |                     options,
  377 |                     Some(&self_name),
  378 |                 )
  379 |             } else {
  380 |                 explain_fields_difference(
  381 |                     &self.children,
  382 |                     &expected.children,
  383 |                     options,
  384 |                     Some(&self_name),
  385 |                 )
  386 |             };
  387 |         if !children_differences.is_empty() {
  388 |             let children_differences = format!(
  389 |                 "`{}` had mismatched children: {}",
  390 |                 self_name,
  391 |                 children_differences.join(", ")
  392 |             );
  393 |             differences.push(children_differences);
  394 |         }
  395 |         differences
  396 |     }
  397 | 
  398 |     pub fn explain_difference(
  399 |         &self,
  400 |         expected: &Self,
  401 |         options: &SchemaCompareOptions,
  402 |     ) -> Option<String> {
  403 |         let differences = self.explain_differences(expected, options, None);
  404 |         if differences.is_empty() {
  405 |             None
  406 |         } else {
  407 |             Some(differences.join(", "))
  408 |         }
  409 |     }
  410 | 
  411 |     pub fn compare_nullability(
  412 |         expected_nullability: bool,
  413 |         actual_nullability: bool,
  414 |         options: &SchemaCompareOptions,
  415 |     ) -> bool {
  416 |         match options.compare_nullability {
  417 |             NullabilityComparison::Strict => expected_nullability == actual_nullability,
  418 |             NullabilityComparison::OneWay => expected_nullability || !actual_nullability,
  419 |             NullabilityComparison::Ignore => true,
  420 |         }
  421 |     }
  422 | 
  423 |     pub fn compare_with_options(&self, expected: &Self, options: &SchemaCompareOptions) -> bool {
  424 |         let children_match = self
  425 |             .blob_v2_logical_shared_child_count(expected)
  426 |             .map(|shared_child_count| {
  427 |                 compare_fields(
  428 |                     &self.children[..shared_child_count],
  429 |                     &expected.children[..shared_child_count],
  430 |                     options,
  431 |                 )
  432 |             })
  433 |             .unwrap_or_else(|| compare_fields(&self.children, &expected.children, options));
  434 |         self.name == expected.name
  435 |             && self.logical_type == expected.logical_type
  436 |             && Self::compare_nullability(expected.nullable, self.nullable, options)
  437 |             && children_match
  438 |             && (!options.compare_field_ids || self.id == expected.id)
  439 |             && (!options.compare_dictionary || self.dictionary == expected.dictionary)
  440 |             && (!options.compare_metadata || self.metadata == expected.metadata)
  441 |     }
  442 | 
  443 |     pub fn extension_name(&self) -> Option<&str> {
  444 |         self.metadata.get(ARROW_EXT_NAME_KEY).map(String::as_str)
  445 |     }
  446 | 
  447 |     pub fn child(&self, name: &str) -> Option<&Self> {
  448 |         self.children.iter().find(|f| f.name == name)
  449 |     }
  450 | 
  451 |     pub fn child_mut(&mut self, name: &str) -> Option<&mut Self> {
  452 |         self.children.iter_mut().find(|f| f.name == name)
  453 |     }
  454 | 
  455 |     /// Attach the Dictionary's value array, so that we can later serialize
  456 |     /// the dictionary to the manifest.
  457 |     pub fn set_dictionary_values(&mut self, arr: &ArrayRef) {
  458 |         assert!(self.data_type().is_dictionary());
  459 |         // offset / length are set to 0 and recomputed when the dictionary is persisted to disk
  460 |         self.dictionary = Some(Dictionary {
  461 |             offset: 0,
  462 |             length: 0,
  463 |             values: Some(arr.clone()),
  464 |         });
  465 |     }
  466 | 
  467 |     pub fn set_dictionary(&mut self, arr: &ArrayRef) {
  468 |         let data_type = self.data_type();
  469 |         match data_type {
  470 |             DataType::Dictionary(key_type, _) => match key_type.as_ref() {
  471 |                 DataType::Int8 => {
  472 |                     self.set_dictionary_values(arr.as_dictionary::<Int8Type>().values())
  473 |                 }
  474 |                 DataType::Int16 => {
  475 |                     self.set_dictionary_values(arr.as_dictionary::<Int16Type>().values())
  476 |                 }
  477 |                 DataType::Int32 => {
  478 |                     self.set_dictionary_values(arr.as_dictionary::<Int32Type>().values())
  479 |                 }
  480 |                 DataType::Int64 => {
  481 |                     self.set_dictionary_values(arr.as_dictionary::<Int64Type>().values())
  482 |                 }
  483 |                 DataType::UInt8 => {
  484 |                     self.set_dictionary_values(arr.as_dictionary::<UInt8Type>().values())
  485 |                 }
  486 |                 DataType::UInt16 => {
  487 |                     self.set_dictionary_values(arr.as_dictionary::<UInt16Type>().values())
  488 |                 }
  489 |                 DataType::UInt32 => {
  490 |                     self.set_dictionary_values(arr.as_dictionary::<UInt32Type>().values())
  491 |                 }
  492 |                 DataType::UInt64 => {
  493 |                     self.set_dictionary_values(arr.as_dictionary::<UInt64Type>().values())
  494 |                 }
  495 |                 _ => {
  496 |                     panic!("Unsupported dictionary key type: {}", key_type);
  497 |                 }
  498 |             },
  499 |             DataType::Struct(subfields) => {
  500 |                 for (i, f) in subfields.iter().enumerate() {
  501 |                     let lance_field = self
  502 |                         .children
  503 |                         .iter_mut()
  504 |                         .find(|c| c.name == *f.name())
  505 |                         .unwrap();
  506 |                     let struct_arr = arr.as_struct();
  507 |                     lance_field.set_dictionary(struct_arr.column(i));
  508 |                 }
  509 |             }
  510 |             DataType::List(_) => {
  511 |                 let list_arr = arr.as_list::<i32>();
  512 |                 self.children[0].set_dictionary(list_arr.values());
  513 |             }
  514 |             DataType::LargeList(_) => {
  515 |                 let list_arr = arr.as_list::<i64>();
  516 |                 self.children[0].set_dictionary(list_arr.values());
  517 |             }
  518 |             _ => {
  519 |                 // Field types that don't support dictionaries
  520 |             }
  521 |         }
  522 |     }
  523 | 
  524 |     pub fn sub_field(&self, path_components: &[&str]) -> Option<&Self> {
  525 |         if path_components.is_empty() {
  526 |             Some(self)
  527 |         } else {
  528 |             let first = path_components[0];
  529 |             self.children
  530 |                 .iter()
  531 |                 .find(|c| c.name == first)
  532 |                 .and_then(|c| c.sub_field(&path_components[1..]))
  533 |         }
  534 |     }
  535 | 
  536 |     pub fn sub_field_mut(&mut self, path_components: &[&str]) -> Option<&mut Self> {
  537 |         if path_components.is_empty() {
  538 |             Some(self)
  539 |         } else {
  540 |             let first = path_components[0];
  541 |             self.children
  542 |                 .iter_mut()
  543 |                 .find(|c| c.name == first)
  544 |                 .and_then(|c| c.sub_field_mut(&path_components[1..]))
  545 |         }
  546 |     }
  547 | 
  548 |     /// Check if the user has labeled the field as a blob
  549 |     ///
  550 |     /// Blob fields will load descriptions by default
  551 |     pub fn is_blob(&self) -> bool {
  552 |         self.metadata.contains_key(BLOB_META_KEY)
  553 |             || self
  554 |                 .metadata
  555 |                 .get(ARROW_EXT_NAME_KEY)
  556 |                 .map(|name| name == BLOB_V2_EXT_NAME)
  557 |                 .unwrap_or(false)
  558 |     }
  559 | 
  560 |     /// Returns true if the field is explicitly marked as blob v2 extension.
  561 |     pub fn is_blob_v2(&self) -> bool {
  562 |         self.metadata
  563 |             .get(ARROW_EXT_NAME_KEY)
  564 |             .map(|name| name == BLOB_V2_EXT_NAME)
  565 |             .unwrap_or(false)
  566 |             || self.is_blob_v2_descriptor()
  567 |     }
  568 | 
  569 |     /// Represent legacy blobs in this field tree as Blob v2 logical inputs, preserving their identities.
  570 |     ///
  571 |     /// The new logical children have unassigned IDs; callers persisting the schema
  572 |     /// must assign them with [`Self::set_id`]. Existing Blob v2 fields are unchanged.
  573 |     ///
  574 |     /// ```
  575 |     /// # use lance_core::datatypes::Field;
  576 |     /// # fn prepare(field: &mut Field) -> lance_core::Result<()> {
  577 |     /// field.promote_blob_v2()?;
  578 |     /// # Ok(())
  579 |     /// # }
  580 |     /// ```
  581 |     pub fn promote_blob_v2(&mut self) -> Result<()> {
  582 |         if !self.is_blob() {
  583 |             for child in &mut self.children {
  584 |                 child.promote_blob_v2()?;
  585 |             }
  586 |             return Ok(());
  587 |         }
  588 |         if self.is_blob_v2() {
  589 |             return Ok(());
  590 |         }
  591 |         self.logical_type = LogicalType::from("struct");
  592 |         self.encoding = None;
  593 |         self.children = super::BLOB_V2_LOGICAL_MINIMAL_FIELDS
  594 |             .iter()
  595 |             .map(|field| Self::try_from(field.as_ref()))
  596 |             .collect::<Result<Vec<_>>>()?;
  597 |         self.metadata.remove(BLOB_META_KEY);
  598 |         self.metadata
  599 |             .insert(ARROW_EXT_NAME_KEY.to_string(), BLOB_V2_EXT_NAME.to_string());
  600 |         Ok(())
  601 |     }
  602 | 
  603 |     fn blob_v2_layout(&self) -> Option<BlobV2Layout> {
  604 |         if self.extension_name() != Some(BLOB_V2_EXT_NAME) {
  605 |             return None;
  606 |         }
  607 |         let DataType::Struct(fields) = self.data_type() else {
  608 |             return None;
  609 |         };
  610 |         BlobV2Layout::classify(&fields)
  611 |     }
  612 | 
  613 |     fn blob_v2_logical_shared_child_count(&self, other: &Self) -> Option<usize> {
  614 |         if self.blob_v2_layout() == Some(BlobV2Layout::Logical)
  615 |             && other.blob_v2_layout() == Some(BlobV2Layout::Logical)
  616 |         {
  617 |             Some(self.children.len().min(other.children.len()))
  618 |         } else {
  619 |             None
  620 |         }
  621 |     }
  622 | 
  623 |     fn is_blob_v2_descriptor(&self) -> bool {
  624 |         self.metadata.contains_key(BLOB_META_KEY)
  625 |             && self.logical_type == BLOB_V2_DESC_LANCE_FIELD.logical_type
  626 |             && self.children.len() == BLOB_V2_DESC_LANCE_FIELD.children.len()
  627 |             && self
  628 |                 .children
  629 |                 .iter()
  630 |                 .zip(BLOB_V2_DESC_LANCE_FIELD.children.iter())
  631 |                 .all(|(child, expected)| {
  632 |                     child.name == expected.name && child.data_type() == expected.data_type()
  633 |                 })
  634 |     }
  635 | 
  636 |     // Blob columns intentionally have two schema representations:
  637 |     // the loaded value view (legacy LargeBinary or blob v2 struct) and the unloaded
  638 |     // descriptor view used by projection/planning. Schema set operations need to
  639 |     // treat them as the same logical column instead of ordinary incompatible types.
  640 |     fn is_compatible_blob_projection(&self, other: &Self) -> bool {
  641 |         self.is_blob() && other.is_blob() && self.is_blob_v2() == other.is_blob_v2()
  642 |     }
  643 | 
  644 |     /// If the field is a blob, update this field with the same name and id
  645 |     /// but with the data type set to a struct of the blob description fields.
  646 |     ///
  647 |     /// If the field is not a blob, return the field itself.
  648 |     pub fn unloaded_mut(&mut self) {
  649 |         if self.is_blob_v2() {
  650 |             self.logical_type = BLOB_V2_DESC_LANCE_FIELD.logical_type.clone();
  651 |             self.children = BLOB_V2_DESC_LANCE_FIELD.children.clone();
  652 |             self.metadata = BLOB_V2_DESC_LANCE_FIELD.metadata.clone();
  653 |         } else if self.is_blob() {
  654 |             self.logical_type = BLOB_DESC_LANCE_FIELD.logical_type.clone();
  655 |             self.children = BLOB_DESC_LANCE_FIELD.children.clone();
  656 |             self.metadata = BLOB_DESC_LANCE_FIELD.metadata.clone();
  657 |         }
  658 |     }
  659 | 
  660 |     /// Convert a blob field to the materialized binary payload view.
  661 |     ///
  662 |     /// The field keeps its name and id but uses `LargeBinary` with no children.
  663 |     /// Blob v2 fields retain their extension marker internally so scan planning
  664 |     /// can recognize the binary view before exposing a plain Arrow binary field.
  665 |     pub fn binary_blob_mut(&mut self) {
  666 |         if !self.is_blob() {
  667 |             return;
  668 |         }
  669 |         let is_blob_v2 = self.is_blob_v2();
  670 | 
  671 |         self.logical_type = LogicalType::try_from(&DataType::LargeBinary)
  672 |             .expect("LargeBinary is always a valid logical type");
  673 |         self.children.clear();
  674 |         self.encoding = Some(Encoding::VarBinary);
  675 |         if is_blob_v2 {
  676 |             self.metadata.remove(BLOB_META_KEY);
  677 |             for key in PACKED_KEYS {
  678 |                 self.metadata.remove(key);
  679 |             }
  680 |             self.metadata
  681 |                 .insert(ARROW_EXT_NAME_KEY.to_string(), BLOB_V2_EXT_NAME.to_string());
  682 |         }
  683 |     }
  684 | 
  685 |     /// Convert blob v2 fields in this field tree to their descriptor view.
  686 |     pub fn unload_blobs_recursive(&mut self) {
  687 |         if self.is_blob_v2() {
  688 |             self.unloaded_mut();
  689 |             return;
  690 |         }
  691 | 
  692 |         for child in &mut self.children {
  693 |             child.unload_blobs_recursive();
  694 |         }
  695 |     }
  696 | 
  697 |     pub fn project(&self, path_components: &[&str]) -> Result<Self> {
  698 |         let mut f = Self {
  699 |             name: self.name.clone(),
  700 |             id: self.id,
  701 |             parent_id: self.parent_id,
  702 |             logical_type: self.logical_type.clone(),
  703 |             metadata: self.metadata.clone(),
  704 |             encoding: self.encoding.clone(),
  705 |             nullable: self.nullable,
  706 |             children: vec![],
  707 |             dictionary: self.dictionary.clone(),
  708 |             unenforced_primary_key_position: self.unenforced_primary_key_position,
  709 |             unenforced_clustering_key_position: self.unenforced_clustering_key_position,
  710 |         };
  711 |         if path_components.is_empty() {
  712 |             // Project stops here, copy all the remaining children.
  713 |             f.children.clone_from(&self.children)
  714 |         } else {
  715 |             let first = path_components[0];
  716 |             for c in self.children.as_slice() {
  717 |                 if c.name == first {
  718 |                     let projected = c.project(&path_components[1..])?;
  719 |                     f.children.push(projected);
  720 |                     break;
  721 |                 }
  722 |             }
  723 |         }
  724 |         Ok(f)
  725 |     }
  726 | 
  727 |     /// Create a new field by removing all fields that do not match the filter.
  728 |     ///
  729 |     /// If a child field matches the filter then the parent will be kept even if
  730 |     /// it does not match the filter.
  731 |     ///
  732 |     /// Returns None if the field itself does not match the filter.
  733 |     pub fn project_by_filter<F: Fn(&Self) -> bool>(&self, filter: &F) -> Option<Self> {
  734 |         let children = self
  735 |             .children
  736 |             .iter()
  737 |             .filter_map(|c| c.project_by_filter(filter))
  738 |             .collect::<Vec<_>>();
  739 |         if !children.is_empty() || filter(self) {
  740 |             Some(Self {
  741 |                 children,
  742 |                 ..self.clone()
  743 |             })
  744 |         } else {
  745 |             None
  746 |         }
  747 |     }
  748 | 
  749 |     /// Create a new field by selecting fields by their ids.
  750 |     ///
  751 |     /// If a field has it's id in the list of ids then it will be included
  752 |     /// in the new field. If a field is selected, all of it's parents will be
  753 |     /// and all of it's children will be included.
  754 |     ///
  755 |     /// For example, for the schema:
  756 |     ///
  757 |     /// ```text
  758 |     /// 0: x struct {
  759 |     ///     1: y int32
  760 |     ///     2: l list {
  761 |     ///         3: z int32
  762 |     ///     }
  763 |     /// }
  764 |     /// ```
  765 |     ///
  766 |     /// If the ids are `[2]`, then this will include the parent `0` and the
  767 |     /// child `3`.
  768 |     pub(crate) fn project_by_ids(&self, ids: &[i32], include_all_children: bool) -> Option<Self> {
  769 |         let children = self
  770 |             .children
  771 |             .iter()
  772 |             .filter_map(|c| c.project_by_ids(ids, include_all_children))
  773 |             .collect::<Vec<_>>();
  774 |         if ids.contains(&self.id) && (children.is_empty() || include_all_children) {
  775 |             Some(self.clone())
  776 |         } else if !children.is_empty() {
  777 |             Some(Self {
  778 |                 children,
  779 |                 ..self.clone()
  780 |             })
  781 |         } else {
  782 |             None
  783 |         }
  784 |     }
  785 | 
  786 |     /// Project by a field.
  787 |     ///
  788 |     pub fn project_by_field(&self, other: &Self, on_type_mismatch: OnTypeMismatch) -> Result<Self> {
  789 |         if self.name != other.name {
  790 |             return Err(Error::schema(format!(
  791 |                 "Attempt to project field by different names: {} and {}",
  792 |                 self.name, other.name,
  793 |             )));
  794 |         };
  795 | 
  796 |         if self.is_compatible_blob_projection(other) {
  797 |             return Ok(self.clone());
  798 |         }
  799 | 
  800 |         match (self.data_type(), other.data_type()) {
  801 |             (DataType::Boolean, DataType::Boolean) => Ok(self.clone()),
  802 |             (dt, other_dt)
  803 |                 if (dt.is_primitive() && other_dt.is_primitive())
  804 |                     || (dt.is_binary_like() && other_dt.is_binary_like()) =>
  805 |             {
  806 |                 if dt != other_dt {
  807 |                     return Err(Error::schema(format!(
  808 |                         "Attempt to project field by different types: {} and {}",
  809 |                         dt, other_dt,
  810 |                     )));
  811 |                 }
  812 |                 Ok(self.clone())
  813 |             }
  814 |             (DataType::Struct(_), DataType::Struct(_)) => {
  815 |                 // Blob v2 columns are special: they can have different struct layouts
  816 |                 // (logical input vs. descriptor struct). We treat blob v2 structs like primitive
  817 |                 // fields (e.g. a binary column) during schema set operations (union/subtract).
  818 |                 if self.is_blob() {
  819 |                     return Ok(self.clone());
  820 |                 }
  821 |                 let mut fields = vec![];
  822 |                 for other_field in other.children.iter() {
  823 |                     let Some(child) = self.child(&other_field.name) else {
  824 |                         return Err(Error::schema(format!(
  825 |                             "Attempt to project non-existed field: {} on {}",
  826 |                             other_field.name, self,
  827 |                         )));
  828 |                     };
  829 |                     fields.push(child.project_by_field(other_field, on_type_mismatch)?);
  830 |                 }
  831 |                 let mut cloned = self.clone();
  832 |                 cloned.children = fields;
  833 |                 Ok(cloned)
  834 |             }
  835 |             (DataType::List(_), DataType::List(_))
  836 |             | (DataType::LargeList(_), DataType::LargeList(_))
  837 |             | (DataType::Map(_, _), DataType::Map(_, _)) => {
  838 |                 let projected =
  839 |                     self.children[0].project_by_field(&other.children[0], on_type_mismatch)?;
  840 |                 let mut cloned = self.clone();
  841 |                 cloned.children = vec![projected];
  842 |                 Ok(cloned)
  843 |             }
  844 |             (DataType::FixedSizeList(dt, n), DataType::FixedSizeList(other_dt, m))
  845 |                 if dt == other_dt && n == m =>
  846 |             {
  847 |                 Ok(self.clone())
  848 |             }
  849 |             (
  850 |                 DataType::Dictionary(self_key, self_value),
  851 |                 DataType::Dictionary(other_key, other_value),
  852 |             ) if self_key == other_key && self_value == other_value => Ok(self.clone()),
  853 |             (DataType::Null, DataType::Null) => Ok(self.clone()),
  854 |             (DataType::FixedSizeBinary(self_width), DataType::FixedSizeBinary(other_width))
  855 |                 if self_width == other_width =>
  856 |             {
  857 |                 Ok(self.clone())
  858 |             }
  859 |             _ => match on_type_mismatch {
  860 |                 OnTypeMismatch::Error => Err(Error::schema(format!(
  861 |                     "Attempt to project incompatible fields: {} and {}",
  862 |                     self, other
  863 |                 ))),
  864 |                 OnTypeMismatch::TakeSelf => Ok(self.clone()),
  865 |             },
  866 |         }
  867 |     }
  868 | 
  869 |     pub(crate) fn resolve<'a>(
  870 |         &'a self,
  871 |         split: &mut VecDeque<&str>,
  872 |         fields: &mut Vec<&'a Self>,
  873 |     ) -> bool {
  874 |         fields.push(self);
  875 |         if split.is_empty() {
  876 |             return true;
  877 |         }
  878 |         let first = split.pop_front().unwrap();
  879 |         if let Some(child) = self.children.iter().find(|c| c.name == first) {
  880 |             child.resolve(split, fields)
  881 |         } else {
  882 |             false
  883 |         }
  884 |     }
  885 | 
  886 |     /// Case-insensitive version of resolve.
  887 |     /// First tries exact match for each child, then falls back to case-insensitive.
  888 |     pub(crate) fn resolve_case_insensitive<'a>(
  889 |         &'a self,
  890 |         split: &mut VecDeque<&str>,
  891 |         fields: &mut Vec<&'a Self>,
  892 |     ) -> bool {
  893 |         fields.push(self);
  894 |         if split.is_empty() {
  895 |             return true;
  896 |         }
  897 |         let first = split.pop_front().unwrap();
  898 |         // Try exact match first
  899 |         if let Some(child) = self.children.iter().find(|c| c.name == first) {
  900 |             return child.resolve_case_insensitive(split, fields);
  901 |         }
  902 |         // Fall back to case-insensitive match
  903 |         if let Some(child) = self
  904 |             .children
  905 |             .iter()
  906 |             .find(|c| c.name.eq_ignore_ascii_case(first))
  907 |         {
  908 |             return child.resolve_case_insensitive(split, fields);
  909 |         }
  910 |         false
  911 |     }
  912 | 
  913 |     pub(crate) fn do_intersection(&self, other: &Self, ignore_types: bool) -> Result<Self> {
  914 |         if self.name != other.name {
  915 |             return Err(Error::arrow(format!(
  916 |                 "Attempt to intersect different fields: {} and {}",
  917 |                 self.name, other.name,
  918 |             )));
  919 |         }
  920 | 
  921 |         if self.is_blob() != other.is_blob() {
  922 |             if ignore_types {
  923 |                 return Ok(if self.id >= 0 {
  924 |                     self.clone()
  925 |                 } else {
  926 |                     other.clone()
  927 |                 });
  928 |             }
  929 |             return Err(Error::arrow(format!(
  930 |                 "Attempt to intersect blob and non-blob field: {}",
  931 |                 self.name
  932 |             )));
  933 |         }
  934 | 
  935 |         if self.is_compatible_blob_projection(other) {
  936 |             return Ok(if self.id >= 0 {
  937 |                 self.clone()
  938 |             } else {
  939 |                 other.clone()
  940 |             });
  941 |         }
  942 | 
  943 |         let self_type = self.data_type();
  944 |         let other_type = other.data_type();
  945 | 
  946 |         if matches!(
  947 |             (&self_type, &other_type),
  948 |             (DataType::Struct(_), DataType::Struct(_))
  949 |                 | (DataType::List(_), DataType::List(_))
  950 |                 | (DataType::Map(_, _), DataType::Map(_, _))
  951 |         ) {
  952 |             // Blob v2 uses a struct logical type for descriptors, which differs from the logical
  953 |             // input struct (data/uri). When intersecting schemas for projection we want to keep
  954 |             // the projected blob layout instead of intersecting by child names.
  955 |             if self.is_blob() {
  956 |                 return Ok(self.clone());
  957 |             }
  958 | 
  959 |             let children = self
  960 |                 .children
  961 |                 .iter()
  962 |                 .filter_map(|c| {
  963 |                     if let Some(other_child) = other.child(&c.name) {
  964 |                         let intersection = c.do_intersection(other_child, ignore_types).ok()?;
  965 |                         Some(intersection)
  966 |                     } else {
  967 |                         None
  968 |                     }
  969 |                 })
  970 |                 .collect::<Vec<_>>();
  971 |             let f = Self {
  972 |                 name: self.name.clone(),
  973 |                 id: if self.id >= 0 { self.id } else { other.id },
  974 |                 parent_id: self.parent_id,
  975 |                 logical_type: self.logical_type.clone(),
  976 |                 metadata: self.metadata.clone(),
  977 |                 encoding: self.encoding.clone(),
  978 |                 nullable: self.nullable,
  979 |                 children,
  980 |                 dictionary: self.dictionary.clone(),
  981 |                 unenforced_primary_key_position: self.unenforced_primary_key_position,
  982 |                 unenforced_clustering_key_position: self.unenforced_clustering_key_position,
  983 |             };
  984 |             return Ok(f);
  985 |         }
  986 | 
  987 |         if (!ignore_types && self_type != other_type) || self.name != other.name {
  988 |             return Err(Error::arrow(format!(
  989 |                 "Attempt to intersect different fields: ({}, {}) and ({}, {})",
  990 |                 self.name, self_type, other.name, other_type
  991 |             )));
  992 |         }
  993 | 
  994 |         Ok(if self.id >= 0 {
  995 |             self.clone()
  996 |         } else {
  997 |             other.clone()
  998 |         })
  999 |     }
 1000 | 
 1001 |     /// Intersection of two [`Field`]s.
 1002 |     ///
 1003 |     pub fn intersection(&self, other: &Self) -> Result<Self> {
 1004 |         self.do_intersection(other, false)
 1005 |     }
 1006 | 
 1007 |     /// Intersection of two [`Field`]s, ignoring data types.
 1008 |     pub fn intersection_ignore_types(&self, other: &Self) -> Result<Self> {
 1009 |         self.do_intersection(other, true)
 1010 |     }
 1011 | 
 1012 |     pub fn exclude(&self, other: &Self) -> Option<Self> {
 1013 |         if !self.data_type().is_nested() {
 1014 |             return None;
 1015 |         }
 1016 |         let children = self
 1017 |             .children
 1018 |             .iter()
 1019 |             .map(|c| {
 1020 |                 if let Some(other_child) = other.child(&c.name) {
 1021 |                     c.exclude(other_child)
 1022 |                 } else {
 1023 |                     Some(c.clone())
 1024 |                 }
 1025 |             })
 1026 |             .filter(Option::is_some)
 1027 |             .flatten()
 1028 |             .collect::<Vec<_>>();
 1029 |         if children.is_empty() {
 1030 |             None
 1031 |         } else {
 1032 |             Some(Self {
 1033 |                 name: self.name.clone(),
 1034 |                 id: self.id,
 1035 |                 parent_id: self.parent_id,
 1036 |                 logical_type: self.logical_type.clone(),
 1037 |                 metadata: self.metadata.clone(),
 1038 |                 encoding: self.encoding.clone(),
 1039 |                 nullable: self.nullable,
 1040 |                 children,
 1041 |                 dictionary: self.dictionary.clone(),
 1042 |                 unenforced_primary_key_position: self.unenforced_primary_key_position,
 1043 |                 unenforced_clustering_key_position: self.unenforced_clustering_key_position,
 1044 |             })
 1045 |         }
 1046 |     }
 1047 | 
 1048 |     /// Merge the children of other field into this one.
 1049 |     pub(super) fn merge(&mut self, other: &Self) -> Result<()> {
 1050 |         match (self.data_type(), other.data_type()) {
 1051 |             (DataType::Struct(_), DataType::Struct(_)) => {
 1052 |                 for other_child in other.children.as_slice() {
 1053 |                     if let Some(field) = self.child_mut(&other_child.name) {
 1054 |                         field.merge(other_child)?;
 1055 |                     } else {
 1056 |                         self.children.push(other_child.clone());
 1057 |                     }
 1058 |                 }
 1059 |             }
 1060 |             (DataType::List(_), DataType::List(_))
 1061 |             | (DataType::LargeList(_), DataType::LargeList(_)) => {
 1062 |                 self.children[0].merge(&other.children[0])?;
 1063 |             }
 1064 |             (
 1065 |                 DataType::FixedSizeList(_, self_list_size),
 1066 |                 DataType::FixedSizeList(_, other_list_size),
 1067 |             ) if self_list_size == other_list_size => {
 1068 |                 // do nothing
 1069 |             }
 1070 |             (DataType::FixedSizeBinary(self_size), DataType::FixedSizeBinary(other_size))
 1071 |                 if self_size == other_size =>
 1072 |             {
 1073 |                 // do nothing
 1074 |             }
 1075 |             _ => {
 1076 |                 if self.data_type() != other.data_type() {
 1077 |                     return Err(Error::schema(format!(
 1078 |                         "Attempt to merge incompatible fields: {} and {}",
 1079 |                         self, other
 1080 |                     )));
 1081 |                 }
 1082 |             }
 1083 |         }
 1084 |         Ok(())
 1085 |     }
 1086 | 
 1087 |     // Get the max field id of itself and all children.
 1088 |     pub(super) fn max_id(&self) -> i32 {
 1089 |         max(
 1090 |             self.id,
 1091 |             self.children.iter().map(|c| c.max_id()).max().unwrap_or(-1),
 1092 |         )
 1093 |     }
 1094 | 
 1095 |     /// Recursively set field ID and parent ID for this field and all its children.
 1096 |     pub fn set_id(&mut self, parent_id: i32, id_seed: &mut i32) {
 1097 |         self.parent_id = parent_id;
 1098 |         if self.id < 0 {
 1099 |             self.id = *id_seed;
 1100 |             *id_seed += 1;
 1101 |         }
 1102 |         self.children
 1103 |             .iter_mut()
 1104 |             .for_each(|f| f.set_id(self.id, id_seed));
 1105 |     }
 1106 | 
 1107 |     /// Recursively reset field ID for this field and all its children.
 1108 |     pub(super) fn reset_id(&mut self) {
 1109 |         self.id = -1;
 1110 |         self.children.iter_mut().for_each(Self::reset_id);
 1111 |     }
 1112 | 
 1113 |     pub fn field_by_id_mut(&mut self, id: impl Into<i32>) -> Option<&mut Self> {
 1114 |         let id = id.into();
 1115 |         for child in self.children.as_mut_slice() {
 1116 |             if child.id == id {
 1117 |                 return Some(child);
 1118 |             }
 1119 |             if let Some(grandchild) = child.field_by_id_mut(id) {
 1120 |                 return Some(grandchild);
 1121 |             }
 1122 |         }
 1123 |         None
 1124 |     }
 1125 | 
 1126 |     pub fn field_by_id(&self, id: impl Into<i32>) -> Option<&Self> {
 1127 |         let id = id.into();
 1128 |         for child in self.children.as_slice() {
 1129 |             if child.id == id {
 1130 |                 return Some(child);
 1131 |             }
 1132 |             if let Some(grandchild) = child.field_by_id(id) {
 1133 |                 return Some(grandchild);
 1134 |             }
 1135 |         }
 1136 |         None
 1137 |     }
 1138 | 
 1139 |     // Find any nested child with a specific field id
 1140 |     pub(super) fn mut_field_by_id(&mut self, id: impl Into<i32>) -> Option<&mut Self> {
 1141 |         let id = id.into();
 1142 |         for child in self.children.as_mut_slice() {
 1143 |             if child.id == id {
 1144 |                 return Some(child);
 1145 |             }
 1146 |             if let Some(grandchild) = child.mut_field_by_id(id) {
 1147 |                 return Some(grandchild);
 1148 |             }
 1149 |         }
 1150 |         None
 1151 |     }
 1152 | 
 1153 |     // Check if field has metadata `packed` set to true, this check is case insensitive.
 1154 |     pub fn is_packed_struct(&self) -> bool {
 1155 |         PACKED_KEYS.iter().any(|key| {
 1156 |             self.metadata
 1157 |                 .get(*key)
 1158 |                 .map(|value| str_is_truthy(value))
 1159 |                 .unwrap_or(false)
 1160 |         })
 1161 |     }
 1162 | 
 1163 |     /// Return true if the field is a leaf field.
 1164 |     ///
 1165 |     /// A leaf field is a field that is not a struct or a list.
 1166 |     pub fn is_leaf(&self) -> bool {
 1167 |         self.children.is_empty()
 1168 |     }
 1169 | 
 1170 |     /// Return true if the field is part of the (unenforced) primary key.
 1171 |     pub fn is_unenforced_primary_key(&self) -> bool {
 1172 |         self.unenforced_primary_key_position.is_some()
 1173 |     }
 1174 | 
 1175 |     pub fn is_unenforced_clustering_key(&self) -> bool {
 1176 |         self.unenforced_clustering_key_position.is_some()
 1177 |     }
 1178 | }
 1179 | 
 1180 | impl fmt::Display for Field {
 1181 |     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
 1182 |         write!(
 1183 |             f,
 1184 |             "Field(id={}, name={}, type={}",
 1185 |             self.id, self.name, self.logical_type.0,
 1186 |         )?;
 1187 | 
 1188 |         if let Some(dictionary) = &self.dictionary {
 1189 |             write!(f, ", dictionary={:?}", dictionary)?;
 1190 |         }
 1191 | 
 1192 |         if !self.children.is_empty() {
 1193 |             write!(f, ", children=[")?;
 1194 |             for child in self.children.iter() {
 1195 |                 write!(f, "{}, ", child)?;
 1196 |             }
 1197 |             write!(f, "]")?;
 1198 |         }
 1199 | 
 1200 |         write!(f, ")")
 1201 |     }
 1202 | }
 1203 | 
 1204 | impl TryFrom<&ArrowField> for Field {
 1205 |     type Error = Error;
 1206 | 
 1207 |     fn try_from(field: &ArrowField) -> Result<Self> {
 1208 |         let mut metadata = field.metadata().clone();
 1209 |         let id = match metadata.remove(LANCE_FIELD_ID_KEY) {
 1210 |             Some(val) => val
 1211 |                 .parse::<i32>()
 1212 |                 .map_err(|e| Error::invalid_input(e.to_string()))?
 1213 |                 .max(-1),
 1214 |             None => -1,
 1215 |         };
 1216 | 
 1217 |         let children = match field.data_type() {
 1218 |             DataType::Struct(children) => children
 1219 |                 .iter()
 1220 |                 .map(|f| Self::try_from(f.as_ref()))
 1221 |                 .collect::<Result<_>>()?,
 1222 |             DataType::List(item) => vec![Self::try_from(item.as_ref())?],
 1223 |             DataType::LargeList(item) => vec![Self::try_from(item.as_ref())?],
 1224 |             DataType::FixedSizeList(item, _) if matches!(item.data_type(), DataType::Struct(_)) => {
 1225 |                 vec![Self::try_from(item.as_ref())?]
 1226 |             }
 1227 |             DataType::Map(entries, keys_sorted) => {
 1228 |                 // TODO: We only support keys_sorted=false for now,
 1229 |                 //  because converting a rust arrow map field to the python arrow field will
 1230 |                 //  lose the keys_sorted property.
 1231 |                 if *keys_sorted {
 1232 |                     return Err(Error::schema(
 1233 |                         "Unsupported map field with keys_sorted=true".to_string(),
 1234 |                     ));
 1235 |                 }
 1236 |                 // Validate Map entries follow Arrow specification
 1237 |                 let DataType::Struct(struct_fields) = entries.data_type() else {
 1238 |                     return Err(Error::schema(
 1239 |                         "Map entries field must be a Struct<key, value>".to_string(),
 1240 |                     ));
 1241 |                 };
 1242 |                 if struct_fields.len() < 2 {
 1243 |                     return Err(Error::schema(
 1244 |                         "Map entries struct must contain both key and value fields".to_string(),
 1245 |                     ));
 1246 |                 }
 1247 |                 let key_field = &struct_fields[0];
 1248 |                 if key_field.is_nullable() {
 1249 |                     return Err(Error::schema(format!(
 1250 |                         "Map key field '{}' must be non-nullable according to Arrow Map specification",
 1251 |                         key_field.name()
 1252 |                     )));
 1253 |                 }
 1254 |                 vec![Self::try_from(entries.as_ref())?]
 1255 |             }
 1256 |             _ => vec![],
 1257 |         };
 1258 |         let unenforced_primary_key_position = metadata
 1259 |             .get(LANCE_UNENFORCED_PRIMARY_KEY_POSITION)
 1260 |             .and_then(|s| s.parse::<u32>().ok())
 1261 |             .or_else(|| {
 1262 |                 // Backward compatibility: use 0 for legacy boolean flag
 1263 |                 metadata
 1264 |                     .get(LANCE_UNENFORCED_PRIMARY_KEY)
 1265 |                     .filter(|s| str_is_truthy(s))
 1266 |                     .map(|_| 0)
 1267 |             });
 1268 |         let unenforced_clustering_key_position = metadata
 1269 |             .get(LANCE_UNENFORCED_CLUSTERING_KEY_POSITION)
 1270 |             .and_then(|s| s.parse::<u32>().ok());
 1271 |         let is_blob_v2 = has_blob_v2_extension(field);
 1272 | 
 1273 |         if is_blob_v2 {
 1274 |             metadata
 1275 |                 .entry(ARROW_EXT_NAME_KEY.to_string())
 1276 |                 .or_insert_with(|| BLOB_V2_EXT_NAME.to_string());
 1277 |         }
 1278 | 
 1279 |         // Check for JSON extension types (both Arrow and Lance)
 1280 |         let logical_type = if is_arrow_json_field(field) || is_json_field(field) {
 1281 |             // A `json` field is stored as Lance JSONB whatever the input
 1282 |             // representation, so record the stored extension.
 1283 |             metadata.insert(
 1284 |                 ARROW_EXT_NAME_KEY.to_string(),
 1285 |                 lance_arrow::json::JSON_EXT_NAME.to_string(),
 1286 |             );
 1287 |             LogicalType::from("json")
 1288 |         } else if is_blob_v2 {
 1289 |             LogicalType::from("struct")
 1290 |         } else {
 1291 |             LogicalType::try_from(field.data_type())?
 1292 |         };
 1293 | 
 1294 |         Ok(Self {
 1295 |             id,
 1296 |             parent_id: -1,
 1297 |             name: field.name().clone(),
 1298 |             logical_type,
 1299 |             encoding: match field.data_type() {
 1300 |                 dt if dt.is_fixed_stride() => Some(Encoding::Plain),
 1301 |                 dt if dt.is_binary_like() => Some(Encoding::VarBinary),
 1302 |                 DataType::Dictionary(_, _) => Some(Encoding::Dictionary),
 1303 |                 // Use plain encoder to store the offsets of list and map.
 1304 |                 DataType::List(_) | DataType::LargeList(_) | DataType::Map(_, _) => {
 1305 |                     Some(Encoding::Plain)
 1306 |                 }
 1307 |                 _ => None,
 1308 |             },
 1309 |             metadata,
 1310 |             nullable: field.is_nullable(),
 1311 |             children,
 1312 |             dictionary: None,
 1313 |             unenforced_primary_key_position,
 1314 |             unenforced_clustering_key_position,
 1315 |         })
 1316 |     }
 1317 | }
 1318 | 
 1319 | impl TryFrom<ArrowField> for Field {
 1320 |     type Error = Error;
 1321 | 
 1322 |     fn try_from(field: ArrowField) -> Result<Self> {
 1323 |         Self::try_from(&field)
 1324 |     }
 1325 | }
 1326 | 
 1327 | impl From<&Field> for ArrowField {
 1328 |     fn from(field: &Field) -> Self {
 1329 |         let out = Self::new(&field.name, field.data_type(), field.nullable);
 1330 |         let mut metadata = field.metadata.clone();
 1331 | 
 1332 |         if field.logical_type.is_blob() {
 1333 |             metadata
 1334 |                 .entry(BLOB_META_KEY.to_string())
 1335 |                 .or_insert_with(|| "true".to_string());
 1336 |         }
 1337 | 
 1338 |         // Add JSON extension metadata if this is a JSON field
 1339 |         if field.logical_type.0 == "json" {
 1340 |             metadata.insert(
 1341 |                 ARROW_EXT_NAME_KEY.to_string(),
 1342 |                 lance_arrow::json::JSON_EXT_NAME.to_string(),
 1343 |             );
 1344 |         }
 1345 | 
 1346 |         out.with_metadata(metadata)
 1347 |     }
 1348 | }
 1349 | 
 1350 | #[cfg(test)]
 1351 | mod tests {
 1352 |     use super::*;
 1353 | 
 1354 |     use arrow_array::{DictionaryArray, StringArray, UInt32Array};
 1355 |     use arrow_schema::{Fields, TimeUnit};
 1356 |     use lance_arrow::BLOB_META_KEY;
 1357 |     use std::collections::HashMap;
 1358 | 
 1359 |     use crate::datatypes::{BLOB_V2_LOGICAL_FIELDS, BLOB_V2_LOGICAL_MINIMAL_FIELDS};
 1360 | 
 1361 |     fn blob_v2_logical_field(children: Fields) -> Field {
 1362 |         ArrowField::new("blob", DataType::Struct(children), true)
 1363 |             .with_metadata(HashMap::from([(
 1364 |                 ARROW_EXT_NAME_KEY.to_string(),
 1365 |                 BLOB_V2_EXT_NAME.to_string(),
 1366 |             )]))
 1367 |             .try_into()
 1368 |             .unwrap()
 1369 |     }
 1370 | 
 1371 |     #[test]
 1372 |     fn blob_v2_logical_shapes_are_compatible() {
 1373 |         let minimal = blob_v2_logical_field(BLOB_V2_LOGICAL_MINIMAL_FIELDS.clone());
 1374 |         let complete = blob_v2_logical_field(BLOB_V2_LOGICAL_FIELDS.clone());
 1375 |         let complete_required_range = blob_v2_logical_field(Fields::from(
 1376 |             BLOB_V2_LOGICAL_FIELDS
 1377 |                 .iter()
 1378 |                 .enumerate()
 1379 |                 .map(|(index, field)| Arc::new(field.as_ref().clone().with_nullable(index < 2)))
 1380 |                 .collect::<Vec<_>>(),
 1381 |         ));
 1382 |         let options = SchemaCompareOptions::default();
 1383 | 
 1384 |         for complete_shape in [&complete, &complete_required_range] {
 1385 |             assert!(minimal.compare_with_options(complete_shape, &options));
 1386 |             assert!(complete_shape.compare_with_options(&minimal, &options));
 1387 |             assert_eq!(minimal.explain_difference(complete_shape, &options), None);
 1388 |             assert_eq!(complete_shape.explain_difference(&minimal, &options), None);
 1389 |         }
 1390 | 
 1391 |         assert!(!complete.compare_with_options(&complete_required_range, &options));
 1392 |         let ignore_nullability = SchemaCompareOptions {
 1393 |             compare_nullability: NullabilityComparison::Ignore,
 1394 |             ..Default::default()
 1395 |         };
 1396 |         assert!(complete.compare_with_options(&complete_required_range, &ignore_nullability));
 1397 | 
 1398 |         let complete_with_child_metadata = blob_v2_logical_field(Fields::from(
 1399 |             BLOB_V2_LOGICAL_FIELDS
 1400 |                 .iter()
 1401 |                 .enumerate()
 1402 |                 .map(|(index, field)| {
 1403 |                     let field = if index == 0 {
 1404 |                         field.as_ref().clone().with_metadata(HashMap::from([(
 1405 |                             "source".to_string(),
 1406 |                             "test".to_string(),
 1407 |                         )]))
 1408 |                     } else {
 1409 |                         field.as_ref().clone()
 1410 |                     };
 1411 |                     Arc::new(field)
 1412 |                 })
 1413 |                 .collect::<Vec<_>>(),
 1414 |         ));
 1415 |         let compare_metadata = SchemaCompareOptions {
 1416 |             compare_metadata: true,
 1417 |             ..Default::default()
 1418 |         };
 1419 |         assert!(!complete.compare_with_options(&complete_with_child_metadata, &compare_metadata));
 1420 | 
 1421 |         let nested_minimal: Field = ArrowField::new(
 1422 |             "outer",
 1423 |             DataType::Struct(Fields::from(vec![ArrowField::from(&minimal)])),
 1424 |             true,
 1425 |         )
 1426 |         .try_into()
 1427 |         .unwrap();
 1428 |         let nested_complete: Field = ArrowField::new(
 1429 |             "outer",
 1430 |             DataType::Struct(Fields::from(vec![ArrowField::from(&complete)])),
 1431 |             true,
 1432 |         )
 1433 |         .try_into()
 1434 |         .unwrap();
 1435 |         assert!(nested_minimal.compare_with_options(&nested_complete, &options));
 1436 |         assert!(nested_complete.compare_with_options(&nested_minimal, &options));
 1437 |     }
 1438 | 
 1439 |     #[test]
 1440 |     fn malformed_blob_v2_logical_shapes_remain_incompatible() {
 1441 |         let minimal = blob_v2_logical_field(BLOB_V2_LOGICAL_MINIMAL_FIELDS.clone());
 1442 |         let malformed = blob_v2_logical_field(Fields::from(vec![
 1443 |             ArrowField::new("data", DataType::LargeBinary, true),
 1444 |             ArrowField::new("uri", DataType::LargeUtf8, true),
 1445 |         ]));
 1446 |         let options = SchemaCompareOptions::default();
 1447 | 
 1448 |         assert!(!minimal.compare_with_options(&malformed, &options));
 1449 |         assert!(!malformed.compare_with_options(&minimal, &options));
 1450 |         assert!(minimal.explain_difference(&malformed, &options).is_some());
 1451 |         assert!(malformed.explain_difference(&minimal, &options).is_some());
 1452 |     }
 1453 | 
 1454 |     #[test]
 1455 |     fn arrow_field_to_field_metadata() {
 1456 |         let mut metadata = HashMap::new();
 1457 |         metadata.insert(LANCE_FIELD_ID_KEY.to_string(), "42".to_string());
 1458 |         metadata.insert("custom".to_string(), "value".to_string());
 1459 | 
 1460 |         let arrow_field =
 1461 |             ArrowField::new("a", DataType::Int32, false).with_metadata(metadata.clone());
 1462 |         let field = Field::try_from(&arrow_field).unwrap();
 1463 | 
 1464 |         assert_eq!(field.id, 42);
 1465 |         assert!(!field.metadata.contains_key(LANCE_FIELD_ID_KEY));
 1466 |         assert_eq!(
 1467 |             field.metadata.get("custom").map(String::as_str),
 1468 |             Some("value")
 1469 |         );
 1470 |     }
 1471 | 
 1472 |     #[test]
 1473 |     fn arrow_field_to_field() {
 1474 |         for (name, data_type) in [
 1475 |             ("null", DataType::Null),
 1476 |             ("bool", DataType::Boolean),
 1477 |             ("int8", DataType::Int8),
 1478 |             ("uint8", DataType::UInt8),
 1479 |             ("int16", DataType::Int16),
 1480 |             ("uint16", DataType::UInt16),
 1481 |             ("int32", DataType::Int32),
 1482 |             ("uint32", DataType::UInt32),
 1483 |             ("int64", DataType::Int64),
 1484 |             ("uint64", DataType::UInt64),
 1485 |             ("float16", DataType::Float16),
 1486 |             ("float32", DataType::Float32),
 1487 |             ("float64", DataType::Float64),
 1488 |             ("decimal128:7:3", DataType::Decimal128(7, 3)),
 1489 |             ("timestamp:s:-", DataType::Timestamp(TimeUnit::Second, None)),
 1490 |             (
 1491 |                 "timestamp:ms:-",
 1492 |                 DataType::Timestamp(TimeUnit::Millisecond, None),
 1493 |             ),
 1494 |             (
 1495 |                 "timestamp:us:-",
 1496 |                 DataType::Timestamp(TimeUnit::Microsecond, None),
 1497 |             ),
 1498 |             (
 1499 |                 "timestamp:ns:-",
 1500 |                 DataType::Timestamp(TimeUnit::Nanosecond, None),
 1501 |             ),
 1502 |             (
 1503 |                 "timestamp:s:America/New_York",
 1504 |                 DataType::Timestamp(TimeUnit::Second, Some("America/New_York".into())),
 1505 |             ),
 1506 |             ("time32:s", DataType::Time32(TimeUnit::Second)),
 1507 |             ("time32:ms", DataType::Time32(TimeUnit::Millisecond)),
 1508 |             ("time64:us", DataType::Time64(TimeUnit::Microsecond)),
 1509 |             ("time64:ns", DataType::Time64(TimeUnit::Nanosecond)),
 1510 |             ("duration:s", DataType::Duration(TimeUnit::Second)),
 1511 |             ("duration:ms", DataType::Duration(TimeUnit::Millisecond)),
 1512 |             ("duration:us", DataType::Duration(TimeUnit::Microsecond)),
 1513 |             ("duration:ns", DataType::Duration(TimeUnit::Nanosecond)),
 1514 |             ("fixed_size_binary:100", DataType::FixedSizeBinary(100)),
 1515 |             (
 1516 |                 "fixed_size_list:int32:10",
 1517 |                 DataType::FixedSizeList(
 1518 |                     Arc::new(ArrowField::new("item", DataType::Int32, true)),
 1519 |                     10,
 1520 |                 ),
 1521 |             ),
 1522 |         ] {
 1523 |             let arrow_field = ArrowField::new(name, data_type.clone(), true);
 1524 |             let field = Field::try_from(&arrow_field).unwrap();
 1525 |             assert_eq!(field.name, name);
 1526 |             assert_eq!(field.data_type(), data_type);
 1527 |             assert_eq!(ArrowField::from(&field), arrow_field);
 1528 |         }
 1529 |     }
 1530 | 
 1531 |     #[test]
 1532 |     fn test_view_types_stored_as_lance_base_types() {
 1533 |         let field = Field::try_from(&ArrowField::new("s", DataType::Utf8View, true)).unwrap();
 1534 |         assert_eq!(field.data_type(), DataType::Utf8);
 1535 |         assert_eq!(
 1536 |             LogicalType::try_from(&DataType::Utf8View).unwrap().0,
 1537 |             "string"
 1538 |         );
 1539 | 
 1540 |         let field = Field::try_from(&ArrowField::new("b", DataType::BinaryView, true)).unwrap();
 1541 |         assert_eq!(field.data_type(), DataType::Binary);
 1542 |         assert_eq!(
 1543 |             LogicalType::try_from(&DataType::BinaryView).unwrap().0,
 1544 |             "binary"
 1545 |         );
 1546 |     }
 1547 | 
 1548 |     #[test]
 1549 |     fn test_nested_types() {
 1550 |         assert_eq!(
 1551 |             LogicalType::try_from(&DataType::List(Arc::new(ArrowField::new(
 1552 |                 "item",
 1553 |                 DataType::Binary,
 1554 |                 false
 1555 |             ))))
 1556 |             .unwrap()
 1557 |             .0,
 1558 |             "list"
 1559 |         );
 1560 |         assert_eq!(
 1561 |             LogicalType::try_from(&DataType::List(Arc::new(ArrowField::new(
 1562 |                 "item",
 1563 |                 DataType::Struct(Fields::empty()),
 1564 |                 false
 1565 |             ))))
 1566 |             .unwrap()
 1567 |             .0,
 1568 |             "list.struct"
 1569 |         );
 1570 |         assert_eq!(
 1571 |             LogicalType::try_from(&DataType::Struct(Fields::from(vec![ArrowField::new(
 1572 |                 "item",
 1573 |                 DataType::Binary,
 1574 |                 false
 1575 |             )])))
 1576 |             .unwrap()
 1577 |             .0,
 1578 |             "struct"
 1579 |         );
 1580 | 
 1581 |         assert_eq!(
 1582 |             LogicalType::try_from(&DataType::Map(
 1583 |                 Arc::new(ArrowField::new(
 1584 |                     "entries",
 1585 |                     DataType::Struct(Fields::from(vec![
 1586 |                         ArrowField::new("key", DataType::Utf8, false),
 1587 |                         ArrowField::new("value", DataType::Int32, true),
 1588 |                     ])),
 1589 |                     true
 1590 |                 )),
 1591 |                 false
 1592 |             ))
 1593 |             .unwrap()
 1594 |             .0,
 1595 |             "map"
 1596 |         );
 1597 |     }
 1598 | 
 1599 |     #[test]
 1600 |     fn struct_field() {
 1601 |         let arrow_field = ArrowField::new(
 1602 |             "struct",
 1603 |             DataType::Struct(Fields::from(vec![ArrowField::new(
 1604 |                 "a",
 1605 |                 DataType::Int32,
 1606 |                 true,
 1607 |             )])),
 1608 |             false,
 1609 |         );
 1610 |         let field = Field::try_from(&arrow_field).unwrap();
 1611 |         assert_eq!(field.name, "struct");
 1612 |         assert_eq!(&field.data_type(), arrow_field.data_type());
 1613 |         assert_eq!(ArrowField::from(&field), arrow_field);
 1614 |     }
 1615 | 
 1616 |     #[test]
 1617 |     fn map_key_must_be_non_nullable() {
 1618 |         let entries_field = Arc::new(ArrowField::new(
 1619 |             "entries",
 1620 |             DataType::Struct(Fields::from(vec![
 1621 |                 ArrowField::new("key", DataType::Utf8, true), // invalid: nullable key
 1622 |                 ArrowField::new("value", DataType::Int32, true),
 1623 |             ])),
 1624 |             false,
 1625 |         ));
 1626 |         let arrow_field = ArrowField::new("props", DataType::Map(entries_field, false), true);
 1627 | 
 1628 |         let result = Field::try_from(&arrow_field);
 1629 |         assert!(result.is_err(), "Nullable map key should be rejected");
 1630 |     }
 1631 | 
 1632 |     #[test]
 1633 |     fn map_keys_sorted_unsupported() {
 1634 |         let entries_field = Arc::new(ArrowField::new(
 1635 |             "entries",
 1636 |             DataType::Struct(Fields::from(vec![
 1637 |                 ArrowField::new("key", DataType::Utf8, false),
 1638 |                 ArrowField::new("value", DataType::Int32, true),
 1639 |             ])),
 1640 |             false,
 1641 |         ));
 1642 | 
 1643 |         // Test that keys_sorted=true is rejected
 1644 |         let arrow_field_sorted = ArrowField::new(
 1645 |             "map_field",
 1646 |             DataType::Map(entries_field.clone(), true),
 1647 |             true,
 1648 |         );
 1649 |         let result = Field::try_from(&arrow_field_sorted);
 1650 |         assert!(result.is_err(), "keys_sorted=true should be rejected");
 1651 |         assert!(result.unwrap_err().to_string().contains("keys_sorted=true"));
 1652 | 
 1653 |         // Test that keys_sorted=false is supported
 1654 |         let arrow_field_unsorted =
 1655 |             ArrowField::new("map_field", DataType::Map(entries_field, false), true);
 1656 |         let lance_field_unsorted = Field::try_from(&arrow_field_unsorted).unwrap();
 1657 | 
 1658 |         // Verify conversion back to ArrowField preserves keys_sorted=false
 1659 |         let converted_field_unsorted = ArrowField::from(&lance_field_unsorted);
 1660 |         match converted_field_unsorted.data_type() {
 1661 |             DataType::Map(_, keys_sorted) => assert!(!keys_sorted, "keys_sorted should be false"),
 1662 |             _ => panic!("Expected Map type"),
 1663 |         }
 1664 |     }
 1665 | 
 1666 |     #[test]
 1667 |     fn map_entries_must_be_struct() {
 1668 |         let entries_field = Arc::new(ArrowField::new("entries", DataType::Utf8, false));
 1669 |         let arrow_field = ArrowField::new("map_field", DataType::Map(entries_field, false), true);
 1670 | 
 1671 |         let err = Field::try_from(&arrow_field).unwrap_err();
 1672 |         assert!(
 1673 |             err.to_string()
 1674 |                 .contains("Map entries field must be a Struct"),
 1675 |             "Expected struct requirement error, got {err}"
 1676 |         );
 1677 |     }
 1678 | 
 1679 |     #[test]
 1680 |     fn map_entries_struct_needs_key_and_value() {
 1681 |         let entries_field = Arc::new(ArrowField::new(
 1682 |             "entries",
 1683 |             DataType::Struct(Fields::from(vec![ArrowField::new(
 1684 |                 "key",
 1685 |                 DataType::Utf8,
 1686 |                 false,
 1687 |             )])),
 1688 |             false,
 1689 |         ));
 1690 |         let arrow_field = ArrowField::new("map_field", DataType::Map(entries_field, false), true);
 1691 | 
 1692 |         let err = Field::try_from(&arrow_field).unwrap_err();
 1693 |         assert!(
 1694 |             err.to_string().contains("must contain both key and value"),
 1695 |             "Expected both fields requirement error, got {err}"
 1696 |         );
 1697 |     }
 1698 | 
 1699 |     #[test]
 1700 |     fn test_project_by_field_null_type() {
 1701 |         let f1: Field = ArrowField::new("a", DataType::Null, true)
 1702 |             .try_into()
 1703 |             .unwrap();
 1704 |         let f2: Field = ArrowField::new("a", DataType::Null, true)
 1705 |             .try_into()
 1706 |             .unwrap();
 1707 |         let p1 = f1.project_by_field(&f2, OnTypeMismatch::Error).unwrap();
 1708 | 
 1709 |         assert_eq!(p1, f1);
 1710 | 
 1711 |         let f3: Field = ArrowField::new("b", DataType::Null, true)
 1712 |             .try_into()
 1713 |             .unwrap();
 1714 |         assert!(f1.project_by_field(&f3, OnTypeMismatch::Error).is_err());
 1715 | 
 1716 |         let f4: Field = ArrowField::new("a", DataType::Int32, true)
 1717 |             .try_into()
 1718 |             .unwrap();
 1719 |         assert!(f1.project_by_field(&f4, OnTypeMismatch::Error).is_err());
 1720 |     }
 1721 | 
 1722 |     #[test]
 1723 |     fn test_field_intersection() {
 1724 |         let f1: Field = ArrowField::new("a", DataType::Int32, true)
 1725 |             .try_into()
 1726 |             .unwrap();
 1727 |         let f2: Field = ArrowField::new("a", DataType::Int32, true)
 1728 |             .try_into()
 1729 |             .unwrap();
 1730 |         let i1 = f1.intersection(&f2).unwrap();
 1731 | 
 1732 |         assert_eq!(i1, f1);
 1733 | 
 1734 |         let f3: Field = ArrowField::new("b", DataType::Int32, true)
 1735 |             .try_into()
 1736 |             .unwrap();
 1737 |         assert!(f1.intersection(&f3).is_err());
 1738 |     }
 1739 | 
 1740 |     #[test]
 1741 |     fn test_struct_field_intersection() {
 1742 |         let f1: Field = ArrowField::new(
 1743 |             "a",
 1744 |             DataType::Struct(Fields::from(vec![
 1745 |                 ArrowField::new("b", DataType::Int32, true),
 1746 |                 ArrowField::new("c", DataType::Int32, true),
 1747 |             ])),
 1748 |             true,
 1749 |         )
 1750 |         .try_into()
 1751 |         .unwrap();
 1752 |         let f2: Field = ArrowField::new(
 1753 |             "a",
 1754 |             DataType::Struct(Fields::from(vec![
 1755 |                 ArrowField::new("c", DataType::Int32, true),
 1756 |                 ArrowField::new("a", DataType::Int32, true),
 1757 |             ])),
 1758 |             true,
 1759 |         )
 1760 |         .try_into()
 1761 |         .unwrap();
 1762 |         let actual = f1.intersection(&f2).unwrap();
 1763 | 
 1764 |         let expected: Field = ArrowField::new(
 1765 |             "a",
 1766 |             DataType::Struct(Fields::from(vec![ArrowField::new(
 1767 |                 "c",
 1768 |                 DataType::Int32,
 1769 |                 true,
 1770 |             )])),
 1771 |             true,
 1772 |         )
 1773 |         .try_into()
 1774 |         .unwrap();
 1775 |         assert_eq!(actual, expected);
 1776 |     }
 1777 | 
 1778 |     #[test]
 1779 |     fn test_compare() {
 1780 |         let opts = SchemaCompareOptions::default();
 1781 | 
 1782 |         let mut expected: Field = ArrowField::new(
 1783 |             "a",
 1784 |             DataType::Dictionary(Box::new(DataType::UInt32), Box::new(DataType::Utf8)),
 1785 |             true,
 1786 |         )
 1787 |         .try_into()
 1788 |         .unwrap();
 1789 |         let keys = UInt32Array::from_iter_values(vec![0, 1]);
 1790 |         let values: ArrayRef = Arc::new(StringArray::from_iter_values([
 1791 |             "a".to_string(),
 1792 |             "b".to_string(),
 1793 |         ]));
 1794 |         let dictionary: ArrayRef = Arc::new(DictionaryArray::new(keys, values));
 1795 |         expected.set_dictionary(&dictionary);
 1796 | 
 1797 |         let no_dictionary: Field = ArrowField::new(
 1798 |             "a",
 1799 |             DataType::Dictionary(Box::new(DataType::UInt32), Box::new(DataType::Utf8)),
 1800 |             true,
 1801 |         )
 1802 |         .try_into()
 1803 |         .unwrap();
 1804 | 
 1805 |         // By default, do not compare dictionary
 1806 |         assert!(no_dictionary.compare_with_options(&expected, &opts));
 1807 | 
 1808 |         let compare_dict = SchemaCompareOptions {
 1809 |             compare_dictionary: true,
 1810 |             ..Default::default()
 1811 |         };
 1812 |         assert!(!no_dictionary.compare_with_options(&expected, &compare_dict));
 1813 | 
 1814 |         let metadata = HashMap::<_, _>::from_iter(vec![("foo".to_string(), "bar".to_string())]);
 1815 |         let expected: Field = ArrowField::new("a", DataType::UInt32, true)
 1816 |             .with_metadata(metadata)
 1817 |             .try_into()
 1818 |             .unwrap();
 1819 | 
 1820 |         let no_metadata: Field = ArrowField::new("a", DataType::UInt32, true)
 1821 |             .try_into()
 1822 |             .unwrap();
 1823 | 
 1824 |         // By default, do not compare metadata
 1825 |         assert!(no_metadata.compare_with_options(&expected, &opts));
 1826 | 
 1827 |         let compare_metadata = SchemaCompareOptions {
 1828 |             compare_metadata: true,
 1829 |             ..Default::default()
 1830 |         };
 1831 |         assert!(!no_metadata.compare_with_options(&expected, &compare_metadata));
 1832 | 
 1833 |         let mut expected: Field = ArrowField::new("a", DataType::UInt32, true)
 1834 |             .try_into()
 1835 |             .unwrap();
 1836 |         let mut seed = 0;
 1837 |         expected.set_id(-1, &mut seed);
 1838 | 
 1839 |         let no_id: Field = ArrowField::new("a", DataType::UInt32, true)
 1840 |             .try_into()
 1841 |             .unwrap();
 1842 |         // Do not compare ids by default
 1843 |         assert!(no_id.compare_with_options(&expected, &opts));
 1844 | 
 1845 |         let compare_ids = SchemaCompareOptions {
 1846 |             compare_field_ids: true,
 1847 |             ..Default::default()
 1848 |         };
 1849 |         assert!(!no_id.compare_with_options(&expected, &compare_ids));
 1850 |     }
 1851 | 
 1852 |     #[test]
 1853 |     fn test_explain_difference() {
 1854 |         let expected: Field = ArrowField::new(
 1855 |             "a",
 1856 |             DataType::Struct(Fields::from(vec![
 1857 |                 ArrowField::new("b", DataType::Int32, true),
 1858 |                 ArrowField::new("c", DataType::Int32, true),
 1859 |             ])),
 1860 |             true,
 1861 |         )
 1862 |         .try_into()
 1863 |         .unwrap();
 1864 | 
 1865 |         let opts = SchemaCompareOptions::default();
 1866 |         assert_eq!(expected.explain_difference(&expected, &opts), None);
 1867 | 
 1868 |         let wrong_name: Field = ArrowField::new(
 1869 |             "b",
 1870 |             DataType::Struct(Fields::from(vec![
 1871 |                 ArrowField::new("b", DataType::Int32, true),
 1872 |                 ArrowField::new("c", DataType::Int32, true),
 1873 |             ])),
 1874 |             true,
 1875 |         )
 1876 |         .try_into()
 1877 |         .unwrap();
 1878 | 
 1879 |         assert_eq!(
 1880 |             wrong_name.explain_difference(&expected, &opts),
 1881 |             Some("expected name 'a' but name was 'b'".to_string())
 1882 |         );
 1883 | 
 1884 |         let wrong_child: Field = ArrowField::new(
 1885 |             "a",
 1886 |             DataType::Struct(Fields::from(vec![
 1887 |                 ArrowField::new("b", DataType::Int32, false),
 1888 |                 ArrowField::new("c", DataType::Int32, true),
 1889 |             ])),
 1890 |             true,
 1891 |         )
 1892 |         .try_into()
 1893 |         .unwrap();
 1894 |         assert_eq!(
 1895 |             wrong_child.explain_difference(&expected, &opts),
 1896 |             Some(
 1897 |                 "`a` had mismatched children: `a.b` should have nullable=true but nullable=false"
 1898 |                     .to_string()
 1899 |             )
 1900 |         );
 1901 | 
 1902 |         let mismatched_children: Field = ArrowField::new(
 1903 |             "a",
 1904 |             DataType::Struct(Fields::from(vec![
 1905 |                 ArrowField::new("d", DataType::Int32, false),
 1906 |                 ArrowField::new("b", DataType::Int32, true),
 1907 |             ])),
 1908 |             true,
 1909 |         )
 1910 |         .try_into()
 1911 |         .unwrap();
 1912 |         assert_eq!(
 1913 |             mismatched_children.explain_difference(&expected, &opts),
 1914 |             Some("`a` had mismatched children: fields did not match, missing=[a.c], unexpected=[a.d]".to_string())
 1915 |         );
 1916 | 
 1917 |         let reordered_children: Field = ArrowField::new(
 1918 |             "a",
 1919 |             DataType::Struct(Fields::from(vec![
 1920 |                 ArrowField::new("c", DataType::Int32, true),
 1921 |                 ArrowField::new("b", DataType::Int32, true),
 1922 |             ])),
 1923 |             true,
 1924 |         )
 1925 |         .try_into()
 1926 |         .unwrap();
 1927 |         assert_eq!(
 1928 |             reordered_children.explain_difference(&expected, &opts),
 1929 |             Some("`a` had mismatched children: fields in different order, expected: [b, c], actual: [c, b]".to_string())
 1930 |         );
 1931 | 
 1932 |         let multiple_wrongs: Field = ArrowField::new(
 1933 |             "c",
 1934 |             DataType::Struct(Fields::from(vec![
 1935 |                 ArrowField::new("b", DataType::Int32, true),
 1936 |                 ArrowField::new("c", DataType::Float32, true),
 1937 |             ])),
 1938 |             true,
 1939 |         )
 1940 |         .try_into()
 1941 |         .unwrap();
 1942 |         assert_eq!(
 1943 |             multiple_wrongs.explain_difference(&expected, &opts),
 1944 |             Some(
 1945 |                 "expected name 'a' but name was 'c', `c` had mismatched children: `c.c` should have type int32 but type was float"
 1946 |                     .to_string()
 1947 |             )
 1948 |         );
 1949 | 
 1950 |         let mut expected: Field = ArrowField::new(
 1951 |             "a",
 1952 |             DataType::Dictionary(Box::new(DataType::UInt32), Box::new(DataType::Utf8)),
 1953 |             true,
 1954 |         )
 1955 |         .try_into()
 1956 |         .unwrap();
 1957 |         let keys = UInt32Array::from_iter_values(vec![0, 1]);
 1958 |         let values: ArrayRef = Arc::new(StringArray::from_iter_values([
 1959 |             "a".to_string(),
 1960 |             "b".to_string(),
 1961 |         ]));
 1962 |         let dictionary: ArrayRef = Arc::new(DictionaryArray::new(keys, values));
 1963 |         expected.set_dictionary(&dictionary);
 1964 | 
 1965 |         let no_dictionary: Field = ArrowField::new(
 1966 |             "a",
 1967 |             DataType::Dictionary(Box::new(DataType::UInt32), Box::new(DataType::Utf8)),
 1968 |             true,
 1969 |         )
 1970 |         .try_into()
 1971 |         .unwrap();
 1972 | 
 1973 |         // By default, do not compare dictionary
 1974 |         assert_eq!(no_dictionary.explain_difference(&expected, &opts), None);
 1975 | 
 1976 |         let compare_dict = SchemaCompareOptions {
 1977 |             compare_dictionary: true,
 1978 |             ..Default::default()
 1979 |         };
 1980 |         assert_eq!(
 1981 |             no_dictionary.explain_difference(&expected, &compare_dict),
 1982 |             Some("dictionary for `a` did not match expected dictionary".to_string())
 1983 |         );
 1984 | 
 1985 |         let metadata = HashMap::<_, _>::from_iter(vec![("foo".to_string(), "bar".to_string())]);
 1986 |         let expected: Field = ArrowField::new("a", DataType::UInt32, true)
 1987 |             .with_metadata(metadata)
 1988 |             .try_into()
 1989 |             .unwrap();
 1990 | 
 1991 |         let no_metadata: Field = ArrowField::new("a", DataType::UInt32, true)
 1992 |             .try_into()
 1993 |             .unwrap();
 1994 | 
 1995 |         // By default, do not compare metadata
 1996 |         assert_eq!(no_metadata.explain_difference(&expected, &opts), None);
 1997 | 
 1998 |         let compare_metadata = SchemaCompareOptions {
 1999 |             compare_metadata: true,
 2000 |             ..Default::default()
 2001 |         };
 2002 |         assert_eq!(
 2003 |             no_metadata.explain_difference(&expected, &compare_metadata),
 2004 |             Some("metadata for `a` did not match expected metadata".to_string())
 2005 |         );
 2006 | 
 2007 |         let mut expected: Field = ArrowField::new("a", DataType::UInt32, true)
 2008 |             .try_into()
 2009 |             .unwrap();
 2010 |         let mut seed = 0;
 2011 |         expected.set_id(-1, &mut seed);
 2012 | 
 2013 |         let no_id: Field = ArrowField::new("a", DataType::UInt32, true)
 2014 |             .try_into()
 2015 |             .unwrap();
 2016 |         // Do not compare ids by default
 2017 |         assert_eq!(no_id.explain_difference(&expected, &opts), None);
 2018 | 
 2019 |         let compare_ids = SchemaCompareOptions {
 2020 |             compare_field_ids: true,
 2021 |             ..Default::default()
 2022 |         };
 2023 |         assert_eq!(
 2024 |             no_id.explain_difference(&expected, &compare_ids),
 2025 |             Some("`a` should have id 0 but id was -1".to_string())
 2026 |         );
 2027 |     }
 2028 | 
 2029 |     #[test]
 2030 |     pub fn test_nullability_comparison() {
 2031 |         let f1 = Field::try_from(&ArrowField::new("a", DataType::Int32, true)).unwrap();
 2032 |         let f2 = Field::try_from(&ArrowField::new("a", DataType::Int32, false)).unwrap();
 2033 | 
 2034 |         // By default, nullability difference is not allowed
 2035 |         assert!(!f1.compare_with_options(&f2, &SchemaCompareOptions::default()));
 2036 | 
 2037 |         let ignore_nullability = SchemaCompareOptions {
 2038 |             compare_nullability: NullabilityComparison::Ignore,
 2039 |             ..Default::default()
 2040 |         };
 2041 |         let oneway_nullability = SchemaCompareOptions {
 2042 |             compare_nullability: NullabilityComparison::OneWay,
 2043 |             ..Default::default()
 2044 |         };
 2045 |         let strict_nullability = SchemaCompareOptions {
 2046 |             compare_nullability: NullabilityComparison::Strict,
 2047 |             ..Default::default()
 2048 |         };
 2049 | 
 2050 |         // By default, nullability difference is not allowed
 2051 |         assert!(!f1.compare_with_options(&f2, &strict_nullability));
 2052 |         assert!(!f2.compare_with_options(&f1, &strict_nullability));
 2053 |         // One way nullability will allow the difference if expected is nullable
 2054 |         assert!(!f1.compare_with_options(&f2, &oneway_nullability));
 2055 |         assert!(f2.compare_with_options(&f1, &oneway_nullability));
 2056 |         // Finally, ignore will ignore
 2057 |         assert!(f1.compare_with_options(&f2, &ignore_nullability));
 2058 |         assert!(f2.compare_with_options(&f1, &ignore_nullability));
 2059 |     }
 2060 | 
 2061 |     #[test]
 2062 |     fn blob_unloaded_mut_selects_layout_from_metadata() {
 2063 |         let metadata = HashMap::from([(BLOB_META_KEY.to_string(), "true".to_string())]);
 2064 |         let mut binary_field: Field = ArrowField::new("blob", DataType::LargeBinary, true)
 2065 |             .with_metadata(metadata.clone())
 2066 |             .try_into()
 2067 |             .unwrap();
 2068 |         binary_field.binary_blob_mut();
 2069 |         assert!(binary_field.metadata.contains_key(BLOB_META_KEY));
 2070 |         assert!(!binary_field.is_blob_v2());
 2071 | 
 2072 |         let mut field: Field = ArrowField::new("blob", DataType::LargeBinary, true)
 2073 |             .with_metadata(metadata)
 2074 |             .try_into()
 2075 |             .unwrap();
 2076 |         field.unloaded_mut();
 2077 |         assert_eq!(field.children.len(), 2);
 2078 |         assert_eq!(field.logical_type, BLOB_DESC_LANCE_FIELD.logical_type);
 2079 |         assert!(field.is_blob());
 2080 |         assert!(!field.is_blob_v2());
 2081 |         field.unloaded_mut();
 2082 |         assert_eq!(field.children.len(), 2);
 2083 |         assert_eq!(field.logical_type, BLOB_DESC_LANCE_FIELD.logical_type);
 2084 |         assert!(!field.is_blob_v2());
 2085 | 
 2086 |         let metadata =
 2087 |             HashMap::from([(ARROW_EXT_NAME_KEY.to_string(), BLOB_V2_EXT_NAME.to_string())]);
 2088 |         let mut field: Field = ArrowField::new(
 2089 |             "blob",
 2090 |             DataType::Struct(
 2091 |                 vec![
 2092 |                     ArrowField::new("data", DataType::LargeBinary, true),
 2093 |                     ArrowField::new("uri", DataType::Utf8, true),
 2094 |                 ]
 2095 |                 .into(),
 2096 |             ),
 2097 |             true,
 2098 |         )
 2099 |         .with_metadata(metadata)
 2100 |         .try_into()
 2101 |         .unwrap();
 2102 |         field.unloaded_mut();
 2103 |         assert_eq!(field.children.len(), 5);
 2104 |         assert_eq!(field.logical_type, BLOB_V2_DESC_LANCE_FIELD.logical_type);
 2105 |         assert!(!field.metadata.contains_key(ARROW_EXT_NAME_KEY));
 2106 |         assert!(field.is_blob_v2());
 2107 |         field.unloaded_mut();
 2108 |         assert_eq!(field.children.len(), 5);
 2109 |         assert_eq!(field.logical_type, BLOB_V2_DESC_LANCE_FIELD.logical_type);
 2110 |         assert!(!field.metadata.contains_key(ARROW_EXT_NAME_KEY));
 2111 |     }
 2112 | 
 2113 |     #[test]
 2114 |     fn unload_blobs_recursive_only_unloads_blob_v2() {
 2115 |         let legacy_metadata = HashMap::from([(BLOB_META_KEY.to_string(), "true".to_string())]);
 2116 |         let blob_v2_metadata =
 2117 |             HashMap::from([(ARROW_EXT_NAME_KEY.to_string(), BLOB_V2_EXT_NAME.to_string())]);
 2118 | 
 2119 |         let mut field: Field = ArrowField::new(
 2120 |             "parent",
 2121 |             DataType::Struct(Fields::from(vec![
 2122 |                 ArrowField::new("legacy_blob", DataType::LargeBinary, true)
 2123 |                     .with_metadata(legacy_metadata),
 2124 |                 ArrowField::new(
 2125 |                     "blob_v2",
 2126 |                     DataType::Struct(
 2127 |                         vec![
 2128 |                             ArrowField::new("data", DataType::LargeBinary, true),
 2129 |                             ArrowField::new("uri", DataType::Utf8, true),
 2130 |                         ]
 2131 |                         .into(),
 2132 |                     ),
 2133 |                     true,
 2134 |                 )
 2135 |                 .with_metadata(blob_v2_metadata),
 2136 |             ])),
 2137 |             true,
 2138 |         )
 2139 |         .try_into()
 2140 |         .unwrap();
 2141 | 
 2142 |         field.unload_blobs_recursive();
 2143 | 
 2144 |         let legacy_blob = field
 2145 |             .children
 2146 |             .iter()
 2147 |             .find(|f| f.name == "legacy_blob")
 2148 |             .unwrap();
 2149 |         assert_eq!(
 2150 |             legacy_blob.logical_type,
 2151 |             LogicalType::try_from(&DataType::LargeBinary).unwrap()
 2152 |         );
 2153 |         assert_eq!(legacy_blob.children.len(), 0);
 2154 |         assert!(legacy_blob.metadata.contains_key(BLOB_META_KEY));
 2155 | 
 2156 |         let blob_v2 = field.children.iter().find(|f| f.name == "blob_v2").unwrap();
 2157 |         assert_eq!(blob_v2.logical_type, BLOB_V2_DESC_LANCE_FIELD.logical_type);
 2158 |         assert_eq!(blob_v2.children.len(), 5);
 2159 |     }
 2160 | 
 2161 |     #[test]
 2162 |     fn project_by_field_accepts_blob_descriptor_projection() {
 2163 |         let metadata = HashMap::from([(BLOB_META_KEY.to_string(), "true".to_string())]);
 2164 |         let field: Field = ArrowField::new("blob", DataType::LargeBinary, true)
 2165 |             .with_metadata(metadata)
 2166 |             .try_into()
 2167 |             .unwrap();
 2168 |         let mut unloaded = field.clone();
 2169 |         unloaded.unloaded_mut();
 2170 | 
 2171 |         let projected = field
 2172 |             .project_by_field(&unloaded, OnTypeMismatch::Error)
 2173 |             .unwrap();
 2174 |         assert_eq!(projected, field);
 2175 | 
 2176 |         let unloaded_projected = unloaded
 2177 |             .project_by_field(&field, OnTypeMismatch::Error)
 2178 |             .unwrap();
 2179 |         assert_eq!(unloaded_projected, unloaded);
 2180 |     }
 2181 | 
 2182 |     #[test]
 2183 |     fn blob_descriptor_projection_preserves_synthetic_children() {
 2184 |         let metadata =
 2185 |             HashMap::from([(ARROW_EXT_NAME_KEY.to_string(), BLOB_V2_EXT_NAME.to_string())]);
 2186 |         let mut blob: Field = ArrowField::new(
 2187 |             "blob",
 2188 |             DataType::Struct(
 2189 |                 vec![
 2190 |                     ArrowField::new("data", DataType::LargeBinary, true),
 2191 |                     ArrowField::new("uri", DataType::Utf8, true),
 2192 |                 ]
 2193 |                 .into(),
 2194 |             ),
 2195 |             true,
 2196 |         )
 2197 |         .with_metadata(metadata)
 2198 |         .try_into()
 2199 |         .unwrap();
 2200 |         let mut next_id = 0;
 2201 |         blob.set_id(-1, &mut next_id);
 2202 | 
 2203 |         let schema = Arc::new(crate::datatypes::Schema {
 2204 |             fields: vec![blob],
 2205 |             metadata: HashMap::new(),
 2206 |         });
 2207 |         let descriptor_schema = Projection::full(schema)
 2208 |             .with_blob_handling(crate::datatypes::BlobHandling::BlobsDescriptions)
 2209 |             .to_bare_schema();
 2210 |         assert!(
 2211 |             descriptor_schema.fields[0]
 2212 |                 .children
 2213 |                 .iter()
 2214 |                 .all(|child| child.id == -1)
 2215 |         );
 2216 | 
 2217 |         let projected = Projection::full(Arc::new(descriptor_schema)).to_bare_schema();
 2218 |         assert_eq!(projected.fields[0].children.len(), 5);
 2219 |     }
 2220 | }
``````
