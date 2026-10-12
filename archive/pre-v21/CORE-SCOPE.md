> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# Core-only scope and progress

User revision: 2026-10-04. This document supersedes the earlier source-plus-tests interpretation in scope-clarification.md and all broader requirements in the original objective. The goal remains a source-independent knowledge base for **in-scope core engine and primary public API development**, not exhaustive understanding of excluded implementations.

## Current counts

| Measure | Files with included production ranges | Physical lines |
|---|---:|---:|
| Core scope | 833 | 457,173 |
| Existing complete KB coverage, projected into this scope | 176 | 76,433 |
| Remaining | 657 | 380,740 |

Completed production-line coverage: 16.72%. Included ranges retain comments, API documentation and blank lines. These are physical source lines, not executable-statement counts. The count includes 14 handwritten .proto definitions (4,139 lines), including the index cache schema. Generated protobuf output is excluded. Compared with the old 904,015 source-classified lines, retained source-classified core lines are 453,034, a 49.89% reduction. The unfinished cycle 86 receives no completed-analysis credit.

The counter removed 313,021 embedded Rust test lines from core candidates, in addition to dropping standalone tests, benchmarks and helpers. 148 files are summary-only peripherals; they are outside the exhaustive core denominator. Non-source context and excluded entries remain recorded with reasons, not pending analysis obligations.

## Included boundaries and order

1. Storage contracts and Dataset write/read/scan, append/update/delete, commit/conflict resolution and compaction. Connect already documented table/file/encoding contracts to actual Dataset call paths.
2. Scalar, full-text and vector indexing; IVF, PQ, HNSW and their build/search/update integration. Query planning, filtering, execution and materialization.
3. Primary Rust/Python/Java APIs, exact signatures, validation/default/error semantics and engine mappings. Follow necessary production dependencies while tracing each path.
4. Fill remaining core codec, I/O and numerical contracts required by those paths. Peripheral utilities, platform kernels, observability, namespace adapters and CLI/build tooling get only relevant boundary summaries.

Preserve the existing 85-cycle KB; do not restart analysis or delay writing until all reading is complete. Finish only the already-read production portions of list.rs and struct.rs (not their test modules) as a small carry-over, then prioritize the engine paths above.

## Strict exclusions

- No unit tests, integration tests, benchmarks, test utilities, fixture generators or fixtures. Rust test-only cfg items and test/benchmark attributed items are excluded even inside production files. Public API documentation/examples remain as interface documentation.
- No binary files, binary parsing/reconstruction, decompilation or reverse engineering. No external dependency implementation source or third-party internals.
- No generated code or generated build artifacts. Handwritten protobuf schemas and versioned format validation/conversion logic remain, because they define core compatibility contracts.
- Exclude identified mechanical FFI and serialization helpers. Retain substantive validation, index configuration and architectural logic even inside a file named utils.rs. Mixed files have precise excluded ranges; further semantic discoveries may refine this inventory with recorded reasons.
- No full analysis of summary/context tiers. Describe only boundaries needed to understand core code; do not claim implementation completeness for these tiers.

Every entry and production/exclusion interval is recorded in [CORE-MANIFEST.json](../../CORE-MANIFEST.json); [counter](../../tools/core-scope.py). Old MANIFEST.json and verification cycles are historical provenance and must not set the new denominator. The legacy all-file verifier is disabled to prevent excluded binary/test reads. A production-range-aware semantic verifier is required before the next VERIFY cycle; the scope recount is not a semantic acceptance pass.

## Module counts

| Module group | Files | Included lines | Previously documented lines |
|---|---:|---:|---:|
| java | 173 | 38,887 | 0 |
| protos | 13 | 3,919 | 3,919 |
| python | 53 | 32,626 | 0 |
| rust/lance | 185 | 151,509 | 0 |
| rust/lance-arrow | 12 | 4,443 | 0 |
| rust/lance-core | 42 | 12,655 | 12,655 |
| rust/lance-datafusion | 17 | 8,088 | 0 |
| rust/lance-encoding | 63 | 44,974 | 23,141 |
| rust/lance-file | 38 | 14,788 | 14,788 |
| rust/lance-index | 131 | 96,442 | 0 |
| rust/lance-index-core | 4 | 1,577 | 0 |
| rust/lance-io | 40 | 16,325 | 0 |
| rust/lance-linalg | 13 | 6,877 | 0 |
| rust/lance-select | 4 | 2,133 | 0 |
| rust/lance-table | 45 | 21,930 | 21,930 |

The rust/lance-index group includes its 220-line handwritten cache.proto; the protos row covers the 13 root schema files.

## Timing and deliverables

KB generation already began and continues incrementally in L0–L4. There is no separate wait to start writing the KB.

Historical Goal telemetry at this revision: 102,461 seconds (28.46 active hours). Projecting 76,433 retained, previously documented lines over that time gives approximately 2,685 retained production lines per active hour, including old analysis/verification overhead. Applying that baseline to 380,740 remaining lines yields approximately 142 active analysis hours. This is a coarse planning baseline, not a calendar deadline or a measured rate for the revised workflow. Removing test/binary work and using larger core-path slices should reduce overhead, but a faster numerical ETA needs completed core-only cycles. The timing model must be recalibrated after those cycles rather than claiming unsupported speedup.

Core completion remains INCOMPLETE. Scope/parser checks do not establish behavioral accuracy or downstream self-sufficiency. All scoped KB-only acceptance questions must still pass.
