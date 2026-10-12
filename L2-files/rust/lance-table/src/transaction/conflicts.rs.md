> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen. Refresh 2026-10-12: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-12-011953c2.md) at `011953c22097b67b699595adbe99e7f0155d83e4` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/transaction/conflicts.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `a8b9592dfaf7e0572c03b64e8ceee28291d01fe796de19ce2804a5ee311fca7d`. Reviewed physical lines: 1-1042.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Handwritten Operation equality and config/metadata overlap predicates, with two local unit tests. Public methods are reachable on the reexported Operation; conflicts is a private module. (rust/lance-table/src/transaction/conflicts.rs:1-1042)

## Complete range analysis

### Lines 1-17

SPDX/module docs say operation equality identifies the same retried change and metadata checks identify touched keys. Imports Operation/UpdateMap and HashSet. This file contains local equality and two public overlap predicates, not the full operation-pair conflict/rebase matrix. A contextual actual commit-outcome check compares durable protobuf transactions instead of in-memory Operation equality (rust/lance/src/io/commit.rs:246-283); do not infer its identity rule from this module comment. (rust/lance-table/src/transaction/conflicts.rs:1-17)

### Lines 18-29

Handwritten PartialEq::eq borrows self/other and defines nested compare_vec<T:PartialEq>: equal lengths AND every left element appears somewhere in right. Append compares fragment vectors through it. Order is ignored but multiplicities are not matched: distinct A,B give [A,A]==[A,B] in one direction only. Complexity is quadratic in vector lengths times element equality; no explicit allocation in this helper. TODO proposes sorted construction but is not implemented. Nested Fragment/other equality can have additional costs. (rust/lance-table/src/transaction/conflicts.rs:18-29)

### Lines 30-51

Clone/Clone compares all five payload fields directly: is_shallow,ref_name,ref_version,ref_path,branch_name. No URI/path canonicalization, case folding, version lookup or shallow-only validation; optional None and Some(empty) differ. (rust/lance-table/src/transaction/conflicts.rs:30-51)

### Lines 52-67

Delete/Delete applies compare_vec separately to updated_fragments and deleted_fragment_ids, then exact predicate string equality. Semantically equivalent SQL strings need not compare equal; fragment/ID vector ordering is ignored with the helper duplicate caveat. (rust/lance-table/src/transaction/conflicts.rs:52-67)

### Lines 68-86

Overwrite/Overwrite compares fragments with compare_vec, Schema directly, optional config HashMaps directly, and optional initial_bases Vec directly. Thus base order remains significant here, unlike UpdateBases later; None differs from Some(empty). No normalized-effect comparison or initial-ID ignoring occurs in equality even though overwrite construction docs describe final ID reassignment. (rust/lance-table/src/transaction/conflicts.rs:68-86)

### Lines 87-96

CreateIndex/CreateIndex compares new_indices and removed_indices independently with compare_vec, delegating complete IndexMetadata PartialEq to each entry rather than comparing only names/UUIDs. Order-insensitivity has the same duplicate caveat. (rust/lance-table/src/transaction/conflicts.rs:87-96)

### Lines 97-112

Rewrite/Rewrite compares groups and rewritten_indices with compare_vec, then directly compares optional frag_reuse_index, including its metadata contents. Group element equality itself uses an unordered-membership helper; RewrittenIndex equality includes details/version/optional files. In-memory reuse entry participates even though operation docs say it is not serialized (rust/lance-table/src/transaction/operation.rs:89-111; rust/lance-table/src/transaction/operation.rs:363-397). Do not use this equality as a proved durable identity check. (rust/lance-table/src/transaction/conflicts.rs:97-112)

### Lines 113-128

Merge/Merge compares fragments with compare_vec, Schema directly and preserves_nullability bool directly. Equal schemas/fragments with different assertion flags are unequal. Neither validates the assertion nor checks row alignment. (rust/lance-table/src/transaction/conflicts.rs:113-128)

### Lines 129-133

Restore equality compares version u64 only; ReserveFragments compares num_fragments u32 only. No side effects or manifest lookup. Cross-kind cases are handled separately and always unequal. (rust/lance-table/src/transaction/conflicts.rs:129-133)

### Lines 134-170

Update/Update covers every current payload: compare_vec for removed IDs,updated fragments,new fragments,modified fields,compacted SSTables,preservation fields; direct equality for optional mode,inserted filter and updated offsets. HashMap/bitmap offsets use their structural equality, and filter equality includes stored representation/config, not merely logical key set. All vectors retain multiplicity caveats; no comparison normalizes duplicate fields/fragments or ignores transient inputs. CompactedSsTable contextual declaration compares shard UUID plus generation (rust/lance-table/src/system_index/mem_wal.rs:94-99). (rust/lance-table/src/transaction/conflicts.rs:134-170)

### Lines 171-180

Project/Project compares Schema and preserves_nullability directly. Same resulting schema with different proof assertion is unequal; no schema transition analysis in this arm. (rust/lance-table/src/transaction/conflicts.rs:171-180)

### Lines 181-199

UpdateConfig/UpdateConfig directly compares optional config/table/schema UpdateMaps and field-ID HashMap. UpdateMap derives PartialEq over ordered entries and replace flag, so different entry order can compare unequal even when resulting maps match; None differs from Some(empty), and a replacement differs from an incremental equivalent. Field HashMap iteration order itself is not meaningful for map equality (rust/lance-table/src/transaction/update_map.rs:13-56). (rust/lance-table/src/transaction/conflicts.rs:181-199)

### Lines 200-206

DataReplacement/DataReplacement repeats equal-length plus every-left-contained directly instead of calling compare_vec. Tuple equality compares fragment ID and DataFile. Comments introduce explicit cross-kind enumeration to force handling new variants; equality is not conflict compatibility. (rust/lance-table/src/transaction/conflicts.rs:200-206)

### Lines 207-246

Explicit Append-left cross-kind arms against Delete, Overwrite, CreateIndex, Rewrite, Merge, Restore, ReserveFragments, Update, Project, UpdateConfig, DataReplacement, UpdateMemWalState, Clone each compare std::mem::discriminant(self) with other. These are distinct variants, so every listed arm returns false independently of payload. No metadata-overlap or commit compatibility decision is made. Later UpdateBases and DataOverlay arms complete those pairs; blank separators carry no runtime behavior. (rust/lance-table/src/transaction/conflicts.rs:207-246)

### Lines 247-286

Explicit Delete-left cross-kind arms against Append, Overwrite, CreateIndex, Rewrite, Merge, Restore, ReserveFragments, Update, Project, UpdateConfig, DataReplacement, UpdateMemWalState, Clone each compare std::mem::discriminant(self) with other. These are distinct variants, so every listed arm returns false independently of payload. No metadata-overlap or commit compatibility decision is made. Later UpdateBases and DataOverlay arms complete those pairs; blank separators carry no runtime behavior. (rust/lance-table/src/transaction/conflicts.rs:247-286)

### Lines 287-326

Explicit Overwrite-left cross-kind arms against Append, Delete, CreateIndex, Rewrite, Merge, Restore, ReserveFragments, Update, Project, UpdateConfig, DataReplacement, UpdateMemWalState, Clone each compare std::mem::discriminant(self) with other. These are distinct variants, so every listed arm returns false independently of payload. No metadata-overlap or commit compatibility decision is made. Later UpdateBases and DataOverlay arms complete those pairs; blank separators carry no runtime behavior. (rust/lance-table/src/transaction/conflicts.rs:287-326)

### Lines 327-366

Explicit CreateIndex-left cross-kind arms against Append, Delete, Overwrite, Rewrite, Merge, Restore, ReserveFragments, Update, Project, UpdateConfig, DataReplacement, UpdateMemWalState, Clone each compare std::mem::discriminant(self) with other. These are distinct variants, so every listed arm returns false independently of payload. No metadata-overlap or commit compatibility decision is made. Later UpdateBases and DataOverlay arms complete those pairs; blank separators carry no runtime behavior. (rust/lance-table/src/transaction/conflicts.rs:327-366)

### Lines 367-406

Explicit Rewrite-left cross-kind arms against Append, Delete, Overwrite, CreateIndex, Merge, Restore, ReserveFragments, Update, Project, UpdateConfig, DataReplacement, UpdateMemWalState, Clone each compare std::mem::discriminant(self) with other. These are distinct variants, so every listed arm returns false independently of payload. No metadata-overlap or commit compatibility decision is made. Later UpdateBases and DataOverlay arms complete those pairs; blank separators carry no runtime behavior. (rust/lance-table/src/transaction/conflicts.rs:367-406)

### Lines 407-446

Explicit Merge-left cross-kind arms against Append, Delete, Overwrite, CreateIndex, Rewrite, Restore, ReserveFragments, Update, Project, UpdateConfig, DataReplacement, UpdateMemWalState, Clone each compare std::mem::discriminant(self) with other. These are distinct variants, so every listed arm returns false independently of payload. No metadata-overlap or commit compatibility decision is made. Later UpdateBases and DataOverlay arms complete those pairs; blank separators carry no runtime behavior. (rust/lance-table/src/transaction/conflicts.rs:407-446)

### Lines 447-486

Explicit Restore-left cross-kind arms against Append, Delete, Overwrite, CreateIndex, Rewrite, Merge, ReserveFragments, Update, Project, UpdateConfig, DataReplacement, UpdateMemWalState, Clone each compare std::mem::discriminant(self) with other. These are distinct variants, so every listed arm returns false independently of payload. No metadata-overlap or commit compatibility decision is made. Later UpdateBases and DataOverlay arms complete those pairs; blank separators carry no runtime behavior. (rust/lance-table/src/transaction/conflicts.rs:447-486)

### Lines 487-526

Explicit ReserveFragments-left cross-kind arms against Append, Delete, Overwrite, CreateIndex, Rewrite, Merge, Restore, Update, Project, UpdateConfig, DataReplacement, UpdateMemWalState, Clone each compare std::mem::discriminant(self) with other. These are distinct variants, so every listed arm returns false independently of payload. No metadata-overlap or commit compatibility decision is made. Later UpdateBases and DataOverlay arms complete those pairs; blank separators carry no runtime behavior. (rust/lance-table/src/transaction/conflicts.rs:487-526)

### Lines 527-566

Explicit Update-left cross-kind arms against Append, Delete, Overwrite, CreateIndex, Rewrite, Merge, Restore, ReserveFragments, Project, UpdateConfig, DataReplacement, UpdateMemWalState, Clone each compare std::mem::discriminant(self) with other. These are distinct variants, so every listed arm returns false independently of payload. No metadata-overlap or commit compatibility decision is made. Later UpdateBases and DataOverlay arms complete those pairs; blank separators carry no runtime behavior. (rust/lance-table/src/transaction/conflicts.rs:527-566)

### Lines 567-606

Explicit Project-left cross-kind arms against Append, Delete, Overwrite, CreateIndex, Rewrite, Merge, Restore, ReserveFragments, Update, UpdateConfig, DataReplacement, UpdateMemWalState, Clone each compare std::mem::discriminant(self) with other. These are distinct variants, so every listed arm returns false independently of payload. No metadata-overlap or commit compatibility decision is made. Later UpdateBases and DataOverlay arms complete those pairs; blank separators carry no runtime behavior. (rust/lance-table/src/transaction/conflicts.rs:567-606)

### Lines 607-646

Explicit UpdateConfig-left cross-kind arms against Append, Delete, Overwrite, CreateIndex, Rewrite, Merge, Restore, ReserveFragments, Update, Project, DataReplacement, UpdateMemWalState, Clone each compare std::mem::discriminant(self) with other. These are distinct variants, so every listed arm returns false independently of payload. No metadata-overlap or commit compatibility decision is made. Later UpdateBases and DataOverlay arms complete those pairs; blank separators carry no runtime behavior. (rust/lance-table/src/transaction/conflicts.rs:607-646)

### Lines 647-686

Explicit DataReplacement-left cross-kind arms against Append, Delete, Overwrite, CreateIndex, Rewrite, Merge, Restore, ReserveFragments, Update, Project, UpdateConfig, UpdateMemWalState, Clone each compare std::mem::discriminant(self) with other. These are distinct variants, so every listed arm returns false independently of payload. No metadata-overlap or commit compatibility decision is made. Later UpdateBases and DataOverlay arms complete those pairs; blank separators carry no runtime behavior. (rust/lance-table/src/transaction/conflicts.rs:647-686)

### Lines 687-725

Explicit UpdateMemWalState-left cross-kind arms against Append, Delete, Overwrite, CreateIndex, Rewrite, Merge, Restore, ReserveFragments, Update, Project, UpdateConfig, DataReplacement, Clone each compare std::mem::discriminant(self) with other. These are distinct variants, so every listed arm returns false independently of payload. No metadata-overlap or commit compatibility decision is made. Later UpdateBases and DataOverlay arms complete those pairs; blank separators carry no runtime behavior. (rust/lance-table/src/transaction/conflicts.rs:687-725)

### Lines 726-733

UpdateMemWalState/UpdateMemWalState compares compacted_sstables using compare_vec. Order is ignored, count must match and duplicate multiplicities remain unchecked; each table pointer equality includes shard UUID/generation. (rust/lance-table/src/transaction/conflicts.rs:726-733)

### Lines 734-773

Clone-left cross-kind arms against Append,Delete,Overwrite,CreateIndex,Rewrite,Merge,Restore,ReserveFragments,Update,Project,UpdateConfig,DataReplacement,UpdateMemWalState all compare differing discriminants and return false. UpdateBases/DataOverlay are handled below. These branches do not restrict legal shallow/deep clone operations. (rust/lance-table/src/transaction/conflicts.rs:734-773)

### Lines 774-777

UpdateBases/UpdateBases uses compare_vec for new_bases, unlike Overwrite.initial_bases direct Vec equality. Same elements in a different order can compare equal here; duplicates have membership asymmetry and no base-ID uniqueness check. (rust/lance-table/src/transaction/conflicts.rs:774-777)

### Lines 778-820

UpdateBases-left arms versus all14 other non-overlay variants (Append,Delete,Overwrite,CreateIndex,Rewrite,Merge,Restore,ReserveFragments,Update,Project,UpdateConfig,DataReplacement,UpdateMemWalState,Clone) compare discriminants and return false. No path/base merge or validation occurs. (rust/lance-table/src/transaction/conflicts.rs:778-820)

### Lines 821-862

Reverse arms put each of those14 non-overlay variants on left and UpdateBases on right, likewise returning false via differing discriminants. Both ordered comparisons are explicitly covered; this is enum inequality, not an assertion about whether transactions can coexist. (rust/lance-table/src/transaction/conflicts.rs:821-862)

### Lines 863-868

DataOverlay/DataOverlay uses compare_vec for groups. Each DataOverlayGroup derives equality over fragment ID plus ordered overlay Vec, so only outer group order is ignored; inner overlay order and committed versions remain meaningful. Remaining pairs with DataOverlay on either side return false, completing the16x16 variant cases. No tests here prove duplicate/reflexivity properties for arbitrary publicly constructed values (rust/lance-table/src/transaction/operation.rs:26-35). (rust/lance-table/src/transaction/conflicts.rs:863-868)

### Lines 869-897

Private Operation::get_upsert_config_keys returns owned Vec<String>. Overwrite Some(config_upsert_values) clones HashMap keys in unspecified order; UpdateConfig Some(config_updates) clones each Some-valued entry key in input order, preserving duplicates; other cases return empty. It ignores replace, final key effects, prior later deletes and all table/schema/field metadata. A Some(empty-string value) still counts as upsert. (rust/lance-table/src/transaction/conflicts.rs:869-897)

### Lines 898-918

Private get_delete_config_keys emits cloned None-valued entry keys only for UpdateConfig Some(config_updates), in list order with duplicates. All other variants including Overwrite return empty. replace=true does not add implicitly cleared keys and None entries still count as deletes even though apply_update_map replacement skips them. This is a syntactic intent extractor, not a final-map diff (rust/lance-table/src/transaction/update_map.rs:58-81). (rust/lance-table/src/transaction/conflicts.rs:898-918)

### Lines 919-955

Public modifies_same_metadata only handles two UpdateConfig variants. First table-map overlap uses update_maps_conflict; then any pair of Some schema_metadata_updates conflicts even if empty/disjoint; then any common field ID conflicts regardless of that field's inner keys or empty maps. Returns false if no category overlaps or either operation is another variant. Config updates are deliberately absent from this predicate and need upsert_key_conflict separately. No schema values, actual metadata contents, Merge or Overwrite special handling here. (rust/lance-table/src/transaction/conflicts.rs:919-955)

### Lines 956-974

Private update_maps_conflict returns false if either Option absent. With both Some, any replace=true returns true, even with zero entries on one or both sides. Otherwise collect left borrowed key strings into HashSet (duplicates collapse) and test any right key; insert versus delete values are ignored, so delete/delete same table key conflicts. Empty incremental map is disjoint. Expected linear hash work and O(unique left keys) additional references/storage; borrowed strings are not cloned. (rust/lance-table/src/transaction/conflicts.rs:956-974)

### Lines 975-991

Public upsert_key_conflict allocates four cloned-key Vecs from both operations, then checks left upserts intersect right upserts/deletes OR right upserts intersect left upserts/deletes. Shared delete-only keys are allowed; equal values still conflict; any syntactic upsert followed by deletion is still represented in both lists. replace flags/implicitly deleted keys are not considered. Vec::contains gives quadratic worst-case comparisons plus string costs; short-circuit occurs after all four lists have been built. Predicate is symmetric for ordinary strings. It returns bool with no error, IO, locks or mutation; consumer classifies the conflict. (rust/lance-table/src/transaction/conflicts.rs:975-991)

### Lines 992-1010

cfg(test) imports parent plus shared overlay fixture, DataOverlayGroup/UpdateMapEntry and HashMap. Private table_metadata_update constructs UpdateConfig with Some table UpdateMap from borrowed tuple entries, supplied replace, and no config/schema/field edits. Uses public From conversion to own strings; it commits nothing. (rust/lance-table/src/transaction/conflicts.rs:992-1010)

### Lines 1011-1022

Table metadata test compares one incremental upsert key=1 with same-key value2 (true), different-key value2 (false), and replacement of different key (true). It tests one argument order only; no missing options, empty maps, deletion pairs, schema/field categories, duplicate entries or config upsert predicate in this local test. (rust/lance-table/src/transaction/conflicts.rs:1011-1022)

### Lines 1023-1042

DataOverlay equality test uses local closure creating one group fragment0 with one legacy-file fixture field and committed_version1. Requires same field equality, differing field inequality, and inequality against empty Rewrite in overlay-left order. Comments refer to prior regressions but no historical commit is independently inspected. No outer-group permutation/duplicate, inner-order, reverse-kind, all-variant, config conflict or durable equality fixture here. Tests read, not executed. (rust/lance-table/src/transaction/conflicts.rs:1023-1042)

## Interaction and interpretation limits

All1042 lines fully read in four bounded chunks. The256 ordered variant-kind equality cases are distinguished from commit compatibility. Full conflict_resolver.rs and durable protobuf encoder remain pending; narrow consumer context is recorded separately. No source edits, builds/tests or runtime reproduction. Contextual commit outcome compares protobuf forms (rust/lance/src/io/commit.rs:246-283), while shown overwrite/config consumer methods map predicates to conflicts (rust/lance/src/io/commit/conflict_resolver.rs:1536-1583; rust/lance/src/io/commit/conflict_resolver.rs:2012-2072). Earlier checks in that resolver may impose additional rules.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Deciding whether two operations describe the same change or touch the same
    5 | //! metadata.
    6 | //!
    7 | //! The commit path uses these when it retries against a newer version: equality
    8 | //! tells it whether the operation it is holding is the one already committed, and
    9 | //! the metadata checks tell it whether a concurrent operation wrote keys it
   10 | //! depends on.
   11 | //!
   12 | //! `PartialEq` is hand-written rather than derived because several operations
   13 | //! carry `Vec<T>` fields whose order is not meaningful.
   14 | 
   15 | use crate::transaction::{Operation, UpdateMap};
   16 | use std::collections::HashSet;
   17 | 
   18 | impl PartialEq for Operation {
   19 |     fn eq(&self, other: &Self) -> bool {
   20 |         // Many of the operations contain `Vec<T>` where the order of the
   21 |         // elements don't matter. So we need to compare them in a way that
   22 |         // ignores the order of the elements.
   23 |         // TODO: we can make it so the vecs are always constructed in order.
   24 |         // Then we can use `==` instead of `compare_vec`.
   25 |         fn compare_vec<T: PartialEq>(a: &[T], b: &[T]) -> bool {
   26 |             a.len() == b.len() && a.iter().all(|f| b.contains(f))
   27 |         }
   28 |         match (self, other) {
   29 |             (Self::Append { fragments: a }, Self::Append { fragments: b }) => compare_vec(a, b),
   30 |             (
   31 |                 Self::Clone {
   32 |                     is_shallow: a_is_shallow,
   33 |                     ref_name: a_ref_name,
   34 |                     ref_version: a_ref_version,
   35 |                     ref_path: a_source_path,
   36 |                     branch_name: a_branch_name,
   37 |                 },
   38 |                 Self::Clone {
   39 |                     is_shallow: b_is_shallow,
   40 |                     ref_name: b_ref_name,
   41 |                     ref_version: b_ref_version,
   42 |                     ref_path: b_source_path,
   43 |                     branch_name: b_branch_name,
   44 |                 },
   45 |             ) => {
   46 |                 a_is_shallow == b_is_shallow
   47 |                     && a_ref_name == b_ref_name
   48 |                     && a_ref_version == b_ref_version
   49 |                     && a_source_path == b_source_path
   50 |                     && a_branch_name == b_branch_name
   51 |             }
   52 |             (
   53 |                 Self::Delete {
   54 |                     updated_fragments: a_updated,
   55 |                     deleted_fragment_ids: a_deleted,
   56 |                     predicate: a_predicate,
   57 |                 },
   58 |                 Self::Delete {
   59 |                     updated_fragments: b_updated,
   60 |                     deleted_fragment_ids: b_deleted,
   61 |                     predicate: b_predicate,
   62 |                 },
   63 |             ) => {
   64 |                 compare_vec(a_updated, b_updated)
   65 |                     && compare_vec(a_deleted, b_deleted)
   66 |                     && a_predicate == b_predicate
   67 |             }
   68 |             (
   69 |                 Self::Overwrite {
   70 |                     fragments: a_fragments,
   71 |                     schema: a_schema,
   72 |                     config_upsert_values: a_config,
   73 |                     initial_bases: a_initial,
   74 |                 },
   75 |                 Self::Overwrite {
   76 |                     fragments: b_fragments,
   77 |                     schema: b_schema,
   78 |                     config_upsert_values: b_config,
   79 |                     initial_bases: b_initial,
   80 |                 },
   81 |             ) => {
   82 |                 compare_vec(a_fragments, b_fragments)
   83 |                     && a_schema == b_schema
   84 |                     && a_config == b_config
   85 |                     && a_initial == b_initial
   86 |             }
   87 |             (
   88 |                 Self::CreateIndex {
   89 |                     new_indices: a_new,
   90 |                     removed_indices: a_removed,
   91 |                 },
   92 |                 Self::CreateIndex {
   93 |                     new_indices: b_new,
   94 |                     removed_indices: b_removed,
   95 |                 },
   96 |             ) => compare_vec(a_new, b_new) && compare_vec(a_removed, b_removed),
   97 |             (
   98 |                 Self::Rewrite {
   99 |                     groups: a_groups,
  100 |                     rewritten_indices: a_indices,
  101 |                     frag_reuse_index: a_frag_reuse_index,
  102 |                 },
  103 |                 Self::Rewrite {
  104 |                     groups: b_groups,
  105 |                     rewritten_indices: b_indices,
  106 |                     frag_reuse_index: b_frag_reuse_index,
  107 |                 },
  108 |             ) => {
  109 |                 compare_vec(a_groups, b_groups)
  110 |                     && compare_vec(a_indices, b_indices)
  111 |                     && a_frag_reuse_index == b_frag_reuse_index
  112 |             }
  113 |             (
  114 |                 Self::Merge {
  115 |                     fragments: a_fragments,
  116 |                     schema: a_schema,
  117 |                     preserves_nullability: a_preserves,
  118 |                 },
  119 |                 Self::Merge {
  120 |                     fragments: b_fragments,
  121 |                     schema: b_schema,
  122 |                     preserves_nullability: b_preserves,
  123 |                 },
  124 |             ) => {
  125 |                 compare_vec(a_fragments, b_fragments)
  126 |                     && a_schema == b_schema
  127 |                     && a_preserves == b_preserves
  128 |             }
  129 |             (Self::Restore { version: a }, Self::Restore { version: b }) => a == b,
  130 |             (
  131 |                 Self::ReserveFragments { num_fragments: a },
  132 |                 Self::ReserveFragments { num_fragments: b },
  133 |             ) => a == b,
  134 |             (
  135 |                 Self::Update {
  136 |                     removed_fragment_ids: a_removed,
  137 |                     updated_fragments: a_updated,
  138 |                     new_fragments: a_new,
  139 |                     fields_modified: a_fields,
  140 |                     compacted_sstables: a_compacted_sstables,
  141 |                     fields_for_preserving_frag_bitmap: a_fields_for_preserving_frag_bitmap,
  142 |                     update_mode: a_update_mode,
  143 |                     inserted_rows_filter: a_inserted_rows_filter,
  144 |                     updated_fragment_offsets: a_updated_fragment_offsets,
  145 |                 },
  146 |                 Self::Update {
  147 |                     removed_fragment_ids: b_removed,
  148 |                     updated_fragments: b_updated,
  149 |                     new_fragments: b_new,
  150 |                     fields_modified: b_fields,
  151 |                     compacted_sstables: b_compacted_sstables,
  152 |                     fields_for_preserving_frag_bitmap: b_fields_for_preserving_frag_bitmap,
  153 |                     update_mode: b_update_mode,
  154 |                     inserted_rows_filter: b_inserted_rows_filter,
  155 |                     updated_fragment_offsets: b_updated_fragment_offsets,
  156 |                 },
  157 |             ) => {
  158 |                 compare_vec(a_removed, b_removed)
  159 |                     && compare_vec(a_updated, b_updated)
  160 |                     && compare_vec(a_new, b_new)
  161 |                     && compare_vec(a_fields, b_fields)
  162 |                     && compare_vec(a_compacted_sstables, b_compacted_sstables)
  163 |                     && compare_vec(
  164 |                         a_fields_for_preserving_frag_bitmap,
  165 |                         b_fields_for_preserving_frag_bitmap,
  166 |                     )
  167 |                     && a_update_mode == b_update_mode
  168 |                     && a_inserted_rows_filter == b_inserted_rows_filter
  169 |                     && a_updated_fragment_offsets == b_updated_fragment_offsets
  170 |             }
  171 |             (
  172 |                 Self::Project {
  173 |                     schema: a,
  174 |                     preserves_nullability: a_preserves,
  175 |                 },
  176 |                 Self::Project {
  177 |                     schema: b,
  178 |                     preserves_nullability: b_preserves,
  179 |                 },
  180 |             ) => a == b && a_preserves == b_preserves,
  181 |             (
  182 |                 Self::UpdateConfig {
  183 |                     config_updates: a_config,
  184 |                     table_metadata_updates: a_table_metadata,
  185 |                     schema_metadata_updates: a_schema,
  186 |                     field_metadata_updates: a_field,
  187 |                 },
  188 |                 Self::UpdateConfig {
  189 |                     config_updates: b_config,
  190 |                     table_metadata_updates: b_table_metadata,
  191 |                     schema_metadata_updates: b_schema,
  192 |                     field_metadata_updates: b_field,
  193 |                 },
  194 |             ) => {
  195 |                 a_config == b_config
  196 |                     && a_table_metadata == b_table_metadata
  197 |                     && a_schema == b_schema
  198 |                     && a_field == b_field
  199 |             }
  200 |             (
  201 |                 Self::DataReplacement { replacements: a },
  202 |                 Self::DataReplacement { replacements: b },
  203 |             ) => a.len() == b.len() && a.iter().all(|r| b.contains(r)),
  204 |             // Handle all remaining combinations.
  205 |             // We spell out all combinations explicitly to prevent
  206 |             // us accidentally handling a new case in the wrong way.
  207 |             (Self::Append { .. }, Self::Delete { .. }) => {
  208 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  209 |             }
  210 |             (Self::Append { .. }, Self::Overwrite { .. }) => {
  211 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  212 |             }
  213 |             (Self::Append { .. }, Self::CreateIndex { .. }) => {
  214 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  215 |             }
  216 |             (Self::Append { .. }, Self::Rewrite { .. }) => {
  217 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  218 |             }
  219 |             (Self::Append { .. }, Self::Merge { .. }) => {
  220 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  221 |             }
  222 |             (Self::Append { .. }, Self::Restore { .. }) => {
  223 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  224 |             }
  225 |             (Self::Append { .. }, Self::ReserveFragments { .. }) => {
  226 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  227 |             }
  228 |             (Self::Append { .. }, Self::Update { .. }) => {
  229 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  230 |             }
  231 |             (Self::Append { .. }, Self::Project { .. }) => {
  232 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  233 |             }
  234 |             (Self::Append { .. }, Self::UpdateConfig { .. }) => {
  235 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  236 |             }
  237 |             (Self::Append { .. }, Self::DataReplacement { .. }) => {
  238 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  239 |             }
  240 |             (Self::Append { .. }, Self::UpdateMemWalState { .. }) => {
  241 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  242 |             }
  243 |             (Self::Append { .. }, Self::Clone { .. }) => {
  244 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  245 |             }
  246 | 
  247 |             (Self::Delete { .. }, Self::Append { .. }) => {
  248 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  249 |             }
  250 |             (Self::Delete { .. }, Self::Overwrite { .. }) => {
  251 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  252 |             }
  253 |             (Self::Delete { .. }, Self::CreateIndex { .. }) => {
  254 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  255 |             }
  256 |             (Self::Delete { .. }, Self::Rewrite { .. }) => {
  257 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  258 |             }
  259 |             (Self::Delete { .. }, Self::Merge { .. }) => {
  260 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  261 |             }
  262 |             (Self::Delete { .. }, Self::Restore { .. }) => {
  263 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  264 |             }
  265 |             (Self::Delete { .. }, Self::ReserveFragments { .. }) => {
  266 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  267 |             }
  268 |             (Self::Delete { .. }, Self::Update { .. }) => {
  269 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  270 |             }
  271 |             (Self::Delete { .. }, Self::Project { .. }) => {
  272 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  273 |             }
  274 |             (Self::Delete { .. }, Self::UpdateConfig { .. }) => {
  275 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  276 |             }
  277 |             (Self::Delete { .. }, Self::DataReplacement { .. }) => {
  278 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  279 |             }
  280 |             (Self::Delete { .. }, Self::UpdateMemWalState { .. }) => {
  281 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  282 |             }
  283 |             (Self::Delete { .. }, Self::Clone { .. }) => {
  284 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  285 |             }
  286 | 
  287 |             (Self::Overwrite { .. }, Self::Append { .. }) => {
  288 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  289 |             }
  290 |             (Self::Overwrite { .. }, Self::Delete { .. }) => {
  291 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  292 |             }
  293 |             (Self::Overwrite { .. }, Self::CreateIndex { .. }) => {
  294 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  295 |             }
  296 |             (Self::Overwrite { .. }, Self::Rewrite { .. }) => {
  297 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  298 |             }
  299 |             (Self::Overwrite { .. }, Self::Merge { .. }) => {
  300 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  301 |             }
  302 |             (Self::Overwrite { .. }, Self::Restore { .. }) => {
  303 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  304 |             }
  305 |             (Self::Overwrite { .. }, Self::ReserveFragments { .. }) => {
  306 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  307 |             }
  308 |             (Self::Overwrite { .. }, Self::Update { .. }) => {
  309 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  310 |             }
  311 |             (Self::Overwrite { .. }, Self::Project { .. }) => {
  312 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  313 |             }
  314 |             (Self::Overwrite { .. }, Self::UpdateConfig { .. }) => {
  315 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  316 |             }
  317 |             (Self::Overwrite { .. }, Self::DataReplacement { .. }) => {
  318 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  319 |             }
  320 |             (Self::Overwrite { .. }, Self::UpdateMemWalState { .. }) => {
  321 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  322 |             }
  323 |             (Self::Overwrite { .. }, Self::Clone { .. }) => {
  324 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  325 |             }
  326 | 
  327 |             (Self::CreateIndex { .. }, Self::Append { .. }) => {
  328 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  329 |             }
  330 |             (Self::CreateIndex { .. }, Self::Delete { .. }) => {
  331 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  332 |             }
  333 |             (Self::CreateIndex { .. }, Self::Overwrite { .. }) => {
  334 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  335 |             }
  336 |             (Self::CreateIndex { .. }, Self::Rewrite { .. }) => {
  337 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  338 |             }
  339 |             (Self::CreateIndex { .. }, Self::Merge { .. }) => {
  340 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  341 |             }
  342 |             (Self::CreateIndex { .. }, Self::Restore { .. }) => {
  343 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  344 |             }
  345 |             (Self::CreateIndex { .. }, Self::ReserveFragments { .. }) => {
  346 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  347 |             }
  348 |             (Self::CreateIndex { .. }, Self::Update { .. }) => {
  349 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  350 |             }
  351 |             (Self::CreateIndex { .. }, Self::Project { .. }) => {
  352 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  353 |             }
  354 |             (Self::CreateIndex { .. }, Self::UpdateConfig { .. }) => {
  355 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  356 |             }
  357 |             (Self::CreateIndex { .. }, Self::DataReplacement { .. }) => {
  358 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  359 |             }
  360 |             (Self::CreateIndex { .. }, Self::UpdateMemWalState { .. }) => {
  361 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  362 |             }
  363 |             (Self::CreateIndex { .. }, Self::Clone { .. }) => {
  364 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  365 |             }
  366 | 
  367 |             (Self::Rewrite { .. }, Self::Append { .. }) => {
  368 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  369 |             }
  370 |             (Self::Rewrite { .. }, Self::Delete { .. }) => {
  371 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  372 |             }
  373 |             (Self::Rewrite { .. }, Self::Overwrite { .. }) => {
  374 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  375 |             }
  376 |             (Self::Rewrite { .. }, Self::CreateIndex { .. }) => {
  377 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  378 |             }
  379 |             (Self::Rewrite { .. }, Self::Merge { .. }) => {
  380 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  381 |             }
  382 |             (Self::Rewrite { .. }, Self::Restore { .. }) => {
  383 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  384 |             }
  385 |             (Self::Rewrite { .. }, Self::ReserveFragments { .. }) => {
  386 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  387 |             }
  388 |             (Self::Rewrite { .. }, Self::Update { .. }) => {
  389 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  390 |             }
  391 |             (Self::Rewrite { .. }, Self::Project { .. }) => {
  392 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  393 |             }
  394 |             (Self::Rewrite { .. }, Self::UpdateConfig { .. }) => {
  395 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  396 |             }
  397 |             (Self::Rewrite { .. }, Self::DataReplacement { .. }) => {
  398 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  399 |             }
  400 |             (Self::Rewrite { .. }, Self::UpdateMemWalState { .. }) => {
  401 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  402 |             }
  403 |             (Self::Rewrite { .. }, Self::Clone { .. }) => {
  404 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  405 |             }
  406 | 
  407 |             (Self::Merge { .. }, Self::Append { .. }) => {
  408 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  409 |             }
  410 |             (Self::Merge { .. }, Self::Delete { .. }) => {
  411 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  412 |             }
  413 |             (Self::Merge { .. }, Self::Overwrite { .. }) => {
  414 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  415 |             }
  416 |             (Self::Merge { .. }, Self::CreateIndex { .. }) => {
  417 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  418 |             }
  419 |             (Self::Merge { .. }, Self::Rewrite { .. }) => {
  420 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  421 |             }
  422 |             (Self::Merge { .. }, Self::Restore { .. }) => {
  423 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  424 |             }
  425 |             (Self::Merge { .. }, Self::ReserveFragments { .. }) => {
  426 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  427 |             }
  428 |             (Self::Merge { .. }, Self::Update { .. }) => {
  429 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  430 |             }
  431 |             (Self::Merge { .. }, Self::Project { .. }) => {
  432 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  433 |             }
  434 |             (Self::Merge { .. }, Self::UpdateConfig { .. }) => {
  435 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  436 |             }
  437 |             (Self::Merge { .. }, Self::DataReplacement { .. }) => {
  438 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  439 |             }
  440 |             (Self::Merge { .. }, Self::UpdateMemWalState { .. }) => {
  441 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  442 |             }
  443 |             (Self::Merge { .. }, Self::Clone { .. }) => {
  444 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  445 |             }
  446 | 
  447 |             (Self::Restore { .. }, Self::Append { .. }) => {
  448 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  449 |             }
  450 |             (Self::Restore { .. }, Self::Delete { .. }) => {
  451 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  452 |             }
  453 |             (Self::Restore { .. }, Self::Overwrite { .. }) => {
  454 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  455 |             }
  456 |             (Self::Restore { .. }, Self::CreateIndex { .. }) => {
  457 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  458 |             }
  459 |             (Self::Restore { .. }, Self::Rewrite { .. }) => {
  460 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  461 |             }
  462 |             (Self::Restore { .. }, Self::Merge { .. }) => {
  463 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  464 |             }
  465 |             (Self::Restore { .. }, Self::ReserveFragments { .. }) => {
  466 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  467 |             }
  468 |             (Self::Restore { .. }, Self::Update { .. }) => {
  469 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  470 |             }
  471 |             (Self::Restore { .. }, Self::Project { .. }) => {
  472 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  473 |             }
  474 |             (Self::Restore { .. }, Self::UpdateConfig { .. }) => {
  475 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  476 |             }
  477 |             (Self::Restore { .. }, Self::DataReplacement { .. }) => {
  478 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  479 |             }
  480 |             (Self::Restore { .. }, Self::UpdateMemWalState { .. }) => {
  481 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  482 |             }
  483 |             (Self::Restore { .. }, Self::Clone { .. }) => {
  484 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  485 |             }
  486 | 
  487 |             (Self::ReserveFragments { .. }, Self::Append { .. }) => {
  488 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  489 |             }
  490 |             (Self::ReserveFragments { .. }, Self::Delete { .. }) => {
  491 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  492 |             }
  493 |             (Self::ReserveFragments { .. }, Self::Overwrite { .. }) => {
  494 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  495 |             }
  496 |             (Self::ReserveFragments { .. }, Self::CreateIndex { .. }) => {
  497 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  498 |             }
  499 |             (Self::ReserveFragments { .. }, Self::Rewrite { .. }) => {
  500 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  501 |             }
  502 |             (Self::ReserveFragments { .. }, Self::Merge { .. }) => {
  503 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  504 |             }
  505 |             (Self::ReserveFragments { .. }, Self::Restore { .. }) => {
  506 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  507 |             }
  508 |             (Self::ReserveFragments { .. }, Self::Update { .. }) => {
  509 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  510 |             }
  511 |             (Self::ReserveFragments { .. }, Self::Project { .. }) => {
  512 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  513 |             }
  514 |             (Self::ReserveFragments { .. }, Self::UpdateConfig { .. }) => {
  515 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  516 |             }
  517 |             (Self::ReserveFragments { .. }, Self::DataReplacement { .. }) => {
  518 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  519 |             }
  520 |             (Self::ReserveFragments { .. }, Self::UpdateMemWalState { .. }) => {
  521 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  522 |             }
  523 |             (Self::ReserveFragments { .. }, Self::Clone { .. }) => {
  524 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  525 |             }
  526 | 
  527 |             (Self::Update { .. }, Self::Append { .. }) => {
  528 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  529 |             }
  530 |             (Self::Update { .. }, Self::Delete { .. }) => {
  531 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  532 |             }
  533 |             (Self::Update { .. }, Self::Overwrite { .. }) => {
  534 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  535 |             }
  536 |             (Self::Update { .. }, Self::CreateIndex { .. }) => {
  537 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  538 |             }
  539 |             (Self::Update { .. }, Self::Rewrite { .. }) => {
  540 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  541 |             }
  542 |             (Self::Update { .. }, Self::Merge { .. }) => {
  543 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  544 |             }
  545 |             (Self::Update { .. }, Self::Restore { .. }) => {
  546 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  547 |             }
  548 |             (Self::Update { .. }, Self::ReserveFragments { .. }) => {
  549 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  550 |             }
  551 |             (Self::Update { .. }, Self::Project { .. }) => {
  552 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  553 |             }
  554 |             (Self::Update { .. }, Self::UpdateConfig { .. }) => {
  555 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  556 |             }
  557 |             (Self::Update { .. }, Self::DataReplacement { .. }) => {
  558 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  559 |             }
  560 |             (Self::Update { .. }, Self::UpdateMemWalState { .. }) => {
  561 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  562 |             }
  563 |             (Self::Update { .. }, Self::Clone { .. }) => {
  564 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  565 |             }
  566 | 
  567 |             (Self::Project { .. }, Self::Append { .. }) => {
  568 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  569 |             }
  570 |             (Self::Project { .. }, Self::Delete { .. }) => {
  571 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  572 |             }
  573 |             (Self::Project { .. }, Self::Overwrite { .. }) => {
  574 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  575 |             }
  576 |             (Self::Project { .. }, Self::CreateIndex { .. }) => {
  577 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  578 |             }
  579 |             (Self::Project { .. }, Self::Rewrite { .. }) => {
  580 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  581 |             }
  582 |             (Self::Project { .. }, Self::Merge { .. }) => {
  583 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  584 |             }
  585 |             (Self::Project { .. }, Self::Restore { .. }) => {
  586 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  587 |             }
  588 |             (Self::Project { .. }, Self::ReserveFragments { .. }) => {
  589 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  590 |             }
  591 |             (Self::Project { .. }, Self::Update { .. }) => {
  592 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  593 |             }
  594 |             (Self::Project { .. }, Self::UpdateConfig { .. }) => {
  595 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  596 |             }
  597 |             (Self::Project { .. }, Self::DataReplacement { .. }) => {
  598 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  599 |             }
  600 |             (Self::Project { .. }, Self::UpdateMemWalState { .. }) => {
  601 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  602 |             }
  603 |             (Self::Project { .. }, Self::Clone { .. }) => {
  604 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  605 |             }
  606 | 
  607 |             (Self::UpdateConfig { .. }, Self::Append { .. }) => {
  608 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  609 |             }
  610 |             (Self::UpdateConfig { .. }, Self::Delete { .. }) => {
  611 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  612 |             }
  613 |             (Self::UpdateConfig { .. }, Self::Overwrite { .. }) => {
  614 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  615 |             }
  616 |             (Self::UpdateConfig { .. }, Self::CreateIndex { .. }) => {
  617 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  618 |             }
  619 |             (Self::UpdateConfig { .. }, Self::Rewrite { .. }) => {
  620 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  621 |             }
  622 |             (Self::UpdateConfig { .. }, Self::Merge { .. }) => {
  623 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  624 |             }
  625 |             (Self::UpdateConfig { .. }, Self::Restore { .. }) => {
  626 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  627 |             }
  628 |             (Self::UpdateConfig { .. }, Self::ReserveFragments { .. }) => {
  629 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  630 |             }
  631 |             (Self::UpdateConfig { .. }, Self::Update { .. }) => {
  632 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  633 |             }
  634 |             (Self::UpdateConfig { .. }, Self::Project { .. }) => {
  635 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  636 |             }
  637 |             (Self::UpdateConfig { .. }, Self::DataReplacement { .. }) => {
  638 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  639 |             }
  640 |             (Self::UpdateConfig { .. }, Self::UpdateMemWalState { .. }) => {
  641 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  642 |             }
  643 |             (Self::UpdateConfig { .. }, Self::Clone { .. }) => {
  644 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  645 |             }
  646 | 
  647 |             (Self::DataReplacement { .. }, Self::Append { .. }) => {
  648 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  649 |             }
  650 |             (Self::DataReplacement { .. }, Self::Delete { .. }) => {
  651 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  652 |             }
  653 |             (Self::DataReplacement { .. }, Self::Overwrite { .. }) => {
  654 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  655 |             }
  656 |             (Self::DataReplacement { .. }, Self::CreateIndex { .. }) => {
  657 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  658 |             }
  659 |             (Self::DataReplacement { .. }, Self::Rewrite { .. }) => {
  660 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  661 |             }
  662 |             (Self::DataReplacement { .. }, Self::Merge { .. }) => {
  663 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  664 |             }
  665 |             (Self::DataReplacement { .. }, Self::Restore { .. }) => {
  666 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  667 |             }
  668 |             (Self::DataReplacement { .. }, Self::ReserveFragments { .. }) => {
  669 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  670 |             }
  671 |             (Self::DataReplacement { .. }, Self::Update { .. }) => {
  672 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  673 |             }
  674 |             (Self::DataReplacement { .. }, Self::Project { .. }) => {
  675 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  676 |             }
  677 |             (Self::DataReplacement { .. }, Self::UpdateConfig { .. }) => {
  678 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  679 |             }
  680 |             (Self::DataReplacement { .. }, Self::UpdateMemWalState { .. }) => {
  681 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  682 |             }
  683 |             (Self::DataReplacement { .. }, Self::Clone { .. }) => {
  684 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  685 |             }
  686 | 
  687 |             (Self::UpdateMemWalState { .. }, Self::Append { .. }) => {
  688 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  689 |             }
  690 |             (Self::UpdateMemWalState { .. }, Self::Delete { .. }) => {
  691 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  692 |             }
  693 |             (Self::UpdateMemWalState { .. }, Self::Overwrite { .. }) => {
  694 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  695 |             }
  696 |             (Self::UpdateMemWalState { .. }, Self::CreateIndex { .. }) => {
  697 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  698 |             }
  699 |             (Self::UpdateMemWalState { .. }, Self::Rewrite { .. }) => {
  700 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  701 |             }
  702 |             (Self::UpdateMemWalState { .. }, Self::Merge { .. }) => {
  703 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  704 |             }
  705 |             (Self::UpdateMemWalState { .. }, Self::Restore { .. }) => {
  706 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  707 |             }
  708 |             (Self::UpdateMemWalState { .. }, Self::ReserveFragments { .. }) => {
  709 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  710 |             }
  711 |             (Self::UpdateMemWalState { .. }, Self::Update { .. }) => {
  712 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  713 |             }
  714 |             (Self::UpdateMemWalState { .. }, Self::Project { .. }) => {
  715 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  716 |             }
  717 |             (Self::UpdateMemWalState { .. }, Self::UpdateConfig { .. }) => {
  718 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  719 |             }
  720 |             (Self::UpdateMemWalState { .. }, Self::DataReplacement { .. }) => {
  721 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  722 |             }
  723 |             (Self::UpdateMemWalState { .. }, Self::Clone { .. }) => {
  724 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  725 |             }
  726 |             (
  727 |                 Self::UpdateMemWalState {
  728 |                     compacted_sstables: a_compacted,
  729 |                 },
  730 |                 Self::UpdateMemWalState {
  731 |                     compacted_sstables: b_compacted,
  732 |                 },
  733 |             ) => compare_vec(a_compacted, b_compacted),
  734 |             (Self::Clone { .. }, Self::Append { .. }) => {
  735 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  736 |             }
  737 |             (Self::Clone { .. }, Self::Delete { .. }) => {
  738 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  739 |             }
  740 |             (Self::Clone { .. }, Self::Overwrite { .. }) => {
  741 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  742 |             }
  743 |             (Self::Clone { .. }, Self::CreateIndex { .. }) => {
  744 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  745 |             }
  746 |             (Self::Clone { .. }, Self::Rewrite { .. }) => {
  747 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  748 |             }
  749 |             (Self::Clone { .. }, Self::Merge { .. }) => {
  750 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  751 |             }
  752 |             (Self::Clone { .. }, Self::Restore { .. }) => {
  753 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  754 |             }
  755 |             (Self::Clone { .. }, Self::ReserveFragments { .. }) => {
  756 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  757 |             }
  758 |             (Self::Clone { .. }, Self::Update { .. }) => {
  759 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  760 |             }
  761 |             (Self::Clone { .. }, Self::Project { .. }) => {
  762 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  763 |             }
  764 |             (Self::Clone { .. }, Self::UpdateConfig { .. }) => {
  765 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  766 |             }
  767 |             (Self::Clone { .. }, Self::DataReplacement { .. }) => {
  768 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  769 |             }
  770 |             (Self::Clone { .. }, Self::UpdateMemWalState { .. }) => {
  771 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  772 |             }
  773 | 
  774 |             (Self::UpdateBases { new_bases: a }, Self::UpdateBases { new_bases: b }) => {
  775 |                 compare_vec(a, b)
  776 |             }
  777 | 
  778 |             (Self::UpdateBases { .. }, Self::Append { .. }) => {
  779 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  780 |             }
  781 |             (Self::UpdateBases { .. }, Self::Delete { .. }) => {
  782 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  783 |             }
  784 |             (Self::UpdateBases { .. }, Self::Overwrite { .. }) => {
  785 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  786 |             }
  787 |             (Self::UpdateBases { .. }, Self::CreateIndex { .. }) => {
  788 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  789 |             }
  790 |             (Self::UpdateBases { .. }, Self::Rewrite { .. }) => {
  791 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  792 |             }
  793 |             (Self::UpdateBases { .. }, Self::Merge { .. }) => {
  794 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  795 |             }
  796 |             (Self::UpdateBases { .. }, Self::Restore { .. }) => {
  797 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  798 |             }
  799 |             (Self::UpdateBases { .. }, Self::ReserveFragments { .. }) => {
  800 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  801 |             }
  802 |             (Self::UpdateBases { .. }, Self::Update { .. }) => {
  803 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  804 |             }
  805 |             (Self::UpdateBases { .. }, Self::Project { .. }) => {
  806 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  807 |             }
  808 |             (Self::UpdateBases { .. }, Self::UpdateConfig { .. }) => {
  809 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  810 |             }
  811 |             (Self::UpdateBases { .. }, Self::DataReplacement { .. }) => {
  812 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  813 |             }
  814 |             (Self::UpdateBases { .. }, Self::UpdateMemWalState { .. }) => {
  815 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  816 |             }
  817 |             (Self::UpdateBases { .. }, Self::Clone { .. }) => {
  818 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  819 |             }
  820 | 
  821 |             (Self::Append { .. }, Self::UpdateBases { .. }) => {
  822 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  823 |             }
  824 |             (Self::Delete { .. }, Self::UpdateBases { .. }) => {
  825 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  826 |             }
  827 |             (Self::Overwrite { .. }, Self::UpdateBases { .. }) => {
  828 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  829 |             }
  830 |             (Self::CreateIndex { .. }, Self::UpdateBases { .. }) => {
  831 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  832 |             }
  833 |             (Self::Rewrite { .. }, Self::UpdateBases { .. }) => {
  834 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  835 |             }
  836 |             (Self::Merge { .. }, Self::UpdateBases { .. }) => {
  837 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  838 |             }
  839 |             (Self::Restore { .. }, Self::UpdateBases { .. }) => {
  840 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  841 |             }
  842 |             (Self::ReserveFragments { .. }, Self::UpdateBases { .. }) => {
  843 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  844 |             }
  845 |             (Self::Update { .. }, Self::UpdateBases { .. }) => {
  846 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  847 |             }
  848 |             (Self::Project { .. }, Self::UpdateBases { .. }) => {
  849 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  850 |             }
  851 |             (Self::UpdateConfig { .. }, Self::UpdateBases { .. }) => {
  852 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  853 |             }
  854 |             (Self::DataReplacement { .. }, Self::UpdateBases { .. }) => {
  855 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  856 |             }
  857 |             (Self::UpdateMemWalState { .. }, Self::UpdateBases { .. }) => {
  858 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  859 |             }
  860 |             (Self::Clone { .. }, Self::UpdateBases { .. }) => {
  861 |                 std::mem::discriminant(self) == std::mem::discriminant(other)
  862 |             }
  863 |             (Self::DataOverlay { groups: a }, Self::DataOverlay { groups: b }) => compare_vec(a, b),
  864 |             (Self::DataOverlay { .. }, _) | (_, Self::DataOverlay { .. }) => false,
  865 |         }
  866 |     }
  867 | }
  868 | 
  869 | impl Operation {
  870 |     /// Returns the config keys that have been upserted by this operation.
  871 |     fn get_upsert_config_keys(&self) -> Vec<String> {
  872 |         match self {
  873 |             Self::Overwrite {
  874 |                 config_upsert_values: Some(upsert_values),
  875 |                 ..
  876 |             } => {
  877 |                 let vec: Vec<String> = upsert_values.keys().cloned().collect();
  878 |                 vec
  879 |             }
  880 |             Self::UpdateConfig {
  881 |                 config_updates: Some(config_updates),
  882 |                 ..
  883 |             } => config_updates
  884 |                 .update_entries
  885 |                 .iter()
  886 |                 .filter_map(|entry| {
  887 |                     if entry.value.is_some() {
  888 |                         Some(entry.key.clone())
  889 |                     } else {
  890 |                         None
  891 |                     }
  892 |                 })
  893 |                 .collect(),
  894 |             _ => Vec::<String>::new(),
  895 |         }
  896 |     }
  897 | 
  898 |     /// Returns the config keys that have been deleted by this operation.
  899 |     fn get_delete_config_keys(&self) -> Vec<String> {
  900 |         match self {
  901 |             Self::UpdateConfig {
  902 |                 config_updates: Some(config_updates),
  903 |                 ..
  904 |             } => config_updates
  905 |                 .update_entries
  906 |                 .iter()
  907 |                 .filter_map(|entry| {
  908 |                     if entry.value.is_none() {
  909 |                         Some(entry.key.clone())
  910 |                     } else {
  911 |                         None
  912 |                     }
  913 |                 })
  914 |                 .collect(),
  915 |             _ => Vec::<String>::new(),
  916 |         }
  917 |     }
  918 | 
  919 |     pub fn modifies_same_metadata(&self, other: &Self) -> bool {
  920 |         match (self, other) {
  921 |             (
  922 |                 Self::UpdateConfig {
  923 |                     table_metadata_updates,
  924 |                     schema_metadata_updates,
  925 |                     field_metadata_updates,
  926 |                     ..
  927 |                 },
  928 |                 Self::UpdateConfig {
  929 |                     table_metadata_updates: other_table_metadata,
  930 |                     schema_metadata_updates: other_schema_metadata,
  931 |                     field_metadata_updates: other_field_metadata,
  932 |                     ..
  933 |                 },
  934 |             ) => {
  935 |                 if Self::update_maps_conflict(
  936 |                     table_metadata_updates.as_ref(),
  937 |                     other_table_metadata.as_ref(),
  938 |                 ) {
  939 |                     return true;
  940 |                 }
  941 |                 if schema_metadata_updates.is_some() && other_schema_metadata.is_some() {
  942 |                     return true;
  943 |                 }
  944 |                 if !field_metadata_updates.is_empty() && !other_field_metadata.is_empty() {
  945 |                     for field in field_metadata_updates.keys() {
  946 |                         if other_field_metadata.contains_key(field) {
  947 |                             return true;
  948 |                         }
  949 |                     }
  950 |                 }
  951 |                 false
  952 |             }
  953 |             _ => false,
  954 |         }
  955 |     }
  956 | 
  957 |     fn update_maps_conflict(left: Option<&UpdateMap>, right: Option<&UpdateMap>) -> bool {
  958 |         let (Some(left), Some(right)) = (left, right) else {
  959 |             return false;
  960 |         };
  961 |         if left.replace || right.replace {
  962 |             return true;
  963 |         }
  964 |         let left_keys = left
  965 |             .update_entries
  966 |             .iter()
  967 |             .map(|entry| entry.key.as_str())
  968 |             .collect::<HashSet<_>>();
  969 |         right
  970 |             .update_entries
  971 |             .iter()
  972 |             .any(|entry| left_keys.contains(entry.key.as_str()))
  973 |     }
  974 | 
  975 |     /// Check whether another operation upserts a key that is referenced by another operation
  976 |     pub fn upsert_key_conflict(&self, other: &Self) -> bool {
  977 |         let self_upsert_keys = self.get_upsert_config_keys();
  978 |         let other_upsert_keys = other.get_upsert_config_keys();
  979 | 
  980 |         let self_delete_keys = self.get_delete_config_keys();
  981 |         let other_delete_keys = other.get_delete_config_keys();
  982 | 
  983 |         self_upsert_keys
  984 |             .iter()
  985 |             .any(|x| other_upsert_keys.contains(x) || other_delete_keys.contains(x))
  986 |             || other_upsert_keys
  987 |                 .iter()
  988 |                 .any(|x| self_upsert_keys.contains(x) || self_delete_keys.contains(x))
  989 |     }
  990 | }
  991 | 
  992 | #[cfg(test)]
  993 | mod tests {
  994 |     use super::*;
  995 |     use crate::transaction::test_support::overlay_with_field;
  996 |     use crate::transaction::{DataOverlayGroup, UpdateMapEntry};
  997 |     use std::collections::HashMap;
  998 | 
  999 |     fn table_metadata_update(entries: Vec<(&str, Option<&str>)>, replace: bool) -> Operation {
 1000 |         Operation::UpdateConfig {
 1001 |             config_updates: None,
 1002 |             table_metadata_updates: Some(UpdateMap {
 1003 |                 update_entries: entries.into_iter().map(UpdateMapEntry::from).collect(),
 1004 |                 replace,
 1005 |             }),
 1006 |             schema_metadata_updates: None,
 1007 |             field_metadata_updates: HashMap::new(),
 1008 |         }
 1009 |     }
 1010 | 
 1011 |     #[test]
 1012 |     fn test_table_metadata_conflicts_on_same_key() {
 1013 |         let left = table_metadata_update(vec![("key", Some("1"))], false);
 1014 |         let same_key = table_metadata_update(vec![("key", Some("2"))], false);
 1015 |         let different_key = table_metadata_update(vec![("other", Some("2"))], false);
 1016 |         let replace = table_metadata_update(vec![("other", Some("2"))], true);
 1017 | 
 1018 |         assert!(left.modifies_same_metadata(&same_key));
 1019 |         assert!(!left.modifies_same_metadata(&different_key));
 1020 |         assert!(left.modifies_same_metadata(&replace));
 1021 |     }
 1022 | 
 1023 |     #[test]
 1024 |     fn test_data_overlay_operation_eq() {
 1025 |         let overlay = |field: i32| Operation::DataOverlay {
 1026 |             groups: vec![DataOverlayGroup {
 1027 |                 fragment_id: 0,
 1028 |                 overlays: vec![overlay_with_field(field, 1)],
 1029 |             }],
 1030 |         };
 1031 |         // Reflexive and value-based (the arm previously returned false for self).
 1032 |         assert_eq!(overlay(1), overlay(1));
 1033 |         assert_ne!(overlay(1), overlay(2));
 1034 |         // Not equal to a different operation kind (previously returned true vs Rewrite).
 1035 |         let rewrite = Operation::Rewrite {
 1036 |             groups: vec![],
 1037 |             rewritten_indices: vec![],
 1038 |             frag_reuse_index: None,
 1039 |         };
 1040 |         assert_ne!(overlay(1), rewrite);
 1041 |     }
 1042 | }
``````
