> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/transaction/operation.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `c4ec0e97077287e72ff54237954fea9b614471ad3fadc345b56cb05fc69d2dad`. Reviewed physical lines: 1-420.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public transaction vocabulary and operation payload types; local naming, source-ID union, sizing and rewrite-group equality. Manifest application and pairwise conflict decisions live elsewhere. (rust/lance-table/src/transaction/operation.rs:1-420)

## Complete range analysis

### Lines 1-22

SPDX/docs and imports connect metadata/groups, key filter, MemWAL CompactedSsTable, UpdateMap, Schema, DeepSizeOf, roaring bitmap, HashMap and UUID. This file defines no asynchronous storage lifecycle, feature flag gate, transaction protobuf codec or commit implementation. (rust/lance-table/src/transaction/operation.rs:1-22)

### Lines 23-36

DataReplacementGroup(pub u64,pub DataFile) derives Debug/Clone/DeepSizeOf/PartialEq; tuple fields retain caller data unvalidated. DataOverlayGroup derives the same and publicly owns fragment_id:u64 and ordered overlays:Vec<DataOverlayFile>. Docs specify append to existing overlays and restamp committed_version on retry to preserve concurrent additions; construction alone neither appends nor stamps. (rust/lance-table/src/transaction/operation.rs:23-36)

### Lines 37-50

Operation is public exhaustive Debug/Clone/DeepSizeOf enum; PartialEq is implemented separately. Append{fragments:Vec<Fragment>} carries unassigned final fragment IDs by documented convention. Delete{updated_fragments:Vec<Fragment>,deleted_fragment_ids:Vec<u64>,predicate:String} describes changed deletion files and removed manifest IDs. No local predicate parsing, fragment disjointness or count checks. (rust/lance-table/src/transaction/operation.rs:37-50)

### Lines 51-68

Overwrite carries fragments,Schema,optional config_upsert_values HashMap<String,String>,optional initial_bases Vec<BasePath>. Docs include table creation, fresh IDs continuing highest-ever used, ignoring incoming IDs, and deletion-file rejection because deletion paths embed fragment IDs; recommends Delete/Merge for existing IDs. These are intended validator/builder rules, not enforced in this variant. (rust/lance-table/src/transaction/operation.rs:51-68)

### Lines 69-76

CreateIndex carries new_indices and removed_indices, both Vec<IndexMetadata>. Docs say same-name existing entries are replaced and describe removed entries as modified. No local name/UUID uniqueness or physical write/read. (rust/lance-table/src/transaction/operation.rs:69-76)

### Lines 77-112

Rewrite carries groups:Vec<RewriteGroup>,rewritten_indices:Vec<RewrittenIndex>,frag_reuse_index:Option<IndexMetadata>. Docs require unchanged row values with changed addresses/remapping. Optional entry is caller read-snapshot plus own additions. Tagged index_version1 protocol derives additions against transaction read_version, validates binding/conservation/deletion folding/ledger, merges onto current history and refuses removal/changed historical records or later-snapshot entries. Entry is documented in-memory only, absent from serialized transaction because conflicts need fragment groups and manifest persists history. Codec/enforcement remain pending, so these comments are not independently verified runtime guarantees. (rust/lance-table/src/transaction/operation.rs:77-112)

### Lines 113-136

DataReplacement{replacements:Vec<DataReplacementGroup>} docs require exact file schema and consistent data-file column layouts across affected fragments, rejecting partial-file splits such as A versus A,B. DataOverlay{groups:Vec<DataOverlayGroup>} describes cell-level physical-offset/field updates without base rewrite. No actual layout validation/overlay resolution in these declarations. (rust/lance-table/src/transaction/operation.rs:113-136)

### Lines 137-157

Merge{fragments:Vec<Fragment>,schema:Schema,preserves_nullability:bool} carries final row-aligned file lists and permits dropping columns. Bool asserts no nullability-affecting new omission requirement; docs otherwise require append conflicts in either order. Restore{version:u64} and ReserveFragments{num_fragments:u32} respectively name historical restore and pre-reserving IDs for remapping. They neither load a snapshot nor allocate IDs locally. (rust/lance-table/src/transaction/operation.rs:137-157)

### Lines 158-196

Update declares removed_fragment_ids,updated_fragments,new_fragments,fields_modified,compacted_sstables,fields_for_preserving_frag_bitmap,update_mode:Option<UpdateMode>,inserted_rows_filter:Option<KeyExistenceFilter>,updated_fragment_offsets:Option<UpdatedFragmentOffsets>. Exact field types are retained in appendix/symbols. Docs distinguish vertical deleted+new rows from horizontal file/field replacement, including tombstone-and-readd modification. Filter tracks INSERT keys only; optional physical offsets describe RewriteColumns matched rows and None skips partial version refresh per docs. No local cross-field/mode/null/key validation. (rust/lance-table/src/transaction/operation.rs:158-196)

### Lines 197-220

Project carries Schema plus preserves_nullability bool: rename/drop may assert preservation, tightening must not; docs say concurrent value writes can falsify scanned proof. UpdateConfig carries optional UpdateMap for config,table metadata,schema metadata and HashMap<i32,UpdateMap> field metadata. Docs require schema/field metadata conflict with Merge both orders to avoid replacing newer metadata with stale complete schema. Full conflict policy is not established by these declarations. (rust/lance-table/src/transaction/operation.rs:197-220)

### Lines 221-248

UpdateMemWalState{compacted_sstables:Vec<CompactedSsTable>} documents atomic compaction-progress recording. Clone carries is_shallow:bool,ref_name:Option<String>,ref_version:u64,ref_path:String,branch_name:Option<String>; docs restrict CommitBuilder to shallow and direct deep copies to Dataset::deep_clone. UpdateBases{new_bases:Vec<BasePath>} currently documents addition only. Enum itself accepts all these values without rejecting deep clone, duplicate bases or invalid references. There are16 variants total. (rust/lance-table/src/transaction/operation.rs:221-248)

### Lines 249-262

UpdateMode is public exhaustive Debug/Clone/PartialEq/DeepSizeOf with RewriteRows and RewriteColumns; no Default/Copy/Eq derive. Docs recommend row rewrite for many columns/few rows and column rewrite for few columns/many rows, with old columns tombstoned. Recommendations are unmeasured source guidance, not mode selection logic. (rust/lance-table/src/transaction/operation.rs:249-262)

### Lines 263-278

UpdatedFragmentOffsets is public tuple HashMap<u64,RoaringBitmap>, deriving Debug/Clone/PartialEq/Eq/Default. Intended stable-ID partial RewriteColumns version refresh, but arbitrary IDs/bitmaps permitted. Manual DeepSizeOf folds bitmap cardinality as usize saturating_mul(size_of u32) plus primitive fragment child size. It ignores hash table capacity, bitmap compressed allocation layout and bucket overhead; outer accumulator addition is ordinary unchecked arithmetic, so saturation is not end-to-end. Approximate count-based size, not measured heap bytes. (rust/lance-table/src/transaction/operation.rs:263-278)

### Lines 279-301

Display for Operation matches all16 variants and writes their exact Rust variant names without payloads. Formatter errors propagate via write!, no allocation explicitly requested. Matches Operation::name results defined later. (rust/lance-table/src/transaction/operation.rs:279-301)

### Lines 302-322

TaggedRewriteAssembly derives Debug/Clone and publicly owns entry:IndexMetadata,base_entry_version:Option<u64>,reordered_sources:RoaringBitmap. Docs separate caller intent in Operation from current-attempt merged entry in PreparedIndices; base version names the entry appended onto, None when created. Reordered source IDs are retained as index provenance per docs. Public fields allow bypassing new; no immutable proof token or full ledger validation inherent in type. (rust/lance-table/src/transaction/operation.rs:302-322)

### Lines 323-337

TaggedRewriteAssembly::new moves entry/base version and computes reordered_sources(transitions)?; it performs only source-ID range validation through that helper, without checking entry contents/base version, destinations, conservation, mapping or ledger digest. Error discards owned inputs with no external mutation. (rust/lance-table/src/transaction/operation.rs:323-337)

### Lines 338-362

Public reordered_sources flattens every Transition.sources ID, tries u32 conversion and collects Result<RoaringBitmap>. IDs outside u32 return InvalidInput including offending ID; duplicates deduplicate, empty input returns empty bitmap, order is irrelevant. No mapping-kind/destination/row-count filter, IO or ledger validation. Docs call ledger digest authoritative elsewhere; this guard avoids truncation aliases locally. (rust/lance-table/src/transaction/operation.rs:338-362)

### Lines 363-373

RewrittenIndex derives Debug/Clone/PartialEq, with public old_id/new_id UUIDs,new_index_details prost Any,new_index_version:u32,new_index_files:Option<Vec<IndexFile>>. Comment says empty list from older writers, while actual type also distinguishes None from Some(empty) for derived equality. No UUID inequality/details/version compatibility validation. (rust/lance-table/src/transaction/operation.rs:363-373)

### Lines 374-382

Manual DeepSizeOf for RewrittenIndex counts only Any.type_url and Any.value children through shared Context. It omits new_index_files heap children and any dependency overhead outside those two fields; trait root-size handling cannot account for omitted nested file-list allocations. No allocation measurement or tests here. (rust/lance-table/src/transaction/operation.rs:374-382)

### Lines 383-398

RewriteGroup derives Debug/Clone/DeepSizeOf, exposes old/new Vec<Fragment>. Handwritten PartialEq compares each vector with equal length and every left item contained anywhere in right, ignoring order and multiplicity. It is quadratic in vector lengths times Fragment equality cost. For distinct A,B, left[A,A] and right[A,B] passes left-to-right but reverse fails; this is a logical deduction, not a runtime reproduction or proof valid producers allow duplicates. No Eq derive and no uniqueness check. Nested private compare_vec is local to eq. (rust/lance-table/src/transaction/operation.rs:383-398)

### Lines 399-420

Operation::name(&self)->&str exhaustively returns fixed names for all16 variants. Return lifetime is signature-bound to self despite string literals being static; no payload rendering/validation/IO. No local test module in operation.rs; group equality, source bounds and variant semantics need consumer/other-module tests for complete qualification. (rust/lance-table/src/transaction/operation.rs:399-420)

## Interaction and interpretation limits

All420 lines read. Exact payload declarations are retained; comments about commit validation, serialization and conflicts are explicitly distinguished from local executable code. conflicts.rs1-102 and manifest_build.rs463-524 were contextual reads only. New-operation cookbook still needs full proto, validate, conflicts, index maintenance, manifest and commit IO analysis.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! The vocabulary of changes a transaction can describe.
    5 | //!
    6 | //! Each [`Operation`] variant names one kind of change and carries exactly the
    7 | //! inputs needed to apply it: the fragments to add, the fields that were
    8 | //! rewritten, the indices that were rebuilt. Applying them is
    9 | //! [`super::manifest_build`]; deciding whether two of them collide is
   10 | //! [`super::conflicts`].
   11 | 
   12 | use crate::format::key_existence::KeyExistenceFilter;
   13 | use crate::format::overlay::DataOverlayFile;
   14 | use crate::format::{BasePath, DataFile, Fragment, IndexFile, IndexMetadata};
   15 | use crate::system_index::mem_wal::CompactedSsTable;
   16 | use crate::transaction::UpdateMap;
   17 | use lance_core::datatypes::Schema;
   18 | use lance_core::deepsize::DeepSizeOf;
   19 | use roaring::RoaringBitmap;
   20 | use std::collections::HashMap;
   21 | use uuid::Uuid;
   22 | 
   23 | #[derive(Debug, Clone, DeepSizeOf, PartialEq)]
   24 | pub struct DataReplacementGroup(pub u64, pub DataFile);
   25 | 
   26 | /// Overlay files to append to a single fragment, in order (the last entry is
   27 | /// newest). The overlays are appended to the fragment's existing `overlays`
   28 | /// list rather than replacing it, so overlays written by concurrent commits are
   29 | /// preserved. Each overlay's `committed_version` is stamped to the new dataset
   30 | /// version at commit time (re-stamped on retry).
   31 | #[derive(Debug, Clone, DeepSizeOf, PartialEq)]
   32 | pub struct DataOverlayGroup {
   33 |     pub fragment_id: u64,
   34 |     pub overlays: Vec<DataOverlayFile>,
   35 | }
   36 | 
   37 | /// An operation on a dataset.
   38 | #[derive(Debug, Clone, DeepSizeOf)]
   39 | pub enum Operation {
   40 |     /// Adding new fragments to the dataset. The fragments contained within
   41 |     /// haven't yet been assigned a final ID.
   42 |     Append { fragments: Vec<Fragment> },
   43 |     /// Updated fragments contain those that have been modified with new deletion
   44 |     /// files. The deleted fragment IDs are those that should be removed from
   45 |     /// the manifest.
   46 |     Delete {
   47 |         updated_fragments: Vec<Fragment>,
   48 |         deleted_fragment_ids: Vec<u64>,
   49 |         predicate: String,
   50 |     },
   51 |     /// Overwrite the entire dataset with the given fragments. This is also
   52 |     /// used when initially creating a table.
   53 |     ///
   54 |     /// The fragments are newly written ones and are assigned fresh ids at commit
   55 |     /// time, continuing from the dataset's highest id ever used; the ids they
   56 |     /// arrive with are ignored.
   57 |     ///
   58 |     /// A fragment carrying a deletion file is rejected. A deletion file's path
   59 |     /// embeds the fragment id, so it cannot follow its fragment to the new id:
   60 |     /// minting a fragment and giving it a deletion file are mutually exclusive in
   61 |     /// one transaction. Use [`Self::Delete`] to commit deletions against existing
   62 |     /// fragments, or [`Self::Merge`] to change their schema.
   63 |     Overwrite {
   64 |         fragments: Vec<Fragment>,
   65 |         schema: Schema,
   66 |         config_upsert_values: Option<HashMap<String, String>>,
   67 |         initial_bases: Option<Vec<BasePath>>,
   68 |     },
   69 |     /// A new index has been created.
   70 |     CreateIndex {
   71 |         /// The new secondary indices,
   72 |         /// any existing indices with the same name will be replaced.
   73 |         new_indices: Vec<IndexMetadata>,
   74 |         /// The indices that have been modified.
   75 |         removed_indices: Vec<IndexMetadata>,
   76 |     },
   77 |     /// Data is rewritten but *not* modified. This is used for things like
   78 |     /// compaction or re-ordering. Contains the old fragments and the new
   79 |     /// ones that have been replaced.
   80 |     ///
   81 |     /// This operation will modify the row addresses of existing rows and
   82 |     /// so any existing index covering a rewritten fragment will need to be
   83 |     /// remapped.
   84 |     Rewrite {
   85 |         /// Groups of fragments that have been modified
   86 |         groups: Vec<RewriteGroup>,
   87 |         /// Indices that have been updated with the new row addresses
   88 |         rewritten_indices: Vec<RewrittenIndex>,
   89 |         /// The fragment reuse index entry to be created or updated to: the
   90 |         /// complete entry the caller wants installed, that is the entry at
   91 |         /// the transaction's read version plus this rewrite's own records.
   92 |         ///
   93 |         /// On a tagged history (`index_version` 1) the commit path does not
   94 |         /// splice this entry as it is. It works out which records the entry
   95 |         /// adds relative to the entry at the transaction's read version, so
   96 |         /// the entry must be built from that same snapshot (its
   97 |         /// `dataset_version` is the read version; an entry built from a
   98 |         /// later snapshot is refused, since it would fold other writers'
   99 |         /// records in between into this rewrite's additions). It then
  100 |         /// validates them against `groups` (binding, row conservation,
  101 |         /// deletion folding, the ledger), and merges them onto the entry
  102 |         /// current at commit, so a rewrite never overwrites history another
  103 |         /// writer recorded concurrently. A rewrite only appends: an entry
  104 |         /// that drops a recorded transition, or carries a recorded transition
  105 |         /// with different content, is refused; history is retired through
  106 |         /// the reuse index cleanup instead.
  107 |         ///
  108 |         /// In-memory only, never serialized into the transaction file: other
  109 |         /// writers' conflict decisions only need the fragment sets in
  110 |         /// `groups`, and the manifest is the durable record of the history.
  111 |         frag_reuse_index: Option<IndexMetadata>,
  112 |     },
  113 |     /// Replace data in a column in the dataset with new data. This is used for
  114 |     /// null column population where we replace an entirely null column with a
  115 |     /// new column that has data.
  116 |     ///
  117 |     /// This operation will only allow replacing files that contain the same schema
  118 |     /// e.g. if the original files contain columns A, B, C and the new files contain
  119 |     /// only columns A, B then the operation is not allowed. As we would need to split
  120 |     /// the original files into two files, one with column A, B and the other with column C.
  121 |     ///
  122 |     /// Corollary to the above: the operation will also not allow replacing files unless the
  123 |     /// affected columns all have the same datafile layout across the fragments being replaced.
  124 |     ///
  125 |     /// e.g. if fragments being replaced contain files with different schema layouts on
  126 |     /// the column being replaced, the operation is not allowed.
  127 |     /// say `frag_1: [A] [B, C]` and `frag_2: [A, B] [C]` and we are trying to replace column A
  128 |     /// with a new column A, the operation is not allowed.
  129 |     DataReplacement {
  130 |         replacements: Vec<DataReplacementGroup>,
  131 |     },
  132 |     /// Attach overlay files to fragments, supplying new values for a subset of
  133 |     /// `(physical offset, field)` cells without rewriting the fragments' base
  134 |     /// data files. See [`DataOverlayFile`] and the Data Overlay Files
  135 |     /// specification for resolution, coverage, and versioning rules.
  136 |     DataOverlay { groups: Vec<DataOverlayGroup> },
  137 |     /// Merge a new column in
  138 |     /// 'fragments' is the final fragments include all data files, the new fragments must align with old ones at rows.
  139 |     /// 'schema' is not forced to include existed columns, which means we could use Merge to drop column data
  140 |     Merge {
  141 |         fragments: Vec<Fragment>,
  142 |         schema: Schema,
  143 |         /// Set when this merge makes no nullability-affecting schema change:
  144 |         /// it introduces no field that data staged against an earlier schema
  145 |         /// could not safely omit. Without the assertion the merge conflicts
  146 |         /// with concurrent appends in either commit order, since a stale
  147 |         /// append omits new columns entirely and its rows read as null.
  148 |         preserves_nullability: bool,
  149 |     },
  150 |     /// Restore an old version of the database
  151 |     Restore { version: u64 },
  152 |     /// Reserves fragment ids for future use
  153 |     /// This can be used when row ids need to be known before a transaction
  154 |     /// has been committed.  It is used during a rewrite operation to allow
  155 |     /// indices to be remapped to the new row ids as part of the operation.
  156 |     ReserveFragments { num_fragments: u32 },
  157 | 
  158 |     /// Update values in the dataset.
  159 |     ///
  160 |     /// Updates are generally vertical or horizontal.
  161 |     ///
  162 |     /// A vertical update adds new rows.  In this case, the updated_fragments
  163 |     /// will only have existing rows deleted and will not have any new fields added.
  164 |     /// All new data will be contained in new_fragments.
  165 |     /// This is what is used by a merge_insert that matches the whole schema and what
  166 |     /// is used by the dataset updater.
  167 |     ///
  168 |     /// A horizontal update adds new columns.  In this case, the updated fragments
  169 |     /// may have fields removed or added.  It is even possible for a field to be tombstoned
  170 |     /// and then added back in the same update. (which is a field modification).  If any
  171 |     /// fields are modified in this way then they need to be added to the fields_modified list.
  172 |     /// This way we can correctly update the indices.
  173 |     /// This is what is used by a merge insert that does not match the whole schema.
  174 |     Update {
  175 |         /// Ids of fragments that have been moved
  176 |         removed_fragment_ids: Vec<u64>,
  177 |         /// Fragments that have been updated
  178 |         updated_fragments: Vec<Fragment>,
  179 |         /// Fragments that have been added
  180 |         new_fragments: Vec<Fragment>,
  181 |         /// The fields that have been modified
  182 |         fields_modified: Vec<u32>,
  183 |         /// MemWAL SSTables to mark as compacted after this transaction.
  184 |         compacted_sstables: Vec<CompactedSsTable>,
  185 |         /// The fields that used to judge whether to preserve the new frag's id into
  186 |         /// the frag bitmap of the specified indices.
  187 |         fields_for_preserving_frag_bitmap: Vec<u32>,
  188 |         /// The mode of update
  189 |         update_mode: Option<UpdateMode>,
  190 |         /// Optional filter for detecting conflicts on inserted row keys.
  191 |         /// Only tracks keys from INSERT operations during merge insert, not updates.
  192 |         inserted_rows_filter: Option<KeyExistenceFilter>,
  193 |         /// Physical row offsets (per fragment) that matched `update_columns` for RewriteColumns.
  194 |         /// `None` means callers did not supply offsets; `build_manifest` skips partial refresh then.
  195 |         updated_fragment_offsets: Option<UpdatedFragmentOffsets>,
  196 |     },
  197 | 
  198 |     /// Project to a new schema.
  199 |     Project {
  200 |         schema: Schema,
  201 |         /// Set when this projection makes no nullability-affecting schema
  202 |         /// change, as a rename or a drop does not. A nullability tightening
  203 |         /// must not set this: its producer proved the claim by scanning at its
  204 |         /// read version, so a concurrent write can falsify it and the
  205 |         /// projection conflicts with value-writes in either commit order.
  206 |         preserves_nullability: bool,
  207 |     },
  208 | 
  209 |     /// Update the dataset configuration and metadata.
  210 |     ///
  211 |     /// Schema or field metadata updates conflict with a concurrent
  212 |     /// [`Self::Merge`] in either commit order. A merge carries complete schema
  213 |     /// state from its read version, so rebasing the operations could discard
  214 |     /// metadata installed by the other transaction.
  215 |     UpdateConfig {
  216 |         config_updates: Option<UpdateMap>,
  217 |         table_metadata_updates: Option<UpdateMap>,
  218 |         schema_metadata_updates: Option<UpdateMap>,
  219 |         field_metadata_updates: HashMap<i32, UpdateMap>,
  220 |     },
  221 |     /// Update SSTable compaction progress in the MemWAL index.
  222 |     ///
  223 |     /// This is used during merge-insert to atomically record which
  224 |     /// SSTables have been compacted into the base table.
  225 |     UpdateMemWalState {
  226 |         compacted_sstables: Vec<CompactedSsTable>,
  227 |     },
  228 | 
  229 |     /// Clone a dataset.
  230 |     ///
  231 |     /// Only a shallow clone can be committed through `CommitBuilder`. A deep
  232 |     /// clone (`is_shallow = false`) must copy the source files first, so
  233 |     /// committing one returns an invalid input error; use
  234 |     /// `Dataset::deep_clone` instead.
  235 |     Clone {
  236 |         is_shallow: bool,
  237 |         ref_name: Option<String>,
  238 |         ref_version: u64,
  239 |         ref_path: String,
  240 |         branch_name: Option<String>,
  241 |     },
  242 | 
  243 |     // Update base paths in the dataset (currently only supports adding new bases).
  244 |     UpdateBases {
  245 |         /// The new base paths to add to the manifest.
  246 |         new_bases: Vec<BasePath>,
  247 |     },
  248 | }
  249 | 
  250 | #[derive(Debug, Clone, PartialEq, DeepSizeOf)]
  251 | pub enum UpdateMode {
  252 |     /// rows are deleted in current fragments and rewritten in new fragments.
  253 |     /// This is most optimal when the majority of columns are being rewritten
  254 |     /// or only a few rows are being updated.
  255 |     RewriteRows,
  256 | 
  257 |     /// within each fragment, columns are fully rewritten and inserted as new data files.
  258 |     /// Old versions of columns are tombstoned. This is most optimal when most rows are affected
  259 |     /// but a small subset of columns are affected.
  260 |     RewriteColumns,
  261 | }
  262 | 
  263 | /// Matched physical row offsets per fragment for a partial [`UpdateMode::RewriteColumns`] update.
  264 | ///
  265 | /// Used with stable row IDs so `build_manifest` can refresh row-level version
  266 | /// metadata only for rows that were rewritten.
  267 | #[derive(Debug, Clone, PartialEq, Eq, Default)]
  268 | pub struct UpdatedFragmentOffsets(pub HashMap<u64, RoaringBitmap>);
  269 | 
  270 | impl DeepSizeOf for UpdatedFragmentOffsets {
  271 |     fn deep_size_of_children(&self, context: &mut lance_core::deepsize::Context) -> usize {
  272 |         self.0.iter().fold(0_usize, |acc, (frag_id, bitmap)| {
  273 |             acc + frag_id.deep_size_of_children(context)
  274 |                 + (bitmap.len() as usize).saturating_mul(std::mem::size_of::<u32>())
  275 |         })
  276 |     }
  277 | }
  278 | 
  279 | impl std::fmt::Display for Operation {
  280 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
  281 |         match self {
  282 |             Self::Append { .. } => write!(f, "Append"),
  283 |             Self::Delete { .. } => write!(f, "Delete"),
  284 |             Self::Overwrite { .. } => write!(f, "Overwrite"),
  285 |             Self::CreateIndex { .. } => write!(f, "CreateIndex"),
  286 |             Self::Rewrite { .. } => write!(f, "Rewrite"),
  287 |             Self::Merge { .. } => write!(f, "Merge"),
  288 |             Self::Restore { .. } => write!(f, "Restore"),
  289 |             Self::ReserveFragments { .. } => write!(f, "ReserveFragments"),
  290 |             Self::Update { .. } => write!(f, "Update"),
  291 |             Self::Project { .. } => write!(f, "Project"),
  292 |             Self::UpdateConfig { .. } => write!(f, "UpdateConfig"),
  293 |             Self::DataReplacement { .. } => write!(f, "DataReplacement"),
  294 |             Self::DataOverlay { .. } => write!(f, "DataOverlay"),
  295 |             Self::Clone { .. } => write!(f, "Clone"),
  296 |             Self::UpdateMemWalState { .. } => write!(f, "UpdateMemWalState"),
  297 |             Self::UpdateBases { .. } => write!(f, "UpdateBases"),
  298 |         }
  299 |     }
  300 | }
  301 | 
  302 | /// What the commit path assembled for a rewrite on a tagged fragment reuse
  303 | /// history: the complete entry to install, merged against the manifest the
  304 | /// commit attempt builds on. Supplied through
  305 | /// [`FragReuseUpdate::Rewrite`](crate::transaction::FragReuseUpdate) on the
  306 | /// prepared index list once per attempt, while the operation's
  307 | /// `frag_reuse_index` stays what the caller supplied, so every retry works
  308 | /// from the same intent.
  309 | #[derive(Debug, Clone)]
  310 | pub struct TaggedRewriteAssembly {
  311 |     /// The entry to install, assembled against the manifest being built.
  312 |     pub entry: IndexMetadata,
  313 |     /// `dataset_version` of the entry the assembly appended onto (`None`
  314 |     /// when this rewrite creates the entry). The manifest build refuses the
  315 |     /// splice when the manifest's entry is a different one.
  316 |     pub base_entry_version: Option<u64>,
  317 |     /// The source fragments of the transitions this rewrite appended. Their
  318 |     /// rewrite groups redistribute rows, so index bitmaps keep the retired
  319 |     /// source ids as provenance instead of following the rewrite.
  320 |     pub reordered_sources: RoaringBitmap,
  321 | }
  322 | 
  323 | impl TaggedRewriteAssembly {
  324 |     /// Bundle an assembled entry with the transitions it appended.
  325 |     pub fn new(
  326 |         entry: IndexMetadata,
  327 |         base_entry_version: Option<u64>,
  328 |         transitions: &[crate::format::pb::fragment_reuse_index_details::Transition],
  329 |     ) -> lance_core::Result<Self> {
  330 |         Ok(Self {
  331 |             entry,
  332 |             base_entry_version,
  333 |             reordered_sources: reordered_sources(transitions)?,
  334 |         })
  335 |     }
  336 | }
  337 | 
  338 | /// The union of `transitions`' source fragment ids. Rewrite groups covered
  339 | /// by this set skip index-bitmap maintenance: their bitmaps keep the retired
  340 | /// source ids as provenance.
  341 | ///
  342 | /// Fragment ids in the reuse domain are bounded by the row-address fragment
  343 | /// space (u32); the ledger's digest validation is the authoritative
  344 | /// enforcement, but it only runs during entry assembly, so an out-of-range
  345 | /// id is rejected here too rather than silently truncated into an alias of
  346 | /// another fragment.
  347 | pub fn reordered_sources(
  348 |     transitions: &[crate::format::pb::fragment_reuse_index_details::Transition],
  349 | ) -> lance_core::Result<RoaringBitmap> {
  350 |     transitions
  351 |         .iter()
  352 |         .flat_map(|transition| transition.sources.iter().map(|source| source.id))
  353 |         .map(|id| {
  354 |             u32::try_from(id).map_err(|_| {
  355 |                 lance_core::Error::invalid_input(format!(
  356 |                     "transition source fragment id {id} is outside the row-address range"
  357 |                 ))
  358 |             })
  359 |         })
  360 |         .collect()
  361 | }
  362 | 
  363 | #[derive(Debug, Clone, PartialEq)]
  364 | pub struct RewrittenIndex {
  365 |     pub old_id: Uuid,
  366 |     pub new_id: Uuid,
  367 |     pub new_index_details: prost_types::Any,
  368 |     pub new_index_version: u32,
  369 |     /// Files in the new index with their sizes.
  370 |     /// Empty list from older writers that didn't persist this field.
  371 |     pub new_index_files: Option<Vec<IndexFile>>,
  372 | }
  373 | 
  374 | impl DeepSizeOf for RewrittenIndex {
  375 |     fn deep_size_of_children(&self, context: &mut lance_core::deepsize::Context) -> usize {
  376 |         self.new_index_details
  377 |             .type_url
  378 |             .deep_size_of_children(context)
  379 |             + self.new_index_details.value.deep_size_of_children(context)
  380 |     }
  381 | }
  382 | 
  383 | #[derive(Debug, Clone, DeepSizeOf)]
  384 | pub struct RewriteGroup {
  385 |     pub old_fragments: Vec<Fragment>,
  386 |     pub new_fragments: Vec<Fragment>,
  387 | }
  388 | 
  389 | impl PartialEq for RewriteGroup {
  390 |     fn eq(&self, other: &Self) -> bool {
  391 |         fn compare_vec<T: PartialEq>(a: &[T], b: &[T]) -> bool {
  392 |             a.len() == b.len() && a.iter().all(|f| b.contains(f))
  393 |         }
  394 |         compare_vec(&self.old_fragments, &other.old_fragments)
  395 |             && compare_vec(&self.new_fragments, &other.new_fragments)
  396 |     }
  397 | }
  398 | 
  399 | impl Operation {
  400 |     pub fn name(&self) -> &str {
  401 |         match self {
  402 |             Self::Append { .. } => "Append",
  403 |             Self::Delete { .. } => "Delete",
  404 |             Self::Overwrite { .. } => "Overwrite",
  405 |             Self::CreateIndex { .. } => "CreateIndex",
  406 |             Self::Rewrite { .. } => "Rewrite",
  407 |             Self::Merge { .. } => "Merge",
  408 |             Self::ReserveFragments { .. } => "ReserveFragments",
  409 |             Self::Restore { .. } => "Restore",
  410 |             Self::Update { .. } => "Update",
  411 |             Self::Project { .. } => "Project",
  412 |             Self::UpdateConfig { .. } => "UpdateConfig",
  413 |             Self::DataReplacement { .. } => "DataReplacement",
  414 |             Self::DataOverlay { .. } => "DataOverlay",
  415 |             Self::UpdateMemWalState { .. } => "UpdateMemWalState",
  416 |             Self::Clone { .. } => "Clone",
  417 |             Self::UpdateBases { .. } => "UpdateBases",
  418 |         }
  419 |     }
  420 | }
``````
