> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-encoding/src/encodings.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `d09c9612da0bc4fa8659a43b8d20d362ad2f10e22e2501db9efe76ac7989eb68`. Reviewed physical lines: 1-8.

[Module](../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public logical/physical encoding facade with test-only fuzz module. (rust/lance-encoding/src/encodings.rs:1-8)

## Complete range analysis

### Lines 1-3

SPDX comments. (rust/lance-encoding/src/encodings.rs:1-3)

### Lines 4-6

Public logical and physical child modules; no codec dispatch or version validation in facade. (rust/lance-encoding/src/encodings.rs:4-6)

### Lines 7-8

fuzz_tests public module only under cfg(test); this is not production registration. (rust/lance-encoding/src/encodings.rs:7-8)

## Interaction and interpretation limits

All physical lines were read in bounded source outputs during ANALYZE72. Offline, read-only inspection; no Lance build, test, lint, benchmark, generator or dependency installation ran. Exact declarations are preserved below and in the symbol index. Other files are only covered at cited contextual ranges; no whole-crate completion or runtime validation is implied.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | pub mod logical;
    5 | pub mod physical;
    6 | 
    7 | #[cfg(test)]
    8 | pub mod fuzz_tests;
``````
