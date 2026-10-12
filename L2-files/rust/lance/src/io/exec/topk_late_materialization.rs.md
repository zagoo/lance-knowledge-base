# Key File: rust/lance/src/io/exec/topk_late_materialization.rs

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../../../../../../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

Selected contract record, 2026-10-09, pin `db684d1f0726c00b6defb7963a604a7719e82b5a`. Production range read: `rust/lance/src/io/exec/topk_late_materialization.rs:1-446`. Tests are excluded. [Module Map](../../../../../../L1-modules/rust-lance.md#rust-lance-src-io-exec) · [Contract](../../../../../../L3-symbols/refresh-2026-10-09.md#top-k-query-materialization).

## Interface and ownership

Public TopKLateMaterialization implements PhysicalOptimizerRule; ReadEligibility and PassThrough are caller closures. new() accepts eligible reads and only built-in pass-through nodes by default. with_read_eligibility can exclude reads; with_pass_through adds certified custom nodes. The caller must register this optimizer in its session. `rust/lance/src/io/exec/topk_late_materialization.rs:69-134,326-353`.

## Rewrite trace

1. Recognize fetched SortExec, or fetched merge directly above a partition-preserving fetched sort. Walk single-input nodes until a non-row-stream FilteredReadExec. Drop intermediate takes/row-stream reads only after checking the dataset URI and version agree. `rust/lance/src/io/exec/topk_late_materialization.rs:136-199`.
2. Reject deleted-row reads, caller-ineligible reads and known limits that keep every input row. Retain blob handling and requested system-column behavior while narrowing to sort keys plus row ID. `rust/lance/src/io/exec/topk_late_materialization.rs:200-235`.
3. Rebind sort expressions by name to narrowed schemas; preserve sort/merge fetch limits. Take deferred columns after the top-k, project original names/order, reapply certified metadata-changing wrappers, and require exact output schema equality. If all columns were already needed, decline the transformation. `rust/lance/src/io/exec/topk_late_materialization.rs:237-267,409-446`.
4. Optimization is top-down. A successful rewrite skips descent through its rewritten node; rejection logs a debug reason and retains the old plan. `rust/lance/src/io/exec/topk_late_materialization.rs:326-353`.

## Modification invariants

Column projections cannot compute or rename; hash repartition is rejected. Custom wrappers must preserve row values and column meanings, use one child, retain fields, report equal cardinality, carry no fetch, and hold no schema column indices. Equal cardinality alone is insufficient. Rebuild projection lists retain internal row ID. `rust/lance/src/io/exec/topk_late_materialization.rs:122-127,270-322,355-406`.

Take ordering propagation lives in a separate file and must not claim unchanged orderable fields after extending an input struct. No external DataFusion optimizer implementation was analyzed, and no runtime/performance claim follows from this static record. `rust/lance/src/io/exec/take.rs:574-590,610-623,697-701`.

## Refresh addendum — 2026-10-11

Pin `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`. Production hunks reviewed; see current contract changes. [Delta contract](../../../../../../L3-symbols/refresh-2026-10-11.md).
