> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-table/src/io.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `abe1c22771919fbf2ec1eee38dc3176b898620a0556a62a5ac32b7dd944bfb8d`. Reviewed physical lines: 1-6.

[Module](../../../../L1-modules/rust-lance-table-io.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public table IO module routing with no runtime work of its own. (rust/lance-table/src/io.rs:1-6)

## Complete range analysis

### Lines 1-6

SPDX prelude and unconditional public commit, deletion and manifest submodules. Complete parent commit resolver/publication, generic external manifest authority, feature-gated DynamoDB authority, manifest body IO and deletion serialization are now analyzed. The concrete namespace store and full Dataset conflict/retry/cleanup remain pending. Module declarations alone supply no storage atomicity guarantees. (rust/lance-table/src/io.rs:1-6)

## Interaction and interpretation limits

This six-line facade is fully covered. Parent commit, generic external-manifest and concrete DynamoDB behavior are documented separately; namespace authority and full Dataset orchestration remain pending. No source test or build was run.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | pub mod commit;
    5 | pub mod deletion;
    6 | pub mod manifest;
``````
