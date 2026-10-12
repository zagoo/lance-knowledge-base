# Key File: rust/lance/src/dataset/blob/clone.rs

> Refresh 2026-10-12, `011953c22097b67b699595adbe99e7f0155d83e4`: source coordinates updated. [Changed contracts](../../../../../../L3-symbols/refresh-2026-10-12.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../../../../../../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../../../../../../L3-symbols/refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

Selected Key File, current pin `db684d1f0726c00b6defb7963a604a7719e82b5a`, refreshed 2026-10-09 (created 2026-10-07). Verified production range: `rust/lance/src/dataset/blob/clone.rs:1-259`. This new helper is not part of the frozen snapshot. Static contract review only; runtime behavior was not tested in this KB refresh.

[Module Map](../../../../../../L1-modules/rust-lance.md#rust-lance-src-dataset-blob) · [Managed clone contract](../../../../../../L3-symbols/refresh-2026-10-07.md#clone-and-garbage-collection)

## Responsibility and callers

`copy_blob_columns` is crate-internal deep-clone support. Commit clone invokes it before publishing a managed-blob target. It materializes externally based managed objects into the target and rewrites descriptors only where necessary. It operates on the prospective manifest; it does not independently publish a transaction. `rust/lance/src/dataset/blob/clone.rs:215-259`; `rust/lance/src/io/commit.rs:604-626`.

## Data flow and invariants

1. Construct a target Dataset view using the target store/base/URI, refreshed manifest and empty base-store cache. Enumerate and deduplicate managed `(Option<base ID>, URI)` references. A local managed reference copies to the same relative path; an explicit-base reference copies to a fresh `_blobs/<uuid>.blob` path. Copy payload objects before rewriting descriptors. Errors propagate to clone orchestration. `rust/lance/src/dataset/blob/clone.rs:215-259`.
2. `replace_array` recursively rebuilds struct/list/large-list containers while preserving nulls. For copied explicit references it emits local Managed descriptors, nulls the base-ID slot and changes the URI; position and size remain intact. Unmatched descriptors remain unchanged. `rust/lance/src/dataset/blob/clone.rs:30-128`.
3. `rewrite_blob_columns` returns immediately if no replacements/blob fields exist. Otherwise it projects blob-bearing top-level columns and row addresses per fragment, prepares a preserving BlobV2 rewrite plan, and writes updated arrays through the fragment updater. Replaced file fields are tombstoned with -2; empty data files are removed. Fragment identity and unrelated file columns survive. `rust/lance/src/dataset/blob/clone.rs:132-213`.

## Modification boundaries

Keep `(base, URI)` identity distinct even when URI strings match across bases. Preserve descriptor offsets/sizes and container null layout. A URI/base rewrite without copying its object would break the target; copying alone without clearing the explicit base would keep reading the ancestor. Publication and failed-commit cleanup belong to the caller. Normal external URI descriptors are not converted into managed references by this helper. `rust/lance/src/dataset/blob/clone.rs:30-128,215-259`; `rust/lance/src/io/commit.rs:604-626`.

## Delta contract — 2026-10-09

Pin `db684d1f0726c00b6defb7963a604a7719e82b5a`. C03: passes source.scan() into reference enumeration; copy semantics retained. See [current clauses](../../../../../../L3-symbols/refresh-2026-10-09.md). Unchanged analysis and selective coverage bounds are retained.
