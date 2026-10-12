> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/encodings/physical/constant.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `fd1a2d255fc60c5d5d823f2ffe9cba7aa87e970188874093c7a40a77864321eb`. Reviewed physical lines: 1-81.

[Module](../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Metadata-only constant/all-null decompressor with distinct whole-block and fixed-per-value input contracts. (rust/lance-encoding/src/encodings/physical/constant.rs:1-81)

## Complete range analysis

### Lines 1-13

SPDX and imports of LanceBuffer, BlockDecompressor, FixedPerValueDecompressor, no-payload guard and compact DataBlock variants. No IO or feature/version dispatch. (rust/lance-encoding/src/encodings/physical/constant.rs:1-13)

### Lines 14-25

Public Debug ConstantDecompressor holds private scalar:Option<LanceBuffer>. Public new stores it without type/width validation; None and Some(empty) are distinct. (rust/lance-encoding/src/encodings/physical/constant.rs:14-25)

### Lines 26-43

BlockDecompressor::decompress first requires data=None; even Some(empty) is InvalidInput Constant expects no payload. Some scalar becomes Constant with a cheap buffer clone and supplied num_values; None becomes AllNull. No repeated-value materialization, count validation or payload reading. requires_payload=false; inherited infer_num_values returns Ok(None), so count must come from enclosing context. (rust/lance-encoding/src/compression.rs:934-960) (rust/lance-encoding/src/encodings/physical/constant.rs:26-43)

### Lines 44-63

FixedPerValueDecompressor::decompress ignores its owned FixedWidthDataBlock entirely, returning the same compact variant using separate num_values. Unlike whole-block mode, it does not reject payload. bits_per_value returns scalar.len asu64*8 or0; Some(empty) and None share width0 but produce different block variants. decoded_size_bytes uses inherited None. No local checked arithmetic or expansion limit. (rust/lance-encoding/src/compression.rs:910-927) (rust/lance-encoding/src/encodings/physical/constant.rs:44-63)

### Lines 64-81

One local test uses scalarNone, asserts requires_payload=false, None input gives AllNull count3, and Some(empty) errors. It does not assert exact error text/variant, scalarSome, fixed-per-value behavior or zero count. Read not executed. (rust/lance-encoding/src/encodings/physical/constant.rs:64-81)

## Interaction and interpretation limits

Every physical line was read during ANALYZE73 in bounded outputs. Offline read-only source inspection only: no repository build, test, lint, benchmark, generator or dependency installation. Exact declarations and source are retained below. Contextual caller snippets do not claim whole-file coverage; lexical references do not establish a resolved call graph.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Routines for compressing and decompressing constant-encoded data
    5 | 
    6 | use crate::{
    7 |     buffer::LanceBuffer,
    8 |     compression::{BlockDecompressor, FixedPerValueDecompressor, require_no_block_payload},
    9 |     data::{AllNullDataBlock, ConstantDataBlock, DataBlock, FixedWidthDataBlock},
   10 | };
   11 | 
   12 | use lance_core::Result;
   13 | 
   14 | /// A decompressor for constant-encoded data
   15 | #[derive(Debug)]
   16 | pub struct ConstantDecompressor {
   17 |     scalar: Option<LanceBuffer>,
   18 | }
   19 | 
   20 | impl ConstantDecompressor {
   21 |     pub fn new(scalar: Option<LanceBuffer>) -> Self {
   22 |         Self { scalar }
   23 |     }
   24 | }
   25 | 
   26 | impl BlockDecompressor for ConstantDecompressor {
   27 |     fn decompress(&self, data: Option<LanceBuffer>, num_values: u64) -> Result<DataBlock> {
   28 |         require_no_block_payload(data, "Constant")?;
   29 |         if let Some(scalar) = self.scalar.clone() {
   30 |             Ok(DataBlock::Constant(ConstantDataBlock {
   31 |                 data: scalar,
   32 |                 num_values,
   33 |             }))
   34 |         } else {
   35 |             Ok(DataBlock::AllNull(AllNullDataBlock { num_values }))
   36 |         }
   37 |     }
   38 | 
   39 |     fn requires_payload(&self) -> bool {
   40 |         false
   41 |     }
   42 | }
   43 | 
   44 | impl FixedPerValueDecompressor for ConstantDecompressor {
   45 |     fn decompress(&self, _data: FixedWidthDataBlock, num_values: u64) -> Result<DataBlock> {
   46 |         if let Some(scalar) = self.scalar.clone() {
   47 |             Ok(DataBlock::Constant(ConstantDataBlock {
   48 |                 data: scalar,
   49 |                 num_values,
   50 |             }))
   51 |         } else {
   52 |             Ok(DataBlock::AllNull(AllNullDataBlock { num_values }))
   53 |         }
   54 |     }
   55 | 
   56 |     fn bits_per_value(&self) -> u64 {
   57 |         self.scalar
   58 |             .as_ref()
   59 |             .map(|s| s.len() as u64 * 8)
   60 |             .unwrap_or(0)
   61 |     }
   62 | }
   63 | 
   64 | #[cfg(test)]
   65 | mod tests {
   66 |     use super::*;
   67 | 
   68 |     #[test]
   69 |     fn block_constant_requires_no_payload() {
   70 |         let decompressor = ConstantDecompressor::new(None);
   71 | 
   72 |         assert!(!decompressor.requires_payload());
   73 |         assert!(matches!(
   74 |             BlockDecompressor::decompress(&decompressor, None, 3).unwrap(),
   75 |             DataBlock::AllNull(AllNullDataBlock { num_values: 3 })
   76 |         ));
   77 |         assert!(
   78 |             BlockDecompressor::decompress(&decompressor, Some(LanceBuffer::empty()), 3).is_err()
   79 |         );
   80 |     }
   81 | }
``````
