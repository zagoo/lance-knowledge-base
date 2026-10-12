> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-core/src/container.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `f7109c824c037814951df9d1f7492ed3ce20048b2e26c3642000108ea0615c15`. Reviewed physical lines: 1-4.

[Module](../../../../L1-modules/rust-lance-core-storage.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public container-module facade. (rust/lance-core/src/container.rs:1-4)

## Complete range analysis

### Lines 1-4

The two SPDX lines establish licensing/attribution, the blank line separates them, and `pub mod list` exposes the list implementation. There is no container-level executable initialization or additional re-export. (rust/lance-core/src/container.rs:1-4)

## Interaction and interpretation limits

The implementation and public types are analyzed in [list.rs](container/list.rs.md). The declaration alone defines no memory or ordering contract. (rust/lance-core/src/container.rs:1-4)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | pub mod list;
``````
