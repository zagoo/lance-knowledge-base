# Key File: rust/lance-io/src/scheduler.rs

**V2.1 selected contract record.** Verified entry/protocol ranges: `795-859,889-930,1315-1352`. The rest of this file has Module Map coverage; this is not a claim of line-by-line analysis. Tests/generated code are excluded. [Module Map](../../../../L1-modules/rust-lance-io.md).

## Responsibility and interfaces

Owns scheduled requests, buffer budget and shared I/O statistics.

SchedulerConfig can force lite/standard behavior or defer to store preference.

Response drop refunds the standard queue reservation, including undelivered cancelled responses.

Indirect reads have an explicit bypass-backpressure handle to avoid dependency deadlock.

## Behavior and change boundaries

### Buffer policy

io_buffer_size_bytes controls queued/unconsumed buffering. use_lite_scheduler Some(true/false) forces a choice; None uses the store preference. The environment is read when constructing config. (rust/lance-io/src/scheduler.rs:836-859; rust/lance-io/src/scheduler.rs:889-920)

### Cancellation accounting

Standard Response::drop refunds its byte/request reservation; direct ScanScheduler users must retain the scheduler through outstanding I/O. (rust/lance-io/src/scheduler.rs:795-834)

### Indirect reads

with_bypass_backpressure clones a FileScheduler with bypass enabled; it is intended for dependent reads after decoding offsets. It is not the default for arbitrary bulk scans. (rust/lance-io/src/scheduler.rs:1343-1352)

## Read next

Use the owning Module Map for callers/callees and the L0 trace for publication/query ordering. Exact implementation details outside the verified ranges require source reading; do not infer stronger validation or rollback guarantees from this record.
