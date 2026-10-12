> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# protos/filtered_read.proto

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `36132a7bc711707f7615f9ce5c2f6f2be237669b476fd723da5e13a34cd09fbb`. Reviewed physical lines: 1-116.

[Module](../../L1-modules/protos.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Behavior contracts](../../L3-symbols/behavior-contracts.md) · [Format](../../L3-symbols/format-spec.md) · [Entry](../../README.md)

## Role and visibility

Public lance.datafusion execution-wire schema for filtered reads, projection, blob materialization, threading, and precomputed distributed read plans. All declarations are data contracts; there is no executable scheduler or decoder here. (protos/filtered_read.proto:1-116)

## Complete range analysis

### Lines 1-14

License, proto3, lance.datafusion, and table_identifier.proto import establish the envelope. U64Range has uint64 start=1 and end=2. This file does not state whether its endpoint is exclusive; that must be checked in conversions rather than inferred from the field names. (protos/filtered_read.proto:1-14)

### Lines 15-23

ProjectionProto carries repeated int32 field_ids=1 and independent bool flags with_row_id=2, with_row_addr=3, with_row_last_updated_at_version=4, with_row_created_at_version=5, plus BlobHandlingProto blob_handling=6. Row identity, address, and version metadata are separate projection choices, not one combined switch. (protos/filtered_read.proto:15-23)

### Lines 24-42

BlobHandlingProto.mode is a oneof: all_binary=1 reads all blobs as binary; blobs_descriptions=2 uses descriptions for blobs and binary for other binary columns (commented default); all_descriptions=3 describes all binary columns; some_blobs_binary=4 materializes specified blobs while non-blob binary remains binary; some_binary=5 materializes selected binary columns and describes the rest. The first three variants are bool-tagged arms; the latter two use FieldIdSet with repeated uint32 field_ids=1. Selecting a oneof arm is semantically distinct from the boolean payload; actual rejection/handling of false markers is not specified. (protos/filtered_read.proto:24-42)

### Lines 43-49

FilteredReadThreadingModeProto.mode selects uint64 one_partition_multiple_threads=1 or multiple_partitions=2. The wire shape keeps these choices mutually exclusive. The precise interpretation and validation of their counts require the Rust threading-mode conversion. (protos/filtered_read.proto:43-49)

### Lines 50-64

FilteredReadOptionsProto has optional before/after filter ranges tags 1/2, with_deleted_rows=3, optional batch_size=4, optional fragment_readahead=5, repeated fragment_ids=6, projection=7, optional refine_filter_substrait=8 and full_filter_substrait=9 bytes, threading_mode=10, optional io_buffer_size_bytes=11, and optional filter_schema_ipc=12. The IPC filter schema may be wider than the output projection so omitted output columns can still participate in filter decoding. Defaults and semantics of an empty fragment list are not supplied by these declarations. (protos/filtered_read.proto:50-64)

### Lines 65-78

Optional materialization_readahead_bytes=13 is a nonzero byte bound on Blob v2 materialization reserved while awaiting ordered emission for one scanner execution. Admission follows output order; one oversized batch may exceed the budget only when no other batch is reserved. Absence means no independent Blob v2 materialization bound. Optional batch_size_bytes=14 adds a byte boundary alongside row-based batch_size and corresponds to FileReaderOptions.batch_size_bytes. Neither option is a universal hard cap on all memory, and the schema itself cannot enforce nonzero values. (protos/filtered_read.proto:65-78)

### Lines 79-98

FilteredReadPlanProto serializes RowAddrTreeMap through its own serialize_into/deserialize_from into bytes tag 1; optional after-filter range is tag 2 and matching encode-time filter IPC schema tag 3. fragment_filter_ids tag 4 maps uint32 fragment IDs to uint32 indices into repeated Substrait filter_expressions tag 5, deduplicating shared predicates. These values are list positions, not external predicate IDs; index validity must be checked by implementation. (protos/filtered_read.proto:79-98)

### Lines 99-116

FilteredReadExecProto stores TableIdentifier table=1, options=2, and optional plan=3. The documented distributed mode receives a planned FilteredReadPlan; local mode plans at execution. index_input is intentionally absent here: DataFusion PhysicalExtensionCodec traverses child plans using children()/with_new_children() and supplies decoded inputs to try_decode. Every child needs compatible codec handling. The TODO to implement Lance index-input codecs is a comment about intended work, not proof that the current implementation still lacks every codec. (protos/filtered_read.proto:99-116)

## Interaction and interpretation limits

Only wire contracts and comment-specified constraints are established (protos/filtered_read.proto:1-116). Decoder errors, default resolution, child counts, actual cancellation/backpressure, and whether the codec TODO is stale remain implementation checks. The schema is an execution wire contract rather than a persisted Lance format under protos/AGENTS.md:5-13.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | syntax = "proto3";
    5 | 
    6 | package lance.datafusion;
    7 | 
    8 | import "table_identifier.proto";
    9 | 
   10 | message U64Range {
   11 |   uint64 start = 1;
   12 |   uint64 end = 2;
   13 | }
   14 | 
   15 | message ProjectionProto {
   16 |   repeated int32 field_ids = 1;
   17 |   bool with_row_id = 2;
   18 |   bool with_row_addr = 3;
   19 |   bool with_row_last_updated_at_version = 4;
   20 |   bool with_row_created_at_version = 5;
   21 |   BlobHandlingProto blob_handling = 6;
   22 | }
   23 | 
   24 | message BlobHandlingProto {
   25 |   oneof mode {
   26 |     // All blobs read as binary
   27 |     bool all_binary = 1;
   28 |     // Blobs as descriptions, other binary as binary (default)
   29 |     bool blobs_descriptions = 2;
   30 |     // All binary columns as descriptions
   31 |     bool all_descriptions = 3;
   32 |     // Specific blobs read as binary, rest as descriptions (non-blob binary stays binary)
   33 |     FieldIdSet some_blobs_binary = 4;
   34 |     // Specific columns as binary, all other binary as descriptions
   35 |     FieldIdSet some_binary = 5;
   36 |   }
   37 | }
   38 | 
   39 | message FieldIdSet {
   40 |   repeated uint32 field_ids = 1;
   41 | }
   42 | 
   43 | message FilteredReadThreadingModeProto {
   44 |   oneof mode {
   45 |     uint64 one_partition_multiple_threads = 1;
   46 |     uint64 multiple_partitions = 2;
   47 |   }
   48 | }
   49 | 
   50 | // Serializable form of FilteredReadOptions.
   51 | message FilteredReadOptionsProto {
   52 |   optional U64Range scan_range_before_filter = 1;
   53 |   optional U64Range scan_range_after_filter = 2;
   54 |   bool with_deleted_rows = 3;
   55 |   optional uint32 batch_size = 4;
   56 |   optional uint64 fragment_readahead = 5;
   57 |   repeated uint64 fragment_ids = 6;
   58 |   ProjectionProto projection = 7;
   59 |   optional bytes refine_filter_substrait = 8;
   60 |   optional bytes full_filter_substrait = 9;
   61 |   FilteredReadThreadingModeProto threading_mode = 10;
   62 |   optional uint64 io_buffer_size_bytes = 11;
   63 |   // Arrow IPC schema for decoding Substrait filters (may be wider than projection).
   64 |   optional bytes filter_schema_ipc = 12;
   65 |   /* If present, a nonzero upper bound on bytes reserved by Blob v2
   66 |    * materialization awaiting ordered emission in one scanner execution.
   67 |    * Admission follows output order; one oversized output batch may exceed the
   68 |    * bound when no other batch is reserved. If absent, Blob v2 materialization
   69 |    * has no independent memory bound.
   70 |    */
   71 |   optional uint64 materialization_readahead_bytes = 13;
   72 |   /* If present, the scanner-level byte budget for output batches. When set,
   73 |    * the file reader uses it as an additional batch boundary alongside the
   74 |    * row-based batch_size. This corresponds to FileReaderOptions.batch_size_bytes.
   75 |    */
   76 |   optional uint64 batch_size_bytes = 14;
   77 | }
   78 | 
   79 | /* Serializable form of FilteredReadPlan (planned/distributed mode).
   80 |  * RowAddrTreeMap serialized via its built-in serialize_into/deserialize_from.
   81 |  * Per-fragment filters are Substrait-encoded and deduplicated.
   82 |  */
   83 | message FilteredReadPlanProto {
   84 |   bytes row_addr_tree_map = 1;
   85 |   optional U64Range scan_range_after_filter = 2;
   86 |   // Arrow IPC schema for decoding Substrait filters (matches the schema used at encode time).
   87 |   optional bytes filter_schema_ipc = 3;
   88 |   /* Per-fragment filter mapping. Key is fragment id, value is a list index into
   89 |    * filter_expressions. Multiple fragments can share the same list index when
   90 |    * they have the same filter, avoiding duplicate Substrait encoding.
   91 |    */
   92 |   map<uint32, uint32> fragment_filter_ids = 4;
   93 |   /* Deduplicated Substrait-encoded filter expressions. Each entry is referenced
   94 |    * by one or more values in fragment_filter_ids.
   95 |    */
   96 |   repeated bytes filter_expressions = 5;
   97 | }
   98 | 
   99 | // Top-level wrapper for FilteredReadExec serialization.
  100 | message FilteredReadExecProto {
  101 |   TableIdentifier table = 1;
  102 |   FilteredReadOptionsProto options = 2;
  103 |   /* FilteredRead has two modes
  104 |    * Plan-then-execute (distributed): The planner creates a FilteredReadPlan and sends it to a remote executor.
  105 |    * Plan-and-execute (local): The executor creates the plan itself at execution time.
  106 |    */
  107 |   optional FilteredReadPlanProto plan = 3;
  108 |   /* Note: FilteredReadExec.index_input (child ExecutionPlan) is NOT serialized here.
  109 |    * DataFusion's PhysicalExtensionCodec handles child plans automatically: it walks
  110 |    * the plan tree via children() / with_new_children(), serializes each node, and
  111 |    * passes deserialized children back as the `inputs` parameter in try_decode.
  112 |    * This means any ExecutionPlan in the tree (including index_input) must also
  113 |    * implement try_encode/try_decode in the PhysicalExtensionCodec.
  114 |    * TODO: implement serialize/deserialize for lance-specific index input ExecutionPlans.
  115 |    */
  116 | }
``````
