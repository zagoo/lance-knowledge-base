# Scoped contract answers — 2026-10-11

Prepared from the current KB only, before source confirmation. All five original question families touch changed files. These answers augment the retained [baseline answers](../refresh-84d1681e/contract-answers.md) and use [current contracts](../../L3-symbols/refresh-2026-10-11.md). No runtime execution is claimed.

## Q1 — Write/compact

Publication still makes staged files visible. With non-reusable IDs enabled, each attempt canonicalizes against current high-water and read-version schema; overwrite uses fresh IDs, drops reserve IDs, and restore cannot cross back before activation. Deferred compaction retains index coverage only with lineage evidence; folded newer overlays remove affected coverage and missing history needed for freshness requires a retry/rebuild. Physical slices are physical half-open row intervals and cannot replace logical row-ID sets or offset compaction. Evidence F01–F03, T01–T03, Q01–Q02.

## Q2 — Scalar/index extension

Retained persistent plugin/training/certainty contracts remain in force. MemWAL has its own plugin resolve/validate/create boundary and identity; insert is serialized but other calls may overlap. Search must honor the visible batch watermark; decline and accepted-query behavior differ. Flush has four outcomes. Typed runtime overrides are not persisted, duplicate HNSW configuration is invalid, and resolve errors propagate. Index coverage proof now accounts for physical column identity and overlays; missing historical evidence loses coverage rather than inventing it. Evidence M01–M03, I01.

## Q3 — Format and version gates

Stable v2.1/v2.2 retain Flat offsets and reject Range/Delta. Unstable v2.3 uses the changed SparseLayout and typed u32/u64 generic sequence grammar; bounded composites and framing validation restrict it. Activation uses Manifest field 24 plus writer bit 15, never reader bit 15; the unknown-feature boundary is 16. Blob lineage feature pairing remains enforced. Cache bodies and priority envelopes are separate from persisted file grammar. Evidence F01, E01–E06, C02.

## Q4 — API mapping

Python raw Arrow provenance survives conversion until commit identity resolution; LanceSchema.from_pyarrow resets identities. Managed blob append is reference-based and requires commit/source retention. Python nearest and VectorSearchQuery effort forward to ProbeParams, and effort is finite in [0,1] with default 0.5. Explicit effort ignores nprobes but retains min/max bounds. Physical fragment ranges have distinct Scanner APIs; the old row-address setter is a deprecated logical alias. Java remains mapped only. Evidence A01–A02, V01–V02, Q01–Q02.

## Q5 — Conflict and transition rules

Core commit receives resolved identities, clones the transaction per attempt, and allocates against latest high-water plus read schema. Successors cannot decrease/lose the high-water; newly referenced identities must belong to canonical schema. Existing IDs cannot change logical type or parent. Activated detached Merge must retain schema, and detached Project/Overwrite/Restore are rejected. Renames require unused sibling names and consistent ancestry. Deferred rewrite conflicts with absent bitmap/history require retry rather than unproven coverage. Evidence T01–T03, F02.
