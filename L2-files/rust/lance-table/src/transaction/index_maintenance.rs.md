> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/transaction/index_maintenance.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `7cc48b0da6fa69919754d3a12c21cc1078864e5fb7fe01628124231e22980912`. Reviewed physical lines: 1-1639.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Transaction index invalidation/retention and rewrite helpers;16 runtime methods plus30 local metadata tests. Public methods are reachable through Transaction despite private child module. (rust/lance-table/src/transaction/index_maintenance.rs:1-1639)

## Complete range analysis

### Lines 1-26

SPDX and module documentation frame index coverage/retention rules; its statement that every rule has a unit test is intent, not complete branch coverage. Imports overlay staleness, metadata, tagged lineage/name recognition, system-index classifier, Transaction operations, Schema/Error, Roaring, maps/sets and UUID. All runtime helpers here are synchronous metadata transformations without physical file IO or unsafe blocks. Logs do not delete index files. (rust/lance-table/src/transaction/index_maintenance.rs:1-26)

### Lines 27-58

Transaction::register_pure_rewrite_rows_update_frags_in_indices is pub(super). Empty pure-update IDs return Ok before examining anything. For each index, skip row-address-domain metadata, then any indexed field in the caller preservation-exclusion set, then unknown coverage. Indexed i32 IDs use checked u32 conversion followed by unwrap: negative IDs can panic unless an earlier short circuit skips them. Field-set name refers to values updated; preserving coverage is allowed only for indices disjoint from that set. (rust/lance-table/src/transaction/index_maintenance.rs:27-58)

### Lines 59-93

Require every original fragment ID in the stored bitmap; empty originals pass vacuously and u64 IDs cast to u32 unchecked. Compute overlay staleness over the entire caller-supplied original_overlaid_frags map, not an intersection with original IDs here. Any stale fragment prevents extension. Otherwise insert every pure-update ID using unchecked as u32 into the existing bitmap. Does not update version, UUID or files; duplicates deduplicate. Fallible staleness evaluation can return after earlier indices were already mutated. No explicit system-index exemption. (rust/lance-table/src/transaction/index_maintenance.rs:59-93)

### Lines 94-141

Public rewritten_physical_columns classifies Update only when fields_modified nonempty, yielding every updated fragment with a cloned field list, independent of update mode. Merge delegates to merge_rewritten_fields. DataReplacement combines DataFile.schema(schema).field_ids with raw new_file.fields, keeps nonnegative IDs, sorts/deduplicates, and preserves a pair even if fields empty. All other operations return empty. This computes invalidation metadata; it neither rewrites bytes nor validates target existence. (rust/lance-table/src/transaction/index_maintenance.rs:94-141)

### Lines 142-181

Public withdraw_in_place_rewrites returns immediately for empty pairs. With Some lineage, expands every rewritten field through schema descendants then calls withdraw_rewritten_coverage. With None, builds temporary Fragment::new(id) per pair and calls direct prune_updated_fields_from_indices; that route does not expand descendants, reason about retired provenance or retire empty segments. It is therefore distinct from directly calling withdraw_rewritten_coverage with None. (rust/lance-table/src/transaction/index_maintenance.rs:142-181)

### Lines 182-218

Private expand_rewritten_fields maps all pairs preserving fragment order. with_descendants always includes each input u32; if convertible to i32 and found in schema, traverses its children using an explicit stack. Negative child IDs are skipped as outputs but their descendants still visited. Missing/out-of-range fields stay as original IDs; output sorted/deduplicated. Repeated ancestor inputs can repeat traversal before deduplication; no memoization or recursion. (rust/lance-table/src/transaction/index_maintenance.rs:182-218)

### Lines 219-258

Withdrawal documentation explains stored source provenance versus live coverage, transitive destinations including retired intermediates, and preserving unknown bitmap metadata. It states that surviving live-only coverage outside history cannot be handled by the translating reader after retired-source withdrawal, motivating whole-segment clearing. Reader/query/cleanup implementations remain outside this file; this rationale is documented without asserting their complete execution behavior. Callers must pre-expand rewritten fields. (rust/lance-table/src/transaction/index_maintenance.rs:219-258)

### Lines 259-301

Public withdraw_rewritten_coverage skips system indices and unknown coverage, converts nonnegative indexed fields into a set, and computes retired sources once as stored bitmap minus live fragments. For each overlapping rewritten field set, checked u64->u32 fragment conversion failing skips that pair. Add a directly covered ID. For each retired source, known destinations containing rewrite ID withdraw source; known destinations not containing it (including empty) leave it; unavailable lineage/walk withdraws every retired source conservatively. It does not require rewritten ID to be live. Repeated per-source/per-rewrite graph walks allocate; no cache here. (rust/lance-table/src/transaction/index_maintenance.rs:259-301)

### Lines 302-350

Subtract union of direct and retired IDs. Only if a retired source was withdrawn and something remains, decide whether reader translation can continue: any remaining retired ID suffices, otherwise any lineage.mentions(id) true or unknown suffices. If all remainder is live and known unmentioned, warn, include all remainder in withdrawn set and clear bitmap. Empty result records UUID; warn logs counts. After all indices, retire_emptied_segments handles metadata retirement. No Result/rollback; failures such as allocation panic could leave partial changes. With None lineage, mentions defaults true, so live remainder survives conservative retired withdrawal. (rust/lance-table/src/transaction/index_maintenance.rs:302-350)

### Lines 351-394

Private retire_emptied_segments finds first matching metadata name for each emptied UUID and marks it removable only if a different UUID with same name has unknown or nonempty bitmap. Compute all removable IDs before retaining; retain removes every matching UUID and logs info. If every same-name segment is empty, all remain; this does not select one oldest definition. Assumes UUID uniqueness without validating it; duplicates can affect first-name lookup/removal. Repeated linear searches and temporary Vecs cost proportional to emptied segments times indices, plus membership scans. No index-file deletion. (rust/lance-table/src/transaction/index_maintenance.rs:351-394)

### Lines 395-422

Public prune_updated_fields_from_indices returns on empty field list, otherwise any exact indexed-field overlap with a HashSet of references causes every updated fragment ID (unchecked as u32) to be removed from known bitmap. i32->u32 unwrap occurs before bitmap-option test and can panic on negative indexed fields; prior indices may already be changed. No descendant expansion, system exemption, lineage, retirement, logging or Result. (rust/lance-table/src/transaction/index_maintenance.rs:395-422)

### Lines 423-436

Private fragment_field_paths maps each nonnegative base-file field ID to its path string; later duplicate field occurrences overwrite earlier ones. Excludes overlays, base_id, column mappings, versions and cached sizes. Returned strings borrow fragment files. This deliberately narrower identity is not the full physical-file comparison used in validation. (rust/lance-table/src/transaction/index_maintenance.rs:423-436)

### Lines 437-466

Public merge_rewritten_fields indexes previous fragments by ID (last duplicate wins), then walks proposed order including duplicates. Only field IDs present in both old and new base-file maps whose path strings differ count; newly added/dropped fields and new fragments do not. Sort changed field IDs and omit empty pairs. Changes only to base_id/version/column indices/overlays are invisible to this classifier. Complete merge physical validation has separate broader checks. (rust/lance-table/src/transaction/index_maintenance.rs:437-466)

### Lines 467-516

Pub(super) prune_overlay_stale_fields_from_indices computes per-group maximum committed_version per nonnegative raw overlay field ID over all old fragments. Coverage emptiness and row membership do not affect the maximum. If any exact index field has overlay version greater than index dataset_version, remove all new group IDs (unchecked u64->u32) from known bitmap. Equality remains fresh. No ancestry expansion, key-only distinction, system skip, logging or empty-segment retirement; every index.fields value participates. (rust/lance-table/src/transaction/index_maintenance.rs:467-516)

### Lines 517-554

Pub(crate) retain_relevant_indices first drops indices with missing schema field IDs unless is_system_index; empty fields pass all(). Groups remaining indices by name except reserved fragment-reuse name, cloning names. Builds live-fragment bitmap with unchecked u64->u32 casts. System exemption applies to missing-field pruning; name/coverage retention is a separate subsequent rule. No file IO. (rust/lance-table/src/transaction/index_maintenance.rs:517-554)

### Lines 555-625

If any remaining entry satisfies is_tagged, retain every grouped UUID including empty/retired coverage; policy uses tagged entry recognition, not manifest reader flags here. Otherwise unknown None coverage is always retained. For >1 known segment, compare effective coverage (stored bitmap intersect live IDs): if all empty, stable-sort by dataset_version and keep oldest, first input wins ties; if some nonempty, keep all nonempty and remove empty. With exactly one known segment, keep it even if empty, independently of unknown siblings. Finally keep reserved frag-reuse name or selected UUIDs. Stored bitmaps remain unchanged. UUID collisions can retain extra entries; MemWAL/system names except FRI still undergo coverage pruning. (rust/lance-table/src/transaction/index_maintenance.rs:555-625)

### Lines 626-656

Pub(super) ordered_rewrite_groups clones all groups when reordered sources absent. Otherwise count old IDs in source bitmap using unchecked u64->u32 casts: zero overlap keeps group, complete overlap omits group, partial overlap returns InvalidInput. Empty-old groups have zero overlap and survive; no check that destinations/mappings match. Input unchanged on error; output copies fragment vectors. (rust/lance-table/src/transaction/index_maintenance.rs:626-656)

### Lines 657-690

Pub(super) recalculate_fragment_bitmap clones old bitmap, then evaluates each group membership against original old bitmap, not progressively updated result. All old covered removes all old IDs and adds new IDs; partial covered errors; none covered does nothing, including empty-old group even though all() vacuously true. Uses unchecked u64->u32. Input unchanged on error; group overlap/order assumptions are not validated and new IDs from prior groups can interact with later removals. (rust/lance-table/src/transaction/index_maintenance.rs:657-690)

### Lines 691-731

Pub(super) handle_rewrite_indices rejects repeated old UUIDs before lookup, even if missing from current indices. Missing current UUID is skipped. Found index must have Some bitmap; recalculate may error before this index assignment. On success replaces bitmap, UUID and files with new_index_files (None clears old list), but does not assign RewrittenIndex.new_index_details or new_index_version and does not change dataset version. Earlier indices remain modified on later error; changed UUIDs affect subsequent lookups. Duplicate new UUIDs not rejected. (rust/lance-table/src/transaction/index_maintenance.rs:691-731)

### Lines 732-769

Pub(super) handle_rewrite_fragments processes groups in order and uses old_fragments[0] unchecked: empty old group panics. Missing first old ID returns CommitConflict with manifest version. Contiguity loop accesses final_fragments[start_pos+i] without bounds check, so matching prefix past vector end panics. First mismatch selects noncontiguous fallback; absent later old IDs need not trigger a conflict. _next_row_id parameter unused. No upfront atomic validation of all groups. (rust/lance-table/src/transaction/index_maintenance.rs:732-769)

### Lines 770-792

Clone new fragments through fragments_with_ids, which assigns IDs only to zero placeholders and increments caller counter; preassigned IDs remain. Contiguous group splices in place. Noncontiguous group removes all entries matching any old ID then appends replacements, changing order and tolerating absent later old IDs. No uniqueness validation or metadata restamping here. Prior groups/counter remain changed after later error/panic. Allocates replacement Vec and may repeatedly scan retained fragments. Contextual assignment is rust/lance-table/src/transaction/manifest_build.rs:126-140. (rust/lance-table/src/transaction/index_maintenance.rs:770-792)

### Lines 793-837

cfg(test) module imports parent internals, the shared overlay_with_field test helper and Uuid; the first test locally aliases fragment_reuse_index_details as pb_fri. Ordered-group fixture has old0/1->10 and old2->11. None retains both; reordered sources0/1 excludes first; mixed old1/2 group errors. Mapping payload is not needed for this helper. These are metadata unit tests, not row-address remap execution. (rust/lance-table/src/transaction/index_maintenance.rs:793-837)

### Lines 838-888

Fragment rewrite test starts IDs0..9; contiguous1/2 replaced by15/16 and noncontiguous5/8 replaced by zero placeholder assigned20. Counter advances21; final order asserted0,15,16,3,4,6,7,9,20. Empty metadata fragments suffice. Does not cover empty groups, truncated contiguous suffix, missing later old IDs or rollback. (rust/lance-table/src/transaction/index_maintenance.rs:838-888)

### Lines 889-925

Missing-field retention test removes field99 and keeps fields1/2. System test preserves reserved FRI and MemWAL entries despite field99, removes ordinary invalid index. These exercise schema-field exemption, not arbitrary system coverage sibling cases. (rust/lance-table/src/transaction/index_maintenance.rs:889-925)

### Lines 926-981

Tests preserve fragment-reuse entry and a sole empty scalar or vector definition. Each fixture uses explicit bitmap state and schema IDs. Empty coverage is intentionally not equivalent to absent definition. (rust/lance-table/src/transaction/index_maintenance.rs:926-981)

### Lines 982-1026

Tests keep sole nonempty scalar/vector indices and sole unknown None bitmap scalar/vector indices. They assert metadata count/name/bitmap presence as appropriate; do not load index data or measure query correctness. (rust/lance-table/src/transaction/index_maintenance.rs:982-1026)

### Lines 1027-1082

Unknown plus nonempty same-name sibling both survive. Separate scalar/vector all-empty multi-segment tests retain oldest dataset_version1. Versions differ, so stable-sort tie behavior is not covered. Unknown plus multiple empty known siblings is not directly tested here. (rust/lance-table/src/transaction/index_maintenance.rs:1027-1082)

### Lines 1083-1123

Mixed scalar empty/nonempty case keeps nonempty versions2/4; vector counterpart keeps version2. Uses live fragments to evaluate coverage, then checks retained versions. No tagged history in these cases. (rust/lance-table/src/transaction/index_maintenance.rs:1083-1123)

### Lines 1124-1178

Stored bitmap1/2/3/4 with live1/2 remains unchanged. Sole scalar/vector bitmap1/2/3 with live5/6 also survives, exercising single-definition retention despite no effective coverage. The former test comments discuss pruning but does not invoke multi-known-segment effective partitioning. (rust/lance-table/src/transaction/index_maintenance.rs:1124-1178)

### Lines 1179-1230

Different names are retained independently; empty indices Vec stays empty. Test named all_indices_removed actually retains both valid empty vector definitions (vec1 and vec2) while removing invalid-field metadata, so name overstates assertion. No disk cleanup tested. (rust/lance-table/src/transaction/index_maintenance.rs:1179-1230)

### Lines 1231-1290

Complex retention fixture has11 metadata entries across FRI and five names, mixed scalar/vector empties/live coverage and invalid field. Expects6: FRI, oldest idx_a1 and vec_b1, nonempty idx_c2/3, idx_d; invalid idx_e removed. Asserts per-name versions, not physical files or query output. (rust/lance-table/src/transaction/index_maintenance.rs:1231-1290)

### Lines 1291-1352

Missing rewritten-index test passes one RewrittenIndex absent from empty current list and no groups, expects Ok. Overlay test old fragment0 carries field1 overlay version5 into new7; index version2 loses7, equal version5 retains7, unrelated field2 retains7. Does not exercise descendant IDs, empty/sparse coverage or malformed negative index fields. (rust/lance-table/src/transaction/index_maintenance.rs:1291-1352)

### Lines 1353-1398

create_test_index generates random UUID, one field, empty covering_fields, chosen ScalarIndexDetails/VectorIndexDetails Any with empty value bytes, dataset version/bitmap from caller, index_version1 and optional metadata None. Legacy FRI helper builds system metadata then sets index_version0 to force untagged mode. These fixture type URLs classify metadata without valid physical index payloads. (rust/lance-table/src/transaction/index_maintenance.rs:1353-1398)

### Lines 1399-1432

Tagged-history test creates9 entries: FRI version1, retired and live idx_a segments, two retired vec_b segments, two empty idx_c definitions and invalid-field idx_e. Confirms FRI is_tagged, then retains8 entries—all except invalid field. Demonstrates tagged coverage retention does not bypass schema-field filtering. (rust/lance-table/src/transaction/index_maintenance.rs:1399-1432)

### Lines 1433-1474

create_system_index uses SystemIndexDetails type URL, random UUID, one arbitrary field, bitmap1/2 and version1. create_test_schema builds Arrow Int32 nonnullable field names then mutates generated IDs via repeated mut_field_by_id(i); collisions between requested IDs and later lookup IDs can retarget an earlier field. Tests rely on membership rather than position; fixture does not validate resulting schema. No production constructor behavior inferred from this helper. (rust/lance-table/src/transaction/index_maintenance.rs:1433-1474)

### Lines 1475-1498

Separate cfg(test) withdrawal module supplies segment helper from shared sample_index, field/bitmap override, inline lineage builder with double unwrap, and tagged history1/2->3->4 plus6->8. Unknown bitmap uses None. Helpers exercise metadata, not persisted files. (rust/lance-table/src/transaction/index_maintenance.rs:1475-1498)

### Lines 1499-1542

Withdrawal test rewriting live4 field0 removes retired sources1/2 from1/2/6, retaining6 and system entry unchanged. Next test1/2/9 clears all after retired-source withdrawal because surviving live9 is not mentioned by known history. Assert bitmap outcomes. (rust/lance-table/src/transaction/index_maintenance.rs:1499-1542)

### Lines 1543-1581

History-mentioned live8 remainder survives after1/2 withdrawal. Directly withdrawing only live4 from4/9 keeps9, because whole-segment fallback requires a retired source to have been withdrawn. Tests distinguish these two conditions. (rust/lance-table/src/transaction/index_maintenance.rs:1543-1581)

### Lines 1582-1622

Mixed retired intermediate3 and directlive4 both disappear. Separate fixture leaves unrelated retired6, index on unmodified field1 covering1/2, and field0 unknown None coverage unchanged. No local test verifies retirement with covered/unknown same-name siblings or descendant expansion. (rust/lance-table/src/transaction/index_maintenance.rs:1582-1622)

### Lines 1623-1639

Without a walkable ledger, rewrite4 withdraws retired6 conservatively but preserves live9 because mentions is unknown and defaults to translation eligibility. TaggedLineage::new(entry,None) is used directly. Across this file30 tests (23 main,7 withdrawal) inspect metadata only; no runtime test executed. Missing malformed/bounds/rollback cases are analysis deductions, not reproduced bugs. (rust/lance-table/src/transaction/index_maintenance.rs:1623-1639)

## Interaction and interpretation limits

Every1639 physical lines read in seven bounded chunks. Consumer snippets in manifest_build/conflict_resolver are contextual only; full commit orchestration, actual reader translation and cleanup remain pending. Runtime panic/partial-mutation/performance properties are deductions from source; no source builds/tests/edits/network.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Keeping index metadata honest about what the new fragment list contains.
    5 | //!
    6 | //! An index entry claims coverage of a set of fragments and fields. Any operation
    7 | //! that rewrites data can invalidate part of that claim, so a commit has to either
    8 | //! narrow the entry's fragment bitmap, drop the fields it no longer describes, or
    9 | //! drop the index. Getting this wrong does not fail the commit -- it silently
   10 | //! returns stale rows from the index -- so each rule here is paired with a test.
   11 | 
   12 | use crate::format::overlay::staleness::collect_overlay_stale_frags;
   13 | use crate::format::{Fragment, IndexMetadata};
   14 | use crate::system_index::frag_reuse::FRAG_REUSE_INDEX_NAME;
   15 | use crate::system_index::frag_reuse::lineage::TaggedLineage;
   16 | use crate::system_index::frag_reuse::metadata::is_tagged;
   17 | use crate::system_index::is_system_index;
   18 | use crate::transaction::{
   19 |     DataReplacementGroup, Operation, RewriteGroup, RewrittenIndex, Transaction,
   20 | };
   21 | use lance_core::datatypes::Schema;
   22 | use lance_core::{Error, Result};
   23 | use roaring::RoaringBitmap;
   24 | use std::collections::{HashMap, HashSet};
   25 | use uuid::Uuid;
   26 | 
   27 | impl Transaction {
   28 |     pub(super) fn register_pure_rewrite_rows_update_frags_in_indices(
   29 |         indices: &mut [IndexMetadata],
   30 |         pure_update_frag_ids: &[u64],
   31 |         original_fragment_ids: &[u64],
   32 |         fields_for_preserving_frag_bitmap: &[u32],
   33 |         original_overlaid_frags: &HashMap<u32, &Fragment>,
   34 |         schema: &Schema,
   35 |     ) -> Result<()> {
   36 |         if pure_update_frag_ids.is_empty() {
   37 |             return Ok(());
   38 |         }
   39 | 
   40 |         let value_updated_field_set = fields_for_preserving_frag_bitmap
   41 |             .iter()
   42 |             .collect::<HashSet<_>>();
   43 | 
   44 |         for index in indices.iter_mut() {
   45 |             // Physical row addresses cannot follow moved rows into a new fragment.
   46 |             // Leave that fragment uncovered so the scanner reads it directly.
   47 |             if index.results_are_row_addrs() {
   48 |                 continue;
   49 |             }
   50 |             let index_covers_modified_field = index.fields.iter().any(|field_id| {
   51 |                 value_updated_field_set.contains(&u32::try_from(*field_id).unwrap())
   52 |             });
   53 |             if index_covers_modified_field {
   54 |                 continue;
   55 |             }
   56 |             let Some(fragment_bitmap) = index.fragment_bitmap.as_ref() else {
   57 |                 continue;
   58 |             };
   59 | 
   60 |             // Check that all the original fragments containing the updated rows are covered by
   61 |             // the index. If not, some updated rows were not indexed, so we cannot index them.
   62 |             let index_covers_all_original_fragments = original_fragment_ids
   63 |                 .iter()
   64 |                 .all(|&fragment_id| fragment_bitmap.contains(fragment_id as u32));
   65 |             if !index_covers_all_original_fragments {
   66 |                 continue;
   67 |             }
   68 | 
   69 |             // A rewrite materializes overlays.  If any of those overlays touched the
   70 |             // column being indexed then the rewrite will modify that column.  As a
   71 |             // result, that index will no longer cover the fragment and it does not
   72 |             // count as a pure rewrite and we must exclude it from the index's fragment
   73 |             // bitmap.
   74 |             let mut overlay_stale = RoaringBitmap::new();
   75 |             collect_overlay_stale_frags(
   76 |                 index,
   77 |                 original_overlaid_frags,
   78 |                 &mut overlay_stale,
   79 |                 schema,
   80 |             )?;
   81 |             if !overlay_stale.is_empty() {
   82 |                 continue;
   83 |             }
   84 | 
   85 |             if let Some(fragment_bitmap) = index.fragment_bitmap.as_mut() {
   86 |                 for fragment_id in pure_update_frag_ids.iter().map(|f| *f as u32) {
   87 |                     fragment_bitmap.insert(fragment_id);
   88 |                 }
   89 |             }
   90 |         }
   91 |         Ok(())
   92 |     }
   93 | 
   94 |     /// Withdraw what an in-place column rewrite invalidates from every index
   95 |     /// on a table with a tagged fragment reuse history.
   96 |     ///
   97 |     /// The physical columns `operation` rewrites in place, per live fragment
   98 |     /// id, unexpanded: an update with `fields_modified` rewrites those
   99 |     /// fields in every updated fragment; a merge rewrites, in each fragment
  100 |     /// present in `previous_fragments`, the fields whose backing data file
  101 |     /// changed (`merge_rewritten_fields`); a data replacement rewrites the
  102 |     /// fields its new files carry, read through `schema`. Any other
  103 |     /// operation rewrites nothing. `previous_fragments` is the caller's
  104 |     /// "before" list: the current manifest's for a commit, the read
  105 |     /// version's for a rebase.
  106 |     pub fn rewritten_physical_columns(
  107 |         operation: &Operation,
  108 |         schema: &Schema,
  109 |         previous_fragments: &[Fragment],
  110 |     ) -> Vec<(u64, Vec<u32>)> {
  111 |         match operation {
  112 |             Operation::Update {
  113 |                 updated_fragments,
  114 |                 fields_modified,
  115 |                 ..
  116 |             } if !fields_modified.is_empty() => updated_fragments
  117 |                 .iter()
  118 |                 .map(|fragment| (fragment.id, fields_modified.clone()))
  119 |                 .collect(),
  120 |             Operation::Merge { fragments, .. } => {
  121 |                 Self::merge_rewritten_fields(previous_fragments, fragments)
  122 |             }
  123 |             Operation::DataReplacement { replacements } => replacements
  124 |                 .iter()
  125 |                 .map(|DataReplacementGroup(fragment_id, new_file)| {
  126 |                     let mut fields: Vec<u32> = new_file
  127 |                         .schema(schema)
  128 |                         .field_ids()
  129 |                         .into_iter()
  130 |                         .chain(new_file.fields.iter().copied())
  131 |                         .filter_map(|id| u32::try_from(id).ok())
  132 |                         .collect();
  133 |                     fields.sort_unstable();
  134 |                     fields.dedup();
  135 |                     (*fragment_id, fields)
  136 |                 })
  137 |                 .collect(),
  138 |             _ => Vec::new(),
  139 |         }
  140 |     }
  141 | 
  142 |     /// The one implementation of an in-place column rewrite's effect on
  143 |     /// index coverage, shared by the commit preparation (on the list read
  144 |     /// from the current manifest) and by the conflict resolver rebasing a
  145 |     /// new index over a committed rewrite (on the index being created).
  146 |     ///
  147 |     /// `rewrites` comes from [`Self::rewritten_physical_columns`]. With a
  148 |     /// walkable tagged history (`lineage`), every rewritten field id is
  149 |     /// expanded to its descendants through `schema` (a packed struct is one
  150 |     /// physical column while an index on `s.x` records the child's id) and
  151 |     /// the coverage is withdrawn along the lineage
  152 |     /// ([`Self::withdraw_rewritten_coverage`]). Without a tagged history the
  153 |     /// rewritten fragments are pruned from the covering indices by id, the
  154 |     /// ordinary rule, exactly as before.
  155 |     pub fn withdraw_in_place_rewrites(
  156 |         indices: &mut Vec<IndexMetadata>,
  157 |         rewrites: Vec<(u64, Vec<u32>)>,
  158 |         schema: &Schema,
  159 |         live: &RoaringBitmap,
  160 |         lineage: Option<&TaggedLineage>,
  161 |     ) {
  162 |         if rewrites.is_empty() {
  163 |             return;
  164 |         }
  165 |         match lineage {
  166 |             Some(lineage) => {
  167 |                 let rewrites = Self::expand_rewritten_fields(schema, rewrites);
  168 |                 Self::withdraw_rewritten_coverage(indices, Some(lineage), live, &rewrites);
  169 |             }
  170 |             None => {
  171 |                 for (fragment, fields) in rewrites {
  172 |                     Self::prune_updated_fields_from_indices(
  173 |                         indices,
  174 |                         &[Fragment::new(fragment)],
  175 |                         &fields,
  176 |                     );
  177 |                 }
  178 |             }
  179 |         }
  180 |     }
  181 | 
  182 |     /// Expand every rewritten field id in `rewrites` to the field and all
  183 |     /// its descendants through `schema`, the form
  184 |     /// `withdraw_rewritten_coverage` compares against index fields.
  185 |     fn expand_rewritten_fields(
  186 |         schema: &Schema,
  187 |         rewrites: Vec<(u64, Vec<u32>)>,
  188 |     ) -> Vec<(u64, Vec<u32>)> {
  189 |         rewrites
  190 |             .into_iter()
  191 |             .map(|(fragment, fields)| (fragment, Self::with_descendants(schema, fields)))
  192 |             .collect()
  193 |     }
  194 | 
  195 |     /// `fields` plus every field nested under them, deduplicated.
  196 |     fn with_descendants(schema: &Schema, fields: Vec<u32>) -> Vec<u32> {
  197 |         let mut expanded = Vec::with_capacity(fields.len());
  198 |         for id in fields {
  199 |             expanded.push(id);
  200 |             let Ok(field_id) = i32::try_from(id) else {
  201 |                 continue;
  202 |             };
  203 |             let mut pending: Vec<&lance_core::datatypes::Field> = schema
  204 |                 .field_by_id(field_id)
  205 |                 .map(|field| field.children.iter().collect())
  206 |                 .unwrap_or_default();
  207 |             while let Some(child) = pending.pop() {
  208 |                 if let Ok(child_id) = u32::try_from(child.id) {
  209 |                     expanded.push(child_id);
  210 |                 }
  211 |                 pending.extend(child.children.iter());
  212 |             }
  213 |         }
  214 |         expanded.sort_unstable();
  215 |         expanded.dedup();
  216 |         expanded
  217 |     }
  218 | 
  219 |     /// `rewrites` lists each rewritten live fragment with the fields
  220 |     /// rewritten in it (expanded to their descendants, see
  221 |     /// [`Self::withdraw_in_place_rewrites`]). For every
  222 |     /// non-system segment that indexes one of those fields (keyed or
  223 |     /// carried), with bitmap `B`:
  224 |     /// - a rewritten fragment named in `B` is removed, as on an untagged
  225 |     ///   table;
  226 |     /// - every retired fragment `r` of `B` (not in `live`) whose rows the
  227 |     ///   history moves into the rewritten fragment (`destinations_of`,
  228 |     ///   transitively, so mixed provenance holding intermediates is
  229 |     ///   covered) is removed. The sources of one transition all reach the
  230 |     ///   same destinations, so the transition's sources go whole: the
  231 |     ///   segment derives no coverage of its destinations and those rows are
  232 |     ///   scanned until `optimize_indices` rebuilds them;
  233 |     /// - without a walkable history every retired fragment of `B` goes;
  234 |     /// - a segment without a bitmap is untouched: its coverage is unknown,
  235 |     ///   not empty, and the reader already excludes it.
  236 |     ///
  237 |     /// What a withdrawal leaves is then settled per logical index name:
  238 |     /// - coverage partly left: the segment stays and serves what is left,
  239 |     ///   provided the reader will still translate it. The file keeps the
  240 |     ///   withdrawn rows; the translating load drops them (they resolve
  241 |     ///   outside the derived coverage), but a segment whose remaining
  242 |     ///   bitmap is live-only and disjoint from the history is loaded as it
  243 |     ///   is, and would serve the withdrawn retired rows raw. So when a
  244 |     ///   RETIRED fragment was withdrawn and the remainder would be loaded
  245 |     ///   as it is, the remainder is withdrawn too (the segment empties and
  246 |     ///   is rebuilt). Withdrawing only live fragments leaves the remainder
  247 |     ///   alone: rows of fragments that still exist are masked by the
  248 |     ///   ordinary per-segment ownership filter;
  249 |     /// - coverage emptied while a same-name sibling still has coverage (or
  250 |     ///   an unknown one): the segment's metadata leaves the manifest in this
  251 |     ///   commit; its files are reclaimed by the ordinary index cleanup once
  252 |     ///   no retained version references them;
  253 |     /// - coverage emptied and it is the last segment of its name: it stays
  254 |     ///   as the record of what index to build (queries never use it, since
  255 |     ///   the reader lists nothing for it; maintenance rebuilds it from the
  256 |     ///   live fragments).
  257 |     ///
  258 |     /// Every withdrawal is logged at warn level.
  259 |     pub fn withdraw_rewritten_coverage(
  260 |         indices: &mut Vec<IndexMetadata>,
  261 |         lineage: Option<&TaggedLineage>,
  262 |         live: &RoaringBitmap,
  263 |         rewrites: &[(u64, Vec<u32>)],
  264 |     ) {
  265 |         let mut emptied = Vec::new();
  266 |         for index in indices.iter_mut().filter(|index| !is_system_index(index)) {
  267 |             let indexed: HashSet<u32> = index
  268 |                 .fields
  269 |                 .iter()
  270 |                 .filter_map(|field| u32::try_from(*field).ok())
  271 |                 .collect();
  272 |             let Some(bitmap) = index.fragment_bitmap.as_mut() else {
  273 |                 continue;
  274 |             };
  275 |             let retired = &*bitmap - live;
  276 |             let mut withdrawn = RoaringBitmap::new();
  277 |             for (fragment, fields) in rewrites {
  278 |                 if !fields.iter().any(|field| indexed.contains(field)) {
  279 |                     continue;
  280 |                 }
  281 |                 let Ok(rewritten) = u32::try_from(*fragment) else {
  282 |                     continue;
  283 |                 };
  284 |                 if bitmap.contains(rewritten) {
  285 |                     withdrawn.insert(rewritten);
  286 |                 }
  287 |                 // Every retired source whose rows reach the rewritten
  288 |                 // fragment goes; the sources of one transition all reach the
  289 |                 // same destinations, so the transition is withdrawn whole.
  290 |                 for source in retired.iter() {
  291 |                     match lineage.and_then(|lineage| lineage.destinations_of(source)) {
  292 |                         Some(destinations) if destinations.contains(&rewritten) => {
  293 |                             withdrawn.insert(source);
  294 |                         }
  295 |                         Some(_) => {}
  296 |                         None => {
  297 |                             withdrawn.insert(source);
  298 |                         }
  299 |                     }
  300 |                 }
  301 |             }
  302 |             if withdrawn.is_empty() {
  303 |                 continue;
  304 |             }
  305 |             *bitmap -= &withdrawn;
  306 |             let withdrew_retired = !(&withdrawn & &retired).is_empty();
  307 |             if withdrew_retired && !bitmap.is_empty() {
  308 |                 // Would the reader still translate what is left? Only a
  309 |                 // bitmap naming a retired fragment or one the history
  310 |                 // mentions is translated (and filtered to its derived
  311 |                 // coverage); a live-only remainder the history does not
  312 |                 // mention is loaded as it is, which would serve the
  313 |                 // withdrawn rows the file still holds. A history that
  314 |                 // cannot be walked holds transitions this build cannot
  315 |                 // read, and the reader then translates every segment, so
  316 |                 // the remainder is safe in that case.
  317 |                 let reader_translates = !bitmap.is_subset(live)
  318 |                     || bitmap.iter().any(|fragment| {
  319 |                         lineage
  320 |                             .and_then(|lineage| lineage.mentions(fragment))
  321 |                             .unwrap_or(true)
  322 |                     });
  323 |                 if !reader_translates {
  324 |                     log::warn!(
  325 |                         "index {} (segment {}): its remaining coverage {:?} would be loaded \
  326 |                          as it is while its file still holds rows of the withdrawn retired \
  327 |                          fragments; withdrawing it whole so the segment is rebuilt",
  328 |                         index.name,
  329 |                         index.uuid,
  330 |                         bitmap.iter().collect::<Vec<_>>()
  331 |                     );
  332 |                     withdrawn |= &*bitmap;
  333 |                     bitmap.clear();
  334 |                 }
  335 |             }
  336 |             if bitmap.is_empty() {
  337 |                 emptied.push(index.uuid);
  338 |             }
  339 |             log::warn!(
  340 |                 "index {} (segment {}): withdrew {} fragment(s) of coverage after an in-place \
  341 |                  rewrite of an indexed column; the rows they covered are scanned until the index \
  342 |                  is optimized",
  343 |                 index.name,
  344 |                 index.uuid,
  345 |                 withdrawn.len()
  346 |             );
  347 |         }
  348 |         Self::retire_emptied_segments(indices, &emptied);
  349 |     }
  350 | 
  351 |     /// Drop the metadata of every segment in `emptied` whose logical index
  352 |     /// still has another segment with coverage (or with unknown coverage).
  353 |     /// The last segment of a name is kept, empty, as the record of what to
  354 |     /// rebuild.
  355 |     fn retire_emptied_segments(indices: &mut Vec<IndexMetadata>, emptied: &[Uuid]) {
  356 |         let removable: Vec<Uuid> = emptied
  357 |             .iter()
  358 |             .copied()
  359 |             .filter(|uuid| {
  360 |                 let Some(name) = indices
  361 |                     .iter()
  362 |                     .find(|index| index.uuid == *uuid)
  363 |                     .map(|index| index.name.as_str())
  364 |                 else {
  365 |                     return false;
  366 |                 };
  367 |                 indices.iter().any(|sibling| {
  368 |                     sibling.name == name
  369 |                         && sibling.uuid != *uuid
  370 |                         && sibling
  371 |                             .fragment_bitmap
  372 |                             .as_ref()
  373 |                             .is_none_or(|bitmap| !bitmap.is_empty())
  374 |                 })
  375 |             })
  376 |             .collect();
  377 |         if removable.is_empty() {
  378 |             return;
  379 |         }
  380 |         indices.retain(|index| {
  381 |             let retired = removable.contains(&index.uuid);
  382 |             if retired {
  383 |                 log::info!(
  384 |                     "index {} (segment {}): every fragment of its coverage was withdrawn and a \
  385 |                      sibling segment still serves the index; the segment leaves the manifest and \
  386 |                      its files are reclaimed by index cleanup",
  387 |                     index.name,
  388 |                     index.uuid
  389 |                 );
  390 |             }
  391 |             !retired
  392 |         });
  393 |     }
  394 | 
  395 |     /// If an operation modifies one or more fields in a fragment then we need to remove
  396 |     /// that fragment from any indices that cover one of the modified fields.
  397 |     pub fn prune_updated_fields_from_indices(
  398 |         indices: &mut [IndexMetadata],
  399 |         updated_fragments: &[Fragment],
  400 |         fields_modified: &[u32],
  401 |     ) {
  402 |         if fields_modified.is_empty() {
  403 |             return;
  404 |         }
  405 | 
  406 |         // If we modified any fields in the fragments then we need to remove those fragments
  407 |         // from the index if the index covers one of those modified fields.
  408 |         let fields_modified_set = fields_modified.iter().collect::<HashSet<_>>();
  409 |         for index in indices.iter_mut() {
  410 |             if index
  411 |                 .fields
  412 |                 .iter()
  413 |                 .any(|field_id| fields_modified_set.contains(&u32::try_from(*field_id).unwrap()))
  414 |                 && let Some(fragment_bitmap) = &mut index.fragment_bitmap
  415 |             {
  416 |                 for fragment_id in updated_fragments.iter().map(|f| f.id as u32) {
  417 |                     fragment_bitmap.remove(fragment_id);
  418 |                 }
  419 |             }
  420 |         }
  421 |     }
  422 | 
  423 |     /// Map each (non-tombstoned) field id in a fragment to the path of the data
  424 |     /// file that backs it.
  425 |     fn fragment_field_paths(frag: &Fragment) -> HashMap<i32, &str> {
  426 |         let mut map = HashMap::new();
  427 |         for file in &frag.files {
  428 |             for &field_id in file.fields.iter() {
  429 |                 if field_id >= 0 {
  430 |                     map.insert(field_id, file.path.as_str());
  431 |                 }
  432 |             }
  433 |         }
  434 |         map
  435 |     }
  436 | 
  437 |     /// The columns a `Merge` rewrote in place: for each fragment present in
  438 |     /// both lists, the fields still present whose backing data file path
  439 |     /// changed. Brand-new fragments carry nothing stale.
  440 |     pub fn merge_rewritten_fields(
  441 |         prev_fragments: &[Fragment],
  442 |         new_fragments: &[Fragment],
  443 |     ) -> Vec<(u64, Vec<u32>)> {
  444 |         let prev_by_id: HashMap<u64, &Fragment> =
  445 |             prev_fragments.iter().map(|f| (f.id, f)).collect();
  446 |         new_fragments
  447 |             .iter()
  448 |             .filter_map(|new_frag| {
  449 |                 let prev = prev_by_id.get(&new_frag.id)?;
  450 |                 let prev_paths = Self::fragment_field_paths(prev);
  451 |                 let new_paths = Self::fragment_field_paths(new_frag);
  452 |                 let mut changed: Vec<u32> = prev_paths
  453 |                     .iter()
  454 |                     .filter(|(field_id, prev_path)| {
  455 |                         new_paths
  456 |                             .get(*field_id)
  457 |                             .is_some_and(|new_path| new_path != *prev_path)
  458 |                     })
  459 |                     .map(|(field_id, _)| *field_id as u32)
  460 |                     .collect();
  461 |                 changed.sort_unstable();
  462 |                 (!changed.is_empty()).then_some((new_frag.id, changed))
  463 |             })
  464 |             .collect()
  465 |     }
  466 | 
  467 |     /// After a `Rewrite` fully compacts a fragment, its data overlays are baked
  468 |     /// into the new fragment's base data. An index built *before* one of those
  469 |     /// overlays (`overlay.committed_version > index.dataset_version`) indexed the
  470 |     /// stale pre-overlay values -- and unlike a live overlay, the compacted
  471 |     /// fragment no longer signals that staleness to the query path. Drop each
  472 |     /// rewritten (new) fragment from the coverage of any index covering a field
  473 |     /// such an overlay supplied, so those rows fall back to a flat scan.
  474 |     pub(super) fn prune_overlay_stale_fields_from_indices(
  475 |         indices: &mut [IndexMetadata],
  476 |         groups: &[RewriteGroup],
  477 |     ) {
  478 |         for group in groups {
  479 |             // field id -> newest overlay committed_version supplying that field
  480 |             let mut overlaid_field_versions: HashMap<i32, u64> = HashMap::new();
  481 |             for old_frag in &group.old_fragments {
  482 |                 for overlay in &old_frag.overlays {
  483 |                     for &field_id in overlay.data_file.fields.iter() {
  484 |                         if field_id < 0 {
  485 |                             // Tombstoned (obsolete) overlay field: supplies nothing.
  486 |                             continue;
  487 |                         }
  488 |                         let entry = overlaid_field_versions.entry(field_id).or_insert(0);
  489 |                         *entry = (*entry).max(overlay.committed_version);
  490 |                     }
  491 |                 }
  492 |             }
  493 |             if overlaid_field_versions.is_empty() {
  494 |                 continue;
  495 |             }
  496 | 
  497 |             let new_fragment_ids = group
  498 |                 .new_fragments
  499 |                 .iter()
  500 |                 .map(|f| f.id as u32)
  501 |                 .collect::<Vec<_>>();
  502 |             for index in indices.iter_mut() {
  503 |                 let is_stale = index.fields.iter().any(|field_id| {
  504 |                     overlaid_field_versions
  505 |                         .get(field_id)
  506 |                         .is_some_and(|&overlay_version| overlay_version > index.dataset_version)
  507 |                 });
  508 |                 if is_stale && let Some(fragment_bitmap) = &mut index.fragment_bitmap {
  509 |                     for new_id in &new_fragment_ids {
  510 |                         fragment_bitmap.remove(*new_id);
  511 |                     }
  512 |                 }
  513 |             }
  514 |         }
  515 |     }
  516 | 
  517 |     pub(crate) fn retain_relevant_indices(
  518 |         indices: &mut Vec<IndexMetadata>,
  519 |         schema: &Schema,
  520 |         fragments: &[Fragment],
  521 |     ) {
  522 |         let field_ids = schema
  523 |             .fields_pre_order()
  524 |             .map(|f| f.id)
  525 |             .collect::<HashSet<_>>();
  526 | 
  527 |         // Remove indices for fields no longer in schema
  528 |         indices.retain(|existing_index| {
  529 |             existing_index
  530 |                 .fields
  531 |                 .iter()
  532 |                 .all(|field_id| field_ids.contains(field_id))
  533 |                 || is_system_index(existing_index)
  534 |         });
  535 | 
  536 |         let mut indices_by_name: std::collections::HashMap<String, Vec<&IndexMetadata>> =
  537 |             std::collections::HashMap::new();
  538 | 
  539 |         for index in indices.iter() {
  540 |             if index.name != FRAG_REUSE_INDEX_NAME {
  541 |                 indices_by_name
  542 |                     .entry(index.name.clone())
  543 |                     .or_default()
  544 |                     .push(index);
  545 |             }
  546 |         }
  547 | 
  548 |         let mut uuids_to_keep = std::collections::HashSet::new();
  549 | 
  550 |         let existing_fragments = fragments
  551 |             .iter()
  552 |             .map(|f| f.id as u32)
  553 |             .collect::<RoaringBitmap>();
  554 | 
  555 |         // Under a tagged fragment reuse history a segment's stored bitmap is
  556 |         // its provenance (the retired source fragments it was built from),
  557 |         // not the fragments it serves: its live coverage is derived at query
  558 |         // time by translating through the history, and is empty against the
  559 |         // live fragments by construction once its sources were rewritten.
  560 |         // Measuring such a segment here would drop it. Every segment is kept
  561 |         // instead; superseded segments are pruned by the tagged maintenance
  562 |         // path, which reasons on derived coverage.
  563 |         let tagged = indices.iter().any(is_tagged);
  564 | 
  565 |         for (_, same_name_indices) in indices_by_name {
  566 |             if tagged {
  567 |                 for index in same_name_indices {
  568 |                     uuids_to_keep.insert(index.uuid);
  569 |                 }
  570 |                 continue;
  571 |             }
  572 |             // Unknown coverage is not empty coverage: a segment whose bitmap is
  573 |             // missing has never been measured, and dropping it deletes an index
  574 |             // that migration could not open yet.
  575 |             let (unknown_coverage, same_name_indices): (Vec<_>, Vec<_>) = same_name_indices
  576 |                 .into_iter()
  577 |                 .partition(|index| index.fragment_bitmap.is_none());
  578 |             for index in unknown_coverage {
  579 |                 uuids_to_keep.insert(index.uuid);
  580 |             }
  581 | 
  582 |             if same_name_indices.len() > 1 {
  583 |                 let (empty_indices, non_empty_indices): (Vec<_>, Vec<_>) =
  584 |                     same_name_indices.iter().partition(|index| {
  585 |                         index
  586 |                             .effective_fragment_bitmap(&existing_fragments)
  587 |                             .as_ref()
  588 |                             .is_none_or(|bitmap| bitmap.is_empty())
  589 |                     });
  590 | 
  591 |                 if non_empty_indices.is_empty() {
  592 |                     // All indices are empty -- keep only the oldest definition.
  593 |                     //
  594 |                     // An empty index definition is still correct: the scanner
  595 |                     // falls back to scanning unindexed fragments, and normal
  596 |                     // index maintenance rebuilds coverage once rows accrue.
  597 |                     // Dropping the definition instead would silently lose the
  598 |                     // index whenever an operation replaces every fragment it
  599 |                     // covered (e.g. a full table rewrite), leaving the dataset
  600 |                     // without its declared index.
  601 |                     let mut sorted_indices = empty_indices;
  602 |                     sorted_indices.sort_by_key(|index: &&IndexMetadata| index.dataset_version);
  603 | 
  604 |                     if let Some(oldest) = sorted_indices.first() {
  605 |                         uuids_to_keep.insert(oldest.uuid);
  606 |                     }
  607 |                 } else {
  608 |                     for index in non_empty_indices {
  609 |                         uuids_to_keep.insert(index.uuid);
  610 |                     }
  611 |                 }
  612 |             } else {
  613 |                 // Single index whose column is still in schema: keep it, even
  614 |                 // when its coverage is empty (see the all-empty note above).
  615 |                 if let Some(index) = same_name_indices.first() {
  616 |                     uuids_to_keep.insert(index.uuid);
  617 |                 }
  618 |             }
  619 |         }
  620 | 
  621 |         indices.retain(|index| {
  622 |             index.name == FRAG_REUSE_INDEX_NAME || uuids_to_keep.contains(&index.uuid)
  623 |         });
  624 |     }
  625 | 
  626 |     /// The rewrite groups whose index bitmaps follow the rewrite (source ids
  627 |     /// swapped for destination ids). Groups covered by the stable-partition
  628 |     /// transitions' sources are excluded: they redistribute rows, so their
  629 |     /// bitmaps keep the retired source ids as provenance and the tagged
  630 |     /// fragment reuse index entry records the row-level translation. A group
  631 |     /// must be entirely reordered or entirely order-preserving.
  632 |     pub(super) fn ordered_rewrite_groups(
  633 |         groups: &[RewriteGroup],
  634 |         reordered_sources: Option<&RoaringBitmap>,
  635 |     ) -> Result<Vec<RewriteGroup>> {
  636 |         let Some(sources) = reordered_sources else {
  637 |             return Ok(groups.to_vec());
  638 |         };
  639 |         let mut ordered = Vec::new();
  640 |         for group in groups {
  641 |             let covered = group
  642 |                 .old_fragments
  643 |                 .iter()
  644 |                 .filter(|frag| sources.contains(frag.id as u32))
  645 |                 .count();
  646 |             if covered == 0 {
  647 |                 ordered.push(group.clone());
  648 |             } else if covered != group.old_fragments.len() {
  649 |                 return Err(Error::invalid_input(
  650 |                     "a rewrite group mixes transition-covered and order-preserving source fragments",
  651 |                 ));
  652 |             }
  653 |         }
  654 |         Ok(ordered)
  655 |     }
  656 | 
  657 |     pub(super) fn recalculate_fragment_bitmap(
  658 |         old: &RoaringBitmap,
  659 |         groups: &[RewriteGroup],
  660 |     ) -> Result<RoaringBitmap> {
  661 |         let mut new_bitmap = old.clone();
  662 |         for group in groups {
  663 |             let any_in_index = group
  664 |                 .old_fragments
  665 |                 .iter()
  666 |                 .any(|frag| old.contains(frag.id as u32));
  667 |             let all_in_index = group
  668 |                 .old_fragments
  669 |                 .iter()
  670 |                 .all(|frag| old.contains(frag.id as u32));
  671 |             // Any rewrite group may or may not be covered by the index.  However, if any fragment
  672 |             // in a rewrite group was previously covered by the index then all fragments in the rewrite
  673 |             // group must have been previously covered by the index.  plan_compaction takes care of
  674 |             // this for us so this should be safe to assume.
  675 |             if any_in_index {
  676 |                 if all_in_index {
  677 |                     for frag_id in group.old_fragments.iter().map(|frag| frag.id as u32) {
  678 |                         new_bitmap.remove(frag_id);
  679 |                     }
  680 |                     new_bitmap.extend(group.new_fragments.iter().map(|frag| frag.id as u32));
  681 |                 } else {
  682 |                     return Err(Error::invalid_input(
  683 |                         "The compaction plan included a rewrite group that was a split of indexed and non-indexed data",
  684 |                     ));
  685 |                 }
  686 |             }
  687 |         }
  688 |         Ok(new_bitmap)
  689 |     }
  690 | 
  691 |     pub(super) fn handle_rewrite_indices(
  692 |         indices: &mut [IndexMetadata],
  693 |         rewritten_indices: &[RewrittenIndex],
  694 |         groups: &[RewriteGroup],
  695 |     ) -> Result<()> {
  696 |         let mut modified_indices = HashSet::new();
  697 | 
  698 |         for rewritten_index in rewritten_indices {
  699 |             if !modified_indices.insert(rewritten_index.old_id) {
  700 |                 return Err(Error::invalid_input(format!(
  701 |                     "An invalid compaction plan must have been generated because multiple tasks modified the same index: {}",
  702 |                     rewritten_index.old_id
  703 |                 )));
  704 |             }
  705 | 
  706 |             // Skip indices that no longer exist (may have been removed by concurrent operation)
  707 |             let Some(index) = indices
  708 |                 .iter_mut()
  709 |                 .find(|idx| idx.uuid == rewritten_index.old_id)
  710 |             else {
  711 |                 continue;
  712 |             };
  713 | 
  714 |             index.fragment_bitmap = Some(Self::recalculate_fragment_bitmap(
  715 |                 index.fragment_bitmap.as_ref().ok_or_else(|| {
  716 |                     Error::invalid_input(format!(
  717 |                         "Cannot rewrite index {} which did not store fragment bitmap",
  718 |                         index.uuid
  719 |                     ))
  720 |                 })?,
  721 |                 groups,
  722 |             )?);
  723 |             index.uuid = rewritten_index.new_id;
  724 |             // Update file sizes to match the new index files. When not available
  725 |             // (e.g., from older writers), clear the old file sizes to avoid
  726 |             // using stale sizes from the pre-remap index.
  727 |             index.files = rewritten_index.new_index_files.clone();
  728 |         }
  729 |         Ok(())
  730 |     }
  731 | 
  732 |     pub(super) fn handle_rewrite_fragments(
  733 |         final_fragments: &mut Vec<Fragment>,
  734 |         groups: &[RewriteGroup],
  735 |         fragment_id: &mut u64,
  736 |         version: u64,
  737 |         _next_row_id: Option<&u64>,
  738 |     ) -> Result<()> {
  739 |         for group in groups {
  740 |             // If the old fragments are contiguous, find the range
  741 |             let replace_range = {
  742 |                 let start = final_fragments
  743 |                     .iter()
  744 |                     .enumerate()
  745 |                     .find(|(_, f)| f.id == group.old_fragments[0].id)
  746 |                     .ok_or_else(|| {
  747 |                         Error::commit_conflict_source(
  748 |                             version,
  749 |                             format!(
  750 |                                 "dataset does not contain a fragment a rewrite operation wants to replace: id={}",
  751 |                                 group.old_fragments[0].id
  752 |                             )
  753 |                             .into(),
  754 |                         )
  755 |                     })?
  756 |                     .0;
  757 | 
  758 |                 // Verify old_fragments matches contiguous range
  759 |                 let mut i = 1;
  760 |                 loop {
  761 |                     if i == group.old_fragments.len() {
  762 |                         break Some(start..start + i);
  763 |                     }
  764 |                     if final_fragments[start + i].id != group.old_fragments[i].id {
  765 |                         break None;
  766 |                     }
  767 |                     i += 1;
  768 |                 }
  769 |             };
  770 | 
  771 |             let new_fragments = Self::fragments_with_ids(group.new_fragments.clone(), fragment_id)
  772 |                 .collect::<Vec<_>>();
  773 | 
  774 |             // Version metadata for rewritten fragments is handled by the compaction code
  775 |             // (recalc_versions_for_rewritten_fragments) which preserves version information
  776 |             // from the original fragments. We don't modify it here.
  777 | 
  778 |             if let Some(replace_range) = replace_range {
  779 |                 // Efficiently path using slice
  780 |                 final_fragments.splice(replace_range, new_fragments);
  781 |             } else {
  782 |                 // Slower path for non-contiguous ranges
  783 |                 for fragment in group.old_fragments.iter() {
  784 |                     final_fragments.retain(|f| f.id != fragment.id);
  785 |                 }
  786 |                 final_fragments.extend(new_fragments);
  787 |             }
  788 |         }
  789 |         Ok(())
  790 |     }
  791 | }
  792 | 
  793 | #[cfg(test)]
  794 | mod tests {
  795 |     use super::*;
  796 |     use crate::transaction::test_support::overlay_with_field;
  797 |     use uuid::Uuid;
  798 | 
  799 |     #[test]
  800 |     fn test_ordered_rewrite_groups_split_and_mixed() {
  801 |         use crate::format::pb::fragment_reuse_index_details as pb_fri;
  802 |         let group = |old_ids: &[u64], new_ids: &[u64]| RewriteGroup {
  803 |             old_fragments: old_ids.iter().map(|&id| Fragment::new(id)).collect(),
  804 |             new_fragments: new_ids.iter().map(|&id| Fragment::new(id)).collect(),
  805 |         };
  806 |         let groups = vec![group(&[0, 1], &[10]), group(&[2], &[11])];
  807 | 
  808 |         // No stable partition: every group takes part in bitmap maintenance.
  809 |         assert_eq!(
  810 |             Transaction::ordered_rewrite_groups(&groups, None)
  811 |                 .unwrap()
  812 |                 .len(),
  813 |             2
  814 |         );
  815 | 
  816 |         // Group [0, 1] is reordered: only group [2] remains ordered.
  817 |         let digest = |id: u64| pb_fri::FragmentDigest {
  818 |             id,
  819 |             physical_rows: 4,
  820 |             num_deleted_rows: 0,
  821 |         };
  822 |         let reordered = crate::transaction::reordered_sources(&[pb_fri::Transition {
  823 |             sources: vec![digest(0), digest(1)],
  824 |             destinations: vec![digest(10), digest(10)],
  825 |             mapping: None,
  826 |         }])
  827 |         .unwrap();
  828 |         let ordered = Transaction::ordered_rewrite_groups(&groups, Some(&reordered)).unwrap();
  829 |         assert_eq!(ordered.len(), 1);
  830 |         assert_eq!(ordered[0].old_fragments[0].id, 2);
  831 | 
  832 |         // A group straddling reordered and order-preserving sources is
  833 |         // rejected.
  834 |         let mixed = vec![group(&[1, 2], &[10])];
  835 |         assert!(Transaction::ordered_rewrite_groups(&mixed, Some(&reordered)).is_err());
  836 |     }
  837 | 
  838 |     #[test]
  839 |     fn test_rewrite_fragments() {
  840 |         let existing_fragments: Vec<Fragment> = (0..10).map(Fragment::new).collect();
  841 | 
  842 |         let mut final_fragments = existing_fragments;
  843 |         let rewrite_groups = vec![
  844 |             // Since these are contiguous, they will be put in the same location
  845 |             // as 1 and 2.
  846 |             RewriteGroup {
  847 |                 old_fragments: vec![Fragment::new(1), Fragment::new(2)],
  848 |                 // These two fragments were previously reserved
  849 |                 new_fragments: vec![Fragment::new(15), Fragment::new(16)],
  850 |             },
  851 |             // These are not contiguous, so they will be inserted at the end.
  852 |             RewriteGroup {
  853 |                 old_fragments: vec![Fragment::new(5), Fragment::new(8)],
  854 |                 // We pretend this id was not reserved.  Does not happen in practice today
  855 |                 // but we want to leave the door open.
  856 |                 new_fragments: vec![Fragment::new(0)],
  857 |             },
  858 |         ];
  859 | 
  860 |         let mut fragment_id = 20;
  861 |         let version = 0;
  862 | 
  863 |         Transaction::handle_rewrite_fragments(
  864 |             &mut final_fragments,
  865 |             &rewrite_groups,
  866 |             &mut fragment_id,
  867 |             version,
  868 |             None,
  869 |         )
  870 |         .unwrap();
  871 | 
  872 |         assert_eq!(fragment_id, 21);
  873 | 
  874 |         let expected_fragments: Vec<Fragment> = vec![
  875 |             Fragment::new(0),
  876 |             Fragment::new(15),
  877 |             Fragment::new(16),
  878 |             Fragment::new(3),
  879 |             Fragment::new(4),
  880 |             Fragment::new(6),
  881 |             Fragment::new(7),
  882 |             Fragment::new(9),
  883 |             Fragment::new(20),
  884 |         ];
  885 | 
  886 |         assert_eq!(final_fragments, expected_fragments);
  887 |     }
  888 | 
  889 |     #[test]
  890 |     fn test_retain_indices_removes_missing_fields() {
  891 |         let schema = create_test_schema(&[1, 2]);
  892 |         let fragments = vec![Fragment::new(1), Fragment::new(2)];
  893 | 
  894 |         let mut indices = vec![
  895 |             create_test_index("idx1", 1, 1, Some(RoaringBitmap::from_iter([1])), false),
  896 |             create_test_index("idx2", 2, 1, Some(RoaringBitmap::from_iter([1])), false),
  897 |             create_test_index("idx3", 99, 1, Some(RoaringBitmap::from_iter([1])), false), // Field doesn't exist
  898 |         ];
  899 | 
  900 |         Transaction::retain_relevant_indices(&mut indices, &schema, &fragments);
  901 | 
  902 |         assert_eq!(indices.len(), 2);
  903 |         assert!(indices.iter().all(|idx| idx.fields[0] != 99));
  904 |     }
  905 | 
  906 |     #[test]
  907 |     fn test_retain_indices_keeps_system_indices() {
  908 |         use crate::system_index::mem_wal::MEM_WAL_INDEX_NAME;
  909 | 
  910 |         let schema = create_test_schema(&[1, 2]);
  911 |         let fragments = vec![Fragment::new(1)];
  912 | 
  913 |         let mut indices = vec![
  914 |             legacy_frag_reuse_index(99), // Field doesn't exist but should be kept
  915 |             create_system_index(MEM_WAL_INDEX_NAME, 99), // Field doesn't exist but should be kept
  916 |             create_test_index("regular_idx", 99, 1, Some(RoaringBitmap::new()), false), // Should be removed
  917 |         ];
  918 | 
  919 |         Transaction::retain_relevant_indices(&mut indices, &schema, &fragments);
  920 | 
  921 |         assert_eq!(indices.len(), 2);
  922 |         assert!(indices.iter().any(|idx| idx.name == FRAG_REUSE_INDEX_NAME));
  923 |         assert!(indices.iter().any(|idx| idx.name == MEM_WAL_INDEX_NAME));
  924 |     }
  925 | 
  926 |     #[test]
  927 |     fn test_retain_indices_keeps_fragment_reuse_index() {
  928 |         let schema = create_test_schema(&[1]);
  929 |         let fragments = vec![Fragment::new(1)];
  930 | 
  931 |         let mut indices = vec![
  932 |             legacy_frag_reuse_index(1),
  933 |             create_test_index("other_idx", 1, 1, Some(RoaringBitmap::new()), false),
  934 |         ];
  935 | 
  936 |         Transaction::retain_relevant_indices(&mut indices, &schema, &fragments);
  937 | 
  938 |         // Fragment reuse index should always be kept
  939 |         assert!(indices.iter().any(|idx| idx.name == FRAG_REUSE_INDEX_NAME));
  940 |     }
  941 | 
  942 |     #[test]
  943 |     fn test_retain_single_empty_scalar_index() {
  944 |         let schema = create_test_schema(&[1]);
  945 |         let fragments = vec![Fragment::new(1)];
  946 | 
  947 |         let mut indices = vec![create_test_index(
  948 |             "scalar_idx",
  949 |             1,
  950 |             1,
  951 |             Some(RoaringBitmap::new()), // Empty bitmap
  952 |             false,
  953 |         )];
  954 | 
  955 |         Transaction::retain_relevant_indices(&mut indices, &schema, &fragments);
  956 | 
  957 |         // Single empty scalar index should be kept
  958 |         assert_eq!(indices.len(), 1);
  959 |     }
  960 | 
  961 |     #[test]
  962 |     fn test_retain_single_empty_vector_index_is_kept() {
  963 |         let schema = create_test_schema(&[1]);
  964 |         let fragments = vec![Fragment::new(1)];
  965 | 
  966 |         let mut indices = vec![create_test_index(
  967 |             "vector_idx",
  968 |             1,
  969 |             1,
  970 |             Some(RoaringBitmap::new()), // Empty bitmap
  971 |             true,
  972 |         )];
  973 | 
  974 |         Transaction::retain_relevant_indices(&mut indices, &schema, &fragments);
  975 | 
  976 |         // The empty definition is retained: coverage is empty but the index
  977 |         // declaration must survive operations that replace every fragment.
  978 |         assert_eq!(indices.len(), 1);
  979 |     }
  980 | 
  981 |     #[test]
  982 |     fn test_retain_single_nonempty_index() {
  983 |         let schema = create_test_schema(&[1]);
  984 |         let fragments = vec![Fragment::new(1)];
  985 | 
  986 |         let mut scalar_indices = vec![create_test_index(
  987 |             "scalar_idx",
  988 |             1,
  989 |             1,
  990 |             Some(RoaringBitmap::from_iter([1])),
  991 |             false,
  992 |         )];
  993 | 
  994 |         let mut vector_indices = vec![create_test_index(
  995 |             "vector_idx",
  996 |             1,
  997 |             1,
  998 |             Some(RoaringBitmap::from_iter([1])),
  999 |             true,
 1000 |         )];
 1001 | 
 1002 |         Transaction::retain_relevant_indices(&mut scalar_indices, &schema, &fragments);
 1003 |         Transaction::retain_relevant_indices(&mut vector_indices, &schema, &fragments);
 1004 | 
 1005 |         // Both should be kept
 1006 |         assert_eq!(scalar_indices.len(), 1);
 1007 |         assert_eq!(vector_indices.len(), 1);
 1008 |     }
 1009 | 
 1010 |     #[test]
 1011 |     fn test_retain_single_index_with_none_bitmap() {
 1012 |         let schema = create_test_schema(&[1]);
 1013 |         let fragments = vec![Fragment::new(1)];
 1014 | 
 1015 |         let mut scalar_indices = vec![create_test_index("scalar_idx", 1, 1, None, false)];
 1016 |         let mut vector_indices = vec![create_test_index("vector_idx", 1, 1, None, true)];
 1017 | 
 1018 |         Transaction::retain_relevant_indices(&mut scalar_indices, &schema, &fragments);
 1019 |         Transaction::retain_relevant_indices(&mut vector_indices, &schema, &fragments);
 1020 | 
 1021 |         // Both kept: a None bitmap is unknown coverage, not empty coverage, and
 1022 |         // an unmeasured segment is retained regardless of index type.
 1023 |         assert_eq!(scalar_indices.len(), 1);
 1024 |         assert_eq!(vector_indices.len(), 1);
 1025 |     }
 1026 | 
 1027 |     #[test]
 1028 |     fn test_retain_unknown_coverage_alongside_nonempty_sibling() {
 1029 |         let schema = create_test_schema(&[1]);
 1030 |         let fragments = vec![Fragment::new(1), Fragment::new(2)];
 1031 | 
 1032 |         let mut indices = vec![
 1033 |             create_test_index("idx", 1, 1, None, false), // Coverage never measured
 1034 |             create_test_index("idx", 1, 2, Some(RoaringBitmap::from_iter([2])), false),
 1035 |         ];
 1036 | 
 1037 |         Transaction::retain_relevant_indices(&mut indices, &schema, &fragments);
 1038 | 
 1039 |         // The unmeasured segment must survive its non-empty sibling: its bitmap
 1040 |         // is missing because migration could not open the index, and deleting
 1041 |         // the segment would take the only record of it with it.
 1042 |         assert_eq!(indices.len(), 2);
 1043 |         assert!(indices.iter().any(|idx| idx.fragment_bitmap.is_none()));
 1044 |     }
 1045 | 
 1046 |     #[test]
 1047 |     fn test_retain_multiple_empty_scalar_indices_keeps_oldest() {
 1048 |         let schema = create_test_schema(&[1]);
 1049 |         let fragments = vec![Fragment::new(1)];
 1050 | 
 1051 |         let mut indices = vec![
 1052 |             create_test_index("idx", 1, 3, Some(RoaringBitmap::new()), false),
 1053 |             create_test_index("idx", 1, 1, Some(RoaringBitmap::new()), false), // Oldest
 1054 |             create_test_index("idx", 1, 2, Some(RoaringBitmap::new()), false),
 1055 |         ];
 1056 | 
 1057 |         Transaction::retain_relevant_indices(&mut indices, &schema, &fragments);
 1058 | 
 1059 |         // Should keep only the oldest (dataset_version = 1)
 1060 |         assert_eq!(indices.len(), 1);
 1061 |         assert_eq!(indices[0].dataset_version, 1);
 1062 |     }
 1063 | 
 1064 |     #[test]
 1065 |     fn test_retain_multiple_empty_vector_indices_keeps_oldest() {
 1066 |         let schema = create_test_schema(&[1]);
 1067 |         let fragments = vec![Fragment::new(1)];
 1068 | 
 1069 |         let mut indices = vec![
 1070 |             create_test_index("vec_idx", 1, 1, Some(RoaringBitmap::new()), true),
 1071 |             create_test_index("vec_idx", 1, 2, Some(RoaringBitmap::new()), true),
 1072 |             create_test_index("vec_idx", 1, 3, Some(RoaringBitmap::new()), true),
 1073 |         ];
 1074 | 
 1075 |         Transaction::retain_relevant_indices(&mut indices, &schema, &fragments);
 1076 | 
 1077 |         // Same as the scalar case: all deltas are empty, so only the oldest
 1078 |         // definition survives.
 1079 |         assert_eq!(indices.len(), 1);
 1080 |         assert_eq!(indices[0].dataset_version, 1);
 1081 |     }
 1082 | 
 1083 |     #[test]
 1084 |     fn test_retain_mixed_empty_nonempty_keeps_nonempty() {
 1085 |         let schema = create_test_schema(&[1]);
 1086 |         let fragments = vec![Fragment::new(1)];
 1087 | 
 1088 |         let mut indices = vec![
 1089 |             create_test_index("idx", 1, 1, Some(RoaringBitmap::new()), false), // Empty
 1090 |             create_test_index("idx", 1, 2, Some(RoaringBitmap::from_iter([1])), false), // Non-empty
 1091 |             create_test_index("idx", 1, 3, Some(RoaringBitmap::new()), false), // Empty
 1092 |             create_test_index("idx", 1, 4, Some(RoaringBitmap::from_iter([1])), false), // Non-empty
 1093 |         ];
 1094 | 
 1095 |         Transaction::retain_relevant_indices(&mut indices, &schema, &fragments);
 1096 | 
 1097 |         // Should keep only non-empty indices
 1098 |         assert_eq!(indices.len(), 2);
 1099 |         assert!(
 1100 |             indices
 1101 |                 .iter()
 1102 |                 .all(|idx| idx.dataset_version == 2 || idx.dataset_version == 4)
 1103 |         );
 1104 |     }
 1105 | 
 1106 |     #[test]
 1107 |     fn test_retain_mixed_empty_nonempty_vector_keeps_nonempty() {
 1108 |         let schema = create_test_schema(&[1]);
 1109 |         let fragments = vec![Fragment::new(1)];
 1110 | 
 1111 |         let mut indices = vec![
 1112 |             create_test_index("vec_idx", 1, 1, Some(RoaringBitmap::new()), true), // Empty
 1113 |             create_test_index("vec_idx", 1, 2, Some(RoaringBitmap::from_iter([1])), true), // Non-empty
 1114 |             create_test_index("vec_idx", 1, 3, Some(RoaringBitmap::new()), true),          // Empty
 1115 |         ];
 1116 | 
 1117 |         Transaction::retain_relevant_indices(&mut indices, &schema, &fragments);
 1118 | 
 1119 |         // Should keep only non-empty index
 1120 |         assert_eq!(indices.len(), 1);
 1121 |         assert_eq!(indices[0].dataset_version, 2);
 1122 |     }
 1123 | 
 1124 |     #[test]
 1125 |     fn test_retain_fragment_bitmap_with_nonexistent_fragments() {
 1126 |         let schema = create_test_schema(&[1]);
 1127 |         let fragments = vec![Fragment::new(1), Fragment::new(2)]; // Only fragments 1 and 2 exist
 1128 | 
 1129 |         let mut indices = vec![create_test_index(
 1130 |             "idx",
 1131 |             1,
 1132 |             1,
 1133 |             Some(RoaringBitmap::from_iter([1, 2, 3, 4])), // References non-existent fragments 3, 4
 1134 |             false,
 1135 |         )];
 1136 | 
 1137 |         Transaction::retain_relevant_indices(&mut indices, &schema, &fragments);
 1138 | 
 1139 |         // Should still keep the index (effective bitmap will be intersection with existing)
 1140 |         assert_eq!(indices.len(), 1);
 1141 |         // Original bitmap should be unchanged
 1142 |         assert_eq!(
 1143 |             indices[0].fragment_bitmap.as_ref().unwrap(),
 1144 |             &RoaringBitmap::from_iter([1, 2, 3, 4])
 1145 |         );
 1146 |     }
 1147 | 
 1148 |     #[test]
 1149 |     fn test_retain_effective_empty_bitmap_single_index() {
 1150 |         let schema = create_test_schema(&[1]);
 1151 |         let fragments = vec![Fragment::new(5), Fragment::new(6)];
 1152 | 
 1153 |         // Bitmap references fragments that don't exist, so effective bitmap is empty
 1154 |         let mut scalar_indices = vec![create_test_index(
 1155 |             "scalar_idx",
 1156 |             1,
 1157 |             1,
 1158 |             Some(RoaringBitmap::from_iter([1, 2, 3])),
 1159 |             false,
 1160 |         )];
 1161 | 
 1162 |         let mut vector_indices = vec![create_test_index(
 1163 |             "vector_idx",
 1164 |             1,
 1165 |             1,
 1166 |             Some(RoaringBitmap::from_iter([1, 2, 3])),
 1167 |             true,
 1168 |         )];
 1169 | 
 1170 |         Transaction::retain_relevant_indices(&mut scalar_indices, &schema, &fragments);
 1171 |         Transaction::retain_relevant_indices(&mut vector_indices, &schema, &fragments);
 1172 | 
 1173 |         // Both kept: a single index whose column is still in schema is
 1174 |         // retained even when its effective coverage is empty.
 1175 |         assert_eq!(scalar_indices.len(), 1);
 1176 |         assert_eq!(vector_indices.len(), 1);
 1177 |     }
 1178 | 
 1179 |     #[test]
 1180 |     fn test_retain_different_index_names() {
 1181 |         let schema = create_test_schema(&[1]);
 1182 |         let fragments = vec![Fragment::new(1)];
 1183 | 
 1184 |         let mut indices = vec![
 1185 |             create_test_index("idx_a", 1, 1, Some(RoaringBitmap::new()), false),
 1186 |             create_test_index("idx_b", 1, 1, Some(RoaringBitmap::new()), true),
 1187 |             create_test_index("idx_c", 1, 1, Some(RoaringBitmap::from_iter([1])), false),
 1188 |         ];
 1189 | 
 1190 |         Transaction::retain_relevant_indices(&mut indices, &schema, &fragments);
 1191 | 
 1192 |         // All three kept: empty definitions are retained for scalar and
 1193 |         // vector indexes alike.
 1194 |         assert_eq!(indices.len(), 3);
 1195 |         assert!(indices.iter().any(|idx| idx.name == "idx_a"));
 1196 |         assert!(indices.iter().any(|idx| idx.name == "idx_b"));
 1197 |         assert!(indices.iter().any(|idx| idx.name == "idx_c"));
 1198 |     }
 1199 | 
 1200 |     #[test]
 1201 |     fn test_retain_empty_indices_vec() {
 1202 |         let schema = create_test_schema(&[1]);
 1203 |         let fragments = vec![Fragment::new(1)];
 1204 | 
 1205 |         let mut indices: Vec<IndexMetadata> = vec![];
 1206 | 
 1207 |         Transaction::retain_relevant_indices(&mut indices, &schema, &fragments);
 1208 | 
 1209 |         assert_eq!(indices.len(), 0);
 1210 |     }
 1211 | 
 1212 |     #[test]
 1213 |     fn test_retain_all_indices_removed() {
 1214 |         let schema = create_test_schema(&[1]);
 1215 |         let fragments = vec![Fragment::new(1)];
 1216 | 
 1217 |         let mut indices = vec![
 1218 |             create_test_index("vec1", 1, 1, Some(RoaringBitmap::new()), true),
 1219 |             create_test_index("vec2", 1, 1, Some(RoaringBitmap::new()), true),
 1220 |             create_test_index("idx3", 99, 1, Some(RoaringBitmap::from_iter([1])), false), // Bad field
 1221 |         ];
 1222 | 
 1223 |         Transaction::retain_relevant_indices(&mut indices, &schema, &fragments);
 1224 | 
 1225 |         // Only the bad-field index is dropped; the empty vector definitions
 1226 |         // are retained.
 1227 |         assert_eq!(indices.len(), 2);
 1228 |         assert!(!indices.iter().any(|idx| idx.name == "idx3"));
 1229 |     }
 1230 | 
 1231 |     #[test]
 1232 |     fn test_retain_complex_scenario() {
 1233 |         let schema = create_test_schema(&[1, 2]);
 1234 |         let fragments = vec![Fragment::new(1), Fragment::new(2)];
 1235 | 
 1236 |         let mut indices = vec![
 1237 |             // System index - should always be kept
 1238 |             legacy_frag_reuse_index(1),
 1239 |             // Group "idx_a" - all empty scalars, keep oldest
 1240 |             create_test_index("idx_a", 1, 3, Some(RoaringBitmap::new()), false),
 1241 |             create_test_index("idx_a", 1, 1, Some(RoaringBitmap::new()), false), // Oldest
 1242 |             create_test_index("idx_a", 1, 2, Some(RoaringBitmap::new()), false),
 1243 |             // Group "vec_b" - all empty vectors, keep oldest definition
 1244 |             create_test_index("vec_b", 1, 1, Some(RoaringBitmap::new()), true),
 1245 |             create_test_index("vec_b", 1, 2, Some(RoaringBitmap::new()), true),
 1246 |             // Group "idx_c" - mixed empty/non-empty, keep non-empty
 1247 |             create_test_index("idx_c", 2, 1, Some(RoaringBitmap::new()), false),
 1248 |             create_test_index("idx_c", 2, 2, Some(RoaringBitmap::from_iter([1])), false), // Keep
 1249 |             create_test_index("idx_c", 2, 3, Some(RoaringBitmap::from_iter([2])), false), // Keep
 1250 |             // Single non-empty - keep
 1251 |             create_test_index("idx_d", 1, 1, Some(RoaringBitmap::from_iter([1, 2])), false),
 1252 |             // Index with bad field - remove
 1253 |             create_test_index("idx_e", 99, 1, Some(RoaringBitmap::from_iter([1])), false),
 1254 |         ];
 1255 | 
 1256 |         Transaction::retain_relevant_indices(&mut indices, &schema, &fragments);
 1257 | 
 1258 |         // Expected: frag_reuse, idx_a (oldest), vec_b (oldest), idx_c (2
 1259 |         // non-empty), idx_d = 6 total
 1260 |         assert_eq!(indices.len(), 6);
 1261 | 
 1262 |         // Verify system index kept
 1263 |         assert!(indices.iter().any(|idx| idx.name == FRAG_REUSE_INDEX_NAME));
 1264 | 
 1265 |         // Verify idx_a kept oldest only
 1266 |         let idx_a_indices: Vec<_> = indices.iter().filter(|idx| idx.name == "idx_a").collect();
 1267 |         assert_eq!(idx_a_indices.len(), 1);
 1268 |         assert_eq!(idx_a_indices[0].dataset_version, 1);
 1269 | 
 1270 |         // Verify vec_b kept oldest definition only
 1271 |         let vec_b_indices: Vec<_> = indices.iter().filter(|idx| idx.name == "vec_b").collect();
 1272 |         assert_eq!(vec_b_indices.len(), 1);
 1273 |         assert_eq!(vec_b_indices[0].dataset_version, 1);
 1274 | 
 1275 |         // Verify idx_c kept non-empty only
 1276 |         let idx_c_indices: Vec<_> = indices.iter().filter(|idx| idx.name == "idx_c").collect();
 1277 |         assert_eq!(idx_c_indices.len(), 2);
 1278 |         assert!(
 1279 |             idx_c_indices
 1280 |                 .iter()
 1281 |                 .all(|idx| idx.dataset_version == 2 || idx.dataset_version == 3)
 1282 |         );
 1283 | 
 1284 |         // Verify idx_d kept
 1285 |         assert!(indices.iter().any(|idx| idx.name == "idx_d"));
 1286 | 
 1287 |         // Verify idx_e removed (bad field)
 1288 |         assert!(!indices.iter().any(|idx| idx.name == "idx_e"));
 1289 |     }
 1290 | 
 1291 |     #[test]
 1292 |     fn test_handle_rewrite_indices_skips_missing_index() {
 1293 |         // Create an empty indices list
 1294 |         let mut indices = vec![];
 1295 | 
 1296 |         // Create rewritten_indices referring to a non-existent index
 1297 |         let rewritten_indices = vec![RewrittenIndex {
 1298 |             old_id: Uuid::new_v4(),
 1299 |             new_id: Uuid::new_v4(),
 1300 |             new_index_details: prost_types::Any {
 1301 |                 type_url: String::new(),
 1302 |                 value: vec![],
 1303 |             },
 1304 |             new_index_version: 1,
 1305 |             new_index_files: None,
 1306 |         }];
 1307 | 
 1308 |         // Should succeed (skip missing index) instead of error
 1309 |         let result = Transaction::handle_rewrite_indices(&mut indices, &rewritten_indices, &[]);
 1310 |         assert!(result.is_ok());
 1311 |         assert!(indices.is_empty());
 1312 |     }
 1313 | 
 1314 |     #[test]
 1315 |     fn test_prune_overlay_stale_fields_from_indices() {
 1316 |         // Fragment 0 carried an overlay on field 1 committed at v5, and was
 1317 |         // fully compacted into new fragment 7.
 1318 |         let mut old_frag = Fragment::new(0);
 1319 |         old_frag.overlays = vec![overlay_with_field(1, 5)];
 1320 |         let groups = vec![RewriteGroup {
 1321 |             old_fragments: vec![old_frag],
 1322 |             new_fragments: vec![Fragment::new(7)],
 1323 |         }];
 1324 | 
 1325 |         // Post-remap state: every index already covers the new fragment (7).
 1326 |         let covering = || Some(RoaringBitmap::from_iter([7u32]));
 1327 |         let mut indices = vec![
 1328 |             // Stale: covers the overlaid field 1, built (v2) before the overlay.
 1329 |             create_test_index("stale", 1, 2, covering(), false),
 1330 |             // Not stale: covers field 1 but built at the overlay's version (v5);
 1331 |             // `committed_version > dataset_version` is false at equality.
 1332 |             create_test_index("fresh", 1, 5, covering(), false),
 1333 |             // Unrelated: covers field 2, which the overlay never touched.
 1334 |             create_test_index("unrelated", 2, 2, covering(), false),
 1335 |         ];
 1336 | 
 1337 |         Transaction::prune_overlay_stale_fields_from_indices(&mut indices, &groups);
 1338 | 
 1339 |         assert!(
 1340 |             !indices[0].fragment_bitmap.as_ref().unwrap().contains(7),
 1341 |             "stale index must drop the rewritten fragment from its coverage"
 1342 |         );
 1343 |         assert!(
 1344 |             indices[1].fragment_bitmap.as_ref().unwrap().contains(7),
 1345 |             "an index built at/after the overlay is not stale"
 1346 |         );
 1347 |         assert!(
 1348 |             indices[2].fragment_bitmap.as_ref().unwrap().contains(7),
 1349 |             "an index on an un-overlaid field is unaffected"
 1350 |         );
 1351 |     }
 1352 | 
 1353 |     // Helper functions for retain_relevant_indices tests
 1354 |     fn create_test_index(
 1355 |         name: &str,
 1356 |         field_id: i32,
 1357 |         dataset_version: u64,
 1358 |         fragment_bitmap: Option<RoaringBitmap>,
 1359 |         is_vector: bool,
 1360 |     ) -> IndexMetadata {
 1361 |         use prost_types::Any;
 1362 |         use std::sync::Arc;
 1363 | 
 1364 |         let index_details = if is_vector {
 1365 |             Some(Arc::new(Any {
 1366 |                 type_url: "type.googleapis.com/lance.index.VectorIndexDetails".to_string(),
 1367 |                 value: vec![],
 1368 |             }))
 1369 |         } else {
 1370 |             Some(Arc::new(Any {
 1371 |                 type_url: "type.googleapis.com/lance.index.ScalarIndexDetails".to_string(),
 1372 |                 value: vec![],
 1373 |             }))
 1374 |         };
 1375 | 
 1376 |         IndexMetadata {
 1377 |             uuid: Uuid::new_v4(),
 1378 |             fields: vec![field_id],
 1379 |             covering_fields: vec![],
 1380 |             name: name.to_string(),
 1381 |             dataset_version,
 1382 |             fragment_bitmap,
 1383 |             index_details,
 1384 |             index_version: 1,
 1385 |             created_at: None,
 1386 |             base_id: None,
 1387 |             files: None,
 1388 |         }
 1389 |     }
 1390 | 
 1391 |     /// A version-0 fragment reuse entry: the pre-tagged history whose
 1392 |     /// presence leaves coverage-based retention as it always was.
 1393 |     fn legacy_frag_reuse_index(field_id: i32) -> IndexMetadata {
 1394 |         let mut index = create_system_index(FRAG_REUSE_INDEX_NAME, field_id);
 1395 |         index.index_version = 0;
 1396 |         index
 1397 |     }
 1398 | 
 1399 |     /// Under a tagged history a translating segment's stored bitmap is its
 1400 |     /// retired provenance, empty against the live fragments by construction,
 1401 |     /// so retention must keep every segment: only a segment on a field that
 1402 |     /// left the schema is dropped.
 1403 |     #[test]
 1404 |     fn test_retain_keeps_every_segment_under_tagged_history() {
 1405 |         let schema = create_test_schema(&[1, 2]);
 1406 |         let fragments = vec![Fragment::new(10), Fragment::new(11)];
 1407 |         let mut indices = vec![
 1408 |             create_system_index(FRAG_REUSE_INDEX_NAME, 1),
 1409 |             // Two translating segments: provenance {0} and {1} are both dead.
 1410 |             create_test_index("idx_a", 1, 1, Some(RoaringBitmap::from_iter([0])), false),
 1411 |             create_test_index("idx_a", 1, 2, Some(RoaringBitmap::from_iter([1])), false),
 1412 |             // A rebuilt sibling directly covering a live destination.
 1413 |             create_test_index("idx_a", 1, 3, Some(RoaringBitmap::from_iter([10])), false),
 1414 |             // An all-dead group and an all-empty group: every member kept.
 1415 |             create_test_index("vec_b", 1, 1, Some(RoaringBitmap::from_iter([0])), true),
 1416 |             create_test_index("vec_b", 1, 2, Some(RoaringBitmap::from_iter([1])), true),
 1417 |             create_test_index("idx_c", 2, 1, Some(RoaringBitmap::new()), false),
 1418 |             create_test_index("idx_c", 2, 2, Some(RoaringBitmap::new()), false),
 1419 |             // Field left the schema: dropped as always.
 1420 |             create_test_index("idx_e", 99, 1, Some(RoaringBitmap::from_iter([10])), false),
 1421 |         ];
 1422 |         assert!(indices.iter().any(is_tagged));
 1423 | 
 1424 |         Transaction::retain_relevant_indices(&mut indices, &schema, &fragments);
 1425 | 
 1426 |         assert_eq!(indices.len(), 8);
 1427 |         assert!(!indices.iter().any(|idx| idx.name == "idx_e"));
 1428 |         assert_eq!(indices.iter().filter(|idx| idx.name == "idx_a").count(), 3);
 1429 |         assert_eq!(indices.iter().filter(|idx| idx.name == "vec_b").count(), 2);
 1430 |         assert_eq!(indices.iter().filter(|idx| idx.name == "idx_c").count(), 2);
 1431 |     }
 1432 | 
 1433 |     fn create_system_index(name: &str, field_id: i32) -> IndexMetadata {
 1434 |         use prost_types::Any;
 1435 |         use std::sync::Arc;
 1436 | 
 1437 |         IndexMetadata {
 1438 |             uuid: Uuid::new_v4(),
 1439 |             fields: vec![field_id],
 1440 |             covering_fields: vec![],
 1441 |             name: name.to_string(),
 1442 |             dataset_version: 1,
 1443 |             fragment_bitmap: Some(RoaringBitmap::from_iter([1, 2])),
 1444 |             index_details: Some(Arc::new(Any {
 1445 |                 type_url: "type.googleapis.com/lance.index.SystemIndexDetails".to_string(),
 1446 |                 value: vec![],
 1447 |             })),
 1448 |             index_version: 1,
 1449 |             created_at: None,
 1450 |             base_id: None,
 1451 |             files: None,
 1452 |         }
 1453 |     }
 1454 | 
 1455 |     fn create_test_schema(field_ids: &[i32]) -> Schema {
 1456 |         use arrow_schema::{DataType, Field as ArrowField, Schema as ArrowSchema};
 1457 |         use lance_core::datatypes::Schema as LanceSchema;
 1458 | 
 1459 |         let fields: Vec<ArrowField> = field_ids
 1460 |             .iter()
 1461 |             .map(|id| ArrowField::new(format!("field_{}", id), DataType::Int32, false))
 1462 |             .collect();
 1463 | 
 1464 |         let arrow_schema = ArrowSchema::new(fields);
 1465 |         let mut lance_schema = LanceSchema::try_from(&arrow_schema).unwrap();
 1466 | 
 1467 |         // Assign field IDs
 1468 |         for (i, field_id) in field_ids.iter().enumerate() {
 1469 |             lance_schema.mut_field_by_id(i as i32).unwrap().id = *field_id;
 1470 |         }
 1471 | 
 1472 |         lance_schema
 1473 |     }
 1474 | }
 1475 | 
 1476 | #[cfg(test)]
 1477 | mod withdrawal_tests {
 1478 |     use super::*;
 1479 |     use crate::transaction::test_support::{sample_index_metadata, tagged_entry};
 1480 | 
 1481 |     fn segment(bitmap: Option<&[u32]>, fields: Vec<i32>) -> IndexMetadata {
 1482 |         let mut segment = sample_index_metadata("idx");
 1483 |         segment.fields = fields;
 1484 |         segment.fragment_bitmap = bitmap.map(|ids| ids.iter().copied().collect());
 1485 |         segment
 1486 |     }
 1487 | 
 1488 |     fn lineage(entry: &IndexMetadata) -> TaggedLineage {
 1489 |         TaggedLineage::from_indices_with_ledger(std::slice::from_ref(entry), None)
 1490 |             .unwrap()
 1491 |             .unwrap()
 1492 |     }
 1493 | 
 1494 |     /// F1, F2 -> F3 then F3 -> F4 (F4 live), plus an unrelated F6 -> F8.
 1495 |     fn history() -> IndexMetadata {
 1496 |         tagged_entry(&[(&[1, 2], &[3]), (&[3], &[4]), (&[6], &[8])])
 1497 |     }
 1498 | 
 1499 |     #[test]
 1500 |     fn withdraws_the_whole_transition_reaching_the_rewritten_fragment() {
 1501 |         let entry = history();
 1502 |         let live: RoaringBitmap = [4u32, 8, 9].into_iter().collect();
 1503 |         // Provenance {1, 2} reaches F4 through F3; F6 (retired, on the
 1504 |         // unrelated F6 -> F8 lineage) is untouched and keeps the segment on
 1505 |         // the translating path, so it survives with {6}.
 1506 |         let mut indices = vec![segment(Some(&[1, 2, 6]), vec![0]), entry.clone()];
 1507 |         Transaction::withdraw_rewritten_coverage(
 1508 |             &mut indices,
 1509 |             Some(&lineage(&entry)),
 1510 |             &live,
 1511 |             &[(4, vec![0])],
 1512 |         );
 1513 |         assert_eq!(
 1514 |             indices[0].fragment_bitmap.as_ref().unwrap(),
 1515 |             &RoaringBitmap::from_iter([6u32])
 1516 |         );
 1517 |         // The entry itself is never touched.
 1518 |         assert_eq!(indices[1].fragment_bitmap, entry.fragment_bitmap);
 1519 |     }
 1520 | 
 1521 |     /// The file of a segment whose retired sources were withdrawn still
 1522 |     /// holds their rows. A remainder that is live-only and unknown to the
 1523 |     /// history would be loaded as it is and serve those rows raw, so it is
 1524 |     /// withdrawn whole (the segment empties and is rebuilt).
 1525 |     #[test]
 1526 |     fn live_only_remainder_after_withdrawing_retired_sources_goes_whole() {
 1527 |         let entry = history();
 1528 |         let live: RoaringBitmap = [4u32, 8, 9].into_iter().collect();
 1529 |         let mut indices = vec![segment(Some(&[1, 2, 9]), vec![0]), entry.clone()];
 1530 |         Transaction::withdraw_rewritten_coverage(
 1531 |             &mut indices,
 1532 |             Some(&lineage(&entry)),
 1533 |             &live,
 1534 |             &[(4, vec![0])],
 1535 |         );
 1536 |         assert!(
 1537 |             indices[0].fragment_bitmap.as_ref().unwrap().is_empty(),
 1538 |             "{:?}",
 1539 |             indices[0].fragment_bitmap
 1540 |         );
 1541 |     }
 1542 | 
 1543 |     /// A remainder the history mentions (F8 is a destination) is translated
 1544 |     /// and filtered by the reader, so partial survival is safe there.
 1545 |     #[test]
 1546 |     fn remainder_the_history_mentions_survives() {
 1547 |         let entry = history();
 1548 |         let live: RoaringBitmap = [4u32, 8, 9].into_iter().collect();
 1549 |         let mut indices = vec![segment(Some(&[1, 2, 8]), vec![0])];
 1550 |         Transaction::withdraw_rewritten_coverage(
 1551 |             &mut indices,
 1552 |             Some(&lineage(&entry)),
 1553 |             &live,
 1554 |             &[(4, vec![0])],
 1555 |         );
 1556 |         assert_eq!(
 1557 |             indices[0].fragment_bitmap.as_ref().unwrap(),
 1558 |             &RoaringBitmap::from_iter([8u32])
 1559 |         );
 1560 |     }
 1561 | 
 1562 |     /// Withdrawing only a live fragment (an index built after the rewrite
 1563 |     /// that produced F4) leaves the remainder alone: rows of fragments that
 1564 |     /// still exist are masked by the ordinary per-segment ownership filter.
 1565 |     #[test]
 1566 |     fn withdrawing_only_a_live_fragment_keeps_the_remainder() {
 1567 |         let entry = history();
 1568 |         let live: RoaringBitmap = [4u32, 8, 9].into_iter().collect();
 1569 |         let mut indices = vec![segment(Some(&[4, 9]), vec![0])];
 1570 |         Transaction::withdraw_rewritten_coverage(
 1571 |             &mut indices,
 1572 |             Some(&lineage(&entry)),
 1573 |             &live,
 1574 |             &[(4, vec![0])],
 1575 |         );
 1576 |         assert_eq!(
 1577 |             indices[0].fragment_bitmap.as_ref().unwrap(),
 1578 |             &RoaringBitmap::from_iter([9u32])
 1579 |         );
 1580 |     }
 1581 | 
 1582 |     #[test]
 1583 |     fn mixed_provenance_loses_the_direct_id_and_the_sources() {
 1584 |         let entry = history();
 1585 |         let live: RoaringBitmap = [4u32, 8].into_iter().collect();
 1586 |         // {3} is an intermediate the merge kept beside the live F4.
 1587 |         let mut indices = vec![segment(Some(&[3, 4]), vec![0])];
 1588 |         Transaction::withdraw_rewritten_coverage(
 1589 |             &mut indices,
 1590 |             Some(&lineage(&entry)),
 1591 |             &live,
 1592 |             &[(4, vec![0])],
 1593 |         );
 1594 |         assert!(indices[0].fragment_bitmap.as_ref().unwrap().is_empty());
 1595 |     }
 1596 | 
 1597 |     #[test]
 1598 |     fn unrelated_lineage_unindexed_field_and_missing_bitmap_are_untouched() {
 1599 |         let entry = history();
 1600 |         let live: RoaringBitmap = [4u32, 8].into_iter().collect();
 1601 |         let mut indices = vec![
 1602 |             segment(Some(&[6]), vec![0]),
 1603 |             segment(Some(&[1, 2]), vec![1]),
 1604 |             segment(None, vec![0]),
 1605 |         ];
 1606 |         Transaction::withdraw_rewritten_coverage(
 1607 |             &mut indices,
 1608 |             Some(&lineage(&entry)),
 1609 |             &live,
 1610 |             &[(4, vec![0])],
 1611 |         );
 1612 |         assert_eq!(
 1613 |             indices[0].fragment_bitmap.as_ref().unwrap(),
 1614 |             &RoaringBitmap::from_iter([6u32])
 1615 |         );
 1616 |         assert_eq!(
 1617 |             indices[1].fragment_bitmap.as_ref().unwrap(),
 1618 |             &RoaringBitmap::from_iter([1u32, 2])
 1619 |         );
 1620 |         assert!(indices[2].fragment_bitmap.is_none());
 1621 |     }
 1622 | 
 1623 |     #[test]
 1624 |     fn without_a_walkable_history_every_retired_fragment_goes() {
 1625 |         let entry = history();
 1626 |         let live: RoaringBitmap = [4u32, 8, 9].into_iter().collect();
 1627 |         let mut indices = vec![segment(Some(&[6, 9]), vec![0])];
 1628 |         Transaction::withdraw_rewritten_coverage(
 1629 |             &mut indices,
 1630 |             Some(&TaggedLineage::new(&entry, None)),
 1631 |             &live,
 1632 |             &[(4, vec![0])],
 1633 |         );
 1634 |         assert_eq!(
 1635 |             indices[0].fragment_bitmap.as_ref().unwrap(),
 1636 |             &RoaringBitmap::from_iter([9u32])
 1637 |         );
 1638 |     }
 1639 | }
``````
