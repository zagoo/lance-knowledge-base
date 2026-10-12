# Key File: python/src/dataset.rs

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../../../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../../../L3-symbols/refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../../../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**V2.1 selected contract record.** Verified entry/protocol ranges: `4920-4959`. The rest of this file has Module Map coverage; this is not a claim of line-by-line analysis. Tests/generated code are excluded. [Module Map](../../../L1-modules/python.md).

## Responsibility and interfaces

Primary PyO3 Dataset bridge, including write stream conversion.

A native Scanner obtains a reader; other inputs use ArrowArrayStreamReader.

Both branches await Rust LanceDataset::write on the shared runtime.

Write-mode parsing accepts lowercase-normalized create/append/overwrite and rejects other strings.

## Behavior and change boundaries

### Write mapping

Python write_dataset calls _write_dataset, stores the returned handle and URI, and clears per-instance default scan/read params. The Rust shim invokes LanceDataset::write and maps engine errors to PyIOError. (python/python/lance/dataset.py:8405-8432; python/src/dataset.rs:4920-4949)

## Read next

Use the owning Module Map for callers/callees and the L0 trace for publication/query ordering. Exact implementation details outside the verified ranges require source reading; do not infer stronger validation or rollback guarantees from this record.

## Delta contract — 2026-10-09

Pin `db684d1f0726c00b6defb7963a604a7719e82b5a`. A06: current_version and fallible dictionary conversion. See [current clauses](../../../L3-symbols/refresh-2026-10-09.md). Unchanged analysis and selective coverage bounds are retained.

## Refresh addendum — 2026-10-11

Pin `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`. Production hunks reviewed; see current contract changes. [Delta contract](../../../L3-symbols/refresh-2026-10-11.md).
