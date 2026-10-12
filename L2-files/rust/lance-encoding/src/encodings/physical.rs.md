> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/encodings/physical.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `91dfead66e686a24ab9d715575e6cd563e8a96597ffa669edd875f389cb48571`. Reviewed physical lines: 1-14.

[Module](../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public physical codec module declarations and optional bitpacking module. (rust/lance-encoding/src/encodings/physical.rs:1-14)

## Complete range analysis

### Lines 1-4

SPDX and public binary module. (rust/lance-encoding/src/encodings/physical.rs:1-4)

### Lines 5-6

Public bitpacking module is compiled only with feature bitpacking. (rust/lance-encoding/src/encodings/physical.rs:5-6)

### Lines 7-14

Public block,byte_stream_split,constant,fsst,general,packed,rle,value modules. This facade does not imply all codecs accept all formats/data types; block internally gates zstd/lz4 implementations. (rust/lance-encoding/src/encodings/physical.rs:7-14)

## Interaction and interpretation limits

All physical lines were read in bounded source outputs during ANALYZE72. Offline, read-only inspection; no Lance build, test, lint, benchmark, generator or dependency installation ran. Exact declarations are preserved below and in the symbol index. Other files are only covered at cited contextual ranges; no whole-crate completion or runtime validation is implied.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | pub mod binary;
    5 | #[cfg(feature = "bitpacking")]
    6 | pub mod bitpacking;
    7 | pub mod block;
    8 | pub mod byte_stream_split;
    9 | pub mod constant;
   10 | pub mod fsst;
   11 | pub mod general;
   12 | pub mod packed;
   13 | pub mod rle;
   14 | pub mod value;
``````
