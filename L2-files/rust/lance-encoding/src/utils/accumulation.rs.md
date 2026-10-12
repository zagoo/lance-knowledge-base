> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/utils/accumulation.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `67e7da9e9b6fe8593cf34474e562d9842e9200814d5e7e0636dfee2969aa8a21`. Reviewed physical lines: 1-105.

[Module](../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public synchronous queue accumulating Arrow arrays into page-sized groups, with optional copying and caller-supplied top-level row accounting. (rust/lance-encoding/src/utils/accumulation.rs:1-105)

## Complete range analysis

### Lines 1-9

SPDX/module docs; imports ArrayRef, deep_copy_array and debug/trace logging. No task spawn or IO dependency. (rust/lance-encoding/src/utils/accumulation.rs:1-9)

### Lines 10-23

Public Debug AccumulationQueue has private cache_bytes:u64,keep_original_array:bool,buffered_arrays:Vec<ArrayRef>,current_bytes:u64,row_number:u64,num_rows:u64,column_index:u32. row_number records first input row; num_rows counts supplied top-level rows, not necessarily array length. column_index only labels logs. (rust/lance-encoding/src/utils/accumulation.rs:10-23)

### Lines 24-36

Public new(cache_bytes,column_index,keep_original_array) initializes empty vector, zero byte/row counts and row_number=u64::MAX sentinel. No minimum capacity/size or column validation. (rust/lance-encoding/src/utils/accumulation.rs:24-36)

### Lines 37-49

Public insert owns ArrayRef and accepts row_number,num_rows; returns Option<(Vec<ArrayRef>,u64,u64)>. If sentinel, set first row; add supplied row count and array.get_array_memory_size() as u64. Ordinary additions can overflow; no ordering, contiguity, length or count validation. A legitimate first row u64::MAX collides with the sentinel. Accounting precedes copying and reflects Arrow-reported memory, not a strict serialized-byte budget. (rust/lance-encoding/src/utils/accumulation.rs:37-49)

### Lines 50-66

When current_bytes>cache_bytes (strict greater), log and append triggering array without copying even when keep_original_array=false. Save first-row/count, reset bytes/sentinel/rows, mem::take all arrays and return Some. Thus returned group includes the overshooting array; no array splitting or hard memory cap. Input order is preserved. (rust/lance-encoding/src/utils/accumulation.rs:50-66)

### Lines 67-80

At or below budget, trace and either retain original handle or deep-copy through lance_arrow, then push and return None. No Result/rollback mechanism; a panic during copy occurs after counters changed. Contextual deep_copy_array builds from recursively copied ArrayData with preserved type,length,offset and nulls; its safety relies on valid input ArrayData, not validation in this queue. (rust/lance-arrow/src/deepcopy.rs:35-77) (rust/lance-encoding/src/utils/accumulation.rs:67-80)

### Lines 81-105

Public flush returns None for empty buffer with trace and no state reset in that branch. Otherwise trace, save first row/count, reset bytes/sentinel/rows and take vector. Repeated successful drain then flush yields None. No automatic flush-on-drop, local tests, unsafe blocks, async lifecycle or locking. Structural FieldEncoder caller keeps rep/def builders separately and drains them with these arrays into do_flush; this queue does not encode or persist a page itself. (rust/lance-encoding/src/encodings/logical/primitive.rs:7976-8007) (rust/lance-encoding/src/utils/accumulation.rs:81-105)

## Interaction and interpretation limits

All physical lines were read in bounded source outputs during ANALYZE72. Offline, read-only inspection; no Lance build, test, lint, benchmark, generator or dependency installation ran. Exact declarations are preserved below and in the symbol index. Other files are only covered at cited contextual ranges; no whole-crate completion or runtime validation is implied.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! An accumulation queue accumulates arrays until we have enough data to flush.
    5 | 
    6 | use arrow_array::ArrayRef;
    7 | use lance_arrow::deepcopy::deep_copy_array;
    8 | use log::{debug, trace};
    9 | 
   10 | #[derive(Debug)]
   11 | pub struct AccumulationQueue {
   12 |     cache_bytes: u64,
   13 |     keep_original_array: bool,
   14 |     buffered_arrays: Vec<ArrayRef>,
   15 |     current_bytes: u64,
   16 |     // Row number of the first item in buffered_arrays, reset on flush
   17 |     row_number: u64,
   18 |     // Number of top level rows represented in buffered_arrays, reset on flush
   19 |     num_rows: u64,
   20 |     // This is only for logging / debugging purposes
   21 |     column_index: u32,
   22 | }
   23 | 
   24 | impl AccumulationQueue {
   25 |     pub fn new(cache_bytes: u64, column_index: u32, keep_original_array: bool) -> Self {
   26 |         Self {
   27 |             cache_bytes,
   28 |             buffered_arrays: Vec::new(),
   29 |             current_bytes: 0,
   30 |             column_index,
   31 |             keep_original_array,
   32 |             row_number: u64::MAX,
   33 |             num_rows: 0,
   34 |         }
   35 |     }
   36 | 
   37 |     /// Adds an array to the queue, if there is enough data then the queue is flushed
   38 |     /// and returned
   39 |     pub fn insert(
   40 |         &mut self,
   41 |         array: ArrayRef,
   42 |         row_number: u64,
   43 |         num_rows: u64,
   44 |     ) -> Option<(Vec<ArrayRef>, u64, u64)> {
   45 |         if self.row_number == u64::MAX {
   46 |             self.row_number = row_number;
   47 |         }
   48 |         self.num_rows += num_rows;
   49 |         self.current_bytes += array.get_array_memory_size() as u64;
   50 |         if self.current_bytes > self.cache_bytes {
   51 |             debug!(
   52 |                 "Flushing column {} page of size {} bytes (unencoded)",
   53 |                 self.column_index, self.current_bytes
   54 |             );
   55 |             // Push into buffered_arrays without copy since we are about to flush anyways
   56 |             self.buffered_arrays.push(array);
   57 |             self.current_bytes = 0;
   58 |             let row_number = self.row_number;
   59 |             self.row_number = u64::MAX;
   60 |             let num_rows = self.num_rows;
   61 |             self.num_rows = 0;
   62 |             Some((
   63 |                 std::mem::take(&mut self.buffered_arrays),
   64 |                 row_number,
   65 |                 num_rows,
   66 |             ))
   67 |         } else {
   68 |             trace!(
   69 |                 "Accumulating data for column {}.  Now at {} bytes",
   70 |                 self.column_index, self.current_bytes
   71 |             );
   72 |             if self.keep_original_array {
   73 |                 self.buffered_arrays.push(array);
   74 |             } else {
   75 |                 self.buffered_arrays.push(deep_copy_array(array.as_ref()))
   76 |             }
   77 |             None
   78 |         }
   79 |     }
   80 | 
   81 |     pub fn flush(&mut self) -> Option<(Vec<ArrayRef>, u64, u64)> {
   82 |         if self.buffered_arrays.is_empty() {
   83 |             trace!(
   84 |                 "No final flush since no data at column {}",
   85 |                 self.column_index
   86 |             );
   87 |             None
   88 |         } else {
   89 |             trace!(
   90 |                 "Final flush of column {} which has {} bytes",
   91 |                 self.column_index, self.current_bytes
   92 |             );
   93 |             self.current_bytes = 0;
   94 |             let row_number = self.row_number;
   95 |             self.row_number = u64::MAX;
   96 |             let num_rows = self.num_rows;
   97 |             self.num_rows = 0;
   98 |             Some((
   99 |                 std::mem::take(&mut self.buffered_arrays),
  100 |                 row_number,
  101 |                 num_rows,
  102 |             ))
  103 |         }
  104 |     }
  105 | }
``````
