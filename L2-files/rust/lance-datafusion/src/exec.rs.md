# Key File: rust/lance-datafusion/src/exec.rs

**V2.1 selected contract record.** Verified entry/protocol ranges: `721-761`. The rest of this file has Module Map coverage; this is not a claim of line-by-line analysis. Tests/generated code are excluded. [Module Map](../../../../L1-modules/rust-lance-datafusion.md).

## Responsibility and interfaces

Turns a physical ExecutionPlan into a RecordBatch stream.

Single-partition plans execute directly; ordered multi-partition output uses SortPreservingMergeExec.

Unordered multi-partition output uses CoalescePartitionsExec.

The final stream reports plan metrics through its completion callback.

## Behavior and change boundaries

### Output ordering

execute_plan preserves known output ordering when merging multiple partitions; blindly coalescing them would scramble that ordering. (rust/lance-datafusion/src/exec.rs:721-761)

## Read next

Use the owning Module Map for callers/callees and the L0 trace for publication/query ordering. Exact implementation details outside the verified ranges require source reading; do not infer stronger validation or rollback guarantees from this record.
