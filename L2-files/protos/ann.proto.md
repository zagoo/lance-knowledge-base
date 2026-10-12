> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# protos/ann.proto

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `56a38866d930a40cbdfc3729519ceebdee7becf47163d2960b571236b05b5011`. Reviewed physical lines: 1-98.

[Module](../../L1-modules/protos.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Behavior contracts](../../L3-symbols/behavior-contracts.md) · [Format](../../L3-symbols/format-spec.md) · [Entry](../../README.md)

## Role and visibility

Public ANN execution-wire contracts in lance.pb for vector query parameters and IVF routing/search execution nodes. Imports connect dataset identity, table index metadata, and index metric types; the file contains no execution logic. (protos/ann.proto:1-98)

## Complete range analysis

### Lines 1-11

The license, proto3 syntax, and lance.pb package are followed by table_identifier.proto, table.proto, and index.proto imports. These provide the fully qualified external types used below; blank lines separate declarations. (protos/ann.proto:1-11)

### Lines 12-27

VectorApproxMode defines Normal=0 (all RQ bits, u8 lookup tables), Fast=1 (one RQ bit even for a multibit index), and Accurate=2 (all RQ bits, u16 lookup tables to reduce estimator quantization error). The documented effect is restricted to RQ-quantized indices such as IVF_RQ; other index types ignore it. Normal is the zero-valued wire enum variant, not an independently verified application default. (protos/ann.proto:12-27)

### Lines 28-42

CoveringProjection wraps repeated int32 field_ids tag 1. Its message presence represents three states that an unwrapped repeated field could not preserve: absent means no narrowing computed and all declared covering columns materialized; present-empty means no covering values; present-nonempty means exactly the selected dataset field IDs. Replacing it with a bare list would conflate absent and empty. (protos/ann.proto:28-42)

### Lines 43-59

VectorQueryProto carries Arrow IPC query-vector bytes tag 1 (the comment explicitly allows Float16/32/64 and UInt8 among others), column tag 2, k tag 3, optional float lower/upper bounds tags 4/5, optional uint32 minimum/maximum probes 6/7, ef 8, refine_factor 9, optional VectorMetricType 10, bool use_index 11, optional float dist_q_c 12, and optional int32 query_parallelism 13. Absent metric means use the index default. Numeric valid ranges, bound inclusivity, and dist_q_c semantics are not defined here; the declarations do not validate them. (protos/ann.proto:43-59)

### Lines 60-72

approx_mode tag 14 carries the RQ policy. CoveringProjection tag 15 carries the planner's projection across the wire; otherwise the executor may produce a wider output schema than the surrounding physical nodes expect. Presence must be preserved through codecs to retain the three projection states. (protos/ann.proto:60-72)

### Lines 73-92

ANNIvfSubIndexExecProto serializes query tag 1, TableIdentifier tag 2, repeated lance.table.IndexMetadata indices tag 3, and prefilter_type tag 4. Nested PreFilterType is NONE=0, FILTERED_ROW_IDS=1, SCALAR_INDEX_QUERY=2. DataFusion codecs carry the actual prefilter child plan through children()/with_new_children(); this enum selects the PreFilterSource reconstruction variant. The child must not be mistaken for embedded protobuf bytes in this message. (protos/ann.proto:73-92)

### Lines 93-98

ANNIvfPartitionExecProto is the IVF centroid routing node's serialized form: query tag 1, TableIdentifier tag 2, repeated string index_uuids tag 3. It carries UUID strings rather than the IndexMetadata list of the sub-index node. No child plan field or extra routing algorithm is declared. (protos/ann.proto:93-98)

## Interaction and interpretation limits

The schema identifies DataFusion codec responsibilities but does not implement them (protos/ann.proto:73-90). Threading, cancellation, actual search bounds, unknown-enum errors, and generated-language API signatures remain implementation-layer work. The covering schema mismatch risk is explicitly documented (protos/ann.proto:64-70).

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | syntax = "proto3";
    5 | 
    6 | package lance.pb;
    7 | 
    8 | import "table_identifier.proto";
    9 | import "table.proto";
   10 | import "index.proto";
   11 | 
   12 | /* Query-time approximation mode for vector search.
   13 |  *
   14 |  * This currently only affects RQ-quantized vector indexes, such as IVF_RQ.
   15 |  * Other index types ignore this setting.
   16 |  */
   17 | enum VectorApproxMode {
   18 |   // Use all RQ bits for query-time scoring with u8-quantized lookup tables.
   19 |   Normal = 0;
   20 |   // Use only one RQ bit for query-time scoring, even for multi-bit indexes.
   21 |   Fast = 1;
   22 |   /* Use all RQ bits for query-time scoring with u16-quantized lookup tables
   23 |    * to reduce estimator quantization error.
   24 |    */
   25 |   Accurate = 2;
   26 | }
   27 | 
   28 | /* The covering ("included") index columns a query needs materialized, as dataset
   29 |  * field ids.
   30 |  *
   31 |  * Exists as a message rather than a bare `repeated int32` because proto3 has no
   32 |  * presence tracking for repeated fields, and the empty list is a distinct, meaningful
   33 |  * state here:
   34 |  *
   35 |  * * absent: no narrowing computed; materialize every covering column declared.
   36 |  * * present and empty: materialize nothing, though the index does declare covering.
   37 |  * * present and non-empty: materialize exactly these.
   38 |  */
   39 | message CoveringProjection {
   40 |   repeated int32 field_ids = 1;
   41 | }
   42 | 
   43 | // Serialized vector query parameters.
   44 | message VectorQueryProto {
   45 |   // Query vector as Arrow IPC bytes (supports Float16, Float32, Float64, UInt8, etc.)
   46 |   bytes query_vector_arrow_ipc = 1;
   47 |   string column = 2;
   48 |   uint32 k = 3;
   49 |   optional float lower_bound = 4;
   50 |   optional float upper_bound = 5;
   51 |   optional uint32 minimum_nprobes = 6;
   52 |   optional uint32 maximum_nprobes = 7;
   53 |   optional uint32 ef = 8;
   54 |   optional uint32 refine_factor = 9;
   55 |   // Distance metric type. Absent means None (use the index's default metric).
   56 |   optional lance.index.pb.VectorMetricType metric_type = 10;
   57 |   bool use_index = 11;
   58 |   optional float dist_q_c = 12;
   59 |   optional int32 query_parallelism = 13;
   60 |   /* Query-time approximation mode. Currently only affects RQ-quantized vector
   61 |    * indexes, such as IVF_RQ. Other index types ignore this setting.
   62 |    */
   63 |   VectorApproxMode approx_mode = 14;
   64 |   /* Which covering columns the index must materialize for this query. Absent means
   65 |    * "not computed" -- see CoveringProjection. Carried across the wire so a remote
   66 |    * executor declares the same search output schema the planner did; without it the
   67 |    * executor's node is wider than the plan it came from, and the surrounding nodes
   68 |    * were built against the planner's narrower schema.
   69 |    */
   70 |   CoveringProjection covering_projection = 15;
   71 | }
   72 | 
   73 | /* Serializable form of ANNIvfSubIndexExec — the IVF sub-index search node.
   74 |  *
   75 |  * The prefilter child ExecutionPlan is serialized by DataFusion's codec
   76 |  * automatically via children() / with_new_children(). The prefilter_type
   77 |  * field tells the decoder which PreFilterSource variant to use when
   78 |  * reconstructing from the deserialized child inputs.
   79 |  */
   80 | message ANNIvfSubIndexExecProto {
   81 |   enum PreFilterType {
   82 |     NONE = 0;
   83 |     FILTERED_ROW_IDS = 1;
   84 |     SCALAR_INDEX_QUERY = 2;
   85 |   }
   86 | 
   87 |   VectorQueryProto query = 1;
   88 |   lance.datafusion.TableIdentifier table = 2;
   89 |   repeated lance.table.IndexMetadata indices = 3;
   90 |   PreFilterType prefilter_type = 4;
   91 | }
   92 | 
   93 | // Serializable form of ANNIvfPartitionExec — the IVF centroid routing node.
   94 | message ANNIvfPartitionExecProto {
   95 |   VectorQueryProto query = 1;
   96 |   lance.datafusion.TableIdentifier table = 2;
   97 |   repeated string index_uuids = 3;
   98 | }
``````
