> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/transaction/prepare.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `79c0cc00b0bd54dc97f0a665aecd0e11d8bccfea88b813fd0ecf8701018eceaa`. Reviewed physical lines: 1-100.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public in-memory attempt preparation containers and accessors, reexported by transaction. Preparation algorithm resides in manifest_build, not this module. (rust/lance-table/src/transaction/prepare.rs:1-100)

## Complete range analysis

### Lines 1-23

SPDX/docs distinguish original index list (for MemWAL comparison) from prepared list with invalidated coverage removed/pruned before manifest assembly. Docs say recreate per attempt from current manifest, keeping original unmodified and copying no files. Imports IndexMetadata, TaggedRewriteAssembly and Arc. These are documented lifecycle responsibilities, not actions in these declarations. (rust/lance-table/src/transaction/prepare.rs:1-23)

### Lines 24-43

FragReuseUpdate derives Debug/Clone/Default and is non_exhaustive. None is default, Rewrite owns Arc<TaggedRewriteAssembly>, Trim has no payload. Docs say unprepared tagged Rewrite/CreateIndex shapes are refused to avoid discarding concurrent history; Rewrite is assembled for current head, Trim derives from cleanup. Enum construction performs no enforcement; external matching needs a wildcard. Arc Clone shares assembly. (rust/lance-table/src/transaction/prepare.rs:24-43)

### Lines 44-59

PreparedIndices derives Debug/Clone and privately owns manifest_version:Option<u64>, original/prepared Vec<IndexMetadata>, frag_reuse:FragReuseUpdate. Docs promise preparation gates and stale-attempt rejection elsewhere. Private fields prevent external direct construction, but crate-visible new accepts unchecked inputs; no manifest identity/hash binding beyond optional numeric version. Clone duplicates Vec/metadata values and uses contained clone semantics. (rust/lance-table/src/transaction/prepare.rs:44-59)

### Lines 60-74

pub(crate) new takes all four values by ownership and simply stores them. No gate, list relation, timestamp or version check. The fully analyzed local producer Transaction::prepare_indices first performs gate/classification and optional lineage withdrawal (rust/lance-table/src/transaction/manifest_build.rs:474-522). Complete Dataset attempt orchestration remains pending. (rust/lance-table/src/transaction/prepare.rs:60-74)

### Lines 75-85

Public manifest_version returns copied Option<u64>, with None documented for creation. original returns immutable borrowed slice without cloning or mutation. Caller cannot replace private Vec via this method. (rust/lance-table/src/transaction/prepare.rs:75-85)

### Lines 86-96

Public prepared returns immutable borrowed prepared slice; frag_reuse_update borrows the stored enum. Neither computes preparation, compares versions nor performs IO. (rust/lance-table/src/transaction/prepare.rs:86-96)

### Lines 97-100

pub(crate) into_parts consumes wrapper, returning owned (original,prepared,frag_reuse), dropping manifest_version from returned data. The analyzed builder checks the attempt version and repeats the gate before consumption (rust/lance-table/src/transaction/manifest_build.rs:593-611). No tests, async, locking or unsafe in this file. (rust/lance-table/src/transaction/prepare.rs:97-100)

## Interaction and interpretation limits

All 100 lines read. Container contracts, local Transaction::prepare_indices/build_manifest validation, lineage derivation and table publication implementations are covered in the table module and its supplements. Complete Dataset conflict rebasing, retry/outcome recovery and cleanup remain pending; the local preparation wrapper alone does not establish those contracts.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! What a commit attempt settles about the index list before the manifest
    5 | //! is built.
    6 | //!
    7 | //! The commit layer decides index validity; the manifest builder assembles.
    8 | //! Once per attempt, against the manifest current at that attempt,
    9 | //! [`Transaction::prepare_indices`](crate::transaction::Transaction::prepare_indices)
   10 | //! reads the index list as it is, keeps that original list untouched, and
   11 | //! derives a prepared list on which an in-place column rewrite has already
   12 | //! withdrawn or pruned the coverage it invalidates (on a table with a tagged
   13 | //! fragment reuse history along the lineage, on any other table by fragment
   14 | //! id). The builder then applies the operation to the prepared list and
   15 | //! publishes only the final list; the original list is what MemWAL coverage
   16 | //! is compared against. Both lists are in-memory metadata of one attempt:
   17 | //! nothing is copied on disk and a retry prepares afresh from the list it
   18 | //! reads then.
   19 | 
   20 | use crate::format::IndexMetadata;
   21 | use crate::transaction::TaggedRewriteAssembly;
   22 | use std::sync::Arc;
   23 | 
   24 | /// What the commit path settled about the fragment reuse entry for one
   25 | /// attempt. In-memory only, like the rewrite intent it carries.
   26 | #[derive(Debug, Clone, Default)]
   27 | #[non_exhaustive]
   28 | pub enum FragReuseUpdate {
   29 |     /// Nothing was prepared for the entry. A tagged entry arriving on a
   30 |     /// `Rewrite`, or a `CreateIndex` touching a tagged entry, is refused:
   31 |     /// without the commit path's derivation such a shape is a pre-assembled
   32 |     /// snapshot that may splice away records a concurrent writer appended.
   33 |     #[default]
   34 |     None,
   35 |     /// A `Rewrite` on a tagged history: the entry the commit path assembled
   36 |     /// for THIS manifest, merging the records the operation's entry adds
   37 |     /// onto the current entry and validating them.
   38 |     Rewrite(Arc<TaggedRewriteAssembly>),
   39 |     /// A trim of the tagged entry derived by the reuse index cleanup against
   40 |     /// the current entry at commit time.
   41 |     Trim,
   42 | }
   43 | 
   44 | /// The index lists of one commit attempt: the list as read from the
   45 | /// manifest current at the attempt, the prepared list the builder starts
   46 | /// from, and what was settled about the fragment reuse entry.
   47 | ///
   48 | /// Only [`Transaction::prepare_indices`](crate::transaction::Transaction::prepare_indices)
   49 | /// builds one, so a value always went through the tagged-table write gate
   50 | /// and the unified withdrawal step; the manifest it was prepared against is
   51 | /// recorded so the builder refuses a result carried over to another attempt.
   52 | #[derive(Debug, Clone)]
   53 | pub struct PreparedIndices {
   54 |     manifest_version: Option<u64>,
   55 |     original: Vec<IndexMetadata>,
   56 |     prepared: Vec<IndexMetadata>,
   57 |     frag_reuse: FragReuseUpdate,
   58 | }
   59 | 
   60 | impl PreparedIndices {
   61 |     pub(crate) fn new(
   62 |         manifest_version: Option<u64>,
   63 |         original: Vec<IndexMetadata>,
   64 |         prepared: Vec<IndexMetadata>,
   65 |         frag_reuse: FragReuseUpdate,
   66 |     ) -> Self {
   67 |         Self {
   68 |             manifest_version,
   69 |             original,
   70 |             prepared,
   71 |             frag_reuse,
   72 |         }
   73 |     }
   74 | 
   75 |     /// The version of the manifest the lists were prepared against; `None`
   76 |     /// when the dataset is being created.
   77 |     pub fn manifest_version(&self) -> Option<u64> {
   78 |         self.manifest_version
   79 |     }
   80 | 
   81 |     /// The index list as read from the current manifest, never mutated.
   82 |     pub fn original(&self) -> &[IndexMetadata] {
   83 |         &self.original
   84 |     }
   85 | 
   86 |     /// The original list with the in-place rewrite step applied: the list
   87 |     /// the manifest builder starts from.
   88 |     pub fn prepared(&self) -> &[IndexMetadata] {
   89 |         &self.prepared
   90 |     }
   91 | 
   92 |     /// What the commit path settled about the fragment reuse entry.
   93 |     pub fn frag_reuse_update(&self) -> &FragReuseUpdate {
   94 |         &self.frag_reuse
   95 |     }
   96 | 
   97 |     pub(crate) fn into_parts(self) -> (Vec<IndexMetadata>, Vec<IndexMetadata>, FragReuseUpdate) {
   98 |         (self.original, self.prepared, self.frag_reuse)
   99 |     }
  100 | }
``````
