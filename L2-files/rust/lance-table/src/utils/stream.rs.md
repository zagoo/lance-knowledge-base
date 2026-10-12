> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-04: [current-source addendum](../../../../../refresh-addenda/2026-10-04-ad12ed9e.md) for `ad12ed9e15e0046688b00568d0ac1a347fb2d328`.

# rust/lance-table/src/utils/stream.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `565cec0f3c2606efcb3453240d5549dc3093d23c6d15ed782eab22d53fb38661`. Reviewed physical lines: 1-1887.

[Module](../../../../../L1-modules/rust-lance-table-stream.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public task-stream alignment and row-ID/address/version/deletion materialization over already scheduled batch futures. Private state preserves ordered metadata cursor expansion while allowing later batch futures to execute concurrently. (rust/lance-table/src/utils/stream.rs:1-1887)

## Complete range analysis

### Lines 1-28

SPDX and imports: fmt, Arc/OnceLock; Arrow arrays/schema/validity; futures boxed/shared/ordered streams; RecordBatchExt; core errors and four system-field constants; RowAddress/DeletionVector; ReadBatchParams; tracing; row-ID sequence/cursor. No local feature gate, filesystem API, runtime creation or unsafe block. (rust/lance-table/src/utils/stream.rs:1-28)

### Lines 29-40

Public ReadBatchFut is BoxFuture<'static,Result<RecordBatch>>. Public ReadBatchTask exposes task plus declared num_rows:u32; public task/future stream aliases are boxed static streams. Private SharedReadBatchFut changes errors to Arc<Error> so futures::Shared can clone results. Declared row count is a scheduling contract, not validated by the type. (rust/lance-table/src/utils/stream.rs:29-40)

### Lines 41-62

Private Debug SharedReadError owns Arc<Error>, delegates Display and exposes original Error through source(). Splitting later wraps this adapter in Error::Wrapped, preserving source but changing the outer variant. PendingReadBatch stores optional original/shared future and u32 consumed offset/remaining rows. (rust/lance-table/src/utils/stream.rs:41-62)

### Lines 63-89

PendingReadBatch::new retains the input future and declared count, with no shared wrapper and offset zero. take debug-asserts requested count <= remaining. An unsplit whole take marks remaining zero and moves the original future directly, preserving its error variant and batch without slicing. Missing original task becomes an asynchronously returned Internal error, not a panic. (rust/lance-table/src/utils/stream.rs:63-89)

### Lines 90-118

On first partial take, lazily move original task into a boxed Shared future that maps failures to Arc; missing task produces Internal. Clone shared handle per slice, capture offset, advance/subtract u32 counters, and return a future awaiting shared completion then batch.slice(offset,count). Errors become Wrapped SharedReadError. Sibling slices share one execution and Arrow buffers; surviving handles can retain the entire input batch/error. Invalid declared lengths can make batch.slice panic. No task spawn or explicit abort is added. (rust/lance-table/src/utils/stream.rs:90-118)

### Lines 119-160

Private MergeStream owns input streams, one optional pending chunk per stream and next poll index. emit chooses minimum remaining rows (zero allowed), queues one take from each present chunk into FuturesOrdered, and clears depleted slots. Returned future awaits first result then merges later batches in stream order; first error short-circuits. Empty queued input yields Internal. FuturesOrdered permits concurrent polling with ordered yielding, but this function itself spawns no runtime tasks. RecordBatchExt merge checks equal actual row counts and preserves left schema metadata; matching names may merge nested structures or keep left values rather than duplicate all columns (rust/lance-arrow/src/lib.rs:657-677; rust/lance-arrow/src/lib.rs:1231-1332). (rust/lance-table/src/utils/stream.rs:119-160)

### Lines 161-193

MergeStream::poll_next emits when every pending slot is populated. Otherwise it rotates past filled slots and polls the next empty slot; a ready task becomes PendingReadBatch, any exhausted input ends output immediately, and Pending returns without polling subsequent missing streams that time. It does not compare total lengths, drain trailing inputs or add a fused terminal flag. Polling this stream schedules chunks but does not await their batch futures. Construction guarantees nonempty streams before indexing/modulo. (rust/lance-table/src/utils/stream.rs:161-193)

### Lines 194-216

Public merge_streams consumes Vec<ReadBatchTaskStream>; no inputs returns an empty boxed stream, otherwise initialize equally sized None slots/index zero. Documented alignment handles differing batch boundaries and stops at shortest input without checking others ended. Column-order description applies to disjoint names; delegated merging handles collisions as described above. Caller must ensure streams represent the same physical row ordering, not merely equal counts. (rust/lance-table/src/utils/stream.rs:194-216)

### Lines 217-234

Private apply_deletions_as_nulls turns mask.values into a validity NullBuffer, ignoring any BooleanArray null bitmap. True means live. All-valid mask returns original batch. Rationale is avoiding filter copies and preserving physical row alignment for column rewrites; performance benefit is a comment, not measured here. Internal deletion predicates supply nonnull booleans. (rust/lance-table/src/utils/stream.rs:217-234)

### Lines 235-264

For each schema field/column pair, only names _rowid and _rowaddr receive union of existing nulls and deletion mask (validity AND). Rebuild ArrayData with merged null buffer and propagate builder errors; all other columns clone Arc handles unchanged, including payload and version columns. Reconstruct with original schema and explicit row count. If neither named ID/address column exists, null-mode deletes no visible values; no local rejection enforces the upstream contract. (rust/lance-table/src/utils/stream.rs:235-264)

### Lines 265-290

version_values_for_selection_with_cursor slices params by selected-position batch offset/count and unwraps slice/to_ranges errors. With exactly one run, repeat its version num_rows times without checking run span/count or selected physical offsets against sequence length. The comment O(1) describes run lookup only: vector allocation/fill still scales with num_rows and selection construction can allocate. Otherwise allocate output capacity then extend each selected physical range through reusable version cursor, propagating its Result errors. (rust/lance-table/src/utils/stream.rs:265-290)

### Lines 291-315

Direct version_values_for_selection performs the same unwrapped selection construction before the single-run shortcut. Multi-run/empty sequences construct a fresh cursor and call the other helper, repeating selection construction; direct calls do not reuse cursor state across batches. Unknown/missing metadata defaults are supplied by caller below, not this helper. (rust/lance-table/src/utils/stream.rs:291-315)

### Lines 316-344

Public Debug RowIdAndDeletesConfig has public params; four independent with_row_id/addr/last_updated_at_version/created_at_version booleans; optional Arc deletion vector, row-ID sequence, and both version sequences; make_deletions_null; total_num_rows:u32. No Default/builder/validation exists here. The total count comment mentions RangeTo conversion, while actual local use is selected_row_count/read-ahead sizing. Presence of sequences alone does not request their output columns. (rust/lance-table/src/utils/stream.rs:316-344)

### Lines 345-369

Private has_system_cols ORs all four output switches. Public apply_row_id_and_deletes consumes a batch, selected-position offset, fragment ID and borrowed config, forwarding to the common transformer with empty precomputed columns and no schema cache. It performs synchronous CPU/Arrow work, with no IO or spawned tasks. (rust/lance-table/src/utils/stream.rs:345-369)

### Lines 370-389

Default private PrecomputedSystemColumns stores optional Result<Arc<UInt64Array>> for IDs and two versions, allowing eager metadata errors to be delivered by batch futures later. ROW_ID_READ_AHEAD_ROWS is 64*1024 (65,536), a target row count rather than a hard global memory cap. PrecomputedRowIdChunk records logical selected offset and Arc values; CachedOutputSchema retains input/output SchemaRef. (rust/lance-table/src/utils/stream.rs:370-389)

### Lines 390-405

Chunk end_offset uses ordinary offset+length. slice rejects starts before chunk with checked_sub and ranges beyond end, returns the same Arc for exact full coverage or an Arrow slice wrapped in a new Arc otherwise. Addition is unchecked. Slices share backing values and can keep a larger chunk alive after cache replacement. (rust/lance-table/src/utils/stream.rs:390-405)

### Lines 406-449

decode_row_id_chunk slices params and unwraps conversion to ranges. Exactly one range uses const-selected dense expansion or ordinary range expansion with reusable row-ID cursor; other shapes flatten ordered physical offsets through select_with_cursor, preserving requested order/duplicates. Require decoded length exactly chunk_len or CorruptFile named row ID metadata with selected offset, actual and required counts. Returns Arc values and logical offset. Sequence errors represented by truncation become explicit corruption here; malformed params may panic earlier. (rust/lance-table/src/utils/stream.rs:406-449)

### Lines 450-463

selected_row_count returns Range.len, sum of Ranges end-start casts, supplied total for RangeFull, end for RangeTo, saturating total-start for RangeFrom, or indices.len. It does not validate ranges against total, reject reversed/overflowed ranges, inspect index values/nulls or ensure u32 fit. This estimate bounds read-ahead, not all direct address-generation behavior. (rust/lance-table/src/utils/stream.rs:450-463)

### Lines 464-488

Common transformer is debug-instrumented skip_all. Unpack precomputed Results, normalize only Some(NoDeletions) to None, then debug-assert payload columns OR any system column OR a remaining vector. Empty Set/Bitmap are not normalized here. Debug assertions are not a public configuration validation boundary. (rust/lance-table/src/utils/stream.rs:464-488)

### Lines 489-515

Generate physical addresses when requested, when _rowid is requested without stable sequence, or whenever a non-NoDeletions vector exists. Cast batch.num_rows to u32 unchecked, slice config params at selected offset/count with unwrap, iterate physical u32 ranges and construct RowAddress(fragment_id,row_offset), allocating a Vec/UInt64Array. iter_offset_ranges errors propagate. Context: range endpoints cast to u32 and Indices consumes raw values ignoring validity, with ordinary i+1 arithmetic (rust/lance-io/src/lib.rs:248-260). total_num_rows is not used to validate these physical offsets. (rust/lance-table/src/utils/stream.rs:489-515)

### Lines 516-545

Requested stable IDs prefer precomputed Result, with only debug length assertion; otherwise flatten selected ranges and call RowIdSequence::select into a new array. Without stable sequence reuse the physical-address Arc. If IDs are not requested, ignore the supplied/precomputed ID data. Direct select does not use wrapper chunk-length corruption check; later batch construction may report length mismatch. (rust/lance-table/src/utils/stream.rs:516-545)

### Lines 546-559

Build deletion predicate from generated physical addresses using DeletionVector::build_predicate, not stable ID values. row_addrs unwrap relies on has_deletions forcing address generation. System-column vector reserves four entries and appends requested _rowid then _rowaddr, using canonical core fields and prebuilt arrays. (rust/lance-table/src/utils/stream.rs:546-559)

### Lines 560-591

Last-updated and created version columns independently prefer their precomputed Result, otherwise decode provided sequence through direct helper, otherwise allocate all ones (version 1). Output order is last-updated then created after ID/address. Missing sequence is not an error and does not use current manifest version. Version errors can occur before deletion removes the affected rows. (rust/lance-table/src/utils/stream.rs:560-591)

### Lines 592-628

No requested system columns returns input batch unchanged before deletion. Cached path initializes one OnceLock with the first completing batch input/output schema, appending four possible field declarations while preserving input metadata. Reuse output Arc for pointer-identical or structurally equal input schemas; unequal schemas get fresh output without replacing the first cache entry. Clone all input column Arcs, append system arrays, and use try_new_with_options with input row count. Cache path lacks the explicit duplicate-name check in incremental append (rust/lance-arrow/src/schema.rs:146-157); Arrow validation is delegated. (rust/lance-table/src/utils/stream.rs:592-628)

### Lines 629-641

Without schema cache, append each system column with RecordBatchExt::try_with_column, which rejects an existing field of the same name and constructs a new schema/batch per column (rust/lance-arrow/src/lib.rs:643-648; rust/lance-arrow/src/schema.rs:146-157). Finally return unchanged batch if predicate None; otherwise filter every column when make_deletions_null=false or null only ID/address fields when true. Empty filtered batches are returned, not suppressed. (rust/lance-table/src/utils/stream.rs:629-641)

### Lines 642-667

Public wrap_with_row_id_and_delete changes task stream into future stream because deletion can change actual row count. Create row-ID cursor only when sequence exists and with_row_id=true; cursor_with_dense_range_expansion chooses one const-generic implementation once per wrapper. No downstream buffering/concurrency limit is selected here. (rust/lance-table/src/utils/stream.rs:642-667)

### Lines 668-691

Private wrapper owns Arc config, Arc OnceLock schema cache, optional one current row-ID chunk, inferred uniform batch size and initially enabled fast paths. Compute selected count once. Create independent reusable version cursors only for requested sequences with more than one run; single-run/default versions are produced in batch futures. Offset begins zero and follows declared task rows. (rust/lance-table/src/utils/stream.rs:668-691)

### Lines 692-719

On each pulled task, clone config, capture prior offset and advance u32 offset by declared rows before awaiting input. First nonzero count defines uniform size. A differing nonzero size disables fast paths permanently only when its end is strictly before selected_rows; final short task is exempt, and zero tasks do not set/change size. Schema cache is attached only while fast paths enabled. Cursor expansion happens synchronously during ordered stream pull, so later concurrent completion cannot race those mutable cursors. (rust/lance-table/src/utils/stream.rs:692-719)

### Lines 720-745

For requested stable IDs, zero task yields empty array. Once fast paths disabled and current chunk exhausted/missing, clear it and decode exactly this task count. Otherwise reuse a fitting slice from current chunk even after disabling fast paths, draining existing cached data before exact decoding. Errors are stored in precomputed Result, not emitted as a stream item error at pull time. (rust/lance-table/src/utils/stream.rs:720-745)

### Lines 746-770

When batch straddles cached end, retain available prefix, compute missing suffix and new decode offset. Uniform path targets max(missing, batch_size*max(65536/batch_size,1)), then limits to selected rows remaining; irregular path decodes missing only. A task larger than 65,536 yields a chunk at least that task size, so constant is not a strict cap. Arithmetic uses checked/saturating operations in some places but ordinary offset additions elsewhere. (rust/lance-table/src/utils/stream.rs:746-770)

### Lines 771-798

Decode new chunk, require it can slice all missing rows or CorruptFile with actual and missing counts. Straddling prefix+suffix copies into a new task-sized Vec; otherwise return zero-copy suffix slice. Store new chunk for later tasks. Whole old/new/task buffers may coexist, and already emitted futures retain their slices, so one cached chunk does not bound total downstream memory. (rust/lance-table/src/utils/stream.rs:771-798)

### Lines 799-828

Requested multi-run last-updated and created sequences are expanded separately with mutable cursors while pulling tasks. Map each Result<Vec<u64>> into UInt64Array/Arc and keep failures as optional Results. Work is done even if the eventual input future fails or is never polled; dropping emitted futures discards their precomputed arrays. (rust/lance-table/src/utils/stream.rs:799-828)

### Lines 829-848

Map each original batch future: input error propagates first via batch?, otherwise run common transformer with captured offset/config/metadata/cache. Thus metadata error can be masked by earlier input failure. Output stream yields boxed futures; it does not await/spawn them or enforce advertised-versus-actual task size. Future completion order may differ while offset/cursor assignment stays input-task order. (rust/lance-table/src/utils/stream.rs:829-848)

### Lines 849-882

cfg(test) imports Arrow/DataGen/futures/IO wrappers and helpers. batch_task_stream converts Arrow error stream to Lance, unwraps each result to inspect row count, then produces an already-ready boxed task. This fixture helper cannot exercise an input error without panicking during scheduling; it does not simulate delayed IO. (rust/lance-table/src/utils/stream.rs:849-882)

### Lines 883-914

Basic zip creates x/y streams of ten 100-row batches, merges with buffered(1), collects and compares exact combined batches to a two-column generator. This asserts aligned columns/order for disjoint names; no mismatched totals or errors. (rust/lance-table/src/utils/stream.rs:883-914)

### Lines 915-944

Concurrent stable-ID/deletion fixture builds IDs 10000..120000 excluding multiples of13, encodes sequence, deletes every997th physical position, and chunks payload into257 rows. Config requests IDs and addresses, fragment7, real filtering and full selection. These are in-memory ready tasks; no file/store read occurs. (rust/lance-table/src/utils/stream.rs:915-944)

### Lines 945-992

Run wrapper buffered(8), collect output, extract ID/address columns and compare both against enumerated survivors with original physical offsets. Filtering must not renumber surviving addresses. Test checks correctness under buffered futures but imposes no timing or forced out-of-order-completion schedule. (rust/lance-table/src/utils/stream.rs:945-992)

### Lines 993-1041

Unsorted stable-ID fixture uses IDs100..140 excluding multiples of3, selection indices[8,2,9,1,6], declared task sizes[2,2,1], buffered3 and expected positional lookup in that exact order. No addresses/deletions/version columns requested. (rust/lance-table/src/utils/stream.rs:993-1041)

### Lines 1042-1081

Repeated-index boundary fixture extends row IDs0..5 with10..20, selects physical[4,4,5] across task sizes1,2 and asserts[4,4,10]. This protects duplicate selection across bulk/segment boundaries, not duplicate live IDs in the dataset. (rust/lance-table/src/utils/stream.rs:1042-1081)

### Lines 1082-1121

Read-ahead boundary fixture makes IDs10000..120000 excluding multiples11, selects physical range1234..71237 and emits1025-row tasks plus tail, with stable IDs only. Setup deliberately crosses a chunk boundary and includes nonzero selection start. (rust/lance-table/src/utils/stream.rs:1082-1121)

### Lines 1122-1156

Buffered8 output must have69 batches and tail303. Pointer equality asserts batch62 shares first chunk storage at offset62*1025, and batch68 shares batch64 storage at offset4*1025. Flattened output equals original selected slice. These assertions prove selected shared slices for fixture, not zero-copy on every irregular boundary. (rust/lance-table/src/utils/stream.rs:1122-1156)

### Lines 1157-1194

Zero-task fixture emits counts0 then1, stable sequence[42], buffered2; asserts first batch empty and second IDs[42]. It preserves empty tasks rather than dropping them. (rust/lance-table/src/utils/stream.rs:1157-1194)

### Lines 1195-1228

Truncated sequence fixture advertises ten payload rows but only five stable IDs and selected count ten. Wrapper must return CorruptFile and exact diagnostic containing selected offset0, actual5 and required10. This checks wrapper eager decoding, not direct-call fallback. (rust/lance-table/src/utils/stream.rs:1195-1228)

### Lines 1229-1259

Unsorted truncated fixture has sequence0..5, declared total6 and indices[0,5,1,2] in four one-row tasks. buffered1 collection must fail with CorruptFile; diagnostic text is not asserted. An out-of-range middle selection must not silently shift following IDs. (rust/lance-table/src/utils/stream.rs:1229-1259)

### Lines 1260-1303

Variable-boundary fixture uses3*65536+41 IDs excluding multiples17 and alternates32768/32769 task requests with a short tail. Stable-ID-only full-selection config exercises cache draining and cross-chunk stitching after permanent fast-path disable. (rust/lance-table/src/utils/stream.rs:1260-1303)

### Lines 1304-1320

Buffered3 output must use distinct schema Arcs for batches1 and2 after irregular sizes, then flattened IDs must equal full expected list. No allocator count or latency assertion is present. (rust/lance-table/src/utils/stream.rs:1304-1320)

### Lines 1321-1354

Schema-sharing fixture creates three distinct-but-equal payload schemas with ten rows each, confirms initial pointers differ, and requests all four system columns with a sparse30-ID sequence and absent version sequences. This exercises structural equality rather than only input Arc identity. (rust/lance-table/src/utils/stream.rs:1321-1354)

### Lines 1355-1383

Buffered3 output must order payload,_rowid,_rowaddr,_row_last_updated_at_version,_row_created_at_version, share one schema Arc across consecutive outputs, and have five columns each. It does not assert the default version values or differing-metadata/schema fallback. (rust/lance-table/src/utils/stream.rs:1355-1383)

### Lines 1384-1423

Differing-boundary merge fixture splits left rows6+4 and right4+6. buffered3 merged results must have counts4,2,4 with exact aligned x/y values. This exercises splitting both sources and shared futures, but not split-source error fanout or unequal total length. (rust/lance-table/src/utils/stream.rs:1384-1423)

### Lines 1424-1473

check_row_id helper crosses payload present/absent with fragment0/10 over ten ten-row batches. It uses no stable sequence, requests row IDs, and compares each output to physical RowAddress(fragment,expected_offset). Expected slices advance by actual output rows; there are no deletions. (rust/lance-table/src/utils/stream.rs:1424-1473)

### Lines 1474-1492

test_row_id covers RangeFull, reversed Indices0..100, explicit1000..1100, RangeFrom1000, and RangeTo1000 while reading only100 rows. This demonstrates parameters can address offsets beyond config.total_num_rows when no stable-ID read-ahead uses that count; no Ranges case is present here. (rust/lance-table/src/utils/stream.rs:1474-1492)

### Lines 1493-1527

Deletion matrix uses None, Some(NoDeletions), Bitmap0..35 and Set0..35, payload yes/no, ID yes/no, null/filter mode and fragment0/1. It explicitly skips no-work configurations and null mode without row IDs as upstream-invalid rather than expecting local validation. Address-only null mode is not tested. (rust/lance-table/src/utils/stream.rs:1493-1527)

### Lines 1528-1572

Each deletion case creates100 physical rows in ten batches, configures physical IDs with no stable/version sequences, wraps buffered1, and removes zero-row outputs in the test itself before collecting. The production wrapper does not perform that empty-batch removal. (rust/lance-table/src/utils/stream.rs:1528-1572)

### Lines 1573-1620

Assert null count plus physically removed rows equals expected vector length. Null mode keeps physical address30 under a null slot and five nulls in fourth batch; filter mode first surviving address is35. If IDs disabled require absent _rowid. This does not test existing ID null buffers, explicit empty Set/Bitmap or arbitrary selected ranges with deletion. (rust/lance-table/src/utils/stream.rs:1573-1620)

### Lines 1621-1675

Created-version deletion test uses one100-row run version42, bitmap0..35 and physical row IDs. After filtering empty batches, total65 and all retained created versions42 are asserted. No null-deletion/version-column interaction is checked. (rust/lance-table/src/utils/stream.rs:1621-1675)

### Lines 1676-1715

Multi-run fixture sets created version1000+position for every one-row run and last-updated versions11 on0..7,22 on7..20,33 on20..21,44 on21..50 and55 on50..100. This stresses fragmented RLE alignment across ten-row batches. (rust/lance-table/src/utils/stream.rs:1676-1715)

### Lines 1716-1751

Delete0..20 and60..80, request both version columns and physical IDs, run buffered8 and discard empty outputs, then assert60 surviving rows. The nearby v1/v2/v3 survivor comment is stale relative to the actual five last-updated runs; executable expected values below are authoritative. (rust/lance-table/src/utils/stream.rs:1716-1751)

### Lines 1752-1791

Flatten both version columns and compare to physical positions20..60 plus80..100, created1000+position and exact five-way last-updated oracle. Deletion crossing run boundaries must advance both sequences consistently. (rust/lance-table/src/utils/stream.rs:1752-1791)

### Lines 1792-1829

Unsorted version fixture has ten one-row runs with version100+position, indices[8,2,9,1,6], tasks2,2,1 and only last-updated requested; no ID/address/deletion. This checks version cursor backwards seeks independently of row-ID cursor. (rust/lance-table/src/utils/stream.rs:1792-1829)

### Lines 1830-1850

Buffered3 result is flattened and compared with100+selected position in requested order. The fixture does not force future completion ordering or test malformed version sequence length. (rust/lance-table/src/utils/stream.rs:1830-1850)

### Lines 1851-1887

Direct fallback test constructs five one-row version runs10+position, requests indices[4,1,3] in a three-row batch, calls public synchronous apply and asserts[14,11,13]. This covers fresh-cursor direct path, with no stream cache, deletions, default version or single-run bounds check. Test module ends here; no tests were executed. (rust/lance-table/src/utils/stream.rs:1851-1887)

## Interaction and interpretation limits

All 1887 physical lines were freshly read and authored. Source contains no unsafe or direct storage IO. Source-derived failure/cost observations are not executed regressions. Exact reader/Arrow helper snippets and two fragment call sites were read as context only; their full files, scheduling/overlay/projection integration and external dependency implementations remain pending. Source tests/benchmarks were read, not run.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::{
    5 |     fmt,
    6 |     sync::{Arc, OnceLock},
    7 | };
    8 | 
    9 | use arrow_array::{
   10 |     ArrayRef, BooleanArray, RecordBatch, RecordBatchOptions, UInt64Array, make_array,
   11 | };
   12 | use arrow_buffer::NullBuffer;
   13 | use arrow_schema::{Field, Schema, SchemaRef};
   14 | use futures::{
   15 |     FutureExt, Stream, StreamExt,
   16 |     future::{BoxFuture, Shared},
   17 |     stream::{BoxStream, FuturesOrdered},
   18 | };
   19 | use lance_arrow::RecordBatchExt;
   20 | use lance_core::{
   21 |     Error, ROW_ADDR, ROW_ADDR_FIELD, ROW_CREATED_AT_VERSION_FIELD, ROW_ID, ROW_ID_FIELD,
   22 |     ROW_LAST_UPDATED_AT_VERSION_FIELD, Result,
   23 |     utils::{address::RowAddress, deletion::DeletionVector},
   24 | };
   25 | use lance_io::ReadBatchParams;
   26 | use tracing::instrument;
   27 | 
   28 | use crate::rowids::{RowIdSequence, RowIdSequenceCursor};
   29 | 
   30 | pub type ReadBatchFut = BoxFuture<'static, Result<RecordBatch>>;
   31 | /// A task, emitted by a file reader, that will produce a batch (of the
   32 | /// given size)
   33 | pub struct ReadBatchTask {
   34 |     pub task: ReadBatchFut,
   35 |     pub num_rows: u32,
   36 | }
   37 | pub type ReadBatchTaskStream = BoxStream<'static, ReadBatchTask>;
   38 | pub type ReadBatchFutStream = BoxStream<'static, ReadBatchFut>;
   39 | 
   40 | type SharedReadBatchFut = Shared<BoxFuture<'static, std::result::Result<RecordBatch, Arc<Error>>>>;
   41 | 
   42 | #[derive(Debug)]
   43 | struct SharedReadError(Arc<Error>);
   44 | 
   45 | impl fmt::Display for SharedReadError {
   46 |     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
   47 |         self.0.fmt(f)
   48 |     }
   49 | }
   50 | 
   51 | impl std::error::Error for SharedReadError {
   52 |     fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
   53 |         Some(self.0.as_ref())
   54 |     }
   55 | }
   56 | 
   57 | struct PendingReadBatch {
   58 |     task: Option<ReadBatchFut>,
   59 |     shared_task: Option<SharedReadBatchFut>,
   60 |     offset: u32,
   61 |     num_rows: u32,
   62 | }
   63 | 
   64 | impl PendingReadBatch {
   65 |     fn new(task: ReadBatchTask) -> Self {
   66 |         Self {
   67 |             task: Some(task.task),
   68 |             shared_task: None,
   69 |             offset: 0,
   70 |             num_rows: task.num_rows,
   71 |         }
   72 |     }
   73 | 
   74 |     fn take(&mut self, num_rows: u32) -> ReadBatchFut {
   75 |         debug_assert!(num_rows <= self.num_rows);
   76 | 
   77 |         if self.offset == 0 && num_rows == self.num_rows && self.shared_task.is_none() {
   78 |             self.num_rows = 0;
   79 |             let Some(task) = self.task.take() else {
   80 |                 return async {
   81 |                     Err(Error::internal(
   82 |                         "missing read task while merging aligned streams".to_string(),
   83 |                     ))
   84 |                 }
   85 |                 .boxed();
   86 |             };
   87 |             return task;
   88 |         }
   89 | 
   90 |         let shared_task = self
   91 |             .shared_task
   92 |             .get_or_insert_with(|| {
   93 |                 let task = self.task.take();
   94 |                 async move {
   95 |                     let Some(task) = task else {
   96 |                         return Err(Arc::new(Error::internal(
   97 |                             "missing read task while splitting a merged stream".to_string(),
   98 |                         )));
   99 |                     };
  100 |                     task.await.map_err(Arc::new)
  101 |                 }
  102 |                 .boxed()
  103 |                 .shared()
  104 |             })
  105 |             .clone();
  106 |         let offset = self.offset;
  107 |         self.offset += num_rows;
  108 |         self.num_rows -= num_rows;
  109 | 
  110 |         async move {
  111 |             match shared_task.await {
  112 |                 Ok(batch) => Ok(batch.slice(offset as usize, num_rows as usize)),
  113 |                 Err(error) => Err(Error::wrapped(Box::new(SharedReadError(error)))),
  114 |             }
  115 |         }
  116 |         .boxed()
  117 |     }
  118 | }
  119 | 
  120 | struct MergeStream {
  121 |     streams: Vec<ReadBatchTaskStream>,
  122 |     pending: Vec<Option<PendingReadBatch>>,
  123 |     index: usize,
  124 | }
  125 | 
  126 | impl MergeStream {
  127 |     fn emit(&mut self) -> ReadBatchTask {
  128 |         let num_rows = self
  129 |             .pending
  130 |             .iter()
  131 |             .filter_map(|pending| pending.as_ref().map(|pending| pending.num_rows))
  132 |             .min()
  133 |             .unwrap_or_default();
  134 |         let mut batches = FuturesOrdered::new();
  135 |         for pending in &mut self.pending {
  136 |             let Some(pending_batch) = pending.as_mut() else {
  137 |                 continue;
  138 |             };
  139 |             batches.push_back(pending_batch.take(num_rows));
  140 |             if pending_batch.num_rows == 0 {
  141 |                 *pending = None;
  142 |             }
  143 |         }
  144 |         let task = async move {
  145 |             let Some(first) = batches.next().await else {
  146 |                 return Err(Error::internal(
  147 |                     "cannot merge an empty set of read batches".to_string(),
  148 |                 ));
  149 |             };
  150 |             let mut batch = first?;
  151 |             while let Some(next) = batches.next().await {
  152 |                 let next = next?;
  153 |                 batch = batch.merge(&next)?;
  154 |             }
  155 |             Ok(batch)
  156 |         }
  157 |         .boxed();
  158 |         ReadBatchTask { task, num_rows }
  159 |     }
  160 | }
  161 | 
  162 | impl Stream for MergeStream {
  163 |     type Item = ReadBatchTask;
  164 | 
  165 |     fn poll_next(
  166 |         mut self: std::pin::Pin<&mut Self>,
  167 |         cx: &mut std::task::Context<'_>,
  168 |     ) -> std::task::Poll<Option<Self::Item>> {
  169 |         loop {
  170 |             if self.pending.iter().all(Option::is_some) {
  171 |                 return std::task::Poll::Ready(Some(self.emit()));
  172 |             }
  173 | 
  174 |             let index = self.index;
  175 |             if self.pending[index].is_some() {
  176 |                 self.index = (index + 1) % self.streams.len();
  177 |                 continue;
  178 |             }
  179 |             match self.streams[index].poll_next_unpin(cx) {
  180 |                 std::task::Poll::Ready(Some(batch_task)) => {
  181 |                     self.pending[index] = Some(PendingReadBatch::new(batch_task));
  182 |                     self.index = (index + 1) % self.streams.len();
  183 |                 }
  184 |                 std::task::Poll::Ready(None) => {
  185 |                     return std::task::Poll::Ready(None);
  186 |                 }
  187 |                 std::task::Poll::Pending => {
  188 |                     return std::task::Poll::Pending;
  189 |                 }
  190 |             }
  191 |         }
  192 |     }
  193 | }
  194 | 
  195 | /// Given multiple streams of batch tasks, merge them into a single stream
  196 | ///
  197 | /// This pulls one batch from each stream and then combines the columns from
  198 | /// all of the batches into a single batch.  The order of the batches in the
  199 | /// streams is maintained and the merged batch columns will be in order from first
  200 | /// to last stream. If the streams use different batch boundaries then batches are
  201 | /// sliced so each merged output remains row-aligned.
  202 | ///
  203 | /// This stream ends as soon as any of the input streams ends (we do not
  204 | /// verify that the other input streams are finished as well)
  205 | pub fn merge_streams(streams: Vec<ReadBatchTaskStream>) -> ReadBatchTaskStream {
  206 |     if streams.is_empty() {
  207 |         return futures::stream::empty().boxed();
  208 |     }
  209 |     let pending = (0..streams.len()).map(|_| None).collect();
  210 |     MergeStream {
  211 |         streams,
  212 |         pending,
  213 |         index: 0,
  214 |     }
  215 |     .boxed()
  216 | }
  217 | 
  218 | /// Apply a mask to the batch, where rows are "deleted" by the _rowid column null.
  219 | ///
  220 | /// This is used partly as a performance optimization (cheaper to null than to filter)
  221 | /// but also because there are cases where we want to load the physical rows.  For example,
  222 | /// we may be replacing a column based on some UDF and we want to provide a value for the
  223 | /// deleted rows to ensure the fragments are aligned.
  224 | fn apply_deletions_as_nulls(batch: RecordBatch, mask: &BooleanArray) -> Result<RecordBatch> {
  225 |     // Transform mask into null buffer. Null means deleted, though note that
  226 |     // null buffers are actually validity buffers, so True means not null
  227 |     // and thus not deleted.
  228 |     let mask_buffer = NullBuffer::new(mask.values().clone());
  229 | 
  230 |     if mask_buffer.null_count() == 0 {
  231 |         // No rows are deleted
  232 |         return Ok(batch);
  233 |     }
  234 | 
  235 |     // For each column convert to data
  236 |     let new_columns = batch
  237 |         .schema()
  238 |         .fields()
  239 |         .iter()
  240 |         .zip(batch.columns())
  241 |         .map(|(field, col)| {
  242 |             if field.name() == ROW_ID || field.name() == ROW_ADDR {
  243 |                 let col_data = col.to_data();
  244 |                 // If it already has a validity bitmap, then AND it with the mask.
  245 |                 // Otherwise, use the boolean buffer as the mask.
  246 |                 let null_buffer = NullBuffer::union(col_data.nulls(), Some(&mask_buffer));
  247 | 
  248 |                 Ok(col_data
  249 |                     .into_builder()
  250 |                     .null_bit_buffer(null_buffer.map(|b| b.buffer().clone()))
  251 |                     .build()
  252 |                     .map(make_array)?)
  253 |             } else {
  254 |                 Ok(col.clone())
  255 |             }
  256 |         })
  257 |         .collect::<Result<Vec<_>>>()?;
  258 | 
  259 |     Ok(RecordBatch::try_new_with_options(
  260 |         batch.schema(),
  261 |         new_columns,
  262 |         &RecordBatchOptions::new().with_row_count(Some(batch.num_rows())),
  263 |     )?)
  264 | }
  265 | 
  266 | /// Extract version values for a batch selection with a reusable RLE cursor.
  267 | /// Single-run fragments (the common case) take the O(1) fast path.
  268 | fn version_values_for_selection_with_cursor(
  269 |     sequence: &crate::rowids::version::RowDatasetVersionSequence,
  270 |     cursor: &mut crate::rowids::version::RowDatasetVersionCursor,
  271 |     params: &ReadBatchParams,
  272 |     batch_offset: u32,
  273 |     num_rows: u32,
  274 | ) -> Result<Vec<u64>> {
  275 |     let selection = params
  276 |         .slice(batch_offset as usize, num_rows as usize)
  277 |         .unwrap()
  278 |         .to_ranges()
  279 |         .unwrap();
  280 | 
  281 |     if sequence.runs.len() == 1 {
  282 |         return Ok(vec![sequence.runs[0].version(); num_rows as usize]);
  283 |     }
  284 | 
  285 |     let mut versions = Vec::with_capacity(num_rows as usize);
  286 |     for r in &selection {
  287 |         cursor.extend_range(sequence, r.start as usize..r.end as usize, &mut versions)?;
  288 |     }
  289 |     Ok(versions)
  290 | }
  291 | 
  292 | fn version_values_for_selection(
  293 |     sequence: &crate::rowids::version::RowDatasetVersionSequence,
  294 |     params: &ReadBatchParams,
  295 |     batch_offset: u32,
  296 |     num_rows: u32,
  297 | ) -> Result<Vec<u64>> {
  298 |     // Preserve the common direct-call path without constructing a cursor.
  299 |     // Keep the selection validation in the same order as the general path.
  300 |     let _selection = params
  301 |         .slice(batch_offset as usize, num_rows as usize)
  302 |         .unwrap()
  303 |         .to_ranges()
  304 |         .unwrap();
  305 |     if sequence.runs.len() == 1 {
  306 |         return Ok(vec![sequence.runs[0].version(); num_rows as usize]);
  307 |     }
  308 |     version_values_for_selection_with_cursor(
  309 |         sequence,
  310 |         &mut sequence.cursor(),
  311 |         params,
  312 |         batch_offset,
  313 |         num_rows,
  314 |     )
  315 | }
  316 | 
  317 | /// Configuration needed to apply row ids and deletions to a batch
  318 | #[derive(Debug)]
  319 | pub struct RowIdAndDeletesConfig {
  320 |     /// The row ids that were requested
  321 |     pub params: ReadBatchParams,
  322 |     /// Whether to include the row id column in the final batch
  323 |     pub with_row_id: bool,
  324 |     /// Whether to include the row address column in the final batch
  325 |     pub with_row_addr: bool,
  326 |     /// Whether to include the last updated at version column in the final batch
  327 |     pub with_row_last_updated_at_version: bool,
  328 |     /// Whether to include the created at version column in the final batch
  329 |     pub with_row_created_at_version: bool,
  330 |     /// An optional deletion vector to apply to the batch
  331 |     pub deletion_vector: Option<Arc<DeletionVector>>,
  332 |     /// An optional row id sequence to use for the row id column.
  333 |     pub row_id_sequence: Option<Arc<RowIdSequence>>,
  334 |     /// The last_updated_at version sequence
  335 |     pub last_updated_at_sequence: Option<Arc<crate::rowids::version::RowDatasetVersionSequence>>,
  336 |     /// The created_at version sequence
  337 |     pub created_at_sequence: Option<Arc<crate::rowids::version::RowDatasetVersionSequence>>,
  338 |     /// Whether to make deleted rows null instead of filtering them out
  339 |     pub make_deletions_null: bool,
  340 |     /// The total number of rows that will be loaded
  341 |     ///
  342 |     /// This is needed to convert ReadbatchParams::RangeTo into a valid range
  343 |     pub total_num_rows: u32,
  344 | }
  345 | 
  346 | impl RowIdAndDeletesConfig {
  347 |     fn has_system_cols(&self) -> bool {
  348 |         self.with_row_id
  349 |             || self.with_row_addr
  350 |             || self.with_row_last_updated_at_version
  351 |             || self.with_row_created_at_version
  352 |     }
  353 | }
  354 | 
  355 | pub fn apply_row_id_and_deletes(
  356 |     batch: RecordBatch,
  357 |     batch_offset: u32,
  358 |     fragment_id: u32,
  359 |     config: &RowIdAndDeletesConfig,
  360 | ) -> Result<RecordBatch> {
  361 |     apply_row_id_and_deletes_with_system_columns(
  362 |         batch,
  363 |         batch_offset,
  364 |         fragment_id,
  365 |         config,
  366 |         PrecomputedSystemColumns::default(),
  367 |         None,
  368 |     )
  369 | }
  370 | 
  371 | #[derive(Default)]
  372 | struct PrecomputedSystemColumns {
  373 |     row_ids: Option<Result<Arc<UInt64Array>>>,
  374 |     last_updated_versions: Option<Result<Arc<UInt64Array>>>,
  375 |     created_versions: Option<Result<Arc<UInt64Array>>>,
  376 | }
  377 | 
  378 | const ROW_ID_READ_AHEAD_ROWS: usize = 64 * 1024;
  379 | 
  380 | struct PrecomputedRowIdChunk {
  381 |     logical_offset: usize,
  382 |     values: Arc<UInt64Array>,
  383 | }
  384 | 
  385 | struct CachedOutputSchema {
  386 |     input: SchemaRef,
  387 |     output: SchemaRef,
  388 | }
  389 | 
  390 | impl PrecomputedRowIdChunk {
  391 |     fn end_offset(&self) -> usize {
  392 |         self.logical_offset + self.values.len()
  393 |     }
  394 | 
  395 |     fn slice(&self, logical_offset: usize, num_rows: usize) -> Option<Arc<UInt64Array>> {
  396 |         let offset_in_chunk = logical_offset.checked_sub(self.logical_offset)?;
  397 |         if offset_in_chunk + num_rows > self.values.len() {
  398 |             return None;
  399 |         }
  400 |         if offset_in_chunk == 0 && num_rows == self.values.len() {
  401 |             return Some(self.values.clone());
  402 |         }
  403 |         Some(Arc::new(self.values.slice(offset_in_chunk, num_rows)))
  404 |     }
  405 | }
  406 | 
  407 | fn decode_row_id_chunk<const USE_DENSE_ROW_ID_EXPANSION: bool>(
  408 |     sequence: &RowIdSequence,
  409 |     cursor: &mut RowIdSequenceCursor,
  410 |     params: &ReadBatchParams,
  411 |     logical_offset: usize,
  412 |     chunk_len: usize,
  413 | ) -> Result<PrecomputedRowIdChunk> {
  414 |     let selection = params
  415 |         .slice(logical_offset, chunk_len)
  416 |         .unwrap()
  417 |         .to_ranges()
  418 |         .unwrap();
  419 |     let values = match selection.as_slice() {
  420 |         [range] if USE_DENSE_ROW_ID_EXPANSION => UInt64Array::from(
  421 |             sequence
  422 |                 .select_dense_range_with_cursor(cursor, range.start as usize..range.end as usize),
  423 |         ),
  424 |         [range] => UInt64Array::from(
  425 |             sequence.select_range_with_cursor(cursor, range.start as usize..range.end as usize),
  426 |         ),
  427 |         _ => sequence
  428 |             .select_with_cursor(
  429 |                 cursor,
  430 |                 selection
  431 |                     .iter()
  432 |                     .flat_map(|range| range.start as usize..range.end as usize),
  433 |             )
  434 |             .collect::<UInt64Array>(),
  435 |     };
  436 |     if values.len() != chunk_len {
  437 |         return Err(Error::corrupt_file_named(
  438 |             "row ID metadata",
  439 |             format!(
  440 |                 "decoded row ID chunk at selected offset {logical_offset} contains {} rows, but the selection requires {chunk_len} rows",
  441 |                 values.len()
  442 |             ),
  443 |         ));
  444 |     }
  445 |     Ok(PrecomputedRowIdChunk {
  446 |         logical_offset,
  447 |         values: Arc::new(values),
  448 |     })
  449 | }
  450 | 
  451 | fn selected_row_count(params: &ReadBatchParams, total_num_rows: usize) -> usize {
  452 |     match params {
  453 |         ReadBatchParams::Range(range) => range.len(),
  454 |         ReadBatchParams::Ranges(ranges) => ranges
  455 |             .iter()
  456 |             .map(|range| (range.end - range.start) as usize)
  457 |             .sum(),
  458 |         ReadBatchParams::RangeFull => total_num_rows,
  459 |         ReadBatchParams::RangeTo(range) => range.end,
  460 |         ReadBatchParams::RangeFrom(range) => total_num_rows.saturating_sub(range.start),
  461 |         ReadBatchParams::Indices(indices) => indices.len(),
  462 |     }
  463 | }
  464 | 
  465 | #[instrument(name = "apply_row_id_and_deletes", level = "debug", skip_all)]
  466 | fn apply_row_id_and_deletes_with_system_columns(
  467 |     batch: RecordBatch,
  468 |     batch_offset: u32,
  469 |     fragment_id: u32,
  470 |     config: &RowIdAndDeletesConfig,
  471 |     precomputed: PrecomputedSystemColumns,
  472 |     output_schema_cache: Option<&OnceLock<CachedOutputSchema>>,
  473 | ) -> Result<RecordBatch> {
  474 |     let PrecomputedSystemColumns {
  475 |         row_ids: precomputed_row_ids,
  476 |         last_updated_versions,
  477 |         created_versions,
  478 |     } = precomputed;
  479 |     let mut deletion_vector = config.deletion_vector.as_ref();
  480 |     // Convert Some(NoDeletions) into None to simplify logic below
  481 |     if let Some(deletion_vector_inner) = deletion_vector
  482 |         && matches!(deletion_vector_inner.as_ref(), DeletionVector::NoDeletions)
  483 |     {
  484 |         deletion_vector = None;
  485 |     }
  486 |     let has_deletions = deletion_vector.is_some();
  487 |     debug_assert!(batch.num_columns() > 0 || config.has_system_cols() || has_deletions);
  488 | 
  489 |     // If row id sequence is None, then row id IS row address.
  490 |     let should_fetch_row_addr = config.with_row_addr
  491 |         || (config.with_row_id && config.row_id_sequence.is_none())
  492 |         || has_deletions;
  493 | 
  494 |     let num_rows = batch.num_rows() as u32;
  495 | 
  496 |     let row_addrs =
  497 |         if should_fetch_row_addr {
  498 |             let _rowaddrs = tracing::span!(tracing::Level::DEBUG, "fetch_row_addrs").entered();
  499 |             let mut row_addrs = Vec::with_capacity(num_rows as usize);
  500 |             for offset_range in config
  501 |                 .params
  502 |                 .slice(batch_offset as usize, num_rows as usize)
  503 |                 .unwrap()
  504 |                 .iter_offset_ranges()?
  505 |             {
  506 |                 row_addrs.extend(offset_range.map(|row_offset| {
  507 |                     u64::from(RowAddress::new_from_parts(fragment_id, row_offset))
  508 |                 }));
  509 |             }
  510 | 
  511 |             Some(Arc::new(UInt64Array::from(row_addrs)))
  512 |         } else {
  513 |             None
  514 |         };
  515 | 
  516 |     let row_ids = if config.with_row_id {
  517 |         let _rowids = tracing::span!(tracing::Level::DEBUG, "fetch_row_ids").entered();
  518 |         if let Some(row_ids) = precomputed_row_ids {
  519 |             let row_ids = row_ids?;
  520 |             debug_assert_eq!(row_ids.len(), num_rows as usize);
  521 |             Some(row_ids)
  522 |         } else if let Some(row_id_sequence) = &config.row_id_sequence {
  523 |             let selection = config
  524 |                 .params
  525 |                 .slice(batch_offset as usize, num_rows as usize)
  526 |                 .unwrap()
  527 |                 .to_ranges()
  528 |                 .unwrap();
  529 |             let row_ids = row_id_sequence
  530 |                 .select(
  531 |                     selection
  532 |                         .iter()
  533 |                         .flat_map(|r| r.start as usize..r.end as usize),
  534 |                 )
  535 |                 .collect::<UInt64Array>();
  536 |             Some(Arc::new(row_ids))
  537 |         } else {
  538 |             // If we don't have a row id sequence, can assume the row ids are
  539 |             // the same as the row addresses.
  540 |             row_addrs.clone()
  541 |         }
  542 |     } else {
  543 |         None
  544 |     };
  545 | 
  546 |     let span = tracing::span!(tracing::Level::DEBUG, "apply_deletions");
  547 |     let _enter = span.enter();
  548 |     let deletion_mask = deletion_vector.and_then(|v| {
  549 |         let row_addrs: &[u64] = row_addrs.as_ref().unwrap().values();
  550 |         v.build_predicate(row_addrs.iter())
  551 |     });
  552 | 
  553 |     let mut system_columns: Vec<(Field, ArrayRef)> = Vec::with_capacity(4);
  554 |     if config.with_row_id {
  555 |         system_columns.push((ROW_ID_FIELD.clone(), row_ids.unwrap()));
  556 |     }
  557 |     if config.with_row_addr {
  558 |         system_columns.push((ROW_ADDR_FIELD.clone(), row_addrs.unwrap()));
  559 |     }
  560 |     if config.with_row_last_updated_at_version {
  561 |         let version_arr = if let Some(version_arr) = last_updated_versions {
  562 |             version_arr?
  563 |         } else if let Some(sequence) = &config.last_updated_at_sequence {
  564 |             Arc::new(UInt64Array::from(version_values_for_selection(
  565 |                 sequence,
  566 |                 &config.params,
  567 |                 batch_offset,
  568 |                 num_rows,
  569 |             )?))
  570 |         } else {
  571 |             // Default to version 1 if sequence not provided
  572 |             Arc::new(UInt64Array::from(vec![1u64; num_rows as usize]))
  573 |         };
  574 |         system_columns.push((ROW_LAST_UPDATED_AT_VERSION_FIELD.clone(), version_arr));
  575 |     }
  576 |     if config.with_row_created_at_version {
  577 |         let version_arr = if let Some(version_arr) = created_versions {
  578 |             version_arr?
  579 |         } else if let Some(sequence) = &config.created_at_sequence {
  580 |             Arc::new(UInt64Array::from(version_values_for_selection(
  581 |                 sequence,
  582 |                 &config.params,
  583 |                 batch_offset,
  584 |                 num_rows,
  585 |             )?))
  586 |         } else {
  587 |             // Default to version 1 if sequence not provided
  588 |             Arc::new(UInt64Array::from(vec![1u64; num_rows as usize]))
  589 |         };
  590 |         system_columns.push((ROW_CREATED_AT_VERSION_FIELD.clone(), version_arr));
  591 |     }
  592 | 
  593 |     let batch = if system_columns.is_empty() {
  594 |         batch
  595 |     } else if let Some(output_schema_cache) = output_schema_cache {
  596 |         let input_schema = batch.schema();
  597 |         let make_output_schema = || {
  598 |             let mut fields = input_schema
  599 |                 .fields()
  600 |                 .iter()
  601 |                 .map(|field| field.as_ref().clone())
  602 |                 .collect::<Vec<_>>();
  603 |             fields.extend(system_columns.iter().map(|(field, _)| field.clone()));
  604 |             Arc::new(Schema::new_with_metadata(
  605 |                 fields,
  606 |                 input_schema.metadata().clone(),
  607 |             ))
  608 |         };
  609 |         let cached = output_schema_cache.get_or_init(|| CachedOutputSchema {
  610 |             input: input_schema.clone(),
  611 |             output: make_output_schema(),
  612 |         });
  613 |         let output_schema = if Arc::ptr_eq(&cached.input, &input_schema)
  614 |             || cached.input.as_ref() == input_schema.as_ref()
  615 |         {
  616 |             cached.output.clone()
  617 |         } else {
  618 |             make_output_schema()
  619 |         };
  620 |         let mut columns = Vec::with_capacity(batch.num_columns() + system_columns.len());
  621 |         columns.extend_from_slice(batch.columns());
  622 |         columns.extend(system_columns.into_iter().map(|(_, array)| array));
  623 |         RecordBatch::try_new_with_options(
  624 |             output_schema,
  625 |             columns,
  626 |             &RecordBatchOptions::new().with_row_count(Some(batch.num_rows())),
  627 |         )?
  628 |     } else {
  629 |         system_columns
  630 |             .into_iter()
  631 |             .try_fold(batch, |batch, (field, array)| {
  632 |                 batch.try_with_column(field, array)
  633 |             })?
  634 |     };
  635 | 
  636 |     match (deletion_mask, config.make_deletions_null) {
  637 |         (None, _) => Ok(batch),
  638 |         (Some(mask), false) => Ok(arrow::compute::filter_record_batch(&batch, &mask)?),
  639 |         (Some(mask), true) => Ok(apply_deletions_as_nulls(batch, &mask)?),
  640 |     }
  641 | }
  642 | 
  643 | /// Given a stream of batch tasks this function will add a row ids column (if requested)
  644 | /// and also apply a deletions vector to the batch.
  645 | ///
  646 | /// This converts from BatchTaskStream to BatchFutStream because, if we are applying a
  647 | /// deletion vector, it is impossible to know how many output rows we will have.
  648 | pub fn wrap_with_row_id_and_delete(
  649 |     stream: ReadBatchTaskStream,
  650 |     fragment_id: u32,
  651 |     config: RowIdAndDeletesConfig,
  652 | ) -> ReadBatchFutStream {
  653 |     let (row_id_cursor, use_dense_row_id_expansion) = config
  654 |         .row_id_sequence
  655 |         .as_ref()
  656 |         .filter(|_| config.with_row_id)
  657 |         .map(|sequence| {
  658 |             let (cursor, use_dense_range_expansion) = sequence.cursor_with_dense_range_expansion();
  659 |             (Some(cursor), use_dense_range_expansion)
  660 |         })
  661 |         .unwrap_or((None, false));
  662 |     if use_dense_row_id_expansion {
  663 |         wrap_with_row_id_and_delete_impl::<true>(stream, fragment_id, config, row_id_cursor)
  664 |     } else {
  665 |         wrap_with_row_id_and_delete_impl::<false>(stream, fragment_id, config, row_id_cursor)
  666 |     }
  667 | }
  668 | 
  669 | fn wrap_with_row_id_and_delete_impl<const USE_DENSE_ROW_ID_EXPANSION: bool>(
  670 |     stream: ReadBatchTaskStream,
  671 |     fragment_id: u32,
  672 |     config: RowIdAndDeletesConfig,
  673 |     mut row_id_cursor: Option<RowIdSequenceCursor>,
  674 | ) -> ReadBatchFutStream {
  675 |     let config = Arc::new(config);
  676 |     let output_schema_cache = Arc::new(OnceLock::new());
  677 |     let mut row_id_chunk: Option<PrecomputedRowIdChunk> = None;
  678 |     let mut uniform_batch_size = None;
  679 |     let mut use_uniform_batch_fast_paths = true;
  680 |     let selected_rows = selected_row_count(&config.params, config.total_num_rows as usize);
  681 |     let mut last_updated_cursor = config
  682 |         .last_updated_at_sequence
  683 |         .as_ref()
  684 |         .filter(|sequence| config.with_row_last_updated_at_version && sequence.runs.len() > 1)
  685 |         .map(|sequence| sequence.cursor());
  686 |     let mut created_cursor = config
  687 |         .created_at_sequence
  688 |         .as_ref()
  689 |         .filter(|sequence| config.with_row_created_at_version && sequence.runs.len() > 1)
  690 |         .map(|sequence| sequence.cursor());
  691 |     let mut offset = 0;
  692 |     stream
  693 |         .map(move |batch_task| {
  694 |             let config = config.clone();
  695 |             let this_offset = offset;
  696 |             let num_rows = batch_task.num_rows;
  697 |             offset += num_rows;
  698 |             let logical_offset = this_offset as usize;
  699 |             let num_rows_usize = num_rows as usize;
  700 |             if num_rows_usize != 0 && use_uniform_batch_fast_paths {
  701 |                 if let Some(batch_size) = uniform_batch_size {
  702 |                     // A shorter final batch is expected. Any other task-size change can
  703 |                     // repeatedly straddle read-ahead boundaries. Drain the current row-ID
  704 |                     // cache, then use exact per-task decoding and the original incremental
  705 |                     // system-column assembly from this point forward.
  706 |                     if num_rows_usize != batch_size
  707 |                         && logical_offset + num_rows_usize < selected_rows
  708 |                     {
  709 |                         use_uniform_batch_fast_paths = false;
  710 |                     }
  711 |                 } else {
  712 |                     uniform_batch_size = Some(num_rows_usize);
  713 |                 }
  714 |             }
  715 |             let output_schema_cache = use_uniform_batch_fast_paths
  716 |                 .then(|| output_schema_cache.clone());
  717 |             // Build row ids while pulling the ordered task stream, before the
  718 |             // batch futures can run concurrently. Adjacent batches share a
  719 |             // bounded chunk and take zero-copy Arrow slices from it.
  720 |             let row_ids = config.row_id_sequence.as_ref().and_then(|sequence| {
  721 |                 row_id_cursor.as_mut().map(|cursor| {
  722 |                     if num_rows_usize == 0 {
  723 |                         return Ok(Arc::new(UInt64Array::from(Vec::<u64>::new())));
  724 |                     }
  725 |                     if !use_uniform_batch_fast_paths
  726 |                         && row_id_chunk
  727 |                             .as_ref()
  728 |                             .is_none_or(|chunk| chunk.end_offset() <= logical_offset)
  729 |                     {
  730 |                         row_id_chunk = None;
  731 |                         return decode_row_id_chunk::<USE_DENSE_ROW_ID_EXPANSION>(
  732 |                             sequence,
  733 |                             cursor,
  734 |                             &config.params,
  735 |                             logical_offset,
  736 |                             num_rows_usize,
  737 |                         )
  738 |                         .map(|chunk| chunk.values);
  739 |                     }
  740 |                     if let Some(row_ids) = row_id_chunk
  741 |                         .as_ref()
  742 |                         .and_then(|chunk| chunk.slice(logical_offset, num_rows_usize))
  743 |                     {
  744 |                         return Ok(row_ids);
  745 |                     }
  746 | 
  747 |                     let prefix = row_id_chunk.as_ref().and_then(|chunk| {
  748 |                         let prefix_len = chunk.end_offset().checked_sub(logical_offset)?;
  749 |                         if prefix_len == 0 {
  750 |                             None
  751 |                         } else {
  752 |                             chunk.slice(logical_offset, prefix_len)
  753 |                         }
  754 |                     });
  755 |                     let decode_offset = logical_offset
  756 |                         + prefix
  757 |                             .as_ref()
  758 |                             .map(|row_ids| row_ids.len())
  759 |                             .unwrap_or_default();
  760 |                     let required_end = logical_offset + num_rows_usize;
  761 |                     let missing_rows = required_end.saturating_sub(decode_offset);
  762 |                     let chunk_len = if use_uniform_batch_fast_paths {
  763 |                         let batch_size = uniform_batch_size.unwrap_or(num_rows_usize);
  764 |                         let batches_per_chunk = (ROW_ID_READ_AHEAD_ROWS / batch_size).max(1);
  765 |                         let chunk_rows = batch_size.saturating_mul(batches_per_chunk);
  766 |                         missing_rows.max(chunk_rows)
  767 |                     } else {
  768 |                         missing_rows
  769 |                     }
  770 |                     .min(selected_rows.saturating_sub(decode_offset));
  771 |                     let chunk = decode_row_id_chunk::<USE_DENSE_ROW_ID_EXPANSION>(
  772 |                         sequence,
  773 |                         cursor,
  774 |                         &config.params,
  775 |                         decode_offset,
  776 |                         chunk_len,
  777 |                     )?;
  778 |                     let suffix = chunk.slice(decode_offset, missing_rows).ok_or_else(|| {
  779 |                         Error::corrupt_file_named(
  780 |                             "row ID metadata",
  781 |                             format!(
  782 |                                 "decoded row ID chunk at selected offset {decode_offset} contains {} rows, but the current batch requires {missing_rows} more rows",
  783 |                                 chunk.values.len()
  784 |                             ),
  785 |                         )
  786 |                     })?;
  787 |                     let row_ids = if let Some(prefix) = prefix {
  788 |                         let mut values = Vec::with_capacity(num_rows_usize);
  789 |                         values.extend_from_slice(prefix.values());
  790 |                         values.extend_from_slice(suffix.values());
  791 |                         Arc::new(UInt64Array::from(values))
  792 |                     } else {
  793 |                         suffix
  794 |                     };
  795 |                     row_id_chunk = Some(chunk);
  796 |                     Ok(row_ids)
  797 |                 })
  798 |             });
  799 |             let last_updated_versions =
  800 |                 config
  801 |                     .last_updated_at_sequence
  802 |                     .as_ref()
  803 |                     .and_then(|sequence| {
  804 |                         last_updated_cursor.as_mut().map(|cursor| {
  805 |                             version_values_for_selection_with_cursor(
  806 |                                 sequence,
  807 |                                 cursor,
  808 |                                 &config.params,
  809 |                                 this_offset,
  810 |                                 num_rows,
  811 |                             )
  812 |                             .map(UInt64Array::from)
  813 |                             .map(Arc::new)
  814 |                         })
  815 |                     });
  816 |             let created_versions = config.created_at_sequence.as_ref().and_then(|sequence| {
  817 |                 created_cursor.as_mut().map(|cursor| {
  818 |                     version_values_for_selection_with_cursor(
  819 |                         sequence,
  820 |                         cursor,
  821 |                         &config.params,
  822 |                         this_offset,
  823 |                         num_rows,
  824 |                     )
  825 |                     .map(UInt64Array::from)
  826 |                     .map(Arc::new)
  827 |                 })
  828 |             });
  829 |             batch_task
  830 |                 .task
  831 |                 .map(move |batch| {
  832 |                     apply_row_id_and_deletes_with_system_columns(
  833 |                         batch?,
  834 |                         this_offset,
  835 |                         fragment_id,
  836 |                         config.as_ref(),
  837 |                         PrecomputedSystemColumns {
  838 |                             row_ids,
  839 |                             last_updated_versions,
  840 |                             created_versions,
  841 |                         },
  842 |                         output_schema_cache.as_deref(),
  843 |                     )
  844 |                 })
  845 |                 .boxed()
  846 |         })
  847 |         .boxed()
  848 | }
  849 | 
  850 | #[cfg(test)]
  851 | mod tests {
  852 |     use std::sync::Arc;
  853 | 
  854 |     use arrow::{array::AsArray, datatypes::UInt64Type};
  855 |     use arrow_array::{RecordBatch, UInt32Array, types::Int32Type};
  856 |     use arrow_schema::ArrowError;
  857 |     use futures::{
  858 |         FutureExt, StreamExt, TryStreamExt,
  859 |         stream::{self, BoxStream},
  860 |     };
  861 |     use lance_core::{
  862 |         ROW_ID,
  863 |         utils::{address::RowAddress, deletion::DeletionVector},
  864 |     };
  865 |     use lance_datagen::{BatchCount, RowCount};
  866 |     use lance_io::{ReadBatchParams, stream::arrow_stream_to_lance_stream};
  867 |     use roaring::RoaringBitmap;
  868 | 
  869 |     use crate::{rowids::RowIdSequence, utils::stream::ReadBatchTask};
  870 | 
  871 |     use super::RowIdAndDeletesConfig;
  872 | 
  873 |     fn batch_task_stream(
  874 |         datagen_stream: BoxStream<'static, std::result::Result<RecordBatch, ArrowError>>,
  875 |     ) -> super::ReadBatchTaskStream {
  876 |         arrow_stream_to_lance_stream(datagen_stream)
  877 |             .map(|batch| ReadBatchTask {
  878 |                 num_rows: batch.as_ref().unwrap().num_rows() as u32,
  879 |                 task: std::future::ready(batch).boxed(),
  880 |             })
  881 |             .boxed()
  882 |     }
  883 | 
  884 |     #[tokio::test]
  885 |     async fn test_basic_zip() {
  886 |         let left = batch_task_stream(
  887 |             lance_datagen::gen_batch()
  888 |                 .col("x", lance_datagen::array::step::<Int32Type>())
  889 |                 .into_reader_stream(RowCount::from(100), BatchCount::from(10))
  890 |                 .0,
  891 |         );
  892 |         let right = batch_task_stream(
  893 |             lance_datagen::gen_batch()
  894 |                 .col("y", lance_datagen::array::step::<Int32Type>())
  895 |                 .into_reader_stream(RowCount::from(100), BatchCount::from(10))
  896 |                 .0,
  897 |         );
  898 | 
  899 |         let merged = super::merge_streams(vec![left, right])
  900 |             .map(|batch_task| batch_task.task)
  901 |             .buffered(1)
  902 |             .try_collect::<Vec<_>>()
  903 |             .await
  904 |             .unwrap();
  905 | 
  906 |         let expected = lance_datagen::gen_batch()
  907 |             .col("x", lance_datagen::array::step::<Int32Type>())
  908 |             .col("y", lance_datagen::array::step::<Int32Type>())
  909 |             .into_reader_rows(RowCount::from(100), BatchCount::from(10))
  910 |             .collect::<Result<Vec<_>, ArrowError>>()
  911 |             .unwrap();
  912 |         assert_eq!(merged, expected);
  913 |     }
  914 | 
  915 |     #[tokio::test]
  916 |     async fn test_stable_row_ids_across_concurrent_batches_and_deletes() {
  917 |         let expected = (10_000..120_000)
  918 |             .filter(|row_id| row_id % 13 != 0)
  919 |             .collect::<Vec<u64>>();
  920 |         let row_id_sequence = Arc::new(RowIdSequence::try_from_iter(expected.clone()).unwrap());
  921 |         let deletion_offsets = (0..expected.len() as u32).step_by(997).collect::<Vec<_>>();
  922 |         let deletion_vector = Some(Arc::new(DeletionVector::Bitmap(
  923 |             deletion_offsets.iter().copied().collect(),
  924 |         )));
  925 | 
  926 |         let batches = expected
  927 |             .chunks(257)
  928 |             .map(|chunk| arrow_array::record_batch!(("x", Int32, vec![0; chunk.len()])).unwrap())
  929 |             .map(Ok)
  930 |             .collect::<Vec<std::result::Result<RecordBatch, ArrowError>>>();
  931 |         let data = batch_task_stream(stream::iter(batches).boxed());
  932 |         let config = RowIdAndDeletesConfig {
  933 |             params: ReadBatchParams::RangeFull,
  934 |             with_row_id: true,
  935 |             with_row_addr: true,
  936 |             with_row_last_updated_at_version: false,
  937 |             with_row_created_at_version: false,
  938 |             deletion_vector,
  939 |             row_id_sequence: Some(row_id_sequence),
  940 |             last_updated_at_sequence: None,
  941 |             created_at_sequence: None,
  942 |             make_deletions_null: false,
  943 |             total_num_rows: expected.len() as u32,
  944 |         };
  945 | 
  946 |         let batches = super::wrap_with_row_id_and_delete(data, 7, config)
  947 |             .buffered(8)
  948 |             .try_collect::<Vec<_>>()
  949 |             .await
  950 |             .unwrap();
  951 |         let actual_row_ids = batches
  952 |             .iter()
  953 |             .flat_map(|batch| batch[ROW_ID].as_primitive::<UInt64Type>().values())
  954 |             .copied()
  955 |             .collect::<Vec<_>>();
  956 |         let actual_row_addrs = batches
  957 |             .iter()
  958 |             .flat_map(|batch| {
  959 |                 batch[lance_core::ROW_ADDR]
  960 |                     .as_primitive::<UInt64Type>()
  961 |                     .values()
  962 |             })
  963 |             .copied()
  964 |             .collect::<Vec<_>>();
  965 |         let expected_survivors = expected
  966 |             .iter()
  967 |             .enumerate()
  968 |             .filter(|(offset, _)| deletion_offsets.binary_search(&(*offset as u32)).is_err())
  969 |             .map(|(offset, row_id)| {
  970 |                 (
  971 |                     *row_id,
  972 |                     u64::from(RowAddress::new_from_parts(7, offset as u32)),
  973 |                 )
  974 |             })
  975 |             .collect::<Vec<_>>();
  976 | 
  977 |         assert_eq!(
  978 |             actual_row_ids,
  979 |             expected_survivors
  980 |                 .iter()
  981 |                 .map(|(row_id, _)| *row_id)
  982 |                 .collect::<Vec<_>>()
  983 |         );
  984 |         assert_eq!(
  985 |             actual_row_addrs,
  986 |             expected_survivors
  987 |                 .iter()
  988 |                 .map(|(_, row_addr)| *row_addr)
  989 |                 .collect::<Vec<_>>()
  990 |         );
  991 |     }
  992 | 
  993 |     #[tokio::test]
  994 |     async fn test_stable_row_ids_with_unsorted_indices() {
  995 |         let expected = (100..140)
  996 |             .filter(|row_id| row_id % 3 != 0)
  997 |             .collect::<Vec<u64>>();
  998 |         let indices = UInt32Array::from(vec![8, 2, 9, 1, 6]);
  999 |         let batches = [2, 2, 1].into_iter().map(|num_rows| ReadBatchTask {
 1000 |             num_rows,
 1001 |             task: std::future::ready(Ok(arrow_array::record_batch!((
 1002 |                 "x",
 1003 |                 Int32,
 1004 |                 vec![0; num_rows as usize]
 1005 |             ))
 1006 |             .unwrap()))
 1007 |             .boxed(),
 1008 |         });
 1009 |         let config = RowIdAndDeletesConfig {
 1010 |             params: ReadBatchParams::Indices(indices.clone()),
 1011 |             with_row_id: true,
 1012 |             with_row_addr: false,
 1013 |             with_row_last_updated_at_version: false,
 1014 |             with_row_created_at_version: false,
 1015 |             deletion_vector: None,
 1016 |             row_id_sequence: Some(Arc::new(
 1017 |                 RowIdSequence::try_from_iter(expected.clone()).unwrap(),
 1018 |             )),
 1019 |             last_updated_at_sequence: None,
 1020 |             created_at_sequence: None,
 1021 |             make_deletions_null: false,
 1022 |             total_num_rows: expected.len() as u32,
 1023 |         };
 1024 | 
 1025 |         let actual = super::wrap_with_row_id_and_delete(stream::iter(batches).boxed(), 7, config)
 1026 |             .buffered(3)
 1027 |             .try_collect::<Vec<_>>()
 1028 |             .await
 1029 |             .unwrap()
 1030 |             .iter()
 1031 |             .flat_map(|batch| batch[ROW_ID].as_primitive::<UInt64Type>().values())
 1032 |             .copied()
 1033 |             .collect::<Vec<_>>();
 1034 |         let expected = indices
 1035 |             .values()
 1036 |             .iter()
 1037 |             .map(|index| expected[*index as usize])
 1038 |             .collect::<Vec<_>>();
 1039 |         assert_eq!(actual, expected);
 1040 |     }
 1041 | 
 1042 |     #[tokio::test]
 1043 |     async fn test_repeated_row_id_after_bulk_segment_boundary() {
 1044 |         let mut row_ids = RowIdSequence::from(0..5);
 1045 |         row_ids.extend(RowIdSequence::from(10..20));
 1046 |         let batches = [1_u32, 2].into_iter().map(|num_rows| ReadBatchTask {
 1047 |             num_rows,
 1048 |             task: std::future::ready(Ok(arrow_array::record_batch!((
 1049 |                 "x",
 1050 |                 Int32,
 1051 |                 vec![0; num_rows as usize]
 1052 |             ))
 1053 |             .unwrap()))
 1054 |             .boxed(),
 1055 |         });
 1056 |         let config = RowIdAndDeletesConfig {
 1057 |             params: ReadBatchParams::Indices(UInt32Array::from(vec![4, 4, 5])),
 1058 |             with_row_id: true,
 1059 |             with_row_addr: false,
 1060 |             with_row_last_updated_at_version: false,
 1061 |             with_row_created_at_version: false,
 1062 |             deletion_vector: None,
 1063 |             row_id_sequence: Some(Arc::new(row_ids)),
 1064 |             last_updated_at_sequence: None,
 1065 |             created_at_sequence: None,
 1066 |             make_deletions_null: false,
 1067 |             total_num_rows: 15,
 1068 |         };
 1069 | 
 1070 |         let actual = super::wrap_with_row_id_and_delete(stream::iter(batches).boxed(), 0, config)
 1071 |             .buffered(1)
 1072 |             .try_collect::<Vec<_>>()
 1073 |             .await
 1074 |             .unwrap()
 1075 |             .iter()
 1076 |             .flat_map(|batch| batch[ROW_ID].as_primitive::<UInt64Type>().values())
 1077 |             .copied()
 1078 |             .collect::<Vec<_>>();
 1079 |         assert_eq!(actual, vec![4, 4, 10]);
 1080 |     }
 1081 | 
 1082 |     #[tokio::test]
 1083 |     async fn test_stable_row_id_read_ahead_range_boundary_and_tail() {
 1084 |         let all_row_ids = (10_000..120_000)
 1085 |             .filter(|row_id| row_id % 11 != 0)
 1086 |             .collect::<Vec<u64>>();
 1087 |         let selection = 1_234..71_237;
 1088 |         let selected_len = selection.len();
 1089 |         let mut remaining = selected_len;
 1090 |         let tasks = std::iter::from_fn(move || {
 1091 |             if remaining == 0 {
 1092 |                 return None;
 1093 |             }
 1094 |             let num_rows = remaining.min(1_025);
 1095 |             remaining -= num_rows;
 1096 |             Some(ReadBatchTask {
 1097 |                 num_rows: num_rows as u32,
 1098 |                 task: std::future::ready(Ok(arrow_array::record_batch!((
 1099 |                     "x",
 1100 |                     Int32,
 1101 |                     vec![0; num_rows]
 1102 |                 ))
 1103 |                 .unwrap()))
 1104 |                 .boxed(),
 1105 |             })
 1106 |         });
 1107 |         let config = RowIdAndDeletesConfig {
 1108 |             params: ReadBatchParams::Range(selection.clone()),
 1109 |             with_row_id: true,
 1110 |             with_row_addr: false,
 1111 |             with_row_last_updated_at_version: false,
 1112 |             with_row_created_at_version: false,
 1113 |             deletion_vector: None,
 1114 |             row_id_sequence: Some(Arc::new(
 1115 |                 RowIdSequence::try_from_iter(all_row_ids.clone()).unwrap(),
 1116 |             )),
 1117 |             last_updated_at_sequence: None,
 1118 |             created_at_sequence: None,
 1119 |             make_deletions_null: false,
 1120 |             total_num_rows: all_row_ids.len() as u32,
 1121 |         };
 1122 | 
 1123 |         let batches = super::wrap_with_row_id_and_delete(stream::iter(tasks).boxed(), 3, config)
 1124 |             .buffered(8)
 1125 |             .try_collect::<Vec<_>>()
 1126 |             .await
 1127 |             .unwrap();
 1128 |         assert_eq!(batches.len(), 69);
 1129 |         assert_eq!(batches.last().unwrap().num_rows(), 303);
 1130 | 
 1131 |         fn row_ids(batch: &RecordBatch) -> &arrow_array::UInt64Array {
 1132 |             batch[ROW_ID].as_primitive::<UInt64Type>()
 1133 |         }
 1134 |         assert_eq!(
 1135 |             row_ids(&batches[62]).values().as_ptr(),
 1136 |             row_ids(&batches[0])
 1137 |                 .values()
 1138 |                 .as_ptr()
 1139 |                 .wrapping_add(62 * 1_025)
 1140 |         );
 1141 |         assert_eq!(
 1142 |             row_ids(&batches[68]).values().as_ptr(),
 1143 |             row_ids(&batches[64])
 1144 |                 .values()
 1145 |                 .as_ptr()
 1146 |                 .wrapping_add(4 * 1_025)
 1147 |         );
 1148 | 
 1149 |         let actual = batches
 1150 |             .iter()
 1151 |             .flat_map(|batch| row_ids(batch).values())
 1152 |             .copied()
 1153 |             .collect::<Vec<_>>();
 1154 |         assert_eq!(actual, all_row_ids[selection]);
 1155 |     }
 1156 | 
 1157 |     #[tokio::test]
 1158 |     async fn test_stable_row_id_read_ahead_empty_task() {
 1159 |         let tasks = [0_u32, 1].into_iter().map(|num_rows| ReadBatchTask {
 1160 |             num_rows,
 1161 |             task: std::future::ready(Ok(arrow_array::record_batch!((
 1162 |                 "x",
 1163 |                 Int32,
 1164 |                 vec![0; num_rows as usize]
 1165 |             ))
 1166 |             .unwrap()))
 1167 |             .boxed(),
 1168 |         });
 1169 |         let config = RowIdAndDeletesConfig {
 1170 |             params: ReadBatchParams::RangeFull,
 1171 |             with_row_id: true,
 1172 |             with_row_addr: false,
 1173 |             with_row_last_updated_at_version: false,
 1174 |             with_row_created_at_version: false,
 1175 |             deletion_vector: None,
 1176 |             row_id_sequence: Some(Arc::new(RowIdSequence::try_from_iter([42]).unwrap())),
 1177 |             last_updated_at_sequence: None,
 1178 |             created_at_sequence: None,
 1179 |             make_deletions_null: false,
 1180 |             total_num_rows: 1,
 1181 |         };
 1182 | 
 1183 |         let batches = super::wrap_with_row_id_and_delete(stream::iter(tasks).boxed(), 0, config)
 1184 |             .buffered(2)
 1185 |             .try_collect::<Vec<_>>()
 1186 |             .await
 1187 |             .unwrap();
 1188 |         assert_eq!(batches[0].num_rows(), 0);
 1189 |         assert_eq!(
 1190 |             batches[1][ROW_ID].as_primitive::<UInt64Type>().values(),
 1191 |             &[42]
 1192 |         );
 1193 |     }
 1194 | 
 1195 |     #[tokio::test]
 1196 |     async fn test_truncated_stable_row_ids_returns_error() {
 1197 |         let task = ReadBatchTask {
 1198 |             num_rows: 10,
 1199 |             task: std::future::ready(Ok(
 1200 |                 arrow_array::record_batch!(("x", Int32, vec![0; 10])).unwrap()
 1201 |             ))
 1202 |             .boxed(),
 1203 |         };
 1204 |         let config = RowIdAndDeletesConfig {
 1205 |             params: ReadBatchParams::RangeFull,
 1206 |             with_row_id: true,
 1207 |             with_row_addr: false,
 1208 |             with_row_last_updated_at_version: false,
 1209 |             with_row_created_at_version: false,
 1210 |             deletion_vector: None,
 1211 |             row_id_sequence: Some(Arc::new(RowIdSequence::try_from_iter(0_u64..5).unwrap())),
 1212 |             last_updated_at_sequence: None,
 1213 |             created_at_sequence: None,
 1214 |             make_deletions_null: false,
 1215 |             total_num_rows: 10,
 1216 |         };
 1217 | 
 1218 |         let error = super::wrap_with_row_id_and_delete(stream::iter([task]).boxed(), 0, config)
 1219 |             .buffered(1)
 1220 |             .try_collect::<Vec<_>>()
 1221 |             .await
 1222 |             .unwrap_err();
 1223 |         assert!(matches!(error, lance_core::Error::CorruptFile { .. }));
 1224 |         assert!(error.to_string().contains(
 1225 |             "decoded row ID chunk at selected offset 0 contains 5 rows, but the selection requires 10 rows"
 1226 |         ));
 1227 |     }
 1228 | 
 1229 |     #[tokio::test]
 1230 |     async fn test_truncated_stable_row_ids_with_unsorted_indices_returns_error() {
 1231 |         let tasks = (0..4).map(|_| ReadBatchTask {
 1232 |             num_rows: 1,
 1233 |             task: std::future::ready(Ok(
 1234 |                 arrow_array::record_batch!(("x", Int32, vec![0])).unwrap()
 1235 |             ))
 1236 |             .boxed(),
 1237 |         });
 1238 |         let config = RowIdAndDeletesConfig {
 1239 |             params: ReadBatchParams::Indices(UInt32Array::from(vec![0, 5, 1, 2])),
 1240 |             with_row_id: true,
 1241 |             with_row_addr: false,
 1242 |             with_row_last_updated_at_version: false,
 1243 |             with_row_created_at_version: false,
 1244 |             deletion_vector: None,
 1245 |             row_id_sequence: Some(Arc::new(RowIdSequence::try_from_iter(0_u64..5).unwrap())),
 1246 |             last_updated_at_sequence: None,
 1247 |             created_at_sequence: None,
 1248 |             make_deletions_null: false,
 1249 |             total_num_rows: 6,
 1250 |         };
 1251 | 
 1252 |         let error = super::wrap_with_row_id_and_delete(stream::iter(tasks).boxed(), 0, config)
 1253 |             .buffered(1)
 1254 |             .try_collect::<Vec<_>>()
 1255 |             .await
 1256 |             .unwrap_err();
 1257 |         assert!(matches!(error, lance_core::Error::CorruptFile { .. }));
 1258 |     }
 1259 | 
 1260 |     #[tokio::test]
 1261 |     async fn test_stable_row_id_read_ahead_with_variable_task_boundaries() {
 1262 |         let total_rows = super::ROW_ID_READ_AHEAD_ROWS * 3 + 41;
 1263 |         let expected = (0_u64..)
 1264 |             .filter(|row_id| row_id % 17 != 0)
 1265 |             .take(total_rows)
 1266 |             .collect::<Vec<_>>();
 1267 |         let mut remaining = total_rows;
 1268 |         let mut use_short_task = true;
 1269 |         let tasks = std::iter::from_fn(move || {
 1270 |             if remaining == 0 {
 1271 |                 return None;
 1272 |             }
 1273 |             let requested = if use_short_task { 32_768 } else { 32_769 };
 1274 |             use_short_task = !use_short_task;
 1275 |             let num_rows = remaining.min(requested);
 1276 |             remaining -= num_rows;
 1277 |             Some(ReadBatchTask {
 1278 |                 num_rows: num_rows as u32,
 1279 |                 task: std::future::ready(Ok(arrow_array::record_batch!((
 1280 |                     "x",
 1281 |                     Int32,
 1282 |                     vec![0; num_rows]
 1283 |                 ))
 1284 |                 .unwrap()))
 1285 |                 .boxed(),
 1286 |             })
 1287 |         });
 1288 |         let config = RowIdAndDeletesConfig {
 1289 |             params: ReadBatchParams::RangeFull,
 1290 |             with_row_id: true,
 1291 |             with_row_addr: false,
 1292 |             with_row_last_updated_at_version: false,
 1293 |             with_row_created_at_version: false,
 1294 |             deletion_vector: None,
 1295 |             row_id_sequence: Some(Arc::new(
 1296 |                 RowIdSequence::try_from_iter(expected.clone()).unwrap(),
 1297 |             )),
 1298 |             last_updated_at_sequence: None,
 1299 |             created_at_sequence: None,
 1300 |             make_deletions_null: false,
 1301 |             total_num_rows: total_rows as u32,
 1302 |         };
 1303 | 
 1304 |         let batches = super::wrap_with_row_id_and_delete(stream::iter(tasks).boxed(), 0, config)
 1305 |             .buffered(3)
 1306 |             .try_collect::<Vec<_>>()
 1307 |             .await
 1308 |             .unwrap();
 1309 |         let second_schema = batches[1].schema();
 1310 |         let third_schema = batches[2].schema();
 1311 |         assert!(!Arc::ptr_eq(&second_schema, &third_schema));
 1312 | 
 1313 |         let actual = batches
 1314 |             .iter()
 1315 |             .flat_map(|batch| batch[ROW_ID].as_primitive::<UInt64Type>().values())
 1316 |             .copied()
 1317 |             .collect::<Vec<_>>();
 1318 |         assert_eq!(actual, expected);
 1319 |     }
 1320 | 
 1321 |     #[tokio::test]
 1322 |     async fn test_system_columns_share_schema_for_equivalent_payload_batches() {
 1323 |         let batches = (0..3)
 1324 |             .map(|batch_index| {
 1325 |                 arrow_array::record_batch!((
 1326 |                     "payload",
 1327 |                     Int32,
 1328 |                     (batch_index * 10..(batch_index + 1) * 10).collect::<Vec<_>>()
 1329 |                 ))
 1330 |                 .unwrap()
 1331 |             })
 1332 |             .collect::<Vec<_>>();
 1333 |         assert!(!Arc::ptr_eq(&batches[0].schema(), &batches[1].schema()));
 1334 |         let tasks = batches.into_iter().map(|batch| ReadBatchTask {
 1335 |             num_rows: batch.num_rows() as u32,
 1336 |             task: std::future::ready(Ok(batch)).boxed(),
 1337 |         });
 1338 |         let config = RowIdAndDeletesConfig {
 1339 |             params: ReadBatchParams::RangeFull,
 1340 |             with_row_id: true,
 1341 |             with_row_addr: true,
 1342 |             with_row_last_updated_at_version: true,
 1343 |             with_row_created_at_version: true,
 1344 |             deletion_vector: None,
 1345 |             row_id_sequence: Some(Arc::new(
 1346 |                 RowIdSequence::try_from_iter((0..30).map(|row_id| 100 + row_id + row_id / 7))
 1347 |                     .unwrap(),
 1348 |             )),
 1349 |             last_updated_at_sequence: None,
 1350 |             created_at_sequence: None,
 1351 |             make_deletions_null: false,
 1352 |             total_num_rows: 30,
 1353 |         };
 1354 | 
 1355 |         let batches = super::wrap_with_row_id_and_delete(stream::iter(tasks).boxed(), 7, config)
 1356 |             .buffered(3)
 1357 |             .try_collect::<Vec<_>>()
 1358 |             .await
 1359 |             .unwrap();
 1360 |         let expected_fields = [
 1361 |             "payload",
 1362 |             lance_core::ROW_ID,
 1363 |             lance_core::ROW_ADDR,
 1364 |             lance_core::ROW_LAST_UPDATED_AT_VERSION,
 1365 |             lance_core::ROW_CREATED_AT_VERSION,
 1366 |         ];
 1367 |         assert_eq!(
 1368 |             batches[0]
 1369 |                 .schema()
 1370 |                 .fields()
 1371 |                 .iter()
 1372 |                 .map(|field| field.name().as_str())
 1373 |                 .collect::<Vec<_>>(),
 1374 |             expected_fields
 1375 |         );
 1376 |         assert!(
 1377 |             batches
 1378 |                 .windows(2)
 1379 |                 .all(|pair| Arc::ptr_eq(&pair[0].schema(), &pair[1].schema()))
 1380 |         );
 1381 |         assert!(batches.iter().all(|batch| batch.num_columns() == 5));
 1382 |     }
 1383 | 
 1384 |     #[tokio::test]
 1385 |     async fn test_zip_with_different_batch_boundaries() {
 1386 |         let left_batch =
 1387 |             arrow_array::record_batch!(("x", Int32, (0..10).collect::<Vec<_>>())).unwrap();
 1388 |         let right_batch =
 1389 |             arrow_array::record_batch!(("y", Int32, (10..20).collect::<Vec<_>>())).unwrap();
 1390 |         let left = batch_task_stream(
 1391 |             stream::iter([Ok(left_batch.slice(0, 6)), Ok(left_batch.slice(6, 4))]).boxed(),
 1392 |         );
 1393 |         let right = batch_task_stream(
 1394 |             stream::iter([Ok(right_batch.slice(0, 4)), Ok(right_batch.slice(4, 6))]).boxed(),
 1395 |         );
 1396 | 
 1397 |         let merged = super::merge_streams(vec![left, right])
 1398 |             .map(|batch_task| batch_task.task)
 1399 |             .buffered(3)
 1400 |             .try_collect::<Vec<_>>()
 1401 |             .await
 1402 |             .unwrap();
 1403 | 
 1404 |         let expected = vec![
 1405 |             arrow_array::record_batch!(
 1406 |                 ("x", Int32, (0..4).collect::<Vec<_>>()),
 1407 |                 ("y", Int32, (10..14).collect::<Vec<_>>())
 1408 |             )
 1409 |             .unwrap(),
 1410 |             arrow_array::record_batch!(
 1411 |                 ("x", Int32, (4..6).collect::<Vec<_>>()),
 1412 |                 ("y", Int32, (14..16).collect::<Vec<_>>())
 1413 |             )
 1414 |             .unwrap(),
 1415 |             arrow_array::record_batch!(
 1416 |                 ("x", Int32, (6..10).collect::<Vec<_>>()),
 1417 |                 ("y", Int32, (16..20).collect::<Vec<_>>())
 1418 |             )
 1419 |             .unwrap(),
 1420 |         ];
 1421 |         assert_eq!(merged, expected);
 1422 |     }
 1423 | 
 1424 |     async fn check_row_id(params: ReadBatchParams, expected: impl IntoIterator<Item = u32>) {
 1425 |         let expected = Vec::from_iter(expected);
 1426 | 
 1427 |         for has_columns in [false, true] {
 1428 |             for fragment_id in [0, 10] {
 1429 |                 // 100 rows across 10 batches of 10 rows
 1430 |                 let mut datagen = lance_datagen::gen_batch();
 1431 |                 if has_columns {
 1432 |                     datagen = datagen.col("x", lance_datagen::array::rand::<Int32Type>());
 1433 |                 }
 1434 |                 let data = batch_task_stream(
 1435 |                     datagen
 1436 |                         .into_reader_stream(RowCount::from(10), BatchCount::from(10))
 1437 |                         .0,
 1438 |                 );
 1439 | 
 1440 |                 let config = RowIdAndDeletesConfig {
 1441 |                     params: params.clone(),
 1442 |                     with_row_id: true,
 1443 |                     with_row_addr: false,
 1444 |                     with_row_last_updated_at_version: false,
 1445 |                     with_row_created_at_version: false,
 1446 |                     deletion_vector: None,
 1447 |                     row_id_sequence: None,
 1448 |                     last_updated_at_sequence: None,
 1449 |                     created_at_sequence: None,
 1450 |                     make_deletions_null: false,
 1451 |                     total_num_rows: 100,
 1452 |                 };
 1453 |                 let stream = super::wrap_with_row_id_and_delete(data, fragment_id, config);
 1454 |                 let batches = stream.buffered(1).try_collect::<Vec<_>>().await.unwrap();
 1455 | 
 1456 |                 let mut offset = 0;
 1457 |                 let expected = expected.clone();
 1458 |                 for batch in batches {
 1459 |                     let actual_row_ids =
 1460 |                         batch[ROW_ID].as_primitive::<UInt64Type>().values().to_vec();
 1461 |                     let expected_row_ids = expected[offset..offset + 10]
 1462 |                         .iter()
 1463 |                         .map(|row_offset| {
 1464 |                             RowAddress::new_from_parts(fragment_id, *row_offset).into()
 1465 |                         })
 1466 |                         .collect::<Vec<u64>>();
 1467 |                     assert_eq!(actual_row_ids, expected_row_ids);
 1468 |                     offset += batch.num_rows();
 1469 |                 }
 1470 |             }
 1471 |         }
 1472 |     }
 1473 | 
 1474 |     #[tokio::test]
 1475 |     async fn test_row_id() {
 1476 |         let some_indices = (0..100).rev().collect::<Vec<u32>>();
 1477 |         let some_indices_arr = UInt32Array::from(some_indices.clone());
 1478 |         check_row_id(ReadBatchParams::RangeFull, 0..100).await;
 1479 |         check_row_id(ReadBatchParams::Indices(some_indices_arr), some_indices).await;
 1480 |         check_row_id(ReadBatchParams::Range(1000..1100), 1000..1100).await;
 1481 |         check_row_id(
 1482 |             ReadBatchParams::RangeFrom(std::ops::RangeFrom { start: 1000 }),
 1483 |             1000..1100,
 1484 |         )
 1485 |         .await;
 1486 |         check_row_id(
 1487 |             ReadBatchParams::RangeTo(std::ops::RangeTo { end: 1000 }),
 1488 |             0..100,
 1489 |         )
 1490 |         .await;
 1491 |     }
 1492 | 
 1493 |     #[tokio::test]
 1494 |     async fn test_deletes() {
 1495 |         let no_deletes: Option<Arc<DeletionVector>> = None;
 1496 |         let no_deletes_2 = Some(Arc::new(DeletionVector::NoDeletions));
 1497 |         let delete_some_bitmap = Some(Arc::new(DeletionVector::Bitmap(RoaringBitmap::from_iter(
 1498 |             0..35,
 1499 |         ))));
 1500 |         let delete_some_set = Some(Arc::new(DeletionVector::Set((0..35).collect())));
 1501 | 
 1502 |         for deletion_vector in [
 1503 |             no_deletes,
 1504 |             no_deletes_2,
 1505 |             delete_some_bitmap,
 1506 |             delete_some_set,
 1507 |         ] {
 1508 |             for has_columns in [false, true] {
 1509 |                 for with_row_id in [false, true] {
 1510 |                     for make_deletions_null in [false, true] {
 1511 |                         for frag_id in [0, 1] {
 1512 |                             let has_deletions = if let Some(dv) = &deletion_vector {
 1513 |                                 !matches!(dv.as_ref(), DeletionVector::NoDeletions)
 1514 |                             } else {
 1515 |                                 false
 1516 |                             };
 1517 |                             if !has_columns && !has_deletions && !with_row_id {
 1518 |                                 // This is an invalid case and should be prevented upstream,
 1519 |                                 // no meaningful work is being done!
 1520 |                                 continue;
 1521 |                             }
 1522 |                             if make_deletions_null && !with_row_id {
 1523 |                                 // This is an invalid case and should be prevented upstream
 1524 |                                 // we cannot make the row_id column null if it isn't present
 1525 |                                 continue;
 1526 |                             }
 1527 | 
 1528 |                             let mut datagen = lance_datagen::gen_batch();
 1529 |                             if has_columns {
 1530 |                                 datagen =
 1531 |                                     datagen.col("x", lance_datagen::array::rand::<Int32Type>());
 1532 |                             }
 1533 |                             // 100 rows across 10 batches of 10 rows
 1534 |                             let data = batch_task_stream(
 1535 |                                 datagen
 1536 |                                     .into_reader_stream(RowCount::from(10), BatchCount::from(10))
 1537 |                                     .0,
 1538 |                             );
 1539 | 
 1540 |                             let config = RowIdAndDeletesConfig {
 1541 |                                 params: ReadBatchParams::RangeFull,
 1542 |                                 with_row_id,
 1543 |                                 with_row_addr: false,
 1544 |                                 with_row_last_updated_at_version: false,
 1545 |                                 with_row_created_at_version: false,
 1546 |                                 deletion_vector: deletion_vector.clone(),
 1547 |                                 row_id_sequence: None,
 1548 |                                 last_updated_at_sequence: None,
 1549 |                                 created_at_sequence: None,
 1550 |                                 make_deletions_null,
 1551 |                                 total_num_rows: 100,
 1552 |                             };
 1553 |                             let stream = super::wrap_with_row_id_and_delete(data, frag_id, config);
 1554 |                             let batches = stream
 1555 |                                 .buffered(1)
 1556 |                                 .filter_map(|batch| {
 1557 |                                     std::future::ready(
 1558 |                                         batch
 1559 |                                             .map(|batch| {
 1560 |                                                 if batch.num_rows() == 0 {
 1561 |                                                     None
 1562 |                                                 } else {
 1563 |                                                     Some(batch)
 1564 |                                                 }
 1565 |                                             })
 1566 |                                             .transpose(),
 1567 |                                     )
 1568 |                                 })
 1569 |                                 .try_collect::<Vec<_>>()
 1570 |                                 .await
 1571 |                                 .unwrap();
 1572 | 
 1573 |                             let total_num_rows =
 1574 |                                 batches.iter().map(|b| b.num_rows()).sum::<usize>();
 1575 |                             let total_num_nulls = if make_deletions_null {
 1576 |                                 batches
 1577 |                                     .iter()
 1578 |                                     .map(|b| b[ROW_ID].null_count())
 1579 |                                     .sum::<usize>()
 1580 |                             } else {
 1581 |                                 0
 1582 |                             };
 1583 |                             let total_actually_deleted = total_num_nulls + (100 - total_num_rows);
 1584 | 
 1585 |                             let expected_deletions = match &deletion_vector {
 1586 |                                 None => 0,
 1587 |                                 Some(deletion_vector) => match deletion_vector.as_ref() {
 1588 |                                     DeletionVector::NoDeletions => 0,
 1589 |                                     DeletionVector::Bitmap(b) => b.len() as usize,
 1590 |                                     DeletionVector::Set(s) => s.len(),
 1591 |                                 },
 1592 |                             };
 1593 |                             assert_eq!(total_actually_deleted, expected_deletions);
 1594 |                             if expected_deletions > 0 && with_row_id {
 1595 |                                 if make_deletions_null {
 1596 |                                     // If we make deletions null we get 3 batches of all-null and then
 1597 |                                     // a batch of half-null
 1598 |                                     assert_eq!(
 1599 |                                         batches[3][ROW_ID].as_primitive::<UInt64Type>().value(0),
 1600 |                                         u64::from(RowAddress::new_from_parts(frag_id, 30))
 1601 |                                     );
 1602 |                                     assert_eq!(batches[3][ROW_ID].null_count(), 5);
 1603 |                                 } else {
 1604 |                                     // If we materialize deletions the first row will be 35
 1605 |                                     assert_eq!(
 1606 |                                         batches[0][ROW_ID].as_primitive::<UInt64Type>().value(0),
 1607 |                                         u64::from(RowAddress::new_from_parts(frag_id, 35))
 1608 |                                     );
 1609 |                                 }
 1610 |                             }
 1611 |                             if !with_row_id {
 1612 |                                 assert!(batches[0].column_by_name(ROW_ID).is_none());
 1613 |                             }
 1614 |                         }
 1615 |                     }
 1616 |                 }
 1617 |             }
 1618 |         }
 1619 |     }
 1620 | 
 1621 |     #[tokio::test]
 1622 |     async fn test_version_column_with_deletions() {
 1623 |         use crate::rowids::segment::U64Segment;
 1624 |         use crate::rowids::version::{RowDatasetVersionRun, RowDatasetVersionSequence};
 1625 | 
 1626 |         let seq = Arc::new(RowDatasetVersionSequence {
 1627 |             runs: vec![RowDatasetVersionRun {
 1628 |                 span: U64Segment::Range(0..100),
 1629 |                 version: 42,
 1630 |             }],
 1631 |         });
 1632 | 
 1633 |         let data = batch_task_stream(
 1634 |             lance_datagen::gen_batch()
 1635 |                 .col("x", lance_datagen::array::rand::<Int32Type>())
 1636 |                 .into_reader_stream(RowCount::from(10), BatchCount::from(10))
 1637 |                 .0,
 1638 |         );
 1639 | 
 1640 |         let config = RowIdAndDeletesConfig {
 1641 |             params: ReadBatchParams::RangeFull,
 1642 |             with_row_id: true,
 1643 |             with_row_addr: false,
 1644 |             with_row_last_updated_at_version: false,
 1645 |             with_row_created_at_version: true,
 1646 |             deletion_vector: Some(Arc::new(DeletionVector::Bitmap(RoaringBitmap::from_iter(
 1647 |                 0..35,
 1648 |             )))),
 1649 |             row_id_sequence: None,
 1650 |             last_updated_at_sequence: None,
 1651 |             created_at_sequence: Some(seq),
 1652 |             make_deletions_null: false,
 1653 |             total_num_rows: 100,
 1654 |         };
 1655 |         let stream = super::wrap_with_row_id_and_delete(data, 0, config);
 1656 |         let batches: Vec<_> = stream
 1657 |             .buffered(1)
 1658 |             .try_filter(|b| std::future::ready(b.num_rows() > 0))
 1659 |             .try_collect()
 1660 |             .await
 1661 |             .unwrap();
 1662 | 
 1663 |         let total_rows: usize = batches.iter().map(|b| b.num_rows()).sum();
 1664 |         assert_eq!(total_rows, 65);
 1665 | 
 1666 |         for batch in &batches {
 1667 |             let versions = batch
 1668 |                 .column_by_name("_row_created_at_version")
 1669 |                 .unwrap()
 1670 |                 .as_primitive::<UInt64Type>()
 1671 |                 .values();
 1672 |             assert!(versions.iter().all(|&v| v == 42));
 1673 |         }
 1674 |     }
 1675 | 
 1676 |     #[tokio::test]
 1677 |     async fn test_version_column_multi_run() {
 1678 |         use crate::rowids::segment::U64Segment;
 1679 |         use crate::rowids::version::{RowDatasetVersionRun, RowDatasetVersionSequence};
 1680 | 
 1681 |         // Exercise the worst-case created-at shape: one run per row.
 1682 |         let created_seq = Arc::new(RowDatasetVersionSequence {
 1683 |             runs: (0..100)
 1684 |                 .map(|position| RowDatasetVersionRun {
 1685 |                     span: U64Segment::Range(position..position + 1),
 1686 |                     version: 1_000 + position,
 1687 |                 })
 1688 |                 .collect(),
 1689 |         });
 1690 |         // Also exercise irregular boundaries for last-updated-at.
 1691 |         let last_updated_seq = Arc::new(RowDatasetVersionSequence {
 1692 |             runs: vec![
 1693 |                 RowDatasetVersionRun {
 1694 |                     span: U64Segment::Range(0..7),
 1695 |                     version: 11,
 1696 |                 },
 1697 |                 RowDatasetVersionRun {
 1698 |                     span: U64Segment::Range(7..20),
 1699 |                     version: 22,
 1700 |                 },
 1701 |                 RowDatasetVersionRun {
 1702 |                     span: U64Segment::Range(20..21),
 1703 |                     version: 33,
 1704 |                 },
 1705 |                 RowDatasetVersionRun {
 1706 |                     span: U64Segment::Range(21..50),
 1707 |                     version: 44,
 1708 |                 },
 1709 |                 RowDatasetVersionRun {
 1710 |                     span: U64Segment::Range(50..100),
 1711 |                     version: 55,
 1712 |                 },
 1713 |             ],
 1714 |         });
 1715 | 
 1716 |         // Delete 0..20 and 60..80 (spans run boundary).
 1717 |         // Survivors: 20..40 (v1), 40..60 (v2), 80..100 (v3) = 60 rows
 1718 |         let mut deletions = RoaringBitmap::from_iter(0..20);
 1719 |         deletions.extend(60..80);
 1720 | 
 1721 |         let data = batch_task_stream(
 1722 |             lance_datagen::gen_batch()
 1723 |                 .col("x", lance_datagen::array::rand::<Int32Type>())
 1724 |                 .into_reader_stream(RowCount::from(10), BatchCount::from(10))
 1725 |                 .0,
 1726 |         );
 1727 | 
 1728 |         let config = RowIdAndDeletesConfig {
 1729 |             params: ReadBatchParams::RangeFull,
 1730 |             with_row_id: true,
 1731 |             with_row_addr: false,
 1732 |             with_row_last_updated_at_version: true,
 1733 |             with_row_created_at_version: true,
 1734 |             deletion_vector: Some(Arc::new(DeletionVector::Bitmap(deletions))),
 1735 |             row_id_sequence: None,
 1736 |             last_updated_at_sequence: Some(last_updated_seq),
 1737 |             created_at_sequence: Some(created_seq),
 1738 |             make_deletions_null: false,
 1739 |             total_num_rows: 100,
 1740 |         };
 1741 |         let stream = super::wrap_with_row_id_and_delete(data, 0, config);
 1742 |         let batches: Vec<_> = stream
 1743 |             .buffered(8)
 1744 |             .try_filter(|b| std::future::ready(b.num_rows() > 0))
 1745 |             .try_collect()
 1746 |             .await
 1747 |             .unwrap();
 1748 | 
 1749 |         let total_rows: usize = batches.iter().map(|b| b.num_rows()).sum();
 1750 |         assert_eq!(total_rows, 60);
 1751 | 
 1752 |         let created_versions: Vec<u64> = batches
 1753 |             .iter()
 1754 |             .flat_map(|b| {
 1755 |                 b.column_by_name("_row_created_at_version")
 1756 |                     .unwrap()
 1757 |                     .as_primitive::<UInt64Type>()
 1758 |                     .values()
 1759 |                     .to_vec()
 1760 |             })
 1761 |             .collect();
 1762 |         let last_updated_versions: Vec<u64> = batches
 1763 |             .iter()
 1764 |             .flat_map(|b| {
 1765 |                 b.column_by_name("_row_last_updated_at_version")
 1766 |                     .unwrap()
 1767 |                     .as_primitive::<UInt64Type>()
 1768 |                     .values()
 1769 |                     .to_vec()
 1770 |             })
 1771 |             .collect();
 1772 |         let surviving_positions: Vec<u64> = (20..60).chain(80..100).collect();
 1773 |         let expected_created: Vec<u64> = surviving_positions
 1774 |             .iter()
 1775 |             .map(|position| 1_000 + position)
 1776 |             .collect();
 1777 |         let expected_last_updated: Vec<u64> = surviving_positions
 1778 |             .iter()
 1779 |             .map(|position| match position {
 1780 |                 0..=6 => 11,
 1781 |                 7..=19 => 22,
 1782 |                 20 => 33,
 1783 |                 21..=49 => 44,
 1784 |                 _ => 55,
 1785 |             })
 1786 |             .collect();
 1787 | 
 1788 |         assert_eq!(created_versions, expected_created);
 1789 |         assert_eq!(last_updated_versions, expected_last_updated);
 1790 |     }
 1791 | 
 1792 |     #[tokio::test]
 1793 |     async fn test_version_column_with_unsorted_indices_across_batches() {
 1794 |         use crate::rowids::segment::U64Segment;
 1795 |         use crate::rowids::version::{RowDatasetVersionRun, RowDatasetVersionSequence};
 1796 | 
 1797 |         let sequence = Arc::new(RowDatasetVersionSequence {
 1798 |             runs: (0..10)
 1799 |                 .map(|position| RowDatasetVersionRun {
 1800 |                     span: U64Segment::Range(position..position + 1),
 1801 |                     version: 100 + position,
 1802 |                 })
 1803 |                 .collect(),
 1804 |         });
 1805 |         let indices = UInt32Array::from(vec![8, 2, 9, 1, 6]);
 1806 |         let batches = [2, 2, 1].into_iter().map(|num_rows| ReadBatchTask {
 1807 |             num_rows,
 1808 |             task: std::future::ready(Ok(arrow_array::record_batch!((
 1809 |                 "x",
 1810 |                 Int32,
 1811 |                 vec![0; num_rows as usize]
 1812 |             ))
 1813 |             .unwrap()))
 1814 |             .boxed(),
 1815 |         });
 1816 |         let config = RowIdAndDeletesConfig {
 1817 |             params: ReadBatchParams::Indices(indices.clone()),
 1818 |             with_row_id: false,
 1819 |             with_row_addr: false,
 1820 |             with_row_last_updated_at_version: true,
 1821 |             with_row_created_at_version: false,
 1822 |             deletion_vector: None,
 1823 |             row_id_sequence: None,
 1824 |             last_updated_at_sequence: Some(sequence),
 1825 |             created_at_sequence: None,
 1826 |             make_deletions_null: false,
 1827 |             total_num_rows: 10,
 1828 |         };
 1829 | 
 1830 |         let actual = super::wrap_with_row_id_and_delete(stream::iter(batches).boxed(), 0, config)
 1831 |             .buffered(3)
 1832 |             .try_collect::<Vec<_>>()
 1833 |             .await
 1834 |             .unwrap()
 1835 |             .iter()
 1836 |             .flat_map(|batch| {
 1837 |                 batch["_row_last_updated_at_version"]
 1838 |                     .as_primitive::<UInt64Type>()
 1839 |                     .values()
 1840 |             })
 1841 |             .copied()
 1842 |             .collect::<Vec<_>>();
 1843 |         let expected = indices
 1844 |             .values()
 1845 |             .iter()
 1846 |             .map(|position| 100 + u64::from(*position))
 1847 |             .collect::<Vec<_>>();
 1848 |         assert_eq!(actual, expected);
 1849 |     }
 1850 | 
 1851 |     #[test]
 1852 |     fn test_apply_version_column_direct_call_fallback() {
 1853 |         use crate::rowids::segment::U64Segment;
 1854 |         use crate::rowids::version::{RowDatasetVersionRun, RowDatasetVersionSequence};
 1855 | 
 1856 |         let sequence = Arc::new(RowDatasetVersionSequence {
 1857 |             runs: (0..5)
 1858 |                 .map(|position| RowDatasetVersionRun {
 1859 |                     span: U64Segment::Range(position..position + 1),
 1860 |                     version: 10 + position,
 1861 |                 })
 1862 |                 .collect(),
 1863 |         });
 1864 |         let config = RowIdAndDeletesConfig {
 1865 |             params: ReadBatchParams::Indices(UInt32Array::from(vec![4, 1, 3])),
 1866 |             with_row_id: false,
 1867 |             with_row_addr: false,
 1868 |             with_row_last_updated_at_version: true,
 1869 |             with_row_created_at_version: false,
 1870 |             deletion_vector: None,
 1871 |             row_id_sequence: None,
 1872 |             last_updated_at_sequence: Some(sequence),
 1873 |             created_at_sequence: None,
 1874 |             make_deletions_null: false,
 1875 |             total_num_rows: 5,
 1876 |         };
 1877 |         let batch = arrow_array::record_batch!(("x", Int32, vec![0; 3])).unwrap();
 1878 | 
 1879 |         let actual = super::apply_row_id_and_deletes(batch, 0, 0, &config).unwrap();
 1880 |         assert_eq!(
 1881 |             actual["_row_last_updated_at_version"]
 1882 |                 .as_primitive::<UInt64Type>()
 1883 |                 .values(),
 1884 |             &[14, 11, 13]
 1885 |         );
 1886 |     }
 1887 | }
``````
