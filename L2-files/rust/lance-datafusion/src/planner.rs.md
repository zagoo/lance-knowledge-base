# Key File: rust/lance-datafusion/src/planner.rs

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../../../../L3-symbols/refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../../../../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**V2.1 selected contract record.** Verified entry/protocol ranges: `280-350`. The rest of this file has Module Map coverage; this is not a claim of line-by-line analysis. Tests/generated code are excluded. [Module Map](../../../../L1-modules/rust-lance-datafusion.md).

## Responsibility and interfaces

Parses expressions in a schema-aware Lance context.

Relations are disabled by default; qualified names otherwise mean struct field access.

Column lookup prefers an exact schema name before case-insensitive matching.

Use this boundary for expression-name behavior; physical pushdown is a separate Dataset provider/scanner concern.

## Behavior and change boundaries

### Identifier resolution

Planner defaults enable_relations=false. Exact field-name matching wins, then ASCII-insensitive matching; an unknown name is retained for later resolution. (rust/lance-datafusion/src/planner.rs:280-350)

## Read next

Use the owning Module Map for callers/callees and the L0 trace for publication/query ordering. Exact implementation details outside the verified ranges require source reading; do not infer stronger validation or rollback guarantees from this record.

## Changed contract addendum — 2026-10-07

Pinned `84d1681e07af565837f2d97e72ff1b8b040cd15c`. The [current delta contracts](../../../../L3-symbols/refresh-2026-10-07.md) amend the affected behavior in this selected record. Relevant topics follow the owning file: Dataset clone/base handling; scanner schema projection/aggregate naming; optimize managed preservation and stable-ID address remapping; scalar streaming interfaces; plugin persisted-version loading; Python cache deprecation. Unchanged clauses and the stated selective verification boundary remain in force.

## Delta contract — 2026-10-09

Pin `db684d1f0726c00b6defb7963a604a7719e82b5a`. Only excluded test hunks changed; production behavior retained. See [current clauses](../../../../L3-symbols/refresh-2026-10-09.md). Unchanged analysis and selective coverage bounds are retained.
