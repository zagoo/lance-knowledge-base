# Key File: rust/lance/src/dataset/optimize.rs

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../../../../../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../../../../../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**V2.1 selected contract record.** Verified entry/protocol ranges: `1028-1152,2494-2569,3227-3337,3662-3693`. The rest of this file has Module Map coverage; this is not a claim of line-by-line analysis. Tests/generated code are excluded. [Module Map](../../../../../L1-modules/rust-lance.md).

## Responsibility and interfaces

Coordinates planner tasks, rewrite work and compaction publication.

Carries original read versions through distributed RewriteResults.

Uses the minimum task read version for conflict coverage.

Tagged fragment-reuse histories require deferred remapping in the checked path.

## Behavior and change boundaries

### Compaction conflicts

A refreshed Dataset handle must not replace the original task read version; doing so would skip intervening writes during conflict checks. (rust/lance/src/dataset/optimize.rs:3274-3297; rust/lance/src/dataset/optimize.rs:3662-3693)

## Read next

Use the owning Module Map for callers/callees and the L0 trace for publication/query ordering. Exact implementation details outside the verified ranges require source reading; do not infer stronger validation or rollback guarantees from this record.

## Changed contract addendum — 2026-10-07

Pinned `84d1681e07af565837f2d97e72ff1b8b040cd15c`. The [current delta contracts](../../../../../L3-symbols/refresh-2026-10-07.md) amend the affected behavior in this selected record. Relevant topics follow the owning file: Dataset clone/base handling; scanner schema projection/aggregate naming; optimize managed preservation and stable-ID address remapping; scalar streaming interfaces; plugin persisted-version loading; Python cache deprecation. Unchanged clauses and the stated selective verification boundary remain in force.

## Refresh addendum — 2026-10-11

Pin `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`. Only excluded tests or metadata drift changed; production behavior retained. [Delta contract](../../../../../L3-symbols/refresh-2026-10-11.md).
