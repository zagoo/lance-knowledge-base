> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/transaction/row_version.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `eb0caed18a511d1d26aab6c8aa5897edb110c2e41ba260b84c9411f20d7b46bc`. Reviewed physical lines: 1-1461.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Synchronous transaction row-ID allocation and creation/update lineage resolution, with public writer-placed-lineage predicate and transaction-internal helpers. Complete local mutation, fallback, preload and test analysis; no atomic commit or data-file IO implementation. (rust/lance-table/src/transaction/row_version.rs:1-1461)

## Complete range analysis

### Lines 1-20

SPDX and module docs describe stable row IDs with creation and last-update dataset-version sequences, preserving creation by tracing rewritten rows to source positions. Imports connect Fragment/metadata/version sequence, SpilledRowLineage/build_version_meta, row-ID codecs/sequence, Transaction, core errors, Cow, Ordering and HashMap/HashSet. This synchronous module has no store, await, IO, locks or unsafe blocks. row_version is a private transaction child with has_writer_placed_lineage publicly reexported (rust/lance-table/src/transaction.rs:29-54). (rust/lance-table/src/transaction/row_version.rs:1-20)

### Lines 21-38

Private UNKNOWN_CREATED_AT_VERSION:u64=1 is the fallback for an existing source row whose creation version is unavailable. Comment identifies1 as the initial dataset version; contextual builder starts absent-manifest version at1 (rust/lance-table/src/transaction/manifest_build.rs:752-752). The following helper contract says callers should supply only found UPDATE rows, with INSERT rows handled separately; O(K) is linear run lookup, not constant-time cached value access. (rust/lance-table/src/transaction/row_version.rs:21-38)

### Lines 39-53

Private resolve_created_at_version accepts row ID, borrowed source map of ID to (&Fragment,usize offset), and owned decoded-sequence cache keyed by fragment ID. Missing source, missing cache entry or version_at out-of-range each returns1. It neither decodes nor allocates nor errors here. version_at scans run lengths from the start for every call, with unchecked prefix arithmetic (rust/lance-table/src/rowids/version.rs:272-282). (rust/lance-table/src/transaction/row_version.rs:39-53)

### Lines 54-80

Public has_writer_placed_lineage returns true iff row_id_meta is Column OR created_at_version_meta is Column. A last_updated_at Column alone does not qualify. It does not check physical count, carrier files, flags, provenance or payload validity. Docs explain trusting writer-placed creation lineage while recomputing inline/inline creation lineage; the doctest changes an empty Fragment to row-ID Column and asserts classification. Actual output validation/stamping is separate; this predicate is publicly callable through the transaction reexport. (rust/lance-table/src/transaction/row_version.rs:54-80)

### Lines 81-111

pub(super) resolve_update_version_metadata receives immutable existing fragments, mutable new fragment slice, caller new_version and immutable preloaded lineage map; returns Result<()> with no IO. It collects needed IDs only from new fragments failing writer-placed classification and having successfully decoded inline row IDs. Inline decode errors are silently dropped via ok(). Each decoded sequence expands into a temporary Vec before insertion into a HashSet; duplicates collapse. Empty needed set avoids all existing-fragment scans, but later output processing still runs. Map size is bounded by distinct requested IDs, not total dataset IDs; transient expansion/decoded storage is additional memory. (rust/lance-table/src/transaction/row_version.rs:81-111)

### Lines 112-133

Creates empty ID-to-source HashMap. For nonempty needed IDs, finds min/max by two set scans, collects one &Fragment per existing entry, and stable-sorts by fragment.id. Documentation wants the earliest/original occurrence even when old soft-deleted copies coexist with newer rewritten copies. The algorithm relies on ID ordering as lineage history and does not read deletion vectors or distinguish live/deleted rows. Sorting costs O(F log F) time and O(F) reference storage plus sorting scratch; it does not stop once all requested IDs are found. (rust/lance-table/src/transaction/row_version.rs:112-133)

### Lines 134-150

For each existing fragment, inline row IDs decode into owned Cow or silently become None on error; absent metadata is ignored. Column row IDs require spilled[frag.id].row_ids and borrow its Arc target. Missing preload returns NotSupported containing fragment ID and explaining inability to resolve rewritten rows. This requirement occurs before the range prefilter, so even an unrelated spilled fragment needs loaded row IDs whenever the needed set is nonempty. Preload identity/count/carrier consistency is trusted. (rust/lance-table/src/transaction/row_version.rs:134-150)

### Lines 151-172

For a decoded/borrowed sequence, inclusive row_id_range outside [needed_min,needed_max] or None skips enumeration. It is a conservative min/max filter, not exact set intersection, and requires decoding/loading first. Every remaining ID is enumerated at its physical sequence ordinal, and needed IDs insert through entry.or_insert; smallest fragment ID wins, and first duplicate within that sequence wins. No deletion filtering or duplicate rejection. Numeric-gap cost inherits sequence iteration; row_id_range behavior is documented at rust/lance-table/src/rowids.rs:279-300. (rust/lance-table/src/transaction/row_version.rs:151-172)

### Lines 173-185

Collects source fragment IDs into a HashSet, then scans original existing_fragments order to build owned creation-version cache. Only source IDs are considered and absent created_at metadata is skipped. For unique fragment IDs each selected source is decoded once, reducing protobuf decoding per updated row; duplicate fragment IDs are not validated, can cause repeated processing and later cache replacement, so exactly-once assumes valid fragment identity. (rust/lance-table/src/transaction/row_version.rs:173-185)

### Lines 186-205

Source created-at Column requires spilled[frag.id].created_at, clones its Arc and then clones the underlying RowDatasetVersionSequence into version_cache. Missing preload returns contextual NotSupported. Inline load_sequence succeeds into cache or its error is silently ignored, causing later fallback1. Source creation length/version values are not validated against physical rows or commit version. All source discovery and cache errors occur before this function mutates new fragments. last_updated_at preload is unused. (rust/lance-table/src/transaction/row_version.rs:186-205)

### Lines 206-216

Processes new fragments in supplied order. First match arm is any row-ID state plus created_at Column: retain creation metadata unvalidated and assign last_updated_at=build_version_meta(fragment,new_version), then continue. This includes absent row IDs: positive physical_rows can therefore panic in build_version_meta despite Result return (rust/lance-table/src/rowids/version.rs:655-678). Zero/unknown physical rows produce None last-update metadata. Caller preparation may prevent malformed combinations; the local function does not. (rust/lance-table/src/transaction/row_version.rs:206-216)

### Lines 217-240

For row-ID Column plus Some non-Column creation metadata (necessarily Inline after prior arm), decode creation sequence, convert error to InvalidInput with fragment ID and cause, and require sequence.len equal physical_rows.unwrap_or(0) as u64. Mismatch reports both counts and fragment ID. On success retains supplied creation bytes and stamps last-update via build_version_meta. This validates only decoded length, not creation versions, carrier/provenance or positional span semantics. Unknown physical rows require zero decoded length and yield None stamp. (rust/lance-table/src/transaction/row_version.rs:217-240)

### Lines 241-257

Row-ID Column without creation metadata returns NotSupported: spilling row IDs requires placing creation lineage. Inline row IDs otherwise decode via ok(), ignoring supplied inline creation metadata and any decode error; no row IDs gives None. Created-at Column already took the first arm. This establishes asymmetric corruption policy: writer-placed inline creation is strict, ordinary inline row-ID decode here is permissive. (rust/lance-table/src/transaction/row_version.rs:241-257)

### Lines 258-277

For successful inline row IDs, physical_rows defaults0; materializes one u64 creation version per yielded row in order. Found IDs call resolve_created_at_version; missing IDs use new_version as INSERT branch. A debug_assert_eq checks generated count versus physical_rows; there is no release Result validation, and new_version need not exceed source versions. Each found row performs map membership then another map lookup and linear version-run scan. Worst case includes sum of source-run traversals across all rewritten rows. (rust/lance-table/src/transaction/row_version.rs:258-277)

### Lines 278-296

Compresses creation vector with from_versions into consecutive equal-version Range runs, serializes it and replaces created_at; serialization Result error would become Internal with cause, though from_sequence has no normal local Err arm (rust/lance-table/src/rowids/version.rs:230-250; rust/lance-table/src/rowids/version.rs:463-484). Then replaces last-update with build_version_meta. For absent/failed inline row-ID decode it builds one uniform metadata value and assigns both, cloning the shared handle. Empty valid inline input produces Some(empty creation bytes) but build_version_meta returns None for zero rows. Errors/panics in later fragments leave previous mutations; no rollback is implemented. Row-ID bytes themselves are not repaired here. (rust/lance-table/src/transaction/row_version.rs:278-296)

### Lines 297-310

Transaction inherent impl adds pub(super) collect_pure_rewrite_row_update_frags_ids(&[Fragment])->Result<Vec<u64>>. It allocates output and requires physical_rows on every fragment, even one without row IDs; missing count returns Internal with Fragment does not have physical rows. usize count casts to u64 unchecked. Despite pure-rewrite naming, its test is only metadata cardinality. (rust/lance-table/src/transaction/row_version.rs:297-310)

### Lines 311-331

If metadata exists, inline row IDs decode with errors propagated and their sequence length is used; Column is assumed to cover exactly physical_rows without IO or validation. Equal count appends fragment.id; smaller or larger count silently omits it; absent metadata omits it. Returns IDs in input order, preserving duplicate fragment IDs. It cannot establish that rows came from an existing source, exclude inserted rows, or verify global uniqueness. Contextual builder calls it after assign_row_ids (rust/lance-table/src/transaction/manifest_build.rs:945-965), so assignment can make an originally partial fragment qualify. Index consequences require full consumer analysis. (rust/lance-table/src/transaction/row_version.rs:311-331)

### Lines 332-355

pub(super) Transaction::assign_row_ids(&mut u64,&mut [Fragment])->Result<()> processes fragments in order and always requires known physical_rows, returning Internal otherwise. Existing inline metadata decodes to count with propagated errors; Column count is trusted equal physical count, so column carrier content is never loaded. This helper neither checks feature flags nor uses deletion counts. next_row_id is supplied mutable state; no lock or dataset-wide uniqueness check. (rust/lance-table/src/transaction/row_version.rs:332-355)

### Lines 356-375

Equal existing count is an immediate no-op: metadata bytes and next_row_id stay unchanged. For shortage computes remaining=physical-existing and new range next..next+remaining with unchecked u64 addition. It decodes the same inline bytes a second time; the non-inline fallback returns Internal but cannot be selected for valid Column because Column took equality. No overlap or reserved-ID check is made for the new range. (rust/lance-table/src/transaction/row_version.rs:356-375)

### Lines 376-394

Shortage branch expands every existing ID into Vec, pushes each newly allocated ID, rebuilds one RowIdSequence via infallible slice conversion, serializes it, replaces Inline metadata and only then increments next_row_id by shortage. This materializes O(physical rows) values and may reselect representation; write_row_ids also clones/converts protobuf (rust/lance-table/src/rowids.rs:215-219; rust/lance-table/src/rowids/serde.rs:341-344). No checked-constructor uniqueness validation is used. Excess count returns Internal with actual/expected counts, without fragment ID; this fragment is unchanged, but earlier fragments/counter may already be mutated. (rust/lance-table/src/transaction/row_version.rs:376-394)

### Lines 395-407

Without row-ID metadata, constructs raw Range next..next+physical, serializes and stores Inline, then advances counter with ordinary addition. Range creation avoids per-row materialization on this branch; zero rows still produce Inline empty-range encoding and unchanged counter. Overflow may panic with checks or wrap without them; no Result range validation. TODO about a separate file is not implemented: this path always emits inline bytes. Returns Ok only after all fragments, with no transaction rollback, version stamping, file writes or atomic publication. (rust/lance-table/src/transaction/row_version.rs:395-407)

### Lines 408-419

Private cfg(test) module imports parent, RowDatasetVersionRun/U64Segment, shared creation/update accessors, default config, stable manifest and update_txn, rstest and Arc. Direct helper fixtures use in-memory Fragment metadata with empty base/overlay files and absent deletion metadata; no actual data file or spilled column is opened. Tests below were read, not executed. (rust/lance-table/src/transaction/row_version.rs:408-419)

### Lines 420-449

test_assign_row_ids_new_fragment constructs fragment1 with100 physical rows, absent row/creation/update metadata and empty files/overlays/deletion. Starting counter0, invokes assignment and asserts next100, metadata presence, decoded length100 and exact IDs0..100; non-Inline panics. It does not validate version metadata or disk state. (rust/lance-table/src/transaction/row_version.rs:420-449)

### Lines 450-456

Private inline_versions(rows,version) builds a uniform RowDatasetVersionSequence then from_sequence and unwraps. It is a fixture helper returning RowDatasetVersionMeta, without row-ID checks, storage IO or special zero-row assertions. (rust/lance-table/src/transaction/row_version.rs:450-456)

### Lines 457-479

test_assign_row_ids_spilled_is_complete gives fragment1 Column row IDs,50 physical rows and counter100. Assignment succeeds, counter remains100 and marker equals original; no real hidden column, count verification or creation metadata is required by assignment. (rust/lance-table/src/transaction/row_version.rs:457-479)

### Lines 480-507

test_resolve_update_versions_keeps_writer_placed_created_at uses Column IDs and Column creation for50 rows, initially inline last-update7. Direct resolution with no existing/preloaded fragments and new_version9 preserves Column creation and replaces last-update with inline uniform9. Demonstrates trust of writer-placed markers without source scanning or actual column data. (rust/lance-table/src/transaction/row_version.rs:480-507)

### Lines 508-547

test_resolve_update_versions_skips_source_scan_for_spilled_new_fragments supplies existing fragment1 with unloaded Column row/creation metadata, then new fragment2 with inline IDs10..12 but Column creation. Direct resolution9 succeeds and retains creation Column/stamps two9 values. The absent preload would fail if source discovery ran; this is a behavioral skip assertion, not a scan-count instrument. (rust/lance-table/src/transaction/row_version.rs:508-547)

### Lines 548-588

test_resolve_update_versions_recomputes_inline_created_at uses the same inline IDs0..10 in source1 and destination2, source creation/update3 and caller-supplied destination creation7. Direct resolution9 asserts creation becomes3 and update9 for10 rows, proving ordinary inline/inline supplied creation bytes are overwritten. (rust/lance-table/src/transaction/row_version.rs:548-588)

### Lines 589-628

rstest cases covers_every_row50 and too_short40 use Column row IDs with50 physical rows and inline creation3. Equal case retains inline creation and stamps9; short case requires InvalidInput and diagnostic substring40 created-at versions for50 physical rows. It does not cover overlong, malformed, unknown/zero physical count or mid-batch mutation. (rust/lance-table/src/transaction/row_version.rs:589-628)

### Lines 629-657

Spilled-source test constructs source1 with50 physical rows, Column IDs/creation and inline last-update2. Local new_fragment closure makes fragment2 with two physical rows and inline range argument, no version metadata or files. The closure does not verify that argument has two IDs; tests supply valid lengths. (rust/lance-table/src/transaction/row_version.rs:629-657)

### Lines 658-672

First resolve of new IDs10..12 without preload returns NotSupported. Next a new fragment changed to Column IDs and still no creation metadata also returns NotSupported with no existing sources. Assertions check only error variant, not messages or mutation state. These exercise missing source-row preload and missing writer creation lineage separately. (rust/lance-table/src/transaction/row_version.rs:658-672)

### Lines 673-704

Builds preload for source1: row IDs100..150 and50 creation versions initially2, position10=3 and11=4, with no last-update sequence. Resolves new IDs110..112 at version9; local versions closure unwraps metadata decode and collects values. Asserts created[3,4], updated[9,9]. Does not separately test missing source-created preload, source length mismatch or out-of-range lookup. (rust/lance-table/src/transaction/row_version.rs:673-704)

### Lines 705-738

test_assign_row_ids_existing_complete encodes0..50 for50 rows, counter100; assignment leaves counter100 and decoded exact IDs/length unchanged. It does not compare byte identity directly, though equality branch is a source-level no-op. (rust/lance-table/src/transaction/row_version.rs:705-738)

### Lines 739-773

test_assign_row_ids_partial_existing encodes0..30 for50 rows, counter100; asserts counter120, length50 and exact concatenation0..30 then100..120. This pins preserved existing order and appended allocation range, not dataset-wide uniqueness or malformed prefix behavior. (rust/lance-table/src/transaction/row_version.rs:739-773)

### Lines 774-801

test_assign_row_ids_excess_row_ids supplies60 IDs for50 rows, counter100; asserts error and specifically Internal message containing both counts. No post-error counter/fragment equality assertion, multi-fragment rollback assertion or out-of-range arithmetic test. (rust/lance-table/src/transaction/row_version.rs:774-801)

### Lines 802-830

Multi-fragment assignment fixture has fragment1 with30 rows/no IDs and fragment2 with25 rows/20 existing IDs500..520, empty files/overlays/deletion/version metadata. Counter starts1000. This uses two different input states in one ordered mutable slice. (rust/lance-table/src/transaction/row_version.rs:802-830)

### Lines 831-860

After assignment, multi-fragment fixture asserts next1035. Fragment1 is Inline0-based allocation1000..1030 of length30; fragment2 is Inline length25 preserving500..520 then appending1030..1035. Non-Inline branches panic. Thus later fragment consumes counter advanced by earlier one. (rust/lance-table/src/transaction/row_version.rs:831-860)

### Lines 861-885

Missing-physical-row test gives fragment1 with all metadata/count absent, invokes assignment at counter0, and asserts Internal plus Fragment does not have physical rows substring. It does not exercise missing count alongside existing/Column metadata or after a successfully assigned earlier fragment. (rust/lance-table/src/transaction/row_version.rs:861-885)

### Lines 886-928

Manifest integration test source1 has IDs100,101,102, uniform creation5 and3 physical rows. Destination10 has IDs100,102/two rows. Shared fixture builds stable manifest, update transaction and build_manifest; extracted creation/update both equal[5,5]. Contextually fixture manifest.version=4, next_row_id=1000, reader stable flag; update read_version4, update_modeNone and default config use_stable_row_idsfalse (rust/lance-table/src/transaction/test_support.rs:21-34; rust/lance-table/src/transaction/test_support.rs:73-124). Equality of source and next version makes this test alone unable to distinguish preserved from freshly stamped creation. (rust/lance-table/src/transaction/row_version.rs:886-928)

### Lines 929-972

Mixed-origins integration fixture makes source1 IDs10,11 with creation2, source2 IDs20,21,22 with creation3 and matching physical counts; each has empty files/overlays/deletion and no last-update metadata. Both are placed in the shared stable manifest. (rust/lance-table/src/transaction/row_version.rs:929-972)

### Lines 973-994

New fragment10 takes IDs11,20 in that order; build_manifest result must have created[2,3] and updated[5,5]. Asserts source-offset mapping across two fragments, preserving destination order and commit stamping. No disk publication or conflict retry is invoked by the test. (rust/lance-table/src/transaction/row_version.rs:973-994)

### Lines 995-1024

INSERT-branch integration test explains distinguishing a found rewritten ID10 from new ID999, but source IDs10,11 have creation5, equal the fixture next commit version. Source1 has two rows and no data files or last-update metadata. (rust/lance-table/src/transaction/row_version.rs:995-1024)

### Lines 1025-1049

Destination10 contains[10,999], and resulting creation/update both[5,5]. Comment attributes next version5 to update read_version4; contextual builder actually computes current_manifest.version+1 (rust/lance-table/src/transaction/manifest_build.rs:752-752). Fixture values coincide, so this assertion alone does not discriminate found versus absent creation logic. The following test uses distinct versions. (rust/lance-table/src/transaction/row_version.rs:1025-1049)

### Lines 1050-1079

Distinct UPDATE/INSERT test source1 contains IDs10,11 with creation3, while comments specify new ordered IDs10,500,11,501 and expected creation3,5,3,5. The source fixture has two physical rows and empty storage metadata. (rust/lance-table/src/transaction/row_version.rs:1050-1079)

### Lines 1080-1104

Destination20 contains nonmonotone IDs[10,500,11,501]/four physical rows. Shared build_manifest asserts creation[3,5,3,5] and all update5, directly distinguishing preserved and inserted branches while preserving physical order. Current version is supplied by manifest fixture, not validated against source creation in this helper. (rust/lance-table/src/transaction/row_version.rs:1080-1104)

### Lines 1105-1142

Source-no-created-at integration test has source1 IDs50,51 but no creation metadata; new fragment10 selects50. Result must be created[1], updated[5]. This pins found-source fallback1, distinct from absent-ID new_version5. (rust/lance-table/src/transaction/row_version.rs:1105-1142)

### Lines 1143-1179

No-row-ID integration fixture has source IDs10,11 and a new3-row fragment10 without row metadata. build_manifest assigns fresh IDs first, then resolves them as INSERT rows; expected creation/update both[5,5,5]. This tests caller ordering, not a direct successful resolver call on positive physical rows with no row IDs (which can panic through build_version_meta). (rust/lance-table/src/transaction/row_version.rs:1143-1179)

### Lines 1180-1217

Corrupt-created-at integration fixture gives source1 IDs10,11 and eight0xFF inline creation bytes. Destination10 selects10; build_manifest succeeds and both extracted arrays are created[1], updated[5]. Tests deliberate suppression of source creation decode errors, not corrupt source row-ID bytes or strict writer-placed creation validation. (rust/lance-table/src/transaction/row_version.rs:1180-1217)

### Lines 1218-1244

Range-filter test comment incorrectly calls fragment1 the out-of-range source; actual first constructed fragment1 holds IDs10,11 with creation5 and2 rows. Header expects outside-range creation99 never to appear. This is a correctness fixture, not instrumented proof of reduced row scanning. (rust/lance-table/src/transaction/row_version.rs:1218-1244)

### Lines 1245-1278

Actual outside-range source is fragment2 with IDs1000,1001, creation99 and2 rows. Destination10 rewrites IDs10,11, with no prior version metadata. This contradicts only the header fragment-number label, not its intended range scenario. (rust/lance-table/src/transaction/row_version.rs:1245-1278)

### Lines 1279-1289

Builds both sources into stable manifest and asserts destination creation/update[5,5]. It proves unrelated source values do not contaminate output for this fixture, but would also pass with a correct full scan; no counter measures whether prefilter skipped enumeration. (rust/lance-table/src/transaction/row_version.rs:1279-1289)

### Lines 1290-1312

Inclusive-boundary integration test source1 is IDs10,11,12 with creation7 and3 rows. This creation value exceeds fixture new_version5, so test data also demonstrates no local monotonicity validation, not a valid historical chronology guarantee. (rust/lance-table/src/transaction/row_version.rs:1290-1312)

### Lines 1313-1334

Destination10 takes exactly boundary IDs10 and12; build_manifest creation must be[7,7]. No last-update assertion here. The inclusive prefilter cannot skip these bounds. (rust/lance-table/src/transaction/row_version.rs:1313-1334)

### Lines 1335-1369

Many-rows same-source test comments require one decode per fragment but construct no decode counter. Source IDs0..100 use two50-row version runs,3 then4; each run span is0..50, confirming lengths/order matter rather than globally distinct span coordinates. Source1 has100 physical rows and no storage files. (rust/lance-table/src/transaction/row_version.rs:1335-1369)

### Lines 1370-1394

Destination10 rewrites all100 IDs. Build result creation length100 and halves all3/all4 are asserted. This verifies values and order, not decode count, allocation count or runtime; those performance properties require source reasoning or dedicated instrumentation. (rust/lance-table/src/transaction/row_version.rs:1370-1394)

### Lines 1395-1440

Multiple-source cache fixture creates source1 IDs10,11,12/version2 and source2 IDs20,21,22/version8, each3 rows, storing both in stable manifest. Version8 exceeds current/next fixture version; no chronological validity assertion exists. (rust/lance-table/src/transaction/row_version.rs:1395-1440)

### Lines 1441-1461

Destination10 takes IDs12,20, then build_manifest requires creation[2,8]. Confirms source-fragment cache keys and differing local offsets, not last-update behavior, duplicate-source precedence or missing-preload failures. Closes cfg(test) module. No local test directly covers collect_pure_rewrite_row_update_frags_ids or resolve_created_at_version in isolation; other tests exercise some behavior indirectly. (rust/lance-table/src/transaction/row_version.rs:1441-1461)

## Interaction and interpretation limits

Direct callers and policy: transaction facade publicly reexports has_writer_placed_lineage (rust/lance-table/src/transaction.rs:29-54). Contextually read manifest builder assigns before resolving Update creation, later collects cardinality-only pure-rewrite IDs and calls assignment a second time (rust/lance-table/src/transaction/manifest_build.rs:945-1002). Append/Overwrite call assignment then uniform version stamping (rust/lance-table/src/transaction/manifest_build.rs:760-774; rust/lance-table/src/transaction/manifest_build.rs:1017-1038). Full builder/validation/index consequences and retry/IO orchestration are not yet analyzed. No source tests ran. Important untested local edges: corrupt row-ID suppression in direct resolver, duplicate source-fragment precedence with deletion metadata, absent source-created preload, unknown/zero counts, output length mismatch without debug assertions, next-ID overflow/overlap, and errors after prior fragment mutation (rust/lance-table/src/transaction/row_version.rs:102-295; rust/lance-table/src/transaction/row_version.rs:300-405).

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Row ids and the per-row version metadata that travels with them.
    5 | //!
    6 | //! Under stable row ids each fragment carries two run-length encoded sequences:
    7 | //! `created_at_version`, stamped once when a row first appears, and
    8 | //! `last_updated_at_version`, refreshed whenever a row's values change. Keeping
    9 | //! `created_at` correct across an update means tracing each new row back to the
   10 | //! fragment and offset it came from, which is what most of this module does.
   11 | 
   12 | use crate::format::{Fragment, RowDatasetVersionMeta, RowDatasetVersionSequence, RowIdMeta};
   13 | use crate::rowids::version::{SpilledRowLineage, build_version_meta};
   14 | use crate::rowids::{RowIdSequence, read_row_ids, write_row_ids};
   15 | use crate::transaction::Transaction;
   16 | use lance_core::{Error, Result};
   17 | use std::borrow::Cow;
   18 | use std::cmp::Ordering;
   19 | use std::collections::{HashMap, HashSet};
   20 | 
   21 | /// Fallback version for rows whose original creation version cannot be determined.
   22 | /// Version 1 is the initial dataset version in the Lance format.
   23 | const UNKNOWN_CREATED_AT_VERSION: u64 = 1;
   24 | 
   25 | /// Look up the `created_at` version for a single UPDATE-branch row ID.
   26 | ///
   27 | /// Callers must only call this for row IDs that are confirmed to be present in
   28 | /// `row_id_to_source` (i.e. UPDATE branch rows whose source exists in an existing
   29 | /// fragment).  INSERT branch rows (no source) must use `new_version` directly and
   30 | /// must not call this function.
   31 | ///
   32 | /// Uses `row_id_to_source` to find the originating fragment and row offset, then
   33 | /// performs a O(K) random-access lookup via [`RowDatasetVersionSequence::version_at`]
   34 | /// on the pre-decoded sequence in `version_cache` (keyed by fragment ID).
   35 | ///
   36 | /// Returns [`UNKNOWN_CREATED_AT_VERSION`] if the source fragment has no
   37 | /// `created_at_version_meta` (missing or failed to decode) or the offset is
   38 | /// out of range.
   39 | fn resolve_created_at_version(
   40 |     row_id: u64,
   41 |     row_id_to_source: &HashMap<u64, (&Fragment, usize)>,
   42 |     version_cache: &HashMap<u64, RowDatasetVersionSequence>,
   43 | ) -> u64 {
   44 |     let Some((orig_frag, row_offset)) = row_id_to_source.get(&row_id) else {
   45 |         return UNKNOWN_CREATED_AT_VERSION;
   46 |     };
   47 |     let Some(seq) = version_cache.get(&orig_frag.id) else {
   48 |         return UNKNOWN_CREATED_AT_VERSION;
   49 |     };
   50 |     seq.version_at(*row_offset)
   51 |         .unwrap_or(UNKNOWN_CREATED_AT_VERSION)
   52 | }
   53 | 
   54 | /// Whether an update's new `fragment` carries row lineage its writer placed
   55 | /// outside the manifest, which the commit keeps instead of resolving.
   56 | ///
   57 | /// That is spilled row ids or spilled created-at versions. The commit cannot
   58 | /// read either back, and only a writer carrying the lineage of rows it read
   59 | /// over into the fragment produces them. Inline created-at versions next to
   60 | /// inline row ids do not count: the commit resolves those again from the row
   61 | /// ids, whatever the caller supplied, so a hand-built transaction cannot
   62 | /// commit stale ones.
   63 | ///
   64 | /// ```
   65 | /// use lance_table::format::{Fragment, RowIdMeta};
   66 | /// use lance_table::transaction::has_writer_placed_lineage;
   67 | ///
   68 | /// let mut fragment = Fragment::new(0);
   69 | /// assert!(!has_writer_placed_lineage(&fragment));
   70 | /// fragment.row_id_meta = Some(RowIdMeta::Column);
   71 | /// assert!(has_writer_placed_lineage(&fragment));
   72 | /// ```
   73 | pub fn has_writer_placed_lineage(fragment: &Fragment) -> bool {
   74 |     matches!(fragment.row_id_meta, Some(RowIdMeta::Column))
   75 |         || matches!(
   76 |             fragment.created_at_version_meta,
   77 |             Some(RowDatasetVersionMeta::Column)
   78 |         )
   79 | }
   80 | 
   81 | /// For each new fragment produced by an update, set `created_at_version_meta`
   82 | /// (preserved from the original rows) and `last_updated_at_version_meta`.
   83 | ///
   84 | /// A fragment with writer-placed lineage (see [`has_writer_placed_lineage`])
   85 | /// keeps its created-at versions and only has its last-updated-at versions
   86 | /// stamped.
   87 | ///
   88 | /// `spilled` supplies the row ids and created-at versions of existing
   89 | /// fragments that keep them outside the manifest; see
   90 | /// [`SpilledRowLineage`].
   91 | pub(super) fn resolve_update_version_metadata(
   92 |     existing_fragments: &[Fragment],
   93 |     new_fragments: &mut [Fragment],
   94 |     new_version: u64,
   95 |     spilled: &SpilledRowLineage,
   96 | ) -> Result<()> {
   97 |     // Collect only the row IDs we actually need to resolve, those appearing in new_fragments
   98 |     // with inline metadata. This bounds the lookup map to O(updated rows) instead of O(all dataset rows)
   99 |     // A fragment with writer-placed lineage needs no lookup; when every new
  100 |     // fragment has it, the set stays empty and the existing fragments are not
  101 |     // scanned at all.
  102 |     let needed_row_ids: HashSet<u64> = new_fragments
  103 |         .iter()
  104 |         .filter(|f| !has_writer_placed_lineage(f))
  105 |         .filter_map(|f| match &f.row_id_meta {
  106 |             Some(RowIdMeta::Inline(data)) => read_row_ids(data).ok(),
  107 |             _ => None,
  108 |         })
  109 |         .flat_map(|seq| seq.iter().collect::<Vec<_>>())
  110 |         .collect();
  111 | 
  112 |     let mut row_id_to_source: HashMap<u64, (&Fragment, usize)> = HashMap::new();
  113 | 
  114 |     if !needed_row_ids.is_empty() {
  115 |         // Compute the bounding range of the needed set once.  Any fragment whose
  116 |         // entire row-id range lies outside [needed_min, needed_max] cannot contain
  117 |         // any needed ID and can be skipped before the inner per-row loop.
  118 |         let needed_min = *needed_row_ids.iter().min().unwrap();
  119 |         let needed_max = *needed_row_ids.iter().max().unwrap();
  120 | 
  121 |         // Stable row IDs must be globally unique among *live* rows, but after a rewrite-style
  122 |         // update the same stable ID can appear twice in `existing_fragments`: once in an older
  123 |         // fragment's inline `row_id_meta` at the original row offset (rows may be soft-deleted
  124 |         // via a deletion vector) and again in a newer fragment holding rewritten data. For
  125 |         // `created_at` we need the mapping from the original fragment/offset; that is always the
  126 |         // first occurrence when fragments are processed in ascending `id` order.
  127 |         let mut sorted_frags: Vec<&Fragment> = existing_fragments.iter().collect();
  128 |         sorted_frags.sort_by_key(|f| f.id);
  129 |         for frag in sorted_frags {
  130 |             // Finding which existing row each rewritten row came from means
  131 |             // scanning every existing fragment's row ids, and a spilled sequence
  132 |             // cannot be read here. Skipping such a fragment would make its rows
  133 |             // look freshly inserted and stamp them with a new created-at version.
  134 |             let seq = match &frag.row_id_meta {
  135 |                 Some(RowIdMeta::Inline(data)) => read_row_ids(data).ok().map(Cow::Owned),
  136 |                 Some(RowIdMeta::Column) => Some(Cow::Borrowed(
  137 |                     spilled
  138 |                         .get(&frag.id)
  139 |                         .and_then(|lineage| lineage.row_ids.as_deref())
  140 |                         .ok_or_else(|| {
  141 |                             Error::not_supported(format!(
  142 |                                 "fragment {} stores its row ids outside the manifest and they \
  143 |                                  were not loaded ahead of the commit; cannot resolve which rows \
  144 |                                  this update rewrote",
  145 |                                 frag.id
  146 |                             ))
  147 |                         })?,
  148 |                 )),
  149 |                 None => None,
  150 |             };
  151 |             if let Some(seq) = seq {
  152 |                 // Range pre-filter: skip the per-row inner loop when the fragment's
  153 |                 // bounding row-id range has no overlap with [needed_min, needed_max].
  154 |                 // row_id_range() returns None for empty sequences, which are also skipped.
  155 |                 // This is a conservative check (may produce false positives for sparse
  156 |                 // segments) but never skips a fragment that actually contains a needed ID.
  157 |                 if seq
  158 |                     .row_id_range()
  159 |                     .is_none_or(|r| *r.end() < needed_min || *r.start() > needed_max)
  160 |                 {
  161 |                     continue;
  162 |                 }
  163 | 
  164 |                 for (offset, rid) in seq.iter().enumerate() {
  165 |                     if needed_row_ids.contains(&rid) {
  166 |                         row_id_to_source.entry(rid).or_insert((frag, offset));
  167 |                     }
  168 |                 }
  169 |             }
  170 |         }
  171 |     }
  172 | 
  173 |     // Pre-decode the `created_at` version sequence for each source fragment exactly
  174 |     // once.  Without this cache, resolve_created_at_version would call load_sequence()
  175 |     // (a protobuf decode) for every single updated row, even when many rows originate
  176 |     // from the same fragment.
  177 |     let source_frag_ids: HashSet<u64> = row_id_to_source.values().map(|(f, _)| f.id).collect();
  178 |     let mut version_cache: HashMap<u64, RowDatasetVersionSequence> = HashMap::new();
  179 |     for frag in existing_fragments
  180 |         .iter()
  181 |         .filter(|f| source_frag_ids.contains(&f.id))
  182 |     {
  183 |         let Some(meta) = &frag.created_at_version_meta else {
  184 |             continue;
  185 |         };
  186 |         if matches!(meta, RowDatasetVersionMeta::Column) {
  187 |             // The rewritten rows' original created-at versions live in a data
  188 |             // file, which this path cannot read. Defaulting them would silently
  189 |             // rewrite their lineage, so the caller has to have read them.
  190 |             let loaded = spilled
  191 |                 .get(&frag.id)
  192 |                 .and_then(|lineage| lineage.created_at.clone())
  193 |                 .ok_or_else(|| {
  194 |                     Error::not_supported(format!(
  195 |                         "fragment {} stores its created-at versions outside the manifest \
  196 |                          and they were not loaded ahead of the commit",
  197 |                         frag.id
  198 |                     ))
  199 |                 })?;
  200 |             version_cache.insert(frag.id, loaded.as_ref().clone());
  201 |         } else if let Ok(seq) = meta.load_sequence() {
  202 |             version_cache.insert(frag.id, seq);
  203 |         }
  204 |     }
  205 | 
  206 |     for fragment in new_fragments.iter_mut() {
  207 |         let row_ids = match (&fragment.row_id_meta, &fragment.created_at_version_meta) {
  208 |             // Writer-placed lineage (see `has_writer_placed_lineage`): the
  209 |             // writer read the rewritten rows and placed their created-at
  210 |             // versions itself. The last-updated-at version is this commit's,
  211 |             // which only the commit knows (a conflict retry moves it), so it
  212 |             // is stamped here whatever the writer left.
  213 |             (_, Some(RowDatasetVersionMeta::Column)) => {
  214 |                 fragment.last_updated_at_version_meta = build_version_meta(fragment, new_version);
  215 |                 continue;
  216 |             }
  217 |             (Some(RowIdMeta::Column), Some(created_at)) => {
  218 |                 // Unlike a spilled sequence, an inline one can be checked
  219 |                 // against the fragment here without IO.
  220 |                 let placed_rows = created_at
  221 |                     .load_sequence()
  222 |                     .map_err(|error| {
  223 |                         Error::invalid_input(format!(
  224 |                             "fragment {} carries created-at version metadata that does not \
  225 |                              decode: {error}",
  226 |                             fragment.id
  227 |                         ))
  228 |                     })?
  229 |                     .len();
  230 |                 let physical_rows = fragment.physical_rows.unwrap_or(0) as u64;
  231 |                 if placed_rows != physical_rows {
  232 |                     return Err(Error::invalid_input(format!(
  233 |                         "fragment {} carries {placed_rows} created-at versions for \
  234 |                          {physical_rows} physical rows",
  235 |                         fragment.id
  236 |                     )));
  237 |                 }
  238 |                 fragment.last_updated_at_version_meta = build_version_meta(fragment, new_version);
  239 |                 continue;
  240 |             }
  241 |             (Some(RowIdMeta::Column), None) => {
  242 |                 // Resolving the versions needs the row ids, which this
  243 |                 // commit-time path cannot read back from a data file; a writer
  244 |                 // that spills them has to place the created-at versions too.
  245 |                 return Err(Error::not_supported(format!(
  246 |                     "fragment {} stores its row ids outside the manifest but carries no \
  247 |                      created-at version metadata; a writer that spills row ids must place \
  248 |                      the created-at versions with them",
  249 |                     fragment.id
  250 |                 )));
  251 |             }
  252 |             // Inline created-at versions next to inline row ids are resolved
  253 |             // again below, overwriting whatever the caller supplied.
  254 |             (Some(RowIdMeta::Inline(data)), _) => read_row_ids(data).ok(),
  255 |             (None, _) => None,
  256 |         };
  257 | 
  258 |         if let Some(row_ids) = row_ids {
  259 |             let physical_rows = fragment.physical_rows.unwrap_or(0);
  260 |             let created_at_versions: Vec<u64> = row_ids
  261 |                 .iter()
  262 |                 .map(|rid| {
  263 |                     if row_id_to_source.contains_key(&rid) {
  264 |                         // UPDATE branch: stable row ID resolves to a source row in an
  265 |                         // existing fragment.  Copy created_at from the original row so
  266 |                         // the row's first-appearance version is preserved across rewrites.
  267 |                         resolve_created_at_version(rid, &row_id_to_source, &version_cache)
  268 |                     } else {
  269 |                         // INSERT branch: stable row ID has no source in existing fragments
  270 |                         // (e.g. NOT MATCHED arm of MERGE INTO).  The row first appears in
  271 |                         // this commit, so created_at equals the new commit version.
  272 |                         new_version
  273 |                     }
  274 |                 })
  275 |                 .collect();
  276 |             debug_assert_eq!(created_at_versions.len(), physical_rows);
  277 | 
  278 |             let created_at_seq = RowDatasetVersionSequence::from_versions(&created_at_versions);
  279 |             fragment.created_at_version_meta = Some(
  280 |                 RowDatasetVersionMeta::from_sequence(&created_at_seq).map_err(|e| {
  281 |                     Error::internal(format!(
  282 |                         "Failed to create created_at version metadata: {}",
  283 |                         e
  284 |                     ))
  285 |                 })?,
  286 |             );
  287 | 
  288 |             fragment.last_updated_at_version_meta = build_version_meta(fragment, new_version);
  289 |         } else {
  290 |             let version_meta = build_version_meta(fragment, new_version);
  291 |             fragment.last_updated_at_version_meta = version_meta.clone();
  292 |             fragment.created_at_version_meta = version_meta;
  293 |         }
  294 |     }
  295 |     Ok(())
  296 | }
  297 | 
  298 | impl Transaction {
  299 |     /// collect the pure(the num of row IDs are equal to the physical rows) "rewrite rows" updated fragment ids
  300 |     pub(super) fn collect_pure_rewrite_row_update_frags_ids(
  301 |         fragments: &[Fragment],
  302 |     ) -> Result<Vec<u64>> {
  303 |         let mut pure_update_frag_ids = Vec::new();
  304 | 
  305 |         for fragment in fragments {
  306 |             let physical_rows = fragment
  307 |                 .physical_rows
  308 |                 .ok_or_else(|| Error::internal("Fragment does not have physical rows"))?
  309 |                 as u64;
  310 | 
  311 |             if let Some(row_id_meta) = &fragment.row_id_meta {
  312 |                 let existing_row_count = match row_id_meta {
  313 |                     RowIdMeta::Inline(data) => {
  314 |                         let sequence = read_row_ids(data)?;
  315 |                         sequence.len() as u64
  316 |                     }
  317 |                     // A spilled sequence always covers every physical row.
  318 |                     RowIdMeta::Column => physical_rows,
  319 |                 };
  320 | 
  321 |                 // only filter the fragments that match: all the rows have row id,
  322 |                 // which means it does not contain inserted rows in this fragment
  323 |                 if existing_row_count == physical_rows {
  324 |                     pure_update_frag_ids.push(fragment.id);
  325 |                 }
  326 |             }
  327 |         }
  328 | 
  329 |         Ok(pure_update_frag_ids)
  330 |     }
  331 | 
  332 |     pub(super) fn assign_row_ids(next_row_id: &mut u64, fragments: &mut [Fragment]) -> Result<()> {
  333 |         for fragment in fragments {
  334 |             let physical_rows = fragment
  335 |                 .physical_rows
  336 |                 .ok_or_else(|| Error::internal("Fragment does not have physical rows"))?
  337 |                 as u64;
  338 | 
  339 |             if fragment.row_id_meta.is_some() {
  340 |                 // we may meet merge insert case, it only has partial row ids.
  341 |                 // so here, we need to check if the row ids match the physical rows
  342 |                 // if yes, continue
  343 |                 // if not, fill the remaining row ids to the physical rows, then update row_id_meta
  344 | 
  345 |                 // Check if existing row IDs match the physical rows count
  346 |                 let existing_row_count = match &fragment.row_id_meta {
  347 |                     Some(RowIdMeta::Inline(data)) => {
  348 |                         // Parse the serialized row ID sequence to get the count
  349 |                         let sequence = read_row_ids(data)?;
  350 |                         sequence.len() as u64
  351 |                     }
  352 |                     // A spilled sequence always covers every physical row.
  353 |                     Some(RowIdMeta::Column) => physical_rows,
  354 |                     _ => 0,
  355 |                 };
  356 | 
  357 |                 match existing_row_count.cmp(&physical_rows) {
  358 |                     Ordering::Equal => {
  359 |                         // Row IDs already match physical rows, continue to next fragment
  360 |                         continue;
  361 |                     }
  362 |                     Ordering::Less => {
  363 |                         // Partial row IDs - need to fill the remaining ones
  364 |                         let remaining_rows = physical_rows - existing_row_count;
  365 |                         let new_row_ids = *next_row_id..(*next_row_id + remaining_rows);
  366 | 
  367 |                         // Merge existing and new row IDs
  368 |                         let combined_sequence = match &fragment.row_id_meta {
  369 |                             Some(RowIdMeta::Inline(data)) => read_row_ids(data)?,
  370 |                             _ => {
  371 |                                 return Err(Error::internal(
  372 |                                     "Failed to deserialize existing row ID sequence",
  373 |                                 ));
  374 |                             }
  375 |                         };
  376 | 
  377 |                         let mut row_ids: Vec<u64> = combined_sequence.iter().collect();
  378 |                         for row_id in new_row_ids {
  379 |                             row_ids.push(row_id);
  380 |                         }
  381 |                         let combined_sequence = RowIdSequence::from(row_ids.as_slice());
  382 | 
  383 |                         let serialized = write_row_ids(&combined_sequence);
  384 |                         fragment.row_id_meta = Some(RowIdMeta::Inline(serialized.into()));
  385 |                         *next_row_id += remaining_rows;
  386 |                     }
  387 |                     Ordering::Greater => {
  388 |                         // More row IDs than physical rows - this shouldn't happen
  389 |                         return Err(Error::internal(format!(
  390 |                             "Fragment has more row IDs ({}) than physical rows ({})",
  391 |                             existing_row_count, physical_rows
  392 |                         )));
  393 |                     }
  394 |                 }
  395 |             } else {
  396 |                 let row_ids = *next_row_id..(*next_row_id + physical_rows);
  397 |                 let sequence = RowIdSequence::from(row_ids);
  398 |                 // TODO: write to a separate file if large. Possibly share a file with other fragments.
  399 |                 let serialized = write_row_ids(&sequence);
  400 |                 fragment.row_id_meta = Some(RowIdMeta::Inline(serialized.into()));
  401 |                 *next_row_id += physical_rows;
  402 |             }
  403 |         }
  404 |         Ok(())
  405 |     }
  406 | }
  407 | 
  408 | #[cfg(test)]
  409 | mod tests {
  410 |     use super::*;
  411 |     use crate::format::RowDatasetVersionRun;
  412 |     use crate::rowids::segment::U64Segment;
  413 |     use crate::transaction::test_support::{
  414 |         created_at_versions, default_build_config, last_updated_at_versions,
  415 |         make_stable_row_id_manifest, update_txn,
  416 |     };
  417 |     use rstest::rstest;
  418 |     use std::sync::Arc;
  419 | 
  420 |     #[test]
  421 |     fn test_assign_row_ids_new_fragment() {
  422 |         // Test assigning row IDs to a fragment without existing row IDs
  423 |         let mut fragments = vec![Fragment {
  424 |             id: 1,
  425 |             physical_rows: Some(100),
  426 |             row_id_meta: None,
  427 |             files: vec![],
  428 |             overlays: vec![],
  429 |             deletion_file: None,
  430 |             last_updated_at_version_meta: None,
  431 |             created_at_version_meta: None,
  432 |         }];
  433 |         let mut next_row_id = 0;
  434 | 
  435 |         Transaction::assign_row_ids(&mut next_row_id, &mut fragments).unwrap();
  436 | 
  437 |         assert_eq!(next_row_id, 100);
  438 |         assert!(fragments[0].row_id_meta.is_some());
  439 | 
  440 |         if let Some(RowIdMeta::Inline(data)) = &fragments[0].row_id_meta {
  441 |             let sequence = read_row_ids(data).unwrap();
  442 |             assert_eq!(sequence.len(), 100);
  443 |             let row_ids: Vec<u64> = sequence.iter().collect();
  444 |             assert_eq!(row_ids, (0..100).collect::<Vec<u64>>());
  445 |         } else {
  446 |             panic!("Expected inline row ID metadata");
  447 |         }
  448 |     }
  449 | 
  450 |     fn inline_versions(rows: u64, version: u64) -> RowDatasetVersionMeta {
  451 |         RowDatasetVersionMeta::from_sequence(&RowDatasetVersionSequence::from_uniform_row_count(
  452 |             rows, version,
  453 |         ))
  454 |         .unwrap()
  455 |     }
  456 | 
  457 |     #[test]
  458 |     fn test_assign_row_ids_spilled_is_complete() {
  459 |         // A spilled sequence covers every physical row, so the commit must not
  460 |         // top it up with fresh ids the way it does for a partial inline one.
  461 |         let spilled = RowIdMeta::Column;
  462 |         let mut fragments = vec![Fragment {
  463 |             id: 1,
  464 |             physical_rows: Some(50),
  465 |             row_id_meta: Some(spilled.clone()),
  466 |             files: vec![],
  467 |             overlays: vec![],
  468 |             deletion_file: None,
  469 |             last_updated_at_version_meta: None,
  470 |             created_at_version_meta: None,
  471 |         }];
  472 |         let mut next_row_id = 100;
  473 | 
  474 |         Transaction::assign_row_ids(&mut next_row_id, &mut fragments).unwrap();
  475 | 
  476 |         assert_eq!(next_row_id, 100);
  477 |         assert_eq!(fragments[0].row_id_meta, Some(spilled));
  478 |     }
  479 | 
  480 |     #[test]
  481 |     fn test_resolve_update_versions_keeps_writer_placed_created_at() {
  482 |         // A writer that placed a new fragment's lineage outside the manifest
  483 |         // keeps its created-at versions; the commit only stamps
  484 |         // last-updated-at with its own version, which the writer could not
  485 |         // know.
  486 |         let mut new_fragments = vec![Fragment {
  487 |             id: 1,
  488 |             physical_rows: Some(50),
  489 |             row_id_meta: Some(RowIdMeta::Column),
  490 |             files: vec![],
  491 |             overlays: vec![],
  492 |             deletion_file: None,
  493 |             last_updated_at_version_meta: Some(inline_versions(50, 7)),
  494 |             created_at_version_meta: Some(RowDatasetVersionMeta::Column),
  495 |         }];
  496 | 
  497 |         resolve_update_version_metadata(&[], &mut new_fragments, 9, &Default::default()).unwrap();
  498 |         assert_eq!(
  499 |             new_fragments[0].created_at_version_meta,
  500 |             Some(RowDatasetVersionMeta::Column)
  501 |         );
  502 |         assert_eq!(
  503 |             new_fragments[0].last_updated_at_version_meta,
  504 |             Some(inline_versions(50, 9))
  505 |         );
  506 |     }
  507 | 
  508 |     #[test]
  509 |     fn test_resolve_update_versions_skips_source_scan_for_spilled_new_fragments() {
  510 |         // A new fragment whose writer spilled its created-at versions needs no
  511 |         // lookup, so the commit does not scan the existing fragments' row ids
  512 |         // at all: a spilled source that was not loaded ahead is no obstacle.
  513 |         let existing = vec![Fragment {
  514 |             id: 1,
  515 |             physical_rows: Some(50),
  516 |             row_id_meta: Some(RowIdMeta::Column),
  517 |             files: vec![],
  518 |             overlays: vec![],
  519 |             deletion_file: None,
  520 |             last_updated_at_version_meta: Some(inline_versions(50, 2)),
  521 |             created_at_version_meta: Some(RowDatasetVersionMeta::Column),
  522 |         }];
  523 |         let mut new_fragments = vec![Fragment {
  524 |             id: 2,
  525 |             physical_rows: Some(2),
  526 |             row_id_meta: Some(RowIdMeta::Inline(
  527 |                 write_row_ids(&RowIdSequence::from(10..12)).into(),
  528 |             )),
  529 |             files: vec![],
  530 |             overlays: vec![],
  531 |             deletion_file: None,
  532 |             last_updated_at_version_meta: None,
  533 |             created_at_version_meta: Some(RowDatasetVersionMeta::Column),
  534 |         }];
  535 | 
  536 |         resolve_update_version_metadata(&existing, &mut new_fragments, 9, &Default::default())
  537 |             .unwrap();
  538 |         assert_eq!(
  539 |             new_fragments[0].created_at_version_meta,
  540 |             Some(RowDatasetVersionMeta::Column)
  541 |         );
  542 |         assert_eq!(
  543 |             new_fragments[0].last_updated_at_version_meta,
  544 |             Some(inline_versions(2, 9))
  545 |         );
  546 |     }
  547 | 
  548 |     #[test]
  549 |     fn test_resolve_update_versions_recomputes_inline_created_at() {
  550 |         // Inline created-at versions next to inline row ids are not
  551 |         // writer-placed: the commit resolves them from the row ids again, so a
  552 |         // hand-built transaction cannot commit stale ones.
  553 |         let row_ids = Some(RowIdMeta::Inline(
  554 |             write_row_ids(&RowIdSequence::from(0..10)).into(),
  555 |         ));
  556 |         let existing = vec![Fragment {
  557 |             id: 1,
  558 |             physical_rows: Some(10),
  559 |             row_id_meta: row_ids.clone(),
  560 |             files: vec![],
  561 |             overlays: vec![],
  562 |             deletion_file: None,
  563 |             last_updated_at_version_meta: Some(inline_versions(10, 3)),
  564 |             created_at_version_meta: Some(inline_versions(10, 3)),
  565 |         }];
  566 |         let mut new_fragments = vec![Fragment {
  567 |             id: 2,
  568 |             physical_rows: Some(10),
  569 |             row_id_meta: row_ids,
  570 |             files: vec![],
  571 |             overlays: vec![],
  572 |             deletion_file: None,
  573 |             last_updated_at_version_meta: None,
  574 |             created_at_version_meta: Some(inline_versions(10, 7)),
  575 |         }];
  576 | 
  577 |         resolve_update_version_metadata(&existing, &mut new_fragments, 9, &Default::default())
  578 |             .unwrap();
  579 |         assert_eq!(
  580 |             new_fragments[0].created_at_version_meta,
  581 |             Some(inline_versions(10, 3))
  582 |         );
  583 |         assert_eq!(
  584 |             new_fragments[0].last_updated_at_version_meta,
  585 |             Some(inline_versions(10, 9))
  586 |         );
  587 |     }
  588 | 
  589 |     #[rstest]
  590 |     #[case::covers_every_row(50)]
  591 |     #[case::too_short(40)]
  592 |     fn test_resolve_update_versions_checks_placed_inline_created_at(#[case] placed_rows: u64) {
  593 |         // Inline created-at versions next to spilled row ids are writer-placed
  594 |         // and kept as they are, so they have to cover every row.
  595 |         let mut fragments = vec![Fragment {
  596 |             id: 1,
  597 |             physical_rows: Some(50),
  598 |             row_id_meta: Some(RowIdMeta::Column),
  599 |             files: vec![],
  600 |             overlays: vec![],
  601 |             deletion_file: None,
  602 |             last_updated_at_version_meta: None,
  603 |             created_at_version_meta: Some(inline_versions(placed_rows, 3)),
  604 |         }];
  605 | 
  606 |         let result = resolve_update_version_metadata(&[], &mut fragments, 9, &Default::default());
  607 |         if placed_rows == 50 {
  608 |             result.unwrap();
  609 |             assert_eq!(
  610 |                 fragments[0].created_at_version_meta,
  611 |                 Some(inline_versions(50, 3))
  612 |             );
  613 |             assert_eq!(
  614 |                 fragments[0].last_updated_at_version_meta,
  615 |                 Some(inline_versions(50, 9))
  616 |             );
  617 |         } else {
  618 |             let error = result.unwrap_err();
  619 |             assert!(matches!(error, Error::InvalidInput { .. }), "{error:?}");
  620 |             assert!(
  621 |                 error
  622 |                     .to_string()
  623 |                     .contains("40 created-at versions for 50 physical rows"),
  624 |                 "{error}"
  625 |             );
  626 |         }
  627 |     }
  628 | 
  629 |     #[test]
  630 |     fn test_resolve_update_versions_reads_spilled_source_lineage_from_config() {
  631 |         // The rewritten rows' sources are found by scanning existing row ids,
  632 |         // which a spilled fragment does not expose here: the commit's caller
  633 |         // reads them ahead of time. Without that, skipping the fragment would
  634 |         // make its rows look freshly inserted, so it is an error instead.
  635 |         let existing = vec![Fragment {
  636 |             id: 1,
  637 |             physical_rows: Some(50),
  638 |             row_id_meta: Some(RowIdMeta::Column),
  639 |             files: vec![],
  640 |             overlays: vec![],
  641 |             deletion_file: None,
  642 |             last_updated_at_version_meta: Some(inline_versions(50, 2)),
  643 |             created_at_version_meta: Some(RowDatasetVersionMeta::Column),
  644 |         }];
  645 |         let new_fragment = |ids: std::ops::Range<u64>| Fragment {
  646 |             id: 2,
  647 |             physical_rows: Some(2),
  648 |             row_id_meta: Some(RowIdMeta::Inline(
  649 |                 write_row_ids(&RowIdSequence::from(ids)).into(),
  650 |             )),
  651 |             files: vec![],
  652 |             overlays: vec![],
  653 |             deletion_file: None,
  654 |             last_updated_at_version_meta: None,
  655 |             created_at_version_meta: None,
  656 |         };
  657 | 
  658 |         let mut new_fragments = vec![new_fragment(10..12)];
  659 |         let error =
  660 |             resolve_update_version_metadata(&existing, &mut new_fragments, 9, &Default::default())
  661 |                 .unwrap_err();
  662 |         assert!(matches!(error, Error::NotSupported { .. }), "{error:?}");
  663 | 
  664 |         // A new fragment whose own row ids are spilled cannot be resolved.
  665 |         let mut spilled_new = vec![Fragment {
  666 |             row_id_meta: Some(RowIdMeta::Column),
  667 |             ..new_fragment(0..2)
  668 |         }];
  669 |         let error = resolve_update_version_metadata(&[], &mut spilled_new, 9, &Default::default())
  670 |             .unwrap_err();
  671 |         assert!(matches!(error, Error::NotSupported { .. }), "{error:?}");
  672 | 
  673 |         // Fragment 1 holds ids 100..150 and rows 10 and 11 were created at
  674 |         // versions 3 and 4 respectively; that is what the rewrite must keep.
  675 |         let mut created_at_versions = vec![2; 50];
  676 |         created_at_versions[10] = 3;
  677 |         created_at_versions[11] = 4;
  678 |         let spilled = SpilledRowLineage::from([(
  679 |             1,
  680 |             crate::rowids::version::LoadedRowLineage {
  681 |                 row_ids: Some(Arc::new(RowIdSequence::from(100..150))),
  682 |                 created_at: Some(Arc::new(RowDatasetVersionSequence::from_versions(
  683 |                     &created_at_versions,
  684 |                 ))),
  685 |                 last_updated_at: None,
  686 |             },
  687 |         )]);
  688 |         let mut new_fragments = vec![new_fragment(110..112)];
  689 |         resolve_update_version_metadata(&existing, &mut new_fragments, 9, &spilled).unwrap();
  690 |         let versions = |meta: &Option<RowDatasetVersionMeta>| {
  691 |             meta.as_ref()
  692 |                 .unwrap()
  693 |                 .load_sequence()
  694 |                 .unwrap()
  695 |                 .versions()
  696 |                 .collect::<Vec<_>>()
  697 |         };
  698 |         assert_eq!(versions(&new_fragments[0].created_at_version_meta), [3, 4]);
  699 |         assert_eq!(
  700 |             versions(&new_fragments[0].last_updated_at_version_meta),
  701 |             [9, 9]
  702 |         );
  703 |     }
  704 | 
  705 |     #[test]
  706 |     fn test_assign_row_ids_existing_complete() {
  707 |         // Test with fragment that already has complete row IDs
  708 |         let existing_sequence = RowIdSequence::from(0..50);
  709 |         let serialized = write_row_ids(&existing_sequence);
  710 | 
  711 |         let mut fragments = vec![Fragment {
  712 |             id: 1,
  713 |             physical_rows: Some(50),
  714 |             row_id_meta: Some(RowIdMeta::Inline(serialized.into())),
  715 |             files: vec![],
  716 |             overlays: vec![],
  717 |             deletion_file: None,
  718 |             last_updated_at_version_meta: None,
  719 |             created_at_version_meta: None,
  720 |         }];
  721 |         let mut next_row_id = 100;
  722 | 
  723 |         Transaction::assign_row_ids(&mut next_row_id, &mut fragments).unwrap();
  724 | 
  725 |         // next_row_id should not change
  726 |         assert_eq!(next_row_id, 100);
  727 | 
  728 |         if let Some(RowIdMeta::Inline(data)) = &fragments[0].row_id_meta {
  729 |             let sequence = read_row_ids(data).unwrap();
  730 |             assert_eq!(sequence.len(), 50);
  731 |             let row_ids: Vec<u64> = sequence.iter().collect();
  732 |             assert_eq!(row_ids, (0..50).collect::<Vec<u64>>());
  733 |         } else {
  734 |             panic!("Expected inline row ID metadata");
  735 |         }
  736 |     }
  737 | 
  738 |     #[test]
  739 |     fn test_assign_row_ids_partial_existing() {
  740 |         // Test with fragment that has partial row IDs (merge insert case)
  741 |         let existing_sequence = RowIdSequence::from(0..30);
  742 |         let serialized = write_row_ids(&existing_sequence);
  743 | 
  744 |         let mut fragments = vec![Fragment {
  745 |             id: 1,
  746 |             physical_rows: Some(50), // More physical rows than existing row IDs
  747 |             row_id_meta: Some(RowIdMeta::Inline(serialized.into())),
  748 |             files: vec![],
  749 |             overlays: vec![],
  750 |             deletion_file: None,
  751 |             last_updated_at_version_meta: None,
  752 |             created_at_version_meta: None,
  753 |         }];
  754 |         let mut next_row_id = 100;
  755 | 
  756 |         Transaction::assign_row_ids(&mut next_row_id, &mut fragments).unwrap();
  757 | 
  758 |         // next_row_id should advance by 20 (50 - 30)
  759 |         assert_eq!(next_row_id, 120);
  760 | 
  761 |         if let Some(RowIdMeta::Inline(data)) = &fragments[0].row_id_meta {
  762 |             let sequence = read_row_ids(data).unwrap();
  763 |             assert_eq!(sequence.len(), 50);
  764 |             let row_ids: Vec<u64> = sequence.iter().collect();
  765 |             // Should contain original 0-29 plus new 100-119
  766 |             let mut expected = (0..30).collect::<Vec<u64>>();
  767 |             expected.extend(100..120);
  768 |             assert_eq!(row_ids, expected);
  769 |         } else {
  770 |             panic!("Expected inline row ID metadata");
  771 |         }
  772 |     }
  773 | 
  774 |     #[test]
  775 |     fn test_assign_row_ids_excess_row_ids() {
  776 |         // Test error case where fragment has more row IDs than physical rows
  777 |         let existing_sequence = RowIdSequence::from(0..60);
  778 |         let serialized = write_row_ids(&existing_sequence);
  779 | 
  780 |         let mut fragments = vec![Fragment {
  781 |             id: 1,
  782 |             physical_rows: Some(50), // Less physical rows than existing row IDs
  783 |             row_id_meta: Some(RowIdMeta::Inline(serialized.into())),
  784 |             files: vec![],
  785 |             overlays: vec![],
  786 |             deletion_file: None,
  787 |             last_updated_at_version_meta: None,
  788 |             created_at_version_meta: None,
  789 |         }];
  790 |         let mut next_row_id = 100;
  791 | 
  792 |         let result = Transaction::assign_row_ids(&mut next_row_id, &mut fragments);
  793 | 
  794 |         assert!(result.is_err());
  795 |         if let Err(Error::Internal { message, .. }) = result {
  796 |             assert!(message.contains("more row IDs (60) than physical rows (50)"));
  797 |         } else {
  798 |             panic!("Expected Internal error about excess row IDs");
  799 |         }
  800 |     }
  801 | 
  802 |     #[test]
  803 |     fn test_assign_row_ids_multiple_fragments() {
  804 |         // Test with multiple fragments, some with existing row IDs, some without
  805 |         let existing_sequence = RowIdSequence::from(500..520);
  806 |         let serialized = write_row_ids(&existing_sequence);
  807 | 
  808 |         let mut fragments = vec![
  809 |             Fragment {
  810 |                 id: 1,
  811 |                 physical_rows: Some(30), // No existing row IDs
  812 |                 row_id_meta: None,
  813 |                 files: vec![],
  814 |                 overlays: vec![],
  815 |                 deletion_file: None,
  816 |                 last_updated_at_version_meta: None,
  817 |                 created_at_version_meta: None,
  818 |             },
  819 |             Fragment {
  820 |                 id: 2,
  821 |                 physical_rows: Some(25), // Partial existing row IDs
  822 |                 row_id_meta: Some(RowIdMeta::Inline(serialized.into())),
  823 |                 files: vec![],
  824 |                 overlays: vec![],
  825 |                 deletion_file: None,
  826 |                 last_updated_at_version_meta: None,
  827 |                 created_at_version_meta: None,
  828 |             },
  829 |         ];
  830 |         let mut next_row_id = 1000;
  831 | 
  832 |         Transaction::assign_row_ids(&mut next_row_id, &mut fragments).unwrap();
  833 | 
  834 |         // Should advance by 30 (first fragment) + 5 (second fragment partial)
  835 |         assert_eq!(next_row_id, 1035);
  836 | 
  837 |         // Check first fragment
  838 |         if let Some(RowIdMeta::Inline(data)) = &fragments[0].row_id_meta {
  839 |             let sequence = read_row_ids(data).unwrap();
  840 |             assert_eq!(sequence.len(), 30);
  841 |             let row_ids: Vec<u64> = sequence.iter().collect();
  842 |             assert_eq!(row_ids, (1000..1030).collect::<Vec<u64>>());
  843 |         } else {
  844 |             panic!("Expected inline row ID metadata for first fragment");
  845 |         }
  846 | 
  847 |         // Check second fragment
  848 |         if let Some(RowIdMeta::Inline(data)) = &fragments[1].row_id_meta {
  849 |             let sequence = read_row_ids(data).unwrap();
  850 |             assert_eq!(sequence.len(), 25);
  851 |             let row_ids: Vec<u64> = sequence.iter().collect();
  852 |             // Should contain original 500-519 plus new 1030-1034
  853 |             let mut expected = (500..520).collect::<Vec<u64>>();
  854 |             expected.extend(1030..1035);
  855 |             assert_eq!(row_ids, expected);
  856 |         } else {
  857 |             panic!("Expected inline row ID metadata for second fragment");
  858 |         }
  859 |     }
  860 | 
  861 |     #[test]
  862 |     fn test_assign_row_ids_missing_physical_rows() {
  863 |         // Test error case where fragment doesn't have physical_rows set
  864 |         let mut fragments = vec![Fragment {
  865 |             id: 1,
  866 |             physical_rows: None,
  867 |             row_id_meta: None,
  868 |             files: vec![],
  869 |             overlays: vec![],
  870 |             deletion_file: None,
  871 |             last_updated_at_version_meta: None,
  872 |             created_at_version_meta: None,
  873 |         }];
  874 |         let mut next_row_id = 0;
  875 | 
  876 |         let result = Transaction::assign_row_ids(&mut next_row_id, &mut fragments);
  877 | 
  878 |         assert!(result.is_err());
  879 |         if let Err(Error::Internal { message, .. }) = result {
  880 |             assert!(message.contains("Fragment does not have physical rows"));
  881 |         } else {
  882 |             panic!("Expected Internal error about missing physical rows");
  883 |         }
  884 |     }
  885 | 
  886 |     #[test]
  887 |     fn test_update_version_tracking_preserves_created_at() {
  888 |         let existing_seq = RowIdSequence::from([100u64, 101, 102].as_slice());
  889 |         let created_at_seq = RowDatasetVersionSequence {
  890 |             runs: vec![RowDatasetVersionRun {
  891 |                 span: U64Segment::Range(0..3),
  892 |                 version: 5,
  893 |             }],
  894 |         };
  895 |         let existing_fragment = Fragment {
  896 |             id: 1,
  897 |             files: vec![],
  898 |             overlays: vec![],
  899 |             deletion_file: None,
  900 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&existing_seq).into())),
  901 |             physical_rows: Some(3),
  902 |             created_at_version_meta: Some(
  903 |                 RowDatasetVersionMeta::from_sequence(&created_at_seq).unwrap(),
  904 |             ),
  905 |             last_updated_at_version_meta: None,
  906 |         };
  907 | 
  908 |         let new_seq = RowIdSequence::from([100u64, 102].as_slice());
  909 |         let new_fragment = Fragment {
  910 |             id: 10,
  911 |             files: vec![],
  912 |             overlays: vec![],
  913 |             deletion_file: None,
  914 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&new_seq).into())),
  915 |             physical_rows: Some(2),
  916 |             created_at_version_meta: None,
  917 |             last_updated_at_version_meta: None,
  918 |         };
  919 | 
  920 |         let manifest = make_stable_row_id_manifest(vec![existing_fragment]);
  921 |         let (result, _) = update_txn(vec![new_fragment])
  922 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
  923 |             .unwrap();
  924 | 
  925 |         assert_eq!(created_at_versions(&result, 10), vec![5, 5]);
  926 |         assert_eq!(last_updated_at_versions(&result, 10), vec![5, 5]);
  927 |     }
  928 | 
  929 |     #[test]
  930 |     fn test_update_version_tracking_mixed_origins() {
  931 |         let frag_a_seq = RowIdSequence::from([10u64, 11].as_slice());
  932 |         let frag_a_created = RowDatasetVersionSequence {
  933 |             runs: vec![RowDatasetVersionRun {
  934 |                 span: U64Segment::Range(0..2),
  935 |                 version: 2,
  936 |             }],
  937 |         };
  938 |         let frag_b_seq = RowIdSequence::from([20u64, 21, 22].as_slice());
  939 |         let frag_b_created = RowDatasetVersionSequence {
  940 |             runs: vec![RowDatasetVersionRun {
  941 |                 span: U64Segment::Range(0..3),
  942 |                 version: 3,
  943 |             }],
  944 |         };
  945 | 
  946 |         let manifest = make_stable_row_id_manifest(vec![
  947 |             Fragment {
  948 |                 id: 1,
  949 |                 files: vec![],
  950 |                 overlays: vec![],
  951 |                 deletion_file: None,
  952 |                 row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&frag_a_seq).into())),
  953 |                 physical_rows: Some(2),
  954 |                 created_at_version_meta: Some(
  955 |                     RowDatasetVersionMeta::from_sequence(&frag_a_created).unwrap(),
  956 |                 ),
  957 |                 last_updated_at_version_meta: None,
  958 |             },
  959 |             Fragment {
  960 |                 id: 2,
  961 |                 files: vec![],
  962 |                 overlays: vec![],
  963 |                 deletion_file: None,
  964 |                 row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&frag_b_seq).into())),
  965 |                 physical_rows: Some(3),
  966 |                 created_at_version_meta: Some(
  967 |                     RowDatasetVersionMeta::from_sequence(&frag_b_created).unwrap(),
  968 |                 ),
  969 |                 last_updated_at_version_meta: None,
  970 |             },
  971 |         ]);
  972 | 
  973 |         // New fragment has rows from both original fragments: row 11 from frag_a, row 20 from frag_b
  974 |         let new_seq = RowIdSequence::from([11u64, 20].as_slice());
  975 |         let new_fragment = Fragment {
  976 |             id: 10,
  977 |             files: vec![],
  978 |             overlays: vec![],
  979 |             deletion_file: None,
  980 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&new_seq).into())),
  981 |             physical_rows: Some(2),
  982 |             created_at_version_meta: None,
  983 |             last_updated_at_version_meta: None,
  984 |         };
  985 | 
  986 |         let (result, _) = update_txn(vec![new_fragment])
  987 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
  988 |             .unwrap();
  989 | 
  990 |         // Row 11 came from frag_a (offset 1, version 2), row 20 came from frag_b (offset 0, version 3)
  991 |         assert_eq!(created_at_versions(&result, 10), vec![2, 3]);
  992 |         assert_eq!(last_updated_at_versions(&result, 10), vec![5, 5]);
  993 |     }
  994 | 
  995 |     #[test]
  996 |     fn test_update_version_tracking_insert_branch_gets_new_version() {
  997 |         // Simulates the INSERT branch (NOT MATCHED) of a MERGE INTO commit:
  998 |         // the new fragment contains a mix of rewritten rows (UPDATE branch, row ID
  999 |         // present in existing fragments) and freshly inserted rows (INSERT branch,
 1000 |         // row ID not present in any existing fragment).
 1001 |         //
 1002 |         // UPDATE branch row (10): created_at must be copied from the source fragment.
 1003 |         // INSERT branch row (999): created_at must equal new_version (the merge commit
 1004 |         // version), because the row first appeared in this commit.
 1005 |         let existing_seq = RowIdSequence::from([10u64, 11].as_slice());
 1006 |         let existing_created = RowDatasetVersionSequence {
 1007 |             runs: vec![RowDatasetVersionRun {
 1008 |                 span: U64Segment::Range(0..2),
 1009 |                 version: 5,
 1010 |             }],
 1011 |         };
 1012 |         let existing_fragment = Fragment {
 1013 |             id: 1,
 1014 |             files: vec![],
 1015 |             overlays: vec![],
 1016 |             deletion_file: None,
 1017 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&existing_seq).into())),
 1018 |             physical_rows: Some(2),
 1019 |             created_at_version_meta: Some(
 1020 |                 RowDatasetVersionMeta::from_sequence(&existing_created).unwrap(),
 1021 |             ),
 1022 |             last_updated_at_version_meta: None,
 1023 |         };
 1024 | 
 1025 |         // New fragment has row 10 (UPDATE branch) and row 999 (INSERT branch)
 1026 |         let new_seq = RowIdSequence::from([10u64, 999].as_slice());
 1027 |         let new_fragment = Fragment {
 1028 |             id: 10,
 1029 |             files: vec![],
 1030 |             overlays: vec![],
 1031 |             deletion_file: None,
 1032 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&new_seq).into())),
 1033 |             physical_rows: Some(2),
 1034 |             created_at_version_meta: None,
 1035 |             last_updated_at_version_meta: None,
 1036 |         };
 1037 | 
 1038 |         // update_txn uses read_version 4 → new_version is 5
 1039 |         let manifest = make_stable_row_id_manifest(vec![existing_fragment]);
 1040 |         let (result, _) = update_txn(vec![new_fragment])
 1041 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 1042 |             .unwrap();
 1043 | 
 1044 |         // Row 10 (UPDATE branch): created_at copied from source (version 5).
 1045 |         // Row 999 (INSERT branch): created_at == new_version (5).
 1046 |         assert_eq!(created_at_versions(&result, 10), vec![5, 5]);
 1047 |         assert_eq!(last_updated_at_versions(&result, 10), vec![5, 5]);
 1048 |     }
 1049 | 
 1050 |     #[test]
 1051 |     fn test_update_version_tracking_merge_into_distinguishes_insert_and_update_branch() {
 1052 |         // Verifies the MERGE INTO correctness contract when UPDATE branch rows and INSERT
 1053 |         // branch rows have *different* source created_at values, so we can distinguish
 1054 |         // which row got which value.
 1055 |         //
 1056 |         // Existing fragment (id=1): row IDs [10, 11], created_at = version 3.
 1057 |         // New fragment (id=20): row IDs [10, 500, 11, 501].
 1058 |         //   - Rows 10 and 11: UPDATE branch (present in existing fragment) → created_at = 3.
 1059 |         //   - Rows 500 and 501: INSERT branch (no source) → created_at = new_version = 5.
 1060 |         let existing_seq = RowIdSequence::from([10u64, 11].as_slice());
 1061 |         let existing_created = RowDatasetVersionSequence {
 1062 |             runs: vec![RowDatasetVersionRun {
 1063 |                 span: U64Segment::Range(0..2),
 1064 |                 version: 3,
 1065 |             }],
 1066 |         };
 1067 |         let existing_fragment = Fragment {
 1068 |             id: 1,
 1069 |             files: vec![],
 1070 |             overlays: vec![],
 1071 |             deletion_file: None,
 1072 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&existing_seq).into())),
 1073 |             physical_rows: Some(2),
 1074 |             created_at_version_meta: Some(
 1075 |                 RowDatasetVersionMeta::from_sequence(&existing_created).unwrap(),
 1076 |             ),
 1077 |             last_updated_at_version_meta: None,
 1078 |         };
 1079 | 
 1080 |         let new_seq = RowIdSequence::from([10u64, 500, 11, 501].as_slice());
 1081 |         let new_fragment = Fragment {
 1082 |             id: 20,
 1083 |             files: vec![],
 1084 |             overlays: vec![],
 1085 |             deletion_file: None,
 1086 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&new_seq).into())),
 1087 |             physical_rows: Some(4),
 1088 |             created_at_version_meta: None,
 1089 |             last_updated_at_version_meta: None,
 1090 |         };
 1091 | 
 1092 |         // update_txn uses read_version 4 → new_version is 5
 1093 |         let manifest = make_stable_row_id_manifest(vec![existing_fragment]);
 1094 |         let (result, _) = update_txn(vec![new_fragment])
 1095 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 1096 |             .unwrap();
 1097 | 
 1098 |         // UPDATE branch rows (10, 11): created_at preserved from source (version 3).
 1099 |         // INSERT branch rows (500, 501): created_at == new_version (5).
 1100 |         assert_eq!(created_at_versions(&result, 20), vec![3, 5, 3, 5]);
 1101 |         // All rows in the new fragment get last_updated == new_version.
 1102 |         assert_eq!(last_updated_at_versions(&result, 20), vec![5, 5, 5, 5]);
 1103 |     }
 1104 | 
 1105 |     #[test]
 1106 |     fn test_update_version_tracking_source_fragment_no_created_at_defaults_to_1() {
 1107 |         // Source fragment has row_id_meta but no created_at_version_meta.
 1108 |         // The row IS found in the lookup, but the version defaults to 1.
 1109 |         let existing_seq = RowIdSequence::from([50u64, 51].as_slice());
 1110 |         let existing_fragment = Fragment {
 1111 |             id: 1,
 1112 |             files: vec![],
 1113 |             overlays: vec![],
 1114 |             deletion_file: None,
 1115 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&existing_seq).into())),
 1116 |             physical_rows: Some(2),
 1117 |             created_at_version_meta: None,
 1118 |             last_updated_at_version_meta: None,
 1119 |         };
 1120 | 
 1121 |         let new_seq = RowIdSequence::from([50u64].as_slice());
 1122 |         let new_fragment = Fragment {
 1123 |             id: 10,
 1124 |             files: vec![],
 1125 |             overlays: vec![],
 1126 |             deletion_file: None,
 1127 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&new_seq).into())),
 1128 |             physical_rows: Some(1),
 1129 |             created_at_version_meta: None,
 1130 |             last_updated_at_version_meta: None,
 1131 |         };
 1132 | 
 1133 |         let manifest = make_stable_row_id_manifest(vec![existing_fragment]);
 1134 |         let (result, _) = update_txn(vec![new_fragment])
 1135 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 1136 |             .unwrap();
 1137 | 
 1138 |         // Row 50 is found in source but source has no created_at_version_meta → default 1
 1139 |         assert_eq!(created_at_versions(&result, 10), vec![1]);
 1140 |         assert_eq!(last_updated_at_versions(&result, 10), vec![5]);
 1141 |     }
 1142 | 
 1143 |     #[test]
 1144 |     fn test_update_version_tracking_no_row_id_meta_fallback() {
 1145 |         let existing_seq = RowIdSequence::from([10u64, 11].as_slice());
 1146 |         let existing_fragment = Fragment {
 1147 |             id: 1,
 1148 |             files: vec![],
 1149 |             overlays: vec![],
 1150 |             deletion_file: None,
 1151 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&existing_seq).into())),
 1152 |             physical_rows: Some(2),
 1153 |             created_at_version_meta: None,
 1154 |             last_updated_at_version_meta: None,
 1155 |         };
 1156 | 
 1157 |         let new_fragment = Fragment {
 1158 |             id: 10,
 1159 |             files: vec![],
 1160 |             overlays: vec![],
 1161 |             deletion_file: None,
 1162 |             row_id_meta: None,
 1163 |             physical_rows: Some(3),
 1164 |             created_at_version_meta: None,
 1165 |             last_updated_at_version_meta: None,
 1166 |         };
 1167 | 
 1168 |         let manifest = make_stable_row_id_manifest(vec![existing_fragment]);
 1169 |         let (result, _) = update_txn(vec![new_fragment])
 1170 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 1171 |             .unwrap();
 1172 | 
 1173 |         // Fragment starts with no row_id_meta → assign_row_ids gives it fresh IDs →
 1174 |         // those IDs have no source in existing fragments (INSERT branch) →
 1175 |         // created_at == new_version (5) for each row.
 1176 |         assert_eq!(created_at_versions(&result, 10), vec![5, 5, 5]);
 1177 |         assert_eq!(last_updated_at_versions(&result, 10), vec![5, 5, 5]);
 1178 |     }
 1179 | 
 1180 |     #[test]
 1181 |     fn test_update_version_tracking_corrupt_created_at_defaults_to_1() {
 1182 |         let existing_seq = RowIdSequence::from([10u64, 11].as_slice());
 1183 |         let existing_fragment = Fragment {
 1184 |             id: 1,
 1185 |             files: vec![],
 1186 |             overlays: vec![],
 1187 |             deletion_file: None,
 1188 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&existing_seq).into())),
 1189 |             physical_rows: Some(2),
 1190 |             created_at_version_meta: Some(RowDatasetVersionMeta::Inline(Arc::from(
 1191 |                 vec![0xFFu8; 8].as_slice(),
 1192 |             ))),
 1193 |             last_updated_at_version_meta: None,
 1194 |         };
 1195 | 
 1196 |         let new_seq = RowIdSequence::from([10u64].as_slice());
 1197 |         let new_fragment = Fragment {
 1198 |             id: 10,
 1199 |             files: vec![],
 1200 |             overlays: vec![],
 1201 |             deletion_file: None,
 1202 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&new_seq).into())),
 1203 |             physical_rows: Some(1),
 1204 |             created_at_version_meta: None,
 1205 |             last_updated_at_version_meta: None,
 1206 |         };
 1207 | 
 1208 |         let manifest = make_stable_row_id_manifest(vec![existing_fragment]);
 1209 |         let (result, _) = update_txn(vec![new_fragment])
 1210 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 1211 |             .unwrap();
 1212 | 
 1213 |         // Corrupt metadata causes decode to fail → falls back to UNKNOWN_CREATED_AT_VERSION (1)
 1214 |         assert_eq!(created_at_versions(&result, 10), vec![1]);
 1215 |         assert_eq!(last_updated_at_versions(&result, 10), vec![5]);
 1216 |     }
 1217 | 
 1218 |     /// Fragments whose row-ID range lies entirely outside the needed set must not
 1219 |     /// affect the result.  Here fragment 1 has IDs [1000, 1001] which are far above
 1220 |     /// the needed range [10, 11]; it is skipped by the range pre-filter and its
 1221 |     /// created_at version (version 99) must never appear in the output.
 1222 |     #[test]
 1223 |     fn test_update_version_tracking_range_filter_skips_non_overlapping_fragment() {
 1224 |         // Fragment in range – IDs [10, 11], created_at = 5
 1225 |         let in_range_seq = RowIdSequence::from([10u64, 11].as_slice());
 1226 |         let in_range_created = RowDatasetVersionSequence {
 1227 |             runs: vec![RowDatasetVersionRun {
 1228 |                 span: U64Segment::Range(0..2),
 1229 |                 version: 5,
 1230 |             }],
 1231 |         };
 1232 |         let in_range_frag = Fragment {
 1233 |             id: 1,
 1234 |             files: vec![],
 1235 |             overlays: vec![],
 1236 |             deletion_file: None,
 1237 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&in_range_seq).into())),
 1238 |             physical_rows: Some(2),
 1239 |             created_at_version_meta: Some(
 1240 |                 RowDatasetVersionMeta::from_sequence(&in_range_created).unwrap(),
 1241 |             ),
 1242 |             last_updated_at_version_meta: None,
 1243 |         };
 1244 | 
 1245 |         // Fragment outside range – IDs [1000, 1001], created_at = 99 (must never appear)
 1246 |         let out_of_range_seq = RowIdSequence::from([1000u64, 1001].as_slice());
 1247 |         let out_of_range_created = RowDatasetVersionSequence {
 1248 |             runs: vec![RowDatasetVersionRun {
 1249 |                 span: U64Segment::Range(0..2),
 1250 |                 version: 99,
 1251 |             }],
 1252 |         };
 1253 |         let out_of_range_frag = Fragment {
 1254 |             id: 2,
 1255 |             files: vec![],
 1256 |             overlays: vec![],
 1257 |             deletion_file: None,
 1258 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&out_of_range_seq).into())),
 1259 |             physical_rows: Some(2),
 1260 |             created_at_version_meta: Some(
 1261 |                 RowDatasetVersionMeta::from_sequence(&out_of_range_created).unwrap(),
 1262 |             ),
 1263 |             last_updated_at_version_meta: None,
 1264 |         };
 1265 | 
 1266 |         // New fragment rewrites both rows from the in-range fragment
 1267 |         let new_seq = RowIdSequence::from([10u64, 11].as_slice());
 1268 |         let new_frag = Fragment {
 1269 |             id: 10,
 1270 |             files: vec![],
 1271 |             overlays: vec![],
 1272 |             deletion_file: None,
 1273 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&new_seq).into())),
 1274 |             physical_rows: Some(2),
 1275 |             created_at_version_meta: None,
 1276 |             last_updated_at_version_meta: None,
 1277 |         };
 1278 | 
 1279 |         let manifest = make_stable_row_id_manifest(vec![in_range_frag, out_of_range_frag]);
 1280 |         let (result, _) = update_txn(vec![new_frag])
 1281 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 1282 |             .unwrap();
 1283 | 
 1284 |         // Both rows originate from the in-range fragment (version 5).
 1285 |         // The out-of-range fragment's version 99 must not appear.
 1286 |         assert_eq!(created_at_versions(&result, 10), vec![5, 5]);
 1287 |         assert_eq!(last_updated_at_versions(&result, 10), vec![5, 5]);
 1288 |     }
 1289 | 
 1290 |     /// When the needed row IDs fall exactly at the boundary of a fragment's range,
 1291 |     /// the range pre-filter must NOT skip the fragment (boundary values are inclusive).
 1292 |     #[test]
 1293 |     fn test_update_version_tracking_range_filter_boundary_inclusive() {
 1294 |         // Fragment IDs [10, 11, 12], created_at = 7
 1295 |         let seq = RowIdSequence::from([10u64, 11, 12].as_slice());
 1296 |         let created = RowDatasetVersionSequence {
 1297 |             runs: vec![RowDatasetVersionRun {
 1298 |                 span: U64Segment::Range(0..3),
 1299 |                 version: 7,
 1300 |             }],
 1301 |         };
 1302 |         let existing = Fragment {
 1303 |             id: 1,
 1304 |             files: vec![],
 1305 |             overlays: vec![],
 1306 |             deletion_file: None,
 1307 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&seq).into())),
 1308 |             physical_rows: Some(3),
 1309 |             created_at_version_meta: Some(RowDatasetVersionMeta::from_sequence(&created).unwrap()),
 1310 |             last_updated_at_version_meta: None,
 1311 |         };
 1312 | 
 1313 |         // New fragment takes the boundary IDs: 10 (min) and 12 (max)
 1314 |         let new_seq = RowIdSequence::from([10u64, 12].as_slice());
 1315 |         let new_frag = Fragment {
 1316 |             id: 10,
 1317 |             files: vec![],
 1318 |             overlays: vec![],
 1319 |             deletion_file: None,
 1320 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&new_seq).into())),
 1321 |             physical_rows: Some(2),
 1322 |             created_at_version_meta: None,
 1323 |             last_updated_at_version_meta: None,
 1324 |         };
 1325 | 
 1326 |         let manifest = make_stable_row_id_manifest(vec![existing]);
 1327 |         let (result, _) = update_txn(vec![new_frag])
 1328 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 1329 |             .unwrap();
 1330 | 
 1331 |         // Boundary IDs must be found and resolved correctly
 1332 |         assert_eq!(created_at_versions(&result, 10), vec![7, 7]);
 1333 |     }
 1334 | 
 1335 |     /// When multiple updated rows all originate from the same source fragment,
 1336 |     /// the created_at version sequence for that fragment must be decoded exactly
 1337 |     /// once (not once per row).  The observable correctness requirement is that
 1338 |     /// all rows get the right version regardless of how many there are.
 1339 |     #[test]
 1340 |     fn test_update_version_tracking_many_rows_same_source_fragment() {
 1341 |         // Source fragment: 100 rows with IDs 0..100, mixed versions (2 runs).
 1342 |         // First 50 rows at version 3, next 50 rows at version 4.
 1343 |         let src_ids: Vec<u64> = (0u64..100).collect();
 1344 |         let src_seq = RowIdSequence::from(src_ids.as_slice());
 1345 |         let src_created = RowDatasetVersionSequence {
 1346 |             runs: vec![
 1347 |                 RowDatasetVersionRun {
 1348 |                     span: U64Segment::Range(0..50),
 1349 |                     version: 3,
 1350 |                 },
 1351 |                 RowDatasetVersionRun {
 1352 |                     span: U64Segment::Range(0..50),
 1353 |                     version: 4,
 1354 |                 },
 1355 |             ],
 1356 |         };
 1357 |         let src_frag = Fragment {
 1358 |             id: 1,
 1359 |             files: vec![],
 1360 |             overlays: vec![],
 1361 |             deletion_file: None,
 1362 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&src_seq).into())),
 1363 |             physical_rows: Some(100),
 1364 |             created_at_version_meta: Some(
 1365 |                 RowDatasetVersionMeta::from_sequence(&src_created).unwrap(),
 1366 |             ),
 1367 |             last_updated_at_version_meta: None,
 1368 |         };
 1369 | 
 1370 |         // New fragment rewrites all 100 rows preserving their stable IDs.
 1371 |         let new_seq = RowIdSequence::from(src_ids.as_slice());
 1372 |         let new_frag = Fragment {
 1373 |             id: 10,
 1374 |             files: vec![],
 1375 |             overlays: vec![],
 1376 |             deletion_file: None,
 1377 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&new_seq).into())),
 1378 |             physical_rows: Some(100),
 1379 |             created_at_version_meta: None,
 1380 |             last_updated_at_version_meta: None,
 1381 |         };
 1382 | 
 1383 |         let manifest = make_stable_row_id_manifest(vec![src_frag]);
 1384 |         let (result, _) = update_txn(vec![new_frag])
 1385 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 1386 |             .unwrap();
 1387 | 
 1388 |         let versions = created_at_versions(&result, 10);
 1389 |         assert_eq!(versions.len(), 100);
 1390 |         // First 50 rows came from version 3, next 50 from version 4
 1391 |         assert!(versions[..50].iter().all(|&v| v == 3));
 1392 |         assert!(versions[50..].iter().all(|&v| v == 4));
 1393 |     }
 1394 | 
 1395 |     /// Rows originating from multiple distinct source fragments must each get
 1396 |     /// the version from their own source, even when all cached together.
 1397 |     #[test]
 1398 |     fn test_update_version_tracking_cache_multiple_source_fragments() {
 1399 |         let seq_a = RowIdSequence::from([10u64, 11, 12].as_slice());
 1400 |         let created_a = RowDatasetVersionSequence {
 1401 |             runs: vec![RowDatasetVersionRun {
 1402 |                 span: U64Segment::Range(0..3),
 1403 |                 version: 2,
 1404 |             }],
 1405 |         };
 1406 |         let seq_b = RowIdSequence::from([20u64, 21, 22].as_slice());
 1407 |         let created_b = RowDatasetVersionSequence {
 1408 |             runs: vec![RowDatasetVersionRun {
 1409 |                 span: U64Segment::Range(0..3),
 1410 |                 version: 8,
 1411 |             }],
 1412 |         };
 1413 | 
 1414 |         let manifest = make_stable_row_id_manifest(vec![
 1415 |             Fragment {
 1416 |                 id: 1,
 1417 |                 files: vec![],
 1418 |                 overlays: vec![],
 1419 |                 deletion_file: None,
 1420 |                 row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&seq_a).into())),
 1421 |                 physical_rows: Some(3),
 1422 |                 created_at_version_meta: Some(
 1423 |                     RowDatasetVersionMeta::from_sequence(&created_a).unwrap(),
 1424 |                 ),
 1425 |                 last_updated_at_version_meta: None,
 1426 |             },
 1427 |             Fragment {
 1428 |                 id: 2,
 1429 |                 files: vec![],
 1430 |                 overlays: vec![],
 1431 |                 deletion_file: None,
 1432 |                 row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&seq_b).into())),
 1433 |                 physical_rows: Some(3),
 1434 |                 created_at_version_meta: Some(
 1435 |                     RowDatasetVersionMeta::from_sequence(&created_b).unwrap(),
 1436 |                 ),
 1437 |                 last_updated_at_version_meta: None,
 1438 |             },
 1439 |         ]);
 1440 | 
 1441 |         // New fragment takes rows from both sources: 12 (frag A, offset 2) and 20 (frag B, offset 0)
 1442 |         let new_seq = RowIdSequence::from([12u64, 20].as_slice());
 1443 |         let new_frag = Fragment {
 1444 |             id: 10,
 1445 |             files: vec![],
 1446 |             overlays: vec![],
 1447 |             deletion_file: None,
 1448 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&new_seq).into())),
 1449 |             physical_rows: Some(2),
 1450 |             created_at_version_meta: None,
 1451 |             last_updated_at_version_meta: None,
 1452 |         };
 1453 | 
 1454 |         let (result, _) = update_txn(vec![new_frag])
 1455 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 1456 |             .unwrap();
 1457 | 
 1458 |         // Row 12 → frag A offset 2 → version 2; row 20 → frag B offset 0 → version 8
 1459 |         assert_eq!(created_at_versions(&result, 10), vec![2, 8]);
 1460 |     }
 1461 | }
``````
