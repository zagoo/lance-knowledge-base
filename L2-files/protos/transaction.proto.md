> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen. Refresh 2026-10-12: [current coordinates and changed contracts](../../refresh-addenda/2026-10-12-011953c2.md) at `011953c22097b67b699595adbe99e7f0155d83e4` supersede affected historical statements; body remains frozen.

# protos/transaction.proto

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `c0e01e714a2f3a6b6f925d082bb5fca47a18ece1478a3e62d07eb8a4bb40a2f7`. Reviewed physical lines: 1-433.

[Module](../../L1-modules/protos.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Behavior contracts](../../L3-symbols/behavior-contracts.md) · [Format](../../L3-symbols/format-spec.md) · [Entry](../../README.md)

## Role and visibility

Public lance.table.Transaction persisted/wire representation for reconstructing a manifest during commit retries and deciding transaction compatibility. Nested messages encode proposed changes; no actual conflict matrix, atomic storage commit, retry loop, or validation implementation appears in this file. (protos/transaction.proto:1-433)

## Complete range analysis

### Lines 1-11

SPDX, proto3, file.proto/table.proto/Any imports, and lance.table package establish the transaction schema. (protos/transaction.proto:1-11)

### Lines 12-38

Transaction exists to rebuild a manifest on retry and determine compatibility after conflict. read_version uint64=1 is the snapshot used for planning/evaluating predicates; uuid string=2 identifies the transaction; tag string=3 is described as optional but lacks scalar presence; transaction_properties string map=4 reserves __lance_commit_message. These fields are not the newly assigned commit version. (protos/transaction.proto:12-38)

### Lines 39-64

Append.fragments repeated DataFragment=1 contains new fragments whose IDs are not assigned yet. Delete has updated_fragments=1 with existing IDs, deleted_fragment_ids uint64 list=2 for whole-fragment removal, and predicate string=3 that may determine whether a concurrent write would have matched. The predicate string alone does not encode the actual conflict algorithm. (protos/transaction.proto:39-64)

### Lines 65-81

Overwrite creates/replaces a dataset: new fragments=1 with IDs not yet assigned, schema repeated Field=2, bytes-valued schema_metadata=3, string config_upsert_values=4 merged with existing config, and initial_bases repeated BasePath=5 for creation. Overwrite does not imply every configuration map is blindly replaced according to these field comments. (protos/transaction.proto:65-81)

### Lines 82-93

CreateIndex carries new_indices=1 and removed_indices=2. It supports addition/replacement and removal by an empty new list; removed entries are the replaced indices. Names, IDs, duplicate handling, and conflicts are not validated here. (protos/transaction.proto:82-93)

### Lines 94-130

Rewrite is documented as rearranging storage without changing table data. Deprecated old_fragments=1 carries existing IDs; deprecated new_fragments=2 carries unassigned IDs. RewrittenIndex has old_id UUID=1, new_id UUID=2, new_index_details Any=3, new_index_version uint32=4, and new_index_files repeated=5 (empty when sizes unavailable). The preceding comment says only UUID is serialized, but the actual declaration now includes detail/version/files; retain the declaration and flag stale prose. (protos/transaction.proto:94-130)

### Lines 131-151

RewriteGroup holds old_fragments=1 with existing IDs and new_fragments=2 whose IDs were reserved by a prior reserve operation. Rewrite.groups=3 and rewritten_indices=4 are the current grouped metadata. Grouped new IDs therefore have different preconditions from the deprecated unassigned-ID fields. (protos/transaction.proto:131-151)

### Lines 152-171

Merge adds a column/schema, using existing-ID fragments=1, schema=2, schema_metadata=3, preserves_nullability bool=4. True asserts no field is introduced that earlier-schema staged data cannot safely omit. False or historical absence conservatively conflicts with concurrent value writes and may force retries; this is an optimization assertion, not a general no-conflict flag. (protos/transaction.proto:152-171)

### Lines 172-190

Project.schema=1 is the new field projection, preserves_nullability bool=2 asserts no nullability-affecting change. Rename/drop are examples eligible for true; tightening nullability must not set it. False/absent conservatively conflicts with concurrent value writes. Restore.version uint64=1 identifies the target historical version; its materialization and feature reconciliation remain runtime questions. (protos/transaction.proto:172-190)

### Lines 191-222

ReserveFragments.num_fragments uint32=1 reserves future rewrite IDs. Clone carries is_shallow bool=1, optional source ref_name=2, source ref_version uint64=3, absolute ref_path string=4, optional target branch_name=5. Shallow copies metadata and references original data via bases; deep-copy prose proposes native backend copy. The 3-10x speed claim is an unmeasured comment, not a benchmark or supported throughput guarantee, and atomicity behavior must be traced rather than inferred from backend examples. (protos/transaction.proto:191-222)

### Lines 223-250

ExactKeySetFilter stores repeated uint64 key_hashes=1 for small inserted-row sets; exact refers to the set of hashes, not collision-free original keys. BloomFilter stores SBBF bitmap bytes=1, num_bits uint32=2, number_of_items uint64=3, probability double=4. Different size/parameter filters cannot be intersected directly. The comments list defaults 8192 and 0.00057, but bare proto3 numeric defaults are zero; actual fallback/config initialization requires source evidence. Threshold for exact versus Bloom is not specified. (protos/transaction.proto:223-250)

### Lines 251-272

KeyExistenceFilter is created only when merge-insert ON columns match the schema's unenforced primary key; presence enables strict primary-key conflict detection. field_ids repeated int32=1 identifies key fields and data oneof selects ExactKeySetFilter exact=2 or BloomFilter bloom=3. UInt32List.values repeated=1 represents sorted distinct zero-based local physical fragment offsets, not stable row IDs. (protos/transaction.proto:251-272)

### Lines 273-293

Update carries removed_fragment_ids=1 for fully moved fragments, updated_fragments=2, new_fragments=3 for moved rows, fields_modified uint32 list=4, compacted_sstables=5, fields_for_preserving_frag_bitmap uint32 list=6, and UpdateMode=7. The latter field list helps decide which index fragment bitmaps retain new fragment IDs. The opening description says update does not add/remove rows, but the following inserted_rows contract explicitly serves merge-insert insert tracking; do not treat the heading as exhaustive runtime operation scope. The inserted_rows follow-up is at protos/transaction.proto:293-305. (protos/transaction.proto:273-293)

### Lines 294-307

Update.inserted_rows optional KeyExistenceFilter=8 tracks only INSERT keys during merge-insert, never updated keys. Deprecated updated_fragment_offsets map<uint64,UInt32List>=9 records RewriteColumns matched offsets. Current updated_fragment_offset_bitmaps map<uint64,bytes>=10 stores portable RoaringBitmap bytes: writers emit only 10; readers prefer 10 and fall back to 9 for older manifests. This is an explicit legacy-read boundary, not permission to extend the old writer form. (protos/transaction.proto:294-307)

### Lines 308-323

UpdateMode REWRITE_ROWS=0 deletes old-fragment rows and writes new fragments, motivated by many changed columns or few affected rows. REWRITE_COLUMNS=1 rewrites entire columns within fragments, adds new files, and tombstones old columns, motivated by many affected rows/few columns. These are qualitative selection guidelines, not measured thresholds. (protos/transaction.proto:308-323)

### Lines 324-339

UpdateMapEntry has key string=1 and optional value string=2: absent value removes the key, while present empty string stores an empty value. UpdateMap.update_entries repeated=1 applies changes and replace bool=2 selects full replacement versus merge. Duplicate-key ordering and deletion during replacement require converter evidence. (protos/transaction.proto:324-339)

### Lines 340-359

UpdateConfig uses UpdateMap config_updates=6, table_metadata_updates=7, schema_metadata_updates=8, and map<int32,UpdateMap> field_metadata_updates=9. Deprecated fields remain upsert_values map=1, delete_keys list=2, schema_metadata string map=3, and field_metadata map<uint32,FieldMetadataUpdate>=4 with nested metadata string map=5. The signed-versus-unsigned field-ID key types differ; preference/fallback between old and new forms is not specified here. (protos/transaction.proto:340-359)

### Lines 360-369

DataReplacementGroup contains fragment_id uint64=1 and DataFile new_file=2. DataReplacement.replacements repeated=1 replaces data in table regions. It does not define region selection or column matching beyond the group payload. (protos/transaction.proto:360-369)

### Lines 370-394

DataOverlayGroup identifies fragment_id=1 and repeated overlays=2 appended in order to existing overlays, preserving concurrently committed entries rather than replacing the list. Writer leaves committed_version zero; commit stamps the actual new version and restamps on retry. Touched fields come from each overlay data_file.fields. DataOverlay.groups=1 attaches sparse cell changes without rewriting base files. Its comment points through table.proto's public import to DataOverlayFile now declared in fragment_metadata.proto (protos/table.proto:11-11; protos/fragment_metadata.proto:185-238); exact permissive conflict rules are delegated to specs/implementation rather than specified here. (protos/transaction.proto:370-394)

### Lines 395-409

UpdateMemWalState.compacted_sstables=1 records SSTable compaction progress atomically during merge-insert, by contract. UpdateBases.new_bases repeated BasePath=1 adds bases to the manifest. Atomicity and duplicate/base-ID validation need actual commit code. (protos/transaction.proto:395-409)

### Lines 410-429

Transaction.operation union tags are append=100, delete=101, overwrite=102, create_index=103, rewrite=104, merge=105, restore=106, reserve_fragments=107, update=108, project=109, update_config=110, data_replacement=111, update_mem_wal_state=112, clone=113, update_bases=114, data_overlay=115. Adding a kind requires preserving applicable stable tags and updating all producer/consumer dispatch; this declaration alone does not identify those implementation files. (protos/transaction.proto:410-429)

### Lines 430-433

Former blob dataset operations reserve tags 200 and 202 and names blob_append/blob_overwrite. These arms are not active operations and cannot be reused for a new operation under the declared compatibility reservation. (protos/transaction.proto:430-433)

## Interaction and interpretation limits

Conflict-relevant schema assertions and writer/reader preference contracts are captured, but the complete operation-pair compatibility matrix remains unknown (protos/transaction.proto:12-18; protos/transaction.proto:163-182; protos/transaction.proto:251-305; protos/transaction.proto:385-389). The stale rewrite UUID-only comment and Update heading mismatch must be reconciled with implementation, not silently generalized.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | syntax = "proto3";
    5 | 
    6 | import "file.proto";
    7 | import "table.proto";
    8 | import "google/protobuf/any.proto";
    9 | 
   10 | package lance.table;
   11 | 
   12 | /* A transaction represents the changes to a dataset.
   13 |  *
   14 |  * This has two purposes:
   15 |  * 1. When retrying a commit, the transaction can be used to re-build an updated
   16 |  *    manifest.
   17 |  * 2. When there's a conflict, this can be used to determine whether the other
   18 |  *    transaction is compatible with this one.
   19 |  */
   20 | message Transaction {
   21 |   /* The version of the dataset this transaction was built from.
   22 |    *
   23 |    * For example, for a delete transaction this means the version of the dataset
   24 |    * that was read from while evaluating the deletion predicate.
   25 |    */
   26 |   uint64 read_version = 1;
   27 | 
   28 |   // The UUID that unique identifies a transaction.
   29 |   string uuid = 2;
   30 | 
   31 |   // Optional version tag.
   32 |   string tag = 3;
   33 | 
   34 |   /* Optional properties for the transaction
   35 |    * __lance_commit_message is a reserved key
   36 |    */
   37 |   map<string, string> transaction_properties = 4;
   38 | 
   39 |   // Add new rows to the dataset.
   40 |   message Append {
   41 |     /* The new fragments to append.
   42 |      *
   43 |      * Fragment IDs are not yet assigned.
   44 |      */
   45 |     repeated DataFragment fragments = 1;
   46 |   }
   47 | 
   48 |   // Mark rows as deleted.
   49 |   message Delete {
   50 |     /* The fragments to update
   51 |      *
   52 |      * The fragment IDs will match existing fragments in the dataset.
   53 |      */
   54 |     repeated DataFragment updated_fragments = 1;
   55 |     // The fragments to delete entirely.
   56 |     repeated uint64 deleted_fragment_ids = 2;
   57 |     /* The predicate that was evaluated
   58 |      *
   59 |      * This may be used to determine whether the delete would have affected
   60 |      * files written by a concurrent transaction.
   61 |      */
   62 |     string predicate = 3;
   63 |   }
   64 | 
   65 |   // Create or overwrite the entire dataset.
   66 |   message Overwrite {
   67 |     /* The new fragments
   68 |      *
   69 |      * Fragment IDs are not yet assigned.
   70 |      */
   71 |     repeated DataFragment fragments = 1;
   72 |     // The new schema
   73 |     repeated lance.file.Field schema = 2;
   74 |     // Schema metadata.
   75 |     map<string, bytes> schema_metadata = 3;
   76 |     // Key-value pairs to merge with existing config.
   77 |     map<string, string> config_upsert_values = 4;
   78 |     // The base paths to be added for the initial dataset creation
   79 |     repeated BasePath initial_bases = 5;
   80 |   }
   81 | 
   82 |   /* Add or replace a new secondary index.
   83 |    *
   84 |    * This is also used to remove an index (we are replacing it with nothing)
   85 |    *
   86 |    * - new_indices: the modified indices, empty if dropping indices only
   87 |    * - removed_indices: the indices that are being replaced
   88 |    */
   89 |   message CreateIndex {
   90 |     repeated IndexMetadata new_indices = 1;
   91 |     repeated IndexMetadata removed_indices = 2;
   92 |   }
   93 | 
   94 |   /* An operation that rewrites but does not change the data in the table. These
   95 |    * kinds of operations just rearrange data.
   96 |    */
   97 |   message Rewrite {
   98 |     /* The old fragments that are being replaced
   99 |      *
  100 |      * DEPRECATED: use groups instead.
  101 |      *
  102 |      * These should all have existing fragment IDs.
  103 |      */
  104 |     repeated DataFragment old_fragments = 1;
  105 |     /* The new fragments
  106 |      *
  107 |      * DEPRECATED: use groups instead.
  108 |      *
  109 |      * These fragments IDs are not yet assigned.
  110 |      */
  111 |     repeated DataFragment new_fragments = 2;
  112 | 
  113 |     /* During a rewrite an index may be rewritten.  We only serialize the UUID
  114 |      * since a rewrite should not change the other index parameters.
  115 |      */
  116 |     message RewrittenIndex {
  117 |       // The id of the index that will be replaced
  118 |       UUID old_id = 1;
  119 |       // the id of the new index
  120 |       UUID new_id = 2;
  121 |       // the new index details
  122 |       google.protobuf.Any new_index_details = 3;
  123 |       // the version of the new index
  124 |       uint32 new_index_version = 4;
  125 |       /* Files in the new index with their sizes.
  126 |        * Empty if file sizes are not available (e.g. older writers).
  127 |        */
  128 |       repeated IndexFile new_index_files = 5;
  129 |     }
  130 | 
  131 |     // A group of rewrite files that are all part of the same rewrite.
  132 |     message RewriteGroup {
  133 |       /* The old fragment that is being replaced
  134 |        *
  135 |        * This should have an existing fragment ID.
  136 |        */
  137 |       repeated DataFragment old_fragments = 1;
  138 |       /* The new fragment
  139 |        *
  140 |        * The ID should have been reserved by an earlier
  141 |        * reserve operation
  142 |        */
  143 |       repeated DataFragment new_fragments = 2;
  144 |     }
  145 | 
  146 |     // Groups of files that have been rewritten
  147 |     repeated RewriteGroup groups = 3;
  148 |     // Indices that have been rewritten
  149 |     repeated RewrittenIndex rewritten_indices = 4;
  150 |   }
  151 | 
  152 |   // An operation that merges in a new column, altering the schema.
  153 |   message Merge {
  154 |     /* The updated fragments
  155 |      *
  156 |      * These should all have existing fragment IDs.
  157 |      */
  158 |     repeated DataFragment fragments = 1;
  159 |     // The new schema
  160 |     repeated lance.file.Field schema = 2;
  161 |     // Schema metadata.
  162 |     map<string, bytes> schema_metadata = 3;
  163 |     /* Set when this merge makes no nullability-affecting schema change: it
  164 |      * introduces no field that data staged against an earlier schema could
  165 |      * not safely omit. Without the assertion (including transactions written
  166 |      * before this field existed) the merge conservatively conflicts with
  167 |      * concurrent value-writes, which can only cause a retry.
  168 |      */
  169 |     bool preserves_nullability = 4;
  170 |   }
  171 | 
  172 |   // An operation that projects a subset of columns, altering the schema.
  173 |   message Project {
  174 |     // The new schema
  175 |     repeated lance.file.Field schema = 1;
  176 |     /* Set when this projection makes no nullability-affecting schema change,
  177 |      * as a rename or a drop does not. Without the assertion (including
  178 |      * transactions written before this field existed) the projection
  179 |      * conservatively conflicts with concurrent value-writes, which can only
  180 |      * cause a retry. A nullability tightening must not set this.
  181 |      */
  182 |     bool preserves_nullability = 2;
  183 |   }
  184 | 
  185 |   // An operation that restores a dataset to a previous version.
  186 |   message Restore {
  187 |     // The version to restore to
  188 |     uint64 version = 1;
  189 |   }
  190 | 
  191 |   /* An operation that reserves fragment ids for future use in
  192 |    * a rewrite operation.
  193 |    */
  194 |   message ReserveFragments {
  195 |     uint32 num_fragments = 1;
  196 |   }
  197 | 
  198 |   // An operation that clones a dataset.
  199 |   message Clone {
  200 |     /* - true:  Performs a metadata-only clone (copies manifest without data files).
  201 |      *          The cloned dataset references original data through `base_paths`,
  202 |      *          suitable for experimental scenarios or rapid metadata migration.
  203 |      * - false: Performs a full deep clone using the underlying object storage's native
  204 |      *          copy API (e.g., S3 CopyObject, GCS rewrite). This leverages server-side
  205 |      *          bulk copy operations to bypass download/upload bottlenecks, achieving
  206 |      *          near-linear speedup for large datasets (typically 3-10x faster than
  207 |      *          manual file transfers). The operation maintains atomicity and data
  208 |      *          integrity guarantees provided by the storage backend.
  209 |      */
  210 |     bool is_shallow = 1;
  211 |     /* the reference name in the source dataset
  212 |      * in most cases it should be the branch or tag name in the source dataset
  213 |      */
  214 |     optional string ref_name = 2;
  215 |     // the version of the source dataset for cloning
  216 |     uint64 ref_version = 3;
  217 |     // the absolute base path of the source dataset for cloning
  218 |     string ref_path = 4;
  219 |     // if the target dataset is a branch, this is the branch name of the target dataset
  220 |     optional string branch_name = 5;
  221 |   }
  222 |   
  223 |   /* Exact set of key hashes for conflict detection.
  224 |    * Used when the number of inserted rows is small.
  225 |    */
  226 |   message ExactKeySetFilter {
  227 |     // 64-bit hashes of the inserted row keys.
  228 |     repeated uint64 key_hashes = 1;
  229 |   }
  230 | 
  231 |   /* Bloom filter for key existence tests.
  232 |    * Used when the number of rows is large.
  233 |    */
  234 |   message BloomFilter {
  235 |     // Bitset backing the bloom filter (SBBF format).
  236 |     bytes bitmap = 1;
  237 |     // Number of bits in the bitmap.
  238 |     uint32 num_bits = 2;
  239 |     /* Number of items the filter was sized for.
  240 |      * Used for intersection validation (filters with different sizes cannot be compared).
  241 |      * Default: 8192
  242 |      */
  243 |     uint64 number_of_items = 3;
  244 |     /* False positive probability the filter was sized for.
  245 |      * Used for intersection validation (filters with different parameters cannot be compared).
  246 |      * Default: 0.00057
  247 |      */
  248 |     double probability = 4;
  249 |   }
  250 | 
  251 |   /* A filter for checking key existence in set of rows inserted by a merge insert operation.
  252 |    * Only created when the merge insert's ON columns match the schema's unenforced primary key.
  253 |    * The presence of this filter indicates strict primary key conflict detection should be used.
  254 |    * Can use either an exact set (for small row counts) or a Bloom filter (for large row counts).
  255 |    */
  256 |   message KeyExistenceFilter {
  257 |     // Field IDs of columns participating in the key (must match unenforced primary key).
  258 |     repeated int32 field_ids = 1;
  259 |     // The underlying data structure storing the key hashes.
  260 |     oneof data {
  261 |       // Exact set of key hashes (used for small number of rows).
  262 |       ExactKeySetFilter exact = 2;
  263 |       // Bloom filter (used for large number of rows).
  264 |       BloomFilter bloom = 3;
  265 |     }
  266 |   }
  267 | 
  268 |   // Serialized as sorted distinct local physical row offsets within the fragment (0-based).
  269 |   message UInt32List {
  270 |     repeated uint32 values = 1;
  271 |   }
  272 | 
  273 |   // An operation that updates rows but does not add or remove rows.
  274 |   message Update {
  275 |     /* The fragments that have been removed. These are fragments where all rows
  276 |      * have been updated and moved to a new fragment.
  277 |      */
  278 |     repeated uint64 removed_fragment_ids = 1;
  279 |     // The fragments that have been updated.
  280 |     repeated DataFragment updated_fragments = 2;
  281 |     // The new fragments where updated rows have been moved to.
  282 |     repeated DataFragment new_fragments = 3;
  283 |     // The ids of the fields that have been modified.
  284 |     repeated uint32 fields_modified = 4;
  285 |     /// SSTables to mark as compacted after this transaction.
  286 |     repeated CompactedSsTable compacted_sstables = 5;
  287 |     /* The fields that used to judge whether to preserve the new frag's id into
  288 |      * the frag bitmap of the specified indices.
  289 |      */
  290 |     repeated uint32 fields_for_preserving_frag_bitmap = 6;
  291 |     // The mode of update
  292 |     UpdateMode update_mode = 7;
  293 |     /* Filter for checking existence of keys in newly inserted rows, used for conflict detection.
  294 |      * Only tracks keys from INSERT operations during merge insert, not updates.
  295 |      */
  296 |     optional KeyExistenceFilter inserted_rows = 8;
  297 |     /* Per-fragment physical row offsets that matched an update_columns hash join (RewriteColumns).
  298 |      * Deprecated: use updated_fragment_offset_bitmaps (field 10) instead.
  299 |      */
  300 |     map<uint64, UInt32List> updated_fragment_offsets = 9;
  301 |     /* Per-fragment matched offsets as portable RoaringBitmap bytes (replaces field 9).
  302 |      * Writers emit field 10 only. Readers prefer field 10; fall back to field 9 for
  303 |      * manifests written before this change.
  304 |      */
  305 |     map<uint64, bytes> updated_fragment_offset_bitmaps = 10;
  306 |   }
  307 | 
  308 |   // The mode of update operation
  309 |   enum UpdateMode {
  310 | 
  311 |     /* rows are deleted in current fragments and rewritten in new fragments.
  312 |      * This is most optimal when the majority of columns are being rewritten
  313 |      * or only a few rows are being updated.
  314 |      */
  315 |     REWRITE_ROWS = 0;
  316 | 
  317 |     /* within each fragment, columns are fully rewritten and inserted as new data files.
  318 |      * Old versions of columns are tombstoned. This is most optimal when most rows are affected
  319 |      * but a small subset of columns are affected.
  320 |      */
  321 |     REWRITE_COLUMNS = 1;
  322 |   }
  323 | 
  324 |   // An entry for a map update. If value is not set, the key will be removed from the map.
  325 |   message UpdateMapEntry {
  326 |     // The key of the map entry to update.
  327 |     string key = 1;
  328 |     // The value to set for the key.
  329 |     optional string value = 2;
  330 |   }
  331 | 
  332 |   message UpdateMap {
  333 |     repeated UpdateMapEntry update_entries = 1;
  334 |     /* If true, the map will be replaced entirely with the new entries.
  335 |      * If false, the new entries will be merged with the existing map.
  336 |      */
  337 |     bool replace = 2;
  338 |   }
  339 |   
  340 |   /* An operation that updates the table config, table metadata, schema metadata,
  341 |    * or field metadata.
  342 |    */
  343 |   message UpdateConfig {
  344 |     UpdateMap config_updates = 6;
  345 |     UpdateMap table_metadata_updates = 7;
  346 |     UpdateMap schema_metadata_updates = 8;
  347 |     map<int32, UpdateMap> field_metadata_updates = 9;
  348 | 
  349 |     // Deprecated -------------------------------
  350 |     map<string, string> upsert_values = 1;
  351 |     repeated string delete_keys = 2;
  352 |     map<string, string> schema_metadata = 3;
  353 |     map<uint32, FieldMetadataUpdate> field_metadata = 4;
  354 | 
  355 |     message FieldMetadataUpdate {
  356 |       map<string, string> metadata = 5;
  357 |     }
  358 |   }
  359 | 
  360 |   message DataReplacementGroup {
  361 |     uint64 fragment_id = 1;
  362 |     DataFile new_file = 2;
  363 |   }
  364 | 
  365 |   // An operation that replaces the data in a region of the table with new data.
  366 |   message DataReplacement {
  367 |     repeated DataReplacementGroup replacements = 1;
  368 |   }
  369 | 
  370 |   /* Overlay files to append to a single fragment, in order (the last entry is
  371 |    * newest). The overlays are appended to the fragment's existing `overlays`
  372 |    * list; they do not replace it, so overlays written by concurrent commits are
  373 |    * preserved.
  374 |    */
  375 |   message DataOverlayGroup {
  376 |     uint64 fragment_id = 1;
  377 |     /* Each DataOverlayFile.committed_version is left 0 by the writer and stamped
  378 |      * to the new dataset version at commit time (re-stamped on retry), in the
  379 |      * same way as the created-at / last-updated-at version sequences. The fields
  380 |      * touched are read from each overlay's `data_file.fields`.
  381 |      */
  382 |     repeated DataOverlayFile overlays = 2;
  383 |   }
  384 | 
  385 |   /* Attach overlay files to fragments, supplying new values for a subset of
  386 |    * (row offset, field) cells without rewriting the fragments' base data files.
  387 |    * See the DataOverlayFile message in table.proto for resolution, coverage, and
  388 |    * versioning rules, and the Data Overlay Files and Transactions specifications
  389 |    * for the (intentionally permissive) conflict semantics.
  390 |    */
  391 |   message DataOverlay {
  392 |     repeated DataOverlayGroup groups = 1;
  393 |   }
  394 | 
  395 |   /* Update SSTable compaction progress in the MemWAL index.
  396 |    * This operation is used during merge-insert to atomically record which
  397 |    * SSTables have been compacted into the base table.
  398 |    */
  399 |   message UpdateMemWalState {
  400 |     // SSTables being marked as compacted.
  401 |     repeated CompactedSsTable compacted_sstables = 1;
  402 |   }
  403 | 
  404 |   // An operation that updates base paths in the dataset.
  405 |   message UpdateBases {
  406 |     // The new base paths to add to the manifest.
  407 |     repeated BasePath new_bases = 1;
  408 |   }
  409 | 
  410 |   // The operation of this transaction.
  411 |   oneof operation {
  412 |     Append append = 100;
  413 |     Delete delete = 101;
  414 |     Overwrite overwrite = 102;
  415 |     CreateIndex create_index = 103;
  416 |     Rewrite rewrite = 104;
  417 |     Merge merge = 105;
  418 |     Restore restore = 106;
  419 |     ReserveFragments reserve_fragments = 107;
  420 |     Update update = 108;
  421 |     Project project = 109;
  422 |     UpdateConfig update_config = 110;
  423 |     DataReplacement data_replacement = 111;
  424 |     UpdateMemWalState update_mem_wal_state = 112;
  425 |     Clone clone = 113;
  426 |     UpdateBases update_bases = 114;
  427 |     DataOverlay data_overlay = 115;
  428 |   }
  429 | 
  430 |   // Fields 200/202 (`blob_append` / `blob_overwrite`) previously represented blob dataset ops.
  431 |   reserved 200, 202;
  432 |   reserved "blob_append", "blob_overwrite";
  433 | }
``````
