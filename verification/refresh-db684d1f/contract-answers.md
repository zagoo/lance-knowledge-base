# Scoped contract answers — 2026-10-09

Prepared from the updated KB only, before source confirmation. [Delta contract](../../L3-symbols/refresh-2026-10-09.md) and retained [prior answers](../refresh-84d1681e/contract-answers.md) are the authority. Q5 operation definition/transaction codec/conflict resolver files did not change, so its answer is retained and not rerun. Q1 is scoped to changed cleanup/updater boundaries; Q2/Q3/Q4 cover changed index/schema/API files.

## Q1 — Write and compact: changed retention boundaries

Publication still makes staged files visible; ambiguous outcomes still preserve evidence. Changed cleanup caches descriptor scans at fragment/schema/base/retention identity and shares a delete limiter over cascaded branches. Retained scan failures abort; missing expired descriptors lose proof. Column updater next/update pairing and finish checks preserve physical rows; modern blank chunks are bounded and legacy row groups cannot defer. These augment, rather than replace, the retained write/compaction trace. Evidence: U01–U02, C01–C03.

## Q2 — Scalar extension

Existing plugin, registration, certainty and publication contracts remain. Preprocessed data now declares TrainingCriteria and must match the plugin's request. Bitmap/label-list cache bodies are version 2, distinct from persisted index versions. Named/UUID-selected count validates current coverage and contributor closure; a filter with no index query is rejected. Full-text MultiMatch serialization now carries every leaf. Evidence: A01–A03, S03–S05.

## Q3 — Format/version contract

Exact data-file version gates are unchanged. The JSON schema adds target type field 3 with nonzero/unknown preservation requirements and authoritative-only recovery of unspecified. However current JSON constructors still emit Unspecified; schema intent must not be mistaken for implemented type persistence. Target index format version remains absent. Frozen proto analysis is amended, not rewritten. Evidence: S01–S02; cache-body versions S04 are separate from file formats.

## Q4 — APIs and implementation routing

Python get_version calls PyO3 current_version and Dataset::version, converts to local microsecond datetime and returns the loaded manifest summary. Java's scalar-count overload routes to Rust semantics but remains mapped only. Scanner fast_search no longer exposes row ID implicitly. Public TopKLateMaterialization requires caller registration and certification for custom pass-through nodes. MemWAL evolve_to/evolve_schema keeps schema ownership under the writer lock, rejects WAL-only mode and changed primary-key IDs, and reconciles old generations by field ID. Evidence: A04–A06, Q01–Q05, W01–W06.

No answer relies on an invented runtime guarantee. The schema/implementation gap is an explicit current limitation, not a guessed missing implementation.
