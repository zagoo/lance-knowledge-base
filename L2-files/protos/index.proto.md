> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../V21-PROTOCOL.md). Refresh 2026-10-09: [current coordinates and changed contracts](../../refresh-addenda/2026-10-09-db684d1f.md) at `db684d1f0726c00b6defb7963a604a7719e82b5a` supersede affected historical statements; body remains frozen.

# protos/index.proto

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `8fc11208687116ba529a5fa8a30ce0ed79c7b3319dd59023690f7d69843376c5`. Reviewed physical lines: 1-311.

[Module](../../L1-modules/protos.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Behavior contracts](../../L3-symbols/behavior-contracts.md) · [Format](../../L3-symbols/format-spec.md) · [Entry](../../README.md)

## Role and visibility

Public lance.index.pb protobuf contracts for vector metadata and current index detail extensions, including JSON, Bloom filter, R-tree, FM, and experimental MinHash LSH detail markers. Declaration here is not proof every index path is current or supported by every reader. (protos/index.proto:1-311)

## Complete range analysis

### Lines 1-16

License, proto3 and lance.index.pb precede Any and index_old.proto imports. IndexType declares only VECTOR=0; this enum is not an exhaustive list of all index kinds in the repository. (protos/index.proto:1-16)

### Lines 17-35

Index has unique dataset index name=1, repeated indexed column names=2, build dataset_version=3, IndexType=4, and implementation oneof VectorIndex vector_index=5. Its shape describes this metadata envelope, not the newer generic Any detail registry. (protos/index.proto:17-35)

### Lines 36-56

Tensor.DataType enumerates BFLOAT16=0, FLOAT16=1, FLOAT32=2, FLOAT64=3, UINT8=4, UINT16=5, UINT32=6, UINT64=7. Tensor carries data_type=1, repeated uint32 shape=2, bytes data=3. The comments define shape dimensions but not byte order, strides, validation, or memory alignment. (protos/index.proto:36-56)

### Lines 57-77

IVF metadata stores repeated float centroids=1 (deprecated in prose, with the actual protobuf deprecated option commented out), repeated uint64 partition offsets=2, repeated uint32 record lengths=3, Tensor centroids_tensor=4, and optional double KMeans loss=5. Centroid shape is num_partitions by dimension. Implementations must decide compatibility precedence; this schema does not say what happens if both centroid forms are populated. (protos/index.proto:57-77)

### Lines 78-95

PQ records num_bits=1, num_sub_vectors=2, dimension=3, repeated float codebook=4, and Tensor codebook_tensor=5. Both codebook descriptions require dimension times 2^num_bits scalar values. This is metadata, not the sub-vector layout or distance implementation; no legal-bit-range validation appears. (protos/index.proto:78-95)

### Lines 96-116

TransformType declares OPQ=0. Transform stores matrix file position=1, repeated uint32 shape [rows,cols]=2, and transform type=3. Flat is an empty marker. These encode stage descriptions without executing a transformation. (protos/index.proto:96-116)

### Lines 117-152

DiskAnn carries spec=1, filename=2, r=3, alpha=4, capital-L field L=5, and repeated graph entry IDs=6. The schema supplies parameter names but not the graph algorithm or numeric bounds. VectorIndexStage.stage selects Flat=1, IVF=2, PQ=3, Transform=4, or DiskAnn=5; retaining order in the surrounding repeated stage list is essential to represent a pipeline. Ordered pipeline example: protos/index.proto:176-184. (protos/index.proto:117-152)

### Lines 153-189

VectorMetricType declares L2=0, Cosine=1, Dot=2, Hamming=3. VectorIndex stores spec_version=1, dimension=2, repeated stages=3, metric_type=4; its example composes IVF then PQ with 8 bits and 16 subvectors. The enum names do not specify normalization or squared-versus-unsquared numeric outputs. (protos/index.proto:153-189)

### Lines 190-220

VectorIndexDetails is stored in manifest index_details. metric_type=1 chooses metric; target_partition_size=2 uses zero for unset; optional HnswParameters=3 indicates an HNSW layer. Nested ProductQuantization has num_bits=1 and num_sub_vectors=2; ScalarQuantization has num_bits=1; RabitQuantization has num_bits=1 and RotationType=2 with FAST=0, MATRIX=1; FlatCompression is empty and means stored unquantized vectors. (protos/index.proto:190-220)

### Lines 221-234

The compression oneof uses pq=4, sq=5, rq=6, flat=8; tag 7 is not declared or reserved in this text. runtime_hints string map=9 contains nonstructural build preferences, namespaced by reverse DNS. Unrecognized keys must be silently ignored by runtimes; making them structural would violate the comment's portability contract. (protos/index.proto:221-234)

### Lines 235-249

HnswParameters has max_connections=1 (M, outgoing-edge bound: more improves recall at memory/build cost), construction_ef=2 (dynamic candidate list size during construction), and max_level=3. Defaults, legality checks, and exact complexity are not given. (protos/index.proto:235-249)

### Lines 250-259

JsonIndexDetails stores JSON path string=1 and google.protobuf.Any target_details=2, allowing nested index-kind details. BloomFilterIndexDetails, RTreeIndexDetails, and FMIndexDetails are empty markers. Empty metadata messages do not imply empty index files or lack of implementation options. (protos/index.proto:250-259)

### Lines 260-286

MinHashLshIndexDetails is explicitly experimental: incompatible detail/file changes may require rebuilding the index, not rewriting data, and the feature may be removed if stabilization fails. Every segment must share identical details, query signatures must be comparable, and both index files repeat serialized details in schema metadata to detect mismatches. Readers validate every field before allocation or file read. num_hashes=1 is in [1,4096] and divisible by num_bands; num_bands=2 is in [1,256]; each band covers num_hashes/num_bands consecutive values. (protos/index.proto:260-286)

### Lines 287-302

shingle_size uint32=3 is at least one; text with fewer tokens forms a single shingle of all tokens. Required tokenizer=4 is historical lance.table.InvertedIndexDetails rebuilt from metadata alone. Posting-only fields with_position, block_size, posting_format_version, and document_granularity are retained unchanged but ignored. Unrepresentable custom stop words/document extraction and external jieba/lindera dictionaries are rejected by the contract. Empty text behavior is not resolved by this paragraph alone. (protos/index.proto:287-302)

### Lines 303-311

signature_version=5 versions the entire signature procedure: bundled tokenizer streams, shingling, hashing, permutation coefficients and seed, compression, and band keys. Bump when a change makes signatures incomparable; a reader rejects an unimplemented version. This is independent of index file format version, so file readability alone does not imply signature comparability. (protos/index.proto:303-311)

## Interaction and interpretation limits

The explicit experimental marker applies to MinHash LSH (protos/index.proto:260-275), not automatically to every message. Tag/default contracts, validation requirements, and algorithm descriptions need reconciliation with current readers and writers; none of this file contains executable validation. The imports preserve access to old namespace details (protos/index.proto:8-9).

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | syntax = "proto3";
    5 | 
    6 | package lance.index.pb;
    7 | 
    8 | import "google/protobuf/any.proto";
    9 | import "index_old.proto";
   10 | 
   11 | // The type of an index.
   12 | enum IndexType {
   13 |   // Vector index
   14 |   VECTOR = 0;
   15 | }
   16 | 
   17 | message Index {
   18 |   // The unique index name in the dataset.
   19 |   string name = 1;
   20 | 
   21 |   // Columns to be used to build the index.
   22 |   repeated string columns = 2;
   23 | 
   24 |   // The version of the dataset this index was built from.
   25 |   uint64 dataset_version = 3;
   26 | 
   27 |   // The [`IndexType`] of the index.
   28 |   IndexType index_type = 4;
   29 | 
   30 |   /// Index implementation details.
   31 |   oneof implementation {
   32 |     VectorIndex vector_index = 5;
   33 |   }
   34 | }
   35 | 
   36 | message Tensor {
   37 |   enum DataType {
   38 |     BFLOAT16 = 0;
   39 |     FLOAT16 = 1;
   40 |     FLOAT32 = 2;
   41 |     FLOAT64 = 3;
   42 |     UINT8 = 4;
   43 |     UINT16 = 5;
   44 |     UINT32 = 6;
   45 |     UINT64 = 7;
   46 |   }
   47 | 
   48 |   DataType data_type = 1;
   49 | 
   50 |   // Data shape, [dim1, dim2, ...]
   51 |   repeated uint32 shape = 2;
   52 | 
   53 |   // Data buffer
   54 |   bytes data = 3;
   55 | }
   56 | 
   57 | // Inverted Index File Metadata.
   58 | message IVF {
   59 |   /* Centroids of partitions. `dimension * num_partitions` of float32s.
   60 |    *
   61 |    * Deprecated, use centroids_tensor instead.
   62 |    */
   63 |   repeated float centroids = 1;  // [deprecated = true];
   64 | 
   65 |   // File offset of each partition.
   66 |   repeated uint64 offsets = 2;
   67 | 
   68 |   // Number of records in the partition.
   69 |   repeated uint32 lengths = 3;
   70 | 
   71 |   // Tensor of centroids. `num_partitions * dimension` of float32s.
   72 |   Tensor centroids_tensor = 4;
   73 | 
   74 |   // KMeans loss.
   75 |   optional double loss = 5;
   76 | }
   77 | 
   78 | // Product Quantization.
   79 | message PQ {
   80 |   // The number of bits to present a centroid.
   81 |   uint32 num_bits = 1;
   82 | 
   83 |   // Number of sub vectors.
   84 |   uint32 num_sub_vectors = 2;
   85 | 
   86 |   // Vector dimension
   87 |   uint32 dimension = 3;
   88 | 
   89 |   // Codebook. `dimension * 2 ^ num_bits` of float32s.
   90 |   repeated float codebook = 4;
   91 | 
   92 |   // Tensor of codebook. `2 ^ num_bits * dimension` of floats.
   93 |   Tensor codebook_tensor = 5;
   94 | }
   95 | 
   96 | // Transform type
   97 | enum TransformType {
   98 |   OPQ = 0;
   99 | }
  100 | 
  101 | // A transform matrix to apply to a vector or vectors.
  102 | message Transform {
  103 |   // The file offset the matrix is stored
  104 |   uint64 position = 1;
  105 | 
  106 |   // Data shape of the matrix, [rows, cols].
  107 |   repeated uint32 shape = 2;
  108 | 
  109 |   // Transform type.
  110 |   TransformType type = 3;
  111 | }
  112 | 
  113 | // Flat Index
  114 | message Flat {}
  115 | 
  116 | // DiskAnn Index
  117 | message DiskAnn {
  118 |   // Graph spec version
  119 |   uint32 spec = 1;
  120 | 
  121 |   // Graph file
  122 |   string filename = 2;
  123 | 
  124 |   // r parameter
  125 |   uint32 r = 3;
  126 | 
  127 |   // alpha parameter
  128 |   float alpha = 4;
  129 | 
  130 |   // L parameter
  131 |   uint32 L = 5;
  132 | 
  133 |   /// Entry points to the graph
  134 |   repeated uint64 entries = 6;
  135 | }
  136 | 
  137 | // One stage in the vector index pipeline.
  138 | message VectorIndexStage {
  139 |   oneof stage {
  140 |     // Flat index
  141 |     Flat flat = 1;
  142 |     // `IVF` - Inverted File
  143 |     IVF ivf = 2;
  144 |     // Product Quantization
  145 |     PQ pq = 3;
  146 |     // Transformer
  147 |     Transform transform = 4;
  148 |     // DiskANN
  149 |     DiskAnn diskann = 5;
  150 |   }
  151 | }
  152 | 
  153 | // Metric Type for Vector Index
  154 | enum VectorMetricType {
  155 |   // L2 (Euclidean) Distance
  156 |   L2 = 0;
  157 | 
  158 |   // Cosine Distance
  159 |   Cosine = 1;
  160 | 
  161 |   // Dot Product
  162 |   Dot = 2;
  163 | 
  164 |   // Hamming Distance
  165 |   Hamming = 3;
  166 | }
  167 | 
  168 | // Vector Index Metadata
  169 | message VectorIndex {
  170 |   // Index specification version.
  171 |   uint32 spec_version = 1;
  172 | 
  173 |   // Vector dimension;
  174 |   uint32 dimension = 2;
  175 | 
  176 |   /* Composed vector index stages.
  177 |    *
  178 |    * For example, `IVF_PQ` index type can be expressed as:
  179 |    *
  180 |    * ```text
  181 |    * let stages = vec![Ivf{}, PQ{num_bits: 8, num_sub_vectors: 16}]
  182 |    * ```
  183 |    */
  184 |   repeated VectorIndexStage stages = 3;
  185 | 
  186 |   // Vector distance metrics type
  187 |   VectorMetricType metric_type = 4;
  188 | }
  189 | 
  190 | // Details for vector indexes, stored in the manifest's index_details field.
  191 | message VectorIndexDetails {
  192 |   VectorMetricType metric_type = 1;
  193 | 
  194 |   /* The target number of vectors per partition.
  195 |    * 0 means unset.
  196 |    */
  197 |   uint64 target_partition_size = 2;
  198 | 
  199 |   // Optional HNSW index configuration. If set, the index has an HNSW layer.
  200 |   optional HnswParameters hnsw_index_config = 3;
  201 | 
  202 |   message ProductQuantization {
  203 |     uint32 num_bits = 1;
  204 |     uint32 num_sub_vectors = 2;
  205 |   }
  206 |   message ScalarQuantization {
  207 |     uint32 num_bits = 1;
  208 |   }
  209 |   message RabitQuantization {
  210 |     enum RotationType {
  211 |       FAST = 0;
  212 |       MATRIX = 1;
  213 |     }
  214 |     uint32 num_bits = 1;
  215 |     RotationType rotation_type = 2;
  216 |   }
  217 | 
  218 |   // No quantization; vectors are stored as-is.
  219 |   message FlatCompression {}
  220 | 
  221 |   oneof compression {
  222 |     ProductQuantization pq = 4;
  223 |     ScalarQuantization sq = 5;
  224 |     RabitQuantization rq = 6;
  225 |     FlatCompression flat = 8;
  226 |   }
  227 | 
  228 |   /* Runtime hints: optional build preferences that don't affect index structure.
  229 |    * Keys use reverse-DNS namespacing (e.g., "lance.ivf.max_iters", "lancedb.accelerator").
  230 |    * Unrecognized keys must be silently ignored by all runtimes.
  231 |    */
  232 |   map<string, string> runtime_hints = 9;
  233 | }
  234 | 
  235 | // Hierarchical Navigable Small World (HNSW) parameters, used as an optional configuration for IVF indexes.
  236 | message HnswParameters {
  237 |   /* The maximum number of outgoing edges per node in the HNSW graph. Higher values
  238 |    * means more connections, better recall, but more memory and slower builds.
  239 |    * Referred to as "M" in the HNSW literature.
  240 |    */
  241 |   uint32 max_connections = 1;
  242 |   /* "construction exploration factor": The size of the dynamic list used during
  243 |    * index construction.
  244 |    */
  245 |   uint32 construction_ef = 2;
  246 |   // The maximum number of levels in the HNSW graph.
  247 |   uint32 max_level = 3;
  248 | }
  249 | 
  250 | message JsonIndexDetails {
  251 |   string path = 1;
  252 |   google.protobuf.Any target_details = 2;
  253 | }
  254 | message BloomFilterIndexDetails {}
  255 | 
  256 | message RTreeIndexDetails {}
  257 | 
  258 | message FMIndexDetails {}
  259 | 
  260 | /* Details of a MinHash LSH index (near-duplicate search over text).
  261 |  *
  262 |  * EXPERIMENTAL: this index is an experimental format feature. This message
  263 |  * and the index files may change incompatibly without a separate vote, in
  264 |  * which case the index must be rebuilt (the data is never rewritten), and
  265 |  * the feature is removed if its stabilization vote does not pass. Datasets
  266 |  * that do not use the index are not affected either way.
  267 |  *
  268 |  * The message identifies every input of signature generation: the
  269 |  * parameters, the tokenizer and the version of the procedure. All segments
  270 |  * of one logical index carry identical details, so their signatures and the
  271 |  * query signature are comparable; both index files repeat the serialized
  272 |  * message in their schema metadata so that a file which does not belong to
  273 |  * the details is detected. A reader validates every field against the ranges
  274 |  * below before it allocates memory or reads an index file.
  275 |  */
  276 | message MinHashLshIndexDetails {
  277 |   /* Number of MinHash values per signature (k): in [1, 4096] and a multiple
  278 |    * of `num_bands`.
  279 |    */
  280 |   uint32 num_hashes = 1;
  281 | 
  282 |   /* Number of LSH bands (b), in [1, 256]. Each band covers
  283 |    * `num_hashes / num_bands` consecutive signature values.
  284 |    */
  285 |   uint32 num_bands = 2;
  286 | 
  287 |   /* Number of consecutive tokens joined into one shingle; at least 1. A text
  288 |    * with fewer tokens forms one shingle of all of them.
  289 |    */
  290 |   uint32 shingle_size = 3;
  291 | 
  292 |   /* The tokenizer, recorded as a full text search index records it and
  293 |    * rebuilt from this message alone at query time. Required. Fields that only
  294 |    * shape full text search postings (`with_position`, `block_size`,
  295 |    * `posting_format_version`, `document_granularity`) are carried unchanged
  296 |    * and ignored. The details must identify the tokenizer completely, so
  297 |    * settings the message cannot record (custom stop words, document-level
  298 |    * text extraction) and tokenizers that load data from outside Lance (the
  299 |    * jieba and lindera dictionaries) are rejected.
  300 |    */
  301 |   lance.table.InvertedIndexDetails tokenizer = 4;
  302 | 
  303 |   /* Version of the signature procedure: the token streams of the tokenizers
  304 |    * that ship with Lance, shingling, hashing, the permutation coefficients
  305 |    * and their seed, compression and band keys. Bumped whenever any of them
  306 |    * changes in a way that makes old and new signatures incomparable; a reader
  307 |    * rejects a version it does not implement. Independent of the index file
  308 |    * format version.
  309 |    */
  310 |   uint32 signature_version = 5;
  311 | }
``````
