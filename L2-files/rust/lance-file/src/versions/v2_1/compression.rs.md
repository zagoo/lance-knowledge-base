> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md).

# rust/lance-file/src/versions/v2_1/compression.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `e4fa0dd0b31a19b471acea440bee410b9a8667a1be30ca81b16e93a6ceb8e6ec`. Reviewed physical lines: 1-129.

[Module](../../../../../../L1-modules/rust-lance-file-composition.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Private version-specific compression Strategy, exposed only to its parent module and implementing CompressionStrategy; policy ordering for V2_1. (rust/lance-file/src/versions/v2_1/compression.rs:1-129)

## Complete range analysis

### Lines 1-18

SPDX/imports wire core error/Field, compression helpers, CompressionParams/FieldParams, DataBlock and three compressor traits. No general block/RLE block or packed-struct per-value creation helper is imported; packed per-value uses a rejecting helper. (rust/lance-file/src/versions/v2_1/compression.rs:1-18)

### Lines 19-28

pub(super) Debug+Clone Strategy owns CompressionParams privately; parent-visible new stores it unchanged, performs no validation and returns Self. Cloning Strategy clones tuning maps/values, not just an Arc handle. (rust/lance-file/src/versions/v2_1/compression.rs:19-28)

### Lines 29-47

field_params starts with self.params.get_field_params(field.name, field.data_type()), then merges parsed field metadata. Contextual implementation gives type params first, exact column params or first HashMap-iteration matching pattern next; each non-None field metadata value overrides that effective value (rust/lance-encoding/src/compression_config.rs:85-113; rust/lance-encoding/src/compression_config.rs:122-140). It uses local field name, not a constructed nested path. Pattern collision order is not made deterministic here. Metadata parsing/codec validity is delegated. V2_1 additionally examines only parsed metadata.minichunk_size: >=32*1024 (32768) logs value and clears that metadata override. The guarded unwrap is protected by is_some_and. Negative/zero/smaller metadata values and an oversized value already in CompressionParams are not rejected here. Clearing override preserves any configured base value, so log wording using default need not mean library default. No once-only log gate. (rust/lance-file/src/versions/v2_1/compression.rs:29-47)

### Lines 48-84

Compute effective field params once. Ordered first-match miniblock choice is explicit uncompressed fixed width, byte-stream split, RLE candidate, bitpacking, raw fixed width, variable width (fallible), fixed packed struct (fallible), raw fixed-size-list. Every None falls through; a helper Err stops selection. If no candidate returns a compressor, NotSupported names data.name(). Successful choice always passes finalize_miniblock_compressor(data, compressor, params), which may itself fail; this is selection, not execution of compression. The RLE slot specifically calls try_fixed_u8_rle_miniblock; fixed-u8 grammar is the selected helper, not a general child RLE grammar. (rust/lance-file/src/versions/v2_1/compression.rs:48-84)

### Lines 85-108

create_per_value computes field params, tries raw per-value first, then fallible reject_packed_struct_per_value, then fallible variable-width per-value. A returned Some is accepted even for the helper named reject; exact helper behavior is delegated. Remaining types return NotSupported with block name. No finalize_miniblock step runs for per-value selection. (rust/lance-file/src/versions/v2_1/compression.rs:85-108)

### Lines 109-129

create_block_compressor computes field params into unused _params (metadata parsing and warnings can still occur), then tries bitpacking followed by raw block. Neither call receives params. Unsupported block names produce NotSupported. No general or RLE block helper is invoked. No inline tests, async functions or unsafe code. (rust/lance-file/src/versions/v2_1/compression.rs:109-129)

## Interaction and interpretation limits

Every physical line was read in ANALYZE53. No source execution/build/test was performed. Exact current-version reader/writer bodies are analyzed; delegated compression/encoder helper internals remain pending; delegated calls are not evidence of their full behavior. 

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use lance_core::{Error, Result, datatypes::Field};
    5 | use lance_encoding::{
    6 |     compression::{
    7 |         BlockCompressor, CompressionStrategy, field_metadata_params, finalize_miniblock_compressor,
    8 |         reject_packed_struct_per_value, try_bitpacking_block, try_bitpacking_miniblock,
    9 |         try_byte_stream_split_miniblock, try_fixed_packed_struct_miniblock,
   10 |         try_fixed_u8_rle_miniblock, try_raw_block, try_raw_fixed_size_list_miniblock,
   11 |         try_raw_fixed_width_miniblock, try_raw_per_value, try_uncompressed_fixed_width_miniblock,
   12 |         try_variable_width_miniblock, try_variable_width_per_value,
   13 |     },
   14 |     compression_config::{CompressionFieldParams, CompressionParams},
   15 |     data::DataBlock,
   16 |     encodings::logical::primitive::{fullzip::PerValueCompressor, miniblock::MiniBlockCompressor},
   17 | };
   18 | 
   19 | #[derive(Debug, Clone)]
   20 | pub(super) struct Strategy {
   21 |     params: CompressionParams,
   22 | }
   23 | 
   24 | impl Strategy {
   25 |     pub(super) fn new(params: CompressionParams) -> Self {
   26 |         Self { params }
   27 |     }
   28 | 
   29 |     fn field_params(&self, field: &Field) -> CompressionFieldParams {
   30 |         let mut params = self
   31 |             .params
   32 |             .get_field_params(&field.name, &field.data_type());
   33 |         let mut metadata = field_metadata_params(field);
   34 |         if metadata
   35 |             .minichunk_size
   36 |             .is_some_and(|size| size >= 32 * 1024)
   37 |         {
   38 |             log::warn!(
   39 |                 "minichunk_size '{}' is too large for the selected u16 miniblock layout, using default",
   40 |                 metadata.minichunk_size.unwrap()
   41 |             );
   42 |             metadata.minichunk_size = None;
   43 |         }
   44 |         params.merge(&metadata);
   45 |         params
   46 |     }
   47 | }
   48 | 
   49 | impl CompressionStrategy for Strategy {
   50 |     fn create_miniblock_compressor(
   51 |         &self,
   52 |         field: &Field,
   53 |         data: &DataBlock,
   54 |     ) -> Result<Box<dyn MiniBlockCompressor>> {
   55 |         let params = self.field_params(field);
   56 |         let compressor =
   57 |             if let Some(compressor) = try_uncompressed_fixed_width_miniblock(data, &params) {
   58 |                 compressor
   59 |             } else if let Some(compressor) = try_byte_stream_split_miniblock(data, &params) {
   60 |                 compressor
   61 |             } else if let Some(compressor) = try_fixed_u8_rle_miniblock(data, &params) {
   62 |                 compressor
   63 |             } else if let Some(compressor) = try_bitpacking_miniblock(data) {
   64 |                 compressor
   65 |             } else if let Some(compressor) = try_raw_fixed_width_miniblock(data) {
   66 |                 compressor
   67 |             } else if let Some(compressor) = try_variable_width_miniblock(field, data, &params)? {
   68 |                 compressor
   69 |             } else if let Some(compressor) = try_fixed_packed_struct_miniblock(data)? {
   70 |                 compressor
   71 |             } else if let Some(compressor) = try_raw_fixed_size_list_miniblock(data) {
   72 |                 compressor
   73 |             } else {
   74 |                 return Err(Error::not_supported_source(
   75 |                     format!(
   76 |                         "Mini-block compression not yet supported for block type {}",
   77 |                         data.name()
   78 |                     )
   79 |                     .into(),
   80 |                 ));
   81 |             };
   82 |         finalize_miniblock_compressor(data, compressor, &params)
   83 |     }
   84 | 
   85 |     fn create_per_value(
   86 |         &self,
   87 |         field: &Field,
   88 |         data: &DataBlock,
   89 |     ) -> Result<Box<dyn PerValueCompressor>> {
   90 |         let params = self.field_params(field);
   91 |         if let Some(compressor) = try_raw_per_value(data) {
   92 |             return Ok(compressor);
   93 |         }
   94 |         if let Some(compressor) = reject_packed_struct_per_value(field, data)? {
   95 |             return Ok(compressor);
   96 |         }
   97 |         if let Some(compressor) = try_variable_width_per_value(field, data, &params)? {
   98 |             return Ok(compressor);
   99 |         }
  100 |         Err(Error::not_supported_source(
  101 |             format!(
  102 |                 "Per-value compression not yet supported for block type {}",
  103 |                 data.name()
  104 |             )
  105 |             .into(),
  106 |         ))
  107 |     }
  108 | 
  109 |     fn create_block_compressor(
  110 |         &self,
  111 |         field: &Field,
  112 |         data: &DataBlock,
  113 |     ) -> Result<Box<dyn BlockCompressor>> {
  114 |         let _params = self.field_params(field);
  115 |         if let Some(compressor) = try_bitpacking_block(data) {
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
