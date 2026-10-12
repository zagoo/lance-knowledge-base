# Key File: python/python/lance/dataset.py

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../../../../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../../../../L3-symbols/refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../../../../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**V2.1 selected contract record.** Verified entry/protocol ranges: `1498-1567,2940-2945,3149-3160,4609-4640,7790-7811,8405-8432`. The rest of this file has Module Map coverage; this is not a claim of line-by-line analysis. Tests/generated code are excluded. [Module Map](../../../../L1-modules/python.md).

## Responsibility and interfaces

Primary Python operation and query facade.

Scanner applies defaults first and forwards only non-None option overrides, with separate column-default handling.

Delete/update serialize Arrow expressions before calling the Rust extension.

Committed create_index returns self; write_dataset wraps the returned extension Dataset in a new Python facade.

## Behavior and change boundaries

### Scanner defaults

Non-None arguments override default scan options; columns=None uses special default-column logic. Full-text and nearest/MinHash requests are converted to builder calls before to_scanner. (python/python/lance/dataset.py:1498-1567)

### Write mapping

Python write_dataset calls _write_dataset, stores the returned handle and URI, and clears per-instance default scan/read params. The Rust shim invokes LanceDataset::write and maps engine errors to PyIOError. (python/python/lance/dataset.py:8405-8432; python/src/dataset.rs:4920-4949)

### Mutations

delete/update serialize Arrow expressions when supplied, forward conflict retry/timeout parameters, and leave engine transaction behavior to the Rust adapter/core. (python/python/lance/dataset.py:2940-2945; python/python/lance/dataset.py:3149-3160)

## Read next

Use the owning Module Map for callers/callees and the L0 trace for publication/query ordering. Exact implementation details outside the verified ranges require source reading; do not infer stronger validation or rollback guarantees from this record.

## Changed contract addendum — 2026-10-07

Pinned `84d1681e07af565837f2d97e72ff1b8b040cd15c`. The [current delta contracts](../../../../L3-symbols/refresh-2026-10-07.md) amend the affected behavior in this selected record. Relevant topics follow the owning file: Dataset clone/base handling; scanner schema projection/aggregate naming; optimize managed preservation and stable-ID address remapping; scalar streaming interfaces; plugin persisted-version loading; Python cache deprecation. Unchanged clauses and the stated selective verification boundary remain in force.

## Delta contract — 2026-10-09

Pin `db684d1f0726c00b6defb7963a604a7719e82b5a`. A06: get_version and shared timestamp conversion. See [current clauses](../../../../L3-symbols/refresh-2026-10-09.md). Unchanged analysis and selective coverage bounds are retained.

## Refresh addendum — 2026-10-11

Pin `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`. Production hunks reviewed; see current contract changes. [Delta contract](../../../../L3-symbols/refresh-2026-10-11.md).
