# Key File: rust/lance-index-core/src/scalar.rs

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../../../../L3-symbols/refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../../../../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**V2.1 selected contract record.** Verified entry/protocol ranges: `398-480,628-762`. The rest of this file has Module Map coverage; this is not a claim of line-by-line analysis. Tests/generated code are excluded. [Module Map](../../../../L1-modules/rust-lance-index.md).

## Responsibility and interfaces

Defines query exactness, row-domain, update and remap obligations.

AtMost is a candidate superset requiring recheck; AtLeast is an incomplete guaranteed subset.

Address-domain results need dataset-level translation on stable-row-ID datasets.

Update/remap write to a destination store and return CreatedIndex metadata for caller publication.

## Behavior and change boundaries

### Search

Exact, AtMost and AtLeast encode different set guarantees; scalar results are not necessarily ordered. Default results_are_row_addresses is false. (rust/lance-index-core/src/scalar.rs:415-462; rust/lance-index-core/src/scalar.rs:628-663)

## Read next

Use the owning Module Map for callers/callees and the L0 trace for publication/query ordering. Exact implementation details outside the verified ranges require source reading; do not infer stronger validation or rollback guarantees from this record.

## Changed contract addendum — 2026-10-07

Pinned `84d1681e07af565837f2d97e72ff1b8b040cd15c`. The [current delta contracts](../../../../L3-symbols/refresh-2026-10-07.md) amend the affected behavior in this selected record. Relevant topics follow the owning file: Dataset clone/base handling; scanner schema projection/aggregate naming; optimize managed preservation and stable-ID address remapping; scalar streaming interfaces; plugin persisted-version loading; Python cache deprecation. Unchanged clauses and the stated selective verification boundary remain in force.

## Delta contract — 2026-10-09

Pin `db684d1f0726c00b6defb7963a604a7719e82b5a`. TrainingCriteria gains PartialEq/Eq for S03 validation. See [current clauses](../../../../L3-symbols/refresh-2026-10-09.md). Unchanged analysis and selective coverage bounds are retained.
