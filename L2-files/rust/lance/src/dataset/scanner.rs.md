# Key File: rust/lance/src/dataset/scanner.rs

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../../../../../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../../../../../L3-symbols/refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../../../../../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**V2.1 selected contract record.** Verified entry/protocol ranges: `2999-3042,3633-3801`. The rest of this file has Module Map coverage; this is not a claim of line-by-line analysis. Tests/generated code are excluded. [Module Map](../../../../../L1-modules/rust-lance.md).

## Responsibility and interfaces

Turns configured requests into physical plans and batch streams.

Validate options before choosing vector, full-text, MinHash or filtered read sources.

Planning separates source/filter/order/limit/projection stages.

Read this file for query behavior; physical execution support lives in lance-datafusion.

## Behavior and change boundaries

### Query planning

Scalar index use requires prefiltering or no nearest search. Nearest/full-text/MinHash modes cannot be combined indiscriminately. (rust/lance/src/dataset/scanner.rs:3716-3801)

## Read next

Use the owning Module Map for callers/callees and the L0 trace for publication/query ordering. Exact implementation details outside the verified ranges require source reading; do not infer stronger validation or rollback guarantees from this record.

## Changed contract addendum — 2026-10-07

Pinned `84d1681e07af565837f2d97e72ff1b8b040cd15c`. The [current delta contracts](../../../../../L3-symbols/refresh-2026-10-07.md) amend the affected behavior in this selected record. Relevant topics follow the owning file: Dataset clone/base handling; scanner schema projection/aggregate naming; optimize managed preservation and stable-ID address remapping; scalar streaming interfaces; plugin persisted-version loading; Python cache deprecation. Unchanged clauses and the stated selective verification boundary remain in force.

## Delta contract — 2026-10-09

Pin `db684d1f0726c00b6defb7963a604a7719e82b5a`. A01–A04: pinned scalar count, contributor validation and fast-search output projection. See [current clauses](../../../../../L3-symbols/refresh-2026-10-09.md). Unchanged analysis and selective coverage bounds are retained.

## Refresh addendum — 2026-10-11

Pin `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`. Production hunks reviewed; see current contract changes. [Delta contract](../../../../../L3-symbols/refresh-2026-10-11.md).
