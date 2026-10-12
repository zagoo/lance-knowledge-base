> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/system_index/frag_reuse/lineage.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `8441ad41faee3881b99e7d0c78f20e182a59f542d1ec273c4d72af1eb6622313`. Reviewed physical lines: 1-140.

[Module](../../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Public optional tagged-history view, entry selection, conservative coverage membership and direct/transitive destination walks. Ledger type remains a separate pending dependency. (rust/lance-table/src/system_index/frag_reuse/lineage.rs:1-140)

## Complete range analysis

### Lines 1-22

SPDX/module docs describe shared tagged-history view for commit preparation, conflict resolution and index replay; consumer paths remain independently scoped. Imports FragReuseLedger, is_tagged, IndexMetadata, Error/Result, Roaring, HashSet and Arc. Synchronous metadata view with no IO/unsafe or local test module. (rust/lance-table/src/system_index/frag_reuse/lineage.rs:1-22)

### Lines 23-35

Public Debug TaggedLineage stores private optional cloned fragment bitmap and optional shared Arc ledger. Bitmap None means unknown coverage, distinct from unavailable ledger. Type does not expose fields publicly and does not derive Clone; Arc sharing is internal. Public module declared in rust/lance-table/src/system_index/frag_reuse.rs:6-6. (rust/lance-table/src/system_index/frag_reuse/lineage.rs:23-35)

### Lines 36-44

Public new clones entry.fragment_bitmap and filters supplied ledger out if it has unsupported transitions. Does not check entry is tagged, compare ledger identity with entry, or decode details. Unsupported ledger becomes None without error while bitmap still retained. (rust/lance-table/src/system_index/frag_reuse/lineage.rs:36-44)

### Lines 45-79

Public from_indices_with_ledger selects first is_tagged entry or returns Ok(None), ignoring supplied ledger when no entry exists. Supplied ledger bypasses inline decode. Otherwise requires index_details, calls FragReuseLedger::decode_inline(index_version,details), propagates decoding errors, and requires Some inline ledger; missing details or non-inline absent-prefetch case returns InvalidInput. Calls new, so unsupported-transition ledger can yield Some view with no usable ledger. No external fetch; caller must preload external history. Recognition implementation context is rust/lance-table/src/system_index/frag_reuse/metadata.rs:16-18. (rust/lance-table/src/system_index/frag_reuse/lineage.rs:45-79)

### Lines 80-94

has_ledger reports retained ledger presence. mentions(fragment) returns None if absent, otherwise Some(ledger.contains_fragment(fragment)); this is a history membership question, distinct from stored coverage and destination reachability. It does not prove fragment currently live. (rust/lance-table/src/system_index/frag_reuse/lineage.rs:80-94)

### Lines 95-105

contains(fragment) tests cloned entry bitmap; absent bitmap defaults true. Independent of ledger availability and mentions(). Thus unknown stored coverage is conservative membership, not known empty coverage. (rust/lance-table/src/system_index/frag_reuse/lineage.rs:95-105)

### Lines 106-117

immediate_destinations_of requires ledger. If ledger.consumer(source) absent, returns Some(empty Vec). Otherwise converts every destination fragment digest ID to u32, returning None on any overflow; preserves destination order and duplicates. No distinction in return type between no ledger and invalid ID. (rust/lance-table/src/system_index/frag_reuse/lineage.rs:106-117)

### Lines 118-140

destinations_of walks transitive consumers with pending stack, seen HashSet and reached Vec; includes retired intermediate destinations, deduplicates reached IDs, and follows branches in stack order. Every destination u64 must fit u32 or whole result None. Missing consumer ends branch; root not initially in seen, so a cycle can include source once before traversal terminates. Seen bounds repeat visits but does not validate ledger graph. Each call allocates/walks anew, no memoization. Missing ledger returns None; known leaf returns Some(empty). Full ledger validation/index semantics remain pending. (rust/lance-table/src/system_index/frag_reuse/lineage.rs:118-140)

## Interaction and interpretation limits

Every140 physical lines read. No local tests. FragReuseLedger decoding, graph validation and consumers need their own full analysis; no IO or runtime execution performed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! The lineage a tagged fragment reuse entry records, and the one question
    5 | //! every write path asks of it: may a segment keep the provenance it stores?
    6 | //!
    7 | //! A translating segment's bitmap names the fragments it was built from,
    8 | //! retired by later rewrites; its rows reach the live destinations by
    9 | //! following the recorded transitions. Three places must agree on which of
   10 | //! that provenance an in-place column rewrite invalidates: the manifest
   11 | //! build pruning committed indices, the conflict resolver rebasing a new
   12 | //! index over committed writes, and the replay that validates staged
   13 | //! segments. They all walk this type (`withdraw_rewritten_coverage`).
   14 | 
   15 | use super::ledger::FragReuseLedger;
   16 | use super::metadata::is_tagged;
   17 | use crate::format::IndexMetadata;
   18 | use lance_core::{Error, Result};
   19 | use roaring::RoaringBitmap;
   20 | use std::collections::HashSet;
   21 | use std::sync::Arc;
   22 | 
   23 | /// The tagged entry's recorded lineage plus, when it can be walked, the
   24 | /// transitions themselves.
   25 | #[derive(Debug)]
   26 | pub struct TaggedLineage {
   27 |     /// The entry's bitmap: every source and destination of every transition
   28 |     /// plus the coverage it inherited. `None` is unknown, not empty.
   29 |     fragments: Option<RoaringBitmap>,
   30 |     /// The decoded history; `None` only when a caller built the lineage
   31 |     /// without one (records this build cannot interpret count as none).
   32 |     /// Without it every answer is the conservative one.
   33 |     ledger: Option<Arc<FragReuseLedger>>,
   34 | }
   35 | 
   36 | impl TaggedLineage {
   37 |     /// The lineage of `entry`, walked through `ledger` when one is given.
   38 |     pub fn new(entry: &IndexMetadata, ledger: Option<Arc<FragReuseLedger>>) -> Self {
   39 |         Self {
   40 |             fragments: entry.fragment_bitmap.clone(),
   41 |             ledger: ledger.filter(|ledger| !ledger.has_unsupported_transitions()),
   42 |         }
   43 |     }
   44 | 
   45 |     /// The lineage of the tagged entry among `indices`, or `None` on a table
   46 |     /// without one. The history is `ledger` when the caller supplied it (the
   47 |     /// commit path decodes it once per attempt), else decoded from the
   48 |     /// entry's inline details. An undecodable history is an error, and so is
   49 |     /// an external one nobody read: a commit must not guess at the lineage.
   50 |     pub fn from_indices_with_ledger(
   51 |         indices: &[IndexMetadata],
   52 |         ledger: Option<Arc<FragReuseLedger>>,
   53 |     ) -> Result<Option<Self>> {
   54 |         let Some(entry) = indices.iter().find(|index| is_tagged(index)) else {
   55 |             return Ok(None);
   56 |         };
   57 |         let ledger = match ledger {
   58 |             Some(ledger) => ledger,
   59 |             None => {
   60 |                 let details = entry.index_details.as_ref().ok_or_else(|| {
   61 |                     Error::invalid_input(
   62 |                         "the tagged fragment reuse entry carries no details; its history \
   63 |                          cannot be read",
   64 |                     )
   65 |                 })?;
   66 |                 FragReuseLedger::decode_inline(entry.index_version, details)?
   67 |                     .map(Arc::new)
   68 |                     .ok_or_else(|| {
   69 |                         Error::invalid_input(
   70 |                             "the tagged fragment reuse history is stored externally and was \
   71 |                              not supplied to the manifest build; commit through the dataset \
   72 |                              so the history is decoded first",
   73 |                         )
   74 |                     })?
   75 |             }
   76 |         };
   77 |         Ok(Some(Self::new(entry, Some(ledger))))
   78 |     }
   79 | 
   80 |     /// Whether the transitions can be walked (`destinations_of` answers).
   81 |     pub fn has_ledger(&self) -> bool {
   82 |         self.ledger.is_some()
   83 |     }
   84 | 
   85 |     /// Whether the walkable history mentions `fragment` as a source or a
   86 |     /// destination of some transition: the reader translates a segment
   87 |     /// whose bitmap names such a fragment instead of loading it as it is.
   88 |     /// `None` when the history cannot be walked.
   89 |     pub fn mentions(&self, fragment: u32) -> Option<bool> {
   90 |         self.ledger
   91 |             .as_ref()
   92 |             .map(|ledger| ledger.contains_fragment(fragment))
   93 |     }
   94 | 
   95 |     /// Whether `fragment` is on the recorded lineage. Unknown lineage is not
   96 |     /// empty lineage: without a bitmap every fragment may be on it.
   97 |     pub fn contains(&self, fragment: u32) -> bool {
   98 |         self.fragments
   99 |             .as_ref()
  100 |             .is_none_or(|fragments| fragments.contains(fragment))
  101 |     }
  102 | 
  103 |     /// The fragments the transition consuming `source` produced: one hop.
  104 |     /// `None` when the history cannot be walked; empty when no transition
  105 |     /// consumed `source`.
  106 |     pub fn immediate_destinations_of(&self, source: u32) -> Option<Vec<u32>> {
  107 |         let ledger = self.ledger.as_ref()?;
  108 |         let Some(position) = ledger.consumer(source) else {
  109 |             return Some(Vec::new());
  110 |         };
  111 |         ledger.transitions()[position]
  112 |             .destinations()
  113 |             .iter()
  114 |             .map(|digest| u32::try_from(digest.id).ok())
  115 |             .collect()
  116 |     }
  117 | 
  118 |     /// Every fragment the rows of `source` were moved into, following the
  119 |     /// transitions transitively (retired intermediates included, in walk
  120 |     /// order). `None` when the history cannot be walked.
  121 |     pub fn destinations_of(&self, source: u32) -> Option<Vec<u32>> {
  122 |         let ledger = self.ledger.as_ref()?;
  123 |         let mut reached = Vec::new();
  124 |         let mut seen = HashSet::new();
  125 |         let mut pending = vec![source];
  126 |         while let Some(fragment) = pending.pop() {
  127 |             let Some(position) = ledger.consumer(fragment) else {
  128 |                 continue;
  129 |             };
  130 |             for digest in ledger.transitions()[position].destinations() {
  131 |                 let destination = u32::try_from(digest.id).ok()?;
  132 |                 if seen.insert(destination) {
  133 |                     reached.push(destination);
  134 |                     pending.push(destination);
  135 |                 }
  136 |             }
  137 |         }
  138 |         Some(reached)
  139 |     }
  140 | }
``````
