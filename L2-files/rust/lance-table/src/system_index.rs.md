> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-table/src/system_index.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `9a1ddfbc31258f7a06dbf533483853b90bc0104b38fe65b4f3ac16897f7ba8e9`. Reviewed physical lines: 1-24.

[Module](../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Table-owned system-index module facade and name predicate. (rust/lance-table/src/system_index.rs:1-24)

## Complete range analysis

### Lines 1-13

Module documentation motivates owning index internals at table level when table semantics interpret fragment remapping or row visibility. Its claim that lance-index has trait adapters/reexports is a source-comment relationship pending inspection of those files. (rust/lance-table/src/system_index.rs:1-13)

### Lines 14-20

Public frag_reuse and mem_wal child modules; imports IndexMetadata and the two child name constants privately. Both complete child implementations are now analyzed. The reserved constants are __lance_frag_reuse and __lance_mem_wal (rust/lance-table/src/system_index/frag_reuse.rs:26-27; rust/lance-table/src/system_index/mem_wal.rs:26-29). (rust/lance-table/src/system_index.rs:14-20)

### Lines 21-24

is_system_index compares index_meta.name for exact equality against either imported name. It does not inspect index_details, schema, UUID or type payload, and does not validate system-index contents. (rust/lance-table/src/system_index.rs:21-24)

## Interaction and interpretation limits

All24 lines and both system-index child modules are analyzed; downstream index-trait adapters, writer/recovery execution and complete dataset consumers remain pending. No Rust build or test was run.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! System indices: table-level structure persisted as indices.
    5 | //!
    6 | //! Unlike normal indices, whose internals stay opaque behind
    7 | //! [`crate::format::IndexMetadata::index_details`], the table format genuinely
    8 | //! interprets the contents of these indices (fragment remapping, row
    9 | //! visibility). They therefore live at the table layer.
   10 | //!
   11 | //! The `Index`-trait adapters for these structs live in `lance-index`, which
   12 | //! re-exports the structs defined here.
   13 | 
   14 | pub mod frag_reuse;
   15 | pub mod mem_wal;
   16 | 
   17 | use crate::format::IndexMetadata;
   18 | use frag_reuse::FRAG_REUSE_INDEX_NAME;
   19 | use mem_wal::MEM_WAL_INDEX_NAME;
   20 | 
   21 | /// Whether `index_meta` describes one of the system indices defined in this module.
   22 | pub fn is_system_index(index_meta: &IndexMetadata) -> bool {
   23 |     index_meta.name == FRAG_REUSE_INDEX_NAME || index_meta.name == MEM_WAL_INDEX_NAME
   24 | }
``````
