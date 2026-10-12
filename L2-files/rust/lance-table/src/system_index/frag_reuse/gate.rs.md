> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/system_index/frag_reuse/gate.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `4193233eba050743f45c4cf5d39f7688d3fb1f9c41b12ae156f8550fb80b2359`. Reviewed physical lines: 1-622.

[Module](../../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Public six-reason Admission enum and ordered exhaustive operation classifier, plus45-case matrix and one migration test. Gate admission relies on caller preparation rather than proving final commit safety. (rust/lance-table/src/system_index/frag_reuse/gate.rs:1-622)

## Complete range analysis

### Lines 1-20

SPDX/module docs claim every commit entrance funnels through prepare_indices and builder rechecks classify. Contextual prepare/build calls are observed, but full global entrance/retry proof remains pending. Imports reserved name, tagged predicates, metadata, FragReuseUpdate/Operation, errors and Roaring. Classifier is public, synchronous, pure over borrowed inputs, with no IO, mutation or unsafe. (rust/lance-table/src/system_index/frag_reuse/gate.rs:1-20)

### Lines 21-39

Public Admission derives Debug/Clone/Copy/PartialEq/Eq, with six reasons: Untagged, AppendsTransitions, RewritesUncoveredFragments, MovesNoRows, RestoresManifest, MaintainsUserIndices. Variant documentation is explanatory, not an effect proof: MovesNoRows prose says no column rewrite, while classifier admits Update/Merge/DataReplacement in-place rewrites below. Untagged describes absence of a tagged entry, not necessarily absence of sticky manifest flag. (rust/lance-table/src/system_index/frag_reuse/gate.rs:21-39)

### Lines 40-60

Public classify takes operation, optional current manifest, current index slice, settled FragReuseUpdate and optional migration_next_row_id. Returns Result<Admission>. Docs distinguish malformed intent InvalidInput versus unsupported tagged shape NotSupported. Comments explain why preassembled tagged snapshots could erase concurrent appended records; actual assembly/conservation/ledger validation is a separate caller responsibility, not performed here. (rust/lance-table/src/system_index/frag_reuse/gate.rs:40-60)

### Lines 61-76

appends_transitions means only Operation::Rewrite plus FragReuseUpdate::Rewrite, without inspecting assembly contents. Any Rewrite carrying Some is_tagged transient entry without that marker returns InvalidInput before table-state checks, even on an untagged table or absent manifest. Supplied marker permits this shape to proceed; there is no entry/assembly equality or lineage validation in this function. (rust/lance-table/src/system_index/frag_reuse/gate.rs:61-76)

### Lines 77-112

replaces_entry means Rewrite with any Some transient entry and no assembly marker. If no current is_tagged entry: reject replacement only when provided manifest uses tagged format by sticky flag or reserved entry; otherwise return Untagged immediately. Initial malformed-tagged check still precedes this. Sticky-flag-only tables therefore return Untagged for ordinary operations, including migration-marked ones; a v0 snapshot replacement on such table returns InvalidInput. Absence of manifest can bypass the sticky test. (rust/lance-table/src/system_index/frag_reuse/gate.rs:77-112)

### Lines 113-127

With current tagged entry, appends_transitions returns AppendsTransitions before migration check and without inspecting groups, rewritten indices or assembly payload. Comments introduce separate uncovered rewrite escape: existing bitmap provenance must be unaffected, unknown/future histories are conservative, oversized fragment IDs cannot appear in u32 bitmaps. Comments say empty rewrites refused; actual check below only requires outer groups Vec nonempty. (rust/lance-table/src/system_index/frag_reuse/gate.rs:113-127)

### Lines 128-156

Bare rewrite qualifies only with transient entry None, rewritten_indices empty, groups nonempty and every reserved-name entry version0 or1. Collect old fragment IDs via checked u64->u32, silently omit overflowing IDs. Every current index, not just FRI/user indices with fields, must have Some bitmap disjoint from collected IDs; None always refuses this escape even if collected bitmap empty. Nonempty groups whose old lists are all empty can qualify; new fragments and row conservation are not examined. Known future/negative FRI versions reject escape. Returns RewritesUncoveredFragments before migration check. (rust/lance-table/src/system_index/frag_reuse/gate.rs:128-156)

### Lines 157-168

After earlier accepted branches, any Some migration_next_row_id, including0 and regardless of operation kind, yields NotSupported with stable-row-ID migration message and Trim the history first advice. It checks marker presence, not current stable-row-ID mode or actual row addresses. Therefore appending-transition/uncovered rewrites and no-tagged-entry paths bypass this check by ordering; valid caller-generated migration shapes still need full analysis. (rust/lance-table/src/system_index/frag_reuse/gate.rs:157-168)

### Lines 169-195

Comments explain accepted in-place rewrites rely on shared preparation invalidation and eventual scan/rebuild; these effects are not performed by classify. CreateIndex is accepted as MaintainsUserIndices only when every new and removed entry has name != reserved FRI name; empty lists pass. Name test ignores type URL/version/UUID and no mutation occurs. The earlier migration check wins over this acceptance. (rust/lance-table/src/system_index/frag_reuse/gate.rs:169-195)

### Lines 196-225

Exhaustive final Operation match: Append, ReserveFragments, Delete, Update, UpdateConfig, Overwrite, Project, Merge and DataReplacement return MovesNoRows; Restore returns RestoresManifest. Remaining Rewrite, reserved-name CreateIndex, UpdateMemWalState, DataOverlay, Clone and UpdateBases return generic NotSupported with upgrade advice. Payload validity is not checked here and admission name is not a guarantee of no physical rewriting. Unknown future enum variants require code update because match exhaustive. (rust/lance-table/src/system_index/frag_reuse/gate.rs:196-225)

### Lines 226-251

cfg(test) imports flags, BasePath/DataFile/Fragment, shared fixtures, overlay/replacement/rewrite groups, exact V2_0, HashMap/Arc. Private Copy/Debug/Eq Table has four states: Untagged, Tagged, TaggedWithTranslatingIndex and TaggedWithDirectIndex. Docs label source5->destination0 provenance; fixtures below carry bitmap metadata without real transition payload. (rust/lance-table/src/system_index/frag_reuse/gate.rs:226-251)

### Lines 252-281

table fixture replaces fragments with fragment0 field0 in a.lance V2_0. Tagged states set both capability bits and reserved entry fields empty/bitmap0,5. Translating user segment covers5; direct user segment uses shared fixture default bitmap. Return manifest and indices; no IO, transition validation or actual indexing. (rust/lance-table/src/system_index/frag_reuse/gate.rs:252-281)

### Lines 282-307

update fixture obtains an Update from shared transaction helper, destructures with unreachable fallback, replaces updated fragments with0 and modified fields supplied, leaving other helper defaults. rewrite fixture has one old requested ID -> new10 group, no rewritten indices and optional transient entry. Neither carries actual file/row data. (rust/lance-table/src/system_index/frag_reuse/gate.rs:282-307)

### Lines 308-332

appended_entry uses reserved-name sample metadata and clears fields. frag_reuse_for returns Rewrite(Arc<TaggedRewriteAssembly>) only for exact kind rewrite_appends_transitions; entry from helper, base_entry_version None, reordered_sources empty. All other kind strings yield None. This bypasses real commit assembly, intentionally testing classifier marker acceptance rather than ledger validity. (rust/lance-table/src/system_index/frag_reuse/gate.rs:308-332)

### Lines 333-363

sample string dispatch builds Append fragment1; Delete ID0 predicate true; Overwrite fragment0/current schema/no config/bases; ordinary CreateIndex new_idx; bare covered0/uncovered7; assembled tagged rewrite; v0 snapshot by setting version0; malformed tagged snapshot. Unknown string ultimately unreachable. These fixture names distinguish gate paths, not complete valid dataset operations. (rust/lance-table/src/system_index/frag_reuse/gate.rs:333-363)

### Lines 364-398

DataReplacement fixture swaps fragment0 field0 to b.lance V2_0; DataOverlay adds one shared field0/version1 overlay. merge_new_column actually clones current fragments/schema unchanged; its name is broader than payload. merge_rewrites_column uses b.lance field0 with unchanged schema and preserves_nullability true. Classifier does not inspect column identity in either case. (rust/lance-table/src/system_index/frag_reuse/gate.rs:364-398)

### Lines 399-435

Remaining sample arms cover Restore1, ReserveFragments2, three Update modified-field lists empty/0/1, Project same schema, all-None/empty UpdateConfig, empty UpdateMemWalState, shallow Clone memory://source version1, and UpdateBases id1/nameNone/nonroot memory://base. Every Operation variant has a sample; wildcard panics for unrecognized fixture name. (rust/lance-table/src/system_index/frag_reuse/gate.rs:399-435)

### Lines 436-451

Private Verdict has Admit(Admission), NotSupported and InvalidInput with Debug/Clone/Copy/Eq. verdict maps only these Result/error variants; any other Error panics with diagnostic. It deliberately collapses error payloads so matrix tests assert kind/reason without message text. (rust/lance-table/src/system_index/frag_reuse/gate.rs:436-451)

### Lines 452-502

rstest matrix first18 cases cover all16 Operation variants on Untagged, with extra Rewrite shapes; ordinary operations return Untagged and malformed tagged snapshot InvalidInput. Appended-transition and uncovered shape are not independently sampled in this state. Comment Every Operation against every table state exceeds literal matrix: combinations are selected, not a full Cartesian product. (rust/lance-table/src/system_index/frag_reuse/gate.rs:452-502)

### Lines 503-555

Tagged matrix first subset asserts MovesNoRows for append/delete/overwrite, MaintainsUserIndices for ordinary creation, NotSupported bare covered/v0 snapshot, RewritesUncoveredFragments bare7, AppendsTransitions assembled marker, InvalidInput tagged snapshot. DataReplacement accepted with no user/direct/translating index, DataOverlay refused, Merge no-op/direct/translating cases accepted. No reserved-name CreateIndex case here. (rust/lance-table/src/system_index/frag_reuse/gate.rs:503-555)

### Lines 556-586

Remaining Tagged cases accept Restore, reservation, Update with row/column/unindexed-field shapes, Project/config; reject MemWAL, Clone and bases. Matrix totals45 cases across four states, heavily concentrating on Untagged/Tagged with selected user-index states, not every variant-state pair. Unknown bitmaps, future FRI versions, empty inner groups, overflow IDs and sticky-flag-only replacement are not covered locally. (rust/lance-table/src/system_index/frag_reuse/gate.rs:556-586)

### Lines 587-603

every_operation_has_a_verdict builds fixture state/operation/marker, calls classify with Some manifest and migration None, maps Verdict, asserts expected with kind/state. This cannot validate assembly, index withdrawal, storage effects or integration ordering. All45 cases belong to one parameterized test function. (rust/lance-table/src/system_index/frag_reuse/gate.rs:587-603)

### Lines 604-622

Separate migration test calls Merge sample on Tagged table with FragReuseUpdate::None and Some(100), expects NotSupported variant and message containing stable row id migration. It does not test Some(0), alternate operations or early-acceptance branches. Total gate test functions2, instantiated cases46. No tests run. (rust/lance-table/src/system_index/frag_reuse/gate.rs:604-622)

## Interaction and interpretation limits

All622 physical lines read in three bounded chunks. Exact branch order is captured including early returns before migration guard. Full transition assembly, ledger validation, restore/publication/retry and supported-reader behavior remain pending; no execution or mutation performed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! The write gate of a table carrying a tagged fragment reuse history.
    5 | //!
    6 | //! Every commit entrance (`CommitBuilder`, `apply_commit`, detached commits,
    7 | //! retries) funnels through `Transaction::prepare_indices`, which runs
    8 | //! [`classify`] once per attempt before anything is derived from the index
    9 | //! list (and the builder runs it again as its own chokepoint). The
   10 | //! classifier names why an operation is admitted, so that every `Operation`
   11 | //! variant has a stated verdict for every table state, and refuses with a
   12 | //! reason that says what to do instead.
   13 | 
   14 | use super::FRAG_REUSE_INDEX_NAME;
   15 | use super::metadata::{is_tagged, uses_tagged_fri};
   16 | use crate::format::{IndexMetadata, Manifest};
   17 | use crate::transaction::{FragReuseUpdate, Operation};
   18 | use lance_core::{Error, Result};
   19 | use roaring::RoaringBitmap;
   20 | 
   21 | /// Why the gate lets an operation through.
   22 | #[derive(Debug, Clone, Copy, PartialEq, Eq)]
   23 | pub enum Admission {
   24 |     /// No tagged entry: the operation is the table's ordinary business.
   25 |     Untagged,
   26 |     /// A rewrite appending transitions: the history's own maintenance.
   27 |     AppendsTransitions,
   28 |     /// A bare rewrite of fragments no index, the entry included, covers.
   29 |     RewritesUncoveredFragments,
   30 |     /// Moves no row and rewrites no column: deletion vectors, new
   31 |     /// fragments, the schema, the config, or the whole table.
   32 |     MovesNoRows,
   33 |     /// Restore copies an earlier manifest whole; it never reaches
   34 |     /// `build_manifest`, classified here so the table is complete.
   35 |     RestoresManifest,
   36 |     /// Creates, replaces or drops user indices; the entry is untouched.
   37 |     MaintainsUserIndices,
   38 | }
   39 | 
   40 | /// Classify `operation` against the table's current state.
   41 | ///
   42 | /// `frag_reuse` is what the commit path settled about the entry for this
   43 | /// attempt; `migration_next_row_id` marks the stable row id migration.
   44 | /// `Err` refuses the commit: `InvalidInput` for a malformed intent, or
   45 | /// `NotSupported` for a shape a tagged table does not admit.
   46 | pub fn classify(
   47 |     operation: &Operation,
   48 |     current_manifest: Option<&Manifest>,
   49 |     current_indices: &[IndexMetadata],
   50 |     frag_reuse: &FragReuseUpdate,
   51 |     migration_next_row_id: Option<u64>,
   52 | ) -> Result<Admission> {
   53 |     // A tagged entry may only reach the manifest through the commit path's
   54 |     // assembly, which merges the records the operation's entry adds onto
   55 |     // the CURRENT entry at every attempt and validates them; the assembly
   56 |     // rides in `FragReuseUpdate::Rewrite`. A tagged `frag_reuse_index`
   57 |     // arriving without one is a pre-assembled snapshot: it has bypassed
   58 |     // binding, conservation, folding and ledger validation, may be stale,
   59 |     // and splicing it would silently drop records a concurrent writer
   60 |     // appended.
   61 |     let appends_transitions = matches!(operation, Operation::Rewrite { .. })
   62 |         && matches!(frag_reuse, FragReuseUpdate::Rewrite(_));
   63 |     if let Operation::Rewrite {
   64 |         frag_reuse_index: Some(entry),
   65 |         ..
   66 |     } = operation
   67 |         && is_tagged(entry)
   68 |         && !appends_transitions
   69 |     {
   70 |         return Err(Error::invalid_input(
   71 |             "tagged fragment reuse entries must be assembled by the commit path, which \
   72 |              merges the records the entry adds onto the current entry; a pre-assembled \
   73 |              tagged snapshot bypasses validation and may splice away concurrent records",
   74 |         ));
   75 |     }
   76 | 
   77 |     let replaces_entry = matches!(
   78 |         operation,
   79 |         Operation::Rewrite {
   80 |             frag_reuse_index: Some(_),
   81 |             ..
   82 |         }
   83 |     ) && !appends_transitions;
   84 |     if !current_indices.iter().any(is_tagged) {
   85 |         // The sticky flag is the final authority on the record form
   86 |         // (`uses_tagged_fri`): once a manifest carries
   87 |         // FLAG_FRAGMENT_REUSE_INDEX every fragment reuse write is tagged,
   88 |         // even after a trim removed a fully drained entry. A v0 snapshot
   89 |         // would silently downgrade the table back to whole-history
   90 |         // replacement; the commit path converts a stale v0 intent into
   91 |         // transitions before this point (`finish_rewrite`), so only a
   92 |         // writer that skipped that conversion arrives here.
   93 |         if replaces_entry
   94 |             && current_manifest.is_some_and(|manifest| {
   95 |                 uses_tagged_fri(
   96 |                     manifest,
   97 |                     current_indices
   98 |                         .iter()
   99 |                         .find(|index| index.name == FRAG_REUSE_INDEX_NAME),
  100 |                 )
  101 |             })
  102 |         {
  103 |             return Err(Error::invalid_input(
  104 |                 "a v0 fragment reuse snapshot cannot be published onto a table using \
  105 |                  the tagged fragment reuse format: the sticky feature flag makes the \
  106 |                  tagged format permanent, even after a drained entry is trimmed away, \
  107 |                  so the rewrite must append transitions instead",
  108 |             ));
  109 |         }
  110 |         return Ok(Admission::Untagged);
  111 |     }
  112 | 
  113 |     // The history's own maintenance operation.
  114 |     if appends_transitions {
  115 |         return Ok(Admission::AppendsTransitions);
  116 |     }
  117 | 
  118 |     // A rewrite that carries neither an entry nor transition intent is still
  119 |     // safe when no current index, the entry included (its bitmap holds the
  120 |     // recorded lineage), covers any rewritten fragment: it cannot invalidate
  121 |     // stored provenance or the lineage, and bitmap maintenance is a no-op for
  122 |     // fragments no bitmap contains. Deferred compaction of never-covered data
  123 |     // commits this shape instead of growing the history with untrimmable
  124 |     // transitions. Fragment ids beyond the row-address range can never appear
  125 |     // in an index bitmap, so they are uncovered by definition. Only histories
  126 |     // this writer understands (index_version 1) qualify: a future entry
  127 |     // version may change what its bitmap means. Empty rewrites stay refused.
  128 |     if let Operation::Rewrite {
  129 |         frag_reuse_index: None,
  130 |         rewritten_indices,
  131 |         groups,
  132 |     } = operation
  133 |         && rewritten_indices.is_empty()
  134 |         && !groups.is_empty()
  135 |         && current_indices
  136 |             .iter()
  137 |             .filter(|index| index.name == FRAG_REUSE_INDEX_NAME)
  138 |             .all(|index| matches!(index.index_version, 0 | 1))
  139 |     {
  140 |         let rewritten: RoaringBitmap = groups
  141 |             .iter()
  142 |             .flat_map(|group| group.old_fragments.iter())
  143 |             .filter_map(|fragment| u32::try_from(fragment.id).ok())
  144 |             .collect();
  145 |         // Unknown coverage is not empty coverage: without a bitmap the
  146 |         // entry could cover anything, so refuse.
  147 |         if current_indices.iter().all(|index| {
  148 |             index
  149 |                 .fragment_bitmap
  150 |                 .as_ref()
  151 |                 .is_some_and(|bitmap| bitmap.is_disjoint(&rewritten))
  152 |         }) {
  153 |             return Ok(Admission::RewritesUncoveredFragments);
  154 |         }
  155 |     }
  156 | 
  157 |     // A tagged history translates row ADDRESSES; stable row ids replace
  158 |     // them, so the migration (a `Merge` committed with
  159 |     // `migration_next_row_id`) is refused while an entry exists. The other
  160 |     // direction is refused where a transition is recorded.
  161 |     if migration_next_row_id.is_some() {
  162 |         return Err(Error::not_supported(
  163 |             "stable row id migration is not supported on a table with a tagged fragment \
  164 |              reuse history: tagged histories translate row addresses, which stable row ids \
  165 |              replace. Trim the history first",
  166 |         ));
  167 |     }
  168 | 
  169 |     // An in-place column rewrite (an update with `fields_modified`, that is
  170 |     // `MergeInsertWriteMode::RewriteColumns`; a merge that swaps a column's
  171 |     // data file, as `alter_columns` does; a data replacement) is admitted:
  172 |     // the commit preparation withdraws every affected segment's
  173 |     // contribution (`Transaction::withdraw_in_place_rewrites`, fed by
  174 |     // `Transaction::rewritten_physical_columns`), a whole transition's
  175 |     // sources for a translating segment, so the reader scans those rows
  176 |     // until `optimize_indices` rebuilds them.
  177 |     // Creating, replacing or dropping user indices leaves the tagged entry
  178 |     // untouched (it is carried through unchanged). An index built on a
  179 |     // tagged table covers live fragments directly; one built before a
  180 |     // rewrite and rebased across it by the conflict resolver lands with its
  181 |     // provenance and translates. Only a `CreateIndex` touching the entry
  182 |     // itself has no tagged semantics here.
  183 |     if let Operation::CreateIndex {
  184 |         new_indices,
  185 |         removed_indices,
  186 |         ..
  187 |     } = operation
  188 |         && new_indices
  189 |             .iter()
  190 |             .chain(removed_indices.iter())
  191 |             .all(|idx| idx.name != FRAG_REUSE_INDEX_NAME)
  192 |     {
  193 |         return Ok(Admission::MaintainsUserIndices);
  194 |     }
  195 | 
  196 |     match operation {
  197 |         // Deletion vectors, new fragments, the config, the schema
  198 |         // (`retain_relevant_indices` still drops an index on a removed
  199 |         // field) or the whole table (Overwrite discards every index, the
  200 |         // entry included; the sticky flag keeps the tagged record form).
  201 |         Operation::Append { .. }
  202 |         | Operation::ReserveFragments { .. }
  203 |         | Operation::Delete { .. }
  204 |         | Operation::Update { .. }
  205 |         | Operation::UpdateConfig { .. }
  206 |         | Operation::Overwrite { .. }
  207 |         | Operation::Project { .. }
  208 |         | Operation::Merge { .. }
  209 |         | Operation::DataReplacement { .. } => Ok(Admission::MovesNoRows),
  210 |         Operation::Restore { .. } => Ok(Admission::RestoresManifest),
  211 |         // A bare rewrite of covered fragments or a v0 snapshot would
  212 |         // misinterpret the history; MemWAL state, overlays, clones and base
  213 |         // changes have no tagged semantics yet. A CreateIndex reaching here
  214 |         // touches the entry itself.
  215 |         Operation::Rewrite { .. }
  216 |         | Operation::CreateIndex { .. }
  217 |         | Operation::UpdateMemWalState { .. }
  218 |         | Operation::DataOverlay { .. }
  219 |         | Operation::Clone { .. }
  220 |         | Operation::UpdateBases { .. } => Err(Error::not_supported(
  221 |             "Tagged FRI history maintenance is not implemented for this operation; upgrade to a writer supporting tagged histories",
  222 |         )),
  223 |     }
  224 | }
  225 | 
  226 | #[cfg(test)]
  227 | mod tests {
  228 |     use super::*;
  229 |     use crate::feature_flags::FLAG_FRAGMENT_REUSE_INDEX;
  230 |     use crate::format::{BasePath, DataFile, Fragment};
  231 |     use crate::transaction::test_support::{
  232 |         overlay_with_field, sample_index_metadata, sample_manifest,
  233 |     };
  234 |     use crate::transaction::{DataOverlayGroup, DataReplacementGroup, RewriteGroup};
  235 |     use lance_file::version::ConcreteFileVersion;
  236 |     use std::collections::HashMap;
  237 |     use std::sync::Arc;
  238 | 
  239 |     /// What the table looks like: fragment 0 carries field 0 in `a.lance`;
  240 |     /// a tagged table also has the entry (lineage {0, 5}: fragment 5 was
  241 |     /// rewritten into fragment 0) and, optionally, a user index on field 0.
  242 |     #[derive(Clone, Copy, Debug, PartialEq, Eq)]
  243 |     enum Table {
  244 |         Untagged,
  245 |         Tagged,
  246 |         /// A segment built from fragment 5, translating to fragment 0.
  247 |         TaggedWithTranslatingIndex,
  248 |         /// A segment built on fragment 0 directly.
  249 |         TaggedWithDirectIndex,
  250 |     }
  251 | 
  252 |     fn table(state: Table) -> (Manifest, Vec<IndexMetadata>) {
  253 |         let mut manifest = sample_manifest();
  254 |         manifest.fragments = Arc::new(vec![Fragment::new(0).with_file(
  255 |             "a.lance",
  256 |             vec![0],
  257 |             vec![0],
  258 |             ConcreteFileVersion::V2_0,
  259 |             None,
  260 |         )]);
  261 |         let mut indices = Vec::new();
  262 |         if state != Table::Untagged {
  263 |             manifest.reader_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
  264 |             manifest.writer_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
  265 |             let mut entry = sample_index_metadata(FRAG_REUSE_INDEX_NAME);
  266 |             entry.fields.clear();
  267 |             entry.fragment_bitmap = Some([0u32, 5].into_iter().collect());
  268 |             indices.push(entry);
  269 |         }
  270 |         match state {
  271 |             Table::TaggedWithTranslatingIndex => {
  272 |                 let mut segment = sample_index_metadata("id_idx");
  273 |                 segment.fragment_bitmap = Some([5u32].into_iter().collect());
  274 |                 indices.push(segment);
  275 |             }
  276 |             Table::TaggedWithDirectIndex => indices.push(sample_index_metadata("id_idx")),
  277 |             _ => {}
  278 |         }
  279 |         (manifest, indices)
  280 |     }
  281 | 
  282 |     fn update(fields_modified: Vec<u32>) -> Operation {
  283 |         let mut update = crate::transaction::test_support::update_txn(vec![]);
  284 |         let Operation::Update {
  285 |             updated_fragments,
  286 |             fields_modified: modified,
  287 |             ..
  288 |         } = &mut update.operation
  289 |         else {
  290 |             unreachable!()
  291 |         };
  292 |         *updated_fragments = vec![Fragment::new(0)];
  293 |         *modified = fields_modified;
  294 |         update.operation
  295 |     }
  296 | 
  297 |     fn rewrite(old: u64, frag_reuse_index: Option<IndexMetadata>) -> Operation {
  298 |         Operation::Rewrite {
  299 |             groups: vec![RewriteGroup {
  300 |                 old_fragments: vec![Fragment::new(old)],
  301 |                 new_fragments: vec![Fragment::new(10)],
  302 |             }],
  303 |             rewritten_indices: vec![],
  304 |             frag_reuse_index,
  305 |         }
  306 |     }
  307 | 
  308 |     /// The tagged entry a rewrite appending transitions carries: the same
  309 |     /// entry the commit path's assembly puts in the config for that case.
  310 |     fn appended_entry() -> IndexMetadata {
  311 |         let mut entry = sample_index_metadata(FRAG_REUSE_INDEX_NAME);
  312 |         entry.fields.clear();
  313 |         entry
  314 |     }
  315 | 
  316 |     /// What the commit path settled for the attempt:
  317 |     /// `rewrite_appends_transitions` is the one shape whose verdict depends
  318 |     /// on the commit path having assembled the entry.
  319 |     fn frag_reuse_for(kind: &str) -> FragReuseUpdate {
  320 |         if kind == "rewrite_appends_transitions" {
  321 |             FragReuseUpdate::Rewrite(std::sync::Arc::new(
  322 |                 crate::transaction::TaggedRewriteAssembly {
  323 |                     entry: appended_entry(),
  324 |                     base_entry_version: None,
  325 |                     reordered_sources: RoaringBitmap::new(),
  326 |                 },
  327 |             ))
  328 |         } else {
  329 |             FragReuseUpdate::None
  330 |         }
  331 |     }
  332 | 
  333 |     /// One sample per `Operation` variant (several for the variants whose
  334 |     /// verdict depends on their payload).
  335 |     fn sample(kind: &str, manifest: &Manifest) -> Operation {
  336 |         match kind {
  337 |             "append" => Operation::Append {
  338 |                 fragments: vec![Fragment::new(1)],
  339 |             },
  340 |             "delete" => Operation::Delete {
  341 |                 updated_fragments: vec![],
  342 |                 deleted_fragment_ids: vec![0],
  343 |                 predicate: "true".into(),
  344 |             },
  345 |             "overwrite" => Operation::Overwrite {
  346 |                 fragments: vec![Fragment::new(0)],
  347 |                 schema: manifest.schema.clone(),
  348 |                 config_upsert_values: None,
  349 |                 initial_bases: None,
  350 |             },
  351 |             "create_index" => Operation::CreateIndex {
  352 |                 new_indices: vec![sample_index_metadata("new_idx")],
  353 |                 removed_indices: vec![],
  354 |             },
  355 |             "rewrite_bare_covered" => rewrite(0, None),
  356 |             "rewrite_bare_uncovered" => rewrite(7, None),
  357 |             "rewrite_appends_transitions" => rewrite(0, Some(appended_entry())),
  358 |             "rewrite_v0_snapshot" => {
  359 |                 let mut entry = appended_entry();
  360 |                 entry.index_version = 0;
  361 |                 rewrite(0, Some(entry))
  362 |             }
  363 |             "rewrite_tagged_snapshot" => rewrite(0, Some(appended_entry())),
  364 |             "data_replacement" => Operation::DataReplacement {
  365 |                 replacements: vec![DataReplacementGroup(
  366 |                     0,
  367 |                     DataFile::new(
  368 |                         "b.lance",
  369 |                         vec![0],
  370 |                         vec![0],
  371 |                         ConcreteFileVersion::V2_0,
  372 |                         None,
  373 |                         None,
  374 |                     ),
  375 |                 )],
  376 |             },
  377 |             "data_overlay" => Operation::DataOverlay {
  378 |                 groups: vec![DataOverlayGroup {
  379 |                     fragment_id: 0,
  380 |                     overlays: vec![overlay_with_field(0, 1)],
  381 |                 }],
  382 |             },
  383 |             "merge_new_column" => Operation::Merge {
  384 |                 fragments: manifest.fragments.as_ref().clone(),
  385 |                 schema: manifest.schema.clone(),
  386 |                 preserves_nullability: true,
  387 |             },
  388 |             "merge_rewrites_column" => Operation::Merge {
  389 |                 fragments: vec![Fragment::new(0).with_file(
  390 |                     "b.lance",
  391 |                     vec![0],
  392 |                     vec![0],
  393 |                     ConcreteFileVersion::V2_0,
  394 |                     None,
  395 |                 )],
  396 |                 schema: manifest.schema.clone(),
  397 |                 preserves_nullability: true,
  398 |             },
  399 |             "restore" => Operation::Restore { version: 1 },
  400 |             "reserve_fragments" => Operation::ReserveFragments { num_fragments: 2 },
  401 |             "update_rewrites_rows" => update(vec![]),
  402 |             "update_rewrites_column" => update(vec![0]),
  403 |             "update_rewrites_unindexed_column" => update(vec![1]),
  404 |             "project" => Operation::Project {
  405 |                 schema: manifest.schema.clone(),
  406 |                 preserves_nullability: true,
  407 |             },
  408 |             "update_config" => Operation::UpdateConfig {
  409 |                 config_updates: None,
  410 |                 table_metadata_updates: None,
  411 |                 schema_metadata_updates: None,
  412 |                 field_metadata_updates: HashMap::new(),
  413 |             },
  414 |             "update_mem_wal_state" => Operation::UpdateMemWalState {
  415 |                 compacted_sstables: vec![],
  416 |             },
  417 |             "clone" => Operation::Clone {
  418 |                 is_shallow: true,
  419 |                 ref_name: None,
  420 |                 ref_version: 1,
  421 |                 ref_path: "memory://source".into(),
  422 |                 branch_name: None,
  423 |             },
  424 |             "update_bases" => Operation::UpdateBases {
  425 |                 new_bases: vec![BasePath {
  426 |                     id: 1,
  427 |                     name: None,
  428 |                     is_dataset_root: false,
  429 |                     path: "memory://base".into(),
  430 |                 }],
  431 |             },
  432 |             _ => unreachable!("{kind}"),
  433 |         }
  434 |     }
  435 | 
  436 |     #[derive(Debug, Clone, Copy, PartialEq, Eq)]
  437 |     enum Verdict {
  438 |         Admit(Admission),
  439 |         NotSupported,
  440 |         InvalidInput,
  441 |     }
  442 | 
  443 |     fn verdict(result: Result<Admission>) -> Verdict {
  444 |         match result {
  445 |             Ok(admission) => Verdict::Admit(admission),
  446 |             Err(Error::NotSupported { .. }) => Verdict::NotSupported,
  447 |             Err(Error::InvalidInput { .. }) => Verdict::InvalidInput,
  448 |             Err(other) => panic!("unexpected error kind: {other}"),
  449 |         }
  450 |     }
  451 | 
  452 |     /// Every `Operation` variant against every table state. A new variant
  453 |     /// must add its rows here; a new state must add its column.
  454 |     #[rstest::rstest]
  455 |     // Untagged tables: everything is ordinary business, except a tagged
  456 |     // snapshot, which is malformed anywhere.
  457 |     #[case("append", Table::Untagged, Verdict::Admit(Admission::Untagged))]
  458 |     #[case("delete", Table::Untagged, Verdict::Admit(Admission::Untagged))]
  459 |     #[case("overwrite", Table::Untagged, Verdict::Admit(Admission::Untagged))]
  460 |     #[case("create_index", Table::Untagged, Verdict::Admit(Admission::Untagged))]
  461 |     #[case(
  462 |         "rewrite_bare_covered",
  463 |         Table::Untagged,
  464 |         Verdict::Admit(Admission::Untagged)
  465 |     )]
  466 |     #[case(
  467 |         "rewrite_v0_snapshot",
  468 |         Table::Untagged,
  469 |         Verdict::Admit(Admission::Untagged)
  470 |     )]
  471 |     #[case("rewrite_tagged_snapshot", Table::Untagged, Verdict::InvalidInput)]
  472 |     #[case(
  473 |         "data_replacement",
  474 |         Table::Untagged,
  475 |         Verdict::Admit(Admission::Untagged)
  476 |     )]
  477 |     #[case("data_overlay", Table::Untagged, Verdict::Admit(Admission::Untagged))]
  478 |     #[case(
  479 |         "merge_rewrites_column",
  480 |         Table::Untagged,
  481 |         Verdict::Admit(Admission::Untagged)
  482 |     )]
  483 |     #[case("restore", Table::Untagged, Verdict::Admit(Admission::Untagged))]
  484 |     #[case(
  485 |         "reserve_fragments",
  486 |         Table::Untagged,
  487 |         Verdict::Admit(Admission::Untagged)
  488 |     )]
  489 |     #[case(
  490 |         "update_rewrites_column",
  491 |         Table::Untagged,
  492 |         Verdict::Admit(Admission::Untagged)
  493 |     )]
  494 |     #[case("project", Table::Untagged, Verdict::Admit(Admission::Untagged))]
  495 |     #[case("update_config", Table::Untagged, Verdict::Admit(Admission::Untagged))]
  496 |     #[case(
  497 |         "update_mem_wal_state",
  498 |         Table::Untagged,
  499 |         Verdict::Admit(Admission::Untagged)
  500 |     )]
  501 |     #[case("clone", Table::Untagged, Verdict::Admit(Admission::Untagged))]
  502 |     #[case("update_bases", Table::Untagged, Verdict::Admit(Admission::Untagged))]
  503 |     // Tagged tables.
  504 |     #[case("append", Table::Tagged, Verdict::Admit(Admission::MovesNoRows))]
  505 |     #[case("delete", Table::Tagged, Verdict::Admit(Admission::MovesNoRows))]
  506 |     #[case("overwrite", Table::Tagged, Verdict::Admit(Admission::MovesNoRows))]
  507 |     #[case(
  508 |         "create_index",
  509 |         Table::Tagged,
  510 |         Verdict::Admit(Admission::MaintainsUserIndices)
  511 |     )]
  512 |     #[case("rewrite_bare_covered", Table::Tagged, Verdict::NotSupported)]
  513 |     #[case(
  514 |         "rewrite_bare_uncovered",
  515 |         Table::Tagged,
  516 |         Verdict::Admit(Admission::RewritesUncoveredFragments)
  517 |     )]
  518 |     #[case(
  519 |         "rewrite_appends_transitions",
  520 |         Table::Tagged,
  521 |         Verdict::Admit(Admission::AppendsTransitions)
  522 |     )]
  523 |     #[case("rewrite_v0_snapshot", Table::Tagged, Verdict::NotSupported)]
  524 |     #[case("rewrite_tagged_snapshot", Table::Tagged, Verdict::InvalidInput)]
  525 |     #[case(
  526 |         "data_replacement",
  527 |         Table::Tagged,
  528 |         Verdict::Admit(Admission::MovesNoRows)
  529 |     )]
  530 |     #[case(
  531 |         "data_replacement",
  532 |         Table::TaggedWithDirectIndex,
  533 |         Verdict::Admit(Admission::MovesNoRows)
  534 |     )]
  535 |     #[case(
  536 |         "data_replacement",
  537 |         Table::TaggedWithTranslatingIndex,
  538 |         Verdict::Admit(Admission::MovesNoRows)
  539 |     )]
  540 |     #[case("data_overlay", Table::Tagged, Verdict::NotSupported)]
  541 |     #[case(
  542 |         "merge_new_column",
  543 |         Table::Tagged,
  544 |         Verdict::Admit(Admission::MovesNoRows)
  545 |     )]
  546 |     #[case(
  547 |         "merge_rewrites_column",
  548 |         Table::TaggedWithDirectIndex,
  549 |         Verdict::Admit(Admission::MovesNoRows)
  550 |     )]
  551 |     #[case(
  552 |         "merge_rewrites_column",
  553 |         Table::TaggedWithTranslatingIndex,
  554 |         Verdict::Admit(Admission::MovesNoRows)
  555 |     )]
  556 |     #[case("restore", Table::Tagged, Verdict::Admit(Admission::RestoresManifest))]
  557 |     #[case(
  558 |         "reserve_fragments",
  559 |         Table::Tagged,
  560 |         Verdict::Admit(Admission::MovesNoRows)
  561 |     )]
  562 |     #[case(
  563 |         "update_rewrites_rows",
  564 |         Table::TaggedWithTranslatingIndex,
  565 |         Verdict::Admit(Admission::MovesNoRows)
  566 |     )]
  567 |     #[case(
  568 |         "update_rewrites_column",
  569 |         Table::TaggedWithDirectIndex,
  570 |         Verdict::Admit(Admission::MovesNoRows)
  571 |     )]
  572 |     #[case(
  573 |         "update_rewrites_column",
  574 |         Table::TaggedWithTranslatingIndex,
  575 |         Verdict::Admit(Admission::MovesNoRows)
  576 |     )]
  577 |     #[case(
  578 |         "update_rewrites_unindexed_column",
  579 |         Table::TaggedWithTranslatingIndex,
  580 |         Verdict::Admit(Admission::MovesNoRows)
  581 |     )]
  582 |     #[case("project", Table::Tagged, Verdict::Admit(Admission::MovesNoRows))]
  583 |     #[case("update_config", Table::Tagged, Verdict::Admit(Admission::MovesNoRows))]
  584 |     #[case("update_mem_wal_state", Table::Tagged, Verdict::NotSupported)]
  585 |     #[case("clone", Table::Tagged, Verdict::NotSupported)]
  586 |     #[case("update_bases", Table::Tagged, Verdict::NotSupported)]
  587 |     fn every_operation_has_a_verdict(
  588 |         #[case] kind: &str,
  589 |         #[case] state: Table,
  590 |         #[case] expected: Verdict,
  591 |     ) {
  592 |         let (manifest, indices) = table(state);
  593 |         let operation = sample(kind, &manifest);
  594 |         let got = verdict(classify(
  595 |             &operation,
  596 |             Some(&manifest),
  597 |             &indices,
  598 |             &frag_reuse_for(kind),
  599 |             None,
  600 |         ));
  601 |         assert_eq!(got, expected, "{kind} on {state:?}");
  602 |     }
  603 | 
  604 |     /// The stable row id migration is a `Merge` with the activation marker.
  605 |     #[test]
  606 |     fn migration_is_refused_on_a_tagged_table() {
  607 |         let (manifest, indices) = table(Table::Tagged);
  608 |         let error = classify(
  609 |             &sample("merge_new_column", &manifest),
  610 |             Some(&manifest),
  611 |             &indices,
  612 |             &FragReuseUpdate::None,
  613 |             Some(100),
  614 |         )
  615 |         .unwrap_err();
  616 |         assert!(matches!(error, Error::NotSupported { .. }), "{error}");
  617 |         assert!(
  618 |             error.to_string().contains("stable row id migration"),
  619 |             "{error}"
  620 |         );
  621 |     }
  622 | }
``````
