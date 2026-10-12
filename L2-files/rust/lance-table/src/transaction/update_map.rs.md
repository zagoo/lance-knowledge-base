> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/transaction/update_map.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `03f5ce43a71459ca09b2cb19c7b42dcff3a7829abd5656e542d44484f2835d17`. Reviewed physical lines: 1-128.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public string-map update entries, conversion/translators and transaction-internal mutation helper. Reexported types/functions are independent of persistence IO. (rust/lance-table/src/transaction/update_map.rs:1-128)

## Complete range analysis

### Lines 1-12

SPDX/module docs group dataset config,table metadata,schema metadata,field metadata as HashMap<String,String> edits; None documented as delete and replace selects whole-map versus merge. Import DeepSizeOf. Replacement implementation has a narrower None behavior than that general introduction. (rust/lance-table/src/transaction/update_map.rs:1-12)

### Lines 13-27

UpdateMapEntry derives Debug/Clone/DeepSizeOf/PartialEq, public key:String/value:Option<String>. From<(String,Option<String>)> moves both fields unchanged with no validation; None is a deletion token in incremental use. (rust/lance-table/src/transaction/update_map.rs:13-27)

### Lines 28-48

From<(String,String)> wraps Some and delegates; From<(&str,Option<&str>)> allocates owned key and optional owned value; From<(&str,&str)> delegates borrowed optional conversion. Empty strings and duplicate keys are accepted; allocation is ordinary, no Result. (rust/lance-table/src/transaction/update_map.rs:28-48)

### Lines 49-57

UpdateMap derives Debug/Clone/DeepSizeOf/PartialEq and publicly owns ordered Vec<UpdateMapEntry> and replace:bool. Derived equality observes entry order even when two lists have identical map effects. No Default, sorting, deduplication or contradiction checks. (rust/lance-table/src/transaction/update_map.rs:49-57)

### Lines 58-71

pub(super) apply_update_map mutates supplied target and returns unit. For replace=true it clears target, then inserts only Some(value) entries in list order, cloning key/value. None entries are skipped, not removals from earlier inserted values. Thus [(k,Some(v)),(k,None)] leaves v in replacement mode; last Some for a key wins regardless of later None. Empty replacement clears all entries; clear may retain capacity. No atomic rollback. (rust/lance-table/src/transaction/update_map.rs:58-71)

### Lines 72-82

For replace=false, process entries in order: Some inserts cloned strings, None removes matching key. Last entry wins, including a deletion following an insert; deleting absent key is harmless. Empty incremental update preserves target. No validation, errors, IO or allocation rollback; expected hash work linear in entries apart from key/hash costs. (rust/lance-table/src/transaction/update_map.rs:72-82)

### Lines 83-111

translate_config_updates borrows upsert HashMap and deletion String slice, allocates entry Vec, clones all upserts first in unspecified HashMap iteration order, then emits deletion entries preserving supplied order and duplicates. Returns replace=false. A key in both lists is removed by apply_update_map because deletes come last; translator itself changes no map. No preallocation or validation. (rust/lance-table/src/transaction/update_map.rs:83-111)

### Lines 112-128

translate_schema_metadata_updates clones borrowed HashMap entries into all-Some vector in unspecified order and returns replace=true. Empty map means full clear when applied. It is a translation of old-style schema metadata semantics, not a compatibility codec itself. The complete codec is now analyzed: legacy UpdateConfig invokes these translators (rust/lance-table/src/transaction/proto.rs:315-345). No tests/async/unsafe/locks in this file. (rust/lance-table/src/transaction/update_map.rs:112-128)

## Interaction and interpretation limits

All128 lines read. Local update/translation semantics complete, including duplicate-key replacement nuance. Full config policy, field-ID validation, protobuf backward handling and concurrency conflicts remain pending. No source changes or runtime tests performed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Incremental edits to the string maps a manifest carries.
    5 | //!
    6 | //! Dataset config, table metadata, schema metadata and per-field metadata are all
    7 | //! `HashMap<String, String>`, and all four are updated the same way: a list of
    8 | //! entries where a `None` value means delete the key, plus a flag choosing between
    9 | //! merging into the existing map and replacing it outright.
   10 | 
   11 | use lance_core::deepsize::DeepSizeOf;
   12 | 
   13 | /// An entry for a map update. If value is None, the key will be removed from the map.
   14 | #[derive(Debug, Clone, DeepSizeOf, PartialEq)]
   15 | pub struct UpdateMapEntry {
   16 |     /// The key of the map entry to update.
   17 |     pub key: String,
   18 |     /// The value to set for the key.
   19 |     pub value: Option<String>,
   20 | }
   21 | 
   22 | impl From<(String, Option<String>)> for UpdateMapEntry {
   23 |     fn from((key, value): (String, Option<String>)) -> Self {
   24 |         Self { key, value }
   25 |     }
   26 | }
   27 | 
   28 | impl From<(String, String)> for UpdateMapEntry {
   29 |     fn from((key, value): (String, String)) -> Self {
   30 |         Self::from((key, Some(value)))
   31 |     }
   32 | }
   33 | 
   34 | impl From<(&str, Option<&str>)> for UpdateMapEntry {
   35 |     fn from((key, value): (&str, Option<&str>)) -> Self {
   36 |         Self {
   37 |             key: key.to_string(),
   38 |             value: value.map(str::to_owned),
   39 |         }
   40 |     }
   41 | }
   42 | 
   43 | impl From<(&str, &str)> for UpdateMapEntry {
   44 |     fn from((key, value): (&str, &str)) -> Self {
   45 |         Self::from((key, Some(value)))
   46 |     }
   47 | }
   48 | 
   49 | /// Represents updates to a map (either incremental or replacement)
   50 | #[derive(Debug, Clone, DeepSizeOf, PartialEq)]
   51 | pub struct UpdateMap {
   52 |     pub update_entries: Vec<UpdateMapEntry>,
   53 |     /// If true, the map will be replaced entirely with the new entries.
   54 |     /// If false, the new entries will be merged with the existing map.
   55 |     pub replace: bool,
   56 | }
   57 | 
   58 | /// Helper function to apply UpdateMap changes to a HashMap<String, String>
   59 | pub(super) fn apply_update_map(
   60 |     target: &mut std::collections::HashMap<String, String>,
   61 |     update_map: &UpdateMap,
   62 | ) {
   63 |     if update_map.replace {
   64 |         // Full replacement - clear existing and replace with new entries that have values
   65 |         target.clear();
   66 |         for entry in &update_map.update_entries {
   67 |             if let Some(value) = &entry.value {
   68 |                 target.insert(entry.key.clone(), value.clone());
   69 |             }
   70 |         }
   71 |     } else {
   72 |         // Incremental update - merge entries
   73 |         for entry in &update_map.update_entries {
   74 |             if let Some(value) = &entry.value {
   75 |                 target.insert(entry.key.clone(), value.clone());
   76 |             } else {
   77 |                 target.remove(&entry.key);
   78 |             }
   79 |         }
   80 |     }
   81 | }
   82 | 
   83 | /// Helper function to translate old-style config updates to new UpdateMap format
   84 | pub fn translate_config_updates(
   85 |     upsert_values: &std::collections::HashMap<String, String>,
   86 |     delete_keys: &[String],
   87 | ) -> UpdateMap {
   88 |     let mut update_entries = Vec::new();
   89 | 
   90 |     // Add upsert entries (with values)
   91 |     for (key, value) in upsert_values {
   92 |         update_entries.push(UpdateMapEntry {
   93 |             key: key.clone(),
   94 |             value: Some(value.clone()),
   95 |         });
   96 |     }
   97 | 
   98 |     // Add delete entries (without values)
   99 |     for key in delete_keys {
  100 |         update_entries.push(UpdateMapEntry {
  101 |             key: key.clone(),
  102 |             value: None,
  103 |         });
  104 |     }
  105 | 
  106 |     UpdateMap {
  107 |         update_entries,
  108 |         replace: false, // Old style was always incremental
  109 |     }
  110 | }
  111 | 
  112 | /// Helper function to translate old-style schema metadata to new UpdateMap format
  113 | pub fn translate_schema_metadata_updates(
  114 |     schema_metadata: &std::collections::HashMap<String, String>,
  115 | ) -> UpdateMap {
  116 |     let update_entries = schema_metadata
  117 |         .iter()
  118 |         .map(|(key, value)| UpdateMapEntry {
  119 |             key: key.clone(),
  120 |             value: Some(value.clone()),
  121 |         })
  122 |         .collect();
  123 | 
  124 |     UpdateMap {
  125 |         update_entries,
  126 |         replace: true, // Old style schema metadata was full replacement
  127 |     }
  128 | }
``````
