> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-09: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-09-db684d1f.md) at `db684d1f0726c00b6defb7963a604a7719e82b5a` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-core/src/utils/blob.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `b12960e34173b20f52c36de9da1b41b0a9800957a1f02d0a686821db1f89075c`. Reviewed physical lines: 1-46.

[Module](../../../../../L1-modules/rust-lance-core.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public deterministic blob-sidecar object-store path formatter with two private unit tests. It constructs a path value and does not read/write a blob or generate IDs. (rust/lance-core/src/utils/blob.rs:1-46)

## Complete range analysis

### Lines 1-5

SPDX header and object_store::path::Path import; no environment/config or global mutable state. (rust/lance-core/src/utils/blob.rs:1-5)

### Lines 6-16

pub fn blob_path(base:&Path,data_file_key:&str,blob_id:u32)->Path reverses all 32 ID bits, formats exactly 32 binary digits followed by .blob, then joins base.clone(), data_file_key, and filename. Base is usually the data directory and key is expected to be the data-file stem, but the function neither strips an extension nor validates that expectation. Callees are u32::reverse_bits, format!, Path clone/join. It allocates formatted/path values, performs no IO, and returns no Result. Reverse_bits obfuscates/scatters sequential prefixes; it is reversible, not encryption. (rust/lance-core/src/utils/blob.rs:6-16)

### Lines 17-30

Private cfg(test) module and test_blob_path_formatting use base/deadbeef with ID 2 and assert exact base/deadbeef/01000000000000000000000000000000.blob output. This fixes bit width, reversal and suffix behavior. (rust/lance-core/src/utils/blob.rs:17-30)

### Lines 31-46

test_blob_path_scattered_prefixes_for_sequential_ids compares IDs 1 and 2, asserts distinct paths, and exact prefixes 1000... versus 0100... for their 32-bit reversed forms. It does not exercise max/zero IDs, empty stems or backend IO. Tests are source-inspected, not executed. (rust/lance-core/src/utils/blob.rs:31-46)

## Interaction and interpretation limits

Observed calls include dataset blob access at rust/lance/src/dataset/blob.rs:4848-4848 and rust/lance/src/dataset/blob.rs:4869-4869, and blob path resolution at rust/lance/src/blob.rs:605-605; these matching lines are retained in analysis/iteration-003-references.txt. Full caller behavior and Path::join semantics are not inferred from the helper alone.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use object_store::path::Path;
    5 | 
    6 | /// Format a blob sidecar path for a data file.
    7 | ///
    8 | /// Layout: `<base>/<data_file_key>/<obfuscated_blob_id>.blob`
    9 | /// - `base` is typically the dataset's data directory.
   10 | /// - `data_file_key` is the stem of the data file (without extension).
   11 | /// - `blob_id` is transformed via `reverse_bits()` before binary formatting.
   12 | pub fn blob_path(base: &Path, data_file_key: &str, blob_id: u32) -> Path {
   13 |     let file_name = format!("{:032b}.blob", blob_id.reverse_bits());
   14 |     base.clone().join(data_file_key).join(file_name.as_str())
   15 | }
   16 | 
   17 | #[cfg(test)]
   18 | mod tests {
   19 |     use super::*;
   20 | 
   21 |     #[test]
   22 |     fn test_blob_path_formatting() {
   23 |         let base = Path::from("base");
   24 |         let path = blob_path(&base, "deadbeef", 2);
   25 |         assert_eq!(
   26 |             path.to_string(),
   27 |             "base/deadbeef/01000000000000000000000000000000.blob"
   28 |         );
   29 |     }
   30 | 
   31 |     #[test]
   32 |     fn test_blob_path_scattered_prefixes_for_sequential_ids() {
   33 |         let base = Path::from("base");
   34 |         let p1 = blob_path(&base, "deadbeef", 1);
   35 |         let p2 = blob_path(&base, "deadbeef", 2);
   36 |         assert_ne!(p1.to_string(), p2.to_string());
   37 |         assert_eq!(
   38 |             p1.to_string(),
   39 |             "base/deadbeef/10000000000000000000000000000000.blob"
   40 |         );
   41 |         assert_eq!(
   42 |             p2.to_string(),
   43 |             "base/deadbeef/01000000000000000000000000000000.blob"
   44 |         );
   45 |     }
   46 | }
``````
