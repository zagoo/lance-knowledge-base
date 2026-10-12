> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-table/src/rowids/runs.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `81f828bb3cd38e28bb7df3e3957d04c5f8ed320ab593552f2d48aeab8bbf0f1f`. Reviewed physical lines: 1-325.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Private-module HoleRuns encoding of missing u32 offsets, validated construction, rank/select conversion and batched present-value expansion. (rust/lance-table/src/rowids/runs.rs:1-325)

## Complete range analysis

### Lines 1-13

SPDX/module docs identify run-length holes for U64Segment::Ranges; imports Range,Result,DeepSizeOf, sibling Bitmap and corrupt_row_id_metadata. runs is a private child module with no facade reexport (rust/lance-table/src/rowids.rs:17-24); pub declarations here are not a publicly nameable module route. Error helper returns CorruptFile named row ID metadata (rust/lance-table/src/rowids/serde.rs:13-17). (rust/lance-table/src/rowids/runs.rs:1-13)

### Lines 14-35

HoleRuns derives Debug/Clone/PartialEq/Eq/DeepSizeOf with private span:u32, starts:Vec<u32> and present_before:Vec<u32>. Offsets are relative to enclosing range base. present_before[k] counts present offsets before missing run k; terminal element counts all present. Ends are reconstructed, not retained. Doc8 bytes/run compares raw two-u32 arrays, not Vec capacity/struct overhead or serialized wire size; storage also has one terminal u32. (rust/lance-table/src/rowids/runs.rs:14-35)

### Lines 36-61

try_new(span,starts,ends) first rejects differing list lengths, then each empty/reversed run and end>span through corrupt metadata error with lengths/index/bounds. Allocates present_before capacity starts.len()+1 and tracks total missing and previous end. Zero span with no runs is valid; a nonempty run in it fails. (rust/lance-table/src/rowids/runs.rs:36-61)

### Lines 62-82

Reject previous_end>=start, covering unsorted, overlapping and adjacent runs; adjacency is invalid because runs must be maximal. Append start-missing before each hole, add end-start and finally span-total_missing. Valid disjoint bounded runs make u32 subtraction/addition fit; starts.len()+1/capacity allocation remain ordinary usize operations. Returns owned starts/prefix table, dropping input ends. No external bitmap/IO needed. (rust/lance-table/src/rowids/runs.rs:62-82)

### Lines 83-105

from_bitmap assumes bitmap.len fits u32 but does not checked-convert it. Iterates bytes with valid_bits=min(span-offset,8); ORs bits beyond logical length to present via checked_shl so padding cannot open a hole. All-present byte closes an open run at byte start; all-missing byte opens/continues a run. The compacted-table byte distribution is a performance rationale in comments, not measured here. (rust/lance-table/src/rowids/runs.rs:83-105)

### Lines 106-131

Mixed bytes scan valid low-order bits, opening missing and closing present transitions at offset+bit. Advance offset8 and stop once>=span, then close a trailing hole at span. Cast all bounds to u32 and call try_new(...).expect; violating length/bitmap assumptions can truncate or panic. Two temporary bounds vectors coexist with constructed prefix vector; no unsafe block. Under valid input cost O(bytes+edge bits+runs). (rust/lance-table/src/rowids/runs.rs:106-131)

### Lines 132-155

num_runs returns starts.len; present_len directly indexes terminal prefix. Private start_or_span returns supplied run start or span sentinel; missing_before(k)=start_or_span(k)-present_before[k]; end(k)=starts[k]+missing_before(k+1)-missing_before(k). These O(1) helpers assume constructor invariants and valid private indices. (rust/lance-table/src/rowids/runs.rs:132-155)

### Lines 156-172

position(offset) rejects offset>=span, upper-bounds starts<=offset, rejects membership in preceding missing run, otherwise subtracts missing_before(k) to produce present ordinal. runs_before_position upper-bounds present_before excluding terminal by <=position; this skips missing runs before the selected present value. Partition operations are O(log number of runs) under sorted invariants. (rust/lance-table/src/rowids/runs.rs:156-172)

### Lines 173-181

offset_at(position) rejects position>=total present, counts preceding runs and returns position+missing_before(k). It is inverse of position for present offsets under validated state; empty/all-missing spans return None for every input. No Result/error for out-of-range lookup. (rust/lance-table/src/rowids/runs.rs:173-181)

### Lines 182-191

present_ranges lazily iterates k=0..=num_runs, constructs gap from0 or preceding hole end to next hole start/span, and filters empty gaps. Returns a borrowing DoubleEndedIterator; leading/trailing holes disappear naturally and no per-offset Vec is allocated. (rust/lance-table/src/rowids/runs.rs:182-191)

### Lines 192-216

extend_values appends base+offset for an ordinal Range<u32>. Silently clamps end to present_len; start>=clamped end/reversed range emits nothing. One upper-bound search locates initial gap, then walks gaps, appending contiguous u64 ranges and advancing ordinal position. Existing Vec contents remain. Ordinary base+offset+length arithmetic can overflow, including exclusive endpoint when a final actual value would be u64::MAX; no checked error channel. Runtime cost O(log runs+visited gaps+emitted values), plus Vec growth. (rust/lance-table/src/rowids/runs.rs:192-216)

### Lines 217-242

cfg(test) helper span20 holes3..7 and8..15; counts/ranges test asserts11missing/9present, reconstructed ends[7,15], and present gaps[0..3,7..8,15..20] in forward and reversed order. (rust/lance-table/src/rowids/runs.rs:217-242)

### Lines 243-265

Rank/select fixture materializes exact present offsets[0,1,2,7,15,16,17,18,19], asserts both lookup directions for all nine, and None for listed missing/out-of-range offsets3,4,6,8,14,20,100 plus ordinal9. (rust/lance-table/src/rowids/runs.rs:243-265)

### Lines 266-279

Expansion fixture with base100 checks ordinal1..7 ->[101,102,107,115,116,117], clipped4..40 ->[115..119], and9..12 ->empty. It clears the vector between calls, so append preservation is implementation-derived, not tested here. (rust/lance-table/src/rowids/runs.rs:266-279)

### Lines 280-310

Bitmap conversion matrix uses lengths20,1,9,17,64,70 and explicit cleared sets covering clustered/all/none/edge bits. Reconstructs every missing offset using position, compares to cleared list, checks total missing and strictly separated runs. No zero-length or wider-than-u32 fixture. Tests read only. (rust/lance-table/src/rowids/runs.rs:280-310)

### Lines 311-325

Malformed-constructor cases are unequal counts, empty run,beyond span,overlap,adjacency. Each asserts returned diagnostic contains Ranges, without asserting CorruptFile variant. No separate reverse-order/reversed-range, arithmetic-max or base overflow fixture locally. (rust/lance-table/src/rowids/runs.rs:311-325)

## Interaction and interpretation limits

All325 lines fully read. Parent routing and corruption helper are now covered in the fully analyzed rowids.rs and serde.rs. HoleRuns methods are pub in a private module; bitmap storage and wire serde are now covered at rust/lance-table/src/rowids/bitmap.rs:1-358 and rust/lance-table/src/rowids/serde.rs:1-884. Segment selection is now covered at rust/lance-table/src/rowids/segment.rs:245-289; local sequence behavior is covered at rust/lance-table/src/rowids.rs:1-2309; full transaction integration remains pending. Source-derived costs/counterexamples are not executed benchmark or test results.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Run-length encoded holes of a [`U64Segment::Ranges`](super::U64Segment).
    5 | 
    6 | use std::ops::Range;
    7 | 
    8 | use lance_core::Result;
    9 | use lance_core::deepsize::DeepSizeOf;
   10 | 
   11 | use super::bitmap::Bitmap;
   12 | use super::serde::corrupt_row_id_metadata;
   13 | 
   14 | /// The missing offsets of a range, as maximal runs.
   15 | ///
   16 | /// Offsets are relative to the range start and fit `u32`, which bounds the span
   17 | /// of a range this encoding can describe to `u32::MAX`; a fragment never holds
   18 | /// more rows than that, and writers fall back to another encoding for wider
   19 | /// spans. Compared to a bitmap this costs 8 bytes per run rather than one bit
   20 | /// per offset, so it pays off exactly when deletions cluster, as they do after
   21 | /// compaction of fragments with deleted rows.
   22 | #[derive(Debug, Clone, PartialEq, Eq, DeepSizeOf)]
   23 | pub struct HoleRuns {
   24 |     /// Length of the range the runs live in (offsets are below this).
   25 |     span: u32,
   26 |     /// First missing offset of each run, strictly increasing.
   27 |     starts: Vec<u32>,
   28 |     /// `present_before[k]` is the number of present offsets before run `k`;
   29 |     /// the final entry (index `num_runs`) is the number present in total. Run
   30 |     /// ends follow from it: the offsets missing before run `k` are
   31 |     /// `starts[k] - present_before[k]`, and a run is as long as the missing
   32 |     /// count grows across it.
   33 |     present_before: Vec<u32>,
   34 | }
   35 | 
   36 | impl HoleRuns {
   37 |     /// Build from run bounds. Rejects runs that are empty, out of order,
   38 |     /// overlapping, adjacent (a maximal run never touches the next) or beyond
   39 |     /// `span`.
   40 |     pub fn try_new(span: u32, starts: Vec<u32>, ends: Vec<u32>) -> Result<Self> {
   41 |         if starts.len() != ends.len() {
   42 |             return Err(corrupt_row_id_metadata(format!(
   43 |                 "Ranges has {} run starts but {} run ends",
   44 |                 starts.len(),
   45 |                 ends.len()
   46 |             )));
   47 |         }
   48 |         let mut present_before = Vec::with_capacity(starts.len() + 1);
   49 |         let mut missing: u32 = 0;
   50 |         let mut previous_end: Option<u32> = None;
   51 |         for (i, (&start, &end)) in starts.iter().zip(&ends).enumerate() {
   52 |             if start >= end {
   53 |                 return Err(corrupt_row_id_metadata(format!(
   54 |                     "Ranges run {i} is empty or reversed: {start}..{end}"
   55 |                 )));
   56 |             }
   57 |             if end > span {
   58 |                 return Err(corrupt_row_id_metadata(format!(
   59 |                     "Ranges run {i} ({start}..{end}) ends beyond the span {span}"
   60 |                 )));
   61 |             }
   62 |             if let Some(previous_end) = previous_end
   63 |                 && previous_end >= start
   64 |             {
   65 |                 return Err(corrupt_row_id_metadata(format!(
   66 |                     "Ranges run {i} starts at {start}, but the previous run ends at \
   67 |                      {previous_end}: runs must be sorted, disjoint and non-adjacent"
   68 |                 )));
   69 |             }
   70 |             present_before.push(start - missing);
   71 |             // Disjoint runs below `span` cannot miss more than `span` offsets.
   72 |             missing += end - start;
   73 |             previous_end = Some(end);
   74 |         }
   75 |         present_before.push(span - missing);
   76 |         Ok(Self {
   77 |             span,
   78 |             starts,
   79 |             present_before,
   80 |         })
   81 |     }
   82 | 
   83 |     /// The runs of cleared bits of `bitmap`, whose length must fit `u32`.
   84 |     ///
   85 |     /// Walks bytes rather than bits: on a compacted table almost every byte is
   86 |     /// all-present or all-missing, and the bit loop only runs at run edges.
   87 |     pub fn from_bitmap(bitmap: &Bitmap) -> Self {
   88 |         let span = bitmap.len();
   89 |         let mut starts = Vec::new();
   90 |         let mut ends = Vec::new();
   91 |         let mut open_run: Option<u32> = None;
   92 |         let mut offset: usize = 0;
   93 |         for &byte in bitmap.bytes() {
   94 |             let valid_bits = (span - offset).min(8);
   95 |             // Bits past `span` read as present so they never open a run.
   96 |             let mut present = byte | (u8::MAX.checked_shl(valid_bits as u32).unwrap_or(0));
   97 |             if present == u8::MAX {
   98 |                 if let Some(start) = open_run.take() {
   99 |                     starts.push(start);
  100 |                     ends.push(offset as u32);
  101 |                 }
  102 |             } else if present == 0 {
  103 |                 open_run.get_or_insert(offset as u32);
  104 |             } else {
  105 |                 for bit in 0..valid_bits {
  106 |                     let is_present = present & 1 != 0;
  107 |                     present >>= 1;
  108 |                     let here = (offset + bit) as u32;
  109 |                     match (is_present, open_run) {
  110 |                         (false, None) => open_run = Some(here),
  111 |                         (true, Some(start)) => {
  112 |                             starts.push(start);
  113 |                             ends.push(here);
  114 |                             open_run = None;
  115 |                         }
  116 |                         _ => {}
  117 |                     }
  118 |                 }
  119 |             }
  120 |             offset += 8;
  121 |             if offset >= span {
  122 |                 break;
  123 |             }
  124 |         }
  125 |         if let Some(start) = open_run {
  126 |             starts.push(start);
  127 |             ends.push(span as u32);
  128 |         }
  129 |         Self::try_new(span as u32, starts, ends).expect("runs derived from a bitmap are valid")
  130 |     }
  131 | 
  132 |     pub fn num_runs(&self) -> usize {
  133 |         self.starts.len()
  134 |     }
  135 | 
  136 |     /// Offsets present over the whole span.
  137 |     pub fn present_len(&self) -> u32 {
  138 |         self.present_before[self.starts.len()]
  139 |     }
  140 | 
  141 |     /// Start of run `k`, or the span end once the runs are exhausted.
  142 |     fn start_or_span(&self, k: usize) -> u32 {
  143 |         self.starts.get(k).copied().unwrap_or(self.span)
  144 |     }
  145 | 
  146 |     /// Offsets missing in runs `0..k`.
  147 |     fn missing_before(&self, k: usize) -> u32 {
  148 |         self.start_or_span(k) - self.present_before[k]
  149 |     }
  150 | 
  151 |     /// First offset after run `k`.
  152 |     fn end(&self, k: usize) -> u32 {
  153 |         self.starts[k] + (self.missing_before(k + 1) - self.missing_before(k))
  154 |     }
  155 | 
  156 |     /// Position of the present `offset`, or `None` when it is missing or out of range.
  157 |     pub fn position(&self, offset: u32) -> Option<u32> {
  158 |         if offset >= self.span {
  159 |             return None;
  160 |         }
  161 |         let k = self.starts.partition_point(|&start| start <= offset);
  162 |         if k > 0 && offset < self.end(k - 1) {
  163 |             return None;
  164 |         }
  165 |         Some(offset - self.missing_before(k))
  166 |     }
  167 | 
  168 |     /// Runs entirely before the present value at `position`.
  169 |     fn runs_before_position(&self, position: u32) -> usize {
  170 |         self.present_before[..self.starts.len()].partition_point(|&present| present <= position)
  171 |     }
  172 | 
  173 |     /// Offset of the present value at `position`.
  174 |     pub fn offset_at(&self, position: u32) -> Option<u32> {
  175 |         if position >= self.present_len() {
  176 |             return None;
  177 |         }
  178 |         let k = self.runs_before_position(position);
  179 |         Some(position + self.missing_before(k))
  180 |     }
  181 | 
  182 |     /// The present offsets, as the maximal ranges between runs.
  183 |     pub fn present_ranges(&self) -> impl DoubleEndedIterator<Item = Range<u32>> + '_ {
  184 |         (0..=self.starts.len())
  185 |             .map(move |k| {
  186 |                 let start = if k == 0 { 0 } else { self.end(k - 1) };
  187 |                 start..self.start_or_span(k)
  188 |             })
  189 |             .filter(|range| !range.is_empty())
  190 |     }
  191 | 
  192 |     /// Append `base + offset` for the present offsets at `positions`.
  193 |     ///
  194 |     /// Streaming readers materialize `_rowid` a batch at a time through this;
  195 |     /// walking the present ranges keeps that linear instead of a binary search
  196 |     /// per row.
  197 |     pub fn extend_values(&self, base: u64, positions: Range<u32>, values: &mut Vec<u64>) {
  198 |         let end = positions.end.min(self.present_len());
  199 |         let mut position = positions.start;
  200 |         let mut k = self.runs_before_position(position);
  201 |         while position < end && k <= self.starts.len() {
  202 |             // Present range between run k - 1 and run k, in offsets and positions.
  203 |             let gap_start = if k == 0 { 0 } else { self.end(k - 1) };
  204 |             let gap_end = self.start_or_span(k);
  205 |             let first_position = gap_start - self.missing_before(k);
  206 |             let gap_positions = first_position..first_position + (gap_end - gap_start);
  207 |             let take = position.max(gap_positions.start)..end.min(gap_positions.end);
  208 |             if !take.is_empty() {
  209 |                 let offset = gap_start + (take.start - gap_positions.start);
  210 |                 values.extend((base + offset as u64)..(base + offset as u64 + take.len() as u64));
  211 |                 position = take.end;
  212 |             }
  213 |             k += 1;
  214 |         }
  215 |     }
  216 | }
  217 | 
  218 | #[cfg(test)]
  219 | mod tests {
  220 |     use super::*;
  221 | 
  222 |     fn runs() -> HoleRuns {
  223 |         // span 20: present 0..3, missing 3..7, present 7..8, missing 8..15, present 15..20
  224 |         HoleRuns::try_new(20, vec![3, 8], vec![7, 15]).unwrap()
  225 |     }
  226 | 
  227 |     #[test]
  228 |     fn test_counts_and_ranges() {
  229 |         let runs = runs();
  230 |         assert_eq!(runs.span - runs.present_len(), 11);
  231 |         assert_eq!(runs.present_len(), 9);
  232 |         assert_eq!((0..2).map(|k| runs.end(k)).collect::<Vec<_>>(), vec![7, 15]);
  233 |         assert_eq!(
  234 |             runs.present_ranges().collect::<Vec<_>>(),
  235 |             vec![0..3, 7..8, 15..20]
  236 |         );
  237 |         assert_eq!(
  238 |             runs.present_ranges().rev().collect::<Vec<_>>(),
  239 |             vec![15..20, 7..8, 0..3]
  240 |         );
  241 |     }
  242 | 
  243 |     #[test]
  244 |     fn test_position_and_offset_round_trip() {
  245 |         let runs = runs();
  246 |         let present: Vec<u32> = runs.present_ranges().flatten().collect();
  247 |         assert_eq!(present, vec![0, 1, 2, 7, 15, 16, 17, 18, 19]);
  248 |         for (position, &offset) in present.iter().enumerate() {
  249 |             assert_eq!(
  250 |                 runs.position(offset),
  251 |                 Some(position as u32),
  252 |                 "offset {offset}"
  253 |             );
  254 |             assert_eq!(
  255 |                 runs.offset_at(position as u32),
  256 |                 Some(offset),
  257 |                 "position {position}"
  258 |             );
  259 |         }
  260 |         for missing in [3, 4, 6, 8, 14, 20, 100] {
  261 |             assert_eq!(runs.position(missing), None, "offset {missing}");
  262 |         }
  263 |         assert_eq!(runs.offset_at(9), None);
  264 |     }
  265 | 
  266 |     #[test]
  267 |     fn test_extend_values_crosses_runs() {
  268 |         let runs = runs();
  269 |         let mut values = Vec::new();
  270 |         runs.extend_values(100, 1..7, &mut values);
  271 |         assert_eq!(values, vec![101, 102, 107, 115, 116, 117]);
  272 |         values.clear();
  273 |         runs.extend_values(100, 4..40, &mut values);
  274 |         assert_eq!(values, vec![115, 116, 117, 118, 119]);
  275 |         values.clear();
  276 |         runs.extend_values(100, 9..12, &mut values);
  277 |         assert!(values.is_empty());
  278 |     }
  279 | 
  280 |     #[test]
  281 |     fn test_from_bitmap_matches_cleared_bits() {
  282 |         for (len, cleared) in [
  283 |             (20usize, vec![3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14]),
  284 |             (1, vec![0]),
  285 |             (9, vec![]),
  286 |             (17, vec![0, 16]),
  287 |             (64, (8..56).collect()),
  288 |             (70, vec![7, 8, 9, 15, 16, 63, 64, 65, 66, 67, 68, 69]),
  289 |         ] {
  290 |             let mut bitmap = Bitmap::new_full(len);
  291 |             for &offset in &cleared {
  292 |                 bitmap.clear(offset);
  293 |             }
  294 |             let runs = HoleRuns::from_bitmap(&bitmap);
  295 |             let missing: Vec<u32> = (0..len as u32)
  296 |                 .filter(|offset| runs.position(*offset).is_none())
  297 |                 .collect();
  298 |             assert_eq!(
  299 |                 missing,
  300 |                 cleared.iter().map(|&c| c as u32).collect::<Vec<_>>(),
  301 |                 "len {len}"
  302 |             );
  303 |             assert_eq!((runs.span - runs.present_len()) as usize, cleared.len());
  304 |             // Runs are maximal: each ends strictly before the next starts.
  305 |             for k in 1..runs.starts.len() {
  306 |                 assert!(runs.end(k - 1) < runs.starts[k]);
  307 |             }
  308 |         }
  309 |     }
  310 | 
  311 |     #[test]
  312 |     fn test_try_new_rejects_malformed_runs() {
  313 |         let cases: [(&str, Vec<u32>, Vec<u32>); 5] = [
  314 |             ("length mismatch", vec![1], vec![]),
  315 |             ("empty run", vec![3], vec![3]),
  316 |             ("beyond span", vec![3], vec![21]),
  317 |             ("overlapping", vec![3, 5], vec![7, 9]),
  318 |             ("adjacent", vec![3, 7], vec![7, 9]),
  319 |         ];
  320 |         for (name, starts, ends) in cases {
  321 |             let error = HoleRuns::try_new(20, starts, ends).unwrap_err();
  322 |             assert!(error.to_string().contains("Ranges"), "{name}: {error}");
  323 |         }
  324 |     }
  325 | }
``````
