> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/bloomfilter.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `0aa5607b9948c06cdd9601022f367b646c24ca612d059e4186d61100a55e7100`. Reviewed physical lines: 1-10.

[Module](../../../../../L1-modules/rust-lance-core-bloom.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public directory module for storage-agnostic Bloom-filter primitives, exposing byte conversion and split-block Bloom filters. It assigns higher-level Lance index semantics to consuming crates. (rust/lance-core/src/utils/bloomfilter.rs:1-10)

## Complete range analysis

### Lines 1-8

SPDX and module docs explicitly describe generic storage-agnostic structures with no Lance semantics; higher-level scalar Bloom index in lance-index is an example consumer named by the docs, not a resolved caller graph. (rust/lance-core/src/utils/bloomfilter.rs:1-8)

### Lines 9-10

Unconditionally public as_bytes and sbbf modules expose the two local implementations. No feature gate or registration logic exists in this file. (rust/lance-core/src/utils/bloomfilter.rs:9-10)

## Interaction and interpretation limits

This directory declaration and both child implementations are analyzed. Actual scalar-index files, null handling, dispatch and format metadata in lance-index remain pending. (rust/lance-core/src/utils/bloomfilter.rs:4-10)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Generic bloom filter primitives.
    5 | //!
    6 | //! These are storage-agnostic data structures with no Lance semantics, used by
    7 | //! higher-level crates (e.g. the bloom filter scalar index in `lance-index`).
    8 | 
    9 | pub mod as_bytes;
   10 | pub mod sbbf;
``````
