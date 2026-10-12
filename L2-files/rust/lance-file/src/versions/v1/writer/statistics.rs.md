> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../../V21-PROTOCOL.md). Refresh 2026-10-04: [current-source addendum](../../../../../../../refresh-addenda/2026-10-04-ad12ed9e.md) for `ad12ed9e15e0046688b00568d0ac1a347fb2d328`.

# rust/lance-file/src/versions/v1/writer/statistics.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `91c40eca4beba4f6752e0f8506a9190e35a5702a085022439552c39f279c6c80`. Reviewed physical lines: 1-2249.

[Module](../../../../../../../L1-modules/rust-lance-file-v1-statistics.md) · [Symbols](../../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../../README.md)

## Role and visibility

Frozen V1 synchronous statistics reducers, 64-byte prefix and successor algorithms, collector/builder lifecycle, and fourteen deterministic/property test entry points. Pub declarations are inside a private module; automatic writer eligibility is narrower than low-level dispatch. (rust/lance-file/src/versions/v1/writer/statistics.rs:1-2249)

## Complete range analysis

### Lines 1-32

SPDX and module purpose, followed by synchronous Arrow array/builders/casts, primitive type markers, Arrow schema/errors, DataFusion ScalarValue, Lance Field/Schema/Result and numeric traits. BTreeMap gives deterministic field-ID order; Arc owns output arrays. This file has no IO, async work, locks, unsafe blocks, environment/configuration lookup or format-version negotiation. Its pub items live behind the private writer::statistics module (rust/lance-file/src/versions/v1/writer/mod.rs:4-4), so they are not a separately re-exported public crate API. (rust/lance-file/src/versions/v1/writer/statistics.rs:1-32)

### Lines 33-46

Private BINARY_PREFIX_LENGTH=64 is a byte limit, not a Unicode-character count. StatisticsRow derives Debug/PartialEq and exposes crate-visible null_count:i64 and min_value/max_value:ScalarValue. A row represents all arrays supplied to one collection, not necessarily one Arrow batch. Bound absence is represented in typed ScalarValue options and differs by algorithm. (rust/lance-file/src/versions/v1/writer/statistics.rs:33-46)

### Lines 47-82

compute_primitive_statistics<T:ArrowNumericType> requires Native:Bounded+PartialOrd, starts min at native maximum and max at native minimum, casts every array to T, sums physical null counts as i64, skips arrays whose entire length is null (including empty arrays), then compares only Some values. all_values_null becomes false upon any non-all-null array. If no valid value exists, return full native [MIN,MAX] and accumulated null count, not null bounds. No checked null-count conversion/sum, mixed-type validation or data concatenation occurs. (rust/lance-file/src/versions/v1/writer/statistics.rs:47-82)

### Lines 83-100

get_statistics<T> debug-asserts nonempty outer input, calls primitive reduction, and constructs nonnull primitive ScalarValues using arrays[0].data_type(), unwrapping both conversions. Using the actual first DataType preserves temporal parameters such as timezone rather than generic T::DATA_TYPE. Later arrays are downcast but no cross-array parameter equality check occurs locally. Empty outer input can panic at first-array indexing even without debug assertions. (rust/lance-file/src/versions/v1/writer/statistics.rs:83-100)

### Lines 101-137

compute_float_statistics<T> initializes [+infinity,-infinity], sums physical null counts before skipping all-null/empty arrays, and changes bounds only for strict partial_cmp Greater/Less. NaN comparisons produce no update, but NaNs do not increment null_count. If both sentinels remain unchanged, replace them with [-infinity,+infinity], covering empty, all-null and all-NaN input. Actual single positive or negative infinity updates the opposite bound, preserving a constant-infinity interval. (rust/lance-file/src/versions/v1/writer/statistics.rs:101-137)

### Lines 138-162

get_float_statistics uses the float reducer, normalizes any minimum equal to zero to negative zero and any maximum equal to negative zero to positive zero; floating equality covers both zero signs. Converts the resulting native numbers through ScalarValue::from; returns nonnull bounds even for no ordered value. No total-order NaN comparison or timezone/type parameter is involved for Float32/64. (rust/lance-file/src/versions/v1/writer/statistics.rs:138-162)

### Lines 163-175

get_decimal_statistics reuses Decimal128 native i128 reduction, then reads precision and scale from the first array and wraps both values without precision validation here. No Decimal256 branch exists. Empty/all-null Decimal128 therefore uses native i128 extrema rather than decimal-precision-limited extrema; downstream scalar/Arrow conversion may impose separate constraints, not checked by this reducer. (rust/lance-file/src/versions/v1/writer/statistics.rs:163-175)

### Lines 176-192

truncate_utf8 asserts data.len()>=length, walks char_indices backward over the original entire string, and returns the longest NONEMPTY valid prefix whose ending byte offset is <=length. It returns None when no full character fits, including length0; it never manufactures Some(empty). The comment says less than length, but actual condition permits equality. Backward traversal may scan the long suffix; the 64-byte comparison limit does not make truncation constant-time in input length. Caller invokes it only for strings longer than64, where at least one Unicode scalar fits. (rust/lance-file/src/versions/v1/writer/statistics.rs:176-192)

### Lines 193-215

increment_utf8 owns bytes and tries indices right-to-left. For each index it repeatedly increments that byte up to overflow, validating the entire candidate with str::from_utf8 after each attempt; first valid candidate is returned. On exhausting a byte it restores its original value before trying the previous position. Unlike binary carry it does not zero the suffix, change byte length, or construct the next Unicode scalar across multiple changed bytes. A lexically greater same-length valid candidate is conservative; None means this algorithm found none, not a proof that no Unicode upper bound of another form exists. Empty input also returns None. (rust/lance-file/src/versions/v1/writer/statistics.rs:193-215)

### Lines 216-240

truncate_binary asserts input length>=requested length and always returns Some(exact prefix of that length), including zero; there is no all-maximal-byte special case despite the adjacent comment. increment performs big-endian-style carry from the last byte: overflow writes0 and continues left, first nonoverflow returns the same-length vector. All0xFF or empty input returns None. Both less-than comments are imprecise: a prefix may equal the stated length. (rust/lance-file/src/versions/v1/writer/statistics.rs:216-240)

### Lines 241-280

get_string_statistics<T:OffsetSizeTrait> casts each array to the chosen UTF8 offset width, accumulates null counts and skips all-null/empty arrays. Each nonnull string longer than64 bytes is truncated at a UTF8 boundary and sets one global bounds_truncated flag. Min/max compare these prefixes lexically with strict comparisons, keeping borrowed references until final ownership conversion. Any truncated value sets the flag even if it never supplies the maximum; short values and empty strings remain eligible. (rust/lance-file/src/versions/v1/writer/statistics.rs:241-280)

### Lines 281-315

If any string was truncated and a maximum exists, increment_utf8 of the chosen maximum prefix provides the output upper bound; failure turns max into typed None. This also increments a short maximum when a different, smaller value was truncated. Min stays a lower prefix. Borrowed bounds become owned strings; first DataType selects Utf8 versus LargeUtf8, otherwise unreachable. All-null/empty string arrays yield both bounds None, with actual null_count. No truncation means an exact observed maximum, including length exactly64. (rust/lance-file/src/versions/v1/writer/statistics.rs:281-315)

### Lines 316-357

get_binary_statistics<T> mirrors string reduction using generic binary casts and raw byte lexicographic ordering. It truncates each value longer than64 to exactly64 bytes, sets a global truncation flag, and compares borrowed slices. Accumulates null counts for every array before skipping all-null/empty arrays. Input consistency is assumed rather than validated. (rust/lance-file/src/versions/v1/writer/statistics.rs:316-357)

### Lines 358-388

Binary minimum is cloned; maximum is cloned unchanged if no value was truncated, otherwise increment carries through its bytes and can yield None for an all0xFF prefix. The global flag can widen a maximum not itself truncated. First DataType selects Binary or LargeBinary ScalarValue, unmatched type unreachable. Empty/all-null inputs have both typed None; exact64-byte all0xFF remains a present exact maximum when no other value triggers truncation. (rust/lance-file/src/versions/v1/writer/statistics.rs:358-388)

### Lines 389-431

get_fixed_size_binary_statistics obtains declared width from the first array, sets do_truncate if width>64, then scans nonnull values with lexical byte comparison, truncating each to64 if enabled. Accumulates physical null counts, skips all-null arrays, and assumes common width/type across arrays. Width<=64 compares full values. This helper is callable by the dispatcher but excluded from automatic collector eligibility. (rust/lance-file/src/versions/v1/writer/statistics.rs:389-431)

### Lines 432-452

Fixed-binary outputs clone the lower prefix and optionally increment the upper prefix on width>64; all-maximal prefix yields None. BOTH ScalarValue::FixedSizeBinary constructors retain the original width, even when present payload has only64 bytes or max is absent. This is a descriptive bound representation, not evidence that those truncated scalar bytes can be appended as valid fixed-width Arrow values. The builder has no fixed-binary append arm (rust/lance-file/src/versions/v1/writer/statistics.rs:918-928). (rust/lance-file/src/versions/v1/writer/statistics.rs:432-452)

### Lines 453-483

get_boolean_statistics tracks presence of true/false and sums each array null count before an early continue. Once both values have appeared, later arrays need not be scanned for values but still contribute nulls. Within the current array the for_each does not break early. Bounds are Some(true_present&&!false_present) and Some(true_present||!false_present): onlytrue gives true/true, onlyfalse false/false, mixed false/true, no valid values false/true. (rust/lance-file/src/versions/v1/writer/statistics.rs:453-483)

### Lines 484-492

cast_dictionary_arrays<T> downcasts every dictionary and collects borrowed Arc references to each complete VALUES array into a new Vec. It does not follow keys, deduplicate shared dictionaries, slice values to referenced entries or include key null counts. The returned lifetime is tied to input references. (rust/lance-file/src/versions/v1/writer/statistics.rs:484-492)

### Lines 493-514

get_dictionary_statistics inspects the first Dictionary key type and dispatches Int8/16/32/64 or UInt8/16/32/64 to value extraction, then recursively collect_statistics on those full values arrays. Returned bound scalar type is the dictionary VALUE type. Null count is the sum of values-array null counts, possibly repeatedly counting the same shared dictionary; it is not decoded-row/key null count. Unused dictionary entries affect bounds. Unsupported key type panics naming key type, non-Dictionary call panics naming actual type. This helper remains outside automatic collector selection. (rust/lance-file/src/versions/v1/writer/statistics.rs:493-514)

### Lines 515-549

get_temporal_statistics maps Time32 Second/Millisecond, Time64 Microsecond/Nanosecond, Date32/64, all four Timestamp units and all four Duration units to corresponding primitive marker. Timestamp timezone propagates via get_statistics first-array DataType; values are not timezone converted. Other unit/type combinations are unreachable. Native integer extrema supply empty/all-null bounds; temporal domain limits are not validated here. (rust/lance-file/src/versions/v1/writer/statistics.rs:515-549)

### Lines 550-585

collect_statistics is pub within the private module and panics with No arrays to collect statistics from on an empty outer slice. It dispatches Boolean, eight integers, Float32/64, temporal families, Decimal128, both binary/string offset widths, FixedSizeBinary and Dictionary based only on the first DataType. Null, Float16, Decimal256, views, structs, lists and other unsupported types reach unreachable; Decimal256 TODO and commented list arms are not support. Returns a row, not Result, and performs no common-type/parameter preflight. (rust/lance-file/src/versions/v1/writer/statistics.rs:550-585)

### Lines 586-610

supports_stats_collection is deliberately narrower than collect_statistics: Boolean, eight integers, Float32/64, Date32/64, Utf8/LargeUtf8, Binary/LargeBinary and Decimal128 only. Excludes Time32/64, Timestamp, Duration, Dictionary and FixedSizeBinary despite reducer support; excludes all other unmatched types. FixedSizeBinary is commented out. Do not infer that a dispatcher arm enables on-disk writer statistics. (rust/lance-file/src/versions/v1/writer/statistics.rs:586-610)

### Lines 611-634

StatisticsCollector derives Debug and owns private BTreeMap<i32,(Field,StatisticsBuilder)>. try_new traverses only roots and struct descendants, filters eligible types, clones each Field and creates a builder. BTreeMap keys are original field IDs, so output sorts by numeric ID; duplicate IDs overwrite an earlier entry during collection rather than error. Empty eligible set returns None. get_builder returns a mutable builder or None for absent ID, without allocation or validation. (rust/lance-file/src/versions/v1/writer/statistics.rs:611-634)

### Lines 635-660

Collector finish drains each null-count/min/max Arrow builder in ascending ID order, builds Struct children named null_count:Int64 nonnullable and min_value/max_value:original dtype nullable, then a nonnullable root named decimal original field ID. Bounds remain nullable even for a nonnullable data field; null_count builder is appended with nonnull values, and its cloned null buffer supplies root validity. Original Field name/metadata/nullability are not copied to roots. Individual StructArray::new invariants are enforced by Arrow and can panic before the later Result check. (rust/lance-file/src/versions/v1/writer/statistics.rs:635-660)

### Lines 661-672

Construct RecordBatch using the generated schema/arrays. Any RecordBatch::try_new error is replaced with ArrowError::SchemaError(all columns in a record batch must have the same length), converted to Lance error; original detail is discarded. Builders have already been finished/reset even when this returns Err. No rollback or recovery from prior accumulated rows; caller may collect new rows but cannot retry the old contents. No closed flag prohibits subsequent finish calls. (rust/lance-file/src/versions/v1/writer/statistics.rs:661-672)

### Lines 673-687

visit_fields creates reversed root stack, pops in schema order, and pushes reversed children ONLY for Struct. It emits the struct node as well as descendants; eligibility later removes structs. Lists, fixed-size lists, dictionaries and other nested types are emitted without descending. This differs from writer fields_in_batches, which emits scalar leaves in reverse root/child traversal order (rust/lance-file/src/versions/v1/writer/mod.rs:654-692). (rust/lance-file/src/versions/v1/writer/statistics.rs:673-687)

### Lines 688-703

StatisticsBuilder owns an Int64 null-count primitive builder, type-erased boxed min/max ArrayBuilders, and cloned DataType. Custom Debug prints only null_count and dt, omitting bound builders. All fields and the constructor are private; append is pub inside private module. There is no synchronization, capacity budget or per-row validation state. (rust/lance-file/src/versions/v1/writer/statistics.rs:688-703)

### Lines 704-717

new makes a fresh null-count builder and two make_builder(data_type,1) bound builders, retains cloned dtype and returns Self. The1 is initial capacity, not a hard row limit. Arrow make_builder/type support is delegated; collector only calls this for its eligible types. (rust/lance-file/src/versions/v1/writer/statistics.rs:704-717)

### Lines 718-762

string_statistics_appender<T> downcasts both bound builders and unwraps before mutation. Appends the supplied i64 null_count with no sign/range check. Utf8 or LargeUtf8 Some values matching self.dt append normally; None OR a mismatched ScalarValue variant appends a null bound instead of an error. Unexpected self.dt is unreachable. Offset-width mismatch panics at downcast. (rust/lance-file/src/versions/v1/writer/statistics.rs:718-762)

### Lines 763-807

binary_statistics_appender<T> has equivalent behavior for Binary/LargeBinary: checked-by-unwrap builder downcasts, unchecked signed null_count append, matching Some bytes appended and any other ScalarValue mapped to null. It neither truncates nor recomputes statistics; caller supplies row semantics. Unexpected dtype unreachable. (rust/lance-file/src/versions/v1/writer/statistics.rs:763-807)

### Lines 808-841

statistics_appender<T> downcasts both primitive builders, converts each ScalarValue to a one-element array, unwraps conversion/downcast, and reads raw value(0) without checking validity. Only after both values are obtained does it append count and nonnull min/max. A typed null scalar is not propagated as a null bound; its underlying value is read. Type mismatch or conversion error panics. Scalar type parameters are not independently compared with self.dt. (rust/lance-file/src/versions/v1/writer/statistics.rs:808-841)

### Lines 842-868

boolean_appender downcasts both Boolean builders, appends count, then matching Some Boolean bounds; absent or wrong-variant minimum becomes false and maximum becomes true. It never emits a null Boolean bound. This fallback differs from string/binary null insertion and primitive raw value extraction. (rust/lance-file/src/versions/v1/writer/statistics.rs:842-868)

### Lines 869-918

append matches stored dt, routing Boolean, eight integers, Float32/64, Date32/64, supported Time32/64 units, all four Timestamp and Duration units and Decimal128 to the corresponding appender. Temporal branches exist even though automatic collector filters them out. No row type/count validation or error-return channel precedes dispatch. (rust/lance-file/src/versions/v1/writer/statistics.rs:869-918)

### Lines 919-931

Append handles Binary/LargeBinary and Utf8/LargeUtf8 with correct offset marker. Decimal256 remains TODO, Dictionary has a comment that stats concern values but no dictionary branch, and FixedSizeBinary also has no branch. Everything else executes todo!(Stats collection for {} is not supported yet). End of builder impl; no persisted format is directly emitted here. (rust/lance-file/src/versions/v1/writer/statistics.rs:919-931)

### Lines 932-959

Test-only module imports concrete Arrow arrays/builders, Datum/scalar conversion, interleave, proptest and schema aliases. test_no_arrays explicitly expects panic containing No arrays to collect statistics from for an empty Vec of arrays. Tests are source-read only, not executed in this goal. (rust/lance-file/src/versions/v1/writer/statistics.rs:932-959)

### Lines 960-996

test_edge_cases begins with one empty UInt32 array, requiring count0 and [u32::MIN,u32::MAX]. One empty Utf8 and one empty LargeUtf8 array each require count0 with correctly typed None/None bounds. These are nonempty outer slices, distinct from the previous panic test. (rust/lance-file/src/versions/v1/writer/statistics.rs:960-996)

### Lines 997-1032

Remaining empty cases require typed None/None for Binary and LargeBinary and Some(false)/Some(true) for Boolean, all null_count0. No fixed-binary/decimal/all-null assertion appears in this edge-case test. (rust/lance-file/src/versions/v1/writer/statistics.rs:997-1032)

### Lines 1033-1122

test_collect_primitive_stats private TestCase stores source arrays, expected min/max and expected i64 count. First8 of24 cases test Int8/16/32/64 using [4,3,7,2] plus [-10,3,5] ->[-10,7], and UInt8/16/32/64 using [4,3,7,2] plus [10,3,5] ->[2,10]. Every expected count is0, with exact matching scalar width. (rust/lance-file/src/versions/v1/writer/statistics.rs:1033-1122)

### Lines 1123-1185

Primitive cases9-15 cover Boolean [true,false] ->[false,true]; Date32/Date64 and Time32 Second/Millisecond, Time64 Microsecond/Nanosecond each use [53,42] plus [68,32] ->[32,68] with the corresponding scalar variant and count0. No temporal range validation or null entries are tested. (rust/lance-file/src/versions/v1/writer/statistics.rs:1123-1185)

### Lines 1186-1246

Four Timestamp cases use each unit Second/Millisecond/Microsecond/Nanosecond on [53,42] plus [68,32], explicitly attach UTC to both arrays, and expect same-unit UTC ScalarValues32/68 with count0. They check metadata propagation, not timezone conversion or mismatched zones. (rust/lance-file/src/versions/v1/writer/statistics.rs:1186-1246)

### Lines 1247-1294

Final primitive cases cover four Duration units with the same32/68 bounds/count0; Decimal128 arrays are constructed from [53,42] and [68,32] and expected scalars are explicitly try_new_decimal128(32 or68,38,10). No explicit with_precision_and_scale is applied to source arrays here; dependency defaults/equality are not independently validated by this source-reading task. (rust/lance-file/src/versions/v1/writer/statistics.rs:1247-1294)

### Lines 1295-1311

Iterate all24 cases, borrow each ArrayRef, collect and compare complete StatisticsRow with expected bounds/count, including input arrays in assertion failure text. No collector builder or file serialization is involved. (rust/lance-file/src/versions/v1/writer/statistics.rs:1295-1311)

### Lines 1312-1378

test_collect_float_stats checks Float32 [4,3,NaN,2] plus [-10,3,5,NaN] ->[-10,5], count0; Float64 [4,-infinity,+infinity] ->full infinite bounds,count0; Float32[-0,+0] expected negative-zero minimum/positive-zero maximum via ScalarValue equality; three Float64 NaNs ->[-infinity,+infinity],count0. It does not separately compare zero sign bits or test mixed null/NaN here. (rust/lance-file/src/versions/v1/writer/statistics.rs:1312-1378)

### Lines 1379-1440

test_collect_binary_stats declares filler literal 48 chars of filler followed by30 spaces (actual byte length48), a64-byte0xFF vector and private TestCase(source_arrays,stats);13cases follow. Utf8 foo/null/bar plus yee/haw ->bar/yee,count1. Filler+bacteriologists+scientist emoji and filler+terrestial planet ->filler+bacteriologists lower prefix and filler+terrestial planf upper successor,count0. Exact64-byte filler+terrestial planf keeps identical bounds. Source misspells terrestrial and Sting; retain literal fixture strings. (rust/lance-file/src/versions/v1/writer/statistics.rs:1379-1440)

### Lines 1441-1490

Three LargeUtf8 cases repeat the short/null, multibyte-truncation/successor and exact64-byte fixtures with LargeUtf8 scalar variants and identical expected counts/bounds. The maximal original filler+terrestial planet is65 bytes, truncated to filler+terrestial plane before its last byte increments to produce the64-byte upper bound ending planf. (rust/lance-file/src/versions/v1/writer/statistics.rs:1441-1490)

### Lines 1491-1541

Binary and LargeBinary each test one69-byte all0xFF value ->64-byte all0xFF minimum and None maximum, count0, and one64-byte all0xFF value ->both exact present64-byte bounds,count0. These deterministic cases cover0xFF overflow omitted by later property generator. The adjacent comment wording is confusing; the literal fixtures/assertions define expected behavior. (rust/lance-file/src/versions/v1/writer/statistics.rs:1491-1541)

### Lines 1542-1591

FixedSizeBinary cases: width2 values[0,1],[2,3],[4,5],[6,7],[8,9] ->[0,1]/[8,9]; width64 all0xFF ->same present64-byte bounds; width71 all0xFF ->expected minimum tagged71 carrying64bytes, but expected absent maximum tagged64. Production constructs BOTH bounds tagged original width71 (rust/lance-file/src/versions/v1/writer/statistics.rs:446-450). Record the literal tag discrepancy without claiming test failure: ScalarValue equality implementation and test execution were not checked. All expected counts0. (rust/lance-file/src/versions/v1/writer/statistics.rs:1542-1591)

### Lines 1592-1602

Loop through13 binary/string/fixed-binary cases and assert complete collected StatisticsRow equals fixture stats, with input arrays in failure message. This does not append fixed-binary bounds through StatisticsBuilder or serialize/reopen them. (rust/lance-file/src/versions/v1/writer/statistics.rs:1592-1602)

### Lines 1603-1627

test_collect_dictionary_stats initializes Int32 StringDictionaryBuilder from values[null,abc,def], appends def, null key, abc, and expects count1/boundsabc..def from complete values. Dictionary-value null count happens to equal key-null count in this fixture; that coincidence does not prove decoded-row semantics. (rust/lance-file/src/versions/v1/writer/statistics.rs:1603-1627)

### Lines 1628-1646

Second dictionary fixture shares values[A,C,G,T] across UInt32 keys[1,0,2,1] and[0,1,3,0], expects count0/A..T. Both full values arrays are scanned; one array never references T and the other never references G. Across combined rows both extrema are referenced, so this assertion does not isolate unused-entry or repeated-null counting. (rust/lance-file/src/versions/v1/writer/statistics.rs:1628-1646)

### Lines 1647-1678

test_stats_collector builds nullable a:Int32,b:Utf8 schema. Append two rows to a only: count2 bounds1..3 then count0 boundsi32MIN..MAX. finish is asserted is_err because b has zero rows; no error variant/message check. Comment correctly warns finished builders lost prior rows; test constructs a new collector instead of retrying old contents. (rust/lance-file/src/versions/v1/writer/statistics.rs:1647-1678)

### Lines 1679-1732

Recreated collector appends same two a rows, then b count6 aaa..bbb and count0 typed None/None. Successful finish must have roots named0/1 in ID order, each nonnullable Struct with nonnullable Int64 null_count and nullable correctly typed bounds. Exact schema equality asserted; original names a/b are absent. (rust/lance-file/src/versions/v1/writer/statistics.rs:1679-1732)

### Lines 1733-1769

Build complete expected two-row batch: root0 null counts[2,0],min[1,i32MIN],max[3,i32MAX]; root1 counts[6,0],min[aaa,null],max[bbb,null]. All structs are valid and both Arrow root/bound types match expected schema. Assert full RecordBatch equality, not just schema or min/max extrema. (rust/lance-file/src/versions/v1/writer/statistics.rs:1733-1769)

### Lines 1770-1818

Second collector fixture uses Boolean,Binary,LargeBinary,Utf8,LargeUtf8 roots with IDs0..4. Appends one row each,count0; Boolean boundsfalse/true and all four string/binary variants typed None/None. These rows are manually supplied, not derived from input arrays. (rust/lance-file/src/versions/v1/writer/statistics.rs:1770-1818)

### Lines 1819-1866

Expected five-root schema spells decimal names0..4 with nonnullable Struct/null_count and nullable min/max in Boolean,Binary,LargeBinary,Utf8,LargeUtf8 respectively. The schema declaration verifies type and nullability preservation, not automatic eligibility of other types. (rust/lance-file/src/versions/v1/writer/statistics.rs:1819-1866)

### Lines 1867-1912

Expected one-row batch starts roots0..2: each count[0]; Boolean min[false]/max[true], Binary and LargeBinary both single null bounds. Uses separate StructArrays and Arc child fields. No root nulls are introduced. (rust/lance-file/src/versions/v1/writer/statistics.rs:1867-1912)

### Lines 1913-1949

Expected roots3/4 use cloned one-element None string vector in StringArray and LargeStringArray; counts[0]. finish actual collector and assert both schema equality and entire batch equality. End of deterministic collector test; it does not test duplicate IDs, empty eligible schema, parent validity or post-finish retry. (rust/lance-file/src/versions/v1/writer/statistics.rs:1913-1949)

### Lines 1950-1982

assert_min_max_constant_property converts ScalarValue to scalar array, optionally interleaves one null BEFORE the value, calls collect on the resulting array, and asserts count1/0 and exact original value as both bounds. Comments exclude NaN/null and strings/binary>64; helper does not filter those itself. Returns TestCaseError through prop_assert_eq, unwraps Arrow construction. (rust/lance-file/src/versions/v1/writer/statistics.rs:1950-1982)

### Lines 1983-2012

test_min_max_constant_property applies helper with/without null to19 supplied values: true,false;1 in each of8integer types; Float32/64 each1,+infinity,-infinity; Utf8 foo; Utf8 a repeated64; Binary zero repeated64. No float signed-zero, long-string, large-offset, decimal or fixed-binary case in this list. (rust/lance-file/src/versions/v1/writer/statistics.rs:1983-2012)

### Lines 2013-2037

Timestamp proptest chooses timezone index0..3 and timeunit index0..4, maps value42 to each Timestamp unit with None,UTC,America/New_York timezone, and invokes constant helper with/without null. This samples combinations using proptest; no fixed exhaustive enumeration or runtime result is claimed. (rust/lance-file/src/versions/v1/writer/statistics.rs:2013-2037)

### Lines 2038-2068

assert_min_max_ordering_float<F> builds8candidate native values: negative/positive infinity,positive/negative zero,one,NaN,native min/max. Default TestRunner samples subsequence with size range(0,all_options); converts each sampled subset to nonnull PrimitiveArray and pairs subset with computed row. No arbitrary finite-number generation or explicit null array here. (rust/lance-file/src/versions/v1/writer/statistics.rs:2038-2068)

### Lines 2069-2099

Float property asserts every non-NaN sampled value >=minimum and <=maximum using ScalarValue::new_primitive; NaNs are explicitly exempt. Empty subset additionally requires negative/positive infinite bounds. Returns runner error via? and otherwiseOk. Null-count correctness is not asserted by this property. (rust/lance-file/src/versions/v1/writer/statistics.rs:2069-2099)

### Lines 2100-2105

test_min_max_ordering_float invokes the generic helper for Float32Type then Float64Type and unwraps both results. This is one test entry point with two primitive widths. (rust/lance-file/src/versions/v1/writer/statistics.rs:2100-2105)

### Lines 2106-2137

String proptest uses vec(regex .{0, 100},0..10), creates Utf8 array, requires None bounds if empty, lower bound<=all values, upper bound either null or>=all values, and each present bound byte length<=64. Wrong scalar variant unreachable. Comment says less than64 while assertions allow equality. Generated array has no null entries; generator string and ranges are preserved exactly rather than treating this as an exhaustive Unicode proof. (rust/lance-file/src/versions/v1/writer/statistics.rs:2106-2137)

### Lines 2138-2169

Binary proptest nests vec(0..u8::MAX,0..100) inside vec(...,0..10). Byte generation is half-open and excludes0xFF; lengths likewise use half-open ranges. Asserts empty typed None bounds, lower<=each value, upper null or>=each, and present byte lengths<=64. Does not assert null_count or generate null entries. Deterministic all0xFF cases provide separate overflow evidence. (rust/lance-file/src/versions/v1/writer/statistics.rs:2138-2169)

### Lines 2170-2207

Fixed-binary proptest generates byte vectors of exactly100 using0..u8::MAX and outer0..10; empty input uses new_empty_array(FixedSizeBinary100) because the normal constructor cannot infer width. Checks empty typed width100 None bounds, lexical inequalities against width100 original values, and present bound payload<=64bytes while retaining tag100. No builder append/Arrow scalar materialization of those shortened payloads is tested. (rust/lance-file/src/versions/v1/writer/statistics.rs:2170-2207)

### Lines 2208-2249

test_boolean_statistics_multi_array builds [true,false,true,null,null] and [false,true,false,null,null], asserts individual null counts2 each, then combined count4 and minfalse/maxtrue. Specifically protects summing later-array nulls after both Boolean values have already been found; early continue happens after null accumulation. No per-array bound assertion appears. End of tests and file. (rust/lance-file/src/versions/v1/writer/statistics.rs:2208-2249)

## Interaction and interpretation limits

Every physical line1-2249 read in eight complete bounded source outputs during ANALYZE64. Tests and external ScalarValue/Arrow implementations were not executed or fetched. Literal fixed-binary width disagreement and decimal fixture parameter assumptions are documented without claiming runtime failures. No source changes, internet, builds, tests, lint, benchmarks, installs or fixture generators. Preserve frozen legacy behavior; modern statistics/encoding and full Dataset/backend flows remain separately pending (AGENTS.md:13-18).

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Statistics collection utilities
    5 | 
    6 | use std::cmp::Ordering;
    7 | use std::collections::BTreeMap;
    8 | use std::sync::Arc;
    9 | 
   10 | use arrow_array::{
   11 |     Array, ArrayRef, ArrowNumericType, ArrowPrimitiveType, OffsetSizeTrait, PrimitiveArray,
   12 |     RecordBatch, StructArray,
   13 |     builder::{ArrayBuilder, BooleanBuilder, PrimitiveBuilder, make_builder},
   14 |     builder::{GenericBinaryBuilder, GenericStringBuilder},
   15 |     cast::{AsArray, as_generic_binary_array, as_primitive_array},
   16 |     types::{
   17 |         ArrowDictionaryKeyType, Date32Type, Date64Type, Decimal128Type, DurationMicrosecondType,
   18 |         DurationMillisecondType, DurationNanosecondType, DurationSecondType, Float32Type,
   19 |         Float64Type, Int8Type, Int16Type, Int32Type, Int64Type, Time32MillisecondType,
   20 |         Time32SecondType, Time64MicrosecondType, Time64NanosecondType, TimestampMicrosecondType,
   21 |         TimestampMillisecondType, TimestampNanosecondType, TimestampSecondType, UInt8Type,
   22 |         UInt16Type, UInt32Type, UInt64Type,
   23 |     },
   24 | };
   25 | use arrow_schema::{ArrowError, DataType, Field as ArrowField, Schema as ArrowSchema, TimeUnit};
   26 | use datafusion_common::ScalarValue;
   27 | use lance_arrow::{DataTypeExt, as_fixed_size_binary_array};
   28 | use lance_core::Result;
   29 | use lance_core::datatypes::{Field, Schema};
   30 | use num_traits::{Float, Zero, bounds::Bounded};
   31 | use std::str;
   32 | 
   33 | /// Max number of bytes that are included in statistics for binary columns.
   34 | const BINARY_PREFIX_LENGTH: usize = 64;
   35 | 
   36 | /// Statistics for a single column chunk.
   37 | #[derive(Debug, PartialEq)]
   38 | pub struct StatisticsRow {
   39 |     /// Number of nulls in this column chunk.
   40 |     pub(crate) null_count: i64,
   41 |     /// Minimum value in this column chunk, if any
   42 |     pub(crate) min_value: ScalarValue,
   43 |     /// Maximum value in this column chunk, if any
   44 |     pub(crate) max_value: ScalarValue,
   45 | }
   46 | 
   47 | fn compute_primitive_statistics<T: ArrowNumericType>(
   48 |     arrays: &[&ArrayRef],
   49 | ) -> (T::Native, T::Native, i64)
   50 | where
   51 |     T::Native: Bounded + PartialOrd,
   52 | {
   53 |     let mut min_value = T::Native::max_value();
   54 |     let mut max_value = T::Native::min_value();
   55 |     let mut null_count: i64 = 0;
   56 |     let mut all_values_null = true;
   57 |     let arrays_iterator = arrays.iter().map(|x| as_primitive_array::<T>(x));
   58 | 
   59 |     for array in arrays_iterator {
   60 |         null_count += array.null_count() as i64;
   61 |         if array.null_count() == array.len() {
   62 |             continue;
   63 |         }
   64 |         all_values_null = false;
   65 | 
   66 |         array.iter().for_each(|value| {
   67 |             if let Some(value) = value {
   68 |                 if let Some(Ordering::Greater) = value.partial_cmp(&max_value) {
   69 |                     max_value = value;
   70 |                 }
   71 |                 if let Some(Ordering::Less) = value.partial_cmp(&min_value) {
   72 |                     min_value = value;
   73 |                 }
   74 |             };
   75 |         });
   76 |     }
   77 | 
   78 |     if all_values_null {
   79 |         return (T::Native::min_value(), T::Native::max_value(), null_count);
   80 |     }
   81 |     (min_value, max_value, null_count)
   82 | }
   83 | 
   84 | fn get_statistics<T: ArrowNumericType>(arrays: &[&ArrayRef]) -> StatisticsRow
   85 | where
   86 |     T::Native: Bounded,
   87 |     datafusion_common::scalar::ScalarValue: From<<T as ArrowPrimitiveType>::Native>,
   88 | {
   89 |     debug_assert!(!arrays.is_empty());
   90 |     // Note: we take data_type off of arrays instead of using T::DATA_TYPE because
   91 |     // there might be parameters like timezone for temporal types that need to
   92 |     // be propagated.
   93 |     let (min_value, max_value, null_count) = compute_primitive_statistics::<T>(arrays);
   94 |     StatisticsRow {
   95 |         null_count,
   96 |         min_value: ScalarValue::new_primitive::<T>(Some(min_value), arrays[0].data_type()).unwrap(),
   97 |         max_value: ScalarValue::new_primitive::<T>(Some(max_value), arrays[0].data_type()).unwrap(),
   98 |     }
   99 | }
  100 | 
  101 | fn compute_float_statistics<T: ArrowNumericType>(
  102 |     arrays: &[&ArrayRef],
  103 | ) -> (T::Native, T::Native, i64)
  104 | where
  105 |     T::Native: Float,
  106 | {
  107 |     let mut min_value = T::Native::infinity();
  108 |     let mut max_value = T::Native::neg_infinity();
  109 |     let mut null_count: i64 = 0;
  110 |     let arrays_iterator = arrays.iter().map(|x| as_primitive_array::<T>(x));
  111 | 
  112 |     for array in arrays_iterator {
  113 |         null_count += array.null_count() as i64;
  114 |         if array.null_count() == array.len() {
  115 |             continue;
  116 |         }
  117 | 
  118 |         array.iter().for_each(|value| {
  119 |             if let Some(value) = value {
  120 |                 if let Some(Ordering::Greater) = value.partial_cmp(&max_value) {
  121 |                     max_value = value;
  122 |                 }
  123 |                 if let Some(Ordering::Less) = value.partial_cmp(&min_value) {
  124 |                     min_value = value;
  125 |                 }
  126 |             };
  127 |         });
  128 |     }
  129 | 
  130 |     // If all values are null or NaN, these might have never changed from initial values.
  131 |     if min_value == T::Native::infinity() && max_value == T::Native::neg_infinity() {
  132 |         min_value = T::Native::neg_infinity();
  133 |         max_value = T::Native::infinity();
  134 |     }
  135 |     (min_value, max_value, null_count)
  136 | }
  137 | 
  138 | fn get_float_statistics<T: ArrowNumericType>(arrays: &[&ArrayRef]) -> StatisticsRow
  139 | where
  140 |     T::Native: Bounded + Float,
  141 |     datafusion_common::scalar::ScalarValue: From<<T as ArrowPrimitiveType>::Native>,
  142 | {
  143 |     let (mut min_value, mut max_value, null_count) = compute_float_statistics::<T>(arrays);
  144 | 
  145 |     if min_value == T::Native::zero() {
  146 |         min_value = T::Native::neg_zero();
  147 |     }
  148 | 
  149 |     if max_value == T::Native::neg_zero() {
  150 |         max_value = T::Native::zero();
  151 |     }
  152 | 
  153 |     let min_value = ScalarValue::from(min_value);
  154 |     let max_value = ScalarValue::from(max_value);
  155 | 
  156 |     StatisticsRow {
  157 |         null_count,
  158 |         min_value,
  159 |         max_value,
  160 |     }
  161 | }
  162 | 
  163 | fn get_decimal_statistics(arrays: &[&ArrayRef]) -> StatisticsRow {
  164 |     let (min_value, max_value, null_count) = compute_primitive_statistics::<Decimal128Type>(arrays);
  165 |     let array = as_primitive_array::<Decimal128Type>(arrays[0]);
  166 |     let precision = array.precision();
  167 |     let scale = array.scale();
  168 | 
  169 |     StatisticsRow {
  170 |         null_count,
  171 |         min_value: ScalarValue::Decimal128(Some(min_value), precision, scale),
  172 |         max_value: ScalarValue::Decimal128(Some(max_value), precision, scale),
  173 |     }
  174 | }
  175 | 
  176 | /// Truncate a UTF8 slice to the longest prefix that is still a valid UTF8 string, while being less than `length` bytes.
  177 | fn truncate_utf8(data: &str, length: usize) -> Option<&str> {
  178 |     // We return values like that at an earlier stage in the process.
  179 |     assert!(data.len() >= length);
  180 |     let mut char_indices = data.char_indices();
  181 | 
  182 |     // We know `data` is a valid UTF8 encoded string, which means it has at least one valid UTF8 byte, which will make this loop exist.
  183 |     while let Some((idx, c)) = char_indices.next_back() {
  184 |         let split_point = idx + c.len_utf8();
  185 |         if split_point <= length {
  186 |             return Some(&data[0..split_point]);
  187 |         }
  188 |     }
  189 | 
  190 |     None
  191 | }
  192 | 
  193 | /// Try and increment the string's bytes from right to left, returning when the result is a valid UTF8 string.
  194 | /// Returns `None` when it can't increment any byte.
  195 | fn increment_utf8(mut data: Vec<u8>) -> Option<Vec<u8>> {
  196 |     for idx in (0..data.len()).rev() {
  197 |         let original = data[idx];
  198 |         let (mut byte, mut overflow) = data[idx].overflowing_add(1);
  199 | 
  200 |         // Until overflow: 0xFF -> 0x00
  201 |         while !overflow {
  202 |             data[idx] = byte;
  203 | 
  204 |             if str::from_utf8(&data).is_ok() {
  205 |                 return Some(data);
  206 |             }
  207 |             (byte, overflow) = data[idx].overflowing_add(1);
  208 |         }
  209 | 
  210 |         data[idx] = original;
  211 |     }
  212 | 
  213 |     None
  214 | }
  215 | 
  216 | /// Truncate a binary slice to make sure its length is less than `length`
  217 | fn truncate_binary(data: &[u8], length: usize) -> Option<&[u8]> {
  218 |     // We return values like that at an earlier stage in the process.
  219 |     assert!(data.len() >= length);
  220 |     // If all bytes are already maximal, no need to truncate
  221 | 
  222 |     Some(&data[0..length])
  223 | }
  224 | 
  225 | /// Try and increment the bytes from right to left.
  226 | ///
  227 | /// Returns `None` if all bytes are set to `u8::MAX`.
  228 | fn increment(mut data: Vec<u8>) -> Option<Vec<u8>> {
  229 |     for byte in data.iter_mut().rev() {
  230 |         let (incremented, overflow) = byte.overflowing_add(1);
  231 |         *byte = incremented;
  232 | 
  233 |         if !overflow {
  234 |             return Some(data);
  235 |         }
  236 |     }
  237 | 
  238 |     None
  239 | }
  240 | 
  241 | fn get_string_statistics<T: OffsetSizeTrait>(arrays: &[&ArrayRef]) -> StatisticsRow {
  242 |     let mut min_value: Option<&str> = None;
  243 |     let mut max_value: Option<&str> = None;
  244 |     let mut null_count: i64 = 0;
  245 |     let mut bounds_truncated = false;
  246 | 
  247 |     let array_iterator = arrays.iter().map(|x| x.as_string::<T>());
  248 | 
  249 |     for array in array_iterator {
  250 |         null_count += array.null_count() as i64;
  251 |         if array.null_count() == array.len() {
  252 |             continue;
  253 |         }
  254 | 
  255 |         array.iter().for_each(|value| {
  256 |             if let Some(mut val) = value {
  257 |                 if val.len() > BINARY_PREFIX_LENGTH {
  258 |                     val = truncate_utf8(val, BINARY_PREFIX_LENGTH).unwrap();
  259 |                     bounds_truncated = true;
  260 |                 }
  261 | 
  262 |                 if let Some(v) = min_value {
  263 |                     if let Some(Ordering::Less) = val.partial_cmp(v) {
  264 |                         min_value = Some(val);
  265 |                     }
  266 |                 } else {
  267 |                     min_value = Some(val);
  268 |                 }
  269 | 
  270 |                 if let Some(v) = max_value {
  271 |                     if let Some(Ordering::Greater) = val.partial_cmp(v) {
  272 |                         max_value = Some(val);
  273 |                     }
  274 |                 } else {
  275 |                     max_value = Some(val);
  276 |                 }
  277 |             }
  278 |         });
  279 |     }
  280 | 
  281 |     let max_value_bound: Option<Vec<u8>>;
  282 |     if let Some(v) = max_value {
  283 |         // If the bounds were truncated, then we need to increment the max_value,
  284 |         // since shorter values are considered smaller than longer values if the
  285 |         // short values are a prefix of the long ones.
  286 |         if bounds_truncated {
  287 |             max_value_bound = increment_utf8(v.as_bytes().to_vec());
  288 |             // We can safely unwrap because increment_utf8 will only return
  289 |             // Some() if the bound is valid UTF-8 bytes.
  290 |             max_value = max_value_bound
  291 |                 .as_ref()
  292 |                 .map(|bound| str::from_utf8(bound).unwrap());
  293 |         }
  294 |     }
  295 | 
  296 |     let min_value = min_value.map(|x| x.to_string());
  297 |     let max_value = max_value.map(|x| x.to_string());
  298 | 
  299 |     match arrays[0].data_type() {
  300 |         DataType::Utf8 => StatisticsRow {
  301 |             null_count,
  302 |             min_value: ScalarValue::Utf8(min_value),
  303 |             max_value: ScalarValue::Utf8(max_value),
  304 |         },
  305 |         DataType::LargeUtf8 => StatisticsRow {
  306 |             null_count,
  307 |             min_value: ScalarValue::LargeUtf8(min_value),
  308 |             max_value: ScalarValue::LargeUtf8(max_value),
  309 |         },
  310 |         _ => {
  311 |             unreachable!()
  312 |         }
  313 |     }
  314 | }
  315 | 
  316 | fn get_binary_statistics<T: OffsetSizeTrait>(arrays: &[&ArrayRef]) -> StatisticsRow {
  317 |     let mut min_value: Option<&[u8]> = None;
  318 |     let mut max_value: Option<&[u8]> = None;
  319 |     let mut null_count: i64 = 0;
  320 |     let mut bounds_truncated = false;
  321 | 
  322 |     let array_iterator = arrays.iter().map(|x| as_generic_binary_array::<T>(x));
  323 | 
  324 |     for array in array_iterator {
  325 |         null_count += array.null_count() as i64;
  326 |         if array.null_count() == array.len() {
  327 |             continue;
  328 |         }
  329 | 
  330 |         array.iter().for_each(|value| {
  331 |             if let Some(mut val) = value {
  332 |                 // Truncate binary buffer to BINARY_PREFIX_LENGTH to avoid comparing potentially
  333 |                 // very long buffers.
  334 |                 if val.len() > BINARY_PREFIX_LENGTH {
  335 |                     val = truncate_binary(val, BINARY_PREFIX_LENGTH).unwrap();
  336 |                     bounds_truncated = true;
  337 |                 }
  338 | 
  339 |                 if let Some(v) = min_value {
  340 |                     if let Some(Ordering::Less) = val.partial_cmp(v) {
  341 |                         min_value = Some(val);
  342 |                     }
  343 |                 } else {
  344 |                     min_value = Some(val);
  345 |                 }
  346 | 
  347 |                 if let Some(v) = max_value {
  348 |                     if let Some(Ordering::Greater) = val.partial_cmp(v) {
  349 |                         max_value = Some(val);
  350 |                     }
  351 |                 } else {
  352 |                     max_value = Some(val);
  353 |                 }
  354 |             }
  355 |         });
  356 |     }
  357 | 
  358 |     let min_value = min_value.map(|x| x.to_vec());
  359 |     // If the bounds were truncated, then we need to increment the max_value,
  360 |     // since shorter values are considered smaller than longer values if the
  361 |     // short values are a prefix of the long ones.
  362 |     let max_value = if let Some(v) = max_value {
  363 |         if bounds_truncated {
  364 |             increment(v.to_vec())
  365 |         } else {
  366 |             Some(v.to_vec())
  367 |         }
  368 |     } else {
  369 |         None
  370 |     };
  371 | 
  372 |     match arrays[0].data_type() {
  373 |         DataType::Binary => StatisticsRow {
  374 |             null_count,
  375 |             min_value: ScalarValue::Binary(min_value),
  376 |             max_value: ScalarValue::Binary(max_value),
  377 |         },
  378 |         DataType::LargeBinary => StatisticsRow {
  379 |             null_count,
  380 |             min_value: ScalarValue::LargeBinary(min_value),
  381 |             max_value: ScalarValue::LargeBinary(max_value),
  382 |         },
  383 |         _ => {
  384 |             unreachable!()
  385 |         }
  386 |     }
  387 | }
  388 | 
  389 | fn get_fixed_size_binary_statistics(arrays: &[&ArrayRef]) -> StatisticsRow {
  390 |     let mut min_value: Option<&[u8]> = None;
  391 |     let mut max_value: Option<&[u8]> = None;
  392 |     let mut null_count: i64 = 0;
  393 | 
  394 |     let array_iterator = arrays.iter().map(|x| as_fixed_size_binary_array(x));
  395 | 
  396 |     let length = as_fixed_size_binary_array(arrays[0]).value_length() as usize;
  397 |     // Truncate binary buffer to BINARY_PREFIX_LENGTH to avoid comparing potentially
  398 |     // very long buffers.
  399 |     let do_truncate = length > BINARY_PREFIX_LENGTH;
  400 | 
  401 |     for array in array_iterator {
  402 |         null_count += array.null_count() as i64;
  403 |         if array.null_count() == array.len() {
  404 |             continue;
  405 |         }
  406 | 
  407 |         array.iter().for_each(|value| {
  408 |             if let Some(mut val) = value {
  409 |                 if do_truncate {
  410 |                     val = truncate_binary(val, BINARY_PREFIX_LENGTH).unwrap();
  411 |                 }
  412 | 
  413 |                 if let Some(v) = min_value {
  414 |                     if let Some(Ordering::Less) = val.partial_cmp(v) {
  415 |                         min_value = Some(val);
  416 |                     }
  417 |                 } else {
  418 |                     min_value = Some(val);
  419 |                 }
  420 | 
  421 |                 if let Some(v) = max_value {
  422 |                     if let Some(Ordering::Greater) = val.partial_cmp(v) {
  423 |                         max_value = Some(val);
  424 |                     }
  425 |                 } else {
  426 |                     max_value = Some(val);
  427 |                 }
  428 |             }
  429 |         });
  430 |     }
  431 | 
  432 |     let min_value = min_value.map(|x| x.to_vec());
  433 |     // If the bounds were truncated, then we need to increment the max_value,
  434 |     // since shorter values are considered smaller than longer values if the
  435 |     // short values are a prefix of the long ones.
  436 |     let max_value = if let Some(v) = max_value {
  437 |         if do_truncate {
  438 |             increment(v.to_vec())
  439 |         } else {
  440 |             Some(v.to_vec())
  441 |         }
  442 |     } else {
  443 |         None
  444 |     };
  445 | 
  446 |     StatisticsRow {
  447 |         null_count,
  448 |         min_value: ScalarValue::FixedSizeBinary(length as i32, min_value),
  449 |         max_value: ScalarValue::FixedSizeBinary(length as i32, max_value),
  450 |     }
  451 | }
  452 | 
  453 | fn get_boolean_statistics(arrays: &[&ArrayRef]) -> StatisticsRow {
  454 |     let mut true_present = false;
  455 |     let mut false_present = false;
  456 |     let mut null_count: i64 = 0;
  457 | 
  458 |     let array_iterator = arrays.iter().map(|x| x.as_boolean());
  459 | 
  460 |     for array in array_iterator {
  461 |         null_count += array.null_count() as i64;
  462 |         if array.null_count() == array.len() || (true_present && false_present) {
  463 |             continue;
  464 |         }
  465 | 
  466 |         array.iter().for_each(|value| {
  467 |             if let Some(value) = value {
  468 |                 if value {
  469 |                     true_present = true;
  470 |                 } else {
  471 |                     false_present = true;
  472 |                 }
  473 |             };
  474 |         });
  475 |     }
  476 | 
  477 |     StatisticsRow {
  478 |         null_count,
  479 |         min_value: ScalarValue::Boolean(Some(true_present && !false_present)),
  480 |         max_value: ScalarValue::Boolean(Some(true_present || !false_present)),
  481 |     }
  482 | }
  483 | 
  484 | fn cast_dictionary_arrays<'a, T: ArrowDictionaryKeyType + 'static>(
  485 |     arrays: &'a [&'a ArrayRef],
  486 | ) -> Vec<&'a Arc<dyn Array>> {
  487 |     arrays
  488 |         .iter()
  489 |         .map(|x| x.as_dictionary::<T>().values())
  490 |         .collect::<Vec<_>>()
  491 | }
  492 | 
  493 | fn get_dictionary_statistics(arrays: &[&ArrayRef]) -> StatisticsRow {
  494 |     let data_type = arrays[0].data_type();
  495 |     match data_type {
  496 |         DataType::Dictionary(key_type, _) => match key_type.as_ref() {
  497 |             DataType::Int8 => collect_statistics(&cast_dictionary_arrays::<Int8Type>(arrays)),
  498 |             DataType::Int16 => collect_statistics(&cast_dictionary_arrays::<Int16Type>(arrays)),
  499 |             DataType::Int32 => collect_statistics(&cast_dictionary_arrays::<Int32Type>(arrays)),
  500 |             DataType::Int64 => collect_statistics(&cast_dictionary_arrays::<Int64Type>(arrays)),
  501 |             DataType::UInt8 => collect_statistics(&cast_dictionary_arrays::<UInt8Type>(arrays)),
  502 |             DataType::UInt16 => collect_statistics(&cast_dictionary_arrays::<UInt16Type>(arrays)),
  503 |             DataType::UInt32 => collect_statistics(&cast_dictionary_arrays::<UInt32Type>(arrays)),
  504 |             DataType::UInt64 => collect_statistics(&cast_dictionary_arrays::<UInt64Type>(arrays)),
  505 |             _ => {
  506 |                 panic!("Unsupported dictionary key type: {}", key_type);
  507 |             }
  508 |         },
  509 |         _ => {
  510 |             panic!("Unsupported data type for dictionary: {}", data_type);
  511 |         }
  512 |     }
  513 | }
  514 | 
  515 | fn get_temporal_statistics(arrays: &[&ArrayRef]) -> StatisticsRow {
  516 |     match arrays[0].data_type() {
  517 |         DataType::Time32(TimeUnit::Second) => get_statistics::<Time32SecondType>(arrays),
  518 |         DataType::Time32(TimeUnit::Millisecond) => get_statistics::<Time32MillisecondType>(arrays),
  519 |         DataType::Date32 => get_statistics::<Date32Type>(arrays),
  520 |         // Note: the tz is propagated through the data type in arrays within get_statistics()
  521 |         DataType::Timestamp(TimeUnit::Second, _) => get_statistics::<TimestampSecondType>(arrays),
  522 |         DataType::Timestamp(TimeUnit::Millisecond, _) => {
  523 |             get_statistics::<TimestampMillisecondType>(arrays)
  524 |         }
  525 |         DataType::Timestamp(TimeUnit::Microsecond, _) => {
  526 |             get_statistics::<TimestampMicrosecondType>(arrays)
  527 |         }
  528 |         DataType::Timestamp(TimeUnit::Nanosecond, _) => {
  529 |             get_statistics::<TimestampNanosecondType>(arrays)
  530 |         }
  531 |         DataType::Time64(TimeUnit::Microsecond) => get_statistics::<Time64MicrosecondType>(arrays),
  532 |         DataType::Time64(TimeUnit::Nanosecond) => get_statistics::<Time64NanosecondType>(arrays),
  533 |         DataType::Date64 => get_statistics::<Date64Type>(arrays),
  534 |         DataType::Duration(TimeUnit::Second) => get_statistics::<DurationSecondType>(arrays),
  535 |         DataType::Duration(TimeUnit::Millisecond) => {
  536 |             get_statistics::<DurationMillisecondType>(arrays)
  537 |         }
  538 |         DataType::Duration(TimeUnit::Microsecond) => {
  539 |             get_statistics::<DurationMicrosecondType>(arrays)
  540 |         }
  541 |         DataType::Duration(TimeUnit::Nanosecond) => {
  542 |             get_statistics::<DurationNanosecondType>(arrays)
  543 |         }
  544 |         _ => {
  545 |             unreachable!()
  546 |         }
  547 |     }
  548 | }
  549 | 
  550 | pub fn collect_statistics(arrays: &[&ArrayRef]) -> StatisticsRow {
  551 |     if arrays.is_empty() {
  552 |         panic!("No arrays to collect statistics from");
  553 |     }
  554 |     match arrays[0].data_type() {
  555 |         DataType::Boolean => get_boolean_statistics(arrays),
  556 |         DataType::Int8 => get_statistics::<Int8Type>(arrays),
  557 |         DataType::UInt8 => get_statistics::<UInt8Type>(arrays),
  558 |         DataType::Int16 => get_statistics::<Int16Type>(arrays),
  559 |         DataType::UInt16 => get_statistics::<UInt16Type>(arrays),
  560 |         DataType::Int32 => get_statistics::<Int32Type>(arrays),
  561 |         DataType::UInt32 => get_statistics::<UInt32Type>(arrays),
  562 |         DataType::Int64 => get_statistics::<Int64Type>(arrays),
  563 |         DataType::UInt64 => get_statistics::<UInt64Type>(arrays),
  564 |         DataType::Float32 => get_float_statistics::<Float32Type>(arrays),
  565 |         DataType::Float64 => get_float_statistics::<Float64Type>(arrays),
  566 |         DataType::Date32
  567 |         | DataType::Time32(_)
  568 |         | DataType::Date64
  569 |         | DataType::Time64(_)
  570 |         | DataType::Timestamp(_, _)
  571 |         | DataType::Duration(_) => get_temporal_statistics(arrays),
  572 |         DataType::Decimal128(_, _) => get_decimal_statistics(arrays),
  573 |         // TODO: Decimal256
  574 |         DataType::Binary => get_binary_statistics::<i32>(arrays),
  575 |         DataType::LargeBinary => get_binary_statistics::<i64>(arrays),
  576 |         DataType::FixedSizeBinary(_) => get_fixed_size_binary_statistics(arrays),
  577 |         DataType::Utf8 => get_string_statistics::<i32>(arrays),
  578 |         DataType::LargeUtf8 => get_string_statistics::<i64>(arrays),
  579 |         DataType::Dictionary(_, _) => get_dictionary_statistics(arrays),
  580 |         // DataType::List(_) => get_list_statistics(arrays),
  581 |         // DataType::LargeList(_) => get_list_statistics(arrays),
  582 |         _ => unreachable!(),
  583 |     }
  584 | }
  585 | 
  586 | pub fn supports_stats_collection(datatype: &DataType) -> bool {
  587 |     matches!(
  588 |         datatype,
  589 |         DataType::Boolean
  590 |             | DataType::Int8
  591 |             | DataType::UInt8
  592 |             | DataType::Int16
  593 |             | DataType::UInt16
  594 |             | DataType::Int32
  595 |             | DataType::UInt32
  596 |             | DataType::Int64
  597 |             | DataType::UInt64
  598 |             | DataType::Float32
  599 |             | DataType::Float64
  600 |             | DataType::Date32
  601 |             | DataType::Date64
  602 |             | DataType::Utf8
  603 |             | DataType::Binary
  604 |             | DataType::LargeUtf8
  605 |             | DataType::LargeBinary
  606 |             // | DataType::FixedSizeBinary(_)
  607 |             | DataType::Decimal128(_, _)
  608 |     )
  609 | }
  610 | 
  611 | #[derive(Debug)]
  612 | pub struct StatisticsCollector {
  613 |     builders: BTreeMap<i32, (Field, StatisticsBuilder)>,
  614 | }
  615 | 
  616 | impl StatisticsCollector {
  617 |     /// Try to create a new statistics collection. If no fields in the schema
  618 |     /// support statistics, will just return None.
  619 |     pub fn try_new(schema: &Schema) -> Option<Self> {
  620 |         let builders: BTreeMap<i32, (Field, StatisticsBuilder)> = visit_fields(schema)
  621 |             .filter(|f| supports_stats_collection(&f.data_type()))
  622 |             .map(|f| (f.id, (f.clone(), StatisticsBuilder::new(&f.data_type()))))
  623 |             .collect();
  624 |         if builders.is_empty() {
  625 |             None
  626 |         } else {
  627 |             Some(Self { builders })
  628 |         }
  629 |     }
  630 | 
  631 |     pub fn get_builder(&mut self, field_id: i32) -> Option<&mut StatisticsBuilder> {
  632 |         self.builders.get_mut(&field_id).map(|(_, b)| b)
  633 |     }
  634 | 
  635 |     pub fn finish(&mut self) -> Result<RecordBatch> {
  636 |         let mut arrays: Vec<ArrayRef> = vec![];
  637 |         let mut fields: Vec<ArrowField> = vec![];
  638 | 
  639 |         self.builders.iter_mut().for_each(|(_, (field, builder))| {
  640 |             let null_count = Arc::new(builder.null_count.finish());
  641 |             let min_value = Arc::new(builder.min_value.finish());
  642 |             let max_value = Arc::new(builder.max_value.finish());
  643 |             let struct_fields = vec![
  644 |                 ArrowField::new("null_count", DataType::Int64, false),
  645 |                 // Bounds can be absent for empty pages regardless of the data field's
  646 |                 // nullability.
  647 |                 ArrowField::new("min_value", field.data_type(), true),
  648 |                 ArrowField::new("max_value", field.data_type(), true),
  649 |             ];
  650 | 
  651 |             let stats = StructArray::new(
  652 |                 struct_fields.clone().into(),
  653 |                 vec![null_count.clone(), min_value, max_value],
  654 |                 null_count.nulls().cloned(),
  655 |             );
  656 |             let field = ArrowField::new_struct(field.id.to_string(), struct_fields, false);
  657 |             fields.push(field);
  658 |             arrays.push(Arc::new(stats));
  659 |         });
  660 | 
  661 |         let schema = Arc::new(ArrowSchema::new(fields));
  662 |         let batch = RecordBatch::try_new(schema, arrays);
  663 |         match batch {
  664 |             Ok(batch) => Ok(batch),
  665 |             _ => Err(ArrowError::SchemaError(
  666 |                 "all columns in a record batch must have the same length".to_string(),
  667 |             )
  668 |             .into()),
  669 |         }
  670 |     }
  671 | }
  672 | 
  673 | /// Visit all fields, only visiting children of structs.
  674 | fn visit_fields(schema: &Schema) -> impl Iterator<Item = &Field> {
  675 |     let mut fields: Vec<&Field> = schema.fields.iter().rev().collect();
  676 |     std::iter::from_fn(move || {
  677 |         if let Some(field) = fields.pop() {
  678 |             if field.data_type().is_struct() {
  679 |                 fields.extend(field.children.iter().rev());
  680 |             }
  681 |             Some(field)
  682 |         } else {
  683 |             None
  684 |         }
  685 |     })
  686 | }
  687 | 
  688 | pub struct StatisticsBuilder {
  689 |     null_count: PrimitiveBuilder<Int64Type>,
  690 |     min_value: Box<dyn ArrayBuilder>,
  691 |     max_value: Box<dyn ArrayBuilder>,
  692 |     dt: DataType,
  693 | }
  694 | 
  695 | impl std::fmt::Debug for StatisticsBuilder {
  696 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
  697 |         f.debug_struct("StatisticsBuilder")
  698 |             .field("null_count", &self.null_count)
  699 |             .field("dt", &self.dt)
  700 |             .finish()
  701 |     }
  702 | }
  703 | 
  704 | impl StatisticsBuilder {
  705 |     fn new(data_type: &DataType) -> Self {
  706 |         let null_count = PrimitiveBuilder::<Int64Type>::new();
  707 |         let min_value = make_builder(data_type, 1);
  708 |         let max_value = make_builder(data_type, 1);
  709 |         let dt = data_type.clone();
  710 |         Self {
  711 |             null_count,
  712 |             min_value,
  713 |             max_value,
  714 |             dt,
  715 |         }
  716 |     }
  717 | 
  718 |     fn string_statistics_appender<T: OffsetSizeTrait>(&mut self, row: StatisticsRow) {
  719 |         let min_value_builder = self
  720 |             .min_value
  721 |             .as_any_mut()
  722 |             .downcast_mut::<GenericStringBuilder<T>>()
  723 |             .unwrap();
  724 |         let max_value_builder = self
  725 |             .max_value
  726 |             .as_any_mut()
  727 |             .downcast_mut::<GenericStringBuilder<T>>()
  728 |             .unwrap();
  729 | 
  730 |         self.null_count.append_value(row.null_count);
  731 | 
  732 |         match self.dt {
  733 |             DataType::Utf8 => {
  734 |                 if let ScalarValue::Utf8(Some(min_value)) = row.min_value {
  735 |                     min_value_builder.append_value(min_value);
  736 |                 } else {
  737 |                     min_value_builder.append_null();
  738 |                 }
  739 | 
  740 |                 if let ScalarValue::Utf8(Some(max_value)) = row.max_value {
  741 |                     max_value_builder.append_value(max_value);
  742 |                 } else {
  743 |                     max_value_builder.append_null();
  744 |                 }
  745 |             }
  746 |             DataType::LargeUtf8 => {
  747 |                 if let ScalarValue::LargeUtf8(Some(min_value)) = row.min_value {
  748 |                     min_value_builder.append_value(min_value);
  749 |                 } else {
  750 |                     min_value_builder.append_null();
  751 |                 }
  752 | 
  753 |                 if let ScalarValue::LargeUtf8(Some(max_value)) = row.max_value {
  754 |                     max_value_builder.append_value(max_value);
  755 |                 } else {
  756 |                     max_value_builder.append_null();
  757 |                 }
  758 |             }
  759 |             _ => unreachable!(),
  760 |         }
  761 |     }
  762 | 
  763 |     fn binary_statistics_appender<T: OffsetSizeTrait>(&mut self, row: StatisticsRow) {
  764 |         let min_value_builder = self
  765 |             .min_value
  766 |             .as_any_mut()
  767 |             .downcast_mut::<GenericBinaryBuilder<T>>()
  768 |             .unwrap();
  769 |         let max_value_builder = self
  770 |             .max_value
  771 |             .as_any_mut()
  772 |             .downcast_mut::<GenericBinaryBuilder<T>>()
  773 |             .unwrap();
  774 | 
  775 |         self.null_count.append_value(row.null_count);
  776 | 
  777 |         match self.dt {
  778 |             DataType::Binary => {
  779 |                 if let ScalarValue::Binary(Some(min_value)) = row.min_value {
  780 |                     min_value_builder.append_value(min_value);
  781 |                 } else {
  782 |                     min_value_builder.append_null();
  783 |                 }
  784 | 
  785 |                 if let ScalarValue::Binary(Some(max_value)) = row.max_value {
  786 |                     max_value_builder.append_value(max_value);
  787 |                 } else {
  788 |                     max_value_builder.append_null();
  789 |                 }
  790 |             }
  791 |             DataType::LargeBinary => {
  792 |                 if let ScalarValue::LargeBinary(Some(min_value)) = row.min_value {
  793 |                     min_value_builder.append_value(min_value);
  794 |                 } else {
  795 |                     min_value_builder.append_null();
  796 |                 }
  797 | 
  798 |                 if let ScalarValue::LargeBinary(Some(max_value)) = row.max_value {
  799 |                     max_value_builder.append_value(max_value);
  800 |                 } else {
  801 |                     max_value_builder.append_null();
  802 |                 }
  803 |             }
  804 |             _ => unreachable!(),
  805 |         }
  806 |     }
  807 | 
  808 |     fn statistics_appender<T: arrow_array::ArrowPrimitiveType>(&mut self, row: StatisticsRow) {
  809 |         let min_value_builder = self
  810 |             .min_value
  811 |             .as_any_mut()
  812 |             .downcast_mut::<PrimitiveBuilder<T>>()
  813 |             .unwrap();
  814 |         let max_value_builder = self
  815 |             .max_value
  816 |             .as_any_mut()
  817 |             .downcast_mut::<PrimitiveBuilder<T>>()
  818 |             .unwrap();
  819 | 
  820 |         let min_value = row
  821 |             .min_value
  822 |             .to_array()
  823 |             .unwrap()
  824 |             .as_any()
  825 |             .downcast_ref::<PrimitiveArray<T>>()
  826 |             .unwrap()
  827 |             .value(0);
  828 |         let max_value = row
  829 |             .max_value
  830 |             .to_array()
  831 |             .unwrap()
  832 |             .as_any()
  833 |             .downcast_ref::<PrimitiveArray<T>>()
  834 |             .unwrap()
  835 |             .value(0);
  836 | 
  837 |         self.null_count.append_value(row.null_count);
  838 |         min_value_builder.append_value(min_value);
  839 |         max_value_builder.append_value(max_value);
  840 |     }
  841 | 
  842 |     fn boolean_appender(&mut self, row: StatisticsRow) {
  843 |         let min_value_builder = self
  844 |             .min_value
  845 |             .as_any_mut()
  846 |             .downcast_mut::<BooleanBuilder>()
  847 |             .unwrap();
  848 |         let max_value_builder = self
  849 |             .max_value
  850 |             .as_any_mut()
  851 |             .downcast_mut::<BooleanBuilder>()
  852 |             .unwrap();
  853 | 
  854 |         self.null_count.append_value(row.null_count);
  855 | 
  856 |         if let ScalarValue::Boolean(Some(min_value)) = row.min_value {
  857 |             min_value_builder.append_value(min_value);
  858 |         } else {
  859 |             min_value_builder.append_value(false);
  860 |         };
  861 | 
  862 |         if let ScalarValue::Boolean(Some(max_value)) = row.max_value {
  863 |             max_value_builder.append_value(max_value);
  864 |         } else {
  865 |             max_value_builder.append_value(true);
  866 |         };
  867 |     }
  868 | 
  869 |     pub fn append(&mut self, row: StatisticsRow) {
  870 |         match self.dt {
  871 |             DataType::Boolean => self.boolean_appender(row),
  872 |             DataType::Int8 => self.statistics_appender::<Int8Type>(row),
  873 |             DataType::UInt8 => self.statistics_appender::<UInt8Type>(row),
  874 |             DataType::Int16 => self.statistics_appender::<Int16Type>(row),
  875 |             DataType::UInt16 => self.statistics_appender::<UInt16Type>(row),
  876 |             DataType::Int32 => self.statistics_appender::<Int32Type>(row),
  877 |             DataType::UInt32 => self.statistics_appender::<UInt32Type>(row),
  878 |             DataType::Int64 => self.statistics_appender::<Int64Type>(row),
  879 |             DataType::UInt64 => self.statistics_appender::<UInt64Type>(row),
  880 |             DataType::Float32 => self.statistics_appender::<Float32Type>(row),
  881 |             DataType::Float64 => self.statistics_appender::<Float64Type>(row),
  882 |             DataType::Date32 => self.statistics_appender::<Date32Type>(row),
  883 |             DataType::Date64 => self.statistics_appender::<Date64Type>(row),
  884 |             DataType::Time32(TimeUnit::Second) => self.statistics_appender::<Time32SecondType>(row),
  885 |             DataType::Time32(TimeUnit::Millisecond) => {
  886 |                 self.statistics_appender::<Time32MillisecondType>(row)
  887 |             }
  888 |             DataType::Time64(TimeUnit::Microsecond) => {
  889 |                 self.statistics_appender::<Time64MicrosecondType>(row)
  890 |             }
  891 |             DataType::Time64(TimeUnit::Nanosecond) => {
  892 |                 self.statistics_appender::<Time64NanosecondType>(row)
  893 |             }
  894 |             DataType::Timestamp(TimeUnit::Second, _) => {
  895 |                 self.statistics_appender::<TimestampSecondType>(row)
  896 |             }
  897 |             DataType::Timestamp(TimeUnit::Millisecond, _) => {
  898 |                 self.statistics_appender::<TimestampMillisecondType>(row)
  899 |             }
  900 |             DataType::Timestamp(TimeUnit::Microsecond, _) => {
  901 |                 self.statistics_appender::<TimestampMicrosecondType>(row)
  902 |             }
  903 |             DataType::Timestamp(TimeUnit::Nanosecond, _) => {
  904 |                 self.statistics_appender::<TimestampNanosecondType>(row)
  905 |             }
  906 |             DataType::Duration(TimeUnit::Second) => {
  907 |                 self.statistics_appender::<DurationSecondType>(row)
  908 |             }
  909 |             DataType::Duration(TimeUnit::Millisecond) => {
  910 |                 self.statistics_appender::<DurationMillisecondType>(row)
  911 |             }
  912 |             DataType::Duration(TimeUnit::Microsecond) => {
  913 |                 self.statistics_appender::<DurationMicrosecondType>(row)
  914 |             }
  915 |             DataType::Duration(TimeUnit::Nanosecond) => {
  916 |                 self.statistics_appender::<DurationNanosecondType>(row)
  917 |             }
  918 |             DataType::Decimal128(_, _) => self.statistics_appender::<Decimal128Type>(row),
  919 |             // TODO: Decimal256
  920 |             DataType::Binary => self.binary_statistics_appender::<i32>(row),
  921 |             DataType::LargeBinary => self.binary_statistics_appender::<i64>(row),
  922 |             DataType::Utf8 => self.string_statistics_appender::<i32>(row),
  923 |             DataType::LargeUtf8 => self.string_statistics_appender::<i64>(row),
  924 |             // Dictionary type is not needed here. We collected stats for values.
  925 |             _ => {
  926 |                 todo!("Stats collection for {} is not supported yet", self.dt);
  927 |             }
  928 |         }
  929 |     }
  930 | }
  931 | 
  932 | #[cfg(test)]
  933 | mod tests {
  934 |     use arrow_array::{
  935 |         BinaryArray, BooleanArray, Date32Array, Date64Array, Datum, Decimal128Array,
  936 |         DictionaryArray, DurationMicrosecondArray, DurationMillisecondArray,
  937 |         DurationNanosecondArray, DurationSecondArray, FixedSizeBinaryArray, Float32Array,
  938 |         Float64Array, Int8Array, Int16Array, Int32Array, Int64Array, LargeBinaryArray,
  939 |         LargeStringArray, StringArray, Time32MillisecondArray, Time32SecondArray,
  940 |         Time64MicrosecondArray, Time64NanosecondArray, TimestampMicrosecondArray,
  941 |         TimestampMillisecondArray, TimestampNanosecondArray, TimestampSecondArray, UInt8Array,
  942 |         UInt16Array, UInt32Array, UInt64Array, builder::StringDictionaryBuilder, make_array,
  943 |         new_empty_array, new_null_array,
  944 |     };
  945 |     use arrow_select::interleave::interleave;
  946 |     use num_traits::One;
  947 |     use proptest::{prop_assert, prop_assert_eq, strategy::Strategy, test_runner::TestCaseError};
  948 | 
  949 |     use super::*;
  950 |     use arrow_schema::{Field as ArrowField, Fields as ArrowFields, Schema as ArrowSchema};
  951 | 
  952 |     #[test]
  953 |     #[should_panic(expected = "No arrays to collect statistics from")]
  954 |     fn test_no_arrays() {
  955 |         let arrays: Vec<ArrayRef> = vec![];
  956 |         let array_refs = arrays.iter().collect::<Vec<_>>();
  957 |         collect_statistics(array_refs.as_slice());
  958 |     }
  959 | 
  960 |     #[test]
  961 |     fn test_edge_cases() {
  962 |         // Empty arrays, default min/max values
  963 |         let arrays: Vec<ArrayRef> = vec![Arc::new(UInt32Array::from_iter_values(vec![]))];
  964 |         let array_refs = arrays.iter().collect::<Vec<_>>();
  965 |         assert_eq!(
  966 |             collect_statistics(array_refs.as_slice()),
  967 |             StatisticsRow {
  968 |                 null_count: 0,
  969 |                 min_value: ScalarValue::from(u32::MIN),
  970 |                 max_value: ScalarValue::from(u32::MAX),
  971 |             }
  972 |         );
  973 | 
  974 |         let empty_string_vec: Vec<Option<&str>> = vec![];
  975 |         let arrays: Vec<ArrayRef> = vec![Arc::new(StringArray::from(empty_string_vec))];
  976 |         let array_refs = arrays.iter().collect::<Vec<_>>();
  977 |         assert_eq!(
  978 |             collect_statistics(array_refs.as_slice()),
  979 |             StatisticsRow {
  980 |                 null_count: 0,
  981 |                 min_value: ScalarValue::Utf8(None),
  982 |                 max_value: ScalarValue::Utf8(None),
  983 |             }
  984 |         );
  985 |         let empty_string_vec: Vec<Option<&str>> = vec![];
  986 |         let arrays: Vec<ArrayRef> = vec![Arc::new(LargeStringArray::from(empty_string_vec))];
  987 |         let array_refs = arrays.iter().collect::<Vec<_>>();
  988 |         assert_eq!(
  989 |             collect_statistics(array_refs.as_slice()),
  990 |             StatisticsRow {
  991 |                 null_count: 0,
  992 |                 min_value: ScalarValue::LargeUtf8(None),
  993 |                 max_value: ScalarValue::LargeUtf8(None),
  994 |             }
  995 |         );
  996 | 
  997 |         let empty_binary_vec: Vec<Option<&[u8]>> = vec![];
  998 |         let arrays: Vec<ArrayRef> = vec![Arc::new(BinaryArray::from(empty_binary_vec))];
  999 |         let array_refs = arrays.iter().collect::<Vec<_>>();
 1000 |         assert_eq!(
 1001 |             collect_statistics(array_refs.as_slice()),
 1002 |             StatisticsRow {
 1003 |                 null_count: 0,
 1004 |                 min_value: ScalarValue::Binary(None),
 1005 |                 max_value: ScalarValue::Binary(None),
 1006 |             }
 1007 |         );
 1008 |         let empty_binary_vec: Vec<Option<&[u8]>> = vec![];
 1009 |         let arrays: Vec<ArrayRef> = vec![Arc::new(LargeBinaryArray::from(empty_binary_vec))];
 1010 |         let array_refs = arrays.iter().collect::<Vec<_>>();
 1011 |         assert_eq!(
 1012 |             collect_statistics(array_refs.as_slice()),
 1013 |             StatisticsRow {
 1014 |                 null_count: 0,
 1015 |                 min_value: ScalarValue::LargeBinary(None),
 1016 |                 max_value: ScalarValue::LargeBinary(None),
 1017 |             }
 1018 |         );
 1019 | 
 1020 |         let empty_boolean_vec: Vec<Option<bool>> = vec![];
 1021 |         let arrays: Vec<ArrayRef> = vec![Arc::new(BooleanArray::from(empty_boolean_vec))];
 1022 |         let array_refs = arrays.iter().collect::<Vec<_>>();
 1023 |         assert_eq!(
 1024 |             collect_statistics(array_refs.as_slice()),
 1025 |             StatisticsRow {
 1026 |                 null_count: 0,
 1027 |                 min_value: ScalarValue::from(false),
 1028 |                 max_value: ScalarValue::from(true),
 1029 |             }
 1030 |         );
 1031 |     }
 1032 | 
 1033 |     #[test]
 1034 |     fn test_collect_primitive_stats() {
 1035 |         struct TestCase {
 1036 |             source_arrays: Vec<ArrayRef>,
 1037 |             expected_min: ScalarValue,
 1038 |             expected_max: ScalarValue,
 1039 |             expected_null_count: i64,
 1040 |         }
 1041 | 
 1042 |         let cases: [TestCase; 24] = [
 1043 |             // Int8
 1044 |             TestCase {
 1045 |                 source_arrays: vec![
 1046 |                     Arc::new(Int8Array::from(vec![4, 3, 7, 2])),
 1047 |                     Arc::new(Int8Array::from(vec![-10, 3, 5])),
 1048 |                 ],
 1049 |                 expected_min: ScalarValue::from(-10_i8),
 1050 |                 expected_max: ScalarValue::from(7_i8),
 1051 |                 expected_null_count: 0,
 1052 |             },
 1053 |             // UInt8
 1054 |             TestCase {
 1055 |                 source_arrays: vec![
 1056 |                     Arc::new(UInt8Array::from(vec![4, 3, 7, 2])),
 1057 |                     Arc::new(UInt8Array::from(vec![10, 3, 5])),
 1058 |                 ],
 1059 |                 expected_min: ScalarValue::from(2_u8),
 1060 |                 expected_max: ScalarValue::from(10_u8),
 1061 |                 expected_null_count: 0,
 1062 |             },
 1063 |             // Int16
 1064 |             TestCase {
 1065 |                 source_arrays: vec![
 1066 |                     Arc::new(Int16Array::from(vec![4, 3, 7, 2])),
 1067 |                     Arc::new(Int16Array::from(vec![-10, 3, 5])),
 1068 |                 ],
 1069 |                 expected_min: ScalarValue::from(-10_i16),
 1070 |                 expected_max: ScalarValue::from(7_i16),
 1071 |                 expected_null_count: 0,
 1072 |             },
 1073 |             // UInt16
 1074 |             TestCase {
 1075 |                 source_arrays: vec![
 1076 |                     Arc::new(UInt16Array::from(vec![4, 3, 7, 2])),
 1077 |                     Arc::new(UInt16Array::from(vec![10, 3, 5])),
 1078 |                 ],
 1079 |                 expected_min: ScalarValue::from(2_u16),
 1080 |                 expected_max: ScalarValue::from(10_u16),
 1081 |                 expected_null_count: 0,
 1082 |             },
 1083 |             // Int32
 1084 |             TestCase {
 1085 |                 source_arrays: vec![
 1086 |                     Arc::new(Int32Array::from(vec![4, 3, 7, 2])),
 1087 |                     Arc::new(Int32Array::from(vec![-10, 3, 5])),
 1088 |                 ],
 1089 |                 expected_min: ScalarValue::from(-10_i32),
 1090 |                 expected_max: ScalarValue::from(7_i32),
 1091 |                 expected_null_count: 0,
 1092 |             },
 1093 |             // UInt32
 1094 |             TestCase {
 1095 |                 source_arrays: vec![
 1096 |                     Arc::new(UInt32Array::from(vec![4, 3, 7, 2])),
 1097 |                     Arc::new(UInt32Array::from(vec![10, 3, 5])),
 1098 |                 ],
 1099 |                 expected_min: ScalarValue::from(2_u32),
 1100 |                 expected_max: ScalarValue::from(10_u32),
 1101 |                 expected_null_count: 0,
 1102 |             },
 1103 |             // Int64
 1104 |             TestCase {
 1105 |                 source_arrays: vec![
 1106 |                     Arc::new(Int64Array::from(vec![4, 3, 7, 2])),
 1107 |                     Arc::new(Int64Array::from(vec![-10, 3, 5])),
 1108 |                 ],
 1109 |                 expected_min: ScalarValue::from(-10_i64),
 1110 |                 expected_max: ScalarValue::from(7_i64),
 1111 |                 expected_null_count: 0,
 1112 |             },
 1113 |             // UInt64
 1114 |             TestCase {
 1115 |                 source_arrays: vec![
 1116 |                     Arc::new(UInt64Array::from(vec![4, 3, 7, 2])),
 1117 |                     Arc::new(UInt64Array::from(vec![10, 3, 5])),
 1118 |                 ],
 1119 |                 expected_min: ScalarValue::from(2_u64),
 1120 |                 expected_max: ScalarValue::from(10_u64),
 1121 |                 expected_null_count: 0,
 1122 |             },
 1123 |             // Boolean
 1124 |             TestCase {
 1125 |                 source_arrays: vec![Arc::new(BooleanArray::from(vec![true, false]))],
 1126 |                 expected_min: ScalarValue::from(false),
 1127 |                 expected_max: ScalarValue::from(true),
 1128 |                 expected_null_count: 0,
 1129 |             },
 1130 |             // Date
 1131 |             TestCase {
 1132 |                 source_arrays: vec![
 1133 |                     Arc::new(Date32Array::from(vec![53, 42])),
 1134 |                     Arc::new(Date32Array::from(vec![68, 32])),
 1135 |                 ],
 1136 |                 expected_min: ScalarValue::Date32(Some(32)),
 1137 |                 expected_max: ScalarValue::Date32(Some(68)),
 1138 |                 expected_null_count: 0,
 1139 |             },
 1140 |             TestCase {
 1141 |                 source_arrays: vec![
 1142 |                     Arc::new(Date64Array::from(vec![53, 42])),
 1143 |                     Arc::new(Date64Array::from(vec![68, 32])),
 1144 |                 ],
 1145 |                 expected_min: ScalarValue::Date64(Some(32)),
 1146 |                 expected_max: ScalarValue::Date64(Some(68)),
 1147 |                 expected_null_count: 0,
 1148 |             },
 1149 |             // Time
 1150 |             TestCase {
 1151 |                 source_arrays: vec![
 1152 |                     Arc::new(Time32SecondArray::from(vec![53, 42])),
 1153 |                     Arc::new(Time32SecondArray::from(vec![68, 32])),
 1154 |                 ],
 1155 |                 expected_min: ScalarValue::Time32Second(Some(32)),
 1156 |                 expected_max: ScalarValue::Time32Second(Some(68)),
 1157 |                 expected_null_count: 0,
 1158 |             },
 1159 |             TestCase {
 1160 |                 source_arrays: vec![
 1161 |                     Arc::new(Time32MillisecondArray::from(vec![53, 42])),
 1162 |                     Arc::new(Time32MillisecondArray::from(vec![68, 32])),
 1163 |                 ],
 1164 |                 expected_min: ScalarValue::Time32Millisecond(Some(32)),
 1165 |                 expected_max: ScalarValue::Time32Millisecond(Some(68)),
 1166 |                 expected_null_count: 0,
 1167 |             },
 1168 |             TestCase {
 1169 |                 source_arrays: vec![
 1170 |                     Arc::new(Time64MicrosecondArray::from(vec![53, 42])),
 1171 |                     Arc::new(Time64MicrosecondArray::from(vec![68, 32])),
 1172 |                 ],
 1173 |                 expected_min: ScalarValue::Time64Microsecond(Some(32)),
 1174 |                 expected_max: ScalarValue::Time64Microsecond(Some(68)),
 1175 |                 expected_null_count: 0,
 1176 |             },
 1177 |             TestCase {
 1178 |                 source_arrays: vec![
 1179 |                     Arc::new(Time64NanosecondArray::from(vec![53, 42])),
 1180 |                     Arc::new(Time64NanosecondArray::from(vec![68, 32])),
 1181 |                 ],
 1182 |                 expected_min: ScalarValue::Time64Nanosecond(Some(32)),
 1183 |                 expected_max: ScalarValue::Time64Nanosecond(Some(68)),
 1184 |                 expected_null_count: 0,
 1185 |             },
 1186 |             // Timestamp
 1187 |             TestCase {
 1188 |                 source_arrays: vec![
 1189 |                     Arc::new(TimestampSecondArray::with_timezone_opt(
 1190 |                         vec![53, 42].into(),
 1191 |                         Some("UTC"),
 1192 |                     )),
 1193 |                     Arc::new(TimestampSecondArray::with_timezone_opt(
 1194 |                         vec![68, 32].into(),
 1195 |                         Some("UTC"),
 1196 |                     )),
 1197 |                 ],
 1198 |                 expected_min: ScalarValue::TimestampSecond(Some(32), Some("UTC".into())),
 1199 |                 expected_max: ScalarValue::TimestampSecond(Some(68), Some("UTC".into())),
 1200 |                 expected_null_count: 0,
 1201 |             },
 1202 |             TestCase {
 1203 |                 source_arrays: vec![
 1204 |                     Arc::new(TimestampMillisecondArray::with_timezone_opt(
 1205 |                         vec![53, 42].into(),
 1206 |                         Some("UTC"),
 1207 |                     )),
 1208 |                     Arc::new(TimestampMillisecondArray::with_timezone_opt(
 1209 |                         vec![68, 32].into(),
 1210 |                         Some("UTC"),
 1211 |                     )),
 1212 |                 ],
 1213 |                 expected_min: ScalarValue::TimestampMillisecond(Some(32), Some("UTC".into())),
 1214 |                 expected_max: ScalarValue::TimestampMillisecond(Some(68), Some("UTC".into())),
 1215 |                 expected_null_count: 0,
 1216 |             },
 1217 |             TestCase {
 1218 |                 source_arrays: vec![
 1219 |                     Arc::new(TimestampMicrosecondArray::with_timezone_opt(
 1220 |                         vec![53, 42].into(),
 1221 |                         Some("UTC"),
 1222 |                     )),
 1223 |                     Arc::new(TimestampMicrosecondArray::with_timezone_opt(
 1224 |                         vec![68, 32].into(),
 1225 |                         Some("UTC"),
 1226 |                     )),
 1227 |                 ],
 1228 |                 expected_min: ScalarValue::TimestampMicrosecond(Some(32), Some("UTC".into())),
 1229 |                 expected_max: ScalarValue::TimestampMicrosecond(Some(68), Some("UTC".into())),
 1230 |                 expected_null_count: 0,
 1231 |             },
 1232 |             TestCase {
 1233 |                 source_arrays: vec![
 1234 |                     Arc::new(TimestampNanosecondArray::with_timezone_opt(
 1235 |                         vec![53, 42].into(),
 1236 |                         Some("UTC"),
 1237 |                     )),
 1238 |                     Arc::new(TimestampNanosecondArray::with_timezone_opt(
 1239 |                         vec![68, 32].into(),
 1240 |                         Some("UTC"),
 1241 |                     )),
 1242 |                 ],
 1243 |                 expected_min: ScalarValue::TimestampNanosecond(Some(32), Some("UTC".into())),
 1244 |                 expected_max: ScalarValue::TimestampNanosecond(Some(68), Some("UTC".into())),
 1245 |                 expected_null_count: 0,
 1246 |             },
 1247 |             // Duration
 1248 |             TestCase {
 1249 |                 source_arrays: vec![
 1250 |                     Arc::new(DurationSecondArray::from(vec![53, 42])),
 1251 |                     Arc::new(DurationSecondArray::from(vec![68, 32])),
 1252 |                 ],
 1253 |                 expected_min: ScalarValue::DurationSecond(Some(32)),
 1254 |                 expected_max: ScalarValue::DurationSecond(Some(68)),
 1255 |                 expected_null_count: 0,
 1256 |             },
 1257 |             TestCase {
 1258 |                 source_arrays: vec![
 1259 |                     Arc::new(DurationMillisecondArray::from(vec![53, 42])),
 1260 |                     Arc::new(DurationMillisecondArray::from(vec![68, 32])),
 1261 |                 ],
 1262 |                 expected_min: ScalarValue::DurationMillisecond(Some(32)),
 1263 |                 expected_max: ScalarValue::DurationMillisecond(Some(68)),
 1264 |                 expected_null_count: 0,
 1265 |             },
 1266 |             TestCase {
 1267 |                 source_arrays: vec![
 1268 |                     Arc::new(DurationMicrosecondArray::from(vec![53, 42])),
 1269 |                     Arc::new(DurationMicrosecondArray::from(vec![68, 32])),
 1270 |                 ],
 1271 |                 expected_min: ScalarValue::DurationMicrosecond(Some(32)),
 1272 |                 expected_max: ScalarValue::DurationMicrosecond(Some(68)),
 1273 |                 expected_null_count: 0,
 1274 |             },
 1275 |             TestCase {
 1276 |                 source_arrays: vec![
 1277 |                     Arc::new(DurationNanosecondArray::from(vec![53, 42])),
 1278 |                     Arc::new(DurationNanosecondArray::from(vec![68, 32])),
 1279 |                 ],
 1280 |                 expected_min: ScalarValue::DurationNanosecond(Some(32)),
 1281 |                 expected_max: ScalarValue::DurationNanosecond(Some(68)),
 1282 |                 expected_null_count: 0,
 1283 |             },
 1284 |             // Decimal
 1285 |             TestCase {
 1286 |                 source_arrays: vec![
 1287 |                     Arc::new(Decimal128Array::from(vec![53, 42])),
 1288 |                     Arc::new(Decimal128Array::from(vec![68, 32])),
 1289 |                 ],
 1290 |                 expected_min: ScalarValue::try_new_decimal128(32, 38, 10).unwrap(),
 1291 |                 expected_max: ScalarValue::try_new_decimal128(68, 38, 10).unwrap(),
 1292 |                 expected_null_count: 0,
 1293 |             },
 1294 |         ];
 1295 | 
 1296 |         for case in cases {
 1297 |             let array_refs = case.source_arrays.iter().collect::<Vec<_>>();
 1298 |             let stats = collect_statistics(&array_refs);
 1299 |             assert_eq!(
 1300 |                 stats,
 1301 |                 StatisticsRow {
 1302 |                     min_value: case.expected_min,
 1303 |                     max_value: case.expected_max,
 1304 |                     null_count: case.expected_null_count,
 1305 |                 },
 1306 |                 "Statistics are wrong for input data: {:?}",
 1307 |                 case.source_arrays
 1308 |             );
 1309 |         }
 1310 |     }
 1311 | 
 1312 |     #[test]
 1313 |     fn test_collect_float_stats() {
 1314 |         // NaN values are ignored in statistics
 1315 |         let arrays: Vec<ArrayRef> = vec![
 1316 |             Arc::new(Float32Array::from(vec![4.0f32, 3.0, f32::NAN, 2.0])),
 1317 |             Arc::new(Float32Array::from(vec![-10.0f32, 3.0, 5.0, f32::NAN])),
 1318 |         ];
 1319 |         let array_refs = arrays.iter().collect::<Vec<_>>();
 1320 |         let stats = collect_statistics(&array_refs);
 1321 |         assert_eq!(
 1322 |             stats,
 1323 |             StatisticsRow {
 1324 |                 null_count: 0,
 1325 |                 min_value: ScalarValue::from(-10.0_f32),
 1326 |                 max_value: ScalarValue::from(5.0_f32),
 1327 |             }
 1328 |         );
 1329 | 
 1330 |         // (Negative) Infinity can be min or max.
 1331 |         let arrays: Vec<ArrayRef> = vec![Arc::new(Float64Array::from(vec![
 1332 |             4.0f64,
 1333 |             f64::neg_infinity(),
 1334 |             f64::infinity(),
 1335 |         ]))];
 1336 |         let array_refs = arrays.iter().collect::<Vec<_>>();
 1337 |         let stats = collect_statistics(&array_refs);
 1338 |         assert_eq!(
 1339 |             stats,
 1340 |             StatisticsRow {
 1341 |                 null_count: 0,
 1342 |                 min_value: ScalarValue::from(f64::neg_infinity()),
 1343 |                 max_value: ScalarValue::from(f64::infinity()),
 1344 |             }
 1345 |         );
 1346 | 
 1347 |         // Max value for zero is always positive, min value for zero is always negative
 1348 |         let arrays: Vec<ArrayRef> = vec![Arc::new(Float32Array::from(vec![-0.0, 0.0]))];
 1349 |         let array_refs = arrays.iter().collect::<Vec<_>>();
 1350 |         let stats = collect_statistics(&array_refs);
 1351 |         assert_eq!(
 1352 |             stats,
 1353 |             StatisticsRow {
 1354 |                 null_count: 0,
 1355 |                 min_value: ScalarValue::from(-0.0_f32),
 1356 |                 max_value: ScalarValue::from(0.0_f32),
 1357 |             }
 1358 |         );
 1359 | 
 1360 |         // If all values are NaN, min and max are -Inf and Inf respectively,
 1361 |         // NaN values don't count towards null count.
 1362 |         let arrays: Vec<ArrayRef> = vec![Arc::new(Float64Array::from(vec![
 1363 |             f64::NAN,
 1364 |             f64::NAN,
 1365 |             f64::NAN,
 1366 |         ]))];
 1367 |         let array_refs = arrays.iter().collect::<Vec<_>>();
 1368 |         let stats = collect_statistics(&array_refs);
 1369 |         assert_eq!(
 1370 |             stats,
 1371 |             StatisticsRow {
 1372 |                 null_count: 0,
 1373 |                 min_value: ScalarValue::from(f64::neg_infinity()),
 1374 |                 max_value: ScalarValue::from(f64::infinity()),
 1375 |             }
 1376 |         );
 1377 |     }
 1378 | 
 1379 |     #[test]
 1380 |     fn test_collect_binary_stats() {
 1381 |         // Test string, binary with truncation and null values.
 1382 | 
 1383 |         let filler = "48 chars of filler                              ";
 1384 |         let min_binary_value = vec![0xFFu8; BINARY_PREFIX_LENGTH];
 1385 | 
 1386 |         struct TestCase {
 1387 |             source_arrays: Vec<ArrayRef>,
 1388 |             stats: StatisticsRow,
 1389 |         }
 1390 | 
 1391 |         let cases: [TestCase; 13] = [
 1392 |             // StringArray
 1393 |             // Whole strings are used if short enough
 1394 |             TestCase {
 1395 |                 source_arrays: vec![
 1396 |                     Arc::new(StringArray::from(vec![Some("foo"), None, Some("bar")])),
 1397 |                     Arc::new(StringArray::from(vec!["yee", "haw"])),
 1398 |                 ],
 1399 |                 stats: StatisticsRow {
 1400 |                     null_count: 1,
 1401 |                     min_value: ScalarValue::from("bar"),
 1402 |                     max_value: ScalarValue::from("yee"),
 1403 |                 },
 1404 |             },
 1405 |             // Prefixes are used if strings are too long. Multi-byte characters are
 1406 |             // not split.
 1407 |             TestCase {
 1408 |                 source_arrays: vec![Arc::new(StringArray::from(vec![
 1409 |                     format!("{}{}", filler, "bacteriologists🧑‍🔬"),
 1410 |                     format!("{}{}", filler, "terrestial planet"),
 1411 |                 ]))],
 1412 |                 stats: StatisticsRow {
 1413 |                     null_count: 0,
 1414 |                     // Bacteriologists is just 15 bytes, but the next character is multi-byte
 1415 |                     // so we truncate before.
 1416 |                     min_value: ScalarValue::from(
 1417 |                         format!("{}{}", filler, "bacteriologists").as_str(),
 1418 |                     ),
 1419 |                     // Increment the last character to make sure it's greater than max value
 1420 |                     max_value: ScalarValue::from(
 1421 |                         format!("{}{}", filler, "terrestial planf").as_str(),
 1422 |                     ),
 1423 |                 },
 1424 |             },
 1425 |             // Sting is not incremented if it's exact length of the limit
 1426 |             TestCase {
 1427 |                 source_arrays: vec![Arc::new(StringArray::from(vec![format!(
 1428 |                     "{}{}",
 1429 |                     filler, "terrestial planf"
 1430 |                 )]))],
 1431 |                 stats: StatisticsRow {
 1432 |                     null_count: 0,
 1433 |                     min_value: ScalarValue::from(
 1434 |                         format!("{}{}", filler, "terrestial planf").as_str(),
 1435 |                     ),
 1436 |                     max_value: ScalarValue::from(
 1437 |                         format!("{}{}", filler, "terrestial planf").as_str(),
 1438 |                     ),
 1439 |                 },
 1440 |             },
 1441 |             // LargeStringArray
 1442 |             TestCase {
 1443 |                 source_arrays: vec![
 1444 |                     Arc::new(LargeStringArray::from(vec![Some("foo"), None, Some("bar")])),
 1445 |                     Arc::new(LargeStringArray::from(vec!["yee", "haw"])),
 1446 |                 ],
 1447 |                 stats: StatisticsRow {
 1448 |                     null_count: 1,
 1449 |                     min_value: ScalarValue::LargeUtf8(Some("bar".to_string())),
 1450 |                     max_value: ScalarValue::LargeUtf8(Some("yee".to_string())),
 1451 |                 },
 1452 |             },
 1453 |             TestCase {
 1454 |                 source_arrays: vec![Arc::new(LargeStringArray::from(vec![
 1455 |                     format!("{}{}", filler, "bacteriologists🧑‍🔬"),
 1456 |                     format!("{}{}", filler, "terrestial planet"),
 1457 |                 ]))],
 1458 |                 stats: StatisticsRow {
 1459 |                     null_count: 0,
 1460 |                     // Bacteriologists is just 15 bytes, but the next character is multi-byte
 1461 |                     // so we truncate before.
 1462 |                     min_value: ScalarValue::LargeUtf8(Some(format!(
 1463 |                         "{}{}",
 1464 |                         filler, "bacteriologists"
 1465 |                     ))),
 1466 |                     // Increment the last character to make sure it's greater than max value
 1467 |                     max_value: ScalarValue::LargeUtf8(Some(format!(
 1468 |                         "{}{}",
 1469 |                         filler, "terrestial planf"
 1470 |                     ))),
 1471 |                 },
 1472 |             },
 1473 |             // Sting is not incremented if it's exact length of the limit
 1474 |             TestCase {
 1475 |                 source_arrays: vec![Arc::new(LargeStringArray::from(vec![format!(
 1476 |                     "{}{}",
 1477 |                     filler, "terrestial planf"
 1478 |                 )]))],
 1479 |                 stats: StatisticsRow {
 1480 |                     null_count: 0,
 1481 |                     min_value: ScalarValue::LargeUtf8(Some(format!(
 1482 |                         "{}{}",
 1483 |                         filler, "terrestial planf"
 1484 |                     ))),
 1485 |                     max_value: ScalarValue::LargeUtf8(Some(format!(
 1486 |                         "{}{}",
 1487 |                         filler, "terrestial planf"
 1488 |                     ))),
 1489 |                 },
 1490 |             },
 1491 |             // BinaryArray
 1492 |             // If not truncated max value exists (in the edge case where the value is
 1493 |             // 0xFF up until the limit), just return null as max.)
 1494 |             TestCase {
 1495 |                 source_arrays: vec![Arc::new(BinaryArray::from(vec![
 1496 |                     vec![0xFFu8; BINARY_PREFIX_LENGTH + 5].as_ref(),
 1497 |                 ]))],
 1498 |                 stats: StatisticsRow {
 1499 |                     null_count: 0,
 1500 |                     // We can truncate the minimum value, since the prefix is less than the full value
 1501 |                     min_value: ScalarValue::Binary(Some(min_binary_value.clone())),
 1502 |                     // We can't truncate the max value, so we return None
 1503 |                     max_value: ScalarValue::Binary(None),
 1504 |                 },
 1505 |             },
 1506 |             TestCase {
 1507 |                 source_arrays: vec![Arc::new(BinaryArray::from(vec![
 1508 |                     vec![0xFFu8; BINARY_PREFIX_LENGTH].as_ref(),
 1509 |                 ]))],
 1510 |                 stats: StatisticsRow {
 1511 |                     null_count: 0,
 1512 |                     min_value: ScalarValue::Binary(Some(min_binary_value.clone())),
 1513 |                     max_value: ScalarValue::Binary(Some(min_binary_value.clone())),
 1514 |                 },
 1515 |             },
 1516 |             // LargeBinaryArray
 1517 |             // If not truncated max value exists (in the edge case where the value is
 1518 |             // 0xFF up until the limit), just return null as max.)
 1519 |             TestCase {
 1520 |                 source_arrays: vec![Arc::new(LargeBinaryArray::from(vec![
 1521 |                     vec![0xFFu8; BINARY_PREFIX_LENGTH + 5].as_ref(),
 1522 |                 ]))],
 1523 |                 stats: StatisticsRow {
 1524 |                     null_count: 0,
 1525 |                     // We can truncate the minimum value, since the prefix is less than the full value
 1526 |                     min_value: ScalarValue::LargeBinary(Some(min_binary_value.clone())),
 1527 |                     // We can't truncate the max value, so we return None
 1528 |                     max_value: ScalarValue::LargeBinary(None),
 1529 |                 },
 1530 |             },
 1531 |             TestCase {
 1532 |                 source_arrays: vec![Arc::new(LargeBinaryArray::from(vec![
 1533 |                     vec![0xFFu8; BINARY_PREFIX_LENGTH].as_ref(),
 1534 |                 ]))],
 1535 |                 stats: StatisticsRow {
 1536 |                     null_count: 0,
 1537 |                     // We can truncate the minimum value, since the prefix is less than the full value
 1538 |                     min_value: ScalarValue::LargeBinary(Some(min_binary_value.clone())),
 1539 |                     max_value: ScalarValue::LargeBinary(Some(min_binary_value.clone())),
 1540 |                 },
 1541 |             },
 1542 |             // FixedSizeBinaryArray
 1543 |             TestCase {
 1544 |                 source_arrays: vec![Arc::new(FixedSizeBinaryArray::from(vec![
 1545 |                     Some(vec![0, 1].as_slice()),
 1546 |                     Some(vec![2, 3].as_slice()),
 1547 |                     Some(vec![4, 5].as_slice()),
 1548 |                     Some(vec![6, 7].as_slice()),
 1549 |                     Some(vec![8, 9].as_slice()),
 1550 |                 ]))],
 1551 |                 stats: StatisticsRow {
 1552 |                     null_count: 0,
 1553 |                     min_value: ScalarValue::FixedSizeBinary(2, Some(vec![0, 1])),
 1554 |                     max_value: ScalarValue::FixedSizeBinary(2, Some(vec![8, 9])),
 1555 |                 },
 1556 |             },
 1557 |             TestCase {
 1558 |                 source_arrays: vec![Arc::new(FixedSizeBinaryArray::from(vec![
 1559 |                     min_binary_value.as_slice(),
 1560 |                 ]))],
 1561 |                 stats: StatisticsRow {
 1562 |                     null_count: 0,
 1563 |                     min_value: ScalarValue::FixedSizeBinary(
 1564 |                         BINARY_PREFIX_LENGTH.try_into().unwrap(),
 1565 |                         Some(min_binary_value.clone()),
 1566 |                     ),
 1567 |                     max_value: ScalarValue::FixedSizeBinary(
 1568 |                         BINARY_PREFIX_LENGTH.try_into().unwrap(),
 1569 |                         Some(min_binary_value),
 1570 |                     ),
 1571 |                 },
 1572 |             },
 1573 |             TestCase {
 1574 |                 source_arrays: vec![Arc::new(FixedSizeBinaryArray::from(vec![
 1575 |                     &[0xFFu8; BINARY_PREFIX_LENGTH + 7],
 1576 |                 ]))],
 1577 |                 stats: StatisticsRow {
 1578 |                     null_count: 0,
 1579 |                     min_value: ScalarValue::FixedSizeBinary(
 1580 |                         (BINARY_PREFIX_LENGTH + 7).try_into().unwrap(),
 1581 |                         Some(vec![0xFFu8; BINARY_PREFIX_LENGTH]),
 1582 |                     ),
 1583 |                     // We can't truncate the max value, so we return None
 1584 |                     max_value: ScalarValue::FixedSizeBinary(
 1585 |                         (BINARY_PREFIX_LENGTH).try_into().unwrap(),
 1586 |                         None,
 1587 |                     ),
 1588 |                 },
 1589 |             },
 1590 |         ];
 1591 | 
 1592 |         for case in cases {
 1593 |             let array_refs = case.source_arrays.iter().collect::<Vec<_>>();
 1594 |             assert_eq!(
 1595 |                 collect_statistics(&array_refs),
 1596 |                 case.stats,
 1597 |                 "Statistics are wrong for input data: {:?}",
 1598 |                 case.source_arrays
 1599 |             );
 1600 |         }
 1601 |     }
 1602 | 
 1603 |     #[test]
 1604 |     fn test_collect_dictionary_stats() {
 1605 |         // Dictionary stats are collected from the underlying values
 1606 |         let dictionary_values = StringArray::from(vec![None, Some("abc"), Some("def")]);
 1607 | 
 1608 |         let mut builder =
 1609 |             StringDictionaryBuilder::<Int32Type>::new_with_dictionary(3, &dictionary_values)
 1610 |                 .unwrap();
 1611 |         builder.append("def").unwrap();
 1612 |         builder.append_null();
 1613 |         builder.append("abc").unwrap();
 1614 | 
 1615 |         let arr = builder.finish();
 1616 |         let arrays: Vec<ArrayRef> = vec![Arc::new(arr)];
 1617 |         let array_refs = arrays.iter().collect::<Vec<_>>();
 1618 |         let stats = collect_statistics(&array_refs);
 1619 |         assert_eq!(
 1620 |             stats,
 1621 |             StatisticsRow {
 1622 |                 null_count: 1,
 1623 |                 min_value: ScalarValue::from("abc"),
 1624 |                 max_value: ScalarValue::from("def"),
 1625 |             }
 1626 |         );
 1627 | 
 1628 |         let dictionary = Arc::new(StringArray::from(vec!["A", "C", "G", "T"]));
 1629 |         let indices_1 = UInt32Array::from(vec![1, 0, 2, 1]);
 1630 |         let indices_2 = UInt32Array::from(vec![0, 1, 3, 0]);
 1631 |         let dictionary_array_1 =
 1632 |             Arc::new(DictionaryArray::try_new(indices_1, dictionary.clone()).unwrap()) as ArrayRef;
 1633 |         let dictionary_array_2 =
 1634 |             Arc::new(DictionaryArray::try_new(indices_2, dictionary).unwrap()) as ArrayRef;
 1635 |         let array_refs = vec![&dictionary_array_1, &dictionary_array_2];
 1636 |         let stats = collect_statistics(&array_refs);
 1637 |         assert_eq!(
 1638 |             stats,
 1639 |             StatisticsRow {
 1640 |                 null_count: 0,
 1641 |                 min_value: ScalarValue::from("A"),
 1642 |                 max_value: ScalarValue::from("T"),
 1643 |             }
 1644 |         );
 1645 |     }
 1646 | 
 1647 |     #[test]
 1648 |     fn test_stats_collector() {
 1649 |         use lance_core::datatypes::Schema;
 1650 | 
 1651 |         // Check the output schema is correct
 1652 |         let arrow_schema = ArrowSchema::new(vec![
 1653 |             ArrowField::new("a", DataType::Int32, true),
 1654 |             ArrowField::new("b", DataType::Utf8, true),
 1655 |         ]);
 1656 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 1657 |         let mut collector = StatisticsCollector::try_new(&schema).unwrap();
 1658 | 
 1659 |         // Collect stats for a
 1660 |         let id = schema.field("a").unwrap().id;
 1661 |         let builder = collector.get_builder(id).unwrap();
 1662 |         builder.append(StatisticsRow {
 1663 |             null_count: 2,
 1664 |             min_value: ScalarValue::from(1_i32),
 1665 |             max_value: ScalarValue::from(3_i32),
 1666 |         });
 1667 |         builder.append(StatisticsRow {
 1668 |             null_count: 0,
 1669 |             min_value: ScalarValue::Int32(Some(i32::MIN)),
 1670 |             max_value: ScalarValue::Int32(Some(i32::MAX)),
 1671 |         });
 1672 | 
 1673 |         // If we try to finish at this point, it will error since we don't have
 1674 |         // stats for b yet.
 1675 |         assert!(collector.finish().is_err());
 1676 | 
 1677 |         // We cannot reuse old collector as it's builders were finished.
 1678 |         let mut collector = StatisticsCollector::try_new(&schema).unwrap();
 1679 | 
 1680 |         let id = schema.field("a").unwrap().id;
 1681 |         let builder = collector.get_builder(id).unwrap();
 1682 |         builder.append(StatisticsRow {
 1683 |             null_count: 2,
 1684 |             min_value: ScalarValue::from(1_i32),
 1685 |             max_value: ScalarValue::from(3_i32),
 1686 |         });
 1687 |         builder.append(StatisticsRow {
 1688 |             null_count: 0,
 1689 |             min_value: ScalarValue::Int32(Some(i32::MIN)),
 1690 |             max_value: ScalarValue::Int32(Some(i32::MAX)),
 1691 |         });
 1692 | 
 1693 |         // Collect stats for b
 1694 |         let id = schema.field("b").unwrap().id;
 1695 |         let builder = collector.get_builder(id).unwrap();
 1696 |         builder.append(StatisticsRow {
 1697 |             null_count: 6,
 1698 |             min_value: ScalarValue::from("aaa"),
 1699 |             max_value: ScalarValue::from("bbb"),
 1700 |         });
 1701 |         builder.append(StatisticsRow {
 1702 |             null_count: 0,
 1703 |             min_value: ScalarValue::Utf8(None),
 1704 |             max_value: ScalarValue::Utf8(None),
 1705 |         });
 1706 | 
 1707 |         // Now we can finish
 1708 |         let batch = collector.finish().unwrap();
 1709 | 
 1710 |         let expected_schema = ArrowSchema::new(vec![
 1711 |             ArrowField::new(
 1712 |                 "0",
 1713 |                 DataType::Struct(ArrowFields::from(vec![
 1714 |                     ArrowField::new("null_count", DataType::Int64, false),
 1715 |                     ArrowField::new("min_value", DataType::Int32, true),
 1716 |                     ArrowField::new("max_value", DataType::Int32, true),
 1717 |                 ])),
 1718 |                 false,
 1719 |             ),
 1720 |             ArrowField::new(
 1721 |                 "1",
 1722 |                 DataType::Struct(ArrowFields::from(vec![
 1723 |                     ArrowField::new("null_count", DataType::Int64, false),
 1724 |                     ArrowField::new("min_value", DataType::Utf8, true),
 1725 |                     ArrowField::new("max_value", DataType::Utf8, true),
 1726 |                 ])),
 1727 |                 false,
 1728 |             ),
 1729 |         ]);
 1730 | 
 1731 |         assert_eq!(batch.schema().as_ref(), &expected_schema);
 1732 | 
 1733 |         let expected_batch = RecordBatch::try_new(
 1734 |             Arc::new(expected_schema),
 1735 |             vec![
 1736 |                 Arc::new(StructArray::from(vec![
 1737 |                     (
 1738 |                         Arc::new(ArrowField::new("null_count", DataType::Int64, false)),
 1739 |                         Arc::new(Int64Array::from(vec![2, 0])) as ArrayRef,
 1740 |                     ),
 1741 |                     (
 1742 |                         Arc::new(ArrowField::new("min_value", DataType::Int32, true)),
 1743 |                         Arc::new(Int32Array::from(vec![1, i32::MIN])) as ArrayRef,
 1744 |                     ),
 1745 |                     (
 1746 |                         Arc::new(ArrowField::new("max_value", DataType::Int32, true)),
 1747 |                         Arc::new(Int32Array::from(vec![3, i32::MAX])) as ArrayRef,
 1748 |                     ),
 1749 |                 ])),
 1750 |                 Arc::new(StructArray::from(vec![
 1751 |                     (
 1752 |                         Arc::new(ArrowField::new("null_count", DataType::Int64, false)),
 1753 |                         Arc::new(Int64Array::from(vec![6, 0])) as ArrayRef,
 1754 |                     ),
 1755 |                     (
 1756 |                         Arc::new(ArrowField::new("min_value", DataType::Utf8, true)),
 1757 |                         Arc::new(StringArray::from(vec![Some("aaa"), None])) as ArrayRef,
 1758 |                     ),
 1759 |                     (
 1760 |                         Arc::new(ArrowField::new("max_value", DataType::Utf8, true)),
 1761 |                         Arc::new(StringArray::from(vec![Some("bbb"), None])) as ArrayRef,
 1762 |                     ),
 1763 |                 ])),
 1764 |             ],
 1765 |         )
 1766 |         .unwrap();
 1767 | 
 1768 |         assert_eq!(batch, expected_batch);
 1769 | 
 1770 |         // Check binary and string collectors return null for min/max if no
 1771 |         // values are supplied
 1772 |         let arrow_schema = ArrowSchema::new(vec![
 1773 |             ArrowField::new("boolean", DataType::Boolean, true),
 1774 |             ArrowField::new("binary", DataType::Binary, true),
 1775 |             ArrowField::new("large_binary", DataType::LargeBinary, true),
 1776 |             ArrowField::new("string", DataType::Utf8, true),
 1777 |             ArrowField::new("large_string", DataType::LargeUtf8, true),
 1778 |         ]);
 1779 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 1780 |         let mut collector = StatisticsCollector::try_new(&schema).unwrap();
 1781 | 
 1782 |         // Collect stats
 1783 |         let id = schema.field("boolean").unwrap().id;
 1784 |         let builder = collector.get_builder(id).unwrap();
 1785 |         builder.append(StatisticsRow {
 1786 |             null_count: 0,
 1787 |             min_value: ScalarValue::Boolean(Some(false)),
 1788 |             max_value: ScalarValue::Boolean(Some(true)),
 1789 |         });
 1790 |         let id = schema.field("binary").unwrap().id;
 1791 |         let builder = collector.get_builder(id).unwrap();
 1792 |         builder.append(StatisticsRow {
 1793 |             null_count: 0,
 1794 |             min_value: ScalarValue::Binary(None),
 1795 |             max_value: ScalarValue::Binary(None),
 1796 |         });
 1797 |         let id = schema.field("large_binary").unwrap().id;
 1798 |         let builder = collector.get_builder(id).unwrap();
 1799 |         builder.append(StatisticsRow {
 1800 |             null_count: 0,
 1801 |             min_value: ScalarValue::LargeBinary(None),
 1802 |             max_value: ScalarValue::LargeBinary(None),
 1803 |         });
 1804 |         let id = schema.field("string").unwrap().id;
 1805 |         let builder = collector.get_builder(id).unwrap();
 1806 |         builder.append(StatisticsRow {
 1807 |             null_count: 0,
 1808 |             min_value: ScalarValue::Utf8(None),
 1809 |             max_value: ScalarValue::Utf8(None),
 1810 |         });
 1811 |         let id = schema.field("large_string").unwrap().id;
 1812 |         let builder = collector.get_builder(id).unwrap();
 1813 |         builder.append(StatisticsRow {
 1814 |             null_count: 0,
 1815 |             min_value: ScalarValue::LargeUtf8(None),
 1816 |             max_value: ScalarValue::LargeUtf8(None),
 1817 |         });
 1818 | 
 1819 |         let expected_schema = ArrowSchema::new(vec![
 1820 |             ArrowField::new(
 1821 |                 "0",
 1822 |                 DataType::Struct(ArrowFields::from(vec![
 1823 |                     ArrowField::new("null_count", DataType::Int64, false),
 1824 |                     ArrowField::new("min_value", DataType::Boolean, true),
 1825 |                     ArrowField::new("max_value", DataType::Boolean, true),
 1826 |                 ])),
 1827 |                 false,
 1828 |             ),
 1829 |             ArrowField::new(
 1830 |                 "1",
 1831 |                 DataType::Struct(ArrowFields::from(vec![
 1832 |                     ArrowField::new("null_count", DataType::Int64, false),
 1833 |                     ArrowField::new("min_value", DataType::Binary, true),
 1834 |                     ArrowField::new("max_value", DataType::Binary, true),
 1835 |                 ])),
 1836 |                 false,
 1837 |             ),
 1838 |             ArrowField::new(
 1839 |                 "2",
 1840 |                 DataType::Struct(ArrowFields::from(vec![
 1841 |                     ArrowField::new("null_count", DataType::Int64, false),
 1842 |                     ArrowField::new("min_value", DataType::LargeBinary, true),
 1843 |                     ArrowField::new("max_value", DataType::LargeBinary, true),
 1844 |                 ])),
 1845 |                 false,
 1846 |             ),
 1847 |             ArrowField::new(
 1848 |                 "3",
 1849 |                 DataType::Struct(ArrowFields::from(vec![
 1850 |                     ArrowField::new("null_count", DataType::Int64, false),
 1851 |                     ArrowField::new("min_value", DataType::Utf8, true),
 1852 |                     ArrowField::new("max_value", DataType::Utf8, true),
 1853 |                 ])),
 1854 |                 false,
 1855 |             ),
 1856 |             ArrowField::new(
 1857 |                 "4",
 1858 |                 DataType::Struct(ArrowFields::from(vec![
 1859 |                     ArrowField::new("null_count", DataType::Int64, false),
 1860 |                     ArrowField::new("min_value", DataType::LargeUtf8, true),
 1861 |                     ArrowField::new("max_value", DataType::LargeUtf8, true),
 1862 |                 ])),
 1863 |                 false,
 1864 |             ),
 1865 |         ]);
 1866 | 
 1867 |         let none_str_vec: Vec<Option<&str>> = vec![None];
 1868 |         let expected_batch = RecordBatch::try_new(
 1869 |             Arc::new(expected_schema.clone()),
 1870 |             vec![
 1871 |                 Arc::new(StructArray::from(vec![
 1872 |                     (
 1873 |                         Arc::new(ArrowField::new("null_count", DataType::Int64, false)),
 1874 |                         Arc::new(Int64Array::from(vec![0])) as ArrayRef,
 1875 |                     ),
 1876 |                     (
 1877 |                         Arc::new(ArrowField::new("min_value", DataType::Boolean, true)),
 1878 |                         Arc::new(BooleanArray::from(vec![false])) as ArrayRef,
 1879 |                     ),
 1880 |                     (
 1881 |                         Arc::new(ArrowField::new("max_value", DataType::Boolean, true)),
 1882 |                         Arc::new(BooleanArray::from(vec![true])) as ArrayRef,
 1883 |                     ),
 1884 |                 ])),
 1885 |                 Arc::new(StructArray::from(vec![
 1886 |                     (
 1887 |                         Arc::new(ArrowField::new("null_count", DataType::Int64, false)),
 1888 |                         Arc::new(Int64Array::from(vec![0])) as ArrayRef,
 1889 |                     ),
 1890 |                     (
 1891 |                         Arc::new(ArrowField::new("min_value", DataType::Binary, true)),
 1892 |                         Arc::new(BinaryArray::from(vec![None])) as ArrayRef,
 1893 |                     ),
 1894 |                     (
 1895 |                         Arc::new(ArrowField::new("max_value", DataType::Binary, true)),
 1896 |                         Arc::new(BinaryArray::from(vec![None])) as ArrayRef,
 1897 |                     ),
 1898 |                 ])),
 1899 |                 Arc::new(StructArray::from(vec![
 1900 |                     (
 1901 |                         Arc::new(ArrowField::new("null_count", DataType::Int64, false)),
 1902 |                         Arc::new(Int64Array::from(vec![0])) as ArrayRef,
 1903 |                     ),
 1904 |                     (
 1905 |                         Arc::new(ArrowField::new("min_value", DataType::LargeBinary, true)),
 1906 |                         Arc::new(LargeBinaryArray::from(vec![None])) as ArrayRef,
 1907 |                     ),
 1908 |                     (
 1909 |                         Arc::new(ArrowField::new("max_value", DataType::LargeBinary, true)),
 1910 |                         Arc::new(LargeBinaryArray::from(vec![None])) as ArrayRef,
 1911 |                     ),
 1912 |                 ])),
 1913 |                 Arc::new(StructArray::from(vec![
 1914 |                     (
 1915 |                         Arc::new(ArrowField::new("null_count", DataType::Int64, false)),
 1916 |                         Arc::new(Int64Array::from(vec![0])) as ArrayRef,
 1917 |                     ),
 1918 |                     (
 1919 |                         Arc::new(ArrowField::new("min_value", DataType::Utf8, true)),
 1920 |                         Arc::new(StringArray::from(none_str_vec.clone())) as ArrayRef,
 1921 |                     ),
 1922 |                     (
 1923 |                         Arc::new(ArrowField::new("max_value", DataType::Utf8, true)),
 1924 |                         Arc::new(StringArray::from(none_str_vec.clone())) as ArrayRef,
 1925 |                     ),
 1926 |                 ])),
 1927 |                 Arc::new(StructArray::from(vec![
 1928 |                     (
 1929 |                         Arc::new(ArrowField::new("null_count", DataType::Int64, false)),
 1930 |                         Arc::new(Int64Array::from(vec![0])) as ArrayRef,
 1931 |                     ),
 1932 |                     (
 1933 |                         Arc::new(ArrowField::new("min_value", DataType::LargeUtf8, true)),
 1934 |                         Arc::new(LargeStringArray::from(none_str_vec.clone())) as ArrayRef,
 1935 |                     ),
 1936 |                     (
 1937 |                         Arc::new(ArrowField::new("max_value", DataType::LargeUtf8, true)),
 1938 |                         Arc::new(LargeStringArray::from(none_str_vec.clone())) as ArrayRef,
 1939 |                     ),
 1940 |                 ])),
 1941 |             ],
 1942 |         )
 1943 |         .unwrap();
 1944 | 
 1945 |         let batch = collector.finish().unwrap();
 1946 |         assert_eq!(batch.schema().as_ref(), &expected_schema);
 1947 |         assert_eq!(batch, expected_batch);
 1948 |     }
 1949 | 
 1950 |     // Property 1: for all values, if an array is entirely that value then it
 1951 |     // should become both the min and max. There are some exceptions:
 1952 |     // * NaN, null are ignored for min and max
 1953 |     // * string / binary more than 64 bytes are truncated.
 1954 |     fn assert_min_max_constant_property(
 1955 |         value: ScalarValue,
 1956 |         with_nulls: bool,
 1957 |     ) -> std::result::Result<(), TestCaseError> {
 1958 |         let array_scalar = value.to_scalar().unwrap();
 1959 |         let (array, _) = array_scalar.get();
 1960 |         let array = make_array(array.to_data());
 1961 | 
 1962 |         let array = if with_nulls {
 1963 |             let nulls = new_null_array(array.data_type(), 1);
 1964 |             interleave(&[&array, &nulls], &[(1, 0), (0, 0)]).unwrap()
 1965 |         } else {
 1966 |             array
 1967 |         };
 1968 | 
 1969 |         let stats = collect_statistics(&[&array]);
 1970 |         prop_assert_eq!(
 1971 |             stats,
 1972 |             StatisticsRow {
 1973 |                 null_count: if with_nulls { 1 } else { 0 },
 1974 |                 min_value: value.clone(),
 1975 |                 max_value: value,
 1976 |             },
 1977 |             "Statistics are wrong for input data: {:?}",
 1978 |             array
 1979 |         );
 1980 |         Ok(())
 1981 |     }
 1982 | 
 1983 |     #[test]
 1984 |     fn test_min_max_constant_property() {
 1985 |         let values = [
 1986 |             ScalarValue::Boolean(Some(true)),
 1987 |             ScalarValue::Boolean(Some(false)),
 1988 |             ScalarValue::Int8(Some(1)),
 1989 |             ScalarValue::Int16(Some(1)),
 1990 |             ScalarValue::Int32(Some(1)),
 1991 |             ScalarValue::Int64(Some(1)),
 1992 |             ScalarValue::UInt8(Some(1)),
 1993 |             ScalarValue::UInt16(Some(1)),
 1994 |             ScalarValue::UInt32(Some(1)),
 1995 |             ScalarValue::UInt64(Some(1)),
 1996 |             ScalarValue::Float32(Some(1.0)),
 1997 |             ScalarValue::Float32(Some(f32::INFINITY)),
 1998 |             ScalarValue::Float32(Some(f32::NEG_INFINITY)),
 1999 |             ScalarValue::Float64(Some(1.0)),
 2000 |             ScalarValue::Float64(Some(f64::INFINITY)),
 2001 |             ScalarValue::Float64(Some(f64::NEG_INFINITY)),
 2002 |             ScalarValue::Utf8(Some("foo".to_string())),
 2003 |             ScalarValue::Utf8(Some("a".repeat(BINARY_PREFIX_LENGTH))),
 2004 |             ScalarValue::Binary(Some(vec![0_u8; BINARY_PREFIX_LENGTH])),
 2005 |         ];
 2006 | 
 2007 |         for value in values {
 2008 |             assert_min_max_constant_property(value.clone(), false).unwrap();
 2009 |             assert_min_max_constant_property(value.clone(), true).unwrap();
 2010 |         }
 2011 |     }
 2012 | 
 2013 |     proptest::proptest! {
 2014 |         #[test]
 2015 |         fn test_min_max_constant_property_timestamp(
 2016 |             timezone_index in 0..3_usize,
 2017 |             timeunit_index in 0..4_usize,
 2018 |         ) {
 2019 |             let value = Some(42);
 2020 |             // Check different timezones to validate we propagate them.
 2021 |             let timezones = [None, Some("UTC".into()), Some("America/New_York".into())];
 2022 |             let timeunits = [TimeUnit::Second, TimeUnit::Millisecond, TimeUnit::Microsecond, TimeUnit::Nanosecond];
 2023 | 
 2024 |             let timezone = timezones[timezone_index].clone();
 2025 |             let timeunit = timeunits[timeunit_index];
 2026 |             let value = match timeunit {
 2027 |                 TimeUnit::Second => ScalarValue::TimestampSecond(value, timezone),
 2028 |                 TimeUnit::Millisecond => ScalarValue::TimestampMillisecond(value, timezone),
 2029 |                 TimeUnit::Microsecond => ScalarValue::TimestampMicrosecond(value, timezone),
 2030 |                 TimeUnit::Nanosecond => ScalarValue::TimestampNanosecond(value, timezone),
 2031 |             };
 2032 | 
 2033 |             assert_min_max_constant_property(value.clone(), false)?;
 2034 |             assert_min_max_constant_property(value, true)?;
 2035 |         }
 2036 |     }
 2037 | 
 2038 |     // Property 2: The min and max should always be less than / greater than
 2039 |     // all values in the array respectively.
 2040 |     fn assert_min_max_ordering_float<F: ArrowPrimitiveType>()
 2041 |     -> std::result::Result<(), TestCaseError>
 2042 |     where
 2043 |         F::Native: Float,
 2044 |     {
 2045 |         let values = vec![
 2046 |             F::Native::neg_infinity(),
 2047 |             F::Native::infinity(),
 2048 |             F::Native::zero(),
 2049 |             F::Native::neg_zero(),
 2050 |             F::Native::one(),
 2051 |             F::Native::nan(),
 2052 |             F::Native::min_value(),
 2053 |             F::Native::max_value(),
 2054 |         ];
 2055 | 
 2056 |         let mut runner = proptest::test_runner::TestRunner::default();
 2057 | 
 2058 |         // Choose random subset of these values
 2059 |         let all_options = values.len();
 2060 |         let subset = proptest::sample::subsequence(values, (0, all_options));
 2061 | 
 2062 |         // Turn into an array and compute statistics
 2063 |         let results = subset.prop_map(|subset| {
 2064 |             let array = Arc::new(PrimitiveArray::<F>::from_iter_values(subset.clone())) as ArrayRef;
 2065 |             let statistics = collect_statistics(&[&array]);
 2066 |             (subset, statistics)
 2067 |         });
 2068 | 
 2069 |         runner.run(&results, |(subset, stats)| {
 2070 |             // Assert min is <= all values
 2071 |             prop_assert!(subset.iter().all(|val| val.is_nan()
 2072 |                 || stats.min_value
 2073 |                     <= ScalarValue::new_primitive::<F>(Some(*val), &F::DATA_TYPE).unwrap()));
 2074 | 
 2075 |             // Assert max is >= all values
 2076 |             prop_assert!(subset.iter().all(|val| val.is_nan()
 2077 |                 || stats.max_value
 2078 |                     >= ScalarValue::new_primitive::<F>(Some(*val), &F::DATA_TYPE).unwrap()));
 2079 | 
 2080 |             // If array is empty, assert min and max are -inf, +inf, respectively
 2081 |             if subset.is_empty() {
 2082 |                 prop_assert_eq!(
 2083 |                     stats.min_value,
 2084 |                     ScalarValue::new_primitive::<F>(Some(F::Native::neg_infinity()), &F::DATA_TYPE)
 2085 |                         .unwrap()
 2086 |                 );
 2087 |                 prop_assert_eq!(
 2088 |                     stats.max_value,
 2089 |                     ScalarValue::new_primitive::<F>(Some(F::Native::infinity()), &F::DATA_TYPE)
 2090 |                         .unwrap()
 2091 |                 );
 2092 |             }
 2093 | 
 2094 |             Ok(())
 2095 |         })?;
 2096 | 
 2097 |         Ok(())
 2098 |     }
 2099 | 
 2100 |     #[test]
 2101 |     fn test_min_max_ordering_float() {
 2102 |         assert_min_max_ordering_float::<Float32Type>().unwrap();
 2103 |         assert_min_max_ordering_float::<Float64Type>().unwrap();
 2104 |     }
 2105 | 
 2106 |     proptest::proptest! {
 2107 |         #[test]
 2108 |         fn test_min_max_ordering_string(values in proptest::collection::vec(".{0, 100}", 0..10)) {
 2109 |             let array = Arc::new(StringArray::from(values.clone())) as ArrayRef;
 2110 |             let statistics = collect_statistics(&[&array]);
 2111 | 
 2112 |             // If array is empty, assert min and max are null
 2113 |             if array.is_empty() {
 2114 |                 prop_assert_eq!(&statistics.min_value, &ScalarValue::Utf8(None));
 2115 |                 prop_assert_eq!(&statistics.max_value, &ScalarValue::Utf8(None));
 2116 |             }
 2117 | 
 2118 |             // Assert min is <= all values
 2119 |             prop_assert!(values.iter().all(|val| statistics.min_value <= ScalarValue::Utf8(Some(val.clone()))));
 2120 | 
 2121 |             // Assert max is >= all values, or is null
 2122 |             prop_assert!(statistics.max_value.is_null() || values.iter().all(|val| statistics.max_value >= ScalarValue::Utf8(Some(val.clone()))));
 2123 | 
 2124 |             // Assert min and max are less than BINARY_PREFIX_LENGTH
 2125 |             match &statistics.min_value {
 2126 |                 ScalarValue::Utf8(Some(min)) => prop_assert!(min.len() <= BINARY_PREFIX_LENGTH),
 2127 |                 ScalarValue::Utf8(None) => (),
 2128 |                 _ => unreachable!(),
 2129 |             }
 2130 |             match &statistics.max_value {
 2131 |                 ScalarValue::Utf8(Some(max)) => prop_assert!(max.len() <= BINARY_PREFIX_LENGTH),
 2132 |                 ScalarValue::Utf8(None) => (),
 2133 |                 _ => unreachable!(),
 2134 |             }
 2135 |         }
 2136 |     }
 2137 | 
 2138 |     proptest::proptest! {
 2139 |         #[test]
 2140 |         fn test_min_max_ordering_binary(values in proptest::collection::vec(proptest::collection::vec(0..u8::MAX, 0..100), 0..10)) {
 2141 |             let array = Arc::new(BinaryArray::from_iter_values(values.clone())) as ArrayRef;
 2142 |             let statistics = collect_statistics(&[&array]);
 2143 | 
 2144 |             // If array is empty, assert min and max are null
 2145 |             if array.is_empty() {
 2146 |                 prop_assert_eq!(&statistics.min_value, &ScalarValue::Binary(None));
 2147 |                 prop_assert_eq!(&statistics.max_value, &ScalarValue::Binary(None));
 2148 |             }
 2149 | 
 2150 |             // Assert min is <= all values
 2151 |             prop_assert!(values.iter().all(|val| statistics.min_value <= ScalarValue::Binary(Some(val.clone()))));
 2152 | 
 2153 |             // Assert max is >= all values
 2154 |             prop_assert!(statistics.max_value.is_null() || values.iter().all(|val| statistics.max_value >= ScalarValue::Binary(Some(val.clone()))));
 2155 | 
 2156 |             // Assert min and max are less than BINARY_PREFIX_LENGTH
 2157 |             match &statistics.min_value {
 2158 |                 ScalarValue::Binary(Some(min)) => prop_assert!(min.len() <= BINARY_PREFIX_LENGTH),
 2159 |                 ScalarValue::Binary(None) => (),
 2160 |                 _ => unreachable!(),
 2161 |             }
 2162 |             match &statistics.max_value {
 2163 |                 ScalarValue::Binary(Some(max)) => prop_assert!(max.len() <= BINARY_PREFIX_LENGTH),
 2164 |                 ScalarValue::Binary(None) => (),
 2165 |                 _ => unreachable!(),
 2166 |             }
 2167 |         }
 2168 |     }
 2169 | 
 2170 |     proptest::proptest! {
 2171 |         #[test]
 2172 |         fn test_min_max_ordering_fsb(values in proptest::collection::vec(proptest::collection::vec(0..u8::MAX, 100), 0..10)) {
 2173 |             let array = if values.is_empty() {
 2174 |                 // FixedSizeBinary constructors doesn't handle empty inputs.
 2175 |                 new_empty_array(&DataType::FixedSizeBinary(100))
 2176 |             } else {
 2177 |                 Arc::new(FixedSizeBinaryArray::try_from_iter(values.iter()).unwrap()) as ArrayRef
 2178 |             };
 2179 | 
 2180 |             let statistics = collect_statistics(&[&array]);
 2181 | 
 2182 |             // If array is empty, assert min and max are null
 2183 |             if array.is_empty() {
 2184 |                 prop_assert_eq!(&statistics.min_value, &ScalarValue::FixedSizeBinary(100, None));
 2185 |                 prop_assert_eq!(&statistics.max_value, &ScalarValue::FixedSizeBinary(100, None));
 2186 |             }
 2187 | 
 2188 |             // Assert min is <= all values
 2189 |             prop_assert!(values.iter().all(|val| statistics.min_value <= ScalarValue::FixedSizeBinary(100, Some(val.clone()))));
 2190 | 
 2191 |             // Assert max is >= all values
 2192 |             prop_assert!(statistics.max_value.is_null() || values.iter().all(|val| statistics.max_value >= ScalarValue::FixedSizeBinary(100, Some(val.clone()))));
 2193 | 
 2194 |             // Assert min and max are less than BINARY_PREFIX_LENGTH
 2195 |             match &statistics.min_value {
 2196 |                 ScalarValue::FixedSizeBinary(100, Some(min)) => prop_assert!(min.len() <= BINARY_PREFIX_LENGTH),
 2197 |                 ScalarValue::FixedSizeBinary(100, None) => (),
 2198 |                 _ => unreachable!(),
 2199 |             }
 2200 |             match &statistics.max_value {
 2201 |                 ScalarValue::FixedSizeBinary(100, Some(max)) => prop_assert!(max.len() <= BINARY_PREFIX_LENGTH),
 2202 |                 ScalarValue::FixedSizeBinary(100, None) => (),
 2203 |                 _ => unreachable!(),
 2204 |             }
 2205 |         }
 2206 |     }
 2207 | 
 2208 |     #[test]
 2209 |     fn test_boolean_statistics_multi_array() {
 2210 |         use arrow_array::BooleanArray;
 2211 |         use std::sync::Arc;
 2212 | 
 2213 |         // Array 1: [True, False, True, None, None] - 2 nulls
 2214 |         let bool_array1 = BooleanArray::from(vec![Some(true), Some(false), Some(true), None, None]);
 2215 |         let array1_ref: ArrayRef = Arc::new(bool_array1);
 2216 | 
 2217 |         // Array 2: [False, True, False, None, None] - 2 nulls
 2218 |         let bool_array2 =
 2219 |             BooleanArray::from(vec![Some(false), Some(true), Some(false), None, None]);
 2220 |         let array2_ref: ArrayRef = Arc::new(bool_array2);
 2221 | 
 2222 |         // Test individual arrays first
 2223 |         let stats1 = collect_statistics(&[&array1_ref]);
 2224 |         let stats2 = collect_statistics(&[&array2_ref]);
 2225 | 
 2226 |         assert_eq!(stats1.null_count, 2, "First array should have 2 nulls");
 2227 |         assert_eq!(stats2.null_count, 2, "Second array should have 2 nulls");
 2228 | 
 2229 |         let array_refs: Vec<&ArrayRef> = vec![&array1_ref, &array2_ref];
 2230 |         let combined_stats = collect_statistics(&array_refs);
 2231 | 
 2232 |         assert_eq!(
 2233 |             combined_stats.null_count, 4,
 2234 |             "Combined statistics should have null_count=4 (2+2), got {}",
 2235 |             combined_stats.null_count
 2236 |         );
 2237 | 
 2238 |         assert_eq!(
 2239 |             combined_stats.min_value,
 2240 |             ScalarValue::Boolean(Some(false)),
 2241 |             "Min value should be false"
 2242 |         );
 2243 |         assert_eq!(
 2244 |             combined_stats.max_value,
 2245 |             ScalarValue::Boolean(Some(true)),
 2246 |             "Max value should be true"
 2247 |         );
 2248 |     }
 2249 | }
``````
