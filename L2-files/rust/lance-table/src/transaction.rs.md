> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/transaction.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `725a108b4975a2dcce8bb6410ca57aa4aeaef170eb5b2d52e8c94ce66c3e1143`. Reviewed physical lines: 1-102.

[Module](../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public transaction facade, private implementation-module boundaries and public coverage/read-version types. No executable commit algorithm is defined here. (rust/lance-table/src/transaction.rs:1-102)

## Complete range analysis

### Lines 1-14

SPDX and module documentation describe incremental transactions as retryable manifest changes supporting concurrent-compatibility checks. The external specification link is documentation only; no network was used and the linked document is not presumed analyzed. (rust/lance-table/src/transaction.rs:1-14)

### Lines 15-29

ASCII responsibility map names builder, operation, update_map, validate, prepare, manifest_build, index_maintenance, row_version, conflicts and proto. It distinguishes transaction vocabulary, attempt preparation, manifest application, index effects, lineage, conflict decisions and persistence. The map documents architecture; complete behavior requires those implementations. (rust/lance-table/src/transaction.rs:15-29)

### Lines 30-43

Ten ordinary child modules are private. test_support is pub(crate) only under cfg(test); its pub functions do not form the release API. Module declaration order is not transaction execution order. (rust/lance-table/src/transaction.rs:30-43)

### Lines 44-56

Public reexports expose Transaction/TransactionBuilder; RANGE_SEGMENTS_CONFIG_KEY; all operation group/mode/offset types plus reordered_sources; FragReuseUpdate/PreparedIndices; writer-lineage predicate; UpdateMap/entry/translators; validate_operation. Import through lance_table::transaction, not inaccessible child modules. Reexported definitions keep their original contracts; no wrapper validation. (rust/lance-table/src/transaction.rs:44-56)

### Lines 57-69

Imports metadata, bitmap, ordered map and UUID. Public LogicalIndexSegments aliases BTreeMap<String,Vec<CoverageIdentity>>. Docs require non-system logical names and UUID-ordered physical segments, retaining coverage bitmaps because same UUID can survive pruning. The alias itself enforces neither filtering nor vector sorting; producer behavior belongs to the separately analyzed manifest builder. (rust/lance-table/src/transaction.rs:57-69)

### Lines 70-85

Public CoverageIdentity derives Debug/Clone/PartialEq/Eq and privately owns UUID plus Option<RoaringBitmap>. Equality compares both, including None versus Some(empty). Docs assume physical-content changes mint UUIDs; same-UUID bitmap changes affect row coverage, while migration-populated file/timestamp/details should not invalidate it. Type declaration cannot enforce that producer contract. External crates cannot directly construct fields. (rust/lance-table/src/transaction.rs:70-85)

### Lines 86-102

ReadVersionState<'a> derives Debug/Clone/Copy, publicly borrows manifest:&Manifest and indices:&[IndexMetadata] for one lifetime. Docs explain read-version coverage credit: covering all then-live fragments proves coverage of then-compacted SSTables, and fixed read_version survives rebase while recorded results can change with head. References share a lifetime but no runtime same-version/ownership verification is performed. No IO, locks, unsafe, mutation or tests in this facade. (rust/lance-table/src/transaction.rs:86-102)

## Interaction and interpretation limits

All102 lines read. Public routes are complete, not the reexported implementations. Contextual manifest_build.rs212-223 populates coverage identity, but full coverage derivation and commit orchestration remain pending. Definitions supply no executed proof of documented retry behavior.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Transaction definitions for updating datasets
    5 | //!
    6 | //! Prior to creating a new manifest, a transaction must be created representing
    7 | //! the changes being made to the dataset. By representing them as incremental
    8 | //! changes, we can detect whether concurrent operations are compatible with
    9 | //! one another. We can also rebuild manifests when retrying committing a
   10 | //! manifest.
   11 | //!
   12 | //! For more details please refer to the
   13 | //! [Transaction Specification](https://lance.org/format/table/transaction/#transaction-types).
   14 | //!
   15 | //! The work splits along these lines:
   16 | //!
   17 | //! ```text
   18 | //! builder            Transaction: an operation plus the version it was based on
   19 | //! operation          the vocabulary of changes an operation can describe
   20 | //! update_map         incremental edits to the manifest's string maps
   21 | //! validate           pre-commit checks against the manifest being replaced
   22 | //! prepare            what a commit attempt settles about the index list first
   23 | //! manifest_build     applying an operation to produce the next manifest
   24 | //! index_maintenance  how that narrows or drops index metadata
   25 | //! row_version        how it assigns row ids and per-row version metadata
   26 | //! conflicts          whether two operations collide, for the commit retry path
   27 | //! proto              the persisted protobuf encoding of all of the above
   28 | //! ```
   29 | 
   30 | mod builder;
   31 | mod conflicts;
   32 | mod index_maintenance;
   33 | mod manifest_build;
   34 | mod operation;
   35 | mod prepare;
   36 | mod proto;
   37 | mod row_version;
   38 | mod update_map;
   39 | mod validate;
   40 | 
   41 | #[cfg(test)]
   42 | pub(crate) mod test_support;
   43 | 
   44 | pub use builder::{Transaction, TransactionBuilder};
   45 | pub use manifest_build::RANGE_SEGMENTS_CONFIG_KEY;
   46 | pub use operation::{
   47 |     DataOverlayGroup, DataReplacementGroup, Operation, RewriteGroup, RewrittenIndex,
   48 |     TaggedRewriteAssembly, UpdateMode, UpdatedFragmentOffsets, reordered_sources,
   49 | };
   50 | pub use prepare::{FragReuseUpdate, PreparedIndices};
   51 | pub use row_version::has_writer_placed_lineage;
   52 | pub use update_map::{
   53 |     UpdateMap, UpdateMapEntry, translate_config_updates, translate_schema_metadata_updates,
   54 | };
   55 | pub use validate::validate_operation;
   56 | 
   57 | use crate::format::{IndexMetadata, Manifest};
   58 | use roaring::RoaringBitmap;
   59 | use std::collections::BTreeMap;
   60 | use uuid::Uuid;
   61 | 
   62 | /// Non-system logical index name -> its physical segments, ordered by UUID.
   63 | ///
   64 | /// Whole segment metadata rather than UUIDs alone: operations such as `Rewrite`
   65 | /// prune a segment's fragment bitmap while keeping its UUID, so a UUID-only
   66 | /// comparison would keep coverage for an index that no longer spans the same
   67 | /// base fragments.
   68 | pub type LogicalIndexSegments = BTreeMap<String, Vec<CoverageIdentity>>;
   69 | 
   70 | /// What one physical index segment contributes to coverage.
   71 | ///
   72 | /// Deliberately not the whole [`IndexMetadata`]. It rests on one contract:
   73 | /// changing an index's physical contents mints a new UUID. Of the mutations
   74 | /// sanctioned under an existing UUID, only the fragment bitmap changes which
   75 | /// rows the index answers for -- an `Update` prunes it in place, and
   76 | /// `migrate_indices` recalculates it -- so the UUID alone is not enough and the
   77 | /// bitmap has to be compared too. The rest of the metadata, file lists and
   78 | /// timestamps and inferred details, is filled in by migrations routinely;
   79 | /// comparing it would withdraw coverage for no reason.
   80 | #[derive(Debug, Clone, PartialEq, Eq)]
   81 | pub struct CoverageIdentity {
   82 |     uuid: Uuid,
   83 |     fragment_bitmap: Option<RoaringBitmap>,
   84 | }
   85 | 
   86 | /// The version a transaction read, as the coverage derivation needs it.
   87 | ///
   88 | /// An index covering every fragment live at this version holds every row
   89 | /// compaction had copied into the base table by then, so it is caught up to
   90 | /// that version's `compacted_sstables`. That is the only proof available:
   91 | /// nothing maps a compaction generation to the fragments its rows landed in.
   92 | ///
   93 | /// `read_version` is fixed for the life of a transaction and survives rebase,
   94 | /// so the credit a commit can prove is stable across attempts. The recorded
   95 | /// result may still differ between attempts, because a rebased attempt sees a
   96 | /// different head: other commits move the compacted generations and the
   97 | /// positions already recorded.
   98 | #[derive(Debug, Clone, Copy)]
   99 | pub struct ReadVersionState<'a> {
  100 |     pub manifest: &'a Manifest,
  101 |     pub indices: &'a [IndexMetadata],
  102 | }
``````
