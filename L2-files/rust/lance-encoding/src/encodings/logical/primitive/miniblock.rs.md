> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `f039349c8e1105fb544328ec5d82850914fb4787569e7bed8796a2bec55bcb0f`. Reviewed physical lines: 1-201.

[Module](../../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../../README.md)

## Role and visibility

Mini-block page/chunk records, owned compression trait and process-wide maximum-value policy. Records describe framing but do not enforce their invariants. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:1-201)

## Complete range analysis

### Lines 1-18

SPDX/docs describe a chunk as atomic encode/decode unit and allow arbitrary compression within it. Text says one buffer, whereas the actual representation below allows several parallel buffers. Historical two-encoding description is specifically2.1. Imports buffer/data/descriptor/Result. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:1-18)

### Lines 19-24

Public MAX_MINIBLOCK_BYTES=8186 (8*1024-6), private DEFAULT_MAX_MINIBLOCK_VALUES=4096, crate-visible MAX_CONFIGURABLE_MINIBLOCK_VALUES=32768. The first is the intended value-byte budget, not the separate rep/def budget or a universal serialized-chunk ceiling. The maximum comment describes decoder acceptance; this declaration alone does not enforce it. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:19-24)

### Lines 25-35

Private parser reads LANCE_MINIBLOCK_MAX_VALUES, uses var.ok and integer parse.ok, defaults4096 and silently clamps valid integers to1..32768. Missing/non-Unicode/malformed/negative/overflow strings default;0 becomes1 and99999 becomes32768. Arbitrary non-power-of-two values remain unchanged. Public static LazyLock initializes this parser once on first access, so later env changes do not refresh it. General repository input-rejection preference differs from this actual clamping policy. No Result or log. (AGENTS.md:66-69) (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:25-35)

### Lines 36-44

Public max_repdef_levels_per_chunk debug-asserts bits_per_level>0, divides private REPDEF_BUDGET_BITS=131072 (16KiB) by it and caps at65535. Zero also divides by zero without debug assertions; widths greater than131072 return0. No minimum-one guarantee or range error. This is distinct from the value-byte budget. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:36-44)

### Lines 45-56

Public Debug MiniBlockCompressed fields: data:Vec<LanceBuffer>, chunks:Vec<MiniBlockChunk>, num_values:u64. Data can contain multiple parallel buffers despite singular-buffer prose. No validation relates buffer lengths, size sums, chunk counts or value total. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:45-56)

### Lines 57-79

Public Debug+Clone+Copy+PartialEq+Eq MiniBlockCompressionContext has private common_chunk_buffers:u64, support_large_chunk:bool, allow_generic_offsets:bool. Public new copies values without validation; no getters. Repository lexical search found field names only in definitions/constructor and caller-local variables, not field reads. Thus do not claim these fields currently enforce chunk budgets or generic-offset restrictions. Callers supply dense rep/def buffer count with U32 flag and true, or sparse zero/common count with U32 flag and false; full callers remain pending. (rust/lance-encoding/src/encodings/logical/primitive.rs:6416-6420; rust/lance-encoding/src/encodings/logical/primitive/sparse/writer.rs:569-570) (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:57-79)

### Lines 80-111

Public Debug MiniBlockChunk exposes buffer_sizes:Vec<u32> and log_num_values:u8. Docs require nonfinal chunks have a power-of-two count, final uses0 sentinel, and configured log bound (default<=12). Docs mention default4Ki values, slightly under8KiB value bytes,2.1 u16 size/32KiB and2.2 u32 size grammar. In-memory size type is alwaysu32; exact wire/version enforcement lives elsewhere. Nothing in construction checks these statements. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:80-111)

### Lines 112-127

num_values(&self,vals_in_prev_blocks,total_num_values)->u64 returns total-prev when log0, otherwise1<<log. No verification of final position, prior<=total, shift range, configured maximum or sum. Invalid inputs can underflow or overflow/shift-panic depending build checks. It does not itself parse metadata. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:112-127)

### Lines 128-145

Public MiniBlockCompressor:Debug+Send+Sync required compress borrows self and consumes Copy context plus owned DataBlock, returning MiniBlockCompressed and CompressiveEncoding. Trait documents power-of-two nonfinal counts and metadata for decode; it does not validate or serialize results. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:128-145)

### Lines 146-175

cfg(test) serial_test module. Default,custom256 and raise32768 tests directly call parser after unsafe env remove/set, with cleanup after assertions. They do not initialize/check LazyLock or preserve a preexisting env value. Unsafe environment mutation has no local safety explanation. serial attributes coordinate matching tests, not every thread in a process. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:146-175)

### Lines 176-201

Remaining serial tests check0->1,99999->32768 and malformed->4096. Six parser tests total, read not run. A panic before cleanup can leave changed environment. No tests here for arbitrary non-power-of-two values, Unicode failure, once-only static initialization, rep/def division or MiniBlockChunk invalid counts. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:176-201)

## Interaction and interpretation limits

Every physical line was read during ANALYZE73 in bounded outputs. Offline read-only source inspection only: no repository build, test, lint, benchmark, generator or dependency installation. Exact declarations and source are retained below. Contextual caller snippets do not claim whole-file coverage; lexical references do not establish a resolved call graph.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Routines for encoding and decoding miniblock data
    5 | //!
    6 | //! Miniblock encoding is one of the two structural encodings in Lance 2.1.
    7 | //! In this approach the data is compressed into a series of chunks put into
    8 | //! a single buffer.
    9 | //!
   10 | //! A chunk must be encoded or decoded as a unit.  There is a small amount of
   11 | //! chunk metadata such as the number and size of each buffer in the chunk.
   12 | //!
   13 | //! Any form of compression can be used since we are compressing and decompressing
   14 | //! entire chunks.
   15 | use crate::{buffer::LanceBuffer, data::DataBlock, format::pb21::CompressiveEncoding};
   16 | 
   17 | use lance_core::Result;
   18 | 
   19 | pub const MAX_MINIBLOCK_BYTES: u64 = 8 * 1024 - 6;
   20 | 
   21 | const DEFAULT_MAX_MINIBLOCK_VALUES: u64 = 4096;
   22 | /// Maximum number of values that any mini-block decoder accepts from page metadata.
   23 | pub(crate) const MAX_CONFIGURABLE_MINIBLOCK_VALUES: u64 = 32768;
   24 | 
   25 | fn parse_max_miniblock_values() -> u64 {
   26 |     let val = std::env::var("LANCE_MINIBLOCK_MAX_VALUES")
   27 |         .ok()
   28 |         .and_then(|v| v.parse().ok())
   29 |         .unwrap_or(DEFAULT_MAX_MINIBLOCK_VALUES);
   30 |     val.clamp(1, MAX_CONFIGURABLE_MINIBLOCK_VALUES)
   31 | }
   32 | 
   33 | pub static MAX_MINIBLOCK_VALUES: std::sync::LazyLock<u64> =
   34 |     std::sync::LazyLock::new(parse_max_miniblock_values);
   35 | 
   36 | /// Maximum number of rep/def levels the structural planner should place into
   37 | /// a single mini-block chunk.
   38 | pub fn max_repdef_levels_per_chunk(bits_per_level: u64) -> u64 {
   39 |     debug_assert!(bits_per_level > 0);
   40 |     const REPDEF_BUDGET_BITS: u64 = 16 * 1024 * 8;
   41 |     let budgeted_levels = REPDEF_BUDGET_BITS / bits_per_level;
   42 |     budgeted_levels.min(u16::MAX as u64)
   43 | }
   44 | 
   45 | /// Page data that has been compressed into a series of chunks put into
   46 | /// a single buffer.
   47 | #[derive(Debug)]
   48 | pub struct MiniBlockCompressed {
   49 |     /// The buffers of compressed data
   50 |     pub data: Vec<LanceBuffer>,
   51 |     /// Describes the size of each chunk
   52 |     pub chunks: Vec<MiniBlockChunk>,
   53 |     /// The number of values in the entire page
   54 |     pub num_values: u64,
   55 | }
   56 | 
   57 | /// Per-page framing details that can affect a mini-block compressor's choice.
   58 | #[derive(Debug, Clone, Copy, PartialEq, Eq)]
   59 | pub struct MiniBlockCompressionContext {
   60 |     common_chunk_buffers: u64,
   61 |     support_large_chunk: bool,
   62 |     allow_generic_offsets: bool,
   63 | }
   64 | 
   65 | impl MiniBlockCompressionContext {
   66 |     /// Creates the framing context supplied by the owning mini-block page.
   67 |     pub fn new(
   68 |         common_chunk_buffers: u64,
   69 |         support_large_chunk: bool,
   70 |         allow_generic_offsets: bool,
   71 |     ) -> Self {
   72 |         Self {
   73 |             common_chunk_buffers,
   74 |             support_large_chunk,
   75 |             allow_generic_offsets,
   76 |         }
   77 |     }
   78 | }
   79 | 
   80 | /// Describes the size of a mini-block chunk of data
   81 | ///
   82 | /// Mini-block chunks are designed to be small (just a few disk sectors)
   83 | /// and contain a power-of-two number of values (except for the last chunk)
   84 | ///
   85 | /// By default we limit a chunk to 4Ki values and slightly less than
   86 | /// 8KiB of compressed value data.  The byte budget remains the primary
   87 | /// constraint, so only encodings that compress many values into that
   88 | /// budget can use larger value counts when explicitly configured.
   89 | ///
   90 | /// The maximum number of values per chunk can be configured via the
   91 | /// `LANCE_MINIBLOCK_MAX_VALUES` environment variable.  This is only
   92 | /// useful in extremely bandwidth-limited environments; the default is
   93 | /// appropriate for local disks and same-region cloud object storage.
   94 | #[derive(Debug)]
   95 | pub struct MiniBlockChunk {
   96 |     // The size in bytes of each buffer in the chunk.
   97 |     //
   98 |     // In Lance 2.1, the chunk size is limited to 32KiB, so only 16-bits are used.
   99 |     // Since Lance 2.2, the chunk size uses u32 to support larger chunk size
  100 |     pub buffer_sizes: Vec<u32>,
  101 |     // The log (base 2) of the number of values in the chunk.  If this is the final chunk
  102 |     // then this should be 0 (the number of values will be calculated by subtracting the
  103 |     // size of all other chunks from the total size of the page)
  104 |     //
  105 |     // For example, 1 would mean there are 2 values in the chunk and 15 would mean there
  106 |     // are 32Ki values in the chunk.
  107 |     //
  108 |     // This must be <= log2(MAX_MINIBLOCK_VALUES) (i.e. <= 12 at the default of 4096)
  109 |     pub log_num_values: u8,
  110 | }
  111 | 
  112 | impl MiniBlockChunk {
  113 |     /// Gets the number of values in this block
  114 |     ///
  115 |     /// This requires `vals_in_prev_blocks` and `total_num_values` because the
  116 |     /// last block in a page is a special case which stores 0 for log_num_values
  117 |     /// and, in that case, the number of values is determined by subtracting
  118 |     /// `vals_in_prev_blocks` from `total_num_values`
  119 |     pub fn num_values(&self, vals_in_prev_blocks: u64, total_num_values: u64) -> u64 {
  120 |         if self.log_num_values == 0 {
  121 |             total_num_values - vals_in_prev_blocks
  122 |         } else {
  123 |             1 << self.log_num_values
  124 |         }
  125 |     }
  126 | }
  127 | 
  128 | /// Trait for compression algorithms that are suitable for use in the miniblock structural encoding
  129 | ///
  130 | /// These compression algorithms should be capable of encoding the data into small chunks
  131 | /// where each chunk (except the last) has 2^N values (N can vary between chunks)
  132 | pub trait MiniBlockCompressor: std::fmt::Debug + Send + Sync {
  133 |     /// Compress a `page` of data into multiple chunks
  134 |     ///
  135 |     /// See [`MiniBlockCompressed`] for details on how chunks should be sized.
  136 |     ///
  137 |     /// This method also returns a description of the encoding applied that will be
  138 |     /// used at decode time to read the data.
  139 |     fn compress(
  140 |         &self,
  141 |         context: MiniBlockCompressionContext,
  142 |         page: DataBlock,
  143 |     ) -> Result<(MiniBlockCompressed, CompressiveEncoding)>;
  144 | }
  145 | 
  146 | #[cfg(test)]
  147 | mod tests {
  148 |     use serial_test::serial;
  149 | 
  150 |     use super::*;
  151 | 
  152 |     #[test]
  153 |     #[serial]
  154 |     fn test_parse_default() {
  155 |         unsafe { std::env::remove_var("LANCE_MINIBLOCK_MAX_VALUES") };
  156 |         assert_eq!(parse_max_miniblock_values(), 4096);
  157 |     }
  158 | 
  159 |     #[test]
  160 |     #[serial]
  161 |     fn test_parse_custom_value() {
  162 |         unsafe { std::env::set_var("LANCE_MINIBLOCK_MAX_VALUES", "256") };
  163 |         assert_eq!(parse_max_miniblock_values(), 256);
  164 |         unsafe { std::env::remove_var("LANCE_MINIBLOCK_MAX_VALUES") };
  165 |     }
  166 | 
  167 |     #[test]
  168 |     #[serial]
  169 |     fn test_parse_can_raise_to_32k() {
  170 |         unsafe { std::env::set_var("LANCE_MINIBLOCK_MAX_VALUES", "32768") };
  171 |         assert_eq!(parse_max_miniblock_values(), 32768);
  172 |         unsafe { std::env::remove_var("LANCE_MINIBLOCK_MAX_VALUES") };
  173 |     }
  174 | 
  175 |     #[test]
  176 |     #[serial]
  177 |     fn test_parse_clamps_zero_to_one() {
  178 |         unsafe { std::env::set_var("LANCE_MINIBLOCK_MAX_VALUES", "0") };
  179 |         assert_eq!(parse_max_miniblock_values(), 1);
  180 |         unsafe { std::env::remove_var("LANCE_MINIBLOCK_MAX_VALUES") };
  181 |     }
  182 | 
  183 |     #[test]
  184 |     #[serial]
  185 |     fn test_parse_clamps_above_max() {
  186 |         unsafe { std::env::set_var("LANCE_MINIBLOCK_MAX_VALUES", "99999") };
  187 |         assert_eq!(
  188 |             parse_max_miniblock_values(),
  189 |             MAX_CONFIGURABLE_MINIBLOCK_VALUES
  190 |         );
  191 |         unsafe { std::env::remove_var("LANCE_MINIBLOCK_MAX_VALUES") };
  192 |     }
  193 | 
  194 |     #[test]
  195 |     #[serial]
  196 |     fn test_parse_invalid_falls_back_to_default() {
  197 |         unsafe { std::env::set_var("LANCE_MINIBLOCK_MAX_VALUES", "not_a_number") };
  198 |         assert_eq!(parse_max_miniblock_values(), DEFAULT_MAX_MINIBLOCK_VALUES);
  199 |         unsafe { std::env::remove_var("LANCE_MINIBLOCK_MAX_VALUES") };
  200 |     }
  201 | }
``````
