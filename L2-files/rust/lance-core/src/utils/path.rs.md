> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/path.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `20ac2612920db1aec8bbd24f56ffdb4aef8b2519d9e23cfc6c8624e1a699c6ca`. Reviewed physical lines: 1-18.

[Module](../../../../../L1-modules/rust-lance-core-storage.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public extension trait for joining object-store Path components, without filesystem IO. (rust/lance-core/src/utils/path.rs:1-18)

## Complete range analysis

### Lines 1-4

SPDX metadata and object_store::path::Path import; Path here is not std::path::Path. (rust/lance-core/src/utils/path.rs:1-4)

### Lines 5-8

LancePathExt is public and requires `child_path(&self,path:&Path)->Path`. It returns an owned path directly rather than Result. (rust/lance-core/src/utils/path.rs:5-8)

### Lines 9-18

The Path implementation clones self into a working new_path, then for each supplied path.parts() replaces it with new_path.clone().join(part), returning the final value. With zero parts this is the base clone. It delegates parsing/component and join semantics to object_store and performs no IO. Repeated whole-path clones are explicit; absolute-path, escaping and normalization semantics are not reimplemented here. No local tests are defined. (rust/lance-core/src/utils/path.rs:9-18)

## Interaction and interpretation limits

Dependency Path internals and repository consumers remain pending; do not substitute OS path joining based on the helper name. (rust/lance-core/src/utils/path.rs:4-18)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use object_store::path::Path;
    5 | 
    6 | pub trait LancePathExt {
    7 |     fn child_path(&self, path: &Path) -> Path;
    8 | }
    9 | 
   10 | impl LancePathExt for Path {
   11 |     fn child_path(&self, path: &Path) -> Path {
   12 |         let mut new_path = self.clone();
   13 |         for part in path.parts() {
   14 |             new_path = new_path.clone().join(part);
   15 |         }
   16 |         new_path
   17 |     }
   18 | }
``````
