> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-encoding/src/decoder.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `f93651581c094ad418b01df5e5ee7ad1a4cc161a119ba0d25241b3ce249e25d4`. Reviewed physical lines: 1-4203.

[Module](../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Read-plan construction, array/structural scheduling and decoding, row/byte batch planning, request aggregation and public decode contracts. (rust/lance-encoding/src/decoder.rs:1-4203)

## Complete range analysis

### Lines 1-55

Module documentation separates scheduling I/O from Arrow decoding and sketches field/page and logical/physical hierarchies. These conceptual comments largely describe array encoding, not every current structural path. They claim page bridging is unimplemented; implementation details below and codec modules are authoritative. (rust/lance-encoding/src/decoder.rs:1-55)

### Lines 56-115

Lists illustrate offsets/items and independent page boundaries. Single-column multi-buffer storage cannot project nested fields independently; multiple physical columns need synchronization. The diagram separates I/O and CPU concurrency. This is architecture documentation, not evidence of measured throughput or actual task placement. (rust/lance-encoding/src/decoder.rs:56-115)

### Lines 116-172

Row-major scheduling example uses differently sized pages for score, ID and vectors. A printed last vector page C2P1024 appears off by one for1024 zero-indexed pages; examples are not executable scheduling validation. Whole-file scheduling/backpressure discussion must be read alongside actual initialization, requested ranges and inline policies below. (rust/lance-encoding/src/decoder.rs:116-172)

### Lines 173-214

Indirect I/O and batch-size guidance describe intended separation and tradeoffs. Follow-up I/O behavior depends on concrete codecs, which remain pending. Smaller batches are a recommendation, not a measured optimal size. (rust/lance-encoding/src/decoder.rs:173-214)

### Lines 215-262

Imports connect Arrow/core types, array and structural logical schedulers, rep/def, caches, futures, Tokio channels and I/O. No codec implementation is defined by an import. (rust/lance-encoding/src/decoder.rs:215-262)

### Lines 263-292

CANDIDATE_BATCH_SIZES is eight powers of four from1 through16384. SchedulingJob requires Debug only, reports rows and schedules with context plus PriorityRange. FieldScheduler requires Send+Sync+Debug, initializes through a borrowed future and creates a job borrowing itself. (rust/lance-encoding/src/decoder.rs:263-292)

### Lines 293-342

DecoderReady owns a logical page decoder and VecDeque path. LogicalPageDecoder requires Debug+Send; default accept_child returns contextual Internal, wait_for_loaded is asynchronous, counters and drain are implementation contracts. rows_unloaded/rows_left subtract unchecked; default max_rows_to_drain accepts every row with byte estimate0. (rust/lance-encoding/src/decoder.rs:293-342)

### Lines 343-388

DrainLimit carries rows and bytes for the most constrained nested i32-offset array. Budget is i32::MAX. clamp_rows_to_i32_budget returns0 only for zero request, otherwise clamps estimate to at least1, allowing one oversized estimated row. has_i32_offsets recognizes Binary/Utf8/List/ListView/Map and recurses through large lists, FSL, structs, dictionary values and run-end values. (rust/lance-encoding/src/decoder.rs:343-388)

### Lines 389-415

Large-batch diagnostic threshold is10MiB. Repetition-index cache env is parsed once with defaulttrue. Inline threshold env is parsed once as trimmed u64, default16384 on missing/invalid input; zero is accepted. OnceLock freezes the first result. Structural decode spawn env is declared here but read per construction later. (rust/lance-encoding/src/decoder.rs:389-415)

### Lines 416-456

PageEncoding is Clone+Debug Legacy ArrayEncoding or Structural PageLayout. DeepSizeOf estimates encoded protobuf length times4, not exact allocation. Variant accessors panic on wrong grammar; is_structural is only a tag check. (rust/lance-encoding/src/decoder.rs:416-456)

### Lines 457-480

PageInfo exposes row count, top-row priority, encoding and shared buffer offset/size pairs. Its only-2.1 priority comment is stale relative to reviewed newer structural formats. DeepSizeOf delegates to each field; this record does not validate positions, counts or grammar consistency. (rust/lance-encoding/src/decoder.rs:457-480)

### Lines 481-528

ColumnInfo Clone+Debug stores index, shared pages/buffers and protobuf column encoding. new wraps inputs without validation. is_structural examines only the first page and returnsfalse for no pages; mixed page grammars are not rejected here. (rust/lance-encoding/src/decoder.rs:481-528)

### Lines 529-576

Private RootScheduler distinguishes structural boxed scheduler from array Arc scheduler; wrong accessor panics. DecodeBatchScheduler stores root/cache and exposes root_fields. Backpressure remains a TODO in its documentation, not an enforced queue bound. (rust/lance-encoding/src/decoder.rs:529-576)

### Lines 577-631

ColumnInfoIter owns a cloned Arc vector and borrows supplied top-level index mapping. next advances sequential physical position; next_top_level jumps to the next mapped index or end. peek and transform direct-index and can panic. transform clones/replaces only this iterator vector. expect_next converts exhaustion into InvalidInput but no bounds, duplicates, shape or mapping validation occurs up front. (rust/lance-encoding/src/decoder.rs:577-631)

### Lines 632-685

FileBuffers, ColumnBuffers and PageBuffers are nested Copy+Clone+Debug borrowed offset/size views. CoreFieldDecoderStrategy Default sets validatefalse, default decompression and cache_repfalse; from_config copies config and with_cache accepts either bool. This differs from DecoderConfig default cachetrue. (rust/lance-encoding/src/decoder.rs:632-685)

### Lines 686-746

ensure_values_encoded requires Some Values or InvalidInput with field/index/encoding context. Structural primitive recognition includes recursive Dictionary and FSL plus primitive/scalar/binary/string types. Array primitive recognition excludes variable-width binary and Dictionary here, which have separate branches. Decoder recognition is not identical to encoder primitive policy. (rust/lance-encoding/src/decoder.rs:686-746)

### Lines 747-789

create_primitive requires Values then builds PrimitiveFieldScheduler with column/file buffer context. check_simple_struct requires exactlyone legacy Struct page, but unwraps protobuf oneof and variant accessor can panic; its caller later unwraps its Result. packed probe indexes page0 and unwraps encoding without an empty-page guard. (rust/lance-encoding/src/decoder.rs:747-789)

### Lines 790-865

Legacy list factory requires Values, recursively constructs field.children[0] before page encoding checks, ignores zero-row offset pages, and rejects non-List/missing-offset encoding with contextual InvalidInput. It creates UInt64 inner offset pages with priority0 and OffsetPageInfo, then ListScheduler using Int32/Int64 offsets according to List/LargeList. Child shape/indexing remains an assumption. (rust/lance-encoding/src/decoder.rs:790-865)

### Lines 866-899

unwrap_blob unwraps column oneof and Blob.inner, cloning ColumnInfo with inner encoding. Structural dispatch first validates FSL dimensions, then primitive types consume one column and construct lazy PrimitiveStructuralScheduler with decompressor/cache settings; advance top-level mapping only after successful construction. (rust/lance-encoding/src/decoder.rs:866-899)

### Lines 900-941

Packed Struct takes the primitive structural path before blob handling. Blob Struct takes one primitive column if any page is BlobLayout; otherwise ordinary recursive Struct handling applies. Peek can panic; mixed page layouts are not universally checked here. Empty ordinary Struct creates zero children and consumes no column, unlike encoder primitive acceptance of empty Struct; cross-boundary compatibility requires concrete-codec evidence. (rust/lance-encoding/src/decoder.rs:900-941)

### Lines 942-985

Structural List/LargeList and direct FSL<Struct> require first child through expect_ok and recurse. FSL wrappers around another FSL<Struct> are not recognized by this direct guard. Map rejects keys_sorted=true, requires entries child and recurses; no local exact arity/key-value validation. Other types hit todo panic. (rust/lance-encoding/src/decoder.rs:942-985)

### Lines 986-1030

Array dispatch validates FSL dimensions. Primitive fields consume one column. Binary/string types unwrap Blob descriptors when configured; otherwise a first legacy List page routes through synthesized UInt8 List/LargeList plus Binary wrapper, and other/empty page sets use primitive scheduling. (rust/lance-encoding/src/decoder.rs:986-1030)

### Lines 1031-1070

Array nonprimitive FSL is todo. Dictionary supports primitive or binary-like values, otherwise NotSupported. List consumes offsets column and advances mapping before recursively constructing its item scheduler. (rust/lance-encoding/src/decoder.rs:1031-1070)

### Lines 1071-1123

Array Struct consumes one column; Blob descriptors and packed Struct use primitive scheduling, otherwise check_simple_struct is unwrapped, rows summed, each child advances top-level mapping then recurses. Unsupported types hit todo. Result-returning API therefore retains panic assumptions for malformed/unsupported inputs. (rust/lance-encoding/src/decoder.rs:1071-1123)

### Lines 1124-1154

root_column synthesizes legacy Struct metadata. Pages are ceil(num_rows/u32::MAX), final row count is modulo u32::MAX, and nonfinal pages use u64::MAX. Exactly u32::MAX therefore produces a zero-row page; larger values produce multiple pages rejected by the simple-struct single-page check. This is source deduction, not reproduced runtime failure. Dummy index is u32::MAX, Values encoding, no buffers. (rust/lance-encoding/src/decoder.rs:1124-1154)

### Lines 1155-1208

RootDecoder publicly distinguishes structural and array root types; into accessors panic on wrong variant. Public async DecodeBatchScheduler::try_new accepts schema, mapping, columns, file buffers, row count, plugins, I/O, cache, filter and decoder config; delegates to range-aware constructor with None. (rust/lance-encoding/src/decoder.rs:1155-1208)

### Lines 1209-1248

Range-aware constructor asserts positive rows, converts schema to a nonnullable root Struct, restores original Field IDs, and inserts __lance_decoder_root=true metadata. _decoder_plugins is unused. Empty columns or first-column structural classification selects structural dispatch; initialization awaits requested-range/filter context. (rust/lance-encoding/src/decoder.rs:1209-1248)

### Lines 1249-1285

Array construction prepends dummy root column and index0, shifts each supplied index with saturating_add(1), creates array root and awaits initialization without requested-range restriction. Both paths return stored cache/root fields. Column mapping and grammar assumptions are not globally validated. (rust/lance-encoding/src/decoder.rs:1249-1285)

### Lines 1286-1343

from_scheduler is deprecated since0.29.1 and supports array root only. Structural scheduling builds a job, reports construction/step errors through callback then returns, flushes queued I/O after each successful step before checking empty completion, sums emitted scan-line rows, and stops when callback returnsfalse. (rust/lance-encoding/src/decoder.rs:1286-1343)

### Lines 1344-1407

Array range scheduling computes unchecked range lengths, traces first/last by unwrap, builds a job and loops until its reported row count is scheduled. Default SimplePriority starts0, advances by rows; callbacks can stop. I/O flush occurs per step. Zero-progress jobs can loop, overscheduling/subtraction can underflow, and empty ranges can reach trace unwrap assumptions. (rust/lance-encoding/src/decoder.rs:1344-1407)

### Lines 1408-1451

Root dispatch chooses structural or array; custom PriorityRange applies only to array. schedule_ranges_to_vec collects every Result message in memory then collects into Result, discarding partial successful output when an error exists. (rust/lance-encoding/src/decoder.rs:1408-1451)

### Lines 1452-1539

Public range/channel wrappers require sorted nonoverlapping ranges by documentation, without local validation. Closed unbounded receiver logs debug and halts scheduling. schedule_take returns for empty indices, otherwise validates/coalesces through indices_to_ranges; validation errors are sent once, closed error channel logs debug. (rust/lance-encoding/src/decoder.rs:1452-1539)

### Lines 1540-1598

ReadBatchTask publicly owns static future and u32 row metadata. Array BatchDecodeStream stores receiver/root/counters/Once diagnostic/limitflag. new enables i32 limiting but accepts rows_per_batch0 without validation; private constructor can disable it. (rust/lance-encoding/src/decoder.rs:1540-1598)

### Lines 1599-1633

Array stream ignores empty decoder paths for root, otherwise accepts child. wait_for_scheduled updates cumulative count and accepts messages until need; errors propagate. EOF marks scheduling exhausted and treats fewer rows as possible pushdown, not corruption. Wrong message variants panic. (rust/lance-encoding/src/decoder.rs:1599-1633)

### Lines 1634-1692

Array next task decrements remaining rows before loading, waits for missing scheduled rows, shrinks on early EOF and returnsNone for zero take. Always waits for loaded rows using drained+take-1. If i32 limits apply, query nested budget, force at leastone row and restore deferred rows to remaining count. Drain advances counters before decode CPU work. (rust/lance-encoding/src/decoder.rs:1634-1692)

### Lines 1693-1734

Array unfold emits one zero-row error task then fuses after planning/load/drain error. Successful task future calls tokio::spawn with synchronous into_batch inside async body when polled, not spawn_blocking/spawn_cpu. Join errors are wrapped. Decode-task errors do not update stream planning state or automatically fuse it. (rust/lance-encoding/src/decoder.rs:1693-1734)

### Lines 1735-1792

RootDecoderMessage/RootDecoderType adapt blocking decoder paths. Structural accepts loaded pages, drains and has no wait or budget override. Array accepts child pages, block_on waits and supplies i32 budget only for relevant types. Default budget permits all rows, so structural blocking path lacks this array i32 limiter. (rust/lance-encoding/src/decoder.rs:1735-1792)

### Lines 1793-1846

Blocking BatchDecodeIterator owns a newly built current-thread Tokio runtime without enable_all, counters/schema/Once and precollected messages. Construction unwraps runtime result. wait_for_page wraps future with maybe_done and block_on for Future; Done takes output and Gone is unreachable. It is a wait adapter, not an independent I/O runtime guarantee. (rust/lance-encoding/src/decoder.rs:1793-1846)

### Lines 1847-1880

Blocking wait consumes messages until cumulative need and loads structural pages sequentially; empty array root paths are skipped. It then waits for array root loaded count before caller adjusts for under-scheduling. Waiting is invoked only when additional scheduling messages are required. Structural adapter wait is no-op. (rust/lance-encoding/src/decoder.rs:1847-1880)

### Lines 1881-1951

Blocking next predecrements remaining rows, adjusts EOF shortfall, applies adapter budget (array only), drains and materializes synchronously. Iterator fuses after any error, including decode CPU errors, and converts to ArrowError. It owns an Arc schema getter. Counter updates precede CPU decode. (rust/lance-encoding/src/decoder.rs:1881-1951)

### Lines 1952-1989

estimate_bytes_per_row uses byte_width_opt first, Boolean1/8, binary/string64, Structsum, list/map five child values, FSL dimension times child, dictionary value only, fallback64. It is a heuristic excluding validity and unspecified overhead; it is not allocation validation or a measured size bound. (rust/lance-encoding/src/decoder.rs:1952-1989)

### Lines 1990-2057

StructuralBatchDecodeStream stores row and optional byte targets plus shared AtomicU64 feedback. Schema bytes/row is estimated and clamped to1 only when a byte target exists; otherwise0. Feedback starts0. Constructors do not reject zero row caps or byte targets. (rust/lance-encoding/src/decoder.rs:1990-2057)

### Lines 2058-2086

Structural scheduling wait updates cumulative rows before sequentially awaiting each unloaded page and accepting it. EOF marks exhaustion and permits fewer actual rows. Error propagates; wrong message variant panics. (rust/lance-encoding/src/decoder.rs:2058-2086)

### Lines 2087-2138

Structural next task uses min(remaining,rowcap), then byte_target / actual_feedback_or_schema_estimate floored and clamped to at leastone when target exists. This can exceed target for a large row. It decrements, waits, shrinks on EOF, drains and advances. No i32-offset budget query occurs in this structural stream. (rust/lance-encoding/src/decoder.rs:2087-2138)

### Lines 2139-2199

Structural planning error emits one zero-row error task and fuses. CPU decode is spawned or inline according to policy. Successful decode updates shared relaxed atomic bytes/row using integer division: increases adopted immediately, decreases averaged with previous, minimum1; no CAS, so concurrent completions can lose/interleave updates. Feedback updates even with no byte target. Task metadata rows are not checked against produced batch length here. (rust/lance-encoding/src/decoder.rs:2139-2199)

### Lines 2200-2237

RequestedRows is Debug Ranges or Indices. num_rows sums unchecked end-start or index count. trim_empty_ranges drops empty/reversed ranges, but public wrappers call num_rows first, so reversed ranges can already underflow. into_ranges preserves ranges without sorting/overlap/bounds validation. (rust/lance-encoding/src/decoder.rs:2200-2237)

### Lines 2238-2262

indices_to_ranges requires strictly increasing indices, with position/value context for duplicates or descent. checked_add rejects u64::MAX. Contiguous indices merge; gaps produce separate half-open ranges; empty input produces empty output. No file row bounds check. (rust/lance-encoding/src/decoder.rs:2238-2262)

### Lines 2263-2304

DecoderConfig Clone+Debug defaults cache_rep from once-cached env(defaulttrue), validatefalse, inline_schedulingNone. None selects row threshold automatically, true schedules inline, false spawns scheduler. Initial asynchronous I/O remains awaited before this choice. (rust/lance-encoding/src/decoder.rs:2263-2304)

### Lines 2305-2353

SchedulerDecoderConfig holds plugins, row batch size, I/O/cache/config and optional byte target documented ignored for v2.0. check_scheduler_on_drop chains a final stream item that awaits scheduler JoinHandle and unwraps panic; on_drop aborts handle. Synchronous scheduler bodies without await cannot be assumed promptly preempted. Initialization has already finished in current caller before scheduler spawning. (rust/lance-encoding/src/decoder.rs:2305-2353)

### Lines 2354-2425

Public create_decode_stream enables i32 limiter and delegates. Structural builds StructuralStructDecoder and structural stream; limitflag has no effect there. Array warns if byte target supplied and constructs SimpleStructDecoder plus array stream with limitflag. should_validate reaches structural root; array root constructor has no corresponding flag. (rust/lance-encoding/src/decoder.rs:2354-2425)

### Lines 2426-2464

create_decode_iterator constructs structural or array blocking adapter with Arrow schema. It has no byte target option. Root variant must match supplied message grammar; mismatches hit unreachable adapter branches. (rust/lance-encoding/src/decoder.rs:2426-2464)

### Lines 2465-2507

create_scheduler_decoder computes requested count and first-column grammar with column_infos[0] (nonempty assumption). Structural CPU spawn env is read each call: exact always/never override, otherwise ranges spawn and indices inline. It creates an unbounded channel and decode stream before converting/validating indices. (rust/lance-encoding/src/decoder.rs:2465-2507)

### Lines 2508-2542

Scheduler creation supplies empty file buffers, requested row count, and Some requested ranges, then awaits initialization. Inline scheduling uses explicit bool or count<=once-cached threshold. Inline schedules before return; spawned Tokio body has no await while scheduling and gets drop/EOF wrapper. Plugins remain unused by constructor. (rust/lance-encoding/src/decoder.rs:2508-2542)

### Lines 2543-2589

Public schedule_and_decode returns an empty stream immediately for zero requested rows, bypassing metadata/config checks. Otherwise trims ranges, clones I/O to retain it through a FinallyStream closure, and calls scheduler helper. EOF or dropping the closure releases this keepalive. This wrapper itself does not decode all tasks or impose batch readahead. (rust/lance-encoding/src/decoder.rs:2543-2589)

### Lines 2590-2635

WAITER_RT is a public LazyLock current-thread runtime with unwrap. Blocking schedule_and_decode zero fast path returns empty RecordBatchIterator with schema; otherwise trims, indexes first column and block_on initializes with empty file buffers and requested ranges. No separate row-bound validation. (rust/lance-encoding/src/decoder.rs:2590-2635)

### Lines 2636-2671

Blocking path schedules synchronously, drains all unbounded channel messages via recv_many.now_or_never.unwrap into a Vec, then builds iterator. It ignores inline_scheduling, byte target and structural CPU spawn mode, without async path byte-target warning. No outer FinallyStream I/O keepalive is installed. (rust/lance-encoding/src/decoder.rs:2636-2671)

### Lines 2672-2727

PrimitivePageDecoder Send+Sync decodes a slice into DataBlock. variable_width_bytes defaultNone means unknown; implementers may provide an upper bound for nested i32-limit planning. Surrounding docs mention historical arguments/helpers absent from the actual signature. Zero-copy is a possibility, not a guarantee. (rust/lance-encoding/src/decoder.rs:2672-2727)

### Lines 2728-2791

PageScheduler Debug+Send+Sync accepts sorted nonoverlapping per-page ranges, I/O and top-row priority, returning a static future of primitive decoder. PriorityRange requires Debug+Send+Sync, advance,current_priority,box_clone. SimplePriorityRange stores u64 and unchecked adds; clone retains current priority. (rust/lance-encoding/src/decoder.rs:2728-2791)

### Lines 2792-2862

ListPriorityRange shares item offsets and clones base priority state; starts item position0. advance increases item position and advances base once per crossed/equal next offset, including empty lists. Offsets are assumed normalized/monotonic; no validation/overflow check. Debug prints offset length, not contents. (rust/lance-encoding/src/decoder.rs:2792-2862)

### Lines 2863-2905

IO_REQUEST_BATCH_BYTES is8MiB aggregation target, not a hard maximum request size. SharedRead is a shared future Result<Arc<Vec<Bytes>>,CloneableError>. SubmittedRead distinguishes direct future from shared future plus restoration indices; PendingRead stores ranges, priority and oneshot sender. Documentation motivates aggregating across columns. (rust/lance-encoding/src/decoder.rs:2863-2905)

### Lines 2906-2946

RequestBatch wraps inner I/O and Arc<Mutex<Vec<PendingRead>>>. pending_bytes rescans ranges under unwrap lock; length sums unchecked. flush takes pending vector then releases lock before submitting. Empty flush is harmless. (rust/lance-encoding/src/decoder.rs:2906-2946)

### Lines 2947-2998

submit_batch directly forwards a single read preserving order/priority. Multiple reads flatten and stable-sort by(start,end), without merging/deduplication; use minimum priority and mapping indices to restore each caller order. Delegate submit occurs before sending oneshot replies; closed receivers are ignored, so dropped requests can still be submitted. Shared errors are cloneable wrappers. (rust/lance-encoding/src/decoder.rs:2947-2998)

### Lines 2999-3053

submit_request flushes existing nonempty queue only when existing+new bytes exceed8MiB, while still holding the mutex; current request is queued even if individually oversized. Exact equality does not flush. First future poll checks reply, otherwise yields once then flushes all pending and awaits receiver; closed channel becomes Internal. Shared outputs index by mapping and can panic for too-few returned buffers; extra buffers ignored. Alone returns inner result unchanged. (rust/lance-encoding/src/decoder.rs:2999-3053)

### Lines 3054-3082

RequestBatch bypass and I/O stats delegate directly to inner hooks, not a new batched wrapper. SchedulerContext owns optional receiver/name, batched I/O/cache and parallel path/path-name stacks. Locally new starts receiverNone/nameempty. (rust/lance-encoding/src/decoder.rs:3054-3082)

### Lines 3083-3151

ScopedSchedulerContext requires explicit consuming pop; it has no Drop auto-pop. SchedulerContext::new wraps I/O in shared RequestBatch; getters borrow Arcs, flush_io delegates, push/pop maintain both stacks (empty pop no-op). path_name formats ROOT or TEMP based on recv; current_path clones indices. Deprecated locate_decoder attaches current path without changing state. (rust/lance-encoding/src/decoder.rs:3083-3151)

### Lines 3152-3218

UnloadedPageShard is a future tuple with placeholder Debug. ScheduledScanLine owns row count/messages. StructuralSchedulingJob Debug emits vectors, empty meansend. FilterExpression wraps opaque Bytes; empty is no-op and no parser here. StructuralFieldScheduler is Send+Debug, notSync, initializes through &mut self with optional ranges/filter/context, then schedules via borrowed job. (rust/lance-encoding/src/decoder.rs:3152-3218)

### Lines 3219-3262

DecodeArrayTask Send consumes itself into(array,data_size). Its structural-task adapter checks repdef.ensure_exhausted before returning. NextDecodeTask exposes task/row metadata; into_batch requires returned array.as_struct (wrong type panic), forms RecordBatch without verifying metadata count, and emits one debug diagnostic for reported data_size strictly above10MiB. It is debug, notwarn. (rust/lance-encoding/src/decoder.rs:3219-3262)

### Lines 3263-3307

MessageType tags DecoderReady array or UnloadedPage structural; wrong into accessor panics. DecoderMessage exposes cumulative scheduled_so_far and decoder vector. DecoderContext wraps an unbounded receiver. No message monotonicity/type validation at these containers. (rust/lance-encoding/src/decoder.rs:3263-3307)

### Lines 3308-3361

DecoderContext::new stores receiver. DecodedPage pairs DataBlock/RepDefUnraveler; DecodePageTask Send+Debug consumes into Result. StructuralPageDecoder Send+Debug drains tasks and reports rows; default exact decoded_bytes returns NotSupported. LoadedPageShard carries decoder/path; comments saying only structs have children/lists indirect reflect historical architecture, not full structural implementations. (rust/lance-encoding/src/decoder.rs:3308-3361)

### Lines 3362-3400

DecodedArray exposes array/composite repdef/data_size excluding Arrow overhead. StructuralDecodeArrayTask consumes into it. StructuralFieldDecoder requires accept_page (despite comment claiming a default), drain and data_type; plan_decoded_bytes returns eight candidate estimates clamped by contract and defaults NotSupported. Comments allow worst-case estimates despite saying exact. DecoderPlugins is empty Default+Debug placeholder. (rust/lance-encoding/src/decoder.rs:3362-3400)

### Lines 3401-3443

EncodedBatchLayout explicitly selects Array or Structural root grammar for memory decoding, independently of page-tag auto-selection in scheduler. decode_batch uses BufferScheduler, caller cache or new128MiB cache, DecoderConfig default and empty file buffers; schedules full range before constructing stream. should_validate only goes to stream, not default scheduler config. (rust/lance-encoding/src/decoder.rs:3401-3443)

### Lines 3444-3464

decode_batch reads spawn env: only exact never disables structural CPU spawn; all other values enable. It casts u64 batch rows to u32 unchecked and disables array i32 split to preserve one-input-batch contract, then unwraps first stream item and awaits only its task. Zero rows panic earlier positive-row assert; inconsistent public EncodedBatch/layout or too-large count can violate assumptions. (rust/lance-encoding/src/decoder.rs:3444-3464)

### Lines 3465-3598

Test fixtures StaticArrayDecodeTask and StaticArrayPageDecoder return slices and optionally fake bytes/row for budget tests without huge allocations. Counters/row bytes and max_rows_to_drain implement a simple prefix budget. array_stream_batch_sizes constructs one-column root, sends all page messages and sequentially awaits each task. These helpers are cfg(test), not production validation. (rust/lance-encoding/src/decoder.rs:3465-3598)

### Lines 3599-3664

Three async array tests require small pages to span one batch[4], fake800MiB rows to split[2,1], and estimated3GiB rows to emit[1,1]. Requested indices test covers coalescing, duplicate rejection and u64::MAX rejection, with InvalidInput and message checks. No tests were executed. (rust/lance-encoding/src/decoder.rs:3599-3664)

### Lines 3665-3735

FailingPageDecoder fixture reports no loaded rows and returns simulated I/O error from wait, with drain forbidden. InvalidInputDecodeTask emits malformed sparse page error; next_decode_task_preserves_invalid_input_errors checks variant survives into_batch. (rust/lance-encoding/src/decoder.rs:3665-3735)

### Lines 3736-3826

Zero-dimension FSL test requires both structural/array factory guards to return descriptive error before using empty column iterator. Non-list legacy offsets fixture uses Flat encoding and requires InvalidInput with field/column/page context. These cover intended read-side validation, not all unsupported/malformed branches. (rust/lance-encoding/src/decoder.rs:3736-3826)

### Lines 3827-3923

Array and structural load-error stream tests use one scheduled row out of two, buffered readahead2, require first error message and then end. They test planning/load failure fusion, not CPU task error fusion, dropped I/O cancellation or scheduler panic propagation. (rust/lance-encoding/src/decoder.rs:3827-3923)

### Lines 3924-3962

Three index coalescing tests cover singleton, contiguous and gaps. Byte estimate test checks Int32,Int64,Float32,Boolean,Utf8,Binary and four-field Int32 struct. Other types and invalid parameter combinations are untested locally. (rust/lance-encoding/src/decoder.rs:3924-3962)

### Lines 3963-4031

Byte-target test helper encodes StructuralU16, initializes scheduler with default config, schedules all rows, creates validating structural stream with spawned CPU tasks, and sequentially awaits/collects batches. This sequence gives feedback time to update before requesting next task; it does not test concurrent feedback races. (rust/lance-encoding/src/decoder.rs:3963-4031)

### Lines 4032-4116

Fixed-width byte-target test expects1000 rows of four Int32 columns at1600-byte target to yield ten100-row batches and exact concatenated columns. No-byte-target test expects four250-row batches for1000 two-column rows. These are source assertions, not executed results. (rust/lance-encoding/src/decoder.rs:4032-4116)

### Lines 4117-4139

Row-cap test expects ten100-row batches despite byte target capable of all1000 Int32 rows. It verifies row cap precedence for this positive configuration. (rust/lance-encoding/src/decoder.rs:4117-4139)

### Lines 4140-4203

String-feedback test uses500 equal100-byte values with5000-byte target. It checks exact concatenated roundtrip and at leasttwo batches; only if at leastthree exist does it require second/third sizes40..60. It does not assert exact first78 rows or every later target, and conditional checks can be skipped for two batches. No local tests exercise zero caps, reversed/overlapping ranges, request batching, cancellation, env modes or root dummy overflow. (rust/lance-encoding/src/decoder.rs:4140-4203)

## Interaction and interpretation limits

All4203 lines read through ten bounded untruncated outputs. Source-only analysis; no Rust build/test/runtime. Concrete logical codecs remain pending. Deductions about panic/overflow and concurrency are not reproduced failures.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Utilities and traits for scheduling & decoding data
    5 | //!
    6 | //! Reading data involves two steps: scheduling and decoding.  The
    7 | //! scheduling step is responsible for figuring out what data is needed
    8 | //! and issuing the appropriate I/O requests.  The decoding step is
    9 | //! responsible for taking the loaded data and turning it into Arrow
   10 | //! arrays.
   11 | //!
   12 | //! # Scheduling
   13 | //!
   14 | //! Scheduling is split into `FieldScheduler` and `PageScheduler`.
   15 | //! There is one field scheduler for each output field, which may map to many
   16 | //! columns of actual data.  A field scheduler is responsible for figuring out
   17 | //! the order in which pages should be scheduled.  Field schedulers then delegate
   18 | //! to page schedulers to figure out the I/O requests that need to be made for
   19 | //! the page.
   20 | //!
   21 | //! Page schedulers also create the decoders that will be used to decode the
   22 | //! scheduled data.
   23 | //!
   24 | //! # Decoding
   25 | //!
   26 | //! Decoders are split into `PhysicalPageDecoder` and
   27 | //! [`LogicalPageDecoder`].  Note that both physical and logical decoding
   28 | //! happens on a per-page basis.  There is no concept of a "field decoder" or
   29 | //! "column decoder".
   30 | //!
   31 | //! The physical decoders handle lower level encodings.  They have a few advantages:
   32 | //!
   33 | //!  * They do not need to decode into an Arrow array and so they don't need
   34 | //!    to be enveloped into the Arrow filesystem (e.g. Arrow doesn't have a
   35 | //!    bit-packed type.  We can use variable-length binary but that is kind
   36 | //!    of awkward)
   37 | //!  * They can decode into an existing allocation.  This can allow for "page
   38 | //!    bridging".  If we are trying to decode into a batch of 1024 rows and
   39 | //!    the rows 0..1024 are spread across two pages then we can avoid a memory
   40 | //!    copy by allocating once and decoding each page into the outer allocation.
   41 | //!    (note: page bridging is not actually implemented yet)
   42 | //!
   43 | //! However, there are some limitations for physical decoders:
   44 | //!
   45 | //!  * They are constrained to a single column
   46 | //!  * The API is more complex
   47 | //!
   48 | //! The logical decoders are designed to map one or more columns of Lance
   49 | //! data into an Arrow array.
   50 | //!
   51 | //! Typically, a "logical encoding" will have both a logical decoder and a field scheduler.
   52 | //! Meanwhile, a "physical encoding" will have a physical decoder but no corresponding field
   53 | //! scheduler.
   54 | //!
   55 | //!
   56 | //! # General notes
   57 | //!
   58 | //! Encodings are typically nested into each other to form a tree.  The top of the tree is
   59 | //! the user requested schema.  Each field in that schema is assigned to one top-level logical
   60 | //! encoding.  That encoding can then contain other logical encodings or physical encodings.
   61 | //! Physical encodings can also contain other physical encodings.
   62 | //!
   63 | //! So, for example, a single field in the Arrow schema might have the type `List<UInt32>`
   64 | //!
   65 | //! The encoding tree could then be:
   66 | //!
   67 | //! root: List (logical encoding)
   68 | //!  - indices: Primitive (logical encoding)
   69 | //!    - column: Basic (physical encoding)
   70 | //!      - validity: Bitmap (physical encoding)
   71 | //!      - values: RLE (physical encoding)
   72 | //!        - runs: Value (physical encoding)
   73 | //!        - values: Value (physical encoding)
   74 | //!  - items: Primitive (logical encoding)
   75 | //!    - column: Basic (physical encoding)
   76 | //!      - values: Value (physical encoding)
   77 | //!
   78 | //! Note that, in this example, root.items.column does not have a validity because there were
   79 | //! no nulls in the page.
   80 | //!
   81 | //! ## Multiple buffers or multiple columns?
   82 | //!
   83 | //! Note that there are many different ways we can write encodings.  For example, we might
   84 | //! store primitive fields in a single column with two buffers (one for validity and one for
   85 | //! values)
   86 | //!
   87 | //! On the other hand, we could also store a primitive field as two different columns.  One
   88 | //! that yields a non-nullable boolean array and one that yields a non-nullable array of items.
   89 | //! Then we could combine these two arrays into a single array where the boolean array is the
   90 | //! bitmap.  There are a few subtle differences between the approaches:
   91 | //!
   92 | //! * Storing things as multiple buffers within the same column is generally more efficient and
   93 | //!   easier to schedule.  For example, in-batch coalescing is very easy but can only be done
   94 | //!   on data that is in the same page.
   95 | //! * When things are stored in multiple columns you have to worry about their pages not being
   96 | //!   in sync.  In our previous validity / values example this means we might have to do some
   97 | //!   memory copies to get the validity array and values arrays to be the same length as
   98 | //!   decode.
   99 | //! * When things are stored in a single column, projection is impossible.  For example, if we
  100 | //!   tried to store all the struct fields in a single column with lots of buffers then we wouldn't
  101 | //!   be able to read back individual fields of the struct.
  102 | //!
  103 | //! The fixed size list decoding is an interesting example because it is actually both a physical
  104 | //! encoding and a logical encoding.  A fixed size list of a physical encoding is, itself, a physical
  105 | //! encoding (e.g. a fixed size list of doubles).  However, a fixed size list of a logical encoding
  106 | //! is a logical encoding (e.g. a fixed size list of structs).
  107 | //!
  108 | //! # The scheduling loop
  109 | //!
  110 | //! Reading a Lance file involves both scheduling and decoding.  Its generally expected that these
  111 | //! will run as two separate threads.
  112 | //!
  113 | //! ```text
  114 | //!
  115 | //!                                    I/O PARALLELISM
  116 | //!                       Issues
  117 | //!                       Requests   ┌─────────────────┐
  118 | //!                                  │                 │        Wait for
  119 | //!                       ┌──────────►   I/O Service   ├─────►  Enough I/O ◄─┐
  120 | //!                       │          │                 │        For batch    │
  121 | //!                       │          └─────────────────┘             │3      │
  122 | //!                       │                                          │       │
  123 | //!                       │                                          │       │2
  124 | //! ┌─────────────────────┴─┐                              ┌─────────▼───────┴┐
  125 | //! │                       │                              │                  │Poll
  126 | //! │       Batch Decode    │ Decode tasks sent via channel│   Batch Decode   │1
  127 | //! │       Scheduler       ├─────────────────────────────►│   Stream         ◄─────
  128 | //! │                       │                              │                  │
  129 | //! └─────▲─────────────┬───┘                              └─────────┬────────┘
  130 | //!       │             │                                            │4
  131 | //!       │             │                                            │
  132 | //!       └─────────────┘                                   ┌────────┴────────┐
  133 | //!  Caller of schedule_range                Buffer polling │                 │
  134 | //!  will be scheduler thread                to achieve CPU │ Decode Batch    ├────►
  135 | //!  and schedule one decode                 parallelism    │ Task            │
  136 | //!  task (and all needed I/O)               (thread per    │                 │
  137 | //!  per logical page                         batch)        └─────────────────┘
  138 | //! ```
  139 | //!
  140 | //! The scheduling thread will work through the file from the
  141 | //! start to the end as quickly as possible.  Data is scheduled one page at a time in a row-major
  142 | //! fashion.  For example, imagine we have a file with the following page structure:
  143 | //!
  144 | //! ```text
  145 | //! Score (Float32)     | C0P0 |
  146 | //! Id (16-byte UUID)   | C1P0 | C1P1 | C1P2 | C1P3 |
  147 | //! Vector (4096 bytes) | C2P0 | C2P1 | C2P2 | C2P3 | .. | C2P1024 |
  148 | //! ```
  149 | //!
  150 | //! This would be quite common as each of these pages has the same number of bytes.  Let's pretend
  151 | //! each page is 1MiB and so there are 256Ki rows of data.  Each page of `Score` has 256Ki rows.
  152 | //! Each page of `Id` has 64Ki rows.  Each page of `Vector` has 256 rows.  The scheduler would then
  153 | //! schedule in the following order:
  154 | //!
  155 | //! C0 P0
  156 | //! C1 P0
  157 | //! C2 P0
  158 | //! C2 P1
  159 | //! ... (254 pages omitted)
  160 | //! C2 P255
  161 | //! C1 P1
  162 | //! C2 P256
  163 | //! ... (254 pages omitted)
  164 | //! C2 P511
  165 | //! C1 P2
  166 | //! C2 P512
  167 | //! ... (254 pages omitted)
  168 | //! C2 P767
  169 | //! C1 P3
  170 | //! C2 P768
  171 | //! ... (254 pages omitted)
  172 | //! C2 P1024
  173 | //!
  174 | //! This is the ideal scheduling order because it means we can decode complete rows as quickly as possible.
  175 | //! Note that the scheduler thread does not need to wait for I/O to happen at any point.  As soon as it starts
  176 | //! it will start scheduling one page of I/O after another until it has scheduled the entire file's worth of
  177 | //! I/O.  This is slightly different than other file readers which have "row group parallelism" and will
  178 | //! typically only schedule X row groups worth of reads at a time.
  179 | //!
  180 | //! In the near future there will be a backpressure mechanism and so it may need to stop/pause if the compute
  181 | //! falls behind.
  182 | //!
  183 | //! ## Indirect I/O
  184 | //!
  185 | //! Regrettably, there are times where we cannot know exactly what data we need until we have partially decoded
  186 | //! the file.  This happens when we have variable sized list data.  In that case the scheduling task for that
  187 | //! page will only schedule the first part of the read (loading the list offsets).  It will then immediately
  188 | //! spawn a new tokio task to wait for that I/O and decode the list offsets.  That follow-up task is not part
  189 | //! of the scheduling loop or the decode loop.  It is a free task.  Once the list offsets are decoded we submit
  190 | //! a follow-up I/O task.  This task is scheduled at a high priority because the decoder is going to need it soon.
  191 | //!
  192 | //! # The decode loop
  193 | //!
  194 | //! As soon as the scheduler starts we can start decoding.  Each time we schedule a page we
  195 | //! push a decoder for that page's data into a channel.  The decode loop
  196 | //! ([`BatchDecodeStream`]) reads from that channel.  Each time it receives a decoder it
  197 | //! waits until the decoder has all of its data.  Then it grabs the next decoder.  Once it has
  198 | //! enough loaded decoders to complete a batch worth of rows it will spawn a "decode batch task".
  199 | //!
  200 | //! These batch decode tasks perform the actual CPU work of decoding the loaded data into Arrow
  201 | //! arrays.  This may involve signifciant CPU processing like decompression or arithmetic in order
  202 | //! to restore the data to its correct in-memory representation.
  203 | //!
  204 | //! ## Batch size
  205 | //!
  206 | //! The `BatchDecodeStream` is configured with a batch size.  This does not need to have any
  207 | //! relation to the page size(s) used to write the data.  This keeps our compute work completely
  208 | //! independent of our I/O work.  We suggest using small batch sizes:
  209 | //!
  210 | //!  * Batches should fit in CPU cache (at least L3)
  211 | //!  * More batches means more opportunity for parallelism
  212 | //!  * The "batch overhead" is very small in Lance compared to other formats because it has no
  213 | //!    relation to the way the data is stored.
  214 | 
  215 | use std::collections::VecDeque;
  216 | use std::sync::atomic::{AtomicU64, Ordering};
  217 | use std::sync::{LazyLock, Mutex, Once, OnceLock};
  218 | use std::{ops::Range, sync::Arc};
  219 | 
  220 | use arrow_array::cast::AsArray;
  221 | use arrow_array::{ArrayRef, RecordBatch, RecordBatchIterator, RecordBatchReader};
  222 | use arrow_schema::{ArrowError, DataType, Field as ArrowField, Fields, Schema as ArrowSchema};
  223 | use bytes::Bytes;
  224 | use futures::channel::oneshot;
  225 | use futures::future::{BoxFuture, MaybeDone, Shared, maybe_done};
  226 | use futures::stream::{self, BoxStream};
  227 | use futures::{FutureExt, StreamExt};
  228 | use lance_arrow::DataTypeExt;
  229 | use lance_core::cache::{Context, DeepSizeOf, LanceCache};
  230 | use lance_core::datatypes::{
  231 |     BLOB_DESC_LANCE_FIELD, Field, Schema, validate_fixed_size_list_dimensions,
  232 | };
  233 | use lance_core::utils::futures::{FinallyStreamExt, StreamOnDropExt};
  234 | use lance_core::utils::parse::parse_env_as_bool;
  235 | use log::{debug, trace, warn};
  236 | use prost::Message;
  237 | use tokio::sync::mpsc::error::SendError;
  238 | use tokio::sync::mpsc::{self, unbounded_channel};
  239 | 
  240 | use lance_core::error::{CloneableError, LanceOptionExt};
  241 | use lance_core::{ArrowResult, Error, Result};
  242 | use tracing::instrument;
  243 | 
  244 | use crate::array_encoding::logical::list::OffsetPageInfo;
  245 | use crate::array_encoding::logical::r#struct::{SimpleStructDecoder, SimpleStructScheduler};
  246 | use crate::array_encoding::logical::{
  247 |     binary::BinaryFieldScheduler, blob::BlobFieldScheduler, list::ListFieldScheduler,
  248 |     primitive::PrimitiveFieldScheduler,
  249 | };
  250 | use crate::compression::{DecompressionStrategy, DefaultDecompressionStrategy};
  251 | use crate::data::DataBlock;
  252 | use crate::encoder::EncodedBatch;
  253 | use crate::encodings::logical::fixed_size_list::StructuralFixedSizeListScheduler;
  254 | use crate::encodings::logical::list::StructuralListScheduler;
  255 | use crate::encodings::logical::map::StructuralMapScheduler;
  256 | use crate::encodings::logical::primitive::StructuralPrimitiveFieldScheduler;
  257 | use crate::encodings::logical::r#struct::{StructuralStructDecoder, StructuralStructScheduler};
  258 | use crate::format::pb::{self, column_encoding};
  259 | use crate::format::pb21;
  260 | use crate::repdef::{CompositeRepDefUnraveler, RepDefUnraveler};
  261 | use crate::{BufferScheduler, EncodingsIo};
  262 | 
  263 | /// Candidate batch sizes evaluated during byte-budget planning.
  264 | /// Powers of 4, covering 1–16Ki rows in 8 probes.
  265 | pub const CANDIDATE_BATCH_SIZES: [u32; 8] = [1, 4, 16, 64, 256, 1024, 4096, 16384];
  266 | 
  267 | pub trait SchedulingJob: std::fmt::Debug {
  268 |     fn schedule_next(
  269 |         &mut self,
  270 |         context: &mut SchedulerContext,
  271 |         priority: &dyn PriorityRange,
  272 |     ) -> Result<ScheduledScanLine>;
  273 | 
  274 |     fn num_rows(&self) -> u64;
  275 | }
  276 | 
  277 | /// Schedules the I/O needed to decode one field.
  278 | pub trait FieldScheduler: Send + Sync + std::fmt::Debug {
  279 |     fn initialize<'a>(
  280 |         &'a self,
  281 |         filter: &'a FilterExpression,
  282 |         context: &'a SchedulerContext,
  283 |     ) -> BoxFuture<'a, Result<()>>;
  284 | 
  285 |     fn schedule_ranges<'a>(
  286 |         &'a self,
  287 |         ranges: &[Range<u64>],
  288 |         filter: &FilterExpression,
  289 |     ) -> Result<Box<dyn SchedulingJob + 'a>>;
  290 | 
  291 |     fn num_rows(&self) -> u64;
  292 | }
  293 | 
  294 | #[derive(Debug)]
  295 | pub struct DecoderReady {
  296 |     pub decoder: Box<dyn LogicalPageDecoder>,
  297 |     pub path: VecDeque<u32>,
  298 | }
  299 | 
  300 | /// Stateful decoder for one logical page.
  301 | pub trait LogicalPageDecoder: std::fmt::Debug + Send {
  302 |     fn accept_child(&mut self, _child: DecoderReady) -> Result<()> {
  303 |         Err(Error::internal(format!(
  304 |             "The decoder {:?} does not expect children but received a child",
  305 |             self
  306 |         )))
  307 |     }
  308 | 
  309 |     fn wait_for_loaded(&'_ mut self, loaded_need: u64) -> BoxFuture<'_, Result<()>>;
  310 | 
  311 |     fn rows_loaded(&self) -> u64;
  312 | 
  313 |     fn rows_unloaded(&self) -> u64 {
  314 |         self.num_rows() - self.rows_loaded()
  315 |     }
  316 | 
  317 |     fn num_rows(&self) -> u64;
  318 | 
  319 |     fn rows_drained(&self) -> u64;
  320 | 
  321 |     fn rows_left(&self) -> u64 {
  322 |         self.num_rows() - self.rows_drained()
  323 |     }
  324 | 
  325 |     fn drain(&mut self, num_rows: u64) -> Result<NextDecodeTask>;
  326 | 
  327 |     /// Returns how many of the requested rows can be decoded into one Arrow array
  328 |     /// while keeping every i32 offset buffer within `byte_budget` bytes.
  329 |     ///
  330 |     /// Most page decoders can always drain the full request and consume no budget.
  331 |     /// Decoders that build arrays with i32 offsets (Utf8 / Binary / List) may return
  332 |     /// fewer rows so that the concatenated array's offsets stay representable, and
  333 |     /// report the budget those rows consume so callers can accumulate across pages.
  334 |     fn max_rows_to_drain(&self, num_rows: u64, _byte_budget: u64) -> Result<DrainLimit> {
  335 |         Ok(DrainLimit {
  336 |             rows: num_rows,
  337 |             bytes: 0,
  338 |         })
  339 |     }
  340 | 
  341 |     fn data_type(&self) -> &DataType;
  342 | }
  343 | 
  344 | /// Result of limiting a drain request to a variable-width byte budget.
  345 | #[derive(Debug, Clone, Copy, PartialEq, Eq)]
  346 | pub struct DrainLimit {
  347 |     /// How many of the requested rows can be decoded into one Arrow array
  348 |     pub rows: u64,
  349 |     /// The variable-width bytes (at the most constrained i32-offset nesting level)
  350 |     /// those rows consume from the caller's budget
  351 |     pub bytes: u64,
  352 | }
  353 | 
  354 | /// The byte budget applied to each output batch of an i32-offset column.
  355 | ///
  356 | /// Concatenating decoded pages into one Arrow array fails when a variable-width
  357 | /// buffer's offsets exceed `i32::MAX`, so batches are split before that point.
  358 | pub(crate) const I32_OFFSET_BYTE_BUDGET: u64 = i32::MAX as u64;
  359 | 
  360 | /// Clamp a batch's row count to the byte-budgeted limit.
  361 | ///
  362 | /// A batch always advances by at least one row: a first row whose (possibly
  363 | /// over-estimated) size exceeds the whole budget is emitted alone.  A genuinely
  364 | /// oversized row then surfaces the same arrow-level offset error it always did,
  365 | /// while an over-estimated one decodes fine.
  366 | fn clamp_rows_to_i32_budget(limit: DrainLimit, to_take: u64) -> u64 {
  367 |     if to_take == 0 {
  368 |         return 0;
  369 |     }
  370 |     limit.rows.clamp(1, to_take)
  371 | }
  372 | 
  373 | /// Returns whether concatenating arrays of this type can overflow an i32 offset buffer.
  374 | pub(crate) fn has_i32_offsets(data_type: &DataType) -> bool {
  375 |     match data_type {
  376 |         DataType::Binary | DataType::Utf8 | DataType::List(_) | DataType::ListView(_) => true,
  377 |         DataType::Map(_, _) => true,
  378 |         DataType::LargeList(field)
  379 |         | DataType::LargeListView(field)
  380 |         | DataType::FixedSizeList(field, _) => has_i32_offsets(field.data_type()),
  381 |         DataType::Struct(fields) => fields
  382 |             .iter()
  383 |             .any(|field| has_i32_offsets(field.data_type())),
  384 |         DataType::Dictionary(_, values) => has_i32_offsets(values),
  385 |         DataType::RunEndEncoded(_, values) => has_i32_offsets(values.data_type()),
  386 |         _ => false,
  387 |     }
  388 | }
  389 | 
  390 | // If users are getting batches over 10MiB large then it's time to reduce the batch size
  391 | const BATCH_SIZE_BYTES_WARNING: u64 = 10 * 1024 * 1024;
  392 | const ENV_LANCE_STRUCTURAL_BATCH_DECODE_SPAWN_MODE: &str =
  393 |     "LANCE_STRUCTURAL_BATCH_DECODE_SPAWN_MODE";
  394 | const ENV_LANCE_READ_CACHE_REPETITION_INDEX: &str = "LANCE_READ_CACHE_REPETITION_INDEX";
  395 | const ENV_LANCE_INLINE_SCHEDULING_THRESHOLD: &str = "LANCE_INLINE_SCHEDULING_THRESHOLD";
  396 | 
  397 | // If a request is for at most this many rows we skip the scheduler-task spawn
  398 | // and run scheduling inline as part of the `schedule_and_decode` await.
  399 | const DEFAULT_INLINE_SCHEDULING_THRESHOLD: u64 = 16 * 1024;
  400 | 
  401 | fn default_cache_repetition_index() -> bool {
  402 |     static DEFAULT_CACHE_REPETITION_INDEX: OnceLock<bool> = OnceLock::new();
  403 |     *DEFAULT_CACHE_REPETITION_INDEX
  404 |         .get_or_init(|| parse_env_as_bool(ENV_LANCE_READ_CACHE_REPETITION_INDEX, true))
  405 | }
  406 | 
  407 | fn inline_scheduling_threshold() -> u64 {
  408 |     static THRESHOLD: OnceLock<u64> = OnceLock::new();
  409 |     *THRESHOLD.get_or_init(|| {
  410 |         std::env::var(ENV_LANCE_INLINE_SCHEDULING_THRESHOLD)
  411 |             .ok()
  412 |             .and_then(|v| v.trim().parse::<u64>().ok())
  413 |             .unwrap_or(DEFAULT_INLINE_SCHEDULING_THRESHOLD)
  414 |     })
  415 | }
  416 | 
  417 | /// Top-level encoding message for a page. Wraps both the v2.0
  418 | /// [`pb::ArrayEncoding`] grammar and the structural [`pb21::PageLayout`] grammar.
  419 | ///
  420 | /// A file should only use one or the other and never both.
  421 | /// 2.0 decoders can always assume this is pb::ArrayEncoding
  422 | /// and 2.1+ decoders can always assume this is pb::PageLayout
  423 | #[derive(Debug, Clone)]
  424 | pub enum PageEncoding {
  425 |     Legacy(pb::ArrayEncoding),
  426 |     Structural(pb21::PageLayout),
  427 | }
  428 | 
  429 | impl DeepSizeOf for PageEncoding {
  430 |     fn deep_size_of_children(&self, _context: &mut Context) -> usize {
  431 |         match self {
  432 |             Self::Legacy(encoding) => encoding.encoded_len() * 4,
  433 |             Self::Structural(encoding) => encoding.encoded_len() * 4,
  434 |         }
  435 |     }
  436 | }
  437 | 
  438 | impl PageEncoding {
  439 |     pub fn as_legacy(&self) -> &pb::ArrayEncoding {
  440 |         match self {
  441 |             Self::Legacy(enc) => enc,
  442 |             Self::Structural(_) => panic!("Expected a legacy encoding"),
  443 |         }
  444 |     }
  445 | 
  446 |     pub fn as_structural(&self) -> &pb21::PageLayout {
  447 |         match self {
  448 |             Self::Structural(enc) => enc,
  449 |             Self::Legacy(_) => panic!("Expected a structural encoding"),
  450 |         }
  451 |     }
  452 | 
  453 |     pub fn is_structural(&self) -> bool {
  454 |         matches!(self, Self::Structural(_))
  455 |     }
  456 | }
  457 | 
  458 | /// Metadata describing a page in a file
  459 | ///
  460 | /// This is typically created by reading the metadata section of a Lance file
  461 | #[derive(Debug)]
  462 | pub struct PageInfo {
  463 |     /// The number of rows in the page
  464 |     pub num_rows: u64,
  465 |     /// The priority (top level row number) of the page
  466 |     ///
  467 |     /// This is only set in 2.1 files and will be 0 for 2.0 files
  468 |     pub priority: u64,
  469 |     /// The encoding that explains the buffers in the page
  470 |     pub encoding: PageEncoding,
  471 |     /// The offsets and sizes of the buffers in the file
  472 |     pub buffer_offsets_and_sizes: Arc<[(u64, u64)]>,
  473 | }
  474 | 
  475 | impl DeepSizeOf for PageInfo {
  476 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  477 |         self.encoding.deep_size_of_children(context)
  478 |             + self.buffer_offsets_and_sizes.deep_size_of_children(context)
  479 |     }
  480 | }
  481 | 
  482 | /// Metadata describing a column in a file
  483 | ///
  484 | /// This is typically created by reading the metadata section of a Lance file
  485 | #[derive(Debug, Clone)]
  486 | pub struct ColumnInfo {
  487 |     /// The index of the column in the file
  488 |     pub index: u32,
  489 |     /// The metadata for each page in the column
  490 |     pub page_infos: Arc<[PageInfo]>,
  491 |     /// File positions and their sizes of the column-level buffers
  492 |     pub buffer_offsets_and_sizes: Arc<[(u64, u64)]>,
  493 |     pub encoding: pb::ColumnEncoding,
  494 | }
  495 | 
  496 | impl DeepSizeOf for ColumnInfo {
  497 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  498 |         self.page_infos.deep_size_of_children(context)
  499 |             + self.buffer_offsets_and_sizes.deep_size_of_children(context)
  500 |             + self.encoding.encoded_len() * 4
  501 |     }
  502 | }
  503 | 
  504 | impl ColumnInfo {
  505 |     /// Create a new instance
  506 |     pub fn new(
  507 |         index: u32,
  508 |         page_infos: Arc<[PageInfo]>,
  509 |         buffer_offsets_and_sizes: Vec<(u64, u64)>,
  510 |         encoding: pb::ColumnEncoding,
  511 |     ) -> Self {
  512 |         Self {
  513 |             index,
  514 |             page_infos,
  515 |             buffer_offsets_and_sizes: buffer_offsets_and_sizes.into_boxed_slice().into(),
  516 |             encoding,
  517 |         }
  518 |     }
  519 | 
  520 |     pub fn is_structural(&self) -> bool {
  521 |         self.page_infos
  522 |             // Can just look at the first since all should be the same
  523 |             .first()
  524 |             .map(|page| page.encoding.is_structural())
  525 |             .unwrap_or(false)
  526 |     }
  527 | }
  528 | 
  529 | enum RootScheduler {
  530 |     Structural(Box<dyn StructuralFieldScheduler>),
  531 |     Array(Arc<dyn FieldScheduler>),
  532 | }
  533 | 
  534 | impl RootScheduler {
  535 |     fn as_array(&self) -> &Arc<dyn FieldScheduler> {
  536 |         match self {
  537 |             Self::Structural(_) => panic!("Expected an array scheduler"),
  538 |             Self::Array(s) => s,
  539 |         }
  540 |     }
  541 | 
  542 |     fn as_structural(&self) -> &dyn StructuralFieldScheduler {
  543 |         match self {
  544 |             Self::Structural(s) => s.as_ref(),
  545 |             Self::Array(_) => panic!("Expected a structural scheduler"),
  546 |         }
  547 |     }
  548 | }
  549 | 
  550 | /// The scheduler for decoding batches
  551 | ///
  552 | /// Lance decoding is done in two steps, scheduling, and decoding.  The
  553 | /// scheduling tends to be lightweight and should quickly figure what data
  554 | /// is needed from the disk issue the appropriate I/O requests.  A decode task is
  555 | /// created to eventually decode the data (once it is loaded) and scheduling
  556 | /// moves on to scheduling the next page.
  557 | ///
  558 | /// Meanwhile, it's expected that a decode stream will be setup to run at the
  559 | /// same time.  Decode tasks take the data that is loaded and turn it into
  560 | /// Arrow arrays.
  561 | ///
  562 | /// This approach allows us to keep our I/O parallelism and CPU parallelism
  563 | /// completely separate since those are often two very different values.
  564 | ///
  565 | /// Backpressure should be achieved via the I/O service.  Requests that are
  566 | /// issued will pile up if the decode stream is not polling quickly enough.
  567 | /// The [`crate::EncodingsIo::submit_request`] function should return a pending
  568 | /// future once there are too many I/O requests in flight.
  569 | ///
  570 | /// TODO: Implement backpressure
  571 | pub struct DecodeBatchScheduler {
  572 |     root_scheduler: RootScheduler,
  573 |     pub root_fields: Fields,
  574 |     cache: Arc<LanceCache>,
  575 | }
  576 | 
  577 | pub struct ColumnInfoIter<'a> {
  578 |     column_infos: Vec<Arc<ColumnInfo>>,
  579 |     column_indices: &'a [u32],
  580 |     column_info_pos: usize,
  581 |     column_indices_pos: usize,
  582 | }
  583 | 
  584 | impl<'a> ColumnInfoIter<'a> {
  585 |     pub fn new(column_infos: Vec<Arc<ColumnInfo>>, column_indices: &'a [u32]) -> Self {
  586 |         let initial_pos = column_indices.first().copied().unwrap_or(0) as usize;
  587 |         Self {
  588 |             column_infos,
  589 |             column_indices,
  590 |             column_info_pos: initial_pos,
  591 |             column_indices_pos: 0,
  592 |         }
  593 |     }
  594 | 
  595 |     pub fn peek(&self) -> &Arc<ColumnInfo> {
  596 |         &self.column_infos[self.column_info_pos]
  597 |     }
  598 | 
  599 |     pub fn peek_transform(&mut self, transform: impl FnOnce(Arc<ColumnInfo>) -> Arc<ColumnInfo>) {
  600 |         let column_info = self.column_infos[self.column_info_pos].clone();
  601 |         let transformed = transform(column_info);
  602 |         self.column_infos[self.column_info_pos] = transformed;
  603 |     }
  604 | 
  605 |     pub fn expect_next(&mut self) -> Result<&Arc<ColumnInfo>> {
  606 |         self.next().ok_or_else(|| {
  607 |             Error::invalid_input(
  608 |                 "there were more fields in the schema than provided column indices / infos",
  609 |             )
  610 |         })
  611 |     }
  612 | 
  613 |     fn next(&mut self) -> Option<&Arc<ColumnInfo>> {
  614 |         if self.column_info_pos < self.column_infos.len() {
  615 |             let info = &self.column_infos[self.column_info_pos];
  616 |             self.column_info_pos += 1;
  617 |             Some(info)
  618 |         } else {
  619 |             None
  620 |         }
  621 |     }
  622 | 
  623 |     pub(crate) fn next_top_level(&mut self) {
  624 |         self.column_indices_pos += 1;
  625 |         if self.column_indices_pos < self.column_indices.len() {
  626 |             self.column_info_pos = self.column_indices[self.column_indices_pos] as usize;
  627 |         } else {
  628 |             self.column_info_pos = self.column_infos.len();
  629 |         }
  630 |     }
  631 | }
  632 | 
  633 | /// These contain the file buffers shared across the entire file
  634 | #[derive(Clone, Copy, Debug)]
  635 | pub struct FileBuffers<'a> {
  636 |     pub positions_and_sizes: &'a [(u64, u64)],
  637 | }
  638 | 
  639 | /// These contain the file buffers and also buffers specific to a column
  640 | #[derive(Clone, Copy, Debug)]
  641 | pub struct ColumnBuffers<'a, 'b> {
  642 |     pub file_buffers: FileBuffers<'a>,
  643 |     pub positions_and_sizes: &'b [(u64, u64)],
  644 | }
  645 | 
  646 | /// These contain the file & column buffers and also buffers specific to a page
  647 | #[derive(Clone, Copy, Debug)]
  648 | pub struct PageBuffers<'a, 'b, 'c> {
  649 |     pub column_buffers: ColumnBuffers<'a, 'b>,
  650 |     pub positions_and_sizes: &'c [(u64, u64)],
  651 | }
  652 | 
  653 | /// The core decoder strategy handles all the various Arrow types
  654 | #[derive(Debug)]
  655 | pub struct CoreFieldDecoderStrategy {
  656 |     pub validate_data: bool,
  657 |     pub decompressor_strategy: Arc<dyn DecompressionStrategy>,
  658 |     pub cache_repetition_index: bool,
  659 | }
  660 | 
  661 | impl Default for CoreFieldDecoderStrategy {
  662 |     fn default() -> Self {
  663 |         Self {
  664 |             validate_data: false,
  665 |             decompressor_strategy: Arc::new(DefaultDecompressionStrategy {}),
  666 |             cache_repetition_index: false,
  667 |         }
  668 |     }
  669 | }
  670 | 
  671 | impl CoreFieldDecoderStrategy {
  672 |     /// Create a new strategy with cache_repetition_index enabled
  673 |     pub fn with_cache_repetition_index(mut self, cache_repetition_index: bool) -> Self {
  674 |         self.cache_repetition_index = cache_repetition_index;
  675 |         self
  676 |     }
  677 | 
  678 |     /// Create a new strategy from decoder config
  679 |     pub fn from_decoder_config(config: &DecoderConfig) -> Self {
  680 |         Self {
  681 |             validate_data: config.validate_on_decode,
  682 |             decompressor_strategy: Arc::new(DefaultDecompressionStrategy {}),
  683 |             cache_repetition_index: config.cache_repetition_index,
  684 |         }
  685 |     }
  686 | 
  687 |     /// This is just a sanity check to ensure there is no "wrapped encodings"
  688 |     /// that haven't been handled.
  689 |     fn ensure_values_encoded(column_info: &ColumnInfo, field_name: &str) -> Result<()> {
  690 |         let column_encoding = column_info
  691 |             .encoding
  692 |             .column_encoding
  693 |             .as_ref()
  694 |             .ok_or_else(|| {
  695 |                 Error::invalid_input(format!(
  696 |                     "the column at index {} was missing a ColumnEncoding",
  697 |                     column_info.index
  698 |                 ))
  699 |             })?;
  700 |         if matches!(
  701 |             column_encoding,
  702 |             pb::column_encoding::ColumnEncoding::Values(_)
  703 |         ) {
  704 |             Ok(())
  705 |         } else {
  706 |             Err(Error::invalid_input(format!(
  707 |                 "the column at index {} mapping to the input field {} has column encoding {:?} and no decoder is registered to handle it",
  708 |                 column_info.index, field_name, column_encoding
  709 |             )))
  710 |         }
  711 |     }
  712 | 
  713 |     fn is_structural_primitive(data_type: &DataType) -> bool {
  714 |         if data_type.is_primitive() {
  715 |             true
  716 |         } else {
  717 |             match data_type {
  718 |                 // DataType::is_primitive doesn't consider these primitive but we do
  719 |                 DataType::Dictionary(_, value_type) => Self::is_structural_primitive(value_type),
  720 |                 DataType::Boolean
  721 |                 | DataType::Null
  722 |                 | DataType::FixedSizeBinary(_)
  723 |                 | DataType::Binary
  724 |                 | DataType::LargeBinary
  725 |                 | DataType::Utf8
  726 |                 | DataType::LargeUtf8 => true,
  727 |                 DataType::FixedSizeList(inner, _) => {
  728 |                     Self::is_structural_primitive(inner.data_type())
  729 |                 }
  730 |                 _ => false,
  731 |             }
  732 |         }
  733 |     }
  734 | 
  735 |     fn is_array_primitive(data_type: &DataType) -> bool {
  736 |         if data_type.is_primitive() {
  737 |             true
  738 |         } else {
  739 |             match data_type {
  740 |                 // DataType::is_primitive doesn't consider these primitive but we do
  741 |                 DataType::Boolean | DataType::Null | DataType::FixedSizeBinary(_) => true,
  742 |                 DataType::FixedSizeList(inner, _) => Self::is_array_primitive(inner.data_type()),
  743 |                 _ => false,
  744 |             }
  745 |         }
  746 |     }
  747 | 
  748 |     fn create_primitive_scheduler(
  749 |         &self,
  750 |         field: &Field,
  751 |         column: &ColumnInfo,
  752 |         buffers: FileBuffers,
  753 |     ) -> Result<Box<dyn FieldScheduler>> {
  754 |         Self::ensure_values_encoded(column, &field.name)?;
  755 |         // Primitive fields map to a single column
  756 |         let column_buffers = ColumnBuffers {
  757 |             file_buffers: buffers,
  758 |             positions_and_sizes: &column.buffer_offsets_and_sizes,
  759 |         };
  760 |         Ok(Box::new(PrimitiveFieldScheduler::new(
  761 |             column.index,
  762 |             field.data_type(),
  763 |             column.page_infos.clone(),
  764 |             column_buffers,
  765 |             self.validate_data,
  766 |         )))
  767 |     }
  768 | 
  769 |     /// Helper method to verify the page encoding of a struct header column
  770 |     fn check_simple_struct(column_info: &ColumnInfo, field_name: &str) -> Result<()> {
  771 |         Self::ensure_values_encoded(column_info, field_name)?;
  772 |         if column_info.page_infos.len() != 1 {
  773 |             return Err(Error::invalid_input_source(format!("Due to schema we expected a struct column but we received a column with {} pages and right now we only support struct columns with 1 page", column_info.page_infos.len()).into()));
  774 |         }
  775 |         let encoding = &column_info.page_infos[0].encoding;
  776 |         match encoding.as_legacy().array_encoding.as_ref().unwrap() {
  777 |             pb::array_encoding::ArrayEncoding::Struct(_) => Ok(()),
  778 |             _ => Err(Error::invalid_input_source(format!("Expected a struct encoding because we have a struct field in the schema but got the encoding {:?}", encoding).into())),
  779 |         }
  780 |     }
  781 | 
  782 |     fn check_packed_struct(column_info: &ColumnInfo) -> bool {
  783 |         let encoding = &column_info.page_infos[0].encoding;
  784 |         matches!(
  785 |             encoding.as_legacy().array_encoding.as_ref().unwrap(),
  786 |             pb::array_encoding::ArrayEncoding::PackedStruct(_)
  787 |         )
  788 |     }
  789 | 
  790 |     fn create_list_scheduler(
  791 |         &self,
  792 |         list_field: &Field,
  793 |         column_infos: &mut ColumnInfoIter,
  794 |         buffers: FileBuffers,
  795 |         offsets_column: &ColumnInfo,
  796 |     ) -> Result<Box<dyn FieldScheduler>> {
  797 |         Self::ensure_values_encoded(offsets_column, &list_field.name)?;
  798 |         let offsets_column_buffers = ColumnBuffers {
  799 |             file_buffers: buffers,
  800 |             positions_and_sizes: &offsets_column.buffer_offsets_and_sizes,
  801 |         };
  802 |         let items_scheduler =
  803 |             self.create_array_field_scheduler(&list_field.children[0], column_infos, buffers)?;
  804 | 
  805 |         let mut inner_infos = Vec::with_capacity(offsets_column.page_infos.len());
  806 |         let mut null_offset_adjustments = Vec::with_capacity(offsets_column.page_infos.len());
  807 |         for (page_index, offsets_page) in offsets_column
  808 |             .page_infos
  809 |             .iter()
  810 |             .enumerate()
  811 |             .filter(|(_, offsets_page)| offsets_page.num_rows > 0)
  812 |         {
  813 |             let PageEncoding::Legacy(pb::ArrayEncoding {
  814 |                 array_encoding: Some(pb::array_encoding::ArrayEncoding::List(list_encoding)),
  815 |             }) = &offsets_page.encoding
  816 |             else {
  817 |                 return Err(Error::invalid_input(format!(
  818 |                     "expected list encoding for field '{}' in column {}, page {} but got {:?}",
  819 |                     list_field.name, offsets_column.index, page_index, offsets_page.encoding
  820 |                 )));
  821 |             };
  822 |             let offsets_encoding = list_encoding.offsets.as_ref().ok_or_else(|| {
  823 |                 Error::invalid_input(format!(
  824 |                     "list encoding for field '{}' in column {}, page {} is missing its offsets encoding",
  825 |                     list_field.name, offsets_column.index, page_index
  826 |                 ))
  827 |             })?;
  828 |             inner_infos.push(PageInfo {
  829 |                 buffer_offsets_and_sizes: offsets_page.buffer_offsets_and_sizes.clone(),
  830 |                 encoding: PageEncoding::Legacy(offsets_encoding.as_ref().clone()),
  831 |                 num_rows: offsets_page.num_rows,
  832 |                 priority: 0,
  833 |             });
  834 |             null_offset_adjustments.push(OffsetPageInfo {
  835 |                 offsets_in_page: offsets_page.num_rows,
  836 |                 null_offset_adjustment: list_encoding.null_offset_adjustment,
  837 |                 num_items_referenced_by_page: list_encoding.num_items,
  838 |             });
  839 |         }
  840 |         let inner = Arc::new(PrimitiveFieldScheduler::new(
  841 |             offsets_column.index,
  842 |             DataType::UInt64,
  843 |             Arc::from(inner_infos.into_boxed_slice()),
  844 |             offsets_column_buffers,
  845 |             self.validate_data,
  846 |         )) as Arc<dyn FieldScheduler>;
  847 |         let items_field = match list_field.data_type() {
  848 |             DataType::List(inner) => inner,
  849 |             DataType::LargeList(inner) => inner,
  850 |             _ => unreachable!(),
  851 |         };
  852 |         let offset_type = if matches!(list_field.data_type(), DataType::List(_)) {
  853 |             DataType::Int32
  854 |         } else {
  855 |             DataType::Int64
  856 |         };
  857 |         Ok(Box::new(ListFieldScheduler::new(
  858 |             inner,
  859 |             items_scheduler.into(),
  860 |             items_field,
  861 |             offset_type,
  862 |             null_offset_adjustments,
  863 |         )))
  864 |     }
  865 | 
  866 |     fn unwrap_blob(column_info: &ColumnInfo) -> Option<ColumnInfo> {
  867 |         if let column_encoding::ColumnEncoding::Blob(blob) =
  868 |             column_info.encoding.column_encoding.as_ref().unwrap()
  869 |         {
  870 |             let mut column_info = column_info.clone();
  871 |             column_info.encoding = blob.inner.as_ref().unwrap().as_ref().clone();
  872 |             Some(column_info)
  873 |         } else {
  874 |             None
  875 |         }
  876 |     }
  877 | 
  878 |     fn create_structural_field_scheduler(
  879 |         &self,
  880 |         field: &Field,
  881 |         column_infos: &mut ColumnInfoIter,
  882 |     ) -> Result<Box<dyn StructuralFieldScheduler>> {
  883 |         let data_type = field.data_type();
  884 |         validate_fixed_size_list_dimensions(&field.name, &data_type)?;
  885 |         if Self::is_structural_primitive(&data_type) {
  886 |             let column_info = column_infos.expect_next()?;
  887 |             let scheduler = Box::new(StructuralPrimitiveFieldScheduler::try_new_lazy(
  888 |                 column_info.clone(),
  889 |                 self.decompressor_strategy.clone(),
  890 |                 self.cache_repetition_index,
  891 |                 field,
  892 |             )?);
  893 | 
  894 |             // advance to the next top level column
  895 |             column_infos.next_top_level();
  896 | 
  897 |             return Ok(scheduler);
  898 |         }
  899 |         match &data_type {
  900 |             DataType::Struct(fields) => {
  901 |                 if field.is_packed_struct() {
  902 |                     // Packed struct
  903 |                     let column_info = column_infos.expect_next()?;
  904 |                     let scheduler = Box::new(StructuralPrimitiveFieldScheduler::try_new_lazy(
  905 |                         column_info.clone(),
  906 |                         self.decompressor_strategy.clone(),
  907 |                         self.cache_repetition_index,
  908 |                         field,
  909 |                     )?);
  910 | 
  911 |                     // advance to the next top level column
  912 |                     column_infos.next_top_level();
  913 | 
  914 |                     return Ok(scheduler);
  915 |                 }
  916 |                 // Maybe a blob descriptions struct?
  917 |                 if field.is_blob() {
  918 |                     let column_info = column_infos.peek();
  919 |                     if column_info.page_infos.iter().any(|page| {
  920 |                         matches!(
  921 |                             page.encoding,
  922 |                             PageEncoding::Structural(pb21::PageLayout {
  923 |                                 layout: Some(pb21::page_layout::Layout::BlobLayout(_))
  924 |                             })
  925 |                         )
  926 |                     }) {
  927 |                         let column_info = column_infos.expect_next()?;
  928 |                         let scheduler = Box::new(StructuralPrimitiveFieldScheduler::try_new_lazy(
  929 |                             column_info.clone(),
  930 |                             self.decompressor_strategy.clone(),
  931 |                             self.cache_repetition_index,
  932 |                             field,
  933 |                         )?);
  934 |                         column_infos.next_top_level();
  935 |                         return Ok(scheduler);
  936 |                     }
  937 |                 }
  938 | 
  939 |                 let mut child_schedulers = Vec::with_capacity(field.children.len());
  940 |                 for field in field.children.iter() {
  941 |                     let field_scheduler =
  942 |                         self.create_structural_field_scheduler(field, column_infos)?;
  943 |                     child_schedulers.push(field_scheduler);
  944 |                 }
  945 | 
  946 |                 let fields = fields.clone();
  947 |                 Ok(
  948 |                     Box::new(StructuralStructScheduler::new(child_schedulers, fields))
  949 |                         as Box<dyn StructuralFieldScheduler>,
  950 |                 )
  951 |             }
  952 |             DataType::List(_) | DataType::LargeList(_) => {
  953 |                 let child = field.children.first().expect_ok()?;
  954 |                 let child_scheduler =
  955 |                     self.create_structural_field_scheduler(child, column_infos)?;
  956 |                 Ok(Box::new(StructuralListScheduler::new(child_scheduler))
  957 |                     as Box<dyn StructuralFieldScheduler>)
  958 |             }
  959 |             DataType::FixedSizeList(inner, dimension)
  960 |                 if matches!(inner.data_type(), DataType::Struct(_)) =>
  961 |             {
  962 |                 let child = field.children.first().expect_ok()?;
  963 |                 let child_scheduler =
  964 |                     self.create_structural_field_scheduler(child, column_infos)?;
  965 |                 Ok(Box::new(StructuralFixedSizeListScheduler::new(
  966 |                     child_scheduler,
  967 |                     *dimension,
  968 |                 )) as Box<dyn StructuralFieldScheduler>)
  969 |             }
  970 |             DataType::Map(_, keys_sorted) => {
  971 |                 // TODO: We only support keys_sorted=false for now,
  972 |                 //  because converting a rust arrow map field to the python arrow field will
  973 |                 //  lose the keys_sorted property.
  974 |                 if *keys_sorted {
  975 |                     return Err(Error::not_supported_source(format!("Map data type is not supported with keys_sorted=true now, current value is {}", *keys_sorted).into()));
  976 |                 }
  977 |                 let entries_child = field.children.first().expect_ok()?;
  978 |                 let child_scheduler =
  979 |                     self.create_structural_field_scheduler(entries_child, column_infos)?;
  980 |                 Ok(Box::new(StructuralMapScheduler::new(child_scheduler))
  981 |                     as Box<dyn StructuralFieldScheduler>)
  982 |             }
  983 |             _ => todo!("create_structural_field_scheduler for {}", data_type),
  984 |         }
  985 |     }
  986 | 
  987 |     fn create_array_field_scheduler(
  988 |         &self,
  989 |         field: &Field,
  990 |         column_infos: &mut ColumnInfoIter,
  991 |         buffers: FileBuffers,
  992 |     ) -> Result<Box<dyn FieldScheduler>> {
  993 |         let data_type = field.data_type();
  994 |         validate_fixed_size_list_dimensions(&field.name, &data_type)?;
  995 |         if Self::is_array_primitive(&data_type) {
  996 |             let column_info = column_infos.expect_next()?;
  997 |             let scheduler = self.create_primitive_scheduler(field, column_info, buffers)?;
  998 |             return Ok(scheduler);
  999 |         } else if data_type.is_binary_like() {
 1000 |             let column_info = column_infos.expect_next()?.clone();
 1001 |             // Column is blob and user is asking for binary data
 1002 |             if let Some(blob_col) = Self::unwrap_blob(column_info.as_ref()) {
 1003 |                 let desc_scheduler =
 1004 |                     self.create_primitive_scheduler(&BLOB_DESC_LANCE_FIELD, &blob_col, buffers)?;
 1005 |                 let blob_scheduler = Box::new(BlobFieldScheduler::new(desc_scheduler.into()));
 1006 |                 return Ok(blob_scheduler);
 1007 |             }
 1008 |             if let Some(page_info) = column_info.page_infos.first() {
 1009 |                 if matches!(
 1010 |                     page_info.encoding.as_legacy(),
 1011 |                     pb::ArrayEncoding {
 1012 |                         array_encoding: Some(pb::array_encoding::ArrayEncoding::List(..))
 1013 |                     }
 1014 |                 ) {
 1015 |                     let list_type = if matches!(data_type, DataType::Utf8 | DataType::Binary) {
 1016 |                         DataType::List(Arc::new(ArrowField::new("item", DataType::UInt8, false)))
 1017 |                     } else {
 1018 |                         DataType::LargeList(Arc::new(ArrowField::new(
 1019 |                             "item",
 1020 |                             DataType::UInt8,
 1021 |                             false,
 1022 |                         )))
 1023 |                     };
 1024 |                     let list_field = Field::try_from(ArrowField::new(
 1025 |                         field.name.clone(),
 1026 |                         list_type,
 1027 |                         field.nullable,
 1028 |                     ))
 1029 |                     .unwrap();
 1030 |                     let list_scheduler = self.create_list_scheduler(
 1031 |                         &list_field,
 1032 |                         column_infos,
 1033 |                         buffers,
 1034 |                         &column_info,
 1035 |                     )?;
 1036 |                     let binary_scheduler = Box::new(BinaryFieldScheduler::new(
 1037 |                         list_scheduler.into(),
 1038 |                         field.data_type(),
 1039 |                     ));
 1040 |                     return Ok(binary_scheduler);
 1041 |                 } else {
 1042 |                     let scheduler =
 1043 |                         self.create_primitive_scheduler(field, &column_info, buffers)?;
 1044 |                     return Ok(scheduler);
 1045 |                 }
 1046 |             } else {
 1047 |                 return self.create_primitive_scheduler(field, &column_info, buffers);
 1048 |             }
 1049 |         }
 1050 |         match &data_type {
 1051 |             DataType::FixedSizeList(inner, _dimension) => {
 1052 |                 // A fixed size list column could either be a physical or a logical decoder
 1053 |                 // depending on the child data type.
 1054 |                 if Self::is_array_primitive(inner.data_type()) {
 1055 |                     let primitive_col = column_infos.expect_next()?;
 1056 |                     let scheduler =
 1057 |                         self.create_primitive_scheduler(field, primitive_col, buffers)?;
 1058 |                     Ok(scheduler)
 1059 |                 } else {
 1060 |                     todo!()
 1061 |                 }
 1062 |             }
 1063 |             DataType::Dictionary(_key_type, value_type) => {
 1064 |                 if Self::is_array_primitive(value_type) || value_type.is_binary_like() {
 1065 |                     let primitive_col = column_infos.expect_next()?;
 1066 |                     let scheduler =
 1067 |                         self.create_primitive_scheduler(field, primitive_col, buffers)?;
 1068 |                     Ok(scheduler)
 1069 |                 } else {
 1070 |                     Err(Error::not_supported_source(
 1071 |                         format!(
 1072 |                             "No way to decode into a dictionary field of type {}",
 1073 |                             value_type
 1074 |                         )
 1075 |                         .into(),
 1076 |                     ))
 1077 |                 }
 1078 |             }
 1079 |             DataType::List(_) | DataType::LargeList(_) => {
 1080 |                 let offsets_column = column_infos.expect_next()?.clone();
 1081 |                 column_infos.next_top_level();
 1082 |                 self.create_list_scheduler(field, column_infos, buffers, &offsets_column)
 1083 |             }
 1084 |             DataType::Struct(fields) => {
 1085 |                 let column_info = column_infos.expect_next()?;
 1086 | 
 1087 |                 // Column is blob and user is asking for descriptions
 1088 |                 if let Some(blob_col) = Self::unwrap_blob(column_info.as_ref()) {
 1089 |                     // Can use primitive scheduler here since descriptions are always packed struct
 1090 |                     return self.create_primitive_scheduler(field, &blob_col, buffers);
 1091 |                 }
 1092 | 
 1093 |                 if Self::check_packed_struct(column_info) {
 1094 |                     // use packed struct encoding
 1095 |                     self.create_primitive_scheduler(field, column_info, buffers)
 1096 |                 } else {
 1097 |                     // use default struct encoding
 1098 |                     Self::check_simple_struct(column_info, &field.name).unwrap();
 1099 |                     let num_rows = column_info
 1100 |                         .page_infos
 1101 |                         .iter()
 1102 |                         .map(|page| page.num_rows)
 1103 |                         .sum();
 1104 |                     let mut child_schedulers = Vec::with_capacity(field.children.len());
 1105 |                     for field in &field.children {
 1106 |                         column_infos.next_top_level();
 1107 |                         let field_scheduler =
 1108 |                             self.create_array_field_scheduler(field, column_infos, buffers)?;
 1109 |                         child_schedulers.push(Arc::from(field_scheduler));
 1110 |                     }
 1111 | 
 1112 |                     let fields = fields.clone();
 1113 |                     Ok(Box::new(SimpleStructScheduler::new(
 1114 |                         child_schedulers,
 1115 |                         fields,
 1116 |                         num_rows,
 1117 |                     )))
 1118 |                 }
 1119 |             }
 1120 |             // TODO: Still need support for RLE
 1121 |             _ => todo!(),
 1122 |         }
 1123 |     }
 1124 | }
 1125 | 
 1126 | /// Create's a dummy ColumnInfo for the root column
 1127 | fn root_column(num_rows: u64) -> ColumnInfo {
 1128 |     let num_root_pages = num_rows.div_ceil(u32::MAX as u64);
 1129 |     let final_page_num_rows = num_rows % (u32::MAX as u64);
 1130 |     let root_pages = (0..num_root_pages)
 1131 |         .map(|i| PageInfo {
 1132 |             num_rows: if i == num_root_pages - 1 {
 1133 |                 final_page_num_rows
 1134 |             } else {
 1135 |                 u64::MAX
 1136 |             },
 1137 |             encoding: PageEncoding::Legacy(pb::ArrayEncoding {
 1138 |                 array_encoding: Some(pb::array_encoding::ArrayEncoding::Struct(
 1139 |                     pb::SimpleStruct {},
 1140 |                 )),
 1141 |             }),
 1142 |             priority: 0, // not used by the array scheduler
 1143 |             buffer_offsets_and_sizes: Arc::new([]),
 1144 |         })
 1145 |         .collect::<Vec<_>>();
 1146 |     ColumnInfo {
 1147 |         buffer_offsets_and_sizes: Arc::new([]),
 1148 |         encoding: pb::ColumnEncoding {
 1149 |             column_encoding: Some(pb::column_encoding::ColumnEncoding::Values(())),
 1150 |         },
 1151 |         index: u32::MAX,
 1152 |         page_infos: Arc::from(root_pages),
 1153 |     }
 1154 | }
 1155 | 
 1156 | pub enum RootDecoder {
 1157 |     Structural(StructuralStructDecoder),
 1158 |     Array(SimpleStructDecoder),
 1159 | }
 1160 | 
 1161 | impl RootDecoder {
 1162 |     pub fn into_structural(self) -> StructuralStructDecoder {
 1163 |         match self {
 1164 |             Self::Structural(decoder) => decoder,
 1165 |             Self::Array(_) => panic!("Expected a structural decoder"),
 1166 |         }
 1167 |     }
 1168 | 
 1169 |     pub fn into_array(self) -> SimpleStructDecoder {
 1170 |         match self {
 1171 |             Self::Array(decoder) => decoder,
 1172 |             Self::Structural(_) => panic!("Expected an array decoder"),
 1173 |         }
 1174 |     }
 1175 | }
 1176 | 
 1177 | impl DecodeBatchScheduler {
 1178 |     /// Creates a new decode scheduler with the expected schema and the column
 1179 |     /// metadata of the file.
 1180 |     #[allow(clippy::too_many_arguments)]
 1181 |     pub async fn try_new<'a>(
 1182 |         schema: &'a Schema,
 1183 |         column_indices: &[u32],
 1184 |         column_infos: &[Arc<ColumnInfo>],
 1185 |         file_buffer_positions_and_sizes: &'a Vec<(u64, u64)>,
 1186 |         num_rows: u64,
 1187 |         decoder_plugins: Arc<DecoderPlugins>,
 1188 |         io: Arc<dyn EncodingsIo>,
 1189 |         cache: Arc<LanceCache>,
 1190 |         filter: &FilterExpression,
 1191 |         decoder_config: &DecoderConfig,
 1192 |     ) -> Result<Self> {
 1193 |         Self::try_new_with_ranges(
 1194 |             schema,
 1195 |             column_indices,
 1196 |             column_infos,
 1197 |             file_buffer_positions_and_sizes,
 1198 |             num_rows,
 1199 |             decoder_plugins,
 1200 |             io,
 1201 |             cache,
 1202 |             None,
 1203 |             filter,
 1204 |             decoder_config,
 1205 |         )
 1206 |         .await
 1207 |     }
 1208 | 
 1209 |     /// Creates a decode scheduler and initializes only pages overlapping known ranges.
 1210 |     #[allow(clippy::too_many_arguments)]
 1211 |     pub(crate) async fn try_new_with_ranges<'a>(
 1212 |         schema: &'a Schema,
 1213 |         column_indices: &[u32],
 1214 |         column_infos: &[Arc<ColumnInfo>],
 1215 |         file_buffer_positions_and_sizes: &'a Vec<(u64, u64)>,
 1216 |         num_rows: u64,
 1217 |         _decoder_plugins: Arc<DecoderPlugins>,
 1218 |         io: Arc<dyn EncodingsIo>,
 1219 |         cache: Arc<LanceCache>,
 1220 |         // The top-level row ranges that will be scheduled, if known. This lets
 1221 |         // the structural path initialize only the pages those ranges touch.
 1222 |         // `None` preserves `try_new`'s eager initialization behavior.
 1223 |         requested_ranges: Option<&[Range<u64>]>,
 1224 |         filter: &FilterExpression,
 1225 |         decoder_config: &DecoderConfig,
 1226 |     ) -> Result<Self> {
 1227 |         assert!(num_rows > 0);
 1228 |         let buffers = FileBuffers {
 1229 |             positions_and_sizes: file_buffer_positions_and_sizes,
 1230 |         };
 1231 |         let arrow_schema = ArrowSchema::from(schema);
 1232 |         let root_fields = arrow_schema.fields().clone();
 1233 |         let root_type = DataType::Struct(root_fields.clone());
 1234 |         let mut root_field = Field::try_from(&ArrowField::new("root", root_type, false))?;
 1235 |         // root_field.children and schema.fields should be identical at this point but the latter
 1236 |         // has field ids and the former does not.  This line restores that.
 1237 |         // TODO:  Is there another way to create the root field without forcing a trip through arrow?
 1238 |         root_field.children.clone_from(&schema.fields);
 1239 |         root_field
 1240 |             .metadata
 1241 |             .insert("__lance_decoder_root".to_string(), "true".to_string());
 1242 | 
 1243 |         if column_infos.is_empty() || column_infos[0].is_structural() {
 1244 |             let mut column_iter = ColumnInfoIter::new(column_infos.to_vec(), column_indices);
 1245 | 
 1246 |             let strategy = CoreFieldDecoderStrategy::from_decoder_config(decoder_config);
 1247 |             let mut root_scheduler =
 1248 |                 strategy.create_structural_field_scheduler(&root_field, &mut column_iter)?;
 1249 | 
 1250 |             let context = SchedulerContext::new(io, cache.clone());
 1251 |             root_scheduler
 1252 |                 .initialize(requested_ranges, filter, &context)
 1253 |                 .await?;
 1254 | 
 1255 |             Ok(Self {
 1256 |                 root_scheduler: RootScheduler::Structural(root_scheduler),
 1257 |                 root_fields,
 1258 |                 cache,
 1259 |             })
 1260 |         } else {
 1261 |             // The old encoding style expected a header column for structs and so we
 1262 |             // need a header column for the top-level struct
 1263 |             let mut columns = Vec::with_capacity(column_infos.len() + 1);
 1264 |             columns.push(Arc::new(root_column(num_rows)));
 1265 |             columns.extend(column_infos.iter().cloned());
 1266 | 
 1267 |             let adjusted_column_indices = [0_u32]
 1268 |                 .into_iter()
 1269 |                 .chain(column_indices.iter().map(|i| i.saturating_add(1)))
 1270 |                 .collect::<Vec<_>>();
 1271 |             let mut column_iter = ColumnInfoIter::new(columns, &adjusted_column_indices);
 1272 |             let strategy = CoreFieldDecoderStrategy::from_decoder_config(decoder_config);
 1273 |             let root_scheduler =
 1274 |                 strategy.create_array_field_scheduler(&root_field, &mut column_iter, buffers)?;
 1275 | 
 1276 |             let context = SchedulerContext::new(io, cache.clone());
 1277 |             root_scheduler.initialize(filter, &context).await?;
 1278 | 
 1279 |             Ok(Self {
 1280 |                 root_scheduler: RootScheduler::Array(root_scheduler.into()),
 1281 |                 root_fields,
 1282 |                 cache,
 1283 |             })
 1284 |         }
 1285 |     }
 1286 | 
 1287 |     #[deprecated(since = "0.29.1", note = "This is for v2.0 array-encoding paths")]
 1288 |     pub fn from_scheduler(
 1289 |         root_scheduler: Arc<dyn FieldScheduler>,
 1290 |         root_fields: Fields,
 1291 |         cache: Arc<LanceCache>,
 1292 |     ) -> Self {
 1293 |         Self {
 1294 |             root_scheduler: RootScheduler::Array(root_scheduler),
 1295 |             root_fields,
 1296 |             cache,
 1297 |         }
 1298 |     }
 1299 | 
 1300 |     fn do_schedule_ranges_structural(
 1301 |         &mut self,
 1302 |         ranges: &[Range<u64>],
 1303 |         filter: &FilterExpression,
 1304 |         io: Arc<dyn EncodingsIo>,
 1305 |         mut schedule_action: impl FnMut(Result<DecoderMessage>) -> bool,
 1306 |     ) {
 1307 |         let root_scheduler = self.root_scheduler.as_structural();
 1308 |         let mut context = SchedulerContext::new(io, self.cache.clone());
 1309 |         let maybe_root_job = root_scheduler.schedule_ranges(ranges, filter);
 1310 |         if let Err(schedule_ranges_err) = maybe_root_job {
 1311 |             schedule_action(Err(schedule_ranges_err));
 1312 |             return;
 1313 |         }
 1314 |         let mut root_job = maybe_root_job.unwrap();
 1315 |         let mut num_rows_scheduled = 0;
 1316 |         loop {
 1317 |             let maybe_next_scan_lines = root_job.schedule_next(&mut context);
 1318 |             if let Err(err) = maybe_next_scan_lines {
 1319 |                 schedule_action(Err(err));
 1320 |                 return;
 1321 |             }
 1322 |             let next_scan_lines = maybe_next_scan_lines.unwrap();
 1323 |             context.flush_io();
 1324 |             if next_scan_lines.is_empty() {
 1325 |                 return;
 1326 |             }
 1327 |             for next_scan_line in next_scan_lines {
 1328 |                 trace!(
 1329 |                     "Scheduled scan line of {} rows and {} decoders",
 1330 |                     next_scan_line.rows_scheduled,
 1331 |                     next_scan_line.decoders.len()
 1332 |                 );
 1333 |                 num_rows_scheduled += next_scan_line.rows_scheduled;
 1334 |                 if !schedule_action(Ok(DecoderMessage {
 1335 |                     scheduled_so_far: num_rows_scheduled,
 1336 |                     decoders: next_scan_line.decoders,
 1337 |                 })) {
 1338 |                     // Decoder has disconnected
 1339 |                     return;
 1340 |                 }
 1341 |             }
 1342 |         }
 1343 |     }
 1344 | 
 1345 |     fn do_schedule_ranges_array(
 1346 |         &mut self,
 1347 |         ranges: &[Range<u64>],
 1348 |         filter: &FilterExpression,
 1349 |         io: Arc<dyn EncodingsIo>,
 1350 |         mut schedule_action: impl FnMut(Result<DecoderMessage>) -> bool,
 1351 |         // If specified, this will be used as the top_level_row for all scheduling
 1352 |         // tasks.  This is used by list scheduling to ensure all items scheduling
 1353 |         // tasks are scheduled at the same top level row.
 1354 |         priority: Option<Box<dyn PriorityRange>>,
 1355 |     ) {
 1356 |         let root_scheduler = self.root_scheduler.as_array();
 1357 |         let rows_requested = ranges.iter().map(|r| r.end - r.start).sum::<u64>();
 1358 |         trace!(
 1359 |             "Scheduling {} ranges across {}..{} ({} rows){}",
 1360 |             ranges.len(),
 1361 |             ranges.first().unwrap().start,
 1362 |             ranges.last().unwrap().end,
 1363 |             rows_requested,
 1364 |             priority
 1365 |                 .as_ref()
 1366 |                 .map(|p| format!(" (priority={:?})", p))
 1367 |                 .unwrap_or_default()
 1368 |         );
 1369 | 
 1370 |         let mut context = SchedulerContext::new(io, self.cache.clone());
 1371 |         let maybe_root_job = root_scheduler.schedule_ranges(ranges, filter);
 1372 |         if let Err(schedule_ranges_err) = maybe_root_job {
 1373 |             schedule_action(Err(schedule_ranges_err));
 1374 |             return;
 1375 |         }
 1376 |         let mut root_job = maybe_root_job.unwrap();
 1377 |         let mut num_rows_scheduled = 0;
 1378 |         let mut rows_to_schedule = root_job.num_rows();
 1379 |         let mut priority = priority.unwrap_or(Box::new(SimplePriorityRange::new(0)));
 1380 |         trace!("Scheduled ranges refined to {} rows", rows_to_schedule);
 1381 |         while rows_to_schedule > 0 {
 1382 |             let maybe_next_scan_line = root_job.schedule_next(&mut context, priority.as_ref());
 1383 |             if let Err(schedule_next_err) = maybe_next_scan_line {
 1384 |                 schedule_action(Err(schedule_next_err));
 1385 |                 return;
 1386 |             }
 1387 |             let next_scan_line = maybe_next_scan_line.unwrap();
 1388 |             context.flush_io();
 1389 |             priority.advance(next_scan_line.rows_scheduled);
 1390 |             num_rows_scheduled += next_scan_line.rows_scheduled;
 1391 |             rows_to_schedule -= next_scan_line.rows_scheduled;
 1392 |             trace!(
 1393 |                 "Scheduled scan line of {} rows and {} decoders",
 1394 |                 next_scan_line.rows_scheduled,
 1395 |                 next_scan_line.decoders.len()
 1396 |             );
 1397 |             if !schedule_action(Ok(DecoderMessage {
 1398 |                 scheduled_so_far: num_rows_scheduled,
 1399 |                 decoders: next_scan_line.decoders,
 1400 |             })) {
 1401 |                 // Decoder has disconnected
 1402 |                 return;
 1403 |             }
 1404 | 
 1405 |             trace!("Finished scheduling {} ranges", ranges.len());
 1406 |         }
 1407 |     }
 1408 | 
 1409 |     fn do_schedule_ranges(
 1410 |         &mut self,
 1411 |         ranges: &[Range<u64>],
 1412 |         filter: &FilterExpression,
 1413 |         io: Arc<dyn EncodingsIo>,
 1414 |         schedule_action: impl FnMut(Result<DecoderMessage>) -> bool,
 1415 |         // If specified, this will be used as the top_level_row for all scheduling
 1416 |         // tasks.  This is used by list scheduling to ensure all items scheduling
 1417 |         // tasks are scheduled at the same top level row.
 1418 |         priority: Option<Box<dyn PriorityRange>>,
 1419 |     ) {
 1420 |         match &self.root_scheduler {
 1421 |             RootScheduler::Array(_) => {
 1422 |                 self.do_schedule_ranges_array(ranges, filter, io, schedule_action, priority)
 1423 |             }
 1424 |             RootScheduler::Structural(_) => {
 1425 |                 self.do_schedule_ranges_structural(ranges, filter, io, schedule_action)
 1426 |             }
 1427 |         }
 1428 |     }
 1429 | 
 1430 |     // This method is similar to schedule_ranges but instead of
 1431 |     // sending the decoders to a channel it collects them all into a vector
 1432 |     pub fn schedule_ranges_to_vec(
 1433 |         &mut self,
 1434 |         ranges: &[Range<u64>],
 1435 |         filter: &FilterExpression,
 1436 |         io: Arc<dyn EncodingsIo>,
 1437 |         priority: Option<Box<dyn PriorityRange>>,
 1438 |     ) -> Result<Vec<DecoderMessage>> {
 1439 |         let mut decode_messages = Vec::new();
 1440 |         self.do_schedule_ranges(
 1441 |             ranges,
 1442 |             filter,
 1443 |             io,
 1444 |             |msg| {
 1445 |                 decode_messages.push(msg);
 1446 |                 true
 1447 |             },
 1448 |             priority,
 1449 |         );
 1450 |         decode_messages.into_iter().collect::<Result<Vec<_>>>()
 1451 |     }
 1452 | 
 1453 |     /// Schedules the load of multiple ranges of rows
 1454 |     ///
 1455 |     /// Ranges must be non-overlapping and in sorted order
 1456 |     ///
 1457 |     /// # Arguments
 1458 |     ///
 1459 |     /// * `ranges` - The ranges of rows to load
 1460 |     /// * `sink` - A channel to send the decode tasks
 1461 |     /// * `scheduler` An I/O scheduler to issue I/O requests
 1462 |     #[instrument(level = "debug", skip_all)]
 1463 |     pub fn schedule_ranges(
 1464 |         &mut self,
 1465 |         ranges: &[Range<u64>],
 1466 |         filter: &FilterExpression,
 1467 |         sink: mpsc::UnboundedSender<Result<DecoderMessage>>,
 1468 |         scheduler: Arc<dyn EncodingsIo>,
 1469 |     ) {
 1470 |         self.do_schedule_ranges(
 1471 |             ranges,
 1472 |             filter,
 1473 |             scheduler,
 1474 |             |msg| {
 1475 |                 match sink.send(msg) {
 1476 |                     Ok(_) => true,
 1477 |                     Err(SendError { .. }) => {
 1478 |                         // The receiver has gone away.  We can't do anything about it
 1479 |                         // so just ignore the error.
 1480 |                         debug!(
 1481 |                         "schedule_ranges aborting early since decoder appears to have been dropped"
 1482 |                     );
 1483 |                         false
 1484 |                     }
 1485 |                 }
 1486 |             },
 1487 |             None,
 1488 |         )
 1489 |     }
 1490 | 
 1491 |     /// Schedules the load of a range of rows
 1492 |     ///
 1493 |     /// # Arguments
 1494 |     ///
 1495 |     /// * `range` - The range of rows to load
 1496 |     /// * `sink` - A channel to send the decode tasks
 1497 |     /// * `scheduler` An I/O scheduler to issue I/O requests
 1498 |     #[instrument(level = "debug", skip_all)]
 1499 |     pub fn schedule_range(
 1500 |         &mut self,
 1501 |         range: Range<u64>,
 1502 |         filter: &FilterExpression,
 1503 |         sink: mpsc::UnboundedSender<Result<DecoderMessage>>,
 1504 |         scheduler: Arc<dyn EncodingsIo>,
 1505 |     ) {
 1506 |         self.schedule_ranges(&[range], filter, sink, scheduler)
 1507 |     }
 1508 | 
 1509 |     /// Schedules the load of selected rows
 1510 |     ///
 1511 |     /// # Arguments
 1512 |     ///
 1513 |     /// * `indices` - The row indices to load (these must be in ascending order!)
 1514 |     /// * `sink` - A channel to send the decode tasks
 1515 |     /// * `scheduler` An I/O scheduler to issue I/O requests
 1516 |     pub fn schedule_take(
 1517 |         &mut self,
 1518 |         indices: &[u64],
 1519 |         filter: &FilterExpression,
 1520 |         sink: mpsc::UnboundedSender<Result<DecoderMessage>>,
 1521 |         scheduler: Arc<dyn EncodingsIo>,
 1522 |     ) {
 1523 |         if indices.is_empty() {
 1524 |             return;
 1525 |         }
 1526 |         trace!("Scheduling take of {} rows", indices.len());
 1527 |         let ranges = match RequestedRows::indices_to_ranges(indices) {
 1528 |             Ok(ranges) => ranges,
 1529 |             Err(error) => {
 1530 |                 if let Err(SendError { .. }) = sink.send(Err(error)) {
 1531 |                     debug!(
 1532 |                         "schedule_take could not report invalid indices because the decoder was dropped"
 1533 |                     );
 1534 |                 }
 1535 |                 return;
 1536 |             }
 1537 |         };
 1538 |         self.schedule_ranges(&ranges, filter, sink, scheduler)
 1539 |     }
 1540 | }
 1541 | 
 1542 | pub struct ReadBatchTask {
 1543 |     pub task: BoxFuture<'static, Result<RecordBatch>>,
 1544 |     pub num_rows: u32,
 1545 | }
 1546 | 
 1547 | /// A stream that takes scheduled jobs and generates decode tasks from them.
 1548 | pub struct BatchDecodeStream {
 1549 |     context: DecoderContext,
 1550 |     root_decoder: SimpleStructDecoder,
 1551 |     rows_remaining: u64,
 1552 |     rows_per_batch: u32,
 1553 |     rows_scheduled: u64,
 1554 |     rows_drained: u64,
 1555 |     scheduler_exhausted: bool,
 1556 |     emitted_batch_size_warning: Arc<Once>,
 1557 |     limit_i32_offset_batch_size: bool,
 1558 | }
 1559 | 
 1560 | impl BatchDecodeStream {
 1561 |     /// Create a new instance of a batch decode stream
 1562 |     ///
 1563 |     /// # Arguments
 1564 |     ///
 1565 |     /// * `scheduled` - an incoming stream of decode tasks from a `DecodeBatchScheduler`
 1566 |     /// * `schema` - the schema of the data to create
 1567 |     /// * `rows_per_batch` the number of rows to create before making a batch
 1568 |     /// * `num_rows` the total number of rows scheduled
 1569 |     /// * `num_columns` the total number of columns in the file
 1570 |     pub fn new(
 1571 |         scheduled: mpsc::UnboundedReceiver<Result<DecoderMessage>>,
 1572 |         rows_per_batch: u32,
 1573 |         num_rows: u64,
 1574 |         root_decoder: SimpleStructDecoder,
 1575 |     ) -> Self {
 1576 |         Self::new_with_i32_offset_limit(scheduled, rows_per_batch, num_rows, root_decoder, true)
 1577 |     }
 1578 | 
 1579 |     fn new_with_i32_offset_limit(
 1580 |         scheduled: mpsc::UnboundedReceiver<Result<DecoderMessage>>,
 1581 |         rows_per_batch: u32,
 1582 |         num_rows: u64,
 1583 |         root_decoder: SimpleStructDecoder,
 1584 |         limit_i32_offset_batch_size: bool,
 1585 |     ) -> Self {
 1586 |         Self {
 1587 |             context: DecoderContext::new(scheduled),
 1588 |             root_decoder,
 1589 |             rows_remaining: num_rows,
 1590 |             rows_per_batch,
 1591 |             rows_scheduled: 0,
 1592 |             rows_drained: 0,
 1593 |             scheduler_exhausted: false,
 1594 |             emitted_batch_size_warning: Arc::new(Once::new()),
 1595 |             limit_i32_offset_batch_size,
 1596 |         }
 1597 |     }
 1598 | 
 1599 |     fn accept_decoder(&mut self, decoder: DecoderReady) -> Result<()> {
 1600 |         if decoder.path.is_empty() {
 1601 |             // The root decoder we can ignore
 1602 |             Ok(())
 1603 |         } else {
 1604 |             self.root_decoder.accept_child(decoder)
 1605 |         }
 1606 |     }
 1607 | 
 1608 |     #[instrument(level = "debug", skip_all)]
 1609 |     async fn wait_for_scheduled(&mut self, scheduled_need: u64) -> Result<u64> {
 1610 |         if self.scheduler_exhausted {
 1611 |             return Ok(self.rows_scheduled);
 1612 |         }
 1613 |         while self.rows_scheduled < scheduled_need {
 1614 |             let next_message = self.context.source.recv().await;
 1615 |             match next_message {
 1616 |                 Some(scan_line) => {
 1617 |                     let scan_line = scan_line?;
 1618 |                     self.rows_scheduled = scan_line.scheduled_so_far;
 1619 |                     for message in scan_line.decoders {
 1620 |                         self.accept_decoder(message.into_array())?;
 1621 |                     }
 1622 |                 }
 1623 |                 None => {
 1624 |                     // Schedule ended before we got all the data we expected.  This probably
 1625 |                     // means some kind of pushdown filter was applied and we didn't load as
 1626 |                     // much data as we thought we would.
 1627 |                     self.scheduler_exhausted = true;
 1628 |                     return Ok(self.rows_scheduled);
 1629 |                 }
 1630 |             }
 1631 |         }
 1632 |         Ok(scheduled_need)
 1633 |     }
 1634 | 
 1635 |     #[instrument(level = "debug", skip_all)]
 1636 |     async fn next_batch_task(&mut self) -> Result<Option<NextDecodeTask>> {
 1637 |         trace!(
 1638 |             "Draining batch task (rows_remaining={} rows_drained={} rows_scheduled={})",
 1639 |             self.rows_remaining, self.rows_drained, self.rows_scheduled,
 1640 |         );
 1641 |         if self.rows_remaining == 0 {
 1642 |             return Ok(None);
 1643 |         }
 1644 | 
 1645 |         let mut to_take = self.rows_remaining.min(self.rows_per_batch as u64);
 1646 |         self.rows_remaining -= to_take;
 1647 | 
 1648 |         let scheduled_need = (self.rows_drained + to_take).saturating_sub(self.rows_scheduled);
 1649 |         trace!(
 1650 |             "scheduled_need = {} because rows_drained = {} and to_take = {} and rows_scheduled = {}",
 1651 |             scheduled_need, self.rows_drained, to_take, self.rows_scheduled
 1652 |         );
 1653 |         if scheduled_need > 0 {
 1654 |             let desired_scheduled = scheduled_need + self.rows_scheduled;
 1655 |             trace!(
 1656 |                 "Draining from scheduler (desire at least {} scheduled rows)",
 1657 |                 desired_scheduled
 1658 |             );
 1659 |             let actually_scheduled = self.wait_for_scheduled(desired_scheduled).await?;
 1660 |             if actually_scheduled < desired_scheduled {
 1661 |                 let under_scheduled = desired_scheduled - actually_scheduled;
 1662 |                 to_take -= under_scheduled;
 1663 |             }
 1664 |         }
 1665 | 
 1666 |         if to_take == 0 {
 1667 |             return Ok(None);
 1668 |         }
 1669 | 
 1670 |         // wait_for_loaded waits for *>* loaded_need (not >=) so we do a -1 here
 1671 |         let loaded_need = self.rows_drained + to_take - 1;
 1672 |         trace!(
 1673 |             "Waiting for I/O (desire at least {} fully loaded rows)",
 1674 |             loaded_need
 1675 |         );
 1676 |         self.root_decoder.wait_for_loaded(loaded_need).await?;
 1677 | 
 1678 |         if self.limit_i32_offset_batch_size && has_i32_offsets(self.root_decoder.data_type()) {
 1679 |             let limit = LogicalPageDecoder::max_rows_to_drain(
 1680 |                 &self.root_decoder,
 1681 |                 to_take,
 1682 |                 I32_OFFSET_BYTE_BUDGET,
 1683 |             )?;
 1684 |             let clamped = clamp_rows_to_i32_budget(limit, to_take);
 1685 |             self.rows_remaining += to_take - clamped;
 1686 |             to_take = clamped;
 1687 |         }
 1688 | 
 1689 |         let next_task = self.root_decoder.drain(to_take)?;
 1690 |         self.rows_drained += to_take;
 1691 |         Ok(Some(next_task))
 1692 |     }
 1693 | 
 1694 |     pub fn into_stream(self) -> BoxStream<'static, ReadBatchTask> {
 1695 |         let stream = futures::stream::unfold(self, |mut slf| async move {
 1696 |             let next_task = match slf.next_batch_task().await {
 1697 |                 Ok(Some(next_task)) => next_task,
 1698 |                 Ok(None) => return None,
 1699 |                 Err(err) => {
 1700 |                     slf.rows_remaining = 0;
 1701 |                     return Some((
 1702 |                         ReadBatchTask {
 1703 |                             task: async move { Err(err) }.boxed(),
 1704 |                             num_rows: 0,
 1705 |                         },
 1706 |                         slf,
 1707 |                     ));
 1708 |                 }
 1709 |             };
 1710 |             let num_rows = next_task.num_rows;
 1711 |             let emitted_batch_size_warning = slf.emitted_batch_size_warning.clone();
 1712 |             let task = async move {
 1713 |                 // Real decode work happens inside into_batch, which can block the current
 1714 |                 // thread for a long time. By spawning it as a new task, we allow Tokio's
 1715 |                 // worker threads to keep making progress.
 1716 |                 let (batch, _data_size) =
 1717 |                     tokio::spawn(async move { next_task.into_batch(emitted_batch_size_warning) })
 1718 |                         .await
 1719 |                         .map_err(|err| Error::wrapped(err.into()))??;
 1720 |                 Ok(batch)
 1721 |             };
 1722 |             // This should be true since batch size is u32
 1723 |             debug_assert!(num_rows <= u32::MAX as u64);
 1724 |             Some((
 1725 |                 ReadBatchTask {
 1726 |                     task: task.boxed(),
 1727 |                     num_rows: num_rows as u32,
 1728 |                 },
 1729 |                 slf,
 1730 |             ))
 1731 |         });
 1732 |         stream.boxed()
 1733 |     }
 1734 | }
 1735 | 
 1736 | // Utility types to smooth out the differences between the 2.0 and 2.1 decoders so that
 1737 | // we can have a single implementation of the batch decode iterator
 1738 | enum RootDecoderMessage {
 1739 |     LoadedPage(LoadedPageShard),
 1740 |     ArrayPage(DecoderReady),
 1741 | }
 1742 | trait RootDecoderType {
 1743 |     fn accept_message(&mut self, message: RootDecoderMessage) -> Result<()>;
 1744 |     fn drain_batch(&mut self, num_rows: u64) -> Result<NextDecodeTask>;
 1745 |     fn wait(&mut self, loaded_need: u64, runtime: &tokio::runtime::Runtime) -> Result<()>;
 1746 |     /// See [`LogicalPageDecoder::max_rows_to_drain`].  Decoders without i32-offset
 1747 |     /// accounting place no limit.
 1748 |     fn max_rows_to_drain(&self, num_rows: u64, _byte_budget: u64) -> Result<DrainLimit> {
 1749 |         Ok(DrainLimit {
 1750 |             rows: num_rows,
 1751 |             bytes: 0,
 1752 |         })
 1753 |     }
 1754 | }
 1755 | impl RootDecoderType for StructuralStructDecoder {
 1756 |     fn accept_message(&mut self, message: RootDecoderMessage) -> Result<()> {
 1757 |         let RootDecoderMessage::LoadedPage(loaded_page) = message else {
 1758 |             unreachable!()
 1759 |         };
 1760 |         self.accept_page(loaded_page)
 1761 |     }
 1762 |     fn drain_batch(&mut self, num_rows: u64) -> Result<NextDecodeTask> {
 1763 |         self.drain_batch_task(num_rows)
 1764 |     }
 1765 |     fn wait(&mut self, _: u64, _: &tokio::runtime::Runtime) -> Result<()> {
 1766 |         // Waiting happens elsewhere (not as part of the decoder)
 1767 |         Ok(())
 1768 |     }
 1769 | }
 1770 | impl RootDecoderType for SimpleStructDecoder {
 1771 |     fn accept_message(&mut self, message: RootDecoderMessage) -> Result<()> {
 1772 |         let RootDecoderMessage::ArrayPage(array_page) = message else {
 1773 |             unreachable!()
 1774 |         };
 1775 |         self.accept_child(array_page)
 1776 |     }
 1777 |     fn drain_batch(&mut self, num_rows: u64) -> Result<NextDecodeTask> {
 1778 |         self.drain(num_rows)
 1779 |     }
 1780 |     fn wait(&mut self, loaded_need: u64, runtime: &tokio::runtime::Runtime) -> Result<()> {
 1781 |         runtime.block_on(self.wait_for_loaded(loaded_need))
 1782 |     }
 1783 |     fn max_rows_to_drain(&self, num_rows: u64, byte_budget: u64) -> Result<DrainLimit> {
 1784 |         if !has_i32_offsets(LogicalPageDecoder::data_type(self)) {
 1785 |             return Ok(DrainLimit {
 1786 |                 rows: num_rows,
 1787 |                 bytes: 0,
 1788 |             });
 1789 |         }
 1790 |         LogicalPageDecoder::max_rows_to_drain(self, num_rows, byte_budget)
 1791 |     }
 1792 | }
 1793 | 
 1794 | /// A blocking batch decoder that performs synchronous decoding
 1795 | struct BatchDecodeIterator<T: RootDecoderType> {
 1796 |     messages: VecDeque<Result<DecoderMessage>>,
 1797 |     root_decoder: T,
 1798 |     rows_remaining: u64,
 1799 |     rows_per_batch: u32,
 1800 |     rows_scheduled: u64,
 1801 |     rows_drained: u64,
 1802 |     emitted_batch_size_warning: Arc<Once>,
 1803 |     // Note: this is not the runtime on which I/O happens.
 1804 |     // That's always in the scheduler.  This is just a runtime we use to
 1805 |     // sleep the current thread if I/O is unready
 1806 |     wait_for_io_runtime: tokio::runtime::Runtime,
 1807 |     schema: Arc<ArrowSchema>,
 1808 | }
 1809 | 
 1810 | impl<T: RootDecoderType> BatchDecodeIterator<T> {
 1811 |     /// Create a new instance of a batch decode iterator
 1812 |     pub fn new(
 1813 |         messages: VecDeque<Result<DecoderMessage>>,
 1814 |         rows_per_batch: u32,
 1815 |         num_rows: u64,
 1816 |         root_decoder: T,
 1817 |         schema: Arc<ArrowSchema>,
 1818 |     ) -> Self {
 1819 |         Self {
 1820 |             messages,
 1821 |             root_decoder,
 1822 |             rows_remaining: num_rows,
 1823 |             rows_per_batch,
 1824 |             rows_scheduled: 0,
 1825 |             rows_drained: 0,
 1826 |             wait_for_io_runtime: tokio::runtime::Builder::new_current_thread()
 1827 |                 .build()
 1828 |                 .unwrap(),
 1829 |             emitted_batch_size_warning: Arc::new(Once::new()),
 1830 |             schema,
 1831 |         }
 1832 |     }
 1833 | 
 1834 |     /// Wait for a single page of data to finish loading
 1835 |     ///
 1836 |     /// If the data is not available this will perform a *blocking* wait (put
 1837 |     /// the current thread to sleep)
 1838 |     fn wait_for_page(&self, unloaded_page: UnloadedPageShard) -> Result<LoadedPageShard> {
 1839 |         match maybe_done(unloaded_page.0) {
 1840 |             // Fast path, avoid all runtime shenanigans if the data is ready
 1841 |             MaybeDone::Done(loaded_page) => loaded_page,
 1842 |             // Slow path, we need to wait on I/O, enter the runtime
 1843 |             MaybeDone::Future(fut) => self.wait_for_io_runtime.block_on(fut),
 1844 |             MaybeDone::Gone => unreachable!(),
 1845 |         }
 1846 |     }
 1847 | 
 1848 |     /// Waits for I/O until `scheduled_need` rows have been loaded
 1849 |     ///
 1850 |     /// Note that `scheduled_need` is cumulative.  E.g. this method
 1851 |     /// should be called with 5, 10, 15 and not 5, 5, 5
 1852 |     #[instrument(level = "debug", skip_all)]
 1853 |     fn wait_for_io(&mut self, scheduled_need: u64, to_take: u64) -> Result<u64> {
 1854 |         while self.rows_scheduled < scheduled_need && !self.messages.is_empty() {
 1855 |             let message = self.messages.pop_front().unwrap()?;
 1856 |             self.rows_scheduled = message.scheduled_so_far;
 1857 |             for decoder_message in message.decoders {
 1858 |                 match decoder_message {
 1859 |                     MessageType::UnloadedPage(unloaded_page) => {
 1860 |                         let loaded_page = self.wait_for_page(unloaded_page)?;
 1861 |                         self.root_decoder
 1862 |                             .accept_message(RootDecoderMessage::LoadedPage(loaded_page))?;
 1863 |                     }
 1864 |                     MessageType::DecoderReady(decoder_ready) => {
 1865 |                         // The root decoder we can ignore
 1866 |                         if !decoder_ready.path.is_empty() {
 1867 |                             self.root_decoder
 1868 |                                 .accept_message(RootDecoderMessage::ArrayPage(decoder_ready))?;
 1869 |                         }
 1870 |                     }
 1871 |                 }
 1872 |             }
 1873 |         }
 1874 | 
 1875 |         let loaded_need = self.rows_drained + to_take.min(self.rows_per_batch as u64) - 1;
 1876 | 
 1877 |         self.root_decoder
 1878 |             .wait(loaded_need, &self.wait_for_io_runtime)?;
 1879 |         Ok(self.rows_scheduled)
 1880 |     }
 1881 | 
 1882 |     #[instrument(level = "debug", skip_all)]
 1883 |     fn next_batch_task(&mut self) -> Result<Option<RecordBatch>> {
 1884 |         trace!(
 1885 |             "Draining batch task (rows_remaining={} rows_drained={} rows_scheduled={})",
 1886 |             self.rows_remaining, self.rows_drained, self.rows_scheduled,
 1887 |         );
 1888 |         if self.rows_remaining == 0 {
 1889 |             return Ok(None);
 1890 |         }
 1891 | 
 1892 |         let mut to_take = self.rows_remaining.min(self.rows_per_batch as u64);
 1893 |         self.rows_remaining -= to_take;
 1894 | 
 1895 |         let scheduled_need = (self.rows_drained + to_take).saturating_sub(self.rows_scheduled);
 1896 |         trace!(
 1897 |             "scheduled_need = {} because rows_drained = {} and to_take = {} and rows_scheduled = {}",
 1898 |             scheduled_need, self.rows_drained, to_take, self.rows_scheduled
 1899 |         );
 1900 |         if scheduled_need > 0 {
 1901 |             let desired_scheduled = scheduled_need + self.rows_scheduled;
 1902 |             trace!(
 1903 |                 "Draining from scheduler (desire at least {} scheduled rows)",
 1904 |                 desired_scheduled
 1905 |             );
 1906 |             let actually_scheduled = self.wait_for_io(desired_scheduled, to_take)?;
 1907 |             if actually_scheduled < desired_scheduled {
 1908 |                 let under_scheduled = desired_scheduled - actually_scheduled;
 1909 |                 to_take -= under_scheduled;
 1910 |             }
 1911 |         }
 1912 | 
 1913 |         if to_take == 0 {
 1914 |             return Ok(None);
 1915 |         }
 1916 | 
 1917 |         let limit = self
 1918 |             .root_decoder
 1919 |             .max_rows_to_drain(to_take, I32_OFFSET_BYTE_BUDGET)?;
 1920 |         let clamped = clamp_rows_to_i32_budget(limit, to_take);
 1921 |         self.rows_remaining += to_take - clamped;
 1922 |         to_take = clamped;
 1923 | 
 1924 |         let next_task = self.root_decoder.drain_batch(to_take)?;
 1925 | 
 1926 |         self.rows_drained += to_take;
 1927 | 
 1928 |         let (batch, _data_size) = next_task.into_batch(self.emitted_batch_size_warning.clone())?;
 1929 | 
 1930 |         Ok(Some(batch))
 1931 |     }
 1932 | }
 1933 | 
 1934 | impl<T: RootDecoderType> Iterator for BatchDecodeIterator<T> {
 1935 |     type Item = ArrowResult<RecordBatch>;
 1936 | 
 1937 |     fn next(&mut self) -> Option<Self::Item> {
 1938 |         let next = self.next_batch_task().transpose();
 1939 |         if let Some(Err(_)) = &next {
 1940 |             // Fuse after an error instead of re-attempting every remaining batch
 1941 |             self.rows_remaining = 0;
 1942 |         }
 1943 |         next.map(|r| r.map_err(ArrowError::from))
 1944 |     }
 1945 | }
 1946 | 
 1947 | impl<T: RootDecoderType> RecordBatchReader for BatchDecodeIterator<T> {
 1948 |     fn schema(&self) -> Arc<ArrowSchema> {
 1949 |         self.schema.clone()
 1950 |     }
 1951 | }
 1952 | 
 1953 | /// Estimate the number of bytes per row for a given Arrow data type.
 1954 | ///
 1955 | /// For fixed-width types this is exact. For variable-width types (strings,
 1956 | /// binary, lists) a rough default is used. The estimate is used as a
 1957 | /// starting point when `batch_size_bytes` is set; a post-decode feedback
 1958 | /// loop corrects it after the first batch.
 1959 | ///
 1960 | /// This estimate ignores validity bitmaps at the moment.  We can't infer
 1961 | /// their presence simply from the data_type and their impact is probably
 1962 | /// fairly negligible.
 1963 | /// Returns a schema-based estimate of the decoded bytes per row for `data_type`.
 1964 | ///
 1965 | /// Fixed-width types are exact. Variable-width types (strings, lists, etc.) use
 1966 | /// heuristic constants. This estimate is used both in batch-size planning and as
 1967 | /// a fallback for V1 files that lack structural decoders.
 1968 | pub fn estimate_bytes_per_row(data_type: &DataType) -> f64 {
 1969 |     if let Some(w) = data_type.byte_width_opt() {
 1970 |         return w as f64;
 1971 |     }
 1972 |     match data_type {
 1973 |         DataType::Boolean => 1.0 / 8.0,
 1974 |         DataType::Utf8 | DataType::Binary | DataType::LargeUtf8 | DataType::LargeBinary => 64.0,
 1975 |         DataType::Struct(fields) => fields
 1976 |             .iter()
 1977 |             .map(|f| estimate_bytes_per_row(f.data_type()))
 1978 |             .sum(),
 1979 |         DataType::List(child) | DataType::LargeList(child) => {
 1980 |             5.0 * estimate_bytes_per_row(child.data_type())
 1981 |         }
 1982 |         DataType::FixedSizeList(child, dim) => {
 1983 |             *dim as f64 * estimate_bytes_per_row(child.data_type())
 1984 |         }
 1985 |         DataType::Dictionary(_, value_type) => estimate_bytes_per_row(value_type),
 1986 |         DataType::Map(entries, _) => 5.0 * estimate_bytes_per_row(entries.data_type()),
 1987 |         _ => 64.0,
 1988 |     }
 1989 | }
 1990 | 
 1991 | /// A stream that takes scheduled jobs and generates decode tasks from them.
 1992 | pub struct StructuralBatchDecodeStream {
 1993 |     context: DecoderContext,
 1994 |     root_decoder: StructuralStructDecoder,
 1995 |     rows_remaining: u64,
 1996 |     rows_per_batch: u32,
 1997 |     rows_scheduled: u64,
 1998 |     rows_drained: u64,
 1999 |     scheduler_exhausted: bool,
 2000 |     emitted_batch_size_warning: Arc<Once>,
 2001 |     // Decode scheduling policy selected at planning time.
 2002 |     //
 2003 |     // Performance tradeoff:
 2004 |     // - true: spawn `into_batch` onto Tokio, which improves scan throughput by allowing
 2005 |     //   more decode parallelism.
 2006 |     // - false: run `into_batch` inline, which avoids Tokio scheduling overhead and is
 2007 |     //   typically better for point lookups / small takes.
 2008 |     spawn_batch_decode_tasks: bool,
 2009 |     /// If set, target this many bytes per batch while retaining `rows_per_batch`
 2010 |     /// as an independent upper bound.
 2011 |     batch_size_bytes: Option<u64>,
 2012 |     /// Schema-based estimate of bytes per row, computed once at construction.
 2013 |     /// Only meaningful when `batch_size_bytes` is `Some`.
 2014 |     schema_bytes_per_row: f64,
 2015 |     /// Post-decode feedback: actual bytes-per-row measured from the most
 2016 |     /// recently decoded batch.  Zero means no feedback yet (use schema estimate).
 2017 |     bytes_per_row_feedback: Arc<AtomicU64>,
 2018 | }
 2019 | 
 2020 | impl StructuralBatchDecodeStream {
 2021 |     /// Create a new instance of a batch decode stream
 2022 |     ///
 2023 |     /// # Arguments
 2024 |     ///
 2025 |     /// * `scheduled` - an incoming stream of decode tasks from a `DecodeBatchScheduler`
 2026 |     /// * `schema` - the schema of the data to create
 2027 |     /// * `rows_per_batch` the number of rows to create before making a batch
 2028 |     /// * `num_rows` the total number of rows scheduled
 2029 |     /// * `num_columns` the total number of columns in the file
 2030 |     pub fn new(
 2031 |         scheduled: mpsc::UnboundedReceiver<Result<DecoderMessage>>,
 2032 |         rows_per_batch: u32,
 2033 |         num_rows: u64,
 2034 |         root_decoder: StructuralStructDecoder,
 2035 |         spawn_batch_decode_tasks: bool,
 2036 |         batch_size_bytes: Option<u64>,
 2037 |     ) -> Self {
 2038 |         let schema_bytes_per_row = if batch_size_bytes.is_some() {
 2039 |             estimate_bytes_per_row(root_decoder.data_type()).max(1.0)
 2040 |         } else {
 2041 |             0.0
 2042 |         };
 2043 |         Self {
 2044 |             context: DecoderContext::new(scheduled),
 2045 |             root_decoder,
 2046 |             rows_remaining: num_rows,
 2047 |             rows_per_batch,
 2048 |             rows_scheduled: 0,
 2049 |             rows_drained: 0,
 2050 |             scheduler_exhausted: false,
 2051 |             emitted_batch_size_warning: Arc::new(Once::new()),
 2052 |             spawn_batch_decode_tasks,
 2053 |             batch_size_bytes,
 2054 |             schema_bytes_per_row,
 2055 |             bytes_per_row_feedback: Arc::new(AtomicU64::new(0)),
 2056 |         }
 2057 |     }
 2058 | 
 2059 |     #[instrument(level = "debug", skip_all)]
 2060 |     async fn wait_for_scheduled(&mut self, scheduled_need: u64) -> Result<u64> {
 2061 |         if self.scheduler_exhausted {
 2062 |             return Ok(self.rows_scheduled);
 2063 |         }
 2064 |         while self.rows_scheduled < scheduled_need {
 2065 |             let next_message = self.context.source.recv().await;
 2066 |             match next_message {
 2067 |                 Some(scan_line) => {
 2068 |                     let scan_line = scan_line?;
 2069 |                     self.rows_scheduled = scan_line.scheduled_so_far;
 2070 |                     for message in scan_line.decoders {
 2071 |                         let unloaded_page = message.into_structural();
 2072 |                         let loaded_page = unloaded_page.0.await?;
 2073 |                         self.root_decoder.accept_page(loaded_page)?;
 2074 |                     }
 2075 |                 }
 2076 |                 None => {
 2077 |                     // Schedule ended before we got all the data we expected.  This probably
 2078 |                     // means some kind of pushdown filter was applied and we didn't load as
 2079 |                     // much data as we thought we would.
 2080 |                     self.scheduler_exhausted = true;
 2081 |                     return Ok(self.rows_scheduled);
 2082 |                 }
 2083 |             }
 2084 |         }
 2085 |         Ok(scheduled_need)
 2086 |     }
 2087 | 
 2088 |     #[instrument(level = "debug", skip_all)]
 2089 |     async fn next_batch_task(&mut self) -> Result<Option<NextDecodeTask>> {
 2090 |         trace!(
 2091 |             "Draining batch task (rows_remaining={} rows_drained={} rows_scheduled={})",
 2092 |             self.rows_remaining, self.rows_drained, self.rows_scheduled,
 2093 |         );
 2094 |         if self.rows_remaining == 0 {
 2095 |             return Ok(None);
 2096 |         }
 2097 | 
 2098 |         let row_limit = self.rows_remaining.min(self.rows_per_batch as u64);
 2099 |         let mut to_take = if let Some(batch_size_bytes) = self.batch_size_bytes {
 2100 |             let feedback = self.bytes_per_row_feedback.load(Ordering::Relaxed);
 2101 |             let bpr = if feedback > 0 {
 2102 |                 feedback as f64
 2103 |             } else {
 2104 |                 self.schema_bytes_per_row
 2105 |             };
 2106 |             let rows = (batch_size_bytes as f64 / bpr) as u64;
 2107 |             row_limit.min(rows.max(1))
 2108 |         } else {
 2109 |             row_limit
 2110 |         };
 2111 |         self.rows_remaining -= to_take;
 2112 | 
 2113 |         let scheduled_need = (self.rows_drained + to_take).saturating_sub(self.rows_scheduled);
 2114 |         trace!(
 2115 |             "scheduled_need = {} because rows_drained = {} and to_take = {} and rows_scheduled = {}",
 2116 |             scheduled_need, self.rows_drained, to_take, self.rows_scheduled
 2117 |         );
 2118 |         if scheduled_need > 0 {
 2119 |             let desired_scheduled = scheduled_need + self.rows_scheduled;
 2120 |             trace!(
 2121 |                 "Draining from scheduler (desire at least {} scheduled rows)",
 2122 |                 desired_scheduled
 2123 |             );
 2124 |             let actually_scheduled = self.wait_for_scheduled(desired_scheduled).await?;
 2125 |             if actually_scheduled < desired_scheduled {
 2126 |                 let under_scheduled = desired_scheduled - actually_scheduled;
 2127 |                 to_take -= under_scheduled;
 2128 |             }
 2129 |         }
 2130 | 
 2131 |         if to_take == 0 {
 2132 |             return Ok(None);
 2133 |         }
 2134 | 
 2135 |         let next_task = self.root_decoder.drain_batch_task(to_take)?;
 2136 |         self.rows_drained += to_take;
 2137 |         Ok(Some(next_task))
 2138 |     }
 2139 | 
 2140 |     pub fn into_stream(self) -> BoxStream<'static, ReadBatchTask> {
 2141 |         let stream = futures::stream::unfold(self, |mut slf| async move {
 2142 |             let next_task = match slf.next_batch_task().await {
 2143 |                 Ok(Some(next_task)) => next_task,
 2144 |                 Ok(None) => return None,
 2145 |                 Err(err) => {
 2146 |                     slf.rows_remaining = 0;
 2147 |                     return Some((
 2148 |                         ReadBatchTask {
 2149 |                             task: async move { Err(err) }.boxed(),
 2150 |                             num_rows: 0,
 2151 |                         },
 2152 |                         slf,
 2153 |                     ));
 2154 |                 }
 2155 |             };
 2156 |             let num_rows = next_task.num_rows;
 2157 |             let emitted_batch_size_warning = slf.emitted_batch_size_warning.clone();
 2158 |             let bytes_per_row_feedback = slf.bytes_per_row_feedback.clone();
 2159 |             // Capture the per-stream policy once so every emitted batch task follows the
 2160 |             // same throughput-vs-overhead choice made by the scheduler.
 2161 |             let spawn_batch_decode_tasks = slf.spawn_batch_decode_tasks;
 2162 |             let task = async move {
 2163 |                 let (batch, data_size) = if spawn_batch_decode_tasks {
 2164 |                     tokio::spawn(async move { next_task.into_batch(emitted_batch_size_warning) })
 2165 |                         .await
 2166 |                         .map_err(|err| Error::wrapped(err.into()))??
 2167 |                 } else {
 2168 |                     next_task.into_batch(emitted_batch_size_warning)?
 2169 |                 };
 2170 |                 let num_rows = batch.num_rows() as u64;
 2171 |                 if let Some(bpr) = data_size.checked_div(num_rows) {
 2172 |                     let prev = bytes_per_row_feedback.load(Ordering::Relaxed);
 2173 |                     let next = if prev == 0 || bpr >= prev {
 2174 |                         // First batch or actual size is larger than estimate:
 2175 |                         // adopt immediately to avoid OOM.
 2176 |                         bpr
 2177 |                     } else {
 2178 |                         // Actual size is smaller: degrade gradually toward
 2179 |                         // the true value to avoid over-correcting on a
 2180 |                         // single anomalous batch.
 2181 |                         (prev + bpr) / 2
 2182 |                     };
 2183 |                     bytes_per_row_feedback.store(next.max(1), Ordering::Relaxed);
 2184 |                 }
 2185 |                 Ok(batch)
 2186 |             };
 2187 |             // This should be true since batch size is u32
 2188 |             debug_assert!(num_rows <= u32::MAX as u64);
 2189 |             Some((
 2190 |                 ReadBatchTask {
 2191 |                     task: task.boxed(),
 2192 |                     num_rows: num_rows as u32,
 2193 |                 },
 2194 |                 slf,
 2195 |             ))
 2196 |         });
 2197 |         stream.boxed()
 2198 |     }
 2199 | }
 2200 | 
 2201 | #[derive(Debug)]
 2202 | pub enum RequestedRows {
 2203 |     Ranges(Vec<Range<u64>>),
 2204 |     Indices(Vec<u64>),
 2205 | }
 2206 | 
 2207 | impl RequestedRows {
 2208 |     pub fn num_rows(&self) -> u64 {
 2209 |         match self {
 2210 |             Self::Ranges(ranges) => ranges.iter().map(|r| r.end - r.start).sum(),
 2211 |             Self::Indices(indices) => indices.len() as u64,
 2212 |         }
 2213 |     }
 2214 | 
 2215 |     pub fn trim_empty_ranges(mut self) -> Self {
 2216 |         if let Self::Ranges(ranges) = &mut self {
 2217 |             ranges.retain(|r| !r.is_empty());
 2218 |         }
 2219 |         self
 2220 |     }
 2221 | 
 2222 |     fn into_ranges(self) -> Result<Vec<Range<u64>>> {
 2223 |         match self {
 2224 |             Self::Ranges(ranges) => Ok(ranges),
 2225 |             Self::Indices(indices) => Self::indices_to_ranges(&indices),
 2226 |         }
 2227 |     }
 2228 | 
 2229 |     // coalesce continuous indices if possible (the input indices must be sorted)
 2230 |     fn indices_to_ranges(indices: &[u64]) -> Result<Vec<Range<u64>>> {
 2231 |         if indices.is_empty() {
 2232 |             return Ok(Vec::new());
 2233 |         }
 2234 | 
 2235 |         let mut ranges = Vec::with_capacity(indices.len());
 2236 |         let mut start = indices[0];
 2237 | 
 2238 |         for (index, pair) in indices.windows(2).enumerate() {
 2239 |             if pair[0] >= pair[1] {
 2240 |                 return Err(Error::invalid_input(format!(
 2241 |                     "Requested row indices are not strictly increasing at index {index}: {} then {}",
 2242 |                     pair[0], pair[1]
 2243 |                 )));
 2244 |             }
 2245 |             let end = pair[0]
 2246 |                 .checked_add(1)
 2247 |                 .ok_or_else(|| Error::invalid_input("Requested row index cannot equal u64::MAX"))?;
 2248 |             if pair[1] != end {
 2249 |                 ranges.push(start..end);
 2250 |                 start = pair[1];
 2251 |             }
 2252 |         }
 2253 | 
 2254 |         let end = indices
 2255 |             .last()
 2256 |             .copied()
 2257 |             .and_then(|index| index.checked_add(1))
 2258 |             .ok_or_else(|| Error::invalid_input("Requested row index cannot equal u64::MAX"))?;
 2259 |         ranges.push(start..end);
 2260 |         Ok(ranges)
 2261 |     }
 2262 | }
 2263 | 
 2264 | /// Configuration for decoder behavior
 2265 | #[derive(Debug, Clone)]
 2266 | pub struct DecoderConfig {
 2267 |     /// Whether to cache repetition indices for better performance.
 2268 |     ///
 2269 |     /// This defaults to the `LANCE_READ_CACHE_REPETITION_INDEX` environment variable
 2270 |     /// when present and is enabled by default. Set the env var to a non-truthy
 2271 |     /// value (for example `0` or `false`) to disable it. The env var is read
 2272 |     /// once per process.
 2273 |     pub cache_repetition_index: bool,
 2274 |     /// Whether to validate decoded data
 2275 |     pub validate_on_decode: bool,
 2276 |     /// Override the strategy used to dispatch the scheduling work in
 2277 |     /// [`schedule_and_decode`].
 2278 |     ///
 2279 |     /// `schedule_and_decode` always awaits the scheduler's `initialize` (which
 2280 |     /// performs metadata I/O) before returning.  This flag controls what
 2281 |     /// happens with the subsequent (synchronous) work of pushing decoder
 2282 |     /// messages into the channel that feeds the decode stream.
 2283 |     ///
 2284 |     /// * `None` - default behavior: the scheduling work runs inline (as part
 2285 |     ///   of the `schedule_and_decode` await) when the request is small
 2286 |     ///   (controlled by the `LANCE_INLINE_SCHEDULING_THRESHOLD` env var) and
 2287 |     ///   is dispatched onto a spawned task otherwise.
 2288 |     /// * `Some(true)` - always run scheduling inline.  The await of
 2289 |     ///   `schedule_and_decode` does not return until every decoder message
 2290 |     ///   has been queued.
 2291 |     /// * `Some(false)` - always spawn a task for scheduling so that it can
 2292 |     ///   overlap with consumption of the decode stream.
 2293 |     pub inline_scheduling: Option<bool>,
 2294 | }
 2295 | 
 2296 | impl Default for DecoderConfig {
 2297 |     fn default() -> Self {
 2298 |         Self {
 2299 |             cache_repetition_index: default_cache_repetition_index(),
 2300 |             validate_on_decode: false,
 2301 |             inline_scheduling: None,
 2302 |         }
 2303 |     }
 2304 | }
 2305 | 
 2306 | #[derive(Debug, Clone)]
 2307 | pub struct SchedulerDecoderConfig {
 2308 |     pub decoder_plugins: Arc<DecoderPlugins>,
 2309 |     pub batch_size: u32,
 2310 |     pub io: Arc<dyn EncodingsIo>,
 2311 |     pub cache: Arc<LanceCache>,
 2312 |     /// Decoder configuration
 2313 |     pub decoder_config: DecoderConfig,
 2314 |     /// If set, target this many bytes per batch while retaining `batch_size` as
 2315 |     /// an independent row-count upper bound.
 2316 |     ///
 2317 |     /// Only supported for v2.1+ (structural) files. For v2.0 files this
 2318 |     /// option is ignored and a warning is logged.
 2319 |     pub batch_size_bytes: Option<u64>,
 2320 | }
 2321 | 
 2322 | fn check_scheduler_on_drop(
 2323 |     stream: BoxStream<'static, ReadBatchTask>,
 2324 |     scheduler_handle: tokio::task::JoinHandle<()>,
 2325 | ) -> BoxStream<'static, ReadBatchTask> {
 2326 |     // This is a bit weird but we create an "empty stream" that unwraps the scheduler handle (which
 2327 |     // will panic if the scheduler panicked).  This let's us check if the scheduler panicked
 2328 |     // when the stream finishes.
 2329 |     let abort_handle = scheduler_handle.abort_handle();
 2330 |     let mut scheduler_handle = Some(scheduler_handle);
 2331 |     let check_scheduler = stream::unfold((), move |_| {
 2332 |         let handle = scheduler_handle.take();
 2333 |         async move {
 2334 |             if let Some(handle) = handle {
 2335 |                 handle.await.unwrap();
 2336 |             }
 2337 |             None
 2338 |         }
 2339 |     });
 2340 |     stream
 2341 |         .chain(check_scheduler)
 2342 |         .on_drop(move || {
 2343 |             // Abort the scheduler task on early drop. The scheduler task holds
 2344 |             // a reference to the I/O scheduler (via config.io) which keeps the
 2345 |             // ScanScheduler alive. If the scheduler task is stuck waiting for
 2346 |             // initialization I/O (which is blocked on backpressure that will
 2347 |             // never drain because no one is consuming the stream), we need to
 2348 |             // abort it so it releases its I/O reference and allows the
 2349 |             // ScanScheduler to drop and cancel pending I/O.
 2350 |             abort_handle.abort();
 2351 |         })
 2352 |         .boxed()
 2353 | }
 2354 | 
 2355 | #[allow(clippy::too_many_arguments)]
 2356 | pub fn create_decode_stream(
 2357 |     schema: &Schema,
 2358 |     num_rows: u64,
 2359 |     batch_size: u32,
 2360 |     is_structural: bool,
 2361 |     should_validate: bool,
 2362 |     spawn_structural_batch_decode_tasks: bool,
 2363 |     rx: mpsc::UnboundedReceiver<Result<DecoderMessage>>,
 2364 |     batch_size_bytes: Option<u64>,
 2365 | ) -> Result<BoxStream<'static, ReadBatchTask>> {
 2366 |     create_decode_stream_with_i32_offset_limit(
 2367 |         schema,
 2368 |         num_rows,
 2369 |         batch_size,
 2370 |         is_structural,
 2371 |         should_validate,
 2372 |         spawn_structural_batch_decode_tasks,
 2373 |         rx,
 2374 |         batch_size_bytes,
 2375 |         true,
 2376 |     )
 2377 | }
 2378 | 
 2379 | #[allow(clippy::too_many_arguments)]
 2380 | fn create_decode_stream_with_i32_offset_limit(
 2381 |     schema: &Schema,
 2382 |     num_rows: u64,
 2383 |     batch_size: u32,
 2384 |     is_structural: bool,
 2385 |     should_validate: bool,
 2386 |     spawn_structural_batch_decode_tasks: bool,
 2387 |     rx: mpsc::UnboundedReceiver<Result<DecoderMessage>>,
 2388 |     batch_size_bytes: Option<u64>,
 2389 |     limit_i32_offset_batch_size: bool,
 2390 | ) -> Result<BoxStream<'static, ReadBatchTask>> {
 2391 |     if is_structural {
 2392 |         let arrow_schema = ArrowSchema::from(schema);
 2393 |         let structural_decoder = StructuralStructDecoder::new(
 2394 |             arrow_schema.fields,
 2395 |             should_validate,
 2396 |             /*is_root=*/ true,
 2397 |             /*nullable=*/ false,
 2398 |         )?;
 2399 |         Ok(StructuralBatchDecodeStream::new(
 2400 |             rx,
 2401 |             batch_size,
 2402 |             num_rows,
 2403 |             structural_decoder,
 2404 |             spawn_structural_batch_decode_tasks,
 2405 |             batch_size_bytes,
 2406 |         )
 2407 |         .into_stream())
 2408 |     } else {
 2409 |         if batch_size_bytes.is_some() {
 2410 |             warn!("batch_size_bytes is not supported for v2.0 files and will be ignored");
 2411 |         }
 2412 |         let arrow_schema = ArrowSchema::from(schema);
 2413 |         let root_fields = arrow_schema.fields;
 2414 | 
 2415 |         let simple_struct_decoder = SimpleStructDecoder::new(root_fields, num_rows);
 2416 |         Ok(BatchDecodeStream::new_with_i32_offset_limit(
 2417 |             rx,
 2418 |             batch_size,
 2419 |             num_rows,
 2420 |             simple_struct_decoder,
 2421 |             limit_i32_offset_batch_size,
 2422 |         )
 2423 |         .into_stream())
 2424 |     }
 2425 | }
 2426 | 
 2427 | /// Creates a iterator that decodes a set of messages in a blocking fashion
 2428 | ///
 2429 | /// See [`schedule_and_decode_blocking`] for more information.
 2430 | pub fn create_decode_iterator(
 2431 |     schema: &Schema,
 2432 |     num_rows: u64,
 2433 |     batch_size: u32,
 2434 |     should_validate: bool,
 2435 |     is_structural: bool,
 2436 |     messages: VecDeque<Result<DecoderMessage>>,
 2437 | ) -> Result<Box<dyn RecordBatchReader + Send + 'static>> {
 2438 |     let arrow_schema = Arc::new(ArrowSchema::from(schema));
 2439 |     let root_fields = arrow_schema.fields.clone();
 2440 |     if is_structural {
 2441 |         let simple_struct_decoder = StructuralStructDecoder::new(
 2442 |             root_fields,
 2443 |             should_validate,
 2444 |             /*is_root=*/ true,
 2445 |             /*nullable=*/ false,
 2446 |         )?;
 2447 |         Ok(Box::new(BatchDecodeIterator::new(
 2448 |             messages,
 2449 |             batch_size,
 2450 |             num_rows,
 2451 |             simple_struct_decoder,
 2452 |             arrow_schema,
 2453 |         )))
 2454 |     } else {
 2455 |         let root_decoder = SimpleStructDecoder::new(root_fields, num_rows);
 2456 |         Ok(Box::new(BatchDecodeIterator::new(
 2457 |             messages,
 2458 |             batch_size,
 2459 |             num_rows,
 2460 |             root_decoder,
 2461 |             arrow_schema,
 2462 |         )))
 2463 |     }
 2464 | }
 2465 | 
 2466 | async fn create_scheduler_decoder(
 2467 |     column_infos: Vec<Arc<ColumnInfo>>,
 2468 |     requested_rows: RequestedRows,
 2469 |     filter: FilterExpression,
 2470 |     column_indices: Vec<u32>,
 2471 |     target_schema: Arc<Schema>,
 2472 |     config: SchedulerDecoderConfig,
 2473 | ) -> Result<BoxStream<'static, ReadBatchTask>> {
 2474 |     let num_rows = requested_rows.num_rows();
 2475 |     let is_range_request = matches!(&requested_rows, RequestedRows::Ranges(_));
 2476 | 
 2477 |     let is_structural = column_infos[0].is_structural();
 2478 |     let mode = std::env::var(ENV_LANCE_STRUCTURAL_BATCH_DECODE_SPAWN_MODE);
 2479 |     let spawn_structural_batch_decode_tasks = match mode.ok().as_deref() {
 2480 |         Some("always") => true,
 2481 |         Some("never") => false,
 2482 |         _ => is_range_request,
 2483 |     };
 2484 | 
 2485 |     let (tx, rx) = mpsc::unbounded_channel();
 2486 | 
 2487 |     let decode_stream = create_decode_stream(
 2488 |         &target_schema,
 2489 |         num_rows,
 2490 |         config.batch_size,
 2491 |         is_structural,
 2492 |         config.decoder_config.validate_on_decode,
 2493 |         spawn_structural_batch_decode_tasks,
 2494 |         rx,
 2495 |         config.batch_size_bytes,
 2496 |     )?;
 2497 | 
 2498 |     // The scheduler's `initialize` may perform I/O to load column metadata
 2499 |     // unless that metadata is already in the cache.  This metadata loading
 2500 |     // happens as part of this call and should be parallelized if reading
 2501 |     // multiple files.  We pass the rows we are about to schedule so that the
 2502 |     // structural path only initializes the pages those rows touch.
 2503 |     let requested_ranges = requested_rows.into_ranges()?;
 2504 |     let mut decode_scheduler = DecodeBatchScheduler::try_new_with_ranges(
 2505 |         target_schema.as_ref(),
 2506 |         &column_indices,
 2507 |         &column_infos,
 2508 |         &vec![],
 2509 |         num_rows,
 2510 |         config.decoder_plugins,
 2511 |         config.io.clone(),
 2512 |         config.cache,
 2513 |         Some(&requested_ranges),
 2514 |         &filter,
 2515 |         &config.decoder_config,
 2516 |     )
 2517 |     .await?;
 2518 | 
 2519 |     // For small requests the scheduling cost is dwarfed by the overhead of
 2520 |     // spawning a task, so we run scheduling inline (still as part of this
 2521 |     // await) before returning.  The threshold is configurable via
 2522 |     // `LANCE_INLINE_SCHEDULING_THRESHOLD`, and callers can force either
 2523 |     // strategy via `DecoderConfig::inline_scheduling`.
 2524 |     let inline_scheduling = config
 2525 |         .decoder_config
 2526 |         .inline_scheduling
 2527 |         .unwrap_or_else(|| num_rows <= inline_scheduling_threshold());
 2528 | 
 2529 |     if inline_scheduling {
 2530 |         decode_scheduler.schedule_ranges(&requested_ranges, &filter, tx, config.io);
 2531 |         Ok(decode_stream)
 2532 |     } else {
 2533 |         // Spawn the (still synchronous) scheduling work so that decoder
 2534 |         // messages can stream into the channel while the consumer is
 2535 |         // already pulling from the decode stream.
 2536 |         let scheduling = async move {
 2537 |             decode_scheduler.schedule_ranges(&requested_ranges, &filter, tx, config.io)
 2538 |         };
 2539 |         let scheduler_handle = tokio::task::spawn(scheduling);
 2540 |         Ok(check_scheduler_on_drop(decode_stream, scheduler_handle))
 2541 |     }
 2542 | }
 2543 | 
 2544 | /// Initializes the scheduler, schedules the requested rows, and returns a
 2545 | /// stream of decode tasks for the resulting batches.
 2546 | ///
 2547 | /// This is a convenience function that creates both the scheduler and the
 2548 | /// decoder, which can be a little tricky to get right.
 2549 | ///
 2550 | /// # Why is this async?
 2551 | ///
 2552 | /// Constructing the scheduler runs `initialize` which will perform I/O
 2553 | /// unless the data required is already in the file metadata cache.
 2554 | ///
 2555 | /// When `DecoderConfig::inline_scheduling` resolves to `true`, the
 2556 | /// subsequent (synchronous) scheduling work also runs before this function
 2557 | /// returns, leaving a fully primed decode stream.
 2558 | pub async fn schedule_and_decode(
 2559 |     column_infos: Vec<Arc<ColumnInfo>>,
 2560 |     requested_rows: RequestedRows,
 2561 |     filter: FilterExpression,
 2562 |     column_indices: Vec<u32>,
 2563 |     target_schema: Arc<Schema>,
 2564 |     config: SchedulerDecoderConfig,
 2565 | ) -> Result<BoxStream<'static, ReadBatchTask>> {
 2566 |     if requested_rows.num_rows() == 0 {
 2567 |         return Ok(stream::empty().boxed());
 2568 |     }
 2569 | 
 2570 |     // If the user requested any ranges that are empty, ignore them.  They are pointless and
 2571 |     // trying to read them has caused bugs in the past.
 2572 |     let requested_rows = requested_rows.trim_empty_ranges();
 2573 | 
 2574 |     let io = config.io.clone();
 2575 | 
 2576 |     let stream = create_scheduler_decoder(
 2577 |         column_infos,
 2578 |         requested_rows,
 2579 |         filter,
 2580 |         column_indices,
 2581 |         target_schema,
 2582 |         config,
 2583 |     )
 2584 |     .await?;
 2585 | 
 2586 |     // Keep the io alive until the stream is dropped or finishes.  Otherwise the
 2587 |     // I/O drops as soon as the scheduling is finished and the I/O loop terminates.
 2588 |     Ok(stream.finally(move || drop(io)).boxed())
 2589 | }
 2590 | 
 2591 | pub static WAITER_RT: LazyLock<tokio::runtime::Runtime> = LazyLock::new(|| {
 2592 |     tokio::runtime::Builder::new_current_thread()
 2593 |         .build()
 2594 |         .unwrap()
 2595 | });
 2596 | 
 2597 | /// Schedules and decodes the requested data in a blocking fashion
 2598 | ///
 2599 | /// This function is a blocking version of [`schedule_and_decode`]. It schedules the requested data
 2600 | /// and decodes it in the current thread.
 2601 | ///
 2602 | /// This can be useful when the disk is fast (or the data is in memory) and the amount
 2603 | /// of data is relatively small.  For example, when doing a take against NVMe or in-memory data.
 2604 | ///
 2605 | /// This should NOT be used for full scans.  Even if the data is in memory this function will
 2606 | /// not parallelize the decode and will be slower than the async version.  Full scans typically
 2607 | /// make relatively few IOPs and so the asynchronous overhead is much smaller.
 2608 | ///
 2609 | /// This method will first completely run the scheduling process.  Then it will run the
 2610 | /// decode process.
 2611 | pub fn schedule_and_decode_blocking(
 2612 |     column_infos: Vec<Arc<ColumnInfo>>,
 2613 |     requested_rows: RequestedRows,
 2614 |     filter: FilterExpression,
 2615 |     column_indices: Vec<u32>,
 2616 |     target_schema: Arc<Schema>,
 2617 |     config: SchedulerDecoderConfig,
 2618 | ) -> Result<Box<dyn RecordBatchReader + Send + 'static>> {
 2619 |     if requested_rows.num_rows() == 0 {
 2620 |         let arrow_schema = Arc::new(ArrowSchema::from(target_schema.as_ref()));
 2621 |         return Ok(Box::new(RecordBatchIterator::new(vec![], arrow_schema)));
 2622 |     }
 2623 | 
 2624 |     let requested_rows = requested_rows.trim_empty_ranges();
 2625 |     let num_rows = requested_rows.num_rows();
 2626 |     let is_structural = column_infos[0].is_structural();
 2627 | 
 2628 |     let (tx, mut rx) = mpsc::unbounded_channel();
 2629 | 
 2630 |     // Initialize the scheduler.  This is still "asynchronous" but we run it with a current-thread
 2631 |     // runtime.  Pass the rows we are about to schedule so the structural path
 2632 |     // only initializes the pages those rows touch.
 2633 |     let requested_ranges = requested_rows.into_ranges()?;
 2634 |     let mut decode_scheduler = WAITER_RT.block_on(DecodeBatchScheduler::try_new_with_ranges(
 2635 |         target_schema.as_ref(),
 2636 |         &column_indices,
 2637 |         &column_infos,
 2638 |         &vec![],
 2639 |         num_rows,
 2640 |         config.decoder_plugins,
 2641 |         config.io.clone(),
 2642 |         config.cache,
 2643 |         Some(&requested_ranges),
 2644 |         &filter,
 2645 |         &config.decoder_config,
 2646 |     ))?;
 2647 | 
 2648 |     // Schedule the requested rows
 2649 |     decode_scheduler.schedule_ranges(&requested_ranges, &filter, tx, config.io);
 2650 | 
 2651 |     // Drain the scheduler queue into a vec of decode messages
 2652 |     let mut messages = Vec::new();
 2653 |     while rx
 2654 |         .recv_many(&mut messages, usize::MAX)
 2655 |         .now_or_never()
 2656 |         .unwrap()
 2657 |         != 0
 2658 |     {}
 2659 | 
 2660 |     // Create a decoder to decode the messages
 2661 |     let decode_iterator = create_decode_iterator(
 2662 |         &target_schema,
 2663 |         num_rows,
 2664 |         config.batch_size,
 2665 |         config.decoder_config.validate_on_decode,
 2666 |         is_structural,
 2667 |         messages.into(),
 2668 |     )?;
 2669 | 
 2670 |     Ok(decode_iterator)
 2671 | }
 2672 | 
 2673 | /// A decoder for single-column encodings of primitive data (this includes fixed size
 2674 | /// lists of primitive data)
 2675 | ///
 2676 | /// Physical decoders are able to decode into existing buffers for zero-copy operation.
 2677 | ///
 2678 | /// Instances should be stateless and `Send` / `Sync`.  This is because multiple decode
 2679 | /// tasks could reference the same page.  For example, imagine a page covers rows 0-2000
 2680 | /// and the decoder stream has a batch size of 1024.  The decoder will be needed by both
 2681 | /// the decode task for batch 0 and the decode task for batch 1.
 2682 | ///
 2683 | /// See [`crate::decoder`] for more information
 2684 | pub trait PrimitivePageDecoder: Send + Sync {
 2685 |     /// Decode data into buffers
 2686 |     ///
 2687 |     /// This may be a simple zero-copy from a disk buffer or could involve complex decoding
 2688 |     /// such as decompressing from some compressed representation.
 2689 |     ///
 2690 |     /// Capacity is stored as a tuple of (num_bytes: u64, is_needed: bool).  The `is_needed`
 2691 |     /// portion only needs to be updated if the encoding has some concept of an "optional"
 2692 |     /// buffer.
 2693 |     ///
 2694 |     /// Encodings can have any number of input or output buffers.  For example, a dictionary
 2695 |     /// decoding will convert two buffers (indices + dictionary) into a single buffer
 2696 |     ///
 2697 |     /// Binary decodings have two output buffers (one for values, one for offsets)
 2698 |     ///
 2699 |     /// Other decodings could even expand the # of output buffers.  For example, we could decode
 2700 |     /// fixed size strings into variable length strings going from one input buffer to multiple output
 2701 |     /// buffers.
 2702 |     ///
 2703 |     /// Each Arrow data type typically has a fixed structure of buffers and the encoding chain will
 2704 |     /// generally end at one of these structures.  However, intermediate structures may exist which
 2705 |     /// do not correspond to any Arrow type at all.  For example, a bitpacking encoding will deal
 2706 |     /// with buffers that have bits-per-value that is not a multiple of 8.
 2707 |     ///
 2708 |     /// The `primitive_array_from_buffers` method has an expected buffer layout for each arrow
 2709 |     /// type (order matters) and encodings that aim to decode into arrow types should respect
 2710 |     /// this layout.
 2711 |     /// # Arguments
 2712 |     ///
 2713 |     /// * `rows_to_skip` - how many rows to skip (within the page) before decoding
 2714 |     /// * `num_rows` - how many rows to decode
 2715 |     /// * `all_null` - A mutable bool, set to true if a decoder determines all values are null
 2716 |     fn decode(&self, rows_to_skip: u64, num_rows: u64) -> Result<DataBlock>;
 2717 | 
 2718 |     /// Returns the variable-width **value** bytes (the bytes an offsets buffer
 2719 |     /// indexes into) that decoding `num_rows` rows starting at `rows_to_skip`
 2720 |     /// will produce, or `None` when the encoding cannot report sizes without
 2721 |     /// decoding.  An upper bound is acceptable; callers use this to keep i32
 2722 |     /// offset values within capacity, so over-estimating only splits batches
 2723 |     /// earlier while under-estimating would let them overflow.
 2724 |     fn variable_width_bytes(&self, _rows_to_skip: u64, _num_rows: u64) -> Result<Option<u64>> {
 2725 |         Ok(None)
 2726 |     }
 2727 | }
 2728 | 
 2729 | /// A scheduler for single-column encodings of primitive data
 2730 | ///
 2731 | /// The scheduler is responsible for calculating what I/O is needed for the requested rows
 2732 | ///
 2733 | /// Instances should be stateless and `Send` and `Sync`.  This is because instances can
 2734 | /// be shared in follow-up I/O tasks.
 2735 | ///
 2736 | /// See [`crate::decoder`] for more information
 2737 | pub trait PageScheduler: Send + Sync + std::fmt::Debug {
 2738 |     /// Schedules a batch of I/O to load the data needed for the requested ranges
 2739 |     ///
 2740 |     /// Returns a future that will yield a decoder once the data has been loaded
 2741 |     ///
 2742 |     /// # Arguments
 2743 |     ///
 2744 |     /// * `range` - the range of row offsets (relative to start of page) requested
 2745 |     ///   these must be ordered and must not overlap
 2746 |     /// * `scheduler` - a scheduler to submit the I/O request to
 2747 |     /// * `top_level_row` - the row offset of the top level field currently being
 2748 |     ///   scheduled.  This can be used to assign priority to I/O requests
 2749 |     fn schedule_ranges(
 2750 |         &self,
 2751 |         ranges: &[Range<u64>],
 2752 |         scheduler: &Arc<dyn EncodingsIo>,
 2753 |         top_level_row: u64,
 2754 |     ) -> BoxFuture<'static, Result<Box<dyn PrimitivePageDecoder>>>;
 2755 | }
 2756 | 
 2757 | /// A trait to control the priority of I/O
 2758 | pub trait PriorityRange: std::fmt::Debug + Send + Sync {
 2759 |     fn advance(&mut self, num_rows: u64);
 2760 |     fn current_priority(&self) -> u64;
 2761 |     fn box_clone(&self) -> Box<dyn PriorityRange>;
 2762 | }
 2763 | 
 2764 | /// A simple priority scheme for top-level fields with no parent
 2765 | /// repetition
 2766 | #[derive(Debug)]
 2767 | pub struct SimplePriorityRange {
 2768 |     priority: u64,
 2769 | }
 2770 | 
 2771 | impl SimplePriorityRange {
 2772 |     fn new(priority: u64) -> Self {
 2773 |         Self { priority }
 2774 |     }
 2775 | }
 2776 | 
 2777 | impl PriorityRange for SimplePriorityRange {
 2778 |     fn advance(&mut self, num_rows: u64) {
 2779 |         self.priority += num_rows;
 2780 |     }
 2781 | 
 2782 |     fn current_priority(&self) -> u64 {
 2783 |         self.priority
 2784 |     }
 2785 | 
 2786 |     fn box_clone(&self) -> Box<dyn PriorityRange> {
 2787 |         Box::new(Self {
 2788 |             priority: self.priority,
 2789 |         })
 2790 |     }
 2791 | }
 2792 | 
 2793 | /// Determining the priority of a list request is tricky.  We want
 2794 | /// the priority to be the top-level row.  So if we have a
 2795 | /// `list<list<int>>` and each outer list has 10 rows and each inner
 2796 | /// list has 5 rows then the priority of the 100th item is 1 because
 2797 | /// it is the 5th item in the 10th item of the *second* row.
 2798 | ///
 2799 | /// This structure allows us to keep track of this complicated priority
 2800 | /// relationship.
 2801 | ///
 2802 | /// There's a fair amount of bookkeeping involved here.
 2803 | ///
 2804 | /// A better approach (using repetition levels) is coming in the future.
 2805 | pub struct ListPriorityRange {
 2806 |     base: Box<dyn PriorityRange>,
 2807 |     offsets: Arc<[u64]>,
 2808 |     cur_index_into_offsets: usize,
 2809 |     cur_position: u64,
 2810 | }
 2811 | 
 2812 | impl ListPriorityRange {
 2813 |     pub(crate) fn new(base: Box<dyn PriorityRange>, offsets: Arc<[u64]>) -> Self {
 2814 |         Self {
 2815 |             base,
 2816 |             offsets,
 2817 |             cur_index_into_offsets: 0,
 2818 |             cur_position: 0,
 2819 |         }
 2820 |     }
 2821 | }
 2822 | 
 2823 | impl std::fmt::Debug for ListPriorityRange {
 2824 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
 2825 |         f.debug_struct("ListPriorityRange")
 2826 |             .field("base", &self.base)
 2827 |             .field("offsets.len()", &self.offsets.len())
 2828 |             .field("cur_index_into_offsets", &self.cur_index_into_offsets)
 2829 |             .field("cur_position", &self.cur_position)
 2830 |             .finish()
 2831 |     }
 2832 | }
 2833 | 
 2834 | impl PriorityRange for ListPriorityRange {
 2835 |     fn advance(&mut self, num_rows: u64) {
 2836 |         // We've scheduled X items.  Now walk through the offsets to
 2837 |         // determine how many rows we've scheduled.
 2838 |         self.cur_position += num_rows;
 2839 |         let mut idx_into_offsets = self.cur_index_into_offsets;
 2840 |         while idx_into_offsets + 1 < self.offsets.len()
 2841 |             && self.offsets[idx_into_offsets + 1] <= self.cur_position
 2842 |         {
 2843 |             idx_into_offsets += 1;
 2844 |         }
 2845 |         let base_rows_advanced = idx_into_offsets - self.cur_index_into_offsets;
 2846 |         self.cur_index_into_offsets = idx_into_offsets;
 2847 |         self.base.advance(base_rows_advanced as u64);
 2848 |     }
 2849 | 
 2850 |     fn current_priority(&self) -> u64 {
 2851 |         self.base.current_priority()
 2852 |     }
 2853 | 
 2854 |     fn box_clone(&self) -> Box<dyn PriorityRange> {
 2855 |         Box::new(Self {
 2856 |             base: self.base.box_clone(),
 2857 |             offsets: self.offsets.clone(),
 2858 |             cur_index_into_offsets: self.cur_index_into_offsets,
 2859 |             cur_position: self.cur_position,
 2860 |         })
 2861 |     }
 2862 | }
 2863 | 
 2864 | /// Contains the context for a scheduler
 2865 | /// The writer accumulates about this many bytes of values per column before it
 2866 | /// cuts pages (`EncodingOptions::cache_bytes_per_column`), and the rep/def
 2867 | /// budget of a mini-block chunk then splits that block into many small pages
 2868 | /// for nested columns. Batching reads back up to this size restores one
 2869 | /// I/O request per accumulated block.
 2870 | pub(crate) const IO_REQUEST_BATCH_BYTES: u64 = 8 * 1024 * 1024;
 2871 | 
 2872 | type SharedRead = Shared<BoxFuture<'static, std::result::Result<Arc<Vec<Bytes>>, CloneableError>>>;
 2873 | 
 2874 | /// What a pending read receives once its batch is submitted.
 2875 | enum SubmittedRead {
 2876 |     /// The read was alone in its batch and owns the request.
 2877 |     Alone(BoxFuture<'static, Result<Vec<Bytes>>>),
 2878 |     /// The batched request and the position of each of the read's ranges in it.
 2879 |     Shared(SharedRead, Vec<usize>),
 2880 | }
 2881 | 
 2882 | struct PendingRead {
 2883 |     ranges: Vec<Range<u64>>,
 2884 |     priority: u64,
 2885 |     tx: oneshot::Sender<SubmittedRead>,
 2886 | }
 2887 | 
 2888 | /// Collects the reads submitted while one scheduling step runs and sends them
 2889 | /// to the I/O layer as a single request.
 2890 | ///
 2891 | /// The I/O scheduler only coalesces the ranges of one request, so the reads a
 2892 | /// step issues for different pages, or for different columns, cost one request
 2893 | /// each even when they sit next to each other in the file. A take of a few rows
 2894 | /// reads a few bytes per column, and a file's small pages are packed together,
 2895 | /// so batching them turns dozens of requests into a handful.
 2896 | ///
 2897 | /// A batch is submitted by [`Self::flush`] when the step ends, as soon as the
 2898 | /// queued reads reach [`IO_REQUEST_BATCH_BYTES`] (a page that shards its own
 2899 | /// reads to bound buffering keeps every shard in a bounded read), or when a
 2900 | /// caller awaits one of its reads, so a read queued outside a step (indirect
 2901 | /// I/O issued from a load future) never waits for a flush that does not come.
 2902 | /// That last flush waits for one yield first: sibling futures polled in the
 2903 | /// same pass (a struct's columns initializing their pages, a scan line's list
 2904 | /// columns fetching their items) all queue their reads before the first of
 2905 | /// them resumes and submits the lot.
 2906 | pub(crate) struct RequestBatch {
 2907 |     inner: Arc<dyn EncodingsIo>,
 2908 |     pending: Arc<Mutex<Vec<PendingRead>>>,
 2909 | }
 2910 | 
 2911 | impl std::fmt::Debug for RequestBatch {
 2912 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
 2913 |         f.debug_struct("RequestBatch").finish_non_exhaustive()
 2914 |     }
 2915 | }
 2916 | 
 2917 | impl RequestBatch {
 2918 |     pub(crate) fn new(inner: Arc<dyn EncodingsIo>) -> Self {
 2919 |         Self {
 2920 |             inner,
 2921 |             pending: Arc::new(Mutex::new(Vec::new())),
 2922 |         }
 2923 |     }
 2924 | 
 2925 |     fn queued_bytes(pending: &[PendingRead]) -> u64 {
 2926 |         pending
 2927 |             .iter()
 2928 |             .flat_map(|read| &read.ranges)
 2929 |             .map(|range| range.end - range.start)
 2930 |             .sum()
 2931 |     }
 2932 | 
 2933 |     /// Bytes requested by the reads collected so far.
 2934 |     pub(crate) fn pending_bytes(&self) -> u64 {
 2935 |         Self::queued_bytes(&self.pending.lock().unwrap())
 2936 |     }
 2937 | 
 2938 |     /// Submits the collected reads as one request.
 2939 |     pub(crate) fn flush(&self) {
 2940 |         Self::flush_pending(&self.inner, &self.pending);
 2941 |     }
 2942 | 
 2943 |     fn flush_pending(inner: &Arc<dyn EncodingsIo>, pending: &Mutex<Vec<PendingRead>>) {
 2944 |         let pending = std::mem::take(&mut *pending.lock().unwrap());
 2945 |         Self::submit_batch(inner, pending);
 2946 |     }
 2947 | 
 2948 |     /// Submits `pending` as one request, sorted by file offset, and hands each
 2949 |     /// read its own slice of the result.
 2950 |     fn submit_batch(inner: &Arc<dyn EncodingsIo>, pending: Vec<PendingRead>) {
 2951 |         if pending.is_empty() {
 2952 |             return;
 2953 |         }
 2954 |         if pending.len() == 1 {
 2955 |             let read = pending.into_iter().next().unwrap();
 2956 |             let _ = read.tx.send(SubmittedRead::Alone(
 2957 |                 inner.submit_request(read.ranges, read.priority),
 2958 |             ));
 2959 |             return;
 2960 |         }
 2961 |         // The lowest row number any of the batched reads delivers data for.
 2962 |         let priority = pending.iter().map(|read| read.priority).min().unwrap();
 2963 |         let mut ordered = pending
 2964 |             .iter()
 2965 |             .enumerate()
 2966 |             .flat_map(|(read_idx, read)| {
 2967 |                 read.ranges
 2968 |                     .iter()
 2969 |                     .enumerate()
 2970 |                     .map(move |(range_idx, range)| (range.clone(), read_idx, range_idx))
 2971 |             })
 2972 |             .collect::<Vec<_>>();
 2973 |         ordered.sort_by_key(|(range, _, _)| (range.start, range.end));
 2974 |         let ranges = ordered
 2975 |             .iter()
 2976 |             .map(|(range, _, _)| range.clone())
 2977 |             .collect::<Vec<_>>();
 2978 |         // For every read, where each of its ranges landed in the sorted request.
 2979 |         let mut positions = pending
 2980 |             .iter()
 2981 |             .map(|read| vec![0; read.ranges.len()])
 2982 |             .collect::<Vec<_>>();
 2983 |         for (position, (_, read_idx, range_idx)) in ordered.iter().enumerate() {
 2984 |             positions[*read_idx][*range_idx] = position;
 2985 |         }
 2986 |         let batched: SharedRead = inner
 2987 |             .submit_request(ranges, priority)
 2988 |             .map(|result| result.map(Arc::new).map_err(CloneableError))
 2989 |             .boxed()
 2990 |             .shared();
 2991 |         for (read, read_positions) in pending.into_iter().zip(positions) {
 2992 |             // The receiver is gone only when the read's future was dropped.
 2993 |             let _ = read
 2994 |                 .tx
 2995 |                 .send(SubmittedRead::Shared(batched.clone(), read_positions));
 2996 |         }
 2997 |     }
 2998 | }
 2999 | 
 3000 | impl EncodingsIo for RequestBatch {
 3001 |     fn submit_request(
 3002 |         &self,
 3003 |         ranges: Vec<Range<u64>>,
 3004 |         priority: u64,
 3005 |     ) -> BoxFuture<'static, Result<Vec<Bytes>>> {
 3006 |         let mut pending = self.pending.lock().unwrap();
 3007 |         // Keep every batch within the budget: a page that shards its reads
 3008 |         // must not have all its shards collapse into one unbounded read.
 3009 |         let bytes = ranges
 3010 |             .iter()
 3011 |             .map(|range| range.end - range.start)
 3012 |             .sum::<u64>();
 3013 |         if !pending.is_empty() && Self::queued_bytes(&pending) + bytes > IO_REQUEST_BATCH_BYTES {
 3014 |             Self::submit_batch(&self.inner, std::mem::take(&mut *pending));
 3015 |         }
 3016 |         let (tx, mut rx) = oneshot::channel();
 3017 |         pending.push(PendingRead {
 3018 |             ranges,
 3019 |             priority,
 3020 |             tx,
 3021 |         });
 3022 |         drop(pending);
 3023 |         let inner = self.inner.clone();
 3024 |         let pending = self.pending.clone();
 3025 |         async move {
 3026 |             let submitted = match rx.try_recv() {
 3027 |                 // The step that queued this read already flushed it.
 3028 |                 Ok(Some(submitted)) => submitted,
 3029 |                 _ => {
 3030 |                     // Awaiting a read is the end of whatever step queued it.
 3031 |                     // Yield once so the siblings polled in the same pass get
 3032 |                     // to queue too, then submit them all.
 3033 |                     tokio::task::yield_now().await;
 3034 |                     Self::flush_pending(&inner, &pending);
 3035 |                     rx.await.map_err(|_| {
 3036 |                         Error::internal("a batched read was dropped before the batch was submitted")
 3037 |                     })?
 3038 |                 }
 3039 |             };
 3040 |             match submitted {
 3041 |                 SubmittedRead::Alone(request) => request.await,
 3042 |                 SubmittedRead::Shared(batched, positions) => {
 3043 |                     let bytes = batched.await.map_err(|err| err.0)?;
 3044 |                     Ok(positions
 3045 |                         .into_iter()
 3046 |                         .map(|position| bytes[position].clone())
 3047 |                         .collect())
 3048 |                 }
 3049 |             }
 3050 |         }
 3051 |         .boxed()
 3052 |     }
 3053 | 
 3054 |     fn with_bypass_backpressure(&self) -> Option<Arc<dyn EncodingsIo>> {
 3055 |         self.inner.with_bypass_backpressure()
 3056 |     }
 3057 | 
 3058 |     fn with_io_stats(
 3059 |         &self,
 3060 |         stats: Arc<dyn lance_core::utils::io_stats::IoStatsRecorder>,
 3061 |     ) -> Option<Arc<dyn EncodingsIo>> {
 3062 |         self.inner.with_io_stats(stats)
 3063 |     }
 3064 | }
 3065 | 
 3066 | pub struct SchedulerContext {
 3067 |     recv: Option<mpsc::UnboundedReceiver<DecoderMessage>>,
 3068 |     io: Arc<dyn EncodingsIo>,
 3069 |     /// `io`, as the batch that collects one scheduling step's reads.
 3070 |     batch: Arc<RequestBatch>,
 3071 |     cache: Arc<LanceCache>,
 3072 |     name: String,
 3073 |     path: Vec<u32>,
 3074 |     path_names: Vec<String>,
 3075 | }
 3076 | 
 3077 | pub struct ScopedSchedulerContext<'a> {
 3078 |     pub context: &'a mut SchedulerContext,
 3079 | }
 3080 | 
 3081 | impl<'a> ScopedSchedulerContext<'a> {
 3082 |     pub fn pop(self) -> &'a mut SchedulerContext {
 3083 |         self.context.pop();
 3084 |         self.context
 3085 |     }
 3086 | }
 3087 | 
 3088 | impl SchedulerContext {
 3089 |     pub fn new(io: Arc<dyn EncodingsIo>, cache: Arc<LanceCache>) -> Self {
 3090 |         let batch = Arc::new(RequestBatch::new(io));
 3091 |         Self {
 3092 |             io: batch.clone(),
 3093 |             batch,
 3094 |             cache,
 3095 |             recv: None,
 3096 |             name: "".to_string(),
 3097 |             path: Vec::new(),
 3098 |             path_names: Vec::new(),
 3099 |         }
 3100 |     }
 3101 | 
 3102 |     pub fn io(&self) -> &Arc<dyn EncodingsIo> {
 3103 |         &self.io
 3104 |     }
 3105 | 
 3106 |     /// Submits the reads the schedulers queued since the last step as one request.
 3107 |     pub fn flush_io(&self) {
 3108 |         self.batch.flush();
 3109 |     }
 3110 | 
 3111 |     pub fn cache(&self) -> &Arc<LanceCache> {
 3112 |         &self.cache
 3113 |     }
 3114 | 
 3115 |     pub fn push(&'_ mut self, name: &str, index: u32) -> ScopedSchedulerContext<'_> {
 3116 |         self.path.push(index);
 3117 |         self.path_names.push(name.to_string());
 3118 |         ScopedSchedulerContext { context: self }
 3119 |     }
 3120 | 
 3121 |     pub fn pop(&mut self) {
 3122 |         self.path.pop();
 3123 |         self.path_names.pop();
 3124 |     }
 3125 | 
 3126 |     pub fn path_name(&self) -> String {
 3127 |         let path = self.path_names.join("/");
 3128 |         if self.recv.is_some() {
 3129 |             format!("TEMP({}){}", self.name, path)
 3130 |         } else {
 3131 |             format!("ROOT{}", path)
 3132 |         }
 3133 |     }
 3134 | 
 3135 |     pub fn current_path(&self) -> VecDeque<u32> {
 3136 |         VecDeque::from_iter(self.path.iter().copied())
 3137 |     }
 3138 | 
 3139 |     #[deprecated(since = "0.29.1", note = "This is for v2.0 array-encoding paths")]
 3140 |     pub fn locate_decoder(&mut self, decoder: Box<dyn LogicalPageDecoder>) -> DecoderReady {
 3141 |         trace!(
 3142 |             "Scheduling decoder of type {:?} for {:?}",
 3143 |             decoder.data_type(),
 3144 |             self.path,
 3145 |         );
 3146 |         DecoderReady {
 3147 |             decoder,
 3148 |             path: self.current_path(),
 3149 |         }
 3150 |     }
 3151 | }
 3152 | 
 3153 | pub struct UnloadedPageShard(pub BoxFuture<'static, Result<LoadedPageShard>>);
 3154 | 
 3155 | impl std::fmt::Debug for UnloadedPageShard {
 3156 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
 3157 |         f.debug_struct("UnloadedPage").finish()
 3158 |     }
 3159 | }
 3160 | 
 3161 | #[derive(Debug)]
 3162 | pub struct ScheduledScanLine {
 3163 |     pub rows_scheduled: u64,
 3164 |     pub decoders: Vec<MessageType>,
 3165 | }
 3166 | 
 3167 | pub trait StructuralSchedulingJob: std::fmt::Debug {
 3168 |     /// Schedule the next batch of data
 3169 |     ///
 3170 |     /// Normally this equates to scheduling the next page of data into one task.  Very large pages
 3171 |     /// might be split into multiple scan lines.  Each scan line has one or more rows.
 3172 |     ///
 3173 |     /// If a scheduler ends early it may return an empty vector.
 3174 |     fn schedule_next(&mut self, context: &mut SchedulerContext) -> Result<Vec<ScheduledScanLine>>;
 3175 | }
 3176 | 
 3177 | /// A filter expression to apply to the data
 3178 | ///
 3179 | /// The core decoders do not currently take advantage of filtering in
 3180 | /// any way.  In order to maintain the abstraction we represent filters
 3181 | /// as an arbitrary byte sequence.
 3182 | ///
 3183 | /// We recommend that encodings use Substrait for filters.
 3184 | pub struct FilterExpression(pub Bytes);
 3185 | 
 3186 | impl FilterExpression {
 3187 |     /// Create a filter expression that does not filter any data
 3188 |     ///
 3189 |     /// This is currently represented by an empty byte array.  Encoders
 3190 |     /// that are "filter aware" should make sure they handle this case.
 3191 |     pub fn no_filter() -> Self {
 3192 |         Self(Bytes::new())
 3193 |     }
 3194 | 
 3195 |     /// Returns true if the filter is the same as the [`Self::no_filter`] filter
 3196 |     pub fn is_noop(&self) -> bool {
 3197 |         self.0.is_empty()
 3198 |     }
 3199 | }
 3200 | 
 3201 | pub trait StructuralFieldScheduler: Send + std::fmt::Debug {
 3202 |     /// Loads the per-page metadata this column needs before scheduling.
 3203 |     ///
 3204 |     /// When `requested_ranges` is present, only pages overlapping those
 3205 |     /// top-level row ranges are initialized. `None` initializes the complete
 3206 |     /// field.
 3207 |     fn initialize<'a>(
 3208 |         &'a mut self,
 3209 |         requested_ranges: Option<&'a [Range<u64>]>,
 3210 |         filter: &'a FilterExpression,
 3211 |         context: &'a SchedulerContext,
 3212 |     ) -> BoxFuture<'a, Result<()>>;
 3213 |     fn schedule_ranges<'a>(
 3214 |         &'a self,
 3215 |         ranges: &[Range<u64>],
 3216 |         filter: &FilterExpression,
 3217 |     ) -> Result<Box<dyn StructuralSchedulingJob + 'a>>;
 3218 | }
 3219 | 
 3220 | /// A trait for tasks that decode data into an Arrow array
 3221 | pub trait DecodeArrayTask: Send {
 3222 |     /// Decodes the data into an Arrow array and its data size in bytes
 3223 |     fn decode(self: Box<Self>) -> Result<(ArrayRef, u64)>;
 3224 | }
 3225 | 
 3226 | impl DecodeArrayTask for Box<dyn StructuralDecodeArrayTask> {
 3227 |     fn decode(self: Box<Self>) -> Result<(ArrayRef, u64)> {
 3228 |         let decoded_array = StructuralDecodeArrayTask::decode(*self)?;
 3229 |         decoded_array.repdef.ensure_exhausted()?;
 3230 |         Ok((decoded_array.array, decoded_array.data_size))
 3231 |     }
 3232 | }
 3233 | 
 3234 | /// A task to decode data into an Arrow record batch
 3235 | ///
 3236 | /// It has a child `task` which decodes a struct array with no nulls.
 3237 | /// This is then converted into a record batch.
 3238 | pub struct NextDecodeTask {
 3239 |     /// The decode task itself
 3240 |     pub task: Box<dyn DecodeArrayTask>,
 3241 |     /// The number of rows that will be created
 3242 |     pub num_rows: u64,
 3243 | }
 3244 | 
 3245 | impl NextDecodeTask {
 3246 |     // Run the task and produce a record batch
 3247 |     //
 3248 |     // If the batch is very large this function will log a warning message
 3249 |     // suggesting the user try a smaller batch size.
 3250 |     #[instrument(name = "task_to_batch", level = "debug", skip_all)]
 3251 |     fn into_batch(self, emitted_batch_size_warning: Arc<Once>) -> Result<(RecordBatch, u64)> {
 3252 |         let (struct_arr, data_size) = self.task.decode()?;
 3253 |         let batch = RecordBatch::from(struct_arr.as_struct());
 3254 |         if data_size > BATCH_SIZE_BYTES_WARNING {
 3255 |             emitted_batch_size_warning.call_once(|| {
 3256 |                 let size_mb = data_size / 1024 / 1024;
 3257 |                 debug!("Lance read in a single batch that contained more than {}MiB of data.  You may want to consider reducing the batch size.", size_mb);
 3258 |             });
 3259 |         }
 3260 |         Ok((batch, data_size))
 3261 |     }
 3262 | }
 3263 | 
 3264 | // An envelope to wrap both 2.0 style messages and 2.1 style messages so we can
 3265 | // share some code paths between the two.  Decoders can safely unwrap into whatever
 3266 | // style they expect since a file will be either all-2.0 or all-2.1
 3267 | #[derive(Debug)]
 3268 | pub enum MessageType {
 3269 |     // The older v2.0 scheduler/decoder used a scheme where the message was the
 3270 |     // decoder itself.  The messages were not sent in priority order and the decoder
 3271 |     // had to wait for I/O, figuring out the correct priority.  This was a lot of
 3272 |     // complexity.
 3273 |     DecoderReady(DecoderReady),
 3274 |     // Starting in 2.1 we use a simpler scheme where the scheduling happens in priority
 3275 |     // order and the message is an unloaded decoder.  These can be awaited, in order, and
 3276 |     // the decoder does not have to worry about waiting for I/O.
 3277 |     UnloadedPage(UnloadedPageShard),
 3278 | }
 3279 | 
 3280 | impl MessageType {
 3281 |     pub fn into_array(self) -> DecoderReady {
 3282 |         match self {
 3283 |             Self::DecoderReady(decoder) => decoder,
 3284 |             Self::UnloadedPage(_) => {
 3285 |                 panic!("Expected DecoderReady but got UnloadedPage")
 3286 |             }
 3287 |         }
 3288 |     }
 3289 | 
 3290 |     pub fn into_structural(self) -> UnloadedPageShard {
 3291 |         match self {
 3292 |             Self::UnloadedPage(unloaded) => unloaded,
 3293 |             Self::DecoderReady(_) => {
 3294 |                 panic!("Expected UnloadedPage but got DecoderReady")
 3295 |             }
 3296 |         }
 3297 |     }
 3298 | }
 3299 | 
 3300 | pub struct DecoderMessage {
 3301 |     pub scheduled_so_far: u64,
 3302 |     pub decoders: Vec<MessageType>,
 3303 | }
 3304 | 
 3305 | pub struct DecoderContext {
 3306 |     source: mpsc::UnboundedReceiver<Result<DecoderMessage>>,
 3307 | }
 3308 | 
 3309 | impl DecoderContext {
 3310 |     pub fn new(source: mpsc::UnboundedReceiver<Result<DecoderMessage>>) -> Self {
 3311 |         Self { source }
 3312 |     }
 3313 | }
 3314 | 
 3315 | pub struct DecodedPage {
 3316 |     pub data: DataBlock,
 3317 |     pub repdef: RepDefUnraveler,
 3318 | }
 3319 | 
 3320 | pub trait DecodePageTask: Send + std::fmt::Debug {
 3321 |     /// Decodes the data into an Arrow array
 3322 |     fn decode(self: Box<Self>) -> Result<DecodedPage>;
 3323 | }
 3324 | 
 3325 | pub trait StructuralPageDecoder: std::fmt::Debug + Send {
 3326 |     fn drain(&mut self, num_rows: u64) -> Result<Box<dyn DecodePageTask>>;
 3327 |     fn num_rows(&self) -> u64;
 3328 |     /// Returns the exact decoded byte count for the next `num_rows` rows
 3329 |     /// from this decoder's current position, without consuming any rows.
 3330 |     fn decoded_bytes(&self, _num_rows: u64) -> Result<u64> {
 3331 |         Err(Error::not_supported(
 3332 |             "decoded_bytes is not implemented for this page decoder".to_string(),
 3333 |         ))
 3334 |     }
 3335 | }
 3336 | 
 3337 | #[derive(Debug)]
 3338 | pub struct LoadedPageShard {
 3339 |     // The decoder that is ready to be decoded
 3340 |     pub decoder: Box<dyn StructuralPageDecoder>,
 3341 |     // The path to the decoder, the first value is the column index
 3342 |     // following values, if present, are nested child indices
 3343 |     //
 3344 |     // For example, a path of [1, 1, 0] would mean to grab the second
 3345 |     // column, then the second child, and then the first child.
 3346 |     //
 3347 |     // It could represent x in the following schema:
 3348 |     //
 3349 |     // score: float64
 3350 |     // points: struct
 3351 |     //   color: string
 3352 |     //   location: struct
 3353 |     //     x: float64
 3354 |     //
 3355 |     // Currently, only struct decoders have "children" although other
 3356 |     // decoders may at some point as well.  List children are only
 3357 |     // handled through indirect I/O at the moment and so they don't
 3358 |     // need to be represented (yet)
 3359 |     pub path: VecDeque<u32>,
 3360 | }
 3361 | 
 3362 | pub struct DecodedArray {
 3363 |     pub array: ArrayRef,
 3364 |     pub repdef: CompositeRepDefUnraveler,
 3365 |     /// The number of bytes of data in this array (excluding Arrow overhead).
 3366 |     pub data_size: u64,
 3367 | }
 3368 | 
 3369 | pub trait StructuralDecodeArrayTask: std::fmt::Debug + Send {
 3370 |     fn decode(self: Box<Self>) -> Result<DecodedArray>;
 3371 | }
 3372 | 
 3373 | pub trait StructuralFieldDecoder: std::fmt::Debug + Send {
 3374 |     /// Add a newly scheduled child decoder
 3375 |     ///
 3376 |     /// The default implementation does not expect children and returns
 3377 |     /// an error.
 3378 |     fn accept_page(&mut self, _child: LoadedPageShard) -> Result<()>;
 3379 |     /// Creates a task to decode `num_rows` of data into an array
 3380 |     fn drain(&mut self, num_rows: u64) -> Result<Box<dyn StructuralDecodeArrayTask>>;
 3381 |     /// The data type of the decoded data
 3382 |     fn data_type(&self) -> &DataType;
 3383 |     /// Returns the exact decoded byte count for each of [`CANDIDATE_BATCH_SIZES`]
 3384 |     /// row counts, clamped to `rows_remaining`.
 3385 |     ///
 3386 |     /// Implementations should do their best to estimate the exact size required for
 3387 |     /// the uncompressed data.  In cases where this is not possible they should return
 3388 |     /// a worst-case estimate.
 3389 |     ///
 3390 |     /// The default implementation simply returns a "not supported" error though this
 3391 |     /// will hopefully be removed once implementation is complete.
 3392 |     fn plan_decoded_bytes(&self, _rows_remaining: u64) -> Result<[u64; 8]> {
 3393 |         Err(Error::not_supported(
 3394 |             "decoded_bytes is not implemented for this field decoder".to_string(),
 3395 |         ))
 3396 |     }
 3397 | }
 3398 | 
 3399 | #[derive(Debug, Default)]
 3400 | pub struct DecoderPlugins {}
 3401 | 
 3402 | /// The top-level column layout used by an in-memory encoded batch.
 3403 | #[derive(Debug, Clone, Copy, PartialEq, Eq)]
 3404 | pub enum EncodedBatchLayout {
 3405 |     /// Array pages include structural columns.
 3406 |     Array,
 3407 |     /// Structural pages include only leaf columns.
 3408 |     Structural,
 3409 | }
 3410 | 
 3411 | /// Decodes a batch of data from an in-memory structure created by [`crate::encoder::encode_batch`]
 3412 | pub async fn decode_batch(
 3413 |     batch: &EncodedBatch,
 3414 |     filter: &FilterExpression,
 3415 |     decoder_plugins: Arc<DecoderPlugins>,
 3416 |     should_validate: bool,
 3417 |     layout: EncodedBatchLayout,
 3418 |     cache: Option<Arc<LanceCache>>,
 3419 | ) -> Result<RecordBatch> {
 3420 |     // The io is synchronous so it shouldn't be possible for any async stuff to still be in progress
 3421 |     // Still, if we just use now_or_never we hit misfires because some futures (channels) need to be
 3422 |     // polled twice.
 3423 | 
 3424 |     let io_scheduler = Arc::new(BufferScheduler::new(batch.data.clone())) as Arc<dyn EncodingsIo>;
 3425 |     let cache = if let Some(cache) = cache {
 3426 |         cache
 3427 |     } else {
 3428 |         Arc::new(lance_core::cache::LanceCache::with_capacity(
 3429 |             128 * 1024 * 1024,
 3430 |         ))
 3431 |     };
 3432 |     let mut decode_scheduler = DecodeBatchScheduler::try_new(
 3433 |         batch.schema.as_ref(),
 3434 |         &batch.top_level_columns,
 3435 |         &batch.page_table,
 3436 |         &vec![],
 3437 |         batch.num_rows,
 3438 |         decoder_plugins,
 3439 |         io_scheduler.clone(),
 3440 |         cache,
 3441 |         filter,
 3442 |         &DecoderConfig::default(),
 3443 |     )
 3444 |     .await?;
 3445 |     let (tx, rx) = unbounded_channel();
 3446 |     decode_scheduler.schedule_range(0..batch.num_rows, filter, tx, io_scheduler);
 3447 |     let is_structural = layout == EncodedBatchLayout::Structural;
 3448 |     let mode = std::env::var(ENV_LANCE_STRUCTURAL_BATCH_DECODE_SPAWN_MODE);
 3449 |     let spawn_structural_batch_decode_tasks = !matches!(mode.ok().as_deref(), Some("never"));
 3450 |     // `EncodedBatch` is created from one RecordBatch, so every i32-offset array is
 3451 |     // already known to fit in one Arrow array. Preserve the single-batch contract here.
 3452 |     let mut decode_stream = create_decode_stream_with_i32_offset_limit(
 3453 |         &batch.schema,
 3454 |         batch.num_rows,
 3455 |         batch.num_rows as u32,
 3456 |         is_structural,
 3457 |         should_validate,
 3458 |         spawn_structural_batch_decode_tasks,
 3459 |         rx,
 3460 |         None,
 3461 |         false,
 3462 |     )?;
 3463 |     decode_stream.next().await.unwrap().task.await
 3464 | }
 3465 | 
 3466 | #[cfg(test)]
 3467 | // test coalesce indices to ranges
 3468 | mod tests {
 3469 |     use super::*;
 3470 |     use arrow_array::StringArray;
 3471 |     use std::collections::VecDeque;
 3472 | 
 3473 |     struct StaticArrayDecodeTask(ArrayRef);
 3474 | 
 3475 |     impl DecodeArrayTask for StaticArrayDecodeTask {
 3476 |         fn decode(self: Box<Self>) -> Result<(ArrayRef, u64)> {
 3477 |             Ok((self.0, 0))
 3478 |         }
 3479 |     }
 3480 | 
 3481 |     #[derive(Debug)]
 3482 |     struct StaticArrayPageDecoder {
 3483 |         array: ArrayRef,
 3484 |         rows_drained: u64,
 3485 |         /// Pretend each row decodes to this many bytes instead of its real size,
 3486 |         /// so budget exhaustion can be tested without gigabyte allocations.
 3487 |         fake_bytes_per_row: Option<u64>,
 3488 |     }
 3489 | 
 3490 |     impl StaticArrayPageDecoder {
 3491 |         fn new(values: &[&str]) -> Self {
 3492 |             Self {
 3493 |                 array: Arc::new(StringArray::from(values.to_vec())),
 3494 |                 rows_drained: 0,
 3495 |                 fake_bytes_per_row: None,
 3496 |             }
 3497 |         }
 3498 | 
 3499 |         fn with_fake_bytes_per_row(values: &[&str], fake_bytes_per_row: u64) -> Self {
 3500 |             Self {
 3501 |                 fake_bytes_per_row: Some(fake_bytes_per_row),
 3502 |                 ..Self::new(values)
 3503 |             }
 3504 |         }
 3505 | 
 3506 |         fn row_bytes(&self, row: usize) -> u64 {
 3507 |             self.fake_bytes_per_row.unwrap_or_else(|| {
 3508 |                 self.array
 3509 |                     .as_any()
 3510 |                     .downcast_ref::<StringArray>()
 3511 |                     .unwrap()
 3512 |                     .value(row)
 3513 |                     .len() as u64
 3514 |             })
 3515 |         }
 3516 |     }
 3517 | 
 3518 |     impl LogicalPageDecoder for StaticArrayPageDecoder {
 3519 |         fn wait_for_loaded(&mut self, _loaded_need: u64) -> BoxFuture<'_, Result<()>> {
 3520 |             std::future::ready(Ok(())).boxed()
 3521 |         }
 3522 | 
 3523 |         fn rows_loaded(&self) -> u64 {
 3524 |             self.array.len() as u64
 3525 |         }
 3526 | 
 3527 |         fn num_rows(&self) -> u64 {
 3528 |             self.array.len() as u64
 3529 |         }
 3530 | 
 3531 |         fn rows_drained(&self) -> u64 {
 3532 |             self.rows_drained
 3533 |         }
 3534 | 
 3535 |         fn drain(&mut self, num_rows: u64) -> Result<NextDecodeTask> {
 3536 |             let array = self
 3537 |                 .array
 3538 |                 .slice(self.rows_drained as usize, num_rows as usize);
 3539 |             self.rows_drained += num_rows;
 3540 |             Ok(NextDecodeTask {
 3541 |                 task: Box::new(StaticArrayDecodeTask(array)),
 3542 |                 num_rows,
 3543 |             })
 3544 |         }
 3545 | 
 3546 |         fn max_rows_to_drain(&self, num_rows: u64, byte_budget: u64) -> Result<DrainLimit> {
 3547 |             let start = self.rows_drained as usize;
 3548 |             let mut rows = 0u64;
 3549 |             let mut bytes = 0u64;
 3550 |             for row in start..start + num_rows as usize {
 3551 |                 let row_bytes = self.row_bytes(row);
 3552 |                 if bytes + row_bytes > byte_budget {
 3553 |                     break;
 3554 |                 }
 3555 |                 bytes += row_bytes;
 3556 |                 rows += 1;
 3557 |             }
 3558 |             Ok(DrainLimit { rows, bytes })
 3559 |         }
 3560 | 
 3561 |         fn data_type(&self) -> &DataType {
 3562 |             self.array.data_type()
 3563 |         }
 3564 |     }
 3565 | 
 3566 |     async fn array_stream_batch_sizes(
 3567 |         pages: Vec<StaticArrayPageDecoder>,
 3568 |         batch_size: u32,
 3569 |     ) -> Vec<usize> {
 3570 |         let num_rows = pages.iter().map(|page| page.num_rows()).sum::<u64>();
 3571 |         let fields = Fields::from(vec![ArrowField::new("value", DataType::Utf8, false)]);
 3572 |         let root_decoder = SimpleStructDecoder::new(fields, num_rows);
 3573 |         let (tx, rx) = unbounded_channel();
 3574 |         let pages = pages
 3575 |             .into_iter()
 3576 |             .map(|page| {
 3577 |                 MessageType::DecoderReady(DecoderReady {
 3578 |                     decoder: Box::new(page),
 3579 |                     path: VecDeque::from([0]),
 3580 |                 })
 3581 |             })
 3582 |             .collect();
 3583 |         tx.send(Ok(DecoderMessage {
 3584 |             scheduled_so_far: num_rows,
 3585 |             decoders: pages,
 3586 |         }))
 3587 |         .unwrap();
 3588 |         drop(tx);
 3589 | 
 3590 |         let mut stream =
 3591 |             BatchDecodeStream::new(rx, batch_size, num_rows, root_decoder).into_stream();
 3592 |         let mut batch_sizes = Vec::new();
 3593 |         while let Some(task) = stream.next().await {
 3594 |             batch_sizes.push(task.task.await.unwrap().num_rows());
 3595 |         }
 3596 |         batch_sizes
 3597 |     }
 3598 | 
 3599 |     #[tokio::test]
 3600 |     async fn test_array_stream_spans_i32_offset_pages_within_budget() {
 3601 |         // Small variable-width pages must NOT split the batch at page boundaries.
 3602 |         let batch_sizes = array_stream_batch_sizes(
 3603 |             vec![
 3604 |                 StaticArrayPageDecoder::new(&["a", "b"]),
 3605 |                 StaticArrayPageDecoder::new(&["c", "d"]),
 3606 |             ],
 3607 |             4,
 3608 |         )
 3609 |         .await;
 3610 |         assert_eq!(batch_sizes, vec![4]);
 3611 |     }
 3612 | 
 3613 |     #[tokio::test]
 3614 |     async fn test_array_stream_splits_when_i32_offset_budget_exhausted() {
 3615 |         // Three single-row pages pretending to hold 800MiB each: two fit the
 3616 |         // i32 offset budget (~2GiB), the third starts a new batch.
 3617 |         const FAKE_ROW_BYTES: u64 = 800 * 1024 * 1024;
 3618 |         let batch_sizes = array_stream_batch_sizes(
 3619 |             vec![
 3620 |                 StaticArrayPageDecoder::with_fake_bytes_per_row(&["a"], FAKE_ROW_BYTES),
 3621 |                 StaticArrayPageDecoder::with_fake_bytes_per_row(&["b"], FAKE_ROW_BYTES),
 3622 |                 StaticArrayPageDecoder::with_fake_bytes_per_row(&["c"], FAKE_ROW_BYTES),
 3623 |             ],
 3624 |             4,
 3625 |         )
 3626 |         .await;
 3627 |         assert_eq!(batch_sizes, vec![2, 1]);
 3628 |     }
 3629 | 
 3630 |     #[tokio::test]
 3631 |     async fn test_array_stream_emits_over_budget_rows_alone() {
 3632 |         // Rows whose (possibly over-estimated) size exceeds the whole budget are
 3633 |         // emitted as single-row batches rather than failing the scan.
 3634 |         const FAKE_ROW_BYTES: u64 = 3 * 1024 * 1024 * 1024;
 3635 |         let batch_sizes = array_stream_batch_sizes(
 3636 |             vec![
 3637 |                 StaticArrayPageDecoder::with_fake_bytes_per_row(&["a"], FAKE_ROW_BYTES),
 3638 |                 StaticArrayPageDecoder::with_fake_bytes_per_row(&["b"], FAKE_ROW_BYTES),
 3639 |             ],
 3640 |             4,
 3641 |         )
 3642 |         .await;
 3643 |         assert_eq!(batch_sizes, vec![1, 1]);
 3644 |     }
 3645 | 
 3646 |     #[test]
 3647 |     fn requested_row_indices_convert_to_checked_ranges() {
 3648 |         let requested_rows = RequestedRows::Indices(vec![1, 2, 5, 8, 9]);
 3649 |         let ranges = requested_rows.into_ranges().unwrap();
 3650 |         assert_eq!(ranges, [1..3, 5..6, 8..10]);
 3651 | 
 3652 |         let error = RequestedRows::Indices(vec![2, 2])
 3653 |             .into_ranges()
 3654 |             .unwrap_err();
 3655 |         assert!(matches!(error, Error::InvalidInput { .. }));
 3656 |         assert!(error.to_string().contains("not strictly increasing"));
 3657 | 
 3658 |         let error = RequestedRows::Indices(vec![u64::MAX])
 3659 |             .into_ranges()
 3660 |             .unwrap_err();
 3661 |         assert!(matches!(error, Error::InvalidInput { .. }));
 3662 |         assert!(error.to_string().contains("u64::MAX"));
 3663 |     }
 3664 | 
 3665 |     #[derive(Debug)]
 3666 |     struct FailingPageDecoder {
 3667 |         page_data_type: DataType,
 3668 |         total_rows: u64,
 3669 |         load_error_message: &'static str,
 3670 |     }
 3671 | 
 3672 |     impl FailingPageDecoder {
 3673 |         fn new(
 3674 |             page_data_type: DataType,
 3675 |             total_rows: u64,
 3676 |             load_error_message: &'static str,
 3677 |         ) -> Self {
 3678 |             Self {
 3679 |                 page_data_type,
 3680 |                 total_rows,
 3681 |                 load_error_message,
 3682 |             }
 3683 |         }
 3684 |     }
 3685 | 
 3686 |     impl LogicalPageDecoder for FailingPageDecoder {
 3687 |         fn wait_for_loaded(&'_ mut self, _rows_needed: u64) -> BoxFuture<'_, Result<()>> {
 3688 |             let load_error_message = self.load_error_message;
 3689 |             async move { Err(Error::io(load_error_message)) }.boxed()
 3690 |         }
 3691 | 
 3692 |         fn rows_loaded(&self) -> u64 {
 3693 |             0
 3694 |         }
 3695 | 
 3696 |         fn num_rows(&self) -> u64 {
 3697 |             self.total_rows
 3698 |         }
 3699 | 
 3700 |         fn rows_drained(&self) -> u64 {
 3701 |             0
 3702 |         }
 3703 | 
 3704 |         fn drain(&mut self, requested_rows: u64) -> Result<NextDecodeTask> {
 3705 |             Err(Error::internal(format!(
 3706 |                 "failing page decoder should not be drained after load error \
 3707 |                  (requested_rows={})",
 3708 |                 requested_rows
 3709 |             )))
 3710 |         }
 3711 | 
 3712 |         fn data_type(&self) -> &DataType {
 3713 |             &self.page_data_type
 3714 |         }
 3715 |     }
 3716 | 
 3717 |     struct InvalidInputDecodeTask;
 3718 | 
 3719 |     impl DecodeArrayTask for InvalidInputDecodeTask {
 3720 |         fn decode(self: Box<Self>) -> Result<(ArrayRef, u64)> {
 3721 |             Err(Error::invalid_input_source("malformed sparse page".into()))
 3722 |         }
 3723 |     }
 3724 | 
 3725 |     #[test]
 3726 |     fn next_decode_task_preserves_invalid_input_errors() {
 3727 |         let err = NextDecodeTask {
 3728 |             task: Box::new(InvalidInputDecodeTask),
 3729 |             num_rows: 0,
 3730 |         }
 3731 |         .into_batch(Arc::new(Once::new()))
 3732 |         .unwrap_err();
 3733 |         assert!(matches!(err, Error::InvalidInput { .. }));
 3734 |     }
 3735 | 
 3736 |     #[test]
 3737 |     fn test_read_zero_dimension_fsl_errors_instead_of_panicking() {
 3738 |         // Simulates reading a column whose stored schema declares a
 3739 |         // zero-dimension FixedSizeList, as old writers (before #5102) could
 3740 |         // persist. The read plan is built by the field-scheduler factories,
 3741 |         // which run the dimension guard before touching any column data, so
 3742 |         // an empty column iterator is sufficient to reach the guard. The read
 3743 |         // must surface a clean error rather than a divide-by-zero panic.
 3744 |         use arrow_schema::Field as ArrowField;
 3745 | 
 3746 |         let zero_dim = DataType::FixedSizeList(
 3747 |             Arc::new(ArrowField::new("item", DataType::Float32, true)),
 3748 |             0,
 3749 |         );
 3750 |         let field = Field::try_from(&ArrowField::new("vec", zero_dim, true)).unwrap();
 3751 |         let strategy = CoreFieldDecoderStrategy::default();
 3752 | 
 3753 |         let mut structural_columns = ColumnInfoIter::new(vec![], &[]);
 3754 |         let err = strategy
 3755 |             .create_structural_field_scheduler(&field, &mut structural_columns)
 3756 |             .unwrap_err();
 3757 |         assert!(
 3758 |             err.to_string()
 3759 |                 .contains("dimension must be a positive integer"),
 3760 |             "unexpected error: {}",
 3761 |             err
 3762 |         );
 3763 | 
 3764 |         let mut array_columns = ColumnInfoIter::new(vec![], &[]);
 3765 |         let err = strategy
 3766 |             .create_array_field_scheduler(
 3767 |                 &field,
 3768 |                 &mut array_columns,
 3769 |                 FileBuffers {
 3770 |                     positions_and_sizes: &[],
 3771 |                 },
 3772 |             )
 3773 |             .unwrap_err();
 3774 |         assert!(
 3775 |             err.to_string()
 3776 |                 .contains("dimension must be a positive integer"),
 3777 |             "unexpected error: {}",
 3778 |             err
 3779 |         );
 3780 |     }
 3781 | 
 3782 |     #[test]
 3783 |     fn test_list_page_with_non_list_encoding_returns_error() {
 3784 |         let item = Arc::new(ArrowField::new("item", DataType::Int32, true));
 3785 |         let list = DataType::List(item);
 3786 |         let field = Field::try_from(&ArrowField::new("values", list, true)).unwrap();
 3787 |         let values_encoding = pb::ColumnEncoding {
 3788 |             column_encoding: Some(pb::column_encoding::ColumnEncoding::Values(())),
 3789 |         };
 3790 |         let offsets_column = Arc::new(ColumnInfo::new(
 3791 |             0,
 3792 |             Arc::new([PageInfo {
 3793 |                 num_rows: 1,
 3794 |                 priority: 0,
 3795 |                 encoding: PageEncoding::Legacy(pb::ArrayEncoding {
 3796 |                     array_encoding: Some(pb::array_encoding::ArrayEncoding::Flat(
 3797 |                         pb::Flat::default(),
 3798 |                     )),
 3799 |                 }),
 3800 |                 buffer_offsets_and_sizes: Arc::new([]),
 3801 |             }]),
 3802 |             vec![],
 3803 |             values_encoding.clone(),
 3804 |         ));
 3805 |         let items_column = Arc::new(ColumnInfo::new(1, Arc::new([]), vec![], values_encoding));
 3806 |         let column_indices = [0, 1];
 3807 |         let mut columns = ColumnInfoIter::new(vec![offsets_column, items_column], &column_indices);
 3808 | 
 3809 |         let err = CoreFieldDecoderStrategy::default()
 3810 |             .create_array_field_scheduler(
 3811 |                 &field,
 3812 |                 &mut columns,
 3813 |                 FileBuffers {
 3814 |                     positions_and_sizes: &[],
 3815 |                 },
 3816 |             )
 3817 |             .unwrap_err();
 3818 | 
 3819 |         assert!(matches!(err, Error::InvalidInput { .. }));
 3820 |         assert!(
 3821 |             err.to_string()
 3822 |                 .contains("expected list encoding for field 'values' in column 0, page 0 but got"),
 3823 |             "unexpected error: {err}"
 3824 |         );
 3825 |     }
 3826 | 
 3827 |     #[tokio::test]
 3828 |     async fn test_array_stream_stops_on_load_error() {
 3829 |         use arrow_schema::Field as ArrowField;
 3830 | 
 3831 |         let rows_per_batch = 1;
 3832 |         let total_rows = 2;
 3833 |         let scheduled_rows = 1;
 3834 |         let page_rows = 1;
 3835 |         let batch_readahead = 2;
 3836 |         let load_error_message = "simulated page load failure";
 3837 |         let fields = Fields::from(vec![ArrowField::new("vector", DataType::Float32, true)]);
 3838 |         let root_decoder = SimpleStructDecoder::new(fields, total_rows);
 3839 |         let (tx, rx) = unbounded_channel();
 3840 | 
 3841 |         tx.send(Ok(DecoderMessage {
 3842 |             scheduled_so_far: scheduled_rows,
 3843 |             decoders: vec![MessageType::DecoderReady(DecoderReady {
 3844 |                 decoder: Box::new(FailingPageDecoder::new(
 3845 |                     DataType::Float32,
 3846 |                     page_rows,
 3847 |                     load_error_message,
 3848 |                 )),
 3849 |                 path: VecDeque::from([0]),
 3850 |             })],
 3851 |         }))
 3852 |         .unwrap();
 3853 |         drop(tx);
 3854 | 
 3855 |         let stream =
 3856 |             BatchDecodeStream::new(rx, rows_per_batch, total_rows, root_decoder).into_stream();
 3857 |         let mut batches = stream.map(|task| task.task).buffered(batch_readahead);
 3858 | 
 3859 |         let err = batches
 3860 |             .next()
 3861 |             .await
 3862 |             .expect("stream should emit the array page-load error")
 3863 |             .unwrap_err();
 3864 |         assert!(
 3865 |             err.to_string().contains(load_error_message),
 3866 |             "unexpected error: {}",
 3867 |             err
 3868 |         );
 3869 |         assert!(
 3870 |             batches.next().await.is_none(),
 3871 |             "stream should stop after the array page-load error"
 3872 |         );
 3873 |     }
 3874 | 
 3875 |     #[tokio::test]
 3876 |     async fn test_structural_stream_stops_on_load_error() {
 3877 |         let rows_per_batch = 1;
 3878 |         let total_rows = 2;
 3879 |         let scheduled_rows = 1;
 3880 |         let batch_readahead = 2;
 3881 |         let load_error_message = "simulated page load failure";
 3882 |         let fields = Fields::from(vec![ArrowField::new("vector", DataType::Float32, true)]);
 3883 |         let root_decoder = StructuralStructDecoder::new(
 3884 |             fields, false, /*is_root=*/ true, /*nullable=*/ false,
 3885 |         )
 3886 |         .unwrap();
 3887 |         let (tx, rx) = unbounded_channel();
 3888 |         let failed_page = async move { Err(Error::io(load_error_message)) }.boxed();
 3889 | 
 3890 |         tx.send(Ok(DecoderMessage {
 3891 |             scheduled_so_far: scheduled_rows,
 3892 |             decoders: vec![MessageType::UnloadedPage(UnloadedPageShard(failed_page))],
 3893 |         }))
 3894 |         .unwrap();
 3895 |         drop(tx);
 3896 | 
 3897 |         let stream = StructuralBatchDecodeStream::new(
 3898 |             rx,
 3899 |             rows_per_batch,
 3900 |             total_rows,
 3901 |             root_decoder,
 3902 |             /*spawn_batch_decode_tasks=*/ true,
 3903 |             None,
 3904 |         )
 3905 |         .into_stream();
 3906 |         let mut batches = stream.map(|task| task.task).buffered(batch_readahead);
 3907 | 
 3908 |         let err = batches
 3909 |             .next()
 3910 |             .await
 3911 |             .expect("stream should emit the page-load error")
 3912 |             .unwrap_err();
 3913 |         assert!(
 3914 |             err.to_string().contains(load_error_message),
 3915 |             "unexpected error: {}",
 3916 |             err
 3917 |         );
 3918 |         assert!(
 3919 |             batches.next().await.is_none(),
 3920 |             "stream should stop after the page-load error"
 3921 |         );
 3922 |     }
 3923 | 
 3924 |     #[test]
 3925 |     fn test_coalesce_indices_to_ranges_with_single_index() {
 3926 |         let indices = vec![1];
 3927 |         let ranges = RequestedRows::indices_to_ranges(&indices).unwrap();
 3928 |         assert_eq!(ranges, vec![1..2]);
 3929 |     }
 3930 | 
 3931 |     #[test]
 3932 |     fn test_coalesce_indices_to_ranges() {
 3933 |         let indices = vec![1, 2, 3, 4, 5, 6, 7, 8, 9];
 3934 |         let ranges = RequestedRows::indices_to_ranges(&indices).unwrap();
 3935 |         assert_eq!(ranges, vec![1..10]);
 3936 |     }
 3937 | 
 3938 |     #[test]
 3939 |     fn test_coalesce_indices_to_ranges_with_gaps() {
 3940 |         let indices = vec![1, 2, 3, 5, 6, 7, 9];
 3941 |         let ranges = RequestedRows::indices_to_ranges(&indices).unwrap();
 3942 |         assert_eq!(ranges, vec![1..4, 5..8, 9..10]);
 3943 |     }
 3944 | 
 3945 |     #[test]
 3946 |     fn test_estimate_bytes_per_row() {
 3947 |         assert_eq!(estimate_bytes_per_row(&DataType::Int32), 4.0);
 3948 |         assert_eq!(estimate_bytes_per_row(&DataType::Int64), 8.0);
 3949 |         assert_eq!(estimate_bytes_per_row(&DataType::Float32), 4.0);
 3950 |         assert_eq!(estimate_bytes_per_row(&DataType::Boolean), 1.0 / 8.0);
 3951 |         assert_eq!(estimate_bytes_per_row(&DataType::Utf8), 64.0);
 3952 |         assert_eq!(estimate_bytes_per_row(&DataType::Binary), 64.0);
 3953 |         // Struct of 4 x Int32 = 16 bytes
 3954 |         let struct_type = DataType::Struct(Fields::from(vec![
 3955 |             ArrowField::new("a", DataType::Int32, false),
 3956 |             ArrowField::new("b", DataType::Int32, false),
 3957 |             ArrowField::new("c", DataType::Int32, false),
 3958 |             ArrowField::new("d", DataType::Int32, false),
 3959 |         ]));
 3960 |         assert_eq!(estimate_bytes_per_row(&struct_type), 16.0);
 3961 |     }
 3962 | 
 3963 |     /// Helper: encode a batch, then decode it as a stream with optional
 3964 |     /// `batch_size_bytes`, collecting all output batches.
 3965 |     async fn decode_batches_with_byte_limit(
 3966 |         batch: &RecordBatch,
 3967 |         batch_size: u32,
 3968 |         batch_size_bytes: Option<u64>,
 3969 |     ) -> Vec<RecordBatch> {
 3970 |         use crate::{
 3971 |             encoder::{EncodingOptions, encode_batch},
 3972 |             testing::{TestEncoding, test_encoding_strategy},
 3973 |         };
 3974 | 
 3975 |         let version = TestEncoding::StructuralU16;
 3976 |         let options = EncodingOptions::default();
 3977 |         let strategy = test_encoding_strategy(version);
 3978 |         let schema = Schema::try_from(batch.schema().as_ref()).unwrap();
 3979 |         let encoded = encode_batch(batch, Arc::new(schema.clone()), strategy.as_ref(), &options)
 3980 |             .await
 3981 |             .unwrap();
 3982 | 
 3983 |         let io_scheduler =
 3984 |             Arc::new(BufferScheduler::new(encoded.data.clone())) as Arc<dyn EncodingsIo>;
 3985 |         let cache = Arc::new(lance_core::cache::LanceCache::with_capacity(
 3986 |             128 * 1024 * 1024,
 3987 |         ));
 3988 |         let decoder_plugins = Arc::new(DecoderPlugins::default());
 3989 | 
 3990 |         let mut decode_scheduler = DecodeBatchScheduler::try_new(
 3991 |             encoded.schema.as_ref(),
 3992 |             &encoded.top_level_columns,
 3993 |             &encoded.page_table,
 3994 |             &vec![],
 3995 |             encoded.num_rows,
 3996 |             decoder_plugins,
 3997 |             io_scheduler.clone(),
 3998 |             cache,
 3999 |             &FilterExpression::no_filter(),
 4000 |             &DecoderConfig::default(),
 4001 |         )
 4002 |         .await
 4003 |         .unwrap();
 4004 | 
 4005 |         let (tx, rx) = unbounded_channel();
 4006 |         decode_scheduler.schedule_range(
 4007 |             0..encoded.num_rows,
 4008 |             &FilterExpression::no_filter(),
 4009 |             tx,
 4010 |             io_scheduler,
 4011 |         );
 4012 | 
 4013 |         let mut decode_stream = create_decode_stream(
 4014 |             &encoded.schema,
 4015 |             encoded.num_rows,
 4016 |             batch_size,
 4017 |             /*is_structural=*/ true,
 4018 |             /*should_validate=*/ true,
 4019 |             /*spawn_structural_batch_decode_tasks=*/ true,
 4020 |             rx,
 4021 |             batch_size_bytes,
 4022 |         )
 4023 |         .unwrap();
 4024 | 
 4025 |         let mut batches = Vec::new();
 4026 |         while let Some(task) = decode_stream.next().await {
 4027 |             batches.push(task.task.await.unwrap());
 4028 |         }
 4029 |         batches
 4030 |     }
 4031 | 
 4032 |     #[tokio::test]
 4033 |     async fn test_byte_sized_batches_fixed_width() {
 4034 |         use arrow_array::Int32Array;
 4035 | 
 4036 |         // 1000 rows x 4 Int32 columns = 16 bytes/row
 4037 |         let num_rows: i32 = 1000;
 4038 |         let arrays: Vec<Arc<dyn arrow_array::Array>> = (0..4)
 4039 |             .map(|col| {
 4040 |                 Arc::new(Int32Array::from_iter_values(
 4041 |                     (0..num_rows).map(move |row| row * 10 + col),
 4042 |                 )) as _
 4043 |             })
 4044 |             .collect();
 4045 | 
 4046 |         let schema = Arc::new(ArrowSchema::new(vec![
 4047 |             ArrowField::new("a", DataType::Int32, false),
 4048 |             ArrowField::new("b", DataType::Int32, false),
 4049 |             ArrowField::new("c", DataType::Int32, false),
 4050 |             ArrowField::new("d", DataType::Int32, false),
 4051 |         ]));
 4052 |         let input_batch = RecordBatch::try_new(schema, arrays).unwrap();
 4053 | 
 4054 |         // 16 bytes/row, batch_size_bytes=1600 => 100 rows/batch
 4055 |         let batches =
 4056 |             decode_batches_with_byte_limit(&input_batch, /*batch_size=*/ 1024, Some(1600)).await;
 4057 | 
 4058 |         // Should produce 10 batches of 100 rows each
 4059 |         assert_eq!(batches.len(), 10);
 4060 |         for (i, batch) in batches.iter().enumerate() {
 4061 |             assert_eq!(
 4062 |                 batch.num_rows(),
 4063 |                 100,
 4064 |                 "batch {i} should have 100 rows, got {}",
 4065 |                 batch.num_rows()
 4066 |             );
 4067 |         }
 4068 | 
 4069 |         // Verify roundtrip: concatenate and compare
 4070 |         let all_batches: Vec<&RecordBatch> = batches.iter().collect();
 4071 |         let concatenated =
 4072 |             arrow_select::concat::concat_batches(&batches[0].schema(), all_batches.iter().copied())
 4073 |                 .unwrap();
 4074 |         assert_eq!(concatenated.num_rows(), num_rows as usize);
 4075 |         for col in 0..4 {
 4076 |             assert_eq!(
 4077 |                 concatenated.column(col).as_ref(),
 4078 |                 input_batch.column(col).as_ref(),
 4079 |                 "column {col} roundtrip mismatch"
 4080 |             );
 4081 |         }
 4082 |     }
 4083 | 
 4084 |     #[tokio::test]
 4085 |     async fn test_byte_sized_batches_none_unchanged() {
 4086 |         use arrow_array::Int32Array;
 4087 | 
 4088 |         // Without batch_size_bytes, rows_per_batch controls batching
 4089 |         let num_rows: i32 = 1000;
 4090 |         let arrays: Vec<Arc<dyn arrow_array::Array>> = (0..2)
 4091 |             .map(|col| {
 4092 |                 Arc::new(Int32Array::from_iter_values(
 4093 |                     (0..num_rows).map(move |row| row * 10 + col),
 4094 |                 )) as _
 4095 |             })
 4096 |             .collect();
 4097 | 
 4098 |         let schema = Arc::new(ArrowSchema::new(vec![
 4099 |             ArrowField::new("x", DataType::Int32, false),
 4100 |             ArrowField::new("y", DataType::Int32, false),
 4101 |         ]));
 4102 |         let input_batch = RecordBatch::try_new(schema, arrays).unwrap();
 4103 | 
 4104 |         // batch_size=250, batch_size_bytes=None => 4 batches of 250 rows
 4105 |         let batches = decode_batches_with_byte_limit(&input_batch, /*batch_size=*/ 250, None).await;
 4106 |         assert_eq!(batches.len(), 4);
 4107 |         for (i, batch) in batches.iter().enumerate() {
 4108 |             assert_eq!(
 4109 |                 batch.num_rows(),
 4110 |                 250,
 4111 |                 "batch {i} should have 250 rows, got {}",
 4112 |                 batch.num_rows()
 4113 |             );
 4114 |         }
 4115 |     }
 4116 | 
 4117 |     #[tokio::test]
 4118 |     async fn test_byte_sized_batches_respect_row_limit() {
 4119 |         use arrow_array::Int32Array;
 4120 | 
 4121 |         let num_rows: i32 = 1000;
 4122 |         let schema = Arc::new(ArrowSchema::new(vec![ArrowField::new(
 4123 |             "x",
 4124 |             DataType::Int32,
 4125 |             false,
 4126 |         )]));
 4127 |         let input_batch = RecordBatch::try_new(
 4128 |             schema,
 4129 |             vec![Arc::new(Int32Array::from_iter_values(0..num_rows))],
 4130 |         )
 4131 |         .unwrap();
 4132 | 
 4133 |         // The byte limit can hold every row, so the 100-row limit must win.
 4134 |         let batches =
 4135 |             decode_batches_with_byte_limit(&input_batch, /*batch_size=*/ 100, Some(10_000)).await;
 4136 |         assert_eq!(batches.len(), 10);
 4137 |         assert!(batches.iter().all(|batch| batch.num_rows() == 100));
 4138 |     }
 4139 | 
 4140 |     #[tokio::test]
 4141 |     async fn test_byte_sized_batches_feedback_convergence() {
 4142 |         use arrow_array::StringArray;
 4143 | 
 4144 |         // Each row has a 100-byte string. Schema estimate = 64 bytes (default
 4145 |         // for Utf8), so the first batch will overshoot. The feedback loop
 4146 |         // should correct subsequent batches toward the target.
 4147 |         let num_rows = 500;
 4148 |         let value: String = "x".repeat(100);
 4149 |         let arrays: Vec<Arc<dyn arrow_array::Array>> = vec![Arc::new(StringArray::from(
 4150 |             (0..num_rows).map(|_| value.as_str()).collect::<Vec<_>>(),
 4151 |         ))];
 4152 |         let schema = Arc::new(ArrowSchema::new(vec![ArrowField::new(
 4153 |             "s",
 4154 |             DataType::Utf8,
 4155 |             false,
 4156 |         )]));
 4157 |         let input_batch = RecordBatch::try_new(schema, arrays).unwrap();
 4158 | 
 4159 |         // Target 5000 bytes/batch. At 100 bytes/row the ideal is 50 rows/batch.
 4160 |         // Schema estimate is 64 bytes/row → first batch ~78 rows (overshoot).
 4161 |         // After feedback kicks in, batches should converge to ~50 rows.
 4162 |         let target_bytes: u64 = 5000;
 4163 |         let batches = decode_batches_with_byte_limit(
 4164 |             &input_batch,
 4165 |             /*batch_size=*/ 1024,
 4166 |             Some(target_bytes),
 4167 |         )
 4168 |         .await;
 4169 | 
 4170 |         // Verify all data round-trips correctly
 4171 |         let all_batches: Vec<&RecordBatch> = batches.iter().collect();
 4172 |         let concatenated =
 4173 |             arrow_select::concat::concat_batches(&batches[0].schema(), all_batches.iter().copied())
 4174 |                 .unwrap();
 4175 |         assert_eq!(concatenated.num_rows(), num_rows as usize);
 4176 |         assert_eq!(
 4177 |             concatenated.column(0).as_ref(),
 4178 |             input_batch.column(0).as_ref()
 4179 |         );
 4180 | 
 4181 |         // After the first batch, subsequent batches should be closer to the
 4182 |         // target. The ideal is 50 rows/batch.
 4183 |         assert!(
 4184 |             batches.len() >= 2,
 4185 |             "need at least 2 batches to test convergence"
 4186 |         );
 4187 |         // The first batch uses the schema estimate (64 bytes/row) →
 4188 |         // ~78 rows. After feedback the rows should settle near 50.
 4189 |         if batches.len() >= 3 {
 4190 |             let second_batch_rows = batches[1].num_rows();
 4191 |             let third_batch_rows = batches[2].num_rows();
 4192 |             // Both should be within 20% of the ideal (50 rows)
 4193 |             assert!(
 4194 |                 (40..=60).contains(&second_batch_rows),
 4195 |                 "second batch should be near 50 rows, got {second_batch_rows}"
 4196 |             );
 4197 |             assert!(
 4198 |                 (40..=60).contains(&third_batch_rows),
 4199 |                 "third batch should be near 50 rows, got {third_batch_rows}"
 4200 |             );
 4201 |         }
 4202 |     }
 4203 | }
``````
