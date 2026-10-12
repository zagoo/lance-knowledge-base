# Key File: rust/lance/src/dataset/write/insert.rs

> Refresh 2026-10-12, `011953c22097b67b699595adbe99e7f0155d83e4`: source coordinates updated. [Changed contracts](../../../../../../L3-symbols/refresh-2026-10-12.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../../../../../../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../../../../../../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**V2.1 selected contract record.** Verified entry/protocol ranges: `108-320`. The rest of this file has Module Map coverage; this is not a claim of line-by-line analysis. Tests/generated code are excluded. [Module Map](../../../../../../L1-modules/rust-lance.md).

## Responsibility and interfaces

Converts inputs to a stream/schema and writes uncommitted fragments.

Builds Overwrite or Append transaction intent from write mode.

The committed path configures CommitBuilder; uncommitted methods stop before publication.

Use this boundary when changing ingestion parameters or commit timing.

## Behavior and change boundaries

### Public mutation boundary

Dataset::write → InsertBuilder::execute_stream → CommitBuilder. Uncommitted insert methods deliberately omit manifest publication. (rust/lance/src/dataset.rs:951-980; rust/lance/src/dataset/write/insert.rs:108-183)

## Read next

Use the owning Module Map for callers/callees and the L0 trace for publication/query ordering. Exact implementation details outside the verified ranges require source reading; do not infer stronger validation or rollback guarantees from this record.

## October 12 — generation field identity

InsertBuilder defaults keep_field_ids to false. Its crate-private with_table_field_ids opt-in preserves assigned table IDs when creating a MemWAL generation, rather than making arbitrary public Arrow IDs authoritative. Committed insert methods pass through the builder instance to do_commit, which forwards the keep-field-IDs policy to CommitBuilder. Uncommitted methods still omit manifest publication. A preassigned data-file name cannot be combined with target bases; this validation remains before writing. Both paths now use write_fragments_internal_impl, forwarding the optional name and keep-field-IDs flag.

`rust/lance/src/dataset/write/insert.rs:54-91,107-183,245-263`. See the [current contract](../../../../../../L3-symbols/refresh-2026-10-12.md) for version preparation and publication.
