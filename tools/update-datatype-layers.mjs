import fs from 'node:fs';
const append=(p,s)=>fs.appendFileSync(p,'\n'+s.trim()+'\n');
const symbols=JSON.parse(fs.readFileSync('L3-symbols/symbols.json','utf8')).filter(s=>['rust/lance-core/src/datatypes.rs','rust/lance-core/src/datatypes/field.rs'].includes(s.path)&&s.visibility.startsWith('public Rust'));
const rows=symbols.map(s=>`| \`${s.name}\` | \`${s.signature.replaceAll('|','\\|')}\` | [${s.path}:${s.line}-${s.end_line}](../${s.analysis}) |`);
const catalog='L1-modules/rust-lance-core-datatypes.md';
let c=fs.readFileSync(catalog,'utf8').split('<!-- datatype-api-table -->')[0];
fs.writeFileSync(catalog,c+'<!-- datatype-api-table -->\n\n'+`${symbols.length} explicit public records.\n\n| Name | Exact declaration | Contract and evidence |\n|---|---|---|\n`+rows.join('\n')+'\n');
let p='L1-modules/rust-lance-core.md';let t=fs.readFileSync(p,'utf8').replace('Coverage includes thirteen files:','Coverage includes fifteen files:').replace('errors and edit-distance suggestions.','errors, edit-distance suggestions, logical datatypes and Field trees.').replace('Schemas, caches and most algorithms remain pending.','Schema/Projection implementations, caches and most algorithms remain pending.');
t += '\n## Datatypes and Field trees\n\nThe [datatype API supplement](rust-lance-core-datatypes.md) covers both full source files, including exact public declarations, logical-string grammar, stable blob descriptor names, comparison modes, metadata/ID conversion and tree-operation edge cases. The corresponding L2 documents are [datatypes.rs](../L2-files/rust/lance-core/src/datatypes.rs.md) and [field.rs](../L2-files/rust/lance-core/src/datatypes/field.rs.md). Schema module exports remain pending implementation analysis. (rust/lance-core/src/datatypes.rs:1-985; rust/lance-core/src/datatypes/field.rs:1-2220)\n';fs.writeFileSync(p,t);
append('L0-orientation.md',`
## Datatype terminology

| Term | Reviewed meaning | Evidence |
|---|---|---|
| LogicalType | Private String wrapper with public unchecked From<&str>; encodes Arrow type identity partly in strings, with Field children carrying nested schema | rust/lance-core/src/datatypes.rs:244-285; rust/lance-core/src/datatypes/field.rs:170-195 |
| Field | Mutable tree of identity, logical type, metadata, encoding, nullability, children, optional dictionary and key positions | rust/lance-core/src/datatypes/field.rs:134-161 |
| Logical / prepared / descriptor blob | Input value shape, encoder input shape and stored location shape, with distinct children and nullability | rust/lance-core/src/datatypes.rs:51-188 |
| BlobKind | Byte code selecting Inline0, Packed1, Dedicated2 or External3; describes storage location semantics | rust/lance-core/src/datatypes.rs:595-629 |
| Synthetic descriptor child | Canonical projected child with ID -1; atomic parent projection retains it | rust/lance-core/src/datatypes/field.rs:274-310; rust/lance-core/src/datatypes/field.rs:2182-2220 |
| OneWay nullability | Nullable expected accepts either actual; non-null expected rejects nullable actual | rust/lance-core/src/datatypes/field.rs:411-421 |
| Loaded dictionary | Dictionary has values Some(ArrayRef), so equality uses values instead of offset/length | rust/lance-core/src/datatypes.rs:561-593 |

See the [datatype supplement](L1-modules/rust-lance-core-datatypes.md) for exact API contracts. These terms establish local type behavior, not an executable dataset write/read trace.
`);
append('L3-symbols/format-spec.md',`
## Core logical-type grammar

This is the reviewed core string grammar, used with separate Field children. It is not a complete wire codec or version-gate specification. [Exact source and annotations](../L2-files/rust/lance-core/src/datatypes.rs.md) retain every parsing arm. (rust/lance-core/src/datatypes.rs:317-559; rust/lance-core/src/datatypes/field.rs:170-195)

| Logical text | Arrow type / restrictions | Evidence |
|---|---|---|
| null; bool | Null; Boolean | rust/lance-core/src/datatypes.rs:321-324; rust/lance-core/src/datatypes.rs:420-423 |
| int8/uint8, int16/uint16, int32/uint32, int64/uint64 | Corresponding signed/unsigned width | rust/lance-core/src/datatypes.rs:324-331; rust/lance-core/src/datatypes.rs:424-431 |
| halffloat; float; double | Float16; Float32; Float64 | rust/lance-core/src/datatypes.rs:332-334; rust/lance-core/src/datatypes.rs:432-434 |
| string; binary; large_string; large_binary | Utf8; Binary; LargeUtf8; LargeBinary; views encode as base string/binary | rust/lance-core/src/datatypes.rs:337-340; rust/lance-core/src/datatypes.rs:435-438 |
| blob; json | LargeBinary in the inverse parser; metadata interpretation is separate | rust/lance-core/src/datatypes.rs:439-440; rust/lance-core/src/datatypes/field.rs:1279-1292 |
| date32:day; date64:ms | Date32; Date64 | rust/lance-core/src/datatypes.rs:341-342; rust/lance-core/src/datatypes.rs:441-442 |
| time32:s/ms; time64:us/ns | Inverse accepts these exact valid unit combinations | rust/lance-core/src/datatypes.rs:443-446 |
| duration:s/ms/us/ns | All four TimeUnit values | rust/lance-core/src/datatypes.rs:451-454 |
| timestamp:unit:timezone | unit s/ms/us/ns; timezone tail rejoined with colon; exactly - => None; no timezone validity check | rust/lance-core/src/datatypes.rs:345-351; rust/lance-core/src/datatypes.rs:539-554 |
| decimal:bits:precision:scale | bits i16 restricted to128/256; precision u8; scale i8; other semantic bounds not checked here | rust/lance-core/src/datatypes.rs:335-336; rust/lance-core/src/datatypes.rs:514-538 |
| fixed_size_binary:size | Exact two components; size i32 without positivity check here | rust/lance-core/src/datatypes.rs:394-394; rust/lance-core/src/datatypes.rs:492-501 |
| fixed_size_list:child:size | Last component i32, middle rejoined then recursively parsed; bfloat extension creates nullable item FixedSizeBinary(2) | rust/lance-core/src/datatypes.rs:379-393; rust/lance-core/src/datatypes.rs:457-491 |
| dict:value:index:flag | Exactly four components; recursive value/index parse, flag ignored; encoder emits false and probes parseability | rust/lance-core/src/datatypes.rs:354-370; rust/lance-core/src/datatypes.rs:502-513 |
| struct; list/list.struct; large_list/large_list.struct; map | Requires separately retained children through Field::data_type; map reconstructed sorted=false | rust/lance-core/src/datatypes.rs:353-353; rust/lance-core/src/datatypes.rs:371-378; rust/lance-core/src/datatypes.rs:395-406; rust/lance-core/src/datatypes/field.rs:170-195 |

An immediate FixedSizeList Struct child is stored as a Field child and reconstructed by a special prefix path. Nested fixed-size-list Struct and variable List/LargeList/Map inside a fixed-size list are rejected by the support check. Changing the string grammar requires coordinating both conversion directions and child representation; parseability alone does not promise exact original Arrow metadata or view identity. (rust/lance-core/src/datatypes.rs:296-305; rust/lance-core/src/datatypes.rs:354-393; rust/lance-core/src/datatypes/field.rs:175-183; rust/lance-core/src/datatypes/field.rs:1217-1226)

## Blob descriptor schema contract

The source explicitly marks stored v2 descriptor field names as stable. Ordered children are kind:UInt8, position:UInt64, size:UInt64, blob_id:UInt32, blob_uri:Utf8, canonically all required. The canonical outer description field is required and has blob=true plus lance-encoding:packed=true metadata. The structural classifier deliberately ignores descriptor child nullability to accept released representations that used nullable kind versus parent validity, while still requiring exact names/order/types. (rust/lance-core/src/datatypes.rs:115-188; rust/lance-core/src/datatypes.rs:200-218)

| Kind byte | Documented location interpretation | Evidence |
|---|---|---|
| 0 Inline | position/size point into main-file out-of-line buffer | rust/lance-core/src/datatypes.rs:120-121; rust/lance-core/src/datatypes.rs:599-600 |
| 1 Packed | blob_id selects shared packed sidecar, position/size select slice | rust/lance-core/src/datatypes.rs:122-123; rust/lance-core/src/datatypes.rs:601-602 |
| 2 Dedicated | blob_id selects raw sidecar, position0, size whole file length | rust/lance-core/src/datatypes.rs:124-125; rust/lance-core/src/datatypes.rs:603-604 |
| 3 External | blob_id0 means absolute blob_uri; positive id selects manifest base path; position/size range with zero size resolved to whole-object length | rust/lance-core/src/datatypes.rs:126-128; rust/lance-core/src/datatypes.rs:605-613 |

Unknown kind bytes return InvalidInput. No offsets, lengths, URI bases or actual data bytes are validated by this enum conversion. Read/write implementation, byte packing, feature/version gates and historical fixture validation remain pending. Logical/prepared layout tables and metadata transformations are in the [datatype supplement](../L1-modules/rust-lance-core-datatypes.md). (rust/lance-core/src/datatypes.rs:616-629)
`);
append('L3-symbols/behavior-contracts.md',`
## Field representation and tree operations

A Field is publicly mutable, but data_type() indexes required children and unwraps logical parsing. Fallible Arrow import checks only its explicit guards. Changes to child retention or logical grammar must preserve reconstructibility, or this apparently infallible accessor can panic. View types intentionally normalize, and reverse Arrow conversion does not restore field-ID metadata. (rust/lance-core/src/datatypes/field.rs:134-195; rust/lance-core/src/datatypes/field.rs:1204-1348; rust/lance-core/src/datatypes/field.rs:1531-1546)

Default comparison ignores dictionaries/metadata/field IDs; strict nullability remains checked. OneWay's expected/actual direction is expected || !actual. Two recognized logical blob forms compare only their shared prefix, so minimal-vs-complete can match while complete-vs-complete exposes range differences. Altering that distinction changes schema compatibility and diagnostics together. (rust/lance-core/src/datatypes/field.rs:72-103; rust/lance-core/src/datatypes/field.rs:312-440; rust/lance-core/src/datatypes/field.rs:613-621; rust/lance-core/src/datatypes/field.rs:1371-1437)

Projection/intersection helpers are not interchangeable. apply_projection makes maps/blobs atomic by selected parent ID; project(path) can return an empty nested field on missing path; project_by_field errors on primitive/binary-like mismatches before TakeSelf fallback; intersection silently drops failed nested child intersections. The exact behavior matrix and public signatures are in the [datatype supplement](../L1-modules/rust-lance-core-datatypes.md). A new validation/error policy changes existing helper behavior and needs caller review, not just a local rename. (rust/lance-core/src/datatypes/field.rs:274-310; rust/lance-core/src/datatypes/field.rs:697-725; rust/lance-core/src/datatypes/field.rs:786-867; rust/lance-core/src/datatypes/field.rs:913-999)

Dictionary equality intentionally ignores placement only when both values are loaded; unloaded dictionaries use placement equality and mixed states differ. The logical dictionary encoder rejects types whose string cannot be parsed back, avoiding a later reconstruction panic. These are independent contracts: array equality does not establish logical-string support, and the string guard does not populate dictionary values. (rust/lance-core/src/datatypes.rs:354-370; rust/lance-core/src/datatypes.rs:561-593; rust/lance-core/src/datatypes/field.rs:455-522)
`);
append('L4-crosscutting/pitfalls.md',`
## Datatype and field pitfalls

- Do not infer that is_blob tests a truthy metadata value: key presence suffices. Packed-struct metadata uses truthy parsing but does not check that the type is Struct. V2 descriptors can remain recognizable after losing extension metadata. (rust/lance-core/src/datatypes/field.rs:548-567; rust/lance-core/src/datatypes/field.rs:623-658; rust/lance-core/src/datatypes/field.rs:1153-1161)
- Do not substitute derived equality for compare_with_options, or reverse actual/expected in OneWay checks. Dictionary metadata equality itself depends on whether values are loaded. (rust/lance-core/src/datatypes/field.rs:134-161; rust/lance-core/src/datatypes/field.rs:411-440; rust/lance-core/src/datatypes.rs:579-593)
- Reference-order merge walks current child heads; it does not sort arbitrary inputs. Strict intersection can return success after dropping child errors. Equal-length fixed-size-list merge does not compare element types. These local behaviors require caller-level investigation before any proposed fix. (rust/lance-core/src/datatypes/field.rs:214-272; rust/lance-core/src/datatypes/field.rs:959-984; rust/lance-core/src/datatypes/field.rs:1048-1085)
- field_by_id searches descendants only. set_id treats every negative id as unassigned and requires a collision-safe seed from its caller; reset_id leaves parent IDs. Blob descriptor children may intentionally remain -1 under atomic projection. (rust/lance-core/src/datatypes/field.rs:1087-1151; rust/lance-core/src/datatypes/field.rs:2182-2220)
- Arrow map conversion checks at least two entries children, not exactly two; invalid position metadata silently falls back/drops locally. These are actual boundary behaviors despite stronger documentation, with higher-level validation still pending review. (rust/lance-core/src/datatypes/field.rs:37-56; rust/lance-core/src/datatypes/field.rs:1227-1270)
`);
append('L4-crosscutting/build-and-test.md',`
## Reviewed core datatype tests

No tests were executed. The datatype tests cover dictionary equality symmetry/unloaded reflexivity, parseable integer-key dictionaries, early rejection of unrepresentable dictionary strings, timestamp timezone roundtrips/rejections and blob shape classification. Field tests cover Arrow conversion and view normalization, map rejection, comparison diagnostics/options, nullability direction, blob transformations and repeated projection of synthetic descriptor children. (rust/lance-core/src/datatypes.rs:632-985; rust/lance-core/src/datatypes/field.rs:1350-2220)

Useful existing test targets include test_dictionary_partial_eq_contract, test_manifest_derived_dictionary_schemas_compare_equal, test_classify_blob_v2_layout_uses_structural_contract, test_dictionary_logical_type_rejects_unparsable_value, blob_v2_logical_shapes_are_compatible, map_keys_sorted_unsupported, test_explain_difference and blob_descriptor_projection_preserves_synthetic_children. Use the repository's Rust environment before cargo test -p lance-core with a selected name; this KB extraction does not report those commands as run or passing. (rust/lance-core/src/datatypes.rs:646-768; rust/lance-core/src/datatypes.rs:850-883; rust/lance-core/src/datatypes/field.rs:1371-1437; rust/lance-core/src/datatypes/field.rs:1632-1664; rust/lance-core/src/datatypes/field.rs:1852-2027; rust/lance-core/src/datatypes/field.rs:2182-2220; rust/AGENTS.md:1-65)
`);
append('L4-crosscutting/scenarios.md',`
## Partial in-memory blob projection trace

1. A v2 extension-marked Arrow field converts into logical struct with converted children and unassigned IDs; Field::set_id later assigns negative IDs using the caller's seed. (rust/lance-core/src/datatypes/field.rs:1204-1292; rust/lance-core/src/datatypes/field.rs:1095-1105)
2. Field::apply_projection sees a blob and treats the layout atomically: the parent ID must be selected and all children are copied. It then delegates representation selection to BlobHandling::unload_if_needed, whose implementation remains pending. (rust/lance-core/src/datatypes/field.rs:274-310)
3. Field::unloaded_mut selects canonical v2 descriptor logical type, children and metadata while retaining outer identity/nullability. The extension marker disappears, but structural descriptor recognition succeeds. (rust/lance-core/src/datatypes/field.rs:623-658)
4. Re-projecting this descriptor preserves all five synthetic children despite ID -1; the integration test explicitly asserts that case. (rust/lance-core/src/datatypes/field.rs:2182-2220)

This trace stops at the reviewed Field boundary. It does not prove scan execution, IO, null-buffer encoding, external URI fetching, Dataset::write or compaction behavior. All five complete self-sufficiency answers above remain failures.
`);
append('L4-crosscutting/cookbook.md',`
## Local recipe: extend a logical type (incomplete whole-system recipe)

Coordinate both TryFrom implementations in datatypes.rs with Field::data_type and Arrow-to-Field child extraction. Decide whether children are represented in the Field tree or encoded within the logical string, and ensure dictionary values/index strings cannot survive encoding only to fail infallible reconstruction. Add cases to existing roundtrip/rejection tests, including nested children, nullability/metadata and view normalization where relevant. (rust/lance-core/src/datatypes.rs:296-559; rust/lance-core/src/datatypes/field.rs:170-195; rust/lance-core/src/datatypes/field.rs:1204-1348; rust/lance-core/src/datatypes.rs:770-985; rust/lance-core/src/datatypes/field.rs:1472-1697)

This is only a core-type dependency map. Before implementation qualification, trace persistence conversion, encoding/decoding dispatch, schema validation, bindings, version gates and released compatibility fixtures; those files are still pending in this KB. Blob stored field names are explicitly stable, while logical/prepared fields have separate documented purposes and classifiers. (rust/lance-core/src/datatypes.rs:51-188)
`);
console.log(JSON.stringify({public_records:symbols.length}));
