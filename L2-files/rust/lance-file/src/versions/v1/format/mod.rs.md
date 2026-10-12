> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../../V21-PROTOCOL.md).

# rust/lance-file/src/versions/v1/format/mod.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `c0680d9f4e264aea2559f37fca84c08b7a5f6f5a6556303705c244eb9656098b`. Reviewed physical lines: 1-4.

[Module](../../../../../../../L1-modules/rust-lance-file-v1-foundation.md) · [Symbols](../../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../../README.md)

## Role and visibility

Public V1 format namespace forwarding to its metadata implementation; no generated protobuf include or behavior in this four-line facade. (rust/lance-file/src/versions/v1/format/mod.rs:1-4)

## Complete range analysis

### Lines 1-4

Two SPDX comments, one blank line and public metadata module declaration. No type, function, constant, IO, initialization or test behavior; child Metadata and StatisticsMetadata are available through this namespace. (rust/lance-file/src/versions/v1/format/mod.rs:1-4)

## Interaction and interpretation limits

All physical lines of this file were read during ANALYZE60. Tests were inspected, not executed. Source remains read-only and offline; no build, test, benchmark, fixture generation or dependency installation was run. Frozen V1 behavior is recorded for compatibility, not proposed as the basis for new features. Concrete V1 binary/plain/dictionary codecs are now analyzed; full V1 reader is now analyzed; V1 statistics are fully analyzed; narrow external caller/helper context is recorded separately. Arithmetic, malformed-input, allocation and cancellation consequences are source-level observations, not executed reproductions. No unsafe block or global mutable state is declared in this file.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | pub mod metadata;
``````
