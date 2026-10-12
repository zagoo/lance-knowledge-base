> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen. Refresh 2026-10-12: [current coordinates and changed contracts](../../refresh-addenda/2026-10-12-011953c2.md) at `011953c22097b67b699595adbe99e7f0155d83e4` supersede affected historical statements; body remains frozen.

# protos/table.proto

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `0c1ff4b353bd634fe1a03696530dd551b763021a69d1cc1bb6a9ea8f943dae3a`. Reviewed physical lines: 1-769.

[Module](../../L1-modules/protos.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Behavior contracts](../../L3-symbols/behavior-contracts.md) · [Format](../../L3-symbols/format-spec.md) · [Entry](../../README.md)

## Role and visibility

Public lance.table contracts for dataset manifests, index metadata, fragment-reuse mappings, and MemWAL shard/index state. This is a broad persisted-state schema; it records conflict-sensitive metadata but does not execute commits, recovery, fencing, or index catch-up. (protos/table.proto:1-769)

## Complete range analysis

### Lines 1-12

SPDX, proto3, lance.table, imports of Any, Timestamp and file.proto, and public import of fragment_metadata.proto establish type visibility. The public import makes the separated fragment definitions accessible through table.proto rather than redeclaring them. (protos/table.proto:1-12)

### Lines 13-35

The opening historical-looking layout diagram lists encoded chunks, indices, chunk-position matrix, optional manifest, metadata, i64 metadata position, version pair and LANC. It is not the newer file2 footer diagram and should not be applied to every current file. UUID is a message with bytes uuid=1 documented as exactly 16 bytes; no validation is implemented in protobuf. (protos/table.proto:13-35)

### Lines 36-60

Manifest carries repeated lance.file.Field fields=1 including nested fields, repeated DataFragment fragments=2, uint64 version=3, uint64 version_aux_data=4, and bytes-valued schema_metadata map=5. fragment_tree=22 replaces the inline fragment list for tree tables: fragments must be empty and bit 12 set in both feature words so unaware readers do not see an empty dataset. Auxiliary data is version-specific, not inherited, and not loaded by default on query. (protos/table.proto:36-60)

### Lines 61-106

Nested WriterVersion stores library string=1, version string=2, optional prerelease string=3, optional build_metadata string=4. Version is a string because library versions may not be semver; semver has no leading v. New manifests should store core major.minor.patch in version and separate prerelease/build to remain parseable by older readers. Absent prerelease leaves version as-is, absent build means none. Manifest.writer_version=13 enables detection of files affected by writer-specific bugs; this is not itself a file-format gate. (protos/table.proto:61-106)

### Lines 107-115

Manifest.index_section optional uint64=6 points to index metadata. timestamp=7 is a protobuf Timestamp documented UTC; tag string=8 is described as optional but has no explicit scalar presence, so empty and absent wire values are not distinguishable in the declaration. (protos/table.proto:107-115)

### Lines 116-139

reader_feature_flags uint64 tag 9 requires rejection when any set bit is unrecognized. The comment lists bit 0 deletions, 1 stable row IDs, 2 deprecated v2 indicator, 3 table config, 4 multiple bases, 5 disabled transaction-file writes, 6 overlays, 7 covering columns. Without bit 13, covering columns are the trailing fields suffix. Both readers and writers must reject unknown covering semantics to avoid querying/maintaining an index as if merely carried columns were indexed keys. (protos/table.proto:116-139)

### Lines 140-161

Bit 8 enables mixed recognized exact v2 data-file versions, paired in reader/writer flags and one-way; use each DataFile version rather than snapshot default for decoding. Bit 9 combines stable row IDs and a fragment reuse index. Bit 12 means fragment-tree records and empty fragments. Bit 13 independently declares key fields versus covering_fields; it requires bit 7 in both words, and both bits persist even after dropping the final covering index. One field may appear in both lists. Enabling bit 13 reinterprets every index entry, so normalize all legacy entries atomically (or enable only when none covers), retain the bit in descendants until an atomic reverse conversion. The list omits bit 11 although fragment_metadata separately documents spilled lineage at 2048; do not treat this comment as exhaustive (protos/fragment_metadata.proto:43-51). (protos/table.proto:140-161)

### Lines 162-178

writer_feature_flags uint64=10 uses the same bit identities but need not equal the reader word; unknown set bits prohibit writes. max_fragment_id optional uint32=11 is the highest ever allocated/reserved in the lineage, absent only before the first allocation, monotonic, with u32::MAX meaning exhaustion. A deleted maximum fragment cannot make this counter reusable. (protos/table.proto:162-178)

### Lines 179-202

transaction_file string=12 is relative to _transactions and stores wire Transaction content at {read_version}-{hyphenated UUID}.txn with unpadded decimal read version; empty means no external transaction file. transaction_section optional uint64=21 locates inline content prefixed by u32 message length, occupying len+4 bytes relative to section start. next_row_id uint64=14 is the next unused stable ID, used only with stable-row-ID flag; the comment states zero means no rows. This is not proof current visible row count equals next_row_id. (protos/table.proto:179-202)

### Lines 203-224

DataStorageFormat holds file_format string=1 (example lance) and version string=2. Version syntax is format-defined, not necessarily semver. It is the default for writes without an explicit exact version and does not constrain indices or other files. Without mixed-version capability every referenced data file must use it; with capability each recognized exact v2 DataFile version is authoritative. Manifest.data_format=15 stores this configuration. (protos/table.proto:203-224)

### Lines 225-249

Manifest.config string map=16 contains behavioral library configuration, reserving lance. prefix. table_metadata string map=19 is arbitrary table metadata, separate from config and schema_metadata (the latter describes data and attaches to scan schemas). Former secondary blob_dataset_version tag 17 and name are reserved; do not reuse them. (protos/table.proto:225-249)

### Lines 250-280

base_paths repeated BasePath=18 resolves imported, shallow-cloned or multi-tier files; example resolves ID zero as base/data/file.path and IDs increase from zero. branch optional string=20 uses absence for main. BasePath has id uint32=1, optional alias name=2 (source tag for shallow clone), is_dataset_root bool=3 distinguishing dataset roots with data/_deletions subdirectories from direct file directories, and absolute path string=4 parsed directly. The comment refers to lance.file.File/DeletionFile, but actual declarations are lance.table.DataFile/DeletionFile (protos/fragment_metadata.proto:6-6; protos/fragment_metadata.proto:90-90; protos/fragment_metadata.proto:257-257). (protos/table.proto:250-280)

### Lines 281-289

VersionAuxData is loaded on demand and has metadata map<string,bytes>=3. Its absence/default loading policy comes from Manifest.version_aux_data; it is not table configuration. (protos/table.proto:281-289)

### Lines 290-311

IndexMetadata.uuid message=1 is unique across dataset versions; fields repeated int32=2 refers to logical Field IDs and preserves key order; name string=3 is unique within a version; dataset_version uint64=4 is the build version. With manifest bit 13 fields contains keys only; otherwise legacy carried values form the trailing suffix. The same bytes have different interpretation depending on the manifest flag, making atomic migration mandatory. (protos/table.proto:290-311)

### Lines 312-342

fragment_bitmap bytes=5 is a 32-bit Roaring bitmap of indexed fragments, retained because the historical dataset version may be deleted. index_details Any=6 supplies small plugin-specific metadata to avoid manifest bloat. Type URL identifies kind, with btree mapped to /lance.table.BTreeIndexDetails; comparisons are case-insensitive and kinds must be unique ignoring case. index_version optional int32=7 is described as minimum compatible Lance version; concrete numeric meaning and per-index conventions need implementation tracing rather than assuming it is a semver number. (protos/table.proto:312-342)

### Lines 343-361

created_at optional uint64=8 is UTC milliseconds, absent for older indices. base_id optional uint32=9 resolves through manifest bases. files repeated IndexFile=10 provides file sizes to skip HEAD requests and report size without IO; empty means sizes unknown, not no stored files. (protos/table.proto:343-361)

### Lines 362-390

covering_fields repeated int32=11 lists co-located values. Under bit 13 it is independent of fields and can overlap; maintenance dependencies are their union. In legacy form covering entries are a trailing fields suffix in emission order, including a second appearance if also a key. Empty means no extra-column declaration. Critically, declarations do not prove payload availability: actual segment storage schema is authoritative; readers must verify the column exists or fall back to base-table take. Maintenance may legally withdraw payload while retaining declaration; that state is not corruption. (protos/table.proto:362-390)

### Lines 391-405

IndexFile has index-directory-relative path string=1 and size_bytes uint64=2. IndexSection contains repeated IndexMetadata indices=1 for one dataset version. A comment records VectorIndexDetails and renamed HnswParameters moving to index.proto; it is not another declaration. (protos/table.proto:391-405)

### Lines 406-444

FragmentReuseIndexDetails.content chooses InlineContent inline=1 or ExternalFile external=2; comment threshold is below 200 KB inline, otherwise external InlineContent bytes, with exact unit/threshold selection to verify in code. InlineContent stores historical Version legacy_versions=1 and new Transition transitions=2 requiring index_version=1. Transition has source FragmentDigests=1 in scan order including deleted rows, destinations=2 in label order with creation counts, and exactly one ordered_compaction=3 or stable_partition=4 mapping. New safe backward-compatible mappings, including scan fallback, need no version bump; unsafe ones do. Ordered compaction concatenates surviving source rows in scan order then splits; stable partition distributes sequential source rows by destination label. (protos/table.proto:406-444)

### Lines 445-466

OrderedCompaction.changed_row_addrs bytes=1 is a RoaringTreemap of surviving source addresses; missing addresses are deleted. StablePartition has map_id string=1 locating _fri/<map_id>/stable_partition.lance independently of FRI UUID changes, map_size_bytes=2, and optional base_id=3 using dataset base when unset. FragmentDigest records id uint64=1, physical_rows=2, num_deleted_rows=3 for mapping cardinality. (protos/table.proto:445-466)

### Lines 467-488

Legacy Group summarizes a rewrite with RoaringTreemap changed_row_addrs=1, old_fragments=2 and new_fragments=3; together these reconstruct old-to-new/deleted addresses for index remapping or queries against newly unindexed fragments. Version records dataset_version=1 when this entry was added and groups=3. These remain distinct from new transitions. (protos/table.proto:467-488)

### Lines 489-529

The MemWAL section introduces ShardStatus ACTIVE=0 and SEALED=1. Drop-table two-phase commit seals a shard to refuse claims reversibly, then deletes on commit or returns ACTIVE on rollback. ShardManifest documents exactly one active writer per shard; shard_id UUID=11 is v4, version uint64=1 matches manifest filename, shard_spec_id uint32=10 is immutable at creation with zero for manual/unmanaged shards, and shard_field_entries repeated=14 stores raw Arrow scalar bytes keyed by field ID and interpreted by ShardingSpec.result_type. The comment explicitly gives little-endian int32 and raw UTF-8 examples. (protos/table.proto:489-529)

### Lines 530-564

ShardManifest.writer_epoch uint64=2 is a monotonically increasing fencing token incremented on claim. replay_after_wal_entry_position uint64=3 is latest flushed WAL position; positions are one-based, zero means never flushed, replay begins at watermark+1. wal_entry_position_last_seen uint64=4 is only a hint; recovery must list storage, not trust it. current_generation uint64=6 numbers next SSTable and advances per MemTable flush. Removed field 7's progress now lives in index metadata, but this text does not reserve tag 7. sstables repeated=8 lists flush results. status ShardStatus=15 defaults ACTIVE; SEALED refuses claim_epoch. (protos/table.proto:530-564)

### Lines 565-575

ShardFieldEntry has field_id string=1 matching ShardingField.field_id and value bytes=2 in raw little-endian Arrow representation; matching result_type gives the data type. There is no self-describing per-value type tag here. (protos/table.proto:565-575)

### Lines 576-611

SsTable is an immutable flushed MemTable stored as a Lance dataset. generation uint64=1 and shard-relative path string=2 identify it. Optional in_memory_bytes=3 estimates accounted buffer windows, excluding reader array structure and requiring headroom; absent means unknown, not zero. Optional physical_rows=4 includes older primary-key duplicates masked by its deletion vector. Optional primary_key_bytes=5 sums key-column payload over all physical rows, is not per-row/encoded-sort-key size, and is also absent without a primary key. Treating these estimates as hard bounds or defaults as zero risks underbudgeting. (protos/table.proto:576-611)

### Lines 612-635

CompactedSsTable has shard_id UUID=1 and generation uint64=2 for latest compaction into base data. IndexCatchupProgress has base index_name=1 (must match maintained_indexes) and caught_up_generations repeated=2. The protobuf comment says an absent shard means unknown progress, requiring retained SSTables and repair. This conflicts with the Rust getter comment saying absence is assumed fully caught up; the getter itself simply returns None (rust/lance-table/src/system_index/mem_wal.rs:157-164). Complete consumers must resolve policy; neither comment proves safe deletion. (protos/table.proto:612-635)

### Lines 636-670

MemWalIndexDetails centralizes configuration, base compaction progress, and shard snapshots. Writers read configuration; snapshots are point-in-time optimizations, while readers requiring current shards list directories and latest shard manifests. Background refresh does not make snapshots authoritative mutable shard state. Snapshot Lance-file schema lists shard_id utf8, shard_spec_id uint32, typed shard_field_{id}. snapshot_ts_millis int64=1 and num_shards uint32=2 describe it; optional inline_snapshots bytes=3 holds Lance bytes for small counts. The threshold example 100 is explicitly implementation-defined, not a specified constant. (protos/table.proto:636-670)

### Lines 671-697

sharding_specs repeated=7 configures partitioning. maintained_indexes repeated string=8 names base indices mirrored in MemTables; primary-key btree is implicit and must not be listed; vector quantization parameters are inherited for comparable distances. maintain_all_indexes optional bool=12 selects automatic eligible-index discovery according to prose: the named list is ignored, new/dropped indices follow current table state, unsupported kinds are skipped. Absent uses the explicit list and unsupported requested names error. The comment does not separately define present-false handling; inspect runtime conversion before asserting whether 'set' means presence or true. (protos/table.proto:671-697)

### Lines 698-723

compacted_sstables repeated=9 updates atomically with merge-insert data commits for concurrent-compactor conflict resolution, independently of background shard snapshots. index_catchup repeated=10 records asynchronous base-index rebuild coverage. When catch-up generation trails compaction, indexed readers use SSTable indices for the gap. Missing index progress keeps needed SSTables live until repair. Only the dedicated WAL repair path adds progress; ordinary index-changing operations remove entries because they cannot attest coverage. (protos/table.proto:698-723)

### Lines 724-745

writer_config_defaults map<string,string>=11 persists common process/restart defaults, while each ShardWriterConfig may override at runtime without persisting those overrides. ShardingSpec has spec_id uint32=1 unique within index and never reused, plus repeated ShardingField fields=2. Concrete map keys and defaults are not enumerated here. (protos/table.proto:724-745)

### Lines 746-769

ShardingField declares field_id string=1, repeated int32 source_ids=2, optional transform string=3 (examples identity/year/bucket), optional DataFusion SQL expression string=4, result_type string=5 as Arrow type name, parameters string map=6 (example num_buckets). transform and expression are mutually exclusive by comment but are separate optional fields, so an implementation must reject both being present. Valid transforms, SQL restrictions, and result-type validation are not enforced here. (protos/table.proto:746-769)

## Interaction and interpretation limits

This document analyzes every schema line, not the algorithms alluded to in those comments. Current feature support, stable/unstable designation, commit conflict matrices, writer fencing, recovery listing, and catch-up/cleanup safety require Rust source. In particular, covering declarations may legally exceed payload availability (protos/table.proto:380-386), snapshots are not current shard truth (protos/table.proto:642-650), and absence is not zero progress (protos/table.proto:628-633).

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | syntax = "proto3";
    5 | 
    6 | package lance.table;
    7 | 
    8 | import "google/protobuf/any.proto";
    9 | import "google/protobuf/timestamp.proto";
   10 | import "file.proto";
   11 | import public "fragment_metadata.proto";
   12 | 
   13 | /*
   14 | 
   15 | Format:
   16 | 
   17 | +----------------------------------------+
   18 | |       Encoded Column 0, Chunk 0        |
   19 |            ...
   20 | |       Encoded Column M, Chunk N - 1    |
   21 | |       Encoded Column M, Chunk N        |
   22 | |       Indices ...                      |
   23 | |       Chunk Position (M x N x 8)       |
   24 | |         Manifest (Optional)            |
   25 | |         Metadata                       |
   26 | | i64: metadata position                 |
   27 | | MAJOR_VERSION | MINOR_VERSION | "LANC" |
   28 | +----------------------------------------+
   29 |  */
   30 | 
   31 | // UUID type. encoded as 16 bytes.
   32 | message UUID {
   33 |   bytes uuid = 1;
   34 | }
   35 | 
   36 | // Manifest is a global section shared between all the files.
   37 | message Manifest {
   38 |   // All fields of the dataset, including the nested fields.
   39 |   repeated lance.file.Field fields = 1;
   40 | 
   41 |   // Schema metadata.
   42 |   map<string, bytes> schema_metadata = 5;
   43 | 
   44 |   // Fragments of the dataset.
   45 |   repeated DataFragment fragments = 2;
   46 | 
   47 |   /* Tree tables set this, leave fragments empty, and set bit 12 on both flag
   48 |    * fields. Old readers skip unknown fields and would otherwise see an empty table.
   49 |    */
   50 |   FragmentTreeMetadata fragment_tree = 22;
   51 | 
   52 |   // Snapshot version number.
   53 |   uint64 version = 3;
   54 | 
   55 |   /* The file position of the version auxiliary data.
   56 |    *  * It is not inheritable between versions.
   57 |    *  * It is not loaded by default during query.
   58 |    */
   59 |   uint64 version_aux_data = 4;
   60 | 
   61 |   message WriterVersion {
   62 |     // The name of the library that created this file.
   63 |     string library = 1;
   64 |     /* The version of the library that created this file. Because we cannot assume
   65 |      * that the library is semantically versioned, this is a string. However, if it
   66 |      * is semantically versioned, it should be a valid semver string without any 'v'
   67 |      * prefix. For example: `2.0.0`, `2.0.0-rc.1`.
   68 |      *
   69 |      * For forward compatibility with older readers, when writing new manifests this
   70 |      * field should contain only the core version (major.minor.patch) without any
   71 |      * prerelease or build metadata. The prerelease/build info should be stored in
   72 |      * the separate prerelease and build_metadata fields instead.
   73 |      */
   74 |     string version = 2;
   75 |     /* Optional semver prerelease identifier.
   76 |      *
   77 |      * This field stores the prerelease portion of a semantic version separately
   78 |      * from the core version number. For example, if the full version is "2.0.0-rc.1",
   79 |      * the version field would contain "2.0.0" and prerelease would contain "rc.1".
   80 |      *
   81 |      * This separation ensures forward compatibility: older readers can parse the
   82 |      * clean version field without errors, while newer readers can reconstruct the
   83 |      * full semantic version by combining version, prerelease, and build_metadata.
   84 |      *
   85 |      * If absent, the version field is used as-is.
   86 |      */
   87 |     optional string prerelease = 3;
   88 |     /* Optional semver build metadata.
   89 |      *
   90 |      * This field stores the build metadata portion of a semantic version separately
   91 |      * from the core version number. For example, if the full version is
   92 |      * "2.0.0-rc.1+build.123", the version field would contain "2.0.0", prerelease
   93 |      * would contain "rc.1", and build_metadata would contain "build.123".
   94 |      *
   95 |      * If absent, no build metadata is present.
   96 |      */
   97 |     optional string build_metadata = 4;
   98 |   }
   99 | 
  100 |   /* The version of the writer that created this file.
  101 |    *
  102 |    * This information may be used to detect whether the file may have known bugs
  103 |    * associated with that writer.
  104 |    */
  105 |   WriterVersion writer_version = 13;
  106 | 
  107 |   // If present, the file position of the index metadata.
  108 |   optional uint64 index_section = 6;
  109 | 
  110 |   // Version creation Timestamp, UTC timezone
  111 |   google.protobuf.Timestamp timestamp = 7;
  112 | 
  113 |   // Optional version tag
  114 |   string tag = 8;
  115 | 
  116 |   /* Feature flags for readers.
  117 |    *
  118 |    * A bitmap of flags that indicate which features are required to be able to
  119 |    * read the table. If a reader does not recognize a flag that is set, it
  120 |    * should not attempt to read the dataset.
  121 |    *
  122 |    * Known flags:
  123 |    * * 1 << 0: deletion files are present
  124 |    * * 1 << 1: row ids are stable and stored as part of the fragment metadata.
  125 |    * * 1 << 2: use v2 format (deprecated)
  126 |    * * 1 << 3: table config is present
  127 |    * * 1 << 4: dataset uses multiple base paths
  128 |    * * 1 << 5: transaction file writes are disabled
  129 |    * * 1 << 6: data overlay files are present (see DataOverlayFile). Readers that do
  130 |    *   not understand overlays must refuse the dataset, since ignoring an overlay
  131 |    *   would silently return stale base values.
  132 |    * * 1 << 7: some index declares covering columns. Without 1 << 13,
  133 |    *   the carried columns form the trailing suffix of IndexMetadata.fields in
  134 |    *   emission order (see IndexMetadata). Readers
  135 |    *   that do not understand covering columns must refuse the dataset, since
  136 |    *   selecting an index by membership of fields would answer a query on a
  137 |    *   merely-carried column with an index keyed on a different column. Writers
  138 |    *   must refuse it too: one that treats every entry of fields as keyed would
  139 |    *   maintain the index against the wrong dependency set.
  140 |    * * 1 << 8: the dataset may reference recognized V2 data files with different
  141 |    *   exact versions. Readers and writers must use each DataFile's version
  142 |    *   instead of treating data_format.version as a snapshot-wide identity.
  143 |    *   This bit is paired in the reader and writer feature words and is one-way.
  144 |    * * 1 << 9: the table uses stable row ids and carries a fragment reuse index.
  145 |    * * 1 << 12: fragment records live in fragment_tree. The fragments list
  146 |    *   must be empty. Readers that do not know this bit must refuse the dataset.
  147 |    * * 1 << 13: IndexMetadata.fields and covering_fields are independent
  148 |    *   declarations. This bit requires 1 << 7 in both the reader and writer
  149 |    *   flags, and the two bits are retained together: whenever this bit is set,
  150 |    *   1 << 7 is also set, including manifests with no covering entries and
  151 |    *   manifests that drop the last covering index. Fields contains only the columns the index is keyed on, while
  152 |    *   covering_fields contains the columns whose values it carries. A field may
  153 |    *   occur in both lists. Implementations that only support the legacy suffix
  154 |    *   contract must refuse the dataset. Setting this bit reinterprets every
  155 |    *   IndexMetadata in the index section, so a writer must normalize every
  156 |    *   legacy-form entry in the same manifest -- or set the bit only when no
  157 |    *   entry declares covering fields -- and manifests derived from it must keep
  158 |    *   the bit set until a reverse conversion is likewise atomic.
  159 |    */
  160 |   uint64 reader_feature_flags = 9;
  161 | 
  162 |   /* Feature flags for writers.
  163 |    *
  164 |    * A bitmap of flags that indicate which features must be used when writing to the
  165 |    * dataset. If a writer does not recognize a flag that is set, it should not attempt to
  166 |    * write to the dataset.
  167 |    *
  168 |    * The flag identities are the same as for reader_feature_flags, but the values of
  169 |    * reader_feature_flags and writer_feature_flags are not required to be identical.
  170 |    */
  171 |   uint64 writer_feature_flags = 10;
  172 | 
  173 |   /* Highest fragment id ever allocated or reserved in this lineage.
  174 |    * Absent only before the first allocation or reservation. Never decreases.
  175 |    * u32::MAX means the fragment-id space is exhausted.
  176 |    */
  177 |   optional uint32 max_fragment_id = 11;
  178 | 
  179 |   /* Path to the transaction file, relative to `{root}/_transactions`. The file at that
  180 |    * location contains a wire-format serialized Transaction message representing the
  181 |    * transaction that created this version.
  182 |    *
  183 |    * This string field "transaction_file" may be empty if no transaction file was written.
  184 |    *
  185 |    * The path format is "{read_version}-{uuid}.txn" where {read_version} is the version of
  186 |    * the table the transaction read from (serialized to decimal with no padding digits),
  187 |    * and {uuid} is a hyphen-separated UUID.
  188 |    */
  189 |   string transaction_file = 12;
  190 | 
  191 |   /* The file position of the transaction content. None if transaction is empty
  192 |    * This transaction content begins with the transaction content length as u32
  193 |    * If the transaction proto message has a length of `len`, the message ends at `len` + 4
  194 |    */
  195 |   optional uint64 transaction_section = 21;
  196 | 
  197 |   /* The next unused row id. If zero, then the table does not have any rows.
  198 |    *
  199 |    * This is only used if the "stable_row_ids" feature flag is set.
  200 |    */
  201 |   uint64 next_row_id = 14;
  202 | 
  203 |   message DataStorageFormat {
  204 |     // The format of the data files (e.g. "lance")
  205 |     string file_format = 1;
  206 |     /* The default format version used when writing data files. Write operations
  207 |      * that do not select an exact version use this value. This setting does not
  208 |      * constrain index or other file types. The version syntax is defined by
  209 |      * file_format and is not required to follow semver.
  210 |      *
  211 |      * Unless the mixed data-file-version capability is set, every referenced
  212 |      * data file must use this version. When the capability is set, referenced
  213 |      * data files may use other recognized exact V2 versions, and each DataFile's
  214 |      * version is authoritative for decoding.
  215 |      */
  216 |     string version = 2;
  217 |   }
  218 | 
  219 |   /* The data storage format
  220 |    *
  221 |    * This specifies what format is used to store the data files.
  222 |    */
  223 |   DataStorageFormat data_format = 15;
  224 | 
  225 |   /* Table config.
  226 |    *
  227 |    * Keys with the prefix "lance." are reserved for the Lance library. Other
  228 |    * libraries may wish to similarly prefix their configuration keys
  229 |    * appropriately.
  230 |    */
  231 |   map<string, string> config = 16;
  232 | 
  233 |   /* Metadata associated with the table.
  234 |    *
  235 |    * This is a key-value map that can be used to store arbitrary metadata
  236 |    * associated with the table.
  237 |    *
  238 |    * This is different than configuration, which is used to tell libraries how
  239 |    * to read, write, or manage the table.
  240 |    *
  241 |    * This is different than schema metadata, which is used to describe the
  242 |    * data itself and is attached to the output schema of scans.
  243 |    */
  244 |   map<string, string> table_metadata = 19;
  245 | 
  246 |   // Field number 17 (`blob_dataset_version`) was used for a secondary blob dataset.
  247 |   reserved 17;
  248 |   reserved "blob_dataset_version";
  249 | 
  250 |   /* The base paths of data files.
  251 |    *
  252 |    * This is used to determine the base path of a data file. In common cases data file paths are under current dataset base path.
  253 |    * But for shallow cloning, importing file and other multi-tier storage cases, the actual data files could be outside of the current dataset.
  254 |    * This field is used with the `base_id` in `lance.file.File` and `lance.file.DeletionFile`.
  255 |    *
  256 |    * For example, if we have a dataset with base path `s3://bucket/dataset`, we have a DataFile with base_id 0, we get the actual data file path by:
  257 |    * base_paths[id = 0] + /data/ + file.path
  258 |    * the key(a.k.a index) starts from 0, increased by 1 for each new base path.
  259 |    */
  260 |   repeated BasePath base_paths = 18;
  261 | 
  262 |   // The branch of the dataset. None means main branch.
  263 |   optional string branch = 20;
  264 | } // Manifest
  265 | 
  266 | // external dataset base path
  267 | message BasePath {
  268 |   uint32 id = 1;
  269 |   /* This is an alias name of the base path, it is optional.
  270 |    * When we use shallow clone and the target version is a tag, the tag name will be set here.
  271 |    */
  272 |   optional string name = 2;
  273 |   /* Flag indicating whether this path is a dataset root path or file directory:
  274 |    * - true:  Path is a dataset root (actual files under subdirectories like `data`, '_deletions')
  275 |    * - false: Path is a direct file directory (scenario like importing files)
  276 |    */
  277 |   bool is_dataset_root = 3;
  278 |   // Note: This absolute path will be directly used by Path:parse(),
  279 |   string path = 4;
  280 | }
  281 | 
  282 | /* Auxiliary Data attached to a version.
  283 |  * Only load on-demand.
  284 |  */
  285 | message VersionAuxData {
  286 |   // key-value metadata.
  287 |   map<string, bytes> metadata = 3;
  288 | }
  289 | 
  290 | // Metadata describing an index.
  291 | message IndexMetadata {
  292 |   // Unique ID of an index. It is unique across all the dataset versions.
  293 |   UUID uuid = 1;
  294 | 
  295 |   /* The columns the index is keyed on, in key order. These refer to file.Field.id.
  296 |    *
  297 |    * When the manifest has feature flag 1 << 13, this list contains only key
  298 |    * fields. `covering_fields` independently declares the values the index
  299 |    * carries.
  300 |    *
  301 |    * Without feature flag 1 << 13, the legacy contract applies: the carried fields
  302 |    * form the trailing suffix of this list in emission order.
  303 |    */
  304 |   repeated int32 fields = 2;
  305 | 
  306 |   // Index name. Must be unique within one dataset version.
  307 |   string name = 3;
  308 | 
  309 |   // The version of the dataset this index was built from.
  310 |   uint64 dataset_version = 4;
  311 | 
  312 |   /* A bitmap of the included fragment ids.
  313 |    *
  314 |    * This may by used to determine how much of the dataset is covered by the
  315 |    * index. This information can be retrieved from the dataset by looking at
  316 |    * the dataset at `dataset_version`. However, since the old version may be
  317 |    * deleted while the index is still in use, this information is also stored
  318 |    * in the index.
  319 |    *
  320 |    * The bitmap is stored as a 32-bit Roaring bitmap.
  321 |    */
  322 |   bytes fragment_bitmap = 5;
  323 | 
  324 |   /* Details, specific to the index type, which are needed to load / interpret the index
  325 |    *
  326 |    * Indices should avoid putting large amounts of information in this field, as it will
  327 |    * bloat the manifest.
  328 |    *
  329 |    * Indexes are plugins, and so the format of the details message is flexible and not fully
  330 |    * defined by the table format.  However, there are some conventions that should be followed:
  331 |    *
  332 |    * - When Lance APIs refer to indexes they will use the type URL of the index details as the
  333 |    *   identifier for the index type.  If a user provides a simple string identifier like
  334 |    *   "btree" then it will be converted to "/lance.table.BTreeIndexDetails"
  335 |    * - Type URLs comparisons are case-insensitive.  Thereform an index must have a unique type
  336 |    *   URL ignoring case.
  337 |    */
  338 |   google.protobuf.Any index_details = 6;
  339 | 
  340 |   // The minimum lance version that this index is compatible with.
  341 |   optional int32 index_version = 7;
  342 | 
  343 |   /* Timestamp when the index was created (UTC timestamp in milliseconds since epoch)
  344 |    *
  345 |    * This field is optional for backward compatibility. For existing indices created before
  346 |    * this field was added, this will be None/null.
  347 |    */
  348 |   optional uint64 created_at = 8;
  349 | 
  350 |   /* The base path index of the data file. Used when the file is imported or referred from another dataset.
  351 |    * Lance use it as key of the base_paths field in Manifest to determine the actual base path of the data file.
  352 |    */
  353 |   optional uint32 base_id = 9;
  354 | 
  355 |   /* List of files and their sizes for this index segment.
  356 |    * This enables skipping HEAD calls when opening indices and allows reporting
  357 |    * of index sizes without extra IO.
  358 |    * If this is empty, the index files sizes are unknown.
  359 |    */
  360 |   repeated IndexFile files = 10;
  361 | 
  362 |   /* The fields whose values this index co-locates alongside its own data, so a
  363 |    * query projecting only those columns can be answered from the index without
  364 |    * a take against the base table.
  365 |    *
  366 |    * When the manifest has feature flag 1 << 13, this declaration is independent
  367 |    * of `fields` and has no positional relationship to it. A field may occur in
  368 |    * both lists when the index carries a value it is also keyed on. Consumers
  369 |    * must use the union of `fields` and `covering_fields` as the index dependency
  370 |    * set.
  371 |    *
  372 |    * Without feature flag 1 << 13, the legacy contract applies: the carried columns
  373 |    * form the trailing suffix of `fields` in emission order. A column the
  374 |    * index is both keyed on and carries appears twice, once as a key and once in
  375 |    * the carried suffix.
  376 |    *
  377 |    * Empty for an index that carries no extra columns, which is every index
  378 |    * written before this field existed.
  379 |    *
  380 |    * This declaration is not authoritative for what the segment can actually
  381 |    * serve. The segment's own storage schema is: a reader must confirm the
  382 |    * storage carries a column before answering a query from it, and fall back to
  383 |    * a take against the base table otherwise. A declaration naming columns the
  384 |    * storage does not hold is a legal state, not corruption -- a maintenance
  385 |    * operation that cannot carry the values through a rebuild is permitted to
  386 |    * withdraw the payload while leaving this declaration in place.
  387 |    */
  388 |   repeated int32 covering_fields = 11;
  389 | }
  390 | 
  391 | // Metadata about a single file within an index segment.
  392 | message IndexFile {
  393 |   // Path relative to the index directory (e.g., "index.idx", "auxiliary.idx")
  394 |   string path = 1;
  395 |   // Size of the file in bytes
  396 |   uint64 size_bytes = 2;
  397 | }
  398 | 
  399 | // Index Section, containing a list of index metadata for one dataset version.
  400 | message IndexSection {
  401 |   repeated IndexMetadata indices = 1;
  402 | }
  403 | 
  404 | // VectorIndexDetails and HnswParameters (formerly HnswIndexDetails) moved to index.proto
  405 | 
  406 | message FragmentReuseIndexDetails {
  407 | 
  408 |   oneof content {
  409 |     // if < 200KB, store the content inline, otherwise store the InlineContent bytes in external file
  410 |     InlineContent inline = 1;
  411 |     ExternalFile external = 2;
  412 |   }
  413 | 
  414 |   message InlineContent {
  415 |     // Existing compaction records, with the original field number and contents.
  416 |     repeated Version legacy_versions = 1;
  417 |     // New mappings; requires index_version = 1.
  418 |     repeated Transition transitions = 2;
  419 |   }
  420 | 
  421 |   // One transition from source fragments to destination fragments.
  422 |   message Transition {
  423 |     // Source fragments in scan order; counts include deleted rows.
  424 |     repeated FragmentDigest sources = 1;
  425 |     // Destination fragments in label order; counts are recorded at creation.
  426 |     repeated FragmentDigest destinations = 2;
  427 |     /* Exactly one mapping is required.
  428 |      * New mapping types do not require an index_version increase if they preserve
  429 |      * backward compatibility and older readers can handle them safely, including
  430 |      * by falling back to a scan. Otherwise, index_version must increase.
  431 |      * Other field numbers may be used for ordinary metadata.
  432 |      */
  433 |     oneof mapping {
  434 |       /* Concatenate surviving rows in source fragment order, preserving row order
  435 |        * within each fragment, then split into destination fragments.
  436 |        */
  437 |       OrderedCompaction ordered_compaction = 3;
  438 |       /* Process source fragments sequentially, distributing their rows across
  439 |        * destination fragments by label in source row order.
  440 |        */
  441 |       StablePartition stable_partition = 4;
  442 |     }
  443 |   }
  444 | 
  445 |   message OrderedCompaction {
  446 |     // RoaringTreemap of surviving source row addresses; missing rows are deleted.
  447 |     bytes changed_row_addrs = 1;
  448 |   }
  449 | 
  450 |   message StablePartition {
  451 |     // UUID in _fri/<map_id>/stable_partition.lance; unchanged when the FRI UUID changes.
  452 |     string map_id = 1;
  453 |     // Size of stable_partition.lance in bytes.
  454 |     uint64 map_size_bytes = 2;
  455 |     // Unset: use the dataset base. Set: look up this ID in Manifest.base_paths.
  456 |     optional uint32 base_id = 3;
  457 |   }
  458 | 
  459 |   message FragmentDigest {
  460 |     uint64 id = 1;
  461 | 
  462 |     uint64 physical_rows = 2;
  463 | 
  464 |     uint64 num_deleted_rows = 3;
  465 |   }
  466 | 
  467 |   // A summarized version of the RewriteGroup information in a Rewrite transaction
  468 |   message Group {
  469 |     /* A roaring treemap of the changed row addresses.
  470 |      * When combined with the old fragment IDs and new fragment IDs,
  471 |      * it can recover the full mapping of old row addresses to either new row addresses or deleted.
  472 |      * this mapping can then be used to remap indexes or satisfy index queries for the new unindexed fragments.
  473 |      */
  474 |     bytes changed_row_addrs = 1;
  475 | 
  476 |     repeated FragmentDigest old_fragments = 2;
  477 | 
  478 |     repeated FragmentDigest new_fragments = 3;
  479 |   }
  480 | 
  481 |   message Version {
  482 |     // The dataset_version at the time the index adds this version entry
  483 |     uint64 dataset_version = 1;
  484 | 
  485 |     repeated Group groups = 3;
  486 |   }
  487 | }
  488 | 
  489 | /* ============================================================================
  490 |  * MemWAL Index Types
  491 |  * ============================================================================
  492 |  */
  493 | 
  494 | /* Lifecycle status of a WAL shard. Drives drop-table two-phase commit:
  495 |  * a SEALED shard refuses new writer claims (reversible) until the drop
  496 |  * commits (the shard dir is deleted) or rolls back (status -> ACTIVE).
  497 |  */
  498 | enum ShardStatus {
  499 |   // Normal: the shard accepts writer claims.
  500 |   ACTIVE = 0;
  501 |   // A drop is in flight: claims are refused. Reversible to ACTIVE.
  502 |   SEALED = 1;
  503 | }
  504 | 
  505 | /* Shard manifest containing epoch-based fencing and WAL state.
  506 |  * Each shard has exactly one active writer at any time.
  507 |  */
  508 | message ShardManifest {
  509 |   // Shard identifier (UUID v4).
  510 |   UUID shard_id = 11;
  511 | 
  512 |   /* Manifest version number.
  513 |    * Matches the version encoded in the filename.
  514 |    */
  515 |   uint64 version = 1;
  516 | 
  517 |   /* Shard spec ID this shard was created with.
  518 |    * Set at shard creation and immutable thereafter.
  519 |    * A value of 0 indicates a manually-created shard not governed by any spec.
  520 |    */
  521 |   uint32 shard_spec_id = 10;
  522 | 
  523 |   /* Computed shard field values as raw Arrow scalar bytes, keyed by shard
  524 |    * field id. The byte encoding follows Arrow's little-endian convention:
  525 |    * int32 is 4 LE bytes, utf8 is raw UTF-8 bytes, etc. The receiver looks
  526 |    * up the result_type from the ShardingSpec to interpret each value.
  527 |    */
  528 |   repeated ShardFieldEntry shard_field_entries = 14;
  529 | 
  530 |   /* Writer fencing token - monotonically increasing.
  531 |    * A writer must increment this when claiming the shard.
  532 |    */
  533 |   uint64 writer_epoch = 2;
  534 | 
  535 |   /* The most recent WAL entry position that has been flushed to a MemTable.
  536 |    * During recovery, replay starts from replay_after_wal_entry_position + 1.
  537 |    * WAL positions are 1-based, so the default value 0 unambiguously means
  538 |    * "no flush has ever stamped this shard" and recovery replays from 1.
  539 |    */
  540 |   uint64 replay_after_wal_entry_position = 3;
  541 | 
  542 |   /* The most recent WAL entry position observed at the time the manifest was
  543 |    * updated. WAL positions are 1-based; default 0 means no entry has been
  544 |    * written yet. This is a hint, not authoritative - recovery must list
  545 |    * files to find actual state.
  546 |    */
  547 |   uint64 wal_entry_position_last_seen = 4;
  548 | 
  549 |   // Generation to assign to the next SSTable (incremented after each MemTable flush).
  550 |   uint64 current_generation = 6;
  551 | 
  552 |   /* Field 7 removed: compaction progress lives in
  553 |    * MemWalIndexDetails.compacted_sstables.
  554 |    */
  555 | 
  556 |   // List of SSTables created by flushing MemTables and their directory paths.
  557 |   repeated SsTable sstables = 8;
  558 | 
  559 |   /* Lifecycle status. Default ACTIVE; SEALED marks an in-flight drop
  560 |    * (drop-table 2PC). A SEALED manifest refuses claims at claim_epoch.
  561 |    */
  562 |   ShardStatus status = 15;
  563 | }
  564 | 
  565 | // A shard field value stored as raw Arrow scalar bytes.
  566 | message ShardFieldEntry {
  567 |   // Shard field id (matches ShardingField.field_id in the ShardingSpec).
  568 |   string field_id = 1;
  569 | 
  570 |   /* Raw Arrow scalar value bytes in little-endian encoding.
  571 |    * The data type is determined by the result_type of the matching ShardingField.
  572 |    */
  573 |   bytes value = 2;
  574 | }
  575 | 
  576 | // An SSTable: the immutable result of flushing a MemTable, stored as a Lance dataset.
  577 | message SsTable {
  578 |   // Generation number identifying this SSTable.
  579 |   uint64 generation = 1;
  580 | 
  581 |   // Directory name relative to the shard directory.
  582 |   string path = 2;
  583 | 
  584 |   /* Payload size of the rows, as the writer's MemTable accounted for them: the
  585 |      sum over its buffers of the window each one holds.
  586 | 
  587 |      An estimate of the payload, not a bound on what reading the SSTable costs.
  588 |      It excludes the per-array structure a reader materializes, so a consumer
  589 |      budgeting memory from it must add its own headroom.
  590 | 
  591 |      Absent on an SSTable written before this field existed, so a reader must
  592 |      not read a missing value as zero. The same applies to the two below. */
  593 |   optional uint64 in_memory_bytes = 3;
  594 | 
  595 |   /* Rows held, counting the older duplicates of a primary key that the
  596 |      generation's deletion vector masks. A scan that applies the deletion vector
  597 |      yields fewer. */
  598 |   optional uint64 physical_rows = 4;
  599 | 
  600 |   /* Total payload size of the primary-key columns, summed over every row in
  601 |      `physical_rows`. Not a per-row size: a variable-length key differs from row
  602 |      to row, and a consumer wanting a mean divides by the row count.
  603 | 
  604 |      Accounted the same way as `in_memory_bytes`, so the same caveat applies --
  605 |      it is not the size of any encoded form of the key, such as a comparable
  606 |      byte-ordered encoding a reader might build for sorting or deduplication.
  607 | 
  608 |      Absent also on a table with no primary key. */
  609 |   optional uint64 primary_key_bytes = 5;
  610 | }
  611 | 
  612 | // A pointer to the latest SSTable compacted for a shard.
  613 | message CompactedSsTable {
  614 |   // Shard identifier (UUID v4).
  615 |   UUID shard_id = 1;
  616 | 
  617 |   // Generation of the latest SSTable compacted into the base table for this shard.
  618 |   uint64 generation = 2;
  619 | }
  620 | 
  621 | /* Tracks which compacted SSTable generation a base table index has been rebuilt to cover.
  622 |  * Used to determine whether to read from SSTable indexes or base table.
  623 |  */
  624 | message IndexCatchupProgress {
  625 |   // Name of the base table index (must match an entry in maintained_indexes).
  626 |   string index_name = 1;
  627 | 
  628 |   /* Per-shard progress: the generation up to which this index covers.
  629 |    *
  630 |    * An absent shard means *unknown*: this index has recorded no catch-up for
  631 |    * that shard, so its SSTables must be retained and a repair scheduled.
  632 |    */
  633 |   repeated CompactedSsTable caught_up_generations = 2;
  634 | }
  635 | 
  636 | /* Index details for MemWAL Index, stored in IndexMetadata.index_details.
  637 |  * This is the centralized structure for all MemWAL metadata:
  638 |  * - Configuration (sharding specs, indexes to maintain)
  639 |  * - SSTable compaction progress
  640 |  * - Shard state snapshots
  641 |  *
  642 |  * Writers read this index to get configuration before writing.
  643 |  * Readers may use shard snapshots in this index as a point-in-time
  644 |  * optimization. Readers that need the latest shard set should list shard
  645 |  * directories in storage and read each shard's latest manifest.
  646 |  * A background process updates the index periodically to keep shard snapshots current.
  647 |  *
  648 |  * Shard snapshots are stored as a Lance file with one row per shard.
  649 |  * The schema records shard discovery fields. Full mutable shard state remains
  650 |  * authoritative in the shard manifest files.
  651 |  *   shard_id: utf8
  652 |  *   shard_spec_id: uint32
  653 |  *   shard_field_{field_id}: typed per the matching ShardingField.result_type
  654 |  */
  655 | message MemWalIndexDetails {
  656 |   // Snapshot timestamp (Unix timestamp in milliseconds).
  657 |   int64 snapshot_ts_millis = 1;
  658 | 
  659 |   /* Number of shards in the snapshot.
  660 |    * Used to determine storage format without reading the snapshot data.
  661 |    */
  662 |   uint32 num_shards = 2;
  663 | 
  664 |   /* Inline shard snapshots for small shard counts.
  665 |    * When num_shards <= threshold (implementation-defined, e.g., 100),
  666 |    * snapshots are stored inline as serialized bytes.
  667 |    * Format: Lance file bytes with the shard snapshot schema.
  668 |    */
  669 |   optional bytes inline_snapshots = 3;
  670 | 
  671 |   /* Sharding specs defining how to derive shard identifiers.
  672 |    * This configuration determines how rows are partitioned into shards.
  673 |    */
  674 |   repeated ShardingSpec sharding_specs = 7;
  675 | 
  676 |   /* Indexes from the base table to maintain in MemTables.
  677 |    * These are index names referencing indexes defined on the base table.
  678 |    * The primary key btree index is always maintained implicitly and
  679 |    * should not be listed here.
  680 |    *
  681 |    * For vector indexes, MemTables inherit quantization parameters (PQ codebook,
  682 |    * SQ params) from the base table index to ensure distance comparability.
  683 |    */
  684 |   repeated string maintained_indexes = 8;
  685 | 
  686 |   /* Maintain every index the MemTable can mirror, rather than the named set.
  687 |    *
  688 |    * Set, `maintained_indexes` is ignored and the set is resolved from the
  689 |    * table's indexes each time a MemTable is built, so an index created later is
  690 |    * picked up and a dropped one falls out. An index kind the writer cannot
  691 |    * mirror is skipped, so introducing one does not make the table unwritable.
  692 |    *
  693 |    * Absent, `maintained_indexes` is the set verbatim and a name in it that the
  694 |    * writer cannot mirror is an error: the caller asked for that index.
  695 |    */
  696 |   optional bool maintain_all_indexes = 12;
  697 | 
  698 |   /* Latest SSTable compacted into the base table for each shard.
  699 |    * This is updated atomically with merge-insert data commits, enabling
  700 |    * conflict resolution when multiple compactors operate concurrently.
  701 |    *
  702 |    * Note: This is separate from shard snapshots because:
  703 |    * 1. compacted_sstables is updated by compactors (atomic with data commit)
  704 |    * 2. shard snapshots are updated by background index builder
  705 |    */
  706 |   repeated CompactedSsTable compacted_sstables = 9;
  707 | 
  708 |   /* Per-index catchup progress tracking.
  709 |    * When data is compacted into the base table, base table indexes are rebuilt
  710 |    * asynchronously. This field tracks which generation each index covers.
  711 |    *
  712 |    * For indexed queries, if an index's caught_up_generation < compacted_generation,
  713 |    * readers should use SSTable indexes for the gap instead of
  714 |    * scanning unindexed data in the base table.
  715 |    *
  716 |    * An index absent from this list has recorded no catch-up, so the SSTables it
  717 |    * would need stay live until a repair records it. Only the dedicated WAL
  718 |    * index-repair path may add entries here;
  719 |    * ordinary index operations have their entry removed automatically when they
  720 |    * change an index, since they do not report what the new index covers.
  721 |    */
  722 |   repeated IndexCatchupProgress index_catchup = 10;
  723 | 
  724 |   /* Default ShardWriter configuration values for this MemWAL index.
  725 |    *
  726 |    * A free-form string map persisted so that every writer — across
  727 |    * processes and restarts — starts from the same default writer
  728 |    * configuration. These are defaults only: an individual writer may
  729 |    * still override any value at runtime in its own ShardWriterConfig
  730 |    * (which is not persisted).
  731 |    */
  732 |   map<string, string> writer_config_defaults = 11;
  733 | }
  734 | 
  735 | // Sharding spec definition.
  736 | message ShardingSpec {
  737 |   /* Unique identifier for this spec within the index.
  738 |    * IDs are never reused.
  739 |    */
  740 |   uint32 spec_id = 1;
  741 | 
  742 |   // Sharding field definitions that determine how to compute shard identifiers.
  743 |   repeated ShardingField fields = 2;
  744 | }
  745 | 
  746 | // Sharding field definition.
  747 | message ShardingField {
  748 |   // Unique string identifier for this shard field.
  749 |   string field_id = 1;
  750 | 
  751 |   // Field IDs referencing source columns in the schema.
  752 |   repeated int32 source_ids = 2;
  753 | 
  754 |   /* Well-known shard transform name (e.g., "identity", "year", "bucket").
  755 |    * Mutually exclusive with expression.
  756 |    */
  757 |   optional string transform = 3;
  758 | 
  759 |   /* DataFusion SQL expression for custom logic.
  760 |    * Mutually exclusive with transform.
  761 |    */
  762 |   optional string expression = 4;
  763 | 
  764 |   // Output type of the shard value (Arrow type name).
  765 |   string result_type = 5;
  766 | 
  767 |   // Transform parameters (e.g., num_buckets for bucket transform).
  768 |   map<string, string> parameters = 6;
  769 | }
``````
