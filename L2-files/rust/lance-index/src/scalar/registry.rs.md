# Key File: rust/lance-index/src/scalar/registry.rs

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../../../../../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**V2.1 selected contract record.** Verified entry/protocol ranges: `29-200`. The rest of this file has Module Map coverage; this is not a claim of line-by-line analysis. Tests/generated code are excluded. [Module Map](../../../../../L1-modules/rust-lance-index.md).

## Responsibility and interfaces

Separates training request/criteria from prepared training data.

Plugins supply load/query-parser/version/exactness behavior.

The caller must satisfy training criteria and persist returned details.

Asynchronous batch remapping is an additive capability, not automatic legacy fallback.

## Behavior and change boundaries

### Training

new_training_request returns criteria; the caller prepares the stream before train_index and stores the returned details for load_index. A plugin may have no BasicTrainer. (rust/lance-index/src/scalar/registry.rs:29-176)

## Read next

Use the owning Module Map for callers/callees and the L0 trace for publication/query ordering. Exact implementation details outside the verified ranges require source reading; do not infer stronger validation or rollback guarantees from this record.

## Changed contract addendum — 2026-10-07

Pinned `84d1681e07af565837f2d97e72ff1b8b040cd15c`. The [current delta contracts](../../../../../L3-symbols/refresh-2026-10-07.md) amend the affected behavior in this selected record. Relevant topics follow the owning file: Dataset clone/base handling; scanner schema projection/aggregate naming; optimize managed preservation and stable-ID address remapping; scalar streaming interfaces; plugin persisted-version loading; Python cache deprecation. Unchanged clauses and the stated selective verification boundary remain in force.
