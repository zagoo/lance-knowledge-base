> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/transaction/manifest_build.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `636c1bd43bf2eade65378408473f5891103a94f2951eb2eee8bb2cd780271649`. Reviewed physical lines: 1-5468.

[Module](../../../../../L1-modules/rust-lance-table-manifest-build.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Transaction manifest candidate assembly, prepared index coverage and MemWAL catchup accounting, restore metadata loading, and local regression fixtures. Complete runtime and cfg(test) lines; synchronous main builder is not storage publication. (rust/lance-table/src/transaction/manifest_build.rs:1-5468)

## Complete range analysis

### Lines 1-58

SPDX/module docs identify build_manifest as operation-to-candidate metadata center. Imports feature flags/read-write gates, overlay/types, CommitHandler plus manifest readers, row-ID/version helpers, FRI gate/recognizers, MemWAL helpers, UpdateMode, preparation/validation/update-map functions, operation payloads, key metadata names, truthy parser, exact file versions, object store/path, Roaring, ordered/hash collections, Arc and UUID. Imported commit/manifest IO powers restoration; main candidate building is synchronous. (rust/lance-table/src/transaction/manifest_build.rs:1-58)

### Lines 59-80

Public RANGE_SEGMENTS_CONFIG_KEY is exactly lance.row_ids.range_segments. Docs say opt-in converts bitmap row-ID segments to a compact in-memory Ranges form serialized as existing Range records; older readers may be slow, and turning off only stops new conversions. Private range_segments_enabled looks in manifest.config and uses str_is_truthy directly: missing/unrecognized false, recognized case-insensitive spellings true, no whitespace trim (rust/lance-core/src/utils/parse.rs:5-11). This is persisted config, not an environment setting. (rust/lance-table/src/transaction/manifest_build.rs:59-80)

### Lines 81-108

Private apply_range_segments returns Ok immediately unless destination manifest enables conversion. If current manifest also enables it, build HashMap fragment ID to starting raw byte pointer for only inline row-ID entries; otherwise empty. Duplicate IDs overwrite earlier pointer entries. Equality later is ID plus pointer, not encoded-content digest or bytes. Raw pointers are compared, never dereferenced; no unsafe block. (rust/lance-table/src/transaction/manifest_build.rs:81-108)

### Lines 109-124

Arc::make_mut detaches fragment vector when shared, then visit each inline row-ID sequence. Same ID/start pointer in enabled current manifest skips decode; other inline entries decode fallibly, run use_range_segments and replace bytes only when it reports change. Column/missing metadata skipped. Decoder errors can follow earlier local fragment changes; no rollback within helper. New allocation with equal bytes is decoded; pointer equality assumes valid unmodified shared backing. Enabling on a previously disabled table attempts every inline fragment. No storage IO. (rust/lance-table/src/transaction/manifest_build.rs:109-124)

### Lines 125-141

Transaction::fragments_with_ids is pub(super), generic IntoIterator<Item=Fragment> with returned lazy iterator borrowing mutable u64 counter for lifetime a. Each consumed fragment with id0 gets current counter then ordinary increment; nonzero IDs pass unchanged without advancing/reserving counter. Allocation happens on iteration, not method call. No collision/u32-limit/overflow validation; valid externally assigned IDs and counter state are caller responsibilities. Counter0 can assign legitimate0 and still advance. (rust/lance-table/src/transaction/manifest_build.rs:125-141)

### Lines 142-166

Private data_storage_format_from_files takes fragments and optional exact request. Explicit V1 first infers homogeneous existing file version and errors if it is non-V1; inference errors propagate. Explicit non-V1 wins without inference, allowing mixed prewritten versions for later finalization. No request uses inferred version. None after empty-file inference becomes DataStorageFormat::default. This chooses default metadata, not actual file conversion or complete final file-version validation. (rust/lance-table/src/transaction/manifest_build.rs:142-166)

### Lines 167-188

Public async Transaction::restore_old_manifest borrows store/CommitHandler/base/config/current and accepts target version/tx path; returns owned Manifest and index Vec. Await version location, await manifest read, then require both read and write capability before mutating metadata or reading indices. Set supplied timestamp/transaction path, await index read, then validate tagged paired flags. IO/errors propagate in this order; cancellation can drop awaits/local candidate, with no write/publication performed here. (rust/lance-table/src/transaction/manifest_build.rs:167-188)

### Lines 189-206

Restore raises target max_fragment_id and next_row_id to maxima with current high-water marks. Rejects current stable-ID table restored to target without stable IDs, with target version/context: reverting to physical-address identity could collide with allocated IDs. Then inherit sticky feature flags and return. Target manifest version itself is not incremented here, and contents/config/index entries remain restored state apart from listed metadata changes. No data-file existence/rewrite/cleanup checks here. (rust/lance-table/src/transaction/manifest_build.rs:189-206)

### Lines 207-228

Public logical_index_segments filters system indices using exact reserved-name predicate, groups all other physical segments by owned name in BTreeMap, clones UUID plus Option bitmap into CoverageIdentity, then unstable-sorts each Vec by UUID only. Order-independent equality assumes unique segment UUIDs; duplicates with different bitmaps can retain differing tie order because tie key excludes bitmap. Duplicate entries are not removed. No file/detail/version/timestamp comparison; allocations include names, vectors and cloned bitmaps. (rust/lance-table/src/transaction/manifest_build.rs:207-228)

### Lines 229-257

Public apply_mem_wal_index_coverage mutates final index slice from prior logical-segment snapshot, optional original read-version manifest/indices and new version. Docs derive credit from covering all fragments live at original read_version, capped by current compacted progress; merely reported claims could become stale on rebase. Missing catchup is documented differently in required-coverage versus legacy read modes. This method signature has no explicit coverage-mode flag and its actual early returns follow below; global reader policy requires separate analysis. (rust/lance-table/src/transaction/manifest_build.rs:229-257)

### Lines 258-277

Find first final index named __lance_mem_wal; absence returns Ok. Decode a clone; only if both compacted_sstables and index_catchup are empty return unchanged. Compute logical segments after and take catchup vector out of local decoded details. Missing/invalid Any errors before any caller mutation. This branch does not directly inspect a feature flag or maintain_all_indexes. Duplicate reserved entries ignored after first. (rust/lance-table/src/transaction/manifest_build.rs:258-277)

### Lines 278-314

Optional read-version state searches its first reserved-name entry, clones/decodes with Option/Result transpose, and propagates malformed details even when credit might ultimately be absent. Build one tuple per current compacted marker in its order: shard UUID,current generation,min(first read marker generation or0,current). Current duplicate shard markers stay duplicated. Read state missing or missing shard contributes0. Capping by current protects against credit from a subsequently rolled-back compaction; no monotonic-state validation performed. (rust/lance-table/src/transaction/manifest_build.rs:278-314)

### Lines 315-350

Build optional RoaringBitmap of every read-manifest fragment ID cast unchecked u64->u32. covers_read_version returns false if no read state or empty required set, explicitly refusing vacuous credit because historical UpdateMemWalState could omit fragments while SSTables remain sole data copy. Otherwise union every physical segment bitmap; any None returns false even if other segments already cover all required IDs. Return required subset of union. No row counts, deletion vectors, field identity or per-generation fragment mapping is checked. (rust/lance-table/src/transaction/manifest_build.rs:315-350)

### Lines 351-369

For each after logical index in BTreeMap name order, unchanged means full CoverageIdentity Vec equals segments_before[name], including bitmap and Option shape. Only unchanged names may carry first matching prior catchup entry. Independently recompute proof of read-version coverage. If neither carried nor proven, omit name. Changed UUID or in-place bitmap narrowing can remove credit; additional outer metadata fields do not affect equality. Prior duplicate name entries beyond first are not merged. (rust/lance-table/src/transaction/manifest_build.rs:351-369)

### Lines 370-392

For each current compacted shard tuple, prior generation is first carried shard match or0; new credit is capped read generation only when proven, else0. Emit min(max(prior,credited),committed). This keeps higher prior credit on unchanged index while clamping rollback and never credits post-read generations. Emit all current shard tuples including zeros if any generation positive; omit the entire name if all zero, also true for no shards. Explicitly sort rebuilt names, though BTreeMap traversal already sorted them. No removal of duplicate shard tuples. (rust/lance-table/src/transaction/manifest_build.rs:370-392)

### Lines 393-415

Sort old catchup entries by name and compare to rebuilt with order-sensitive nested Vec equality. Equal returns without touching final metadata, preserving UUID and actual prior byte ordering even if only names had been unsorted. Otherwise find old names absent from rebuilt (nested scans, duplicates may log repeatedly), info-log dropped names, store rebuilt details and replace selected slot through fresh metadata constructor. Errors before assignment leave caller slice unchanged; info log can precede constructor error. Successful replacement changes UUID/timestamp and constructor outer defaults as documented in mem_wal.rs598-618; no physical file IO. (rust/lance-table/src/transaction/manifest_build.rs:393-415)

### Lines 416-452

Public withdraw_coverage_invalidated_after_build accepts changed logical names and candidate version. Empty names or absent reserved MemWAL entry returns Ok. Decode copy, retain catchup names not contained in changed slice, return unchanged if no entry removed. Otherwise log the complete supplied changed list and replace same index slot with newly encoded metadata. It only removes credit, never derives new credit; duplicates/missing names harmless, contains scans give O(catchup*changed) comparisons. Failure before replacement preserves caller slice. Docs identify post-build migrate_indices bitmap recalculation as caller rationale, full caller still pending. (rust/lance-table/src/transaction/manifest_build.rs:416-452)

### Lines 453-481

Public prepare_indices takes current optional manifest, owned current indices, config, optional decoded Arc ledger and settled FragReuseUpdate. Docs require per-attempt current state and explain inline decode versus unprefetched external rejection. It prepares in-place Update/Merge/DataReplacement coverage through lineage; it does not itself open external history. Missing read capability is not silently treated as no lineage by the called parser. (rust/lance-table/src/transaction/manifest_build.rs:453-481)

### Lines 482-515

Run pure tagged write gate before cloning indices. With a current manifest compute rewritten physical columns; only nonempty rewrites construct TaggedLineage from original metadata/caller ledger, collect live fragment IDs using checked u32 conversion dropping out-of-range values, and withdraw coverage in cloned prepared list. Thus invalid ledger can remain unparsed when no physical rewrite is present. Current manifest and input index elements are not mutated; errors drop local clone. (rust/lance-table/src/transaction/manifest_build.rs:482-515)

### Lines 516-542

Return PreparedIndices with optional current version, owned original Vec, cloned/adjusted Vec and settled FRI update. Public build_manifest forwards to build_manifest_with_read_version with None read state; no local operation validation or disk publication in wrapper. Signatures return an owned candidate Manifest plus owned final index list. (rust/lance-table/src/transaction/manifest_build.rs:516-542)

### Lines 543-579

Public build_manifest_with_read_version takes optional borrowed ReadVersionState but prepares with no ledger and FragReuseUpdate::None, then calls prepared builder. External history rejection applies when preparation needs to decode it; tagged intent admission follows classifier, not a universal prohibition on every tagged operation. Documentation calls creation/detached cases None; API does not verify that read state corresponds to transaction.read_version. (rust/lance-table/src/transaction/manifest_build.rs:543-579)

### Lines 580-611

Public build_manifest_prepared first compares prepared.manifest_version() to current Option version, rejecting mismatch with both values. Equality of version numbers is the only binding check here, not manifest content/UUID identity. Re-run gate against prepared original indices and settled FRI intent, then consume into_parts. Comments say publishes final list, but this synchronous builder returns metadata; actual storage publication occurs elsewhere. (rust/lance-table/src/transaction/manifest_build.rs:580-611)

### Lines 612-642

If config requests stable IDs for existing nonstable table without migration_next_row_id, return NotSupported with migration advice. Independently collect names of every original index except exact FRI name; migration Some with any blockers errors, including MemWAL. This exclusion checks name only, not details/type. Creating migration config does not itself validate row IDs or apply publication. Conditions distinguish config request from already-active manifest flag. (rust/lance-table/src/transaction/manifest_build.rs:612-642)

### Lines 643-674

Clone current base_paths or create empty map. Overwrite initial_bases Some is accepted only for dataset creation; loop rejects repeated IDs before inserting cloned BasePath entries. Existing dataset returns InvalidInput even for Some(empty), reiterating validation should have caught it. URI uniqueness, access and base resolution are not checked in this local registration step. All mutations are to local candidate map. (rust/lance-table/src/transaction/manifest_build.rs:643-674)

### Lines 675-700

Select schema from Overwrite/Merge/Project payload, otherwise clone current schema or Internal if absent. Compute next fragment ID as current max_fragment_id()+1 or0; additions are ordinary arithmetic with no checked overflow here. Allocate empty final fragment Vec and take prepared indices. High-water-mark comment explains avoiding reused row-address/cache/deletion identity, but arbitrary supplied nonzero fragment IDs are not rejected by this setup. (rust/lance-table/src/transaction/manifest_build.rs:675-700)

### Lines 701-719

Migration config removes all final indices named FRI. If any original MemWAL reserved-name entry existed, snapshot non-system CoverageIdentity sets from originals before preparation, otherwise skip cloning cost. Drop original metadata Vec afterward. This activation depends on original list; adding MemWAL for the first time does not enable this before/after hook in the same build. (rust/lance-table/src/transaction/manifest_build.rs:701-719)

### Lines 720-740

Stable allocation state precedence: existing reader FLAG_STABLE_ROW_IDS always uses existing next_row_id even if config.use_stable_row_ids=false; new table plus true starts0; false otherwise uses None; existing nonstable plus true requires supplied migration next value or NotSupported. Migration_next_row_id Some with false does not independently activate this Option, although earlier migration-specific checks/removal still run. No validation of supplied migration watermark occurs here. (rust/lance-table/src/transaction/manifest_build.rs:720-740)

### Lines 741-759

Prepare Result<&Vec<Fragment>> lazily from optional current manifest, with operation-name Internal error, then compute candidate version1 or current.version+1 unchecked. Operations consume the missing-manifest error only when using ?. Clone explicitly returns Internal that it should not enter builder. Operation validation and conflict resolution are not called by this section. (rust/lance-table/src/transaction/manifest_build.rs:741-759)

### Lines 760-775

Append requires current fragments, clones/preserves them in order, allocates placeholder IDs for cloned new fragments, then when stable allocation active assigns row IDs and overwrites both created/update metadata from build_version_meta(new_version). Append new fragments afterward. Count/lineage preconditions and helper panic behavior remain those of assign_row_ids/build_version_meta; no actual file writes or schema mutation. (rust/lance-table/src/transaction/manifest_build.rs:760-775)

### Lines 776-797

Delete constructs deleted-ID HashSet and updated-ID HashMap with last duplicate update winning. Clone current fragments, remove deleted IDs, then replace only deletion_file on surviving matching IDs. Other staged post-image fields are deliberately ignored to preserve rebased current overlays/files/lineage. Missing updated/deleted IDs have no direct error here; deletion wins if an ID is in both. Retain relevant indices against final fragments/schema. (rust/lance-table/src/transaction/manifest_build.rs:776-797)

### Lines 798-823

Update borrows removed/updated/new fragments, modified fields, compacted SSTables, index-preservation fields, mode and offset map. Requires current fragments. Removed-ID set deduplicates; updated_by_id inserts with or_insert so first duplicate wins, unlike Delete. Build live schema field-ID set by preorder, including nested fields. None of these maps validates duplicate contradictions itself. (rust/lance-table/src/transaction/manifest_build.rs:798-823)

### Lines 824-860

Scan current fragments in order. Remove listed IDs first. For each surviving updated ID clone staged post-image, replace overlays with current overlays, and prune staged base files that contain neither current schema fields nor the staged fragment's spilled lineage IDs. RewriteColumns mode tombstones overlays for fields_modified; other modes carry them intact. Unchanged fragments are current clones; updated payload IDs absent from current are ignored. Deletion/file/lineage state otherwise comes from staged post-image, not a full merge with current. (rust/lance-table/src/transaction/manifest_build.rs:824-860)

### Lines 861-896

An empty if next_row_id.is_some block and comments do not stamp any metadata. Extend final_fragments with updated survivors. Partial latest-update stamping runs only with active stable allocation, explicit RewriteColumns, present nonempty offset map. For each final fragment require matching map entry, updated_by_id membership, nonempty bitmap and preexisting latest-update metadata; skipped cases remain unchanged. This prevents fabricating historical stamps for fragments lacking metadata. (rust/lance-table/src/transaction/manifest_build.rs:861-896)

### Lines 897-928

For each eligible partial update, linearly find original physical_rows, using fallback1<<24 if missing. Reject bitmap cardinality greater than limit before rejecting maximum offset>=limit, with detailed values. Then collect sorted bitmap offsets as Vec<usize> and call partial refresh with new_version, previous current.version or0 and preloaded spilled lineage. Earlier candidate fragments may already be modified on failure, but candidate is local to this Result-returning builder. Helper may have additional count/decode errors; no IO performed here. (rust/lance-table/src/transaction/manifest_build.rs:897-928)

### Lines 929-959

Coverage withdrawal already happened in prepare_indices. Clone new update fragments through placeholder ID iterator, prune their base files against current schema plus each new fragment's spilled IDs, assign missing row IDs when stable allocation active, then resolve created/latest metadata from original existing fragments and preloaded lineage. Ordering matters: resolver sees allocated IDs. A staged file retaining at least one live field stays whole; this pruning does not rewrite its field mapping. (rust/lance-table/src/transaction/manifest_build.rs:929-959)

### Lines 960-996

Index reuse for RewriteRows tests config.use_stable_row_ids, not merely active next_row_id. Collect pure-update new fragment IDs, concatenate removed IDs plus every updated payload ID as source list, and build map of current overlaid source fragments keyed by unchecked u32 cast. Invoke register_pure_rewrite_rows_update_frags_in_indices with preservation fields/schema. It can error or modify candidate index coverage; existing source overlays are considered to avoid carrying stale values. A stable table with false config skips this optional reuse branch. (rust/lance-table/src/transaction/manifest_build.rs:960-996)

### Lines 997-1016

Call assign_row_ids a second time when stable allocation active, relying on existing metadata to avoid reallocating; preserve version metadata from resolver. Source comment's numeric line references1627-1755 are stale and do not define execution order. Build target_ids HashSet of new fragments but do not read it afterward in this arm, so it incurs allocation with no local semantic effect. Append new fragments, retain relevant indices, and only then strictly update nonempty MemWAL compacted markers with new_version; helper errors abort candidate return. (rust/lance-table/src/transaction/manifest_build.rs:997-1016)

### Lines 1017-1039

Overwrite clones only supplied fragments and overwrites every incoming fragment ID with sequential high-water IDs, including nonzero IDs. Ordinary increments unchecked. With stable allocation, assign missing row IDs and restamp both version metadata uniformly from new version. Replace final fragment list and discard every index. Carried-over fragment rejection is delegated to earlier validate_operation, not performed here; direct builder callers must respect that precondition. (rust/lance-table/src/transaction/manifest_build.rs:1017-1039)

### Lines 1040-1069

Rewrite clones existing fragments then delegates handle_rewrite_fragments with groups, mutable fragment counter, current version and optional stable row watermark. Obtain optional TaggedRewriteAssembly only from prepared FragReuseUpdate::Rewrite. ordered_rewrite_groups excludes groups whose sources were reordered by stable-partition transitions so provenance remains on retired sources rather than falsely claiming destination coverage. Group intersection validation delegates helper. (rust/lance-table/src/transaction/manifest_build.rs:1040-1069)

### Lines 1070-1097

With active stable IDs, debug_assert rewritten_indices empty (not a release error), skip indices recognized as FRI by name/details predicate, and transform each present bitmap. Row-address-domain indices drop ordered rewritten sources without following destinations; row-ID-domain indices recalculate source-to-destination coverage fallibly. Unknown bitmap None stays None. This path ignores provided rewritten-index replacements after the debug assertion and does not inspect row-map file contents. (rust/lance-table/src/transaction/manifest_build.rs:1070-1097)

### Lines 1098-1110

Without stable IDs, handle_rewrite_indices applies rewritten metadata and ordered-group bitmap rules. In both branches prune overlay-stale index fields for every rewrite group afterward because fresh base data materializes overlays. These are in-memory metadata changes; no index files are copied, removed or rebuilt in this code. (rust/lance-table/src/transaction/manifest_build.rs:1098-1110)

### Lines 1111-1146

If prepared assembly exists, select first current final FRI-name entry dataset_version and compare Option with assembly.base_entry_version; mismatch errors with both versions and commit-path advice. This is a consistency check, not CAS or proof of entire history identity; comments place concurrency protection in external per-attempt assembly/CAS. Retain entries whose name differs from assembly.entry.name and append cloned assembly entry, ignoring operation's own FRI payload. It validates neither assembly UUID nor full bytes here. (rust/lance-table/src/transaction/manifest_build.rs:1111-1146)

### Lines 1147-1179

Without assembly, Some legacy FRI entry is spliced by removing all same-name indices and appending clone; no local byte decode, preserving existing snapshot behavior after gate. None does nothing. CreateIndex preserves current fragments, removes existing entries whose UUID appears in removed or new lists, validates covering fields on every new entry, then extends with clones in supplied order. No deduplication of repeated new UUID/name occurs here; validation failure only damages local candidate state. (rust/lance-table/src/transaction/manifest_build.rs:1147-1179)

### Lines 1180-1222

ReserveFragments/UpdateConfig initially carry current fragments unchanged. Merge clones supplied full fragment list, not a union with current. With active stable IDs, map original fragments by ID (last duplicate wins); physically rewritten existing fragments receive full latest-update refresh, unchanged ones retain staged metadata; new IDs receive full refresh then creation metadata cloned from latest. No fragment-ID or stable-row-ID assignment is done in this Merge arm. Extend final list then retain indices relevant to new schema/fragments; preparation already withdrew in-place changed-column coverage. (rust/lance-table/src/transaction/manifest_build.rs:1180-1222)

### Lines 1223-1249

Project clones current fragments, collects all remaining schema IDs, and retains each base file if any raw field ID is still in schema or is a spilled lineage ID required by that fragment. It does not tombstone other field mappings or prune overlays here. Retain relevant indices afterward. Restore is unreachable! and can panic for a direct builder call reaching this arm; normal restore path is separate async method. (rust/lance-table/src/transaction/manifest_build.rs:1223-1249)

### Lines 1250-1282

DataReplacement warns that operation is unstable, then unzips borrowed replacement IDs/files. Require all new files' ordered fields Arc slices equal via HashSet cardinality<=1; empty replacement list passes. Difference errors with per-file field arrays. This checks field-ID arrays, not column_indices/version/schema isomorphism; error text and comments claiming same fields do not establish same physical layout. (rust/lance-table/src/transaction/manifest_build.rs:1250-1282)

### Lines 1283-1323

Require current fragments. Compute replaced_fields from first new file's reconstructed logical schema field IDs plus raw file field IDs, filtering negatives and retaining duplicates in Vec. For each replacement in input order find first original fragment with that ID or InvalidInput, then clone it. Compute replacement_ids from each new file's logical plus raw IDs into HashSet, including negatives here. Explicit TODO leaves new-file/fragment row-count equality unchecked. Repeated fragment replacements independently clone the same original rather than accumulate. (rust/lance-table/src/transaction/manifest_build.rs:1283-1323)

### Lines 1324-1345

Walk all cloned existing files. Exact raw fields plus equal major/minor causes path, cached size and base_id replacement; column_indices and other metadata stay from old file. Every matching file is changed, not just first, and replaced_in_place is remembered. Independently union logical and raw coverage across files. Then require new_file.file_version() to decode; no file bytes or length are read. Invalid existing versions may be encountered through schema reconstruction or later checks. (rust/lance-table/src/transaction/manifest_build.rs:1324-1345)

### Lines 1346-1373

If replacement coverage is disjoint from existing coverage, append full new DataFile (all-null missing columns becoming values). Otherwise partial replacement requires no exact match, replacement coverage subset of existing coverage, and every file either known non-V1 or raw-field-disjoint from replacement. V1 fields require exact replacement because tombstoning would shift reader page-table interpretation per comment. Overlapping-but-not-subset coverage and blocked V1 layouts perform no mutation and later fail unchanged check. (rust/lance-table/src/transaction/manifest_build.rs:1346-1373)

### Lines 1374-1414

Partial replacement loops every file, propagates file_version errors even for unrelated unknown-version files, skips V1, and rewrites any raw replacement field ID to TOMBSTONE_FIELD_ID while preserving physical column_indices. Collect current schema live IDs; retain files having any live or required spilled-lineage field, then append cloned new file. This prunes empty/dead field-only carriers but preserves sole hidden lineage data. No on-disk rewrite or physical deletion occurs; old bytes become unreachable/dead space by metadata. (rust/lance-table/src/transaction/manifest_build.rs:1374-1414)

### Lines 1415-1441

Before overlay processing, reject if new fragment still equals original, including same path/size/base exact replacement. For changed fragment, partition current overlays by committed_version<=transaction.read_version. Tombstone replaced nonnegative fields only in older/equal overlays; append newer overlays unchanged after them and store. Partition preserves relative order within groups; final global ordering validation still applies. Newer concurrent overlays win over replacement base values. Push each independently changed fragment in replacement-input order. (rust/lance-table/src/transaction/manifest_build.rs:1415-1441)

### Lines 1442-1475

Build changed-ID HashSet, then append original fragments absent from it. Duplicate replacement IDs can produce duplicate candidate fragments here; later sorting does not deduplicate. With active stable IDs, full latest-update refresh every changed fragment using candidate version, preserving creation metadata as helper dictates. Prep already withdrew replaced-field index coverage; this arm has no separate retain_relevant_indices call. Empty replacements effectively carry all originals and stamp none. (rust/lance-table/src/transaction/manifest_build.rs:1442-1475)

### Lines 1476-1506

DataOverlay recomputes candidate version and requires existing fragments. Group all borrowed overlays by target ID, extending in original group/list order so repeated target groups are retained. Build current-ID set once, then reject any absent target with ID context; even a group with empty overlay list creates a key and is checked. Error selection across multiple missing targets follows HashMap iteration. No payload-file or offset validation in this lookup stage. (rust/lance-table/src/transaction/manifest_build.rs:1476-1506)

### Lines 1507-1540

Clone every current fragment in order. For targeted fragments with active stable IDs, union all shared coverage bitmaps or all per-field bitmaps into one Roaring set. If nonempty, materialize Vec<usize> offsets and call partial latest-update refresh with candidate version, fallback1 and preloaded spilled lineage. Unlike RewriteColumns Update, this does not skip absent prior version metadata or impose the local1<<24 bound; the helper silently ignores offsets outside its materialized base-version vector and separately errors for unsupported missing spilled lineage. Fallback1 preserves documented scan behavior for uncovered rows; creation metadata is not changed here. Offset membership is tested with pos < base_versions.len(), not rejected at this helper boundary. (rust/lance-table/src/rowids/version.rs:721-780; rust/lance-table/src/rowids/version.rs:783-812) (rust/lance-table/src/transaction/manifest_build.rs:1507-1540)

### Lines 1541-1570

Append cloned new overlays to current list and overwrite every new committed_version with candidate version, preserving concurrent overlays and same-commit order. Push all fragments, including unaffected ones. UpdateMemWalState clones current fragments then invokes strict compacted-generation helper; it does not drop base fragments. UpdateBases also carries current fragments and indices; base-map changes occur later. End exhaustive16-operation match; the builder has not published anything. (rust/lance-table/src/transaction/manifest_build.rs:1541-1570)

### Lines 1571-1597

Stable-sort final fragments by ID, preserving duplicate-ID order rather than rejecting duplicates. Remove base files containing only tombstone fields via helper; validate newest-last ordering for every nonempty overlay list, rejecting rather than sorting. Validate hidden row-lineage carriers for every fragment including untouched ones, catching missing/duplicate/V1 carriers before candidate return. These are metadata checks; they do not prove referenced files exist or decode successfully. (rust/lance-table/src/transaction/manifest_build.rs:1571-1597)

### Lines 1598-1616

Choose requested storage default: explicit config.storage_format exact version wins over use_legacy_format; otherwise true maps V1, false maps V2_0, absent maps None. This builder does not reject simultaneous explicit/legacy config fields. If original MemWAL snapshot exists, apply catchup derivation once to final index list with original read-version state and candidate version. This precedes blob schema promotion and final Manifest construction. (rust/lance-table/src/transaction/manifest_build.rs:1598-1616)

### Lines 1617-1643

Collect schema field IDs recognized as legacy blob (blob but not v2). Only when nonempty, traverse every referenced Lance file including overlays, parse its exact version, and for V2_2/V2_3 collect matching legacy blob root IDs into ordered BTreeSet. Even an unrelated file with invalid version errors during this traversal. It checks metadata field IDs, not actual blob data/encoding. No file rewrite occurs; older referenced files are retained. (rust/lance-table/src/transaction/manifest_build.rs:1617-1643)

### Lines 1644-1683

Compute next logical field ID as max(current manifest max_field_id, candidate schema max_field_id, -1)+1 with ordinary i32 arithmetic. Promote collected roots to blob-v2 logical shape and call set_id with original parent and shared counter, retaining assigned root and allocating new children by helper contract. Existing dataset builds Manifest::new_from_previous with candidate fragments; only Overwrite plus explicit requested version changes default. Other existing operations ignore that request locally. New dataset infers/chooses default from files and constructs Manifest::new with registered reference_paths. (rust/lance-table/src/transaction/manifest_build.rs:1644-1683)

### Lines 1684-1699

Copy transaction tag. If config.auto_set_feature_flags, inherit active stable-ID intent with config request before apply_feature_flags, passing disable_transaction_file. This prevents an internal default config from clearing stable IDs. Errors drop local candidate. With auto=false, this call is skipped; later covering/sticky/tagged flags still run. No transaction file is written or disabled by this flag-setting call itself. (rust/lance-table/src/transaction/manifest_build.rs:1684-1699)

### Lines 1700-1725

After auto flag derivation, set both covering-index flags if any final metadata has nonempty covering_fields. Comment specifies constructors start without this bit and it is freshly derived, so dropping last covering index can lift the fence; loop does not independently clear it. Then inherit sticky flags from current manifest when present. Covering flags prevent readers/writers treating merely carried fields as index keys; actual query/write enforcement lies in other modules. (rust/lance-table/src/transaction/manifest_build.rs:1700-1725)

### Lines 1726-1757

Set configured timestamp and update max fragment ID from candidate before operation-specific config changes. Overwrite Some config upserts extends existing candidate config rather than clears it. UpdateConfig separately clones/applies/replaces config, table metadata and schema metadata using UpdateMap semantics; absence leaves each map unchanged. These mutations precede field-key validation and range-segment opt-in application; any later error prevents returning candidate but does not restore local temporary maps. (rust/lance-table/src/transaction/manifest_build.rs:1726-1757)

### Lines 1758-1789

Capture ordered primary-key and clustering-key field ID vectors before field updates. Compute writes_primary_key from any UpdateMap entry naming legacy primary flag or explicit position; compute writes_clustering_key from its position key. These flags count deletions and same-value writes, not only effective changes, and ignore replace-induced key disappearance unless after-vector comparison catches it. Original schema-level metadata updates already happened, but these properties live on fields. (rust/lance-table/src/transaction/manifest_build.rs:1758-1789)

### Lines 1790-1816

Iterate HashMap of field updates in unspecified order. Missing field ID returns InvalidInput. Apply each field metadata map, then synchronize parsed primary position: parse explicit u32, otherwise truthy legacy flag=>0, otherwise None. Clustering position only parses u32. Malformed explicit primary position can fall back to a true legacy marker; this stage does not independently reject every malformed reserved string. Other metadata keys remain map content; no schema-wide validation runs per field. (rust/lance-table/src/transaction/manifest_build.rs:1790-1816)

### Lines 1817-1843

If prior primary-key vector nonempty, reject any reserved-key write even same-value, or any changed after-vector (including replacement clearing). If prior empty and a reserved write leaves no primary key, reject invalid install. When writes_primary_key true and earlier rules pass, call schema.verify_primary_key for type/nullability/order constraints. No verification call when no reserved key entry exists. Policy operates on parsed fields and write-entry presence, not byte equality of metadata maps. (rust/lance-table/src/transaction/manifest_build.rs:1817-1843)

### Lines 1844-1871

Clustering guard mirrors immutable nonempty vector and invalid-empty install rules, rejecting reserved touches even if final vector unchanged. Unlike primary path, no verify_clustering_key or equivalent schema-wide validator is called here after successful install. Other operations bypass this UpdateConfig-specific guard. Then apply_range_segments on candidate config, so enabling this commit triggers conversion and disabling stops further conversions; failures can follow all prior local assembly. (rust/lance-table/src/transaction/manifest_build.rs:1844-1871)

### Lines 1872-1903

UpdateBases iterates proposals after candidate construction/range conversion. Reject if any existing BasePath has equal Option name OR equal path; two absent names therefore conflict too. For id0 allocate current maximum ID+1 or1 with ordinary arithmetic. Nonzero supplied ID is inserted without separate collision check, so it can overwrite a different same-ID entry if name/path checks pass. New proposals see previously inserted proposals; no mutation to current manifest, no URI reachability/path normalization check here. (rust/lance-table/src/transaction/manifest_build.rs:1872-1903)

### Lines 1904-1919

ReserveFragments raises candidate max_fragment_id from existing Option.unwrap_or(0) by num_fragments, unchecked; even empty current can become Some. Always set transaction_file Some supplied path, regardless of disable_transaction_file flag setting earlier. Write next_row_id only when allocation Option active. If any final index satisfies tagged name/nonzero-version predicate, OR paired FRI feature bits, then return candidate manifest and indices. No validate_operation, storage finalization, compare-and-swap, file existence check, cleanup or conflict retry executes in this synchronous return path. (rust/lance-table/src/transaction/manifest_build.rs:1904-1919)

### Lines 1920-1943

Private remove_tombstoned_data_files retains any file with at least one raw field ID !=-2; empty fields are removed by any false, and other negatives/out-of-schema IDs alone survive this helper. Private drop_rewritten_fragments clones old bitmap, removes every group source ID cast unchecked to u32, and returns it without destination additions or partial-coverage errors. Both preserve source inputs except supplied mutable fragment files in first. End Transaction impl; tests follow. (rust/lance-table/src/transaction/manifest_build.rs:1920-1943)

### Lines 1944-1976

Private cfg(test) module imports overlay/protobuf/deletion/lineage types, row-ID codec, shared fixtures, Arrow schema, exact/public version selectors, CachedFileSize and collections. tagged_sample_manifest uses sample_manifest, sets both FRI bits and builds inline history5->0; it does not write/read a persisted dataset. All tests below are source evidence, not executed verification. (rust/lance-table/src/transaction/manifest_build.rs:1944-1976)

### Lines 1977-1994

row_mutation helper selects delete fragment0 with predicate true, shared empty update transaction, or UpdateConfig with all maps absent/empty; unknown kind panics. These are small in-memory operation fixtures rather than realistic data writes. (rust/lance-table/src/transaction/manifest_build.rs:1977-1994)

### Lines 1995-2035

Five rstest cases delete/update/config/project/merge build against tagged sample. Project and Merge clone unchanged schema/fragments. Each successful build must retain a reserved-name entry with identical UUID and index_version. It does not compare Any bytes, flags, all indices or resulting fragment values in these cases; comment's broader unchanged claim exceeds the precise assertions. (rust/lance-table/src/transaction/manifest_build.rs:1995-2035)

### Lines 2036-2060

Overwrite fixture supplies Fragment::new(0), unchanged schema and no config/bases, then asserts final index list empty and reader FRI bit retained. Writer bit is not asserted here; no actual overwrite file data. Tests sticky bookkeeping after dropping tagged entry. (rust/lance-table/src/transaction/manifest_build.rs:2036-2060)

### Lines 2061-2088

Stable-ID migration test uses unchanged Merge, migration_next_row_id Some100 and default build config against tagged history. Expects Error::NotSupported and stable row id migration message, verifying gate rejection before conversion/publication. (rust/lance-table/src/transaction/manifest_build.rs:2061-2088)

### Lines 2089-2122

manifest_with_file creates live fragment0 field0/column0 V2_0 at caller path and sets paired FRI flags. translating_segment_and_entry gives id_idx bitmap{5} and history5->0. user_bitmap finds first id_idx and unwraps present bitmap clone; missing/unknown fixture would panic. No row-map IO in helpers. (rust/lance-table/src/transaction/manifest_build.rs:2089-2122)

### Lines 2123-2167

in_place_rewrite constructs update by replacing shared fixture updated_fragments with empty Fragment0 and setting fields_modified; Merge creates b.lance fragment0 with caller fields castu32->i32 and column_indices[0], unchanged schema; DataReplacement builds analogous file and target0. Unknown kind unreachable. The fixture can use shape not representing valid production files; builder tests focus coverage metadata. (rust/lance-table/src/transaction/manifest_build.rs:2123-2167)

### Lines 2168-2203

Three Update/Merge/DataReplacement cases rewrite field0 reached only through history5->0. Build must keep FRI UUID and leave id_idx bitmap empty. This asserts withdrawal of retired-source provenance instead of claiming destination; no scanner fallback or physical rows are executed. (rust/lance-table/src/transaction/manifest_build.rs:2168-2203)

### Lines 2204-2235

Three analogous cases start user bitmap{0,5}, mixing direct destination and retired source. Successful build must leave bitmap empty, preventing source provenance from rederiving stale coverage. No explicit FRI payload equality asserted in this test. (rust/lance-table/src/transaction/manifest_build.rs:2204-2235)

### Lines 2236-2281

Unwalkable lineage fixture history5->0 and6->8, user bitmap{0,5,6,7}, live{0,7,8}. TaggedLineage::new(entry,None) has no ledger; direct withdrawal of fragment0/field0 leaves{7}, removing every retired source. Decode inline ledger then repeat same withdrawal leaves{6,7}; unrelated retired source survives known graph. Direct helper test does not run full manifest build or simulate external read failure. (rust/lance-table/src/transaction/manifest_build.rs:2236-2281)

### Lines 2282-2318

Serving-sibling fixture creates live0/1 files, translating id_idx{5}, independent same-name sibling{1} with new UUID, and other_idx unknown bitmap None. Update field0 is constructed against that manifest. Setup distinguishes empty metadata from unknown coverage and physical segments of one logical index. (rust/lance-table/src/transaction/manifest_build.rs:2282-2318)

### Lines 2319-2359

First sibling build asserts translating segment UUID/name absent, sibling bitmap unchanged and unknown segment bitmap still None. Assertions inspect selected entries rather than complete index list/FRI equality. Same-name serving sibling allows retiring emptied physical metadata; no index files deleted in this test. (rust/lance-table/src/transaction/manifest_build.rs:2319-2359)

### Lines 2360-2400

Second sibling build omits serving sibling and asserts sole translating segment remains with empty bitmap as rebuild record. Following independent test history5->0 plus6->8 starts bitmap{6}, rewrites0 and asserts{6} survives. Both are local metadata assertions, not actual translated query recall. (rust/lance-table/src/transaction/manifest_build.rs:2360-2400)

### Lines 2401-2424

Unreadable-history test sets fri.index_details=None, then performs in-place Update. Expects InvalidInput and history substring. Despite comment about noninline history, fixture specifically covers missing Any, not an external file descriptor/callback. Other external decode behavior must use separate tests. (rust/lance-table/src/transaction/manifest_build.rs:2401-2424)

### Lines 2425-2454

Six parameter cases: direct coverage for Update/Merge/DataReplacement; unindexed field for Update/Merge; off-lineage for Update. Direct sets bitmap{0}; unindexed rewrites field1 while segment indexes0; off-lineage changes history5->7. Build operation uses same in-place fixture and tagged flag; setup intentionally isolates field/lineage choices. (rust/lance-table/src/transaction/manifest_build.rs:2425-2454)

### Lines 2455-2477

All six cases require FRI UUID preserved. Direct case expects empty user bitmap; other two shapes expect original bitmap. No direct DataReplacement unindexed/off-lineage case is declared; test matrix is six selected combinations, not full3x3 Cartesian product. (rust/lance-table/src/transaction/manifest_build.rs:2455-2477)

### Lines 2478-2504

User CreateIndex test adds id_idx to tagged table, asserts it exists, then finds original FRI UUID and compares Any details and fragment bitmap exactly. It covers creation only; comment's replaced/dropped behavior is not exercised in this fixture. (rust/lance-table/src/transaction/manifest_build.rs:2478-2504)

### Lines 2505-2549

Three unsupported cases: UpdateMemWalState empty progress, bare Rewrite of covered fragment0 to10 with no FRI entry, and Rewrite with explicit index_version0 snapshot. Each must return NotSupported with Tagged FRI history maintenance. Bare uncovered rewrites are explicitly a separate supported case; this matrix does not reject every bare Rewrite. (rust/lance-table/src/transaction/manifest_build.rs:2505-2549)

### Lines 2550-2591

Two tagged-snapshot rejection cases vary whether current table is tagged. Both construct a reserved-name new entry with cleared fields and Rewrite snapshot but no prepared assembly. Build must return InvalidInput containing must be assembled, even on initially untagged table. Current tagged fixture uses metadata shape rather than complete graph IO. (rust/lance-table/src/transaction/manifest_build.rs:2550-2591)

### Lines 2592-2620

Sticky-flag-only manifest with no current index attempts v0 reserved snapshot Rewrite. Expects InvalidInput and sticky feature flag text. This pins record-form policy after entry trim; no migration or stored-history bytes are read. (rust/lance-table/src/transaction/manifest_build.rs:2592-2620)

### Lines 2621-2658

tagged_history_allows_rewrite_of_uncovered_fragments uses fragments0..6, paired FRI bits and reserved entry bitmap{0}; bare Rewrite replaces fragment5 with10 and carries no new FRI snapshot. Successful build retains some final index with original FRI UUID. It asserts neither full metadata equality nor output fragment IDs; uncovered physical rewrite is the supported counterpart to covered bare-rewrite rejection. (rust/lance-table/src/transaction/manifest_build.rs:2621-2658)

### Lines 2659-2680

out_of_range_transition_source_id_rejected passes reordered_sources a transition source u32::MAX+1, four physical rows, zero deletions, no destinations/mapping. unwrap_err message must contain row address range wording. Pins checked conversion; does not assert a particular Error variant. (rust/lance-table/src/transaction/manifest_build.rs:2659-2680)

### Lines 2681-2732

tagged_history_allows_rewrite_appending_tagged_entry supplies current reserved entry dataset_version7 and prepared FragReuseUpdate::Rewrite with new entry, base_entry_version Some7 and empty reordered_sources. Rewrite groups and rewritten indices are empty. prepare_indices_with_inputs succeeds; build_manifest_prepared must yield one reserved entry with new UUID and reader FRI bit set. Synthetic assembled intent bypasses actual transition assembly/IO; does not assert writer bit or CAS publication. (rust/lance-table/src/transaction/manifest_build.rs:2681-2732)

### Lines 2733-2777

frag_reuse_rewrite_guards_base_entry_version uses current dataset_version7 but assembled rewrite base_entry_version None. Preparation succeeds, prepared build fails InvalidInput with rebuild text. Tests Option-version mismatch, not full manifest identity/content comparison. (rust/lance-table/src/transaction/manifest_build.rs:2733-2777)

### Lines 2778-2837

Three prepare_indices_keeps_original_and_withdraws_prepared cases Update/Merge/DataReplacement rewrite field0 on live fragment0. Original translating bitmap{5} with FRI history5->0 and6->8, unrelated other_idx{6}; prepare binds manifest version, preserves entire original metadata array, empties translating prepared bitmap, preserves unrelated bitmap. build_manifest_prepared final indices must equal prepared vector exactly. No persisted index IO or scan is exercised. (rust/lance-table/src/transaction/manifest_build.rs:2778-2837)

### Lines 2838-2869

Three untagged Update/Merge/DataReplacement cases clear both FRI flags, start segment bitmap{0,3}, rewrite field0 on fragment0 and call prepare_indices only. Original entry remains exact and prepared bitmap becomes{3}; no final build is called in this test. (rust/lance-table/src/transaction/manifest_build.rs:2838-2869)

### Lines 2870-2899

prepare_indices_restore_and_non_rewrites_are_identity loops Restore(version1), empty Append, Delete(fragment0) and helper Update with no modified fields against tagged manifest+translating/FRI entries. All preparation results retain original vector. Restore here never enters build_manifest's unreachable arm; only preparation identity is asserted. (rust/lance-table/src/transaction/manifest_build.rs:2870-2899)

### Lines 2900-2940

prepare_indices_external_history_needs_the_supplied_ledger first decodes inline FRI, then removes copied entry.index_details. Preparation without ledger fails InvalidInput; supplying earlier Arc ledger succeeds and empties user bitmap. Despite test name, fixture has absent Any rather than ExternalFile descriptor: it proves caller-ledger use for missing details, not an external read or ledger identity check. (rust/lance-table/src/transaction/manifest_build.rs:2900-2940)

### Lines 2941-2978

prepare_indices_corrupt_inline_details_is_an_error retains Any type URL but replaces bytes with five0xff. Both prepare_indices and build_manifest must return CorruptFile; corruption is not treated as missing/no lineage. No external history loading is involved. (rust/lance-table/src/transaction/manifest_build.rs:2941-2978)

### Lines 2979-3007

Prepared-against-another-manifest test prepares against current then increments cloned manifest.version. build_manifest_prepared must fail InvalidInput containing prepared against. It does not test same-version changed fragments/indices, which the numeric binding alone cannot distinguish. (rust/lance-table/src/transaction/manifest_build.rs:2979-3007)

### Lines 3008-3047

build_manifest_prepared_still_runs_the_gate constructs an unassembled tagged Rewrite snapshot with changed UUID and asserts both prepare_indices and build_manifest fail with assembled by commit path text. Despite name/doc, fixture never directly invokes build_manifest_prepared; its own gate is established by runtime source593-611, not this test call sequence. (rust/lance-table/src/transaction/manifest_build.rs:3008-3047)

### Lines 3048-3057

sample_manifest_with_fragments creates a nonnullable Int32 id Arrow/Lance schema, Fragment::new for every supplied u64 range element, V2_0 storage and empty bases. Fragments contain no physical-row count or data files; this is a manifest metadata helper. (rust/lance-table/src/transaction/manifest_build.rs:3048-3057)

### Lines 3058-3092

CreateIndex same-name preservation test starts first+second vector_idx entries, adds third and removes second UUID. Final length2 must contain first/third and exclude second. Removal is UUID-specific even when names match; no data/index payload writes occur. (rust/lance-table/src/transaction/manifest_build.rs:3058-3092)

### Lines 3093-3133

CreateIndex relisted UUID test starts first+second, adds first+third and removes second. Final length2, first appears once, third present and second absent. Covers deduplication between retained old and supplied new entries, not duplicate UUIDs within the new vector. (rust/lance-table/src/transaction/manifest_build.rs:3093-3133)

### Lines 3134-3174

Update replacement/removal fixture starts IDs0..5, removes1, supplies updated2 physical42,4 physical43 and absent99. Successful final IDs[0,2,3,4] and physical counts[None,42,None,43] prove replacements of existing entries and ignoring updated ID99; new vector empty and optional mode/offset data absent. (rust/lance-table/src/transaction/manifest_build.rs:3134-3174)

### Lines 3175-3205

Projected-files Update test has three modes None/RewriteRows/RewriteColumns crossed with spilled-lineage false/true: six cases. Starts fragments0..3; spilled variant sets paired stable flags/next_row_id126, 42 physical rows each and disjoint inline ID ranges. These are in-memory fixtures, not writes. (rust/lance-table/src/transaction/manifest_build.rs:3175-3205)

### Lines 3206-3238

Projected-files fixture gives fragment1 a retained field0 V2_0 file; staged updated image also contains dropped field1. New placeholder fragment0 similarly contains field0 and field1 files, both staged physical42. Expected file vectors initially contain only projected field0 base files. (rust/lance-table/src/transaction/manifest_build.rs:3206-3238)

### Lines 3239-3269

Spilled-lineage variant sets row-ID/created/latest metadata to Column and appends three separate carrier files with reserved fields-3/-4/-5 at column0; expected vectors preserve those files. Paths lineage-{reservedid}.lance are fixtures, no hidden columns are loaded or validated against actual bytes here. (rust/lance-table/src/transaction/manifest_build.rs:3239-3269)

### Lines 3270-3296

Projected-files Update supplies staged updated/new fragments, fields_modified[1], selected mode and empty compacted/preservation vectors. Build with default config must keep only expected field0 plus optional hidden carriers in existing position1 and new position3, preserve physical42 and manifest max_field_id0. Current stable flags can remain active even when default config.use_stable_row_ids is false. (rust/lance-table/src/transaction/manifest_build.rs:3270-3296)

### Lines 3297-3358

Delete rebasing test uses current manifest version2, fragment2 projected field0 file, overlayfield0@2 and uniform latest2/physical42. Staged read-version1 image includes dropped field1 plus new Array deletion file and deletes fragments1/3. Build yields IDs0,2,4, merges deletion metadata into current fragment, preserves only projected file, current overlay@2, physical42, max_field_id0 and all latest versions2. No deletion file IO or conflict resolver is run. (rust/lance-table/src/transaction/manifest_build.rs:3297-3358)

### Lines 3359-3418

remove_tombstoned_data_files fixture gives four raw V2_0 files: fields[1,2,3], all[-2,-2,-2], mixed[4,-2,5], all[-2] with sizes1000/500/750/250. Direct helper retains normal then mixed only. This checks metadata pruning, not disk deletion; empty field lists and other negative IDs are not tested here. (rust/lance-table/src/transaction/manifest_build.rs:3359-3418)

### Lines 3419-3476

Partial RewriteColumns Update has five stable IDs/physical rows but no created/latest metadata, updates same fragment and supplies offsets{1,3}. Successful candidate must still have latest metadata None, preventing fabrication of prior versions. The fixture asserts latest only, not created metadata. (rust/lance-table/src/transaction/manifest_build.rs:3419-3476)

### Lines 3477-3533

Bitmap cardinality test uses five physical rows with uniform created/latest1 and supplies offsets0..10 to RewriteColumns Update. Build must error with cardinality substring; no Error variant is asserted. Separately bounds number of offsets before maximum-offset validation. (rust/lance-table/src/transaction/manifest_build.rs:3477-3533)

### Lines 3534-3590

Maximum-offset rejection uses five physical rows, inline IDs and uniform created/latest1; offsets{0,100} have valid cardinality2 but exceed the row bound. RewriteColumns build must fail with max offset substring; no Error variant asserted. Complements cardinality rejection without conflating the two checks. (rust/lance-table/src/transaction/manifest_build.rs:3534-3590)

### Lines 3591-3642

Exact-boundary test uses the same five-row fixture with offsets0..5 (0 through4). RewriteColumns build is expected to succeed; it does not inspect the resulting per-row version values. The boundary is maximum offset4, not an inclusive offset5. (rust/lance-table/src/transaction/manifest_build.rs:3591-3642)

### Lines 3643-3694

Offsets-key validation constructs manifest fragments1/2, updated list containing1 only and offset map keyed2. Calls validate_operation directly and requires not in updated_fragments text. Does not invoke builder; fixture's single inline ID versus physical_rows5 is incidental and not validated by this assertion. Pins API validation of target membership before unrelated lineage can be stamped. (rust/lance-table/src/transaction/manifest_build.rs:3643-3694)

### Lines 3695-3743

Protobuf offset roundtrip makes Update with bitmap map1->{1,3,5},2->{0,2,4,6}, no updated fragments. Encoding must leave legacy field9 vector-map empty and populate field10 bitmap-map with two entries. Decode must preserve both Roaring bitmaps exactly. Object conversion only; does not call operation validation, wire encode/decode or historical released fixture. (rust/lance-table/src/transaction/manifest_build.rs:3695-3743)

### Lines 3744-3787

Legacy field9-read test constructs current protobuf Transaction with only UInt32List{1,3,5} for fragment1 and empty field10. Decode must produce one bitmap yielding those ordered offsets. Its comment calls this a manifest but actual object is pb::Transaction; no historical file is loaded. (rust/lance-table/src/transaction/manifest_build.rs:3744-3787)

### Lines 3788-3835

Field10 precedence fixture serializes bitmap{10,20,30}, supplies conflicting legacy list{99,100} for same fragment1 and decodes current pb::Transaction. Result must yield field10 values exactly. Tests both-fields/same-key priority, not per-key merge when maps have disjoint keys or malformed bitmap fallback. (rust/lance-table/src/transaction/manifest_build.rs:3788-3835)

### Lines 3836-3908

Stable-ID Merge changed-files test swaps before.lance to after.lance for same ID0, five inline IDs and missing prior lineage; reader stable flag set and next_row_id100. Build candidate version2 must provide latest version2 at first/last rows. Does not assert created metadata, all rows, or actual file contents. (rust/lance-table/src/transaction/manifest_build.rs:3836-3908)

### Lines 3909-3987

Stable-ID Merge carry-forward fixture has unchanged same.lance, same row IDs, five physical rows and uniform latest1. Build preserves latest1 at first/last offsets; checks no blanket refresh for unchanged data files. Created metadata remains unasserted. (rust/lance-table/src/transaction/manifest_build.rs:3909-3987)

### Lines 3988-4054

Nonstable Merge fixture explicitly asserts no stable reader flag, then swaps before/after file for five-row fragment without IDs/lineage. Build must leave latest metadata None. Uses stable-resolved file format but table stable-row-ID feature is disabled, distinguishing file version from row identity mode. (rust/lance-table/src/transaction/manifest_build.rs:3988-4054)

### Lines 4055-4109

New-ID Merge setup has stable reader flag, manifest version1, existing fragment0 with three IDs and new fragment1 with four IDs absent from prior manifest. Both begin without created/latest metadata; next_row_id100 and stable-resolved files are metadata fixtures. (rust/lance-table/src/transaction/manifest_build.rs:4055-4109)

### Lines 4110-4148

New-ID Merge supplies both fragments and builds version2. Find ID1 and require created and latest metadata, both first/last rows at2. Establishes two lineage fields for a new fragment ID, not assignment of new row IDs or rewriting existing fragment0 lineage. (rust/lance-table/src/transaction/manifest_build.rs:4110-4148)

### Lines 4149-4214

DataOverlay multi-fragment test starts currentversion3: target0 already has overlay@3, target1 empty, untargeted2 overlay@3. Add overlays to0/1; candidateversion increases, existing0@3 stays before newly stamped overlay,1 gets stamped overlay,2 keeps original@3. Assertions count/order/versions, not on-disk overlay decoding or selected values. (rust/lance-table/src/transaction/manifest_build.rs:4149-4214)

### Lines 4215-4245

Overlay-lineage setup: fragment1 four rows with uniform created/latest1 and IDs10..13; fragment2 two rows with IDs20/21 and no lineage, representing migrated rows whose documented scan default is1. make_stable_row_id_manifest produces currentversion4; no scan is run here. (rust/lance-table/src/transaction/manifest_build.rs:4215-4245)

### Lines 4246-4306

DataOverlay applies dense row{0} plus sparse field bitmaps{2}/{3} to fragment1, dense{1} to fragment2. Build must yield latest[5,1,5,5] and[1,5], unioning all overlay coverage and initializing absent lineage with baseline1. It asserts every overlay on first result fragment stamped to candidateversion; second fragment stamps/created fields are not directly asserted. (rust/lance-table/src/transaction/manifest_build.rs:4246-4306)

### Lines 4307-4366

DataReplacement overlay tombstone test replaces legacy basefield5 exactly, alongside basefield3 and old overlay[3,5]/overlay[5] at readversion1. Candidate must contain f5-new.lance, drop all-field5 overlay and retain one overlay with raw fields[3,-2]. No row data decode; legacy partial-overlay metadata tombstoning differs from forbidden partial legacy base-file replacement. (rust/lance-table/src/transaction/manifest_build.rs:4307-4366)

### Lines 4367-4416

replace_fields helper builds nullable Int32 schema with explicit IDs3/4/5/6, one supplied fragment and selected currentversion. Stages V2_0 v-new.lance replacement for fragment0 with ordinal column indices at caller readversion, runs builder and returns cloned first result fragment. A missing/empty output would panic via indexing; helper does no IO. (rust/lance-table/src/transaction/manifest_build.rs:4367-4416)

### Lines 4417-4426

replace_field_5 is a private test convenience fixing replaced fields to[5], forwarding fragment/current/read versions to replace_fields. It does not alter conflict or format behavior. (rust/lance-table/src/transaction/manifest_build.rs:4417-4426)

### Lines 4427-4447

Legacy subset rejection fixture base[4,5] uses legacy format, stages V2 replacement of5 and requires error without asserting variant/message. Comment explains V1 page-table offset depends on first field and tombstoning a sibling can corrupt decoding; test does not read V1 pages. (rust/lance-table/src/transaction/manifest_build.rs:4427-4447)

### Lines 4448-4485

Spanning V2 replacement starts ab[3,4] and cd[5,6], replaces[4,5]. Both old files survive with respectively[3,-2] and[-2,6], and new v-new.lance must exist. Tests multi-file tombstone-and-append, but not physical-row consistency or byte values. (rust/lance-table/src/transaction/manifest_build.rs:4448-4485)

### Lines 4486-4511

Mixed-format spanning replacement uses V2 ab[3,4] and legacy cd[5,6], replaces[4,5] and requires failure. Error variant/message and external mutation rollback are not asserted; builder operates on local candidate clones. (rust/lance-table/src/transaction/manifest_build.rs:4486-4511)

### Lines 4512-4539

Repeated tombstoning fixture V2 wide[4,-2,5] replaces5, expecting retained wide[4,-2,-2] plus new file. Existing tombstone positions and column layout remain; no physical rewrite of old file. (rust/lance-table/src/transaction/manifest_build.rs:4512-4539)

### Lines 4540-4579

Newer-overlay preservation: V2 base[4,5], overlayfield5 committed7, transaction read6 against manifest7. Replacing5 follows partial-base path and must keep new base plus overlayfields[5]. Tests candidate recency semantics only; comment references conflict rebase but resolver is not invoked here. (rust/lance-table/src/transaction/manifest_build.rs:4540-4579)

### Lines 4580-4619

Project hidden-carrier setup has four physical rows, row-ID Column and created Column; d.lance holds schemafields0/1, l.lance holds reserved row-ID/created fields, both V2_0. Schemaa/b and paired stable flags make hidden lineage necessary despite absence from schema IDs. (rust/lance-table/src/transaction/manifest_build.rs:4580-4619)

### Lines 4620-4651

Project drops schemafield1, then asserts paths remain[d.lance,l.lance] and row_lineage_file for row-ID/created resolves l.lance. It preserves wider base files by intersection; does not assert rewriting raw data field lists, latest carrier or reading column bytes. (rust/lance-table/src/transaction/manifest_build.rs:4620-4651)

### Lines 4652-4686

Two DataReplacement hidden-carrier parameter cases: standalone l.lance row-ID carrier next to wide3/4/5/6, replacing3/4 leaves wide[-2,-2,5,6]; in-file carrier wide3/4/5/6/rowID replacing all userfields leaves four tombstones plus rowID. Expected ordered files include appended v-new.lance and original carrier. (rust/lance-table/src/transaction/manifest_build.rs:4652-4686)

### Lines 4687-4725

Carrier test builds V2 files with ordinal column indices and row-ID Column, runs replace_fields, asserts exact ordered(path,fields) vector and row_lineage_file resolves expected carrier. Covers metadata survival for two layouts, not hidden value contents or created/latest Column forms. (rust/lance-table/src/transaction/manifest_build.rs:4687-4725)

### Lines 4726-4764

Two missing-carrier cases Merge row-ID Column with V2 field0 only or V1[0,rowID]. Builder must fail Error::Internal with fragment0 and reserved row-ID in message. Empty column_indices are deliberate; tests carrier IDs/version, not column-index validity or actual file schema. (rust/lance-table/src/transaction/manifest_build.rs:4726-4764)

### Lines 4765-4796

Duplicate DataOverlay groups both target fragment0 with fields1 then2. Build must retain two overlays in input order with corresponding fields. Prevents last-group-wins HashMap collapse; version stamping tested elsewhere. (rust/lance-table/src/transaction/manifest_build.rs:4765-4796)

### Lines 4797-4815

Unknown-fragment overlay targets99 in samplemanifest. build_manifest error must contain does not exist. No error variant asserted; empty-group unknown-target case is not tested here. (rust/lance-table/src/transaction/manifest_build.rs:4797-4815)

### Lines 4816-4857

Nullability assertion codec test loops false/true for current pb::Project and pb::Merge, requiring decoded preserves_nullability exactly equal supplied bool. Comments connect default false to conservative legacy conflict behavior, but test invokes no resolver, absent historical wire message or builder; it validates current object mapping only. (rust/lance-table/src/transaction/manifest_build.rs:4816-4857)

### Lines 4858-4899

Nested mem_wal_index_coverage module imports parent fixtures and typed MemWAL records. user_index builds field0 metadata with given name/UUID and known bitmap, default optional payloads; mem_wal_index creates reserved metadata at version1; coverage_for loads first reserved entry and returns first requested index's generation vector, panicking if absent system/invalid Any. compacted wraps one shard/generation. These helpers manipulate metadata only. (rust/lance-table/src/transaction/manifest_build.rs:4858-4899)

### Lines 4900-4933

manifest_with constructs empty-schema/default-storage metadata for supplied fragment IDs. apply computes logical_index_segments from before, constructs read manifest, and calls production apply_mem_wal_index_coverage(after,before,Some(read state),2). It exercises exact local derivation, not whole build, migration or storage publication. (rust/lance-table/src/transaction/manifest_build.rs:4900-4933)

### Lines 4934-4955

table helper pairs one idx user segment with system metadata; progress supplies compacted shard/generation with other defaults; progress_with_catchup also records idx caught generation. These allow inconsistent old/current progress intentionally for bound tests; constructors do not assert coverage. (rust/lance-table/src/transaction/manifest_build.rs:4934-4955)

### Lines 4956-5005

Preparation-withdrawal integration starts idx{0,1}, progress5/catchup5 and Update of fragment0 field0. build_manifest_with_read_version must produce idx{1} and no catchup entry. Demonstrates before comparison uses original metadata, not already-pruned prepared vector; this test calls actual builder but no commit IO. (rust/lance-table/src/transaction/manifest_build.rs:4956-5005)

### Lines 5006-5016

Covering-read-version case replaces user UUID but covers{0,1} against readfragments{0,1}, read/current progress5. apply grants shard5. Changed identity can earn fresh credit by complete read coverage. (rust/lance-table/src/transaction/manifest_build.rs:5006-5016)

### Lines 5017-5027

Incomplete case covers{0} against read{0,1}, changed UUID and progress5; no catchup entry. Absence here means no proven position for this derivation; legacy reader interpretation depends on surrounding feature policy. (rust/lance-table/src/transaction/manifest_build.rs:5017-5027)

### Lines 5028-5049

Same-UUID bitmap shrink test starts{0,1}/catchup5, changes to{0}, read{0,1}; resulting catchup absent. Comment says whole metadata, while runtime comparison identity is UUID plus bitmap, not every IndexMetadata field. Prevents carrying a position solely because UUID stayed equal. (rust/lance-table/src/transaction/manifest_build.rs:5028-5049)

### Lines 5050-5065

Unchanged index{0} has recorded catchup2 and compacted5 but read{0,1}; derivation preserves2 and does not advance to5. Carrying old credit and proving new coverage are distinct. (rust/lance-table/src/transaction/manifest_build.rs:5050-5065)

### Lines 5066-5078

Inconsistent carried9 with committed3 is capped to3 even for unchanged fully covering index. Test documents defensive clamp in this internal derivation; it is not an API accepting/clamping invalid user configuration. (rust/lance-table/src/transaction/manifest_build.rs:5066-5078)

### Lines 5079-5090

Unchanged index with catchup9/committed9 and incomplete read coverage keeps9. Test name never lowered is conditional: preceding test establishes lowering to committed bound; here lack of fresh proof alone does not erase unchanged old credit. (rust/lance-table/src/transaction/manifest_build.rs:5079-5090)

### Lines 5091-5102

Fresh proof from read progress9 with current committed3 grants3 for covering index. Prevents a rolled-back/high read progress from exceeding live commit's bound; no actual rollback operation is executed. (rust/lance-table/src/transaction/manifest_build.rs:5091-5102)

### Lines 5103-5116

Read progress2 with current5 and covering changed index grants2 only. Complete coverage of fragments seen by transaction does not prove concurrent compaction generations after its fixed read snapshot. (rust/lance-table/src/transaction/manifest_build.rs:5103-5116)

### Lines 5117-5134

Logical idx has known full-covering sibling{0,1} plus unknown None-bitmap sibling. With progress5 and no prior catchup, derivation yields none despite known sibling union covering all required IDs. Unknown coverage blocks new proof for whole name. (rust/lance-table/src/transaction/manifest_build.rs:5117-5134)

### Lines 5135-5144

Dropping user idx while retaining system metadata with old catchup5 removes idx record. No live logical segment remains to earn/carry coverage. (rust/lance-table/src/transaction/manifest_build.rs:5135-5144)

### Lines 5145-5158

New idx absent in before, covering readfragment0 in after, gets generation5 from read/current progress. Ordinary index creation can earn credit without a prior catchup entry or separate advance operation. (rust/lance-table/src/transaction/manifest_build.rs:5145-5158)

### Lines 5159-5170

Unchanged covering index with compacted5 but no catchup record earns5. Pins self-healing metadata derivation; no reader/legacy version compatibility IO is tested. (rust/lance-table/src/transaction/manifest_build.rs:5159-5170)

### Lines 5171-5202

Two-shard proof gives merged shard4 and idle shard0 in same catchup vector. Assertions find each by UUID, allowing order variation. Zero positions remain when at least one shard is positive; all-zero entry omission is separate. (rust/lance-table/src/transaction/manifest_build.rs:5171-5202)

### Lines 5203-5217

Distinct fast/slow index names cover{0,1}/{0} against read{0,1}, progress6. fast gets6 and slow no record. Coverage proof is grouped by logical name, not shared across user indices. (rust/lance-table/src/transaction/manifest_build.rs:5203-5217)

### Lines 5218-5229

Single idx segment with bitmapNone and progress5 cannot earn credit. Complements mixed known/unknown siblings; no prior catchup supplied. (rust/lance-table/src/transaction/manifest_build.rs:5218-5229)

### Lines 5230-5239

No compaction progress/default details case compares entire after vector to untouched clone; derivation must leave all metadata unchanged. This no-op includes UUID preservation, not only missing catchup. (rust/lance-table/src/transaction/manifest_build.rs:5230-5239)

### Lines 5240-5249

No MemWAL reserved entry case contains user idx only and asserts entire vector unchanged, establishing successful no-op without creating system metadata. (rust/lance-table/src/transaction/manifest_build.rs:5240-5249)

### Lines 5250-5263

Without read state, unchanged idx/progress5/catchup5 retains generation5. Despite name nothing changes, test only compares returned catchup value; altered/removed-index withdrawal remains active without read state. (rust/lance-table/src/transaction/manifest_build.rs:5250-5263)

### Lines 5264-5279

Separate untrained name has empty bitmap; trained name covers0. Against read{0},progress10, untrained gets no record and trained gets10. A sibling with a different logical name cannot establish its coverage. (rust/lance-table/src/transaction/manifest_build.rs:5264-5279)

### Lines 5280-5318

Two-shard mixed carry/proof fixture: unchanged idx0, read compaction only advancing9, candidate compaction advancing10+quiet10, old quiet catchup7. After derivation sorted expected positions are advancing9,quiet7. Missing read-shard evidence gives zero new credit while existing unchanged quiet position remains. (rust/lance-table/src/transaction/manifest_build.rs:5280-5318)

### Lines 5319-5331

Ordinary partial reindex replaces UUID, shrinks{0,1} to{0}, retains stale system catchup5 as input. Derivation succeeds and removes idx record. Test's never blocked language is scoped to valid supplied metadata, not malformed Any errors or all possible index jobs. (rust/lance-table/src/transaction/manifest_build.rs:5319-5331)

### Lines 5332-5345

Unchanged idx with old catchup0 and incomplete read coverage remains all-zero; derivation omits the entire catchup entry rather than storing a known record at generation0. This differs from a zero shard retained alongside another positive shard. (rust/lance-table/src/transaction/manifest_build.rs:5332-5345)

### Lines 5346-5380

Two unchanged unproven shard positions8/2 with committed10 each are preserved independently; sorted vector equality prevents leakage of larger position into lagging shard. Readfragments include uncovered1, so no new proof advances either. (rust/lance-table/src/transaction/manifest_build.rs:5346-5380)

### Lines 5381-5403

Post-build narrowing test directly supplies migrated idx{0}, systemcatchup5 and invalidated name idx to withdraw_coverage_invalidated_after_build(candidateversion3). Entry must disappear. It does not execute migrate_indices or detect narrowing itself; caller supplies names. (rust/lance-table/src/transaction/manifest_build.rs:5381-5403)

### Lines 5404-5420

Metadata-only migration test changes files to Some(empty) and created_at, reports no invalidated names, and verifies catchup5 remains. The withdrawal helper trusts empty name list; this test does not prove the upstream migration's detection logic. (rust/lance-table/src/transaction/manifest_build.rs:5404-5420)

### Lines 5421-5440

Unchanged covering commit keeps reserved system index UUID equal before/after, avoiding needless cache-identity churn. Does not compare all metadata bytes; UUID assertion is explicit while equality shortcut is runtime evidence. (rust/lance-table/src/transaction/manifest_build.rs:5421-5440)

### Lines 5441-5454

No read-state changed-UUID/shrunk bitmap case invokes derivation with None and removes catchup. Missing proof does not suppress withdrawal; complements unchanged no-read retention. (rust/lance-table/src/transaction/manifest_build.rs:5441-5454)

### Lines 5455-5468

Two derivations against identical fixed read snapshot and cloned after metadata must yield equal catchup vectors. Fresh system UUIDs may differ and are not compared; test establishes accounting determinism, not byte-identical full candidates, CAS/retry safety or concurrent execution. Final braces close nested module and file tests. (rust/lance-table/src/transaction/manifest_build.rs:5455-5468)

## Interaction and interpretation limits

Source read and static analysis only. Repository builds/tests/lints were not run. Runtime helpers in covered sibling modules are linked; complete conflict resolver, table IO commit implementation, dataset call chain, external format/index/writer integrations remain pending. Tests construct current in-memory fixtures, not released historical compatibility data. No claim of full commit or format qualification.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Applying an operation to produce the next manifest.
    5 | //!
    6 | //! [`Transaction::build_manifest`] is the centre of this module and of the
    7 | //! transaction machinery generally: given the current manifest and index list, it
    8 | //! decides the new fragment list, the surviving indices and the next row id, then
    9 | //! assembles the manifest. Everything else in `super` exists to serve it -- the
   10 | //! operation vocabulary it matches on, the index rules it applies, the row version
   11 | //! metadata it stamps, the validation that runs before it.
   12 | 
   13 | use crate::feature_flags::{
   14 |     FLAG_COVERED_INDEX_METADATA, FLAG_FRAGMENT_REUSE_INDEX, FLAG_STABLE_ROW_IDS,
   15 |     apply_feature_flags, ensure_can_read_manifest, ensure_can_write_manifest,
   16 |     inherit_sticky_feature_flags,
   17 | };
   18 | use crate::format::overlay::{OverlayCoverage, TOMBSTONE_FIELD_ID};
   19 | use crate::format::{
   20 |     DataFile, DataStorageFormat, Fragment, IndexMetadata, Manifest, ManifestBuildConfig, RowIdMeta,
   21 |     overlay::DataOverlayFile,
   22 | };
   23 | use crate::io::{
   24 |     commit::CommitHandler,
   25 |     manifest::{read_manifest, read_manifest_indexes},
   26 | };
   27 | use crate::rowids::version::build_version_meta;
   28 | use crate::rowids::{read_row_ids, write_row_ids};
   29 | use crate::system_index::frag_reuse::metadata::{is_tagged, validate_flags};
   30 | use crate::system_index::frag_reuse::{FRAG_REUSE_INDEX_NAME, is_frag_reuse_index_entry};
   31 | use crate::system_index::is_system_index;
   32 | use crate::system_index::mem_wal::{
   33 |     CompactedSsTable, IndexCatchupProgress, MEM_WAL_INDEX_NAME, load_mem_wal_index_details,
   34 |     new_mem_wal_index_meta, update_mem_wal_index_compacted_sstables,
   35 | };
   36 | use crate::transaction::UpdateMode::{RewriteColumns, RewriteRows};
   37 | use crate::transaction::prepare::{FragReuseUpdate, PreparedIndices};
   38 | use crate::transaction::row_version::resolve_update_version_metadata;
   39 | use crate::transaction::update_map::apply_update_map;
   40 | use crate::transaction::validate::merge_fragment_physically_rewritten;
   41 | use crate::transaction::{
   42 |     CoverageIdentity, DataReplacementGroup, LogicalIndexSegments, Operation, ReadVersionState,
   43 |     RewriteGroup, Transaction, UpdatedFragmentOffsets,
   44 | };
   45 | use lance_core::datatypes::{
   46 |     LANCE_UNENFORCED_CLUSTERING_KEY_POSITION, LANCE_UNENFORCED_PRIMARY_KEY,
   47 |     LANCE_UNENFORCED_PRIMARY_KEY_POSITION,
   48 | };
   49 | use lance_core::utils::parse::str_is_truthy;
   50 | use lance_core::{Error, Result};
   51 | use lance_file::version::ConcreteFileVersion;
   52 | use lance_io::object_store::ObjectStore;
   53 | use object_store::path::Path;
   54 | use roaring::RoaringBitmap;
   55 | use std::collections::{BTreeMap, HashMap, HashSet};
   56 | use std::sync::Arc;
   57 | use uuid::Uuid;
   58 | 
   59 | /// Table config key that opts a table into writing clustered deletions as
   60 | /// `Range` segments (`U64Segment::Ranges`). Set it to `true` with
   61 | /// `update_config`.
   62 | ///
   63 | /// Manifests written afterwards re-encode bitmap row id segments as runs of
   64 | /// `Range` segments where that is smaller. That is the
   65 | /// existing wire format, so any version reads the result, but a reader without
   66 | /// the compact in-memory form handles thousands of segments per fragment
   67 | /// slowly. That is why it is opt-in rather than the default.
   68 | ///
   69 | /// Setting the key back to `false` only stops further conversions. Fragments
   70 | /// already written as `Range` segments keep that encoding until something else
   71 | /// rewrites their row ids (compaction, for example), so coordinate reader
   72 | /// upgrades before enabling it.
   73 | pub const RANGE_SEGMENTS_CONFIG_KEY: &str = "lance.row_ids.range_segments";
   74 | 
   75 | fn range_segments_enabled(manifest: &Manifest) -> bool {
   76 |     manifest
   77 |         .config
   78 |         .get(RANGE_SEGMENTS_CONFIG_KEY)
   79 |         .is_some_and(|value| str_is_truthy(value))
   80 | }
   81 | 
   82 | /// Re-encode inline row id sequences as runs of `Range` segments when the
   83 | /// table has opted in.
   84 | ///
   85 | /// Fragments that the previous manifest already re-encoded are left alone
   86 | /// (their inline bytes are the very same allocation), so a commit pays only
   87 | /// for the fragments it changed; enabling the key re-encodes every fragment
   88 | /// once.
   89 | fn apply_range_segments(
   90 |     manifest: &mut Manifest,
   91 |     current_manifest: Option<&Manifest>,
   92 | ) -> Result<()> {
   93 |     if !range_segments_enabled(manifest) {
   94 |         return Ok(());
   95 |     }
   96 |     let unchanged: HashMap<u64, *const u8> = current_manifest
   97 |         .filter(|current| range_segments_enabled(current))
   98 |         .map(|current| {
   99 |             current
  100 |                 .fragments
  101 |                 .iter()
  102 |                 .filter_map(|fragment| match &fragment.row_id_meta {
  103 |                     Some(RowIdMeta::Inline(data)) => Some((fragment.id, data.as_ptr())),
  104 |                     _ => None,
  105 |                 })
  106 |                 .collect()
  107 |         })
  108 |         .unwrap_or_default();
  109 |     let fragments = Arc::make_mut(&mut manifest.fragments);
  110 |     for fragment in fragments.iter_mut() {
  111 |         let Some(RowIdMeta::Inline(data)) = &fragment.row_id_meta else {
  112 |             continue;
  113 |         };
  114 |         if unchanged.get(&fragment.id) == Some(&data.as_ptr()) {
  115 |             continue;
  116 |         }
  117 |         let mut sequence = read_row_ids(&data[..])?;
  118 |         if sequence.use_range_segments() {
  119 |             fragment.row_id_meta = Some(RowIdMeta::Inline(write_row_ids(&sequence).into()));
  120 |         }
  121 |     }
  122 |     Ok(())
  123 | }
  124 | 
  125 | impl Transaction {
  126 |     pub(super) fn fragments_with_ids<'a, T>(
  127 |         new_fragments: T,
  128 |         fragment_id: &'a mut u64,
  129 |     ) -> impl Iterator<Item = Fragment> + 'a
  130 |     where
  131 |         T: IntoIterator<Item = Fragment> + 'a,
  132 |     {
  133 |         new_fragments.into_iter().map(move |mut f| {
  134 |             if f.id == 0 {
  135 |                 f.id = *fragment_id;
  136 |                 *fragment_id += 1;
  137 |             }
  138 |             f
  139 |         })
  140 |     }
  141 | 
  142 |     fn data_storage_format_from_files(
  143 |         fragments: &[Fragment],
  144 |         user_requested: Option<ConcreteFileVersion>,
  145 |     ) -> Result<DataStorageFormat> {
  146 |         // Mixed prewritten files cannot imply a default. An explicit default
  147 |         // takes precedence; finalization validates the referenced file versions.
  148 |         let version = match user_requested {
  149 |             Some(ConcreteFileVersion::V1) => {
  150 |                 // Preserve legacy creation's homogeneous-file contract.
  151 |                 if let Some(actual) = Fragment::try_infer_version(fragments)?
  152 |                     && actual != ConcreteFileVersion::V1
  153 |                 {
  154 |                     return Err(Error::invalid_input(format!(
  155 |                         "User requested data storage version ({}) does not match version in data files ({actual})",
  156 |                         ConcreteFileVersion::V1
  157 |                     )));
  158 |                 }
  159 |                 Some(ConcreteFileVersion::V1)
  160 |             }
  161 |             Some(version) => Some(version),
  162 |             None => Fragment::try_infer_version(fragments)?,
  163 |         };
  164 |         Ok(version.map(DataStorageFormat::new).unwrap_or_default())
  165 |     }
  166 | 
  167 |     pub async fn restore_old_manifest(
  168 |         object_store: &ObjectStore,
  169 |         commit_handler: &dyn CommitHandler,
  170 |         base_path: &Path,
  171 |         version: u64,
  172 |         config: &ManifestBuildConfig,
  173 |         tx_path: &str,
  174 |         current_manifest: &Manifest,
  175 |     ) -> Result<(Manifest, Vec<IndexMetadata>)> {
  176 |         let location = commit_handler
  177 |             .resolve_version_location(base_path, version, &object_store.inner)
  178 |             .await?;
  179 |         let mut manifest = read_manifest(object_store, &location.path, location.size).await?;
  180 |         // This read bypasses Dataset's feature gates. Refuse unsupported target
  181 |         // manifests before apply_feature_flags can clear their unknown bits and
  182 |         // republish the referenced files as legacy-compatible.
  183 |         ensure_can_read_manifest(&manifest)?;
  184 |         ensure_can_write_manifest(&manifest)?;
  185 |         manifest.set_timestamp(config.timestamp_nanos);
  186 |         manifest.transaction_file = Some(tx_path.to_string());
  187 |         let indices = read_manifest_indexes(object_store, &location, &manifest).await?;
  188 |         validate_flags(&manifest, &indices)?;
  189 |         manifest.max_fragment_id = manifest
  190 |             .max_fragment_id
  191 |             .max(current_manifest.max_fragment_id);
  192 |         // Row ids are a high-water mark like fragment ids: rewinding hands old ids to new rows.
  193 |         manifest.next_row_id = manifest.next_row_id.max(current_manifest.next_row_id);
  194 |         // Turning stable row ids off would revert `_rowid` to row addresses, whose
  195 |         // namespace overlaps the ids this table has already handed out.
  196 |         if current_manifest.uses_stable_row_ids() && !manifest.uses_stable_row_ids() {
  197 |             return Err(Error::invalid_input(format!(
  198 |                 "Cannot restore version {version}: stable row ids were enabled \
  199 |                  after it, and turning them back off would let row addresses \
  200 |                  collide with ids this table has already used"
  201 |             )));
  202 |         }
  203 |         inherit_sticky_feature_flags(&mut manifest, current_manifest)?;
  204 |         Ok((manifest, indices))
  205 |     }
  206 | 
  207 |     /// Every non-system logical index, mapped to what determines its coverage.
  208 |     ///
  209 |     /// A logical index may be backed by several physical segments, so "did this
  210 |     /// index change" is a question about the whole set. Sorted by UUID so the
  211 |     /// two sides compare positionally.
  212 |     pub fn logical_index_segments(indices: &[IndexMetadata]) -> LogicalIndexSegments {
  213 |         let mut by_name: LogicalIndexSegments = BTreeMap::new();
  214 |         for idx in indices.iter().filter(|idx| !is_system_index(idx)) {
  215 |             by_name
  216 |                 .entry(idx.name.clone())
  217 |                 .or_default()
  218 |                 .push(CoverageIdentity {
  219 |                     uuid: idx.uuid,
  220 |                     fragment_bitmap: idx.fragment_bitmap.clone(),
  221 |                 });
  222 |         }
  223 |         for segments in by_name.values_mut() {
  224 |             segments.sort_unstable_by_key(|segment| segment.uuid);
  225 |         }
  226 |         by_name
  227 |     }
  228 | 
  229 |     /// Apply MemWAL index-coverage rules once the final index list is known.
  230 |     ///
  231 |     /// Coverage records that a base-table index contains the rows a compaction
  232 |     /// copied in, and the WAL pod retires SSTables against it.
  233 |     ///
  234 |     /// It is derived, not reported. An index covering every fragment live at the
  235 |     /// transaction's read version holds every row compaction had copied in by
  236 |     /// then, so it is caught up to that version's `compacted_sstables`. That is
  237 |     /// the only proof available: nothing maps a generation to the fragments its
  238 |     /// rows landed in, so covering the table as the transaction read it is how
  239 |     /// an index shows it covered those rows. Fragments appended since are a
  240 |     /// later gap.
  241 |     ///
  242 |     /// Deriving rather than transmitting means no claim can go stale between
  243 |     /// inspection and commit, the answer survives rebase (`read_version` is
  244 |     /// fixed for a transaction's life), and any operation can earn coverage --
  245 |     /// an ordinary reindex that fully covers no longer has to throw its work
  246 |     /// away and wait for a repair.
  247 |     ///
  248 |     /// Only meaningful once catch-up is required, where a missing entry means
  249 |     /// "not caught up" and the SSTables stay. A legacy table reads a missing
  250 |     /// entry as "fully caught up", so this leaves it untouched rather than
  251 |     /// making the table look more covered than it is.
  252 |     pub fn apply_mem_wal_index_coverage(
  253 |         final_indices: &mut [IndexMetadata],
  254 |         segments_before: &LogicalIndexSegments,
  255 |         read_version_state: Option<ReadVersionState<'_>>,
  256 |         new_version: u64,
  257 |     ) -> Result<()> {
  258 |         let Some(pos) = final_indices
  259 |             .iter()
  260 |             .position(|idx| idx.name == MEM_WAL_INDEX_NAME)
  261 |         else {
  262 |             // The system index went away with this transaction (MemWAL disable,
  263 |             // or an overwrite). There is no coverage left to maintain.
  264 |             return Ok(());
  265 |         };
  266 | 
  267 |         let mut details = load_mem_wal_index_details(final_indices[pos].clone())?;
  268 | 
  269 |         // Nothing has ever been compacted, so no index can be behind and there
  270 |         // is no coverage to invalidate.
  271 |         if details.compacted_sstables.is_empty() && details.index_catchup.is_empty() {
  272 |             return Ok(());
  273 |         }
  274 | 
  275 |         let segments_after = Self::logical_index_segments(final_indices);
  276 |         let catchup_before = std::mem::take(&mut details.index_catchup);
  277 | 
  278 |         // Per shard: what this commit records as compacted, and the most the
  279 |         // read version may credit. Generations compacted after that read landed
  280 |         // in fragments no index under consideration has seen; the committed
  281 |         // value caps it in turn, so a read version since rolled back cannot
  282 |         // retire SSTables no live commit copied in.
  283 |         let read_details = read_version_state
  284 |             .map(|state| {
  285 |                 state
  286 |                     .indices
  287 |                     .iter()
  288 |                     .find(|idx| idx.name == MEM_WAL_INDEX_NAME)
  289 |                     .cloned()
  290 |                     .map(load_mem_wal_index_details)
  291 |                     .transpose()
  292 |             })
  293 |             .transpose()?
  294 |             .flatten();
  295 |         let shards: Vec<(Uuid, u64, u64)> = details
  296 |             .compacted_sstables
  297 |             .iter()
  298 |             .map(|committed| {
  299 |                 let at_read = read_details
  300 |                     .as_ref()
  301 |                     .and_then(|read| {
  302 |                         read.compacted_sstables
  303 |                             .iter()
  304 |                             .find(|s| s.shard_id == committed.shard_id)
  305 |                     })
  306 |                     .map_or(0, |s| s.generation);
  307 |                 (
  308 |                     committed.shard_id,
  309 |                     committed.generation,
  310 |                     at_read.min(committed.generation),
  311 |                 )
  312 |             })
  313 |             .collect();
  314 | 
  315 |         // Every fragment live when the transaction read the table. An index
  316 |         // spanning all of them holds every row compacted by then.
  317 |         let read_fragments: Option<RoaringBitmap> = read_version_state.map(|state| {
  318 |             state
  319 |                 .manifest
  320 |                 .fragments
  321 |                 .iter()
  322 |                 .map(|fragment| fragment.id as u32)
  323 |                 .collect()
  324 |         });
  325 | 
  326 |         let covers_read_version = |segments: &[CoverageIdentity]| -> bool {
  327 |             let Some(required) = read_fragments.as_ref() else {
  328 |                 return false;
  329 |             };
  330 |             if required.is_empty() {
  331 |                 // Subset-of-empty is trivially true, so this would credit every
  332 |                 // index on a table with no fragments. Refused because an empty
  333 |                 // fragment list is not only what an emptied table looks like:
  334 |                 // it is also what a manifest written before #8438 looks like,
  335 |                 // where UpdateMemWalState published no fragments at all. On
  336 |                 // such a table the SSTables are the last copy of those rows,
  337 |                 // and crediting coverage would retire them. The cost is that a
  338 |                 // genuinely emptied table keeps its SSTables.
  339 |                 return false;
  340 |             }
  341 |             let mut covered = RoaringBitmap::new();
  342 |             for segment in segments {
  343 |                 match segment.fragment_bitmap.as_ref() {
  344 |                     Some(bitmap) => covered |= bitmap,
  345 |                     // An unknown bitmap cannot be shown to cover anything.
  346 |                     None => return false,
  347 |                 }
  348 |             }
  349 |             required.is_subset(&covered)
  350 |         };
  351 | 
  352 |         let mut rebuilt: Vec<IndexCatchupProgress> = Vec::new();
  353 |         for (name, after) in segments_after.iter() {
  354 |             // Compared by [`CoverageIdentity`], not segment UUID: an Update
  355 |             // that touches an indexed field prunes a segment's fragment bitmap
  356 |             // in place while keeping its UUID, so a UUID-only comparison would
  357 |             // carry a position forward that the index no longer earns.
  358 |             let unchanged = segments_before.get(name) == Some(after);
  359 |             let carried = unchanged
  360 |                 .then(|| catchup_before.iter().find(|e| e.index_name == *name))
  361 |                 .flatten();
  362 |             let proven = covers_read_version(after);
  363 | 
  364 |             if carried.is_none() && !proven {
  365 |                 // Changed, and nothing shows the new index covers the read
  366 |                 // version. No entry: a missing one reads as "not caught up".
  367 |                 continue;
  368 |             }
  369 | 
  370 |             let generations = shards
  371 |                 .iter()
  372 |                 .map(|&(shard_id, committed, creditable)| {
  373 |                     let prior = carried
  374 |                         .and_then(|entry| entry.caught_up_generation_for_shard(&shard_id))
  375 |                         .unwrap_or(0);
  376 |                     let credited = if proven { creditable } else { 0 };
  377 |                     // Takes the better of what this commit proves and what an
  378 |                     // unchanged index already held, so a commit reading an older
  379 |                     // version does not lower a position it cannot re-prove. The
  380 |                     // clamp is the exception: a position above what this commit
  381 |                     // records as compacted describes rows no live commit copied
  382 |                     // in.
  383 |                     CompactedSsTable::new(shard_id, prior.max(credited).min(committed))
  384 |                 })
  385 |                 .collect::<Vec<_>>();
  386 |             if generations.iter().all(|g| g.generation == 0) {
  387 |                 continue;
  388 |             }
  389 |             rebuilt.push(IndexCatchupProgress::new(name.clone(), generations));
  390 |         }
  391 |         rebuilt.sort_by(|a, b| a.index_name.cmp(&b.index_name));
  392 | 
  393 |         let mut before_sorted = catchup_before;
  394 |         before_sorted.sort_by(|a, b| a.index_name.cmp(&b.index_name));
  395 |         if rebuilt == before_sorted {
  396 |             return Ok(());
  397 |         }
  398 | 
  399 |         let dropped: Vec<&str> = before_sorted
  400 |             .iter()
  401 |             .map(|e| e.index_name.as_str())
  402 |             .filter(|name| !rebuilt.iter().any(|kept| kept.index_name == *name))
  403 |             .collect();
  404 |         if !dropped.is_empty() {
  405 |             // The first thing to check when SSTables stop becoming trimmable.
  406 |             log::info!(
  407 |                 "MemWAL index catch-up invalidated at version {new_version} for {dropped:?}: \
  408 |                  these indices changed and no longer cover the version this commit read"
  409 |             );
  410 |         }
  411 | 
  412 |         details.index_catchup = rebuilt;
  413 |         final_indices[pos] = new_mem_wal_index_meta(new_version, details)?;
  414 |         Ok(())
  415 |     }
  416 | 
  417 |     /// Drop coverage for indices a post-`build_manifest` step narrowed.
  418 |     ///
  419 |     /// The derivation runs while the manifest is being built, but the index list
  420 |     /// is not final there: `migrate_indices` can recalculate a segment's
  421 |     /// fragment bitmap and keep its UUID, so an index can narrow after its
  422 |     /// position was decided. It reports which ones it touched rather than the
  423 |     /// caller re-snapshotting every bitmap to find out. Only ever removes.
  424 |     pub fn withdraw_coverage_invalidated_after_build(
  425 |         indices: &mut [IndexMetadata],
  426 |         changed: &[String],
  427 |         new_version: u64,
  428 |     ) -> Result<()> {
  429 |         if changed.is_empty() {
  430 |             return Ok(());
  431 |         }
  432 |         let Some(pos) = indices
  433 |             .iter()
  434 |             .position(|idx| idx.name == MEM_WAL_INDEX_NAME)
  435 |         else {
  436 |             return Ok(());
  437 |         };
  438 |         let mut details = load_mem_wal_index_details(indices[pos].clone())?;
  439 |         let before = details.index_catchup.len();
  440 |         details
  441 |             .index_catchup
  442 |             .retain(|entry| !changed.contains(&entry.index_name));
  443 |         if details.index_catchup.len() == before {
  444 |             return Ok(());
  445 |         }
  446 |         log::info!(
  447 |             "MemWAL index catch-up withdrawn at version {new_version} for {changed:?}: \
  448 |              these indices were recalculated after their coverage was derived"
  449 |         );
  450 |         indices[pos] = new_mem_wal_index_meta(new_version, details)?;
  451 |         Ok(())
  452 |     }
  453 | 
  454 |     /// Step one of a commit attempt: what the operation settles about the
  455 |     /// index list, computed against the manifest current at the attempt.
  456 |     ///
  457 |     /// Runs the tagged-table write gate (`system_index::frag_reuse::gate`)
  458 |     /// before anything is derived, keeps `current_indices` as the original
  459 |     /// list, and derives the prepared list: on an in-place column rewrite
  460 |     /// (an update with `fields_modified`, a merge swapping a column's data
  461 |     /// file, a data replacement) the coverage it invalidates is withdrawn
  462 |     /// along a tagged fragment reuse history or pruned by fragment id on any
  463 |     /// other table (`withdraw_in_place_rewrites`). Every other operation
  464 |     /// prepares the list unchanged; `Restore` never reaches the builder and
  465 |     /// restores its snapshot's list whole.
  466 |     ///
  467 |     /// `frag_reuse_ledger` is the decoded history of the current entry when
  468 |     /// the caller read it (the commit path decodes it once per attempt for
  469 |     /// the operations above); without it an inline history is decoded from
  470 |     /// the entry and an external one is refused, so a commit never guesses
  471 |     /// at the lineage. A history that does not decode is an error, never
  472 |     /// treated as "no lineage". `frag_reuse` is what the commit path settled
  473 |     /// about the entry itself.
  474 |     pub fn prepare_indices(
  475 |         &self,
  476 |         current_manifest: Option<&Manifest>,
  477 |         current_indices: Vec<IndexMetadata>,
  478 |         config: &ManifestBuildConfig,
  479 |         frag_reuse_ledger: Option<Arc<crate::system_index::frag_reuse::ledger::FragReuseLedger>>,
  480 |         frag_reuse: FragReuseUpdate,
  481 |     ) -> Result<PreparedIndices> {
  482 |         crate::system_index::frag_reuse::gate::classify(
  483 |             &self.operation,
  484 |             current_manifest,
  485 |             &current_indices,
  486 |             &frag_reuse,
  487 |             config.migration_next_row_id,
  488 |         )?;
  489 |         let mut prepared = current_indices.clone();
  490 |         if let Some(manifest) = current_manifest {
  491 |             let rewrites = Self::rewritten_physical_columns(
  492 |                 &self.operation,
  493 |                 &manifest.schema,
  494 |                 &manifest.fragments,
  495 |             );
  496 |             if !rewrites.is_empty() {
  497 |                 let lineage =
  498 |                     crate::system_index::frag_reuse::lineage::TaggedLineage::from_indices_with_ledger(
  499 |                         &current_indices,
  500 |                         frag_reuse_ledger,
  501 |                     )?;
  502 |                 let live: RoaringBitmap = manifest
  503 |                     .fragments
  504 |                     .iter()
  505 |                     .filter_map(|fragment| u32::try_from(fragment.id).ok())
  506 |                     .collect();
  507 |                 Self::withdraw_in_place_rewrites(
  508 |                     &mut prepared,
  509 |                     rewrites,
  510 |                     &manifest.schema,
  511 |                     &live,
  512 |                     lineage.as_ref(),
  513 |                 );
  514 |             }
  515 |         }
  516 |         Ok(PreparedIndices::new(
  517 |             current_manifest.map(|manifest| manifest.version),
  518 |             current_indices,
  519 |             prepared,
  520 |             frag_reuse,
  521 |         ))
  522 |     }
  523 | 
  524 |     /// Create a new manifest from the current manifest and the transaction.
  525 |     ///
  526 |     /// `current_manifest` should only be None if the dataset does not yet exist.
  527 |     pub fn build_manifest(
  528 |         &self,
  529 |         current_manifest: Option<&Manifest>,
  530 |         current_indices: Vec<IndexMetadata>,
  531 |         transaction_file_path: &str,
  532 |         config: &ManifestBuildConfig,
  533 |     ) -> Result<(Manifest, Vec<IndexMetadata>)> {
  534 |         self.build_manifest_with_read_version(
  535 |             current_manifest,
  536 |             current_indices,
  537 |             transaction_file_path,
  538 |             config,
  539 |             None,
  540 |         )
  541 |     }
  542 | 
  543 |     /// [`Self::build_manifest`] with the version this transaction read.
  544 |     ///
  545 |     /// Supplied by the commit path, which already materializes that version.
  546 |     /// `None` where there is none to read -- dataset creation and detached
  547 |     /// commits -- in which case no index can be shown to cover it and coverage
  548 |     /// is left as the invalidation rules put it.
  549 |     ///
  550 |     /// Prepares the index list itself with nothing settled about the
  551 |     /// fragment reuse entry and no history read, so it stays safe on its
  552 |     /// own: a tagged entry on a `Rewrite` or a `CreateIndex` touching a
  553 |     /// tagged entry is refused, an inline history is decoded from the entry
  554 |     /// and an external one is refused. The commit path prepares first
  555 |     /// (`prepare_indices`) and builds with `build_manifest_prepared`.
  556 |     pub fn build_manifest_with_read_version(
  557 |         &self,
  558 |         current_manifest: Option<&Manifest>,
  559 |         current_indices: Vec<IndexMetadata>,
  560 |         transaction_file_path: &str,
  561 |         config: &ManifestBuildConfig,
  562 |         read_version_state: Option<ReadVersionState<'_>>,
  563 |     ) -> Result<(Manifest, Vec<IndexMetadata>)> {
  564 |         let prepared = self.prepare_indices(
  565 |             current_manifest,
  566 |             current_indices,
  567 |             config,
  568 |             None,
  569 |             FragReuseUpdate::None,
  570 |         )?;
  571 |         self.build_manifest_prepared(
  572 |             current_manifest,
  573 |             prepared,
  574 |             transaction_file_path,
  575 |             config,
  576 |             read_version_state,
  577 |         )
  578 |     }
  579 | 
  580 |     /// Build the next manifest from a prepared index list
  581 |     /// (`prepare_indices`): the builder applies the operation to the
  582 |     /// prepared list and publishes only the final list; the original list
  583 |     /// is what MemWAL coverage is compared against. The prepared result must
  584 |     /// have been derived against `current_manifest`.
  585 |     pub fn build_manifest_prepared(
  586 |         &self,
  587 |         current_manifest: Option<&Manifest>,
  588 |         prepared: PreparedIndices,
  589 |         transaction_file_path: &str,
  590 |         config: &ManifestBuildConfig,
  591 |         read_version_state: Option<ReadVersionState<'_>>,
  592 |     ) -> Result<(Manifest, Vec<IndexMetadata>)> {
  593 |         if prepared.manifest_version() != current_manifest.map(|manifest| manifest.version) {
  594 |             return Err(Error::invalid_input(format!(
  595 |                 "the index list was prepared against manifest version {:?} but the manifest \
  596 |                  being built on is at version {:?}; every commit attempt prepares against the \
  597 |                  manifest it builds on",
  598 |                 prepared.manifest_version(),
  599 |                 current_manifest.map(|manifest| manifest.version)
  600 |             )));
  601 |         }
  602 |         // The tagged-table write gate, run again at this chokepoint (it is
  603 |         // pure) so a build cannot skip it whatever prepared the list.
  604 |         crate::system_index::frag_reuse::gate::classify(
  605 |             &self.operation,
  606 |             current_manifest,
  607 |             prepared.original(),
  608 |             prepared.frag_reuse_update(),
  609 |             config.migration_next_row_id,
  610 |         )?;
  611 |         let (original_indices, prepared_indices, frag_reuse) = prepared.into_parts();
  612 |         if config.use_stable_row_ids
  613 |             && config.migration_next_row_id.is_none()
  614 |             && current_manifest
  615 |                 .map(|m| !m.uses_stable_row_ids())
  616 |                 .unwrap_or_default()
  617 |         {
  618 |             return Err(Error::not_supported_source(
  619 |                 "This dataset was not created with the stable row ids feature.  Please run `migrate_to_stable_row_ids` before attempting to use stable row ids".into(),
  620 |             ));
  621 |         }
  622 | 
  623 |         // The fragment-reuse index is internal bookkeeping registered by
  624 |         // compaction with deferred index remap, not something a user can
  625 |         // meaningfully drop and recreate, so it must not gate the migration.
  626 |         // It is dropped from the migrated manifest below, which is what makes
  627 |         // ignoring it here safe. Every other index, including the MemWAL
  628 |         // index, still blocks: only the fragment-reuse index is known to be
  629 |         // discardable.
  630 |         let blocking_indices: Vec<&str> = original_indices
  631 |             .iter()
  632 |             .filter(|idx| idx.name != FRAG_REUSE_INDEX_NAME)
  633 |             .map(|idx| idx.name.as_str())
  634 |             .collect();
  635 |         if config.migration_next_row_id.is_some() && !blocking_indices.is_empty() {
  636 |             return Err(Error::invalid_input(format!(
  637 |                 "Cannot migrate to stable row IDs while indexes exist on the dataset. \
  638 |                  Drop the following indexes first, then re-run the migration, and \
  639 |                  recreate them afterwards: {}",
  640 |                 blocking_indices.join(", ")
  641 |             )));
  642 |         }
  643 |         let mut reference_paths = match current_manifest {
  644 |             Some(m) => m.base_paths.clone(),
  645 |             None => HashMap::new(),
  646 |         };
  647 | 
  648 |         if let Operation::Overwrite {
  649 |             initial_bases: Some(initial_bases),
  650 |             ..
  651 |         } = &self.operation
  652 |         {
  653 |             if current_manifest.is_none() {
  654 |                 // CREATE mode: registering base paths
  655 |                 // Base IDs should have been assigned during write operation
  656 |                 // Validate uniqueness and insert them into the manifest
  657 |                 for base_path in initial_bases.iter() {
  658 |                     if reference_paths.contains_key(&base_path.id) {
  659 |                         return Err(Error::invalid_input(format!(
  660 |                             "Duplicate base path ID {} detected. Base path IDs must be unique.",
  661 |                             base_path.id
  662 |                         )));
  663 |                     }
  664 |                     reference_paths.insert(base_path.id, base_path.clone());
  665 |                 }
  666 |             } else {
  667 |                 // OVERWRITE mode with initial_bases should have been rejected by validation
  668 |                 // This branch should never be reached
  669 |                 return Err(Error::invalid_input(
  670 |                     "OVERWRITE mode cannot register new bases. This should have been caught by validation.",
  671 |                 ));
  672 |             }
  673 |         }
  674 | 
  675 |         // Get the schema and the final fragment list
  676 |         let mut schema = match self.operation {
  677 |             Operation::Overwrite { ref schema, .. } => schema.clone(),
  678 |             Operation::Merge { ref schema, .. } => schema.clone(),
  679 |             Operation::Project { ref schema, .. } => schema.clone(),
  680 |             _ => {
  681 |                 if let Some(current_manifest) = current_manifest {
  682 |                     current_manifest.schema.clone()
  683 |                 } else {
  684 |                     return Err(Error::internal(
  685 |                         "Cannot create a new dataset without a schema".to_string(),
  686 |                     ));
  687 |                 }
  688 |             }
  689 |         };
  690 | 
  691 |         // Fragment ids are a high water mark for the whole dataset history: an id
  692 |         // must never name two different sets of rows, or per-fragment state keyed
  693 |         // by id (caches, deletion files, row addresses) can be attributed to the
  694 |         // wrong rows.
  695 |         let mut fragment_id = current_manifest
  696 |             .and_then(|m| m.max_fragment_id())
  697 |             .map(|id| id + 1)
  698 |             .unwrap_or(0);
  699 |         let mut final_fragments = Vec::new();
  700 |         let mut final_indices = prepared_indices;
  701 | 
  702 |         // Release builds refuse to publish a stable-row-id dataset with a fragment
  703 |         // reuse index, and nothing needs it: compaction rejects deferred index
  704 |         // remap there.
  705 |         if config.migration_next_row_id.is_some() {
  706 |             final_indices.retain(|idx| idx.name != FRAG_REUSE_INDEX_NAME);
  707 |         }
  708 | 
  709 |         // The original list, as read from the current manifest and before
  710 |         // any preparation, so coverage can be compared against what each
  711 |         // logical index looked like going in. Only tables with a MemWAL
  712 |         // index maintain coverage, so every other commit -- and the segment
  713 |         // clones this costs -- pays nothing.
  714 |         let mem_wal_segments_before = original_indices
  715 |             .iter()
  716 |             .any(|idx| idx.name == MEM_WAL_INDEX_NAME)
  717 |             .then(|| Self::logical_index_segments(&original_indices));
  718 |         drop(original_indices);
  719 | 
  720 |         let mut next_row_id = {
  721 |             // Only use row ids if the feature flag is set already, or this is
  722 |             // a migration activation that explicitly provides the next_row_id.
  723 |             match (current_manifest, config.use_stable_row_ids) {
  724 |                 (Some(manifest), _) if manifest.reader_feature_flags & FLAG_STABLE_ROW_IDS != 0 => {
  725 |                     Some(manifest.next_row_id)
  726 |                 }
  727 |                 (None, true) => Some(0),
  728 |                 (_, false) => None,
  729 |                 (Some(_), true) => {
  730 |                     // Migration activation: use the provided next_row_id.
  731 |                     if let Some(migration_nri) = config.migration_next_row_id {
  732 |                         Some(migration_nri)
  733 |                     } else {
  734 |                         return Err(Error::not_supported_source(
  735 |                             "This dataset was not created with the stable row ids feature.  Please run `migrate_to_stable_row_ids` before attempting to use stable row ids".into(),
  736 |                         ));
  737 |                     }
  738 |                 }
  739 |             }
  740 |         };
  741 | 
  742 |         let maybe_existing_fragments =
  743 |             current_manifest
  744 |                 .map(|m| m.fragments.as_ref())
  745 |                 .ok_or_else(|| {
  746 |                     Error::internal(format!(
  747 |                         "No current manifest was provided while building manifest for operation {}",
  748 |                         self.operation.name()
  749 |                     ))
  750 |                 });
  751 | 
  752 |         let new_version = current_manifest.map_or(1, |m| m.version + 1);
  753 | 
  754 |         match &self.operation {
  755 |             Operation::Clone { .. } => {
  756 |                 return Err(Error::internal(
  757 |                     "Clone operation should not enter build_manifest.".to_string(),
  758 |                 ));
  759 |             }
  760 |             Operation::Append { fragments } => {
  761 |                 final_fragments.extend(maybe_existing_fragments?.clone());
  762 |                 let mut new_fragments =
  763 |                     Self::fragments_with_ids(fragments.clone(), &mut fragment_id)
  764 |                         .collect::<Vec<_>>();
  765 |                 if let Some(next_row_id) = &mut next_row_id {
  766 |                     Self::assign_row_ids(next_row_id, new_fragments.as_mut_slice())?;
  767 |                     // Add version metadata for all new fragments
  768 |                     for fragment in new_fragments.iter_mut() {
  769 |                         let version_meta = build_version_meta(fragment, new_version);
  770 |                         fragment.last_updated_at_version_meta = version_meta.clone();
  771 |                         fragment.created_at_version_meta = version_meta;
  772 |                     }
  773 |                 }
  774 |                 final_fragments.extend(new_fragments);
  775 |             }
  776 |             Operation::Delete {
  777 |                 updated_fragments,
  778 |                 deleted_fragment_ids,
  779 |                 ..
  780 |             } => {
  781 |                 // Remove the deleted fragments
  782 |                 // Hash lookups keep this linear on tables with many fragments.
  783 |                 let deleted_ids: HashSet<u64> = deleted_fragment_ids.iter().copied().collect();
  784 |                 let updated_by_id: HashMap<u64, &Fragment> =
  785 |                     updated_fragments.iter().map(|f| (f.id, f)).collect();
  786 |                 final_fragments.extend(maybe_existing_fragments?.clone());
  787 |                 final_fragments.retain(|f| !deleted_ids.contains(&f.id));
  788 |                 final_fragments.iter_mut().for_each(|f| {
  789 |                     if let Some(updated) = updated_by_id.get(&f.id) {
  790 |                         // The post-image was built at the transaction's read
  791 |                         // version. Only its deletion file is new; retain all
  792 |                         // other state from the current fragment when rebasing.
  793 |                         f.deletion_file = updated.deletion_file.clone();
  794 |                     }
  795 |                 });
  796 |                 Self::retain_relevant_indices(&mut final_indices, &schema, &final_fragments)
  797 |             }
  798 |             Operation::Update {
  799 |                 removed_fragment_ids,
  800 |                 updated_fragments,
  801 |                 new_fragments,
  802 |                 fields_modified,
  803 |                 compacted_sstables,
  804 |                 fields_for_preserving_frag_bitmap,
  805 |                 update_mode,
  806 |                 updated_fragment_offsets,
  807 |                 ..
  808 |             } => {
  809 |                 // Extract existing fragments once for reuse
  810 |                 let existing_fragments = maybe_existing_fragments?;
  811 | 
  812 |                 // Apply updates to existing fragments
  813 |                 // Hash lookups keep this linear on tables with many fragments.
  814 |                 let removed_ids: HashSet<u64> = removed_fragment_ids.iter().copied().collect();
  815 |                 let mut updated_by_id: HashMap<u64, &Fragment> =
  816 |                     HashMap::with_capacity(updated_fragments.len());
  817 |                 for fragment in updated_fragments {
  818 |                     updated_by_id.entry(fragment.id).or_insert(fragment);
  819 |                 }
  820 |                 let live_field_ids = schema
  821 |                     .fields_pre_order()
  822 |                     .map(|field| field.id)
  823 |                     .collect::<HashSet<_>>();
  824 |                 let updated_frags: Vec<Fragment> = existing_fragments
  825 |                     .iter()
  826 |                     .filter_map(|f| {
  827 |                         if removed_ids.contains(&f.id) {
  828 |                             return None;
  829 |                         }
  830 |                         if let Some(&updated) = updated_by_id.get(&f.id) {
  831 |                             let mut updated = updated.clone();
  832 |                             // Carry forward the fragment's current overlays (which
  833 |                             // may include ones added by a concurrent commit). An
  834 |                             // in-place column rewrite then tombstones the overlaid
  835 |                             // fields it rewrote, since the fresh base values
  836 |                             // supersede them.
  837 |                             updated.overlays = f.overlays.clone();
  838 |                             // A concurrent Project may have pruned files from the
  839 |                             // current fragment after this post-image was staged.
  840 |                             // Spilled lineage fields are absent from the schema,
  841 |                             // but their carriers must survive just as in Project.
  842 |                             let spilled = updated.spilled_row_lineage_field_ids();
  843 |                             updated.files.retain(|file| {
  844 |                                 file.fields.iter().any(|field_id| {
  845 |                                     live_field_ids.contains(field_id) || spilled.contains(field_id)
  846 |                                 })
  847 |                             });
  848 |                             if matches!(update_mode, Some(RewriteColumns)) {
  849 |                                 crate::format::overlay::tombstone_overlay_fields(
  850 |                                     &mut updated.overlays,
  851 |                                     fields_modified,
  852 |                                 );
  853 |                             }
  854 |                             Some(updated)
  855 |                         } else {
  856 |                             Some(f.clone())
  857 |                         }
  858 |                     })
  859 |                     .collect();
  860 | 
  861 |                 // Update version metadata for updated fragments if stable row IDs are enabled
  862 |                 // Note: We don't update version metadata for fragments with deletion vectors
  863 |                 // because the version sequences are indexed by physical row position, not logical position.
  864 |                 // Version metadata for deleted rows will be filtered out during scan using the deletion vector.
  865 |                 if next_row_id.is_some() {
  866 |                     // Version metadata will be properly set during compaction when deletions are materialized
  867 |                 }
  868 | 
  869 |                 final_fragments.extend(updated_frags);
  870 | 
  871 |                 if next_row_id.is_some()
  872 |                     && matches!(update_mode, Some(RewriteColumns))
  873 |                     && let Some(UpdatedFragmentOffsets(off_map)) = updated_fragment_offsets
  874 |                     && !off_map.is_empty()
  875 |                 {
  876 |                     let prev_version = current_manifest.map(|m| m.version).unwrap_or(0);
  877 |                     for fragment in final_fragments.iter_mut() {
  878 |                         let Some(bitmap) = off_map.get(&fragment.id) else {
  879 |                             continue;
  880 |                         };
  881 |                         // Defense-in-depth: only stamp fragments that were actually
  882 |                         // rewritten. validate_operation enforces this invariant before
  883 |                         // build_manifest is called; this guard catches any path that
  884 |                         // bypasses validation.
  885 |                         if !updated_by_id.contains_key(&fragment.id) {
  886 |                             continue;
  887 |                         }
  888 |                         if bitmap.is_empty() {
  889 |                             continue;
  890 |                         }
  891 |                         // Skip fragments with no existing version metadata: the helper
  892 |                         // would fill unmatched rows with prev_version, fabricating a
  893 |                         // last_updated stamp for rows that never had one.
  894 |                         if fragment.last_updated_at_version_meta.is_none() {
  895 |                             continue;
  896 |                         }
  897 |                         let max_allowed = existing_fragments
  898 |                             .iter()
  899 |                             .find(|f| f.id == fragment.id)
  900 |                             .and_then(|f| f.physical_rows)
  901 |                             .unwrap_or(1 << 24);
  902 |                         if bitmap.len() as usize > max_allowed {
  903 |                             return Err(Error::invalid_input(format!(
  904 |                                 "updatedFragmentOffsets cardinality {} exceeds fragment {} limit {}",
  905 |                                 bitmap.len(),
  906 |                                 fragment.id,
  907 |                                 max_allowed
  908 |                             )));
  909 |                         }
  910 |                         if let Some(max_off) = bitmap.max()
  911 |                             && max_off as usize >= max_allowed
  912 |                         {
  913 |                             return Err(Error::invalid_input(format!(
  914 |                                 "updatedFragmentOffsets max offset {} exceeds fragment {} limit {}",
  915 |                                 max_off, fragment.id, max_allowed
  916 |                             )));
  917 |                         }
  918 |                         let offsets: Vec<usize> = bitmap.iter().map(|o| o as usize).collect();
  919 |                         crate::rowids::version::refresh_row_latest_update_meta_for_partial_frag_rewrite_cols(
  920 |                             fragment,
  921 |                             &offsets,
  922 |                             new_version,
  923 |                             prev_version,
  924 |                             &config.spilled_row_lineage,
  925 |                         )?;
  926 |                     }
  927 |                 }
  928 | 
  929 |                 // The fragments whose indexed fields were rewritten were
  930 |                 // withdrawn from their indices by `prepare_indices`.
  931 | 
  932 |                 let mut new_fragments =
  933 |                     Self::fragments_with_ids(new_fragments.clone(), &mut fragment_id)
  934 |                         .collect::<Vec<_>>();
  935 |                 // New fragments were staged against the same pre-Project schema.
  936 |                 for fragment in &mut new_fragments {
  937 |                     let spilled = fragment.spilled_row_lineage_field_ids();
  938 |                     fragment.files.retain(|file| {
  939 |                         file.fields.iter().any(|field_id| {
  940 |                             live_field_ids.contains(field_id) || spilled.contains(field_id)
  941 |                         })
  942 |                     });
  943 |                 }
  944 | 
  945 |                 // Assign row IDs to any fragments that don't have them yet
  946 |                 // (e.g., inserted rows from merge_insert operations)
  947 |                 if let Some(next_row_id) = &mut next_row_id {
  948 |                     Self::assign_row_ids(next_row_id, new_fragments.as_mut_slice())?;
  949 |                 }
  950 | 
  951 |                 if next_row_id.is_some() {
  952 |                     resolve_update_version_metadata(
  953 |                         existing_fragments,
  954 |                         new_fragments.as_mut_slice(),
  955 |                         new_version,
  956 |                         &config.spilled_row_lineage,
  957 |                     )?;
  958 |                 }
  959 | 
  960 |                 if config.use_stable_row_ids
  961 |                     && update_mode.is_some()
  962 |                     && *update_mode == Some(RewriteRows)
  963 |                 {
  964 |                     let pure_updated_frag_ids =
  965 |                         Self::collect_pure_rewrite_row_update_frags_ids(&new_fragments)?;
  966 | 
  967 |                     // collect all the original frag ids that contains the updated rows
  968 |                     let original_fragment_ids: Vec<u64> = removed_fragment_ids
  969 |                         .iter()
  970 |                         .chain(updated_fragments.iter().map(|f| &f.id))
  971 |                         .copied()
  972 |                         .collect();
  973 | 
  974 |                     // The original fragments that carried an overlay: their moved rows may have a
  975 |                     // stale index entry (see `register_pure_rewrite_rows_update_frags_in_indices`).
  976 |                     // Reuse the hash lookups built above instead of scanning
  977 |                     // `original_fragment_ids` per fragment.
  978 |                     let original_overlaid_frags: HashMap<u32, &Fragment> = existing_fragments
  979 |                         .iter()
  980 |                         .filter(|f| {
  981 |                             (removed_ids.contains(&f.id) || updated_by_id.contains_key(&f.id))
  982 |                                 && !f.overlays.is_empty()
  983 |                         })
  984 |                         .map(|f| (f.id as u32, f))
  985 |                         .collect();
  986 | 
  987 |                     Self::register_pure_rewrite_rows_update_frags_in_indices(
  988 |                         &mut final_indices,
  989 |                         &pure_updated_frag_ids,
  990 |                         &original_fragment_ids,
  991 |                         fields_for_preserving_frag_bitmap,
  992 |                         &original_overlaid_frags,
  993 |                         &schema,
  994 |                     )?;
  995 |                 }
  996 | 
  997 |                 if let Some(next_row_id) = &mut next_row_id {
  998 |                     Self::assign_row_ids(next_row_id, new_fragments.as_mut_slice())?;
  999 |                     // Note: Version metadata is already set above (lines 1627-1755)
 1000 |                     // for Update operations, preserving created_at from original fragments.
 1001 |                     // Don't overwrite it here.
 1002 |                 }
 1003 |                 // Identify fragments that were updated or newly created in this update
 1004 |                 let mut target_ids: HashSet<u64> = HashSet::new();
 1005 |                 target_ids.extend(new_fragments.iter().map(|f| f.id));
 1006 |                 final_fragments.extend(new_fragments);
 1007 |                 Self::retain_relevant_indices(&mut final_indices, &schema, &final_fragments);
 1008 | 
 1009 |                 if !compacted_sstables.is_empty() {
 1010 |                     update_mem_wal_index_compacted_sstables(
 1011 |                         &mut final_indices,
 1012 |                         new_version,
 1013 |                         compacted_sstables.clone(),
 1014 |                     )?;
 1015 |                 }
 1016 |             }
 1017 |             Operation::Overwrite { fragments, .. } => {
 1018 |                 // Every fragment in an overwrite is newly written, so all of them
 1019 |                 // take fresh ids regardless of the id they arrive with. Fragments
 1020 |                 // carried over from the dataset being replaced are rejected by
 1021 |                 // `validate_operation`, which is what makes ignoring the incoming
 1022 |                 // id safe here.
 1023 |                 let mut new_fragments = fragments.clone();
 1024 |                 for fragment in new_fragments.iter_mut() {
 1025 |                     fragment.id = fragment_id;
 1026 |                     fragment_id += 1;
 1027 |                 }
 1028 |                 if let Some(next_row_id) = &mut next_row_id {
 1029 |                     Self::assign_row_ids(next_row_id, new_fragments.as_mut_slice())?;
 1030 |                     // Add version metadata for all new fragments
 1031 |                     for fragment in new_fragments.iter_mut() {
 1032 |                         let version_meta = build_version_meta(fragment, new_version);
 1033 |                         fragment.last_updated_at_version_meta = version_meta.clone();
 1034 |                         fragment.created_at_version_meta = version_meta;
 1035 |                     }
 1036 |                 }
 1037 |                 final_fragments.extend(new_fragments);
 1038 |                 final_indices = Vec::new();
 1039 |             }
 1040 |             Operation::Rewrite {
 1041 |                 groups,
 1042 |                 rewritten_indices,
 1043 |                 frag_reuse_index,
 1044 |             } => {
 1045 |                 final_fragments.extend(maybe_existing_fragments?.clone());
 1046 |                 let current_version = current_manifest.map(|m| m.version).unwrap_or_default();
 1047 |                 Self::handle_rewrite_fragments(
 1048 |                     &mut final_fragments,
 1049 |                     groups,
 1050 |                     &mut fragment_id,
 1051 |                     current_version,
 1052 |                     next_row_id.as_ref(),
 1053 |                 )?;
 1054 | 
 1055 |                 // Groups covered by the stable-partition transitions
 1056 |                 // redistribute rows across their destinations, so index
 1057 |                 // bitmaps must not follow them: the retired source ids stay
 1058 |                 // in the bitmaps as provenance and the tagged fragment reuse
 1059 |                 // entry records the row-level translation. Only the
 1060 |                 // order-preserving groups take part in bitmap maintenance
 1061 |                 // below.
 1062 |                 let assembly = match &frag_reuse {
 1063 |                     FragReuseUpdate::Rewrite(assembly) => Some(assembly.as_ref()),
 1064 |                     _ => None,
 1065 |                 };
 1066 |                 let ordered_groups = Self::ordered_rewrite_groups(
 1067 |                     groups,
 1068 |                     assembly.map(|assembly| &assembly.reordered_sources),
 1069 |                 )?;
 1070 | 
 1071 |                 if next_row_id.is_some() {
 1072 |                     // We can re-use indices, but need to rewrite the fragment bitmaps
 1073 |                     debug_assert!(rewritten_indices.is_empty());
 1074 |                     for index in final_indices.iter_mut() {
 1075 |                         // Its bitmap is lineage, not coverage, and a straddling
 1076 |                         // group would fail the recalculation.
 1077 |                         if is_frag_reuse_index_entry(index) {
 1078 |                             continue;
 1079 |                         }
 1080 |                         let results_are_row_addrs = index.results_are_row_addrs();
 1081 |                         if let Some(fragment_bitmap) = &mut index.fragment_bitmap {
 1082 |                             *fragment_bitmap = if results_are_row_addrs {
 1083 |                                 // Stable row ids survive a rewrite, so a row-id-domain index
 1084 |                                 // can simply follow its data to the new fragments. An
 1085 |                                 // address-domain index cannot: its stored addresses point into
 1086 |                                 // the fragments the rewrite dropped. Claiming coverage of the
 1087 |                                 // new fragments would make it answer queries with addresses
 1088 |                                 // that no longer resolve, so drop the rewritten fragments from
 1089 |                                 // its coverage instead and let the scanner fall back to a full
 1090 |                                 // scan for them.
 1091 |                                 Self::drop_rewritten_fragments(fragment_bitmap, &ordered_groups)
 1092 |                             } else {
 1093 |                                 Self::recalculate_fragment_bitmap(fragment_bitmap, &ordered_groups)?
 1094 |                             };
 1095 |                         }
 1096 |                     }
 1097 |                 } else {
 1098 |                     Self::handle_rewrite_indices(
 1099 |                         &mut final_indices,
 1100 |                         rewritten_indices,
 1101 |                         &ordered_groups,
 1102 |                     )?;
 1103 |                 }
 1104 | 
 1105 |                 // A full compaction materializes a fragment's overlays into fresh
 1106 |                 // base data. Any index older than one of those overlays was built on
 1107 |                 // the pre-overlay values, so drop the rewritten fragment from its
 1108 |                 // coverage to keep it from serving stale values.
 1109 |                 Self::prune_overlay_stale_fields_from_indices(&mut final_indices, groups);
 1110 | 
 1111 |                 match (frag_reuse_index, assembly) {
 1112 |                     // Tagged history: splice the entry the commit path
 1113 |                     // assembled against the current manifest, never the
 1114 |                     // operation's own entry (the caller's intent, which the
 1115 |                     // assembly merged and validated).
 1116 |                     (_, Some(assembly)) => {
 1117 |                         // A consistency check on the assembly, not the
 1118 |                         // concurrency protection. Concurrent rewrites are
 1119 |                         // handled by the commit path, which re-assembles the
 1120 |                         // entry against the latest manifest on every attempt
 1121 |                         // and commits with compare-and-swap, so an assembly
 1122 |                         // built on a stale entry never reaches this splice
 1123 |                         // through that path. What this refuses is an
 1124 |                         // assembled entry whose recorded base is not the
 1125 |                         // entry in the manifest being built (an entry
 1126 |                         // assembled by hand, or carried over from another
 1127 |                         // base): splicing it would replace the transitions
 1128 |                         // that entry already holds.
 1129 |                         let existing_version = final_indices
 1130 |                             .iter()
 1131 |                             .find(|idx| idx.name == FRAG_REUSE_INDEX_NAME)
 1132 |                             .map(|idx| idx.dataset_version);
 1133 |                         if existing_version != assembly.base_entry_version {
 1134 |                             return Err(Error::invalid_input(format!(
 1135 |                                 "the {} index entry in this manifest is at version {:?} but the \
 1136 |                                  rewrite's entry was assembled against version {:?}; rebuild it \
 1137 |                                  through the lance commit path, which assembles the entry against \
 1138 |                                  the manifest it commits to",
 1139 |                                 FRAG_REUSE_INDEX_NAME,
 1140 |                                 existing_version,
 1141 |                                 assembly.base_entry_version,
 1142 |                             )));
 1143 |                         }
 1144 |                         final_indices.retain(|idx| idx.name != assembly.entry.name);
 1145 |                         final_indices.push(assembly.entry.clone());
 1146 |                     }
 1147 |                     // v0 snapshot: splice verbatim, byte-identical to the
 1148 |                     // historical behavior. The chokepoint above already
 1149 |                     // rejected tagged snapshots.
 1150 |                     (Some(entry), None) => {
 1151 |                         final_indices.retain(|idx| idx.name != entry.name);
 1152 |                         final_indices.push(entry.clone());
 1153 |                     }
 1154 |                     (None, None) => {}
 1155 |                 }
 1156 |             }
 1157 |             Operation::CreateIndex {
 1158 |                 new_indices,
 1159 |                 removed_indices,
 1160 |                 ..
 1161 |             } => {
 1162 |                 final_fragments.extend(maybe_existing_fragments?.clone());
 1163 |                 let removed_uuids = removed_indices
 1164 |                     .iter()
 1165 |                     .map(|old_index| old_index.uuid)
 1166 |                     .collect::<HashSet<_>>();
 1167 |                 let new_uuids = new_indices
 1168 |                     .iter()
 1169 |                     .map(|new_index| new_index.uuid)
 1170 |                     .collect::<HashSet<_>>();
 1171 |                 final_indices.retain(|existing_index| {
 1172 |                     !removed_uuids.contains(&existing_index.uuid)
 1173 |                         && !new_uuids.contains(&existing_index.uuid)
 1174 |                 });
 1175 |                 for new_index in new_indices {
 1176 |                     new_index.validate_covering_fields()?;
 1177 |                 }
 1178 |                 final_indices.extend(new_indices.clone());
 1179 |             }
 1180 |             Operation::ReserveFragments { .. } | Operation::UpdateConfig { .. } => {
 1181 |                 final_fragments.extend(maybe_existing_fragments?.clone());
 1182 |             }
 1183 |             Operation::Merge { fragments, .. } => {
 1184 |                 let existing_fragments = maybe_existing_fragments?;
 1185 |                 let mut merged_fragments = fragments.clone();
 1186 |                 if next_row_id.is_some() {
 1187 |                     let prev_by_id: HashMap<u64, &Fragment> =
 1188 |                         existing_fragments.iter().map(|f| (f.id, f)).collect();
 1189 |                     for fragment in merged_fragments.iter_mut() {
 1190 |                         match prev_by_id.get(&fragment.id) {
 1191 |                             Some(prev) => {
 1192 |                                 if merge_fragment_physically_rewritten(prev, fragment) {
 1193 |                                     crate::rowids::version::refresh_row_latest_update_meta_for_full_frag_rewrite_cols(
 1194 |                                         fragment,
 1195 |                                         new_version,
 1196 |                                     )?;
 1197 |                                 }
 1198 |                             }
 1199 |                             None => {
 1200 |                                 // Brand-new fragment ID not present in the previous manifest.
 1201 |                                 // Set both last_updated and created version meta, consistent
 1202 |                                 // with Append/Overwrite for genuinely new fragments.
 1203 |                                 crate::rowids::version::refresh_row_latest_update_meta_for_full_frag_rewrite_cols(
 1204 |                                     fragment,
 1205 |                                     new_version,
 1206 |                                 )?;
 1207 |                                 fragment.created_at_version_meta =
 1208 |                                     fragment.last_updated_at_version_meta.clone();
 1209 |                             }
 1210 |                         }
 1211 |                     }
 1212 |                 }
 1213 |                 final_fragments.extend(merged_fragments);
 1214 | 
 1215 |                 // A Merge can rewrite a column's data file in place; the field stays
 1216 |                 // in the schema, so the index is retained. Its now-stale coverage of
 1217 |                 // the rewritten fragments was withdrawn by `prepare_indices`.
 1218 | 
 1219 |                 // Some fields that have indices may have been removed, so we should
 1220 |                 // remove those indices as well.
 1221 |                 Self::retain_relevant_indices(&mut final_indices, &schema, &final_fragments)
 1222 |             }
 1223 |             Operation::Project { .. } => {
 1224 |                 final_fragments.extend(maybe_existing_fragments?.clone());
 1225 | 
 1226 |                 // We might have removed all fields for certain data files, so
 1227 |                 // we should remove the data files that are no longer relevant.
 1228 |                 // A file carrying a spilled row lineage sequence stays: its
 1229 |                 // reserved ids are never in the schema, and it is the only copy.
 1230 |                 let remaining_field_ids = schema
 1231 |                     .fields_pre_order()
 1232 |                     .map(|f| f.id)
 1233 |                     .collect::<HashSet<_>>();
 1234 |                 for fragment in final_fragments.iter_mut() {
 1235 |                     let spilled = fragment.spilled_row_lineage_field_ids();
 1236 |                     fragment.files.retain(|file| {
 1237 |                         file.fields.iter().any(|field_id| {
 1238 |                             remaining_field_ids.contains(field_id) || spilled.contains(field_id)
 1239 |                         })
 1240 |                     });
 1241 |                 }
 1242 | 
 1243 |                 // Some fields that have indices may have been removed, so we should
 1244 |                 // remove those indices as well.
 1245 |                 Self::retain_relevant_indices(&mut final_indices, &schema, &final_fragments)
 1246 |             }
 1247 |             Operation::Restore { .. } => {
 1248 |                 unreachable!()
 1249 |             }
 1250 |             Operation::DataReplacement { replacements } => {
 1251 |                 log::warn!(
 1252 |                     "Building manifest with DataReplacement operation. This operation is not stable yet, please use with caution."
 1253 |                 );
 1254 | 
 1255 |                 let (old_fragment_ids, new_datafiles): (Vec<&u64>, Vec<&DataFile>) = replacements
 1256 |                     .iter()
 1257 |                     .map(|DataReplacementGroup(fragment_id, new_file)| (fragment_id, new_file))
 1258 |                     .unzip();
 1259 | 
 1260 |                 // 1. make sure the new files all have the same fields / or empty
 1261 |                 // NOTE: arguably this requirement could be relaxed in the future
 1262 |                 // for the sake of simplicity, we require the new files to have the same fields
 1263 |                 if new_datafiles
 1264 |                     .iter()
 1265 |                     .map(|f| f.fields.clone())
 1266 |                     .collect::<HashSet<_>>()
 1267 |                     .len()
 1268 |                     > 1
 1269 |                 {
 1270 |                     let field_info = new_datafiles
 1271 |                         .iter()
 1272 |                         .enumerate()
 1273 |                         .map(|(id, f)| (id, f.fields.clone()))
 1274 |                         .fold("".to_string(), |acc, (id, fields)| {
 1275 |                             format!("{}File {}: {:?}\n", acc, id, fields)
 1276 |                         });
 1277 | 
 1278 |                     return Err(Error::invalid_input(format!(
 1279 |                         "All new data files must have the same fields, but found different fields:\n{field_info}"
 1280 |                     )));
 1281 |                 }
 1282 | 
 1283 |                 let existing_fragments = maybe_existing_fragments?;
 1284 | 
 1285 |                 // Collect replaced field IDs before consuming new_datafiles
 1286 |                 let replaced_fields: Vec<u32> = new_datafiles
 1287 |                     .first()
 1288 |                     .map(|f| {
 1289 |                         f.schema(&schema)
 1290 |                             .field_ids()
 1291 |                             .iter()
 1292 |                             .chain(f.fields.iter())
 1293 |                             .filter(|&&id| id >= 0)
 1294 |                             .map(|&id| id as u32)
 1295 |                             .collect()
 1296 |                     })
 1297 |                     .unwrap_or_default();
 1298 | 
 1299 |                 // 2. check that the fragments being modified have isomorphic layouts along the columns being replaced
 1300 |                 // 3. add modified fragments to final_fragments
 1301 |                 for (frag_id, new_file) in old_fragment_ids.iter().zip(new_datafiles) {
 1302 |                     let frag = existing_fragments
 1303 |                         .iter()
 1304 |                         .find(|f| f.id == **frag_id)
 1305 |                         .ok_or_else(|| {
 1306 |                             Error::invalid_input(
 1307 |                                 "Fragment being replaced not found in existing fragments",
 1308 |                             )
 1309 |                         })?;
 1310 |                     let mut new_frag = frag.clone();
 1311 | 
 1312 |                     // Physical mappings differ across V2 encodings (a nested
 1313 |                     // parent may have no column of its own). Replacement and
 1314 |                     // tombstoning operate on the logical field coverage.
 1315 |                     let replacement_ids = new_file
 1316 |                         .schema(&schema)
 1317 |                         .field_ids()
 1318 |                         .into_iter()
 1319 |                         .chain(new_file.fields.iter().copied())
 1320 |                         .collect::<HashSet<_>>();
 1321 | 
 1322 |                     // TODO(rmeng): check new file and fragment are the same length
 1323 | 
 1324 |                     let mut columns_covered = HashSet::new();
 1325 |                     // Set when an existing file covers exactly the replaced
 1326 |                     // fields, so the whole file swaps rather than part of it.
 1327 |                     let mut replaced_in_place = false;
 1328 |                     for file in &mut new_frag.files {
 1329 |                         if file.fields == new_file.fields
 1330 |                             && file.file_major_version == new_file.file_major_version
 1331 |                             && file.file_minor_version == new_file.file_minor_version
 1332 |                         {
 1333 |                             // assign the new file path / size / base to the fragment
 1334 |                             file.path = new_file.path.clone();
 1335 |                             file.file_size_bytes = new_file.file_size_bytes.clone();
 1336 |                             file.base_id = new_file.base_id;
 1337 |                             replaced_in_place = true;
 1338 |                         }
 1339 |                         columns_covered.extend(file.schema(&schema).field_ids());
 1340 |                         columns_covered.extend(file.fields.iter().copied());
 1341 |                     }
 1342 |                     // Reject a file whose version does not decode before any
 1343 |                     // arm publishes it.
 1344 |                     new_file.file_version()?;
 1345 | 
 1346 |                     // SPECIAL CASE: if the column(s) being replaced are not covered by the fragment
 1347 |                     // Then it means it's a all-NULL column that is being replaced with real data
 1348 |                     // just add it to the final fragments. Push the DataFile as
 1349 |                     // given so every field (including base_id) is preserved.
 1350 |                     if columns_covered.is_disjoint(&replacement_ids) {
 1351 |                         new_frag.files.push(new_file.clone());
 1352 |                     } else if !replaced_in_place
 1353 |                         && replacement_ids.is_subset(&columns_covered)
 1354 |                         && new_frag.files.iter().all(|file| {
 1355 |                             file.file_version()
 1356 |                                 .is_ok_and(|version| version != ConcreteFileVersion::V1)
 1357 |                                 || file
 1358 |                                     .fields
 1359 |                                     .iter()
 1360 |                                     .all(|field| !replacement_ids.contains(field))
 1361 |                         })
 1362 |                     {
 1363 |                         // Tombstone the replaced fields where they live and
 1364 |                         // append the new file to answer for them, the idiom
 1365 |                         // `update_columns` uses. Compaction decides that layout,
 1366 |                         // so the fields may sit in one wider file or span
 1367 |                         // several.
 1368 |                         //
 1369 |                         // Legacy V1 is excluded: its reader derives the page table
 1370 |                         // offset from the first field in the metadata, so
 1371 |                         // tombstoning one field leaves its siblings decoding from
 1372 |                         // the wrong pages. A field a V1 file covers keeps
 1373 |                         // exact-match replacement.
 1374 |                         for file in &mut new_frag.files {
 1375 |                             // Same reason as the guard above.
 1376 |                             if file.file_version()? == ConcreteFileVersion::V1 {
 1377 |                                 continue;
 1378 |                             }
 1379 |                             file.fields = file
 1380 |                                 .fields
 1381 |                                 .iter()
 1382 |                                 .map(|field| {
 1383 |                                     if replacement_ids.contains(field) {
 1384 |                                         TOMBSTONE_FIELD_ID
 1385 |                                     } else {
 1386 |                                         *field
 1387 |                                     }
 1388 |                                 })
 1389 |                                 .collect::<Vec<_>>()
 1390 |                                 .into();
 1391 |                         }
 1392 |                         // Every data file must share at least one field with
 1393 |                         // the dataset schema: a file kept alive only by
 1394 |                         // tombstones or by ids the schema no longer defines is
 1395 |                         // unreachable to readers, uncollectable by cleanup,
 1396 |                         // and reported corrupt by validate(). The exception is
 1397 |                         // a file carrying one of the fragment's spilled row
 1398 |                         // lineage sequences: their reserved ids are never in
 1399 |                         // the schema, the file holds their only copy, and the
 1400 |                         // replaced user columns in it are dead space until
 1401 |                         // compaction.
 1402 |                         let live_ids = schema
 1403 |                             .fields_pre_order()
 1404 |                             .map(|field| field.id)
 1405 |                             .collect::<HashSet<i32>>();
 1406 |                         let spilled = new_frag.spilled_row_lineage_field_ids();
 1407 |                         new_frag.files.retain(|file| {
 1408 |                             file.fields
 1409 |                                 .iter()
 1410 |                                 .any(|f| live_ids.contains(f) || spilled.contains(f))
 1411 |                         });
 1412 |                         new_frag.files.push(new_file.clone());
 1413 |                     }
 1414 | 
 1415 |                     // Nothing changed in the current fragment, which is not expected -- error out
 1416 |                     if &new_frag == frag {
 1417 |                         return Err(Error::invalid_input(
 1418 |                             "Expected to modify the fragment but no changes were made. This means the new data files does not align with any exiting datafiles. Please check if the schema of the new data files matches the schema of the old data files including the file major and minor versions",
 1419 |                         ));
 1420 |                     }
 1421 | 
 1422 |                     // New base values supersede any overlay still shadowing
 1423 |                     // them, so tombstone the overlaid fields. An overlay
 1424 |                     // committed after this transaction's snapshot is the newer
 1425 |                     // value though -- the conflict resolver rebases these two
 1426 |                     // precisely because the overlay wins -- so it stays, and
 1427 |                     // being newer it stays last, preserving the ordering.
 1428 |                     let (mut superseded, newer): (Vec<_>, Vec<_>) = new_frag
 1429 |                         .overlays
 1430 |                         .drain(..)
 1431 |                         .partition(|overlay| overlay.committed_version <= self.read_version);
 1432 |                     crate::format::overlay::tombstone_overlay_fields(
 1433 |                         &mut superseded,
 1434 |                         &replaced_fields,
 1435 |                     );
 1436 |                     superseded.extend(newer);
 1437 |                     new_frag.overlays = superseded;
 1438 | 
 1439 |                     final_fragments.push(new_frag);
 1440 |                 }
 1441 | 
 1442 |                 let fragments_changed = old_fragment_ids
 1443 |                     .iter()
 1444 |                     .cloned()
 1445 |                     .cloned()
 1446 |                     .collect::<HashSet<_>>();
 1447 | 
 1448 |                 // 4. push fragments that didn't change back to final_fragments
 1449 |                 let unmodified_fragments = existing_fragments
 1450 |                     .iter()
 1451 |                     .filter(|f| !fragments_changed.contains(&f.id))
 1452 |                     .cloned()
 1453 |                     .collect::<Vec<_>>();
 1454 | 
 1455 |                 final_fragments.extend(unmodified_fragments);
 1456 | 
 1457 |                 // A replacement changes what its rows read as, so stamp them
 1458 |                 // updated. Without this, get_updated_rows never reports them and
 1459 |                 // an incremental consumer skips them for good.
 1460 |                 if next_row_id.is_some() {
 1461 |                     let new_version = current_manifest.map_or(1, |m| m.version + 1);
 1462 |                     for fragment in final_fragments
 1463 |                         .iter_mut()
 1464 |                         .filter(|f| fragments_changed.contains(&f.id))
 1465 |                     {
 1466 |                         crate::rowids::version::refresh_row_latest_update_meta_for_full_frag_rewrite_cols(
 1467 |                             fragment,
 1468 |                             new_version,
 1469 |                         )?;
 1470 |                     }
 1471 |                 }
 1472 | 
 1473 |                 // The replaced fields' coverage of the modified fragments was
 1474 |                 // withdrawn by `prepare_indices`.
 1475 |             }
 1476 |             Operation::DataOverlay { groups } => {
 1477 |                 // Stamp each overlay with the version this commit is producing.
 1478 |                 // build_manifest re-runs on every retry with an updated
 1479 |                 // current_manifest, so this is naturally re-stamped on retry.
 1480 |                 let new_version = current_manifest.map_or(1, |m| m.version + 1);
 1481 | 
 1482 |                 let existing_fragments = maybe_existing_fragments?;
 1483 |                 // Multiple groups may target the same fragment; merge them in
 1484 |                 // order rather than letting a HashMap collapse drop all but the
 1485 |                 // last group's overlays.
 1486 |                 let mut overlays_by_fragment: HashMap<u64, Vec<&DataOverlayFile>> = HashMap::new();
 1487 |                 for group in groups {
 1488 |                     overlays_by_fragment
 1489 |                         .entry(group.fragment_id)
 1490 |                         .or_default()
 1491 |                         .extend(group.overlays.iter());
 1492 |                 }
 1493 | 
 1494 |                 // Every group must target an existing fragment. Build a set of
 1495 |                 // existing ids once so this is O(groups + fragments) rather than
 1496 |                 // O(groups * fragments).
 1497 |                 let existing_fragment_ids: HashSet<u64> =
 1498 |                     existing_fragments.iter().map(|f| f.id).collect();
 1499 |                 for fragment_id in overlays_by_fragment.keys() {
 1500 |                     if !existing_fragment_ids.contains(fragment_id) {
 1501 |                         return Err(Error::invalid_input(format!(
 1502 |                             "DataOverlay targets fragment {fragment_id}, which does not exist"
 1503 |                         )));
 1504 |                     }
 1505 |                 }
 1506 | 
 1507 |                 for fragment in existing_fragments {
 1508 |                     let mut fragment = fragment.clone();
 1509 |                     if let Some(new_overlays) = overlays_by_fragment.get(&fragment.id) {
 1510 |                         if next_row_id.is_some() {
 1511 |                             let mut covered_offsets = RoaringBitmap::new();
 1512 |                             for overlay in new_overlays {
 1513 |                                 match &overlay.coverage {
 1514 |                                     OverlayCoverage::Shared(bitmap) => {
 1515 |                                         covered_offsets |= bitmap.as_ref();
 1516 |                                     }
 1517 |                                     OverlayCoverage::PerField(bitmaps) => {
 1518 |                                         for bitmap in bitmaps {
 1519 |                                             covered_offsets |= bitmap.as_ref();
 1520 |                                         }
 1521 |                                     }
 1522 |                                 }
 1523 |                             }
 1524 |                             if !covered_offsets.is_empty() {
 1525 |                                 let covered_offsets: Vec<usize> = covered_offsets
 1526 |                                     .iter()
 1527 |                                     .map(|offset| offset as usize)
 1528 |                                     .collect();
 1529 |                                 // Scans interpret missing lineage metadata as version 1,
 1530 |                                 // so using 1 as the fallback preserves the observable
 1531 |                                 // version of every uncovered row.
 1532 |                                 crate::rowids::version::refresh_row_latest_update_meta_for_partial_frag_rewrite_cols(
 1533 |                                     &mut fragment,
 1534 |                                     &covered_offsets,
 1535 |                                     new_version,
 1536 |                                     1,
 1537 |                                     &config.spilled_row_lineage,
 1538 |                                 )?;
 1539 |                             }
 1540 |                         }
 1541 |                         // Appended (not replaced) so concurrently-written overlays
 1542 |                         // survive; later entries are newer.
 1543 |                         fragment
 1544 |                             .overlays
 1545 |                             .extend(new_overlays.iter().map(|&overlay| {
 1546 |                                 let mut overlay = overlay.clone();
 1547 |                                 overlay.committed_version = new_version;
 1548 |                                 overlay
 1549 |                             }));
 1550 |                     }
 1551 |                     final_fragments.push(fragment);
 1552 |                 }
 1553 |             }
 1554 |             Operation::UpdateMemWalState {
 1555 |                 compacted_sstables, ..
 1556 |             } => {
 1557 |                 // Updates the MemWAL index only; the fragments are unchanged.
 1558 |                 final_fragments.extend(maybe_existing_fragments?.clone());
 1559 |                 update_mem_wal_index_compacted_sstables(
 1560 |                     &mut final_indices,
 1561 |                     new_version,
 1562 |                     compacted_sstables.clone(),
 1563 |                 )?;
 1564 |             }
 1565 |             Operation::UpdateBases { .. } => {
 1566 |                 // UpdateBases operation doesn't modify fragments or indices
 1567 |                 // Base paths are handled in the manifest creation section below
 1568 |                 final_fragments.extend(maybe_existing_fragments?.clone());
 1569 |             }
 1570 |         };
 1571 | 
 1572 |         // If a fragment was reserved then it may not belong at the end of the fragments list.
 1573 |         final_fragments.sort_by_key(|frag| frag.id);
 1574 | 
 1575 |         // Clean up data files that only contain tombstoned fields
 1576 |         Self::remove_tombstoned_data_files(&mut final_fragments);
 1577 | 
 1578 |         // Enforce the newest-last overlay ordering invariant at the write
 1579 |         // boundary. Load normalizes with a sort; this rejects any commit path
 1580 |         // that assembled a fragment's overlays out of order.
 1581 |         for fragment in &final_fragments {
 1582 |             if !fragment.overlays.is_empty() {
 1583 |                 crate::format::overlay::verify_overlays_newest_last(&fragment.overlays)?;
 1584 |             }
 1585 |         }
 1586 | 
 1587 |         // A spilled row lineage sequence lives only in its carrier file. An
 1588 |         // operation that dropped or duplicated that file would otherwise go
 1589 |         // unnoticed until the next read, by which time cleanup may have
 1590 |         // deleted the only copy. Every fragment is checked, not only the ones
 1591 |         // this operation touched: the check reads metadata only, skips
 1592 |         // fragments that spill nothing, and also refuses to build on a
 1593 |         // manifest that already lost a carrier.
 1594 |         for fragment in &final_fragments {
 1595 |             fragment.validate_row_lineage_carriers()?;
 1596 |         }
 1597 | 
 1598 |         let user_requested_version = match (&config.storage_format, config.use_legacy_format) {
 1599 |             (Some(storage_format), _) => Some(storage_format.lance_file_format()),
 1600 |             (None, Some(true)) => Some(ConcreteFileVersion::V1),
 1601 |             (None, Some(false)) => Some(ConcreteFileVersion::V2_0),
 1602 |             (None, None) => None,
 1603 |         };
 1604 | 
 1605 |         // Applied once the final index list is known, so it sees exactly the
 1606 |         // indices this commit publishes rather than what any one operation arm
 1607 |         // intended.
 1608 |         if let Some(segments_before) = mem_wal_segments_before.as_ref() {
 1609 |             Self::apply_mem_wal_index_coverage(
 1610 |                 &mut final_indices,
 1611 |                 segments_before,
 1612 |                 read_version_state,
 1613 |                 new_version,
 1614 |             )?;
 1615 |         }
 1616 | 
 1617 |         // Blob is one logical column across file versions. Publishing its first
 1618 |         // 2.2+ file also publishes the logical v2 view, without replacing older files.
 1619 |         // Blob children are not independent physical columns; retain the root ID
 1620 |         // and allocate logical child IDs against the current manifest on commit.
 1621 |         let legacy_blob_ids = schema
 1622 |             .fields_pre_order()
 1623 |             .filter(|field| field.is_blob() && !field.is_blob_v2())
 1624 |             .map(|field| field.id)
 1625 |             .collect::<HashSet<_>>();
 1626 |         if !legacy_blob_ids.is_empty() {
 1627 |             let mut blob_v2_fields = std::collections::BTreeSet::new();
 1628 |             for file in final_fragments
 1629 |                 .iter()
 1630 |                 .flat_map(|fragment| fragment.referenced_lance_files())
 1631 |             {
 1632 |                 if matches!(
 1633 |                     file.file_version()?,
 1634 |                     ConcreteFileVersion::V2_2 | ConcreteFileVersion::V2_3
 1635 |                 ) {
 1636 |                     blob_v2_fields.extend(
 1637 |                         file.fields
 1638 |                             .iter()
 1639 |                             .copied()
 1640 |                             .filter(|id| legacy_blob_ids.contains(id)),
 1641 |                     );
 1642 |                 }
 1643 |             }
 1644 |             let mut next_field_id = current_manifest
 1645 |                 .map(|manifest| manifest.max_field_id())
 1646 |                 .unwrap_or(-1)
 1647 |                 .max(schema.max_field_id().unwrap_or(-1))
 1648 |                 + 1;
 1649 |             for id in blob_v2_fields {
 1650 |                 if let Some(field) = schema.mut_field_by_id(id) {
 1651 |                     field.promote_blob_v2()?;
 1652 |                     field.set_id(field.parent_id, &mut next_field_id);
 1653 |                 }
 1654 |             }
 1655 |         }
 1656 | 
 1657 |         let mut manifest = if let Some(current_manifest) = current_manifest {
 1658 |             // OVERWRITE with initial_bases on existing dataset is not allowed (caught by validation)
 1659 |             // So we always use new_from_previous which preserves base_paths
 1660 |             let mut prev_manifest =
 1661 |                 Manifest::new_from_previous(current_manifest, schema, Arc::new(final_fragments));
 1662 | 
 1663 |             if let (Some(user_requested_version), Operation::Overwrite { .. }) =
 1664 |                 (user_requested_version, &self.operation)
 1665 |             {
 1666 |                 // If this is an overwrite operation and the user has requested a specific version
 1667 |                 // then overwrite with that version.  Otherwise, if the user didn't request a specific
 1668 |                 // version, then overwrite with whatever version we had before.
 1669 |                 prev_manifest.data_storage_format = DataStorageFormat::new(user_requested_version);
 1670 |             }
 1671 | 
 1672 |             prev_manifest
 1673 |         } else {
 1674 |             let data_storage_format =
 1675 |                 Self::data_storage_format_from_files(&final_fragments, user_requested_version)?;
 1676 |             Manifest::new(
 1677 |                 schema,
 1678 |                 Arc::new(final_fragments),
 1679 |                 data_storage_format,
 1680 |                 reference_paths,
 1681 |             )
 1682 |         };
 1683 | 
 1684 |         manifest.tag.clone_from(&self.tag);
 1685 | 
 1686 |         if config.auto_set_feature_flags {
 1687 |             // Internal operations (e.g. CreateIndex) build with the default config,
 1688 |             // which has use_stable_row_ids = false. Without inheriting from the previous
 1689 |             // manifest, apply_feature_flags would clear FLAG_STABLE_ROW_IDS.
 1690 |             let inherited = current_manifest
 1691 |                 .map(|m| m.uses_stable_row_ids())
 1692 |                 .unwrap_or(false);
 1693 |             let use_stable_row_ids = config.use_stable_row_ids || inherited;
 1694 |             apply_feature_flags(
 1695 |                 &mut manifest,
 1696 |                 use_stable_row_ids,
 1697 |                 config.disable_transaction_file,
 1698 |             )?;
 1699 |         }
 1700 |         // Set after apply_feature_flags, which resets both flag words -- and a
 1701 |         // `Manifest` only points at its index section, so the flag cannot be
 1702 |         // derived there.
 1703 |         //
 1704 |         // Derived fresh from `final_indices` on every commit, never inherited.
 1705 |         // Every manifest this reaches starts without the covering bit, so there
 1706 |         // is no stale bit to clear. Dropping the last covering index lifts the
 1707 |         // fence by simply not setting it again. Inheriting it from the previous
 1708 |         // manifest instead would make the fence permanent.
 1709 |         //
 1710 |         // Both words: a reader that selects a vector index by membership of
 1711 |         // `fields` would answer a query on a merely-carried column with an index
 1712 |         // keyed on another one, and a writer that treats every entry of `fields`
 1713 |         // as keyed would mismaintain it.
 1714 |         if final_indices
 1715 |             .iter()
 1716 |             .any(|index| !index.covering_fields.is_empty())
 1717 |         {
 1718 |             manifest.reader_feature_flags |= FLAG_COVERED_INDEX_METADATA;
 1719 |             manifest.writer_feature_flags |= FLAG_COVERED_INDEX_METADATA;
 1720 |         }
 1721 | 
 1722 |         if let Some(current_manifest) = current_manifest {
 1723 |             inherit_sticky_feature_flags(&mut manifest, current_manifest)?;
 1724 |         }
 1725 | 
 1726 |         manifest.set_timestamp(config.timestamp_nanos);
 1727 | 
 1728 |         manifest.update_max_fragment_id();
 1729 | 
 1730 |         match &self.operation {
 1731 |             Operation::Overwrite {
 1732 |                 config_upsert_values: Some(tm),
 1733 |                 ..
 1734 |             } => {
 1735 |                 manifest.config_mut().extend(tm.clone());
 1736 |             }
 1737 |             Operation::UpdateConfig {
 1738 |                 config_updates,
 1739 |                 table_metadata_updates,
 1740 |                 schema_metadata_updates,
 1741 |                 field_metadata_updates,
 1742 |             } => {
 1743 |                 if let Some(config_updates) = config_updates {
 1744 |                     let mut config = manifest.config.clone();
 1745 |                     apply_update_map(&mut config, config_updates);
 1746 |                     manifest.config = config;
 1747 |                 }
 1748 |                 if let Some(table_metadata_updates) = table_metadata_updates {
 1749 |                     let mut table_metadata = manifest.table_metadata.clone();
 1750 |                     apply_update_map(&mut table_metadata, table_metadata_updates);
 1751 |                     manifest.table_metadata = table_metadata;
 1752 |                 }
 1753 |                 if let Some(schema_metadata_updates) = schema_metadata_updates {
 1754 |                     let mut schema_metadata = manifest.schema.metadata.clone();
 1755 |                     apply_update_map(&mut schema_metadata, schema_metadata_updates);
 1756 |                     manifest.schema.metadata = schema_metadata;
 1757 |                 }
 1758 |                 // The unenforced primary and clustering keys are reserved
 1759 |                 // schema properties: each is immutable once set, and its
 1760 |                 // reserved metadata keys cannot be written with an invalid
 1761 |                 // value. Capture the prior keys, and whether this transaction
 1762 |                 // writes a reserved key, before applying the updates so
 1763 |                 // violations can be rejected below. This runs on every apply,
 1764 |                 // including conflict-rebase, so it also rejects the
 1765 |                 // concurrent-writer race.
 1766 |                 let primary_key_before: Vec<i32> = manifest
 1767 |                     .schema
 1768 |                     .unenforced_primary_key()
 1769 |                     .iter()
 1770 |                     .map(|field| field.id)
 1771 |                     .collect();
 1772 |                 let writes_primary_key = field_metadata_updates.values().any(|update| {
 1773 |                     update.update_entries.iter().any(|entry| {
 1774 |                         entry.key == LANCE_UNENFORCED_PRIMARY_KEY
 1775 |                             || entry.key == LANCE_UNENFORCED_PRIMARY_KEY_POSITION
 1776 |                     })
 1777 |                 });
 1778 |                 let clustering_key_before: Vec<i32> = manifest
 1779 |                     .schema
 1780 |                     .unenforced_clustering_key()
 1781 |                     .iter()
 1782 |                     .map(|field| field.id)
 1783 |                     .collect();
 1784 |                 let writes_clustering_key = field_metadata_updates.values().any(|update| {
 1785 |                     update
 1786 |                         .update_entries
 1787 |                         .iter()
 1788 |                         .any(|entry| entry.key == LANCE_UNENFORCED_CLUSTERING_KEY_POSITION)
 1789 |                 });
 1790 |                 for (field_id, field_metadata_update) in field_metadata_updates {
 1791 |                     if let Some(field) = manifest.schema.field_by_id_mut(*field_id) {
 1792 |                         apply_update_map(&mut field.metadata, field_metadata_update);
 1793 |                         // Also set unenforced primary key based on updated field metadata.
 1794 |                         field.unenforced_primary_key_position = field
 1795 |                             .metadata
 1796 |                             .get(LANCE_UNENFORCED_PRIMARY_KEY_POSITION)
 1797 |                             .and_then(|s| s.parse::<u32>().ok())
 1798 |                             .or_else(|| {
 1799 |                                 field
 1800 |                                     .metadata
 1801 |                                     .get(LANCE_UNENFORCED_PRIMARY_KEY)
 1802 |                                     .filter(|s| str_is_truthy(s))
 1803 |                                     .map(|_| 0)
 1804 |                             });
 1805 |                         // Also set unenforced clustering key based on updated
 1806 |                         // field metadata.
 1807 |                         field.unenforced_clustering_key_position = field
 1808 |                             .metadata
 1809 |                             .get(LANCE_UNENFORCED_CLUSTERING_KEY_POSITION)
 1810 |                             .and_then(|s| s.parse::<u32>().ok());
 1811 |                     } else {
 1812 |                         return Err(Error::invalid_input_source(
 1813 |                             format!("Field with id {} does not exist", field_id).into(),
 1814 |                         ));
 1815 |                     }
 1816 |                 }
 1817 |                 let primary_key_after: Vec<i32> = manifest
 1818 |                     .schema
 1819 |                     .unenforced_primary_key()
 1820 |                     .iter()
 1821 |                     .map(|field| field.id)
 1822 |                     .collect();
 1823 |                 if !primary_key_before.is_empty() {
 1824 |                     // The primary key is already set: reject any change to it,
 1825 |                     // and any write that touches a reserved primary key.
 1826 |                     if writes_primary_key || primary_key_after != primary_key_before {
 1827 |                         return Err(Error::invalid_input(
 1828 |                             "the unenforced primary key is a reserved key and cannot be changed once set",
 1829 |                         ));
 1830 |                     }
 1831 |                 } else if writes_primary_key && primary_key_after.is_empty() {
 1832 |                     // A reserved primary key was written but did not install a
 1833 |                     // valid primary key (e.g. a non-marker flag value or a
 1834 |                     // non-numeric position).
 1835 |                     return Err(Error::invalid_input(
 1836 |                         "the unenforced primary key is a reserved key and cannot be set to an invalid value",
 1837 |                     ));
 1838 |                 }
 1839 |                 if writes_primary_key {
 1840 |                     // Installing by field metadata skips the Arrow-schema
 1841 |                     // conversion that would otherwise validate the key.
 1842 |                     manifest.schema.verify_primary_key()?;
 1843 |                 }
 1844 |                 let clustering_key_after: Vec<i32> = manifest
 1845 |                     .schema
 1846 |                     .unenforced_clustering_key()
 1847 |                     .iter()
 1848 |                     .map(|field| field.id)
 1849 |                     .collect();
 1850 |                 if !clustering_key_before.is_empty() {
 1851 |                     // The clustering key is already set: reject any change to
 1852 |                     // it, and any write that touches the reserved key.
 1853 |                     if writes_clustering_key || clustering_key_after != clustering_key_before {
 1854 |                         return Err(Error::invalid_input(
 1855 |                             "the unenforced clustering key is a reserved key and cannot be changed once set",
 1856 |                         ));
 1857 |                     }
 1858 |                 } else if writes_clustering_key && clustering_key_after.is_empty() {
 1859 |                     // The reserved clustering key was written but did not
 1860 |                     // install a valid clustering key (e.g. a non-numeric
 1861 |                     // position value).
 1862 |                     return Err(Error::invalid_input(
 1863 |                         "the unenforced clustering key is a reserved key and cannot be set to an invalid value",
 1864 |                     ));
 1865 |                 }
 1866 |             }
 1867 |             _ => {}
 1868 |         }
 1869 | 
 1870 |         apply_range_segments(&mut manifest, current_manifest)?;
 1871 | 
 1872 |         // Handle UpdateBases operation to update manifest base_paths
 1873 |         if let Operation::UpdateBases { new_bases } = &self.operation {
 1874 |             // Validate and add new base paths to the manifest
 1875 |             for new_base in new_bases {
 1876 |                 // Check for conflicts with existing base paths
 1877 |                 if let Some(existing_base) = manifest
 1878 |                     .base_paths
 1879 |                     .values()
 1880 |                     .find(|bp| bp.name == new_base.name || bp.path == new_base.path)
 1881 |                 {
 1882 |                     return Err(Error::invalid_input(format!(
 1883 |                         "Conflict detected: Base path with name '{:?}' or path '{}' already exists. Existing: name='{:?}', path='{}'",
 1884 |                         new_base.name, new_base.path, existing_base.name, existing_base.path
 1885 |                     )));
 1886 |                 }
 1887 | 
 1888 |                 // Assign a new ID if not already assigned
 1889 |                 let mut base_to_add = new_base.clone();
 1890 |                 if base_to_add.id == 0 {
 1891 |                     let next_id = manifest
 1892 |                         .base_paths
 1893 |                         .keys()
 1894 |                         .max()
 1895 |                         .map(|&id| id + 1)
 1896 |                         .unwrap_or(1);
 1897 |                     base_to_add.id = next_id;
 1898 |                 }
 1899 | 
 1900 |                 manifest.base_paths.insert(base_to_add.id, base_to_add);
 1901 |             }
 1902 |         }
 1903 | 
 1904 |         if let Operation::ReserveFragments { num_fragments } = self.operation {
 1905 |             manifest.max_fragment_id = Some(manifest.max_fragment_id.unwrap_or(0) + num_fragments);
 1906 |         }
 1907 | 
 1908 |         manifest.transaction_file = Some(transaction_file_path.to_string());
 1909 | 
 1910 |         if let Some(next_row_id) = next_row_id {
 1911 |             manifest.next_row_id = next_row_id;
 1912 |         }
 1913 | 
 1914 |         if final_indices.iter().any(is_tagged) {
 1915 |             manifest.reader_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
 1916 |             manifest.writer_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
 1917 |         }
 1918 |         Ok((manifest, final_indices))
 1919 |     }
 1920 | 
 1921 |     /// Remove data files that only contain tombstoned fields (-2)
 1922 |     /// These files no longer contain any live data and can be safely dropped
 1923 |     fn remove_tombstoned_data_files(fragments: &mut [Fragment]) {
 1924 |         for fragment in fragments {
 1925 |             fragment.files.retain(|file| {
 1926 |                 // Keep file if it has at least one non-tombstoned field
 1927 |                 file.fields.iter().any(|&field_id| field_id != -2)
 1928 |             });
 1929 |         }
 1930 |     }
 1931 |     /// Coverage of an index that a rewrite invalidates: the rewritten fragments are
 1932 |     /// removed and the fragments they became are *not* added.
 1933 |     fn drop_rewritten_fragments(old: &RoaringBitmap, groups: &[RewriteGroup]) -> RoaringBitmap {
 1934 |         let mut new_bitmap = old.clone();
 1935 |         for group in groups {
 1936 |             for old_fragment in &group.old_fragments {
 1937 |                 new_bitmap.remove(old_fragment.id as u32);
 1938 |             }
 1939 |         }
 1940 |         new_bitmap
 1941 |     }
 1942 | }
 1943 | 
 1944 | #[cfg(test)]
 1945 | mod tests {
 1946 |     use super::*;
 1947 |     use crate::format::overlay::OverlayCoverage;
 1948 |     use crate::format::pb;
 1949 |     use crate::format::{
 1950 |         DeletionFile, DeletionFileType, ROW_CREATED_AT_VERSION_FIELD_ID, ROW_ID_FIELD_ID,
 1951 |         ROW_LAST_UPDATED_AT_VERSION_FIELD_ID, RowDatasetVersionMeta, RowDatasetVersionSequence,
 1952 |         RowIdMeta,
 1953 |     };
 1954 |     use crate::rowids::{RowIdSequence, write_row_ids};
 1955 |     use crate::transaction::test_support::{
 1956 |         default_build_config, last_updated_at_versions, make_stable_row_id_manifest,
 1957 |         overlay_with_field, sample_index_metadata, sample_manifest, tagged_entry,
 1958 |     };
 1959 |     use crate::transaction::{DataOverlayGroup, UpdateMode, validate_operation};
 1960 |     use arrow_schema::{DataType, Field as ArrowField, Schema as ArrowSchema};
 1961 |     use lance_core::datatypes::Schema as LanceSchema;
 1962 |     use lance_file::version::{ConcreteFileVersion, LanceFileVersion};
 1963 |     use lance_io::utils::CachedFileSize;
 1964 |     use std::collections::HashMap;
 1965 |     use std::sync::Arc;
 1966 |     use uuid::Uuid;
 1967 | 
 1968 |     /// Fragment 0 is the live destination of a rewrite that retired
 1969 |     /// fragment 5; the entry carries that one transition inline.
 1970 |     fn tagged_sample_manifest() -> (Manifest, IndexMetadata) {
 1971 |         let mut manifest = sample_manifest();
 1972 |         manifest.reader_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
 1973 |         manifest.writer_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
 1974 |         (manifest, tagged_entry(&[(&[5], &[0])]))
 1975 |     }
 1976 | 
 1977 |     fn row_mutation(kind: &str) -> Operation {
 1978 |         match kind {
 1979 |             "delete" => Operation::Delete {
 1980 |                 updated_fragments: vec![],
 1981 |                 deleted_fragment_ids: vec![0],
 1982 |                 predicate: "true".into(),
 1983 |             },
 1984 |             "update" => crate::transaction::test_support::update_txn(vec![]).operation,
 1985 |             "config" => Operation::UpdateConfig {
 1986 |                 config_updates: None,
 1987 |                 table_metadata_updates: None,
 1988 |                 schema_metadata_updates: None,
 1989 |                 field_metadata_updates: HashMap::new(),
 1990 |             },
 1991 |             _ => unreachable!(),
 1992 |         }
 1993 |     }
 1994 | 
 1995 |     /// Deletes, row-rewriting updates, config updates, projections and merges
 1996 |     /// that rewrite no column touch deletion vectors, new fragments, the
 1997 |     /// schema or the manifest config only: the tagged entry is carried
 1998 |     /// through unchanged and the mutation commits.
 1999 |     #[rstest::rstest]
 2000 |     #[case::delete("delete")]
 2001 |     #[case::update("update")]
 2002 |     #[case::config("config")]
 2003 |     #[case::project("project")]
 2004 |     #[case::merge("merge")]
 2005 |     fn tagged_history_allows_row_mutations(#[case] kind: &str) {
 2006 |         let (manifest, fri) = tagged_sample_manifest();
 2007 |         let operation = match kind {
 2008 |             "project" => Operation::Project {
 2009 |                 schema: manifest.schema.clone(),
 2010 |                 preserves_nullability: true,
 2011 |             },
 2012 |             "merge" => Operation::Merge {
 2013 |                 fragments: manifest.fragments.as_ref().clone(),
 2014 |                 schema: manifest.schema.clone(),
 2015 |                 preserves_nullability: true,
 2016 |             },
 2017 |             _ => row_mutation(kind),
 2018 |         };
 2019 |         let transaction = Transaction::new(manifest.version, operation, None);
 2020 |         let (_, indices) = transaction
 2021 |             .build_manifest(
 2022 |                 Some(&manifest),
 2023 |                 vec![fri.clone()],
 2024 |                 "txn",
 2025 |                 &default_build_config(),
 2026 |             )
 2027 |             .unwrap();
 2028 |         let carried = indices
 2029 |             .iter()
 2030 |             .find(|idx| idx.name == crate::system_index::frag_reuse::FRAG_REUSE_INDEX_NAME)
 2031 |             .expect("the tagged entry is carried through");
 2032 |         assert_eq!(carried.uuid, fri.uuid);
 2033 |         assert_eq!(carried.index_version, fri.index_version);
 2034 |     }
 2035 | 
 2036 |     /// An overwrite replaces every fragment and drops every index, the tagged
 2037 |     /// entry included; the sticky flag keeps the tagged record form.
 2038 |     #[test]
 2039 |     fn tagged_history_overwrite_discards_the_entry() {
 2040 |         let (manifest, fri) = tagged_sample_manifest();
 2041 |         let transaction = Transaction::new(
 2042 |             manifest.version,
 2043 |             Operation::Overwrite {
 2044 |                 fragments: vec![Fragment::new(0)],
 2045 |                 schema: manifest.schema.clone(),
 2046 |                 config_upsert_values: None,
 2047 |                 initial_bases: None,
 2048 |             },
 2049 |             None,
 2050 |         );
 2051 |         let (new_manifest, indices) = transaction
 2052 |             .build_manifest(Some(&manifest), vec![fri], "txn", &default_build_config())
 2053 |             .unwrap();
 2054 |         assert!(indices.is_empty(), "{indices:?}");
 2055 |         assert_ne!(
 2056 |             new_manifest.reader_feature_flags & FLAG_FRAGMENT_REUSE_INDEX,
 2057 |             0
 2058 |         );
 2059 |     }
 2060 | 
 2061 |     /// The stable row id migration commits a `Merge` with the activation
 2062 |     /// marker; it is refused while a tagged entry exists.
 2063 |     #[test]
 2064 |     fn tagged_history_refuses_stable_row_id_migration() {
 2065 |         let (manifest, fri) = tagged_sample_manifest();
 2066 |         let transaction = Transaction::new(
 2067 |             manifest.version,
 2068 |             Operation::Merge {
 2069 |                 fragments: manifest.fragments.as_ref().clone(),
 2070 |                 schema: manifest.schema.clone(),
 2071 |                 preserves_nullability: true,
 2072 |             },
 2073 |             None,
 2074 |         );
 2075 |         let config = ManifestBuildConfig {
 2076 |             migration_next_row_id: Some(100),
 2077 |             ..default_build_config()
 2078 |         };
 2079 |         let error = transaction
 2080 |             .build_manifest(Some(&manifest), vec![fri], "txn", &config)
 2081 |             .unwrap_err();
 2082 |         assert!(matches!(error, Error::NotSupported { .. }), "{error}");
 2083 |         assert!(
 2084 |             error.to_string().contains("stable row id migration"),
 2085 |             "{error}"
 2086 |         );
 2087 |     }
 2088 | 
 2089 |     /// The manifest's only fragment, 0, carries field 0 in `path`.
 2090 |     fn manifest_with_file(path: &str) -> Manifest {
 2091 |         let mut manifest = sample_manifest();
 2092 |         manifest.fragments = Arc::new(vec![Fragment::new(0).with_file(
 2093 |             path,
 2094 |             vec![0],
 2095 |             vec![0],
 2096 |             ConcreteFileVersion::V2_0,
 2097 |             None,
 2098 |         )]);
 2099 |         manifest.reader_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
 2100 |         manifest.writer_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
 2101 |         manifest
 2102 |     }
 2103 | 
 2104 |     /// A user segment on field 0 built from fragment 5, which the rewrite
 2105 |     /// that produced fragment 0 retired: the entry's history says so, and
 2106 |     /// the segment covers fragment 0 only through it.
 2107 |     fn translating_segment_and_entry() -> (IndexMetadata, IndexMetadata) {
 2108 |         let mut segment = sample_index_metadata("id_idx");
 2109 |         segment.fragment_bitmap = Some([5u32].into_iter().collect());
 2110 |         (segment, tagged_entry(&[(&[5], &[0])]))
 2111 |     }
 2112 | 
 2113 |     fn user_bitmap(indices: &[IndexMetadata]) -> RoaringBitmap {
 2114 |         indices
 2115 |             .iter()
 2116 |             .find(|idx| idx.name == "id_idx")
 2117 |             .unwrap()
 2118 |             .fragment_bitmap
 2119 |             .clone()
 2120 |             .unwrap()
 2121 |     }
 2122 | 
 2123 |     /// The three in-place column rewrites of field 0 on fragment 0.
 2124 |     fn in_place_rewrite(kind: &str, manifest: &Manifest, fields: Vec<u32>) -> Operation {
 2125 |         match kind {
 2126 |             "update" => {
 2127 |                 let mut update = crate::transaction::test_support::update_txn(vec![]);
 2128 |                 let Operation::Update {
 2129 |                     updated_fragments,
 2130 |                     fields_modified,
 2131 |                     ..
 2132 |                 } = &mut update.operation
 2133 |                 else {
 2134 |                     unreachable!()
 2135 |                 };
 2136 |                 *updated_fragments = vec![Fragment::new(0)];
 2137 |                 *fields_modified = fields;
 2138 |                 update.operation
 2139 |             }
 2140 |             "merge" => Operation::Merge {
 2141 |                 fragments: vec![Fragment::new(0).with_file(
 2142 |                     "b.lance",
 2143 |                     fields.iter().map(|f| *f as i32).collect(),
 2144 |                     vec![0],
 2145 |                     ConcreteFileVersion::V2_0,
 2146 |                     None,
 2147 |                 )],
 2148 |                 schema: manifest.schema.clone(),
 2149 |                 preserves_nullability: true,
 2150 |             },
 2151 |             "data_replacement" => Operation::DataReplacement {
 2152 |                 replacements: vec![DataReplacementGroup(
 2153 |                     0,
 2154 |                     DataFile::new(
 2155 |                         "b.lance",
 2156 |                         fields.iter().map(|f| *f as i32).collect(),
 2157 |                         vec![0],
 2158 |                         ConcreteFileVersion::V2_0,
 2159 |                         None,
 2160 |                         None,
 2161 |                     ),
 2162 |                 )],
 2163 |             },
 2164 |             _ => unreachable!(),
 2165 |         }
 2166 |     }
 2167 | 
 2168 |     /// An in-place rewrite of a column that a translating segment indexes,
 2169 |     /// on a fragment the segment reaches only through the history, is
 2170 |     /// admitted; the segment cannot withdraw that fragment from its bitmap,
 2171 |     /// so the whole transition's sources are withdrawn instead and the
 2172 |     /// segment claims nothing for its destinations (the reader scans them).
 2173 |     #[rstest::rstest]
 2174 |     #[case::update("update")]
 2175 |     #[case::merge("merge")]
 2176 |     #[case::data_replacement("data_replacement")]
 2177 |     fn tagged_history_withdraws_in_place_rewrite_covered_only_by_translation(#[case] kind: &str) {
 2178 |         let manifest = manifest_with_file("a.lance");
 2179 |         let (segment, fri) = translating_segment_and_entry();
 2180 |         let transaction = Transaction::new(
 2181 |             manifest.version,
 2182 |             in_place_rewrite(kind, &manifest, vec![0]),
 2183 |             None,
 2184 |         );
 2185 |         let (_, indices) = transaction
 2186 |             .build_manifest(
 2187 |                 Some(&manifest),
 2188 |                 vec![segment, fri.clone()],
 2189 |                 "txn",
 2190 |                 &default_build_config(),
 2191 |             )
 2192 |             .unwrap();
 2193 |         assert!(
 2194 |             indices.iter().any(|idx| idx.uuid == fri.uuid),
 2195 |             "entry carried"
 2196 |         );
 2197 |         assert!(
 2198 |             user_bitmap(&indices).is_empty(),
 2199 |             "{:?}",
 2200 |             user_bitmap(&indices)
 2201 |         );
 2202 |     }
 2203 | 
 2204 |     /// Naming the fragment directly is no way out: a merged segment's bitmap
 2205 |     /// is the union of its sources' provenance, and pruning the direct id
 2206 |     /// alone would let the retired sources re-derive the same destination
 2207 |     /// with the pre-rewrite values inside. Both go.
 2208 |     #[rstest::rstest]
 2209 |     #[case::update("update")]
 2210 |     #[case::merge("merge")]
 2211 |     #[case::data_replacement("data_replacement")]
 2212 |     fn tagged_history_withdraws_mixed_provenance_whole(#[case] kind: &str) {
 2213 |         let manifest = manifest_with_file("a.lance");
 2214 |         let (mut segment, fri) = translating_segment_and_entry();
 2215 |         segment.fragment_bitmap = Some([0u32, 5].into_iter().collect());
 2216 |         let transaction = Transaction::new(
 2217 |             manifest.version,
 2218 |             in_place_rewrite(kind, &manifest, vec![0]),
 2219 |             None,
 2220 |         );
 2221 |         let (_, indices) = transaction
 2222 |             .build_manifest(
 2223 |                 Some(&manifest),
 2224 |                 vec![segment, fri],
 2225 |                 "txn",
 2226 |                 &default_build_config(),
 2227 |             )
 2228 |             .unwrap();
 2229 |         assert!(
 2230 |             user_bitmap(&indices).is_empty(),
 2231 |             "{:?}",
 2232 |             user_bitmap(&indices)
 2233 |         );
 2234 |     }
 2235 | 
 2236 |     /// Without a walkable history (a ledger this writer cannot read, or none
 2237 |     /// at hand) the withdrawal is conservative: every retired fragment of a
 2238 |     /// segment indexing the rewritten column goes, on the rewritten lineage
 2239 |     /// or not, and only the live fragments stay. The same rewrite with the
 2240 |     /// history walkable withdraws just the transition reaching the rewritten
 2241 |     /// fragment.
 2242 |     #[test]
 2243 |     fn tagged_history_without_a_walkable_lineage_withdraws_every_retired_source() {
 2244 |         use crate::system_index::frag_reuse::lineage::TaggedLineage;
 2245 |         let entry = tagged_entry(&[(&[5], &[0]), (&[6], &[8])]);
 2246 |         let mut segment = sample_index_metadata("id_idx");
 2247 |         segment.fragment_bitmap = Some([0u32, 5, 6, 7].into_iter().collect());
 2248 |         let live: RoaringBitmap = [0u32, 7, 8].into_iter().collect();
 2249 | 
 2250 |         let unwalkable = TaggedLineage::new(&entry, None);
 2251 |         assert!(!unwalkable.has_ledger());
 2252 |         let mut indices = vec![segment.clone()];
 2253 |         Transaction::withdraw_rewritten_coverage(
 2254 |             &mut indices,
 2255 |             Some(&unwalkable),
 2256 |             &live,
 2257 |             &[(0, vec![0])],
 2258 |         );
 2259 |         assert_eq!(
 2260 |             user_bitmap(&indices),
 2261 |             [7u32].into_iter().collect::<RoaringBitmap>(),
 2262 |             "the rewritten fragment and every retired fragment go"
 2263 |         );
 2264 | 
 2265 |         let walkable = TaggedLineage::from_indices_with_ledger(&[entry], None)
 2266 |             .unwrap()
 2267 |             .unwrap();
 2268 |         let mut indices = vec![segment];
 2269 |         Transaction::withdraw_rewritten_coverage(
 2270 |             &mut indices,
 2271 |             Some(&walkable),
 2272 |             &live,
 2273 |             &[(0, vec![0])],
 2274 |         );
 2275 |         assert_eq!(
 2276 |             user_bitmap(&indices),
 2277 |             [6u32, 7].into_iter().collect::<RoaringBitmap>(),
 2278 |             "only the transition reaching fragment 0 is withdrawn"
 2279 |         );
 2280 |     }
 2281 | 
 2282 |     /// What a withdrawal leaves, per logical index name: a segment emptied
 2283 |     /// while a same-name sibling still has coverage leaves the manifest in
 2284 |     /// the commit; the last segment of a name stays, empty, as the record of
 2285 |     /// what to rebuild; a segment without a bitmap has unknown coverage and
 2286 |     /// is neither withdrawn from nor counted as empty.
 2287 |     #[test]
 2288 |     fn tagged_history_retires_an_emptied_segment_only_beside_a_serving_sibling() {
 2289 |         let mut manifest = manifest_with_file("a.lance");
 2290 |         manifest.fragments = Arc::new(vec![
 2291 |             Fragment::new(0).with_file(
 2292 |                 "a.lance",
 2293 |                 vec![0],
 2294 |                 vec![0],
 2295 |                 ConcreteFileVersion::V2_0,
 2296 |                 None,
 2297 |             ),
 2298 |             Fragment::new(1).with_file(
 2299 |                 "c.lance",
 2300 |                 vec![0],
 2301 |                 vec![0],
 2302 |                 ConcreteFileVersion::V2_0,
 2303 |                 None,
 2304 |             ),
 2305 |         ]);
 2306 |         let (translating, fri) = translating_segment_and_entry();
 2307 |         let mut sibling = sample_index_metadata("id_idx");
 2308 |         sibling.uuid = Uuid::new_v4();
 2309 |         sibling.fragment_bitmap = Some([1u32].into_iter().collect());
 2310 |         let mut unknown = sample_index_metadata("other_idx");
 2311 |         unknown.uuid = Uuid::new_v4();
 2312 |         unknown.fragment_bitmap = None;
 2313 |         let transaction = Transaction::new(
 2314 |             manifest.version,
 2315 |             in_place_rewrite("update", &manifest, vec![0]),
 2316 |             None,
 2317 |         );
 2318 | 
 2319 |         // Beside a serving sibling the emptied segment leaves the manifest.
 2320 |         let (_, indices) = transaction
 2321 |             .build_manifest(
 2322 |                 Some(&manifest),
 2323 |                 vec![
 2324 |                     translating.clone(),
 2325 |                     sibling.clone(),
 2326 |                     unknown.clone(),
 2327 |                     fri.clone(),
 2328 |                 ],
 2329 |                 "txn",
 2330 |                 &default_build_config(),
 2331 |             )
 2332 |             .unwrap();
 2333 |         let names: Vec<(String, Uuid)> = indices
 2334 |             .iter()
 2335 |             .map(|idx| (idx.name.clone(), idx.uuid))
 2336 |             .collect();
 2337 |         assert!(
 2338 |             !names.contains(&("id_idx".to_string(), translating.uuid)),
 2339 |             "{names:?}"
 2340 |         );
 2341 |         assert_eq!(
 2342 |             indices
 2343 |                 .iter()
 2344 |                 .find(|idx| idx.uuid == sibling.uuid)
 2345 |                 .unwrap()
 2346 |                 .fragment_bitmap,
 2347 |             sibling.fragment_bitmap,
 2348 |             "the sibling is untouched"
 2349 |         );
 2350 |         assert_eq!(
 2351 |             indices
 2352 |                 .iter()
 2353 |                 .find(|idx| idx.uuid == unknown.uuid)
 2354 |                 .unwrap()
 2355 |                 .fragment_bitmap,
 2356 |             None,
 2357 |             "unknown coverage is neither withdrawn nor emptied"
 2358 |         );
 2359 | 
 2360 |         // As the last segment of its name it stays, empty.
 2361 |         let (_, indices) = transaction
 2362 |             .build_manifest(
 2363 |                 Some(&manifest),
 2364 |                 vec![translating.clone(), fri],
 2365 |                 "txn",
 2366 |                 &default_build_config(),
 2367 |             )
 2368 |             .unwrap();
 2369 |         let kept = indices
 2370 |             .iter()
 2371 |             .find(|idx| idx.uuid == translating.uuid)
 2372 |             .expect("the last segment stays");
 2373 |         assert!(kept.fragment_bitmap.as_ref().unwrap().is_empty());
 2374 |     }
 2375 | 
 2376 |     /// A segment on an unrelated lineage (fragment 6 rewritten into 8) is
 2377 |     /// untouched by a rewrite of fragment 0: the history is walked, not
 2378 |     /// guessed at.
 2379 |     #[test]
 2380 |     fn tagged_history_leaves_unrelated_lineage_alone() {
 2381 |         let manifest = manifest_with_file("a.lance");
 2382 |         let fri = tagged_entry(&[(&[5], &[0]), (&[6], &[8])]);
 2383 |         let mut segment = sample_index_metadata("id_idx");
 2384 |         segment.fragment_bitmap = Some([6u32].into_iter().collect());
 2385 |         let transaction = Transaction::new(
 2386 |             manifest.version,
 2387 |             in_place_rewrite("update", &manifest, vec![0]),
 2388 |             None,
 2389 |         );
 2390 |         let (_, indices) = transaction
 2391 |             .build_manifest(
 2392 |                 Some(&manifest),
 2393 |                 vec![segment, fri],
 2394 |                 "txn",
 2395 |                 &default_build_config(),
 2396 |             )
 2397 |             .unwrap();
 2398 |         assert_eq!(user_bitmap(&indices), RoaringBitmap::from_iter([6u32]));
 2399 |     }
 2400 | 
 2401 |     /// Without a supplied ledger an entry whose history is not inline cannot
 2402 |     /// be walked, and the build refuses rather than guess.
 2403 |     #[test]
 2404 |     fn tagged_history_without_readable_history_is_an_error() {
 2405 |         let manifest = manifest_with_file("a.lance");
 2406 |         let (segment, mut fri) = translating_segment_and_entry();
 2407 |         fri.index_details = None;
 2408 |         let transaction = Transaction::new(
 2409 |             manifest.version,
 2410 |             in_place_rewrite("update", &manifest, vec![0]),
 2411 |             None,
 2412 |         );
 2413 |         let error = transaction
 2414 |             .build_manifest(
 2415 |                 Some(&manifest),
 2416 |                 vec![segment, fri],
 2417 |                 "txn",
 2418 |                 &default_build_config(),
 2419 |             )
 2420 |             .unwrap_err();
 2421 |         assert!(matches!(error, Error::InvalidInput { .. }), "{error}");
 2422 |         assert!(error.to_string().contains("history"), "{error}");
 2423 |     }
 2424 | 
 2425 |     /// A segment whose bitmap is entirely live has the fragment pruned as on
 2426 |     /// an untagged table; a translating segment that does not index the
 2427 |     /// rewritten field, or whose rows the history moves elsewhere, is
 2428 |     /// untouched. The entry is carried through in every case.
 2429 |     #[rstest::rstest]
 2430 |     #[case::update_direct("update", "direct")]
 2431 |     #[case::merge_direct("merge", "direct")]
 2432 |     #[case::data_replacement_direct("data_replacement", "direct")]
 2433 |     #[case::update_unindexed_field("update", "unindexed_field")]
 2434 |     #[case::merge_unindexed_field("merge", "unindexed_field")]
 2435 |     #[case::update_off_lineage("update", "off_lineage")]
 2436 |     fn tagged_history_prunes_or_keeps_what_the_history_says(
 2437 |         #[case] kind: &str,
 2438 |         #[case] shape: &str,
 2439 |     ) {
 2440 |         let manifest = manifest_with_file("a.lance");
 2441 |         let (mut segment, mut fri) = translating_segment_and_entry();
 2442 |         let mut fields = vec![0];
 2443 |         match shape {
 2444 |             "direct" => segment.fragment_bitmap = Some([0u32].into_iter().collect()),
 2445 |             "unindexed_field" => fields = vec![1],
 2446 |             // Fragment 5 was rewritten into 7, not into the rewritten 0.
 2447 |             "off_lineage" => fri = tagged_entry(&[(&[5], &[7])]),
 2448 |             _ => unreachable!(),
 2449 |         }
 2450 |         let transaction = Transaction::new(
 2451 |             manifest.version,
 2452 |             in_place_rewrite(kind, &manifest, fields),
 2453 |             None,
 2454 |         );
 2455 |         let (_, indices) = transaction
 2456 |             .build_manifest(
 2457 |                 Some(&manifest),
 2458 |                 vec![segment.clone(), fri.clone()],
 2459 |                 "txn",
 2460 |                 &default_build_config(),
 2461 |             )
 2462 |             .unwrap();
 2463 |         let carried = indices
 2464 |             .iter()
 2465 |             .find(|idx| idx.name == crate::system_index::frag_reuse::FRAG_REUSE_INDEX_NAME)
 2466 |             .expect("the tagged entry is carried through");
 2467 |         assert_eq!(carried.uuid, fri.uuid);
 2468 |         let user = indices.iter().find(|idx| idx.name == "id_idx").unwrap();
 2469 |         let expected: RoaringBitmap = if shape == "direct" {
 2470 |             // Fragment 0 was rewritten: withdrawn from the segment.
 2471 |             RoaringBitmap::new()
 2472 |         } else {
 2473 |             segment.fragment_bitmap.unwrap()
 2474 |         };
 2475 |         assert_eq!(user.fragment_bitmap.as_ref().unwrap(), &expected, "{shape}");
 2476 |     }
 2477 | 
 2478 |     /// A user index is created, replaced or dropped on a tagged table like on
 2479 |     /// any other: the entry is carried through untouched.
 2480 |     #[test]
 2481 |     fn tagged_history_allows_user_index_create_index() {
 2482 |         let (manifest, fri) = tagged_sample_manifest();
 2483 |         let transaction = Transaction::new(
 2484 |             manifest.version,
 2485 |             Operation::CreateIndex {
 2486 |                 new_indices: vec![sample_index_metadata("id_idx")],
 2487 |                 removed_indices: vec![],
 2488 |             },
 2489 |             None,
 2490 |         );
 2491 |         let (_, indices) = transaction
 2492 |             .build_manifest(
 2493 |                 Some(&manifest),
 2494 |                 vec![fri.clone()],
 2495 |                 "txn",
 2496 |                 &default_build_config(),
 2497 |             )
 2498 |             .unwrap();
 2499 |         assert!(indices.iter().any(|idx| idx.name == "id_idx"));
 2500 |         let carried = indices.iter().find(|idx| idx.uuid == fri.uuid).unwrap();
 2501 |         assert_eq!(carried.index_details, fri.index_details);
 2502 |         assert_eq!(carried.fragment_bitmap, fri.fragment_bitmap);
 2503 |     }
 2504 | 
 2505 |     #[rstest::rstest]
 2506 |     #[case::memwal("memwal")]
 2507 |     #[case::bare_rewrite("bare_rewrite")]
 2508 |     #[case::rewrite_with_v0_entry("rewrite_with_v0_entry")]
 2509 |     fn tagged_history_rejects_unsupported_transactions(#[case] kind: &str) {
 2510 |         let (manifest, fri) = tagged_sample_manifest();
 2511 |         let operation = match kind {
 2512 |             "memwal" => Operation::UpdateMemWalState {
 2513 |                 compacted_sstables: vec![],
 2514 |             },
 2515 |             // A rewrite carrying no entry, or a v0 entry, would splice away
 2516 |             // the tagged history; only a tagged entry may replace one. The
 2517 |             // bare rewrite touches fragment 0, which the entry's bitmap
 2518 |             // covers (a bare rewrite of only uncovered fragments is allowed,
 2519 |             // see `tagged_history_allows_rewrite_of_uncovered_fragments`).
 2520 |             "bare_rewrite" => Operation::Rewrite {
 2521 |                 groups: vec![RewriteGroup {
 2522 |                     old_fragments: vec![Fragment::new(0)],
 2523 |                     new_fragments: vec![Fragment::new(10)],
 2524 |                 }],
 2525 |                 rewritten_indices: vec![],
 2526 |                 frag_reuse_index: None,
 2527 |             },
 2528 |             "rewrite_with_v0_entry" => {
 2529 |                 let mut v0_entry = fri.clone();
 2530 |                 v0_entry.index_version = 0;
 2531 |                 Operation::Rewrite {
 2532 |                     groups: vec![],
 2533 |                     rewritten_indices: vec![],
 2534 |                     frag_reuse_index: Some(v0_entry),
 2535 |                 }
 2536 |             }
 2537 |             _ => unreachable!(),
 2538 |         };
 2539 |         let transaction = Transaction::new(manifest.version, operation, None);
 2540 |         let error = transaction
 2541 |             .build_manifest(Some(&manifest), vec![fri], "txn", &default_build_config())
 2542 |             .unwrap_err();
 2543 |         assert!(matches!(error, Error::NotSupported { .. }), "{error}");
 2544 |         assert!(
 2545 |             error.to_string().contains("Tagged FRI history maintenance"),
 2546 |             "{error}"
 2547 |         );
 2548 |     }
 2549 | 
 2550 |     #[rstest::rstest]
 2551 |     #[case::untagged_table(false)]
 2552 |     #[case::tagged_table(true)]
 2553 |     fn tagged_snapshot_replace_rejected(#[case] table_is_tagged: bool) {
 2554 |         // A pre-assembled tagged entry that did not come from the commit
 2555 |         // path's assembly (a `ReplaceEntry` snapshot) has bypassed
 2556 |         // validation and may be stale; it must be rejected at the manifest
 2557 |         // chokepoint regardless of the table's current state.
 2558 |         let mut manifest = sample_manifest();
 2559 |         let mut current_indices = vec![];
 2560 |         if table_is_tagged {
 2561 |             manifest.reader_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
 2562 |             manifest.writer_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
 2563 |             let mut current =
 2564 |                 sample_index_metadata(crate::system_index::frag_reuse::FRAG_REUSE_INDEX_NAME);
 2565 |             current.fields.clear();
 2566 |             current_indices.push(current);
 2567 |         }
 2568 |         let mut entry =
 2569 |             sample_index_metadata(crate::system_index::frag_reuse::FRAG_REUSE_INDEX_NAME);
 2570 |         entry.fields.clear();
 2571 |         let transaction = Transaction::new(
 2572 |             manifest.version,
 2573 |             Operation::Rewrite {
 2574 |                 groups: vec![],
 2575 |                 rewritten_indices: vec![],
 2576 |                 frag_reuse_index: Some(entry),
 2577 |             },
 2578 |             None,
 2579 |         );
 2580 |         let error = transaction
 2581 |             .build_manifest(
 2582 |                 Some(&manifest),
 2583 |                 current_indices,
 2584 |                 "txn",
 2585 |                 &default_build_config(),
 2586 |             )
 2587 |             .unwrap_err();
 2588 |         assert!(matches!(error, Error::InvalidInput { .. }), "{error}");
 2589 |         assert!(error.to_string().contains("must be assembled"), "{error}");
 2590 |     }
 2591 | 
 2592 |     #[test]
 2593 |     fn v0_snapshot_replace_rejected_on_flag_carrying_manifest_without_entry() {
 2594 |         // The sticky flag alone forbids a v0 snapshot: a trim may have
 2595 |         // deleted the fully drained tagged entry, but the flag survives and
 2596 |         // remains the final authority on the record form. Publishing the
 2597 |         // snapshot would silently downgrade the table to v0.
 2598 |         let mut manifest = sample_manifest();
 2599 |         manifest.reader_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
 2600 |         manifest.writer_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
 2601 |         let mut entry =
 2602 |             sample_index_metadata(crate::system_index::frag_reuse::FRAG_REUSE_INDEX_NAME);
 2603 |         entry.fields.clear();
 2604 |         entry.index_version = 0;
 2605 |         let transaction = Transaction::new(
 2606 |             manifest.version,
 2607 |             Operation::Rewrite {
 2608 |                 groups: vec![],
 2609 |                 rewritten_indices: vec![],
 2610 |                 frag_reuse_index: Some(entry),
 2611 |             },
 2612 |             None,
 2613 |         );
 2614 |         let error = transaction
 2615 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 2616 |             .unwrap_err();
 2617 |         assert!(matches!(error, Error::InvalidInput { .. }), "{error}");
 2618 |         assert!(error.to_string().contains("sticky feature flag"), "{error}");
 2619 |     }
 2620 | 
 2621 |     #[test]
 2622 |     fn tagged_history_allows_rewrite_of_uncovered_fragments() {
 2623 |         // Deferred compaction of never-covered fragments commits a plain
 2624 |         // rewrite (no entry, no intent): it cannot invalidate provenance or
 2625 |         // the recorded lineage, so the tagged gate admits it.
 2626 |         let mut manifest = sample_manifest_with_fragments(0..6);
 2627 |         manifest.reader_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
 2628 |         manifest.writer_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
 2629 |         let mut fri = sample_index_metadata(crate::system_index::frag_reuse::FRAG_REUSE_INDEX_NAME);
 2630 |         fri.fields.clear();
 2631 |         assert_eq!(
 2632 |             fri.fragment_bitmap.as_ref().unwrap(),
 2633 |             &roaring::RoaringBitmap::from_iter([0u32])
 2634 |         );
 2635 |         let transaction = Transaction::new(
 2636 |             manifest.version,
 2637 |             Operation::Rewrite {
 2638 |                 groups: vec![RewriteGroup {
 2639 |                     old_fragments: vec![Fragment::new(5)],
 2640 |                     new_fragments: vec![Fragment::new(10)],
 2641 |                 }],
 2642 |                 rewritten_indices: vec![],
 2643 |                 frag_reuse_index: None,
 2644 |             },
 2645 |             None,
 2646 |         );
 2647 |         let (_, final_indices) = transaction
 2648 |             .build_manifest(
 2649 |                 Some(&manifest),
 2650 |                 vec![fri.clone()],
 2651 |                 "txn",
 2652 |                 &default_build_config(),
 2653 |             )
 2654 |             .unwrap();
 2655 |         // The tagged entry rides through untouched.
 2656 |         assert!(final_indices.iter().any(|idx| idx.uuid == fri.uuid));
 2657 |     }
 2658 | 
 2659 |     #[test]
 2660 |     fn out_of_range_transition_source_id_rejected() {
 2661 |         // Fragment ids in the reuse domain are bounded by the row-address
 2662 |         // fragment space; an oversized id must error instead of silently
 2663 |         // truncating into an alias of another fragment.
 2664 |         let error = crate::transaction::reordered_sources(&[
 2665 |             crate::format::pb::fragment_reuse_index_details::Transition {
 2666 |                 sources: vec![
 2667 |                     crate::format::pb::fragment_reuse_index_details::FragmentDigest {
 2668 |                         id: u64::from(u32::MAX) + 1,
 2669 |                         physical_rows: 4,
 2670 |                         num_deleted_rows: 0,
 2671 |                     },
 2672 |                 ],
 2673 |                 destinations: vec![],
 2674 |                 mapping: None,
 2675 |             },
 2676 |         ])
 2677 |         .unwrap_err();
 2678 |         assert!(error.to_string().contains("row-address range"), "{error}");
 2679 |     }
 2680 | 
 2681 |     #[test]
 2682 |     fn tagged_history_allows_rewrite_appending_tagged_entry() {
 2683 |         let mut manifest = sample_manifest();
 2684 |         manifest.reader_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
 2685 |         manifest.writer_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
 2686 |         let mut current =
 2687 |             sample_index_metadata(crate::system_index::frag_reuse::FRAG_REUSE_INDEX_NAME);
 2688 |         current.fields.clear();
 2689 |         current.dataset_version = 7;
 2690 |         let mut appended =
 2691 |             sample_index_metadata(crate::system_index::frag_reuse::FRAG_REUSE_INDEX_NAME);
 2692 |         appended.fields.clear();
 2693 | 
 2694 |         let transaction = Transaction::new(
 2695 |             manifest.version,
 2696 |             Operation::Rewrite {
 2697 |                 groups: vec![],
 2698 |                 rewritten_indices: vec![],
 2699 |                 frag_reuse_index: Some(appended.clone()),
 2700 |             },
 2701 |             None,
 2702 |         );
 2703 |         let config = default_build_config();
 2704 |         let prepared = transaction
 2705 |             .prepare_indices(
 2706 |                 Some(&manifest),
 2707 |                 vec![current.clone()],
 2708 |                 &config,
 2709 |                 None,
 2710 |                 FragReuseUpdate::Rewrite(Arc::new(crate::transaction::TaggedRewriteAssembly {
 2711 |                     entry: appended.clone(),
 2712 |                     base_entry_version: Some(7),
 2713 |                     reordered_sources: RoaringBitmap::new(),
 2714 |                 })),
 2715 |             )
 2716 |             .unwrap();
 2717 |         let (new_manifest, final_indices) = transaction
 2718 |             .build_manifest_prepared(Some(&manifest), prepared, "txn", &config, None)
 2719 |             .unwrap();
 2720 |         // The assembled entry replaced the previous one by name.
 2721 |         let entries: Vec<_> = final_indices
 2722 |             .iter()
 2723 |             .filter(|idx| idx.name == crate::system_index::frag_reuse::FRAG_REUSE_INDEX_NAME)
 2724 |             .collect();
 2725 |         assert_eq!(entries.len(), 1);
 2726 |         assert_eq!(entries[0].uuid, appended.uuid);
 2727 |         assert_ne!(
 2728 |             new_manifest.reader_feature_flags & FLAG_FRAGMENT_REUSE_INDEX,
 2729 |             0
 2730 |         );
 2731 |     }
 2732 | 
 2733 |     #[test]
 2734 |     fn frag_reuse_rewrite_guards_base_entry_version() {
 2735 |         let mut manifest = sample_manifest();
 2736 |         manifest.reader_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
 2737 |         manifest.writer_feature_flags |= FLAG_FRAGMENT_REUSE_INDEX;
 2738 |         let mut current =
 2739 |             sample_index_metadata(crate::system_index::frag_reuse::FRAG_REUSE_INDEX_NAME);
 2740 |         current.fields.clear();
 2741 |         current.dataset_version = 7;
 2742 |         let mut appended =
 2743 |             sample_index_metadata(crate::system_index::frag_reuse::FRAG_REUSE_INDEX_NAME);
 2744 |         appended.fields.clear();
 2745 | 
 2746 |         // Assembled against a different entry (base None while the manifest
 2747 |         // holds version 7): splicing would replace that entry's transitions.
 2748 |         let transaction = Transaction::new(
 2749 |             manifest.version,
 2750 |             Operation::Rewrite {
 2751 |                 groups: vec![],
 2752 |                 rewritten_indices: vec![],
 2753 |                 frag_reuse_index: Some(appended.clone()),
 2754 |             },
 2755 |             None,
 2756 |         );
 2757 |         let config = default_build_config();
 2758 |         let prepared = transaction
 2759 |             .prepare_indices(
 2760 |                 Some(&manifest),
 2761 |                 vec![current],
 2762 |                 &config,
 2763 |                 None,
 2764 |                 FragReuseUpdate::Rewrite(Arc::new(crate::transaction::TaggedRewriteAssembly {
 2765 |                     entry: appended.clone(),
 2766 |                     base_entry_version: None,
 2767 |                     reordered_sources: RoaringBitmap::new(),
 2768 |                 })),
 2769 |             )
 2770 |             .unwrap();
 2771 |         let error = transaction
 2772 |             .build_manifest_prepared(Some(&manifest), prepared, "txn", &config, None)
 2773 |             .unwrap_err();
 2774 |         assert!(matches!(error, Error::InvalidInput { .. }), "{error}");
 2775 |         assert!(error.to_string().contains("rebuild"), "{error}");
 2776 |     }
 2777 | 
 2778 |     /// The preparation keeps the original list as read and withdraws on the
 2779 |     /// prepared list only; the build publishes exactly the prepared list.
 2780 |     #[rstest::rstest]
 2781 |     #[case::update("update")]
 2782 |     #[case::merge("merge")]
 2783 |     #[case::data_replacement("data_replacement")]
 2784 |     fn prepare_indices_keeps_original_and_withdraws_prepared(#[case] kind: &str) {
 2785 |         let manifest = manifest_with_file("a.lance");
 2786 |         let (segment, fri) = translating_segment_and_entry();
 2787 |         // A segment on the unrelated F6 -> F8 lineage is untouched.
 2788 |         let fri = {
 2789 |             let mut merged = fri;
 2790 |             merged.index_details = tagged_entry(&[(&[5], &[0]), (&[6], &[8])]).index_details;
 2791 |             merged.fragment_bitmap = Some([0u32, 5, 6, 8].into_iter().collect());
 2792 |             merged
 2793 |         };
 2794 |         let mut unrelated = sample_index_metadata("other_idx");
 2795 |         unrelated.fragment_bitmap = Some([6u32].into_iter().collect());
 2796 |         let transaction = Transaction::new(
 2797 |             manifest.version,
 2798 |             in_place_rewrite(kind, &manifest, vec![0]),
 2799 |             None,
 2800 |         );
 2801 |         let config = default_build_config();
 2802 |         let prepared = transaction
 2803 |             .prepare_indices(
 2804 |                 Some(&manifest),
 2805 |                 vec![segment.clone(), unrelated.clone(), fri.clone()],
 2806 |                 &config,
 2807 |                 None,
 2808 |                 FragReuseUpdate::None,
 2809 |             )
 2810 |             .unwrap();
 2811 |         assert_eq!(prepared.manifest_version(), Some(manifest.version));
 2812 |         assert_eq!(
 2813 |             prepared.original(),
 2814 |             &[segment.clone(), unrelated.clone(), fri],
 2815 |             "the original list is what was read"
 2816 |         );
 2817 |         let prepared_user = prepared
 2818 |             .prepared()
 2819 |             .iter()
 2820 |             .find(|idx| idx.uuid == segment.uuid)
 2821 |             .unwrap();
 2822 |         assert!(prepared_user.fragment_bitmap.as_ref().unwrap().is_empty());
 2823 |         let prepared_unrelated = prepared
 2824 |             .prepared()
 2825 |             .iter()
 2826 |             .find(|idx| idx.uuid == unrelated.uuid)
 2827 |             .unwrap();
 2828 |         assert_eq!(
 2829 |             prepared_unrelated.fragment_bitmap,
 2830 |             unrelated.fragment_bitmap
 2831 |         );
 2832 |         let (_, indices) = transaction
 2833 |             .build_manifest_prepared(Some(&manifest), prepared.clone(), "txn", &config, None)
 2834 |             .unwrap();
 2835 |         assert_eq!(indices, prepared.prepared());
 2836 |     }
 2837 | 
 2838 |     /// An ordinary table prepares the same way, pruning by fragment id.
 2839 |     #[rstest::rstest]
 2840 |     #[case::update("update")]
 2841 |     #[case::merge("merge")]
 2842 |     #[case::data_replacement("data_replacement")]
 2843 |     fn prepare_indices_prunes_by_id_on_an_untagged_table(#[case] kind: &str) {
 2844 |         let mut manifest = manifest_with_file("a.lance");
 2845 |         manifest.reader_feature_flags &= !FLAG_FRAGMENT_REUSE_INDEX;
 2846 |         manifest.writer_feature_flags &= !FLAG_FRAGMENT_REUSE_INDEX;
 2847 |         let mut segment = sample_index_metadata("id_idx");
 2848 |         segment.fragment_bitmap = Some([0u32, 3].into_iter().collect());
 2849 |         let transaction = Transaction::new(
 2850 |             manifest.version,
 2851 |             in_place_rewrite(kind, &manifest, vec![0]),
 2852 |             None,
 2853 |         );
 2854 |         let prepared = transaction
 2855 |             .prepare_indices(
 2856 |                 Some(&manifest),
 2857 |                 vec![segment.clone()],
 2858 |                 &default_build_config(),
 2859 |                 None,
 2860 |                 FragReuseUpdate::None,
 2861 |             )
 2862 |             .unwrap();
 2863 |         assert_eq!(prepared.original(), &[segment]);
 2864 |         assert_eq!(
 2865 |             prepared.prepared()[0].fragment_bitmap,
 2866 |             Some(RoaringBitmap::from_iter([3u32]))
 2867 |         );
 2868 |     }
 2869 | 
 2870 |     /// Operations that rewrite no column in place, `Restore` included,
 2871 |     /// prepare the list unchanged.
 2872 |     #[test]
 2873 |     fn prepare_indices_restore_and_non_rewrites_are_identity() {
 2874 |         let manifest = manifest_with_file("a.lance");
 2875 |         let (segment, fri) = translating_segment_and_entry();
 2876 |         for operation in [
 2877 |             Operation::Restore { version: 1 },
 2878 |             Operation::Append { fragments: vec![] },
 2879 |             Operation::Delete {
 2880 |                 updated_fragments: vec![],
 2881 |                 deleted_fragment_ids: vec![0],
 2882 |                 predicate: "true".into(),
 2883 |             },
 2884 |             in_place_rewrite("update", &manifest, vec![]),
 2885 |         ] {
 2886 |             let transaction = Transaction::new(manifest.version, operation, None);
 2887 |             let prepared = transaction
 2888 |                 .prepare_indices(
 2889 |                     Some(&manifest),
 2890 |                     vec![segment.clone(), fri.clone()],
 2891 |                     &default_build_config(),
 2892 |                     None,
 2893 |                     FragReuseUpdate::None,
 2894 |                 )
 2895 |                 .unwrap();
 2896 |             assert_eq!(prepared.prepared(), prepared.original());
 2897 |         }
 2898 |     }
 2899 | 
 2900 |     /// A history stored externally is walked only when the commit path
 2901 |     /// supplied the decoded ledger; without it the preparation refuses.
 2902 |     #[test]
 2903 |     fn prepare_indices_external_history_needs_the_supplied_ledger() {
 2904 |         let manifest = manifest_with_file("a.lance");
 2905 |         let (segment, fri) = translating_segment_and_entry();
 2906 |         let ledger = crate::system_index::frag_reuse::ledger::FragReuseLedger::decode_inline(
 2907 |             fri.index_version,
 2908 |             fri.index_details.as_ref().unwrap(),
 2909 |         )
 2910 |         .unwrap()
 2911 |         .unwrap();
 2912 |         let mut external = fri;
 2913 |         external.index_details = None;
 2914 |         let transaction = Transaction::new(
 2915 |             manifest.version,
 2916 |             in_place_rewrite("update", &manifest, vec![0]),
 2917 |             None,
 2918 |         );
 2919 |         let error = transaction
 2920 |             .prepare_indices(
 2921 |                 Some(&manifest),
 2922 |                 vec![segment.clone(), external.clone()],
 2923 |                 &default_build_config(),
 2924 |                 None,
 2925 |                 FragReuseUpdate::None,
 2926 |             )
 2927 |             .unwrap_err();
 2928 |         assert!(matches!(error, Error::InvalidInput { .. }), "{error}");
 2929 |         let prepared = transaction
 2930 |             .prepare_indices(
 2931 |                 Some(&manifest),
 2932 |                 vec![segment, external],
 2933 |                 &default_build_config(),
 2934 |                 Some(Arc::new(ledger)),
 2935 |                 FragReuseUpdate::None,
 2936 |             )
 2937 |             .unwrap();
 2938 |         assert!(user_bitmap(prepared.prepared()).is_empty());
 2939 |     }
 2940 | 
 2941 |     /// Corrupt inline details are an error of their own kind, never
 2942 |     /// "no lineage" and never a successful build.
 2943 |     #[test]
 2944 |     fn prepare_indices_corrupt_inline_details_is_an_error() {
 2945 |         let manifest = manifest_with_file("a.lance");
 2946 |         let (segment, mut fri) = translating_segment_and_entry();
 2947 |         let mut details = fri.index_details.as_ref().unwrap().as_ref().clone();
 2948 |         details.value = vec![0xff, 0xff, 0xff, 0xff, 0xff];
 2949 |         fri.index_details = Some(Arc::new(details));
 2950 |         let transaction = Transaction::new(
 2951 |             manifest.version,
 2952 |             in_place_rewrite("update", &manifest, vec![0]),
 2953 |             None,
 2954 |         );
 2955 |         let error = transaction
 2956 |             .prepare_indices(
 2957 |                 Some(&manifest),
 2958 |                 vec![segment.clone(), fri.clone()],
 2959 |                 &default_build_config(),
 2960 |                 None,
 2961 |                 FragReuseUpdate::None,
 2962 |             )
 2963 |             .unwrap_err();
 2964 |         assert!(
 2965 |             matches!(error, Error::CorruptFile { .. }),
 2966 |             "corrupt history must surface as corruption: {error:?}"
 2967 |         );
 2968 |         let error = transaction
 2969 |             .build_manifest(
 2970 |                 Some(&manifest),
 2971 |                 vec![segment, fri],
 2972 |                 "txn",
 2973 |                 &default_build_config(),
 2974 |             )
 2975 |             .unwrap_err();
 2976 |         assert!(matches!(error, Error::CorruptFile { .. }), "{error:?}");
 2977 |     }
 2978 | 
 2979 |     /// A result prepared against one manifest cannot build on another:
 2980 |     /// every attempt prepares against the manifest it builds on.
 2981 |     #[test]
 2982 |     fn build_manifest_prepared_refuses_a_result_prepared_against_another_manifest() {
 2983 |         let manifest = manifest_with_file("a.lance");
 2984 |         let (segment, fri) = translating_segment_and_entry();
 2985 |         let transaction = Transaction::new(
 2986 |             manifest.version,
 2987 |             in_place_rewrite("update", &manifest, vec![0]),
 2988 |             None,
 2989 |         );
 2990 |         let prepared = transaction
 2991 |             .prepare_indices(
 2992 |                 Some(&manifest),
 2993 |                 vec![segment, fri],
 2994 |                 &default_build_config(),
 2995 |                 None,
 2996 |                 FragReuseUpdate::None,
 2997 |             )
 2998 |             .unwrap();
 2999 |         let mut later = manifest;
 3000 |         later.version += 1;
 3001 |         let error = transaction
 3002 |             .build_manifest_prepared(Some(&later), prepared, "txn", &default_build_config(), None)
 3003 |             .unwrap_err();
 3004 |         assert!(matches!(error, Error::InvalidInput { .. }), "{error}");
 3005 |         assert!(error.to_string().contains("prepared against"), "{error}");
 3006 |     }
 3007 | 
 3008 |     /// The low-level entry cannot skip what the commit path settles: a
 3009 |     /// tagged rewrite entry is refused without the assembled update, whoever
 3010 |     /// prepared the list.
 3011 |     #[test]
 3012 |     fn build_manifest_prepared_still_runs_the_gate() {
 3013 |         let manifest = manifest_with_file("a.lance");
 3014 |         let (_, fri) = translating_segment_and_entry();
 3015 |         let mut appended = fri.clone();
 3016 |         appended.uuid = uuid::Uuid::new_v4();
 3017 |         let transaction = Transaction::new(
 3018 |             manifest.version,
 3019 |             Operation::Rewrite {
 3020 |                 groups: vec![],
 3021 |                 rewritten_indices: vec![],
 3022 |                 frag_reuse_index: Some(appended),
 3023 |             },
 3024 |             None,
 3025 |         );
 3026 |         let error = transaction
 3027 |             .prepare_indices(
 3028 |                 Some(&manifest),
 3029 |                 vec![fri.clone()],
 3030 |                 &default_build_config(),
 3031 |                 None,
 3032 |                 FragReuseUpdate::None,
 3033 |             )
 3034 |             .unwrap_err();
 3035 |         assert!(
 3036 |             error.to_string().contains("assembled by the commit path"),
 3037 |             "{error}"
 3038 |         );
 3039 |         let error = transaction
 3040 |             .build_manifest(Some(&manifest), vec![fri], "txn", &default_build_config())
 3041 |             .unwrap_err();
 3042 |         assert!(
 3043 |             error.to_string().contains("assembled by the commit path"),
 3044 |             "{error}"
 3045 |         );
 3046 |     }
 3047 | 
 3048 |     fn sample_manifest_with_fragments(ids: std::ops::Range<u64>) -> Manifest {
 3049 |         let schema = ArrowSchema::new(vec![ArrowField::new("id", DataType::Int32, false)]);
 3050 |         Manifest::new(
 3051 |             LanceSchema::try_from(&schema).unwrap(),
 3052 |             Arc::new(ids.map(Fragment::new).collect()),
 3053 |             DataStorageFormat::new(ConcreteFileVersion::V2_0),
 3054 |             HashMap::new(),
 3055 |         )
 3056 |     }
 3057 | 
 3058 |     #[test]
 3059 |     fn test_create_index_build_manifest_keeps_unremoved_same_name_indices() {
 3060 |         let manifest = sample_manifest();
 3061 |         let first_index = sample_index_metadata("vector_idx");
 3062 |         let second_index = sample_index_metadata("vector_idx");
 3063 |         let third_index = sample_index_metadata("vector_idx");
 3064 | 
 3065 |         let transaction = Transaction::new(
 3066 |             manifest.version,
 3067 |             Operation::CreateIndex {
 3068 |                 new_indices: vec![third_index.clone()],
 3069 |                 removed_indices: vec![second_index.clone()],
 3070 |             },
 3071 |             None,
 3072 |         );
 3073 | 
 3074 |         let (_, final_indices) = transaction
 3075 |             .build_manifest(
 3076 |                 Some(&manifest),
 3077 |                 vec![first_index.clone(), second_index.clone()],
 3078 |                 "txn",
 3079 |                 &default_build_config(),
 3080 |             )
 3081 |             .unwrap();
 3082 | 
 3083 |         assert_eq!(final_indices.len(), 2);
 3084 |         assert!(final_indices.iter().any(|idx| idx.uuid == first_index.uuid));
 3085 |         assert!(final_indices.iter().any(|idx| idx.uuid == third_index.uuid));
 3086 |         assert!(
 3087 |             !final_indices
 3088 |                 .iter()
 3089 |                 .any(|idx| idx.uuid == second_index.uuid)
 3090 |         );
 3091 |     }
 3092 | 
 3093 |     #[test]
 3094 |     fn test_create_index_build_manifest_deduplicates_relisted_indices_by_uuid() {
 3095 |         let manifest = sample_manifest();
 3096 |         let first_index = sample_index_metadata("vector_idx");
 3097 |         let second_index = sample_index_metadata("vector_idx");
 3098 |         let third_index = sample_index_metadata("vector_idx");
 3099 | 
 3100 |         let transaction = Transaction::new(
 3101 |             manifest.version,
 3102 |             Operation::CreateIndex {
 3103 |                 new_indices: vec![first_index.clone(), third_index.clone()],
 3104 |                 removed_indices: vec![second_index.clone()],
 3105 |             },
 3106 |             None,
 3107 |         );
 3108 | 
 3109 |         let (_, final_indices) = transaction
 3110 |             .build_manifest(
 3111 |                 Some(&manifest),
 3112 |                 vec![first_index.clone(), second_index.clone()],
 3113 |                 "txn",
 3114 |                 &default_build_config(),
 3115 |             )
 3116 |             .unwrap();
 3117 | 
 3118 |         assert_eq!(final_indices.len(), 2);
 3119 |         assert_eq!(
 3120 |             final_indices
 3121 |                 .iter()
 3122 |                 .filter(|idx| idx.uuid == first_index.uuid)
 3123 |                 .count(),
 3124 |             1
 3125 |         );
 3126 |         assert!(final_indices.iter().any(|idx| idx.uuid == third_index.uuid));
 3127 |         assert!(
 3128 |             !final_indices
 3129 |                 .iter()
 3130 |                 .any(|idx| idx.uuid == second_index.uuid)
 3131 |         );
 3132 |     }
 3133 | 
 3134 |     #[test]
 3135 |     fn test_update_build_manifest_replaces_and_removes_fragments() {
 3136 |         let manifest = sample_manifest_with_fragments(0..5);
 3137 | 
 3138 |         let mut updated2 = Fragment::new(2);
 3139 |         updated2.physical_rows = Some(42);
 3140 |         let mut updated4 = Fragment::new(4);
 3141 |         updated4.physical_rows = Some(43);
 3142 | 
 3143 |         let transaction = Transaction::new(
 3144 |             manifest.version,
 3145 |             Operation::Update {
 3146 |                 removed_fragment_ids: vec![1],
 3147 |                 // Fragment 99 does not exist in the dataset; it must be ignored,
 3148 |                 // not appended.
 3149 |                 updated_fragments: vec![updated2, updated4, Fragment::new(99)],
 3150 |                 new_fragments: vec![],
 3151 |                 fields_modified: vec![],
 3152 |                 compacted_sstables: vec![],
 3153 |                 fields_for_preserving_frag_bitmap: vec![],
 3154 |                 update_mode: None,
 3155 |                 inserted_rows_filter: None,
 3156 |                 updated_fragment_offsets: None,
 3157 |             },
 3158 |             None,
 3159 |         );
 3160 | 
 3161 |         let (new_manifest, _) = transaction
 3162 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 3163 |             .unwrap();
 3164 | 
 3165 |         let ids: Vec<u64> = new_manifest.fragments.iter().map(|f| f.id).collect();
 3166 |         assert_eq!(ids, vec![0, 2, 3, 4]);
 3167 |         let rows: Vec<Option<usize>> = new_manifest
 3168 |             .fragments
 3169 |             .iter()
 3170 |             .map(|f| f.physical_rows)
 3171 |             .collect();
 3172 |         assert_eq!(rows, vec![None, Some(42), None, Some(43)]);
 3173 |     }
 3174 | 
 3175 |     #[rstest::rstest]
 3176 |     #[case::unspecified(None)]
 3177 |     #[case::rewrite_rows(Some(UpdateMode::RewriteRows))]
 3178 |     #[case::rewrite_columns(Some(UpdateMode::RewriteColumns))]
 3179 |     fn test_update_build_manifest_does_not_restore_projected_files(
 3180 |         #[case] update_mode: Option<UpdateMode>,
 3181 |         #[values(false, true)] with_spilled_lineage: bool,
 3182 |     ) {
 3183 |         let mut manifest = sample_manifest_with_fragments(0..3);
 3184 |         if with_spilled_lineage {
 3185 |             manifest.reader_feature_flags = FLAG_STABLE_ROW_IDS;
 3186 |             manifest.writer_feature_flags = FLAG_STABLE_ROW_IDS;
 3187 |             manifest.next_row_id = 126;
 3188 |             for fragment in Arc::make_mut(&mut manifest.fragments) {
 3189 |                 let start = fragment.id * 42;
 3190 |                 fragment.physical_rows = Some(42);
 3191 |                 fragment.row_id_meta = Some(RowIdMeta::Inline(
 3192 |                     write_row_ids(&RowIdSequence::from(start..start + 42)).into(),
 3193 |                 ));
 3194 |             }
 3195 |         }
 3196 |         let projected_file = DataFile::new(
 3197 |             "projected.lance",
 3198 |             vec![0],
 3199 |             vec![0],
 3200 |             ConcreteFileVersion::V2_0,
 3201 |             None,
 3202 |             None,
 3203 |         );
 3204 |         Arc::make_mut(&mut manifest.fragments)[1].files = vec![projected_file.clone()];
 3205 | 
 3206 |         // Model an update staged before a projection removed field 1's file.
 3207 |         let mut updated = manifest.fragments[1].clone();
 3208 |         updated.files.push(DataFile::new(
 3209 |             "dropped.lance",
 3210 |             vec![1],
 3211 |             vec![0],
 3212 |             ConcreteFileVersion::V2_0,
 3213 |             None,
 3214 |             None,
 3215 |         ));
 3216 |         updated.physical_rows = Some(42);
 3217 |         let inserted_projected_file = DataFile::new(
 3218 |             "inserted-projected.lance",
 3219 |             vec![0],
 3220 |             vec![0],
 3221 |             ConcreteFileVersion::V2_0,
 3222 |             None,
 3223 |             None,
 3224 |         );
 3225 |         let mut inserted = Fragment::new(0);
 3226 |         inserted.physical_rows = Some(42);
 3227 |         inserted.files = vec![
 3228 |             inserted_projected_file.clone(),
 3229 |             DataFile::new(
 3230 |                 "inserted-dropped.lance",
 3231 |                 vec![1],
 3232 |                 vec![0],
 3233 |                 ConcreteFileVersion::V2_0,
 3234 |                 None,
 3235 |                 None,
 3236 |             ),
 3237 |         ];
 3238 | 
 3239 |         let mut expected_updated_files = vec![projected_file];
 3240 |         let mut expected_inserted_files = vec![inserted_projected_file];
 3241 |         if with_spilled_lineage {
 3242 |             // Separate carriers ensure each lineage kind is retained even when
 3243 |             // the file has no field from the live schema.
 3244 |             for (fragment, expected_files) in [
 3245 |                 (&mut updated, &mut expected_updated_files),
 3246 |                 (&mut inserted, &mut expected_inserted_files),
 3247 |             ] {
 3248 |                 fragment.row_id_meta = Some(RowIdMeta::Column);
 3249 |                 fragment.created_at_version_meta = Some(RowDatasetVersionMeta::Column);
 3250 |                 fragment.last_updated_at_version_meta = Some(RowDatasetVersionMeta::Column);
 3251 |                 for field_id in [
 3252 |                     ROW_ID_FIELD_ID,
 3253 |                     ROW_CREATED_AT_VERSION_FIELD_ID,
 3254 |                     ROW_LAST_UPDATED_AT_VERSION_FIELD_ID,
 3255 |                 ] {
 3256 |                     let file = DataFile::new(
 3257 |                         format!("lineage-{field_id}.lance"),
 3258 |                         vec![field_id],
 3259 |                         vec![0],
 3260 |                         ConcreteFileVersion::V2_0,
 3261 |                         None,
 3262 |                         None,
 3263 |                     );
 3264 |                     fragment.files.push(file.clone());
 3265 |                     expected_files.push(file);
 3266 |                 }
 3267 |             }
 3268 |         }
 3269 | 
 3270 |         let transaction = Transaction::new(
 3271 |             manifest.version,
 3272 |             Operation::Update {
 3273 |                 removed_fragment_ids: vec![],
 3274 |                 updated_fragments: vec![updated],
 3275 |                 new_fragments: vec![inserted],
 3276 |                 fields_modified: vec![1],
 3277 |                 compacted_sstables: vec![],
 3278 |                 fields_for_preserving_frag_bitmap: vec![],
 3279 |                 update_mode,
 3280 |                 inserted_rows_filter: None,
 3281 |                 updated_fragment_offsets: None,
 3282 |             },
 3283 |             None,
 3284 |         );
 3285 | 
 3286 |         let (new_manifest, _) = transaction
 3287 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 3288 |             .unwrap();
 3289 | 
 3290 |         let fragment = &new_manifest.fragments[1];
 3291 |         assert_eq!(fragment.files, expected_updated_files);
 3292 |         assert_eq!(fragment.physical_rows, Some(42));
 3293 |         assert_eq!(new_manifest.fragments[3].files, expected_inserted_files);
 3294 |         assert_eq!(new_manifest.max_field_id(), 0);
 3295 |     }
 3296 | 
 3297 |     #[test]
 3298 |     fn test_delete_build_manifest_applies_deletion_to_current_fragment() {
 3299 |         let mut manifest = sample_manifest_with_fragments(0..5);
 3300 |         manifest.version = 2;
 3301 |         let projected_file = DataFile::new_legacy_from_fields("projected.lance", vec![0], None);
 3302 |         let current_fragment = &mut Arc::make_mut(&mut manifest.fragments)[2];
 3303 |         current_fragment.files = vec![projected_file.clone()];
 3304 |         current_fragment.physical_rows = Some(42);
 3305 |         current_fragment.overlays = vec![overlay_with_field(0, 2)];
 3306 |         current_fragment.last_updated_at_version_meta = Some(
 3307 |             RowDatasetVersionMeta::from_sequence(
 3308 |                 &RowDatasetVersionSequence::from_uniform_row_count(42, 2),
 3309 |             )
 3310 |             .unwrap(),
 3311 |         );
 3312 | 
 3313 |         // Model a delete staged before a projection removed field 1's file.
 3314 |         let mut updated2 = Fragment::new(2);
 3315 |         updated2.physical_rows = Some(42);
 3316 |         updated2.files = vec![
 3317 |             projected_file.clone(),
 3318 |             DataFile::new_legacy_from_fields("dropped.lance", vec![1], None),
 3319 |         ];
 3320 |         let deletion_file = DeletionFile {
 3321 |             read_version: 1,
 3322 |             id: 10,
 3323 |             file_type: DeletionFileType::Array,
 3324 |             num_deleted_rows: Some(1),
 3325 |             base_id: None,
 3326 |         };
 3327 |         updated2.deletion_file = Some(deletion_file.clone());
 3328 | 
 3329 |         let transaction = Transaction::new(
 3330 |             1,
 3331 |             Operation::Delete {
 3332 |                 updated_fragments: vec![updated2],
 3333 |                 deleted_fragment_ids: vec![1, 3],
 3334 |                 predicate: "id > 0".to_string(),
 3335 |             },
 3336 |             None,
 3337 |         );
 3338 | 
 3339 |         let (new_manifest, _) = transaction
 3340 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 3341 |             .unwrap();
 3342 | 
 3343 |         let ids: Vec<u64> = new_manifest.fragments.iter().map(|f| f.id).collect();
 3344 |         assert_eq!(ids, vec![0, 2, 4]);
 3345 |         let fragment2 = new_manifest
 3346 |             .fragments
 3347 |             .iter()
 3348 |             .find(|fragment| fragment.id == 2)
 3349 |             .unwrap();
 3350 |         assert_eq!(fragment2.files, vec![projected_file]);
 3351 |         assert_eq!(fragment2.deletion_file, Some(deletion_file));
 3352 |         assert_eq!(fragment2.overlays.len(), 1);
 3353 |         assert_eq!(fragment2.overlays[0].committed_version, 2);
 3354 |         assert_eq!(fragment2.physical_rows, Some(42));
 3355 |         assert_eq!(new_manifest.max_field_id(), 0);
 3356 |         assert_eq!(last_updated_at_versions(&new_manifest, 2), vec![2; 42]);
 3357 |     }
 3358 | 
 3359 |     #[test]
 3360 |     fn test_remove_tombstoned_data_files() {
 3361 |         // Create a fragment with mixed data files: some normal, some fully tombstoned
 3362 |         let mut fragment = Fragment::new(1);
 3363 | 
 3364 |         // Add a normal data file with valid field IDs
 3365 |         fragment.files.push(DataFile {
 3366 |             path: "normal.lance".to_string(),
 3367 |             fields: Arc::from([1, 2, 3]),
 3368 |             column_indices: Arc::from([]),
 3369 |             file_major_version: 2,
 3370 |             file_minor_version: 0,
 3371 |             file_size_bytes: CachedFileSize::new(1000),
 3372 |             base_id: None,
 3373 |         });
 3374 | 
 3375 |         // Add a data file with all fields tombstoned
 3376 |         fragment.files.push(DataFile {
 3377 |             path: "all_tombstoned.lance".to_string(),
 3378 |             fields: Arc::from([-2, -2, -2]),
 3379 |             column_indices: Arc::from([]),
 3380 |             file_major_version: 2,
 3381 |             file_minor_version: 0,
 3382 |             file_size_bytes: CachedFileSize::new(500),
 3383 |             base_id: None,
 3384 |         });
 3385 | 
 3386 |         // Add a data file with mixed tombstoned and valid fields
 3387 |         fragment.files.push(DataFile {
 3388 |             path: "mixed.lance".to_string(),
 3389 |             fields: Arc::from([4, -2, 5]),
 3390 |             column_indices: Arc::from([]),
 3391 |             file_major_version: 2,
 3392 |             file_minor_version: 0,
 3393 |             file_size_bytes: CachedFileSize::new(750),
 3394 |             base_id: None,
 3395 |         });
 3396 | 
 3397 |         // Add another fully tombstoned file
 3398 |         fragment.files.push(DataFile {
 3399 |             path: "another_tombstoned.lance".to_string(),
 3400 |             fields: Arc::from([-2_i32]),
 3401 |             column_indices: Arc::from([]),
 3402 |             file_major_version: 2,
 3403 |             file_minor_version: 0,
 3404 |             file_size_bytes: CachedFileSize::new(250),
 3405 |             base_id: None,
 3406 |         });
 3407 | 
 3408 |         let mut fragments = vec![fragment];
 3409 | 
 3410 |         // Apply the cleanup
 3411 |         Transaction::remove_tombstoned_data_files(&mut fragments);
 3412 | 
 3413 |         // Should have removed the two fully tombstoned files
 3414 |         assert_eq!(fragments[0].files.len(), 2);
 3415 |         assert_eq!(fragments[0].files[0].path, "normal.lance");
 3416 |         assert_eq!(fragments[0].files[1].path, "mixed.lance");
 3417 |     }
 3418 | 
 3419 |     /// When a fragment has no existing last_updated_at_version_meta (None), a
 3420 |     /// partial RewriteColumns refresh must leave it as None rather than fabricating
 3421 |     /// prev_version for unmatched rows.
 3422 |     #[test]
 3423 |     fn test_partial_rewrite_skips_fragment_with_no_version_meta() {
 3424 |         let row_ids = RowIdSequence::from([10u64, 11, 12, 13, 14].as_slice());
 3425 |         let row_id_meta = Some(RowIdMeta::Inline(write_row_ids(&row_ids).into()));
 3426 | 
 3427 |         let data_file = DataFile::new(
 3428 |             "data.lance",
 3429 |             vec![0],
 3430 |             vec![0],
 3431 |             LanceFileVersion::Stable.resolve(),
 3432 |             None,
 3433 |             None,
 3434 |         );
 3435 | 
 3436 |         let fragment = Fragment {
 3437 |             id: 1,
 3438 |             files: vec![data_file],
 3439 |             overlays: vec![],
 3440 |             deletion_file: None,
 3441 |             row_id_meta,
 3442 |             physical_rows: Some(5),
 3443 |             last_updated_at_version_meta: None,
 3444 |             created_at_version_meta: None,
 3445 |         };
 3446 | 
 3447 |         let manifest = make_stable_row_id_manifest(vec![fragment.clone()]);
 3448 | 
 3449 |         // Simulate a RewriteColumns update that matched offsets 1 and 3
 3450 |         let off_map = HashMap::from([(1u64, RoaringBitmap::from_iter([1u32, 3]))]);
 3451 |         let tx = Transaction::new(
 3452 |             manifest.version,
 3453 |             Operation::Update {
 3454 |                 removed_fragment_ids: vec![],
 3455 |                 updated_fragments: vec![fragment],
 3456 |                 new_fragments: vec![],
 3457 |                 fields_modified: vec![],
 3458 |                 compacted_sstables: vec![],
 3459 |                 fields_for_preserving_frag_bitmap: vec![],
 3460 |                 update_mode: Some(UpdateMode::RewriteColumns),
 3461 |                 inserted_rows_filter: None,
 3462 |                 updated_fragment_offsets: Some(UpdatedFragmentOffsets(off_map)),
 3463 |             },
 3464 |             None,
 3465 |         );
 3466 | 
 3467 |         let (out, _) = tx
 3468 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 3469 |             .unwrap();
 3470 | 
 3471 |         assert!(
 3472 |             out.fragments[0].last_updated_at_version_meta.is_none(),
 3473 |             "fragment with no prior version metadata must not have fabricated prev_version stamped on unmatched rows"
 3474 |         );
 3475 |     }
 3476 | 
 3477 |     #[test]
 3478 |     fn test_bitmap_cardinality_exceeds_physical_rows() {
 3479 |         let row_ids = RowIdSequence::from([10u64, 11, 12, 13, 14].as_slice());
 3480 |         let row_id_meta = Some(RowIdMeta::Inline(write_row_ids(&row_ids).into()));
 3481 | 
 3482 |         let data_file = DataFile::new(
 3483 |             "data.lance",
 3484 |             vec![0],
 3485 |             vec![0],
 3486 |             LanceFileVersion::Stable.resolve(),
 3487 |             None,
 3488 |             None,
 3489 |         );
 3490 | 
 3491 |         let version_seq = RowDatasetVersionSequence::from_uniform_row_count(5, 1);
 3492 |         let version_meta = RowDatasetVersionMeta::from_sequence(&version_seq).unwrap();
 3493 | 
 3494 |         let fragment = Fragment {
 3495 |             id: 1,
 3496 |             files: vec![data_file],
 3497 |             overlays: vec![],
 3498 |             deletion_file: None,
 3499 |             row_id_meta,
 3500 |             physical_rows: Some(5),
 3501 |             last_updated_at_version_meta: Some(version_meta.clone()),
 3502 |             created_at_version_meta: Some(version_meta),
 3503 |         };
 3504 | 
 3505 |         let manifest = make_stable_row_id_manifest(vec![fragment.clone()]);
 3506 | 
 3507 |         // Bitmap with 10 offsets but fragment only has 5 physical rows.
 3508 |         let off_map = HashMap::from([(1u64, RoaringBitmap::from_iter(0u32..10))]);
 3509 |         let tx = Transaction::new(
 3510 |             manifest.version,
 3511 |             Operation::Update {
 3512 |                 removed_fragment_ids: vec![],
 3513 |                 updated_fragments: vec![fragment],
 3514 |                 new_fragments: vec![],
 3515 |                 fields_modified: vec![],
 3516 |                 compacted_sstables: vec![],
 3517 |                 fields_for_preserving_frag_bitmap: vec![],
 3518 |                 update_mode: Some(UpdateMode::RewriteColumns),
 3519 |                 inserted_rows_filter: None,
 3520 |                 updated_fragment_offsets: Some(UpdatedFragmentOffsets(off_map)),
 3521 |             },
 3522 |             None,
 3523 |         );
 3524 | 
 3525 |         let result = tx.build_manifest(Some(&manifest), vec![], "txn", &default_build_config());
 3526 |         assert!(result.is_err());
 3527 |         let msg = result.unwrap_err().to_string();
 3528 |         assert!(
 3529 |             msg.contains("cardinality"),
 3530 |             "expected cardinality error, got: {msg}"
 3531 |         );
 3532 |     }
 3533 | 
 3534 |     #[test]
 3535 |     fn test_bitmap_max_offset_exceeds_physical_rows() {
 3536 |         let row_ids = RowIdSequence::from([10u64, 11, 12, 13, 14].as_slice());
 3537 |         let row_id_meta = Some(RowIdMeta::Inline(write_row_ids(&row_ids).into()));
 3538 | 
 3539 |         let data_file = DataFile::new(
 3540 |             "data.lance",
 3541 |             vec![0],
 3542 |             vec![0],
 3543 |             LanceFileVersion::Stable.resolve(),
 3544 |             None,
 3545 |             None,
 3546 |         );
 3547 | 
 3548 |         let version_seq = RowDatasetVersionSequence::from_uniform_row_count(5, 1);
 3549 |         let version_meta = RowDatasetVersionMeta::from_sequence(&version_seq).unwrap();
 3550 | 
 3551 |         let fragment = Fragment {
 3552 |             id: 1,
 3553 |             files: vec![data_file],
 3554 |             overlays: vec![],
 3555 |             deletion_file: None,
 3556 |             row_id_meta,
 3557 |             physical_rows: Some(5),
 3558 |             last_updated_at_version_meta: Some(version_meta.clone()),
 3559 |             created_at_version_meta: Some(version_meta),
 3560 |         };
 3561 | 
 3562 |         let manifest = make_stable_row_id_manifest(vec![fragment.clone()]);
 3563 | 
 3564 |         // Only 2 offsets (within cardinality) but max offset 100 exceeds physical_rows 5.
 3565 |         let off_map = HashMap::from([(1u64, RoaringBitmap::from_iter([0u32, 100]))]);
 3566 |         let tx = Transaction::new(
 3567 |             manifest.version,
 3568 |             Operation::Update {
 3569 |                 removed_fragment_ids: vec![],
 3570 |                 updated_fragments: vec![fragment],
 3571 |                 new_fragments: vec![],
 3572 |                 fields_modified: vec![],
 3573 |                 compacted_sstables: vec![],
 3574 |                 fields_for_preserving_frag_bitmap: vec![],
 3575 |                 update_mode: Some(UpdateMode::RewriteColumns),
 3576 |                 inserted_rows_filter: None,
 3577 |                 updated_fragment_offsets: Some(UpdatedFragmentOffsets(off_map)),
 3578 |             },
 3579 |             None,
 3580 |         );
 3581 | 
 3582 |         let result = tx.build_manifest(Some(&manifest), vec![], "txn", &default_build_config());
 3583 |         assert!(result.is_err());
 3584 |         let msg = result.unwrap_err().to_string();
 3585 |         assert!(
 3586 |             msg.contains("max offset"),
 3587 |             "expected max offset error, got: {msg}"
 3588 |         );
 3589 |     }
 3590 | 
 3591 |     #[test]
 3592 |     fn test_bitmap_at_exact_physical_rows_boundary_succeeds() {
 3593 |         let row_ids = RowIdSequence::from([10u64, 11, 12, 13, 14].as_slice());
 3594 |         let row_id_meta = Some(RowIdMeta::Inline(write_row_ids(&row_ids).into()));
 3595 | 
 3596 |         let data_file = DataFile::new(
 3597 |             "data.lance",
 3598 |             vec![0],
 3599 |             vec![0],
 3600 |             LanceFileVersion::Stable.resolve(),
 3601 |             None,
 3602 |             None,
 3603 |         );
 3604 | 
 3605 |         let version_seq = RowDatasetVersionSequence::from_uniform_row_count(5, 1);
 3606 |         let version_meta = RowDatasetVersionMeta::from_sequence(&version_seq).unwrap();
 3607 | 
 3608 |         let fragment = Fragment {
 3609 |             id: 1,
 3610 |             files: vec![data_file],
 3611 |             overlays: vec![],
 3612 |             deletion_file: None,
 3613 |             row_id_meta,
 3614 |             physical_rows: Some(5),
 3615 |             last_updated_at_version_meta: Some(version_meta.clone()),
 3616 |             created_at_version_meta: Some(version_meta),
 3617 |         };
 3618 | 
 3619 |         let manifest = make_stable_row_id_manifest(vec![fragment.clone()]);
 3620 | 
 3621 |         // All 5 offsets on a 5-row fragment — exactly at the boundary, should succeed.
 3622 |         let off_map = HashMap::from([(1u64, RoaringBitmap::from_iter(0u32..5))]);
 3623 |         let tx = Transaction::new(
 3624 |             manifest.version,
 3625 |             Operation::Update {
 3626 |                 removed_fragment_ids: vec![],
 3627 |                 updated_fragments: vec![fragment],
 3628 |                 new_fragments: vec![],
 3629 |                 fields_modified: vec![],
 3630 |                 compacted_sstables: vec![],
 3631 |                 fields_for_preserving_frag_bitmap: vec![],
 3632 |                 update_mode: Some(UpdateMode::RewriteColumns),
 3633 |                 inserted_rows_filter: None,
 3634 |                 updated_fragment_offsets: Some(UpdatedFragmentOffsets(off_map)),
 3635 |             },
 3636 |             None,
 3637 |         );
 3638 | 
 3639 |         tx.build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 3640 |             .expect("bitmap at exact physical_rows boundary should succeed");
 3641 |     }
 3642 | 
 3643 |     #[test]
 3644 |     fn test_updated_fragment_offsets_key_not_in_updated_fragments_is_rejected() {
 3645 |         // Fragment A is being rewritten; fragment B exists in the manifest but is
 3646 |         // NOT in updated_fragments. Supplying an offset key for B must be rejected
 3647 |         // so that B's version metadata cannot be stamped by an unrelated commit.
 3648 |         let make_fragment = |id: u64| {
 3649 |             let row_ids = RowIdSequence::from([id * 10].as_slice());
 3650 |             let row_id_meta = Some(RowIdMeta::Inline(write_row_ids(&row_ids).into()));
 3651 |             Fragment {
 3652 |                 id,
 3653 |                 files: vec![DataFile::new(
 3654 |                     format!("{id}.lance"),
 3655 |                     vec![0],
 3656 |                     vec![0],
 3657 |                     LanceFileVersion::Stable.resolve(),
 3658 |                     None,
 3659 |                     None,
 3660 |                 )],
 3661 |                 overlays: vec![],
 3662 |                 deletion_file: None,
 3663 |                 row_id_meta,
 3664 |                 physical_rows: Some(5),
 3665 |                 last_updated_at_version_meta: None,
 3666 |                 created_at_version_meta: None,
 3667 |             }
 3668 |         };
 3669 | 
 3670 |         let frag_a = make_fragment(1);
 3671 |         let frag_b = make_fragment(2);
 3672 |         let manifest = make_stable_row_id_manifest(vec![frag_a.clone(), frag_b.clone()]);
 3673 | 
 3674 |         // updated_fragments contains only A; offsets are keyed to B — must fail.
 3675 |         let off_map = HashMap::from([(frag_b.id, RoaringBitmap::from_iter([0u32, 1, 2]))]);
 3676 |         let operation = Operation::Update {
 3677 |             removed_fragment_ids: vec![],
 3678 |             updated_fragments: vec![frag_a],
 3679 |             new_fragments: vec![],
 3680 |             fields_modified: vec![],
 3681 |             compacted_sstables: vec![],
 3682 |             fields_for_preserving_frag_bitmap: vec![],
 3683 |             update_mode: Some(UpdateMode::RewriteColumns),
 3684 |             inserted_rows_filter: None,
 3685 |             updated_fragment_offsets: Some(UpdatedFragmentOffsets(off_map)),
 3686 |         };
 3687 | 
 3688 |         let err = validate_operation(Some(&manifest), &operation).unwrap_err();
 3689 |         assert!(
 3690 |             err.to_string().contains("not in updated_fragments"),
 3691 |             "expected key-presence error, got: {err}"
 3692 |         );
 3693 |     }
 3694 | 
 3695 |     #[test]
 3696 |     fn test_proto_round_trip_field_10() {
 3697 |         let off_map = HashMap::from([
 3698 |             (1u64, RoaringBitmap::from_iter([1u32, 3, 5])),
 3699 |             (2u64, RoaringBitmap::from_iter([0u32, 2, 4, 6])),
 3700 |         ]);
 3701 |         let tx = Transaction::new(
 3702 |             1,
 3703 |             Operation::Update {
 3704 |                 removed_fragment_ids: vec![],
 3705 |                 updated_fragments: vec![],
 3706 |                 new_fragments: vec![],
 3707 |                 fields_modified: vec![],
 3708 |                 compacted_sstables: vec![],
 3709 |                 fields_for_preserving_frag_bitmap: vec![],
 3710 |                 update_mode: Some(UpdateMode::RewriteColumns),
 3711 |                 inserted_rows_filter: None,
 3712 |                 updated_fragment_offsets: Some(UpdatedFragmentOffsets(off_map.clone())),
 3713 |             },
 3714 |             None,
 3715 |         );
 3716 | 
 3717 |         let pb_tx: pb::Transaction = pb::Transaction::from(&tx);
 3718 | 
 3719 |         // Field 9 must be empty; field 10 must be populated.
 3720 |         if let Some(pb::transaction::Operation::Update(ref update)) = pb_tx.operation {
 3721 |             assert!(
 3722 |                 update.updated_fragment_offsets.is_empty(),
 3723 |                 "field 9 should be empty"
 3724 |             );
 3725 |             assert_eq!(update.updated_fragment_offset_bitmaps.len(), 2);
 3726 |         } else {
 3727 |             panic!("expected Update operation");
 3728 |         }
 3729 | 
 3730 |         let tx2 = Transaction::try_from(pb_tx).unwrap();
 3731 |         if let Operation::Update {
 3732 |             updated_fragment_offsets: Some(UpdatedFragmentOffsets(m)),
 3733 |             ..
 3734 |         } = &tx2.operation
 3735 |         {
 3736 |             assert_eq!(m.len(), 2);
 3737 |             assert_eq!(*m.get(&1).unwrap(), off_map[&1]);
 3738 |             assert_eq!(*m.get(&2).unwrap(), off_map[&2]);
 3739 |         } else {
 3740 |             panic!("expected Update with offsets");
 3741 |         }
 3742 |     }
 3743 | 
 3744 |     #[test]
 3745 |     fn test_proto_legacy_field_9_read() {
 3746 |         // Simulate a manifest written by old Lance: only field 9, no field 10.
 3747 |         let pb_tx = pb::Transaction {
 3748 |             read_version: 1,
 3749 |             uuid: "test".to_string(),
 3750 |             tag: String::new(),
 3751 |             transaction_properties: HashMap::new(),
 3752 |             operation: Some(pb::transaction::Operation::Update(
 3753 |                 pb::transaction::Update {
 3754 |                     removed_fragment_ids: vec![],
 3755 |                     updated_fragments: vec![],
 3756 |                     new_fragments: vec![],
 3757 |                     fields_modified: vec![],
 3758 |                     compacted_sstables: vec![],
 3759 |                     fields_for_preserving_frag_bitmap: vec![],
 3760 |                     update_mode: 1,
 3761 |                     inserted_rows: None,
 3762 |                     updated_fragment_offsets: HashMap::from([(
 3763 |                         1u64,
 3764 |                         pb::transaction::UInt32List {
 3765 |                             values: vec![1, 3, 5],
 3766 |                         },
 3767 |                     )]),
 3768 |                     updated_fragment_offset_bitmaps: HashMap::new(),
 3769 |                 },
 3770 |             )),
 3771 |         };
 3772 | 
 3773 |         let tx = Transaction::try_from(pb_tx).unwrap();
 3774 |         if let Operation::Update {
 3775 |             updated_fragment_offsets: Some(UpdatedFragmentOffsets(m)),
 3776 |             ..
 3777 |         } = &tx.operation
 3778 |         {
 3779 |             assert_eq!(m.len(), 1);
 3780 |             let bitmap = m.get(&1).unwrap();
 3781 |             let offsets: Vec<u32> = bitmap.iter().collect();
 3782 |             assert_eq!(offsets, vec![1, 3, 5]);
 3783 |         } else {
 3784 |             panic!("expected Update with offsets from legacy field 9");
 3785 |         }
 3786 |     }
 3787 | 
 3788 |     #[test]
 3789 |     fn test_proto_field_10_takes_precedence_over_field_9() {
 3790 |         // When both fields present, field 10 wins.
 3791 |         let mut bitmap_bytes = Vec::new();
 3792 |         RoaringBitmap::from_iter([10u32, 20, 30])
 3793 |             .serialize_into(&mut bitmap_bytes)
 3794 |             .unwrap();
 3795 | 
 3796 |         let pb_tx = pb::Transaction {
 3797 |             read_version: 1,
 3798 |             uuid: "test".to_string(),
 3799 |             tag: String::new(),
 3800 |             transaction_properties: HashMap::new(),
 3801 |             operation: Some(pb::transaction::Operation::Update(
 3802 |                 pb::transaction::Update {
 3803 |                     removed_fragment_ids: vec![],
 3804 |                     updated_fragments: vec![],
 3805 |                     new_fragments: vec![],
 3806 |                     fields_modified: vec![],
 3807 |                     compacted_sstables: vec![],
 3808 |                     fields_for_preserving_frag_bitmap: vec![],
 3809 |                     update_mode: 1,
 3810 |                     inserted_rows: None,
 3811 |                     // Field 9 has different values than field 10.
 3812 |                     updated_fragment_offsets: HashMap::from([(
 3813 |                         1u64,
 3814 |                         pb::transaction::UInt32List {
 3815 |                             values: vec![99, 100],
 3816 |                         },
 3817 |                     )]),
 3818 |                     updated_fragment_offset_bitmaps: HashMap::from([(1u64, bitmap_bytes)]),
 3819 |                 },
 3820 |             )),
 3821 |         };
 3822 | 
 3823 |         let tx = Transaction::try_from(pb_tx).unwrap();
 3824 |         if let Operation::Update {
 3825 |             updated_fragment_offsets: Some(UpdatedFragmentOffsets(m)),
 3826 |             ..
 3827 |         } = &tx.operation
 3828 |         {
 3829 |             let offsets: Vec<u32> = m.get(&1).unwrap().iter().collect();
 3830 |             assert_eq!(offsets, vec![10, 20, 30], "field 10 should take precedence");
 3831 |         } else {
 3832 |             panic!("expected Update with offsets from field 10");
 3833 |         }
 3834 |     }
 3835 | 
 3836 |     #[test]
 3837 |     fn merge_build_manifest_refreshes_last_updated_when_data_files_change_stable_row_ids() {
 3838 |         use crate::feature_flags::FLAG_STABLE_ROW_IDS;
 3839 |         use lance_file::version::LanceFileVersion;
 3840 | 
 3841 |         let mk_file = |path: &str| {
 3842 |             DataFile::new(
 3843 |                 path,
 3844 |                 vec![0],
 3845 |                 vec![0],
 3846 |                 LanceFileVersion::Stable.resolve(),
 3847 |                 None,
 3848 |                 None,
 3849 |             )
 3850 |         };
 3851 | 
 3852 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new("id", DataType::Int32, false)]);
 3853 |         let lance_schema = LanceSchema::try_from(&arrow_schema).unwrap();
 3854 | 
 3855 |         let row_ids = RowIdSequence::from([100u64, 101, 102, 103, 104].as_slice());
 3856 |         let row_id_meta = Some(RowIdMeta::Inline(write_row_ids(&row_ids).into()));
 3857 | 
 3858 |         let prev_fragment = Fragment {
 3859 |             id: 0,
 3860 |             files: vec![mk_file("before.lance")],
 3861 |             overlays: vec![],
 3862 |             deletion_file: None,
 3863 |             row_id_meta,
 3864 |             physical_rows: Some(5),
 3865 |             last_updated_at_version_meta: None,
 3866 |             created_at_version_meta: None,
 3867 |         };
 3868 | 
 3869 |         let mut manifest = Manifest::new(
 3870 |             lance_schema.clone(),
 3871 |             Arc::new(vec![prev_fragment.clone()]),
 3872 |             DataStorageFormat::new(ConcreteFileVersion::V2_0),
 3873 |             HashMap::new(),
 3874 |         );
 3875 |         manifest.reader_feature_flags |= FLAG_STABLE_ROW_IDS;
 3876 |         manifest.next_row_id = 100;
 3877 | 
 3878 |         let merged_fragment = Fragment {
 3879 |             files: vec![mk_file("after.lance")],
 3880 |             ..prev_fragment
 3881 |         };
 3882 | 
 3883 |         let tx = Transaction::new(
 3884 |             manifest.version,
 3885 |             Operation::Merge {
 3886 |                 fragments: vec![merged_fragment],
 3887 |                 schema: lance_schema,
 3888 |                 preserves_nullability: true,
 3889 |             },
 3890 |             None,
 3891 |         );
 3892 | 
 3893 |         let (out, _) = tx
 3894 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 3895 |             .unwrap();
 3896 | 
 3897 |         assert_eq!(out.version, 2);
 3898 |         let frag = &out.fragments[0];
 3899 |         let seq = frag
 3900 |             .last_updated_at_version_meta
 3901 |             .as_ref()
 3902 |             .unwrap()
 3903 |             .load_sequence()
 3904 |             .unwrap();
 3905 |         assert_eq!(seq.version_at(0).unwrap(), 2);
 3906 |         assert_eq!(seq.version_at(4).unwrap(), 2);
 3907 |     }
 3908 | 
 3909 |     #[test]
 3910 |     fn merge_build_manifest_skips_refresh_when_carry_forward_stable_row_ids() {
 3911 |         use crate::feature_flags::FLAG_STABLE_ROW_IDS;
 3912 |         use crate::rowids::version::{RowDatasetVersionMeta, RowDatasetVersionSequence};
 3913 |         use lance_file::version::LanceFileVersion;
 3914 | 
 3915 |         let data_file = DataFile::new(
 3916 |             "same.lance",
 3917 |             vec![0],
 3918 |             vec![0],
 3919 |             LanceFileVersion::Stable.resolve(),
 3920 |             None,
 3921 |             None,
 3922 |         );
 3923 | 
 3924 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new("id", DataType::Int32, false)]);
 3925 |         let lance_schema = LanceSchema::try_from(&arrow_schema).unwrap();
 3926 | 
 3927 |         let row_ids = RowIdSequence::from([200u64, 201, 202, 203, 204].as_slice());
 3928 |         let row_id_meta = Some(RowIdMeta::Inline(write_row_ids(&row_ids).into()));
 3929 | 
 3930 |         let uniform_v1 = RowDatasetVersionSequence::from_uniform_row_count(5, 1);
 3931 |         let meta_v1 = RowDatasetVersionMeta::from_sequence(&uniform_v1).unwrap();
 3932 | 
 3933 |         let prev_fragment = Fragment {
 3934 |             id: 0,
 3935 |             files: vec![data_file.clone()],
 3936 |             overlays: vec![],
 3937 |             deletion_file: None,
 3938 |             row_id_meta: row_id_meta.clone(),
 3939 |             physical_rows: Some(5),
 3940 |             last_updated_at_version_meta: Some(meta_v1.clone()),
 3941 |             created_at_version_meta: None,
 3942 |         };
 3943 | 
 3944 |         let mut manifest = Manifest::new(
 3945 |             lance_schema.clone(),
 3946 |             Arc::new(vec![prev_fragment]),
 3947 |             DataStorageFormat::new(ConcreteFileVersion::V2_0),
 3948 |             HashMap::new(),
 3949 |         );
 3950 |         manifest.reader_feature_flags |= FLAG_STABLE_ROW_IDS;
 3951 |         manifest.next_row_id = 100;
 3952 | 
 3953 |         let merged_fragment = Fragment {
 3954 |             id: 0,
 3955 |             files: vec![data_file],
 3956 |             overlays: vec![],
 3957 |             deletion_file: None,
 3958 |             row_id_meta,
 3959 |             physical_rows: Some(5),
 3960 |             last_updated_at_version_meta: Some(meta_v1),
 3961 |             created_at_version_meta: None,
 3962 |         };
 3963 | 
 3964 |         let tx = Transaction::new(
 3965 |             manifest.version,
 3966 |             Operation::Merge {
 3967 |                 fragments: vec![merged_fragment],
 3968 |                 schema: lance_schema,
 3969 |                 preserves_nullability: true,
 3970 |             },
 3971 |             None,
 3972 |         );
 3973 | 
 3974 |         let (out, _) = tx
 3975 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 3976 |             .unwrap();
 3977 | 
 3978 |         let seq = out.fragments[0]
 3979 |             .last_updated_at_version_meta
 3980 |             .as_ref()
 3981 |             .unwrap()
 3982 |             .load_sequence()
 3983 |             .unwrap();
 3984 |         assert_eq!(seq.version_at(0).unwrap(), 1);
 3985 |         assert_eq!(seq.version_at(4).unwrap(), 1);
 3986 |     }
 3987 | 
 3988 |     #[test]
 3989 |     fn merge_build_manifest_no_last_updated_refresh_without_stable_row_ids() {
 3990 |         use crate::feature_flags::FLAG_STABLE_ROW_IDS;
 3991 |         use lance_file::version::LanceFileVersion;
 3992 | 
 3993 |         let mk_file = |path: &str| {
 3994 |             DataFile::new(
 3995 |                 path,
 3996 |                 vec![0],
 3997 |                 vec![0],
 3998 |                 LanceFileVersion::Stable.resolve(),
 3999 |                 None,
 4000 |                 None,
 4001 |             )
 4002 |         };
 4003 | 
 4004 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new("id", DataType::Int32, false)]);
 4005 |         let lance_schema = LanceSchema::try_from(&arrow_schema).unwrap();
 4006 | 
 4007 |         let prev_fragment = Fragment {
 4008 |             id: 0,
 4009 |             files: vec![mk_file("before.lance")],
 4010 |             overlays: vec![],
 4011 |             deletion_file: None,
 4012 |             row_id_meta: None,
 4013 |             physical_rows: Some(5),
 4014 |             last_updated_at_version_meta: None,
 4015 |             created_at_version_meta: None,
 4016 |         };
 4017 | 
 4018 |         let manifest = Manifest::new(
 4019 |             lance_schema.clone(),
 4020 |             Arc::new(vec![prev_fragment.clone()]),
 4021 |             DataStorageFormat::new(ConcreteFileVersion::V2_0),
 4022 |             HashMap::new(),
 4023 |         );
 4024 |         assert_eq!(
 4025 |             manifest.reader_feature_flags & FLAG_STABLE_ROW_IDS,
 4026 |             0,
 4027 |             "manifest must not use stable row IDs for this guard test"
 4028 |         );
 4029 | 
 4030 |         let merged_fragment = Fragment {
 4031 |             files: vec![mk_file("after.lance")],
 4032 |             ..prev_fragment
 4033 |         };
 4034 | 
 4035 |         let tx = Transaction::new(
 4036 |             manifest.version,
 4037 |             Operation::Merge {
 4038 |                 fragments: vec![merged_fragment],
 4039 |                 schema: lance_schema,
 4040 |                 preserves_nullability: true,
 4041 |             },
 4042 |             None,
 4043 |         );
 4044 | 
 4045 |         let (out, _) = tx
 4046 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 4047 |             .unwrap();
 4048 | 
 4049 |         assert!(
 4050 |             out.fragments[0].last_updated_at_version_meta.is_none(),
 4051 |             "without stable row IDs, Merge must not populate per-row last_updated metadata"
 4052 |         );
 4053 |     }
 4054 | 
 4055 |     #[test]
 4056 |     fn merge_build_manifest_sets_both_version_meta_for_new_fragment_id_stable_row_ids() {
 4057 |         use crate::feature_flags::FLAG_STABLE_ROW_IDS;
 4058 |         use lance_file::version::LanceFileVersion;
 4059 | 
 4060 |         let mk_file = |path: &str| {
 4061 |             DataFile::new(
 4062 |                 path,
 4063 |                 vec![0],
 4064 |                 vec![0],
 4065 |                 LanceFileVersion::Stable.resolve(),
 4066 |                 None,
 4067 |                 None,
 4068 |             )
 4069 |         };
 4070 | 
 4071 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new("id", DataType::Int32, false)]);
 4072 |         let lance_schema = LanceSchema::try_from(&arrow_schema).unwrap();
 4073 | 
 4074 |         // Existing fragment (id=0) with stable row IDs
 4075 |         let row_ids_0 = RowIdSequence::from([10u64, 11, 12].as_slice());
 4076 |         let existing_fragment = Fragment {
 4077 |             id: 0,
 4078 |             files: vec![mk_file("existing.lance")],
 4079 |             overlays: vec![],
 4080 |             deletion_file: None,
 4081 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&row_ids_0).into())),
 4082 |             physical_rows: Some(3),
 4083 |             last_updated_at_version_meta: None,
 4084 |             created_at_version_meta: None,
 4085 |         };
 4086 | 
 4087 |         let mut manifest = Manifest::new(
 4088 |             lance_schema.clone(),
 4089 |             Arc::new(vec![existing_fragment.clone()]),
 4090 |             DataStorageFormat::new(ConcreteFileVersion::V2_0),
 4091 |             HashMap::new(),
 4092 |         );
 4093 |         manifest.reader_feature_flags |= FLAG_STABLE_ROW_IDS;
 4094 |         manifest.next_row_id = 100;
 4095 |         manifest.version = 1;
 4096 | 
 4097 |         // New fragment (id=1) not present in prev manifest — exercises the None branch
 4098 |         let row_ids_1 = RowIdSequence::from([20u64, 21, 22, 23].as_slice());
 4099 |         let new_fragment = Fragment {
 4100 |             id: 1,
 4101 |             files: vec![mk_file("new.lance")],
 4102 |             overlays: vec![],
 4103 |             deletion_file: None,
 4104 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&row_ids_1).into())),
 4105 |             physical_rows: Some(4),
 4106 |             last_updated_at_version_meta: None,
 4107 |             created_at_version_meta: None,
 4108 |         };
 4109 | 
 4110 |         let tx = Transaction::new(
 4111 |             manifest.version,
 4112 |             Operation::Merge {
 4113 |                 fragments: vec![existing_fragment, new_fragment],
 4114 |                 schema: lance_schema,
 4115 |                 preserves_nullability: true,
 4116 |             },
 4117 |             None,
 4118 |         );
 4119 | 
 4120 |         let (out, _) = tx
 4121 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 4122 |             .unwrap();
 4123 | 
 4124 |         assert_eq!(out.version, 2);
 4125 | 
 4126 |         let new_frag = out.fragments.iter().find(|f| f.id == 1).unwrap();
 4127 | 
 4128 |         // last_updated_at_version must be set to the commit version
 4129 |         let last_updated_seq = new_frag
 4130 |             .last_updated_at_version_meta
 4131 |             .as_ref()
 4132 |             .expect("new fragment must have last_updated_at_version_meta")
 4133 |             .load_sequence()
 4134 |             .unwrap();
 4135 |         assert_eq!(last_updated_seq.version_at(0).unwrap(), 2);
 4136 |         assert_eq!(last_updated_seq.version_at(3).unwrap(), 2);
 4137 | 
 4138 |         // created_at_version must also be set — must not be None
 4139 |         let created_seq = new_frag
 4140 |             .created_at_version_meta
 4141 |             .as_ref()
 4142 |             .expect("new fragment must have created_at_version_meta")
 4143 |             .load_sequence()
 4144 |             .unwrap();
 4145 |         assert_eq!(created_seq.version_at(0).unwrap(), 2);
 4146 |         assert_eq!(created_seq.version_at(3).unwrap(), 2);
 4147 |     }
 4148 | 
 4149 |     #[test]
 4150 |     fn test_data_overlay_build_manifest_multi_fragment() {
 4151 |         // Overlays targeting two distinct fragments are each applied and stamped.
 4152 |         // A targeted fragment already carrying an overlay (committed at v3) gets
 4153 |         // the new overlay appended and stamped while its existing overlay is
 4154 |         // preserved, and a fragment the operation does not target is passed
 4155 |         // through with its existing overlays untouched.
 4156 |         let mut frag0 = Fragment::new(0);
 4157 |         frag0.overlays = vec![overlay_with_field(5, 3)]; // targeted, pre-existing at v3
 4158 |         let frag1 = Fragment::new(1);
 4159 |         let mut frag2 = Fragment::new(2);
 4160 |         frag2.overlays = vec![overlay_with_field(9, 3)]; // untargeted, committed at v3
 4161 |         let schema = ArrowSchema::new(vec![ArrowField::new("id", DataType::Int32, false)]);
 4162 |         let mut manifest = Manifest::new(
 4163 |             LanceSchema::try_from(&schema).unwrap(),
 4164 |             Arc::new(vec![frag0, frag1, frag2]),
 4165 |             crate::format::DataStorageFormat::new(ConcreteFileVersion::V2_0),
 4166 |             HashMap::new(),
 4167 |         );
 4168 |         // The pre-existing overlays were committed at v3, so the current
 4169 |         // manifest must be at least that version; the new commit then stamps
 4170 |         // its overlay at v4, keeping the fragment's overlays newest-last.
 4171 |         manifest.version = 3;
 4172 | 
 4173 |         let txn = Transaction::new(
 4174 |             manifest.version,
 4175 |             Operation::DataOverlay {
 4176 |                 groups: vec![
 4177 |                     DataOverlayGroup {
 4178 |                         fragment_id: 0,
 4179 |                         overlays: vec![overlay_with_field(1, 0)],
 4180 |                     },
 4181 |                     DataOverlayGroup {
 4182 |                         fragment_id: 1,
 4183 |                         overlays: vec![overlay_with_field(2, 0)],
 4184 |                     },
 4185 |                 ],
 4186 |             },
 4187 |             None,
 4188 |         );
 4189 | 
 4190 |         let (result, _) = txn
 4191 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 4192 |             .unwrap();
 4193 | 
 4194 |         let frag = |id: u64| {
 4195 |             result
 4196 |                 .fragments
 4197 |                 .iter()
 4198 |                 .find(|f| f.id == id)
 4199 |                 .unwrap_or_else(|| panic!("fragment {id} missing from result"))
 4200 |         };
 4201 |         // The already-overlaid target keeps its v3 overlay and appends the new
 4202 |         // one, stamped to the new version.
 4203 |         assert_eq!(frag(0).overlays.len(), 2);
 4204 |         assert_eq!(frag(0).overlays[0].committed_version, 3);
 4205 |         assert_eq!(frag(0).overlays[1].committed_version, result.version);
 4206 |         // The fresh target gets its overlay, stamped to the new version.
 4207 |         assert_eq!(frag(1).overlays.len(), 1);
 4208 |         assert_eq!(frag(1).overlays[0].committed_version, result.version);
 4209 |         // The untargeted fragment is unchanged: same overlay, original version.
 4210 |         assert_eq!(frag(2).overlays.len(), 1);
 4211 |         assert_eq!(frag(2).overlays[0].committed_version, 3);
 4212 |         assert!(result.version > manifest.version);
 4213 |     }
 4214 | 
 4215 |     #[test]
 4216 |     fn test_data_overlay_build_manifest_updates_row_lineage() {
 4217 |         let row_ids = RowIdSequence::from([10u64, 11, 12, 13].as_slice());
 4218 |         let version_meta = RowDatasetVersionMeta::from_sequence(
 4219 |             &RowDatasetVersionSequence::from_uniform_row_count(4, 1),
 4220 |         )
 4221 |         .unwrap();
 4222 |         let fragment = Fragment {
 4223 |             id: 1,
 4224 |             files: vec![],
 4225 |             overlays: vec![],
 4226 |             deletion_file: None,
 4227 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&row_ids).into())),
 4228 |             physical_rows: Some(4),
 4229 |             last_updated_at_version_meta: Some(version_meta.clone()),
 4230 |             created_at_version_meta: Some(version_meta),
 4231 |         };
 4232 |         // Stable-row-id migrations can leave old fragments without explicit
 4233 |         // lineage metadata; scans expose those rows as version 1.
 4234 |         let untracked_row_ids = RowIdSequence::from([20u64, 21].as_slice());
 4235 |         let untracked_fragment = Fragment {
 4236 |             id: 2,
 4237 |             files: vec![],
 4238 |             overlays: vec![],
 4239 |             deletion_file: None,
 4240 |             row_id_meta: Some(RowIdMeta::Inline(write_row_ids(&untracked_row_ids).into())),
 4241 |             physical_rows: Some(2),
 4242 |             last_updated_at_version_meta: None,
 4243 |             created_at_version_meta: None,
 4244 |         };
 4245 |         let manifest = make_stable_row_id_manifest(vec![fragment, untracked_fragment]);
 4246 |         let txn = Transaction::new(
 4247 |             manifest.version,
 4248 |             Operation::DataOverlay {
 4249 |                 groups: vec![
 4250 |                     DataOverlayGroup {
 4251 |                         fragment_id: 1,
 4252 |                         overlays: vec![
 4253 |                             DataOverlayFile {
 4254 |                                 data_file: DataFile::new_legacy_from_fields(
 4255 |                                     "dense.lance",
 4256 |                                     vec![1],
 4257 |                                     None,
 4258 |                                 ),
 4259 |                                 coverage: OverlayCoverage::dense(RoaringBitmap::from_iter([0u32])),
 4260 |                                 committed_version: 0,
 4261 |                             },
 4262 |                             DataOverlayFile {
 4263 |                                 data_file: DataFile::new_legacy_from_fields(
 4264 |                                     "sparse.lance",
 4265 |                                     vec![1, 2],
 4266 |                                     None,
 4267 |                                 ),
 4268 |                                 coverage: OverlayCoverage::sparse(vec![
 4269 |                                     RoaringBitmap::from_iter([2u32]),
 4270 |                                     RoaringBitmap::from_iter([3u32]),
 4271 |                                 ]),
 4272 |                                 committed_version: 0,
 4273 |                             },
 4274 |                         ],
 4275 |                     },
 4276 |                     DataOverlayGroup {
 4277 |                         fragment_id: 2,
 4278 |                         overlays: vec![DataOverlayFile {
 4279 |                             data_file: DataFile::new_legacy_from_fields(
 4280 |                                 "migrated.lance",
 4281 |                                 vec![1],
 4282 |                                 None,
 4283 |                             ),
 4284 |                             coverage: OverlayCoverage::dense(RoaringBitmap::from_iter([1u32])),
 4285 |                             committed_version: 0,
 4286 |                         }],
 4287 |                     },
 4288 |                 ],
 4289 |             },
 4290 |             None,
 4291 |         );
 4292 | 
 4293 |         let (result, _) = txn
 4294 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 4295 |             .unwrap();
 4296 | 
 4297 |         assert_eq!(last_updated_at_versions(&result, 1), vec![5, 1, 5, 5]);
 4298 |         assert_eq!(last_updated_at_versions(&result, 2), vec![1, 5]);
 4299 |         assert!(
 4300 |             result.fragments[0]
 4301 |                 .overlays
 4302 |                 .iter()
 4303 |                 .all(|overlay| overlay.committed_version == result.version)
 4304 |         );
 4305 |     }
 4306 | 
 4307 |     #[test]
 4308 |     fn test_data_replacement_tombstones_overlaid_fields() {
 4309 |         // A DataReplacement writing new base values for field 5 must stop any
 4310 |         // overlay already shadowing those cells: field 5 is tombstoned in place
 4311 |         // (preserving the overlay's field 3), and an overlay covering only field
 4312 |         // 5 is dropped entirely. Both overlays predate the transaction's read
 4313 |         // version, which is what makes the replacement the newer value.
 4314 |         let mut fragment = Fragment::new(0);
 4315 |         fragment.files = vec![
 4316 |             DataFile::new_legacy_from_fields("f3.lance", vec![3], None),
 4317 |             DataFile::new_legacy_from_fields("f5.lance", vec![5], None),
 4318 |         ];
 4319 |         fragment.overlays = vec![
 4320 |             DataOverlayFile {
 4321 |                 data_file: DataFile::new_legacy_from_fields("o35.lance", vec![3, 5], None),
 4322 |                 coverage: OverlayCoverage::sparse(vec![
 4323 |                     roaring::RoaringBitmap::from_iter([0u32]),
 4324 |                     roaring::RoaringBitmap::from_iter([0u32]),
 4325 |                 ]),
 4326 |                 committed_version: 1,
 4327 |             },
 4328 |             DataOverlayFile {
 4329 |                 data_file: DataFile::new_legacy_from_fields("o5.lance", vec![5], None),
 4330 |                 coverage: OverlayCoverage::dense(roaring::RoaringBitmap::from_iter([0u32])),
 4331 |                 committed_version: 1,
 4332 |             },
 4333 |         ];
 4334 | 
 4335 |         let schema = ArrowSchema::new(vec![ArrowField::new("id", DataType::Int32, false)]);
 4336 |         let manifest = Manifest::new(
 4337 |             LanceSchema::try_from(&schema).unwrap(),
 4338 |             Arc::new(vec![fragment]),
 4339 |             crate::format::DataStorageFormat::new(ConcreteFileVersion::V2_0),
 4340 |             HashMap::new(),
 4341 |         );
 4342 | 
 4343 |         let txn = Transaction::new(
 4344 |             manifest.version,
 4345 |             Operation::DataReplacement {
 4346 |                 replacements: vec![DataReplacementGroup(
 4347 |                     0,
 4348 |                     DataFile::new_legacy_from_fields("f5-new.lance", vec![5], None),
 4349 |                 )],
 4350 |             },
 4351 |             None,
 4352 |         );
 4353 | 
 4354 |         let (result, _) = txn
 4355 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 4356 |             .unwrap();
 4357 | 
 4358 |         let frag = &result.fragments[0];
 4359 |         // The base data file for field 5 was swapped in.
 4360 |         assert!(frag.files.iter().any(|f| f.path == "f5-new.lance"));
 4361 |         // The [3, 5] overlay keeps field 3 and tombstones field 5; the [5]-only
 4362 |         // overlay is dropped.
 4363 |         assert_eq!(frag.overlays.len(), 1);
 4364 |         assert_eq!(frag.overlays[0].data_file.fields.as_ref(), &[3, -2]);
 4365 |     }
 4366 | 
 4367 |     /// Replace `fields` in `fragment` at `read_version`, against a manifest
 4368 |     /// at `manifest_version` whose schema declares field ids 3 ("x"), 4 ("a"),
 4369 |     /// 5 ("v") and 6 ("y").
 4370 |     fn replace_fields(
 4371 |         fragment: Fragment,
 4372 |         fields: Vec<i32>,
 4373 |         manifest_version: u64,
 4374 |         read_version: u64,
 4375 |     ) -> Result<Fragment> {
 4376 |         let schema = ArrowSchema::new(vec![
 4377 |             ArrowField::new("x", DataType::Int32, true),
 4378 |             ArrowField::new("a", DataType::Int32, true),
 4379 |             ArrowField::new("v", DataType::Int32, true),
 4380 |             ArrowField::new("y", DataType::Int32, true),
 4381 |         ]);
 4382 |         let mut lance_schema = LanceSchema::try_from(&schema).unwrap();
 4383 |         lance_schema.fields[0].id = 3;
 4384 |         lance_schema.fields[1].id = 4;
 4385 |         lance_schema.fields[2].id = 5;
 4386 |         lance_schema.fields[3].id = 6;
 4387 |         let mut manifest = Manifest::new(
 4388 |             lance_schema,
 4389 |             Arc::new(vec![fragment]),
 4390 |             crate::format::DataStorageFormat::new(ConcreteFileVersion::V2_0),
 4391 |             HashMap::new(),
 4392 |         );
 4393 |         manifest.version = manifest_version;
 4394 | 
 4395 |         let column_indices = (0..fields.len() as i32).collect();
 4396 |         let txn = Transaction::new(
 4397 |             read_version,
 4398 |             Operation::DataReplacement {
 4399 |                 replacements: vec![DataReplacementGroup(
 4400 |                     0,
 4401 |                     DataFile::new(
 4402 |                         "v-new.lance",
 4403 |                         fields,
 4404 |                         column_indices,
 4405 |                         ConcreteFileVersion::V2_0,
 4406 |                         None,
 4407 |                         None,
 4408 |                     ),
 4409 |                 )],
 4410 |             },
 4411 |             None,
 4412 |         );
 4413 |         txn.build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 4414 |             .map(|(manifest, _)| manifest.fragments[0].clone())
 4415 |     }
 4416 | 
 4417 |     /// Replace field 5 in `fragment` at `read_version`, against a manifest at
 4418 |     /// `manifest_version`.
 4419 |     fn replace_field_5(
 4420 |         fragment: Fragment,
 4421 |         manifest_version: u64,
 4422 |         read_version: u64,
 4423 |     ) -> Result<Fragment> {
 4424 |         replace_fields(fragment, vec![5], manifest_version, read_version)
 4425 |     }
 4426 | 
 4427 |     #[test]
 4428 |     fn test_data_replacement_rejects_subset_of_legacy_file() {
 4429 |         // The V1 reader derives its page table offset from the first field in
 4430 |         // the file metadata, so turning `[4, 5]` into `[-2, 5]` would leave
 4431 |         // field 4 decoding from field 5's pages. With no exact match to swap,
 4432 |         // the replacement must be rejected rather than corrupting the sibling.
 4433 |         let mut fragment = Fragment::new(0);
 4434 |         fragment.files = vec![DataFile::new_legacy_from_fields(
 4435 |             "wide.lance",
 4436 |             vec![4, 5],
 4437 |             None,
 4438 |         )];
 4439 | 
 4440 |         let result = replace_field_5(fragment, 1, 1);
 4441 |         assert!(
 4442 |             result.is_err(),
 4443 |             "legacy subset replacement must be rejected, got: {:?}",
 4444 |             result.map(|fragment| fragment.files)
 4445 |         );
 4446 |     }
 4447 | 
 4448 |     #[test]
 4449 |     fn test_data_replacement_tombstones_fields_spanning_files() {
 4450 |         // The replaced fields sit in two different wider files. Each file is
 4451 |         // tombstoned for the field it holds and survives on its remaining
 4452 |         // live one, with the new file answering for both.
 4453 |         let mut fragment = Fragment::new(0);
 4454 |         fragment.files = vec![
 4455 |             DataFile::new(
 4456 |                 "ab.lance",
 4457 |                 vec![3, 4],
 4458 |                 vec![0, 1],
 4459 |                 ConcreteFileVersion::V2_0,
 4460 |                 None,
 4461 |                 None,
 4462 |             ),
 4463 |             DataFile::new(
 4464 |                 "cd.lance",
 4465 |                 vec![5, 6],
 4466 |                 vec![0, 1],
 4467 |                 ConcreteFileVersion::V2_0,
 4468 |                 None,
 4469 |                 None,
 4470 |             ),
 4471 |         ];
 4472 | 
 4473 |         let fragment = replace_fields(fragment, vec![4, 5], 1, 1).unwrap();
 4474 |         let file = |path| {
 4475 |             fragment
 4476 |                 .files
 4477 |                 .iter()
 4478 |                 .find(|file| file.path == path)
 4479 |                 .unwrap_or_else(|| panic!("{path} survives on its live field"))
 4480 |         };
 4481 |         assert_eq!(file("ab.lance").fields.as_ref(), &[3, TOMBSTONE_FIELD_ID]);
 4482 |         assert_eq!(file("cd.lance").fields.as_ref(), &[TOMBSTONE_FIELD_ID, 6]);
 4483 |         assert!(fragment.files.iter().any(|file| file.path == "v-new.lance"));
 4484 |     }
 4485 | 
 4486 |     #[test]
 4487 |     fn test_data_replacement_rejects_fields_spanning_a_legacy_file() {
 4488 |         // Spanning is only resolvable while every covering file can be
 4489 |         // tombstoned. A V1 file holding one of the replaced fields cannot,
 4490 |         // so the replacement must be rejected rather than half applied.
 4491 |         let mut fragment = Fragment::new(0);
 4492 |         fragment.files = vec![
 4493 |             DataFile::new(
 4494 |                 "ab.lance",
 4495 |                 vec![3, 4],
 4496 |                 vec![0, 1],
 4497 |                 ConcreteFileVersion::V2_0,
 4498 |                 None,
 4499 |                 None,
 4500 |             ),
 4501 |             DataFile::new_legacy_from_fields("cd.lance", vec![5, 6], None),
 4502 |         ];
 4503 | 
 4504 |         let result = replace_fields(fragment, vec![4, 5], 1, 1);
 4505 |         assert!(
 4506 |             result.is_err(),
 4507 |             "spanning a legacy file must be rejected, got: {:?}",
 4508 |             result.map(|fragment| fragment.files)
 4509 |         );
 4510 |     }
 4511 | 
 4512 |     #[test]
 4513 |     fn test_data_replacement_retombstones_wider_file() {
 4514 |         // A wider file carrying a tombstone from an earlier round is
 4515 |         // tombstoned again for the newly replaced field and survives on its
 4516 |         // remaining live field.
 4517 |         let mut fragment = Fragment::new(0);
 4518 |         fragment.files = vec![DataFile::new(
 4519 |             "wide.lance",
 4520 |             vec![4, TOMBSTONE_FIELD_ID, 5],
 4521 |             vec![0, 1, 2],
 4522 |             ConcreteFileVersion::V2_0,
 4523 |             None,
 4524 |             None,
 4525 |         )];
 4526 | 
 4527 |         let fragment = replace_fields(fragment, vec![5], 1, 1).unwrap();
 4528 |         let wide = fragment
 4529 |             .files
 4530 |             .iter()
 4531 |             .find(|file| file.path == "wide.lance")
 4532 |             .expect("wider file survives on its live field");
 4533 |         assert_eq!(
 4534 |             wide.fields.as_ref(),
 4535 |             &[4, TOMBSTONE_FIELD_ID, TOMBSTONE_FIELD_ID]
 4536 |         );
 4537 |         assert!(fragment.files.iter().any(|file| file.path == "v-new.lance"));
 4538 |     }
 4539 | 
 4540 |     #[test]
 4541 |     fn test_data_replacement_preserves_overlay_newer_than_snapshot() {
 4542 |         // An overlay committed after this transaction read its snapshot holds
 4543 |         // the newer value; the conflict resolver rebases the two precisely
 4544 |         // because the overlay wins. Tombstoning it would discard a committed
 4545 |         // write, so only overlays the transaction could have seen are superseded.
 4546 |         let mut fragment = Fragment::new(0);
 4547 |         // One wider file, so the replacement takes the tombstone-and-append path.
 4548 |         fragment.files = vec![DataFile::new(
 4549 |             "wide.lance",
 4550 |             vec![4, 5],
 4551 |             vec![0, 1],
 4552 |             ConcreteFileVersion::V2_0,
 4553 |             None,
 4554 |             None,
 4555 |         )];
 4556 |         fragment.overlays = vec![DataOverlayFile {
 4557 |             data_file: DataFile::new(
 4558 |                 "newer.lance",
 4559 |                 vec![5],
 4560 |                 vec![0],
 4561 |                 ConcreteFileVersion::V2_0,
 4562 |                 None,
 4563 |                 None,
 4564 |             ),
 4565 |             coverage: OverlayCoverage::dense(roaring::RoaringBitmap::from_iter([0u32])),
 4566 |             committed_version: 7,
 4567 |         }];
 4568 | 
 4569 |         // Staged against version 6, i.e. before the overlay landed.
 4570 |         let fragment = replace_field_5(fragment, 7, 6).unwrap();
 4571 |         assert!(fragment.files.iter().any(|f| f.path == "v-new.lance"));
 4572 |         assert_eq!(
 4573 |             fragment.overlays.len(),
 4574 |             1,
 4575 |             "overlay committed after the snapshot must survive"
 4576 |         );
 4577 |         assert_eq!(fragment.overlays[0].data_file.fields.as_ref(), &[5]);
 4578 |     }
 4579 | 
 4580 |     /// A projection keeps only the data files that still share a field with
 4581 |     /// the schema. The reserved ids of spilled row lineage are never in it, so
 4582 |     /// without an exception the file carrying them, their only copy, would go.
 4583 |     #[test]
 4584 |     fn project_keeps_file_carrying_spilled_row_lineage() {
 4585 |         let mut fragment = Fragment::new(0);
 4586 |         fragment.physical_rows = Some(4);
 4587 |         fragment.row_id_meta = Some(RowIdMeta::Column);
 4588 |         fragment.created_at_version_meta = Some(RowDatasetVersionMeta::Column);
 4589 |         fragment.files = vec![
 4590 |             DataFile::new(
 4591 |                 "d.lance",
 4592 |                 vec![0, 1],
 4593 |                 vec![0, 1],
 4594 |                 ConcreteFileVersion::V2_0,
 4595 |                 None,
 4596 |                 None,
 4597 |             ),
 4598 |             DataFile::new(
 4599 |                 "l.lance",
 4600 |                 vec![ROW_ID_FIELD_ID, ROW_CREATED_AT_VERSION_FIELD_ID],
 4601 |                 vec![0, 1],
 4602 |                 ConcreteFileVersion::V2_0,
 4603 |                 None,
 4604 |                 None,
 4605 |             ),
 4606 |         ];
 4607 |         let schema = ArrowSchema::new(vec![
 4608 |             ArrowField::new("a", DataType::Int32, false),
 4609 |             ArrowField::new("b", DataType::Int32, false),
 4610 |         ]);
 4611 |         let mut manifest = Manifest::new(
 4612 |             LanceSchema::try_from(&schema).unwrap(),
 4613 |             Arc::new(vec![fragment]),
 4614 |             DataStorageFormat::new(ConcreteFileVersion::V2_0),
 4615 |             HashMap::new(),
 4616 |         );
 4617 |         manifest.reader_feature_flags = FLAG_STABLE_ROW_IDS;
 4618 |         manifest.writer_feature_flags = FLAG_STABLE_ROW_IDS;
 4619 | 
 4620 |         // Drop field 1, as `drop_columns(["b"])` would.
 4621 |         let transaction = Transaction::new(
 4622 |             manifest.version,
 4623 |             Operation::Project {
 4624 |                 schema: manifest.schema.project_by_ids(&[0], true),
 4625 |                 preserves_nullability: true,
 4626 |             },
 4627 |             None,
 4628 |         );
 4629 |         let (result, _) = transaction
 4630 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 4631 |             .unwrap();
 4632 | 
 4633 |         let fragment = &result.fragments[0];
 4634 |         let paths = fragment
 4635 |             .files
 4636 |             .iter()
 4637 |             .map(|file| file.path.as_str())
 4638 |             .collect::<Vec<_>>();
 4639 |         assert_eq!(paths, ["d.lance", "l.lance"]);
 4640 |         for field_id in [ROW_ID_FIELD_ID, ROW_CREATED_AT_VERSION_FIELD_ID] {
 4641 |             assert_eq!(
 4642 |                 fragment
 4643 |                     .row_lineage_file(field_id)
 4644 |                     .unwrap()
 4645 |                     .map(|file| file.path.as_str()),
 4646 |                 Some("l.lance"),
 4647 |                 "field {field_id}"
 4648 |             );
 4649 |         }
 4650 |     }
 4651 | 
 4652 |     /// Replacing part of a wider file tombstones the replaced fields where
 4653 |     /// they live and drops any file left without a schema field. The file
 4654 |     /// carrying the fragment's spilled row ids may have none, yet it is their
 4655 |     /// only copy and must stay next to the new file that answers for the user
 4656 |     /// fields. The carrier is either a file of its own, as an update writes
 4657 |     /// it, or a file that also holds user columns, all of which are replaced.
 4658 |     #[rstest::rstest]
 4659 |     #[case::lineage_only_file(
 4660 |         vec![("v.lance", vec![3, 4, 5, 6]), ("l.lance", vec![ROW_ID_FIELD_ID])],
 4661 |         vec![3, 4],
 4662 |         vec![
 4663 |             ("v.lance", vec![TOMBSTONE_FIELD_ID, TOMBSTONE_FIELD_ID, 5, 6]),
 4664 |             ("l.lance", vec![ROW_ID_FIELD_ID]),
 4665 |             ("v-new.lance", vec![3, 4]),
 4666 |         ],
 4667 |         "l.lance"
 4668 |     )]
 4669 |     #[case::in_file_carrier(
 4670 |         vec![("v.lance", vec![3, 4, 5, 6, ROW_ID_FIELD_ID])],
 4671 |         vec![3, 4, 5, 6],
 4672 |         vec![
 4673 |             (
 4674 |                 "v.lance",
 4675 |                 vec![
 4676 |                     TOMBSTONE_FIELD_ID,
 4677 |                     TOMBSTONE_FIELD_ID,
 4678 |                     TOMBSTONE_FIELD_ID,
 4679 |                     TOMBSTONE_FIELD_ID,
 4680 |                     ROW_ID_FIELD_ID,
 4681 |                 ],
 4682 |             ),
 4683 |             ("v-new.lance", vec![3, 4, 5, 6]),
 4684 |         ],
 4685 |         "v.lance"
 4686 |     )]
 4687 |     fn data_replacement_keeps_lineage_carrier(
 4688 |         #[case] files: Vec<(&str, Vec<i32>)>,
 4689 |         #[case] replaced_fields: Vec<i32>,
 4690 |         #[case] expected_files: Vec<(&str, Vec<i32>)>,
 4691 |         #[case] carrier: &str,
 4692 |     ) {
 4693 |         let mut fragment = Fragment::new(0);
 4694 |         fragment.row_id_meta = Some(RowIdMeta::Column);
 4695 |         fragment.files = files
 4696 |             .into_iter()
 4697 |             .map(|(path, fields)| {
 4698 |                 let column_indices = (0..fields.len() as i32).collect();
 4699 |                 DataFile::new(
 4700 |                     path,
 4701 |                     fields,
 4702 |                     column_indices,
 4703 |                     ConcreteFileVersion::V2_0,
 4704 |                     None,
 4705 |                     None,
 4706 |                 )
 4707 |             })
 4708 |             .collect();
 4709 | 
 4710 |         let fragment = replace_fields(fragment, replaced_fields, 1, 1).unwrap();
 4711 |         let files = fragment
 4712 |             .files
 4713 |             .iter()
 4714 |             .map(|file| (file.path.as_str(), file.fields.to_vec()))
 4715 |             .collect::<Vec<_>>();
 4716 |         assert_eq!(files, expected_files);
 4717 |         assert_eq!(
 4718 |             fragment
 4719 |                 .row_lineage_file(ROW_ID_FIELD_ID)
 4720 |                 .unwrap()
 4721 |                 .map(|file| file.path.as_str()),
 4722 |             Some(carrier)
 4723 |         );
 4724 |     }
 4725 | 
 4726 |     /// Whatever hands the commit a fragment whose spilled row ids have no v2
 4727 |     /// carrier -- an operation that dropped the file, or a writer that never
 4728 |     /// attached it -- the commit refuses it rather than publish lineage that
 4729 |     /// no reader can load.
 4730 |     #[rstest::rstest]
 4731 |     #[case::no_carrier(vec![0], ConcreteFileVersion::V2_0)]
 4732 |     #[case::v1_carrier(vec![0, ROW_ID_FIELD_ID], ConcreteFileVersion::V1)]
 4733 |     fn build_manifest_rejects_spilled_arm_without_carrier(
 4734 |         #[case] fields: Vec<i32>,
 4735 |         #[case] version: ConcreteFileVersion,
 4736 |     ) {
 4737 |         let manifest = sample_manifest();
 4738 |         let mut fragment = Fragment::new(0);
 4739 |         fragment.physical_rows = Some(4);
 4740 |         fragment.row_id_meta = Some(RowIdMeta::Column);
 4741 |         // Column indices do not matter to the commit, only ids and version.
 4742 |         let data_file = DataFile::new("d.lance", fields, vec![], version, None, None);
 4743 |         fragment.files = vec![data_file];
 4744 |         let transaction = Transaction::new(
 4745 |             manifest.version,
 4746 |             Operation::Merge {
 4747 |                 fragments: vec![fragment],
 4748 |                 schema: manifest.schema.clone(),
 4749 |                 preserves_nullability: true,
 4750 |             },
 4751 |             None,
 4752 |         );
 4753 | 
 4754 |         let err = transaction
 4755 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 4756 |             .unwrap_err();
 4757 |         assert!(matches!(err, Error::Internal { .. }), "{err:?}");
 4758 |         let message = err.to_string();
 4759 |         assert!(
 4760 |             message.contains("fragment 0") && message.contains(&ROW_ID_FIELD_ID.to_string()),
 4761 |             "{message}"
 4762 |         );
 4763 |     }
 4764 | 
 4765 |     #[test]
 4766 |     fn test_data_overlay_build_manifest_merges_duplicate_groups() {
 4767 |         // Two groups targeting the same fragment must both survive (a HashMap
 4768 |         // collapse would have dropped the first).
 4769 |         let manifest = sample_manifest();
 4770 |         let txn = Transaction::new(
 4771 |             manifest.version,
 4772 |             Operation::DataOverlay {
 4773 |                 groups: vec![
 4774 |                     DataOverlayGroup {
 4775 |                         fragment_id: 0,
 4776 |                         overlays: vec![overlay_with_field(1, 0)],
 4777 |                     },
 4778 |                     DataOverlayGroup {
 4779 |                         fragment_id: 0,
 4780 |                         overlays: vec![overlay_with_field(2, 0)],
 4781 |                     },
 4782 |                 ],
 4783 |             },
 4784 |             None,
 4785 |         );
 4786 | 
 4787 |         let (result, _) = txn
 4788 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 4789 |             .unwrap();
 4790 | 
 4791 |         let overlays = &result.fragments[0].overlays;
 4792 |         assert_eq!(overlays.len(), 2);
 4793 |         assert_eq!(overlays[0].data_file.fields.as_ref(), [1i32].as_slice());
 4794 |         assert_eq!(overlays[1].data_file.fields.as_ref(), [2i32].as_slice());
 4795 |     }
 4796 | 
 4797 |     #[test]
 4798 |     fn test_data_overlay_build_manifest_rejects_unknown_fragment() {
 4799 |         let manifest = sample_manifest();
 4800 |         let txn = Transaction::new(
 4801 |             manifest.version,
 4802 |             Operation::DataOverlay {
 4803 |                 groups: vec![DataOverlayGroup {
 4804 |                     fragment_id: 99,
 4805 |                     overlays: vec![overlay_with_field(1, 0)],
 4806 |                 }],
 4807 |             },
 4808 |             None,
 4809 |         );
 4810 |         let err = txn
 4811 |             .build_manifest(Some(&manifest), vec![], "txn", &default_build_config())
 4812 |             .unwrap_err();
 4813 |         assert!(err.to_string().contains("does not exist"), "{err}");
 4814 |     }
 4815 | 
 4816 |     #[test]
 4817 |     fn test_nullability_assertion_defaults_conservative() {
 4818 |         // A writer that predates the field encodes nothing, which decodes as
 4819 |         // false: no assertion, so a legacy tightening or required-field merge
 4820 |         // still conflicts. Only an explicit true skips the barrier.
 4821 |         for encoded in [false, true] {
 4822 |             let txn = Transaction::try_from(pb::Transaction {
 4823 |                 read_version: 1,
 4824 |                 uuid: "test".to_string(),
 4825 |                 operation: Some(pb::transaction::Operation::Project(
 4826 |                     pb::transaction::Project {
 4827 |                         schema: vec![],
 4828 |                         preserves_nullability: encoded,
 4829 |                     },
 4830 |                 )),
 4831 |                 ..Default::default()
 4832 |             })
 4833 |             .unwrap();
 4834 |             assert!(
 4835 |                 matches!(txn.operation, Operation::Project { preserves_nullability, .. } if preserves_nullability == encoded),
 4836 |                 "encoded={encoded:?}"
 4837 |             );
 4838 | 
 4839 |             let txn = Transaction::try_from(pb::Transaction {
 4840 |                 read_version: 1,
 4841 |                 uuid: "test".to_string(),
 4842 |                 operation: Some(pb::transaction::Operation::Merge(pb::transaction::Merge {
 4843 |                     fragments: vec![],
 4844 |                     schema: vec![],
 4845 |                     schema_metadata: Default::default(),
 4846 |                     preserves_nullability: encoded,
 4847 |                 })),
 4848 |                 ..Default::default()
 4849 |             })
 4850 |             .unwrap();
 4851 |             assert!(
 4852 |                 matches!(txn.operation, Operation::Merge { preserves_nullability, .. } if preserves_nullability == encoded),
 4853 |                 "encoded={encoded:?}"
 4854 |             );
 4855 |         }
 4856 |     }
 4857 | 
 4858 |     mod mem_wal_index_coverage {
 4859 |         use super::*;
 4860 |         use crate::system_index::mem_wal::{
 4861 |             CompactedSsTable, IndexCatchupProgress, MEM_WAL_INDEX_NAME, MemWalIndexDetails,
 4862 |         };
 4863 | 
 4864 |         fn user_index(name: &str, uuid: Uuid, frags: &[u32]) -> IndexMetadata {
 4865 |             IndexMetadata {
 4866 |                 uuid,
 4867 |                 name: name.to_string(),
 4868 |                 fields: vec![0],
 4869 |                 covering_fields: vec![],
 4870 |                 dataset_version: 1,
 4871 |                 fragment_bitmap: Some(RoaringBitmap::from_iter(frags.iter().copied())),
 4872 |                 index_details: None,
 4873 |                 index_version: 0,
 4874 |                 created_at: None,
 4875 |                 base_id: None,
 4876 |                 files: None,
 4877 |             }
 4878 |         }
 4879 | 
 4880 |         fn mem_wal_index(details: MemWalIndexDetails) -> IndexMetadata {
 4881 |             crate::system_index::mem_wal::new_mem_wal_index_meta(1, details).unwrap()
 4882 |         }
 4883 | 
 4884 |         fn coverage_for(indices: &[IndexMetadata], name: &str) -> Option<Vec<CompactedSsTable>> {
 4885 |             let meta = indices
 4886 |                 .iter()
 4887 |                 .find(|idx| idx.name == MEM_WAL_INDEX_NAME)
 4888 |                 .expect("mem wal index present");
 4889 |             load_mem_wal_index_details(meta.clone())
 4890 |                 .unwrap()
 4891 |                 .index_catchup
 4892 |                 .into_iter()
 4893 |                 .find(|entry| entry.index_name == name)
 4894 |                 .map(|entry| entry.caught_up_generations)
 4895 |         }
 4896 | 
 4897 |         fn compacted(shard: Uuid, generation: u64) -> Vec<CompactedSsTable> {
 4898 |             vec![CompactedSsTable::new(shard, generation)]
 4899 |         }
 4900 | 
 4901 |         /// A manifest carrying exactly `frags`, standing in for the version a
 4902 |         /// transaction read.
 4903 |         fn manifest_with(frags: &[u32]) -> Manifest {
 4904 |             let fragments: Vec<Fragment> =
 4905 |                 frags.iter().map(|id| Fragment::new(*id as u64)).collect();
 4906 |             Manifest::new(
 4907 |                 LanceSchema::default(),
 4908 |                 Arc::new(fragments),
 4909 |                 DataStorageFormat::default(),
 4910 |                 Default::default(),
 4911 |             )
 4912 |         }
 4913 | 
 4914 |         /// Drives the production path, so these exercise the real derivation.
 4915 |         fn apply(
 4916 |             after: &mut [IndexMetadata],
 4917 |             before: &[IndexMetadata],
 4918 |             read_frags: &[u32],
 4919 |             read_indices: &[IndexMetadata],
 4920 |         ) -> Result<()> {
 4921 |             let manifest = manifest_with(read_frags);
 4922 |             let segments_before = Transaction::logical_index_segments(before);
 4923 |             Transaction::apply_mem_wal_index_coverage(
 4924 |                 after,
 4925 |                 &segments_before,
 4926 |                 Some(ReadVersionState {
 4927 |                     manifest: &manifest,
 4928 |                     indices: read_indices,
 4929 |                 }),
 4930 |                 2,
 4931 |             )
 4932 |         }
 4933 | 
 4934 |         fn table(idx_frags: &[u32], uuid: Uuid, details: MemWalIndexDetails) -> Vec<IndexMetadata> {
 4935 |             vec![user_index("idx", uuid, idx_frags), mem_wal_index(details)]
 4936 |         }
 4937 | 
 4938 |         fn progress(shard: Uuid, generation: u64) -> MemWalIndexDetails {
 4939 |             MemWalIndexDetails {
 4940 |                 compacted_sstables: compacted(shard, generation),
 4941 |                 ..Default::default()
 4942 |             }
 4943 |         }
 4944 | 
 4945 |         fn progress_with_catchup(shard: Uuid, generation: u64, caught: u64) -> MemWalIndexDetails {
 4946 |             MemWalIndexDetails {
 4947 |                 compacted_sstables: compacted(shard, generation),
 4948 |                 index_catchup: vec![IndexCatchupProgress::new(
 4949 |                     "idx".to_string(),
 4950 |                     compacted(shard, caught),
 4951 |                 )],
 4952 |                 ..Default::default()
 4953 |             }
 4954 |         }
 4955 | 
 4956 |         /// Through the builder, the "before" side of the coverage comparison
 4957 |         /// is the original list as read from the manifest, never the
 4958 |         /// prepared one: an in-place rewrite that narrows an index's
 4959 |         /// coverage in preparation withdraws its catch-up record instead of
 4960 |         /// carrying it over as if nothing changed.
 4961 |         #[test]
 4962 |         fn a_withdrawal_in_preparation_withdraws_the_catch_up_record() {
 4963 |             let shard = Uuid::new_v4();
 4964 |             let uuid = Uuid::new_v4();
 4965 |             let read = table(&[0, 1], uuid, progress_with_catchup(shard, 5, 5));
 4966 |             // A schema with field 0, so the index on it is retained.
 4967 |             let mut manifest = crate::transaction::test_support::sample_manifest();
 4968 |             manifest.fragments = Arc::new(vec![Fragment::new(0), Fragment::new(1)]);
 4969 |             let mut update = crate::transaction::test_support::update_txn(vec![]);
 4970 |             let Operation::Update {
 4971 |                 updated_fragments,
 4972 |                 fields_modified,
 4973 |                 ..
 4974 |             } = &mut update.operation
 4975 |             else {
 4976 |                 unreachable!()
 4977 |             };
 4978 |             *updated_fragments = vec![Fragment::new(0)];
 4979 |             *fields_modified = vec![0];
 4980 |             let transaction = Transaction::new(manifest.version, update.operation, None);
 4981 |             let (_, after) = transaction
 4982 |                 .build_manifest_with_read_version(
 4983 |                     Some(&manifest),
 4984 |                     read.clone(),
 4985 |                     "txn",
 4986 |                     &default_build_config(),
 4987 |                     Some(ReadVersionState {
 4988 |                         manifest: &manifest,
 4989 |                         indices: &read,
 4990 |                     }),
 4991 |                 )
 4992 |                 .unwrap();
 4993 |             let idx = after.iter().find(|idx| idx.name == "idx").unwrap();
 4994 |             assert_eq!(
 4995 |                 idx.fragment_bitmap,
 4996 |                 Some(RoaringBitmap::from_iter([1u32])),
 4997 |                 "the rewritten fragment left the coverage in preparation"
 4998 |             );
 4999 |             assert_eq!(
 5000 |                 coverage_for(&after, "idx"),
 5001 |                 None,
 5002 |                 "a record derived over the original coverage is not carried"
 5003 |             );
 5004 |         }
 5005 | 
 5006 |         /// An index spanning every fragment the transaction read is credited
 5007 |         /// with what that version had compacted.
 5008 |         #[test]
 5009 |         fn an_index_covering_the_read_version_is_credited() {
 5010 |             let shard = Uuid::new_v4();
 5011 |             let read = table(&[0, 1], Uuid::new_v4(), progress(shard, 5));
 5012 |             let mut after = table(&[0, 1], Uuid::new_v4(), progress(shard, 5));
 5013 |             apply(&mut after, &read, &[0, 1], &read).unwrap();
 5014 |             assert_eq!(coverage_for(&after, "idx"), Some(compacted(shard, 5)));
 5015 |         }
 5016 | 
 5017 |         /// An index short of the read version proves nothing, so it gets no
 5018 |         /// entry -- absence reads as "not caught up".
 5019 |         #[test]
 5020 |         fn an_index_short_of_the_read_version_is_not_credited() {
 5021 |             let shard = Uuid::new_v4();
 5022 |             let read = table(&[0], Uuid::new_v4(), progress(shard, 5));
 5023 |             let mut after = table(&[0], Uuid::new_v4(), progress(shard, 5));
 5024 |             apply(&mut after, &read, &[0, 1], &read).unwrap();
 5025 |             assert_eq!(coverage_for(&after, "idx"), None);
 5026 |         }
 5027 | 
 5028 |         /// The hazard that makes the comparison use whole metadata.
 5029 |         ///
 5030 |         /// `Operation::Update` prunes a segment's fragment bitmap in place when
 5031 |         /// it touches an indexed field, keeping the same UUID. A UUID-only
 5032 |         /// "unchanged" test carries the old position forward while the index
 5033 |         /// covers fewer fragments, and the WAL pod then trims on a position the
 5034 |         /// index no longer earns. Reachable from the ordinary SSTable merge.
 5035 |         #[test]
 5036 |         fn a_bitmap_pruned_in_place_does_not_keep_its_position() {
 5037 |             let shard = Uuid::new_v4();
 5038 |             let uuid = Uuid::new_v4();
 5039 |             let before = table(&[0, 1], uuid, progress_with_catchup(shard, 5, 5));
 5040 |             // Same UUID, fragment 1 pruned away.
 5041 |             let mut after = table(&[0], uuid, progress_with_catchup(shard, 5, 5));
 5042 |             apply(&mut after, &before, &[0, 1], &before).unwrap();
 5043 |             assert_eq!(
 5044 |                 coverage_for(&after, "idx"),
 5045 |                 None,
 5046 |                 "a shrunken index kept a position it no longer earns"
 5047 |             );
 5048 |         }
 5049 | 
 5050 |         /// Carrying a position forward is not the same as extending it. An
 5051 |         /// index that has not moved still only holds the generations it caught
 5052 |         /// up to; the compaction that has landed since is in fragments it does
 5053 |         /// not span.
 5054 |         #[test]
 5055 |         fn an_unchanged_index_is_not_raised_beyond_what_it_proves() {
 5056 |             let shard = Uuid::new_v4();
 5057 |             let uuid = Uuid::new_v4();
 5058 |             // Recorded at generation 2; generation 5 has since been folded in.
 5059 |             let before = table(&[0], uuid, progress_with_catchup(shard, 5, 2));
 5060 |             let mut after = before.clone();
 5061 |             // Fragment 1 arrived with that compaction and this index lacks it.
 5062 |             apply(&mut after, &before, &[0, 1], &before).unwrap();
 5063 |             assert_eq!(coverage_for(&after, "idx"), Some(compacted(shard, 2)));
 5064 |         }
 5065 | 
 5066 |         /// A recorded position above what this commit says was compacted is
 5067 |         /// clamped down. Nothing should produce one, but a position the base
 5068 |         /// table cannot back would retire SSTables whose rows are nowhere.
 5069 |         #[test]
 5070 |         fn a_carried_position_cannot_exceed_the_committed_progress() {
 5071 |             let shard = Uuid::new_v4();
 5072 |             let uuid = Uuid::new_v4();
 5073 |             let before = table(&[0], uuid, progress_with_catchup(shard, 3, 9));
 5074 |             let mut after = before.clone();
 5075 |             apply(&mut after, &before, &[0], &before).unwrap();
 5076 |             assert_eq!(coverage_for(&after, "idx"), Some(compacted(shard, 3)));
 5077 |         }
 5078 | 
 5079 |         /// An unchanged index keeps what it recorded even when this commit's
 5080 |         /// own snapshot cannot prove as much.
 5081 |         #[test]
 5082 |         fn an_unchanged_index_is_never_lowered() {
 5083 |             let shard = Uuid::new_v4();
 5084 |             let uuid = Uuid::new_v4();
 5085 |             let before = table(&[0], uuid, progress_with_catchup(shard, 9, 9));
 5086 |             let mut after = before.clone();
 5087 |             apply(&mut after, &before, &[0, 1], &before).unwrap();
 5088 |             assert_eq!(coverage_for(&after, "idx"), Some(compacted(shard, 9)));
 5089 |         }
 5090 | 
 5091 |         /// Credit never exceeds what this commit records as compacted, so a
 5092 |         /// read version since rolled back cannot retire SSTables no live commit
 5093 |         /// copied in.
 5094 |         #[test]
 5095 |         fn credit_is_capped_by_the_committed_progress() {
 5096 |             let shard = Uuid::new_v4();
 5097 |             let read = table(&[0], Uuid::new_v4(), progress(shard, 9));
 5098 |             let mut after = table(&[0], Uuid::new_v4(), progress(shard, 3));
 5099 |             apply(&mut after, &read, &[0], &read).unwrap();
 5100 |             assert_eq!(coverage_for(&after, "idx"), Some(compacted(shard, 3)));
 5101 |         }
 5102 | 
 5103 |         /// The cap is the read version's progress, not this commit's. A
 5104 |         /// compaction that landed while the index was being built put its rows
 5105 |         /// in fragments this transaction never inspected, so covering
 5106 |         /// everything it *did* read earns only what had been folded in by then.
 5107 |         #[test]
 5108 |         fn credit_never_reaches_past_the_read_version() {
 5109 |             let shard = Uuid::new_v4();
 5110 |             // Read at generation 2; generation 5 landed while this ran.
 5111 |             let read = table(&[0], Uuid::new_v4(), progress(shard, 2));
 5112 |             let mut after = table(&[0], Uuid::new_v4(), progress(shard, 5));
 5113 |             apply(&mut after, &read, &[0], &read).unwrap();
 5114 |             assert_eq!(coverage_for(&after, "idx"), Some(compacted(shard, 2)));
 5115 |         }
 5116 | 
 5117 |         /// One segment with an unknown bitmap makes the whole index unproven,
 5118 |         /// even when its siblings happen to span everything. Coverage that
 5119 |         /// cannot be read is not coverage that can be relied on.
 5120 |         #[test]
 5121 |         fn an_index_with_an_unknown_segment_is_not_credited() {
 5122 |             let shard = Uuid::new_v4();
 5123 |             let mut unknown = user_index("idx", Uuid::new_v4(), &[]);
 5124 |             unknown.fragment_bitmap = None;
 5125 |             let read = vec![
 5126 |                 user_index("idx", Uuid::new_v4(), &[0, 1]),
 5127 |                 unknown,
 5128 |                 mem_wal_index(progress(shard, 5)),
 5129 |             ];
 5130 |             let mut after = read.clone();
 5131 |             apply(&mut after, &read, &[0, 1], &read).unwrap();
 5132 |             assert_eq!(coverage_for(&after, "idx"), None);
 5133 |         }
 5134 | 
 5135 |         /// A dropped index has no coverage left to gate anything.
 5136 |         #[test]
 5137 |         fn a_dropped_index_loses_its_entry() {
 5138 |             let shard = Uuid::new_v4();
 5139 |             let before = table(&[0], Uuid::new_v4(), progress_with_catchup(shard, 5, 5));
 5140 |             let mut after = vec![mem_wal_index(progress_with_catchup(shard, 5, 5))];
 5141 |             apply(&mut after, &before, &[0], &before).unwrap();
 5142 |             assert_eq!(coverage_for(&after, "idx"), None);
 5143 |         }
 5144 | 
 5145 |         /// An index created by this commit is credited if it spans the read
 5146 |         /// version -- it was built over those fragments, so it holds their
 5147 |         /// rows. This is what the advance model could not express: an ordinary
 5148 |         /// build that fully covers had to throw its work away and wait.
 5149 |         #[test]
 5150 |         fn a_new_index_covering_the_read_version_is_credited() {
 5151 |             let shard = Uuid::new_v4();
 5152 |             let before = vec![mem_wal_index(progress(shard, 5))];
 5153 |             let mut after = table(&[0], Uuid::new_v4(), progress(shard, 5));
 5154 |             // Covers the read version, but was not there when it was read.
 5155 |             apply(&mut after, &before, &[0], &before).unwrap();
 5156 |             assert_eq!(coverage_for(&after, "idx"), Some(compacted(shard, 5)));
 5157 |         }
 5158 | 
 5159 |         /// A table carrying compaction progress but no catch-up entry earns one
 5160 |         /// from an ordinary commit. This is how a table written before catch-up
 5161 |         /// was maintained heals itself: nothing has to be run against it.
 5162 |         #[test]
 5163 |         fn a_table_with_no_catchup_entry_earns_one() {
 5164 |             let shard = Uuid::new_v4();
 5165 |             let before = table(&[0], Uuid::new_v4(), progress(shard, 5));
 5166 |             let mut after = before.clone();
 5167 |             apply(&mut after, &before, &[0], &before).unwrap();
 5168 |             assert_eq!(coverage_for(&after, "idx"), Some(compacted(shard, 5)));
 5169 |         }
 5170 | 
 5171 |         /// Two shards, only one of them compacted.
 5172 |         #[test]
 5173 |         fn each_shard_is_credited_independently() {
 5174 |             let merged = Uuid::new_v4();
 5175 |             let idle = Uuid::new_v4();
 5176 |             let details = MemWalIndexDetails {
 5177 |                 compacted_sstables: vec![
 5178 |                     CompactedSsTable::new(merged, 4),
 5179 |                     CompactedSsTable::new(idle, 0),
 5180 |                 ],
 5181 |                 ..Default::default()
 5182 |             };
 5183 |             let read = table(&[0], Uuid::new_v4(), details.clone());
 5184 |             let mut after = table(&[0], Uuid::new_v4(), details);
 5185 |             apply(&mut after, &read, &[0], &read).unwrap();
 5186 |             let coverage = coverage_for(&after, "idx").expect("credited");
 5187 |             assert_eq!(
 5188 |                 coverage
 5189 |                     .iter()
 5190 |                     .find(|g| g.shard_id == merged)
 5191 |                     .map(|g| g.generation),
 5192 |                 Some(4)
 5193 |             );
 5194 |             assert_eq!(
 5195 |                 coverage
 5196 |                     .iter()
 5197 |                     .find(|g| g.shard_id == idle)
 5198 |                     .map(|g| g.generation),
 5199 |                 Some(0)
 5200 |             );
 5201 |         }
 5202 | 
 5203 |         /// Two indexes advance independently: one covering, one behind.
 5204 |         #[test]
 5205 |         fn indexes_are_credited_independently() {
 5206 |             let shard = Uuid::new_v4();
 5207 |             let read = vec![
 5208 |                 user_index("fast", Uuid::new_v4(), &[0, 1]),
 5209 |                 user_index("slow", Uuid::new_v4(), &[0]),
 5210 |                 mem_wal_index(progress(shard, 6)),
 5211 |             ];
 5212 |             let mut after = read.clone();
 5213 |             apply(&mut after, &read, &[0, 1], &read).unwrap();
 5214 |             assert_eq!(coverage_for(&after, "fast"), Some(compacted(shard, 6)));
 5215 |             assert_eq!(coverage_for(&after, "slow"), None);
 5216 |         }
 5217 | 
 5218 |         /// An index whose coverage is unknown cannot be shown to cover anything.
 5219 |         #[test]
 5220 |         fn an_index_without_a_bitmap_is_not_credited() {
 5221 |             let shard = Uuid::new_v4();
 5222 |             let mut idx = user_index("idx", Uuid::new_v4(), &[0]);
 5223 |             idx.fragment_bitmap = None;
 5224 |             let read = vec![idx, mem_wal_index(progress(shard, 5))];
 5225 |             let mut after = read.clone();
 5226 |             apply(&mut after, &read, &[0], &read).unwrap();
 5227 |             assert_eq!(coverage_for(&after, "idx"), None);
 5228 |         }
 5229 | 
 5230 |         /// Nothing compacted means nothing to be behind on.
 5231 |         #[test]
 5232 |         fn no_compaction_progress_writes_no_entries() {
 5233 |             let before = table(&[0], Uuid::new_v4(), MemWalIndexDetails::default());
 5234 |             let mut after = before.clone();
 5235 |             let untouched = after.clone();
 5236 |             apply(&mut after, &before, &[0], &before).unwrap();
 5237 |             assert_eq!(after, untouched);
 5238 |         }
 5239 | 
 5240 |         /// No MemWAL system index: nothing to maintain, and no error.
 5241 |         #[test]
 5242 |         fn a_table_without_mem_wal_is_a_no_op() {
 5243 |             let before = vec![user_index("idx", Uuid::new_v4(), &[0])];
 5244 |             let mut after = before.clone();
 5245 |             let untouched = after.clone();
 5246 |             apply(&mut after, &before, &[0], &before).unwrap();
 5247 |             assert_eq!(after, untouched);
 5248 |         }
 5249 | 
 5250 |         /// No read version -- dataset creation, detached commits -- credits
 5251 |         /// nothing and lowers nothing.
 5252 |         #[test]
 5253 |         fn without_a_read_version_nothing_changes() {
 5254 |             let shard = Uuid::new_v4();
 5255 |             let uuid = Uuid::new_v4();
 5256 |             let before = table(&[0], uuid, progress_with_catchup(shard, 5, 5));
 5257 |             let mut after = before.clone();
 5258 |             let segments_before = Transaction::logical_index_segments(&before);
 5259 |             Transaction::apply_mem_wal_index_coverage(&mut after, &segments_before, None, 2)
 5260 |                 .unwrap();
 5261 |             assert_eq!(coverage_for(&after, "idx"), Some(compacted(shard, 5)));
 5262 |         }
 5263 | 
 5264 |         /// An untrained index covers nothing that exists, so a sibling's work
 5265 |         /// is no evidence for it.
 5266 |         #[test]
 5267 |         fn an_untrained_index_earns_nothing() {
 5268 |             let shard = Uuid::new_v4();
 5269 |             let read = vec![
 5270 |                 user_index("untrained", Uuid::new_v4(), &[]),
 5271 |                 user_index("trained", Uuid::new_v4(), &[0]),
 5272 |                 mem_wal_index(progress(shard, 10)),
 5273 |             ];
 5274 |             let mut after = read.clone();
 5275 |             apply(&mut after, &read, &[0], &read).unwrap();
 5276 |             assert_eq!(coverage_for(&after, "untrained"), None);
 5277 |             assert_eq!(coverage_for(&after, "trained"), Some(compacted(shard, 10)));
 5278 |         }
 5279 | 
 5280 |         /// Shards move independently within one index: one advances on this
 5281 |         /// commit's proof while another keeps the position it already had.
 5282 |         #[test]
 5283 |         fn a_shard_keeps_its_position_while_another_advances() {
 5284 |             let (advancing, quiet) = (Uuid::new_v4(), Uuid::new_v4());
 5285 |             let uuid = Uuid::new_v4();
 5286 |             let details = |advancing_gen: u64| MemWalIndexDetails {
 5287 |                 compacted_sstables: vec![
 5288 |                     CompactedSsTable::new(advancing, advancing_gen),
 5289 |                     CompactedSsTable::new(quiet, 10),
 5290 |                 ],
 5291 |                 index_catchup: vec![IndexCatchupProgress::new(
 5292 |                     "idx".to_string(),
 5293 |                     vec![CompactedSsTable::new(quiet, 7)],
 5294 |                 )],
 5295 |                 ..Default::default()
 5296 |             };
 5297 |             // The quiet shard was never compacted as of the read, so nothing
 5298 |             // this commit proves reaches it -- it keeps its recorded 7.
 5299 |             let read = vec![
 5300 |                 user_index("idx", uuid, &[0]),
 5301 |                 mem_wal_index(MemWalIndexDetails {
 5302 |                     compacted_sstables: vec![CompactedSsTable::new(advancing, 9)],
 5303 |                     ..details(9)
 5304 |                 }),
 5305 |             ];
 5306 |             let mut after = vec![user_index("idx", uuid, &[0]), mem_wal_index(details(10))];
 5307 |             apply(&mut after, &read, &[0], &read).unwrap();
 5308 | 
 5309 |             let mut coverage = coverage_for(&after, "idx").expect("credited");
 5310 |             coverage.sort_unstable_by_key(|sstable| sstable.shard_id);
 5311 |             let mut expected = vec![
 5312 |                 CompactedSsTable::new(advancing, 9),
 5313 |                 CompactedSsTable::new(quiet, 7),
 5314 |             ];
 5315 |             expected.sort_unstable_by_key(|sstable| sstable.shard_id);
 5316 |             assert_eq!(coverage, expected);
 5317 |         }
 5318 | 
 5319 |         /// The derivation drops coverage an index no longer earns, but it never
 5320 |         /// rejects the commit -- an ordinary index job must not be blocked by
 5321 |         /// a protocol it knows nothing about.
 5322 |         #[test]
 5323 |         fn an_ordinary_index_job_is_never_blocked() {
 5324 |             let shard = Uuid::new_v4();
 5325 |             let before = table(&[0, 1], Uuid::new_v4(), progress_with_catchup(shard, 5, 5));
 5326 |             // Rebuilt over a subset -- the shape a partial reindex leaves.
 5327 |             let mut after = table(&[0], Uuid::new_v4(), progress_with_catchup(shard, 5, 5));
 5328 |             apply(&mut after, &before, &[0, 1], &before).unwrap();
 5329 |             assert_eq!(coverage_for(&after, "idx"), None);
 5330 |         }
 5331 | 
 5332 |         /// A reader's rule is that a missing entry means "not caught up", so an
 5333 |         /// index caught up to nothing must be absent rather than present at
 5334 |         /// generation zero -- otherwise it reads as known-and-covered.
 5335 |         #[test]
 5336 |         fn an_index_caught_up_to_nothing_gets_no_entry() {
 5337 |             let shard = Uuid::new_v4();
 5338 |             let uuid = Uuid::new_v4();
 5339 |             let before = table(&[0], uuid, progress_with_catchup(shard, 5, 0));
 5340 |             let mut after = before.clone();
 5341 |             // Does not span the read version, so nothing lifts it off zero.
 5342 |             apply(&mut after, &before, &[0, 1], &before).unwrap();
 5343 |             assert_eq!(coverage_for(&after, "idx"), None);
 5344 |         }
 5345 | 
 5346 |         /// Each shard carries its own position. Collapsing them to one value
 5347 |         /// would credit a lagging shard with a busier shard's progress.
 5348 |         #[test]
 5349 |         fn carried_positions_do_not_leak_between_shards() {
 5350 |             let (ahead, behind) = (Uuid::new_v4(), Uuid::new_v4());
 5351 |             let uuid = Uuid::new_v4();
 5352 |             let details = MemWalIndexDetails {
 5353 |                 compacted_sstables: vec![
 5354 |                     CompactedSsTable::new(ahead, 10),
 5355 |                     CompactedSsTable::new(behind, 10),
 5356 |                 ],
 5357 |                 index_catchup: vec![IndexCatchupProgress::new(
 5358 |                     "idx".to_string(),
 5359 |                     vec![
 5360 |                         CompactedSsTable::new(ahead, 8),
 5361 |                         CompactedSsTable::new(behind, 2),
 5362 |                     ],
 5363 |                 )],
 5364 |                 ..Default::default()
 5365 |             };
 5366 |             let before = vec![user_index("idx", uuid, &[0]), mem_wal_index(details)];
 5367 |             let mut after = before.clone();
 5368 |             // Unchanged and unproven: both shards keep exactly what they had.
 5369 |             apply(&mut after, &before, &[0, 1], &before).unwrap();
 5370 | 
 5371 |             let mut coverage = coverage_for(&after, "idx").expect("carried");
 5372 |             coverage.sort_unstable_by_key(|sstable| sstable.shard_id);
 5373 |             let mut expected = vec![
 5374 |                 CompactedSsTable::new(ahead, 8),
 5375 |                 CompactedSsTable::new(behind, 2),
 5376 |             ];
 5377 |             expected.sort_unstable_by_key(|sstable| sstable.shard_id);
 5378 |             assert_eq!(coverage, expected);
 5379 |         }
 5380 | 
 5381 |         /// The derivation runs while the manifest is being built, but the
 5382 |         /// index list is not final there: `migrate_indices` recalculates a
 5383 |         /// segment's fragment bitmap and keeps its UUID. A position decided
 5384 |         /// before that must not survive the narrowing, or the WAL pod trims
 5385 |         /// against an index that no longer covers those rows.
 5386 |         #[test]
 5387 |         fn a_bitmap_narrowed_after_the_build_loses_its_position() {
 5388 |             let shard = Uuid::new_v4();
 5389 |             let uuid = Uuid::new_v4();
 5390 |             // What migrate_indices leaves behind: same UUID, fewer fragments,
 5391 |             // and it says so.
 5392 |             let mut migrated = table(&[0], uuid, progress_with_catchup(shard, 5, 5));
 5393 | 
 5394 |             Transaction::withdraw_coverage_invalidated_after_build(
 5395 |                 &mut migrated,
 5396 |                 &["idx".to_string()],
 5397 |                 3,
 5398 |             )
 5399 |             .unwrap();
 5400 | 
 5401 |             assert_eq!(coverage_for(&migrated, "idx"), None);
 5402 |         }
 5403 | 
 5404 |         /// Migration routinely fills in file lists and inferred details. Those
 5405 |         /// do not change which rows an index answers for, so withdrawing on
 5406 |         /// them would drop coverage every commit for no reason.
 5407 |         #[test]
 5408 |         fn metadata_migration_that_does_not_narrow_keeps_its_position() {
 5409 |             let shard = Uuid::new_v4();
 5410 |             let uuid = Uuid::new_v4();
 5411 |             let mut migrated = table(&[0, 1], uuid, progress_with_catchup(shard, 5, 5));
 5412 |             migrated[0].files = Some(Vec::new());
 5413 |             migrated[0].created_at = Some(chrono::Utc::now());
 5414 | 
 5415 |             // Nothing narrowed, so migration reports nothing.
 5416 |             Transaction::withdraw_coverage_invalidated_after_build(&mut migrated, &[], 3).unwrap();
 5417 | 
 5418 |             assert_eq!(coverage_for(&migrated, "idx"), Some(compacted(shard, 5)));
 5419 |         }
 5420 | 
 5421 |         /// A commit that changes nothing must not churn the system index: a new
 5422 |         /// UUID on every append would invalidate its cache entry fleet-wide.
 5423 |         #[test]
 5424 |         fn an_unchanged_commit_does_not_rewrite_the_system_index() {
 5425 |             let shard = Uuid::new_v4();
 5426 |             let uuid = Uuid::new_v4();
 5427 |             let before = table(&[0], uuid, progress_with_catchup(shard, 5, 5));
 5428 |             let mut after = before.clone();
 5429 |             apply(&mut after, &before, &[0], &before).unwrap();
 5430 | 
 5431 |             let system_uuid = |indices: &[IndexMetadata]| {
 5432 |                 indices
 5433 |                     .iter()
 5434 |                     .find(|idx| idx.name == MEM_WAL_INDEX_NAME)
 5435 |                     .unwrap()
 5436 |                     .uuid
 5437 |             };
 5438 |             assert_eq!(system_uuid(&after), system_uuid(&before));
 5439 |         }
 5440 | 
 5441 |         /// A commit with no read version still withdraws. It can prove nothing,
 5442 |         /// so an index it changed keeps no position -- the alternative leaves a
 5443 |         /// position describing an index that no longer exists.
 5444 |         #[test]
 5445 |         fn without_a_read_version_a_changed_index_still_loses_its_position() {
 5446 |             let shard = Uuid::new_v4();
 5447 |             let before = table(&[0, 1], Uuid::new_v4(), progress_with_catchup(shard, 5, 5));
 5448 |             let mut after = table(&[0], Uuid::new_v4(), progress_with_catchup(shard, 5, 5));
 5449 |             let segments_before = Transaction::logical_index_segments(&before);
 5450 |             Transaction::apply_mem_wal_index_coverage(&mut after, &segments_before, None, 2)
 5451 |                 .unwrap();
 5452 |             assert_eq!(coverage_for(&after, "idx"), None);
 5453 |         }
 5454 | 
 5455 |         /// Two attempts against the same read version agree, which is what makes
 5456 |         /// a rebase safe: `read_version` is fixed for a transaction's life.
 5457 |         #[test]
 5458 |         fn the_derivation_is_stable_across_attempts() {
 5459 |             let shard = Uuid::new_v4();
 5460 |             let read = table(&[0, 1], Uuid::new_v4(), progress(shard, 5));
 5461 |             let mut first = table(&[0, 1], Uuid::new_v4(), progress(shard, 5));
 5462 |             let mut second = first.clone();
 5463 |             apply(&mut first, &read, &[0, 1], &read).unwrap();
 5464 |             apply(&mut second, &read, &[0, 1], &read).unwrap();
 5465 |             assert_eq!(coverage_for(&first, "idx"), coverage_for(&second, "idx"));
 5466 |         }
 5467 |     }
 5468 | }
``````
