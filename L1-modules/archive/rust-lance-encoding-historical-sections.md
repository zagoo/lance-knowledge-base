> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# Historical sections from rust-lance-encoding.md

### lance_encoding::testing

public; module.

```rust
pub mod testing;
```

array_encoding module is private. Public modules are buffer,compression,compression_config,constants,data,decoder,encoder,encodings,format,repdef,statistics,utils. testing is public only under cfg(test). Public child visibility does not mean every inner implementation is public; exact child APIs remain pending. (rust/lance-encoding/src/lib.rs:11-26)

### lance_encoding::compression_config::tests

private; module.

```rust
mod tests {
```

cfg(test) module and test_pattern_matching assert suffix, prefix, middle-star, universal and exact cases with positives/negatives. Tests include rejection of overlapping prefix/suffix in test_name. They do not cover multiple stars, Unicode, multiple matching map entries or trim behavior. (rust/lance-encoding/src/compression_config.rs:171-192)

### lance_encoding::compression_config::tests::test_exact_match_priority

private; function; test (nested zstd/lz4 feature gates where shown).

```rust
fn test_exact_match_priority() {
```

test_exact_match_priority gives *_id lz4 and exact user_id zstd, asserting zstd. No test in this file covers empty exact records suppressing wildcard defaults, BssMode parsing/sensitivity, malformed numeric values, inherited level mismatch or mini-chunk merge behavior. All tests were read, not executed. (rust/lance-encoding/src/compression_config.rs:273-299)

Callees: Observed lexical call expressions (not a resolved call graph): CompressionParams::new, .insert, .to_string, Default::default, .get_field_params.

### lance_encoding::compression_config::tests::test_field_params_merge

private; function; test (nested zstd/lz4 feature gates where shown).

```rust
fn test_field_params_merge() {
```

test_field_params_merge checks initial None for threshold,scheme,level,bss, then merges threshold0.3/lz4/On and a zstd/level3/Auto overlay with no threshold. It asserts retention of0.3 and replacement of the others; minichunk_size remains None in inputs but is not separately asserted. (rust/lance-encoding/src/compression_config.rs:193-229)

Callees: Observed lexical call expressions (not a resolved call graph): CompressionFieldParams::default, .to_string, .merge.

### lance_encoding::compression_config::tests::test_get_field_params

private; function; test (nested zstd/lz4 feature gates where shown).

```rust
fn test_get_field_params() {
```

test_get_field_params supplies Int32 default threshold0.5/lz4 and *_id override threshold0.3/zstd/level3. Float32 unmatched field stays unset, ordinary Int32 uses type defaults, and user_id Int32 uses the pattern. This tests only one wildcard candidate. (rust/lance-encoding/src/compression_config.rs:230-272)

Callees: Observed lexical call expressions (not a resolved call graph): CompressionParams::new, .insert, .to_string, Default::default, .get_field_params.

### lance_encoding::compression_config::tests::test_pattern_matching

private; function; test (nested zstd/lz4 feature gates where shown).

```rust
fn test_pattern_matching() {
```

cfg(test) module and test_pattern_matching assert suffix, prefix, middle-star, universal and exact cases with positives/negatives. Tests include rejection of overlapping prefix/suffix in test_name. They do not cover multiple stars, Unicode, multiple matching map entries or trim behavior. (rust/lance-encoding/src/compression_config.rs:171-192)

Callees: No call expression found by lexical helper; see exact function body.

### lance_encoding::encodings::fuzz_tests

public; module.

```rust
pub mod fuzz_tests;
```

fuzz_tests public module only under cfg(test); this is not production registration. (rust/lance-encoding/src/encodings.rs:7-8)

### lance_encoding::encodings::physical::block::tests

private; module.

```rust
mod tests {
```

cfg(test) module imports ZstdBufferCompressor unconditionally inside tests even though zstd implementation module is feature-gated. Source indicates a no-zstd test-build resolution risk; no feature build was run. test_compression_scheme_from_str checks none,zstd only; invalid test checks unknown string error, not exact variant/message or uppercase/whitespace. (rust/lance-encoding/src/encodings/physical/block.rs:678-701)

### lance_encoding::encodings::physical::block::tests::lz4

private; module.

```rust
mod lz4 {
```

Feature-gated lz4 tests import Arrow types/datagen, metadata and harness helpers. Basic LZ4 round-trip asserts Hello, world! only. No short-input/malformed-length/nonempty-output/error-rollback assertions in this test. (rust/lance-encoding/src/encodings/physical/block.rs:791-828)

### lance_encoding::encodings::physical::block::tests::lz4::test_lz4_compress_decompress

private; function; test (nested zstd/lz4 feature gates where shown).

```rust
fn test_lz4_compress_decompress() {
```

Feature-gated lz4 tests import Arrow types/datagen, metadata and harness helpers. Basic LZ4 round-trip asserts Hello, world! only. No short-input/malformed-length/nonempty-output/error-rollback assertions in this test. (rust/lance-encoding/src/encodings/physical/block.rs:791-828)

Callees: Observed lexical call expressions (not a resolved call graph): Lz4BufferCompressor::default, Vec::new, .compress, .unwrap, .decompress, .as_slice.

### lance_encoding::encodings::physical::block::tests::lz4::test_lz4_compress_round_trip

private; function; test (nested zstd/lz4 feature gates where shown).

```rust
async fn test_lz4_compress_round_trip(             #[values(                 DataType::Utf8,                 DataType::LargeUtf8,                 DataType::Binary,                 DataType::LargeBinary             )]             data_type: DataType,             #[values(                 TestEncoding::StructuralU16,                 TestEncoding::StructuralU32,                 TestEncoding::StructuralSparse             )]             encoding: TestEncoding,             #[values(false, true)] use_slicing: bool,         ) {
```

Async rstest matrix: Utf8,LargeUtf8,Binary,LargeBinary times StructuralU16/U32/Sparse times slicing false/true =24 parameter combinations before harness cases. Field metadata requests lz4, dict divisor100000 and size ratio0.0001 to discourage dictionary, and fullzip; page size1MiB. Harness expectation is literal zstd despite lz4 metadata/test name, an unresolved source inconsistency rather than proof requested codec was used. Providers generate compressible compressme-prefix+counter values with correct large flag; other type panic. Delegates to check_round_trip_encoding_generated. Complete harness/selection semantics remain pending; tests were not run. (rust/lance-encoding/src/encodings/physical/block.rs:829-884)

Callees: Observed lexical call expressions (not a resolved call graph): Field::new, .clone, HashMap::new, .insert, .to_string, .with_metadata, TestCases::basic, .with_page_sizes, .with_expected_encoding, .with_encoding, .with_slicing_modes, Box::new, FnArrayGeneratorProvider::new, Arc::from, .to_owned.

### lance_encoding::encodings::physical::block::tests::test_compression_scheme_from_str

private; function; test (nested zstd/lz4 feature gates where shown).

```rust
fn test_compression_scheme_from_str() {
```

cfg(test) module imports ZstdBufferCompressor unconditionally inside tests even though zstd implementation module is feature-gated. Source indicates a no-zstd test-build resolution risk; no feature build was run. test_compression_scheme_from_str checks none,zstd only; invalid test checks unknown string error, not exact variant/message or uppercase/whitespace. (rust/lance-encoding/src/encodings/physical/block.rs:678-701)

Callees: Observed lexical call expressions (not a resolved call graph): CompressionScheme::from_str, .unwrap.

### lance_encoding::encodings::physical::block::tests::test_compression_scheme_from_str_invalid

private; function; test (nested zstd/lz4 feature gates where shown).

```rust
fn test_compression_scheme_from_str_invalid() {
```

cfg(test) module imports ZstdBufferCompressor unconditionally inside tests even though zstd implementation module is feature-gated. Source indicates a no-zstd test-build resolution risk; no feature build was run. test_compression_scheme_from_str checks none,zstd only; invalid test checks unknown string error, not exact variant/message or uppercase/whitespace. (rust/lance-encoding/src/encodings/physical/block.rs:678-701)

Callees: Observed lexical call expressions (not a resolved call graph): CompressionScheme::from_str, .is_err.

### lance_encoding::encodings::physical::block::tests::zstd

private; module.

```rust
mod zstd {
```

Feature-gated zstd test compresses Hello, world! using length-prefixed writer then auto-dispatch decode, asserting bytes equal. It does not assert raw frame or prefix literal. (rust/lance-encoding/src/encodings/physical/block.rs:702-723)

### lance_encoding::encodings::physical::block::tests::zstd::test_compress_zstd_raw_stream_format_and_decompress_with_length_prefixed

private; function; test (nested zstd/lz4 feature gates where shown).

```rust
fn test_compress_zstd_raw_stream_format_and_decompress_with_length_prefixed() {
```

Raw-stream compatibility test creates dependency zstd::Encoder without length prefix, writes Hello, world!, finishes and feeds public dispatch decode. Test name/comment says length-prefixed, but actual dispatcher recognizes raw input. It asserts round-trip compatibility, not heuristic collision or reserved-bit correctness. (rust/lance-encoding/src/encodings/physical/block.rs:771-790)

Callees: Observed lexical call expressions (not a resolved call graph): ZstdBufferCompressor::new, Vec::new, zstd::Encoder::new, .unwrap, .write_all, .finish, .expect, .decompress, .as_slice.

### lance_encoding::encodings::physical::block::tests::zstd::test_compress_zstd_with_length_prefixed

private; function; test (nested zstd/lz4 feature gates where shown).

```rust
fn test_compress_zstd_with_length_prefixed() {
```

Feature-gated zstd test compresses Hello, world! using length-prefixed writer then auto-dispatch decode, asserting bytes equal. It does not assert raw frame or prefix literal. (rust/lance-encoding/src/encodings/physical/block.rs:702-723)

Callees: Observed lexical call expressions (not a resolved call graph): ZstdBufferCompressor::new, Vec::new, .compress, .unwrap, .decompress, .as_slice.

### lance_encoding::encodings::physical::block::tests::zstd::test_zstd_compress_decompress_multiple_times

private; function; test (nested zstd/lz4 feature gates where shown).

```rust
fn test_zstd_compress_decompress_multiple_times() {
```

Zstd multiple-times test reuses one compressor, appends Hello and World into one output, records compressed boundary, decodes each separate slice into one output, checks total length and both slices. This is append behavior with caller-kept boundaries, not proof that one decode handles concatenated length-prefixed frames. (rust/lance-encoding/src/encodings/physical/block.rs:724-770)

Callees: Observed lexical call expressions (not a resolved call graph): ZstdBufferCompressor::new, Vec::new, .compress, .unwrap, .len, .decompress.

### lance_encoding::utils::bytepack::tests

private; module.

```rust
mod tests {
```

cfg(test) module test_bytepacked_integer_encoder covers all four widths, exact byte vectors and round-trip collect. Inputs: [50,20,30] width1; [500,200,300] width2; [500000,200000,300000] width4; [0x5000000000,0x2000000000,0x3000000000] width8. Full literal expected bytes preserved below. (rust/lance-encoding/src/utils/bytepack.rs:226-289)

### lance_encoding::utils::bytepack::tests::test_bytepacked_integer_encoder

private; function; test (nested zstd/lz4 feature gates where shown).

```rust
fn test_bytepacked_integer_encoder() {
```

cfg(test) module test_bytepacked_integer_encoder covers all four widths, exact byte vectors and round-trip collect. Inputs: [50,20,30] width1; [500,200,300] width2; [500000,200000,300000] width4; [0x5000000000,0x2000000000,0x3000000000] width8. Full literal expected bytes preserved below. (rust/lance-encoding/src/utils/bytepack.rs:226-289)

Callees: Observed lexical call expressions (not a resolved call graph): BytepackedIntegerEncoder::with_capacity, .append, .unwrap, .into_data, ByteUnpacker::new, .collect.

### lance_encoding::utils::bytepack::tests::test_bytepacked_integer_encoder_rejects_overflow

private; function; test (nested zstd/lz4 feature gates where shown).

```rust
fn test_bytepacked_integer_encoder_rejects_overflow() {
```

test_bytepacked_integer_encoder_rejects_overflow loops U8/U16/U32 max+1, asserts error text contains width, then asserts Zero accepts u64::MAX and yields empty data. No invalid-size/truncated-stream, unchanged-state-on-error, release trusted-overflow or capacity overflow test here; no tests executed. (rust/lance-encoding/src/utils/bytepack.rs:290-306)

Callees: Observed lexical call expressions (not a resolved call graph): BytepackedIntegerEncoder::with_capacity, .append, .unwrap_err, .to_string, .contains, .unwrap, .into_data, .is_empty.

### lance_encoding::buffer::tests

private; module.

```rust
mod tests {
```

cfg(test): test_eq compares Vec and Arrow-created buffers by contents. test_reinterpret_vec checks u32[1,2,3] LE byte pattern and typed values; no pointer-identity assertion. Crate itself rejects non-little-endian targets. (rust/lance-encoding/src/lib.rs:27-31) (rust/lance-encoding/src/buffer.rs:380-407)

### lance_encoding::buffer::tests::test_bit_slice_le

private; function; test.

```rust
fn test_bit_slice_le() {
```

Bit-slice test uses input[0x0f,0x0b] and asserts (offset,length): (0,4)->[0x0f], (4,4)->[0], (3,8)->[0x61], (0,8)->[0x0f], (4,8)->[0xb0], (4,12)->[0xb0,0]. Eight local tests total; no async lifecycle, local mutex or feature-gated production branch. (rust/lance-encoding/src/buffer.rs:491-503)

Callees: Observed lexical call expressions (not a resolved call graph): LanceBuffer::from, .bit_slice_le_with_length, .as_ref.

### lance_encoding::buffer::tests::test_concat

private; function; test.

```rust
fn test_concat() {
```

test_concat covers three inputs, singleton empty and nonempty plus empty, using concat_into_one; it does not cover concat or zero inputs. test_zip interleaves widths8,16,32 for three values and checks all21 bytes. No invalid width, short input, overflow or zero-width zipper tests. (rust/lance-encoding/src/buffer.rs:408-453)

Callees: Observed lexical call expressions (not a resolved call graph): LanceBuffer::from, LanceBuffer::concat_into_one, LanceBuffer::empty, .deep_copy.

### lance_encoding::buffer::tests::test_eq

private; function; test.

```rust
fn test_eq() {
```

cfg(test): test_eq compares Vec and Arrow-created buffers by contents. test_reinterpret_vec checks u32[1,2,3] LE byte pattern and typed values; no pointer-identity assertion. Crate itself rejects non-little-endian targets. (rust/lance-encoding/src/lib.rs:27-31) (rust/lance-encoding/src/buffer.rs:380-407)

Callees: Observed lexical call expressions (not a resolved call graph): LanceBuffer::from, Buffer::from_vec.

### lance_encoding::buffer::tests::test_hex

private; function; test.

```rust
fn test_hex() {
```

test_hex asserts uppercase. should_panic test rejects a three-byte buffer interpreted as u16. test_borrow_to_typed_slice compares two aligned typed handles sharing a pointer, then two simultaneously live copies from a deliberately offset Bytes slice producing different pointers. The test assumes initial allocation alignment; no test of borrow_to_typed_view is present. Tests were read, not run. (rust/lance-encoding/src/buffer.rs:454-490)

Callees: Observed lexical call expressions (not a resolved call graph): LanceBuffer::from, .as_hex.

### lance_encoding::buffer::tests::test_reinterpret_vec

private; function; test.

```rust
fn test_reinterpret_vec() {
```

cfg(test): test_eq compares Vec and Arrow-created buffers by contents. test_reinterpret_vec checks u32[1,2,3] LE byte pattern and typed values; no pointer-identity assertion. Crate itself rejects non-little-endian targets. (rust/lance-encoding/src/lib.rs:27-31) (rust/lance-encoding/src/buffer.rs:380-407)

Callees: Observed lexical call expressions (not a resolved call graph): LanceBuffer::reinterpret_vec, Vec::with_capacity, .extend_from_slice, .to_ne_bytes, LanceBuffer::from, .borrow_to_typed_slice, .as_ref.

### lance_encoding::buffer::tests::test_to_typed_slice

private; function; test.

```rust
fn test_to_typed_slice() {
```

test_hex asserts uppercase. should_panic test rejects a three-byte buffer interpreted as u16. test_borrow_to_typed_slice compares two aligned typed handles sharing a pointer, then two simultaneously live copies from a deliberately offset Bytes slice producing different pointers. The test assumes initial allocation alignment; no test of borrow_to_typed_view is present. Tests were read, not run. (rust/lance-encoding/src/buffer.rs:454-490)

Callees: Observed lexical call expressions (not a resolved call graph): LanceBuffer::from, .borrow_to_typed_slice, .as_ref, .as_ptr, bytes::Bytes::from, .slice, LanceBuffer::from_bytes.

### lance_encoding::buffer::tests::test_to_typed_slice_invalid

private; function; test.

```rust
fn test_to_typed_slice_invalid() {
```

test_hex asserts uppercase. should_panic test rejects a three-byte buffer interpreted as u16. test_borrow_to_typed_slice compares two aligned typed handles sharing a pointer, then two simultaneously live copies from a deliberately offset Bytes slice producing different pointers. The test assumes initial allocation alignment; no test of borrow_to_typed_view is present. Tests were read, not run. (rust/lance-encoding/src/buffer.rs:454-490)

Callees: Observed lexical call expressions (not a resolved call graph): LanceBuffer::from, .borrow_to_typed_slice.

### lance_encoding::buffer::tests::test_zip

private; function; test.

```rust
fn test_zip() {
```

test_concat covers three inputs, singleton empty and nonempty plus empty, using concat_into_one; it does not cover concat or zero inputs. test_zip interleaves widths8,16,32 for three values and checks all21 bytes. No invalid width, short input, overflow or zero-width zipper tests. (rust/lance-encoding/src/buffer.rs:408-453)

Callees: Observed lexical call expressions (not a resolved call graph): LanceBuffer::from, LanceBuffer::reinterpret_vec, LanceBuffer::zip_into_one, .unwrap, .len, Vec::with_capacity, .push, .extend_from_slice, .to_ne_bytes.

### lance_encoding::encodings::logical::primitive::layout::tests

private; module.

```rust
mod tests {
```

cfg(test) within-budget test supplies panic closure to prove it is never evaluated and expects None. (rust/lance-encoding/src/encodings/logical/primitive/layout.rs:26-42)

### lance_encoding::encodings::logical::primitive::layout::tests::explicit_modes_and_lance_2_2_do_not_auto_select

private; function; test.

```rust
fn explicit_modes_and_lance_2_2_do_not_auto_select() {
```

Test named explicit_modes_and_lance_2_2_do_not_auto_select loops miniblock/fullzip/sparse strings with panic closures. It passes no version and therefore does not independently prove the2.2 gate. Actual v2.2 composition installs reject_sparse/constant/dense_u32; v2.3 installs sparse/constant/dense_u32. Sparse behavior calls this helper after budget calculation, skips unsupported value blocks, converts preparation errors to logged dense fallback, but propagates planning errors. Explicit sparse is handled in a prior branch and can propagate its own plan error. (rust/lance-file/src/versions/v2_2/mod.rs:121-131; rust/lance-file/src/versions/v2_3/mod.rs:129-139; rust/lance-encoding/src/encodings/logical/primitive.rs:7802-7877) (rust/lance-encoding/src/encodings/logical/primitive/layout.rs:57-72)

Callees: Observed lexical call expressions (not a resolved call graph): MiniBlockRepDefBudget::RequiresPageSplit, Vec::new, .unwrap, .is_none.

### lance_encoding::encodings::logical::primitive::layout::tests::over_budget_selects_only_eligible_candidates

private; function; test.

```rust
fn over_budget_selects_only_eligible_candidates() {
```

Budget-exceeded test accepts Some42 and None for RequiresPageSplit(empty Vec), and Some7 for SingleRowOverBudget(70000). Empty split payload is deliberately not validated by this selector. No closure-error propagation test. (rust/lance-encoding/src/encodings/logical/primitive/layout.rs:43-56)

Callees: Observed lexical call expressions (not a resolved call graph): MiniBlockRepDefBudget::RequiresPageSplit, Vec::new, .unwrap, .is_none, MiniBlockRepDefBudget::SingleRowOverBudget.

### lance_encoding::encodings::logical::primitive::layout::tests::within_budget_does_not_construct_sparse_candidate

private; function; test.

```rust
fn within_budget_does_not_construct_sparse_candidate() {
```

cfg(test) within-budget test supplies panic closure to prove it is never evaluated and expects None. (rust/lance-encoding/src/encodings/logical/primitive/layout.rs:26-42)

Callees: Observed lexical call expressions (not a resolved call graph): .unwrap, .is_none.

### lance_encoding::encodings::logical::primitive::miniblock::tests

private; module.

```rust
mod tests {
```

cfg(test) serial_test module. Default,custom256 and raise32768 tests directly call parser after unsafe env remove/set, with cleanup after assertions. They do not initialize/check LazyLock or preserve a preexisting env value. Unsafe environment mutation has no local safety explanation. serial attributes coordinate matching tests, not every thread in a process. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:146-175)

### lance_encoding::encodings::logical::primitive::miniblock::tests::test_parse_can_raise_to_32k

private; function; test.

```rust
fn test_parse_can_raise_to_32k() {
```

cfg(test) serial_test module. Default,custom256 and raise32768 tests directly call parser after unsafe env remove/set, with cleanup after assertions. They do not initialize/check LazyLock or preserve a preexisting env value. Unsafe environment mutation has no local safety explanation. serial attributes coordinate matching tests, not every thread in a process. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:146-175)

Callees: Observed lexical call expressions (not a resolved call graph): std::env::set_var, std::env::remove_var.

### lance_encoding::encodings::logical::primitive::miniblock::tests::test_parse_clamps_above_max

private; function; test.

```rust
fn test_parse_clamps_above_max() {
```

Remaining serial tests check0->1,99999->32768 and malformed->4096. Six parser tests total, read not run. A panic before cleanup can leave changed environment. No tests here for arbitrary non-power-of-two values, Unicode failure, once-only static initialization, rep/def division or MiniBlockChunk invalid counts. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:176-201)

Callees: Observed lexical call expressions (not a resolved call graph): std::env::set_var, std::env::remove_var.

### lance_encoding::encodings::logical::primitive::miniblock::tests::test_parse_clamps_zero_to_one

private; function; test.

```rust
fn test_parse_clamps_zero_to_one() {
```

Remaining serial tests check0->1,99999->32768 and malformed->4096. Six parser tests total, read not run. A panic before cleanup can leave changed environment. No tests here for arbitrary non-power-of-two values, Unicode failure, once-only static initialization, rep/def division or MiniBlockChunk invalid counts. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:176-201)

Callees: Observed lexical call expressions (not a resolved call graph): std::env::set_var, std::env::remove_var.

### lance_encoding::encodings::logical::primitive::miniblock::tests::test_parse_custom_value

private; function; test.

```rust
fn test_parse_custom_value() {
```

cfg(test) serial_test module. Default,custom256 and raise32768 tests directly call parser after unsafe env remove/set, with cleanup after assertions. They do not initialize/check LazyLock or preserve a preexisting env value. Unsafe environment mutation has no local safety explanation. serial attributes coordinate matching tests, not every thread in a process. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:146-175)

Callees: Observed lexical call expressions (not a resolved call graph): std::env::set_var, std::env::remove_var.

### lance_encoding::encodings::logical::primitive::miniblock::tests::test_parse_default

private; function; test.

```rust
fn test_parse_default() {
```

cfg(test) serial_test module. Default,custom256 and raise32768 tests directly call parser after unsafe env remove/set, with cleanup after assertions. They do not initialize/check LazyLock or preserve a preexisting env value. Unsafe environment mutation has no local safety explanation. serial attributes coordinate matching tests, not every thread in a process. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:146-175)

Callees: Observed lexical call expressions (not a resolved call graph): std::env::remove_var.

### lance_encoding::encodings::logical::primitive::miniblock::tests::test_parse_invalid_falls_back_to_default

private; function; test.

```rust
fn test_parse_invalid_falls_back_to_default() {
```

Remaining serial tests check0->1,99999->32768 and malformed->4096. Six parser tests total, read not run. A panic before cleanup can leave changed environment. No tests here for arbitrary non-power-of-two values, Unicode failure, once-only static initialization, rep/def division or MiniBlockChunk invalid counts. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:176-201)

Callees: Observed lexical call expressions (not a resolved call graph): std::env::set_var, std::env::remove_var.

### lance_encoding::encodings::physical::constant::tests

private; module.

```rust
mod tests {
```

One local test uses scalarNone, asserts requires_payload=false, None input gives AllNull count3, and Some(empty) errors. It does not assert exact error text/variant, scalarSome, fixed-per-value behavior or zero count. Read not executed. (rust/lance-encoding/src/encodings/physical/constant.rs:64-81)

### lance_encoding::encodings::physical::constant::tests::block_constant_requires_no_payload

private; function; test.

```rust
fn block_constant_requires_no_payload() {
```

One local test uses scalarNone, asserts requires_payload=false, None input gives AllNull count3, and Some(empty) errors. It does not assert exact error text/variant, scalarSome, fixed-per-value behavior or zero count. Read not executed. (rust/lance-encoding/src/encodings/physical/constant.rs:64-81)

Callees: Observed lexical call expressions (not a resolved call graph): ConstantDecompressor::new, .requires_payload, BlockDecompressor::decompress, .unwrap, DataBlock::AllNull, LanceBuffer::empty, .is_err.

### lance_encoding::encodings::physical::general::tests

private; module.

```rust
mod tests {
```

cfg(test) imports include Arrow arrays, default strategy and RLE/value encoders. miniblock_context constructs (0,true,true). Private Debug TestCase holds name, boxed inner, config, DataBlock, expected_compressed and min_compression_ratio. Despite min name, test uses it as maximum allowed ratio. No test feature guards for selected Zstd/LZ4 configurations. (rust/lance-encoding/src/encodings/physical/general.rs:147-172)

### lance_encoding::encodings::physical::general::tests::create_pattern_f64_block

private; function; test.

```rust
fn create_pattern_f64_block<F>(size: usize, pattern: F) -> DataBlock     where         F: Fn(usize) -> f64,     {
```

Helpers convert Int32/Float64 arrays to owned DataBlock with explicit length, and build Vec values by mapping the caller function over num_values. No streaming fixture generation. (rust/lance-encoding/src/encodings/physical/general.rs:238-260)

Callees: Observed lexical call expressions (not a resolved call graph): .map, .collect, Float64Array::from, DataBlock::from_array.

### lance_encoding::encodings::physical::general::tests::create_pattern_i32_block

private; function; test.

```rust
fn create_pattern_i32_block<F>(size: usize, pattern: F) -> DataBlock     where         F: Fn(usize) -> i32,     {
```

Helpers convert Int32/Float64 arrays to owned DataBlock with explicit length, and build Vec values by mapping the caller function over num_values. No streaming fixture generation. (rust/lance-encoding/src/encodings/physical/general.rs:238-260)

Callees: Observed lexical call expressions (not a resolved call graph): .map, .collect, Int32Array::from, DataBlock::from_array.

### lance_encoding::encodings::physical::general::tests::create_repeated_i32_block

private; function; test.

```rust
fn create_repeated_i32_block(values: Vec<i32>) -> DataBlock {
```

Helpers convert Int32/Float64 arrays to owned DataBlock with explicit length, and build Vec values by mapping the caller function over num_values. No streaming fixture generation. (rust/lance-encoding/src/encodings/physical/general.rs:238-260)

Callees: Observed lexical call expressions (not a resolved call graph): Int32Array::from, DataBlock::from_array.

### lance_encoding::encodings::physical::general::tests::create_test_cases

private; function; test.

```rust
fn create_test_cases() -> Vec<TestCase> {
```

create_test_cases builds five cases: eight-value RLE/Lz4 no outer expected;2048 integer values i/8 RLE/Lz4 no outer;8192 i/16 RLE/Zstd level3 expected with0.9 ratio;1024 sequential i32 Value/Lz4 no outer;1024 f64 i*0.1 Value/Zstd level3 expected0.9. These are source fixtures, not measured results. (rust/lance-encoding/src/encodings/physical/general.rs:173-237)

Callees: Observed lexical call expressions (not a resolved call graph): Box::new, RleEncoder::new.

### lance_encoding::encodings::physical::general::tests::decompress_miniblock_chunks

private; function; test.

```rust
fn decompress_miniblock_chunks(         compressed: &MiniBlockCompressed,         encoding: &CompressiveEncoding,     ) -> Vec<u8> {
```

decompress_miniblock_chunks tracks offsets per buffer and derives chunk count from log or remaining values based on already appended bytes. It slices declared buffers only when index<data.len, silently skipping excess size entries. It creates default-strategy decoder per chunk, unwraps decode, requires FixedWidth and appends decoded bytes. No content comparison. Final-count calculation depends on guessed bytes-per-value. (rust/lance-encoding/src/encodings/physical/general.rs:344-393)

Callees: Observed lexical call expressions (not a resolved call graph): Vec::new, .len, DefaultDecompressionStrategy::default, .saturating_sub, .iter, .enumerate, .slice_with_length, .push, .create_miniblock_decompressor, .unwrap, .decompress, DataBlock::FixedWidth, .extend_from_slice, .as_ref.

### lance_encoding::encodings::physical::general::tests::get_bytes_per_value

private; function; test.

```rust
fn get_bytes_per_value(compressed: &MiniBlockCompressed) -> usize {
```

get_bytes_per_value returns4 for zero values,8 for exactly1024 values,4 otherwise. This misclassifies the1024-i32 case and can distort residual count; it is a test heuristic, not production datatype logic. Main test loops five cases in one plain test rather than rstest. No runtime failure or pass was established. (rust/lance-encoding/src/encodings/physical/general.rs:394-416)

Callees: No call expression found by lexical helper; see exact function body.

### lance_encoding::encodings::physical::general::tests::miniblock_context

private; function; test.

```rust
fn miniblock_context() -> MiniBlockCompressionContext {
```

cfg(test) imports include Arrow arrays, default strategy and RLE/value encoders. miniblock_context constructs (0,true,true). Private Debug TestCase holds name, boxed inner, config, DataBlock, expected_compressed and min_compression_ratio. Despite min name, test uses it as maximum allowed ratio. No test feature guards for selected Zstd/LZ4 configurations. (rust/lance-encoding/src/encodings/physical/general.rs:147-172)

Callees: Observed lexical call expressions (not a resolved call graph): MiniBlockCompressionContext::new.

### lance_encoding::encodings::physical::general::tests::run_round_trip_test

private; function; test.

```rust
fn run_round_trip_test(test_case: TestCase) {
```

run_round_trip_test wraps the inner compressor and unwraps success. General descriptor requires expected_compressed=true and matching scheme, but does not check level here. When expected=true, bare Rle or Flat descriptors are also accepted; thus flag does not require outer General. With expected=false any non-General descriptor passes this branch. Helper checks chunks nonempty, decodes with helper, and asserts only total byte length num_values*(8 if name contains float else4). It does not compare decoded values. Expected-compressed ratio compares first compressed buffer length with original raw expected length, not inner encoded size, using <=min_compression_ratio. A length/ratio pass would not establish data round-trip equality or multi-buffer fidelity. (rust/lance-encoding/src/encodings/physical/general.rs:261-304; rust/lance-encoding/src/encodings/physical/general.rs:305-343)

Callees: Observed lexical call expressions (not a resolved call graph): GeneralMiniBlockCompressor::new, .compress, .unwrap, Compression::General, CompressionScheme::try_from, .as_ref, .scheme, Compression::Rle, Compression::Flat, .is_empty, .contains, .len.

### lance_encoding::encodings::physical::general::tests::test_compressed_mini_block_empty_data

private; function; test.

```rust
fn test_compressed_mini_block_empty_data() {
```

Empty-array test invokes Value/Lz4; if Ok it asserts only num_values=0, and any Err is accepted. It therefore does not prove successful empty compression or classify valid failures. All local tests were read, not executed. Production code has no local unsafe block, async task or file IO. (rust/lance-encoding/src/encodings/physical/general.rs:660-683)

Callees: Observed lexical call expressions (not a resolved call graph): Int32Array::from, DataBlock::from_array, GeneralMiniBlockCompressor::new, Box::new, .compress.

### lance_encoding::encodings::physical::general::tests::test_compressed_mini_block_large_buffers

private; function; test.

```rust
fn test_compressed_mini_block_large_buffers() {
```

Large-buffer test constructs1024 i32 fixed-width values (4096bytes), Value inner and Zstd3. Asserts General descriptor, Flat32 inner, Zstd and Some(3), preserved count1024 and one buffer. It does not decode or compare values. Equality with the4096 threshold reaches the outer codec. (rust/lance-encoding/src/encodings/physical/general.rs:455-507)

Callees: Observed lexical call expressions (not a resolved call graph): .collect, LanceBuffer::from_bytes, bytemuck::cast_slice, .to_vec, .into, DataBlock::FixedWidth, BlockInfo::new, Box::new, GeneralMiniBlockCompressor::new, .compress, .unwrap, Compression::General, .is_some, .as_ref, .scheme, Compression::Flat, .len.

### lance_encoding::encodings::physical::general::tests::test_compressed_mini_block_rle_multiple_buffers

private; function; test.

```rust
fn test_compressed_mini_block_rle_multiple_buffers() {
```

RLE multiple-buffer test uses100 repeated ones and LZ4, then only asserts data.len()==2. Comment says only first buffer compressed, but assertion does not verify that any outer compression occurred or that other bytes stayed equal. (rust/lance-encoding/src/encodings/physical/general.rs:508-526)

Callees: Observed lexical call expressions (not a resolved call graph): GeneralMiniBlockCompressor::new, Box::new, RleEncoder::new, .compress, .unwrap, .len.

### lance_encoding::encodings::physical::general::tests::test_compressed_mini_block_table_driven

private; function; test.

```rust
fn test_compressed_mini_block_table_driven() {
```

get_bytes_per_value returns4 for zero values,8 for exactly1024 values,4 otherwise. This misclassifies the1024-i32 case and can distort residual count; it is a test heuristic, not production datatype logic. Main test loops five cases in one plain test rather than rstest. No runtime failure or pass was established. (rust/lance-encoding/src/encodings/physical/general.rs:394-416)

Callees: No call expression found by lexical helper; see exact function body.

### lance_encoding::encodings::physical::general::tests::test_compressed_mini_block_threshold

private; function; test.

```rust
fn test_compressed_mini_block_threshold() {
```

Separate threshold case uses four RLE integers and LZ4 expecting no outer compression; floating case uses1024 repeated floor(i/10) f64 with Zstd3 and0.5 ratio. Both inherit helper limitations. (rust/lance-encoding/src/encodings/physical/general.rs:417-454)

Callees: Observed lexical call expressions (not a resolved call graph): Box::new, RleEncoder::new.

### lance_encoding::encodings::physical::general::tests::test_compressed_mini_block_with_doubles

private; function; test.

```rust
fn test_compressed_mini_block_with_doubles() {
```

Separate threshold case uses four RLE integers and LZ4 expecting no outer compression; floating case uses1024 repeated floor(i/10) f64 with Zstd3 and0.5 ratio. Both inherit helper limitations. (rust/lance-encoding/src/encodings/physical/general.rs:417-454)

Callees: Observed lexical call expressions (not a resolved call graph): Box::new.

### lance_encoding::encodings::physical::general::tests::test_rle_with_general_miniblock_wrapper

private; function; test.

```rust
fn test_rle_with_general_miniblock_wrapper() {
```

Test named automatic_wrapper_for_rle manually constructs GeneralMiniBlockCompressor over RLE/LZ4 and12 i32 values in three runs. It accepts either General(Rle(Flat32 values,Flat8 run lengths)) with Lz4 or bare Rle. It does not exercise automatic strategy registration, decode or equality. Equivalent manual RLE wrapper test uses i64 values100/200/300 in runs of50. General branch checks Flat64 values and Flat8 run lengths plus Lz4; bare Rle also accepted. No decoded-value assertion. (rust/lance-encoding/src/encodings/physical/general.rs:527-599; rust/lance-encoding/src/encodings/physical/general.rs:600-659)

Callees: Observed lexical call expressions (not a resolved call graph): Box::new, RleEncoder::new, GeneralMiniBlockCompressor::new, .compress, .unwrap, Compression::General, .as_ref, Compression::Rle, Compression::Flat, .scheme, .into_iter, .chain, .collect, arrow_array::Int64Array::from, DataBlock::from_array.

### lance_encoding::encodings::physical::general::tests::TestCase

private; struct.

```rust
struct TestCase {
```

cfg(test) imports include Arrow arrays, default strategy and RLE/value encoders. miniblock_context constructs (0,true,true). Private Debug TestCase holds name, boxed inner, config, DataBlock, expected_compressed and min_compression_ratio. Despite min name, test uses it as maximum allowed ratio. No test feature guards for selected Zstd/LZ4 configurations. (rust/lance-encoding/src/encodings/physical/general.rs:147-172)

### lance_encoding::encodings::physical::general::tests::TestCase::compression

private; field.

```rust
compression: CompressionConfig,
```

cfg(test) imports include Arrow arrays, default strategy and RLE/value encoders. miniblock_context constructs (0,true,true). Private Debug TestCase holds name, boxed inner, config, DataBlock, expected_compressed and min_compression_ratio. Despite min name, test uses it as maximum allowed ratio. No test feature guards for selected Zstd/LZ4 configurations. (rust/lance-encoding/src/encodings/physical/general.rs:147-172)

### lance_encoding::encodings::physical::general::tests::TestCase::data

private; field.

```rust
data: DataBlock,
```

cfg(test) imports include Arrow arrays, default strategy and RLE/value encoders. miniblock_context constructs (0,true,true). Private Debug TestCase holds name, boxed inner, config, DataBlock, expected_compressed and min_compression_ratio. Despite min name, test uses it as maximum allowed ratio. No test feature guards for selected Zstd/LZ4 configurations. (rust/lance-encoding/src/encodings/physical/general.rs:147-172)

### lance_encoding::encodings::physical::general::tests::TestCase::expected_compressed

private; field.

```rust
expected_compressed: bool, // Whether we expect compression to be applied
```

cfg(test) imports include Arrow arrays, default strategy and RLE/value encoders. miniblock_context constructs (0,true,true). Private Debug TestCase holds name, boxed inner, config, DataBlock, expected_compressed and min_compression_ratio. Despite min name, test uses it as maximum allowed ratio. No test feature guards for selected Zstd/LZ4 configurations. (rust/lance-encoding/src/encodings/physical/general.rs:147-172)

### lance_encoding::encodings::physical::general::tests::TestCase::inner_encoder

private; field.

```rust
inner_encoder: Box<dyn MiniBlockCompressor>,
```

cfg(test) imports include Arrow arrays, default strategy and RLE/value encoders. miniblock_context constructs (0,true,true). Private Debug TestCase holds name, boxed inner, config, DataBlock, expected_compressed and min_compression_ratio. Despite min name, test uses it as maximum allowed ratio. No test feature guards for selected Zstd/LZ4 configurations. (rust/lance-encoding/src/encodings/physical/general.rs:147-172)

### lance_encoding::encodings::physical::general::tests::TestCase::min_compression_ratio

private; field.

```rust
min_compression_ratio: f32, // Minimum compression ratio if compressed
```

cfg(test) imports include Arrow arrays, default strategy and RLE/value encoders. miniblock_context constructs (0,true,true). Private Debug TestCase holds name, boxed inner, config, DataBlock, expected_compressed and min_compression_ratio. Despite min name, test uses it as maximum allowed ratio. No test feature guards for selected Zstd/LZ4 configurations. (rust/lance-encoding/src/encodings/physical/general.rs:147-172)

### lance_encoding::encodings::physical::general::tests::TestCase::name

private; field.

```rust
name: &'static str,
```

cfg(test) imports include Arrow arrays, default strategy and RLE/value encoders. miniblock_context constructs (0,true,true). Private Debug TestCase holds name, boxed inner, config, DataBlock, expected_compressed and min_compression_ratio. Despite min name, test uses it as maximum allowed ratio. No test feature guards for selected Zstd/LZ4 configurations. (rust/lance-encoding/src/encodings/physical/general.rs:147-172)


### lance_encoding::encodings::physical::value::tests

private; module.

```rust
mod tests {
```

cfg(test) private mod tests imports Arrow types/generators and shared harness. Comment calls it public and says PRIMITIVE_TYPES shared, but neither module nor constant has pub. miniblock_context returns(0,true,true). No local feature guards. (rust/lance-encoding/src/encodings/physical/value.rs:825-859)

### lance_encoding::encodings::physical::value::tests::create_random_fsl

private; function; test.

```rust
fn create_random_fsl() -> Arc<dyn Array> {
```

create_random_fsl builds nullable Int32 leaf, nullable inner FSL4,nullable middle FSL4,outer FSL2, with8192 outer rows. Comment says256Ki rows/~1MiB: actual leaf count is8192*2*4*4=262144; outer rows are8192. Random-null probability0.1 at leaf/two inner levels; no explicit seed here. (rust/lance-encoding/src/encodings/physical/value.rs:1236-1250)

Callees: Observed lexical call expressions (not a resolved call graph): array::rand_type, .with_random_nulls, array::cycle_vec, Dimension::from, .anon_col, .into_batch_rows, RowCount::from, .unwrap, .column, .clone.

### lance_encoding::encodings::physical::value::tests::create_simple_fsl

private; function; test.

```rust
fn create_simple_fsl() -> FixedSizeListArray {
```

create_simple_fsl creates three outer rows of2 inner lists, each dimension2, Int32 child12 with explicit child/list validity. Parent outer validity absent. Example has mixed inner null lists/items and includes underlying values under null parents. Both dimensions equal, so it cannot reveal unequal-dimension arithmetic in simple_per_value_fsl; it also uses nullable path. (rust/lance-encoding/src/encodings/physical/value.rs:1026-1057)

Callees: Observed lexical call expressions (not a resolved call graph): Arc::new, Int32Array::from, Field::new, BooleanBuffer::from, FixedSizeListArray::new, .clone, NullBuffer::new, DataType::FixedSizeList.

### lance_encoding::encodings::physical::value::tests::fsl_value_miniblock_stress

private; function; test.

```rust
fn fsl_value_miniblock_stress() {
```

Mini-block stress encodes whole random FSL page, extracts FSL descriptor, passes concatenated output buffers directly to one decoder call with whole row count, then asserts Arrow equality. It does not independently slice chunk buffers from chunk metadata, so it does not test arbitrary per-chunk validity padding or partial-read reconstruction. (rust/lance-encoding/src/encodings/physical/value.rs:1251-1281)

Callees: Observed lexical call expressions (not a resolved call graph): DataBlock::from_arrays, std::slice::from_ref, .len, ValueEncoder::default, MiniBlockCompressor::compress, .unwrap, Compression::FixedSizeList, ValueDecompressor::from_fsl, .as_ref, MiniBlockDecompressor::decompress, .into_arrow, .data_type, .clone.

### lance_encoding::encodings::physical::value::tests::fsl_value_per_value_stress

private; function; test.

```rust
fn fsl_value_per_value_stress() {
```

Per-value stress uses same random nullable FSL generator, requires Fixed output/FSL descriptor, decodes with explicit row count and asserts complete Arrow equality. Nullable descendant dispatch means its unequal dimensions2/4/4 do not exercise simple encoder loop. (rust/lance-encoding/src/encodings/physical/value.rs:1282-1316)

Callees: Observed lexical call expressions (not a resolved call graph): DataBlock::from_arrays, std::slice::from_ref, .len, ValueEncoder::default, PerValueCompressor::compress, .unwrap, Compression::FixedSizeList, ValueDecompressor::from_fsl, .as_ref, PerValueDataBlock::Fixed, FixedPerValueDecompressor::decompress, .into_arrow, .data_type, .clone.

### lance_encoding::encodings::physical::value::tests::miniblock_context

private; function; test.

```rust
fn miniblock_context() -> MiniBlockCompressionContext {
```

cfg(test) private mod tests imports Arrow types/generators and shared harness. Comment calls it public and says PRIMITIVE_TYPES shared, but neither module nor constant has pub. miniblock_context returns(0,true,true). No local feature guards. (rust/lance-encoding/src/encodings/physical/value.rs:825-859)

Callees: Observed lexical call expressions (not a resolved call graph): MiniBlockCompressionContext::new.

### lance_encoding::encodings::physical::value::tests::PRIMITIVE_TYPES

private; constant.

```rust
const PRIMITIVE_TYPES: &[DataType] = &[         DataType::Null,         DataType::FixedSizeBinary(2),         DataType::Date32,         DataType::Date64,         DataType::Int8,         DataType::Int16,         DataType::Int32,         DataType::Int64,         DataType::UInt8,         DataType::UInt16,         DataType::UInt32,         DataType::UInt64,         DataType::Float16,         DataType::Float32,         DataType::Float64,         DataType::Decimal128(10, 10),         DataType::Decimal256(10, 10),         DataType::Timestamp(TimeUnit::Nanosecond, None),         DataType::Time32(TimeUnit::Second),         DataType::Time64(TimeUnit::Nanosecond),         DataType::Duration(TimeUnit::Second),         // The Interval type is supported by the reader but the writer works with Lance schema         // at the moment and Lance schema can't parse interval         // DataType::Interval(IntervalUnit::DayTime),     ];
```

Private PRIMITIVE_TYPES lists21 types: Null,FixedSizeBinary2,Date32/64,Int/UInt8/16/32/64,Float16/32/64,Decimal128/256(10,10),TimestampNanosecond,None,Time32Second,Time64Nanosecond,DurationSecond. Interval is commented out with schema-parser rationale. Boolean is absent from this list. No executed support matrix is established. (rust/lance-encoding/src/encodings/physical/value.rs:860-886)

### lance_encoding::encodings::physical::value::tests::regress_list_fsl

private; function; test.

```rust
async fn regress_list_fsl() {
```

regress_list_fsl uses list offsets[0,393,755,1156,1536] over1536 FSL<UInt8,16> rows of zeros; batch_size1 and structural modes target rows spanning several mini-block chunks, including all-preamble chunks. Comment typo all-premable preserved as intent, not another format term. (rust/lance-encoding/src/encodings/physical/value.rs:1217-1235)

Callees: Observed lexical call expressions (not a resolved call graph): UInt8Array::from, Arc::new, Field::new, FixedSizeListArray::new, .data_type, .clone, ListArray::new, OffsetBuffer::new, TestCases::default, .with_structural_encodings, .with_batch_size, HashMap::new.

### lance_encoding::encodings::physical::value::tests::test_decimal128_dictionary_encoding

private; function; test.

```rust
async fn test_decimal128_dictionary_encoding(         #[values(             TestEncoding::StructuralU16,             TestEncoding::StructuralU32,             TestEncoding::StructuralSparse         )]         encoding: TestEncoding,     ) {
```

Decimal128 dictionary test selects U16/U32/Sparse (3 cases), expects dictionary, cycles100 values1000times into100000 Some i128 values. Variable repeated_strings actually contains decimals. No explicit precision/scale assignment or local byte check. (rust/lance-encoding/src/encodings/physical/value.rs:966-989)

Callees: Observed lexical call expressions (not a resolved call graph): TestCases::default, .with_encoding, .with_expected_encoding, .collect, .iter, .cycle, .take, .len, .map, Arc::new, Decimal128Array::from, HashMap::new.

### lance_encoding::encodings::physical::value::tests::test_fsl_all_null

private; function; test.

```rust
async fn test_fsl_all_null() {
```

Two structural harness tests cover all-null Int32 children under outer list validity, and a documented regression of two FSL<Float32,4> rows with all eight children null but no outer nulls. The latter explains why synthesized validity prevents width0/control-word-free full-zip rows. Neither forces a particular layout in its local configuration beyond structural modes. (rust/lance-encoding/src/encodings/physical/value.rs:1186-1216)

Callees: Observed lexical call expressions (not a resolved call graph): Arc::new, Field::new, BooleanBuffer::from, FixedSizeListArray::new, NullBuffer::new, TestCases::default, .with_structural_encodings, HashMap::new.

### lance_encoding::encodings::physical::value::tests::test_fsl_nullable_child_all_null_no_outer_nulls

private; function; test.

```rust
async fn test_fsl_nullable_child_all_null_no_outer_nulls() {
```

Two structural harness tests cover all-null Int32 children under outer list validity, and a documented regression of two FSL<Float32,4> rows with all eight children null but no outer nulls. The latter explains why synthesized validity prevents width0/control-word-free full-zip rows. Neither forces a particular layout in its local configuration beyond structural modes. (rust/lance-encoding/src/encodings/physical/value.rs:1186-1216)

Callees: Observed lexical call expressions (not a resolved call graph): Arc::new, Field::new, FixedSizeListArray::new, TestCases::default, .with_structural_encodings, HashMap::new.

### lance_encoding::encodings::physical::value::tests::test_fsl_nullable_items

private; function; test.

```rust
async fn test_fsl_nullable_items(         #[values(             TestEncoding::Array,             TestEncoding::StructuralU16,             TestEncoding::StructuralU32,             TestEncoding::StructuralSparse         )]         encoding: TestEncoding,     ) {
```

Nullable-item matrix covers4 encoding modes. Seed0 generator creates FSL<UInt32,128> child nulls0.5 and outer null request0.2,1026rows, then supplies source slices1..513 and513..1026 (1025 rows, omitting original row0). Page4096,batch257,range510..515 and indices[0,511,512,1024] stress offsets across slices/pages. Harness owns further assertions. (rust/lance-encoding/src/encodings/physical/value.rs:1317-1355)

Callees: Observed lexical call expressions (not a resolved call graph): .with_seed, Seed::from, .anon_col, Dimension::from, .with_random_nulls, .into_batch_rows, RowCount::from, .unwrap, .column, .clone, TestCases::default, .with_page_sizes, .with_encoding, .with_batch_size, .with_range, .with_indices, .slice, HashMap::new.

### lance_encoding::encodings::physical::value::tests::test_fsl_value_compression_miniblock

private; function; test.

```rust
fn test_fsl_value_compression_miniblock() {
```

Direct mini-block FSL test asserts outer count3,three buffers,one chunk,sizes[1,2,48],log0. Requires FSL descriptor, constructs decoder, decodes all returned buffers as one chunk, converts to Arrow and asserts full array equality. This is a strong local nullable fixture, read not run. (rust/lance-encoding/src/encodings/physical/value.rs:1058-1091)

Callees: Observed lexical call expressions (not a resolved call graph): DataBlock::from_array, .clone, ValueEncoder::default, MiniBlockCompressor::compress, .unwrap, .len, Compression::FixedSizeList, ValueDecompressor::from_fsl, .as_ref, MiniBlockDecompressor::decompress, .into_arrow, .data_type.

### lance_encoding::encodings::physical::value::tests::test_fsl_value_compression_per_value

private; function; test.

```rust
fn test_fsl_value_compression_per_value() {
```

Direct nullable per-value FSL test asserts row width144bits,count3 and54bytes (two validity bytes+16 leaf bytes per row), requires FSL descriptor, checks decoded_size_bytes=None, decodes and compares complete Arrow array. It exercises nullable helper, not the simple unequal-dimension case. (rust/lance-encoding/src/encodings/physical/value.rs:1145-1185)

Callees: Observed lexical call expressions (not a resolved call graph): DataBlock::from_array, .clone, ValueEncoder::default, PerValueCompressor::compress, .unwrap, PerValueDataBlock::Fixed, .len, Compression::FixedSizeList, ValueDecompressor::from_fsl, .as_ref, FixedPerValueDecompressor::decoded_size_bytes, FixedPerValueDecompressor::decompress, .into_arrow, .data_type.

### lance_encoding::encodings::physical::value::tests::test_large_primitive

private; function; test.

```rust
async fn test_large_primitive(         #[values(             TestEncoding::Array,             TestEncoding::StructuralU16,             TestEncoding::StructuralU32,             TestEncoding::StructuralSparse         )]         encoding: TestEncoding,         #[values(4096, 1024 * 1024)] page_size: u64,         #[values(false, true)] use_slicing: bool,     ) {
```

Large primitive rstest covers Array/U16/U32/Sparse x page4096/1MiB x slicingfalse/true (16 cases before harness expansion). Datatype is non-null FSL<Int32,128> and shared random-case helper. (rust/lance-encoding/src/encodings/physical/value.rs:947-965)

Callees: Observed lexical call expressions (not a resolved call graph): DataType::FixedSizeList, Arc::new, Field::new.

### lance_encoding::encodings::physical::value::tests::test_miniblock_stress

private; function; test.

```rust
async fn test_miniblock_stress(         #[values(false, true)] mixed_validity: bool,         #[values(10, 100, 1500, 15000)] batch_size: u32,         #[values(1000, 2000, 3000, 60000)] page_size: u64,         #[values(             TestEncoding::StructuralU16,             TestEncoding::StructuralU32,             TestEncoding::StructuralSparse         )]         encoding: TestEncoding,     ) {
```

Mini-block stress matrix2 validity modes x4 batch sizes10/100/1500/15000 x4 page sizes1000/2000/3000/60000 x3 structural encodings=96 cases before harness expansion. Fixture100 arrays each100 i32, alternating nulls or fully valid; shared harness checks behavior. No timed budget result. (rust/lance-encoding/src/encodings/physical/value.rs:990-1025)

Callees: Observed lexical call expressions (not a resolved call graph): .map, Arc::new, Int32Array::from_iter, Int32Array::from_iter_values, .collect, TestCases::default, .with_page_sizes, .with_batch_size, .with_encoding, HashMap::new.

### lance_encoding::encodings::physical::value::tests::test_mixed_page_validity

private; function; test.

```rust
async fn test_mixed_page_validity() {
```

Mixed-page validity supplies first array[1,2] all valid, second[3,null,5], page_size1 and default harness encodings (no explicit structural override here). All17 test functions and helpers were read, not executed. No local test directly covers nonnullable unequal nested dimensions, zero FSL dimension, malformed descriptor constantSome, or raw byte length/count mismatches. (rust/lance-encoding/src/encodings/physical/value.rs:1387-1396)

Callees: Observed lexical call expressions (not a resolved call graph): Arc::new, Int32Array::from_iter_values, Int32Array::from_iter, TestCases::default, .with_page_sizes, HashMap::new.

### lance_encoding::encodings::physical::value::tests::test_simple_range

private; function; test.

```rust
async fn test_simple_range() {
```

Async simple-value test uses six Int32 items including one null, explicit ranges0..3,0..2,1..3 and indices[0,1,2],[1],[2], across structural harness modes. Simple-range test uses5000 alternating valid/null integers and default structural cases. Assertions are delegated to harness, not local codec bytes. (rust/lance-encoding/src/encodings/physical/value.rs:887-920)

Callees: Observed lexical call expressions (not a resolved call graph): Arc::new, Int32Array::from_iter, .map, TestCases::default, .with_structural_encodings, HashMap::default.

### lance_encoding::encodings::physical::value::tests::test_simple_value

private; function; test.

```rust
async fn test_simple_value() {
```

Async simple-value test uses six Int32 items including one null, explicit ranges0..3,0..2,1..3 and indices[0,1,2],[1],[2], across structural harness modes. Simple-range test uses5000 alternating valid/null integers and default structural cases. Assertions are delegated to harness, not local codec bytes. (rust/lance-encoding/src/encodings/physical/value.rs:887-920)

Callees: Observed lexical call expressions (not a resolved call graph): Arc::new, Int32Array::from, TestCases::default, .with_range, .with_indices, .with_structural_encodings, HashMap::default.

### lance_encoding::encodings::physical::value::tests::test_value_encoding_verification

private; function; test.

```rust
async fn test_value_encoding_verification() {
```

Encoding-verification test expects flat across structural modes. Explicit none+BSS off on unique0..1000 ints; automatic fallback+BSS off on100 values i*73+19. Comments about avoiding RLE/bitpacking are selection intentions backed by expected-name assertion through harness, not standalone algorithm measurements. (rust/lance-encoding/src/encodings/physical/value.rs:1356-1386)

Callees: Observed lexical call expressions (not a resolved call graph): TestCases::default, .with_expected_encoding, .with_structural_encodings, HashMap::new, .insert, .to_string, Arc::new, Int32Array::from, .collect, .map.

### lance_encoding::encodings::physical::value::tests::test_value_primitive

private; function; test.

```rust
async fn test_value_primitive() {
```

Primitive test loops21 datatypes with enumeration seed,1025rows,batch1025,page4096, expected flat and metadata compression=none. Generates one array each and delegates round trip. This plain loop is not a parameterized test; no runtime results inferred. (rust/lance-encoding/src/encodings/physical/value.rs:921-946)

Callees: Observed lexical call expressions (not a resolved call graph): TestCases::default, .with_batch_size, .with_page_sizes, .with_expected_encoding, HashMap::from, .to_string, .iter, .enumerate, .with_seed, Seed::from, .anon_col, array::rand_type, .into_batch_rows, RowCount::from, .unwrap, .column, .clone.

### lance_encoding::encodings::physical::value::tests::test_value_primitive::NUM_ROWS

private; constant.

```rust
const NUM_ROWS: u32 = 1025;
```

Primitive test loops21 datatypes with enumeration seed,1025rows,batch1025,page4096, expected flat and metadata compression=none. Generates one array each and delegates round trip. This plain loop is not a parameterized test; no runtime results inferred. (rust/lance-encoding/src/encodings/physical/value.rs:921-946)

### lance_encoding::encodings::physical::value::tests::test_wide_value_miniblock_returns_error

private; function; test.

```rust
fn test_wide_value_miniblock_returns_error(         #[case] array: ArrayRef,         #[case] expected_min_values: u64,     ) {
```

Two named wide-value rstest cases require InvalidInput plus too wide substring and expected minimum-values text2 or16. No successful boundary8185/8186 or configured-small maximum test. Tests assert source diagnostic behavior, not overall selection fallback. (rust/lance-encoding/src/encodings/physical/value.rs:1117-1144)

Callees: Observed lexical call expressions (not a resolved call graph): DataBlock::from_array, ValueEncoder::default, MiniBlockCompressor::compress, .expect_err, .to_string, .contains.

### lance_encoding::encodings::physical::value::tests::wide_fixed_size_binary

private; function; test.

```rust
fn wide_fixed_size_binary() -> ArrayRef {
```

wide_fixed_size_binary creates four5000-byte0xAB values. wide_fixed_size_list_bool creates two outer rows with4095 Boolean values each, all false and no outer nulls. Comment calls16 values smallest unit; actual selector starts eight values but rejects based on two-word16-value estimated bytes. (rust/lance-encoding/src/encodings/physical/value.rs:1092-1116)

Callees: Observed lexical call expressions (not a resolved call graph): Arc::new, arrow_array::FixedSizeBinaryArray::try_from_sparse_iter_with_size, std::iter::repeat_n, .as_slice, .unwrap.

### lance_encoding::encodings::physical::value::tests::wide_fixed_size_list_bool

private; function; test.

```rust
fn wide_fixed_size_list_bool() -> ArrayRef {
```

wide_fixed_size_binary creates four5000-byte0xAB values. wide_fixed_size_list_bool creates two outer rows with4095 Boolean values each, all false and no outer nulls. Comment calls16 values smallest unit; actual selector starts eight values but rejects based on two-word16-value estimated bytes. (rust/lance-encoding/src/encodings/physical/value.rs:1092-1116)

Callees: Observed lexical call expressions (not a resolved call graph): arrow_array::BooleanArray::from, Arc::new, Field::new, FixedSizeListArray::new.

### lance_encoding::encodings::physical::binary::tests

private; module.

```rust
mod tests {
```

Private cfg(test) module imports async/rstest harness, four encoding modes, binary/String arrays, encoding strategy and datagen. Tests are source evidence, not run by this KB task. (rust/lance-encoding/src/encodings/physical/binary.rs:716-741)

### lance_encoding::encodings::physical::binary::tests::encoded_binary_block

private; function; test.

```rust
fn encoded_binary_block(bits_per_offset: u8) -> Vec<u8> {
```

Private test helper encoded_binary_block accepts32/64, builds offsets0,5,9,14 for alphabetagamma count3 and returns output of VariableEncoder block compression. Other widths unreachable. (rust/lance-encoding/src/encodings/physical/binary.rs:1346-1368)

Callees: Observed lexical call expressions (not a resolved call graph): LanceBuffer::reinterpret_vec, DataBlock::VariableWidth, LanceBuffer::copy_slice, BlockInfo::new, BlockCompressor::compress, super::VariableEncoder::default, .unwrap, .as_ref, .to_vec.

### lance_encoding::encodings::physical::binary::tests::test_binary

private; function; test.

```rust
async fn test_binary(         #[values(STRUCTURAL_ENCODING_MINIBLOCK, STRUCTURAL_ENCODING_FULLZIP)]         structural_encoding: &str,         #[values(DataType::Utf8, DataType::Binary)] data_type: DataType,         #[values(             TestEncoding::Array,             TestEncoding::StructuralU16,             TestEncoding::StructuralU32,             TestEncoding::StructuralSparse         )]         encoding: TestEncoding,         #[values(4096, 1024 * 1024)] page_size: u64,         #[values(false, true)] use_slicing: bool,     ) {
```

test_binary parameterizes forced mini/full layout, Utf8/Binary,4 modes,2 page limits,2 slicing choices:64 configurations with nullable data. Broad roundtrip coverage does not prove direct invalid-input behavior. (rust/lance-encoding/src/encodings/physical/binary.rs:765-790)

Callees: Observed lexical call expressions (not a resolved call graph): HashMap::new, .insert, .to_string, .into, Field::new, .with_metadata.

### lance_encoding::encodings::physical::binary::tests::test_binary_block_bad_offsets_rejected_at_arrow_conversion

private; function; test.

```rust
fn test_binary_block_bad_offsets_rejected_at_arrow_conversion(         #[case] bits_per_offset: u8,         #[case] mutated_offset_index: usize,         #[case] mutated_offset_value: u64,         #[case] expected_message: &str,     ) {
```

Four named parameter cases corrupt terminal32 to100000,terminal64 to15,or middle offset to4 for either width. BinaryBlockDecompressor must succeed; converting to Binary/LargeBinary Arrow with false still must return CorruptFile and expected substring. This explicitly locates full offset validation after block decompression. (rust/lance-encoding/src/encodings/physical/binary.rs:1369-1404)

Callees: Observed lexical call expressions (not a resolved call graph): .copy_from_slice, .to_le_bytes, super::BinaryBlockDecompressor::default, .decompress, LanceBuffer::from, .unwrap, .into_arrow, .unwrap_err, .to_string, .contains.

### lance_encoding::encodings::physical::binary::tests::test_binary_block_rejects_corrupt_structure

private; function; test.

```rust
fn test_binary_block_rejects_corrupt_structure() {
```

Structure test rejects nonzero first offset5,external count4 against3-row data,and2-byte header, checking CorruptFile/message. Overall18 test functions,17 active and one ignored, plus helpers. No direct search budget/cap tests, zero-row decode, prefix decode, invalid from_variable widths or old-header regression appears locally; tests inspected only. (rust/lance-encoding/src/encodings/physical/binary.rs:1405-1436)

Callees: Observed lexical call expressions (not a resolved call graph): super::BinaryBlockDecompressor::default, .copy_from_slice, .to_le_bytes, .decompress, LanceBuffer::from, .unwrap_err, .to_string, .contains.

### lance_encoding::encodings::physical::binary::tests::test_binary_dictionary_encoding

private; function; test.

```rust
async fn test_binary_dictionary_encoding(         #[values(true, false)] with_nulls: bool,         #[values(100, 500, 35000)] dict_size: u32,     ) {
```

Dictionary test parameterizes nullability and dictionary sizes100,500,35000 (six cases),70000 rows and nullable every7th item, then exercises structural-mode harness. This is dictionary selection integration, not a local dictionary implementation. (rust/lance-encoding/src/encodings/physical/binary.rs:1072-1099)

Callees: Observed lexical call expressions (not a resolved call graph): TestCases::default, .with_structural_encodings, .map, .to_string, .collect, .iter, .cycle, .take, .enumerate, .clone, Arc::new, StringArray::from, HashMap::new.

### lance_encoding::encodings::physical::binary::tests::test_binary_encoding_verification

private; function; test.

```rust
async fn test_binary_encoding_verification() {
```

Encoding verification requires variable encoding automatically for1000 random10-byte UTF-8 strings, and explicitly disables compression for2000 random50-byte strings. Uses structural cases and expected encoding name. (rust/lance-encoding/src/encodings/physical/binary.rs:1100-1129)

Callees: Observed lexical call expressions (not a resolved call graph): TestCases::default, .with_expected_encoding, .with_structural_encodings, lance_datagen::gen_batch, .anon_col, lance_datagen::array::rand_utf8, ByteCount::from, .into_batch_rows, RowCount::from, .unwrap, .column, .clone, HashMap::new, HashMap::from, .to_string.

### lance_encoding::encodings::physical::binary::tests::test_binary_fsst

private; function; test.

```rust
async fn test_binary_fsst(         #[values(STRUCTURAL_ENCODING_MINIBLOCK, STRUCTURAL_ENCODING_FULLZIP)]         structural_encoding: &str,         #[values(DataType::Binary, DataType::Utf8)] data_type: DataType,         #[values(             TestEncoding::StructuralU16,             TestEncoding::StructuralU32,             TestEncoding::StructuralSparse         )]         encoding: TestEncoding,         #[values(4096, 1024 * 1024)] page_size: u64,         #[values(false, true)] use_slicing: bool,     ) {
```

test_binary_fsst adds forced fsst for2layouts*2normaltypes*3modes*2pages*2slice=48 configurations. Nullable test uses default TestCases and references issue4783 TODO; no external issue status verified. (rust/lance-encoding/src/encodings/physical/binary.rs:791-820)

Callees: Observed lexical call expressions (not a resolved call graph): HashMap::new, .insert, .to_string, .into, Field::new, .with_metadata, TestCases::default, .with_encoding, .with_page_sizes, .with_slicing_modes.

### lance_encoding::encodings::physical::binary::tests::test_binary_miniblock_rejects_corrupt_offsets

private; function; test.

```rust
fn test_binary_miniblock_rejects_corrupt_offsets() {
```

Corrupt-mini test local chunk_u32 builds offset bytes/payload padded to8.32-bit cases terminal out-of-bounds, descending offsets, table overlap, insufficient offset count and nonmultiple total size; each requires CorruptFile and message substring. Valid alpha,beta,gamma case asserts entire payload and rebased offsets0,5,9,14. Same test local chunk_u64 pads to8 and covers64-bit out-of-bounds and table overlap errors. Does not add64-bit descending, insufficient-table or nonmultiple cases here. (rust/lance-encoding/src/encodings/physical/binary.rs:1246-1305; rust/lance-encoding/src/encodings/physical/binary.rs:1306-1345)

Callees: Observed lexical call expressions (not a resolved call graph): .iter, .flat_map, .to_le_bytes, .collect, .extend_from_slice, .resize, .len, .next_multiple_of, LanceBuffer::from, BinaryMiniBlockDecompressor::new, .decompress, .unwrap_err, .to_string, .contains, .unwrap, DataBlock::VariableWidth, .as_ref, LanceBuffer::reinterpret_vec.

### lance_encoding::encodings::physical::binary::tests::test_binary_miniblock_rejects_corrupt_offsets::chunk_u32

private; function; test.

```rust
fn chunk_u32(offsets: &[u32], values: &[u8]) -> LanceBuffer {
```

Corrupt-mini test local chunk_u32 builds offset bytes/payload padded to8.32-bit cases terminal out-of-bounds, descending offsets, table overlap, insufficient offset count and nonmultiple total size; each requires CorruptFile and message substring. Valid alpha,beta,gamma case asserts entire payload and rebased offsets0,5,9,14. (rust/lance-encoding/src/encodings/physical/binary.rs:1246-1305)

Callees: Observed lexical call expressions (not a resolved call graph): .iter, .flat_map, .to_le_bytes, .collect, .extend_from_slice, .resize, .len, .next_multiple_of, LanceBuffer::from.

### lance_encoding::encodings::physical::binary::tests::test_binary_miniblock_rejects_corrupt_offsets::chunk_u64

private; function; test.

```rust
fn chunk_u64(offsets: &[u64], values: &[u8]) -> LanceBuffer {
```

Same test local chunk_u64 pads to8 and covers64-bit out-of-bounds and table overlap errors. Does not add64-bit descending, insufficient-table or nonmultiple cases here. (rust/lance-encoding/src/encodings/physical/binary.rs:1306-1345)

Callees: Observed lexical call expressions (not a resolved call graph): .iter, .flat_map, .to_le_bytes, .collect, .extend_from_slice, .resize, .len, .next_multiple_of, LanceBuffer::from.

### lance_encoding::encodings::physical::binary::tests::test_binary_miniblock_with_misaligned_buffer

private; function; test.

```rust
fn test_binary_miniblock_with_misaligned_buffer() {
```

Misaligned32-bit decoder fixture prefixes1 byte, offsets12,15,20 and payloadABCXYZ plus two zeros. Assert pointer misalignment, decode2rows, and compare first6 bytes only. Does not assert full offsets or prove padding excluded; terminal20 includes the two trailing zero bytes in visible values. Misaligned64 fixture prefixes3bytes, offsets24,29,40 and HelloWorld plus6zeros. Assert misalignment, rows2 and first10 bytes only. Entire visible decoded payload also includes zero padding selected by terminal40. Tests LanceBuffer typed-borrow alignment fallback indirectly. (rust/lance-encoding/src/encodings/physical/binary.rs:1130-1192; rust/lance-encoding/src/encodings/physical/binary.rs:1193-1245)

Callees: Observed lexical call expressions (not a resolved call graph): Vec::new, .extend_from_slice, .to_le_bytes, Vec::with_capacity, .len, .push, bytes::Bytes::from, .slice, LanceBuffer::from_bytes, .as_ref, .as_ptr, .align_offset, .decompress, .is_ok, DataBlock::VariableWidth.

### lance_encoding::encodings::physical::binary::tests::test_empty_strings

private; function; test.

```rust
async fn test_empty_strings() {
```

Empty-string test checks three permutations of abc,empty,null with takes0,1,2 and single-position takes, then repeats with batch size1. Also tests empty,null,empty with ranges/takes under default and batch1; empty values and nulls are distinct. (rust/lance-encoding/src/encodings/physical/binary.rs:1011-1051)

Callees: Observed lexical call expressions (not a resolved call graph): StringBuilder::new, .append_option, Arc::new, .finish, TestCases::default, .with_indices, .clone, HashMap::new, .with_batch_size, StringArray::from, .with_range.

### lance_encoding::encodings::physical::binary::tests::test_fsst_large_binary

private; function; test.

```rust
async fn test_fsst_large_binary(         #[values(STRUCTURAL_ENCODING_MINIBLOCK, STRUCTURAL_ENCODING_FULLZIP)]         structural_encoding: &str,         #[values(DataType::LargeBinary, DataType::LargeUtf8)] data_type: DataType,         #[values(             TestEncoding::StructuralU16,             TestEncoding::StructuralU32,             TestEncoding::StructuralSparse         )]         encoding: TestEncoding,         #[values(4096, 1024 * 1024)] page_size: u64,         #[values(false, true)] use_slicing: bool,     ) {
```

test_fsst_large_binary similarly uses LargeBinary/LargeUtf8 across48 combinations, with basic test cases. Expected FSST metadata/strategy goes through harness; does not cover malformed symbol tables here. (rust/lance-encoding/src/encodings/physical/binary.rs:821-852)

Callees: Observed lexical call expressions (not a resolved call graph): HashMap::new, .insert, .to_string, .into, Field::new, .with_metadata, TestCases::basic, .with_encoding, .with_page_sizes, .with_slicing_modes.

### lance_encoding::encodings::physical::binary::tests::test_jumbo_string

private; function; test.

```rust
async fn test_jumbo_string() {
```

Ignored jumbo test creates5000 strings of1MiB in LargeString (>4GiB), uses no_validation harness. #[ignore] has no issue URL. Comment about lists of lists disagrees with actual string fixture. It is not active runtime evidence or established >4GiB correctness. (rust/lance-encoding/src/encodings/physical/binary.rs:1052-1071)

Callees: Observed lexical call expressions (not a resolved call graph): LargeStringBuilder::new, String::from_iter, .map, .append_option, Arc::new, .finish, TestCases::default, .without_validation, HashMap::new.

### lance_encoding::encodings::physical::binary::tests::test_large_binary_types

private; function; test.

```rust
async fn test_large_binary_types(         #[values(DataType::LargeBinary, DataType::LargeUtf8)] data_type: DataType,         #[values(             TestEncoding::Array,             TestEncoding::StructuralU16,             TestEncoding::StructuralU32,             TestEncoding::StructuralSparse         )]         encoding: TestEncoding,         #[values(4096, 1024 * 1024)] page_size: u64,         #[values(false, true)] use_slicing: bool,     ) {
```

test_large_binary_types spans2types*4modes*2pages*2slice=32 configurations with nullable generated arrays and default cases. (rust/lance-encoding/src/encodings/physical/binary.rs:853-870)

Callees: Observed lexical call expressions (not a resolved call graph): Field::new.

### lance_encoding::encodings::physical::binary::tests::test_page_split_parts_do_not_evenly_divide_rows

private; function; test.

```rust
async fn test_page_split_parts_do_not_evenly_divide_rows(         #[values(             TestEncoding::Array,             TestEncoding::StructuralU16,             TestEncoding::StructuralU32,             TestEncoding::StructuralSparse         )]         encoding: TestEncoding,     ) {
```

Nondivisible page test makes90 values of45000 bytes, splits into4 source parts and uses1MiB page size across4 modes. Targets row partition/remainder handling rather than compression efficiency. (rust/lance-encoding/src/encodings/physical/binary.rs:985-1010)

Callees: Observed lexical call expressions (not a resolved call graph): String::from_iter, .map, StringArray::from_iter_values, .clone, Arc::new, TestCases::default, .with_max_page_size, .with_encoding, HashMap::new.

### lance_encoding::encodings::physical::binary::tests::test_simple_binary

private; function; test.

```rust
async fn test_simple_binary(         #[values(STRUCTURAL_ENCODING_MINIBLOCK, STRUCTURAL_ENCODING_FULLZIP)]         structural_encoding: &str,         #[values(DataType::Utf8, DataType::Binary)] data_type: DataType,     ) {
```

test_simple_binary spans2layouts*2types, data abc,null,pqr,null,m. Adds ranges0..2,0..3,1..3 and take0,1,3,4. Covers nullable interior/end placement, not direct offset header corruption. (rust/lance-encoding/src/encodings/physical/binary.rs:905-933)

Callees: Observed lexical call expressions (not a resolved call graph): StringArray::from, arrow_cast::cast, .unwrap, HashMap::new, .insert, .to_string, .into, TestCases::default, .with_range, .with_indices, Arc::new.

### lance_encoding::encodings::physical::binary::tests::test_sliced_utf8

private; function; test.

```rust
async fn test_sliced_utf8() {
```

test_sliced_utf8 constructs abc,de,null,fgh and slices(1,3), exercising nonzero source offset/nullable strings with three ranges. (rust/lance-encoding/src/encodings/physical/binary.rs:934-950)

Callees: Observed lexical call expressions (not a resolved call graph): StringArray::from, .slice, TestCases::default, .with_range, Arc::new, HashMap::new.

### lance_encoding::encodings::physical::binary::tests::test_small_strings

private; function; test.

```rust
async fn test_small_strings(         #[values(STRUCTURAL_ENCODING_MINIBLOCK, STRUCTURAL_ENCODING_FULLZIP)]         structural_encoding: &str,         #[values(             TestEncoding::Array,             TestEncoding::StructuralU16,             TestEncoding::StructuralU32,             TestEncoding::StructuralSparse         )]         encoding: TestEncoding,         #[values(4096, 1024 * 1024)] page_size: u64,         #[values(false, true)] use_slicing: bool,     ) {
```

test_small_strings builds user_ counter strings, parameterizes2layouts*4modes*2pages*2slice=32, and validates through harness. Explicit field metadata forces layout when requested. (rust/lance-encoding/src/encodings/physical/binary.rs:871-904)

Callees: Observed lexical call expressions (not a resolved call graph): HashMap::new, .insert, .to_string, .into, Field::new, .with_metadata, Box::new, FnArrayGeneratorProvider::new, lance_datagen::array::utf8_prefix_plus_counter, TestCases::basic, .with_encoding, .with_page_sizes, .with_slicing_modes.

### lance_encoding::encodings::physical::binary::tests::test_utf8_binary

private; function; test.

```rust
async fn test_utf8_binary(         #[values(             TestEncoding::StructuralU16,             TestEncoding::StructuralU32,             TestEncoding::StructuralSparse         )]         encoding: TestEncoding,         #[values(4096, 1024 * 1024)] page_size: u64,         #[values(false, true)] use_slicing: bool,     ) {
```

test_utf8_binary parameterizes3 structural modes,2 page maxima and2 slicing choices:12 configurations of nonnullable UTF-8. Uses harness to validate generic IO/ranges/takes, not a standalone mini-block byte fixture. (rust/lance-encoding/src/encodings/physical/binary.rs:742-764)

Callees: Observed lexical call expressions (not a resolved call graph): Field::new, TestCases::basic, .with_encoding, .with_page_sizes, .with_slicing_modes.

### lance_encoding::encodings::physical::binary::tests::test_value_bigger_than_max_page_size

private; function; test.

```rust
async fn test_value_bigger_than_max_page_size(         #[values(             TestEncoding::Array,             TestEncoding::StructuralU16,             TestEncoding::StructuralU32,             TestEncoding::StructuralSparse         )]         encoding: TestEncoding,     ) {
```

Oversized-value test places a2MiB string among four small/null values with1MiB page limit across4 modes. Verifies a value larger than max page target is handled by harness, not a hard allocation ceiling. (rust/lance-encoding/src/encodings/physical/binary.rs:951-984)

Callees: Observed lexical call expressions (not a resolved call graph): String::from_iter, .map, StringArray::from, .to_string, TestCases::default, .with_max_page_size, .with_encoding, Arc::new, HashMap::new.

### lance_encoding::encodings::physical::byte_stream_split::tests

private; module.

```rust
mod tests {
```

Private cfg(test) f32 roundtrip uses eight values1,2.5,-3.7,4.2,+0,-0,+inf,-inf, constructsLE bytes and compares decoded numeric values. Only one chunk, no expected transpose bytes/metadata assertions. Numeric equality does not distinguish +0/-0 bit preservation; noNaN case. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:326-379)

### lance_encoding::encodings::physical::byte_stream_split::tests::test_empty_data

private; function; test.

```rust
fn test_empty_data() {
```

Empty32-bit test compresses count0 empty data, decodes zero with returned no buffers and asserts count/byte length zero. Three test functions inspected, not run. No Off/On/Auto decision tests or corruption/error cases local. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:430-456)

Callees: Observed lexical call expressions (not a resolved call graph): ByteStreamSplitEncoder::new, ByteStreamSplitDecompressor::new, DataBlock::FixedWidth, LanceBuffer::empty, BlockInfo::new, .compress, MiniBlockCompressionContext::new, .unwrap, .decompress, .len.

### lance_encoding::encodings::physical::byte_stream_split::tests::test_round_trip_f32

private; function; test.

```rust
fn test_round_trip_f32() {
```

Private cfg(test) f32 roundtrip uses eight values1,2.5,-3.7,4.2,+0,-0,+inf,-inf, constructsLE bytes and compares decoded numeric values. Only one chunk, no expected transpose bytes/metadata assertions. Numeric equality does not distinguish +0/-0 bit preservation; noNaN case. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:326-379)

Callees: Observed lexical call expressions (not a resolved call graph): ByteStreamSplitEncoder::new, ByteStreamSplitDecompressor::new, .iter, .flat_map, .to_le_bytes, .collect, DataBlock::FixedWidth, LanceBuffer::from, .len, BlockInfo::new, .compress, MiniBlockCompressionContext::new, .unwrap, .decompress, .as_ref, .as_chunks, .map, f32::from_le_bytes.

### lance_encoding::encodings::physical::byte_stream_split::tests::test_round_trip_f64

private; function; test.

```rust
fn test_round_trip_f64() {
```

f64 roundtrip mirrors same eight values and assertions at64bits, one chunk. Does not test multiple chunk boundaries, configured/input width mismatch, invalid buffers or entropy selection. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:380-429)

Callees: Observed lexical call expressions (not a resolved call graph): ByteStreamSplitEncoder::new, ByteStreamSplitDecompressor::new, .iter, .flat_map, .to_le_bytes, .collect, DataBlock::FixedWidth, LanceBuffer::from, .len, BlockInfo::new, .compress, MiniBlockCompressionContext::new, .unwrap, .decompress, .as_ref, .as_chunks, .map, f64::from_le_bytes.

### lance_encoding::encodings::physical::fsst::tests

private; module.

```rust
mod tests {
```

Private cfg(test) module: async test_fsst spans explicit false/true and3 structural modes (six configurations),5000 strings of100bytes and expected fsst name. Comments describe automatic maxlen>=5 and size>=32KiB, but complete policy also excludes binary types automatically and may select per-value compression first. (rust/lance-encoding/src/compression.rs:655-696; rust/lance-encoding/src/compression.rs:797-841) (rust/lance-encoding/src/encodings/physical/fsst.rs:389-431)

### lance_encoding::encodings::physical::fsst::tests::test_corrupt_fsst_symbol_table_is_corrupt_file

private; function; test.

```rust
fn test_corrupt_fsst_symbol_table_is_corrupt_file() {
```

Corrupt-table test compresses a repeated sentence2048times directly through dependency, asserts header switch bit24/nonzero symbol count, changes first symbol length at8+nsyms*8 to9, then dependency-decodes with map_fsst_error. Requires CorruptFile and symbol-length substring. This checks kernel/error mapper, not both wrapper paths. Tests read, not executed; invalid table-size or magic/error kinds are not exhaustively covered. (rust/lance-encoding/src/encodings/physical/fsst.rs:432-469)

Callees: Observed lexical call expressions (not a resolved call graph): .repeat, StringArray::from, .as_str, .value_data, .len, .max, .value_offsets, .as_mut, .unwrap, u64::from_ne_bytes, .try_into, .map_err, .unwrap_err, .to_string, .contains.

### lance_encoding::encodings::physical::fsst::tests::test_fsst

private; function; test.

```rust
async fn test_fsst(         #[values(false, true)] explicit: bool,         #[values(             TestEncoding::StructuralU16,             TestEncoding::StructuralU32,             TestEncoding::StructuralSparse         )]         encoding: TestEncoding,     ) {
```

Private cfg(test) module: async test_fsst spans explicit false/true and3 structural modes (six configurations),5000 strings of100bytes and expected fsst name. Comments describe automatic maxlen>=5 and size>=32KiB, but complete policy also excludes binary types automatically and may select per-value compression first. (rust/lance-encoding/src/compression.rs:655-696; rust/lance-encoding/src/compression.rs:797-841) (rust/lance-encoding/src/encodings/physical/fsst.rs:389-431)

Callees: Observed lexical call expressions (not a resolved call graph): TestCases::default, .with_expected_encoding, .with_encoding, lance_datagen::gen_batch, .anon_col, lance_datagen::array::rand_utf8, ByteCount::from, .into_batch_rows, RowCount::from, .unwrap, .column, .clone, HashMap::from, .to_string, HashMap::new.


### lance_encoding::encodings::physical::packed::tests

private; module.

```rust
mod tests {
```

Private cfg(test) module imports Arrow types, test strategies, protobuf and metadata keys. Five private helpers convert Int64,Int32,String,LargeString,Binary arrays into expected block variants or panic. Tests construct nonnullable payloads unless explicitly exercising an empty row; schema nullable flags alone do not create null data. (rust/lance-encoding/src/encodings/physical/packed.rs:983-1050)

### lance_encoding::encodings::physical::packed::tests::fixed_block_from_array

private; function; test.

```rust
fn fixed_block_from_array(array: Int64Array) -> FixedWidthDataBlock {
```

Private cfg(test) module imports Arrow types, test strategies, protobuf and metadata keys. Five private helpers convert Int64,Int32,String,LargeString,Binary arrays into expected block variants or panic. Tests construct nonnullable payloads unless explicitly exercising an empty row; schema nullable flags alone do not create null data. (rust/lance-encoding/src/encodings/physical/packed.rs:983-1050)

Callees: Observed lexical call expressions (not a resolved call graph): .len, DataBlock::from_arrays, Arc::new, DataBlock::FixedWidth.

### lance_encoding::encodings::physical::packed::tests::fixed_i32_block_from_array

private; function; test.

```rust
fn fixed_i32_block_from_array(array: Int32Array) -> FixedWidthDataBlock {
```

Private cfg(test) module imports Arrow types, test strategies, protobuf and metadata keys. Five private helpers convert Int64,Int32,String,LargeString,Binary arrays into expected block variants or panic. Tests construct nonnullable payloads unless explicitly exercising an empty row; schema nullable flags alone do not create null data. (rust/lance-encoding/src/encodings/physical/packed.rs:983-1050)

Callees: Observed lexical call expressions (not a resolved call graph): .len, DataBlock::from_arrays, Arc::new, DataBlock::FixedWidth.

### lance_encoding::encodings::physical::packed::tests::fixed_packed_struct_full_zip_round_trip

private; function; test.

```rust
async fn fixed_packed_struct_full_zip_round_trip() {
```

Async fixed_packed_struct_full_zip_round_trip forces packed=true and fullzip metadata for the same two fields/four rows. u32 structural harness expects packed_struct name. Comment calls this file-writer wiring; test strategy is not identical to production V2.2 policy. No direct mini-block test appears in this module. (rust/lance-encoding/src/encodings/physical/packed.rs:1504-1539)

Callees: Observed lexical call expressions (not a resolved call graph): Fields::from, Arc::new, ArrowField::new, HashMap::new, .insert, .to_string, StructArray::from, .clone, Int32Array::from, Int64Array::from, TestCases::default, .with_u32_structural_encodings, .with_expected_encoding.

### lance_encoding::encodings::physical::packed::tests::fixed_packed_struct_rejects_variable_child

private; function; test.

```rust
fn fixed_packed_struct_rejects_variable_child() -> Result<()> {
```

fixed_packed_struct_rejects_variable_child directly constructs fixed encoder over Int32+Utf8 two rows, asserts InvalidInput and fixed-width substring. Nine test functions total. Local gaps include zero rows, zero width, malformed descriptors/offsets/prefixes, misaligned widths, null child codecs and input/count mismatch. Tests read only. (rust/lance-encoding/src/encodings/physical/packed.rs:1540-1571)

Callees: Observed lexical call expressions (not a resolved call graph): ArrowField::new, .into, DataType::Struct, Field::try_from, DataBlock::Struct, DataBlock::FixedWidth, Int32Array::from, DataBlock::VariableWidth, StringArray::from, BlockInfo::new, PackedStructFixedPerValueEncoder::new, .compress, .unwrap_err, .to_string, .contains.

### lance_encoding::encodings::physical::packed::tests::fixed_packed_struct_round_trip

private; function; test.

```rust
fn fixed_packed_struct_round_trip() -> Result<()> {
```

fixed_packed_struct_round_trip compresses Int32[1,2,3,4]+Int64[10,20,30,40] using StructuralU32 test strategy; require Fixed result, default fixed decode count4, assert both child widths/payloads. No exact interleaved bytes or malformed-layout assertion. (rust/lance-encoding/src/encodings/physical/packed.rs:1444-1503)

Callees: Observed lexical call expressions (not a resolved call graph): ArrowField::new, .into, DataType::Struct, Field::try_from, Int32Array::from, Int64Array::from, DataBlock::FixedWidth, .clone, BlockInfo::new, DataBlock::Struct, CompressionParams::default, CompressionStrategy::create_per_value, .as_ref, .compress, PerValueDataBlock::Fixed, DefaultDecompressionStrategy::default, crate::compression::DecompressionStrategy::create_fixed_per_value_decompressor, .decompress, .as_fixed_width_ref, .unwrap.

### lance_encoding::encodings::physical::packed::tests::variable_block_from_binary_array

private; function; test.

```rust
fn variable_block_from_binary_array(array: BinaryArray) -> VariableWidthBlock {
```

Private cfg(test) module imports Arrow types, test strategies, protobuf and metadata keys. Five private helpers convert Int64,Int32,String,LargeString,Binary arrays into expected block variants or panic. Tests construct nonnullable payloads unless explicitly exercising an empty row; schema nullable flags alone do not create null data. (rust/lance-encoding/src/encodings/physical/packed.rs:983-1050)

Callees: Observed lexical call expressions (not a resolved call graph): .len, DataBlock::from_arrays, Arc::new, DataBlock::VariableWidth.

### lance_encoding::encodings::physical::packed::tests::variable_block_from_large_string_array

private; function; test.

```rust
fn variable_block_from_large_string_array(array: LargeStringArray) -> VariableWidthBlock {
```

Private cfg(test) module imports Arrow types, test strategies, protobuf and metadata keys. Five private helpers convert Int64,Int32,String,LargeString,Binary arrays into expected block variants or panic. Tests construct nonnullable payloads unless explicitly exercising an empty row; schema nullable flags alone do not create null data. (rust/lance-encoding/src/encodings/physical/packed.rs:983-1050)

Callees: Observed lexical call expressions (not a resolved call graph): .len, DataBlock::from_arrays, Arc::new, DataBlock::VariableWidth.

### lance_encoding::encodings::physical::packed::tests::variable_block_from_string_array

private; function; test.

```rust
fn variable_block_from_string_array(array: StringArray) -> VariableWidthBlock {
```

Private cfg(test) module imports Arrow types, test strategies, protobuf and metadata keys. Five private helpers convert Int64,Int32,String,LargeString,Binary arrays into expected block variants or panic. Tests construct nonnullable payloads unless explicitly exercising an empty row; schema nullable flags alone do not create null data. (rust/lance-encoding/src/encodings/physical/packed.rs:983-1050)

Callees: Observed lexical call expressions (not a resolved call graph): .len, DataBlock::from_arrays, Arc::new, DataBlock::VariableWidth.

### lance_encoding::encodings::physical::packed::tests::variable_packed_struct_decompress_empty_row

private; function; test.

```rust
fn variable_packed_struct_decompress_empty_row() -> Result<()> {
```

Empty-row test explicitly constructs fixed32 raw and variable32 raw child decoders, avoiding strategy selection. Configures one fixed and one variable field to isolate placeholder behavior. Writes packed row1 [u32LE1][u32LE1][a] and row3 [u32LE2][u32LE0]; row offsets[0,9,9,17]. Decode must produce fixed[1,0,2], variable offsets[0,1,1,1] and bytes a. This is an empty middle row, not a zero-row block or validation of rep/def/nullable Arrow output. (rust/lance-encoding/src/encodings/physical/packed.rs:1375-1405; rust/lance-encoding/src/encodings/physical/packed.rs:1406-1443)

Callees: Observed lexical call expressions (not a resolved call graph): DefaultDecompressionStrategy::default, Arc::from, crate::compression::DecompressionStrategy::create_fixed_per_value_decompressor, ProtobufUtils21::flat, crate::compression::DecompressionStrategy::create_variable_per_value_decompressor, ProtobufUtils21::variable, PackedStructVariablePerValueDecompressor::new, Vec::new, .extend_from_slice, .to_le_bytes, LanceBuffer::from, LanceBuffer::reinterpret_vec, BlockInfo::new, .decompress, DataBlock::Struct, .as_fixed_width_ref, .unwrap, .borrow_to_typed_slice, .as_ref, .as_variable_width_ref.

### lance_encoding::encodings::physical::packed::tests::variable_packed_struct_large_utf8_round_trip

private; function; test.

```rust
fn variable_packed_struct_large_utf8_round_trip() -> Result<()> {
```

variable_packed_struct_large_utf8_round_trip uses Int64[10,20,30,40] and four LargeUtf8 strings including a long sentence. StructuralU32/default decode, checks fixed child and64-bit offsets/all string bytes. It verifies large offset type with small data, not >4GiB allocation. (rust/lance-encoding/src/encodings/physical/packed.rs:1133-1208)

Callees: Observed lexical call expressions (not a resolved call graph): ArrowField::new, .into, DataType::Struct, Field::try_from, Int64Array::from, LargeStringArray::from, DataBlock::FixedWidth, .clone, DataBlock::VariableWidth, BlockInfo::new, DataBlock::Struct, CompressionParams::default, crate::compression::CompressionStrategy::create_per_value, .as_ref, .compress, PerValueDataBlock::Variable, DefaultDecompressionStrategy::default, crate::compression::DecompressionStrategy::create_variable_per_value_decompressor, .decompress, .as_fixed_width_ref, .unwrap, .as_variable_width_ref, .borrow_to_typed_slice.

### lance_encoding::encodings::physical::packed::tests::variable_packed_struct_multi_variable_round_trip

private; function; test.

```rust
fn variable_packed_struct_multi_variable_round_trip() -> Result<()> {
```

variable_packed_struct_multi_variable_round_trip combines Utf8 categories, Binary payloads including one empty item and Int32 values across four rows. StructuralU32/default decode verifies offsets, bytes and bit widths for all three fields. No null value despite nullable field metadata. (rust/lance-encoding/src/encodings/physical/packed.rs:1252-1343)

Callees: Observed lexical call expressions (not a resolved call graph): ArrowField::new, .into, DataType::Struct, Field::try_from, StringArray::from, BinaryArray::from_iter_values, .iter, .map, .as_slice, Int32Array::from, DataBlock::VariableWidth, .clone, DataBlock::FixedWidth, BlockInfo::new, DataBlock::Struct, CompressionParams::default, crate::compression::CompressionStrategy::create_per_value, .as_ref, .compress, PerValueDataBlock::Variable, DefaultDecompressionStrategy::default, crate::compression::DecompressionStrategy::create_variable_per_value_decompressor, .decompress, .as_variable_width_ref, .unwrap, .borrow_to_typed_slice, .as_fixed_width_ref.

### lance_encoding::encodings::physical::packed::tests::variable_packed_struct_requires_v22

private; function; test.

```rust
fn variable_packed_struct_requires_v22() {
```

variable_packed_struct_requires_v22 builds Int64+Utf8 three-row struct and asserts StructuralU16 strategy create_per_value returns NotSupported. Name does not prove production V2.2 all-fixed support: test StructuralU32 uses all-packed helper, while production V2.2 allows only variable-packed per-value and V2.3 adds fixed per-value. (rust/lance-encoding/src/testing.rs:162-181; rust/lance-file/src/versions/v2_2/compression.rs:77-93; rust/lance-file/src/versions/v2_3/compression.rs:77-92) (rust/lance-encoding/src/encodings/physical/packed.rs:1344-1374)

Callees: Observed lexical call expressions (not a resolved call graph): ArrowField::new, .into, DataType::Struct, Field::try_from, .unwrap, Int64Array::from, StringArray::from, DataBlock::FixedWidth, DataBlock::VariableWidth, BlockInfo::new, CompressionParams::default, .create_per_value, DataBlock::Struct.

### lance_encoding::encodings::physical::packed::tests::variable_packed_struct_round_trip

private; function; test.

```rust
fn variable_packed_struct_round_trip() -> Result<()> {
```

variable_packed_struct_round_trip uses UInt32[1,2,42] and Utf8 offsets[0,1,4,4]/bytes abcz with nullable schema flag but no actual nulls; compute child stats, StructuralU32 strategy, require Variable result/default decode. Assert both child widths, raw id bytes and full string offsets/payload. No exact packed-byte or field-descriptor assertion. (rust/lance-encoding/src/encodings/physical/packed.rs:1051-1132)

Callees: Observed lexical call expressions (not a resolved call graph): ArrowField::new, .into, DataType::Struct, Field::try_from, .iter, .flat_map, .to_le_bytes, .collect, LanceBuffer::reinterpret_vec, BlockInfo::new, .compute_stat, DataBlock::FixedWidth, .to_vec, LanceBuffer::from, .clone, DataBlock::VariableWidth, DataBlock::Struct, CompressionParams::default, crate::compression::CompressionStrategy::create_per_value, .as_ref, .compress, PerValueDataBlock::Variable, DefaultDecompressionStrategy::default, crate::compression::DecompressionStrategy::create_variable_per_value_decompressor, .decompress, .as_fixed_width_ref, .unwrap, .as_slice, .as_variable_width_ref, .borrow_to_typed_slice.

### lance_encoding::encodings::physical::packed::tests::variable_packed_struct_utf8_round_trip

private; function; test.

```rust
async fn variable_packed_struct_utf8_round_trip() {
```

Async variable_packed_struct_utf8_round_trip creates three rows UInt32+Utf8+LargeUtf8, marks packed metadata true, uses u32 structural harness and expects variable_packed_struct name. This is harness source evidence; no test executed here. (rust/lance-encoding/src/encodings/physical/packed.rs:1209-1251)

Callees: Observed lexical call expressions (not a resolved call graph): Fields::from, Arc::new, ArrowField::new, HashMap::new, .insert, .to_string, StructArray::from, .clone, UInt32Array::from, StringArray::from, LargeStringArray::from, TestCases::default, .with_u32_structural_encodings, .with_expected_encoding.

### lance_encoding::statistics::tests

private; module.

```rust
mod tests {
```

Private cfg(test) module imports arrays, builders, ArrowData, seeded Xoshiro DEFAULT_SEED and random generation. Tests are source evidence only; no local entropy tests. Normal from_arrays computes stats before wrapping nullable values. (rust/lance-encoding/src/data.rs:2020-2030) (rust/lance-encoding/src/statistics.rs:597-619)

### lance_encoding::statistics::tests::test_bit_width_stat_for_integers

private; function; test.

```rust
fn test_bit_width_stat_for_integers() {
```

Integer bit-width test starts Int8 cases [1,2,3]->2, max positive->7, lower masks->5 and negative->8, then begins Int16 cases. All use DataBlock::from_array to initialize stats and assert UInt64Array equality, without runtime evidence here. Continues Int16 positive/boundary/negative cases and Int32 positive/boundary/negative cases. The helper operates on unsigned representation, so any negative signed input yields full width. Source appendix preserves every literal input and expected number. Completes signed32/64 fixtures and starts unsigned8/16 cases. Repeated explicit fixtures test single chunks of small arrays, signed extremes and widening boundaries; no parameterized harness used locally. Completes unsigned16/32/64 fixtures including u64::MAX. All explicit integer tests compare whole BitWidth arrays. No direct zero-count, empty typed buffer, width1/128 fallback or mismatched declared-count test here. (rust/lance-encoding/src/statistics.rs:707-770; rust/lance-encoding/src/statistics.rs:771-850; rust/lance-encoding/src/statistics.rs:851-930; rust/lance-encoding/src/statistics.rs:931-1030)

Callees: Observed lexical call expressions (not a resolved call graph): Int8Array::from, Arc::new, DataBlock::from_array, UInt64Array::from, .expect_stat, .as_ref, Int16Array::from, Int32Array::from, Int64Array::from, UInt8Array::from, UInt16Array::from, UInt32Array::from.

### lance_encoding::statistics::tests::test_bit_width_stat_more_than_1024

private; function; test.

```rust
fn test_bit_width_stat_more_than_1024() {
```

Multi-chunk bit-width test concatenates1024 values3,1024 values8 and10 values-1 separately for signed8/16/32/64; expect[2,4,native width]. Covers1024 chunk boundaries and short tail using true physical lengths. (rust/lance-encoding/src/statistics.rs:1031-1060)

Callees: Observed lexical call expressions (not a resolved call graph): Int64Array::from, arrow_cast::cast, .unwrap, .as_ref, DataBlock::from_array, .clone, Arc::new, UInt64Array::from, .byte_width, .expect_stat.

### lance_encoding::statistics::tests::test_bit_width_when_none

private; function; test.

```rust
fn test_bit_width_when_none() {
```

Random Binary three-value test confirms unsupported BitWidth returnsNone after ordinary construction; it does not test an uninitialized statistics map (which panics). (rust/lance-encoding/src/statistics.rs:1061-1070)

Callees: Observed lexical call expressions (not a resolved call graph): rand_xoshiro::Xoshiro256PlusPlus::seed_from_u64, lance_datagen::array::rand_type, .generate, RowCount::from, .unwrap, DataBlock::from_array, .clone, .get_stat, .is_none.

### lance_encoding::statistics::tests::test_cardinality_variable_width_datablock

private; function; test.

```rust
fn test_cardinality_variable_width_datablock() {
```

Variable cardinality tests String and LargeString fixtures: two unique hello/world, three unique sentences and repeated Samuel/Saunders/Samuel produce2,3,2 respectively. Small exact expected estimates do not establish general HLL exactness. All values present, no null/empty malformed-buffer coverage. (rust/lance-encoding/src/statistics.rs:1071-1125)

Callees: Observed lexical call expressions (not a resolved call graph): StringArray::from, DataBlock::from_array, .expect_single_stat, LargeStringArray::from.

### lance_encoding::statistics::tests::test_data_size_stat

private; function; test.

```rust
fn test_data_size_stat() {
```

Data-size test compares three Int32 batches and seeded random Binary against Arrow own data-buffer sums (Binary includes offsets and payload), Struct against child own-buffer sums, Dictionary againstNone, and nullable Int32 against values buffers excluding null bitmap. Confirms payload accounting rather than total in-memory allocation. (rust/lance-encoding/src/statistics.rs:620-706)

Callees: Observed lexical call expressions (not a resolved call graph): rand_xoshiro::Xoshiro256PlusPlus::seed_from_u64, .with_nulls, .generate, RowCount::from, .unwrap, DataBlock::from_arrays, .clone, Arc::new, .expect_single_stat, .to_data, .buffers, .iter, .map, .len, .sum, lance_datagen::array::rand_type, DataBlock::from_array, Field::new, .into, DataType::Struct, .as_struct, .into_parts, array::rand_type, DataType::Dictionary, Box::new, .get_stat, .is_none.

### lance_encoding::statistics::tests::test_fixed_width_cardinality_computed_on_demand

private; function; test.

```rust
fn test_fixed_width_cardinality_computed_on_demand() {
```

Fixed on-demand test uses same Int64 fixture, invokes getter expecting scalar3 then asserts Cardinality now present. No repeat-get Arc identity or concurrent cache initialization check. (rust/lance-encoding/src/statistics.rs:1231-1246)

Callees: Observed lexical call expressions (not a resolved call graph): Int64Array::from, DataBlock::from_array, .expect_single_stat, DataBlock::FixedWidth, .read, .unwrap, .contains_key.

### lance_encoding::statistics::tests::test_fixed_width_cardinality_is_lazy

private; function; test.

```rust
fn test_fixed_width_cardinality_is_lazy() {
```

Fixed lazy-cardinality test builds seven Int64[1,2,3,1,2,3,1], checks DataSize/BitWidth cached and Cardinality absent. Does not call cardinality getter. (rust/lance-encoding/src/statistics.rs:1216-1230)

Callees: Observed lexical call expressions (not a resolved call graph): Int64Array::from, DataBlock::from_array, DataBlock::FixedWidth, .read, .unwrap, .contains_key.

### lance_encoding::statistics::tests::test_max_length_variable_width_datablock

private; function; test.

```rust
fn test_max_length_variable_width_datablock() {
```

Variable MaxLength tests String/LargeString hello/world, sentence lengths and String Samuel/Saunders/Samuel. All ASCII and present. Assertions use byte string len, not character counts; no direct zero-window/descending/sliced offset case. (rust/lance-encoding/src/statistics.rs:1126-1171)

Callees: Observed lexical call expressions (not a resolved call graph): StringArray::from, DataBlock::from_array, .clone, .value_length, .expect_single_stat, LargeStringArray::from, .value, .len.

### lance_encoding::statistics::tests::test_run_count_stat

private; function; test.

```rust
fn test_run_count_stat() {
```

RunCount test covers Int32 consecutive triples->3, five unique->5, mixed nine->5, five repeated42->1, UInt8 three pairs->3 and Int64 five values->3. Comment single value means one distinct value across five rows. No zero rows, boolean,128-bit, nonconsecutive equal raw floats or count mismatch. (rust/lance-encoding/src/statistics.rs:1172-1215)

Callees: Observed lexical call expressions (not a resolved call graph): Int32Array::from, DataBlock::from_array, .expect_single_stat, UInt8Array::from, Int64Array::from.

### lance_encoding::statistics::tests::test_variable_width_cardinality_is_lazy

private; function; test.

```rust
fn test_variable_width_cardinality_is_lazy() {
```

Variable lazy test String[a,b,a] checks DataSize/MaxLength present/Cardinality absent, calls getter for2, then checks cached. Ten test functions total; no direct BytePositionEntropy,128-bit HLL, poisoned locks, recomputation/stale-cache, invalid scalar-stat or NULL filtering regression tests. (rust/lance-encoding/src/statistics.rs:1247-1269)

Callees: Observed lexical call expressions (not a resolved call graph): StringArray::from, DataBlock::from_array, DataBlock::VariableWidth, .read, .unwrap, .contains_key, .expect_single_stat.

