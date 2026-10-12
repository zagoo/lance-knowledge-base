> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-table/src/lib.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `00a6cd88ee22acc5e91c2520e5b4912788f44cdccdf80cbc81a8efd829bcf504`. Reviewed physical lines: 1-10.

[Module](../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public module routing for lance-table. (rust/lance-table/src/lib.rs:1-10)

## Complete range analysis

### Lines 1-3

Apache2 SPDX/license prelude and spacing; no crate-level executable initialization. (rust/lance-table/src/lib.rs:1-3)

### Lines 4-10

Exposes feature_flags, format, io, rowids, system_index, transaction and utils as public modules. There are no root-level reexports or cfg gates in this file. Public Rust routing does not override the README internal-use policy. (rust/lance-table/src/lib.rs:4-10)

## Interaction and interpretation limits

Only this file is analyzed; imported implementations and downstream consumers remain pending unless separately listed in the manifest. No Rust build or test was run.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | pub mod feature_flags;
    5 | pub mod format;
    6 | pub mod io;
    7 | pub mod rowids;
    8 | pub mod system_index;
    9 | pub mod transaction;
   10 | pub mod utils;
``````
