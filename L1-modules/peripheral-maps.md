# Peripheral and retained-crate support Module Maps

> Refresh 2026-10-12, `011953c22097b67b699595adbe99e7f0155d83e4`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-12.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refreshed 2026-10-04 against `ad12ed9e15e0046688b00568d0ac1a347fb2d328`; changed-source pointers re-anchored. Unchanged analysis retained.

**Trust: mapped only; existing deep records unchanged.** Source snapshot `ad12ed9e15e0046688b00568d0ac1a347fb2d328`. [Entry](../README.md) · [Scope](../V21-PROTOCOL.md) · [Format](../L3-symbols/format-spec.md).

This page supplies navigation coverage for intentionally summarized utilities, optional integrations and residual handwritten support files. It does not claim deep contracts, external dependency analysis or benchmark/test analysis. Ordinary mapping is successful V2.1 coverage.

## Module Map

<a id="github"></a>

### `.github/`

Repository automation support only; no engine behavior claim.

| Source file | Production ranges | Coverage |
|---|---|---|
| `.github/scripts/migrate-area-labels.sh` | 1-112 | mapped |
| `.github/workflows/build_linux_wheel/install-protoc.sh` | 1-47 | mapped |
<a id="ci"></a>

### `ci/`

Repository CI/development utility scripts only; not analyzed as engine code.

| Source file | Production ranges | Coverage |
|---|---|---|
| `ci/approve_rc.sh` | 1-85 | mapped |
| `ci/check_breaking_changes.py` | 1-70 | mapped |
| `ci/check_dependency_age.py` | 1-281 | mapped |
| `ci/check_proto_comments.py` | 1-110 | mapped |
| `ci/coverage.py` | 1-38 | mapped |
| `ci/create_rc.sh` | 1-98 | mapped |
| `ci/create_rc_discussion.sh` | 1-146 | mapped |
| `ci/create_release_branch.sh` | 1-308 | mapped |
| `ci/format_vote_gate.py` | 1-419 | mapped |
| `ci/generate_release_notes.py` | 1-198 | mapped |
| `ci/new_contributors.py` | 1-280 | mapped |
| `ci/publish_beta.sh` | 1-223 | mapped |
| `ci/release_common.sh` | 1-85 | mapped |
| `ci/review_stats.py` | 1-212 | mapped |
| `ci/setup_version.py` | 1-50 | mapped |
<a id="docs"></a>

### `docs/`

Documentation-support source scripts/examples only; mapped for navigation.

| Source file | Production ranges | Coverage |
|---|---|---|
| `docs/clean-full-website.sh` | 1-181 | mapped |
| `docs/hooks/pmc_roster.py` | 1-46 | mapped |
| `docs/make-full-website.sh` | 1-336 | mapped |
| `docs/theme/assets/site.js` | 1-263 | mapped |
<a id="rust-arrow-scalar"></a>

### `rust/arrow-scalar/`

Arrow scalar-value helpers used by engine/index code; external Arrow internals excluded.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/arrow-scalar/src/convert.rs` | 1-66 | mapped |
| `rust/arrow-scalar/src/lib.rs` | 1-189, 507-507 | mapped |
| `rust/arrow-scalar/src/serde.rs` | 1-396 | mapped |
<a id="rust-arrow-stats"></a>

### `rust/arrow-stats/`

Arrow statistics utilities; choose the consuming index/encoding contract before changing representation.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/arrow-stats/src/lib.rs` | 1-531 | mapped |
| `rust/arrow-stats/src/nan.rs` | 1-32 | mapped |
<a id="rust-compression-bitpacking"></a>

### `rust/compression/bitpacking/`

Bitpacking kernel support; mapped only, specialized SIMD/layout implementation requires source review.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/compression/bitpacking/src/bitpacker_internal/bitpacker4x.rs` | 1-619, 687-687 | mapped |
| `rust/compression/bitpacking/src/bitpacker_internal/bitpacker8x.rs` | 1-680 | mapped |
| `rust/compression/bitpacking/src/bitpacker_internal/macros.rs` | 1-621, 668-669 | mapped |
| `rust/compression/bitpacking/src/bitpacker_internal/mod.rs` | 1-147 | mapped |
| `rust/compression/bitpacking/src/lib.rs` | 1-1804 | mapped |
<a id="rust-compression-fsst"></a>

### `rust/compression/fsst/`

FSST compression kernel support; mapped only, unsafe/kernel changes require source review.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/compression/fsst/src/fsst.rs` | 1-1435 | mapped |
| `rust/compression/fsst/src/lib.rs` | 1-4 | mapped |
<a id="rust-examples"></a>

### `rust/examples/`

Usage examples, summarized only; not engine acceptance coverage.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/examples/src/full_text_search.rs` | 1-129 | mapped |
| `rust/examples/src/hnsw.rs` | 1-151 | mapped |
| `rust/examples/src/ivf_hnsw.rs` | 1-54, 66-155 | mapped |
| `rust/examples/src/llm_dataset_creation.rs` | 1-256 | mapped |
| `rust/examples/src/write_read_ds.rs` | 1-84 | mapped |
<a id="rust-lance-arrow"></a>

### `rust/lance-arrow/`

Arrow type/buffer/stream interoperability and local serialization helpers; mapped only.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-arrow/src/bfloat16.rs` | 1-349 | mapped |
| `rust/lance-arrow/src/deepcopy.rs` | 1-128 | mapped |
| `rust/lance-arrow/src/floats.rs` | 1-272 | mapped |
| `rust/lance-arrow/src/ipc.rs` | 1-488 | mapped |
| `rust/lance-arrow/src/json.rs` | 1-681 | mapped |
| `rust/lance-arrow/src/lib.rs` | 1-1598 | mapped |
| `rust/lance-arrow/src/list.rs` | 1-118 | mapped |
| `rust/lance-arrow/src/memory.rs` | 1-62 | mapped |
| `rust/lance-arrow/src/scalar.rs` | 1-191 | mapped |
| `rust/lance-arrow/src/schema.rs` | 1-207 | mapped |
| `rust/lance-arrow/src/stream.rs` | 1-221 | mapped |
| `rust/lance-arrow/src/struct.rs` | 1-128 | mapped |
<a id="rust-lance-derive"></a>

### `rust/lance-derive/`

Procedural derive support; mapped only, not an engine mutation policy.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-derive/src/lib.rs` | 1-119 | mapped |
<a id="rust-lance-encoding"></a>

### `rust/lance-encoding/`

Remaining encoding helpers and build integration. Use the existing encoding guide and format contract first; no completed file is re-analyzed.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-encoding/build.rs` | 1-23 | mapped |
| `rust/lance-encoding/src/array_encoding.rs` | 1-13 | mapped |
| `rust/lance-encoding/src/encodings/logical/list.rs` | 1-244 | mapped |
| `rust/lance-encoding/src/encodings/logical/primitive.rs` | 1-1558, 1563-4408, 4426-8018 | mapped |
| `rust/lance-encoding/src/encodings/logical/primitive/sparse.rs` | 1-3206 | mapped |
| `rust/lance-encoding/src/encodings/logical/struct.rs` | 1-661 | mapped |
<a id="rust-lance-encoding-src-array-encoding"></a>

### `rust/lance-encoding/src/array_encoding/`

Retained legacy array-encoding path for V2_0. Ordinary files are mapped; completed structural/core codec contracts are frozen elsewhere. Preserve existing stable read behavior and avoid designing new features on legacy writers.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-encoding/src/array_encoding/logical.rs` | 1-8 | mapped |
| `rust/lance-encoding/src/array_encoding/logical/binary.rs` | 1-194 | mapped |
| `rust/lance-encoding/src/array_encoding/logical/blob.rs` | 1-401 | mapped |
| `rust/lance-encoding/src/array_encoding/logical/list.rs` | 1-1381 | mapped |
| `rust/lance-encoding/src/array_encoding/logical/primitive.rs` | 1-589 | mapped |
| `rust/lance-encoding/src/array_encoding/logical/struct.rs` | 1-661 | mapped |
| `rust/lance-encoding/src/array_encoding/physical.rs` | 1-293 | mapped |
| `rust/lance-encoding/src/array_encoding/physical/basic.rs` | 1-246 | mapped |
| `rust/lance-encoding/src/array_encoding/physical/binary.rs` | 1-579 | mapped |
| `rust/lance-encoding/src/array_encoding/physical/bitmap.rs` | 1-125 | mapped |
| `rust/lance-encoding/src/array_encoding/physical/bitpack.rs` | 1-600 | mapped |
| `rust/lance-encoding/src/array_encoding/physical/block.rs` | 1-49 | mapped |
| `rust/lance-encoding/src/array_encoding/physical/dictionary.rs` | 1-452 | mapped |
| `rust/lance-encoding/src/array_encoding/physical/fixed_size_binary.rs` | 1-119 | mapped |
| `rust/lance-encoding/src/array_encoding/physical/fixed_size_list.rs` | 1-131 | mapped |
| `rust/lance-encoding/src/array_encoding/physical/fsst.rs` | 1-208 | mapped |
| `rust/lance-encoding/src/array_encoding/physical/packed_struct.rs` | 1-257 | mapped |
| `rust/lance-encoding/src/array_encoding/physical/value.rs` | 1-243 | mapped |
| `rust/lance-encoding/src/array_encoding/strategy.rs` | 1-803, 877-902 | mapped |
<a id="rust-lance-encoding-src-encodings-logical-primitive-sparse"></a>

### `rust/lance-encoding/src/encodings/logical/primitive/sparse/`

Unstable sparse structural page support. Fields/version gates are in the format contract; detailed sparse algorithm work requires source reading.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-encoding/src/encodings/logical/primitive/sparse/writer.rs` | 1-743 | mapped |
<a id="rust-lance-file"></a>

### `rust/lance-file/`

Remaining handwritten build integration only; file runtime contracts remain frozen and complete.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-file/build.rs` | 1-29 | mapped |
<a id="rust-lance-geo"></a>

### `rust/lance-geo/`

Optional geometry/domain helpers; mapped only and feature-specific.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-geo/src/bbox.rs` | 1-353 | mapped |
| `rust/lance-geo/src/lib.rs` | 1-14 | mapped |
| `rust/lance-geo/src/udf.rs` | 1-20 | mapped |
<a id="rust-lance-linalg"></a>

### `rust/lance-linalg/`

Distance, quantization, clustering and numerical helpers; mapped only, no numerical performance qualification.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-linalg/build.rs` | 1-326 | mapped |
| `rust/lance-linalg/src/clustering.rs` | 1-41 | mapped |
| `rust/lance-linalg/src/distance.rs` | 1-607 | mapped |
| `rust/lance-linalg/src/distance/cosine.rs` | 1-274, 286-302, 305-310, 321-334, 345-408, 446-478, 516-1422, 1429-1431, 1437-1437 | mapped |
| `rust/lance-linalg/src/distance/cosine_u8.rs` | 1-227 | mapped |
| `rust/lance-linalg/src/distance/dot.rs` | 1-850 | mapped |
| `rust/lance-linalg/src/distance/dot_f16.rs` | 1-407 | mapped |
| `rust/lance-linalg/src/distance/dot_u8.rs` | 1-185 | mapped |
| `rust/lance-linalg/src/distance/hamming.rs` | 1-1126 | mapped |
| `rust/lance-linalg/src/distance/l2.rs` | 1-1028 | mapped |
| `rust/lance-linalg/src/distance/l2_u8.rs` | 1-193 | mapped |
| `rust/lance-linalg/src/distance/norm_l2.rs` | 1-495 | mapped |
| `rust/lance-linalg/src/kernels.rs` | 1-379 | mapped |
| `rust/lance-linalg/src/lib.rs` | 1-15, 18-22 | mapped |
| `rust/lance-linalg/src/simd.rs` | 1-106 | mapped |
| `rust/lance-linalg/src/simd/amx_fp16.c` | 1-727 | mapped |
| `rust/lance-linalg/src/simd/amx_fp16.rs` | 1-108, 111-113, 116-119, 122-129, 139-147, 161-163, 171-173, 181-187, 201-454 | mapped |
| `rust/lance-linalg/src/simd/bf16.c` | 1-74 | mapped |
| `rust/lance-linalg/src/simd/dist_table.c` | 1-60 | mapped |
| `rust/lance-linalg/src/simd/dist_table.rs` | 1-2293 | mapped |
| `rust/lance-linalg/src/simd/f16.c` | 1-145 | mapped |
| `rust/lance-linalg/src/simd/f32.rs` | 1-1107 | mapped |
| `rust/lance-linalg/src/simd/f64.rs` | 1-894 | mapped |
| `rust/lance-linalg/src/simd/i32.rs` | 1-413 | mapped |
| `rust/lance-linalg/src/simd/u8.rs` | 1-410 | mapped |
| `rust/lance-linalg/src/simd/x86.rs` | 1-58 | mapped |
<a id="rust-lance-namespace-datafusion"></a>

### `rust/lance-namespace-datafusion/`

Namespace-to-DataFusion integration; mapped only.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-namespace-datafusion/src/catalog.rs` | 1-136 | mapped |
| `rust/lance-namespace-datafusion/src/error.rs` | 1-10 | mapped |
| `rust/lance-namespace-datafusion/src/lib.rs` | 1-13 | mapped |
| `rust/lance-namespace-datafusion/src/namespace_level.rs` | 1-127 | mapped |
| `rust/lance-namespace-datafusion/src/schema.rs` | 1-80 | mapped |
| `rust/lance-namespace-datafusion/src/session_builder.rs` | 1-135 | mapped |
<a id="rust-lance-namespace-impls"></a>

### `rust/lance-namespace-impls/`

Directory/REST namespace implementations, credentials and connection support; mapped only.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-namespace-impls/src/connect.rs` | 1-220 | mapped |
| `rust/lance-namespace-impls/src/context.rs` | 1-99 | mapped |
| `rust/lance-namespace-impls/src/credentials.rs` | 1-614 | mapped |
| `rust/lance-namespace-impls/src/credentials/aws.rs` | 1-665 | mapped |
| `rust/lance-namespace-impls/src/credentials/azure.rs` | 1-979 | mapped |
| `rust/lance-namespace-impls/src/credentials/cache.rs` | 1-246 | mapped |
| `rust/lance-namespace-impls/src/credentials/gcp.rs` | 1-1134 | mapped |
| `rust/lance-namespace-impls/src/dir.rs` | 1-6199 | mapped |
| `rust/lance-namespace-impls/src/dir/manifest.rs` | 1-3894 | mapped |
| `rust/lance-namespace-impls/src/dir/manifest_feature_flags.rs` | 1-129 | mapped |
| `rust/lance-namespace-impls/src/lib.rs` | 1-157 | mapped |
| `rust/lance-namespace-impls/src/rest.rs` | 1-1658 | mapped |
| `rust/lance-namespace-impls/src/rest/tls.rs` | 1-236, 241-317 | mapped |
| `rust/lance-namespace-impls/src/rest_adapter.rs` | 1-1478 | mapped |
<a id="rust-lance-namespace"></a>

### `rust/lance-namespace/`

Namespace interfaces and model boundary; mapped only.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-namespace/src/compat.rs` | 1-34 | mapped |
| `rust/lance-namespace/src/error.rs` | 1-398 | mapped |
| `rust/lance-namespace/src/lib.rs` | 1-41 | mapped |
| `rust/lance-namespace/src/namespace.rs` | 1-558 | mapped |
| `rust/lance-namespace/src/schema.rs` | 1-375 | mapped |
<a id="rust-lance-select"></a>

### `rust/lance-select/`

Row-selection set/bitmap representations used by queries; mapped only.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-select/src/lib.rs` | 1-27 | mapped |
| `rust/lance-select/src/mask.rs` | 1-1321 | mapped |
| `rust/lance-select/src/mask/nullable.rs` | 1-300 | mapped |
| `rust/lance-select/src/result.rs` | 1-289, 323-536 | mapped |
<a id="rust-lance-table"></a>

### `rust/lance-table/`

Remaining handwritten build integration only; table runtime contracts remain frozen and complete.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-table/build.rs` | 1-32 | mapped |
<a id="rust-lance-tokenizer"></a>

### `rust/lance-tokenizer/`

Text tokenization support and optional tokenizer integrations; mapped only.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-tokenizer/src/alphanum_only.rs` | 1-60 | mapped |
| `rust/lance-tokenizer/src/analyzer.rs` | 1-92 | mapped |
| `rust/lance-tokenizer/src/ascii_folding_filter.rs` | 1-128 | mapped |
| `rust/lance-tokenizer/src/code_tokenizer.rs` | 1-146 | mapped |
| `rust/lance-tokenizer/src/icu.rs` | 1-119 | mapped |
| `rust/lance-tokenizer/src/jieba.rs` | 1-70 | mapped |
| `rust/lance-tokenizer/src/lib.rs` | 1-43 | mapped |
| `rust/lance-tokenizer/src/lindera.rs` | 1-97 | mapped |
| `rust/lance-tokenizer/src/lower_caser.rs` | 1-86 | mapped |
| `rust/lance-tokenizer/src/ngram_tokenizer.rs` | 1-221 | mapped |
| `rust/lance-tokenizer/src/raw_tokenizer.rs` | 1-51 | mapped |
| `rust/lance-tokenizer/src/remove_long.rs` | 1-76 | mapped |
| `rust/lance-tokenizer/src/simple_tokenizer.rs` | 1-68 | mapped |
| `rust/lance-tokenizer/src/stemmer.rs` | 1-142 | mapped |
| `rust/lance-tokenizer/src/stop_word_filter.rs` | 1-92, 128-185 | mapped |
| `rust/lance-tokenizer/src/stop_word_filter/stopwords.rs` | 1-1900 | mapped |
| `rust/lance-tokenizer/src/tokenizer_api.rs` | 1-167 | mapped |
| `rust/lance-tokenizer/src/whitespace_tokenizer.rs` | 1-68 | mapped |
| `rust/lance-tokenizer/src/word_delimiter_filter.rs` | 1-233 | mapped |
<a id="rust-lance-tools"></a>

### `rust/lance-tools/`

Command-line utilities; mapped only, not a second engine API.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-tools/src/cli.rs` | 1-52 | mapped |
| `rust/lance-tools/src/lib.rs` | 1-6 | mapped |
| `rust/lance-tools/src/main.rs` | 1-63 | mapped |
| `rust/lance-tools/src/meta.rs` | 1-58 | mapped |
| `rust/lance-tools/src/util.rs` | 1-45 | mapped |
<a id="skills"></a>

### `skills/`

Repository development workflow helper source only; mapped for navigation.

| Source file | Production ranges | Coverage |
|---|---|---|
| `skills/lance-user-guide/scripts/python_end_to_end.py` | 1-79 | mapped |

## Key types and files

## Contracts and extension boundaries


## Refresh notes — unchanged peripheral implementation

The lance-arrow lib.rs edit before later production helpers is confined to a documentation example; later helper pointers shift by four lines. The namespace-datafusion session_builder.rs change is entirely after its production range 1–135. These peripherals remain mapped only, with no production behavior re-analysis. [Diff scope and production-equivalence evidence](../verification/refresh-ad12ed9e/scope.json).

## Source refresh — 2026-10-07

Pinned `84d1681e07af565837f2d97e72ff1b8b040cd15c`. The entries below have updated source ranges. Their directory responsibilities remain as mapped; behavior changes are governed by [current delta contracts](../L3-symbols/refresh-2026-10-07.md). Ordinary files remain mapped, and Java/peripherals remain mapped only.

- `rust/lance-namespace-impls/src/dir/manifest.rs`

## Source refresh map — 2026-10-11

Current source `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`. [Changed contracts](../L3-symbols/refresh-2026-10-11.md). Existing directory responsibilities remain; declarations below locate changed boundaries.

### `rust/lance-arrow/src/json.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `is_json_field` (rust/lance-arrow/src/json.rs:28-28), `is_arrow_json_field` (rust/lance-arrow/src/json.rs:38-38), `has_json_fields` (rust/lance-arrow/src/json.rs:49-49), `has_arrow_json_fields` (rust/lance-arrow/src/json.rs:65-65), `JsonEncoding` (rust/lance-arrow/src/json.rs:82-82), `of_field` (rust/lance-arrow/src/json.rs:94-94), `JsonValues` (rust/lance-arrow/src/json.rs:112-112), `try_new` (rust/lance-arrow/src/json.rs:120-120).

### `rust/lance-arrow/src/struct.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `StructArrayExt` (rust/lance-arrow/src/struct.rs:11-11).

### `rust/lance-encoding/src/encodings/logical/primitive.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `LevelCodec` (rust/lance-encoding/src/encodings/logical/primitive.rs:1010-1010), `ComplexAllNullScheduler` (rust/lance-encoding/src/encodings/logical/primitive.rs:1687-1687), `new` (rust/lance-encoding/src/encodings/logical/primitive.rs:1702-1702), `ComplexAllNullPageDecoder` (rust/lance-encoding/src/encodings/logical/primitive.rs:1865-1865), `DecodeComplexAllNullTask` (rust/lance-encoding/src/encodings/logical/primitive.rs:1998-1998), `SimpleAllNullScheduler` (rust/lance-encoding/src/encodings/logical/primitive.rs:2052-2052), `SimpleAllNullPageDecoder` (rust/lance-encoding/src/encodings/logical/primitive.rs:2115-2115), `MiniBlockScheduler` (rust/lance-encoding/src/encodings/logical/primitive.rs:2193-2193).

### `rust/lance-encoding/src/encodings/logical/primitive/sparse.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `SparseStructuralPlan` (rust/lance-encoding/src/encodings/logical/primitive/sparse.rs:35-35), `SparsePositionPlan` (rust/lance-encoding/src/encodings/logical/primitive/sparse.rs:41-41), `from_positions` (rust/lance-encoding/src/encodings/logical/primitive/sparse.rs:50-50), `empty` (rust/lance-encoding/src/encodings/logical/primitive/sparse.rs:113-113), `all` (rust/lance-encoding/src/encodings/logical/primitive/sparse.rs:117-117), `range` (rust/lance-encoding/src/encodings/logical/primitive/sparse.rs:125-125), `len` (rust/lance-encoding/src/encodings/logical/primitive/sparse.rs:133-133), `is_empty` (rust/lance-encoding/src/encodings/logical/primitive/sparse.rs:141-141).

### `rust/lance-encoding/src/encodings/logical/primitive/sparse/writer.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `plan` (rust/lance-encoding/src/encodings/logical/primitive/sparse/writer.rs:207-207), `uses_constant_layout` (rust/lance-encoding/src/encodings/logical/primitive/sparse/writer.rs:345-345), `supports_value_block` (rust/lance-encoding/src/encodings/logical/primitive/sparse/writer.rs:391-391), `PreparedSparseValues` (rust/lance-encoding/src/encodings/logical/primitive/sparse/writer.rs:410-410), `SparseValueInput` (rust/lance-encoding/src/encodings/logical/primitive/sparse/writer.rs:416-416), `prepare_values` (rust/lance-encoding/src/encodings/logical/primitive/sparse/writer.rs:526-526), `encode_page` (rust/lance-encoding/src/encodings/logical/primitive/sparse/writer.rs:698-698).

### `rust/lance-encoding/src/encodings/logical/struct.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `StructuralStructScheduler` (rust/lance-encoding/src/encodings/logical/struct.rs:175-175), `new` (rust/lance-encoding/src/encodings/logical/struct.rs:181-181), `StructuralStructDecoder` (rust/lance-encoding/src/encodings/logical/struct.rs:235-235), `new` (rust/lance-encoding/src/encodings/logical/struct.rs:245-245), `drain_batch_task` (rust/lance-encoding/src/encodings/logical/struct.rs:331-331), `StructStructuralEncoder` (rust/lance-encoding/src/encodings/logical/struct.rs:477-477), `new` (rust/lance-encoding/src/encodings/logical/struct.rs:483-483), `StructFieldEncoder` (rust/lance-encoding/src/encodings/logical/struct.rs:564-564).

### `rust/lance-namespace-impls/src/dir.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `OpsMetrics` (rust/lance-namespace-impls/src/dir.rs:105-105), `increment` (rust/lance-namespace-impls/src/dir.rs:111-111), `retrieve` (rust/lance-namespace-impls/src/dir.rs:118-118), `reset` (rust/lance-namespace-impls/src/dir.rs:123-123), `build_sql_expressions` (rust/lance-namespace-impls/src/dir.rs:132-132), `build_column_alterations` (rust/lance-namespace-impls/src/dir.rs:153-153), `TableStatus` (rust/lance-namespace-impls/src/dir.rs:198-198), `DirectoryNamespaceBuilder` (rust/lance-namespace-impls/src/dir.rs:271-271).

### `rust/lance-namespace-impls/src/dir/manifest.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `ObjectType` (rust/lance-namespace-impls/src/dir/manifest.rs:119-119), `as_str` (rust/lance-namespace-impls/src/dir/manifest.rs:125-125), `parse` (rust/lance-namespace-impls/src/dir/manifest.rs:132-132), `TableInfo` (rust/lance-namespace-impls/src/dir/manifest.rs:183-183), `ManifestEntry` (rust/lance-namespace-impls/src/dir/manifest.rs:195-195), `NamespaceInfo` (rust/lance-namespace-impls/src/dir/manifest.rs:603-603), `DatasetConsistencyWrapper` (rust/lance-namespace-impls/src/dir/manifest.rs:621-621), `new` (rust/lance-namespace-impls/src/dir/manifest.rs:625-625).

### `rust/lance-select/src/mask.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `RowAddrMask` (rust/lance-select/src/mask.rs:26-26), `all_rows` (rust/lance-select/src/mask.rs:40-40), `allow_nothing` (rust/lance-select/src/mask.rs:45-45), `from_allowed` (rust/lance-select/src/mask.rs:50-50), `from_block` (rust/lance-select/src/mask.rs:55-55), `block_list` (rust/lance-select/src/mask.rs:59-59), `allow_list` (rust/lance-select/src/mask.rs:66-66), `selected` (rust/lance-select/src/mask.rs:74-74).


Refresh 2026-10-12 — `rust/lance-namespace-impls/src/dir.rs`: Production delta is documented in the current contract; use the existing directory responsibility and current reading intervals.

Refresh 2026-10-12 — `rust/lance-namespace-impls/src/rest.rs`: No production changes; only excluded test ranges changed. Current production coordinates retained.

Refresh 2026-10-12 — `rust/lance-namespace-impls/src/rest_adapter.rs`: No production changes; only excluded test ranges changed. Current production coordinates retained.

Refresh 2026-10-12 — `rust/lance-namespace/src/namespace.rs`: Production delta is documented in the current contract; use the existing directory responsibility and current reading intervals.
