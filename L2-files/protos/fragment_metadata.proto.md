> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen. Refresh 2026-10-12: [current coordinates and changed contracts](../../refresh-addenda/2026-10-12-011953c2.md) at `011953c22097b67b699595adbe99e7f0155d83e4` supersede affected historical statements; body remains frozen.

# protos/fragment_metadata.proto

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `9256862741d6d588c2f33fbda678dfde8a1ab634ecda8fc130411dec5e7482c0`. Reviewed physical lines: 1-455.

[Module](../../L1-modules/protos.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Behavior contracts](../../L3-symbols/behavior-contracts.md) · [Format](../../L3-symbols/format-spec.md) · [Entry](../../README.md)

## Role and visibility

Public lance.table persisted metadata contracts for fragments, data/overlay/deletion files, row lineage, and fragment-tree routing and mutations. It defines state and ordering rules, with no executable mutation or reader implementation. (protos/fragment_metadata.proto:1-455)

## Complete range analysis

### Lines 1-7

SPDX license and ownership, proto3 syntax, and lance.table package establish the schema without imports. (protos/fragment_metadata.proto:1-7)

### Lines 8-33

DataFragment groups column files for the same rows. Missing schema columns within a fragment read as all-null. id=1 is dataset-unique, files=2 is the file list, deletion_file=3 identifies tombstones, and overlays=11 must be empty unless manifest flag 64 is set. The overlay list is ordered: later entries win ties in committed_version for the same cell. The inline-tombstone bitmap question is a TODO, not an implemented arm. (protos/fragment_metadata.proto:8-33)

### Lines 34-53

row_id_sequence holds serialized RowIdSequence bytes inline_row_ids=5, or an empty RowLineageColumn marker column_row_ids=12 referring to a file field -3. Row IDs follow physical row order, including unsorted example [1,42,3]. The comments say current writers keep inline bytes regardless of size. Any column arm requires manifest spilled-lineage flag 2048; otherwise an older reader could see an unset oneof and falsely infer no row IDs. This is a schema contract; current writer behavior still needs source confirmation. Empty marker declaration: protos/fragment_metadata.proto:288-305. (protos/fragment_metadata.proto:34-53)

### Lines 54-73

last_updated_at_version_sequence uses inline bytes=7 or column marker=13 with reserved field ID -5. created_at_version_sequence uses inline bytes=9 or marker=14 with field ID -4. Both comments say current writers store inline regardless of size, and both column variants share the 2048 gate. Shared feature-bit requirement: protos/fragment_metadata.proto:43-51. (protos/fragment_metadata.proto:54-73)

### Lines 74-89

Former external byte-range arms reserve numeric tags 6,8,10 and the three external_* names. The comment says no Lance writer ever emitted them and column arms replaced the design; do not interpret these reservations as readable active fields. physical_rows=4 counts original rows including deleted rows; logical count subtracts deletion_file.num_deleted_rows. (protos/fragment_metadata.proto:74-89)

### Lines 90-125

DataFile.path=1 is dataset-relative. fields=2 lists signed field IDs: in-memory -1 is unassigned and must not persist; -2 is tombstoned; all negatives are reserved system values rather than schema fields and projection skips them, including -3/-4/-5 lineage IDs. The v1 comment assigns IDs by file position plus existing maximum and counts nested struct/list fields but one ID for a fixed-size list; v1 IDs are sorted but need not be contiguous. For v2 the field ID cannot determine the physical column because encoding choices change column count, so use column_indices. The example's wording about second fragments versus files is retained as a comment-level account, not confirmed allocator behavior. (protos/fragment_metadata.proto:90-125)

### Lines 126-170

column_indices=3 is empty for v1, otherwise parallels fields exactly. -1 marks a field without its own top-level column; every other column index must be unique. The packed-struct/list/FSL example maps nine fields to [0,-1,-1,1,3,4,5,6,7], illustrating packed children and optional FSL structural columns. file_major_version=4 and file_minor_version=5 record file version; both zero identify historical 0.1 or 0.2 and do not uniquely choose one. (protos/fragment_metadata.proto:126-170)

### Lines 171-184

file_size_bytes=6 supplies known disk length for fast footer lookup; zero means unknown rather than a known empty file. Optional base_id=7 refers to Manifest.base_paths for imported/referenced files. Presence must survive serialization; this declaration does not fully define absence resolution. (protos/fragment_metadata.proto:171-184)

### Lines 185-221

DataOverlayFile stores replacement cell values without rewriting base files. Consult overlays newest to oldest, falling through to base when absent; deletions take precedence and suppress overlay values. data_file=1 contains one value column per declared field, no row-offset key column. Value position equals the count of coverage bits below the physical offset (zero-based rank), and columns can differ in length. coverage selects shared_offset_bitmap bytes=2 (32-bit Roaring offsets shared by every field) or FieldCoverage=4 (independent field offsets). Dense UPDATE and sparse MERGE are motivating examples, not different file types. (protos/fragment_metadata.proto:185-221)

### Lines 222-239

committed_version=3 is the commit that made the overlay effective, not its read version. It is stamped at commit and restamped on retry. An index built at dataset_version >= committed_version incorporates the overlay; an older index must exclude affected cells for those fields and reevaluate current values. Greater committed_version wins across overlays; equal versions use later DataFragment.overlays position. Incorrect stamping or sorting changes query results. (protos/fragment_metadata.proto:222-239)

### Lines 240-250

FieldCoverage.offset_bitmaps=1 is a repeated bytes list with one 32-bit Roaring bitmap per data_file.fields entry in the same order. A present offset whose value is NULL overrides to NULL; an absent offset falls through to base. A sparse NULL update must not be encoded by simply omitting the offset. (protos/fragment_metadata.proto:240-250)

### Lines 251-287

DeletionFile path is {root}/_deletions/{fragment_id}-{read_version}-{id}.{extension}. Nested DeletionFileType is ARROW_ARRAY=0 or BITMAP=1. Schema comments describe one Arrow IPC batch with an Int32Array column and .arrow, or Roaring bitmap and .bin. The current Rust implementation instead requires row_id:UInt32; this source/comment discrepancy is explicit in rust/lance-table/src/io/deletion.rs:25-34 and rust/lance-table/src/io/deletion.rs:162-195. Comments motivate sparse versus dense selection but provide no threshold. Fields are file_type=1, read_version=2, concurrent-writer differentiating id=3, num_deleted_rows=4, and optional base_id=7 for Manifest.base_paths. Deletions operate on offsets, not stable logical IDs. (protos/fragment_metadata.proto:251-287)

### Lines 288-306

RowLineageColumn is an empty marker. Exactly one DataFragment.files entry carries the relevant reserved field ID (-3 row ID, -4 creation version, -5 update version), and its column_indices identifies the column. It may share a data file or be separate; values are non-null uint64, exactly physical_rows long in physical order. Only v2 data files support this mapping; v1 datasets keep sequences inline. Metadata is stored once in files, not repeated in the marker. (protos/fragment_metadata.proto:288-306)

### Lines 307-323

ExternalFile is a table-relative path=1 plus byte offset=2 and size=3, documented for fragment reuse index details rather than the removed external lineage arms. FragmentTreeMetadata.layout currently has one tree=1 alternative; it selects the fragment storage layout. Removed external lineage arms: protos/fragment_metadata.proto:74-81. (protos/fragment_metadata.proto:307-323)

### Lines 324-349

FragmentTree selects inline_root=1 or root_uuid bytes=2. UUID must be exactly 16 display-order bytes and resolves to _bt/root/{lowercase hyphenated UUID}.root under this dataset. mutations_since_root=3 carries mutations absent from that root; next_action_sequence=4 is the next unused sequence for this version. FragmentTreeRoot stores children=1, buffer=2, and next_action_sequence=3 meaning the first action not represented by the root. Confusing root and version watermarks risks replaying or skipping mutations. (protos/fragment_metadata.proto:324-349)

### Lines 350-391

FragmentTreeChild routing is ordered by min_key and owns [min_key,next min_key), with the final upper bound inherited. path=1 is relative to resolved dataset; optional base_id=2 inherits the containing object's dataset when absent and otherwise matches Manifest.base_paths, including valid ID zero. min_key=3 need not exist in the child. num_keys=4, total_rows=7, and visible_rows=10 include the object's buffered mutations; height=5 counts edges to leaves, num_children=6 direct children, both zero for leaves; object_size=8 is stored byte length. materialized_through_action_sequence=9 records a leaf's fully applied watermark with no qualifying mutations above it, zero meaning none; interiors must use zero. (protos/fragment_metadata.proto:350-391)

### Lines 392-406

FragmentTreeNode holds children=1 and buffered mutations=2. FragmentTreeMutation holds action_sequence=1, FragmentAction action=2, and signed after-minus-before aggregate deltas fragment_count_delta=3, total_rows_delta=4, visible_rows_delta=5. Signed deltas preserve removals and deletions; these are validated changes by contract, not validation code. (protos/fragment_metadata.proto:392-406)

### Lines 407-421

FragmentAction.action oneof selects complete upsert_fragment=1, remove_fragment ID=2, AddDataFile=3, RemoveDataFile=4, AddDeletionFile=5, ClearDeletionFile=6, or ReplaceDataFile=7. Upsert replaces the entire fragment and covers changes lacking narrower actions, including overlays, version sequences, and row IDs. Treating it as a partial patch would retain obsolete state. (protos/fragment_metadata.proto:407-421)

### Lines 422-442

AddDataFile(frag_id=1,file=2) appends to ordered files. RemoveDataFile(frag_id=1,path=2) removes every matching path while preserving order of others. AddDeletionFile(frag_id=1,deletion_file=2) and ClearDeletionFile(frag_id=1) carry deletion changes. Missing-fragment handling and validation errors are not specified here. (protos/fragment_metadata.proto:422-442)

### Lines 443-455

ReplaceDataFile carries frag_id=1, expected_path=2, path=3, file_size_bytes=4, optional base_id=5. Replace only the first expected-path match, changing path/size/base while retaining column mapping and file version. An absent base inherits the dataset resolved for the tree object or version manifest containing the mutation; present base matches Manifest.base_paths. This differs deliberately from RemoveDataFile's all-match rule. Supporting all-match rule: protos/fragment_metadata.proto:428-432. (protos/fragment_metadata.proto:443-455)

## Interaction and interpretation limits

This schema supplies file/tree state and explicit ordering invariants (protos/fragment_metadata.proto:8-455). It does not demonstrate actual reader/writer support, transaction conflict handling, tree balancing, mutation validation, or format stability of each feature. The inline-writer comments and column-arm definitions coexist; support must be traced rather than equating declared fields with emitted files (protos/fragment_metadata.proto:34-81).

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
    8 | /* A DataFragment is a set of files which represent the different columns of the same
    9 |  * rows. If column exists in the schema of a dataset, but the file for that column does
   10 |  * not exist within a DataFragment of that dataset, that column consists entirely of
   11 |  * nulls.
   12 |  */
   13 | message DataFragment {
   14 |   // The ID of a DataFragment is unique within a dataset.
   15 |   uint64 id = 1;
   16 | 
   17 |   repeated DataFile files = 2;
   18 | 
   19 |   /* Optional overlay files for this fragment, which supply new values for a
   20 |    * subset of cells without rewriting the base data files. This MUST be empty
   21 |    * if the data overlay files feature flag (64) is not set in the manifest.
   22 |    *
   23 |    * Order is significant: a later entry is newer than an earlier one. When two
   24 |    * overlays cover the same (offset, field) and share a `committed_version`, the
   25 |    * later entry wins. See DataOverlayFile for the full resolution rules.
   26 |    */
   27 |   repeated DataOverlayFile overlays = 11;
   28 | 
   29 |   // File that indicates which rows, if any, should be considered deleted.
   30 |   DeletionFile deletion_file = 3;
   31 | 
   32 |   // TODO: What's the simplest way we can allow an inline tombstone bitmap?
   33 | 
   34 |   /* A serialized RowIdSequence message (see rowids.proto).
   35 |    *
   36 |    * These are the row ids for the fragment, in order of the rows as they appear.
   37 |    * That is, if a fragment has 3 rows, and the row ids are [1, 42, 3], then the
   38 |    * first row is row 1, the second row is row 42, and the third row is row 3.
   39 |    */
   40 |   oneof row_id_sequence {
   41 |     // Current Lance writers store row ids inline regardless of encoded size.
   42 |     bytes inline_row_ids = 5;
   43 |     /* The row ids are a hidden column of one of this fragment's `files`: the
   44 |      * entry whose `fields` carries the reserved id -3. See RowLineageColumn.
   45 |      *
   46 |      * A writer MUST set the spilled row lineage feature flag (2048) when any
   47 |      * fragment uses this arm or either of the other column arms below. A
   48 |      * reader that does not understand the flag would see an unset oneof and
   49 |      * treat the fragment as having no row ids at all.
   50 |      */
   51 |     RowLineageColumn column_row_ids = 12;
   52 |   } // row_id_sequence
   53 | 
   54 |   oneof last_updated_at_version_sequence {
   55 |     // Current Lance writers store last-updated versions inline regardless of encoded size.
   56 |     bytes inline_last_updated_at_versions = 7;
   57 |     /* The versions are a hidden column of one of this fragment's `files`: the
   58 |      * entry whose `fields` carries the reserved id -5. Gated like
   59 |      * `column_row_ids`.
   60 |      */
   61 |     RowLineageColumn column_last_updated_at_versions = 13;
   62 |   } // last_updated_at_version_sequence
   63 | 
   64 |   oneof created_at_version_sequence {
   65 |     // Current Lance writers store created-at versions inline regardless of encoded size.
   66 |     bytes inline_created_at_versions = 9;
   67 |     /* The versions are a hidden column of one of this fragment's `files`: the
   68 |      * entry whose `fields` carries the reserved id -4. Gated like
   69 |      * `column_row_ids`.
   70 |      */
   71 |     RowLineageColumn column_created_at_versions = 14;
   72 |   } // created_at_version_sequence
   73 | 
   74 |   /* The `external_*` arms of the three sequence oneofs above: an opaque byte
   75 |    * range in a file, holding the same encoding as the inline arm. No Lance
   76 |    * writer ever emitted them; the column arms replace that design. Reserved so
   77 |    * a reader never has to interpret them.
   78 |    */
   79 |   reserved 6, 8, 10;
   80 |   reserved "external_row_ids", "external_last_updated_at_versions",
   81 |       "external_created_at_versions";
   82 | 
   83 |   /* Number of original rows in the fragment, this includes rows that are now marked with
   84 |    * deletion tombstones. To compute the current number of rows, subtract
   85 |    * `deletion_file.num_deleted_rows` from this value.
   86 |    */
   87 |   uint64 physical_rows = 4;
   88 | }
   89 | 
   90 | message DataFile {
   91 |   // Path to the root relative to the dataset's URI.
   92 |   string path = 1;
   93 |   /* The ids of the fields/columns in this file.
   94 |    *
   95 |    * When a DataFile object is created in memory, every value in fields is assigned -1 by
   96 |    * default. An object with a value in fields of -1 must not be stored to disk. -2 is
   97 |    * used for "tombstoned", meaning a field that is no longer in use. This is often
   98 |    * because the original field id was reassigned to a different data file.
   99 |    *
  100 |    * Every negative value is reserved for system use and never names a field of the
  101 |    * dataset schema. -3, -4 and -5 are the hidden row lineage columns (see
  102 |    * RowLineageColumn); a reader projecting the dataset schema onto a file skips
  103 |    * them, and any other negative value, rather than reject the file.
  104 |    *
  105 |    * In Lance v1 IDs are assigned based on position in the file, offset by the max
  106 |    * existing field id in the table (if any already). So when a fragment is first created
  107 |    * with one file of N columns, the field ids will be 1, 2, ..., N. If a second fragment
  108 |    * is created with M columns, the field ids will be N+1, N+2, ..., N+M.
  109 |    *
  110 |    * In Lance v1 there is one field for each field in the input schema, this includes
  111 |    * nested fields (both struct and list).  Fixed size list fields have only a single
  112 |    * field id (these are not considered nested fields in Lance v1).
  113 |    *
  114 |    * This allows column indices to be calculated from field IDs and the input schema.
  115 |    *
  116 |    * In Lance v2 the field IDs generally follow the same pattern but there is no
  117 |    * way to calculate the column index from the field ID.  This is because a given
  118 |    * field could be encoded in many different ways, some of which occupy a different
  119 |    * number of columns.  For example, a struct field could be encoded into N + 1 columns
  120 |    * or it could be encoded into a single packed column.  To determine column indices
  121 |    * the column_indices property should be used instead.
  122 |    *
  123 |    * In Lance v1 these ids must be sorted but might not always be contiguous.
  124 |    */
  125 |   repeated int32 fields = 2;
  126 |   /* The top-level column indices for each field in the file.
  127 |    *
  128 |    * If the data file is version 1 then this property will be empty
  129 |    *
  130 |    * Otherwise there must be one entry for each field in `fields`.
  131 |    *
  132 |    * Some fields may not correspond to a top-level column in the file.  In these cases
  133 |    * the index will -1.
  134 |    *
  135 |    * For example, consider the schema:
  136 |    *
  137 |    * - dimension: packed-struct (0):
  138 |    *   - x: u32 (1)
  139 |    *   - y: u32 (2)
  140 |    * - path: `list<u32>` (3)
  141 |    * - embedding: `fsl<768>` (4)
  142 |    *   - fp64
  143 |    * - borders: `fsl<4>` (5)
  144 |    *   - simple-struct (6)
  145 |    *     - margin: fp64 (7)
  146 |    *     - padding: fp64 (8)
  147 |    *
  148 |    * One possible column indices array could be:
  149 |    * [0, -1, -1, 1, 3, 4, 5, 6, 7]
  150 |    *
  151 |    * This reflects quite a few phenomenon:
  152 |    * - The packed struct is encoded into a single column and there is no top-level column
  153 |    *   for the x or y fields
  154 |    * - The variable sized list is encoded into two columns
  155 |    * - The embedding is encoded into a single column (common for FSL of primitive) and there
  156 |    *   is not "FSL column"
  157 |    * - The borders field actually does have an "FSL column"
  158 |    *
  159 |    * The column indices table may not have duplicates (other than -1)
  160 |    */
  161 |   repeated int32 column_indices = 3;
  162 |   // The major file version used to create the file
  163 |   uint32 file_major_version = 4;
  164 |   /* The minor file version used to create the file
  165 |    *
  166 |    * If both `file_major_version` and `file_minor_version` are set to 0,
  167 |    * then this is a version 0.1 or version 0.2 file.
  168 |    */
  169 |   uint32 file_minor_version = 5;
  170 | 
  171 |   /* The known size of the file on disk in bytes.
  172 |    *
  173 |    * This is used to quickly find the footer of the file.
  174 |    *
  175 |    * When this is zero, it should be interpreted as "unknown".
  176 |    */
  177 |   uint64 file_size_bytes = 6;
  178 | 
  179 |   /* The base path index of the data file. Used when the file is imported or referred from another dataset.
  180 |    * Lance use it as key of the base_paths field in Manifest to determine the actual base path of the data file.
  181 |    */
  182 |   optional uint32 base_id = 7;
  183 | } // DataFile
  184 | 
  185 | /* An overlay file supplies new values for a subset of (row offset, field) cells
  186 |  * within a fragment, without rewriting the fragment's base data files. It is
  187 |  * used for efficient updates when only a small fraction of rows and/or columns
  188 |  * change.
  189 |  *
  190 |  * On read, a cell is resolved by consulting the fragment's overlays from newest
  191 |  * to oldest: the first overlay that covers that (offset, field) wins; if none
  192 |  * cover it, the value falls through to the base data file. Because deletions
  193 |  * take precedence over overlays, an overlay value for an offset that is also
  194 |  * marked deleted is dead and is ignored.
  195 |  *
  196 |  * The overlay's data file does NOT store a row-offset key column. Within a value
  197 |  * column, the position of a covered offset's value is the rank (0-based count of
  198 |  * set bits below it) of that offset within the field's coverage bitmap. Because
  199 |  * fields may cover different offset sets, the value columns of a single overlay
  200 |  * data file may have different lengths (which the Lance file format permits).
  201 |  */
  202 | message DataOverlayFile {
  203 |   /* The data file storing the overlay's new cell values, one value column per
  204 |    * field in `data_file.fields`. No row-offset key column is stored.
  205 |    */
  206 |   DataFile data_file = 1;
  207 | 
  208 |   // Which (offset, field) cells this overlay provides values for.
  209 |   oneof coverage {
  210 |     /* A single 32-bit Roaring bitmap of physical row offsets that applies to
  211 |      * every field in `data_file.fields` (a "dense" / rectangular overlay).
  212 |      * Every covered offset has a value for every field. This is the common case
  213 |      * for a plain UPDATE, where one SET list is applied to one set of rows.
  214 |      */
  215 |     bytes shared_offset_bitmap = 2;
  216 |     /* Per-field coverage for a "sparse" overlay, used when different fields cover
  217 |      * different offset sets (e.g. a MERGE with multiple WHEN MATCHED branches).
  218 |      */
  219 |     FieldCoverage field_coverage = 4;
  220 |   }
  221 | 
  222 |   /* The dataset version at which this overlay became effective: the version of
  223 |    * the commit that introduced it, NOT the version it was read from. It is
  224 |    * stamped at commit time and re-stamped if the commit is retried, in the same
  225 |    * way as the created-at / last-updated-at version sequences.
  226 |    *
  227 |    * This drives two orderings:
  228 |    *  * Versus index builds: an index whose `dataset_version` >= this value
  229 |    *    already incorporates this overlay. Otherwise the overlay's covered cells
  230 |    *    are excluded from index results for the affected fields and re-evaluated
  231 |    *    against their current values (see the Data Overlay Files specification).
  232 |    *  * Versus other overlays: when two overlays cover the same (offset, field),
  233 |    *    the one with the higher `committed_version` wins. Overlays that share a
  234 |    *    `committed_version` are ordered by their position in
  235 |    *    `DataFragment.overlays`, where a later entry is newer and wins.
  236 |    */
  237 |   uint64 committed_version = 3;
  238 | }
  239 | 
  240 | // Per-field coverage for a sparse overlay.
  241 | message FieldCoverage {
  242 |   /* One entry per field in the overlay's `data_file.fields`, in the same order.
  243 |    * Each is a 32-bit Roaring bitmap of the physical row offsets covered for that
  244 |    * field. An offset present in a field's bitmap but mapped to a NULL value
  245 |    * means the cell is overridden to NULL (distinct from an offset that is absent,
  246 |    * which falls through to the base data file).
  247 |    */
  248 |   repeated bytes offset_bitmaps = 1;
  249 | }
  250 | 
  251 | /* Deletion File
  252 |  *
  253 |  * The path of the deletion file is constructed as:
  254 |  *   {root}/_deletions/{fragment_id}-{read_version}-{id}.{extension}
  255 |  * where {extension} depends on DeletionFileType.
  256 |  */
  257 | message DeletionFile {
  258 |   /* Type of deletion file, intended as a way to increase efficiency of the storage of deleted row
  259 |    * offsets. If there are sparsely deleted rows, then ARROW_ARRAY is the most efficient. If there
  260 |    * are densely deleted rows, then BITMAP is the most efficient.
  261 |    */
  262 |   enum DeletionFileType {
  263 |     /* A single Int32Array of deleted row offsets, stored as an Arrow IPC file with one batch and
  264 |      * one column. Has a .arrow extension.
  265 |      */
  266 |     ARROW_ARRAY = 0;
  267 |     // A Roaring Bitmap of deleted row offsets. Has a .bin extension.
  268 |     BITMAP = 1;
  269 |   }
  270 | 
  271 |   // Type of deletion file.
  272 |   DeletionFileType file_type = 1;
  273 |   // The version of the dataset this deletion file was built from.
  274 |   uint64 read_version = 2;
  275 |   /* An opaque id used to differentiate this file from others written by concurrent
  276 |    * writers.
  277 |    */
  278 |   uint64 id = 3;
  279 |   // The number of rows that are marked as deleted.
  280 |   uint64 num_deleted_rows = 4;
  281 |   /* The base path index of the deletion file. Used when the file is imported or referred from another
  282 |    * dataset. Lance uses it as key of the base_paths field in Manifest to determine the actual base
  283 |    * path of the deletion file.
  284 |    */
  285 |   optional uint32 base_id = 7;
  286 | } // DeletionFile
  287 | 
  288 | /* Marks a row lineage sequence that is stored as a hidden column of one of the
  289 |  * fragment's `files` rather than inline: `_rowid` under the reserved field id
  290 |  * -3, `_row_created_at_version` under -4, `_row_last_updated_at_version` under
  291 |  * -5. Exactly one entry of `DataFragment.files` carries that id in its
  292 |  * `fields`, and its `column_indices` locates the column the way it does for a
  293 |  * user column, so the column may share a file with the user columns or with the
  294 |  * other lineage columns, or sit in a file that holds nothing else. The column is
  295 |  * a non-nullable uint64 with exactly `physical_rows` values, in physical row
  296 |  * order; see the table format documentation for the schema.
  297 |  *
  298 |  * Carries no fields: the file is found by its field id, so the file's metadata
  299 |  * lives in `files` alone.
  300 |  *
  301 |  * Valid only in a fragment whose data files are Lance v2 files. A legacy v1
  302 |  * data file has no `column_indices` to locate the column by, so a writer on a
  303 |  * dataset that stores v1 files leaves every sequence inline.
  304 |  */
  305 | message RowLineageColumn {}
  306 | 
  307 | // A byte range of a file. Used by the fragment reuse index details.
  308 | message ExternalFile {
  309 |   // Path to the file, relative to the root of the table.
  310 |   string path = 1;
  311 |   // The byte offset in the file where the data starts.
  312 |   uint64 offset = 2;
  313 |   // The size of the data in the file, in bytes.
  314 |   uint64 size = 3;
  315 | }
  316 | 
  317 | // Fragment storage layout for this version.
  318 | message FragmentTreeMetadata {
  319 |   oneof layout {
  320 |     FragmentTree tree = 1;
  321 |   }
  322 | }
  323 | 
  324 | // Fragment state for one Version Manifest.
  325 | message FragmentTree {
  326 |   oneof root {
  327 |     FragmentTreeRoot inline_root = 1;
  328 |     /* Exactly 16 UUID bytes in display order. Resolves under this dataset as
  329 |      * _bt/root/{lowercase hyphenated UUID}.root.
  330 |      */
  331 |     bytes root_uuid = 2;
  332 |   }
  333 | 
  334 |   // Mutations not represented by the selected root.
  335 |   repeated FragmentTreeMutation mutations_since_root = 3;
  336 | 
  337 |   // Next unused action sequence for this version.
  338 |   uint64 next_action_sequence = 4;
  339 | }
  340 | 
  341 | // Inline or external root state.
  342 | message FragmentTreeRoot {
  343 |   repeated FragmentTreeChild children = 1;
  344 |   repeated FragmentTreeMutation buffer = 2;
  345 | 
  346 |   // First action sequence not represented by this root.
  347 |   uint64 next_action_sequence = 3;
  348 | }
  349 | 
  350 | /* Children are ordered by min_key. A child owns [min_key, next min_key);
  351 |  * the last child inherits its parent's upper bound.
  352 |  */
  353 | message FragmentTreeChild {
  354 |   // Tree object path relative to its resolved dataset.
  355 |   string path = 1;
  356 | 
  357 |   /* Absent inherits the containing object's dataset. Otherwise matches BasePath.id
  358 |    * in Manifest.base_paths; zero is a valid ID.
  359 |    */
  360 |   optional uint32 base_id = 2;
  361 | 
  362 |   /* Inclusive lower bound of this child's fragment-ID range. It need not
  363 |    * equal an ID currently stored in the child.
  364 |    */
  365 |   uint64 min_key = 3;
  366 | 
  367 |   // Fragment count in this subtree, including this object's buffer.
  368 |   uint64 num_keys = 4;
  369 | 
  370 |   // Edges from this object to its leaves. Zero for a leaf.
  371 |   uint32 height = 5;
  372 | 
  373 |   // Direct child count. Zero for a leaf.
  374 |   uint32 num_children = 6;
  375 | 
  376 |   // Physical rows in this subtree, including this object's buffer.
  377 |   uint64 total_rows = 7;
  378 | 
  379 |   // Stored byte length of the child object.
  380 |   uint64 object_size = 8;
  381 | 
  382 |   /* Every mutation for this leaf's range at or below this value has been
  383 |    * applied, and none remain buffered above it. Zero means none. Must be 0
  384 |    * for interiors.
  385 |    */
  386 |   uint64 materialized_through_action_sequence = 9;
  387 | 
  388 |   // Visible rows in this subtree, including this object's buffer.
  389 |   uint64 visible_rows = 10;
  390 | }
  391 | 
  392 | // Interior routing node.
  393 | message FragmentTreeNode {
  394 |   repeated FragmentTreeChild children = 1;
  395 |   repeated FragmentTreeMutation buffer = 2;
  396 | }
  397 | 
  398 | // Validated mutation with exact after-minus-before aggregate deltas.
  399 | message FragmentTreeMutation {
  400 |   uint64 action_sequence = 1;
  401 |   FragmentAction action = 2;
  402 |   sint64 fragment_count_delta = 3;
  403 |   sint64 total_rows_delta = 4;
  404 |   sint64 visible_rows_delta = 5;
  405 | }
  406 | 
  407 | /* upsert_fragment replaces the complete record. Use it for changes that other
  408 |  * actions cannot express, including overlays, version sequences, and row IDs.
  409 |  */
  410 | message FragmentAction {
  411 |   oneof action {
  412 |     DataFragment upsert_fragment = 1;
  413 |     uint64 remove_fragment = 2;
  414 |     AddDataFile add_data_file = 3;
  415 |     RemoveDataFile remove_data_file = 4;
  416 |     AddDeletionFile add_deletion_file = 5;
  417 |     ClearDeletionFile clear_deletion_file = 6;
  418 |     ReplaceDataFile replace_data_file = 7;
  419 |   }
  420 | }
  421 | 
  422 | // Append to the ordered file list.
  423 | message AddDataFile {
  424 |   uint64 frag_id = 1;
  425 |   DataFile file = 2;
  426 | }
  427 | 
  428 | // Remove every matching path, preserving order.
  429 | message RemoveDataFile {
  430 |   uint64 frag_id = 1;
  431 |   string path = 2;
  432 | }
  433 | 
  434 | message AddDeletionFile {
  435 |   uint64 frag_id = 1;
  436 |   DeletionFile deletion_file = 2;
  437 | }
  438 | 
  439 | message ClearDeletionFile {
  440 |   uint64 frag_id = 1;
  441 | }
  442 | 
  443 | /* On the first expected_path match, replace path, file_size_bytes, and base_id.
  444 |  * Preserve its column mapping and file version.
  445 |  */
  446 | message ReplaceDataFile {
  447 |   uint64 frag_id = 1;
  448 |   string expected_path = 2;
  449 |   string path = 3;
  450 |   uint64 file_size_bytes = 4;
  451 |   /* Absent inherits the resolved dataset of the tree object or Version Manifest
  452 |    * containing this mutation. Otherwise matches BasePath.id in Manifest.base_paths.
  453 |    */
  454 |   optional uint32 base_id = 5;
  455 | }
``````
