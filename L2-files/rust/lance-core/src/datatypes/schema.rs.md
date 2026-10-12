> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-core/src/datatypes/schema.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `50d2c48f129c6dfa8fe4f6502156ef0e833abd784ec4514786012181c9db8899`. Reviewed physical lines: 1-3225.

[Module](../../../../../L1-modules/rust-lance-core.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Schema tree validation/conversion, field lookup and path syntax, configurable comparison, schema set operations and a Projectable-backed Projection selection model with blob handling. This private module re-exports selected public APIs through datatypes; its pub comparison helpers are not among those re-exports. Methods operate on in-memory schema data, not dataset IO or commit transactions. (rust/lance-core/src/datatypes/schema.rs:1-3225)

## Complete range analysis

### Lines 1-31

SPDX, module purpose and imports establish HashMap/HashSet/VecDeque, formatting, Arc, deep-size, Arrow schemas/batches, lance_arrow helpers, Field options, core errors and system-column statics. Public Schema derives Default, Debug, Clone, DeepSizeOf and exposes fields:Vec<Field> plus metadata:HashMap<String,String>. Equality is implemented separately below and is not a full derived comparison of these two members. (rust/lance-core/src/datatypes/schema.rs:1-31)

### Lines 32-81

Public FieldRef<'a> is ById(i32) or ByPath(&'a str), deriving Debug/Clone/PartialEq/Eq/Hash. into_id consumes it: ById verifies schema.field_by_id and returns InvalidInputSource for an absent ID; ByPath uses schema.field and lazy FieldNotFound diagnostics with schema.field_paths. From<i32>, From<&str> and From<&String> construct references without lookup/validation. Borrowed path lifetime is preserved. (rust/lance-core/src/datatypes/schema.rs:32-81)

### Lines 82-112

Private SchemaFieldIterPreOrder stores a Vec<&Field> stack. new reserves twice top-level count and pushes top-level fields in reverse. Iterator::next pops a field, pushes its children reversed and yields the parent; thus traversal preserves source order in depth-first pre-order. Exhaustion returns None; no recursive call stack is used, but pending siblings consume heap stack space. (rust/lance-core/src/datatypes/schema.rs:82-112)

### Lines 113-135

Public validate_fixed_size_list_dimensions(field_name,&DataType)->Result rejects dimension<=0 with a Schema error including name/value. It recursively follows a FixedSizeList's element DataType, stopping on every other type. It does not itself recurse through arbitrary Struct/List/Map; Schema's Field walk supplies those nodes. Rationale: row-count division by zero and nested fixed-size lists collapsed into one leaf; comments identify shared write validation and decoder scheduler usage, but downstream read callers remain pending. Negative values are rejected as well as zero. (rust/lance-core/src/datatypes/schema.rs:113-135)

### Lines 136-173

unenforced_primary_key collects all marked fields in pre-order and sorts by tuple: positive u32 position becomes (false,position as i32,id), zero/legacy becomes (true,id,id). Explicit positive entries precede legacy, ties use id. The cast can wrap positions above i32::MAX, so exact ordering is signed-cast order, not all-u32 numerical order. No uniqueness/contiguity/range validation occurs here. unenforced_clustering_key collects marked fields and sorts directly by u32 position (unwrap_or0); ties retain pre-order under stable sort. Position0 remains accepted locally. (rust/lance-core/src/datatypes/schema.rs:136-173)

### Lines 174-223

compare_with_options delegates child fields then optionally compares top-level metadata. explain_difference gets child diagnostics and appends metadata differences if requested, returning None or a comma-joined string. has_dictionary_types delegates to each Field. check_compatible returns SchemaMismatch with explanation or fallback unknown reason when comparison fails. to_compact_string converts through ArrowSchema and delegates the lance_arrow formatter; documentation explicitly says display, not serialization. (rust/lance-core/src/datatypes/schema.rs:174-223)

### Lines 224-258

resolve parses field-path syntax, converting parser errors to None. One segment does an exact top-level name search; multiple segments find the first root, construct a VecDeque of remaining borrowed segments and invoke Field::resolve, returning the full ancestry only on success. Failed Field traversal's partial queue/output is local and discarded. Doc examples use double quotes for dotted child names, but the actual parser only treats backticks specially (rust/lance-core/src/datatypes/schema.rs:1567-1663). (rust/lance-core/src/datatypes/schema.rs:224-258)

### Lines 259-307

Private do_project parses each requested string fallibly, then uses split[0] (safe because parse guarantees a nonempty result). It calls self.field(first), then Field::project on remaining segments; repeated selected roots merge into the first candidate via Field::merge, preserving first-selection order and Self metadata. Because self.field reparses first, an already-unquoted segment containing dots/backticks can be reinterpreted; lookup is not a direct root-name search. Missing nested paths inherit Field::project's empty-child success rather than this root missing check (rust/lance-core/src/datatypes/field.rs:697-725). Recognized system names are silently dropped unless preserve_system_columns; then canonical Arrow fields for rowid/rowaddr/rowoffset/creation/update versions are converted and appended, without deduplication or tail validation. Unknown roots error via FieldNotFound only if err_on_missing; otherwise drop. Result is not revalidated. (rust/lance-core/src/datatypes/schema.rs:259-307)

### Lines 308-327

Public project forwards err_on_missing=true,preserve_system_columns=false; project_or_drop uses false,false; project_preserve_system_columns uses true,true. The project documentation retains an ignored doctest, unlike current contributor preference; it is not compiled evidence. These wrappers differ only in root missing/system behavior, not in nested Field::project validation or blob handling. Contributor doctest policy: AGENTS.md:92-102; underlying projection flow: rust/lance-core/src/datatypes/schema.rs:259-306. (rust/lance-core/src/datatypes/schema.rs:308-327)

### Lines 328-384

validate first rejects dots and duplicates among top-level names. It collects reserved negative lineage IDs only from top-level fields whose name maps to that same ID, then pre-order checks every ID: negative IDs outside that allowed set fail, and every duplicate fails. A nested reuse of an allowed reserved ID eventually fails duplication against its top-level owner. It does not check lineage datatype/nullability, parent_id consistency or nested name uniqueness. Every field's reconstructed DataType is passed to fixed-size-list dimension validation; malformed Field::data_type may panic before returning a validation error. Primary-key verification is a separate call, not part of validate. (rust/lance-core/src/datatypes/schema.rs:328-384)

### Lines 385-416

Public intersection/intersection_ignore_types forward to private do_intersection with false/true. It iterates Other top-level order, finds matching Self fields using path-based self.field(name), delegates Field::do_intersection and propagates top-level errors; absent roots are omitted. Result metadata comes from Self, without validation. This ordering differs from Field's recursive child intersection, which iterates Self and suppresses child errors (rust/lance-core/src/datatypes/field.rs:959-984). fields_pre_order exposes the private iterator as impl Iterator<Item=&Field>. (rust/lance-core/src/datatypes/schema.rs:385-416)

### Lines 417-468

field_paths traverses all fields, then performs a separate ancestry-by-ID lookup for each, joining names with raw dots. It does not quote dotted/backtick names and is not a guaranteed parseable path API. Repeated ancestry searches/path cloning can be expensive and duplicate IDs can map to another same-ID ancestry. project_by_ids delegates each root to Field::project_by_ids and retains schema metadata; its docs' false=>only selected children is qualified by the Field parent-only fallback (rust/lance-core/src/datatypes/field.rs:768-784). Private apply_projection delegates Field's atomic-aware filtering, likewise retaining metadata. (rust/lance-core/src/datatypes/schema.rs:417-468)

### Lines 469-503

project_by_schema accepts S:TryInto<Self,Error=Error>, converts once, iterates projection order, rejects any requested root name containing a dot, then resolves matching Self fields and calls project_by_field with the supplied mismatch mode. OnMissing::Error yields a Schema error for missing roots; Ignore drops them. Result preserves Self metadata. A &Schema conversion later clones without validation, while &ArrowSchema conversion assigns IDs/validates/verifies keys; generic input type therefore affects preliminary checks (rust/lance-core/src/datatypes/schema.rs:889-928). (rust/lance-core/src/datatypes/schema.rs:469-503)

### Lines 504-542

exclude accepts a Debug TryInto<Self>; conversion failures are replaced with a generic Schema error, losing the original reason. For each Self root, a matching Other root removes a non-nested field or applies Field::exclude for nested fields; unmatched roots clone. Metadata stays Self. field returns the last node of resolve; field_case_insensitive returns the last node of its case-insensitive counterpart. All roots are looked up by parsed paths, not literal unescaped names. (rust/lance-core/src/datatypes/schema.rs:504-542)

### Lines 543-588

resolve_case_insensitive uses the same parser/error-to-None policy as resolve. For a single root or the first segment it prefers exact name, then first ASCII-case-insensitive match. Remaining segments use Field::resolve_case_insensitive. Ambiguous folded names use first match rather than error; original case is preserved in returned references. Unicode case folding is not used. (rust/lance-core/src/datatypes/schema.rs:543-588)

### Lines 589-632

Public field_id has a TODO to reduce visibility but currently returns a Schema error with fixed Vector column not in schema text on any failed path lookup. top_level_field_ids returns root IDs in order; field_ids collects pre-order IDs, including negatives. field_by_id_mut and field_by_id check each root itself then its descendants, so unlike the Field versions they include top-level nodes. First forward DFS match wins if IDs are duplicated. (rust/lance-core/src/datatypes/schema.rs:589-632)

### Lines 633-672

field_ancestry_by_id builds owned Vec paths for all roots, pops from the end and pushes children in forward order, so search is reverse sibling order; each edge clones the whole path. It ignores parent_id metadata and returns the actual tree ancestry. Public mut_field_by_id provides another root-inclusive forward mutable search. max_field_id takes root max_id values and returns None for empty schema; docs advise Manifest::max_field_id for datasets because dropped IDs are absent here. Field::max_id floors negative-only leaves at -1 (rust/lance-core/src/datatypes/field.rs:1087-1093). (rust/lance-core/src/datatypes/schema.rs:633-672)

### Lines 673-710

set_dictionary requires a RecordBatch column by name for every root, including non-dictionary roots; missing column returns Schema error after any earlier attachments, and Field::set_dictionary may panic on type mismatch. set_field_id chooses max(current schema max or -1, supplied persisted max or -1)+1 then calls Field::set_id(-1,&mutseed) for each root. Existing nonnegative IDs remain, only negative IDs are assigned, and all parent IDs are rebuilt. It does not reassign already assigned IDs despite loose doc wording, validate duplicate IDs, or guard i32 overflow. Private reset_id recursively resets IDs only. (rust/lance-core/src/datatypes/schema.rs:673-710)

### Lines 711-729

extend converts all Arrow fields before mutation, then appends them and only afterward checks duplicate top-level names. Duplicate names return Internal but leave the appended fields in self; there is no rollback. Success does not assign IDs, run validate, or verify primary keys. New fields retain imported IDs or -1. The comment says create a new schema, but the public API mutates &mut self. (rust/lance-core/src/datatypes/schema.rs:711-729)

### Lines 730-767

merge converts Other and resets its IDs. It clones each Self root, merges a matching Other field with Field::merge, then appends new Other roots in Other order, suppressing repeated root names already in the output. Metadata begins with Other then Self overwrites shared keys. It returns a new Schema without assigning new IDs or validating it; imported fields stay -1 until explicit set_field_id, as tested below. Self is unmodified if conversion/merge fails; partial mutations affect only local clones. (rust/lance-core/src/datatypes/schema.rs:730-767)

### Lines 768-834

field_path obtains ancestry and calls format_field_path; field_path_minimal calls the minimally quoting formatter. Missing ancestry yields Error::index with the ID. Full formatting is documented for SQL expression use, while minimal formatting preserves hyphens and quotes literal dots/backticks for field-path roundtrip/index metadata. The long compiled-style doctest constructs a valid schema and asserts hyphen preservation and dotted-child roundtrip; tests were read, not executed. Formatter implementation limits are described at rust/lance-core/src/datatypes/schema.rs:1665-1735. (rust/lance-core/src/datatypes/schema.rs:768-834)

### Lines 835-873

verify_primary_key gathers marked fields, rejects any non-leaf, then walks actual ancestry (if found) including the field itself and rejects nullable members, List/LargeList logical types and Map logical types. It does not explicitly reject FixedSizeList, whose primitive-element representation can be a leaf; it does not verify positions, duplicate positions, value uniqueness or clustering-key constraints. Publicly malformed schemas with duplicate IDs can confuse ancestry; missing ancestry simply skips that loop. No data values are read, consistent with unenforced key naming. (rust/lance-core/src/datatypes/schema.rs:835-873)

### Lines 874-929

Schema PartialEq compares only fields and ignores schema metadata; Field derived equality still compares its own members. Display writes each Field followed by newline. TryFrom<&ArrowSchema> recursively converts fields, copies metadata, assigns IDs, validates and verifies primary keys in that order; stale comment calls this arrow2 although imported type is arrow_schema::Schema. From<&Schema> to ArrowSchema converts fields and copies metadata without validation. TryFrom<&Self> just clones, preserving any invalid state and allowing shared generic APIs to accept Schema references. (rust/lance-core/src/datatypes/schema.rs:874-929)

### Lines 930-981

pub compare_fields is in a private non-re-exported module. Default fast path requires equal lengths and ordered pairwise Field comparison. If allow_missing_if_nullable, ignore_field_order or allow_subschema is set, it first rejects any actual field name absent from expected, then maps actual names to (field,last_position), with duplicate names overwriting. Each expected name must compare if present; positions must be nondecreasing unless ignore_field_order. Missing expected names are allowed under allow_subschema, else only nullable expected under allow_missing_if_nullable. It does not enforce unique names or strict position increase; duplicate-name malformed inputs can behave differently from fast path. (rust/lance-core/src/datatypes/schema.rs:930-981)

### Lines 982-1039

pub explain_fields_difference constructs HashSets of actual/expected names, prefixes paths with raw dot concatenation, computes unexpected and disallowed missing names and emits one combined message if needed. allow_subschema suppresses all missing reports; allow_missing_if_nullable suppresses missing nullable fields by finding the first expected name match. HashSet iteration means ordering of multiple missing/unexpected names is not explicitly stable. These paths are diagnostic text, not escaped field expressions. (rust/lance-core/src/datatypes/schema.rs:982-1039)

### Lines 1040-1098

Explanation then maps each expected field to the first matching actual position, checks adjacent decreases unless ignore_field_order, emits full expected/actual order if needed, and delegates per-field explain_differences in expected order. This first-match policy differs from compare_fields' slow-path last-name mapping on duplicates. debug_assert verifies matching names. Private explain_metadata_difference prints Debug maps on inequality; map entry order is not guaranteed. Public OnMissing enum has Error and Ignore. (rust/lance-core/src/datatypes/schema.rs:1040-1098)

### Lines 1099-1143

Public Projectable:Debug+Send+Sync exposes schema(&self)->&Schema; Schema implements it by returning self. BlobHandling derives Debug/Clone/Default/PartialEq: AllBinary, default BlobsDescriptions, AllDescriptions, SomeBlobsBinary(HashSet<u32>) and SomeBinary(HashSet<u32>). Comments distinguish only marked blobs versus all binary columns. Private should_load_binary first requires is_blob, then selects all under AllBinary or IDs contained in either set; descriptor modes return false. i32 field IDs are cast to u32 without validation. (rust/lance-core/src/datatypes/schema.rs:1099-1143)

### Lines 1144-1189

should_unload first reconstructs DataType and accepts binary-like or blob-marked fields. AllBinary=false; BlobsDescriptions=is_blob; AllDescriptions=true; SomeBlobsBinary=is_blob&&!setcontains; SomeBinary=!setcontains. returns_description directly exposes this decision for materialization heuristics. unload_if_needed checks load first (binary_blob_mut and early return), unload second (unloaded_mut and early return), otherwise recursively transforms children. For an ordinary non-blob binary field, AllDescriptions/SomeBinary can report true yet Field::unloaded_mut is a no-op because it only handles blobs (rust/lance-core/src/datatypes/field.rs:648-658). Thus the policy name/doc does not prove an ordinary binary field actually becomes a descriptor through this function. (rust/lance-core/src/datatypes/schema.rs:1144-1189)

### Lines 1190-1224

Projection derives Clone and owns a private Arc<dyn Projectable> base, public HashSet<i32> field_ids, booleans for rowid/rowaddr/last-update/creation-version and public BlobHandling. No row-offset boolean exists. Debug prints selections/mode but omits base. System-column selection is separate from field IDs, although union_schema can insert a nonnegative field with a system-like name as an ordinary ID. The doc's no-field-id wording describes this selection model, not every persisted lineage representation. (rust/lance-core/src/datatypes/schema.rs:1190-1224)

### Lines 1225-1275

empty stores base, empty ID set, false metadata flags and default blob mode. full clones base.schema and unions it into empty. Four consuming flag builders set true; with_blob_handling replaces the mode. Private add_field_children recursively inserts all descendants' IDs, including negative values, without checking base membership. No asynchronous or shared mutable base state is added here. (rust/lance-core/src/datatypes/schema.rs:1225-1275)

### Lines 1276-1332

union_column consumes self, recognizes exact raw rowid/rowaddr/last-update/creation-version strings first and sets their flags. Other paths resolve through base.schema; all ancestors plus all descendants of the target are inserted, not siblings. Missing or malformed paths become InvalidInputSource under Error or no change under Ignore. Quoted system names do not take the raw-string shortcut; rowoffset and wildcard have no special handling here. contains_field_id is set membership; has_data_fields is nonempty IDs. union_columns folds this fallibly in input order. (rust/lance-core/src/datatypes/schema.rs:1276-1332)

### Lines 1333-1364

union_predicate inserts exactly base fields satisfying the predicate; subtract_predicate removes exactly matching IDs. Neither repairs parent/child closure or touches metadata flags, so later Field::apply_projection can assert if a selected nested parent loses all children. intersect takes set intersection and ANDs all metadata flags, retaining Self base and blob mode without compatibility checks between bases/modes. Its allocations collect a new HashSet. (rust/lance-core/src/datatypes/schema.rs:1333-1364)

### Lines 1365-1403

union_schema traverses Other fields: nonnegative IDs are blindly inserted, then negative fields matching four system names set flags; all other negative fields only debug_assert id==-1. Despite docs promising base membership checks and panic for foreign nonnegative IDs, the implementation never consults base here. Ordinary -1 fields are ignored, reserved other negatives may assert only in debug. union_projection unions IDs and ORs all metadata flags, preserving Self base/blob mode and likewise not validating base compatibility. (rust/lance-core/src/datatypes/schema.rs:1365-1403)

### Lines 1404-1457

union_arrow_schema/subtract_arrow_schema first update metadata flags from Other's top-level names, then ask base.schema.project_by_schema(other,on_missing,TakeSelf), and finally union/subtract the resulting schema IDs. This performs Arrow conversion/validation and still inherits Field's mismatch branches that can error before TakeSelf fallback. With OnMissing::Error a system-only Arrow field absent from base can still cause project_by_schema failure after flag updates; consumed Self is not returned on error. No special filtering of those roots occurs before the schema projection. (rust/lance-core/src/datatypes/schema.rs:1404-1457)

### Lines 1458-1498

subtract_projection takes ID set difference and clears each flag selected by Other; retains Self base/blob mode. subtract_schema mirrors union_schema using remove/false, and has the same misleading foreign-ID panic promise: absent positive IDs simply remove nothing, without checking base; non-system negatives assert id==-1 in debug. Both methods can leave incomplete ancestor/child selections, with no closure repair. (rust/lance-core/src/datatypes/schema.rs:1458-1498)

### Lines 1499-1528

is_empty requires no IDs and all four flags false. is_metadata_only requires no IDs and at least one of those flags true, including lineage versions beyond the shorter doc wording. has_non_meta_cols duplicates the ID-nonempty predicate of has_data_fields. to_bare_schema applies the projection to base schema, preserving base ordering and metadata while applying blob transformation; it does not independently strip actual system-named fields selected by IDs. (rust/lance-core/src/datatypes/schema.rs:1499-1528)

### Lines 1529-1566

to_schema starts from bare schema and appends requested metadata fields in fixed order rowid,rowaddr,last-update,creation-version. It calls Schema::extend(...).unwrap(), so duplicate existing names can panic; appended canonical fields remain unassigned IDs because extend does not assign. into_schema forwards, into_schema_ref wraps Arc, to_arrow_schema converts the materialized schema. No requested rowoffset flag exists and no final validation is performed. (rust/lance-core/src/datatypes/schema.rs:1529-1566)

### Lines 1567-1623

Public parse_field_path returns Result<Vec<String>> and rejects empty input. It scans Unicode chars, collecting a current segment and in_quotes flag. Only backtick is quoting syntax; double quotes are ordinary characters despite earlier resolver doc examples. Within quotes, doubled backticks decode to one; a single closing backtick requires following dot or end. Outside quotes, backtick can start only at an empty segment; elsewhere it errors as unexpected quote. Original input is included in malformed-path diagnostics. (rust/lance-core/src/datatypes/schema.rs:1567-1623)

### Lines 1624-1664

Unquoted dot requires a nonempty current segment then pushes it; other chars, including quoted dots, spaces, brackets and double quotes, are literal. End with open quote errors; nonempty current pushes; empty current after earlier segments errors as trailing dot; empty result errors generically. The comment calls the final result-empty check redundant after the empty-input guard, but a fully empty quoted segment is another way to reach it. Success guarantees at least one nonempty segment; no whitespace trimming, wildcard parsing or normalization occurs. (rust/lance-core/src/datatypes/schema.rs:1624-1664)

### Lines 1665-1692

format_field_path maps segments independently, quoting when any char is neither Unicode-alphanumeric nor underscore, doubling embedded backticks, and joining with dots. It is intended for SQL expression safety but does not quote solely for a leading digit, reserved word or empty name; no SQL parser validation occurs here. Empty slice returns empty string, and empty segments stay empty. The comment calls doubled backticks PostgreSQL style; this is local naming, not evidence of a full SQL dialect grammar. (rust/lance-core/src/datatypes/schema.rs:1665-1692)

### Lines 1693-1736

format_field_path_minimal quotes only segments containing dot or backtick, doubles backticks and joins. Hyphens, spaces and other ordinary chars remain bare; this matches the local field-path parser, not SQL expression syntax. Doctests assert hyphen/dot/backtick examples and roundtrip for their nonempty segments. The doc's unconditional roundtrip wording assumes valid nonempty segments: empty slice/segment outputs can fail parse_field_path. Both formatters return String and do not reject invalid inputs. (rust/lance-core/src/datatypes/schema.rs:1693-1736)

### Lines 1737-1766

escape_field_path_for_project preserves exactly WILDCARD unchanged. Otherwise it parses, falls back on any error to treating the whole input as one literal segment, doubles backticks and quotes every segment. It is deliberately non-fallible; malformed path text is escaped rather than rejected, and empty input becomes a quoted empty segment. Tests module imports Arrow aliases, HashMap/Arc and the module API. (rust/lance-core/src/datatypes/schema.rs:1737-1766)

### Lines 1767-1840

test_resolve_with_quoted_fields constructs Schema directly, bypassing validation and retaining unassigned IDs, to resolve a top-level dotted name in backticks, normal root, dotted nested child and normal nested child. It checks returned ancestry length/names and equivalent field lookup. A double-quoted nonexistent path returns None, but this does not demonstrate double-quote syntax support. The manual schema's dotted root would fail normal Schema::try_from validation. (rust/lance-core/src/datatypes/schema.rs:1767-1840)

### Lines 1841-1917

test_field_path_parsing asserts plain multisegment/single paths, quoted dotted segments at all positions, literal tags[*], doubled backtick decoding, and failures for unclosed quote, mid-unquoted quote, empty segment and trailing dot. It also asserts full formatter outputs for dotted/backtick names. It does not test empty quoted segments, postquote text, empty formatter inputs or double quotes as quoting syntax. (rust/lance-core/src/datatypes/schema.rs:1841-1917)

### Lines 1918-1984

Validation tests ensure duplicate ID0 is reported even when top-level names differ, and allow a top-level rowid with its own reserved negative ID. Wrong lineage name/ID pairing and a nested lineage negative without a top-level owner return Schema negative-id errors. Fixtures use valid UInt64/non-null lineage types but these tests do not establish that validate checks those properties. (rust/lance-core/src/datatypes/schema.rs:1918-1984)

### Lines 1985-2043

test_resolve_quoted_fields asserts Arrow-schema import rejects a dotted top-level name with the expected message, then permits a dotted nested child and resolves it with backticks, plus normal root/nested fields. Both candidate schemas go through Schema::try_from(&ArrowSchema). The test demonstrates rejected top-level versus accepted nested dotted names at this import/resolution boundary; it does not exercise direct construction of an invalid core Schema. An additional DataType import follows. (rust/lance-core/src/datatypes/schema.rs:1985-2043)

### Lines 2044-2110

Projection tests select b.f1,b.f3,c from a schema with a,b,c and assert exact Arrow shape/order with partial Struct children. The system-preserving variant inserts _rowid between b and c according to request order and asserts nullable UInt64. They do not test duplicate system selections, missing nested paths or blob policy in these wrappers. (rust/lance-core/src/datatypes/schema.rs:2044-2110)

### Lines 2111-2179

project_by_ids tests select descendants plus another root, a single nested child, an entire parent with include_all_children=true, and parent+one child with false. Arrow-schema assertions pin the retained child sets. There is no parent-only,false case here, so the Field helper's full-child fallback is not disproved by the doc-oriented tests. (rust/lance-core/src/datatypes/schema.rs:2111-2179)

### Lines 2180-2246

project_by_schema test builds scalar, Struct, string, List and Dictionary fields, requests a subset with OnMissing::Error/TakeSelf, and compares Arrow output to the requested projection. The fixture named fixed_l is actually DataType::List, not FixedSizeList; do not count it as fixed-size-list coverage. Types match in this fixture, so it does not prove TakeSelf accepts all mismatches. (rust/lance-core/src/datatypes/schema.rs:2180-2246)

### Lines 2247-2298

Nested lookup test resolves b.f2 as Boolean. Exclusion test projects a,b.f2,b.f3 then excludes them, expecting b.f1 and c. These assert simple same-type name-based operations, not malformed inputs, blob atomic subtraction or conversion error preservation. (rust/lance-core/src/datatypes/schema.rs:2247-2298)

### Lines 2299-2369

Intersection test asserts common b children f1/f2 plus c, omitting unmatched roots. A List<Struct> case builds a partial ID projection and checks intersection_ignore_types in both directions equals it. It does not exercise incompatible nested-child errors being silently omitted or LargeList intersection behavior. (rust/lance-core/src/datatypes/schema.rs:2299-2369)

### Lines 2370-2443

Merge-ID test shows existing max5, incoming max1, merged incoming fields still id-1/max5, then set_field_id(Some7) assigns8/9. This explicitly qualifies merge's reassignment prose: assignment is a separate call. Metadata merge test asserts both unique keys survive and Self's value wins a shared key. (rust/lance-core/src/datatypes/schema.rs:2370-2443)

### Lines 2444-2544

Arrow-schema merge test explicitly calls set_field_id(None), then expects new IDs6/7. Nested merge combines f11/f22 and f2/f3, adjusts expected IDs to reflect retained existing IDs and newly assigned values, then asserts Schema equality. That equality ignores schema metadata, but the earlier dedicated metadata test covers its merge policy. (rust/lance-core/src/datatypes/schema.rs:2444-2544)

### Lines 2545-2609

field_by_id test checks root b at1 and child f2 at3. Schema explanation test expects exact combined text for missing nested b.f2 and nullable mismatch on c. There is only one missing name in that assertion, so it does not stabilize ordering of larger HashSet-derived missing-name sets. (rust/lance-core/src/datatypes/schema.rs:2545-2609)

### Lines 2610-2711

Subschema comparison test rejects nullable omissions by default, allows them under allow_missing_if_nullable, rejects missing non-null fields, and rejects reordered roots/children unless ignore_field_order=true. After creating out_of_order it accidentally calls subschema.explain_difference for one expected diagnostic, so that assertion repeats the earlier subschema check rather than testing reordered diagnostics; the final ignore-order explanation uses out_of_order correctly. This test does not set allow_subschema, despite its name. (rust/lance-core/src/datatypes/schema.rs:2610-2711)

### Lines 2712-2769

Primary-key success cases cover no key, a non-null Int32 root carrying the legacy boolean key metadata marker, and a non-null nested Struct leaf key alongside a root key. Assertions compare returned leaf names/order. No values are checked for uniqueness, and these fixtures do not test explicit position parsing. (rust/lance-core/src/datatypes/schema.rs:2712-2769)

### Lines 2770-2849

Primary-key failure cases assert import rejects a nullable key leaf, a Struct marked as a key, a key under a nullable ancestor, and a key inside a List. They check descriptive error substrings. Map ancestry and primitive-element FixedSizeList leaf behavior are not tested here. (rust/lance-core/src/datatypes/schema.rs:2770-2849)

### Lines 2850-2956

Primary-key ordering test covers explicit positions2/1 yielding b,a; absent positions using legacy flags yielding schema order c,d; and mixed explicit+legacy yielding f,e,g. It does not cover duplicate/gapped/zero/invalid positions or the u32-to-i32 cast boundary in the sorting implementation. (rust/lance-core/src/datatypes/schema.rs:2850-2956)

### Lines 2957-3010

Missing-root projection diagnostics test formats errors for vectr and an unrelated name, asserting the vector suggestion only for the typo and available-field listing for both. field_paths test checks membership of three flat names, not nested quoting, ordering or invalid-ID behavior. Suggestions are generated through the previously analyzed FieldNotFoundError Display path. (rust/lance-core/src/datatypes/schema.rs:2957-3010)

### Lines 3011-3080

Minimal-path test covers unchanged plain/underscore identifiers, full-versus-minimal hyphen handling, a nested hyphen leaf, and dotted/backtick nested names that must stay quoted and roundtrip. It obtains dotted child IDs via direct child-name search to avoid ambiguity. The regression specifically rejects the shortcut of removing every backtick from a path. (rust/lance-core/src/datatypes/schema.rs:3011-3080)

### Lines 3081-3141

Dimension test rejects zero-sized FixedSizeList at root, inside Struct, and nested inside a positive-size FixedSizeList whose inner representation collapses into a leaf. It checks the positive-integer error substring and accepts positive direct/nested lists. Negative dimensions are rejected by code but not explicitly tested in this block. (rust/lance-core/src/datatypes/schema.rs:3081-3141)

### Lines 3142-3225

Clustering-key tests cover no key, a single position1 key, nullable key acceptance, and position3/1/2 fields returned in a,b,c order despite source c,a,b order. An unrelated d field is omitted. There is no clustering leaf/list/position-range validation test here. This closes the complete file; all lines/tests were read, but no tests were executed during KB extraction. (rust/lance-core/src/datatypes/schema.rs:3142-3225)

## Interaction and interpretation limits

This file closes several previously pending local boundaries: Arrow schema import assigns IDs, validates names/IDs/dimensions and verifies primary-key structure; Projectable and BlobHandling now have local implementation evidence. It still does not establish every writer/reader call to these checks, IO behavior, actual schema persistence, version gates, expression parsing beyond local field paths, or a complete repository call graph. Field operations are separately analyzed at rust/lance-core/src/datatypes/field.rs:163-1348; parser/formatter and Projection doc/code discrepancies are recorded rather than silently repaired. No source files were edited.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Schema
    5 | 
    6 | use std::{
    7 |     collections::{HashMap, HashSet, VecDeque},
    8 |     fmt::{self, Debug, Formatter},
    9 |     sync::Arc,
   10 | };
   11 | 
   12 | use crate::deepsize::DeepSizeOf;
   13 | use arrow_array::RecordBatch;
   14 | use arrow_schema::{DataType, Field as ArrowField, Schema as ArrowSchema};
   15 | use lance_arrow::*;
   16 | 
   17 | use super::field::{Field, OnTypeMismatch, SchemaCompareOptions};
   18 | use crate::{
   19 |     Error, ROW_ADDR, ROW_ADDR_FIELD, ROW_CREATED_AT_VERSION, ROW_CREATED_AT_VERSION_FIELD, ROW_ID,
   20 |     ROW_ID_FIELD, ROW_LAST_UPDATED_AT_VERSION, ROW_LAST_UPDATED_AT_VERSION_FIELD, ROW_OFFSET,
   21 |     ROW_OFFSET_FIELD, Result, WILDCARD,
   22 | };
   23 | 
   24 | /// Lance Schema.
   25 | #[derive(Default, Debug, Clone, DeepSizeOf)]
   26 | pub struct Schema {
   27 |     /// Top-level fields in the dataset.
   28 |     pub fields: Vec<Field>,
   29 |     /// Metadata of the schema
   30 |     pub metadata: HashMap<String, String>,
   31 | }
   32 | 
   33 | /// Reference to a field in a schema, either by ID or by path.
   34 | #[derive(Debug, Clone, PartialEq, Eq, Hash)]
   35 | pub enum FieldRef<'a> {
   36 |     /// Reference by field ID
   37 |     ById(i32),
   38 |     /// Reference by field path (e.g., "struct_field.sub_field")
   39 |     ByPath(&'a str),
   40 | }
   41 | 
   42 | impl FieldRef<'_> {
   43 |     /// Convert this field reference to a field ID by looking it up in the schema.
   44 |     pub fn into_id(self, schema: &Schema) -> Result<i32> {
   45 |         match self {
   46 |             FieldRef::ById(id) => {
   47 |                 if schema.field_by_id(id).is_none() {
   48 |                     return Err(Error::invalid_input_source(
   49 |                         format!("Field ID {} not found in schema", id).into(),
   50 |                     ));
   51 |                 }
   52 |                 Ok(id)
   53 |             }
   54 |             FieldRef::ByPath(path) => {
   55 |                 let field = schema
   56 |                     .field(path)
   57 |                     .ok_or_else(|| Error::field_not_found(path, schema.field_paths()))?;
   58 |                 Ok(field.id)
   59 |             }
   60 |         }
   61 |     }
   62 | }
   63 | 
   64 | impl From<i32> for FieldRef<'_> {
   65 |     fn from(id: i32) -> Self {
   66 |         FieldRef::ById(id)
   67 |     }
   68 | }
   69 | 
   70 | impl<'a> From<&'a str> for FieldRef<'a> {
   71 |     fn from(path: &'a str) -> Self {
   72 |         FieldRef::ByPath(path)
   73 |     }
   74 | }
   75 | 
   76 | impl<'a> From<&'a String> for FieldRef<'a> {
   77 |     fn from(path: &'a String) -> Self {
   78 |         FieldRef::ByPath(path.as_str())
   79 |     }
   80 | }
   81 | 
   82 | /// State for a pre-order DFS iterator over the fields of a schema.
   83 | struct SchemaFieldIterPreOrder<'a> {
   84 |     field_stack: Vec<&'a Field>,
   85 | }
   86 | 
   87 | impl<'a> SchemaFieldIterPreOrder<'a> {
   88 |     fn new(schema: &'a Schema) -> Self {
   89 |         let mut field_stack = Vec::with_capacity(schema.fields.len() * 2);
   90 |         for field in schema.fields.iter().rev() {
   91 |             field_stack.push(field);
   92 |         }
   93 |         Self { field_stack }
   94 |     }
   95 | }
   96 | 
   97 | /// Iterator implementation for a pre-order traversal of fields
   98 | impl<'a> Iterator for SchemaFieldIterPreOrder<'a> {
   99 |     type Item = &'a Field;
  100 | 
  101 |     fn next(&mut self) -> Option<Self::Item> {
  102 |         if let Some(next_field) = self.field_stack.pop() {
  103 |             for child in next_field.children.iter().rev() {
  104 |                 self.field_stack.push(child);
  105 |             }
  106 |             Some(next_field)
  107 |         } else {
  108 |             None
  109 |         }
  110 |     }
  111 | }
  112 | 
  113 | /// Reject `FixedSizeList` types whose dimension is not a positive integer.
  114 | ///
  115 | /// The row count of a fixed-size list is derived by dividing the number of
  116 | /// child items by the dimension, so a zero dimension panics with a
  117 | /// divide-by-zero further down the write path (see issue #5102). A
  118 | /// `FixedSizeList` of a `FixedSizeList` over a primitive collapses into a
  119 | /// single leaf field, so the pre-order field walk never visits the inner list;
  120 | /// recurse through the nested list types here to catch an inner zero dimension.
  121 | ///
  122 | /// Shared by [`Schema::validate`] on the write path and the decoder's
  123 | /// field-scheduler builders on the read path.
  124 | pub fn validate_fixed_size_list_dimensions(field_name: &str, data_type: &DataType) -> Result<()> {
  125 |     if let DataType::FixedSizeList(inner, dimension) = data_type {
  126 |         if *dimension <= 0 {
  127 |             return Err(Error::schema(format!(
  128 |                 "Field \"{field_name}\" contains a FixedSizeList with dimension {dimension}; dimension must be a positive integer"
  129 |             )));
  130 |         }
  131 |         validate_fixed_size_list_dimensions(field_name, inner.data_type())?;
  132 |     }
  133 |     Ok(())
  134 | }
  135 | 
  136 | impl Schema {
  137 |     /// The unenforced primary key fields in the schema, ordered by position.
  138 |     ///
  139 |     /// Fields with explicit positions (1, 2, 3, ...) are ordered by their position value.
  140 |     /// Fields without explicit positions (using the legacy boolean flag) are ordered
  141 |     /// by their schema field id and come after fields with explicit positions.
  142 |     pub fn unenforced_primary_key(&self) -> Vec<&Field> {
  143 |         let mut pk_fields: Vec<&Field> = self
  144 |             .fields_pre_order()
  145 |             .filter(|f| f.is_unenforced_primary_key())
  146 |             .collect();
  147 | 
  148 |         pk_fields.sort_by_key(|f| {
  149 |             let pk_position = f.unenforced_primary_key_position.unwrap_or(0);
  150 |             if pk_position > 0 {
  151 |                 (false, pk_position as i32, f.id)
  152 |             } else {
  153 |                 (true, f.id, f.id)
  154 |             }
  155 |         });
  156 | 
  157 |         pk_fields
  158 |     }
  159 | 
  160 |     /// The unenforced clustering key fields in the schema, ordered by position.
  161 |     ///
  162 |     /// Fields are ordered by their explicit position value (1-based).
  163 |     pub fn unenforced_clustering_key(&self) -> Vec<&Field> {
  164 |         let mut ck_fields: Vec<&Field> = self
  165 |             .fields_pre_order()
  166 |             .filter(|f| f.is_unenforced_clustering_key())
  167 |             .collect();
  168 | 
  169 |         ck_fields.sort_by_key(|f| f.unenforced_clustering_key_position.unwrap_or(0));
  170 | 
  171 |         ck_fields
  172 |     }
  173 | 
  174 |     pub fn compare_with_options(&self, expected: &Self, options: &SchemaCompareOptions) -> bool {
  175 |         compare_fields(&self.fields, &expected.fields, options)
  176 |             && (!options.compare_metadata || self.metadata == expected.metadata)
  177 |     }
  178 | 
  179 |     pub fn explain_difference(
  180 |         &self,
  181 |         expected: &Self,
  182 |         options: &SchemaCompareOptions,
  183 |     ) -> Option<String> {
  184 |         let mut differences =
  185 |             explain_fields_difference(&self.fields, &expected.fields, options, None);
  186 | 
  187 |         if options.compare_metadata
  188 |             && let Some(difference) =
  189 |                 explain_metadata_difference(&self.metadata, &expected.metadata)
  190 |         {
  191 |             differences.push(difference);
  192 |         }
  193 | 
  194 |         if differences.is_empty() {
  195 |             None
  196 |         } else {
  197 |             Some(differences.join(", "))
  198 |         }
  199 |     }
  200 | 
  201 |     pub fn has_dictionary_types(&self) -> bool {
  202 |         self.fields.iter().any(|f| f.has_dictionary_types())
  203 |     }
  204 | 
  205 |     pub fn check_compatible(&self, expected: &Self, options: &SchemaCompareOptions) -> Result<()> {
  206 |         if !self.compare_with_options(expected, options) {
  207 |             let difference = self.explain_difference(expected, options);
  208 |             // unknown reason is messy but this shouldn't happen.
  209 |             Err(Error::schema_mismatch(
  210 |                 difference.unwrap_or("unknown reason".to_string()),
  211 |             ))
  212 |         } else {
  213 |             Ok(())
  214 |         }
  215 |     }
  216 | 
  217 |     /// Convert to a compact string representation.
  218 |     ///
  219 |     /// This is intended for display purposes and not for serialization.
  220 |     pub fn to_compact_string(&self, indent: Indentation) -> String {
  221 |         ArrowSchema::from(self).to_compact_string(indent)
  222 |     }
  223 | 
  224 |     /// Given a string column reference, resolve the path of fields
  225 |     ///
  226 |     /// For example, given a.b.c we will return the fields [a, b, c]
  227 |     /// Field names containing dots must be quoted: parent."child.with.dot"
  228 |     ///
  229 |     /// Returns None if we can't find a segment at any point
  230 |     pub fn resolve(&self, column: impl AsRef<str>) -> Option<Vec<&Field>> {
  231 |         let split = parse_field_path(column.as_ref()).ok()?;
  232 |         if split.is_empty() {
  233 |             return None;
  234 |         }
  235 | 
  236 |         if split.len() == 1 {
  237 |             let field_name = &split[0];
  238 |             if let Some(field) = self.fields.iter().find(|f| &f.name == field_name) {
  239 |                 return Some(vec![field]);
  240 |             }
  241 |             return None;
  242 |         }
  243 | 
  244 |         // Multiple segments - resolve as a nested field path
  245 |         let mut fields = Vec::with_capacity(split.len());
  246 |         let first = &split[0];
  247 | 
  248 |         // Find the first field
  249 |         let field = self.fields.iter().find(|f| &f.name == first)?;
  250 | 
  251 |         let mut split_refs: VecDeque<&str> = split[1..].iter().map(|s| s.as_str()).collect();
  252 |         if field.resolve(&mut split_refs, &mut fields) {
  253 |             Some(fields)
  254 |         } else {
  255 |             None
  256 |         }
  257 |     }
  258 | 
  259 |     fn do_project<T: AsRef<str>>(
  260 |         &self,
  261 |         columns: &[T],
  262 |         err_on_missing: bool,
  263 |         preserve_system_columns: bool,
  264 |     ) -> Result<Self> {
  265 |         let mut candidates: Vec<Field> = vec![];
  266 |         for col in columns {
  267 |             let split = parse_field_path(col.as_ref())?;
  268 |             let first = split[0].as_str();
  269 |             if let Some(field) = self.field(first) {
  270 |                 let split_refs: Vec<&str> = split[1..].iter().map(|s| s.as_str()).collect();
  271 |                 let projected_field = field.project(&split_refs)?;
  272 |                 if let Some(candidate_field) = candidates.iter_mut().find(|f| f.name == first) {
  273 |                     candidate_field.merge(&projected_field)?;
  274 |                 } else {
  275 |                     candidates.push(projected_field)
  276 |                 }
  277 |             } else if crate::is_system_column(first) {
  278 |                 if preserve_system_columns {
  279 |                     if first == ROW_ID {
  280 |                         candidates.push(Field::try_from(ROW_ID_FIELD.clone())?);
  281 |                     } else if first == ROW_ADDR {
  282 |                         candidates.push(Field::try_from(ROW_ADDR_FIELD.clone())?);
  283 |                     } else if first == ROW_OFFSET {
  284 |                         candidates.push(Field::try_from(ROW_OFFSET_FIELD.clone())?);
  285 |                     } else if first == ROW_CREATED_AT_VERSION {
  286 |                         candidates.push(Field::try_from(ROW_CREATED_AT_VERSION_FIELD.clone())?);
  287 |                     } else if first == ROW_LAST_UPDATED_AT_VERSION {
  288 |                         candidates
  289 |                             .push(Field::try_from(ROW_LAST_UPDATED_AT_VERSION_FIELD.clone())?);
  290 |                     } else {
  291 |                         return Err(Error::schema(format!(
  292 |                             "System column {} is currently not supported in projection",
  293 |                             first
  294 |                         )));
  295 |                     }
  296 |                 }
  297 |             } else if err_on_missing {
  298 |                 return Err(Error::field_not_found(col.as_ref(), self.field_paths()));
  299 |             }
  300 |         }
  301 | 
  302 |         Ok(Self {
  303 |             fields: candidates,
  304 |             metadata: self.metadata.clone(),
  305 |         })
  306 |     }
  307 | 
  308 |     /// Project the columns over the schema.
  309 |     ///
  310 |     /// ```ignore
  311 |     /// let schema = Schema::from(...);
  312 |     /// let projected = schema.project(&["col1", "col2.sub_col3.field4"])?;
  313 |     /// ```
  314 |     pub fn project<T: AsRef<str>>(&self, columns: &[T]) -> Result<Self> {
  315 |         self.do_project(columns, true, false)
  316 |     }
  317 | 
  318 |     /// Project the columns over the schema, dropping unrecognized columns
  319 |     pub fn project_or_drop<T: AsRef<str>>(&self, columns: &[T]) -> Result<Self> {
  320 |         self.do_project(columns, false, false)
  321 |     }
  322 | 
  323 |     /// Project the columns over the schema, preserving system columns.
  324 |     pub fn project_preserve_system_columns<T: AsRef<str>>(&self, columns: &[T]) -> Result<Self> {
  325 |         self.do_project(columns, true, true)
  326 |     }
  327 | 
  328 |     /// Check that the top level fields don't contain `.` in their names
  329 |     /// to distinguish from nested fields.
  330 |     // TODO: pub(crate)
  331 |     pub fn validate(&self) -> Result<()> {
  332 |         let mut seen_names = HashSet::new();
  333 | 
  334 |         for field in self.fields.iter() {
  335 |             if field.name.contains('.') {
  336 |                 return Err(Error::schema(format!(
  337 |                     "Top level field {} cannot contain `.`. Maybe you meant to create a struct field?",
  338 |                     field.name.clone()
  339 |                 )));
  340 |             }
  341 | 
  342 |             if !seen_names.insert(field.name.as_str()) {
  343 |                 return Err(Error::schema(format!(
  344 |                     "Duplicate field name \"{}\" in schema:\n {:#?}",
  345 |                     field.name, self
  346 |                 )));
  347 |             }
  348 |         }
  349 | 
  350 |         // A negative id is reserved for system use; the only ones a schema may
  351 |         // carry are the hidden row lineage columns a data file stores next to
  352 |         // the user columns, as top-level fields under their own names. A
  353 |         // nested field reusing one of these ids fails the duplicate check.
  354 |         let row_lineage_ids = self
  355 |             .fields
  356 |             .iter()
  357 |             .filter(|field| crate::row_lineage_field_id(&field.name) == Some(field.id))
  358 |             .map(|field| field.id)
  359 |             .collect::<HashSet<_>>();
  360 | 
  361 |         // Check for duplicate field ids
  362 |         let mut seen_ids = HashSet::new();
  363 |         for field in self.fields_pre_order() {
  364 |             if field.id < 0 && !row_lineage_ids.contains(&field.id) {
  365 |                 return Err(Error::schema(format!(
  366 |                     "Field {} has a negative id {}",
  367 |                     field.name, field.id
  368 |                 )));
  369 |             }
  370 |             if !seen_ids.insert(field.id) {
  371 |                 return Err(Error::schema(format!(
  372 |                     "Duplicate field id {} in schema {:?}",
  373 |                     field.id, self
  374 |                 )));
  375 |             }
  376 |             // The row count of a fixed-size list is derived by dividing the
  377 |             // number of items by the dimension, so a zero dimension would
  378 |             // panic with a divide-by-zero further down the write path.
  379 |             validate_fixed_size_list_dimensions(&field.name, &field.data_type())?;
  380 |         }
  381 | 
  382 |         Ok(())
  383 |     }
  384 | 
  385 |     /// Intersection between two [`Schema`].
  386 |     pub fn intersection(&self, other: &Self) -> Result<Self> {
  387 |         self.do_intersection(other, false)
  388 |     }
  389 | 
  390 |     /// Intersection between two [`Schema`], ignoring data types.
  391 |     pub fn intersection_ignore_types(&self, other: &Self) -> Result<Self> {
  392 |         self.do_intersection(other, true)
  393 |     }
  394 | 
  395 |     fn do_intersection(&self, other: &Self, ignore_types: bool) -> Result<Self> {
  396 |         let mut candidates: Vec<Field> = vec![];
  397 |         for field in other.fields.iter() {
  398 |             if let Some(candidate_field) = self.field(&field.name) {
  399 |                 candidates.push(candidate_field.do_intersection(field, ignore_types)?);
  400 |             }
  401 |         }
  402 | 
  403 |         Ok(Self {
  404 |             fields: candidates,
  405 |             metadata: self.metadata.clone(),
  406 |         })
  407 |     }
  408 | 
  409 |     /// Iterates over the fields using a pre-order traversal
  410 |     ///
  411 |     /// This is a DFS traversal where the parent is visited
  412 |     /// before its children
  413 |     pub fn fields_pre_order(&self) -> impl Iterator<Item = &Field> {
  414 |         SchemaFieldIterPreOrder::new(self)
  415 |     }
  416 | 
  417 |     /// Get all field paths in the schema as a list of strings.
  418 |     ///
  419 |     /// This returns all field paths in the schema, including nested fields.
  420 |     /// For example, if there's a struct field "user" with a field "name",
  421 |     /// this will return "user.name" as one of the paths.
  422 |     pub fn field_paths(&self) -> Vec<String> {
  423 |         let mut paths = Vec::new();
  424 |         for field in self.fields_pre_order() {
  425 |             let ancestry = self.field_ancestry_by_id(field.id);
  426 |             if let Some(ancestry) = ancestry {
  427 |                 let path = ancestry
  428 |                     .iter()
  429 |                     .map(|f| f.name.as_str())
  430 |                     .collect::<Vec<_>>()
  431 |                     .join(".");
  432 |                 paths.push(path);
  433 |             }
  434 |         }
  435 |         paths
  436 |     }
  437 | 
  438 |     /// Returns a new schema that only contains the fields in `column_ids`.
  439 |     ///
  440 |     /// This projection can filter out both top-level and nested fields
  441 |     ///
  442 |     /// If `include_all_children` is true, then if a parent field id is passed,
  443 |     /// then all children of that field will be included in the projection
  444 |     /// regardless of whether their ids were passed. If this is false, then
  445 |     /// only the child fields with the passed ids will be included.
  446 |     pub fn project_by_ids(&self, column_ids: &[i32], include_all_children: bool) -> Self {
  447 |         let filtered_fields = self
  448 |             .fields
  449 |             .iter()
  450 |             .filter_map(|f| f.project_by_ids(column_ids, include_all_children))
  451 |             .collect();
  452 |         Self {
  453 |             fields: filtered_fields,
  454 |             metadata: self.metadata.clone(),
  455 |         }
  456 |     }
  457 | 
  458 |     fn apply_projection(&self, projection: &Projection) -> Self {
  459 |         let filtered_fields = self
  460 |             .fields
  461 |             .iter()
  462 |             .filter_map(|f| f.apply_projection(projection))
  463 |             .collect();
  464 |         Self {
  465 |             fields: filtered_fields,
  466 |             metadata: self.metadata.clone(),
  467 |         }
  468 |     }
  469 | 
  470 |     /// Project the schema by another schema, and preserves field metadata, i.e., Field IDs.
  471 |     ///
  472 |     /// Parameters
  473 |     /// - `projection`: The schema to project by. Can be [`arrow_schema::Schema`] or [`Schema`].
  474 |     pub fn project_by_schema<S: TryInto<Self, Error = Error>>(
  475 |         &self,
  476 |         projection: S,
  477 |         on_missing: OnMissing,
  478 |         on_type_mismatch: OnTypeMismatch,
  479 |     ) -> Result<Self> {
  480 |         let projection = projection.try_into()?;
  481 |         let mut new_fields = vec![];
  482 |         for field in projection.fields.iter() {
  483 |             // Ensure the field is a top-level field (no dots in the name)
  484 |             if field.name.contains('.') {
  485 |                 return Err(Error::schema(format!(
  486 |                     "Field '{}' contains dots. project_by_schema only accepts top-level fields. \
  487 |                      Use project() method for nested field paths.",
  488 |                     field.name
  489 |                 )));
  490 |             }
  491 | 
  492 |             if let Some(self_field) = self.field(&field.name) {
  493 |                 new_fields.push(self_field.project_by_field(field, on_type_mismatch)?);
  494 |             } else if matches!(on_missing, OnMissing::Error) {
  495 |                 return Err(Error::schema(format!("Field {} not found", field.name)));
  496 |             }
  497 |         }
  498 |         Ok(Self {
  499 |             fields: new_fields,
  500 |             metadata: self.metadata.clone(),
  501 |         })
  502 |     }
  503 | 
  504 |     /// Exclude the fields from `other` Schema, and returns a new Schema.
  505 |     pub fn exclude<T: TryInto<Self> + Debug>(&self, schema: T) -> Result<Self> {
  506 |         let other = schema.try_into().map_err(|_| {
  507 |             Error::schema("The other schema is not compatible with this schema".to_string())
  508 |         })?;
  509 |         let mut fields = vec![];
  510 |         for field in self.fields.iter() {
  511 |             if let Some(other_field) = other.field(&field.name) {
  512 |                 if field.data_type().is_nested()
  513 |                     && let Some(f) = field.exclude(other_field)
  514 |                 {
  515 |                     fields.push(f)
  516 |                 }
  517 |             } else {
  518 |                 fields.push(field.clone());
  519 |             }
  520 |         }
  521 |         Ok(Self {
  522 |             fields,
  523 |             metadata: self.metadata.clone(),
  524 |         })
  525 |     }
  526 | 
  527 |     /// Get a field by its path. Return `None` if the field does not exist.
  528 |     /// Field names containing dots must be quoted: parent."child.with.dot"
  529 |     pub fn field(&self, name: &str) -> Option<&Field> {
  530 |         self.resolve(name).and_then(|fields| fields.last().copied())
  531 |     }
  532 | 
  533 |     /// Get a field by its path, with case-insensitive matching.
  534 |     ///
  535 |     /// This first tries an exact match, then falls back to case-insensitive matching.
  536 |     /// Returns the actual field from the schema (preserving original case).
  537 |     /// Field names containing dots must be quoted: parent."child.with.dot"
  538 |     pub fn field_case_insensitive(&self, name: &str) -> Option<&Field> {
  539 |         self.resolve_case_insensitive(name)
  540 |             .and_then(|fields| fields.last().copied())
  541 |     }
  542 | 
  543 |     /// Given a string column reference, resolve the path of fields with case-insensitive matching.
  544 |     ///
  545 |     /// This first tries an exact match, then falls back to case-insensitive matching.
  546 |     /// Returns the actual fields from the schema (preserving original case).
  547 |     pub fn resolve_case_insensitive(&self, column: impl AsRef<str>) -> Option<Vec<&Field>> {
  548 |         let split = parse_field_path(column.as_ref()).ok()?;
  549 |         if split.is_empty() {
  550 |             return None;
  551 |         }
  552 | 
  553 |         if split.len() == 1 {
  554 |             let field_name = &split[0];
  555 |             // Try exact match first
  556 |             if let Some(field) = self.fields.iter().find(|f| &f.name == field_name) {
  557 |                 return Some(vec![field]);
  558 |             }
  559 |             // Fall back to case-insensitive match
  560 |             if let Some(field) = self
  561 |                 .fields
  562 |                 .iter()
  563 |                 .find(|f| f.name.eq_ignore_ascii_case(field_name))
  564 |             {
  565 |                 return Some(vec![field]);
  566 |             }
  567 |             return None;
  568 |         }
  569 | 
  570 |         // Multiple segments - resolve as a nested field path
  571 |         let mut fields = Vec::with_capacity(split.len());
  572 |         let first = &split[0];
  573 | 
  574 |         // Find the first field (try exact match, then case-insensitive)
  575 |         let field = self.fields.iter().find(|f| &f.name == first).or_else(|| {
  576 |             self.fields
  577 |                 .iter()
  578 |                 .find(|f| f.name.eq_ignore_ascii_case(first))
  579 |         })?;
  580 | 
  581 |         let mut split_refs: VecDeque<&str> = split[1..].iter().map(|s| s.as_str()).collect();
  582 |         if field.resolve_case_insensitive(&mut split_refs, &mut fields) {
  583 |             Some(fields)
  584 |         } else {
  585 |             None
  586 |         }
  587 |     }
  588 | 
  589 |     // TODO: This is not a public API, change to pub(crate) after refactor is done.
  590 |     pub fn field_id(&self, column: &str) -> Result<i32> {
  591 |         self.field(column)
  592 |             .map(|f| f.id)
  593 |             .ok_or_else(|| Error::schema("Vector column not in schema".to_string()))
  594 |     }
  595 | 
  596 |     pub fn top_level_field_ids(&self) -> Vec<i32> {
  597 |         self.fields.iter().map(|f| f.id).collect()
  598 |     }
  599 | 
  600 |     // Recursively collect all the field IDs, in pre-order traversal order.
  601 |     // TODO: pub(crate)
  602 |     pub fn field_ids(&self) -> Vec<i32> {
  603 |         self.fields_pre_order().map(|f| f.id).collect()
  604 |     }
  605 | 
  606 |     /// Get field by its id.
  607 |     pub fn field_by_id_mut(&mut self, id: impl Into<i32>) -> Option<&mut Field> {
  608 |         let id = id.into();
  609 |         for field in self.fields.iter_mut() {
  610 |             if field.id == id {
  611 |                 return Some(field);
  612 |             }
  613 |             if let Some(grandchild) = field.field_by_id_mut(id) {
  614 |                 return Some(grandchild);
  615 |             }
  616 |         }
  617 |         None
  618 |     }
  619 | 
  620 |     pub fn field_by_id(&self, id: impl Into<i32>) -> Option<&Field> {
  621 |         let id = id.into();
  622 |         for field in self.fields.iter() {
  623 |             if field.id == id {
  624 |                 return Some(field);
  625 |             }
  626 |             if let Some(grandchild) = field.field_by_id(id) {
  627 |                 return Some(grandchild);
  628 |             }
  629 |         }
  630 |         None
  631 |     }
  632 | 
  633 |     /// Get the sequence of fields from the root to the field with the given id.
  634 |     pub fn field_ancestry_by_id(&self, id: i32) -> Option<Vec<&Field>> {
  635 |         let mut to_visit = self.fields.iter().map(|f| vec![f]).collect::<Vec<_>>();
  636 |         while let Some(path) = to_visit.pop() {
  637 |             let field = path.last().unwrap();
  638 |             if field.id == id {
  639 |                 return Some(path);
  640 |             }
  641 |             for child in field.children.iter() {
  642 |                 let mut new_path = path.clone();
  643 |                 new_path.push(child);
  644 |                 to_visit.push(new_path);
  645 |             }
  646 |         }
  647 |         None
  648 |     }
  649 | 
  650 |     pub fn mut_field_by_id(&mut self, id: impl Into<i32>) -> Option<&mut Field> {
  651 |         let id = id.into();
  652 |         for field in self.fields.as_mut_slice() {
  653 |             if field.id == id {
  654 |                 return Some(field);
  655 |             }
  656 |             if let Some(grandchild) = field.mut_field_by_id(id) {
  657 |                 return Some(grandchild);
  658 |             }
  659 |         }
  660 |         None
  661 |     }
  662 | 
  663 |     // TODO: pub(crate)
  664 |     /// Get the maximum field id in the schema.
  665 |     ///
  666 |     /// Note: When working with Datasets, you should prefer `Manifest::max_field_id()`
  667 |     /// over this method. This method does not take into account the field IDs
  668 |     /// of dropped fields.
  669 |     pub fn max_field_id(&self) -> Option<i32> {
  670 |         self.fields.iter().map(|f| f.max_id()).max()
  671 |     }
  672 | 
  673 |     /// Recursively attach set up dictionary values to the dictionary fields.
  674 |     // TODO: pub(crate)
  675 |     pub fn set_dictionary(&mut self, batch: &RecordBatch) -> Result<()> {
  676 |         for field in self.fields.as_mut_slice() {
  677 |             let column = batch.column_by_name(&field.name).ok_or_else(|| {
  678 |                 Error::schema(format!(
  679 |                     "column '{}' does not exist in the record batch",
  680 |                     field.name
  681 |                 ))
  682 |             })?;
  683 |             field.set_dictionary(column);
  684 |         }
  685 |         Ok(())
  686 |     }
  687 | 
  688 |     /// Walk through the fields and assign a new field id to each field that does
  689 |     /// not have one (e.g. is set to -1)
  690 |     ///
  691 |     /// If this schema is on an existing dataset, pass the result of
  692 |     /// `Manifest::max_field_id` to `max_existing_id`. If for some reason that
  693 |     /// id is lower than the maximum field id in this schema, the field IDs will
  694 |     /// be reassigned starting from the maximum field id in this schema.
  695 |     ///
  696 |     /// If this schema is not associated with a dataset, pass `None` to
  697 |     /// `max_existing_id`. This is the same as passing [Self::max_field_id()].
  698 |     pub fn set_field_id(&mut self, max_existing_id: Option<i32>) {
  699 |         let schema_max_id = self.max_field_id().unwrap_or(-1);
  700 |         let max_existing_id = max_existing_id.unwrap_or(-1);
  701 |         let mut current_id = schema_max_id.max(max_existing_id) + 1;
  702 |         self.fields
  703 |             .iter_mut()
  704 |             .for_each(|f| f.set_id(-1, &mut current_id));
  705 |     }
  706 | 
  707 |     fn reset_id(&mut self) {
  708 |         self.fields.iter_mut().for_each(|f| f.reset_id());
  709 |     }
  710 | 
  711 |     /// Create a new schema by adding fields to the end of this schema
  712 |     pub fn extend(&mut self, fields: &[ArrowField]) -> Result<()> {
  713 |         let new_fields = fields
  714 |             .iter()
  715 |             .map(Field::try_from)
  716 |             .collect::<Result<Vec<_>>>()?;
  717 |         self.fields.extend(new_fields);
  718 |         // Validate this addition does not create any duplicate field names
  719 |         let field_names = self.fields.iter().map(|f| &f.name).collect::<HashSet<_>>();
  720 |         if field_names.len() != self.fields.len() {
  721 |             Err(Error::internal(format!(
  722 |                 "Attempt to add fields [{:?}] would lead to duplicate field names",
  723 |                 fields.iter().map(|f| f.name()).collect::<Vec<_>>()
  724 |             )))
  725 |         } else {
  726 |             Ok(())
  727 |         }
  728 |     }
  729 | 
  730 |     /// Merge this schema from the other schema.
  731 |     ///
  732 |     /// After merging, the field IDs from `other` schema will be reassigned,
  733 |     /// following the fields in `self`. Schema metadata is combined, with values
  734 |     /// from `self` taking precedence when both schemas contain the same key.
  735 |     pub fn merge<S: TryInto<Self, Error = Error>>(&self, other: S) -> Result<Self> {
  736 |         let mut other: Self = other.try_into()?;
  737 |         other.reset_id();
  738 | 
  739 |         let mut merged_fields: Vec<Field> = vec![];
  740 |         for mut field in self.fields.iter().cloned() {
  741 |             if let Some(other_field) = other.field(&field.name) {
  742 |                 // if both are struct types, then merge the fields
  743 |                 field.merge(other_field)?;
  744 |             }
  745 |             merged_fields.push(field);
  746 |         }
  747 | 
  748 |         // we already checked for overlap so just need to add new top-level fields
  749 |         // in the incoming schema
  750 |         for field in other.fields.as_slice() {
  751 |             if !merged_fields.iter().any(|f| f.name == field.name) {
  752 |                 merged_fields.push(field.clone());
  753 |             }
  754 |         }
  755 |         let mut metadata = other.metadata;
  756 |         metadata.extend(
  757 |             self.metadata
  758 |                 .iter()
  759 |                 .map(|(key, value)| (key.clone(), value.clone())),
  760 |         );
  761 |         let schema = Self {
  762 |             fields: merged_fields,
  763 |             metadata,
  764 |         };
  765 |         Ok(schema)
  766 |     }
  767 | 
  768 |     /// Returns the properly formatted path from root to the field.
  769 |     /// Field names containing dots are quoted (e.g., struct.`field.with.dot`)
  770 |     ///
  771 |     /// The result is suitable for SQL parsing. For a human-readable path
  772 |     /// (e.g. for display in index metadata), use [`Self::field_path_minimal`].
  773 |     pub fn field_path(&self, field_id: i32) -> Result<String> {
  774 |         self.field_ancestry_by_id(field_id)
  775 |             .map(|ancestry| {
  776 |                 let field_refs: Vec<&str> = ancestry.iter().map(|f| f.name.as_str()).collect();
  777 |                 format_field_path(&field_refs)
  778 |             })
  779 |             .ok_or_else(|| {
  780 |                 Error::index(format!("Could not find field ancestry for id {}", field_id))
  781 |             })
  782 |     }
  783 | 
  784 |     /// Returns the path from root to the field using *minimal* quoting.
  785 |     ///
  786 |     /// A segment is wrapped in backticks only when it contains a character that
  787 |     /// [`parse_field_path`] treats specially (a `.` separator or a `` ` `` quote);
  788 |     /// any other character — including hyphens — is left bare. Unlike
  789 |     /// [`Self::field_path`] (which quotes for SQL-expression safety and so wraps
  790 |     /// e.g. `my-col` in backticks), the result here is both human-readable and
  791 |     /// round-trips back through `parse_field_path`, so it is safe to feed into
  792 |     /// field-path APIs such as `drop_columns` / `update_field_metadata`.
  793 |     ///
  794 |     /// This is what should be exposed as the column name in index metadata.
  795 |     ///
  796 |     /// ```
  797 |     /// use arrow_schema::{DataType, Field, Fields, Schema as ArrowSchema};
  798 |     /// use lance_core::datatypes::{parse_field_path, Schema};
  799 |     ///
  800 |     /// let arrow = ArrowSchema::new(vec![
  801 |     ///     Field::new("my-col", DataType::Int32, false),
  802 |     ///     Field::new(
  803 |     ///         "parent",
  804 |     ///         DataType::Struct(Fields::from(vec![Field::new("child.x", DataType::Int32, true)])),
  805 |     ///         true,
  806 |     ///     ),
  807 |     /// ]);
  808 |     /// let schema = Schema::try_from(&arrow).unwrap();
  809 |     ///
  810 |     /// // A hyphen is not special to `parse_field_path`, so it is left bare
  811 |     /// // (unlike `field_path`, which would quote it as `` `my-col` ``).
  812 |     /// let hyphen_id = schema.field("my-col").unwrap().id;
  813 |     /// assert_eq!(schema.field_path_minimal(hyphen_id).unwrap(), "my-col");
  814 |     ///
  815 |     /// // A `.` in a segment forces quoting so the path still round-trips.
  816 |     /// let dotted_id = schema.field("parent").unwrap().children[0].id;
  817 |     /// let path = schema.field_path_minimal(dotted_id).unwrap();
  818 |     /// assert_eq!(path, "parent.`child.x`");
  819 |     /// assert_eq!(
  820 |     ///     parse_field_path(&path).unwrap(),
  821 |     ///     vec!["parent".to_string(), "child.x".to_string()],
  822 |     /// );
  823 |     /// ```
  824 |     pub fn field_path_minimal(&self, field_id: i32) -> Result<String> {
  825 |         self.field_ancestry_by_id(field_id)
  826 |             .map(|ancestry| {
  827 |                 let field_refs: Vec<&str> = ancestry.iter().map(|f| f.name.as_str()).collect();
  828 |                 format_field_path_minimal(&field_refs)
  829 |             })
  830 |             .ok_or_else(|| {
  831 |                 Error::index(format!("Could not find field ancestry for id {}", field_id))
  832 |             })
  833 |     }
  834 | 
  835 |     pub fn verify_primary_key(&self) -> Result<()> {
  836 |         let pk = self.unenforced_primary_key();
  837 |         for pk_col in pk.into_iter() {
  838 |             if !pk_col.is_leaf() {
  839 |                 return Err(Error::schema(format!(
  840 |                     "Primary key column must be a leaf: {}",
  841 |                     pk_col
  842 |                 )));
  843 |             }
  844 | 
  845 |             if let Some(ancestors) = self.field_ancestry_by_id(pk_col.id) {
  846 |                 for ancestor in ancestors {
  847 |                     if ancestor.nullable {
  848 |                         return Err(Error::schema(format!(
  849 |                             "Primary key column and all its ancestors must not be nullable: {}",
  850 |                             ancestor
  851 |                         )));
  852 |                     }
  853 | 
  854 |                     if ancestor.logical_type.is_list() || ancestor.logical_type.is_large_list() {
  855 |                         return Err(Error::schema(format!(
  856 |                             "Primary key column must not be in a list type: {}",
  857 |                             ancestor
  858 |                         )));
  859 |                     }
  860 | 
  861 |                     if ancestor.logical_type.is_map() {
  862 |                         return Err(Error::schema(format!(
  863 |                             "Primary key column must not be in a map type: {}",
  864 |                             ancestor
  865 |                         )));
  866 |                     }
  867 |                 }
  868 |             }
  869 |         }
  870 |         Ok(())
  871 |     }
  872 | }
  873 | 
  874 | impl PartialEq for Schema {
  875 |     fn eq(&self, other: &Self) -> bool {
  876 |         self.fields == other.fields
  877 |     }
  878 | }
  879 | 
  880 | impl fmt::Display for Schema {
  881 |     fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
  882 |         for field in self.fields.iter() {
  883 |             writeln!(f, "{field}")?
  884 |         }
  885 |         Ok(())
  886 |     }
  887 | }
  888 | 
  889 | /// Convert `arrow2::datatype::Schema` to Lance
  890 | impl TryFrom<&ArrowSchema> for Schema {
  891 |     type Error = Error;
  892 | 
  893 |     fn try_from(schema: &ArrowSchema) -> Result<Self> {
  894 |         let mut schema = Self {
  895 |             fields: schema
  896 |                 .fields
  897 |                 .iter()
  898 |                 .map(|f| Field::try_from(f.as_ref()))
  899 |                 .collect::<Result<_>>()?,
  900 |             metadata: schema.metadata.clone(),
  901 |         };
  902 |         schema.set_field_id(None);
  903 |         schema.validate()?;
  904 | 
  905 |         schema.verify_primary_key()?;
  906 | 
  907 |         Ok(schema)
  908 |     }
  909 | }
  910 | 
  911 | /// Convert Lance Schema to Arrow Schema
  912 | impl From<&Schema> for ArrowSchema {
  913 |     fn from(schema: &Schema) -> Self {
  914 |         Self {
  915 |             fields: schema.fields.iter().map(ArrowField::from).collect(),
  916 |             metadata: schema.metadata.clone(),
  917 |         }
  918 |     }
  919 | }
  920 | 
  921 | /// Make API cleaner to accept both [`Schema`] and Arrow Schema.
  922 | impl TryFrom<&Self> for Schema {
  923 |     type Error = Error;
  924 | 
  925 |     fn try_from(schema: &Self) -> Result<Self> {
  926 |         Ok(schema.clone())
  927 |     }
  928 | }
  929 | 
  930 | pub fn compare_fields(
  931 |     fields: &[Field],
  932 |     expected: &[Field],
  933 |     options: &SchemaCompareOptions,
  934 | ) -> bool {
  935 |     if options.allow_missing_if_nullable || options.ignore_field_order || options.allow_subschema {
  936 |         let expected_names = expected
  937 |             .iter()
  938 |             .map(|f| f.name.as_str())
  939 |             .collect::<HashSet<_>>();
  940 |         for field in fields {
  941 |             if !expected_names.contains(field.name.as_str()) {
  942 |                 // Extra field
  943 |                 return false;
  944 |             }
  945 |         }
  946 | 
  947 |         let field_mapping = fields
  948 |             .iter()
  949 |             .enumerate()
  950 |             .map(|(pos, f)| (f.name.as_str(), (f, pos)))
  951 |             .collect::<HashMap<_, _>>();
  952 |         let mut cumulative_position = 0;
  953 |         for expected_field in expected {
  954 |             if let Some((field, pos)) = field_mapping.get(expected_field.name.as_str()) {
  955 |                 if !field.compare_with_options(expected_field, options) {
  956 |                     return false;
  957 |                 }
  958 |                 if !options.ignore_field_order && *pos < cumulative_position {
  959 |                     return false;
  960 |                 }
  961 |                 cumulative_position = *pos;
  962 |             } else if options.allow_subschema {
  963 |                 // allow_subschema: allow missing any field
  964 |                 continue;
  965 |             } else if options.allow_missing_if_nullable && expected_field.nullable {
  966 |                 continue;
  967 |             } else {
  968 |                 return false;
  969 |             }
  970 |         }
  971 |         true
  972 |     } else {
  973 |         // Fast path: we can just zip
  974 |         fields.len() == expected.len()
  975 |             && fields
  976 |                 .iter()
  977 |                 .zip(expected.iter())
  978 |                 .all(|(lhs, rhs)| lhs.compare_with_options(rhs, options))
  979 |     }
  980 | }
  981 | 
  982 | pub fn explain_fields_difference(
  983 |     fields: &[Field],
  984 |     expected: &[Field],
  985 |     options: &SchemaCompareOptions,
  986 |     path: Option<&str>,
  987 | ) -> Vec<String> {
  988 |     let field_names = fields
  989 |         .iter()
  990 |         .map(|f| f.name.as_str())
  991 |         .collect::<HashSet<_>>();
  992 |     let expected_names = expected
  993 |         .iter()
  994 |         .map(|f| f.name.as_str())
  995 |         .collect::<HashSet<_>>();
  996 | 
  997 |     let prepend_path = |f: &str| {
  998 |         if let Some(path) = path {
  999 |             format!("{}.{}", path, f)
 1000 |         } else {
 1001 |             f.to_string()
 1002 |         }
 1003 |     };
 1004 | 
 1005 |     // Check there are no extra fields or missing fields
 1006 |     let unexpected_fields = field_names
 1007 |         .difference(&expected_names)
 1008 |         .cloned()
 1009 |         .map(prepend_path)
 1010 |         .collect::<Vec<_>>();
 1011 |     let missing_fields = expected_names.difference(&field_names);
 1012 |     let missing_fields = if options.allow_subschema {
 1013 |         // allow_subschema: don't report any missing fields
 1014 |         Vec::new()
 1015 |     } else if options.allow_missing_if_nullable {
 1016 |         missing_fields
 1017 |             .filter(|f| {
 1018 |                 let expected_field = expected.iter().find(|ef| ef.name == **f).unwrap();
 1019 |                 !expected_field.nullable
 1020 |             })
 1021 |             .cloned()
 1022 |             .map(prepend_path)
 1023 |             .collect::<Vec<_>>()
 1024 |     } else {
 1025 |         missing_fields
 1026 |             .cloned()
 1027 |             .map(prepend_path)
 1028 |             .collect::<Vec<_>>()
 1029 |     };
 1030 | 
 1031 |     let mut differences = vec![];
 1032 |     if !missing_fields.is_empty() || !unexpected_fields.is_empty() {
 1033 |         differences.push(format!(
 1034 |             "fields did not match, missing=[{}], unexpected=[{}]",
 1035 |             missing_fields.join(", "),
 1036 |             unexpected_fields.join(", ")
 1037 |         ));
 1038 |     }
 1039 | 
 1040 |     // Map the expected fields to position of field
 1041 |     let field_mapping = expected
 1042 |         .iter()
 1043 |         .filter_map(|ef| {
 1044 |             fields
 1045 |                 .iter()
 1046 |                 .position(|f| ef.name == f.name)
 1047 |                 .map(|pos| (ef, pos))
 1048 |         })
 1049 |         .collect::<Vec<_>>();
 1050 | 
 1051 |     // Check the fields are in the same order
 1052 |     if !options.ignore_field_order {
 1053 |         let fields_out_of_order = field_mapping.windows(2).any(|w| w[0].1 > w[1].1);
 1054 |         if fields_out_of_order {
 1055 |             let expected_order = expected.iter().map(|f| f.name.as_str()).collect::<Vec<_>>();
 1056 |             let actual_order = fields.iter().map(|f| f.name.as_str()).collect::<Vec<_>>();
 1057 |             differences.push(format!(
 1058 |                 "fields in different order, expected: [{}], actual: [{}]",
 1059 |                 expected_order.join(", "),
 1060 |                 actual_order.join(", ")
 1061 |             ));
 1062 |         }
 1063 |     }
 1064 | 
 1065 |     // Check for individual differences in the fields
 1066 |     for (expected_field, field_pos) in field_mapping.iter() {
 1067 |         let field = &fields[*field_pos];
 1068 |         debug_assert_eq!(field.name, expected_field.name);
 1069 |         let field_diffs = field.explain_differences(expected_field, options, path);
 1070 |         if !field_diffs.is_empty() {
 1071 |             differences.push(field_diffs.join(", "))
 1072 |         }
 1073 |     }
 1074 | 
 1075 |     differences
 1076 | }
 1077 | 
 1078 | fn explain_metadata_difference(
 1079 |     metadata: &HashMap<String, String>,
 1080 |     expected: &HashMap<String, String>,
 1081 | ) -> Option<String> {
 1082 |     if metadata != expected {
 1083 |         Some(format!(
 1084 |             "metadata did not match, expected: {:?}, actual: {:?}",
 1085 |             expected, metadata
 1086 |         ))
 1087 |     } else {
 1088 |         None
 1089 |     }
 1090 | }
 1091 | 
 1092 | /// What to do when a column is missing in the schema
 1093 | #[derive(Debug, Clone, Copy, PartialEq, Eq)]
 1094 | pub enum OnMissing {
 1095 |     Error,
 1096 |     Ignore,
 1097 | }
 1098 | 
 1099 | /// A trait for something that we can project fields from.
 1100 | pub trait Projectable: Debug + Send + Sync {
 1101 |     fn schema(&self) -> &Schema;
 1102 | }
 1103 | 
 1104 | impl Projectable for Schema {
 1105 |     fn schema(&self) -> &Schema {
 1106 |         self
 1107 |     }
 1108 | }
 1109 | 
 1110 | /// Specifies how to handle blob columns when projecting
 1111 | #[derive(Debug, Clone, Default, PartialEq)]
 1112 | pub enum BlobHandling {
 1113 |     /// Read all blobs as binary
 1114 |     AllBinary,
 1115 |     #[default]
 1116 |     /// Read all blobs as descriptions and other binary columns as binary
 1117 |     BlobsDescriptions,
 1118 |     /// Read all binary columns as descriptions
 1119 |     AllDescriptions,
 1120 |     /// Read specific blobs as binary and the rest as descriptions
 1121 |     ///
 1122 |     /// Non-blob binary columns will be read as binary
 1123 |     ///
 1124 |     /// The set contains the field ids that should be read as binary
 1125 |     SomeBlobsBinary(HashSet<u32>),
 1126 |     /// Read specific columns as binary and all other binary columns as descriptions
 1127 |     ///
 1128 |     /// The set contains the field ids that should be read as binary
 1129 |     SomeBinary(HashSet<u32>),
 1130 | }
 1131 | 
 1132 | impl BlobHandling {
 1133 |     fn should_load_binary(&self, field: &Field) -> bool {
 1134 |         if !field.is_blob() {
 1135 |             return false;
 1136 |         }
 1137 |         match self {
 1138 |             Self::AllBinary => true,
 1139 |             Self::SomeBlobsBinary(set) | Self::SomeBinary(set) => set.contains(&(field.id as u32)),
 1140 |             Self::BlobsDescriptions | Self::AllDescriptions => false,
 1141 |         }
 1142 |     }
 1143 | 
 1144 |     fn should_unload(&self, field: &Field) -> bool {
 1145 |         // Blob v2 columns are Structs, so we need to treat any blob-marked field as unloadable
 1146 |         // even if the physical data type is not binary-like.
 1147 |         if !(field.data_type().is_binary_like() || field.is_blob()) {
 1148 |             return false;
 1149 |         }
 1150 |         match self {
 1151 |             Self::AllBinary => false,
 1152 |             Self::BlobsDescriptions => field.is_blob(),
 1153 |             Self::AllDescriptions => true,
 1154 |             Self::SomeBlobsBinary(set) => field.is_blob() && !set.contains(&(field.id as u32)),
 1155 |             Self::SomeBinary(set) => !set.contains(&(field.id as u32)),
 1156 |         }
 1157 |     }
 1158 | 
 1159 |     /// Whether `field` will be projected as a lightweight blob *description*
 1160 |     /// (offset + size) rather than its full binary value under this handling.
 1161 |     ///
 1162 |     /// A description is tiny and cheap to read eagerly; the full binary value is
 1163 |     /// not. Materialization heuristics use this to decide early vs late loading.
 1164 |     pub fn returns_description(&self, field: &Field) -> bool {
 1165 |         self.should_unload(field)
 1166 |     }
 1167 | 
 1168 |     /// Apply this blob handling policy to a projected field tree.
 1169 |     ///
 1170 |     /// Blob descriptor modes convert blob leaves to descriptor views. Binary
 1171 |     /// modes convert selected blob leaves to `LargeBinary`. Non-blob nested
 1172 |     /// fields are preserved while their children are handled recursively.
 1173 |     pub fn unload_if_needed(&self, mut field: Field) -> Field {
 1174 |         if self.should_load_binary(&field) {
 1175 |             field.binary_blob_mut();
 1176 |             return field;
 1177 |         }
 1178 |         if self.should_unload(&field) {
 1179 |             field.unloaded_mut();
 1180 |             return field;
 1181 |         }
 1182 |         field.children = field
 1183 |             .children
 1184 |             .into_iter()
 1185 |             .map(|child| self.unload_if_needed(child))
 1186 |             .collect();
 1187 |         field
 1188 |     }
 1189 | }
 1190 | 
 1191 | /// A projection is a selection of fields in a schema
 1192 | ///
 1193 | /// In addition we record whether the row_id or row_addr are
 1194 | /// selected (these fields have no field id)
 1195 | #[derive(Clone)]
 1196 | pub struct Projection {
 1197 |     base: Arc<dyn Projectable>,
 1198 |     pub field_ids: HashSet<i32>,
 1199 |     pub with_row_id: bool,
 1200 |     pub with_row_addr: bool,
 1201 |     pub with_row_last_updated_at_version: bool,
 1202 |     pub with_row_created_at_version: bool,
 1203 |     pub blob_handling: BlobHandling,
 1204 | }
 1205 | 
 1206 | impl Debug for Projection {
 1207 |     fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
 1208 |         f.debug_struct("Projection")
 1209 |             .field("field_ids", &self.field_ids)
 1210 |             .field("with_row_id", &self.with_row_id)
 1211 |             .field("with_row_addr", &self.with_row_addr)
 1212 |             .field(
 1213 |                 "with_row_last_updated_at_version",
 1214 |                 &self.with_row_last_updated_at_version,
 1215 |             )
 1216 |             .field(
 1217 |                 "with_row_created_at_version",
 1218 |                 &self.with_row_created_at_version,
 1219 |             )
 1220 |             .field("blob_handling", &self.blob_handling)
 1221 |             .finish()
 1222 |     }
 1223 | }
 1224 | 
 1225 | impl Projection {
 1226 |     /// Create a new empty projection
 1227 |     pub fn empty(base: Arc<dyn Projectable>) -> Self {
 1228 |         Self {
 1229 |             base,
 1230 |             field_ids: HashSet::new(),
 1231 |             with_row_id: false,
 1232 |             with_row_addr: false,
 1233 |             with_row_last_updated_at_version: false,
 1234 |             with_row_created_at_version: false,
 1235 |             blob_handling: BlobHandling::default(),
 1236 |         }
 1237 |     }
 1238 | 
 1239 |     pub fn full(base: Arc<dyn Projectable>) -> Self {
 1240 |         let schema = base.schema().clone();
 1241 |         Self::empty(base).union_schema(&schema)
 1242 |     }
 1243 | 
 1244 |     pub fn with_row_id(mut self) -> Self {
 1245 |         self.with_row_id = true;
 1246 |         self
 1247 |     }
 1248 | 
 1249 |     pub fn with_row_addr(mut self) -> Self {
 1250 |         self.with_row_addr = true;
 1251 |         self
 1252 |     }
 1253 | 
 1254 |     pub fn with_row_last_updated_at_version(mut self) -> Self {
 1255 |         self.with_row_last_updated_at_version = true;
 1256 |         self
 1257 |     }
 1258 | 
 1259 |     pub fn with_row_created_at_version(mut self) -> Self {
 1260 |         self.with_row_created_at_version = true;
 1261 |         self
 1262 |     }
 1263 | 
 1264 |     pub fn with_blob_handling(mut self, blob_handling: BlobHandling) -> Self {
 1265 |         self.blob_handling = blob_handling;
 1266 |         self
 1267 |     }
 1268 | 
 1269 |     fn add_field_children(field_ids: &mut HashSet<i32>, field: &Field) {
 1270 |         for child in &field.children {
 1271 |             field_ids.insert(child.id);
 1272 |             Self::add_field_children(field_ids, child);
 1273 |         }
 1274 |     }
 1275 | 
 1276 |     /// Add a column to the projection from a string reference
 1277 |     ///
 1278 |     /// The string reference can be a dotted field path (x.y.z) to reference inner struct fields
 1279 |     ///
 1280 |     /// Parent fields will automatically be added.  If the specified field has any children then
 1281 |     /// those will be added to.  Siblings, aunts, etc. are not automatically added
 1282 |     pub fn union_column(mut self, column: impl AsRef<str>, on_missing: OnMissing) -> Result<Self> {
 1283 |         let column = column.as_ref();
 1284 |         if column == ROW_ID {
 1285 |             self.with_row_id = true;
 1286 |             return Ok(self);
 1287 |         } else if column == ROW_ADDR {
 1288 |             self.with_row_addr = true;
 1289 |             return Ok(self);
 1290 |         } else if column == crate::ROW_LAST_UPDATED_AT_VERSION {
 1291 |             self.with_row_last_updated_at_version = true;
 1292 |             return Ok(self);
 1293 |         } else if column == crate::ROW_CREATED_AT_VERSION {
 1294 |             self.with_row_created_at_version = true;
 1295 |             return Ok(self);
 1296 |         }
 1297 | 
 1298 |         if let Some(fields) = self.base.schema().resolve(column) {
 1299 |             self.field_ids.extend(fields.iter().map(|f| f.id));
 1300 |             if let Some(last_field) = fields.last() {
 1301 |                 Self::add_field_children(&mut self.field_ids, last_field);
 1302 |             }
 1303 |         } else if matches!(on_missing, OnMissing::Error) {
 1304 |             return Err(Error::invalid_input_source(
 1305 |                 format!("Column {} does not exist", column).into(),
 1306 |             ));
 1307 |         }
 1308 |         Ok(self)
 1309 |     }
 1310 | 
 1311 |     /// True if the projection selects the given field id
 1312 |     pub fn contains_field_id(&self, id: i32) -> bool {
 1313 |         self.field_ids.contains(&id)
 1314 |     }
 1315 | 
 1316 |     /// True if the projection selects fields other than the row id / addr
 1317 |     pub fn has_data_fields(&self) -> bool {
 1318 |         !self.field_ids.is_empty()
 1319 |     }
 1320 | 
 1321 |     /// Add multiple columns (and their parents) to the projection
 1322 |     pub fn union_columns(
 1323 |         mut self,
 1324 |         columns: impl IntoIterator<Item = impl AsRef<str>>,
 1325 |         on_missing: OnMissing,
 1326 |     ) -> Result<Self> {
 1327 |         for column in columns {
 1328 |             self = self.union_column(column, on_missing)?;
 1329 |         }
 1330 |         Ok(self)
 1331 |     }
 1332 | 
 1333 |     /// Adds all fields from the base schema satisfying a predicate
 1334 |     pub fn union_predicate(mut self, predicate: impl Fn(&Field) -> bool) -> Self {
 1335 |         for field in self.base.schema().fields_pre_order() {
 1336 |             if predicate(field) {
 1337 |                 self.field_ids.insert(field.id);
 1338 |             }
 1339 |         }
 1340 |         self
 1341 |     }
 1342 | 
 1343 |     /// Removes all fields in the base schema satisfying a predicate
 1344 |     pub fn subtract_predicate(mut self, predicate: impl Fn(&Field) -> bool) -> Self {
 1345 |         for field in self.base.schema().fields_pre_order() {
 1346 |             if predicate(field) {
 1347 |                 self.field_ids.remove(&field.id);
 1348 |             }
 1349 |         }
 1350 |         self
 1351 |     }
 1352 | 
 1353 |     /// Creates a new projection that is the intersection of this projection and another
 1354 |     pub fn intersect(mut self, other: &Self) -> Self {
 1355 |         self.field_ids = HashSet::from_iter(self.field_ids.intersection(&other.field_ids).copied());
 1356 |         self.with_row_id = self.with_row_id && other.with_row_id;
 1357 |         self.with_row_addr = self.with_row_addr && other.with_row_addr;
 1358 |         self.with_row_last_updated_at_version =
 1359 |             self.with_row_last_updated_at_version && other.with_row_last_updated_at_version;
 1360 |         self.with_row_created_at_version =
 1361 |             self.with_row_created_at_version && other.with_row_created_at_version;
 1362 |         self
 1363 |     }
 1364 | 
 1365 |     /// Adds all fields from the provided schema to the projection
 1366 |     ///
 1367 |     /// Fields are only added if they exist in the base schema, otherwise they
 1368 |     /// are ignored.
 1369 |     ///
 1370 |     /// Will panic if a field in the given schema has a non-negative id and is not in the base schema.
 1371 |     pub fn union_schema(mut self, other: &Schema) -> Self {
 1372 |         for field in other.fields_pre_order() {
 1373 |             if field.id >= 0 {
 1374 |                 self.field_ids.insert(field.id);
 1375 |             } else if field.name == ROW_ID {
 1376 |                 self.with_row_id = true;
 1377 |             } else if field.name == ROW_ADDR {
 1378 |                 self.with_row_addr = true;
 1379 |             } else if field.name == crate::ROW_LAST_UPDATED_AT_VERSION {
 1380 |                 self.with_row_last_updated_at_version = true;
 1381 |             } else if field.name == crate::ROW_CREATED_AT_VERSION {
 1382 |                 self.with_row_created_at_version = true;
 1383 |             } else {
 1384 |                 // If a field is not in our schema then it should probably have an id of -1.  If it isn't -1
 1385 |                 // that probably implies some kind of weird schema mixing is going on and we should panic.
 1386 |                 debug_assert_eq!(field.id, -1);
 1387 |             }
 1388 |         }
 1389 |         self
 1390 |     }
 1391 | 
 1392 |     /// Creates a new projection that is the union of this projection and another
 1393 |     pub fn union_projection(mut self, other: &Self) -> Self {
 1394 |         self.field_ids.extend(&other.field_ids);
 1395 |         self.with_row_id = self.with_row_id || other.with_row_id;
 1396 |         self.with_row_addr = self.with_row_addr || other.with_row_addr;
 1397 |         self.with_row_last_updated_at_version =
 1398 |             self.with_row_last_updated_at_version || other.with_row_last_updated_at_version;
 1399 |         self.with_row_created_at_version =
 1400 |             self.with_row_created_at_version || other.with_row_created_at_version;
 1401 |         self
 1402 |     }
 1403 | 
 1404 |     /// Adds all fields from the given schema to the projection
 1405 |     ///
 1406 |     /// on_missing controls what happen to fields that are not in the base schema
 1407 |     ///
 1408 |     /// Name based matching is used to determine if a field is in the base schema.
 1409 |     pub fn union_arrow_schema(
 1410 |         mut self,
 1411 |         other: &ArrowSchema,
 1412 |         on_missing: OnMissing,
 1413 |     ) -> Result<Self> {
 1414 |         self.with_row_id |= other.fields().iter().any(|f| f.name() == ROW_ID);
 1415 |         self.with_row_addr |= other.fields().iter().any(|f| f.name() == ROW_ADDR);
 1416 |         self.with_row_last_updated_at_version |= other
 1417 |             .fields()
 1418 |             .iter()
 1419 |             .any(|f| f.name() == crate::ROW_LAST_UPDATED_AT_VERSION);
 1420 |         self.with_row_created_at_version |= other
 1421 |             .fields()
 1422 |             .iter()
 1423 |             .any(|f| f.name() == crate::ROW_CREATED_AT_VERSION);
 1424 |         let other =
 1425 |             self.base
 1426 |                 .schema()
 1427 |                 .project_by_schema(other, on_missing, OnTypeMismatch::TakeSelf)?;
 1428 |         Ok(self.union_schema(&other))
 1429 |     }
 1430 | 
 1431 |     /// Removes all fields from the projection that are in the given schema
 1432 |     ///
 1433 |     /// on_missing controls what happen to fields that are not in the base schema
 1434 |     ///
 1435 |     /// Name based matching is used to determine if a field is in the base schema.
 1436 |     pub fn subtract_arrow_schema(
 1437 |         mut self,
 1438 |         other: &ArrowSchema,
 1439 |         on_missing: OnMissing,
 1440 |     ) -> Result<Self> {
 1441 |         self.with_row_id &= !other.fields().iter().any(|f| f.name() == ROW_ID);
 1442 |         self.with_row_addr &= !other.fields().iter().any(|f| f.name() == ROW_ADDR);
 1443 |         self.with_row_last_updated_at_version &= !other
 1444 |             .fields()
 1445 |             .iter()
 1446 |             .any(|f| f.name() == crate::ROW_LAST_UPDATED_AT_VERSION);
 1447 |         self.with_row_created_at_version &= !other
 1448 |             .fields()
 1449 |             .iter()
 1450 |             .any(|f| f.name() == crate::ROW_CREATED_AT_VERSION);
 1451 |         let other =
 1452 |             self.base
 1453 |                 .schema()
 1454 |                 .project_by_schema(other, on_missing, OnTypeMismatch::TakeSelf)?;
 1455 |         Ok(self.subtract_schema(&other))
 1456 |     }
 1457 | 
 1458 |     /// Removes all fields from this projection that are present in the given projection
 1459 |     pub fn subtract_projection(mut self, other: &Self) -> Self {
 1460 |         self.field_ids = self
 1461 |             .field_ids
 1462 |             .difference(&other.field_ids)
 1463 |             .copied()
 1464 |             .collect();
 1465 |         self.with_row_addr = self.with_row_addr && !other.with_row_addr;
 1466 |         self.with_row_id = self.with_row_id && !other.with_row_id;
 1467 |         self.with_row_last_updated_at_version =
 1468 |             self.with_row_last_updated_at_version && !other.with_row_last_updated_at_version;
 1469 |         self.with_row_created_at_version =
 1470 |             self.with_row_created_at_version && !other.with_row_created_at_version;
 1471 |         self
 1472 |     }
 1473 | 
 1474 |     /// Removes all fields from the projection that are in the given schema
 1475 |     ///
 1476 |     /// Fields are only removed if they exist in the base schema, otherwise they
 1477 |     /// are ignored.
 1478 |     ///
 1479 |     /// Will panic if a field in the given schema has a non-negative id and is not in the base schema.
 1480 |     pub fn subtract_schema(mut self, other: &Schema) -> Self {
 1481 |         for field in other.fields_pre_order() {
 1482 |             if field.id >= 0 {
 1483 |                 self.field_ids.remove(&field.id);
 1484 |             } else if field.name == ROW_ID {
 1485 |                 self.with_row_id = false;
 1486 |             } else if field.name == ROW_ADDR {
 1487 |                 self.with_row_addr = false;
 1488 |             } else if field.name == crate::ROW_LAST_UPDATED_AT_VERSION {
 1489 |                 self.with_row_last_updated_at_version = false;
 1490 |             } else if field.name == crate::ROW_CREATED_AT_VERSION {
 1491 |                 self.with_row_created_at_version = false;
 1492 |             } else {
 1493 |                 debug_assert_eq!(field.id, -1);
 1494 |             }
 1495 |         }
 1496 |         self
 1497 |     }
 1498 | 
 1499 |     /// True if the projection does not select any fields or take the row id / addr
 1500 |     pub fn is_empty(&self) -> bool {
 1501 |         self.field_ids.is_empty()
 1502 |             && !self.with_row_addr
 1503 |             && !self.with_row_id
 1504 |             && !self.with_row_last_updated_at_version
 1505 |             && !self.with_row_created_at_version
 1506 |     }
 1507 | 
 1508 |     /// True if the projection is only the row_id or row_addr columns
 1509 |     ///
 1510 |     /// Note: this will return false for a completely empty projection
 1511 |     pub fn is_metadata_only(&self) -> bool {
 1512 |         self.field_ids.is_empty()
 1513 |             && (self.with_row_addr
 1514 |                 || self.with_row_id
 1515 |                 || self.with_row_last_updated_at_version
 1516 |                 || self.with_row_created_at_version)
 1517 |     }
 1518 | 
 1519 |     /// True if the projection has at least one non-metadata column
 1520 |     pub fn has_non_meta_cols(&self) -> bool {
 1521 |         !self.field_ids.is_empty()
 1522 |     }
 1523 | 
 1524 |     /// Convert the projection to a schema that does not include metadata columns
 1525 |     pub fn to_bare_schema(&self) -> Schema {
 1526 |         self.base.schema().apply_projection(self)
 1527 |     }
 1528 | 
 1529 |     /// Convert the projection to a schema
 1530 |     ///
 1531 |     /// Includes the _rowid and _rowaddr columns if requested
 1532 |     pub fn to_schema(&self) -> Schema {
 1533 |         let mut schema = self.to_bare_schema();
 1534 |         let mut extra_fields = Vec::new();
 1535 |         if self.with_row_id {
 1536 |             extra_fields.push(ROW_ID_FIELD.clone());
 1537 |         }
 1538 |         if self.with_row_addr {
 1539 |             extra_fields.push(ROW_ADDR_FIELD.clone());
 1540 |         }
 1541 |         if self.with_row_last_updated_at_version {
 1542 |             extra_fields.push(crate::ROW_LAST_UPDATED_AT_VERSION_FIELD.clone());
 1543 |         }
 1544 |         if self.with_row_created_at_version {
 1545 |             extra_fields.push(crate::ROW_CREATED_AT_VERSION_FIELD.clone());
 1546 |         }
 1547 |         schema.extend(&extra_fields).unwrap();
 1548 |         schema
 1549 |     }
 1550 | 
 1551 |     /// Convert the projection to a schema
 1552 |     pub fn into_schema(self) -> Schema {
 1553 |         self.to_schema()
 1554 |     }
 1555 | 
 1556 |     /// Convert the projection to a schema reference
 1557 |     pub fn into_schema_ref(self) -> Arc<Schema> {
 1558 |         Arc::new(self.into_schema())
 1559 |     }
 1560 | 
 1561 |     /// Convert the projection into an Arrow schema
 1562 |     pub fn to_arrow_schema(&self) -> arrow_schema::Schema {
 1563 |         (&self.to_schema()).into()
 1564 |     }
 1565 | }
 1566 | 
 1567 | /// Parse a field path that may contain quoted field names.
 1568 | ///
 1569 | /// Field names containing dots must be quoted with backticks.
 1570 | /// For example: "parent.`child.with.dot`" parses to ["parent", "child.with.dot"]
 1571 | ///
 1572 | /// Backticks within quoted fields must be escaped by doubling them.
 1573 | /// For example: "`field``with``backticks`" represents the field name "field`with`backticks"
 1574 | ///
 1575 | /// Returns an error if:
 1576 | /// - The input path is empty
 1577 | /// - The path has malformed quotes (unclosed, misplaced, etc.)
 1578 | /// - The path has empty segments (e.g., "parent..child" or "parent.")
 1579 | ///
 1580 | /// The result is guaranteed to contain at least one element.
 1581 | pub fn parse_field_path(path: &str) -> Result<Vec<String>> {
 1582 |     if path.is_empty() {
 1583 |         return Err(Error::schema("Field path cannot be empty".to_string()));
 1584 |     }
 1585 | 
 1586 |     let mut result = Vec::new();
 1587 |     let mut current = String::new();
 1588 |     let mut in_quotes = false;
 1589 |     let mut chars = path.chars().peekable();
 1590 | 
 1591 |     while let Some(ch) = chars.next() {
 1592 |         match ch {
 1593 |             '`' => {
 1594 |                 if in_quotes {
 1595 |                     // Check if this is an escaped backtick (double backtick)
 1596 |                     if chars.peek() == Some(&'`') {
 1597 |                         // Consume the second backtick and add a single backtick to current
 1598 |                         chars.next();
 1599 |                         current.push('`');
 1600 |                     } else {
 1601 |                         // End of quoted field
 1602 |                         in_quotes = false;
 1603 |                         // After closing quote, we should either see a dot or end of string
 1604 |                         if let Some(&next_ch) = chars.peek()
 1605 |                             && next_ch != '.'
 1606 |                         {
 1607 |                             return Err(Error::schema(format!(
 1608 |                                 "Invalid field path '{}': expected '.' or end of string after closing quote",
 1609 |                                 path
 1610 |                             )));
 1611 |                         }
 1612 |                     }
 1613 |                 } else if current.is_empty() {
 1614 |                     // Start of quoted field
 1615 |                     in_quotes = true;
 1616 |                 } else {
 1617 |                     // Quote in the middle of unquoted field name
 1618 |                     return Err(Error::schema(format!(
 1619 |                         "Invalid field path '{}': unexpected quote in the middle of field name",
 1620 |                         path
 1621 |                     )));
 1622 |                 }
 1623 |             }
 1624 |             '.' if !in_quotes => {
 1625 |                 if current.is_empty() {
 1626 |                     return Err(Error::schema(format!(
 1627 |                         "Invalid field path '{}': empty field name",
 1628 |                         path
 1629 |                     )));
 1630 |                 }
 1631 |                 result.push(current);
 1632 |                 current = String::new();
 1633 |             }
 1634 |             _ => {
 1635 |                 current.push(ch);
 1636 |             }
 1637 |         }
 1638 |     }
 1639 | 
 1640 |     if in_quotes {
 1641 |         return Err(Error::schema(format!(
 1642 |             "Invalid field path '{}': unclosed quote",
 1643 |             path
 1644 |         )));
 1645 |     }
 1646 | 
 1647 |     if !current.is_empty() {
 1648 |         result.push(current);
 1649 |     } else if !result.is_empty() {
 1650 |         return Err(Error::schema(format!(
 1651 |             "Invalid field path '{}': trailing dot",
 1652 |             path
 1653 |         )));
 1654 |     }
 1655 | 
 1656 |     // This check is now redundant since we check for empty input at the beginning,
 1657 |     // but keeping it for extra safety
 1658 |     if result.is_empty() {
 1659 |         return Err(Error::schema(format!("Invalid field path '{}'", path)));
 1660 |     }
 1661 | 
 1662 |     Ok(result)
 1663 | }
 1664 | 
 1665 | /// Format a field path, quoting field names that require escaping.
 1666 | ///
 1667 | /// Field names are quoted if they contain any character that is not alphanumeric
 1668 | /// or underscore, to ensure safe SQL parsing.
 1669 | ///
 1670 | /// For example: ["parent", "child.with.dot"] formats to "parent.`child.with.dot`"
 1671 | /// For example: ["meta-data", "user-id"] formats to "`meta-data`.`user-id`"
 1672 | /// Backticks in field names are escaped by doubling them.
 1673 | /// For example: \["field`with`backticks"\] formats to "`field``with``backticks`"
 1674 | pub fn format_field_path(fields: &[&str]) -> String {
 1675 |     fields
 1676 |         .iter()
 1677 |         .map(|field| {
 1678 |             // Quote if the field contains any non-identifier character
 1679 |             // (i.e., anything other than alphanumeric or underscore)
 1680 |             let needs_quoting = field.chars().any(|c| !c.is_alphanumeric() && c != '_');
 1681 |             if needs_quoting {
 1682 |                 // Escape backticks by doubling them (PostgreSQL style)
 1683 |                 let escaped = field.replace('`', "``");
 1684 |                 format!("`{}`", escaped)
 1685 |             } else {
 1686 |                 field.to_string()
 1687 |             }
 1688 |         })
 1689 |         .collect::<Vec<_>>()
 1690 |         .join(".")
 1691 | }
 1692 | 
 1693 | /// Like [`format_field_path`], but quotes a segment only when strictly required
 1694 | /// for the result to round-trip back through [`parse_field_path`].
 1695 | ///
 1696 | /// `parse_field_path` only treats `.` (segment separator) and `` ` `` (quote)
 1697 | /// specially, so those are the only characters that force quoting here. Notably
 1698 | /// a hyphen does NOT force quoting (`my-col` stays `my-col`), unlike
 1699 | /// `format_field_path` which quotes any non-identifier character for
 1700 | /// SQL-expression safety. Use this for human-readable, round-trippable paths
 1701 | /// (e.g. column names in index metadata); use `format_field_path` when the
 1702 | /// result will be embedded in a SQL expression.
 1703 | ///
 1704 | /// ```
 1705 | /// use lance_core::datatypes::{format_field_path_minimal, parse_field_path};
 1706 | ///
 1707 | /// // Plain identifiers and hyphenated names are left bare.
 1708 | /// assert_eq!(format_field_path_minimal(&["parent", "my-col"]), "parent.my-col");
 1709 | /// // A `.` in a segment forces quoting.
 1710 | /// assert_eq!(format_field_path_minimal(&["parent", "child.x"]), "parent.`child.x`");
 1711 | /// // Embedded backticks are escaped by doubling them.
 1712 | /// assert_eq!(format_field_path_minimal(&["child`x"]), "`child``x`");
 1713 | ///
 1714 | /// // Whatever it produces round-trips back through `parse_field_path`.
 1715 | /// for segments in [vec!["parent", "my-col"], vec!["parent", "child.x"], vec!["child`x"]] {
 1716 | ///     let path = format_field_path_minimal(&segments);
 1717 | ///     assert_eq!(parse_field_path(&path).unwrap(), segments);
 1718 | /// }
 1719 | /// ```
 1720 | pub fn format_field_path_minimal(fields: &[&str]) -> String {
 1721 |     fields
 1722 |         .iter()
 1723 |         .map(|field| {
 1724 |             let needs_quoting = field.contains('.') || field.contains('`');
 1725 |             if needs_quoting {
 1726 |                 // Escape embedded backticks by doubling them, matching parse_field_path.
 1727 |                 let escaped = field.replace('`', "``");
 1728 |                 format!("`{}`", escaped)
 1729 |             } else {
 1730 |                 field.to_string()
 1731 |             }
 1732 |         })
 1733 |         .collect::<Vec<_>>()
 1734 |         .join(".")
 1735 | }
 1736 | 
 1737 | /// Escape a field path for project
 1738 | ///
 1739 | /// Parses the field path and formats it for SQL usage.
 1740 | /// Always quotes all segments with backticks to prevent special characters.
 1741 | ///
 1742 | /// For example:
 1743 | /// - "parent.child" -> “`parent`.`child`”
 1744 | /// - "parent.`child.with.dot`" -> “`parent`.`child.with.dot`”
 1745 | pub fn escape_field_path_for_project(name: &str) -> String {
 1746 |     if name == WILDCARD {
 1747 |         return name.to_string();
 1748 |     }
 1749 |     let segments = parse_field_path(name).unwrap_or_else(|_| vec![name.to_string()]);
 1750 |     segments
 1751 |         .iter()
 1752 |         .map(|s| {
 1753 |             let escaped = s.replace('`', "``");
 1754 |             format!("`{}`", escaped)
 1755 |         })
 1756 |         .collect::<Vec<_>>()
 1757 |         .join(".")
 1758 | }
 1759 | 
 1760 | #[cfg(test)]
 1761 | mod tests {
 1762 |     use arrow_schema::{DataType as ArrowDataType, Fields as ArrowFields};
 1763 |     use std::{collections::HashMap, sync::Arc};
 1764 | 
 1765 |     use super::*;
 1766 | 
 1767 |     #[test]
 1768 |     fn test_resolve_with_quoted_fields() {
 1769 |         // Create a schema with fields containing dots
 1770 |         let field_with_dots = Field::try_from(&ArrowField::new(
 1771 |             "simple.name.with.dot",
 1772 |             ArrowDataType::Int32,
 1773 |             false,
 1774 |         ))
 1775 |         .unwrap();
 1776 |         let normal_field =
 1777 |             Field::try_from(&ArrowField::new("normal", ArrowDataType::Int32, false)).unwrap();
 1778 |         let nested_field = Field::try_from(&ArrowField::new(
 1779 |             "parent",
 1780 |             ArrowDataType::Struct(ArrowFields::from(vec![
 1781 |                 ArrowField::new("child.with.dot", ArrowDataType::Int32, false),
 1782 |                 ArrowField::new("normal_child", ArrowDataType::Int32, false),
 1783 |             ])),
 1784 |             false,
 1785 |         ))
 1786 |         .unwrap();
 1787 | 
 1788 |         let schema = Schema {
 1789 |             fields: vec![field_with_dots, normal_field, nested_field],
 1790 |             metadata: HashMap::new(),
 1791 |         };
 1792 | 
 1793 |         // Test 1: Resolving a field with dots using quotes
 1794 |         let resolved = schema.resolve("`simple.name.with.dot`");
 1795 |         assert!(resolved.is_some());
 1796 |         let fields = resolved.unwrap();
 1797 |         assert_eq!(fields.len(), 1);
 1798 |         assert_eq!(fields[0].name, "simple.name.with.dot");
 1799 | 
 1800 |         // Test 2: Resolving a normal field
 1801 |         let resolved = schema.resolve("normal");
 1802 |         assert!(resolved.is_some());
 1803 |         let fields = resolved.unwrap();
 1804 |         assert_eq!(fields.len(), 1);
 1805 |         assert_eq!(fields[0].name, "normal");
 1806 | 
 1807 |         // Test 3: Resolving a nested field with dots
 1808 |         let resolved = schema.resolve("parent.`child.with.dot`");
 1809 |         assert!(resolved.is_some());
 1810 |         let fields = resolved.unwrap();
 1811 |         assert_eq!(fields.len(), 2);
 1812 |         assert_eq!(fields[0].name, "parent");
 1813 |         assert_eq!(fields[1].name, "child.with.dot");
 1814 | 
 1815 |         // Test 4: Resolving a normal nested field
 1816 |         let resolved = schema.resolve("parent.normal_child");
 1817 |         assert!(resolved.is_some());
 1818 |         let fields = resolved.unwrap();
 1819 |         assert_eq!(fields.len(), 2);
 1820 |         assert_eq!(fields[0].name, "parent");
 1821 |         assert_eq!(fields[1].name, "normal_child");
 1822 | 
 1823 |         // Test 5: Non-existent field should return None
 1824 |         let resolved = schema.resolve("\"non.existent\"");
 1825 |         assert!(resolved.is_none());
 1826 | 
 1827 |         // Test 6: Schema::field should work the same way
 1828 |         let field = schema.field("`simple.name.with.dot`");
 1829 |         assert!(field.is_some());
 1830 |         assert_eq!(field.unwrap().name, "simple.name.with.dot");
 1831 | 
 1832 |         let field = schema.field("parent.`child.with.dot`");
 1833 |         assert!(field.is_some());
 1834 |         assert_eq!(field.unwrap().name, "child.with.dot");
 1835 | 
 1836 |         let field = schema.field("parent.normal_child");
 1837 |         assert!(field.is_some());
 1838 |         assert_eq!(field.unwrap().name, "normal_child");
 1839 |     }
 1840 | 
 1841 |     #[test]
 1842 |     fn test_field_path_parsing() {
 1843 |         // Simple paths without quotes
 1844 |         assert_eq!(
 1845 |             parse_field_path("a.b.c").unwrap(),
 1846 |             vec!["a".to_string(), "b".to_string(), "c".to_string()]
 1847 |         );
 1848 | 
 1849 |         // Single quoted field with dots
 1850 |         assert_eq!(
 1851 |             parse_field_path("`simple.name.with.dot`").unwrap(),
 1852 |             vec!["simple.name.with.dot".to_string()]
 1853 |         );
 1854 | 
 1855 |         // Path with quoted field containing dots
 1856 |         assert_eq!(
 1857 |             parse_field_path("parent.`child.with.dot`.normal").unwrap(),
 1858 |             vec![
 1859 |                 "parent".to_string(),
 1860 |                 "child.with.dot".to_string(),
 1861 |                 "normal".to_string()
 1862 |             ]
 1863 |         );
 1864 | 
 1865 |         // Quoted field at the beginning
 1866 |         assert_eq!(
 1867 |             parse_field_path("`field.with.dot`.child").unwrap(),
 1868 |             vec!["field.with.dot".to_string(), "child".to_string()]
 1869 |         );
 1870 | 
 1871 |         // Simple field
 1872 |         assert_eq!(
 1873 |             parse_field_path("simple").unwrap(),
 1874 |             vec!["simple".to_string()]
 1875 |         );
 1876 | 
 1877 |         assert_eq!(
 1878 |             parse_field_path("tags[*]").unwrap(),
 1879 |             vec!["tags[*]".to_string()]
 1880 |         );
 1881 | 
 1882 |         // Quoted field at the end
 1883 |         assert_eq!(
 1884 |             parse_field_path("parent.`field.with.dot`").unwrap(),
 1885 |             vec!["parent".to_string(), "field.with.dot".to_string()]
 1886 |         );
 1887 | 
 1888 |         // Field with escaped backticks (PostgreSQL style - double backticks)
 1889 |         assert_eq!(
 1890 |             parse_field_path("parent.`field``with``backticks`").unwrap(),
 1891 |             vec!["parent".to_string(), "field`with`backticks".to_string()]
 1892 |         );
 1893 | 
 1894 |         // Invalid: unclosed quote
 1895 |         assert!(parse_field_path("parent.`unclosed").is_err());
 1896 | 
 1897 |         // Invalid: quote in middle of unquoted field
 1898 |         assert!(parse_field_path("par`ent.child").is_err());
 1899 | 
 1900 |         // Invalid: empty field name
 1901 |         assert!(parse_field_path("parent..child").is_err());
 1902 | 
 1903 |         // Invalid: trailing dot
 1904 |         assert!(parse_field_path("parent.").is_err());
 1905 | 
 1906 |         // Test formatting
 1907 |         assert_eq!(
 1908 |             format_field_path(&["parent", "child.with.dot", "normal"]),
 1909 |             "parent.`child.with.dot`.normal"
 1910 |         );
 1911 | 
 1912 |         assert_eq!(
 1913 |             format_field_path(&["field`with`backticks"]),
 1914 |             "`field``with``backticks`"
 1915 |         );
 1916 |     }
 1917 | 
 1918 |     #[test]
 1919 |     fn test_validate_top_level_names_without_field_id_lookup() {
 1920 |         let mut first = Field::new_arrow("first", DataType::Int32, false).unwrap();
 1921 |         first.id = 0;
 1922 |         let mut second = Field::new_arrow("second", DataType::Int32, false).unwrap();
 1923 |         second.id = 0;
 1924 |         let schema = Schema {
 1925 |             fields: vec![first, second],
 1926 |             metadata: HashMap::new(),
 1927 |         };
 1928 | 
 1929 |         let error = schema.validate().unwrap_err();
 1930 |         assert!(matches!(&error, Error::Schema { .. }));
 1931 |         assert!(error.to_string().contains("Duplicate field id 0"));
 1932 |     }
 1933 | 
 1934 |     #[test]
 1935 |     fn test_validate_admits_row_lineage_ids_only_at_top_level() {
 1936 |         let uint64_field = |name: &str, id: i32| {
 1937 |             let mut field = Field::new_arrow(name, DataType::UInt64, false).unwrap();
 1938 |             field.id = id;
 1939 |             field
 1940 |         };
 1941 |         let mut key = Field::new_arrow("i", DataType::Int32, false).unwrap();
 1942 |         key.id = 0;
 1943 | 
 1944 |         // A hidden lineage column: top-level, under its own name's reserved id.
 1945 |         let schema = Schema {
 1946 |             fields: vec![key.clone(), uint64_field(ROW_ID, crate::ROW_ID_FIELD_ID)],
 1947 |             metadata: HashMap::new(),
 1948 |         };
 1949 |         schema.validate().unwrap();
 1950 | 
 1951 |         // Another lineage column's id does not belong to this name.
 1952 |         let schema = Schema {
 1953 |             fields: vec![
 1954 |                 key.clone(),
 1955 |                 uint64_field(ROW_ID, crate::ROW_CREATED_AT_VERSION_FIELD_ID),
 1956 |             ],
 1957 |             metadata: HashMap::new(),
 1958 |         };
 1959 |         let error = schema.validate().unwrap_err();
 1960 |         assert!(matches!(error, Error::Schema { .. }), "{error}");
 1961 |         assert!(error.to_string().contains("negative id"), "{error}");
 1962 | 
 1963 |         // A data file stores lineage columns only at the top level.
 1964 |         let mut parent = Field::new_arrow(
 1965 |             "s",
 1966 |             DataType::Struct(ArrowFields::from(vec![ArrowField::new(
 1967 |                 ROW_CREATED_AT_VERSION,
 1968 |                 DataType::UInt64,
 1969 |                 false,
 1970 |             )])),
 1971 |             true,
 1972 |         )
 1973 |         .unwrap();
 1974 |         parent.id = 1;
 1975 |         parent.children[0].id = crate::ROW_CREATED_AT_VERSION_FIELD_ID;
 1976 |         let schema = Schema {
 1977 |             fields: vec![key, parent],
 1978 |             metadata: HashMap::new(),
 1979 |         };
 1980 |         let error = schema.validate().unwrap_err();
 1981 |         assert!(matches!(error, Error::Schema { .. }), "{error}");
 1982 |         assert!(error.to_string().contains("negative id"), "{error}");
 1983 |     }
 1984 | 
 1985 |     #[test]
 1986 |     fn test_resolve_quoted_fields() {
 1987 |         // Test that top-level fields with dots are rejected during validation
 1988 |         let arrow_schema_with_dots = ArrowSchema::new(vec![ArrowField::new(
 1989 |             "field.with.dots",
 1990 |             DataType::Int32,
 1991 |             false,
 1992 |         )]);
 1993 | 
 1994 |         // Schema creation should fail due to validation
 1995 |         let schema_result = Schema::try_from(&arrow_schema_with_dots);
 1996 |         assert!(schema_result.is_err());
 1997 |         let err = schema_result.unwrap_err();
 1998 |         assert!(
 1999 |             err.to_string()
 2000 |                 .contains("Top level field field.with.dots cannot contain `.`")
 2001 |         );
 2002 | 
 2003 |         // Test that nested fields with dots are allowed
 2004 |         let arrow_schema = ArrowSchema::new(vec![
 2005 |             ArrowField::new("regular_field", DataType::Int32, false),
 2006 |             ArrowField::new(
 2007 |                 "parent",
 2008 |                 DataType::Struct(ArrowFields::from(vec![
 2009 |                     ArrowField::new("child.with.dot", DataType::Utf8, true),
 2010 |                     ArrowField::new("normal_child", DataType::Int32, false),
 2011 |                 ])),
 2012 |                 false,
 2013 |             ),
 2014 |         ]);
 2015 | 
 2016 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 2017 | 
 2018 |         // Test resolving regular field
 2019 |         let resolved = schema.resolve("regular_field");
 2020 |         assert!(resolved.is_some());
 2021 |         let fields = resolved.unwrap();
 2022 |         assert_eq!(fields.len(), 1);
 2023 |         assert_eq!(fields[0].name, "regular_field");
 2024 | 
 2025 |         // Test resolving nested field with dots using quotes
 2026 |         let resolved = schema.resolve("parent.`child.with.dot`");
 2027 |         assert!(resolved.is_some());
 2028 |         let fields = resolved.unwrap();
 2029 |         assert_eq!(fields.len(), 2);
 2030 |         assert_eq!(fields[0].name, "parent");
 2031 |         assert_eq!(fields[1].name, "child.with.dot");
 2032 | 
 2033 |         // Test resolving normal nested field
 2034 |         let resolved = schema.resolve("parent.normal_child");
 2035 |         assert!(resolved.is_some());
 2036 |         let fields = resolved.unwrap();
 2037 |         assert_eq!(fields.len(), 2);
 2038 |         assert_eq!(fields[0].name, "parent");
 2039 |         assert_eq!(fields[1].name, "normal_child");
 2040 |     }
 2041 | 
 2042 |     use arrow_schema::DataType;
 2043 | 
 2044 |     #[test]
 2045 |     fn test_schema_projection() {
 2046 |         let arrow_schema = ArrowSchema::new(vec![
 2047 |             ArrowField::new("a", DataType::Int32, false),
 2048 |             ArrowField::new(
 2049 |                 "b",
 2050 |                 DataType::Struct(ArrowFields::from(vec![
 2051 |                     ArrowField::new("f1", DataType::Utf8, true),
 2052 |                     ArrowField::new("f2", DataType::Boolean, false),
 2053 |                     ArrowField::new("f3", DataType::Float32, false),
 2054 |                 ])),
 2055 |                 true,
 2056 |             ),
 2057 |             ArrowField::new("c", DataType::Float64, false),
 2058 |         ]);
 2059 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 2060 |         let projected = schema.project(&["b.f1", "b.f3", "c"]).unwrap();
 2061 | 
 2062 |         let expected_arrow_schema = ArrowSchema::new(vec![
 2063 |             ArrowField::new(
 2064 |                 "b",
 2065 |                 DataType::Struct(ArrowFields::from(vec![
 2066 |                     ArrowField::new("f1", DataType::Utf8, true),
 2067 |                     ArrowField::new("f3", DataType::Float32, false),
 2068 |                 ])),
 2069 |                 true,
 2070 |             ),
 2071 |             ArrowField::new("c", DataType::Float64, false),
 2072 |         ]);
 2073 |         assert_eq!(ArrowSchema::from(&projected), expected_arrow_schema);
 2074 |     }
 2075 | 
 2076 |     #[test]
 2077 |     fn test_schema_projection_preserving_system_columns() {
 2078 |         let arrow_schema = ArrowSchema::new(vec![
 2079 |             ArrowField::new("a", DataType::Int32, false),
 2080 |             ArrowField::new(
 2081 |                 "b",
 2082 |                 DataType::Struct(ArrowFields::from(vec![
 2083 |                     ArrowField::new("f1", DataType::Utf8, true),
 2084 |                     ArrowField::new("f2", DataType::Boolean, false),
 2085 |                     ArrowField::new("f3", DataType::Float32, false),
 2086 |                 ])),
 2087 |                 true,
 2088 |             ),
 2089 |             ArrowField::new("c", DataType::Float64, false),
 2090 |         ]);
 2091 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 2092 |         let projected = schema
 2093 |             .project_preserve_system_columns(&["b.f1", "b.f3", "_rowid", "c"])
 2094 |             .unwrap();
 2095 | 
 2096 |         let expected_arrow_schema = ArrowSchema::new(vec![
 2097 |             ArrowField::new(
 2098 |                 "b",
 2099 |                 DataType::Struct(ArrowFields::from(vec![
 2100 |                     ArrowField::new("f1", DataType::Utf8, true),
 2101 |                     ArrowField::new("f3", DataType::Float32, false),
 2102 |                 ])),
 2103 |                 true,
 2104 |             ),
 2105 |             ArrowField::new("_rowid", DataType::UInt64, true),
 2106 |             ArrowField::new("c", DataType::Float64, false),
 2107 |         ]);
 2108 |         assert_eq!(ArrowSchema::from(&projected), expected_arrow_schema);
 2109 |     }
 2110 | 
 2111 |     #[test]
 2112 |     fn test_schema_project_by_ids() {
 2113 |         let arrow_schema = ArrowSchema::new(vec![
 2114 |             ArrowField::new("a", DataType::Int32, false),
 2115 |             ArrowField::new(
 2116 |                 "b",
 2117 |                 DataType::Struct(ArrowFields::from(vec![
 2118 |                     ArrowField::new("f1", DataType::Utf8, true),
 2119 |                     ArrowField::new("f2", DataType::Boolean, false),
 2120 |                     ArrowField::new("f3", DataType::Float32, false),
 2121 |                 ])),
 2122 |                 true,
 2123 |             ),
 2124 |             ArrowField::new("c", DataType::Float64, false),
 2125 |         ]);
 2126 |         let mut schema = Schema::try_from(&arrow_schema).unwrap();
 2127 |         schema.set_field_id(None);
 2128 |         let projected = schema.project_by_ids(&[2, 4, 5], true);
 2129 | 
 2130 |         let expected_arrow_schema = ArrowSchema::new(vec![
 2131 |             ArrowField::new(
 2132 |                 "b",
 2133 |                 DataType::Struct(ArrowFields::from(vec![
 2134 |                     ArrowField::new("f1", DataType::Utf8, true),
 2135 |                     ArrowField::new("f3", DataType::Float32, false),
 2136 |                 ])),
 2137 |                 true,
 2138 |             ),
 2139 |             ArrowField::new("c", DataType::Float64, false),
 2140 |         ]);
 2141 |         assert_eq!(ArrowSchema::from(&projected), expected_arrow_schema);
 2142 | 
 2143 |         let projected = schema.project_by_ids(&[2], true);
 2144 |         let expected_arrow_schema = ArrowSchema::new(vec![ArrowField::new(
 2145 |             "b",
 2146 |             DataType::Struct(ArrowFields::from(vec![ArrowField::new(
 2147 |                 "f1",
 2148 |                 DataType::Utf8,
 2149 |                 true,
 2150 |             )])),
 2151 |             true,
 2152 |         )]);
 2153 |         assert_eq!(ArrowSchema::from(&projected), expected_arrow_schema);
 2154 | 
 2155 |         let projected = schema.project_by_ids(&[1], true);
 2156 |         let expected_arrow_schema = ArrowSchema::new(vec![ArrowField::new(
 2157 |             "b",
 2158 |             DataType::Struct(ArrowFields::from(vec![
 2159 |                 ArrowField::new("f1", DataType::Utf8, true),
 2160 |                 ArrowField::new("f2", DataType::Boolean, false),
 2161 |                 ArrowField::new("f3", DataType::Float32, false),
 2162 |             ])),
 2163 |             true,
 2164 |         )]);
 2165 |         assert_eq!(ArrowSchema::from(&projected), expected_arrow_schema);
 2166 | 
 2167 |         let projected = schema.project_by_ids(&[1, 2], false);
 2168 |         let expected_arrow_schema = ArrowSchema::new(vec![ArrowField::new(
 2169 |             "b",
 2170 |             DataType::Struct(ArrowFields::from(vec![ArrowField::new(
 2171 |                 "f1",
 2172 |                 DataType::Utf8,
 2173 |                 true,
 2174 |             )])),
 2175 |             true,
 2176 |         )]);
 2177 |         assert_eq!(ArrowSchema::from(&projected), expected_arrow_schema);
 2178 |     }
 2179 | 
 2180 |     #[test]
 2181 |     fn test_schema_project_by_schema() {
 2182 |         let arrow_schema = ArrowSchema::new(vec![
 2183 |             ArrowField::new("a", DataType::Int32, false),
 2184 |             ArrowField::new(
 2185 |                 "b",
 2186 |                 DataType::Struct(ArrowFields::from(vec![
 2187 |                     ArrowField::new("f1", DataType::Utf8, true),
 2188 |                     ArrowField::new("f2", DataType::Boolean, false),
 2189 |                     ArrowField::new("f3", DataType::Float32, false),
 2190 |                 ])),
 2191 |                 true,
 2192 |             ),
 2193 |             ArrowField::new("c", DataType::Float64, false),
 2194 |             ArrowField::new("s", DataType::Utf8, false),
 2195 |             ArrowField::new(
 2196 |                 "l",
 2197 |                 DataType::List(Arc::new(ArrowField::new("le", DataType::Int32, false))),
 2198 |                 false,
 2199 |             ),
 2200 |             ArrowField::new(
 2201 |                 "fixed_l",
 2202 |                 DataType::List(Arc::new(ArrowField::new("elem", DataType::Float32, false))),
 2203 |                 false,
 2204 |             ),
 2205 |             ArrowField::new(
 2206 |                 "d",
 2207 |                 DataType::Dictionary(Box::new(DataType::UInt32), Box::new(DataType::Utf8)),
 2208 |                 false,
 2209 |             ),
 2210 |         ]);
 2211 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 2212 | 
 2213 |         let projection = ArrowSchema::new(vec![
 2214 |             ArrowField::new(
 2215 |                 "b",
 2216 |                 DataType::Struct(ArrowFields::from(vec![ArrowField::new(
 2217 |                     "f1",
 2218 |                     DataType::Utf8,
 2219 |                     true,
 2220 |                 )])),
 2221 |                 true,
 2222 |             ),
 2223 |             ArrowField::new("s", DataType::Utf8, false),
 2224 |             ArrowField::new(
 2225 |                 "l",
 2226 |                 DataType::List(Arc::new(ArrowField::new("le", DataType::Int32, false))),
 2227 |                 false,
 2228 |             ),
 2229 |             ArrowField::new(
 2230 |                 "fixed_l",
 2231 |                 DataType::List(Arc::new(ArrowField::new("elem", DataType::Float32, false))),
 2232 |                 false,
 2233 |             ),
 2234 |             ArrowField::new(
 2235 |                 "d",
 2236 |                 DataType::Dictionary(Box::new(DataType::UInt32), Box::new(DataType::Utf8)),
 2237 |                 false,
 2238 |             ),
 2239 |         ]);
 2240 |         let projected = schema
 2241 |             .project_by_schema(&projection, OnMissing::Error, OnTypeMismatch::TakeSelf)
 2242 |             .unwrap();
 2243 | 
 2244 |         assert_eq!(ArrowSchema::from(&projected), projection);
 2245 |     }
 2246 | 
 2247 |     #[test]
 2248 |     fn test_get_nested_field() {
 2249 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new(
 2250 |             "b",
 2251 |             DataType::Struct(ArrowFields::from(vec![
 2252 |                 ArrowField::new("f1", DataType::Utf8, true),
 2253 |                 ArrowField::new("f2", DataType::Boolean, false),
 2254 |                 ArrowField::new("f3", DataType::Float32, false),
 2255 |             ])),
 2256 |             true,
 2257 |         )]);
 2258 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 2259 | 
 2260 |         let field = schema.field("b.f2").unwrap();
 2261 |         assert_eq!(field.data_type(), DataType::Boolean);
 2262 |     }
 2263 | 
 2264 |     #[test]
 2265 |     fn test_exclude_fields() {
 2266 |         let arrow_schema = ArrowSchema::new(vec![
 2267 |             ArrowField::new("a", DataType::Int32, false),
 2268 |             ArrowField::new(
 2269 |                 "b",
 2270 |                 DataType::Struct(ArrowFields::from(vec![
 2271 |                     ArrowField::new("f1", DataType::Utf8, true),
 2272 |                     ArrowField::new("f2", DataType::Boolean, false),
 2273 |                     ArrowField::new("f3", DataType::Float32, false),
 2274 |                 ])),
 2275 |                 true,
 2276 |             ),
 2277 |             ArrowField::new("c", DataType::Float64, false),
 2278 |         ]);
 2279 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 2280 | 
 2281 |         let projection = schema.project(&["a", "b.f2", "b.f3"]).unwrap();
 2282 |         let excluded = schema.exclude(&projection).unwrap();
 2283 | 
 2284 |         let expected_arrow_schema = ArrowSchema::new(vec![
 2285 |             ArrowField::new(
 2286 |                 "b",
 2287 |                 DataType::Struct(ArrowFields::from(vec![ArrowField::new(
 2288 |                     "f1",
 2289 |                     DataType::Utf8,
 2290 |                     true,
 2291 |                 )])),
 2292 |                 true,
 2293 |             ),
 2294 |             ArrowField::new("c", DataType::Float64, false),
 2295 |         ]);
 2296 |         assert_eq!(ArrowSchema::from(&excluded), expected_arrow_schema);
 2297 |     }
 2298 | 
 2299 |     #[test]
 2300 |     fn test_intersection() {
 2301 |         let arrow_schema = ArrowSchema::new(vec![
 2302 |             ArrowField::new("a", DataType::Int32, false),
 2303 |             ArrowField::new(
 2304 |                 "b",
 2305 |                 DataType::Struct(ArrowFields::from(vec![
 2306 |                     ArrowField::new("f1", DataType::Utf8, true),
 2307 |                     ArrowField::new("f2", DataType::Boolean, false),
 2308 |                     ArrowField::new("f3", DataType::Float32, false),
 2309 |                 ])),
 2310 |                 true,
 2311 |             ),
 2312 |             ArrowField::new("c", DataType::Float64, false),
 2313 |         ]);
 2314 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 2315 | 
 2316 |         let arrow_schema = ArrowSchema::new(vec![
 2317 |             ArrowField::new(
 2318 |                 "b",
 2319 |                 DataType::Struct(ArrowFields::from(vec![
 2320 |                     ArrowField::new("f1", DataType::Utf8, true),
 2321 |                     ArrowField::new("f2", DataType::Boolean, false),
 2322 |                 ])),
 2323 |                 true,
 2324 |             ),
 2325 |             ArrowField::new("c", DataType::Float64, false),
 2326 |             ArrowField::new("d", DataType::Utf8, false),
 2327 |         ]);
 2328 |         let other = Schema::try_from(&arrow_schema).unwrap();
 2329 | 
 2330 |         let actual: ArrowSchema = (&schema.intersection(&other).unwrap()).into();
 2331 | 
 2332 |         let expected = ArrowSchema::new(vec![
 2333 |             ArrowField::new(
 2334 |                 "b",
 2335 |                 DataType::Struct(ArrowFields::from(vec![
 2336 |                     ArrowField::new("f1", DataType::Utf8, true),
 2337 |                     ArrowField::new("f2", DataType::Boolean, false),
 2338 |                 ])),
 2339 |                 true,
 2340 |             ),
 2341 |             ArrowField::new("c", DataType::Float64, false),
 2342 |         ]);
 2343 |         assert_eq!(actual, expected);
 2344 | 
 2345 |         let schema_with_list_struct = ArrowSchema::new(vec![ArrowField::new(
 2346 |             "struct_list",
 2347 |             DataType::List(Arc::new(ArrowField::new(
 2348 |                 "item",
 2349 |                 DataType::Struct(ArrowFields::from(vec![
 2350 |                     ArrowField::new("f1", DataType::Utf8, true),
 2351 |                     ArrowField::new("f2", DataType::Boolean, false),
 2352 |                 ])),
 2353 |                 true,
 2354 |             ))),
 2355 |             true,
 2356 |         )]);
 2357 |         let schema_with_list_struct = Schema::try_from(&schema_with_list_struct).unwrap();
 2358 | 
 2359 |         let with_missing_field = schema_with_list_struct.project_by_ids(&[1, 3], false);
 2360 |         let intersection = schema_with_list_struct
 2361 |             .intersection_ignore_types(&with_missing_field)
 2362 |             .unwrap();
 2363 |         assert_eq!(intersection, with_missing_field);
 2364 |         let intersection = with_missing_field
 2365 |             .intersection_ignore_types(&schema_with_list_struct)
 2366 |             .unwrap();
 2367 |         assert_eq!(intersection, with_missing_field);
 2368 |     }
 2369 | 
 2370 |     #[test]
 2371 |     fn test_merge_schemas_and_assign_field_ids() {
 2372 |         let arrow_schema = ArrowSchema::new(vec![
 2373 |             ArrowField::new("a", DataType::Int32, false),
 2374 |             ArrowField::new(
 2375 |                 "b",
 2376 |                 DataType::Struct(ArrowFields::from(vec![
 2377 |                     ArrowField::new("f1", DataType::Utf8, true),
 2378 |                     ArrowField::new("f2", DataType::Boolean, false),
 2379 |                     ArrowField::new("f3", DataType::Float32, false),
 2380 |                 ])),
 2381 |                 true,
 2382 |             ),
 2383 |             ArrowField::new("c", DataType::Float64, false),
 2384 |         ]);
 2385 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 2386 | 
 2387 |         assert_eq!(schema.max_field_id(), Some(5));
 2388 | 
 2389 |         let to_merged_arrow_schema = ArrowSchema::new(vec![
 2390 |             ArrowField::new("d", DataType::Int32, false),
 2391 |             ArrowField::new("e", DataType::Binary, false),
 2392 |         ]);
 2393 |         let to_merged = Schema::try_from(&to_merged_arrow_schema).unwrap();
 2394 |         // It is already assigned with field ids.
 2395 |         assert_eq!(to_merged.max_field_id(), Some(1));
 2396 | 
 2397 |         let mut merged = schema.merge(&to_merged).unwrap();
 2398 |         assert_eq!(merged.max_field_id(), Some(5));
 2399 | 
 2400 |         let field = merged.field("d").unwrap();
 2401 |         assert_eq!(field.id, -1);
 2402 |         let field = merged.field("e").unwrap();
 2403 |         assert_eq!(field.id, -1);
 2404 | 
 2405 |         // Need to explicitly assign field ids. Testing we can pass a larger
 2406 |         // field id to set_field_id.
 2407 |         merged.set_field_id(Some(7));
 2408 |         let field = merged.field("d").unwrap();
 2409 |         assert_eq!(field.id, 8);
 2410 |         let field = merged.field("e").unwrap();
 2411 |         assert_eq!(field.id, 9);
 2412 |         assert_eq!(merged.max_field_id(), Some(9));
 2413 |     }
 2414 | 
 2415 |     #[test]
 2416 |     fn test_merge_schema_metadata_preserves_self_values() {
 2417 |         let schema = Schema {
 2418 |             metadata: HashMap::from([
 2419 |                 ("shared".to_string(), "left".to_string()),
 2420 |                 ("left_only".to_string(), "left".to_string()),
 2421 |             ]),
 2422 |             ..Default::default()
 2423 |         };
 2424 |         let other = Schema {
 2425 |             metadata: HashMap::from([
 2426 |                 ("shared".to_string(), "right".to_string()),
 2427 |                 ("right_only".to_string(), "right".to_string()),
 2428 |             ]),
 2429 |             ..Default::default()
 2430 |         };
 2431 | 
 2432 |         let merged = schema.merge(&other).unwrap();
 2433 | 
 2434 |         assert_eq!(
 2435 |             merged.metadata,
 2436 |             HashMap::from([
 2437 |                 ("shared".to_string(), "left".to_string()),
 2438 |                 ("left_only".to_string(), "left".to_string()),
 2439 |                 ("right_only".to_string(), "right".to_string()),
 2440 |             ])
 2441 |         );
 2442 |     }
 2443 | 
 2444 |     #[test]
 2445 |     fn test_merge_arrow_schema() {
 2446 |         let arrow_schema = ArrowSchema::new(vec![
 2447 |             ArrowField::new("a", DataType::Int32, false),
 2448 |             ArrowField::new(
 2449 |                 "b",
 2450 |                 DataType::Struct(ArrowFields::from(vec![
 2451 |                     ArrowField::new("f1", DataType::Utf8, true),
 2452 |                     ArrowField::new("f2", DataType::Boolean, false),
 2453 |                     ArrowField::new("f3", DataType::Float32, false),
 2454 |                 ])),
 2455 |                 true,
 2456 |             ),
 2457 |             ArrowField::new("c", DataType::Float64, false),
 2458 |         ]);
 2459 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 2460 | 
 2461 |         assert_eq!(schema.max_field_id(), Some(5));
 2462 | 
 2463 |         let to_merged_arrow_schema = ArrowSchema::new(vec![
 2464 |             ArrowField::new("d", DataType::Int32, false),
 2465 |             ArrowField::new("e", DataType::Binary, false),
 2466 |         ]);
 2467 |         let mut merged = schema.merge(&to_merged_arrow_schema).unwrap();
 2468 |         merged.set_field_id(None);
 2469 |         assert_eq!(merged.max_field_id(), Some(7));
 2470 | 
 2471 |         let field = merged.field("d").unwrap();
 2472 |         assert_eq!(field.id, 6);
 2473 |         let field = merged.field("e").unwrap();
 2474 |         assert_eq!(field.id, 7);
 2475 |     }
 2476 | 
 2477 |     #[test]
 2478 |     fn test_merge_nested_field() {
 2479 |         let arrow_schema1 = ArrowSchema::new(vec![ArrowField::new(
 2480 |             "b",
 2481 |             DataType::Struct(ArrowFields::from(vec![
 2482 |                 ArrowField::new(
 2483 |                     "f1",
 2484 |                     DataType::Struct(ArrowFields::from(vec![ArrowField::new(
 2485 |                         "f11",
 2486 |                         DataType::Utf8,
 2487 |                         true,
 2488 |                     )])),
 2489 |                     true,
 2490 |                 ),
 2491 |                 ArrowField::new("f2", DataType::Float32, false),
 2492 |             ])),
 2493 |             true,
 2494 |         )]);
 2495 |         let schema1 = Schema::try_from(&arrow_schema1).unwrap();
 2496 | 
 2497 |         let arrow_schema2 = ArrowSchema::new(vec![ArrowField::new(
 2498 |             "b",
 2499 |             DataType::Struct(ArrowFields::from(vec![
 2500 |                 ArrowField::new(
 2501 |                     "f1",
 2502 |                     DataType::Struct(ArrowFields::from(vec![ArrowField::new(
 2503 |                         "f22",
 2504 |                         DataType::Utf8,
 2505 |                         true,
 2506 |                     )])),
 2507 |                     true,
 2508 |                 ),
 2509 |                 ArrowField::new("f3", DataType::Float32, false),
 2510 |             ])),
 2511 |             true,
 2512 |         )]);
 2513 |         let schema2 = Schema::try_from(&arrow_schema2).unwrap();
 2514 | 
 2515 |         let expected_arrow_schema = ArrowSchema::new(vec![ArrowField::new(
 2516 |             "b",
 2517 |             DataType::Struct(ArrowFields::from(vec![
 2518 |                 ArrowField::new(
 2519 |                     "f1",
 2520 |                     DataType::Struct(ArrowFields::from(vec![
 2521 |                         ArrowField::new("f11", DataType::Utf8, true),
 2522 |                         ArrowField::new("f22", DataType::Utf8, true),
 2523 |                     ])),
 2524 |                     true,
 2525 |                 ),
 2526 |                 ArrowField::new("f2", DataType::Float32, false),
 2527 |                 ArrowField::new("f3", DataType::Float32, false),
 2528 |             ])),
 2529 |             true,
 2530 |         )]);
 2531 |         let mut expected_schema = Schema::try_from(&expected_arrow_schema).unwrap();
 2532 |         expected_schema.fields[0]
 2533 |             .child_mut("f1")
 2534 |             .unwrap()
 2535 |             .child_mut("f22")
 2536 |             .unwrap()
 2537 |             .id = 4;
 2538 |         expected_schema.fields[0].child_mut("f2").unwrap().id = 3;
 2539 | 
 2540 |         let mut result = schema1.merge(&schema2).unwrap();
 2541 |         result.set_field_id(None);
 2542 |         assert_eq!(result, expected_schema);
 2543 |     }
 2544 | 
 2545 |     #[test]
 2546 |     fn test_field_by_id() {
 2547 |         let arrow_schema = ArrowSchema::new(vec![
 2548 |             ArrowField::new("a", DataType::Int32, false),
 2549 |             ArrowField::new(
 2550 |                 "b",
 2551 |                 DataType::Struct(ArrowFields::from(vec![
 2552 |                     ArrowField::new("f1", DataType::Utf8, true),
 2553 |                     ArrowField::new("f2", DataType::Boolean, false),
 2554 |                     ArrowField::new("f3", DataType::Float32, false),
 2555 |                 ])),
 2556 |                 true,
 2557 |             ),
 2558 |             ArrowField::new("c", DataType::Float64, false),
 2559 |         ]);
 2560 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 2561 | 
 2562 |         let field = schema.field_by_id(1).unwrap();
 2563 |         assert_eq!(field.name, "b");
 2564 | 
 2565 |         let field = schema.field_by_id(3).unwrap();
 2566 |         assert_eq!(field.name, "f2");
 2567 |     }
 2568 | 
 2569 |     #[test]
 2570 |     fn test_explain_difference() {
 2571 |         let expected = ArrowSchema::new(vec![
 2572 |             ArrowField::new("a", DataType::Int32, false),
 2573 |             ArrowField::new(
 2574 |                 "b",
 2575 |                 DataType::Struct(ArrowFields::from(vec![
 2576 |                     ArrowField::new("f1", DataType::Utf8, true),
 2577 |                     ArrowField::new("f2", DataType::Boolean, false),
 2578 |                     ArrowField::new("f3", DataType::Float32, false),
 2579 |                 ])),
 2580 |                 true,
 2581 |             ),
 2582 |             ArrowField::new("c", DataType::Float64, false),
 2583 |         ]);
 2584 |         let expected = Schema::try_from(&expected).unwrap();
 2585 | 
 2586 |         let mismatched = ArrowSchema::new(vec![
 2587 |             ArrowField::new("a", DataType::Int32, false),
 2588 |             ArrowField::new(
 2589 |                 "b",
 2590 |                 DataType::Struct(ArrowFields::from(vec![
 2591 |                     ArrowField::new("f1", DataType::Utf8, true),
 2592 |                     ArrowField::new("f3", DataType::Float32, false),
 2593 |                 ])),
 2594 |                 true,
 2595 |             ),
 2596 |             ArrowField::new("c", DataType::Float64, true),
 2597 |         ]);
 2598 |         let mismatched = Schema::try_from(&mismatched).unwrap();
 2599 | 
 2600 |         assert_eq!(
 2601 |             mismatched.explain_difference(&expected, &SchemaCompareOptions::default()),
 2602 |             Some(
 2603 |                 "`b` had mismatched children: fields did not match, missing=[b.f2], \
 2604 |                   unexpected=[], `c` should have nullable=false but nullable=true"
 2605 |                     .to_string()
 2606 |             )
 2607 |         );
 2608 |     }
 2609 | 
 2610 |     #[test]
 2611 |     fn test_schema_difference_subschema() {
 2612 |         let expected = ArrowSchema::new(vec![
 2613 |             ArrowField::new("a", DataType::Int32, false),
 2614 |             ArrowField::new(
 2615 |                 "b",
 2616 |                 DataType::Struct(ArrowFields::from(vec![
 2617 |                     ArrowField::new("f1", DataType::Utf8, true),
 2618 |                     ArrowField::new("f2", DataType::Boolean, false),
 2619 |                     ArrowField::new("f3", DataType::Float32, false),
 2620 |                 ])),
 2621 |                 true,
 2622 |             ),
 2623 |             ArrowField::new("c", DataType::Float64, true),
 2624 |         ]);
 2625 |         let expected = Schema::try_from(&expected).unwrap();
 2626 | 
 2627 |         // Can omit nullable fields and subfields
 2628 |         let subschema = ArrowSchema::new(vec![
 2629 |             ArrowField::new("a", DataType::Int32, false),
 2630 |             ArrowField::new(
 2631 |                 "b",
 2632 |                 DataType::Struct(ArrowFields::from(vec![
 2633 |                     ArrowField::new("f2", DataType::Boolean, false),
 2634 |                     ArrowField::new("f3", DataType::Float32, false),
 2635 |                 ])),
 2636 |                 true,
 2637 |             ),
 2638 |         ]);
 2639 |         let subschema = Schema::try_from(&subschema).unwrap();
 2640 | 
 2641 |         assert!(!subschema.compare_with_options(&expected, &SchemaCompareOptions::default()));
 2642 |         assert_eq!(
 2643 |             subschema.explain_difference(&expected, &SchemaCompareOptions::default()),
 2644 |             Some(
 2645 |                 "fields did not match, missing=[c], unexpected=[], `b` had mismatched \
 2646 |                  children: fields did not match, missing=[b.f1], unexpected=[]"
 2647 |                     .to_string()
 2648 |             )
 2649 |         );
 2650 |         let options = SchemaCompareOptions {
 2651 |             allow_missing_if_nullable: true,
 2652 |             ..Default::default()
 2653 |         };
 2654 |         assert!(subschema.compare_with_options(&expected, &options));
 2655 |         let res = subschema.explain_difference(&expected, &options);
 2656 |         assert!(res.is_none(), "Expected None, got {:?}", res);
 2657 | 
 2658 |         // Omitting non-nullable fields should fail
 2659 |         let subschema = ArrowSchema::new(vec![ArrowField::new(
 2660 |             "b",
 2661 |             DataType::Struct(ArrowFields::from(vec![ArrowField::new(
 2662 |                 "f2",
 2663 |                 DataType::Boolean,
 2664 |                 false,
 2665 |             )])),
 2666 |             true,
 2667 |         )]);
 2668 |         let subschema = Schema::try_from(&subschema).unwrap();
 2669 |         assert!(!subschema.compare_with_options(&expected, &options));
 2670 |         assert_eq!(
 2671 |             subschema.explain_difference(&expected, &options),
 2672 |             Some(
 2673 |                 "fields did not match, missing=[a], unexpected=[], `b` had mismatched \
 2674 |                  children: fields did not match, missing=[b.f3], unexpected=[]"
 2675 |                     .to_string()
 2676 |             )
 2677 |         );
 2678 | 
 2679 |         let out_of_order = ArrowSchema::new(vec![
 2680 |             ArrowField::new("c", DataType::Float64, true),
 2681 |             ArrowField::new(
 2682 |                 "b",
 2683 |                 DataType::Struct(ArrowFields::from(vec![
 2684 |                     ArrowField::new("f3", DataType::Float32, false),
 2685 |                     ArrowField::new("f2", DataType::Boolean, false),
 2686 |                     ArrowField::new("f1", DataType::Utf8, true),
 2687 |                 ])),
 2688 |                 true,
 2689 |             ),
 2690 |             ArrowField::new("a", DataType::Int32, false),
 2691 |         ]);
 2692 |         let out_of_order = Schema::try_from(&out_of_order).unwrap();
 2693 |         assert!(!out_of_order.compare_with_options(&expected, &options));
 2694 |         assert_eq!(
 2695 |             subschema.explain_difference(&expected, &options),
 2696 |             Some(
 2697 |                 "fields did not match, missing=[a], unexpected=[], `b` had mismatched \
 2698 |                  children: fields did not match, missing=[b.f3], unexpected=[]"
 2699 |                     .to_string()
 2700 |             )
 2701 |         );
 2702 | 
 2703 |         let options = SchemaCompareOptions {
 2704 |             ignore_field_order: true,
 2705 |             ..Default::default()
 2706 |         };
 2707 |         assert!(out_of_order.compare_with_options(&expected, &options));
 2708 |         let res = out_of_order.explain_difference(&expected, &options);
 2709 |         assert!(res.is_none(), "Expected None, got {:?}", res);
 2710 |     }
 2711 | 
 2712 |     #[test]
 2713 |     fn test_schema_unenforced_primary_key() {
 2714 |         let cases = vec![
 2715 |             ArrowSchema::new(vec![ArrowField::new("a", DataType::Int32, false)]),
 2716 |             ArrowSchema::new(vec![
 2717 |                 ArrowField::new("a", DataType::Int32, false).with_metadata(
 2718 |                     vec![(
 2719 |                         "lance-schema:unenforced-primary-key".to_owned(),
 2720 |                         "true".to_owned(),
 2721 |                     )]
 2722 |                     .into_iter()
 2723 |                     .collect::<HashMap<_, _>>(),
 2724 |                 ),
 2725 |             ]),
 2726 |             ArrowSchema::new(vec![
 2727 |                 ArrowField::new("a", DataType::Int32, false).with_metadata(
 2728 |                     vec![(
 2729 |                         "lance-schema:unenforced-primary-key".to_owned(),
 2730 |                         "true".to_owned(),
 2731 |                     )]
 2732 |                     .into_iter()
 2733 |                     .collect::<HashMap<_, _>>(),
 2734 |                 ),
 2735 |                 ArrowField::new(
 2736 |                     "b",
 2737 |                     DataType::Struct(ArrowFields::from(vec![
 2738 |                         ArrowField::new("f1", DataType::Utf8, false).with_metadata(
 2739 |                             vec![(
 2740 |                                 "lance-schema:unenforced-primary-key".to_owned(),
 2741 |                                 "true".to_owned(),
 2742 |                             )]
 2743 |                             .into_iter()
 2744 |                             .collect::<HashMap<_, _>>(),
 2745 |                         ),
 2746 |                     ])),
 2747 |                     false,
 2748 |                 ),
 2749 |             ]),
 2750 |         ];
 2751 |         let expected = [
 2752 |             vec![],
 2753 |             vec!["a".to_owned()],
 2754 |             vec!["a".to_owned(), "f1".to_owned()],
 2755 |         ];
 2756 | 
 2757 |         for (idx, case) in cases.into_iter().enumerate() {
 2758 |             let schema = Schema::try_from(&case).unwrap();
 2759 |             assert_eq!(
 2760 |                 schema
 2761 |                     .unenforced_primary_key()
 2762 |                     .iter()
 2763 |                     .map(|f| f.name.clone())
 2764 |                     .collect::<Vec<_>>(),
 2765 |                 expected[idx]
 2766 |             );
 2767 |         }
 2768 |     }
 2769 | 
 2770 |     #[test]
 2771 |     fn test_schema_unenforced_primary_key_failures() {
 2772 |         let cases = vec![
 2773 |             ArrowSchema::new(vec![
 2774 |                 ArrowField::new("a", DataType::Int32, true).with_metadata(
 2775 |                     vec![(
 2776 |                         "lance-schema:unenforced-primary-key".to_owned(),
 2777 |                         "true".to_owned(),
 2778 |                     )]
 2779 |                     .into_iter()
 2780 |                     .collect::<HashMap<_, _>>(),
 2781 |                 ),
 2782 |             ]),
 2783 |             ArrowSchema::new(vec![
 2784 |                 ArrowField::new(
 2785 |                     "b",
 2786 |                     DataType::Struct(ArrowFields::from(vec![ArrowField::new(
 2787 |                         "f1",
 2788 |                         DataType::Utf8,
 2789 |                         false,
 2790 |                     )])),
 2791 |                     false,
 2792 |                 )
 2793 |                 .with_metadata(
 2794 |                     vec![(
 2795 |                         "lance-schema:unenforced-primary-key".to_owned(),
 2796 |                         "true".to_owned(),
 2797 |                     )]
 2798 |                     .into_iter()
 2799 |                     .collect::<HashMap<_, _>>(),
 2800 |                 ),
 2801 |             ]),
 2802 |             ArrowSchema::new(vec![ArrowField::new(
 2803 |                 "b",
 2804 |                 DataType::Struct(ArrowFields::from(vec![
 2805 |                     ArrowField::new("f1", DataType::Utf8, false).with_metadata(
 2806 |                         vec![(
 2807 |                             "lance-schema:unenforced-primary-key".to_owned(),
 2808 |                             "true".to_owned(),
 2809 |                         )]
 2810 |                         .into_iter()
 2811 |                         .collect::<HashMap<_, _>>(),
 2812 |                     ),
 2813 |                 ])),
 2814 |                 true,
 2815 |             )]),
 2816 |             ArrowSchema::new(vec![ArrowField::new(
 2817 |                 "b",
 2818 |                 DataType::List(Arc::new(
 2819 |                     ArrowField::new("f1", DataType::Utf8, false).with_metadata(
 2820 |                         vec![(
 2821 |                             "lance-schema:unenforced-primary-key".to_owned(),
 2822 |                             "true".to_owned(),
 2823 |                         )]
 2824 |                         .into_iter()
 2825 |                         .collect::<HashMap<_, _>>(),
 2826 |                     ),
 2827 |                 )),
 2828 |                 false,
 2829 |             )]),
 2830 |         ];
 2831 |         let error_message_contains = [
 2832 |             "Primary key column and all its ancestors must not be nullable",
 2833 |             "Primary key column must be a leaf",
 2834 |             "Primary key column and all its ancestors must not be nullable",
 2835 |             "Primary key column must not be in a list type",
 2836 |         ];
 2837 | 
 2838 |         for (idx, case) in cases.into_iter().enumerate() {
 2839 |             let result = Schema::try_from(&case);
 2840 |             assert!(result.is_err());
 2841 |             assert!(
 2842 |                 result
 2843 |                     .unwrap_err()
 2844 |                     .to_string()
 2845 |                     .contains(error_message_contains[idx])
 2846 |             );
 2847 |         }
 2848 |     }
 2849 | 
 2850 |     #[test]
 2851 |     fn test_schema_unenforced_primary_key_ordering() {
 2852 |         use crate::datatypes::field::LANCE_UNENFORCED_PRIMARY_KEY_POSITION;
 2853 | 
 2854 |         // When positions are specified, fields are ordered by their position values
 2855 |         let arrow_schema = ArrowSchema::new(vec![
 2856 |             ArrowField::new("a", DataType::Int32, false).with_metadata(
 2857 |                 vec![
 2858 |                     (
 2859 |                         "lance-schema:unenforced-primary-key".to_owned(),
 2860 |                         "true".to_owned(),
 2861 |                     ),
 2862 |                     (
 2863 |                         LANCE_UNENFORCED_PRIMARY_KEY_POSITION.to_owned(),
 2864 |                         "2".to_owned(),
 2865 |                     ),
 2866 |                 ]
 2867 |                 .into_iter()
 2868 |                 .collect::<HashMap<_, _>>(),
 2869 |             ),
 2870 |             ArrowField::new("b", DataType::Int64, false).with_metadata(
 2871 |                 vec![
 2872 |                     (
 2873 |                         "lance-schema:unenforced-primary-key".to_owned(),
 2874 |                         "true".to_owned(),
 2875 |                     ),
 2876 |                     (
 2877 |                         LANCE_UNENFORCED_PRIMARY_KEY_POSITION.to_owned(),
 2878 |                         "1".to_owned(),
 2879 |                     ),
 2880 |                 ]
 2881 |                 .into_iter()
 2882 |                 .collect::<HashMap<_, _>>(),
 2883 |             ),
 2884 |         ]);
 2885 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 2886 |         let pk_fields = schema.unenforced_primary_key();
 2887 |         assert_eq!(pk_fields.len(), 2);
 2888 |         assert_eq!(pk_fields[0].name, "b");
 2889 |         assert_eq!(pk_fields[1].name, "a");
 2890 | 
 2891 |         // When positions are not specified, fields are ordered by their schema field id
 2892 |         let arrow_schema = ArrowSchema::new(vec![
 2893 |             ArrowField::new("c", DataType::Int32, false).with_metadata(
 2894 |                 vec![(
 2895 |                     "lance-schema:unenforced-primary-key".to_owned(),
 2896 |                     "true".to_owned(),
 2897 |                 )]
 2898 |                 .into_iter()
 2899 |                 .collect::<HashMap<_, _>>(),
 2900 |             ),
 2901 |             ArrowField::new("d", DataType::Int64, false).with_metadata(
 2902 |                 vec![(
 2903 |                     "lance-schema:unenforced-primary-key".to_owned(),
 2904 |                     "true".to_owned(),
 2905 |                 )]
 2906 |                 .into_iter()
 2907 |                 .collect::<HashMap<_, _>>(),
 2908 |             ),
 2909 |         ]);
 2910 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 2911 |         let pk_fields = schema.unenforced_primary_key();
 2912 |         assert_eq!(pk_fields.len(), 2);
 2913 |         assert_eq!(pk_fields[0].name, "c");
 2914 |         assert_eq!(pk_fields[1].name, "d");
 2915 | 
 2916 |         // Fields with explicit positions are ordered before fields without
 2917 |         let arrow_schema = ArrowSchema::new(vec![
 2918 |             ArrowField::new("e", DataType::Int32, false).with_metadata(
 2919 |                 vec![(
 2920 |                     "lance-schema:unenforced-primary-key".to_owned(),
 2921 |                     "true".to_owned(),
 2922 |                 )]
 2923 |                 .into_iter()
 2924 |                 .collect::<HashMap<_, _>>(),
 2925 |             ),
 2926 |             ArrowField::new("f", DataType::Int64, false).with_metadata(
 2927 |                 vec![
 2928 |                     (
 2929 |                         "lance-schema:unenforced-primary-key".to_owned(),
 2930 |                         "true".to_owned(),
 2931 |                     ),
 2932 |                     (
 2933 |                         LANCE_UNENFORCED_PRIMARY_KEY_POSITION.to_owned(),
 2934 |                         "1".to_owned(),
 2935 |                     ),
 2936 |                 ]
 2937 |                 .into_iter()
 2938 |                 .collect::<HashMap<_, _>>(),
 2939 |             ),
 2940 |             ArrowField::new("g", DataType::Utf8, false).with_metadata(
 2941 |                 vec![(
 2942 |                     "lance-schema:unenforced-primary-key".to_owned(),
 2943 |                     "true".to_owned(),
 2944 |                 )]
 2945 |                 .into_iter()
 2946 |                 .collect::<HashMap<_, _>>(),
 2947 |             ),
 2948 |         ]);
 2949 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 2950 |         let pk_fields = schema.unenforced_primary_key();
 2951 |         assert_eq!(pk_fields.len(), 3);
 2952 |         assert_eq!(pk_fields[0].name, "f");
 2953 |         assert_eq!(pk_fields[1].name, "e");
 2954 |         assert_eq!(pk_fields[2].name, "g");
 2955 |     }
 2956 | 
 2957 |     #[test]
 2958 |     fn test_project_with_suggestion() {
 2959 |         let arrow_schema = ArrowSchema::new(vec![
 2960 |             ArrowField::new("vector", ArrowDataType::Float32, false),
 2961 |             ArrowField::new("label", ArrowDataType::Utf8, true),
 2962 |             ArrowField::new("score", ArrowDataType::Float64, false),
 2963 |         ]);
 2964 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 2965 | 
 2966 |         // Typo: "vectr" is close to "vector" → should get suggestion
 2967 |         let err = schema.project(&["vectr"]).unwrap_err();
 2968 |         let msg = err.to_string();
 2969 |         assert!(
 2970 |             msg.contains("Did you mean 'vector'?"),
 2971 |             "Expected suggestion for 'vectr', got: {}",
 2972 |             msg
 2973 |         );
 2974 |         // Should also list available fields
 2975 |         assert!(
 2976 |             msg.contains("Available fields:"),
 2977 |             "Expected available fields list, got: {}",
 2978 |             msg
 2979 |         );
 2980 | 
 2981 |         // Completely wrong name → no suggestion but still lists fields
 2982 |         let err = schema.project(&["nonexistent_column"]).unwrap_err();
 2983 |         let msg = err.to_string();
 2984 |         assert!(
 2985 |             !msg.contains("Did you mean"),
 2986 |             "Should not suggest for completely different name, got: {}",
 2987 |             msg
 2988 |         );
 2989 |         assert!(
 2990 |             msg.contains("Available fields:"),
 2991 |             "Expected available fields list even without suggestion, got: {}",
 2992 |             msg
 2993 |         );
 2994 |     }
 2995 | 
 2996 |     #[test]
 2997 |     fn test_field_paths() {
 2998 |         let arrow_schema = ArrowSchema::new(vec![
 2999 |             ArrowField::new("id", ArrowDataType::Int32, false),
 3000 |             ArrowField::new("vector", ArrowDataType::Float32, false),
 3001 |             ArrowField::new("name", ArrowDataType::Utf8, true),
 3002 |         ]);
 3003 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 3004 |         let paths = schema.field_paths();
 3005 |         assert!(paths.contains(&"id".to_string()));
 3006 |         assert!(paths.contains(&"vector".to_string()));
 3007 |         assert!(paths.contains(&"name".to_string()));
 3008 |     }
 3009 | 
 3010 |     #[test]
 3011 |     fn test_field_path_minimal() {
 3012 |         // A struct child whose own NAME contains a dot is the case that makes
 3013 |         // "just strip all backticks" wrong: it must stay quoted to round-trip.
 3014 |         let arrow_schema = ArrowSchema::new(vec![
 3015 |             ArrowField::new("mycol", ArrowDataType::Int32, false),
 3016 |             ArrowField::new("my_col", ArrowDataType::Int32, false),
 3017 |             ArrowField::new("my-col", ArrowDataType::Int32, false),
 3018 |             ArrowField::new(
 3019 |                 "parent",
 3020 |                 ArrowDataType::Struct(ArrowFields::from(vec![
 3021 |                     ArrowField::new("child-field", ArrowDataType::Int32, true),
 3022 |                     ArrowField::new("child.x", ArrowDataType::Int32, true),
 3023 |                     ArrowField::new("child`x", ArrowDataType::Int32, true),
 3024 |                 ])),
 3025 |                 true,
 3026 |             ),
 3027 |         ]);
 3028 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 3029 |         let id_of = |path: &str| schema.field(path).unwrap().id;
 3030 |         let child_id = |name: &str| {
 3031 |             schema
 3032 |                 .field("parent")
 3033 |                 .unwrap()
 3034 |                 .children
 3035 |                 .iter()
 3036 |                 .find(|c| c.name == name)
 3037 |                 .unwrap()
 3038 |                 .id
 3039 |         };
 3040 | 
 3041 |         // Plain identifiers: unchanged by either method.
 3042 |         assert_eq!(schema.field_path_minimal(id_of("mycol")).unwrap(), "mycol");
 3043 |         assert_eq!(
 3044 |             schema.field_path_minimal(id_of("my_col")).unwrap(),
 3045 |             "my_col"
 3046 |         );
 3047 | 
 3048 |         // Hyphen is NOT special to parse_field_path, so minimal quoting leaves it
 3049 |         // bare (field_path would quote it for SQL safety).
 3050 |         assert_eq!(schema.field_path(id_of("my-col")).unwrap(), "`my-col`");
 3051 |         assert_eq!(
 3052 |             schema.field_path_minimal(id_of("my-col")).unwrap(),
 3053 |             "my-col"
 3054 |         );
 3055 | 
 3056 |         // Nested hyphenated leaf: bare under minimal quoting.
 3057 |         assert_eq!(
 3058 |             schema.field_path_minimal(child_id("child-field")).unwrap(),
 3059 |             "parent.child-field"
 3060 |         );
 3061 | 
 3062 |         // Nested leaf whose NAME contains a dot: MUST stay quoted so it
 3063 |         // round-trips through parse_field_path (this is the regression guard).
 3064 |         let dotted = schema.field_path_minimal(child_id("child.x")).unwrap();
 3065 |         assert_eq!(dotted, "parent.`child.x`");
 3066 |         assert_eq!(
 3067 |             parse_field_path(&dotted).unwrap(),
 3068 |             vec!["parent".to_string(), "child.x".to_string()]
 3069 |         );
 3070 | 
 3071 |         // Nested leaf whose NAME contains a backtick: it must be quoted AND the
 3072 |         // backtick doubled so it round-trips through parse_field_path.
 3073 |         let backticked = schema.field_path_minimal(child_id("child`x")).unwrap();
 3074 |         assert_eq!(backticked, "parent.`child``x`");
 3075 |         assert_eq!(
 3076 |             parse_field_path(&backticked).unwrap(),
 3077 |             vec!["parent".to_string(), "child`x".to_string()]
 3078 |         );
 3079 |     }
 3080 | 
 3081 |     #[test]
 3082 |     fn test_validate_rejects_zero_dimension_fixed_size_list() {
 3083 |         // A zero dimension divides-by-zero further down the write path (#5102)
 3084 |         let fsl = |dimension: i32| {
 3085 |             ArrowDataType::FixedSizeList(
 3086 |                 Arc::new(ArrowField::new("item", ArrowDataType::Float32, true)),
 3087 |                 dimension,
 3088 |             )
 3089 |         };
 3090 | 
 3091 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new("vec", fsl(0), true)]);
 3092 |         let err = Schema::try_from(&arrow_schema).unwrap_err();
 3093 |         assert!(
 3094 |             err.to_string()
 3095 |                 .contains("dimension must be a positive integer"),
 3096 |             "unexpected error: {}",
 3097 |             err
 3098 |         );
 3099 | 
 3100 |         // Nested inside a struct is rejected too
 3101 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new(
 3102 |             "outer",
 3103 |             ArrowDataType::Struct(ArrowFields::from(vec![ArrowField::new(
 3104 |                 "vec",
 3105 |                 fsl(0),
 3106 |                 true,
 3107 |             )])),
 3108 |             true,
 3109 |         )]);
 3110 |         let err = Schema::try_from(&arrow_schema).unwrap_err();
 3111 |         assert!(
 3112 |             err.to_string()
 3113 |                 .contains("dimension must be a positive integer"),
 3114 |             "unexpected error: {}",
 3115 |             err
 3116 |         );
 3117 | 
 3118 |         // A zero-dimension FixedSizeList nested inside a positive-dimension
 3119 |         // FixedSizeList collapses into a single leaf field, so the inner
 3120 |         // dimension is not visited by the pre-order field walk and must still
 3121 |         // be rejected: FixedSizeList(FixedSizeList(Float32, 0), 4).
 3122 |         let nested =
 3123 |             ArrowDataType::FixedSizeList(Arc::new(ArrowField::new("inner", fsl(0), true)), 4);
 3124 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new("vec", nested, true)]);
 3125 |         let err = Schema::try_from(&arrow_schema).unwrap_err();
 3126 |         assert!(
 3127 |             err.to_string()
 3128 |                 .contains("dimension must be a positive integer"),
 3129 |             "unexpected error: {}",
 3130 |             err
 3131 |         );
 3132 | 
 3133 |         // A positive dimension still validates, including nested lists
 3134 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new("vec", fsl(2), true)]);
 3135 |         assert!(Schema::try_from(&arrow_schema).is_ok());
 3136 |         let nested_ok =
 3137 |             ArrowDataType::FixedSizeList(Arc::new(ArrowField::new("inner", fsl(2), true)), 4);
 3138 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new("vec", nested_ok, true)]);
 3139 |         assert!(Schema::try_from(&arrow_schema).is_ok());
 3140 |     }
 3141 | 
 3142 |     #[test]
 3143 |     fn test_schema_unenforced_clustering_key() {
 3144 |         use crate::datatypes::field::LANCE_UNENFORCED_CLUSTERING_KEY_POSITION;
 3145 | 
 3146 |         // No clustering key fields
 3147 |         let arrow_schema = ArrowSchema::new(vec![
 3148 |             ArrowField::new("a", DataType::Int32, false),
 3149 |             ArrowField::new("b", DataType::Utf8, true),
 3150 |         ]);
 3151 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 3152 |         assert!(schema.unenforced_clustering_key().is_empty());
 3153 | 
 3154 |         // Single clustering key field
 3155 |         let arrow_schema = ArrowSchema::new(vec![
 3156 |             ArrowField::new("a", DataType::Int32, false).with_metadata(
 3157 |                 vec![(
 3158 |                     LANCE_UNENFORCED_CLUSTERING_KEY_POSITION.to_owned(),
 3159 |                     "1".to_owned(),
 3160 |                 )]
 3161 |                 .into_iter()
 3162 |                 .collect::<HashMap<_, _>>(),
 3163 |             ),
 3164 |             ArrowField::new("b", DataType::Utf8, true),
 3165 |         ]);
 3166 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 3167 |         let ck = schema.unenforced_clustering_key();
 3168 |         assert_eq!(ck.len(), 1);
 3169 |         assert_eq!(ck[0].name, "a");
 3170 | 
 3171 |         // Clustering key fields can be nullable (unlike primary keys)
 3172 |         let arrow_schema = ArrowSchema::new(vec![
 3173 |             ArrowField::new("a", DataType::Int32, true).with_metadata(
 3174 |                 vec![(
 3175 |                     LANCE_UNENFORCED_CLUSTERING_KEY_POSITION.to_owned(),
 3176 |                     "1".to_owned(),
 3177 |                 )]
 3178 |                 .into_iter()
 3179 |                 .collect::<HashMap<_, _>>(),
 3180 |             ),
 3181 |         ]);
 3182 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 3183 |         assert_eq!(schema.unenforced_clustering_key().len(), 1);
 3184 |     }
 3185 | 
 3186 |     #[test]
 3187 |     fn test_schema_unenforced_clustering_key_ordering() {
 3188 |         use crate::datatypes::field::LANCE_UNENFORCED_CLUSTERING_KEY_POSITION;
 3189 | 
 3190 |         // Fields ordered by position regardless of schema column order
 3191 |         let arrow_schema = ArrowSchema::new(vec![
 3192 |             ArrowField::new("c", DataType::Utf8, true).with_metadata(
 3193 |                 vec![(
 3194 |                     LANCE_UNENFORCED_CLUSTERING_KEY_POSITION.to_owned(),
 3195 |                     "3".to_owned(),
 3196 |                 )]
 3197 |                 .into_iter()
 3198 |                 .collect::<HashMap<_, _>>(),
 3199 |             ),
 3200 |             ArrowField::new("a", DataType::Int32, false).with_metadata(
 3201 |                 vec![(
 3202 |                     LANCE_UNENFORCED_CLUSTERING_KEY_POSITION.to_owned(),
 3203 |                     "1".to_owned(),
 3204 |                 )]
 3205 |                 .into_iter()
 3206 |                 .collect::<HashMap<_, _>>(),
 3207 |             ),
 3208 |             ArrowField::new("b", DataType::Int64, false).with_metadata(
 3209 |                 vec![(
 3210 |                     LANCE_UNENFORCED_CLUSTERING_KEY_POSITION.to_owned(),
 3211 |                     "2".to_owned(),
 3212 |                 )]
 3213 |                 .into_iter()
 3214 |                 .collect::<HashMap<_, _>>(),
 3215 |             ),
 3216 |             ArrowField::new("d", DataType::Float64, true),
 3217 |         ]);
 3218 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 3219 |         let ck = schema.unenforced_clustering_key();
 3220 |         assert_eq!(ck.len(), 3);
 3221 |         assert_eq!(ck[0].name, "a");
 3222 |         assert_eq!(ck[1].name, "b");
 3223 |         assert_eq!(ck[2].name, "c");
 3224 |     }
 3225 | }
``````
