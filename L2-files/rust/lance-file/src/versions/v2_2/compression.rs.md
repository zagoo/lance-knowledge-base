> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-file/src/versions/v2_2/compression.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `f0be88a42d3a295c863e20f54d43d6552f34a5fa77bc5ec11f6d5efa9c301ac2`. Reviewed physical lines: 1-129.

[Module](../../../../../../L1-modules/rust-lance-file-composition.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Parent-visible V2_2 Strategy with tuning ownership, variable packed-struct per-value handling and richer whole-block selection. (rust/lance-file/src/versions/v2_2/compression.rs:1-129)

## Complete range analysis

### Lines 1-21

SPDX/imports include Arc, shared compressor traits, fixed-u8 RLE miniblock/block helpers, general block and variable packed-struct per-value. They are mechanism functions in lance-encoding; this module owns order/version choice. (rust/lance-file/src/versions/v2_2/compression.rs:1-21)

### Lines 22-31

Debug+Clone parent-visible Strategy stores private CompressionParams; new stores unchanged without validation. Clone duplicates tuning content; Arc wrapping happens at use sites. (rust/lance-file/src/versions/v2_2/compression.rs:22-31)

### Lines 32-40

field_params starts with self.params.get_field_params(field.name, field.data_type()), then merges parsed field metadata. Contextual implementation gives type params first, exact column params or first HashMap-iteration matching pattern next; each non-None field metadata value overrides that effective value (rust/lance-encoding/src/compression_config.rs:85-113; rust/lance-encoding/src/compression_config.rs:122-140). It uses local field name, not a constructed nested path. Pattern collision order is not made deterministic here. Metadata parsing/codec validity is delegated. No V2_1 32768 metadata minichunk guard is present; actual supported size and codec validation belongs to downstream helpers. (rust/lance-file/src/versions/v2_2/compression.rs:32-40)

### Lines 41-76

Compute effective field params once. Ordered first-match miniblock choice is explicit uncompressed fixed width, byte-stream split, RLE candidate, bitpacking, raw fixed width, variable width (fallible), fixed packed struct (fallible), raw fixed-size-list. Every None falls through; a helper Err stops selection. If no candidate returns a compressor, NotSupported names data.name(). Successful choice always passes finalize_miniblock_compressor(data, compressor, params), which may itself fail; this is selection, not execution of compression. RLE slot is try_fixed_u8_rle_miniblock. Contextual finalizer only wraps FixedWidth data with requested general compression, returning other compressors unchanged (rust/lance-encoding/src/compression.rs:587-598). (rust/lance-file/src/versions/v2_2/compression.rs:41-76)

### Lines 77-102

create_per_value computes params, tries raw then fallible try_variable_packed_struct_per_value(Arc::new(self.clone()),field,data), then variable-width helper with effective params. The new Arc/Strategy clone is evaluated whenever raw declines, even if packed helper declines. This allows nested compressor policy ownership; shared self is not mutated. First Some succeeds, first Err propagates; otherwise NotSupported names block. (rust/lance-file/src/versions/v2_2/compression.rs:77-102)

### Lines 103-129

create_block_compressor computes params; try fixed-u8 RLE block (fallible), bitpacking, general block (fallible), raw block, in order. Earlier match wins and errors do not fall back. Both RLE/general receive effective params; bitpacking/raw do not. Unsupported types return NotSupported with block name. No inline tests, async or unsafe code. (rust/lance-file/src/versions/v2_2/compression.rs:103-129)

## Interaction and interpretation limits

Every physical line was read in ANALYZE53. No source execution/build/test was performed. Exact current-version reader/writer bodies are analyzed; delegated compression/encoder helper internals remain pending; delegated calls are not evidence of their full behavior. 

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::sync::Arc;
    5 | 
    6 | use lance_core::{Error, Result, datatypes::Field};
    7 | use lance_encoding::{
    8 |     compression::{
    9 |         BlockCompressor, CompressionStrategy, field_metadata_params, finalize_miniblock_compressor,
   10 |         try_bitpacking_block, try_bitpacking_miniblock, try_byte_stream_split_miniblock,
   11 |         try_fixed_packed_struct_miniblock, try_fixed_u8_rle_block, try_fixed_u8_rle_miniblock,
   12 |         try_general_block, try_raw_block, try_raw_fixed_size_list_miniblock,
   13 |         try_raw_fixed_width_miniblock, try_raw_per_value, try_uncompressed_fixed_width_miniblock,
   14 |         try_variable_packed_struct_per_value, try_variable_width_miniblock,
   15 |         try_variable_width_per_value,
   16 |     },
   17 |     compression_config::{CompressionFieldParams, CompressionParams},
   18 |     data::DataBlock,
   19 |     encodings::logical::primitive::{fullzip::PerValueCompressor, miniblock::MiniBlockCompressor},
   20 | };
   21 | 
   22 | #[derive(Debug, Clone)]
   23 | pub(super) struct Strategy {
   24 |     params: CompressionParams,
   25 | }
   26 | 
   27 | impl Strategy {
   28 |     pub(super) fn new(params: CompressionParams) -> Self {
   29 |         Self { params }
   30 |     }
   31 | 
   32 |     fn field_params(&self, field: &Field) -> CompressionFieldParams {
   33 |         let mut params = self
   34 |             .params
   35 |             .get_field_params(&field.name, &field.data_type());
   36 |         params.merge(&field_metadata_params(field));
   37 |         params
   38 |     }
   39 | }
   40 | 
   41 | impl CompressionStrategy for Strategy {
   42 |     fn create_miniblock_compressor(
   43 |         &self,
   44 |         field: &Field,
   45 |         data: &DataBlock,
   46 |     ) -> Result<Box<dyn MiniBlockCompressor>> {
   47 |         let params = self.field_params(field);
   48 |         let compressor =
   49 |             if let Some(compressor) = try_uncompressed_fixed_width_miniblock(data, &params) {
   50 |                 compressor
   51 |             } else if let Some(compressor) = try_byte_stream_split_miniblock(data, &params) {
   52 |                 compressor
   53 |             } else if let Some(compressor) = try_fixed_u8_rle_miniblock(data, &params) {
   54 |                 compressor
   55 |             } else if let Some(compressor) = try_bitpacking_miniblock(data) {
   56 |                 compressor
   57 |             } else if let Some(compressor) = try_raw_fixed_width_miniblock(data) {
   58 |                 compressor
   59 |             } else if let Some(compressor) = try_variable_width_miniblock(field, data, &params)? {
   60 |                 compressor
   61 |             } else if let Some(compressor) = try_fixed_packed_struct_miniblock(data)? {
   62 |                 compressor
   63 |             } else if let Some(compressor) = try_raw_fixed_size_list_miniblock(data) {
   64 |                 compressor
   65 |             } else {
   66 |                 return Err(Error::not_supported_source(
   67 |                     format!(
   68 |                         "Mini-block compression not yet supported for block type {}",
   69 |                         data.name()
   70 |                     )
   71 |                     .into(),
   72 |                 ));
   73 |             };
   74 |         finalize_miniblock_compressor(data, compressor, &params)
   75 |     }
   76 | 
   77 |     fn create_per_value(
   78 |         &self,
   79 |         field: &Field,
   80 |         data: &DataBlock,
   81 |     ) -> Result<Box<dyn PerValueCompressor>> {
   82 |         let params = self.field_params(field);
   83 |         if let Some(compressor) = try_raw_per_value(data) {
   84 |             return Ok(compressor);
   85 |         }
   86 |         if let Some(compressor) =
   87 |             try_variable_packed_struct_per_value(Arc::new(self.clone()), field, data)?
   88 |         {
   89 |             return Ok(compressor);
   90 |         }
   91 |         if let Some(compressor) = try_variable_width_per_value(field, data, &params)? {
   92 |             return Ok(compressor);
   93 |         }
   94 |         Err(Error::not_supported_source(
   95 |             format!(
   96 |                 "Per-value compression not yet supported for block type {}",
   97 |                 data.name()
   98 |             )
   99 |             .into(),
  100 |         ))
  101 |     }
  102 | 
  103 |     fn create_block_compressor(
  104 |         &self,
  105 |         field: &Field,
  106 |         data: &DataBlock,
  107 |     ) -> Result<Box<dyn BlockCompressor>> {
  108 |         let params = self.field_params(field);
  109 |         if let Some(compressor) = try_fixed_u8_rle_block(data, &params)? {
  110 |             return Ok(compressor);
  111 |         }
  112 |         if let Some(compressor) = try_bitpacking_block(data) {
  113 |             return Ok(compressor);
  114 |         }
  115 |         if let Some(compressor) = try_general_block(data, &params)? {
  116 |             return Ok(compressor);
  117 |         }
  118 |         if let Some(compressor) = try_raw_block(data) {
  119 |             return Ok(compressor);
  120 |         }
  121 |         Err(Error::not_supported_source(
  122 |             format!(
  123 |                 "Block compression not yet supported for block type {}",
  124 |                 data.name()
  125 |             )
  126 |             .into(),
  127 |         ))
  128 |     }
  129 | }
``````
