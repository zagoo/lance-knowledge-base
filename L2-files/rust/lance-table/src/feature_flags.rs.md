> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/feature_flags.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `dc4f745680bd0da9b72e3dd38e2d4db40b49522b50eed71a2c42b181eb623a99`. Reviewed physical lines: 1-820.

[Module](../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Table capability bits, support gates, mutable flag reconstruction and local source tests. (rust/lance-table/src/feature_flags.rs:1-820)

## Complete range analysis

### Lines 1-8

SPDX/module prelude imports Manifest and core Error/Result; all feature logic operates on manifest fields or explicit u64 words. (rust/lance-table/src/feature_flags.rs:1-8)

### Lines 9-22

Bits0..5 are deletion files, stable row IDs, deprecated v2-format marker, table config, base paths and disable transaction file. Comments distinguish stable row identity from physical addresses and describe writer-only inline-transaction preference. The deprecated v2 bit is retained for recognition, not emitted by apply_feature_flags. (rust/lance-table/src/feature_flags.rs:9-22)

### Lines 23-32

Bit6 marks unstable overlays whose ignored updates would expose stale base cells. Documented release opt-in/debug support is implemented by data_overlay_files_enabled below; mere bit definition does not make every build accept it. (rust/lance-table/src/feature_flags.rs:23-32)

### Lines 33-52

Bit7 is covered-index metadata. Comments describe the older trailing-suffix fields contract and why reader and writer fences are needed. Historical claims about reclaimed MemWAL bit7, released unknown boundaries and beta4..17 exposure are recorded as source comments only; they are not verified release compatibility facts. (rust/lance-table/src/feature_flags.rs:33-52)

### Lines 53-65

Bit8 marks mixed recognized v2 exact file versions; bit9 marks stable-row-ID tables with fragment reuse, supported only with debug assertions; bit10 marks tagged fragment-reuse mappings. Comment says legacy-only FRI does not set bit10; the now-reviewed builder sets paired bit10 when final indices contain a tagged entry (rust/lance-table/src/transaction/manifest_build.rs:1914-1919). (rust/lance-table/src/feature_flags.rs:53-65)

### Lines 66-85

Bit11 marks row IDs or created/updated dataset-version sequences stored as hidden data columns and has a debug/environment support gate. Comments explain incompatible older oneof interpretation; historical universal rejection claims remain unverified. Bit12 is reserved fragment trees and always rejected by the mask. (rust/lance-table/src/feature_flags.rs:66-85)

### Lines 86-99

Bit13 reserves independent key/covering declarations and documents dependence on covered-index bit7. Implementation explicitly masks it out; this is not an implemented migration/pair-retention policy. FLAG_UNKNOWN is1<<14 (16384), the upper boundary for the initial mask. (rust/lance-table/src/feature_flags.rs:86-99)

### Lines 100-116

Compile-time assertions place covered/mixed/stable-FRI/tagged-FRI/spilled/tree/independent bits below FLAG_UNKNOWN and covered/stable-FRI at minimum historical fence positions7/9. Assertions prove arithmetic positions only. Crate-visible STICKY_PAIRED_FLAGS contains exactly mixed bit8 and tagged-FRI bit10, not every paired feature. (rust/lance-table/src/feature_flags.rs:100-116)

### Lines 117-126

Public opt-in variable names are LANCE_ENABLE_UNSTABLE_DATA_OVERLAY_FILES and LANCE_ENABLE_UNSTABLE_SPILLED_ROW_LINEAGE. Their values are not parsed; helpers check var_os presence. (rust/lance-table/src/feature_flags.rs:117-126)

### Lines 127-145

apply_feature_flags first takes the union of either word's covered-index bit and calls validated_sticky_paired_flags. Paired validation failure occurs before mutation. It then zeroes both words. The now-reviewed build_manifest derives covering bits after calling this helper (rust/lance-table/src/transaction/manifest_build.rs:1686-1720); the complete dataset write_manifest_file path remains pending. (rust/lance-table/src/feature_flags.rs:127-145)

### Lines 146-171

Any deletion_file sets bit0 in both words. If any fragment has row_id_meta or enable_stable_row_id is true, every fragment must have row IDs, otherwise InvalidInput All fragments must have row ids. Empty fragments satisfy all vacuously and can enable stable mode. A failure here happens after reset and possible deletion-bit writes, so this function is not rollback-atomic. On success stable bit1 is set in both. (rust/lance-table/src/feature_flags.rs:146-171)

### Lines 172-194

Nonempty config sets table-config bit3 only in writer word. Nonempty base_paths sets bit4 in both (not a check that length exceeds1). Any nonempty overlays list sets unstable overlay bit6 in both, without consulting the current support gate. (rust/lance-table/src/feature_flags.rs:172-194)

### Lines 195-215

Any frag.has_spilled_row_lineage() sets bit11 in both; detector internals are pending. disable_transaction_file sets writer bit5 only. Finally restore covered bit7 into both words and validated sticky bits8/10 into both, then Ok. Other incoming bits including deprecated v2, unknown/reserved and stable-FRI bit9 are cleared unless derived elsewhere; this routine does not itself ensure reader/writer support. (rust/lance-table/src/feature_flags.rs:195-215)

### Lines 216-232

inherit_sticky_feature_flags validates source paired bits before any destination write, then ORs bits8/10 into both destination words. It preserves unrelated destination bits and does not validate destination, transfer covered metadata or infer capabilities from fragment contents. (rust/lance-table/src/feature_flags.rs:216-232)

### Lines 233-252

Overlay and spilled-lineage helpers return cfg!(debug_assertions) OR environment-variable presence; empty/non-Unicode/0 strings count as present, no cached OnceLock. Overlay helper is private; spilled helper is public. Hidden public stable-row-ID FRI helper returns only cfg!(debug_assertions), with no environment override. Build-profile labels in prose are shorthand; actual predicate is debug_assertions. (rust/lance-table/src/feature_flags.rs:233-252)

### Lines 253-291

mark_supported only clears the supplied bit when disabled. supported_flags_when starts at FLAG_UNKNOWN-1 and clears overlay/stable-FRI/spilled bits according to three booleans, then always clears tree and independent covering. It recognizes all other bits below14, including deprecated v2 and writer-specific bits, without enforcing semantic combinations. (rust/lance-table/src/feature_flags.rs:253-291)

### Lines 292-307

supported_flags reads the three current gates each call. can_read_dataset and can_write_dataset accept when their given word contains no unsupported bits; both use the identical support mask. Zero is accepted; these word-only checks do not inspect the counterpart word, contents or per-file versions. (rust/lance-table/src/feature_flags.rs:292-307)

### Lines 308-341

ensure_can_read_manifest/ensure_can_write_manifest first validate paired bits, then check only the relevant feature word. Unsupported flags return NotSupported via not_supported_source with the decimal flags and upgrade prompt. Corrupt paired errors take precedence. These are capability checks, not content/version/format validation. (rust/lance-table/src/feature_flags.rs:308-341)

### Lines 342-378

has_deprecated_v2_feature_flag is a bit2 test. validate_paired_feature_flags first rejects XOR disagreement in tagged-FRI bit10 with CorruptFile named manifest, then mixed bit8 disagreement with another CorruptFile. No other bits are paired-validated here. validated_sticky_paired_flags calls that validator and returns reader word masked by bits8/10. (rust/lance-table/src/feature_flags.rs:342-378)

### Lines 379-395

Test module gated cfg(test). tagged_fri_flag_is_supported_and_sticky asserts word acceptance, reader-only tagged-FRI rejection and preservation of both after apply. It does not exercise actual FRI decoding. (rust/lance-table/src/feature_flags.rs:379-395)

### Lines 396-418

Covered-metadata test asserts bit128 and present-build read/write acceptance. Comments about older release refusal are not backed by loading a historical fixture here. Test imports super::* and BasePath. (rust/lance-table/src/feature_flags.rs:396-418)

### Lines 419-455

Fragment-tree test checks4096, separation from FRI bits and read/write refusal. Stable-row-ID FRI test checks512, uses explicit policy booleans for exclusion/inclusion and unrelated-bit rejection, then compares both word gates with the actual debug predicate. No build profiles or environment variables are changed. (rust/lance-table/src/feature_flags.rs:419-455)

### Lines 456-487

Independent-covering test asserts8192 and refusal of its union with bit7. Reader test accepts zero, known bits0..5, a combined subset and current overlay policy; rejects FLAG_UNKNOWN. These checks do not validate individual manifest contents. (rust/lance-table/src/feature_flags.rs:456-487)

### Lines 488-517

Overlay policy test compares disabled/enabled masks while retaining deletion support. Spilled policy test checks2048, exclusion/inclusion and retention of mixed-version support. Historical boundary commentary remains unverified; tests pass explicit booleans rather than mutate process environment. (rust/lance-table/src/feature_flags.rs:488-517)

### Lines 518-556

Overlay derivation fixture builds a one-field Int64 schema, one fragment and a dense overlay backed by the legacy-named DataFile constructor, then asserts overlay bit in both words after apply. This uses in-memory metadata, not a written overlay data file. (rust/lance-table/src/feature_flags.rs:518-556)

### Lines 557-605

Spilled-lineage fixture loops over row ID Column, created-version Column and updated-version Column, using a hidden-row-ID-field DataFile. Each fragment otherwise has inline row IDs so the stable-ID all-fragments check passes. Applying with stable IDs enabled must set spilled bit in both words; no hidden-column reader is exercised. (rust/lance-table/src/feature_flags.rs:557-605)

### Lines 606-623

Inline-only row-ID metadata fixture applies stable mode and checks reader spilled bit remains zero. It does not assert writer spilled bit separately in this case. (rust/lance-table/src/feature_flags.rs:606-623)

### Lines 624-649

Writer counterpart accepts zero, known bits0..5, a multi-bit subset and gated overlay; rejects FLAG_UNKNOWN. Like reader checks, this is word-level policy only. (rust/lance-table/src/feature_flags.rs:624-649)

### Lines 650-700

Base-path derivation compares empty map versus a single BasePath entry with file URI/reference. Empty sets neither bit and one entry sets both. The fixture confirms nonempty-map semantics rather than requiring multiple entries or doing filesystem IO. (rust/lance-table/src/feature_flags.rs:650-700)

### Lines 701-737

Inheritance test ORs a fully paired mixed-version capability into an empty destination and asserts both. Half-set-source test tries both reader-only and writer-only mixed bit and expects an only one of diagnostic; it does not explicitly assert destination nonmutation. (rust/lance-table/src/feature_flags.rs:701-737)

### Lines 738-781

Apply preserves fully paired mixed bit across reset; reader-only apply yields CorruptFile plus diagnostic. Separate paired-validation test covers both mixed half-set orientations. Tests do not imply every flag must be paired. (rust/lance-table/src/feature_flags.rs:738-781)

### Lines 782-810

Writer-gate fixture accepts paired mixed capability, then adds writer unknown bit and asserts NotSupported/cannot be written. empty_manifest creates an Int32 i schema with no fragments/base paths and default storage format. (rust/lance-table/src/feature_flags.rs:782-810)

### Lines 811-820

Final test accepts covered and mixed bits for read/write and rejects unknown for read. Module closes. All source assertions were read, not executed; no file-format compatibility fixture or end-to-end commit occurs here. (rust/lance-table/src/feature_flags.rs:811-820)

## Interaction and interpretation limits

Only this file is analyzed; imported implementations and downstream consumers remain pending unless separately listed in the manifest. No Rust build or test was run.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Feature flags
    5 | 
    6 | use crate::format::Manifest;
    7 | use lance_core::{Error, Result};
    8 | 
    9 | /// Fragments may contain deletion files, which record the tombstones of
   10 | /// soft-deleted rows.
   11 | pub const FLAG_DELETION_FILES: u64 = 1 << 0;
   12 | /// Row ids are stable for both moves and updates. Fragments contain an index
   13 | /// mapping row ids to row addresses.
   14 | pub const FLAG_STABLE_ROW_IDS: u64 = 1 << 1;
   15 | /// Files are written with the new v2 format (this flag is no longer used)
   16 | pub const FLAG_USE_V2_FORMAT_DEPRECATED: u64 = 1 << 2;
   17 | /// Table config is present
   18 | pub const FLAG_TABLE_CONFIG: u64 = 1 << 3;
   19 | /// Dataset uses multiple base paths (for shallow clones or multi-base datasets)
   20 | pub const FLAG_BASE_PATHS: u64 = 1 << 4;
   21 | /// Disable writing transaction file under _transaction/, this flag is set when we only want to write inline transaction in manifest
   22 | pub const FLAG_DISABLE_TRANSACTION_FILE: u64 = 1 << 5;
   23 | /// Fragments contain data overlay files, which supply new values for a subset of
   24 | /// cells without rewriting base data files. A reader that does not understand
   25 | /// overlays must refuse the dataset, since ignoring an overlay would silently
   26 | /// return stale base values.
   27 | ///
   28 | /// Data overlay files are not yet a released feature: in release builds this flag
   29 | /// is treated as unknown (so a release reader/writer refuses an overlay dataset)
   30 | /// unless [`ENABLE_UNSTABLE_DATA_OVERLAY_FILES_ENV`] is set, which lets benchmarks opt in.
   31 | /// Debug builds always understand it so tests exercise the path.
   32 | pub const FLAG_UNSTABLE_DATA_OVERLAY_FILES: u64 = 1 << 6;
   33 | /// Some index declares covering columns: `IndexMetadata.covering_fields` names
   34 | /// columns the index carries values for, whether or not it is also keyed on
   35 | /// them.
   36 | ///
   37 | /// Without [`FLAG_INDEPENDENT_COVERING_FIELDS`], the carried columns form the
   38 | /// trailing suffix of `fields` in emission order. A reader without this bit still selects
   39 | /// a vector index by testing membership of `fields`, so it would answer a query
   40 | /// on a merely-carried column with an index keyed on a different column and
   41 | /// return wrong neighbours with no error. A writer without it would maintain the
   42 | /// index as though every entry of `fields` were keyed. Both must refuse the table.
   43 | ///
   44 | /// This takes the bit reclaimed from the retired MemWAL index-catchup flag
   45 | /// (<https://github.com/lance-format/lance/pull/8680>), which is the boundary the
   46 | /// current released build treats as unknown -- so that build refuses a covering
   47 | /// dataset without needing a change of its own. Builds from the window where the
   48 | /// bit was allocated to index catch-up (v11.0.0-beta.4 through beta.17) still
   49 | /// count it as supported and will open a covering dataset rather than refuse it;
   50 | /// that exposure comes with the reclamation and is inherited by whichever flag
   51 | /// takes the bit.
   52 | pub const FLAG_COVERED_INDEX_METADATA: u64 = 1 << 7;
   53 | /// A dataset may reference recognized V2 data files with different exact
   54 | /// versions. Readers and writers must both understand the per-file version
   55 | /// contract before either can safely access the dataset.
   56 | pub const FLAG_MIXED_DATA_FILE_VERSIONS: u64 = 1 << 8;
   57 | /// The table uses stable row ids and carries a fragment reuse index.
   58 | ///
   59 | /// Understood only by debug builds until support is released (see
   60 | /// [`frag_reuse_with_stable_row_ids_enabled`]).
   61 | pub const FLAG_FRAG_REUSE_WITH_STABLE_ROW_IDS: u64 = 1 << 9;
   62 | /// Tagged FRI requires a reader that interprets its mappings and a writer that
   63 | /// preserves them during maintenance. Legacy-only FRI does not set this bit.
   64 | /// Bit 9 is taken by the stable-row-id FRI compatibility flag.
   65 | pub const FLAG_FRAGMENT_REUSE_INDEX: u64 = 1 << 10;
   66 | /// Some fragment stores a row lineage sequence -- its row ids, or its
   67 | /// created-at or last-updated-at versions -- as a hidden column of a data file
   68 | /// rather than inline in the manifest (`RowIdMeta::Column`,
   69 | /// `RowDatasetVersionMeta::Column`).
   70 | ///
   71 | /// A reader without this bit sees an unset `row_id_sequence` oneof and would
   72 | /// take the fragment to have no row ids at all, on a table whose manifest says
   73 | /// every fragment has them; a writer without it would carry the fragment
   74 | /// forward and drop the sequence. Both must refuse the table.
   75 | ///
   76 | /// Every earlier build has its unknown boundary at or below this bit, so each
   77 | /// already refuses such a dataset without a change of its own. Spilled row
   78 | /// lineage is not yet a released feature: this build understands the bit only
   79 | /// in debug builds or when [`ENABLE_UNSTABLE_SPILLED_ROW_LINEAGE_ENV`] is set,
   80 | /// mirroring [`FLAG_UNSTABLE_DATA_OVERLAY_FILES`].
   81 | pub const FLAG_UNSTABLE_SPILLED_ROW_LINEAGE: u64 = 1 << 11;
   82 | /// Reserved for fragment trees. Readers and writers reject it until implemented.
   83 | ///
   84 | /// Bit 11 is spilled row lineage, so this takes the next free bit.
   85 | pub const FLAG_FRAGMENT_TREE: u64 = 1 << 12;
   86 | /// Index key fields and covering fields are declared independently.
   87 | ///
   88 | /// When this flag is set, `IndexMetadata.fields` contains only the columns the
   89 | /// index is keyed on and `IndexMetadata.covering_fields` separately contains
   90 | /// the columns whose values the index carries. A field may occur in both lists.
   91 | /// The flag requires [`FLAG_COVERED_INDEX_METADATA`] in both feature words, and
   92 | /// the two are retained together while the independent bit is set.
   93 | ///
   94 | /// Reserved ahead of its implementation. This build masks the bit out in
   95 | /// `supported_flags_when`, so it cannot open a table and apply the legacy
   96 | /// suffix contract to independent declarations.
   97 | pub const FLAG_INDEPENDENT_COVERING_FIELDS: u64 = 1 << 13;
   98 | /// The first bit that is unknown as a feature flag
   99 | pub const FLAG_UNKNOWN: u64 = 1 << 14;
  100 | 
  101 | const _: () = assert!(FLAG_COVERED_INDEX_METADATA < FLAG_UNKNOWN);
  102 | // The fence needs a bit the current released build already refuses, which means
  103 | // at or above the boundary that build shipped with (bit 7).
  104 | const _: () = assert!(FLAG_COVERED_INDEX_METADATA >= 1 << 7);
  105 | const _: () = assert!(FLAG_MIXED_DATA_FILE_VERSIONS < FLAG_UNKNOWN);
  106 | // Same fence for this bit: v12.0.0 refuses bit 9 and up.
  107 | const _: () = assert!(FLAG_FRAG_REUSE_WITH_STABLE_ROW_IDS >= 1 << 9);
  108 | const _: () = assert!(FLAG_FRAG_REUSE_WITH_STABLE_ROW_IDS < FLAG_UNKNOWN);
  109 | const _: () = assert!(FLAG_FRAGMENT_REUSE_INDEX < FLAG_UNKNOWN);
  110 | const _: () = assert!(FLAG_UNSTABLE_SPILLED_ROW_LINEAGE < FLAG_UNKNOWN);
  111 | const _: () = assert!(FLAG_FRAGMENT_TREE < FLAG_UNKNOWN);
  112 | const _: () = assert!(FLAG_INDEPENDENT_COVERING_FIELDS < FLAG_UNKNOWN);
  113 | 
  114 | pub(crate) const STICKY_PAIRED_FLAGS: u64 =
  115 |     FLAG_MIXED_DATA_FILE_VERSIONS | FLAG_FRAGMENT_REUSE_INDEX;
  116 | 
  117 | /// Environment variable that opts a release build into reading and writing data
  118 | /// overlay files before the feature is generally released.
  119 | pub const ENABLE_UNSTABLE_DATA_OVERLAY_FILES_ENV: &str = "LANCE_ENABLE_UNSTABLE_DATA_OVERLAY_FILES";
  120 | 
  121 | /// Environment variable that opts a release build into reading and writing row
  122 | /// lineage sequences spilled to hidden data file columns before the feature is
  123 | /// generally released.
  124 | pub const ENABLE_UNSTABLE_SPILLED_ROW_LINEAGE_ENV: &str =
  125 |     "LANCE_ENABLE_UNSTABLE_SPILLED_ROW_LINEAGE";
  126 | 
  127 | /// Set the reader and writer feature flags in the manifest based on the contents of the manifest.
  128 | pub fn apply_feature_flags(
  129 |     manifest: &mut Manifest,
  130 |     enable_stable_row_id: bool,
  131 |     disable_transaction_file: bool,
  132 | ) -> Result<()> {
  133 |     // Carried across the reset: a `Manifest` only points at its index section,
  134 |     // so whether any index declares covering columns is not visible here. `build_manifest` decides it from the index list it is
  135 |     // committing and sets the bit after calling this; without the carry the
  136 |     // second call, from `write_manifest_file`, would clear that decision
  137 |     // immediately before the write.
  138 |     let covered_index_metadata = (manifest.reader_feature_flags | manifest.writer_feature_flags)
  139 |         & FLAG_COVERED_INDEX_METADATA;
  140 |     let sticky_paired_flags = validated_sticky_paired_flags(manifest)?;
  141 | 
  142 |     // Reset flags
  143 |     manifest.reader_feature_flags = 0;
  144 |     manifest.writer_feature_flags = 0;
  145 | 
  146 |     let has_deletion_files = manifest
  147 |         .fragments
  148 |         .iter()
  149 |         .any(|frag| frag.deletion_file.is_some());
  150 |     if has_deletion_files {
  151 |         // Both readers and writers need to be able to read deletion files
  152 |         manifest.reader_feature_flags |= FLAG_DELETION_FILES;
  153 |         manifest.writer_feature_flags |= FLAG_DELETION_FILES;
  154 |     }
  155 | 
  156 |     // If any fragment has row ids, they must all have row ids.
  157 |     let has_row_ids = manifest
  158 |         .fragments
  159 |         .iter()
  160 |         .any(|frag| frag.row_id_meta.is_some());
  161 |     if has_row_ids || enable_stable_row_id {
  162 |         if !manifest
  163 |             .fragments
  164 |             .iter()
  165 |             .all(|frag| frag.row_id_meta.is_some())
  166 |         {
  167 |             return Err(Error::invalid_input("All fragments must have row ids"));
  168 |         }
  169 |         manifest.reader_feature_flags |= FLAG_STABLE_ROW_IDS;
  170 |         manifest.writer_feature_flags |= FLAG_STABLE_ROW_IDS;
  171 |     }
  172 | 
  173 |     // Test whether any table metadata has been set
  174 |     if !manifest.config.is_empty() {
  175 |         manifest.writer_feature_flags |= FLAG_TABLE_CONFIG;
  176 |     }
  177 | 
  178 |     // Check if this dataset uses multiple base paths (for shallow clones or multi-base datasets)
  179 |     if !manifest.base_paths.is_empty() {
  180 |         manifest.reader_feature_flags |= FLAG_BASE_PATHS;
  181 |         manifest.writer_feature_flags |= FLAG_BASE_PATHS;
  182 |     }
  183 | 
  184 |     // Overlay files change cell values on read, so a reader that ignores them
  185 |     // would return stale base values. Both readers and writers must understand
  186 |     // them.
  187 |     let has_overlays = manifest
  188 |         .fragments
  189 |         .iter()
  190 |         .any(|frag| !frag.overlays.is_empty());
  191 |     if has_overlays {
  192 |         manifest.reader_feature_flags |= FLAG_UNSTABLE_DATA_OVERLAY_FILES;
  193 |         manifest.writer_feature_flags |= FLAG_UNSTABLE_DATA_OVERLAY_FILES;
  194 |     }
  195 | 
  196 |     let has_spilled_row_lineage = manifest
  197 |         .fragments
  198 |         .iter()
  199 |         .any(|frag| frag.has_spilled_row_lineage());
  200 |     if has_spilled_row_lineage {
  201 |         manifest.reader_feature_flags |= FLAG_UNSTABLE_SPILLED_ROW_LINEAGE;
  202 |         manifest.writer_feature_flags |= FLAG_UNSTABLE_SPILLED_ROW_LINEAGE;
  203 |     }
  204 | 
  205 |     if disable_transaction_file {
  206 |         manifest.writer_feature_flags |= FLAG_DISABLE_TRANSACTION_FILE;
  207 |     }
  208 | 
  209 |     manifest.reader_feature_flags |= covered_index_metadata;
  210 |     manifest.writer_feature_flags |= covered_index_metadata;
  211 |     manifest.reader_feature_flags |= sticky_paired_flags;
  212 |     manifest.writer_feature_flags |= sticky_paired_flags;
  213 | 
  214 |     Ok(())
  215 | }
  216 | 
  217 | /// Carry sticky paired capabilities from the manifest a new one is derived
  218 | /// from.
  219 | ///
  220 | /// [`apply_feature_flags`] carries these bits across its own reset, but it only
  221 | /// ever sees one manifest. Constructors preserve these flags, and this helper
  222 | /// also validates that the source is not half-set before a derived manifest is
  223 | /// committed.
  224 | ///
  225 | /// A half-set state is refused rather than normalized: one bit set means a
  226 | /// legacy reader or a legacy writer is still permitted, which is neither mode.
  227 | pub fn inherit_sticky_feature_flags(destination: &mut Manifest, source: &Manifest) -> Result<()> {
  228 |     let sticky_flags = validated_sticky_paired_flags(source)?;
  229 |     destination.reader_feature_flags |= sticky_flags;
  230 |     destination.writer_feature_flags |= sticky_flags;
  231 |     Ok(())
  232 | }
  233 | 
  234 | /// Whether this build understands data overlay files: always in debug builds,
  235 | /// and in release builds only when [`ENABLE_UNSTABLE_DATA_OVERLAY_FILES_ENV`] is set.
  236 | fn data_overlay_files_enabled() -> bool {
  237 |     cfg!(debug_assertions) || std::env::var_os(ENABLE_UNSTABLE_DATA_OVERLAY_FILES_ENV).is_some()
  238 | }
  239 | 
  240 | /// Whether this build understands row lineage sequences spilled to data file
  241 | /// columns: always in debug builds, and in release builds only when
  242 | /// [`ENABLE_UNSTABLE_SPILLED_ROW_LINEAGE_ENV`] is set, like data overlay files.
  243 | pub fn spilled_row_lineage_enabled() -> bool {
  244 |     cfg!(debug_assertions) || std::env::var_os(ENABLE_UNSTABLE_SPILLED_ROW_LINEAGE_ENV).is_some()
  245 | }
  246 | 
  247 | /// Debug builds only, with no environment override, until continuous recording
  248 | /// and retention land. Hidden because it is removed then.
  249 | #[doc(hidden)]
  250 | pub fn frag_reuse_with_stable_row_ids_enabled() -> bool {
  251 |     cfg!(debug_assertions)
  252 | }
  253 | 
  254 | /// Clear `flag` from `flags` when its gating feature is not enabled in this
  255 | /// build; leave it set otherwise. One call per unstable flag, so support for
  256 | /// several unstable features chains cleanly.
  257 | fn mark_supported(flags: &mut u64, flag: u64, feature_enabled: bool) {
  258 |     if !feature_enabled {
  259 |         *flags &= !flag;
  260 |     }
  261 | }
  262 | 
  263 | /// The feature-flag bits this build understands, given which unstable features
  264 | /// are enabled. Split out from [`supported_flags`] so the policy is testable
  265 | /// without toggling the build profile or environment.
  266 | fn supported_flags_when(
  267 |     overlay_enabled: bool,
  268 |     spilled_row_lineage_enabled: bool,
  269 |     frag_reuse_with_stable_row_ids_enabled: bool,
  270 | ) -> u64 {
  271 |     let mut supported = FLAG_UNKNOWN - 1;
  272 |     mark_supported(
  273 |         &mut supported,
  274 |         FLAG_UNSTABLE_DATA_OVERLAY_FILES,
  275 |         overlay_enabled,
  276 |     );
  277 |     mark_supported(
  278 |         &mut supported,
  279 |         FLAG_FRAG_REUSE_WITH_STABLE_ROW_IDS,
  280 |         frag_reuse_with_stable_row_ids_enabled,
  281 |     );
  282 |     mark_supported(
  283 |         &mut supported,
  284 |         FLAG_UNSTABLE_SPILLED_ROW_LINEAGE,
  285 |         spilled_row_lineage_enabled,
  286 |     );
  287 |     // Reserved, not implemented: see the flag's doc comment.
  288 |     mark_supported(&mut supported, FLAG_FRAGMENT_TREE, false);
  289 |     mark_supported(&mut supported, FLAG_INDEPENDENT_COVERING_FIELDS, false);
  290 |     supported
  291 | }
  292 | 
  293 | fn supported_flags() -> u64 {
  294 |     supported_flags_when(
  295 |         data_overlay_files_enabled(),
  296 |         spilled_row_lineage_enabled(),
  297 |         frag_reuse_with_stable_row_ids_enabled(),
  298 |     )
  299 | }
  300 | 
  301 | pub fn can_read_dataset(reader_flags: u64) -> bool {
  302 |     reader_flags & !supported_flags() == 0
  303 | }
  304 | 
  305 | pub fn can_write_dataset(writer_flags: u64) -> bool {
  306 |     writer_flags & !supported_flags() == 0
  307 | }
  308 | 
  309 | /// Refuse reads from manifests whose required reader features this build does
  310 | /// not support or whose paired capabilities are inconsistent.
  311 | pub fn ensure_can_read_manifest(manifest: &Manifest) -> Result<()> {
  312 |     validate_paired_feature_flags(manifest)?;
  313 |     if !can_read_dataset(manifest.reader_feature_flags) {
  314 |         return Err(Error::not_supported_source(
  315 |             format!(
  316 |                 "This dataset cannot be read by this version of Lance. Please upgrade \
  317 |                  Lance to read this dataset. Flags: {}",
  318 |                 manifest.reader_feature_flags
  319 |             )
  320 |             .into(),
  321 |         ));
  322 |     }
  323 |     Ok(())
  324 | }
  325 | 
  326 | /// Refuse writes to manifests whose required writer features this build does
  327 | /// not support or whose paired capabilities are inconsistent.
  328 | pub fn ensure_can_write_manifest(manifest: &Manifest) -> Result<()> {
  329 |     validate_paired_feature_flags(manifest)?;
  330 |     if !can_write_dataset(manifest.writer_feature_flags) {
  331 |         return Err(Error::not_supported_source(
  332 |             format!(
  333 |                 "This dataset cannot be written by this version of Lance. Please upgrade \
  334 |                  Lance to write this dataset. Flags: {}",
  335 |                 manifest.writer_feature_flags
  336 |             )
  337 |             .into(),
  338 |         ));
  339 |     }
  340 |     Ok(())
  341 | }
  342 | 
  343 | pub fn has_deprecated_v2_feature_flag(writer_flags: u64) -> bool {
  344 |     writer_flags & FLAG_USE_V2_FORMAT_DEPRECATED != 0
  345 | }
  346 | 
  347 | /// Refuse a manifest whose paired reader and writer capability bits disagree.
  348 | ///
  349 | /// One word set and the other not is neither mode: it would let a legacy reader
  350 | /// or a legacy writer through on a table where the other half is enforcing. The
  351 | /// commit path refuses to *produce* this, so seeing it on read means the
  352 | /// manifest was written by something that did not.
  353 | pub fn validate_paired_feature_flags(manifest: &Manifest) -> Result<()> {
  354 |     if (manifest.reader_feature_flags ^ manifest.writer_feature_flags) & FLAG_FRAGMENT_REUSE_INDEX
  355 |         != 0
  356 |     {
  357 |         return Err(Error::corrupt_file_named(
  358 |             "manifest",
  359 |             "FRI requires both reader and writer feature flags",
  360 |         ));
  361 |     }
  362 | 
  363 |     let reader = manifest.reader_feature_flags & FLAG_MIXED_DATA_FILE_VERSIONS != 0;
  364 |     let writer = manifest.writer_feature_flags & FLAG_MIXED_DATA_FILE_VERSIONS != 0;
  365 |     if reader != writer {
  366 |         return Err(Error::corrupt_file_named(
  367 |             "manifest",
  368 |             "Manifest has only one of the mixed data-file-version reader and writer feature bits set, \
  369 |              so its semantics are undefined",
  370 |         ));
  371 |     }
  372 |     Ok(())
  373 | }
  374 | 
  375 | fn validated_sticky_paired_flags(manifest: &Manifest) -> Result<u64> {
  376 |     validate_paired_feature_flags(manifest)?;
  377 |     Ok(manifest.reader_feature_flags & STICKY_PAIRED_FLAGS)
  378 | }
  379 | 
  380 | #[cfg(test)]
  381 | mod tests {
  382 |     #[test]
  383 |     fn tagged_fri_flag_is_supported_and_sticky() {
  384 |         let flag = super::FLAG_FRAGMENT_REUSE_INDEX;
  385 |         assert!(super::can_read_dataset(flag));
  386 |         assert!(super::can_write_dataset(flag));
  387 |         let mut manifest = empty_manifest();
  388 |         manifest.reader_feature_flags = flag;
  389 |         assert!(super::ensure_can_read_manifest(&manifest).is_err());
  390 |         manifest.writer_feature_flags = flag;
  391 |         super::apply_feature_flags(&mut manifest, false, false).unwrap();
  392 |         assert_eq!(manifest.reader_feature_flags & flag, flag);
  393 |         assert_eq!(manifest.writer_feature_flags & flag, flag);
  394 |     }
  395 | 
  396 |     /// The covering fence only works if the bit is one the current released
  397 |     /// build already rejects. That build's unknown boundary is 128, so the bit
  398 |     /// has to be 128 and this build has to have moved its own boundary past it
  399 |     /// -- otherwise either that build accepts a covering dataset, or we refuse
  400 |     /// our own.
  401 |     #[test]
  402 |     fn test_covered_index_metadata_fences_older_builds_only() {
  403 |         assert_eq!(
  404 |             FLAG_COVERED_INDEX_METADATA, 128,
  405 |             "the fence must sit on the boundary the released build shipped with"
  406 |         );
  407 |         assert!(
  408 |             can_read_dataset(FLAG_COVERED_INDEX_METADATA),
  409 |             "this build implements covering, so it must accept its own datasets"
  410 |         );
  411 |         assert!(can_write_dataset(FLAG_COVERED_INDEX_METADATA));
  412 |         // A build whose boundary is still 128 refuses the bit, which is the fence;
  413 |         // the module-level `const _` assertion keeps it at or above that boundary.
  414 |     }
  415 | 
  416 |     use super::*;
  417 |     use crate::format::BasePath;
  418 | 
  419 |     #[test]
  420 |     fn test_fragment_tree_flag_is_reserved_not_supported() {
  421 |         assert_eq!(FLAG_FRAGMENT_TREE, 4096);
  422 |         assert_eq!(
  423 |             FLAG_FRAGMENT_TREE & (FLAG_FRAG_REUSE_WITH_STABLE_ROW_IDS | FLAG_FRAGMENT_REUSE_INDEX),
  424 |             0
  425 |         );
  426 |         assert!(!can_read_dataset(FLAG_FRAGMENT_TREE));
  427 |         assert!(!can_write_dataset(FLAG_FRAGMENT_TREE));
  428 |     }
  429 | 
  430 |     #[test]
  431 |     fn test_frag_reuse_with_stable_row_ids_flag_release_gating() {
  432 |         // v12.0.0's unknown boundary, so every released client refuses it.
  433 |         assert_eq!(FLAG_FRAG_REUSE_WITH_STABLE_ROW_IDS, 512);
  434 |         let without_support = supported_flags_when(true, true, false);
  435 |         assert_ne!(FLAG_FRAG_REUSE_WITH_STABLE_ROW_IDS & !without_support, 0);
  436 |         assert_eq!(FLAG_STABLE_ROW_IDS & !without_support, 0);
  437 |         let enabled = supported_flags_when(false, false, true);
  438 |         assert_eq!(FLAG_FRAG_REUSE_WITH_STABLE_ROW_IDS & !enabled, 0);
  439 |         for unrelated in [
  440 |             FLAG_UNSTABLE_DATA_OVERLAY_FILES,
  441 |             FLAG_UNSTABLE_SPILLED_ROW_LINEAGE,
  442 |             FLAG_FRAGMENT_TREE,
  443 |             FLAG_UNKNOWN,
  444 |         ] {
  445 |             assert_ne!(unrelated & !enabled, 0);
  446 |         }
  447 |         assert_eq!(
  448 |             can_read_dataset(FLAG_FRAG_REUSE_WITH_STABLE_ROW_IDS),
  449 |             frag_reuse_with_stable_row_ids_enabled()
  450 |         );
  451 |         assert_eq!(
  452 |             can_write_dataset(FLAG_FRAG_REUSE_WITH_STABLE_ROW_IDS),
  453 |             frag_reuse_with_stable_row_ids_enabled()
  454 |         );
  455 |     }
  456 | 
  457 |     #[test]
  458 |     fn test_independent_covering_fields_flag_is_reserved() {
  459 |         assert_eq!(FLAG_INDEPENDENT_COVERING_FIELDS, 8192);
  460 |         let flags = FLAG_COVERED_INDEX_METADATA | FLAG_INDEPENDENT_COVERING_FIELDS;
  461 |         assert!(!can_read_dataset(flags));
  462 |         assert!(!can_write_dataset(flags));
  463 |     }
  464 | 
  465 |     #[test]
  466 |     fn test_read_check() {
  467 |         assert!(can_read_dataset(0));
  468 |         assert!(can_read_dataset(super::FLAG_DELETION_FILES));
  469 |         assert!(can_read_dataset(super::FLAG_STABLE_ROW_IDS));
  470 |         assert!(can_read_dataset(super::FLAG_USE_V2_FORMAT_DEPRECATED));
  471 |         assert!(can_read_dataset(super::FLAG_TABLE_CONFIG));
  472 |         assert!(can_read_dataset(super::FLAG_BASE_PATHS));
  473 |         assert!(can_read_dataset(super::FLAG_DISABLE_TRANSACTION_FILE));
  474 |         // Overlay support is gated on the build profile / env opt-in, so the
  475 |         // flag is readable exactly when overlays are enabled (see
  476 |         // test_data_overlay_flag_release_gating for the full policy).
  477 |         assert_eq!(
  478 |             can_read_dataset(super::FLAG_UNSTABLE_DATA_OVERLAY_FILES),
  479 |             data_overlay_files_enabled()
  480 |         );
  481 |         assert!(can_read_dataset(
  482 |             super::FLAG_DELETION_FILES
  483 |                 | super::FLAG_STABLE_ROW_IDS
  484 |                 | super::FLAG_USE_V2_FORMAT_DEPRECATED
  485 |         ));
  486 |         assert!(!can_read_dataset(super::FLAG_UNKNOWN));
  487 |     }
  488 | 
  489 |     #[test]
  490 |     fn test_data_overlay_flag_release_gating() {
  491 |         // Release default (overlays disabled): the overlay flag is treated as
  492 |         // unknown so the dataset is refused, while other known flags still pass.
  493 |         let supported = supported_flags_when(false, false, false);
  494 |         assert_eq!(supported & FLAG_UNSTABLE_DATA_OVERLAY_FILES, 0);
  495 |         assert_eq!(FLAG_DELETION_FILES & !supported, 0);
  496 |         assert_ne!(FLAG_UNSTABLE_DATA_OVERLAY_FILES & !supported, 0);
  497 |         // Enabled (debug or env opt-in): the overlay flag is understood.
  498 |         let supported = supported_flags_when(true, false, false);
  499 |         assert_eq!(FLAG_UNSTABLE_DATA_OVERLAY_FILES & !supported, 0);
  500 |     }
  501 | 
  502 |     #[test]
  503 |     fn test_spilled_row_lineage_flag_release_gating() {
  504 |         // Every earlier build has its unknown boundary at or below this bit
  505 |         // (256 for v11, 512 for the v12 and v13 pre-releases, 2048 on main
  506 |         // before this flag), so each refuses the dataset without a change of
  507 |         // its own.
  508 |         assert_eq!(FLAG_UNSTABLE_SPILLED_ROW_LINEAGE, 2048);
  509 |         // A build that has not opted in refuses the dataset; one that has
  510 |         // understands it, and either way the other known flags still pass.
  511 |         let supported = supported_flags_when(true, false, false);
  512 |         assert_ne!(FLAG_UNSTABLE_SPILLED_ROW_LINEAGE & !supported, 0);
  513 |         assert_eq!(FLAG_MIXED_DATA_FILE_VERSIONS & !supported, 0);
  514 |         let supported = supported_flags_when(true, true, false);
  515 |         assert_eq!(FLAG_UNSTABLE_SPILLED_ROW_LINEAGE & !supported, 0);
  516 |     }
  517 | 
  518 |     #[test]
  519 |     fn test_apply_feature_flags_sets_overlay_flag() {
  520 |         use crate::format::overlay::{DataOverlayFile, OverlayCoverage};
  521 |         use crate::format::{DataFile, DataStorageFormat, Fragment};
  522 |         use arrow_schema::{Field as ArrowField, Schema as ArrowSchema};
  523 |         use lance_core::datatypes::Schema;
  524 |         use roaring::RoaringBitmap;
  525 |         use std::collections::HashMap;
  526 |         use std::sync::Arc;
  527 | 
  528 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new(
  529 |             "id",
  530 |             arrow_schema::DataType::Int64,
  531 |             false,
  532 |         )]);
  533 |         let schema = Schema::try_from(&arrow_schema).unwrap();
  534 |         let mut fragment = Fragment::new(0);
  535 |         fragment.overlays = vec![DataOverlayFile {
  536 |             data_file: DataFile::new_legacy_from_fields("o.lance", vec![0], None),
  537 |             coverage: OverlayCoverage::dense(RoaringBitmap::from_iter([0u32])),
  538 |             committed_version: 1,
  539 |         }];
  540 |         let mut manifest = Manifest::new(
  541 |             schema,
  542 |             Arc::new(vec![fragment]),
  543 |             DataStorageFormat::default(),
  544 |             HashMap::new(),
  545 |         );
  546 |         apply_feature_flags(&mut manifest, false, false).unwrap();
  547 |         assert_ne!(
  548 |             manifest.reader_feature_flags & FLAG_UNSTABLE_DATA_OVERLAY_FILES,
  549 |             0
  550 |         );
  551 |         assert_ne!(
  552 |             manifest.writer_feature_flags & FLAG_UNSTABLE_DATA_OVERLAY_FILES,
  553 |             0
  554 |         );
  555 |     }
  556 | 
  557 |     #[test]
  558 |     fn test_apply_feature_flags_sets_spilled_row_lineage_flag() {
  559 |         use crate::format::{DataFile, DataStorageFormat, Fragment, ROW_ID_FIELD_ID, RowIdMeta};
  560 |         use crate::rowids::version::RowDatasetVersionMeta;
  561 |         use arrow_schema::{Field as ArrowField, Schema as ArrowSchema};
  562 |         use lance_core::datatypes::Schema;
  563 |         use std::collections::HashMap;
  564 |         use std::sync::Arc;
  565 | 
  566 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new(
  567 |             "id",
  568 |             arrow_schema::DataType::Int64,
  569 |             false,
  570 |         )]);
  571 |         let schema = Schema::try_from(&arrow_schema).unwrap();
  572 |         let spilled =
  573 |             DataFile::new_legacy_from_fields("lineage.lance", vec![ROW_ID_FIELD_ID], None);
  574 |         // Each of the three sequences on its own is enough to require the flag.
  575 |         let mut spilled_fragments = Vec::new();
  576 |         for kind in 0..3 {
  577 |             let mut fragment = Fragment::new(kind);
  578 |             fragment.files.push(spilled.clone());
  579 |             // Every fragment of a stable-row-id table carries row ids; the
  580 |             // version-only cases keep theirs inline.
  581 |             fragment.row_id_meta = Some(RowIdMeta::Inline(vec![].into()));
  582 |             match kind {
  583 |                 0 => fragment.row_id_meta = Some(RowIdMeta::Column),
  584 |                 1 => fragment.created_at_version_meta = Some(RowDatasetVersionMeta::Column),
  585 |                 _ => fragment.last_updated_at_version_meta = Some(RowDatasetVersionMeta::Column),
  586 |             }
  587 |             spilled_fragments.push(fragment);
  588 |         }
  589 |         for fragment in spilled_fragments {
  590 |             let mut manifest = Manifest::new(
  591 |                 schema.clone(),
  592 |                 Arc::new(vec![fragment]),
  593 |                 DataStorageFormat::default(),
  594 |                 HashMap::new(),
  595 |             );
  596 |             apply_feature_flags(&mut manifest, true, false).unwrap();
  597 |             assert_ne!(
  598 |                 manifest.reader_feature_flags & FLAG_UNSTABLE_SPILLED_ROW_LINEAGE,
  599 |                 0
  600 |             );
  601 |             assert_ne!(
  602 |                 manifest.writer_feature_flags & FLAG_UNSTABLE_SPILLED_ROW_LINEAGE,
  603 |                 0
  604 |             );
  605 |         }
  606 | 
  607 |         // An inline sequence does not, so a table whose sequences all fit in
  608 |         // the manifest stays readable by builds without the flag.
  609 |         let mut fragment = Fragment::new(0);
  610 |         fragment.row_id_meta = Some(RowIdMeta::Inline(vec![].into()));
  611 |         let mut manifest = Manifest::new(
  612 |             schema,
  613 |             Arc::new(vec![fragment]),
  614 |             DataStorageFormat::default(),
  615 |             HashMap::new(),
  616 |         );
  617 |         apply_feature_flags(&mut manifest, true, false).unwrap();
  618 |         assert_eq!(
  619 |             manifest.reader_feature_flags & FLAG_UNSTABLE_SPILLED_ROW_LINEAGE,
  620 |             0
  621 |         );
  622 |     }
  623 | 
  624 |     #[test]
  625 |     fn test_write_check() {
  626 |         assert!(can_write_dataset(0));
  627 |         assert!(can_write_dataset(super::FLAG_DELETION_FILES));
  628 |         assert!(can_write_dataset(super::FLAG_STABLE_ROW_IDS));
  629 |         assert!(can_write_dataset(super::FLAG_USE_V2_FORMAT_DEPRECATED));
  630 |         assert!(can_write_dataset(super::FLAG_TABLE_CONFIG));
  631 |         assert!(can_write_dataset(super::FLAG_BASE_PATHS));
  632 |         assert!(can_write_dataset(super::FLAG_DISABLE_TRANSACTION_FILE));
  633 |         // Overlay support is gated on the build profile / env opt-in, so the
  634 |         // flag is writable exactly when overlays are enabled (see
  635 |         // test_data_overlay_flag_release_gating for the full policy).
  636 |         assert_eq!(
  637 |             can_write_dataset(super::FLAG_UNSTABLE_DATA_OVERLAY_FILES),
  638 |             data_overlay_files_enabled()
  639 |         );
  640 |         assert!(can_write_dataset(
  641 |             super::FLAG_DELETION_FILES
  642 |                 | super::FLAG_STABLE_ROW_IDS
  643 |                 | super::FLAG_USE_V2_FORMAT_DEPRECATED
  644 |                 | super::FLAG_TABLE_CONFIG
  645 |                 | super::FLAG_BASE_PATHS
  646 |         ));
  647 |         assert!(!can_write_dataset(super::FLAG_UNKNOWN));
  648 |     }
  649 | 
  650 |     #[test]
  651 |     fn test_base_paths_feature_flags() {
  652 |         use crate::format::{DataStorageFormat, Manifest};
  653 |         use arrow_schema::{Field as ArrowField, Schema as ArrowSchema};
  654 |         use lance_core::datatypes::Schema;
  655 |         use std::collections::HashMap;
  656 |         use std::sync::Arc;
  657 |         // Create a basic schema for testing
  658 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new(
  659 |             "test_field",
  660 |             arrow_schema::DataType::Int64,
  661 |             false,
  662 |         )]);
  663 |         let schema = Schema::try_from(&arrow_schema).unwrap();
  664 |         // Test 1: Normal dataset (no base_paths) should not have FLAG_BASE_PATHS
  665 |         let mut normal_manifest = Manifest::new(
  666 |             schema.clone(),
  667 |             Arc::new(vec![]),
  668 |             DataStorageFormat::default(),
  669 |             HashMap::new(), // Empty base_paths
  670 |         );
  671 |         apply_feature_flags(&mut normal_manifest, false, false).unwrap();
  672 |         assert_eq!(normal_manifest.reader_feature_flags & FLAG_BASE_PATHS, 0);
  673 |         assert_eq!(normal_manifest.writer_feature_flags & FLAG_BASE_PATHS, 0);
  674 |         // Test 2: Dataset with base_paths (shallow clone or multi-base) should have FLAG_BASE_PATHS
  675 |         let mut base_paths: HashMap<u32, BasePath> = HashMap::new();
  676 |         base_paths.insert(
  677 |             1,
  678 |             BasePath::new(
  679 |                 1,
  680 |                 "file:///path/to/original".to_string(),
  681 |                 Some("test_ref".to_string()),
  682 |                 true,
  683 |             ),
  684 |         );
  685 |         let mut multi_base_manifest = Manifest::new(
  686 |             schema,
  687 |             Arc::new(vec![]),
  688 |             DataStorageFormat::default(),
  689 |             base_paths,
  690 |         );
  691 |         apply_feature_flags(&mut multi_base_manifest, false, false).unwrap();
  692 |         assert_ne!(
  693 |             multi_base_manifest.reader_feature_flags & FLAG_BASE_PATHS,
  694 |             0
  695 |         );
  696 |         assert_ne!(
  697 |             multi_base_manifest.writer_feature_flags & FLAG_BASE_PATHS,
  698 |             0
  699 |         );
  700 |     }
  701 |     #[test]
  702 |     fn inheriting_carries_sticky_paired_bits_from_the_source() {
  703 |         let mut source = empty_manifest();
  704 |         source.reader_feature_flags = FLAG_MIXED_DATA_FILE_VERSIONS;
  705 |         source.writer_feature_flags = FLAG_MIXED_DATA_FILE_VERSIONS;
  706 |         // A fresh destination models any derived manifest before inheritance.
  707 |         let mut destination = empty_manifest();
  708 | 
  709 |         inherit_sticky_feature_flags(&mut destination, &source).unwrap();
  710 | 
  711 |         assert_ne!(
  712 |             destination.reader_feature_flags & FLAG_MIXED_DATA_FILE_VERSIONS,
  713 |             0
  714 |         );
  715 |         assert_ne!(
  716 |             destination.writer_feature_flags & FLAG_MIXED_DATA_FILE_VERSIONS,
  717 |             0
  718 |         );
  719 |     }
  720 | 
  721 |     #[test]
  722 |     fn inheriting_refuses_a_half_set_source() {
  723 |         for (reader, writer) in [
  724 |             (FLAG_MIXED_DATA_FILE_VERSIONS, 0),
  725 |             (0, FLAG_MIXED_DATA_FILE_VERSIONS),
  726 |         ] {
  727 |             let mut source = empty_manifest();
  728 |             source.reader_feature_flags = reader;
  729 |             source.writer_feature_flags = writer;
  730 |             let mut destination = empty_manifest();
  731 | 
  732 |             let err = inherit_sticky_feature_flags(&mut destination, &source).unwrap_err();
  733 | 
  734 |             assert!(err.to_string().contains("only one of"), "{err}");
  735 |         }
  736 |     }
  737 | 
  738 |     #[test]
  739 |     fn apply_feature_flags_carries_sticky_paired_bits_across_its_reset() {
  740 |         let mut manifest = empty_manifest();
  741 |         manifest.reader_feature_flags = FLAG_MIXED_DATA_FILE_VERSIONS;
  742 |         manifest.writer_feature_flags = FLAG_MIXED_DATA_FILE_VERSIONS;
  743 | 
  744 |         apply_feature_flags(&mut manifest, false, false).unwrap();
  745 | 
  746 |         assert_ne!(
  747 |             manifest.reader_feature_flags & FLAG_MIXED_DATA_FILE_VERSIONS,
  748 |             0
  749 |         );
  750 |         assert_ne!(
  751 |             manifest.writer_feature_flags & FLAG_MIXED_DATA_FILE_VERSIONS,
  752 |             0
  753 |         );
  754 |     }
  755 | 
  756 |     #[test]
  757 |     fn apply_feature_flags_rejects_half_set_sticky_bits() {
  758 |         let mut manifest = empty_manifest();
  759 |         manifest.reader_feature_flags = FLAG_MIXED_DATA_FILE_VERSIONS;
  760 | 
  761 |         let err = apply_feature_flags(&mut manifest, false, false).unwrap_err();
  762 | 
  763 |         assert!(matches!(err, Error::CorruptFile { .. }));
  764 |         assert!(err.to_string().contains("only one of"), "{err}");
  765 |     }
  766 | 
  767 |     #[test]
  768 |     fn paired_validation_rejects_half_set_mixed_version_capability() {
  769 |         for (reader, writer) in [
  770 |             (FLAG_MIXED_DATA_FILE_VERSIONS, 0),
  771 |             (0, FLAG_MIXED_DATA_FILE_VERSIONS),
  772 |         ] {
  773 |             let mut manifest = empty_manifest();
  774 |             manifest.reader_feature_flags = reader;
  775 |             manifest.writer_feature_flags = writer;
  776 | 
  777 |             let err = validate_paired_feature_flags(&manifest).unwrap_err();
  778 | 
  779 |             assert!(err.to_string().contains("mixed data-file-version"), "{err}");
  780 |         }
  781 |     }
  782 | 
  783 |     #[test]
  784 |     fn writer_gate_accepts_mixed_capability_and_rejects_unknown_flags() {
  785 |         let mut manifest = empty_manifest();
  786 |         manifest.reader_feature_flags = FLAG_MIXED_DATA_FILE_VERSIONS;
  787 |         manifest.writer_feature_flags = FLAG_MIXED_DATA_FILE_VERSIONS;
  788 |         ensure_can_write_manifest(&manifest).unwrap();
  789 | 
  790 |         manifest.writer_feature_flags |= FLAG_UNKNOWN;
  791 |         let err = ensure_can_write_manifest(&manifest).unwrap_err();
  792 |         assert!(matches!(err, Error::NotSupported { .. }));
  793 |         assert!(err.to_string().contains("cannot be written"), "{err}");
  794 |     }
  795 | 
  796 |     fn empty_manifest() -> Manifest {
  797 |         use crate::format::DataStorageFormat;
  798 |         use arrow_schema::{DataType, Field as ArrowField, Schema as ArrowSchema};
  799 |         use lance_core::datatypes::Schema;
  800 |         use std::collections::HashMap;
  801 |         use std::sync::Arc;
  802 | 
  803 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new("i", DataType::Int32, false)]);
  804 |         Manifest::new(
  805 |             Schema::try_from(&arrow_schema).unwrap(),
  806 |             Arc::new(vec![]),
  807 |             DataStorageFormat::default(),
  808 |             HashMap::new(),
  809 |         )
  810 |     }
  811 | 
  812 |     #[test]
  813 |     fn mixed_capability_is_below_the_unknown_boundary() {
  814 |         assert!(can_read_dataset(FLAG_COVERED_INDEX_METADATA));
  815 |         assert!(can_write_dataset(FLAG_COVERED_INDEX_METADATA));
  816 |         assert!(can_read_dataset(FLAG_MIXED_DATA_FILE_VERSIONS));
  817 |         assert!(can_write_dataset(FLAG_MIXED_DATA_FILE_VERSIONS));
  818 |         assert!(!can_read_dataset(FLAG_UNKNOWN));
  819 |     }
  820 | }
``````
