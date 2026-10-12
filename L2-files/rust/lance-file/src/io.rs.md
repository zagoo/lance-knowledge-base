> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-file/src/io.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `0063ae7defa3ec3a3c1002cbddddb3686bdc620f7527795a9cb7fdca6c3fd8f2`. Reviewed physical lines: 1-148.

[Module](../../../../L1-modules/rust-lance-file-runtime.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

LanceEncodingsIo is the publicly reexported adapter from encoding single-file byte-range requests to FileScheduler, including range splitting, empty placeholders and reassembly. (rust/lance-file/src/io.rs:1-148)

## Complete range analysis

### Lines 1-18

SPDX/imports connect Arc, boxed futures, EncodingsIo, FileScheduler and DEFAULT_READ_CHUNK_SIZE. Public Debug LanceEncodingsIo privately owns scheduler and u64 chunk size; the io module is crate-visible but the type is reexported at crate root. No Clone/Default here. (rust/lance-file/src/io.rs:1-18)

### Lines 19-32

new takes ownership of FileScheduler and uses DEFAULT_READ_CHUNK_SIZE, whose actual value is8*1024*1024 bytes (rust/lance-file/src/reader.rs:56-58). Consuming with_read_chunk_size stores any u64 without validation, including zero. (rust/lance-file/src/io.rs:19-32)

### Lines 33-50

Trait overrides always return Some(Arc<dyn EncodingsIo>) for backpressure bypass and per-scope stats, cloning/reconfiguring the scheduler and retaining chunk size. Underlying contextual methods set bypass=true or replace the optional extra recorder on a cloned handle without reopening (rust/lance-io/src/scheduler.rs:1327-1352). Existing normal handle is unchanged. (rust/lance-file/src/io.rs:33-50)

### Lines 51-76

submit_request takes owned ranges and priority, returns a static boxed Result future. It synchronously builds split ranges and origin indices. Equal start/end skips a scheduler range and sets reassembly=true. Reversed ranges are not rejected before unchecked end-start (debug underflow or wrapped release arithmetic). The TODO about considering chunk size coexists with current splitting logic. (rust/lance-file/src/io.rs:51-76)

### Lines 77-97

For size>chunk limit, num_chunks=ceil(size/limit), base size=floor(size/num_chunks); every chunk except last has base size and last takes remainder. Thus the last chunk can exceed the configured limit: size10,limit3 yields lengths2,2,2,4. Zero limit with any nonempty valid range divides by zero. Otherwise retain the original range. Preserve original iteration order; do not sort or deduplicate overlaps. Metadata memory scales with the number of generated chunks. (rust/lance-file/src/io.rs:77-97)

### Lines 98-113

Invoke scheduler.submit_request synchronously even when there are no nonempty ranges, then await its future in the returned async block. Propagate IO errors first; require result count==split_indices count or Internal with both counts. If no split/empty range needs reassembly, return scheduler Vec directly. Scheduler validates start ordering of the actual split requests and can coalesce/re-split them (rust/lance-io/src/scheduler.rs:1195-1264); splitting alone does not establish physical IOP sizes or cancellation behavior. (rust/lance-file/src/io.rs:98-113)

### Lines 114-136

Allocate one Vec<Bytes> per original range, distribute results by stored origin index, and rebuild in original range order. No chunks for an equal-endpoint input becomes Bytes::new; no chunks for a nonempty range is Internal with bounds. One chunk is cheaply cloned. This retains original empty positions even though the scheduler never sees those ranges; it does not validate each returned byte length. (rust/lance-file/src/io.rs:114-136)

### Lines 137-148

Multiple chunks sum actual lengths using ordinary usize arithmetic, allocate combined Vec, copy every byte in chunk order and convert to Bytes. Reassembly retains received buffers while allocating/copying output, with no streaming output/backpressure here. Return one output per original range and box the async block. No local tests, explicit spawned tasks or cancellation handler in this file; scheduler/root cancellation remains a separate contract. (rust/lance-file/src/io.rs:137-148)

## Interaction and interpretation limits

All148 lines read. EncodingsIo interface obligations were contextually read at rust/lance-encoding/src/lib.rs:34-104; FileScheduler request/reassembly and handle options at rust/lance-io/src/scheduler.rs:1181-1367. Whole dependency files and all consumer tests remain pending; do not infer full scheduler lifetimes from this adapter.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::sync::Arc;
    5 | 
    6 | use futures::{FutureExt, future::BoxFuture};
    7 | use lance_encoding::EncodingsIo;
    8 | use lance_io::scheduler::FileScheduler;
    9 | 
   10 | use super::reader::DEFAULT_READ_CHUNK_SIZE;
   11 | 
   12 | #[derive(Debug)]
   13 | pub struct LanceEncodingsIo {
   14 |     scheduler: FileScheduler,
   15 |     /// Size of chunks when reading large pages
   16 |     read_chunk_size: u64,
   17 | }
   18 | 
   19 | impl LanceEncodingsIo {
   20 |     pub fn new(scheduler: FileScheduler) -> Self {
   21 |         Self {
   22 |             scheduler,
   23 |             read_chunk_size: DEFAULT_READ_CHUNK_SIZE,
   24 |         }
   25 |     }
   26 | 
   27 |     pub fn with_read_chunk_size(mut self, read_chunk_size: u64) -> Self {
   28 |         self.read_chunk_size = read_chunk_size;
   29 |         self
   30 |     }
   31 | }
   32 | 
   33 | impl EncodingsIo for LanceEncodingsIo {
   34 |     fn with_bypass_backpressure(&self) -> Option<Arc<dyn EncodingsIo>> {
   35 |         Some(Arc::new(Self {
   36 |             scheduler: self.scheduler.with_bypass_backpressure(),
   37 |             read_chunk_size: self.read_chunk_size,
   38 |         }))
   39 |     }
   40 | 
   41 |     fn with_io_stats(
   42 |         &self,
   43 |         stats: Arc<dyn lance_core::utils::io_stats::IoStatsRecorder>,
   44 |     ) -> Option<Arc<dyn EncodingsIo>> {
   45 |         Some(Arc::new(Self {
   46 |             scheduler: self.scheduler.with_io_stats(stats),
   47 |             read_chunk_size: self.read_chunk_size,
   48 |         }))
   49 |     }
   50 | 
   51 |     fn submit_request(
   52 |         &self,
   53 |         ranges: Vec<std::ops::Range<u64>>,
   54 |         priority: u64,
   55 |     ) -> BoxFuture<'static, lance_core::Result<Vec<bytes::Bytes>>> {
   56 |         let mut split_ranges = Vec::new();
   57 |         let mut split_indices = Vec::new(); // Track which original range each split came from
   58 |         // Large ranges (above read_chunk_size) will be split into
   59 |         // multiple reads.  Empty ranges will skip the I/O layer
   60 |         // entirely.  If we have either of these we will need to
   61 |         // reassemble our results, inserting empties and merging parts
   62 |         let mut needs_reassembly = false;
   63 | 
   64 |         // Split large ranges into smaller chunks
   65 |         //
   66 |         // TODO: consider read_chunk_size before submitting requests.
   67 |         for (idx, range) in ranges.iter().enumerate() {
   68 |             if range.start == range.end {
   69 |                 // EncodingsIo requires one result per input range. Zero-length
   70 |                 // ranges schedule no I/O, so their empty results are restored
   71 |                 // after the non-empty requests complete.
   72 |                 needs_reassembly = true;
   73 |                 continue;
   74 |             }
   75 |             let range_size = range.end - range.start;
   76 | 
   77 |             if range_size > self.read_chunk_size {
   78 |                 needs_reassembly = true;
   79 |                 let num_chunks = range_size.div_ceil(self.read_chunk_size);
   80 |                 let chunk_size = range_size / num_chunks;
   81 | 
   82 |                 for i in 0..num_chunks {
   83 |                     let start = range.start + i * chunk_size;
   84 |                     let end = if i == num_chunks - 1 {
   85 |                         range.end // Last chunk gets any remaining bytes
   86 |                     } else {
   87 |                         start + chunk_size
   88 |                     };
   89 |                     split_ranges.push(start..end);
   90 |                     split_indices.push(idx);
   91 |                 }
   92 |             } else {
   93 |                 split_ranges.push(range.clone());
   94 |                 split_indices.push(idx);
   95 |             }
   96 |         }
   97 | 
   98 |         let fut = self.scheduler.submit_request(split_ranges, priority);
   99 | 
  100 |         async move {
  101 |             let split_results = fut.await?;
  102 | 
  103 |             if split_results.len() != split_indices.len() {
  104 |                 return Err(lance_core::Error::internal(format!(
  105 |                     "Encoding I/O returned {} results for {} requested range chunks",
  106 |                     split_results.len(),
  107 |                     split_indices.len()
  108 |                 )));
  109 |             }
  110 |             if !needs_reassembly {
  111 |                 return Ok(split_results);
  112 |             }
  113 | 
  114 |             let mut results = vec![Vec::new(); ranges.len()];
  115 | 
  116 |             for (split_result, orig_idx) in split_results.into_iter().zip(split_indices) {
  117 |                 results[orig_idx].push(split_result);
  118 |             }
  119 | 
  120 |             let mut reassembled = Vec::with_capacity(ranges.len());
  121 |             for (range, chunks) in ranges.iter().zip(results) {
  122 |                 if chunks.is_empty() {
  123 |                     if range.start == range.end {
  124 |                         reassembled.push(bytes::Bytes::new());
  125 |                         continue;
  126 |                     }
  127 |                     return Err(lance_core::Error::internal(format!(
  128 |                         "Encoding I/O returned no data for non-empty range {}..{}",
  129 |                         range.start, range.end
  130 |                     )));
  131 |                 }
  132 |                 if chunks.len() == 1 {
  133 |                     reassembled.push(chunks[0].clone());
  134 |                     continue;
  135 |                 }
  136 | 
  137 |                 let total_size: usize = chunks.iter().map(|c| c.len()).sum();
  138 |                 let mut combined = Vec::with_capacity(total_size);
  139 |                 for chunk in chunks {
  140 |                     combined.extend_from_slice(&chunk);
  141 |                 }
  142 |                 reassembled.push(bytes::Bytes::from(combined));
  143 |             }
  144 |             Ok(reassembled)
  145 |         }
  146 |         .boxed()
  147 |     }
  148 | }
``````
