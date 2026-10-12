> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/system_index/frag_reuse/metadata.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `da4a7d151aec90b446f0c42caf55e1696a92757362b219728ecaf20bf8e83d63`. Reviewed physical lines: 1-123.

[Module](../../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Four public metadata guards: tagged-entry recognition, sticky-format recognition, paired-flag requirement and asynchronous clone prohibition; two local predicate tests. (rust/lance-table/src/system_index/frag_reuse/metadata.rs:1-123)

## Complete range analysis

### Lines 1-14

SPDX and metadata-guard module docs; imports core errors, ObjectStore, reserved FRI name/capability bit, Manifest/IndexMetadata, ManifestLocation and index-list reader. Guard predicates borrow metadata; only clone guard performs an asynchronous read. Public parent module routing is rust/lance-table/src/system_index/frag_reuse.rs:7-7. (rust/lance-table/src/system_index/frag_reuse/metadata.rs:1-14)

### Lines 15-19

Public is_tagged requires exact reserved name and index_version != 0. Any nonzero signed value, including negative/future versions, qualifies. It does not inspect Any type URL/details, bitmap, fields or flags. This differs from is_frag_reuse_index_entry, which validates name plus Any type-name suffix (rust/lance-table/src/system_index/frag_reuse.rs:29-41). (rust/lance-table/src/system_index/frag_reuse/metadata.rs:15-19)

### Lines 20-36

Public uses_tagged_fri returns true if manifest reader bit is set OR provided entry satisfies is_tagged. Writer bit is ignored; caller supplies at most one entry and function does not search indices. Comments establish sticky-format intent even when entry trimmed or version0, with later lift/append behavior implemented elsewhere. This predicate itself neither stamps nor clears flags nor lifts history. FLAG_FRAGMENT_REUSE_INDEX is 1<<10 (rust/lance-table/src/feature_flags.rs:65-65). (rust/lance-table/src/system_index/frag_reuse/metadata.rs:20-36)

### Lines 37-51

Public validate_flags rejects if any tagged entry exists and bit10 is not simultaneously present in reader AND writer flags. Returns CorruptFile named manifest with exact requirement message. With no tagged entry it returns Ok regardless of flag mismatch; other capability validation remains separate. Does not require entry presence merely because flags are set, validate version support/details, or mutate flags. (rust/lance-table/src/system_index/frag_reuse/metadata.rs:37-51)

### Lines 52-70

Public async ensure_clone_supported immediately returns Ok when reader bit10 absent, without reading index metadata. Otherwise await read_manifest_indexes, propagate its error, and reject NotSupported if any tagged entry remains; sticky flag alone, empty indices or only v0 entry pass. Writer flags and row-map layout are not examined here. No relocation, index mutation or file writes; cancellation while awaiting delegates to dropped read future. External storage/read implementation remains pending. (rust/lance-table/src/system_index/frag_reuse/metadata.rs:52-70)

### Lines 71-91

cfg(test) module and private entry fixture use nil UUID, empty fields/covering_fields, supplied name/version, dataset_version1 and None bitmap/details/time/base/files. This intentionally proves name/version recognition does not require physical index payload. (rust/lance-table/src/system_index/frag_reuse/metadata.rs:71-91)

### Lines 92-100

First test asserts reserved name with version0 false, versions1/2 true; user_idx versions0/1 false. Negative versions, malformed details and type URL ambiguity not exercised locally. (rust/lance-table/src/system_index/frag_reuse/metadata.rs:92-100)

### Lines 101-123

Second test starts shared manifest fixtures, sets only reader bit on one, then asserts tagged for flagged None and flagged v0, unflagged tagged v1; unflagged v0/None false. Does not locally test validate_flags or async clone guard. A contextual reader test uses a missing manifest path with an unflagged fixture to assert clone guard avoids index IO (rust/lance/src/index/frag_reuse_reader.rs:1011-1023); its fixture and rest of consumer remain pending. (rust/lance-table/src/system_index/frag_reuse/metadata.rs:101-123)

## Interaction and interpretation limits

All123 physical lines read. Index-list IO and full clone/restore consumers remain pending; contextual callers do not imply global entrance coverage. No source edits/network/runtime tests.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Metadata guards for tagged fragment reuse histories.
    5 | 
    6 | use lance_core::{Error, Result};
    7 | use lance_io::object_store::ObjectStore;
    8 | 
    9 | use super::FRAG_REUSE_INDEX_NAME;
   10 | use crate::feature_flags::FLAG_FRAGMENT_REUSE_INDEX;
   11 | use crate::format::{IndexMetadata, Manifest};
   12 | use crate::io::commit::ManifestLocation;
   13 | use crate::io::manifest::read_manifest_indexes;
   14 | 
   15 | /// Whether an index entry requires the tagged FRI format contract.
   16 | pub fn is_tagged(index: &IndexMetadata) -> bool {
   17 |     index.name == FRAG_REUSE_INDEX_NAME && index.index_version != 0
   18 | }
   19 | 
   20 | /// Whether the table's fragment reuse history is governed by the tagged
   21 | /// format contract, which decides the record form every FRI write must
   22 | /// take: append transitions, never a v0 snapshot replacement.
   23 | ///
   24 | /// The sticky [`FLAG_FRAGMENT_REUSE_INDEX`] is the final authority: the
   25 | /// first tagged commit sets it and nothing ever clears it -- a trim may
   26 | /// delete a fully drained entry, but the flag survives -- so a
   27 | /// flag-carrying manifest stays tagged even when no entry currently
   28 | /// exists. The entry arm keeps the decision correct for a tagged entry
   29 | /// observed before the flag is stamped on (a manifest assembled
   30 | /// mid-commit); a v0 entry under the flag does NOT make the table v0: the
   31 | /// next tagged commit lifts it byte-verbatim instead.
   32 | pub fn uses_tagged_fri(manifest: &Manifest, existing_fri_entry: Option<&IndexMetadata>) -> bool {
   33 |     manifest.reader_feature_flags & FLAG_FRAGMENT_REUSE_INDEX != 0
   34 |         || existing_fri_entry.is_some_and(is_tagged)
   35 | }
   36 | 
   37 | /// Refuse publication of tagged history without both manifest capability bits.
   38 | pub fn validate_flags(manifest: &Manifest, indices: &[IndexMetadata]) -> Result<()> {
   39 |     if indices.iter().any(is_tagged)
   40 |         && (manifest.reader_feature_flags & manifest.writer_feature_flags)
   41 |             & FLAG_FRAGMENT_REUSE_INDEX
   42 |             == 0
   43 |     {
   44 |         return Err(Error::corrupt_file_named(
   45 |             "manifest",
   46 |             "tagged FRI metadata requires both reader and writer feature flags",
   47 |         ));
   48 |     }
   49 |     Ok(())
   50 | }
   51 | 
   52 | /// Cloning requires relocation of external mappings, which is not implemented yet.
   53 | /// A sticky flag alone need not mean that a mapping still exists.
   54 | pub async fn ensure_clone_supported(
   55 |     store: &ObjectStore,
   56 |     location: &ManifestLocation,
   57 |     manifest: &Manifest,
   58 | ) -> Result<()> {
   59 |     if manifest.reader_feature_flags & FLAG_FRAGMENT_REUSE_INDEX == 0 {
   60 |         return Ok(());
   61 |     }
   62 |     let indices = read_manifest_indexes(store, location, manifest).await?;
   63 |     if indices.iter().any(is_tagged) {
   64 |         return Err(Error::not_supported(
   65 |             "Cloning tagged FRI requires row-map reference relocation. Please upgrade to a version supporting FRI clone",
   66 |         ));
   67 |     }
   68 |     Ok(())
   69 | }
   70 | 
   71 | #[cfg(test)]
   72 | mod tests {
   73 |     use super::*;
   74 |     use uuid::Uuid;
   75 | 
   76 |     fn entry(name: &str, index_version: i32) -> IndexMetadata {
   77 |         IndexMetadata {
   78 |             uuid: Uuid::nil(),
   79 |             fields: vec![],
   80 |             covering_fields: vec![],
   81 |             name: name.into(),
   82 |             dataset_version: 1,
   83 |             fragment_bitmap: None,
   84 |             index_details: None,
   85 |             index_version,
   86 |             created_at: None,
   87 |             base_id: None,
   88 |             files: None,
   89 |         }
   90 |     }
   91 | 
   92 |     #[test]
   93 |     fn tagged_requires_the_reserved_name_and_a_nonzero_version() {
   94 |         assert!(!is_tagged(&entry(FRAG_REUSE_INDEX_NAME, 0)));
   95 |         assert!(is_tagged(&entry(FRAG_REUSE_INDEX_NAME, 1)));
   96 |         assert!(is_tagged(&entry(FRAG_REUSE_INDEX_NAME, 2)));
   97 |         assert!(!is_tagged(&entry("user_idx", 0)));
   98 |         assert!(!is_tagged(&entry("user_idx", 1)));
   99 |     }
  100 | 
  101 |     #[test]
  102 |     fn sticky_flag_or_tagged_entry_makes_the_table_tagged() {
  103 |         let mut flagged = crate::transaction::test_support::sample_manifest();
  104 |         flagged.reader_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
  105 |         let unflagged = crate::transaction::test_support::sample_manifest();
  106 |         // The flag alone decides, entry present or not, v0 entry included.
  107 |         assert!(uses_tagged_fri(&flagged, None));
  108 |         assert!(uses_tagged_fri(
  109 |             &flagged,
  110 |             Some(&entry(FRAG_REUSE_INDEX_NAME, 0))
  111 |         ));
  112 |         // Without the flag, only a tagged entry does.
  113 |         assert!(uses_tagged_fri(
  114 |             &unflagged,
  115 |             Some(&entry(FRAG_REUSE_INDEX_NAME, 1))
  116 |         ));
  117 |         assert!(!uses_tagged_fri(
  118 |             &unflagged,
  119 |             Some(&entry(FRAG_REUSE_INDEX_NAME, 0))
  120 |         ));
  121 |         assert!(!uses_tagged_fri(&unflagged, None));
  122 |     }
  123 | }
``````
