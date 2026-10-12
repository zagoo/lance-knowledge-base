> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/encodings/physical/fsst.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `f0d8c54ee1ea73b3a08e7e270ec6af33cae92e5c2d53638cd4b6e5c7156c1f54`. Reviewed physical lines: 1-469.

[Module](../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Current FSST wrappers for variable mini-block and per-value data; delegates symbol-table kernel and inner codec, owns allocation/metadata/error mapping. Kernel crate remains partially analyzed. (rust/lance-encoding/src/encodings/physical/fsst.rs:1-469)

## Complete range analysis

### Lines 1-35

SPDX/imports and design describe FSST symbol table per page, wrapping mini-block/per-value binary data. Per-chunk tables and multiple per-value tables are future ideas, not implemented. Imports dependency compress/decompress,TABLESIZE and Arrow offset trait; no local unsafe or IO. (rust/lance-encoding/src/encodings/physical/fsst.rs:1-35)

### Lines 36-47

Crate-internal map_fsst_error maps io InvalidData to CorruptFile named fsst and all other IO errors through ordinary Lance conversion. Private FsstCompressed owns VariableWidthBlock and Vec<u8> symbol_table. Encode calls do not use this mapping. (rust/lance-encoding/src/encodings/physical/fsst.rs:36-47)

### Lines 48-85

Private fsst_compress requires VariableWidth.32-bit offsets typed as i32, payload Arrow buffer; allocate offsets.len()*2 elements,values.len()*2 zero bytes and FSST table-size zero bytes. Call dependency compress with ? (ordinary IO conversion), then wrap actual resized outputs at32bits/original count/fresh BlockInfo. Multiplications unchecked; no savings check/normalization. (rust/lance-encoding/src/encodings/physical/fsst.rs:48-85)

### Lines 86-135

64-bit path mirrors with i64 offsets. Unsupported offset width panics; nonvariable input returns InvalidInputSource. Counts/nulls/offset validity are delegated or assumed. Kernel table has2312bytes; switch is off for input shorter than32768, preserving raw bytes/offsets with table metadata. (rust/compression/fsst/src/fsst.rs:22-56; rust/compression/fsst/src/fsst.rs:1115-1218) (rust/lance-encoding/src/encodings/physical/fsst.rs:86-135)

### Lines 136-146

Public Debug Default FsstMiniBlockEncoder stores private Option<i64> minichunk_size; new just stores it. DefaultNone follows BinaryMiniBlockEncoder environment budget later. (rust/lance-encoding/src/encodings/physical/fsst.rs:136-146)

### Lines 147-170

Mini compression first FSST-compresses whole input, creates a boxed BinaryMiniBlockEncoder per call, forwards context and compresses transformed variable data. Wrap inner descriptor in Fsst with owned table. Boundaries use compressed byte sizes; no ratio comparison or fallback after FSST. (rust/lance-encoding/src/encodings/physical/fsst.rs:147-170)

### Lines 171-196

Public Debug FsstPerValueEncoder owns boxed dyn PerValueCompressor, supplied by new. Compress FSST first, invoke custom inner on transformed VariableWidth, then return inner data and Fsst(inner descriptor,symbol table). Custom inner may change representation; matching read strategy must honor it to roundtrip. (rust/lance-encoding/src/encodings/physical/fsst.rs:171-196)

### Lines 197-214

Public Debug FsstPerValueDecompressor owns LanceBuffer symbol table and boxed dyn VariablePerValueDecompressor. new stores both without validating table. Construction is infallible; corrupt-table classification is deferred. (rust/lance-encoding/src/encodings/physical/fsst.rs:197-214)

### Lines 215-259

Per-value decode calls inner then as_variable_width().unwrap; unexpected inner kind panics.32-bit branch allocates compressed_bytes*8 zero bytes and offsets.len() zero i32 entries, invokes dependency decompress with map_fsst_error, then truncates offsets to inner num_values+1. truncate only shrinks; count addition/cast unchecked, not a consistency validator. (rust/lance-encoding/src/encodings/physical/fsst.rs:215-259)

### Lines 260-298

64-bit per-value branch mirrors i64; unsupported width panics. Return dependency-resized data/offsets, original width/count and empty stats. Eightfold buffer allocation precedes dependency checked size validation; unchecked wrapper multiplication remains a failure boundary. No decoded-size estimator. (rust/lance-encoding/src/encodings/physical/fsst.rs:260-298)

### Lines 299-316

Public Debug FsstMiniBlockDecompressor stores table buffer and boxed dyn MiniBlockDecompressor. new clones symbol_table from descriptor and uses injected inner; does not validate table or independently interpret descriptor.values. (rust/lance-encoding/src/encodings/physical/fsst.rs:299-316)

### Lines 317-353

Mini decode passes external requested count to inner, requires VariableWidth else panic. If width64 use i64 offsets, allocate8x bytes plus zero offset entries, dependency-decode/error-map and truncate offsets to external count+1. No local null handling, IO or async. (rust/lance-encoding/src/encodings/physical/fsst.rs:317-353)

### Lines 354-388

Every non64 inner width uses i32 decoding, without asserting32; returned block retains original inner bits value and external count even for malformed width. Both paths reset stats. Default MiniBlockDecompressor decoded_size remainsNone; no whole-block FSST implementation here. (rust/lance-encoding/src/encodings/physical/fsst.rs:354-388)

### Lines 389-431

Private cfg(test) module: async test_fsst spans explicit false/true and3 structural modes (six configurations),5000 strings of100bytes and expected fsst name. Comments describe automatic maxlen>=5 and size>=32KiB, but complete policy also excludes binary types automatically and may select per-value compression first. (rust/lance-encoding/src/compression.rs:655-696; rust/lance-encoding/src/compression.rs:797-841) (rust/lance-encoding/src/encodings/physical/fsst.rs:389-431)

### Lines 432-469

Corrupt-table test compresses a repeated sentence2048times directly through dependency, asserts header switch bit24/nonzero symbol count, changes first symbol length at8+nsyms*8 to9, then dependency-decodes with map_fsst_error. Requires CorruptFile and symbol-length substring. This checks kernel/error mapper, not both wrapper paths. Tests read, not executed; invalid table-size or magic/error kinds are not exhaustively covered. (rust/lance-encoding/src/encodings/physical/fsst.rs:432-469)

## Interaction and interpretation limits

Every physical source line read in bounded untruncated ANALYZE75 outputs. No source build/test/lint/benchmark/generator or installation ran. Contextual dependencies remain partially read; potential failure paths are source deductions, not runtime reproductions.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! FSST encoding
    5 | //!
    6 | //! FSST is a lightweight encoding for variable width data.  This module includes
    7 | //! adapters for both miniblock and per-value encoding.
    8 | //!
    9 | //! FSST encoding creates a small symbol table that is needed for decoding.  Currently
   10 | //! we create one symbol table per disk page and store it in the description.
   11 | //!
   12 | //! TODO: This seems to be potentially limiting.  Perhaps we should create one symbol
   13 | //! table per mini-block chunk?  In the per-value compression it may even make sense to
   14 | //! create multiple symbol tables for a single value!
   15 | //!
   16 | //! FSST encoding is transparent.
   17 | 
   18 | use lance_core::{Error, Result};
   19 | 
   20 | use crate::{
   21 |     buffer::LanceBuffer,
   22 |     compression::{MiniBlockDecompressor, VariablePerValueDecompressor},
   23 |     data::{BlockInfo, DataBlock, VariableWidthBlock},
   24 |     encodings::logical::primitive::{
   25 |         fullzip::{PerValueCompressor, PerValueDataBlock},
   26 |         miniblock::{MiniBlockCompressed, MiniBlockCompressionContext, MiniBlockCompressor},
   27 |     },
   28 |     format::{
   29 |         ProtobufUtils21,
   30 |         pb21::{self, CompressiveEncoding},
   31 |     },
   32 | };
   33 | 
   34 | use super::binary::BinaryMiniBlockEncoder;
   35 | 
   36 | pub(crate) fn map_fsst_error(err: std::io::Error) -> Error {
   37 |     match err.kind() {
   38 |         std::io::ErrorKind::InvalidData => Error::corrupt_file_named("fsst", err.to_string()),
   39 |         _ => err.into(),
   40 |     }
   41 | }
   42 | 
   43 | struct FsstCompressed {
   44 |     data: VariableWidthBlock,
   45 |     symbol_table: Vec<u8>,
   46 | }
   47 | 
   48 | impl FsstCompressed {
   49 |     fn fsst_compress(data: DataBlock) -> Result<Self> {
   50 |         match data {
   51 |             DataBlock::VariableWidth(variable_width) => {
   52 |                 match variable_width.bits_per_offset {
   53 |                     32 => {
   54 |                         let offsets = variable_width.offsets.borrow_to_typed_slice::<i32>();
   55 |                         let offsets_slice = offsets.as_ref();
   56 |                         let bytes_data = variable_width.data.into_buffer();
   57 | 
   58 |                         // prepare compression output buffer
   59 |                         let mut dest_offsets = vec![0_i32; offsets_slice.len() * 2];
   60 |                         let mut dest_values = vec![0_u8; bytes_data.len() * 2];
   61 |                         let mut symbol_table = vec![0_u8; fsst::fsst::FSST_SYMBOL_TABLE_SIZE];
   62 | 
   63 |                         // fsst compression
   64 |                         fsst::fsst::compress(
   65 |                             &mut symbol_table,
   66 |                             bytes_data.as_slice(),
   67 |                             offsets_slice,
   68 |                             &mut dest_values,
   69 |                             &mut dest_offsets,
   70 |                         )?;
   71 | 
   72 |                         // construct `DataBlock` for BinaryMiniBlockEncoder, we may want some `DataBlock` construct methods later
   73 |                         let compressed = VariableWidthBlock {
   74 |                             data: LanceBuffer::reinterpret_vec(dest_values),
   75 |                             bits_per_offset: 32,
   76 |                             offsets: LanceBuffer::reinterpret_vec(dest_offsets),
   77 |                             num_values: variable_width.num_values,
   78 |                             block_info: BlockInfo::new(),
   79 |                         };
   80 | 
   81 |                         Ok(Self {
   82 |                             data: compressed,
   83 |                             symbol_table,
   84 |                         })
   85 |                     }
   86 |                     64 => {
   87 |                         let offsets = variable_width.offsets.borrow_to_typed_slice::<i64>();
   88 |                         let offsets_slice = offsets.as_ref();
   89 |                         let bytes_data = variable_width.data.into_buffer();
   90 | 
   91 |                         // prepare compression output buffer
   92 |                         let mut dest_offsets = vec![0_i64; offsets_slice.len() * 2];
   93 |                         let mut dest_values = vec![0_u8; bytes_data.len() * 2];
   94 |                         let mut symbol_table = vec![0_u8; fsst::fsst::FSST_SYMBOL_TABLE_SIZE];
   95 | 
   96 |                         // fsst compression
   97 |                         fsst::fsst::compress(
   98 |                             &mut symbol_table,
   99 |                             bytes_data.as_slice(),
  100 |                             offsets_slice,
  101 |                             &mut dest_values,
  102 |                             &mut dest_offsets,
  103 |                         )?;
  104 | 
  105 |                         // construct `DataBlock` for BinaryMiniBlockEncoder, we may want some `DataBlock` construct methods later
  106 |                         let compressed = VariableWidthBlock {
  107 |                             data: LanceBuffer::reinterpret_vec(dest_values),
  108 |                             bits_per_offset: 64,
  109 |                             offsets: LanceBuffer::reinterpret_vec(dest_offsets),
  110 |                             num_values: variable_width.num_values,
  111 |                             block_info: BlockInfo::new(),
  112 |                         };
  113 | 
  114 |                         Ok(Self {
  115 |                             data: compressed,
  116 |                             symbol_table,
  117 |                         })
  118 |                     }
  119 |                     _ => panic!(
  120 |                         "Unsupported offsets type {}",
  121 |                         variable_width.bits_per_offset
  122 |                     ),
  123 |                 }
  124 |             }
  125 |             _ => Err(Error::invalid_input_source(
  126 |                 format!(
  127 |                     "Cannot compress a data block of type {} with FsstEncoder",
  128 |                     data.name()
  129 |                 )
  130 |                 .into(),
  131 |             )),
  132 |         }
  133 |     }
  134 | }
  135 | 
  136 | #[derive(Debug, Default)]
  137 | pub struct FsstMiniBlockEncoder {
  138 |     minichunk_size: Option<i64>,
  139 | }
  140 | 
  141 | impl FsstMiniBlockEncoder {
  142 |     pub fn new(minichunk_size: Option<i64>) -> Self {
  143 |         Self { minichunk_size }
  144 |     }
  145 | }
  146 | 
  147 | impl MiniBlockCompressor for FsstMiniBlockEncoder {
  148 |     fn compress(
  149 |         &self,
  150 |         context: MiniBlockCompressionContext,
  151 |         data: DataBlock,
  152 |     ) -> Result<(MiniBlockCompressed, CompressiveEncoding)> {
  153 |         let compressed = FsstCompressed::fsst_compress(data)?;
  154 | 
  155 |         let data_block = DataBlock::VariableWidth(compressed.data);
  156 | 
  157 |         // compress the fsst compressed data using `BinaryMiniBlockEncoder`
  158 |         let binary_compressor = Box::new(BinaryMiniBlockEncoder::new(self.minichunk_size))
  159 |             as Box<dyn MiniBlockCompressor>;
  160 | 
  161 |         let (binary_miniblock_compressed, binary_array_encoding) =
  162 |             binary_compressor.compress(context, data_block)?;
  163 | 
  164 |         Ok((
  165 |             binary_miniblock_compressed,
  166 |             ProtobufUtils21::fsst(binary_array_encoding, compressed.symbol_table),
  167 |         ))
  168 |     }
  169 | }
  170 | 
  171 | #[derive(Debug)]
  172 | pub struct FsstPerValueEncoder {
  173 |     inner: Box<dyn PerValueCompressor>,
  174 | }
  175 | 
  176 | impl FsstPerValueEncoder {
  177 |     pub fn new(inner: Box<dyn PerValueCompressor>) -> Self {
  178 |         Self { inner }
  179 |     }
  180 | }
  181 | 
  182 | impl PerValueCompressor for FsstPerValueEncoder {
  183 |     fn compress(&self, data: DataBlock) -> Result<(PerValueDataBlock, CompressiveEncoding)> {
  184 |         let compressed = FsstCompressed::fsst_compress(data)?;
  185 | 
  186 |         let data_block = DataBlock::VariableWidth(compressed.data);
  187 | 
  188 |         let (binary_compressed, binary_array_encoding) = self.inner.compress(data_block)?;
  189 | 
  190 |         Ok((
  191 |             binary_compressed,
  192 |             ProtobufUtils21::fsst(binary_array_encoding, compressed.symbol_table),
  193 |         ))
  194 |     }
  195 | }
  196 | 
  197 | #[derive(Debug)]
  198 | pub struct FsstPerValueDecompressor {
  199 |     symbol_table: LanceBuffer,
  200 |     inner_decompressor: Box<dyn VariablePerValueDecompressor>,
  201 | }
  202 | 
  203 | impl FsstPerValueDecompressor {
  204 |     pub fn new(
  205 |         symbol_table: LanceBuffer,
  206 |         inner_decompressor: Box<dyn VariablePerValueDecompressor>,
  207 |     ) -> Self {
  208 |         Self {
  209 |             symbol_table,
  210 |             inner_decompressor,
  211 |         }
  212 |     }
  213 | }
  214 | 
  215 | impl VariablePerValueDecompressor for FsstPerValueDecompressor {
  216 |     fn decompress(&self, data: VariableWidthBlock) -> Result<DataBlock> {
  217 |         // Step 1. Run inner decompressor
  218 |         let compressed_variable_data = self
  219 |             .inner_decompressor
  220 |             .decompress(data)?
  221 |             .as_variable_width()
  222 |             .unwrap();
  223 | 
  224 |         // Step 2. FSST decompress
  225 |         let bytes = compressed_variable_data.data.borrow_to_typed_slice::<u8>();
  226 |         let bytes = bytes.as_ref();
  227 | 
  228 |         match compressed_variable_data.bits_per_offset {
  229 |             32 => {
  230 |                 let offsets = compressed_variable_data
  231 |                     .offsets
  232 |                     .borrow_to_typed_slice::<i32>();
  233 |                 let offsets = offsets.as_ref();
  234 |                 let num_values = compressed_variable_data.num_values;
  235 | 
  236 |                 // The data will expand at most 8 times
  237 |                 // The offsets will be the same size because we have the same # of strings
  238 |                 let mut decompress_bytes_buf = vec![0u8; bytes.len() * 8];
  239 |                 let mut decompress_offset_buf = vec![0i32; offsets.len()];
  240 |                 fsst::fsst::decompress(
  241 |                     &self.symbol_table,
  242 |                     bytes,
  243 |                     offsets,
  244 |                     &mut decompress_bytes_buf,
  245 |                     &mut decompress_offset_buf,
  246 |                 )
  247 |                 .map_err(map_fsst_error)?;
  248 | 
  249 |                 // Ensure the offsets array is trimmed to exactly num_values + 1 elements
  250 |                 decompress_offset_buf.truncate((num_values + 1) as usize);
  251 | 
  252 |                 Ok(DataBlock::VariableWidth(VariableWidthBlock {
  253 |                     data: LanceBuffer::from(decompress_bytes_buf),
  254 |                     offsets: LanceBuffer::reinterpret_vec(decompress_offset_buf),
  255 |                     bits_per_offset: 32,
  256 |                     num_values,
  257 |                     block_info: BlockInfo::new(),
  258 |                 }))
  259 |             }
  260 |             64 => {
  261 |                 let offsets = compressed_variable_data
  262 |                     .offsets
  263 |                     .borrow_to_typed_slice::<i64>();
  264 |                 let offsets = offsets.as_ref();
  265 |                 let num_values = compressed_variable_data.num_values;
  266 | 
  267 |                 // The data will expand at most 8 times
  268 |                 // The offsets will be the same size because we have the same # of strings
  269 |                 let mut decompress_bytes_buf = vec![0u8; bytes.len() * 8];
  270 |                 let mut decompress_offset_buf = vec![0i64; offsets.len()];
  271 |                 fsst::fsst::decompress(
  272 |                     &self.symbol_table,
  273 |                     bytes,
  274 |                     offsets,
  275 |                     &mut decompress_bytes_buf,
  276 |                     &mut decompress_offset_buf,
  277 |                 )
  278 |                 .map_err(map_fsst_error)?;
  279 | 
  280 |                 // Ensure the offsets array is trimmed to exactly num_values + 1 elements
  281 |                 decompress_offset_buf.truncate((num_values + 1) as usize);
  282 | 
  283 |                 Ok(DataBlock::VariableWidth(VariableWidthBlock {
  284 |                     data: LanceBuffer::from(decompress_bytes_buf),
  285 |                     offsets: LanceBuffer::reinterpret_vec(decompress_offset_buf),
  286 |                     bits_per_offset: 64,
  287 |                     num_values,
  288 |                     block_info: BlockInfo::new(),
  289 |                 }))
  290 |             }
  291 |             _ => panic!(
  292 |                 "Unsupported offset type {}",
  293 |                 compressed_variable_data.bits_per_offset,
  294 |             ),
  295 |         }
  296 |     }
  297 | }
  298 | 
  299 | #[derive(Debug)]
  300 | pub struct FsstMiniBlockDecompressor {
  301 |     symbol_table: LanceBuffer,
  302 |     inner_decompressor: Box<dyn MiniBlockDecompressor>,
  303 | }
  304 | 
  305 | impl FsstMiniBlockDecompressor {
  306 |     pub fn new(
  307 |         description: &pb21::Fsst,
  308 |         inner_decompressor: Box<dyn MiniBlockDecompressor>,
  309 |     ) -> Self {
  310 |         Self {
  311 |             symbol_table: LanceBuffer::from_bytes(description.symbol_table.clone(), 1),
  312 |             inner_decompressor,
  313 |         }
  314 |     }
  315 | }
  316 | 
  317 | impl MiniBlockDecompressor for FsstMiniBlockDecompressor {
  318 |     fn decompress(&self, data: Vec<LanceBuffer>, num_values: u64) -> Result<DataBlock> {
  319 |         // Step 1. decompress data use `BinaryMiniBlockDecompressor`
  320 |         // Extract the bits_per_offset from the binary encoding
  321 |         let compressed_data_block = self.inner_decompressor.decompress(data, num_values)?;
  322 |         let DataBlock::VariableWidth(compressed_data_block) = compressed_data_block else {
  323 |             panic!("BinaryMiniBlockDecompressor should output VariableWidth DataBlock")
  324 |         };
  325 | 
  326 |         // Step 2. FSST decompress
  327 |         let bytes = &compressed_data_block.data;
  328 |         let (decompress_bytes_buf, decompress_offset_buf) =
  329 |             if compressed_data_block.bits_per_offset == 64 {
  330 |                 let offsets = compressed_data_block.offsets.borrow_to_typed_slice::<i64>();
  331 |                 let offsets = offsets.as_ref();
  332 | 
  333 |                 // The data will expand at most 8 times
  334 |                 // The offsets will be the same size because we have the same # of strings
  335 |                 let mut decompress_bytes_buf = vec![0u8; bytes.len() * 8];
  336 |                 let mut decompress_offset_buf = vec![0i64; offsets.len()];
  337 |                 fsst::fsst::decompress(
  338 |                     &self.symbol_table,
  339 |                     bytes.as_ref(),
  340 |                     offsets,
  341 |                     &mut decompress_bytes_buf,
  342 |                     &mut decompress_offset_buf,
  343 |                 )
  344 |                 .map_err(map_fsst_error)?;
  345 | 
  346 |                 // Ensure the offsets array is trimmed to exactly num_values + 1 elements
  347 |                 decompress_offset_buf.truncate((num_values + 1) as usize);
  348 | 
  349 |                 (
  350 |                     decompress_bytes_buf,
  351 |                     LanceBuffer::reinterpret_vec(decompress_offset_buf),
  352 |                 )
  353 |             } else {
  354 |                 let offsets = compressed_data_block.offsets.borrow_to_typed_slice::<i32>();
  355 |                 let offsets = offsets.as_ref();
  356 | 
  357 |                 // The data will expand at most 8 times
  358 |                 // The offsets will be the same size because we have the same # of strings
  359 |                 let mut decompress_bytes_buf = vec![0u8; bytes.len() * 8];
  360 |                 let mut decompress_offset_buf = vec![0i32; offsets.len()];
  361 |                 fsst::fsst::decompress(
  362 |                     &self.symbol_table,
  363 |                     bytes.as_ref(),
  364 |                     offsets,
  365 |                     &mut decompress_bytes_buf,
  366 |                     &mut decompress_offset_buf,
  367 |                 )
  368 |                 .map_err(map_fsst_error)?;
  369 | 
  370 |                 // Ensure the offsets array is trimmed to exactly num_values + 1 elements
  371 |                 decompress_offset_buf.truncate((num_values + 1) as usize);
  372 | 
  373 |                 (
  374 |                     decompress_bytes_buf,
  375 |                     LanceBuffer::reinterpret_vec(decompress_offset_buf),
  376 |                 )
  377 |             };
  378 | 
  379 |         Ok(DataBlock::VariableWidth(VariableWidthBlock {
  380 |             data: LanceBuffer::from(decompress_bytes_buf),
  381 |             offsets: decompress_offset_buf,
  382 |             bits_per_offset: compressed_data_block.bits_per_offset,
  383 |             num_values,
  384 |             block_info: BlockInfo::new(),
  385 |         }))
  386 |     }
  387 | }
  388 | 
  389 | #[cfg(test)]
  390 | mod tests {
  391 |     use std::collections::HashMap;
  392 | 
  393 |     use arrow_array::StringArray;
  394 |     use fsst::fsst::{FSST_SYMBOL_TABLE_SIZE, compress, decompress};
  395 |     use lance_core::Error;
  396 |     use lance_datagen::{ByteCount, RowCount};
  397 | 
  398 |     use super::map_fsst_error;
  399 |     use crate::testing::{TestCases, TestEncoding, check_round_trip_encoding_of_data};
  400 | 
  401 |     #[rstest::rstest]
  402 |     #[test_log::test(tokio::test)]
  403 |     async fn test_fsst(
  404 |         #[values(false, true)] explicit: bool,
  405 |         #[values(
  406 |             TestEncoding::StructuralU16,
  407 |             TestEncoding::StructuralU32,
  408 |             TestEncoding::StructuralSparse
  409 |         )]
  410 |         encoding: TestEncoding,
  411 |     ) {
  412 |         let test_cases = TestCases::default()
  413 |             .with_expected_encoding("fsst")
  414 |             .with_encoding(encoding);
  415 | 
  416 |         // Generate data suitable for FSST (large strings, total size > 32KB)
  417 |         let arr = lance_datagen::gen_batch()
  418 |             .anon_col(lance_datagen::array::rand_utf8(ByteCount::from(100), false))
  419 |             .into_batch_rows(RowCount::from(5000))
  420 |             .unwrap()
  421 |             .column(0)
  422 |             .clone();
  423 | 
  424 |         let metadata = if explicit {
  425 |             HashMap::from([("lance-encoding:compression".to_string(), "fsst".to_string())])
  426 |         } else {
  427 |             // Automatic selection requires max_len >= 5 and total_size >= 32KB.
  428 |             HashMap::new()
  429 |         };
  430 |         check_round_trip_encoding_of_data(vec![arr], &test_cases, metadata).await;
  431 |     }
  432 | 
  433 |     #[test]
  434 |     fn test_corrupt_fsst_symbol_table_is_corrupt_file() {
  435 |         let input = "the rain in spain stays mainly in the plain ".repeat(2048);
  436 |         let array = StringArray::from(vec![input.as_str()]);
  437 |         let mut symbol_table = [0u8; FSST_SYMBOL_TABLE_SIZE];
  438 |         let mut compressed = vec![0u8; array.value_data().len().max(1)];
  439 |         let mut compressed_offsets = vec![0i32; array.value_offsets().len()];
  440 |         compress(
  441 |             symbol_table.as_mut(),
  442 |             array.value_data(),
  443 |             array.value_offsets(),
  444 |             &mut compressed,
  445 |             &mut compressed_offsets,
  446 |         )
  447 |         .unwrap();
  448 | 
  449 |         let st_info = u64::from_ne_bytes(symbol_table[..8].try_into().unwrap());
  450 |         assert!(st_info & (1 << 24) != 0, "expected decoder_switch_on input");
  451 |         let n_symbols = (st_info & 255) as usize;
  452 |         assert!(n_symbols > 0);
  453 |         symbol_table[8 + n_symbols * 8] = 9;
  454 | 
  455 |         let mut out = vec![0u8; compressed.len() * 8];
  456 |         let mut out_offsets = vec![0i32; compressed_offsets.len()];
  457 |         let err = decompress(
  458 |             &symbol_table,
  459 |             &compressed,
  460 |             &compressed_offsets,
  461 |             &mut out,
  462 |             &mut out_offsets,
  463 |         )
  464 |         .map_err(map_fsst_error)
  465 |         .unwrap_err();
  466 |         assert!(matches!(err, Error::CorruptFile { .. }), "{err}");
  467 |         assert!(err.to_string().contains("symbol length"), "{err}");
  468 |     }
  469 | }
``````
