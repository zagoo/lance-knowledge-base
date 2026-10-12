> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/hash.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `16c514190a361fb3529ac0511cde34c78b069b7b6788820215c546c6591313c9`. Reviewed physical lines: 1-50.

[Module](../../../../../L1-modules/rust-lance-core-storage.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public borrowed byte-slice key with content equality and hashing plus documentation examples and a local test. (rust/lance-core/src/utils/hash.rs:1-50)

## Complete range analysis

### Lines 1-4

SPDX metadata and import of std::hash::Hasher. The module adds no custom hashing algorithm or random seed. (rust/lance-core/src/utils/hash.rs:1-4)

### Lines 5-23

U8SliceKey<'a>(pub &'a [u8]) is a public tuple wrapper deriving Debug and Eq. Its field is public and its lifetime borrows bytes without allocating or owning them. The doctest builds a HashMap, inserts/gets the matching content key, rejects a different byte sequence and checks unequal keys. Clone and Copy are not derived. (rust/lance-core/src/utils/hash.rs:5-23)

### Lines 24-35

PartialEq compares the two slices by content, including length, and Hash delegates to the slice Hash implementation using caller-provided Hasher state. Pointer identity is irrelevant. These methods do not establish a stable hash value for persistence or a chosen hash algorithm. (rust/lance-core/src/utils/hash.rs:24-35)

### Lines 36-50

The cfg(test) module imports HashMap/key and tests a missing lookup for [4,5,6] plus inequality [1] versus [2]. Matching retrieval is in the doctest; the unit test overlaps the doctest negative cases. Neither was executed during analysis. (rust/lance-core/src/utils/hash.rs:36-50)

## Interaction and interpretation limits

Consumers and hash-table selection outside this file remain pending. Exact traits and borrowed lifetime are retained in the source appendix. (rust/lance-core/src/utils/hash.rs:23-35)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::hash::Hasher;
    5 | 
    6 | /// A wrapper for `&[u8]` to allow byte slices as hash keys.
    7 | ///
    8 | /// ```
    9 | /// use lance_core::utils::hash::U8SliceKey;
   10 | /// use std::collections::HashMap;
   11 | ///
   12 | /// let mut map: HashMap<U8SliceKey, i32> = HashMap::new();
   13 | /// map.insert(U8SliceKey(&[1, 2, 3]), 42);
   14 | ///
   15 | /// assert_eq!(map.get(&U8SliceKey(&[1, 2, 3])), Some(&42));
   16 | /// assert_eq!(map.get(&U8SliceKey(&[1, 2, 4])), None);
   17 | ///
   18 | /// // Equality is based on slice contents
   19 | /// assert_eq!(U8SliceKey(&[1, 2, 3]), U8SliceKey(&[1, 2, 3]));
   20 | /// assert_ne!(U8SliceKey(&[1, 2, 3]), U8SliceKey(&[1, 2, 4]));
   21 | /// ```
   22 | #[derive(Debug, Eq)]
   23 | pub struct U8SliceKey<'a>(pub &'a [u8]);
   24 | 
   25 | impl PartialEq for U8SliceKey<'_> {
   26 |     fn eq(&self, other: &Self) -> bool {
   27 |         self.0 == other.0
   28 |     }
   29 | }
   30 | 
   31 | impl std::hash::Hash for U8SliceKey<'_> {
   32 |     fn hash<H: Hasher>(&self, state: &mut H) {
   33 |         self.0.hash(state);
   34 |     }
   35 | }
   36 | 
   37 | #[cfg(test)]
   38 | mod tests {
   39 |     use super::*;
   40 |     use std::collections::HashMap;
   41 | 
   42 |     #[test]
   43 |     fn test_u8_slice_key() {
   44 |         // Test cases not in doctest: key not found, inequality
   45 |         let mut map = HashMap::new();
   46 |         map.insert(U8SliceKey(&[1, 2, 3]), 42);
   47 |         assert_eq!(map.get(&U8SliceKey(&[4, 5, 6])), None);
   48 |         assert_ne!(U8SliceKey(&[1]), U8SliceKey(&[2]));
   49 |     }
   50 | }
``````
