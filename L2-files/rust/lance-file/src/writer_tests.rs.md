> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../V21-PROTOCOL.md).

# rust/lance-file/src/writer_tests.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `ecd0ba1cbe484fe7aa1e76a247c0ed0e067c4114e3077f06f4521e95e7350823`. Reviewed physical lines: 1-1976.

[Module](../../../../L1-modules/archive/rust-lance-file-writer-tests.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Private cfg(test) module nested inside writer::writer_tests through the explicit path declaration in writer.rs. Contains shared local helpers and writer/reader/encoder integration oracles. Tests cover unequal root-field lengths, JSON/type preparation, V2_0 struct validity, page limits, compression descriptions, large-value reads and metadata spill. No production public API is defined here. (rust/lance-file/src/writer_tests.rs:1-1976)

## Complete range analysis

### Lines 1-15

SPDX, cfg(test) and private nested tests module. Parent writer.rs loads this file as writer_tests, so the lexical module path is lance_file::writer::writer_tests::tests (rust/lance-file/src/writer.rs:292-294). Imports HashMap/Arc plus reader options/projection/encoding display, FsFixture, exact versions and writer options/type mismatch/environment constant. (rust/lance-file/src/writer_tests.rs:1-15)

### Lines 16-44

Imports Arrow builders/arrays/buffers and schema aliases, JSON extension conversion, cache/core schema/temp path, data generation, compression parameters and packed-struct metadata, decoder plugins, encoder factories/buffers/RepDef, object store/writer/cache-size and rstest. These are test dependencies; imports do not establish runtime registration. (rust/lance-file/src/writer_tests.rs:16-44)

### Lines 45-71

Three private synchronous helpers forward exact writer construction, V2_1 compression-aware construction with Into<FileWriter>, and exact reader projection by names. No extra validation or policy; Results propagate. Complete signatures are retained in the source appendix and symbol catalog. (rust/lance-file/src/writer_tests.rs:45-71)

### Lines 72-100

test_basic_write uses local TempObjFile/ObjectStore, score Float64 datagen configured as 1,000 rows per batch and 10 batches, explicit core schema and default V2_1 writer. Await every write, add foo=bar and finish; no contents, metadata or summary assertion. Comment defers content tests to reader.rs. Generator parameter semantics are confirmed by rust/lance-datagen/src/generator.rs:2360-2373. (rust/lance-file/src/writer_tests.rs:72-100)

### Lines 101-125

Rstest V2_1/V2_2/V2_3 negative-dictionary/runt-tail fixture computes 9,216 Int64 values using wrapping u64 multiply by 2,654,435,761, shift7, modulo1600 then subtract800. One batch is written/read through public testing helpers, concatenated using read[0] schema, and compared exactly to input. No assertion proves a specific dictionary encoding or runt-page shape; empty output would panic at index0. (rust/lance-file/src/writer_tests.rs:101-125)

### Lines 126-154

test_write_empty configures zero rows and zero batches with a score field, constructs explicit V2_1 writer, loops over the empty reader, adds metadata and finishes. This covers completion without any write_batch call, not lazy no-schema finish, an empty schema, a decoded empty file or a summary row assertion. (rust/lance-file/src/writer_tests.rs:126-154)

### Lines 155-188

read_int32_column creates a one-name projection, awaits read_stream_projected with supplied selection, batch1024/readahead16/no filter, collects all batches, then downcasts column0 and collects nullable Int32 values. All failures unwrap; helper retains complete output and intermediate per-batch vectors. Its comments explain consuming unequal files through separate columns/equal-length projections. (rust/lance-file/src/writer_tests.rs:155-188)

### Lines 189-216

Unequal-length writer test has only V2_0/V2_1 values. Three nullable Int32 roots a,b,c, explicit schema/default options/local FsFixture. Introductory no-shared-global-counter wording describes independently advancing field lengths; writers still have an aggregate file row count. (rust/lance-file/src/writer_tests.rs:189-216)

### Lines 217-256

Write a=[1,2,3], b=[10], then append a=[4,5]; send empty arrays to already-written a and untouched c. Finish summary must be5, reopen unknown-size/no cache/default plugins/options, and require reader total5 plus per-root counts5,1,0. Invalid index3 only asserts is_err, not error variant/message. These checks distinguish max logical length and zero-length unwritten root. (rust/lance-file/src/writer_tests.rs:217-256)

### Lines 257-280

Read explicit ranges a0..5 and b0..1 through helper; assert exact nullable values1..5 and10. No read of empty c is asserted in this test. (rust/lance-file/src/writer_tests.rs:257-280)

### Lines 281-296

Take a at increasing indices[0,2,4] and require[1,3,5]. Comment says take requires strictly increasing indices; this fixture contains no duplicate, descending or invalid take case, so it does not independently prove rejection of those inputs. (rust/lance-file/src/writer_tests.rs:281-296)

### Lines 297-329

Async projection test uses V2_0/V2_1 and roots a,b,c. Documentation claims bounded reads are valid when every projected column covers the range, but the later explicit common-prefix assertion rejects unequal-length projected roots; preserve this contradiction. Fixture creates default explicit writer with a/b length5 and c length1. (rust/lance-file/src/writer_tests.rs:297-329)

### Lines 330-357

Write a=[1..5], b=[6..10], c=[100], finish, and reopen unknown-size/no-cache/default plugins/options. No summary assertion here; these unequal lengths drive the projection oracle. (rust/lance-file/src/writer_tests.rs:330-357)

### Lines 358-390

Local read closure constructs projection then returns either an opening error or a try_collect error in the same Result<Vec<RecordBatch>>. Thus callers cannot distinguish an upfront failure from one encountered while collecting. col_values downcasts chosen Int32 column in each batch and allocates nullable value vectors. (rust/lance-file/src/writer_tests.rs:358-390)

### Lines 391-420

Equal-length [a,b] RangeFull must decode exactly1..5 and6..10. Unequal [a,c] RangeFull error text must contain a=5 and c=1, and common-prefix Range(0..1) must also error. The nearby comment asserts rejection before any batch, but this collecting helper does not test that timing directly. No error-variant assertion. (rust/lance-file/src/writer_tests.rs:391-420)

### Lines 421-449

Single-column c RangeFull returns[100], a RangeFull returns1..5. a RangeFrom2 returns3..5, c RangeFrom0 returns100, a RangeTo3 returns1..3. a RangeTo6 and c RangeFrom2 must error, with no variant/text or equality-at-end case. Resolving against projected-root length is the intended oracle, independent of larger file total. (rust/lance-file/src/writer_tests.rs:421-449)

### Lines 450-480

Nested projection regression only V2_0/V2_1. Comments motivate partitioning flattened physical-column indices by top-level fields and using root lengths. Schema is nullable scalar a, nullable struct s{x,y:Int32 nullable}, nullable list lst<item:Int32 nullable>. The asserted outcome later is top-level row count, not physical partition structure. (rust/lance-file/src/writer_tests.rs:450-480)

### Lines 481-511

Build a=[1,2,3], s.x=[10,20,30], s.y=[11,21,31], and lists[[1,2],[3],[4,5,6]], giving3 root rows but6 items. All fixture values are valid despite nullable fields. Write one rectangular batch and finish with default options. (rust/lance-file/src/writer_tests.rs:481-511)

### Lines 512-553

Open the nested file, then read RangeFull for [a,s,lst], [a,lst], [a,s] with batch1024/readahead16/no filter. Sum each result rows and assert3 only. No value, null, nested-shape, exact batch-count or single-list projection assertion. (rust/lance-file/src/writer_tests.rs:512-553)

### Lines 554-574

V2_1-only validation fixture creates lazy writer without a prior batch; write_column cannot infer schema, and error string must contain explicit schema. This does not show that a lazy writer initialized by a prior batch is rejected. No error-variant check. (rust/lance-file/src/writer_tests.rs:554-574)

### Lines 575-611

Create explicit V2_1 roots a nonnullable/b nullable. Index5 must error with characters5 and2 present; then writing [Some1,None,Some3] to a must error containing non-null. Reuse the same writer, but never finish or verify prior rejection state. String-only assertions are weaker than structured validation. (rust/lance-file/src/writer_tests.rs:575-611)

### Lines 612-621

Private field_type_mismatch consumes core Error, requires InvalidInput, downcasts boxed source to FieldTypeMismatch and clones it. Wrong variant or downcast panics with contextual message. It enforces structured error identity for the following JSON tests. (rust/lance-file/src/writer_tests.rs:612-621)

### Lines 622-651

Unconverted-JSON matrix crosses top-level/nested-struct cases with all four V2 versions. Define Utf8 field j with Arrow JSON extension, one text value {"a":1}, optional struct wrapper s, and convert the same text through JsonArray into Lance JSONB storage. Conversion errors unwrap. (rust/lance-file/src/writer_tests.rs:622-651)

### Lines 652-674

batch_of optionally wraps the provided values in a one-child StructArray and matching schema. Build converted JSONB batch and unconverted Arrow-JSON batch; derive writer schema from converted batch. Create default exact writer on a local fixture. (rust/lance-file/src/writer_tests.rs:652-674)

### Lines 675-689

Write converted batch successfully, then reject different unconverted batch through structured mismatch helper. Require field path j or s.j, expected LargeBinary/Lance JSON extension, actual Utf8/Arrow JSON extension. Finish summary must remain1. Comment claims no encoder saw rejected batch; row count alone does not independently observe every encoder mutation, though analyzed preflight implementation supplies that ordering. (rust/lance-file/src/writer_tests.rs:675-689)

### Lines 690-719

Column mismatch test covers all four V2 versions with a JSONB j schema and bare Utf8 ArrayRef. write_column must yield structured mismatch, field path j, expected LargeBinary, actual Utf8 with no extension name. No successful column write, finish or persisted data check in this test. (rust/lance-file/src/writer_tests.rs:690-719)

### Lines 720-730

struct_array helper constructs two Int32 child arrays[10,99,30] and[11,98,31] under supplied ArrowFields and optional parent validity. Child arrays contain no nulls here. Arrow constructor can panic on inconsistent caller-provided fields/null length; helper has no Result. (rust/lance-file/src/writer_tests.rs:720-730)

### Lines 731-762

V2_0 atomic-rejection fixture places writer roots[id,s] but input roots[s,id], with struct children a,b and parent validity[true,false,true]. Invalid batch has IDs1,2,3. Name-selected preflight is the target; field order differs deliberately so incorrect positional validation/early encoder mutation can be detected. (rust/lance-file/src/writer_tests.rs:731-762)

### Lines 763-789

Create default V2_0 writer, reject invalid batch as InvalidInput with struct validity,2.0,1 null value substrings. Then write valid all-valid struct batch, same input order and IDs4,5,6, and finish. No explicit abort or writer replacement occurs between rejected and accepted input. (rust/lance-file/src/writer_tests.rs:763-789)

### Lines 790-816

Reopen rejection-recovery output and project id RangeFull; require exactly[4,5,6]. This catches contamination of the preceding ID encoder by rejected input. It does not compare struct values, raw bytes or generic rollback after arbitrary IO/encoding failure. (rust/lance-file/src/writer_tests.rs:790-816)

### Lines 817-851

V2_0 list-of-struct matrix: slice(offset1,len1,no-null-parent) succeeds; empty slice(1,0) succeeds; offset0,len2 with first list null succeeds; selected first null struct(0,1,no-null-parent) fails. Backing struct validity is[false,true,true], list offsets[0,1,2,3], optional list validity same pattern. Only logically selected, non-null parent values should trigger rejection. (rust/lance-file/src/writer_tests.rs:817-851)

### Lines 852-883

Wrap sliced list in nullable items schema, create default V2_0 writer and call write_batch. Failure case checks InvalidInput and struct validity then returns without finish. Success cases unwrap and finish, without reading values or asserting summary counts. This tests acceptance/rejection, not reconstruction under parent nulls. (rust/lance-file/src/writer_tests.rs:852-883)

### Lines 884-916

V2_0 fixed-size-list matrix succeeds with masked child null, succeeds with masked nonnullable-child null, and rejects selected child null. Struct child a is nonnullable only in the second case, containing[None,99,30] beneath parent struct validity[false,true,true]; b is always valid. Other cases use struct_array with first struct null. (rust/lance-file/src/writer_tests.rs:884-916)

### Lines 917-953

Fixed-size-list width1 uses struct items and optional parent validity[false,true,true]; batch also has nonnullable id=[1,2,3]. Default V2_0 writer must reject selected case as InvalidInput/struct validity or finish successfully for masked cases. No decoded-value oracle, no width>1 or sliced FSL case. (rust/lance-file/src/writer_tests.rs:917-953)

### Lines 954-984

Public V2_0 encoding-strategy test has ordinary versus packed struct cases. Packed marks s metadata with PACKED_STRUCT_META_KEY=true. Same three-row struct has exactly one parent null, despite nullable schema. Construct core Arc schema and exact V2_0 strategy, bypassing FileWriter. (rust/lance-file/src/writer_tests.rs:954-984)

### Lines 985-1007

Construct BatchEncoder with default EncodingOptions, then directly call first field encoder maybe_encode with original array, OutOfLineBuffers(0,64), fresh RepDef, row0/count3. Require immediate Result::Err, InvalidInput and struct validity; if Ok, panic even if returned tasks might later fail. No task execution or prepare_array call precedes this direct entry. (rust/lance-file/src/writer_tests.rs:985-1007)

### Lines 1008-1034

Independently create field encoder via strategy, default ColumnIndexSequence and FieldEncodingContext carrying strategy/options/root metadata. Direct maybe_encode receives fresh buffers and same rows; require immediate InvalidInput/struct validity. This guards factory access as well as BatchEncoder access. (rust/lance-file/src/writer_tests.rs:1008-1034)

### Lines 1035-1050

Await public encode_batch on original invalid struct, requiring InvalidInput and message substrings struct validity,2.0,1 null value. Combined two packed modes times three entry paths test immediate/wrapped validation, not a successful embedded decode. (rust/lance-file/src/writer_tests.rs:1035-1050)

### Lines 1051-1083

Synchronous V2_0 primitive FSL preparation test creates Float32 width2,6 zero values,3 parents with middle null. Build field encoder through strategy/context and call prepare_array; Arc::ptr_eq requires exact original Arc allocation returned. It does not prove zero allocations inside preparation or test encode/decode. (rust/lance-file/src/writer_tests.rs:1051-1083)

### Lines 1084-1118

Blocking unequal-length matrix only V2_0/V2_1, roots a length5/c length1. Create default writer, write both separately, finish. Documentation promises same validation as async; later assertions distinguish constructor failure from collected batch row count. (rust/lance-file/src/writer_tests.rs:1084-1118)

### Lines 1119-1155

Open FileReader in Arc, clone for spawn_blocking, build projection c, and call read_stream_projected_blocking RangeFull/batch1024/Some(projection)/no filter. Collect Result<Vec<RecordBatch>>, await join and assert total rows1. Values are not compared and read readahead is not an argument here. (rust/lance-file/src/writer_tests.rs:1119-1155)

### Lines 1156-1177

In a second spawn_blocking, call blocking read constructor on unequal[a,c] RangeFull and return is_err directly. Assert true after join: unlike async collecting closure, this oracle directly checks constructor rejection. No error type/message or bounded-range test on blocking path. (rust/lance-file/src/writer_tests.rs:1156-1177)

### Lines 1178-1207

Rectangular regression is V2_1 only: one batch a=[1,2,3],b=[4,5,6] under nullable roots. Finish summary must be3. Comment calls this backwards compatibility, but fixture is newly written current code, not a released historical dataset. (rust/lance-file/src/writer_tests.rs:1178-1207)

### Lines 1208-1225

Reopen rectangular output using default reader/no cache and require column_num_rows0==3 and1==3. No read_stream/value equality or file-size assertion; this is metadata row-count coverage. (rust/lance-file/src/writer_tests.rs:1208-1225)

### Lines 1226-1255

V2_0 explicit max-page fixture uses 1,000,000 nonnull UInt64 values0..1,000,000 and Some(1MiB), default other options. Raw values occupy8,000,000 bytes, not exactly8MiB as comment labels them. Write one batch and finish; default cache budget may also influence chunking. (rust/lance-file/src/writer_tests.rs:1226-1255)

### Lines 1256-1273

Open that path through a fresh FsFixture scheduler, unknown size/default options/plugins/no cache. Read column metadata only; there is no data decoding in the page-limit test. Separate local stores still address the same absolute temp path. (rust/lance-file/src/writer_tests.rs:1256-1273)

### Lines 1274-1297

For every metadata column require nonempty pages; for each page sum recorded buffer_sizes as u64 and require<=1MiB; total page count must be8. This sum excludes padding/metadata/global buffers and does not prove universal hard limits for every encoding or indivisible value. (rust/lance-file/src/writer_tests.rs:1274-1297)

### Lines 1298-1309

assert_zero_max_page_bytes_error requires InvalidInput and exact substring max_page_bytes must be greater than 0, got 0. Helper consumes Error and panics on mismatched oracle. (rust/lance-file/src/writer_tests.rs:1298-1309)

### Lines 1310-1343

Rstest schema_writer/lazy_writer cases use V2_0 generic factories with Some(0). Object created before validation. Lazy construction must succeed then first one-row UInt64 batch fail; explicit construction must return Err. Both use shared structured zero-limit assertion. No finish, file-removal or state-retry checks. (rust/lance-file/src/writer_tests.rs:1310-1343)

### Lines 1344-1365

Direct V2_0 parent create_writer with explicit nonnull UInt64 schema/Some(0) must error and satisfy same helper. This protects direct factory as well as generic facade dispatch. (rust/lance-file/src/writer_tests.rs:1344-1365)

### Lines 1366-1381

Direct V2_1 lazy writer is infallibly created with Some(0), then first UInt64 batch errors via shared helper. No V2_2/V2_3 zero-limit test appears here and this is explicit option zero, not environment zero. (rust/lance-file/src/writer_tests.rs:1366-1381)

### Lines 1382-1402

Current-thread Tokio environment test builds500,000 UInt64 values (4,000,000 raw bytes, approximately not exactly4MiB). Unsafe set_var installs2097152, and max_page_bytes=None selects env. Single-thread runtime does not establish process-wide test serialization; there is no safety rationale, lock, serial attribute or saved prior environment value in this file. (rust/lance-file/src/writer_tests.rs:1382-1402)

### Lines 1403-1431

Create V2_1 default writer with env-selected cap, write/finish, then reopen using a fresh local fixture scheduler/default reader/no cache. Async IO occurs while process-global environment remains changed. Any unwrap failure before final reset skips cleanup. (rust/lance-file/src/writer_tests.rs:1403-1431)

### Lines 1432-1447

For each existing metadata page assert sum(buffer_sizes)<=2MiB, without requiring any page or exact count. Final unsafe set_var writes empty string rather than removing variable or restoring its previous value. No scope guard runs on panic/cancellation. Underlying resolver treats empty string as parse failure/default; this test supplies no error or warning assertion. (rust/lance-file/src/writer_tests.rs:1432-1447)

### Lines 1448-1473

Compression override test uses V2_1 and five nonnullable fields customer_id,product_id,quantity:Int32;price:Float32;description:Utf8. Builder setup/comments propose repetitions, randomness and long Zstd strings, but actual following fixture and configured overrides are narrower. (rust/lance-file/src/writer_tests.rs:1448-1473)

### Lines 1474-1507

For10,000 rows customer_id=i/100 gives100 runs, product_id=i/2000 gives5 runs, quantity is5 every10th row else1 (deterministic, not random), price cycles9.99/19.99/29.99, description is Product N for5 groups (not a long string). Materialize complete arrays/batch. (rust/lance-file/src/writer_tests.rs:1474-1507)

### Lines 1508-1531

CompressionParams adds only wildcard *_id with rle_threshold0.5, BSS Off, compression/level/minichunk absent. Comments explicitly skip Zstd. max_page_bytes=64KiB. No matching-precedence test or compression-ratio assertion follows. (rust/lance-file/src/writer_tests.rs:1508-1531)

### Lines 1532-1569

Write configured V2_1 file, add compression_test=configured_compression, finish; separately write same batch with default compression options and same64KiB page cap. Variable names say no_compression, but no override means defaults, not globally disabled compression. Baseline is never opened or compared; comment allowing larger compressed size is not a measured size assertion. (rust/lance-file/src/writer_tests.rs:1532-1569)

### Lines 1570-1597

Open configured file, assert exact metadata versionV2_1 and schema key/value. Comment says verify data integrity, but no data stream is decoded anywhere in this test. Default comparison file does not participate in these assertions. (rust/lance-file/src/writer_tests.rs:1570-1597)

### Lines 1598-1619

Require nonempty pages for customer_id and product_id only; describe each first page and require substring RLE or Rle. This observes description text, not exact encoded bytes, all pages, nonmatching columns, decoded values or savings. (rust/lance-file/src/writer_tests.rs:1598-1619)

### Lines 1620-1643

Field metadata compression test sets text zstd with level6 and data compression none; id unannotated. Three nonnullable fields and explicit core schema. Metadata clone preserves two text keys; no overriding global parameter is set later. (rust/lance-file/src/writer_tests.rs:1620-1643)

### Lines 1644-1677

Materialize1,000 id values0..999, strings test string N repeated text and data=2*i. Create V2_1 compression-aware writer with empty CompressionParams/default options, write/finish. There is no paired override-versus-metadata precedence matrix. (rust/lance-file/src/writer_tests.rs:1644-1677)

### Lines 1678-1715

Open file, directly index text first page and require describe_encoding contains Zstd; data first page must contain Flat and compression: None. No explicit page-nonempty assertion, level6 check, row/value decode, default id encoding or compressed-size check. (rust/lance-file/src/writer_tests.rs:1678-1715)

### Lines 1716-1740

RLE metadata fixture marks one nonnull Int32 status field with threshold0.9, compression lz4 and BSS off; comments aim to force RLE. Configuration declaration alone does not prove the final payload uses Lz4. (rust/lance-file/src/writer_tests.rs:1716-1740)

### Lines 1741-1767

Build exactly10,000 statuses with3 runs:200 repeated8000,404 repeated1500,500 repeated500. Create V2_1 compression-aware writer with empty parameters/default options, write/finish. The3/10,000 ratio is a fixture statistic, not an independently checked compressor threshold implementation. (rust/lance-file/src/writer_tests.rs:1741-1767)

### Lines 1768-1793

Reopen status file and inspect first page description for RLE or Rle. Direct index may panic if absent. No assertion checks Lz4, threshold boundary, decoded values or multiple pages. (rust/lance-file/src/writer_tests.rs:1768-1793)

### Lines 1794-1820

Large-read fixture has Binary nonnullable root with two valid values:40MiB of byte42 and small value. V2_1 writer max_page_bytes=128MiB. This deliberately allocates a large complete value; no test-duration measurement is present. Comments use MB labels, but constants are powers of1024. (rust/lance-file/src/writer_tests.rs:1794-1820)

### Lines 1821-1839

Use FsFixture local path, write one batch, finish and require num_rows2 and summary.size_bytes equals actual ObjectStore size. This checks reported size against stored object, not fsync/durable publication or exact page layout. (rust/lance-file/src/writer_tests.rs:1821-1839)

### Lines 1840-1876

Open reader with read_chunk_size10MiB/default other options and no cache, then RangeFull batch1024/readahead10/no filter. Collect entire stream and require one RecordBatch. No request instrumentation proves how many IO chunks were issued or their sizes. (rust/lance-file/src/writer_tests.rs:1840-1876)

### Lines 1877-1891

Downcast sole output to BinaryArray, require length2, first value length40MiB, second bytes equal small value and every first-value byte42. This is a full byte-content oracle after configured chunking; output batch count remains one despite potential IO splits. (rust/lance-file/src/writer_tests.rs:1877-1891)

### Lines 1892-1896

spill_config returns fresh TempObjFile and Arc local ObjectStore. Returned tuple order is(path,store), while write_and_read_batches accepts optional(store,path). Caller retains TempObjFile lifetime while cloning its object path. No explicit sidecar deletion assertion. (rust/lance-file/src/writer_tests.rs:1892-1896)

### Lines 1897-1915

make_batches eagerly returns Vec<RecordBatch> with num_cols nonnull Int32 roots named cN. Each batch/column start=(i*rows_per_batch+c as i32)*100, then consecutive rows_per_batch values. Cast/arithmetic unchecked; negative batch count yields empty range and negative rows can empty arrays, but callers supply positive small dimensions. Empty input later panics in helper. (rust/lance-file/src/writer_tests.rs:1897-1915)

### Lines 1916-1946

write_and_read_batches indexes batches[0] for schema, creates default V2_1 writer, optionally enables spill before all data, sequentially writes every input, adds foo=bar, finishes, and fully reads via shared helper/no filter. Uses default cache/page settings; no forced per-batch flush, threshold counter, IO trace or explicit cleanup. Retains input and full decoded output. (rust/lance-file/src/writer_tests.rs:1916-1946)

### Lines 1947-1964

Spill equality matrix uses20x2x100 and50x2x100 (batches,columns,rows). Compare complete decoded Vec<RecordBatch> from separate unspilled and spilled current-code writes. Oracle includes batch/schema/value equality to baseline, not direct equality to original input or byte-identical files; shared bugs could affect both. No V2_0/V2_2/V2_3 case. (rust/lance-file/src/writer_tests.rs:1947-1964)

### Lines 1965-1976

Many-column spill fixture uses10 batches,500 columns,100 rows, compares decoded baseline versus spilled outputs. Comment claims small per-column limits exercise mid-write flush, but no page-count/threshold/flush oracle proves a mid-write rather than finalization flush. Closing brace ends nested private test module. No late enable, repeated enable, sidecar failure or cancellation test. (rust/lance-file/src/writer_tests.rs:1965-1976)

## Interaction and interpretation limits

All 1,976 physical lines read in complete bounded outputs during ANALYZE57. Tests were inspected, not executed; no timing, passing result, backend durability or compatibility qualification is claimed. Assertions differ in strength: errors, metadata, row counts, pointer identity, decoded values and baseline equality are distinguished. Many matrices cover only V2_0/V2_1; do not generalize to every version. No external-buffer append, late-spill, fault-injection or cancellation oracle occurs in this file. Shared reader.rs is fully analyzed in iteration58; underlying encoding/IO implementations remain pending. The only unsafe blocks mutate process-global environment state without a documented safety guard.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | #[cfg(test)]
    5 | mod tests {
    6 |     use std::collections::HashMap;
    7 |     use std::sync::Arc;
    8 | 
    9 |     use crate::reader::{FileReader, FileReaderOptions, ReaderProjection, describe_encoding};
   10 |     use crate::testing::FsFixture;
   11 |     use crate::version::ConcreteFileVersion;
   12 |     use crate::versions;
   13 |     use crate::writer::{
   14 |         ENV_LANCE_FILE_WRITER_MAX_PAGE_BYTES, FieldTypeMismatch, FileWriter, FileWriterOptions,
   15 |     };
   16 |     use arrow_array::builder::{Float32Builder, Int32Builder};
   17 |     use arrow_array::types::Float64Type;
   18 |     use arrow_array::{
   19 |         Array, ArrayRef, FixedSizeListArray, Float32Array, Int32Array, ListArray, RecordBatch,
   20 |         RecordBatchReader, StringArray, StructArray, UInt64Array,
   21 |     };
   22 |     use arrow_buffer::{NullBuffer, OffsetBuffer, ScalarBuffer};
   23 |     use arrow_schema::{
   24 |         DataType, Field, Field as ArrowField, Fields as ArrowFields, Schema, Schema as ArrowSchema,
   25 |     };
   26 |     use lance_arrow::ARROW_EXT_NAME_KEY;
   27 |     use lance_arrow::json::{ARROW_JSON_EXT_NAME, JSON_EXT_NAME, JsonArray, json_field};
   28 |     use lance_core::cache::LanceCache;
   29 |     use lance_core::datatypes::Schema as LanceSchema;
   30 |     use lance_core::utils::tempfile::TempObjFile;
   31 |     use lance_datagen::{BatchCount, RowCount, array, gen_batch};
   32 |     use lance_encoding::compression_config::{CompressionFieldParams, CompressionParams};
   33 |     use lance_encoding::constants::PACKED_STRUCT_META_KEY;
   34 |     use lance_encoding::decoder::DecoderPlugins;
   35 |     use lance_encoding::encoder::{
   36 |         BatchEncoder, ColumnIndexSequence, EncodingOptions, FieldEncodingContext, OutOfLineBuffers,
   37 |         encode_batch,
   38 |     };
   39 |     use lance_encoding::repdef::RepDefBuilder;
   40 |     use lance_io::object_store::ObjectStore;
   41 |     use lance_io::traits::Writer;
   42 |     use lance_io::utils::CachedFileSize;
   43 |     use rstest::rstest;
   44 | 
   45 |     fn create_writer(
   46 |         object_writer: Box<dyn Writer>,
   47 |         schema: LanceSchema,
   48 |         version: ConcreteFileVersion,
   49 |         options: FileWriterOptions,
   50 |     ) -> lance_core::Result<FileWriter> {
   51 |         versions::create_writer(version, object_writer, schema, options)
   52 |     }
   53 | 
   54 |     fn create_v2_1_writer_with_compression(
   55 |         object_writer: Box<dyn Writer>,
   56 |         schema: LanceSchema,
   57 |         options: FileWriterOptions,
   58 |         compression: CompressionParams,
   59 |     ) -> lance_core::Result<FileWriter> {
   60 |         versions::v2_1::create_writer_with_compression(object_writer, schema, options, compression)
   61 |             .map(Into::into)
   62 |     }
   63 | 
   64 |     fn reader_projection_from_column_names(
   65 |         version: ConcreteFileVersion,
   66 |         schema: &LanceSchema,
   67 |         column_names: &[&str],
   68 |     ) -> lance_core::Result<ReaderProjection> {
   69 |         versions::reader_projection_from_column_names(version, schema, column_names)
   70 |     }
   71 | 
   72 |     #[tokio::test]
   73 |     async fn test_basic_write() {
   74 |         let tmp_path = TempObjFile::default();
   75 |         let obj_store = Arc::new(ObjectStore::local());
   76 | 
   77 |         let reader = gen_batch()
   78 |             .col("score", array::rand::<Float64Type>())
   79 |             .into_reader_rows(RowCount::from(1000), BatchCount::from(10));
   80 | 
   81 |         let writer = obj_store.create(&tmp_path).await.unwrap();
   82 | 
   83 |         let lance_schema =
   84 |             lance_core::datatypes::Schema::try_from(reader.schema().as_ref()).unwrap();
   85 | 
   86 |         let mut file_writer = create_writer(
   87 |             writer,
   88 |             lance_schema,
   89 |             ConcreteFileVersion::V2_1,
   90 |             FileWriterOptions::default(),
   91 |         )
   92 |         .unwrap();
   93 | 
   94 |         for batch in reader {
   95 |             file_writer.write_batch(&batch.unwrap()).await.unwrap();
   96 |         }
   97 |         file_writer.add_schema_metadata("foo", "bar");
   98 |         file_writer.finish().await.unwrap();
   99 |         // Tests asserting the contents of the written file are in reader.rs
  100 |     }
  101 | 
  102 |     #[rstest]
  103 |     #[case::v2_1(ConcreteFileVersion::V2_1)]
  104 |     #[case::v2_2(ConcreteFileVersion::V2_2)]
  105 |     #[case::v2_3(ConcreteFileVersion::V2_3)]
  106 |     #[tokio::test]
  107 |     async fn test_negative_dictionary_values_with_runt_tail(#[case] version: ConcreteFileVersion) {
  108 |         let values: Vec<i64> = (0..9216_u64)
  109 |             .map(|i| ((i.wrapping_mul(2_654_435_761) >> 7) % 1600) as i64 - 800)
  110 |             .collect();
  111 |         let batch = arrow_array::record_batch!(("f0", Int64, values)).unwrap();
  112 |         let reader = arrow_array::RecordBatchIterator::new(vec![Ok(batch.clone())], batch.schema());
  113 |         let fs = FsFixture::default();
  114 | 
  115 |         crate::testing::write_lance_file(reader, &fs, version, FileWriterOptions::default()).await;
  116 |         let read = crate::testing::read_lance_file(
  117 |             &fs,
  118 |             Arc::new(DecoderPlugins::default()),
  119 |             lance_encoding::decoder::FilterExpression::no_filter(),
  120 |         )
  121 |         .await;
  122 |         let read = arrow_select::concat::concat_batches(&read[0].schema(), &read).unwrap();
  123 |         assert_eq!(read, batch);
  124 |     }
  125 | 
  126 |     #[tokio::test]
  127 |     async fn test_write_empty() {
  128 |         let tmp_path = TempObjFile::default();
  129 |         let obj_store = Arc::new(ObjectStore::local());
  130 | 
  131 |         let reader = gen_batch()
  132 |             .col("score", array::rand::<Float64Type>())
  133 |             .into_reader_rows(RowCount::from(0), BatchCount::from(0));
  134 | 
  135 |         let writer = obj_store.create(&tmp_path).await.unwrap();
  136 | 
  137 |         let lance_schema =
  138 |             lance_core::datatypes::Schema::try_from(reader.schema().as_ref()).unwrap();
  139 | 
  140 |         let mut file_writer = create_writer(
  141 |             writer,
  142 |             lance_schema,
  143 |             ConcreteFileVersion::V2_1,
  144 |             FileWriterOptions::default(),
  145 |         )
  146 |         .unwrap();
  147 | 
  148 |         for batch in reader {
  149 |             file_writer.write_batch(&batch.unwrap()).await.unwrap();
  150 |         }
  151 |         file_writer.add_schema_metadata("foo", "bar");
  152 |         file_writer.finish().await.unwrap();
  153 |     }
  154 | 
  155 |     // Read a single column back at an explicit range/index set, returning its
  156 |     // `Int32` values. Reading one column (or an equal-length group) at a time is
  157 |     // how unequal-length files are consumed: a full scan across columns of
  158 |     // differing lengths cannot form a single rectangular batch.
  159 |     async fn read_int32_column(
  160 |         reader: &FileReader,
  161 |         schema: &LanceSchema,
  162 |         version: ConcreteFileVersion,
  163 |         name: &str,
  164 |         params: lance_io::ReadBatchParams,
  165 |     ) -> Vec<Option<i32>> {
  166 |         use futures::TryStreamExt;
  167 |         use lance_encoding::decoder::FilterExpression;
  168 | 
  169 |         let projection = reader_projection_from_column_names(version, schema, &[name]).unwrap();
  170 |         let batches: Vec<RecordBatch> = reader
  171 |             .read_stream_projected(params, 1024, 16, projection, FilterExpression::no_filter())
  172 |             .await
  173 |             .unwrap()
  174 |             .try_collect()
  175 |             .await
  176 |             .unwrap();
  177 |         batches
  178 |             .iter()
  179 |             .flat_map(|b| {
  180 |                 b.column(0)
  181 |                     .as_any()
  182 |                     .downcast_ref::<Int32Array>()
  183 |                     .unwrap()
  184 |                     .iter()
  185 |                     .collect::<Vec<_>>()
  186 |             })
  187 |             .collect()
  188 |     }
  189 | 
  190 |     /// A single file may hold columns of differing item counts, written by
  191 |     /// advancing each column's row counter independently (no shared global
  192 |     /// counter).
  193 |     #[rstest]
  194 |     #[tokio::test]
  195 |     async fn test_write_columns_unequal_lengths(
  196 |         #[values(ConcreteFileVersion::V2_0, ConcreteFileVersion::V2_1)]
  197 |         version: ConcreteFileVersion,
  198 |     ) {
  199 |         use lance_io::ReadBatchParams;
  200 | 
  201 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![
  202 |             ArrowField::new("a", DataType::Int32, true),
  203 |             ArrowField::new("b", DataType::Int32, true),
  204 |             ArrowField::new("c", DataType::Int32, true),
  205 |         ]));
  206 |         let lance_schema = LanceSchema::try_from(arrow_schema.as_ref()).unwrap();
  207 | 
  208 |         let fs = FsFixture::default();
  209 |         let mut writer = create_writer(
  210 |             fs.object_store.create(&fs.tmp_path).await.unwrap(),
  211 |             lance_schema.clone(),
  212 |             version,
  213 |             FileWriterOptions::default(),
  214 |         )
  215 |         .unwrap();
  216 | 
  217 |         // Field "a" gets 5 values across two calls (appending), field "b" gets a
  218 |         // single value, and field "c" is never written (a zero-length column).
  219 |         let a1: ArrayRef = Arc::new(Int32Array::from(vec![1, 2, 3]));
  220 |         let b: ArrayRef = Arc::new(Int32Array::from(vec![10]));
  221 |         writer.write_column(0, a1).await.unwrap();
  222 |         writer.write_column(1, b).await.unwrap();
  223 |         let a2: ArrayRef = Arc::new(Int32Array::from(vec![4, 5]));
  224 |         writer.write_column(0, a2).await.unwrap();
  225 |         // An empty array is a no-op whether or not the field already has rows:
  226 |         // field "a" keeps its 5 rows, field "c" stays a zero-length column.
  227 |         let empty: ArrayRef = Arc::new(Int32Array::from(Vec::<i32>::new()));
  228 |         writer.write_column(0, empty.clone()).await.unwrap();
  229 |         writer.write_column(2, empty).await.unwrap();
  230 | 
  231 |         let summary = writer.finish().await.unwrap();
  232 |         // The file's logical length is the longest column.
  233 |         assert_eq!(summary.num_rows, 5);
  234 | 
  235 |         let file_scheduler = fs
  236 |             .scheduler
  237 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
  238 |             .await
  239 |             .unwrap();
  240 |         let reader = FileReader::try_open(
  241 |             file_scheduler,
  242 |             None,
  243 |             Arc::<DecoderPlugins>::default(),
  244 |             &LanceCache::no_cache(),
  245 |             FileReaderOptions::default(),
  246 |         )
  247 |         .await
  248 |         .unwrap();
  249 | 
  250 |         // Per-column row counts are recorded in / derivable from file metadata.
  251 |         assert_eq!(reader.num_rows(), 5);
  252 |         assert_eq!(reader.column_num_rows(0).unwrap(), 5);
  253 |         assert_eq!(reader.column_num_rows(1).unwrap(), 1);
  254 |         assert_eq!(reader.column_num_rows(2).unwrap(), 0);
  255 |         assert!(reader.column_num_rows(3).is_err());
  256 | 
  257 |         // Each column reads back independently at its own length.
  258 |         assert_eq!(
  259 |             read_int32_column(
  260 |                 &reader,
  261 |                 &lance_schema,
  262 |                 version,
  263 |                 "a",
  264 |                 ReadBatchParams::Range(0..5)
  265 |             )
  266 |             .await,
  267 |             vec![Some(1), Some(2), Some(3), Some(4), Some(5)],
  268 |         );
  269 |         assert_eq!(
  270 |             read_int32_column(
  271 |                 &reader,
  272 |                 &lance_schema,
  273 |                 version,
  274 |                 "b",
  275 |                 ReadBatchParams::Range(0..1)
  276 |             )
  277 |             .await,
  278 |             vec![Some(10)],
  279 |         );
  280 | 
  281 |         // Random access by position within the longer column returns the right
  282 |         // value even though other columns are shorter. (The take path requires
  283 |         // strictly increasing indices.)
  284 |         assert_eq!(
  285 |             read_int32_column(
  286 |                 &reader,
  287 |                 &lance_schema,
  288 |                 version,
  289 |                 "a",
  290 |                 ReadBatchParams::Indices(arrow_array::UInt32Array::from(vec![0, 2, 4])),
  291 |             )
  292 |             .await,
  293 |             vec![Some(1), Some(3), Some(5)],
  294 |         );
  295 |     }
  296 | 
  297 |     /// Reading an unequal-length file:
  298 |     /// - a projection whose columns are equal length full-scans normally;
  299 |     /// - a full scan across columns of differing length is rejected up front,
  300 |     ///   before any batch is produced (even though a prefix would be rectangular);
  301 |     /// - a bounded read is valid as long as every projected column covers it;
  302 |     /// - a single-column `RangeFull` resolves to that column's own length, not
  303 |     ///   the file's (maximum) length.
  304 |     #[rstest]
  305 |     #[tokio::test]
  306 |     async fn test_read_unequal_length_projection(
  307 |         #[values(ConcreteFileVersion::V2_0, ConcreteFileVersion::V2_1)]
  308 |         version: ConcreteFileVersion,
  309 |     ) {
  310 |         use futures::TryStreamExt;
  311 |         use lance_encoding::decoder::FilterExpression;
  312 |         use lance_io::ReadBatchParams;
  313 | 
  314 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![
  315 |             ArrowField::new("a", DataType::Int32, true),
  316 |             ArrowField::new("b", DataType::Int32, true),
  317 |             ArrowField::new("c", DataType::Int32, true),
  318 |         ]));
  319 |         let lance_schema = LanceSchema::try_from(arrow_schema.as_ref()).unwrap();
  320 |         let fs = FsFixture::default();
  321 |         let mut writer = create_writer(
  322 |             fs.object_store.create(&fs.tmp_path).await.unwrap(),
  323 |             lance_schema.clone(),
  324 |             version,
  325 |             FileWriterOptions::default(),
  326 |         )
  327 |         .unwrap();
  328 |         // "a" and "b" are equal length (5); "c" is shorter (1).
  329 |         writer
  330 |             .write_column(0, Arc::new(Int32Array::from(vec![1, 2, 3, 4, 5])))
  331 |             .await
  332 |             .unwrap();
  333 |         writer
  334 |             .write_column(1, Arc::new(Int32Array::from(vec![6, 7, 8, 9, 10])))
  335 |             .await
  336 |             .unwrap();
  337 |         writer
  338 |             .write_column(2, Arc::new(Int32Array::from(vec![100])))
  339 |             .await
  340 |             .unwrap();
  341 |         writer.finish().await.unwrap();
  342 | 
  343 |         let file_scheduler = fs
  344 |             .scheduler
  345 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
  346 |             .await
  347 |             .unwrap();
  348 |         let reader = FileReader::try_open(
  349 |             file_scheduler,
  350 |             None,
  351 |             Arc::<DecoderPlugins>::default(),
  352 |             &LanceCache::no_cache(),
  353 |             FileReaderOptions::default(),
  354 |         )
  355 |         .await
  356 |         .unwrap();
  357 | 
  358 |         let read = |names: &'static [&'static str], params: ReadBatchParams| {
  359 |             let projection =
  360 |                 reader_projection_from_column_names(version, &lance_schema, names).unwrap();
  361 |             async {
  362 |                 match reader
  363 |                     .read_stream_projected(
  364 |                         params,
  365 |                         1024,
  366 |                         16,
  367 |                         projection,
  368 |                         FilterExpression::no_filter(),
  369 |                     )
  370 |                     .await
  371 |                 {
  372 |                     Ok(stream) => stream.try_collect::<Vec<RecordBatch>>().await,
  373 |                     Err(e) => Err(e),
  374 |                 }
  375 |             }
  376 |         };
  377 |         let col_values = |batches: &[RecordBatch], idx: usize| -> Vec<Option<i32>> {
  378 |             batches
  379 |                 .iter()
  380 |                 .flat_map(|b| {
  381 |                     b.column(idx)
  382 |                         .as_any()
  383 |                         .downcast_ref::<Int32Array>()
  384 |                         .unwrap()
  385 |                         .iter()
  386 |                         .collect::<Vec<_>>()
  387 |                 })
  388 |                 .collect()
  389 |         };
  390 | 
  391 |         // Equal-length projection [a, b] full-scans into rectangular batches.
  392 |         let batches = read(&["a", "b"], ReadBatchParams::RangeFull).await.unwrap();
  393 |         assert_eq!(
  394 |             col_values(&batches, 0),
  395 |             vec![Some(1), Some(2), Some(3), Some(4), Some(5)]
  396 |         );
  397 |         assert_eq!(
  398 |             col_values(&batches, 1),
  399 |             vec![Some(6), Some(7), Some(8), Some(9), Some(10)]
  400 |         );
  401 | 
  402 |         // A mismatched-length projection [a, c] (5 vs 1) is rejected before any
  403 |         // batch is yielded, regardless of the read params — its columns cannot
  404 |         // be combined into rectangular batches. The error names each column's
  405 |         // length so the caller can see which column is the odd one out.
  406 |         let err = read(&["a", "c"], ReadBatchParams::RangeFull)
  407 |             .await
  408 |             .unwrap_err()
  409 |             .to_string();
  410 |         assert!(
  411 |             err.contains("a=5") && err.contains("c=1"),
  412 |             "error should name each column's length, got: {err}"
  413 |         );
  414 |         assert!(
  415 |             read(&["a", "c"], ReadBatchParams::Range(0..1))
  416 |                 .await
  417 |                 .is_err(),
  418 |             "even a common-prefix read of unequal-length columns must error"
  419 |         );
  420 | 
  421 |         // A single-column RangeFull resolves to that column's own length.
  422 |         let batches = read(&["c"], ReadBatchParams::RangeFull).await.unwrap();
  423 |         assert_eq!(col_values(&batches, 0), vec![Some(100)]);
  424 |         let batches = read(&["a"], ReadBatchParams::RangeFull).await.unwrap();
  425 |         assert_eq!(
  426 |             col_values(&batches, 0),
  427 |             vec![Some(1), Some(2), Some(3), Some(4), Some(5)]
  428 |         );
  429 | 
  430 |         // RangeFrom/RangeTo likewise resolve against the projected column's own
  431 |         // length rather than the file's longest column.
  432 |         let batches = read(&["a"], ReadBatchParams::RangeFrom(2..)).await.unwrap();
  433 |         assert_eq!(col_values(&batches, 0), vec![Some(3), Some(4), Some(5)]);
  434 |         // RangeFrom on the short column "c" resolves to length 1, not 5.
  435 |         let batches = read(&["c"], ReadBatchParams::RangeFrom(0..)).await.unwrap();
  436 |         assert_eq!(col_values(&batches, 0), vec![Some(100)]);
  437 |         let batches = read(&["a"], ReadBatchParams::RangeTo(..3)).await.unwrap();
  438 |         assert_eq!(col_values(&batches, 0), vec![Some(1), Some(2), Some(3)]);
  439 |         // A bound past the projected column's length errors.
  440 |         assert!(
  441 |             read(&["a"], ReadBatchParams::RangeTo(..6)).await.is_err(),
  442 |             "RangeTo past the column length must error"
  443 |         );
  444 |         assert!(
  445 |             read(&["c"], ReadBatchParams::RangeFrom(2..)).await.is_err(),
  446 |             "RangeFrom past the column length must error"
  447 |         );
  448 |     }
  449 | 
  450 |     /// A struct and a list column each map to multiple physical columns, and a
  451 |     /// list's item column is longer than its top-level row count. The
  452 |     /// projection-length check must partition `column_indices` by top-level
  453 |     /// field and use each field's root column, so an ordinary (rectangular) file
  454 |     /// with nested columns still reads under the new validation path.
  455 |     #[rstest]
  456 |     #[tokio::test]
  457 |     async fn test_read_nested_columns_under_validation(
  458 |         #[values(ConcreteFileVersion::V2_0, ConcreteFileVersion::V2_1)]
  459 |         version: ConcreteFileVersion,
  460 |     ) {
  461 |         use arrow_array::types::Int32Type;
  462 |         use arrow_array::{ListArray, StructArray};
  463 |         use futures::TryStreamExt;
  464 |         use lance_encoding::decoder::FilterExpression;
  465 |         use lance_io::ReadBatchParams;
  466 | 
  467 |         let struct_type = DataType::Struct(
  468 |             vec![
  469 |                 ArrowField::new("x", DataType::Int32, true),
  470 |                 ArrowField::new("y", DataType::Int32, true),
  471 |             ]
  472 |             .into(),
  473 |         );
  474 |         let list_type = DataType::List(Arc::new(ArrowField::new("item", DataType::Int32, true)));
  475 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![
  476 |             ArrowField::new("a", DataType::Int32, true),
  477 |             ArrowField::new("s", struct_type, true),
  478 |             ArrowField::new("lst", list_type, true),
  479 |         ]));
  480 |         let lance_schema = LanceSchema::try_from(arrow_schema.as_ref()).unwrap();
  481 | 
  482 |         let a: ArrayRef = Arc::new(Int32Array::from(vec![1, 2, 3]));
  483 |         let s: ArrayRef = Arc::new(StructArray::from(vec![
  484 |             (
  485 |                 Arc::new(ArrowField::new("x", DataType::Int32, true)),
  486 |                 Arc::new(Int32Array::from(vec![10, 20, 30])) as ArrayRef,
  487 |             ),
  488 |             (
  489 |                 Arc::new(ArrowField::new("y", DataType::Int32, true)),
  490 |                 Arc::new(Int32Array::from(vec![11, 21, 31])) as ArrayRef,
  491 |             ),
  492 |         ]));
  493 |         // 3 lists, 6 items: the item column is longer than the top-level rows.
  494 |         let lst: ArrayRef = Arc::new(ListArray::from_iter_primitive::<Int32Type, _, _>(vec![
  495 |             Some(vec![Some(1), Some(2)]),
  496 |             Some(vec![Some(3)]),
  497 |             Some(vec![Some(4), Some(5), Some(6)]),
  498 |         ]));
  499 |         let batch = RecordBatch::try_new(arrow_schema.clone(), vec![a, s, lst]).unwrap();
  500 | 
  501 |         let fs = FsFixture::default();
  502 |         let mut writer = create_writer(
  503 |             fs.object_store.create(&fs.tmp_path).await.unwrap(),
  504 |             lance_schema.clone(),
  505 |             version,
  506 |             FileWriterOptions::default(),
  507 |         )
  508 |         .unwrap();
  509 |         writer.write_batch(&batch).await.unwrap();
  510 |         writer.finish().await.unwrap();
  511 | 
  512 |         let file_scheduler = fs
  513 |             .scheduler
  514 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
  515 |             .await
  516 |             .unwrap();
  517 |         let reader = FileReader::try_open(
  518 |             file_scheduler,
  519 |             None,
  520 |             Arc::<DecoderPlugins>::default(),
  521 |             &LanceCache::no_cache(),
  522 |             FileReaderOptions::default(),
  523 |         )
  524 |         .await
  525 |         .unwrap();
  526 | 
  527 |         // If `validate_field_length` mispartitioned the physical columns, the
  528 |         // length check would read the wrong root column (e.g. the list's item
  529 |         // column, length 6) and spuriously reject this rectangular file.
  530 |         for names in [&["a", "s", "lst"][..], &["a", "lst"][..], &["a", "s"][..]] {
  531 |             let projection =
  532 |                 reader_projection_from_column_names(version, &lance_schema, names).unwrap();
  533 |             let batches: Vec<RecordBatch> = reader
  534 |                 .read_stream_projected(
  535 |                     ReadBatchParams::RangeFull,
  536 |                     1024,
  537 |                     16,
  538 |                     projection,
  539 |                     FilterExpression::no_filter(),
  540 |                 )
  541 |                 .await
  542 |                 .unwrap()
  543 |                 .try_collect()
  544 |                 .await
  545 |                 .unwrap();
  546 |             let total_rows: usize = batches.iter().map(|b| b.num_rows()).sum();
  547 |             assert_eq!(
  548 |                 total_rows, 3,
  549 |                 "projection {names:?} should read 3 top-level rows"
  550 |             );
  551 |         }
  552 |     }
  553 | 
  554 |     /// `write_column` rejects invalid inputs at the API boundary with
  555 |     /// descriptive errors: a writer without an explicit schema, an
  556 |     /// out-of-bounds field index, and a null written into a non-nullable field.
  557 |     #[tokio::test]
  558 |     async fn test_write_column_validation_errors() {
  559 |         // A lazy-schema writer cannot infer the schema from a single column.
  560 |         let fs = FsFixture::default();
  561 |         let mut lazy_writer = versions::v2_1::create_lazy_writer(
  562 |             fs.object_store.create(&fs.tmp_path).await.unwrap(),
  563 |             FileWriterOptions::default(),
  564 |         );
  565 |         let err = lazy_writer
  566 |             .write_column(0, Arc::new(Int32Array::from(vec![1, 2, 3])))
  567 |             .await
  568 |             .unwrap_err()
  569 |             .to_string();
  570 |         assert!(
  571 |             err.contains("explicit schema"),
  572 |             "expected explicit-schema error, got: {err}"
  573 |         );
  574 | 
  575 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![
  576 |             ArrowField::new("a", DataType::Int32, false),
  577 |             ArrowField::new("b", DataType::Int32, true),
  578 |         ]));
  579 |         let lance_schema = LanceSchema::try_from(arrow_schema.as_ref()).unwrap();
  580 | 
  581 |         // An out-of-bounds field index is rejected, naming the index and count.
  582 |         let fs = FsFixture::default();
  583 |         let mut writer = create_writer(
  584 |             fs.object_store.create(&fs.tmp_path).await.unwrap(),
  585 |             lance_schema.clone(),
  586 |             ConcreteFileVersion::V2_1,
  587 |             FileWriterOptions::default(),
  588 |         )
  589 |         .unwrap();
  590 |         let err = writer
  591 |             .write_column(5, Arc::new(Int32Array::from(vec![1])))
  592 |             .await
  593 |             .unwrap_err()
  594 |             .to_string();
  595 |         assert!(
  596 |             err.contains('5') && err.contains('2'),
  597 |             "expected out-of-bounds error naming index 5 and 2 fields, got: {err}"
  598 |         );
  599 | 
  600 |         // A null in a non-nullable field ("a") is rejected.
  601 |         let err = writer
  602 |             .write_column(0, Arc::new(Int32Array::from(vec![Some(1), None, Some(3)])))
  603 |             .await
  604 |             .unwrap_err()
  605 |             .to_string();
  606 |         assert!(
  607 |             err.contains("non-null"),
  608 |             "expected nullability error, got: {err}"
  609 |         );
  610 |     }
  611 | 
  612 |     fn field_type_mismatch(error: lance_core::Error) -> FieldTypeMismatch {
  613 |         match error {
  614 |             lance_core::Error::InvalidInput { source, .. } => source
  615 |                 .downcast_ref::<FieldTypeMismatch>()
  616 |                 .unwrap_or_else(|| panic!("expected a field type mismatch, got: {source}"))
  617 |                 .clone(),
  618 |             other => panic!("expected an invalid input error, got: {other}"),
  619 |         }
  620 |     }
  621 | 
  622 |     /// Arrow JSON text that skipped conversion to Lance JSONB is rejected
  623 |     /// before anything is encoded, naming the offending field.
  624 |     #[rstest]
  625 |     #[case::top_level(false)]
  626 |     #[case::nested_in_struct(true)]
  627 |     #[tokio::test]
  628 |     async fn test_writer_rejects_unconverted_arrow_json(
  629 |         #[case] nested: bool,
  630 |         #[values(
  631 |             ConcreteFileVersion::V2_0,
  632 |             ConcreteFileVersion::V2_1,
  633 |             ConcreteFileVersion::V2_2,
  634 |             ConcreteFileVersion::V2_3
  635 |         )]
  636 |         version: ConcreteFileVersion,
  637 |     ) {
  638 |         let arrow_json =
  639 |             ArrowField::new("j", DataType::Utf8, true).with_metadata(HashMap::from([(
  640 |                 ARROW_EXT_NAME_KEY.to_string(),
  641 |                 ARROW_JSON_EXT_NAME.to_string(),
  642 |             )]));
  643 |         let text: ArrayRef = Arc::new(StringArray::from(vec![r#"{"a":1}"#]));
  644 |         let in_struct = |field: ArrowField| {
  645 |             if nested {
  646 |                 ArrowField::new("s", DataType::Struct(vec![field].into()), true)
  647 |             } else {
  648 |                 field
  649 |             }
  650 |         };
  651 |         let jsonb: ArrayRef = Arc::new(JsonArray::try_from(text.clone()).unwrap().into_inner());
  652 |         let batch_of = |field: ArrowField, values: ArrayRef| {
  653 |             let field = in_struct(field);
  654 |             let values: ArrayRef = match field.data_type() {
  655 |                 DataType::Struct(fields) => {
  656 |                     Arc::new(StructArray::new(fields.clone(), vec![values], None))
  657 |                 }
  658 |                 _ => values,
  659 |             };
  660 |             RecordBatch::try_new(Arc::new(ArrowSchema::new(vec![field])), vec![values]).unwrap()
  661 |         };
  662 |         let converted = batch_of(json_field("j", true), jsonb);
  663 |         let batch = batch_of(arrow_json, text);
  664 |         let file_schema = LanceSchema::try_from(converted.schema().as_ref()).unwrap();
  665 | 
  666 |         let fs = FsFixture::default();
  667 |         let mut writer = create_writer(
  668 |             fs.object_store.create(&fs.tmp_path).await.unwrap(),
  669 |             file_schema,
  670 |             version,
  671 |             FileWriterOptions::default(),
  672 |         )
  673 |         .unwrap();
  674 |         // A batch with an accepted schema must not let a later, different
  675 |         // schema through.
  676 |         writer.write_batch(&converted).await.unwrap();
  677 |         let mismatch = field_type_mismatch(writer.write_batch(&batch).await.unwrap_err());
  678 |         assert_eq!(mismatch.field_path, if nested { "s.j" } else { "j" });
  679 |         assert_eq!(mismatch.expected.data_type(), &DataType::LargeBinary);
  680 |         assert_eq!(mismatch.expected.extension_type_name(), Some(JSON_EXT_NAME));
  681 |         assert_eq!(mismatch.actual.data_type(), &DataType::Utf8);
  682 |         assert_eq!(
  683 |             mismatch.actual.extension_type_name(),
  684 |             Some(ARROW_JSON_EXT_NAME)
  685 |         );
  686 |         // The rejected batch reached no encoder.
  687 |         assert_eq!(writer.finish().await.unwrap().num_rows, 1);
  688 |     }
  689 | 
  690 |     #[rstest]
  691 |     #[tokio::test]
  692 |     async fn test_write_column_rejects_mismatched_type(
  693 |         #[values(
  694 |             ConcreteFileVersion::V2_0,
  695 |             ConcreteFileVersion::V2_1,
  696 |             ConcreteFileVersion::V2_2,
  697 |             ConcreteFileVersion::V2_3
  698 |         )]
  699 |         version: ConcreteFileVersion,
  700 |     ) {
  701 |         let file_schema =
  702 |             LanceSchema::try_from(&ArrowSchema::new(vec![json_field("j", true)])).unwrap();
  703 |         let fs = FsFixture::default();
  704 |         let mut writer = create_writer(
  705 |             fs.object_store.create(&fs.tmp_path).await.unwrap(),
  706 |             file_schema,
  707 |             version,
  708 |             FileWriterOptions::default(),
  709 |         )
  710 |         .unwrap();
  711 |         let text: ArrayRef = Arc::new(StringArray::from(vec![r#"{"a":1}"#]));
  712 |         let mismatch = field_type_mismatch(writer.write_column(0, text).await.unwrap_err());
  713 |         assert_eq!(mismatch.field_path, "j");
  714 |         assert_eq!(mismatch.expected.data_type(), &DataType::LargeBinary);
  715 |         // A bare array carries no extension of its own.
  716 |         assert_eq!(mismatch.actual.data_type(), &DataType::Utf8);
  717 |         assert_eq!(mismatch.actual.extension_type_name(), None);
  718 |     }
  719 | 
  720 |     fn struct_array(fields: ArrowFields, nulls: Option<NullBuffer>) -> StructArray {
  721 |         StructArray::new(
  722 |             fields,
  723 |             vec![
  724 |                 Arc::new(Int32Array::from(vec![10, 99, 30])),
  725 |                 Arc::new(Int32Array::from(vec![11, 98, 31])),
  726 |             ],
  727 |             nulls,
  728 |         )
  729 |     }
  730 | 
  731 |     /// Writer preflight uses the same name-selected arrays as encoding, so a
  732 |     /// rejected reordered batch cannot leave earlier field encoders mutated.
  733 |     #[tokio::test]
  734 |     async fn test_v2_0_writer_atomically_rejects_reordered_null_structs() {
  735 |         let struct_fields: ArrowFields = vec![
  736 |             ArrowField::new("a", DataType::Int32, true),
  737 |             ArrowField::new("b", DataType::Int32, true),
  738 |         ]
  739 |         .into();
  740 |         let struct_field = ArrowField::new("s", DataType::Struct(struct_fields.clone()), true);
  741 |         let writer_schema = Arc::new(ArrowSchema::new(vec![
  742 |             ArrowField::new("id", DataType::Int32, true),
  743 |             struct_field.clone(),
  744 |         ]));
  745 |         let batch_schema = Arc::new(ArrowSchema::new(vec![
  746 |             struct_field,
  747 |             ArrowField::new("id", DataType::Int32, true),
  748 |         ]));
  749 |         let null_structs = struct_array(
  750 |             struct_fields.clone(),
  751 |             Some(NullBuffer::from(vec![true, false, true])),
  752 |         );
  753 |         let invalid_batch = RecordBatch::try_new(
  754 |             batch_schema.clone(),
  755 |             vec![
  756 |                 Arc::new(null_structs),
  757 |                 Arc::new(Int32Array::from(vec![1, 2, 3])),
  758 |             ],
  759 |         )
  760 |         .unwrap();
  761 |         let lance_schema = LanceSchema::try_from(writer_schema.as_ref()).unwrap();
  762 | 
  763 |         let fs = FsFixture::default();
  764 |         let mut writer = create_writer(
  765 |             fs.object_store.create(&fs.tmp_path).await.unwrap(),
  766 |             lance_schema.clone(),
  767 |             ConcreteFileVersion::V2_0,
  768 |             FileWriterOptions::default(),
  769 |         )
  770 |         .unwrap();
  771 |         let error = writer.write_batch(&invalid_batch).await.unwrap_err();
  772 | 
  773 |         assert!(matches!(error, lance_core::Error::InvalidInput { .. }));
  774 |         let message = error.to_string();
  775 |         assert!(message.contains("struct validity"), "{message}");
  776 |         assert!(message.contains("2.0"), "{message}");
  777 |         assert!(message.contains("1 null value"), "{message}");
  778 | 
  779 |         let valid_batch = RecordBatch::try_new(
  780 |             batch_schema,
  781 |             vec![
  782 |                 Arc::new(struct_array(struct_fields, None)),
  783 |                 Arc::new(Int32Array::from(vec![4, 5, 6])),
  784 |             ],
  785 |         )
  786 |         .unwrap();
  787 |         writer.write_batch(&valid_batch).await.unwrap();
  788 |         writer.finish().await.unwrap();
  789 | 
  790 |         let file_scheduler = fs
  791 |             .scheduler
  792 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
  793 |             .await
  794 |             .unwrap();
  795 |         let reader = FileReader::try_open(
  796 |             file_scheduler,
  797 |             None,
  798 |             Arc::<DecoderPlugins>::default(),
  799 |             &LanceCache::no_cache(),
  800 |             FileReaderOptions::default(),
  801 |         )
  802 |         .await
  803 |         .unwrap();
  804 |         assert_eq!(
  805 |             read_int32_column(
  806 |                 &reader,
  807 |                 &lance_schema,
  808 |                 ConcreteFileVersion::V2_0,
  809 |                 "id",
  810 |                 lance_io::ReadBatchParams::RangeFull,
  811 |             )
  812 |             .await,
  813 |             vec![Some(4), Some(5), Some(6)]
  814 |         );
  815 |     }
  816 | 
  817 |     /// V2.0 null-struct validation applies only to list values that are logically
  818 |     /// encoded, excluding unselected backing values and values under null lists.
  819 |     #[rstest]
  820 |     #[case::non_empty_slice(1, 1, false, true)]
  821 |     #[case::empty_slice(1, 0, false, true)]
  822 |     #[case::garbage_under_null_list(0, 2, true, true)]
  823 |     #[case::selected_null_struct(0, 1, false, false)]
  824 |     #[tokio::test]
  825 |     async fn test_v2_0_writer_validates_logical_list_structs(
  826 |         #[case] offset: usize,
  827 |         #[case] len: usize,
  828 |         #[case] has_null_list: bool,
  829 |         #[case] should_succeed: bool,
  830 |     ) {
  831 |         let struct_fields: ArrowFields = vec![
  832 |             ArrowField::new("a", DataType::Int32, true),
  833 |             ArrowField::new("b", DataType::Int32, true),
  834 |         ]
  835 |         .into();
  836 |         let struct_values = struct_array(
  837 |             struct_fields.clone(),
  838 |             Some(NullBuffer::from(vec![false, true, true])),
  839 |         );
  840 |         let item_field = Arc::new(ArrowField::new(
  841 |             "item",
  842 |             DataType::Struct(struct_fields),
  843 |             true,
  844 |         ));
  845 |         let list_nulls = has_null_list.then(|| NullBuffer::from(vec![false, true, true]));
  846 |         let list = ListArray::new(
  847 |             item_field,
  848 |             OffsetBuffer::new(ScalarBuffer::from(vec![0_i32, 1, 2, 3])),
  849 |             Arc::new(struct_values),
  850 |             list_nulls,
  851 |         );
  852 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![ArrowField::new(
  853 |             "items",
  854 |             list.data_type().clone(),
  855 |             true,
  856 |         )]));
  857 |         let batch = RecordBatch::try_new(
  858 |             arrow_schema.clone(),
  859 |             vec![Arc::new(list.slice(offset, len))],
  860 |         )
  861 |         .unwrap();
  862 |         let lance_schema = LanceSchema::try_from(arrow_schema.as_ref()).unwrap();
  863 | 
  864 |         let fs = FsFixture::default();
  865 |         let mut writer = create_writer(
  866 |             fs.object_store.create(&fs.tmp_path).await.unwrap(),
  867 |             lance_schema,
  868 |             ConcreteFileVersion::V2_0,
  869 |             FileWriterOptions::default(),
  870 |         )
  871 |         .unwrap();
  872 | 
  873 |         let result = writer.write_batch(&batch).await;
  874 |         if !should_succeed {
  875 |             let error = result.unwrap_err();
  876 |             assert!(matches!(error, lance_core::Error::InvalidInput { .. }));
  877 |             assert!(error.to_string().contains("struct validity"));
  878 |             return;
  879 |         }
  880 |         result.unwrap();
  881 |         writer.finish().await.unwrap();
  882 |     }
  883 | 
  884 |     /// Fixed-size-list child slots under null parent rows are not logically
  885 |     /// encoded, while null structs under valid parent rows remain invalid.
  886 |     #[rstest]
  887 |     #[case::masked_child_null(true, false, true)]
  888 |     #[case::masked_non_nullable_child_null(true, true, true)]
  889 |     #[case::selected_child_null(false, false, false)]
  890 |     #[tokio::test]
  891 |     async fn test_v2_0_writer_validates_logical_fixed_size_list_structs(
  892 |         #[case] mask_child_null: bool,
  893 |         #[case] has_non_nullable_child_null: bool,
  894 |         #[case] should_succeed: bool,
  895 |     ) {
  896 |         let struct_fields: ArrowFields = vec![
  897 |             ArrowField::new("a", DataType::Int32, !has_non_nullable_child_null),
  898 |             ArrowField::new("b", DataType::Int32, true),
  899 |         ]
  900 |         .into();
  901 |         let struct_values = if has_non_nullable_child_null {
  902 |             StructArray::new(
  903 |                 struct_fields.clone(),
  904 |                 vec![
  905 |                     Arc::new(Int32Array::from(vec![None, Some(99), Some(30)])),
  906 |                     Arc::new(Int32Array::from(vec![11, 98, 31])),
  907 |                 ],
  908 |                 Some(NullBuffer::from(vec![false, true, true])),
  909 |             )
  910 |         } else {
  911 |             struct_array(
  912 |                 struct_fields.clone(),
  913 |                 Some(NullBuffer::from(vec![false, true, true])),
  914 |             )
  915 |         };
  916 |         let item_field = Arc::new(ArrowField::new(
  917 |             "item",
  918 |             DataType::Struct(struct_fields),
  919 |             true,
  920 |         ));
  921 |         let parent_nulls = mask_child_null.then(|| NullBuffer::from(vec![false, true, true]));
  922 |         let list = FixedSizeListArray::new(item_field, 1, Arc::new(struct_values), parent_nulls);
  923 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![
  924 |             ArrowField::new("id", DataType::Int32, false),
  925 |             ArrowField::new("items", list.data_type().clone(), true),
  926 |         ]));
  927 |         let batch = RecordBatch::try_new(
  928 |             arrow_schema.clone(),
  929 |             vec![Arc::new(Int32Array::from(vec![1, 2, 3])), Arc::new(list)],
  930 |         )
  931 |         .unwrap();
  932 |         let lance_schema = LanceSchema::try_from(arrow_schema.as_ref()).unwrap();
  933 | 
  934 |         let fs = FsFixture::default();
  935 |         let mut writer = create_writer(
  936 |             fs.object_store.create(&fs.tmp_path).await.unwrap(),
  937 |             lance_schema,
  938 |             ConcreteFileVersion::V2_0,
  939 |             FileWriterOptions::default(),
  940 |         )
  941 |         .unwrap();
  942 | 
  943 |         let result = writer.write_batch(&batch).await;
  944 |         if !should_succeed {
  945 |             let error = result.unwrap_err();
  946 |             assert!(matches!(error, lance_core::Error::InvalidInput { .. }));
  947 |             assert!(error.to_string().contains("struct validity"));
  948 |             return;
  949 |         }
  950 |         result.unwrap();
  951 |         writer.finish().await.unwrap();
  952 |     }
  953 | 
  954 |     /// The public in-memory v2.0 encoder must enforce the invariant for both
  955 |     /// ordinary multi-column structs and packed structs.
  956 |     #[rstest]
  957 |     #[case::ordinary(false)]
  958 |     #[case::packed(true)]
  959 |     #[tokio::test]
  960 |     async fn test_v2_0_encoding_strategy_rejects_null_structs(#[case] is_packed: bool) {
  961 |         let struct_fields: ArrowFields = vec![
  962 |             ArrowField::new("a", DataType::Int32, true),
  963 |             ArrowField::new("b", DataType::Int32, true),
  964 |         ]
  965 |         .into();
  966 |         let mut struct_field = ArrowField::new("s", DataType::Struct(struct_fields.clone()), true);
  967 |         if is_packed {
  968 |             struct_field = struct_field.with_metadata(HashMap::from([(
  969 |                 PACKED_STRUCT_META_KEY.to_owned(),
  970 |                 "true".to_owned(),
  971 |             )]));
  972 |         }
  973 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![struct_field]));
  974 |         let batch = RecordBatch::try_new(
  975 |             arrow_schema.clone(),
  976 |             vec![Arc::new(struct_array(
  977 |                 struct_fields,
  978 |                 Some(NullBuffer::from(vec![true, false, true])),
  979 |             ))],
  980 |         )
  981 |         .unwrap();
  982 |         let lance_schema = Arc::new(LanceSchema::try_from(arrow_schema.as_ref()).unwrap());
  983 |         let strategy = versions::v2_0::encoding_strategy();
  984 | 
  985 |         let mut batch_encoder = BatchEncoder::try_new(
  986 |             lance_schema.as_ref(),
  987 |             strategy.as_ref(),
  988 |             &EncodingOptions::default(),
  989 |         )
  990 |         .unwrap();
  991 |         let mut external_buffers = OutOfLineBuffers::new(0, 64);
  992 |         let direct_result = batch_encoder.field_encoders[0].maybe_encode(
  993 |             batch.column(0).clone(),
  994 |             &mut external_buffers,
  995 |             RepDefBuilder::default(),
  996 |             0,
  997 |             batch.num_rows() as u64,
  998 |         );
  999 |         let Err(direct_error) = direct_result else {
 1000 |             panic!("public BatchEncoder bypassed v2.0 validation");
 1001 |         };
 1002 |         assert!(matches!(
 1003 |             direct_error,
 1004 |             lance_core::Error::InvalidInput { .. }
 1005 |         ));
 1006 |         assert!(direct_error.to_string().contains("struct validity"));
 1007 | 
 1008 |         let options = EncodingOptions::default();
 1009 |         let field = &lance_schema.fields[0];
 1010 |         let context = FieldEncodingContext {
 1011 |             strategy: strategy.as_ref(),
 1012 |             options: &options,
 1013 |             root_field_metadata: &field.metadata,
 1014 |         };
 1015 |         let mut column_index = ColumnIndexSequence::default();
 1016 |         let mut factory_encoder = strategy
 1017 |             .create_field_encoder(field, &mut column_index, &context)
 1018 |             .unwrap();
 1019 |         let factory_result = factory_encoder.maybe_encode(
 1020 |             batch.column(0).clone(),
 1021 |             &mut OutOfLineBuffers::new(0, 64),
 1022 |             RepDefBuilder::default(),
 1023 |             0,
 1024 |             batch.num_rows() as u64,
 1025 |         );
 1026 |         let Err(factory_error) = factory_result else {
 1027 |             panic!("public create_field_encoder bypassed v2.0 validation");
 1028 |         };
 1029 |         assert!(matches!(
 1030 |             factory_error,
 1031 |             lance_core::Error::InvalidInput { .. }
 1032 |         ));
 1033 |         assert!(factory_error.to_string().contains("struct validity"));
 1034 | 
 1035 |         let error = encode_batch(
 1036 |             &batch,
 1037 |             lance_schema,
 1038 |             strategy.as_ref(),
 1039 |             &EncodingOptions::default(),
 1040 |         )
 1041 |         .await
 1042 |         .unwrap_err();
 1043 | 
 1044 |         assert!(matches!(error, lance_core::Error::InvalidInput { .. }));
 1045 |         let message = error.to_string();
 1046 |         assert!(message.contains("struct validity"), "{message}");
 1047 |         assert!(message.contains("2.0"), "{message}");
 1048 |         assert!(message.contains("1 null value"), "{message}");
 1049 |     }
 1050 | 
 1051 |     #[test]
 1052 |     fn test_v2_0_primitive_fsl_preparation_reuses_array() {
 1053 |         let item_field = Arc::new(ArrowField::new("item", DataType::Float32, true));
 1054 |         let array: ArrayRef = Arc::new(FixedSizeListArray::new(
 1055 |             item_field.clone(),
 1056 |             2,
 1057 |             Arc::new(Float32Array::from(vec![0.0; 6])),
 1058 |             Some(NullBuffer::from(vec![true, false, true])),
 1059 |         ));
 1060 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new(
 1061 |             "vector",
 1062 |             DataType::FixedSizeList(item_field, 2),
 1063 |             true,
 1064 |         )]);
 1065 |         let lance_schema = LanceSchema::try_from(&arrow_schema).unwrap();
 1066 |         let strategy = versions::v2_0::encoding_strategy();
 1067 |         let options = EncodingOptions::default();
 1068 |         let field = &lance_schema.fields[0];
 1069 |         let context = FieldEncodingContext {
 1070 |             strategy: strategy.as_ref(),
 1071 |             options: &options,
 1072 |             root_field_metadata: &field.metadata,
 1073 |         };
 1074 |         let mut column_index = ColumnIndexSequence::default();
 1075 |         let mut encoder = strategy
 1076 |             .create_field_encoder(field, &mut column_index, &context)
 1077 |             .unwrap();
 1078 | 
 1079 |         let prepared = encoder.prepare_array(array.clone()).unwrap();
 1080 | 
 1081 |         assert!(Arc::ptr_eq(&prepared, &array));
 1082 |     }
 1083 | 
 1084 |     /// The blocking read path applies the same projection-length validation as
 1085 |     /// the async path: a short single column resolves to its own length, and a
 1086 |     /// mismatched-length projection errors up front.
 1087 |     #[rstest]
 1088 |     #[tokio::test]
 1089 |     async fn test_blocking_read_unequal_length(
 1090 |         #[values(ConcreteFileVersion::V2_0, ConcreteFileVersion::V2_1)]
 1091 |         version: ConcreteFileVersion,
 1092 |     ) {
 1093 |         use lance_encoding::decoder::FilterExpression;
 1094 |         use lance_io::ReadBatchParams;
 1095 | 
 1096 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![
 1097 |             ArrowField::new("a", DataType::Int32, true),
 1098 |             ArrowField::new("c", DataType::Int32, true),
 1099 |         ]));
 1100 |         let lance_schema = LanceSchema::try_from(arrow_schema.as_ref()).unwrap();
 1101 |         let fs = FsFixture::default();
 1102 |         let mut writer = create_writer(
 1103 |             fs.object_store.create(&fs.tmp_path).await.unwrap(),
 1104 |             lance_schema.clone(),
 1105 |             version,
 1106 |             FileWriterOptions::default(),
 1107 |         )
 1108 |         .unwrap();
 1109 |         writer
 1110 |             .write_column(0, Arc::new(Int32Array::from(vec![1, 2, 3, 4, 5])))
 1111 |             .await
 1112 |             .unwrap();
 1113 |         writer
 1114 |             .write_column(1, Arc::new(Int32Array::from(vec![100])))
 1115 |             .await
 1116 |             .unwrap();
 1117 |         writer.finish().await.unwrap();
 1118 | 
 1119 |         let file_scheduler = fs
 1120 |             .scheduler
 1121 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 1122 |             .await
 1123 |             .unwrap();
 1124 |         let reader = Arc::new(
 1125 |             FileReader::try_open(
 1126 |                 file_scheduler,
 1127 |                 None,
 1128 |                 Arc::<DecoderPlugins>::default(),
 1129 |                 &LanceCache::no_cache(),
 1130 |                 FileReaderOptions::default(),
 1131 |             )
 1132 |             .await
 1133 |             .unwrap(),
 1134 |         );
 1135 | 
 1136 |         // Single short column: RangeFull resolves to its own length (1).
 1137 |         let proj_c = reader_projection_from_column_names(version, &lance_schema, &["c"]).unwrap();
 1138 |         let reader_c = reader.clone();
 1139 |         let batches = tokio::task::spawn_blocking(move || {
 1140 |             reader_c
 1141 |                 .read_stream_projected_blocking(
 1142 |                     ReadBatchParams::RangeFull,
 1143 |                     1024,
 1144 |                     Some(proj_c),
 1145 |                     FilterExpression::no_filter(),
 1146 |                 )
 1147 |                 .unwrap()
 1148 |                 .collect::<std::result::Result<Vec<RecordBatch>, _>>()
 1149 |                 .unwrap()
 1150 |         })
 1151 |         .await
 1152 |         .unwrap();
 1153 |         let total_rows: usize = batches.iter().map(|b| b.num_rows()).sum();
 1154 |         assert_eq!(total_rows, 1);
 1155 | 
 1156 |         // A mismatched projection [a, c] errors on the blocking path too.
 1157 |         let proj_ac =
 1158 |             reader_projection_from_column_names(version, &lance_schema, &["a", "c"]).unwrap();
 1159 |         let reader_ac = reader.clone();
 1160 |         let is_err = tokio::task::spawn_blocking(move || {
 1161 |             reader_ac
 1162 |                 .read_stream_projected_blocking(
 1163 |                     ReadBatchParams::RangeFull,
 1164 |                     1024,
 1165 |                     Some(proj_ac),
 1166 |                     FilterExpression::no_filter(),
 1167 |                 )
 1168 |                 .is_err()
 1169 |         })
 1170 |         .await
 1171 |         .unwrap();
 1172 |         assert!(
 1173 |             is_err,
 1174 |             "blocking full scan across unequal-length columns must error"
 1175 |         );
 1176 |     }
 1177 | 
 1178 |     /// Files written the ordinary (rectangular) way keep equal column lengths,
 1179 |     /// so the unequal-length support is backwards compatible.
 1180 |     #[tokio::test]
 1181 |     async fn test_write_batch_keeps_equal_lengths() {
 1182 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![
 1183 |             ArrowField::new("a", DataType::Int32, true),
 1184 |             ArrowField::new("b", DataType::Int32, true),
 1185 |         ]));
 1186 |         let lance_schema = LanceSchema::try_from(arrow_schema.as_ref()).unwrap();
 1187 | 
 1188 |         let fs = FsFixture::default();
 1189 |         let mut writer = create_writer(
 1190 |             fs.object_store.create(&fs.tmp_path).await.unwrap(),
 1191 |             lance_schema,
 1192 |             ConcreteFileVersion::V2_1,
 1193 |             FileWriterOptions::default(),
 1194 |         )
 1195 |         .unwrap();
 1196 |         let batch = RecordBatch::try_new(
 1197 |             arrow_schema.clone(),
 1198 |             vec![
 1199 |                 Arc::new(Int32Array::from(vec![1, 2, 3])),
 1200 |                 Arc::new(Int32Array::from(vec![4, 5, 6])),
 1201 |             ],
 1202 |         )
 1203 |         .unwrap();
 1204 |         writer.write_batch(&batch).await.unwrap();
 1205 |         let summary = writer.finish().await.unwrap();
 1206 |         assert_eq!(summary.num_rows, 3);
 1207 | 
 1208 |         let file_scheduler = fs
 1209 |             .scheduler
 1210 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 1211 |             .await
 1212 |             .unwrap();
 1213 |         let reader = FileReader::try_open(
 1214 |             file_scheduler,
 1215 |             None,
 1216 |             Arc::<DecoderPlugins>::default(),
 1217 |             &LanceCache::no_cache(),
 1218 |             FileReaderOptions::default(),
 1219 |         )
 1220 |         .await
 1221 |         .unwrap();
 1222 |         assert_eq!(reader.column_num_rows(0).unwrap(), 3);
 1223 |         assert_eq!(reader.column_num_rows(1).unwrap(), 3);
 1224 |     }
 1225 | 
 1226 |     #[tokio::test]
 1227 |     async fn test_max_page_bytes_enforced() {
 1228 |         let arrow_field = Field::new("data", DataType::UInt64, false);
 1229 |         let arrow_schema = Schema::new(vec![arrow_field]);
 1230 |         let lance_schema = LanceSchema::try_from(&arrow_schema).unwrap();
 1231 | 
 1232 |         // 8MiB
 1233 |         let data: Vec<u64> = (0..1_000_000).collect();
 1234 |         let array = UInt64Array::from(data);
 1235 |         let batch =
 1236 |             RecordBatch::try_new(arrow_schema.clone().into(), vec![Arc::new(array)]).unwrap();
 1237 | 
 1238 |         let options = FileWriterOptions {
 1239 |             max_page_bytes: Some(1024 * 1024), // 1MB
 1240 |             ..Default::default()
 1241 |         };
 1242 | 
 1243 |         let path = TempObjFile::default();
 1244 |         let object_store = ObjectStore::local();
 1245 |         let mut writer = create_writer(
 1246 |             object_store.create(&path).await.unwrap(),
 1247 |             lance_schema,
 1248 |             ConcreteFileVersion::V2_0,
 1249 |             options,
 1250 |         )
 1251 |         .unwrap();
 1252 | 
 1253 |         writer.write_batch(&batch).await.unwrap();
 1254 |         writer.finish().await.unwrap();
 1255 | 
 1256 |         let fs = FsFixture::default();
 1257 |         let file_scheduler = fs
 1258 |             .scheduler
 1259 |             .open_file(&path, &CachedFileSize::unknown())
 1260 |             .await
 1261 |             .unwrap();
 1262 |         let file_reader = FileReader::try_open(
 1263 |             file_scheduler,
 1264 |             None,
 1265 |             Arc::<DecoderPlugins>::default(),
 1266 |             &LanceCache::no_cache(),
 1267 |             FileReaderOptions::default(),
 1268 |         )
 1269 |         .await
 1270 |         .unwrap();
 1271 | 
 1272 |         let column_meta = file_reader.metadata();
 1273 | 
 1274 |         let mut total_page_num: u32 = 0;
 1275 |         for (col_idx, col_metadata) in column_meta.column_metadatas.iter().enumerate() {
 1276 |             assert!(
 1277 |                 !col_metadata.pages.is_empty(),
 1278 |                 "Column {} has no pages",
 1279 |                 col_idx
 1280 |             );
 1281 | 
 1282 |             for (page_idx, page) in col_metadata.pages.iter().enumerate() {
 1283 |                 total_page_num += 1;
 1284 |                 let total_size: u64 = page.buffer_sizes.iter().sum();
 1285 |                 assert!(
 1286 |                     total_size <= 1024 * 1024,
 1287 |                     "Column {} Page {} size {} exceeds 1MB limit",
 1288 |                     col_idx,
 1289 |                     page_idx,
 1290 |                     total_size
 1291 |                 );
 1292 |             }
 1293 |         }
 1294 | 
 1295 |         assert_eq!(total_page_num, 8)
 1296 |     }
 1297 | 
 1298 |     fn assert_zero_max_page_bytes_error(error: lance_core::Error) {
 1299 |         assert!(
 1300 |             matches!(error, lance_core::Error::InvalidInput { .. }),
 1301 |             "unexpected error: {error:?}"
 1302 |         );
 1303 |         assert!(
 1304 |             error
 1305 |                 .to_string()
 1306 |                 .contains("max_page_bytes must be greater than 0, got 0")
 1307 |         );
 1308 |     }
 1309 | 
 1310 |     #[rstest]
 1311 |     #[case::schema_writer(false)]
 1312 |     #[case::lazy_writer(true)]
 1313 |     #[tokio::test]
 1314 |     async fn test_zero_max_page_bytes_rejected(#[case] lazy: bool) {
 1315 |         let path = TempObjFile::default();
 1316 |         let object_store = ObjectStore::local();
 1317 |         let object_writer = object_store.create(&path).await.unwrap();
 1318 |         let options = FileWriterOptions {
 1319 |             max_page_bytes: Some(0),
 1320 |             ..Default::default()
 1321 |         };
 1322 | 
 1323 |         let error = if lazy {
 1324 |             let mut writer =
 1325 |                 versions::create_lazy_writer(ConcreteFileVersion::V2_0, object_writer, options)
 1326 |                     .unwrap();
 1327 |             let batch = arrow_array::record_batch!(("data", UInt64, [1])).unwrap();
 1328 |             writer.write_batch(&batch).await.unwrap_err()
 1329 |         } else {
 1330 |             let schema = LanceSchema::try_from(&Schema::new(vec![Field::new(
 1331 |                 "data",
 1332 |                 DataType::UInt64,
 1333 |                 false,
 1334 |             )]))
 1335 |             .unwrap();
 1336 |             versions::create_writer(ConcreteFileVersion::V2_0, object_writer, schema, options)
 1337 |                 .err()
 1338 |                 .expect("zero max_page_bytes should fail")
 1339 |         };
 1340 | 
 1341 |         assert_zero_max_page_bytes_error(error);
 1342 |     }
 1343 | 
 1344 |     #[tokio::test]
 1345 |     async fn test_v2_0_writer_rejects_zero_max_page_bytes() {
 1346 |         let path = TempObjFile::default();
 1347 |         let object_store = ObjectStore::local();
 1348 |         let object_writer = object_store.create(&path).await.unwrap();
 1349 |         let schema = LanceSchema::try_from(&Schema::new(vec![Field::new(
 1350 |             "data",
 1351 |             DataType::UInt64,
 1352 |             false,
 1353 |         )]))
 1354 |         .unwrap();
 1355 |         let options = FileWriterOptions {
 1356 |             max_page_bytes: Some(0),
 1357 |             ..Default::default()
 1358 |         };
 1359 | 
 1360 |         let error = versions::v2_0::create_writer(object_writer, schema, options)
 1361 |             .err()
 1362 |             .expect("zero max_page_bytes should fail");
 1363 |         assert_zero_max_page_bytes_error(error);
 1364 |     }
 1365 | 
 1366 |     #[tokio::test]
 1367 |     async fn test_v2_1_lazy_writer_rejects_zero_max_page_bytes() {
 1368 |         let path = TempObjFile::default();
 1369 |         let object_store = ObjectStore::local();
 1370 |         let object_writer = object_store.create(&path).await.unwrap();
 1371 |         let options = FileWriterOptions {
 1372 |             max_page_bytes: Some(0),
 1373 |             ..Default::default()
 1374 |         };
 1375 |         let batch = arrow_array::record_batch!(("data", UInt64, [1])).unwrap();
 1376 | 
 1377 |         let mut writer = versions::v2_1::create_lazy_writer(object_writer, options);
 1378 |         let error = writer.write_batch(&batch).await.unwrap_err();
 1379 |         assert_zero_max_page_bytes_error(error);
 1380 |     }
 1381 | 
 1382 |     #[tokio::test(flavor = "current_thread")]
 1383 |     async fn test_max_page_bytes_env_var() {
 1384 |         let arrow_field = Field::new("data", DataType::UInt64, false);
 1385 |         let arrow_schema = Schema::new(vec![arrow_field]);
 1386 |         let lance_schema = LanceSchema::try_from(&arrow_schema).unwrap();
 1387 |         // 4MiB
 1388 |         let data: Vec<u64> = (0..500_000).collect();
 1389 |         let array = UInt64Array::from(data);
 1390 |         let batch =
 1391 |             RecordBatch::try_new(arrow_schema.clone().into(), vec![Arc::new(array)]).unwrap();
 1392 | 
 1393 |         // 2MiB
 1394 |         unsafe {
 1395 |             std::env::set_var(ENV_LANCE_FILE_WRITER_MAX_PAGE_BYTES, "2097152");
 1396 |         }
 1397 | 
 1398 |         let options = FileWriterOptions {
 1399 |             max_page_bytes: None, // enforce env
 1400 |             ..Default::default()
 1401 |         };
 1402 | 
 1403 |         let path = TempObjFile::default();
 1404 |         let object_store = ObjectStore::local();
 1405 |         let mut writer = create_writer(
 1406 |             object_store.create(&path).await.unwrap(),
 1407 |             lance_schema.clone(),
 1408 |             ConcreteFileVersion::V2_1,
 1409 |             options,
 1410 |         )
 1411 |         .unwrap();
 1412 | 
 1413 |         writer.write_batch(&batch).await.unwrap();
 1414 |         writer.finish().await.unwrap();
 1415 | 
 1416 |         let fs = FsFixture::default();
 1417 |         let file_scheduler = fs
 1418 |             .scheduler
 1419 |             .open_file(&path, &CachedFileSize::unknown())
 1420 |             .await
 1421 |             .unwrap();
 1422 |         let file_reader = FileReader::try_open(
 1423 |             file_scheduler,
 1424 |             None,
 1425 |             Arc::<DecoderPlugins>::default(),
 1426 |             &LanceCache::no_cache(),
 1427 |             FileReaderOptions::default(),
 1428 |         )
 1429 |         .await
 1430 |         .unwrap();
 1431 | 
 1432 |         for col_metadata in file_reader.metadata().column_metadatas.iter() {
 1433 |             for page in col_metadata.pages.iter() {
 1434 |                 let total_size: u64 = page.buffer_sizes.iter().sum();
 1435 |                 assert!(
 1436 |                     total_size <= 2 * 1024 * 1024,
 1437 |                     "Page size {} exceeds 2MB limit",
 1438 |                     total_size
 1439 |                 );
 1440 |             }
 1441 |         }
 1442 | 
 1443 |         unsafe {
 1444 |             std::env::set_var(ENV_LANCE_FILE_WRITER_MAX_PAGE_BYTES, "");
 1445 |         }
 1446 |     }
 1447 | 
 1448 |     #[tokio::test]
 1449 |     async fn test_compression_overrides_end_to_end() {
 1450 |         // Create test schema with different column types
 1451 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![
 1452 |             ArrowField::new("customer_id", DataType::Int32, false),
 1453 |             ArrowField::new("product_id", DataType::Int32, false),
 1454 |             ArrowField::new("quantity", DataType::Int32, false),
 1455 |             ArrowField::new("price", DataType::Float32, false),
 1456 |             ArrowField::new("description", DataType::Utf8, false),
 1457 |         ]));
 1458 | 
 1459 |         let lance_schema = LanceSchema::try_from(arrow_schema.as_ref()).unwrap();
 1460 | 
 1461 |         // Create test data with patterns suitable for different compression
 1462 |         let mut customer_ids = Int32Builder::new();
 1463 |         let mut product_ids = Int32Builder::new();
 1464 |         let mut quantities = Int32Builder::new();
 1465 |         let mut prices = Float32Builder::new();
 1466 |         let mut descriptions = Vec::new();
 1467 | 
 1468 |         // Generate data with specific patterns:
 1469 |         // - customer_id: highly repetitive (good for RLE)
 1470 |         // - product_id: moderately repetitive (good for RLE)
 1471 |         // - quantity: random values (not good for RLE)
 1472 |         // - price: some repetition
 1473 |         // - description: long strings (good for Zstd)
 1474 |         for i in 0..10000 {
 1475 |             // Customer ID repeats every 100 rows (100 unique customers)
 1476 |             // This creates runs of 100 identical values
 1477 |             customer_ids.append_value(i / 100);
 1478 | 
 1479 |             // Product ID has only 5 unique values with long runs
 1480 |             product_ids.append_value(i / 2000);
 1481 | 
 1482 |             // Quantity is mostly 1 with occasional other values
 1483 |             quantities.append_value(if i % 10 == 0 { 5 } else { 1 });
 1484 | 
 1485 |             // Price has only 3 unique values
 1486 |             prices.append_value(match i % 3 {
 1487 |                 0 => 9.99,
 1488 |                 1 => 19.99,
 1489 |                 _ => 29.99,
 1490 |             });
 1491 | 
 1492 |             // Descriptions are repetitive but we'll keep them simple
 1493 |             descriptions.push(format!("Product {}", i / 2000));
 1494 |         }
 1495 | 
 1496 |         let batch = RecordBatch::try_new(
 1497 |             arrow_schema.clone(),
 1498 |             vec![
 1499 |                 Arc::new(customer_ids.finish()),
 1500 |                 Arc::new(product_ids.finish()),
 1501 |                 Arc::new(quantities.finish()),
 1502 |                 Arc::new(prices.finish()),
 1503 |                 Arc::new(StringArray::from(descriptions)),
 1504 |             ],
 1505 |         )
 1506 |         .unwrap();
 1507 | 
 1508 |         // Configure compression parameters
 1509 |         let mut params = CompressionParams::new();
 1510 | 
 1511 |         // RLE for ID columns (ends with _id)
 1512 |         params.columns.insert(
 1513 |             "*_id".to_string(),
 1514 |             CompressionFieldParams {
 1515 |                 rle_threshold: Some(0.5), // Lower threshold to trigger RLE more easily
 1516 |                 compression: None,        // Will use default compression if any
 1517 |                 compression_level: None,
 1518 |                 bss: Some(lance_encoding::compression_config::BssMode::Off), // Explicitly disable BSS to ensure RLE is used
 1519 |                 minichunk_size: None,
 1520 |             },
 1521 |         );
 1522 | 
 1523 |         // For now, we'll skip Zstd compression since it's not imported
 1524 |         // In a real implementation, you could add other compression types here
 1525 | 
 1526 |         // Configure file writer options
 1527 |         let options = FileWriterOptions {
 1528 |             max_page_bytes: Some(64 * 1024), // 64KB pages
 1529 |             ..Default::default()
 1530 |         };
 1531 | 
 1532 |         // Write the file
 1533 |         let path = TempObjFile::default();
 1534 |         let object_store = ObjectStore::local();
 1535 | 
 1536 |         let mut writer = create_v2_1_writer_with_compression(
 1537 |             object_store.create(&path).await.unwrap(),
 1538 |             lance_schema.clone(),
 1539 |             options,
 1540 |             params,
 1541 |         )
 1542 |         .unwrap();
 1543 | 
 1544 |         writer.write_batch(&batch).await.unwrap();
 1545 |         writer.add_schema_metadata("compression_test", "configured_compression");
 1546 |         writer.finish().await.unwrap();
 1547 | 
 1548 |         // Now write the same data without compression overrides for comparison
 1549 |         let path_no_compression = TempObjFile::default();
 1550 |         let default_options = FileWriterOptions {
 1551 |             max_page_bytes: Some(64 * 1024),
 1552 |             ..Default::default()
 1553 |         };
 1554 | 
 1555 |         let mut writer_no_compression = create_writer(
 1556 |             object_store.create(&path_no_compression).await.unwrap(),
 1557 |             lance_schema.clone(),
 1558 |             ConcreteFileVersion::V2_1,
 1559 |             default_options,
 1560 |         )
 1561 |         .unwrap();
 1562 | 
 1563 |         writer_no_compression.write_batch(&batch).await.unwrap();
 1564 |         writer_no_compression.finish().await.unwrap();
 1565 | 
 1566 |         // Note: With our current data patterns and RLE compression, the compressed file
 1567 |         // might actually be slightly larger due to compression metadata overhead.
 1568 |         // This is expected and the test is mainly to verify the system works end-to-end.
 1569 | 
 1570 |         // Read back the compressed file and verify data integrity
 1571 |         let fs = FsFixture::default();
 1572 |         let file_scheduler = fs
 1573 |             .scheduler
 1574 |             .open_file(&path, &CachedFileSize::unknown())
 1575 |             .await
 1576 |             .unwrap();
 1577 | 
 1578 |         let file_reader = FileReader::try_open(
 1579 |             file_scheduler,
 1580 |             None,
 1581 |             Arc::<DecoderPlugins>::default(),
 1582 |             &LanceCache::no_cache(),
 1583 |             FileReaderOptions::default(),
 1584 |         )
 1585 |         .await
 1586 |         .unwrap();
 1587 | 
 1588 |         // Verify metadata
 1589 |         let metadata = file_reader.metadata();
 1590 |         assert_eq!(metadata.version(), ConcreteFileVersion::V2_1);
 1591 | 
 1592 |         let schema = file_reader.schema();
 1593 |         assert_eq!(
 1594 |             schema.metadata.get("compression_test"),
 1595 |             Some(&"configured_compression".to_string())
 1596 |         );
 1597 | 
 1598 |         // Verify the actual encodings used
 1599 |         let column_metadatas = &metadata.column_metadatas;
 1600 | 
 1601 |         // Check customer_id column (index 0) - should use RLE due to our configuration
 1602 |         assert!(!column_metadatas[0].pages.is_empty());
 1603 |         let customer_id_encoding = describe_encoding(&column_metadatas[0].pages[0]);
 1604 |         assert!(
 1605 |             customer_id_encoding.contains("RLE") || customer_id_encoding.contains("Rle"),
 1606 |             "customer_id column should use RLE encoding due to '*_id' pattern match, but got: {}",
 1607 |             customer_id_encoding
 1608 |         );
 1609 | 
 1610 |         // Check product_id column (index 1) - should use RLE due to our configuration
 1611 |         assert!(!column_metadatas[1].pages.is_empty());
 1612 |         let product_id_encoding = describe_encoding(&column_metadatas[1].pages[0]);
 1613 |         assert!(
 1614 |             product_id_encoding.contains("RLE") || product_id_encoding.contains("Rle"),
 1615 |             "product_id column should use RLE encoding due to '*_id' pattern match, but got: {}",
 1616 |             product_id_encoding
 1617 |         );
 1618 |     }
 1619 | 
 1620 |     #[tokio::test]
 1621 |     async fn test_field_metadata_compression() {
 1622 |         // Test that field metadata compression settings are respected
 1623 |         let mut metadata = HashMap::new();
 1624 |         metadata.insert(
 1625 |             lance_encoding::constants::COMPRESSION_META_KEY.to_string(),
 1626 |             "zstd".to_string(),
 1627 |         );
 1628 |         metadata.insert(
 1629 |             lance_encoding::constants::COMPRESSION_LEVEL_META_KEY.to_string(),
 1630 |             "6".to_string(),
 1631 |         );
 1632 | 
 1633 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![
 1634 |             ArrowField::new("id", DataType::Int32, false),
 1635 |             ArrowField::new("text", DataType::Utf8, false).with_metadata(metadata.clone()),
 1636 |             ArrowField::new("data", DataType::Int32, false).with_metadata(HashMap::from([(
 1637 |                 lance_encoding::constants::COMPRESSION_META_KEY.to_string(),
 1638 |                 "none".to_string(),
 1639 |             )])),
 1640 |         ]));
 1641 | 
 1642 |         let lance_schema = LanceSchema::try_from(arrow_schema.as_ref()).unwrap();
 1643 | 
 1644 |         // Create test data
 1645 |         let id_array = Int32Array::from_iter_values(0..1000);
 1646 |         let text_array = StringArray::from_iter_values(
 1647 |             (0..1000).map(|i| format!("test string {} repeated text", i)),
 1648 |         );
 1649 |         let data_array = Int32Array::from_iter_values((0..1000).map(|i| i * 2));
 1650 | 
 1651 |         let batch = RecordBatch::try_new(
 1652 |             arrow_schema.clone(),
 1653 |             vec![
 1654 |                 Arc::new(id_array),
 1655 |                 Arc::new(text_array),
 1656 |                 Arc::new(data_array),
 1657 |             ],
 1658 |         )
 1659 |         .unwrap();
 1660 | 
 1661 |         let path = TempObjFile::default();
 1662 |         let object_store = ObjectStore::local();
 1663 | 
 1664 |         // Create encoding strategy that will read from field metadata
 1665 |         let params = CompressionParams::new();
 1666 |         let options = FileWriterOptions::default();
 1667 |         let mut writer = create_v2_1_writer_with_compression(
 1668 |             object_store.create(&path).await.unwrap(),
 1669 |             lance_schema.clone(),
 1670 |             options,
 1671 |             params,
 1672 |         )
 1673 |         .unwrap();
 1674 | 
 1675 |         writer.write_batch(&batch).await.unwrap();
 1676 |         writer.finish().await.unwrap();
 1677 | 
 1678 |         // Read back metadata
 1679 |         let fs = FsFixture::default();
 1680 |         let file_scheduler = fs
 1681 |             .scheduler
 1682 |             .open_file(&path, &CachedFileSize::unknown())
 1683 |             .await
 1684 |             .unwrap();
 1685 |         let file_reader = FileReader::try_open(
 1686 |             file_scheduler,
 1687 |             None,
 1688 |             Arc::<DecoderPlugins>::default(),
 1689 |             &LanceCache::no_cache(),
 1690 |             FileReaderOptions::default(),
 1691 |         )
 1692 |         .await
 1693 |         .unwrap();
 1694 | 
 1695 |         let column_metadatas = &file_reader.metadata().column_metadatas;
 1696 | 
 1697 |         // The text column (index 1) should use zstd compression based on metadata
 1698 |         let text_encoding = describe_encoding(&column_metadatas[1].pages[0]);
 1699 |         // For string columns, we expect Binary encoding with zstd compression
 1700 |         assert!(
 1701 |             text_encoding.contains("Zstd"),
 1702 |             "text column should use zstd compression from field metadata, but got: {}",
 1703 |             text_encoding
 1704 |         );
 1705 | 
 1706 |         // The data column (index 2) should use no compression based on metadata
 1707 |         let data_encoding = describe_encoding(&column_metadatas[2].pages[0]);
 1708 |         // For Int32 columns with "none" compression, we expect Flat encoding without compression
 1709 |         assert!(
 1710 |             data_encoding.contains("Flat") && data_encoding.contains("compression: None"),
 1711 |             "data column should use no compression from field metadata, but got: {}",
 1712 |             data_encoding
 1713 |         );
 1714 |     }
 1715 | 
 1716 |     #[tokio::test]
 1717 |     async fn test_field_metadata_rle_threshold() {
 1718 |         // Test that RLE threshold from field metadata is respected
 1719 |         let mut metadata = HashMap::new();
 1720 |         metadata.insert(
 1721 |             lance_encoding::constants::RLE_THRESHOLD_META_KEY.to_string(),
 1722 |             "0.9".to_string(),
 1723 |         );
 1724 |         // Also set compression to ensure RLE is used
 1725 |         metadata.insert(
 1726 |             lance_encoding::constants::COMPRESSION_META_KEY.to_string(),
 1727 |             "lz4".to_string(),
 1728 |         );
 1729 |         // Explicitly disable BSS to ensure RLE is tested
 1730 |         metadata.insert(
 1731 |             lance_encoding::constants::BSS_META_KEY.to_string(),
 1732 |             "off".to_string(),
 1733 |         );
 1734 | 
 1735 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![
 1736 |             ArrowField::new("status", DataType::Int32, false).with_metadata(metadata),
 1737 |         ]));
 1738 | 
 1739 |         let lance_schema = LanceSchema::try_from(arrow_schema.as_ref()).unwrap();
 1740 | 
 1741 |         // Create data with very high repetition (3 runs for 10000 values = 0.0003 ratio)
 1742 |         let status_array = Int32Array::from_iter_values(
 1743 |             std::iter::repeat_n(200, 8000)
 1744 |                 .chain(std::iter::repeat_n(404, 1500))
 1745 |                 .chain(std::iter::repeat_n(500, 500)),
 1746 |         );
 1747 | 
 1748 |         let batch =
 1749 |             RecordBatch::try_new(arrow_schema.clone(), vec![Arc::new(status_array)]).unwrap();
 1750 | 
 1751 |         let path = TempObjFile::default();
 1752 |         let object_store = ObjectStore::local();
 1753 | 
 1754 |         // Create encoding strategy that will read from field metadata
 1755 |         let params = CompressionParams::new();
 1756 |         let options = FileWriterOptions::default();
 1757 |         let mut writer = create_v2_1_writer_with_compression(
 1758 |             object_store.create(&path).await.unwrap(),
 1759 |             lance_schema.clone(),
 1760 |             options,
 1761 |             params,
 1762 |         )
 1763 |         .unwrap();
 1764 | 
 1765 |         writer.write_batch(&batch).await.unwrap();
 1766 |         writer.finish().await.unwrap();
 1767 | 
 1768 |         // Read back and check encoding
 1769 |         let fs = FsFixture::default();
 1770 |         let file_scheduler = fs
 1771 |             .scheduler
 1772 |             .open_file(&path, &CachedFileSize::unknown())
 1773 |             .await
 1774 |             .unwrap();
 1775 |         let file_reader = FileReader::try_open(
 1776 |             file_scheduler,
 1777 |             None,
 1778 |             Arc::<DecoderPlugins>::default(),
 1779 |             &LanceCache::no_cache(),
 1780 |             FileReaderOptions::default(),
 1781 |         )
 1782 |         .await
 1783 |         .unwrap();
 1784 | 
 1785 |         let column_metadatas = &file_reader.metadata().column_metadatas;
 1786 |         let status_encoding = describe_encoding(&column_metadatas[0].pages[0]);
 1787 |         assert!(
 1788 |             status_encoding.contains("RLE") || status_encoding.contains("Rle"),
 1789 |             "status column should use RLE encoding due to metadata threshold, but got: {}",
 1790 |             status_encoding
 1791 |         );
 1792 |     }
 1793 | 
 1794 |     #[tokio::test]
 1795 |     async fn test_large_page_split_on_read() {
 1796 |         use arrow_array::Array;
 1797 |         use futures::TryStreamExt;
 1798 |         use lance_encoding::decoder::FilterExpression;
 1799 |         use lance_io::ReadBatchParams;
 1800 | 
 1801 |         // Test that large pages written with relaxed limits can be split during read
 1802 | 
 1803 |         let arrow_field = ArrowField::new("data", DataType::Binary, false);
 1804 |         let arrow_schema = ArrowSchema::new(vec![arrow_field]);
 1805 |         let lance_schema = LanceSchema::try_from(&arrow_schema).unwrap();
 1806 | 
 1807 |         // Create a large binary value (40MB) to trigger large page creation
 1808 |         let large_value = vec![42u8; 40 * 1024 * 1024];
 1809 |         let array = arrow_array::BinaryArray::from(vec![
 1810 |             Some(large_value.as_slice()),
 1811 |             Some(b"small value"),
 1812 |         ]);
 1813 |         let batch = RecordBatch::try_new(Arc::new(arrow_schema), vec![Arc::new(array)]).unwrap();
 1814 | 
 1815 |         // Write with relaxed page size limit (128MB)
 1816 |         let options = FileWriterOptions {
 1817 |             max_page_bytes: Some(128 * 1024 * 1024),
 1818 |             ..Default::default()
 1819 |         };
 1820 | 
 1821 |         let fs = FsFixture::default();
 1822 |         let path = fs.tmp_path;
 1823 | 
 1824 |         let mut writer = create_writer(
 1825 |             fs.object_store.create(&path).await.unwrap(),
 1826 |             lance_schema.clone(),
 1827 |             ConcreteFileVersion::V2_1,
 1828 |             options,
 1829 |         )
 1830 |         .unwrap();
 1831 | 
 1832 |         writer.write_batch(&batch).await.unwrap();
 1833 |         let write_summary = writer.finish().await.unwrap();
 1834 |         assert_eq!(write_summary.num_rows, 2);
 1835 |         assert_eq!(
 1836 |             write_summary.size_bytes,
 1837 |             fs.object_store.size(&path).await.unwrap()
 1838 |         );
 1839 | 
 1840 |         // Read back with split configuration
 1841 |         let file_scheduler = fs
 1842 |             .scheduler
 1843 |             .open_file(&path, &CachedFileSize::unknown())
 1844 |             .await
 1845 |             .unwrap();
 1846 | 
 1847 |         // Configure reader to split pages larger than 10MB into chunks
 1848 |         let reader_options = FileReaderOptions {
 1849 |             read_chunk_size: 10 * 1024 * 1024, // 10MB chunks
 1850 |             ..Default::default()
 1851 |         };
 1852 | 
 1853 |         let file_reader = FileReader::try_open(
 1854 |             file_scheduler,
 1855 |             None,
 1856 |             Arc::<DecoderPlugins>::default(),
 1857 |             &LanceCache::no_cache(),
 1858 |             reader_options,
 1859 |         )
 1860 |         .await
 1861 |         .unwrap();
 1862 | 
 1863 |         // Read the data back
 1864 |         let stream = file_reader
 1865 |             .read_stream(
 1866 |                 ReadBatchParams::RangeFull,
 1867 |                 1024,
 1868 |                 10, // batch_readahead
 1869 |                 FilterExpression::no_filter(),
 1870 |             )
 1871 |             .await
 1872 |             .unwrap();
 1873 | 
 1874 |         let batches: Vec<RecordBatch> = stream.try_collect().await.unwrap();
 1875 |         assert_eq!(batches.len(), 1);
 1876 | 
 1877 |         // Verify the data is correctly read despite splitting
 1878 |         let read_array = batches[0].column(0);
 1879 |         let read_binary = read_array
 1880 |             .as_any()
 1881 |             .downcast_ref::<arrow_array::BinaryArray>()
 1882 |             .unwrap();
 1883 | 
 1884 |         assert_eq!(read_binary.len(), 2);
 1885 |         assert_eq!(read_binary.value(0).len(), 40 * 1024 * 1024);
 1886 |         assert_eq!(read_binary.value(1), b"small value");
 1887 | 
 1888 |         // Verify first value matches what we wrote
 1889 |         assert!(read_binary.value(0).iter().all(|&b| b == 42u8));
 1890 |     }
 1891 | 
 1892 |     fn spill_config() -> (TempObjFile, Arc<ObjectStore>) {
 1893 |         let spill_path = TempObjFile::default();
 1894 |         (spill_path, Arc::new(ObjectStore::local()))
 1895 |     }
 1896 | 
 1897 |     fn make_batches(num_batches: i32, num_cols: usize, rows_per_batch: i32) -> Vec<RecordBatch> {
 1898 |         let fields: Vec<_> = (0..num_cols)
 1899 |             .map(|c| ArrowField::new(format!("c{c}"), DataType::Int32, false))
 1900 |             .collect();
 1901 |         let schema = Arc::new(ArrowSchema::new(fields));
 1902 |         (0..num_batches)
 1903 |             .map(|i| {
 1904 |                 let cols: Vec<Arc<dyn arrow_array::Array>> = (0..num_cols)
 1905 |                     .map(|c| {
 1906 |                         let start = (i * rows_per_batch + c as i32) * 100;
 1907 |                         Arc::new(Int32Array::from_iter_values(start..start + rows_per_batch))
 1908 |                             as Arc<dyn arrow_array::Array>
 1909 |                     })
 1910 |                     .collect();
 1911 |                 RecordBatch::try_new(schema.clone(), cols).unwrap()
 1912 |             })
 1913 |             .collect()
 1914 |     }
 1915 | 
 1916 |     async fn write_and_read_batches(
 1917 |         batches: &[RecordBatch],
 1918 |         spill: Option<(Arc<ObjectStore>, object_store::path::Path)>,
 1919 |     ) -> Vec<RecordBatch> {
 1920 |         let fs = FsFixture::default();
 1921 |         let lance_schema = LanceSchema::try_from(batches[0].schema().as_ref()).unwrap();
 1922 |         let writer = fs.object_store.create(&fs.tmp_path).await.unwrap();
 1923 |         let mut file_writer = create_writer(
 1924 |             writer,
 1925 |             lance_schema,
 1926 |             ConcreteFileVersion::V2_1,
 1927 |             FileWriterOptions::default(),
 1928 |         )
 1929 |         .unwrap();
 1930 |         if let Some((store, path)) = spill {
 1931 |             file_writer = file_writer.with_page_metadata_spill(store, path);
 1932 |         }
 1933 |         for batch in batches {
 1934 |             file_writer.write_batch(batch).await.unwrap();
 1935 |         }
 1936 |         file_writer.add_schema_metadata("foo", "bar");
 1937 |         file_writer.finish().await.unwrap();
 1938 | 
 1939 |         crate::testing::read_lance_file(
 1940 |             &fs,
 1941 |             Arc::<DecoderPlugins>::default(),
 1942 |             lance_encoding::decoder::FilterExpression::no_filter(),
 1943 |         )
 1944 |         .await
 1945 |     }
 1946 | 
 1947 |     #[rstest::rstest]
 1948 |     #[case::multi_col(20, 2, 100)]
 1949 |     #[case::many_batches(50, 2, 100)]
 1950 |     #[tokio::test]
 1951 |     async fn test_page_metadata_spill_roundtrip(
 1952 |         #[case] num_batches: i32,
 1953 |         #[case] num_cols: usize,
 1954 |         #[case] rows_per_batch: i32,
 1955 |     ) {
 1956 |         let batches = make_batches(num_batches, num_cols, rows_per_batch);
 1957 |         let baseline = write_and_read_batches(&batches, None).await;
 1958 |         let (spill_path, spill_store) = spill_config();
 1959 |         let spilled =
 1960 |             write_and_read_batches(&batches, Some((spill_store, spill_path.as_ref().clone())))
 1961 |                 .await;
 1962 |         assert_eq!(baseline, spilled);
 1963 |     }
 1964 | 
 1965 |     #[tokio::test]
 1966 |     async fn test_page_metadata_spill_many_columns() {
 1967 |         // Many columns forces small per-column buffer limits, exercising mid-write flushing.
 1968 |         let batches = make_batches(10, 500, 100);
 1969 |         let baseline = write_and_read_batches(&batches, None).await;
 1970 |         let (spill_path, spill_store) = spill_config();
 1971 |         let spilled =
 1972 |             write_and_read_batches(&batches, Some((spill_store, spill_path.as_ref().clone())))
 1973 |                 .await;
 1974 |         assert_eq!(baseline, spilled);
 1975 |     }
 1976 | }
``````
