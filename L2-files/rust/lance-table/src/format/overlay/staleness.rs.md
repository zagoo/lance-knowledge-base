> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/format/overlay/staleness.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `d94f39e14f8f8545da7ba764e690c03e503fd0d2f748fb98d9d93693ba751e69`. Reviewed physical lines: 1-415.

[Module](../../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Public metadata-only index-staleness selection by overlay version, field ancestry and fragment coverage. (rust/lance-table/src/format/overlay/staleness.rs:1-415)

## Complete range analysis

### Lines 1-23

SPDX and module rationale: overlay replacements leave preexisting index values stale, so affected rows should be excluded from index results and re-evaluated on a flat path. Imports HashMap,core Result/Schema,Roaring,DataOverlayFile,Fragment,IndexMetadata. This module calculates sets only; it neither executes a query nor loads values/index files. (rust/lance-table/src/format/overlay/staleness.rs:1-23)

### Lines 24-45

overlay_exclusion_offsets accepts overlays, ordered field ID slice, index_version:u64 and schema, and creates empty RoaringBitmap. Each overlay with committed_version<=index_version is skipped, including equality; others are considered regardless of input sort order. Here index_version means dataset build version, not IndexMetadata.index_version algorithm revision. (rust/lance-table/src/format/overlay/staleness.rs:24-45)

### Lines 46-68

For every file field position, compute overlay field ancestry and match any indexed ID by exact equality, indexed ancestor of overlay field, or overlay ancestor of indexed field. Only matching fields union coverage_for_field(position); errors propagate and the local partial bitmap is discarded. Sibling fields do not match via a shared ancestor. Exact IDs can match even if absent from schema; no explicit tombstone/negative-ID filter or physical/deletion bound. Schema ancestry is recalculated in inner comparisons and may allocate/walk repeatedly; source docs restricted-to-indexed-fields includes structural ancestors/descendants. (rust/lance-table/src/format/overlay/staleness.rs:46-68)

### Lines 69-87

Private stale_offsets_for_fragment first checks all overlay versions<=build version and returns empty without field/bitmap work; empty overlay list passes all(). Otherwise delegates full overlay exclusion. This adds a version pass and does not rely on newest-last sorting. (rust/lance-table/src/format/overlay/staleness.rs:69-87)

### Lines 88-95

Private covers_fragment treats None bitmap as covering any supplied u32 fragment ID; Some requires contains. Comment ties it to DatasetPreFilter legacy behavior, whose consumer implementation remains pending. This is conservative staleness masking for unknown index coverage, not changing metadata None to a stored full bitmap. (rust/lance-table/src/format/overlay/staleness.rs:88-95)

### Lines 96-106

overlaid_fragments scans all input fragments, retains those with nonempty overlays and collects HashMap<u32,&Fragment> using f.id as u32. Cast truncates IDs above u32::MAX; duplicate/truncated IDs overwrite earlier entries. Map owns no fragments and performs no overlay validation. O(total input fragments) to build; O(overlaid fragments) is only the outer bound for subsequent loops, not total ancestry/bitmap work. (rust/lance-table/src/format/overlay/staleness.rs:96-106)

### Lines 107-132

collect_overlay_stale_frags visits supplied map in unspecified HashMap order, skipping already stale IDs or uncovered fragments. For remaining entries compute offsets using full segment.fields and segment.dataset_version, and insert map key if nonempty. Covering dependency fields participate, not only keyed_fields. Existing entries are preserved. Any error can leave earlier inserts applied; no rollback. A caller-supplied map key is trusted independently of Fragment.id. (rust/lance-table/src/format/overlay/staleness.rs:107-132)

### Lines 133-159

collect_overlay_stale_rows_for_segment applies same coverage/build-version/full-field logic and unions each nonempty offset result into stale.entry(map_key).or_default. It neither skips existing keys nor clears old bits and creates no new empty entry. On error earlier fragments remain changed but the failing fragment local result is not merged. No live-row/deletion filtering or value loading; scalar/vector usage in comments is caller intent until traced. (rust/lance-table/src/format/overlay/staleness.rs:133-159)

### Lines 160-182

cfg(test) imports and bitmap helper plus flat schema fixture: five nullable Int32 fields named field_0..4, Arrow-to-Lance conversion then set_field_id(None). Test helpers use unwrap; no production schema mutation occurs. (rust/lance-table/src/format/overlay/staleness.rs:160-182)

### Lines 183-215

nested_struct_schema builds outer.middle.{a,b} nullable Int32 hierarchy and assigns IDs; dense_overlay makes legacy DataFile metadata o.lance with supplied field IDs, dense bitmap and version. This fixture choice does not imply current overlay writers emit legacy files. (rust/lance-table/src/format/overlay/staleness.rs:183-215)

### Lines 216-234

Version test at index dataset version5 excludes only overlay6 offsets[2,7], ignores overlay4[0,1] and equal-version5[9]. Asserts exact bitmap/empty result; no IO. (rust/lance-table/src/format/overlay/staleness.rs:216-234)

### Lines 235-252

Field-aware test excludes nothing for unrelated field2 when querying3, and excludes[4] for dense fields[2,3]. It pins matching-field union despite other fields sharing the bitmap. (rust/lance-table/src/format/overlay/staleness.rs:235-252)

### Lines 253-278

Nested-field test: overlay child a invalidates index on outer; does not invalidate sibling b; overlay middle invalidates index on a. These assert both ancestry directions plus sibling separation with exact offset sets. (rust/lance-table/src/format/overlay/staleness.rs:253-278)

### Lines 279-299

Sparse test fields[2,4] have coverages[2,3] and[1]; querying4 returns[1], querying2 returns[2,3]. It confirms positional restriction, not mismatched-list validation. (rust/lance-table/src/format/overlay/staleness.rs:279-299)

### Lines 300-312

Multiple newer overlays on field3 with[1] and[4,5] union to[1,4,5]. Does not test repeated cells with restoring values; exclusion conservatively unions writes without comparing values. (rust/lance-table/src/format/overlay/staleness.rs:300-312)

### Lines 313-340

segment helper constructs IndexMetadata with supplied fields/dataset_version/optional fragment bitmap, empty covering, random UUID/name idx and default optional details/time/base/files. fragment_with_overlay makes Fragment::new(id) then appends one overlay. Neither helper simulates query/index creation. (rust/lance-table/src/format/overlay/staleness.rs:313-340)

### Lines 341-379

Fragment collector test uses fragment3 with changed rows[1,2]: None coverage marks3 stale, Some([0]) yields empty and Some([3]) marks3. It tests unknown-versus-known coverage conservatism but only one fragment per call. (rust/lance-table/src/format/overlay/staleness.rs:341-379)

### Lines 380-415

Row collector test likewise expects fragment3->[1,2] for None coverage and empty map when Some([0]) excludes it. Tests inspected only. No direct overlaid_fragments duplicate/truncation test, existing-output accumulation, multi-fragment partial-error, covering-field, deleted-row or tombstone fixture here. (rust/lance-table/src/format/overlay/staleness.rs:380-415)

## Interaction and interpretation limits

Every415 physical lines read. Public through format::overlay::staleness. Schema ancestry and coverage lookup already analyzed; query prefilter/flat fallback consumers, index freshness policy and transaction validation remain pending. No execution or guarantee of complete query correctness.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Which rows an overlay makes stale with respect to an index.
    5 | //!
    6 | //! An overlay supplies replacement values for some `(row, field)` cells without
    7 | //! rewriting the base data. An index built before that overlay was committed still
    8 | //! reflects the old values, so those rows must be excluded from the index's results
    9 | //! and re-evaluated against current values on the flat path.
   10 | //!
   11 | //! Deciding which rows are affected needs only fragment and index metadata — the
   12 | //! overlay coverage bitmaps, the overlay `committed_version`, and the indexed field
   13 | //! ids — so it lives here rather than in the read path that consumes it.
   14 | 
   15 | use std::collections::HashMap;
   16 | 
   17 | use lance_core::Result;
   18 | use lance_core::datatypes::Schema;
   19 | use roaring::RoaringBitmap;
   20 | 
   21 | use crate::format::overlay::DataOverlayFile;
   22 | use crate::format::{Fragment, IndexMetadata};
   23 | 
   24 | /// The physical offsets within a fragment whose value for an indexed field may be
   25 | /// stale relative to an index built at `index_version`, and so must be excluded
   26 | /// from that index's results and re-evaluated against current values on the flat
   27 | /// path.
   28 | ///
   29 | /// The set is the union, over every overlay whose `committed_version` is newer
   30 | /// than `index_version`, of that overlay's coverage **restricted to the indexed
   31 | /// fields**. The restriction makes exclusion field-aware: an overlay that touches
   32 | /// only non-indexed fields contributes nothing. An overlay whose
   33 | /// `committed_version <= index_version` is already incorporated by the index and
   34 | /// is ignored.
   35 | pub fn overlay_exclusion_offsets(
   36 |     overlays: &[DataOverlayFile],
   37 |     indexed_field_ids: &[i32],
   38 |     index_version: u64,
   39 |     schema: &Schema,
   40 | ) -> Result<RoaringBitmap> {
   41 |     let mut excluded = RoaringBitmap::new();
   42 |     for overlay in overlays {
   43 |         if overlay.committed_version <= index_version {
   44 |             continue;
   45 |         }
   46 |         for (field_pos, field_id) in overlay.data_file.fields.iter().enumerate() {
   47 |             let overlay_ancestry = schema.field_ancestry_by_id(*field_id);
   48 |             let affects_index = indexed_field_ids.iter().any(|indexed_field_id| {
   49 |                 indexed_field_id == field_id
   50 |                     || overlay_ancestry.as_ref().is_some_and(|ancestry| {
   51 |                         ancestry
   52 |                             .iter()
   53 |                             .any(|ancestor| ancestor.id == *indexed_field_id)
   54 |                     })
   55 |                     || schema
   56 |                         .field_ancestry_by_id(*indexed_field_id)
   57 |                         .is_some_and(|ancestry| {
   58 |                             ancestry.iter().any(|ancestor| ancestor.id == *field_id)
   59 |                         })
   60 |             });
   61 |             if affects_index {
   62 |                 excluded |= &*overlay.coverage_for_field(field_pos)?;
   63 |             }
   64 |         }
   65 |     }
   66 |     Ok(excluded)
   67 | }
   68 | 
   69 | // Stale row offsets contributed by one fragment's overlays for a given index version.
   70 | // Applies a cheap version gate first: if every overlay predates the segment it is already
   71 | // incorporated by the index, so there is nothing stale and the field/bitmap work is skipped.
   72 | fn stale_offsets_for_fragment(
   73 |     fragment: &Fragment,
   74 |     fields: &[i32],
   75 |     index_version: u64,
   76 |     schema: &Schema,
   77 | ) -> Result<RoaringBitmap> {
   78 |     if fragment
   79 |         .overlays
   80 |         .iter()
   81 |         .all(|o| o.committed_version <= index_version)
   82 |     {
   83 |         return Ok(RoaringBitmap::new());
   84 |     }
   85 |     overlay_exclusion_offsets(&fragment.overlays, fields, index_version, schema)
   86 | }
   87 | 
   88 | // A missing `fragment_bitmap` means the index predates fragment-bitmap tracking; treat it as
   89 | // covering every fragment (matching `lance::index::prefilter::DatasetPreFilter::new`) so
   90 | // overlay-stale rows can't slip through unmasked. Only skip fragments explicitly absent from a
   91 | // present bitmap.
   92 | fn covers_fragment(coverage: Option<&RoaringBitmap>, frag_id: u32) -> bool {
   93 |     coverage.is_none_or(|c| c.contains(frag_id))
   94 | }
   95 | 
   96 | /// Index by fragment id the fragments that carry at least one overlay. Overlays are rare, so
   97 | /// this is empty on the common path, letting callers skip index loading entirely; when non-empty
   98 | /// it bounds the stale-collection loops to `O(overlaid fragments)`.
   99 | pub fn overlaid_fragments(fragments: &[Fragment]) -> HashMap<u32, &Fragment> {
  100 |     fragments
  101 |         .iter()
  102 |         .filter(|f| !f.overlays.is_empty())
  103 |         .map(|f| (f.id as u32, f))
  104 |         .collect()
  105 | }
  106 | 
  107 | /// Insert into `stale` the ids of fragments covered by `segment` whose index entries may be
  108 | /// stale because an overlay committed after the segment was built touches a field the segment
  109 | /// indexes. Field-aware and version-gated via [`overlay_exclusion_offsets`].
  110 | ///
  111 | /// `overlaid_frags` holds only the fragments that actually carry overlays (rare), so the loop is
  112 | /// `O(overlaid_frags)` rather than `O(fragments the segment covers)`.
  113 | pub fn collect_overlay_stale_frags(
  114 |     segment: &IndexMetadata,
  115 |     overlaid_frags: &HashMap<u32, &Fragment>,
  116 |     stale: &mut RoaringBitmap,
  117 |     schema: &Schema,
  118 | ) -> Result<()> {
  119 |     let coverage = segment.fragment_bitmap.as_ref();
  120 |     for (&frag_id, fragment) in overlaid_frags {
  121 |         if stale.contains(frag_id) || !covers_fragment(coverage, frag_id) {
  122 |             continue;
  123 |         }
  124 |         if !stale_offsets_for_fragment(fragment, &segment.fields, segment.dataset_version, schema)?
  125 |             .is_empty()
  126 |         {
  127 |             stale.insert(frag_id);
  128 |         }
  129 |     }
  130 |     Ok(())
  131 | }
  132 | 
  133 | /// Like [`collect_overlay_stale_frags`] but with row-level granularity: instead of marking the
  134 | /// whole fragment stale, it computes exactly which row offsets within each covered fragment are
  135 | /// stale and accumulates them into `stale` (fragment_id → stale row offsets).
  136 | ///
  137 | /// Used by the scalar and vector paths to block only the affected rows from index results and
  138 | /// re-evaluate only those rows on the flat path, keeping overhead proportional to the number of
  139 | /// overlaid rows rather than the whole fragment size.
  140 | pub fn collect_overlay_stale_rows_for_segment(
  141 |     segment: &IndexMetadata,
  142 |     overlaid_frags: &HashMap<u32, &Fragment>,
  143 |     stale: &mut HashMap<u32, RoaringBitmap>,
  144 |     schema: &Schema,
  145 | ) -> Result<()> {
  146 |     let coverage = segment.fragment_bitmap.as_ref();
  147 |     for (&frag_id, fragment) in overlaid_frags {
  148 |         if !covers_fragment(coverage, frag_id) {
  149 |             continue;
  150 |         }
  151 |         let excluded =
  152 |             stale_offsets_for_fragment(fragment, &segment.fields, segment.dataset_version, schema)?;
  153 |         if !excluded.is_empty() {
  154 |             *stale.entry(frag_id).or_default() |= &excluded;
  155 |         }
  156 |     }
  157 |     Ok(())
  158 | }
  159 | 
  160 | #[cfg(test)]
  161 | mod tests {
  162 |     use super::*;
  163 |     use crate::format::DataFile;
  164 |     use crate::format::overlay::OverlayCoverage;
  165 | 
  166 |     fn bitmap(offsets: impl IntoIterator<Item = u32>) -> RoaringBitmap {
  167 |         RoaringBitmap::from_iter(offsets)
  168 |     }
  169 | 
  170 |     fn flat_test_schema() -> Schema {
  171 |         use arrow_schema::{DataType, Field as ArrowField, Schema as ArrowSchema};
  172 | 
  173 |         let mut schema = Schema::try_from(&ArrowSchema::new(
  174 |             (0..5)
  175 |                 .map(|id| ArrowField::new(format!("field_{id}"), DataType::Int32, true))
  176 |                 .collect::<Vec<_>>(),
  177 |         ))
  178 |         .unwrap();
  179 |         schema.set_field_id(None);
  180 |         schema
  181 |     }
  182 | 
  183 |     /// `outer: struct<middle: struct<a: i32, b: i32>>`, for the ancestry checks.
  184 |     fn nested_struct_schema() -> Schema {
  185 |         use arrow_schema::{DataType, Field as ArrowField, Fields, Schema as ArrowSchema};
  186 | 
  187 |         let mid = Fields::from(vec![
  188 |             ArrowField::new("a", DataType::Int32, true),
  189 |             ArrowField::new("b", DataType::Int32, true),
  190 |         ]);
  191 |         let outer_fields =
  192 |             Fields::from(vec![ArrowField::new("middle", DataType::Struct(mid), true)]);
  193 |         let mut schema = Schema::try_from(&ArrowSchema::new(vec![ArrowField::new(
  194 |             "outer",
  195 |             DataType::Struct(outer_fields),
  196 |             true,
  197 |         )]))
  198 |         .unwrap();
  199 |         schema.set_field_id(None);
  200 |         schema
  201 |     }
  202 | 
  203 |     /// A dense overlay covering `offsets` for `field_ids`, committed at `version`.
  204 |     fn dense_overlay(
  205 |         field_ids: Vec<i32>,
  206 |         offsets: impl IntoIterator<Item = u32>,
  207 |         version: u64,
  208 |     ) -> DataOverlayFile {
  209 |         DataOverlayFile {
  210 |             data_file: DataFile::new_legacy_from_fields("o.lance", field_ids, None),
  211 |             coverage: OverlayCoverage::dense(bitmap(offsets)),
  212 |             committed_version: version,
  213 |         }
  214 |     }
  215 | 
  216 |     #[test]
  217 |     fn test_exclusion_offsets_version_gate() {
  218 |         let schema = flat_test_schema();
  219 |         // index built at version 5; only overlays committed > 5 are excluded.
  220 |         let overlays = vec![
  221 |             dense_overlay(vec![3], [0, 1], 4),
  222 |             dense_overlay(vec![3], [2, 7], 6),
  223 |         ];
  224 |         let excluded = overlay_exclusion_offsets(&overlays, &[3], 5, &schema).unwrap();
  225 |         assert_eq!(excluded, bitmap([2, 7]));
  226 |         // An overlay exactly at the index version is already incorporated.
  227 |         let overlays = vec![dense_overlay(vec![3], [9], 5)];
  228 |         assert!(
  229 |             overlay_exclusion_offsets(&overlays, &[3], 5, &schema)
  230 |                 .unwrap()
  231 |                 .is_empty()
  232 |         );
  233 |     }
  234 | 
  235 |     #[test]
  236 |     fn test_exclusion_offsets_is_field_aware() {
  237 |         let schema = flat_test_schema();
  238 |         // An overlay touching only an unrelated field excludes nothing.
  239 |         let overlays = vec![dense_overlay(vec![2], [0, 1, 2], 9)];
  240 |         assert!(
  241 |             overlay_exclusion_offsets(&overlays, &[3], 1, &schema)
  242 |                 .unwrap()
  243 |                 .is_empty()
  244 |         );
  245 |         // The union spans only the indexed fields the overlay actually carries.
  246 |         let overlays = vec![dense_overlay(vec![2, 3], [4], 9)];
  247 |         assert_eq!(
  248 |             overlay_exclusion_offsets(&overlays, &[3], 1, &schema).unwrap(),
  249 |             bitmap([4])
  250 |         );
  251 |     }
  252 | 
  253 |     #[test]
  254 |     fn test_exclusion_offsets_matches_nested_fields() {
  255 |         let schema = nested_struct_schema();
  256 |         let outer = &schema.fields[0];
  257 |         let middle = &outer.children[0];
  258 |         let a = &middle.children[0];
  259 |         let b = &middle.children[1];
  260 | 
  261 |         let overlays = vec![dense_overlay(vec![a.id], [1], 9)];
  262 |         assert_eq!(
  263 |             overlay_exclusion_offsets(&overlays, &[outer.id], 1, &schema).unwrap(),
  264 |             bitmap([1])
  265 |         );
  266 |         assert!(
  267 |             overlay_exclusion_offsets(&overlays, &[b.id], 1, &schema)
  268 |                 .unwrap()
  269 |                 .is_empty()
  270 |         );
  271 | 
  272 |         let overlays = vec![dense_overlay(vec![middle.id], [2], 9)];
  273 |         assert_eq!(
  274 |             overlay_exclusion_offsets(&overlays, &[a.id], 1, &schema).unwrap(),
  275 |             bitmap([2])
  276 |         );
  277 |     }
  278 | 
  279 |     #[test]
  280 |     fn test_exclusion_offsets_sparse_per_field() {
  281 |         let schema = flat_test_schema();
  282 |         // Sparse overlay: field 2 covers {2,3}, field 4 covers {1}.
  283 |         let overlay = DataOverlayFile {
  284 |             data_file: DataFile::new_legacy_from_fields("o.lance", vec![2, 4], None),
  285 |             coverage: OverlayCoverage::sparse(vec![bitmap([2, 3]), bitmap([1])]),
  286 |             committed_version: 9,
  287 |         };
  288 |         let overlays = vec![overlay];
  289 |         // Only the bitmap for the indexed field (4) contributes.
  290 |         assert_eq!(
  291 |             overlay_exclusion_offsets(&overlays, &[4], 1, &schema).unwrap(),
  292 |             bitmap([1])
  293 |         );
  294 |         assert_eq!(
  295 |             overlay_exclusion_offsets(&overlays, &[2], 1, &schema).unwrap(),
  296 |             bitmap([2, 3])
  297 |         );
  298 |     }
  299 | 
  300 |     #[test]
  301 |     fn test_exclusion_offsets_unions_multiple_overlays() {
  302 |         let schema = flat_test_schema();
  303 |         let overlays = vec![
  304 |             dense_overlay(vec![3], [1], 6),
  305 |             dense_overlay(vec![3], [4, 5], 7),
  306 |         ];
  307 |         assert_eq!(
  308 |             overlay_exclusion_offsets(&overlays, &[3], 1, &schema).unwrap(),
  309 |             bitmap([1, 4, 5])
  310 |         );
  311 |     }
  312 | 
  313 |     /// An index segment covering `fields`, built at `dataset_version`, with the given
  314 |     /// fragment coverage (`None` = legacy index predating fragment-bitmap tracking).
  315 |     fn segment(
  316 |         fields: Vec<i32>,
  317 |         dataset_version: u64,
  318 |         fragment_bitmap: Option<RoaringBitmap>,
  319 |     ) -> IndexMetadata {
  320 |         IndexMetadata {
  321 |             uuid: uuid::Uuid::new_v4(),
  322 |             name: "idx".into(),
  323 |             fields,
  324 |             covering_fields: vec![],
  325 |             dataset_version,
  326 |             fragment_bitmap,
  327 |             index_details: None,
  328 |             index_version: 0,
  329 |             created_at: None,
  330 |             base_id: None,
  331 |             files: None,
  332 |         }
  333 |     }
  334 | 
  335 |     fn fragment_with_overlay(id: u64, overlay: DataOverlayFile) -> Fragment {
  336 |         let mut fragment = Fragment::new(id);
  337 |         fragment.overlays.push(overlay);
  338 |         fragment
  339 |     }
  340 | 
  341 |     #[test]
  342 |     fn test_collect_frags_missing_bitmap_covers_all() {
  343 |         let schema = flat_test_schema();
  344 |         // A segment with no fragment_bitmap (legacy index predating bitmap tracking) must treat
  345 |         // every overlaid fragment as covered so stale rows can't leak past the index unmasked.
  346 |         let fragment = fragment_with_overlay(3, dense_overlay(vec![3], [1, 2], 9));
  347 |         let overlaid: HashMap<u32, &Fragment> = HashMap::from([(3u32, &fragment)]);
  348 | 
  349 |         let mut stale = RoaringBitmap::new();
  350 |         collect_overlay_stale_frags(&segment(vec![3], 1, None), &overlaid, &mut stale, &schema)
  351 |             .unwrap();
  352 |         assert_eq!(stale, bitmap([3]), "missing bitmap must cover fragment 3");
  353 | 
  354 |         // A present bitmap that excludes fragment 3 leaves it untouched.
  355 |         let mut stale = RoaringBitmap::new();
  356 |         collect_overlay_stale_frags(
  357 |             &segment(vec![3], 1, Some(bitmap([0]))),
  358 |             &overlaid,
  359 |             &mut stale,
  360 |             &schema,
  361 |         )
  362 |         .unwrap();
  363 |         assert!(
  364 |             stale.is_empty(),
  365 |             "fragment absent from bitmap is not covered"
  366 |         );
  367 | 
  368 |         // A present bitmap that includes fragment 3 marks it stale.
  369 |         let mut stale = RoaringBitmap::new();
  370 |         collect_overlay_stale_frags(
  371 |             &segment(vec![3], 1, Some(bitmap([3]))),
  372 |             &overlaid,
  373 |             &mut stale,
  374 |             &schema,
  375 |         )
  376 |         .unwrap();
  377 |         assert_eq!(stale, bitmap([3]));
  378 |     }
  379 | 
  380 |     #[test]
  381 |     fn test_collect_rows_missing_bitmap_covers_all() {
  382 |         let schema = flat_test_schema();
  383 |         // Same covers-all guarantee at row-level granularity.
  384 |         let fragment = fragment_with_overlay(3, dense_overlay(vec![3], [1, 2], 9));
  385 |         let overlaid: HashMap<u32, &Fragment> = HashMap::from([(3u32, &fragment)]);
  386 | 
  387 |         let mut stale = HashMap::new();
  388 |         collect_overlay_stale_rows_for_segment(
  389 |             &segment(vec![3], 1, None),
  390 |             &overlaid,
  391 |             &mut stale,
  392 |             &schema,
  393 |         )
  394 |         .unwrap();
  395 |         assert_eq!(
  396 |             stale.get(&3),
  397 |             Some(&bitmap([1, 2])),
  398 |             "missing bitmap must cover fragment 3"
  399 |         );
  400 | 
  401 |         // A present bitmap that excludes fragment 3 yields no stale rows.
  402 |         let mut stale = HashMap::new();
  403 |         collect_overlay_stale_rows_for_segment(
  404 |             &segment(vec![3], 1, Some(bitmap([0]))),
  405 |             &overlaid,
  406 |             &mut stale,
  407 |             &schema,
  408 |         )
  409 |         .unwrap();
  410 |         assert!(
  411 |             stale.is_empty(),
  412 |             "fragment absent from bitmap contributes no rows"
  413 |         );
  414 |     }
  415 | }
``````
