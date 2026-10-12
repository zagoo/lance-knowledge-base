> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/stable_partition.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `44d3f0f518e65f0e4167712280b80f6838a9e86ed0e66368b43d1bd9b80bf4ba`. Reviewed physical lines: 1-697.

[Module](../../../../../L1-modules/rust-lance-core-row-mapping.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public in-memory primitives and a private dense-counts byte codec for stable-partition row mapping: CountsMatrix, streaming builder, prefix rank, point translation and sweep translation. Labels are destination-list indices, not fragment IDs. Production label-column IO/cache ownership is outside this module. Private state prevents ordinary direct mutation but decode deliberately separates structural decoding from semantic count validation. (rust/lance-core/src/utils/stable_partition.rs:1-697)

## Complete range analysis

### Lines 1-32

License and design for reordered rewrites: one nullable u16 destination label per old physical row in caller scan order; NULL means deleted. Rows may interleave among destinations but each destination must preserve relative source order. Parallel writers must merge their output in that order. Arbitrary within-destination permutations cannot be represented by these labels alone and require explicit final offsets in another format. This is a correctness precondition rather than a runtime test here. (rust/lance-core/src/utils/stable_partition.rs:1-32)

### Lines 33-64

Cumulative counts are stored per destination at each fixed-size block end. Point translation combines count before the block with within-block exclusive prefix rank; a sequential sweep seeds all counters at a block boundary and increments by label. The block is also the documented label IO/cache unit, but that IO belongs to lance-index and is not implemented here. Approximate dense-grid footprint examples omit header/Vec overhead; exact payload size is ceil(total_rows/block_rows)*num_destinations*4. Imports supply core DeepSizeOf/Error/Result and Arrow NullBuffer. (rust/lance-core/src/utils/stable_partition.rs:33-64)

### Lines 65-86

Public defaults: DEFAULT_BLOCK_ROWS=64*1024 (65536), MAX_DESTINATIONS=u16::MAX+1 (65536). Private codec constants: magic LSPC, version1, fixed28-byte header, representation0 for dense little-endian u32 grid; unknown future tags are rejected. corrupt wraps messages as CorruptFile named stable_partition_counts. These local codec constants are not proof of a Lance dataset format version or released stability designation. (rust/lance-core/src/utils/stable_partition.rs:65-86)

### Lines 87-106

Public CountsMatrix derives Clone/Debug/PartialEq/Eq with private destination count, block rows, total old physical rows u64 (including deleted), and row-major cumulative Vec<u32>. Each matrix row is through the end of a block, unlike the exclusive count-before accessor. Deleted counts are implicit differences from physical row budgets. (rust/lance-core/src/utils/stable_partition.rs:87-106)

### Lines 107-140

Accessors return stored dimensions; num_blocks divides cumulative cell count by destination count, relying on construction/decode shape checks. block_of divides an arbitrary row by block_rows and casts to usize without range validation. block_range computes start=block*block_rows and end=min(start+block_rows,total_rows), with ordinary arithmetic and no bounds check: an invalid block can yield start>end or overflow. Private block_row slices the flattened grid and panics if its indices are invalid. (rust/lance-core/src/utils/stable_partition.rs:107-140)

### Lines 141-160

count_before(block,label) returns0 for block0 without label validation, otherwise indexes the preceding matrix row. counters_at_block similarly returns a newly allocated zero vector for block0 or clones the previous row. Both permit the end boundary block==num_blocks on a valid matrix; they do not return Result and callers own bounds validation. (rust/lance-core/src/utils/stable_partition.rs:141-160)

### Lines 161-190

total(label) returns0 for an empty matrix without checking the label, otherwise indexes the last row. total_live_rows sums that final row as u64 or returns0. deleted_through(block) subtracts the current cumulative live sum from the block end; it assumes valid monotonic/budget counts and a valid block. Using malformed decoded counts before validate can underflow ordinary arithmetic. (rust/lance-core/src/utils/stable_partition.rs:161-190)

### Lines 191-219

validate iterates all blocks, rejects any label count that decreases from the previous block, and rejects the increase in total live rows if it exceeds the current physical block length. It returns contextual CorruptFile through corrupt; The scan is O(blocks*destinations); decode leaves these content checks to a separate validate call. The source does not state the design rationale. Private shape invariants ensure complete matrix rows; validation does not compare counts against the actual label column or destination fragment metadata. (rust/lance-core/src/utils/stable_partition.rs:191-219)

### Lines 220-236

encode reserves header+cells*4 bytes and writes LSPC, version1, repr0, destination count, block_rows as little-endian u32, total_rows as little-endian u64, then every cumulative u32 in row-major order. Header offsets are0,4,8,12,16,20; payload begins28. It does not call validate or return Result; capacity arithmetic is unchecked in source. (rust/lance-core/src/utils/stable_partition.rs:220-236)

### Lines 237-263

decode first requires28 bytes, rejects wrong magic, unsupported version and representation tags other than0 via CorruptFile. Version and representation fields use exact byte slices after the header length check, so their array conversions are structurally guarded. Dimension/row-count extraction follows at rust/lance-core/src/utils/stable_partition.rs:264-266. (rust/lance-core/src/utils/stable_partition.rs:237-263)

### Lines 264-291

decode extracts destination count, block rows and total rows from little-endian header fields, then calls check_shape before division; invalid destination count or zero block rows yields InvalidInput, despite being read from persisted bytes. It computes ceil(total_rows/block_rows), checks block-count*destinations*4 for overflow and exact equality with remaining bytes, rejecting truncation and trailing bytes as CorruptFile. It reserves/reads the grid as u32 little-endian chunks and returns without validate. Structural success alone does not prove monotonic counts or per-block row budgets. (rust/lance-core/src/utils/stable_partition.rs:264-291)

### Lines 292-316

Private check_shape accepts destination counts1..=65536 and any positive block_rows; it returns descriptive InvalidInput otherwise. check_label compares a u16 label as u32 against destination count and also returns InvalidInput. The maximum valid label is65535; the default block size is advisory, not enforced. (rust/lance-core/src/utils/stable_partition.rs:292-316)

### Lines 317-334

CountsMatrix DeepSizeOf reports cumulative Vec capacity times sizeof(u32), excluding inline storage already accounted by the trait convention. Public CountsMatrixBuilder derives Debug with private shape, per-destination running u32 counters, cumulative cells, total physical-row count and rows-in-current-block. No shared mutable/concurrent state is exposed. (rust/lance-core/src/utils/stable_partition.rs:317-334)

### Lines 335-347

try_new validates shape, allocates zeroed running counters for each destination, initializes cumulative empty and both physical-row counters zero. Empty input is valid and will produce zero matrix rows at finish. (rust/lance-core/src/utils/stable_partition.rs:335-347)

### Lines 348-373

push accepts one Option<u16> per old physical row. For Some, reject out-of-range label and checked per-destination u32 increment overflow before advancing any physical counters; None only advances physical counters. total_rows increments as ordinary u64. When rows_in_block reaches block_rows, append a full snapshot of all running counters and reset rows_in_block to zero. A destination can hold at most u32::MAX rows, whose last zero-based offset is u32::MAX-1; this builder cannot represent count2^32. (rust/lance-core/src/utils/stable_partition.rs:348-373)

### Lines 374-386

finish consumes the builder, appends one final cumulative row only when the last block is partial, and moves cumulative/shape/total fields into CountsMatrix. Exact block multiples get no extra row; empty input keeps zero rows. No secondary validation pass occurs. (rust/lance-core/src/utils/stable_partition.rs:374-386)

### Lines 387-409

Public rank_label_prefix counts matching label values strictly before upto, ignoring positions invalid in NullBuffer. If validity is absent or reports no nulls, it skips per-element validity checks. Slicing values[..upto] enforces bounds by panic, not Result; no validity-length check exists, and counts cast usize to u32. In intended blocks limited to u32 rows the count fits; an arbitrary standalone oversized slice could truncate. Work is linear in prefix length with no output allocation. (rust/lance-core/src/utils/stable_partition.rs:387-409)

### Lines 410-433

translate_in_block first derives block length via block_range, then returns InvalidInput if values length differs or position is outside it. It does not separately validate the block index before block_range arithmetic. A supplied validity buffer is not length-checked. These checks establish the requested values slice size and position, not consistency of counts and labels. (rust/lance-core/src/utils/stable_partition.rs:410-433)

### Lines 434-445

For an invalid/NULL position return Ok(None) before reading or validating the underlying label, so arbitrary null payload values are allowed. Otherwise validate that label, compute count_before(block,label)+rank_label_prefix(values,validity,pos,label) using ordinary u32 addition, and return (label,offset). There is no destination-fragment-ID lookup, comparison with final destination totals, or validation that every supplied prefix label matches the stored counts. (rust/lance-core/src/utils/stable_partition.rs:434-445)

### Lines 446-468

Public SweepTranslator derives Debug and privately owns a Vec<u32> of per-destination counters. new rejects start_block >= max(num_blocks,1), allowing block0 for an empty matrix but not the end boundary for a nonempty matrix. It seeds counters from CountsMatrix::counters_at_block; only a block boundary is expressible. (rust/lance-core/src/utils/stable_partition.rs:446-468)

### Lines 469-483

advance(None) returns None and changes no counter. Some(label) checks counter-vector bounds, returns the old counter as offset and increments with ordinary u32 addition, unlike the builder's checked increment. It tracks neither processed physical rows nor remaining dataset length: an empty or exhausted sweep can accept further valid labels. Caller must feed the correct ordered row stream and avoid overflow; no matrix consistency validation happens here. (rust/lance-core/src/utils/stable_partition.rs:469-483)

### Lines 484-510

Tests use StdRng and Rng/SeedableRng traits plus the parent NullBuffer import. random_labels chooses None with probability1/8; otherwise it draws from 0..m as u32 and narrows with unchecked as u16. It does not validate m: values above u16::MAX can truncate, and m=0 supplies an empty sampling range if the non-null branch runs. Both local callers use m=5 with seeds7/42 (rust/lance-core/src/utils/stable_partition.rs:598-599; rust/lance-core/src/utils/stable_partition.rs:646-648). build uses the public builder and unwraps each fixture operation. These helpers are local; tests were inspected, not executed. (rust/lance-core/src/utils/stable_partition.rs:484-510)

### Lines 511-545

reference independently assigns monotonically increasing offsets per label using HashMap counters, preserving NULL positions. block_slices turns optional labels into a values vector with 0xBEEF garbage at NULL positions and creates a validity buffer only if any null exists. This explicitly tests null payload exclusion instead of relying on zero fill. (rust/lance-core/src/utils/stable_partition.rs:511-545)

### Lines 546-574

Hand example uses labels[0,2,NULL,2,1,1,0,2,NULL,0], three destinations and blocks of four. It validates the matrix, expects three blocks for ten physical rows and range8..10 for the last, and checks exclusive count-before values including the legal block3 end boundary. (rust/lance-core/src/utils/stable_partition.rs:546-574)

### Lines 575-595

The same fixture asserts destination totals3/2/3, total live8, deleted-through prefixes1 then2 and counters at block1=[1,0,2]. Exact first-eight-row input produces two blocks; empty input has zero blocks/rows/live/label totals and validates. These tests distinguish partial-final, exact-multiple and empty layouts. (rust/lance-core/src/utils/stable_partition.rs:575-595)

### Lines 596-633

Round trip uses seed7,1000 rows,five destinations,block64 and compares decoded equality before validate; empty also round-trips. Short bytes, corrupt magic, a one-byte truncation and repr9 fail decoding. A manually decreased cumulative cell is encoded and decoded successfully, then fails validate, demonstrating the intentional separation. Test assertions mostly check is_err, not exact categories/messages. (rust/lance-core/src/utils/stable_partition.rs:596-633)

### Lines 634-643

Builder rejects zero destinations, destination count aboveMAX_DESTINATIONS, zero block size and out-of-range label3 for m3; valid label2 then succeeds. The test does not assert exact error variants/messages, state after failed push or u32 counter overflow. (rust/lance-core/src/utils/stable_partition.rs:634-643)

### Lines 644-682

Seed42 fixture has1000 rows,five destinations,block64. Every point translation across every block is compared with the independent per-label reference using garbage null payloads; sweeps beginning at every valid block boundary are compared over the entire remaining label stream. This verifies point/sweep order agreement on one seeded mixed-null input, not arbitrary within-destination permutation support. (rust/lance-core/src/utils/stable_partition.rs:644-682)

### Lines 683-697

Input checks use one four-row block and assert errors for wrong values length, out-of-range position, live label9 for m2, invalid sweep block1 and advance label9. Although a comment calls an out-of-range data label corruption, check_label actually returns InvalidInput (rust/lance-core/src/utils/stable_partition.rs:306-314). Short validity buffers, overflow and extra sweep input are not tested here; module ends. (rust/lance-core/src/utils/stable_partition.rs:683-697)

## Interaction and interpretation limits

All 697 lines and local tests were inspected; none were executed. The comments locate label IO/cache responsibilities in lance-index, whose implementation remains pending. Do not infer a released stable file-format contract or dataset-version gate from this helper's local codec version1. Full FRI schema/reader selection and whether callers always call validate are unknown. (rust/lance-core/src/utils/stable_partition.rs:4-60; rust/lance-core/src/utils/stable_partition.rs:74-82; rust/lance-core/src/utils/stable_partition.rs:191-290) Local tests omit wrong-version decoding, excess live-row budgets, maximum destination count/overflow, short validity buffers and empty/excess-input sweeps. (rust/lance-core/src/utils/stable_partition.rs:484-697)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Stable-partition row mapping for reordered rewrites.
    5 | //!
    6 | //! A reordered rewrite (e.g. reclustering) reads `n` source fragments in scan
    7 | //! order and distributes their live rows across `m` destination fragments,
    8 | //! preserving relative row order within each destination (a stable partition).
    9 | //! Unlike compaction, the destination of a row cannot be derived from row
   10 | //! order alone, so the rewrite records one label per physical source row:
   11 | //!
   12 | //! * The label of the `i`-th physical source row (concatenated scan order) is
   13 | //!   the index of its destination in the rewrite's ordered destination list.
   14 | //! * A deleted source row is labeled NULL: it moved nowhere.
   15 | //!
   16 | //! Ordering:
   17 | //!
   18 | //! The labels do not carry destination offsets; offsets are reconstructed by
   19 | //! counting, which is only correct when the rewrite obeys all of:
   20 | //!
   21 | //! * Labels are recorded in source physical-row order: fragments in scan
   22 | //!   order, offsets ascending within each fragment.
   23 | //! * Each destination receives its rows in that same source order, and rows
   24 | //!   are never re-sorted within a destination afterwards.
   25 | //! * The ordered destination list is fixed for the whole rewrite.
   26 | //!
   27 | //! A rewrite that routes rows through parallel writers must merge each
   28 | //! destination's output back into source order before recording this
   29 | //! mapping; otherwise the derived offsets address the wrong rows.
   30 | //!
   31 | //! This contract is deliberate scope, not an oversight: the format
   32 | //! represents stable partitions only. A rewrite that sorts rows *within* a
   33 | //! destination is not representable here — with source rows `[a, b]`
   34 | //! written to one destination as `[b, a]`, both labels are equal, and
   35 | //! counting would assign the offsets backwards. Such a rewrite needs a
   36 | //! per-row final-offset (permutation) encoding, which would be a separate
   37 | //! format rather than a relaxation of this one.
   38 | //!
   39 | //! Because each destination is filled in source scan order, the destination
   40 | //! row offset of a live row equals the number of earlier source rows with the
   41 | //! same label. This module provides that arithmetic without materializing an
   42 | //! O(rows) address map:
   43 | //!
   44 | //! * [`CountsMatrix`] — for every fixed-size block of source rows, the
   45 | //!   cumulative per-label row count through the end of that block, as a
   46 | //!   dense `num_blocks * m` grid. A block is the unit of storage, IO and
   47 | //!   caching for the label column. The grid size is exact and data
   48 | //!   independent (~1.5 MB for 50M rows across 500 destinations, ~61 MB at a
   49 | //!   1B-row rewrite across 1000); the encoded header names the
   50 | //!   representation so sparser encodings can be added later without breaking
   51 | //!   readers.
   52 | //! * [`translate_in_block`] — point lookup: destination offset = cumulative
   53 | //!   count before the row's block (one array read) + the label's rank within
   54 | //!   the block prefix. Touches one block of labels.
   55 | //! * [`SweepTranslator`] — sequential translation: per-label counters seeded
   56 | //!   from a block boundary, then `offset = counter[label]++` per row. O(1)
   57 | //!   per row, used for bulk remapping and whole-unit decodes.
   58 | //!
   59 | //! Label storage and file IO live in `lance-index`; this module is pure
   60 | //! arithmetic over decoded label blocks and the counts matrix.
   61 | 
   62 | use crate::deepsize::{Context, DeepSizeOf};
   63 | use crate::{Error, Result};
   64 | use arrow_buffer::NullBuffer;
   65 | 
   66 | /// Default number of source rows per block: the counts granularity and the
   67 | /// unit of label IO.
   68 | pub const DEFAULT_BLOCK_ROWS: u32 = 64 * 1024;
   69 | 
   70 | /// Labels are u16 destination indices, so one rewrite addresses at most
   71 | /// 65536 destinations.
   72 | pub const MAX_DESTINATIONS: u32 = u16::MAX as u32 + 1;
   73 | 
   74 | const COUNTS_MAGIC: &[u8; 4] = b"LSPC";
   75 | const COUNTS_VERSION: u32 = 1;
   76 | /// magic + version + repr + num_destinations + block_rows + total_rows
   77 | const COUNTS_HEADER_BYTES: usize = 4 + 4 + 4 + 4 + 4 + 8;
   78 | /// Representation tag in the encoded header. Only the dense grid is written
   79 | /// today; other tag values are reserved for future representations (e.g.
   80 | /// per-destination sparse postings) and rejected with a clear error by
   81 | /// current readers.
   82 | const REPR_DENSE: u32 = 0;
   83 | 
   84 | fn corrupt(message: impl Into<String>) -> Error {
   85 |     Error::corrupt_file_named("stable_partition_counts", message)
   86 | }
   87 | 
   88 | /// Cumulative per-destination row counts at every block boundary.
   89 | ///
   90 | /// Row `b` of the grid holds, for each destination label `d`, the number of
   91 | /// source rows labeled `d` in blocks `0..=b`. The final row therefore holds
   92 | /// the total row count of every destination. Deleted (NULL-labeled) rows are
   93 | /// not counted; the deleted count of a block is implied by
   94 | /// `block length - sum of per-label deltas`.
   95 | #[derive(Clone, Debug, PartialEq, Eq)]
   96 | pub struct CountsMatrix {
   97 |     /// Number of destinations `m`; labels are `0..m`.
   98 |     num_destinations: u32,
   99 |     /// Source rows per block. Only the final block may be shorter.
  100 |     block_rows: u32,
  101 |     /// Total physical source rows, including deleted rows.
  102 |     total_rows: u64,
  103 |     /// `num_blocks * num_destinations` cumulative counts, row-major by block.
  104 |     cumulative: Vec<u32>,
  105 | }
  106 | 
  107 | impl CountsMatrix {
  108 |     pub fn num_destinations(&self) -> u32 {
  109 |         self.num_destinations
  110 |     }
  111 | 
  112 |     pub fn block_rows(&self) -> u32 {
  113 |         self.block_rows
  114 |     }
  115 | 
  116 |     pub fn total_rows(&self) -> u64 {
  117 |         self.total_rows
  118 |     }
  119 | 
  120 |     pub fn num_blocks(&self) -> usize {
  121 |         self.cumulative.len() / self.num_destinations as usize
  122 |     }
  123 | 
  124 |     /// The block containing physical source row `row`.
  125 |     pub fn block_of(&self, row: u64) -> usize {
  126 |         (row / u64::from(self.block_rows)) as usize
  127 |     }
  128 | 
  129 |     /// The physical source row range covered by `block`.
  130 |     pub fn block_range(&self, block: usize) -> std::ops::Range<u64> {
  131 |         let start = block as u64 * u64::from(self.block_rows);
  132 |         let end = (start + u64::from(self.block_rows)).min(self.total_rows);
  133 |         start..end
  134 |     }
  135 | 
  136 |     fn block_row(&self, block: usize) -> &[u32] {
  137 |         let m = self.num_destinations as usize;
  138 |         &self.cumulative[block * m..(block + 1) * m]
  139 |     }
  140 | 
  141 |     /// Rows labeled `label` in blocks before `block`: the destination offset
  142 |     /// of the first `label`-row inside `block`.
  143 |     pub fn count_before(&self, block: usize, label: u16) -> u32 {
  144 |         if block == 0 {
  145 |             0
  146 |         } else {
  147 |             self.block_row(block - 1)[label as usize]
  148 |         }
  149 |     }
  150 | 
  151 |     /// Per-label counters at the start of `block`, seeding a
  152 |     /// [`SweepTranslator`].
  153 |     pub fn counters_at_block(&self, block: usize) -> Vec<u32> {
  154 |         if block == 0 {
  155 |             vec![0; self.num_destinations as usize]
  156 |         } else {
  157 |             self.block_row(block - 1).to_vec()
  158 |         }
  159 |     }
  160 | 
  161 |     /// Total rows of destination `label`; the final cumulative row.
  162 |     pub fn total(&self, label: u16) -> u32 {
  163 |         let blocks = self.num_blocks();
  164 |         if blocks == 0 {
  165 |             0
  166 |         } else {
  167 |             self.block_row(blocks - 1)[label as usize]
  168 |         }
  169 |     }
  170 | 
  171 |     /// Total live (labeled) rows across all destinations.
  172 |     pub fn total_live_rows(&self) -> u64 {
  173 |         let blocks = self.num_blocks();
  174 |         if blocks == 0 {
  175 |             0
  176 |         } else {
  177 |             self.block_row(blocks - 1)
  178 |                 .iter()
  179 |                 .map(|&c| u64::from(c))
  180 |                 .sum()
  181 |         }
  182 |     }
  183 | 
  184 |     /// Deleted (NULL-labeled) rows in blocks `0..=block`.
  185 |     pub fn deleted_through(&self, block: usize) -> u64 {
  186 |         let rows_through = self.block_range(block).end;
  187 |         let live_through: u64 = self.block_row(block).iter().map(|&c| u64::from(c)).sum();
  188 |         rows_through - live_through
  189 |     }
  190 | 
  191 |     /// Check internal consistency: per-label counts must be non-decreasing
  192 |     /// across blocks and each block's live rows must fit its row range.
  193 |     /// O(num_blocks * num_destinations), no label IO. Called when a row map
  194 |     /// is opened, so a corrupt counts buffer fails loudly instead of
  195 |     /// translating rows to wrong addresses.
  196 |     pub fn validate(&self) -> Result<()> {
  197 |         let mut prev_live = 0u64;
  198 |         for block in 0..self.num_blocks() {
  199 |             if block > 0 {
  200 |                 let (prev, cur) = (self.block_row(block - 1), self.block_row(block));
  201 |                 if prev.iter().zip(cur).any(|(p, c)| c < p) {
  202 |                     return Err(corrupt(format!(
  203 |                         "cumulative counts decrease at block {block}"
  204 |                     )));
  205 |                 }
  206 |             }
  207 |             let live_through: u64 = self.block_row(block).iter().map(|&c| u64::from(c)).sum();
  208 |             let range = self.block_range(block);
  209 |             let block_len = range.end - range.start;
  210 |             if live_through - prev_live > block_len {
  211 |                 return Err(corrupt(format!(
  212 |                     "block {block} accounts for more live rows than its {block_len} rows"
  213 |                 )));
  214 |             }
  215 |             prev_live = live_through;
  216 |         }
  217 |         Ok(())
  218 |     }
  219 | 
  220 |     /// Serialize to the on-disk form stored in the row map file's global
  221 |     /// buffer: a fixed header naming the representation, then the cumulative
  222 |     /// counts as little-endian u32.
  223 |     pub fn encode(&self) -> Vec<u8> {
  224 |         let mut buf = Vec::with_capacity(COUNTS_HEADER_BYTES + self.cumulative.len() * 4);
  225 |         buf.extend_from_slice(COUNTS_MAGIC);
  226 |         buf.extend_from_slice(&COUNTS_VERSION.to_le_bytes());
  227 |         buf.extend_from_slice(&REPR_DENSE.to_le_bytes());
  228 |         buf.extend_from_slice(&self.num_destinations.to_le_bytes());
  229 |         buf.extend_from_slice(&self.block_rows.to_le_bytes());
  230 |         buf.extend_from_slice(&self.total_rows.to_le_bytes());
  231 |         for count in &self.cumulative {
  232 |             buf.extend_from_slice(&count.to_le_bytes());
  233 |         }
  234 |         buf
  235 |     }
  236 | 
  237 |     /// Decode the on-disk form, checking structure exactly: magic, version, a
  238 |     /// supported representation, shape legality and precise payload length.
  239 |     /// Content invariants (monotone counts, per-block row budgets) are
  240 |     /// checked by [`Self::validate`].
  241 |     pub fn decode(buf: &[u8]) -> Result<Self> {
  242 |         let header: &[u8; COUNTS_HEADER_BYTES] = buf
  243 |             .get(..COUNTS_HEADER_BYTES)
  244 |             .and_then(|header| header.try_into().ok())
  245 |             .ok_or_else(|| {
  246 |                 corrupt(format!(
  247 |                     "counts buffer is {} bytes, shorter than the {COUNTS_HEADER_BYTES}-byte header",
  248 |                     buf.len()
  249 |                 ))
  250 |             })?;
  251 |         if &header[0..4] != COUNTS_MAGIC {
  252 |             return Err(corrupt("counts buffer has a bad magic number"));
  253 |         }
  254 |         let version = u32::from_le_bytes(header[4..8].try_into().unwrap());
  255 |         if version != COUNTS_VERSION {
  256 |             return Err(corrupt(format!("unsupported counts version {version}")));
  257 |         }
  258 |         let repr = u32::from_le_bytes(header[8..12].try_into().unwrap());
  259 |         if repr != REPR_DENSE {
  260 |             return Err(corrupt(format!(
  261 |                 "unsupported counts representation {repr}; this reader only supports the dense grid ({REPR_DENSE})"
  262 |             )));
  263 |         }
  264 |         let num_destinations = u32::from_le_bytes(header[12..16].try_into().unwrap());
  265 |         let block_rows = u32::from_le_bytes(header[16..20].try_into().unwrap());
  266 |         let total_rows = u64::from_le_bytes(header[20..28].try_into().unwrap());
  267 |         Self::check_shape(num_destinations, block_rows)?;
  268 |         let num_blocks = total_rows.div_ceil(u64::from(block_rows));
  269 |         num_blocks
  270 |             .checked_mul(u64::from(num_destinations))
  271 |             .and_then(|cells| cells.checked_mul(4))
  272 |             .filter(|&bytes| bytes == (buf.len() - COUNTS_HEADER_BYTES) as u64)
  273 |             .ok_or_else(|| {
  274 |                 corrupt(format!(
  275 |                     "counts buffer of {} bytes does not match {num_blocks} blocks of {num_destinations} destinations",
  276 |                     buf.len()
  277 |                 ))
  278 |             })?;
  279 |         let mut cumulative =
  280 |             Vec::with_capacity((num_blocks * u64::from(num_destinations)) as usize);
  281 |         for chunk in buf[COUNTS_HEADER_BYTES..].as_chunks::<4>().0 {
  282 |             cumulative.push(u32::from_le_bytes(*chunk));
  283 |         }
  284 |         Ok(Self {
  285 |             num_destinations,
  286 |             block_rows,
  287 |             total_rows,
  288 |             cumulative,
  289 |         })
  290 |     }
  291 | 
  292 |     fn check_shape(num_destinations: u32, block_rows: u32) -> Result<()> {
  293 |         if num_destinations == 0 || num_destinations > MAX_DESTINATIONS {
  294 |             return Err(Error::invalid_input(format!(
  295 |                 "stable partition needs 1..={MAX_DESTINATIONS} destinations, got {num_destinations}"
  296 |             )));
  297 |         }
  298 |         if block_rows == 0 {
  299 |             return Err(Error::invalid_input(
  300 |                 "stable partition block_rows must be positive",
  301 |             ));
  302 |         }
  303 |         Ok(())
  304 |     }
  305 | 
  306 |     fn check_label(&self, label: u16) -> Result<()> {
  307 |         if u32::from(label) >= self.num_destinations {
  308 |             return Err(Error::invalid_input(format!(
  309 |                 "label {label} is outside the {} destinations of this stable partition",
  310 |                 self.num_destinations
  311 |             )));
  312 |         }
  313 |         Ok(())
  314 |     }
  315 | }
  316 | 
  317 | impl DeepSizeOf for CountsMatrix {
  318 |     fn deep_size_of_children(&self, _: &mut Context) -> usize {
  319 |         self.cumulative.capacity() * std::mem::size_of::<u32>()
  320 |     }
  321 | }
  322 | 
  323 | /// Streaming builder for a [`CountsMatrix`]: feed one label per physical
  324 | /// source row in scan order.
  325 | #[derive(Debug)]
  326 | pub struct CountsMatrixBuilder {
  327 |     num_destinations: u32,
  328 |     block_rows: u32,
  329 |     running: Vec<u32>,
  330 |     cumulative: Vec<u32>,
  331 |     total_rows: u64,
  332 |     rows_in_block: u32,
  333 | }
  334 | 
  335 | impl CountsMatrixBuilder {
  336 |     pub fn try_new(num_destinations: u32, block_rows: u32) -> Result<Self> {
  337 |         CountsMatrix::check_shape(num_destinations, block_rows)?;
  338 |         Ok(Self {
  339 |             num_destinations,
  340 |             block_rows,
  341 |             running: vec![0; num_destinations as usize],
  342 |             cumulative: Vec::new(),
  343 |             total_rows: 0,
  344 |             rows_in_block: 0,
  345 |         })
  346 |     }
  347 | 
  348 |     /// Record the label of the next physical source row; `None` marks a
  349 |     /// deleted row.
  350 |     pub fn push(&mut self, label: Option<u16>) -> Result<()> {
  351 |         if let Some(label) = label {
  352 |             if u32::from(label) >= self.num_destinations {
  353 |                 return Err(Error::invalid_input(format!(
  354 |                     "label {label} is outside the {} destinations of this stable partition",
  355 |                     self.num_destinations
  356 |                 )));
  357 |             }
  358 |             let counter = &mut self.running[label as usize];
  359 |             *counter = counter.checked_add(1).ok_or_else(|| {
  360 |                 Error::invalid_input(format!(
  361 |                     "destination {label} exceeds the u32 row-offset range"
  362 |                 ))
  363 |             })?;
  364 |         }
  365 |         self.total_rows += 1;
  366 |         self.rows_in_block += 1;
  367 |         if self.rows_in_block == self.block_rows {
  368 |             self.cumulative.extend_from_slice(&self.running);
  369 |             self.rows_in_block = 0;
  370 |         }
  371 |         Ok(())
  372 |     }
  373 | 
  374 |     pub fn finish(mut self) -> CountsMatrix {
  375 |         if self.rows_in_block > 0 {
  376 |             self.cumulative.extend_from_slice(&self.running);
  377 |         }
  378 |         CountsMatrix {
  379 |             num_destinations: self.num_destinations,
  380 |             block_rows: self.block_rows,
  381 |             total_rows: self.total_rows,
  382 |             cumulative: self.cumulative,
  383 |         }
  384 |     }
  385 | }
  386 | 
  387 | /// Rank of `label` among the first `upto` labels of a block: the number of
  388 | /// valid entries equal to `label` in `values[..upto]`.
  389 | pub fn rank_label_prefix(
  390 |     values: &[u16],
  391 |     validity: Option<&NullBuffer>,
  392 |     upto: usize,
  393 |     label: u16,
  394 | ) -> u32 {
  395 |     match validity {
  396 |         // NULL slots hold arbitrary values after an encoding round trip, so
  397 |         // they must be masked out of the count.
  398 |         Some(validity) if validity.null_count() > 0 => values[..upto]
  399 |             .iter()
  400 |             .enumerate()
  401 |             .filter(|&(i, &value)| value == label && validity.is_valid(i))
  402 |             .count() as u32,
  403 |         _ => values[..upto]
  404 |             .iter()
  405 |             .filter(|&&value| value == label)
  406 |             .count() as u32,
  407 |     }
  408 | }
  409 | 
  410 | /// Translate one physical source row using its decoded label block.
  411 | ///
  412 | /// `values`/`validity` are the labels of `block` (exactly the rows of
  413 | /// [`CountsMatrix::block_range`]); `pos_in_block` addresses the row within
  414 | /// them. Returns `None` when the row was deleted at the source, otherwise
  415 | /// `(destination index, destination row offset)`.
  416 | pub fn translate_in_block(
  417 |     counts: &CountsMatrix,
  418 |     block: usize,
  419 |     values: &[u16],
  420 |     validity: Option<&NullBuffer>,
  421 |     pos_in_block: usize,
  422 | ) -> Result<Option<(u16, u32)>> {
  423 |     let block_range = counts.block_range(block);
  424 |     let block_len = (block_range.end - block_range.start) as usize;
  425 |     if values.len() != block_len {
  426 |         return Err(Error::invalid_input(format!(
  427 |             "block {block} holds {block_len} labels but {} were supplied",
  428 |             values.len()
  429 |         )));
  430 |     }
  431 |     if pos_in_block >= block_len {
  432 |         return Err(Error::invalid_input(format!(
  433 |             "row {pos_in_block} is outside block {block} of {block_len} rows"
  434 |         )));
  435 |     }
  436 |     if validity.is_some_and(|validity| !validity.is_valid(pos_in_block)) {
  437 |         return Ok(None);
  438 |     }
  439 |     let label = values[pos_in_block];
  440 |     counts.check_label(label)?;
  441 |     let offset = counts.count_before(block, label)
  442 |         + rank_label_prefix(values, validity, pos_in_block, label);
  443 |     Ok(Some((label, offset)))
  444 | }
  445 | 
  446 | /// Sequential translator: seed per-label counters from a block boundary, then
  447 | /// feed every physical source row's label in order.
  448 | #[derive(Debug)]
  449 | pub struct SweepTranslator {
  450 |     counters: Vec<u32>,
  451 | }
  452 | 
  453 | impl SweepTranslator {
  454 |     /// Counters positioned at the first row of `start_block`.
  455 |     pub fn new(counts: &CountsMatrix, start_block: usize) -> Result<Self> {
  456 |         if start_block >= counts.num_blocks().max(1) {
  457 |             return Err(Error::invalid_input(format!(
  458 |                 "start block {start_block} is outside the {} blocks of this stable partition",
  459 |                 counts.num_blocks()
  460 |             )));
  461 |         }
  462 |         Ok(Self {
  463 |             counters: counts.counters_at_block(start_block),
  464 |         })
  465 |     }
  466 | 
  467 |     /// Translate the next row. `None` in, `None` out for deleted rows.
  468 |     #[inline]
  469 |     pub fn advance(&mut self, label: Option<u16>) -> Result<Option<(u16, u32)>> {
  470 |         let Some(label) = label else {
  471 |             return Ok(None);
  472 |         };
  473 |         let counter = self.counters.get_mut(label as usize).ok_or_else(|| {
  474 |             Error::invalid_input(format!(
  475 |                 "label {label} is outside the destinations of this stable partition"
  476 |             ))
  477 |         })?;
  478 |         let offset = *counter;
  479 |         *counter += 1;
  480 |         Ok(Some((label, offset)))
  481 |     }
  482 | }
  483 | 
  484 | #[cfg(test)]
  485 | mod tests {
  486 |     use super::*;
  487 |     use rand::rngs::StdRng;
  488 |     use rand::{Rng, SeedableRng};
  489 | 
  490 |     /// ~1/8 deleted rows, labels uniform over `m`.
  491 |     fn random_labels(rng: &mut StdRng, rows: usize, m: u32) -> Vec<Option<u16>> {
  492 |         (0..rows)
  493 |             .map(|_| {
  494 |                 if rng.random_ratio(1, 8) {
  495 |                     None
  496 |                 } else {
  497 |                     Some(rng.random_range(0..m) as u16)
  498 |                 }
  499 |             })
  500 |             .collect()
  501 |     }
  502 | 
  503 |     fn build(labels: &[Option<u16>], m: u32, block_rows: u32) -> CountsMatrix {
  504 |         let mut builder = CountsMatrixBuilder::try_new(m, block_rows).unwrap();
  505 |         for &label in labels {
  506 |             builder.push(label).unwrap();
  507 |         }
  508 |         builder.finish()
  509 |     }
  510 | 
  511 |     /// Reference translation: scan all labels with per-destination counters.
  512 |     fn reference(labels: &[Option<u16>]) -> Vec<Option<(u16, u32)>> {
  513 |         let mut counters = std::collections::HashMap::new();
  514 |         labels
  515 |             .iter()
  516 |             .map(|label| {
  517 |                 label.map(|label| {
  518 |                     let counter = counters.entry(label).or_insert(0u32);
  519 |                     let offset = *counter;
  520 |                     *counter += 1;
  521 |                     (label, offset)
  522 |                 })
  523 |             })
  524 |             .collect()
  525 |     }
  526 | 
  527 |     fn block_slices(
  528 |         labels: &[Option<u16>],
  529 |         counts: &CountsMatrix,
  530 |         block: usize,
  531 |     ) -> (Vec<u16>, Option<NullBuffer>) {
  532 |         let range = counts.block_range(block);
  533 |         let block_labels = &labels[range.start as usize..range.end as usize];
  534 |         // NULL slots get a garbage value on purpose: after an encoding round
  535 |         // trip their contents are undefined and must not affect ranks.
  536 |         let values = block_labels
  537 |             .iter()
  538 |             .map(|label| label.unwrap_or(0xBEEF_u64 as u16))
  539 |             .collect();
  540 |         let has_nulls = block_labels.iter().any(Option::is_none);
  541 |         let validity =
  542 |             has_nulls.then(|| NullBuffer::from_iter(block_labels.iter().map(Option::is_some)));
  543 |         (values, validity)
  544 |     }
  545 | 
  546 |     #[test]
  547 |     fn test_counts_matrix_hand_example() {
  548 |         // 10 rows, block_rows=4 -> blocks of 4, 4, 2. m=3, and destination 1
  549 |         // receives nothing in blocks 0 and 2.
  550 |         let labels = [
  551 |             Some(0),
  552 |             Some(2),
  553 |             None,
  554 |             Some(2), // block 0: d0=1, d2=2, 1 deleted
  555 |             Some(1),
  556 |             Some(1),
  557 |             Some(0),
  558 |             Some(2), // block 1: cum d0=2, d1=2, d2=3
  559 |             None,
  560 |             Some(0), // block 2: cum d0=3, d1=2, d2=3, 2 deleted total
  561 |         ];
  562 |         let counts = build(&labels, 3, 4);
  563 |         counts.validate().unwrap();
  564 |         assert_eq!(counts.num_blocks(), 3);
  565 |         assert_eq!(counts.total_rows(), 10);
  566 |         assert_eq!(counts.block_range(2), 8..10);
  567 | 
  568 |         assert_eq!(counts.count_before(0, 2), 0);
  569 |         assert_eq!(counts.count_before(1, 2), 2);
  570 |         assert_eq!(counts.count_before(2, 0), 2);
  571 |         // Destination 1 received nothing in blocks 0 and 2: lookups around
  572 |         // the gap see the count of its last change (or 0).
  573 |         assert_eq!(counts.count_before(1, 1), 0);
  574 |         assert_eq!(counts.count_before(3, 1), 2);
  575 |         assert_eq!(
  576 |             (counts.total(0), counts.total(1), counts.total(2)),
  577 |             (3, 2, 3)
  578 |         );
  579 |         assert_eq!(counts.total_live_rows(), 8);
  580 |         assert_eq!(counts.deleted_through(0), 1);
  581 |         assert_eq!(counts.deleted_through(2), 2);
  582 |         assert_eq!(counts.counters_at_block(1), vec![1, 0, 2]);
  583 | 
  584 |         // Exact multiple of block_rows: no partial block.
  585 |         let exact = build(&labels[..8], 3, 4);
  586 |         assert_eq!(exact.num_blocks(), 2);
  587 |         assert_eq!(exact.total_rows(), 8);
  588 | 
  589 |         let empty = build(&[], 3, 4);
  590 |         assert_eq!(empty.num_blocks(), 0);
  591 |         assert_eq!(empty.total(1), 0);
  592 |         assert_eq!(empty.total_live_rows(), 0);
  593 |         empty.validate().unwrap();
  594 |     }
  595 | 
  596 |     #[test]
  597 |     fn test_encode_decode_round_trip() {
  598 |         let mut rng = StdRng::seed_from_u64(7);
  599 |         let labels = random_labels(&mut rng, 1000, 5);
  600 |         let counts = build(&labels, 5, 64);
  601 |         let decoded = CountsMatrix::decode(&counts.encode()).unwrap();
  602 |         assert_eq!(decoded, counts);
  603 |         decoded.validate().unwrap();
  604 | 
  605 |         let empty = build(&[], 5, 64);
  606 |         assert_eq!(CountsMatrix::decode(&empty.encode()).unwrap(), empty);
  607 | 
  608 |         // Structural corruption is caught at decode: too short, bad magic,
  609 |         // truncated payload, unknown representation tag.
  610 |         assert!(CountsMatrix::decode(&[]).is_err());
  611 |         let mut bad_magic = counts.encode();
  612 |         bad_magic[0] = b'X';
  613 |         assert!(CountsMatrix::decode(&bad_magic).is_err());
  614 |         let mut truncated = counts.encode();
  615 |         truncated.pop();
  616 |         assert!(CountsMatrix::decode(&truncated).is_err());
  617 |         let mut bad_repr = counts.encode();
  618 |         bad_repr[8] = 9;
  619 |         assert!(CountsMatrix::decode(&bad_repr).is_err());
  620 | 
  621 |         // Content corruption is caught by validate: shrink a later block's
  622 |         // cumulative count below an earlier one.
  623 |         let mut decreasing = counts;
  624 |         let m = decreasing.num_destinations as usize;
  625 |         decreasing.cumulative[m] = 0;
  626 |         assert!(
  627 |             CountsMatrix::decode(&decreasing.encode())
  628 |                 .unwrap()
  629 |                 .validate()
  630 |                 .is_err()
  631 |         );
  632 |     }
  633 | 
  634 |     #[test]
  635 |     fn test_builder_rejects_bad_shapes_and_labels() {
  636 |         assert!(CountsMatrixBuilder::try_new(0, 64).is_err());
  637 |         assert!(CountsMatrixBuilder::try_new(MAX_DESTINATIONS + 1, 64).is_err());
  638 |         assert!(CountsMatrixBuilder::try_new(1, 0).is_err());
  639 |         let mut builder = CountsMatrixBuilder::try_new(3, 4).unwrap();
  640 |         assert!(builder.push(Some(3)).is_err());
  641 |         assert!(builder.push(Some(2)).is_ok());
  642 |     }
  643 | 
  644 |     #[test]
  645 |     fn test_point_and_sweep_match_reference() {
  646 |         let m = 5u32;
  647 |         let mut rng = StdRng::seed_from_u64(42);
  648 |         let labels = random_labels(&mut rng, 1000, m);
  649 |         let counts = build(&labels, m, 64);
  650 |         counts.validate().unwrap();
  651 |         let expected = reference(&labels);
  652 | 
  653 |         // Point lookups, block by block, against the reference map.
  654 |         for block in 0..counts.num_blocks() {
  655 |             let (values, validity) = block_slices(&labels, &counts, block);
  656 |             let range = counts.block_range(block);
  657 |             for pos in 0..(range.end - range.start) as usize {
  658 |                 let translated =
  659 |                     translate_in_block(&counts, block, &values, validity.as_ref(), pos).unwrap();
  660 |                 assert_eq!(
  661 |                     translated,
  662 |                     expected[range.start as usize + pos],
  663 |                     "row {}",
  664 |                     range.start as usize + pos
  665 |                 );
  666 |             }
  667 |         }
  668 | 
  669 |         // A sweep from the start and one from every block boundary.
  670 |         for start_block in 0..counts.num_blocks() {
  671 |             let mut sweep = SweepTranslator::new(&counts, start_block).unwrap();
  672 |             let start_row = counts.block_range(start_block).start as usize;
  673 |             for (row, &label) in labels.iter().enumerate().skip(start_row) {
  674 |                 assert_eq!(
  675 |                     sweep.advance(label).unwrap(),
  676 |                     expected[row],
  677 |                     "row {row} from block {start_block}"
  678 |                 );
  679 |             }
  680 |         }
  681 |     }
  682 | 
  683 |     #[test]
  684 |     fn test_translate_in_block_input_checks() {
  685 |         let labels = [Some(0), Some(1), None, Some(0)];
  686 |         let counts = build(&labels, 2, 4);
  687 |         let (values, validity) = block_slices(&labels, &counts, 0);
  688 |         // Wrong slice length and out-of-range row are rejected.
  689 |         assert!(translate_in_block(&counts, 0, &values[..3], None, 0).is_err());
  690 |         assert!(translate_in_block(&counts, 0, &values, validity.as_ref(), 4).is_err());
  691 |         // A label outside the destination list is data corruption.
  692 |         assert!(translate_in_block(&counts, 0, &[0, 9, 0, 0], None, 1).is_err());
  693 |         assert!(SweepTranslator::new(&counts, 1).is_err());
  694 |         let mut sweep = SweepTranslator::new(&counts, 0).unwrap();
  695 |         assert!(sweep.advance(Some(9)).is_err());
  696 |     }
  697 | }
``````
