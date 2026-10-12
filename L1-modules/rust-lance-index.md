# Index engine and plugin contracts

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**Trust: contract-verified extension seams; algorithm implementation files mapped.** Source snapshot `c3c8d6fb505fb437b2b673c5195e1d4b74436b2f`. [Entry](../README.md) · [Scope](../V21-PROTOCOL.md) · [Format](../L3-symbols/format-spec.md).

lance-index-core defines common index/search/store/remapping interfaces. lance-index implements scalar/vector mechanisms, registries and cache integration. Dataset orchestration and manifest publication are in rust/lance. The low-level plugin interface does not own a Dataset. No external library implementation is analyzed.

## Module Map

<a id="rust-lance-index-core-src"></a>

### `rust/lance-index-core/src/`

Shared Index/IndexType/IndexParams, scalar storage/search/result/training interfaces, remapping and metrics. Plugins and the Dataset layer use these types to agree on row domain and exactness.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index-core/src/lib.rs` | 1-329 | mapped |
| `rust/lance-index-core/src/metrics.rs` | 1-303 | mapped |
| `rust/lance-index-core/src/remapping.rs` | 1-536 | mapped |
| `rust/lance-index-core/src/scalar.rs` | 1-782 | Key File (checked ranges) |
<a id="rust-lance-index"></a>

### `rust/lance-index/`

Handwritten build integration only; generated output excluded.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/build.rs` | 1-45 | mapped |
<a id="rust-lance-index-examples"></a>

### `rust/lance-index/examples/`

Mapped-only usage examples, not additional acceptance obligations.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/examples/acorn_bench_sift.rs` | 1-329 | mapped |
| `rust/lance-index/examples/kmeans_quality.rs` | 1-520 | mapped |
<a id="rust-lance-index-protos-cache"></a>

### `rust/lance-index/protos-cache/`

Handwritten cache protobuf schema. Generated serializer code is excluded; cache entry identity is not Dataset file-version identity.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/protos-cache/cache.proto` | 1-220 | mapped |
<a id="rust-lance-index-src"></a>

### `rust/lance-index/src/`

Index facade, default plugin registry, system-index adapters, metrics, prefilter, optimization/progress and trait exports.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/src/frag_reuse.rs` | 1-185 | mapped |
| `rust/lance-index/src/lib.rs` | 1-95 | mapped |
| `rust/lance-index/src/mem_wal.rs` | 1-80 | mapped |
| `rust/lance-index/src/metrics.rs` | 1-4 | mapped |
| `rust/lance-index/src/optimize.rs` | 1-116 | mapped |
| `rust/lance-index/src/prefilter.rs` | 1-90 | mapped |
| `rust/lance-index/src/progress.rs` | 1-54 | mapped |
| `rust/lance-index/src/registry.rs` | 1-180 | Key File (checked ranges) |
| `rust/lance-index/src/scalar.rs` | 1-49, 52-701 | mapped |
| `rust/lance-index/src/traits.rs` | 1-389 | mapped |
| `rust/lance-index/src/vector.rs` | 1-610 | mapped |
<a id="rust-lance-index-src-frag-reuse"></a>

### `rust/lance-index/src/frag_reuse/`

Index-side deferred row translation adapters; persisted FRI schema/gates are owned by lance-table.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/src/frag_reuse/row_map.rs` | 1-677 | mapped |
| `rust/lance-index/src/frag_reuse/stable_partition.rs` | 1-269, 272-286 | mapped |
<a id="rust-lance-index-src-scalar"></a>

### `rust/lance-index/src/scalar/`

Scalar index plugins, query parsers and storage mechanisms, including B-tree, bitmap, label-list, ngram, zone-map, Bloom, full-text and other registered kinds. registry.rs defines plugin training/load contracts; the crate registry connects concrete plugins.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/src/scalar/bitmap.rs` | 1-271, 284-284, 289-289, 294-1155, 1287-2469, 2545-2545 | mapped |
| `rust/lance-index/src/scalar/bloomfilter.rs` | 1-816, 824-1569 | mapped |
| `rust/lance-index/src/scalar/btree.rs` | 1-3805 | mapped |
| `rust/lance-index/src/scalar/btree/flat.rs` | 1-433 | mapped |
| `rust/lance-index/src/scalar/expression.rs` | 1-2649 | mapped |
| `rust/lance-index/src/scalar/fmindex.rs` | 1-1239, 1254-2050, 2097-2203, 2218-2218, 2236-2356 | mapped |
| `rust/lance-index/src/scalar/inverted.rs` | 1-688 | mapped |
| `rust/lance-index/src/scalar/json.rs` | 1-1145 | mapped |
| `rust/lance-index/src/scalar/label_list.rs` | 1-1144 | mapped |
| `rust/lance-index/src/scalar/lance_format.rs` | 1-708 | mapped |
| `rust/lance-index/src/scalar/ngram.rs` | 1-1902 | mapped |
| `rust/lance-index/src/scalar/ngram/ngram_regex.rs` | 1-510 | mapped |
| `rust/lance-index/src/scalar/registry.rs` | 1-578 | Key File (checked ranges) |
| `rust/lance-index/src/scalar/rtree.rs` | 1-1291 | mapped |
| `rust/lance-index/src/scalar/seed.rs` | 1-59 | mapped |
| `rust/lance-index/src/scalar/zoned.rs` | 1-296 | mapped |
| `rust/lance-index/src/scalar/zonemap.rs` | 1-2023 | mapped |
<a id="rust-lance-index-src-scalar-inverted"></a>

### `rust/lance-index/src/scalar/inverted/`

Full-text inverted-index tokenization, postings/index construction and query combination. Subdirectories separate combined/compound query logic, storage/index mechanics and tokenizer adapters; use the query-specific implementation named by the facade.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/src/scalar/inverted/builder.rs` | 1-9, 12-2314, 2331-2509 | mapped |
| `rust/lance-index/src/scalar/inverted/cache_codec.rs` | 1-559 | mapped |
| `rust/lance-index/src/scalar/inverted/combined.rs` | 1-28, 31-102 | mapped |
| `rust/lance-index/src/scalar/inverted/combined/cursor.rs` | 1-68 | mapped |
| `rust/lance-index/src/scalar/inverted/combined/flat.rs` | 1-189 | mapped |
| `rust/lance-index/src/scalar/inverted/combined/search.rs` | 1-180 | mapped |
| `rust/lance-index/src/scalar/inverted/combined/stats.rs` | 1-228 | mapped |
| `rust/lance-index/src/scalar/inverted/compound.rs` | 1-51, 63-94, 99-99, 104-825, 952-2260, 2281-2337, 2342-4451 | mapped |
| `rust/lance-index/src/scalar/inverted/compound/should_maxscore.rs` | 1-596 | mapped |
| `rust/lance-index/src/scalar/inverted/cross_column.rs` | 1-1658 | mapped |
| `rust/lance-index/src/scalar/inverted/documents.rs` | 1-411, 423-537, 543-653, 664-715, 732-732, 741-811, 815-837, 862-880, 897-933, 940-1239, 1247-1547, 1552-1552, 1557-1557, 1562-1566, 1571-2254 | mapped |
| `rust/lance-index/src/scalar/inverted/encoding.rs` | 1-7, 10-30, 46-46, 64-64, 129-548, 594-624, 684-893, 910-928, 936-936, 950-950, 990-1231 | mapped |
| `rust/lance-index/src/scalar/inverted/impact.rs` | 1-50, 57-253, 258-258, 263-263, 268-318, 383-433, 443-691 | mapped |
| `rust/lance-index/src/scalar/inverted/index.rs` | 1-158 | mapped |
| `rust/lance-index/src/scalar/inverted/index/cache.rs` | 1-574, 579-646 | mapped |
| `rust/lance-index/src/scalar/inverted/index/doc_set.rs` | 1-902 | mapped |
| `rust/lance-index/src/scalar/inverted/index/flat_search.rs` | 1-1204 | mapped |
| `rust/lance-index/src/scalar/inverted/index/format.rs` | 1-391 | mapped |
| `rust/lance-index/src/scalar/inverted/index/inverted_index.rs` | 1-1034 | mapped |
| `rust/lance-index/src/scalar/inverted/index/partition.rs` | 1-27, 36-71, 111-423, 426-462, 474-1634, 1644-1726, 1730-1841 | mapped |
| `rust/lance-index/src/scalar/inverted/index/posting_batch_builder.rs` | 1-191 | mapped |
| `rust/lance-index/src/scalar/inverted/index/posting_builder.rs` | 1-823 | mapped |
| `rust/lance-index/src/scalar/inverted/index/posting_list.rs` | 1-346, 351-629, 634-754 | mapped |
| `rust/lance-index/src/scalar/inverted/index/posting_prewarm.rs` | 1-602, 617-709, 727-875 | mapped |
| `rust/lance-index/src/scalar/inverted/index/posting_reader.rs` | 1-862 | mapped |
| `rust/lance-index/src/scalar/inverted/index/prewarm.rs` | 1-172 | mapped |
| `rust/lance-index/src/scalar/inverted/index/search.rs` | 1-1328 | mapped |
| `rust/lance-index/src/scalar/inverted/index/search_candidates.rs` | 1-318, 327-350 | mapped |
| `rust/lance-index/src/scalar/inverted/index/token_set.rs` | 1-528, 538-637 | mapped |
| `rust/lance-index/src/scalar/inverted/iter.rs` | 1-217 | mapped |
| `rust/lance-index/src/scalar/inverted/json.rs` | 1-87 | mapped |
| `rust/lance-index/src/scalar/inverted/oracle.rs` | 1-143 | mapped |
| `rust/lance-index/src/scalar/inverted/parser.rs` | 1-239 | mapped |
| `rust/lance-index/src/scalar/inverted/query.rs` | 1-951, 960-960, 1027-1285 | mapped |
| `rust/lance-index/src/scalar/inverted/scorer.rs` | 1-329 | mapped |
| `rust/lance-index/src/scalar/inverted/tokenizer.rs` | 1-1208 | mapped |
| `rust/lance-index/src/scalar/inverted/tokenizer/document_tokenizer.rs` | 1-302 | mapped |
| `rust/lance-index/src/scalar/inverted/tokenizer/jieba.rs` | 1-99 | mapped |
| `rust/lance-index/src/scalar/inverted/tokenizer/lindera.rs` | 1-61 | mapped |
| `rust/lance-index/src/scalar/inverted/wand.rs` | 1-3, 6-232, 237-497, 635-649, 754-955, 966-1169, 1177-1177, 1185-1223, 1228-1515, 1520-1545, 1550-1593, 1597-1602, 1606-1610, 1614-1629, 1645-1772, 1777-2249, 2305-2389, 2403-2458, 2515-2586, 2624-2625, 2631-2766, 2771-3148, 3153-3383, 3388-3434, 3439-3453, 3459-3764, 3769-3874, 3881-4035, 4040-4073, 4078-4585, 4590-4751, 4756-4776, 4781-4927, 4932-5065, 5070-5083, 5086-5088, 5093-5094, 5099-5102, 5107-5113, 5118-5131, 5136-5641, 5647-5693, 5699-5795, 5800-5862, 5868-5868, 5876-5878, 5885-5885, 5890-5892, 5897-5898, 5908-6420 | mapped |
| `rust/lance-index/src/scalar/inverted/wand_intersection.rs` | 1-84 | mapped |
| `rust/lance-index/src/scalar/inverted/wand_maxscore.rs` | 1-367, 372-732 | mapped |
<a id="rust-lance-index-src-scalar-minhash-lsh"></a>

### `rust/lance-index/src/scalar/minhash_lsh/`

MinHash/LSH scalar index implementation and related persisted/query configuration. Signature-version compatibility is defined by index.proto.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/src/scalar/minhash_lsh/builder.rs` | 1-1050 | mapped |
| `rust/lance-index/src/scalar/minhash_lsh/index.rs` | 1-1356 | mapped |
| `rust/lance-index/src/scalar/minhash_lsh/mod.rs` | 1-47, 50-923 | mapped |
<a id="rust-lance-index-src-scalar-rtree"></a>

### `rust/lance-index/src/scalar/rtree/`

Optional geo R-tree implementation and sorting support; feature-gated integration, with geo helpers mapped only.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/src/scalar/rtree/sort.rs` | 1-13 | mapped |
| `rust/lance-index/src/scalar/rtree/sort/hilbert_sort.rs` | 1-255 | mapped |
<a id="rust-lance-index-src-vector"></a>

### `rust/lance-index/src/vector/`

Vector query interface, quantization and IVF/HNSW families. vector.rs carries the search interface; quantizer and concrete storage modules hold mechanics.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/src/vector/bq.rs` | 1-207 | mapped |
| `rust/lance-index/src/vector/flat.rs` | 1-139 | mapped |
| `rust/lance-index/src/vector/graph.rs` | 1-750 | mapped |
| `rust/lance-index/src/vector/hnsw.rs` | 1-111 | mapped |
| `rust/lance-index/src/vector/ivf.rs` | 1-367 | mapped |
| `rust/lance-index/src/vector/kmeans.rs` | 1-2022 | mapped |
| `rust/lance-index/src/vector/pairwise.rs` | 1-571 | mapped |
| `rust/lance-index/src/vector/pq.rs` | 1-650 | mapped |
| `rust/lance-index/src/vector/quantizer.rs` | 1-435 | mapped |
| `rust/lance-index/src/vector/residual.rs` | 1-193 | mapped |
| `rust/lance-index/src/vector/sq.rs` | 1-260 | mapped |
| `rust/lance-index/src/vector/storage.rs` | 1-1161 | mapped |
| `rust/lance-index/src/vector/transform.rs` | 1-226 | mapped |
| `rust/lance-index/src/vector/utils.rs` | 1-345 | mapped |
| `rust/lance-index/src/vector/v3.rs` | 1-7 | mapped |
<a id="rust-lance-index-src-vector-bq"></a>

### `rust/lance-index/src/vector/bq/`

Binary/Rabit quantization mechanisms used by the corresponding vector path; follow quantization dispatch rather than treating them as PQ.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/src/vector/bq/builder.rs` | 1-65, 84-544, 557-1037, 1179-1258 | mapped |
| `rust/lance-index/src/vector/bq/dist_table_quant.rs` | 1-548 | mapped |
| `rust/lance-index/src/vector/bq/ex_dot.rs` | 1-995 | mapped |
| `rust/lance-index/src/vector/bq/pairwise.rs` | 1-981 | mapped |
| `rust/lance-index/src/vector/bq/prune.rs` | 1-360 | mapped |
| `rust/lance-index/src/vector/bq/rotation.rs` | 1-215 | mapped |
| `rust/lance-index/src/vector/bq/storage.rs` | 1-2849 | mapped |
| `rust/lance-index/src/vector/bq/transform.rs` | 1-586 | mapped |
<a id="rust-lance-index-src-vector-distributed"></a>

### `rust/lance-index/src/vector/distributed/`

Distributed vector training/build coordination helpers; dataset publication stays outside this low-level module.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/src/vector/distributed/index_merger.rs` | 1-1734 | mapped |
| `rust/lance-index/src/vector/distributed/mod.rs` | 1-7 | mapped |
<a id="rust-lance-index-src-vector-flat"></a>

### `rust/lance-index/src/vector/flat/`

Unquantized vector storage/build/query support; Flat and FlatBin dispatch are distinct from product quantization.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/src/vector/flat/index.rs` | 1-551 | mapped |
| `rust/lance-index/src/vector/flat/pairwise.rs` | 1-308, 331-612 | mapped |
| `rust/lance-index/src/vector/flat/storage.rs` | 1-661 | mapped |
| `rust/lance-index/src/vector/flat/transform.rs` | 1-48 | mapped |
<a id="rust-lance-index-src-vector-graph"></a>

### `rust/lance-index/src/vector/graph/`

Graph primitives used by vector implementations.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/src/vector/graph/builder.rs` | 1-63 | mapped |
| `rust/lance-index/src/vector/graph/io.rs` | 1-2 | mapped |
<a id="rust-lance-index-src-vector-hnsw"></a>

### `rust/lance-index/src/vector/hnsw/`

HNSW graph build/search mechanisms used by selected vector pipelines. It is not the universal IVF implementation.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/src/vector/hnsw/builder.rs` | 1-1872 | mapped |
| `rust/lance-index/src/vector/hnsw/index.rs` | 1-345 | mapped |
| `rust/lance-index/src/vector/hnsw/online.rs` | 1-607 | mapped |
| `rust/lance-index/src/vector/hnsw/remap.rs` | 1-744 | mapped |
<a id="rust-lance-index-src-vector-ivf"></a>

### `rust/lance-index/src/vector/ivf/`

IVF partition building, shuffling and storage. Partition assignment and storage are separate from quantizer codebook semantics; begin with vector/ivf.rs.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/src/vector/ivf/builder.rs` | 1-182 | mapped |
| `rust/lance-index/src/vector/ivf/shuffler.rs` | 1-882 | mapped |
| `rust/lance-index/src/vector/ivf/storage.rs` | 1-267 | mapped |
| `rust/lance-index/src/vector/ivf/transform.rs` | 1-215 | mapped |
<a id="rust-lance-index-src-vector-pq"></a>

### `rust/lance-index/src/vector/pq/`

Product-quantization builder, distance, storage and transform mechanisms. Preserve dimension/subvector/codebook compatibility and the selected distance convention.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/src/vector/pq/builder.rs` | 1-247 | mapped |
| `rust/lance-index/src/vector/pq/distance.rs` | 1-507, 542-542 | mapped |
| `rust/lance-index/src/vector/pq/pairwise.rs` | 1-765 | mapped |
| `rust/lance-index/src/vector/pq/storage.rs` | 1-1473, 1502-1502, 1528-1528 | mapped |
| `rust/lance-index/src/vector/pq/transform.rs` | 1-72 | mapped |
| `rust/lance-index/src/vector/pq/utils.rs` | 1-80 | mapped |
<a id="rust-lance-index-src-vector-shared"></a>

### `rust/lance-index/src/vector/shared/`

Shared vector implementation helpers; callers select the concrete index and persisted layout.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/src/vector/shared/mod.rs` | 1-11 | mapped |
| `rust/lance-index/src/vector/shared/partition_merger.rs` | 1-151 | mapped |
<a id="rust-lance-index-src-vector-sq"></a>

### `rust/lance-index/src/vector/sq/`

Scalar quantizer storage/build/distance support for vector indices.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/src/vector/sq/builder.rs` | 1-36 | mapped |
| `rust/lance-index/src/vector/sq/pairwise.rs` | 1-541 | mapped |
| `rust/lance-index/src/vector/sq/storage.rs` | 1-725 | mapped |
| `rust/lance-index/src/vector/sq/transform.rs` | 1-86 | mapped |
<a id="rust-lance-index-src-vector-v3"></a>

### `rust/lance-index/src/vector/v3/`

Vector format-generation-specific support; do not infer Lance data-file version from this directory name.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-index/src/vector/v3/shuffler.rs` | 1-578, 584-1199, 1225-2000 | mapped |
| `rust/lance-index/src/vector/v3/subindex.rs` | 1-152 | mapped |

## Key types and files

### IndexPluginRegistry

`rust/lance-index/src/registry.rs` — read `26-177`.

Connects persisted detail type names and friendly plugin names to concrete scalar plugins.  
Registration derives a lowercase name and records full protobuf identities.  
Default registration adds only explicit historical aliases.  
Use supports_details for supported identity checks; lookup by name has a different purpose.

[Selected contract record](../L2-files/rust/lance-index/src/registry.rs.md).

### ScalarIndex / SearchResult / IndexStore

`rust/lance-index-core/src/scalar.rs` — read `398-480,628-762`.

Defines query exactness, row-domain, update and remap obligations.  
AtMost is a candidate superset requiring recheck; AtLeast is an incomplete guaranteed subset.  
Address-domain results need dataset-level translation on stable-row-ID datasets.  
Update/remap write to a destination store and return CreatedIndex metadata for caller publication.

[Selected contract record](../L2-files/rust/lance-index-core/src/scalar.rs.md).

### ScalarIndexPlugin / BasicTrainer

`rust/lance-index/src/scalar/registry.rs` — read `29-200`.

Separates training request/criteria from prepared training data.  
Plugins supply load/query-parser/version/exactness behavior.  
The caller must satisfy training criteria and persist returned details.  
Asynchronous batch remapping is an additive capability, not automatic legacy fallback.

[Selected contract record](../L2-files/rust/lance-index/src/scalar/registry.rs.md).

## Contracts and extension boundaries

**Registration identity.** add_plugin derives the plugin key from the detail message name; supports_details checks a registered full protobuf name after the final slash, case-insensitively. Friendly-name lookup alone is not that identity guard. (rust/lance-index/src/registry.rs:26-177)

**Training.** new_training_request returns criteria; the caller prepares the stream before train_index and stores the returned details for load_index. A plugin may have no BasicTrainer. (rust/lance-index/src/scalar/registry.rs:29-176)

**Search.** Exact, AtMost and AtLeast encode different set guarantees; scalar results are not necessarily ordered. Default results_are_row_addresses is false. (rust/lance-index-core/src/scalar.rs:415-462; rust/lance-index-core/src/scalar.rs:628-663)

**IVF/PQ boundary.** IVF transformer dispatch selects Flat/FlatBin, Product, Scalar or Rabit quantizers. ProductQuantizer carries subvector count, bit count, dimension, codebook and distance type; it is not the Dataset commit object. (rust/lance-index/src/vector/ivf.rs:46-85; rust/lance-index/src/vector/pq.rs:44-54)

M3 supplies the complete API-family/protocol decision tables and recipe navigation. This Module Map establishes ownership and the checked seams; it does not claim runtime qualification.


## Index lifecycle contract

See [index build, query and maintenance](../L3-symbols/protocol-index.md) for the scalar plugin seam, IVF-PQ build, whole-name segment maintenance and coverage/rebase rules.


## Public API route

[Public API family contracts and declaration directories](../L3-symbols/public-api.md) distinguish source-declared interfaces from checked implementation behavior and provide binding-to-engine read sets.

## Source refresh — 2026-10-07

Pinned `84d1681e07af565837f2d97e72ff1b8b040cd15c`. The entries below have updated source ranges. Their directory responsibilities remain as mapped; behavior changes are governed by [current delta contracts](../L3-symbols/refresh-2026-10-07.md). Ordinary files remain mapped, and Java/peripherals remain mapped only.

- `rust/lance-index-core/src/lib.rs`
- `rust/lance-index-core/src/remapping.rs`
- `rust/lance-index-core/src/scalar.rs`
- `rust/lance-index/src/frag_reuse/row_map.rs`
- `rust/lance-index/src/frag_reuse/stable_partition.rs`
- `rust/lance-index/src/scalar.rs`
- `rust/lance-index/src/scalar/bitmap.rs`
- `rust/lance-index/src/scalar/bloomfilter.rs`
- `rust/lance-index/src/scalar/btree.rs`
- `rust/lance-index/src/scalar/btree/flat.rs`
- `rust/lance-index/src/scalar/fmindex.rs`
- `rust/lance-index/src/scalar/inverted.rs`
- `rust/lance-index/src/scalar/inverted/builder.rs`
- `rust/lance-index/src/scalar/inverted/index/doc_set.rs`
- `rust/lance-index/src/scalar/inverted/index/inverted_index.rs`
- `rust/lance-index/src/scalar/json.rs`
- `rust/lance-index/src/scalar/label_list.rs`
- `rust/lance-index/src/scalar/lance_format.rs`
- `rust/lance-index/src/scalar/minhash_lsh/builder.rs`
- `rust/lance-index/src/scalar/minhash_lsh/index.rs`
- `rust/lance-index/src/scalar/minhash_lsh/mod.rs`
- `rust/lance-index/src/scalar/ngram.rs`
- `rust/lance-index/src/scalar/registry.rs`
- `rust/lance-index/src/scalar/rtree.rs`
- `rust/lance-index/src/scalar/zonemap.rs`
- `rust/lance-index/src/vector.rs`
- `rust/lance-index/src/vector/hnsw/index.rs`
- `rust/lance-index/src/vector/ivf.rs`
- `rust/lance-index/src/vector/storage.rs`
- `rust/lance-index/src/vector/v3/shuffler.rs`

## Source refresh — 2026-10-09

Pin `db684d1f0726c00b6defb7963a604a7719e82b5a`. [Changed contracts](../L3-symbols/refresh-2026-10-09.md) cover affected behavior. The following entries have current production ranges; unchanged directory responsibilities and mapped-only limits remain.

- `rust/lance-index-core/src/scalar.rs`
- `rust/lance-index/src/scalar/bitmap.rs`
- `rust/lance-index/src/scalar/inverted/query.rs`
- `rust/lance-index/src/scalar/json.rs`
- `rust/lance-index/src/scalar/label_list.rs`
- `rust/lance-index/src/vector/kmeans.rs`

## Source refresh map — 2026-10-11

Current source `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`. [Changed contracts](../L3-symbols/refresh-2026-10-11.md). Existing directory responsibilities remain; declarations below locate changed boundaries.

### `rust/lance-index/src/scalar/json.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `JsonIndex` (rust/lance-index/src/scalar/json.rs:59-59), `new` (rust/lance-index/src/scalar/json.rs:65-65), `JsonIndexParameters` (rust/lance-index/src/scalar/json.rs:241-241), `JsonQuery` (rust/lance-index/src/scalar/json.rs:293-293), `new` (rust/lance-index/src/scalar/json.rs:299-299), `JsonQueryParser` (rust/lance-index/src/scalar/json.rs:332-332), `new` (rust/lance-index/src/scalar/json.rs:338-338), `JsonTrainingRequest` (rust/lance-index/src/scalar/json.rs:460-460).

### `rust/lance-index/src/scalar/zonemap.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `ZoneMapStatistics` (rust/lance-index/src/scalar/zonemap.rs:63-63), `ZoneMapIndex` (rust/lance-index/src/scalar/zonemap.rs:111-111), `rows_per_zone` (rust/lance-index/src/scalar/zonemap.rs:151-151), `value_range_over` (rust/lance-index/src/scalar/zonemap.rs:198-198), `merge_zonemap_indices` (rust/lance-index/src/scalar/zonemap.rs:1042-1042), `ZoneMapIndexBuilderParams` (rust/lance-index/src/scalar/zonemap.rs:1129-1129), `new` (rust/lance-index/src/scalar/zonemap.rs:1157-1157), `rows_per_zone` (rust/lance-index/src/scalar/zonemap.rs:1164-1164).

### `rust/lance-index/src/vector.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `PreparedPartitionSearchHandle` (rust/lance-index/src/vector.rs:63-63), `PartitionSearchControl` (rust/lance-index/src/vector.rs:66-66), `ApproxMode` (rust/lance-index/src/vector.rs:95-95), `ProbeParams` (rust/lance-index/src/vector.rs:109-109), `resolve` (rust/lance-index/src/vector.rs:136-136), `Query` (rust/lance-index/src/vector.rs:149-149), `validate_search_effort` (rust/lance-index/src/vector.rs:226-226), `VectorIndex` (rust/lance-index/src/vector.rs:268-268).

### `rust/lance-index/src/vector/bq/builder.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `RabitBuildParams` (rust/lance-index/src/vector/bq/builder.rs:37-37), `RabitQuantizer` (rust/lance-index/src/vector/bq/builder.rs:59-59), `RabitQuantizedBatch` (rust/lance-index/src/vector/bq/builder.rs:63-63), `best_ex_rescale_factor` (rust/lance-index/src/vector/bq/builder.rs:218-218), `ex_abs_normalized` (rust/lance-index/src/vector/bq/builder.rs:305-305), `quantize_ex_code_with_scale` (rust/lance-index/src/vector/bq/builder.rs:358-358), `quantize_with_factors` (rust/lance-index/src/vector/bq/builder.rs:422-422), `new_with_rotation` (rust/lance-index/src/vector/bq/builder.rs:558-558).

### `rust/lance-index/src/vector/bq/ex_dot.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `padded_query_len` (rust/lance-index/src/vector/bq/ex_dot.rs:48-48), `sequential_matches_blocked` (rust/lance-index/src/vector/bq/ex_dot.rs:55-55), `blocked_ex_code_bytes` (rust/lance-index/src/vector/bq/ex_dot.rs:60-60), `packed_ex_code_value` (rust/lance-index/src/vector/bq/ex_dot.rs:80-80), `pad_query_into` (rust/lance-index/src/vector/bq/ex_dot.rs:97-97), `pack_blocked_row` (rust/lance-index/src/vector/bq/ex_dot.rs:183-183), `repack_sequential_row` (rust/lance-index/src/vector/bq/ex_dot.rs:198-198), `unpack_blocked_row` (rust/lance-index/src/vector/bq/ex_dot.rs:282-282).

### `rust/lance-index/src/vector/bq/transform.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `RQTransformer` (rust/lance-index/src/vector/bq/transform.rs:58-58), `new` (rust/lance-index/src/vector/bq/transform.rs:157-157), `RabitRawQueryFactors` (rust/lance-index/src/vector/bq/transform.rs:182-182), `RabitRowFactors` (rust/lance-index/src/vector/bq/transform.rs:190-190), `observe` (rust/lance-index/src/vector/bq/transform.rs:207-207), `finish` (rust/lance-index/src/vector/bq/transform.rs:224-224), `compute_raw_query_factors` (rust/lance-index/src/vector/bq/transform.rs:300-300).

