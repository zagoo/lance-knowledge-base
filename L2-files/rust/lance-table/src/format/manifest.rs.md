> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/format/manifest.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `26412ae3472839b8f79357145da75597aeb631da4c5626fe28d40d2ed7313ed6`. Reviewed physical lines: 1-1825.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

In-memory dataset manifest, metadata transformations, fragment accounting, protobuf conversion, writer/version descriptors and frozen V1 self-describing reader adapter. Selected public types/functions are reexported by format; ManifestSummary and VersionPart are public inside the private child but not reexported. (rust/lance-table/src/format/manifest.rs:1-1825)

## Complete range analysis

### Lines 1-31

SPDX/imports connect async_trait, Bytes, chrono, DeepSizeOf, file schema adapters/exact versions and V1 dictionaries/reader, IO ProtoStruct/Reader/read_struct, Path, prost/Timestamp, maps/ranges/Arc, Fragment/interner/row IDs, feature bits, LanceCache/Schema/errors and ObjectStore/Registry. Lance-file parsing is now analyzed; full backend IO remains pending. (rust/lance-table/src/format/manifest.rs:1-31)

### Lines 32-109

Manifest derives Debug/Clone/PartialEq/DeepSizeOf. Public fields hold schema, dataset version/branch, optional writer version, Arc<Vec<Fragment>>, aux/index/transaction positions, u128 nanosecond timestamp, tag, reader/writer words, optional u32 max-fragment high-water mark, optional transaction path, next_row_id:u64, exact DataStorageFormat, config/table_metadata/base_paths maps. Only fragment_offsets:Vec<usize> is private. Docs require fragments sorted by ID with gaps, but constructors/conversion below do not sort or enforce this; public fragments replacement can stale the private offsets. Dataset version, writer-library version and data-file version are separate values. (rust/lance-table/src/format/manifest.rs:32-109)

### Lines 110-129

DETACHED_VERSION_MASK is bit63 (0x8000000000000000); is_detached_version tests it only. compute_fragment_offsets maps each Fragment::num_rows().unwrap_or_default(), chains final zero, and scans prefix sums into N+1 entries, including terminal total (empty list->[0]). Unknown row count contributes zero; ordinary usize addition is unchecked. It preserves fragment order and performs no row-ID mapping. (rust/lance-table/src/format/manifest.rs:110-129)

### Lines 130-172

Default ManifestSummary has seven u64 counters. Consuming conversion to BTreeMap<String,String> writes exactly total_fragments, total_data_files, total_files_size, total_deletion_files, total_data_file_rows, total_deletion_file_rows, total_rows, all decimal strings. Type is pub in private module, not facade-reexported, though callers can infer the summary return type and use its public fields. (rust/lance-table/src/format/manifest.rs:130-172)

### Lines 173-205

Manifest::new accepts owned Schema, shared fragment Vec, storage format and base-path map; computes offsets, starts version1/current WriterVersion, zero timestamp/feature words/aux position/next row ID, absent branch/tag/index/transaction/high-water mark, and empty config/table metadata. It does not inspect formats, assign fragment IDs, validate schema/carriers or perform IO. (rust/lance-table/src/format/manifest.rs:173-205)

### Lines 206-236

new_from_previous uses supplied schema/fragments and recomputed offsets; increments previous version with unchecked +1, retains branch/high-water/next row ID/storage/config/table metadata/bases and refreshes writer version. It clears aux/index/time/tag/transaction references and preserves only STICKY_PAIRED_FLAGS separately in reader/writer words. It neither normalizes nor validates half-set pairs and does not preserve covered-index bit here. Caller must restore index metadata as comment states. (rust/lance-table/src/format/manifest.rs:206-236)

### Lines 237-269

shallow_clone is in-memory: clones each Fragment, stamps ref_base_id only on base and overlay DataFiles whose base_id is None via referenced_lance_files_mut, and similarly stamps local deletion descriptor. Existing external base IDs remain. Inline/column metadata remains cloned; no files are opened/copied. (rust/lance-table/src/format/manifest.rs:237-269)

### Lines 270-309

Shallow clone keeps source version/writer/aux position/time/high-water/offsets/next row ID/storage/config/table metadata, uses new branch and transaction_file=Some(input), clears tag/index/transaction_section, and allocates a new fragment Arc. It masks each feature word to covered-index bit OR sticky pairs, preserving each side independently. Source comments justify conservative covered-index retention; index metadata copy happens outside this function. Base map is cloned and insert(ref_base_id, BasePath(...,is_dataset_root=true)) can replace an existing entry without collision validation. (rust/lance-table/src/format/manifest.rs:270-309)

### Lines 310-340

timestamp splits u128 nanos into remainder<1e9 and casts whole seconds to i64, uses chrono from_timestamp with unwrap_or_default fallback for unrepresentable date, then Utc. No error returned. set_timestamp actually accepts u128 raw nanos despite DateTime doc wording. config_mut/table_metadata_mut/schema_metadata_mut return mutable maps with no validation, persistence or feature recomputation. (rust/lance-table/src/format/manifest.rs:310-340)

### Lines 341-362

field_metadata_mut delegates recursive schema field_by_id_mut then yields metadata or None. Deprecated update_config extends config with key overwrite semantics; deprecated delete_config_keys retains entries whose names are absent from supplied slice. No table configuration semantics are checked. (rust/lance-table/src/format/manifest.rs:341-362)

### Lines 363-390

Deprecated replace_schema_metadata replaces whole schema map. Deprecated replace_field_metadata replaces selected field map and returns Ok, or InvalidInput with field ID if missing. The preceding no-op comment is inconsistent with the implemented error branch; document the error as behavior. No primary-key validation is invoked. (rust/lance-table/src/format/manifest.rs:363-390)

### Lines 391-420

detach_sparse_inline_row_ids sums visible lengths of Inline row-ID payloads (not deduplicated, not created/updated versions). Returns unchanged if sum==0 or sum.saturating_mul(4)>=buffer_len, preserving exact quarter boundary. Otherwise Arc::make_mut obtains fragments and each Inline gets Bytes::copy_from_slice wrapped in a fresh InlineRowIds (new digest memo); other metadata unchanged. A shared fragments Arc triggers clone-on-write. Caller-provided buffer_len is trusted; whole original buffer release is not guaranteed while other owners/slices survive. Ordinary sum can overflow; multiplication is saturating. (rust/lance-table/src/format/manifest.rs:391-420)

### Lines 421-451

update_max_fragment_id returns for empty fragments, otherwise takes maximum u64 ID then try_into u32 and unwraps (panic above u32::MAX). It initializes absent mark or raises it only, retaining historic high water after deletes. No Result or ID validation; a stored larger mark is preserved. (rust/lance-table/src/format/manifest.rs:421-451)

### Lines 452-486

max_fragment_id returns stored u32 mark widened to u64 if present, otherwise computes maximum existing fragment ID, with None only for unset+empty. max_field_id compares schema max (default-1) with every field ID in base and overlay referenced files (default-1); includes dropped schema fields and does not explicitly filter tombstone or reserved IDs. No field IDs are assigned. (rust/lance-table/src/format/manifest.rs:452-486)

### Lines 487-504

fragments_since rejects since.version>=self.version, including equality, with InvalidInput describing newer version. It uses since.max_fragment_id as threshold and clones current fragments with strictly greater IDs, or all if absent. This is an ID-high-water heuristic, not content comparison; docs exclude recycling and it does not validate common lineage/branch. (rust/lance-table/src/format/manifest.rs:487-504)

### Lines 505-541

fragments_by_offset_range uses logical row offsets, not row IDs: binary_search start in cached N+1 prefix offsets, otherwise insertion index minus1, then walk fragment indices. Break when fragment start>=end OR fragment end<=start; append(start,&Fragment) otherwise. Unknown current length acts as zero. It does not validate/recompute offsets, sort, deduplicate equal offsets or explicitly validate empty/reversed ranges. Duplicated offsets/zero-length fragments may select a zero-length entry and break before later data; callers need valid coherent counts. Returned elements borrow fragments, despite doc return wording showing owned Fragment. (rust/lance-table/src/format/manifest.rs:505-541)

### Lines 542-553

uses_stable_row_ids checks reader word FLAG_STABLE_ROW_IDS only, not per-fragment metadata or writer word. serialized builds pb::Manifest then encode_to_vec: raw protobuf bytes suitable for IPC/temp storage, not a complete on-disk manifest with footer/sections/dictionaries. (rust/lance-table/src/format/manifest.rs:542-553)

### Lines 554-600

summary folds fragments: total_data_files counts base f.files only and total_files_size sums only known sizes of those base files, excluding overlays/deletion/index files despite broad docs. total_rows sums only known f.num_rows; deletion_file presence counts even if deleted count unknown, known deletion counts sum separately. total_fragments is Vec length; total_data_file_rows=total_rows+total_deletion_file_rows, not sum of all physical counts when some lengths unknown. Ordinary u64 additions are unchecked; no IO resolves missing sizes/counts. (rust/lance-table/src/format/manifest.rs:554-600)

### Lines 601-634

Async populate_manifest_schema_dictionaries is a V1 compatibility adapter. Exact V1 delegates populate_schema_dictionaries(&mut schema,reader).await; V2_0/V2_1/V2_2/V2_3 are explicit no-ops. No version selector or writer-library comparison is used. Included doctest wraps an async Result function, not ignore; it was not compiled. (rust/lance-table/src/format/manifest.rs:601-634)

### Lines 635-669

BasePath stores public id:u32, optional name, is_dataset_root:bool and full URI/path String. new assigns without URI/ID validation; extract_path synchronously delegates ObjectStore::extract_path_from_uri(registry,&path), propagating Result. Actual parsing/registry behavior is pending; no store initialization in this body. (rust/lance-table/src/format/manifest.rs:635-669)

### Lines 670-677

BasePath custom DeepSizeOf children adds name children + twice path children + size_of<bool>(). This literally overcounts path allocation relative to normal one-string ownership and adds inline bool as a child; source gives no rationale. It is an estimator, not measured retained heap. (rust/lance-table/src/format/manifest.rs:670-677)

### Lines 678-724

WriterVersion stores public library/version Strings plus optional prerelease/build metadata. DataStorageFormat stores public file_format:String and ConcreteFileVersion; new uses literal lance, getter returns exact enum, Default uses stable_file_version() resolved elsewhere. TryFrom protobuf preserves file_format without checking it equals lance and parses version via from_manifest_string. Exact mappings are now covered at rust/lance-file/src/version.rs:19-27 and rust/lance-file/src/version.rs:172-261; selector acceptance remains distinct from persisted strings. (rust/lance-table/src/format/manifest.rs:678-724)

### Lines 725-761

ManifestBuildConfig is a data-only public Debug/Clone struct with auto_set_feature_flags, resolved timestamp_nanos, use_stable_row_ids, optional legacy mode/storage_format, disable_transaction_file, migration_next_row_id and Arc<SpilledRowLineage>. Docs specify sticky row IDs, overwrite-only storage override precedence, migration bypass and prefetched spilled sequences needed for rewrite/update; no enforcement/default implementation occurs in this file. Clock resolution deliberately belongs to caller; cfg(test) clock mocking in lance is a source comment, consumer implementation pending. (rust/lance-table/src/format/manifest.rs:725-761)

### Lines 762-785

VersionPart Major/Minor/Patch is pub in private module with no facade reexport. Private bump_version increments chosen semver u64 component, resets lower components for major/minor, leaves prerelease/build intact and uses ordinary unchecked additions. (rust/lance-table/src/format/manifest.rs:762-785)

### Lines 786-816

Private split_version parses semver, returns None on error, extracts nonempty pre/build as optional Strings, clears both in parsed object and returns clean major.minor.patch plus separate components. Docs include rc/build/invalid examples. No library check here. (rust/lance-table/src/format/manifest.rs:786-816)

### Lines 817-838

Deprecated semver is a distinct lenient parser: split self.version at first dash, parse first three dot-separated components as u32 with missing minor/patch default0, return remainder after dash as optional borrowed tag. Extra dot parts are ignored, explicit prerelease/build fields and library are ignored; plus-build in patch can cause parse failure. It is not equivalent to full semver::Version parsing despite doc wording. (rust/lance-table/src/format/manifest.rs:817-838)

### Lines 839-863

lance_lib_version rejects library != exact lowercase lance, parses self.version with semver, then when separate prerelease/build fields are Some parses and overwrites corresponding parsed components. None leaves components embedded in version string intact. Any parse error returns None. Arbitrary nonsemver WriterVersion values remain constructible; only this interpretation fails. (rust/lance-table/src/format/manifest.rs:839-863)

### Lines 864-910

Deprecated semver_or_panic wraps old parser and panics with raw version on failure. older_than uses lance_lib_version().expect then compares against release major/minor/patch with empty pre/build, so prerelease ordering follows semver. Deprecated bump expects valid Lance version, increments numeric part, clears only prerelease if keep_tag=false (build retained), splits back to clean fields and clones library. Non-Lance/invalid versions panic; future-private wording is intent, not current restriction. (rust/lance-table/src/format/manifest.rs:864-910)

### Lines 911-941

WriterVersion Default outside cfg(test) parses compile-time CARGO_PKG_VERSION and emits library lance, clean version and separate pre/build, panicking if invalid. Under this crate cfg(test), same fields then bump(Patch,true), retaining pre/build but using next patch. Dependency builds do not automatically inherit cfg(test); no actual Cargo version value is asserted here. (rust/lance-table/src/format/manifest.rs:911-941)

### Lines 942-962

ProtoStruct maps Manifest::Proto=pb::Manifest. BasePath From conversions copy/move matching id/name/root/path fields, no URI/duplicate validation. Converting owned BasePath to protobuf consumes Strings. (rust/lance-table/src/format/manifest.rs:942-962)

### Lines 963-987

Manifest TryFrom starts timestamp conversion by casting signed seconds/nanos to u128 then sec*1e9+nanos; absent timestamp defaults later to0. Negative or out-of-range values are not validated and casts/arithmetic can wrap/panic according to overflow policy. Any Some writer_version message becomes Some even with empty library/version; the fully-set comment does not enforce nonempty fields. (rust/lance-table/src/format/manifest.rs:963-987)

### Lines 988-1005

A fresh DataFileFieldInterner converts all protobuf fragments, sharing repeated base field/column lists and inline version bytes across this manifest, preserving fragment order. It computes logical offsets and wraps fields/schema metadata. If reader stable-row bit is set but any fragment lacks row_id_meta, returns Internal All fragments must have row ids; empty fragment set passes. It does not decode inline sequences or validate Column carriers. (rust/lance-table/src/format/manifest.rs:988-1005)

### Lines 1006-1024

If data_format absent, infer exact version from all base/overlay files, rejecting mixed versions; with no files use stable_file_version when deprecated writer bit2 set, else V1. If data_format present, trust converted DataStorageFormat without comparing per-file versions. Then convert schema via FieldsWithMeta. This conversion alone does not invoke ensure_can_read_manifest/paired flag checks or reject fragment_tree. (rust/lance-table/src/format/manifest.rs:1006-1024)

### Lines 1025-1057

Final Manifest retains raw version/branch/flags/high-water/next row/config/table metadata, casts aux/index/transaction offsets to usize without checked conversion, normalizes empty tag/transaction_file to None, and collects base-path entries by id into HashMap (later duplicate ID replaces earlier). Uses converted fragments/schema/format and computed offsets. Unknown/ignored protobuf fields including fragment_tree have no Rust representation here. (rust/lance-table/src/format/manifest.rs:1025-1057)

### Lines 1058-1090

Manifest->protobuf omits timestamp if nanos==0, else divides into seconds cast i64 and subsecond i32 without overflow validation. Converts schema through FieldsWithMeta and separately encodes schema metadata String values as UTF8 Vec; clones branch/writer strings including separate pre/build and converts fragments in order. This conversion does not validate inputs. (rust/lance-table/src/format/manifest.rs:1058-1090)

### Lines 1091-1125

Output sets fragment_tree=None, preserves metadata/flags/high-water/counts, casts usize positions to u64, writes absent tag/transaction file as empty String, always includes data_format with exact to_manifest_string, clones config and emits base_paths from HashMap values in unspecified order. transaction_section presence retained. This is a protobuf object conversion, not atomic manifest publication or canonical byte ordering. (rust/lance-table/src/format/manifest.rs:1091-1125)

### Lines 1126-1154

Public async_trait SelfDescribingFileReader offers default try_new_self_described(ObjectStore,Path,optional&LanceCache): await store.open, convert reader into Arc then delegate required try_new_self_described_from_reader. Both require Self:Sized; from_reader accepts Arc<dyn Reader>. Docs prefer fragment readers for cached schemas; no caching algorithm or format detection is implemented by the trait default. (rust/lance-table/src/format/manifest.rs:1126-1154)

### Lines 1155-1183

Only implementation here is V1FileReader: read_metadata(reader,cache), require metadata.manifest_position or Internal with reader path, read_struct<Manifest> at position, hydrate V1 dictionaries, take schema/max_field_id(default0), then call V1 try_new_from_reader with path, reader clone, Some(metadata), schema, numeric0,0,max ID and cache. Errors propagate at awaits; compatibility adapter does not add a V2 self-describing implementation. The numeric arguments are fragment_id=0, field_id_offset=0 and schema max_field_id. Complete V1 reader construction/cache/metadata behavior is now covered (rust/lance-file/src/versions/v1/reader.rs:165-294); backend IO remains pending. (rust/lance-table/src/format/manifest.rs:1155-1183)

### Lines 1184-1238

cfg(test) imports feature bit, overlay/data/deletion types, Arrow/core fields and bitmap. Shallow clone fixture with one base and one overlay asserts both local base IDs become7. It does not assert existing external IDs, deletion stamping, feature retention, URI behavior or disk clone. (rust/lance-table/src/format/manifest.rs:1184-1238)

### Lines 1239-1275

Old empty manifest fixture with absent data_format recovers V1 without deprecated writer bit, current stable with it. Persistence rejection loops stable,next,legacy,0.3 and asserts conversion error. These are constructed protobuf values, not released historical fixtures or proof all version aliases are covered. (rust/lance-table/src/format/manifest.rs:1239-1275)

### Lines 1276-1333

Canonical output fixture asserts V2_0 serializes version string2.0. Missing-format fixture recovers exact V2_0 from a file even when prior in-memory storage field was V1, then rejects V2_0/V2_1 files when protobuf format is removed. Explicit-format mixed-version validation is not tested here. (rust/lance-table/src/format/manifest.rs:1276-1333)

### Lines 1334-1368

Detach fixture holds two10-byte slices of one64-byte buffer, supplies logical buffer_len80 then81. Exact quarter retains original pointers; below quarter copies both pointers outside original allocation and verifies second payload contents. It trusts the provided length, does not assert deallocation/RSS, Arc sharing or digest behavior. (rust/lance-table/src/format/manifest.rs:1334-1368)

### Lines 1369-1422

Writer default fixture asserts lance, three-part clean version, cargo prerelease tag, no build metadata for this package, reconstructed Cargo major/minor and patch+1 under cfg(test), and each numeric bump produces greater version. expected_tag is split from Cargo text; fixture assumes package metadata layout, not a general parser proof. (rust/lance-table/src/format/manifest.rs:1369-1422)

### Lines 1423-1455

Split-version test covers release, rc.1, rc.1+build.123, build-only and invalid string, with exact clean/pre/build components. Does not cover the deprecated lenient parser. (rust/lance-table/src/format/manifest.rs:1423-1455)

### Lines 1456-1514

Writer tests compare rc.1<release, reconstruct rc.1+build.123 and all numeric/pre/build fields, and allow nonsemver WriterVersion custom-build-v1 while lance_lib_version returns None. No other-library or invalid separate-component fixture. (rust/lance-table/src/format/manifest.rs:1456-1514)

### Lines 1515-1548

Deprecated older_than fixture requires rc2.0.0 below2.0.0/2.0.1 but not1.9.9, release2.0.0 not older than itself but older than2.0.1. Panic behavior for invalid/non-Lance input is not tested. (rust/lance-table/src/format/manifest.rs:1515-1548)

### Lines 1549-1594

Offset-range fixture has three fragments of10/15/20 rows, expects0..10 first only,5..15 first two,15..50 latter two at offsets10/25;45..100 and200..400 empty. It does not cover zero/unknown counts, reversed/empty interior ranges or stale offsets. (rust/lance-table/src/format/manifest.rs:1549-1594)

### Lines 1595-1648

Max-field fixture uses schema IDs0/2, multiple files/fragments including dropped ID43 and expects43. Tests dropped physical IDs beyond schema maximum without reading data or assigning IDs through Manifest. (rust/lance-table/src/format/manifest.rs:1595-1648)

### Lines 1649-1684

Overlay max-field fixture puts ID43 only in overlay over base0 and expects43, proving referenced overlay IDs participate in high-water calculation. No tombstone/reserved-ID boundary case. (rust/lance-table/src/format/manifest.rs:1649-1684)

### Lines 1685-1716

Config fixture constructs three-fragment manifest, extends config_mut with two keys and removes one; equality confirms in-memory map mutation. It does not recompute feature flags, persist metadata or test deprecated APIs. (rust/lance-table/src/format/manifest.rs:1685-1716)

### Lines 1717-1786

Summary test starts empty manifest (all seven zero), two known-zero fragments (two files/fragments but zero rows/sizes), then three in-memory fragments100/250/75 (425 rows, three files, unknown sizes contribute0). Comments saying write files do not correspond to IO in this test. (rust/lance-table/src/format/manifest.rs:1717-1786)

### Lines 1787-1825

Summary deletion fixture sets one known1000-byte file/50 physical rows/10 deleted, expects40 live,50 total-data rows,10 deleted and one deletion/file/fragment, then seven string-map entries. Overlay omission and unknown physical/deleted-count combinations are not tested. All file tests/doctest were read, not executed. (rust/lance-table/src/format/manifest.rs:1787-1825)

## Interaction and interpretation limits

All1825 lines read in bounded chunks. Visibility facade: rust/lance-table/src/format.rs:21-25. Local metadata conversion, counters and helpers are covered; transaction builder enforcement, commit flags/support checks, IO framing, full RowIdSequence and dataset consumers remain pending; nested wire codecs are now covered at rust/lance-table/src/rowids/serde.rs:1-884. Exact file-version, overlay and row-version implementations are now covered in their own L2 entries. No build/test/benchmark, file-format release qualification or external-dependency behavior verification was performed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use async_trait::async_trait;
    5 | use bytes::Bytes;
    6 | use chrono::prelude::*;
    7 | use lance_core::deepsize::DeepSizeOf;
    8 | use lance_file::datatypes::{Fields, FieldsWithMeta};
    9 | use lance_file::version::{ConcreteFileVersion, stable_file_version};
   10 | use lance_file::versions::v1::{
   11 |     encoding::populate_schema_dictionaries, reader::FileReader as V1FileReader,
   12 | };
   13 | use lance_io::traits::{ProtoStruct, Reader};
   14 | use object_store::path::Path;
   15 | use prost::Message;
   16 | use prost_types::Timestamp;
   17 | use std::collections::{BTreeMap, HashMap};
   18 | use std::ops::Range;
   19 | use std::sync::Arc;
   20 | 
   21 | use super::{Fragment, InlineRowIds, RowIdMeta};
   22 | use crate::feature_flags::{FLAG_COVERED_INDEX_METADATA, STICKY_PAIRED_FLAGS};
   23 | use crate::feature_flags::{FLAG_STABLE_ROW_IDS, has_deprecated_v2_feature_flag};
   24 | use crate::format::fragment::DataFileFieldInterner;
   25 | use crate::format::pb;
   26 | use lance_core::cache::LanceCache;
   27 | use lance_core::datatypes::Schema;
   28 | use lance_core::{Error, Result};
   29 | use lance_io::object_store::{ObjectStore, ObjectStoreRegistry};
   30 | use lance_io::utils::read_struct;
   31 | 
   32 | /// Manifest of a dataset
   33 | ///
   34 | ///  * Schema
   35 | ///  * Version
   36 | ///  * Fragments.
   37 | ///  * Indices.
   38 | #[derive(Debug, Clone, PartialEq, DeepSizeOf)]
   39 | pub struct Manifest {
   40 |     /// Dataset schema.
   41 |     pub schema: Schema,
   42 | 
   43 |     /// Dataset version
   44 |     pub version: u64,
   45 | 
   46 |     /// Branch name, None if the dataset is the main branch.
   47 |     pub branch: Option<String>,
   48 | 
   49 |     /// Version of the writer library that wrote this manifest.
   50 |     pub writer_version: Option<WriterVersion>,
   51 | 
   52 |     /// Fragments, the pieces to build the dataset.
   53 |     ///
   54 |     /// This list is stored in order, sorted by fragment id.  However, the fragment id
   55 |     /// sequence may have gaps.
   56 |     pub fragments: Arc<Vec<Fragment>>,
   57 | 
   58 |     /// The file position of the version aux data.
   59 |     pub version_aux_data: usize,
   60 | 
   61 |     /// The file position of the index metadata.
   62 |     pub index_section: Option<usize>,
   63 | 
   64 |     /// The creation timestamp with nanosecond resolution as 128-bit integer
   65 |     pub timestamp_nanos: u128,
   66 | 
   67 |     /// An optional string tag for this version
   68 |     pub tag: Option<String>,
   69 | 
   70 |     /// The reader flags
   71 |     pub reader_feature_flags: u64,
   72 | 
   73 |     /// The writer flags
   74 |     pub writer_feature_flags: u64,
   75 | 
   76 |     /// The max fragment id used so far
   77 |     /// None means never set, Some(0) means max ID used so far is 0
   78 |     pub max_fragment_id: Option<u32>,
   79 | 
   80 |     /// The path to the transaction file, relative to the root of the dataset
   81 |     pub transaction_file: Option<String>,
   82 | 
   83 |     /// The file position of the inline transaction content inside the manifest
   84 |     pub transaction_section: Option<usize>,
   85 | 
   86 |     /// Precomputed logic offset of each fragment
   87 |     /// accelerating the fragment search using offset ranges.
   88 |     fragment_offsets: Vec<usize>,
   89 | 
   90 |     /// The max row id used so far.
   91 |     pub next_row_id: u64,
   92 | 
   93 |     /// The storage format of the data files.
   94 |     pub data_storage_format: DataStorageFormat,
   95 | 
   96 |     /// Table configuration.
   97 |     pub config: HashMap<String, String>,
   98 | 
   99 |     /// Table metadata.
  100 |     ///
  101 |     /// This is a key-value map that can be used to store arbitrary metadata
  102 |     /// associated with the table. This is different than configuration, which
  103 |     /// is used to tell libraries how to read, write, or manage the table.
  104 |     pub table_metadata: HashMap<String, String>,
  105 | 
  106 |     /* external base paths */
  107 |     pub base_paths: HashMap<u32, BasePath>,
  108 | }
  109 | 
  110 | // We use the most significant bit to indicate that a transaction is detached
  111 | pub const DETACHED_VERSION_MASK: u64 = 0x8000_0000_0000_0000;
  112 | 
  113 | pub fn is_detached_version(version: u64) -> bool {
  114 |     version & DETACHED_VERSION_MASK != 0
  115 | }
  116 | 
  117 | fn compute_fragment_offsets(fragments: &[Fragment]) -> Vec<usize> {
  118 |     fragments
  119 |         .iter()
  120 |         .map(|f| f.num_rows().unwrap_or_default())
  121 |         .chain([0]) // Make the last offset to be the full-length of the dataset.
  122 |         .scan(0_usize, |offset, len| {
  123 |             let start = *offset;
  124 |             *offset += len;
  125 |             Some(start)
  126 |         })
  127 |         .collect()
  128 | }
  129 | 
  130 | #[derive(Default)]
  131 | pub struct ManifestSummary {
  132 |     pub total_fragments: u64,
  133 |     pub total_data_files: u64,
  134 |     pub total_files_size: u64,
  135 |     pub total_deletion_files: u64,
  136 |     pub total_data_file_rows: u64,
  137 |     pub total_deletion_file_rows: u64,
  138 |     pub total_rows: u64,
  139 | }
  140 | 
  141 | impl From<ManifestSummary> for BTreeMap<String, String> {
  142 |     fn from(summary: ManifestSummary) -> Self {
  143 |         let mut stats_map = Self::new();
  144 |         stats_map.insert(
  145 |             "total_fragments".to_string(),
  146 |             summary.total_fragments.to_string(),
  147 |         );
  148 |         stats_map.insert(
  149 |             "total_data_files".to_string(),
  150 |             summary.total_data_files.to_string(),
  151 |         );
  152 |         stats_map.insert(
  153 |             "total_files_size".to_string(),
  154 |             summary.total_files_size.to_string(),
  155 |         );
  156 |         stats_map.insert(
  157 |             "total_deletion_files".to_string(),
  158 |             summary.total_deletion_files.to_string(),
  159 |         );
  160 |         stats_map.insert(
  161 |             "total_data_file_rows".to_string(),
  162 |             summary.total_data_file_rows.to_string(),
  163 |         );
  164 |         stats_map.insert(
  165 |             "total_deletion_file_rows".to_string(),
  166 |             summary.total_deletion_file_rows.to_string(),
  167 |         );
  168 |         stats_map.insert("total_rows".to_string(), summary.total_rows.to_string());
  169 |         stats_map
  170 |     }
  171 | }
  172 | 
  173 | impl Manifest {
  174 |     pub fn new(
  175 |         schema: Schema,
  176 |         fragments: Arc<Vec<Fragment>>,
  177 |         data_storage_format: DataStorageFormat,
  178 |         base_paths: HashMap<u32, BasePath>,
  179 |     ) -> Self {
  180 |         let fragment_offsets = compute_fragment_offsets(&fragments);
  181 | 
  182 |         Self {
  183 |             schema,
  184 |             version: 1,
  185 |             branch: None,
  186 |             writer_version: Some(WriterVersion::default()),
  187 |             fragments,
  188 |             version_aux_data: 0,
  189 |             index_section: None,
  190 |             timestamp_nanos: 0,
  191 |             tag: None,
  192 |             reader_feature_flags: 0, // These will be set on commit
  193 |             writer_feature_flags: 0, // These will be set on commit
  194 |             max_fragment_id: None,
  195 |             transaction_file: None,
  196 |             transaction_section: None,
  197 |             fragment_offsets,
  198 |             next_row_id: 0,
  199 |             data_storage_format,
  200 |             config: HashMap::new(),
  201 |             table_metadata: HashMap::new(),
  202 |             base_paths,
  203 |         }
  204 |     }
  205 | 
  206 |     pub fn new_from_previous(
  207 |         previous: &Self,
  208 |         schema: Schema,
  209 |         fragments: Arc<Vec<Fragment>>,
  210 |     ) -> Self {
  211 |         let fragment_offsets = compute_fragment_offsets(&fragments);
  212 | 
  213 |         Self {
  214 |             schema,
  215 |             version: previous.version + 1,
  216 |             branch: previous.branch.clone(),
  217 |             writer_version: Some(WriterVersion::default()),
  218 |             fragments,
  219 |             version_aux_data: 0,
  220 |             index_section: None, // Caller should update index if they want to keep them.
  221 |             timestamp_nanos: 0,  // This will be set on commit
  222 |             tag: None,
  223 |             reader_feature_flags: previous.reader_feature_flags & STICKY_PAIRED_FLAGS,
  224 |             writer_feature_flags: previous.writer_feature_flags & STICKY_PAIRED_FLAGS,
  225 |             max_fragment_id: previous.max_fragment_id,
  226 |             transaction_file: None,
  227 |             transaction_section: None,
  228 |             fragment_offsets,
  229 |             next_row_id: previous.next_row_id,
  230 |             data_storage_format: previous.data_storage_format.clone(),
  231 |             config: previous.config.clone(),
  232 |             table_metadata: previous.table_metadata.clone(),
  233 |             base_paths: previous.base_paths.clone(),
  234 |         }
  235 |     }
  236 | 
  237 |     /// Performs a shallow_clone of the manifest entirely in memory without:
  238 |     /// - Any persistent storage operations
  239 |     /// - Modifications to the original data
  240 |     /// - If the shallow clone is for branch, ref_name is the source branch
  241 |     pub fn shallow_clone(
  242 |         &self,
  243 |         ref_name: Option<String>,
  244 |         ref_path: String,
  245 |         ref_base_id: u32,
  246 |         branch_name: Option<String>,
  247 |         transaction_file: String,
  248 |     ) -> Self {
  249 |         let cloned_fragments = self
  250 |             .fragments
  251 |             .as_ref()
  252 |             .iter()
  253 |             .map(|fragment| {
  254 |                 let mut cloned_fragment = fragment.clone();
  255 |                 for file in cloned_fragment.referenced_lance_files_mut() {
  256 |                     if file.base_id.is_none() {
  257 |                         file.base_id = Some(ref_base_id);
  258 |                     }
  259 |                 }
  260 | 
  261 |                 if let Some(deletion) = &mut cloned_fragment.deletion_file
  262 |                     && deletion.base_id.is_none()
  263 |                 {
  264 |                     deletion.base_id = Some(ref_base_id);
  265 |                 }
  266 |                 cloned_fragment
  267 |             })
  268 |             .collect::<Vec<_>>();
  269 | 
  270 |         Self {
  271 |             schema: self.schema.clone(),
  272 |             version: self.version,
  273 |             branch: branch_name,
  274 |             writer_version: self.writer_version.clone(),
  275 |             fragments: Arc::new(cloned_fragments),
  276 |             version_aux_data: self.version_aux_data,
  277 |             index_section: None, // These will be set on commit
  278 |             timestamp_nanos: self.timestamp_nanos,
  279 |             tag: None,
  280 |             // Not derivable from the manifest, so it would be lost like any other
  281 |             // zeroed word: a clone of a table with covering indexes would come
  282 |             // back unfenced, and since the clone copies the index metadata
  283 |             // wholesale -- `covering_fields` included -- a build that predates
  284 |             // covering could then open it and read carried columns as keyed ones.
  285 |             // Kept unconditionally rather than derived from the cloned indexes:
  286 |             // over-fencing a clone is harmless, under-fencing one is not.
  287 |             // Sticky capabilities are also retained because the clone keeps the
  288 |             // source file identities that require them.
  289 |             reader_feature_flags: self.reader_feature_flags
  290 |                 & (FLAG_COVERED_INDEX_METADATA | STICKY_PAIRED_FLAGS),
  291 |             writer_feature_flags: self.writer_feature_flags
  292 |                 & (FLAG_COVERED_INDEX_METADATA | STICKY_PAIRED_FLAGS),
  293 |             max_fragment_id: self.max_fragment_id,
  294 |             transaction_file: Some(transaction_file),
  295 |             transaction_section: None,
  296 |             fragment_offsets: self.fragment_offsets.clone(),
  297 |             next_row_id: self.next_row_id,
  298 |             data_storage_format: self.data_storage_format.clone(),
  299 |             config: self.config.clone(),
  300 |             base_paths: {
  301 |                 let mut base_paths = self.base_paths.clone();
  302 |                 let base_path = BasePath::new(ref_base_id, ref_path, ref_name, true);
  303 |                 base_paths.insert(ref_base_id, base_path);
  304 |                 base_paths
  305 |             },
  306 |             table_metadata: self.table_metadata.clone(),
  307 |         }
  308 |     }
  309 | 
  310 |     /// Return the `timestamp_nanos` value as a Utc DateTime
  311 |     pub fn timestamp(&self) -> DateTime<Utc> {
  312 |         let nanos = self.timestamp_nanos % 1_000_000_000;
  313 |         let seconds = ((self.timestamp_nanos - nanos) / 1_000_000_000) as i64;
  314 |         Utc.from_utc_datetime(
  315 |             &DateTime::from_timestamp(seconds, nanos as u32)
  316 |                 .unwrap_or_default()
  317 |                 .naive_utc(),
  318 |         )
  319 |     }
  320 | 
  321 |     /// Set the `timestamp_nanos` value from a Utc DateTime
  322 |     pub fn set_timestamp(&mut self, nanos: u128) {
  323 |         self.timestamp_nanos = nanos;
  324 |     }
  325 | 
  326 |     /// Get a mutable reference to the config
  327 |     pub fn config_mut(&mut self) -> &mut HashMap<String, String> {
  328 |         &mut self.config
  329 |     }
  330 | 
  331 |     /// Get a mutable reference to the table metadata
  332 |     pub fn table_metadata_mut(&mut self) -> &mut HashMap<String, String> {
  333 |         &mut self.table_metadata
  334 |     }
  335 | 
  336 |     /// Get a mutable reference to the schema metadata
  337 |     pub fn schema_metadata_mut(&mut self) -> &mut HashMap<String, String> {
  338 |         &mut self.schema.metadata
  339 |     }
  340 | 
  341 |     /// Get a mutable reference to the field metadata for a specific field id
  342 |     ///
  343 |     /// Returns None if the field does not exist in the schema.
  344 |     pub fn field_metadata_mut(&mut self, field_id: i32) -> Option<&mut HashMap<String, String>> {
  345 |         self.schema
  346 |             .field_by_id_mut(field_id)
  347 |             .map(|field| &mut field.metadata)
  348 |     }
  349 | 
  350 |     /// Set the `config` from an iterator
  351 |     #[deprecated(note = "Use config_mut() for direct access to config HashMap")]
  352 |     pub fn update_config(&mut self, upsert_values: impl IntoIterator<Item = (String, String)>) {
  353 |         self.config.extend(upsert_values);
  354 |     }
  355 | 
  356 |     /// Delete `config` keys using a slice of keys
  357 |     #[deprecated(note = "Use config_mut() for direct access to config HashMap")]
  358 |     pub fn delete_config_keys(&mut self, delete_keys: &[&str]) {
  359 |         self.config
  360 |             .retain(|key, _| !delete_keys.contains(&key.as_str()));
  361 |     }
  362 | 
  363 |     /// Replaces the schema metadata with the given key-value pairs.
  364 |     #[deprecated(note = "Use schema_metadata_mut() for direct access to schema metadata HashMap")]
  365 |     pub fn replace_schema_metadata(&mut self, new_metadata: HashMap<String, String>) {
  366 |         self.schema.metadata = new_metadata;
  367 |     }
  368 | 
  369 |     /// Replaces the metadata of the field with the given id with the given key-value pairs.
  370 |     ///
  371 |     /// If the field does not exist in the schema, this is a no-op.
  372 |     #[deprecated(
  373 |         note = "Use field_metadata_mut(field_id) for direct access to field metadata HashMap"
  374 |     )]
  375 |     pub fn replace_field_metadata(
  376 |         &mut self,
  377 |         field_id: i32,
  378 |         new_metadata: HashMap<String, String>,
  379 |     ) -> Result<()> {
  380 |         if let Some(field) = self.schema.field_by_id_mut(field_id) {
  381 |             field.metadata = new_metadata;
  382 |             Ok(())
  383 |         } else {
  384 |             Err(Error::invalid_input(format!(
  385 |                 "Field with id {} does not exist for replace_field_metadata",
  386 |                 field_id
  387 |             )))
  388 |         }
  389 |     }
  390 | 
  391 |     /// Copy inline row ids out of the manifest buffer they were decoded from
  392 |     /// when they are a small share of it.
  393 |     ///
  394 |     /// Inline row ids decoded from a `Bytes` buffer are slices of that buffer
  395 |     /// (see [`InlineRowIds`]), and a slice keeps the whole allocation alive.
  396 |     /// That is the right trade when the row ids are most of the manifest, as
  397 |     /// they are for a compacted stable-row-id table, but a manifest whose row
  398 |     /// ids are a few percent of its bytes would pin the rest for nothing.
  399 |     /// `buffer_len` is the size of the decoded buffer.
  400 |     pub fn detach_sparse_inline_row_ids(&mut self, buffer_len: usize) {
  401 |         let inline_bytes: usize = self
  402 |             .fragments
  403 |             .iter()
  404 |             .filter_map(|fragment| match &fragment.row_id_meta {
  405 |                 Some(RowIdMeta::Inline(data)) => Some(data.len()),
  406 |                 _ => None,
  407 |             })
  408 |             .sum();
  409 |         // Keep the slices while the row ids are at least a quarter of the buffer.
  410 |         if inline_bytes == 0 || inline_bytes.saturating_mul(4) >= buffer_len {
  411 |             return;
  412 |         }
  413 |         for fragment in Arc::make_mut(&mut self.fragments) {
  414 |             if let Some(RowIdMeta::Inline(data)) = &fragment.row_id_meta {
  415 |                 let copied = InlineRowIds::from(Bytes::copy_from_slice(data));
  416 |                 fragment.row_id_meta = Some(RowIdMeta::Inline(copied));
  417 |             }
  418 |         }
  419 |     }
  420 | 
  421 |     /// Check the current fragment list and update the high water mark
  422 |     pub fn update_max_fragment_id(&mut self) {
  423 |         // If there are no fragments, don't update max_fragment_id
  424 |         if self.fragments.is_empty() {
  425 |             return;
  426 |         }
  427 | 
  428 |         let max_fragment_id = self
  429 |             .fragments
  430 |             .iter()
  431 |             .map(|f| f.id)
  432 |             .max()
  433 |             .unwrap() // Safe because we checked fragments is not empty
  434 |             .try_into()
  435 |             .unwrap();
  436 | 
  437 |         match self.max_fragment_id {
  438 |             None => {
  439 |                 // First time being set
  440 |                 self.max_fragment_id = Some(max_fragment_id);
  441 |             }
  442 |             Some(current_max) => {
  443 |                 // Only update if the computed max is greater than current
  444 |                 // This preserves the high water mark even when fragments are deleted
  445 |                 if max_fragment_id > current_max {
  446 |                     self.max_fragment_id = Some(max_fragment_id);
  447 |                 }
  448 |             }
  449 |         }
  450 |     }
  451 | 
  452 |     /// Return the max fragment id.
  453 |     /// Note this does not support recycling of fragment ids.
  454 |     ///
  455 |     /// This will return None if there are no fragments and max_fragment_id was never set.
  456 |     pub fn max_fragment_id(&self) -> Option<u64> {
  457 |         if let Some(max_id) = self.max_fragment_id {
  458 |             // Return the stored high water mark
  459 |             Some(max_id.into())
  460 |         } else {
  461 |             // Not yet set, compute from fragment list
  462 |             self.fragments.iter().map(|f| f.id).max()
  463 |         }
  464 |     }
  465 | 
  466 |     /// Get the max used field id
  467 |     ///
  468 |     /// This is different than [Schema::max_field_id] because it also considers
  469 |     /// the field ids in the data files that have been dropped from the schema,
  470 |     /// including overlay files referenced by fragments.
  471 |     pub fn max_field_id(&self) -> i32 {
  472 |         let schema_max_id = self.schema.max_field_id().unwrap_or(-1);
  473 |         let fragment_max_id = self
  474 |             .fragments
  475 |             .iter()
  476 |             .flat_map(|fragment| {
  477 |                 fragment
  478 |                     .referenced_lance_files()
  479 |                     .flat_map(|file| file.fields.iter())
  480 |             })
  481 |             .copied()
  482 |             .max()
  483 |             .unwrap_or(-1);
  484 |         schema_max_id.max(fragment_max_id)
  485 |     }
  486 | 
  487 |     /// Return the fragments that are newer than the given manifest.
  488 |     /// Note this does not support recycling of fragment ids.
  489 |     pub fn fragments_since(&self, since: &Self) -> Result<Vec<Fragment>> {
  490 |         if since.version >= self.version {
  491 |             return Err(Error::invalid_input(format!(
  492 |                 "fragments_since: given version {} is newer than manifest version {}",
  493 |                 since.version, self.version
  494 |             )));
  495 |         }
  496 |         let start = since.max_fragment_id();
  497 |         Ok(self
  498 |             .fragments
  499 |             .iter()
  500 |             .filter(|&f| start.map(|s| f.id > s).unwrap_or(true))
  501 |             .cloned()
  502 |             .collect())
  503 |     }
  504 | 
  505 |     /// Find the fragments that contain the rows, identified by the offset range.
  506 |     ///
  507 |     /// Note that the offsets are the logical offsets of rows, not row IDs.
  508 |     ///
  509 |     ///
  510 |     /// Parameters
  511 |     /// ----------
  512 |     /// range: `Range<usize>`
  513 |     ///     Offset range
  514 |     ///
  515 |     /// Returns
  516 |     /// -------
  517 |     /// Vec<(usize, Fragment)>
  518 |     ///    A vector of `(starting_offset_of_fragment, fragment)` pairs.
  519 |     ///
  520 |     pub fn fragments_by_offset_range(&self, range: Range<usize>) -> Vec<(usize, &Fragment)> {
  521 |         let start = range.start;
  522 |         let end = range.end;
  523 |         let idx = self
  524 |             .fragment_offsets
  525 |             .binary_search(&start)
  526 |             .unwrap_or_else(|idx| idx - 1);
  527 | 
  528 |         let mut fragments = vec![];
  529 |         for i in idx..self.fragments.len() {
  530 |             if self.fragment_offsets[i] >= end
  531 |                 || self.fragment_offsets[i] + self.fragments[i].num_rows().unwrap_or_default()
  532 |                     <= start
  533 |             {
  534 |                 break;
  535 |             }
  536 |             fragments.push((self.fragment_offsets[i], &self.fragments[i]));
  537 |         }
  538 | 
  539 |         fragments
  540 |     }
  541 | 
  542 |     /// Whether the dataset uses stable row ids.
  543 |     pub fn uses_stable_row_ids(&self) -> bool {
  544 |         self.reader_feature_flags & FLAG_STABLE_ROW_IDS != 0
  545 |     }
  546 | 
  547 |     /// Creates a serialized copy of the manifest, suitable for IPC or temp storage
  548 |     /// and can be used to create a dataset
  549 |     pub fn serialized(&self) -> Vec<u8> {
  550 |         let pb_manifest: pb::Manifest = self.into();
  551 |         pb_manifest.encode_to_vec()
  552 |     }
  553 | 
  554 |     /// Get the summary information of a manifest.
  555 |     ///
  556 |     /// This function calculates various statistics about the manifest, including:
  557 |     /// - total_files_size: Total size of all data files in bytes
  558 |     /// - total_fragments: Total number of fragments in the dataset
  559 |     /// - total_data_files: Total number of data files across all fragments
  560 |     /// - total_deletion_files: Total number of deletion files
  561 |     /// - total_data_file_rows: Total number of rows in data files
  562 |     /// - total_deletion_file_rows: Total number of deleted rows in deletion files
  563 |     /// - total_rows: Total number of rows in the dataset
  564 |     pub fn summary(&self) -> ManifestSummary {
  565 |         // Calculate total fragments
  566 |         let mut summary =
  567 |             self.fragments
  568 |                 .iter()
  569 |                 .fold(ManifestSummary::default(), |mut summary, f| {
  570 |                     // Count data files in the current fragment
  571 |                     summary.total_data_files += f.files.len() as u64;
  572 |                     // Sum the number of rows for the current fragment (if available)
  573 |                     if let Some(num_rows) = f.num_rows() {
  574 |                         summary.total_rows += num_rows as u64;
  575 |                     }
  576 |                     // Sum file sizes for all data files in the current fragment (if available)
  577 |                     for data_file in &f.files {
  578 |                         if let Some(size_bytes) = data_file.file_size_bytes.get() {
  579 |                             summary.total_files_size += size_bytes.get();
  580 |                         }
  581 |                     }
  582 |                     // Check and count if the current fragment has a deletion file
  583 |                     if f.deletion_file.is_some() {
  584 |                         summary.total_deletion_files += 1;
  585 |                     }
  586 |                     // Sum the number of deleted rows from the deletion file (if available)
  587 |                     if let Some(deletion_file) = &f.deletion_file
  588 |                         && let Some(num_deleted) = deletion_file.num_deleted_rows
  589 |                     {
  590 |                         summary.total_deletion_file_rows += num_deleted as u64;
  591 |                     }
  592 |                     summary
  593 |                 });
  594 |         summary.total_fragments = self.fragments.len() as u64;
  595 |         summary.total_data_file_rows = summary.total_rows + summary.total_deletion_file_rows;
  596 | 
  597 |         summary
  598 |     }
  599 | }
  600 | 
  601 | /// Populate dictionary values stored outside a V1 manifest.
  602 | ///
  603 | /// Other exact file versions store their schema dictionaries inline, so this
  604 | /// is a no-op for those manifests.
  605 | ///
  606 | /// # Examples
  607 | ///
  608 | /// ```
  609 | /// # use lance_core::Result;
  610 | /// # use lance_io::traits::Reader;
  611 | /// # use lance_table::format::{Manifest, populate_manifest_schema_dictionaries};
  612 | /// # async fn hydrate_v1_manifest(
  613 | /// #     manifest: &mut Manifest,
  614 | /// #     reader: &dyn Reader,
  615 | /// # ) -> Result<()> {
  616 | /// populate_manifest_schema_dictionaries(manifest, reader).await
  617 | /// # }
  618 | /// ```
  619 | pub async fn populate_manifest_schema_dictionaries(
  620 |     manifest: &mut Manifest,
  621 |     reader: &dyn Reader,
  622 | ) -> Result<()> {
  623 |     match manifest.data_storage_format.version {
  624 |         ConcreteFileVersion::V1 => {
  625 |             populate_schema_dictionaries(&mut manifest.schema, reader).await?;
  626 |         }
  627 |         ConcreteFileVersion::V2_0
  628 |         | ConcreteFileVersion::V2_1
  629 |         | ConcreteFileVersion::V2_2
  630 |         | ConcreteFileVersion::V2_3 => {}
  631 |     }
  632 |     Ok(())
  633 | }
  634 | 
  635 | #[derive(Debug, Clone, PartialEq)]
  636 | pub struct BasePath {
  637 |     pub id: u32,
  638 |     pub name: Option<String>,
  639 |     pub is_dataset_root: bool,
  640 |     /// The full URI string (e.g., "s3://bucket/path")
  641 |     pub path: String,
  642 | }
  643 | 
  644 | impl BasePath {
  645 |     /// Create a new BasePath
  646 |     ///
  647 |     /// # Arguments
  648 |     ///
  649 |     /// * `id` - Unique identifier for this base path
  650 |     /// * `path` - Full URI string (e.g., "s3://bucket/path", "/local/path")
  651 |     /// * `name` - Optional human-readable name for this base
  652 |     /// * `is_dataset_root` - Whether this is the dataset root or a data-only base
  653 |     pub fn new(id: u32, path: String, name: Option<String>, is_dataset_root: bool) -> Self {
  654 |         Self {
  655 |             id,
  656 |             name,
  657 |             is_dataset_root,
  658 |             path,
  659 |         }
  660 |     }
  661 | 
  662 |     /// Extract the object store path from this BasePath's URI.
  663 |     ///
  664 |     /// This is a synchronous operation that parses the URI without initializing an object store.
  665 |     pub fn extract_path(&self, registry: Arc<ObjectStoreRegistry>) -> Result<Path> {
  666 |         ObjectStore::extract_path_from_uri(registry, &self.path)
  667 |     }
  668 | }
  669 | 
  670 | impl DeepSizeOf for BasePath {
  671 |     fn deep_size_of_children(&self, context: &mut lance_core::deepsize::Context) -> usize {
  672 |         self.name.deep_size_of_children(context)
  673 |             + self.path.deep_size_of_children(context) * 2
  674 |             + size_of::<bool>()
  675 |     }
  676 | }
  677 | 
  678 | #[derive(Debug, Clone, PartialEq, DeepSizeOf)]
  679 | pub struct WriterVersion {
  680 |     pub library: String,
  681 |     pub version: String,
  682 |     pub prerelease: Option<String>,
  683 |     pub build_metadata: Option<String>,
  684 | }
  685 | 
  686 | #[derive(Debug, Clone, PartialEq, DeepSizeOf)]
  687 | pub struct DataStorageFormat {
  688 |     pub file_format: String,
  689 |     pub version: ConcreteFileVersion,
  690 | }
  691 | 
  692 | const LANCE_FORMAT_NAME: &str = "lance";
  693 | 
  694 | impl DataStorageFormat {
  695 |     pub fn new(version: ConcreteFileVersion) -> Self {
  696 |         Self {
  697 |             file_format: LANCE_FORMAT_NAME.to_string(),
  698 |             version,
  699 |         }
  700 |     }
  701 | 
  702 |     /// Return the exact file format version persisted by this manifest.
  703 |     pub fn lance_file_format(&self) -> ConcreteFileVersion {
  704 |         self.version
  705 |     }
  706 | }
  707 | 
  708 | impl Default for DataStorageFormat {
  709 |     fn default() -> Self {
  710 |         Self::new(stable_file_version())
  711 |     }
  712 | }
  713 | 
  714 | impl TryFrom<pb::manifest::DataStorageFormat> for DataStorageFormat {
  715 |     type Error = Error;
  716 | 
  717 |     fn try_from(pb: pb::manifest::DataStorageFormat) -> Result<Self> {
  718 |         Ok(Self {
  719 |             file_format: pb.file_format,
  720 |             version: ConcreteFileVersion::from_manifest_string(&pb.version)?,
  721 |         })
  722 |     }
  723 | }
  724 | 
  725 | /// Options controlling how a new [`Manifest`] is assembled from a transaction.
  726 | ///
  727 | /// The timestamp arrives already resolved to nanoseconds since the Unix epoch.
  728 | /// Callers own the clock so that a caller wanting a mockable one keeps it: the
  729 | /// `lance` crate mocks `SystemTime` under `cfg(test)`, which only takes effect in
  730 | /// that crate.
  731 | #[derive(Debug, Clone)]
  732 | pub struct ManifestBuildConfig {
  733 |     /// Recompute the manifest's feature flags from the fragments and settings
  734 |     /// below. False leaves whatever flags the previous manifest carried.
  735 |     pub auto_set_feature_flags: bool,
  736 |     /// Value for the new manifest's timestamp, in nanoseconds since the Unix epoch.
  737 |     pub timestamp_nanos: u128,
  738 |     /// Request the stable row id feature. The flag is also inherited from the
  739 |     /// previous manifest, so false does not turn it off for a dataset that has it.
  740 |     pub use_stable_row_ids: bool,
  741 |     /// Overwrite only: force the legacy (true) or v2 (false) file format. `None`
  742 |     /// keeps the format the dataset already had.
  743 |     pub use_legacy_format: Option<bool>,
  744 |     /// Overwrite only: force this storage format, taking precedence over
  745 |     /// `use_legacy_format`. `None` keeps the format the dataset already had.
  746 |     pub storage_format: Option<DataStorageFormat>,
  747 |     /// Skip writing a detached transaction file for this commit.
  748 |     pub disable_transaction_file: bool,
  749 |     /// When `Some`, this commit is the second step of `migrate_to_stable_row_ids`.
  750 |     /// It bypasses the "cannot enable stable row ids on existing dataset" guard and
  751 |     /// sets `manifest.next_row_id` to the provided value before activating the flag.
  752 |     pub migration_next_row_id: Option<u64>,
  753 |     /// Row lineage sequences of the current manifest's fragments that live
  754 |     /// outside the manifest, read ahead of the build. An update that rewrites
  755 |     /// rows needs the existing row ids and created-at versions to carry each
  756 |     /// row's lineage over, and a partial column rewrite needs the existing
  757 |     /// last-updated-at versions; the build cannot read a data file itself. Only
  758 |     /// consulted for fragments whose sequences are spilled.
  759 |     pub spilled_row_lineage: std::sync::Arc<crate::rowids::version::SpilledRowLineage>,
  760 | }
  761 | 
  762 | #[derive(Debug, Clone, Copy, PartialEq, Eq)]
  763 | pub enum VersionPart {
  764 |     Major,
  765 |     Minor,
  766 |     Patch,
  767 | }
  768 | 
  769 | fn bump_version(version: &mut semver::Version, part: VersionPart) {
  770 |     match part {
  771 |         VersionPart::Major => {
  772 |             version.major += 1;
  773 |             version.minor = 0;
  774 |             version.patch = 0;
  775 |         }
  776 |         VersionPart::Minor => {
  777 |             version.minor += 1;
  778 |             version.patch = 0;
  779 |         }
  780 |         VersionPart::Patch => {
  781 |             version.patch += 1;
  782 |         }
  783 |     }
  784 | }
  785 | 
  786 | impl WriterVersion {
  787 |     /// Split a version string into clean version (major.minor.patch), prerelease, and build metadata.
  788 |     ///
  789 |     /// Returns None if the input is not a valid semver string.
  790 |     ///
  791 |     /// For example:
  792 |     /// - "2.0.0-rc.1" -> Some(("2.0.0", Some("rc.1"), None))
  793 |     /// - "2.0.0-rc.1+build.123" -> Some(("2.0.0", Some("rc.1"), Some("build.123")))
  794 |     /// - "2.0.0+build.123" -> Some(("2.0.0", None, Some("build.123")))
  795 |     /// - "not-a-version" -> None
  796 |     fn split_version(full_version: &str) -> Option<(String, Option<String>, Option<String>)> {
  797 |         let mut parsed = semver::Version::parse(full_version).ok()?;
  798 | 
  799 |         let prerelease = if parsed.pre.is_empty() {
  800 |             None
  801 |         } else {
  802 |             Some(parsed.pre.to_string())
  803 |         };
  804 | 
  805 |         let build_metadata = if parsed.build.is_empty() {
  806 |             None
  807 |         } else {
  808 |             Some(parsed.build.to_string())
  809 |         };
  810 | 
  811 |         // Remove prerelease and build metadata to get clean version
  812 |         parsed.pre = semver::Prerelease::EMPTY;
  813 |         parsed.build = semver::BuildMetadata::EMPTY;
  814 |         Some((parsed.to_string(), prerelease, build_metadata))
  815 |     }
  816 | 
  817 |     /// Try to parse the version string as a semver string. Returns None if
  818 |     /// not successful.
  819 |     #[deprecated(note = "Use `lance_lib_version()` instead")]
  820 |     pub fn semver(&self) -> Option<(u32, u32, u32, Option<&str>)> {
  821 |         // First split by '-' to separate the version from the pre-release tag
  822 |         let (version_part, tag) = if let Some(dash_idx) = self.version.find('-') {
  823 |             (
  824 |                 &self.version[..dash_idx],
  825 |                 Some(&self.version[dash_idx + 1..]),
  826 |             )
  827 |         } else {
  828 |             (self.version.as_str(), None)
  829 |         };
  830 | 
  831 |         let mut parts = version_part.split('.');
  832 |         let major = parts.next().unwrap_or("0").parse().ok()?;
  833 |         let minor = parts.next().unwrap_or("0").parse().ok()?;
  834 |         let patch = parts.next().unwrap_or("0").parse().ok()?;
  835 | 
  836 |         Some((major, minor, patch, tag))
  837 |     }
  838 | 
  839 |     /// If the library is "lance", parse the version as semver and return it.
  840 |     /// Returns None if the library is not "lance" or the version cannot be parsed as semver.
  841 |     ///
  842 |     /// This method reconstructs the full semantic version by combining the version field
  843 |     /// with the prerelease and build_metadata fields (if present). For example:
  844 |     /// - version="2.0.0" + prerelease=Some("rc.1") -> "2.0.0-rc.1"
  845 |     /// - version="2.0.0" + prerelease=Some("rc.1") + build_metadata=Some("build.123") -> "2.0.0-rc.1+build.123"
  846 |     pub fn lance_lib_version(&self) -> Option<semver::Version> {
  847 |         if self.library != "lance" {
  848 |             return None;
  849 |         }
  850 | 
  851 |         let mut version = semver::Version::parse(&self.version).ok()?;
  852 | 
  853 |         if let Some(ref prerelease) = self.prerelease {
  854 |             version.pre = semver::Prerelease::new(prerelease).ok()?;
  855 |         }
  856 | 
  857 |         if let Some(ref build_metadata) = self.build_metadata {
  858 |             version.build = semver::BuildMetadata::new(build_metadata).ok()?;
  859 |         }
  860 | 
  861 |         Some(version)
  862 |     }
  863 | 
  864 |     #[deprecated(
  865 |         note = "Use `lance_lib_version()` instead, which safely checks the library field and returns Option"
  866 |     )]
  867 |     #[allow(deprecated)]
  868 |     pub fn semver_or_panic(&self) -> (u32, u32, u32, Option<&str>) {
  869 |         self.semver()
  870 |             .unwrap_or_else(|| panic!("Invalid writer version: {}", self.version))
  871 |     }
  872 | 
  873 |     /// Check if this is a Lance library version older than the given major/minor/patch.
  874 |     ///
  875 |     /// # Panics
  876 |     ///
  877 |     /// Panics if the library is not "lance" or the version cannot be parsed as semver.
  878 |     #[deprecated(note = "Use `lance_lib_version()` and its `older_than` method instead.")]
  879 |     pub fn older_than(&self, major: u32, minor: u32, patch: u32) -> bool {
  880 |         let version = self
  881 |             .lance_lib_version()
  882 |             .expect("Not lance library or invalid version");
  883 |         let other = semver::Version {
  884 |             major: major.into(),
  885 |             minor: minor.into(),
  886 |             patch: patch.into(),
  887 |             pre: semver::Prerelease::EMPTY,
  888 |             build: semver::BuildMetadata::EMPTY,
  889 |         };
  890 |         version < other
  891 |     }
  892 | 
  893 |     #[deprecated(note = "This is meant for testing and will be made private in future version.")]
  894 |     pub fn bump(&self, part: VersionPart, keep_tag: bool) -> Self {
  895 |         let mut version = self.lance_lib_version().expect("Should be lance version");
  896 |         bump_version(&mut version, part);
  897 |         if !keep_tag {
  898 |             version.pre = semver::Prerelease::EMPTY;
  899 |         }
  900 |         let (clean_version, prerelease, build_metadata) = Self::split_version(&version.to_string())
  901 |             .expect("Bumped version should be valid semver");
  902 |         Self {
  903 |             library: self.library.clone(),
  904 |             version: clean_version,
  905 |             prerelease,
  906 |             build_metadata,
  907 |         }
  908 |     }
  909 | }
  910 | 
  911 | impl Default for WriterVersion {
  912 |     #[cfg(not(test))]
  913 |     fn default() -> Self {
  914 |         let full_version = env!("CARGO_PKG_VERSION");
  915 |         let (version, prerelease, build_metadata) =
  916 |             Self::split_version(full_version).expect("CARGO_PKG_VERSION should be valid semver");
  917 |         Self {
  918 |             library: "lance".to_string(),
  919 |             version,
  920 |             prerelease,
  921 |             build_metadata,
  922 |         }
  923 |     }
  924 | 
  925 |     // Unit tests always run as if they are in the next version.
  926 |     #[cfg(test)]
  927 |     #[allow(deprecated)]
  928 |     fn default() -> Self {
  929 |         let full_version = env!("CARGO_PKG_VERSION");
  930 |         let (version, prerelease, build_metadata) =
  931 |             Self::split_version(full_version).expect("CARGO_PKG_VERSION should be valid semver");
  932 |         Self {
  933 |             library: "lance".to_string(),
  934 |             version,
  935 |             prerelease,
  936 |             build_metadata,
  937 |         }
  938 |         .bump(VersionPart::Patch, true)
  939 |     }
  940 | }
  941 | 
  942 | impl ProtoStruct for Manifest {
  943 |     type Proto = pb::Manifest;
  944 | }
  945 | 
  946 | impl From<pb::BasePath> for BasePath {
  947 |     fn from(p: pb::BasePath) -> Self {
  948 |         Self::new(p.id, p.path, p.name, p.is_dataset_root)
  949 |     }
  950 | }
  951 | 
  952 | impl From<BasePath> for pb::BasePath {
  953 |     fn from(p: BasePath) -> Self {
  954 |         Self {
  955 |             id: p.id,
  956 |             name: p.name,
  957 |             is_dataset_root: p.is_dataset_root,
  958 |             path: p.path,
  959 |         }
  960 |     }
  961 | }
  962 | 
  963 | impl TryFrom<pb::Manifest> for Manifest {
  964 |     type Error = Error;
  965 | 
  966 |     fn try_from(p: pb::Manifest) -> Result<Self> {
  967 |         let timestamp_nanos = p.timestamp.map(|ts| {
  968 |             let sec = ts.seconds as u128 * 1e9 as u128;
  969 |             let nanos = ts.nanos as u128;
  970 |             sec + nanos
  971 |         });
  972 |         // We only use the writer version if it is fully set.
  973 |         let writer_version = match p.writer_version {
  974 |             Some(pb::manifest::WriterVersion {
  975 |                 library,
  976 |                 version,
  977 |                 prerelease,
  978 |                 build_metadata,
  979 |             }) => Some(WriterVersion {
  980 |                 library,
  981 |                 version,
  982 |                 prerelease,
  983 |                 build_metadata,
  984 |             }),
  985 |             _ => None,
  986 |         };
  987 |         let mut interner = DataFileFieldInterner::default();
  988 |         let fragments = Arc::new(
  989 |             p.fragments
  990 |                 .into_iter()
  991 |                 .map(|f| interner.intern_fragment(f))
  992 |                 .collect::<Result<Vec<_>>>()?,
  993 |         );
  994 |         let fragment_offsets = compute_fragment_offsets(fragments.as_slice());
  995 |         let fields_with_meta = FieldsWithMeta {
  996 |             fields: Fields(p.fields),
  997 |             metadata: p.schema_metadata,
  998 |         };
  999 | 
 1000 |         if FLAG_STABLE_ROW_IDS & p.reader_feature_flags != 0
 1001 |             && !fragments.iter().all(|frag| frag.row_id_meta.is_some())
 1002 |         {
 1003 |             return Err(Error::internal("All fragments must have row ids"));
 1004 |         }
 1005 | 
 1006 |         let data_storage_format = match p.data_format {
 1007 |             None => {
 1008 |                 if let Some(inferred_version) = Fragment::try_infer_version(fragments.as_ref())? {
 1009 |                     // If there are fragments, they are a better indicator
 1010 |                     DataStorageFormat::new(inferred_version)
 1011 |                 } else {
 1012 |                     // No fragments to inspect, best we can do is look at writer flags
 1013 |                     if has_deprecated_v2_feature_flag(p.writer_feature_flags) {
 1014 |                         DataStorageFormat::new(stable_file_version())
 1015 |                     } else {
 1016 |                         DataStorageFormat::new(ConcreteFileVersion::V1)
 1017 |                     }
 1018 |                 }
 1019 |             }
 1020 |             Some(format) => DataStorageFormat::try_from(format)?,
 1021 |         };
 1022 | 
 1023 |         let schema = Schema::try_from(fields_with_meta)?;
 1024 | 
 1025 |         Ok(Self {
 1026 |             schema,
 1027 |             version: p.version,
 1028 |             branch: p.branch,
 1029 |             writer_version,
 1030 |             version_aux_data: p.version_aux_data as usize,
 1031 |             index_section: p.index_section.map(|i| i as usize),
 1032 |             timestamp_nanos: timestamp_nanos.unwrap_or(0),
 1033 |             tag: if p.tag.is_empty() { None } else { Some(p.tag) },
 1034 |             reader_feature_flags: p.reader_feature_flags,
 1035 |             writer_feature_flags: p.writer_feature_flags,
 1036 |             max_fragment_id: p.max_fragment_id,
 1037 |             fragments,
 1038 |             transaction_file: if p.transaction_file.is_empty() {
 1039 |                 None
 1040 |             } else {
 1041 |                 Some(p.transaction_file)
 1042 |             },
 1043 |             transaction_section: p.transaction_section.map(|i| i as usize),
 1044 |             fragment_offsets,
 1045 |             next_row_id: p.next_row_id,
 1046 |             data_storage_format,
 1047 |             config: p.config,
 1048 |             table_metadata: p.table_metadata,
 1049 |             base_paths: p
 1050 |                 .base_paths
 1051 |                 .iter()
 1052 |                 .map(|item| (item.id, item.clone().into()))
 1053 |                 .collect(),
 1054 |         })
 1055 |     }
 1056 | }
 1057 | 
 1058 | impl From<&Manifest> for pb::Manifest {
 1059 |     fn from(m: &Manifest) -> Self {
 1060 |         let timestamp_nanos = if m.timestamp_nanos == 0 {
 1061 |             None
 1062 |         } else {
 1063 |             let nanos = m.timestamp_nanos % 1e9 as u128;
 1064 |             let seconds = ((m.timestamp_nanos - nanos) / 1e9 as u128) as i64;
 1065 |             Some(Timestamp {
 1066 |                 seconds,
 1067 |                 nanos: nanos as i32,
 1068 |             })
 1069 |         };
 1070 |         let fields_with_meta: FieldsWithMeta = (&m.schema).into();
 1071 |         Self {
 1072 |             fields: fields_with_meta.fields.0,
 1073 |             schema_metadata: m
 1074 |                 .schema
 1075 |                 .metadata
 1076 |                 .iter()
 1077 |                 .map(|(k, v)| (k.clone(), v.as_bytes().to_vec()))
 1078 |                 .collect(),
 1079 |             version: m.version,
 1080 |             branch: m.branch.clone(),
 1081 |             writer_version: m
 1082 |                 .writer_version
 1083 |                 .as_ref()
 1084 |                 .map(|wv| pb::manifest::WriterVersion {
 1085 |                     library: wv.library.clone(),
 1086 |                     version: wv.version.clone(),
 1087 |                     prerelease: wv.prerelease.clone(),
 1088 |                     build_metadata: wv.build_metadata.clone(),
 1089 |                 }),
 1090 |             fragments: m.fragments.iter().map(pb::DataFragment::from).collect(),
 1091 |             fragment_tree: None,
 1092 |             table_metadata: m.table_metadata.clone(),
 1093 |             version_aux_data: m.version_aux_data as u64,
 1094 |             index_section: m.index_section.map(|i| i as u64),
 1095 |             timestamp: timestamp_nanos,
 1096 |             tag: m.tag.clone().unwrap_or_default(),
 1097 |             reader_feature_flags: m.reader_feature_flags,
 1098 |             writer_feature_flags: m.writer_feature_flags,
 1099 |             max_fragment_id: m.max_fragment_id,
 1100 |             transaction_file: m.transaction_file.clone().unwrap_or_default(),
 1101 |             next_row_id: m.next_row_id,
 1102 |             data_format: Some(pb::manifest::DataStorageFormat {
 1103 |                 file_format: m.data_storage_format.file_format.clone(),
 1104 |                 version: m
 1105 |                     .data_storage_format
 1106 |                     .version
 1107 |                     .to_manifest_string()
 1108 |                     .to_string(),
 1109 |             }),
 1110 |             config: m.config.clone(),
 1111 |             base_paths: m
 1112 |                 .base_paths
 1113 |                 .values()
 1114 |                 .map(|base_path| pb::BasePath {
 1115 |                     id: base_path.id,
 1116 |                     name: base_path.name.clone(),
 1117 |                     is_dataset_root: base_path.is_dataset_root,
 1118 |                     path: base_path.path.clone(),
 1119 |                 })
 1120 |                 .collect(),
 1121 |             transaction_section: m.transaction_section.map(|i| i as u64),
 1122 |         }
 1123 |     }
 1124 | }
 1125 | 
 1126 | #[async_trait]
 1127 | pub trait SelfDescribingFileReader {
 1128 |     /// Open a file reader without any cached schema
 1129 |     ///
 1130 |     /// In this case the schema will first need to be loaded
 1131 |     /// from the file itself.
 1132 |     ///
 1133 |     /// When loading files from a dataset it is preferable to use
 1134 |     /// the fragment reader to avoid this overhead.
 1135 |     async fn try_new_self_described(
 1136 |         object_store: &ObjectStore,
 1137 |         path: &Path,
 1138 |         cache: Option<&LanceCache>,
 1139 |     ) -> Result<Self>
 1140 |     where
 1141 |         Self: Sized,
 1142 |     {
 1143 |         let reader = object_store.open(path).await?;
 1144 |         Self::try_new_self_described_from_reader(reader.into(), cache).await
 1145 |     }
 1146 | 
 1147 |     async fn try_new_self_described_from_reader(
 1148 |         reader: Arc<dyn Reader>,
 1149 |         cache: Option<&LanceCache>,
 1150 |     ) -> Result<Self>
 1151 |     where
 1152 |         Self: Sized;
 1153 | }
 1154 | 
 1155 | #[async_trait]
 1156 | impl SelfDescribingFileReader for V1FileReader {
 1157 |     async fn try_new_self_described_from_reader(
 1158 |         reader: Arc<dyn Reader>,
 1159 |         cache: Option<&LanceCache>,
 1160 |     ) -> Result<Self> {
 1161 |         let metadata = Self::read_metadata(reader.as_ref(), cache).await?;
 1162 |         let manifest_position = metadata.manifest_position.ok_or(Error::internal(format!(
 1163 |             "Attempt to open file at {} as self-describing but it did not contain a manifest",
 1164 |             reader.path(),
 1165 |         )))?;
 1166 |         let mut manifest: Manifest = read_struct(reader.as_ref(), manifest_position).await?;
 1167 |         populate_manifest_schema_dictionaries(&mut manifest, reader.as_ref()).await?;
 1168 |         let schema = manifest.schema;
 1169 |         let max_field_id = schema.max_field_id().unwrap_or_default();
 1170 |         Self::try_new_from_reader(
 1171 |             reader.path(),
 1172 |             reader.clone(),
 1173 |             Some(metadata),
 1174 |             schema,
 1175 |             0,
 1176 |             0,
 1177 |             max_field_id,
 1178 |             cache,
 1179 |         )
 1180 |         .await
 1181 |     }
 1182 | }
 1183 | 
 1184 | #[cfg(test)]
 1185 | mod tests {
 1186 |     use crate::feature_flags::FLAG_USE_V2_FORMAT_DEPRECATED;
 1187 |     use crate::format::overlay::{DataOverlayFile, OverlayCoverage};
 1188 |     use crate::format::{DataFile, DeletionFile, DeletionFileType};
 1189 |     use std::num::NonZero;
 1190 | 
 1191 |     use super::*;
 1192 | 
 1193 |     use arrow_schema::{DataType, Field as ArrowField, Schema as ArrowSchema};
 1194 |     use lance_core::datatypes::Field;
 1195 |     use roaring::RoaringBitmap;
 1196 | 
 1197 |     /// A shallow clone points every local file at the parent through `base_id`.
 1198 |     /// An overlay's data file lives in the parent too, so it needs the same
 1199 |     /// stamp; without it the clone looks for the overlay under its own root.
 1200 |     #[test]
 1201 |     fn shallow_clone_stamps_base_id_on_overlay_files() {
 1202 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new(
 1203 |             "a",
 1204 |             arrow_schema::DataType::Int64,
 1205 |             false,
 1206 |         )]);
 1207 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 1208 | 
 1209 |         let mut fragment = Fragment::with_file_legacy(0, "base.lance", &schema, Some(10));
 1210 |         fragment.overlays = vec![DataOverlayFile {
 1211 |             data_file: DataFile::new_legacy_from_fields("overlay.lance", vec![0], None),
 1212 |             coverage: OverlayCoverage::Shared(Arc::new(RoaringBitmap::from_iter([0_u32]))),
 1213 |             committed_version: 1,
 1214 |         }];
 1215 |         let manifest = Manifest::new(
 1216 |             schema,
 1217 |             Arc::new(vec![fragment]),
 1218 |             DataStorageFormat::default(),
 1219 |             HashMap::new(),
 1220 |         );
 1221 | 
 1222 |         let cloned = manifest.shallow_clone(
 1223 |             Some("parent".to_string()),
 1224 |             "memory://parent".to_string(),
 1225 |             7,
 1226 |             None,
 1227 |             String::new(),
 1228 |         );
 1229 | 
 1230 |         let fragment = &cloned.fragments[0];
 1231 |         assert_eq!(fragment.files[0].base_id, Some(7));
 1232 |         assert_eq!(
 1233 |             fragment.overlays[0].data_file.base_id,
 1234 |             Some(7),
 1235 |             "the overlay's data file resolves against the parent as well"
 1236 |         );
 1237 |     }
 1238 | 
 1239 |     #[test]
 1240 |     fn old_empty_manifest_recovers_v1_or_current_stable() {
 1241 |         let old_manifest = pb::Manifest {
 1242 |             data_format: None,
 1243 |             ..Default::default()
 1244 |         };
 1245 |         let recovered_v1 = Manifest::try_from(old_manifest.clone()).unwrap();
 1246 |         assert_eq!(
 1247 |             recovered_v1.data_storage_format.lance_file_format(),
 1248 |             ConcreteFileVersion::V1
 1249 |         );
 1250 | 
 1251 |         let recovered_stable = Manifest::try_from(pb::Manifest {
 1252 |             writer_feature_flags: FLAG_USE_V2_FORMAT_DEPRECATED,
 1253 |             ..old_manifest
 1254 |         })
 1255 |         .unwrap();
 1256 |         assert_eq!(
 1257 |             recovered_stable.data_storage_format.lance_file_format(),
 1258 |             stable_file_version()
 1259 |         );
 1260 |     }
 1261 | 
 1262 |     #[test]
 1263 |     fn manifest_persistence_rejects_selectors_and_public_aliases() {
 1264 |         for version in ["stable", "next", "legacy", "0.3"] {
 1265 |             let manifest = pb::Manifest {
 1266 |                 data_format: Some(pb::manifest::DataStorageFormat {
 1267 |                     file_format: LANCE_FORMAT_NAME.to_string(),
 1268 |                     version: version.to_string(),
 1269 |                 }),
 1270 |                 ..Default::default()
 1271 |             };
 1272 |             assert!(Manifest::try_from(manifest).is_err(), "accepted {version}");
 1273 |         }
 1274 |     }
 1275 | 
 1276 |     #[test]
 1277 |     fn manifest_codec_writes_canonical_exact_string() {
 1278 |         let manifest = Manifest::new(
 1279 |             Schema::default(),
 1280 |             Arc::new(Vec::new()),
 1281 |             DataStorageFormat::new(ConcreteFileVersion::V2_0),
 1282 |             HashMap::new(),
 1283 |         );
 1284 |         let encoded = pb::Manifest::from(&manifest);
 1285 |         assert_eq!(encoded.data_format.unwrap().version, "2.0");
 1286 |     }
 1287 | 
 1288 |     #[test]
 1289 |     fn missing_format_infers_exact_version_and_rejects_mixed_files() {
 1290 |         let v2_0 = Fragment::new(0).with_file(
 1291 |             "v2_0.lance",
 1292 |             vec![0],
 1293 |             vec![0],
 1294 |             ConcreteFileVersion::V2_0,
 1295 |             None,
 1296 |         );
 1297 |         let manifest = Manifest::new(
 1298 |             Schema::default(),
 1299 |             Arc::new(vec![v2_0.clone()]),
 1300 |             DataStorageFormat::new(ConcreteFileVersion::V1),
 1301 |             HashMap::new(),
 1302 |         );
 1303 |         let mut encoded = pb::Manifest::from(&manifest);
 1304 |         encoded.data_format = None;
 1305 |         let recovered = Manifest::try_from(encoded).unwrap();
 1306 |         assert_eq!(
 1307 |             recovered.data_storage_format.lance_file_format(),
 1308 |             ConcreteFileVersion::V2_0
 1309 |         );
 1310 | 
 1311 |         let v2_1 = Fragment::new(1).with_file(
 1312 |             "v2_1.lance",
 1313 |             vec![0],
 1314 |             vec![0],
 1315 |             ConcreteFileVersion::V2_1,
 1316 |             None,
 1317 |         );
 1318 |         let mixed_manifest = Manifest::new(
 1319 |             Schema::default(),
 1320 |             Arc::new(vec![v2_0, v2_1]),
 1321 |             DataStorageFormat::new(ConcreteFileVersion::V2_0),
 1322 |             HashMap::new(),
 1323 |         );
 1324 |         let mut encoded = pb::Manifest::from(&mixed_manifest);
 1325 |         encoded.data_format = None;
 1326 |         let error = Manifest::try_from(encoded).unwrap_err();
 1327 |         assert!(
 1328 |             error
 1329 |                 .to_string()
 1330 |                 .contains("All data files must have the same version")
 1331 |         );
 1332 |     }
 1333 | 
 1334 |     #[test]
 1335 |     fn test_detach_sparse_inline_row_ids_copies_only_small_shares() {
 1336 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new("a", DataType::Int32, false)]);
 1337 |         // Two 10 byte row id sequences sliced out of one buffer.
 1338 |         let buffer = Bytes::from(vec![7u8; 64]);
 1339 |         let fragments = [0..10, 20..30].into_iter().enumerate().map(|(id, range)| {
 1340 |             let mut fragment = Fragment::new(id as u64);
 1341 |             fragment.row_id_meta = Some(RowIdMeta::Inline(InlineRowIds::from(buffer.slice(range))));
 1342 |             fragment
 1343 |         });
 1344 |         let mut manifest = Manifest::new(
 1345 |             Schema::try_from(&arrow_schema).unwrap(),
 1346 |             Arc::new(fragments.collect()),
 1347 |             DataStorageFormat::default(),
 1348 |             HashMap::new(),
 1349 |         );
 1350 |         let ptr = |manifest: &Manifest, i: usize| match &manifest.fragments[i].row_id_meta {
 1351 |             Some(RowIdMeta::Inline(data)) => data.bytes().as_ptr(),
 1352 |             _ => unreachable!(),
 1353 |         };
 1354 |         let in_buffer = |p: *const u8| buffer.as_ptr_range().contains(&p);
 1355 | 
 1356 |         // 20 of 80 bytes is a quarter: the slices stay.
 1357 |         manifest.detach_sparse_inline_row_ids(80);
 1358 |         assert!(in_buffer(ptr(&manifest, 0)) && in_buffer(ptr(&manifest, 1)));
 1359 | 
 1360 |         // 20 of 81 bytes is below a quarter: copied out, contents intact.
 1361 |         manifest.detach_sparse_inline_row_ids(81);
 1362 |         assert!(!in_buffer(ptr(&manifest, 0)) && !in_buffer(ptr(&manifest, 1)));
 1363 |         let Some(RowIdMeta::Inline(copied)) = &manifest.fragments[1].row_id_meta else {
 1364 |             unreachable!()
 1365 |         };
 1366 |         assert_eq!(&**copied, &buffer[20..30]);
 1367 |     }
 1368 | 
 1369 |     #[test]
 1370 |     fn test_writer_version() {
 1371 |         let wv = WriterVersion::default();
 1372 |         assert_eq!(wv.library, "lance");
 1373 | 
 1374 |         // Parse the actual cargo version to check if it has a pre-release tag
 1375 |         let cargo_version = env!("CARGO_PKG_VERSION");
 1376 |         let expected_tag = if cargo_version.contains('-') {
 1377 |             Some(cargo_version.split('-').nth(1).unwrap())
 1378 |         } else {
 1379 |             None
 1380 |         };
 1381 | 
 1382 |         // Verify the version field contains only major.minor.patch
 1383 |         let version_parts: Vec<&str> = wv.version.split('.').collect();
 1384 |         assert_eq!(
 1385 |             version_parts.len(),
 1386 |             3,
 1387 |             "Version should be major.minor.patch"
 1388 |         );
 1389 |         assert!(
 1390 |             !wv.version.contains('-'),
 1391 |             "Version field should not contain prerelease"
 1392 |         );
 1393 | 
 1394 |         // Verify the prerelease field matches the expected tag
 1395 |         assert_eq!(wv.prerelease.as_deref(), expected_tag);
 1396 |         // Build metadata should be None for default version
 1397 |         assert_eq!(wv.build_metadata, None);
 1398 | 
 1399 |         // Verify lance_lib_version() reconstructs the full semver correctly
 1400 |         let version = wv.lance_lib_version().unwrap();
 1401 |         assert_eq!(
 1402 |             version.major,
 1403 |             env!("CARGO_PKG_VERSION_MAJOR").parse::<u64>().unwrap()
 1404 |         );
 1405 |         assert_eq!(
 1406 |             version.minor,
 1407 |             env!("CARGO_PKG_VERSION_MINOR").parse::<u64>().unwrap()
 1408 |         );
 1409 |         assert_eq!(
 1410 |             version.patch,
 1411 |             // Unit tests run against (major,minor,patch + 1)
 1412 |             env!("CARGO_PKG_VERSION_PATCH").parse::<u64>().unwrap() + 1
 1413 |         );
 1414 |         assert_eq!(version.pre.as_str(), expected_tag.unwrap_or(""));
 1415 | 
 1416 |         for part in &[VersionPart::Major, VersionPart::Minor, VersionPart::Patch] {
 1417 |             let mut bumped_version = version.clone();
 1418 |             bump_version(&mut bumped_version, *part);
 1419 |             assert!(version < bumped_version);
 1420 |         }
 1421 |     }
 1422 | 
 1423 |     #[test]
 1424 |     fn test_writer_version_split() {
 1425 |         // Test splitting version with prerelease
 1426 |         let (version, prerelease, build_metadata) =
 1427 |             WriterVersion::split_version("2.0.0-rc.1").unwrap();
 1428 |         assert_eq!(version, "2.0.0");
 1429 |         assert_eq!(prerelease, Some("rc.1".to_string()));
 1430 |         assert_eq!(build_metadata, None);
 1431 | 
 1432 |         // Test splitting version without prerelease
 1433 |         let (version, prerelease, build_metadata) = WriterVersion::split_version("2.0.0").unwrap();
 1434 |         assert_eq!(version, "2.0.0");
 1435 |         assert_eq!(prerelease, None);
 1436 |         assert_eq!(build_metadata, None);
 1437 | 
 1438 |         // Test splitting version with prerelease and build metadata
 1439 |         let (version, prerelease, build_metadata) =
 1440 |             WriterVersion::split_version("2.0.0-rc.1+build.123").unwrap();
 1441 |         assert_eq!(version, "2.0.0");
 1442 |         assert_eq!(prerelease, Some("rc.1".to_string()));
 1443 |         assert_eq!(build_metadata, Some("build.123".to_string()));
 1444 | 
 1445 |         // Test splitting version with only build metadata
 1446 |         let (version, prerelease, build_metadata) =
 1447 |             WriterVersion::split_version("2.0.0+build.123").unwrap();
 1448 |         assert_eq!(version, "2.0.0");
 1449 |         assert_eq!(prerelease, None);
 1450 |         assert_eq!(build_metadata, Some("build.123".to_string()));
 1451 | 
 1452 |         // Test with invalid version returns None
 1453 |         assert!(WriterVersion::split_version("not-a-version").is_none());
 1454 |     }
 1455 | 
 1456 |     #[test]
 1457 |     fn test_writer_version_comparison_with_prerelease() {
 1458 |         let v1 = WriterVersion {
 1459 |             library: "lance".to_string(),
 1460 |             version: "2.0.0".to_string(),
 1461 |             prerelease: Some("rc.1".to_string()),
 1462 |             build_metadata: None,
 1463 |         };
 1464 | 
 1465 |         let v2 = WriterVersion {
 1466 |             library: "lance".to_string(),
 1467 |             version: "2.0.0".to_string(),
 1468 |             prerelease: None,
 1469 |             build_metadata: None,
 1470 |         };
 1471 | 
 1472 |         let semver1 = v1.lance_lib_version().unwrap();
 1473 |         let semver2 = v2.lance_lib_version().unwrap();
 1474 | 
 1475 |         // rc.1 should be less than the release version
 1476 |         assert!(semver1 < semver2);
 1477 |     }
 1478 | 
 1479 |     #[test]
 1480 |     fn test_writer_version_with_build_metadata() {
 1481 |         let v = WriterVersion {
 1482 |             library: "lance".to_string(),
 1483 |             version: "2.0.0".to_string(),
 1484 |             prerelease: Some("rc.1".to_string()),
 1485 |             build_metadata: Some("build.123".to_string()),
 1486 |         };
 1487 | 
 1488 |         let semver = v.lance_lib_version().unwrap();
 1489 |         assert_eq!(semver.to_string(), "2.0.0-rc.1+build.123");
 1490 |         assert_eq!(semver.major, 2);
 1491 |         assert_eq!(semver.minor, 0);
 1492 |         assert_eq!(semver.patch, 0);
 1493 |         assert_eq!(semver.pre.as_str(), "rc.1");
 1494 |         assert_eq!(semver.build.as_str(), "build.123");
 1495 |     }
 1496 | 
 1497 |     #[test]
 1498 |     fn test_writer_version_non_semver() {
 1499 |         // Test that Lance library can have non-semver version strings
 1500 |         let v = WriterVersion {
 1501 |             library: "lance".to_string(),
 1502 |             version: "custom-build-v1".to_string(),
 1503 |             prerelease: None,
 1504 |             build_metadata: None,
 1505 |         };
 1506 | 
 1507 |         // lance_lib_version should return None for non-semver
 1508 |         assert!(v.lance_lib_version().is_none());
 1509 | 
 1510 |         // But the WriterVersion itself should still be valid and usable
 1511 |         assert_eq!(v.library, "lance");
 1512 |         assert_eq!(v.version, "custom-build-v1");
 1513 |     }
 1514 | 
 1515 |     #[test]
 1516 |     #[allow(deprecated)]
 1517 |     fn test_older_than_with_prerelease() {
 1518 |         // Test that older_than correctly handles prerelease
 1519 |         let v_rc = WriterVersion {
 1520 |             library: "lance".to_string(),
 1521 |             version: "2.0.0".to_string(),
 1522 |             prerelease: Some("rc.1".to_string()),
 1523 |             build_metadata: None,
 1524 |         };
 1525 | 
 1526 |         // 2.0.0-rc.1 should be older than 2.0.0
 1527 |         assert!(v_rc.older_than(2, 0, 0));
 1528 | 
 1529 |         // 2.0.0-rc.1 should be older than 2.0.1
 1530 |         assert!(v_rc.older_than(2, 0, 1));
 1531 | 
 1532 |         // 2.0.0-rc.1 should not be older than 1.9.9
 1533 |         assert!(!v_rc.older_than(1, 9, 9));
 1534 | 
 1535 |         let v_release = WriterVersion {
 1536 |             library: "lance".to_string(),
 1537 |             version: "2.0.0".to_string(),
 1538 |             prerelease: None,
 1539 |             build_metadata: None,
 1540 |         };
 1541 | 
 1542 |         // 2.0.0 should not be older than 2.0.0
 1543 |         assert!(!v_release.older_than(2, 0, 0));
 1544 | 
 1545 |         // 2.0.0 should be older than 2.0.1
 1546 |         assert!(v_release.older_than(2, 0, 1));
 1547 |     }
 1548 | 
 1549 |     #[test]
 1550 |     fn test_fragments_by_offset_range() {
 1551 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new(
 1552 |             "a",
 1553 |             arrow_schema::DataType::Int64,
 1554 |             false,
 1555 |         )]);
 1556 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 1557 |         let fragments = vec![
 1558 |             Fragment::with_file_legacy(0, "path1", &schema, Some(10)),
 1559 |             Fragment::with_file_legacy(1, "path2", &schema, Some(15)),
 1560 |             Fragment::with_file_legacy(2, "path3", &schema, Some(20)),
 1561 |         ];
 1562 |         let manifest = Manifest::new(
 1563 |             schema,
 1564 |             Arc::new(fragments),
 1565 |             DataStorageFormat::default(),
 1566 |             HashMap::new(),
 1567 |         );
 1568 | 
 1569 |         let actual = manifest.fragments_by_offset_range(0..10);
 1570 |         assert_eq!(actual.len(), 1);
 1571 |         assert_eq!(actual[0].0, 0);
 1572 |         assert_eq!(actual[0].1.id, 0);
 1573 | 
 1574 |         let actual = manifest.fragments_by_offset_range(5..15);
 1575 |         assert_eq!(actual.len(), 2);
 1576 |         assert_eq!(actual[0].0, 0);
 1577 |         assert_eq!(actual[0].1.id, 0);
 1578 |         assert_eq!(actual[1].0, 10);
 1579 |         assert_eq!(actual[1].1.id, 1);
 1580 | 
 1581 |         let actual = manifest.fragments_by_offset_range(15..50);
 1582 |         assert_eq!(actual.len(), 2);
 1583 |         assert_eq!(actual[0].0, 10);
 1584 |         assert_eq!(actual[0].1.id, 1);
 1585 |         assert_eq!(actual[1].0, 25);
 1586 |         assert_eq!(actual[1].1.id, 2);
 1587 | 
 1588 |         // Out of range
 1589 |         let actual = manifest.fragments_by_offset_range(45..100);
 1590 |         assert!(actual.is_empty());
 1591 | 
 1592 |         assert!(manifest.fragments_by_offset_range(200..400).is_empty());
 1593 |     }
 1594 | 
 1595 |     #[test]
 1596 |     fn test_max_field_id() {
 1597 |         // Validate that max field id handles varying field ids by fragment.
 1598 |         let mut field0 =
 1599 |             Field::try_from(ArrowField::new("a", arrow_schema::DataType::Int64, false)).unwrap();
 1600 |         field0.set_id(-1, &mut 0);
 1601 |         let mut field2 =
 1602 |             Field::try_from(ArrowField::new("b", arrow_schema::DataType::Int64, false)).unwrap();
 1603 |         field2.set_id(-1, &mut 2);
 1604 | 
 1605 |         let schema = Schema {
 1606 |             fields: vec![field0, field2],
 1607 |             metadata: Default::default(),
 1608 |         };
 1609 |         let fragments = vec![
 1610 |             Fragment {
 1611 |                 id: 0,
 1612 |                 files: vec![DataFile::new_legacy_from_fields(
 1613 |                     "path1",
 1614 |                     vec![0, 1, 2],
 1615 |                     None,
 1616 |                 )],
 1617 |                 overlays: vec![],
 1618 |                 deletion_file: None,
 1619 |                 row_id_meta: None,
 1620 |                 physical_rows: None,
 1621 |                 created_at_version_meta: None,
 1622 |                 last_updated_at_version_meta: None,
 1623 |             },
 1624 |             Fragment {
 1625 |                 id: 1,
 1626 |                 files: vec![
 1627 |                     DataFile::new_legacy_from_fields("path2", vec![0, 1, 43], None),
 1628 |                     DataFile::new_legacy_from_fields("path3", vec![2], None),
 1629 |                 ],
 1630 |                 overlays: vec![],
 1631 |                 deletion_file: None,
 1632 |                 row_id_meta: None,
 1633 |                 physical_rows: None,
 1634 |                 created_at_version_meta: None,
 1635 |                 last_updated_at_version_meta: None,
 1636 |             },
 1637 |         ];
 1638 | 
 1639 |         let manifest = Manifest::new(
 1640 |             schema,
 1641 |             Arc::new(fragments),
 1642 |             DataStorageFormat::default(),
 1643 |             HashMap::new(),
 1644 |         );
 1645 | 
 1646 |         assert_eq!(manifest.max_field_id(), 43);
 1647 |     }
 1648 | 
 1649 |     #[test]
 1650 |     fn test_max_field_id_includes_overlay_files() {
 1651 |         let mut field0 =
 1652 |             Field::try_from(ArrowField::new("a", arrow_schema::DataType::Int64, false)).unwrap();
 1653 |         field0.set_id(-1, &mut 0);
 1654 |         let schema = Schema {
 1655 |             fields: vec![field0],
 1656 |             metadata: Default::default(),
 1657 |         };
 1658 | 
 1659 |         let mut fragment = Fragment {
 1660 |             id: 0,
 1661 |             files: vec![DataFile::new_legacy_from_fields("path1", vec![0], None)],
 1662 |             overlays: vec![],
 1663 |             deletion_file: None,
 1664 |             row_id_meta: None,
 1665 |             physical_rows: None,
 1666 |             created_at_version_meta: None,
 1667 |             last_updated_at_version_meta: None,
 1668 |         };
 1669 |         fragment.overlays = vec![DataOverlayFile {
 1670 |             data_file: DataFile::new_legacy_from_fields("overlay.lance", vec![43], None),
 1671 |             coverage: OverlayCoverage::Shared(Arc::new(RoaringBitmap::from_iter([0_u32]))),
 1672 |             committed_version: 1,
 1673 |         }];
 1674 | 
 1675 |         let manifest = Manifest::new(
 1676 |             schema,
 1677 |             Arc::new(vec![fragment]),
 1678 |             DataStorageFormat::default(),
 1679 |             HashMap::new(),
 1680 |         );
 1681 | 
 1682 |         assert_eq!(manifest.max_field_id(), 43);
 1683 |     }
 1684 | 
 1685 |     #[test]
 1686 |     fn test_config() {
 1687 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new(
 1688 |             "a",
 1689 |             arrow_schema::DataType::Int64,
 1690 |             false,
 1691 |         )]);
 1692 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 1693 |         let fragments = vec![
 1694 |             Fragment::with_file_legacy(0, "path1", &schema, Some(10)),
 1695 |             Fragment::with_file_legacy(1, "path2", &schema, Some(15)),
 1696 |             Fragment::with_file_legacy(2, "path3", &schema, Some(20)),
 1697 |         ];
 1698 |         let mut manifest = Manifest::new(
 1699 |             schema,
 1700 |             Arc::new(fragments),
 1701 |             DataStorageFormat::default(),
 1702 |             HashMap::new(),
 1703 |         );
 1704 | 
 1705 |         let mut config = manifest.config.clone();
 1706 |         config.insert("lance.test".to_string(), "value".to_string());
 1707 |         config.insert("other-key".to_string(), "other-value".to_string());
 1708 | 
 1709 |         manifest.config_mut().extend(config.clone());
 1710 |         assert_eq!(manifest.config, config.clone());
 1711 | 
 1712 |         config.remove("other-key");
 1713 |         manifest.config_mut().remove("other-key");
 1714 |         assert_eq!(manifest.config, config);
 1715 |     }
 1716 | 
 1717 |     #[test]
 1718 |     fn test_manifest_summary() {
 1719 |         // Step 1: test empty manifest summary
 1720 |         let arrow_schema = ArrowSchema::new(vec![
 1721 |             ArrowField::new("id", arrow_schema::DataType::Int64, false),
 1722 |             ArrowField::new("name", arrow_schema::DataType::Utf8, true),
 1723 |         ]);
 1724 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 1725 | 
 1726 |         let empty_manifest = Manifest::new(
 1727 |             schema.clone(),
 1728 |             Arc::new(vec![]),
 1729 |             DataStorageFormat::default(),
 1730 |             HashMap::new(),
 1731 |         );
 1732 | 
 1733 |         let empty_summary = empty_manifest.summary();
 1734 |         assert_eq!(empty_summary.total_rows, 0);
 1735 |         assert_eq!(empty_summary.total_files_size, 0);
 1736 |         assert_eq!(empty_summary.total_fragments, 0);
 1737 |         assert_eq!(empty_summary.total_data_files, 0);
 1738 |         assert_eq!(empty_summary.total_deletion_file_rows, 0);
 1739 |         assert_eq!(empty_summary.total_data_file_rows, 0);
 1740 |         assert_eq!(empty_summary.total_deletion_files, 0);
 1741 | 
 1742 |         // Step 2: write empty files and verify summary
 1743 |         let empty_fragments = vec![
 1744 |             Fragment::with_file_legacy(0, "empty_file1.lance", &schema, Some(0)),
 1745 |             Fragment::with_file_legacy(1, "empty_file2.lance", &schema, Some(0)),
 1746 |         ];
 1747 | 
 1748 |         let empty_files_manifest = Manifest::new(
 1749 |             schema.clone(),
 1750 |             Arc::new(empty_fragments),
 1751 |             DataStorageFormat::default(),
 1752 |             HashMap::new(),
 1753 |         );
 1754 | 
 1755 |         let empty_files_summary = empty_files_manifest.summary();
 1756 |         assert_eq!(empty_files_summary.total_rows, 0);
 1757 |         assert_eq!(empty_files_summary.total_files_size, 0);
 1758 |         assert_eq!(empty_files_summary.total_fragments, 2);
 1759 |         assert_eq!(empty_files_summary.total_data_files, 2);
 1760 |         assert_eq!(empty_files_summary.total_deletion_file_rows, 0);
 1761 |         assert_eq!(empty_files_summary.total_data_file_rows, 0);
 1762 |         assert_eq!(empty_files_summary.total_deletion_files, 0);
 1763 | 
 1764 |         // Step 3: write real data and verify summary
 1765 |         let real_fragments = vec![
 1766 |             Fragment::with_file_legacy(0, "data_file1.lance", &schema, Some(100)),
 1767 |             Fragment::with_file_legacy(1, "data_file2.lance", &schema, Some(250)),
 1768 |             Fragment::with_file_legacy(2, "data_file3.lance", &schema, Some(75)),
 1769 |         ];
 1770 | 
 1771 |         let real_data_manifest = Manifest::new(
 1772 |             schema.clone(),
 1773 |             Arc::new(real_fragments),
 1774 |             DataStorageFormat::default(),
 1775 |             HashMap::new(),
 1776 |         );
 1777 | 
 1778 |         let real_data_summary = real_data_manifest.summary();
 1779 |         assert_eq!(real_data_summary.total_rows, 425); // 100 + 250 + 75
 1780 |         assert_eq!(real_data_summary.total_files_size, 0); // Zero for unknown
 1781 |         assert_eq!(real_data_summary.total_fragments, 3);
 1782 |         assert_eq!(real_data_summary.total_data_files, 3);
 1783 |         assert_eq!(real_data_summary.total_deletion_file_rows, 0);
 1784 |         assert_eq!(real_data_summary.total_data_file_rows, 425);
 1785 |         assert_eq!(real_data_summary.total_deletion_files, 0);
 1786 | 
 1787 |         // Step 4: write deletion files and verify summary
 1788 |         let mut fragment_with_deletion = Fragment::new(0)
 1789 |             .with_file(
 1790 |                 "data_with_deletion.lance",
 1791 |                 vec![0, 1],
 1792 |                 vec![0, 1],
 1793 |                 stable_file_version(),
 1794 |                 NonZero::new(1000),
 1795 |             )
 1796 |             .with_physical_rows(50);
 1797 |         fragment_with_deletion.deletion_file = Some(DeletionFile {
 1798 |             read_version: 123,
 1799 |             id: 456,
 1800 |             file_type: DeletionFileType::Array,
 1801 |             num_deleted_rows: Some(10),
 1802 |             base_id: None,
 1803 |         });
 1804 | 
 1805 |         let manifest_with_deletion = Manifest::new(
 1806 |             schema,
 1807 |             Arc::new(vec![fragment_with_deletion]),
 1808 |             DataStorageFormat::default(),
 1809 |             HashMap::new(),
 1810 |         );
 1811 | 
 1812 |         let deletion_summary = manifest_with_deletion.summary();
 1813 |         assert_eq!(deletion_summary.total_rows, 40); // 50 - 10
 1814 |         assert_eq!(deletion_summary.total_files_size, 1000);
 1815 |         assert_eq!(deletion_summary.total_fragments, 1);
 1816 |         assert_eq!(deletion_summary.total_data_files, 1);
 1817 |         assert_eq!(deletion_summary.total_deletion_file_rows, 10);
 1818 |         assert_eq!(deletion_summary.total_data_file_rows, 50);
 1819 |         assert_eq!(deletion_summary.total_deletion_files, 1);
 1820 | 
 1821 |         //Just verify the transformation is OK
 1822 |         let stats_map: BTreeMap<String, String> = deletion_summary.into();
 1823 |         assert_eq!(stats_map.len(), 7)
 1824 |     }
 1825 | }
``````
