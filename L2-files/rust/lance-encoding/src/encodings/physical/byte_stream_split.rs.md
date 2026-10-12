> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md).

# rust/lance-encoding/src/encodings/physical/byte_stream_split.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `43a8fd0377d5f7de10e3f70d9210326644dd0cb95cdbbf2fafec7523e24f27e6`. Reviewed physical lines: 1-456.

[Module](../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Byte-position transposition of32/64-bit fixed values within mini-block chunks, inverse, entropy selector and three unit tests. Transform preserves length and relies on separate compression. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:1-456)

## Complete range analysis

### Lines 1-57

Documentation illustrates f32[1,2,3,4] little-endian byte positions regrouped into four streams, and inverse. BSS is a lossless byte transpose, not itself byte compression. Claimed improved compression is motivation, not measured evidence; integer bit patterns can also be transformed. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:1-57)

### Lines 58-82

Imports Arrow buffer, BlockInfo/statistics, BssMode and protobuf helper. Public Debug Clone ByteStreamSplitEncoder stores private usize bits_per_value. Local code has no IO/async/unsafe. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:58-82)

### Lines 83-108

new asserts exactly32or64 bits. Private bytes_per_value is width/8; max_chunk_size returns1024 for32,512 for64, each4096 raw bytes. Hardcoded powers of two fit8186-byte upper framing budget; cached MAX_MINIBLOCK_VALUES and input context are not used. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:83-108)

### Lines 109-133

Mini compress requires FixedWidth else InvalidInputSource. Uses configured width and input logical count without checking block width, exact data length or Arrow numeric type. Count0 returns no buffers/no chunks and BSS(Flat(configwidth,None)), discarding any provided bytes. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:109-133)

### Lines 134-171

For positive count allocate count-as-usize*bytewidth zero bytes unchecked. For each chunk n up to hardcoded maximum, transpose input[(processed+i)*width+j] into output[chunk_offset+j*n+i]. Short input panics, extra input ignored; width disagreement can reinterpret/lose bytes. Runtime cost O(count*width), one full output allocation. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:134-171)

### Lines 172-195

Record each payload size n*width; final chunk always log0 even when full, nonfinal log10/9. Return one concatenated buffer, metadata and original count. No local padding; nested Flat optional compressionNone and TODO for underlying compression. Every chunk must be separated before inverse. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:172-195)

### Lines 196-215

Public Debug ByteStreamSplitDecompressor has same private width/new assertion and private bytes_per_value helper. Constructor takes metadata width, no own codec nesting parser. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:196-215)

### Lines 216-239

Mini decode count0 returns empty FixedWidth before checking buffer count or bytes, so arbitrary input is discarded. Positive count computes unchecked expected count-as-usize*width, requires exactly one buffer or InvalidInputSource with actual count. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:216-239)

### Lines 240-274

Require exact byte length or contextual InvalidInputSource; allocate full output and inverse out[i*width+j]=input[j*num_values+i]. Return configured bits/count/fresh stats. No maximum chunk count check: passing concatenated multi-chunk buffer with total count satisfies length but applies wrong inverse. decoded_size_bytes uses checked u64 count*width, returningNone on overflow, without allocation-capacity validation. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:240-274)

### Lines 275-298

Public should_use_bss first rejects widths except32/64. Mode sensitivity Off0,On1,Auto0.5:Offfalse,Ontrue (even empty supported-width data),otherwise evaluate entropy. No floating Arrow type check; this selector is width-based. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:275-298)

### Lines 299-325

Private evaluate_entropy_for_bss requests BytePositionEntropy statistic; missing Option yieldsfalse, wrong statistic kind panics, empty arrayfalse. Empty stats registry itself panics in get_stat before Option handling. Average=sum_u64(entropies)/len/1000.0; strict average<sensitivity*8, so Auto average<4bits. No entropy length/scale validation, sum overflow guards or measured savings threshold. (rust/lance-encoding/src/statistics.rs:311-354) (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:299-325)

### Lines 326-379

Private cfg(test) f32 roundtrip uses eight values1,2.5,-3.7,4.2,+0,-0,+inf,-inf, constructsLE bytes and compares decoded numeric values. Only one chunk, no expected transpose bytes/metadata assertions. Numeric equality does not distinguish +0/-0 bit preservation; noNaN case. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:326-379)

### Lines 380-429

f64 roundtrip mirrors same eight values and assertions at64bits, one chunk. Does not test multiple chunk boundaries, configured/input width mismatch, invalid buffers or entropy selection. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:380-429)

### Lines 430-456

Empty32-bit test compresses count0 empty data, decodes zero with returned no buffers and asserts count/byte length zero. Three test functions inspected, not run. No Off/On/Auto decision tests or corruption/error cases local. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:430-456)

## Interaction and interpretation limits

Every physical source line read in bounded untruncated ANALYZE75 outputs. No source build/test/lint/benchmark/generator or installation ran. Contextual dependencies remain partially read; potential failure paths are source deductions, not runtime reproductions.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! # Byte Stream Split (BSS) Miniblock Format
    5 | //!
    6 | //! Byte Stream Split is a data transformation technique that improves compression
    7 | //! by reorganizing multi-byte values to group bytes from the same position together.
    8 | //! This is particularly effective for data where some byte positions have low entropy.
    9 | //!
   10 | //! ## How It Works
   11 | //!
   12 | //! BSS splits multi-byte values by byte position, creating separate streams
   13 | //! for each byte position across all values. This transformation is most beneficial
   14 | //! when certain byte positions have low entropy (e.g., high-order bytes that are
   15 | //! mostly zeros, sign-extended bytes, or floating-point sign/exponent bytes that
   16 | //! cluster around common values).
   17 | //!
   18 | //! ### Example
   19 | //!
   20 | //! Input data (f32): `[1.0, 2.0, 3.0, 4.0]`
   21 | //!
   22 | //! In little-endian bytes:
   23 | //! - 1.0 = `[00, 00, 80, 3F]`
   24 | //! - 2.0 = `[00, 00, 00, 40]`
   25 | //! - 3.0 = `[00, 00, 40, 40]`
   26 | //! - 4.0 = `[00, 00, 80, 40]`
   27 | //!
   28 | //! After BSS transformation:
   29 | //! - Byte stream 0: `[00, 00, 00, 00]` (all first bytes)
   30 | //! - Byte stream 1: `[00, 00, 00, 00]` (all second bytes)
   31 | //! - Byte stream 2: `[80, 00, 40, 80]` (all third bytes)
   32 | //! - Byte stream 3: `[3F, 40, 40, 40]` (all fourth bytes)
   33 | //!
   34 | //! Output: `[00, 00, 00, 00, 00, 00, 00, 00, 80, 00, 40, 80, 3F, 40, 40, 40]`
   35 | //!
   36 | //! ## Compression Benefits
   37 | //!
   38 | //! BSS itself doesn't compress data - it reorders it. The compression benefit
   39 | //! comes when BSS is combined with general-purpose compression (e.g., LZ4):
   40 | //!
   41 | //! 1. **Timestamps**: Sequential timestamps have similar high-order bytes
   42 | //! 2. **Sensor data**: Readings often vary in a small range, sharing exponent bits
   43 | //! 3. **Financial data**: Prices may cluster around certain values
   44 | //!
   45 | //! ## Supported Types
   46 | //!
   47 | //! - 32-bit floating point (f32)
   48 | //! - 64-bit floating point (f64)
   49 | //!
   50 | //! ## Chunk Handling
   51 | //!
   52 | //! - Maximum chunk size depends on data type:
   53 | //!   - f32: 1024 values (4KB per chunk)
   54 | //!   - f64: 512 values (4KB per chunk)
   55 | //! - All chunks share a single global buffer
   56 | //! - Non-last chunks always contain power-of-2 values
   57 | 
   58 | use std::fmt::Debug;
   59 | 
   60 | use crate::buffer::LanceBuffer;
   61 | use crate::compression::MiniBlockDecompressor;
   62 | use crate::compression_config::BssMode;
   63 | use crate::data::{BlockInfo, DataBlock, FixedWidthDataBlock};
   64 | use crate::encodings::logical::primitive::miniblock::{
   65 |     MiniBlockChunk, MiniBlockCompressed, MiniBlockCompressionContext, MiniBlockCompressor,
   66 | };
   67 | use crate::format::ProtobufUtils21;
   68 | use crate::format::pb21::CompressiveEncoding;
   69 | use crate::statistics::{GetStat, Stat};
   70 | use arrow_array::{cast::AsArray, types::UInt64Type};
   71 | use lance_core::Result;
   72 | 
   73 | /// Byte Stream Split encoder for floating point values
   74 | ///
   75 | /// This encoding splits floating point values by byte position and stores
   76 | /// each byte stream separately. This improves compression ratios for
   77 | /// floating point data with similar patterns.
   78 | #[derive(Debug, Clone)]
   79 | pub struct ByteStreamSplitEncoder {
   80 |     bits_per_value: usize,
   81 | }
   82 | 
   83 | impl ByteStreamSplitEncoder {
   84 |     pub fn new(bits_per_value: usize) -> Self {
   85 |         assert!(
   86 |             bits_per_value == 32 || bits_per_value == 64,
   87 |             "ByteStreamSplit only supports 32-bit (f32) or 64-bit (f64) values"
   88 |         );
   89 |         Self { bits_per_value }
   90 |     }
   91 | 
   92 |     fn bytes_per_value(&self) -> usize {
   93 |         self.bits_per_value / 8
   94 |     }
   95 | 
   96 |     fn max_chunk_size(&self) -> usize {
   97 |         // For ByteStreamSplit, total bytes = bytes_per_value * chunk_size
   98 |         // MAX_MINIBLOCK_BYTES = 8186
   99 |         // For f32 (4 bytes): 8186 / 4 = 2046, so max chunk = 1024 (power of 2)
  100 |         // For f64 (8 bytes): 8186 / 8 = 1023, so max chunk = 512 (power of 2)
  101 |         match self.bits_per_value {
  102 |             32 => 1024,
  103 |             64 => 512,
  104 |             _ => unreachable!("ByteStreamSplit only supports 32 or 64 bit values"),
  105 |         }
  106 |     }
  107 | }
  108 | 
  109 | impl MiniBlockCompressor for ByteStreamSplitEncoder {
  110 |     fn compress(
  111 |         &self,
  112 |         _context: MiniBlockCompressionContext,
  113 |         page: DataBlock,
  114 |     ) -> Result<(MiniBlockCompressed, CompressiveEncoding)> {
  115 |         match page {
  116 |             DataBlock::FixedWidth(data) => {
  117 |                 let num_values = data.num_values;
  118 |                 let bytes_per_value = self.bytes_per_value();
  119 | 
  120 |                 if num_values == 0 {
  121 |                     return Ok((
  122 |                         MiniBlockCompressed {
  123 |                             data: vec![],
  124 |                             chunks: vec![],
  125 |                             num_values: 0,
  126 |                         },
  127 |                         ProtobufUtils21::byte_stream_split(ProtobufUtils21::flat(
  128 |                             self.bits_per_value as u64,
  129 |                             None,
  130 |                         )),
  131 |                     ));
  132 |                 }
  133 | 
  134 |                 let total_size = num_values as usize * bytes_per_value;
  135 |                 let mut global_buffer = vec![0u8; total_size];
  136 | 
  137 |                 let mut chunks = Vec::new();
  138 |                 let data_slice = data.data.as_ref();
  139 |                 let mut processed_values = 0usize;
  140 |                 let max_chunk_size = self.max_chunk_size();
  141 | 
  142 |                 while processed_values < num_values as usize {
  143 |                     let chunk_size = (num_values as usize - processed_values).min(max_chunk_size);
  144 |                     let chunk_offset = processed_values * bytes_per_value;
  145 | 
  146 |                     // Create chunk-local byte streams
  147 |                     for i in 0..chunk_size {
  148 |                         let src_offset = (processed_values + i) * bytes_per_value;
  149 |                         for j in 0..bytes_per_value {
  150 |                             // Store in chunk-local byte stream format
  151 |                             let dst_offset = chunk_offset + j * chunk_size + i;
  152 |                             global_buffer[dst_offset] = data_slice[src_offset + j];
  153 |                         }
  154 |                     }
  155 | 
  156 |                     let chunk_bytes = chunk_size * bytes_per_value;
  157 |                     let log_num_values = if processed_values + chunk_size == num_values as usize {
  158 |                         0 // Last chunk
  159 |                     } else {
  160 |                         chunk_size.ilog2() as u8
  161 |                     };
  162 | 
  163 |                     debug_assert!(chunk_bytes > 0);
  164 |                     chunks.push(MiniBlockChunk {
  165 |                         buffer_sizes: vec![chunk_bytes as u32],
  166 |                         log_num_values,
  167 |                     });
  168 | 
  169 |                     processed_values += chunk_size;
  170 |                 }
  171 | 
  172 |                 let data_buffers = vec![LanceBuffer::from(global_buffer)];
  173 | 
  174 |                 // TODO: Should support underlying compression
  175 |                 let encoding = ProtobufUtils21::byte_stream_split(ProtobufUtils21::flat(
  176 |                     self.bits_per_value as u64,
  177 |                     None,
  178 |                 ));
  179 | 
  180 |                 Ok((
  181 |                     MiniBlockCompressed {
  182 |                         data: data_buffers,
  183 |                         chunks,
  184 |                         num_values,
  185 |                     },
  186 |                     encoding,
  187 |                 ))
  188 |             }
  189 |             _ => Err(lance_core::Error::invalid_input_source(
  190 |                 "ByteStreamSplit encoding only supports FixedWidth data blocks".into(),
  191 |             )),
  192 |         }
  193 |     }
  194 | }
  195 | 
  196 | /// Byte Stream Split decompressor
  197 | #[derive(Debug)]
  198 | pub struct ByteStreamSplitDecompressor {
  199 |     bits_per_value: usize,
  200 | }
  201 | 
  202 | impl ByteStreamSplitDecompressor {
  203 |     pub fn new(bits_per_value: usize) -> Self {
  204 |         assert!(
  205 |             bits_per_value == 32 || bits_per_value == 64,
  206 |             "ByteStreamSplit only supports 32-bit (f32) or 64-bit (f64) values"
  207 |         );
  208 |         Self { bits_per_value }
  209 |     }
  210 | 
  211 |     fn bytes_per_value(&self) -> usize {
  212 |         self.bits_per_value / 8
  213 |     }
  214 | }
  215 | 
  216 | impl MiniBlockDecompressor for ByteStreamSplitDecompressor {
  217 |     fn decompress(&self, data: Vec<LanceBuffer>, num_values: u64) -> Result<DataBlock> {
  218 |         if num_values == 0 {
  219 |             return Ok(DataBlock::FixedWidth(FixedWidthDataBlock {
  220 |                 data: LanceBuffer::empty(),
  221 |                 bits_per_value: self.bits_per_value as u64,
  222 |                 num_values: 0,
  223 |                 block_info: BlockInfo::new(),
  224 |             }));
  225 |         }
  226 | 
  227 |         let bytes_per_value = self.bytes_per_value();
  228 |         let total_bytes = num_values as usize * bytes_per_value;
  229 | 
  230 |         if data.len() != 1 {
  231 |             return Err(lance_core::Error::invalid_input_source(
  232 |                 format!(
  233 |                     "ByteStreamSplit decompression expects 1 buffer, but got {}",
  234 |                     data.len()
  235 |                 )
  236 |                 .into(),
  237 |             ));
  238 |         }
  239 | 
  240 |         let input_buffer = &data[0];
  241 | 
  242 |         if input_buffer.len() != total_bytes {
  243 |             return Err(lance_core::Error::invalid_input_source(
  244 |                 format!(
  245 |                     "Expected {} bytes for decompression, but got {}",
  246 |                     total_bytes,
  247 |                     input_buffer.len()
  248 |                 )
  249 |                 .into(),
  250 |             ));
  251 |         }
  252 | 
  253 |         let mut output = vec![0u8; total_bytes];
  254 | 
  255 |         // Input buffer contains chunk-local byte streams
  256 |         for i in 0..num_values as usize {
  257 |             for j in 0..bytes_per_value {
  258 |                 let src_offset = j * num_values as usize + i;
  259 |                 output[i * bytes_per_value + j] = input_buffer[src_offset];
  260 |             }
  261 |         }
  262 | 
  263 |         Ok(DataBlock::FixedWidth(FixedWidthDataBlock {
  264 |             data: LanceBuffer::from(output),
  265 |             bits_per_value: self.bits_per_value as u64,
  266 |             num_values,
  267 |             block_info: BlockInfo::new(),
  268 |         }))
  269 |     }
  270 | 
  271 |     fn decoded_size_bytes(&self, num_values: u64) -> Option<u64> {
  272 |         num_values.checked_mul(self.bytes_per_value() as u64)
  273 |     }
  274 | }
  275 | 
  276 | /// Determine if BSS should be used based on mode and data characteristics
  277 | pub fn should_use_bss(data: &FixedWidthDataBlock, mode: BssMode) -> bool {
  278 |     // Only support 32-bit and 64-bit values
  279 |     // BSS is most effective for these common types (floats, timestamps, etc.)
  280 |     // 16-bit values have limited benefit with only 2 streams
  281 |     if data.bits_per_value != 32 && data.bits_per_value != 64 {
  282 |         return false;
  283 |     }
  284 | 
  285 |     let sensitivity = mode.to_sensitivity();
  286 | 
  287 |     // Fast paths
  288 |     if sensitivity <= 0.0 {
  289 |         return false;
  290 |     }
  291 |     if sensitivity >= 1.0 {
  292 |         return true;
  293 |     }
  294 | 
  295 |     // Auto mode: check byte position entropy
  296 |     evaluate_entropy_for_bss(data, sensitivity)
  297 | }
  298 | 
  299 | /// Evaluate if BSS should be used based on byte position entropy
  300 | fn evaluate_entropy_for_bss(data: &FixedWidthDataBlock, sensitivity: f32) -> bool {
  301 |     // Get the precomputed entropy statistics
  302 |     let Some(entropy_stat) = data.get_stat(Stat::BytePositionEntropy) else {
  303 |         return false; // No entropy data available
  304 |     };
  305 | 
  306 |     let entropies = entropy_stat.as_primitive::<UInt64Type>();
  307 |     if entropies.is_empty() {
  308 |         return false;
  309 |     }
  310 | 
  311 |     // Calculate average entropy across all byte positions
  312 |     let sum: u64 = entropies.values().iter().sum();
  313 |     let avg_entropy = sum as f64 / entropies.len() as f64 / 1000.0; // Scale back from integer
  314 | 
  315 |     // Entropy threshold based on sensitivity
  316 |     // sensitivity = 0.5 (default auto) -> threshold = 4.0 bits
  317 |     // sensitivity = 0.0 (off) -> threshold = 0.0 (never use)
  318 |     // sensitivity = 1.0 (on) -> threshold = 8.0 (always use)
  319 |     let entropy_threshold = sensitivity as f64 * 8.0;
  320 | 
  321 |     // Use BSS if average entropy is below threshold
  322 |     // Lower entropy means more repetitive byte patterns
  323 |     avg_entropy < entropy_threshold
  324 | }
  325 | 
  326 | #[cfg(test)]
  327 | mod tests {
  328 |     use super::*;
  329 | 
  330 |     #[test]
  331 |     fn test_round_trip_f32() {
  332 |         let encoder = ByteStreamSplitEncoder::new(32);
  333 |         let decompressor = ByteStreamSplitDecompressor::new(32);
  334 | 
  335 |         // Test data
  336 |         let values: Vec<f32> = vec![
  337 |             1.0,
  338 |             2.5,
  339 |             -3.7,
  340 |             4.2,
  341 |             0.0,
  342 |             -0.0,
  343 |             f32::INFINITY,
  344 |             f32::NEG_INFINITY,
  345 |         ];
  346 |         let bytes: Vec<u8> = values.iter().flat_map(|v| v.to_le_bytes()).collect();
  347 | 
  348 |         let data_block = DataBlock::FixedWidth(FixedWidthDataBlock {
  349 |             data: LanceBuffer::from(bytes),
  350 |             bits_per_value: 32,
  351 |             num_values: values.len() as u64,
  352 |             block_info: BlockInfo::new(),
  353 |         });
  354 | 
  355 |         // Compress
  356 |         let (compressed, _encoding) = encoder
  357 |             .compress(MiniBlockCompressionContext::new(0, true, true), data_block)
  358 |             .unwrap();
  359 | 
  360 |         // Decompress
  361 |         let decompressed = decompressor
  362 |             .decompress(compressed.data, values.len() as u64)
  363 |             .unwrap();
  364 |         let DataBlock::FixedWidth(decompressed_fixed) = &decompressed else {
  365 |             panic!("Expected FixedWidth DataBlock")
  366 |         };
  367 | 
  368 |         // Verify
  369 |         let result_bytes = decompressed_fixed.data.as_ref();
  370 |         let result_values: Vec<f32> = result_bytes
  371 |             .as_chunks::<4>()
  372 |             .0
  373 |             .iter()
  374 |             .map(|chunk| f32::from_le_bytes(*chunk))
  375 |             .collect();
  376 | 
  377 |         assert_eq!(values, result_values);
  378 |     }
  379 | 
  380 |     #[test]
  381 |     fn test_round_trip_f64() {
  382 |         let encoder = ByteStreamSplitEncoder::new(64);
  383 |         let decompressor = ByteStreamSplitDecompressor::new(64);
  384 | 
  385 |         // Test data
  386 |         let values: Vec<f64> = vec![
  387 |             1.0,
  388 |             2.5,
  389 |             -3.7,
  390 |             4.2,
  391 |             0.0,
  392 |             -0.0,
  393 |             f64::INFINITY,
  394 |             f64::NEG_INFINITY,
  395 |         ];
  396 |         let bytes: Vec<u8> = values.iter().flat_map(|v| v.to_le_bytes()).collect();
  397 | 
  398 |         let data_block = DataBlock::FixedWidth(FixedWidthDataBlock {
  399 |             data: LanceBuffer::from(bytes),
  400 |             bits_per_value: 64,
  401 |             num_values: values.len() as u64,
  402 |             block_info: BlockInfo::new(),
  403 |         });
  404 | 
  405 |         // Compress
  406 |         let (compressed, _encoding) = encoder
  407 |             .compress(MiniBlockCompressionContext::new(0, true, true), data_block)
  408 |             .unwrap();
  409 | 
  410 |         // Decompress
  411 |         let decompressed = decompressor
  412 |             .decompress(compressed.data, values.len() as u64)
  413 |             .unwrap();
  414 |         let DataBlock::FixedWidth(decompressed_fixed) = &decompressed else {
  415 |             panic!("Expected FixedWidth DataBlock")
  416 |         };
  417 | 
  418 |         // Verify
  419 |         let result_bytes = decompressed_fixed.data.as_ref();
  420 |         let result_values: Vec<f64> = result_bytes
  421 |             .as_chunks::<8>()
  422 |             .0
  423 |             .iter()
  424 |             .map(|chunk| f64::from_le_bytes(*chunk))
  425 |             .collect();
  426 | 
  427 |         assert_eq!(values, result_values);
  428 |     }
  429 | 
  430 |     #[test]
  431 |     fn test_empty_data() {
  432 |         let encoder = ByteStreamSplitEncoder::new(32);
  433 |         let decompressor = ByteStreamSplitDecompressor::new(32);
  434 | 
  435 |         let data_block = DataBlock::FixedWidth(FixedWidthDataBlock {
  436 |             data: LanceBuffer::empty(),
  437 |             bits_per_value: 32,
  438 |             num_values: 0,
  439 |             block_info: BlockInfo::new(),
  440 |         });
  441 | 
  442 |         // Compress empty data
  443 |         let (compressed, _encoding) = encoder
  444 |             .compress(MiniBlockCompressionContext::new(0, true, true), data_block)
  445 |             .unwrap();
  446 | 
  447 |         // Decompress empty data
  448 |         let decompressed = decompressor.decompress(compressed.data, 0).unwrap();
  449 |         let DataBlock::FixedWidth(decompressed_fixed) = &decompressed else {
  450 |             panic!("Expected FixedWidth DataBlock")
  451 |         };
  452 | 
  453 |         assert_eq!(decompressed_fixed.num_values, 0);
  454 |         assert_eq!(decompressed_fixed.data.len(), 0);
  455 |     }
  456 | }
``````
