# Key File: rust/lance/src/dataset.rs

> Refresh 2026-10-12, `011953c22097b67b699595adbe99e7f0155d83e4`: source coordinates updated. [Changed contracts](../../../../L3-symbols/refresh-2026-10-12.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../../../../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../../../../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**V2.1 selected contract record.** Verified entry/protocol ranges: `951-980,1688-1705`. The rest of this file has Module Map coverage; this is not a claim of line-by-line analysis. Tests/generated code are excluded. [Module Map](../../../../L1-modules/rust-lance.md).

## Responsibility and interfaces

Owns the public Dataset write and scan entry points.

Write delegates to InsertBuilder and returns the committed Dataset.

Scan creates a Scanner over a cloned snapshot.

Read these entry ranges before following the four paths in L0.

## Behavior and change boundaries

### Public mutation boundary

Dataset::write → InsertBuilder::execute_stream → CommitBuilder. Uncommitted insert methods deliberately omit manifest publication. (rust/lance/src/dataset.rs:951-980; rust/lance/src/dataset/write/insert.rs:108-183)

## Read next

Use the owning Module Map for callers/callees and the L0 trace for publication/query ordering. Exact implementation details outside the verified ranges require source reading; do not infer stronger validation or rollback guarantees from this record.

## Changed contract addendum — 2026-10-07

Pinned `84d1681e07af565837f2d97e72ff1b8b040cd15c`. The [current delta contracts](../../../../L3-symbols/refresh-2026-10-07.md) amend the affected behavior in this selected record. Relevant topics follow the owning file: Dataset clone/base handling; scanner schema projection/aggregate naming; optimize managed preservation and stable-ID address remapping; scalar streaming interfaces; plugin persisted-version loading; Python cache deprecation. Unchanged clauses and the stated selective verification boundary remain in force.

## Refresh addendum — 2026-10-11

Pin `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`. Production hunks reviewed; see current contract changes. [Delta contract](../../../../L3-symbols/refresh-2026-10-11.md).
