> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen. Refresh 2026-10-12: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-12-011953c2.md) at `011953c22097b67b699595adbe99e7f0155d83e4` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/transaction/validate.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `0dccf7000d6800d31b634586a11220504649258fbdd5f2d055faaab5c81bcafd`. Reviewed physical lines: 1-755.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Synchronous operation pre-validation, Merge schema/fragment binding guards and physical base-file rewrite detector. validate_operation is publicly reexported; schema validators are pub only inside a private module; rewrite detector is transaction-internal. Seven local tests and three fixtures. (rust/lance-table/src/transaction/validate.rs:1-755)

## Complete range analysis

### Lines 1-17

SPDX and module docs describe pre-commit coherent-manifest checks; imports Fragment/Manifest, deletion-path formatter, Operation/modes/offset map, Field/Schema, core errors, exact file versions and HashMap/HashSet. The introductory promise is broader than individual checks: modern schema validation does not inspect schema membership, and unhandled operation variants return Ok. No IO, async, unsafe, feature gate or mutable input occurs in this file. (rust/lance-table/src/transaction/validate.rs:1-17)

### Lines 18-41

Public validate_operation(manifest:Option<&Manifest>,operation:&Operation)->Result<()> first distinguishes absent dataset. None+Overwrite runs overwrite deletion guard then modern schema-fragment validation through None and returns early; None+Clone returns Ok without checking any payload. Any other None operation returns InvalidInput with Operation::name and non-existent dataset message. Some manifest proceeds to operation dispatch. Public facade reexports only this validator from the private validate module (rust/lance-table/src/transaction.rs:30-55). (rust/lance-table/src/transaction/validate.rs:18-41)

### Lines 42-66

For existing dataset, Append validates supplied fragments against current schema using current manifest format; Project validates existing fragments against proposed schema. Merge runs fragment-preservation, field-binding/schema validation, then format-selected schema-fragment check, in that error precedence. Overwrite first rejects deletion metadata and deliberately passes None, ignoring old manifest format; new fragment exact versions are not consulted by this dispatch. The Append comment says all fields, but that is true only for the legacy helper. preserves_nullability flags and config/base payloads are not checked here. (rust/lance-table/src/transaction/validate.rs:42-66)

### Lines 67-100

Update first checks updated_fragments then new_fragments with current schema/format. Only Some(RewriteColumns) plus Some(updated_fragment_offsets) creates HashSet of updated IDs and rejects an offset-map key absent from that set. Error includes offending ID and requires only rewritten fragment keys. HashMap iteration can choose an unspecified first invalid key. Empty map succeeds, not every updated ID needs an entry, bitmap values/bounds are not checked, and mode None/RewriteRows skips key restriction. Removed IDs/fields/filter/SSTables are ignored locally. All remaining existing-dataset variants return Ok; a newly added variant could therefore bypass validation through wildcard. (rust/lance-table/src/transaction/validate.rs:67-100)

### Lines 101-119

Private overwrite_fragments_valid scans in list order and rejects first Some deletion_file, even a file recording zero or unknown deletions. Error includes fragment ID plus formatted relative deletion path and recommends Delete/Merge. Docs explain new ID assignment would orphan an ID-named deletion file; this helper does not assign IDs, read data, remove files, check overlays/row lineage or mutate anything. Empty fragments pass. Relative path formatter is now fully analyzed (rust/lance-table/src/io/deletion.rs:50-59). (rust/lance-table/src/transaction/validate.rs:101-119)

### Lines 120-136

Private schema_fragments_valid chooses legacy only for manifest exactV1; V2_0,V2_1,V2_2,V2_3 choose modern. None always chooses modern. Selector reads manifest storage format, not per-file raw version, writer flags or row-ID capability. Result is forwarded unchanged; no version consistency or file/overlay validate call occurs. (rust/lance-table/src/transaction/validate.rs:120-136)

### Lines 137-151

pub schema_fragments_modern_valid is inside private non-reexported validate module, thus not an external API. It ignores _schema and scans only fragment.files, rejecting first DataFile with empty fields slice using path in InvalidInput. Empty fragment list or a fragment with no base files passes vacuously; overlays, field IDs, schema coverage, duplicate IDs, column alignment, row counts, tombstones, logical types and physical bytes are not checked. Work is linear in base-file count; successful path has no explicit owned allocation. (rust/lance-table/src/transaction/validate.rs:137-151)

### Lines 152-175

pub schema_fragments_legacy_valid likewise lacks external module route. For each fragment and every schema field in preorder, require any equal ID across base DataFile.fields; otherwise InvalidInput includes fragment ID and debug Field. Extra/masked file IDs and duplicates are allowed. Empty schema or fragment list passes; overlays do not provide coverage. Nested parents must be present. Repeated scanning costs roughly fragments times schema-fields times stored field IDs, plus schema traversal. TODO acknowledges incomplete consolidation with other validate methods. This documents a frozen legacy path, not a recommendation to extend it. (rust/lance-table/src/transaction/validate.rs:152-175)

### Lines 176-201

pub(super) inline merge_fragment_physically_rewritten borrows previous/merged fragment; debug_assert_eq IDs can panic in debug builds only. Differing base-file lengths immediately true; otherwise ordered zip compares path, fields, column_indices, raw major/minor and base_id. Cache size is intentionally excluded because scans can populate it concurrently. Reordering unequal base files counts as rewrite; deletion/overlay/physical-row/row-ID/version changes alone do not. It returns bool without IO or mutation, serving version stamping rather than full data-integrity proof. Contextual Merge builder uses it only when next_row_id is Some (rust/lance-table/src/transaction/manifest_build.rs:1183-1213). (rust/lance-table/src/transaction/validate.rs:176-201)

### Lines 202-221

Private merge_fragments_valid docs say one-to-one preservation/only add columns or rows, but implementation first rejects only a smaller proposed vector length. It permits extra fragments. Then builds HashMap<u64,&Fragment>, retaining last proposed occurrence of each ID. No ID uniqueness/sort check; extra duplicates can satisfy count check while map hides earlier entries. O(proposed count) expected map construction and reference storage. (rust/lance-table/src/transaction/validate.rs:202-221)

### Lines 222-256

Scan every original fragment. Matching ID must preserve exact Option<usize> physical_rows, including None versus Some(0); mismatch returns immediately with ID and old/new values. Missing originals accumulate in Vec, then one InvalidInput reports missing IDs, original IDs and map keys (last list unordered). An encountered row-count mismatch takes precedence over accumulated missing IDs. The helper checks neither files/deletions/overlays/lineage nor actual rows. Empty original accepts any proposed list. It enforces inclusion and same stored count, not one-to-one identity. (rust/lance-table/src/transaction/validate.rs:222-256)

### Lines 257-279

Private merge_schema_valid documents stable field-ID/path bindings, guarded semantic changes, new IDs above prior maximum, materialized fresh-ID casts and legal drops/metadata changes. It borrows prior schema and collects proposed fragments into last-ID-wins HashMap. Docs say every proposed fragment must materialize shared changed IDs, but the helper called below visits only original manifest fragments; separately the fresh-ID path checks every proposed fragment. No full Schema::validate invocation here. (rust/lance-table/src/transaction/validate.rs:257-279)

### Lines 280-308

First pass follows proposed schema preorder for IDs that exist in prior schema. Compute both paths through field_path? and reject unequal paths with ID, old/new path and derive-from-current-schema guidance. Then shared_field_binding_changes tests type/nullability/encoding/dictionary; if changed and rewrite predicate false, return contextual InvalidInput listing changes. Shared paths cannot move even with rewritten bytes. Errors from path resolution propagate before later max-ID/fresh-path clauses. Metadata and other Field attributes are excluded from semantic comparison. (rust/lance-table/src/transaction/validate.rs:280-308)

### Lines 309-328

Second pass computes manifest.max_field_id and rejects any ID absent from prior schema but <=maximum, including previously dropped file IDs. Diagnostic contains proposed ID/path, prior maximum and checked next ID; i32 maximum yields explicit exhausted message rather than overflow. Existing prior IDs are exempt. There is no local positive-ID or duplicate-ID check. Manifest maximum includes schema, base and overlay IDs (rust/lance-table/src/format/manifest.rs:466-485). (rust/lance-table/src/transaction/validate.rs:309-328)

### Lines 329-359

Build prior path->Field map, then visit each proposed field whose ID is absent from prior schema. If its path existed before, require every proposed fragment to contain new ID in some base file; missing materialization errors with path/old/new ID. Entirely new paths need no such materialization here; modern final validation also ignores schema completeness. Empty proposed fragments pass all(), subject to earlier merge fragment guard in validate_operation. New-ID remap does not require old paths/files removed or new base path physically different. Dropped fields and field metadata edits remain untested by these passes. (rust/lance-table/src/transaction/validate.rs:329-359)

### Lines 360-390

Private is_field_binding_fully_rewritten visits only original fragments, not additional proposed IDs. Each original needs a map match and a proposed base file carrying field_id even if original lacked it. For each prior base/overlay file carrying ID, no proposed base/overlay may carry same ID with identical base_id and path. Identity ignores sizes/raw versions/column mapping/content/overlay coverage/version; None base differs from Some. Retaining the path with that ID removed can pass. No file contents or object identity beyond these metadata strings checked. Empty prior manifest returns true. Nested per-field file scans can be quadratic in referenced files, with no extra collection inside helper. This differs from broader every-proposed-fragment prose above. (rust/lance-table/src/transaction/validate.rs:360-390)

### Lines 391-417

Private shared_field_binding_changes allocates Vec capacity4; compares exact logical_type,nullable,encoding,dictionary in fixed order. Changed first three produce old->new strings, dictionary just the word dictionary. Returns None if none changed, else joined comma-space String. Dictionary equality delegates its datatype implementation; schema field metadata/name/ID/parent/children outside recursive caller traversal/storage-related other flags are not compared here. No semantic type coercion or relaxed-nullability option. (rust/lance-table/src/transaction/validate.rs:391-417)

### Lines 418-447

cfg(test) module imports overlays/files/storage format, Arrow/Lance types, roaring and Arc/maps. First test constructs two-field Int32/Utf8 schema and three empty metadata fragments IDs1,2,3 in V2_0 manifest; no files/physical counts. Calls private merge-fragment helper directly, bypassing schema checks and store IO. (rust/lance-table/src/transaction/validate.rs:418-447)

### Lines 448-474

First preservation test rejects empty proposed list with reduced-count substring; same-length IDs1,2,4 reject missing-original substring. Assertions check result error and textual category, not exact full message or variant. No runtime execution performed. (rust/lance-table/src/transaction/validate.rs:448-474)

### Lines 475-506

Same test rejects shorter1,2 list, accepts all originals plus4,5 and accepts exact original ID list. All physical_rows remain None; does not test changed row counts, duplicate IDs or file preservation. Demonstrates extra fragments accepted despite one-to-one wording. (rust/lance-table/src/transaction/validate.rs:475-506)

### Lines 507-532

Three private fixtures: one_field_schema creates nullable Int32 a; fragment_with_file_fields creates Fragment then one legacy metadata DataFile with supplied path/IDs; manifest_with_file_fields wraps fragment0 f.lance in V2_0 manifest. Fixture per-file version and manifest version differ; tests reason about metadata guards, not actual encoded data. (rust/lance-table/src/transaction/validate.rs:507-532)

### Lines 533-555

rstest has two named cases: logical_type Float32/nullabletrue and nullability Int32/false; additional test attribute present. Two prior fragments0/1 each contain field0, with old paths and V2_0 manifest. Proposed schema changes logical_type and nullable from parameters; count/data bytes absent. (rust/lance-table/src/transaction/validate.rs:533-555)

### Lines 556-572

Shared-ID test accepts both new paths, rejects one rewritten plus one retained old path; asserts InvalidInput and rewrite-required substring. This is multi-fragment coverage for two semantic change categories, not encoding/dictionary variants or physical verification. (rust/lance-table/src/transaction/validate.rs:556-572)

### Lines 573-599

Dictionary regression constructs UInt32->Utf8 nullable schema and dictionary offset100,length5,valuesNone; prior metadata fragment0 old.lance. Comment describes former comparison behavior, but no historical source/release is inspected; only current test is authoritative. (rust/lance-table/src/transaction/validate.rs:573-599)

### Lines 600-627

Unchanged dictionary yields None changes and schema validation succeeds while retaining old file. Moving offset to200 yields exactly Some(dictionary), then InvalidInput and precise field0 d rewrite-required substring. Length/value variations are not tested. Uses metadata only; no dictionary buffer load. (rust/lance-table/src/transaction/validate.rs:600-627)

### Lines 628-656

Retained-overlay test changes field0 nullability, supplies new base path but keeps prior old-overlay.lance carrying0 with shared bitmap{0} and version1. Requires InvalidInput rewrite-required diagnostic. Overlay uses legacy DataFile metadata under V2_0 manifest and no actual values read. Demonstrates both old base and overlay identity matter for schema binding guard. (rust/lance-table/src/transaction/validate.rs:628-656)

### Lines 657-668

Fresh-ID test changes same path a from ID0 to1 and supplies replacement file fields[1], then private merge_schema_valid succeeds. Single fragment only, no missing-materialization failure, no removed old-file assertion or public validator call. (rust/lance-table/src/transaction/validate.rs:657-668)

### Lines 669-690

Max-ID test includes i32::MAX in base file fields though schema only has0, confirms manifest maximum, then adds new field b ID1 and requires InvalidInput containing assigns id1 and exhausted. This covers checked next-ID diagnostic without overflow and IDs retained outside current schema. (rust/lance-table/src/transaction/validate.rs:669-690)

### Lines 691-723

Regression comment links issue6417 and describes LEGACY-to-STABLE omission of struct parents. Builds root id/name/address struct with city/country; old manifest exactV1 and one empty fragment0. Link is source evidence only; no network/history queried. (rust/lance-table/src/transaction/validate.rs:691-723)

### Lines 724-755

Proposed fixture names itself stable_fragment and omits parentID2, using fields0,1,3,4 and columns0,1,2,3 with physical_rows10. However constructor explicitly receives ConcreteFileVersion::V1 at732, contrary to STABLE comments. Overwrite contains no config/bases, and validate_operation(Some(oldV1),...) unwrap succeeds because Overwrite always selects modern check. Test proves old-manifest bypass, not real stable-file compatibility or actual writer output. File ends;7 test functions (one2-case rstest),3 fixture helpers; no local direct tests of Clone/None, deletion overwrite rejection, generic modern/legacy checks, offset-key guard, physical-rewrite detector or several malformed schema cases. Contextual manifest-build test covers stray offset key (rust/lance-table/src/transaction/manifest_build.rs:3643-3693). (rust/lance-table/src/transaction/validate.rs:724-755)

## Interaction and interpretation limits

All755 physical lines fully read in three bounded outputs. No source modification or runtime tests. Narrow caller snippets identify CommitBuilder::execute validation and Merge version-stamping, without claiming complete commit ordering or storage safety. Local validation returns borrowed-input results and does no IO; caller may already have performed IO before entry (rust/lance/src/dataset/write/commit.rs:395-425). Full codec/manifest/index/commit implementation remains pending. Comment/code differences in all-proposed materialization and stable test fixture are explicitly retained.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Pre-commit validation of an operation against the manifest it applies to.
    5 | //!
    6 | //! These checks reject transactions that could not produce a coherent manifest —
    7 | //! a fragment list that disagrees with the schema, a merge that silently dropped
    8 | //! or rewrote data files — before any manifest is written.
    9 | 
   10 | use crate::format::{Fragment, Manifest};
   11 | use crate::io::deletion::relative_deletion_file_path;
   12 | use crate::transaction::{Operation, UpdateMode, UpdatedFragmentOffsets};
   13 | use lance_core::datatypes::{Field, Schema};
   14 | use lance_core::{Error, Result};
   15 | use lance_file::version::ConcreteFileVersion;
   16 | use std::collections::{HashMap, HashSet};
   17 | 
   18 | /// Validate the operation is valid for the given manifest.
   19 | pub fn validate_operation(manifest: Option<&Manifest>, operation: &Operation) -> Result<()> {
   20 |     let manifest = match (manifest, operation) {
   21 |         (
   22 |             None,
   23 |             Operation::Overwrite {
   24 |                 fragments, schema, ..
   25 |             },
   26 |         ) => {
   27 |             // Validate here because we are going to return early.
   28 |             overwrite_fragments_valid(fragments)?;
   29 |             schema_fragments_valid(None, schema, fragments)?;
   30 | 
   31 |             return Ok(());
   32 |         }
   33 |         (None, Operation::Clone { .. }) => return Ok(()),
   34 |         (Some(manifest), _) => manifest,
   35 |         (None, _) => {
   36 |             return Err(Error::invalid_input(format!(
   37 |                 "Cannot apply operation {} to non-existent dataset",
   38 |                 operation.name()
   39 |             )));
   40 |         }
   41 |     };
   42 | 
   43 |     match operation {
   44 |         Operation::Append { fragments } => {
   45 |             // Fragments must contain all fields in the schema
   46 |             schema_fragments_valid(Some(manifest), &manifest.schema, fragments)
   47 |         }
   48 |         Operation::Project { schema, .. } => {
   49 |             schema_fragments_valid(Some(manifest), schema, manifest.fragments.as_ref())
   50 |         }
   51 |         Operation::Merge {
   52 |             fragments, schema, ..
   53 |         } => {
   54 |             merge_fragments_valid(manifest, fragments)?;
   55 |             merge_schema_valid(manifest, schema, fragments)?;
   56 |             schema_fragments_valid(Some(manifest), schema, fragments)
   57 |         }
   58 |         Operation::Overwrite {
   59 |             fragments, schema, ..
   60 |         } => {
   61 |             overwrite_fragments_valid(fragments)?;
   62 |             // Pass None for manifest because Overwrite replaces all fragments.
   63 |             // The old manifest's storage format is irrelevant for validating
   64 |             // the new fragments (e.g., LEGACY→STABLE transitions).
   65 |             schema_fragments_valid(None, schema, fragments)
   66 |         }
   67 |         Operation::Update {
   68 |             updated_fragments,
   69 |             new_fragments,
   70 |             updated_fragment_offsets,
   71 |             update_mode,
   72 |             ..
   73 |         } => {
   74 |             schema_fragments_valid(Some(manifest), &manifest.schema, updated_fragments)?;
   75 |             schema_fragments_valid(Some(manifest), &manifest.schema, new_fragments)?;
   76 |             // Key-presence check only applies to RewriteColumns: that is the only
   77 |             // mode where build_manifest stamps version metadata using off_map keys,
   78 |             // so a stray key can corrupt an unrelated fragment's metadata.
   79 |             // Other modes (e.g. rewrite_rows) may supply offsets for fragments
   80 |             // outside updated_fragments for their own purposes.
   81 |             if matches!(update_mode, Some(UpdateMode::RewriteColumns))
   82 |                 && let Some(UpdatedFragmentOffsets(off_map)) = updated_fragment_offsets
   83 |             {
   84 |                 let updated_ids: HashSet<u64> = updated_fragments.iter().map(|f| f.id).collect();
   85 |                 for &frag_id in off_map.keys() {
   86 |                     if !updated_ids.contains(&frag_id) {
   87 |                         return Err(Error::invalid_input(format!(
   88 |                             "updatedFragmentOffsets key {} is not in updated_fragments; \
   89 |                              offsets must reference only fragments being rewritten",
   90 |                             frag_id
   91 |                         )));
   92 |                     }
   93 |                 }
   94 |             }
   95 |             Ok(())
   96 |         }
   97 |         _ => Ok(()),
   98 |     }
   99 | }
  100 | 
  101 | // An overwrite's fragments are newly written, so they are given fresh ids at
  102 | // commit time. A deletion file cannot come along for that ride: its path embeds
  103 | // the fragment id, so renumbering the fragment would orphan the deletion vector
  104 | // and silently resurrect deleted rows.
  105 | fn overwrite_fragments_valid(fragments: &[Fragment]) -> Result<()> {
  106 |     for fragment in fragments {
  107 |         if let Some(deletion_file) = &fragment.deletion_file {
  108 |             return Err(Error::invalid_input(format!(
  109 |                 "Overwrite fragments must be newly written, but fragment {} carries \
  110 |                  deletion file {}. Use Delete to commit deletions against existing \
  111 |                  fragments, or Merge to change their schema.",
  112 |                 fragment.id,
  113 |                 relative_deletion_file_path(fragment.id, deletion_file)
  114 |             )));
  115 |         }
  116 |     }
  117 |     Ok(())
  118 | }
  119 | 
  120 | fn schema_fragments_valid(
  121 |     manifest: Option<&Manifest>,
  122 |     schema: &Schema,
  123 |     fragments: &[Fragment],
  124 | ) -> Result<()> {
  125 |     if let Some(manifest) = manifest {
  126 |         return match manifest.data_storage_format.lance_file_format() {
  127 |             ConcreteFileVersion::V1 => schema_fragments_legacy_valid(schema, fragments),
  128 |             ConcreteFileVersion::V2_0
  129 |             | ConcreteFileVersion::V2_1
  130 |             | ConcreteFileVersion::V2_2
  131 |             | ConcreteFileVersion::V2_3 => schema_fragments_modern_valid(schema, fragments),
  132 |         };
  133 |     }
  134 |     schema_fragments_modern_valid(schema, fragments)
  135 | }
  136 | 
  137 | pub fn schema_fragments_modern_valid(_schema: &Schema, fragments: &[Fragment]) -> Result<()> {
  138 |     // validate that each data file at least contains one field.
  139 |     for fragment in fragments {
  140 |         for data_file in &fragment.files {
  141 |             if data_file.fields.iter().len() == 0 {
  142 |                 return Err(Error::invalid_input(format!(
  143 |                     "Datafile {} does not contain any fields",
  144 |                     data_file.path
  145 |                 )));
  146 |             }
  147 |         }
  148 |     }
  149 |     Ok(())
  150 | }
  151 | 
  152 | /// Check that each fragment contains all fields in the schema.
  153 | /// It is not required that the schema contains all fields in the fragment.
  154 | /// There may be masked fields.
  155 | pub fn schema_fragments_legacy_valid(schema: &Schema, fragments: &[Fragment]) -> Result<()> {
  156 |     // TODO: add additional validation. Consider consolidating with various
  157 |     // validate() methods in the codebase.
  158 |     for fragment in fragments {
  159 |         for field in schema.fields_pre_order() {
  160 |             if !fragment
  161 |                 .files
  162 |                 .iter()
  163 |                 .flat_map(|f| f.fields.iter())
  164 |                 .any(|f_id| f_id == &field.id)
  165 |             {
  166 |                 return Err(Error::invalid_input(format!(
  167 |                     "Fragment {} does not contain field {:?}",
  168 |                     fragment.id, field
  169 |                 )));
  170 |             }
  171 |         }
  172 |     }
  173 |     Ok(())
  174 | }
  175 | 
  176 | /// Returns true if Operation::Merge rewrote this fragment's column data files (Fragment::files
  177 | /// changed versus the previous manifest). Used to bump last_updated_at_version_meta only when
  178 | /// new column values were materialized to disk.
  179 | ///
  180 | /// Deletion file changes alone are not treated as rewrites: tombstones remove rows but
  181 | /// survivors did not receive new column bytes; stamping last_updated for those rows would be
  182 | /// incorrect for CDF.
  183 | #[inline]
  184 | pub(super) fn merge_fragment_physically_rewritten(prev: &Fragment, merged: &Fragment) -> bool {
  185 |     debug_assert_eq!(prev.id, merged.id);
  186 |     if prev.files.len() != merged.files.len() {
  187 |         return true;
  188 |     }
  189 |     // Compare identity fields only. file_size_bytes is an AtomicU64 cache that
  190 |     // concurrent scans can populate in place on the manifest's DataFile, so it
  191 |     // must not be part of the rewrite check.
  192 |     prev.files.iter().zip(merged.files.iter()).any(|(p, m)| {
  193 |         p.path != m.path
  194 |             || p.fields != m.fields
  195 |             || p.column_indices != m.column_indices
  196 |             || p.file_major_version != m.file_major_version
  197 |             || p.file_minor_version != m.file_minor_version
  198 |             || p.base_id != m.base_id
  199 |     })
  200 | }
  201 | 
  202 | /// Validate that Merge operations preserve all original fragments.
  203 | /// Merge operations should only add columns or rows, not reduce fragments.
  204 | /// This ensures fragments correspond at one-to-one with the original fragment list.
  205 | fn merge_fragments_valid(manifest: &Manifest, new_fragments: &[Fragment]) -> Result<()> {
  206 |     let original_fragments = manifest.fragments.as_ref();
  207 | 
  208 |     // Additional validation: ensure we're not accidentally reducing the fragment count
  209 |     if new_fragments.len() < original_fragments.len() {
  210 |         return Err(Error::invalid_input(format!(
  211 |             "Merge operation reduced fragment count from {} to {}. \
  212 |              Merge operations should only add columns, not reduce fragments.",
  213 |             original_fragments.len(),
  214 |             new_fragments.len()
  215 |         )));
  216 |     }
  217 | 
  218 |     // Collect new fragment IDs
  219 |     let new_fragment_map: HashMap<u64, &Fragment> =
  220 |         new_fragments.iter().map(|f| (f.id, f)).collect();
  221 | 
  222 |     // Check that all original fragments are preserved in the new fragments list
  223 |     // Validate that each original fragment's metadata is preserved
  224 |     let mut missing_fragments: Vec<u64> = Vec::new();
  225 |     for original_fragment in original_fragments {
  226 |         if let Some(new_fragment) = new_fragment_map.get(&original_fragment.id) {
  227 |             // Validate physical_rows (row count) hasn't changed
  228 |             if original_fragment.physical_rows != new_fragment.physical_rows {
  229 |                 return Err(Error::invalid_input(format!(
  230 |                     "Merge operation changed row count for fragment {}. \
  231 |                      Original: {:?}, New: {:?}. \
  232 |                      Merge operations should preserve fragment row counts and only add new columns.",
  233 |                     original_fragment.id,
  234 |                     original_fragment.physical_rows,
  235 |                     new_fragment.physical_rows
  236 |                 )));
  237 |             }
  238 |         } else {
  239 |             missing_fragments.push(original_fragment.id);
  240 |         }
  241 |     }
  242 | 
  243 |     if !missing_fragments.is_empty() {
  244 |         return Err(Error::invalid_input(format!(
  245 |             "Merge operation is missing original fragments: {:?}. \
  246 |              Merge operations should preserve all original fragments and only add new columns. \
  247 |              Expected fragments: {:?}, but got: {:?}",
  248 |             missing_fragments,
  249 |             original_fragments.iter().map(|f| f.id).collect::<Vec<_>>(),
  250 |             new_fragment_map.keys().copied().collect::<Vec<_>>()
  251 |         )));
  252 |     }
  253 | 
  254 |     Ok(())
  255 | }
  256 | 
  257 | /// Validate that a Merge schema preserves the dataset's field id bindings.
  258 | ///
  259 | /// Readers resolve columns by field id (name -> schema id -> DataFile::fields
  260 | /// position), so renumbered ids silently rebind live columns to other columns'
  261 | /// bytes. Shared ids must keep their field path. Their logical type,
  262 | /// nullability, storage encoding, and dictionary may change only when every
  263 | /// existing base or overlay file carrying the id is replaced and every
  264 | /// proposed fragment materializes the id in a base data file. New ids must
  265 | /// exceed the manifest's max so a dropped field's id is never reused. An
  266 | /// existing path may move to a fresh id only when every proposed fragment
  267 | /// materializes that id in a base data file (the `alter_columns` cast path).
  268 | /// Omitting a field (dropping it) and updating field metadata remain legal.
  269 | fn merge_schema_valid(
  270 |     manifest: &Manifest,
  271 |     new_schema: &Schema,
  272 |     fragments: &[Fragment],
  273 | ) -> Result<()> {
  274 |     let prior_schema = &manifest.schema;
  275 |     let new_fragment_map: HashMap<u64, &Fragment> = fragments
  276 |         .iter()
  277 |         .map(|fragment| (fragment.id, fragment))
  278 |         .collect();
  279 | 
  280 |     // Remap and semantic errors first: a renumbered schema usually violates
  281 |     // both the shared-id and new-id clauses.
  282 |     for field in new_schema.fields_pre_order() {
  283 |         let Some(prior_field) = prior_schema.field_by_id(field.id) else {
  284 |             continue;
  285 |         };
  286 |         let prior_path = prior_schema.field_path(field.id)?;
  287 |         let new_path = new_schema.field_path(field.id)?;
  288 |         if prior_path != new_path {
  289 |             return Err(Error::invalid_input(format!(
  290 |                 "Merge operation remaps field id {} from \"{}\" to \"{}\". \
  291 |                  Merge must preserve the dataset's field ids: derive the new schema \
  292 |                  from the dataset's current schema instead of renumbering fields.",
  293 |                 field.id, prior_path, new_path
  294 |             )));
  295 |         }
  296 |         if let Some(changes) = shared_field_binding_changes(prior_field, field)
  297 |             && !is_field_binding_fully_rewritten(manifest, &new_fragment_map, field.id)
  298 |         {
  299 |             return Err(Error::invalid_input(format!(
  300 |                 "Merge operation changes field id {} (\"{}\") without rewriting it in \
  301 |                  every existing fragment: {}. Merge must preserve each existing field's \
  302 |                  logical type, nullability, storage encoding, and dictionary unless all \
  303 |                  existing base and overlay files carrying that field are replaced.",
  304 |                 field.id, new_path, changes
  305 |             )));
  306 |         }
  307 |     }
  308 | 
  309 |     let max_field_id = manifest.max_field_id();
  310 |     for field in new_schema.fields_pre_order() {
  311 |         if prior_schema.field_by_id(field.id).is_none() && field.id <= max_field_id {
  312 |             let next_id_msg = match max_field_id.checked_add(1) {
  313 |                 Some(next_id) => format!("New fields must use ids of at least {}.", next_id),
  314 |                 None => {
  315 |                     "No further field id can be allocated because ids are exhausted.".to_string()
  316 |                 }
  317 |             };
  318 |             return Err(Error::invalid_input(format!(
  319 |                 "Merge operation assigns id {} to new field \"{}\", but ids up to {} are \
  320 |                  already used by current or dropped fields. {}",
  321 |                 field.id,
  322 |                 new_schema.field_path(field.id)?,
  323 |                 max_field_id,
  324 |                 next_id_msg
  325 |             )));
  326 |         }
  327 |     }
  328 | 
  329 |     let mut prior_paths = HashMap::with_capacity(prior_schema.fields_pre_order().count());
  330 |     for field in prior_schema.fields_pre_order() {
  331 |         prior_paths.insert(prior_schema.field_path(field.id)?, field);
  332 |     }
  333 |     for field in new_schema.fields_pre_order() {
  334 |         if prior_schema.field_by_id(field.id).is_some() {
  335 |             continue;
  336 |         }
  337 |         let new_path = new_schema.field_path(field.id)?;
  338 |         let Some(prior_field) = prior_paths.get(&new_path) else {
  339 |             continue;
  340 |         };
  341 |         let materialized = fragments.iter().all(|fragment| {
  342 |             fragment
  343 |                 .files
  344 |                 .iter()
  345 |                 .any(|file| file.fields.contains(&field.id))
  346 |         });
  347 |         if !materialized {
  348 |             return Err(Error::invalid_input(format!(
  349 |                 "Merge operation remaps existing field \"{}\" from id {} to id {} without \
  350 |                  rewriting its data. Every proposed fragment must materialize the new field \
  351 |                  id in a base data file.",
  352 |                 new_path, prior_field.id, field.id
  353 |             )));
  354 |         }
  355 |     }
  356 | 
  357 |     Ok(())
  358 | }
  359 | 
  360 | fn is_field_binding_fully_rewritten(
  361 |     manifest: &Manifest,
  362 |     new_fragment_map: &HashMap<u64, &Fragment>,
  363 |     field_id: i32,
  364 | ) -> bool {
  365 |     manifest.fragments.iter().all(|prior_fragment| {
  366 |         let Some(new_fragment) = new_fragment_map.get(&prior_fragment.id) else {
  367 |             return false;
  368 |         };
  369 | 
  370 |         let is_materialized = new_fragment
  371 |             .files
  372 |             .iter()
  373 |             .any(|file| file.fields.contains(&field_id));
  374 |         if !is_materialized {
  375 |             return false;
  376 |         }
  377 | 
  378 |         prior_fragment
  379 |             .referenced_lance_files()
  380 |             .filter(|file| file.fields.contains(&field_id))
  381 |             .all(|prior_file| {
  382 |                 !new_fragment.referenced_lance_files().any(|new_file| {
  383 |                     new_file.fields.contains(&field_id)
  384 |                         && new_file.base_id == prior_file.base_id
  385 |                         && new_file.path == prior_file.path
  386 |                 })
  387 |             })
  388 |     })
  389 | }
  390 | 
  391 | fn shared_field_binding_changes(prior: &Field, new: &Field) -> Option<String> {
  392 |     let mut changes = Vec::with_capacity(4);
  393 |     if prior.logical_type != new.logical_type {
  394 |         changes.push(format!(
  395 |             "logical type {} -> {}",
  396 |             prior.logical_type, new.logical_type
  397 |         ));
  398 |     }
  399 |     if prior.nullable != new.nullable {
  400 |         changes.push(format!("nullable {} -> {}", prior.nullable, new.nullable));
  401 |     }
  402 |     if prior.encoding != new.encoding {
  403 |         changes.push(format!(
  404 |             "storage encoding {:?} -> {:?}",
  405 |             prior.encoding, new.encoding
  406 |         ));
  407 |     }
  408 |     if prior.dictionary != new.dictionary {
  409 |         changes.push("dictionary".to_string());
  410 |     }
  411 |     if changes.is_empty() {
  412 |         None
  413 |     } else {
  414 |         Some(changes.join(", "))
  415 |     }
  416 | }
  417 | 
  418 | #[cfg(test)]
  419 | mod tests {
  420 |     use super::*;
  421 |     use crate::format::overlay::{DataOverlayFile, OverlayCoverage};
  422 |     use crate::format::{DataFile, DataStorageFormat};
  423 |     use arrow_schema::{DataType, Field as ArrowField, Schema as ArrowSchema};
  424 |     use lance_core::datatypes::{Field as LanceCoreField, LogicalType, Schema as LanceSchema};
  425 |     use roaring::RoaringBitmap;
  426 |     use std::collections::HashMap;
  427 |     use std::sync::Arc;
  428 | 
  429 |     #[test]
  430 |     fn test_merge_fragments_valid() {
  431 |         // Create a simple schema for testing
  432 |         let schema = ArrowSchema::new(vec![
  433 |             ArrowField::new("id", DataType::Int32, false),
  434 |             ArrowField::new("name", DataType::Utf8, false),
  435 |         ]);
  436 | 
  437 |         // Create original fragments
  438 |         let original_fragments = vec![Fragment::new(1), Fragment::new(2), Fragment::new(3)];
  439 | 
  440 |         // Create a manifest with original fragments
  441 |         let manifest = Manifest::new(
  442 |             LanceSchema::try_from(&schema).unwrap(),
  443 |             Arc::new(original_fragments),
  444 |             DataStorageFormat::new(ConcreteFileVersion::V2_0),
  445 |             HashMap::new(),
  446 |         );
  447 | 
  448 |         // Test 1: Empty fragments should fail
  449 |         let empty_fragments = vec![];
  450 |         let result = merge_fragments_valid(&manifest, &empty_fragments);
  451 |         assert!(result.is_err());
  452 |         assert!(
  453 |             result
  454 |                 .unwrap_err()
  455 |                 .to_string()
  456 |                 .contains("reduced fragment count")
  457 |         );
  458 | 
  459 |         // Test 2: Missing original fragments should fail
  460 |         let missing_fragments = vec![
  461 |             Fragment::new(1),
  462 |             Fragment::new(2),
  463 |             // Fragment 3 is missing
  464 |             Fragment::new(4), // New fragment
  465 |         ];
  466 |         let result = merge_fragments_valid(&manifest, &missing_fragments);
  467 |         assert!(result.is_err());
  468 |         assert!(
  469 |             result
  470 |                 .unwrap_err()
  471 |                 .to_string()
  472 |                 .contains("missing original fragments")
  473 |         );
  474 | 
  475 |         // Test 3: Reduced fragment count should fail
  476 |         let reduced_fragments = vec![
  477 |             Fragment::new(1),
  478 |             Fragment::new(2),
  479 |             // Fragment 3 is missing, no new fragments added
  480 |         ];
  481 |         let result = merge_fragments_valid(&manifest, &reduced_fragments);
  482 |         assert!(result.is_err());
  483 |         assert!(
  484 |             result
  485 |                 .unwrap_err()
  486 |                 .to_string()
  487 |                 .contains("reduced fragment count")
  488 |         );
  489 | 
  490 |         // Test 4: Valid merge with all original fragments plus new ones should succeed
  491 |         let valid_fragments = vec![
  492 |             Fragment::new(1),
  493 |             Fragment::new(2),
  494 |             Fragment::new(3),
  495 |             Fragment::new(4), // New fragment
  496 |             Fragment::new(5), // Another new fragment
  497 |         ];
  498 |         let result = merge_fragments_valid(&manifest, &valid_fragments);
  499 |         assert!(result.is_ok());
  500 | 
  501 |         // Test 5: Same fragments (no new ones) should succeed
  502 |         let same_fragments = vec![Fragment::new(1), Fragment::new(2), Fragment::new(3)];
  503 |         let result = merge_fragments_valid(&manifest, &same_fragments);
  504 |         assert!(result.is_ok());
  505 |     }
  506 | 
  507 |     fn one_field_schema() -> LanceSchema {
  508 |         LanceSchema::try_from(&ArrowSchema::new(vec![ArrowField::new(
  509 |             "a",
  510 |             DataType::Int32,
  511 |             true,
  512 |         )]))
  513 |         .unwrap()
  514 |     }
  515 | 
  516 |     fn fragment_with_file_fields(id: u64, path: &str, fields: Vec<i32>) -> Fragment {
  517 |         let mut fragment = Fragment::new(id);
  518 |         fragment
  519 |             .files
  520 |             .push(DataFile::new_legacy_from_fields(path, fields, None));
  521 |         fragment
  522 |     }
  523 | 
  524 |     fn manifest_with_file_fields(schema: LanceSchema, fields: Vec<i32>) -> Manifest {
  525 |         Manifest::new(
  526 |             schema,
  527 |             Arc::new(vec![fragment_with_file_fields(0, "f.lance", fields)]),
  528 |             DataStorageFormat::new(ConcreteFileVersion::V2_0),
  529 |             HashMap::new(),
  530 |         )
  531 |     }
  532 | 
  533 |     #[rstest::rstest]
  534 |     #[case::logical_type(DataType::Float32, true)]
  535 |     #[case::nullability(DataType::Int32, false)]
  536 |     #[test]
  537 |     fn test_merge_shared_id_change_requires_full_rewrite(
  538 |         #[case] data_type: DataType,
  539 |         #[case] nullable: bool,
  540 |     ) {
  541 |         let schema = one_field_schema();
  542 |         let prior_fragments = vec![
  543 |             fragment_with_file_fields(0, "old-0.lance", vec![0]),
  544 |             fragment_with_file_fields(1, "old-1.lance", vec![0]),
  545 |         ];
  546 |         let manifest = Manifest::new(
  547 |             schema.clone(),
  548 |             Arc::new(prior_fragments.clone()),
  549 |             DataStorageFormat::new(ConcreteFileVersion::V2_0),
  550 |             HashMap::new(),
  551 |         );
  552 |         let mut new_schema = schema;
  553 |         new_schema.fields[0].logical_type = LogicalType::try_from(&data_type).unwrap();
  554 |         new_schema.fields[0].nullable = nullable;
  555 | 
  556 |         let rewritten_fragments = vec![
  557 |             fragment_with_file_fields(0, "new-0.lance", vec![0]),
  558 |             fragment_with_file_fields(1, "new-1.lance", vec![0]),
  559 |         ];
  560 |         merge_schema_valid(&manifest, &new_schema, &rewritten_fragments).unwrap();
  561 | 
  562 |         let partially_rewritten = vec![rewritten_fragments[0].clone(), prior_fragments[1].clone()];
  563 |         let err = merge_schema_valid(&manifest, &new_schema, &partially_rewritten).unwrap_err();
  564 |         assert!(matches!(err, Error::InvalidInput { .. }), "got {:?}", err);
  565 |         assert!(
  566 |             err.to_string()
  567 |                 .contains("without rewriting it in every existing fragment"),
  568 |             "unexpected error: {}",
  569 |             err
  570 |         );
  571 |     }
  572 | 
  573 |     #[test]
  574 |     fn test_merge_preserved_dictionary_not_flagged() {
  575 |         // The manifest schema stores a dictionary as offset/length with no
  576 |         // attached values, so an unchanged dictionary must not count as a field
  577 |         // change (which would demand a full rewrite). The moved-offset half
  578 |         // passes under the old comparison too, where every dictionary looked
  579 |         // changed; it is here to pin that offset stays part of the identity.
  580 |         let dictionary = lance_core::datatypes::Dictionary {
  581 |             offset: 100,
  582 |             length: 5,
  583 |             values: None,
  584 |         };
  585 |         let schema = LanceSchema::try_from(&ArrowSchema::new(vec![ArrowField::new(
  586 |             "d",
  587 |             DataType::Dictionary(Box::new(DataType::UInt32), Box::new(DataType::Utf8)),
  588 |             true,
  589 |         )]))
  590 |         .unwrap();
  591 |         let mut prior_schema = schema.clone();
  592 |         prior_schema.fields[0].dictionary = Some(dictionary.clone());
  593 |         let manifest = Manifest::new(
  594 |             prior_schema,
  595 |             Arc::new(vec![fragment_with_file_fields(0, "old.lance", vec![0])]),
  596 |             DataStorageFormat::new(ConcreteFileVersion::V2_0),
  597 |             HashMap::new(),
  598 |         );
  599 | 
  600 |         let mut unchanged = schema.clone();
  601 |         unchanged.fields[0].dictionary = Some(dictionary);
  602 |         let retained = vec![fragment_with_file_fields(0, "old.lance", vec![0])];
  603 |         assert_eq!(
  604 |             shared_field_binding_changes(&manifest.schema.fields[0], &unchanged.fields[0]),
  605 |             None
  606 |         );
  607 |         merge_schema_valid(&manifest, &unchanged, &retained).unwrap();
  608 | 
  609 |         let mut moved = schema;
  610 |         moved.fields[0].dictionary = Some(lance_core::datatypes::Dictionary {
  611 |             offset: 200,
  612 |             length: 5,
  613 |             values: None,
  614 |         });
  615 |         assert_eq!(
  616 |             shared_field_binding_changes(&manifest.schema.fields[0], &moved.fields[0]),
  617 |             Some("dictionary".to_string())
  618 |         );
  619 |         let err = merge_schema_valid(&manifest, &moved, &retained).unwrap_err();
  620 |         assert!(matches!(err, Error::InvalidInput { .. }), "got {err:?}");
  621 |         assert!(
  622 |             err.to_string()
  623 |                 .contains(r#"changes field id 0 ("d") without rewriting it in every existing fragment: dictionary."#),
  624 |             "unexpected error: {err}"
  625 |         );
  626 |     }
  627 | 
  628 |     #[test]
  629 |     fn test_merge_shared_id_change_rejects_retained_overlay() {
  630 |         let schema = one_field_schema();
  631 |         let mut prior_fragment = fragment_with_file_fields(0, "old.lance", vec![0]);
  632 |         prior_fragment.overlays.push(DataOverlayFile {
  633 |             data_file: DataFile::new_legacy_from_fields("old-overlay.lance", vec![0], None),
  634 |             coverage: OverlayCoverage::Shared(Arc::new(RoaringBitmap::from_iter([0_u32]))),
  635 |             committed_version: 1,
  636 |         });
  637 |         let manifest = Manifest::new(
  638 |             schema.clone(),
  639 |             Arc::new(vec![prior_fragment.clone()]),
  640 |             DataStorageFormat::new(ConcreteFileVersion::V2_0),
  641 |             HashMap::new(),
  642 |         );
  643 |         let mut new_schema = schema;
  644 |         new_schema.fields[0].nullable = false;
  645 | 
  646 |         let mut rewritten = fragment_with_file_fields(0, "new.lance", vec![0]);
  647 |         rewritten.overlays = prior_fragment.overlays.clone();
  648 |         let err = merge_schema_valid(&manifest, &new_schema, &[rewritten]).unwrap_err();
  649 |         assert!(matches!(err, Error::InvalidInput { .. }), "got {:?}", err);
  650 |         assert!(
  651 |             err.to_string()
  652 |                 .contains("without rewriting it in every existing fragment"),
  653 |             "unexpected error: {}",
  654 |             err
  655 |         );
  656 |     }
  657 | 
  658 |     #[test]
  659 |     fn test_merge_allows_rewritten_fresh_field_id() {
  660 |         let schema = one_field_schema();
  661 |         let manifest = manifest_with_file_fields(schema.clone(), vec![0]);
  662 |         let mut rewritten_schema = schema;
  663 |         rewritten_schema.fields[0].id = 1;
  664 |         let mut rewritten = manifest.fragments[0].clone();
  665 |         rewritten.files[0] = DataFile::new_legacy_from_fields("rewritten.lance", vec![1], None);
  666 |         merge_schema_valid(&manifest, &rewritten_schema, &[rewritten]).unwrap();
  667 |     }
  668 | 
  669 |     #[test]
  670 |     fn test_merge_rejects_max_field_id_overflow() {
  671 |         let schema = one_field_schema();
  672 |         let manifest = manifest_with_file_fields(schema.clone(), vec![0, i32::MAX]);
  673 |         assert_eq!(manifest.max_field_id(), i32::MAX);
  674 | 
  675 |         let mut new_schema = schema;
  676 |         let mut extra =
  677 |             LanceCoreField::try_from(&ArrowField::new("b", DataType::Int32, true)).unwrap();
  678 |         extra.id = 1;
  679 |         new_schema.fields.push(extra);
  680 | 
  681 |         let err = merge_schema_valid(&manifest, &new_schema, &manifest.fragments).unwrap_err();
  682 |         assert!(matches!(err, Error::InvalidInput { .. }), "got {:?}", err);
  683 |         let message = err.to_string();
  684 |         assert!(
  685 |             message.contains("assigns id 1 to new field \"b\"") && message.contains("exhausted"),
  686 |             "unexpected error: {}",
  687 |             message
  688 |         );
  689 |     }
  690 | 
  691 |     /// Regression test for https://github.com/lance-format/lance/issues/6417
  692 |     ///
  693 |     /// When overwriting a LEGACY dataset with STABLE-format fragments, the
  694 |     /// validation should not use the old manifest's format. STABLE fragments
  695 |     /// omit struct parent fields, which the strict legacy check rejects.
  696 |     #[test]
  697 |     fn test_overwrite_legacy_to_stable_with_struct_fields() {
  698 |         use arrow_schema::Fields;
  699 | 
  700 |         // Schema: id (field 0), name (field 1), address (field 2, struct parent),
  701 |         //   city (field 3), country (field 4)
  702 |         let arrow_schema = ArrowSchema::new(vec![
  703 |             ArrowField::new("id", DataType::Int32, false),
  704 |             ArrowField::new("name", DataType::Utf8, false),
  705 |             ArrowField::new(
  706 |                 "address",
  707 |                 DataType::Struct(Fields::from(vec![
  708 |                     ArrowField::new("city", DataType::Utf8, false),
  709 |                     ArrowField::new("country", DataType::Utf8, false),
  710 |                 ])),
  711 |                 false,
  712 |             ),
  713 |         ]);
  714 |         let schema = LanceSchema::try_from(&arrow_schema).unwrap();
  715 | 
  716 |         // Old manifest is LEGACY format
  717 |         let legacy_manifest = Manifest::new(
  718 |             schema.clone(),
  719 |             Arc::new(vec![Fragment::new(0)]),
  720 |             DataStorageFormat::new(ConcreteFileVersion::V1),
  721 |             HashMap::new(),
  722 |         );
  723 | 
  724 |         // New fragments in STABLE format omit struct parent field (id=2),
  725 |         // only including leaf fields: id=0, name=1, city=3, country=4
  726 |         let stable_fragment = Fragment {
  727 |             id: 0,
  728 |             files: vec![DataFile::new(
  729 |                 "data.lance",
  730 |                 vec![0, 1, 3, 4], // no field 2 (struct parent)
  731 |                 vec![0, 1, 2, 3],
  732 |                 ConcreteFileVersion::V1,
  733 |                 None,
  734 |                 None,
  735 |             )],
  736 |             physical_rows: Some(10),
  737 |             overlays: vec![],
  738 |             deletion_file: None,
  739 |             row_id_meta: None,
  740 |             last_updated_at_version_meta: None,
  741 |             created_at_version_meta: None,
  742 |         };
  743 | 
  744 |         let operation = Operation::Overwrite {
  745 |             fragments: vec![stable_fragment],
  746 |             schema,
  747 |             config_upsert_values: None,
  748 |             initial_bases: None,
  749 |         };
  750 | 
  751 |         // This should succeed — the old manifest's LEGACY format should not
  752 |         // cause strict validation of the new STABLE fragments.
  753 |         validate_operation(Some(&legacy_manifest), &operation).unwrap();
  754 |     }
  755 | }
``````
