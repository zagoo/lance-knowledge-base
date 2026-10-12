> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/constants.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `5ff5650e00cd799f800cee7db42510997bbb11e0b1442c829010b77798b5e420`. Reviewed physical lines: 1-65.

[Module](../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public string constants for field metadata and environment variable names. Declarations document policy inputs; this file performs no parsing, validation or environment access. (rust/lance-encoding/src/constants.rs:1-65)

## Complete range analysis

### Lines 1-8

SPDX and module documentation identify Arrow field metadata keys. There are no imports, functions, mutable state or local tests. (rust/lance-encoding/src/constants.rs:1-8)

### Lines 9-17

Public &str constants: COMPRESSION_META_KEY=lance-encoding:compression, COMPRESSION_LEVEL_META_KEY=lance-encoding:compression-level, RLE_THRESHOLD_META_KEY=lance-encoding:rle-threshold, MINICHUNK_SIZE_META_KEY=lance-encoding:minichunk-size. Their literal spellings are interoperability inputs, not algorithms or default values. (rust/lance-encoding/src/constants.rs:9-17)

### Lines 18-28

DICT_DIVISOR_META_KEY=lance-encoding:dict-divisor: comment says larger divisor discourages dictionary selection. DICT_SIZE_RATIO_META_KEY=lance-encoding:dict-size-ratio: documented interval (0.0,1.0], strict estimated/raw comparison and default0.8. These comments do not establish enforcement at the declaration site; selection consumers still require full analysis. (rust/lance-encoding/src/constants.rs:18-28)

### Lines 29-41

DICT_VALUES_COMPRESSION_META_KEY=lance-encoding:dict-values-compression, documented lz4/zstd/none, and DICT_VALUES_COMPRESSION_LEVEL_META_KEY=lance-encoding:dict-values-compression-level. Environment identifiers are LANCE_ENCODING_DICT_VALUES_COMPRESSION and LANCE_ENCODING_DICT_VALUES_COMPRESSION_LEVEL. The names alone do not define precedence. A contextual caller reads both via env::var(...).ok() and feeds an internal synthetic field through a resolver; full resolver semantics remain pending. (rust/lance-encoding/src/encodings/logical/primitive.rs:6381-6392) (rust/lance-encoding/src/constants.rs:29-41)

### Lines 42-49

Comment locates BLOB_META_KEY in lance-core to avoid a dependency cycle. PACKED_STRUCT_LEGACY_META_KEY="packed" is deprecated in documentation only; no #[deprecated] attribute. PACKED_STRUCT_META_KEY="lance-encoding:packed". This file does not implement aliases or select a writer version. (rust/lance-encoding/src/constants.rs:42-49)

### Lines 50-59

STRUCTURAL_ENCODING_META_KEY=lance-encoding:structural-encoding, with public value strings STRUCTURAL_ENCODING_MINIBLOCK=miniblock, STRUCTURAL_ENCODING_FULLZIP=fullzip and STRUCTURAL_ENCODING_SPARSE=sparse. These are metadata vocabulary, not an enum or validation/dispatch table. (rust/lance-encoding/src/constants.rs:50-59)

### Lines 60-65

BSS_META_KEY=lance-encoding:bss and DEFAULT_BSS_MODE=auto. CompressionFieldParams::default still has bss=None; a string constant does not populate it. BssMode::parse accepts case-insensitive exact modes without trimming. (rust/lance-encoding/src/compression_config.rs:24-43; rust/lance-encoding/src/compression_config.rs:55-73) (rust/lance-encoding/src/constants.rs:60-65)

## Interaction and interpretation limits

All physical lines were read in bounded source outputs during ANALYZE72. Offline, read-only inspection; no Lance build, test, lint, benchmark, generator or dependency installation ran. Exact declarations are preserved below and in the symbol index. Other files are only covered at cited contextual ranges; no whole-crate completion or runtime validation is implied.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Constants for Lance encoding metadata keys
    5 | //!
    6 | //! These constants define the metadata keys used in Arrow field metadata
    7 | //! to configure various encoding behaviors in Lance.
    8 | 
    9 | // Compression-related metadata keys
   10 | /// Metadata key for specifying compression scheme (e.g., "lz4", "zstd", "none")
   11 | pub const COMPRESSION_META_KEY: &str = "lance-encoding:compression";
   12 | /// Metadata key for specifying compression level (applies to schemes that support levels)
   13 | pub const COMPRESSION_LEVEL_META_KEY: &str = "lance-encoding:compression-level";
   14 | /// Metadata key for specifying RLE (Run-Length Encoding) threshold
   15 | pub const RLE_THRESHOLD_META_KEY: &str = "lance-encoding:rle-threshold";
   16 | /// Metadata key for specifying minichunk size
   17 | pub const MINICHUNK_SIZE_META_KEY: &str = "lance-encoding:minichunk-size";
   18 | 
   19 | // Dictionary encoding metadata keys
   20 | /// Metadata key for specifying dictionary encoding threshold divisor
   21 | /// Set to a large value to discourage dictionary encoding
   22 | /// Set to a small value to encourage dictionary encoding
   23 | pub const DICT_DIVISOR_META_KEY: &str = "lance-encoding:dict-divisor";
   24 | /// Metadata key for dictionary encoding size ratio threshold (0.0-1.0]
   25 | /// If estimated_dict_size/raw_size < ratio, use dictionary encoding.
   26 | /// Example: 0.8 means use dict if encoded size < 80% of raw size
   27 | /// Default: 0.8
   28 | pub const DICT_SIZE_RATIO_META_KEY: &str = "lance-encoding:dict-size-ratio";
   29 | /// Metadata key for selecting general compression scheme for dictionary values
   30 | /// Valid values: "lz4", "zstd", "none"
   31 | pub const DICT_VALUES_COMPRESSION_META_KEY: &str = "lance-encoding:dict-values-compression";
   32 | /// Metadata key for selecting compression level for dictionary values
   33 | /// Applies to schemes that support levels (e.g. zstd)
   34 | pub const DICT_VALUES_COMPRESSION_LEVEL_META_KEY: &str =
   35 |     "lance-encoding:dict-values-compression-level";
   36 | 
   37 | /// Environment variable for selecting general compression scheme for dictionary values
   38 | pub const DICT_VALUES_COMPRESSION_ENV_VAR: &str = "LANCE_ENCODING_DICT_VALUES_COMPRESSION";
   39 | /// Environment variable for selecting compression level for dictionary values
   40 | pub const DICT_VALUES_COMPRESSION_LEVEL_ENV_VAR: &str =
   41 |     "LANCE_ENCODING_DICT_VALUES_COMPRESSION_LEVEL";
   42 | 
   43 | // NOTE: BLOB_META_KEY is defined in lance-core to avoid circular dependency
   44 | 
   45 | // Packed struct encoding metadata keys
   46 | /// Legacy metadata key for packed struct encoding (deprecated)
   47 | pub const PACKED_STRUCT_LEGACY_META_KEY: &str = "packed";
   48 | /// Metadata key for packed struct encoding
   49 | pub const PACKED_STRUCT_META_KEY: &str = "lance-encoding:packed";
   50 | 
   51 | // Structural encoding metadata keys
   52 | /// Metadata key for specifying structural encoding type
   53 | pub const STRUCTURAL_ENCODING_META_KEY: &str = "lance-encoding:structural-encoding";
   54 | /// Value for miniblock structural encoding
   55 | pub const STRUCTURAL_ENCODING_MINIBLOCK: &str = "miniblock";
   56 | /// Value for fullzip structural encoding
   57 | pub const STRUCTURAL_ENCODING_FULLZIP: &str = "fullzip";
   58 | /// Value for sparse structural encoding
   59 | pub const STRUCTURAL_ENCODING_SPARSE: &str = "sparse";
   60 | 
   61 | // Byte stream split metadata keys
   62 | /// Metadata key for byte stream split encoding configuration
   63 | pub const BSS_META_KEY: &str = "lance-encoding:bss";
   64 | /// Default BSS mode
   65 | pub const DEFAULT_BSS_MODE: &str = "auto";
``````
