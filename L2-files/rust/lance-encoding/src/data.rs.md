> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/data.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `6023054ea4bfd4a4e6550b0573c0c7f9e8d5128e8754d9c4159b41147ad2ecaa`. Reviewed physical lines: 1-2898.

[Module](../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Physical DataBlock representations, Arrow normalization and validated reconstruction, shared statistics, range builders, dictionary/null conversion and regression tests. (rust/lance-encoding/src/data.rs:1-2898)

## Complete range analysis

### Lines 1-16

License and module docs place DataBlock between Arrow ArrayData and typed arrays: physical representations can combine logical types and expose codec-oriented buffers. Docs require variable offsets to start at zero; Arrow conversion validation actually permits a bounded nonzero first offset. Public fields do not enforce this invariant. (rust/lance-encoding/src/data.rs:1-16)

### Lines 17-38

Imports connect Arrow arrays/dictionary keys, buffer builders, checked ArrayData construction, datatype byte widths, LanceBuffer, errors and statistics. No asynchronous work or IO is implemented here. Arc/RwLock protect the shared statistics map, not mutable physical data. (rust/lance-encoding/src/data.rs:17-38)

### Lines 39-60

Public AllNullDataBlock contains only num_values. Arrow conversion creates a null array of the requested type with count cast to usize; validate is ignored. Serialization has no buffers. A comment plans deprecation in2.1 but the type has no deprecated attribute and remains dispatched. (rust/lance-encoding/src/data.rs:39-60)

### Lines 61-87

Public BlockInfo tuple exposes Arc<RwLock<HashMap<Stat,Arc<dyn Array>>>>. Default/new allocate an empty map. Clones share the map and statistic arrays. PartialEq acquires both read locks and compares entries, unwrapping poison errors. It does not compare Arc identity. Cache validity is not tied to buffer mutation. (rust/lance-encoding/src/data.rs:61-87)

### Lines 88-121

Public NullableDataBlock contains boxed child, packed validity bytes and shared stats. Arrow conversion always converts child with validation enabled, attaches validity and performs checked build. Serialized validity precedes child buffers; data_size adds visible validity bytes. Legacy-deprecation comment is future intent, not an attribute or removed implementation. (rust/lance-encoding/src/data.rs:88-121)

### Lines 122-153

Public ConstantDataBlock stores one scalar byte sequence and logical count. into_buffers emits one scalar buffer and data_size measures only that buffer, not expanded values. Arrow conversion is todo and panics. try_clone returns Ok with a cheap buffer clone and copied count. (rust/lance-encoding/src/data.rs:122-153)

### Lines 154-193

Public FixedWidthDataBlock exposes data, bits_per_value, num_values and BlockInfo. do_into_arrow repacks bits_per_value8 into packed Boolean bits by taking at most declared count bytes and treating nonzero as true; otherwise moves the buffer directly. Checked Arrow construction uses requested datatype/count/null_count0, but no independent physical-width versus requested-type equality check except the Boolean branch. (rust/lance-encoding/src/data.rs:154-193)

### Lines 194-218

FixedWidth public into_arrow ignores the caller validation flag and always uses checked construction. Serialization returns one buffer; try_clone copies metadata and shares buffer/statistics ownership; data_size reports visible byte length. This is not retained allocation size. (rust/lance-encoding/src/data.rs:194-218)

### Lines 219-233

Private generic VariableWidthDataBlockBuilder stores offsets Vec<T> initially[0] and byte Vec with estimated capacity cast to usize. Offset type is chosen when the first input establishes builder shape. (rust/lance-encoding/src/data.rs:219-233)

### Lines 234-266

Variable builder validate_append unwraps VariableWidth and validates selected offsets. append_validated assumes that proof, debug-checks width and borrows typed offsets. It computes selected byte span and checked-adds its length to current data; arithmetic overflow or inability to represent new total in T returns NotSupported before mutation. (rust/lance-encoding/src/data.rs:234-266)

### Lines 267-296

After size checks, variable builder copies the selected payload and appends rebased offsets after the selection start. Finish derives count from offsets.len()-1 and emits owned buffers with fresh empty stats. Selected-range validation need not inspect offsets outside that range; this builder does not validate UTF-8. (rust/lance-encoding/src/data.rs:267-296)

### Lines 297-336

Private BitmapDataBlockBuilder reserves estimated_bytes*8 bits, with unchecked multiplication. Validation is a no-op; append unwraps FixedWidth and appends selected packed bits without an explicit bits_per_value check or declared-count bound. Finish creates bits_per_value1 with builder logical length and fresh stats. (rust/lance-encoding/src/data.rs:297-336)

### Lines 337-379

Private FixedWidthDataBlockBuilder asserts a multiple-of-eight width, stores bytes_per_value and reserves estimated bytes. Validation is a no-op. Append asserts matching bit width, multiplies cast range endpoints by byte width and slices bytes; malformed ranges can panic. Zero bits pass construction but finish divides by zero. Finish count derives from appended byte length. (rust/lance-encoding/src/data.rs:337-379)

### Lines 380-421

Private StructDataBlockBuilder stores child builders. Validation indexes input children for each builder and validates all before appending. Too few children panic; extra children are ignored. Child appends occur sequentially, so a later append error can leave prior children changed. Finish always sets parent validity None and creates empty stats, discarding input parent validity. (rust/lance-encoding/src/data.rs:380-421)

### Lines 422-443

Private default AllNullDataBlockBuilder counts selected rows with ordinary subtraction/addition. Validation ignores both block and selection; append does not inspect type or bounds. Finish returns an AllNull block. (rust/lance-encoding/src/data.rs:422-443)

### Lines 444-481

Public FixedSizeListBlock exposes child and dimension. num_values divides child count by dimension, truncating remainders and panicking for zero. try_into_flat rejects Nullable children with None, recursively multiplies physical width and divides logical count for nested/fixed children, retains leaf stats, and panics for other child kinds. (rust/lance-encoding/src/data.rs:444-481)

### Lines 482-507

flatten_as_fixed takes mutable self but only recursively clones the fixed leaf: it does not multiply dimensions or update counts. from_flat recursively follows Arrow FixedSizeList dimensions, divides width and multiplies count with ordinary arithmetic and no dimension validation. Other requested types simply return FixedWidth. Retained shared statistics are not recomputed. (rust/lance-encoding/src/data.rs:482-507)

### Lines 508-534

FixedSizeList Arrow conversion computes count using its own dimension, expects a FixedSizeList datatype or panics, converts child with validation and checked-builds the requested Arrow layout. There is no explicit equality check between stored and schema dimensions. Buffers and size are inherited from the child. (rust/lance-encoding/src/data.rs:508-534)

### Lines 535-568

Private FixedSizeListBlockBuilder stores child builder and first-input dimension. Both validation and append unwrap incoming FSL and multiply selected row endpoints by stored dimension without checked arithmetic or an incoming-dimension equality check. Finish wraps the child result. (rust/lance-encoding/src/data.rs:535-568)

### Lines 569-613

Private NullableDataBlockBuilder reserves a validity builder and delegates validation only to its inner child. Append changes the child first, then constructs a BooleanBuffer over selected raw validity bits and appends it. Malformed validity can therefore panic after child mutation. Finish wraps child and packed validity with new empty stats. (rust/lance-encoding/src/data.rs:569-613)

### Lines 614-629

Public OpaqueBlock contains a vector of buffers, logical count and stats. It represents encoded data that cannot yet be turned into Arrow. data_size sums visible buffer lengths, with no capacity accounting or shared-buffer deduplication. (rust/lance-encoding/src/data.rs:614-629)

### Lines 630-655

Public VariableWidthBlock exposes data, offsets, bits_per_offset, num_values and stats. Docs prescribe num_values+1 offsets starting at0. Private unit ValidVariableWidthLayout is passed only after local validation to permit unchecked construction; it has no fields or lifetime tying it to a particular instance. Correct private call ordering is part of the safety argument. (rust/lance-encoding/src/data.rs:630-655)

### Lines 656-688

append_error produces CorruptFile with pseudo filename variable width data block, selected range, count, offset width and both buffer sizes. validate_offsets_for_append<T> checks width matches T, whole offset-buffer divisibility and ordered selection bounded by num_values, with checked usize endpoint conversions. (rust/lance-encoding/src/data.rs:656-688)

### Lines 689-727

Append validation borrows the typed whole offset buffer, requires a present end offset, then checks only the selected inclusive offsets for monotonicity, nonnegativity and payload bounds. It permits nonzero first offsets, does not require the complete logical offset count and does not inspect UTF-8. Whole-buffer divisibility can reject padding accepted by Arrow conversion. (rust/lance-encoding/src/data.rs:689-727)

### Lines 728-757

VariableWidth into_arrow ignores validate. Binary/Utf8 require32-bit offsets; LargeBinary/LargeUtf8 require64. Width mismatch is CorruptFile even when count is zero. Unsupported requested types use a checked Arrow fallback; empty supported arrays also use checked fallback. Nonempty supported arrays validate then use the private unchecked builder. (rust/lance-encoding/src/data.rs:728-757)

### Lines 758-796

expected_bits_per_offset maps only four classic binary/string types. layout_error and format_layout_error include requested datatype, declared count, width and buffer sizes in CorruptFile diagnostics. Other requested types are left to Arrow checked validation. (rust/lance-encoding/src/data.rs:758-796)

### Lines 797-824

validate_layout computes required (count+1)*offset_bytes using checked arithmetic, requires sufficient offset bytes and dispatches i32/i64 or reports unsupported width. UTF-8 validation is enabled for string types. Extra offset bytes are accepted; the caller already checked datatype/width consistency. (rust/lance-encoding/src/data.rs:797-824)

### Lines 825-867

validate_offsets_and_values slices exactly the required offset prefix before typed borrowing, so non-width-aligned trailing padding is ignored. It validates monotonicity and payload bounds. Strings validate the selected payload from first through final offset as UTF-8 once, then require every offset to be a character boundary, rescanning to report the first bad boundary. Unused payload prefix/suffix need not be valid UTF-8. A nonzero first offset and unused suffix are allowed. (rust/lance-encoding/src/data.rs:825-867)

### Lines 868-917

offset_violation_detail assumes a nonempty slice. Fast path folds monotonic comparisons and checks first>=0 plus final offset convertible to usize and within payload. Failure path reports first decreasing pair, then negative/unrepresentable value, then out-of-bounds value with position_base-adjusted indices. An unrepresentable positive offset would share the negative-offset message. (rust/lance-encoding/src/data.rs:868-917)

### Lines 918-957

into_arrow_checked maps Arrow builder errors to contextual CorruptFile. The sole production unsafe block calls build_unchecked only after receiving the private proof; it avoids repeated offset/UTF-8 scans. into_arrow_builder moves full original buffers, sets requested datatype/count/null_count0 and preserves no separate bits_per_offset metadata. Safety depends on the matching prior validation and source platform assumptions. (rust/lance-encoding/src/data.rs:918-957)

### Lines 958-976

Variable serialization orders offsets before payload. Public offsets_as_block takes mutable self but only clones offsets, sets fixed width/count+1 and new stats; it does not mutate the block. data_size adds the two visible lengths; count+1 and byte sums are ordinary arithmetic. (rust/lance-encoding/src/data.rs:958-976)

### Lines 977-1017

Public StructDataBlock exposes children, stats and optional NullBuffer. into_arrow requires Struct or returns Internal, zips fields with children, converts each child and assigns row count from the last visited child. Extra children are ignored; no children yields zero rows. Validity extraction takes the underlying buffer and null count without explicitly preserving a BooleanBuffer bit offset. Checked Arrow build validates resulting layout, but this file has no dedicated sliced-parent-validity regression. (rust/lance-encoding/src/data.rs:977-1017)

### Lines 1018-1049

Struct remove_outer_validity recursively transforms children and clears parent validity while retaining stats. Serialization flattens child buffers and omits parent validity. has_variable_width_child merely tests whether any direct child is not FixedWidth, counting FSL, Nullable and AllNull too. data_size likewise omits parent validity and stats. (rust/lance-encoding/src/data.rs:1018-1049)

### Lines 1050-1085

Public DictionaryDataBlock exposes fixed-width indices and boxed dictionary. decode_helper returns AllNull0 for zero declared indices. Otherwise it estimates expanded capacity from dictionary byte size and counts with unchecked arithmetic, including division by dictionary count. It iterates all physically stored indices, not only declared num_values, converting keys to usize and appending one dictionary range each. Empty dictionaries or malformed keys can panic/error; no local normalization occurs. (rust/lance-encoding/src/data.rs:1050-1085)

### Lines 1086-1130

Public decode interprets keys as unsigned native8/16/32/64 by physical width; unsupported width returns Internal. Requested Arrow Dictionary conversion compares physical index width with requested key byte width and reports CorruptFile on mismatch, then checked-converts keys and dictionary values and attaches the child with checked Arrow construction. Signed key interpretation is delegated to requested Arrow type rather than unsigned expansion. (rust/lance-encoding/src/data.rs:1086-1130)

### Lines 1131-1155

Dictionary into_arrow dispatches declared Dictionary types to dictionary reconstruction; other requested types eagerly expand then convert. Buffer order is indices followed by dictionary buffers. Public into_parts returns DataBlock::FixedWidth indices plus unboxed dictionary; from_parts simply stores supplied components with no validation. (rust/lance-encoding/src/data.rs:1131-1155)

### Lines 1156-1184

Public DataBlock has ten variants: Empty, Constant, AllNull, Nullable, FixedWidth, FixedSizeList, VariableWidth, Opaque, Struct, Dictionary. Docs describe zero-copy reconstruction but Boolean repacking and dictionary expansion allocate; Arrow-to-block normalization can also copy. Enum itself is Debug/Clone. (rust/lance-encoding/src/data.rs:1156-1184)

### Lines 1185-1210

Public DataBlock::into_arrow ignores caller validate and dispatches with true. Empty produces Arrow empty array, Constant reaches todo, Opaque returns Internal requiring decoding first. Composite conversions recursively enforce their local checks; not every malformed public-field state yields a Result error. (rust/lance-encoding/src/data.rs:1185-1210)

### Lines 1211-1228

into_buffers consumes each variant and flattens it in variant-specific order; Opaque returns its vector. There is no framing, type, count or version metadata in this operation. Struct parent validity omission means this is not a generic lossless Arrow serialization API. (rust/lance-encoding/src/data.rs:1211-1228)

### Lines 1229-1251

try_clone returns Ok for every variant using derived/shared clones. Docs referring to borrowed-versus-owned modes, mutable self and borrow_and_clone are stale: signature is &self and current LanceBuffer wraps an Arrow Buffer. Physical data and BlockInfo maps are shared, not deep copied. (rust/lance-encoding/src/buffer.rs:12-27) (rust/lance-encoding/src/data.rs:1229-1251)

### Lines 1252-1283

name returns fixed diagnostic variant strings. is_variable recurses through Nullable, FSL and Struct children; FixedWidth/Empty/AllNull/Constant are false. Dictionary is todo and Opaque panics. This method is distinct from Struct has_variable_width_child direct-kind test. (rust/lance-encoding/src/data.rs:1252-1283)

### Lines 1284-1297

is_nullable returns true for AllNull/Nullable and recursively examines FSL/Struct children, but ignores Struct.validity. Dictionary is todo and Opaque panics. Thus it is not a complete logical Arrow nullability predicate. (rust/lance-encoding/src/data.rs:1284-1297)

### Lines 1298-1316

num_values reads variant counts, delegates Nullable/FSL, takes Struct.children[0] without checking emptiness or agreement, and takes dictionary index count. The comment saying no recursion should not be read literally: Nullable/FSL recurse. Empty returns0. (rust/lance-encoding/src/data.rs:1298-1316)

### Lines 1317-1334

items_per_row delegates Nullable, multiplies FSL dimension by child value, and returns1 for FixedWidth/VariableWidth/Dictionary/Opaque. Empty, Constant, AllNull and Struct remain todo panics. Products are unchecked. (rust/lance-encoding/src/data.rs:1317-1334)

### Lines 1335-1350

data_size returns zero for Empty/AllNull, stored scalar size for Constant, visible physical bytes for leaves/composites and indices plus dictionary for Dictionary. Struct validity is omitted. Shared buffers can be counted repeatedly; this is not retained capacity or logical expanded size. (rust/lance-encoding/src/data.rs:1335-1350)

### Lines 1351-1366

remove_outer_validity panics for AllNull, unwraps one Nullable layer, recursively clears Struct children/validity, and leaves other variants including FSL and Dictionary unchanged. Removing validity can expose arbitrary bytes under null slots. The recurse parameter described in docs does not exist. (rust/lance-encoding/src/data.rs:1351-1366)

### Lines 1367-1429

make_builder chooses packed bitmap for fixed bits1, byte-aligned fixed builder otherwise, variable i32/i64, recursively FSL/Nullable/Struct, or AllNull. Nullable assigns estimated_bytes/16 to validity and the remainder to child; Struct divides estimate among children (zero for empty). Empty/Constant/Opaque/Dictionary and unsupported offset widths are todo; non-byte-aligned fixed widths panic. This method does not copy input values. (rust/lance-encoding/src/data.rs:1367-1429)

### Lines 1430-1463

Three private macros generate consuming, shared-reference and mutable-reference Option casts using exact enum matching. They perform no nested unwrap, validation, conversion or statistic invalidation. Consuming wrong-variant casts return None and drop the consumed input. (rust/lance-encoding/src/data.rs:1430-1463)

### Lines 1464-1492

Public DataBlock cast implementation invokes each macro for seven variants AllNull, Nullable, FixedWidth, FixedSizeList, VariableWidth, Struct and Dictionary, creating21 exact public methods. Empty, Constant and Opaque have no generated casts. Mutable casts allow mutation without refreshing shared stats. (rust/lance-encoding/src/data.rs:1464-1492)

### Lines 1493-1503

Private get_byte_range<T> borrows typed offsets, returns0..0 for empty, otherwise casts first and last offsets to usize without validating sign, monotonicity or payload bounds. Mutable parameter does not imply mutation. (rust/lance-encoding/src/data.rs:1493-1503)

### Lines 1504-1549

stitch_offsets<T> returns empty outputs for no buffers. Otherwise it reserves typed-element capacity using the sum of input byte lengths, inserts a leading zero, rebases each nonempty input by x+last_offset-start, and records original payload spans. Even one input is copied to normalize a nonzero start. Arithmetic adds before subtracting, so intermediate overflow is possible even when the rebased result would fit. Empty buffers contribute0..0 spans. (rust/lance-encoding/src/data.rs:1504-1549)

### Lines 1550-1598

arrow_binary_to_data_block slices each ArrayData offset buffer using its element offset and len+1, stitches i32 for32-bit or i64 otherwise, slices corresponding payload ranges and copies concatenated payloads. It creates VariableWidth with caller-supplied count and empty stats. These operations assume valid inputs and do not independently verify total count. (rust/lance-encoding/src/data.rs:1550-1598)

### Lines 1599-1608

encode_flat_data derives byte width from the first array type, reserves declared count*width and copies each ArrayData first buffer. There is no explicit ArrayData element-offset adjustment here; it relies on array to_data buffer representation. Sliced UInt16 tests cover one concrete case. Counts/types are not reconciled. (rust/lance-encoding/src/data.rs:1599-1608)

### Lines 1609-1627

encode_bitmap_data obtains BooleanBuffer views and appends them to a new builder, preserving bit slicing through Arrow buffer APIs. Declared count controls initial capacity, not an enforced output bound. Output is a packed buffer. (rust/lance-encoding/src/data.rs:1609-1627)

### Lines 1628-1670

concat_dict_arrays uses Arrow concat; DictionaryKeyOverflow triggers casting all inputs to UInt32 dictionary keys and retrying concat. A second key overflow is unimplemented beyond2^32 entries; other errors unwrap. It assumes nonempty dictionary arrays and matching usable types. Arrow concat controls merge/remap behavior; this code does not deduplicate values itself. (rust/lance-encoding/src/data.rs:1628-1670)

### Lines 1671-1684

max_index_val maps eight signed/unsigned integer key types to their positive native maxima; other types panic. The result guides null-item insertion and index widening. (rust/lance-encoding/src/data.rs:1671-1684)

### Lines 1685-1731

arrow_dictionary_to_data_block first concatenates dictionaries and derives actual key count. If logical validity exists, it reuses the first null dictionary item or appends a null item. A null-item index beyond current key maximum widens keys to UInt32; inability beyond that limit is unimplemented. This can happen with either a new or existing null dictionary item. (rust/lance-encoding/src/data.rs:1685-1731)

### Lines 1732-1779

For nullable dictionaries, conversion encodes the null index in the chosen key type, copies key bytes and replaces every logically invalid row key. Validity is moved into the dictionary items; the fixed indices carry no validity bitmap. Without logical validity it clones key bytes. Dictionary items recursively convert through DataBlock::from, and key stats start empty. (rust/lance-encoding/src/data.rs:1732-1779)

### Lines 1780-1794

Private Nullability distinguishes None, All and Some(NullBuffer). to_option clones only Some; it returns None for both no-nulls and all-null cases because the latter is handled by an earlier representation shortcut. (rust/lance-encoding/src/data.rs:1780-1794)

### Lines 1795-1824

extract_nulls calls logical_nulls on every array, which can materialize dictionary logical validity. If none returns a bitmap it yields None; otherwise it concatenates bitmaps, filling missing ones with true. It classifies All by comparing null count with caller-supplied num_values, not summed actual lengths. A present all-valid bitmap can remain Some. (rust/lance-encoding/src/data.rs:1795-1824)

### Lines 1825-1845

validate_variable_width_offsets<T> permits a zero-length array with an empty offset buffer, otherwise slices the selected offset span respecting ArrayData.offset and checks monotonicity/payload bounds. Arithmetic is unchecked but this helper is invoked after Arrow basic layout validation. It does not validate UTF-8. (rust/lance-encoding/src/data.rs:1825-1845)

### Lines 1846-1863

validate_variable_width_layouts applies classic binary/string offset checks using i32/i64 and visits all child ArrayData. It intentionally avoids rescanning UTF-8 content; view-specific offsets are not handled by these custom branches. Basic Arrow validation remains separate. (rust/lance-encoding/src/data.rs:1846-1863)

### Lines 1864-1890

validate_array_data first calls ArrayData.validate, then recursive offset checks, mapping errors to InvalidInput with field name and buffered-array index. Crate-internal validate_arrays runs this over every input; empty input succeeds. Public from_arrays does not invoke it. Both current structural and legacy primitive flush sites call it separately. (rust/lance-encoding/src/encodings/logical/primitive.rs:7575-7587; rust/lance-encoding/src/array_encoding/logical/primitive.rs:511-514) (rust/lance-encoding/src/data.rs:1864-1890)

### Lines 1891-1937

Public infallible from_arrays returns AllNull0 when arrays is empty or declared count is0 before inspecting nonempty input type/nulls. It uses only first datatype, computes logical nullability and returns AllNull with declared count for all-null input. Classic Binary/Utf8 use32-bit normalization, Large variants64; BinaryView/Utf8View cast to classic32-bit with expect. Boolean uses packed fixed-width1. (rust/lance-encoding/src/data.rs:1891-1937)

### Lines 1938-1970

Fixed-size binary, integer/unsigned, floats16/32/64, dates, times, timestamps, intervals, durations and decimals32/64/128/256 use raw fixed-width copy. Null yields AllNull. Dictionary uses key/null normalization. Declared count and actual copied lengths can disagree for misuse of this public infallible API. (rust/lance-encoding/src/data.rs:1938-1970)

### Lines 1971-1994

Struct conversion collects each positional child across all input arrays and recursively converts using declared row count. It stores parent validity on StructDataBlock. Generic wrapping later also creates Nullable for Some, so a partially nullable Struct can retain parent validity in both inner and outer representations. Child type/shape agreement is assumed. (rust/lance-encoding/src/data.rs:1971-1994)

### Lines 1995-2019

FixedSizeList conversion collects child values, recursively converts declared_count*dimension and wraps dimension cast to u64. List/LargeList/ListView/LargeListView/Map/RunEndEncoded/Union are unsupported panics unless zero/all-null shortcuts already returned. Unsupported logical type does not imply every invocation panics. (rust/lance-encoding/src/data.rs:1995-2019)

### Lines 2020-2038

from_arrays computes statistics on the encoded inner representation, then wraps Some validity in Nullable with a fresh empty outer BlockInfo. Dictionaries skip this wrapper because nulls were normalized into items. Statistics may recurse into children or require existing child stats; Struct stats sum child MaxLength and can panic when a child lacks it. (rust/lance-encoding/src/statistics.rs:56-71; rust/lance-encoding/src/statistics.rs:579-597) (rust/lance-encoding/src/data.rs:2020-2038)

### Lines 2039-2051

Public generic from_array uses the array actual len and wraps it in Arc before from_arrays. From<ArrayRef> likewise derives actual count. These wrappers avoid a caller-supplied count mismatch but preserve unsupported-type and downstream panics. (rust/lance-encoding/src/data.rs:2039-2051)

### Lines 2052-2064

Private Debug DataBlockBuilderImpl defines validate_append, append_validated and consuming finish. Default append validates then mutates. It is not declared Send or Sync; full operation transactionality is not guaranteed by this two-step protocol. (rust/lance-encoding/src/data.rs:2052-2064)

### Lines 2065-2090

Public Debug DataBlockBuilder holds estimated capacity and optional boxed implementation. with_capacity_estimate allocates no specific builder. First append/get_builder fixes shape using the input make_builder, and even a failed first append can leave that implementation installed. Public append delegates validation/mutation without an outer rollback. (rust/lance-encoding/src/data.rs:2065-2090)

### Lines 2091-2118

Private append_ranges validates the complete source block once, then validates each range order/end before appending it. Later invalid ranges or append failures retain earlier appended ranges; it is not atomic. Public finish panics if no input ever initialized the builder. A zero-length append can initialize an empty result. (rust/lance-encoding/src/data.rs:2091-2118)

### Lines 2119-2146

Test module imports Arrow builders/dictionary/list/string types, seeded RNG and rstest. Tests are local source evidence and were not executed in this goal. Fixtures construct both valid arrays and intentionally invalid ArrayData via unsafe build_unchecked. (rust/lance-encoding/src/data.rs:2119-2146)

### Lines 2147-2165

Sliced UInt16 regression checks logical count4 and8 data bytes; it does not compare the numeric values. Nullable sliced UInt16 checks count3,6 data bytes and packed validity0b10. (rust/lance-encoding/src/data.rs:2147-2165)

### Lines 2166-2210

String concatenation verifies combined logical count, validity0x1d, offsets[0,5,5,10,11,12,12,12] and payload helloworldab across null and nonnull strings; this fixture has no empty-string input. Non-null case verifies abcdef with offsets[0,1,3,6]. (rust/lance-encoding/src/data.rs:2166-2210)

### Lines 2211-2249

StringView tests repeat exact null/empty concatenation expectations after conversion to classic32-bit offsets, including payload, count and validity. (rust/lance-encoding/src/data.rs:2211-2249)

### Lines 2250-2262

BinaryView fixture foo/null/bar asserts normalized variable payload foobar after unwrapping nullable; it does not assert every offset or validity byte. (rust/lance-encoding/src/data.rs:2250-2262)

### Lines 2263-2296

String-slice helper verifies count, offsets and payload for world, hello, helloworld and hellofoo from differently sliced chunks. This tests rebasing from nonzero offsets and concatenation. (rust/lance-encoding/src/data.rs:2263-2296)

### Lines 2297-2331

Two rstest cases Utf8/LargeUtf8 construct ArrayData with element offset1, length1 and offsets[0,5,10], then validate and normalize to world with rebased[0,5]. (rust/lance-encoding/src/data.rs:2297-2331)

### Lines 2332-2360

Two invalid string-offset cases build malformed Utf8/LargeUtf8 ArrayData unsafely with a negative offset and require pre-encoding InvalidInput including the field name and an offset at index1 with value-1. They exercise validation before normalizing buffers. (rust/lance-encoding/src/data.rs:2332-2360)

### Lines 2361-2376

LargeBinary hello/world verifies64-bit offsets[0,5,10], payload helloworld and logical count2. (rust/lance-encoding/src/data.rs:2361-2376)

### Lines 2377-2406

Dictionary concatenation regression verifies keys[0,0,1,2,3] and dictionary payload abbc with four items from two inputs. Duplicate b dictionary values remain: this fixture does not promise global deduplication. (rust/lance-encoding/src/data.rs:2377-2406)

### Lines 2407-2453

Dictionary null normalization tests null keys and preexisting null dictionary items. Both require keys[3,0,1,2,3], four dictionary items, bitmap0b111, offsets[0,1,2,3,3] and payload abc. (rust/lance-encoding/src/data.rs:2407-2453)

### Lines 2454-2499

Despite cannot_add_null name, this regression verifies successful UInt8-to-UInt32 key widening for256 distinct strings plus null. It checks257 dictionary items, keys0..256, null index256 and32640 payload bytes. (rust/lance-encoding/src/data.rs:2454-2499)

### Lines 2500-2515

All-null test covers UInt32, FixedSizeBinary2, List<UInt32> and Struct<UInt32>, ten values each, comparing roundtrip against Arrow new_null_array. Unsupported non-null List conversion is bypassed. (rust/lance-encoding/src/data.rs:2500-2515)

### Lines 2516-2549

Despite cannot_concatenate name, dictionary concat test expects widening to UInt32 for two256-entry dictionaries, sequential keys0..511 and65536 payload bytes. (rust/lance-encoding/src/data.rs:2516-2549)

### Lines 2550-2622

Seeded fixed-int data_size cases cover3 and400 rows with no nulls and two null patterns; expected visible value bytes plus ceiling-packed validity are compared. Three3-row arrays are also compared to Arrow concat size behavior. This is byte-accounting coverage, not allocation-capacity measurement. (rust/lance-encoding/src/data.rs:2550-2622)

### Lines 2623-2646

Malformed variable block has a final offset100000 against14 payload bytes alphabetagamma; direct conversion must return contextual CorruptFile. (rust/lance-encoding/src/data.rs:2623-2646)

### Lines 2647-2666

Four-byte fixed block declaring two Int32 values must error both through FixedWidth and DataBlock conversions for validate=false and true. Assertions check errors, not their variants/messages. (rust/lance-encoding/src/data.rs:2647-2666)

### Lines 2667-2713

Three variable-builder cases cover decreasing i32/i64 offsets and an i32 out-of-bounds end. append must return CorruptFile with expected diagnostic fragment; no mutation rollback assertion is made. (rust/lance-encoding/src/data.rs:2667-2713)

### Lines 2714-2820

Eleven malformed-layout cases span four classic types with bounds errors, negative/decreasing/interior-bad/short offsets, invalid Utf8 and LargeUtf8 payloads and an offset splitting a UTF-8 character. Both validation flag values must yield CorruptFile. The comment suggesting the flag chooses extra checks is stale: these paths ignore it. (rust/lance-encoding/src/data.rs:2714-2820)

### Lines 2821-2849

Dictionary conversion with malformed variable-width values must reject them as CorruptFile even with validate=false. This covers nested variable validation. (rust/lance-encoding/src/data.rs:2821-2849)

### Lines 2850-2878

Dictionary test rejects32-bit physical indices when requested key type is Int8 and asserts the width diagnostic. Key128 is also invalid for the three values, but width validation is encountered first. (rust/lance-encoding/src/data.rs:2850-2878)

### Lines 2879-2898

Four valid classic Binary/LargeBinary/Utf8/LargeUtf8 cases include empty values and Unicode string content and require exact roundtrips under both flag values. Missing local tests include shared-cache mutation, empty Struct, parent validity in builders, FSL dimension mismatch, zero-width/bitmap misuse, extra dictionary indices, count disagreement, appended-range partial failure and padded/nonzero-base layouts. (rust/lance-encoding/src/data.rs:2879-2898)

## Interaction and interpretation limits

All2898 lines freshly read in ANALYZE79. Source deductions only: no repository build, test, lint, benchmark, generator, installation or network. Public fields and infallible helpers retain caller preconditions. Full structural/legacy primitive callers remain pending.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Data layouts to represent encoded data in a sub-Arrow format
    5 | //!
    6 | //! These [`DataBlock`] structures represent physical layouts.  They fill a gap somewhere
    7 | //! between [`arrow_data::ArrayData`] (which, as a collection of buffers, is too
    8 | //! generic because it doesn't give us enough information about what those buffers represent)
    9 | //! and [`arrow_array::array::Array`] (which is too specific, because it cares about the
   10 | //! logical data type).
   11 | //!
   12 | //! In addition, the layouts represented here are slightly stricter than Arrow's layout rules.
   13 | //! For example, offset buffers MUST start with 0.  These additional restrictions impose a
   14 | //! slight penalty on encode (to normalize arrow data) but make the development of encoders
   15 | //! and decoders easier (since they can rely on a normalized representation)
   16 | 
   17 | use std::{
   18 |     ops::Range,
   19 |     sync::{Arc, RwLock},
   20 | };
   21 | 
   22 | use arrow_array::{
   23 |     Array, ArrayRef, OffsetSizeTrait, UInt64Array,
   24 |     cast::AsArray,
   25 |     new_empty_array, new_null_array,
   26 |     types::{ArrowDictionaryKeyType, UInt8Type, UInt16Type, UInt32Type, UInt64Type},
   27 | };
   28 | use arrow_buffer::{ArrowNativeType, BooleanBuffer, BooleanBufferBuilder, NullBuffer};
   29 | use arrow_data::{ArrayData, ArrayDataBuilder};
   30 | use arrow_schema::DataType;
   31 | use lance_arrow::DataTypeExt;
   32 | 
   33 | use lance_core::{Error, Result};
   34 | 
   35 | use crate::{
   36 |     buffer::LanceBuffer,
   37 |     statistics::{ComputeStat, Stat},
   38 | };
   39 | 
   40 | /// A data block with no buffers where everything is null
   41 | ///
   42 | /// Note: this data block should not be used for future work.  It will be deprecated
   43 | /// in the 2.1 version of the format where nullability will be handled by the structural
   44 | /// encoders.
   45 | #[derive(Debug, Clone)]
   46 | pub struct AllNullDataBlock {
   47 |     /// The number of values represented by this block
   48 |     pub num_values: u64,
   49 | }
   50 | 
   51 | impl AllNullDataBlock {
   52 |     fn into_arrow(self, data_type: DataType, _validate: bool) -> Result<ArrayData> {
   53 |         Ok(ArrayData::new_null(&data_type, self.num_values as usize))
   54 |     }
   55 | 
   56 |     fn into_buffers(self) -> Vec<LanceBuffer> {
   57 |         vec![]
   58 |     }
   59 | }
   60 | 
   61 | use std::collections::HashMap;
   62 | 
   63 | // `BlockInfo` stores the statistics of this `DataBlock`, such as `NullCount` for `NullableDataBlock`,
   64 | // `BitWidth` for `FixedWidthDataBlock`, `Cardinality` for all `DataBlock`
   65 | #[derive(Debug, Clone)]
   66 | pub struct BlockInfo(pub Arc<RwLock<HashMap<Stat, Arc<dyn Array>>>>);
   67 | 
   68 | impl Default for BlockInfo {
   69 |     fn default() -> Self {
   70 |         Self::new()
   71 |     }
   72 | }
   73 | 
   74 | impl BlockInfo {
   75 |     pub fn new() -> Self {
   76 |         Self(Arc::new(RwLock::new(HashMap::new())))
   77 |     }
   78 | }
   79 | 
   80 | impl PartialEq for BlockInfo {
   81 |     fn eq(&self, other: &Self) -> bool {
   82 |         let self_info = self.0.read().unwrap();
   83 |         let other_info = other.0.read().unwrap();
   84 |         *self_info == *other_info
   85 |     }
   86 | }
   87 | 
   88 | /// Wraps a data block and adds nullability information to it
   89 | ///
   90 | /// Note: this data block should not be used for future work.  It will be deprecated
   91 | /// in the 2.1 version of the format where nullability will be handled by the structural
   92 | /// encoders.
   93 | #[derive(Debug, Clone)]
   94 | pub struct NullableDataBlock {
   95 |     /// The underlying data
   96 |     pub data: Box<DataBlock>,
   97 |     /// A bitmap of validity for each value
   98 |     pub nulls: LanceBuffer,
   99 | 
  100 |     pub block_info: BlockInfo,
  101 | }
  102 | 
  103 | impl NullableDataBlock {
  104 |     fn into_arrow(self, data_type: DataType, _validate: bool) -> Result<ArrayData> {
  105 |         let nulls = self.nulls.into_buffer();
  106 |         let data = self.data.into_arrow_impl(data_type, true)?.into_builder();
  107 |         let data = data.null_bit_buffer(Some(nulls));
  108 |         Ok(data.build()?)
  109 |     }
  110 | 
  111 |     fn into_buffers(self) -> Vec<LanceBuffer> {
  112 |         let mut buffers = vec![self.nulls];
  113 |         buffers.extend(self.data.into_buffers());
  114 |         buffers
  115 |     }
  116 | 
  117 |     pub fn data_size(&self) -> u64 {
  118 |         self.data.data_size() + self.nulls.len() as u64
  119 |     }
  120 | }
  121 | 
  122 | /// A block representing the same constant value repeated many times
  123 | #[derive(Debug, PartialEq, Clone)]
  124 | pub struct ConstantDataBlock {
  125 |     /// Data buffer containing the value
  126 |     pub data: LanceBuffer,
  127 |     /// The number of values
  128 |     pub num_values: u64,
  129 | }
  130 | 
  131 | impl ConstantDataBlock {
  132 |     fn into_buffers(self) -> Vec<LanceBuffer> {
  133 |         vec![self.data]
  134 |     }
  135 | 
  136 |     fn into_arrow(self, _data_type: DataType, _validate: bool) -> Result<ArrayData> {
  137 |         // We don't need this yet but if we come up with some way of serializing
  138 |         // scalars to/from bytes then we could implement it.
  139 |         todo!()
  140 |     }
  141 | 
  142 |     pub fn try_clone(&self) -> Result<Self> {
  143 |         Ok(Self {
  144 |             data: self.data.clone(),
  145 |             num_values: self.num_values,
  146 |         })
  147 |     }
  148 | 
  149 |     pub fn data_size(&self) -> u64 {
  150 |         self.data.len() as u64
  151 |     }
  152 | }
  153 | 
  154 | /// A data block for a single buffer of data where each element has a fixed number of bits
  155 | #[derive(Debug, PartialEq, Clone)]
  156 | pub struct FixedWidthDataBlock {
  157 |     /// The data buffer
  158 |     pub data: LanceBuffer,
  159 |     /// The number of bits per value
  160 |     pub bits_per_value: u64,
  161 |     /// The number of values represented by this block
  162 |     pub num_values: u64,
  163 | 
  164 |     pub block_info: BlockInfo,
  165 | }
  166 | 
  167 | impl FixedWidthDataBlock {
  168 |     fn do_into_arrow(
  169 |         self,
  170 |         data_type: DataType,
  171 |         num_values: u64,
  172 |         _validate: bool,
  173 |     ) -> Result<ArrayData> {
  174 |         // Booleans expanded for full-zip (bits_per_value==8, one byte each) need re-packing to
  175 |         // Arrow's bit-packed format.
  176 |         let data_buffer = if matches!(data_type, DataType::Boolean) && self.bits_per_value == 8 {
  177 |             let mut builder = BooleanBufferBuilder::new(num_values as usize);
  178 |             for &byte in self.data.as_ref().iter().take(num_values as usize) {
  179 |                 builder.append(byte != 0);
  180 |             }
  181 |             builder.finish().into_inner()
  182 |         } else {
  183 |             self.data.into_buffer()
  184 |         };
  185 |         let builder = ArrayDataBuilder::new(data_type)
  186 |             .add_buffer(data_buffer)
  187 |             .len(num_values as usize)
  188 |             .null_count(0);
  189 |         Ok(builder.build()?)
  190 |     }
  191 | 
  192 |     /// Convert this block into Arrow data with full layout validation.
  193 |     ///
  194 |     /// The `validate` argument is retained for API compatibility. Conversion is
  195 |     /// always validated because callers can construct this public type directly.
  196 |     pub fn into_arrow(self, data_type: DataType, _validate: bool) -> Result<ArrayData> {
  197 |         let root_num_values = self.num_values;
  198 |         self.do_into_arrow(data_type, root_num_values, true)
  199 |     }
  200 | 
  201 |     pub fn into_buffers(self) -> Vec<LanceBuffer> {
  202 |         vec![self.data]
  203 |     }
  204 | 
  205 |     pub fn try_clone(&self) -> Result<Self> {
  206 |         Ok(Self {
  207 |             data: self.data.clone(),
  208 |             bits_per_value: self.bits_per_value,
  209 |             num_values: self.num_values,
  210 |             block_info: self.block_info.clone(),
  211 |         })
  212 |     }
  213 | 
  214 |     pub fn data_size(&self) -> u64 {
  215 |         self.data.len() as u64
  216 |     }
  217 | }
  218 | 
  219 | #[derive(Debug)]
  220 | struct VariableWidthDataBlockBuilder<T: OffsetSizeTrait> {
  221 |     offsets: Vec<T>,
  222 |     bytes: Vec<u8>,
  223 | }
  224 | 
  225 | impl<T: OffsetSizeTrait> VariableWidthDataBlockBuilder<T> {
  226 |     fn new(estimated_size_bytes: u64) -> Self {
  227 |         Self {
  228 |             offsets: vec![T::from_usize(0).unwrap()],
  229 |             bytes: Vec::with_capacity(estimated_size_bytes as usize),
  230 |         }
  231 |     }
  232 | }
  233 | 
  234 | impl<T: OffsetSizeTrait + bytemuck::Pod> DataBlockBuilderImpl for VariableWidthDataBlockBuilder<T> {
  235 |     fn validate_append(&self, data_block: &DataBlock, selection: &Range<u64>) -> Result<()> {
  236 |         let block = data_block.as_variable_width_ref().unwrap();
  237 |         block.validate_offsets_for_append::<T>(selection)
  238 |     }
  239 | 
  240 |     fn append_validated(&mut self, data_block: &DataBlock, selection: Range<u64>) -> Result<()> {
  241 |         let block = data_block.as_variable_width_ref().unwrap();
  242 |         debug_assert_eq!(block.bits_per_offset, T::get_byte_width() as u8 * 8);
  243 |         let offsets = block.offsets.borrow_to_typed_view::<T>();
  244 | 
  245 |         let start_offset = offsets[selection.start as usize];
  246 |         let end_offset = offsets[selection.end as usize];
  247 |         let selected_data_len = end_offset.as_usize() - start_offset.as_usize();
  248 |         let new_data_len = self
  249 |             .bytes
  250 |             .len()
  251 |             .checked_add(selected_data_len)
  252 |             .ok_or_else(|| {
  253 |                 Error::not_supported_source(
  254 |                     "appending variable-width data would overflow usize".into(),
  255 |                 )
  256 |             })?;
  257 |         if T::from_usize(new_data_len).is_none() {
  258 |             return Err(Error::not_supported_source(
  259 |                 format!(
  260 |                     "appending variable-width data would require {} bytes, which exceeds the \
  261 |                      capacity of {}-bit offsets",
  262 |                     new_data_len,
  263 |                     T::get_byte_width() * 8
  264 |                 )
  265 |                 .into(),
  266 |             ));
  267 |         }
  268 |         let previous_len = self.bytes.len();
  269 | 
  270 |         self.bytes
  271 |             .extend_from_slice(&block.data[start_offset.as_usize()..end_offset.as_usize()]);
  272 | 
  273 |         self.offsets.extend(
  274 |             offsets[selection.start as usize + 1..=selection.end as usize]
  275 |                 .iter()
  276 |                 .map(|&offset| {
  277 |                     let rebased_offset =
  278 |                         previous_len + (offset.as_usize() - start_offset.as_usize());
  279 |                     T::from_usize(rebased_offset).unwrap()
  280 |                 }),
  281 |         );
  282 |         Ok(())
  283 |     }
  284 | 
  285 |     fn finish(self: Box<Self>) -> DataBlock {
  286 |         let num_values = (self.offsets.len() - 1) as u64;
  287 |         DataBlock::VariableWidth(VariableWidthBlock {
  288 |             data: LanceBuffer::from(self.bytes),
  289 |             offsets: LanceBuffer::reinterpret_vec(self.offsets),
  290 |             bits_per_offset: T::get_byte_width() as u8 * 8,
  291 |             num_values,
  292 |             block_info: BlockInfo::new(),
  293 |         })
  294 |     }
  295 | }
  296 | 
  297 | #[derive(Debug)]
  298 | struct BitmapDataBlockBuilder {
  299 |     values: BooleanBufferBuilder,
  300 | }
  301 | 
  302 | impl BitmapDataBlockBuilder {
  303 |     fn new(estimated_size_bytes: u64) -> Self {
  304 |         Self {
  305 |             values: BooleanBufferBuilder::new(estimated_size_bytes as usize * 8),
  306 |         }
  307 |     }
  308 | }
  309 | 
  310 | impl DataBlockBuilderImpl for BitmapDataBlockBuilder {
  311 |     fn validate_append(&self, _data_block: &DataBlock, _selection: &Range<u64>) -> Result<()> {
  312 |         Ok(())
  313 |     }
  314 | 
  315 |     fn append_validated(&mut self, data_block: &DataBlock, selection: Range<u64>) -> Result<()> {
  316 |         let bitmap_blk = data_block.as_fixed_width_ref().unwrap();
  317 |         self.values.append_packed_range(
  318 |             selection.start as usize..selection.end as usize,
  319 |             &bitmap_blk.data,
  320 |         );
  321 |         Ok(())
  322 |     }
  323 | 
  324 |     fn finish(mut self: Box<Self>) -> DataBlock {
  325 |         let bool_buf = self.values.finish();
  326 |         let num_values = bool_buf.len() as u64;
  327 |         let bits_buf = bool_buf.into_inner();
  328 |         DataBlock::FixedWidth(FixedWidthDataBlock {
  329 |             data: LanceBuffer::from(bits_buf),
  330 |             bits_per_value: 1,
  331 |             num_values,
  332 |             block_info: BlockInfo::new(),
  333 |         })
  334 |     }
  335 | }
  336 | 
  337 | #[derive(Debug)]
  338 | struct FixedWidthDataBlockBuilder {
  339 |     bits_per_value: u64,
  340 |     bytes_per_value: u64,
  341 |     values: Vec<u8>,
  342 | }
  343 | 
  344 | impl FixedWidthDataBlockBuilder {
  345 |     fn new(bits_per_value: u64, estimated_size_bytes: u64) -> Self {
  346 |         assert!(bits_per_value.is_multiple_of(8));
  347 |         Self {
  348 |             bits_per_value,
  349 |             bytes_per_value: bits_per_value / 8,
  350 |             values: Vec::with_capacity(estimated_size_bytes as usize),
  351 |         }
  352 |     }
  353 | }
  354 | 
  355 | impl DataBlockBuilderImpl for FixedWidthDataBlockBuilder {
  356 |     fn validate_append(&self, _data_block: &DataBlock, _selection: &Range<u64>) -> Result<()> {
  357 |         Ok(())
  358 |     }
  359 | 
  360 |     fn append_validated(&mut self, data_block: &DataBlock, selection: Range<u64>) -> Result<()> {
  361 |         let block = data_block.as_fixed_width_ref().unwrap();
  362 |         assert_eq!(self.bits_per_value, block.bits_per_value);
  363 |         let start = selection.start as usize * self.bytes_per_value as usize;
  364 |         let end = selection.end as usize * self.bytes_per_value as usize;
  365 |         self.values.extend_from_slice(&block.data[start..end]);
  366 |         Ok(())
  367 |     }
  368 | 
  369 |     fn finish(self: Box<Self>) -> DataBlock {
  370 |         let num_values = (self.values.len() / self.bytes_per_value as usize) as u64;
  371 |         DataBlock::FixedWidth(FixedWidthDataBlock {
  372 |             data: LanceBuffer::from(self.values),
  373 |             bits_per_value: self.bits_per_value,
  374 |             num_values,
  375 |             block_info: BlockInfo::new(),
  376 |         })
  377 |     }
  378 | }
  379 | 
  380 | #[derive(Debug)]
  381 | struct StructDataBlockBuilder {
  382 |     children: Vec<Box<dyn DataBlockBuilderImpl>>,
  383 | }
  384 | 
  385 | impl StructDataBlockBuilder {
  386 |     fn new(children: Vec<Box<dyn DataBlockBuilderImpl>>) -> Self {
  387 |         Self { children }
  388 |     }
  389 | }
  390 | 
  391 | impl DataBlockBuilderImpl for StructDataBlockBuilder {
  392 |     fn validate_append(&self, data_block: &DataBlock, selection: &Range<u64>) -> Result<()> {
  393 |         let data_block = data_block.as_struct_ref().unwrap();
  394 |         for i in 0..self.children.len() {
  395 |             self.children[i].validate_append(&data_block.children[i], selection)?;
  396 |         }
  397 |         Ok(())
  398 |     }
  399 | 
  400 |     fn append_validated(&mut self, data_block: &DataBlock, selection: Range<u64>) -> Result<()> {
  401 |         let data_block = data_block.as_struct_ref().unwrap();
  402 |         for i in 0..self.children.len() {
  403 |             self.children[i].append_validated(&data_block.children[i], selection.clone())?;
  404 |         }
  405 |         Ok(())
  406 |     }
  407 | 
  408 |     fn finish(self: Box<Self>) -> DataBlock {
  409 |         let mut children_data_block = Vec::new();
  410 |         for child in self.children {
  411 |             let child_data_block = child.finish();
  412 |             children_data_block.push(child_data_block);
  413 |         }
  414 |         DataBlock::Struct(StructDataBlock {
  415 |             children: children_data_block,
  416 |             block_info: BlockInfo::new(),
  417 |             validity: None,
  418 |         })
  419 |     }
  420 | }
  421 | 
  422 | #[derive(Debug, Default)]
  423 | struct AllNullDataBlockBuilder {
  424 |     num_values: u64,
  425 | }
  426 | 
  427 | impl DataBlockBuilderImpl for AllNullDataBlockBuilder {
  428 |     fn validate_append(&self, _data_block: &DataBlock, _selection: &Range<u64>) -> Result<()> {
  429 |         Ok(())
  430 |     }
  431 | 
  432 |     fn append_validated(&mut self, _data_block: &DataBlock, selection: Range<u64>) -> Result<()> {
  433 |         self.num_values += selection.end - selection.start;
  434 |         Ok(())
  435 |     }
  436 | 
  437 |     fn finish(self: Box<Self>) -> DataBlock {
  438 |         DataBlock::AllNull(AllNullDataBlock {
  439 |             num_values: self.num_values,
  440 |         })
  441 |     }
  442 | }
  443 | 
  444 | /// A data block to represent a fixed size list
  445 | #[derive(Debug, Clone)]
  446 | pub struct FixedSizeListBlock {
  447 |     /// The child data block
  448 |     pub child: Box<DataBlock>,
  449 |     /// The number of items in each list
  450 |     pub dimension: u64,
  451 | }
  452 | 
  453 | impl FixedSizeListBlock {
  454 |     pub fn num_values(&self) -> u64 {
  455 |         self.child.num_values() / self.dimension
  456 |     }
  457 | 
  458 |     /// Try to flatten a FixedSizeListBlock into a FixedWidthDataBlock
  459 |     ///
  460 |     /// Returns None if any children are nullable
  461 |     pub fn try_into_flat(self) -> Option<FixedWidthDataBlock> {
  462 |         match *self.child {
  463 |             // Cannot flatten a nullable child
  464 |             DataBlock::Nullable(_) => None,
  465 |             DataBlock::FixedSizeList(inner) => {
  466 |                 let mut flat = inner.try_into_flat()?;
  467 |                 flat.bits_per_value *= self.dimension;
  468 |                 flat.num_values /= self.dimension;
  469 |                 Some(flat)
  470 |             }
  471 |             DataBlock::FixedWidth(mut inner) => {
  472 |                 inner.bits_per_value *= self.dimension;
  473 |                 inner.num_values /= self.dimension;
  474 |                 Some(inner)
  475 |             }
  476 |             _ => panic!(
  477 |                 "Expected FixedSizeList or FixedWidth data block but found {:?}",
  478 |                 self
  479 |             ),
  480 |         }
  481 |     }
  482 | 
  483 |     pub fn flatten_as_fixed(&mut self) -> FixedWidthDataBlock {
  484 |         match self.child.as_mut() {
  485 |             DataBlock::FixedSizeList(fsl) => fsl.flatten_as_fixed(),
  486 |             DataBlock::FixedWidth(fw) => fw.clone(),
  487 |             _ => panic!("Expected FixedSizeList or FixedWidth data block"),
  488 |         }
  489 |     }
  490 | 
  491 |     /// Convert a flattened values block into a FixedSizeListBlock
  492 |     pub fn from_flat(data: FixedWidthDataBlock, data_type: &DataType) -> DataBlock {
  493 |         match data_type {
  494 |             DataType::FixedSizeList(child_field, dimension) => {
  495 |                 let mut data = data;
  496 |                 data.bits_per_value /= *dimension as u64;
  497 |                 data.num_values *= *dimension as u64;
  498 |                 let child_data = Self::from_flat(data, child_field.data_type());
  499 |                 DataBlock::FixedSizeList(Self {
  500 |                     child: Box::new(child_data),
  501 |                     dimension: *dimension as u64,
  502 |                 })
  503 |             }
  504 |             // Base case, we've hit a non-list type
  505 |             _ => DataBlock::FixedWidth(data),
  506 |         }
  507 |     }
  508 | 
  509 |     fn into_arrow(self, data_type: DataType, _validate: bool) -> Result<ArrayData> {
  510 |         let num_values = self.num_values();
  511 |         let builder = match &data_type {
  512 |             DataType::FixedSizeList(child_field, _) => {
  513 |                 let child_data = self
  514 |                     .child
  515 |                     .into_arrow_impl(child_field.data_type().clone(), true)?;
  516 |                 ArrayDataBuilder::new(data_type)
  517 |                     .add_child_data(child_data)
  518 |                     .len(num_values as usize)
  519 |                     .null_count(0)
  520 |             }
  521 |             _ => panic!("Expected FixedSizeList data type and got {:?}", data_type),
  522 |         };
  523 |         Ok(builder.build()?)
  524 |     }
  525 | 
  526 |     fn into_buffers(self) -> Vec<LanceBuffer> {
  527 |         self.child.into_buffers()
  528 |     }
  529 | 
  530 |     fn data_size(&self) -> u64 {
  531 |         self.child.data_size()
  532 |     }
  533 | }
  534 | 
  535 | #[derive(Debug)]
  536 | struct FixedSizeListBlockBuilder {
  537 |     inner: Box<dyn DataBlockBuilderImpl>,
  538 |     dimension: u64,
  539 | }
  540 | 
  541 | impl FixedSizeListBlockBuilder {
  542 |     fn new(inner: Box<dyn DataBlockBuilderImpl>, dimension: u64) -> Self {
  543 |         Self { inner, dimension }
  544 |     }
  545 | }
  546 | 
  547 | impl DataBlockBuilderImpl for FixedSizeListBlockBuilder {
  548 |     fn validate_append(&self, data_block: &DataBlock, selection: &Range<u64>) -> Result<()> {
  549 |         let selection = selection.start * self.dimension..selection.end * self.dimension;
  550 |         let fsl = data_block.as_fixed_size_list_ref().unwrap();
  551 |         self.inner.validate_append(fsl.child.as_ref(), &selection)
  552 |     }
  553 | 
  554 |     fn append_validated(&mut self, data_block: &DataBlock, selection: Range<u64>) -> Result<()> {
  555 |         let selection = selection.start * self.dimension..selection.end * self.dimension;
  556 |         let fsl = data_block.as_fixed_size_list_ref().unwrap();
  557 |         self.inner.append_validated(fsl.child.as_ref(), selection)
  558 |     }
  559 | 
  560 |     fn finish(self: Box<Self>) -> DataBlock {
  561 |         let inner_block = self.inner.finish();
  562 |         DataBlock::FixedSizeList(FixedSizeListBlock {
  563 |             child: Box::new(inner_block),
  564 |             dimension: self.dimension,
  565 |         })
  566 |     }
  567 | }
  568 | 
  569 | #[derive(Debug)]
  570 | struct NullableDataBlockBuilder {
  571 |     inner: Box<dyn DataBlockBuilderImpl>,
  572 |     validity: BooleanBufferBuilder,
  573 | }
  574 | 
  575 | impl NullableDataBlockBuilder {
  576 |     fn new(inner: Box<dyn DataBlockBuilderImpl>, estimated_size_bytes: usize) -> Self {
  577 |         Self {
  578 |             inner,
  579 |             validity: BooleanBufferBuilder::new(estimated_size_bytes * 8),
  580 |         }
  581 |     }
  582 | }
  583 | 
  584 | impl DataBlockBuilderImpl for NullableDataBlockBuilder {
  585 |     fn validate_append(&self, data_block: &DataBlock, selection: &Range<u64>) -> Result<()> {
  586 |         let nullable = data_block.as_nullable_ref().unwrap();
  587 |         self.inner
  588 |             .validate_append(nullable.data.as_ref(), selection)
  589 |     }
  590 | 
  591 |     fn append_validated(&mut self, data_block: &DataBlock, selection: Range<u64>) -> Result<()> {
  592 |         let nullable = data_block.as_nullable_ref().unwrap();
  593 |         self.inner
  594 |             .append_validated(nullable.data.as_ref(), selection.clone())?;
  595 |         let bool_buf = BooleanBuffer::new(
  596 |             nullable.nulls.clone().into_buffer(),
  597 |             selection.start as usize,
  598 |             (selection.end - selection.start) as usize,
  599 |         );
  600 |         self.validity.append_buffer(&bool_buf);
  601 |         Ok(())
  602 |     }
  603 | 
  604 |     fn finish(mut self: Box<Self>) -> DataBlock {
  605 |         let inner_block = self.inner.finish();
  606 |         DataBlock::Nullable(NullableDataBlock {
  607 |             data: Box::new(inner_block),
  608 |             nulls: LanceBuffer::from(self.validity.finish().into_inner()),
  609 |             block_info: BlockInfo::new(),
  610 |         })
  611 |     }
  612 | }
  613 | 
  614 | /// A data block with no regular structure.  There is no available spot to attach
  615 | /// validity / repdef information and it cannot be converted to Arrow without being
  616 | /// decoded
  617 | #[derive(Debug, Clone)]
  618 | pub struct OpaqueBlock {
  619 |     pub buffers: Vec<LanceBuffer>,
  620 |     pub num_values: u64,
  621 |     pub block_info: BlockInfo,
  622 | }
  623 | 
  624 | impl OpaqueBlock {
  625 |     pub fn data_size(&self) -> u64 {
  626 |         self.buffers.iter().map(|b| b.len() as u64).sum()
  627 |     }
  628 | }
  629 | 
  630 | /// A data block for variable-width data (e.g. strings, packed rows, etc.)
  631 | #[derive(Debug, Clone)]
  632 | pub struct VariableWidthBlock {
  633 |     /// The data buffer
  634 |     pub data: LanceBuffer,
  635 |     /// The offsets buffer (contains num_values + 1 offsets)
  636 |     ///
  637 |     /// Offsets MUST start at 0
  638 |     pub offsets: LanceBuffer,
  639 |     /// The number of bits per offset
  640 |     pub bits_per_offset: u8,
  641 |     /// The number of values represented by this block
  642 |     pub num_values: u64,
  643 | 
  644 |     pub block_info: BlockInfo,
  645 | }
  646 | 
  647 | /// Proof that a [`VariableWidthBlock`] satisfies the Arrow layout contract for
  648 | /// its target data type (offsets buffer long enough, offsets monotonic and
  649 | /// within the data buffer, values valid UTF-8 where required).
  650 | ///
  651 | /// Only [`VariableWidthBlock::validate_layout`] can construct it, which ties the
  652 | /// unchecked Arrow build below to an actual validation pass instead of a
  653 | /// caller-controlled flag.
  654 | struct ValidVariableWidthLayout;
  655 | 
  656 | impl VariableWidthBlock {
  657 |     fn append_error(&self, selection: &Range<u64>, detail: impl std::fmt::Display) -> Error {
  658 |         Error::corrupt_file_named(
  659 |             "variable width data block",
  660 |             format!(
  661 |                 "cannot append offsets for selection {}..{}: {} (num_values: {}, \
  662 |                  bits_per_offset: {}, offsets buffer size: {} bytes, data buffer size: {} bytes)",
  663 |                 selection.start,
  664 |                 selection.end,
  665 |                 detail,
  666 |                 self.num_values,
  667 |                 self.bits_per_offset,
  668 |                 self.offsets.len(),
  669 |                 self.data.len(),
  670 |             ),
  671 |         )
  672 |     }
  673 | 
  674 |     fn validate_offsets_for_append<T>(&self, selection: &Range<u64>) -> Result<()>
  675 |     where
  676 |         T: OffsetSizeTrait + bytemuck::Pod,
  677 |     {
  678 |         let expected_bits_per_offset = T::get_byte_width() as u8 * 8;
  679 |         if self.bits_per_offset != expected_bits_per_offset {
  680 |             return Err(self.append_error(
  681 |                 selection,
  682 |                 format!(
  683 |                     "expected {}-bit offsets but found {}-bit offsets",
  684 |                     expected_bits_per_offset, self.bits_per_offset
  685 |                 ),
  686 |             ));
  687 |         }
  688 |         let offset_size = std::mem::size_of::<T>();
  689 |         if !self.offsets.len().is_multiple_of(offset_size) {
  690 |             return Err(self.append_error(
  691 |                 selection,
  692 |                 format!(
  693 |                     "offsets buffer length {} is not a multiple of the {}-byte offset width",
  694 |                     self.offsets.len(),
  695 |                     offset_size
  696 |                 ),
  697 |             ));
  698 |         }
  699 |         if selection.start > selection.end || selection.end > self.num_values {
  700 |             return Err(
  701 |                 self.append_error(selection, "selection is outside the block's value range")
  702 |             );
  703 |         }
  704 |         let selection_start = usize::try_from(selection.start)
  705 |             .map_err(|_| self.append_error(selection, "selection start does not fit in usize"))?;
  706 |         let selection_end = usize::try_from(selection.end)
  707 |             .map_err(|_| self.append_error(selection, "selection end does not fit in usize"))?;
  708 |         let offsets = self.offsets.borrow_to_typed_view::<T>();
  709 |         if selection_end >= offsets.len() {
  710 |             return Err(self.append_error(
  711 |                 selection,
  712 |                 format!(
  713 |                     "selection requires offset {} but the buffer holds {} offsets",
  714 |                     selection_end,
  715 |                     offsets.len()
  716 |                 ),
  717 |             ));
  718 |         }
  719 |         let selected_offsets = &offsets[selection_start..=selection_end];
  720 |         if let Some(detail) =
  721 |             Self::offset_violation_detail(selected_offsets, self.data.len(), selection_start)
  722 |         {
  723 |             return Err(self.append_error(selection, detail));
  724 |         }
  725 |         Ok(())
  726 |     }
  727 | 
  728 |     // The offsets buffer comes straight from file bytes, so an unchecked build would
  729 |     // let a corrupt file smuggle out-of-bounds offsets into an Arrow array whose
  730 |     // consumers then read (or crash on) memory outside the data buffer.  This
  731 |     // boundary therefore always validates the layout, ignoring the optional
  732 |     // `validate` flag.  Lance validates the common layouts itself (a branchless
  733 |     // scan, measurably cheaper than Arrow's element-wise checked build) and only
  734 |     // falls back to Arrow's checked build for the cold cases.
  735 |     fn into_arrow(self, data_type: DataType, _validate: bool) -> Result<ArrayData> {
  736 |         let Some(expected_bits_per_offset) = Self::expected_bits_per_offset(&data_type) else {
  737 |             // Not an [offsets, bytes] layout we know how to prove; let Arrow
  738 |             // check it.
  739 |             return self.into_arrow_checked(data_type);
  740 |         };
  741 |         if self.bits_per_offset != expected_bits_per_offset {
  742 |             return Err(self.layout_error(
  743 |                 &data_type,
  744 |                 format!(
  745 |                     "expected {}-bit offsets but got {}-bit offsets",
  746 |                     expected_bits_per_offset, self.bits_per_offset
  747 |                 ),
  748 |             ));
  749 |         }
  750 |         if self.num_values == 0 {
  751 |             // Cold path; Arrow handles the empty-offsets special cases.
  752 |             return self.into_arrow_checked(data_type);
  753 |         }
  754 |         let proof = self.validate_layout(&data_type)?;
  755 |         Ok(self.into_arrow_unchecked(data_type, proof))
  756 |     }
  757 | 
  758 |     /// The offset width Arrow mandates for `data_type`, or `None` if the type
  759 |     /// does not use the `[offsets, bytes]` layout this block represents.
  760 |     fn expected_bits_per_offset(data_type: &DataType) -> Option<u8> {
  761 |         match data_type {
  762 |             DataType::Binary | DataType::Utf8 => Some(32),
  763 |             DataType::LargeBinary | DataType::LargeUtf8 => Some(64),
  764 |             _ => None,
  765 |         }
  766 |     }
  767 | 
  768 |     fn layout_error(&self, data_type: &DataType, detail: impl std::fmt::Display) -> Error {
  769 |         Self::format_layout_error(
  770 |             data_type,
  771 |             detail,
  772 |             self.num_values,
  773 |             self.bits_per_offset,
  774 |             self.offsets.len(),
  775 |             self.data.len(),
  776 |         )
  777 |     }
  778 | 
  779 |     fn format_layout_error(
  780 |         data_type: &DataType,
  781 |         detail: impl std::fmt::Display,
  782 |         num_values: u64,
  783 |         bits_per_offset: u8,
  784 |         offsets_size: usize,
  785 |         data_size: usize,
  786 |     ) -> Error {
  787 |         Error::corrupt_file_named(
  788 |             "variable width data block",
  789 |             format!(
  790 |                 "invalid variable-width layout for {}: {} (num_values: {}, bits_per_offset: {}, \
  791 |                  offsets buffer size: {} bytes, data buffer size: {} bytes)",
  792 |                 data_type, detail, num_values, bits_per_offset, offsets_size, data_size,
  793 |             ),
  794 |         )
  795 |     }
  796 | 
  797 |     fn validate_layout(&self, data_type: &DataType) -> Result<ValidVariableWidthLayout> {
  798 |         let bytes_per_offset = (self.bits_per_offset / 8) as u64;
  799 |         let required_bytes = self
  800 |             .num_values
  801 |             .checked_add(1)
  802 |             .and_then(|num_offsets| num_offsets.checked_mul(bytes_per_offset))
  803 |             .ok_or_else(|| self.layout_error(data_type, "offsets buffer size overflows"))?;
  804 |         if (self.offsets.len() as u64) < required_bytes {
  805 |             return Err(self.layout_error(
  806 |                 data_type,
  807 |                 format!(
  808 |                     "offsets buffer must hold at least {} offsets ({} bytes)",
  809 |                     self.num_values + 1,
  810 |                     required_bytes
  811 |                 ),
  812 |             ));
  813 |         }
  814 |         let validate_utf8 = matches!(data_type, DataType::Utf8 | DataType::LargeUtf8);
  815 |         match self.bits_per_offset {
  816 |             32 => self.validate_offsets_and_values::<i32>(data_type, validate_utf8),
  817 |             64 => self.validate_offsets_and_values::<i64>(data_type, validate_utf8),
  818 |             other => Err(self.layout_error(
  819 |                 data_type,
  820 |                 format!("unsupported offset width: {} bits", other),
  821 |             )),
  822 |         }
  823 |     }
  824 | 
  825 |     fn validate_offsets_and_values<T: ArrowNativeType + Ord>(
  826 |         &self,
  827 |         data_type: &DataType,
  828 |         validate_utf8: bool,
  829 |     ) -> Result<ValidVariableWidthLayout> {
  830 |         let num_offsets = self.num_values as usize + 1;
  831 |         // Slice before borrowing: the buffer may carry padding that is not a
  832 |         // multiple of the offset width.
  833 |         let offsets = self
  834 |             .offsets
  835 |             .slice_with_length(0, num_offsets * std::mem::size_of::<T>());
  836 |         let offsets = offsets.borrow_to_typed_slice::<T>();
  837 |         let offsets: &[T] = offsets.as_ref();
  838 |         let data = self.data.as_ref();
  839 | 
  840 |         if let Some(detail) = Self::offset_violation_detail(offsets, data.len(), 0) {
  841 |             return Err(self.layout_error(data_type, detail));
  842 |         }
  843 | 
  844 |         if validate_utf8 {
  845 |             let (first, last) = (offsets[0].as_usize(), offsets[num_offsets - 1].as_usize());
  846 |             let values = std::str::from_utf8(&data[first..last])
  847 |                 .map_err(|utf8_err| self.layout_error(data_type, utf8_err))?;
  848 |             let mut on_char_boundaries = true;
  849 |             for &offset in offsets {
  850 |                 on_char_boundaries &= values.is_char_boundary(offset.as_usize() - first);
  851 |             }
  852 |             if !on_char_boundaries {
  853 |                 // Cold path: rescan to pinpoint the offending offset.
  854 |                 let position = offsets
  855 |                     .iter()
  856 |                     .position(|offset| !values.is_char_boundary(offset.as_usize() - first))
  857 |                     .expect("the fast scan found a non-boundary offset");
  858 |                 return Err(self.layout_error(
  859 |                     data_type,
  860 |                     format!("offset at position {position} splits a UTF-8 character"),
  861 |                 ));
  862 |             }
  863 |         }
  864 | 
  865 |         Ok(ValidVariableWidthLayout)
  866 |     }
  867 | 
  868 |     fn offset_violation_detail<T: ArrowNativeType + Ord>(
  869 |         offsets: &[T],
  870 |         data_size: usize,
  871 |         position_base: usize,
  872 |     ) -> Option<String> {
  873 |         // A monotonic sequence with a non-negative first offset and an
  874 |         // in-bounds last offset is entirely within [0, data_size].  Keep this
  875 |         // valid path branchless so it vectorizes, and only rescan on failure.
  876 |         let mut is_monotonic = true;
  877 |         for window in offsets.windows(2) {
  878 |             is_monotonic &= window[0] <= window[1];
  879 |         }
  880 |         let first = offsets[0];
  881 |         let last = offsets[offsets.len() - 1];
  882 |         let bounds_ok =
  883 |             first >= T::usize_as(0) && last.to_usize().is_some_and(|last| last <= data_size);
  884 |         if is_monotonic && bounds_ok {
  885 |             return None;
  886 |         }
  887 | 
  888 |         for (relative_position, window) in offsets.windows(2).enumerate() {
  889 |             if window[0] > window[1] {
  890 |                 let position = position_base + relative_position + 1;
  891 |                 return Some(format!(
  892 |                     "non-monotonic offset at position {}: {:?} decreases from {:?}",
  893 |                     position, window[1], window[0]
  894 |                 ));
  895 |             }
  896 |         }
  897 |         for (relative_position, offset) in offsets.iter().enumerate() {
  898 |             let position = position_base + relative_position;
  899 |             match offset.to_usize() {
  900 |                 None => {
  901 |                     return Some(format!(
  902 |                         "offset at position {} is negative: {:?}",
  903 |                         position, offset
  904 |                     ));
  905 |                 }
  906 |                 Some(offset) if offset > data_size => {
  907 |                     return Some(format!(
  908 |                         "offset at position {} is out of bounds: {} > {}",
  909 |                         position, offset, data_size
  910 |                     ));
  911 |                 }
  912 |                 Some(_) => {}
  913 |             }
  914 |         }
  915 |         Some("offsets failed validation".to_string())
  916 |     }
  917 | 
  918 |     fn into_arrow_checked(self, data_type: DataType) -> Result<ArrayData> {
  919 |         let num_values = self.num_values;
  920 |         let bits_per_offset = self.bits_per_offset;
  921 |         let offsets_size = self.offsets.len();
  922 |         let data_size = self.data.len();
  923 |         let builder = self.into_arrow_builder(data_type.clone());
  924 |         builder.build().map_err(|arrow_err| {
  925 |             Self::format_layout_error(
  926 |                 &data_type,
  927 |                 arrow_err,
  928 |                 num_values,
  929 |                 bits_per_offset,
  930 |                 offsets_size,
  931 |                 data_size,
  932 |             )
  933 |         })
  934 |     }
  935 | 
  936 |     fn into_arrow_unchecked(
  937 |         self,
  938 |         data_type: DataType,
  939 |         _proof: ValidVariableWidthLayout,
  940 |     ) -> ArrayData {
  941 |         let builder = self.into_arrow_builder(data_type);
  942 |         // SAFETY: `_proof` witnesses that `validate_layout` proved this block
  943 |         // satisfies the Arrow layout contract for `data_type`.
  944 |         unsafe { builder.build_unchecked() }
  945 |     }
  946 | 
  947 |     fn into_arrow_builder(self, data_type: DataType) -> ArrayDataBuilder {
  948 |         let num_values = self.num_values;
  949 |         let data_buffer = self.data.into_buffer();
  950 |         let offsets_buffer = self.offsets.into_buffer();
  951 |         ArrayDataBuilder::new(data_type)
  952 |             .add_buffer(offsets_buffer)
  953 |             .add_buffer(data_buffer)
  954 |             .len(num_values as usize)
  955 |             .null_count(0)
  956 |     }
  957 | 
  958 |     fn into_buffers(self) -> Vec<LanceBuffer> {
  959 |         vec![self.offsets, self.data]
  960 |     }
  961 | 
  962 |     pub fn offsets_as_block(&mut self) -> DataBlock {
  963 |         let offsets = self.offsets.clone();
  964 |         DataBlock::FixedWidth(FixedWidthDataBlock {
  965 |             data: offsets,
  966 |             bits_per_value: self.bits_per_offset as u64,
  967 |             num_values: self.num_values + 1,
  968 |             block_info: BlockInfo::new(),
  969 |         })
  970 |     }
  971 | 
  972 |     pub fn data_size(&self) -> u64 {
  973 |         (self.data.len() + self.offsets.len()) as u64
  974 |     }
  975 | }
  976 | 
  977 | /// A data block representing a struct
  978 | #[derive(Debug, Clone)]
  979 | pub struct StructDataBlock {
  980 |     /// The child arrays
  981 |     pub children: Vec<DataBlock>,
  982 |     pub block_info: BlockInfo,
  983 |     /// The validity bitmap for the struct (None means all valid)
  984 |     pub validity: Option<NullBuffer>,
  985 | }
  986 | 
  987 | impl StructDataBlock {
  988 |     fn into_arrow(self, data_type: DataType, _validate: bool) -> Result<ArrayData> {
  989 |         if let DataType::Struct(fields) = &data_type {
  990 |             let mut builder = ArrayDataBuilder::new(DataType::Struct(fields.clone()));
  991 |             let mut num_rows = 0;
  992 |             for (field, child) in fields.iter().zip(self.children) {
  993 |                 let child_data = child.into_arrow_impl(field.data_type().clone(), true)?;
  994 |                 num_rows = child_data.len();
  995 |                 builder = builder.add_child_data(child_data);
  996 |             }
  997 | 
  998 |             // Apply validity if present
  999 |             let builder = if let Some(validity) = self.validity {
 1000 |                 let null_count = validity.null_count();
 1001 |                 builder
 1002 |                     .null_bit_buffer(Some(validity.into_inner().into_inner()))
 1003 |                     .null_count(null_count)
 1004 |             } else {
 1005 |                 builder.null_count(0)
 1006 |             };
 1007 | 
 1008 |             let builder = builder.len(num_rows);
 1009 |             Ok(builder.build()?)
 1010 |         } else {
 1011 |             Err(Error::internal(format!(
 1012 |                 "Expected Struct, got {:?}",
 1013 |                 data_type
 1014 |             )))
 1015 |         }
 1016 |     }
 1017 | 
 1018 |     fn remove_outer_validity(self) -> Self {
 1019 |         Self {
 1020 |             children: self
 1021 |                 .children
 1022 |                 .into_iter()
 1023 |                 .map(|c| c.remove_outer_validity())
 1024 |                 .collect(),
 1025 |             block_info: self.block_info,
 1026 |             validity: None, // Remove the validity
 1027 |         }
 1028 |     }
 1029 | 
 1030 |     fn into_buffers(self) -> Vec<LanceBuffer> {
 1031 |         self.children
 1032 |             .into_iter()
 1033 |             .flat_map(|c| c.into_buffers())
 1034 |             .collect()
 1035 |     }
 1036 | 
 1037 |     pub fn has_variable_width_child(&self) -> bool {
 1038 |         self.children
 1039 |             .iter()
 1040 |             .any(|child| !matches!(child, DataBlock::FixedWidth(_)))
 1041 |     }
 1042 | 
 1043 |     pub fn data_size(&self) -> u64 {
 1044 |         self.children
 1045 |             .iter()
 1046 |             .map(|data_block| data_block.data_size())
 1047 |             .sum()
 1048 |     }
 1049 | }
 1050 | 
 1051 | /// A data block for dictionary encoded data
 1052 | #[derive(Debug, Clone)]
 1053 | pub struct DictionaryDataBlock {
 1054 |     /// The indices buffer
 1055 |     pub indices: FixedWidthDataBlock,
 1056 |     /// The dictionary itself
 1057 |     pub dictionary: Box<DataBlock>,
 1058 | }
 1059 | 
 1060 | impl DictionaryDataBlock {
 1061 |     fn decode_helper<K: ArrowDictionaryKeyType>(self) -> Result<DataBlock> {
 1062 |         // Handle empty batch - this can happen when decoding a range that contains
 1063 |         // only empty/null lists, or when reading sparse data
 1064 |         if self.indices.num_values == 0 {
 1065 |             return Ok(DataBlock::AllNull(AllNullDataBlock { num_values: 0 }));
 1066 |         }
 1067 | 
 1068 |         // assume the indices are uniformly distributed.
 1069 |         let estimated_size_bytes = self.dictionary.data_size()
 1070 |             * (self.indices.num_values + self.dictionary.num_values() - 1)
 1071 |             / self.dictionary.num_values();
 1072 |         let mut data_builder = DataBlockBuilder::with_capacity_estimate(estimated_size_bytes);
 1073 | 
 1074 |         let indices = self.indices.data.borrow_to_typed_slice::<K::Native>();
 1075 |         let indices = indices.as_ref();
 1076 | 
 1077 |         let selections = indices.iter().map(|idx| {
 1078 |             let idx = idx.to_usize().unwrap() as u64;
 1079 |             idx..idx + 1
 1080 |         });
 1081 |         data_builder.append_ranges(&self.dictionary, selections)?;
 1082 | 
 1083 |         Ok(data_builder.finish())
 1084 |     }
 1085 | 
 1086 |     pub fn decode(self) -> Result<DataBlock> {
 1087 |         match self.indices.bits_per_value {
 1088 |             8 => self.decode_helper::<UInt8Type>(),
 1089 |             16 => self.decode_helper::<UInt16Type>(),
 1090 |             32 => self.decode_helper::<UInt32Type>(),
 1091 |             64 => self.decode_helper::<UInt64Type>(),
 1092 |             _ => Err(lance_core::Error::internal(format!(
 1093 |                 "Unsupported dictionary index bit width: {} bits",
 1094 |                 self.indices.bits_per_value
 1095 |             ))),
 1096 |         }
 1097 |     }
 1098 | 
 1099 |     fn into_arrow_dict(
 1100 |         self,
 1101 |         key_type: Box<DataType>,
 1102 |         value_type: Box<DataType>,
 1103 |         _validate: bool,
 1104 |     ) -> Result<ArrayData> {
 1105 |         let declared_key_bits = key_type.byte_width() as u64 * 8;
 1106 |         if self.indices.bits_per_value != declared_key_bits {
 1107 |             return Err(lance_core::Error::corrupt_file_named(
 1108 |                 "dictionary",
 1109 |                 format!(
 1110 |                     "dictionary indices use {} bits but the declared {} key type uses {} bits",
 1111 |                     self.indices.bits_per_value, key_type, declared_key_bits
 1112 |                 ),
 1113 |             ));
 1114 |         }
 1115 |         let indices_num_values = self.indices.num_values;
 1116 |         let indices = self
 1117 |             .indices
 1118 |             .do_into_arrow((*key_type).clone(), indices_num_values, true)?;
 1119 |         let dictionary = self
 1120 |             .dictionary
 1121 |             .into_arrow_impl((*value_type).clone(), true)?;
 1122 | 
 1123 |         let builder = indices
 1124 |             .into_builder()
 1125 |             .add_child_data(dictionary)
 1126 |             .data_type(DataType::Dictionary(key_type, value_type));
 1127 | 
 1128 |         Ok(builder.build()?)
 1129 |     }
 1130 | 
 1131 |     fn into_arrow(self, data_type: DataType, validate: bool) -> Result<ArrayData> {
 1132 |         if let DataType::Dictionary(key_type, value_type) = data_type {
 1133 |             self.into_arrow_dict(key_type, value_type, validate)
 1134 |         } else {
 1135 |             self.decode()?.into_arrow_impl(data_type, validate)
 1136 |         }
 1137 |     }
 1138 | 
 1139 |     fn into_buffers(self) -> Vec<LanceBuffer> {
 1140 |         let mut buffers = self.indices.into_buffers();
 1141 |         buffers.extend(self.dictionary.into_buffers());
 1142 |         buffers
 1143 |     }
 1144 | 
 1145 |     pub fn into_parts(self) -> (DataBlock, DataBlock) {
 1146 |         (DataBlock::FixedWidth(self.indices), *self.dictionary)
 1147 |     }
 1148 | 
 1149 |     pub fn from_parts(indices: FixedWidthDataBlock, dictionary: DataBlock) -> Self {
 1150 |         Self {
 1151 |             indices,
 1152 |             dictionary: Box::new(dictionary),
 1153 |         }
 1154 |     }
 1155 | }
 1156 | 
 1157 | /// A DataBlock is a collection of buffers that represents an "array" of data in very generic terms
 1158 | ///
 1159 | /// The output of each decoder is a DataBlock.  Decoders can be chained together to transform
 1160 | /// one DataBlock into a different kind of DataBlock.
 1161 | ///
 1162 | /// The DataBlock is somewhere in between Arrow's ArrayData and Array and represents a physical
 1163 | /// layout of the data.
 1164 | ///
 1165 | /// A DataBlock can be converted into an Arrow ArrayData (and then Array) for a given array type.
 1166 | /// For example, a FixedWidthDataBlock can be converted into any primitive type or a fixed size
 1167 | /// list of a primitive type.  This is a zero-copy operation.
 1168 | ///
 1169 | /// In addition, a DataBlock can be created from an Arrow array or arrays.  This is not a zero-copy
 1170 | /// operation as some normalization may be required.
 1171 | #[derive(Debug, Clone)]
 1172 | pub enum DataBlock {
 1173 |     Empty(),
 1174 |     Constant(ConstantDataBlock),
 1175 |     AllNull(AllNullDataBlock),
 1176 |     Nullable(NullableDataBlock),
 1177 |     FixedWidth(FixedWidthDataBlock),
 1178 |     FixedSizeList(FixedSizeListBlock),
 1179 |     VariableWidth(VariableWidthBlock),
 1180 |     Opaque(OpaqueBlock),
 1181 |     Struct(StructDataBlock),
 1182 |     Dictionary(DictionaryDataBlock),
 1183 | }
 1184 | 
 1185 | impl DataBlock {
 1186 |     /// Convert self into an Arrow ArrayData with full layout validation.
 1187 |     ///
 1188 |     /// The `validate` argument is retained for API compatibility. Conversion is
 1189 |     /// always validated because callers can construct data blocks directly.
 1190 |     pub fn into_arrow(self, data_type: DataType, _validate: bool) -> Result<ArrayData> {
 1191 |         self.into_arrow_impl(data_type, true)
 1192 |     }
 1193 | 
 1194 |     fn into_arrow_impl(self, data_type: DataType, validate: bool) -> Result<ArrayData> {
 1195 |         match self {
 1196 |             Self::Empty() => Ok(new_empty_array(&data_type).to_data()),
 1197 |             Self::Constant(inner) => inner.into_arrow(data_type, validate),
 1198 |             Self::AllNull(inner) => inner.into_arrow(data_type, validate),
 1199 |             Self::Nullable(inner) => inner.into_arrow(data_type, validate),
 1200 |             Self::FixedWidth(inner) => inner.into_arrow(data_type, validate),
 1201 |             Self::FixedSizeList(inner) => inner.into_arrow(data_type, validate),
 1202 |             Self::VariableWidth(inner) => inner.into_arrow(data_type, validate),
 1203 |             Self::Struct(inner) => inner.into_arrow(data_type, validate),
 1204 |             Self::Dictionary(inner) => inner.into_arrow(data_type, validate),
 1205 |             Self::Opaque(_) => Err(Error::internal(
 1206 |                 "Cannot convert OpaqueBlock to Arrow".to_string(),
 1207 |             )),
 1208 |         }
 1209 |     }
 1210 | 
 1211 |     /// Convert the data block into a collection of buffers for serialization
 1212 |     ///
 1213 |     /// The order matters and will be used to reconstruct the data block at read time.
 1214 |     pub fn into_buffers(self) -> Vec<LanceBuffer> {
 1215 |         match self {
 1216 |             Self::Empty() => Vec::default(),
 1217 |             Self::Constant(inner) => inner.into_buffers(),
 1218 |             Self::AllNull(inner) => inner.into_buffers(),
 1219 |             Self::Nullable(inner) => inner.into_buffers(),
 1220 |             Self::FixedWidth(inner) => inner.into_buffers(),
 1221 |             Self::FixedSizeList(inner) => inner.into_buffers(),
 1222 |             Self::VariableWidth(inner) => inner.into_buffers(),
 1223 |             Self::Struct(inner) => inner.into_buffers(),
 1224 |             Self::Dictionary(inner) => inner.into_buffers(),
 1225 |             Self::Opaque(inner) => inner.buffers,
 1226 |         }
 1227 |     }
 1228 | 
 1229 |     /// Converts the data buffers into borrowed mode and clones the block
 1230 |     ///
 1231 |     /// This is a zero-copy operation but requires a mutable reference to self and, afterwards,
 1232 |     /// all buffers will be in Borrowed mode.
 1233 |     /// Try and clone the block
 1234 |     ///
 1235 |     /// This will fail if any buffers are in owned mode.  You can call borrow_and_clone() to
 1236 |     /// ensure that all buffers are in borrowed mode before calling this method.
 1237 |     pub fn try_clone(&self) -> Result<Self> {
 1238 |         match self {
 1239 |             Self::Empty() => Ok(Self::Empty()),
 1240 |             Self::Constant(inner) => Ok(Self::Constant(inner.clone())),
 1241 |             Self::AllNull(inner) => Ok(Self::AllNull(inner.clone())),
 1242 |             Self::Nullable(inner) => Ok(Self::Nullable(inner.clone())),
 1243 |             Self::FixedWidth(inner) => Ok(Self::FixedWidth(inner.clone())),
 1244 |             Self::FixedSizeList(inner) => Ok(Self::FixedSizeList(inner.clone())),
 1245 |             Self::VariableWidth(inner) => Ok(Self::VariableWidth(inner.clone())),
 1246 |             Self::Struct(inner) => Ok(Self::Struct(inner.clone())),
 1247 |             Self::Dictionary(inner) => Ok(Self::Dictionary(inner.clone())),
 1248 |             Self::Opaque(inner) => Ok(Self::Opaque(inner.clone())),
 1249 |         }
 1250 |     }
 1251 | 
 1252 |     pub fn name(&self) -> &'static str {
 1253 |         match self {
 1254 |             Self::Constant(_) => "Constant",
 1255 |             Self::Empty() => "Empty",
 1256 |             Self::AllNull(_) => "AllNull",
 1257 |             Self::Nullable(_) => "Nullable",
 1258 |             Self::FixedWidth(_) => "FixedWidth",
 1259 |             Self::FixedSizeList(_) => "FixedSizeList",
 1260 |             Self::VariableWidth(_) => "VariableWidth",
 1261 |             Self::Struct(_) => "Struct",
 1262 |             Self::Dictionary(_) => "Dictionary",
 1263 |             Self::Opaque(_) => "Opaque",
 1264 |         }
 1265 |     }
 1266 | 
 1267 |     pub fn is_variable(&self) -> bool {
 1268 |         match self {
 1269 |             Self::Constant(_) => false,
 1270 |             Self::Empty() => false,
 1271 |             Self::AllNull(_) => false,
 1272 |             Self::Nullable(nullable) => nullable.data.is_variable(),
 1273 |             Self::FixedWidth(_) => false,
 1274 |             Self::FixedSizeList(fsl) => fsl.child.is_variable(),
 1275 |             Self::VariableWidth(_) => true,
 1276 |             Self::Struct(strct) => strct.children.iter().any(|c| c.is_variable()),
 1277 |             Self::Dictionary(_) => {
 1278 |                 todo!("is_variable for DictionaryDataBlock is not implemented yet")
 1279 |             }
 1280 |             Self::Opaque(_) => panic!("Does not make sense to ask if an Opaque block is variable"),
 1281 |         }
 1282 |     }
 1283 | 
 1284 |     pub fn is_nullable(&self) -> bool {
 1285 |         match self {
 1286 |             Self::AllNull(_) => true,
 1287 |             Self::Nullable(_) => true,
 1288 |             Self::FixedSizeList(fsl) => fsl.child.is_nullable(),
 1289 |             Self::Struct(strct) => strct.children.iter().any(|c| c.is_nullable()),
 1290 |             Self::Dictionary(_) => {
 1291 |                 todo!("is_nullable for DictionaryDataBlock is not implemented yet")
 1292 |             }
 1293 |             Self::Opaque(_) => panic!("Does not make sense to ask if an Opaque block is nullable"),
 1294 |             _ => false,
 1295 |         }
 1296 |     }
 1297 | 
 1298 |     /// The number of values in the block
 1299 |     ///
 1300 |     /// This function does not recurse into child blocks.  If this is a FSL then it will
 1301 |     /// be the number of lists and not the number of items.
 1302 |     pub fn num_values(&self) -> u64 {
 1303 |         match self {
 1304 |             Self::Empty() => 0,
 1305 |             Self::Constant(inner) => inner.num_values,
 1306 |             Self::AllNull(inner) => inner.num_values,
 1307 |             Self::Nullable(inner) => inner.data.num_values(),
 1308 |             Self::FixedWidth(inner) => inner.num_values,
 1309 |             Self::FixedSizeList(inner) => inner.num_values(),
 1310 |             Self::VariableWidth(inner) => inner.num_values,
 1311 |             Self::Struct(inner) => inner.children[0].num_values(),
 1312 |             Self::Dictionary(inner) => inner.indices.num_values,
 1313 |             Self::Opaque(inner) => inner.num_values,
 1314 |         }
 1315 |     }
 1316 | 
 1317 |     /// The number of items in a single row
 1318 |     ///
 1319 |     /// This is always 1 unless there are layers of FSL
 1320 |     pub fn items_per_row(&self) -> u64 {
 1321 |         match self {
 1322 |             Self::Empty() => todo!(),     // Leave undefined until needed
 1323 |             Self::Constant(_) => todo!(), // Leave undefined until needed
 1324 |             Self::AllNull(_) => todo!(),  // Leave undefined until needed
 1325 |             Self::Nullable(nullable) => nullable.data.items_per_row(),
 1326 |             Self::FixedWidth(_) => 1,
 1327 |             Self::FixedSizeList(fsl) => fsl.dimension * fsl.child.items_per_row(),
 1328 |             Self::VariableWidth(_) => 1,
 1329 |             Self::Struct(_) => todo!(), // Leave undefined until needed
 1330 |             Self::Dictionary(_) => 1,
 1331 |             Self::Opaque(_) => 1,
 1332 |         }
 1333 |     }
 1334 | 
 1335 |     /// The number of bytes in the data block (including any child blocks)
 1336 |     pub fn data_size(&self) -> u64 {
 1337 |         match self {
 1338 |             Self::Empty() => 0,
 1339 |             Self::Constant(inner) => inner.data_size(),
 1340 |             Self::AllNull(_) => 0,
 1341 |             Self::Nullable(inner) => inner.data_size(),
 1342 |             Self::FixedWidth(inner) => inner.data_size(),
 1343 |             Self::FixedSizeList(inner) => inner.data_size(),
 1344 |             Self::VariableWidth(inner) => inner.data_size(),
 1345 |             Self::Struct(inner) => inner.children.iter().map(|child| child.data_size()).sum(),
 1346 |             Self::Dictionary(inner) => inner.indices.data_size() + inner.dictionary.data_size(),
 1347 |             Self::Opaque(inner) => inner.data_size(),
 1348 |         }
 1349 |     }
 1350 | 
 1351 |     /// Removes any validity information from the block
 1352 |     ///
 1353 |     /// This does not filter the block (e.g. remove rows).  It only removes
 1354 |     /// the validity bitmaps (if present).  Any garbage masked by null bits
 1355 |     /// will now appear as proper values.
 1356 |     ///
 1357 |     /// If `recurse` is true, then this will also remove validity from any child blocks.
 1358 |     pub fn remove_outer_validity(self) -> Self {
 1359 |         match self {
 1360 |             Self::AllNull(_) => panic!("Cannot remove validity on all-null data"),
 1361 |             Self::Nullable(inner) => *inner.data,
 1362 |             Self::Struct(inner) => Self::Struct(inner.remove_outer_validity()),
 1363 |             other => other,
 1364 |         }
 1365 |     }
 1366 | 
 1367 |     fn make_builder(&self, estimated_size_bytes: u64) -> Box<dyn DataBlockBuilderImpl> {
 1368 |         match self {
 1369 |             Self::FixedWidth(inner) => {
 1370 |                 if inner.bits_per_value == 1 {
 1371 |                     Box::new(BitmapDataBlockBuilder::new(estimated_size_bytes))
 1372 |                 } else {
 1373 |                     Box::new(FixedWidthDataBlockBuilder::new(
 1374 |                         inner.bits_per_value,
 1375 |                         estimated_size_bytes,
 1376 |                     ))
 1377 |                 }
 1378 |             }
 1379 |             Self::VariableWidth(inner) => {
 1380 |                 if inner.bits_per_offset == 32 {
 1381 |                     Box::new(VariableWidthDataBlockBuilder::<i32>::new(
 1382 |                         estimated_size_bytes,
 1383 |                     ))
 1384 |                 } else if inner.bits_per_offset == 64 {
 1385 |                     Box::new(VariableWidthDataBlockBuilder::<i64>::new(
 1386 |                         estimated_size_bytes,
 1387 |                     ))
 1388 |                 } else {
 1389 |                     todo!()
 1390 |                 }
 1391 |             }
 1392 |             Self::FixedSizeList(inner) => {
 1393 |                 let inner_builder = inner.child.make_builder(estimated_size_bytes);
 1394 |                 Box::new(FixedSizeListBlockBuilder::new(
 1395 |                     inner_builder,
 1396 |                     inner.dimension,
 1397 |                 ))
 1398 |             }
 1399 |             Self::Nullable(nullable) => {
 1400 |                 // There's no easy way to know what percentage of the data is in the valiidty buffer
 1401 |                 // but 1/16th seems like a reasonable guess.
 1402 |                 let estimated_validity_size_bytes = estimated_size_bytes / 16;
 1403 |                 let inner_builder = nullable
 1404 |                     .data
 1405 |                     .make_builder(estimated_size_bytes - estimated_validity_size_bytes);
 1406 |                 Box::new(NullableDataBlockBuilder::new(
 1407 |                     inner_builder,
 1408 |                     estimated_validity_size_bytes as usize,
 1409 |                 ))
 1410 |             }
 1411 |             Self::Struct(struct_data_block) => {
 1412 |                 let num_children = struct_data_block.children.len();
 1413 |                 let per_child_estimate = if num_children == 0 {
 1414 |                     0
 1415 |                 } else {
 1416 |                     estimated_size_bytes / num_children as u64
 1417 |                 };
 1418 |                 let child_builders = struct_data_block
 1419 |                     .children
 1420 |                     .iter()
 1421 |                     .map(|child| child.make_builder(per_child_estimate))
 1422 |                     .collect();
 1423 |                 Box::new(StructDataBlockBuilder::new(child_builders))
 1424 |             }
 1425 |             Self::AllNull(_) => Box::new(AllNullDataBlockBuilder::default()),
 1426 |             _ => todo!("make_builder for {:?}", self),
 1427 |         }
 1428 |     }
 1429 | }
 1430 | 
 1431 | macro_rules! as_type {
 1432 |     ($fn_name:ident, $inner:tt, $inner_type:ident) => {
 1433 |         pub fn $fn_name(self) -> Option<$inner_type> {
 1434 |             match self {
 1435 |                 Self::$inner(inner) => Some(inner),
 1436 |                 _ => None,
 1437 |             }
 1438 |         }
 1439 |     };
 1440 | }
 1441 | 
 1442 | macro_rules! as_type_ref {
 1443 |     ($fn_name:ident, $inner:tt, $inner_type:ident) => {
 1444 |         pub fn $fn_name(&self) -> Option<&$inner_type> {
 1445 |             match self {
 1446 |                 Self::$inner(inner) => Some(inner),
 1447 |                 _ => None,
 1448 |             }
 1449 |         }
 1450 |     };
 1451 | }
 1452 | 
 1453 | macro_rules! as_type_ref_mut {
 1454 |     ($fn_name:ident, $inner:tt, $inner_type:ident) => {
 1455 |         pub fn $fn_name(&mut self) -> Option<&mut $inner_type> {
 1456 |             match self {
 1457 |                 Self::$inner(inner) => Some(inner),
 1458 |                 _ => None,
 1459 |             }
 1460 |         }
 1461 |     };
 1462 | }
 1463 | 
 1464 | // Cast implementations
 1465 | impl DataBlock {
 1466 |     as_type!(as_all_null, AllNull, AllNullDataBlock);
 1467 |     as_type!(as_nullable, Nullable, NullableDataBlock);
 1468 |     as_type!(as_fixed_width, FixedWidth, FixedWidthDataBlock);
 1469 |     as_type!(as_fixed_size_list, FixedSizeList, FixedSizeListBlock);
 1470 |     as_type!(as_variable_width, VariableWidth, VariableWidthBlock);
 1471 |     as_type!(as_struct, Struct, StructDataBlock);
 1472 |     as_type!(as_dictionary, Dictionary, DictionaryDataBlock);
 1473 |     as_type_ref!(as_all_null_ref, AllNull, AllNullDataBlock);
 1474 |     as_type_ref!(as_nullable_ref, Nullable, NullableDataBlock);
 1475 |     as_type_ref!(as_fixed_width_ref, FixedWidth, FixedWidthDataBlock);
 1476 |     as_type_ref!(as_fixed_size_list_ref, FixedSizeList, FixedSizeListBlock);
 1477 |     as_type_ref!(as_variable_width_ref, VariableWidth, VariableWidthBlock);
 1478 |     as_type_ref!(as_struct_ref, Struct, StructDataBlock);
 1479 |     as_type_ref!(as_dictionary_ref, Dictionary, DictionaryDataBlock);
 1480 |     as_type_ref_mut!(as_all_null_ref_mut, AllNull, AllNullDataBlock);
 1481 |     as_type_ref_mut!(as_nullable_ref_mut, Nullable, NullableDataBlock);
 1482 |     as_type_ref_mut!(as_fixed_width_ref_mut, FixedWidth, FixedWidthDataBlock);
 1483 |     as_type_ref_mut!(
 1484 |         as_fixed_size_list_ref_mut,
 1485 |         FixedSizeList,
 1486 |         FixedSizeListBlock
 1487 |     );
 1488 |     as_type_ref_mut!(as_variable_width_ref_mut, VariableWidth, VariableWidthBlock);
 1489 |     as_type_ref_mut!(as_struct_ref_mut, Struct, StructDataBlock);
 1490 |     as_type_ref_mut!(as_dictionary_ref_mut, Dictionary, DictionaryDataBlock);
 1491 | }
 1492 | 
 1493 | // Methods to convert from Arrow -> DataBlock
 1494 | 
 1495 | fn get_byte_range<T: ArrowNativeType>(offsets: &mut LanceBuffer) -> Range<usize> {
 1496 |     let offsets = offsets.borrow_to_typed_slice::<T>();
 1497 |     if offsets.as_ref().is_empty() {
 1498 |         0..0
 1499 |     } else {
 1500 |         offsets.as_ref().first().unwrap().as_usize()..offsets.as_ref().last().unwrap().as_usize()
 1501 |     }
 1502 | }
 1503 | 
 1504 | // Given multiple offsets arrays [0, 5, 10], [0, 3, 7], etc. stitch
 1505 | // them together to get [0, 5, 10, 13, 20, ...]
 1506 | //
 1507 | // Also returns the data range referenced by each offset array (may
 1508 | // not be 0..len if there is slicing involved)
 1509 | fn stitch_offsets<T: ArrowNativeType + std::ops::Add<Output = T> + std::ops::Sub<Output = T>>(
 1510 |     offsets: Vec<LanceBuffer>,
 1511 | ) -> (LanceBuffer, Vec<Range<usize>>) {
 1512 |     if offsets.is_empty() {
 1513 |         return (LanceBuffer::empty(), Vec::default());
 1514 |     }
 1515 |     let len = offsets.iter().map(|b| b.len()).sum::<usize>();
 1516 |     // Note: we are making a copy here, even if there is only one input, because we want to
 1517 |     // normalize that input if it doesn't start with zero.  This could be micro-optimized out
 1518 |     // if needed.
 1519 |     let mut dest = Vec::with_capacity(len);
 1520 |     let mut byte_ranges = Vec::with_capacity(offsets.len());
 1521 | 
 1522 |     // We insert one leading 0 before processing any of the inputs
 1523 |     dest.push(T::from_usize(0).unwrap());
 1524 | 
 1525 |     for mut o in offsets.into_iter() {
 1526 |         if !o.is_empty() {
 1527 |             let last_offset = *dest.last().unwrap();
 1528 |             let o = o.borrow_to_typed_slice::<T>();
 1529 |             let start = *o.as_ref().first().unwrap();
 1530 |             // First, we skip the first offset
 1531 |             // Then, we subtract that first offset from each remaining offset
 1532 |             //
 1533 |             // This gives us a 0-based offset array (minus the leading 0)
 1534 |             //
 1535 |             // Then we add the last offset from the previous array to each offset
 1536 |             // which shifts our offset array to the correct position
 1537 |             //
 1538 |             // For example, let's assume the last offset from the previous array
 1539 |             // was 10 and we are given [13, 17, 22].  This means we have two values with
 1540 |             // length 4 (17 - 13) and 5 (22 - 17).  The output from this step will be
 1541 |             // [14, 19].  Combined with our last offset of 10, this gives us [10, 14, 19]
 1542 |             // which is our same two values of length 4 and 5.
 1543 |             dest.extend(o.as_ref()[1..].iter().map(|&x| x + last_offset - start));
 1544 |         }
 1545 |         byte_ranges.push(get_byte_range::<T>(&mut o));
 1546 |     }
 1547 |     (LanceBuffer::reinterpret_vec(dest), byte_ranges)
 1548 | }
 1549 | 
 1550 | fn arrow_binary_to_data_block(
 1551 |     arrays: &[ArrayRef],
 1552 |     num_values: u64,
 1553 |     bits_per_offset: u8,
 1554 | ) -> DataBlock {
 1555 |     let data_vec = arrays.iter().map(|arr| arr.to_data()).collect::<Vec<_>>();
 1556 |     arrow_binary_array_data_to_data_block(&data_vec, num_values, bits_per_offset)
 1557 | }
 1558 | 
 1559 | fn arrow_binary_array_data_to_data_block(
 1560 |     data_vec: &[ArrayData],
 1561 |     num_values: u64,
 1562 |     bits_per_offset: u8,
 1563 | ) -> DataBlock {
 1564 |     let bytes_per_offset = bits_per_offset as usize / 8;
 1565 |     let offsets = data_vec
 1566 |         .iter()
 1567 |         .map(|d| {
 1568 |             LanceBuffer::from(d.buffers()[0].slice_with_length(
 1569 |                 d.offset() * bytes_per_offset,
 1570 |                 (d.len() + 1) * bytes_per_offset,
 1571 |             ))
 1572 |         })
 1573 |         .collect::<Vec<_>>();
 1574 |     let (offsets, data_ranges) = if bits_per_offset == 32 {
 1575 |         stitch_offsets::<i32>(offsets)
 1576 |     } else {
 1577 |         stitch_offsets::<i64>(offsets)
 1578 |     };
 1579 |     let data = data_vec
 1580 |         .iter()
 1581 |         .zip(data_ranges)
 1582 |         .map(|(d, byte_range)| {
 1583 |             LanceBuffer::from(
 1584 |                 d.buffers()[1]
 1585 |                     .slice_with_length(byte_range.start, byte_range.end - byte_range.start),
 1586 |             )
 1587 |         })
 1588 |         .collect::<Vec<_>>();
 1589 |     let data = LanceBuffer::concat_into_one(data);
 1590 |     DataBlock::VariableWidth(VariableWidthBlock {
 1591 |         data,
 1592 |         offsets,
 1593 |         bits_per_offset,
 1594 |         num_values,
 1595 |         block_info: BlockInfo::new(),
 1596 |     })
 1597 | }
 1598 | 
 1599 | fn encode_flat_data(arrays: &[ArrayRef], num_values: u64) -> LanceBuffer {
 1600 |     let bytes_per_value = arrays[0].data_type().byte_width();
 1601 |     let mut buffer = Vec::with_capacity(num_values as usize * bytes_per_value);
 1602 |     for arr in arrays {
 1603 |         let data = arr.to_data();
 1604 |         buffer.extend_from_slice(data.buffers()[0].as_slice());
 1605 |     }
 1606 |     LanceBuffer::from(buffer)
 1607 | }
 1608 | 
 1609 | fn do_encode_bitmap_data(bitmaps: &[BooleanBuffer], num_values: u64) -> LanceBuffer {
 1610 |     let mut builder = BooleanBufferBuilder::new(num_values as usize);
 1611 | 
 1612 |     for buf in bitmaps {
 1613 |         builder.append_buffer(buf);
 1614 |     }
 1615 | 
 1616 |     let buffer = builder.finish().into_inner();
 1617 |     LanceBuffer::from(buffer)
 1618 | }
 1619 | 
 1620 | fn encode_bitmap_data(arrays: &[ArrayRef], num_values: u64) -> LanceBuffer {
 1621 |     let bitmaps = arrays
 1622 |         .iter()
 1623 |         .map(|arr| arr.as_boolean().values().clone())
 1624 |         .collect::<Vec<_>>();
 1625 |     do_encode_bitmap_data(&bitmaps, num_values)
 1626 | }
 1627 | 
 1628 | // Concatenate dictionary arrays.  This is a bit tricky because we might overflow the
 1629 | // index type.  If we do, we need to upscale the indices to a larger type.
 1630 | fn concat_dict_arrays(arrays: &[ArrayRef]) -> ArrayRef {
 1631 |     let value_type = arrays[0].as_any_dictionary().values().data_type();
 1632 |     let array_refs = arrays.iter().map(|arr| arr.as_ref()).collect::<Vec<_>>();
 1633 |     match arrow_select::concat::concat(&array_refs) {
 1634 |         Ok(array) => array,
 1635 |         Err(arrow_schema::ArrowError::DictionaryKeyOverflowError) => {
 1636 |             // Slow, but hopefully a corner case.  Optimize later
 1637 |             let upscaled = array_refs
 1638 |                 .iter()
 1639 |                 .map(|arr| {
 1640 |                     match arrow_cast::cast(
 1641 |                         *arr,
 1642 |                         &DataType::Dictionary(
 1643 |                             Box::new(DataType::UInt32),
 1644 |                             Box::new(value_type.clone()),
 1645 |                         ),
 1646 |                     ) {
 1647 |                         Ok(arr) => arr,
 1648 |                         Err(arrow_schema::ArrowError::DictionaryKeyOverflowError) => {
 1649 |                             // Technically I think this means the input type was u64 already
 1650 |                             unimplemented!("Dictionary arrays with more than 2^32 unique values")
 1651 |                         }
 1652 |                         err => err.unwrap(),
 1653 |                     }
 1654 |                 })
 1655 |                 .collect::<Vec<_>>();
 1656 |             let array_refs = upscaled.iter().map(|arr| arr.as_ref()).collect::<Vec<_>>();
 1657 |             // Can still fail if concat pushes over u32 boundary
 1658 |             match arrow_select::concat::concat(&array_refs) {
 1659 |                 Ok(array) => array,
 1660 |                 Err(arrow_schema::ArrowError::DictionaryKeyOverflowError) => {
 1661 |                     unimplemented!("Dictionary arrays with more than 2^32 unique values")
 1662 |                 }
 1663 |                 err => err.unwrap(),
 1664 |             }
 1665 |         }
 1666 |         // Shouldn't be any other possible errors in concat
 1667 |         err => err.unwrap(),
 1668 |     }
 1669 | }
 1670 | 
 1671 | fn max_index_val(index_type: &DataType) -> u64 {
 1672 |     match index_type {
 1673 |         DataType::Int8 => i8::MAX as u64,
 1674 |         DataType::Int16 => i16::MAX as u64,
 1675 |         DataType::Int32 => i32::MAX as u64,
 1676 |         DataType::Int64 => i64::MAX as u64,
 1677 |         DataType::UInt8 => u8::MAX as u64,
 1678 |         DataType::UInt16 => u16::MAX as u64,
 1679 |         DataType::UInt32 => u32::MAX as u64,
 1680 |         DataType::UInt64 => u64::MAX,
 1681 |         _ => panic!("Invalid dictionary index type"),
 1682 |     }
 1683 | }
 1684 | 
 1685 | // If we get multiple dictionary arrays and they don't all have the same dictionary
 1686 | // then we need to normalize the indices.  Otherwise we might have something like:
 1687 | //
 1688 | // First chunk ["hello", "foo"], [0, 0, 1, 1, 1]
 1689 | // Second chunk ["bar", "world"], [0, 1, 0, 1, 1]
 1690 | //
 1691 | // If we simply encode as ["hello", "foo", "bar", "world"], [0, 0, 1, 1, 1, 0, 1, 0, 1, 1]
 1692 | // then we will get the wrong answer because the dictionaries were not merged and the indices
 1693 | // were not remapped.
 1694 | //
 1695 | // A simple way to do this today is to just concatenate all the arrays.  This is because
 1696 | // arrow's dictionary concatenation function already has the logic to merge dictionaries.
 1697 | //
 1698 | // TODO: We could be more efficient here by checking if the dictionaries are the same
 1699 | //       Also, if they aren't, we can possibly do something cheaper than concatenating
 1700 | //
 1701 | // In addition, we want to normalize the representation of nulls.  The cheapest thing to
 1702 | // do (space-wise) is to put the nulls in the dictionary.
 1703 | fn arrow_dictionary_to_data_block(arrays: &[ArrayRef], validity: Option<NullBuffer>) -> DataBlock {
 1704 |     let array = concat_dict_arrays(arrays);
 1705 |     let array_dict = array.as_any_dictionary();
 1706 |     let mut indices = array_dict.keys();
 1707 |     let num_values = indices.len() as u64;
 1708 |     let mut values = array_dict.values().clone();
 1709 | 
 1710 |     // TODO: Should we just always normalize indices to u32?  That would make logic simpler
 1711 |     // and we're going to bitpack them soon anyways
 1712 | 
 1713 |     let indices_block = if let Some(validity) = validity {
 1714 |         // If there is validity then we find the first invalid index in the dictionary values, inserting
 1715 |         // a new value if we need to.  Then we change all indices to point to that value.  This way we
 1716 |         // never need to store nullability of the indices.
 1717 |         let mut first_invalid_index = None;
 1718 |         if let Some(values_validity) = values.nulls() {
 1719 |             first_invalid_index = (!values_validity.inner()).set_indices().next();
 1720 |         }
 1721 |         let first_invalid_index = first_invalid_index.unwrap_or_else(|| {
 1722 |             let null_arr = new_null_array(values.data_type(), 1);
 1723 |             values = arrow_select::concat::concat(&[values.as_ref(), null_arr.as_ref()]).unwrap();
 1724 |             values.len() - 1
 1725 |         });
 1726 |         let max_index_val = max_index_val(indices.data_type());
 1727 |         let upcast = if first_invalid_index as u64 > max_index_val {
 1728 |             // Widen the index type when the null dictionary value cannot be addressed by the
 1729 |             // declared key type, whether the value already existed or was appended above.
 1730 |             if max_index_val >= u32::MAX as u64 {
 1731 |                 unimplemented!("Dictionary arrays with 2^32 unique value (or more) and a null")
 1732 |             }
 1733 |             Some(arrow_cast::cast(indices, &DataType::UInt32).unwrap())
 1734 |         } else {
 1735 |             None
 1736 |         };
 1737 |         if let Some(upcast) = upcast.as_ref() {
 1738 |             indices = upcast;
 1739 |         }
 1740 |         // This can't fail since we already checked for fit
 1741 |         let null_index_arr = arrow_cast::cast(
 1742 |             &UInt64Array::from(vec![first_invalid_index as u64]),
 1743 |             indices.data_type(),
 1744 |         )
 1745 |         .unwrap();
 1746 | 
 1747 |         let bytes_per_index = indices.data_type().byte_width();
 1748 |         let bits_per_index = bytes_per_index as u64 * 8;
 1749 | 
 1750 |         let null_index_arr = null_index_arr.into_data();
 1751 |         let null_index_bytes = &null_index_arr.buffers()[0];
 1752 |         // Need to make a copy here since indices isn't mutable, could be avoided in theory
 1753 |         let mut indices_bytes = indices.to_data().buffers()[0].to_vec();
 1754 |         for invalid_idx in (!validity.inner()).set_indices() {
 1755 |             indices_bytes[invalid_idx * bytes_per_index..(invalid_idx + 1) * bytes_per_index]
 1756 |                 .copy_from_slice(null_index_bytes.as_slice());
 1757 |         }
 1758 |         FixedWidthDataBlock {
 1759 |             data: LanceBuffer::from(indices_bytes),
 1760 |             bits_per_value: bits_per_index,
 1761 |             num_values,
 1762 |             block_info: BlockInfo::new(),
 1763 |         }
 1764 |     } else {
 1765 |         FixedWidthDataBlock {
 1766 |             data: LanceBuffer::from(indices.to_data().buffers()[0].clone()),
 1767 |             bits_per_value: indices.data_type().byte_width() as u64 * 8,
 1768 |             num_values,
 1769 |             block_info: BlockInfo::new(),
 1770 |         }
 1771 |     };
 1772 | 
 1773 |     let items = DataBlock::from(values);
 1774 |     DataBlock::Dictionary(DictionaryDataBlock {
 1775 |         indices: indices_block,
 1776 |         dictionary: Box::new(items),
 1777 |     })
 1778 | }
 1779 | 
 1780 | enum Nullability {
 1781 |     None,
 1782 |     All,
 1783 |     Some(NullBuffer),
 1784 | }
 1785 | 
 1786 | impl Nullability {
 1787 |     fn to_option(&self) -> Option<NullBuffer> {
 1788 |         match self {
 1789 |             Self::Some(nulls) => Some(nulls.clone()),
 1790 |             _ => None,
 1791 |         }
 1792 |     }
 1793 | }
 1794 | 
 1795 | fn extract_nulls(arrays: &[ArrayRef], num_values: u64) -> Nullability {
 1796 |     let mut has_nulls = false;
 1797 |     let nulls_and_lens = arrays
 1798 |         .iter()
 1799 |         .map(|arr| {
 1800 |             let nulls = arr.logical_nulls();
 1801 |             has_nulls |= nulls.is_some();
 1802 |             (nulls, arr.len())
 1803 |         })
 1804 |         .collect::<Vec<_>>();
 1805 |     if !has_nulls {
 1806 |         return Nullability::None;
 1807 |     }
 1808 |     let mut builder = BooleanBufferBuilder::new(num_values as usize);
 1809 |     let mut num_nulls = 0;
 1810 |     for (null, len) in nulls_and_lens {
 1811 |         if let Some(null) = null {
 1812 |             num_nulls += null.null_count();
 1813 |             builder.append_buffer(&null.into_inner());
 1814 |         } else {
 1815 |             builder.append_n(len, true);
 1816 |         }
 1817 |     }
 1818 |     if num_nulls == num_values as usize {
 1819 |         Nullability::All
 1820 |     } else {
 1821 |         Nullability::Some(NullBuffer::new(builder.finish()))
 1822 |     }
 1823 | }
 1824 | 
 1825 | impl DataBlock {
 1826 |     fn validate_variable_width_offsets<T: ArrowNativeType + Ord>(
 1827 |         array_data: &ArrayData,
 1828 |     ) -> std::result::Result<(), String> {
 1829 |         if array_data.is_empty() && array_data.buffers()[0].is_empty() {
 1830 |             return Ok(());
 1831 |         }
 1832 |         let offset_size = std::mem::size_of::<T>();
 1833 |         let offset_start = array_data.offset() * offset_size;
 1834 |         let offset_len = (array_data.len() + 1) * offset_size;
 1835 |         let offset_buffer =
 1836 |             LanceBuffer::from(array_data.buffers()[0].slice_with_length(offset_start, offset_len));
 1837 |         let offsets = offset_buffer.borrow_to_typed_slice::<T>();
 1838 |         VariableWidthBlock::offset_violation_detail(
 1839 |             offsets.as_ref(),
 1840 |             array_data.buffers()[1].len(),
 1841 |             0,
 1842 |         )
 1843 |         .map_or(Ok(()), Err)
 1844 |     }
 1845 | 
 1846 |     // `validate_full` also rescans UTF-8 contents and character boundaries on every flush.
 1847 |     // Encoding only needs a complete monotonicity and bounds proof before slicing offsets.
 1848 |     fn validate_variable_width_layouts(array_data: &ArrayData) -> std::result::Result<(), String> {
 1849 |         match array_data.data_type() {
 1850 |             DataType::Binary | DataType::Utf8 => {
 1851 |                 Self::validate_variable_width_offsets::<i32>(array_data)?;
 1852 |             }
 1853 |             DataType::LargeBinary | DataType::LargeUtf8 => {
 1854 |                 Self::validate_variable_width_offsets::<i64>(array_data)?;
 1855 |             }
 1856 |             _ => {}
 1857 |         }
 1858 |         for child_data in array_data.child_data() {
 1859 |             Self::validate_variable_width_layouts(child_data)?;
 1860 |         }
 1861 |         Ok(())
 1862 |     }
 1863 | 
 1864 |     fn validate_array_data(
 1865 |         array_data: &ArrayData,
 1866 |         field_name: &str,
 1867 |         array_index: usize,
 1868 |     ) -> Result<()> {
 1869 |         let validation = array_data
 1870 |             .validate()
 1871 |             .map_err(|error| error.to_string())
 1872 |             .and_then(|_| Self::validate_variable_width_layouts(array_data));
 1873 |         validation.map_err(|error| {
 1874 |             Error::invalid_input_source(
 1875 |                 format!(
 1876 |                     "Invalid Arrow array for field '{}' at buffered array {}: {}",
 1877 |                     field_name, array_index, error
 1878 |                 )
 1879 |                 .into(),
 1880 |             )
 1881 |         })
 1882 |     }
 1883 | 
 1884 |     pub(crate) fn validate_arrays(arrays: &[ArrayRef], field_name: &str) -> Result<()> {
 1885 |         for (array_index, array) in arrays.iter().enumerate() {
 1886 |             Self::validate_array_data(&array.to_data(), field_name, array_index)?;
 1887 |         }
 1888 |         Ok(())
 1889 |     }
 1890 | 
 1891 |     pub fn from_arrays(arrays: &[ArrayRef], num_values: u64) -> Self {
 1892 |         if arrays.is_empty() || num_values == 0 {
 1893 |             return Self::AllNull(AllNullDataBlock { num_values: 0 });
 1894 |         }
 1895 | 
 1896 |         let data_type = arrays[0].data_type();
 1897 |         let nulls = extract_nulls(arrays, num_values);
 1898 | 
 1899 |         if let Nullability::All = nulls {
 1900 |             return Self::AllNull(AllNullDataBlock { num_values });
 1901 |         }
 1902 | 
 1903 |         let mut encoded = match data_type {
 1904 |             DataType::Binary | DataType::Utf8 => arrow_binary_to_data_block(arrays, num_values, 32),
 1905 |             // View types have no Lance disk representation; cast to the classic offset layout.
 1906 |             DataType::Utf8View => {
 1907 |                 let casted: Vec<ArrayRef> = arrays
 1908 |                     .iter()
 1909 |                     .map(|a| {
 1910 |                         arrow_cast::cast(a.as_ref(), &DataType::Utf8)
 1911 |                             .expect("Utf8View to Utf8 cast is always valid")
 1912 |                     })
 1913 |                     .collect();
 1914 |                 arrow_binary_to_data_block(&casted, num_values, 32)
 1915 |             }
 1916 |             DataType::BinaryView => {
 1917 |                 let casted: Vec<ArrayRef> = arrays
 1918 |                     .iter()
 1919 |                     .map(|a| {
 1920 |                         arrow_cast::cast(a.as_ref(), &DataType::Binary)
 1921 |                             .expect("BinaryView to Binary cast is always valid")
 1922 |                     })
 1923 |                     .collect();
 1924 |                 arrow_binary_to_data_block(&casted, num_values, 32)
 1925 |             }
 1926 |             DataType::LargeBinary | DataType::LargeUtf8 => {
 1927 |                 arrow_binary_to_data_block(arrays, num_values, 64)
 1928 |             }
 1929 |             DataType::Boolean => {
 1930 |                 let data = encode_bitmap_data(arrays, num_values);
 1931 |                 Self::FixedWidth(FixedWidthDataBlock {
 1932 |                     data,
 1933 |                     bits_per_value: 1,
 1934 |                     num_values,
 1935 |                     block_info: BlockInfo::new(),
 1936 |                 })
 1937 |             }
 1938 |             DataType::Date32
 1939 |             | DataType::Date64
 1940 |             | DataType::Decimal32(_, _)
 1941 |             | DataType::Decimal64(_, _)
 1942 |             | DataType::Decimal128(_, _)
 1943 |             | DataType::Decimal256(_, _)
 1944 |             | DataType::Duration(_)
 1945 |             | DataType::FixedSizeBinary(_)
 1946 |             | DataType::Float16
 1947 |             | DataType::Float32
 1948 |             | DataType::Float64
 1949 |             | DataType::Int16
 1950 |             | DataType::Int32
 1951 |             | DataType::Int64
 1952 |             | DataType::Int8
 1953 |             | DataType::Interval(_)
 1954 |             | DataType::Time32(_)
 1955 |             | DataType::Time64(_)
 1956 |             | DataType::Timestamp(_, _)
 1957 |             | DataType::UInt16
 1958 |             | DataType::UInt32
 1959 |             | DataType::UInt64
 1960 |             | DataType::UInt8 => {
 1961 |                 let data = encode_flat_data(arrays, num_values);
 1962 |                 Self::FixedWidth(FixedWidthDataBlock {
 1963 |                     data,
 1964 |                     bits_per_value: data_type.byte_width() as u64 * 8,
 1965 |                     num_values,
 1966 |                     block_info: BlockInfo::new(),
 1967 |                 })
 1968 |             }
 1969 |             DataType::Null => Self::AllNull(AllNullDataBlock { num_values }),
 1970 |             DataType::Dictionary(_, _) => arrow_dictionary_to_data_block(arrays, nulls.to_option()),
 1971 |             DataType::Struct(fields) => {
 1972 |                 let structs = arrays.iter().map(|arr| arr.as_struct()).collect::<Vec<_>>();
 1973 |                 let mut children = Vec::with_capacity(fields.len());
 1974 |                 for child_idx in 0..fields.len() {
 1975 |                     let child_vec = structs
 1976 |                         .iter()
 1977 |                         .map(|s| s.column(child_idx).clone())
 1978 |                         .collect::<Vec<_>>();
 1979 |                     children.push(Self::from_arrays(&child_vec, num_values));
 1980 |                 }
 1981 | 
 1982 |                 // Extract validity for the struct array
 1983 |                 let validity = match &nulls {
 1984 |                     Nullability::None => None,
 1985 |                     Nullability::Some(null_buffer) => Some(null_buffer.clone()),
 1986 |                     Nullability::All => unreachable!("Should have returned AllNull earlier"),
 1987 |                 };
 1988 | 
 1989 |                 Self::Struct(StructDataBlock {
 1990 |                     children,
 1991 |                     block_info: BlockInfo::default(),
 1992 |                     validity,
 1993 |                 })
 1994 |             }
 1995 |             DataType::FixedSizeList(_, dim) => {
 1996 |                 let children = arrays
 1997 |                     .iter()
 1998 |                     .map(|arr| arr.as_fixed_size_list().values().clone())
 1999 |                     .collect::<Vec<_>>();
 2000 |                 let child_block = Self::from_arrays(&children, num_values * *dim as u64);
 2001 |                 Self::FixedSizeList(FixedSizeListBlock {
 2002 |                     child: Box::new(child_block),
 2003 |                     dimension: *dim as u64,
 2004 |                 })
 2005 |             }
 2006 |             DataType::LargeList(_)
 2007 |             | DataType::List(_)
 2008 |             | DataType::ListView(_)
 2009 |             | DataType::LargeListView(_)
 2010 |             | DataType::Map(_, _)
 2011 |             | DataType::RunEndEncoded(_, _)
 2012 |             | DataType::Union(_, _) => {
 2013 |                 panic!(
 2014 |                     "Field with data type {} cannot be converted to data block",
 2015 |                     data_type
 2016 |                 )
 2017 |             }
 2018 |         };
 2019 | 
 2020 |         // compute statistics
 2021 |         encoded.compute_stat();
 2022 | 
 2023 |         if !matches!(data_type, DataType::Dictionary(_, _)) {
 2024 |             match nulls {
 2025 |                 Nullability::None => encoded,
 2026 |                 Nullability::Some(nulls) => Self::Nullable(NullableDataBlock {
 2027 |                     data: Box::new(encoded),
 2028 |                     nulls: LanceBuffer::from(nulls.into_inner().into_inner()),
 2029 |                     block_info: BlockInfo::new(),
 2030 |                 }),
 2031 |                 _ => unreachable!(),
 2032 |             }
 2033 |         } else {
 2034 |             // Dictionaries already insert the nulls into the dictionary items
 2035 |             encoded
 2036 |         }
 2037 |     }
 2038 | 
 2039 |     pub fn from_array<T: Array + 'static>(array: T) -> Self {
 2040 |         let num_values = array.len();
 2041 |         Self::from_arrays(&[Arc::new(array)], num_values as u64)
 2042 |     }
 2043 | }
 2044 | 
 2045 | impl From<ArrayRef> for DataBlock {
 2046 |     fn from(array: ArrayRef) -> Self {
 2047 |         let num_values = array.len() as u64;
 2048 |         Self::from_arrays(&[array], num_values)
 2049 |     }
 2050 | }
 2051 | 
 2052 | trait DataBlockBuilderImpl: std::fmt::Debug {
 2053 |     fn validate_append(&self, data_block: &DataBlock, selection: &Range<u64>) -> Result<()>;
 2054 | 
 2055 |     fn append_validated(&mut self, data_block: &DataBlock, selection: Range<u64>) -> Result<()>;
 2056 | 
 2057 |     fn append(&mut self, data_block: &DataBlock, selection: Range<u64>) -> Result<()> {
 2058 |         self.validate_append(data_block, &selection)?;
 2059 |         self.append_validated(data_block, selection)
 2060 |     }
 2061 | 
 2062 |     fn finish(self: Box<Self>) -> DataBlock;
 2063 | }
 2064 | 
 2065 | #[derive(Debug)]
 2066 | pub struct DataBlockBuilder {
 2067 |     estimated_size_bytes: u64,
 2068 |     builder: Option<Box<dyn DataBlockBuilderImpl>>,
 2069 | }
 2070 | 
 2071 | impl DataBlockBuilder {
 2072 |     pub fn with_capacity_estimate(estimated_size_bytes: u64) -> Self {
 2073 |         Self {
 2074 |             estimated_size_bytes,
 2075 |             builder: None,
 2076 |         }
 2077 |     }
 2078 | 
 2079 |     fn get_builder(&mut self, block: &DataBlock) -> &mut dyn DataBlockBuilderImpl {
 2080 |         if self.builder.is_none() {
 2081 |             self.builder = Some(block.make_builder(self.estimated_size_bytes));
 2082 |         }
 2083 |         self.builder.as_mut().unwrap().as_mut()
 2084 |     }
 2085 | 
 2086 |     pub fn append(&mut self, data_block: &DataBlock, selection: Range<u64>) -> Result<()> {
 2087 |         self.get_builder(data_block).append(data_block, selection)
 2088 |     }
 2089 | 
 2090 |     fn append_ranges(
 2091 |         &mut self,
 2092 |         data_block: &DataBlock,
 2093 |         selections: impl IntoIterator<Item = Range<u64>>,
 2094 |     ) -> Result<()> {
 2095 |         let full_selection = 0..data_block.num_values();
 2096 |         let builder = self.get_builder(data_block);
 2097 |         builder.validate_append(data_block, &full_selection)?;
 2098 |         for selection in selections {
 2099 |             if selection.start > selection.end || selection.end > full_selection.end {
 2100 |                 return Err(Error::corrupt_file_named(
 2101 |                     "data block",
 2102 |                     format!(
 2103 |                         "cannot append selection {}..{} from a block with {} values",
 2104 |                         selection.start, selection.end, full_selection.end
 2105 |                     ),
 2106 |                 ));
 2107 |             }
 2108 |             builder.append_validated(data_block, selection)?;
 2109 |         }
 2110 |         Ok(())
 2111 |     }
 2112 | 
 2113 |     pub fn finish(self) -> DataBlock {
 2114 |         let builder = self.builder.expect("DataBlockBuilder didn't see any data");
 2115 |         builder.finish()
 2116 |     }
 2117 | }
 2118 | 
 2119 | #[cfg(test)]
 2120 | mod tests {
 2121 |     use std::sync::Arc;
 2122 | 
 2123 |     use arrow_array::{
 2124 |         ArrayRef, BinaryArray, BinaryViewArray, DictionaryArray, Int8Array, LargeBinaryArray,
 2125 |         LargeStringArray, StringArray, StringViewArray, UInt8Array, UInt16Array, make_array,
 2126 |         new_null_array,
 2127 |         types::{Int8Type, Int32Type},
 2128 |     };
 2129 |     use arrow_buffer::{BooleanBuffer, Buffer, NullBuffer};
 2130 |     use arrow_data::ArrayData;
 2131 | 
 2132 |     use arrow_schema::{DataType, Field, Fields};
 2133 |     use lance_core::Error;
 2134 |     use lance_datagen::{ArrayGeneratorExt, DEFAULT_SEED, RowCount, array};
 2135 |     use rand::SeedableRng;
 2136 |     use rstest::rstest;
 2137 | 
 2138 |     use crate::buffer::LanceBuffer;
 2139 | 
 2140 |     use super::{
 2141 |         AllNullDataBlock, BlockInfo, DataBlock, DataBlockBuilder, DictionaryDataBlock,
 2142 |         FixedWidthDataBlock, VariableWidthBlock,
 2143 |     };
 2144 | 
 2145 |     use arrow_array::Array;
 2146 | 
 2147 |     #[test]
 2148 |     fn test_sliced_to_data_block() {
 2149 |         let ints = UInt16Array::from(vec![0, 1, 2, 3, 4, 5, 6, 7, 8]);
 2150 |         let ints = ints.slice(2, 4);
 2151 |         let data = DataBlock::from_array(ints);
 2152 | 
 2153 |         let fixed_data = data.as_fixed_width().unwrap();
 2154 |         assert_eq!(fixed_data.num_values, 4);
 2155 |         assert_eq!(fixed_data.data.len(), 8);
 2156 | 
 2157 |         let nullable_ints =
 2158 |             UInt16Array::from(vec![Some(0), None, Some(2), None, Some(4), None, Some(6)]);
 2159 |         let nullable_ints = nullable_ints.slice(1, 3);
 2160 |         let data = DataBlock::from_array(nullable_ints);
 2161 | 
 2162 |         let nullable = data.as_nullable().unwrap();
 2163 |         assert_eq!(nullable.nulls, LanceBuffer::from(vec![0b00000010]));
 2164 |     }
 2165 | 
 2166 |     #[test]
 2167 |     fn test_string_to_data_block() {
 2168 |         // Converting string arrays that contain nulls to DataBlock
 2169 |         let strings1 = StringArray::from(vec![Some("hello"), None, Some("world")]);
 2170 |         let strings2 = StringArray::from(vec![Some("a"), Some("b")]);
 2171 |         let strings3 = StringArray::from(vec![Option::<&'static str>::None, None]);
 2172 | 
 2173 |         let arrays = &[strings1, strings2, strings3]
 2174 |             .iter()
 2175 |             .map(|arr| Arc::new(arr.clone()) as ArrayRef)
 2176 |             .collect::<Vec<_>>();
 2177 | 
 2178 |         let block = DataBlock::from_arrays(arrays, 7);
 2179 | 
 2180 |         assert_eq!(block.num_values(), 7);
 2181 |         let block = block.as_nullable().unwrap();
 2182 | 
 2183 |         assert_eq!(block.nulls, LanceBuffer::from(vec![0b00011101]));
 2184 | 
 2185 |         let data = block.data.as_variable_width().unwrap();
 2186 |         assert_eq!(
 2187 |             data.offsets,
 2188 |             LanceBuffer::reinterpret_vec(vec![0, 5, 5, 10, 11, 12, 12, 12])
 2189 |         );
 2190 | 
 2191 |         assert_eq!(data.data, LanceBuffer::copy_slice(b"helloworldab"));
 2192 | 
 2193 |         // Converting string arrays that do not contain nulls to DataBlock
 2194 |         let strings1 = StringArray::from(vec![Some("a"), Some("bc")]);
 2195 |         let strings2 = StringArray::from(vec![Some("def")]);
 2196 | 
 2197 |         let arrays = &[strings1, strings2]
 2198 |             .iter()
 2199 |             .map(|arr| Arc::new(arr.clone()) as ArrayRef)
 2200 |             .collect::<Vec<_>>();
 2201 | 
 2202 |         let block = DataBlock::from_arrays(arrays, 3);
 2203 | 
 2204 |         assert_eq!(block.num_values(), 3);
 2205 |         // Should be no nullable wrapper
 2206 |         let data = block.as_variable_width().unwrap();
 2207 |         assert_eq!(data.offsets, LanceBuffer::reinterpret_vec(vec![0, 1, 3, 6]));
 2208 |         assert_eq!(data.data, LanceBuffer::copy_slice(b"abcdef"));
 2209 |     }
 2210 | 
 2211 |     #[test]
 2212 |     fn test_string_view_to_data_block() {
 2213 |         let views1 = StringViewArray::from(vec![Some("hello"), None, Some("world")]);
 2214 |         let views2 = StringViewArray::from(vec![Some("a"), Some("b")]);
 2215 |         let views3 = StringViewArray::from(vec![Option::<&'static str>::None, None]);
 2216 | 
 2217 |         let arrays = &[views1, views2, views3]
 2218 |             .iter()
 2219 |             .map(|arr| Arc::new(arr.clone()) as ArrayRef)
 2220 |             .collect::<Vec<_>>();
 2221 | 
 2222 |         let block = DataBlock::from_arrays(arrays, 7);
 2223 | 
 2224 |         assert_eq!(block.num_values(), 7);
 2225 |         let block = block.as_nullable().unwrap();
 2226 |         assert_eq!(block.nulls, LanceBuffer::from(vec![0b00011101]));
 2227 |         let data = block.data.as_variable_width().unwrap();
 2228 |         assert_eq!(
 2229 |             data.offsets,
 2230 |             LanceBuffer::reinterpret_vec(vec![0, 5, 5, 10, 11, 12, 12, 12])
 2231 |         );
 2232 |         assert_eq!(data.data, LanceBuffer::copy_slice(b"helloworldab"));
 2233 | 
 2234 |         let views1 = StringViewArray::from(vec![Some("a"), Some("bc")]);
 2235 |         let views2 = StringViewArray::from(vec![Some("def")]);
 2236 | 
 2237 |         let arrays = &[views1, views2]
 2238 |             .iter()
 2239 |             .map(|arr| Arc::new(arr.clone()) as ArrayRef)
 2240 |             .collect::<Vec<_>>();
 2241 | 
 2242 |         let block = DataBlock::from_arrays(arrays, 3);
 2243 | 
 2244 |         assert_eq!(block.num_values(), 3);
 2245 |         let data = block.as_variable_width().unwrap();
 2246 |         assert_eq!(data.offsets, LanceBuffer::reinterpret_vec(vec![0, 1, 3, 6]));
 2247 |         assert_eq!(data.data, LanceBuffer::copy_slice(b"abcdef"));
 2248 |     }
 2249 | 
 2250 |     #[test]
 2251 |     fn test_binary_view_to_data_block() {
 2252 |         let arr: ArrayRef = Arc::new(BinaryViewArray::from(vec![
 2253 |             Some(b"foo".as_slice()),
 2254 |             None,
 2255 |             Some(b"bar".as_slice()),
 2256 |         ]));
 2257 |         let block = DataBlock::from_arrays(&[arr], 3);
 2258 |         let block = block.as_nullable().unwrap();
 2259 |         let data = block.data.as_variable_width().unwrap();
 2260 |         assert_eq!(data.data, LanceBuffer::copy_slice(b"foobar"));
 2261 |     }
 2262 | 
 2263 |     #[test]
 2264 |     fn test_string_sliced() {
 2265 |         let check = |arr: Vec<StringArray>, expected_off: Vec<i32>, expected_data: &[u8]| {
 2266 |             let arrs = arr
 2267 |                 .into_iter()
 2268 |                 .map(|a| Arc::new(a) as ArrayRef)
 2269 |                 .collect::<Vec<_>>();
 2270 |             let num_rows = arrs.iter().map(|a| a.len()).sum::<usize>() as u64;
 2271 |             let data = DataBlock::from_arrays(&arrs, num_rows);
 2272 | 
 2273 |             assert_eq!(data.num_values(), num_rows);
 2274 | 
 2275 |             let data = data.as_variable_width().unwrap();
 2276 |             assert_eq!(data.offsets, LanceBuffer::reinterpret_vec(expected_off));
 2277 |             assert_eq!(data.data, LanceBuffer::copy_slice(expected_data));
 2278 |         };
 2279 | 
 2280 |         let string = StringArray::from(vec![Some("hello"), Some("world")]);
 2281 |         check(vec![string.slice(1, 1)], vec![0, 5], b"world");
 2282 |         check(vec![string.slice(0, 1)], vec![0, 5], b"hello");
 2283 |         check(
 2284 |             vec![string.slice(0, 1), string.slice(1, 1)],
 2285 |             vec![0, 5, 10],
 2286 |             b"helloworld",
 2287 |         );
 2288 | 
 2289 |         let string2 = StringArray::from(vec![Some("foo"), Some("bar")]);
 2290 |         check(
 2291 |             vec![string.slice(0, 1), string2.slice(0, 1)],
 2292 |             vec![0, 5, 8],
 2293 |             b"hellofoo",
 2294 |         );
 2295 |     }
 2296 | 
 2297 |     #[rstest]
 2298 |     #[case::utf8(
 2299 |         DataType::Utf8,
 2300 |         Buffer::from_slice_ref([0_i32, 5, 10]),
 2301 |         32,
 2302 |         LanceBuffer::reinterpret_vec(vec![0_i32, 5])
 2303 |     )]
 2304 |     #[case::large_utf8(
 2305 |         DataType::LargeUtf8,
 2306 |         Buffer::from_slice_ref([0_i64, 5, 10]),
 2307 |         64,
 2308 |         LanceBuffer::reinterpret_vec(vec![0_i64, 5])
 2309 |     )]
 2310 |     fn test_variable_width_array_data_offset(
 2311 |         #[case] data_type: DataType,
 2312 |         #[case] offsets: Buffer,
 2313 |         #[case] bits_per_offset: u8,
 2314 |         #[case] expected_offsets: LanceBuffer,
 2315 |     ) {
 2316 |         let array_data = ArrayData::builder(data_type)
 2317 |             .len(1)
 2318 |             .offset(1)
 2319 |             .add_buffer(offsets)
 2320 |             .add_buffer(Buffer::from(b"helloworld"))
 2321 |             .build()
 2322 |             .unwrap();
 2323 | 
 2324 |         DataBlock::validate_array_data(&array_data, "text", 0).unwrap();
 2325 |         let data = super::arrow_binary_array_data_to_data_block(&[array_data], 1, bits_per_offset);
 2326 | 
 2327 |         let data = data.as_variable_width().unwrap();
 2328 |         assert_eq!(data.offsets, expected_offsets);
 2329 |         assert_eq!(data.data, LanceBuffer::copy_slice(b"world"));
 2330 |     }
 2331 | 
 2332 |     #[rstest]
 2333 |     #[case::utf8(DataType::Utf8, Buffer::from_slice_ref([0_i32, -1]))]
 2334 |     #[case::large_utf8(DataType::LargeUtf8, Buffer::from_slice_ref([0_i64, -1]))]
 2335 |     fn test_invalid_string_offsets_rejected_before_encoding(
 2336 |         #[case] data_type: DataType,
 2337 |         #[case] offsets: Buffer,
 2338 |     ) {
 2339 |         let array_data = unsafe {
 2340 |             ArrayData::builder(data_type)
 2341 |                 .len(1)
 2342 |                 .add_buffer(offsets)
 2343 |                 .add_buffer(Buffer::from(b""))
 2344 |                 .build_unchecked()
 2345 |         };
 2346 | 
 2347 |         let error = DataBlock::validate_array_data(&array_data, "text", 0).unwrap_err();
 2348 | 
 2349 |         assert!(matches!(error, Error::InvalidInput { .. }));
 2350 |         let message = error.to_string();
 2351 |         assert!(
 2352 |             message.contains("field 'text'"),
 2353 |             "unexpected message: {message}"
 2354 |         );
 2355 |         assert!(
 2356 |             message.contains("offset[1] (-1)"),
 2357 |             "unexpected message: {message}"
 2358 |         );
 2359 |     }
 2360 | 
 2361 |     #[test]
 2362 |     fn test_large() {
 2363 |         let arr = LargeBinaryArray::from_vec(vec![b"hello", b"world"]);
 2364 |         let data = DataBlock::from_array(arr);
 2365 | 
 2366 |         assert_eq!(data.num_values(), 2);
 2367 |         let data = data.as_variable_width().unwrap();
 2368 |         assert_eq!(data.bits_per_offset, 64);
 2369 |         assert_eq!(data.num_values, 2);
 2370 |         assert_eq!(data.data, LanceBuffer::copy_slice(b"helloworld"));
 2371 |         assert_eq!(
 2372 |             data.offsets,
 2373 |             LanceBuffer::reinterpret_vec(vec![0_u64, 5, 10])
 2374 |         );
 2375 |     }
 2376 | 
 2377 |     #[test]
 2378 |     fn test_dictionary_indices_normalized() {
 2379 |         let arr1 = DictionaryArray::<Int8Type>::from_iter([Some("a"), Some("a"), Some("b")]);
 2380 |         let arr2 = DictionaryArray::<Int8Type>::from_iter([Some("b"), Some("c")]);
 2381 | 
 2382 |         let data = DataBlock::from_arrays(&[Arc::new(arr1), Arc::new(arr2)], 5);
 2383 | 
 2384 |         assert_eq!(data.num_values(), 5);
 2385 |         let data = data.as_dictionary().unwrap();
 2386 |         let indices = data.indices;
 2387 |         assert_eq!(indices.bits_per_value, 8);
 2388 |         assert_eq!(indices.num_values, 5);
 2389 |         assert_eq!(
 2390 |             indices.data,
 2391 |             // You might expect 0, 0, 1, 1, 2 but it seems that arrow's dictionary concat does
 2392 |             // not actually collapse dictionaries.  This is an arrow problem however, and we don't
 2393 |             // need to fix it here.
 2394 |             LanceBuffer::reinterpret_vec::<i8>(vec![0, 0, 1, 2, 3])
 2395 |         );
 2396 | 
 2397 |         let items = data.dictionary.as_variable_width().unwrap();
 2398 |         assert_eq!(items.bits_per_offset, 32);
 2399 |         assert_eq!(items.num_values, 4);
 2400 |         assert_eq!(items.data, LanceBuffer::copy_slice(b"abbc"));
 2401 |         assert_eq!(
 2402 |             items.offsets,
 2403 |             LanceBuffer::reinterpret_vec(vec![0, 1, 2, 3, 4],)
 2404 |         );
 2405 |     }
 2406 | 
 2407 |     #[test]
 2408 |     fn test_dictionary_nulls() {
 2409 |         // Test both ways of encoding nulls
 2410 | 
 2411 |         // By default, nulls get encoded into the indices
 2412 |         let arr1 = DictionaryArray::<Int8Type>::from_iter([None, Some("a"), Some("b")]);
 2413 |         let arr2 = DictionaryArray::<Int8Type>::from_iter([Some("c"), None]);
 2414 | 
 2415 |         let data = DataBlock::from_arrays(&[Arc::new(arr1), Arc::new(arr2)], 5);
 2416 | 
 2417 |         let check_common = |data: DataBlock| {
 2418 |             assert_eq!(data.num_values(), 5);
 2419 |             let dict = data.as_dictionary().unwrap();
 2420 | 
 2421 |             let nullable_items = dict.dictionary.as_nullable().unwrap();
 2422 |             assert_eq!(nullable_items.nulls, LanceBuffer::from(vec![0b00000111]));
 2423 |             assert_eq!(nullable_items.data.num_values(), 4);
 2424 | 
 2425 |             let items = nullable_items.data.as_variable_width().unwrap();
 2426 |             assert_eq!(items.bits_per_offset, 32);
 2427 |             assert_eq!(items.num_values, 4);
 2428 |             assert_eq!(items.data, LanceBuffer::copy_slice(b"abc"));
 2429 |             assert_eq!(
 2430 |                 items.offsets,
 2431 |                 LanceBuffer::reinterpret_vec(vec![0, 1, 2, 3, 3],)
 2432 |             );
 2433 | 
 2434 |             let indices = dict.indices;
 2435 |             assert_eq!(indices.bits_per_value, 8);
 2436 |             assert_eq!(indices.num_values, 5);
 2437 |             assert_eq!(
 2438 |                 indices.data,
 2439 |                 LanceBuffer::reinterpret_vec::<i8>(vec![3, 0, 1, 2, 3])
 2440 |             );
 2441 |         };
 2442 |         check_common(data);
 2443 | 
 2444 |         // However, we can manually create a dictionary where nulls are in the dictionary
 2445 |         let items = StringArray::from(vec![Some("a"), Some("b"), Some("c"), None]);
 2446 |         let indices = Int8Array::from(vec![Some(3), Some(0), Some(1), Some(2), Some(3)]);
 2447 |         let dict = DictionaryArray::new(indices, Arc::new(items));
 2448 | 
 2449 |         let data = DataBlock::from_array(dict);
 2450 | 
 2451 |         check_common(data);
 2452 |     }
 2453 | 
 2454 |     #[test]
 2455 |     fn test_dictionary_cannot_add_null() {
 2456 |         // 256 unique strings
 2457 |         let items = StringArray::from(
 2458 |             (0..256)
 2459 |                 .map(|i| Some(String::from_utf8(vec![0; i]).unwrap()))
 2460 |                 .collect::<Vec<_>>(),
 2461 |         );
 2462 |         // 257 indices, covering the whole range, plus one null
 2463 |         let indices = UInt8Array::from(
 2464 |             (0..=256)
 2465 |                 .map(|i| if i == 256 { None } else { Some(i as u8) })
 2466 |                 .collect::<Vec<_>>(),
 2467 |         );
 2468 |         // We want to normalize this by pushing nulls into the dictionary, but we cannot because
 2469 |         // the dictionary is too large for the index type
 2470 |         let dict = DictionaryArray::new(indices, Arc::new(items));
 2471 |         let data = DataBlock::from_array(dict);
 2472 | 
 2473 |         assert_eq!(data.num_values(), 257);
 2474 | 
 2475 |         let dict = data.as_dictionary().unwrap();
 2476 | 
 2477 |         assert_eq!(dict.indices.bits_per_value, 32);
 2478 |         assert_eq!(
 2479 |             dict.indices.data,
 2480 |             LanceBuffer::reinterpret_vec((0_u32..257).collect::<Vec<_>>())
 2481 |         );
 2482 | 
 2483 |         let nullable_items = dict.dictionary.as_nullable().unwrap();
 2484 |         let null_buffer = NullBuffer::new(BooleanBuffer::new(
 2485 |             nullable_items.nulls.into_buffer(),
 2486 |             0,
 2487 |             257,
 2488 |         ));
 2489 |         for i in 0..256 {
 2490 |             assert!(!null_buffer.is_null(i));
 2491 |         }
 2492 |         assert!(null_buffer.is_null(256));
 2493 | 
 2494 |         assert_eq!(
 2495 |             nullable_items.data.as_variable_width().unwrap().data.len(),
 2496 |             32640
 2497 |         );
 2498 |     }
 2499 | 
 2500 |     #[test]
 2501 |     fn test_all_null() {
 2502 |         for data_type in [
 2503 |             DataType::UInt32,
 2504 |             DataType::FixedSizeBinary(2),
 2505 |             DataType::List(Arc::new(Field::new("item", DataType::UInt32, true))),
 2506 |             DataType::Struct(Fields::from(vec![Field::new("a", DataType::UInt32, true)])),
 2507 |         ] {
 2508 |             let block = DataBlock::AllNull(AllNullDataBlock { num_values: 10 });
 2509 |             let arr = block.into_arrow(data_type.clone(), true).unwrap();
 2510 |             let arr = make_array(arr);
 2511 |             let expected = new_null_array(&data_type, 10);
 2512 |             assert_eq!(&arr, &expected);
 2513 |         }
 2514 |     }
 2515 | 
 2516 |     #[test]
 2517 |     fn test_dictionary_cannot_concatenate() {
 2518 |         // 256 unique strings
 2519 |         let items = StringArray::from(
 2520 |             (0..256)
 2521 |                 .map(|i| Some(String::from_utf8(vec![0; i]).unwrap()))
 2522 |                 .collect::<Vec<_>>(),
 2523 |         );
 2524 |         // 256 different unique strings
 2525 |         let other_items = StringArray::from(
 2526 |             (0..256)
 2527 |                 .map(|i| Some(String::from_utf8(vec![1; i + 1]).unwrap()))
 2528 |                 .collect::<Vec<_>>(),
 2529 |         );
 2530 |         let indices = UInt8Array::from_iter_values(0..=255);
 2531 |         let dict1 = DictionaryArray::new(indices.clone(), Arc::new(items));
 2532 |         let dict2 = DictionaryArray::new(indices, Arc::new(other_items));
 2533 |         let data = DataBlock::from_arrays(&[Arc::new(dict1), Arc::new(dict2)], 512);
 2534 |         assert_eq!(data.num_values(), 512);
 2535 | 
 2536 |         let dict = data.as_dictionary().unwrap();
 2537 | 
 2538 |         assert_eq!(dict.indices.bits_per_value, 32);
 2539 |         assert_eq!(
 2540 |             dict.indices.data,
 2541 |             LanceBuffer::reinterpret_vec::<u32>((0..512).collect::<Vec<_>>())
 2542 |         );
 2543 |         // What fun: 0 + 1 + .. + 255 + 1 + 2 + .. + 256 = 2^16
 2544 |         assert_eq!(
 2545 |             dict.dictionary.as_variable_width().unwrap().data.len(),
 2546 |             65536
 2547 |         );
 2548 |     }
 2549 | 
 2550 |     #[test]
 2551 |     fn test_data_size() {
 2552 |         let mut rng = rand_xoshiro::Xoshiro256PlusPlus::seed_from_u64(DEFAULT_SEED.0);
 2553 |         // test data_size() when input has no nulls
 2554 |         let mut genn = array::rand::<Int32Type>().with_nulls(&[false, false, false]);
 2555 | 
 2556 |         let arr = genn.generate(RowCount::from(3), &mut rng).unwrap();
 2557 |         let block = DataBlock::from_array(arr.clone());
 2558 |         assert!(block.data_size() == arr.get_buffer_memory_size() as u64);
 2559 | 
 2560 |         let arr = genn.generate(RowCount::from(400), &mut rng).unwrap();
 2561 |         let block = DataBlock::from_array(arr.clone());
 2562 |         assert!(block.data_size() == arr.get_buffer_memory_size() as u64);
 2563 | 
 2564 |         // test data_size() when input has nulls
 2565 |         let mut genn = array::rand::<Int32Type>().with_nulls(&[false, true, false]);
 2566 |         let arr = genn.generate(RowCount::from(3), &mut rng).unwrap();
 2567 |         let block = DataBlock::from_array(arr.clone());
 2568 | 
 2569 |         let array_data = arr.to_data();
 2570 |         let total_buffer_size: usize = array_data.buffers().iter().map(|buffer| buffer.len()).sum();
 2571 |         // the NullBuffer.len() returns the length in bits so we divide_round_up by 8
 2572 |         let array_nulls_size_in_bytes = arr.nulls().unwrap().len().div_ceil(8);
 2573 |         assert!(block.data_size() == (total_buffer_size + array_nulls_size_in_bytes) as u64);
 2574 | 
 2575 |         let arr = genn.generate(RowCount::from(400), &mut rng).unwrap();
 2576 |         let block = DataBlock::from_array(arr.clone());
 2577 | 
 2578 |         let array_data = arr.to_data();
 2579 |         let total_buffer_size: usize = array_data.buffers().iter().map(|buffer| buffer.len()).sum();
 2580 |         let array_nulls_size_in_bytes = arr.nulls().unwrap().len().div_ceil(8);
 2581 |         assert!(block.data_size() == (total_buffer_size + array_nulls_size_in_bytes) as u64);
 2582 | 
 2583 |         let mut genn = array::rand::<Int32Type>().with_nulls(&[true, true, false]);
 2584 |         let arr = genn.generate(RowCount::from(3), &mut rng).unwrap();
 2585 |         let block = DataBlock::from_array(arr.clone());
 2586 | 
 2587 |         let array_data = arr.to_data();
 2588 |         let total_buffer_size: usize = array_data.buffers().iter().map(|buffer| buffer.len()).sum();
 2589 |         let array_nulls_size_in_bytes = arr.nulls().unwrap().len().div_ceil(8);
 2590 |         assert!(block.data_size() == (total_buffer_size + array_nulls_size_in_bytes) as u64);
 2591 | 
 2592 |         let arr = genn.generate(RowCount::from(400), &mut rng).unwrap();
 2593 |         let block = DataBlock::from_array(arr.clone());
 2594 | 
 2595 |         let array_data = arr.to_data();
 2596 |         let total_buffer_size: usize = array_data.buffers().iter().map(|buffer| buffer.len()).sum();
 2597 |         let array_nulls_size_in_bytes = arr.nulls().unwrap().len().div_ceil(8);
 2598 |         assert!(block.data_size() == (total_buffer_size + array_nulls_size_in_bytes) as u64);
 2599 | 
 2600 |         let mut genn = array::rand::<Int32Type>().with_nulls(&[false, true, false]);
 2601 |         let arr1 = genn.generate(RowCount::from(3), &mut rng).unwrap();
 2602 |         let arr2 = genn.generate(RowCount::from(3), &mut rng).unwrap();
 2603 |         let arr3 = genn.generate(RowCount::from(3), &mut rng).unwrap();
 2604 |         let block = DataBlock::from_arrays(&[arr1.clone(), arr2.clone(), arr3.clone()], 9);
 2605 | 
 2606 |         let concatenated_array = arrow_select::concat::concat(&[
 2607 |             &*Arc::new(arr1.clone()) as &dyn Array,
 2608 |             &*Arc::new(arr2.clone()) as &dyn Array,
 2609 |             &*Arc::new(arr3.clone()) as &dyn Array,
 2610 |         ])
 2611 |         .unwrap();
 2612 |         let total_buffer_size: usize = concatenated_array
 2613 |             .to_data()
 2614 |             .buffers()
 2615 |             .iter()
 2616 |             .map(|buffer| buffer.len())
 2617 |             .sum();
 2618 | 
 2619 |         let total_nulls_size_in_bytes = concatenated_array.nulls().unwrap().len().div_ceil(8);
 2620 |         assert!(block.data_size() == (total_buffer_size + total_nulls_size_in_bytes) as u64);
 2621 |     }
 2622 | 
 2623 |     #[test]
 2624 |     fn variable_width_rejects_out_of_bounds_offsets_without_optional_validation() {
 2625 |         let block = VariableWidthBlock {
 2626 |             data: LanceBuffer::copy_slice(b"alphabetagamma"),
 2627 |             offsets: LanceBuffer::reinterpret_vec(vec![0_i32, 5, 9, 100_000]),
 2628 |             bits_per_offset: 32,
 2629 |             num_values: 3,
 2630 |             block_info: BlockInfo::new(),
 2631 |         };
 2632 | 
 2633 |         let error = block
 2634 |             .into_arrow(DataType::Binary, false)
 2635 |             .expect_err("out-of-bounds offsets must be rejected");
 2636 |         assert!(
 2637 |             matches!(error, Error::CorruptFile { .. }),
 2638 |             "expected CorruptFile, got: {error}"
 2639 |         );
 2640 |         let message = error.to_string();
 2641 |         assert!(
 2642 |             message.contains("100000") && message.contains("data buffer size: 14 bytes"),
 2643 |             "error must report the offending offset and the data buffer size: {message}"
 2644 |         );
 2645 |     }
 2646 | 
 2647 |     #[test]
 2648 |     fn public_fixed_width_conversion_always_validates_layout() {
 2649 |         let block = FixedWidthDataBlock {
 2650 |             data: LanceBuffer::from(vec![0_u8; 4]),
 2651 |             bits_per_value: 32,
 2652 |             num_values: 2,
 2653 |             block_info: BlockInfo::new(),
 2654 |         };
 2655 | 
 2656 |         for validate in [false, true] {
 2657 |             block
 2658 |                 .clone()
 2659 |                 .into_arrow(DataType::Int32, validate)
 2660 |                 .expect_err("a short values buffer must be rejected");
 2661 |             DataBlock::FixedWidth(block.clone())
 2662 |                 .into_arrow(DataType::Int32, validate)
 2663 |                 .expect_err("a short values buffer must be rejected");
 2664 |         }
 2665 |     }
 2666 | 
 2667 |     #[rstest]
 2668 |     #[case::i32_decreasing(
 2669 |         LanceBuffer::reinterpret_vec(vec![0_i32, 5, 2]),
 2670 |         32,
 2671 |         2,
 2672 |         "decreases"
 2673 |     )]
 2674 |     #[case::i64_decreasing(
 2675 |         LanceBuffer::reinterpret_vec(vec![0_i64, 5, 2]),
 2676 |         64,
 2677 |         2,
 2678 |         "decreases"
 2679 |     )]
 2680 |     #[case::i32_out_of_bounds(
 2681 |         LanceBuffer::reinterpret_vec(vec![0_i32, 6]),
 2682 |         32,
 2683 |         1,
 2684 |         "out of bounds"
 2685 |     )]
 2686 |     fn variable_width_builder_rejects_malformed_offsets(
 2687 |         #[case] offsets: LanceBuffer,
 2688 |         #[case] bits_per_offset: u8,
 2689 |         #[case] num_values: u64,
 2690 |         #[case] expected_message: &str,
 2691 |     ) {
 2692 |         let block = DataBlock::VariableWidth(VariableWidthBlock {
 2693 |             data: LanceBuffer::copy_slice(b"abcde"),
 2694 |             offsets,
 2695 |             bits_per_offset,
 2696 |             num_values,
 2697 |             block_info: BlockInfo::new(),
 2698 |         });
 2699 |         let mut builder = DataBlockBuilder::with_capacity_estimate(5);
 2700 | 
 2701 |         let error = builder
 2702 |             .append(&block, 0..num_values)
 2703 |             .expect_err("malformed offsets must fail concatenation");
 2704 |         assert!(
 2705 |             matches!(error, Error::CorruptFile { .. }),
 2706 |             "expected CorruptFile, got: {error}"
 2707 |         );
 2708 |         assert!(
 2709 |             error.to_string().contains(expected_message),
 2710 |             "unexpected message: {error}"
 2711 |         );
 2712 |     }
 2713 | 
 2714 |     #[rstest]
 2715 |     #[case::binary_i32_tail_out_of_bounds(
 2716 |         DataType::Binary,
 2717 |         LanceBuffer::reinterpret_vec(vec![0_i32, 5, 9, 100_000]),
 2718 |         32,
 2719 |         3,
 2720 |         b"alphabetagamma".as_slice()
 2721 |     )]
 2722 |     #[case::utf8_i32_tail_out_of_bounds(
 2723 |         DataType::Utf8,
 2724 |         LanceBuffer::reinterpret_vec(vec![0_i32, 5, 9, 100_000]),
 2725 |         32,
 2726 |         3,
 2727 |         b"alphabetagamma".as_slice()
 2728 |     )]
 2729 |     #[case::large_binary_i64_tail_out_of_bounds(
 2730 |         DataType::LargeBinary,
 2731 |         LanceBuffer::reinterpret_vec(vec![0_i64, 5, 9, 100_000]),
 2732 |         64,
 2733 |         3,
 2734 |         b"alphabetagamma".as_slice()
 2735 |     )]
 2736 |     #[case::large_utf8_i64_tail_out_of_bounds(
 2737 |         DataType::LargeUtf8,
 2738 |         LanceBuffer::reinterpret_vec(vec![0_i64, 5, 9, 100_000]),
 2739 |         64,
 2740 |         3,
 2741 |         b"alphabetagamma".as_slice()
 2742 |     )]
 2743 |     #[case::binary_negative_offset(
 2744 |         DataType::Binary,
 2745 |         LanceBuffer::reinterpret_vec(vec![0_i32, -1, 9, 14]),
 2746 |         32,
 2747 |         3,
 2748 |         b"alphabetagamma".as_slice()
 2749 |     )]
 2750 |     #[case::binary_non_monotonic_offsets(
 2751 |         DataType::Binary,
 2752 |         LanceBuffer::reinterpret_vec(vec![0_i32, 9, 5, 14]),
 2753 |         32,
 2754 |         3,
 2755 |         b"alphabetagamma".as_slice()
 2756 |     )]
 2757 |     #[case::binary_interior_offset_out_of_bounds(
 2758 |         DataType::Binary,
 2759 |         LanceBuffer::reinterpret_vec(vec![0_i32, 100_000, 100_000, 14]),
 2760 |         32,
 2761 |         3,
 2762 |         b"alphabetagamma".as_slice()
 2763 |     )]
 2764 |     #[case::binary_offsets_buffer_too_short(
 2765 |         DataType::Binary,
 2766 |         LanceBuffer::reinterpret_vec(vec![0_i32, 5, 9]),
 2767 |         32,
 2768 |         3,
 2769 |         b"alphabetagamma".as_slice()
 2770 |     )]
 2771 |     #[case::utf8_invalid_byte_sequence(
 2772 |         DataType::Utf8,
 2773 |         LanceBuffer::reinterpret_vec(vec![0_i32, 1, 2, 3]),
 2774 |         32,
 2775 |         3,
 2776 |         &[b'a', 0xFF, b'b']
 2777 |     )]
 2778 |     #[case::utf8_offset_splits_multibyte_char(
 2779 |         DataType::Utf8,
 2780 |         LanceBuffer::reinterpret_vec(vec![0_i32, 1, 2]),
 2781 |         32,
 2782 |         2,
 2783 |         "é".as_bytes()
 2784 |     )]
 2785 |     #[case::large_utf8_invalid_byte_sequence(
 2786 |         DataType::LargeUtf8,
 2787 |         LanceBuffer::reinterpret_vec(vec![0_i64, 1, 2, 3]),
 2788 |         64,
 2789 |         3,
 2790 |         &[b'a', 0xFF, b'b']
 2791 |     )]
 2792 |     fn variable_width_rejects_malformed_layout(
 2793 |         #[case] data_type: DataType,
 2794 |         #[case] offsets: LanceBuffer,
 2795 |         #[case] bits_per_offset: u8,
 2796 |         #[case] num_values: u64,
 2797 |         #[case] data: &[u8],
 2798 |     ) {
 2799 |         let block = VariableWidthBlock {
 2800 |             data: LanceBuffer::copy_slice(data),
 2801 |             offsets,
 2802 |             bits_per_offset,
 2803 |             num_values,
 2804 |             block_info: BlockInfo::new(),
 2805 |         };
 2806 | 
 2807 |         // The malformed layout must be rejected regardless of the optional
 2808 |         // `validate` flag: the flag selects extra validation, not the memory
 2809 |         // safety proof required to construct an Arrow array.
 2810 |         for validate in [false, true] {
 2811 |             let error = DataBlock::VariableWidth(block.clone())
 2812 |                 .into_arrow(data_type.clone(), validate)
 2813 |                 .expect_err("malformed variable-width layout must be rejected");
 2814 |             assert!(
 2815 |                 matches!(error, Error::CorruptFile { .. }),
 2816 |                 "expected CorruptFile with validate={validate}, got: {error}"
 2817 |             );
 2818 |         }
 2819 |     }
 2820 | 
 2821 |     #[test]
 2822 |     fn dictionary_rejects_malformed_variable_width_values_without_optional_validation() {
 2823 |         let values = VariableWidthBlock {
 2824 |             data: LanceBuffer::copy_slice(b"alphabetagamma"),
 2825 |             offsets: LanceBuffer::reinterpret_vec(vec![0_i32, 5, 9, 100_000]),
 2826 |             bits_per_offset: 32,
 2827 |             num_values: 3,
 2828 |             block_info: BlockInfo::new(),
 2829 |         };
 2830 |         let dictionary = DataBlock::Dictionary(DictionaryDataBlock {
 2831 |             indices: FixedWidthDataBlock {
 2832 |                 data: LanceBuffer::reinterpret_vec(vec![0_i32, 1, 2]),
 2833 |                 bits_per_value: 32,
 2834 |                 num_values: 3,
 2835 |                 block_info: BlockInfo::new(),
 2836 |             },
 2837 |             dictionary: Box::new(DataBlock::VariableWidth(values)),
 2838 |         });
 2839 | 
 2840 |         let data_type = DataType::Dictionary(Box::new(DataType::Int32), Box::new(DataType::Binary));
 2841 |         let error = dictionary
 2842 |             .into_arrow(data_type, false)
 2843 |             .expect_err("dictionary with out-of-bounds value offsets must be rejected");
 2844 |         assert!(
 2845 |             matches!(error, Error::CorruptFile { .. }),
 2846 |             "expected CorruptFile, got: {error}"
 2847 |         );
 2848 |     }
 2849 | 
 2850 |     #[test]
 2851 |     fn dictionary_rejects_indices_wider_than_declared_key_type() {
 2852 |         let dictionary = DataBlock::Dictionary(DictionaryDataBlock {
 2853 |             indices: FixedWidthDataBlock {
 2854 |                 data: LanceBuffer::reinterpret_vec(vec![0_u32, 1, 128]),
 2855 |                 bits_per_value: 32,
 2856 |                 num_values: 3,
 2857 |                 block_info: BlockInfo::new(),
 2858 |             },
 2859 |             dictionary: Box::new(DataBlock::from_array(StringArray::from(vec![
 2860 |                 Some("zero"),
 2861 |                 Some("one"),
 2862 |                 None,
 2863 |             ]))),
 2864 |         });
 2865 | 
 2866 |         let data_type = DataType::Dictionary(Box::new(DataType::Int8), Box::new(DataType::Utf8));
 2867 |         let error = dictionary
 2868 |             .into_arrow(data_type, false)
 2869 |             .expect_err("mismatched dictionary index widths must be rejected");
 2870 | 
 2871 |         assert!(matches!(error, Error::CorruptFile { .. }));
 2872 |         assert!(
 2873 |             error.to_string().contains(
 2874 |                 "dictionary indices use 32 bits but the declared Int8 key type uses 8 bits"
 2875 |             )
 2876 |         );
 2877 |     }
 2878 | 
 2879 |     #[rstest]
 2880 |     #[case::binary(Arc::new(BinaryArray::from_vec(vec![b"alpha", b"", b"gamma"])) as ArrayRef)]
 2881 |     #[case::large_binary(
 2882 |         Arc::new(LargeBinaryArray::from_vec(vec![b"alpha", b"", b"gamma"])) as ArrayRef
 2883 |     )]
 2884 |     #[case::utf8(Arc::new(StringArray::from(vec!["héllo", "", "world"])) as ArrayRef)]
 2885 |     #[case::large_utf8(Arc::new(LargeStringArray::from(vec!["héllo", "", "world"])) as ArrayRef)]
 2886 |     fn variable_width_valid_data_survives_mandatory_validation(#[case] array: ArrayRef) {
 2887 |         let block = DataBlock::from_array(array.clone());
 2888 |         for validate in [false, true] {
 2889 |             let round_tripped = make_array(
 2890 |                 block
 2891 |                     .clone()
 2892 |                     .into_arrow(array.data_type().clone(), validate)
 2893 |                     .unwrap(),
 2894 |             );
 2895 |             assert_eq!(&round_tripped, &array);
 2896 |         }
 2897 |     }
 2898 | }
``````
