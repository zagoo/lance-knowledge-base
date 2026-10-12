> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/encodings/physical/general.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `23f1d172c01f8c22212a567ca22ead603beab4c07d88ebf885c0f5e5283e5bf0`. Reviewed physical lines: 1-683.

[Module](../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Outer general-purpose compression of the first mini-block buffer, accepted only for an aggregate size improvement; decoder unwraps that first buffer before inner dispatch. (rust/lance-encoding/src/encodings/physical/general.rs:1-683)

## Complete range analysis

### Lines 1-33

SPDX/imports include log trace, Result, buffer/data types, mini-block contracts, codec factory/config and descriptor helpers. Public Debug GeneralMiniBlockCompressor stores private boxed inner MiniBlockCompressor and selected CompressionConfig. new is infallible and does not instantiate or validate the outer codec. (rust/lance-encoding/src/encodings/physical/general.rs:1-33)

### Lines 34-55

Private MIN_BUFFER_SIZE_FOR_COMPRESSION=4096 bytes. compress first delegates owned page and unchanged context to inner. If data is empty or first whole buffer length<4096, return inner result and descriptor unchanged before factory validation. Equality attempts compression. Threshold is aggregate first-buffer size, not each chunk or sum of all buffers. Inner errors propagate. (rust/lance-encoding/src/encodings/physical/general.rs:34-55)

### Lines 56-86

After threshold, obtain one outer codec for the page or return its error. For each inner chunk index buffer_sizes[0], slice first data buffer by cumulative offset, append compressed chunk bytes, compute output length delta asu32, clone size vector and replace only element0 while preserving log count. Missing first size or invalid range panics; arithmetic and narrowing are unchecked. Assumes chunk sizes exactly cover first input buffer; accepted path drops any unaccounted trailing bytes. Other buffers are not compressed. Context flags are passed inward but not used to revalidate compressed sizes. (rust/lance-encoding/src/encodings/physical/general.rs:56-86)

### Lines 87-100

If summed compressed bytes>=summed original chunk bytes, discard scratch data/chunks and return original result/descriptor. Equality and zero total fall back. Acceptance is strict aggregate savings; one chunk may grow if others compensate. Trace ratio is f32 diagnostic only. Work and temporary memory have already been spent before fallback. (rust/lance-encoding/src/encodings/physical/general.rs:87-100)

### Lines 101-116

On acceptance replace buffer0 with compressed bytes, move all remaining original buffers unchanged, preserve num_values and store rewritten chunk sizes. Wrap selected CompressionConfig around the original encoding using ProtobufUtils21::wrapped; descriptor conversion may error after compression. Retains selected optional level rather than runtime-normalized codec config. Page input, compressed scratch and cloned metadata coexist during work; no strict allocation cap. Noop typically falls back for equal size; unsupported factory config may remain unobserved on small pages. (rust/lance-encoding/src/encodings/physical/general.rs:101-116)

### Lines 117-146

Public Debug GeneralMiniBlockDecompressor stores boxed inner and selected config; new does not validate. Per call allocate fresh Vec, instantiate codec, index data[0], decompress it, replace only first buffer and pass all buffers plus unchanged num_values to inner. Empty data can panic after factory step; malformed codec data returns codec errors. Input must already be separated for one chunk; no framing or count validation here. decoded_size_bytes delegates to inner. DefaultDecompressionStrategy recursively resolves General inner metadata and config before constructing this wrapper; actual codec factory is deferred. (rust/lance-encoding/src/compression.rs:1054-1075) (rust/lance-encoding/src/encodings/physical/general.rs:117-146)

### Lines 147-172

cfg(test) imports include Arrow arrays, default strategy and RLE/value encoders. miniblock_context constructs (0,true,true). Private Debug TestCase holds name, boxed inner, config, DataBlock, expected_compressed and min_compression_ratio. Despite min name, test uses it as maximum allowed ratio. No test feature guards for selected Zstd/LZ4 configurations. (rust/lance-encoding/src/encodings/physical/general.rs:147-172)

### Lines 173-237

create_test_cases builds five cases: eight-value RLE/Lz4 no outer expected;2048 integer values i/8 RLE/Lz4 no outer;8192 i/16 RLE/Zstd level3 expected with0.9 ratio;1024 sequential i32 Value/Lz4 no outer;1024 f64 i*0.1 Value/Zstd level3 expected0.9. These are source fixtures, not measured results. (rust/lance-encoding/src/encodings/physical/general.rs:173-237)

### Lines 238-260

Helpers convert Int32/Float64 arrays to owned DataBlock with explicit length, and build Vec values by mapping the caller function over num_values. No streaming fixture generation. (rust/lance-encoding/src/encodings/physical/general.rs:238-260)

### Lines 261-304

run_round_trip_test wraps the inner compressor and unwraps success. General descriptor requires expected_compressed=true and matching scheme, but does not check level here. When expected=true, bare Rle or Flat descriptors are also accepted; thus flag does not require outer General. With expected=false any non-General descriptor passes this branch. (rust/lance-encoding/src/encodings/physical/general.rs:261-304)

### Lines 305-343

Helper checks chunks nonempty, decodes with helper, and asserts only total byte length num_values*(8 if name contains float else4). It does not compare decoded values. Expected-compressed ratio compares first compressed buffer length with original raw expected length, not inner encoded size, using <=min_compression_ratio. A length/ratio pass would not establish data round-trip equality or multi-buffer fidelity. (rust/lance-encoding/src/encodings/physical/general.rs:305-343)

### Lines 344-393

decompress_miniblock_chunks tracks offsets per buffer and derives chunk count from log or remaining values based on already appended bytes. It slices declared buffers only when index<data.len, silently skipping excess size entries. It creates default-strategy decoder per chunk, unwraps decode, requires FixedWidth and appends decoded bytes. No content comparison. Final-count calculation depends on guessed bytes-per-value. (rust/lance-encoding/src/encodings/physical/general.rs:344-393)

### Lines 394-416

get_bytes_per_value returns4 for zero values,8 for exactly1024 values,4 otherwise. This misclassifies the1024-i32 case and can distort residual count; it is a test heuristic, not production datatype logic. Main test loops five cases in one plain test rather than rstest. No runtime failure or pass was established. (rust/lance-encoding/src/encodings/physical/general.rs:394-416)

### Lines 417-454

Separate threshold case uses four RLE integers and LZ4 expecting no outer compression; floating case uses1024 repeated floor(i/10) f64 with Zstd3 and0.5 ratio. Both inherit helper limitations. (rust/lance-encoding/src/encodings/physical/general.rs:417-454)

### Lines 455-507

Large-buffer test constructs1024 i32 fixed-width values (4096bytes), Value inner and Zstd3. Asserts General descriptor, Flat32 inner, Zstd and Some(3), preserved count1024 and one buffer. It does not decode or compare values. Equality with the4096 threshold reaches the outer codec. (rust/lance-encoding/src/encodings/physical/general.rs:455-507)

### Lines 508-526

RLE multiple-buffer test uses100 repeated ones and LZ4, then only asserts data.len()==2. Comment says only first buffer compressed, but assertion does not verify that any outer compression occurred or that other bytes stayed equal. (rust/lance-encoding/src/encodings/physical/general.rs:508-526)

### Lines 527-599

Test named automatic_wrapper_for_rle manually constructs GeneralMiniBlockCompressor over RLE/LZ4 and12 i32 values in three runs. It accepts either General(Rle(Flat32 values,Flat8 run lengths)) with Lz4 or bare Rle. It does not exercise automatic strategy registration, decode or equality. (rust/lance-encoding/src/encodings/physical/general.rs:527-599)

### Lines 600-659

Equivalent manual RLE wrapper test uses i64 values100/200/300 in runs of50. General branch checks Flat64 values and Flat8 run lengths plus Lz4; bare Rle also accepted. No decoded-value assertion. (rust/lance-encoding/src/encodings/physical/general.rs:600-659)

### Lines 660-683

Empty-array test invokes Value/Lz4; if Ok it asserts only num_values=0, and any Err is accepted. It therefore does not prove successful empty compression or classify valid failures. All local tests were read, not executed. Production code has no local unsafe block, async task or file IO. (rust/lance-encoding/src/encodings/physical/general.rs:660-683)

## Interaction and interpretation limits

Every physical line was read during ANALYZE73 in bounded outputs. Offline read-only source inspection only: no repository build, test, lint, benchmark, generator or dependency installation. Exact declarations and source are retained below. Contextual caller snippets do not claim whole-file coverage; lexical references do not establish a resolved call graph.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use log::trace;
    5 | 
    6 | use crate::{
    7 |     Result,
    8 |     buffer::LanceBuffer,
    9 |     compression::MiniBlockDecompressor,
   10 |     data::DataBlock,
   11 |     encodings::{
   12 |         logical::primitive::miniblock::{
   13 |             MiniBlockCompressed, MiniBlockCompressionContext, MiniBlockCompressor,
   14 |         },
   15 |         physical::block::{CompressionConfig, GeneralBufferCompressor},
   16 |     },
   17 |     format::{ProtobufUtils21, pb21::CompressiveEncoding},
   18 | };
   19 | 
   20 | /// A miniblock compressor that wraps another miniblock compressor and applies
   21 | /// general-purpose compression (LZ4, Zstd) to the resulting buffers.
   22 | #[derive(Debug)]
   23 | pub struct GeneralMiniBlockCompressor {
   24 |     inner: Box<dyn MiniBlockCompressor>,
   25 |     compression: CompressionConfig,
   26 | }
   27 | 
   28 | impl GeneralMiniBlockCompressor {
   29 |     pub fn new(inner: Box<dyn MiniBlockCompressor>, compression: CompressionConfig) -> Self {
   30 |         Self { inner, compression }
   31 |     }
   32 | }
   33 | 
   34 | /// Minimum buffer size to consider for compression
   35 | const MIN_BUFFER_SIZE_FOR_COMPRESSION: usize = 4 * 1024;
   36 | 
   37 | use super::super::logical::primitive::miniblock::MiniBlockChunk;
   38 | 
   39 | impl MiniBlockCompressor for GeneralMiniBlockCompressor {
   40 |     fn compress(
   41 |         &self,
   42 |         context: MiniBlockCompressionContext,
   43 |         page: DataBlock,
   44 |     ) -> Result<(MiniBlockCompressed, CompressiveEncoding)> {
   45 |         // First, compress with the inner compressor
   46 |         let (inner_compressed, inner_encoding) = self.inner.compress(context, page)?;
   47 | 
   48 |         // Return the original encoding without compression if there's no data or
   49 |         // the first buffer is not large enough
   50 |         if inner_compressed.data.is_empty()
   51 |             || inner_compressed.data[0].len() < MIN_BUFFER_SIZE_FOR_COMPRESSION
   52 |         {
   53 |             return Ok((inner_compressed, inner_encoding));
   54 |         }
   55 | 
   56 |         // We'll compress each chunk's portion of the first buffer independently
   57 |         let first_buffer = &inner_compressed.data[0];
   58 |         let mut compressed_first_buffer = Vec::new();
   59 |         let mut new_chunks = Vec::with_capacity(inner_compressed.chunks.iter().len());
   60 |         let mut offset = 0usize;
   61 |         let mut total_original_size = 0usize;
   62 | 
   63 |         let compressor = GeneralBufferCompressor::get_compressor(self.compression)?;
   64 | 
   65 |         for chunk in &inner_compressed.chunks {
   66 |             let chunk_first_buffer_size = chunk.buffer_sizes[0] as usize;
   67 | 
   68 |             let chunk_data = &first_buffer.as_ref()[offset..offset + chunk_first_buffer_size];
   69 |             total_original_size += chunk_first_buffer_size;
   70 | 
   71 |             let compressed_start = compressed_first_buffer.len();
   72 |             compressor.compress(chunk_data, &mut compressed_first_buffer)?;
   73 |             let compressed_size = compressed_first_buffer.len() - compressed_start;
   74 | 
   75 |             // Create new chunk with updated first buffer size
   76 |             let mut new_buffer_sizes = chunk.buffer_sizes.clone();
   77 |             new_buffer_sizes[0] = compressed_size as u32;
   78 | 
   79 |             new_chunks.push(MiniBlockChunk {
   80 |                 buffer_sizes: new_buffer_sizes,
   81 |                 log_num_values: chunk.log_num_values,
   82 |             });
   83 | 
   84 |             offset += chunk_first_buffer_size;
   85 |         }
   86 | 
   87 |         // Check if compression was effective
   88 |         let compressed_total_size = compressed_first_buffer.len();
   89 |         if compressed_total_size >= total_original_size {
   90 |             // Compression didn't help, return original
   91 |             return Ok((inner_compressed, inner_encoding));
   92 |         }
   93 | 
   94 |         trace!(
   95 |             "First buffer compressed from {} to {} bytes (ratio: {:.2})",
   96 |             total_original_size,
   97 |             compressed_total_size,
   98 |             compressed_total_size as f32 / total_original_size as f32
   99 |         );
  100 | 
  101 |         // Build final buffers: compressed first buffer + remaining original buffers
  102 |         let mut final_buffers = vec![LanceBuffer::from(compressed_first_buffer)];
  103 |         final_buffers.extend(inner_compressed.data.into_iter().skip(1));
  104 | 
  105 |         let compressed_result = MiniBlockCompressed {
  106 |             data: final_buffers,
  107 |             chunks: new_chunks,
  108 |             num_values: inner_compressed.num_values,
  109 |         };
  110 | 
  111 |         // Return compressed encoding
  112 |         let encoding = ProtobufUtils21::wrapped(self.compression, inner_encoding)?;
  113 |         Ok((compressed_result, encoding))
  114 |     }
  115 | }
  116 | 
  117 | /// A miniblock decompressor that first decompresses buffers using general-purpose
  118 | /// compression (LZ4, Zstd) and then delegates to an inner miniblock decompressor.
  119 | #[derive(Debug)]
  120 | pub struct GeneralMiniBlockDecompressor {
  121 |     inner: Box<dyn MiniBlockDecompressor>,
  122 |     compression: CompressionConfig,
  123 | }
  124 | 
  125 | impl GeneralMiniBlockDecompressor {
  126 |     pub fn new(inner: Box<dyn MiniBlockDecompressor>, compression: CompressionConfig) -> Self {
  127 |         Self { inner, compression }
  128 |     }
  129 | }
  130 | 
  131 | impl MiniBlockDecompressor for GeneralMiniBlockDecompressor {
  132 |     fn decompress(&self, mut data: Vec<LanceBuffer>, num_values: u64) -> Result<DataBlock> {
  133 |         let mut decompressed_buffer = Vec::new();
  134 | 
  135 |         let decompressor = GeneralBufferCompressor::get_compressor(self.compression)?;
  136 |         decompressor.decompress(&data[0], &mut decompressed_buffer)?;
  137 |         data[0] = LanceBuffer::from(decompressed_buffer);
  138 | 
  139 |         self.inner.decompress(data, num_values)
  140 |     }
  141 | 
  142 |     fn decoded_size_bytes(&self, num_values: u64) -> Option<u64> {
  143 |         self.inner.decoded_size_bytes(num_values)
  144 |     }
  145 | }
  146 | 
  147 | #[cfg(test)]
  148 | mod tests {
  149 |     use super::*;
  150 |     use crate::compression::{DecompressionStrategy, DefaultDecompressionStrategy};
  151 |     use crate::data::{BlockInfo, FixedWidthDataBlock};
  152 |     use crate::encodings::physical::block::CompressionScheme;
  153 |     use crate::encodings::physical::rle::RleEncoder;
  154 |     use crate::encodings::physical::value::ValueEncoder;
  155 |     use crate::format::pb21;
  156 |     use crate::format::pb21::compressive_encoding::Compression;
  157 |     use arrow_array::{Float64Array, Int32Array};
  158 | 
  159 |     fn miniblock_context() -> MiniBlockCompressionContext {
  160 |         MiniBlockCompressionContext::new(0, true, true)
  161 |     }
  162 | 
  163 |     #[derive(Debug)]
  164 |     struct TestCase {
  165 |         name: &'static str,
  166 |         inner_encoder: Box<dyn MiniBlockCompressor>,
  167 |         compression: CompressionConfig,
  168 |         data: DataBlock,
  169 |         expected_compressed: bool, // Whether we expect compression to be applied
  170 |         min_compression_ratio: f32, // Minimum compression ratio if compressed
  171 |     }
  172 | 
  173 |     fn create_test_cases() -> Vec<TestCase> {
  174 |         vec![
  175 |             // Small data with RLE - should not compress due to size threshold
  176 |             TestCase {
  177 |                 name: "small_rle_data",
  178 |                 inner_encoder: Box::new(RleEncoder::new()),
  179 |                 compression: CompressionConfig {
  180 |                     scheme: CompressionScheme::Lz4,
  181 |                     level: None,
  182 |                 },
  183 |                 data: create_repeated_i32_block(vec![1, 1, 1, 1, 2, 2, 2, 2]),
  184 |                 expected_compressed: false,
  185 |                 min_compression_ratio: 1.0,
  186 |             },
  187 |             // Large repeated data with RLE + LZ4
  188 |             TestCase {
  189 |                 name: "large_rle_lz4",
  190 |                 inner_encoder: Box::new(RleEncoder::new()),
  191 |                 compression: CompressionConfig {
  192 |                     scheme: CompressionScheme::Lz4,
  193 |                     level: None,
  194 |                 },
  195 |                 data: create_pattern_i32_block(2048, |i| (i / 8) as i32),
  196 |                 expected_compressed: false, // RLE already compresses well, additional LZ4 may not help
  197 |                 min_compression_ratio: 1.0,
  198 |             },
  199 |             // Large repeated data with RLE + Zstd
  200 |             TestCase {
  201 |                 name: "large_rle_zstd",
  202 |                 inner_encoder: Box::new(RleEncoder::new()),
  203 |                 compression: CompressionConfig {
  204 |                     scheme: CompressionScheme::Zstd,
  205 |                     level: Some(3),
  206 |                 },
  207 |                 data: create_pattern_i32_block(8192, |i| (i / 16) as i32),
  208 |                 expected_compressed: true, // Zstd might provide additional compression
  209 |                 min_compression_ratio: 0.9, // But not as much since RLE already compressed
  210 |             },
  211 |             // Sequential data with ValueEncoder + LZ4
  212 |             TestCase {
  213 |                 name: "sequential_value_lz4",
  214 |                 inner_encoder: Box::new(ValueEncoder {}),
  215 |                 compression: CompressionConfig {
  216 |                     scheme: CompressionScheme::Lz4,
  217 |                     level: None,
  218 |                 },
  219 |                 data: create_pattern_i32_block(1024, |i| i as i32),
  220 |                 expected_compressed: false, // Sequential data doesn't compress well
  221 |                 min_compression_ratio: 1.0,
  222 |             },
  223 |             // Float data with ValueEncoder + Zstd
  224 |             TestCase {
  225 |                 name: "float_value_zstd",
  226 |                 inner_encoder: Box::new(ValueEncoder {}),
  227 |                 compression: CompressionConfig {
  228 |                     scheme: CompressionScheme::Zstd,
  229 |                     level: Some(3),
  230 |                 },
  231 |                 data: create_pattern_f64_block(1024, |i| i as f64 * 0.1),
  232 |                 expected_compressed: true,
  233 |                 min_compression_ratio: 0.9,
  234 |             },
  235 |         ]
  236 |     }
  237 | 
  238 |     fn create_repeated_i32_block(values: Vec<i32>) -> DataBlock {
  239 |         let array = Int32Array::from(values);
  240 |         DataBlock::from_array(array)
  241 |     }
  242 | 
  243 |     fn create_pattern_i32_block<F>(size: usize, pattern: F) -> DataBlock
  244 |     where
  245 |         F: Fn(usize) -> i32,
  246 |     {
  247 |         let values: Vec<i32> = (0..size).map(pattern).collect();
  248 |         let array = Int32Array::from(values);
  249 |         DataBlock::from_array(array)
  250 |     }
  251 | 
  252 |     fn create_pattern_f64_block<F>(size: usize, pattern: F) -> DataBlock
  253 |     where
  254 |         F: Fn(usize) -> f64,
  255 |     {
  256 |         let values: Vec<f64> = (0..size).map(pattern).collect();
  257 |         let array = Float64Array::from(values);
  258 |         DataBlock::from_array(array)
  259 |     }
  260 | 
  261 |     fn run_round_trip_test(test_case: TestCase) {
  262 |         let compressor =
  263 |             GeneralMiniBlockCompressor::new(test_case.inner_encoder, test_case.compression);
  264 | 
  265 |         // Compress the data
  266 |         let (compressed, encoding) = compressor
  267 |             .compress(miniblock_context(), test_case.data)
  268 |             .unwrap();
  269 | 
  270 |         // Check if compression was applied as expected
  271 |         match &encoding.compression {
  272 |             Some(Compression::General(cm)) => {
  273 |                 assert!(
  274 |                     test_case.expected_compressed,
  275 |                     "{}: Expected compression to be applied",
  276 |                     test_case.name
  277 |                 );
  278 |                 assert_eq!(
  279 |                     CompressionScheme::try_from(cm.compression.as_ref().unwrap().scheme()).unwrap(),
  280 |                     test_case.compression.scheme
  281 |                 );
  282 |             }
  283 |             _ => {
  284 |                 // Could be RLE or other encoding if compression didn't help
  285 |                 if test_case.expected_compressed {
  286 |                     // Check if it's RLE encoding (which means compression didn't help)
  287 |                     match &encoding.compression {
  288 |                         Some(Compression::Rle(_)) => {
  289 |                             // RLE encoding returned - compression didn't help
  290 |                         }
  291 |                         Some(Compression::Flat(_)) => {
  292 |                             // Flat encoding returned - compression didn't help
  293 |                         }
  294 |                         _ => {
  295 |                             panic!(
  296 |                                 "{}: Expected GeneralMiniBlock but got {:?}",
  297 |                                 test_case.name, encoding.compression
  298 |                             );
  299 |                         }
  300 |                     }
  301 |                 }
  302 |             }
  303 |         }
  304 | 
  305 |         // Verify chunks are created correctly
  306 |         assert!(
  307 |             !compressed.chunks.is_empty(),
  308 |             "{}: No chunks created",
  309 |             test_case.name
  310 |         );
  311 | 
  312 |         // Test decompression by simulating the actual miniblock decoding process
  313 |         let decompressed_data = decompress_miniblock_chunks(&compressed, &encoding);
  314 | 
  315 |         // Verify round trip by checking data size
  316 |         // We expect the decompressed data to match the original number of values
  317 |         // The bytes per value depends on the test case
  318 |         let bytes_per_value = if test_case.name.contains("float") {
  319 |             8 // f64
  320 |         } else {
  321 |             4 // i32
  322 |         };
  323 |         let expected_bytes = compressed.num_values as usize * bytes_per_value;
  324 |         assert_eq!(
  325 |             expected_bytes,
  326 |             decompressed_data.len(),
  327 |             "{}: Data size mismatch",
  328 |             test_case.name
  329 |         );
  330 | 
  331 |         // Check compression ratio if applicable
  332 |         if test_case.expected_compressed {
  333 |             let compression_ratio = compressed.data[0].len() as f32 / expected_bytes as f32;
  334 |             assert!(
  335 |                 compression_ratio <= test_case.min_compression_ratio,
  336 |                 "{}: Compression ratio {} > expected {}",
  337 |                 test_case.name,
  338 |                 compression_ratio,
  339 |                 test_case.min_compression_ratio
  340 |             );
  341 |         }
  342 |     }
  343 | 
  344 |     fn decompress_miniblock_chunks(
  345 |         compressed: &MiniBlockCompressed,
  346 |         encoding: &CompressiveEncoding,
  347 |     ) -> Vec<u8> {
  348 |         let mut decompressed_data = Vec::new();
  349 |         let mut offsets = vec![0usize; compressed.data.len()]; // Track offset for each buffer
  350 |         let decompression_strategy = DefaultDecompressionStrategy::default();
  351 | 
  352 |         for chunk in &compressed.chunks {
  353 |             let chunk_values = if chunk.log_num_values > 0 {
  354 |                 1u64 << chunk.log_num_values
  355 |             } else {
  356 |                 // Last chunk - calculate remaining values
  357 |                 let decompressed_values =
  358 |                     decompressed_data.len() as u64 / get_bytes_per_value(compressed) as u64;
  359 |                 compressed.num_values.saturating_sub(decompressed_values)
  360 |             };
  361 | 
  362 |             // Extract buffers for this chunk
  363 |             let mut chunk_buffers = Vec::new();
  364 |             for (i, &size) in chunk.buffer_sizes.iter().enumerate() {
  365 |                 if i < compressed.data.len() {
  366 |                     let buffer_data =
  367 |                         compressed.data[i].slice_with_length(offsets[i], size as usize);
  368 |                     chunk_buffers.push(buffer_data);
  369 |                     offsets[i] += size as usize;
  370 |                 }
  371 |             }
  372 | 
  373 |             // Create a decompressor for this chunk
  374 |             let decompressor = decompression_strategy
  375 |                 .create_miniblock_decompressor(encoding, &decompression_strategy)
  376 |                 .unwrap();
  377 | 
  378 |             // Decompress the chunk
  379 |             let chunk_decompressed = decompressor
  380 |                 .decompress(chunk_buffers, chunk_values)
  381 |                 .unwrap();
  382 | 
  383 |             match chunk_decompressed {
  384 |                 DataBlock::FixedWidth(ref block) => {
  385 |                     decompressed_data.extend_from_slice(block.data.as_ref());
  386 |                 }
  387 |                 _ => panic!("Expected FixedWidth block"),
  388 |             }
  389 |         }
  390 | 
  391 |         decompressed_data
  392 |     }
  393 | 
  394 |     fn get_bytes_per_value(compressed: &MiniBlockCompressed) -> usize {
  395 |         // This is a simplification - in reality we'd need to know the data type
  396 |         // For our tests, we mostly use i32 (4 bytes) or f64 (8 bytes)
  397 |         // We can try to guess based on the data size
  398 |         if compressed.num_values == 0 {
  399 |             return 4; // Default to i32
  400 |         }
  401 | 
  402 |         // For float tests, the number is usually 1024 and we use f64
  403 |         if compressed.num_values == 1024 {
  404 |             return 8; // Likely f64
  405 |         }
  406 | 
  407 |         4 // Default to i32
  408 |     }
  409 | 
  410 |     #[test]
  411 |     fn test_compressed_mini_block_table_driven() {
  412 |         for test_case in create_test_cases() {
  413 |             run_round_trip_test(test_case);
  414 |         }
  415 |     }
  416 | 
  417 |     #[test]
  418 |     fn test_compressed_mini_block_threshold() {
  419 |         // Test that small buffers don't get compressed
  420 |         let small_test = TestCase {
  421 |             name: "small_buffer_no_compression",
  422 |             inner_encoder: Box::new(RleEncoder::new()),
  423 |             compression: CompressionConfig {
  424 |                 scheme: CompressionScheme::Lz4,
  425 |                 level: None,
  426 |             },
  427 |             data: create_repeated_i32_block(vec![1, 1, 2, 2]),
  428 |             expected_compressed: false,
  429 |             min_compression_ratio: 1.0,
  430 |         };
  431 |         run_round_trip_test(small_test);
  432 |     }
  433 | 
  434 |     #[test]
  435 |     fn test_compressed_mini_block_with_doubles() {
  436 |         // Test with large sequential doubles that should compress well with Zstd
  437 |         // The test focuses on verifying that GeneralMiniBlock works correctly
  438 |         // when wrapping a simple ValueEncoder
  439 |         let test_case = TestCase {
  440 |             name: "float_values_with_zstd",
  441 |             inner_encoder: Box::new(ValueEncoder {}),
  442 |             compression: CompressionConfig {
  443 |                 scheme: CompressionScheme::Zstd,
  444 |                 level: Some(3),
  445 |             },
  446 |             // Create enough data to ensure compression is applied
  447 |             data: create_pattern_f64_block(1024, |i| (i / 10) as f64),
  448 |             expected_compressed: true,
  449 |             min_compression_ratio: 0.5, // Zstd should achieve good compression on repetitive data
  450 |         };
  451 | 
  452 |         run_round_trip_test(test_case);
  453 |     }
  454 | 
  455 |     #[test]
  456 |     fn test_compressed_mini_block_large_buffers() {
  457 |         // Use value encoding which doesn't compress data, ensuring large buffers
  458 |         // Create 1024 i32 values (4KB of data)
  459 |         let values: Vec<i32> = (0..1024).collect();
  460 |         let data = LanceBuffer::from_bytes(
  461 |             bytemuck::cast_slice(&values).to_vec().into(),
  462 |             std::mem::align_of::<i32>() as u64,
  463 |         );
  464 |         let block = DataBlock::FixedWidth(FixedWidthDataBlock {
  465 |             bits_per_value: 32,
  466 |             data,
  467 |             num_values: 1024,
  468 |             block_info: BlockInfo::new(),
  469 |         });
  470 | 
  471 |         // Create compressor with ValueEncoder (no compression) and Zstd wrapper
  472 |         let inner = Box::new(ValueEncoder {});
  473 |         let compression = CompressionConfig {
  474 |             scheme: CompressionScheme::Zstd,
  475 |             level: Some(3),
  476 |         };
  477 |         let compressor = GeneralMiniBlockCompressor::new(inner, compression);
  478 | 
  479 |         // Compress the data
  480 |         let (compressed, encoding) = compressor.compress(miniblock_context(), block).unwrap();
  481 | 
  482 |         // Should get GeneralMiniBlock encoding since buffer is 4KB
  483 |         match &encoding.compression {
  484 |             Some(Compression::General(cm)) => {
  485 |                 assert!(cm.values.is_some());
  486 |                 assert_eq!(
  487 |                     cm.compression.as_ref().unwrap().scheme(),
  488 |                     pb21::CompressionScheme::CompressionAlgorithmZstd
  489 |                 );
  490 |                 assert_eq!(cm.compression.as_ref().unwrap().level, Some(3));
  491 | 
  492 |                 // Verify inner encoding is Flat (from ValueEncoder)
  493 |                 match &cm.values.as_ref().unwrap().compression {
  494 |                     Some(Compression::Flat(flat)) => {
  495 |                         assert_eq!(flat.bits_per_value, 32);
  496 |                     }
  497 |                     _ => panic!("Expected Flat inner encoding"),
  498 |                 }
  499 |             }
  500 |             _ => panic!("Expected GeneralMiniBlock encoding"),
  501 |         }
  502 | 
  503 |         assert_eq!(compressed.num_values, 1024);
  504 |         // ValueEncoder produces 1 buffer, so compressed result also has 1 buffer
  505 |         assert_eq!(compressed.data.len(), 1);
  506 |     }
  507 | 
  508 |     // Special test cases that don't fit the table-driven pattern
  509 | 
  510 |     #[test]
  511 |     fn test_compressed_mini_block_rle_multiple_buffers() {
  512 |         // RLE produces 2 buffers (values and lengths), test that both are handled correctly
  513 |         let data = create_repeated_i32_block(vec![1; 100]);
  514 |         let compressor = GeneralMiniBlockCompressor::new(
  515 |             Box::new(RleEncoder::new()),
  516 |             CompressionConfig {
  517 |                 scheme: CompressionScheme::Lz4,
  518 |                 level: None,
  519 |             },
  520 |         );
  521 | 
  522 |         let (compressed, _) = compressor.compress(miniblock_context(), data).unwrap();
  523 |         // RLE produces 2 buffers, but only the first one is compressed
  524 |         assert_eq!(compressed.data.len(), 2);
  525 |     }
  526 | 
  527 |     #[test]
  528 |     fn test_rle_with_general_miniblock_wrapper() {
  529 |         // Test that RLE encoding with bits_per_value >= 32 is automatically wrapped
  530 |         // in GeneralMiniBlock with LZ4 compression
  531 | 
  532 |         // This test directly tests the RLE encoder behavior
  533 |         // When bits_per_value >= 32, RLE should be wrapped in GeneralMiniBlock with LZ4
  534 | 
  535 |         // Test case 1: 32-bit RLE data
  536 |         let test_32 = TestCase {
  537 |             name: "rle_32bit_with_general_wrapper",
  538 |             inner_encoder: Box::new(RleEncoder::new()),
  539 |             compression: CompressionConfig {
  540 |                 scheme: CompressionScheme::Lz4,
  541 |                 level: None,
  542 |             },
  543 |             data: create_repeated_i32_block(vec![1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3]),
  544 |             expected_compressed: false, // RLE already compresses well, LZ4 might not help much
  545 |             min_compression_ratio: 1.0,
  546 |         };
  547 | 
  548 |         // For 32-bit RLE, the compression strategy should automatically wrap it
  549 |         // Let's directly test the compressor
  550 |         let compressor = GeneralMiniBlockCompressor::new(
  551 |             Box::new(RleEncoder::new()),
  552 |             CompressionConfig {
  553 |                 scheme: CompressionScheme::Lz4,
  554 |                 level: None,
  555 |             },
  556 |         );
  557 | 
  558 |         let (_compressed, encoding) = compressor
  559 |             .compress(miniblock_context(), test_32.data)
  560 |             .unwrap();
  561 | 
  562 |         // Verify the encoding structure
  563 |         match &encoding.compression {
  564 |             Some(Compression::General(cm)) => {
  565 |                 // Check inner encoding is RLE
  566 |                 match &cm.values.as_ref().unwrap().compression {
  567 |                     Some(Compression::Rle(rle)) => {
  568 |                         let Compression::Flat(values) =
  569 |                             rle.values.as_ref().unwrap().compression.as_ref().unwrap()
  570 |                         else {
  571 |                             panic!("Expected flat for RLE values")
  572 |                         };
  573 |                         let Compression::Flat(run_lengths) = rle
  574 |                             .run_lengths
  575 |                             .as_ref()
  576 |                             .unwrap()
  577 |                             .compression
  578 |                             .as_ref()
  579 |                             .unwrap()
  580 |                         else {
  581 |                             panic!("Expected flat for RLE run lengths")
  582 |                         };
  583 |                         assert_eq!(values.bits_per_value, 32);
  584 |                         assert_eq!(run_lengths.bits_per_value, 8);
  585 |                     }
  586 |                     _ => panic!("Expected RLE as inner encoding"),
  587 |                 }
  588 |                 // Check compression is LZ4
  589 |                 assert_eq!(
  590 |                     cm.compression.as_ref().unwrap().scheme(),
  591 |                     pb21::CompressionScheme::CompressionAlgorithmLz4
  592 |                 );
  593 |             }
  594 |             Some(Compression::Rle(_)) => {
  595 |                 // Also acceptable if compression didn't help
  596 |             }
  597 |             _ => panic!("Expected GeneralMiniBlock or Rle encoding"),
  598 |         }
  599 | 
  600 |         // Test case 2: 64-bit RLE data
  601 |         let values_64: Vec<i64> = vec![100i64; 50]
  602 |             .into_iter()
  603 |             .chain(vec![200i64; 50])
  604 |             .chain(vec![300i64; 50])
  605 |             .collect();
  606 |         let array_64 = arrow_array::Int64Array::from(values_64);
  607 |         let block_64 = DataBlock::from_array(array_64);
  608 | 
  609 |         let compressor_64 = GeneralMiniBlockCompressor::new(
  610 |             Box::new(RleEncoder::new()),
  611 |             CompressionConfig {
  612 |                 scheme: CompressionScheme::Lz4,
  613 |                 level: None,
  614 |             },
  615 |         );
  616 | 
  617 |         let (_compressed_64, encoding_64) = compressor_64
  618 |             .compress(miniblock_context(), block_64)
  619 |             .unwrap();
  620 | 
  621 |         // Verify the encoding structure for 64-bit
  622 |         match &encoding_64.compression {
  623 |             Some(Compression::General(cm)) => {
  624 |                 // Check inner encoding is RLE
  625 |                 match &cm.values.as_ref().unwrap().compression {
  626 |                     Some(Compression::Rle(rle)) => {
  627 |                         let Compression::Flat(values) =
  628 |                             rle.values.as_ref().unwrap().compression.as_ref().unwrap()
  629 |                         else {
  630 |                             panic!("Expected flat for RLE values")
  631 |                         };
  632 |                         let Compression::Flat(run_lengths) = rle
  633 |                             .run_lengths
  634 |                             .as_ref()
  635 |                             .unwrap()
  636 |                             .compression
  637 |                             .as_ref()
  638 |                             .unwrap()
  639 |                         else {
  640 |                             panic!("Expected flat for RLE run lengths")
  641 |                         };
  642 |                         assert_eq!(values.bits_per_value, 64);
  643 |                         assert_eq!(run_lengths.bits_per_value, 8);
  644 |                     }
  645 |                     _ => panic!("Expected RLE as inner encoding for 64-bit"),
  646 |                 }
  647 |                 // Check compression is LZ4
  648 |                 assert_eq!(
  649 |                     cm.compression.as_ref().unwrap().scheme(),
  650 |                     pb21::CompressionScheme::CompressionAlgorithmLz4
  651 |                 );
  652 |             }
  653 |             Some(Compression::Rle(_)) => {
  654 |                 // Also acceptable if compression didn't help
  655 |             }
  656 |             _ => panic!("Expected GeneralMiniBlock or Rle encoding for 64-bit"),
  657 |         }
  658 |     }
  659 | 
  660 |     #[test]
  661 |     fn test_compressed_mini_block_empty_data() {
  662 |         let empty_array = Int32Array::from(vec![] as Vec<i32>);
  663 |         let empty_block = DataBlock::from_array(empty_array);
  664 | 
  665 |         let compressor = GeneralMiniBlockCompressor::new(
  666 |             Box::new(ValueEncoder {}),
  667 |             CompressionConfig {
  668 |                 scheme: CompressionScheme::Lz4,
  669 |                 level: None,
  670 |             },
  671 |         );
  672 | 
  673 |         let result = compressor.compress(miniblock_context(), empty_block);
  674 |         match result {
  675 |             Ok((compressed, _)) => {
  676 |                 assert_eq!(compressed.num_values, 0);
  677 |             }
  678 |             Err(_) => {
  679 |                 // Empty data might not be supported by ValueEncoder
  680 |             }
  681 |         }
  682 |     }
  683 | }
``````
