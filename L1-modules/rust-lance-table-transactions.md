> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

> Refresh 2026-10-12, `011953c22097b67b699595adbe99e7f0155d83e4`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-12.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

# Transaction definitions and attempt containers

**INCOMPLETE commit coverage.** The facade, builder, operation vocabulary, map edits, preparation containers and shared test fixtures are fully read. Local validation, equality/metadata predicates and protobuf conversion are covered below. Local index maintenance and tagged-lineage view are now covered below. Ledger decoding and fragment-reuse compatibility adapters are now covered below. The manifest candidate builder is now covered in its linked supplement. Full dataset conflict resolver, transition assembly and commit IO remain pending.

[Table module](rust-lance-table.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Scenarios](../L4-crosscutting/scenarios.md) · [Symbols](../L3-symbols/symbol-index.md)

Public types/functions are reexported through lance_table::transaction; implementation child modules are private and test_support is crate-visible only in tests. Transaction's public fields permit arbitrary state construction. Builder setters consume self; build preserves supplied UUID verbatim or lazily generates a hyphenated v4 UUID, moves tag/properties and performs no operation validation. read_version0 for initial creation is documentation, not a constructor check. (rust/lance-table/src/transaction.rs:30-59; rust/lance-table/src/transaction/builder.rs:12-90)

The16 Operation variants carry intent, not execution. Their declaration comments describe overwrite-ID/deletion restrictions, rewrite history rebasing, schema nullability assertions, inserted-key filters and shallow-only commit behavior. Enforcement must be traced through pending modules. Operation::name and Display return the same exact variant names; Operation equality is a separate handwritten implementation. (rust/lance-table/src/transaction/operation.rs:37-262; rust/lance-table/src/transaction/operation.rs:293-315; rust/lance-table/src/transaction/operation.rs:414-436; rust/lance-table/src/transaction/conflicts.rs:18-29)

PreparedIndices privately owns optional manifest version, original and prepared index lists, and FragReuseUpdate. Its crate constructor stores unchecked inputs; getters borrow and into_parts consumes, omitting version. FragReuseUpdate is non_exhaustive, default None, Rewrite(Arc<TaggedRewriteAssembly>) or Trim. Contextual prepare_indices invokes a gate, clones current indices and optionally withdraws in-place rewrite coverage; contextual build_manifest_prepared rejects a different optional numeric version, repeats the gate, then consumes parts. Full local lineage/gate behavior is covered below; the complete candidate builder is linked at the end. (rust/lance-table/src/transaction/prepare.rs:24-100; rust/lance-table/src/transaction/manifest_build.rs:487-535; rust/lance-table/src/transaction/manifest_build.rs:606-624)

CoverageIdentity compares UUID and optional bitmap, deliberately excluding other metadata that migrations may fill. LogicalIndexSegments is a BTreeMap of logical names to vectors; sorting/filtering are producer obligations. ReadVersionState borrows manifest and indices but does not check that they come from the same version. TaggedRewriteAssembly public fields are not a proof token; its constructor only unions transition source IDs with checked u32 conversion. Empty transitions yield empty bitmap; duplicates deduplicate, out-of-range IDs return InvalidInput. Destination/mapping/conservation/entry consistency checks are elsewhere. (rust/lance-table/src/transaction.rs:66-106; rust/lance-table/src/transaction/operation.rs:317-376)

UpdateMap replacement clears first and inserts only Some entries, ignoring None even after an earlier insertion of the same key. Incremental mode applies every entry in order, including removal. Config translation emits all upserts before deletes with replace=false; schema translation emits all-Some entries with replace=true. HashMap iteration order is unspecified, and derived entry-vector equality observes order even for equivalent effects. (rust/lance-table/src/transaction/update_map.rs:13-128)

RewriteGroup equality ignores order using equal length plus left-membership in right. Duplicate multiplicities can make equality asymmetric: [A,A] versus [A,B] passes only in the former direction for distinct A,B. This is source arithmetic, not a reproduced valid-transaction failure. UpdatedFragmentOffsets DeepSizeOf approximates bitmap cardinality and omits map/container costs; RewrittenIndex sizing omits new_index_files children. No file in this six-file slice contains a test function; shared fixtures support tests in other modules. (rust/lance-table/src/transaction/operation.rs:284-291; rust/lance-table/src/transaction/operation.rs:389-412; rust/lance-table/src/transaction/test_support.rs:1-199)

## Exact public type declarations

The following excerpts preserve source declarations. The Operation excerpt includes every variant payload; callable signatures follow below. Implementation details and all physical source lines remain in the linked L2 documents.

### rust/lance-table/src/transaction.rs:72-72

```rust
pub type LogicalIndexSegments = BTreeMap<String, Vec<CoverageIdentity>>;
```

[rust/lance-table/src/transaction.rs:72-72](../L2-files/rust/lance-table/src/transaction.rs.md)

### rust/lance-table/src/transaction.rs:84-88

```rust
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CoverageIdentity {
    uuid: Uuid,
    fragment_bitmap: Option<RoaringBitmap>,
}
```

[rust/lance-table/src/transaction.rs:84-88](../L2-files/rust/lance-table/src/transaction.rs.md)

### rust/lance-table/src/transaction.rs:102-106

```rust
#[derive(Debug, Clone, Copy)]
pub struct ReadVersionState<'a> {
    pub manifest: &'a Manifest,
    pub indices: &'a [IndexMetadata],
}
```

[rust/lance-table/src/transaction.rs:102-106](../L2-files/rust/lance-table/src/transaction.rs.md)

### rust/lance-table/src/transaction/builder.rs:16-25

```rust
#[derive(Debug, Clone, DeepSizeOf, PartialEq)]
pub struct Transaction {
    /// The version of the table this transaction is based off of. If this is
    /// the first transaction, this should be 0.
    pub read_version: u64,
    pub uuid: String,
    pub operation: Operation,
    pub tag: Option<String>,
    pub transaction_properties: Option<Arc<HashMap<String, String>>>,
}
```

[rust/lance-table/src/transaction/builder.rs:16-25](../L2-files/rust/lance-table/src/transaction/builder.rs.md)

### rust/lance-table/src/transaction/builder.rs:28-35

```rust
pub struct TransactionBuilder {
    read_version: u64,
    // uuid is optional for builder since it can autogenerate
    uuid: Option<String>,
    operation: Operation,
    tag: Option<String>,
    transaction_properties: Option<Arc<HashMap<String, String>>>,
}
```

[rust/lance-table/src/transaction/builder.rs:28-35](../L2-files/rust/lance-table/src/transaction/builder.rs.md)

### rust/lance-table/src/transaction/prepare.rs:26-42

```rust
#[derive(Debug, Clone, Default)]
#[non_exhaustive]
pub enum FragReuseUpdate {
    /// Nothing was prepared for the entry. A tagged entry arriving on a
    /// `Rewrite`, or a `CreateIndex` touching a tagged entry, is refused:
    /// without the commit path's derivation such a shape is a pre-assembled
    /// snapshot that may splice away records a concurrent writer appended.
    #[default]
    None,
    /// A `Rewrite` on a tagged history: the entry the commit path assembled
    /// for THIS manifest, merging the records the operation's entry adds
    /// onto the current entry and validating them.
    Rewrite(Arc<TaggedRewriteAssembly>),
    /// A trim of the tagged entry derived by the reuse index cleanup against
    /// the current entry at commit time.
    Trim,
}
```

[rust/lance-table/src/transaction/prepare.rs:26-42](../L2-files/rust/lance-table/src/transaction/prepare.rs.md)

### rust/lance-table/src/transaction/prepare.rs:52-58

```rust
#[derive(Debug, Clone)]
pub struct PreparedIndices {
    manifest_version: Option<u64>,
    original: Vec<IndexMetadata>,
    prepared: Vec<IndexMetadata>,
    frag_reuse: FragReuseUpdate,
}
```

[rust/lance-table/src/transaction/prepare.rs:52-58](../L2-files/rust/lance-table/src/transaction/prepare.rs.md)

### rust/lance-table/src/transaction/operation.rs:23-35

```rust
#[derive(Debug, Clone, DeepSizeOf, PartialEq)]
pub struct DataReplacementGroup(pub u64, pub DataFile);

/// Overlay files to append to a single fragment, in order (the last entry is
/// newest). The overlays are appended to the fragment's existing `overlays`
/// list rather than replacing it, so overlays written by concurrent commits are
/// preserved. Each overlay's `committed_version` is stamped to the new dataset
/// version at commit time (re-stamped on retry).
#[derive(Debug, Clone, DeepSizeOf, PartialEq)]
pub struct DataOverlayGroup {
    pub fragment_id: u64,
    pub overlays: Vec<DataOverlayFile>,
}
```

[rust/lance-table/src/transaction/operation.rs:23-35](../L2-files/rust/lance-table/src/transaction/operation.rs.md)

### rust/lance-table/src/transaction/operation.rs:38-262

```rust
#[derive(Debug, Clone, DeepSizeOf)]
pub enum Operation {
    /// Adding new fragments to the dataset. The fragments contained within
    /// haven't yet been assigned a final ID.
    Append { fragments: Vec<Fragment> },
    /// Updated fragments contain those that have been modified with new deletion
    /// files. The deleted fragment IDs are those that should be removed from
    /// the manifest.
    Delete {
        updated_fragments: Vec<Fragment>,
        deleted_fragment_ids: Vec<u64>,
        predicate: String,
    },
    /// Overwrite the entire dataset with the given fragments. This is also
    /// used when initially creating a table.
    ///
    /// The fragments are newly written ones and are assigned fresh ids at commit
    /// time, continuing from the dataset's highest id ever used; the ids they
    /// arrive with are ignored.
    ///
    /// A fragment carrying a deletion file is rejected. A deletion file's path
    /// embeds the fragment id, so it cannot follow its fragment to the new id:
    /// minting a fragment and giving it a deletion file are mutually exclusive in
    /// one transaction. Use [`Self::Delete`] to commit deletions against existing
    /// fragments, or [`Self::Merge`] to change their schema.
    Overwrite {
        fragments: Vec<Fragment>,
        schema: Schema,
        config_upsert_values: Option<HashMap<String, String>>,
        initial_bases: Option<Vec<BasePath>>,
    },
    /// A new index has been created.
    CreateIndex {
        /// The new secondary indices,
        /// any existing indices with the same name will be replaced.
        new_indices: Vec<IndexMetadata>,
        /// The indices that have been modified.
        removed_indices: Vec<IndexMetadata>,
    },
    /// Data is rewritten but *not* modified. This is used for things like
    /// compaction or re-ordering. Contains the old fragments and the new
    /// ones that have been replaced.
    ///
    /// This operation will modify the row addresses of existing rows and
    /// so any existing index covering a rewritten fragment will need to be
    /// remapped.
    Rewrite {
        /// Groups of fragments that have been modified
        groups: Vec<RewriteGroup>,
        /// Indices that have been updated with the new row addresses
        rewritten_indices: Vec<RewrittenIndex>,
        /// The fragment reuse index entry to be created or updated to: the
        /// complete entry the caller wants installed, that is the entry at
        /// the transaction's read version plus this rewrite's own records.
        ///
        /// On a tagged history (`index_version` 1) the commit path does not
        /// splice this entry as it is. It works out which records the entry
        /// adds relative to the entry at the transaction's read version, so
        /// the entry must be built from that same snapshot (its
        /// `dataset_version` is the read version; an entry built from a
        /// later snapshot is refused, since it would fold other writers'
        /// records in between into this rewrite's additions). It then
        /// validates them against `groups` (binding, row conservation,
        /// deletion folding, the ledger), and merges them onto the entry
        /// current at commit, so a rewrite never overwrites history another
        /// writer recorded concurrently. A rewrite only appends: an entry
        /// that drops a recorded transition, or carries a recorded transition
        /// with different content, is refused; history is retired through
        /// the reuse index cleanup instead.
        ///
        /// In-memory only, never serialized into the transaction file: other
        /// writers' conflict decisions only need the fragment sets in
        /// `groups`, and the manifest is the durable record of the history.
        frag_reuse_index: Option<IndexMetadata>,
    },
    /// Replace data in a column in the dataset with new data. This is used for
    /// null column population where we replace an entirely null column with a
    /// new column that has data.
    ///
    /// This operation will only allow replacing files that contain the same schema
    /// e.g. if the original files contain columns A, B, C and the new files contain
    /// only columns A, B then the operation is not allowed. As we would need to split
    /// the original files into two files, one with column A, B and the other with column C.
    ///
    /// Corollary to the above: the operation will also not allow replacing files unless the
    /// affected columns all have the same datafile layout across the fragments being replaced.
    ///
    /// e.g. if fragments being replaced contain files with different schema layouts on
    /// the column being replaced, the operation is not allowed.
    /// say `frag_1: [A] [B, C]` and `frag_2: [A, B] [C]` and we are trying to replace column A
    /// with a new column A, the operation is not allowed.
    DataReplacement {
        replacements: Vec<DataReplacementGroup>,
    },
    /// Attach overlay files to fragments, supplying new values for a subset of
    /// `(physical offset, field)` cells without rewriting the fragments' base
    /// data files. See [`DataOverlayFile`] and the Data Overlay Files
    /// specification for resolution, coverage, and versioning rules.
    DataOverlay { groups: Vec<DataOverlayGroup> },
    /// Merge a new column in
    /// 'fragments' is the final fragments include all data files, the new fragments must align with old ones at rows.
    /// 'schema' is not forced to include existed columns, which means we could use Merge to drop column data
    Merge {
        fragments: Vec<Fragment>,
        schema: Schema,
        /// Set when this merge makes no nullability-affecting schema change:
        /// it introduces no field that data staged against an earlier schema
        /// could not safely omit. Without the assertion the merge conflicts
        /// with concurrent appends in either commit order, since a stale
        /// append omits new columns entirely and its rows read as null.
        preserves_nullability: bool,
    },
    /// Restore an old version of the database
    Restore { version: u64 },
    /// Reserves fragment ids for future use
    /// This can be used when row ids need to be known before a transaction
    /// has been committed.  It is used during a rewrite operation to allow
    /// indices to be remapped to the new row ids as part of the operation.
    ReserveFragments { num_fragments: u32 },

    /// Update values in the dataset.
    ///
    /// Updates are generally vertical or horizontal.
    ///
    /// A vertical update adds new rows.  In this case, the updated_fragments
    /// will only have existing rows deleted and will not have any new fields added.
    /// All new data will be contained in new_fragments.
    /// This is what is used by a merge_insert that matches the whole schema and what
    /// is used by the dataset updater.
    ///
    /// A horizontal update adds new columns.  In this case, the updated fragments
    /// may have fields removed or added.  It is even possible for a field to be tombstoned
    /// and then added back in the same update. (which is a field modification).  If any
    /// fields are modified in this way then they need to be added to the fields_modified list.
    /// This way we can correctly update the indices.
    /// This is what is used by a merge insert that does not match the whole schema.
    Update {
        /// Ids of fragments that have been moved
        removed_fragment_ids: Vec<u64>,
        /// Fragments that have been updated
        updated_fragments: Vec<Fragment>,
        /// Fragments that have been added
        new_fragments: Vec<Fragment>,
        /// The fields that have been modified
        fields_modified: Vec<u32>,
        /// MemWAL SSTables to mark as compacted after this transaction.
        compacted_sstables: Vec<CompactedSsTable>,
        /// The fields that used to judge whether to preserve the new frag's id into
        /// the frag bitmap of the specified indices.
        fields_for_preserving_frag_bitmap: Vec<u32>,
        /// The mode of update
        update_mode: Option<UpdateMode>,
        /// Optional filter for detecting conflicts on inserted row keys.
        /// Only tracks keys from INSERT operations during merge insert, not updates.
        inserted_rows_filter: Option<KeyExistenceFilter>,
        /// Physical row offsets (per fragment) that matched `update_columns` for RewriteColumns.
        /// `None` means callers did not supply offsets; `build_manifest` skips partial refresh then.
        updated_fragment_offsets: Option<UpdatedFragmentOffsets>,
    },

    /// Project to a new schema.
    Project {
        schema: Schema,
        /// Set when this projection makes no nullability-affecting schema
        /// change, as a rename or a drop does not. A nullability tightening
        /// must not set this: its producer proved the claim by scanning at its
        /// read version, so a concurrent write can falsify it and the
        /// projection conflicts with value-writes in either commit order.
        preserves_nullability: bool,
    },

    /// Update the dataset configuration and metadata.
    ///
    /// Schema or field metadata updates conflict with a concurrent
    /// [`Self::Merge`] in either commit order. A merge carries complete schema
    /// state from its read version, so rebasing the operations could discard
    /// metadata installed by the other transaction.
    UpdateConfig {
        config_updates: Option<UpdateMap>,
        table_metadata_updates: Option<UpdateMap>,
        schema_metadata_updates: Option<UpdateMap>,
        field_metadata_updates: HashMap<i32, UpdateMap>,
    },
    /// Update SSTable compaction progress in the MemWAL index.
    ///
    /// This is used during merge-insert to atomically record which
    /// SSTables have been compacted into the base table.
    UpdateMemWalState {
        compacted_sstables: Vec<CompactedSsTable>,
    },

    /// Clone a dataset.
    ///
    /// Only a shallow clone can be committed through `CommitBuilder`. A deep
    /// clone (`is_shallow = false`) must copy the source files first, so
    /// committing one returns an invalid input error; use
    /// `Dataset::deep_clone` instead.
    Clone {
        is_shallow: bool,
        ref_name: Option<String>,
        ref_version: u64,
        ref_path: String,
        branch_name: Option<String>,
    },

    // Update base paths in the dataset (currently only supports adding new bases).
    UpdateBases {
        /// The new base paths to add to the manifest.
        new_bases: Vec<BasePath>,
    },
}
```

[rust/lance-table/src/transaction/operation.rs:38-262](../L2-files/rust/lance-table/src/transaction/operation.rs.md)

### rust/lance-table/src/transaction/operation.rs:264-275

```rust
#[derive(Debug, Clone, PartialEq, DeepSizeOf)]
pub enum UpdateMode {
    /// rows are deleted in current fragments and rewritten in new fragments.
    /// This is most optimal when the majority of columns are being rewritten
    /// or only a few rows are being updated.
    RewriteRows,

    /// within each fragment, columns are fully rewritten and inserted as new data files.
    /// Old versions of columns are tombstoned. This is most optimal when most rows are affected
    /// but a small subset of columns are affected.
    RewriteColumns,
}
```

[rust/lance-table/src/transaction/operation.rs:264-275](../L2-files/rust/lance-table/src/transaction/operation.rs.md)

### rust/lance-table/src/transaction/operation.rs:281-282

```rust
#[derive(Debug, Clone, PartialEq, Eq, Default)]
pub struct UpdatedFragmentOffsets(pub HashMap<u64, RoaringBitmap>);
```

[rust/lance-table/src/transaction/operation.rs:281-282](../L2-files/rust/lance-table/src/transaction/operation.rs.md)

### rust/lance-table/src/transaction/operation.rs:324-336

```rust
#[derive(Debug, Clone)]
pub struct TaggedRewriteAssembly {
    /// The entry to install, assembled against the manifest being built.
    pub entry: IndexMetadata,
    /// `dataset_version` of the entry the assembly appended onto (`None`
    /// when this rewrite creates the entry). The manifest build refuses the
    /// splice when the manifest's entry is a different one.
    pub base_entry_version: Option<u64>,
    /// The source fragments of the transitions this rewrite appended. Their
    /// rewrite groups redistribute rows, so index bitmaps keep the retired
    /// source ids as provenance instead of following the rewrite.
    pub reordered_sources: RoaringBitmap,
}
```

[rust/lance-table/src/transaction/operation.rs:324-336](../L2-files/rust/lance-table/src/transaction/operation.rs.md)

### rust/lance-table/src/transaction/operation.rs:378-387

```rust
#[derive(Debug, Clone, PartialEq)]
pub struct RewrittenIndex {
    pub old_id: Uuid,
    pub new_id: Uuid,
    pub new_index_details: prost_types::Any,
    pub new_index_version: u32,
    /// Files in the new index with their sizes.
    /// Empty list from older writers that didn't persist this field.
    pub new_index_files: Option<Vec<IndexFile>>,
}
```

[rust/lance-table/src/transaction/operation.rs:378-387](../L2-files/rust/lance-table/src/transaction/operation.rs.md)

### rust/lance-table/src/transaction/operation.rs:398-402

```rust
#[derive(Debug, Clone, DeepSizeOf)]
pub struct RewriteGroup {
    pub old_fragments: Vec<Fragment>,
    pub new_fragments: Vec<Fragment>,
}
```

[rust/lance-table/src/transaction/operation.rs:398-402](../L2-files/rust/lance-table/src/transaction/operation.rs.md)

### rust/lance-table/src/transaction/update_map.rs:14-20

```rust
#[derive(Debug, Clone, DeepSizeOf, PartialEq)]
pub struct UpdateMapEntry {
    /// The key of the map entry to update.
    pub key: String,
    /// The value to set for the key.
    pub value: Option<String>,
}
```

[rust/lance-table/src/transaction/update_map.rs:14-20](../L2-files/rust/lance-table/src/transaction/update_map.rs.md)

### rust/lance-table/src/transaction/update_map.rs:50-56

```rust
#[derive(Debug, Clone, DeepSizeOf, PartialEq)]
pub struct UpdateMap {
    pub update_entries: Vec<UpdateMapEntry>,
    /// If true, the map will be replaced entirely with the new entries.
    /// If false, the new entries will be merged with the existing map.
    pub replace: bool,
}
```

[rust/lance-table/src/transaction/update_map.rs:50-56](../L2-files/rust/lance-table/src/transaction/update_map.rs.md)

## Exact reviewed callable declarations

| Symbol | Signature | Visibility | Evidence |
|---|---|---|---|
| `lance_table::transaction::<Operation as Display>::fmt` | `fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {` | trait method | [rust/lance-table/src/transaction/operation.rs:294-294](../L2-files/rust/lance-table/src/transaction/operation.rs.md) |
| `lance_table::transaction::<RewriteGroup as PartialEq>::eq` | `fn eq(&self, other: &Self) -> bool {` | trait method | [rust/lance-table/src/transaction/operation.rs:405-405](../L2-files/rust/lance-table/src/transaction/operation.rs.md) |
| `lance_table::transaction::<RewriteGroup as PartialEq>::eq::compare_vec` | `fn compare_vec<T: PartialEq>(a: &[T], b: &[T]) -> bool {` | private local function | [rust/lance-table/src/transaction/operation.rs:406-406](../L2-files/rust/lance-table/src/transaction/operation.rs.md) |
| `lance_table::transaction::<RewrittenIndex as DeepSizeOf>::deep_size_of_children` | `fn deep_size_of_children(&self, context: &mut lance_core::deepsize::Context) -> usize {` | trait method | [rust/lance-table/src/transaction/operation.rs:390-390](../L2-files/rust/lance-table/src/transaction/operation.rs.md) |
| `lance_table::transaction::<UpdatedFragmentOffsets as DeepSizeOf>::deep_size_of_children` | `fn deep_size_of_children(&self, context: &mut lance_core::deepsize::Context) -> usize {` | trait method | [rust/lance-table/src/transaction/operation.rs:285-285](../L2-files/rust/lance-table/src/transaction/operation.rs.md) |
| `lance_table::transaction::<UpdateMapEntry as From<(&str, &str)>>::from` | `fn from((key, value): (&str, &str)) -> Self {` | trait method | [rust/lance-table/src/transaction/update_map.rs:44-44](../L2-files/rust/lance-table/src/transaction/update_map.rs.md) |
| `lance_table::transaction::<UpdateMapEntry as From<(&str, Option<&str>)>>::from` | `fn from((key, value): (&str, Option<&str>)) -> Self {` | trait method | [rust/lance-table/src/transaction/update_map.rs:35-35](../L2-files/rust/lance-table/src/transaction/update_map.rs.md) |
| `lance_table::transaction::<UpdateMapEntry as From<(String, Option<String>)>>::from` | `fn from((key, value): (String, Option<String>)) -> Self {` | trait method | [rust/lance-table/src/transaction/update_map.rs:23-23](../L2-files/rust/lance-table/src/transaction/update_map.rs.md) |
| `lance_table::transaction::<UpdateMapEntry as From<(String, String)>>::from` | `fn from((key, value): (String, String)) -> Self {` | trait method | [rust/lance-table/src/transaction/update_map.rs:29-29](../L2-files/rust/lance-table/src/transaction/update_map.rs.md) |
| `lance_table::transaction::apply_update_map` | `pub(super) fn apply_update_map(     target: &mut std::collections::HashMap<String, String>,     update_map: &UpdateMap, ) {` | pub(super), transaction-internal | [rust/lance-table/src/transaction/update_map.rs:59-62](../L2-files/rust/lance-table/src/transaction/update_map.rs.md) |
| `lance_table::transaction::Operation::name` | `pub fn name(&self) -> &str {` | public | [rust/lance-table/src/transaction/operation.rs:415-415](../L2-files/rust/lance-table/src/transaction/operation.rs.md) |
| `lance_table::transaction::PreparedIndices::frag_reuse_update` | `pub fn frag_reuse_update(&self) -> &FragReuseUpdate {` | public | [rust/lance-table/src/transaction/prepare.rs:93-93](../L2-files/rust/lance-table/src/transaction/prepare.rs.md) |
| `lance_table::transaction::PreparedIndices::into_parts` | `pub(crate) fn into_parts(self) -> (Vec<IndexMetadata>, Vec<IndexMetadata>, FragReuseUpdate) {` | pub(crate) | [rust/lance-table/src/transaction/prepare.rs:97-97](../L2-files/rust/lance-table/src/transaction/prepare.rs.md) |
| `lance_table::transaction::PreparedIndices::manifest_version` | `pub fn manifest_version(&self) -> Option<u64> {` | public | [rust/lance-table/src/transaction/prepare.rs:77-77](../L2-files/rust/lance-table/src/transaction/prepare.rs.md) |
| `lance_table::transaction::PreparedIndices::new` | `pub(crate) fn new(         manifest_version: Option<u64>,         original: Vec<IndexMetadata>,         prepared: Vec<IndexMetadata>,         frag_reuse: FragReuseUpdate,     ) -> Self {` | pub(crate) | [rust/lance-table/src/transaction/prepare.rs:61-66](../L2-files/rust/lance-table/src/transaction/prepare.rs.md) |
| `lance_table::transaction::PreparedIndices::original` | `pub fn original(&self) -> &[IndexMetadata] {` | public | [rust/lance-table/src/transaction/prepare.rs:82-82](../L2-files/rust/lance-table/src/transaction/prepare.rs.md) |
| `lance_table::transaction::PreparedIndices::prepared` | `pub fn prepared(&self) -> &[IndexMetadata] {` | public | [rust/lance-table/src/transaction/prepare.rs:88-88](../L2-files/rust/lance-table/src/transaction/prepare.rs.md) |
| `lance_table::transaction::reordered_sources` | `pub fn reordered_sources(     transitions: &[crate::format::pb::fragment_reuse_index_details::Transition], ) -> lance_core::Result<RoaringBitmap> {` | public | [rust/lance-table/src/transaction/operation.rs:362-364](../L2-files/rust/lance-table/src/transaction/operation.rs.md) |
| `lance_table::transaction::TaggedRewriteAssembly::new` | `pub fn new(         entry: IndexMetadata,         base_entry_version: Option<u64>,         transitions: &[crate::format::pb::fragment_reuse_index_details::Transition],     ) -> lance_core::Result<Self> {` | public | [rust/lance-table/src/transaction/operation.rs:340-344](../L2-files/rust/lance-table/src/transaction/operation.rs.md) |
| `lance_table::transaction::Transaction::new` | `pub fn new(read_version: u64, operation: Operation, tag: Option<String>) -> Self {` | public | [rust/lance-table/src/transaction/builder.rs:85-85](../L2-files/rust/lance-table/src/transaction/builder.rs.md) |
| `lance_table::transaction::Transaction::new_from_version` | `pub fn new_from_version(read_version: u64, operation: Operation) -> Self {` | public | [rust/lance-table/src/transaction/builder.rs:81-81](../L2-files/rust/lance-table/src/transaction/builder.rs.md) |
| `lance_table::transaction::TransactionBuilder::build` | `pub fn build(self) -> Transaction {` | public | [rust/lance-table/src/transaction/builder.rs:66-66](../L2-files/rust/lance-table/src/transaction/builder.rs.md) |
| `lance_table::transaction::TransactionBuilder::new` | `pub fn new(read_version: u64, operation: Operation) -> Self {` | public | [rust/lance-table/src/transaction/builder.rs:38-38](../L2-files/rust/lance-table/src/transaction/builder.rs.md) |
| `lance_table::transaction::TransactionBuilder::tag` | `pub fn tag(mut self, tag: Option<String>) -> Self {` | public | [rust/lance-table/src/transaction/builder.rs:53-53](../L2-files/rust/lance-table/src/transaction/builder.rs.md) |
| `lance_table::transaction::TransactionBuilder::transaction_properties` | `pub fn transaction_properties(         mut self,         transaction_properties: Option<Arc<HashMap<String, String>>>,     ) -> Self {` | public | [rust/lance-table/src/transaction/builder.rs:58-61](../L2-files/rust/lance-table/src/transaction/builder.rs.md) |
| `lance_table::transaction::TransactionBuilder::uuid` | `pub fn uuid(mut self, uuid: String) -> Self {` | public | [rust/lance-table/src/transaction/builder.rs:48-48](../L2-files/rust/lance-table/src/transaction/builder.rs.md) |
| `lance_table::transaction::translate_config_updates` | `pub fn translate_config_updates(     upsert_values: &std::collections::HashMap<String, String>,     delete_keys: &[String], ) -> UpdateMap {` | public | [rust/lance-table/src/transaction/update_map.rs:84-87](../L2-files/rust/lance-table/src/transaction/update_map.rs.md) |
| `lance_table::transaction::translate_schema_metadata_updates` | `pub fn translate_schema_metadata_updates(     schema_metadata: &std::collections::HashMap<String, String>, ) -> UpdateMap {` | public | [rust/lance-table/src/transaction/update_map.rs:113-115](../L2-files/rust/lance-table/src/transaction/update_map.rs.md) |


## Equality and overlap predicates

[Complete conflicts L2](../L2-files/rust/lance-table/src/transaction/conflicts.rs.md) covers all1,042 lines. The in-memory equality implementation is now fully reviewed. The full commit conflict resolver remains pending.

| Variant | Same-kind equality |
|---|---|
| Append | Unordered-membership fragment comparison |
| Delete | Unordered updated fragments/deleted IDs; exact predicate |
| Overwrite | Unordered fragments; exact Schema/config; ordered optional initial_bases |
| CreateIndex | Unordered new/removed complete index entries |
| Rewrite | Unordered groups/rewritten indices; exact optional in-memory reuse entry |
| Merge | Unordered fragments; exact Schema/nullability assertion |
| Restore / ReserveFragments | Version / reserved count respectively |
| Update | Six vectors unordered; exact mode, inserted filter, offset map |
| Project | Exact Schema/nullability assertion |
| UpdateConfig | Exact three optional UpdateMaps and field map, including entry order/replace |
| DataReplacement | Unordered tuple membership |
| UpdateMemWalState / UpdateBases | Unordered compacted pointers / bases respectively |
| Clone | All five fields exact |
| DataOverlay | Unordered groups, but inner overlay list remains ordered |

This table follows rust/lance-table/src/transaction/conflicts.rs:18-203, rust/lance-table/src/transaction/conflicts.rs:726-777 and rust/lance-table/src/transaction/conflicts.rs:863-869. Every different-kind pair is false (rust/lance-table/src/transaction/conflicts.rs:207-725; rust/lance-table/src/transaction/conflicts.rs:734-864). Unordered-membership means equal length plus every left value contained in right, not a multiset comparison; duplicates can break symmetry. The16x16 kind matrix is equality, not commit compatibility.


Operation::modifies_same_metadata handles only two UpdateConfig values. Table maps conflict when both exist and either replaces, or when their explicit keys intersect; values and delete/insert distinction do not matter. Schema metadata conflicts on mere Some/Some, even with disjoint/empty edits. Field metadata conflicts on any common field ID, even with disjoint/empty inner maps. Config is excluded from this method. (rust/lance-table/src/transaction/conflicts.rs:921-976)

Operation::upsert_key_conflict checks config edits only. Overwrite contributes explicit upsert keys; UpdateConfig contributes Some-valued upserts and None-valued deletes. It clones four key vectors, then reports a shared key when at least one side upserts. Delete/delete is false; replacement flags and implicit clears are ignored. Identical values still conflict, duplicates are retained, and edit ordering is not normalized. Worst-case Vec membership is quadratic in key counts. These local bools do not classify retryability or prove complete transaction compatibility. (rust/lance-table/src/transaction/conflicts.rs:871-991)

Contextual overwrite consumer makes overlapping config keys incompatible and nonoverlapping concurrent overwrites retryable; overwrite versus nonoverlapping UpdateConfig is accepted by that method. Contextual UpdateConfig consumer rejects schema/field edits versus any Overwrite, or either overlap predicate versus another UpdateConfig. Earlier/global checks may impose more rules, so these snippets are not the full matrix. (rust/lance/src/io/commit/conflict_resolver.rs:1814-1865; rust/lance/src/io/commit/conflict_resolver.rs:2320-2384)

The conflicts module comment associates equality with retry identity, but an inspected commit-outcome path explicitly converts to protobuf and compares durable forms, to avoid transient reuse-entry differences. The complete object codec is documented below; full outcome recovery remains pending. (rust/lance-table/src/transaction/conflicts.rs:4-13; rust/lance/src/io/commit.rs:261-301)

### Exact callable declarations

| Symbol | Signature | Visibility | Evidence |
|---|---|---|---|
| `lance_table::transaction::<Operation as PartialEq>::eq` | `fn eq(&self, other: &Self) -> bool {` | public via PartialEq | [rust/lance-table/src/transaction/conflicts.rs:19-19](../L2-files/rust/lance-table/src/transaction/conflicts.rs.md) |
| `lance_table::transaction::<Operation as PartialEq>::eq::compare_vec` | `fn compare_vec<T: PartialEq>(a: &[T], b: &[T]) -> bool {` | private to conflicts implementation | [rust/lance-table/src/transaction/conflicts.rs:25-25](../L2-files/rust/lance-table/src/transaction/conflicts.rs.md) |
| `lance_table::transaction::Operation::get_upsert_config_keys` | `fn get_upsert_config_keys(&self) -> Vec<String> {` | private to conflicts implementation | [rust/lance-table/src/transaction/conflicts.rs:873-873](../L2-files/rust/lance-table/src/transaction/conflicts.rs.md) |
| `lance_table::transaction::Operation::get_delete_config_keys` | `fn get_delete_config_keys(&self) -> Vec<String> {` | private to conflicts implementation | [rust/lance-table/src/transaction/conflicts.rs:901-901](../L2-files/rust/lance-table/src/transaction/conflicts.rs.md) |
| `lance_table::transaction::Operation::modifies_same_metadata` | `pub fn modifies_same_metadata(&self, other: &Self) -> bool {` | public | [rust/lance-table/src/transaction/conflicts.rs:921-921](../L2-files/rust/lance-table/src/transaction/conflicts.rs.md) |
| `lance_table::transaction::Operation::update_maps_conflict` | `fn update_maps_conflict(left: Option<&UpdateMap>, right: Option<&UpdateMap>) -> bool {` | private to conflicts implementation | [rust/lance-table/src/transaction/conflicts.rs:959-959](../L2-files/rust/lance-table/src/transaction/conflicts.rs.md) |
| `lance_table::transaction::Operation::upsert_key_conflict` | `pub fn upsert_key_conflict(&self, other: &Self) -> bool {` | public | [rust/lance-table/src/transaction/conflicts.rs:978-978](../L2-files/rust/lance-table/src/transaction/conflicts.rs.md) |



## Operation validation boundary

[Complete validation L2](../L2-files/rust/lance-table/src/transaction/validate.rs.md) retains all755 lines and seven tests. validate_operation is the only externally reexported function from this module. Both schema helpers have pub declarations inside a private module; merge_fragment_physically_rewritten is pub(super). (rust/lance-table/src/transaction.rs:39-59; rust/lance-table/src/transaction/validate.rs:378-378; rust/lance-table/src/transaction/validate.rs:661-708)

| Dataset / operation | Checks in order |
|---|---|
| Absent / Overwrite | No deletion metadata, then modern base-file nonempty-fields check |
| Absent / Clone | Immediate success at this helper |
| Absent / all others | InvalidInput naming operation |
| Present / Append | Current schema + current manifest format helper |
| Present / Project | Proposed schema + existing fragments + current manifest format helper |
| Present / Merge | Fragment inclusion/counts, schema binding rules, format-selected schema helper |
| Present / Overwrite | No deletion metadata; modern helper independent of old manifest format |
| Present / Update | Updated then new fragments; RewriteColumns-only offset-key membership |
| Present / remaining variants | Success through wildcard |

This is the local dispatch matrix, not complete commit admissibility. InvalidInput errors stop at first failing stage and borrowed inputs remain unchanged. Clone can pass this helper yet fail an earlier caller guard: execute_inner rejects deep Clone unless deep_clone_files_copied is set. (rust/lance-table/src/transaction/validate.rs:377-623; rust/lance/src/dataset/write/commit.rs:336-350)


Modern schema validation ignores the schema and overlays, requiring only each existing base file to have at least one field ID. It accepts an empty fragment or arbitrary nonempty IDs at this boundary. Legacy validation instead requires every schema preorder ID, including nested parents, somewhere in base-file fields; extra masked IDs are allowed. ExactV1 selects legacy; all four exactV2 variants and no manifest select modern. Per-file version metadata is not the selector. (rust/lance-table/src/transaction/validate.rs:644-698)

Merge preserves inclusion of original fragment IDs and exact Option physical_rows; extra IDs are legal and duplicate proposed IDs collapse to last in maps. Shared schema IDs must retain paths. Changes to type/nullability/encoding/dictionary need base materialization and removal of all same-ID old base/overlay identities, comparing base_id+path. That proof visits originals only; additional proposed fragments are omitted despite broader prose. Fresh IDs exceed maximum across schema/base/overlay fields; reusing an old path at a fresh ID requires base materialization in every proposed fragment. Entirely new paths lack that requirement here. (rust/lance-table/src/transaction/validate.rs:726-1044; rust/lance-table/src/format/manifest.rs:478-502)

The separate physical-rewrite detector compares ordered base-file identities, excluding mutable cached size and all deletion/overlay/lineage metadata. Contextual Merge application uses it to stamp latest version for existing fragments when next_row_id is Some; new IDs get latest then cloned creation metadata. Complete candidate-builder behavior is now covered in the manifest assembly supplement. (rust/lance-table/src/transaction/validate.rs:700-724; rust/lance-table/src/transaction/manifest_build.rs:1209-1268)

### Exact validation declarations

| Symbol | Signature | Visibility | Evidence |
|---|---|---|---|
| `lance_table::transaction::validate_operation` | `pub fn validate_operation(manifest: Option<&Manifest>, operation: &Operation) -> Result<()> {` | public reexport | [rust/lance-table/src/transaction/validate.rs:378-378](../L2-files/rust/lance-table/src/transaction/validate.rs.md) |
| `lance_table::transaction::validate::overwrite_fragments_valid` | `fn overwrite_fragments_valid(fragments: &[Fragment]) -> Result<()> {` | private | [rust/lance-table/src/transaction/validate.rs:629-629](../L2-files/rust/lance-table/src/transaction/validate.rs.md) |
| `lance_table::transaction::validate::schema_fragments_valid` | `fn schema_fragments_valid(     manifest: Option<&Manifest>,     schema: &Schema,     fragments: &[Fragment], ) -> Result<()> {` | private | [rust/lance-table/src/transaction/validate.rs:644-648](../L2-files/rust/lance-table/src/transaction/validate.rs.md) |
| `lance_table::transaction::validate::schema_fragments_modern_valid` | `pub fn schema_fragments_modern_valid(_schema: &Schema, fragments: &[Fragment]) -> Result<()> {` | pub inside private nonreexported module | [rust/lance-table/src/transaction/validate.rs:661-661](../L2-files/rust/lance-table/src/transaction/validate.rs.md) |
| `lance_table::transaction::validate::schema_fragments_legacy_valid` | `pub fn schema_fragments_legacy_valid(schema: &Schema, fragments: &[Fragment]) -> Result<()> {` | pub inside private nonreexported module | [rust/lance-table/src/transaction/validate.rs:679-679](../L2-files/rust/lance-table/src/transaction/validate.rs.md) |
| `lance_table::transaction::validate::merge_fragment_physically_rewritten` | `pub(super) fn merge_fragment_physically_rewritten(prev: &Fragment, merged: &Fragment) -> bool {` | pub(super), transaction-internal | [rust/lance-table/src/transaction/validate.rs:708-708](../L2-files/rust/lance-table/src/transaction/validate.rs.md) |
| `lance_table::transaction::validate::merge_fragments_valid` | `fn merge_fragments_valid(manifest: &Manifest, new_fragments: &[Fragment]) -> Result<()> {` | private | [rust/lance-table/src/transaction/validate.rs:729-729](../L2-files/rust/lance-table/src/transaction/validate.rs.md) |
| `lance_table::transaction::validate::merge_schema_valid` | `fn merge_schema_valid(     manifest: &Manifest,     new_schema: &Schema,     fragments: &[Fragment], ) -> Result<()> {` | private | [rust/lance-table/src/transaction/validate.rs:839-843](../L2-files/rust/lance-table/src/transaction/validate.rs.md) |
| `lance_table::transaction::validate::is_field_binding_fully_rewritten` | `fn is_field_binding_fully_rewritten(     manifest: &Manifest,     new_fragment_map: &HashMap<u64, &Fragment>,     field_id: i32, ) -> bool {` | private | [rust/lance-table/src/transaction/validate.rs:988-992](../L2-files/rust/lance-table/src/transaction/validate.rs.md) |
| `lance_table::transaction::validate::shared_field_binding_changes` | `fn shared_field_binding_changes(prior: &Field, new: &Field) -> Option<String> {` | private | [rust/lance-table/src/transaction/validate.rs:1019-1019](../L2-files/rust/lance-table/src/transaction/validate.rs.md) |



## Protobuf conversion contracts

[Complete proto L2](../L2-files/rust/lance-table/src/transaction/proto.rs.md) covers all885 lines,13 trait implementations and two local tests. These convert generated protobuf objects, with nested Roaring bytes; complete transaction byte framing and IO are elsewhere. validate_operation is not invoked by these converters. (rust/lance-table/src/transaction/proto.rs:28-814)

| Rust/protobuf input | Conversion result |
|---|---|
| Empty tag / properties / Overwrite config or bases / RewrittenIndex file list | Decode None |
| Rewrite groups empty | Decode one group from old flat lists, even both empty |
| Rewrite transient frag_reuse_index | Never encoded; decode None |
| Update mode None | Encode0; decode Some(RewriteRows) |
| Unknown update mode integer | Decode Some(RewriteRows) |
| Update empty bitmap entries | Encoder omits them; resulting empty map decodes None |
| Nonempty field10 map with only zero-byte values | Select field10, discard entries, decode None; field9 ignored |
| Valid encoded empty Roaring bitmap in field10 | Decode retains keyed empty bitmap, unlike encoder |
| Overwrite/Merge schema_metadata | Encoder emits empty; decoder ignores supplied map |
| UpdateMap | Entry order, duplicates, optional values and replace preserved |

These are object-conversion rules, not a claim of byte-canonical protobuf encoding or complete operation identity. Their source is rust/lance-table/src/transaction/proto.rs:121-184, rust/lance-table/src/transaction/proto.rs:244-283, rust/lance-table/src/transaction/proto.rs:408-467, rust/lance-table/src/transaction/proto.rs:525-640 and rust/lance-table/src/transaction/proto.rs:718-804. Fields excludes schema-level metadata for Project as well (rust/lance-file/src/datatypes.rs:240-243; rust/lance-file/src/datatypes.rs:292-300; rust/lance-table/src/transaction/proto.rs:285-293; rust/lance-table/src/transaction/proto.rs:642-647).


UpdateConfig reads old style only when legacy data is nonempty and no new-style presence exists. Mixing any Some new map (even empty) or nonempty new field map with legacy data errors. Old config edits become incremental; old schema and field maps become replacement; high unsigned old field IDs cast to signed without validation. Writers emit only new-style fields. Preserve these existing read paths under the legacy boundary; no extra migration behavior was introduced. (rust/lance-table/src/transaction/proto.rs:295-374; rust/lance-table/src/transaction/proto.rs:649-675)

Errors differ by path: missing operation is Internal; missing replacement file and rewritten-index required IDs/details are InvalidInput; malformed field10 bitmap is InvalidInput with fragment ID. Update compacted-SSTable conversion unwraps a fallible UUID conversion, while UpdateMemWalState propagates it. Nested Fragment/Schema/Index/Overlay/filter errors propagate unless that explicit unwrap applies. No format/feature gate or validation of UUID strings/versions occurs in transaction envelope conversion. (rust/lance-table/src/transaction/proto.rs:39-53; rust/lance-table/src/transaction/proto.rs:83-284; rust/lance-table/src/transaction/proto.rs:383-468; rust/lance-table/src/system_index/mem_wal.rs:125-139)

### Exact protobuf conversion declarations

| Symbol | Signature | Visibility | Evidence |
|---|---|---|---|
| `lance_table::transaction::proto::<pb::transaction::DataReplacementGroup as From<&DataReplacementGroup>>::from` | `fn from(DataReplacementGroup(fragment_id, new_file): &DataReplacementGroup) -> Self {` | public trait method | [rust/lance-table/src/transaction/proto.rs:29-29](../L2-files/rust/lance-table/src/transaction/proto.rs.md) |
| `lance_table::transaction::proto::<DataReplacementGroup as TryFrom<pb::transaction::DataReplacementGroup>>::try_from` | `fn try_from(message: pb::transaction::DataReplacementGroup) -> Result<Self> {` | public trait method | [rust/lance-table/src/transaction/proto.rs:42-42](../L2-files/rust/lance-table/src/transaction/proto.rs.md) |
| `lance_table::transaction::proto::<pb::transaction::DataOverlayGroup as From<&DataOverlayGroup>>::from` | `fn from(group: &DataOverlayGroup) -> Self {` | public trait method | [rust/lance-table/src/transaction/proto.rs:56-56](../L2-files/rust/lance-table/src/transaction/proto.rs.md) |
| `lance_table::transaction::proto::<DataOverlayGroup as TryFrom<pb::transaction::DataOverlayGroup>>::try_from` | `fn try_from(message: pb::transaction::DataOverlayGroup) -> Result<Self> {` | public trait method | [rust/lance-table/src/transaction/proto.rs:71-71](../L2-files/rust/lance-table/src/transaction/proto.rs.md) |
| `lance_table::transaction::proto::<Transaction as TryFrom<pb::Transaction>>::try_from` | `fn try_from(message: pb::Transaction) -> Result<Self> {` | public trait method | [rust/lance-table/src/transaction/proto.rs:86-86](../L2-files/rust/lance-table/src/transaction/proto.rs.md) |
| `lance_table::transaction::proto::<RewrittenIndex as TryFrom<&pb::transaction::rewrite::RewrittenIndex>>::try_from` | `fn try_from(message: &pb::transaction::rewrite::RewrittenIndex) -> Result<Self> {` | public trait method | [rust/lance-table/src/transaction/proto.rs:429-429](../L2-files/rust/lance-table/src/transaction/proto.rs.md) |
| `lance_table::transaction::proto::<RewriteGroup as TryFrom<pb::transaction::rewrite::RewriteGroup>>::try_from` | `fn try_from(message: pb::transaction::rewrite::RewriteGroup) -> Result<Self> {` | public trait method | [rust/lance-table/src/transaction/proto.rs:474-474](../L2-files/rust/lance-table/src/transaction/proto.rs.md) |
| `lance_table::transaction::proto::<pb::Transaction as From<&Transaction>>::from` | `fn from(value: &Transaction) -> Self {` | public trait method | [rust/lance-table/src/transaction/proto.rs:490-493](../L2-files/rust/lance-table/src/transaction/proto.rs.md) |
| `lance_table::transaction::proto::<pb::transaction::rewrite::RewrittenIndex as From<&RewrittenIndex>>::from` | `fn from(value: &RewrittenIndex) -> Self {` | public trait method | [rust/lance-table/src/transaction/proto.rs:734-734](../L2-files/rust/lance-table/src/transaction/proto.rs.md) |
| `lance_table::transaction::proto::<pb::transaction::rewrite::RewriteGroup as From<&RewriteGroup>>::from` | `fn from(value: &RewriteGroup) -> Self {` | public trait method | [rust/lance-table/src/transaction/proto.rs:758-758](../L2-files/rust/lance-table/src/transaction/proto.rs.md) |
| `lance_table::transaction::proto::<pb::transaction::UpdateMap as From<&UpdateMap>>::from` | `fn from(update_map: &UpdateMap) -> Self {` | public trait method | [rust/lance-table/src/transaction/proto.rs:775-775](../L2-files/rust/lance-table/src/transaction/proto.rs.md) |
| `lance_table::transaction::proto::<UpdateMap as From<&pb::transaction::UpdateMap>>::from` | `fn from(pb_update_map: &pb::transaction::UpdateMap) -> Self {` | public trait method | [rust/lance-table/src/transaction/proto.rs:791-791](../L2-files/rust/lance-table/src/transaction/proto.rs.md) |
| `lance_table::transaction::proto::<crate::format::Transaction as From<&Transaction>>::from` | `fn from(value: &Transaction) -> Self {` | public trait method | [rust/lance-table/src/transaction/proto.rs:806-812](../L2-files/rust/lance-table/src/transaction/proto.rs.md) |



## Index invalidation, retention and fragment replacement

[Full index-maintenance L2](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) and [tagged-lineage L2](../L2-files/rust/lance-table/src/system_index/frag_reuse/lineage.rs.md) cover1779 lines. These are synchronous metadata operations; physical index cleanup, reader translation and commit publication require separate consumer analysis. (rust/lance-table/src/transaction/index_maintenance.rs:27-809; rust/lance-table/src/system_index/frag_reuse/lineage.rs:23-140)

| Symbol | Exact declaration | Visibility | Evidence |
|---|---|---|---|
| `lance_table::transaction::Transaction::register_pure_rewrite_rows_update_frags_in_indices` | `pub(super) fn register_pure_rewrite_rows_update_frags_in_indices(         indices: &mut [IndexMetadata],         pure_update_frag_ids: &[u64],         original_fragment_ids: &[u64],         fields_for_preserving_frag_bitmap: &[u32],         original_overlaid_frags: &HashMap<u32, &Fragment>,         schema: &Schema,     ) -> Result<()> {` | pub(super)  | [rust/lance-table/src/transaction/index_maintenance.rs:28-35](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) |
| `lance_table::transaction::Transaction::rewritten_physical_columns` | `pub fn rewritten_physical_columns(         operation: &Operation,         schema: &Schema,         previous_fragments: &[Fragment],     ) -> Vec<(u64, Vec<u32>)> {` | pub  | [rust/lance-table/src/transaction/index_maintenance.rs:106-110](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) |
| `lance_table::transaction::Transaction::withdraw_in_place_rewrites` | `pub fn withdraw_in_place_rewrites(         indices: &mut Vec<IndexMetadata>,         rewrites: Vec<(u64, Vec<u32>)>,         schema: &Schema,         live: &RoaringBitmap,         lineage: Option<&TaggedLineage>,     ) {` | pub  | [rust/lance-table/src/transaction/index_maintenance.rs:155-161](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) |
| `lance_table::transaction::Transaction::expand_rewritten_fields` | `fn expand_rewritten_fields(         schema: &Schema,         rewrites: Vec<(u64, Vec<u32>)>,     ) -> Vec<(u64, Vec<u32>)> {` | private | [rust/lance-table/src/transaction/index_maintenance.rs:185-188](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) |
| `lance_table::transaction::Transaction::with_descendants` | `fn with_descendants(schema: &Schema, fields: Vec<u32>) -> Vec<u32> {` | private | [rust/lance-table/src/transaction/index_maintenance.rs:196-196](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) |
| `lance_table::transaction::Transaction::withdraw_rewritten_coverage` | `pub fn withdraw_rewritten_coverage(         indices: &mut Vec<IndexMetadata>,         lineage: Option<&TaggedLineage>,         live: &RoaringBitmap,         rewrites: &[(u64, Vec<u32>)],     ) {` | pub  | [rust/lance-table/src/transaction/index_maintenance.rs:259-264](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) |
| `lance_table::transaction::Transaction::retire_emptied_segments` | `fn retire_emptied_segments(indices: &mut Vec<IndexMetadata>, emptied: &[Uuid]) {` | private | [rust/lance-table/src/transaction/index_maintenance.rs:355-355](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) |
| `lance_table::transaction::Transaction::prune_updated_fields_from_indices` | `pub fn prune_updated_fields_from_indices(         indices: &mut [IndexMetadata],         updated_fragments: &[Fragment],         fields_modified: &[u32],     ) {` | pub  | [rust/lance-table/src/transaction/index_maintenance.rs:397-401](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) |
| `lance_table::transaction::Transaction::fragment_field_paths` | `fn fragment_field_paths(frag: &Fragment) -> HashMap<i32, &str> {` | private | [rust/lance-table/src/transaction/index_maintenance.rs:436-436](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) |
| `lance_table::transaction::Transaction::merge_rewritten_fields` | `pub fn merge_rewritten_fields(         prev_fragments: &[Fragment],         new_fragments: &[Fragment],     ) -> Vec<(u64, Vec<u32>)> {` | pub  | [rust/lance-table/src/transaction/index_maintenance.rs:451-454](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) |
| `lance_table::transaction::Transaction::prune_overlay_stale_fields_from_indices` | `pub(super) fn prune_overlay_stale_fields_from_indices(         indices: &mut [IndexMetadata],         groups: &[RewriteGroup],     ) {` | pub(super)  | [rust/lance-table/src/transaction/index_maintenance.rs:492-495](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) |
| `lance_table::transaction::Transaction::retain_relevant_indices` | `pub(crate) fn retain_relevant_indices(         indices: &mut Vec<IndexMetadata>,         schema: &Schema,         fragments: &[Fragment],     ) {` | pub(crate)  | [rust/lance-table/src/transaction/index_maintenance.rs:535-539](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) |
| `lance_table::transaction::Transaction::ordered_rewrite_groups` | `pub(super) fn ordered_rewrite_groups(         groups: &[RewriteGroup],         reordered_sources: Option<&RoaringBitmap>,     ) -> Result<Vec<RewriteGroup>> {` | pub(super)  | [rust/lance-table/src/transaction/index_maintenance.rs:650-653](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) |
| `lance_table::transaction::Transaction::recalculate_fragment_bitmap` | `pub(super) fn recalculate_fragment_bitmap(         old: &RoaringBitmap,         groups: &[RewriteGroup],     ) -> Result<RoaringBitmap> {` | pub(super)  | [rust/lance-table/src/transaction/index_maintenance.rs:675-678](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) |
| `lance_table::transaction::Transaction::handle_rewrite_indices` | `pub(super) fn handle_rewrite_indices(         indices: &mut [IndexMetadata],         rewritten_indices: &[RewrittenIndex],         groups: &[RewriteGroup],     ) -> Result<()> {` | pub(super)  | [rust/lance-table/src/transaction/index_maintenance.rs:709-713](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) |
| `lance_table::transaction::Transaction::handle_rewrite_fragments` | `pub(super) fn handle_rewrite_fragments(         final_fragments: &mut Vec<Fragment>,         groups: &[RewriteGroup],         fragment_id: &mut u64,         version: u64,         _next_row_id: Option<&u64>,     ) -> Result<()> {` | pub(super)  | [rust/lance-table/src/transaction/index_maintenance.rs:750-756](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) |
| `lance_table::system_index::frag_reuse::lineage::TaggedLineage` | `pub struct TaggedLineage {` | public | [rust/lance-table/src/system_index/frag_reuse/lineage.rs:26-26](../L2-files/rust/lance-table/src/system_index/frag_reuse/lineage.rs.md) |
| `lance_table::system_index::frag_reuse::lineage::TaggedLineage::fragments` | `fragments: Option<RoaringBitmap>,` | private | [rust/lance-table/src/system_index/frag_reuse/lineage.rs:29-29](../L2-files/rust/lance-table/src/system_index/frag_reuse/lineage.rs.md) |
| `lance_table::system_index::frag_reuse::lineage::TaggedLineage::ledger` | `ledger: Option<Arc<FragReuseLedger>>,` | private | [rust/lance-table/src/system_index/frag_reuse/lineage.rs:33-33](../L2-files/rust/lance-table/src/system_index/frag_reuse/lineage.rs.md) |
| `lance_table::system_index::frag_reuse::lineage::TaggedLineage::new` | `pub fn new(entry: &IndexMetadata, ledger: Option<Arc<FragReuseLedger>>) -> Self {` | pub  | [rust/lance-table/src/system_index/frag_reuse/lineage.rs:38-38](../L2-files/rust/lance-table/src/system_index/frag_reuse/lineage.rs.md) |
| `lance_table::system_index::frag_reuse::lineage::TaggedLineage::from_indices_with_ledger` | `pub fn from_indices_with_ledger(         indices: &[IndexMetadata],         ledger: Option<Arc<FragReuseLedger>>,     ) -> Result<Option<Self>> {` | pub  | [rust/lance-table/src/system_index/frag_reuse/lineage.rs:50-53](../L2-files/rust/lance-table/src/system_index/frag_reuse/lineage.rs.md) |
| `lance_table::system_index::frag_reuse::lineage::TaggedLineage::has_ledger` | `pub fn has_ledger(&self) -> bool {` | pub  | [rust/lance-table/src/system_index/frag_reuse/lineage.rs:81-81](../L2-files/rust/lance-table/src/system_index/frag_reuse/lineage.rs.md) |
| `lance_table::system_index::frag_reuse::lineage::TaggedLineage::mentions` | `pub fn mentions(&self, fragment: u32) -> Option<bool> {` | pub  | [rust/lance-table/src/system_index/frag_reuse/lineage.rs:89-89](../L2-files/rust/lance-table/src/system_index/frag_reuse/lineage.rs.md) |
| `lance_table::system_index::frag_reuse::lineage::TaggedLineage::contains` | `pub fn contains(&self, fragment: u32) -> bool {` | pub  | [rust/lance-table/src/system_index/frag_reuse/lineage.rs:97-97](../L2-files/rust/lance-table/src/system_index/frag_reuse/lineage.rs.md) |
| `lance_table::system_index::frag_reuse::lineage::TaggedLineage::immediate_destinations_of` | `pub fn immediate_destinations_of(&self, source: u32) -> Option<Vec<u32>> {` | pub  | [rust/lance-table/src/system_index/frag_reuse/lineage.rs:106-106](../L2-files/rust/lance-table/src/system_index/frag_reuse/lineage.rs.md) |
| `lance_table::system_index::frag_reuse::lineage::TaggedLineage::destinations_of` | `pub fn destinations_of(&self, source: u32) -> Option<Vec<u32>> {` | pub  | [rust/lance-table/src/system_index/frag_reuse/lineage.rs:121-121](../L2-files/rust/lance-table/src/system_index/frag_reuse/lineage.rs.md) |

Retain unknown bitmap coverage. Untagged multiple known segments keep all effectively nonempty segments, or oldest if all empty; a sole known empty segment remains. Tagged history preserves all same-name coverage segments, including retired source IDs and empty definitions. Missing schema fields still remove ordinary indices before the tagged branch. This changes metadata membership without rewriting stored bitmap provenance or deleting files. (rust/lance-table/src/transaction/index_maintenance.rs:535-643)

TaggedLineage stores two independent kinds of knowledge: coverage bitmap and usable ledger. contains() treats absent bitmap as possible membership; mentions()/destination walks return None without ledger. Known leaf destinations are Some(empty), which must not be collapsed into unknown. Unsupported transitions disable the supplied ledger; absent prefetched external history errors in from_indices_with_ledger. (rust/lance-table/src/system_index/frag_reuse/lineage.rs:23-140)



## Tagged-history gate and metadata guards

[Gate L2](../L2-files/rust/lance-table/src/system_index/frag_reuse/gate.rs.md) covers the complete ordered classifier and its45-case matrix plus migration test; [metadata L2](../L2-files/rust/lance-table/src/system_index/frag_reuse/metadata.rs.md) covers four public guards and two predicate tests. Parent modules are public. Classification does not assemble/validate history or mutate metadata. (rust/lance-table/src/system_index/frag_reuse.rs:4-7; rust/lance-table/src/system_index/frag_reuse/gate.rs:54-330)

| Symbol | Exact declaration | Evidence |
|---|---|---|
| `lance_table::system_index::frag_reuse::metadata::is_tagged` | `pub fn is_tagged(index: &IndexMetadata) -> bool {` | [rust/lance-table/src/system_index/frag_reuse/metadata.rs:16-16](../L2-files/rust/lance-table/src/system_index/frag_reuse/metadata.rs.md) |
| `lance_table::system_index::frag_reuse::metadata::uses_tagged_fri` | `pub fn uses_tagged_fri(manifest: &Manifest, existing_fri_entry: Option<&IndexMetadata>) -> bool {` | [rust/lance-table/src/system_index/frag_reuse/metadata.rs:32-32](../L2-files/rust/lance-table/src/system_index/frag_reuse/metadata.rs.md) |
| `lance_table::system_index::frag_reuse::metadata::validate_flags` | `pub fn validate_flags(manifest: &Manifest, indices: &[IndexMetadata]) -> Result<()> {` | [rust/lance-table/src/system_index/frag_reuse/metadata.rs:38-38](../L2-files/rust/lance-table/src/system_index/frag_reuse/metadata.rs.md) |
| `lance_table::system_index::frag_reuse::metadata::ensure_clone_supported` | `pub async fn ensure_clone_supported(     store: &ObjectStore,     location: &ManifestLocation,     manifest: &Manifest, ) -> Result<()> {` | [rust/lance-table/src/system_index/frag_reuse/metadata.rs:70-74](../L2-files/rust/lance-table/src/system_index/frag_reuse/metadata.rs.md) |
| `lance_table::system_index::frag_reuse::gate::Admission` | `pub enum Admission {` | [rust/lance-table/src/system_index/frag_reuse/gate.rs:24-24](../L2-files/rust/lance-table/src/system_index/frag_reuse/gate.rs.md) |
| `lance_table::system_index::frag_reuse::gate::Admission::Untagged` | `Untagged,` | [rust/lance-table/src/system_index/frag_reuse/gate.rs:26-26](../L2-files/rust/lance-table/src/system_index/frag_reuse/gate.rs.md) |
| `lance_table::system_index::frag_reuse::gate::Admission::AppendsTransitions` | `AppendsTransitions,` | [rust/lance-table/src/system_index/frag_reuse/gate.rs:28-28](../L2-files/rust/lance-table/src/system_index/frag_reuse/gate.rs.md) |
| `lance_table::system_index::frag_reuse::gate::Admission::RewritesUncoveredFragments` | `RewritesUncoveredFragments,` | [rust/lance-table/src/system_index/frag_reuse/gate.rs:30-30](../L2-files/rust/lance-table/src/system_index/frag_reuse/gate.rs.md) |
| `lance_table::system_index::frag_reuse::gate::Admission::MovesNoRows` | `MovesNoRows,` | [rust/lance-table/src/system_index/frag_reuse/gate.rs:33-33](../L2-files/rust/lance-table/src/system_index/frag_reuse/gate.rs.md) |
| `lance_table::system_index::frag_reuse::gate::Admission::RestoresManifest` | `RestoresManifest,` | [rust/lance-table/src/system_index/frag_reuse/gate.rs:36-36](../L2-files/rust/lance-table/src/system_index/frag_reuse/gate.rs.md) |
| `lance_table::system_index::frag_reuse::gate::Admission::MaintainsUserIndices` | `MaintainsUserIndices,` | [rust/lance-table/src/system_index/frag_reuse/gate.rs:41-41](../L2-files/rust/lance-table/src/system_index/frag_reuse/gate.rs.md) |
| `lance_table::system_index::frag_reuse::gate::classify` | `pub fn classify(     operation: &Operation,     current_manifest: Option<&Manifest>,     current_indices: &[IndexMetadata],     frag_reuse: &FragReuseUpdate,     migration_next_row_id: Option<u64>, ) -> Result<Admission> {` | [rust/lance-table/src/system_index/frag_reuse/gate.rs:54-60](../L2-files/rust/lance-table/src/system_index/frag_reuse/gate.rs.md) |

Read classification in order: reject unassembled tagged transient snapshot anywhere; if no current tagged entry reject flagged v0 replacement, otherwise return Untagged; accept assembled rewrite; accept nonempty outer-group bare uncovered rewrite under known versions; reject remaining migration-marked operations; accept ordinary user-index maintenance; apply exhaustive final operation match. Admission is a gate reason, not complete validation or a guarantee that data columns are unchanged. (rust/lance-table/src/system_index/frag_reuse/gate.rs:69-330)



## Unified ledger and compatibility remap surface

[Ledger L2](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) covers strict metadata reconstruction; [parent L2](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) covers module routing and existing legacy converters/remap adapters. The latter remain compatibility surfaces, not the basis for new tagged features. Full production loader/assembly integration remains pending. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:129-543; rust/lance-table/src/system_index/frag_reuse.rs:175-568; AGENTS.md:13-18)

| Symbol | Exact declaration | Visibility | Evidence |
|---|---|---|---|
| `lance_table::system_index::frag_reuse::ledger::Mapping` | `pub enum Mapping {` | public | [rust/lance-table/src/system_index/frag_reuse/ledger.rs:49-49](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) |
| `lance_table::system_index::frag_reuse::ledger::Mapping::OrderedCompaction` | `OrderedCompaction(Arc<RowAddrRemap>),` | public | [rust/lance-table/src/system_index/frag_reuse/ledger.rs:51-51](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) |
| `lance_table::system_index::frag_reuse::ledger::Mapping::StablePartition` | `StablePartition(pb::StablePartition),` | public | [rust/lance-table/src/system_index/frag_reuse/ledger.rs:53-53](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) |
| `lance_table::system_index::frag_reuse::ledger::Transition` | `pub struct Transition {` | public | [rust/lance-table/src/system_index/frag_reuse/ledger.rs:58-58](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) |
| `lance_table::system_index::frag_reuse::ledger::Transition::fingerprint` | `pub fn fingerprint(&self) -> &[u8; 32] {` | public | [rust/lance-table/src/system_index/frag_reuse/ledger.rs:69-69](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) |
| `lance_table::system_index::frag_reuse::ledger::Transition::sources` | `pub fn sources(&self) -> &[pb::FragmentDigest] {` | public | [rust/lance-table/src/system_index/frag_reuse/ledger.rs:74-74](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) |
| `lance_table::system_index::frag_reuse::ledger::Transition::destinations` | `pub fn destinations(&self) -> &[pb::FragmentDigest] {` | public | [rust/lance-table/src/system_index/frag_reuse/ledger.rs:79-79](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) |
| `lance_table::system_index::frag_reuse::ledger::Transition::mapping` | `pub fn mapping(&self) -> &Mapping {` | public | [rust/lance-table/src/system_index/frag_reuse/ledger.rs:84-84](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) |
| `lance_table::system_index::frag_reuse::ledger::FragReuseLedger` | `pub struct FragReuseLedger {` | public | [rust/lance-table/src/system_index/frag_reuse/ledger.rs:99-99](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) |
| `lance_table::system_index::frag_reuse::ledger::FragReuseLedger::decode` | `pub async fn decode<F, Fut>(         index_version: i32,         details: &prost_types::Any,         read_external: F,     ) -> Result<Self>     where         F: FnOnce(crate::format::pb::ExternalFile) -> Fut,         Fut: Future<Output = Result<Bytes>>,     {` | public | [rust/lance-table/src/system_index/frag_reuse/ledger.rs:134-142](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) |
| `lance_table::system_index::frag_reuse::ledger::FragReuseLedger::decode_inline` | `pub fn decode_inline(index_version: i32, details: &prost_types::Any) -> Result<Option<Self>> {` | public | [rust/lance-table/src/system_index/frag_reuse/ledger.rs:170-170](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) |
| `lance_table::system_index::frag_reuse::ledger::FragReuseLedger::has_unsupported_transitions` | `pub fn has_unsupported_transitions(&self) -> bool {` | public | [rust/lance-table/src/system_index/frag_reuse/ledger.rs:290-290](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) |
| `lance_table::system_index::frag_reuse::ledger::FragReuseLedger::consumer` | `pub fn consumer(&self, fragment_id: u32) -> Option<usize> {` | public | [rust/lance-table/src/system_index/frag_reuse/ledger.rs:296-296](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) |
| `lance_table::system_index::frag_reuse::ledger::FragReuseLedger::producer` | `pub fn producer(&self, fragment_id: u32) -> Option<usize> {` | public | [rust/lance-table/src/system_index/frag_reuse/ledger.rs:302-302](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) |
| `lance_table::system_index::frag_reuse::ledger::FragReuseLedger::contains_fragment` | `pub fn contains_fragment(&self, fragment_id: u32) -> bool {` | public | [rust/lance-table/src/system_index/frag_reuse/ledger.rs:308-308](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) |
| `lance_table::system_index::frag_reuse::ledger::FragReuseLedger::transitions` | `pub fn transitions(&self) -> &[Transition] {` | public | [rust/lance-table/src/system_index/frag_reuse/ledger.rs:313-313](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) |
| `lance_table::system_index::frag_reuse::ledger::<FragReuseLedger as DeepSizeOf>` | `impl DeepSizeOf for FragReuseLedger {` | public trait implementation | [rust/lance-table/src/system_index/frag_reuse/ledger.rs:318-318](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) |
| `lance_table::system_index::frag_reuse::ledger::<FragReuseLedger as DeepSizeOf>::deep_size_of_children` | `fn deep_size_of_children(&self, context: &mut Context) -> usize {` | public trait method | [rust/lance-table/src/system_index/frag_reuse/ledger.rs:319-319](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) |
| `lance_table::system_index::frag_reuse::gate` | `pub mod gate;` | public | [rust/lance-table/src/system_index/frag_reuse.rs:4-4](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::ledger` | `pub mod ledger;` | public | [rust/lance-table/src/system_index/frag_reuse.rs:5-5](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::lineage` | `pub mod lineage;` | public | [rust/lance-table/src/system_index/frag_reuse.rs:6-6](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::metadata` | `pub mod metadata;` | public | [rust/lance-table/src/system_index/frag_reuse.rs:7-7](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FRAG_REUSE_INDEX_NAME` | `pub const FRAG_REUSE_INDEX_NAME: &str = "__lance_frag_reuse";` | public | [rust/lance-table/src/system_index/frag_reuse.rs:26-26](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FRAG_REUSE_DETAILS_FILE_NAME` | `pub const FRAG_REUSE_DETAILS_FILE_NAME: &str = "details.binpb";` | public | [rust/lance-table/src/system_index/frag_reuse.rs:27-27](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::is_frag_reuse_index_entry` | `pub fn is_frag_reuse_index_entry(index: &IndexMetadata) -> bool {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:31-31](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragDigest` | `pub struct FragDigest {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:44-44](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragDigest::id` | `pub id: u64,` | public | [rust/lance-table/src/system_index/frag_reuse.rs:45-45](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragDigest::physical_rows` | `pub physical_rows: usize,` | public | [rust/lance-table/src/system_index/frag_reuse.rs:46-46](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragDigest::num_deleted_rows` | `pub num_deleted_rows: usize,` | public | [rust/lance-table/src/system_index/frag_reuse.rs:47-47](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<pb::fragment_reuse_index_details::FragmentDigest as From<&FragDigest>>` | `impl From<&FragDigest> for pb::fragment_reuse_index_details::FragmentDigest {` | public trait implementation | [rust/lance-table/src/system_index/frag_reuse.rs:50-50](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<pb::fragment_reuse_index_details::FragmentDigest as From<&FragDigest>>::from` | `fn from(digest: &FragDigest) -> Self {` | public trait method | [rust/lance-table/src/system_index/frag_reuse.rs:51-51](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<FragDigest as From<&Fragment>>` | `impl From<&Fragment> for FragDigest {` | public trait implementation | [rust/lance-table/src/system_index/frag_reuse.rs:60-60](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<FragDigest as From<&Fragment>>::from` | `fn from(fragment: &Fragment) -> Self {` | public trait method | [rust/lance-table/src/system_index/frag_reuse.rs:61-61](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<FragDigest as TryFrom<pb::fragment_reuse_index_details::FragmentDigest>>` | `impl TryFrom<pb::fragment_reuse_index_details::FragmentDigest> for FragDigest {` | public trait implementation | [rust/lance-table/src/system_index/frag_reuse.rs:76-76](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<FragDigest as TryFrom<pb::fragment_reuse_index_details::FragmentDigest>>::Error` | `type Error = Error;` | public trait associated type | [rust/lance-table/src/system_index/frag_reuse.rs:77-77](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<FragDigest as TryFrom<pb::fragment_reuse_index_details::FragmentDigest>>::try_from` | `fn try_from(digest: pb::fragment_reuse_index_details::FragmentDigest) -> Result<Self> {` | public trait method | [rust/lance-table/src/system_index/frag_reuse.rs:79-79](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseGroup` | `pub struct FragReuseGroup {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:89-89](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseGroup::changed_row_addrs` | `pub changed_row_addrs: Vec<u8>,` | public | [rust/lance-table/src/system_index/frag_reuse.rs:90-90](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseGroup::old_frags` | `pub old_frags: Vec<FragDigest>,` | public | [rust/lance-table/src/system_index/frag_reuse.rs:91-91](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseGroup::new_frags` | `pub new_frags: Vec<FragDigest>,` | public | [rust/lance-table/src/system_index/frag_reuse.rs:92-92](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<pb::fragment_reuse_index_details::Group as From<&FragReuseGroup>>` | `impl From<&FragReuseGroup> for pb::fragment_reuse_index_details::Group {` | public trait implementation | [rust/lance-table/src/system_index/frag_reuse.rs:95-95](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<pb::fragment_reuse_index_details::Group as From<&FragReuseGroup>>::from` | `fn from(group: &FragReuseGroup) -> Self {` | public trait method | [rust/lance-table/src/system_index/frag_reuse.rs:96-96](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<FragReuseGroup as TryFrom<pb::fragment_reuse_index_details::Group>>` | `impl TryFrom<pb::fragment_reuse_index_details::Group> for FragReuseGroup {` | public trait implementation | [rust/lance-table/src/system_index/frag_reuse.rs:105-105](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<FragReuseGroup as TryFrom<pb::fragment_reuse_index_details::Group>>::Error` | `type Error = Error;` | public trait associated type | [rust/lance-table/src/system_index/frag_reuse.rs:106-106](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<FragReuseGroup as TryFrom<pb::fragment_reuse_index_details::Group>>::try_from` | `fn try_from(group: pb::fragment_reuse_index_details::Group) -> Result<Self> {` | public trait method | [rust/lance-table/src/system_index/frag_reuse.rs:108-108](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseVersion` | `pub struct FragReuseVersion {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:126-126](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseVersion::dataset_version` | `pub dataset_version: u64,` | public | [rust/lance-table/src/system_index/frag_reuse.rs:127-127](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseVersion::groups` | `pub groups: Vec<FragReuseGroup>,` | public | [rust/lance-table/src/system_index/frag_reuse.rs:128-128](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<pb::fragment_reuse_index_details::Version as From<&FragReuseVersion>>` | `impl From<&FragReuseVersion> for pb::fragment_reuse_index_details::Version {` | public trait implementation | [rust/lance-table/src/system_index/frag_reuse.rs:131-131](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<pb::fragment_reuse_index_details::Version as From<&FragReuseVersion>>::from` | `fn from(version: &FragReuseVersion) -> Self {` | public trait method | [rust/lance-table/src/system_index/frag_reuse.rs:132-132](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<FragReuseVersion as TryFrom<pb::fragment_reuse_index_details::Version>>` | `impl TryFrom<pb::fragment_reuse_index_details::Version> for FragReuseVersion {` | public trait implementation | [rust/lance-table/src/system_index/frag_reuse.rs:140-140](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<FragReuseVersion as TryFrom<pb::fragment_reuse_index_details::Version>>::Error` | `type Error = Error;` | public trait associated type | [rust/lance-table/src/system_index/frag_reuse.rs:141-141](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<FragReuseVersion as TryFrom<pb::fragment_reuse_index_details::Version>>::try_from` | `fn try_from(version: pb::fragment_reuse_index_details::Version) -> Result<Self> {` | public trait method | [rust/lance-table/src/system_index/frag_reuse.rs:143-143](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseVersion::old_frag_ids` | `pub fn old_frag_ids(&self) -> Vec<u64> {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:156-156](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseVersion::new_frag_ids` | `pub fn new_frag_ids(&self) -> Vec<u64> {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:163-163](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseVersion::new_frag_bitmap` | `pub fn new_frag_bitmap(&self) -> RoaringBitmap {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:170-170](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndexDetailsContentType` | `pub enum FragReuseIndexDetailsContentType {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:176-176](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndexDetailsContentType::Inline` | `Inline(FragReuseIndexDetails),` | public | [rust/lance-table/src/system_index/frag_reuse.rs:177-177](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndexDetailsContentType::External` | `External(ExternalFile),` | public | [rust/lance-table/src/system_index/frag_reuse.rs:178-178](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndexDetails` | `pub struct FragReuseIndexDetails {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:182-182](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndexDetails::versions` | `pub versions: Vec<FragReuseVersion>,` | public | [rust/lance-table/src/system_index/frag_reuse.rs:183-183](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<InlineContent as From<&FragReuseIndexDetails>>` | `impl From<&FragReuseIndexDetails> for InlineContent {` | public trait implementation | [rust/lance-table/src/system_index/frag_reuse.rs:186-186](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<InlineContent as From<&FragReuseIndexDetails>>::from` | `fn from(details: &FragReuseIndexDetails) -> Self {` | public trait method | [rust/lance-table/src/system_index/frag_reuse.rs:187-187](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<FragReuseIndexDetails as TryFrom<InlineContent>>` | `impl TryFrom<InlineContent> for FragReuseIndexDetails {` | public trait implementation | [rust/lance-table/src/system_index/frag_reuse.rs:199-199](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<FragReuseIndexDetails as TryFrom<InlineContent>>::Error` | `type Error = Error;` | public trait associated type | [rust/lance-table/src/system_index/frag_reuse.rs:200-200](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<FragReuseIndexDetails as TryFrom<InlineContent>>::try_from` | `fn try_from(content: InlineContent) -> Result<Self> {` | public trait method | [rust/lance-table/src/system_index/frag_reuse.rs:202-202](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndexDetails::new_frag_bitmap` | `pub fn new_frag_bitmap(&self) -> RoaringBitmap {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:214-214](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndex` | `pub struct FragReuseIndex {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:229-229](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndex::uuid` | `pub uuid: Uuid,` | public | [rust/lance-table/src/system_index/frag_reuse.rs:230-230](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndex::row_id_maps` | `pub row_id_maps: Vec<HashMap<u64, Option<u64>>>,` | public | [rust/lance-table/src/system_index/frag_reuse.rs:231-231](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndex::details` | `pub details: FragReuseIndexDetails,` | public | [rust/lance-table/src/system_index/frag_reuse.rs:232-232](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<FragReuseIndex as DeepSizeOf>` | `impl DeepSizeOf for FragReuseIndex {` | public trait implementation | [rust/lance-table/src/system_index/frag_reuse.rs:235-235](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<FragReuseIndex as DeepSizeOf>::deep_size_of_children` | `fn deep_size_of_children(&self, cx: &mut Context) -> usize {` | public trait method | [rust/lance-table/src/system_index/frag_reuse.rs:236-236](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndex::new` | `pub fn new(         uuid: Uuid,         row_id_maps: Vec<HashMap<u64, Option<u64>>>,         details: FragReuseIndexDetails,     ) -> Self {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:242-246](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndex::is_empty` | `pub fn is_empty(&self) -> bool {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:254-254](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndex::remap_row_id` | `pub fn remap_row_id(&self, row_id: u64) -> Option<u64> {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:258-258](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndex::remap_row_ids_in_place` | `pub fn remap_row_ids_in_place(&self, row_ids: &mut [Option<u64>]) {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:268-268](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndex::remap_row_addrs_tree_map` | `pub fn remap_row_addrs_tree_map(&self, row_addrs: &RowAddrTreeMap) -> RowAddrTreeMap {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:280-280](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndex::remap_row_ids_roaring_tree_map` | `pub fn remap_row_ids_roaring_tree_map(&self, row_ids: &RoaringTreemap) -> RoaringTreemap {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:289-289](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndex::remap_row_ids_record_batch` | `pub fn remap_row_ids_record_batch(         &self,         batch: RecordBatch,         row_id_idx: usize,     ) -> Result<RecordBatch> {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:293-297](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndex::remap_row_ids_array` | `pub fn remap_row_ids_array(&self, array: ArrayRef) -> PrimitiveArray<UInt64Type> {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:303-303](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::FragReuseIndex::remap_fragment_bitmap` | `pub fn remap_fragment_bitmap(&self, fragment_bitmap: &mut RoaringBitmap) -> Result<()> {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:307-307](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::CompactFragReuseIndex` | `pub struct CompactFragReuseIndex {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:318-318](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::CompactFragReuseIndex::uuid` | `pub uuid: Uuid,` | public | [rust/lance-table/src/system_index/frag_reuse.rs:319-319](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::CompactFragReuseIndex::details` | `pub details: FragReuseIndexDetails,` | public | [rust/lance-table/src/system_index/frag_reuse.rs:321-321](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<CompactFragReuseIndex as DeepSizeOf>` | `impl DeepSizeOf for CompactFragReuseIndex {` | public trait implementation | [rust/lance-table/src/system_index/frag_reuse.rs:324-324](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::<CompactFragReuseIndex as DeepSizeOf>::deep_size_of_children` | `fn deep_size_of_children(&self, cx: &mut Context) -> usize {` | public trait method | [rust/lance-table/src/system_index/frag_reuse.rs:325-325](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::CompactFragReuseIndex::from_row_id_maps` | `pub fn from_row_id_maps(         uuid: Uuid,         row_id_maps: Vec<HashMap<u64, Option<u64>>>,         details: FragReuseIndexDetails,     ) -> Self {` | public doc(hidden) | [rust/lance-table/src/system_index/frag_reuse.rs:332-336](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::CompactFragReuseIndex::try_new` | `pub fn try_new(uuid: Uuid, details: FragReuseIndexDetails) -> Result<Self> {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:348-348](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::CompactFragReuseIndex::row_addr_remap` | `pub fn row_addr_remap(&self) -> &RowAddrRemap {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:393-393](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::CompactFragReuseIndex::is_empty` | `pub fn is_empty(&self) -> bool {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:398-398](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::CompactFragReuseIndex::remap_row_id` | `pub fn remap_row_id(&self, row_id: u64) -> Option<u64> {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:402-402](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::CompactFragReuseIndex::remap_row_ids_in_place` | `pub fn remap_row_ids_in_place(&self, row_ids: &mut [Option<u64>]) {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:408-408](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::CompactFragReuseIndex::remap_row_addrs_tree_map` | `pub fn remap_row_addrs_tree_map(&self, row_addrs: &RowAddrTreeMap) -> RowAddrTreeMap {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:412-412](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::CompactFragReuseIndex::remap_row_ids_roaring_tree_map` | `pub fn remap_row_ids_roaring_tree_map(&self, row_ids: &RoaringTreemap) -> RoaringTreemap {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:419-419](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::CompactFragReuseIndex::remap_row_ids_record_batch` | `pub fn remap_row_ids_record_batch(         &self,         batch: RecordBatch,         row_id_idx: usize,     ) -> Result<RecordBatch> {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:428-432](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::CompactFragReuseIndex::remap_row_ids_array` | `pub fn remap_row_ids_array(&self, array: ArrayRef) -> PrimitiveArray<UInt64Type> {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:438-438](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |
| `lance_table::system_index::frag_reuse::CompactFragReuseIndex::remap_fragment_bitmap` | `pub fn remap_fragment_bitmap(&self, fragment_bitmap: &mut RoaringBitmap) -> Result<()> {` | public | [rust/lance-table/src/system_index/frag_reuse.rs:442-442](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) |

The ledger decodes0/1 only, distinguishes missing external data from inline content, rejects duplicate known mapping/content fields, validates digests and row conservation, then topologically orders retained transitions and builds producer/consumer maps. Unknown outer transition fields omit the entire transition and mark the ledger incomplete; the caller must preserve original Any separately if carrying history forward. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:108-315; rust/lance-table/src/system_index/frag_reuse/ledger.rs:381-543)



## MemWAL progress mutation dependency

The complete MemWAL metadata module is now covered in the [crate API catalog](rust-lance-table.md). update_mem_wal_index_compacted_sstables returns immediately for empty input; otherwise rejects duplicate proposed shard UUIDs, requires an existing reserved-name index, decodes a copy and requires each existing shard generation to increase strictly. All Result errors preserve the input slice; success replaces one entry in place with fresh UUID/timestamp/inline details. (rust/lance-table/src/system_index/mem_wal.rs:518-618)

Contextual manifest builder calls it in Update and UpdateMemWalState. The latter preserves fragments; the former puts rows and generation in the same candidate manifest by intent. Complete candidate-builder ordering is covered in the assembly supplement; complete publication/retry handling remains pending. (rust/lance-table/src/transaction/manifest_build.rs:1029-1037; rust/lance-table/src/transaction/manifest_build.rs:1610-1620)



## Complete manifest-builder handoff

[Manifest assembly supplement](rust-lance-table-manifest-build.md) now contains all exact method declarations,16-operation dispatch, ownership, config/error rules and contextual commit callers. The builder returns owned candidates after metadata validation. Publication follows in dataset IO and remains only partially analyzed. (rust/lance-table/src/transaction/manifest_build.rs:540-2025; rust/lance/src/io/commit.rs:1841-1932)

Excluded test declarations are retained in the [historical catalog](archive/rust-lance-table-transactions-excluded-declarations.md).
