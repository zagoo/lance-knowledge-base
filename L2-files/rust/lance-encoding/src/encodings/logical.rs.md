> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-encoding/src/encodings/logical.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `b4c1b28f2c861aa0f645ede59c1acdc92cf5596fcc3ca2bcb430ffab2e4abc7f`. Reviewed physical lines: 1-9.

[Module](../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public logical encoding module declarations. (rust/lance-encoding/src/encodings/logical.rs:1-9)

## Complete range analysis

### Lines 1-3

SPDX comments. (rust/lance-encoding/src/encodings/logical.rs:1-3)

### Lines 4-9

Public blob,fixed_size_list,list,map,primitive and raw-identifier r#struct modules. Children are not re-exported symbols or proven complete from this facade. (rust/lance-encoding/src/encodings/logical.rs:4-9)

## Interaction and interpretation limits

All physical lines were read in bounded source outputs during ANALYZE72. Offline, read-only inspection; no Lance build, test, lint, benchmark, generator or dependency installation ran. Exact declarations are preserved below and in the symbol index. Other files are only covered at cited contextual ranges; no whole-crate completion or runtime validation is implied.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | pub mod blob;
    5 | pub mod fixed_size_list;
    6 | pub mod list;
    7 | pub mod map;
    8 | pub mod primitive;
    9 | pub mod r#struct;
``````
