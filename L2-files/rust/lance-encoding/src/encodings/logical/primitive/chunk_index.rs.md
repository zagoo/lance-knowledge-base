> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../../V21-PROTOCOL.md).

# rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `5016fa92c8aed34008485ef92ca034c0326f84368d983bf7c7b27e558cc37723`. Reviewed physical lines: 1-536.

[Module](../../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../../README.md)

## Role and visibility

Compact relative-byte, row and leaf-item coordinates for structural mini-block pages; nested repetition-index interpretation. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:1-536)

## Complete range analysis

### Lines 1-35

Documentation describes compact prefix sums, optional row counts and absolute base offsets. Imports supply BooleanBuffer storage and cache sizing. PrefixSums has U32 and U64 vector variants. Although declared pub, this module is private in primitive.rs; these are implementation APIs, not externally reachable through a public module path. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:1-35)

### Lines 36-64

from_deltas selects U32 iff caller-supplied total fits u32, reserves num_chunks+1 and starts at zero. U32 casts each delta and adds without checked arithmetic; U64 also adds unchecked. Count and final total are debug assertions only. Incorrect declared totals/counts can truncate, overflow or construct inconsistent data in release. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:36-64)

### Lines 65-79

from_prefix is private. Nonempty and first-zero requirements are debug assertions; final prefix value (or zero) chooses representation. No monotonicity or intermediate bound checks occur. U32 conversion casts every element and allocates; U64 retains input. Empty release input can become an empty prefix vector. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:65-79)

### Lines 80-110

get and get_pair direct-index; get_pair reads adjacent starts with one enum match. num_chunks subtracts one from vector length; delta subtracts starts. Caller must provide valid lengths, indices and monotonic values. Public enum construction can bypass helper assumptions within the containing module boundary. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:80-110)

### Lines 111-140

find excludes the terminal total, partitions starts strictly below value, returns exact first match or predecessor. Equal duplicate starts choose the first zero-width chunk, as the test confirms. It does not reject out-of-range values: beyond total selects the last start; empty or invalid prefixes can underflow. Documentation saying containing chunk needs this duplicate-start qualification. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:111-140)

### Lines 141-184

ItemCounts distinguishes uniform values_per_chunk plus last_chunk_values from per-chunk base-two logs plus last count. Private get uses byte-index num_chunks to recognize final chunk, otherwise uniform count or 1u64<<logs[i]. No local bounds, nonzero chunk count or valid shift check; final log is unused. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:141-184)

### Lines 185-212

RowMapping separates UniformFlat counts, Flat value-start prefixes and Nested row-start prefixes, trailer bits and leaf ItemCounts. Nested row counts include a trailer start but exclude an incoming preamble. Row count and leaf-value count are different coordinates. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:185-212)

### Lines 213-230

RowMapping DeepSizeOf counts zero children for UniformFlat, prefix children for Flat, and row prefix plus ceil(trailer bit length/8) plus item-count children for Nested. Boolean accounting is logical bit length, not allocation capacity or shared-context deduplication. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:213-230)

### Lines 231-278

MiniBlockChunkIndex owns base_offset, byte prefix and row mapping. new validates nothing. num_chunks comes from byte prefix. byte_range adds relative starts to base unchecked. items_in_chunk uses byte chunk count for final uniform/nested item count, or Flat prefix delta; it does not reconcile independent row/byte counts. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:231-278)

### Lines 279-303

find_chunk on UniformFlat divides row by values_per_chunk, casts to usize and clamps to RowMapping num_chunks-1; zero stride/count can panic/underflow and an out-of-range row clamps. Other variants use prefix find. first_row multiplies index by uniform stride unchecked or direct-reads prefix. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:279-303)

### Lines 304-343

rows_in_chunk uses byte chunk count for UniformFlat final count; Flat/Nested subtract row prefixes. Nested preamble is previous chunk trailer (false at index zero), trailer is current bit. Flat variants return false without index validation. Separate coordinate lengths are caller invariants. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:304-343)

### Lines 344-380

cfg(test) row_mapping_debug returns exact named diagnostic shapes. new_nested_for_test parses repetition rows and supplies placeholder eight-byte chunks and uniform one-value counts; it is not a real-file index constructor. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:344-380)

### Lines 381-386

MiniBlockChunkIndex DeepSizeOf sums byte-prefix and row-map children; base scalar has no heap child. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:381-386)

### Lines 387-432

parse_nested_rep consumes little-endian u64 words using stride words per chunk. num_chunks floors (bytes.len()/8)/stride; zero stride divides by zero, stride one can overlap words then overrun, and trailing bytes/incomplete groups are not locally rejected. Only first two words per group are read: ends and partial. has_trailer=partial>0; starts=ends+trailer-previous_trailer; accumulate starts into prefix and set trailer bit. Arithmetic unchecked, deeper-level words ignored, and no final-trailer, row total or cross-axis count validation. Caller comment about divisible-by-eight alone is insufficient for stride one. Empty input with positive stride yields prefix[0] and empty bits. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:387-432)

### Lines 433-476

Tests define a RefBlock and reconstruct row starts/counts using the same arithmetic on typed u64 words. This cross-representation comparison is not an independent semantic oracle. rep_bytes writes little-endian fixture words. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:433-476)

### Lines 477-495

Prefix tests cover U32 deltas2,3,5 total10, selected getters/counts, and U64 for a single delta u32::MAX+1. They do not cover exact threshold, invalid totals, empty prefix or overflow behavior. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:477-495)

### Lines 496-509

find test uses starts[0,5,5,12]: values3,5,11,0 map to chunks0,1,2,0. The exact duplicate chooses chunk1 even though its width is zero. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:496-509)

### Lines 510-536

Nested parser comparison iterates four stride-two fixture sequences, asserting row start, rows, trailer and derived preamble against reference arithmetic. Four local test functions total; no local malformed-stride/length, count mismatch, all accessor or release-invariant tests. No unsafe, I/O or runtime configuration in this file. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:510-536)

## Interaction and interpretation limits

Every physical line read in bounded untruncated outputs. Source-only analysis; no repository build/test/runtime. Parent primitive and Arrow scalar modules read only in specified contextual ranges. Caller invariants and possible panics are source deductions, not reproduced failures.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Compact per-page chunk index for the mini-block structural encoding.
    5 | //!
    6 | //! The chunk index is stored on disk in an extremely compressed form that
    7 | //! requires a lot of CPU to work with.  However, extracting it out to its full
    8 | //! width can be RAM-intensive.  As a compromise we extract into a prefix-sum
    9 | //! array that we fit into `u32` if possible and we avoid storing per-block row
   10 | //! counts when those are redundant.  The scheduler looks chunks up by index
   11 | //! (byte range, leaf value count) and by row (which chunk holds a row).
   12 | //!
   13 | //! ```text
   14 | //! MiniBlockChunkIndex
   15 | //! |- base: u64                      absolute file position of the value buffer
   16 | //! |- byte_starts: PrefixSums        cumulative chunk byte sizes (all pages)
   17 | //! `- rows: RowMapping
   18 | //!    |- UniformFlat { .. }          flat page, uniform leaf chunking (arithmetic)
   19 | //!    |- Flat { value_starts }       flat page, non-uniform leaf chunking
   20 | //!    `- Nested { row_starts, .. }   repetition present; rows tracked as prefix sums
   21 | //! ```
   22 | 
   23 | use std::ops::Range;
   24 | 
   25 | use arrow_buffer::{BooleanBuffer, BooleanBufferBuilder};
   26 | use lance_core::cache::{Context, DeepSizeOf};
   27 | 
   28 | /// Cumulative (prefix-sum) array of length `num_chunks + 1` (entry `0` is `0`,
   29 | /// the last entry is the grand total).  Stored as `u32` when the total fits,
   30 | /// else `u64`.
   31 | #[derive(Debug, DeepSizeOf)]
   32 | pub enum PrefixSums {
   33 |     U32(Vec<u32>),
   34 |     U64(Vec<u64>),
   35 | }
   36 | 
   37 | impl PrefixSums {
   38 |     /// Builds the cumulative array from per-chunk `deltas`.  `total` selects the
   39 |     /// storage width (callers must pass the true sum); `num_chunks` only pre-sizes.
   40 |     pub fn from_deltas(deltas: impl Iterator<Item = u64>, num_chunks: usize, total: u64) -> Self {
   41 |         if total <= u32::MAX as u64 {
   42 |             let mut values = Vec::with_capacity(num_chunks + 1);
   43 |             let mut acc = 0u32;
   44 |             values.push(0);
   45 |             for delta in deltas {
   46 |                 acc += delta as u32;
   47 |                 values.push(acc);
   48 |             }
   49 |             debug_assert_eq!(values.len(), num_chunks + 1);
   50 |             debug_assert_eq!(acc as u64, total);
   51 |             Self::U32(values)
   52 |         } else {
   53 |             let mut values = Vec::with_capacity(num_chunks + 1);
   54 |             let mut acc = 0u64;
   55 |             values.push(0);
   56 |             for delta in deltas {
   57 |                 acc += delta;
   58 |                 values.push(acc);
   59 |             }
   60 |             debug_assert_eq!(values.len(), num_chunks + 1);
   61 |             debug_assert_eq!(acc, total);
   62 |             Self::U64(values)
   63 |         }
   64 |     }
   65 | 
   66 |     /// Builds a `PrefixSums` from an already-cumulative array (`[0, .., total]`),
   67 |     /// narrowing to `u32` when the total fits.  Avoids the deltas buffer
   68 |     /// [`Self::from_deltas`] would need.
   69 |     fn from_prefix(prefix: Vec<u64>) -> Self {
   70 |         debug_assert!(!prefix.is_empty());
   71 |         debug_assert_eq!(prefix[0], 0);
   72 |         let total = prefix.last().copied().unwrap_or(0);
   73 |         if total <= u32::MAX as u64 {
   74 |             Self::U32(prefix.into_iter().map(|v| v as u32).collect())
   75 |         } else {
   76 |             Self::U64(prefix)
   77 |         }
   78 |     }
   79 | 
   80 |     /// Cumulative value at position `i` (i.e. the start of chunk `i`).
   81 |     pub fn get(&self, i: usize) -> u64 {
   82 |         match self {
   83 |             Self::U32(values) => values[i] as u64,
   84 |             Self::U64(values) => values[i],
   85 |         }
   86 |     }
   87 | 
   88 |     /// Start and end of chunk `i` (positions `i`, `i + 1`) behind one width
   89 |     /// match -- halves the branching of two `get` calls on the hot per-chunk path.
   90 |     pub fn get_pair(&self, i: usize) -> (u64, u64) {
   91 |         match self {
   92 |             Self::U32(values) => (values[i] as u64, values[i + 1] as u64),
   93 |             Self::U64(values) => (values[i], values[i + 1]),
   94 |         }
   95 |     }
   96 | 
   97 |     /// Number of chunks (array length minus the trailing total).
   98 |     pub fn num_chunks(&self) -> usize {
   99 |         match self {
  100 |             Self::U32(values) => values.len() - 1,
  101 |             Self::U64(values) => values.len() - 1,
  102 |         }
  103 |     }
  104 | 
  105 |     /// Size of chunk `i` (the delta between consecutive cumulative values).
  106 |     pub fn delta(&self, i: usize) -> u64 {
  107 |         let (start, end) = self.get_pair(i);
  108 |         end - start
  109 |     }
  110 | 
  111 |     /// Index of the chunk whose half-open span `[get(i), get(i+1))` contains
  112 |     /// `value`.  On an exact hit against a chunk start, returns the *first* chunk
  113 |     /// with that start (chunks can share a start row).
  114 |     pub fn find(&self, value: u64) -> usize {
  115 |         // Match the width once, then binary-search only the starts (not the
  116 |         // trailing total).  `partition_point` already yields the first of any
  117 |         // duplicated starts; the `idx - 1` fallback is safe since `get(0) == 0`.
  118 |         match self {
  119 |             Self::U32(values) => {
  120 |                 let starts = &values[..values.len() - 1];
  121 |                 let idx = starts.partition_point(|&start| (start as u64) < value);
  122 |                 if idx < starts.len() && starts[idx] as u64 == value {
  123 |                     idx
  124 |                 } else {
  125 |                     idx - 1
  126 |                 }
  127 |             }
  128 |             Self::U64(values) => {
  129 |                 let starts = &values[..values.len() - 1];
  130 |                 let idx = starts.partition_point(|&start| start < value);
  131 |                 if idx < starts.len() && starts[idx] == value {
  132 |                     idx
  133 |                 } else {
  134 |                     idx - 1
  135 |                 }
  136 |             }
  137 |         }
  138 |     }
  139 | }
  140 | 
  141 | /// Leaf value counts per chunk, needed to decode.  Tracked only for nested
  142 | /// pages; flat pages read items off the row mapping (rows == items).
  143 | #[derive(Debug, DeepSizeOf)]
  144 | pub enum ItemCounts {
  145 |     /// Every non-last chunk holds the same number of values.
  146 |     Uniform {
  147 |         values_per_chunk: u64,
  148 |         last_chunk_values: u64,
  149 |     },
  150 |     /// `log2` of each chunk's value count, stored as one byte per chunk rather
  151 |     /// than the full count because this index stays cached in RAM; the last
  152 |     /// chunk is handled via `last_chunk_values`.
  153 |     PerChunkLog {
  154 |         logs: Vec<u8>,
  155 |         last_chunk_values: u64,
  156 |     },
  157 | }
  158 | 
  159 | impl ItemCounts {
  160 |     fn get(&self, i: usize, num_chunks: usize) -> u64 {
  161 |         match self {
  162 |             Self::Uniform {
  163 |                 values_per_chunk,
  164 |                 last_chunk_values,
  165 |             } => {
  166 |                 if i == num_chunks - 1 {
  167 |                     *last_chunk_values
  168 |                 } else {
  169 |                     *values_per_chunk
  170 |                 }
  171 |             }
  172 |             Self::PerChunkLog {
  173 |                 logs,
  174 |                 last_chunk_values,
  175 |             } => {
  176 |                 if i == num_chunks - 1 {
  177 |                     *last_chunk_values
  178 |                 } else {
  179 |                     1u64 << logs[i]
  180 |                 }
  181 |             }
  182 |         }
  183 |     }
  184 | }
  185 | 
  186 | /// How row ranges map onto chunks.
  187 | ///
  188 | /// Flat pages have row == value index and no preamble/trailer.  Nested pages
  189 | /// track rows separately from leaf items and store a trailer bit per chunk; a
  190 | /// chunk's preamble is the previous chunk's trailer.
  191 | #[derive(Debug)]
  192 | pub enum RowMapping {
  193 |     /// Flat page whose non-last chunks all hold `values_per_chunk` values, so
  194 |     /// row->chunk is pure arithmetic.
  195 |     UniformFlat {
  196 |         values_per_chunk: u64,
  197 |         last_chunk_values: u64,
  198 |         num_chunks: usize,
  199 |     },
  200 |     /// Flat page with non-uniform chunk sizes; `value_starts` are the cumulative
  201 |     /// value counts (final entry == number of items in the page).
  202 |     Flat { value_starts: PrefixSums },
  203 |     /// Nested page.  `row_starts` are cumulative row counts (final entry ==
  204 |     /// number of rows in the page); `has_trailer[i]` is set when chunk `i` ends
  205 |     /// with a partial list.
  206 |     Nested {
  207 |         row_starts: PrefixSums,
  208 |         has_trailer: BooleanBuffer,
  209 |         item_counts: ItemCounts,
  210 |     },
  211 | }
  212 | 
  213 | impl DeepSizeOf for RowMapping {
  214 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  215 |         match self {
  216 |             Self::UniformFlat { .. } => 0,
  217 |             Self::Flat { value_starts } => value_starts.deep_size_of_children(context),
  218 |             Self::Nested {
  219 |                 row_starts,
  220 |                 has_trailer,
  221 |                 item_counts,
  222 |             } => {
  223 |                 row_starts.deep_size_of_children(context)
  224 |                     + has_trailer.len().div_ceil(8)
  225 |                     + item_counts.deep_size_of_children(context)
  226 |             }
  227 |         }
  228 |     }
  229 | }
  230 | 
  231 | /// Compact per-page chunk index that avoids fully materializing the repetition
  232 | /// index into u64's to save RAM.  See the module docs for the layout.
  233 | #[derive(Debug)]
  234 | pub struct MiniBlockChunkIndex {
  235 |     base: u64,
  236 |     byte_starts: PrefixSums,
  237 |     rows: RowMapping,
  238 | }
  239 | 
  240 | impl MiniBlockChunkIndex {
  241 |     pub fn new(base: u64, byte_starts: PrefixSums, rows: RowMapping) -> Self {
  242 |         Self {
  243 |             base,
  244 |             byte_starts,
  245 |             rows,
  246 |         }
  247 |     }
  248 | 
  249 |     /// Number of chunks in the page.
  250 |     pub fn num_chunks(&self) -> usize {
  251 |         self.byte_starts.num_chunks()
  252 |     }
  253 | 
  254 |     /// Absolute byte range of chunk `i` within the file.
  255 |     pub fn byte_range(&self, i: usize) -> Range<u64> {
  256 |         let (start, end) = self.byte_starts.get_pair(i);
  257 |         (self.base + start)..(self.base + end)
  258 |     }
  259 | 
  260 |     /// Number of leaf values in chunk `i` (passed to the value decompressor).
  261 |     pub fn items_in_chunk(&self, i: usize) -> u64 {
  262 |         let num_chunks = self.num_chunks();
  263 |         match &self.rows {
  264 |             RowMapping::UniformFlat {
  265 |                 values_per_chunk,
  266 |                 last_chunk_values,
  267 |                 ..
  268 |             } => {
  269 |                 if i == num_chunks - 1 {
  270 |                     *last_chunk_values
  271 |                 } else {
  272 |                     *values_per_chunk
  273 |                 }
  274 |             }
  275 |             RowMapping::Flat { value_starts } => value_starts.delta(i),
  276 |             RowMapping::Nested { item_counts, .. } => item_counts.get(i, num_chunks),
  277 |         }
  278 |     }
  279 | 
  280 |     /// Index of the chunk that contains `row`.
  281 |     pub fn find_chunk(&self, row: u64) -> usize {
  282 |         match &self.rows {
  283 |             RowMapping::UniformFlat {
  284 |                 values_per_chunk,
  285 |                 num_chunks,
  286 |                 ..
  287 |             } => ((row / values_per_chunk) as usize).min(num_chunks - 1),
  288 |             RowMapping::Flat { value_starts } => value_starts.find(row),
  289 |             RowMapping::Nested { row_starts, .. } => row_starts.find(row),
  290 |         }
  291 |     }
  292 | 
  293 |     /// First row (relative to the page) that begins in chunk `i`.
  294 |     pub fn first_row(&self, i: usize) -> u64 {
  295 |         match &self.rows {
  296 |             RowMapping::UniformFlat {
  297 |                 values_per_chunk, ..
  298 |             } => i as u64 * values_per_chunk,
  299 |             RowMapping::Flat { value_starts } => value_starts.get(i),
  300 |             RowMapping::Nested { row_starts, .. } => row_starts.get(i),
  301 |         }
  302 |     }
  303 | 
  304 |     /// Number of rows that start in chunk `i`, including a trailer but not a
  305 |     /// preamble (the previous `starts_including_trailer`).
  306 |     pub fn rows_in_chunk(&self, i: usize) -> u64 {
  307 |         let num_chunks = self.num_chunks();
  308 |         match &self.rows {
  309 |             RowMapping::UniformFlat {
  310 |                 values_per_chunk,
  311 |                 last_chunk_values,
  312 |                 ..
  313 |             } => {
  314 |                 if i == num_chunks - 1 {
  315 |                     *last_chunk_values
  316 |                 } else {
  317 |                     *values_per_chunk
  318 |                 }
  319 |             }
  320 |             RowMapping::Flat { value_starts } => value_starts.delta(i),
  321 |             RowMapping::Nested { row_starts, .. } => row_starts.delta(i),
  322 |         }
  323 |     }
  324 | 
  325 |     /// Whether chunk `i` begins with a preamble (a continuation of the previous
  326 |     /// chunk's list).  Always false for flat pages; for nested pages this is the
  327 |     /// previous chunk's trailer.
  328 |     pub fn has_preamble(&self, i: usize) -> bool {
  329 |         match &self.rows {
  330 |             RowMapping::Nested { has_trailer, .. } => i > 0 && has_trailer.value(i - 1),
  331 |             _ => false,
  332 |         }
  333 |     }
  334 | 
  335 |     /// Whether chunk `i` ends with a trailer (a partial list continued in the
  336 |     /// next chunk).  Always false for flat pages.
  337 |     pub fn has_trailer(&self, i: usize) -> bool {
  338 |         match &self.rows {
  339 |             RowMapping::Nested { has_trailer, .. } => has_trailer.value(i),
  340 |             _ => false,
  341 |         }
  342 |     }
  343 | 
  344 |     /// Name of the active row-mapping variant, used to assert detection in tests.
  345 |     #[cfg(test)]
  346 |     pub fn row_mapping_debug(&self) -> &'static str {
  347 |         match &self.rows {
  348 |             RowMapping::UniformFlat { .. } => "uniform_flat",
  349 |             RowMapping::Flat { .. } => "flat",
  350 |             RowMapping::Nested { .. } => "nested",
  351 |         }
  352 |     }
  353 | 
  354 |     /// Builds a nested index from raw repetition-index bytes, using placeholder
  355 |     /// byte offsets and item counts.  Only the row axis is populated, which is
  356 |     /// all the scheduler exercises.
  357 |     #[cfg(test)]
  358 |     pub fn new_nested_for_test(rep_bytes: &[u8], stride: usize) -> Self {
  359 |         let (row_starts, has_trailer) = parse_nested_rep(rep_bytes, stride);
  360 |         let num_chunks = row_starts.num_chunks();
  361 |         let byte_starts = PrefixSums::from_deltas(
  362 |             std::iter::repeat_n(8u64, num_chunks),
  363 |             num_chunks,
  364 |             8 * num_chunks as u64,
  365 |         );
  366 |         Self {
  367 |             base: 0,
  368 |             byte_starts,
  369 |             rows: RowMapping::Nested {
  370 |                 row_starts,
  371 |                 has_trailer,
  372 |                 item_counts: ItemCounts::Uniform {
  373 |                     values_per_chunk: 1,
  374 |                     last_chunk_values: 1,
  375 |                 },
  376 |             },
  377 |         }
  378 |     }
  379 | }
  380 | 
  381 | impl DeepSizeOf for MiniBlockChunkIndex {
  382 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  383 |         self.byte_starts.deep_size_of_children(context) + self.rows.deep_size_of_children(context)
  384 |     }
  385 | }
  386 | 
  387 | /// Parses a mini-block repetition index into the compact nested row mapping.
  388 | ///
  389 | /// Bytes are `u64`s in groups of `stride`; the first two are `ends` (lists
  390 | /// finishing in the chunk) and `partial` (leftover items).  Only cumulative row
  391 | /// starts and a trailer bit are kept: `has_preamble[i] = has_trailer[i-1]` and
  392 | /// `starts_including_trailer = ends + has_trailer - has_preamble`.
  393 | pub fn parse_nested_rep(rep_bytes: &[u8], stride: usize) -> (PrefixSums, BooleanBuffer) {
  394 |     // Read the two `u64`s per group straight from the little-endian bytes rather
  395 |     // than copying the buffer to reinterpret it.  The caller guarantees
  396 |     // `rep_bytes.len() % 8 == 0`, so the 8-byte windows stay in bounds.
  397 |     const WORD: usize = std::mem::size_of::<u64>();
  398 |     let read_word = |word_idx: usize| -> u64 {
  399 |         let byte = word_idx * WORD;
  400 |         u64::from_le_bytes(rep_bytes[byte..byte + WORD].try_into().unwrap())
  401 |     };
  402 |     let num_chunks = (rep_bytes.len() / WORD) / stride;
  403 | 
  404 |     let mut has_trailer_builder = BooleanBufferBuilder::new(num_chunks);
  405 |     // Accumulate the cumulative row starts in a single pass (entry 0 is 0, the
  406 |     // trailing entry is the total) so there is no separate deltas buffer.
  407 |     let mut row_starts = Vec::with_capacity(num_chunks + 1);
  408 |     row_starts.push(0u64);
  409 |     let mut acc = 0u64;
  410 |     let mut chunk_has_preamble = false;
  411 | 
  412 |     for i in 0..num_chunks {
  413 |         let base_idx = i * stride;
  414 |         let ends = read_word(base_idx);
  415 |         let partial = read_word(base_idx + 1);
  416 | 
  417 |         let has_trailer = partial > 0;
  418 |         let starts_including_trailer = ends + (has_trailer as u64) - (chunk_has_preamble as u64);
  419 | 
  420 |         has_trailer_builder.append(has_trailer);
  421 |         acc += starts_including_trailer;
  422 |         row_starts.push(acc);
  423 | 
  424 |         chunk_has_preamble = has_trailer;
  425 |     }
  426 | 
  427 |     (
  428 |         PrefixSums::from_prefix(row_starts),
  429 |         has_trailer_builder.finish(),
  430 |     )
  431 | }
  432 | 
  433 | #[cfg(test)]
  434 | mod tests {
  435 |     use super::*;
  436 |     use crate::buffer::LanceBuffer;
  437 | 
  438 |     /// Reference decode: the previous per-block repetition index, used as an
  439 |     /// oracle for the compact `parse_nested_rep`.
  440 |     struct RefBlock {
  441 |         first_row: u64,
  442 |         starts_including_trailer: u64,
  443 |         has_preamble: bool,
  444 |         has_trailer: bool,
  445 |     }
  446 | 
  447 |     fn reference_decode(rep_bytes: &[u8], stride: usize) -> Vec<RefBlock> {
  448 |         let buffer = LanceBuffer::from(rep_bytes.to_vec());
  449 |         let u64_slice = buffer.borrow_to_typed_slice::<u64>();
  450 |         let n = u64_slice.len() / stride;
  451 |         let mut blocks = Vec::with_capacity(n);
  452 |         let mut chunk_has_preamble = false;
  453 |         let mut offset = 0u64;
  454 |         for i in 0..n {
  455 |             let base_idx = i * stride;
  456 |             let ends = u64_slice[base_idx];
  457 |             let partial = u64_slice[base_idx + 1];
  458 |             let has_trailer = partial > 0;
  459 |             let starts_including_trailer =
  460 |                 ends + (has_trailer as u64) - (chunk_has_preamble as u64);
  461 |             blocks.push(RefBlock {
  462 |                 first_row: offset,
  463 |                 starts_including_trailer,
  464 |                 has_preamble: chunk_has_preamble,
  465 |                 has_trailer,
  466 |             });
  467 |             chunk_has_preamble = has_trailer;
  468 |             offset += starts_including_trailer;
  469 |         }
  470 |         blocks
  471 |     }
  472 | 
  473 |     fn rep_bytes(values: &[u64]) -> Vec<u8> {
  474 |         values.iter().flat_map(|v| v.to_le_bytes()).collect()
  475 |     }
  476 | 
  477 |     #[test]
  478 |     fn test_prefix_sums_u32() {
  479 |         let sums = PrefixSums::from_deltas([2u64, 3, 5].into_iter(), 3, 10);
  480 |         assert!(matches!(sums, PrefixSums::U32(_)));
  481 |         assert_eq!(sums.num_chunks(), 3);
  482 |         assert_eq!(sums.get(0), 0);
  483 |         assert_eq!(sums.get(1), 2);
  484 |         assert_eq!(sums.get(3), 10);
  485 |         assert_eq!(sums.delta(1), 3);
  486 |     }
  487 | 
  488 |     #[test]
  489 |     fn test_prefix_sums_u64_selected_by_total() {
  490 |         let big = u32::MAX as u64 + 1;
  491 |         let sums = PrefixSums::from_deltas([big].into_iter(), 1, big);
  492 |         assert!(matches!(sums, PrefixSums::U64(_)));
  493 |         assert_eq!(sums.get(1), big);
  494 |     }
  495 | 
  496 |     #[test]
  497 |     fn test_prefix_sums_find() {
  498 |         // Chunk starts: 0, 5, 5, 12 (a zero-width chunk creates a duplicate start)
  499 |         let sums = PrefixSums::from_deltas([5u64, 0, 7].into_iter(), 3, 12);
  500 |         // Inside the first chunk
  501 |         assert_eq!(sums.find(3), 0);
  502 |         // Exact match on a duplicated start returns the first such chunk
  503 |         assert_eq!(sums.find(5), 1);
  504 |         // Inside the last chunk
  505 |         assert_eq!(sums.find(11), 2);
  506 |         // Start of the first chunk
  507 |         assert_eq!(sums.find(0), 0);
  508 |     }
  509 | 
  510 |     #[test]
  511 |     fn test_parse_nested_rep_matches_reference() {
  512 |         let cases: Vec<Vec<u64>> = vec![
  513 |             vec![5, 2, 3, 0, 4, 7, 2, 0],
  514 |             vec![5, 2, 3, 3, 20, 0],
  515 |             vec![0, 5, 0, 3, 10, 0],
  516 |             vec![1, 0],
  517 |         ];
  518 |         for values in cases {
  519 |             let bytes = rep_bytes(&values);
  520 |             let reference = reference_decode(&bytes, 2);
  521 |             let (row_starts, has_trailer) = parse_nested_rep(&bytes, 2);
  522 |             assert_eq!(row_starts.num_chunks(), reference.len());
  523 |             for (i, block) in reference.iter().enumerate() {
  524 |                 assert_eq!(row_starts.get(i), block.first_row, "first_row[{i}]");
  525 |                 assert_eq!(
  526 |                     row_starts.delta(i),
  527 |                     block.starts_including_trailer,
  528 |                     "starts_including_trailer[{i}]"
  529 |                 );
  530 |                 assert_eq!(has_trailer.value(i), block.has_trailer, "has_trailer[{i}]");
  531 |                 let derived_preamble = i > 0 && has_trailer.value(i - 1);
  532 |                 assert_eq!(derived_preamble, block.has_preamble, "has_preamble[{i}]");
  533 |             }
  534 |         }
  535 |     }
  536 | }
``````
