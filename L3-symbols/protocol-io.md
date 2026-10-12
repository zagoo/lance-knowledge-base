# I/O scheduling and backpressure contract

**Trust: checked production contract.** Source snapshot is recorded in [CORE-MANIFEST](../CORE-MANIFEST.json). [I/O Module Map](../L1-modules/rust-lance-io.md) · [decoder aggregation contract](behavior-contracts.md#configuration-and-request-aggregation) · [Reader/Writer Key File](../L2-files/rust/lance-io/src/traits.rs.md). External object-store implementations and platform kernels are outside scope.

## Admission is a progress policy, not a memory ceiling

`ScanScheduler` chooses standard versus lite using `SchedulerConfig.use_lite_scheduler`; None defers to the ObjectStore preference. `SchedulerConfig::new` reads trimmed `LANCE_USE_LITE_SCHEDULER` at construction; explicit Some values override the store. `max_bandwidth` chooses 32 MiB times store I/O parallelism. Configuration does not assert that the resulting bytes are a hard resident-memory limit. (rust/lance-io/src/scheduler.rs:837-919)

| Property | Standard scheduler | Lite scheduler |
|---|---|---|
| Execution | Background queue loop spawns each admitted I/O task | Constructs task futures on admission; caller polling drives them |
| Concurrency | Requires an available I/O slot even for bypass reads | No IOPS limit; supplied concurrency sizes priority storage |
| Byte admission | Budget suffices **or** no-backpressure/bypass **or** priority is at least as urgent as all in flight **or** same priority is already admitted | Equivalent byte/priority progress exceptions; bypass force-reserves zero bytes |
| Priority | Bypass class before ordinary; within class lower numeric priority first | Pending entries prefer already-reserved, then lower numeric priority; bypass starts via forced reservation |
| Release | I/O completion returns concurrency slot; Response destruction returns byte reservation and priority entries | Consuming finished result or abandoning its handle releases reservation and checks pending work |
| Shutdown | Cancel queued tasks; already-dispatched tasks may drain | Close removes/cancels tasks; a subsequently polled removed handle reports lost-task error |

Evidence: rust/lance-io/src/scheduler.rs:56-139; rust/lance-io/src/scheduler.rs:217-368; rust/lance-io/src/scheduler.rs:518-586; rust/lance-io/src/scheduler.rs:816-834; rust/lance-io/src/scheduler/lite.rs:4-17; rust/lance-io/src/scheduler/lite.rs:354-388; rust/lance-io/src/scheduler/lite.rs:405-466; rust/lance-io/src/scheduler/lite.rs:541-715.

Lower numeric priority is more urgent. File priority occupies the upper 64 bits and request priority the lower 64. Empty in-flight state uses `u128::MAX` as minimum, allowing initial progress even for an oversized request. All chunks of an admitted priority may proceed even if a later more urgent request is awaiting consumption. Both exceptions can overdraw the byte budget; replacing them with an unconditional cap can deadlock request dependencies. `io_buffer_size == 0` disables byte backpressure. (rust/lance-io/src/scheduler.rs:56-139; rust/lance-io/src/scheduler.rs:231-264; rust/lance-io/src/scheduler.rs:1196-1202; rust/lance-io/src/scheduler/lite.rs:267-331; rust/lance-io/src/scheduler/lite.rs:354-388)

`with_bypass_backpressure` is for indirect reads needed to discover ranges of already-admitted work, such as offsets. Standard bypass reads still consume IOPS but neither debit nor refund bytes; lite records a zero-byte reservation. Do not make every data read bypass: the purpose is to break a dependency cycle, not remove ordinary throttling. The last sentence is the design consequence of the cited mechanism. (rust/lance-io/src/scheduler.rs:248-264; rust/lance-io/src/scheduler.rs:418-448; rust/lance-io/src/scheduler.rs:1340-1352; rust/lance-io/src/scheduler/lite.rs:381-387)

## File request transformation and result ownership

`FileScheduler::submit_request` requires start-sorted ranges and returns InvalidInput on the first descending start pair. It merges nearby/overlapping ranges using store block size, splits nonempty merged ranges using maximum IOP size, records those actual requests in root/optional extra statistics, and submits them with composed priority. The split is balanced: the last chunk absorbs division remainder. Result reconstruction restores original request order; an original range inside one returned chunk uses a shared Bytes slice, while a range spanning chunks allocates/copies a combined buffer. Do not infer validation of every range endpoint from the sorted-start check. (rust/lance-io/src/scheduler.rs:1181-1312)

Opening by path probes size only if CachedFileSize is absent, caches nonzero sizes and uses `open_with_size`. `open_reader` accepts an existing Reader without a path lookup or size probe, but still takes block/max-IOP sizing from the scheduler's store. Priority/statistics clones reuse that reader. (rust/lance-io/src/scheduler.rs:930-993; rust/lance-io/src/scheduler.rs:1315-1338)

Standard requests are queued at submission, before the returned future is polled. Each task result goes into its original slot. Batch destruction returns an error if any slot was never delivered, rather than success with default empty buffers. Response destruction refunds reservation even when the receiving future was dropped. This budget covers unconsumed scheduler responses: once bytes are handed to the caller, retaining those Bytes is no longer accounted by that reservation. Underlying read completion and caller buffer lifetime are distinct. (rust/lance-io/src/scheduler.rs:391-448; rust/lance-io/src/scheduler.rs:816-834; rust/lance-io/src/scheduler.rs:995-1061)

Lite submits **all** ranges before awaiting any handle, then awaits them in request order. Each task transitions Initial → Reserved → Running → Finished; only polling drives its inner future. `TaskHandle::drop` removes the task, releases any reservation and wakes newly admissible work; stale heap entries are discarded rather than repeatedly blocking the head. This makes prompt handle destruction part of the cancellation contract. It does not promise OS/network cancellation behavior. (rust/lance-io/src/scheduler.rs:1064-1101; rust/lance-io/src/scheduler/lite.rs:43-224; rust/lance-io/src/scheduler/lite.rs:606-715)

Both routes validate returned read length before delivering bytes. The standard path special-cases an empty range to empty Bytes without Reader I/O. Lite invokes Reader for its range. Standard scheduler shutdown does not terminate already spawned tasks; lite close removes them from its task map. Thus the facade comment about cancelling outstanding work must not be interpreted as identical task lifetime for both implementations. (rust/lance-io/src/scheduler.rs:538-567; rust/lance-io/src/scheduler.rs:1079-1085; rust/lance-io/src/scheduler.rs:1137-1153; rust/lance-io/src/scheduler/lite.rs:645-697)

## Decoder-to-storage boundary

The frozen decoder's `RequestBatch` aggregates at 8 MiB, flushing the prior queue only when adding a request would exceed that target. A single oversized request remains allowed. A polled unresolved reply flushes queued work; multiple requests are stable-sorted by `(start,end)`, forwarded with minimum priority and reconstructed to each caller's order. They are not merged by this layer; FileScheduler does the later coalescing. Bypass and statistics hooks delegate through the wrapper. (rust/lance-encoding/src/decoder.rs:2863-3064)

Reader is a range-access interface; its default stream materializes Bytes first. Writer shutdown returns a WriteResult, not a committed Dataset. File/decoder task cancellation and manifest publication have different contracts; consult [commit recovery](protocol-commit.md) before cleaning files after a failed operation. (rust/lance-io/src/traits.rs:24-43; rust/lance-io/src/traits.rs:136-177)

## Ordered read set for a scheduling change

1. `rust/lance-io/src/scheduler.rs:837-919,1181-1352` — configuration, range transformation and bypass facade.
2. `rust/lance-io/src/scheduler.rs:217-368,816-834,995-1153` — standard admission, refund, dispatch and shutdown.
3. `rust/lance-io/src/scheduler/lite.rs:354-388,541-715` — alternate admission/poll/drop path.
4. [Frozen decoder record](../L2-files/rust/lance-encoding/src/decoder.rs.md), then `rust/lance-encoding/src/decoder.rs:2863-3064` only for upstream batching changes.
5. [Reader/Writer record](../L2-files/rust/lance-io/src/traits.rs.md), then `rust/lance-io/src/traits.rs:136-177` if backend contract changes.

This is four unique source files. A backend/platform implementation is a separate mapped-only task. No runtime throughput, deadlock stress or platform I/O qualification is claimed.

## Current delta — 2026-10-11

[Current refresh contracts](refresh-2026-10-11.md) supersede changed field-ID/transaction, unstable encoding, cache, API, MemWAL and index-coverage statements at the new pin. Follow the task index for bounded source reading.
