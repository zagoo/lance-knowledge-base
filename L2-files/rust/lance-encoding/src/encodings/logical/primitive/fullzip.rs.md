> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/encodings/logical/primitive/fullzip.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `53d79c93c84a6dba3e8ec8ec77f2092c9b9083de9f010fe4876074286de45058`. Reviewed physical lines: 1-54.

[Module](../../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../../README.md)

## Role and visibility

Full-zip value-compression extension trait and fixed/variable owned result union; no concrete compression or file-version dispatch. (rust/lance-encoding/src/encodings/logical/primitive/fullzip.rs:1-54)

## Complete range analysis

### Lines 1-19

SPDX and docs describe full-zip values laid out contiguously for value-level random access, suitable for larger values. The statement about two structural encodings refers to Lance2.1, not all later versions. Imports result/data/protobuf types; no IO. (rust/lance-encoding/src/encodings/logical/primitive/fullzip.rs:1-19)

### Lines 20-40

Public Debug PerValueDataBlock enum has Fixed(FixedWidthDataBlock) and Variable(VariableWidthBlock), no extra metadata variant (TODO only). data_size dispatches to inner methods: fixed counts data bytes; variable counts data plus offsets with unchecked usize addition then u64 cast. These are in-memory buffer sizes, not full on-disk page sizes. (rust/lance-encoding/src/data.rs:210-217; rust/lance-encoding/src/data.rs:970-975) (rust/lance-encoding/src/encodings/logical/primitive/fullzip.rs:20-40)

### Lines 41-54

Public PerValueCompressor:Debug+Send+Sync exposes compress(&self,data:DataBlock)->Result<(PerValueDataBlock,CompressiveEncoding)>. Owned data in and descriptor plus owned output out; individual values must be independently decodable without previous values according to trait contract. No implementation here enforces that promise or output/metadata consistency. Method prose says single buffer although Variable also contains offsets. No local unsafe, tests or numeric version gate. (rust/lance-encoding/src/encodings/logical/primitive/fullzip.rs:41-54)

## Interaction and interpretation limits

Every physical line was read during ANALYZE73 in bounded outputs. Offline read-only source inspection only: no repository build, test, lint, benchmark, generator or dependency installation. Exact declarations and source are retained below. Contextual caller snippets do not claim whole-file coverage; lexical references do not establish a resolved call graph.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Routines for encoding and decoding full-zip data
    5 | //!
    6 | //! Full-zip is one of the two structural encodings in Lance 2.1.
    7 | //! In this approach the various compressed buffers are zipped
    8 | //! together so that all parts of a value are stored contiguously in memory.
    9 | //!
   10 | //! This requires transparent compression and is most suitable for
   11 | //! large data types.
   12 | 
   13 | use crate::{
   14 |     data::{DataBlock, FixedWidthDataBlock, VariableWidthBlock},
   15 |     format::pb21::CompressiveEncoding,
   16 | };
   17 | 
   18 | use lance_core::Result;
   19 | 
   20 | /// Per-value compression must either:
   21 | ///
   22 | /// A single buffer of fixed-width values
   23 | /// A single buffer of value data and a buffer of offsets
   24 | ///
   25 | /// TODO: In the future we may allow metadata buffers
   26 | #[derive(Debug)]
   27 | pub enum PerValueDataBlock {
   28 |     Fixed(FixedWidthDataBlock),
   29 |     Variable(VariableWidthBlock),
   30 | }
   31 | 
   32 | impl PerValueDataBlock {
   33 |     pub fn data_size(&self) -> u64 {
   34 |         match self {
   35 |             Self::Fixed(fixed) => fixed.data_size(),
   36 |             Self::Variable(variable) => variable.data_size(),
   37 |         }
   38 |     }
   39 | }
   40 | 
   41 | /// Trait for compression algorithms that are suitable for use in the zipped structural encoding
   42 | ///
   43 | /// This compression must return either a FixedWidthDataBlock or a VariableWidthBlock.  This is because
   44 | /// we need to zip the data and those are the only two blocks we know how to zip today.
   45 | ///
   46 | /// In addition, the compressed data must be able to be decompressed in a random-access fashion.
   47 | /// This means that the decompression algorithm must be able to decompress any value without
   48 | /// decompressing all values before it.
   49 | pub trait PerValueCompressor: std::fmt::Debug + Send + Sync {
   50 |     /// Compress the data into a single buffer
   51 |     ///
   52 |     /// Also returns a description of the compression that can be used to decompress when reading the data back
   53 |     fn compress(&self, data: DataBlock) -> Result<(PerValueDataBlock, CompressiveEncoding)>;
   54 | }
``````
